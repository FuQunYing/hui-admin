import { request } from './axios';
// 任务认领
export class TaskService{
    // 列表
    static async list(param) {
        return request('/task/getPageList', param, 'post')
    }
    // 新增
    static async add(param) {
        return request('/task/add', param, 'post')
    }
    // 更新
    static async update(param) {
        return request('/task/update', param, 'post')
    }
    // 删除
    static async del(param) {
        return request('/task/delete', param, 'post')
    }
    // 查询
    static async select(param) {
        return request('/task/getById', param, 'post')
    }
    // 审核
    static async check(param) {
        return request('/taskSign/check', param, 'post')
    }
}
