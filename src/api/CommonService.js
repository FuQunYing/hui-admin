import { request } from './axios';
// 公用
import { message } from "ant-design-vue";
// 登录退出
export class CommonService {
    // 登录
    static async login(param) {
        return request('/loginController/login', param, 'post')
    }
    // 判断权限
    static async checkPermission(param) {
        return request('loginController/getMangerIdentity',param,'get')
    }
    // 判断权限
    static async getMenu(param) {
        return request('userMenu/menus',param,'post')
    }
    // 退出登录
    static async logout() {
        return request('/logout.do', 'post')
    }
    // 请求图片
    static async getImage(param) {
        return request('/getFileController/getFile', param, 'get')
    }
    static async exportData(url,param, name) {
        return request(url, param,'post','blob').then((request) => {
            if (request) {
                const link = document.createElement('a')
                const blob = new Blob([request], {type: 'application/vnd.ms-excel'});
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', name + '.xlsx')
                console.log(link);
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                message.warning('暂无数据')
            }
        })
    }
    static async exportDataForm(url,param, name) {
        return request(url, param,'post','blob').then((request) => {
            if (request) {
                const link = document.createElement('a')
                const blob = new Blob([request], {type: 'application/vnd.ms-excel'});
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', name + '.xlsx')
                console.log(link);
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                message.warning('暂无数据')
            }
        })
    }
    static async exportGetData(url,param, name) {
        return request(url, param,'get','blob').then((request) => {
            if (request) {
                const link = document.createElement('a')
                const blob = new Blob([request], {type: 'application/vnd.ms-excel'});
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', name + '.xlsx')
                console.log(link);
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                message.warning('暂无数据')
            }
        })
    }
}
