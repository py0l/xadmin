import { request } from 'umi';

/**
 * 定义发送记录列表请求参数的接口
 */
export interface SendRecordListParams {
  current?: number;
  pageSize?: number;
  accountId?: string;
  status?: string;
  searchContent?: string;
  completionTimeRange?: [string, string];
  // 可以根据实际需求添加更多筛选参数
}

/**
 * 定义发送记录列表返回结果的接口
 */
export interface SendRecordListResult {
  data: API.SendRecordItem[]; // 假设 API.SendRecordItem 已经定义在 typings.d.ts 或其他地方
  success: boolean;
  total: number;
}

/**
 * 获取发送记录列表
 * @param params 查询参数，包含分页、筛选等信息
 * @returns Promise<SendRecordListResult>
 */
export async function querySendRecordList(params: SendRecordListParams) {
  return request<SendRecordListResult>('/api/sendRecord', {
    method: 'GET',
    params,
  });
}
