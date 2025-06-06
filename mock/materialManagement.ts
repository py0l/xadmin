import { Request, Response } from 'express';
import Mock from 'mockjs';

/**
 * 素材状态列表
 */
const materialStatuses = ['待审核', '审核中', '通过', '驳回'];
const reviewStatuses = ['待审核', '通过', '驳回'];

/**
 * 生成单个素材数据项的模板
 */
const materialItemTemplate = {
  accountUID: 'jk@string("number", 3)', // 账户UID
  phoneNumber: /^1[3-9]\d{9}$/, // 手机号码
  enterpriseName: '@cword(5, 10)有限公司', // 企业名称
  materialID: '@string("number", 6)', // 素材ID
  materialName: '【素材的名称】@cword(2, 5)', // 素材名称
  materialContent: () => Mock.Random.image('400x200', Mock.Random.color(), '#FFF', '素材图片'), // 素材内容（图片URL）
  createTime: '@datetime("yyyy-MM-dd HH:mm:ss")', // 创建时间
  // status, systemReview, channelReview, operation 将在生成列表时动态设置
};

/**
 * 生成指定数量的素材列表数据
 * @param count 生成的数量
 * @returns 素材列表数组
 */
const generateMaterialList = (count: number) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const item = Mock.mock(materialItemTemplate);
    // 随机设置状态
    item.status = Mock.Random.pick(materialStatuses);
    // 根据状态设置系统审核和渠道审核
    if (item.status === '通过') {
      item.systemReview = '通过';
      item.channelReview = '通过';
    } else if (item.status === '驳回') {
      item.systemReview = Mock.Random.pick(['通过', '驳回']);
      item.channelReview = Mock.Random.pick(['通过', '驳回']);
      // 确保至少有一个是驳回
      if (item.systemReview === '通过' && item.channelReview === '通过') {
        item.systemReview = '驳回';
      }
    } else if (item.status === '审核中') {
      item.systemReview = Mock.Random.pick(['待审核', '通过']);
      item.channelReview = '待审核';
    } else {
      // 待审核
      item.systemReview = '待审核';
      item.channelReview = '待审核';
    }
    item.operation = item.status; // 操作字段与状态保持一致，前端根据此字段渲染按钮
    list.push(item);
  }
  return list;
};

// 生成一个固定的大列表用于筛选和分页
const allMaterialList = generateMaterialList(50); // 生成 50 条模拟数据

export default {
  /**
   * 获取素材管理列表接口
   * 支持素材ID、素材名称、状态和账户筛选
   */
  'GET /api/materialManagement': (req: Request, res: Response) => {
    const { materialID, materialName, status, account, pageSize = 10, current = 1 } = req.query;

    let filteredData = [...allMaterialList]; // 使用生成的列表进行筛选

    // 根据素材ID或素材名称筛选
    if (materialID || materialName) {
      filteredData = filteredData.filter(
        (item) =>
          (materialID && item.materialID.includes(materialID as string)) ||
          (materialName && item.materialName.includes(materialName as string)),
      );
    }

    // 根据状态筛选
    if (status && status !== '全部') {
      filteredData = filteredData.filter((item) => item.status === status);
    }

    // 根据账户筛选
    if (account && account !== '全部账号') {
      filteredData = filteredData.filter((item) => item.accountUID === account);
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
