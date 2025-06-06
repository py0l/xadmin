import { Request, Response } from 'express';

const materialData = [
  {
    accountUID: 'jk0092',
    phoneNumber: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    materialID: '020107',
    materialName: '【素材的名称】',
    materialContent: 'placeholder_image_url', // Placeholder for image
    status: '待审核',
    systemReview: '待审核',
    channelReview: '待审核',
    createTime: '2024-12-18 17:35:42',
    operation: '待审核', // This will be rendered with buttons
  },
  {
    accountUID: 'jk0091',
    phoneNumber: '13800138001',
    enterpriseName: '深圳xxxxxx有限公司',
    materialID: '020106',
    materialName: '【素材的名称】',
    materialContent: 'placeholder_image_url',
    status: '待审核',
    systemReview: '待审核',
    channelReview: '待审核',
    createTime: '2024-12-18 17:35:42',
    operation: '待审核',
  },
  {
    accountUID: 'jk0093',
    phoneNumber: '13800138003',
    enterpriseName: '深圳xxxxxx有限公司',
    materialID: '020105',
    materialName: '【素材的名称】',
    materialContent: 'placeholder_image_url',
    status: '审核中',
    systemReview: '通过',
    channelReview: '待审核',
    createTime: '2024-10-18 17:35:42',
    operation: '审核中',
  },
  {
    accountUID: 'jk0092',
    phoneNumber: '13800138002',
    enterpriseName: '深圳xxxxxx有限公司',
    materialID: '020104',
    materialName: '【素材的名称】',
    materialContent: 'placeholder_image_url',
    status: '通过',
    systemReview: '通过',
    channelReview: '通过',
    createTime: '2024-09-28 17:35:42',
    operation: '通过',
  },
  {
    accountUID: 'jk0091',
    phoneNumber: '13800138001',
    enterpriseName: '深圳赛格股份有限公司',
    materialID: '020101',
    materialName: '【素材的名称】',
    materialContent: 'placeholder_image_url',
    status: '通过',
    systemReview: '通过',
    channelReview: '通过',
    createTime: '2024-08-18 17:35:42',
    operation: '通过',
  },
];

export default {
  'GET /api/materialManagement': (req: Request, res: Response) => {
    const { materialID, materialName, status, account } = req.query;

    let filteredData = materialData;

    if (materialID || materialName) {
      filteredData = filteredData.filter(
        (item) =>
          (materialID && item.materialID.includes(materialID as string)) ||
          (materialName && item.materialName.includes(materialName as string)),
      );
    }

    if (status && status !== '全部') {
      filteredData = filteredData.filter((item) => item.status === status);
    }

    if (account && account !== '全部账号') {
      filteredData = filteredData.filter((item) => item.accountUID === account);
    }

    res.send({
      success: true,
      data: filteredData,
      total: filteredData.length,
    });
  },
};
