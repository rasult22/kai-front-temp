import {
  QueryClient,
} from '@tanstack/react-query'

export const queryClient = new QueryClient()

export type User = {
  fullname: string;    // Полное имя (обязательно)
  email: string;      // Email (опционально)
  phone: string; // Номер телефона
  photo_url: string; // Аватар пользователя
  biz_direction: string; // Деательность компании
  biz_role: string; // Роль в бизнесе
  yearly_income: string; // Годовой доход
  participate_goal: string; // Цель участия
}