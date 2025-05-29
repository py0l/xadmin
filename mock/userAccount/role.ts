import { Request, Response } from 'express';

// 定义数据类型
interface RoleItem {
  roleId: string;
  userRole: string;
  enabledModules: string;
  creationTime: string;
}

// 模拟数据
const mockRoleData: RoleItem[] = [
  {
    roleId: 'js004',
    userRole: '普通客户',
    enabledModules: '首页, 查询数据, 数据地图',
    creationTime: '2024-08-18 17:35',
  },
  {
    roleId: 'js003',
    userRole: '代理商',
    enabledModules: '首页, 查询数据, 城市热力',
    creationTime: '2024-08-18 17:35',
  },
  {
    roleId: 'js002',
    userRole: '运营人员',
    enabledModules: '首页, 消费明细, 数据服务',
    creationTime: '2024-08-18 17:35',
  },
  {
    roleId: 'js001',
    userRole: '管理员',
    enabledModules: '所有模块',
    creationTime: '2024-08-18 17:35',
  },
  {
    roleId: 'js005',
    userRole: '测试用户',
    enabledModules: '首页',
    creationTime: '2024-08-19 09:00',
  },
];

// 模拟角色列表请求
const getRoleList = (req: Request, res: Response) => {
  const { current, pageSize, searchKeyword, creationTimeRange } = req.query;

  let filteredData = mockRoleData.filter((item) => {
    // 关键词搜索
    if (searchKeyword) {
      const keyword = (searchKeyword as string).toLowerCase();
      if (!item.userRole.toLowerCase().includes(keyword)) {
        return false;
      }
    }
    // 创建时间范围筛选 (这里需要更复杂的日期比较逻辑)
    // if (creationTimeRange && (creationTimeRange as string[]).length === 2) {
    //   const [start, end] = creationTimeRange as string[];
    //   // 实际应用中需要将 item.creationTime 转换为日期对象进行比较
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
  'GET /api/role': getRoleList,
};
