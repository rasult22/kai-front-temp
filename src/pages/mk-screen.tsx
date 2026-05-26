import AnimatingContainer from "@/components/animating-container";
import { Avatar } from "@/components/base/avatar/avatar";
import WebApp from "@twa-dev/sdk";
import { Recording02 } from "@untitledui/icons";
import { useNavigate } from "react-router";

export const MkScreen = () => {
    const navigate = useNavigate()
    return (
        <AnimatingContainer className="flex-1 flex flex-col overflow-auto bg-[url('/moon.png')] bg-cover bg-center mt-[-36px]">
            <div className="flex flex-col flex-1 items-center justify-center">
                <Avatar src="/mk-large.png" size="2xl" />
                <div className="font-medium text-[24px] leading-[32px] mt-3">Маргулан Сейсембаев</div>
                <div className="text-text-brand-secondary mt-1">ИИ-аватар с базой знаний </div>
            </div>
            <div className="flex justify-center pb-8">
                <button onClick={() => {
                    WebApp.HapticFeedback.impactOccurred('medium')
                    navigate('/mk-call')
                }} className="bg-green-500 active:scale-95 active:opacity-85 transition-all rounded-[20px] flex items-center py-4 px-5 gap-[10px] font-semibold">
                    <Recording02 />
                    <div>Подключиться</div>
                </button>
            </div>
        </AnimatingContainer>
    );
};
