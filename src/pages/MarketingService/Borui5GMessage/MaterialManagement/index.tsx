import { queryMaterialList } from '@/services/materialManagement';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Image, message, Popconfirm, Space, Typography } from 'antd';
import React from 'react';
import UploadMaterialModal from './components/UploadMaterialModal';

const MaterialManagement: React.FC = () => {
  const handleUploadMaterial = (values: any) => {
    console.log('上传素材数据:', values);
    message.success('素材上传成功');
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
      title: '素材ID',
      dataIndex: 'materialID',
      key: 'materialID',
      search: false, // 不在搜索栏中显示
    },
    {
      title: '素材名称',
      dataIndex: 'materialName',
      key: 'materialName',
      search: false, // 不在搜索栏中显示
    },
    {
      title: '素材内容',
      dataIndex: 'materialContent',
      key: 'materialContent',
      search: false, // 不在搜索栏中显示
      render: (_, record: any) => (
        <div
          style={{
            width: 60,
            height: 60,
            border: '1px solid #d9d9d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            width={40}
            height={40}
            src={record.materialContent} // Use actual image URL from mock data
            fallback="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/test.svg"
          />
        </div>
      ),
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
        placeholder: '输入素材ID、素材名称',
      },
      hideInTable: true, // 不在表格中显示
    },
    {
      title: '系统审核',
      dataIndex: 'systemReview',
      key: 'systemReview',
      search: false, // 不在搜索栏中显示
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
      search: false, // 不在搜索栏中显示
      render: (text: React.ReactNode) => {
        if (text === '通过') {
          return <span style={{ color: 'green' }}>{text}</span>;
        }
        return text;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      search: false, // 不在搜索栏中显示
    },
    {
      title: '操作',
      key: 'action',
      search: false, // 不在搜索栏中显示
      fixed: 'right',
      width: 120,
      render: (text: any, record: any) => (
        <Space size="middle">
          {record.status === '待审核' && (
            <>
              <Popconfirm
                title="确定同意该素材吗？"
                onConfirm={() => message.success(`同意素材: ${record.materialID}`)}
                okText="确定"
                cancelText="取消"
              >
                <Typography.Link>同意</Typography.Link>
              </Popconfirm>
              <Popconfirm
                title="确定拒绝该素材吗？"
                onConfirm={() => message.error(`拒绝素材: ${record.materialID}`)}
                okText="确定"
                cancelText="取消"
              >
                <Typography.Link style={{ color: 'red' }}>拒绝</Typography.Link>
              </Popconfirm>
            </>
          )}
          {record.status === '通过' && (
            <Popconfirm
              title="确定删除该素材吗？"
              onConfirm={() => message.info(`删除素材: ${record.materialID}`)}
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
            // 假设 searchKeyword 可以是 materialID 或 materialName
            // 这里需要根据实际后端接口的逻辑进行调整
            // 暂时将 searchKeyword 同时赋值给 materialID 和 materialName
            queryParams = {
              ...queryParams,
              materialID: searchKeyword,
              materialName: searchKeyword,
            };
          }

          const result = await queryMaterialList(queryParams);
          return {
            data: result.data,
            success: result.success,
            total: result.total,
          };
        }}
        rowKey="materialID"
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
          <UploadMaterialModal
            key="uploadMaterial"
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                上传素材
              </Button>
            }
            onOk={handleUploadMaterial}
          />,
        ]}
      />
    </>
  );
};

export default MaterialManagement;
