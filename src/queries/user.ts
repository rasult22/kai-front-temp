import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, INIT_DATA } from "./auth";
import WebApp from "@twa-dev/sdk";
import { PROTOTYPE_MODE } from "@/prototype";
import * as MockQueries from "@/prototype/mock-queries";

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

const _useUserDataReal =() => useQuery<User>({
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

export const useUserData = PROTOTYPE_MODE ? MockQueries.useUserData : _useUserDataReal;

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

async function _updateUserReal(userData: UpdateUserData) {
  const response = await fetch(`${API_BASE_URL}api/clients/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `TMA ${WebApp.initData || INIT_DATA}`
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Update failed');
  }
  return response.json();
}

export const updateUser = PROTOTYPE_MODE ? MockQueries.updateUser : _updateUserReal;

async function _uploadFaceIdReal(file: File) {
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
  return response.json();
}

export const uploadFaceId = PROTOTYPE_MODE ? MockQueries.uploadFaceId : _uploadFaceIdReal;