/* eslint-disable no-useless-escape */
/* eslint-disable array-callback-return */
import { Button, ConfigProvider, Form, FormProps, Input, Select, Space } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import * as React from 'react';
import './index.less';

interface PolygonFormProps extends Omit<FormProps, 'form'> {
  onCancel?: () => void;
}

const layout: Pick<FormProps, 'labelAlign' | 'labelCol' | 'wrapperCol'> = {
  labelAlign: 'left',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const PolygonForm: React.FC<PolygonFormProps> = (props) => {
  const { initialValues, onFinish, onCancel, ...restProps } = props;
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues]);

  const handleCancel = () => {
    onCancel?.();
  };

  const handleSubmit = async () => {
    try {
      const res = await form.validateFields();
      onFinish?.(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="edit-polygon-form-wrapper">
        <Form
          form={form}
          {...layout}
          {...restProps}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          autoComplete="off"
        >
          <Form.Item name="id" hidden>
            <Input placeholder="请输入围栏名称" />
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="请输入围栏名称" />
          </Form.Item>
          <Form.Item
            name="lngLats"
            label="地理围栏"
            rules={[
              {
                required: true,
                validator(_, value: string) {
                  const lngLat = value.split('\n');
                  const lngLats = lngLat.map((item) => {
                    return item.split(',');
                  });
                  const flag = lngLats.every((item) => {
                    const flag = item.every((it) => {
                      return /^(\-|\+)?\d+(\.\d+)?$/.test(it);
                    });
                    if (item.length === 2 && flag) {
                      return true;
                    }
                  });
                  if (flag) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('坐标格式错误'));
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={`请输入经纬度坐标格式如下：
114.069418,22.5562
114.068733,22.555665
114.070142,22.555208`}
            />
          </Form.Item>
          <Form.Item name="coord" label="坐标系" rules={[{ required: true }]}>
            <Select placeholder="请选择坐标系">
              <Select.Option value="GCJ02">火星坐标系GCJ02</Select.Option>
              <Select.Option value="BD09">百度坐标系BD09</Select.Option>
              <Select.Option value="WGS84">地球坐标系WGS84</Select.Option>
            </Select>
          </Form.Item>
          <div className="submit-btn-wrapper">
            <Space size={50}>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" onClick={handleSubmit}>
                确定
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default PolygonForm;
