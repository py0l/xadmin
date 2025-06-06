import { request } from 'umi';

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
