import { useQuery } from '@tanstack/react-query'
import { queryClient } from '@/queries'
import type { User, UpdateUserData } from '@/queries/user'
import type { NetwokingUser } from '@/queries/networking'
import type { ScheduleDay } from '@/queries/schedules'
import type { Question } from '@/queries/questions'
import {
  MOCK_USER,
  MOCK_CLIENT_DETAIL,
  MOCK_NETWORKING_USERS,
  MOCK_CONNECTED_USERS,
  MOCK_SCHEDULES,
  MOCK_QUESTIONS,
  MOCK_AI_DIAGNOSTICS_RESULT,
  MOCK_MY_VIDEOS,
  MOCK_FEED_VIDEOS,
} from './mock-data'

let mockUser = { ...MOCK_USER }
let mockConnected = [...MOCK_CONNECTED_USERS]
let mockQuestions = [...MOCK_QUESTIONS]
let nextQuestionId = 200

export const useUserData = () =>
  useQuery<User>({
    queryKey: ['user_data'],
    queryFn: async () => {
      await delay(300)
      return mockUser as User
    },
  })

export async function updateUser(userData: UpdateUserData) {
  await delay(500)
  mockUser = { ...mockUser, ...userData } as any
  queryClient.invalidateQueries({ queryKey: ['user_data'] })
  return mockUser
}

export async function uploadFaceId(_file: File) {
  await delay(800)
  mockUser = { ...mockUser, face_id: 'mock-face-id-uploaded' } as any
  return mockUser
}

export const useNetworkingList = () =>
  useQuery<NetwokingUser[]>({
    queryKey: ['netwoking_list'],
    queryFn: async () => {
      await delay(400)
      return MOCK_NETWORKING_USERS
    },
  })

export const useConnectedList = () =>
  useQuery<{ count: number; results: NetwokingUser[] }>({
    queryKey: ['connected_list'],
    queryFn: async () => {
      await delay(300)
      return { count: mockConnected.length, results: mockConnected }
    },
  })

export const connectWithUser = async (id: number) => {
  await delay(200)
  const user = MOCK_NETWORKING_USERS.find((u) => u.id === id)
  if (user && !mockConnected.find((u) => u.id === id)) {
    mockConnected = [...mockConnected, user]
  }
}

export const useSchedules = () =>
  useQuery<ScheduleDay[]>({
    queryKey: ['schedules'],
    queryFn: async () => {
      await delay(400)
      return MOCK_SCHEDULES
    },
  })

export const useSchedule = (id: number) =>
  useQuery({
    queryKey: ['schedule', id],
    queryFn: async () => {
      await delay(300)
      return MOCK_SCHEDULES.find((s) => s.id === id) || MOCK_SCHEDULES[0]
    },
  })

export const useQuestions = (session_id: number) =>
  useQuery<Question[]>({
    queryKey: ['questions', session_id],
    queryFn: async () => {
      await delay(300)
      return mockQuestions.filter((q) => q.session === session_id || session_id === 0)
    },
  })

export const postQuestion = async (message: string, session_id: number) => {
  await delay(400)
  const newQ: Question = {
    id: nextQuestionId++,
    session: session_id,
    text: message,
    created_at: new Date().toISOString(),
    client: {
      fullname: mockUser.fullname,
      photo_url: mockUser.photo_url || '',
      id: mockUser.id,
    },
    likes_count: 0,
    is_liked: false,
  }
  mockQuestions = [newQ, ...mockQuestions]
  return newQ
}

export const voteQuestion = async (question_id: number) => {
  await delay(200)
  mockQuestions = mockQuestions.map((q) =>
    q.id === question_id
      ? { ...q, is_liked: !q.is_liked, likes_count: q.is_liked ? q.likes_count - 1 : q.likes_count + 1 }
      : q
  )
  return { success: true }
}

export const useClientDetail = (unique_url_id: string) =>
  useQuery({
    queryKey: ['client_detail', unique_url_id],
    queryFn: async () => {
      await delay(200)
      return MOCK_CLIENT_DETAIL
    },
    enabled: !!unique_url_id,
  })

export async function getResults(_data: any) {
  await delay(1500)
  return MOCK_AI_DIAGNOSTICS_RESULT
}

export const handleIntroductionVideo = async (_name: string) => {
  await delay(800)
  return {
    video_url: '',
    thumbnail_url: 'https://picsum.photos/seed/intro/720/1280',
  }
}

export const createVideoInviteAndGetUrls = async (_name: string, _fire_and_forget = false) => {
  await delay(500)
  return { video_url: '', thumbnail_url: '' }
}

export const setPublic = async (_record_id: string, _value: boolean) => {
  await delay(200)
}

export const createVideoRecord = async (_payload: any) => {
  await delay(300)
  return { id: 'mock-record-' + Date.now() }
}

export const useMockMyVideos = () =>
  useQuery({
    queryKey: ['my_video'],
    queryFn: async () => {
      await delay(300)
      return MOCK_MY_VIDEOS
    },
  })

export const useMockFeedVideos = () =>
  useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      await delay(300)
      return MOCK_FEED_VIDEOS
    },
  })

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
