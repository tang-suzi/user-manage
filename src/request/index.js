import axios from "axios";
import { Message } from "element-ui";

// let transformRequest = function (data) {
//   return JSON.stringify(data);
// };

/**
 * 在拦截器之前执行，在传递给 then/catch 前，允许修改响应数据
 * @param {*} data
 */
// let transformResponse = function (data) {
//   try {
//     return JSON.parse(data);
//   } catch (error) {
//     return {};
//   }
// };

const service = axios.create({
  baseURL: "", // 请求地址暂时用空链接替代
  timeout: 5000, // 超时时间5000ms
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    Accept: "application/json, text/plain, */*",
  },
  withCredentials: true, //跨域请求带上cookie
  // transformRequest: [transformRequest],
  // transformResponse: [transformResponse],
  maxContentLength: 2000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认的
  },
});

// 请求拦截器
// 所有接口均需JWT认证，Token格式强制要求：Authorization: Bearer {JWT Token}（Bearer后必须加一个空格）
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 从 Cookie 中读取 JSESSIONID，如不存在则使用默认值
    // const token =
    //   "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkAwIiwicGVybWlzc2lvbnMiOlsiUk9MRV9TWVNfUk9MRV9TVVBFUl9BRE1JTiJdLCJ1c2VyTmFtZSI6ImFkbWluQDAiLCJ1c2VySWQiOjEsImlzU3lzQWRtaW4iOjEsImlhdCI6MTc2NzQ5OTA0NiwiYWNjb3VudCI6ImFkbWluIiwib3JnSWQiOiIwIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9TWVNfUk9MRV9TVVBFUl9BRE1JTiJdfQ.DE6VYpbnUoV3kNoZ_1xd9vcMCacSeCOrh5ewl9-UdtLW-RputzelNIcSuqGDUrP0Uy32_YtPDRypH0RcBuqppA";
    const token = localStorage.getItem("token");
    const JSESSIONID = localStorage.getItem("JSESSIONID");
    config.headers["Authorization"] = `${token}`;
    config.headers["JSESSIONID"] = JSESSIONID;
    // config.headers["JSESSIONID"] = jsessionId;
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
    if (
      response.request.responseURL.includes("/train/train/upload/mgr/download/")
    ) {
      return response.data;
    }
    const res = response.data.data;
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
