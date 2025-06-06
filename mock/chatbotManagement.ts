import { Request, Response } from 'express';
import Mock from 'mockjs';

/**
 * 生成模拟文件数据
 * @param name 文件名称
 * @param type 文件类型，默认为 'image'，可选 'pdf'
 * @returns 包含文件信息的数组
 */
const generateFileMock = (name: string, type: string = 'image') => {
  const url =
    type === 'pdf'
      ? Mock.Random.url('http', 'pdf')
      : Mock.Random.image('200x100', Mock.Random.color(), '#FFF', name);
  return [{ uid: Mock.Random.guid(), name: `${name}.${type}`, status: 'done', url }];
};

/**
 * Chatbot 详情数据模板
 * 使用 Mock.js 语法定义了 Chatbot 详细信息的字段和生成规则
 */
const chatbotDetailTemplate = {
  uid: 'jk0091', // 用户ID
  phone: '13800138001', // 手机号
  enterpriseName: '@cword(5, 10)有限公司', // 企业名称
  chatbotId: '@string("number", 6)', // Chatbot ID
  chatbotName: '【Chatbot的名称】@cword(2, 5)', // Chatbot 名称
  createTime: '@datetime("yyyy-MM-dd HH:mm:ss")', // 创建时间
  status: Mock.Random.pick(['同意', '审核中', '通过', '拒绝']), // 状态
  userAuth: '@boolean', // 用户认证
  countdown: '@boolean', // 倒计时
  enterpriseIntro: '@cparagraph(1, 3)', // 企业介绍
  businessLicense: () => generateFileMock('营业执照'), // 营业执照文件
  enterpriseLogo: () => generateFileMock('企业LOGO'), // 企业LOGO文件
  industry: 'industry1', // 行业
  socialCreditCode: '@string("number", 18)', // 统一社会信用代码
  registeredAddress: '@county(true)', // 注册地址
  contactPhone: /^1[3-9]\d{9}$/, // 联系电话
  legalPersonName: '@cname', // 法人姓名
  legalPersonId: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, // 法人身份证号
  legalPersonIdFront: () => generateFileMock('法人身份证像面'), // 法人身份证像面
  legalPersonIdBack: () => generateFileMock('法人身份证国徽面'), // 法人身份证国徽面
  contactPersonName: '@cname', // 联系人姓名
  contactPersonId: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, // 联系人身份证号
  contactPersonIdFront: () => generateFileMock('联系人身份证像面'), // 联系人身份证像面
  contactPersonIdBack: () => generateFileMock('联系人身份证国徽面'), // 联系人身份证国徽面
  contactPersonPhone: /^1[3-9]\d{9}$/, // 联系人电话
  contactPersonEmail: '@email', // 联系人邮箱
  customerAuthDoc: () => generateFileMock('客户授权书', 'pdf'), // 客户授权书文件
  supplementaryQualification: () => generateFileMock('补充资质', Mock.Random.pick(['png', 'pdf'])), // 补充资质文件
  chatbotDescription: '@cparagraph(1, 3)', // Chatbot 描述
  chatbotLogo: () => generateFileMock('ChatbotLOGO'), // Chatbot LOGO
  chatbotWebsite: '@url', // Chatbot 网址
  chatbotServiceTerms: '@url', // Chatbot 服务条款
  chatbotSignature: '@cword(2, 5)', // Chatbot 签名
  chatbotIndustry: 'industry1', // Chatbot 行业
  chatbotServicePhone: /^1[3-9]\d{9}$/, // Chatbot 服务电话
  chatbotContactEmail: '@email', // Chatbot 联系邮箱
  chatbotOfficeAddress: '@county(true)', // Chatbot 办公地址
  chatbotLongitude: '@float(0, 180, 2, 2)', // Chatbot 经度
  chatbotLatitude: '@float(0, 90, 2, 2)', // Chatbot 纬度
};

// Chatbot 状态列表
const statuses = ['同意', '审核中', '通过', '拒绝'];

/**
 * Chatbot 列表项数据模板
 * 使用 Mock.js 语法定义了 Chatbot 列表项的字段和生成规则
 */
const chatbotListItemTemplate = {
  uid: 'jk@string("number", 3)', // 用户ID
  phone: /^1[3-9]\d{9}$/, // 手机号
  enterpriseName: '@cword(5, 10)有限公司', // 企业名称
  chatbotId: '@string("number", 6)', // Chatbot ID
  chatbotName: '【Chatbot的名称】@cword(2, 5)', // Chatbot 名称
  createTime: '@datetime("yyyy-MM-dd HH:mm:ss")', // 创建时间
  // 状态将在 generateChatbotList 中显式设置
};

/**
 * 生成指定数量的 Chatbot 列表数据
 * @param count 生成的数量
 * @returns Chatbot 列表数组
 */
const generateChatbotList = (count: number) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const item = Mock.mock(chatbotListItemTemplate);
    item.status = statuses[i % statuses.length]; // 循环设置状态
    list.push(item);
  }
  return list;
};

// 生成一个固定的大列表用于筛选和分页
const allChatbotList = generateChatbotList(50); // 生成 50 条模拟数据

export default {
  /**
   * 获取 Chatbot 列表接口
   * 支持分页、UID、状态、Chatbot ID 和 Chatbot 名称筛选
   */
  'GET /api/chatbot/list': (req: Request, res: Response) => {
    const { pageSize = 10, current = 1, uid, status, chatbotId, chatbotName } = req.query;

    let filteredList = [...allChatbotList]; // 使用生成的列表进行筛选

    // 根据 UID 筛选
    if (uid && uid !== 'all') {
      filteredList = filteredList.filter((item) => item.uid === uid);
    }
    // 根据状态筛选
    if (status && status !== 'all') {
      filteredList = filteredList.filter((item) => item.status === status);
    }
    // 根据 Chatbot ID 筛选
    if (chatbotId) {
      filteredList = filteredList.filter((item) => item.chatbotId.includes(chatbotId as string));
    }
    // 根据 Chatbot 名称筛选
    if (chatbotName) {
      filteredList = filteredList.filter((item) =>
        item.chatbotName.includes(chatbotName as string),
      );
    }

    const total = filteredList.length;
    const startIndex = (Number(current) - 1) * Number(pageSize);
    const endIndex = startIndex + Number(pageSize);
    const paginatedList = filteredList.slice(startIndex, endIndex);

    res.send({
      data: paginatedList,
      total,
      success: true,
    });
  },

  /**
   * 获取 Chatbot 详情接口
   * 根据 Chatbot ID 返回对应的详细信息
   */
  'GET /api/chatbot/detail/:chatbotId': (req: Request, res: Response) => {
    const { chatbotId } = req.params;
    // 使用 Mock.js 根据模板生成完整的 Chatbot 详情
    const generatedChatbot = Mock.mock({
      ...chatbotDetailTemplate,
      chatbotId: chatbotId, // 确保使用请求的 chatbotId
    });

    res.send({
      data: generatedChatbot,
      success: true,
    });
  },
};
