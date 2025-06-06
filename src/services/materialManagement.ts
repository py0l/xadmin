import { request } from '@umijs/max';

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
