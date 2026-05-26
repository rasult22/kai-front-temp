import AnimatingContainer from "@/components/animating-container"
import { BadgeWithIcon } from "@/components/base/badges/badges"
import { Button } from "@/components/base/buttons/button"
import { Checkbox } from "@/components/base/checkbox/checkbox"
import { Input } from "@/components/base/input/input"
import { Select } from "@/components/base/select/select"
import { TextArea } from "@/components/base/textarea/textarea"
import FullScreenLoader from "@/components/fullscreen-loader"
import { queryClient } from "@/queries"
import { createVideoInviteAndGetUrls } from "@/queries/avatar"
import { updateUser } from "@/queries/user"
import WebApp from "@twa-dev/sdk"
import { Check, ChevronLeft, ChevronRight, Flag05 } from "@untitledui/icons"
import { ReactNode, useState } from "react"
import { useNavigate } from "react-router"

export default function FormFilling () {
  const [currentStep, setCurrentStep] = useState<'name' | 'biz_info' | 'role' | 'incomes' | 'goal' | 'mastermind' | 'success' | 'loading'>('name')
  const [onboardingData, setOnboardingData] = useState<{
    name: CollectNameData,
    biz_info: BizInfoData,
    role: RoleInBizData,
    incomes: IncomesData,
    goal: GoalsData,
    mastermind: MastermindData,
  }>({
    role: {
      role: '',
      selectedRole: '',
    },
    biz_info: {
      bizSector: '',
      otherBizSector: undefined,
      selectedBizSector: undefined
    },
    name: {
      lastName: '',
      firstName: '',
      middleName: '',
      noMiddleName: false,
    },
    incomes: {
      income: '',
      selectedIncome: '',
    },
    goal: {
      goal: '',
    },
    mastermind: {
      selectedTags: [],
    }
  })
  const nextStep = (step: 'name' | 'biz_info' | 'role' | 'incomes' | 'goal' | 'mastermind' | 'success' | 'loading') => {
    try { WebApp.HapticFeedback.impactOccurred('medium') } catch {}
    setCurrentStep(step)
  }
  const finishForm = async (data: MastermindData) => {
    nextStep('loading')
    try {
      // Запуск генерации персонального приветствия на фоне 
      createVideoInviteAndGetUrls(onboardingData.name.firstName, true)
      
      await updateUser({
        fullname: `${onboardingData.name.firstName.trim()} ${onboardingData.name.noMiddleName ? onboardingData.name.lastName.trim() : onboardingData.name.lastName.trim() + ' ' + onboardingData.name.middleName.trim()}`,
        business_domain: onboardingData.biz_info.selectedBizSector === 'other' ? onboardingData.biz_info.otherBizSector : onboardingData.biz_info.bizSector,
        role_in_business: onboardingData.role.role,
        yearly_income: onboardingData.incomes.income,
        participation_goal: onboardingData.goal.goal,
        username: WebApp.initDataUnsafe.user?.username || undefined,
        photo_url: WebApp.initDataUnsafe.user?.photo_url,
        mastermind_tags: data.selectedTags.length ? data.selectedTags.join(', ') : undefined,  
      })
      nextStep('success')
    } catch(e) {
      // handle error
      console.log(e)
    }
  }
  return <div className="flex flex-1 flex-col p-6 min-h-0">
    {currentStep === 'name' && <CollectName initialData={onboardingData.name} onNext={(data) => {
      setOnboardingData({
        ...onboardingData,
        name: data,
      })
      nextStep('biz_info')
    }} />}
    {currentStep === 'biz_info' && <BizInfo initialData={onboardingData.biz_info} onBack={() => {
      nextStep('name')
    }} onNext={(data) => {
      setOnboardingData({
        ...onboardingData,
        biz_info: data,
      })
      nextStep('role')  
    }} />}
    {currentStep === 'role' && <RoleInBiz initialData={onboardingData.role} onBack={() => {
      nextStep('biz_info')
    }} onNext={(data) => {
      setOnboardingData({
        ...onboardingData,
        role: data,
      })
      nextStep('incomes')
    }} />}
    {currentStep === 'incomes' && <Incomes initialData={onboardingData.incomes} onBack={() => {
      nextStep('role')
    }} onNext={(data) => {
      setOnboardingData({
        ...onboardingData,
        incomes: data,
      })
      nextStep('goal')
    }} />}
    {currentStep === 'goal' && <Goals initialData={onboardingData.goal} onBack={() => {
      nextStep('incomes')
    }} onNext={(data) => {
      setOnboardingData({
        ...onboardingData,
        goal: data,
      })
      nextStep('mastermind')
    }} />}
    {currentStep === 'mastermind' && <Mastermind initialData={onboardingData.mastermind} onBack={() => {
      nextStep('goal')
    }} onNext={(data) => {
      console.log(data, 'mastermind_data')
      setOnboardingData({
        ...onboardingData,
        mastermind: data,
      })
      finishForm(data)
    }} />}
    {currentStep === 'loading' && <FullScreenLoader />}
    {currentStep === 'success' && <Success />}
  </div>
}

