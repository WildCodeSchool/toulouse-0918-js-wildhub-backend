import axios from 'axios';

export const githubAxios = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 5000
});

export const apiAxios = axios.create({
  baseURL: 'https://wildhub.ssd1.ovh/api',
  timeout: 5000
});
