import { ButtonUtility } from "@/components/base/buttons/button-utility";
import WebApp from "@twa-dev/sdk";
import { ArrowLeft, Stars02 } from "@untitledui/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { FileUpload, /* getReadableFileSize */ } from "@/components/application/file-upload/file-upload-base";
import { Key } from "react-aria";
import { Tabs } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import AnimatingContainer from "@/components/animating-container";
import { MOTIONS } from "@/utils/motions";
import { uploadImageAndGetUrl } from "@/queries/higgsfield";
import Compressor from "compressorjs";
import { LoadingScreen } from "./create-video-result-screen";
interface UploadedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    progress: number;
    failed?: boolean;
}
// const STYLES = MOTIONS.filter(motion => !motion.start_end_frame)
const STYLES = MOTIONS

const CreateVideoScreen = () => {
  const [selectedStyle, setSelectedStyle] = useState<typeof STYLES[0]>(STYLES[0])
  const [imageUrl, setImageUrl] = useState<string>()
  const [generateStatus, setGenerateStatus] = useState<'initial' | 'start'>('initial')
  const generateIsAllowed = imageUrl && selectedStyle
  const navigate = useNavigate()
  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        navigate(-1)
    })
  }, [])
  const onGenerate = () => {
    setGenerateStatus('start')
  }
  if (generateStatus === 'start' && imageUrl && selectedStyle.id) {
    return <LoadingScreen key={selectedStyle.id} style_name={selectedStyle.name} image_url={imageUrl} motion_id={selectedStyle.id} />
  }
    return (
        <AnimatingContainer className="flex h-dvh flex-col text-primary" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: 24 + WebApp.safeAreaInset.bottom}}>
          <Header />
          <div className="bg-bg-primary flex-1 p-4 overflow-auto">
            <div className="font-medium mb-3">Загрузите фото</div>
            <FileUploadProgressBar onUploadComplete={(url) => setImageUrl(url)} />
            {/* <div className="font-medium my-3">Формат видео</div>
            <FormatVideoTabs /> */}
            {/* <div className="font-medium my-3">Длина видео</div>
            <div>
                <Button color="secondary" disabled>
                    5 секунд
                </Button>
            </div> */}
            {imageUrl && <img src={imageUrl} className="w-full rounded-[12px] max-w-[200px] my-4 mx-auto"/>}
            <div className="font-medium my-3">Стиль видео</div>
            <div className="columns-2 md:columns-3 gap-2">
              {
                STYLES.map((style) => (
                  <div key={style.id} className="break-inside-avoid mb-2">
                    <StyleCard
                      label={style.name}
                      imageSrc={style.preview_url}
                      selected={style.id === selectedStyle.id}
                      onClick={() => setSelectedStyle(style)}
                    />
                  </div>
                ))
              }
            </div>
          </div>
            <div className="mt-4 px-4">
                {
                    generateIsAllowed && <Button onClick={onGenerate} iconLeading={<Stars02 size={20} className="text-button-primary-icon" />} className="w-full" size="xl">Сгенерировать</Button>
                }
                {!generateIsAllowed
                &&
                <Button color="secondary" iconLeading={<Stars02 size={20} className="text-fg-quaternary" />} className="w-full" size="xl">Сгенерировать</Button>
                }
            </div>
        </AnimatingContainer>
    );
};

export default CreateVideoScreen;

function Header() {
    const navigate = useNavigate();

    return <div className="py-2 px-4 flex justify-between items-center">
        <ButtonUtility onClick={() => navigate(-1)} color="tertiary" icon={<ArrowLeft size={20} data-icon />} />
        <div className="flex flex-col justify-center items-center font-medium text-[16px] leading-[24px] text-primary">
          Генерация видео
        </div>
        <ButtonUtility className="opacity-0" icon={<ArrowLeft size={20} data-icon />} />
    </div>
}


