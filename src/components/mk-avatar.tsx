import React, { useEffect, useRef, useState, useCallback } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  StartAvatarRequest,
  STTProvider,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import { Loading03, Microphone01, Stop, X } from "@untitledui/icons";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Avatar } from "@/components/base/avatar/avatar";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import WebApp from "@twa-dev/sdk";
import { ButtonUtility } from "./base/buttons/button-utility";
import { motion } from "motion/react";

// Состояния сессии
enum SessionState {
  INACTIVE = "inactive",
  CONNECTING = "connecting",
  CONNECTED = "connected",
}

// Конфигурация по умолчанию
const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: "a959f6e936ee42e0adbed7572b63c407",
  knowledgeId: "4a170777b47e4c678dd878d330b0ba04",
  voice: {
    // voiceId: '0d912ff3af3b421fbedbcdc92474a747',
    voiceId: "66779a89149040d3b43bdfba1d2d6dc6",
    emotion: VoiceEmotion.EXCITED,
    rate: 1,
  },
  language: "ru", // Русский язык как в вашем примере
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
  activityIdleTimeout: 5000,
};

const SimpleVoiceChat: React.FC = () => {
  const [sessionState, setSessionState] = useState<SessionState>(
    SessionState.CONNECTING
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [requestIsProcessing, setRequestIsProcessing] = useState(false)
  const [avatarIsSpeaking, setAvatarIsSpeaking] = useState(false)
  const [isPressing, setIsPressing] = useState(false);
  const navigate = useNavigate();

  const avatarRef = useRef<StreamingAvatar | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
 
  const api_key_part1 = "sk_V2_";
  const api_key_part2 = "hgu_kuBMwAtXRFk_GA7akgCcy7";
  const api_key_part3 = "1v1VPX31nztNGuUjE7sedk";

  const {isError, error} = useQuery({
    queryKey: ["start_mk"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await initAvatar();
      setTimeout(() => {
        if (avatarRef.current && !isVoiceChatActive) {
          avatarRef.current.startVoiceChat({
            isInputAudioMuted: true,
          });
          setIsVoiceChatActive(true);
        }
      }, 1000)
      return true;
    },
  });

  // Отслеживание изменений sessionState
  useEffect(() => {
    console.log("sessionState изменился на:", sessionState);
  }, [sessionState]);

  // Получение токена доступа
  const fetchAccessToken = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.heygen.com/v1/streaming.create_token`,
        {
          method: "POST",
          headers: {
            "x-api-key": `${api_key_part1}${api_key_part2}${api_key_part3}`,
          },
        }
      );
      const data = await res.json();
      const token = data.data.token;
      console.log("Access Token получен");
      return token;
    } catch (error) {
      console.error("Ошибка получения токена:", error);
      throw error;
    }
  }, []);
  // Запуск голосового чата
  // const startVoiceChat = async () => {
  //   console.log('starting voice chat', avatarRef.current, sessionState)
  //   if (!avatarRef.current || sessionState !== SessionState.CONNECTED) return;
  //   console.log('я тут')
  //   try {
  //     await avatarRef.current.startVoiceChat({
  //       isInputAudioMuted: true,
  //     });
  //     setIsVoiceChatActive(true);
  //     setIsMuted(true);
  //     console.log("Голосовой чат запущен (push-to-talk, микрофон по умолчанию выключен)");
  //   } catch (error) {
  //     console.error("Ошибка запуска голосового чата:", error);
  //   }
  // };

  // Инициализация аватара
  const initAvatar = useCallback(async () => {
    try {
      setSessionState(SessionState.CONNECTING);

      const token = await fetchAccessToken();
      // Создаем новый экземпляр аватара
      avatarRef.current = new StreamingAvatar({
        token,
        basePath: "https://api.heygen.com",
      });

      // Настраиваем обработчики событий
      avatarRef.current.on(StreamingEvents.STREAM_READY, (event) => {
        console.log("Поток готов:", event.detail);
        setStream(event.detail);
        console.log("Устанавливаю sessionState в CONNECTED");
        setSessionState(SessionState.CONNECTED);
        console.log(
          "sessionState установлен в CONNECTED, голосовой чат запустится через useEffect"
        );
      });

      avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Поток отключен");
        setSessionState(SessionState.INACTIVE);
        setStream(null);
        setIsVoiceChatActive(false);
      });

      avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
        setRequestIsProcessing(false)
        console.log("Аватар начал говорить");
        setAvatarIsSpeaking(true)
      });

      avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        console.log("Аватар закончил говорить");
        setAvatarIsSpeaking(false)
      });

      avatarRef.current.on(StreamingEvents.USER_START, () => {
        console.log("Пользователь начал говорить");
      });

      avatarRef.current.on(StreamingEvents.USER_STOP, () => {
        console.log("Пользователь закончил говорить");
        setRequestIsProcessing(true);
      });

      // Запускаем аватара
      await avatarRef.current.createStartAvatar(DEFAULT_CONFIG);
      console.log("Аватар успешно запущен");
    } catch (error) {
      console.error("Ошибка инициализации аватара:", error);
      setSessionState(SessionState.INACTIVE);
      throw new Error(error as any)
    }
  }, [fetchAccessToken]);

  // Остановка голосового чата
  const stopVoiceChat = useCallback(() => {
    if (!avatarRef.current) return;
    WebApp.HapticFeedback.impactOccurred("medium");
    avatarRef.current.closeVoiceChat();
    setIsVoiceChatActive(false);
    console.log("Голосовой чат остановлен");
    navigate("/app/mk", {
      replace: true,
    });
  }, []);

  // Переключение микрофона
  const handlePressStart = useCallback(async () => {
    if (!avatarRef.current || sessionState !== SessionState.CONNECTED) return;
    WebApp.HapticFeedback.notificationOccurred('success');
    if (!isVoiceChatActive) {
      try {
        await avatarRef.current.startVoiceChat({ isInputAudioMuted: true });
        setIsVoiceChatActive(true);
        console.log("Голосовой чат запущен по жесту (микрофон выключен)");
      } catch (error) {
        console.error("Не удалось запустить голосовой чат:", error);
        return;
      }
    }
    avatarRef.current.unmuteInputAudio();
    setIsPressing(true);
    console.log("Push-to-talk: микрофон включен");
  }, [isVoiceChatActive, sessionState]);

  const handlePressEnd = useCallback(() => {
    if (!avatarRef.current || !isVoiceChatActive) return;
    WebApp.HapticFeedback.impactOccurred('heavy');
    avatarRef.current.muteInputAudio();
    setIsPressing(false);
    console.log("Push-to-talk: микрофон выключен");
  }, [isVoiceChatActive]);

  const handlePressCancel = useCallback(() => {
    if (
      !avatarRef.current ||
      !isVoiceChatActive ||
      avatarRef.current?.isInputAudioMuted
    )
      return;
    avatarRef.current.muteInputAudio();
    setIsPressing(false);
    console.log("Push-to-talk: отменено, микрофон выключен");
  }, [isVoiceChatActive]);

  // Остановка сессии
  const stopSession = useCallback(() => {
    if (avatarRef.current) {
      if (isVoiceChatActive) {
        avatarRef.current.closeVoiceChat();
      }
      avatarRef.current.stopAvatar();
      avatarRef.current = null;
    }
    setSessionState(SessionState.INACTIVE);
    setStream(null);
    setIsVoiceChatActive(false);
    console.log("Сессия остановлена");
  }, [isVoiceChatActive]);

  // Обновление видео потока
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log("Устанавливаем видео поток:", stream);
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        console.log("Метаданные видео загружены, запускаем воспроизведение");
        videoRef.current?.play().catch((error) => {
          console.error("Ошибка воспроизведения видео:", error);
        });
      };
    }
  }, [stream]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (avatarRef.current) {
        avatarRef.current.stopAvatar();
        stopSession();
        stopVoiceChat();
      }
    };
  }, []);

  if (isError) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Avatar src="/mk-large.png" size="2xl" />
        <div className="font-medium text-[24px] leading-[32px] mt-3">
          Маргулан Сейсембай
        </div>
        <div className="text-text-brand-secondary mt-1">
          ИИ-аватар с базой знаний{" "}
        </div>
          <div className="mt-4 flex flex-col text-center items-center gap-4">
            <div className="text-text-error-primary font-medium">Подключение прервано</div>
            <div className="font-mono">Ошибка: {error.message}</div>
          </div>
      </div>
    )
  }

  return (
    <>
      {sessionState !== SessionState.CONNECTED && (
        <div className="flex flex-col flex-1 items-center justify-center">
          <Avatar src="/mk-large.png" size="2xl" />
          <div className="font-medium text-[24px] leading-[32px] mt-3">
            Маргулан Сейсембай
          </div>
          <div className="text-text-brand-secondary mt-1">
            ИИ-аватар с базой знаний{" "}
          </div>
          {sessionState === SessionState.CONNECTING && (
            <div className="mt-4 flex items-center gap-4">
              <div className="text-text-brand-secondary">Подключаемся</div>
              <LoadingIndicator type="dot-circle" />
            </div>
          )}
        </div>
      )}
      {sessionState === SessionState.CONNECTED && isVoiceChatActive &&(
        <motion.div initial={{opacity: 0, y: 20}} animate={{ opacity: 1, y: 0 }} layout="size" className="flex relative mt-auto z-20 bg-alpha-black/10 backdrop-blur-[100px] justify-center pb-8 rounded-[24px] p-4 gap-8 select-none">
          {!avatarIsSpeaking &&
            <div className="flex flex-col items-center gap-1">
              <div className="mb-4">
                {requestIsProcessing && <Loading03 className="animate-spin" />}
              </div>
              <div className="text-[14px] leading-[20px] mb-4">
                {isPressing && "Говорите..."}
                {!isPressing && !requestIsProcessing &&  "Зажмите чтобы говорить"}
                {requestIsProcessing &&  "Обработка запроса..."}
              </div>
              <button
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressCancel}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onTouchCancel={handlePressCancel}
                disabled={requestIsProcessing}
                className={`bg-fg-brand-secondary disabled:opacity-50 rounded-full transition-all ${isPressing ? "p-6 opacity-90 scale-110" : "p-4"}`}
              >
                <Microphone01 size={32} />
              </button>
            </div>}
          {
            avatarIsSpeaking && 
            <div className="flex flex-col items-center gap-1">
              <div className="text-[14px] leading-[20px] mb-4">
                Нажмите чтобы перебить
              </div>
              <button
                onClick={() => avatarRef.current && avatarRef.current.interrupt()}
                className={`bg-fg-brand-secondary rounded-full transition-all p-4 active:scale-105`}
              >
                <Stop size={32} />
              </button>
            </div>
          }
        </motion.div>
      )}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-4">
        <ButtonUtility
          onClick={stopVoiceChat}
          className="absolute right-4 z-[100000]"
          style={{ top: WebApp.safeAreaInset.top + 36 + 16 }}
          icon={<X size={24} className="text-white" />}
        ></ButtonUtility>
        {/* Видео контейнер */}
        {sessionState === SessionState.CONNECTED && stream && (
          <div className="flex flex-col rounded-xl bg-zinc-900 overflow-hidden">
            <div className="fixed z-10 top-0 left-0 w-full aspect-[9/16] bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={false}
                controls={false}
                className="w-full h-full object-cover"
                onError={(e) => console.error("Ошибка видео элемента:", e)}
                onLoadStart={() => console.log("Начало загрузки видео")}
                onCanPlay={() => console.log("Видео готово к воспроизведению")}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SimpleVoiceChat;
