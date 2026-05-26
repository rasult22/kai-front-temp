import AnimatingContainer from "@/components/animating-container";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { Confidentials, PublicOferta } from "./onboarding/onboarding-screen";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "@untitledui/icons";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
export default function ClubLandingScreen() {
  const [open, setOpen] = useState(false);
  
  const navigate = useNavigate()

  useEffect(() => {
      WebApp.BackButton.show()
      WebApp.BackButton.onClick(() => {
          WebApp.HapticFeedback.impactOccurred('medium')
          navigate(-1)
      })
    }, [])
    
  return (
    <AnimatingContainer
      className="flex h-dvh bg-black flex-col text-primary relative"
      style={{
        paddingTop: WebApp.safeAreaInset.top + 36,
        paddingBottom: WebApp.safeAreaInset.bottom,
      }}
      >
      {open && <Payment onClose={() => setOpen(false)}/> }
      <div className="fixed bg-[rgba(240,95,4,1)] w-[641px] h-[641px] rounded-full left-[-50%] top-[25%] blur-[110px] translate-y-[-50%]" />
      <div className="flex-1 z-10 overflow-auto">
        <img src="/kaizen-club.png" alt="" />
        <div className="px-4 text-[28px] leading-[120%] font-black mt-4">
          Становитесь частью Кайдзен Клуба
        </div>
        <div className="px-4 text-[14px] leading-[20px] text-text-secondary mt-4">
          Кайдзен Клуб объединяет более 140 предпринимателей из 20+ стран, которые развивают бизнес и жизнь через осознанность, поддержку и общие ценности
        </div>
        <div className="px-4 text-[20px] leading-[130%] font-medium text-text-primary mt-4">
          Станьте резидентом Kaizen Club и получите подарочный сертификат на 10 000 $
        </div>
        <div className="px-4 leading-[150%] flex flex-col gap-3 mt-3">
          <p>Что входит в сертификат:</p>
          <p>• 5 000 $ — сертификат на программу Год с Маргуланом </p>
          <p>• 2 000 $ — Travel Mind </p>
          <p>• 1 000 $ — участие в слёте ГСМ </p>
          <p>• 1 000 $ — участие в слёте Kaizen Club </p>
          <p>• 1 000 $ — резидентство Kaizen Club для друга</p>
        </div>
        <div className="px-4 text-[14px] leading-[150%] text-text-tertiary mt-4">
          Сертификат действует до 31.12.2025 и доступен всем активным и новым резидентам, которые присоединятся в ближайшие дни.
        </div>
      </div>
      <div className="bg-black pt-4 pb-8 shrink-0">
        
        <div className="px-4 pt-4 z-10">
          <Button onClick={() => setOpen(true)} size="xl" className="w-full">
             Вступить в клуб и получить сертификат
          </Button>
        </div>
      </div>
    </AnimatingContainer>
  );
}

const paymentCards = [
    {
        value: "tiptop",
        title: "Казахстанской картой",
        description: "TipTop Pay: Visa, MasterCard, UnionPay",
        logo: <VisaIcon className="h-8 w-11.5" />,
        link: 'https://c.tiptoppay.kz/payments/cd75e28deac4421483f8d2c7bf182700',
        sum: '447 100 ₸'
     
    },
    {
        value: "stripe",
        title: "Иностранной картой ",
        description: "Stripe",
        logo: <StripeIcon className="h-8 w-11.5" />,
        link: 'https://buy.stripe.com/7sYbJ3fE29hfaNmduW4Vy17',
        sum: '850,00 $'
    },
    {
        value: "prodamus",
        title: "Картой РФ",
        description: "Prodamus: МИР, Visa, MasterCard",
        logo: <RusPay className="h-8 w-11.5" />,
        link: 'https://platforma-margulan.payform.ru/?invoice_id=2dbd18c9c0f2f9311de933cdd0103f89&paylink=1',
        sum: '₽ 69 700.00'
    }
];
import * as RadioGroups from "@/components/base/radio-groups/radio-groups";
import { StripeIcon, VisaIcon } from "@/components/foundations/payment-icons";

