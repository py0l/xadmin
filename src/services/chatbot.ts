import { request } from '@umijs/max';

export async function getChatbotList(
  params: {
    pageSize?: number;
    current?: number;
    uid?: string;
    status?: string;
    chatbotId?: string;
    chatbotName?: string;
  },
  options?: { [key: string]: any },
) {
  return request('/api/chatbot/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getChatbotDetail(chatbotId: string, options?: { [key: string]: any }) {
  return request(`/api/chatbot/detail/${chatbotId}`, {
    method: 'GET',
    ...(options || {}),
  });
}
