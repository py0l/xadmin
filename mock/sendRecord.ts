import { Request, Response } from 'express';
import Mock from 'mockjs';

/**
 * 发送记录状态列表
 */
const sendRecordStatuses = ['待审核', '审核中', '驳回', '正在发送', '暂停', '已终止', '已发送'];

/**
 * 生成单个发送记录项的模板
 */
const sendRecordItemTemplate = {
  accountId: 'jk@string("number", 3)', // 账户ID
  phoneNumber: /^1[3-9]\d{9}$/, // 手机号码
  enterpriseName: '@cword(5, 10)有限公司', // 企业名称
  taskId: '@string("number", 6)', // 任务ID
  taskName: '发送任务的名称@cword(2, 5)', // 任务名称
  chatbotName: 'Chatbot的名称@cword(2, 5)', // Chatbot 名称
  fallbackSmsContent: '【签名的名称】@cparagraph(1)', // 回落短信内容
  charCount: '@integer(50, 200)', // 字符数
  billingCount: '@integer(1, 5)', // 计费条数
  numberCount: '@integer(100000, 500000)', // 号码数量
  submissionTime: '@datetime("yyyy-MM-dd HH:mm:ss")', // 提交时间
  status: () => Mock.Random.pick(sendRecordStatuses), // 状态
  completionTime: undefined, // 完成时间
  _5gMessageSuccessCount: undefined, // 5G 消息成功数
  smsSuccessCount: undefined, // 短信成功数
};

/**
 * 生成指定数量的发送记录列表数据
 * @param count 生成的数量
 * @returns 发送记录列表数组
 */
const generateSendRecordList = (count: number) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const item = Mock.mock(sendRecordItemTemplate);
    // 根据状态设置完成时间和成功数量
    if (item.status === '已发送' || item.status === '已终止') {
      item.completionTime = Mock.Random.datetime('yyyy-MM-dd HH:mm:ss');
      item._5gMessageSuccessCount = Mock.Random.integer(0, item.numberCount);
      item.smsSuccessCount = Mock.Random.integer(0, item.numberCount - item._5gMessageSuccessCount);
    } else {
      item.completionTime = undefined;
      item._5gMessageSuccessCount = undefined;
      item.smsSuccessCount = undefined;
    }
    list.push(item);
  }
  return list;
};

// 生成一个固定的大列表用于筛选和分页
const allSendRecordList = generateSendRecordList(50); // 生成 50 条模拟数据

export default {
  /**
   * 获取发送记录列表接口
   * 支持分页
   */
  'GET /api/sendRecord': (req: Request, res: Response) => {
    console.log('Received request for /api/sendRecord:', req.query); // 添加日志
    const { pageSize = 10, current = 1 } = req.query;
    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const paginatedList = allSendRecordList.slice(start, end);

    res.send({
      data: paginatedList,
      total: allSendRecordList.length,
      success: true,
    });
  },
};
