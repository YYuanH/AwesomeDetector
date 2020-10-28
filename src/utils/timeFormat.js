export default function timeFormat(timeArray) {
    return timeArray.map((item, index) => {
            let dateObj = new Date(item);
            let M = (dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1) + '-';
            let D = dateObj.getDate() + ' ';
            let h = (dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()) + ':';
            let m = (dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes()) + ':';
            let s = dateObj.getSeconds();
            let time = M + D + h + m + s;
            return time;
        });
}