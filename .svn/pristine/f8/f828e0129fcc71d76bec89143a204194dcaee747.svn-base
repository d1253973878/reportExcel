import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import { DesktopOutlined, AppstoreOutlined } from '@ant-design/icons';
import ReportList from './components/ReportList';
import styles from './index.less'

/**
 * 报表列表页
 */
interface ReportTableProps {
}

const { TabPane } = Tabs;

const ReportTable: React.FC<ReportTableProps> = (props) => {
  return (
    <PageContainer className={styles.tabPage}>
      <Tabs defaultActiveKey="1">
        <TabPane
          key="1"
          tab={
            <span>
              <DesktopOutlined />
              报表设计
            </span>
          }
        >
          <ReportList enableAdd />
        </TabPane>
        <TabPane
          key="2"
          tab={
            <span>
              <AppstoreOutlined />
              模板案例
            </span>
          }
        >
          <ReportList template={1}/>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default ReportTable;