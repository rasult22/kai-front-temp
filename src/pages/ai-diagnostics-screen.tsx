
import AnimatingContainer from "@/components/animating-container";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { getResults } from "@/queries/ai-diagnostics";
import { DATA, IMPLEMENTATION, INFRASTRUCTURE, MODELS, PEOPLE_AND_CULTURE, STRATEGY_AND_GOVERNANCE } from "@/utils/ai-diagnostics-data";
import WebApp from "@twa-dev/sdk";
import { ChevronRight, Stars02, X } from "@untitledui/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type MODULES_TYPE = "STRATEGY_AND_GOVERNANCE" | 'PEOPLE_AND_CULTURE' | 'INFRASTRUCTURE' | 'DATA' | 'MODELS' | 'IMPLEMENTATION'

const AIDiagnosticsScreen = () => {
  const navigate = useNavigate()
  const [currentModule, setCurrentModule] = useState<MODULES_TYPE>('STRATEGY_AND_GOVERNANCE')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [finalData, setFinalData] = useState<{
    moduleName: string,
    user_answers: {
      question: string,
      answer: string
    }[]
  }[]>([])
  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        navigate(-1)
    })
  }, [])
    return (
        <AnimatingContainer className="flex h-dvh flex-col text-primary bg-bg-primary" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
          {/* header */}
          <div className="flex items-center justify-between py-2 px-4">
            <ButtonUtility className="opacity-0" icon={<X />} />
            <div className="flex items-center gap-3">
              <Stars02 className="text-fg-warning-primary" />
              <div className="font-medium">
                AI Диагностика
              </div>
            </div>
            <ButtonUtility onClick={() => {
              navigate(-1)
            }} color="tertiary" icon={<X />} />
          </div>
          { isLoading && <div className='fixed flex flex-col items-center justify-center top-0 left-0 w-full h-[100vh] bg-black/80 z-[10000]'>
            <LoadingIndicator size='lg'/>
            <div className="mt-3 text-[14px] leading-[20px]">Пожалуйста подождите.</div>
            <div className="text-[14px] leading-[20px]">Идет обработка данных...</div>
          </div>}

          { currentModule === 'STRATEGY_AND_GOVERNANCE' && <ModuleTestController currentModule={STRATEGY_AND_GOVERNANCE} onNext={(data) => {
            setFinalData([...finalData, {moduleName: STRATEGY_AND_GOVERNANCE.name, user_answers: data}])
            setCurrentModule('PEOPLE_AND_CULTURE')
          }}/>}
          { currentModule === 'PEOPLE_AND_CULTURE' && <ModuleTestController currentModule={PEOPLE_AND_CULTURE} onNext={(data) => {
            setFinalData([...finalData, {moduleName: PEOPLE_AND_CULTURE.name, user_answers: data}])
            setCurrentModule('INFRASTRUCTURE')
          }}/>}
          { currentModule === 'INFRASTRUCTURE' && <ModuleTestController currentModule={INFRASTRUCTURE} onNext={(data) => {
            setFinalData([...finalData, {moduleName: INFRASTRUCTURE.name, user_answers: data}])
            setCurrentModule('DATA')
          }}/>}
          { currentModule === 'DATA' && <ModuleTestController currentModule={DATA} onNext={(data) => {
            setFinalData([...finalData, {moduleName: DATA.name, user_answers: data}])
            setCurrentModule('MODELS')
          }}/>}
          { currentModule === 'MODELS' && <ModuleTestController currentModule={MODELS} onNext={(data) => {
            setFinalData([...finalData, {moduleName: MODELS.name, user_answers: data}])
            setCurrentModule('IMPLEMENTATION')
          }}/>}
          { currentModule === 'IMPLEMENTATION' && <ModuleTestController currentModule={IMPLEMENTATION} onNext={async (data) => {
            const data_inner = [...finalData, {moduleName: IMPLEMENTATION.name, user_answers: data}]
            setFinalData(data_inner)
            try {
              setIsLoading(true)
              const results = await getResults(data_inner)
              setIsLoading(false)
              navigate(`/ai-diagnostics-result?data=${encodeURIComponent(JSON.stringify(results))}`, {
                replace: true
              })
            } catch (e) {
              console.log(e)
              // handle error
            }
          }}/>}
        </AnimatingContainer>
    );
};

export default AIDiagnosticsScreen;

