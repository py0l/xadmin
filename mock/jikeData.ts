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

const queryCrowdPackageRecord = (req: Request, res: Response) => {
  const mockData = [
    {
      accountId: 'jk0098',
      phoneNumber: '13800138002',
      enterpriseName: '深圳xxxxxx有限公司',
      dataPackageId: '09',
      dataPackageName: '(创建时的人群包名称)',
      quantity: 0,
      actualOutput: 0,
      difference: 0,
      replenishment: 0,
      createTime: '2024-12-18 17:35:42',
      completeTime: '',
      status: 'approved',
    },
    {
      accountId: 'jk0091',
      phoneNumber: '13800138001',
      enterpriseName: '深圳xxxxxx有限公司',
      dataPackageId: '08',
      dataPackageName: '(创建时的人群包名称)',
      quantity: 0,
      actualOutput: 0,
      difference: 0,
      replenishment: 0,
      createTime: '2024-12-18 17:35:42',
      completeTime: '',
      status: 'rejected',
    },
    {
      accountId: 'jk0093',
      phoneNumber: '13800138003',
      enterpriseName: '深圳xxxxxx有限公司',
      dataPackageId: '07',
      dataPackageName: '(创建时的人群包名称)',
      quantity: 0,
      actualOutput: 0,
      difference: 0,
      replenishment: 0,
      createTime: '2024-10-18 17:35:42',
      completeTime: '',
      status: 'pending',
    },
    {
      accountId: 'jk0092',
      phoneNumber: '13800138002',
      enterpriseName: '深圳xxxxxx有限公司',
      dataPackageId: '06',
      dataPackageName: '(创建时的人群包名称)',
      quantity: 0,
      actualOutput: 0,
      difference: 0,
      replenishment: 0,
      createTime: '2024-10-18 17:35:42',
      completeTime: '',
      status: 'canceled',
    },
    {
      accountId: 'jk0091',
      phoneNumber: '13800138001',
      enterpriseName: '深圳xxxxxx有限公司',
      dataPackageId: '05',
      dataPackageName: '(创建时的人群包名称)',
      quantity: 200000,
      actualOutput: 84432,
      difference: 115568,
      replenishment: 0,
      createTime: '2024-09-28 17:35:42',
      completeTime: '2024-09-28 17:35:42',
      status: 'available',
    },
    {
      accountId: 'jk0093',
      phoneNumber: '13800138003',
      enterpriseName: '深圳xxxxxx有限公司',
      dataPackageId: '04',
      dataPackageName: '(创建时的人群包名称)',
      quantity: 680000,
      actualOutput: 121123,
      difference: 558877,
      replenishment: 558877,
      createTime: '2024-09-18 17:35:42',
      completeTime: '2024-09-18 17:35:42',
      status: 'available',
    },
    {
      accountId: 'jk0092',
      phoneNumber: '13800138002',
      enterpriseName: '深圳xxxxxx有限公司',
      dataPackageId: '03',
      dataPackageName: '(创建时的人群包名称)',
      quantity: 9000,
      actualOutput: 9000,
      difference: 0,
      replenishment: 0,
      createTime: '2024-08-29 17:35:42',
      completeTime: '2024-08-29 17:35:42',
      status: 'available',
    },
    {
      accountId: 'jk0091',
      phoneNumber: '13800138001',
      enterpriseName: '深圳赛格股份有限公司',
      dataPackageId: '01',
      dataPackageName: '(创建时的人群包名称)',
      quantity: 1000000,
      actualOutput: 1000000,
      difference: 0,
      replenishment: 0,
      createTime: '2024-08-18 17:35:42',
      completeTime: '2024-08-18 17:35:42',
      status: 'available',
    },
  ];

  const { pageSize = 10, current = 1, status, searchKeyword } = req.query;

  let filteredData = mockData;
  if (status && status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }
  if (searchKeyword) {
    filteredData = filteredData.filter(
      (item) =>
        item.dataPackageId.includes(searchKeyword as string) ||
        item.dataPackageName.includes(searchKeyword as string),
    );
  }

  const paginatedData = filteredData.slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );

  res.send({
    success: true,
    data: paginatedData,
    total: filteredData.length,
  });
};

export default {
  'GET /api/jike-data/account-review': getAccountReviewList,
  'GET /api/jike-data/crowd-package-record': queryCrowdPackageRecord,
};
