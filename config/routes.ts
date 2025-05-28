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
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {
    path: '/user-account',
    name: '用户账号',
    icon: 'user',
    routes: [
      {
        path: '/user-account',
        redirect: '/user-account/account-management',
      },
      {
        path: '/user-account/account-management',
        name: '账号管理',
        component: './UserAccount/AccountManagement',
        routes: [
          {
            path: '/user-account/account-management/add',
            name: '新增账户',
            component: './UserAccount/AccountManagement/AccountForm',
            hideInMenu: true, // 在菜单中隐藏
          },
          {
            path: '/user-account/account-management/edit/:uid',
            name: '编辑账户',
            component: './UserAccount/AccountManagement/AccountForm',
            hideInMenu: true, // 在菜单中隐藏
          },
        ],
      },
      {
        path: '/user-account/role-management',
        name: '角色管理',
        component: './UserAccount/RoleManagement',
      },
      {
        path: '/user-account/enterprise-certification',
        name: '企业认证',
        component: './UserAccount/EnterpriseCertification',
      },
      {
        path: '/user-account/recharge-management',
        name: '充值管理',
        component: './UserAccount/RechargeManagement',
      },
    ],
  },
  {
    path: '/consumption-details',
    name: '消费明细',
    icon: 'moneyCollect',
    routes: [
      {
        path: '/consumption-details/price-management',
        name: '价格管理',
        component: './ConsumptionDetails/PriceManagement',
      },
      {
        path: '/consumption-details/consumption-statistics',
        name: '消费统计',
        component: './ConsumptionDetails/ConsumptionStatistics',
      },
    ],
  },
  {
    path: '/query-data',
    name: '查询数据',
    icon: 'search',
    routes: [
      {
        path: '/query-data/account-permission',
        name: '账号权限',
        component: './QueryData/AccountPermission',
      },
    ],
  },
  {
    path: '/data-service',
    name: '数据服务',
    icon: 'cloudServer',
    routes: [
      { path: '/data-service/jike-data', name: '及刻数据', component: './DataService/JikeData' },
    ],
  },
  {
    path: '/marketing-service',
    name: '营销服务',
    icon: 'shop',
    routes: [
      {
        path: '/marketing-service/borui-5g-message',
        name: '博瑞5G消息',
        component: './MarketingService/Borui5GMessage',
      },
    ],
  },
  { path: '/', redirect: '/user-account/account-management' },
  { path: '*', layout: false, component: './404' },
];
