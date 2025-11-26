import { request } from './axios';

// 登录退出
export class UsrService{
    // ==== 用户管理 ====
    // 用户权限
    static async usrMenu(param) {
        return request('/userMenu/getUserMenu', param, 'post')
    }
    static async updateUsrMenu(param) {
        return request('/userMenu/add', param, 'post')
    }
    // 用户列表
    static async list(param) {
        return request('/userController/usersList', param, 'get')
    }
    // 查询用户
    static async search(param) {
        return request('/userController/selectUser', param, 'post')
    }
    // 更新用户
    static async update(param) {
        return request('/userController/updateUser', param, 'post')
    }
    // 删除用户
    static async del(param) {
        return request('/userController/delUser', param, 'post')
    }
    // 新增用户
    static async add(param) {
        return request('/userController/addUser', param, 'post')
    }
    // 用户同步积分
    static async syncPoint(param) {
        return request('/uploadExcelFileController/uploadServlet', param, 'post')
    }
    // 重置登录次数
    static async reset(param) {
        return request('/userController/resetUser', param, 'post')
    }
    // 导出用户信息
    static async export(param) {
        return request('/uploadExcelFileController/exportUserList', param, 'post')
    }
    // 上传头像
    static async upload(param) {
        return request('/uploadFileController/uploadServlet', param, 'post')
    }
    // 行政区域
    static async areaList(param) {
        return request('/areasController/areasList', param, 'post')
    }
}

// 前端用户管理
export class FrontUsrService {
    // 列表
    static async list(param) {
        return request('/frontUserController/frontUserList', param, 'post')
    }
    // 删除
    static async del(param) {
        return request('/frontUserController/delFrontUser', param, 'post')
    }
    // 添加积分
    static async addPoints(param) {
        return request('/frontUserController/updateFrontUserJF', param, 'post')
    }
    // 编辑时查询
    static async select(param) {
        return request('/frontUserController/selectFrontUser', param, 'post')
    }
    // 更新
    static async update(param) {
        return request('/frontUserController/updateFrontUser', param, 'post')
    }
}

export class MenuService{
    // 开关
    static async getFlag(param) {
        return request('/modelShow/getModelShow', param, 'post')
    }
    static async changeFlag(param) {
        return request('/modelShow/updateModelShow', param, 'post')
    }
    // ==== 菜单管理 ====
    // 菜单列表
    static async list(param) {
        return request('/menu/page', param, 'post')
    }
    static async fullList(param) {
        return request('/menu/list', param, 'post')
    }
    // 单个菜单查询
    static async search(param) {
        return request('/menu/getInfo', param, 'post')
    }
    // 更新
    static async update(param) {
        return request('/menu/update', param, 'post')
    }
    // 添加
    static async add(param) {
        return request('/menu/save', param, 'post')
    }
    // 删除
    static async del(param) {
        return request('/menu/remove', param, 'post')
    }
}