function Payment({onClose}:{onClose: () => void}) {
  const [agree, setAgree] = useState(false);
  const [showOferta, setShowOferta] = useState(false)
  const [showConfidentials, setShowConfidentials] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('tiptop')
  return (<motion.div className="fixed top-0 left-0 w-full h-full bg-bg-primary flex flex-1 flex-col z-[100] px-6 pt-6 pb-8"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      style={{
        paddingTop: WebApp.safeAreaInset.top + 36,
        paddingBottom: WebApp.safeAreaInset.bottom
      }}>
        {showOferta && <PublicOferta onClose={() => setShowOferta(false)}/>}
        {showConfidentials && <Confidentials onClose={() => setShowConfidentials(false)}/>}
        <div className="flex flex-col flex-1">
          {/* Heading */}
          <div className="flex justify-between items-center">
            <ButtonUtility onClick={onClose} color="tertiary" icon={<ArrowLeft />} />
            <div className="font-medium">Способ оплаты</div>
            <ButtonUtility className="opacity-0" color="tertiary" icon={<ArrowLeft />} />
          </div>
          <div className="flex-1">
            <div className="p-4 bg-bg-secondary mt-4">
              <div className="border-b border-border-primary pb-2">Предоплата на членство в Кайдзен клубе </div>
              <div className="flex justify-between py-2 items-center">
                <div className="font-medium text-text-tertiary">К оплате</div>
                <div className="text-[20px] leading-[30px] font-medium">
                  {paymentCards.find((item) => item.value === selectedPayment)?.sum}
                </div>
              </div>
            </div>
            <div className="font-semibold text-[20px] leading-[30px] mt-5">
              Выберите способ оплаты
            </div>
            <div className="mt-4">
              <RadioGroups.PaymentIcon defaultValue={selectedPayment} onChange={setSelectedPayment} items={paymentCards} />
            </div>
          </div>
          <div className="py-4">
            <Checkbox
              className="mb-4"
              size="md"
              isSelected={agree}
              onChange={(selected) => {
                setAgree(!!selected);
              }}
              label={<div>Даю своё согласие на обработку персональных данных, соглашаюсь c <span onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setShowConfidentials(true)
              }} className="text-bg-brand-primary underline">политикой конфиденциальности</span> и <span  onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                WebApp.openLink('https://drive.google.com/file/d/1dcGWJ2_PNvk2fCbR_-E9YT8qBVfYO8yE/view?usp=sharing')
              }}  className="text-bg-brand-primary underline">договором оферты</span></div>}
            />
            <div className="flex justify-end items-center mt-4">
              <Button isDisabled={!agree} onClick={() => {
                const link = paymentCards.find((item) => item.value === selectedPayment)?.link
                if (link) {
                  WebApp.openLink(link)
                }
              }} size="xl" className="w-full">
                Перейти к оплате
              </Button>
            </div>
          </div>
        </div>

  </motion.div>)
}


function RusPay({className}:{className: string}) {
  return (<svg className={className} width="46" height="32" viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 0.5H42C43.933 0.5 45.5 2.067 45.5 4V28C45.5 29.933 43.933 31.5 42 31.5H4C2.067 31.5 0.5 29.933 0.5 28V4C0.5 2.067 2.067 0.5 4 0.5Z" fill="white"/>
<path d="M4 0.5H42C43.933 0.5 45.5 2.067 45.5 4V28C45.5 29.933 43.933 31.5 42 31.5H4C2.067 31.5 0.5 29.933 0.5 28V4C0.5 2.067 2.067 0.5 4 0.5Z" stroke="#E9EAEB"/>
<path d="M31.7329 14.3723C31.6395 13.795 31.1253 13.4101 30.4243 13.4101C30.1906 13.4101 30.0036 13.4101 29.7699 13.4101C29.3493 13.3619 29.2558 13.5063 29.2558 13.8431C29.2558 15.527 29.2558 17.1629 29.2558 18.8468C29.2558 19.7129 28.4145 20.627 27.433 20.8195C24.3483 21.5411 21.2635 22.2147 18.1788 22.9364C17.8517 23.0326 17.4778 23.0326 17.1038 23.0326C16.9636 23.0326 16.7299 22.9364 16.6832 22.7921C16.6365 22.6959 16.7767 22.5034 16.8702 22.4072C17.0104 22.311 17.1973 22.2147 17.3843 22.1185C17.9451 21.926 18.5527 21.7336 19.1136 21.5411C21.4038 20.7713 23.6939 20.0015 25.9841 19.1836C27.0124 18.8468 27.5732 18.1251 27.5732 17.211C27.62 14.3242 27.5732 11.3893 27.5732 8.50253C27.5732 8.0214 27.3395 7.6365 26.8254 7.44405C26.2178 7.20348 25.6569 7.39593 25.1428 7.6365C21.8711 9.22422 18.6462 10.812 15.3745 12.3997C14.4398 12.8808 13.8789 13.5544 13.8789 14.5167C13.8789 17.2591 13.8789 20.0015 13.8789 22.744C13.8789 22.8883 13.8789 23.0326 13.9256 23.1289C14.2528 24.043 15.0941 24.6204 16.2158 24.6204C18.506 24.6204 20.7962 24.6204 23.0863 24.6204C25.3765 24.6204 27.62 24.6204 29.9101 24.6204C30.4243 24.6204 30.8449 24.5242 31.2188 24.1874C31.6862 23.8025 31.6862 23.2732 31.6862 22.7921C31.6862 20.425 31.7329 14.3723 31.7329 14.3723ZM22.1983 13.5063C22.432 12.8808 22.9461 12.4959 23.6939 12.3997C24.2081 12.3516 24.6287 12.6402 24.7222 13.1214C24.8157 13.8431 23.9744 14.7091 23.0863 14.7091C22.3853 14.7091 21.9646 14.1799 22.1983 13.5063Z" fill="#FD6727"/>
</svg>)

}