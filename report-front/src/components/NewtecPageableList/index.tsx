import React, { useState, useEffect, useImperativeHandle, ReactElement } from 'react';
import { List, notification } from 'antd';
import { ListProps as AntListProps } from 'antd/lib/list';
import { PaginationConfig } from 'antd/lib/pagination';
import { RecordType, FetchParams, PageableParams } from '../data.d';
import { request } from '@/utils/newtec';

/**
 * List 可配置属性，继承自 ListProps，因此支持 Antd List 的全部属性
 */
export type NewtecPageableListComponent<T = any> = (
  props: NewtecPageableListProps<T>,
  ref?: NewtecPageableListComponent<T>
) => ReactElement | null;

/**
 * 声明List组件类型
 */
export interface NewtecPageableListProps<T> extends AntListProps<T>, PageableParams {
  ref?: NewtecPageableListComponent<T>
  enableAdd?: boolean // 是否允许新增，若 true 则会显示新增按钮
}

const NewtecPageableList: NewtecPageableListComponent = React.forwardRef(<T extends RecordType>(props: NewtecPageableListProps<T>, ref: any) => {
  const defaultPageSize = 8;
  const [dataSource, updateDataSource] = useState<T[]>([]);
  const [loading, updateLoading] = useState<boolean>(false);
  const [total, updateTotal] = useState<number>(-1);
  const [pagination, updtePagination] = useState<PaginationConfig>({ current: 1, pageSize: defaultPageSize });
  const { enableAdd } = props;
  /**
   * 加载数据
   * @param params 
   */
  const fetch = async (params: FetchParams = {}) => {
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

    // List 组件分页是 pageSize，而服务器分页大小需要减一（List组件分页大小加上了“新建按钮”，所以服务器实际上需要减 1）
    // 否则 List 显示会错乱（List内部会根据页号和页大小计算显示的数据）
    const serverPageSize = enableAdd ? pageSize - 1 : pageSize;
    // 计算需要查询的起始行和结束行
    const startRow = (current - 1) * serverPageSize;
    const endRow = current * serverPageSize;
    // 设置 loading 状态
    updateLoading(true);
    // 请求数据
    await request({
      operServiceId: operServiceId,
      operId: operId,
      startRow,
      endRow,
      totalRow: total,
      data: requestParams // 请求参数
    }).then(result => { // 请求是否成功
      if (result && result.status == 0) {
        const { data, data: { datas } } = result;
        enableAdd && datas.unshift({});
        updateLoading(false);
        updateDataSource(datas);
        updtePagination({
          ...newPagination,
          current,
          pageSize,
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
  delete tableProps.enableAdd;
  return (
    <List<T>
      itemLayout="vertical"
      size="large"
      grid={{
        gutter: 16,
        column: 4,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      pagination={{
        ...pagination,
        onChange: (page: number, pageSize: number | undefined) => {
          fetch({ pagination: { current: page, pageSize } });
        }
      }}
      loading={loading}
      dataSource={dataSource}
      {...tableProps}
    />
  );
});

export default NewtecPageableList;