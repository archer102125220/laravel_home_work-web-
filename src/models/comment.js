import { GET_commentAll, POST_newComment } from '../services/comment';
import { message } from 'antd';
import _ from 'lodash';

export default {

    namespace: 'comment',

    state: {},

    effects: {
        *GET_commentAll({ payload, callback }, { call, put /* , select */ }) {  // eslint-disable-line
            try {
                //const token = yield select(state => state.auth.token);
                const token = yield localStorage.getItem('token');
                const res = yield call(GET_commentAll, payload, token);
                // console.log(res);
                if (res) {
                    yield put({ type: 'comment_save', payload: res });
                }
                if (callback) { callback(false); }
            } catch (error) {
                if (error) message.error('文章列表載入失敗!');
            }
        },
        *POST_newComment({ payload, callback }, { call, put /* , select */ }) {  // eslint-disable-line
            try {
                //const token = yield select(state => state.auth.token);
                const token = yield localStorage.getItem('token');
                const res = yield call(POST_newComment, payload, token);

                if (res) {
                    const res = yield call(GET_commentAll, payload, token);
                    yield put({ type: 'comment_save', payload: res });
                }
                if (callback) { callback(false); }
            } catch (error) {
                console.dir(error);
                if (error) message.error('留言送出失敗!');
            }
        },
    },

    reducers: {
        comment_save(state, { payload }) {
            return { ...state, commentAll: payload };
        },
    },

};
