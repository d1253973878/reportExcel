import React from 'react';
import { Form, Input, Select } from 'antd';
import styles from './index.less';

const { Option } = Select;

export interface ReportParamFormProps {

}

/**
 * 报表参数
 * @param props
 */
const ReportParamForm: React.FC<ReportParamFormProps> = (props) => {
  return (
    <>
      <Form
        layout="vertical"
        name="basic"
      >
        <Form.Item
          label="坐标"
          className={styles.formItem}
          name="coordinate"
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="类型"
          className={styles.formItem}
          name="type"
          initialValue="text"
        >
          <Select
            placeholder="请选择值类型"
            onChange={()=> {}}
          >
            <Option value="text" key="1">文本</Option>
            <Option value="pic" key="2">图片</Option>
            <Option value="barCode" key="3">条形码</Option>
            <Option value="chart" key="4">图表</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="值"
          className={styles.formItem}
          name="excelValue"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="聚合方式"
          className={styles.formItem}
          name="polyWay"
          initialValue="list"
        >
          <Select
            placeholder="请选择聚合方式"
            onChange={()=> {}}
          >
            <Option value="list" key="1">列表</Option>
            <Option value="group" key="2">分组</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="扩展方向"
          className={styles.formItem}
          name="direction"
          initialValue="vertical"
        >
          <Select
            placeholder="请选择扩展方式"
            onChange={()=> {}}
          >
            <Option value="vertical" key="1">纵向</Option>
            <Option value="horizontal" key="2">横向</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="超链接"
          className={styles.formItem}
          name="link"
        >
          <Input readOnly />
        </Form.Item>
      </Form>
    </>
  );
};

export default ReportParamForm;