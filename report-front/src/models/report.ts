import { Effect, Reducer } from 'umi';
import { getReport } from '@/pages/ReportTable/service';

/**
 * 报表数据项
 */
export interface ReportItem {
  id?: number, // 报表ID
  name?: string, // 报表名称
  config?: string, // 报表JSON配置
  template?: number, // 是否为模板
  description?: string // 报表描述信息
}

/**
 * 当前报表, 与报表数据项属性一致
 */
export interface CurrentReport extends ReportItem {

}

/**
 * 报表数据模型
 */
export interface ReportModelState {
  currentReport?: CurrentReport;
}

/**
 * 定义报表数据流类型
 */
export interface ReportModelType {
  namespace: 'report';
  state: ReportModelState;
  effects: {
    query: Effect;
    fetchCurrent: Effect;
    updateCurrent: Effect;
  };
  reducers: {
    cacheCurrentReport: Reducer<ReportModelState>;
  };
}

/**
 * 实现报表数据流
 */
const ReportModel: ReportModelType = {
  namespace: 'report',

  // 管理的当前报表数据
  state: {
    currentReport: {}
  },

  // 对外暴露的 hook
  effects: {
    *query({ payload }, { select, call, put }) {
      const { callback } = payload;
      const report = yield select((state: any) => state?.report?.currentReport)
      !!callback && callback(report)
    },
    /**
     * 加载并初始化报表信息
     */
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(getReport, { id: payload.id });
      const { data: { report, config } } = response;
      if (response.status === 0) {
        yield put({
          type: 'cacheCurrentReport',
          payload: {
            ...report,
            config: !!config && JSON.parse(config)
          }
        });
      }
    },
    /**
     * 更新报表信息
     */
    * updateCurrent({ payload }, { call, put }) {
      yield put({
        type: 'cacheCurrentReport',
        payload: {
          ...payload
        }
      });
    },
  },

  // 实际更新 state 的操作
  reducers: {
    cacheCurrentReport(state, action) {
      return {
        ...state,
        currentReport: action.payload || {}
      };
    }
  },
};

export default ReportModel;