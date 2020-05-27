import request from 'superagent';
import { test, testIP } from './serverIP';

const agent = request.agent();

//请求修改密码
export function ModifyPassword(data) {
    let url = '/api/v1/update/user';
    if(test)
        url = testIP + url;
    return agent
            .post(url)
            .send(data)
            .accept('application/json')
            .withCredentials();
}

//请求添加用户
export function ToAddUser(data) {
    let url = '/api/v1/add/user';
    if(test)
        url = testIP + url;
    return agent
            .post(url)
            .send(data)
            .accept('application/json')
            .withCredentials();
}

//请求删除用户 
export function ToDelUser(data) {
    let url = '/api/v1/del/user';
    if(test)
        url = testIP + url;
    return agent
            .post(url)
            .send(data)
            .accept('application/json')
            .withCredentials();
}

//请求获取所有用户的用户名 
export function ToGetUsers() {
    let url = '/api/v1/get/users';
    if(test)
        url = testIP + url;
    return agent
            .get(url)
            .accept('application/json')
            .withCredentials();
}