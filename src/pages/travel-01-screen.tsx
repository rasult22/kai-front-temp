import AnimatingContainer from "@/components/animating-container";
import { Badge } from "@/components/base/badges/badges";
import WebApp from "@twa-dev/sdk";
import { Clock, MarkerPin01 } from "@untitledui/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Travel01Screen = () => {
  const navigate = useNavigate()
  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        navigate(-1)
    })
  }, [])
    return (
        <AnimatingContainer className="flex h-dvh flex-col bg-bg-primary text-primary px-4" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
          <div className="pt-4 text-[28px] leading-[120%] font-black">Экскурсия в Qasr Al Watan и TeamLab Phenomena</div>
          <div className="text-[20px] leading-[130%] font-semibold mt-5">
            Время и место встречи
          </div>
          <div className="mt-5 flex items-center gap-8">
            <div className="flex items-center gap-3">
              <MarkerPin01 className="text-fg-brand-secondary" />
              <div>Отель “Sofitel” </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-fg-brand-secondary" />
              <div>10:00</div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Badge size="lg">Есть трансфер</Badge>
            <Badge size="lg">Обратно в 13:00</Badge>
          </div>

          <div className="mt-8">
            <img className="w-full" width={328} height={328} src="/qasr.png" alt="" />
            <div className="font-medium text-[20px] leading-[150%] mt-4">Qasr Al Watan</div>
            <div className="mt-4">
              Qasr Al Watan — это один из самых впечатляющих дворцов ОАЭ, открытый для посещения. Архитектурный шедевр и символ культурного наследия страны. Здесь можно увидеть роскошные залы, купола невероятной высоты, редкие экспонаты, коллекции рукописей и артефактов, а также почувствовать атмосферу настоящей арабской величественности.
            </div>
          </div>
          <div className="mt-8 pb-8">
            <img className="w-full" width={328} height={328} src="/teamlab.png" alt="" />
            <div className="font-medium text-[20px] leading-[150%] mt-4">TeamLab Phenomena</div>
            <div className="mt-4">
              TeamLab Phenomena — это иммерсивное арт-пространство мирового уровня, где искусство оживает вокруг вас. Инсталляции реагируют на движение, свет и звук, создавая ощущение, будто вы находитесь внутри живой цифровой вселенной.
            </div>
          </div>
        </AnimatingContainer>
    );
};

export default Travel01Screen;
