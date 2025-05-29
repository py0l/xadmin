import { request } from '@umijs/max';

/**
 * 查询充值列表
 * @param params 查询参数
 */
export async function queryRechargeList(
  params: API.PageParams & {
    role?: string;
    searchKeyword?: string;
    registrationTimeRange?: [string, string];
    lastLoginTimeRange?: [string, string];
  },
) {
  return request<API.Response<API.RechargeItem[]>>('/api/recharge', {
    method: 'GET',
    params,
  });
}
