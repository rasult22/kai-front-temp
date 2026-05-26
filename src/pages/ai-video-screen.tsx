import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Toggle } from "@/components/base/toggle/toggle";
import { VideoPlayer } from "@/components/base/video-player/video-player";
import { User, useUserData } from "@/queries/user";
import { setPublic } from "@/queries/videos";
import { useQuery } from "@tanstack/react-query";
import WebApp from "@twa-dev/sdk";
import { DotsVertical, Download01, Eye, Loading03, Share06, Star06 } from "@untitledui/icons";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
type VideoType = {
 url: string; name: string | null; date: string; thumbnail: string | null; record_id: string, public: boolean
}
export const AIVideoScreen = () => {
    const [showVideoOptionsModal, setShowVideoOptionsModal] = useState<VideoType>();
    const {isLoading, data: userData} = useUserData()

    const {data, isLoading: isLoading2} = useQuery<{items:{
        id: string,
        date: string,
        public: boolean,
        style_name: string,
        tg_id: string,
        user: User,
        video_thumbnail: string,
        video_url: string
    }[]}>({
        queryKey: ['my_video'],
        queryFn: () => {
            return fetch(`https://rasult22.pockethost.io/api/collections/kai_videos/records?sort=-created&filter=tg_id='${WebApp.initDataUnsafe.user?.id || userData?.telegram_id}'`)
               .then(res => res.json())
        }
    })
    const {data:feed, isLoading: isLoading3} = useQuery<{items: {
        id: string,
        date: string,
        public: boolean,
        style_name: string,
        tg_id: string,
        user: User,
        video_thumbnail: string,
        video_url: string
    }[]}>({
        queryKey: ['feed'],
        queryFn: () => {
            return fetch(`https://rasult22.pockethost.io/api/collections/kai_videos/records?sort=-created&filter=public=true`)
                .then(res => res.json())
        }
    })

    if (isLoading || isLoading2 || isLoading3) {
        <div className="flex-1 overflow-auto flex flex-col text-primary pb-8 bg-bg-primary">
            <div>
                <Loading03 size={48} className="animate-spin text-fg-brand-secondary"/>
            </div>
        </div>
    }
    return (
        <div className="flex-1 overflow-auto flex flex-col text-primary pb-8 bg-bg-primary">
            <AnimatePresence>
                {showVideoOptionsModal && <VideoOptionsModal video={showVideoOptionsModal} onClose={() => setShowVideoOptionsModal(undefined)} />}
            </AnimatePresence>
            <div className="px-4 pt-4">
                <div className="flex items-center gap-2">
                    <div className="font-semibold text-[24px] leading-[32px]">AI видео</div>
                    <Star06 size={24} className="text-fg-brand-secondary"/>
                </div>
                <div className="text-text-secondary mt-3">Создайте себе веселый и стильный видеоролик на память</div>
            </div>
            <div className="px-4 mt-6 font-medium">Мои генерации</div>
            <div className="overflow-x-auto mt-3 shrink-0 flex items-start gap-3 pb-4 pr-4">
                <GenerateCard />
                {data && data.items.map(video => {
                    return <MyVideoCard src={video.video_url} thumbnail={video.video_thumbnail || ''} style={video.style_name || ''} date={video.date}  key={video.video_url} onOptionsClick={() => {
                        setShowVideoOptionsModal({
                            url: video.video_url,
                            name: video.style_name,
                            date: video.date,
                            thumbnail: video.video_thumbnail,
                            record_id: video.id,
                            public: video.public,
                        });
                    }} />
                })}
            </div>
            <div className="px-4 mt-6 font-medium">Видео от участников</div>
            <div className="mt-4 gap-4 flex flex-col">
                {feed && feed.items.map(video => {
                    return <ParticipantVideoCard src={video.video_url} user={video.user} thumbnail={video.video_thumbnail || ''} style={video.style_name || ''} date={video.date}  key={video.video_url} />
                })}
            </div>
            {feed && feed.items.length < 1 &&
                <div className="mt-4 gap-4 flex flex-col text-center">
                    Нет данных
                </div>} 
        </div>
    );
};

const GenerateCard = () => {
    const navigate = useNavigate()
    return (
    <button onClick={() => navigate('/create-video')} className="transition-all active:scale-95 active:opacity-85 bg-utility-brand-50 p-8 shrink-0 ml-4 max-w-[228px] flex flex-col items-center justify-center border-dashed border-2 border-border-brand rounded-[8px] aspect-[228/151]">
        <Star06 size={24} className="text-fg-brand-secondary"/>
        <div className="text-text-primary font-semibold text-[14px] leading-[20px] mt-2">
            Сгенерировать видео
        </div>
        <div className="text-text-tertiary text-[12px] leading-[18px] mt-2">
            Стилизуйте свое видео
        </div>
    </button>)
}

