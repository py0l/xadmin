import { Card, Typography } from 'antd';
import React from 'react';

const BottomMenuSettings: React.FC = () => {
  return (
    <Card>
      <Typography.Title level={2}>底部菜单设置</Typography.Title>
      <Typography.Paragraph>在这里配置 Chatbot 的底部菜单。</Typography.Paragraph>
      {/* 实际的表单或配置组件将在这里添加 */}
    </Card>
  );
};

export default BottomMenuSettings;
