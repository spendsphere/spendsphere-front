import { apiClient } from './client';

export type BackendCategoryType = 'INCOME' | 'EXPENSE' | 'BOTH';

export interface CategoryDTO {
  id: number;
  name: string;
  iconUrl: string | null;
  isDefault: boolean;
  categoryType: BackendCategoryType;
}

export interface CategoryInputDTO {
  name: string;
  iconUrl?: string | null;
  categoryType?: BackendCategoryType;
}

export const categoriesApi = {
  allForUser: (userId: number) => apiClient.get<CategoryDTO[]>(`/v1/categories/user/${userId}/all`),
  customForUser: (userId: number) =>
    apiClient.get<CategoryDTO[]>(`/v1/categories/user/${userId}/custom`),
  defaults: () => apiClient.get<CategoryDTO[]>(`/v1/categories/default`),
  createForUser: (userId: number, body: CategoryInputDTO) =>
    apiClient.post<CategoryDTO>(`/v1/categories/user/${userId}/category`, body),
  updateForUser: (userId: number, categoryId: number, body: CategoryInputDTO) =>
    apiClient.put<CategoryDTO>(`/v1/categories/user/${userId}/category/${categoryId}`, body),
  deleteForUser: (userId: number, categoryId: number) =>
    apiClient.delete<void>(`/v1/categories/user/${userId}/category/${categoryId}`),
};


