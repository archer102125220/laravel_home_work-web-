import fetch from '../utils/request';

export function Login(payload = {}) {
  return fetch('POST', '/login', payload);
}
