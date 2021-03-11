import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Collapse, InputNumber, DatePicker } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { tip, request } from '@/utils/newtec';
import RangeInput from '../RangeInput';
import styles from './index.less';
import { isMoment } from 'moment';

export interface FilterFormProps {
  id?: number;
  onFinish?: (values: {}) => void;
}

/**
 * 过滤条件的字段信息
 */
export interface FilterField {
  name?: string; // 字段名称
  title?: string; // 字段中文标题
  mode?: number; // 查询模式 0-单条件查询，1-范围查询，3-多选查询
  type?: number; // 字段类型 0-数值类型，1-字符类型，2-日期类型，3-时间类型
  value?: string; // 值
}

const { Panel } = Collapse;
const { RangePicker } = DatePicker;

/**
 * 报表设计器预览页面顶部参数栏
 * @param props
 */
const FilterForm: React.FC<FilterFormProps> = (props) => {
  const [fieldForm] = Form.useForm();
  const [dynamicForm] = Form.useForm();
  const { id, onFinish } = props;
  const [fields, setFields] = useState<FilterField[]>([]);
  const [fieldsObj, setFieldsObj] = useState<{}>({});

  const [dynamics, setDynamics] = useState<FilterField[]>([]);
  // 查询数据集字段信息
  const searchDataSetList = () => {
    request({
      operServiceId: 'datasetService',
      operId: 'findDatasetList',
      data: { reportId: id + '', withParams: '1' },
    }).then((res) => {
      const { status, data, error } = res;
      if (status != 0) {
        tip.error(error);
      } else {
        if (data) {
          const fs: FilterField[] = [];
          const fsObj = {};
          const ps: FilterField[] = [];
          for (let dataset of data) {
            let tfs = dataset.fields;
            let tps = dataset.params;
            // 收集字段参数
            if (Array.isArray(tfs)) {
              for (let tf of tfs) {
                if (tf.searchFlag == 1) {
                  let tmp = {
                    name: `${dataset.code}.${tf.name}`,
                    title: tf.remark,
                    mode: tf.searchMode,
                    type: tf.type,
                  };
                  fs.push(tmp);
                  fsObj[tmp.name] = tmp;
                }
              }
            }
            // 收集动态参数
            if (Array.isArray(tps)) {
              for (let tp of tps) {
                let tmp = {
                  name: `${dataset.code}.${tp.name}`,
                  title: tp.remark,
                };
                ps.push(tmp);
              }
            }
          }
          setFields(fs);
          setFieldsObj(fsObj);

          setDynamics(ps);
        }
      }
    });
  };
  useEffect(() => {
    searchDataSetList();
  }, []);

  /**
   * 根据字段查询模式、字段值类型获取表单项
   * @param mode
   * @param type
   * @param title
   */
  const getFormItem = (
    mode: number | undefined,
    type: number | undefined,
    title: string | undefined,
  ) => {
    // 查询模式
    switch (mode) {
      case 0: // 单条件查询
        switch (type) {
          case 0: // 数值类型
            return <InputNumber placeholder={`请输入${title}`} />;
          case 1: // 字符类型
            return <Input type="text" placeholder={`请输入${title}`} />;
          case 2: // 日期类型
            return <DatePicker format="YYYY-MM-DD" onChange={(value) => {}} />;
          case 3: // 时间类型
            return (
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime
                onChange={(value) => {}}
                onOk={(value) => {}}
              />
            );
          default:
            return <Input type="text" placeholder={`请输入${title}`} />;
        }
      case 1: // 范围查询
        switch (type) {
          case 0: // 数值类型
            return <RangeInput isNumber />;
          case 1: // 字符类型
            return <RangeInput />;
          case 2: // 日期类型
            return (
              <RangePicker format="YYYY-MM-DD" onChange={(value) => {}} onOk={(value) => {}} />
            );
          case 3: // 时间类型
            return (
              <RangePicker
                showTime={{ format: 'HH:mm:ss' }}
                format="YYYY-MM-DD HH:mm:ss"
                onChange={(value) => {}}
                onOk={(value) => {}}
              />
            );
          default:
            return <Input type="text" placeholder={`请输入${title}`} />;
        }
      case 2: // 多选查询
        return <></>;
      default:
        return <Input type="text" placeholder={`请输入${title}`} />;
    }
  };

  const parseFieldCodeAndName = (fullName: string) => {
    let index = fullName.indexOf('.');
    return [fullName.substring(0, index), fullName.substring(index + 1)];
  };

  /**
   * 收集字段参数
   * @param values fieldForm 表单值
   * @param fieldsObj 字段描述信息
   */
  const collectFields = (values: any, fieldsObj?: Object) => {
    let result = {};
    // 遍历每一个参数的值
    for (let key in values) {
      let value = values[key];
      if (value == null || value === '') continue;
      let field = fieldsObj ? fieldsObj[key] : null,
        type = field ? field.type : null,
        [code, name] = parseFieldCodeAndName(key),
        pattern = type == 2 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'; // 日期格式
      let tf = {
        type,
        mode: field ? field.mode : null,
        name: name,
        value: null,
        min: null,
        max: null,
      };
      if (Array.isArray(value)) {
        // 判断是否是范围查询 [min, max]
        let min = value[0],
          max = value[1];
        tf.min =
          isMoment(min) && pattern ? min.format(pattern) : min == null || min === '' ? null : min;
        tf.max =
          isMoment(max) && pattern ? max.format(pattern) : max == null || max === '' ? null : max;
      } else {
        // 单条件查询
        tf.value = isMoment(value) && pattern ? values[key].format(pattern) : values[key];
      }
      if (result[code]) {
        result[code].push(tf);
      } else {
        result[code] = [tf];
      }
    }
    return result;
  };

  /**
   * 查询
   * @param values 表单数据
   */
  const onSubmit = (values: any) => {
    var result = {
      field: collectFields(fieldForm.getFieldsValue(), fieldsObj),
      dynamic: collectFields(dynamicForm.getFieldsValue()),
    };
    console.info('onSubmit', result);
    onFinish && onFinish(result);
  };

  const onReset = () => {
    fieldForm.resetFields();
    dynamicForm.resetFields();
  };
  return (
    <>
      {(fields.length > 0 || dynamics.length > 0) && (
        <Collapse className={styles.paramsContainer}>
          <Panel header="查询栏" key="1">
            {fields.length > 0 && (
              <div className={styles.paramContainer}>
                <div className={styles.title}>字段参数</div>
                <div className={styles.content}>
                  <Form
                    name="field_form_controls"
                    layout="inline"
                    form={fieldForm}
                    onFinish={onSubmit}
                    initialValues={{}}
                  >
                    {fields.map((field, index) => (
                      <Form.Item name={field.name} label={field.title} key={index}>
                        {getFormItem(field.mode, field.type, field.title)}
                      </Form.Item>
                    ))}
                    {dynamics.length < 1 && (
                      <>
                        <Form.Item>
                          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                            查询
                          </Button>
                        </Form.Item>
                        <Form.Item>
                          <Button htmlType="button" icon={<UndoOutlined />} onClick={onReset}>
                            重置
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form>
                </div>
              </div>
            )}
            {dynamics.length > 0 && (
              <div className={styles.paramContainer}>
                <div className={styles.title}>动态参数</div>
                <div className={styles.content}>
                  <Form
                    name="params_form_controls"
                    layout="inline"
                    form={dynamicForm}
                    onFinish={onSubmit}
                    initialValues={{}}
                  >
                    {dynamics.map((param, index) => (
                      <Form.Item name={param.name} label={param.title} key={index}>
                        {getFormItem(param.mode, param.type, param.title)}
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                        查询
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button htmlType="button" icon={<UndoOutlined />} onClick={onReset}>
                        重置
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            )}
          </Panel>
        </Collapse>
      )}
    </>
  );
};

export default FilterForm;
