import { GET_postAll, POST_newPost } from '../services/post';
import { message } from 'antd';
import _ from 'lodash';

export default {

    namespace: 'post',

    state: {},

    effects: {
        *GET_postAll({ payload, callback }, { call, put /* , select */ }) {  // eslint-disable-line
            try {
                //const token = yield select(state => state.auth.token);
                const token = yield localStorage.getItem('token');
                const res = yield call(GET_postAll, payload, token);
                // console.log(res);
                if (res) {
                    yield put({ type: 'post_save', payload: res });
                }
                if (callback) { callback(false); }
            } catch (error) {
                if (error) message.error('文章列表載入失敗!');
            }
        },
        *POST_newPost({ payload, callback }, { call, put /* , select */ }) {  // eslint-disable-line
            try {
                //const token = yield select(state => state.auth.token);
                const token = yield localStorage.getItem('token');
                yield call(POST_newPost, payload, token);
                const res = yield call(GET_postAll, payload, token);
                if (res) {
                    yield put({ type: 'post_save', payload: res });
                }
                if (callback) { callback(false); }
            } catch (error) {
                // console.dir(error);
                if (error) message.error('文章送出失敗!');
            }
        },
    },

    reducers: {
        post_save(state, { payload }) {
            payload.sort((a, b) => b.posts_id - a.posts_id);
            return { ...state, postAll: payload };
        },
    },

};
