import { request } from 'umi';

/**
 * 查询数据统计列表
 * @param params 查询参数
 * @param options 请求配置
 * @returns Promise<API.DataStatisticsList>
 */
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