const ModuleTestController = ({currentModule, onNext}: {currentModule: typeof STRATEGY_AND_GOVERNANCE, onNext: (moduleResults: {question: string, answer: string}[]) => void}) => {
  const totalQuestions = currentModule.questions.length
  const maxIndex = totalQuestions - 1
  const [currentQuestion, setCurrentQuestion] = useState(currentModule.questions[0])
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState<string>('')
  const [answers, setAnswers] = useState<{question: string, answer: string}[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  return (<>
       {/* Current Module */}
          <div className="px-4 pt-4">
            <PartCard stepCount={currentModule.questions.length} currentStep={currentQuestionIndex + 1} label={currentModule.name} />
          </div>
          {/* Current Question */}
          <div key={currentQuestionIndex} className="pb-4 pt-8 px-6 flex-1 overflow-auto relative before:content-[''] before:block before:pointer-events-none before:sticky before:-top-8 before:h-[50px] before:-mt-[50px] before:bg-gradient-to-b before:from-bg-primary before:to-transparent before:z-10 after:content-[''] after:block after:pointer-events-none after:sticky after:-bottom-4 after:h-[50px] after:-mb-[50px] after:bg-gradient-to-t after:from-bg-primary after:to-transparent after:z-10">
              <Question
                onSelect={(answer) => {
                  setCurrentQuestionAnswer(answer);
                }}
                currentQuestionNumber={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
                questionTitle={currentQuestion.question}
                answerVariants={currentQuestion.answers}
              />
          </div>
          <div className="px-6 pt-2 pb-6 flex gap-4">
            <Button className="w-full opacity-0" size="xl" iconTrailing={<ChevronRight />}>Далее</Button>
            <Button onClick={() => {
              const answersFinal = [...answers, {question: currentQuestion.question, answer: currentQuestionAnswer}]
              setAnswers(answersFinal)
              if (currentQuestionIndex === maxIndex) {
                onNext(answersFinal)
                return
              }
              setCurrentQuestionIndex(currentQuestionIndex + 1)
              setCurrentQuestion(currentModule.questions[currentQuestionIndex + 1])
              setCurrentQuestionAnswer('')
            }} isDisabled={!currentQuestionAnswer} className="w-full disabled:bg-bg-disabled" size="xl" iconTrailing={<ChevronRight />}>Далее</Button>
          </div>
        </>
  )
}


const PartCard = ({stepCount, currentStep, label}: {
  stepCount: number,
  currentStep: number,
  label: string
}) => {
  return (
    <AnimatingContainer className="bg-bg-active p-4 rounded-[16px]">
      <div className="flex items-center gap-2">
        <div className="text-center font-medium">
          {label}
        </div>
        <div className="font-medium text-text-tertiary">
          {`${currentStep} из ${stepCount}`}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {Array.from({length: stepCount}, (_, i) => (
          <div  key={i} className={`h-[6px] transition-colors w-full rounded-full ${i > currentStep - 1 ? 'bg-bg-quaternary' : 'bg-fg-brand-primary_alt'}`} />
        ))}
      </div>
    </AnimatingContainer>
  )
}

function Question({
  currentQuestionNumber,
  totalQuestions,
  questionTitle,
  answerVariants,
  onSelect
}: {
  onSelect: (answer: string) => void
  currentQuestionNumber: number,
  totalQuestions: number,
  questionTitle: string,
  answerVariants: {
    title: string,
    description: string
  }[]
}) {
  const [selectedVariant, setSelectedVariant] = useState<{
    title: string,
    description: string}>()
  return (
    <AnimatingContainer key={currentQuestionNumber}>
      <div className="text-[14px] leading-[20px] font-medium text-text-tertiary">{`${currentQuestionNumber}/${totalQuestions}`}</div>
      <div className="text-[20px] leading-[30px] font-semibold mt-3 mb-5">
        {questionTitle}
      </div>
      {answerVariants.map((variant) => (
        <div onClick={() => {
          setSelectedVariant(variant)
          onSelect(`${variant.title}: ${variant.description}
          `)
        }} key={variant.title} className="bg-bg-primary border active:scale-[0.98] transition-transform border-border-secondary p-4 rounded-[16px] mb-3">
          <div className="text-[14px] leading-[20px] font-medium flex justify-between">
            <div>{variant.title}</div>
            <RadioButtonBase isSelected={selectedVariant?.title === variant.title} />
          </div>
          <div className="text-[14px] leading-[20px] text-text-tertiary mt-2">{variant.description}</div>
        </div>
      ))}
    </AnimatingContainer>
  )
}