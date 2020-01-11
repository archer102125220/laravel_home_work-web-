import { GET_commentAll, POST_newComment, DELETE_comment } from '../services/comment';
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
                yield call(POST_newComment, payload, token);
                const res = yield call(GET_commentAll, payload, token);

                if (res) {
                    message.success('文章新稱成功!');
                    yield put({ type: 'comment_save', payload: res });
                }
                if (callback) { callback(false); }
            } catch (error) {
                console.dir(error);
                if (error) message.error('留言送出失敗!');
            }
        },
        *DELETE_comment({ payload, callback }, { call, put /* , select */ }) {  // eslint-disable-line
            try {
                //const token = yield select(state => state.auth.token);
                const token = yield localStorage.getItem('token');
                yield call(DELETE_comment, payload, token);
                const res = yield call(GET_commentAll, payload, token);
                if (res) {
                    message.success('留言刪除成功!');
                    yield put({ type: 'comment_save', payload: res });
                }
                if (callback) { callback(false); }
            } catch (error) {
                console.dir(error);
                if (error) message.error('留言刪除失敗!');
            }
        },
    },

    reducers: {
        comment_save(state, { payload }) {
            return { ...state, commentAll: payload };
        },
    },

};
