import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, INIT_DATA } from "./auth";
import WebApp from "@twa-dev/sdk";

export type User = {
  id: number;
  email?: string;
  fullname: string;
  is_active: boolean;
  telegram_id: number;
  face_id?: string;
  phone: string;
  business_domain?: string;
  role_in_business?: string;
  yearly_income?: string;
  photo_url?: string
  participation_goal?: string;
  payment_status: boolean;
  unique_url_id: string;
};

export const useUserData =() => useQuery<User>({
  queryKey: ['user_data'],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}api/clients`, {
      method: 'GET',
      headers: {
        'Authorization': `TMA ${WebApp.initData || INIT_DATA}`
      }
    })
    if (!response.ok) {
      throw new Error('Возможно вы не зарегистрированы в боте.')
    }
    return await response.json()
  }
})

export interface UpdateUserData {
  email?: string;
  fullname?: string;
  face_id?: string;
  phone?: string;
  username?: string;
  business_domain?: string;
  role_in_business?: string;
  yearly_income?: string;
  participation_goal?: string;
  photo_url?: string;
  mastermind_tags?: string
}
// Обновление пользователя (PUT, требует авторизации)
export async function updateUser(userData: UpdateUserData) {
  const response = await fetch(`${API_BASE_URL}api/clients/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `TMA ${WebApp.initData || INIT_DATA}`
    },
    body: JSON.stringify(userData), // { fullname, email, phone }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Update failed');
  }
  return response.json(); // Обновлённые данные
}
export async function uploadFaceId(file: File) {
  const formData = new FormData()
  formData.append('face_id', file)
  const response = await fetch(`${API_BASE_URL}api/clients/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `TMA ${WebApp.initData || INIT_DATA}`
    },
    body: formData
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Update failed');
  }
  return response.json(); // Обновлённые данные
}