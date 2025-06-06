// import { queryTemplateList } from '@/services/templateManagement'; // 假设存在此服务
import { queryTemplateList } from '@/services/templateManagement';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Typography } from 'antd';
import React from 'react';
import { history } from 'umi';

const TemplateManagement: React.FC = () => {
  const handleCreateTemplate = () => {
    history.push('template-management/create');
  };

  const columns: ProColumns<any>[] = [
    {
      title: '账号UID',
      dataIndex: 'accountUID',
      key: 'accountUID',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        options: [
          { label: '全部账号', value: '' },
          { label: '账号A', value: 'accountA' },
          { label: '账号B', value: 'accountB' },
        ],
      },
      search: false, // 不在搜索栏中显示
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      search: false, // 不在搜索栏中显示
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      search: false, // 不在搜索栏中显示
    },
    {
      title: '模板ID',
      dataIndex: 'templateID',
      key: 'templateID',
      search: false, // 不在搜索栏中显示
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      search: false, // 不在搜索栏中显示
    },
    {
      title: 'Chatbot',
      dataIndex: 'chatbot',
      key: 'chatbot',
      search: false,
    },
    {
      title: '回落短信内容',
      dataIndex: 'fallbackSMSContent',
      key: 'fallbackSMSContent',
      search: false,
      render: (text: React.ReactNode) => (
        <Typography.Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
          {text}
        </Typography.Paragraph>
      ),
    },
    {
      title: '字符数',
      dataIndex: 'characterCount',
      key: 'characterCount',
      search: false,
    },
    {
      title: '计费(条)数',
      dataIndex: 'billingCount',
      key: 'billingCount',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      search: false,
    },
    {
      title: '账号',
      dataIndex: 'accountUID',
      key: 'accountUID',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        options: [
          { label: '全部账号', value: '' },
          { label: '账号A', value: 'accountA' },
          { label: '账号B', value: 'accountB' },
        ],
      },
      hidden: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: {
        '': { text: '全部', status: 'Default' },
        待审核: { text: '待审核', status: 'Warning' },
        审核中: { text: '审核中', status: 'Processing' },
        通过: { text: '通过', status: 'Success' },
        拒绝: { text: '拒绝', status: 'Error' },
      },
    },
    {
      title: '查询',
      dataIndex: 'searchKeyword',
      key: 'searchKeyword',
      valueType: 'text',
      fieldProps: {
        placeholder: '输入模板名称、模板内容',
      },
      hideInTable: true, // 不在表格中显示
    },
    {
      title: '系统审核',
      dataIndex: 'systemReview',
      key: 'systemReview',
      search: false,
      render: (text: React.ReactNode) => {
        if (text === '通过') {
          return <span style={{ color: 'green' }}>{text}</span>;
        }
        return text;
      },
    },
    {
      title: '通道审核',
      dataIndex: 'channelReview',
      key: 'channelReview',
      search: false,
      render: (text: React.ReactNode) => {
        if (text === '通过') {
          return <span style={{ color: 'green' }}>{text}</span>;
        }
        return text;
      },
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      fixed: 'right',
      width: 120,
      render: (text: any, record: any) => (
        <Space size="middle">
          {record.status === '待审核' && (
            <>
              <Popconfirm
                title="确定同意该模板吗？"
                onConfirm={() => message.success(`同意模板: ${record.templateID}`)}
                okText="确定"
                cancelText="取消"
              >
                <Typography.Link>同意</Typography.Link>
              </Popconfirm>
              <Popconfirm
                title="确定拒绝该模板吗？"
                onConfirm={() => message.error(`拒绝模板: ${record.templateID}`)}
                okText="确定"
                cancelText="取消"
              >
                <Typography.Link style={{ color: 'red' }}>拒绝</Typography.Link>
              </Popconfirm>
            </>
          )}
          {(record.status === '通过' || record.status === '拒绝') && (
            <Popconfirm
              title="确定删除该模板吗？"
              onConfirm={() => message.info(`删除模板: ${record.templateID}`)}
              okText="确定"
              cancelText="取消"
            >
              <Typography.Link>删除</Typography.Link>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable
        columns={columns}
        request={async (params = {}, sort, filter) => {
          console.log(params, sort, filter);
          const { searchKeyword, ...restParams } = params;
          let queryParams = { ...restParams, ...sort, ...filter };

          if (searchKeyword) {
            // 假设 searchKeyword 可以是 templateID 或 templateName 或 fallbackSMSContent
            // 这里需要根据实际后端接口的逻辑进行调整
            queryParams = {
              ...queryParams,
              templateName: searchKeyword,
              fallbackSMSContent: searchKeyword,
            };
          }

          // 假设有一个 queryTemplateList 服务
          const result = await queryTemplateList(queryParams);
          return {
            data: result.data,
            success: result.success,
            total: result.total,
          };
        }}
        rowKey="templateID"
        pagination={{
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 'auto',
        }}
        scroll={{
          x: 'max-content',
        }}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="createTemplate"
            icon={<PlusOutlined />}
            onClick={handleCreateTemplate}
          >
            创建模板
          </Button>,
        ]}
      />
    </>
  );
};

export default TemplateManagement;
