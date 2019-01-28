import axios from 'axios'
import {Message} from 'element-ui'

// 拦截request, 设置全局为ajax请求
axios.interceptors.request.use((config) => {
    config.headers['X-Requestd-With'] = 'XMLHttpRequest'
    return config
})

// 拦截响应response, 并做错误处理
axios.interceptors.response.use((response) => {
}, (err) => {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '请求错误'
                break
            case 401:
                err.message = '未授权，请登录'
                break
            case 403:
                err.message = '拒绝访问'
                break
            case 404:
                err.message = `请求地址出错；$(err.response.config.url)`
                break
            case 500:
                err.message = '服务器内部错误'
                break
            case 502:
                err.message = '网关错误'
                break
            default:
                err.message = `连接出错(${err.response.status})!`
        }
    } else {
        err.message = '连接服务器失败!'
    }
    return Promise.reject(err)
})

axios.install = (Vue) => {
    Vue.prototype.$axios = axios
}

export default axios



