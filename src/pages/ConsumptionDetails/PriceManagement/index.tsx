import { queryPriceManagementList } from '@/services/consumptionDetails/priceManagement'; // 导入接口
import { PageContainer, ProTable, ProTableProps } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';

const PriceManagement: React.FC = () => {
  const columns = [
    {
      title: '角色',
      dataIndex: 'userRole',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        normal: { text: '普通客户' },
        enterprise: { text: '企业客户' },
      },
      hideInTable: true, // 在表格中隐藏，只在搜索表单中显示
    },
    {
      title: '查询',
      dataIndex: 'searchKeyword',
      fieldProps: {
        placeholder: '输入账号ID、手机号、企业名称',
      },
      hideInTable: true, // 在表格中隐藏，只在搜索表单中显示
    },
    {
      title: '注册时间',
      dataIndex: 'registrationTime',
      valueType: 'dateRange',
      hideInTable: true, // 在表格中隐藏，只在搜索表单中显示
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      valueType: 'dateRange',
      hideInTable: true, // 在表格中隐藏，只在搜索表单中显示
    },
    {
      title: '账号UID',
      dataIndex: 'accountUID',
      key: 'accountUID',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      key: 'userRole',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '认证状态',
      dataIndex: 'certificationStatus',
      key: 'certificationStatus',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '操作',
      key: 'action',
      search: false, // 不在搜索表单中显示
      render: () => (
        <Space>
          <a>查看</a>
          <a>设置</a>
        </Space>
      ),
    },
  ] as ProTableProps<API.PriceManagementItem, API.PriceManagementListParams>['columns'];

  return (
    <PageContainer title={false}>
      <ProTable<API.PriceManagementItem, API.PriceManagementListParams>
        columns={columns}
        rowKey="accountUID"
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        pagination={{
          showSizeChanger: true,
        }}
        headerTitle=" "
        request={async (params, sorter, filter) => {
          const result = await queryPriceManagementList({
            ...params,
            ...(sorter as any),
            ...filter,
          });
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

export default PriceManagement;