function StepsIndicator({ steps, currentStep }: {
  steps: number,
  currentStep: number,
}) {
  return <div className="flex gap-2">
    {Array.from({ length: steps }, (_, i) => (
      <div
        key={i}
        className={`w-full rounded-full h-[6px] ${
          i < currentStep
            ? "bg-fg-brand-primary_alt"
            : "bg-bg-quaternary"
        }`}
      />
    ))}
  </div>
}

type CollectNameData = {
    lastName: string,
    firstName: string,
    middleName: string,
    noMiddleName: boolean,
}
function CollectName({onNext, initialData}: {
  initialData: CollectNameData,
  onNext: ({lastName, firstName, middleName, noMiddleName}: CollectNameData) => void,
}) {
  const [lastName, setLastName] = useState(initialData.lastName)
  const [firstName, setFirstName] = useState(initialData.firstName)
  const [middleName, setMiddleName] = useState(initialData.middleName)
  const [noMiddleName, setNoMiddleName] = useState(initialData.noMiddleName)

  const [lastNameTouched, setLastNameTouched] = useState(false)
  const [firstNameTouched, setFirstNameTouched] = useState(false)
  const [middleNameTouched, setMiddleNameTouched] = useState(false)

  const isLastNameEmpty = lastName.trim() === ''
  const isFirstNameEmpty = firstName.trim() === ''
  const isMiddleNameEmpty = middleName.trim() === ''

  const isLastNameInvalid = lastNameTouched && isLastNameEmpty
  const isFirstNameInvalid = firstNameTouched && isFirstNameEmpty
  const isMiddleNameInvalid = !noMiddleName && middleNameTouched && isMiddleNameEmpty

  const allowNext = !isLastNameEmpty && !isFirstNameEmpty && (noMiddleName || !isMiddleNameEmpty)

  const submit = () => {
    onNext({
      lastName,
      firstName,
      middleName,
      noMiddleName,
    })
  }
  return <AnimatingContainer className="flex flex-col flex-1">
    <StepsIndicator steps={6} currentStep={1}/>
    <div className="mt-8 flex-1">
      <Title>Как Вас зовут?</Title>
      <div className="mt-6 flex flex-col gap-4">
        <Input
          size="md"
          isRequired
          label="Фамилия"
          placeholder="Ваша фамилия"
          value={lastName}
          onChange={setLastName}
          onBlur={() => setLastNameTouched(true)}
          isInvalid={isLastNameInvalid}
        />
        <Input
          size="md"
          isRequired
          label="Имя"
          placeholder="Ваше имя"
          value={firstName}
          onChange={setFirstName}
          onBlur={() => setFirstNameTouched(true)}
          isInvalid={isFirstNameInvalid}
        />
        <Input
          size="md"
          label="Отчество"
          placeholder="Ваше отчество"
          value={middleName}
          onChange={setMiddleName}
          onBlur={() => setMiddleNameTouched(true)}
          isRequired={!noMiddleName}
          isInvalid={isMiddleNameInvalid}
        />
        <Checkbox
          label="Отчества нет"
          size="md"
          isSelected={noMiddleName}
          onChange={(selected) => {
            setNoMiddleName(!!selected)
            if (selected) {
              setMiddleName('')
              setMiddleNameTouched(false)
            }
          }}
        />
      </div>
    </div>
    <Actions allowNext={allowNext} showBack={false} onNext={submit} />
  </AnimatingContainer>
}

