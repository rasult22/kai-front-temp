
import AnimatingContainer from "@/components/animating-container";
import { Button } from "@/components/base/buttons/button";
import MarkdownText from "@/components/base/markdown-text/markdown-text";
import { AiDiagnosticsResult } from "@/queries/ai-diagnostics";
import WebApp from "@twa-dev/sdk";
import { File05, Home01, Stars02 } from "@untitledui/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Compressor from "compressorjs";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { useUserData } from "@/queries/user";

const AIDiagnosticsResultScreen = () => {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const{data: userData} =useUserData()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGeneratePdf = async () => {
    if (contentRef.current) {
      setIsLoading(true);
      try {
        const original = contentRef.current as HTMLElement;
        const clone = original.cloneNode(true) as HTMLElement;
        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.left = "-10000px";
        wrapper.style.top = "0";
        wrapper.style.color = "#fff";
        wrapper.style.backgroundColor = 'black'
        wrapper.style.width = `${original.scrollWidth}px`;
        clone.style.width = `${original.scrollWidth}px`;
        clone.style.height = "auto";
        clone.style.maxHeight = "none";
        clone.style.width = '800px'
        clone.style.overflow = "visible";
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);
        const canvas = await html2canvas(clone, { scale: 5, useCORS: true });
        document.body.removeChild(wrapper);
        const canvasBlob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.7));
        const compressedBlob: Blob = await new Promise((res, rej) => {
          new Compressor(canvasBlob, {
            quality: 0.9,
            maxWidth: 1900,
            maxHeight: 1900,
            mimeType: "image/jpeg",
            success(result) {
              res(result as Blob);
            },
            error(err) {
              rej(err);
            },
          });
        });
        const imgData = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result as string);
          reader.onerror = rej;
          reader.readAsDataURL(compressedBlob);
        });
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
  
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        const pdfBlob = pdf.output("blob");
        const file = new File([pdfBlob], "ai-diagnostics-result.pdf", { type: pdfBlob.type });
        // window.open(URL.createObjectURL(file))
        try {
          if (WebApp.initDataUnsafe.user?.id || userData?.telegram_id) {
            const botToken = '8101236504:AAHoGcUpuWgQllOr7WIYYM7RS_BYGUp8hpM'
            const formData = new FormData();
            formData.append("chat_id", `${WebApp.initDataUnsafe.user?.id || userData?.telegram_id}`);
            formData.append("caption", `Ваши результаты AI-диагностики готовы!`);
            formData.append("document", file); // file = Blob или File
            console.log('sending file')
            await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                method: "POST",
                body: formData
            });
          } 
        } catch (e){
          console.log(e)
        }
        if (navigator.share) {
          try {
            await navigator.share({
              files: [file],
              title: 'Результаты AI Диагностики',
              text: 'Поделитесь результатами AI Диагностики',
            });
            console.log('PDF успешно отправлен через Web Share API');
          } catch (error) {
            WebApp.showAlert('Мы отправим вам PDF файл с результатами AI Диагностики')
            // WebApp.downloadFile({
            //   url: URL.createObjectURL(file),
            //   file_name: 'ai-diagnostics-result.pdf'
            // });
            console.error('Ошибка при использовании Web Share API:', error);
          }
        } else {
          console.log('Web Share API не поддерживается в этом браузере.');
          WebApp.showAlert('Мы отправим вам PDF файл с результатами AI Диагностики')
        }
      } catch (e) {
        setError(`Ошибка_v2: ${(e as any)?.message || e}`)
      } finally {
        setIsLoading(false);
      }
    }
  };
  const [searchParams] = useSearchParams();
  const data = searchParams.get("data");

  if (data) {
    localStorage.setItem('ai_diagnostics_result', data)
  }
  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        navigate(-1)
    })
  }, [])
  if (!data) {
    return <AnimatingContainer className="flex h-dvh flex-col text-primary bg-bg-primary items-center justify-center" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
          <div className="text-text-error-primary">
            Ошибка получения результатов
          </div>
        </AnimatingContainer>
  }
  const results: AiDiagnosticsResult = JSON.parse(data)
  console.log(results);
    return (
        <AnimatingContainer className="flex h-dvh flex-col text-primary bg-bg-primary " style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
          { isLoading && <div className='fixed flex flex-col items-center justify-center top-0 left-0 w-full h-[100vh] bg-black/80 z-[10000]'>
            <LoadingIndicator size='lg'/>
            <div className="mt-3 text-[14px] leading-[20px]">Пожалуйста подождите.</div>
            <div className="text-[14px] leading-[20px]">Идет обработка данных...</div>
          </div>}
          {
            error && <div className="text-text-error-primary">Ошибка: {error}</div>
          }
          <div ref={contentRef} className="flex-1 flex flex-col overflow-auto p-6 bg-bg-primary">
            <div className="flex flex-col gap-3">
              <Stars02 className="text-fg-brand-secondary" size={24}/>
              <div className="text-[24px] leading-[32px] text-fg-brand-secondary font-semibold">Результаты диагностики</div>
            </div>

            <div className="text-[18px] leading-[28px] font-semibold mt-8">{results.maturity_level.title}</div>
            <div className="text-[14px] leading-[20px] mt-2 whitespace-pre-wrap">
              <MarkdownText text={results.maturity_level.description} />
            </div>
            <div className="text-[18px] leading-[28px] font-semibold mt-8">{results.short_desc_of_current_state.title}</div>
            <div className="text-[14px] leading-[20px] mt-2 whitespace-pre-wrap">
              <MarkdownText text={results.short_desc_of_current_state.description} />
            </div>
            <div className="text-[18px] leading-[28px] font-semibold mt-8">{results.short_swot_analysis.title}</div>
            <div className="text-[14px] leading-[20px] mt-2 whitespace-pre-wrap">
              <MarkdownText text={results.short_swot_analysis.description} />
            </div>
            <div className="text-[18px] leading-[28px] font-semibold mt-8">{results.strategy_recommendation.title}</div>
            <div className="text-[14px] leading-[20px] mt-2 whitespace-pre-wrap">
              <MarkdownText text={results.strategy_recommendation.description} />
            </div>
          </div>
          <div className="pt-2 pb-6 px-6 flex flex-col gap-4">
            <Button iconLeading={<File05 className="text-button-primary-icon" size={20} />} className="w-full" size="xl" onClick={handleGeneratePdf}>
              Скачать PDF
            </Button>
            <Button iconLeading={<Home01 className="text-fg-quaternary" size={20} />} className="w-full" color="secondary" size="xl" onClick={() => {
              navigate('/', {
                replace: true
              })
            }}>
              На главную
            </Button>
          </div>
        </AnimatingContainer>
    );
};

export default AIDiagnosticsResultScreen;