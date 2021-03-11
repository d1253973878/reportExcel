import React, { useState, useRef, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import ApiDatasetForm from '../ApiDatasetForm';
import DatasetModalTab from '../DatasetModalTab';
import { Param } from '../DatasetMetaParamTable';
import { Field } from '../DatasetMetaFieldTable';
import { ApiDataset } from '../ApiDatasetForm';
import styles from './index.less';
import stylesForm from '../ApiDatasetForm/index.less';
import { tip, request } from '@/utils/newtec';

/**
 * 参数
 */
interface DatasetModalProp {
  currentReport?: any;
  title: string; // 弹出框标题
  onOk: () => void; // 确定按钮对应click事件
  onCancel: () => void; // 取消按钮对应click事件
  datasetId?: string | null; // api 数据集信息的id 如果id为null 表示新建的api数据集 否则进行查询
}

/**
 * api数据集弹出框
 * @param props
 */
const DatasetModal: React.FC<DatasetModalProp> = (props) => {
  // 报表参数 table 对应数组
  const [params, setParams] = useState<Array<Param>>([]);
  // 报表参数 table 对应所有数组
  const [allParams, setAllParams] = useState<Array<Param>>([]);
  // form 对应数组
  const [formData, setFormData] = useState<ApiDataset>();
  // api解析按钮 是否正在查询标识
  const [isAnalysis, setIsAnalysis] = useState<boolean>(false);

  // 根据 datasetId 判断是否需要进行初始化加载数据
  useEffect(() => {
    if (props.datasetId) {
      setIsAnalysis(true); // 显示Loading
      request({
        operServiceId: 'apiDatasetService',
        operId: 'queryDatasetInfo',
        data: props.datasetId,
      }).then(res => {
        setIsAnalysis(false);

        const { status, data, error } = res;
        if (status != 0) {
          tip.error(error)
        }
        if (data) {
          const { dataset, fields, params } = data;
          dataset && setFormData(dataset);
          if (Array.isArray(params)) {
            const pData = params.map((param: Param, index: number) => {
              param.key = Math.random();
              param.index = index + 1;
              return param;
            });
            setParams(pData);
            updateParams(pData);
          }
          if (Array.isArray(fields)) {
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

  // form 组件 更新 params 方法
  const updateParams = (newParams: Array<Param>) => {
    setParams(newParams);
    // 防止用户不点击报表参数tab标签
    resetAllParams(newParams);
  };

  // form组件 更新 allParams 方法
  const resetAllParams = (paramsAry: Array<Param>) => {
    setAllParams(paramsAry);
  };

  // 重设 params 方法
  const resetParams = (newParamsData: Array<Param>) => {
    setParams(newParamsData);
  };

  // 动态报表配置明细 table 对应数组
  const [fields, setFields] = useState<Array<Field>>([]);

  // form组件更新 fields 方法
  const updateFields = (newFields: Array<Field>) => {
    setFields(newFields);
  };

  // 重设 fields 方法
  const resetFields = (newFields: Array<Field>) => {
    // 重新设置 key 和 排序
    setFields(
      newFields.map((field: Field, index: number) => {
        field.index = index + 1;
        field.key = Math.random();
        return field;
      }),
    );
  };

  // 绑定到form表单
  const datasetModalForm = useRef();

  // 点击确定时 先调用form中保存api数据集信息方法 再关闭modal弹出框
  const saveDataset = async () => {
    // 先调用 保存api数据集信息的方法
    // @ts-ignore
    const saveFlag = await datasetModalForm.current.saveDataset();

    if (saveFlag) {
      props.onOk();
    }
  };

  // 关闭modal框
  const closeModal = () => {
    props.onCancel();
  };

  return (
    <>
      <Modal
        centered
        title={props.title}
        visible={true}
        zIndex={1004}
        onOk={saveDataset}
        onCancel={closeModal}
        width={document.body.clientWidth * 0.9}
        bodyStyle={{ height: document.body.clientHeight * 0.8 }}
      >
        <div className={styles.modalFormArea}>
          <ApiDatasetForm
            datasetId={props.datasetId}
            formData={formData}
            ref={datasetModalForm}
            updateFields={updateFields}
            updateParams={updateParams}
            params={allParams}
            fields={fields}
          />
        </div>
        <div className={styles.modalTableColumsArea}>
          <DatasetModalTab
            resetAllParams={resetAllParams}
            fields={fields}
            params={params}
            resetParams={resetParams}
            resetFields={resetFields}
          ></DatasetModalTab>
        </div>
        {isAnalysis && (
          <div className={stylesForm.loadingDiv}>
            <Spin />
          </div>
        )}
      </Modal>
    </>
  );
};

export default DatasetModal;
