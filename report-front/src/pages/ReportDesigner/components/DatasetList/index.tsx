import React, { useState } from 'react';
import { DatabaseOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { Collapse, Space, Popconfirm } from 'antd';
import DatasetModal from '../DatasetModal';
import SqlDatasetModal from '../SqlDatasetModal';
import { tip, request } from '@/utils/newtec';
import styles from './index.less';

/**
 * 数据集配置项（主要包含数据集的名称以及字段信息）
 */
export interface DatesetItem {
  id?: string; // 数据集id
  name: string; // 数据集名称
  code: string; // 数据集编码
  title?: string; // DatasetModal 的标题
  fields: DatesetField[]; // 字段信息
  dsType: number; // 数据集类型 1 sql 2 api
}

/**
 * 数据集字段配置
 */
export interface DatesetField {
  name: string; // 字段名称（英文）
  remark: string; // 字段标题
}

/**
 * 数据集字段配置
 */
export interface DatesetProp {
  datasets: DatesetItem[]; // 数据集列表数组
  handleOk: () => void; // 编辑成功后 刷新数据集列表
}

/**
 * DatasetModal 组件 param对象
 */
export interface DatasetModalParam {
  title: string; // modal 的 title
  onOk: () => void; // 点击 modal 确定 按钮 时调用的方法
  onCancel: () => void; // 点击 modal 取消 按钮 时调用的方法
  datasetId?: string; // 数据集 ID
}

const { Panel } = Collapse;

/**
 * 左边数据集管理
 * @param props
 */
const DatasetList: React.FC<DatesetProp> = (props) => {
  // 关闭modal 并执行刷新数据集列表
  const handleOk = () => {
    props.handleOk();
    handleCancel();
  };

  // 关闭 modal
  const handleCancel = () => {
    setSqlModalFlag(false);
    setApiModalFlag(false);
  };

  // 显示api数据集的标识
  const [apiModalFlag, setApiModalFlag] = useState<boolean>(false);
  // DatasetModal 组件 param对象
  const [apiModalParam, setApiModalParam] = useState<DatasetModalParam>({
    title: 'API数据集设置',
    onOk: handleOk,
    onCancel: handleCancel,
    datasetId: '',
  });

  // 显示api数据集的标识
  const [sqlModalFlag, setSqlModalFlag] = useState<boolean>(false);
  // DatasetModal 组件 param对象
  const [sqlModalParam, setSqlModalParam] = useState<DatasetModalParam>({
    title: 'SQL数据集设置',
    onOk: handleOk,
    onCancel: handleCancel,
    datasetId: '',
  });

  const { datasets } = props;

  /**
   * 通过id 删除对应的数据集
   */
  const delApiDataSet = (id: string) => {
    request({
      operServiceId: 'apiDatasetService',
      operId: 'deleteDataset',
      data: id,
    }).then(res => {
      const { status, error } = res;
      if (status != 0) {
        tip.error(error);
      } else {
        tip.success('删除成功');
        props.handleOk(); // 刷新 数据集列表
      }
    });
  };

  const delSqlDataSet = (id: string) => {
    request({
      operServiceId: 'sqlDatasetService',
      operId: 'deleteDataset',
      data: id,
    }).then(res => {
      const { status, error } = res;
      if (status != 0) {
        tip.error(error);
      } else {
        tip.success('删除成功');
        props.handleOk();  // 刷新 数据集列表
      }
    });
  };

  return datasets && datasets.length > 0 ? (
    <Collapse ghost>
      {
        // 生成所有数据集
        datasets.map((dateset) => (
          <Panel
            key={dateset.code}
            className={styles.datasetItem}
            header={
              <span>
                <DatabaseOutlined />
                <span>&nbsp;{dateset.code + ' ( ' + dateset.name + ' )'}</span>
              </span>
            }
            extra={
              <Space>
                <FormOutlined
                  className={styles.datesetTool}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // 展示对应数据集弹框
                    // 根据数据集类型不同 展示不同的弹框
                    if (dateset.dsType == 1) {
                      // sql
                      setSqlModalParam({
                        title:
                          dateset.title == undefined || dateset.title === ''
                            ? 'SQL数据集设置'
                            : dateset.title,
                        onOk: handleOk,
                        onCancel: handleCancel,
                        datasetId: dateset.id + '',
                      });
                      setSqlModalFlag(true);
                    } else {
                      // api
                      setApiModalParam({
                        title:
                          dateset.title == undefined || dateset.title === ''
                            ? 'API数据集设置'
                            : dateset.title,
                        onOk: handleOk,
                        onCancel: handleCancel,
                        datasetId: dateset.id + '',
                      });

                      setApiModalFlag(true);
                    }
                  }}
                />
                <Popconfirm
                  placement="right"
                  title={'您确认要删除该数据集么？'}
                  onConfirm={(e) => {
                    // 阻止事件冒泡
                    e?.stopPropagation();
                    e?.preventDefault();
                    delApiDataSet(dateset.id + '');
                    delSqlDataSet(dateset.id + '');
                  }}
                  onCancel={(e) => {
                    // 阻止事件冒泡
                    e?.stopPropagation();
                    e?.preventDefault();
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <DeleteOutlined
                    className={styles.datesetTool}
                    onClick={(e) => {
                      // 阻止事件冒泡
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                </Popconfirm>
              </Space>
            }
          >
            {
              // 生成数据集所有的字段信息
              dateset.fields.length > 0 && (
                <ul className={styles.fieldUl}>
                  {dateset.fields.map((field) => (
                    <li
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData('field', `\$\{${dateset.code}.${field.name}\}`);
                      }}
                      key={dateset.code + '-' + field.name}
                      className={styles.fieldLi}
                    >
                      {field.name + ' ( ' + field.remark + ' ) '}
                    </li>
                  ))}
                </ul>
              )
            }
          </Panel>
        ))
      }
      {apiModalFlag && (
        <DatasetModal
          title={apiModalParam?.title}
          onOk={apiModalParam?.onOk}
          onCancel={apiModalParam.onCancel}
          datasetId={apiModalParam.datasetId}
        />
      )}
      {sqlModalFlag && (
        <SqlDatasetModal
          title={sqlModalParam?.title}
          onOk={sqlModalParam?.onOk}
          onCancel={sqlModalParam.onCancel}
          datasetId={sqlModalParam.datasetId}
        />
      )}
    </Collapse>
  ) : null;
};

export default DatasetList;
