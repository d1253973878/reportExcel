import React, { useState } from 'react';
import SpreadSheet from '@/components/SpreadSheet';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { match } from 'react-router-dom';
import { Row, Col } from 'antd';
import styles from './index.less';
import FilterForm from './components/FilterForm';

export interface ReportPreviewProps {
  dispatch?: Dispatch;
  match?: match
}

/**
 * 报表设计器预览页面布局
 * @param props 
 */
const ReportPreview: React.FC<ReportPreviewProps> = (props) => {
  // @ts-ignore
  const { dispatch, match: { params } } = props;
  const [filterParams, setFilterParams] = useState<{}>({});
  return (
    <>
      <FilterForm id={params.id} onFinish={(values) => {
        setFilterParams(values);
      }}></FilterForm>
      <Row className={styles.reportRow}>
        <Col span={24}>
          <SpreadSheet preview
            filterParams={filterParams}
            options={{
              mode: 'read',
              showToolbar: false,
              showPrintbar: true,
              showContextmenu: false,
              showGrid: false
            }} id={params.id}
          />
        </Col>
      </Row>
    </>
  );
};

export default connect(({ report }: ConnectState) => ({
  currentReport: report.currentReport
}))(ReportPreview);