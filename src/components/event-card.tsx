import { ArrowRight, Clock, LinkExternal02, MarkerPin01, MessageQuestionSquare, Stars02 } from "@untitledui/icons"
import { Badge, BadgeWithDot } from "./base/badges/badges"
import { Button } from "./base/buttons/button";
import { ButtonUtility } from "./base/buttons/button-utility";
import { useNavigate } from "react-router";
import WebApp from "@twa-dev/sdk";
import { Attachment } from "@/queries/schedules";

export default function EventCard({type, text, time, has_materials, has_questions, event_id, attachments, location, moreInfo=false, moreInfoLink}: {
  has_materials: boolean,
  has_questions: boolean,
  type: "upcoming" | "completed" | "live",
  text: string,
  time: string,
  event_id: number,
  location?: string,
  moreInfo?: boolean,
  moreInfoLink?: string,
  attachments: Attachment[]
}) {
  const navigate = useNavigate()
  const isUpcoming = type === "upcoming";
  const isPast = type === "completed";
  const isCurrent = type === "live";
  const diagnostic_data = localStorage.getItem('ai_diagnostics_result')

  return <div className={`border  p-4 rounded-[16px] ${isCurrent ? "border-brand bg-bg-tertiary" : "border-primary"}`}>
    {/* header */}
    <div className="text-secondary">
      <div className="flex justify-between items-center">
        <div className={`flex items-center gap-2 ${isCurrent ? "text-brand-secondary dark:text-brand-600" : "text-primary"}`}>
          <Clock size={20}/>
          <div className={`${isCurrent ? "text-brand-secondary" : "text-secondary"}`}>{time}</div>
        </div>
        {
          isUpcoming && <BadgeWithDot size="md" type="color" color="gray">Скоро</BadgeWithDot>
        }
        {
          isPast && <Badge size="md" type="color">Завершено</Badge>
        }
        {
          isCurrent && <Badge size="md" type="color" color="brand">Идет сейчас</Badge>
        }
      </div>
    </div>
    {location && 
      <div className="flex items-center gap-2 mt-3">
        <MarkerPin01 size={20} />
        <div className="text-secondary text-[14px] leading-[20px]">
          {location}
        </div>
      </div>
    }
    {/* title */}
    <div className="text-primary font-medium text-[16px] leading-[24px] mt-4">
      {text}
    </div>
    
    {
      moreInfo &&
      <Button onClick={() => {
        if (moreInfoLink) {
          navigate(moreInfoLink)
        }
      }} size="lg" className="w-full mt-4" iconTrailing={LinkExternal02}>Подробнее</Button>
    }
    {
      event_id === 18 && !diagnostic_data &&
      <Button onClick={() => {
        navigate('/ai-diagnostics')
      }} size="lg" className="w-full mt-4">Начать AI диагностику</Button>
    }
    {
      event_id === 18 && diagnostic_data &&
      <Button onClick={() => {
        navigate('/ai-diagnostics')
      }} size="lg" className="w-full mt-4">Пройти еще раз</Button>
    }
    {
      event_id === 18 && diagnostic_data &&
      <Button onClick={() => {
        navigate(`/ai-diagnostics-result?data=${diagnostic_data}`)
      }} size="lg" className="w-full mt-4">Результаты диагностики</Button>
    }
    <div>

    </div>
    {/* questions */}
    {has_questions &&
      <div className="bg-primary border border-secondary text-primary p-4 mt-4 rounded-[12px]">
        <div className="flex items-center gap-3">
          <MessageQuestionSquare size={20} className="text-border-brand shrink-0"/>
          <div className="text-[16px] leading-[24px] font-semibold">
            Вопросы спикеру
          </div>
        </div>
        <div className="text-secondary text-[14px] leading-[20px] mt-3">Напишите свой вопрос или голосуйте за вопросы других</div>
        <Button onClick={() => {
          WebApp.HapticFeedback.impactOccurred('medium')
          navigate(`/voting?event_id=${event_id}`)
        }} className="w-full mt-3" size="lg" iconTrailing={<ArrowRight size={20} data-icon />}>Открыть</Button>
      </div>
    }
     {/* materials alert */}
    {
      (isPast) && has_materials && attachments.length < 1 && 
      <div className="bg-primary border border-secondary flex items-center gap-3 p-4 mt-4 rounded-[12px]">
        <Stars02 size={20} className="text-border-brand shrink-0"/>
        <div className="text-[14px] leading-[20px]">
          Здесь будут доступны ключевые материалы из выступления спикера.
        </div>
      </div>
    }
    {/* materials */}
    {has_materials &&
      <div>
        {
          attachments.map((attachment) => {
            if (attachment.type === 'pdf' && attachment.file) {
              return <PDFFile url={attachment.file} key={attachment.id} type="basic" title={attachment.title} />
            } else if (attachment.type === 'link' && attachment.link) {
              return <PDFFile url={attachment.link} key={attachment.id} type="shmasic" title={attachment.title} />
            }
          })
        }
      </div>
    }
  </div>
}