const MyVideoCard = ({onOptionsClick, src, thumbnail, style, date}: {onOptionsClick: () => void, src: string, thumbnail: string, style: string, date: string}) => {
    return (
        <div className="shrink-0">
            <VideoPlayer
                size="sm"
                loop={true}
                src={src}
                thumbnailUrl={thumbnail}
                className="aspect-video w-full max-w-80 overflow-hidden rounded-lg"
            />
            <div className="flex justify-between mt-2">
                <div>
                    <div className="font-semibold text-[12px] leading-[18px]">Видео в стиле “{style}”</div>
                    <div className="text-[12px] leading-[18px] text-text-tertiary mt-1">{new Date(date).toLocaleDateString()}</div>
                </div>
                <Button color="tertiary" onClick={onOptionsClick}>
                    <DotsVertical />
                </Button>
            </div>
        </div>
    )
}

export const ParticipantVideoCard = ({src, thumbnail, style, date, user}: {src: string, thumbnail: string, style: string, date: string, user: User}) => {
    return (
        <div>
            <VideoPlayer
                loop
                src={src}
                thumbnailUrl={thumbnail}
                className="aspect-video w-full overflow-hidden"
            />
            <div className="flex items-center gap-2 mt-2 px-3">
                <Avatar size="md" src={user.photo_url} />
                <div>
                    <div>Видео в стиле “{style}”</div>
                    <div className="text-[12px] leading-[18px] text-text-tertiary mt-1 flex gap-1"  >
                        <div>{user.fullname}</div>
                        <div>{new Date(date).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const VideoOptionsModal = ({onClose,video}: {onClose: () => void, video: VideoType}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPublic, setIsPublic] = useState(video.public);
   
    const downloadVideo = async () => {
        if(isDownloading) {
            return;
        }
        setIsDownloading(true);
        
        try {
            // Скачиваем файл
            const response = await fetch(video.url);
            const blob = await response.blob();
            
            // Создаем файл с правильным именем и типом
            const file = new File([blob], `ai-video-${video.name || 'personal'}.mp4`, { type: "video/mp4" });
            
            // Проверяем поддержку Share API
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `AI видео в стиле ${video.name}`,
                    text: 'Посмотрите мое AI видео!'
                });
            } else {
                // Fallback: показываем сообщение об ошибке или используем альтернативный метод
                WebApp.showAlert("Ваш браузер не поддерживает функцию分享. Используйте длительное нажатие на видео для сохранения.");
            }
        } catch (error) {
            console.error('Ошибка при分享видео:', error);
            WebApp.showAlert("Не удалось分享видео. Попробуйте еще раз.");
        } finally {
            setIsDownloading(false);
        }
    }
    const shareVideo = async () => {
        const videoUrl = video.url;
        const videoTitle = `AI видео в стиле ${video.name}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: videoTitle,
                    text: "Посмотрите мое AI видео!",
                    url: videoUrl,
                });
            } catch (error) {
                // User cancelled the share or an error occurred
                console.log("Sharing cancelled or failed:", error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(videoUrl);
                // You might want to show a toast notification here
                WebApp.showAlert("Ссылка скопирована в буфер обмена!");
            } catch (error) {
                console.error("Failed to copy to clipboard:", error);
                WebApp.showAlert("Не удалось скопировать ссылку");
            }
        }
    }
    return (<motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
    className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-end justify-center z-50 px-4">
        <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-primary w-[100%] px-3 pb-8 rounded-t-[20px]">
            <div className="flex justify-center py-3">
                <div className="h-[6px] w-[48px] bg-bg-quaternary" />
            </div>
            <div className="flex flex-col gap-2">
                <button 
                    onClick={downloadVideo} 
                    disabled={isDownloading}
                    className="flex px-3 py-2 gap-2 items-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {
                        isDownloading && <Loading03 size={20} className="text-fg-quaternary animate-spin" />
                    }
                    {
                        !isDownloading && <Download01 size={20} className="text-fg-quaternary" />
                    }
                    <div className="font-semibold">
                        {isDownloading ? "Скачивание..." : "Скачать видео"}
                    </div>
                </button>
                <button onClick={shareVideo} className="flex px-3 py-2 gap-2 items-center shrink-0">
                    <Share06 size={20} className="text-fg-quaternary" />
                    <div className="font-semibold">Поделиться</div>
                </button>
                <button className="flex px-3 py-2 gap-2 text-start items-center">
                    <Eye size={20} className="text-fg-quaternary shrink-0 self-start mt-1" />
                    <div className="font-semibold">
                        <div className="font-semibold">Показать участникам</div>
                        <div className="text-text-tertiary text-[14px] leading-[20px] mt-2">Другие участники смогут увидеть это видео</div>
                    </div>
                    <Toggle isSelected={isPublic} onChange={(selected) => {
                        setIsPublic(selected);
                        setPublic(video.record_id, selected)
                    }} className="ml-auto" size="md" />
                </button>
            </div>
        </motion.div>
    </motion.div>)
}