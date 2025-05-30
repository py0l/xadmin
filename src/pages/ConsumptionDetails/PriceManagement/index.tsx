import { queryPriceManagementList } from '@/services/consumptionDetails/priceManagement'; // 导入接口
import { PageContainer, ProTable, ProTableProps } from '@ant-design/pro-components';
import { history } from '@umijs/max'; // 引入 history
import { Button, Modal, Space } from 'antd'; // 引入 Modal 组件
import React, { useState } from 'react'; // 引入 useState Hook

// 定义服务项类型
interface ServiceItem {
  name: string;
  price: number;
  unit: string;
}

// 扩展 API.PriceManagementItem 类型，包含服务数据
interface PriceManagementItemWithServices extends API.PriceManagementItem {
  dataServices?: ServiceItem[];
  marketingServices?: ServiceItem[];
}

const PriceManagement: React.FC = () => {
  // 弹窗可见性状态
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // 当前查看的行数据
  const [currentRecord, setCurrentRecord] = useState<PriceManagementItemWithServices | undefined>(
    undefined,
  );

  // 处理查看按钮点击
  const handleViewClick = (record: PriceManagementItemWithServices) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  // 处理弹窗关闭
  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentRecord(undefined);
  };

  const columns = [
    {
      title: '角色',
      dataIndex: 'userRole',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        normal: { text: '普通客户' },
        enterprise: { text: '企业客户' },
      },
      hideInTable: true, // 在表格中隐藏，只在搜索表单中显示
    },
    {
      title: '查询',
      dataIndex: 'searchKeyword',
      fieldProps: {
        placeholder: '输入账号ID、手机号、企业名称',
      },
      hideInTable: true, // 在表格中隐藏，只在搜索表单中显示
    },
    {
      title: '注册时间',
      dataIndex: 'registrationTime',
      valueType: 'dateRange',
      hideInTable: true, // 在表格中隐藏，只在搜索表单中显示
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      valueType: 'dateRange',
      hideInTable: true, // 在表格中隐藏，只在搜索表单中显示
    },
    {
      title: '账号UID',
      dataIndex: 'accountUID',
      key: 'accountUID',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      key: 'userRole',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '认证状态',
      dataIndex: 'certificationStatus',
      key: 'certificationStatus',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      search: false, // 不在搜索表单中显示
    },
    {
      title: '操作',
      key: 'action',
      search: false, // 不在搜索表单中显示
      render: (_, record) => (
        <Space>
          <a onClick={() => handleViewClick(record as PriceManagementItemWithServices)}>查看</a>
          <a
            onClick={() =>
              history.push(`/consumption-details/price-management/set-price/${record.accountUID}`)
            }
          >
            设置
          </a>
        </Space>
      ),
    },
  ] as ProTableProps<PriceManagementItemWithServices, API.PriceManagementListParams>['columns'];

  return (
    <PageContainer title={false}>
      <ProTable<PriceManagementItemWithServices, API.PriceManagementListParams>
        columns={columns}
        rowKey="accountUID"
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        pagination={{
          showSizeChanger: true,
        }}
        headerTitle=" "
        request={async (params, sorter, filter) => {
          const result = await queryPriceManagementList({
            ...params,
            ...(sorter as any),
            ...filter,
          });
          return {
            data: result.data,
            success: result.success,
            total: result.total,
          };
        }}
      />
      {/* 价格详情弹窗 */}
      <Modal
        title={null} // 标题为空，根据原型图
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button onClick={handleModalClose}>已知悉</Button>
          </div>
        }
        width={400} // 根据原型图调整宽度
        closable={false} // 不显示关闭按钮
        maskClosable={false} // 点击蒙层不关闭
        centered // 居中显示
      >
        <div
          style={{ textAlign: 'left', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}
        >
          数据服务
        </div>
        {currentRecord?.dataServices?.map((service, index) => (
          <div
            key={index}
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
          >
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{service.name}</span>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
              {service.price.toFixed(2)} {service.unit}
            </span>
          </div>
        ))}

        <div
          style={{
            textAlign: 'left',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '24px',
            marginBottom: '16px',
          }}
        >
          营销服务
        </div>
        {currentRecord?.marketingServices?.map((service, index) => (
          <div
            key={index}
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
          >
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{service.name}</span>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
              {service.price.toFixed(2)} {service.unit}
            </span>
          </div>
        ))}
      </Modal>
    </PageContainer>
  );
};

export default PriceManagement;
