import { Flex, message } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import './index.less';

// 地图数据
export default forwardRef(function MapDataToggle(
  props: {
    onChange: (data: any[]) => void;
    onChangeActive: (data: 'circle' | 'polygon') => void;
    defaultValue: any[];
    selectLen: number;
  },
  ref,
) {
  const [active, setActive] = useState('');

  useImperativeHandle(ref, () => ({
    setInitActiveValue: () => {
      setActive('');
    },
  }));

  const list = [
    {
      img: require('@/assets/tool-fence/circle.png'),
      label: '画圆形',
      value: 'circle',
    },
    {
      img: require('@/assets/tool-fence/polygon.png'),
      label: '画多边形',
      value: 'polygon',
    },
  ];

  return (
    <>
      <div className="map-data-wrapper">
        <Flex className="do-fence-toggle" align="center">
          {list.map((item) => {
            return (
              <Flex
                align="center"
                gap={2}
                className={`do-fence-toggle-item ${item.value === active && 'active'}`}
                key={item.value}
                onClick={() => {
                  if (props.selectLen >= 10000) {
                    message.info('最多只能选择10000个对象查询');
                    return;
                  }
                  setActive(item.value);
                  props.onChangeActive(item.value as 'circle' | 'polygon');
                }}
              >
                <img src={item.img}></img>
                <span>{item.label}</span>
              </Flex>
            );
          })}
          {/* <div
            className={`do-fence-toggle-item data-wrap-item`}
            onClick={() => {
              setShowToggle(!showToggle);
            }}
          >
            显示数据
            <span className={`iconfont ${!showToggle && 'rote-down'}`}>
              &#xe6a5;
            </span>
          </div> */}
        </Flex>

        {/* {showToggle && (
          <Flex gap={14} vertical className="toggle-card">
            {options.map((item) => (
              <Flex
                key={item.value}
                className="toggle-card-item"
                justify="space-between"
                align="center"
              >
                <Flex align="center" gap={4}>
                  <img src={item.img}></img>
                  <span>{item.label}</span>
                </Flex>
                <Switch
                  checked={values.includes(item.value)}
                  onChange={(bol) => {
                    let data = [];
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    bol
                      ? (data = [...values, item.value])
                      : (data = values.filter((info) => info !== item.value));
                    setValues(data);
                    props.onChange(data);
                  }}
                ></Switch>
              </Flex>
            ))}
          </Flex>
        )} */}
      </div>
    </>
  );
});
