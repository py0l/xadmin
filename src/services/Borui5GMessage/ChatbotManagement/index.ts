import { request } from '@umijs/max';

/**
 * 获取 Chatbot 列表
 * @param params 查询参数
 * @param options 请求配置
 * @returns Promise<any>
 */
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

/**
 * 获取 Chatbot 详情
 * @param chatbotId Chatbot ID
 * @param options 请求配置
 * @returns Promise<any>
 */
export async function getChatbotDetail(chatbotId: string, options?: { [key: string]: any }) {
  return request(`/api/chatbot/detail/${chatbotId}`, {
    method: 'GET',
    ...(options || {}),
  });
}
