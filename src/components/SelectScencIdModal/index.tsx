import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';

interface PoiData {
  poi_id: string;
  poi_name: string;
}

interface SelectScencIdModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (data: PoiData[]) => void;
}

const SelectScencIdModal: React.FC<SelectScencIdModalProps> = ({ open, onCancel, onOk }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 验证消息来源
      if (event.origin !== 'https://iframe.keliuyi.com') return;

      const { type, result } = event.data;

      switch (type) {
        case 'noticeMoreTenThousandData':
          // 处理超过一万条数据的通知
          console.log('数据超过一万条:', result);
          break;

        case 'getCheckedPoi':
          console.log('getCheckedPoi:', result);
          // 处理选中的 POI 数据
          onOk(result.list);

          break;

        default:
          break;
      }
    };

    // 添加消息监听
    window.addEventListener('message', handleMessage);

    // 清理监听器
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // 处理 iframe 加载完成
  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      // 发送初始化消息
      iframeRef.current.contentWindow.postMessage({ type: 'init' }, 'https://iframe.keliuyi.com');
    }
  };

  const handleOk = () => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'getCheckedPoi',
      },
      'https://iframe.keliuyi.com',
    );
  };

  return (
    <Modal
      title="选择场景"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={1100}
      bodyStyle={{ height: '600px', padding: 0 }}
    >
      <iframe
        ref={iframeRef}
        src="https://iframe.keliuyi.com/poi-query"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="场景选择"
        onLoad={handleIframeLoad}
      />
    </Modal>
  );
};

export default SelectScencIdModal;
