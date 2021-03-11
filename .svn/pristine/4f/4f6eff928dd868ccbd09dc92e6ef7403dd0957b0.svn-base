import React, { useRef, useState } from 'react';
import { Form, Button, Space, Popconfirm } from 'antd';
import DatasourceUpdateModal from '../DatasourceUpdateModal';
import { Datasource } from '../DatasourceUpdateModal';
import NewtecTable from '@/components/NewtecTable';
import { tip } from '@/utils/newtec';
import { addConnection, updateConnection, deleteConnection, testConnection } from './service';

/**
 * 数据源展示配置
 */
export interface DatasourceListProp {}

/**
 * 数据源展示
 * @param props
 */
const DatasourceList: React.FC<DatasourceListProp> = (props) => {
  const datasouceTableRef = useRef();

  const [datasource, setDatasource] = useState<Datasource>({});
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const columns = [
    {
      title: '#',
      key: '#',
    },
    {
      title: '连接名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'IP',
      dataIndex: 'serverName',
      key: 'serverName',
    },
    {
      title: '端口号',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '数据库名称',
      dataIndex: 'dbName',
      key: 'dbName',
    },
    {
      title: '数据库类型',
      dataIndex: 'dbType',
      key: 'dbType',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              setDatasource(record);
              setShowUpdateModal(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            placement="right"
            title={'您确认要删除该数据集么？'}
            onConfirm={(e) => {
              // 阻止事件冒泡
              e?.stopPropagation();
              e?.preventDefault();
              deleteConnection(record.id).then((res) => {
                const { status, error } = res;
                if (status == 0) {
                  // @ts-ignore
                  datasouceTableRef.current.reload();
                } else {
                  tip.error(error);
                }
              });
            }}
            onCancel={(e) => {
              // 阻止事件冒泡
              e?.stopPropagation();
              e?.preventDefault();
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" htmlType="submit" onClick={() => {}}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /**
   * 保存数据库连接
   */
  const saveConnection = (datasource: Datasource) => {
    const isCreate = datasource.id == null;
    (isCreate ? addConnection(datasource) : updateConnection(datasource)).then((res) => {
      const { status, error } = res;
      if (status == 0) {
        // @ts-ignore
        datasouceTableRef.current.reload();
        tip.success(isCreate ? '创建成功' : '更新成功');
        setShowUpdateModal(false);
      } else {
        tip.error(error);
      }
    });
  };

  /**
   * 测试数据库连接
   * @param datasource
   */
  const onTestConnection = (datasource: Datasource) => {
    testConnection(datasource).then((res) => {
      const { status, error } = res;
      if (status == 0) {
        tip.success('连接成功');
      } else {
        tip.error(error);
      }
    });
  };

  return (
    <>
      <Form name="basic">
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              setDatasource({});
              setShowUpdateModal(true);
            }}
          >
            添加数据源
          </Button>
        </Form.Item>
        <Form.Item>
          <NewtecTable
            // @ts-ignore
            ref={datasouceTableRef}
            operServiceId="connectionService"
            operId="queryConnections"
            columns={columns}
            rowKey="id"
          />
        </Form.Item>
      </Form>
      {showUpdateModal && (
        <DatasourceUpdateModal
          title={'编辑数据源'}
          datasource={datasource}
          saveConnection={saveConnection}
          testConnection={onTestConnection}
          onCancel={() => {
            setShowUpdateModal(false);
          }}
        />
      )}
    </>
  );
};

export default DatasourceList;
