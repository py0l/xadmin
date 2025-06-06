import { Request, Response } from 'express';
import Mock from 'mockjs';
import moment from 'moment';

/**
 * 生成单个数据统计项的模板
 */
const dataStatisticsItemTemplate = {
  id: '@guid', // 唯一ID
  accountId: 'jk@string("number", 3)', // 账户ID
  phoneNumber: /^1[3-9]\d{9}$/, // 手机号码
  enterpriseName: '@cword(5, 10)有限公司', // 企业名称
  time: () => Mock.Random.date('yyyy-MM-dd'), // 时间
  _5gSuccess: '@integer(100000, 2000000)', // 5G 消息成功数
  _5gFailure: '@integer(10000, 500000)', // 5G 消息失败数
  smsSuccess: '@integer(10000, 200000)', // 短信成功数
  smsFailure: '@integer(1000, 50000)', // 短信失败数
  submissionCount: '@integer(1000000, 3000000)', // 提交总数
  submissionSuccessCount: '@integer(800000, 2500000)', // 提交成功数
  submissionFailureCount: '@integer(50000, 500000)', // 提交失败数
  // 成功率将在生成列表时计算
};

/**
 * 生成指定数量的数据统计列表
 * @param count 生成的数量
 * @returns 数据统计列表数组
 */
const generateDataStatisticsList = (count: number) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const item = Mock.mock(dataStatisticsItemTemplate);
    // 计算成功率
    const totalSuccess = item._5gSuccess + item.smsSuccess;
    const totalFailure = item._5gFailure + item.smsFailure;
    const total = totalSuccess + totalFailure;
    item.successRate = total > 0 ? ((totalSuccess / total) * 100).toFixed(2) + '%' : '0.00%';
    list.push(item);
  }
  return list;
};

// 生成一个固定的大列表用于筛选和分页
const allDataStatisticsList = generateDataStatisticsList(50); // 生成 50 条模拟数据

export default {
  /**
   * 获取数据统计列表接口
   * 支持分页、账户ID和时间范围筛选
   */
  'GET /api/dataStatistics': (req: Request, res: Response) => {
    const { pageSize = 10, current = 1, accountId, timeRange } = req.query;

    let filteredData = [...allDataStatisticsList]; // 使用生成的列表进行筛选

    // 根据账户ID筛选
    if (accountId) {
      filteredData = filteredData.filter((item) => item.accountId === accountId);
    }

    // 根据时间范围筛选
    if (timeRange && Array.isArray(timeRange) && timeRange.length === 2) {
      const [startTime, endTime] = timeRange;
      filteredData = filteredData.filter((item) => {
        const itemTime = moment(item.time);
        return itemTime.isBetween(moment(startTime), moment(endTime), null, '[]');
      });
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const paginatedList = filteredData.slice(start, end);

    // 计算总计
    const total_5gSuccess = filteredData.reduce((sum, item) => sum + item._5gSuccess, 0);
    const total_5gFailure = filteredData.reduce((sum, item) => sum + item._5gFailure, 0);
    const totalSmsSuccess = filteredData.reduce((sum, item) => sum + item.smsSuccess, 0);
    const totalSmsFailure = filteredData.reduce((sum, item) => sum + item.smsFailure, 0);
    const totalSubmissionCount = filteredData.reduce((sum, item) => sum + item.submissionCount, 0);
    const totalSubmissionSuccessCount = filteredData.reduce(
      (sum, item) => sum + item.submissionSuccessCount,
      0,
    );
    const totalSubmissionFailureCount = filteredData.reduce(
      (sum, item) => sum + item.submissionFailureCount,
      0,
    );

    const totalOverallSuccess = total_5gSuccess + totalSmsSuccess;
    const totalOverallFailure = total_5gFailure + totalSmsFailure;
    const totalOverall = totalOverallSuccess + totalOverallFailure;
    const totalSuccessRate =
      totalOverall > 0 ? ((totalOverallSuccess / totalOverall) * 100).toFixed(2) + '%' : '0.00%';

    res.send({
      data: paginatedList,
      total: filteredData.length,
      success: true,
      summary: {
        _5gSuccess: total_5gSuccess,
        _5gFailure: total_5gFailure,
        smsSuccess: totalSmsSuccess,
        smsFailure: totalSmsFailure,
        successRate: totalSuccessRate,
        submissionCount: totalSubmissionCount,
        submissionSuccessCount: totalSubmissionSuccessCount,
        submissionFailureCount: totalSubmissionFailureCount,
      },
    });
  },
};
