import PhonePreview, { TabItem } from '@/components/PhonePreview';
import { UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Card, Col, message, Modal, Row, Tag, Typography, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import type { Key } from 'react';
import React, { useState } from 'react';

interface CrowdItem {
  id: string;
  name: string;
  count: number;
}

const mockCrowdData: CrowdItem[] = [
  { id: '1', name: '人群包1', count: 1000 },
  { id: '2', name: '人群包2', count: 2000 },
  { id: '3', name: '人群包3', count: 3000 },
];

const SendMessagePage: React.FC = () => {
  const [form] = ProForm.useForm(); // Changed from Form.useForm()
  const [selectedCrowds, setSelectedCrowds] = useState<CrowdItem[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [crowdModalVisible, setCrowdModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const handleSubmit = async (values: any) => {
    // ProForm passes values directly
    try {
      console.log('提交的表单数据:', values);
      message.success('发送任务创建成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const crowdColumns = [
    {
      title: '人群包名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '人数',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  const handleCrowdModalOk = () => {
    const selectedCrowds = mockCrowdData.filter((item) => selectedRowKeys.includes(item.id));
    setSelectedCrowds((prev) => [...prev, ...selectedCrowds]);
    setCrowdModalVisible(false);
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: Key[]) => setSelectedRowKeys(keys),
  };

  const cards = [
    {
      id: '1',
      title: 'Card 1',
      description: 'Description 1',
      imageUrl: 'url-to-image',
      buttons: [
        {
          id: '1',
          name: 'Button 1',
          type: 'page',
        },
      ],
    },
    {
      id: '2',
      title: 'Card 2',
      description: 'Description 2',
      imageUrl: 'url-to-image2',
    },
    {
      id: '3',
      title: 'Card 3',
      description: 'Description 2',
      imageUrl: 'url-to-image2',
    },
  ];

  const messages = [
    {
      id: '1',
      content: 'Hello!',
      isUser: true,
      timestamp: '10:00 AM',
    },
  ];

  const tabs: TabItem[] = [
    {
      id: '1',
      name: 'Home',
      type: 'page',
      subTabs: [
        {
          id: '1',
          name: 'Button 1',
          type: 'page',
        },
        {
          id: '2',
          name: 'Button 2',
          type: 'page',
        },
        {
          id: '3',
          name: 'Button 3',
          type: 'page',
        },
      ],
    },
    {
      id: '2',
      name: 'Home3',
      type: 'page',
    },
  ];

  return (
    <>
      <Card>
        <Row gutter={120}>
          <Col style={{ marginTop: 80 }} span={8}>
            <PhonePreview
              cards={cards}
              messages={messages}
              tabs={tabs}
              // floatingButtons={floatingButtons}
              onTabClick={(tab) => console.log('Tab clicked:', tab)}
            />
          </Col>
          <Col span={10} style={{ marginLeft: 20 }}>
            <ProForm
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              submitter={{
                searchConfig: {
                  resetText: '取消',
                  submitText: '提交发送',
                },
                onReset: () => {
                  history.back();
                },
              }}
            >
              <ProFormSelect
                name="user"
                label="选择用户"
                valueEnum={{
                  user1: '指定用户账号',
                }}
                rules={[{ required: true, message: '请选择用户' }]}
                initialValue="user1"
                fieldProps={{
                  suffixIcon: <Typography.Link>为指定用户账号，创建Chatbot</Typography.Link>,
                }}
              />
              <Row gutter={16}>
                <Col span={12}>
                  <ProFormSwitch name="userAuth" label="需用户授权" />
                </Col>
                <Col span={12}>
                  <ProFormDependency name={['userAuth', 'countdown']}>
                    {({ userAuth, countdown }) => {
                      if (!userAuth) {
                        return null;
                      }
                      return (
                        <ProFormSwitch
                          name="countdown"
                          label="倒计时"
                          extra={
                            countdown ? (
                              <span style={{ whiteSpace: 'nowrap' }}>24小时后，自动授权</span>
                            ) : undefined
                          }
                          initialValue={false}
                        />
                      );
                    }}
                  </ProFormDependency>
                </Col>
              </Row>
              <ProFormText
                label="任务(批次)名称"
                name="taskName"
                rules={[{ required: true, message: '请输入任务名称' }]}
                placeholder="请输入任务名称"
              />

              <ProFormSelect
                label="选择Chatbot"
                name="chatbot"
                rules={[{ required: true, message: '请选择Chatbot' }]}
                placeholder="请选择Chatbot"
                options={[
                  { value: 'chatbot1', label: 'Chatbot 1' },
                  { value: 'chatbot2', label: 'Chatbot 2' },
                ]}
              />

              <ProFormSelect
                label="模板引用"
                name="template"
                rules={[{ required: true, message: '请选择模板' }]}
                placeholder="请选择模板"
                options={[
                  { value: 'template1', label: '模板 1' },
                  { value: 'template2', label: '模板 2' },
                ]}
              />

              <ProFormDatePicker
                label="预约发送"
                name="scheduledTime"
                extra="不设置，默认为审核后立即执行"
                showTime
                placeholder="请选择发送时间"
                fieldProps={{ style: { width: '100%' } }}
              />

              <ProForm.Item label="发送人群" required>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={() => setCrowdModalVisible(true)}>
                    选择人群包
                  </Button>
                </div>
                <div style={{ marginBottom: 16 }}>
                  {selectedCrowds.map((crowd) => (
                    <Tag
                      key={crowd.id}
                      closable
                      onClose={() => {
                        setSelectedCrowds(selectedCrowds.filter((item) => item.id !== crowd.id));
                      }}
                    >
                      {crowd.name}
                    </Tag>
                  ))}
                </div>
              </ProForm.Item>

              <ProForm.Item label="导入文件">
                <div style={{ marginBottom: 16 }}>
                  <Upload
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setUploadedFiles(fileList)}
                    multiple
                  >
                    <Button icon={<UploadOutlined />}>导入文件</Button>
                  </Upload>
                </div>
                <div>
                  {uploadedFiles.map((file) => (
                    <Tag
                      key={file.uid}
                      closable
                      onClose={() => {
                        setUploadedFiles(uploadedFiles.filter((item) => item.uid !== file.uid));
                      }}
                    >
                      {file.name}
                    </Tag>
                  ))}
                </div>
              </ProForm.Item>

              <ProFormTextArea
                label="白名单"
                name="whitelist"
                extra="本次任务，需要过滤的号码"
                rows={4}
                placeholder="请输入白名单号码，多个号码用逗号分隔"
              />
            </ProForm>
          </Col>
        </Row>
      </Card>

      <Modal
        title="选择人群包"
        open={crowdModalVisible}
        onOk={handleCrowdModalOk}
        onCancel={() => {
          setCrowdModalVisible(false);
          setSelectedRowKeys([]);
        }}
        width={800}
      >
        <ProTable
          rowSelection={rowSelection}
          columns={crowdColumns}
          dataSource={mockCrowdData}
          rowKey="id"
          search={false} // 禁用搜索表单
          options={false} // 禁用表格右上角的功能按钮
          pagination={false} // 禁用分页
        />
      </Modal>
    </>
  );
};

export default SendMessagePage;
