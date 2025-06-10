import PhonePreview from '@/components/PhonePreview';
import { MenuItem } from '@/components/PhonePreview/types';
import { history } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  message,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Typography,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import BasicInfo from './components/BasicInfo';
import CardsInfo from './components/CardsInfo';
import MenuInfo from './components/MenuInfo';
import styles from './index.less';

interface CardItem {
  id: string;
  title: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  summary: string;
  buttons: MenuItem[];
}

interface CardsInfoRef {
  getCards: () => CardItem[];
}

const CreateTemplatePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [floatingButtons, setFloatingButtons] = useState<MenuItem[]>([]);
  const [cards, setCards] = useState<CardItem[]>([] as CardItem[]);
  const cardsInfoRef = useRef<CardsInfoRef>(null);

  const basicRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollTop = contentRef.current.scrollTop;
      const cardsOffset = cardsRef.current?.offsetTop || 0;
      const menuOffset = menuRef.current?.offsetTop || 0;

      if (scrollTop >= menuOffset - 100) {
        setActiveTab('menu');
      } else if (scrollTop >= cardsOffset - 100) {
        setActiveTab('cards');
      } else {
        setActiveTab('basic');
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    const refs = {
      basic: basicRef,
      cards: cardsRef,
      menu: menuRef,
    };
    const targetRef = refs[key as keyof typeof refs];
    if (targetRef.current && contentRef.current) {
      contentRef.current.scrollTo({
        top: targetRef.current.offsetTop - 20,
        behavior: 'smooth',
      });
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    setFloatingButtons(floatingButtons.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const cards = cardsInfoRef.current?.getCards() || [];
      setLoading(true);
      // TODO: 实现创建模板的 API 调用
      console.log('提交的表单数据:', { ...values, cards });
      message.success('模板创建成功');
      history.back();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.back();
  };

  return (
    <Card>
      <Row>
        <Col span={24}>
          <Form form={form} layout="horizontal">
            <Form.Item
              label="选择用户"
              name="templateName"
              rules={[
                {
                  required: true,
                  message: '请选择用户',
                },
              ]}
              extra={<Typography.Text type="secondary">为指定用户账户，创建模版</Typography.Text>}
            >
              <Select
                placeholder="指定用户账号"
                style={{
                  maxWidth: 400,
                }}
              />
            </Form.Item>
            <Flex wrap>
              <Form.Item label="需用户授权" name="authorization">
                <Switch />
              </Form.Item>
              <Form.Item dependencies={['authorization', 'time']} noStyle>
                {({ getFieldValue }) => {
                  const authorization = getFieldValue('authorization');
                  const time = getFieldValue('time');

                  if (authorization) {
                    return (
                      <Form.Item
                        label="倒计时"
                        name="time"
                        labelCol={{ span: 4 }}
                        style={{ flex: 1 }}
                        extra={
                          time && (
                            <Typography.Text
                              type="secondary"
                              style={{
                                whiteSpace: 'nowrap',
                              }}
                            >
                              24小时后，自动授权
                            </Typography.Text>
                          )
                        }
                      >
                        <Switch />
                      </Form.Item>
                    );
                  }
                  return null;
                }}
              </Form.Item>
            </Flex>
          </Form>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={7}>
          <PhonePreview
            cards={cards}
            tabs={[]}
            onTabClick={() => {}}
            floatingButtons={floatingButtons}
            onFloatingButtonClick={(button) => {
              console.log('Floating button clicked:', button);
            }}
          />
        </Col>

        <Col span={16}>
          <div className={styles.tabsContainer}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabClick}
              tabPosition="right"
              items={[
                {
                  key: 'basic',
                  label: '基础信息',
                  children: null,
                },
                {
                  key: 'cards',
                  label: '卡片信息',
                  children: null,
                },
                {
                  key: 'menu',
                  label: '悬浮菜单',
                  children: null,
                },
              ]}
            />
            <div ref={contentRef} className={styles.contentContainer}>
              <div ref={basicRef} className={styles.section}>
                <BasicInfo form={form} />
              </div>

              <div ref={cardsRef} className={styles.section}>
                <CardsInfo ref={cardsInfoRef} onCardsChange={setCards} />
              </div>

              <div ref={menuRef} className={styles.section}>
                <MenuInfo
                  menuItems={floatingButtons}
                  setMenuItems={setFloatingButtons}
                  onDeleteMenuItem={handleDeleteMenuItem}
                />
              </div>

              <Divider />
            </div>
          </div>
          <Flex justify="end" style={{ marginTop: 12 }}>
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                提交创建
              </Button>
            </Space>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};

export default CreateTemplatePage;
