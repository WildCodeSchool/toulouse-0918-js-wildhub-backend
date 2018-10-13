import axios from 'axios';
import { apiUrl } from './settings';

export const githubAxios = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 5000
});

export const apiAxios = axios.create({
  baseURL: `${apiUrl}/api`,
  timeout: 5000
});
