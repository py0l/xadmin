import { request } from 'umi';

/**
 * 查询模板列表
 * @param params 查询参数，包含账户UID、手机号码、企业名称、模板ID、模板名称、Chatbot、回落短信内容、字符数、计费条数、创建时间、状态、关键词、当前页和每页大小
 * @param options 请求配置
 * @returns Promise<API.TemplateList>
 */
export async function queryTemplateList(
  params: {
    accountUID?: string;
    phoneNumber?: string;
    enterpriseName?: string;
    templateID?: string;
    templateName?: string;
    chatbot?: string;
    fallbackSMSContent?: string;
    characterCount?: number;
    billingCount?: number;
    createTime?: string;
    status?: string;
    searchKeyword?: string;
    pageSize?: number;
    current?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.TemplateList>('/api/templateManagement', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
