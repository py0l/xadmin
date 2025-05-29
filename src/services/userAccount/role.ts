import { request } from '@umijs/max';

/**
 * 查询角色列表
 * @param params 查询参数
 */
export async function queryRoleList(
  params: API.PageParams & {
    searchKeyword?: string;
    creationTimeRange?: [string, string];
  },
) {
  return request<API.Response<API.RoleItem[]>>('/api/role', {
    method: 'GET',
    params,
  });
}
