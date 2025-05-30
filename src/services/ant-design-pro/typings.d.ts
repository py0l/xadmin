// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type Response<T> = {
    data: T;
    success: boolean;
    total?: number;
    message?: string; // 添加 message 属性
  };

  type AccountItem = {
    uid: string;
    phone: string;
    role: string;
    certificationStatus: string;
    enterpriseName: string;
    accountBalance: string;
    registrationTime: string;
    lastLoginTime: string;
  };

  type RechargeItem = {
    uid: string;
    phone: string;
    role: string;
    certificationStatus: string;
    enterpriseName: string;
    accountBalance: string;
    registrationTime: string;
    lastLoginTime: string;
  };

  type EnterpriseItem = {
    uid: string;
    phoneNumber: string;
    userRole: string;
    enterpriseName: string;
    applicationTime: string;
    status: 'pending' | 'approved' | 'rejected';
  };

  type RoleItem = {
    roleId: string;
    userRole: string;
    enabledModules: string;
    creationTime: string;
  };

  type PriceManagementItem = {
    accountUID: string;
    phoneNumber: string;
    userRole: string;
    certificationStatus: string;
    enterpriseName: string;
  };

  type PriceManagementList = {
    data?: PriceManagementItem[];
    total?: number;
    success?: boolean;
  };

  type PriceManagementListParams = {
    current?: number;
    pageSize?: number;
    userRole?: string;
    searchKeyword?: string;
    registrationTime?: string[];
    lastLoginTime?: string[];
  };

  type PriceDetails = {
    accountUID: string;
    phoneNumber: string;
    enterpriseName: string;
    userRole: string;
    dataServices: {
      generalDataPrice: number;
      accurateDataPrice: number;
    };
    marketingServices: {
      fiveGMessagePrice: number;
      textMessagePrice: number;
    };
  };

  type PriceUpdateParams = {
    accountUID: string;
    dataServices: {
      generalDataPrice: number;
      accurateDataPrice: number;
    };
    marketingServices: {
      fiveGMessagePrice: number;
      textMessagePrice: number;
    };
  };

  type ConsumptionStatisticsItem = {
    id: string;
    transactionTime: string;
    account: string;
    incomeExpenseType: string;
    transactionType: string;
    amount: number;
    itemName: string;
    balance: number;
  };

  type ConsumptionStatisticsList = {
    data?: ConsumptionStatisticsItem[];
    total?: number;
    success?: boolean;
  };
}
