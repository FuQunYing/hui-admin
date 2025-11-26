import { request } from './axios';
// 平台积分
export class PlatformService{
    //列表
    static async list(param) {
        return request('/pointsManagementController/pointsManagementList', param, 'post')
    }
    //平台业务列表
    static async businessList(param) {
        return request('/businessTypeController/businessTypeList', param, 'post')
    }
    //添加
    static async add(param) {
        return request('/pointsManagementController/addPointsManagement', param, 'post')
    }
    //修改
    static async update(param) {
        return request('/pointsManagementController/updatePointsManagement', param, 'post')
    }
    //单个查询
    static async select(param) {
        return request('/pointsManagementController/selectPointsManagement', param, 'post')
    }
    //删除
    static async del(param) {
        return request('/pointsManagementController/delPointsManagement', param, 'post')
    }
    //前端用户列表
    static async frontUsr(param) {
        return request('/frontUserController/frontUserList', param, 'post')
    }
    //查看统计信息
    static async countSystem(param) {
        return request('/pointsManagementController/countPointsSystem', param, 'post')
    }
}
