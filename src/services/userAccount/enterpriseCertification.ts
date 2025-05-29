import { request } from '@umijs/max';

/**
 * 查询企业认证列表
 * @param params 查询参数
 */
export async function queryEnterpriseCertifications(params: {
  status?: 'pending' | 'approved' | 'rejected';
}) {
  return request<API.Response<API.EnterpriseItem[]>>('/api/enterpriseCertification', {
    method: 'GET',
    params,
  });
}

/**
 * 通过企业认证
 * @param data 认证数据
 */
export async function approveEnterpriseCert(data: { uid: string }) {
  return request<API.Response<any>>('/api/enterpriseCertification/approve', {
    method: 'POST',
    data,
  });
}

/**
 * 拒绝企业认证
 * @param data 认证数据
 */
export async function rejectEnterpriseCert(data: { uid: string }) {
  return request<API.Response<any>>('/api/enterpriseCertification/reject', {
    method: 'POST',
    data,
  });
}
