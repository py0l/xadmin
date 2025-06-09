import { Form, Input, Modal, Select } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { MenuItem } from './types';

interface ButtonAddModalProps {
  onOk: (values: MenuItem, type: 'add' | 'edit') => void;
}

export interface ButtonAddModalRef {
  show: (type: 'add' | 'edit', editingItem?: MenuItem) => void;
}

const ButtonAddModal = forwardRef<ButtonAddModalRef, ButtonAddModalProps>(({ onOk }, ref) => {
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [showContent, setShowContent] = useState(true);
  useImperativeHandle(ref, () => ({
    show: (type: 'add' | 'edit', editingItem?: MenuItem) => {
      setShowContent(true);
      setType(type);
      if (type === 'edit' && editingItem) {
        setEditingItem(editingItem);
        form.setFieldsValue(editingItem);
        console.log('show editingItem', editingItem);

        if (editingItem.subTabs && editingItem.subTabs.length > 0) {
          setShowContent(false);
        }
      } else {
        setEditingItem(null);
        form.resetFields();
      }
      setVisible(true);
    },
  }));

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(
        {
          ...values,
          id: editingItem?.id || Date.now().toString(),
        },
        type,
      );
      setVisible(false);
      setEditingItem(null);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  return (
    <Modal
      title={editingItem ? '编辑按钮' : '添加按钮'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="按钮名称"
          rules={[{ required: true, message: '请输入按钮名称' }]}
        >
          <Input placeholder="请输入按钮名称" />
        </Form.Item>
        {showContent && (
          <>
            <Form.Item
              name="type"
              label="按钮类型"
              rules={[{ required: true, message: '请选择按钮类型' }]}
            >
              <Select
                placeholder="请选择按钮类型"
                options={[
                  { value: 'page', label: '跳转页面' },
                  { value: 'phone', label: '拨打电话' },
                  { value: 'send', label: '定向发送' },
                ]}
              />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                if (type === 'page') {
                  return (
                    <Form.Item
                      name="url"
                      label="跳转链接"
                      rules={[{ required: true, message: '请输入跳转链接' }]}
                    >
                      <Input placeholder="请输入跳转链接" />
                    </Form.Item>
                  );
                }
                if (type === 'phone') {
                  return (
                    <Form.Item
                      name="phone"
                      label="电话号码"
                      rules={[{ required: true, message: '请输入电话号码' }]}
                    >
                      <Input placeholder="请输入电话号码" />
                    </Form.Item>
                  );
                }
                if (type === 'send') {
                  return (
                    <Form.Item
                      name="content"
                      label="发送内容"
                      rules={[{ required: true, message: '请输入发送内容' }]}
                    >
                      <Input.TextArea placeholder="请输入发送内容" rows={4} />
                    </Form.Item>
                  );
                }
                return null;
              }}
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
});

export default ButtonAddModal;
