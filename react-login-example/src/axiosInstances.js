import axios from 'axios';

export const githubAxios = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 1000
});

export const apiAxios = axios.create({
  baseURL: 'https://wildhub.ssd1.ovh',
  timeout: 1000
});
