import { Form, Input, Select } from 'antd';
import React from 'react';

const { TextArea } = Input;

interface BasicInfoProps {
  form: any;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ form }) => {
  return (
    <div>
      <h2>基础信息</h2>
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="模板名称"
          rules={[{ required: true, message: '请输入模板名称' }]}
        >
          <Input placeholder="请输入模板名称" />
        </Form.Item>
        <Form.Item name="type" label="模板类型">
          <Select placeholder="请选择模板类型" options={[{ label: '富媒体', value: 'rich' }]} />
        </Form.Item>
        <Form.Item
          name="fallbackContent"
          label="短信回落"
          extra="内容无需带签名和后缀，链接前后需加空格"
        >
          <TextArea
            placeholder="请输入短信回落内容"
            autoSize={{ minRows: 4, maxRows: 6 }}
            showCount
            maxLength={500}
          />
        </Form.Item>
        <Form.Item name="signature" label="短信签名" extra="默认使用Chatbot相关联的签名">
          <Input disabled />
        </Form.Item>
        <Form.Item name="suffix" label="短信后缀">
          <Select placeholder="请选择短信后缀" options={[{ label: '拒收请回复 R', value: 'R' }]} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default BasicInfo;
