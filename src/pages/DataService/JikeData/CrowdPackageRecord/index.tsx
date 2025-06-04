import { queryCrowdPackageRecord } from '@/services/jikeData';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message, Space } from 'antd';
import React from 'react';

// 表格数据项接口
export type CrowdPackageRecordItem = {
  accountId: string; // 账号UID
  phoneNumber: string; // 手机号码
  enterpriseName: string; // 企业名称
  dataPackageId: string; // 数据包ID
  dataPackageName: string; // 数据包名称
  quantity: number; // (号码)数量
  actualOutput: number; // 实际输出
  difference: number; // 差量
  replenishment: number; // 补量
  createTime: string; // 创建时间
  completeTime: string; // 完成时间
  status: 'approved' | 'rejected' | 'pending' | 'canceled' | 'available'; // 状态
};

// 搜索表单参数接口
export type CrowdPackageRecordParams = {
  accountId?: string;
  status?: string;
  searchKeyword?: string; // 数据包ID或数据包名称
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

const CrowdPackageRecord: React.FC = () => {
  const columns: ProColumns<CrowdPackageRecordItem>[] = [
    {
      title: '账号UID',
      dataIndex: 'accountId',
      valueType: 'text',
      width: 120,
      ellipsis: true,
      search: false,
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      valueType: 'text',
      search: false,
      width: 120,
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      valueType: 'text',
      search: false,
      width: 150,
      ellipsis: true,
    },
    {
      title: '数据包ID',
      dataIndex: 'dataPackageId',
      valueType: 'text',
      search: false,
      width: 150,
      ellipsis: true,
    },
    {
      title: '数据包名称',
      dataIndex: 'dataPackageName',
      valueType: 'text',
      search: false,
      width: 150,
      ellipsis: true,
    },
    {
      title: '(号码)数量',
      dataIndex: 'quantity',
      valueType: 'digit',
      search: false,
      width: 100,
    },
    {
      title: '实际输出',
      dataIndex: 'actualOutput',
      valueType: 'digit',
      search: false,
      width: 100,
    },
    {
      title: '差量',
      dataIndex: 'difference',
      valueType: 'digit',
      search: false,
      width: 80,
    },
    {
      title: '补量',
      dataIndex: 'replenishment',
      valueType: 'digit',
      search: false,
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      width: 160,
    },
    {
      title: '完成时间',
      dataIndex: 'completeTime',
      valueType: 'dateTime',
      search: false,
      width: 160,
    },
    {
      title: '账户',
      dataIndex: 'account',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
      },
      initialValue: 'all',
      hidden: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 100,
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        approved: { text: '同意', status: 'Success' },
        rejected: { text: '拒绝', status: 'Error' },
        pending: { text: '待审核', status: 'Processing' },
        canceled: { text: '取消', status: 'Default' },
        available: { text: '可用', status: 'Success' },
      },
      initialValue: 'all',
    },
    {
      title: '查询',
      dataIndex: 'search',
      valueType: 'text',
      hidden: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                onClick={() => {
                  message.success('已同意');
                }}
              >
                同意
              </Button>
              <Button
                type="link"
                onClick={() => {
                  message.error('已拒绝');
                }}
              >
                拒绝
              </Button>
            </>
          )}
          <Button
            type="link"
            onClick={() => {
              history.push(
                `/data-service/jike-data/crowd-package-record/detail/${record.dataPackageId}`,
              );
            }}
          >
            详情
          </Button>
          {(record.status === 'pending' || record.status === 'approved') && (
            <Button
              type="link"
              onClick={() => {
                message.info('已取消');
              }}
            >
              取消
            </Button>
          )}
          {record.status === 'canceled' && (
            <Button
              type="link"
              onClick={() => {
                message.info('已删除');
              }}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <ProTable<CrowdPackageRecordItem, CrowdPackageRecordParams>
      rowKey="dataPackageId"
      columns={columns}
      request={async (params, sort, filter) => {
        const result = await queryCrowdPackageRecord({ ...params, ...sort, ...filter });
        return {
          data: result.data,
          success: result.success,
          total: result.total,
        };
      }}
      headerTitle=" "
      search={{
        labelWidth: 'auto',
      }}
      options={false} // 不显示表格工具栏
      pagination={{
        showSizeChanger: true,
      }}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default CrowdPackageRecord;
