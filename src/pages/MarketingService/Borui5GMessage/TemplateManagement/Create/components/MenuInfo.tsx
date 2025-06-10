import ButtonAddModal, { ButtonAddModalRef } from '@/components/PhonePreview/ButtonAddModal';
import { MenuItem } from '@/components/PhonePreview/types';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import React, { useRef } from 'react';

interface MenuInfoProps {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  onDeleteMenuItem: (id: string) => void;
}

const typeMap: Record<NonNullable<MenuItem['type']>, string> = {
  page: '跳转页面',
  phone: '拨打电话',
  message: '定向发送',
  send: '定向发送', // 添加 'send' 类型
};

const MenuInfo: React.FC<MenuInfoProps> = ({ menuItems, setMenuItems, onDeleteMenuItem }) => {
  const buttonModalRef = useRef<ButtonAddModalRef>(null);

  const handleButtonModalOk = (values: MenuItem, type: 'add' | 'edit') => {
    if (type === 'add') {
      setMenuItems([...menuItems, values]);
    } else {
      setMenuItems(menuItems.map((item) => (item.id === values.id ? values : item)));
    }
  };

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: MenuItem['type']) => (type ? typeMap[type] : type),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (_: any, record: MenuItem) => {
        if (record.type === 'page') {
          return record.content;
        }
        if (record.type === 'phone') {
          return record.phoneNumber;
        }
        return record.content;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: MenuItem) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => buttonModalRef.current?.show('edit', record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteMenuItem(record.id)}
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
          底部悬浮菜单
          <Button
            style={{
              marginLeft: 16,
            }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => buttonModalRef.current?.show('add')}
          >
            添加菜单项
          </Button>
        </h2>
      </div>
      <Table columns={columns} dataSource={menuItems} rowKey="id" pagination={false} />
      <ButtonAddModal ref={buttonModalRef} onOk={handleButtonModalOk} />
    </div>
  );
};

export default MenuInfo;
