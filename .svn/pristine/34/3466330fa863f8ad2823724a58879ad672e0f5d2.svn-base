import React from 'react';
import defaultReportIcon from '@/assets/default.jpg';
import { List, Card, Button, Row, Col, Space, Popconfirm } from 'antd';
import {
  EyeOutlined,
  StarOutlined,
  DeleteOutlined,
  CopyOutlined,
  PlusOutlined,
  FormOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import NewtecPageableList from '@/components/NewtecPageableList';
import { deleteReport, collectReport, copyReport, createReport } from '../../service';
import { tip } from '@/utils/newtec';

/**
 * 报表表格配置项
 */
interface ReportListProps {
  template?: 0 | 1;
  enableAdd?: boolean;
}

/**
 * 报表表格实现
 */
export default class ReportList extends React.Component<ReportListProps> {
  state = {
    hover: {},
  };

  private listRef = React.createRef();

  constructor(props: ReportListProps) {
    super(props);
  }

  handleCreate(name?: string) {
    const hide = tip.loading('正在创建');
    try {
      createReport(name).then(function (res) {
        const { data, status } = res;
        if (status == 0) {
          tip.success('创建成功');
          window.location.href = '/report/design/' + data.id;
        } else {
          tip.error(res.error);
        }
        hide();
      });
    } catch (error) {
      hide();
      tip.error('创建失败请重试！');
    }
  }

  handleCollect(id: number, template: number) {
    const hide = tip.loading('收藏中');
    const that = this;
    try {
      collectReport(id, template).then(function (res) {
        if (res.status == 0) {
          tip.success('收藏成功');
        } else {
          tip.error(res.error);
        }
        // @ts-ignore
        that.listRef.current.reload();
        hide();
      });
    } catch (error) {
      hide();
      tip.error('收藏失败请重试！');
    }
  }

  handleDelete(id: number) {
    const hide = tip.loading('正在删除');
    const that = this;
    try {
      deleteReport(id).then(function (res) {
        const { status, error } = res;
        if (status == 0) {
          tip.success('删除成功');
        } else {
          tip.error(error);
        }
        // @ts-ignore
        that.listRef.current.reload();
        hide();
      });
    } catch (error) {
      hide();
      tip.error('删除失败请重试！');
    }
  }

  handleCopy(id: number) {
    const hide = tip.loading('复制中');
    const that = this;
    try {
      copyReport(id).then(function (res) {
        if (res.status == 0) {
          tip.success('复制成功');
        } else {
          tip.error(res.error);
        }
        // @ts-ignore
        that.listRef.current.reload();
        hide();
      });
    } catch (error) {
      hide();
      tip.error('复制失败请重试！');
    }
  }

  mouseInReport(id: number) {
    this.setState({ hover: { [id]: true } });
  }

  mouseOutReport(id: number) {
    this.setState({ hover: { [id]: false } });
  }

  render() {
    const bodyStyle: React.CSSProperties = {
      padding: 0,
    };
    const { template = 0, enableAdd = false } = this.props;
    return (
      <NewtecPageableList
        operServiceId="reportService"
        operId="queryReportList"
        rowKey="id"
        className={styles.reportList}
        enableAdd={enableAdd}
        ref={this.listRef}
        requestParams={{ template }}
        renderItem={(item) => {
          if (item && item.id) {
            return (
              <List.Item key={item.id}>
                <Card
                  cover={<img alt="example" src={defaultReportIcon} />}
                  bodyStyle={bodyStyle}
                  // onMouseOver={() => { this.mouseInReport(item.id) }}
                  // onMouseOut={() => { this.mouseOutReport(item.id) }}
                />
                <Row className={styles.toolRow}>
                  <Col span={12} className={styles.reportTitle}>
                    {item.name}
                  </Col>
                  <Col span={12} className={styles.btnGroup}>
                    <Space>
                      <FormOutlined
                        className={styles.toolBtn}
                        title="设计"
                        onClick={() => {
                          window.location.href = '/report/design/' + item.id;
                        }}
                      />
                      <EyeOutlined
                        className={styles.toolBtn}
                        title="预览"
                        onClick={() => {
                          window.location.href = '/report/preview/' + item.id;
                        }}
                      />
                      <StarOutlined
                        className={styles.toolBtn}
                        onClick={() => {
                          this.handleCollect(item.id, item.template === 0 ? 1 : 0);
                        }}
                        title={item.template === 0 ? '收藏' : '取消收藏'}
                      />
                      <Popconfirm
                        placement="top"
                        title={`是否删除报表【${item.name}】?`}
                        okText="确认"
                        cancelText="取消"
                        onConfirm={() => {
                          this.handleDelete(item.id);
                        }}
                      >
                        <DeleteOutlined className={styles.toolBtn} title="删除" />
                      </Popconfirm>
                      <CopyOutlined
                        className={styles.toolBtn}
                        onClick={() => {
                          this.handleCopy(item.id);
                        }}
                        title="复制"
                      />
                    </Space>
                  </Col>
                </Row>
                {this.state.hover[item.id] && (
                  <div className={styles.itemLayer}>
                    <Button type="primary" href={'/report/design/' + item.id}>
                      设计
                    </Button>
                  </div>
                )}
              </List.Item>
            );
          }
          return (
            <List.Item>
              <Button
                type="dashed"
                className={styles.newButton}
                onClick={() => {
                  this.handleCreate();
                }}
              >
                <PlusOutlined /> 新建报表
              </Button>
            </List.Item>
          );
        }}
      />
    );
  }
}
