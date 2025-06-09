import { Button } from 'antd';
import { useState } from 'react';
import { FormParamsProps } from '../../context';
import TagModal, { CrowdTag, TagItemProps } from '../modal-tag';

export default function SelectTag(props: {
  parames: FormParamsProps;
  changeParames: (type: string, value: any) => void;
}) {
  const { parames, changeParames } = props;
  const [tagModalBol, setTagModalBol] = useState(false);
  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Button
          type="primary"
          ghost
          onClick={() => {
            setTagModalBol(true);
          }}
        >
          选择标签
        </Button>
      </div>
      {parames.tagData.length > 0 && <span>已选标签</span>}
      <div>
        <CrowdTag
          data={parames.tagData}
          setData={(info: TagItemProps[]) => {
            changeParames('tagData', info);
          }}
        />
      </div>
      {tagModalBol && (
        <TagModal
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          changeData={(info: TagItemProps[]) => {
            changeParames('tagData', info);
          }}
          defluatData={parames.tagData}
          close={() => {
            setTagModalBol(false);
          }}
        />
      )}
    </>
  );
}
