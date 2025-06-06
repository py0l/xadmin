import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import '@umijs/max';
import { Alert, Card, Typography } from 'antd';
import React from 'react';

/**
 * 管理员页面组件
 * 只有具备 admin 权限的用户才能访问和查看此页面内容
 */
const Admin: React.FC = () => {
  return (
    // 页面容器，显示页面标题和内容
    <PageContainer content="这个页面只有 admin 权限才能查看">
      <Card>
        {/* 提示信息，告知用户有新的重型组件发布 */}
        <Alert
          message="更快更强的重型组件，已经发布。"
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 48,
          }}
        />
        {/* 页面标题，居中显示 Ant Design Pro 和爱心图标 */}
        <Typography.Title
          level={2}
          style={{
            textAlign: 'center',
          }}
        >
          <SmileTwoTone /> Ant Design Pro <HeartTwoTone twoToneColor="#eb2f96" /> You
        </Typography.Title>
      </Card>
      {/* 更多页面添加指引 */}
      <p
        style={{
          textAlign: 'center',
          marginTop: 24,
        }}
      >
        Want to add more pages? Please refer to{' '}
        <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
          use block
        </a>
        。
      </p>
    </PageContainer>
  );
};

export default Admin;
