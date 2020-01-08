import { Login } from '../services/auth';
import { message } from 'antd';
import _ from 'lodash';

export default {

  namespace: 'auth',

  state: {},

  effects: {
    *Login({ payload, callback }, { call, put }) {  // eslint-disable-line
      try {
        const res = yield call(Login, payload);
        if (res) {
          console.log(res);
          // localStorage.setItem('token', JSON.stringify(res.jwtKey));
          // yield put({ type: 'token_save' });
        }
        if (res) { message.success('登入成功!') }
        if (callback) { callback(); }
      } catch (error) {
        if (error) message.error('帳號密碼輸入錯誤!');
      }
    },
  },

  reducers: {
    token_save(state, { payload }) {
      return { ...state, token: payload };
    },
  },

};
