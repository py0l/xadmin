import { getChatbotDetail } from '@/services/Borui5GMessage/ChatbotManagement'; // 导入新的接口
import { UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max'; // 导入 useParams
import { Card, Col, message, Row, Typography } from 'antd';
import React, { useEffect } from 'react'; // 导入 useEffect

const ChatbotForm: React.FC = () => {
  const params = useParams();
  const isEditMode = !!params.chatbotId; // 判断是否为修改模式
  const [form] = ProForm.useForm(); // 获取 form 实例

  useEffect(() => {
    if (isEditMode && params.chatbotId) {
      const fetchChatbotDetail = async () => {
        try {
          const result = await getChatbotDetail(params.chatbotId as string);
          if (result.success) {
            form.setFieldsValue(result.data); // 回填数据
          } else {
            message.error('获取Chatbot详情失败');
          }
        } catch (error) {
          message.error('获取Chatbot详情异常');
          console.error(error);
        }
      };
      fetchChatbotDetail();
    }
  }, [isEditMode, params.chatbotId, form]); // 依赖项

  const onFinish = async (values: Record<string, any>) => {
    console.log('表单提交值:', values);
    message.success('提交成功');
    history.back();
  };

  return (
    <ProForm
      form={form}
      onFinish={onFinish}
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 10 }}
      submitter={{
        searchConfig: {
          submitText: isEditMode ? '保存' : '申请开通', // 根据是否为编辑模式调整提交按钮文本
          resetText: '取消',
        },
        onReset() {
          history.back();
        },
        render(_, dom) {
          return (
            <Row gutter={12} style={{ marginTop: 24 }}>
              {dom.map((item, index) => {
                return <Col key={index}>{item}</Col>;
              })}
            </Row>
          );
        },
      }}
    >
      <Card title="选择用户" variant="borderless" style={{ marginBottom: 24 }}>
        <ProFormSelect
          name="user"
          label="选择用户"
          valueEnum={{
            user1: '指定用户账号',
          }}
          rules={[{ required: true, message: '请选择用户' }]}
          initialValue="user1"
          fieldProps={{
            suffixIcon: <Typography.Link>为指定用户账号，创建Chatbot</Typography.Link>,
          }}
          readonly={isEditMode} // 在编辑模式下只读
        />
        {!isEditMode && ( // 仅在非修改模式下渲染
          <>
            <ProFormSwitch name="userAuth" label="需用户授权" readonly={isEditMode} />
            <ProFormDependency name={['userAuth', 'countdown']}>
              {({ userAuth, countdown }) => {
                if (!userAuth) {
                  return null;
                }
                return (
                  <ProFormSwitch
                    name="countdown"
                    label="倒计时"
                    extra={countdown ? '24小时后，自动授权' : undefined}
                    initialValue={false}
                    readonly={isEditMode}
                  />
                );
              }}
            </ProFormDependency>
          </>
        )}
      </Card>

      <Card title="填写企业信息" variant="borderless" style={{ marginBottom: 24 }}>
        <ProFormText
          name="enterpriseName"
          label="企业名称"
          rules={[{ required: true, message: '请输入企业名称' }]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <ProFormTextArea
          name="enterpriseIntro"
          label="企业介绍"
          rules={[{ required: true, message: '请输入企业介绍' }]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <Row gutter={16}>
          <Col span={12}>
            <ProFormUploadButton
              name="businessLicense"
              label="上传企业营业执照"
              max={1}
              labelCol={{ span: 8 }}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
              }}
              rules={[{ required: true, message: '请上传企业营业执照' }]}
              extra="支持 jpg .jpeg .png 格式"
              icon={<UploadOutlined />}
              disabled={isEditMode} // 在编辑模式下禁用
            />
          </Col>
          <Col span={12}>
            <ProFormUploadButton
              name="enterpriseLogo"
              label="上传企业LOGO"
              max={1}
              labelCol={{ span: 8 }}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
              }}
              rules={[{ required: true, message: '请上传企业LOGO' }]}
              extra="支持 jpg .jpeg .png 格式"
              icon={<UploadOutlined />}
              disabled={isEditMode} // 在编辑模式下禁用
            />
          </Col>
        </Row>
        <ProFormSelect
          name="industry"
          label="企业所属行业"
          valueEnum={{
            industry1: '工程和技术研究和试验发展(M7320)',
          }}
          rules={[{ required: true, message: '请选择企业所属行业' }]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <ProFormText
          name="socialCreditCode"
          label="统一社会信用代码"
          rules={[{ required: true, message: '请输入统一社会信用代码' }]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <ProFormText
          name="registeredAddress"
          label="企业注册地址"
          rules={[{ required: true, message: '请输入企业注册地址' }]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <ProFormText
          name="contactPhone"
          label="企业联系电话"
          rules={[
            { required: true, message: '请输入企业联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式' },
          ]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <ProFormText
          name="legalPersonName"
          label="法定代表人姓名"
          rules={[{ required: true, message: '请输入法定代表人姓名' }]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <ProFormText
          name="legalPersonId"
          label="法定代表人身份证号"
          rules={[
            { required: true, message: '请输入法定代表人身份证号' },
            {
              pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
              message: '请输入正确的身份证号格式',
            },
          ]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <Row gutter={16}>
          <Col span={12}>
            <ProFormUploadButton
              name="legalPersonIdFront"
              label="上传法人身份证像面"
              max={1}
              labelCol={{ span: 8 }}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
              }}
              rules={[{ required: true, message: '请上传法人身份证像面' }]}
              extra="支持 jpg .jpeg .png 格式"
              icon={<UploadOutlined />}
              disabled={isEditMode} // 在编辑模式下禁用
            />
          </Col>
          <Col span={12}>
            <ProFormUploadButton
              name="legalPersonIdBack"
              label="上传法人身份证国徽面"
              max={1}
              labelCol={{ span: 8 }}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
              }}
              rules={[{ required: true, message: '请上传法人身份证国徽面' }]}
              extra="支持 jpg .jpeg .png 格式"
              icon={<UploadOutlined />}
              disabled={isEditMode} // 在编辑模式下禁用
            />
          </Col>
        </Row>
      </Card>

      <Card title="填写联系人信息" variant="borderless" style={{ marginBottom: 24 }}>
        <ProFormText
          name="contactPersonName"
          label="联系人姓名"
          rules={[{ required: true, message: '请输入联系人姓名' }]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <ProFormText
          name="contactPersonId"
          label="联系人身份证号"
          rules={[
            { required: true, message: '请输入联系人身份证号' },
            {
              pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
              message: '请输入正确的身份证号格式',
            },
          ]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <Row gutter={16}>
          <Col span={12}>
            <ProFormUploadButton
              name="contactPersonIdFront"
              label="上传联系人身份证像面"
              max={1}
              labelCol={{ span: 8 }}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
              }}
              rules={[{ required: true, message: '请上传联系人身份证像面' }]}
              extra="支持 jpg .jpeg .png 格式"
              icon={<UploadOutlined />}
              disabled={isEditMode} // 在编辑模式下禁用
            />
          </Col>
          <Col span={12}>
            <ProFormUploadButton
              name="contactPersonIdBack"
              label="上传联系人身份证国徽面"
              max={1}
              labelCol={{ span: 8 }}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
              }}
              rules={[{ required: true, message: '请上传联系人身份证国徽面' }]}
              extra="支持 jpg .jpeg .png 格式"
              icon={<UploadOutlined />}
              disabled={isEditMode} // 在编辑模式下禁用
            />
          </Col>
        </Row>
        <ProFormText
          name="contactPersonPhone"
          label="联系人手机号"
          rules={[
            { required: true, message: '请输入联系人手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式' },
          ]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <ProFormText
          name="contactPersonEmail"
          label="联系人邮箱"
          rules={[
            { required: true, message: '请输入联系人邮箱' },
            { type: 'email', message: '请输入正确的邮箱格式' },
          ]}
          readonly={isEditMode} // 在编辑模式下只读
        />
        <ProFormUploadButton
          name="customerAuthDoc"
          label="上传客户授权书文件"
          max={1}
          fieldProps={{
            name: 'file',
          }}
          rules={[{ required: true, message: '请上传客户授权书文件' }]}
          extra="支持 .pdf 格式"
          icon={<UploadOutlined />}
          disabled={isEditMode} // 在编辑模式下禁用
        />
        <ProFormUploadButton
          name="supplementaryQualification"
          label="补充相关企业资质"
          max={1}
          fieldProps={{
            name: 'file',
          }}
          extra="支持 jpg .jpeg .png .pdf 格式"
          icon={<UploadOutlined />}
          disabled={isEditMode} // 在编辑模式下禁用
        />
      </Card>

      <Card title="填写 Chatbot 信息" variant="borderless">
        <ProFormText
          name="chatbotName"
          label="Chatbot 名称"
          rules={[{ required: true, message: '请输入Chatbot名称' }]}
        />
        <ProFormTextArea
          name="chatbotDescription"
          label="Chatbot 描述"
          rules={[{ required: true, message: '请输入Chatbot描述' }]}
        />
        <Row gutter={16}>
          <Col span={12}>
            <ProFormUploadButton
              name="chatbotLogo"
              label="上传 Chatbot LOGO"
              max={1}
              labelCol={{ span: 8 }}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
              }}
              rules={[{ required: true, message: '请上传Chatbot LOGO' }]}
              extra="大小不超过 2M"
              icon={<UploadOutlined />}
            />
          </Col>
        </Row>
        <ProFormText
          name="chatbotWebsite"
          label="Chatbot 官网"
          rules={[
            { required: true, message: '请输入Chatbot官网URL' },
            { type: 'url', message: '请输入正确的URL格式' },
          ]}
          extra="显示在 Chatbot 详情页中"
        />
        <ProFormText
          name="chatbotServiceTerms"
          label="Chatbot 服务条款地址"
          rules={[
            { required: true, message: '请输入Chatbot服务条款URL' },
            { type: 'url', message: '请输入正确的URL格式' },
          ]}
        />
        <ProFormText
          name="chatbotSignature"
          label="Chatbot 签名"
          rules={[{ required: true, message: '请输入Chatbot签名' }]}
          extra="设备不支持5G信息时，回落文本短信时使用"
        />
        <ProFormSelect
          name="chatbotIndustry"
          label="Chatbot 所属行业"
          valueEnum={{
            industry1: 'GB/T 4754-2017 《国民经济行业分类》',
          }}
          rules={[{ required: true, message: '请选择Chatbot所属行业' }]}
        />
        <ProFormText
          name="chatbotServicePhone"
          label="Chatbot 服务电话"
          rules={[
            { required: true, message: '请输入Chatbot服务电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式' },
          ]}
          extra="显示在 Chatbot 详情页中"
        />
        <ProFormText
          name="chatbotContactEmail"
          label="Chatbot 联系邮箱"
          rules={[
            { required: true, message: '请输入Chatbot联系邮箱' },
            { type: 'email', message: '请输入正确的邮箱格式' },
          ]}
          extra="显示在 Chatbot 详情页中"
        />
        <ProFormText
          name="chatbotOfficeAddress"
          label="Chatbot 办公地址"
          rules={[{ required: true, message: '请输入Chatbot办公地址' }]}
          extra="显示在 Chatbot 详情页中"
        />
        <ProFormText
          name="chatbotLongitude"
          label="Chatbot 地理经度"
          rules={[
            { required: true, message: '请输入Chatbot地理经度' },
            { type: 'number', min: 0, max: 180, message: '经度范围为0-180' },
          ]}
          extra={<Typography.Link>地图选址</Typography.Link>}
        />
        <ProFormText
          name="chatbotLatitude"
          label="Chatbot 地理纬度"
          rules={[
            { required: true, message: '请输入Chatbot地理纬度' },
            { type: 'number', min: 0, max: 90, message: '纬度范围为0-90' },
          ]}
          extra="提供位置服务使用"
        />
      </Card>
    </ProForm>
  );
};

export default ChatbotForm;
