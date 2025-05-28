import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, Outlet, useLocation } from '@umijs/max';
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

// 模拟数据
const mockData: RoleItem[] = [
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
];

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

  // 模拟数据请求
  const requestData = async (params: any, sort: any, filter: any) => {
    console.log('请求参数:', params, sort, filter);

    let filteredData = mockData.filter((item) => {
      // 关键词搜索
      if (params.searchKeyword) {
        const keyword = params.searchKeyword.toLowerCase();
        if (!item.userRole.toLowerCase().includes(keyword)) {
          return false;
        }
      }
      // 创建时间范围筛选 (这里需要更复杂的日期比较逻辑)
      // if (params.creationTimeRange && params.creationTimeRange.length === 2) {
      //   const [start, end] = params.creationTimeRange;
      //   // 实际应用中需要将 item.creationTime 转换为日期对象进行比较
      // }
      return true;
    });

    // 模拟分页
    const { current = 1, pageSize = 10 } = params;
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      success: true,
      total: filteredData.length,
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
