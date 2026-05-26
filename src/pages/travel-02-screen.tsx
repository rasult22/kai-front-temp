import AnimatingContainer from "@/components/animating-container";
import WebApp from "@twa-dev/sdk";
import { Clock, MarkerPin01, UserCheck01 } from "@untitledui/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Travel02Screen = () => {
  const navigate = useNavigate()
  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        navigate(-1)
    })
  }, [])
    return (
        <AnimatingContainer className="flex h-dvh flex-col text-primary bg-bg-primary px-4" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
          <div className="pt-4 text-[28px] leading-[120%] font-black">Гала ужин для участников слёта</div>
          <div className="text-[20px] leading-[130%] font-semibold mt-5 flex items-center gap-2">
            <Clock size={20} className="text-fg-brand-secondary" />
            <span>
              Дата и время
            </span>
          </div>
          <div className="mt-5">
            22 ноября, с 18:00 до 23:00
          </div>
          <div className="text-[20px] leading-[130%] font-semibold mt-5 flex items-center gap-2">
            <MarkerPin01 size={20} className="text-fg-brand-secondary" />
            <div>Локация</div>
          </div>
          <div className="mt-5 text-[20px] leading-[150%] font-medium">Emirates Palace Mandarin Oriental </div>
          <div className="mt-5">
            <img className="w-full" width={328} height={328} src="/palace.png" alt="" />
            <div className="mt-4">
              Emirates Palace Mandarin Oriental — один из самых знаковых отелей Абу-Даби, символ роскоши и арабского гостеприимства. Пространство поражает масштабами: мраморные залы, золотые детали, безупречные сады и частный пляж, которые создают ощущение настоящего дворца.
            </div>
          </div>
           <div className="text-[20px] leading-[130%] font-semibold mt-5 flex items-center gap-2">
            <UserCheck01 size={20} className="text-fg-brand-secondary" />
            <div>Дресс-код</div>
          </div>
          <div className="mt-5 text-[20px] leading-[150%] font-medium">Black Tie with a Silver Touch</div>
          <div className="mt-5 pb-8">
            <img className="w-full" width={328} height={328} src="/dress.png" alt="" />
            <div className="mt-4">
              Элегантная вечерняя классика с сиянием серебра — это стильный выбор для особого события. Строгие линии и изящные детали создают завершённый образ, который вдохновляет и подчеркивает торжественность вечера.
            </div>
          </div>
          <div className="font-black text-[28px] leading-[120%]">Вера Брежнева</div>
          <div className="mt-6 text-[20px] leading-[130%] font-semibold">Специальный гость</div>
          <img className="w-full mt-5" width={328} height={328} src="/vera.png" alt="" />
          <div className="mt-4 pb-8">
            Вера Брежнева — специальная гостья нашего гала-ужина. <br/> <br/> Артистка с яркой сценической энергетикой, безупречным вкусом и многолетней историей выступлений на крупнейших площадках мира, она стала одним из самых популярных артистов в мире.
          </div>
        </AnimatingContainer>
    );
};

export default Travel02Screen;
