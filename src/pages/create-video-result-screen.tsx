import AnimatingContainer from "@/components/animating-container";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Toggle } from "@/components/base/toggle/toggle";
import { VideoPlayer } from "@/components/base/video-player/video-player";
import YandexMusicGradient from "@/components/yandex-animation";
import { generateVideoWithPolling } from "@/queries/higgsfield";
import { useUserData } from "@/queries/user";
import { createVideoRecord, setPublic } from "@/queries/videos";
import { useQuery } from "@tanstack/react-query";
import WebApp from "@twa-dev/sdk";
import {
  ArrowLeft,
  Clock,
  Download01,
  Eye,
  Home01,
  Loading03,
  Plus,
  Share06,
  Star06,
} from "@untitledui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const CreateVideoResultScreen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => {
      WebApp.HapticFeedback.impactOccurred("medium");
      navigate(-1);
    });
  }, []);
  return <ResultScreen />;
};

export default CreateVideoResultScreen;

export function Header() {
  const navigate = useNavigate();

  return (
    <div className="py-2 px-4 flex justify-between items-center">
      <ButtonUtility
        onClick={() => navigate(-1)}
        color="tertiary"
        icon={<ArrowLeft size={20} data-icon />}
      />
      <div className="flex flex-col justify-center items-center font-medium text-[14px] leading-[20px] text-primary">
        Видео в стиле “Киберпанк 2077”
      </div>
      <ButtonUtility
        className="opacity-0"
        icon={<ArrowLeft size={20} data-icon />}
      />
    </div>
  );
}

const ResultScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resultUrl = searchParams.get("result_url");
  const style_name = searchParams.get("style_name");
  const thumbnail = searchParams.get("thumbnail");
  const recordId = searchParams.get("record_id");
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  if (!resultUrl) {
    return (
      <AnimatingContainer
        className="flex h-dvh flex-col text-primary bg-bg-primary "
        style={{
          paddingTop: WebApp.safeAreaInset.top + 36,
          paddingBottom: 24 + WebApp.safeAreaInset.bottom,
        }}
      >
        <div className="text-text-error-primary">Error, missing result url</div>
      </AnimatingContainer>
    );
  }
  const downloadVideo = () => {
    if (isDownloading) {
      return;
    }
    setIsDownloading(true);
    WebApp.downloadFile(
      {
        url: resultUrl,
        file_name: "ai-video.mp4",
      },
      (isAccepted) => {
        setIsDownloading(false);
        if (!isAccepted) {
          WebApp.showAlert("Скачивание отменено");
          return;
        }
      }
    );
  };
  const shareVideo = async () => {
    const videoUrl = resultUrl;
    const videoTitle = "AI видео в стиле Киберпанк";

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
  };
  return (
    <AnimatingContainer
      className="flex h-dvh flex-col text-primary bg-bg-primary "
      style={{
        paddingTop: WebApp.safeAreaInset.top + 36,
        paddingBottom: 24 + WebApp.safeAreaInset.bottom,
      }}
    >
      <VideoPlayer
        src={resultUrl}
        loop={true}
        thumbnailUrl={thumbnail || ''}
        className="aspect-video w-full overflow-hidden"
      />
      <div className="bg-bg-secondary p-4 rounded-b-[20px]">
        <div className="flex items-center gap-2">
          <StarWithGradient />
          <div className="text-text-secondary">Ваше видео готово</div>
          <CheckWithGradient />
        </div>
        <div className="text-[20px] leading-[30px] font-semibold mt-3">
          Видео в стиле “{style_name}”
        </div>
        <div className="flex items-center text-text-tertiary gap-2 mt-4">
          <Clock className="text-fg-quaternary" size={20} />
          <div>Длительность:</div>
          <div className="font-medium">5 секунд</div>
        </div>
        {/* <div className="flex items-center text-text-tertiary gap-2 mt-4">
          <DistributeSpacingHorizontal
            className="text-fg-quaternary"
            size={20}
          />
          <div>Формат:</div>
          <div className="font-medium">Горизонтальный</div>
        </div> */}
      </div>

      <div className="flex flex-col gap-2 mt-[10px]">
        <button
          onClick={downloadVideo}
          disabled={isDownloading}
          className="flex px-3 py-2 gap-2 items-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading && (
            <Loading03 size={20} className="text-fg-quaternary animate-spin" />
          )}
          {!isDownloading && (
            <Download01 size={20} className="text-fg-quaternary" />
          )}
          <div className="font-semibold">
            {isDownloading ? "Скачивание..." : "Скачать видео"}
          </div>
        </button>
        <button
          onClick={shareVideo}
          className="flex px-3 py-2 gap-2 items-center shrink-0"
        >
          <Share06 size={20} className="text-fg-quaternary" />
          <div className="font-semibold">Поделиться</div>
        </button>
        <button className="flex px-3 py-2 gap-2 text-start items-center">
          <Eye
            size={20}
            className="text-fg-quaternary shrink-0 self-start mt-1"
          />
          <div className="font-semibold">
            <div className="font-semibold">Показать участникам</div>
            <div className="text-text-tertiary text-[14px] leading-[20px] mt-2">
              Другие участники смогут увидеть это видео
            </div>
          </div>
          <Toggle isSelected={isPublic} onChange={(selected) => {
            setIsPublic(selected)
            if (recordId) {
              setPublic(recordId, selected)
            }
          }} className="ml-auto" size="md" />
        </button>
      </div>
      <div className="flex flex-col px-4 gap-[10px] mt-4">
        <Button
          onClick={() => navigate("/create-video", {replace: true})}
          size="xl"
          iconLeading={<Plus size={20} className="text-button-primary-icon" />}
          iconTrailing={
            <Star06 size={20} className="text-button-primary-icon" />
          }
        >
          Новое видео
        </Button>
        <Button
          onClick={() => navigate("/app/ai-video", {replace: true})}
          size="xl"
          color="secondary"
          iconLeading={<Home01 />}
        >
          Вернуться
        </Button>
      </div>
    </AnimatingContainer>
  );
};

