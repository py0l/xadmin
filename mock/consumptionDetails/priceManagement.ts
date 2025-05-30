import Mock from 'mockjs';
import moment from 'moment'; // 导入 moment 用于日期处理

// 封装获取价格管理列表的 mock 数据逻辑
const getPriceManagementList = (req: any, res: any) => {
  const {
    pageSize = 10,
    current = 1,
    userRole,
    searchKeyword,
    registrationTime,
    lastLoginTime,
  } = req.query; // 获取请求中的 pageSize, current 和筛选参数

  // 1. 生成所有可能的 mock 数据（为了方便筛选，先生成一个较大的数据集）
  const allData = Mock.mock({
    'data|200': [
      // 假设总共有200条数据，可以根据需要调整
      {
        'accountUID|8': /[a-z][0-9]/, // 随机生成8位字母数字组合的账号UID
        phoneNumber: /^1[3-9]\d{9}$/, // 随机生成手机号
        'userRole|1': ['普通客户', '企业客户'], // 随机选择用户角色
        'certificationStatus|1': ['未认证', '已认证'], // 随机选择认证状态
        enterpriseName: function (this: any) {
          // 根据认证状态随机生成企业名称
          return this['certificationStatus'] === '已认证'
            ? Mock.Random.csentence(5, 10) + '有限公司'
            : '';
        },
        registrationTime: () => Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'), // 随机生成注册时间
        lastLoginTime: () => Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'), // 随机生成最后登录时间
        dataServices: [
          { name: '及刻数据 泛数据', price: 0.2, unit: '元/条' },
          { name: '及刻数据 精准数据', price: 1.0, unit: '元/条' },
        ],
        marketingServices: [
          { name: '富信 5G消息', price: 0.5, unit: '元/条' },
          { name: '富信 文本短信', price: 0.05, unit: '元/条' },
        ],
      },
    ],
  }).data;

  // 2. 根据查询条件进行筛选
  let filteredData = allData.filter((item: any) => {
    let match = true;

    // 角色筛选
    if (userRole && userRole !== 'all' && item.userRole !== userRole) {
      match = false;
    }

    // 关键词搜索 (账号ID、手机号、企业名称)
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const itemValues = [item.accountUID, item.phoneNumber, item.enterpriseName].map((val) =>
        (val || '').toLowerCase(),
      );
      if (!itemValues.some((val) => val.includes(keyword))) {
        match = false;
      }
    }

    // 注册时间范围筛选
    if (registrationTime && registrationTime.length === 2) {
      const [startTime, endTime] = registrationTime;
      const itemTime = moment(item.registrationTime);
      if (!itemTime.isBetween(startTime, endTime, null, '[]')) {
        // [] 表示包含开始和结束时间
        match = false;
      }
    }

    // 最后登录时间范围筛选
    if (lastLoginTime && lastLoginTime.length === 2) {
      const [startTime, endTime] = lastLoginTime;
      const itemTime = moment(item.lastLoginTime);
      if (!itemTime.isBetween(startTime, endTime, null, '[]')) {
        match = false;
      }
    }

    return match;
  });

  // 3. 应用分页
  const total = filteredData.length;
  const startIndex = (current - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.send({
    data: paginatedData,
    success: true,
    total: total,
  });
};

// 获取价格详情的 mock 数据逻辑
const getPriceDetails = (req: any, res: any) => {
  const { accountUID } = req.params; // 从 URL 参数中获取 accountUID

  // 模拟从数据库获取数据
  const mockDetail = Mock.mock({
    accountUID: accountUID,
    phoneNumber: /^1[3-9]\d{9}$/,
    enterpriseName: Mock.Random.csentence(5, 10) + '有限公司',
    'userRole|1': ['普通客户', '企业客户'],
    dataServices: {
      generalDataPrice: () => Mock.Random.float(0.1, 10, 2, 2),
      accurateDataPrice: () => Mock.Random.float(0.5, 20, 2, 2),
    },
    marketingServices: {
      fiveGMessagePrice: () => Mock.Random.float(0.01, 1, 2, 2),
      textMessagePrice: () => Mock.Random.float(0.01, 0.5, 2, 2),
    },
  });

  res.send({
    data: mockDetail,
    success: true,
    message: '获取价格详情成功',
  });
};

// 更新价格详情的 mock 数据逻辑
const updatePriceDetails = (req: any, res: any) => {
  const { accountUID, dataServices, marketingServices } = req.body; // 获取请求体中的数据

  // 在这里可以模拟数据更新的逻辑，例如保存到内存中的某个变量
  console.log('更新价格详情:', { accountUID, dataServices, marketingServices });

  res.send({
    success: true,
    message: '价格更新成功',
  });
};

export default {
  'GET /api/priceManagement/list': getPriceManagementList,
  'GET /api/priceManagement/details/:accountUID': getPriceDetails,
  'POST /api/priceManagement/update': updatePriceDetails,
};
