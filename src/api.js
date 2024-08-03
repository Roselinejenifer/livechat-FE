import axios from 'axios';

const API_URL = 'https://livechat-be-dzwh.onrender.com/api';

export const register = (username, password) => {
    return axios.post(`${API_URL}/auth/register`, { username, password });
};

export const login = (username, password) => {
    return axios.post(`${API_URL}/auth/login`, { username, password });
};

export const fetchMessages = (token) => {
    return axios.get(`${API_URL}/messages`, { headers: { Authorization: token } });
};
