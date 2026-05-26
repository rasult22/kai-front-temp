import React, { useEffect, useState } from "react";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { ArrowLeft, Send01 } from "@untitledui/icons";
import { useNavigate, useSearchParams } from "react-router";
import VoteCard from "@/components/vote-card";
import WebApp from "@twa-dev/sdk";
import { postQuestion, useQuestions } from "@/queries/questions";
import { queryClient } from "@/queries";
import AnimatingContainer from "@/components/animating-container";

export const VotingScreen = () => {
    const [params] = useSearchParams()
    const event_id = params.get('event_id') || 0
    const navigate = useNavigate()
    const { data, isLoading, error, isError } = useQuestions(Number(event_id))
    useEffect(() => {
        WebApp.BackButton.show()
        WebApp.BackButton.onClick(() => {
            WebApp.HapticFeedback.impactOccurred('medium')
            navigate(-1)
        })
    }, [])

    if (!event_id) {
        navigate('/404')
        return null
    }
    if (isLoading) {
        return  <AnimatingContainer className="flex h-dvh flex-col text-primary" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
           <Header questionCount={0}/>
            <div className="flex-1 flex items-center justify-center bg-bg-primary">
                <div>Загрузка...</div>           
            </div>
        </AnimatingContainer>
    }
    if (isError) {
        return  <div className="flex h-dvh flex-col text-primary" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
            <div className="text-text-error-primary">{error.message}</div>           
        </div>
    }
    return (
        <div className="flex h-dvh flex-col text-primary" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
           {/* header */}
           <Header questionCount={data?.length || 0}/>
           <div className="flex-1 bg-bg-primary p-4 flex flex-col gap-4 overflow-auto">
             <TitleAndDesc />
             {data?.map((question, index) => (
                <VoteCard index={index + 1} question_id={question.id} event_id={Number(event_id)} created_at={question.created_at} photo_url={question.client.photo_url} fullname={question.client.fullname} questionTitle={question.text} key={question.id} voteCount={question.likes_count} isVoted={question.is_liked}></VoteCard>
             ))}
           </div>
           <QuestionInput event_id={Number(event_id)} />
        </div>
    );
};

function getQuestionDeclension(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'вопросов';
  }
  
  if (lastDigit === 1) {
    return 'вопрос';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'вопроса';
  }
  
  return 'вопросов';
}

function Header({ questionCount }: { questionCount: number }) {
    const navigate = useNavigate();

    return <div className="py-2 px-4 flex justify-between items-center">
        <ButtonUtility onClick={() => navigate(-1)} color="tertiary" icon={<ArrowLeft size={20} data-icon />} />
        <div className="flex flex-col justify-center items-center">
            <div className="font-medium text-[16px] leading-[24px] text-primary">Вопросы спикеру</div>
            <div className="text-[12px] leading-[18px] text-tertiary mt-[2px]">{questionCount} {getQuestionDeclension(questionCount)}</div>
        </div>
        <ButtonUtility className="opacity-0" icon={<ArrowLeft size={20} data-icon />} />
    </div>
}
function TitleAndDesc() {
    return <div>
        <div className="text-[14px] leading-[20px] text-secondary font-semibold text-center">Задайте свой вопрос спикеру</div>
        <div className="text-[14px] leading-[20px] text-tertiary mt-3 text-center">Самые популярные вопросы будут озвучены во время панельной дискуссии</div>
    </div>
}
function QuestionInput({event_id}:{event_id: number}) {
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (isLoading) return;
        if (question.trim()) {
            // Handle question submission
            console.log("Submitting question:", question);
            const text = question;
            setQuestion("")
            setIsLoading(true)
            await postQuestion(text, Number(event_id))
            await queryClient.invalidateQueries({queryKey: ['questions', event_id]})
            setIsLoading(false)
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center gap-2">
                <Input
                    value={question}
                    onChange={(e) => setQuestion(e)}
                    onKeyDown={handleKeyDown}
                    placeholder="Задайте свой вопрос"
                    className="flex-1"
                    size="md"
                />
                <Button
                    onClick={handleSubmit}
                    isDisabled={!question.trim()}
                    isLoading={isLoading}
                    size="md"
                    color="tertiary"
                    iconLeading={<Send01 className="text-fg-quaternary"/>}
                    className="px-3 bg-bg-primary border border-primary"
                />
            </div>
        </div>
    );
}