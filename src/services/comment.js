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

export function DELETE_comment(payload = {}, token) {
    return fetch('DELETE', '/comment/delete_comment', payload, {
        headers: {
            Authorization: `Bearer ${token.replace(/\"/g, '')}`
        }
    });
}

export function PUT_comment(payload = {}, comment_id, token) {
    return fetch('PUT', `/comment/edit/${comment_id}`, payload, {
        headers: {
            Authorization: `Bearer ${token.replace(/\"/g, '')}`
        }
    });
}