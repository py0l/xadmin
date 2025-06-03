import { ProColumns, ProTable } from '@ant-design/pro-components';
import { history, request } from '@umijs/max';
import { Button, Popconfirm, message } from 'antd';
import React, { useEffect, useState } from 'react';

// 定义表格数据类型
interface TableListItem {
  key: string;
  accountId: string;
  phoneNumber: string;
  userRole: string;
  enterpriseName: string;
  applicationTime: string;
}

const AccountReview: React.FC = () => {
  const [dataSource, setDataSource] = useState<TableListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await request('/api/jike-data/account-review');
      if (result.success) {
        setDataSource(result.data);
      } else {
        message.error('获取数据失败');
      }
    } catch (error) {
      message.error('请求失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 处理通过操作
  const handlePass = (record: TableListItem) => {
    message.success(`已通过账号UID为 ${record.accountId} 的开户申请`);
    setDataSource(dataSource.filter((item) => item.key !== record.key));
  };

  // 处理拒绝操作
  const handleReject = (record: TableListItem) => {
    message.error(`已拒绝账号UID为 ${record.accountId} 的开户申请`);
    setDataSource(dataSource.filter((item) => item.key !== record.key));
  };

  // 定义表格列
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '账号UID',
      dataIndex: 'accountId',
      key: 'accountId',
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
      title: '开户资料',
      key: 'accountInfo',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() =>
            history.push(`/data-service/jike-data/account-review/detail/${record.accountId}`)
          }
        >
          查看
        </Button>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <span>
          <Popconfirm
            title="确定通过此开户申请吗？"
            onConfirm={() => handlePass(record)}
            okText="是"
            cancelText="否"
          >
            <Button type="link">通过</Button>
          </Popconfirm>
          <Popconfirm
            title="确定拒绝此开户申请吗？"
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
    <ProTable
      columns={columns}
      dataSource={dataSource}
      rowKey="key"
      search={false} // 不显示搜索表单
      options={false} // 不显示表格工具栏
      pagination={{
        showSizeChanger: true,
      }}
      headerTitle=" "
      loading={loading}
    />
  );
};

export default AccountReview;
