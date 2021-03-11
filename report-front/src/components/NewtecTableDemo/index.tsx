import React from 'react';
import NewtecTable from '@/components/NewtecTable'

const columns = [
  {
    title: '主键',
    dataIndex: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
];

export default class NewtecTableDemo extends React.Component {
  render() {
    return (
      <NewtecTable
        operServiceId="reportService"
        operId="queryReportList"
        columns={columns}
        rowKey="id"
      />
    );
  }
}