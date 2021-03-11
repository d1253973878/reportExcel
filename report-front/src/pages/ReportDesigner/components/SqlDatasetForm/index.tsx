import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Form, Input, Button, Checkbox, Select, Space, Spin } from 'antd';
import DatasourceModal from '../DatasourceModal';
import styles from './index.less';
import { getAllConnectionIDAndName } from './service';
import { Param } from '../DatasetMetaParamTable';
import { Field } from '../DatasetMetaFieldTable';
import { FormInstance } from 'antd/lib/form';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { tip, request } from '@/utils/newtec';

const { Option } = Select;
const { TextArea } = Input;
/**
 * sql解析配置
 */
interface SqlDatasetFormProp {
  updateFields: (param: any) => void; // 更新动态报表配置明细数组
  updateParams: (param: any) => void; // 更新报表参数数组
  fields: Array<Field>; // 动态报表配置明细数组
  params: Array<Param>; // 报表参数数组
  refInstance?: any;
  ref?: any;
  formData?: SqlDataset; // form表单对应数据
  datasetId?: string | null | undefined; // sql数据集id 如果为number 表示编辑
  showSqlBuilder?: () => void; // 显示sqlBuilder
  connectionChange?: (id: string) => void;
  currentReport?: any;
}

/**
 * SQL数据集更新表单
 */
export interface SqlDataset {
  code: string; // 编码
  name: string; // 名称
  pageable: boolean; // 是否分页
  connectionId: string; // 数据源
  dbSql: string; // 数据库SQL语句
}

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

/**
 * sql解析
 * @param props
 */
