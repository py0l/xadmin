import { request } from 'umi';

export async function queryDataStatistics(
  params: {
    pageSize?: number;
    current?: number;
    accountId?: string;
    timeRange?: [string, string];
  },
  options?: { [key: string]: any },
) {
  return request<API.DataStatisticsList>('/api/dataStatistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
