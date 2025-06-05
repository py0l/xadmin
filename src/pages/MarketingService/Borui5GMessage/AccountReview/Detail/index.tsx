import { useParams } from '@umijs/max';
import { Card, Descriptions, Image, Space } from 'antd';
import React from 'react';

const AccountReviewDetail: React.FC = () => {
  const params = useParams();
  const { accountId } = params;

  // 模拟数据，实际项目中会根据 accountId 从后端获取
  const mockDetailData = {
    accountId: accountId || '未知UID',
    phoneNumber: '13800128002',
    password: '********',
    userRole: '普通客户',
    enterpriseName: '广州市梦享网络技术有限公司',
    enterpriseIntro:
      '广州市梦享网络技术有限公司成立于2014年10月，总部现坐落于广州市天河区，是一家专注于互联网技术研发与应用、移动互联网业务、梦享团队经过多年的技术积累及产品沉淀，旗下产品“梦享互联”已成为国内领先的移动互联网营销平台。公司致力于解决消费者在生活场景中的即时服务需求，本着“极致体验，服务至上”的理念，为消费者提供更优质、更便捷的移动互联网服务。',
    businessLicense: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/loading.gif', // 模拟图片URL
    legalPersonLogo: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/loading.gif', // 模拟图片URL
    enterpriseType: '工程和技术研究和试验发展(M7320)',
    unifiedCreditCode: '9144010130457770XL',
    enterpriseAddress: '广州市越秀区天河路1号707自编A30房',
    enterpriseContact: '4001832628',
    legalPersonName: '李铁',
    legalPersonIdCard: '123456789012345678',
    legalPersonIdCardFront: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/loading.gif',
    legalPersonIdCardBack: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/loading.gif',
    contactName: '陈开文',
    contactIdCard: '123456789012345678',
    contactIdCardFront: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/loading.gif',
    contactIdCardBack: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/loading.gif',
    contactPhone: '13800128002',
    contactEmail: 'chenkaiwen@clickwifi.net',
    customerAuthDoc: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/loading.gif', // 模拟文件URL
    supplementaryDoc: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/loading.gif', // 模拟文件URL
    chatbotName: '客流易',
    chatbotDescription:
      'SaaS+APP+API三产品形态，提供从客户分析、营销投放到底层技术支撑的完整解决方案，助力企业精准获客和客户管理，实现业绩增长！',
    chatbotLogo: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/loading.gif',
    chatbotWebsite: 'www.keiliuyi.com',
    chatbotServiceTerms: 'www.keiliuyi.com/about',
    chatbotSignature: '客流易',
    chatbotIndustry: 'GB/T 4754-2017《国民经济行业分类》',
    chatbotServicePhone: '14716899662',
    chatbotContactEmail: 'about@clickwifi.net',
    chatbotOfficeAddress: '深圳市南山区海天一路软件产业基地4栋203室',
    chatbotLongitude: '113.936868',
    chatbotLatitude: '22.524175',
  };

  const fallbackImage =
    'data:image/png;base64,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';

  return (
    <>
      <Card title="账号信息" style={{ marginBottom: 24 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="手机号码">{mockDetailData.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="设置登录密码">{mockDetailData.password}</Descriptions.Item>
          <Descriptions.Item label="用户角色">{mockDetailData.userRole}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="企业信息" style={{ marginBottom: 24 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="企业名称">{mockDetailData.enterpriseName}</Descriptions.Item>
          <Descriptions.Item label="企业介绍">{mockDetailData.enterpriseIntro}</Descriptions.Item>
          <Descriptions.Item label="上传企业营业执照">
            <Image width={100} src={mockDetailData.businessLicense} fallback={fallbackImage} />
          </Descriptions.Item>
          <Descriptions.Item label="上传法人LOGO">
            <Image width={100} src={mockDetailData.legalPersonLogo} fallback={fallbackImage} />
          </Descriptions.Item>
          <Descriptions.Item label="所属行业代码">
            {mockDetailData.enterpriseType}
          </Descriptions.Item>
          <Descriptions.Item label="统一社会信用代码">
            {mockDetailData.unifiedCreditCode}
          </Descriptions.Item>
          <Descriptions.Item label="企业注册地址">
            {mockDetailData.enterpriseAddress}
          </Descriptions.Item>
          <Descriptions.Item label="企业联系电话">
            {mockDetailData.enterpriseContact}
          </Descriptions.Item>
          <Descriptions.Item label="法定代表人姓名">
            {mockDetailData.legalPersonName}
          </Descriptions.Item>
          <Descriptions.Item label="法定代表人身份证号">
            {mockDetailData.legalPersonIdCard}
          </Descriptions.Item>
          <Descriptions.Item label="上传法人身份证人像面">
            <Image
              width={100}
              src={mockDetailData.legalPersonIdCardFront}
              fallback={fallbackImage}
            />
          </Descriptions.Item>
          <Descriptions.Item label="上传法人身份证国徽面">
            <Image
              width={100}
              src={mockDetailData.legalPersonIdCardBack}
              fallback={fallbackImage}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="联系人信息" style={{ marginBottom: 24 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="联系人姓名">{mockDetailData.contactName}</Descriptions.Item>
          <Descriptions.Item label="联系人身份证号">
            {mockDetailData.contactIdCard}
          </Descriptions.Item>
          <Descriptions.Item label="上传联系人身份证人像面">
            <Image width={100} src={mockDetailData.contactIdCardFront} fallback={fallbackImage} />
          </Descriptions.Item>
          <Descriptions.Item label="上传联系人身份证国徽面">
            <Image width={100} src={mockDetailData.contactIdCardBack} fallback={fallbackImage} />
          </Descriptions.Item>
          <Descriptions.Item label="联系人手机号">
            {mockDetailData.contactPhone}
            <span style={{ marginLeft: 8, color: '#1890ff' }}>与账号绑定的手机号一致</span>
          </Descriptions.Item>
          <Descriptions.Item label="联系人邮箱">{mockDetailData.contactEmail}</Descriptions.Item>
          <Descriptions.Item label="上传客户授权书文件">
            <Space direction="vertical">
              <a href={mockDetailData.customerAuthDoc} target="_blank" rel="noopener noreferrer">
                <Image width={100} src={mockDetailData.customerAuthDoc} fallback={fallbackImage} />
              </a>
              <span>(支持 jpg jpeg png pdf 格式)</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="补充相关企业资料">
            <Space direction="vertical">
              <a href={mockDetailData.supplementaryDoc} target="_blank" rel="noopener noreferrer">
                <Image width={100} src={mockDetailData.supplementaryDoc} fallback={fallbackImage} />
              </a>
              <span>(支持 jpg jpeg png pdf 格式)</span>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Chatbot信息" style={{ marginBottom: 24 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Chatbot 名称">{mockDetailData.chatbotName}</Descriptions.Item>
          <Descriptions.Item label="Chatbot 描述">
            {mockDetailData.chatbotDescription}
          </Descriptions.Item>
          <Descriptions.Item label="上传Chatbot LOGO">
            <Image width={100} src={mockDetailData.chatbotLogo} fallback={fallbackImage} />
          </Descriptions.Item>
          <Descriptions.Item label="Chatbot 官网">
            {mockDetailData.chatbotWebsite}
            <span style={{ marginLeft: 8, color: '#999' }}>显示在 Chatbot 详情页中</span>
          </Descriptions.Item>
          <Descriptions.Item label="Chatbot 服务条款地址">
            {mockDetailData.chatbotServiceTerms}
          </Descriptions.Item>
          <Descriptions.Item label="Chatbot 签名">
            {mockDetailData.chatbotSignature}
            <span style={{ marginLeft: 8, color: '#999' }}>设备不显示5G消息时，回落文本使用</span>
          </Descriptions.Item>
          <Descriptions.Item label="Chatbot 所属行业">
            {mockDetailData.chatbotIndustry}
          </Descriptions.Item>
          <Descriptions.Item label="Chatbot 服务电话">
            {mockDetailData.chatbotServicePhone}
            <span style={{ marginLeft: 8, color: '#999' }}>显示在 Chatbot 详情页中</span>
          </Descriptions.Item>
          <Descriptions.Item label="Chatbot 联系邮箱">
            {mockDetailData.chatbotContactEmail}
            <span style={{ marginLeft: 8, color: '#999' }}>显示在 Chatbot 详情页中</span>
          </Descriptions.Item>
          <Descriptions.Item label="Chatbot 办公地址">
            {mockDetailData.chatbotOfficeAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Chatbot 地理经度">
            {mockDetailData.chatbotLongitude}
            <span style={{ marginLeft: 8, color: '#999' }}>提供位置服务使用</span>
          </Descriptions.Item>
          <Descriptions.Item label="Chatbot 地理纬度">
            {mockDetailData.chatbotLatitude}
            <span style={{ marginLeft: 8, color: '#999' }}>提供位置服务使用</span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default AccountReviewDetail;
