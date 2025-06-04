import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, Outlet, useLocation } from '@umijs/max';
import { Button } from 'antd';
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

  // 定义不需要显示面包屑的路径白名单 (即Tab路由页面)
  const noBreadcrumbPaths = tabList.map((item) => item.key);

  // 判断是否为Tab路由页面
  const isTabRoute = noBreadcrumbPaths.includes(location.pathname);

  // 处理 Tab 切换
  const onTabChange = (key: string) => {
    history.push(key);
  };

  return (
    <PageContainer
      title={false}
      // 如果是白名单中的路径（Tab路由页面），则不显示面包屑，否则显示面包屑
      breadcrumbRender={isTabRoute ? false : undefined}
      // 如果是Tab路由页面，则显示tab栏，否则不显示
      tabList={isTabRoute ? tabList : undefined}
      tabActiveKey={location.pathname}
      onTabChange={onTabChange}
      extra={
        isTabRoute ? undefined : ( // 如果不是Tab路由页面，则显示返回按钮
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              history.back();
            }}
          >
            返回
          </Button>
        )
      }
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
