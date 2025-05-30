import {
  approveEnterpriseCert,
  queryEnterpriseCertifications,
  rejectEnterpriseCert,
} from '@/services/userAccount/enterpriseCertification';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history, Outlet, useLocation } from '@umijs/max';
import { Button, Card, message, Popconfirm } from 'antd';
import React, { useState } from 'react';

const EnterpriseCertification: React.FC = () => {
  const location = useLocation();
  const isEnterpriseCertificationPage =
    location.pathname === '/user-account/enterprise-certification';
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.EnterpriseItem[]>([]);

  // 模拟数据请求
  const fetchEnterpriseData = async () => {
    setLoading(true);
    try {
      const response = await queryEnterpriseCertifications({ status: 'pending' }); // 只请求待处理的
      if (response.success) {
        setData(response.data);
      } else {
        message.error('获取企业认证列表失败');
      }
    } catch (error) {
      message.error('获取企业认证列表异常');
    } finally {
      setLoading(false);
    }
  };

  // 首次加载和操作后刷新数据
  React.useEffect(() => {
    fetchEnterpriseData();
  }, []);

  // 处理通过操作
  const handleApprove = async (record: API.EnterpriseItem) => {
    try {
      const response = await approveEnterpriseCert({ uid: record.uid });
      if (response.success) {
        message.success(response.message);
        fetchEnterpriseData(); // 刷新列表
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('通过操作异常');
    }
  };

  // 处理拒绝操作
  const handleReject = async (record: API.EnterpriseItem) => {
    try {
      const response = await rejectEnterpriseCert({ uid: record.uid });
      if (response.success) {
        message.error(response.message); // 拒绝通常用error提示
        fetchEnterpriseData(); // 刷新列表
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('拒绝操作异常');
    }
  };

  // 定义表格列
  const columns: ProColumns<API.EnterpriseItem>[] = [
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
          <ProTable<API.EnterpriseItem>
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="uid"
            search={false}
            options={false}
            pagination={{
              showSizeChanger: true,
            }}
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
