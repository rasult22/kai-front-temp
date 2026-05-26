import { useQuery } from "@tanstack/react-query"
import { API_BASE_URL, INIT_DATA } from "./auth"
import WebApp from "@twa-dev/sdk" 

export type ScheduleDay = {
  date: string,
  description: string,
  id: number,
  title: string,
  sessions: ScheduleSession[]
}
export type ScheduleSession = {
  id: number,
  title: string,
  status: 'upcoming' | 'live' | 'completed',
  start_time: string,
  end_time: string,
  attachments: Attachment[],
  has_materials: boolean,
  has_question: boolean
}

export type Attachment = {
  id: number,
  link: string | null,
  file: string | null,
  session: number,
  title: string,
  type: 'pdf' | 'link'
}

export const getSessionStatus = (startTime: string, endTime: string, date: string): 'upcoming' | 'live' | 'completed' => {
  const now = new Date();

  // Создаем даты для начала и конца сессии, указывая часовой пояс Абу-Даби (UTC+4)
  const sessionStart = new Date(`${date}T${startTime}+04:00`);
  const sessionEnd = new Date(`${date}T${endTime}+04:00`);

  // Проверяем, являются ли даты валидными
  if (isNaN(sessionStart.getTime()) || isNaN(sessionEnd.getTime())) {
    console.error('Invalid time format for session', { startTime, endTime, date });
    // Возвращаем 'upcoming' как безопасное значение по умолчанию в случае ошибки
    return 'upcoming';
  }

  // Определяем статус, сравнивая текущее время с временем сессии
  if (now < sessionStart) {
    return 'upcoming';
  } else if (now >= sessionStart && now <= sessionEnd) {
    return 'live';
  } else {
    return 'completed';
  }
}

export const useSchedules = () => useQuery<ScheduleDay[]>({
  queryKey: ['schedules'],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}api/schedules/`, {
      method: 'GET',
      headers: {
        'Authorization': `tma ${WebApp.initData || INIT_DATA}`
      }
    })
    if (!response.ok) {
      throw new Error('Произошла ошибка при загрузке списка расписаний')
    }
    return await response.json()
  }
})


export const useSchedule = (id: number) => useQuery({
  queryKey: ['schedule', id],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}api/schedules/${id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `tma ${WebApp.initData || INIT_DATA}`
      }
    })
    if (!response.ok) {
      throw new Error('Произошла ошибка при загрузке расписания')
    }
    return await response.json()
  }
})