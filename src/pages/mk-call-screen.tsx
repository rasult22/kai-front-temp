
import AnimatingContainer from "@/components/animating-container";
import SimpleVoiceChat from "@/components/mk-avatar";

const MkCallScreen = () => {
  return (
    <AnimatingContainer className="flex-1 h-dvh text-text-primary px-4 flex flex-col overflow-auto bg-[url('/moon.png')] bg-cover bg-center mt-[-36px]">
        <SimpleVoiceChat />
    </AnimatingContainer>
  )
}
export default MkCallScreen;