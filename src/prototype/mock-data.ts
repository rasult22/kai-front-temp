import type { User } from '@/queries/user'
import type { NetwokingUser } from '@/queries/networking'
import type { ScheduleDay } from '@/queries/schedules'
import type { Question } from '@/queries/questions'
import type { AiDiagnosticsResult } from '@/queries/ai-diagnostics'

export const MOCK_USER: User & { username?: string } = {
  id: 1,
  email: 'demo@kaizenclub.kz',
  fullname: 'Алексей Иванов',
  is_active: true,
  telegram_id: 123456789,
  phone: '+7 777 123 4567',
  business_domain: undefined,
  role_in_business: undefined,
  yearly_income: undefined,
  photo_url: 'https://randomuser.me/api/portraits/men/32.jpg',
  participation_goal: undefined,
  payment_status: true,
  unique_url_id: 'demo-user-001',
  username: 'alexeyivanov',
}

export const MOCK_CLIENT_DETAIL = {
  id: 1,
  user_id: 1,
  telegram_id: 123456789,
  email: 'demo@kaizenclub.kz',
  fullname: 'Алексей Иванов',
  table: '7',
  is_active: true,
}

export const MOCK_NETWORKING_USERS: NetwokingUser[] = [
  {
    id: 2,
    photo_url: 'https://randomuser.me/api/portraits/women/44.jpg',
    username: 'aisultan_k',
    fullname: 'Айсултан Кенжебаев',
    role_in_business: 'Инвестор',
    telegram_id: 200000001,
    business_domain: 'Финансовые услуги',
    participation_goal: 'Ищу стартапы в сфере AI и финтеха для инвестиций серии A',
  },
  {
    id: 3,
    photo_url: 'https://randomuser.me/api/portraits/women/65.jpg',
    username: 'dinara_biz',
    fullname: 'Динара Абильмажинова',
    role_in_business: 'Генеральный директор',
    telegram_id: 200000002,
    business_domain: 'E-commerce / Онлайн-торговля',
    participation_goal: 'Масштабирование маркетплейса на рынок ОАЭ и Саудовской Аравии',
  },
  {
    id: 4,
    photo_url: 'https://randomuser.me/api/portraits/men/75.jpg',
    username: 'timur_ceo',
    fullname: 'Тимур Сериков',
    role_in_business: 'Владелец бизнеса',
    telegram_id: 200000003,
    business_domain: 'Производство',
    participation_goal: 'Внедрить автоматизацию и AI в производственные линии, найти партнёров по экспорту',
  },
  {
    id: 5,
    photo_url: 'https://randomuser.me/api/portraits/women/28.jpg',
    username: 'kamila_md',
    fullname: 'Камила Нурланова',
    role_in_business: 'Владелец бизнеса',
    telegram_id: 200000004,
    business_domain: 'Здравоохранение и медицинские услуги',
    participation_goal: 'Цифровизация сети клиник, обмен опытом с предпринимателями из tech-сектора',
  },
  {
    id: 6,
    photo_url: 'https://randomuser.me/api/portraits/men/52.jpg',
    username: 'arman_dev',
    fullname: 'Арман Бекболатов',
    role_in_business: 'Генеральный директор',
    telegram_id: 200000005,
    business_domain: 'Логистика и транспорт',
    participation_goal: 'Оптимизация логистических маршрутов с помощью AI, нетворкинг с e-commerce игроками',
  },
  {
    id: 7,
    photo_url: 'https://randomuser.me/api/portraits/women/33.jpg',
    username: 'madina_brand',
    fullname: 'Мадина Касымова',
    role_in_business: 'Владелец бизнеса',
    telegram_id: 200000006,
    business_domain: 'Маркетинг и реклама',
    participation_goal: 'Развитие личного бренда, поиск крупных клиентов для digital-агентства',
  },
]

export const MOCK_CONNECTED_USERS: NetwokingUser[] = [
  MOCK_NETWORKING_USERS[0],
  MOCK_NETWORKING_USERS[1],
]

