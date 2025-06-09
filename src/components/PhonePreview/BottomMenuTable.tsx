import { Button, Form, message, Modal, Space, Table } from 'antd';
import React from 'react';
import { MenuItem } from './types';

interface BottomMenuTableProps {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  handleEditMenu: (record: MenuItem) => void;
  handleAddMenu: () => void;
  handleAddSubMenu: (record: MenuItem, parentItem: MenuItem) => void;
}

const typeMap: Record<NonNullable<MenuItem['type']>, string> = {
  page: '跳转页面',
  phone: '拨打电话',
  send: '定向发送',
  message: '发送消息',
};

const BottomMenuTable: React.FC<BottomMenuTableProps> = ({
  menuItems,
  setMenuItems,
  handleEditMenu,
  handleAddMenu: handleAddMenuParent,
  handleAddSubMenu,
}) => {
  const handleDeleteMenu = (record: MenuItem, parentId?: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除菜单"${record.name}"吗？`,
      onOk: () => {
        if (parentId) {
          // 删除子菜单
          setMenuItems(
            menuItems.map((item) =>
              item.id === parentId
                ? {
                    ...item,
                    subTabs: item.subTabs?.filter((subItem) => subItem.id !== record.id),
                  }
                : item,
            ),
          );
        } else {
          // 删除主菜单
          setMenuItems(menuItems.filter((item) => item.id !== record.id));
        }
        message.success('删除成功');
      },
    });
  };

  const expandedRowRender = (record: MenuItem) => {
    const columns = [
      {
        title: '子菜单名称',
        dataIndex: 'name',
        width: 120,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 120,
        render: (type: MenuItem['type']) => (type ? typeMap[type] : '子菜单组'),
      },
      {
        title: '内容',
        dataIndex: 'content',
        render: (content: string, record: MenuItem) => {
          if (record.type === 'page') {
            return record.url;
          }
          return record.content || record.phoneNumber;
        },
      },
      {
        title: '操作',
        width: 120,
        render: (_: any, subRecord: MenuItem) => (
          <Space>
            <Button type="link" size="small" onClick={() => handleEditMenu(subRecord)}>
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleDeleteMenu(subRecord, record.id)}
            >
              删除
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.subTabs || []}
        rowKey="id"
        pagination={false}
        size="small"
      />
    );
  };

  return (
    <Form.Item label="底部菜单">
      <Table
        columns={[
          {
            title: '菜单名称',
            dataIndex: 'name',
            width: 120,
          },
          {
            title: '类型',
            dataIndex: 'type',
            width: 120,
            render: (type: MenuItem['type']) => (type ? typeMap[type] : '子菜单组'),
          },
          {
            title: '内容',
            dataIndex: 'content',
            render: (content: string, record: MenuItem) => {
              console.log('record', record);
              if (record.subTabs && record.subTabs.length > 0) {
                return '子菜单列表';
              }

              return record.content || record.phoneNumber || record.url;
            },
          },
          {
            title: '操作',
            width: 180,
            render: (_, record: MenuItem) => (
              <Space>
                <Button type="link" size="small" onClick={() => handleEditMenu(record)}>
                  编辑
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    handleAddSubMenu(
                      {
                        id: '',
                        name: '',
                        type: 'page',
                        content: '',
                        isSubMenu: true,
                        parentId: record.id,
                      },
                      record,
                    );
                  }}
                >
                  添加子菜单
                </Button>
                <Button type="link" size="small" danger onClick={() => handleDeleteMenu(record)}>
                  删除
                </Button>
              </Space>
            ),
          },
        ]}
        dataSource={menuItems}
        rowKey="id"
        pagination={false}
        expandable={{
          expandedRowRender,
          defaultExpandAllRows: true,
        }}
      />
      <Button style={{ marginBottom: 16, marginTop: 16 }} onClick={handleAddMenuParent}>
        + 添加菜单项
      </Button>
    </Form.Item>
  );
};

export default BottomMenuTable;
