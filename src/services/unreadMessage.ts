import { request } from '@umijs/max';

/**
 * 获取未处理消息数量
 */
export async function getUnreadMessageCounts(): Promise<{
  data: Record<string, number>;
  success: boolean;
}> {
  return request('/api/unreadMessages');
}
