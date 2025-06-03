import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, Outlet, useLocation } from '@umijs/max';
import { Button } from 'antd';

const JikeData: React.FC = () => {
  const location = useLocation();
  // 判断是否为查看开户资料页面
  const isAccountReviewDetail = location.pathname.startsWith(
    '/data-service/jike-data/account-review/detail',
  );

  // 定义 Tab 列表
  const tabList = [
    {
      tab: '开户审核',
      key: '/data-service/jike-data/account-review',
    },
    {
      tab: '创建人群包',
      key: '/data-service/jike-data/create-crowd-package',
    },
    {
      tab: '人群包记录',
      key: '/data-service/jike-data/crowd-package-record',
    },
  ];

  // 处理 Tab 切换
  const onTabChange = (key: string) => {
    history.push(key);
  };

  return (
    <PageContainer
      title={false}
      // 如果是查看开户资料页面，则显示面包屑，否则不显示
      breadcrumbRender={isAccountReviewDetail ? undefined : false}
      // 如果是查看开户资料页面，则不显示tab栏，否则显示
      tabList={isAccountReviewDetail ? undefined : tabList}
      tabActiveKey={isAccountReviewDetail ? undefined : location.pathname}
      onTabChange={isAccountReviewDetail ? undefined : onTabChange}
      extra={
        isAccountReviewDetail ? (
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              history.back();
            }}
          >
            返回
          </Button>
        ) : undefined
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

export default JikeData;
