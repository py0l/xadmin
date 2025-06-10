import ButtonAddModal, { ButtonAddModalRef } from '@/components/PhonePreview/ButtonAddModal';
import { MenuItem } from '@/components/PhonePreview/types';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, List, Modal, Select, Space, Table } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface CardItem {
  id: string;
  title: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  summary: string;
  buttons: MenuItem[];
}

interface CardsInfoProps {
  onCardsChange?: (cards: CardItem[]) => void;
}

export interface CardsInfoRef {
  getCards: () => CardItem[];
}

const CardsInfo = forwardRef<CardsInfoRef, CardsInfoProps>(({ onCardsChange }, ref) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCardItem, setCurrentCardItem] = useState<CardItem | null>(null);
  const [form] = Form.useForm();
  const [type, setType] = useState<'add' | 'edit'>('add');
  const buttonModalRef = useRef<ButtonAddModalRef>(null);

  useImperativeHandle(ref, () => ({
    getCards: () => cards,
  }));

  useEffect(() => {
    onCardsChange?.(cards);
  }, [cards, onCardsChange]);

  // 添加卡片
  const handleAddCard = () => {
    setType('add');
    setCurrentCardItem({
      id: Date.now().toString(),
      buttons: [],
      title: '',
      summary: '',
      mediaType: 'image',
    });
    form.resetFields();
    setIsModalVisible(true);
  };

  // 编辑卡片
  const handleEditCard = (record: CardItem) => {
    setType('edit');
    setCurrentCardItem(record);
    form.setFieldsValue(record);

    setIsModalVisible(true);
  };

  // 删除卡片
  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  // 保存卡片
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (type === 'add') {
        setCards([...cards, { ...currentCardItem, ...values }]);
      } else if (currentCardItem) {
        setCards(
          cards.map((card) =>
            card.id === currentCardItem.id ? { ...currentCardItem, ...values } : card,
          ),
        );
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleButtonModalOk = (values: MenuItem, type: 'add' | 'edit') => {
    const newButton = {
      ...values,
      id: values.id || Date.now().toString(),
    };

    if (type === 'add' && currentCardItem) {
      setCurrentCardItem({
        ...currentCardItem,
        buttons: [...currentCardItem.buttons, newButton],
      });
    } else if (type === 'edit' && currentCardItem) {
      setCurrentCardItem({
        ...currentCardItem,
        buttons: currentCardItem.buttons.map((btn) => (btn.id === newButton.id ? newButton : btn)),
      });
    }
  };

  const handleEditButton = (button: MenuItem) => {
    buttonModalRef.current?.show('edit', button);
  };

  const handleDeleteButton = (buttonId: string) => {
    if (currentCardItem) {
      setCurrentCardItem({
        ...currentCardItem,
        buttons: currentCardItem.buttons.filter((btn) => btn.id !== buttonId),
      });
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '素材类型',
      dataIndex: 'mediaUrl',
      key: 'mediaUrl',
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
    },
    {
      width: 150,
      title: '操作',
      key: 'action',
      render: (_: any, record: CardItem) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditCard(record)}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCard(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>
          卡片列表
          <Button
            style={{
              marginLeft: 16,
            }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCard}
          >
            新建卡片
          </Button>
        </h2>
      </div>
      <Table columns={columns} dataSource={cards} rowKey="id" pagination={false} />
      <Modal
        title={currentCardItem ? '编辑卡片' : '新建卡片'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>

          <Form.Item name="mediaUrl" label="素材类型" rules={[{ message: '请选择素材类型' }]}>
            <Select
              placeholder="请选择素材类型"
              options={[
                {
                  value: 'https://cdn-static.isjike.com/open-data-console/logo_light.png',
                  label: 'xx图片',
                },
                { value: 'video', label: 'xx视频' },
                { value: 'audio', label: 'xx音频' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="summary"
            style={{
              marginBottom: 16,
            }}
            label="摘要"
            rules={[{ max: 1000, message: '摘要不能超过1000字' }]}
          >
            <Input.TextArea
              placeholder="请输入摘要，如需要插入变量侧用{}占位"
              maxLength={1000}
              showCount
              rows={4}
            />
          </Form.Item>

          <Form.Item label="底部按钮">
            {(currentCardItem?.buttons ?? []).length > 0 ? (
              <List
                size="small"
                dataSource={currentCardItem?.buttons || []}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="edit"
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditButton(item)}
                      >
                        编辑
                      </Button>,
                      <Button
                        key="delete"
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteButton(item.id)}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.name}
                      description={
                        <div>
                          类型：$
                          {item.type === 'page'
                            ? '跳转页面'
                            : item.type === 'phone'
                            ? '拨打电话'
                            : '定向发送'}
                          <div>内容：{item.content || item.phoneNumber}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              ''
            )}

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                buttonModalRef.current?.show('add');
              }}
              style={{ marginTop: 16 }}
            >
              添加按钮
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <ButtonAddModal ref={buttonModalRef} onOk={handleButtonModalOk} />
    </div>
  );
});

export default CardsInfo;
