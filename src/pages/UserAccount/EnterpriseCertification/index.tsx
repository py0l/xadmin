import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Card, message, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { history, Outlet, useLocation } from 'umi'; // 确保导入 Outlet 和 useLocation

// 模拟数据
const mockEnterpriseList = [
  {
    uid: 'jk0092',
    phoneNumber: '13800138002',
    userRole: '普通客户',
    enterpriseName: '深圳创鑫技术有限公司',
    applicationTime: '2024-08-18 17:35',
    status: 'pending', // pending, approved, rejected
  },
  {
    uid: 'jk0091',
    phoneNumber: '13800138001',
    userRole: '普通客户',
    enterpriseName: '深圳赛格股份有限公司',
    applicationTime: '2024-08-15 17:35',
    status: 'pending',
  },
  {
    uid: 'jk0090',
    phoneNumber: '13800138000',
    userRole: '普通客户',
    enterpriseName: '广州市天河软件园有限公司',
    applicationTime: '2024-08-14 10:00',
    status: 'approved',
  },
];

const EnterpriseCertification: React.FC = () => {
  const location = useLocation();
  const isEnterpriseCertificationPage =
    location.pathname === '/user-account/enterprise-certification';
  const [dataSource, setDataSource] = useState(mockEnterpriseList);

  // 处理通过操作
  const handleApprove = (record: any) => {
    message.success(`已通过 ${record.enterpriseName} 的企业认证`);
    setDataSource(dataSource.filter((item) => item.uid !== record.uid));
  };

  // 处理拒绝操作
  const handleReject = (record: any) => {
    message.error(`已拒绝 ${record.enterpriseName} 的企业认证`);
    setDataSource(dataSource.filter((item) => item.uid !== record.uid));
  };

  // 定义表格列
  const columns = [
    {
      title: '账号UID',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      key: 'userRole',
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
    },
    {
      title: '申请时间',
      dataIndex: 'applicationTime',
      key: 'applicationTime',
    },
    {
      title: '企业资料',
      key: 'enterpriseInfo',
      render: (text: any, record: any) => (
        <a
          onClick={() =>
            history.push(`/user-account/enterprise-certification/detail/${record.uid}`)
          }
        >
          查看
        </a>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (text: any, record: any) => (
        <span>
          <Popconfirm
            title="确定通过该企业认证吗？"
            onConfirm={() => handleApprove(record)}
            okText="是"
            cancelText="否"
          >
            <Button type="link">通过</Button>
          </Popconfirm>
          <Popconfirm
            title="确定拒绝该企业认证吗？"
            onConfirm={() => handleReject(record)}
            okText="是"
            cancelText="否"
          >
            <Button type="link" danger>
              拒绝
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      {isEnterpriseCertificationPage ? (
        <Card>
          <ProTable
            columns={columns}
            dataSource={dataSource.filter((item) => item.status === 'pending')} // 只显示待处理的
            rowKey="uid"
            search={false}
            options={false}
            pagination={false}
            headerTitle="企业认证列表"
          />
        </Card>
      ) : (
        <Outlet />
      )}
    </PageContainer>
  );
};

export default EnterpriseCertification;
