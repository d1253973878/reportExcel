import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';

const { Option } = Select;

/**
 * 添加数据源弹窗配置
 */
export interface DatasourceUpdateModalProp {
  datasource?: Datasource; // 数据集信息
  title?: string; // 添加数据源页面标题
  saveConnection?: (values: Datasource) => void; // 点击处理事件确认按钮
  testConnection?: (values: Datasource) => void; // 点击测试数据源按钮
  onCancel: () => void; // 点击处理事件取消按钮
}

/**
 * 数据源类
 */
export interface Datasource {
  id?: string; // 连接ID
  name?: string; // 连接名称
  serverName?: string; // 数据库连接地址IP
  port?: string; // 端口号
  dbName?: string; // 数据库名
  dbType?: string; // 数据源类型
  createTime?: string; // 创建时间
  userName?: string; // 用户名
  password?: string; // 密码
}

const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 25,
  },
};

/**
 * 添加数据源弹窗
 */
const DatasourceUpdateModal: React.FC<DatasourceUpdateModalProp> = (props) => {
  const form = React.createRef<FormInstance>();

  return (
    <>
      <Modal
        centered
        title={props.title}
        visible={true}
        zIndex={1010}
        onOk={() => {
          props.saveConnection && props.saveConnection(form.current?.getFieldsValue());
        }}
        onCancel={props.onCancel}
        width={'50%'}
        bodyStyle={{ height: '80%' }}
      >
        <Form {...layout} name="basic" ref={form} initialValues={props.datasource}>
          <Form.Item label="ID:" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="创建人ID:" name="personId" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="创建人名称:" name="personName" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="创建时间:" name="createTime" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="数据源名称:"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入数据源名称',
              },
            ]}
          >
            <Input placeholder="请输入数据源名称" />
          </Form.Item>
          <Form.Item label="数据源类型:" name="dbType">
            <Select
              placeholder="请选择数据源类型"
              onChange={(value: any) => {
                console.log(`selected ${value}`);
              }}
            >
              <Option value="MySQL">MySQL</Option>
              <Option value="Oracle">Oracle</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="IP:"
            name="serverName"
            rules={[
              {
                required: true,
                message: '请输入数据库地址',
              },
            ]}
          >
            <Input placeholder="请输入数据库地址" />
          </Form.Item>
          <Form.Item
            label="数据库名称:"
            name="dbName"
            rules={[
              {
                required: true,
                message: '请输入数据库名称',
              },
            ]}
          >
            <Input placeholder="请输入数据库名称" />
          </Form.Item>
          <Form.Item
            label="端口号:"
            name="port"
            rules={[
              {
                required: true,
                message: '请输入端口号',
              },
            ]}
          >
            <Input placeholder="请输入端口号" />
          </Form.Item>
          <Form.Item
            label="用户名:"
            name="userName"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="密码:"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item style={{textAlign: 'right'}}>
            <Button
              type="primary"
              htmlType="button"
              style={{ textAlign: 'center' }}
              onClick={() => {
                props.testConnection && props.testConnection(form.current?.getFieldsValue());
              }}
            >
              测试
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DatasourceUpdateModal;
