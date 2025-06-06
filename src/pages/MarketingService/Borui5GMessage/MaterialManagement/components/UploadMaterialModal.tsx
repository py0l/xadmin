import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormRadio,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useState } from 'react';

interface UploadMaterialModalProps {
  trigger: React.ReactElement;
  onOk: (values: any) => void;
}

const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({ trigger, onOk }) => {
  const [materialType, setMaterialType] = useState('image'); // 默认素材类型为图片

  const beforeUpload = (file: any) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能超过 2MB!');
    }
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng && materialType === 'image') {
      message.error('图片格式只能是 JPG/PNG/JPEG!');
    }
    // TODO: 根据素材类型添加视频和音频的格式校验
    return isLt2M && isJpgOrPng; // 暂时只校验图片格式
  };

  return (
    <ModalForm
      title="添加素材"
      trigger={trigger}
      onFinish={async (values) => {
        onOk(values);
        return true; // 返回 true 表示表单提交成功，ModalForm 会自动关闭
      }}
      width={600}
      layout="horizontal"
      labelCol={{ span: 4 }}
      initialValues={{ materialType: 'image', validityType: 'permanent' }}
    >
      <ProFormText
        name="materialName"
        label="素材名称"
        placeholder="请输入素材名称"
        rules={[{ required: true, message: '请输入素材名称!' }]}
      />

      <ProFormRadio.Group
        name="materialType"
        label="素材类型"
        options={[
          { label: '图片', value: 'image' },
          { label: '视频', value: 'video' },
          { label: '音频', value: 'audio' },
        ]}
        fieldProps={{
          onChange: (e) => setMaterialType(e.target.value),
        }}
      />

      <ProFormUploadButton
        name="materialUrl"
        label="素材地址"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          action: '/api/upload', // 替换为实际的上传接口
          beforeUpload: beforeUpload,
        }}
        rules={[{ required: true, message: '请上传素材!' }]}
        extra="请上传大小不超过 2M 格式为 png/jpg/jpeg 的文件"
        icon={<PlusOutlined />}
      />

      <ProFormUploadButton
        name="thumbnailUrl"
        label="素材缩略图"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          action: '/api/upload', // 替换为实际的上传接口
          beforeUpload: beforeUpload,
        }}
        extra="请上传大小不超过 2M 格式为 png/jpg/jpeg 的文件"
        icon={<PlusOutlined />}
      />

      <ProFormRadio.Group
        name="validityType"
        label="有效期类型"
        options={[
          { label: '临时', value: 'temporary' },
          { label: '永久', value: 'permanent' },
        ]}
      />
    </ModalForm>
  );
};

export default UploadMaterialModal;
