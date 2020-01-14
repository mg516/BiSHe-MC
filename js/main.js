new Vue({
    el: '.mainBox',
    data: {
        navList: [
            {label:'条形图',key:'TXT',container:['1-1','1-2','1-3','1-4']},
            {label:'折线图',key:'ZXT',container:['2-1','2-2','2-3','2-4']},
            {label:'饼图',key:'BT',container:['3-1','3-2','3-3','3-4']},
            {label:'散点图',key:'SDT',container:['4-1','4-2','4-3','4-4']},
            {label:'树图',key:'ST',container:['5-1','5-2','5-3','5-4']},
            {label:'重力图',key:'ZLT',container:['6-1','6-2','6-3','6-4']},
        ],
        activeIndex:0,

    },
    methods: {
        checkIt(index){
            this.activeIndex = index;
            this.$nextTick(()=>{
                this.initChart();
            });
        },
        initChart(){
            // 获取当前类型图表的容器标识
            let container = this.navList[this.activeIndex].container;
            let chartData = [];
            if(!container || container.length<0) return '';
            container.map(async item=>{
                let json = null;
                try{
                    let jsonReturn = await this.getJson(`./json/chart-${item}.json`);
                    json = jsonReturn.data;
                }catch (e) {
                    json = null;
                    return '';
                }
                chartData.push(json);//保存当前页面数据-没用
                if(json.complexData){
                    // 复杂参数的图表：4-2
                    let key = item.replace('-','_');
                    if(this[`renderChart${key}`]){
                        this[`renderChart${key}`]();
                    }else{
                        return '';
                    }
                }else{
                    if(document.getElementById(`chart-${item}`)){
                        let myChart = echarts.init(document.getElementById(`chart-${item}`));
                        myChart.clear();//清空当前图表
                        myChart.setOption(json);
                    }
                }
            });
        },
        renderChart4_2(){
            let data = [
                [[28604,77,17096869,'Australia',1990],[31163,77.4,27662440,'Canada',1990],[1516,68,1154605773,'China',1990],[13670,74.7,10582082,'Cuba',1990],[28599,75,4986705,'Finland',1990],[29476,77.1,56943299,'France',1990],[31476,75.4,78958237,'Germany',1990],[28666,78.1,254830,'Iceland',1990],[1777,57.7,870601776,'India',1990],[29550,79.1,122249285,'Japan',1990],[2076,67.9,20194354,'North Korea',1990],[12087,72,42972254,'South Korea',1990],[24021,75.4,3397534,'New Zealand',1990],[43296,76.8,4240375,'Norway',1990],[10088,70.8,38195258,'Poland',1990],[19349,69.6,147568552,'Russia',1990],[10670,67.3,53994605,'Turkey',1990],[26424,75.7,57110117,'United Kingdom',1990],[37062,75.4,252847810,'United States',1990]],
                [[44056,81.8,23968973,'Australia',2015],[43294,81.7,35939927,'Canada',2015],[13334,76.9,1376048943,'China',2015],[21291,78.5,11389562,'Cuba',2015],[38923,80.8,5503457,'Finland',2015],[37599,81.9,64395345,'France',2015],[44053,81.1,80688545,'Germany',2015],[42182,82.8,329425,'Iceland',2015],[5903,66.8,1311050527,'India',2015],[36162,83.5,126573481,'Japan',2015],[1390,71.4,25155317,'North Korea',2015],[34644,80.7,50293439,'South Korea',2015],[34186,80.6,4528526,'New Zealand',2015],[64304,81.6,5210967,'Norway',2015],[24787,77.3,38611794,'Poland',2015],[23038,73.13,143456918,'Russia',2015],[19360,76.5,78665830,'Turkey',2015],[38225,81.4,64715810,'United Kingdom',2015],[53354,79.1,321773631,'United States',2015]]
            ];

            let option = {
                title: {
                    text: '1990 与 2015 年各国家人均寿命与 GDP'
                },
                legend: {
                    right: 10,
                    data: ['1990', '2015']
                },
                xAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    scale: true
                },
                series: [{
                    name: '1990',
                    data: data[0],
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    emphasis: {
                        label: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(120, 36, 50, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: 'rgb(251, 118, 123)'
                        }, {
                            offset: 1,
                            color: 'rgb(204, 46, 72)'
                        }])
                    }
                }, {
                    name: '2015',
                    data: data[1],
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    emphasis: {
                        label: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(25, 100, 150, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: 'rgb(129, 227, 238)'
                        }, {
                            offset: 1,
                            color: 'rgb(25, 183, 207)'
                        }])
                    }
                }]
            };

            if(document.getElementById(`chart-4-2`)){
                let myChart = echarts.init(document.getElementById(`chart-4-2`));
                myChart.clear();//清空当前图表
                myChart.setOption(option);
            }
        },
        async renderChart4_3(){
            let data = null;
            try{
                let jsonReturn = await this.getJson(`./json/chart-4-3.json`);
                data = jsonReturn.data.data;
            }catch (e) {
                data = null;
                return '';
            }
            var option = {
                title: {
                    text: 'Dispersion of house price based on the area',
                    left: 'center',
                    top: 0
                },
                visualMap: {
                    min: 15202,
                    max: 159980,
                    dimension: 1,
                    orient: 'vertical',
                    right: 10,
                    top: 'center',
                    text: ['HIGH', 'LOW'],
                    calculable: true,
                    inRange: {
                        color: ['#f2c31a', '#24b7f2']
                    }
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                xAxis: [{
                    type: 'value'
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: 'price-area',
                    type: 'scatter',
                    symbolSize: 5,
                    // itemStyle: {
                    //     normal: {
                    //         borderWidth: 0.2,
                    //         borderColor: '#fff'
                    //     }
                    // },
                    data: data
                }]
            };
            if(document.getElementById(`chart-4-3`)){
                let myChart = echarts.init(document.getElementById(`chart-4-3`));
                myChart.clear();//清空当前图表
                myChart.setOption(option);
            }
        },
        async renderChart4_4(){
            let data = null;
            try{
                let jsonReturn = await this.getJson(`./json/chart-4-4.json`);
                data = jsonReturn.data.data;
            }catch (e) {
                data = null;
                return '';
            }
            let myChart = echarts.init(document.getElementById(`chart-4-4`));
            myChart.hideLoading();

            var itemStyle = {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            };

            var sizeFunction = function (x) {
                var y = Math.sqrt(x / 5e8) + 0.1;
                return y * 80;
            };
            // Schema:
            var schema = [
                {name: 'Income', index: 0, text: '人均收入', unit: '美元'},
                {name: 'LifeExpectancy', index: 1, text: '人均寿命', unit: '岁'},
                {name: 'Population', index: 2, text: '总人口', unit: ''},
                {name: 'Country', index: 3, text: '国家', unit: ''}
            ];

            option = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        orient: 'vertical',
                        autoPlay: true,
                        inverse: true,
                        playInterval: 1000,
                        left: null,
                        right: 0,
                        top: 20,
                        bottom: 20,
                        width: 55,
                        height: null,
                        label: {
                            color: '#404a59'
                        },
                        symbol: 'none',
                        lineStyle: {
                            color: '#555'
                        },
                        checkpointStyle: {
                            color: '#bbb',
                            borderColor: '#777',
                            borderWidth: 2
                        },
                        controlStyle: {
                            showNextBtn: false,
                            showPrevBtn: false,
                            color: '#666',
                            borderColor: '#666'
                        },
                        emphasis: {
                            label: {
                                color: '#fff'
                            },
                            controlStyle: {
                                color: '#aaa',
                                borderColor: '#aaa'
                            }
                        },
                        data: []
                    },
                    // backgroundColor: '#404a59',
                    title: [{
                        text: data.timeline[0],
                        textAlign: 'center',
                        left: '63%',
                        top: '55%',
                        textStyle: {
                            fontSize: 100,
                            color: '#404a5977'
                        }
                    }, {
                        text: '各国人均寿命与GDP关系演变',
                        left: 'center',
                        top: 10,
                        textStyle: {
                            color: '#404a59',
                            fontWeight: 'normal',
                            fontSize: 20
                        }
                    }],
                    tooltip: {
                        padding: 5,
                        backgroundColor: '#222',
                        borderColor: '#777',
                        borderWidth: 1,
                        formatter: function (obj) {
                            var value = obj.value;
                            return schema[3].text + '：' + value[3] + '<br>'
                                + schema[1].text + '：' + value[1] + schema[1].unit + '<br>'
                                + schema[0].text + '：' + value[0] + schema[0].unit + '<br>'
                                + schema[2].text + '：' + value[2] + '<br>';
                        }
                    },
                    grid: {
                        top: 100,
                        containLabel: true,
                        left: 30,
                        right: '110'
                    },
                    xAxis: {
                        type: 'log',
                        name: '人均收入',
                        max: 100000,
                        min: 300,
                        nameGap: 25,
                        nameLocation: 'middle',
                        nameTextStyle: {
                            fontSize: 18
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#404a59'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} $'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '平均寿命',
                        max: 100,
                        nameTextStyle: {
                            color: '#404a59',
                            fontSize: 18
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#404a59'
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value} 岁'
                        }
                    },
                    visualMap: [
                        {
                            show: false,
                            dimension: 3,
                            categories: data.counties,
                            calculable: true,
                            precision: 0.1,
                            textGap: 30,
                            textStyle: {
                                color: '#404a59'
                            },
                            inRange: {
                                color: (function () {
                                    var colors = ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a'];
                                    return colors.concat(colors);
                                })()
                            }
                        }
                    ],
                    series: [
                        {
                            type: 'scatter',
                            itemStyle: itemStyle,
                            data: data.series[0],
                            symbolSize: function(val) {
                                return sizeFunction(val[2]);
                            }
                        }
                    ],
                    animationDurationUpdate: 1000,
                    animationEasingUpdate: 'quinticInOut'
                },
                options: []
            };

            for (var n = 0; n < data.timeline.length; n++) {
                option.baseOption.timeline.data.push(data.timeline[n]);
                option.options.push({
                    title: {
                        show: true,
                        'text': data.timeline[n] + ''
                    },
                    series: {
                        name: data.timeline[n],
                        type: 'scatter',
                        itemStyle: itemStyle,
                        data: data.series[n],
                        symbolSize: function(val) {
                            return sizeFunction(val[2]);
                        }
                    }
                });
            }

            myChart.clear();//清空当前图表
            myChart.setOption(option);
        },
        getJson(url){
            return axios.get(url);
        }

    },
    mounted() {
        this.initChart();
    }
});