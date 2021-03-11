import React from 'react'
import { Modal } from 'antd';
import DatasourceList from '../DatasourceList';

/**
 * 数据源列表配置
 */
export interface DatasourceModalProp {
  id?: string, // 数据集id
  //name: string, // 数据集名称
  title?: string,//添加数据源页面标题
  onOk: ()=>void,  //点击处理事件确认按钮
  onCancel: ()=>void//点击处理事件取消按钮
}

/**
 * 数据源列表
 * @param props 
 */
const DatasourceModal: React.FC<DatasourceModalProp> = (props) => {

  return (
    <>
      <Modal 
      centered
       title={props.title} 
       visible={true}
       zIndex={1006}
       onOk={props.onOk} 
       onCancel={props.onCancel}
       width={document.body.clientWidth*0.8}
       bodyStyle={{height:document.body.clientHeight*0.6}}
       >
        <DatasourceList></DatasourceList>
      </Modal>
    </>
  );
};

export default DatasourceModal;