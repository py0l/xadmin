import { Button, ConfigProvider, Form, FormProps, Input, InputNumber, Select, Space } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import * as React from 'react';
import './index.less';

interface CircleFormProps extends Omit<FormProps, 'form'> {
  onCancel?: () => void;
}

const layout: Pick<FormProps, 'labelAlign' | 'labelCol' | 'wrapperCol'> = {
  labelAlign: 'left',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const CircleForm: React.FC<CircleFormProps> = (props) => {
  const { initialValues, onFinish, onCancel, ...restProps } = props;
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      const { center, ...restInit } = initialValues;
      if (center) {
        form.setFieldsValue({
          ...restInit,
          center: center.toString(),
        });
      } else {
        form.setFieldsValue(restInit);
      }
      // center
      //   ? form.setFieldsValue({
      //       ...restInit,
      //       center: center.toString(),
      //     })
      //   : form.setFieldsValue(restInit);
    }
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
      <div className="edit-circle-form-wrapper">
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
            name="center"
            label="圆中心"
            rules={[
              {
                required: true,
                validator(_, value: string) {
                  const latLng = value.split(',');
                  const flag = latLng.every((item) =>
                    // eslint-disable-next-line no-useless-escape
                    /^(\-|\+)?\d+(\.\d+)?$/.test(item),
                  );
                  if (latLng.length === 2 && flag) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('坐标格式错误'));
                },
              },
            ]}
          >
            <Input placeholder="请输入圆中心点的坐标" />
          </Form.Item>

          <Form.Item name="coord" label="坐标系" rules={[{ required: true }]}>
            <Select placeholder="请选择坐标系">
              <Select.Option value="GCJ02">火星坐标系GCJ02</Select.Option>
              <Select.Option value="BD09">百度坐标系BD09</Select.Option>
              <Select.Option value="WGS84">地球坐标系WGS84</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="radius" label="圆半径" rules={[{ required: true }]}>
            <InputNumber
              placeholder="请输入10-500的半径"
              style={{ width: '100%' }}
              min={10}
              max={500}
              precision={0}
              addonAfter="m"
              controls={false}
            />
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

export default CircleForm;
