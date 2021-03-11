import React from 'react';
import { Tabs } from 'antd';
import DatasetMetaFieldTable, { Field } from '../DatasetMetaFieldTable';
import DatasetMetaParamTable, { Param } from '../DatasetMetaParamTable';

const { TabPane } = Tabs;

function callback(key: string) {
  console.log(key);
}

/**
 * 参数
 */
interface DatasetModalTabProp {
  fields: Array<Field>; // 动态报表配置明细对应数组
  params: Array<Param>; // 报表参数table对应的数组
  resetParams: (ary: Array<Param>) => void; // 重设 params 方法
  resetFields: (ary: Array<Field>) => void; // 重设 fields 方法
  resetAllParams: (ary: Array<Param>) => void; // 重设所有报表参数数据
}

/**
 * api数据集 解析后对应的tab块
 * @param props
 */
const DatasetModalTab: React.FC<DatasetModalTabProp> = (props) => {
  
  // 重设动态参数信息
  const resetParams = (newParamsData: Array<Param>) => {
    props.resetParams(newParamsData);
  };

  // 重设字段信息
  const resetFields = (newFiledData: Array<Field>) => {
    props.resetFields(newFiledData);
  };

  // 重设所有报表参数数据
  const resetAllParams = (newParamsData: Array<Param>) => {
    props.resetAllParams(newParamsData);
  };

  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="动态报表配置明细" key="1">
        <DatasetMetaFieldTable
          fields={props.fields}
          resetFields={resetFields}
          scrollY={document.body.clientHeight * 0.8 - 380}
        />
      </TabPane>
      <TabPane tab="报表参数" key="2">
        <DatasetMetaParamTable
          resetAllParams={resetAllParams}
          params={props.params}
          resetParams={resetParams}
          scrollY={document.body.clientHeight * 0.8 - 380}
        />
      </TabPane>
    </Tabs>
  );
};

export default DatasetModalTab;
