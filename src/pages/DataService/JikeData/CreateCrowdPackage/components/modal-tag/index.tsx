import { Flex, Modal } from 'antd';
import './index.less';

export interface TagItemProps {
  label_id: string;
  label_name: string;
  label_value: string;
}

export default function TagModal(props: {
  changeData: (data: TagItemProps[]) => void;
  close: () => void;
  defluatData: TagItemProps[];
}) {
  const handleOk = () => {
    // iframeRef.current.contentWindow.postMessage({ action: 'tag_get', secret: 'mengxiang01' }, '*');
  };
  const handleCancel = () => {
    props.close();
  };

  // const { data: TagTokenRes, onSuccess: getTagTokenSuccess } = useRequest(() => getTagToken(), {});
  // getTagTokenSuccess((res: any) => {
  //   // 存在 code 代表，要业务中处理错误提示
  //   if (res && res.data && res.data.code === 0) {
  //   } else {
  //     if (res && res.data && res.data.msg) {
  //       message.error(res.data.msg);
  //     }
  //   }
  // });

  // const handleMessage = useCallback((event: any) => {
  //   if (event.origin !== _host) {
  //     return; // 只接受从特定域发来的消息
  //   }
  //   const res = event.data;
  //   if (res.action === 'onLoad') {
  //     iframeRef.current.contentWindow.postMessage(
  //       {
  //         action: 'tag_update',
  //         secret: 'mengxiang01',
  //         payload: {
  //           // 数据结构
  //           data: props.defluatData,
  //         },
  //       },
  //       '*',
  //     );
  //   }
  //   if (res.action === 'tag_get') {
  //     console.log('res.payload', res.payload);
  //     props.changeData((res.payload.data as TagItemProps[]) || []);
  //     props.close();
  //   }
  // }, []);

  // useEffect(() => {

  //   window.addEventListener('message', handleMessage);
  //   return () => {
  //     window.removeEventListener('message', handleMessage);
  //   };
  // }, []);
  return (
    <Modal
      maskClosable={false}
      width={1000}
      className="do-com-modal do-tag-modal"
      title="选择标签"
      open
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {/* @ts-ignore */}
      {/* {TagTokenRes?.data?.token ? (
        <iframe
          ref={iframeRef}
          id="myIframe"
          frameBorder={0}
          src={`${_host}/#/dsp/tag-control?token=${TagTokenRes?.data?.token}&origin=${window.location.origin}`}
          width="970"
          height="500"
        ></iframe>
      ) : (
        <div style={{ height: 526 }}></div>
      )} */}
      <div style={{ height: 526 }}></div>
    </Modal>
  );
}

export function CrowdTag(props: {
  data: TagItemProps[] | [];
  setData: (data: TagItemProps[]) => void;
}) {
  return (
    <Flex className="do-com-crowdtag">
      {props.data.map((item) => (
        <div key={item.label_id}>
          <Flex className="crowd-tag-item">
            {item.label_name}：{item.label_value}
            <span
              className="iconfont"
              onClick={() => {
                props.setData(props.data.filter((info) => info.label_id !== item.label_id));
              }}
            >
              &#xe6b8;
            </span>
          </Flex>
        </div>
      ))}
    </Flex>
  );
}
