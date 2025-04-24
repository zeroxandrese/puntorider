import axios, { InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.API_URLORS;
const key = process.env.ORS_KEY;

const orsDistanceApi = axios.create({ baseURL });

orsDistanceApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url && baseURL && key) {
      const url = new URL(config.url, baseURL);
      const params = new URLSearchParams(config.params);

      params.set('key', key);

      // Actualización de parametros
      config.url = `${url.pathname}?${params.toString()}`;
      config.params = {};
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default orsDistanceApi;