let SqlDatasetForm: React.FC<SqlDatasetFormProp> = (props) => {
  const [sqlDbFlag, setSqlDbFlag] = useState<boolean>(false);
  const handOk = () => {
    setSqlDbFlag(false);
  };

  const handCancel = () => {
    setSqlDbFlag(false);
  };

  // 下拉选择框数据源数组
  const [datasourceOptions, setDatasourceOptions] = useState<{ title: string; value: string }[]>(
    [],
  );

  // 请求后台加载数据源信息
  useEffect(() => {
    getAllConnectionIDAndName().then(function (res) {
      const { status, data } = res;
      const options = [];
      if (status == 0 && Array.isArray(data)) {
        for (let item of data) {
          options.push({ value: item.id, title: item.name });
        }
        setDatasourceOptions(options);
      }
    });
  }, []);

  useEffect(() => {
    const { formData } = props;
    formData && formRef.current?.setFieldsValue({ ...formData });
  }, [props.formData]);

  //获取report对象
  const { currentReport } = props;

  const formRef = React.createRef<FormInstance>(); // 表单对象

  // 保存 SQL 数据集
  const saveSqlInfo = async () => {
    // 校验表单数据是否合法
    let saveFlag = await formRef.current?.validateFields().catch((errorInfo) => {
      return errorInfo.errorFields;
    });
    if (saveFlag.length > 0) {
      tip.error('表单数据不合法');
      return false;
    }
    saveFlag = await formRef.current?.validateFields().then(async (values) => {
      const { fields, datasetId, params } = props;
      // 判断动态报表配置明细
      if (fields == null || fields.length == 0) {
        tip.error('请返回正确的动态配置明细信息');
        return false;
      }
      setIsAnalysis(true);
      const postData = {
        dataset: { id: datasetId, reportId: currentReport.id, ...values }, //form数据
        params: params, //参数数组
        fields: fields, //动态报表配置明细数组
      };
      const saveFlag = await request({
        operServiceId: 'sqlDatasetService',
        operId: 'saveDataset',
        data: postData,
      }).then((res) => {
        setIsAnalysis(false);
        const { status, error } = res;
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
    saveSqlInfo,
  }));

  // SQL 解析按钮, 是否正在查询标识
  const [isAnalysis, setIsAnalysis] = useState<boolean>(false);

  /**
   * 根据SQL解析SQL中的动态参数，如select * from table where a  !=  ${test22} and b =${aa} or c like ${ cc }
   * @param sql 查询SQL，必须以 `select` 开头
   */
  const paraseSQLParams = (sql: string) => {
    const tmpValue = sql.toLowerCase();
    const whereIndex = tmpValue.indexOf(' where ');
    if (!tmpValue.trim().startsWith('select')) {
      console.error('查询 SQL 不合法');
      return [];
    }
    if (whereIndex == -1) {
      console.error('未匹配到参数');
      return [];
    }
    // 得到 `where` 后面的条件部分
    const where = sql.substring(whereIndex + 7);
    console.log('where: ' + where);
    // 以` and ` 或 ` or ` 连接符切分字符串，得到所有的查询条件
    const params = where.split(/ and | or /i); // /i表示不区分大小写
    const result = []; // 保存解析到的用户自定义参数
    let index = 1;
    for (let param of params) {
      // 以` like ` 或 `=` 或 `>` 或 `<` 或 `<=` 或 `>=` 或 `!=` 操作符切分字符串，得到操作符两边的表达式
      let operators = param.split(/ like |=|<|>|>=|<=|!=/i); // /i表示不区分大小写
      if (operators.length == 2) {
        // 遍历操作符两边的字符，删除起始和结束的空格
        operators.forEach((item, index, array) => {
          operators[index] = operators[index].trim();
        });
        let pv = operators[1]; // 操作符右边的表达式（一般是值）
        if (pv.startsWith('${') && pv.endsWith('}')) {
          let pName = pv.slice(2, -1); // operators[0]
          result.push({
            key: Math.random(),
            index: index,
            name: pName,
            remark: pName,
            defaultValue: null,
            orderNum: index,
          });
          index++;
        }
      }
    }
    return result;
  };

  // SQL 改变时, 解析参数 回填报表参数表格
  const sqlUrlChange = (e: any) => {
    const {
      target: { value },
    } = e;
    // 以 and 进行分组 转换为 params 对应table的数组格式化
    props.updateParams(paraseSQLParams(value));
    return true;
  };

  const onFinish = (values: SqlDataset) => {
    setIsAnalysis(true);
    request({
      operServiceId: 'sqlDatasetService',
      operId: 'analysisDatasetFields',
      data: {
        dataset: {
          connectionId: values.connectionId,
          dbSql: values.dbSql,
          pageable: values.pageable ? 1 : 0,
        },
        params: props.params,
      },
    }).then((res) => {
      setIsAnalysis(false);
      const { status, data, error } = res;
      if (status != 0) {
        tip.error(error);
      } else {
        props.updateFields(
          data.map((field: Field, index: number) => {
            field.key = Math.random();
            field.index = index + 1;
            return field;
          }),
        );
      }
    });
  };

  /**
   * 提交表单数据验证失败后回调事件
   * @param error
   */
  const onFinishFailed = (error: any) => {
    console.log('SQL数据集表单数据验证失败:', error);
  };

  /**
   * 切换数据源的回调
   */
  const connectionChange = (value: any) => {
    props.connectionChange && props.connectionChange(value);
  };

  return (
    <>
      <Form
        ref={formRef}
        {...layout}
        name="basic"
        initialValues={{
          pageable: false,
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

        <Space>
          <Form.Item className={styles.formRequestType} label="数据源:" name="connectionId">
            <Select
              placeholder="请选择数据源"
              style={{ width: 150 }}
              dropdownStyle={{ zIndex: 1005 }}
              onChange={connectionChange}
            >
              {datasourceOptions.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className={styles.formSubmit}>
            <Button type="primary" htmlType="submit" onClick={() => setSqlDbFlag(true)}>
              数据源维护
            </Button>
          </Form.Item>
        </Space>

        <Form.Item
          className={styles.formApiUrl}
          label="报表SQL："
          name="dbSql"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[
            {
              required: true,
              message: '请输入正确的查询SQL',
            },
          ]}
        >
          <TextArea
            allowClear={true}
            showCount={true}
            placeholder="请输入查询SQL"
            rows={4}
            style={{ resize: 'none' }}
            onChange={sqlUrlChange}
          />
        </Form.Item>

        <Form.Item className={styles.formBtn}>
          <Button type="primary" className={styles.formBtnItem} htmlType="submit">
            SQL解析
          </Button>
          <br />
          <Button
            type="primary"
            className={styles.formBtnItem}
            htmlType="button"
            onClick={() => {
              props.showSqlBuilder && props.showSqlBuilder();
            }}
          >
            SQL构造器
          </Button>
        </Form.Item>
        {isAnalysis && (
          <div className={styles.loadingDiv}>
            <Spin />
          </div>
        )}
      </Form>
      {sqlDbFlag && <DatasourceModal title={'数据源维护'} onOk={handOk} onCancel={handCancel} />}
    </>
  );
};

SqlDatasetForm = connect(({ report }: ConnectState) => ({
  currentReport: report.currentReport,
}))(SqlDatasetForm);

export default React.forwardRef((props: SqlDatasetFormProp, ref) => (
  <SqlDatasetForm {...props} refInstance={ref} />
));
