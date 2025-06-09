import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';

const CreateTemplate: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Typography.Title level={2}>创建模板页面</Typography.Title>
        <Typography.Paragraph>这里是创建新模板的表单或内容。</Typography.Paragraph>
      </Card>
    </PageContainer>
  );
};

export default CreateTemplate;