type BizInfoData = {
  selectedBizSector?: string,
  bizSector?: string,
  otherBizSector?: string
}
function BizInfo({onNext, onBack, initialData}: {
  initialData: BizInfoData
  onNext: (data: BizInfoData) => void,
  onBack?: () => void,
}) {
  const [selectedBizSector, setSelectedBizSector] = useState<string | undefined>(initialData.selectedBizSector)
  const [otherBizSector, setOtherBizSector] = useState<string>(initialData.otherBizSector || '')
  const [bizSectorTouched, setBizSectorTouched] = useState(false)
  const [otherBizSectorTouched, setOtherBizSectorTouched] = useState(false)

  const isBizSectorEmpty = !selectedBizSector
  const isOtherBizSectorEmpty = otherBizSector.trim() === ''

  const isBizSectorInvalid = bizSectorTouched && isBizSectorEmpty
  const isOtherBizSectorInvalid = otherBizSectorTouched && isOtherBizSectorEmpty

  const allowNext = !isBizSectorEmpty && (selectedBizSector !== 'other' || !isOtherBizSectorEmpty)

  const items = [
      { label: "Производство", id: "manufacturing" },
      { label: "Логистика и транспорт", id: "logistics-transport" },
      { label: "Маркетинг и реклама", id: "marketing-advertising" },
      { label: "Розничная торговля", id: "retail" },
      { label: "Оптовая торговля", id: "wholesale" },
      { label: "E-commerce / Онлайн-торговля", id: "ecommerce" },
      { label: "IT и разработка ПО", id: "it-software" },
      { label: "Консалтинг и бизнес-услуги", id: "consulting" },
      { label: "Финансовые услуги", id: "financial-services" },
      { label: "Образование и обучение", id: "education" },
      { label: "HoReCa (рестораны, кафе, гостиницы)", id: "horeca" },
      { label: "Недвижимость и строительство", id: "real-estate-construction" },
      { label: "Здравоохранение и медицинские услуги", id: "healthcare" },
      { label: "Сельское хозяйство", id: "agriculture" },
      { label: "Бьюти-сфера", id: "beauty" },
      { label: "Туризм и путешествия", id: "tourism-travel" },
      { label: "Медиа и развлечения", id: "media-entertainment" },
      { label: "Энергетика", id: "energy" },
      { label: "Другое (Указать своё)", id: "other" },
  ];
  const submit = () => {
    const selectedItem = items.find(item => item.id === selectedBizSector)
    if (!selectedItem) return;
    onNext({
      selectedBizSector,
      bizSector: selectedItem.label,
      otherBizSector: otherBizSector.trim(),
    })
  }
  return <AnimatingContainer className="flex flex-col flex-1">
      <StepsIndicator steps={6} currentStep={2}/>
      <div className="mt-8 flex-1">
        <Title>Деятельность  компании</Title>
        <div className="mt-4">Укажите основное направление вашего бизнеса </div>
        <div className="mt-6 flex flex-col gap-4">
          <Select
            isRequired
            size="md"
            defaultValue={selectedBizSector}
            isInvalid={isBizSectorInvalid}
            placeholder="Выберите сферу"
            onBlur={() => setBizSectorTouched(true)}
            onChange={(value) => {
              if (value) setSelectedBizSector(value as string)
            }}
            items={items}
        >
            {(item) => (
                <Select.Item id={item.id} isDisabled={item.isDisabled} icon={item.icon} avatarUrl={item.avatarUrl}>
                    {item.label}
                </Select.Item>
            )}
        </Select>
          {selectedBizSector === 'other' &&  
            <Input
              size="md"
              isRequired
              placeholder="Укажите свою сферу"
              label="Другое"
              value={otherBizSector}
              onChange={setOtherBizSector}
              onBlur={() => setOtherBizSectorTouched(true)}
              isInvalid={isOtherBizSectorInvalid}
            />
          }
        </div>
      </div>
      <Actions allowNext={allowNext} showBack={true} onBack={() => {
        onBack?.()
      }} onNext={submit} />
  </AnimatingContainer>
}

type RoleInBizData = {
  selectedRole?: string,
  role?: string,
  otherRole?: string,
}