export const MOCK_SCHEDULES: ScheduleDay[] = [
  {
    id: 1,
    date: '2025-11-20',
    title: 'День 1',
    description: 'Первый день слёта',
    sessions: [
      {
        id: 10, title: 'Регистрация и приветственный кофе',
        status: 'completed', start_time: '08:00:00', end_time: '09:00:00',
        attachments: [], has_materials: false, has_question: false,
      },
      {
        id: 11, title: 'Открытие слёта. Приветственное слово Маргулана Сейсембаева',
        status: 'completed', start_time: '09:00:00', end_time: '10:00:00',
        attachments: [], has_materials: true, has_question: true,
      },
      {
        id: 12, title: 'Панельная дискуссия: AI и будущее бизнеса',
        status: 'live', start_time: '10:00:00', end_time: '11:30:00',
        attachments: [], has_materials: true, has_question: true,
      },
      {
        id: 13, title: 'Кофе-брейк',
        status: 'upcoming', start_time: '11:30:00', end_time: '12:00:00',
        attachments: [], has_materials: false, has_question: false,
      },
      {
        id: 14, title: 'Мастермайнд-сессия: Масштабирование бизнеса',
        status: 'upcoming', start_time: '12:00:00', end_time: '13:30:00',
        attachments: [], has_materials: true, has_question: true,
      },
      {
        id: 15, title: 'Обед',
        status: 'upcoming', start_time: '13:30:00', end_time: '14:30:00',
        attachments: [], has_materials: false, has_question: false,
      },
      {
        id: 16, title: 'Выступление: Инвестиционные стратегии 2026',
        status: 'upcoming', start_time: '14:30:00', end_time: '16:00:00',
        attachments: [], has_materials: true, has_question: true,
      },
      {
        id: 17, title: 'Нетворкинг-сессия',
        status: 'upcoming', start_time: '16:00:00', end_time: '17:00:00',
        attachments: [], has_materials: false, has_question: false,
      },
      {
        id: 18, title: 'AI Диагностика вашего бизнеса',
        status: 'upcoming', start_time: '17:00:00', end_time: '18:00:00',
        attachments: [], has_materials: false, has_question: false,
      },
    ],
  },
  {
    id: 2,
    date: '2025-11-21',
    title: 'День 2',
    description: 'Второй день слёта',
    sessions: [
      {
        id: 19, title: 'Утренняя сессия: Управление командой в эпоху AI',
        status: 'upcoming', start_time: '09:00:00', end_time: '10:30:00',
        attachments: [], has_materials: true, has_question: true,
      },
      {
        id: 20, title: 'Кофе-брейк',
        status: 'upcoming', start_time: '10:30:00', end_time: '11:00:00',
        attachments: [], has_materials: false, has_question: false,
      },
      {
        id: 21, title: 'Мастер-класс: Внедрение Кайдзен в жизнь',
        status: 'upcoming', start_time: '11:00:00', end_time: '12:30:00',
        attachments: [], has_materials: true, has_question: true,
      },
      {
        id: 22, title: 'Обед',
        status: 'upcoming', start_time: '12:30:00', end_time: '13:30:00',
        attachments: [], has_materials: false, has_question: false,
      },
      {
        id: 23, title: 'Воркшоп: Построение личного бренда',
        status: 'upcoming', start_time: '13:30:00', end_time: '15:00:00',
        attachments: [], has_materials: true, has_question: false,
      },
      {
        id: 24, title: 'Закрытие дня. Рефлексия',
        status: 'upcoming', start_time: '15:00:00', end_time: '16:00:00',
        attachments: [], has_materials: false, has_question: false,
      },
    ],
  },
  {
    id: 3,
    date: '2025-11-22',
    title: 'День 3',
    description: 'Третий день слёта',
    sessions: [],
  },
]

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 101, session: 12,
    text: 'Какие конкретные AI-инструменты вы рекомендуете для малого бизнеса с бюджетом до $10K?',
    created_at: '2025-11-20T10:15:00Z',
    client: { fullname: 'Динара Абильмажинова', photo_url: 'https://randomuser.me/api/portraits/women/65.jpg', id: 3 },
    likes_count: 12, is_liked: false,
  },
  {
    id: 102, session: 12,
    text: 'Как вы оцениваете риски замены сотрудников на AI-агентов в ближайшие 3 года?',
    created_at: '2025-11-20T10:20:00Z',
    client: { fullname: 'Тимур Сериков', photo_url: 'https://randomuser.me/api/portraits/men/75.jpg', id: 4 },
    likes_count: 8, is_liked: true,
  },
  {
    id: 103, session: 12,
    text: 'Есть ли успешные кейсы внедрения AI в производственных компаниях Казахстана?',
    created_at: '2025-11-20T10:25:00Z',
    client: { fullname: 'Арман Бекболатов', photo_url: 'https://randomuser.me/api/portraits/men/52.jpg', id: 6 },
    likes_count: 5, is_liked: false,
  },
]

