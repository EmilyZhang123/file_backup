import request from '@/utils/request'
import URL from "@/api/url";
//登录接口
export function postlogin(data) {
    return request({
        url: URL.LOGIN,
        method: 'post',
        data
    })
}
//首页 - 申请业务状态
export function ApplicationBusinessStatus(model) {
    return request({
        url: model.url,
        method: model.type,
        data: model.data
    })
}
