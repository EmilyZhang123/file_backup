import axios from 'axios'
import QS from 'qs';
import {
    Message,
    MessageBox
} from 'element-ui'
import base from '@/utils/base';
const baseURL = `${base.sq}`
console.log(baseURL)

// 创建axios实例
let service = axios.create({
    baseURL: baseURL, // api的base_url
    timeout: 5000, // 请求超时时间
})
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// request拦截器
service.interceptors.request.use(config => {
    let token = sessionStorage.getItem('token')
    if (token) {
        config.headers.Authorization = "Bearer " + token
        // config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Nzg0MDIwMzMsInVzZXJJZCI6Ik81Y2RkODA2ODJmNDI0YjQ2YjhmYjEzM2I1ZDJhOTA1OSIsInVzZXJfbmFtZSI6IuWMl-S6rOS4h-WHr-aLk-i-vueUteWKm-W3peeoi-aciemZkOi0o-S7u-WFrOWPuCIsImp0aSI6ImJhY2M1YWJiLWViYTMtNDNiOC1iZmRhLWM5ZTljNzJlNjQ5ZiIsImNsaWVudF9pZCI6ImxpdXNvbmdzIiwic2NvcGUiOlsiYWxsIl19.90j1F1-SQW1j3_dZ5PQDNOsI3jaKd8vN4eeUIaC46z0'
    }
    if (config.method === 'post') {
        config.data = QS.stringify(config.data)
    }
    return config
}, error => {
    Promise.reject(error)
})

// respone拦截器
// service.interceptors.response.use(
//     response => {
//         /**
//          * code:200,接口正常返回;
//          */
//         const res = response.data
//         console.log(res)
//         if (res.code !== 200) {
//         Message({
//             message: res.message,
//             type: 'error',
//             duration: 5 * 1000
//         })
//         // 根据服务端约定的状态码：5001:非法的token; 5002:其他客户端登录了; 5004:Token 过期了;
//         if (res.code === 5001 || res.code === 5002 || res.code === 5004) {
//             MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//                 confirmButtonText: '重新登录',
//                 cancelButtonText: '取消',
//                 type: 'warning'
//             }).then(() => {
//                 // store.dispatch('LogOut').then(() => {
//                 //     location.reload()// 为了重新实例化vue-router对象 避免bug
//                 // })
//             })
//         }
//         return Promise.reject('error')
//         } else { // res.code === 200,正常返回数据
//             return response.data
//         }
//     },
//     error => {
//         Message({
//         message: error.message,
//         type: 'error',
//         duration: 5000
//         })
//         return Promise.reject(error)
//     }
// )

export default service
