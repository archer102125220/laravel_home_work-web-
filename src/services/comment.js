import fetch from '../utils/request';

export function GET_commentAll(payload = {}, token) {
    return fetch('GET', '/comment/comments', payload, {
        headers: {
            Authorization: `Bearer ${token.replace(/\"/g, '')}`
        }
    });
}

export function POST_newComment(payload = {}, token) {
    return fetch('POST', '/comment/new_comment', payload, {
        headers: {
            Authorization: `Bearer ${token.replace(/\"/g, '')}`
        }
    });
}