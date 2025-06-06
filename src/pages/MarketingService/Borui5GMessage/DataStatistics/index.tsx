import { queryDataStatistics } from '@/services/dataStatistics';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Radio } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

type DataStatisticsItem = API.DataStatisticsItem & { id: string };

const DataStatistics: React.FC = () => {
  const [statisticType, setStatisticType] = useState<'billing' | 'submission'>('billing');
  const [summaryData, setSummaryData] = useState<API.DataStatisticsList['summary']>(undefined);

  const columns: ProColumns<DataStatisticsItem>[] = [
    {
      title: '账号',
      dataIndex: 'accountId',
      valueType: 'text',
      hideInTable: true,
      valueEnum: () => {
        return {
          '': '全部账号',
          jk0092: 'jk0092',
          jk0091: 'jk0091',
          jk0093: 'jk0093',
        };
      },
      initialValue: '',
    },
    {
      title: '查询时间',
      dataIndex: 'timeRange',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '账号UID',
      dataIndex: 'accountId',
      valueType: 'text',
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      valueType: 'text',
      search: false,
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      valueType: 'text',
      search: false,
    },
    {
      title: '时间',
      dataIndex: 'time',
      valueType: 'date',
      search: false,
    },
    {
      title: '5G计费成功(条)',
      dataIndex: '_5gSuccess',
      valueType: 'digit',
      hideInTable: statisticType === 'submission',
      search: false,
    },
    {
      title: '5G计费失败(条)',
      dataIndex: '_5gFailure',
      valueType: 'digit',
      hideInTable: statisticType === 'submission',
      search: false,
    },
    {
      title: '短信计费成功(条)',
      dataIndex: 'smsSuccess',
      valueType: 'digit',
      hideInTable: statisticType === 'submission',
      search: false,
    },
    {
      title: '短信计费失败(条)',
      dataIndex: 'smsFailure',
      valueType: 'digit',
      hideInTable: statisticType === 'submission',
      search: false,
    },
    {
      title: '提交量(号码数)',
      dataIndex: 'submissionCount',
      valueType: 'digit',
      hideInTable: statisticType === 'billing',
      search: false,
    },
    {
      title: '成功(号码数)',
      dataIndex: 'submissionSuccessCount',
      valueType: 'digit',
      hideInTable: statisticType === 'billing',
      search: false,
    },
    {
      title: '失败(号码数)',
      dataIndex: 'submissionFailureCount',
      valueType: 'digit',
      hideInTable: statisticType === 'billing',
      search: false,
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      valueType: 'text',
      search: false,
    },
  ];

  return (
    <ProTable<DataStatisticsItem>
      columns={columns}
      request={async (params) => {
        const { timeRange, ...rest } = params;
        let startTime, endTime;
        if (timeRange && timeRange.length === 2) {
          startTime = moment(timeRange[0]).format('YYYY-MM-DD');
          endTime = moment(timeRange[1]).format('YYYY-MM-DD');
        }
        const result = await queryDataStatistics({
          ...rest,
          timeRange: startTime && endTime ? [startTime, endTime] : undefined,
          pageSize: params.pageSize,
          current: params.current,
        });
        setSummaryData(result.summary); // 更新 summaryData
        return {
          data: result.data,
          success: result.success,
          total: result.total,
        };
      }}
      rowKey="id"
      pagination={{
        showSizeChanger: true,
      }}
      search={{
        labelWidth: 'auto',
      }}
      options={false}
      toolBarRender={() => [
        <Radio.Group
          key="statisticType"
          value={statisticType}
          onChange={(e) => setStatisticType(e.target.value)}
        >
          <Radio.Button value="billing">显示计费量</Radio.Button>
          <Radio.Button value="submission">显示提交量</Radio.Button>
        </Radio.Group>,
      ]}
      summary={() => {
        return (
          <ProTable.Summary>
            <ProTable.Summary.Row>
              <ProTable.Summary.Cell index={0} colSpan={4}>
                列表合计
              </ProTable.Summary.Cell>
              {statisticType === 'billing' ? (
                <>
                  <ProTable.Summary.Cell index={1}>
                    {summaryData?._5gSuccess || 0}
                  </ProTable.Summary.Cell>
                  <ProTable.Summary.Cell index={2}>
                    {summaryData?._5gFailure || 0}
                  </ProTable.Summary.Cell>
                  <ProTable.Summary.Cell index={3}>
                    {summaryData?.smsSuccess || 0}
                  </ProTable.Summary.Cell>
                  <ProTable.Summary.Cell index={4}>
                    {summaryData?.smsFailure || 0}
                  </ProTable.Summary.Cell>
                  <ProTable.Summary.Cell index={5}>
                    {summaryData?.successRate || '0.00%'}
                  </ProTable.Summary.Cell>
                </>
              ) : (
                <>
                  <ProTable.Summary.Cell index={1}>
                    {summaryData?.submissionCount || 0}
                  </ProTable.Summary.Cell>
                  <ProTable.Summary.Cell index={2}>
                    {summaryData?.submissionSuccessCount || 0}
                  </ProTable.Summary.Cell>
                  <ProTable.Summary.Cell index={3}>
                    {summaryData?.submissionFailureCount || 0}
                  </ProTable.Summary.Cell>
                  <ProTable.Summary.Cell index={4}>
                    {summaryData?.successRate || '0.00%'}
                  </ProTable.Summary.Cell>
                </>
              )}
            </ProTable.Summary.Row>
          </ProTable.Summary>
        );
      }}
    />
  );
};

export default DataStatistics;
