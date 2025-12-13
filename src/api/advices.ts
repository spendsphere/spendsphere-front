import { apiClient } from './client';

export interface AdviceItemDTO {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface AdviceResponseDTO {
  id: number;
  userId: number;
  goal: string;
  targetDate: string | null;
  items: AdviceItemDTO[];
  createdAt: string;
}

export interface AdviceRequestDTO {
  goal: string;
  targetDate?: string | null;
}

/**
 * Запросить генерацию финансовых советов
 */
export async function requestAdvice(
  userId: number,
  request: AdviceRequestDTO,
): Promise<void> {
  await apiClient.post(`/v1/users/${userId}/advices`, request);
}

/**
 * Получить советы за последний месяц
 */
export async function getRecentAdvices(
  userId: number,
): Promise<AdviceResponseDTO[]> {
  return apiClient.get<AdviceResponseDTO[]>(
    `/v1/users/${userId}/advices/recent`,
  );
}

