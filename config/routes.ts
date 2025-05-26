/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/user-account',
    name: 'userAccount', // 用户账号
    icon: 'user', // 假设图标
    routes: [
      {
        path: '/user-account/account-management',
        name: 'accountManagement', // 账号管理
        component: './UserAccount/AccountManagement', // 占位符组件
      },
      {
        path: '/user-account/role-management',
        name: 'roleManagement', // 角色管理
        component: './UserAccount/RoleManagement', // 占位符组件
      },
      {
        path: '/user-account/enterprise-certification',
        name: 'enterpriseCertification', // 企业认证
        component: './UserAccount/EnterpriseCertification', // 占位符组件
      },
      {
        path: '/user-account/recharge-management',
        name: 'rechargeManagement', // 充值管理
        component: './UserAccount/RechargeManagement', // 占位符组件
      },
    ],
  },
  {
    path: '/consumption-details',
    name: 'consumptionDetails', // 消费明细
    icon: 'moneyCollect', // 假设图标
    routes: [
      {
        path: '/consumption-details/price-management',
        name: 'priceManagement', // 价格管理
        component: './ConsumptionDetails/PriceManagement', // 占位符组件
      },
      {
        path: '/consumption-details/consumption-statistics',
        name: 'consumptionStatistics', // 消费统计
        component: './ConsumptionDetails/ConsumptionStatistics', // 占位符组件
      },
    ],
  },
  {
    path: '/query-data',
    name: 'queryData', // 查询数据
    icon: 'search', // 假设图标
    routes: [
      {
        path: '/query-data/account-permission',
        name: 'accountPermission', // 账号权限
        component: './QueryData/AccountPermission', // 占位符组件
      },
    ],
  },
  {
    path: '/data-service',
    name: 'dataService', // 数据服务
    icon: 'cloudServer', // 假设图标
    routes: [
      {
        path: '/data-service/jike-data',
        name: 'jikeData', // 及刻数据
        component: './DataService/JikeData', // 占位符组件
      },
    ],
  },
  {
    path: '/marketing-service',
    name: 'marketingService', // 营销服务
    icon: 'shop', // 假设图标
    routes: [
      {
        path: '/marketing-service/borui-5g-message',
        name: 'borui5GMessage', // 博瑞5G消息
        component: './MarketingService/Borui5GMessage', // 占位符组件
      },
    ],
  },
  {
    path: '/',
    redirect: '/user-account/account-management', // 默认重定向到新的第一个菜单项
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
