import { queryConsumptionStatistics } from '@/services/consumptionDetails/consumptionStatistics';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';

const ConsumptionStatistics: React.FC = () => {
  const columns = [
    {
      title: '交易时间',
      dataIndex: 'transactionTime',
      // 将交易时间作为查询月份的字段
      valueType: 'dateMonth',
      fieldProps: {
        picker: 'month',
      },
      formItemProps: {
        label: '查询月份',
      },
    },
    {
      title: '账号',
      dataIndex: 'account',
      valueType: 'select',
      valueEnum: {
        all: '全部账号',
        '13800138001(深圳赛格股份有限公司)': '13800138001(深圳赛格股份有限公司)',
        '13800138002(未认证)': '13800138002(未认证)',
      },
      fieldProps: {
        placeholder: '请选择账号',
      },
    },
    {
      title: '收支类型',
      dataIndex: 'incomeExpenseType',
      valueType: 'select',
      valueEnum: {
        all: '全部',
        income: '收入',
        expense: '支出',
      },
      fieldProps: {
        placeholder: '请选择收支类型',
      },
    },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      valueType: 'select',
      valueEnum: {
        all: '全部',
        sms: '短信服务',
        recharge: '充值',
        crowdPackage: '人群包',
      },
      fieldProps: {
        placeholder: '请选择交易类型',
      },
    },
    {
      title: '变动金额(元)',
      dataIndex: 'amount',
      search: false, // 不作为搜索项
    },
    {
      title: '事项名称',
      dataIndex: 'itemName',
      search: false, // 不作为搜索项
    },
    {
      title: '账户余额(元)',
      dataIndex: 'balance',
      search: false, // 不作为搜索项
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable
        columns={columns}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        headerTitle=" "
        request={async (params, sorter, filter) => {
          const result = await queryConsumptionStatistics({ ...params, ...filter });
          return {
            data: result.data,
            success: result.success,
            total: result.total,
          };
        }}
      />
    </PageContainer>
  );
};

export default ConsumptionStatistics;
