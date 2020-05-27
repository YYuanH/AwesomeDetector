/*!
 *  MyLine Componets
 *  @Params
 *    - data <Required> <Array-type>
 *    - orderLineColor <Optional> <Array-type>
 *    - customName <Optional> <Function>
 */

import React, { Component } from 'react'
// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

import timeFormat from '../../utils/timeFormat';

const preLineColor = [
  'rgb(81, 171, 255)',  // blue
  'rgb(235, 32, 72)',   // red
  'rgb(112, 243, 151)', // green
  'rgb(255, 118, 87)',  // orange
  'rgb(250, 0, 98)',  // yellow
];

export default class MyLine extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timestamp: [],
      dataLegend: [],
      dataList: []
    }
  }

  componentWillReceiveProps(pre) {
    if(pre.data) {
      if(!this.props.compare) {
        let dataLegend = Object.keys(pre.data).map((key) => {
          if( key !== 'timestamp')
            return this.props.varToReadable ? this.props.varToReadable(key) : this.varToReadable(key)
          return null
        });

        dataLegend.indexOf(null);
        dataLegend.splice(dataLegend.indexOf(null), 1)

        this.setState({dataLegend: dataLegend});
      } else {
        let dataLegend = [];
        let result = [];
        console.log(pre.data)
        Object.keys(pre.data).map((item) => {
          Object.keys(pre.data[item]).map(key => {
            if( key !== 'timestamp') {
              let temp = item + this.varToReadable(key);
              console.log(temp)
              dataLegend.push(temp);
              console.log(dataLegend)
            }
          })
          return null
        });

        if(pre.data) {
          Object.keys(pre.data).map((item1, index1) => {
          Object.keys(pre.data[item1]).map((item, index) => {
            if(item !== 'timestamp') {
              result.push({
                name: this.props.varToReadable ? (item1 + this.props.varToReadable(item)) : (item1 + this.varToReadable(item)),   // [*] add translate function
                type:'line', 
                smooth: true,
                xAxisIndex: index1,
                sampling: 'average',
                // itemStyle: {
                //     color: this.props.color ? this.props.color : preLineColor[index-1]    // [*] add select color funciton
                // },
                center: ['150%', '100%'],
                areaStyle: {color: 'rgba(0,0,0,0)'} ,
                emphasis: {
                  itemStyle: {
                    shadowColor: 'rgba(52, 90, 90, 0.95)',
                    shadowBlur: 10,
                  }
                },
                data: pre.data[item1][item]
              });
            }
              return ;
            })
            return null;
          })
        }

        // dataLegend.indexOf(null);
        // dataLegend.splice(dataLegend.indexOf(null), 1)

        console.log(dataLegend)

        this.setState({
          dataLegend: dataLegend,
          finalData: result
        });
      }
    }
  }

  varToReadable = (name) => {
    switch(name) {
      case `timestamp`: return '时间戳'
      case `loss_rate`: return '丢包率'
      case `routers`: return '跳数'
      case 'value': return `客户端 ${this.props.clientId} 传输速度`
      default: return name
    }
  }

  getOptions = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: !!this.props.extraData ? `{a} <br/>速度: {c} (Mbps) ${Object.keys(this.props.extraData).map(item => `<br/><span style="font-weight: 600; font-color: rgba(0, 0, 0, 0.75)">${this.varToReadable(item)}: ${this.props.extraData[item]}</span>`)}`.replace(/\,/g, "") : `{a} <br/>速度: {c} (Mbps)`,
        backgroundColor: 'rgba(255, 255, 255, 0.86)',
        textStyle: {
          color: '#000',
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
      },
      grid: {
        right: '48px',
        left: '48px',
        top: '24px',
      },
      legend: {
        type: 'scroll',
        data: this.state.dataLegend,
        // selected: this.props.data.selected
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            // color:'rgba(0, 0, 0, 0.45)'
          }
        },
        boundaryGap: false,
        data: this.props.data ? (this.props.data.timestamp ? timeFormat(this.props.data.timestamp) : []) : []
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
          // color:'rgba(0, 0, 0, 0.45)'
        }},
        boundaryGap: [0, '100%']
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, 
      // {
      //   start: 0,
      //   end: 50,
      //   bottom: 0,
      //   handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      //   handleSize: '90%',
      //   handleStyle: {
      //     color: '#fff',
      //     shadowBlur: 3,
      //     shadowColor: 'rgba(0, 0, 0, 0.6)',
      //     shadowOffsetX: 2,
      //     shadowOffsetY: 2
      //   }
      // }
    ],
      series: this.props.data ? Object.keys(this.props.data).map((item, index) => {
        if(item !== 'timestamp') {
          return {
            name: this.props.varToReadable ? this.props.varToReadable(item) : this.varToReadable(item),    // [*] add translate function
            type:'line', 
            smooth: true,
            sampling: 'average',
            itemStyle: {
                color: this.props.color ? this.props.color : preLineColor[index-1]    // [*] add select color funciton
            },
            center: ['150%', '100%'],
            areaStyle: Object.keys(this.props.data).length <= 2 ? {} :{color: 'rgba(0,0,0,0)'} ,
            emphasis: {
              itemStyle: {
                shadowColor: 'rgba(52, 90, 90, 0.95)',
                shadowBlur: 10,
              }
            },
            data: this.props.data[item].map(item => (item/1000/1000).toFixed(3))
          };
        }
        return null;
      }) : []
    };
    return option;
  }

 

  render() {

    return (
      <div>
        <ReactEcharts
          notMerge={true}
          style={this.props.style ? this.props.style : {}}
          lazyUpdate={true}
          option={this.props.data ? this.getOptions() : {}}
          // onEvents={ this.props.onEvents ? this.props.onEvents : {} }
        />
      </div>
    )
  }
}
