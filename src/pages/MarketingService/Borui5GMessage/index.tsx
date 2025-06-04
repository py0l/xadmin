import { PageContainer } from '@ant-design/pro-components';
import { history, Outlet, useLocation } from '@umijs/max';
import React from 'react';

const Borui5GMessage: React.FC = () => {
  const location = useLocation();

  // 定义 Tab 列表
  const tabList = [
    {
      tab: '开户审核',
      key: '/marketing-service/borui-5g-message/account-review',
    },
    {
      tab: 'Chatbot管理',
      key: '/marketing-service/borui-5g-message/chatbot-management',
    },
    {
      tab: '素材管理',
      key: '/marketing-service/borui-5g-message/material-management',
    },
    {
      tab: '模板管理',
      key: '/marketing-service/borui-5g-message/template-management',
    },
    {
      tab: '发送5G消息',
      key: '/marketing-service/borui-5g-message/send-message',
    },
    {
      tab: '发送记录',
      key: '/marketing-service/borui-5g-message/send-record',
    },
    {
      tab: '数据统计',
      key: '/marketing-service/borui-5g-message/data-statistics',
    },
  ];

  // 定义不需要显示面包屑的路径白名单
  const noBreadcrumbPaths = tabList.map((item) => item.key);

  // 处理 Tab 切换
  const onTabChange = (key: string) => {
    history.push(key);
  };

  return (
    <PageContainer
      title={false}
      // 如果是白名单中的路径，则不显示面包屑
      breadcrumbRender={noBreadcrumbPaths.includes(location.pathname) ? false : undefined}
      tabList={tabList}
      tabActiveKey={location.pathname}
      onTabChange={onTabChange}
      header={{
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      }}
    >
      <Outlet />
    </PageContainer>
  );
};

export default Borui5GMessage;
