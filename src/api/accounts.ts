import { apiClient } from './client';

export type AccountType = 'CARD' | 'CASH' | 'DEBIT' | 'CREDIT' | 'DEPOSIT' | 'OTHER';
export type Currency = 'RUB' | 'USD' | 'EUR' | string;

export interface AccountDTO {
  id: number;
  userId: number;
  accountType: AccountType;
  balance: number;
  currency: Currency;
  name: string;
  iconUrl: string | null;
  creditLimit: number | null;
  isActive: boolean;
  includeInTotal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountCreateDTO {
  accountType: AccountType;
  balance: number;
  currency: Currency;
  name: string;
  iconUrl?: string | null;
  creditLimit?: number | null;
  isActive?: boolean;
  includeInTotal?: boolean;
}

export interface AccountUpdateDTO extends Partial<AccountCreateDTO> {}

export interface AccountBalanceDTO {
  totalAccounts: number;
  balancesByCurrency: Record<string, number>;
}

export const accountsApi = {
  list: (userId: number) => apiClient.get<AccountDTO[]>(`/v1/users/${userId}/accounts`),
  get: (userId: number, accountId: number) =>
    apiClient.get<AccountDTO>(`/v1/users/${userId}/accounts/${accountId}`),
  create: (userId: number, body: AccountCreateDTO) =>
    apiClient.post<AccountDTO>(`/v1/users/${userId}/accounts`, body),
  update: (userId: number, accountId: number, body: AccountUpdateDTO) =>
    apiClient.put<AccountDTO>(`/v1/users/${userId}/accounts/${accountId}`, body),
  remove: (userId: number, accountId: number) =>
    apiClient.delete<void>(`/v1/users/${userId}/accounts/${accountId}`),
  balance: (userId: number) =>
    apiClient.get<AccountBalanceDTO>(`/v1/users/${userId}/accounts/balance`),
};


