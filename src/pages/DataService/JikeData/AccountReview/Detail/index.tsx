import { useParams } from '@umijs/max';
import { Card, Descriptions, Image, Space } from 'antd';
import React from 'react';

const AccountReviewDetail: React.FC = () => {
  const params = useParams();
  const { accountId } = params;

  // 模拟数据，实际项目中会根据 accountId 从后端获取
  const mockDetailData = {
    accountId: accountId || '未知UID',
    phoneNumber: '13800138002',
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
  };

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
            <Image width={100} src={mockDetailData.businessLicense} />
          </Descriptions.Item>
          <Descriptions.Item label="上传法人LOGO">
            <Image width={100} src={mockDetailData.legalPersonLogo} />
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
            <Image width={100} src={mockDetailData.legalPersonIdCardFront} />
          </Descriptions.Item>
          <Descriptions.Item label="上传法人身份证国徽面">
            <Image width={100} src={mockDetailData.legalPersonIdCardBack} />
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
            <Image width={100} src={mockDetailData.contactIdCardFront} />
          </Descriptions.Item>
          <Descriptions.Item label="上传联系人身份证国徽面">
            <Image width={100} src={mockDetailData.contactIdCardBack} />
          </Descriptions.Item>
          <Descriptions.Item label="联系人手机号">{mockDetailData.contactPhone}</Descriptions.Item>
          <Descriptions.Item label="联系人邮箱">{mockDetailData.contactEmail}</Descriptions.Item>
          <Descriptions.Item label="上传客户授权书文件">
            <Space direction="vertical">
              <a href={mockDetailData.customerAuthDoc} target="_blank" rel="noopener noreferrer">
                <Image width={100} src={mockDetailData.customerAuthDoc} />
              </a>
              <span>(支持 jpg jpeg png pdf 格式)</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="补充相关企业资料">
            <Space direction="vertical">
              <a href={mockDetailData.supplementaryDoc} target="_blank" rel="noopener noreferrer">
                <Image width={100} src={mockDetailData.supplementaryDoc} />
              </a>
              <span>(支持 jpg jpeg png pdf 格式)</span>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default AccountReviewDetail;
