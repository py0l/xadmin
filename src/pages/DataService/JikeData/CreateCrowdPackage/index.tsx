import { useNavigate } from '@umijs/max';
import { Button, Checkbox, DatePicker, Flex, Form, Input, message, Select } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useRef, useState } from 'react';
import PreviewCard from './components/preview-card';
import CrowdcardForm from './components/task-card';
import {
  CustomDaysOption,
  FormParamsProvider,
  TaskTypeOptions,
  transfromParames,
  useFormParams,
} from './context';
import './index.less';

interface CrowdcardFormRef {
  validate: () => Promise<boolean>;
}

export function CreateTask() {
  const [form] = Form.useForm();
  // 任务类型
  const [taskSelect, setTaskSelect] = useState(1);
  const { params } = useFormParams();
  const navigate = useNavigate();
  // 自定义天
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs().subtract(1, 'day'),
  ]);
  const crowdFormRef = useRef<CrowdcardFormRef>(null);

  const handleSubmit = async () => {
    try {
      const formData = await form.validateFields();
      // 自定义任务类型
      if (formData.type === 6) {
        if (customDays.length === 0) {
          message.info('请选择自定义时间');
          return;
        }
      }

      // 验证人群规则表单
      const isValid = await crowdFormRef.current?.validate();
      if (!isValid) {
        return;
      }

      const data: any = {
        name: formData.name, // 人群包名称
        payment_type: formData.payment_type, // 外呼结算类型
        type: formData.type, // 任务类型
        start: formData.dates[0]?.format('YYYY-MM-DD'),
        end: formData.dates[1]?.format('YYYY-MM-DD'),
      };
      // 自定义任务类型 - 选择日期
      if (formData.type === 6) data.ext = customDays; // 自定义日期

      data.task_conditions = params.map((item) => transfromParames(item));
      // TODO: 实现创建API调用
      message.success('创建成功');

      console.log('data', data);
    } catch (error) {
      console.error('Failed to create:', error);
      message.error('创建失败');
    }
  };

  return (
    <div className="do-page-createtask">
      <Flex gap={20} style={{ margin: 0, overflow: 'auto', overflowX: 'hidden' }}>
        <div className="left-wrap">
          <Form
            colon={false}
            form={form}
            className="do-crowd-form-wrap"
            style={{ maxWidth: 'inline' }}
            initialValues={{
              payment_type: 0,
              type: taskSelect,
              dates: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
            }}
          >
            <Form.Item
              label=" 人群包名称"
              required
              name="name"
              style={{ marginRight: 30 }}
              rules={[
                {
                  required: true,
                  message: '请输入人群包名称',
                },
              ]}
            >
              <Input style={{ width: 265 }} placeholder="请输入人群包名称" />
            </Form.Item>
            <div className="form-item-wrapp">
              <Form.Item
                required
                rules={[{ required: true, message: '请选择日期' }]}
                label={'查询时间范围'}
                name={'dates'}
              >
                <DatePicker.RangePicker
                  disabledDate={(current) => {
                    if (!current) return false;
                    const prevDay = dayjs().subtract(1, 'day');
                    return (
                      current.isAfter(prevDay) || current.isBefore(prevDay.subtract(180, 'days'))
                    );
                  }}
                  style={{ width: 265 }}
                  value={dates}
                  onChange={(info) => {
                    if (info && info.length === 2) {
                      setDates([info[0]!, info[1]!]);
                    } else {
                      setDates([dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')]);
                    }
                  }}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item label="任务类型" required name="type" style={{ margin: '0 0 0 0' }}>
                <Select
                  style={{ width: 265 }}
                  onChange={(value) => {
                    setTaskSelect(value);
                  }}
                  options={TaskTypeOptions}
                />
              </Form.Item>
              {taskSelect === 6 && (
                <div className="tip-settle">
                  请选择要查询星期数
                  <div>
                    <Checkbox.Group
                      style={{ marginTop: 8 }}
                      value={customDays}
                      options={CustomDaysOption}
                      onChange={(value) => {
                        setCustomDays(value);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <CrowdcardForm ref={crowdFormRef} customDays={customDays} form={form}></CrowdcardForm>
            <Flex justify="flex-end" style={{ marginTop: 20 }}>
              <Button
                onClick={() => {
                  navigate(-1);
                }}
              >
                返回
              </Button>
              <Button htmlType="submit" onClick={handleSubmit} type="primary">
                提交任务
              </Button>
            </Flex>
          </Form>
        </div>
        <div className="right-wrap">
          <PreviewCard></PreviewCard>
        </div>
      </Flex>
    </div>
  );
}

export default function CreateTaskPage() {
  return (
    <FormParamsProvider>
      <CreateTask />
    </FormParamsProvider>
  );
}
