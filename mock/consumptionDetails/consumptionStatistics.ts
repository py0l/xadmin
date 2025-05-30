import { Request, Response } from 'express';
import moment from 'moment';

// 模拟数据生成函数
const generateData = (count: number) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const id = `${i + 1}`;
    const transactionTime = moment().subtract(i, 'days').format('YYYY-MM-DD HH:mm:ss');
    const account = i % 2 === 0 ? '13800138001(深圳赛格股份有限公司)' : '13800138002(未认证)';
    const incomeExpenseType = i % 3 === 0 ? '收入' : '支出';
    const transactionType = i % 3 === 0 ? '充值' : i % 3 === 1 ? '短信服务' : '人群包';
    const amount = incomeExpenseType === '收入' ? 10000.0 : -100.0;
    const itemName = incomeExpenseType === '收入' ? '充值' : '(发送短信的任务名称)';
    const balance = 10000.0 - i * 100;

    data.push({
      id,
      transactionTime,
      account,
      incomeExpenseType,
      transactionType,
      amount,
      itemName,
      balance,
    });
  }
  return data;
};

const totalData = generateData(50); // 生成50条模拟数据

export default {
  'GET /api/consumptionStatistics': (req: Request, res: Response) => {
    const {
      pageSize = 10,
      current = 1,
      account,
      incomeExpenseType,
      transactionType,
      queryMonth,
    } = req.query;

    let filteredData = totalData;

    // 根据查询参数过滤数据
    if (account && account !== 'all') {
      filteredData = filteredData.filter((item) => item.account === account);
    }
    if (incomeExpenseType && incomeExpenseType !== 'all') {
      filteredData = filteredData.filter((item) => item.incomeExpenseType === incomeExpenseType);
    }
    if (transactionType && transactionType !== 'all') {
      filteredData = filteredData.filter((item) => item.transactionType === transactionType);
    }
    if (queryMonth) {
      const month = moment(queryMonth as string).format('YYYY-MM');
      filteredData = filteredData.filter(
        (item) => moment(item.transactionTime).format('YYYY-MM') === month,
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const data = filteredData.slice(start, end);

    res.send({
      data: data,
      total: filteredData.length,
      success: true,
    });
  },
};
