/**
 * API 返回统一数据结构，主要应用于控制 Mock 返回数据结构
 */
export default class Result {
  status: number; // 错误码, 0 表示成功，其他数字表示失败
  data?: any; // 返回的真实数据
  error?: any; // 错误信息
  constructor(status: number, data?: any, error?: any) {
    this.status = status;
    this.data = data;
    this.error = error;
  };
  getData(): any {
    return this.data
  };
  setData(data: any): void {
    this.data = data
  };
  getError(): any {
    return this.error;
  }
  setError(error: any): void {
    this.error = error;
  }
  success() {
    return this.status == 0;
  }
}
/**
 * 获取一个成功的数据结构
 * @param data 接口返回的真实数据
 */
export const getSuccessResponse = (data: any) => (new Result(0, data))
/**
 * 获取一个失败的数据接口
 * @param status 错误码
 * @param error 错误信息
 */
export const getFailedResponse = (status: number, error: any) => (new Result(status, undefined, error))