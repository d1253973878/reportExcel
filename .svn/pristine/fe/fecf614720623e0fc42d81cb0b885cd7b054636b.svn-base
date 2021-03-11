import React, { useState } from 'react';
import { Table } from 'antd';

/**
 * 参数
 */
interface DatasetMetaTableProp {
  data: Array<any>; // 行数据数组
  scrollY: number; // Table y 方向 滚动高度值
  columns: Array<Object>; // 行对应的展示代码
  setSelectedRowsInfo: (param: any) => void; // 设置选中的keys
}

/**
 * 自定义 table 组件
 * @param props
 */
const DatasetMetaTable: React.FC<DatasetMetaTableProp> = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);

  const rowSelection: object = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<string>, selectedRows: Array<Object>) => {
      setSelectedRowKeys(selectedRowKeys);
      props.setSelectedRowsInfo(selectedRows);
    },
  };

  return (
    <>
      <Table
        rowSelection={rowSelection}
        dataSource={props.data}
        pagination={false}
        scroll={{ y: props.scrollY }}
      >
        {props.columns.map((column) => column)}
      </Table>
    </>
  );
};

export default DatasetMetaTable;
