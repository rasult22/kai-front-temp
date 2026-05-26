import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, INIT_DATA } from "./auth";
import WebApp from "@twa-dev/sdk";


export type NetwokingUser = {
  id: number;
  photo_url?: string;
  username: string;
  fullname: string;
  role_in_business: string;
  telegram_id: number;
  business_domain: string;
  participation_goal: string;
}

const blackList = [
  685668909, // Маргулан Сейсембай
  420423224,
  551941839,
  302265530,
  1720970983,
  497267347,
  7796332610,
  477846780,
  653252189,
  267506836,
  777433338,
  121735016,
  1387491864
]

export const useNetworkingList = () => useQuery<NetwokingUser[]>({
  queryKey: ['netwoking_list'],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}api/clients?similar=1`, {
      method: 'GET',
      headers: {
        'Authorization': `tma ${WebApp.initData || INIT_DATA}`
      }
    })
    if (!response.ok) {
      throw new Error('Произошла ошибка при загрузке списка анкет')
    }
    const data: NetwokingUser[] = await response.json()
    return data.filter(data => !blackList.includes(data.telegram_id) && data.participation_goal)
  }
})
export const useConnectedList = () => useQuery<{
  count: number,
  results: NetwokingUser[]
}>({
  queryKey: ['connected_list'],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}api/clients/likes/`, {
      method: 'GET',
      headers: {
        'Authorization': `tma ${WebApp.initData || INIT_DATA}`
      }
    })
    if (!response.ok) {
      throw new Error('Произошла ошибка при загрузке списка анкет')
    }
    return await response.json()
  }
})


export const connectWithUser = (id: number) => {
  fetch(`${API_BASE_URL}api/clients/${id}/like/`,{
    method: 'POST',
    headers: {
      'Authorization': `tma ${WebApp.initData || INIT_DATA}`
    },
    body: JSON.stringify({
      to_client: id
    })
  })
}