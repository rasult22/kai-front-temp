import AnimatingContainer from "@/components/animating-container";
import { Button } from "@/components/base/buttons/button";
import WebApp from "@twa-dev/sdk";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const TutorialScreen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    WebApp.BackButton.hide()
  }, [])
  const [currentScreen, setCurrentScreen] = useState<'start' | 'schedule' | 'networking' | 'questions' | 'ai-video'>('start');
    const onSkip = () => {
      WebApp.HapticFeedback.impactOccurred('medium')
      navigate('/', {replace: true});
    };
    const setScreen = (screen: typeof currentScreen) => {
      WebApp.HapticFeedback.impactOccurred('medium')
      setCurrentScreen(screen);
    }
    return (
        <div className="flex h-dvh flex-col text-primary" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
          {currentScreen === 'start' && <Start onNext={() => setScreen('schedule')} />}
          {currentScreen === 'schedule' && <Schedule onNext={() => setScreen('networking')} onBack={() => setScreen('start')} onSkip={onSkip} />}
          {currentScreen === 'networking' && <Networking onNext={() => setScreen('questions')} onBack={() => setScreen('schedule')} onSkip={onSkip} />}
          {currentScreen === 'questions' && <Questions onNext={() => setScreen('ai-video')} onBack={() => setScreen('networking')} onSkip={onSkip} />}
          {currentScreen === 'ai-video' && <AIVideo onNext={onSkip} onBack={() => setScreen('questions')} onSkip={onSkip} />}
        </div>
    );
};

