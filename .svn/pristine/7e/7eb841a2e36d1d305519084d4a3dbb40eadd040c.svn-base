import { request, umiRequest } from '@/utils/newtec';
import reportConfig from '../../config/reportConfig';

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

export async function queryCurrent(): Promise<any> {
  return umiRequest('/api/currentUser');
}

/**
 * 查询当前登录用户信息
 */
export async function queryPersonInfo() {
  return umiRequest(reportConfig.personInfoServlet, {
    method: 'POST',
    requestType: 'form', // 以 application/x-www-form-urlencoded;charset=UTF-8 格式提交
    data: { params: JSON.stringify({ token: 'none' }) }
  });
}