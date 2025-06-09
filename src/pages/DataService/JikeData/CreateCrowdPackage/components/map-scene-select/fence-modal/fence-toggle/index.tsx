import { Flex } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import './index.less';

// 地图数据
export default forwardRef(function MapDataToggle(
  props: {
    onChange: (data: 'circle' | 'polygon') => void;
  },
  ref,
) {
  const [value, setValue] = useState('');
  const options = [
    {
      img: require('@/assets/map-data/fence_cir.png'),
      label: '画圆形',
      value: 'circle',
    },
    {
      img: require('@/assets/map-data/fence_pl.png'),
      label: '画多边形',
      value: 'polygon',
    },
  ];

  useImperativeHandle(ref, () => ({
    setInitActiveValue: () => {
      setValue('newValue');
    },
  }));

  return (
    <>
      <Flex className="do-fence-toggle" align="center">
        {options.map((item) => {
          return (
            <Flex
              align="center"
              gap={2}
              className={`do-fence-toggle-item ${item.value === value && 'active'}`}
              key={item.value}
              onClick={() => {
                setValue(item.value);
                props.onChange(item.value as 'circle' | 'polygon');
              }}
            >
              <img src={item.img}></img>
              <span>{item.label}</span>
            </Flex>
          );
        })}
      </Flex>
    </>
  );
});
