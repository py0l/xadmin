import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, Outlet, request, useLocation } from '@umijs/max';
import { Button, Space, Typography } from 'antd';
import React from 'react';

const { Link } = Typography;

// 定义数据类型
interface RoleItem {
  roleId: string;
  userRole: string;
  enabledModules: string;
  creationTime: string;
}

const RoleManagement: React.FC = () => {
  const location = useLocation();
  const isRoleManagementPage = location.pathname === '/user-account/role-management';

  // 表格列定义
  const columns: ProColumns<RoleItem>[] = [
    {
      title: '查询',
      dataIndex: 'searchKeyword',
      hideInTable: true,
      fieldProps: {
        placeholder: '输入角色名称',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'creationTimeRange',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '角色ID',
      dataIndex: 'roleId',
      key: 'roleId',
      search: false,
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      key: 'userRole',
      search: false,
    },
    {
      title: '开通模块',
      dataIndex: 'enabledModules',
      key: 'enabledModules',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'creationTime',
      key: 'creationTime',
      search: false,
    },
    {
      title: '操作',
      key: 'actions',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Link onClick={() => history.push(`/user-account/role-management/edit/${record.roleId}`)}>
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
    const response = await request('/api/role', {
      method: 'GET',
      params: {
        ...params,
        ...sort,
        ...filter,
      },
    });
    return {
      data: response.data,
      success: response.success,
      total: response.total,
    };
  };

  return (
    <PageContainer title={false}>
      {isRoleManagementPage ? (
        <ProTable<
          RoleItem,
          {
            searchKeyword?: string;
            creationTimeRange?: [string, string];
          }
        >
          columns={columns}
          request={requestData}
          rowKey="roleId"
          search={{
            labelWidth: 'auto',
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push('/user-account/role-management/add')}
            >
              新增角色
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

export default RoleManagement;
