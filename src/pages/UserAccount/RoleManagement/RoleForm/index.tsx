import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Card, Checkbox, Col, message, Row } from 'antd';

// 模拟角色数据
const mockRoles = [
  {
    id: 'js001',
    name: '管理员',
    remark: '拥有所有权限的管理员角色',
    permissions: [
      '首页',
      '查询数据',
      '数据地图',
      '城市热力',
      '品牌驾驶舱',
      '消费明细',
      '数据服务',
      '营销服务',
    ],
  },
  {
    id: 'js002',
    name: '运营人员',
    remark: '负责日常运营管理',
    permissions: ['首页', '消费明细', '数据服务'],
  },
  {
    id: 'js003',
    name: '代理商',
    remark: '代理商角色，可查看部分数据',
    permissions: ['首页', '查询数据', '城市热力'],
  },
  {
    id: 'js004',
    name: '普通客户',
    remark: '普通客户角色，仅可查看基本信息',
    permissions: ['首页', '查询数据', '数据地图'],
  },
];

// 模拟权限列表
const allPermissions = [
  '首页',
  '查询数据',
  '数据地图',
  '城市热力',
  '品牌驾驶舱',
  '消费明细',
  '数据服务',
  '营销服务',
];

const RoleForm: React.FC = () => {
  const params = useParams();
  const roleId = params.id;
  const isEditMode = !!roleId;

  const requestInitialValues = async () => {
    if (isEditMode) {
      // 模拟根据ID加载角色数据
      const role = mockRoles.find((r) => r.id === roleId);
      if (role) {
        return {
          roleName: role.name,
          remark: role.remark,
          permissions: role.permissions,
        };
      } else {
        message.error('未找到该角色');
        history.back();
        return {}; // 返回空对象以避免ProForm报错
      }
    }
    return {}; // 新增模式返回空对象
  };

  const onFinish = async (values: any) => {
    console.log('提交的表单值:', values);
    if (isEditMode) {
      message.success(`角色 ${values.roleName} 更新成功！`);
    } else {
      message.success(`角色 ${values.roleName} 新增成功！`);
    }
    history.back(); // 提交后返回上一页
  };

  return (
    <Card title="填写角色信息">
      <ProForm
        onFinish={onFinish}
        request={requestInitialValues} // 使用request属性初始化表单值
        submitter={{
          searchConfig: {
            submitText: '提交',
            resetText: '取消',
          },
          resetButtonProps: {
            onClick: () => history.back(),
          },
        }}
      >
        <ProFormText
          width="md"
          name="roleName"
          label="角色名称"
          placeholder="填写角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        />
        <ProFormTextArea width="md" name="remark" label="备注" placeholder="填写角色备注" />
        <ProForm.Item name="permissions" label="用户角色">
          <Checkbox.Group>
            <Row>
              {allPermissions.map((permission) => (
                <Col span={6} key={permission}>
                  <Checkbox value={permission}>{permission}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </ProForm.Item>
      </ProForm>
    </Card>
  );
};

export default RoleForm;
