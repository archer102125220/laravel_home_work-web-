import fetch from '../utils/request';

export function GET_postAll(payload = {}, token) {
    return fetch('GET', '/post/posts', payload, {
        headers: {
            Authorization: `Bearer ${token.replace(/\"/g, '')}`
        }
    });
}