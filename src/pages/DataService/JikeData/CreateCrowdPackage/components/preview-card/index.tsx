import { Dropdown, Flex, Popconfirm, Space, Steps, Typography } from 'antd';
import { useEffect, useState } from 'react';
import {
  FenceItem,
  FormParamsProps,
  defaultParams,
  population_type_text,
  relation_type_text,
  useFormParams,
} from '../../context';
import { CrowdTag, TagItemProps } from '../modal-tag';
import './index.less';

// 空组件
const EmptyCompe = () => (
  <Flex className="rule-item empty" align="center" justify="center" style={{ height: 170 }}>
    <Flex vertical>
      <img src={require('@/assets/common/empty.png')}></img>
      请在左侧面板编辑规则
    </Flex>
  </Flex>
);

// 信息组件
const InfoCompe = (props: { data: FormParamsProps; index: number }) => {
  const { params, setParams } = useFormParams();
  const { data } = props;
  const extension_info = data.extension_info || {};
  const [expanded, setExpanded] = useState(false);

  // 取数时段
  const time_frame: string[] = extension_info.time_frame
    ? extension_info.time_frame
        .map((item) => {
          if (item.start && item.end) {
            return (item.start + '~' + item.end) as string;
          }
          return '';
        })
        .filter((item) => item !== '')
    : [];

  useEffect(() => {
    console.log('params', params);
  }, [params]);
  return (
    <Flex vertical className="rule-item" gap={12} style={{ paddingBottom: 0 }}>
      {data.dates.length === 2 && (
        <Flex justify="space-between">
          <span className="info-title">时间范围</span>
          <span className="info-content">{data.dates.join(' ~ ')}</span>
        </Flex>
      )}
      {data.population_data?.scene.length > 0 && (
        <Flex justify="space-between">
          <span className="info-title">场景ID</span>
          <span className="info-content">
            <Typography.Paragraph
              style={{
                marginBottom: 0,
              }}
              ellipsis={{
                rows: 2,
                expandable: 'collapsible',
                expanded,
                onExpand: (_, info) => setExpanded(info.expanded),
              }}
            >
              {data.population_data?.scene?.join('、')}
            </Typography.Paragraph>
          </span>
        </Flex>
      )}
      {(data.population_data?.fence.circle.length > 0 ||
        data.population_data?.fence.polygon.length > 0 ||
        data.population_data?.shop.length > 0) && ( // 添加 shop 长度判断
        <Flex justify="space-between">
          <span className="info-title">地理围栏</span>
          <span className="info-content">
            <Typography.Paragraph
              style={{
                marginBottom: 0,
              }}
              ellipsis={{
                rows: 2,
                expandable: 'collapsible',
                expanded,
                onExpand: (_, info) => setExpanded(info.expanded),
              }}
            >
              {[
                ...(data.population_data?.fence.circle || []),
                ...(data.population_data?.fence.polygon || []),
                ...(data.population_data?.shop || []),
              ]
                .map((item: FenceItem) => {
                  if ('name' in item && item.name) {
                    return item.name;
                  }
                  if ('info' in item && item.info?.title) {
                    return item.info.title;
                  }
                  return '';
                })
                .filter((item) => item !== '')
                .join('、')}
            </Typography.Paragraph>
          </span>
        </Flex>
      )}

      {data.population_type?.length > 0 && (
        <Flex justify="space-between">
          <span className="info-title">人群类型</span>
          <span className="info-content">
            {data?.population_type?.map((item) => population_type_text[item]).join('、')}
          </span>
        </Flex>
      )}
      {extension_info.time_frame?.length > 0 && extension_info.time_frame[0].start && (
        <Flex justify="space-between">
          <span className="info-title">取数时段</span>
          <Flex vertical className="info-content">
            {time_frame.map((item: string) => (
              <div key={item}>{item}</div>
            ))}
          </Flex>
        </Flex>
      )}
      {(extension_info.remain_minute?.min || extension_info.remain_minute?.max) && (
        <Flex justify="space-between">
          <span className="info-title">停留时长</span>
          <span className="info-content">
            {extension_info.remain_minute?.min}min ~ {extension_info.remain_minute?.max}min
          </span>
        </Flex>
      )}
      {(extension_info.visit_day?.min || extension_info.visit_day?.max) && (
        <Flex justify="space-between">
          <span className="info-title">到访天数</span>
          <span className="info-content" style={{ textAlign: 'end' }}>
            {extension_info.visit_day?.min}天 ~ {extension_info.visit_day?.max}天
          </span>
        </Flex>
      )}
      {data.tagData.length > 0 && (
        <Flex justify="space-between">
          <span className="info-title">标签数量</span>
          <span className="info-content">{data.tagData.length}个</span>
        </Flex>
      )}

      <Flex style={{ paddingBottom: 12 }}>
        <CrowdTag
          data={data.tagData}
          setData={(info: TagItemProps[]) => {
            const index = props.index;
            let data = params[props.index];
            params[index] = { ...data, tagData: info };
            setParams([...params]);
          }}
        />
      </Flex>
    </Flex>
  );
};

