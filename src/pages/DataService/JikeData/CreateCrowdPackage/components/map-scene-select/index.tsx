import { Button, Flex, Radio } from 'antd';
import { useCallback, useState } from 'react';
// import MapFenceModal from './fence-modal';
import { FormParamsProps, PopulationDataProps } from '../../context';
import MapFenceModal from './fence-modal';
import './index.less';
import SelectScene from './select-scene';
export default function MapSceneSelect(props: {
  parames: FormParamsProps;
  changeParames: (type: string, value: any) => void;
}) {
  const { parames, changeParames } = props;
  const [showFenceModal, setShowFenceModal] = useState(false);

  return (
    <>
      <Flex vertical className="do-com-maporscene">
        <Radio.Group
          value={parames.crowd_type}
          onChange={(e) => {
            changeParames('crowd_type', e.target.value);
          }}
        >
          <Radio.Button value="1">地理围栏</Radio.Button>
          <Radio.Button value="2"> 场景ID</Radio.Button>
        </Radio.Group>
        {parames.crowd_type === '1' ? (
          <Button
            style={{ width: 124, marginTop: 12 }}
            type="primary"
            ghost
            className="select-fence-btn"
            onClick={() => {
              setShowFenceModal(true);
            }}
          >
            圈选地理围栏
          </Button>
        ) : (
          <>
            <SelectScene
              onChange={(data) => {
                changeParames('population_data', {
                  ...parames.population_data,
                  scene: data,
                });
              }}
              parames={parames.population_data}
            ></SelectScene>
          </>
        )}

        {/* 围栏圈选 */}
        {showFenceModal && (
          <MapFenceModal
            changeParames={changeParames}
            parames={parames.population_data}
            onOk={(data) => {
              changeParames('population_data', {
                ...parames.population_data,
                ...data,
              });
              setShowFenceModal(false);
            }}
            close={() => {
              setShowFenceModal(false);
            }}
          />
        )}
      </Flex>

      <Flex vertical>
        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
        <MaporsceneTag
          data={parames.population_data}
          setData={(data) => {
            changeParames('population_data', data);
          }}
        ></MaporsceneTag>
      </Flex>
    </>
  );
}

export function MaporsceneTag(props: {
  data: PopulationDataProps;
  setData: (data: PopulationDataProps) => void;
}) {
  const TagItem = useCallback((props: { item: any; close: () => void }) => {
    const { item, close } = props;
    return (
      <div>
        <Flex className="crowd-tag-item">
          {item.name || item?.info?.title}
          <span className="iconfont" onClick={close}>
            &#xe6b8;
          </span>
        </Flex>
      </div>
    );
  }, []);

  return (
    <div className="do-com-maporscenetag">
      {props.data.fence?.circle.length > 0 || props.data.fence?.polygon.length > 0 ? (
        <div className="tip">已选围栏</div>
      ) : (
        ''
      )}
      <Flex style={{ flexWrap: 'wrap' }}>
        {props.data?.fence?.circle.map((item, index) => (
          <TagItem
            key={'circle' + index}
            item={item}
            close={() => {
              const info = {
                ...props.data,
              };
              info.fence.circle = props.data.fence.circle.filter((info, idx) => idx !== index);
              props.setData(info);
            }}
          />
        ))}
        {props.data?.fence?.polygon.map((item, index) => (
          <TagItem
            key={'polygon' + index}
            item={item}
            close={() => {
              const info = {
                ...props.data,
              };
              info.fence.polygon = props.data.fence.polygon.filter((info, idx) => idx !== index);
              props.setData(info);
            }}
          />
        ))}
      </Flex>
    </div>
  );
}
