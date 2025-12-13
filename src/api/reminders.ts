import { apiClient } from './client';

export type RecurrenceType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface ReminderDTO {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  amount: number;
  recurrenceType: RecurrenceType;
  weeklyDayOfWeek: string | null;
  monthlyDayOfMonth: number | null;
  monthlyUseLastDay: boolean | null;
  isActive: boolean;
  accountId: number;
  accountName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderCreateDTO {
  title: string;
  description?: string | null;
  amount: number;
  recurrenceType: RecurrenceType;
  weeklyDayOfWeek?: string | null;
  monthlyDayOfMonth?: number | null;
  monthlyUseLastDay?: boolean | null;
  isActive?: boolean;
  accountId: number;
}

export type ReminderUpdateDTO = Partial<ReminderCreateDTO>;

export const remindersApi = {
  list: (userId: number) => apiClient.get<ReminderDTO[]>(`/v1/users/${userId}/reminders`),
  get: (userId: number, reminderId: number) =>
    apiClient.get<ReminderDTO>(`/v1/users/${userId}/reminders/${reminderId}`),
  create: (userId: number, body: ReminderCreateDTO) =>
    apiClient.post<ReminderDTO>(`/v1/users/${userId}/reminders`, body),
  update: (userId: number, reminderId: number, body: ReminderUpdateDTO) =>
    apiClient.put<ReminderDTO>(`/v1/users/${userId}/reminders/${reminderId}`, body),
  remove: (userId: number, reminderId: number) =>
    apiClient.delete<void>(`/v1/users/${userId}/reminders/${reminderId}`),
  upcoming: (userId: number, days = 5) =>
    apiClient.get<ReminderDTO[]>(`/v1/users/${userId}/reminders/upcoming?days=${days}`),
};



