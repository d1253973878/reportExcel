import React, { useEffect } from 'react';
import { Modal } from 'antd';
import reportConfig from '../../../config/reportConfig';
import styles from './index.less';

/**
 * 参数
 */
export interface SQLBuilderProps {
  title: string; // 弹出框标题
  option?: SQLBuilderOption,
  onOk: (data: any) => void; // 确定按钮对应click事件
  connectionId: string,
  onCancel: () => void;
}

export interface SQLBuilderOption {
  sql?: string, // SQL
  tableName?: string, // 当前操作表名
  advancve?: Object, // 高级配置
}

const SQLBuilder: React.FC<SQLBuilderProps> = (props) => {

  const apiOptions = Object.assign({}, reportConfig);

  // 初始 化SQL 构造器
  useEffect(() => {
    if (QueryBuilderPage) {
      QueryBuilderPage.create(document.getElementById("query-builder-container"), props.connectionId, props.option);
    } else {
      initSQLBuilder(apiOptions, function () {
        QueryBuilderPage.create(document.getElementById("query-builder-container"), props.connectionId, props.option);
      });
    }
  }, []);

  return (
    <>
      <Modal
        className={styles.builderModal}
        centered
        title={props.title}
        visible={true}
        zIndex={1004}
        onOk={() => {
          props.onOk(QueryBuilderPage.getData());
        }}
        onCancel={() => {
          props.onCancel();
        }}
        width={document.body.clientWidth * 0.95}
        bodyStyle={{ height: document.body.clientHeight * 0.8 }}
      >
        <div className={styles.builderContainer} id="query-builder-container"></div>
      </Modal>
    </>
  );
};

export default SQLBuilder;