import {
  queryPriceDetails,
  updatePriceDetails,
} from '@/services/consumptionDetails/priceManagement';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, Descriptions, Form, InputNumber, message } from 'antd'; // 引入 Row 和 Col
import React, { useEffect, useState } from 'react';

// 定义价格详情的数据结构
interface PriceDetails {
  accountUID: string;
  phoneNumber: string;
  enterpriseName: string;
  userRole: string;
  dataServices: {
    generalDataPrice: number;
    accurateDataPrice: number;
  };
  marketingServices: {
    fiveGMessagePrice: number;
    textMessagePrice: number;
  };
}

const SetPrice: React.FC = () => {
  const { accountUID } = useParams<{ accountUID: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<PriceDetails | undefined>(undefined);

  useEffect(() => {
    if (accountUID) {
      setLoading(true);
      queryPriceDetails(accountUID)
        .then((res) => {
          if (res.success && res.data) {
            const data = res.data;
            setInitialValues(data);
            form.setFieldsValue({
              generalDataPrice: data.dataServices.generalDataPrice,
              accurateDataPrice: data.dataServices.accurateDataPrice,
              fiveGMessagePrice: data.marketingServices.fiveGMessagePrice,
              textMessagePrice: data.marketingServices.textMessagePrice,
            });
          } else {
            message.error(res.message || '获取价格详情失败');
            history.back(); // 获取失败则返回上一页
          }
        })
        .catch((error) => {
          message.error('获取价格详情异常：' + error.message);
          history.back(); // 获取异常则返回上一页
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      message.error('缺少账号UID，无法设置价格');
      history.back(); // 缺少UID则返回上一页
    }
  }, [accountUID, form]);

  // 处理表单提交
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const params: API.PriceUpdateParams = {
        accountUID: accountUID!,
        dataServices: {
          generalDataPrice: values.generalDataPrice,
          accurateDataPrice: values.accurateDataPrice,
        },
        marketingServices: {
          fiveGMessagePrice: values.fiveGMessagePrice,
          textMessagePrice: values.textMessagePrice,
        },
      };
      const res = await updatePriceDetails(params);
      if (res.success) {
        message.success('价格设置成功');
        history.back(); // 返回上一页
      } else {
        message.error(res.message || '价格设置失败');
      }
    } catch (error: any) {
      message.error('价格设置异常：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const onCancel = () => {
    history.back(); // 返回上一页
  };

  return (
    <PageContainer title={false}>
      <ProCard title="账户信息" style={{ marginBottom: 24 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="手机号码">{initialValues?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="企业名称">{initialValues?.enterpriseName}</Descriptions.Item>
          <Descriptions.Item label="用户角色">{initialValues?.userRole}</Descriptions.Item>
        </Descriptions>
      </ProCard>

      <Form
        form={form}
        onFinish={onFinish}
        initialValues={initialValues} // 设置初始值
        disabled={loading} // 加载时禁用表单
        labelCol={{
          style: {
            width: '150px', // 调整label宽度
          },
        }}
        wrapperCol={{ span: 18 }} // 调整输入框宽度
      >
        <ProCard title="数据服务" style={{ marginBottom: 24 }}>
          <Form.Item
            label="及刻数据 泛数据"
            name="generalDataPrice"
            // rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              addonAfter="元 / 个号码"
              style={{ width: 'unset', maxWidth: 200 }}
            />
          </Form.Item>
          <Form.Item
            label="及刻数据 精准数据"
            name="accurateDataPrice"
            // rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              addonAfter="元 / 个号码"
              style={{ width: 'unset', maxWidth: 200 }}
            />
          </Form.Item>
        </ProCard>

        <ProCard title="营销服务" style={{ marginBottom: 24 }}>
          <Form.Item
            label="富信 5G消息"
            name="fiveGMessagePrice"
            // rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              addonAfter="元 / 条"
              style={{ width: 'unset', maxWidth: 200 }}
            />
          </Form.Item>
          <Form.Item
            label="富信 文本短信"
            name="textMessagePrice"
            // rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              addonAfter="元 / 条"
              style={{ width: 'unset', maxWidth: 200 }}
            />
          </Form.Item>
        </ProCard>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            变更保存
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </div>
      </Form>
    </PageContainer>
  );
};

export default SetPrice;
