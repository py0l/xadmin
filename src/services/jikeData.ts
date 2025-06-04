import type {
  CrowdPackageRecordItem,
  CrowdPackageRecordParams,
} from '@/pages/DataService/JikeData/CrowdPackageRecord';
import { request } from '@umijs/max';

/**
 * 查询人群包记录列表
 * @param params 查询参数
 */
export async function queryCrowdPackageRecord(
  params: CrowdPackageRecordParams,
): Promise<{ data: CrowdPackageRecordItem[]; total: number; success: boolean }> {
  return request('/api/jike-data/crowd-package-record', {
    method: 'GET',
    params,
  });
}