export const MOCK_AI_DIAGNOSTICS_RESULT: AiDiagnosticsResult = {
  maturity_level: {
    title: 'Уровень зрелости: Масштабирование',
    description: 'Ваш бизнес находится на стадии активного масштабирования. Основные процессы выстроены, команда сформирована. Сейчас ключевой задачей является оптимизация и автоматизация для поддержания темпов роста.',
  },
  short_desc_of_current_state: {
    title: 'Текущее состояние',
    description: 'Компания демонстрирует стабильный рост выручки (30%+ год к году). Основные бизнес-процессы формализованы, однако есть потенциал для оптимизации через внедрение AI-инструментов. Команда из 50+ человек, есть вызовы с делегированием и сохранением культуры.',
  },
  short_swot_analysis: {
    title: 'SWOT-анализ',
    description: 'Сильные стороны: опытная команда, сильный продукт, лояльная клиентская база. Слабые стороны: зависимость от основателя в ключевых решениях, недостаточная автоматизация. Возможности: выход на рынки ОАЭ, AI-трансформация процессов. Угрозы: растущая конкуренция, дефицит AI-специалистов.',
  },
  strategy_recommendation: {
    title: 'Рекомендации по стратегии',
    description: '1) Внедрить AI-ассистентов для рутинных операций (поддержка, аналитика). 2) Построить систему делегирования через OKR-фреймворк. 3) Начать пилотный проект выхода на рынок ОАЭ через партнёрство. 4) Инвестировать в обучение команды AI-компетенциям.',
  },
}

export const MOCK_MY_VIDEOS = {
  items: [
    {
      id: 'vid-001',
      date: '2025-11-20T14:30:00Z',
      public: true,
      style_name: 'Кинематограф',
      tg_id: '123456789',
      user: MOCK_USER,
      video_thumbnail: 'https://picsum.photos/seed/vid1/400/300',
      video_url: '',
    },
  ],
}

export const MOCK_FEED_VIDEOS = {
  items: [
    {
      id: 'vid-feed-001',
      date: '2025-11-20T12:00:00Z',
      public: true,
      style_name: 'Ретро',
      tg_id: '200000002',
      user: { ...MOCK_USER, fullname: 'Динара Абильмажинова', photo_url: 'https://randomuser.me/api/portraits/women/65.jpg' } as any,
      video_thumbnail: 'https://picsum.photos/seed/feed1/400/300',
      video_url: '',
    },
    {
      id: 'vid-feed-002',
      date: '2025-11-20T13:00:00Z',
      public: true,
      style_name: 'Аниме',
      tg_id: '200000003',
      user: { ...MOCK_USER, fullname: 'Тимур Сериков', photo_url: 'https://randomuser.me/api/portraits/men/75.jpg' } as any,
      video_thumbnail: 'https://picsum.photos/seed/feed2/400/300',
      video_url: '',
    },
  ],
}
