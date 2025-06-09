// import { CreateTask } from '@/api/methods/marketing';
import { Collapse, Flex, Form, message, Radio } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { defaultParams, FormParamsProps, getPopulationOptions, useFormParams } from '../../context';
// import CrowdcardForm from '../form';
import MapSceneSelect from '../map-scene-select';
import SelectTag from '../select-tag';
import VisitExtension from '../visit-extension';
import './index.less';

export const TaskCardItem = forwardRef<
  TaskCardItemRef,
  {
    className?: string;
    parames: FormParamsProps;
    changeParames: (type: string, value: any) => void;
    mode?: 'marketing-map'; // 渲染类型 - 营销地图
    index?: number;
  }
>((props, ref) => {
  const { parames, mode } = props;
  const [form] = Form.useForm();
  const changeParames = (type: string, value: any) => {
    props.changeParames(type, value);
  };

  useEffect(() => {
    // 选择到访人群类型 - 清除取数时段数据
    if (
      !parames.population_type.includes('VISITED') &&
      parames.extension_info.time_frame[0].start
    ) {
      changeParames('extension_info', {
        ...JSON.parse(JSON.stringify(defaultParams.extension_info)),
      });
    }
  }, [parames.population_type]);

  useImperativeHandle(ref, () => ({
    rulesVerification() {
      const index = props.index !== undefined ? props.index + 1 : '';
      // if (parames.dates.length !== 2) {
      //   message.info(`请输入规则${index}查询时间范围`);
      //   return false;
      // }
      const populationData = parames.population_data;
      if (
        populationData.fence.circle.length === 0 &&
        populationData.fence.polygon.length === 0 &&
        populationData.scene.length === 0
      ) {
        message.info(`请选择规则${index}查询场景或区域`);
        return false;
      }
      if (parames.population_type.length === 0) {
        message.info(`请选择规则${index}人群类型`);
        return false;
      }
      const extensionInfo = parames.extension_info;
      const remain_minute = extensionInfo.remain_minute;
      if (remain_minute?.min && remain_minute.max && remain_minute?.min > remain_minute?.max) {
        if (index) message.info(`规则${index}停留时间最小分钟不能大于最大分钟`);
        else message.info(`停留时间最小分钟不能大于最大分钟`);
        return false;
      } else if (remain_minute?.min && !remain_minute?.max) {
        if (index) message.info(`规则${index}停留时间最小分钟不能大于最大分钟`);
        else message.info(`停留时长缺少最大分钟`);
        return false;
      } else if (!remain_minute?.min && remain_minute?.max) {
        message.info(`规则${index}停留时长缺少最小分钟`);
        return false;
      }
      const visitDay = extensionInfo.visit_day;
      if (visitDay?.min && visitDay.max && visitDay?.min > visitDay?.max) {
        if (index) message.info(`规则${index}到访天数最小天数不能大于最大天数`);
        else message.info(`到访天数最小天数不能大于最大天数`);
        return false;
      } else if (visitDay?.min && !visitDay?.max) {
        if (index) message.info(`规则${index}到访天数缺少最大天数`);
        else message.info(`到访天数缺少最大天数`);
        return false;
      } else if (!visitDay?.min && visitDay?.max) {
        if (index) message.info(`规则${index}到访天数缺少最小天数`);
        else message.info(`到访天数缺少最小天数`);
        return false;
      }
      return true;
    },
  }));

  return (
    <Form
      rootClassName={props.className}
      colon={false}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 17 }}
      form={form}
      layout="horizontal"
      className="do-com-crowdcard-form"
      style={{ width: mode ? 450 : 700 }}
    >
      {!mode && (
        <Form.Item required rules={[{ required: true }]} label="查询场景/区域">
          <MapSceneSelect parames={parames} changeParames={changeParames}></MapSceneSelect>
        </Form.Item>
      )}

      <Form.Item required rules={[{ required: true }]} label="人群类型">
        <Radio.Group
          onChange={(event) => {
            changeParames('population_type', [event.target.value]);
          }}
          value={parames.population_type?.[0]}
        >
          <Flex gap={12}>
            {getPopulationOptions().map((item) => (
              <Radio key={item.value} value={item.value} style={{ lineHeight: '32px' }}>
                {item.label}
              </Radio>
            ))}
          </Flex>
        </Radio.Group>
      </Form.Item>
      <VisitExtension mode={props.mode} parames={parames} changeParames={changeParames} />
      {!mode && (
        <Form.Item label="人群标签属性">
          <SelectTag parames={parames} changeParames={changeParames}></SelectTag>
        </Form.Item>
      )}
    </Form>
  );
});

interface CrowdcardFormRef {
  validate: () => Promise<boolean>;
}

interface TaskCardItemRef {
  rulesVerification: () => boolean;
}

const CrowdcardForm = forwardRef<CrowdcardFormRef, { form: any; customDays: any }>((props, ref) => {
  const { params, changeParames, activeKey, setActiveKey } = useFormParams();
  const formRefs = useRef<(TaskCardItemRef | null)[]>([]);

  // 确保 formRefs.current 数组的长度与 params 匹配
  useEffect(() => {
    formRefs.current = formRefs.current.slice(0, params.length);
    for (let i = formRefs.current.length; i < params.length; i++) {
      formRefs.current[i] = null; // 初始化为 null
    }
  }, [params.length]);

  useImperativeHandle(ref, () => ({
    // 验证检查参数
    validate: async () => {
      for (let i = 0; i < formRefs.current.length; i++) {
        const ref = formRefs.current[i];
        if (ref && !ref.rulesVerification()) {
          setActiveKey(i);
          return false;
        }
      }
      return true;
    },
  }));

  return (
    <div>
      <Collapse
        className="do-collapse-taskcarditem"
        expandIconPosition="end"
        bordered={false}
        activeKey={activeKey}
        onChange={(value) => {
          // Collapse 的 onChange 返回的 value 可能是 string 或 string[]
          // 根据 setActiveKey(i) 的用法，activeKey 应该是一个 number
          // 如果是多选模式，这里需要根据业务逻辑选择合适的 key
          if (Array.isArray(value)) {
            setActiveKey(value.length > 0 ? Number(value[0]) : 0); // 如果没有选中的面板，默认选中第一个
          } else {
            setActiveKey(Number(value));
          }
        }}
        items={params.map((item, index) => {
          return {
            key: index,
            label: '人群规则' + (index + 1),
            children: (
              <div>
                <TaskCardItem
                  ref={(ref) => {
                    formRefs.current[index] = ref;
                  }}
                  parames={params[index]}
                  index={index}
                  changeParames={(type: string, value: any) => {
                    changeParames({
                      index,
                      type,
                      value,
                    });
                  }}
                ></TaskCardItem>
              </div>
            ),
          };
        })}
      />
    </div>
  );
});

export default CrowdcardForm;
