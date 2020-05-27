import React from 'react';
import { Card, CardContent, makeStyles, Divider, CardHeader } from '@material-ui/core';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    chartContainer: {
        height: 250,
    },
}));

export default function DeviceChart(props) {
    const classes = useStyles();
    const data = props.value;
    //将data中的时间戳更改为合适的格式
    data.map((item, index) => {
        let dateObj = new Date(item.timestamp);
        let M = (dateObj.getMonth()+1 < 10 ? '0'+(dateObj.getMonth()+1) : dateObj.getMonth()+1) + '-';
        let D = dateObj.getDate() + ' ';
        let h = dateObj.getHours() + ':';
        let m = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
        let time = M + D + h + m;
        data[index].timestamp = time;
    });

    return (
        <Card>
            <CardHeader 
                title='在线设备数量' 
                titleTypographyProps={{
                    style: {
                        fontSize: 15,
                        fontWeight: 600,
                    },
                }}
            />
            <Divider />
            <CardContent>
              <div className={classes.chartContainer}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <Tooltip />                       
                        <XAxis dataKey='timestamp' label={{value:'时间', position:'bottom', offset:-7}} />
                        <YAxis />
                        <Bar name='数量' unit='台' dataKey='value' fill='#8884d8' barSize={15} barGap={10} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
        </Card>
    );
}

DeviceChart.propTypes = {
    value: PropTypes.array,
}