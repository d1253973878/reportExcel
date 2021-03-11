import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';
import DatasetList from '../DatasetList';
import { DatesetItem } from '../DatasetList';
import CollapseForm from '../CollapseForm';
import SqlDatasetModal from '../SqlDatasetModal';
import DatasetModal from '../DatasetModal';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './index.less';
import { tip, request } from '@/utils/newtec';

/**
 * 数据集菜单项配置
 */
export interface MenuProp {
  id?: string; // 用于国际化配置的id
  title: string; // 菜单项显示的标题
  onClick: () => {}; // 菜单项的点击事件处理方法
}

/**
 * 左边表单配置
 */
export interface LeftFormProps {
  datasets?: DatesetItem[]; // 数据集列表
  currentReport?: any;
  menus?: MenuProp[]; // 按钮列表
}

/**
 * 报表设计器左边的布局
 * @param props
 */
let LeftContent: React.FC<LeftFormProps> = (props) => {
  const [sqlModalFlag, setSqlModalFlag] = useState<boolean>(false);
  // 显示api数据集的标识
  const [apiModalFlag, setApiModalFlag] = useState<boolean>(false);

  const menus =
    props.menus === undefined
      ? ([
          {
            id: 'pages.report.design.left.dataset.sql',
            title: 'SQL数据集',
            onClick: () => {
              setSqlModalFlag(true);
            },
          },
          {
            id: 'pages.report.design.left.dataset.api',
            title: 'API数据集',
            onClick: () => {
              setApiModalFlag(true);
            },
          },
        ] as MenuProp[])
      : props.menus;

  // 获取report对象
  const { currentReport } = props;

  // datasets 数据集列表
  const [datasets, setDatasets] = useState<DatesetItem[]>([]);

  // 查询 数据集信息列表
  const searchDataSetList = () => {
    request({
      operServiceId: 'datasetService',
      operId: 'findDatasetList',
      data: { reportId: currentReport.id + '' },
    }).then((res) => {
      const { status, data, error } = res;
      if (status != 0) {
        // 此时查询出现错误
        tip.error(error);
      } else {
        data && setDatasets(data);
      }
    });
  };

  useEffect(() => {
    if (currentReport.id != undefined) {
      // 请求该报表下的所有数据集列表
      // 此时先只请求api数据集的列表
      searchDataSetList();
    }
  }, [currentReport.id]);

  const menu = (
    <Menu>
      {
        // 遍历生成下拉选项
        menus.map((menuProp, index) => (
          <Menu.Item key={index}>
            <a rel="noopener noreferrer" className={styles.menuItemA} onClick={menuProp.onClick}>
              {menuProp.title}
            </a>
          </Menu.Item>
        ))
      }
    </Menu>
  );
  const handleOk = () => {
    // 查询 左侧数据集信息列表
    searchDataSetList();
    // 关闭 弹出框
    setSqlModalFlag(false);
    setApiModalFlag(false);
  };
  const handleCancel = () => {
    setSqlModalFlag(false);
    setApiModalFlag(false);
  };

  return (
    <>
      <Dropdown overlay={menu} placement="bottomRight">
        <Button className={styles.datesetBtn}>
          数据及管理
          <PlusOutlined />
        </Button>
      </Dropdown>
      <DatasetList datasets={datasets} handleOk={handleOk} />
      <CollapseForm />
      {sqlModalFlag && (
        <SqlDatasetModal title={'SQL数据集设置'} onOk={handleOk} onCancel={handleCancel} />
      )}
      {apiModalFlag && (
        <DatasetModal title={'API数据集设置'} onOk={handleOk} onCancel={handleCancel} />
      )}
    </>
  );
};

export default connect(({ report }: ConnectState) => ({
  currentReport: report.currentReport,
}))(LeftContent);
