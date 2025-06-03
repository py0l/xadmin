import { Request, Response } from 'express';

const getAccountReviewList = (req: Request, res: Response) => {
  const data = [
    {
      key: '1',
      accountId: 'jk0092',
      phoneNumber: '13800138002',
      userRole: '普通客户',
      enterpriseName: '深圳创鑫技术有限公司',
      applicationTime: '2024-08-18 17:35',
    },
    {
      key: '2',
      accountId: 'jk0091',
      phoneNumber: '13800138001',
      userRole: '普通客户',
      enterpriseName: '深圳赛格股份有限公司',
      applicationTime: '2024-08-15 17:35',
    },
  ];

  res.send({
    success: true,
    data,
    total: data.length,
  });
};

export default {
  'GET /api/jike-data/account-review': getAccountReviewList,
};
