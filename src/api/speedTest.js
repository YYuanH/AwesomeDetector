import request from 'superagent';
const electron = window.require('electron');
const fs = electron.remote.require('fs');

const agent = request.agent();
var test = true;
var testIP = JSON.parse(fs.readFileSync('config.json', 'utf-8')).testIp;
// var testIP = JSON.parse(fs.readFileSync('/usr/lib/awesome-detector/config.json', 'utf-8')).testIp;
{/* 获取在线客户端列表 */}
export function GetList() {
    let url = '/api/v1/get/clients';
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send({get_all:false})            
                .accept('application/json')
                .withCredentials();
}


{/* 获取指定客户端的路由跳数和延迟，参数：client_id */}
export function GetClientInfo(data) {
    let url = '/api/v1/get/client/info';
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send(data)
                .accept('application/json')
                .withCredentials();
}

{/* 获取指定客户端的上行速度，参数：client_id start_time end_time */}
export function GetUploadSpeed(data) {
    let url = '/api/v1/get/client/speed/upload';
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send(data)
                .accept('application/json')
                .withCredentials();
}

{/* 获取指定客户端的下行速度，参数：client_id start_time end_time */}
export function GetDownloadSpeed(data) {
    let url = '/api/v1/get/client/speed/download';
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send(data)
                .accept('application/json')
                .withCredentials();
}
