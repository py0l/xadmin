import { request } from '@umijs/max';

export async function queryConsumptionStatistics(
  params: {
    pageSize?: number;
    current?: number;
    account?: string;
    incomeExpenseType?: string;
    transactionType?: string;
    queryMonth?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ConsumptionStatisticsList>('/api/consumptionStatistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
