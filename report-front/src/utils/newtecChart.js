function initNewtecApi() {
  const { exportApi } = newtecChart;
  exportApi.reportId = this.props.id
  
  /**
   * 移动图表
   * @param {string} chartId 图表Id
   * @param {number[]} position 偏移量 [0, 0]
   */
  exportApi.updateLayerOffset = (chartId, offset) => {
    
  };

  /**
   * 弹出提示信息
   * @param {string} message 
   */
  exportApi.tip = message => {

  };

  /**
   * 设置单元格的属性
   * @param {number} ri 行下标
   * @param {number} ci 列下标
   * @param {number} prop 属性
   */
  exportApi.cellProp = (ri, ci, prop) => {

  };

  /**
   * 设置背景
   * @param {Object} setting 背景配置
   */
  exportApi.setBackground = setting => {

  };

  /**
   * 更新图表
   * @param {string} chartId 图标ID
   * @param {Object} setting 图表配置
   */
  exportApi.updateChart = (chartId, setting) => {
    this.$spreadsheet.updateChart(chartId, setting);
  };

  /**
   * 更新图表其他配置信息（如chartId, chartType）
   * @param {string} chartId 图标ID
   * @param {Object} setting 图表配置
   */
  exportApi.updateChartExtData = (chartId, setting) => {
    this.$spreadsheet.updateChartExtData(chartId, setting);
  };

  /**
   * 添加图表
   * @param {Object} option Echarts 图表配置
   * @param {*} configUrl Echarts 图表配置 API，用于请求此配置信息，可选
   * @param {(chartInfo)=>{}} callback 回调方法
   */
  exportApi.addChart = (option, configUrl, callback) => {
    this.$spreadsheet.addChart(option, configUrl, callback);
  };

  /**
   * 保存表达式
   * @param {Object} expression 表达式
   */
  exportApi.setSelectCellExpress = expression => {

  };

  /**
   * 注册地图
   * @param {string} type 地图类型，如 china
   * @param {Object} mapData 地图数据
   */
  exportApi.registerMap = (type, mapData) => {

  };

  /**
   * 获取电子表格的数据，需要将电子表格的数据传入回调方法
   * @param {(excelData) => {}} callback 回调
   */
  exportApi.getExcelData = callback => {
    typeof callback === 'function' && callback({});
  };

  /**
   * 将数据加载到电子表格，与电子表格的 loadData 一致
   * @param {Object} datas 需要加载的数据
   */
  exportApi.loadData = datas => {
    this.$spreadsheet.loadData(datas);
  };
}

export {
  initNewtecApi
};