function PDFFile({type, title, url}: {type: 'basic' | 'shmasic', title: string, url: string}) {
  return (<div onClick={() => {
    WebApp.HapticFeedback.impactOccurred('medium')
    WebApp.openLink(url)
  }} className="bg-primary flex items-center gap-4 border border-secondary text-primary p-4 mt-4 rounded-[12px]">
    {type === 'basic' ? <FileTypeIcon /> : <FileTypeIcon2 />}
    <div>
      <div className="font-medium text-[14px] leading-[20px] text-secondary">{title}</div>
      <div className="text-[14px] leading-[20px] text-tertiary">Google Drive</div>
    </div>
    <ButtonUtility onClick={() => {
      WebApp.HapticFeedback.impactOccurred('medium')
    }} className="self-start ml-auto" color="tertiary" icon={<LinkExternal02 size={16}/>} />
  </div>)
}

function FileTypeIcon() {
  return <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z" fill="#D92D20"/>
    <path opacity="0.3" d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z" fill="white"/>
    <path d="M11.7491 32V25.4545H14.3315C14.8279 25.4545 15.2508 25.5494 15.6003 25.739C15.9497 25.9265 16.216 26.1875 16.3993 26.522C16.5847 26.8544 16.6773 27.2379 16.6773 27.6726C16.6773 28.1072 16.5836 28.4908 16.3961 28.8232C16.2086 29.1555 15.9369 29.4144 15.5811 29.5998C15.2274 29.7852 14.7991 29.8778 14.2963 29.8778H12.6503V28.7688H14.0726C14.3389 28.7688 14.5584 28.723 14.731 28.6314C14.9057 28.5376 15.0356 28.4087 15.1209 28.2447C15.2082 28.0785 15.2519 27.8878 15.2519 27.6726C15.2519 27.4553 15.2082 27.2656 15.1209 27.1037C15.0356 26.9396 14.9057 26.8129 14.731 26.7234C14.5562 26.6317 14.3347 26.5859 14.0662 26.5859H13.1329V32H11.7491ZM19.8965 32H17.5762V25.4545H19.9157C20.5741 25.4545 21.1408 25.5856 21.616 25.8477C22.0911 26.1076 22.4565 26.4815 22.7122 26.9695C22.97 27.4574 23.0989 28.0412 23.0989 28.7209C23.0989 29.4027 22.97 29.9886 22.7122 30.4787C22.4565 30.9687 22.089 31.3448 21.6096 31.6069C21.1323 31.869 20.5613 32 19.8965 32ZM18.9601 30.8143H19.839C20.2481 30.8143 20.5922 30.7418 20.8713 30.5969C21.1526 30.4499 21.3635 30.223 21.5041 29.9162C21.6469 29.6072 21.7183 29.2088 21.7183 28.7209C21.7183 28.2372 21.6469 27.842 21.5041 27.5352C21.3635 27.2283 21.1536 27.0025 20.8745 26.8576C20.5954 26.7127 20.2513 26.6403 19.8422 26.6403H18.9601V30.8143ZM24.1241 32V25.4545H28.4579V26.5955H25.5079V28.1552H28.1702V29.2962H25.5079V32H24.1241Z" fill="white"/>
  </svg>
}

function FileTypeIcon2() {
  return <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z" fill="#7F56D9"/>
  <path opacity="0.3" d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z" fill="white"/>
</svg>
}