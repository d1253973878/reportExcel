import React from 'react';
import { getReportConfig, findReportDatasByIdAndCellData } from '@/pages/ReportTable/service';
import { tip } from '@/utils/newtec';
import styles from './index.less';
import { initNewtecApi } from '@/utils/newtecChart.js';

export interface SpreadSheetProps {
  id: number;
  name?: string;
  preview?: boolean; // 是否是预览
  data?: Object[];
  filterParams?: Object;
  options?: {
    view?: {
      height: () => number | undefined;
      width: () => number | undefined;
    };
    mode: string;
    showContextmenu: boolean;
    showToolbar?: boolean;
    showPrintbar?: boolean;
    showGrid?: boolean;
  };
  cellDragStop?: (ri: number, ci: number, cell: any, dataTransfer: any, $spreadsheet: any) => void;
  onSave?: (config: any) => void;
}

export default class SpreadSheet extends React.Component<SpreadSheetProps> {
  private defaultOptions = {
    view: {
      height: () => document.documentElement.clientHeight || undefined,
      width: () => document.documentElement.clientWidth || undefined,
    },
    showToolbar: true,
    showGrid: true,
  };

  public $spreadsheet = null;

  constructor(props: SpreadSheetProps) {
    super(props);
  }

  async getConfig() {
    const { id } = this.props;
    return getReportConfig(id);
  }

  componentDidUpdate() {
    this.reloadData();
  }

  componentDidMount() {
    const container = document.getElementById('spread-sheet');
    const { defaultOptions } = this;
    const { onSave, cellDragStop, options, id } = this.props;

    defaultOptions.view = {
      height: () => container?.clientHeight,
      width: () => container?.clientWidth,
    };
    initNewtecApi.call(this);
    const mergeOptions = { ...defaultOptions, ...options };
    const $spreadsheet = x_spreadsheet('#spread-sheet', mergeOptions);
    this.$spreadsheet = $spreadsheet;
    $spreadsheet
      .onSave(onSave)
      .onAddChart(function () {
        newtecChart.selectChart();
      })
      .onPreview(function () {
        window.location.href = '/report/preview/' + id;
      })
      .on('cell-drag-stop', (ri: number, ci: number, cell: any, dataTransfer: any) => {
        cellDragStop && cellDragStop(ri, ci, cell, dataTransfer, $spreadsheet);
      })
      .on('cell-selected', (cell: any, ri: number, ci: number) => {
        newtecChart.onClickCell({ row: ri, col: ci });
      })
      .on('chart-selected', (options: any) => {
        options.type = 'chart';
        options.chartType = 'bar.simple';
        options.chartId = options.id;
        newtecChart.loadChart(options);
      });
    const { data: customerData } = this.props;
    // 判断电子表格数据是否为空或是否为默认数据，若是，则尝试从后台加载报表配置数据
    if (customerData === undefined) {
      // 加载配置数据
      this.getConfig().then((result) => {
        const { data, status } = result;
        // 判断数据请求是否成功
        if (status === 0 && !!data) {
          let config;
          try {
            // 判断JSON配置信息是否合法
            config = JSON.parse(data);
            // 若不合法则抛出异常
            if (!config) {
              throw new Error('报表配置加载失败');
            }
            $spreadsheet.loadData(config);
          } catch (e) {
            console.error(e);
            tip.error(e.message);
          }
        }
        this.reloadData();
      });
    } else {
      // 若传入自定义数据
      $spreadsheet.loadData(customerData);
    }
  }

  reloadData() {
    // 加载成功之后 判断 如果是预览 就去后台解析数据 然后加载数据
    const { preview, filterParams } = this.props;
    if (preview) {
      // @ts-ignore
      findReportDatasByIdAndCellData(this.props.id, filterParams.field, filterParams.dynamic).then(
        (res) => {
          const { data, error, status } = res;
          if (status == 0) {
            // @ts-ignore
            this.$spreadsheet.sheet.loadData(data);
          } else {
            tip.error(error);
          }
        },
      );
    }
  }

  render() {
    return (
      <div
        id="spread-sheet"
        className={
          styles.sheetContainer + ' ' + this.props.preview
            ? styles.height100
            : styles.height100 - 40
        }
      ></div>
    );
  }
}