import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input, Spin, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';

// 模拟数据
const mockEnterpriseDetail = {
  enterpriseName: '广州市梦擎网络技术有限公司',
  enterpriseIntroduction:
    '广州市梦擎网络技术有限公司成立于2014年10月，总部现坐落于深圳前海深港区，广州、北京、上海均设有分公司，负责市场、销售、研发。公司核心团队成员均来自国内知名互联网、通信产品及“和”现已成为业界领先的移动通信解决方案、及“和”致力于成为中国领先的移动互联网服务提供商。公司以“及刻”为核心产品，提供移动互联网服务，为用户提供移动互联网服务。',
  businessLicense: [
    { uid: '-1', name: 'business_license.jpg', status: 'done', url: 'upload/business_license.jpg' },
  ],
  enterpriseLogo: [
    { uid: '-2', name: 'enterprise_logo.jpg', status: 'done', url: 'upload/enterprise_logo.jpg' },
  ],
  enterpriseNature: '工程和技术研究和试验发展(M7320)',
  socialCreditCode: '9144010430497170XL',
  enterpriseAddress: '广州市越秀区天河路1号707自编A30房',
  enterpriseContactNumber: '4001832628',
  legalRepresentativeName: '李鹤',
  legalRepresentativeId: '123456789012345678',
  legalRepresentativeIdFront: [
    { uid: '-3', name: 'id_front.jpg', status: 'done', url: 'upload/id_front.jpg' },
  ],
  legalRepresentativeIdBack: [
    { uid: '-4', name: 'id_back.jpg', status: 'done', url: 'upload/id_back.jpg' },
  ],
  contactName: '陈开文',
  contactId: '123456789012345678',
  contactIdFront: [
    { uid: '-5', name: 'contact_id_front.jpg', status: 'done', url: 'upload/contact_id_front.jpg' },
  ],
  contactIdBack: [
    { uid: '-6', name: 'contact_id_back.jpg', status: 'done', url: 'upload/contact_id_back.jpg' },
  ],
  contactPhoneNumber: '13800128002',
  contactEmail: 'chenkaiwen@clickwith.net',
  customerAuthorizationLetter: [
    {
      uid: '-7',
      name: 'authorization_letter.pdf',
      status: 'done',
      url: 'upload/authorization_letter.pdf',
    },
  ],
  supplementaryQualifications: [
    {
      uid: '-8',
      name: 'supplementary_qualifications.pdf',
      status: 'done',
      url: 'upload/supplementary_qualifications.pdf',
    },
  ],
};

const EnterpriseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 模拟数据加载
    setLoading(true);
    setTimeout(() => {
      form.setFieldsValue(mockEnterpriseDetail);
      setLoading(false);
    }, 500);
  }, [id, form]);

  // 处理文件上传
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // 提交表单
  const onFinish = async (values: any) => {
    setLoading(true);
    console.log('提交的企业资料:', values);
    // 模拟 API 调用
    setTimeout(() => {
      message.success('企业资料保存成功');
      setLoading(false);
    }, 1000);
  };

  return (
    <Spin spinning={loading}>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={mockEnterpriseDetail}
        >
          {/* 企业信息 */}
          <Descriptions title="企业信息" bordered column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="企业名称">
              <Form.Item name="enterpriseName" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="企业介绍" span={2}>
              <Form.Item name="enterpriseIntroduction" noStyle>
                <Input.TextArea rows={6} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="上传企业营业执照">
              <Form.Item
                name="businessLicense"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload
                  name="businessLicense"
                  action="/upload.do"
                  listType="picture-card"
                  maxCount={1}
                >
                  <Button type="link" icon={<UploadOutlined />}>
                    点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="上传企业LOGO">
              <Form.Item
                name="enterpriseLogo"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload
                  name="enterpriseLogo"
                  action="/upload.do"
                  listType="picture-card"
                  maxCount={1}
                >
                  <Button type="link" icon={<UploadOutlined />}>
                    点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="企业所属行业">
              <Form.Item name="enterpriseNature" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="统一社会信用代码">
              <Form.Item name="socialCreditCode" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="企业注册地址">
              <Form.Item name="enterpriseAddress" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="企业联系电话">
              <Form.Item name="enterpriseContactNumber" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="法定代表人姓名">
              <Form.Item name="legalRepresentativeName" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="法定代表人身份证号">
              <Form.Item name="legalRepresentativeId" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="上传法人身份证人像面">
              <Form.Item
                name="legalRepresentativeIdFront"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload
                  name="legalRepresentativeIdFront"
                  action="/upload.do"
                  listType="picture-card"
                  maxCount={1}
                >
                  <Button type="link" icon={<UploadOutlined />}>
                    点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="上传法人身份证国徽面">
              <Form.Item
                name="legalRepresentativeIdBack"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload
                  name="legalRepresentativeIdBack"
                  action="/upload.do"
                  listType="picture-card"
                  maxCount={1}
                >
                  <Button type="link" icon={<UploadOutlined />}>
                    点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>

          {/* 联系人信息 */}
          <Descriptions title="联系人信息" bordered column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="联系人姓名">
              <Form.Item name="contactName" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="联系人身份证号">
              <Form.Item name="contactId" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="上传联系人身份证人像面">
              <Form.Item
                name="contactIdFront"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload
                  name="contactIdFront"
                  action="/upload.do"
                  listType="picture-card"
                  maxCount={1}
                >
                  <Button type="link" icon={<UploadOutlined />}>
                    点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="上传联系人身份证国徽面">
              <Form.Item
                name="contactIdBack"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload
                  name="contactIdBack"
                  action="/upload.do"
                  listType="picture-card"
                  maxCount={1}
                >
                  <Button type="link" icon={<UploadOutlined />}>
                    点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="联系人手机号">
              <Form.Item name="contactPhoneNumber" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="联系人邮箱">
              <Form.Item name="contactEmail" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="上传客户授权书">
              <Form.Item
                name="customerAuthorizationLetter"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload
                  name="customerAuthorizationLetter"
                  action="/upload.do"
                  listType="picture-card"
                  maxCount={1}
                >
                  <Button type="link" icon={<UploadOutlined />}>
                    点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="补充相关企业资质">
              <Form.Item
                name="supplementaryQualifications"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload
                  name="supplementaryQualifications"
                  action="/upload.do"
                  listType="picture-card"
                  maxCount={1}
                >
                  <Button type="link" icon={<UploadOutlined />}>
                    点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              变更保存
            </Button>
            <Button onClick={() => history.back()}>取消</Button>
          </div>
        </Form>
      </Card>
    </Spin>
  );
};

export default EnterpriseDetail;
