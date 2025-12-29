import axios from "axios";
import { Message } from "element-ui";

const service = axios.create({
  baseURL: "", // 请求地址暂时用空链接替代
  timeout: 5000, // 超时时间5000ms
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const res = response.data;
    return res;
  },
  (error) => {
    // 对响应错误做点什么
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
