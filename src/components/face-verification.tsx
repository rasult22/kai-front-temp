import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { FeaturedIcon } from './foundations/featured-icon/featured-icon';
import { AlertCircle, Camera01, CheckCircle } from '@untitledui/icons';
import { LoadingIndicator } from './application/loading-indicator/loading-indicator';
import AnimatingContainer from './animating-container';
import WebApp from '@twa-dev/sdk';

interface FaceVerificationProps {
  onPhotoCapture?: (photoFile: File) => void;
  onSuccess?: () => void;
  onProblemReport?: () => void;
}

type ValidationError = 
  | 'no-face' 
  | 'multiple-faces' 
  | 'too-far' 
  | 'too-close' 
  | 'blurry' 
  | 'poor-lighting'
  | 'loading'
  | null;

const VALIDATION_MESSAGES = {
  'no-face': 'Лицо не обнаружено. Убедитесь, что ваше лицо видно в камере.',
  'multiple-faces': 'Похоже, вы не один. Для Face ID нужно, чтобы в кадре было только ваше лицо',
  'too-far': 'Слишком далеко. Приблизьтесь немного к камере ',
  'too-close': 'Слишком близко. Отодвиньтесь немного от камеры ',
  'blurry': 'Изображение размыто. Держите камеру неподвижно.',
  'poor-lighting': 'Недостаточно света. Переместитесь в более освещенное место.',
  'loading': 'Загрузка моделей...'
};

