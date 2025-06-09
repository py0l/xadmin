import PhonePreview from '@/components/PhonePreview';
import BottomMenuTable from '@/components/PhonePreview/BottomMenuTable';
import ButtonAddModal, { ButtonAddModalRef } from '@/components/PhonePreview/ButtonAddModal';
import { MenuItem } from '@/components/PhonePreview/types';

import { history, useParams } from '@umijs/max';
import { Button, Card, Col, Form, Input, message, Modal, Row, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const BottomMenuSettings: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const buttonModalRef = useRef<ButtonAddModalRef>(null);

  useEffect(() => {
    const fetchMenuConfig = async () => {
      try {
        // 模拟数据
        const mockData = {
          name: '企业客服机器人',
          menuItems: [
            {
              id: '1',
              name: '首页',
              type: 'page' as const,
              content: 'https://example.com',
              subTabs: [
                {
                  id: '1-1',
                  name: '子菜单1',
                  type: 'page' as const,
                  content: 'https://example.com/sub1',
                },
                {
                  id: '1-2',
                  name: '子菜单2',
                  type: 'page' as const,
                  content: 'https://example.com/sub2',
                },
              ],
            },
            {
              id: '2',
              name: '联系我们',
              type: 'phone' as const,
              content: '10086',
            },
          ],
        };
        form.setFieldsValue({ name: mockData.name });
        setMenuItems(mockData.menuItems);
      } catch (error) {
        message.error('获取菜单配置失败');
      }
    };

    fetchMenuConfig();
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    try {
      console.log('提交的值:', values);
      message.success('保存成功');
      history.back();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleAddMenu = () => {
    setEditingItem(null);
    buttonModalRef.current?.show('add');
  };

  const handleAddSubMenu = (record: MenuItem, parentItem: MenuItem) => {
    console.log('handleAddSubMenu record', parentItem);
    if (parentItem.subTabs && parentItem.subTabs.length >= 3) {
      message.error('最多只能添加3个子菜单');
      return;
    }
    if (!parentItem.subTabs || parentItem.subTabs.length === 0) {
      Modal.confirm({
        title: '提示',
        content: '添加子菜单后，一级菜单的内容将被清除。确定添加子菜单？',
        onOk: () => {
          setEditingItem(record);
          buttonModalRef.current?.show('add');
        },
      });
      return;
    }
    setEditingItem(record);
    buttonModalRef.current?.show('add');
  };

  const handleEditMenu = (record: MenuItem) => {
    setEditingItem(record);
    buttonModalRef.current?.show('edit', record);
  };

  const handleMenuSubmit = (values: any, type: 'add' | 'edit') => {
    if (type === 'add') {
      if (editingItem?.isSubMenu) {
        const list = menuItems.map((item) => {
          if (item.id === editingItem?.parentId) {
            return {
              ...item,
              subTabs: [...(item.subTabs || []), values],
            };
          }
          return item;
        });
        console.log('二级添加 list', list);
        setMenuItems(list);
      } else {
        const list = menuItems.concat(values);
        console.log('一级添加 list', list);
        setMenuItems(list);
      }
    } else {
      const list = menuItems.map((item) => {
        if (item.id === editingItem?.id) {
          return {
            ...item,
            ...values,
          };
        } else if (item.subTabs && item.subTabs.length > 0) {
          return {
            ...item,
            subTabs: item.subTabs.map((subItem) => {
              if (subItem.id === values?.id) {
                return {
                  ...values,
                };
              }
              return subItem;
            }),
          };
        }
        return item;
      });

      setMenuItems(list);
    }
    message.success(type === 'add' ? '添加成功' : '修改成功');
  };

  return (
    <>
      <Card>
        <Row gutter={24}>
          <Col span={6}>
            <PhonePreview
              tabs={menuItems.map((item) => ({
                id: item.id,
                name: item.name,
                icon: '🏠',
                type: item.type,
                subTabs: item.subTabs?.map((subItem) => ({
                  id: subItem.id,
                  name: subItem.name,
                  type: subItem.type,
                })),
              }))}
              onTabClick={(tab) => console.log('Tab clicked:', tab)}
            />
          </Col>
          <Col span={15}>
            <Form form={form} layout="vertical" style={{ marginTop: 16 }} onFinish={handleSubmit}>
              <Form.Item label="选择用户" name="name" required>
                <Select disabled placeholder="请选择用户" />
              </Form.Item>
              <Form.Item
                label="Chatbot名称"
                name="name"
                rules={[{ required: true, message: '请输入Chatbot名称' }]}
              >
                <Input />
              </Form.Item>

              <BottomMenuTable
                menuItems={menuItems}
                setMenuItems={setMenuItems}
                handleEditMenu={handleEditMenu}
                handleAddMenu={handleAddMenu}
                handleAddSubMenu={handleAddSubMenu}
              />

              <Form.Item>
                <Button style={{ marginRight: 8 }} onClick={() => history.back()}>
                  返回
                </Button>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
      <ButtonAddModal ref={buttonModalRef} onOk={handleMenuSubmit} />
    </>
  );
};

export default BottomMenuSettings;