const ACTIONS = [
  "Генерируем видео...",
  "Выбираем цветовую палитру…",
  "Добавляем свет и текстуры…",
  "Собираем вдохновение по пикселям…",
  "Завариваем свежий рендер…",
  "Шлифуем кадры до блеска…",
  "Крутим цветокор до идеала…",
  "Подгоняем тайминг переходов…",
  "Рисуем мягкие тени…",
  "Запускаем частички и блёстки…",
  "Приправляем кадры магией AI…",
  "Балансируем экспозицию и контраст…",
  "Подрисовываем отражения и отблески…",
  "Добавляем кинематографичный вайб…",
  "Полируем финальные штрихи…",
  "Готовим премьеру…",
];
export const LoadingScreen = ({
  image_url,
  motion_id,
  style_name
}: {
  image_url: string;
  motion_id: string;
  style_name: string;
}) => {
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {data:userData} = useUserData()
  const navigate = useNavigate();

  const updateActionIndex = useCallback(() => {
    setCurrentActionIndex((prevIndex) => (prevIndex + 1) % ACTIONS.length);
  }, []);
  const { isLoading, data, error } = useQuery({
    queryKey: ["generate", image_url, motion_id],
    queryFn: async () => {
      if (!userData) return;
      const result_url = await generateVideoWithPolling(image_url, motion_id);
      const record = await createVideoRecord({
          "user": userData,
          "tg_id": userData.telegram_id,
          "video_url": result_url,
          "video_thumbnail": image_url,
          "date": new Date().toISOString(),
          "public": false,
          "style_name": style_name
      })
      return {result_url, record_id: record.id};
    },
  });

  useEffect(() => {
    // Очищаем предыдущий интервал, если он существует
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Создаем новый интервал
    intervalRef.current = setInterval(updateActionIndex, 3000); // Меняем текст каждые 4.5 секунды

    // Функция очистки
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateActionIndex]); // Добавляем updateActionIndex в зависимости

  if (data && !isLoading) {
    navigate(`/create-video-result?result_url=${data.result_url}&style_name=${style_name}&thumbnail=${image_url}&record_id=${data.record_id}`);
  }
  if (error) {
    return (
      <AnimatingContainer
        className="flex h-dvh flex-col justify-center items-center text-primary bg-bg-primary "
        style={{
          paddingTop: WebApp.safeAreaInset.top + 36,
          paddingBottom: 24 + WebApp.safeAreaInset.bottom,
        }}
      >
        <div className="text-text-error-primary">
          Error generating video: {error.message}{" "}
        </div>
      </AnimatingContainer>
    );
  }
  return (
    <AnimatingContainer
      className="flex h-dvh flex-col text-primary bg-bg-primary "
      style={{
        paddingTop: WebApp.safeAreaInset.top + 36,
        paddingBottom: 24 + WebApp.safeAreaInset.bottom,
      }}
    >
      <div className="relative z-10">{/* <Header /> */}</div>
      <div className="absolute top-0 left-0 w-full">
        <YandexMusicGradient />
      </div>
      <div className="relative z-10 mt-auto pb-16">
        <div className="font-semibold text-[20px] leading-[30px] text-center animate-pulse">
          {ACTIONS[currentActionIndex]}
        </div>
        <div className="text-center text-fg-quaternary mt-5">
          Это займет пару минут{" "}
        </div>
      </div>
    </AnimatingContainer>
  );
};

const StarWithGradient = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.74984 18.3332V14.1665M3.74984 5.83317V1.6665M1.6665 3.74984H5.83317M1.6665 16.2498H5.83317M10.8332 2.49984L9.38802 6.25722C9.15301 6.86825 9.03551 7.17376 8.85278 7.43074C8.69083 7.6585 8.49184 7.8575 8.26408 8.01945C8.00709 8.20218 7.70158 8.31968 7.09055 8.55469L3.33317 9.99984L7.09056 11.445C7.70158 11.68 8.00709 11.7975 8.26408 11.9802C8.49184 12.1422 8.69083 12.3412 8.85278 12.5689C9.03551 12.8259 9.15301 13.1314 9.38802 13.7425L10.8332 17.4998L12.2783 13.7425C12.5133 13.1314 12.6308 12.8259 12.8136 12.5689C12.9755 12.3412 13.1745 12.1422 13.4023 11.9802C13.6592 11.7975 13.9648 11.68 14.5758 11.445L18.3332 9.99984L14.5758 8.55469C13.9648 8.31968 13.6592 8.20217 13.4023 8.01945C13.1745 7.8575 12.9755 7.6585 12.8136 7.43074C12.6308 7.17376 12.5133 6.86825 12.2783 6.25722L10.8332 2.49984Z"
        stroke="url(#paint0_linear_225_9431)"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_225_9431"
          x1="1.6665"
          y1="1.6665"
          x2="18.3332"
          y2="18.3332"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CE9FFC" />
          <stop offset="1" stopColor="#7367F0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
const CheckWithGradient = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6668 5L7.50016 14.1667L3.3335 10"
        stroke="url(#paint0_linear_225_9433)"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_225_9433"
          x1="16.6668"
          y1="14.1667"
          x2="16.6668"
          y2="5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#96FBC4" />
          <stop offset="1" stopColor="#F9F586" />
        </linearGradient>
      </defs>
    </svg>
  );
};