export const FaceVerification: React.FC<FaceVerificationProps> = ({ 
  onPhotoCapture, 
  onSuccess,
  onProblemReport
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [validationError, setValidationError] = useState<ValidationError>('loading');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Загрузка моделей face-api.js
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        setIsModelLoaded(true);
        setValidationError(null);
      } catch (error) {
        console.error('Ошибка загрузки моделей:', error);
        // Попробуем загрузить из CDN
        try {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
            faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
            faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
          ]);
          setIsModelLoaded(true);
          setValidationError(null);
        } catch (cdnError) {
          console.error('Ошибка загрузки моделей из CDN:', cdnError);
        }
      }
    };

    loadModels();
  }, []);

  // Функция для запуска камеры
  const startCamera = useCallback(async () => {
    try {
      // Останавливаем текущий поток если он есть
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
    }
  }, []);

  // Запуск камеры
  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  // Функция для анализа освещенности
  const analyzeLighting = useCallback((video: HTMLVideoElement, faceBox: faceapi.Box) => {
    // Создаем временный canvas для анализа
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    if (!tempContext) return true;

    // Устанавливаем размеры области лица
    const faceWidth = Math.max(faceBox.width, 50);
    const faceHeight = Math.max(faceBox.height, 50);
    tempCanvas.width = faceWidth;
    tempCanvas.height = faceHeight;

    // Рисуем область лица
    tempContext.drawImage(
      video,
      faceBox.x, faceBox.y, faceWidth, faceHeight,
      0, 0, faceWidth, faceHeight
    );

    // Получаем данные пикселей
    const imageData = tempContext.getImageData(0, 0, faceWidth, faceHeight);
    const pixels = imageData.data;

    // Вычисляем среднюю яркость
    let totalBrightness = 0;
    let pixelCount = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Формула для вычисления яркости (luminance)
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      totalBrightness += brightness;
      pixelCount++;
    }

    const averageBrightness = totalBrightness / pixelCount;
    
    // Проверяем пороговые значения
    // Слишком темно (< 60) или слишком светло (> 240)
    return averageBrightness >= 60 && averageBrightness <= 240;
  }, []);

  // Валидация лица
  const validateFace = useCallback(async () => {
    if (!videoRef.current || !isModelLoaded) return;

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detections.length === 0) {
        setValidationError('no-face');
        return false;
      }

      if (detections.length > 1) {
        setValidationError('multiple-faces');
        return false;
      }

      const detection = detections[0];
      const { width, height } = videoRef.current.getBoundingClientRect();
      const faceBox = detection.detection.box;
      
      // Проверка размера лица (слишком далеко/близко)
      const faceArea = faceBox.width * faceBox.height;
      const videoArea = width * height;
      const faceRatio = faceArea / videoArea;

      if (faceRatio < 0.3) {
        setValidationError('too-far');
        return false;
      }

      if (faceRatio > 0.5) {
        setValidationError('too-close');
        return false;
      }

      // Простая проверка резкости через landmarks
      const landmarks = detection.landmarks;
      const eyeDistance = Math.abs(
        landmarks.getLeftEye()[0].x - landmarks.getRightEye()[0].x
      );
      
      if (eyeDistance < 30) {
        setValidationError('blurry');
        return false;
      }

      // Проверка освещенности
      const hasGoodLighting = analyzeLighting(videoRef.current, faceBox);
      if (!hasGoodLighting) {
        setValidationError('poor-lighting');
        return false;
      }

      WebApp.HapticFeedback.notificationOccurred('success');
      setValidationError(null);
      return true;
    } catch (error) {
      console.error('Ошибка валидации:', error);
      return false;
    }
  }, [isModelLoaded]);

  // Периодическая валидация
  useEffect(() => {
    if (!isModelLoaded) return;

    const interval = setInterval(validateFace, 500);
    return () => clearInterval(interval);
  }, [validateFace, isModelLoaded]);

  // Захват фото
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || validationError) return;
    WebApp.HapticFeedback.impactOccurred('medium');

    setIsCapturing(true);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Зеркалируем изображение как в видео
      context.save();
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0);
      context.restore();
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(dataUrl);

      // Создаем файл для передачи
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'face-photo.jpg', { type: 'image/jpeg' });
          onPhotoCapture?.(file);
        }
      }, 'image/jpeg', 0.8);

    } catch (error) {
      console.error('Ошибка захвата фото:', error);
    } finally {
      setIsCapturing(false);
    }
  }, [validationError, onPhotoCapture]);

  const retakePhoto = async () => {
    WebApp.HapticFeedback.impactOccurred('medium');
    setCapturedPhoto(null);
    // Перезапускаем камеру
    await startCamera();
  };

  const confirmPhoto = () => {
    WebApp.HapticFeedback.impactOccurred('medium');
    onSuccess?.();
  };

  if (capturedPhoto) {
    return (
      <AnimatingContainer className="flex flex-col items-center px-6 pb-6">
        <div className="relative">
          <img 
            src={capturedPhoto} 
            alt="Captured face" 
            className="w-[75%] mx-auto aspect-[1/1.5] object-cover rounded-[24px] border-4 shadow-[0px_0px_72px_-12px_rgba(23,178,106,0.64)] border-fg-success-primary"
          />
        </div>
        <FeaturedIcon className='my-8' icon={<CheckCircle size={40} />} theme='outline' color='success' size='xl' />
        <div className="text-center">
          <h3 className="text-[20px] leading-[30px] font-semibold text-primary mb-2">
            Фото сделано успешно
          </h3>
          <p className="text-sm text-tertiary">
            Проверьте качество фотографии перед продолжением 
          </p>
        </div>

        <div className="flex gap-3 w-full max-w-sm mt-4">
          <Button 
            color="secondary" 
            size="xl" 
            onClick={retakePhoto}
            className="flex-1"
          >
            Переснять
          </Button>
          <Button 
            color="primary" 
            size="xl" 
            onClick={confirmPhoto}
            className="flex-1"
          >
            Продолжить
          </Button>
        </div>
      </AnimatingContainer>
    );
  }

  return (
    <AnimatingContainer className="flex flex-col flex-1 items-center relative px-4">
      <div className={cx(
          "rounded-[24px] border-4 transition-colors duration-300 ",
          validationError ? "border-utility-error-400 shadow-[0px_0px_62px_-12px_rgba(217,45,32,0.64)]" : "border-fg-success-primary shadow-[0px_0px_72px_-12px_rgba(23,178,106,0.64)]",
          !isModelLoaded && "border-fg-tertiary"
        )}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-[60vh] object-cover rounded-[24px] transform scale-x-[-1]"
        />
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>

      {/* Статус и инструкции */}
      <div className="text-center w-full mt-4">
        {validationError && (
          <div className="bg-bg-primary_alt border border-border-primary p-4 rounded-lg mb-4 flex flex-col items-center gap-4">
            {isModelLoaded && <FeaturedIcon color='error' icon={AlertCircle} theme='outline' />}
            {!isModelLoaded && <LoadingIndicator />}
            <p className="text-[14px] leading-[20px] text-text-secondary font-semibold">
              {VALIDATION_MESSAGES[validationError]}
            </p>
          </div>
        )}
        
        {!validationError && isModelLoaded && (
          <div className="bg-bg-primary_alt border border-border-primary p-4 rounded-lg mb-4 flex flex-col items-center gap-4">
            <FeaturedIcon color='success' icon={CheckCircle} theme='outline' />
            <p className="text-[14px] leading-[20px] text-text-secondary font-semibold">
              Отлично! Можете сделать фото
              <br/>
              <br/>
            </p>
          </div>
        )}
      </div>

      <div className='flex justify-between w-full items-center'>
        {/* Кнопка захвата */}
         <button
          className='opacity-0 text-text-tertiary font-semibold text-[14px] leading-[20px]'>
          Есть проблемы?
        </button>
        <button 
          onClick={capturePhoto} 
          disabled={!!validationError || !isModelLoaded || isCapturing}
          className='disabled:bg-alpha-black/10 bg-fg-success-secondary text-alpha-black/100 p-4 rounded-full disabled:text-fg-tertiary'>
          <Camera01 />
        </button>
        <button 
          onClick={onProblemReport} 
          className='text-text-tertiary active:opacity-90 transition-all font-semibold text-[14px] leading-[20px]'>
          Есть проблемы?
        </button>
      </div>
    </AnimatingContainer>
  );
};