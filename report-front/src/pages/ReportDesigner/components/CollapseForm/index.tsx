import React from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { Collapse, Form, Input } from 'antd';
import { FormProps } from 'rc-field-form/lib/Form';

/**
 * 可展开表单的配置，与普通表单配置一致
 */
export interface CollapseFormProps extends FormProps {
  currentReport?: any, // 实际上对应 ReportModelState
  dispatch?: Dispatch;
}

/**
 * 左边可展开的表单
 * @param props 
 */
const CollapseForm: React.FC<CollapseFormProps> = (props) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  const { currentReport, dispatch } = props;
  return (
    <>
      <Collapse expandIconPosition="right" accordion ghost>
        <Collapse.Panel key={0} header="报表信息">
          <Form
            {...layout}
            name="basic"
            onValuesChange={
              (changedValues, allValues) => {
                !!dispatch && dispatch({
                  type: 'report/updateCurrent',
                  payload: {
                    ...currentReport,
                    ...changedValues
                  }
                });
                props.onValuesChange && props.onValuesChange(changedValues, allValues)
              }}
          >
            {/* <Form.Item name="code" label="编码">
              <Input readOnly />
            </Form.Item> */}
            <Form.Item name="name" label="名称" initialValue={currentReport.name}>
              <Input placeholder="请输入报表名称" />
            </Form.Item>
            <Form.Item name="description" label="描述" initialValue={currentReport.description}>
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default connect(({ report }: ConnectState) => ({
  currentReport: report.currentReport
}))(CollapseForm);