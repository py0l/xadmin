import { request } from '@umijs/max';

/**
 * @description 获取价格管理列表
 * @param params 查询参数
 * @returns Promise<API.PriceManagementList>
 */
export async function queryPriceManagementList(params: API.PriceManagementListParams) {
  return request<API.PriceManagementList>('/api/priceManagement/list', {
    method: 'GET',
    params,
  });
}
