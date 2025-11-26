import { request } from './axios';
// 社区活动
export class AreaActiveService{
    // 活动列表
    static async list(param) {
        return request('/communityActivity/getPage', param, 'post')
    }
    // 新增
    static async add(param) {
        return request('/communityActivity/add', param, 'post')
    }
    // 更新
    static async update(param) {
        return request('/communityActivity/update', param, 'post')
    }
    // 单个查询
    static async select(param) {
        return request('/communityActivity/getOne', param, 'post')
    }
    // 删除
    static async del(param) {
        return request('/communityActivity/delete', param, 'post')
    }
    // 删除多个
    static async delList(param) {
        return request('/communityActivity/deleteList', param, 'post')
    }
    // 报名列表
    static async signInList(param) {
        return request('/communityActivitySign/getPage', param, 'post')
    }
    // 报名审核
    static async check(param) {
        return request('/communityActivitySign/check', param, 'post')
    }
}

// 资讯管理
export class InfoService{
    // 列表
    static async list(param) {
        return request('/informationController/informationList', param, 'post')
    }
    // 添加弹窗 - 资讯分类查询
    static async types(param) {
        return request('/objTypeController/objTypeList', param, 'post')
    }
    // 添加
    static add(param) {
        return request('/informationController/addInformation', param, 'post')
    }
    // 修改
    static update(param) {
        return request('/informationController/updateInformation', param, 'post')
    }
    // 单个查询
    static select(param) {
        return request('/informationController/selectInformation', param, 'post')
    }
}
