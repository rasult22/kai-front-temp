import AnimatingContainer from "@/components/animating-container";
import { updateUser, useUserData } from "@/queries/user";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import * as Alerts from "@/components/application/alerts/alerts";
import { useNavigate } from "react-router";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
 const income_items = [
      { label: "до $50 000", id: "up-to-50k" },
      { label: "от $50 000 до $100 000", id: "50k-100k" },
      { label: "от $100 000 до $200 000", id: "100k-200k" },
      { label: "от $200 000 до $300 000", id: "200k-300k" },
      { label: "от $300 000 до $500 000", id: "300k-500k" },
      { label: "от $500 000 до $1 000 000", id: "500k-1m" },
      { label: "от $1 000 000 до $3 000 000", id: "1m-3m" },
      { label: "более $3 000 000", id: "over-3m" },
  ];
 const role_items = [
    { label: "Владелец бизнеса", id: "business-owner" },
    { label: "Инвестор", id: "investor" },
    { label: "Генеральный директор", id: "ceo" },
    { label: "Сотрудник в найме", id: "employee" },
    { label: "Фрилансер", id: "freelancer" },
    { label: "Другое (Указать своё)", id: "other" },
  ];
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
const ProfileScreen = () => {
  const navigate = useNavigate()
  const {data: userData} = useUserData()
 const [lastName, setLastName] = useState(userData?.fullname?.split(' ')[1] || '')
 const [isLoading, setIsLoading] = useState(false)
 const [isSuccess, setIsSuccess] = useState(false)
  const [firstName, setFirstName] = useState(userData?.fullname?.split(' ')[0] || '')
  const incomeItem = income_items.find(item => item.label === userData?.yearly_income)
  const [selectedIncome, setSelectedIncome] = useState<string | undefined>(incomeItem?.id);
  const [lastNameTouched, setLastNameTouched] = useState(false)
  const [firstNameTouched, setFirstNameTouched] = useState(false)
  const [goal, setGoal] = useState(userData?.participation_goal)
  const isLastNameEmpty = lastName.trim() === ''
  const isFirstNameEmpty = firstName.trim() === ''

  const isLastNameInvalid = lastNameTouched && isLastNameEmpty
  const isFirstNameInvalid = firstNameTouched && isFirstNameEmpty
  const selectedBizSectorItem = items.find(item => item.label === userData?.business_domain);
  const [selectedBizSector, setSelectedBizSector] = useState<string | undefined>(selectedBizSectorItem?.id || 'other')
  const [otherBizSector, setOtherBizSector] = useState<string>(selectedBizSectorItem ? '' : userData?.business_domain || '')
  const [bizSectorTouched, setBizSectorTouched] = useState(false)

  const [otherBizSectorTouched, setOtherBizSectorTouched] = useState(false)

  const isBizSectorEmpty = !selectedBizSector
  const isOtherBizSectorEmpty = otherBizSector.trim() === ''

  const isBizSectorInvalid = bizSectorTouched && isBizSectorEmpty
  const isOtherBizSectorInvalid = otherBizSectorTouched && isOtherBizSectorEmpty

  const selectedRoleItem = role_items.find(item => item.label === userData?.role_in_business)
  const [selectedRole, setSelectedRole] = useState<string | undefined>(selectedRoleItem?.id || 'other')
  const [otherRole, setOtherRole] = useState<string>(selectedRoleItem ? '' : userData?.role_in_business || '')
  const [roleTouched, setRoleTouched] = useState(false)
  const [otherRoleTouched, setOtherRoleTouched] = useState(false)

  const isRoleEmpty = !selectedRole
  const isOtherRoleEmpty = otherRole.trim() === ''

  const isRoleInvalid = roleTouched && isRoleEmpty
  const isOtherRoleInvalid = otherRoleTouched && isOtherRoleEmpty
  const allowNextName = !isLastNameEmpty && !isFirstNameEmpty
  const allowNextGoal = goal?.trim() !== ''
  const allowNextIncome = !!selectedIncome
  const allowNextRole = !isRoleEmpty && (selectedRole !== 'other' || !isOtherRoleEmpty)
  const allowNextBizSector = !isBizSectorEmpty && (selectedBizSector !== 'other' || !isOtherBizSectorEmpty)

  const save = async () => {
    setIsLoading(true)
    await updateUser({
      fullname: `${firstName} ${lastName}`,
      participation_goal: goal,
      yearly_income: income_items.find(item => item.id === selectedIncome)?.label || '',
      role_in_business: selectedRole === 'other' ? otherRole : role_items.find(item => item.id === selectedRole)?.label || '',
      business_domain: selectedBizSector === 'other' ? otherBizSector : items.find(item => item.id === selectedBizSector)?.label || '',
    })
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      navigate(-1)
    }, 1500)
    setIsLoading(false)
  }
  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => {
        WebApp.HapticFeedback.impactOccurred('medium')
        navigate(-1)
    })
  }, [])
    return (
        <AnimatingContainer className="flex h-dvh flex-col text-primary px-4" style={{paddingTop: WebApp.safeAreaInset.top + 36, paddingBottom: WebApp.safeAreaInset.bottom}}>
            {isLoading && <AnimatingContainer className='fixed flex items-center justify-center top-0 left-0 w-full h-[100vh] bg-black/80 z-[10000]'>
              <LoadingIndicator size='lg'/>
            </AnimatingContainer>}
            {
              isSuccess &&
                <AnimatingContainer className="fixed bottom-[72px] left-4 right-4 z-[1000]">
                  <Alerts.AlertFloating
                      color="success"
                      title="Изменения сохранены"
                      confirmLabel="View changes"
                      description=""
                  />
                </AnimatingContainer>
            }
          <div className="flex-1 overflow-auto">
            <div
              onClick={() => {
                WebApp.HapticFeedback.impactOccurred("medium");
                WebApp.openTelegramLink("https://t.me/+Q813prb4TPU5NGFi");
              }}
              className="p-4 active:scale-[.98] flex justify-between rounded-[16px] active:opacity-90 transition-all bg-gradient-to-t from-[rgba(0,198,251,1)] to-[rgba(0,91,234,1)]"
            >
              <div className="font-semibold">
                Вступите в чат слета <br/> в Telegram
              </div>
              <TelegramIcon />
            </div>
            <Avatar className="mt-8" src={userData?.photo_url} size="2xl" />
            <div className="mt-8 flex flex-col gap-4">
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
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <Select
                isRequired
                label="Деятельность компании"
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
             <div className="mt-4 flex flex-col gap-4">
                <Select
                  label="Ваша роль в бизнесе"
                  isRequired
                  size="md"
                  placeholder="Выберите свою роль"
                  items={role_items}
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
              <div className="mt-4 flex flex-col gap-4">
                <Select
                    isRequired
                    size="md"
                    label="Личный годовой доход"
                    placeholder="Ваш доход"
                    items={income_items}
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
              <div className="mt-4 flex flex-col gap-4">
                  <TextArea label="Цель участия на слете" isRequired placeholder="Напишите вашу цель" rows={5} value={goal} onChange={setGoal} />
              </div>
          </div>
          <div className="py-4">
            {
              (allowNextName
              && allowNextGoal
              && allowNextIncome
              && allowNextRole
              && allowNextBizSector) ?
              <Button key="allow" onClick={save} size="xl" className="w-full">
                Сохранить
              </Button>
              :
              <Button color="secondary" key="not-allow" size="xl" className="w-full">
                Сохранить
              </Button>
            }
          </div>
        </AnimatingContainer>
    );
};

export default ProfileScreen;


const TelegramIcon = () => {
  return <svg className="mr-4" width="62" height="55" viewBox="0 0 62 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M61.9479 4.74881C62.4311 1.58446 59.4634 -0.913182 56.6882 0.322125L1.41367 24.9262C-0.57649 25.812 -0.430915 28.8682 1.63318 29.5346L13.0322 33.2148C15.2078 33.9172 17.5635 33.554 19.4633 32.2234L45.163 14.2225C45.938 13.6797 46.7827 14.7968 46.1206 15.4889L27.6214 34.8254C25.8269 36.7011 26.1831 39.8795 28.3416 41.2519L49.0535 54.4197C51.3765 55.8966 54.365 54.4129 54.7995 51.567L61.9479 4.74881Z" fill="white"/>
      </svg>
}