// import SelectSceneId from '@/components/SelectScencId';
import SelectScencIdModal from '@/components/SelectScencIdModal';
import { Button, Flex, Input, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { PopulationDataProps } from '../../../context';
export default function SelectScene(props: {
  parames: PopulationDataProps;
  onChange: (value: any[]) => void;
}) {
  const { parames } = props;
  const [showScencIdModal, setShowScencIdModal] = useState(false);
  const [value, setValue] = useState(parames.scene.join(','));
  const [valueArea, setValueArea] = useState('');
  const [batchShow, setBatchShow] = useState(false);

  const cacheValueRef = useRef('');

  useEffect(() => {
    props.onChange(value.split(',').filter((item) => item));
  }, [value]);
  return (
    <Flex style={{ marginTop: 12 }} gap={12}>
      <Input
        value={value}
        style={{ width: 280 }}
        onChange={(e) => {
          setValue(e.target.value);
          cacheValueRef.current = e.target.value;
          setValueArea(e.target.value.replaceAll(',', '\n'));
        }}
        placeholder="请输入场景ID"
      ></Input>
      <Flex gap={8}>
        <Button
          type="primary"
          ghost
          onClick={() => {
            setBatchShow(true);
            setValueArea(value.replaceAll(',', '\n'));
          }}
        >
          批量输入
        </Button>
        <Button
          type="primary"
          ghost
          onClick={() => {
            setShowScencIdModal(true);
          }}
        >
          选择场景
        </Button>
        {/* <SelectSceneId
          trigger={
            <Button type="primary" ghost>
              选择场景
            </Button>
          }
          title="选择场景ID"
          value={value
            .split(',')
            .map((info) => Number(info))
            .filter((item) => item !== 0)}
          onChange={(key: any[]) => {
            setValue(key.join(','));
          }}
        /> */}
      </Flex>

      {showScencIdModal && (
        <SelectScencIdModal
          open={showScencIdModal}
          onCancel={() => setShowScencIdModal(false)}
          onOk={(data) => {
            setShowScencIdModal(false);
            setValue(data.map((item) => item.poi_id).join(','));
          }}
        />
      )}
      {batchShow && (
        <Modal
          maskClosable={false}
          width={520}
          className="do-com-modal"
          open
          title="批量输入场景ID"
          onCancel={() => {
            setBatchShow(false);
            setValueArea('');
          }}
          onOk={() => {
            const str = valueArea
              .split('\n')
              .map((item) => item.trim())
              .filter((item) => item)
              .join(',');
            setValue(str);
            setBatchShow(false);
            setValueArea('');
          }}
        >
          <Input.TextArea
            value={valueArea}
            onChange={(e) => {
              setValueArea(e.target.value);
            }}
            style={{
              height: 228,
              marginBottom: 20,
              borderColor: 'rgba(0,0,0,0.15)',
            }}
            placeholder={`每一行为一个场景ID，多个ID用换行区分，例如：
11177392
11177393
11177394`}
          ></Input.TextArea>
        </Modal>
      )}
    </Flex>
  );
}
