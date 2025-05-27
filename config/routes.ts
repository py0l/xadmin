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
        path: '/user-account/account-management',
        name: '账号管理',
        component: './UserAccount/AccountManagement',
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
