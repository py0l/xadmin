import { getChatbotList } from '@/services/Borui5GMessage/ChatbotManagement';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Space, Typography } from 'antd';
import React from 'react';

// 模拟数据类型
interface ChatbotItem {
  uid: string;
  phone: string;
  enterpriseName: string;
  chatbotId: string;
  chatbotName: string;
  createTime: string;
  status: '同意' | '拒绝' | '审核中' | '通过';
}

const ChatbotManagement: React.FC = () => {
  // 模拟表格数据
  // 表格列定义
  const columns: ProColumns<ChatbotItem>[] = [
    {
      title: '账号UID',
      dataIndex: 'uid',
      key: 'uid',
      search: false, // 不在此列搜索
      valueType: 'select',
      valueEnum: {
        all: { text: '全部账号' },
        jk0091: { text: 'jk0091' },
        jk0092: { text: 'jk0092' },
        jk0093: { text: 'jk0093' },
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      search: false, // 不在此列搜索
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      search: false, // 不在此列搜索
    },
    {
      title: 'Chatbot ID',
      dataIndex: 'chatbotId',
      key: 'chatbotId',
      search: false, // 不在此列搜索
    },
    {
      title: 'Chatbot 名称',
      dataIndex: 'chatbotName',
      key: 'chatbotName',
      search: false, // 不在此列搜索
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      search: false, // 不在此列搜索
    },
    {
      title: '账号',
      dataIndex: 'uid',
      key: 'uid',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部账号' },
        jk0091: { text: 'jk0091' },
        jk0092: { text: 'jk0092' },
        jk0093: { text: 'jk0093' },
      },
      hidden: true, // 隐藏此列
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // 启用搜索
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        同意: { text: '同意', status: 'Success' },
        拒绝: { text: '拒绝', status: 'Error' },
        审核中: { text: '审核中', status: 'Warning' },
        通过: { text: '通过', status: 'Success' },
      },
    },
    {
      title: '查询',
      dataIndex: 'search',
      key: 'search',
      hidden: true, // 隐藏此列
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      fixed: 'right',
      width: 240,
      render: (_, record) => (
        <Space>
          {record.status === '同意' && (
            <>
              <Typography.Link>同意</Typography.Link>
              <Typography.Link>拒绝</Typography.Link>
            </>
          )}
          <Typography.Link
            onClick={() => history.push(`chatbot-management/edit/${record.chatbotId}`)}
          >
            修改
          </Typography.Link>
          <Typography.Link
            onClick={() =>
              history.push(`chatbot-management/bottom-menu-settings/${record.chatbotId}`)
            }
          >
            设置底部菜单
          </Typography.Link>
          {(record.status === '通过' || record.status === '拒绝') && (
            <Typography.Link>删除</Typography.Link>
          )}
        </Space>
      ),
    },
  ];

  return (
    <ProTable<ChatbotItem>
      columns={columns}
      rowKey="chatbotId"
      pagination={{
        showSizeChanger: true,
      }}
      scroll={{
        x: 'max-content',
      }}
      search={{
        labelWidth: 'auto',
      }} // 启用ProTable自带的搜索
      options={false} // 禁用ProTable自带的工具栏
      headerTitle=" " // 表格标题
      toolBarRender={() => [
        <Button
          type="primary"
          key="create"
          onClick={() => history.push('chatbot-management/create')}
        >
          <PlusOutlined />
          创建Chatbot
        </Button>,
      ]}
      request={async (params, sort, filter) => {
        console.log('ProTable request params:', params, sort, filter);
        const result = await getChatbotList({
          ...params,
          pageSize: params.pageSize,
          current: params.current,
        });
        return {
          data: result.data,
          success: result.success,
          total: result.total,
        };
      }}
    />
  );
};

export default ChatbotManagement;
