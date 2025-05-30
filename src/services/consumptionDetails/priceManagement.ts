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

/**
 * @description 获取价格详情
 * @param accountUID 账号UID
 * @returns Promise<API.Response<API.PriceDetails>>
 */
export async function queryPriceDetails(accountUID: string) {
  return request<API.Response<API.PriceDetails>>(`/api/priceManagement/details/${accountUID}`, {
    method: 'GET',
  });
}

/**
 * @description 更新价格详情
 * @param data 价格更新参数
 * @returns Promise<API.Response<any>>
 */
export async function updatePriceDetails(data: API.PriceUpdateParams) {
  return request<API.Response<any>>('/api/priceManagement/update', {
    method: 'POST',
    data,
  });
}
