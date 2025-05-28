import { PlusOutlined } from '@ant-design/icons';
import { history, useParams } from '@umijs/max';
import { Button, Card, Col, Form, Input, message, Row, Select, Upload } from 'antd';
import React, { useEffect } from 'react';

const { Option } = Select;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface AccountFormProps {
  isEdit?: boolean;
}

const AccountForm: React.FC<AccountFormProps> = () => {
  const [form] = Form.useForm();
  const { uid } = useParams<{ uid: string }>();
  const isEdit = !!uid;

  useEffect(() => {
    if (isEdit) {
      // 模拟根据uid加载账户数据
      const mockAccountData = {
        uid: 'jk0091',
        phone: '13800138001',
        password: 'mockpassword', // 新增密码字段
        role: '普通客户',
        certificationStatus: '已认证',
        enterpriseName: '深圳赛格股份有限公司',
        enterpriseIntroduction: '这是一家模拟公司', // 新增企业介绍
        enterpriseIndustry: 'GB/T 4754-2017 《国民经济行业分类》', // 新增企业所属行业
        socialCreditCode: '914403007900000000', // 新增统一社会信用代码
        registeredAddress: '深圳市南山区科技园', // 新增企业注册地址
        contactPhone: '0755-88888888', // 新增企业联系电话
        legalPersonName: '张三', // 新增法定代表人姓名
        legalPersonId: '440300199001011234', // 新增法定代表人身份证号
        contactName: '李四', // 新增联系人姓名
        contactId: '440300199505055678', // 新增联系人身份证号
        contactMobile: '13900000000', // 新增联系人手机号
        contactEmail: 'lisi@example.com', // 新增联系人邮箱
        accountBalance: '30000.00',
      };
      form.setFieldsValue(mockAccountData);
    } else {
      form.resetFields();
    }
  }, [uid, isEdit, form]);

  const onFinish = async (values: any) => {
    if (isEdit) {
      message.success('账户编辑成功');
      console.log('编辑账户:', { ...values, uid });
    } else {
      message.success('账户新增成功');
      console.log('新增账户:', values);
    }
    history.push('/user-account/account-management');
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <Form
      form={form}
      name="accountForm"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ role: '普通客户' }}
      autoComplete="off"
      scrollToFirstError
    >
      <Card title="填写账号信息" variant="outlined" style={{ marginBottom: 24 }}>
        {isEdit && (
          <Form.Item label="账号UID" name="uid">
            <Input disabled />
          </Form.Item>
        )}
        <Form.Item
          label="手机号码"
          name="phone"
          rules={[{ required: true, message: '请输入手机号码!' }]}
        >
          <Input placeholder="请输入11位的手机号码" />
        </Form.Item>
        <Form.Item
          label="设置登录密码"
          name="password"
          rules={[{ required: true, message: '请设置登录密码!' }]}
          extra="不设置，默认手机号后8位"
        >
          <Input.Password placeholder="设置8-50位的登录密码" />
        </Form.Item>
        <Form.Item
          label="用户角色"
          name="role"
          rules={[{ required: true, message: '请选择用户角色!' }]}
        >
          <Select placeholder="请选择用户角色">
            <Option value="普通客户">普通客户</Option>
            <Option value="管理员">管理员</Option>
          </Select>
        </Form.Item>
      </Card>

      <Card title="填写企业信息" variant="outlined" style={{ marginBottom: 24 }}>
        <Form.Item label="企业名称" name="enterpriseName">
          <Input placeholder="填写企业名称" />
        </Form.Item>
        <Form.Item label="企业介绍" name="enterpriseIntroduction">
          <Input.TextArea placeholder="填写企业介绍" autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="上传企业营业执照"
              name="businessLicense"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={
                <>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    营业执照原件图片 或 加盖公章复印件 (支持 jpg .jpeg .png 格式)
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>(大小不超过 2M)</div>
                </>
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 替换为实际上传接口
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="上传企业LOGO:"
              name="enterpriseLogo"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={
                <>
                  <div style={{ fontSize: '12px', color: '#999' }}>(支持 jpg .jpeg .png 格式)</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>(大小不超过 2M)</div>
                </>
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 替换为实际上传接口
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="企业所属行业" name="enterpriseIndustry">
          <Select placeholder="请选择企业所属行业">
            <Option value="GB/T 4754-2017 《国民经济行业分类》">
              GB/T 4754-2017 《国民经济行业分类》
            </Option>
            {/* 更多行业选项 */}
          </Select>
        </Form.Item>
        <Form.Item label="统一社会信用代码" name="socialCreditCode">
          <Input placeholder="填写18位统一社会信用代码" />
        </Form.Item>
        <Form.Item label="企业注册地址" name="registeredAddress">
          <Input placeholder="填写企业注册地址" />
        </Form.Item>
        <Form.Item label="企业联系电话" name="contactPhone">
          <Input placeholder="填写企业联系电话" />
        </Form.Item>
        <Form.Item label="法定代表人姓名" name="legalPersonName">
          <Input placeholder="填写法定代表人姓名" />
        </Form.Item>
        <Form.Item label="法定代表人身份证号" name="legalPersonId">
          <Input placeholder="填写法定代表人身份证号码" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="上传法人身份证人像面:"
              name="legalPersonIdFront"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={
                <>
                  <div style={{ fontSize: '12px', color: '#999' }}>(支持 jpg .jpeg .png 格式)</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>(大小不超过 2M)</div>
                </>
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 替换为实际上传接口
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="上传法人身份证国徽面:"
              name="legalPersonIdBack"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={
                <>
                  <div style={{ fontSize: '12px', color: '#999' }}>(支持 jpg .jpeg .png 格式)</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>(大小不超过 2M)</div>
                </>
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 替换为实际上传接口
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="填写联系人信息" variant="outlined" style={{ marginBottom: 24 }}>
        <Form.Item label="联系人姓名" name="contactName">
          <Input placeholder="填写联系人姓名" />
        </Form.Item>
        <Form.Item label="联系人身份证号" name="contactId">
          <Input placeholder="填写联系人身份证号码" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="上传联系人身份证人像面:"
              name="contactIdFront"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={
                <>
                  <div style={{ fontSize: '12px', color: '#999' }}>(支持 jpg .jpeg .png 格式)</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>(大小不超过 2M)</div>
                </>
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 替换为实际上传接口
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="上传联系人身份证国徽面:"
              name="contactIdBack"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: '请上传联系人身份证国徽面!' }]}
              extra={
                <>
                  <div style={{ fontSize: '12px', color: '#999' }}>(支持 jpg .jpeg .png 格式)</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>(大小不超过 2M)</div>
                </>
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 替换为实际上传接口
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="联系人手机号"
          name="contactMobile"
          extra={<div style={{ fontSize: '12px', color: '#999' }}>需与联络的手机号码一致</div>}
        >
          <Input placeholder="填写联系人手机号" />
        </Form.Item>
        <Form.Item label="联系人邮箱" name="contactEmail">
          <Input placeholder="填写联系人邮箱" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="上传客户授权书文件:"
              name="customerAuthorization"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={
                <>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    《客户授权书》模板下载 (支持 .pdf 格式)
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>(大小不超过 50M)</div>
                </>
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 替换为实际上传接口
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="补充相关企业资质:"
              name="additionalQualifications"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={
                <>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    (支持 jpg .jpeg .png .pdf 格式)
                  </div>
                </>
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 替换为实际上传接口
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? '变更保存' : '提交创建'}
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          onClick={() => history.push('/user-account/account-management')}
        >
          取消
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AccountForm;
