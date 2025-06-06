import { Request, Response } from 'express';

const templateData = [
  {
    accountUID: 'jk0092',
    phoneNumber: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    templateID: '020107',
    templateName: '【模板的名称】',
    chatbot: '【Chatbot的名称】',
    fallbackSMSContent: '【签名的名称】 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    characterCount: 60,
    billingCount: 1,
    createTime: '2024-12-18 17:35:42',
    status: '待审核',
    systemReview: '待审核',
    channelReview: '待审核',
  },
  {
    accountUID: 'jk0091',
    phoneNumber: '13800138001',
    enterpriseName: '深圳xxxxxx有限公司',
    templateID: '020106',
    templateName: '【模板的名称】',
    chatbot: '【Chatbot的名称】',
    fallbackSMSContent: '【签名的名称】 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    characterCount: 60,
    billingCount: 1,
    createTime: '2024-12-18 17:35:42',
    status: '待审核',
    systemReview: '待审核',
    channelReview: '待审核',
  },
  {
    accountUID: 'jk0093',
    phoneNumber: '13800138003',
    enterpriseName: '深圳xxxxxx有限公司',
    templateID: '020105',
    templateName: '【模板的名称】',
    chatbot: '【Chatbot的名称】',
    fallbackSMSContent: '【签名的名称】 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    characterCount: 58,
    billingCount: 1,
    createTime: '2024-10-18 17:35:42',
    status: '审核中',
    systemReview: '通过',
    channelReview: '待审核',
  },
  {
    accountUID: 'jk0092',
    phoneNumber: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    templateID: '020104',
    templateName: '【模板的名称】',
    chatbot: '【Chatbot的名称】',
    fallbackSMSContent: '【签名的名称】 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    characterCount: 58,
    billingCount: 1,
    createTime: '2024-09-28 17:35:42',
    status: '通过',
    systemReview: '通过',
    channelReview: '通过',
  },
  {
    accountUID: 'jk0091',
    phoneNumber: '13800138001',
    enterpriseName: '深圳赛格股份有限公司',
    templateID: '020103',
    templateName: '【模板的名称】',
    chatbot: '【Chatbot的名称】',
    fallbackSMSContent: '【签名的名称】 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    characterCount: 47,
    billingCount: 1,
    createTime: '2024-09-18 17:35:42',
    status: '拒绝',
    systemReview: '通过',
    channelReview: '拒绝',
  },
  {
    accountUID: 'jk0092',
    phoneNumber: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    templateID: '020102',
    templateName: '【模板的名称】',
    chatbot: '【Chatbot的名称】',
    fallbackSMSContent: '【签名的名称】 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    characterCount: 68,
    billingCount: 1,
    createTime: '2024-08-29 17:35:42',
    status: '通过',
    systemReview: '通过',
    channelReview: '通过',
  },
  {
    accountUID: 'jk0091',
    phoneNumber: '13800138001',
    enterpriseName: '深圳赛格股份有限公司',
    templateID: '020101',
    templateName: '【模板的名称】',
    chatbot: '【Chatbot的名称】',
    fallbackSMSContent: '【签名的名称】 Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    characterCount: 151,
    billingCount: 3,
    createTime: '2024-08-18 17:35:42',
    status: '通过',
    systemReview: '通过',
    channelReview: '通过',
  },
];

export default {
  'GET /api/templateManagement': (req: Request, res: Response) => {
    const { templateID, templateName, fallbackSMSContent, status, accountUID, searchKeyword } =
      req.query;

    let filteredData = templateData;

    if (searchKeyword) {
      filteredData = filteredData.filter(
        (item) =>
          item.templateName.includes(searchKeyword as string) ||
          item.fallbackSMSContent.includes(searchKeyword as string),
      );
    }

    if (templateID) {
      filteredData = filteredData.filter((item) => item.templateID.includes(templateID as string));
    }

    if (templateName) {
      filteredData = filteredData.filter((item) =>
        item.templateName.includes(templateName as string),
      );
    }

    if (fallbackSMSContent) {
      filteredData = filteredData.filter((item) =>
        item.fallbackSMSContent.includes(fallbackSMSContent as string),
      );
    }

    if (status && status !== '') {
      filteredData = filteredData.filter((item) => item.status === status);
    }

    if (accountUID && accountUID !== '') {
      filteredData = filteredData.filter((item) => item.accountUID === accountUID);
    }

    res.send({
      success: true,
      data: filteredData,
      total: filteredData.length,
    });
  },
};
