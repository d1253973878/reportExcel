import { Effect, Reducer } from 'umi';

import { queryCurrent, queryPersonInfo } from '@/services/user';

export interface CurrentUser {
  id?: string;
  name?: string,
  userCode?: string;
  userName?: string;
  depId?: string;
  depName?: string;
  avatar?: string,
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      const response1 = yield call(queryPersonInfo);
      console.info("response", response.data);
      console.info("response1", response1.data);
      if(response.status === 0){
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