const uploadFile = async (file: File, onProgress: (progress: number) => void) => {
    const compressedFile: File = await new Promise((res, rej) => {
        new Compressor(file, {
        quality: 0.8,
        maxWidth: 1600,
        maxHeight: 1600,
        mimeType: "image/jpeg",
        success(result) {
            const compressedFile = new File([result], file.name, {
                type: result.type,
                lastModified: Date.now(),
            });
            res(compressedFile)
        },
        error() {
            rej('Compression failed')
        }
    })
    })
    
    // Add your upload logic here...
    let progress = 0;
    const interval = setInterval(() => {
        if (progress === 100) {
            clearInterval(interval);
            return
        }
        onProgress(++progress);
        if (progress === 80) {
            clearInterval(interval);
        }
    }, 100);
    const imageUrl = await uploadImageAndGetUrl(compressedFile)
    progress = 100;
    onProgress(progress);
    return imageUrl
    // This is dummy upload logic
};


export const FileUploadProgressBar = (props: { isDisabled?: boolean, onUploadComplete: (url: string) => void }) => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const handleDropFiles = (files: FileList) => {
        const newFiles = Array.from(files);
        const newFilesWithIds = newFiles.map((file) => ({
            id: Math.random().toString(),
            name: Math.random().toString() + file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            fileObject: file,
        }));

        setUploadedFiles([...newFilesWithIds.map(({ fileObject: _, ...file }) => file)]);

        newFilesWithIds.forEach(async ({ id, fileObject }) => {
            const imageUrl = await uploadFile(fileObject, (progress) => {
                setUploadedFiles((prev) => prev.map((uploadedFile) => (uploadedFile.id === id ? { ...uploadedFile, progress } : uploadedFile)));
            });
            props.onUploadComplete(imageUrl)
        });
    };

    const handleDeleteFile = (id: string) => {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const handleRetryFile = (id: string) => {
        const file = uploadedFiles.find((file) => file.id === id);
        if (!file) return;

        uploadFile(new File([], file.name, { type: file.type }), (progress) => {
            setUploadedFiles((prev) => prev.map((uploadedFile) => (uploadedFile.id === id ? { ...uploadedFile, progress, failed: false } : uploadedFile)));
        });
    };

    return (
        <FileUpload.Root>
            <FileUpload.DropZone allowsMultiple={false} hint="Формат: JPG, JPEG, PNG. Размер файла: до 64 МБ" isDisabled={props.isDisabled} onDropFiles={handleDropFiles} accept="image/*" />

            <FileUpload.List>
                {uploadedFiles.map((file) => (
                    <FileUpload.ListItemProgressBar
                        key={file.id}
                        {...file}
                        size={file.size}
                        onDelete={() => handleDeleteFile(file.id)}
                        onRetry={() => handleRetryFile(file.id)}
                    />
                ))}
            </FileUpload.List>
        </FileUpload.Root>
    );
};


const tabs = [
    { id: "horizontal", label: "Горизонтальный" },
    { id: "vertical", label: "Вертикальный" },
];
 
export const FormatVideoTabs = () => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<Key>("horizontal");
 
    return (
        <>
          <Tabs selectedKey={selectedTabIndex} onSelectionChange={setSelectedTabIndex} className="w-full">
              <Tabs.List size="sm" fullWidth type="button-minimal" items={tabs}>
                  {(tab) => <Tabs.Item {...tab} />}
              </Tabs.List>
          </Tabs>
        </>
    );
};

const StyleCard = ({imageSrc = '/style-image.png', label = 'cyberpunk', selected = false, onClick = () => {}}: {selected?: boolean, onClick?: () => void, imageSrc?: string, label?: string}) => {
    return (
        <button onClick={onClick} className={`p-1 bg-bg-primary text-white flex flex-col active:scale-[0.98] active:opacity-80 transition-all border-2 rounded-[10px] ${selected ? 'border-border-brand shadow-[0_0_20px_rgba(127,86,217,0.48)]' : 'border-transparent'}`}>
            <img className="rounded-[8px] bg-secondary-solid w-full" src={imageSrc} width={150} height={150} alt="" />
            <div className="text-center font-semibold text-[12px] leading-[18px] mt-[10px]">{label}</div> 
        </button>
    )
}