function RoleInBiz({onNext, onBack, initialData}: {
  initialData: RoleInBizData,
  onNext: (data: RoleInBizData) => void,
  onBack?: () => void,
}) {
  const [selectedRole, setSelectedRole] = useState<string | undefined>(initialData.selectedRole)
  const [otherRole, setOtherRole] = useState<string>(initialData.otherRole || '')
  const [roleTouched, setRoleTouched] = useState(false)
  const [otherRoleTouched, setOtherRoleTouched] = useState(false)

  const isRoleEmpty = !selectedRole
  const isOtherRoleEmpty = otherRole.trim() === ''

  const isRoleInvalid = roleTouched && isRoleEmpty
  const isOtherRoleInvalid = otherRoleTouched && isOtherRoleEmpty

  const allowNext = !isRoleEmpty && (selectedRole !== 'other' || !isOtherRoleEmpty)

  const items = [
    { label: "Владелец бизнеса", id: "business-owner" },
    { label: "Инвестор", id: "investor" },
    { label: "Генеральный директор", id: "ceo" },
    { label: "Сотрудник в найме", id: "employee" },
    { label: "Фрилансер", id: "freelancer" },
    { label: "Другое (Указать своё)", id: "other" },
  ];

  const submit = () => {
    const selectedItem = items.find(item => item.id === selectedRole)
    if (!selectedItem) return;
    onNext({
      selectedRole,
      role: selectedRole === 'other' ? otherRole.trim() : selectedItem.label,
      otherRole: selectedRole === 'other' ? otherRole.trim() : undefined,
    })
  }

  return <AnimatingContainer className="flex flex-col flex-1">
    <StepsIndicator steps={6} currentStep={3}/>
    <div className="mt-8 flex-1">
      <Title>Ваша роль в бизнесе</Title>
      <div className="mt-4">Кем вы являетесь в компании?</div>
      <div className="mt-6 flex flex-col gap-4">
        <Select
          isRequired
          size="md"
          placeholder="Выберите свою роль"
          items={items}
          defaultValue={selectedRole}
          isInvalid={isRoleInvalid}
          onBlur={() => setRoleTouched(true)}
          onChange={(value) => {
            if (value) setSelectedRole(value as string)
          }}
        >
          {(item) => (
            <Select.Item id={item.id}>
              {item.label}
            </Select.Item>
          )}
        </Select>
        {selectedRole === 'other' && (
          <Input
            size="md"
            isRequired
            placeholder="Укажите свою роль"
            label="Другое"
            value={otherRole}
            onChange={setOtherRole}
            onBlur={() => setOtherRoleTouched(true)}
            isInvalid={isOtherRoleInvalid}
          />
        )}
      </div>
    </div>
    <Actions allowNext={allowNext} showBack={true} onBack={() => {
      onBack?.()
    }} onNext={submit} />
  </AnimatingContainer>
}
type IncomesData = {
  income?: string,
  selectedIncome?: string,
}

