import { Request, Response } from 'express';
import moment from 'moment';

const dataStatisticsList = [
  {
    id: '1',
    accountId: 'jk0092',
    phoneNumber: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    time: '2025-01-01',
    _5gSuccess: 2000000,
    _5gFailure: 1830000,
    smsSuccess: 170000,
    smsFailure: 170000,
    successRate: '91.50%',
    submissionCount: 2000000,
    submissionSuccessCount: 1830000,
    submissionFailureCount: 200000,
  },
  {
    id: '2',
    accountId: 'jk0091',
    phoneNumber: '13800138001',
    enterpriseName: '深圳xxxxxx有限公司',
    time: '2025-01-01',
    _5gSuccess: 2000000,
    _5gFailure: 1830000,
    smsSuccess: 170000,
    smsFailure: 170000,
    successRate: '91.50%',
    submissionCount: 2000000,
    submissionSuccessCount: 1830000,
    submissionFailureCount: 200000,
  },
  {
    id: '3',
    accountId: 'jk0093',
    phoneNumber: '13800138003',
    enterpriseName: '深圳xxxxxx有限公司',
    time: '2025-01-01',
    _5gSuccess: 2000000,
    _5gFailure: 1830000,
    smsSuccess: 170000,
    smsFailure: 170000,
    successRate: '91.50%',
    submissionCount: 2000000,
    submissionSuccessCount: 1830000,
    submissionFailureCount: 200000,
  },
  {
    id: '4',
    accountId: 'jk0092',
    phoneNumber: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    time: '2025-01-01',
    _5gSuccess: 2000000,
    _5gFailure: 1630700,
    smsSuccess: 369300,
    smsFailure: 369300,
    successRate: '81.54%',
    submissionCount: 2000000,
    submissionSuccessCount: 1630700,
    submissionFailureCount: 200000,
  },
  {
    id: '5',
    accountId: 'jk0091',
    phoneNumber: '13800138001',
    enterpriseName: '深圳赛格股份有限公司',
    time: '2025-01-01',
    _5gSuccess: 2000000,
    _5gFailure: 1830000,
    smsSuccess: 170000,
    smsFailure: 170000,
    successRate: '91.50%',
    submissionCount: 2000000,
    submissionSuccessCount: 1830000,
    submissionFailureCount: 200000,
  },
  {
    id: '6',
    accountId: 'jk0092',
    phoneNumber: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    time: '2025-01-01',
    _5gSuccess: 2000000,
    _5gFailure: 1903030,
    smsSuccess: 96970,
    smsFailure: 96970,
    successRate: '95.15%',
    submissionCount: 2000000,
    submissionSuccessCount: 1903030,
    submissionFailureCount: 200000,
  },
  {
    id: '7',
    accountId: 'jk0091',
    phoneNumber: '13800138001',
    enterpriseName: '深圳赛格股份有限公司',
    time: '2025-01-01',
    _5gSuccess: 2000000,
    _5gFailure: 1900000,
    smsSuccess: 100000,
    smsFailure: 100000,
    successRate: '95.00%',
    submissionCount: 2000000,
    submissionSuccessCount: 1900000,
    submissionFailureCount: 200000,
  },
];

export default {
  'GET /api/dataStatistics': (req: Request, res: Response) => {
    const { pageSize = 10, current = 1, accountId, timeRange } = req.query;

    let filteredData = dataStatisticsList;

    // 模拟筛选逻辑
    if (accountId) {
      filteredData = filteredData.filter((item) => item.accountId === accountId);
    }

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
    const totalSuccessRate =
      (
        ((total_5gSuccess + totalSmsSuccess) /
          (total_5gSuccess + total_5gFailure + totalSmsSuccess + totalSmsFailure)) *
        100
      ).toFixed(2) + '%';

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
