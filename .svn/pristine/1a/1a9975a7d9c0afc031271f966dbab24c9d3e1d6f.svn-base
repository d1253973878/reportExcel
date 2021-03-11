import React, { useState, useEffect } from 'react';
import { Table, Input, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import DatasetMetaTable from '../DatasetMetaTable';
import styles from './index.less';

/**
 * 数据集对应的动态参数信息
 */
export interface Param {
  key: number; // key
  index: number; // 序号
  name: string | null; // 参数
  remark: string | null; // 参数文本
  defaultValue: string | null; // 默认值
  orderNum: number; // 排序
}

/**
 * 动态参数 table 的列数组信息
 */
const columns: ColumnsType<Param> = [
  {
    key: 'index',
    title: '#',
    dataIndex: 'index',
  },
  {
    key: 'name',
    title: '参数',
    dataIndex: 'name',
  },
  {
    key: 'remark',
    title: '参数文本',
    dataIndex: 'remark',
  },
  {
    key: 'defaultValue',
    title: '默认值',
    dataIndex: 'defaultValue',
  },
  {
    key: 'orderNum',
    title: '排序',
    dataIndex: 'orderNum',
  },
];

/**
 * 参数
 */
interface DatasetMetaParamTableProp {
  params: Array<Param>; // table 对应的数组
  scrollY: number; // table y 方向的滚动高度数
  resetParams: (ary: Array<Param>) => void; // 重设 params 数据
  resetAllParams: (ary: Array<Param>) => void; // 重设所有报表参数数据
}

/**
 * 报表参数对应的数组
 * @param props
 */
export let allParams: Array<Param>;

/**
 * 报表参数 tab 对应展示区域
 * @param props
 */
const DatasetMetaParamTable: React.FC<DatasetMetaParamTableProp> = (props) => {
  /**
   * 新增的table对应的行数组
   */
  const [addParamsData, setAddParamsData] = useState<Array<Param>>([]);

  const colmnsHtml = columns.map((column) => {
    return (
      //@ts-ignore
      <Table.Column<Param>
        align="center"
        {...column}
        width={column.key == 'index' ? '50px' : '300px'}
        render={(text, record, index) => {
          switch (column.key) {
            case 'index':
              return text;
            default:
              return (
                <Input
                  onBlur={(e) => inputChange(column.key, index, e)}
                  defaultValue={text}
                  style={{ height: 25 }}
                  placeholder={'请填写' + column.title}
                />
              );
          }
        }}
      ></Table.Column>
    );
    // }
  });

  /**
   * 输入框内容改变后的change事件
   */
  const inputChange = (key: any, idx: number, e: any) => {
    setTimeout(() => {
      props.resetAllParams(
        [...props.params, ...addParamsData].map((param: Param, index: number) => {
          if (idx == index) {
            param[key] = e.target.defaultValue;
          }
          return param;
        }),
      );
    }, 10);
  };

  /**
   * 新增一行
   */
  const addNewRow = () => {
    // 所有行信息数组
    const allRows = [...props.params, ...addParamsData];
    let newParamsData = Array.from(addParamsData);
    newParamsData.push({
      key: Math.random(),
      index: allRows.length > 0 ? allRows[allRows.length - 1].index + 1 : 1,
      name: null,
      remark: null,
      defaultValue: null,
      orderNum: allRows.length > 0 ? allRows[allRows.length - 1].orderNum + 1 : 1,
    });

    setAddParamsData(newParamsData);
    props.resetAllParams([...props.params, ...newParamsData]);
  };

  /**
   * table选中的行信息
   */
  const [selectedRows, setSelectedRows] = useState<Array<Param>>([]);

  /**
   * 删除选中行
   */
  const delRow = () => {
    // 传递过来的行数组
    const newParamsData = props.params.filter((param: Param) => {
      // 是否需要删除的标识
      let delFlag = false;

      selectedRows.every((row: Param) => {
        if (row.key == param.key) {
          delFlag = true;
          return false;
        } else {
          return true;
        }
      });

      return !delFlag;
    });

    // 重新修改 params 序号
    props.resetParams(
      newParamsData.map((param: Param, index: number) => {
        param.index = index + 1;
        return param;
      }),
    );

    // 新增的行数组
    const newAddParamsData = addParamsData.filter((param: Param) => {
      // 是否需要删除的标识
      let delFlag = false;

      selectedRows.every((row: Param) => {
        if (row.key == param.key) {
          delFlag = true;
          return false;
        } else {
          return true;
        }
      });

      return !delFlag;
    });

    // 重新修改addParamsData序号
    setAddParamsData(
      newAddParamsData.map((param: Param, index: number) => {
        param.index = index + 1;
        return param;
      }),
    );

    setSelectedRows([]);
  };

  /**
   * 设置选中的行信息
   */
  const setSelectedRowsInfo = (rows: Array<Param>) => {
    setSelectedRows(rows);
  };

  useEffect(() => {
    // 当props.params 发生变化时 重置addParamsData的序号和排序
    const newParamsData = Array.from(addParamsData);
    const { params } = props;
    setAddParamsData(
      newParamsData.map((row: Param, index) => {
        return {
          key: Math.random(),
          index: params.length > 0 ? params[params.length - 1].index + index + 1 : index + 1,
          name: row.name,
          remark: row.remark,
          defaultValue: row.defaultValue,
          orderNum: params.length > 0 ? params[params.length - 1].orderNum + index + 1 : index + 1,
        };
      }),
    );
    props.resetAllParams([...params, ...newParamsData]);
  }, [props.params.length]);

  return (
    <div className={styles.paramsTableKuang}>
      <div className={styles.paramsTableBtn}>
        <Button type="primary" className={styles.paramsAddBtn} onClick={addNewRow}>
          新增
        </Button>
        {selectedRows.length > 0 && (
          <Button type="primary" className={styles.paramsAddBtn} onClick={delRow}>
            删除
          </Button>
        )}
      </div>
      <DatasetMetaTable
        data={[...props.params, ...addParamsData]}
        scrollY={props.scrollY}
        columns={colmnsHtml}
        setSelectedRowsInfo={setSelectedRowsInfo}
      />
    </div>
  );
};

export default DatasetMetaParamTable;
