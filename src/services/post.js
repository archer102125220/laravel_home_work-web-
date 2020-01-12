import fetch from '../utils/request';

export function GET_postAll(payload = {}, token) {
    return fetch('GET', '/post/posts', payload, {
        headers: {
            Authorization: `Bearer ${token.replace(/\"/g, '')}`
        }
    });
}

export function POST_newPost(payload = {}, token) {
    return fetch('POST', '/post/new_post', payload, {
        headers: {
            Authorization: `Bearer ${token.replace(/\"/g, '')}`
        }
    });
}

export function DELETE_post(payload = {}, token) {
    return fetch('DELETE', '/post/delete_post', payload, {
        headers: {
            Authorization: `Bearer ${token.replace(/\"/g, '')}`
        }
    });
}

export function PUT_post(payload = {}, post_id, token) {
    console.log(post_id);
    return fetch('PUT', `/post/edit/${post_id}`, payload, {
        headers: {
            Authorization: `Bearer ${token.replace(/\"/g, '')}`
        }
    });
}