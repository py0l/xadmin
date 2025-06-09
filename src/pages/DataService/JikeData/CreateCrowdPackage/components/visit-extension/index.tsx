import { CloseCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import { Flex, Form, InputNumber, TimePicker, message } from 'antd';
import { FormParamsProps } from '../../context';

// 到访人群扩展条件
export default function VisitExtension(props: {
  mode?: 'marketing-map'; // 渲染类型 - 营销地图
  parames: FormParamsProps;
  changeParames: (type: string, value: any) => void;
}) {
  const { parames, changeParames } = props;
  // 取数时段数量限制
  const max_time_frame_count = 5;

  // 添加时间段
  const handleAddTimeFrame = () => {
    let simpleID = 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const extension_info = parames.extension_info;
    const lastData = extension_info.time_frame[extension_info.time_frame.length - 1];
    const idx = extension_info.time_frame!.length + 1;
    if (idx > max_time_frame_count) {
      message.info('最多可设置5时间段');
      return;
    }
    if ((lastData && !lastData.start) || !lastData.end) {
      message.info('请先设置取数时段');
      return;
    }
    changeParames('extension_info', {
      ...extension_info,
      time_frame: [
        ...extension_info.time_frame!,
        {
          id: simpleID,
          start: '',
          end: '',
        },
      ],
    });
  };

  return (
    <>
      {/* 取数时段 */}
      {parames.population_type.includes('VISITED') && (
        <>
          <Form.Item label="" style={{ marginLeft: props.mode ? 18 : 74 }}>
            <Flex vertical align="flex-start" gap={0}>
              {parames?.extension_info?.time_frame.map((item, index) => {
                const isFirst = index === 0;
                return (
                  <Flex
                    align="center"
                    justify="flex-end"
                    gap={props.mode ? 7 : 11}
                    className="do-form-item"
                    key={item.id}
                    style={{ marginBottom: 8 }}
                  >
                    <div style={{ width: 56 }}> {isFirst && '取数时段'}</div>
                    <TimePicker.RangePicker
                      style={{
                        height: 32,
                        width: 280,
                        marginLeft: props.mode ? 4 : isFirst ? 5 : 5,
                        // marginLeft: props.mode ? 4 : isFirst ? 5 : 71,
                      }}
                      onChange={(datas) => {
                        const extension_info = parames.extension_info;
                        const info: any = {
                          ...extension_info,
                          time_frame: [...extension_info.time_frame!],
                        };
                        console.log('datas', datas);
                        if (datas && datas.length === 2) {
                          info.time_frame[index] = {
                            ...info.time_frame[index],
                            start: datas[0]?.format('HH:mm'),
                            end: datas[1]?.format('HH:mm'),
                          };
                          changeParames('extension_info', info);
                        } else if (datas === null) {
                          info.time_frame[index] = {
                            ...info.time_frame[index],
                            start: '',
                            end: '',
                          };
                          changeParames('extension_info', info);
                        }
                      }}
                      format={'HH:mm'}
                      suffixIcon={false}
                    />
                    {isFirst ? (
                      // eslint-disable-next-line react/jsx-no-undef
                      <div
                        onClick={handleAddTimeFrame}
                        style={{ color: 'var(--color-primary)', cursor: 'pointer' }}
                        className="time-picker"
                      >
                        <PlusCircleFilled style={{ marginRight: 4 }} />
                        {props.mode ? '' : '继续添加'}
                      </div>
                    ) : (
                      <CloseCircleFilled
                        style={{ fontSize: 16, color: 'rgba(2, 4, 13, 0.45)' }}
                        onClick={() => {
                          const extension_info = parames.extension_info;
                          const time_frame = extension_info.time_frame.filter(
                            (info, idx) => idx !== index,
                          );
                          console.log('time_frame', time_frame);
                          changeParames('extension_info', {
                            ...extension_info,
                            time_frame: time_frame,
                          });
                        }}
                      />
                    )}
                  </Flex>
                );
              })}

              <Flex
                align="center"
                gap={props.mode ? 7 : 11}
                style={{ marginTop: 12 }}
                className="do-form-item"
              >
                <div style={{ width: 56 }}>停留时长</div>
                <InputNumber
                  placeholder="最小分钟"
                  min={0}
                  value={Number(parames.extension_info.remain_minute?.min)}
                  style={{
                    height: 32,
                    width: props.mode ? 124 : 121,
                    marginLeft: 5,
                  }}
                  onChange={(value) => {
                    const extension_info = parames.extension_info;
                    changeParames('extension_info', {
                      ...extension_info,
                      remain_minute: {
                        ...extension_info.remain_minute,
                        min: value?.toString(),
                      },
                    });
                  }}
                />
                <div className="split-line"></div>
                <InputNumber
                  placeholder="最大分钟"
                  min={0}
                  value={Number(parames.extension_info.remain_minute?.max)}
                  style={{ height: 32, width: props.mode ? 125 : 121 }}
                  onChange={(value) => {
                    const extension_info = parames.extension_info;
                    changeParames('extension_info', {
                      ...extension_info,
                      remain_minute: {
                        ...extension_info.remain_minute,
                        max: value?.toString(),
                      },
                    });
                  }}
                />
              </Flex>
              <Flex
                align="center"
                gap={props.mode ? 7 : 11}
                style={{ marginBottom: 0, marginTop: 12 }}
                className="do-form-item"
              >
                <div style={{ width: 56 }}>到访天数</div>
                <InputNumber
                  placeholder="最小天数"
                  min={0}
                  value={Number(parames.extension_info.visit_day?.min)}
                  style={{
                    height: 32,
                    width: props.mode ? 124 : 121,
                    marginLeft: 5,
                  }}
                  onChange={(value) => {
                    const extension_info = parames.extension_info;
                    changeParames('extension_info', {
                      ...extension_info,
                      visit_day: {
                        ...extension_info.visit_day,
                        min: value?.toString(),
                      },
                    });
                  }}
                />
                <div className="split-line"> </div>
                <InputNumber
                  placeholder="最大天数"
                  value={Number(parames.extension_info.visit_day?.max)}
                  style={{ height: 32, width: props.mode ? 125 : 121 }}
                  min={0}
                  onChange={(value) => {
                    const extension_info = parames.extension_info;
                    changeParames('extension_info', {
                      ...extension_info,
                      visit_day: {
                        ...extension_info.visit_day,
                        max: value?.toString(),
                      },
                    });
                  }}
                />
              </Flex>
            </Flex>
          </Form.Item>
        </>
      )}
    </>
  );
}
