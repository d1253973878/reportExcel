import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import styles from './index.less';
import { Param } from '../DatasetMetaParamTable';
import { Field } from '../DatasetMetaFieldTable';
import { Spin } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { tip, request } from '@/utils/newtec';

const { Option } = Select;
const { TextArea } = Input;

// form 格式
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

/**
 * 参数
 */
interface ApiDatasetFormProp {
  updateFields: (param: any) => void; // 更新动态报表配置明细数组
  updateParams: (param: any) => void; // 更新报表参数数组
  params: Array<Param>; // 报表参数数组
  fields: Array<Field>; // 动态报表配置明细数组
  refInstance?: any; // refInstance
  ref?: any; // ref
  formData?: ApiDataset; // form 对应的数据
  datasetId?: string | null | undefined; // api数据集id 如果为number 表示编辑
  currentReport?: any;
}

/**
 *
 * @param props 表单对象
 */
export interface ApiDataset {
  code: string; // 编码
  name: string; // 名称
  pageable: boolean; // 是否分页
  requestType: string; // 请求方式
  url: string; // api地址
}

/**
 * api数据集 api解析数据form表单
 * @param props
 */
let ApiDatasetForm: React.FC<ApiDatasetFormProp> = (props) => {
  useEffect(() => {
    if (props.formData != undefined && props.formData != null) {
      props.formData.requestType = props.formData.requestType + '';
      formRef.current?.setFieldsValue({ ...props.formData });
    }
  }, [props.formData]);

  // 获取report对象
  const { currentReport } = props;

  // 表单对象
  const formRef = React.createRef<FormInstance>();

  // 保存 API 数据集 fields、params 以及数据集相关信息
  const saveDataset = async () => {
    // 保存之前先校验
    // 判断 form 必填信息
    let saveFlag = await formRef.current?.validateFields().catch((error) => {
      return error.errorFields;
    });

    // 如果存在错误信息 则弹出提示框
    if (saveFlag.length > 0) {
      tip.error('表单验证存在错误');
      return false;
    }

    saveFlag = await formRef.current?.validateFields().then(async (values) => {
      if (props.fields == null || props.fields.length == 0) {
        tip.error('请返回正确的动态配置明细信息');
        return false;
      }

      // 将 isAnalysis 设置为 true
      setIsAnalysis(true);

      // 组织数据
      const postData = {
        dataset: { id: props.datasetId, reportId: currentReport.id, ...values }, // form 数据
        params: props.params, // 参数数组
        fields: props.fields, // 动态报表配置明细数组
      };

      // 保存 如果失败 返回false
      const saveFlag = await request({
        operServiceId: 'apiDatasetService',
        operId: 'saveDataset',
        data: postData,
      }).then((res) => {
        const { status, error } = res;
        setIsAnalysis(false);
        if (status != 0) {
          tip.error(error);
          return false;
        }
        tip.success('保存成功');
        return true;
      });

      return saveFlag;
    });

    return saveFlag;
  };

  const { refInstance } = props;

  useImperativeHandle(refInstance, () => ({
    saveDataset,
  }));

  // api解析按钮 是否正在查询标识
  const [isAnalysis, setIsAnalysis] = useState<boolean>(false);

  // api数据集url改变时 调用方法 用来解析参数 回填报表参数报表
  const requestUrlChange = (e: any) => {
    let value = e.target.value;
    if (value.indexOf('?') < 0) {
      props.updateParams([]);
      return false;
    }

    // 带 ? 截取?后面的部分 不带=号/不带{}号 返回
    let index = value.indexOf('?');
    if (index == -1) {
      props.updateParams([]);
      return false;
    }
    const urlParams: string = value.substring(index + 1);

    // 以 & 进行分组 转换为params 对应table的数据格式数组
    let params = urlParams.split('&');
    let result = [];
    for (let i = 0; i < params.length; i++) {
      let param = params[i],
        index1 = param.indexOf('=${'),
        index2 = param.lastIndexOf('}');
      if (index1 > 0 && index2 > 0) {
        let name = param.substring(index1 + 3, index2);
        result.push({
          key: Math.random(),
          index: i + 1,
          name: name,
          remark: name,
          defaultValue: null,
          orderNum: i + 1,
        });
      }
    }
    props.updateParams(result);
    return true;
  };

  // 提交表单且数据验证成功后回调事件
  const onFinish = (values: ApiDataset) => {
    // 将 isAnalysis 设置为 true
    setIsAnalysis(true);

    console.log('Success:', values);
    // 先验证是否输入的requestUrl可以正确返回信息
    request({
      operServiceId: 'apiDatasetService',
      operId: 'analysisDatasetFields',
      data: {
        dataset: {
          requestType: parseInt(values.requestType),
          url: values.url,
          pageable: values.pageable ? 1 : 0,
        },
        params: props.params,
      },
    }).then(res => {
      const {status, error} = res;
      setIsAnalysis(false);
      if (status != 0) {
        tip.error(error);
        return false;
      }

      // 将返回来的动态报表配置明细展示出来
      if (res.data) {
        props.updateFields(
          res.data.map((field: Field, index: number) => {
            field.key = Math.random();
            field.index = index + 1;
            return field;
          }),
        );
      }
    });
  };

  // 提交表单且数据验证失败后回调事件
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      ref={formRef}
      {...layout}
      name="basic"
      initialValues={{
        pageable: false,
        requestType: '1',
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        className={styles.formCode}
        label="编码:"
        name="code"
        rules={[
          {
            required: true,
            message: '请输入编码',
          },
        ]}
      >
        <Input
          placeholder="请输入编码"
          disabled={props.datasetId != undefined && props.datasetId != null}
        />
      </Form.Item>

      <Form.Item
        className={styles.formName}
        label="名称:"
        name="name"
        rules={[
          {
            required: true,
            message: '请输入名称',
          },
        ]}
      >
        <Input placeholder="请输入名称" />
      </Form.Item>

      <Form.Item className={styles.formHasPage} name="pageable" valuePropName="checked">
        <Checkbox>是否分页</Checkbox>
      </Form.Item>

      <Form.Item className={styles.formRequestType} label="请求方式:" name="requestType">
        <Select style={{ width: 120 }} dropdownStyle={{ zIndex: 1005 }}>
          <Option value="0">get</Option>
          <Option value="1">post</Option>
        </Select>
      </Form.Item>
      <Form.Item
        className={styles.formApiUrl}
        label="Api地址:"
        name="url"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        rules={[
          {
            required: true,
            pattern: new RegExp(
              '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
            ),
            message: '请输入正确的Api地址',
          },
        ]}
      >
        <TextArea
          allowClear={true}
          showCount={true}
          placeholder="请输入Api地址"
          rows={4}
          style={{ resize: 'none' }}
          onChange={requestUrlChange}
        />
      </Form.Item>
      <Form.Item className={styles.formSubmit}>
        <Button type="primary" htmlType="submit">
          Api解析
        </Button>
      </Form.Item>
      {isAnalysis && (
        <div className={styles.loadingDiv}>
          <Spin />
        </div>
      )}
    </Form>
  );
};

ApiDatasetForm = connect(({ report }: ConnectState) => ({
  currentReport: report.currentReport,
}))(ApiDatasetForm);

export default React.forwardRef((props: ApiDatasetFormProp, ref) => (
  <ApiDatasetForm {...props} refInstance={ref} />
));
