import { apiClient } from './client';
import type { UserProfileDTO } from '../context/AuthContext';

export interface UserProfileUpdateDTO {
  surname?: string | null;
  name?: string | null;
  birthday?: string | null;
  photoUrl?: string | null;
}

export const userApi = {
  me: () => apiClient.get<UserProfileDTO>('/v1/users/me'),
  getProfile: (id: number) => apiClient.get<UserProfileDTO>(`/v1/user/profile/${id}`),
  updateProfile: (id: number, body: UserProfileUpdateDTO) =>
    apiClient.put<UserProfileDTO>(`/v1/user/profile/${id}`, body),
};





