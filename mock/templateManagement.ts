import { Request, Response } from 'express';
import Mock from 'mockjs';

/**
 * 模板状态列表
 */
const templateStatuses = ['待审核', '审核中', '通过', '拒绝'];
const reviewStatuses = ['待审核', '通过', '拒绝'];

/**
 * 生成单个模板数据项的模板
 */
const templateItemTemplate = {
  accountUID: 'jk@string("number", 3)', // 账户UID
  phoneNumber: /^1[3-9]\d{9}$/, // 手机号码
  enterpriseName: '@cword(5, 10)有限公司', // 企业名称
  templateID: '@string("number", 6)', // 模板ID
  templateName: '【模板的名称】@cword(2, 5)', // 模板名称
  chatbot: '【Chatbot的名称】@cword(2, 5)', // Chatbot 名称
  fallbackSMSContent: '【签名的名称】@cparagraph(1)', // 回落短信内容
  characterCount: '@integer(50, 200)', // 字符数
  billingCount: '@integer(1, 5)', // 计费条数
  createTime: '@datetime("yyyy-MM-dd HH:mm:ss")', // 创建时间
  // status, systemReview, channelReview 将在生成列表时动态设置
};

/**
 * 生成指定数量的模板列表数据
 * @param count 生成的数量
 * @returns 模板列表数组
 */
const generateTemplateList = (count: number) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const item = Mock.mock(templateItemTemplate);
    // 随机设置状态
    item.status = Mock.Random.pick(templateStatuses);
    // 根据状态设置系统审核和渠道审核
    if (item.status === '通过') {
      item.systemReview = '通过';
      item.channelReview = '通过';
    } else if (item.status === '拒绝') {
      item.systemReview = Mock.Random.pick(['通过', '拒绝']);
      item.channelReview = Mock.Random.pick(['通过', '拒绝']);
      // 确保至少有一个是拒绝
      if (item.systemReview === '通过' && item.channelReview === '通过') {
        item.systemReview = '拒绝';
      }
    } else if (item.status === '审核中') {
      item.systemReview = Mock.Random.pick(['待审核', '通过']);
      item.channelReview = '待审核';
    } else {
      // 待审核
      item.systemReview = '待审核';
      item.channelReview = '待审核';
    }
    list.push(item);
  }
  return list;
};

// 生成一个固定的大列表用于筛选和分页
const allTemplateList = generateTemplateList(50); // 生成 50 条模拟数据

export default {
  /**
   * 获取模板管理列表接口
   * 支持模板ID、模板名称、回落短信内容、状态、账户UID和关键词筛选
   */
  'GET /api/templateManagement': (req: Request, res: Response) => {
    const {
      templateID,
      templateName,
      fallbackSMSContent,
      status,
      accountUID,
      searchKeyword,
      pageSize = 10,
      current = 1,
    } = req.query;

    let filteredData = [...allTemplateList]; // 使用生成的列表进行筛选

    // 根据关键词筛选 (模板名称或回落短信内容)
    if (searchKeyword) {
      filteredData = filteredData.filter(
        (item) =>
          item.templateName.includes(searchKeyword as string) ||
          item.fallbackSMSContent.includes(searchKeyword as string),
      );
    }

    // 根据模板ID筛选
    if (templateID) {
      filteredData = filteredData.filter((item) => item.templateID.includes(templateID as string));
    }

    // 根据模板名称筛选
    if (templateName) {
      filteredData = filteredData.filter((item) =>
        item.templateName.includes(templateName as string),
      );
    }

    // 根据回落短信内容筛选
    if (fallbackSMSContent) {
      filteredData = filteredData.filter((item) =>
        item.fallbackSMSContent.includes(fallbackSMSContent as string),
      );
    }

    // 根据状态筛选
    if (status && status !== '') {
      filteredData = filteredData.filter((item) => item.status === status);
    }

    // 根据账户UID筛选
    if (accountUID && accountUID !== '') {
      filteredData = filteredData.filter((item) => item.accountUID === accountUID);
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const paginatedList = filteredData.slice(start, end);

    res.send({
      success: true,
      data: paginatedList,
      total: filteredData.length,
    });
  },
};
