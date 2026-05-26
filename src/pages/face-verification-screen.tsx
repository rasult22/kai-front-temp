import React, { useState } from 'react';
import { FaceVerification } from '@/components/face-verification';
import { Button } from '@/components/base/buttons/button';
import WebApp from "@twa-dev/sdk";
import AnimatingContainer from '@/components/animating-container';
import { CheckCircle, FaceId, InfoCircle, Ticket01 } from '@untitledui/icons';
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon';
import { Badge } from '@/components/base/badges/badges';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { uploadFaceId } from '@/queries/user';
import { LoadingIndicator } from '@/components/application/loading-indicator/loading-indicator';

export const FaceVerificationScreen = () => {
  const navigate = useNavigate()
  const [screen, setScreen] = useState<'start' | 'verifying' | 'success' | 'alternative'>('start')
  return <AnimatingContainer className='bg-bg-primary h-dvh flex flex-col flex-1' style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
     {screen === 'start' && <Intro onStart={() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        setScreen('verifying')
      }}/>}
     {screen === 'verifying' && <FaceVerificationComponent onNext={() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        setScreen('success')
      }} onSkip={() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        localStorage.setItem('face_id_skipped', 'true');
        setScreen('alternative')
      }}/>}
     {screen === 'success' && <Success onNext={() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        setScreen('alternative')
      }}/>}
     {screen === 'alternative' && <Alternative onNext={() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        navigate('/tutorial', {
          replace: true
        })
     }}/>}
  </AnimatingContainer>
}

const Intro = ({onStart}: {onStart: () => void}) => {
  return <div className='p-6 flex flex-col flex-1'>
    <div className='flex flex-col flex-1'>
      <div className='flex flex-col items-center'>
        <FaceId size={48} className='text-border-brand'/>
        <div className='font-semibold text-text-primary text-[30px] leading-[38px] mt-4'>Face ID</div>
        <div className='text-text-secondary text-center mt-4'>Для входа в мероприятие пройдите простую настройку Face ID</div>
        <div className='text-text-primary font-semibold mt-4'>Это займет не больше минуты</div>
      </div>
      <div className='mt-6 bg-bg-primary_alt p-4 rounded-[12px] border border-border-primary'>
        <FeaturedIcon icon={Ticket01} size="md" color='gray' className='text-fg-secondary' theme="modern-neue"/>
        <div className='text-text-secondary font-semibold mt-4'>Вход по Face ID</div>
        <div className='text-text-tertiary text-[14px] leading-[20px] mt-1'>В день мероприятия вас автоматически пропустят по Face ID — просто подойдите к входу</div>
      </div>
    </div>
    <div>
      <Button onClick={onStart} className='w-full' size='xl'>
        Начать
      </Button>
    </div>
  </div>
}

const Alternative = ({onNext}: {onNext: () => void}) => {
  return (
    <div className='px-4 pt-4 flex flex-col flex-1 relative overflow-hidden'>
      <div className='w-[591px] h-[591px] absolute bottom-[-50%] right-0 bg-fg-warning-primary blur-[125px]'/>
      <div className='flex flex-col items-center flex-1 relative z-[1]'>
          <Badge size='lg' color='warning'>Важно</Badge>
          <div className='font-bold text-text-primary text-[24px] leading-[32px] text-center mt-4'>Дополнительный способ входа</div>
          <div className='text-[14px] leading-[20px] text-text-secondary text-center mt-4'>Если Face ID будет недоступен, отсканируйте QR-билет на входа в мероприятие </div>
          <div className='bg-bg-primary_alt p-4 rounded-[12px] mt-6 border border-primary'>
              <FeaturedIcon color='warning' icon={InfoCircle} theme='outline' size='lg' />
              <div className='text-text-secondary font-semibold mt-4'>Билет доступен по кнопке “QR” в правом верхнем углу главной страницы</div>
          </div>
      </div>
      <img className='w-[100%] z-[1]' src="/iphone.png" alt="" width={300} height={400} />
      <div className='z-[1] absolute bottom-4 w-full left-0 p-4'>
        <Button onClick={onNext} className='w-full' size='xl'>
          Продолжить
        </Button>
      </div>
  </div>
  )
}
const Success = ({onNext}: {onNext: () => void}) => {
  return (
    <div className='p-6 flex flex-col flex-1'>
      <div className='flex flex-col items-center justify-center flex-1 -mt-15'>
          <FeaturedIcon className='my-8' icon={<CheckCircle size={40} />} theme='outline' color='success' size='xl' />
          <div className='font-semibold text-text-primary text-[20px] leading-[30px]'>Face ID активирован</div>
          <div className='text-text-secondary text-center mt-4'>На мероприятие вы сможете пройти без очередей — просто подойдите к входу</div>
      </div>
      <div>
        <Button onClick={onNext} className='w-full' size='xl'>
          Продолжить
        </Button>
      </div>
  </div>
  )
}

const FaceVerificationComponent =({onNext, onSkip}: {onNext: () => void, onSkip: () => void}) => {
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePhotoCapture = (file: File) => {
    setCapturedFile(file);
    console.log('Фото захвачено:', file, capturedFile);
    // Здесь можно сохранить файл в состояние приложения или отправить на сервер
  };

  const handleSuccess = async () => {
    if (!capturedFile) return;
    setIsLoading(true)
    await uploadFaceId(capturedFile);
    setIsLoading(false)
    onNext()
  };
  return (
    <div className="bg-bg-primary flex flex-col">
      {/* Content */}
      {isLoading && <div className='fixed flex items-center justify-center top-0 left-0 w-full h-[100vh] bg-black/80 z-[10000]'>
        <LoadingIndicator size='lg'/>
      </div>}
      <div className="flex-1 flex flex-col ">
        <FaceVerification
          onPhotoCapture={handlePhotoCapture}
          onSuccess={handleSuccess}
          onProblemReport={() => {
            WebApp.HapticFeedback.impactOccurred('medium')
            setShowModal(true)
          }}
        />
      </div>
      <AnimatePresence>
        {showModal && <ProblemsModal onClose={() =>{
          WebApp.HapticFeedback.impactOccurred('medium')
          setShowModal(false)
        }} onNext={onSkip} />}
      </AnimatePresence>
    </div>
  );
};

const ProblemsModal = ({onClose, onNext}: {onClose: () => void, onNext: () => void}) => {
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
            className="bg-bg-secondary w-[100%] px-3 pb-8 rounded-t-[20px]">
            <div className="flex justify-center py-3">
                <div className="h-[6px] w-[48px] bg-bg-quaternary rounded-full" />
            </div>
            <div className="flex flex-col gap-4">
              <div className='font-semibold text-text-secondary text-center'>Нет возможности пройти FaceID?</div>
              <div className='text-text-tertiary text-center text-[14px] leading-[20px]'>Тогда вы можете получить QR-билет для входа в мероприятие</div>
              <Button onClick={onNext} size='xl'>Получить QR-билет</Button>
              <Button onClick={onClose} size='xl' color='secondary'>Отмена</Button>
            </div>
        </motion.div>
    </motion.div>)
}