interface ProgressDotProps {
  index: number;
  data: FormParamsProps;
}

const ProgressDot = ({ index, data }: ProgressDotProps) => {
  const { params, setParams } = useFormParams();
  return (
    <Flex>
      {index !== 0 && (
        <div className="progressdot-type">
          <span className="step-icon-wrap">
            <img src={require('@/assets/common/step_icon.png')} alt="" />
          </span>
          <Dropdown
            className="do-progressdot-dropdown"
            menu={{
              items: [
                {
                  key: 'AND',
                  label: '并集',
                  onClick() {
                    const list = [...params];
                    list[index].relation_type = 'AND';
                    setParams([...params]);
                  },
                },
                {
                  key: 'OR',
                  label: '交集',
                  onClick() {
                    const list = [...params];
                    list[index].relation_type = 'OR';
                    setParams([...params]);
                  },
                },
                {
                  key: 'FILTER',
                  label: '排除',
                  onClick() {
                    const list = [...params];
                    list[index].relation_type = 'FILTER';
                    setParams([...params]);
                  },
                },
              ],
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {data.relation_type ? relation_type_text[data.relation_type] : '选择关系'}
                <img src={require('@/assets/common/down_icon.png')} alt="" />
              </Space>
            </a>
          </Dropdown>
        </div>
      )}

      <div className="progressdot-circle"></div>
    </Flex>
  );
};

interface TitleProps {
  index: number;
  handleDlete: () => void;
}

const Title = ({ index, handleDlete }: TitleProps) => {
  return (
    <Flex>
      {`人群规则${index + 1}`}
      <Popconfirm
        title="提示"
        className="do-preview-popconfirm"
        description="确定删除？此操作不可逆 "
        onConfirm={handleDlete}
      >
        {index !== 0 && <span className="iconfont delete-btn">&#xe6a4;</span>}
      </Popconfirm>
    </Flex>
  );
};
export default function PreviewCard() {
  useEffect(() => {}, []);
  const { params, setParams, setActiveKey } = useFormParams();

  const handleDlete = (index: number) => {
    const list = [...params].filter((item, idx) => idx !== index);
    setParams(list);
    setActiveKey(list.length - 1);
  };

  const handleAdd = (relation_type: string) => {
    const lsit = [...params];
    const data = JSON.parse(JSON.stringify(defaultParams));
    data.relation_type = relation_type;
    lsit.push(data);
    setParams(lsit);
    // 打开最新人群规则卡片
    setActiveKey(lsit.length - 1);
  };

  return (
    <div className="do-page-previewcard">
      <Steps
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        progressDot={(dot, { status, index }) => {
          return <ProgressDot data={params[index]} index={index}></ProgressDot>;
        }}
        current={params.length + 1}
        direction="vertical"
        items={params.map((item, index) => {
          const oldData = JSON.parse(JSON.stringify(defaultParams));
          const newData = JSON.parse(JSON.stringify(item));
          delete oldData.relation_type;
          delete newData.relation_type;
          delete newData.crowd_type;
          delete oldData.crowd_type;
          const isEmpty = JSON.stringify(oldData) === JSON.stringify(newData);
          return {
            title: (
              <Title
                handleDlete={() => {
                  handleDlete(index);
                }}
                index={index}
              />
            ),
            description: isEmpty ? <EmptyCompe /> : <InfoCompe index={index} data={item} />,
          };
        })}
      />
      <div className="rule-item add-fn">
        <div className="title">添加并选择规则之间的关系</div>
        <Flex justify="space-around" gap={8}>
          <Flex
            align="center"
            justify="center"
            onClick={() => {
              handleAdd('AND');
            }}
            className="add-fn-item"
          >
            <img src={require('@/assets/common/task_icon1.png')} />
            并集
          </Flex>
          <Flex
            onClick={() => {
              handleAdd('OR');
            }}
            align="center"
            justify="center"
            className="add-fn-item"
          >
            <img src={require('@/assets/common/task_icon2.png')} />
            交集
          </Flex>
          <Flex
            onClick={() => {
              handleAdd('FILTER');
            }}
            align="center"
            justify="center"
            className="add-fn-item"
          >
            <img src={require('@/assets/common/task_icon3.png')} />
            排除
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
