import { Checkbox, Flex } from 'antd';
import React from 'react';
import { SelectPoiProps } from './index';
import './index.less';

const CheckoutLabelComponent: React.FC<{
  data: SelectPoiProps;
  onChange: (checked: boolean) => void;
  checked?: boolean;
  disable?: boolean;
}> = ({ data, checked, onChange, disable }) => {
  const title = data.name;

  return (
    <div className="do-infoWindow-wrap">
      <div className="list">
        <Flex className="list__item">
          {data.disable ? (
            <span className="title">{title}</span>
          ) : (
            <Checkbox
              disabled={disable || data.disable}
              defaultChecked={checked}
              style={{ marginRight: 8 }}
              onChange={(e) => {
                onChange(e.target.checked);
                // Handle checkbox change
              }}
            >
              <span className="title">{title}</span>
            </Checkbox>
          )}
        </Flex>
      </div>
    </div>
  );
};
export default CheckoutLabelComponent;
