import type { ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Card, message, Space } from 'antd';
import React, { useState } from 'react';

// 定义数据类型
interface RechargeItem {
  uid: string;
  phone: string;
  role: string;
  certificationStatus: string;
  enterpriseName: string;
  accountBalance: string;
  registrationTime: string;
  lastLoginTime: string;
}

// 模拟数据
const mockRechargeData: RechargeItem[] = [
  {
    uid: 'jk0092',
    phone: '13800138002',
    role: '普通客户',
    certificationStatus: '未认证',
    enterpriseName: '',
    accountBalance: '30000.00',
    registrationTime: '2024-08-08 15:35',
    lastLoginTime: '2024-08-18 17:35',
  },
  {
    uid: 'jk0091',
    phone: '13800138001',
    role: '普通客户',
    certificationStatus: '已认证',
    enterpriseName: '深圳赛格股份有限公司',
    accountBalance: '30000.00',
    registrationTime: '2024-08-08 15:35',
    lastLoginTime: '2024-08-18 17:35',
  },
];

const RechargeManagement: React.FC = () => {
  // 当前充值的账号UID
  const [currentRechargeUid, setCurrentRechargeUid] = useState<string | undefined>(undefined);

  // 处理充值按钮点击
  const handleRechargeClick = (record: RechargeItem) => {
    setCurrentRechargeUid(record.uid);
  };

  // 表格列定义
  const columns: ProColumns<RechargeItem>[] = [
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
      title: '账号余额',
      dataIndex: 'accountBalance',
      key: 'accountBalance',
      search: false,
    },
    {
      title: '操作',
      key: 'actions',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleRechargeClick(record)}>
            充值
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据请求
  const requestData = async (params: any, sort: any, filter: any) => {
    console.log('请求参数:', params, sort, filter);

    // 模拟筛选逻辑
    let filteredData = mockRechargeData.filter((item) => {
      // 角色筛选
      if (params.role && params.role !== 'all' && item.role !== params.role) {
        return false;
      }
      // 关键词搜索
      if (params.searchKeyword) {
        const keyword = params.searchKeyword.toLowerCase();
        if (
          !item.uid.toLowerCase().includes(keyword) &&
          !item.phone.toLowerCase().includes(keyword) &&
          !item.enterpriseName.toLowerCase().includes(keyword)
        ) {
          return false;
        }
      }
      // 注册时间范围筛选 (这里需要更复杂的日期比较逻辑)
      // if (params.registrationTimeRange && params.registrationTimeRange.length === 2) {
      //   const [start, end] = params.registrationTimeRange;
      //   // 实际应用中需要将 item.registrationTime 转换为日期对象进行比较
      // }
      // 最后登录时间范围筛选
      // if (params.lastLoginTimeRange && params.lastLoginTimeRange.length === 2) {
      //   const [start, end] = params.lastLoginTimeRange;
      //   // 实际应用中需要将 item.lastLoginTime 转换为日期对象进行比较
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
      <Card>
        <ProTable<
          RechargeItem,
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
          pagination={{
            showSizeChanger: true,
          }}
          options={false} // 关闭ProTable自带的工具栏，只保留搜索和分页
        />
      </Card>

      <ModalForm
        title="账号充值"
        width="450px"
        open={!!currentRechargeUid}
        onOpenChange={(visible) => {
          if (!visible) {
            setCurrentRechargeUid(undefined);
          }
        }}
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (values) => {
          console.log('充值金额:', values.rechargeAmount);
          message.success(`账号 ${values.uid} 充值 ${values.rechargeAmount} 元成功！`);
          setCurrentRechargeUid(undefined);
          return true;
        }}
        initialValues={{
          uid: currentRechargeUid,
        }}
      >
        <ProFormText name="uid" hidden />
        <ProFormDigit
          label="充值金额"
          name="rechargeAmount"
          min={0.01}
          fieldProps={{
            addonAfter: '元',
            precision: 2,
          }}
          rules={[
            { required: true, message: '请输入充值金额！' },
            {
              validator: (_: any, value: number) => {
                if (value && value <= 0) {
                  return Promise.reject(new Error('充值金额必须大于0！'));
                }
                return Promise.resolve();
              },
            },
          ]}
          placeholder="请输入充值金额"
          width="lg"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default RechargeManagement;
