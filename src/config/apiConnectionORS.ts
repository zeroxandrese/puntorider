import axios, { InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.API_URLORS;
const key = process.env.ORS_KEY;

const orsDistanceApi = axios.create({ baseURL });

orsDistanceApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (key) {
      config.headers.set('Authorization', key);
      config.headers.set('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
      config.headers.set('Content-Type', 'application/json; charset=utf-8');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default orsDistanceApi;