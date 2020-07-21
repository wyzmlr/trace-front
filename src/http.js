import axios from "axios";

const url = (function() {
  if (process.env.NODE_ENV === "production") {
    return "http://xxx.google.com";
  } else if (process.env.NODE_ENV === "home") {
    return "http://xxx.google.com/";
  }
})();

axios.defaults.baseURL = url;
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
axios.defaults.headers.get["Content-Type"] = "application/json; charset=utf-8";
axios.defaults.withCredentials = true;

// axios.interceptors.request.use(
//     config => {
// let token =localStorage.getItem('token');
//         if (token) {
//         config.headers.common['token'] =localStorage.getItem('token');
//         }
//         return config
//     },
//     err => {
//     return Promise.reject(err);
//     }
// );

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 403:
        // localStorage.removeItem('token');
        //location.href = url + "/engine/api/login/";
      }
      // 返回接口返回的错误信息
      return Promise.reject(error.response.data);
    }
  }
);

// 这个方法最后返回的直接就是data，不用res.data
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export { url };
