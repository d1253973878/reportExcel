import React, { useEffect } from 'react';
import SpreadSheet from '@/components/SpreadSheet';
import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';
import { connect, Dispatch } from 'umi';
import { match } from 'react-router-dom';
import { Row, Col } from 'antd';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { saveReport } from '@/pages/ReportTable/service';
import { tip } from '@/utils/newtec';

export interface ReportDesignerProps {
  dispatch?: Dispatch;
  match?: match;
}

/**
 * 保存时，过滤掉报表配置无用的数据，减少数据传输与存储
 * @param config 报表配置
 */
function filterReportConfig(config: any) {
  for (let item of config) {
    // @ts-ignore
    delete item.data; // 删除数据中的data属性，此属性数据中存在大量无用的数据
    filterChartData(item.chart); // 删除图表中的无用数据
  }
}

/**
 * 保存时，过滤掉图表配置无用的数据，减少数据传输与存储
 * @param charts 报表配置
 */
function filterChartData(charts: any) {
  if (Array.isArray(charts)) {
    for (let chart of charts) {
      const { chartOptions } = chart;
      const { datasourceType, defaultOption } = chartOptions;
      if (datasourceType && datasourceType.type != 'static') {
        // 删除图表数据
        delete chartOptions.chartData;
        delete chartOptions.chartDataCache;
        delete defaultOption.seriesData;

        const { series } = defaultOption;
        // 删除 series 中的数据
        if (Array.isArray(series)) {
          for (let item of series) {
            delete item.data;
          }
        }
      }
    }
  }
}

/**
 * 报表设计器页面布局
 * @param props
 */
const ReportDesigner: React.FC<ReportDesignerProps> = (props) => {
  // @ts-ignore
  const {
    dispatch,
    match: { params },
  } = props;
  // 加载报表数据并存到 state 中
  useEffect(() => {
    !!dispatch &&
      dispatch({
        type: 'report/fetchCurrent',
        payload: { ...params },
      });
  }, []);
  return (
    <Row className={styles.reportRow}>
      <Col span={4} className={styles.block}>
        <LeftContent />
      </Col>
      <Col span={16}>
        <SpreadSheet
          id={params.id}
          cellDragStop={(
            ri: number,
            ci: number,
            cell: any,
            dataTransfer: any,
            $spreadsheet: any,
          ) => {
            // 从拖拽事件中拿到拖拽开始设置的字段名
            const field = dataTransfer.getData('field');
            !!field && $spreadsheet.cellText(ri, ci, field).reRender();
          }}
          onSave={(config: any) => {
            // filterReportConfig(config);
            // 直接从 props 的 currentReport 可能拿到控制，这里直接从 state 中获取数据，再保存
            !!dispatch &&
              dispatch({
                type: 'report/query',
                payload: {
                  // 获取到数据后的回调方法
                  callback: (value: any) => {
                    const report = { ...value, config };
                    const hide = tip.loading('正在保存...');
                    try {
                      // 保存报表信息到后台
                      saveReport(report).then((result) => {
                        if (result.status === 0) {
                          // 保存成功更新 state
                          dispatch &&
                            dispatch({
                              type: 'report/updateCurrent',
                              payload: report,
                            });
                            tip.success('保存成功');
                        } else {
                          tip.error(result.error);
                        }
                        hide();
                      });
                    } catch (error) {
                      hide();
                      tip.error('保存失败请重试！');
                    }
                  },
                },
              });
          }}
        />
      </Col>
      <Col span={4}>
        <RightContent />
      </Col>
    </Row>
  );
};

export default connect(({ report }: ConnectState) => ({
  currentReport: report.currentReport,
}))(ReportDesigner);
