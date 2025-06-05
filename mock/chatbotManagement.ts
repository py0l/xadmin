import { Request, Response } from 'express';
import Mock from 'mockjs';

const generateFileMock = (name: string, type: string = 'image') => {
  const url =
    type === 'pdf'
      ? Mock.Random.url('http', 'pdf')
      : Mock.Random.image('200x100', Mock.Random.color(), '#FFF', name);
  return [{ uid: Mock.Random.guid(), name: `${name}.${type}`, status: 'done', url }];
};

const chatbotDetailTemplate = {
  uid: 'jk0091',
  phone: '13800138001',
  enterpriseName: '@cword(5, 10)有限公司',
  chatbotId: '@string("number", 6)',
  chatbotName: '【Chatbot的名称】@cword(2, 5)',
  createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
  status: Mock.Random.pick(['同意', '审核中', '通过', '拒绝']),
  userAuth: '@boolean',
  countdown: '@boolean',
  enterpriseIntro: '@cparagraph(1, 3)',
  businessLicense: () => generateFileMock('营业执照'),
  enterpriseLogo: () => generateFileMock('企业LOGO'),
  industry: 'industry1',
  socialCreditCode: '@string("number", 18)',
  registeredAddress: '@county(true)',
  contactPhone: /^1[3-9]\d{9}$/,
  legalPersonName: '@cname',
  legalPersonId: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  legalPersonIdFront: () => generateFileMock('法人身份证像面'),
  legalPersonIdBack: () => generateFileMock('法人身份证国徽面'),
  contactPersonName: '@cname',
  contactPersonId: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  contactPersonIdFront: () => generateFileMock('联系人身份证像面'),
  contactPersonIdBack: () => generateFileMock('联系人身份证国徽面'),
  contactPersonPhone: /^1[3-9]\d{9}$/,
  contactPersonEmail: '@email',
  customerAuthDoc: () => generateFileMock('客户授权书', 'pdf'),
  supplementaryQualification: () => generateFileMock('补充资质', Mock.Random.pick(['png', 'pdf'])),
  chatbotDescription: '@cparagraph(1, 3)',
  chatbotLogo: () => generateFileMock('ChatbotLOGO'),
  chatbotWebsite: '@url',
  chatbotServiceTerms: '@url',
  chatbotSignature: '@cword(2, 5)',
  chatbotIndustry: 'industry1',
  chatbotServicePhone: /^1[3-9]\d{9}$/,
  chatbotContactEmail: '@email',
  chatbotOfficeAddress: '@county(true)',
  chatbotLongitude: '@float(0, 180, 2, 2)',
  chatbotLatitude: '@float(0, 90, 2, 2)',
};

const statuses = ['同意', '审核中', '通过', '拒绝'];

const chatbotListItemTemplate = {
  uid: 'jk@string("number", 3)',
  phone: /^1[3-9]\d{9}$/,
  enterpriseName: '@cword(5, 10)有限公司',
  chatbotId: '@string("number", 6)',
  chatbotName: '【Chatbot的名称】@cword(2, 5)',
  createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
  // Status will be set explicitly in generateChatbotList
};

const generateChatbotList = (count: number) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const item = Mock.mock(chatbotListItemTemplate);
    item.status = statuses[i % statuses.length]; // Cycle through statuses
    list.push(item);
  }
  return list;
};

// Generate a fixed large list for filtering and pagination
const allChatbotList = generateChatbotList(50); // Generate 50 mock items

export default {
  'GET /api/chatbot/list': (req: Request, res: Response) => {
    const { pageSize = 10, current = 1, uid, status, chatbotId, chatbotName } = req.query;

    let filteredList = [...allChatbotList]; // Use the generated list

    if (uid && uid !== 'all') {
      filteredList = filteredList.filter((item) => item.uid === uid);
    }
    if (status && status !== 'all') {
      filteredList = filteredList.filter((item) => item.status === status);
    }
    if (chatbotId) {
      filteredList = filteredList.filter((item) => item.chatbotId.includes(chatbotId as string));
    }
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

  'GET /api/chatbot/detail/:chatbotId': (req: Request, res: Response) => {
    const { chatbotId } = req.params;
    // Use Mock.js to generate a full chatbot detail based on the template
    const generatedChatbot = Mock.mock({
      ...chatbotDetailTemplate,
      chatbotId: chatbotId, // Ensure the requested chatbotId is used
    });

    res.send({
      data: generatedChatbot,
      success: true,
    });
  },
};
