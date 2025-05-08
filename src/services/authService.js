import api from '../api/axios';

export const login = async credentials => {
  const { data } = await api.post('/auth/login', credentials);
  localStorage.setItem('accessToken', data.accessToken);
  return data;
};

export const signup = async credentials => {
  const { data } = await api.post('/auth/signup', credentials);
  localStorage.setItem('accessToken', data.accessToken);
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return token ? true : false;
  };