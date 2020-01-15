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
                        this[`renderChart${key}`](json);
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
        async renderChart4_3(jsonReturn){
            let data = null;
            if(jsonReturn && jsonReturn.data){
                data = jsonReturn.data;
            }else{
                data = null;
                return '';
            }
            let option = {
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
        async renderChart4_4(jsonReturn){
            let data = null;
            if(jsonReturn && jsonReturn.data){
                data = jsonReturn.data;
            }else{
                data = null;
                return '';
            }
            let myChart = echarts.init(document.getElementById(`chart-4-4`));
            myChart.hideLoading();

            let itemStyle = {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            };

            let sizeFunction = function (x) {
                let y = Math.sqrt(x / 5e8) + 0.1;
                return y * 80;
            };
            // Schema:
            let schema = [
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
                            let value = obj.value;
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
                                    let colors = ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a'];
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

            for (let n = 0; n < data.timeline.length; n++) {
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
        async renderChart5_1(){
            let data = {
                "name": "flare",
                "children": [
                    {
                        "name": "data",
                        "children": [
                            {
                                "name": "converters",
                                "children": [
                                    {"name": "Converters", "value": 721},
                                    {"name": "DelimitedTextConverter", "value": 4294}
                                ]
                            },
                            {
                                "name": "DataUtil",
                                "value": 3322
                            }
                        ]
                    },
                    {
                        "name": "display",
                        "children": [
                            {"name": "DirtySprite", "value": 8833},
                            {"name": "LineSprite", "value": 1732},
                            {"name": "RectSprite", "value": 3623}
                        ]
                    },
                    {
                        "name": "flex",
                        "children": [
                            {"name": "FlareVis", "value": 4116}
                        ]
                    },
                    {
                        "name": "query",
                        "children": [
                            {"name": "AggregateExpression", "value": 1616},
                            {"name": "And", "value": 1027},
                            {"name": "Arithmetic", "value": 3891},
                            {"name": "Average", "value": 891},
                            {"name": "BinaryExpression", "value": 2893},
                            {"name": "Comparison", "value": 5103},
                            {"name": "CompositeExpression", "value": 3677},
                            {"name": "Count", "value": 781},
                            {"name": "DateUtil", "value": 4141},
                            {"name": "Distinct", "value": 933},
                            {"name": "Expression", "value": 5130},
                            {"name": "ExpressionIterator", "value": 3617},
                            {"name": "Fn", "value": 3240},
                            {"name": "If", "value": 2732},
                            {"name": "IsA", "value": 2039},
                            {"name": "Literal", "value": 1214},
                            {"name": "Match", "value": 3748},
                            {"name": "Maximum", "value": 843},
                            {
                                "name": "methods",
                                "children": [
                                    {"name": "add", "value": 593},
                                    {"name": "and", "value": 330},
                                    {"name": "average", "value": 287},
                                    {"name": "count", "value": 277},
                                    {"name": "distinct", "value": 292},
                                    {"name": "div", "value": 595},
                                    {"name": "eq", "value": 594},
                                    {"name": "fn", "value": 460},
                                    {"name": "gt", "value": 603},
                                    {"name": "gte", "value": 625},
                                    {"name": "iff", "value": 748},
                                    {"name": "isa", "value": 461},
                                    {"name": "lt", "value": 597},
                                    {"name": "lte", "value": 619},
                                    {"name": "max", "value": 283},
                                    {"name": "min", "value": 283},
                                    {"name": "mod", "value": 591},
                                    {"name": "mul", "value": 603},
                                    {"name": "neq", "value": 599},
                                    {"name": "not", "value": 386},
                                    {"name": "or", "value": 323},
                                    {"name": "orderby", "value": 307},
                                    {"name": "range", "value": 772},
                                    {"name": "select", "value": 296},
                                    {"name": "stddev", "value": 363},
                                    {"name": "sub", "value": 600},
                                    {"name": "sum", "value": 280},
                                    {"name": "update", "value": 307},
                                    {"name": "variance", "value": 335},
                                    {"name": "where", "value": 299},
                                    {"name": "xor", "value": 354},
                                    {"name": "x_x", "value": 264}
                                ]
                            },
                            {"name": "Minimum", "value": 843},
                            {"name": "Not", "value": 1554},
                            {"name": "Or", "value": 970},
                            {"name": "Query", "value": 13896},
                            {"name": "Range", "value": 1594},
                            {"name": "StringUtil", "value": 4130},
                            {"name": "Sum", "value": 791},
                            {"name": "Variable", "value": 1124},
                            {"name": "Variance", "value": 1876},
                            {"name": "Xor", "value": 1101}
                        ]
                    },
                    {
                        "name": "scale",
                        "children": [
                            {"name": "IScaleMap", "value": 2105},
                            {"name": "LinearScale", "value": 1316},
                            {"name": "LogScale", "value": 3151},
                            {"name": "OrdinalScale", "value": 3770},
                            {"name": "QuantileScale", "value": 2435},
                            {"name": "QuantitativeScale", "value": 4839},
                            {"name": "RootScale", "value": 1756},
                            {"name": "Scale", "value": 4268},
                            {"name": "ScaleType", "value": 1821},
                            {"name": "TimeScale", "value": 5833}
                        ]
                    }
                ]
            };

            let option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                series:[
                    {
                        type: 'tree',
                        id: 0,
                        name: 'tree1',
                        data: [data],

                        top: '10%',
                        left: '8%',
                        bottom: '22%',
                        right: '20%',

                        symbolSize: 7,

                        edgeShape: 'polyline',
                        edgeForkPosition: '63%',
                        initialTreeDepth: 3,

                        lineStyle: {
                            width: 2
                        },

                        label: {
                            backgroundColor: '#fff',
                            position: 'left',
                            verticalAlign: 'middle',
                            align: 'right'
                        },

                        leaves: {
                            label: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        },

                        expandAndCollapse: true,
                        animationDuration: 550,
                        animationDurationUpdate: 750
                    }
                ]
            };

            if(document.getElementById(`chart-5-1`)){
                let myChart = echarts.init(document.getElementById(`chart-5-1`));
                myChart.clear();//清空当前图表
                myChart.setOption(option);
            }
        },
        async renderChart5_2(jsonReturn){
            let data = null;
            if(jsonReturn && jsonReturn.data){
                data = jsonReturn.data;
            }else{
                data = null;
                return '';
            }
            let myChart = echarts.init(document.getElementById(`chart-5-2`));
            myChart.hideLoading();

            myChart.clear();//清空当前图表
            myChart.setOption(option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                series:[
                    {
                        type: 'tree',

                        data: [data],

                        left: '2%',
                        right: '2%',
                        top: '8%',
                        bottom: '20%',

                        symbol: 'emptyCircle',

                        orient: 'vertical',

                        expandAndCollapse: true,

                        label: {
                            position: 'top',
                            rotate: -90,
                            verticalAlign: 'middle',
                            align: 'right',
                            fontSize: 9
                        },

                        leaves: {
                            label: {
                                position: 'bottom',
                                rotate: -90,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        },

                        animationDurationUpdate: 750
                    }
                ]
            });
        },
        async renderChart5_3(){
            let struct_colors = [
                '#ed6f6d', '#f3765d', '#f77a57', '#f98866', '#f99579',
                '#ff9f3b', '#f0a732', '#e6a840', '#e9b253', '#ebbb66',
                '#78b7e8', '#59b1f3', '#66bbf5', '#6ec3f2', '#75cae2',
                '#70cccc', '#5dc4c4', '#4dbebd', '#4cc1a7', '#4fca96',
                '#4cc686'
            ];

            let info2 = {
                'children': [{
                    'value': 2,
                    'name': '一级结构',
                    'manage': 'liang-01',
                }, {
                    'value': 42,
                    'name': 'fds-------test--------------------------yy----',
                    'manage': 'liang-01',
                }, {
                    'children': [{
                        'name': '二级组织结构-1',
                        'value': 20,
                        'manage': 'liang-01',
                    }, {
                        'name': '二级组织结构-2',
                        'value': 20,
                        'manage': 'liang-01',
                    }, {

                        'children': [{
                            'name': '三级-1',
                            'value': 10,
                            'manage': 'liang-01',
                        }, {
                            'name': '三级-2',
                            'value': 20,
                            'manage': 'liang-01',
                        }],
                        'name': '二级-03',
                        'manage': 'liang-02',
                    }],
                    'name': 'has children',
                    'manage': 'liang-01',
                }, {
                    'name': 'fds no children',
                    'value': 100,
                    'manage': 'liang-01',
                    // 'color': struct_colors[index],
                }]
            };
            let structs_datas = [];
            let formatUtil = echarts.format;

            function format_struct_data(children, structs_datas) {
                // 添加每个单位的颜色
                for (let prop in children) {
                    let index = Math.floor(Math.random() * 20);
                    let tmp = {
                        itemStyle: {
                            normal: {
                                color: struct_colors[index]
                            }
                        },
                        name: children[prop].name,
                        manage: children[prop].manage,
                        value: children[prop].value,
                        children: []
                    }
                    format_struct_data(children[prop].children, tmp.children);
                    if(tmp.children.length === 0){
                        delete tmp.children;
                    }
                    structs_datas.push(tmp);
                    // return structs_datas;

                }

            }

            function showMenu(param) {
                // 可在此处添加右击操作内容
                console.log('showMenu==============', param);
                let event = param.event;
                let pageX = event.offsetX;
                let pageY = event.offsetY;
                console.log('showMenu========', pageX, pageY);

            }
            format_struct_data(info2.children, structs_datas);
            let myChart = echarts.init(document.getElementById(`chart-5-3`));
            myChart.clear();//清空当前图表
            myChart.setOption(option = {
                title: {
                    text: '树图构建组织结构',
                    subtext: '2017/07 by liang',
                    left: 'leafDepth'
                },
                tooltip: {
                    formatter: function(info) {
                        // console.log('tool------', info);
                        let value = info.value;
                        let name = info.name;

                        return [
                            '<h4>' + name + '</h4>',
                            '<p> 资产数量：' + value + '</p>',
                        ].join('');
                    }
                },

                series: [{
                    name: 'org',
                    type: 'treemap',
                    visibleMin: 300,
                    // data: format_struct_data(info2.children, structs_datas),
                    data: structs_datas,
                    leafDepth: 1,
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTopLeft',
                            formatter: function(a) {
                                console.log('formatter==label=======', a);
                                return a.name + "\n\n资产数量 : " + a.data.value + "\n管理员 ： " + a.data.manage;
                                // return [
                                //     '<div><h1>' + a.name + '</h1></div>',
                                //     '<div><p>' + a.value + '</></div>',
                                // ].join('');
                            },
                            textStyle: {
                                // color: '',  label的字体颜色
                                fontSize: '14',
                                fontWeight: 'bold'
                            }
                        },
                        // emphasis: {
                        //     show: true,
                        //     position: 'insideTopLeft',
                        //     formatter: function(a) {
                        //         console.log('formatter===label======', a);
                        //         return a.name + "\n\n" + "资产数量 : " + a.data.value + "\n等级得分";
                        //     },
                        //     textStyle: {
                        //         fontSize: '14',
                        //         fontWeight: 'bold'
                        //     }
                        // }
                    },
                    levels: [{
                        itemStyle: {
                            normal: {
                                borderWidth: 0,
                                gapWidth: 2
                            }
                        }
                    }, {
                        itemStyle: {
                            normal: {
                                gapWidth: 2
                            }
                        }
                    }, {
                        // colorSaturation: [0.35, 0.5],
                        itemStyle: {
                            normal: {
                                gapWidth: 2,
                                // borderColorSaturation: 0.6
                            }
                        }
                    }],
                    breadcrumb: {
                        show: true,
                        // "height": 22,
                        left: "10%",
                        top: "93%",
                        emptyItemWidth: 25,
                        itemStyle: {
                            normal: {
                                color: "#fff",
                                borderColor: "rgba(255,255,255,0.7)",
                                borderWidth: 1,
                                shadowColor: "rgba(150,150,150,1)",
                                shadowBlur: 3,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                textStyle: {
                                    color: "#000",
                                    fontWeight: 'bold'
                                }
                            },
                            emphasis: {
                                textStyle: {}
                            }
                        }
                    },
                }]
            });

            document.oncontextmenu = function() {
                return false;
            };
            myChart.on('contextmenu', showMenu);
        },
        renderChart6_1(){

        },
        getJson(url){
            return axios.get(url);
        }
    },
    mounted() {
        this.initChart();
    }
});