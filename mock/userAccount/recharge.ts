import { Request, Response } from 'express';

// 定义数据类型
interface RechargeItem {
  uid: string;
  phone: string;
  role: string;
  certificationStatus: string;
  enterpriseName: string;
  accountBalance: string;
  registrationTime: string;
  lastLoginTime: string;
}

// 模拟数据
const mockRechargeData: RechargeItem[] = [
  {
    uid: 'jk0092',
    phone: '13800138002',
    role: '普通客户',
    certificationStatus: '未认证',
    enterpriseName: '',
    accountBalance: '30000.00',
    registrationTime: '2024-08-08 15:35',
    lastLoginTime: '2024-08-18 17:35',
  },
  {
    uid: 'jk0091',
    phone: '13800138001',
    role: '普通客户',
    certificationStatus: '已认证',
    enterpriseName: '深圳赛格股份有限公司',
    accountBalance: '30000.00',
    registrationTime: '2024-08-08 15:35',
    lastLoginTime: '2024-08-18 17:35',
  },
  {
    uid: 'jk0090',
    phone: '13800138000',
    role: '普通客户',
    certificationStatus: '未认证',
    enterpriseName: '',
    accountBalance: '10000.00',
    registrationTime: '2024-08-07 10:00',
    lastLoginTime: '2024-08-17 11:00',
  },
  {
    uid: 'jk0089',
    phone: '13800138003',
    role: '代理商',
    certificationStatus: '已认证',
    enterpriseName: '北京创新科技有限公司',
    accountBalance: '50000.00',
    registrationTime: '2024-08-06 09:00',
    lastLoginTime: '2024-08-16 10:00',
  },
  {
    uid: 'jk0088',
    phone: '13800138004',
    role: '运营人员',
    certificationStatus: '未认证',
    enterpriseName: '',
    accountBalance: '20000.00',
    registrationTime: '2024-08-05 14:00',
    lastLoginTime: '2024-08-15 15:00',
  },
  {
    uid: 'jk0087',
    phone: '13800138005',
    role: '管理员',
    certificationStatus: '已认证',
    enterpriseName: '管理公司',
    accountBalance: '99999.99',
    registrationTime: '2024-08-04 16:00',
    lastLoginTime: '2024-08-14 17:00',
  },
];

// 模拟充值列表请求
const getRechargeList = (req: Request, res: Response) => {
  const { current, pageSize, role, searchKeyword, registrationTimeRange, lastLoginTimeRange } =
    req.query;

  let filteredData = mockRechargeData.filter((item) => {
    // 角色筛选
    if (role && role !== 'all' && item.role !== role) {
      return false;
    }
    // 关键词搜索
    if (searchKeyword) {
      const keyword = (searchKeyword as string).toLowerCase();
      if (
        !item.uid.toLowerCase().includes(keyword) &&
        !item.phone.toLowerCase().includes(keyword) &&
        !item.enterpriseName.toLowerCase().includes(keyword)
      ) {
        return false;
      }
    }
    // 注册时间范围筛选 (这里需要更复杂的日期比较逻辑)
    // if (registrationTimeRange && (registrationTimeRange as string[]).length === 2) {
    //   const [start, end] = registrationTimeRange as string[];
    //   // 实际应用中需要将 item.registrationTime 转换为日期对象进行比较
    // }
    // 最后登录时间范围筛选
    // if (lastLoginTimeRange && (lastLoginTimeRange as string[]).length === 2) {
    //   const [start, end] = lastLoginTimeRange as string[];
    //   // 实际应用中需要将 item.lastLoginTime 转换为日期对象进行比较
    // }
    return true;
  });

  // 模拟分页
  const startIndex = ((current as any) - 1) * (pageSize as any);
  const endIndex = startIndex + (pageSize as any);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.json({
    data: paginatedData,
    success: true,
    total: filteredData.length,
  });
};

export default {
  'GET /api/recharge': getRechargeList,
};
