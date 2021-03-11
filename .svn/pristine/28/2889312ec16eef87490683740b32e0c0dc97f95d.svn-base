import React, { useState } from 'react';
import { Table, Input, Select, Checkbox, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import DatasetMetaTable from '../DatasetMetaTable';
import styles from '../DatasetMetaParamTable/index.less';

/**
 * 数据集对应的字段信息
 */
export interface Field {
  key: number; // key
  index: number; // # 序号
  name: string; // 字段名
  orderNum: number | string; // 排序
  remark: string; // 字段文本
  type: number; // 类型
  dictionary: string; // 字典code
  searchFlag: boolean; // 查询
  searchMode: number; // 查询模式
}

/**
 * 字段 table 的列配置信息
 */
const columns: ColumnsType<Field> = [
  {
    key: 'index',
    title: '#',
    dataIndex: 'index',
  },
  {
    key: 'name',
    title: '字段名',
    dataIndex: 'name',
  },
  {
    key: 'orderNum',
    title: '排序',
    dataIndex: 'orderNum',
  },
  {
    key: 'remark',
    title: '字段文本',
    dataIndex: 'remark',
  },
  {
    key: 'type',
    title: '类型',
    dataIndex: 'type',
  },
  {
    key: 'dictionary',
    title: '字典code',
    dataIndex: 'dictionary',
  },
  {
    key: 'searchFlag',
    title: '查询',
    dataIndex: 'searchFlag',
  },
  {
    key: 'searchMode',
    title: '查询模式',
    dataIndex: 'searchMode',
  },
];

/**
 * 参数
 */
interface DatasetMetaFieldTableProp {
  fields: Array<Field>; // tab对应表格的table行数组
  scrollY: number; // table y 方向的滚动高度数
  resetFields: (param: any) => void; // 重设 fields 方法
}

/**
 * 数据集动态报表配置明细（字段信息）组件
 */
const DatasetMetaFieldTable: React.FC<DatasetMetaFieldTableProp> = (props) => {
  /**
   * table选中的行信息
   */
  const [selectedRows, setSelectedRows] = useState<Array<Field>>([]);

  /**
   * 设置选中的行信息
   */
  const setSelectedRowsInfo = (rows: Array<Field>) => {
    setSelectedRows(rows);
  };

  const colmnsHtml = columns.map((column) => {
    return (
      //@ts-ignore
      <Table.Column<Field>
        align="center"
        {...column}
        width={column.key == 'index' || column.key == 'searchFlag' ? '70px' : '180px'}
        render={(text, record, index) => {
          switch (column.key) {
            case 'index':
              return text;
            case 'type':
              return (
                <Select
                  filterOption={false}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  dropdownStyle={{ zIndex: 1005 }}
                  defaultValue={text}
                  options={[
                    { label: '数值类型', value: 0 },
                    { label: '字符类型', value: 1 },
                    { label: '日期类型', value: 2 },
                    { label: '时间类型', value: 3 },
                  ]}
                  onChange={(value) => {
                    valueOnChange(value, column.key, index);
                  }}
                />
              );
            case 'searchMode':
              return (
                <Select
                  filterOption={false}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  dropdownStyle={{ zIndex: 1005 }}
                  defaultValue={text}
                  options={[
                    { label: '单条件查询', value: 0 },
                    { label: '范围查询', value: 1 },
                    { label: '多选查询', value: 2 },
                  ]}
                  onChange={(value) => {
                    valueOnChange(value, column.key, index);
                  }}
                />
              );
            case 'searchFlag':
              return (
                <Checkbox
                  defaultChecked={text}
                  onChange={(e) => {
                    valueOnChange(e.target.checked, column.key, index);
                  }}
                />
              );
            default:
              return (
                <Input
                  defaultValue={text}
                  style={{ height: 25 }}
                  placeholder={'请填写' + column.title}
                  onBlur={(e) => {
                    valueOnChange(e.target.value, column.key, index);
                  }}
                />
              );
          }
        }}
      ></Table.Column>
    );
    // }
  });

  /**
   * 当输入框或者select或者checkbox值发生变化时调用
   */
  const valueOnChange = (val: any, key: any, idx: number) => {
    setTimeout(() => {
      props.resetFields(
        props.fields.map((field: Field, index: number) => {
          if (idx == index) {
            field[key] = key == 'orderNum' ? parseInt(val) : val;
          }
          return field;
        }),
      );
    }, 10);
  };

  /**
   * 删除选中行
   */
  const delRow = () => {
    // 传递过来的行数组
    props.resetFields(
      props.fields.filter((param: Field) => {
        // 是否需要删除的标识
        let delFlag = false;

        selectedRows.every((row: Field) => {
          if (row.key == param.key) {
            delFlag = true;
            return false;
          } else {
            return true;
          }
        });

        return !delFlag;
      }),
    );

    setSelectedRows([]);
  };

  return (
    <div className={styles.paramsTableKuang}>
      {selectedRows.length > 0 && (
        <div className={styles.paramsTableBtn}>
          <Button type="primary" className={styles.paramsAddBtn} onClick={delRow}>
            删除
          </Button>
        </div>
      )}
      <DatasetMetaTable
        data={props.fields}
        scrollY={props.scrollY}
        setSelectedRowsInfo={setSelectedRowsInfo}
        columns={colmnsHtml}
      />
    </div>
  );
};

export default DatasetMetaFieldTable;
