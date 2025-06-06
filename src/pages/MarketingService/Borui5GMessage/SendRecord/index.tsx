import { querySendRecordList } from '@/services/Borui5GMessage/SendRecord'; // 导入服务函数
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Popconfirm, Space, Tag, Typography, message } from 'antd';
import React from 'react';

const SendRecord: React.FC = () => {
  const columns: ProColumns<any>[] = [
    {
      title: '账户',
      dataIndex: 'accountId',
      key: 'accountId',
      valueType: 'select',
      valueEnum: {
        all: '全部账号',
        jk0092: 'jk0092',
        jk0091: 'jk0091',
        jk0093: 'jk0093',
      },
      initialValue: 'all',
      hidden: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      hidden: true,
      valueEnum: {
        all: '全部',
        pendingReview: '待审核',
        inReview: '审核中',
        rejected: '驳回',
        sending: '正在发送',
        paused: '暂停',
        terminated: '已终止',
        sent: '已发送',
      },
      initialValue: 'all',
      render: (_: any, record: API.SendRecordItem) => {
        let color = '';
        let text = record.status;
        switch (record.status) {
          case '待审核':
            color = 'blue';
            break;
          case '审核中':
            color = 'processing';
            break;
          case '驳回':
            color = 'red';
            break;
          case '正在发送':
            color = 'green';
            break;
          case '暂停':
            color = 'orange';
            break;
          case '已终止':
            color = 'default';
            break;
          case '已发送':
            color = 'success';
            break;
          default:
            color = 'default';
        }
        if (record.status === '待审核') {
          return (
            <Space>
              <Tag color={color}>{text}</Tag>
              <a>同意</a>
              <a>拒绝</a>
            </Space>
          );
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '查询',
      dataIndex: 'taskName',
      key: 'taskName',
      valueType: 'text',
      hidden: true,
      fieldProps: {
        placeholder: '输入任务名称、短信内容',
      },
    },
    {
      title: '完成时间',
      dataIndex: 'completionTime',
      key: 'completionTime',
      valueType: 'dateRange',
      hidden: true,
    },
    {
      title: '账号UID',
      dataIndex: 'accountId',
      key: 'accountId',
      valueType: 'select',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      hideInSearch: true,
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      hideInSearch: true,
    },
    {
      title: '任务ID',
      dataIndex: 'taskId',
      key: 'taskId',
      hideInSearch: true,
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      valueType: 'text',
      fieldProps: {
        placeholder: '输入任务名称、短信内容',
      },
      hideInSearch: true,
    },
    {
      title: 'Chatbot',
      dataIndex: 'chatbotName',
      key: 'chatbotName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '回落短信内容',
      dataIndex: 'fallbackSmsContent',
      key: 'fallbackSmsContent',
      ellipsis: true,
      width: 250,
      hideInSearch: true,
    },
    {
      title: '字符数',
      dataIndex: 'charCount',
      key: 'charCount',
      hideInSearch: true,
    },
    {
      title: '计费(条)数',
      dataIndex: 'billingCount',
      key: 'billingCount',
      hideInSearch: true,
    },
    {
      title: '(号码)数量',
      dataIndex: 'numberCount',
      key: 'numberCount',
      hideInSearch: true,
    },
    {
      title: '提交时间',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        all: '全部',
        pendingReview: '待审核',
        inReview: '审核中',
        rejected: '驳回',
        sending: '正在发送',
        paused: '暂停',
        terminated: '已终止',
        sent: '已发送',
      },
      initialValue: 'all',
      render: (_: any, record: API.SendRecordItem) => {
        let color = '';
        let text = record.status;
        switch (record.status) {
          case '待审核':
            color = 'blue';
            break;
          case '审核中':
            color = 'processing';
            break;
          case '驳回':
            color = 'red';
            break;
          case '正在发送':
            color = 'green';
            break;
          case '暂停':
            color = 'orange';
            break;
          case '已终止':
            color = 'default';
            break;
          case '已发送':
            color = 'success';
            break;
          default:
            color = 'default';
        }
        if (record.status === '待审核') {
          return (
            <Space>
              <Tag color={color}>{text}</Tag>
              <Popconfirm
                title="确定要同意吗？"
                onConfirm={() => {
                  console.log('同意操作');
                  message.success('已同意');
                }}
                okText="是"
                cancelText="否"
              >
                <Typography.Link>同意</Typography.Link>
              </Popconfirm>
              <Popconfirm
                title="确定要拒绝吗？"
                onConfirm={() => {
                  console.log('拒绝操作');
                  message.success('已拒绝');
                }}
                okText="是"
                cancelText="否"
              >
                <Typography.Link>拒绝</Typography.Link>
              </Popconfirm>
            </Space>
          );
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '完成时间',
      dataIndex: 'completionTime',
      key: 'completionTime',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '5G消息(成功)计费数',
      dataIndex: '_5gMessageSuccessCount',
      key: '_5gMessageSuccessCount',
      hideInSearch: true,
    },
    {
      title: '短信(成功)计费数',
      dataIndex: 'smsSuccessCount',
      key: 'smsSuccessCount',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      hideInSearch: true,
      tip: '暂停超过48小时，自动终止',
      render: (_: any, record: API.SendRecordItem) => (
        <Space>
          {record.status === '正在发送' && (
            <>
              <Popconfirm
                title="确定要暂停任务吗？"
                onConfirm={() => {
                  console.log('暂停操作');
                  message.success('已暂停');
                }}
                okText="是"
                cancelText="否"
              >
                <Typography.Link>暂停</Typography.Link>
              </Popconfirm>
              <Popconfirm
                title="确定要终止任务吗？"
                onConfirm={() => {
                  console.log('终止操作');
                  message.success('已终止');
                }}
                okText="是"
                cancelText="否"
              >
                <Typography.Link>终止</Typography.Link>
              </Popconfirm>
            </>
          )}
          {record.status === '暂停' && (
            <>
              <Popconfirm
                title="确定要继续任务吗？"
                onConfirm={() => {
                  console.log('继续操作');
                  message.success('已继续');
                }}
                okText="是"
                cancelText="否"
              >
                <Typography.Link>继续</Typography.Link>
              </Popconfirm>
              <Popconfirm
                title="确定要终止任务吗？"
                onConfirm={() => {
                  console.log('终止操作');
                  message.success('已终止');
                }}
                okText="是"
                cancelText="否"
              >
                <Typography.Link>终止</Typography.Link>
              </Popconfirm>
            </>
          )}
          {(record.status === '已终止' || record.status === '已发送') && (
            <Typography.Link>详情</Typography.Link>
          )}
        </Space>
      ),
    },
  ];

  return (
    <ProTable<API.SendRecordItem>
      columns={columns}
      rowKey="taskId"
      headerTitle=" "
      pagination={{
        showSizeChanger: true,
      }}
      request={async (params, sort, filter) => {
        console.log('ProTable request params:', params, sort, filter);
        const msg = await querySendRecordList(params);
        return {
          data: msg.data,
          success: msg.success,
          total: msg.total,
        };
      }}
      search={{ labelWidth: 'auto' }}
      options={false}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default SendRecord;
