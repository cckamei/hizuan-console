// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.less'; // global css

import { MessageBox } from 'element-ui';

Vue.use(ElementUI);
Vue.config.productionTip = false;

import axios from 'axios';

axios.defaults.baseURL = process.env.API_HOST;
// axios.defaults.timeout = 5000;

// 拦截request, 设置全局为ajax请求
axios.interceptors.request.use(config => {
  config.headers['X-Requestd-With'] = 'XMLHttpRequest';
  config.headers['X-AUTH-USER'] = window.sessionStorage.id;
  config.headers['X-AUTH-TOKEN'] = window.sessionStorage.token;
  return config;
});

// 拦截响应response, 并做错误处理
axios.interceptors.response.use(
  response => {
    if (response.data.status != 0) {
      let msg = response.data.msg;
      MessageBox.alert(msg, '错误', {
        type: 'error'
      });
    }
    return response;
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = err.response.data.msg || '请求错误';
          break;
        case 401:
          err.message = err.response.data.msg || '未授权，请登录';
          break;
        case 403:
          err.message = err.response.data.msg || '拒绝访问';
          window.location.href="/403";
          break;
        case 404:
          err.message = err.response.data.msg || `404错误：${err.response.config.url}`;
          window.location.href="/404";
          break;
        case 500:
          err.message = '服务器内部错误';
          break;
        case 502:
          err.message = '网关错误';
          break;
        default:
          err.message = `连接出错：${err.response.status}!`;
      }
    } else {
      err.message = '连接服务器失败!';
    }
    MessageBox.alert(err.message, '错误', {
      type: 'error'
    });
    return Promise.reject(err);
  }
);

Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});
