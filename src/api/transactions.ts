import { apiClient } from './client';

export interface BackendTransactionDTO {
  id: number;
  userId: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  categoryId: number | null;
  categoryName: string | null;
  categoryIcon: string | null;
  categoryColor: string | null;
  accountId: number | null;
  accountName: string | null;
  transferAccountId: number | null;
  transferAccountName: string | null;
  amount: number;
  description: string | null;
  date: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

export async function fetchTransactions(userId: number): Promise<BackendTransactionDTO[]> {
  return apiClient.get<BackendTransactionDTO[]>(`/v1/users/${userId}/transactions`);
}

export async function deleteTransaction(userId: number, transactionId: number): Promise<void> {
  return apiClient.delete<void>(`/v1/users/${userId}/transactions/${transactionId}`);
}

export type BackendTransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export interface TransactionsFilter {
  type?: BackendTransactionType;
  accountId?: number;
  categoryId?: number;
  dateFrom?: string; // yyyy-MM-dd
  dateTo?: string;   // yyyy-MM-dd
}

export async function fetchTransactionsWithFilters(
  userId: number,
  filter: TransactionsFilter,
): Promise<BackendTransactionDTO[]> {
  const params = new URLSearchParams();
  if (filter.type) params.set('type', filter.type);
  if (filter.accountId != null) params.set('accountId', String(filter.accountId));
  if (filter.categoryId != null) params.set('categoryId', String(filter.categoryId));
  if (filter.dateFrom) params.set('dateFrom', filter.dateFrom);
  if (filter.dateTo) params.set('dateTo', filter.dateTo);
  return apiClient.get<BackendTransactionDTO[]>(
    `/v1/users/${userId}/transactions/filter?${params.toString()}`,
  );
}

export interface TransactionCreateDTO {
  type: BackendTransactionType;
  categoryId?: number | null;
  accountId: number;
  transferAccountId?: number | null;
  amount: number;
  description?: string | null;
  date: string; // ISO LocalDate (yyyy-MM-dd)
}

export type TransactionUpdateDTO = Partial<TransactionCreateDTO>;

export async function createTransaction(
  userId: number,
  body: TransactionCreateDTO,
): Promise<BackendTransactionDTO> {
  return apiClient.post<BackendTransactionDTO>(`/v1/users/${userId}/transactions`, body);
}

export async function updateTransaction(
  userId: number,
  transactionId: number,
  body: TransactionUpdateDTO,
): Promise<BackendTransactionDTO> {
  return apiClient.put<BackendTransactionDTO>(`/v1/users/${userId}/transactions/${transactionId}`, body);
}

// multipart upload; use raw fetch to control headers
export async function uploadTransactionPhoto(
  userId: number,
  accountId: number,
  file: File,
): Promise<void> {
  const form = new FormData();
  form.append('accountId', String(accountId));
  form.append('file', file);
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`/api/v1/users/${userId}/transactions/photo`, {
    method: 'POST',
    body: form,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text}`);
  }
}

export interface TransactionStatisticsDTO {
  expensesByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
  monthlyExpenses: Record<string, number>;
  monthlyIncome: Record<string, number>;
  avgExpensesByCategory: Array<{
    categoryName: string;
    timeSeries: Record<string, number>;
  }>;
  avgIncomeByCategory: Array<{
    categoryName: string;
    timeSeries: Record<string, number>;
  }>;
  maxExpensePerDay: {
    date: string;
    amount: number;
  } | null;
  maxExpensePerCategory: {
    categoryName: string;
    amount: number;
  } | null;
  averageExpense: number;
  averageIncome: number;
  startDate: string;
  endDate: string;
}

export async function fetchTransactionStatistics(
  userId: number,
  months: 1 | 3 | 6 | 12,
): Promise<TransactionStatisticsDTO> {
  return apiClient.get<TransactionStatisticsDTO>(
    `/v1/users/${userId}/transactions/statistics?months=${months}`,
  );
}


