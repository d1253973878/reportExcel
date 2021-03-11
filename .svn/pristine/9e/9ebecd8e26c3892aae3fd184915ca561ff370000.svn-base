import { request } from '@/utils/newtec';

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


