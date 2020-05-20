import moment from 'moment';
import {
  updateAPK,
} from '../services/home.js';
export default {
  namespace: 'home',
  state: {
    loading: false,
  },
  effects: {
    *uploadAPK({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateAPK, payload);
      if (response) {
        console.log('response', response)
        // yield put({
        //   type: 'saveBrandList',
        //   payload: response.results,
        // });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },
  reducers: {
    // loading
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    // uploadAPK(state: any[], { payload: values }: any) {
    //   // return state.filter(item => item.id !== id);
    //   console.log('state', state)
    //   console.log('values', values)
    //   return null;
    // },
  },
};
