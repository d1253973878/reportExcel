import React, { useState, useEffect, useImperativeHandle, ReactElement } from 'react';
import { Table, notification } from 'antd';
import { TableProps as AntTableProps } from 'antd/lib/table';
import { TablePaginationConfig } from 'antd/lib/table/interface';
import { FetchParams, PageableParams } from '../data';
import { request } from '@/utils/newtec';

/**
 * 表格可配置属性，继承自 AntTableProps，因此支持 Antd Table 的全部属性
 */
export interface NewtecTableProps<T> extends AntTableProps<T>, PageableParams {
  ref?: NewtecTableComponent<T>
}

/**
 * Table 可配置属性，继承自 AntTableProps，因此支持 Antd Table 的全部属性
 */
export type NewtecTableComponent<T = any> = (
  props: NewtecTableProps<T>,
  ref?: NewtecTableComponent<T>
) => ReactElement | null;

const NewtecTable: NewtecTableComponent = React.forwardRef(<T extends {}>(props: NewtecTableProps<T>, ref: any) => {

  const defaultPageSize = 10;
  const [dataSource, updateDataSource] = useState<T[]>([]);
  const [loading, updateLoading] = useState<boolean>(false);
  const [total, updateTotal] = useState<number>(-1);
  const [pagination, updtePagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 10 });

  const fetch = (params: FetchParams = {}) => {
    const { pagination: newPagination } = params;
    var current: number = 0, pageSize: number = defaultPageSize;
    if (newPagination) {
      current = newPagination.current;
      pageSize = newPagination.pageSize;
    }
    if (!current || !pageSize) {
      current = pagination.current || 0;
      pageSize = pagination.pageSize || defaultPageSize;
    }
    const { operServiceId = "", operId = "", requestParams = {} } = props;

    // 计算需要查询的起始行和结束行
    const startRow = (current - 1) * pageSize;
    const endRow = current * pageSize;
    // 设置 loading 状态
    updateLoading(true);
    // 请求数据
    request({
      operServiceId: operServiceId,
      operId: operId,
      startRow,
      endRow,
      totalRow: total,
      data: requestParams // 请求参数
    }).then(result => { // 请求是否成功
      if (result && result.status == 0) {
        const { data } = result;
        updateLoading(false);
        updateDataSource(data.datas);
        updtePagination({
          ...pagination,
          total: data.total
        });
        updateTotal(data.total);
      } else {
        // 请求数据失败时显示提示信息
        notification.error({
          description: result ? result.error : "数据请求失败",
          message: "出错啦"
        });
        // 关闭 loading 状态
        updateLoading(false);
      }
    }, (error) => { // 请求失败的处理方法
      console.error('error', error);
      notification.error({
        description: "数据请求失败",
        message: '出错啦'
      });
    });
  };

  /**
   * 重定义 ref，对外暴露方法
   */
  useImperativeHandle(ref, () => ({
    reload: (params: FetchParams = {}) => {
      fetch(params);
    }
  }));

  // 组件渲染完成后加载数据
  useEffect(() => {
    fetch({ pagination })
  }, []);

  const tableProps = { ...props };
  delete tableProps.operId;
  delete tableProps.operServiceId;
  delete tableProps.requestParams;
  return (
    <Table<T>
      dataSource={dataSource}
      pagination={pagination}
      loading={loading}
      onChange={(pagination: TablePaginationConfig, filters: any, sorter: any) => {
        fetch({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filters,
        });
      }}
      sticky
      {...tableProps}
    />
  );
});

export default NewtecTable;