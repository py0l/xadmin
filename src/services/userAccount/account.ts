import { request } from '@umijs/max';

/**
 * 查询账户列表
 * @param params 查询参数
 */
export async function queryAccountList(
  params: API.PageParams & {
    role?: string;
    searchKeyword?: string;
    registrationTimeRange?: [string, string];
    lastLoginTimeRange?: [string, string];
  },
) {
  return request<API.Response<API.AccountItem[]>>('/api/account', {
    method: 'GET',
    params,
  });
}
