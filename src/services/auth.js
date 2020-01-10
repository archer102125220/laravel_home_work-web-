import fetch from '../utils/request';

export function Login(payload = {}) {
  return fetch('POST', '/login', payload);
}
export function Register(payload = {}) {
  return fetch('POST', '/register', payload);
}
