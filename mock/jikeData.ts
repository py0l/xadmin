import { Request, Response } from 'express';
import Mock from 'mockjs';

/**
 * 生成账户审核列表项的模板
 */
const accountReviewItemTemplate = {
  key: '@guid', // 唯一键
  accountId: 'jk@string("number", 3)', // 账户ID
  phoneNumber: /^1[3-9]\d{9}$/, // 手机号码
  userRole: '普通客户', // 用户角色
  enterpriseName: '@cword(5, 10)有限公司', // 企业名称
  applicationTime: '@datetime("yyyy-MM-dd HH:mm:ss")', // 申请时间
};

/**
 * 生成指定数量的账户审核列表数据
 * @param count 生成的数量
 * @returns 账户审核列表数组
 */
const generateAccountReviewList = (count: number) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push(Mock.mock(accountReviewItemTemplate));
  }
  return list;
};

// 生成一个固定的大列表用于账户审核
const allAccountReviewList = generateAccountReviewList(20); // 生成 20 条模拟数据

/**
 * 获取账户审核列表接口
 */
const getAccountReviewList = (req: Request, res: Response) => {
  const { pageSize = 10, current = 1 } = req.query;

  const start = (Number(current) - 1) * Number(pageSize);
  const end = start + Number(pageSize);
  const paginatedList = allAccountReviewList.slice(start, end);

  res.send({
    success: true,
    data: paginatedList,
    total: allAccountReviewList.length,
  });
};

/**
 * 人群包记录状态列表
 */
const crowdPackageStatuses = ['approved', 'rejected', 'pending', 'canceled', 'available'];

/**
 * 生成人群包记录项的模板
 */
const crowdPackageRecordItemTemplate = {
  accountId: 'jk@string("number", 3)', // 账户ID
  phoneNumber: /^1[3-9]\d{9}$/, // 手机号码
  enterpriseName: '@cword(5, 10)有限公司', // 企业名称
  dataPackageId: '@string("number", 2)', // 数据包ID
  dataPackageName: '(创建时的人群包名称)@cword(2, 5)', // 人群包名称
  quantity: '@integer(0, 1000000)', // 数量
  actualOutput: '@integer(0, 1000000)', // 实际输出
  difference: '@integer(0, 500000)', // 差异
  replenishment: '@integer(0, 500000)', // 补量
  createTime: '@datetime("yyyy-MM-dd HH:mm:ss")', // 创建时间
  completeTime: () => Mock.Random.date('yyyy-MM-dd HH:mm:ss'), // 完成时间
  status: () => Mock.Random.pick(crowdPackageStatuses), // 状态
};

/**
 * 生成指定数量的人群包记录列表数据
 * @param count 生成的数量
 * @returns 人群包记录列表数组
 */
const generateCrowdPackageRecordList = (count: number) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const item = Mock.mock(crowdPackageRecordItemTemplate);
    // 根据状态调整 completeTime
    if (item.status === 'pending' || item.status === 'canceled' || item.status === 'rejected') {
      item.completeTime = ''; // 未完成或取消/拒绝的状态，完成时间为空
    } else if (item.status === 'approved' || item.status === 'available') {
      // 对于已批准或可用的状态，确保 actualOutput <= quantity
      if (item.actualOutput > item.quantity) {
        item.actualOutput = Mock.Random.integer(0, item.quantity);
      }
      item.difference = item.quantity - item.actualOutput;
      item.replenishment = item.difference > 0 ? Mock.Random.integer(0, item.difference) : 0;
    }
    list.push(item);
  }
  return list;
};

// 生成一个固定的大列表用于人群包记录
const allCrowdPackageRecordList = generateCrowdPackageRecordList(50); // 生成 50 条模拟数据

/**
 * 查询人群包记录接口
 * 支持分页、状态和关键词筛选
 */
const queryCrowdPackageRecord = (req: Request, res: Response) => {
  const { pageSize = 10, current = 1, status, searchKeyword } = req.query;

  let filteredData = [...allCrowdPackageRecordList]; // 使用生成的列表进行筛选

  // 根据状态筛选
  if (status && status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }
  // 根据关键词筛选 (数据包ID或人群包名称)
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
