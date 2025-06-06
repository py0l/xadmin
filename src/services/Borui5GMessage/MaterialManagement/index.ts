import { request } from '@umijs/max';

/**
 * 查询素材列表
 * @param params 查询参数，包含素材ID、素材名称、状态、账户、当前页和每页大小
 * @returns Promise<any>
 */
export async function queryMaterialList(params: {
  materialID?: string;
  materialName?: string;
  status?: string;
  account?: string;
  current?: number;
  pageSize?: number;
}) {
  return request('/api/materialManagement', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
