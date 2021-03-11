import React, { useEffect, useRef, useState } from 'react';
import { Modal, Spin } from 'antd';
import SqlDatasetForm, { SqlDataset } from '../SqlDatasetForm';
import SQLBuilder, { SQLBuilderOption } from '@/components/SQLBuilder';
import DatasetModalTab from '../DatasetModalTab';
import { Param } from '../DatasetMetaParamTable';
import { Field } from '../DatasetMetaFieldTable';
import styles from './index.less';
import { tip, request } from '@/utils/newtec';
import loadingStyles from '../SqlDatasetForm/index.less';

/**
 * SQL 解析配置
 */
interface SqlDatasetModalProp {
  currentReport?: any;
  title: string; //添加数据源页面标题
  onOk?: () => void; //点击处理事件确认按钮
  onCancel?: () => void; //点击处理事件取消按钮
  datasetId?: string | null; //SQL数据集信息的id，如果id为null，表示新建的数据集，否则进行查询
}

const SqlDatasetModal: React.FC<SqlDatasetModalProp> = (props) => {
  // 报表参数 table 对应数组
  const [params, setParams] = useState<Array<Param>>([]);
  // 报表参数 table 对应所有数组
  const [allParams, setAllParams] = useState<Array<Param>>([]);
  // 动态报表配置明细 table 对应数组
  const [fields, setFields] = useState<Array<Field>>([]);
  // 报表参数 table 对应数组
  const [formData, setFormData] = useState<SqlDataset>();
  // sql解析按钮 是否正在查询标识
  const [isAnalysis, setIsAnalysis] = useState<boolean>(false);

  // SQL 构造器数据部分
  const [option, setOption] = useState<SQLBuilderOption>({}); // SQL构造器返回的配置信息
  const [builderModalFlag, setBuilderModalFlag] = useState<boolean>(false); // SQL构造器显示标志
  const [connectionId, setConnectionId] = useState<string>(''); // 数据库连接ID

  useEffect(() => {
    if (props.datasetId) {
      // 显示正在加载图标
      setIsAnalysis(true);
      // id不为null
      request({
        operServiceId: 'sqlDatasetService',
        operId: 'queryDatasetInfo',
        data: props.datasetId,
      }).then((res) => {
        // 隐藏正在加载图标
        setIsAnalysis(false);

        const { status, data, error } = res;
        if (status != 0) {
          tip.error(error);
        } else {
          if (data) {
            const { dataset, fields, params } = data;
            dataset && setFormData(dataset);

            Array.isArray(params) &&
              setParams(
                params.map((param: Param, index: number) => {
                  param.key = Math.random();
                  param.index = index + 1;
                  return param;
                }),
              );

            Array.isArray(fields) &&
              setFields(
                fields.map((field: Field, index: number) => {
                  field.key = Math.random();
                  field.index = index + 1;
                  return field;
                }),
              );
          }
        }
      });
    }
  }, []);

  // form组件 更新 params 方法
  const updateParams = (paramArr: Array<Param>) => {
    setParams(paramArr);
    resetAllParams(paramArr); // 防止 用户不点击报表参数 tab标签
  };

  // form组件 更新 allParams 方法
  const resetAllParams = (paramArr: Array<Param>) => {
    setAllParams(paramArr);
  };

  // 重设 params 方法
  const resetParams = (newParamsData: Array<Param>) => {
    setParams(newParamsData);
  };

  // form组件 更新 fields 方法
  const updateFields = (filedArr: Array<Field>) => {
    setFields(filedArr);
  };

  // 重设 fields 方法
  const resetFields = (newFields: Array<Field>) => {
    // 重新设置key和排序
    setFields(
      newFields.map((field: Field, index: number) => {
        field.index = index + 1;
        field.key = Math.random();
        return field;
      }),
    );
  };

  // 绑定form表单
  const dataSetSqlForm = useRef();
  // 点击确定时，先调用form中保存api数据集信息方法 再关闭modal弹出框
  const saveSqlInfo = async () => {
    // 先调用 保存sql数据集信息的方法
    // @ts-ignore
    const saveFlag = await dataSetSqlForm.current.saveSqlInfo();
    saveFlag && props.onOk && props.onOk();
  };

  // 数据源改变时事件
  const connectionChange = (dbId: string) => {
    setConnectionId(dbId);
  };

  return (
    <>
      <Modal
        centered
        title={props.title}
        visible={true}
        zIndex={1004}
        onOk={saveSqlInfo}
        onCancel={() => {
          props.onCancel && props.onCancel();
        }}
        width={document.body.clientWidth * 0.9}
        bodyStyle={{ height: document.body.clientHeight * 0.8 }}
      >
        <div className={styles.sqlFormArea}>
          <SqlDatasetForm
            datasetId={props.datasetId}
            formData={formData}
            ref={dataSetSqlForm}
            updateFields={updateFields}
            updateParams={updateParams}
            params={allParams}
            fields={fields}
            showSqlBuilder={() => {
              setBuilderModalFlag(true);
            }}
            connectionChange={connectionChange}
          ></SqlDatasetForm>
        </div>
        <div className={styles.sqlTableColumsArea}>
          <DatasetModalTab
            fields={fields}
            params={params}
            resetParams={resetParams}
            resetAllParams={resetAllParams}
            resetFields={resetFields}
          ></DatasetModalTab>
        </div>

        {isAnalysis && (
          <div className={loadingStyles.loadingDiv}>
            <Spin />
          </div>
        )}
      </Modal>
      {builderModalFlag && (
        <SQLBuilder
          connectionId={connectionId}
          option={option}
          title={'SQL构造器'}
          onOk={(data: any) => {
            if (data !== null) {
              setOption(data);
              console.info('SQLBuilder', data);
              setBuilderModalFlag(false);
            }
          }}
          onCancel={() => {
            setBuilderModalFlag(false);
          }}
        />
      )}
    </>
  );
};

export default SqlDatasetModal;
