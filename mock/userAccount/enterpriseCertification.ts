import { Request, Response } from 'express';

// 模拟数据
let mockEnterpriseList = [
  {
    uid: 'jk0092',
    phoneNumber: '13800138002',
    userRole: '普通客户',
    enterpriseName: '深圳创鑫技术有限公司',
    applicationTime: '2024-08-18 17:35',
    status: 'pending', // pending, approved, rejected
  },
  {
    uid: 'jk0091',
    phoneNumber: '13800138001',
    userRole: '普通客户',
    enterpriseName: '深圳赛格股份有限公司',
    applicationTime: '2024-08-15 17:35',
    status: 'pending',
  },
  {
    uid: 'jk0090',
    phoneNumber: '13800138000',
    userRole: '普通客户',
    enterpriseName: '广州市天河软件园有限公司',
    applicationTime: '2024-08-14 10:00',
    status: 'approved',
  },
  {
    uid: 'jk0089',
    phoneNumber: '13800138003',
    userRole: '代理商',
    enterpriseName: '北京创新科技有限公司',
    applicationTime: '2024-08-13 11:00',
    status: 'pending',
  },
  {
    uid: 'jk0088',
    phoneNumber: '13800138004',
    userRole: '运营人员',
    enterpriseName: '上海科技发展有限公司',
    applicationTime: '2024-08-12 12:00',
    status: 'rejected',
  },
];

// 模拟获取企业认证列表
const getEnterpriseCertificationList = (req: Request, res: Response) => {
  const { status } = req.query;
  let filteredData = mockEnterpriseList;

  if (status) {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  res.json({
    data: filteredData,
    success: true,
    total: filteredData.length,
  });
};

// 模拟通过企业认证
const approveEnterpriseCertification = (req: Request, res: Response) => {
  const { uid } = req.body;
  const index = mockEnterpriseList.findIndex((item) => item.uid === uid);
  if (index > -1) {
    mockEnterpriseList[index].status = 'approved';
    res.json({
      success: true,
      message: `企业 ${mockEnterpriseList[index].enterpriseName} 认证已通过`,
    });
  } else {
    res.status(404).json({
      success: false,
      message: '未找到该企业认证',
    });
  }
};

// 模拟拒绝企业认证
const rejectEnterpriseCertification = (req: Request, res: Response) => {
  const { uid } = req.body;
  const index = mockEnterpriseList.findIndex((item) => item.uid === uid);
  if (index > -1) {
    mockEnterpriseList[index].status = 'rejected';
    res.json({
      success: true,
      message: `企业 ${mockEnterpriseList[index].enterpriseName} 认证已拒绝`,
    });
  } else {
    res.status(404).json({
      success: false,
      message: '未找到该企业认证',
    });
  }
};

export default {
  'GET /api/enterpriseCertification': getEnterpriseCertificationList,
  'POST /api/enterpriseCertification/approve': approveEnterpriseCertification,
  'POST /api/enterpriseCertification/reject': rejectEnterpriseCertification,
};
