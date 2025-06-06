import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

/**
 * 404 页面组件
 * 当用户访问不存在的页面时显示
 */
const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle={'抱歉，您访问的页面不存在。'}
    extra={
      // 返回首页按钮，点击后跳转到根路径
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
);

export default NoFoundPage;