const Start = ({onNext}: {onNext: () => void}) => {
  return <AnimatingContainer className="flex-1 flex flex-col px-4 pt-1 pb-8 relative">
    <div className="opacity-0">
      <Button size="xl">dummy</Button>
    </div>
    <motion.img initial={{x: -100}} animate={{x: 0}} transition={{type: 'spring', stiffness: 260, damping: 20}} width={173} className="absolute z-10 left-0 top-4" src="/flying-stuff-1.png" alt="" />
    <div className="flex-1 flex items-center text-text-primary flex-col justify-center bg-gradient-to-tl from-[rgba(12,14,18,0.5)] to-fg-brand-primary backdrop-blur-2xl rounded-[16px] overflow mb-5">
      <div className="my-auto py-8">
        <Logo />
      </div>
      <div className="mt-auto relative rounded-b-[16px]  bg-gradient-to-b from-[rgba(12,14,18,0)] via-[rgba(12,14,18,0.5)] to-[rgba(12,14,18,1)] px-4 pb-4 pt-8">
        <motion.img initial={{x: 100}} animate={{x: 0}} transition={{type: 'spring', stiffness: 260, damping: 20}} width={233} className="absolute z-10 -right-4 top-[-100%]" src="/flying-stuff-2.png" alt="" />
        <div className="font-semibold text-[24px] text-center leading-[32px]">Добро пожаловать <br/> в приложение</div>
        <div className="text-[14px] text-center leading-[20px] mt-4">Ваш помощник во время слета предпринимателей в рамках Kaizen Club</div>
        <div className="h-[24px] mt-4" />
      </div>
    </div>
    <Button size="xl" onClick={onNext}>Узнать о возможностях</Button>
  </AnimatingContainer>
}
const Schedule = ({onNext, onBack, onSkip}: {onNext: () => void, onBack?: () => void, onSkip: () => void}) => {
  return <AnimatingContainer className="flex-1 flex flex-col px-4 pt-1 pb-8">
    <div className="flex justify-end">
      <Button color="tertiary" size="xl" onClick={onSkip}>Пропустить</Button>
    </div>
    <div className="flex-1 flex flex-col justify-end bg-gradient-to-t from-[rgba(12,14,18,1)] to-fg-brand-primary rounded-[16px] mb-5 text-center overflow-hidden">
      <div className="mt-auto relative bg-gradient-to-b from-[rgba(12,14,18,0)] via-[rgba(12,14,18,0.5)] to-[rgba(12,14,18,1)] px-4 pb-4 pt-8">
        <img className="mx-auto max-w-[60vw] w-full max-h-[45vh] object-contain" width={245} src="/program.png" alt="" />
        <div className="font-semibold text-[24px] leading-[32px]">Расписание</div>
        <div className="text-[14px] leading-[20px] mt-4 px-4">
          Следите за программой слёта в реальном времени.
        </div>
        <div className="text-[14px] leading-[20px] mt-4 px-4">
          Мы напомним о начале сессий и подскажем, если что-то по меняется.
        </div>
        <div className="flex gap-3 justify-center mt-4">
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
          <div className="w-[8px] h-[8px] rounded-full bg-bg-quaternary" />
          <div className="w-[8px] h-[8px] rounded-full bg-bg-quaternary" />
          <div className="w-[8px] h-[8px] rounded-full bg-bg-quaternary" />
        </div>
      </div>
    </div>
    <Actions allowNext={true} showBack={true} onNext={onNext} onBack={onBack} />
  </AnimatingContainer>
}
const Networking = ({onNext, onBack, onSkip}: {onNext: () => void, onBack?: () => void, onSkip: () => void}) => {
  return <AnimatingContainer className="flex-1 flex flex-col px-4 pt-1 pb-8">
    <div className="flex justify-end">
      <Button color="tertiary" size="xl" onClick={onSkip}>Пропустить</Button>
    </div>
    <div className="flex-1 flex flex-col justify-end bg-gradient-to-t from-[rgba(12,14,18,1)] to-fg-brand-primary rounded-[16px] mb-5 overflow-hidden text-center">
      <div className="mt-auto relative bg-gradient-to-b from-[rgba(12,14,18,0)] via-[rgba(12,14,18,0.5)] to-[rgba(12,14,18,1)] px-4 pb-4 pt-8">
        <img className="mx-auto max-w-[60vw] w-full max-h-[45vh] object-contain" width={245} src="/networking.gif" alt="" />
        <div className="font-semibold text-[24px] leading-[32px] mt-4">Нетворкинг</div>
        <div className="text-[14px] leading-[20px] mt-4 px-4">
          Ищите участников по интересам, целям и проектам.
        </div>
        <div className="text-[14px] leading-[20px] mt-4 px-4">
  Начинайте диалоги и договаривайтесь о встречах прямо в приложении
        </div>
        <div className="flex gap-3 justify-center mt-4">
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
          <div className="w-[8px] h-[8px] rounded-full bg-bg-quaternary" />
          <div className="w-[8px] h-[8px] rounded-full bg-bg-quaternary" />
        </div>
      </div>
    </div>
    <Actions allowNext={true} showBack={true} onNext={onNext} onBack={onBack} />
  </AnimatingContainer>
}
const Questions = ({onNext, onBack, onSkip}: {onNext: () => void, onBack?: () => void, onSkip: () => void}) => {
  return <AnimatingContainer className="flex-1 flex flex-col px-4 pt-1 pb-8">
    <div className="flex justify-end">
      <Button color="tertiary" size="xl" onClick={onSkip}>Пропустить</Button>
    </div>
    <div className="flex-1 flex flex-col justify-end bg-gradient-to-t from-[rgba(12,14,18,1)] to-fg-brand-primary text-center overflow-hidden rounded-[16px] mb-5">
      <div className="mt-auto relative bg-gradient-to-b from-[rgba(12,14,18,0)] via-[rgba(12,14,18,0.5)] to-[rgba(12,14,18,1)] px-4 pb-4 pt-8">
        <img className="mx-auto max-w-[60vw] w-full max-h-[45vh] object-contain" width={245} src="/questions.gif" alt="" />
        <div className="font-semibold text-[24px] leading-[32px] mt-4">Вопросы спикеру </div>
        <div className="text-[14px] leading-[20px] mt-4 max-w-[296px] mx-auto">
          Задавайте вопросы спикерам прямо во время выступлений.
        </div>
        <div className="text-[14px] leading-[20px] mt-4 px-4 mx-auto">
          Самые интересные будут выбраны голосованием и заданы со сцены
        </div>
        <div className="flex gap-3 justify-center mt-4">
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
          <div className="w-[8px] h-[8px] rounded-full bg-bg-quaternary" />
        </div>
      </div>
    </div>
    <Actions allowNext={true} showBack={true} onNext={onNext} onBack={onBack} />
  </AnimatingContainer>
}
const AIVideo = ({onNext, onBack, onSkip}: {onNext: () => void, onBack?: () => void, onSkip: () => void}) => {
  return <AnimatingContainer className="flex-1 flex flex-col px-4 pt-1 pb-8">
    <div className="flex justify-end">
      <Button color="tertiary" size="xl" onClick={onSkip}>Пропустить</Button>
    </div>
    <div className="flex-1 flex flex-col justify-end bg-gradient-to-t from-[rgba(12,14,18,1)] to-fg-brand-primary rounded-[16px] mb-5 overflow-hidden text-center">
      <div className="mt-auto relative bg-gradient-to-b from-[rgba(12,14,18,0)] via-[rgba(12,14,18,0.5)] to-[rgba(12,14,18,1)] px-4 pb-4 pt-8">
        <img src="/AI_MK.gif" className="mx-auto max-w-[60vw] w-full max-h-[45vh] object-contain" alt="" />
        <div className="font-semibold text-[24px] leading-[32px] mt-4">Общение с ИИ-аватаром</div>
        <div className="text-[14px] leading-[20px] mt-4 px-4">
          Получайте советы от ИИ-аватара Маргулана Сейсембаева — на основе его книг и реальных выступлений
        </div>
        <div className="flex gap-3 justify-center mt-4">
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
          <div className="w-[8px] h-[8px] rounded-full bg-fg-brand-primary_alt" />
        </div>
      </div>
    </div>
    <Actions allowNext={true} showBack={true} onNext={onNext} onBack={onBack} />
  </AnimatingContainer>
}