type GoalsData = {
  goal: string,
}
function Incomes({onNext, onBack, initialData}: {
  onNext: (data: IncomesData) => void,
  onBack?: () => void,
  initialData: IncomesData,
}) {
  const [selectedIncome, setSelectedIncome] = useState<string | undefined>(initialData.selectedIncome);

  const items = [
      { label: "до $50 000", id: "up-to-50k" },
      { label: "от $50 000 до $100 000", id: "50k-100k" },
      { label: "от $100 000 до $200 000", id: "100k-200k" },
      { label: "от $200 000 до $300 000", id: "200k-300k" },
      { label: "от $300 000 до $500 000", id: "300k-500k" },
      { label: "от $500 000 до $1 000 000", id: "500k-1m" },
      { label: "от $1 000 000 до $3 000 000", id: "1m-3m" },
      { label: "более $3 000 000", id: "over-3m" },
  ];
 
  return <AnimatingContainer className="flex flex-col flex-1">
    <StepsIndicator steps={6} currentStep={4}/>
    <div className="mt-8 flex-1">
      <BadgeWithIcon className="mb-4" type="pill-color" size="lg"  color="warning" iconLeading={Flag05}>
        Осталось немного
      </BadgeWithIcon>
      <Title>Личный годовой доход</Title>
      <div className="mt-4">Укажите диапазон доход за прошлый год — с учётом зарплаты, дивидендов и других выплат из бизнеса. </div>
      <div className="mt-6 flex flex-col gap-4">
         <Select
            isRequired
            size="md"
            placeholder="Ваш доход"
            items={items}
            defaultValue={selectedIncome}
            onChange={(value) => {
              if (value) setSelectedIncome(value as string)
            }}
        >
            {(item) => (
                <Select.Item id={item.id} isDisabled={item.isDisabled} icon={item.icon} avatarUrl={item.avatarUrl}>
                    {item.label}
                </Select.Item>
            )}
        </Select>
      </div>
    </div>
    <Actions allowNext={!!selectedIncome} showBack={true} onBack={() => {
      onBack?.()
    }} onNext={() => onNext({
      income: items.find(i => i.id === selectedIncome)?.label || '',
      selectedIncome,
    })} />
  </AnimatingContainer>
}
function Goals({onNext, onBack, initialData}: {
  initialData: GoalsData,
  onNext: (data: GoalsData) => void,
  onBack?: () => void,
}) {
  const [goal, setGoal] = useState(initialData.goal)

  const allowNext = goal.trim() !== ''

  const submit = () => {
    onNext({
      goal
    })
  }

  return <AnimatingContainer className="flex flex-col flex-1">
    <StepsIndicator steps={6} currentStep={5}/>
    <div className="mt-8 flex-1">
      <BadgeWithIcon className="mb-4" type="pill-color" size="lg"  color="warning" iconLeading={Flag05}>
        Еще 2 вопроса
      </BadgeWithIcon>
      <Title>Цель участия на слете</Title>
      <div className="mt-4">
        Напишите подробнее, чтобы мы подобрали для вас наиболее интересные активности и знакомства
      </div>
      <div className="mt-6 flex flex-col gap-4">
         <TextArea isRequired placeholder="Напишите вашу цель" hint="Например, познакомиться с людьми, найти партнёров, вдохновиться идеями или продвинуть свой проект. Это поможет нам сделать ваш опыт полезнее." rows={5} value={goal} onChange={setGoal} />
      </div>
    </div>
    <Actions allowNext={allowNext} showBack={true} onBack={() => {
      onBack?.()
    }} onNext={submit} />
  </AnimatingContainer>
}
type MastermindData = {
  selectedTags: string[],
}
function Mastermind({onNext, onBack, initialData}: {
  initialData: MastermindData,
  onNext: (data: MastermindData) => void,
  onBack?: () => void,
}) {
  const options = [
    "AI и автоматизация бизнес-процессов",
    "Выход из операционной системы и делегирование задач",
    "Управление капиталом и личными финансами",
    "Инвестиционные стратегии вложения капитала",
    "Внедрение технологии Кайдзен в жизнь и бизнес",
    "Построение и управление командой",
    "Стратегия роста и масштабирование бизнеса",
    "Развитие личного бренда",
    "Масштабирование производства",
    "Как быть поистине счастливым и прожить счастливую жизнь!"
  ]

  const [selectedTags, setSelectedTags] = useState<string[]>(initialData.selectedTags || [])
  const [touched, setTouched] = useState(false)
  const allowNext = selectedTags.length >= 3

  const toggle = (text: string, isSelected: boolean) => {
    setTouched(true)
    setSelectedTags(prev => {
      if (isSelected) return [...prev, text]
      return prev.filter(t => t !== text)
    })
  }

  const submit = () => {
    onNext({ selectedTags })
  }

  return <AnimatingContainer className="flex flex-col flex-1 min-h-0">
    <StepsIndicator steps={6} currentStep={6}/>
    <div className="mt-8 flex flex-col flex-1 overflow-auto">
      <BadgeWithIcon className="mx-auto" type="pill-color" size="lg"  color="success" iconLeading={Check}>
        Полезно
      </BadgeWithIcon>
      <div className="text-center mt-4">
        <Title>Мастермайнд-сессии с экспертами</Title>
      </div>
      <div className="mt-4 text-center text-text-secondary">
        На слёте пройдут мастермайнд-сессии по ключевым темам развития бизнеса
      </div>
      <div className="mt-4 font-medium">
        Выберите минимум 3 темы, которые наиболее актуальны для вас:
      </div>

      <div className="mt-2 text-text-secondary">
        Выбрано {selectedTags.length} из 3+
      </div>
      {touched && selectedTags.length < 3 && (
        <div className="mt-2 text-fg-error-primary">Выберите минимум 3 темы для продолжения</div>
      )}

      <div className="flex flex-col gap-4 overflow-auto py-6">
        {options.map(text => (
          <Checkbox
            key={text}
            label={text}
            size="md"
            isSelected={selectedTags.includes(text)}
            onChange={(isSel) => toggle(text, !!isSel)}
          />
        ))}
      </div>
    </div>
    <Actions allowNext={allowNext} showBack={true} onBack={() => {
      onBack?.()
    }} onNext={submit} />
  </AnimatingContainer>
}

