interface PageableParams {
  operServiceId?: string, // 请求的服务ID，与平台一步请求时的 operServiceId一致
  operId?: string  // 请求的操作ID，与平台一步请求时的 operId 一致
  requestParams?: { // 表格查询数据时需要提交的参数
    [prop: string]: any
  }
}

/**
 * 分页组件展示的数据类型，这里设计成通用类型
 */
type RecordType = RecordType | never

/**
 * 分页查询时支持的参数
 */
export interface FetchParams {
  sortField?: string, // 排序字段
  sortOrder?: string, // 排序方向
  pagination?: any, // 分页信息 {current, pageSize}
  [prop: string]: any // 其他通用属性
}