function Actions({allowNext, showBack, onNext, onBack}: {
  allowNext: boolean,
  showBack: boolean,
  onNext: () => void,
  onBack?: () => void
}) {
  return <div className="flex justify-between gap-4">
    {showBack && <Button className="w-full border border-border-disabled_subtle" color="tertiary" size="xl" iconLeading={<ChevronLeft />} onClick={onBack}>Назад</Button>
    }
    {
      allowNext && <Button className="ml-auto w-full" size="xl" iconTrailing={<ChevronRight />} onClick={onNext}>Далее</Button>
    }
    {
      !allowNext && <Button className="text-fg-disabled bg-bg-disabled border border-border-disabled_subtle shadow-none outline-none before:hidden" size="xl" iconTrailing={<ChevronRight />}>Далее</Button>
    }
  </div>
}

function Logo() {
  return <svg width="217" height="36" viewBox="0 0 217 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M164.881 13.3657C164.881 12.0151 164.275 11.2544 163.499 10.9129C164.104 10.4937 164.508 9.85726 164.508 8.80164C164.508 7.18715 163.39 6.00732 161.698 6.00732H157.646V16.3307H161.791C163.809 16.3307 164.896 15.2441 164.896 13.3501L164.881 13.3657ZM158.935 7.23372H161.341C162.521 7.23372 163.173 7.83915 163.173 8.81716C163.173 10.028 162.381 10.4316 161.341 10.4316H158.935V7.24924V7.23372ZM158.935 15.1354V11.5959H161.59C162.847 11.5959 163.546 12.1548 163.546 13.3657C163.546 14.5765 162.8 15.1354 161.59 15.1354H158.935Z" fill="white"/>
<path d="M172.937 13.6297V8.80176H171.68V13.3503C171.68 14.6232 171.121 15.3063 169.91 15.3063C168.699 15.3063 168.125 14.6232 168.125 13.3503V8.80176H166.867V13.6297C166.867 15.3529 167.923 16.4861 169.91 16.4861C171.897 16.4861 172.937 15.3684 172.937 13.6297Z" fill="white"/>
<path d="M178.929 12.0779L177.314 11.6742C176.786 11.5345 176.352 11.3482 176.352 10.7894C176.352 10.2305 176.848 9.79584 177.857 9.79584C178.804 9.79584 179.487 10.215 179.518 11.0999H180.729C180.729 9.67165 179.565 8.6626 177.857 8.6626C176.15 8.6626 175.156 9.59403 175.156 10.7894C175.156 11.8605 175.808 12.5281 176.879 12.792L178.649 13.2422C179.332 13.4129 179.658 13.7389 179.658 14.2046C179.658 14.8411 179.022 15.2913 177.935 15.2913C176.848 15.2913 176.088 14.8411 176.088 13.8476H174.846C174.892 15.6018 176.15 16.4711 177.935 16.4711C179.813 16.4711 180.916 15.4931 180.916 14.2046C180.916 13.0559 180.201 12.4039 178.929 12.0779Z" fill="white"/>
<path d="M184.222 5.79004H182.841V7.23377H184.222V5.79004Z" fill="white"/>
<path d="M184.145 8.80176H182.903V16.3464H184.145V8.80176Z" fill="white"/>
<path d="M190.107 8.67773C189.098 8.67773 188.384 9.01926 187.98 9.57813V8.81745H186.723V16.3621H187.98V11.8136C187.98 10.4164 188.818 9.85756 189.827 9.85756C191.023 9.85756 191.628 10.5406 191.628 11.8136V16.3621H192.886V11.5341C192.886 9.81098 191.783 8.69326 190.107 8.69326V8.67773Z" fill="white"/>
<path d="M197.914 8.67773C196.02 8.67773 194.794 9.8265 194.794 11.8291V13.3194C194.794 15.322 196.02 16.4707 197.914 16.4707C199.575 16.4707 200.848 15.5548 200.988 13.9559H199.731C199.591 14.9649 198.83 15.2909 197.914 15.2909C196.828 15.2909 196.051 14.8407 196.051 13.3194V13.0244H201.004V11.8291C200.972 9.67126 199.684 8.67773 197.914 8.67773ZM199.746 11.9222H196.051V11.8291C196.051 10.3233 196.812 9.82651 197.914 9.82651C198.908 9.82651 199.715 10.3233 199.746 11.8291V11.9222Z" fill="white"/>
<path d="M206.546 12.0779L204.931 11.6742C204.403 11.5345 203.969 11.3482 203.969 10.7894C203.969 10.2305 204.465 9.79584 205.475 9.79584C206.421 9.79584 207.105 10.215 207.136 11.0999H208.346C208.346 9.67165 207.182 8.6626 205.475 8.6626C203.767 8.6626 202.773 9.59403 202.773 10.7894C202.773 11.8605 203.425 12.5281 204.497 12.792L206.266 13.2422C206.949 13.4129 207.275 13.7389 207.275 14.2046C207.275 14.8411 206.639 15.2913 205.552 15.2913C204.465 15.2913 203.705 14.8411 203.705 13.8476H202.463C202.509 15.6018 203.767 16.4711 205.552 16.4711C207.431 16.4711 208.533 15.4931 208.533 14.2046C208.533 13.0559 207.819 12.4039 206.546 12.0779Z" fill="white"/>
<path d="M214.091 12.0779L212.476 11.6742C211.948 11.5345 211.514 11.3482 211.514 10.7894C211.514 10.2305 212.01 9.79584 213.019 9.79584C213.966 9.79584 214.649 10.215 214.681 11.0999H215.891C215.891 9.67165 214.727 8.6626 213.019 8.6626C211.312 8.6626 210.318 9.59403 210.318 10.7894C210.318 11.8605 210.97 12.5281 212.041 12.792L213.811 13.2422C214.494 13.4129 214.82 13.7389 214.82 14.2046C214.82 14.8411 214.184 15.2913 213.097 15.2913C212.01 15.2913 211.25 14.8411 211.25 13.8476H210.008C210.054 15.6018 211.312 16.4711 213.097 16.4711C214.975 16.4711 216.078 15.4931 216.078 14.2046C216.078 13.0559 215.364 12.4039 214.091 12.0779Z" fill="white"/>
<path d="M163.855 20.9108V19.731H158.484V22.3079L159.54 23.6896C158.375 24.1398 157.521 25.242 157.521 26.7788C157.521 28.9056 159.058 30.1941 161.076 30.1941C162.225 30.1941 163.048 29.8991 163.778 29.2161L164.43 30.0544H166.013L158.857 20.9108H163.855ZM163.095 28.3157C162.644 28.7659 162.07 29.0453 161.092 29.0453C159.974 29.0453 158.81 28.3467 158.81 26.7943C158.81 25.6766 159.462 24.9315 160.347 24.7297L163.11 28.3312L163.095 28.3157Z" fill="white"/>
<path d="M174.039 19.731L170.825 30.0544H172.253L173.045 27.3843H177.376L178.168 30.0544H179.596L176.414 19.731H174.023H174.039ZM173.402 26.2044L175.218 20.088L177.035 26.2044H173.402Z" fill="white"/>
<path d="M181.087 20.9573H183.245V28.828H181.087V30.0544H186.738V28.828H184.58V20.9573H186.738V19.731H181.087V20.9573Z" fill="white"/>
<path d="M0 8.70856H7.04787V30.085H10.1216V8.70856H17.185V5.86768H0V8.70856Z" fill="white"/>
<path d="M28.1448 12.0155C25.7852 12.0155 24.2018 12.6986 23.1461 14.0957V5.85254H20.2432V30.0699H23.1461V19.2652C23.1461 16.0207 25.1643 14.7478 27.4928 14.7478C30.2716 14.7478 31.7309 16.3157 31.7309 19.2652V30.0699H34.6339V18.6132C34.6339 14.608 31.9948 12.0155 28.1293 12.0155H28.1448Z" fill="white"/>
<path d="M44.9423 12.0151C40.5645 12.0151 37.7236 14.6852 37.7236 19.3424V22.8043C37.7236 27.4615 40.5645 30.1316 44.9423 30.1316C48.8077 30.1316 51.7573 28.0048 52.0522 24.3101H49.1493C48.8388 26.6387 47.069 27.3838 44.9423 27.3838C42.4119 27.3838 40.6266 26.3593 40.6266 22.8043V22.1212H52.0833V19.3424C52.0212 14.3437 49.0406 12.0151 44.9267 12.0151H44.9423ZM49.1958 19.5442H40.6421V19.3424C40.6421 15.8495 42.4274 14.6852 44.9578 14.6852C47.2553 14.6852 49.1337 15.8495 49.1958 19.3424V19.5442Z" fill="white"/>
<path d="M85.1954 5.89844H80.709V30.0847H83.3636H85.1954H96.4658V25.5983H85.1954V20.2426H95.317V15.7406H85.1954V10.3849H96.4658V5.89844H85.1954Z" fill="white"/>
<path d="M73.04 29.0912L66.9547 5.89844H62.3751H62.1112H57.8887V30.0847H62.3751V6.89197L68.4605 30.0847H73.04H73.3039H77.542V5.89844H73.04V29.0912Z" fill="white"/>
<path d="M134.842 5.89844H129.998H119.97V10.3849H128.818L123.649 30.0847H128.492L133.662 10.3849H138.521V5.89844H134.842Z" fill="white"/>
<path d="M113.03 5.89844L108.311 13.8933L103.576 5.89844H98.748L105.889 17.9916L98.748 30.0847H103.576L108.311 22.0899L113.03 30.0847H117.874L110.733 17.9916L117.874 5.89844H113.03Z" fill="white"/>
<path d="M148.472 0H147.587V36H148.472V0Z" fill="white"/>
</svg>
}