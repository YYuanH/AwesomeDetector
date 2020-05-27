import request from 'superagent';
import { testIP, test } from './serverIP';

const agent = request.agent();

export function GetOverviewData() {
    let url = '/api/v1/get/overview';
    if(test)
        url = testIP + url;

    return agent.get(url).accept('application/json').withCredentials() ;
}

//获取操作系统数量
export function GetOSNum() {
    let url = '/api/v1/get/system';
    if(test)
        url = testIP + url;
    return agent.get(url).accept('application/json').withCredentials();
}

//获取上/下载速度最快的前五个设备
export function GetFiveClients() {
    let url = '/api/v1/get/clients/faster';
    if(test)
        url = testIP + url;
    return agent.get(url).accept('application/json').withCredentials();
}


//获取在线设备数量
export function GetDeviceNum(data) {
    let url = '/api/v1/get/clients/online';
    if(test) 
        url = testIP + url;
    return agent.post(url).send(data).accept('application/json').withCredentials();
}