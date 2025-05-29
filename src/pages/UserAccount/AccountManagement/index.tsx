import { queryAccountList } from '@/services/userAccount/account';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, Outlet, useLocation } from '@umijs/max';
import { Button, Space, Typography } from 'antd';
import React from 'react';

const { Link } = Typography;

const AccountManagement: React.FC = () => {
  const location = useLocation();
  const isAccountManagementPage = location.pathname === '/user-account/account-management';

  // 表格列定义
  const columns: ProColumns<API.AccountItem>[] = [
    {
      title: '角色',
      dataIndex: 'role',
      valueType: 'select',
      hideInTable: true, // 在表格中隐藏，只在搜索表单中显示
      valueEnum: {
        all: { text: '全部' },
        customer: { text: '普通客户' },
        // 更多角色选项
      },
      fieldProps: {
        defaultValue: 'all', // 设置默认值
      },
    },
    {
      title: '查询',
      dataIndex: 'searchKeyword',
      hideInTable: true,
      fieldProps: {
        placeholder: '输入账号ID、手机号、企业名称',
      },
    },
    {
      title: '注册时间',
      dataIndex: 'registrationTimeRange',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTimeRange',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '账号UID',
      dataIndex: 'uid',
      key: 'uid',
      search: false, // 不作为搜索项
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      search: false,
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      search: false,
    },
    {
      title: '认证状态',
      dataIndex: 'certificationStatus',
      key: 'certificationStatus',
      search: false,
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      search: false,
    },
    {
      title: '账户余额',
      dataIndex: 'accountBalance',
      key: 'accountBalance',
      search: false,
    },
    {
      title: '注册/最后登录时间',
      dataIndex: 'registrationAndLoginTime',
      key: 'registrationAndLoginTime',
      search: false,
      render: (_, record) => (
        <>
          <div>注册 {record.registrationTime}</div>
          <div>最后 {record.lastLoginTime}</div>
        </>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Link onClick={() => history.push(`/user-account/account-management/edit/${record.uid}`)}>
            编辑
          </Link>
          <Link>删除</Link>
        </Space>
      ),
    },
  ];

  // 数据请求
  const requestData = async (params: any, sort: any, filter: any) => {
    console.log('请求参数:', params, sort, filter);
    const response = await queryAccountList({
      ...params,
      // 将 sort 和 filter 参数传递给后端
      ...sort,
      ...filter,
    });
    return {
      data: response.data,
      success: response.success,
      total: response.total,
    };
  };

  return (
    <PageContainer title={false}>
      {isAccountManagementPage ? (
        <ProTable<
          API.AccountItem,
          {
            role?: string;
            searchKeyword?: string;
            registrationTimeRange?: [string, string];
            lastLoginTimeRange?: [string, string];
          }
        >
          columns={columns}
          request={requestData}
          rowKey="uid"
          search={{
            labelWidth: 'auto',
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push('/user-account/account-management/add')}
            >
              新增账号
            </Button>,
          ]}
          pagination={{
            showSizeChanger: true,
          }}
          options={false} // 关闭ProTable自带的工具栏，只保留搜索和分页
        />
      ) : (
        <Outlet />
      )}
    </PageContainer>
  );
};

export default AccountManagement;
