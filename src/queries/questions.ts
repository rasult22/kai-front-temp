import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, INIT_DATA } from "./auth";
import WebApp from "@twa-dev/sdk";
import { PROTOTYPE_MODE } from "@/prototype";
import * as MockQueries from "@/prototype/mock-queries";


const _useQuestionsReal = (session_id: number) => useQuery<Question[]>({
  queryKey: ["questions", session_id],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}api/sessions/${session_id}/questions/`, {
      method: 'GET',
      headers: {
        'Authorization': `tma ${WebApp.initData || INIT_DATA}`
      }
    })
    if (!response.ok) {
      throw new Error('Произошла ошибка при загрузке списка вопросов')
    }
    return await response.json()
  },
});

export const useQuestions = PROTOTYPE_MODE ? MockQueries.useQuestions : _useQuestionsReal;

export type Question = {
  "id": number,
  "session": number,
  "text": string,
  "created_at": string,
  "client": {
    fullname: string,
    photo_url: string,
    id: number
  },
  "likes_count": number,
  "is_liked": boolean
}


const _postQuestionReal = async (message: string, session_id: number) => {
  const response = await fetch(`${API_BASE_URL}api/sessions/${session_id}/questions/`, {
      method: 'POST',
      headers: {
        'Authorization': `tma ${WebApp.initData || INIT_DATA}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: message
      })
    })
    if (!response.ok) {
      throw new Error('Произошла ошибка при отправке вопроса')
    }
    return await response.json()
}

export const postQuestion = PROTOTYPE_MODE ? MockQueries.postQuestion : _postQuestionReal;

const _voteQuestionReal = async (question_id: number) => {
  const response = await fetch(`${API_BASE_URL}api/questions/${question_id}/vote/`, {
      method: 'POST',
      headers: {
        'Authorization': `tma ${WebApp.initData || INIT_DATA}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Произошла ошибка при лайке вопроса')
    }
    return await response.json()
}

export const voteQuestion = PROTOTYPE_MODE ? MockQueries.voteQuestion : _voteQuestionReal;