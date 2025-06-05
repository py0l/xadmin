import { Request, Response } from 'express';

const chatbotList = [
  {
    uid: 'jk0091',
    phone: '13800138001',
    enterpriseName: '深圳xxxxxx有限公司',
    chatbotId: '020107',
    chatbotName: '【Chatbot的名称】',
    createTime: '2024-12-18 17:35:42',
    status: '同意',
  },
  {
    uid: 'jk0093',
    phone: '13800138003',
    enterpriseName: '深圳xxxxxx有限公司',
    chatbotId: '020106',
    chatbotName: '【Chatbot的名称】',
    createTime: '2024-12-18 17:35:42',
    status: '审核中',
  },
  {
    uid: 'jk0092',
    phone: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    chatbotId: '020105',
    chatbotName: '【Chatbot的名称】',
    createTime: '2024-10-18 17:35:42',
    status: '审核中',
  },
  {
    uid: 'jk0091',
    phone: '13800138001',
    enterpriseName: '深圳xxxxxx有限公司',
    chatbotId: '020104',
    chatbotName: '【Chatbot的名称】',
    createTime: '2024-09-28 17:35:42',
    status: '通过',
  },
  {
    uid: 'jk0093',
    phone: '13800138003',
    enterpriseName: '深圳xxxxxx有限公司',
    chatbotId: '020103',
    chatbotName: '【Chatbot的名称】',
    createTime: '2024-09-18 17:35:42',
    status: '拒绝',
  },
  {
    uid: 'jk0092',
    phone: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    chatbotId: '020102',
    chatbotName: '【Chatbot的名称】',
    createTime: '2024-08-29 17:35:42',
    status: '通过',
  },
  {
    uid: 'jk0091',
    phone: '13800138001',
    enterpriseName: '深圳赛格股份有限公司',
    chatbotId: '020101',
    chatbotName: '【Chatbot的名称】',
    createTime: '2024-08-18 17:35:42',
    status: '通过',
  },
];

export default {
  'GET /api/chatbot/list': (req: Request, res: Response) => {
    const { pageSize = 10, current = 1, uid, status, chatbotId, chatbotName } = req.query;

    let filteredList = [...chatbotList];

    if (uid && uid !== 'all') {
      filteredList = filteredList.filter((item) => item.uid === uid);
    }
    if (status && status !== 'all') {
      filteredList = filteredList.filter((item) => item.status === status);
    }
    if (chatbotId) {
      filteredList = filteredList.filter((item) => item.chatbotId.includes(chatbotId as string));
    }
    if (chatbotName) {
      filteredList = filteredList.filter((item) =>
        item.chatbotName.includes(chatbotName as string),
      );
    }

    const total = filteredList.length;
    const startIndex = (Number(current) - 1) * Number(pageSize);
    const endIndex = startIndex + Number(pageSize);
    const paginatedList = filteredList.slice(startIndex, endIndex);

    res.send({
      data: paginatedList,
      total,
      success: true,
    });
  },
};
