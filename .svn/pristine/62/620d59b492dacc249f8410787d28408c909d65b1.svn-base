import { request } from '@/utils/newtec';
import { ReportItem } from 'umi';

/**
 * 删除报表
 * @param id 报表id
 */
export async function deleteReport(id: number) {
  return request({
    operServiceId: "reportService",
    operId: "deleteReport",
    data: id
  });
}

/**
 * 收藏报表
 * @param id 报表ID
 * @param template 0-取消收藏，1-收藏
 */
export async function collectReport(id: number, template: number) {
  return request({
    operServiceId: "reportService",
    operId: "collectReport",
    data: {
      id,
      template
    }
  });
}

/**
 * 创建报表
 * @param name 报表名称
 */
export async function createReport(name?: string) {
  return request({
    operServiceId: "reportService",
    operId: "createReport",
    data: name
  });
}

/**
 * 复制报表
 * @param id 报表ID
 */
export async function copyReport(id: number) {
  return request({
    operServiceId: "reportService",
    operId: "copyReport",
    data: id
  });
}

/**
 * 获取报表信息
 * @param datas 查询参数
 *           id 报表ID
 *           config 是否需要返回JSON配置信息，0-否，1-是
 */
export async function getReport(datas: any) {
  return request({
    operServiceId: "reportService",
    operId: "getReport",
    data: datas
  });
}

/**
 * 获取报表的JSON配置
 * @param id 报表id
 */
export async function getReportConfig(id: number) {
  return request({
    operServiceId: "reportService",
    operId: "getReportConfig",
    data: id
  });
}

/**
 * 获取预览报表的JSON配置（包含动态数据）
 * @param id 报表id
 */
export async function getPreviewReportConfig(id: number) {
  return request({
    operServiceId: "reportService",
    operId: "getPreviewReportConfig",
    data: id
  });
}

/**
 * 保存报表
 * @param report 报表信息
 */
export async function saveReport(report: ReportItem) {
  const datas = { ...report };
  const { config } = datas;
  delete datas.config;
  return request({
    operServiceId: "reportService",
    operId: "saveReport",
    data: {
      report: { ...datas },
      config
    }
  });
}

/**
 * 根据 报表id 和 celldata 查询出报表要展示的数据
 * @param id 报表id
 * @param fieldParams 数据过滤的参数(字段参数)
 * @param dynamicParams 数据过滤的参数（动态参数）
 */
export async function findReportDatasByIdAndCellData(id: number, fieldParams: any, dynamicParams: any) {
  return request({
    operServiceId: "reportService",
    operId: "findReportDatasById",
    data: {
      id,
      fieldParams: JSON.stringify(fieldParams),
      dynamicParams: JSON.stringify(dynamicParams)
    }
  });
}