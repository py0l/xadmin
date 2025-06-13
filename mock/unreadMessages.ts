/**
 * 模拟未处理消息接口
 */
export default {
  'GET /api/unreadMessages': (req: any, res: any) => {
    res.send({
      success: true,
      data: {
        '/user-account/enterprise-certification': 1, // 企业认证有未读
        '/data-service/jike-data': 1, // 及刻数据无未读
        '/marketing-service/borui-5g-message': 1, // 博瑞5G消息有未读
      },
    });
  },
};