function Title({ children }: { children: ReactNode }) {
  return <div className="text-[30px] leading-[38px] font-semibold">{children}</div>
}

function Actions({allowNext, showBack, onNext, onBack}: {
  allowNext: boolean,
  showBack: boolean,
  onNext: () => void,
  onBack?: () => void
}) {
  return <div className="flex justify-between gap-4 pt-4">
    {!showBack && <Button className="w-[50%] border opacity-0 border-border-disabled_subtle" color="tertiary" size="xl" iconLeading={<ChevronLeft />}>Назад</Button>}
    {showBack && <Button className="w-[50%] border border-border-disabled_subtle" color="tertiary" size="xl" iconLeading={<ChevronLeft />} onClick={onBack}>Назад</Button>}
    {
      allowNext && <Button className="ml-auto w-[50%]" size="xl" iconTrailing={<ChevronRight />} onClick={onNext}>Далее</Button>
    }
    {
      !allowNext && <Button className="w-[50%] text-fg-disabled bg-bg-disabled border border-border-disabled_subtle shadow-none outline-none before:hidden" size="xl" iconTrailing={<ChevronRight />}>Далее</Button>
    }
  </div>
}

function Success() {
  const navigate = useNavigate()
  return <AnimatingContainer className="flex flex-col flex-1">
    <div className="flex-1 flex flex-col items-center">
      <div className="flex justify-center">
        <svg width="183" height="183" viewBox="0 0 153 153" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.3">
          <rect x="27" y="27" width="99" height="99" rx="49.5" stroke="#EA620C" stroke-width="9"/>
          </g>
          <g opacity="0.1">
          <rect x="4.5" y="4.5" width="144" height="144" rx="72" stroke="#EA620C" stroke-width="9"/>
          </g>
          <path d="M62.998 76.501L71.998 85.501L89.9981 67.501M106.498 76.501C106.498 93.0695 93.0666 106.501 76.498 106.501C59.9295 106.501 46.498 93.0695 46.498 76.501C46.498 59.9324 59.9295 46.501 76.498 46.501C93.0666 46.501 106.498 59.9324 106.498 76.501Z" stroke="#EA620C" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div className="font-semibold text-[30px] leading-[38px] mt-6">Анкета создана!</div>
      <div className="text-center mt-4">Теперь у вас есть доступ к приложению, которое поможет вам на протяжении всего мероприятия.</div>
      <div className="mt-6">
        <svg width="193" height="32" viewBox="0 0 193 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M146.561 11.8806C146.561 10.6801 146.023 10.0039 145.333 9.70034C145.871 9.32777 146.23 8.76201 146.23 7.82368C146.23 6.38858 145.237 5.33984 143.732 5.33984H140.131V14.5162H143.815C145.609 14.5162 146.575 13.5503 146.575 11.8668L146.561 11.8806ZM141.276 6.42997H143.415C144.464 6.42997 145.043 6.96813 145.043 7.83747C145.043 8.9138 144.34 9.27258 143.415 9.27258H141.276V6.44377V6.42997ZM141.276 13.4537V10.3075H143.636C144.754 10.3075 145.375 10.8043 145.375 11.8806C145.375 12.9569 144.712 13.4537 143.636 13.4537H141.276Z" fill="#94979C"/>
          <path d="M153.723 12.1152V7.82373H152.605V11.8669C152.605 12.9984 152.108 13.6055 151.032 13.6055C149.955 13.6055 149.445 12.9984 149.445 11.8669V7.82373H148.327V12.1152C148.327 13.6469 149.265 14.6543 151.032 14.6543C152.798 14.6543 153.723 13.6607 153.723 12.1152Z" fill="#94979C"/>
          <path d="M159.048 10.736L157.613 10.3772C157.144 10.253 156.757 10.0874 156.757 9.59066C156.757 9.0939 157.199 8.70753 158.096 8.70753C158.938 8.70753 159.545 9.0801 159.572 9.86665H160.649C160.649 8.59713 159.614 7.7002 158.096 7.7002C156.578 7.7002 155.695 8.52814 155.695 9.59066C155.695 10.5428 156.275 11.1362 157.227 11.3707L158.8 11.7709C159.407 11.9227 159.697 12.2125 159.697 12.6265C159.697 13.1922 159.131 13.5924 158.165 13.5924C157.199 13.5924 156.523 13.1922 156.523 12.3091H155.419C155.46 13.8684 156.578 14.6411 158.165 14.6411C159.835 14.6411 160.814 13.7718 160.814 12.6265C160.814 11.6053 160.18 11.0258 159.048 10.736Z" fill="#94979C"/>
          <path d="M163.754 5.14697H162.525V6.43028H163.754V5.14697Z" fill="#94979C"/>
          <path d="M163.685 7.82373H162.581V14.5301H163.685V7.82373Z" fill="#94979C"/>
          <path d="M168.985 7.71338C168.088 7.71338 167.453 8.01696 167.094 8.51373V7.83757H165.977V14.5439H167.094V10.5008C167.094 9.25887 167.839 8.76211 168.736 8.76211C169.799 8.76211 170.337 9.36927 170.337 10.5008V14.5439H171.455V10.2524C171.455 8.72071 170.475 7.72718 168.985 7.72718V7.71338Z" fill="#94979C"/>
          <path d="M175.924 7.71338C174.241 7.71338 173.15 8.73451 173.15 10.5146V11.8393C173.15 13.6194 174.241 14.6405 175.924 14.6405C177.4 14.6405 178.532 13.8264 178.656 12.4051H177.538C177.414 13.302 176.738 13.5918 175.924 13.5918C174.958 13.5918 174.268 13.1916 174.268 11.8393V11.5771H178.67V10.5146C178.642 8.59652 177.497 7.71338 175.924 7.71338ZM177.552 10.5974H174.268V10.5146C174.268 9.17608 174.944 8.73451 175.924 8.73451C176.807 8.73451 177.525 9.17608 177.552 10.5146V10.5974Z" fill="#94979C"/>
          <path d="M183.597 10.736L182.162 10.3772C181.693 10.253 181.306 10.0874 181.306 9.59066C181.306 9.0939 181.748 8.70753 182.645 8.70753C183.487 8.70753 184.094 9.0801 184.121 9.86665H185.198C185.198 8.59713 184.163 7.7002 182.645 7.7002C181.127 7.7002 180.244 8.52814 180.244 9.59066C180.244 10.5428 180.823 11.1362 181.775 11.3707L183.349 11.7709C183.956 11.9227 184.245 12.2125 184.245 12.6265C184.245 13.1922 183.68 13.5924 182.714 13.5924C181.748 13.5924 181.072 13.1922 181.072 12.3091H179.968C180.009 13.8684 181.127 14.6411 182.714 14.6411C184.383 14.6411 185.363 13.7718 185.363 12.6265C185.363 11.6053 184.728 11.0258 183.597 10.736Z" fill="#94979C"/>
          <path d="M190.303 10.736L188.868 10.3772C188.399 10.253 188.012 10.0874 188.012 9.59066C188.012 9.0939 188.454 8.70753 189.351 8.70753C190.193 8.70753 190.8 9.0801 190.827 9.86665H191.904C191.904 8.59713 190.869 7.7002 189.351 7.7002C187.833 7.7002 186.95 8.52814 186.95 9.59066C186.95 10.5428 187.529 11.1362 188.482 11.3707L190.055 11.7709C190.662 11.9227 190.952 12.2125 190.952 12.6265C190.952 13.1922 190.386 13.5924 189.42 13.5924C188.454 13.5924 187.778 13.1922 187.778 12.3091H186.674C186.715 13.8684 187.833 14.6411 189.42 14.6411C191.09 14.6411 192.069 13.7718 192.069 12.6265C192.069 11.6053 191.434 11.0258 190.303 10.736Z" fill="#94979C"/>
          <path d="M145.65 18.5873V17.5386H140.875V19.8292L141.813 21.0573C140.778 21.4575 140.02 22.4372 140.02 23.8033C140.02 25.6938 141.386 26.8391 143.18 26.8391C144.201 26.8391 144.932 26.577 145.581 25.9698L146.16 26.7149H147.568L141.206 18.5873H145.65ZM144.973 25.1694C144.573 25.5696 144.063 25.818 143.193 25.818C142.2 25.818 141.165 25.1971 141.165 23.8171C141.165 22.8236 141.744 22.1613 142.531 21.9819L144.987 25.1832L144.973 25.1694Z" fill="#94979C"/>
          <path d="M154.701 17.5386L151.845 26.7149H153.114L153.818 24.3415H157.668L158.372 26.7149H159.641L156.812 17.5386H154.687H154.701ZM154.135 23.2928L155.75 17.856L157.364 23.2928H154.135Z" fill="#94979C"/>
          <path d="M160.967 18.6287H162.885V25.6248H160.967V26.7149H165.99V25.6248H164.072V18.6287H165.99V17.5386H160.967V18.6287Z" fill="#94979C"/>
          <path d="M0 7.74105H6.26477V26.7423H8.99699V7.74105H15.2756V5.21582H0V7.74105Z" fill="#94979C"/>
          <path d="M25.0179 10.6804C22.9204 10.6804 21.5129 11.2875 20.5746 12.5294V5.20215H17.9941V26.7287H20.5746V17.1245C20.5746 14.2405 22.3684 13.109 24.4383 13.109C26.9083 13.109 28.2054 14.5027 28.2054 17.1245V26.7287H30.7859V16.545C30.7859 12.9848 28.44 10.6804 25.0041 10.6804H25.0179Z" fill="#94979C"/>
          <path d="M39.9488 10.6802C36.0575 10.6802 33.5322 13.0536 33.5322 17.1933V20.2705C33.5322 24.4102 36.0575 26.7837 39.9488 26.7837C43.3848 26.7837 46.0066 24.8932 46.2688 21.609H43.6883C43.4124 23.6789 41.8393 24.3412 39.9488 24.3412C37.6995 24.3412 36.1126 23.4305 36.1126 20.2705V19.6634H46.2964V17.1933C46.2412 12.75 43.5917 10.6802 39.935 10.6802H39.9488ZM43.7297 17.3727H36.1265V17.1933C36.1265 14.0885 37.7133 13.0536 39.9626 13.0536C42.0048 13.0536 43.6745 14.0885 43.7297 17.1933V17.3727Z" fill="#94979C"/>
          <path d="M75.7301 5.24316H71.7422V26.7421H74.1018H75.7301H85.7482V22.7542H75.7301V17.9935H84.7271V13.9918H75.7301V9.23109H85.7482V5.24316H75.7301Z" fill="#94979C"/>
          <path d="M64.9249 25.8589L59.5157 5.24316H55.445H55.2104H51.457V26.7421H55.445V6.12631L60.8542 26.7421H64.9249H65.1595H68.9266V5.24316H64.9249V25.8589Z" fill="#94979C"/>
          <path d="M119.86 5.24316H115.555H106.641V9.23109H114.506L109.911 26.7421H114.216L118.811 9.23109H123.13V5.24316H119.86Z" fill="#94979C"/>
          <path d="M100.472 5.24316L96.2766 12.3497L92.0679 5.24316H87.7764L94.1239 15.9926L87.7764 26.7421H92.0679L96.2766 19.6356L100.472 26.7421H104.777L98.4292 15.9926L104.777 5.24316H100.472Z" fill="#94979C"/>
          <path d="M131.975 0H131.188V32H131.975V0Z" fill="#94979C"/>
        </svg>
      </div>
      <div className="mt-6 font-bold text-center">Хотите узнать, как именно оно будет полезно для вас?</div>
    </div>
    <div className="flex flex-col gap-3">
      <Button onClick={() => {
        try { WebApp.HapticFeedback.impactOccurred('medium') } catch {}
        queryClient.invalidateQueries({
          queryKey: ['user_data']
        })
        navigate('/tutorial', {
          replace: true
        })
      }} className="w-full" size="xl">Продолжить</Button>
    </div>
  </AnimatingContainer>
}