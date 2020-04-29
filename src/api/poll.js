import request from 'superagent';
const agent = request.agent();
var test = true;

const electron = window.require('electron');
const fs = electron.remote.require('fs');
var testIP = JSON.parse(fs.readFileSync('config.json', 'utf-8')).testIp;
// var testIP = JSON.parse(fs.readFileSync('/usr/lib/awesome-detector/config.json', 'utf-8')).testIp;

export default function Poll() {
    let url = '/api/v1/is/signed/manage';
    if(test) url = testIP + url;

    return agent
        .get(url)
        .withCredentials()
        .accept('application/json');
}