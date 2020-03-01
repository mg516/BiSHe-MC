new Vue({
    el: '.mainBox',//将class为mainBox的DOM元素，作为vue实例的挂载目标
    data: {//Vue 实例的数据对象

        // 菜单列表
        // label：菜单名称
        // key：菜单唯一标识
        // container：当前菜单内容标识
        navList: [
            {label:'条形图',key:'TXT',container:['1-1','1-2','1-3','1-4']},
            {label:'折线图',key:'ZXT',container:['2-1','2-2','2-3','2-4']},
            {label:'饼图',key:'BT',container:['3-1','3-2','3-3','3-4']},
            {label:'散点图',key:'SDT',container:['4-1','4-2','4-3','4-4']},
            {label:'树图',key:'ST',container:['5-1','5-2','5-3']},
            {label:'重力图（力导图）',key:'ZLT',container:['6-1']},
            {label:'地图',key:'ZLT',container:['7-1']},
        ],
        activeIndex:-1,//当前选中的tab序号
    },
    // 可以直接通过Vue实例访问,或者在指令表达式中使用的方法
    methods: {
        // tab标签页点击事件
        // index：tab标签的序号
        checkIt(index){
            if(!index && index!==0){
                // 若方法未传递参数，则取缓存序号
                // 若不存在缓存，则取第一个tab标签
                index = this.getStorage('activeIndex')||0;
            }else{
                // 若方法有参数，则将序号缓存到本地（以便刷新页面可直接定位到当前选中的tab页）
                this.setStorage('activeIndex',index);
            }
            // 将要显示的tab页序号赋值
            this.activeIndex = index;
            // 待页面DOM更新完毕，执行初始化图表函数
            this.$nextTick(()=>{
                this.initChart();
            });
        },
        // 初始化echart图表
        initChart(){
            // 获取当前类型图表的容器标识
            let container = this.navList[this.activeIndex].container;
            let chartData = [];//定义变量：图表数据
            // 若当前tab页无内容标识，认为不需要展示图表，直接终止程序
            if(!container || container.length<0) return '';
            // 遍历当前tab页内容，逐个渲染当前页的图表
            container.map(async item=>{//async：同步方式请求接口,可等待请求响应再执行后续操作
                let json = null;//定义变量：echart图表渲染所需的option
                try{
                    // 请求本地保存的，指定图表的json文件
                    let jsonReturn = await this.getJson(`./json/chart-${item}.json`);
                    json = jsonReturn.data;
                }catch (e) {
                    // 若请求响应失败，则终止程序
                    json = null;
                    return '';
                }
                chartData.push(json);//保存当前页面数据-没用
                // 存在复杂图表，数据需要进一步处理
                if(json.complexData){
                    // 判断：当存在复杂图表，即json.complexData为真时
                    let key = item.replace('-','_');
                    if(this[`renderChart${key}`]){
                        this[`renderChart${key}`](json);
                    }else{
                        return '';
                    }
                }else{
                    // 判断：若不是复杂图表，直接调用echarts的原生方法，渲染图表
                    if(document.getElementById(`chart-${item}`)){
                        // 创建echarts实例
                        let myChart = echarts.init(document.getElementById(`chart-${item}`));
                        // 执行渲染图表自定义方法
                        this.renderFunc(myChart,json);
                    }
                }
            });
        },
        // 渲染第四tab页的第二个图表（下同解释，函数内均为对数据的处理）
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
                this.renderFunc(myChart,option);
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
                this.renderFunc(myChart,option);
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
            this.renderFunc(myChart,option);
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
                this.renderFunc(myChart,option);
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
            let option = {
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
            }
            this.renderFunc(myChart,option);
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
            let option = {
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
                    name: '还原',
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
            }
            this.renderFunc(myChart,option);

            document.oncontextmenu = function() {
                return false;
            };
            myChart.on('contextmenu', showMenu);
        },
        renderChart7_1(jsonReturn){
            let arr = jsonReturn.data;
            let myChart = echarts.init(document.getElementById(`chart-7-1`));
            
            var mapName = 'china'
            var data =[],toolTipData = [];
            arr.map(item=>{
                data.push({
                    name: item.provinceShortName,
                    value: item.confirmedCount
                })
                // 总数量
                toolTipData.push({
                    name: item.provinceShortName,
                    value: [{
                        name: "确诊",
                        value: item.confirmedCount
                    }]
                })
            })

            var geoCoordMap = {};

            // 排序
            function keysort(key) {
                return function(a, b) {
                    return Number(b[key] - a[key])
                }
            }
            data.sort(keysort('value')); //按照fev1与fvc的和进行排序

            /*获取地图数据*/
            var mapFeatures = echarts.getMap(mapName).geoJson.features;
            mapFeatures.forEach(function(v) {
                // 地区名称
                var name = v.properties.name;
                // 地区经纬度
                geoCoordMap[name] = v.properties.cp;
            });
            // console.log("============geoCoordMap===================")
            // console.log(geoCoordMap)
            // console.log("================data======================")
            // console.log(data)
            // console.log(toolTipData)
            var max = 480, //设置的气泡等大小的系数
                min = 9; // todo //设置的气泡等大小的系数
            var maxSize4Pin = 100, //设置的气泡等大小的系数
                minSize4Pin = 20; //设置的气泡等大小的系数

            var convertData = function(dt) {// 处理覆盖上面的点，得有经纬度，所以下面的value有经纬度
                var res = [];
                for (var i = 0; i < dt.length; i++) {
                    var geoCoord = geoCoordMap[dt[i].name];
                    if (geoCoord) {
                        res.push({
                            name: dt[i].name,
                            value: geoCoord.concat(dt[i].value),//这里把经纬度
                        });
                    }
                }
                return res;
            };
            option = {

                backgroundColor:'#fff',
                title: {
                    text: "2020新冠病毒分布-2020-02-07",
                    x: 'left',
                    textStyle: {
                        color: "#0009",
                        fontSize: 20,
                        fontWeight: 'normal'
                    },
                    subtextStyle: {
                        fontSize: 14,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        if(typeof params.data.value == 'number'){
                            return ` 地区：${params.data.name}<br> 确诊：${params.data.value}例`;
                        }else{
                            return ` 地区：${params.data.name}<br> 确诊：${params.data.value[2]}例`;
                        }
                        // console.log(typeof(params.value)[2])
                        var toolTiphtml = ''
                        for (var i = 0; i < toolTipData.length; i++) {
                            if (params.name == toolTipData[i].name) {
                                toolTiphtml += toolTipData[i].name + '（设备覆盖情况）<br>'
                                for (var j = 0; j < toolTipData[i].value.length; j++) {
                                    toolTiphtml += toolTipData[i].value[j].name + '：' + toolTipData[i].value[j].value + "<br>"
                                }
                            }
                        }
                        // console.log(toolTiphtml)
                        // console.log(convertData(data))
                        return toolTiphtml;
                    }
                },
                // legend: {
                //     orient: 'vertical',
                //     y: 'bottom',
                //     x: 'right',
                //     data: ['credit_pm2.5'],
                //     textStyle: {
                //         color: '#fff'
                //     }
                // },
                visualMap: {
                    show: true, //去掉层级过滤显示
                    min: 0,
                    // max: 200,//取活跃值最高的当上限
                    max: 1600,//data[0].value, //取活跃值最高的当上限
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'], // 文本，默认为数值文本
                    calculable: true,
                    seriesIndex: [1],
                    textStyle: {
                        color: '#C8D3FF',
                    },
                    inRange: {
                        // color: ['#3B5077', '#031525'] // 蓝黑
                        // color: ['#ffc0cb', '#800080'] // 红紫
                        // color: ['#3C3B3F', '#605C3C'] // 黑绿
                        // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
                        // color: ['#23074d', '#cc5333'] // 紫红
                
                        // color: ['#1488CC', '#031525'] // 浅蓝
                        color: ['#ffaa85', '#ff7b69', '#bf2121', '#af2121', '#9f2121', '#8f2121', '#7f2121', '#6f1818'] // 蓝绿
                        // color: ['#5474F6', '#3652D5', '#2542AF', '#1D1663']
                    }
                },
                /*工具按钮组*/
                // toolbox: {
                //     show: true,
                //     orient: 'vertical',
                //     left: 'right',
                //     top: 'center',
                //     feature: {
                //         dataView: {
                //             readOnly: false
                //         },
                //         restore: {},
                //         saveAsImage: {}
                //     }
                // },
                geo: {
                    show: true,
                    map: mapName,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    layoutCenter: ["50%", "50%"],
                    layoutSize: "120%",
                    roam: true, //是否可以放大缩小
                    itemStyle: {
                        normal: {
                            // areaColor: '#031525',//所有地图区块默认的
                            // areaColor: '#3764FF', //所有地图区块默认的
                            // borderColor: '#3B5077',
                        },
                        emphasis: {
                            // areaColor: '#2B91B7',//省份放上去的颜色
                            areaColor: 'rgba(55, 100, 255, 0.5)', //省份放上去的颜色
                        }
                    }
                },
                series: [{
                        name: '散点', //省份的名称以及名称旁边的，根据数据来显示：有数据就显示没有数据就不显示
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(toolTipData),
                        symbolSize: function(val) {
                            // if (Number(val[2].value) + Number(val[3].value) > 0) {
                            //     return 20; //固定
                            // } else {
                            //     return 0; //不显示
                            // }
                            return val[0].value / 20;//根据数据自适应大小

                        },
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#05C3F9'
                            }
                        }
                    },
                    {
                        type: 'map',
                        map: mapName,
                        geoIndex: 0,
                        aspectScale: 0.75, //长宽比
                        showLegendSymbol: false, // 存在legend时显示
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#031525',
                                borderColor: '#3B5077',
                            },
                            emphasis: {
                                areaColor: '#2B91B7'
                            }
                        },
                        animation: false,
                        data: data
                    },
                    // 这里注释的是总数的分布
                    // {
                    //     name: '点',
                    //     type: 'scatter',
                    //     coordinateSystem: 'geo',
                    //     symbol: 'pin', //气泡
                    //     symbolSize: function(val) {
                    //         var a = (maxSize4Pin - minSize4Pin) / (max - min);
                    //         var b = minSize4Pin - a * min;
                    //         b = maxSize4Pin - a * max;
                    //         return a * val[2] + b;//气泡的大小随之数据变化
                    //     },
                    //     label: {
                    //         normal: {
                    //             show: true,
                    //             formatter: function(params) {
                    //                 return params.data.value[2]
                    //             },
                    //             textStyle: {
                    //                 color: '#fff',
                    //                 fontSize: 9,
                    //             }
                    //         }
                    //     },
                    //     itemStyle: {
                    //         normal: {
                    //             color: '#F62157', //标志颜色.气泡颜色
                    //         }
                    //     },
                    //     zlevel: 6,
                    //     data: convertData(data),
                    // },
                    // 这里的是活跃的分布
                    {
                        name: '点',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        symbol: 'pin', //气泡
                        symbolSize: function(val) {
                            var a = (maxSize4Pin - minSize4Pin) / (max - min);
                            var b = minSize4Pin - a * min;
                            b = maxSize4Pin - a * max;
                            // 没有活跃度的不显示气泡有的才显示
                            return 50

                        },
                        label: {
                            normal: {
                                show: true,
                                formatter: function(params) {
                                    return params.data.value[2]
                                },
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 15,
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#F62157', //标志颜色.气泡颜色
                            }
                        },
                        zlevel: 6,
                        data: convertData(data),
                    },
                    // {
                    //     name: 'Top 5',
                    //     type: 'effectScatter',
                    //     coordinateSystem: 'geo',
                    //     data: convertData(data.sort(function(a, b) {
                    //         return b.value - a.value;
                    //     }).slice(0, 5)),
                    //     symbolSize: function(val) {
                    //         return val[2] / 10 > 10 ? val[2] / 10 : 10; //自适应大小
                    //     },
                    //     showEffectOn: 'render',
                    //     rippleEffect: {
                    //         period: 10, //涟漪动画周期
                    //         brushType: 'stroke'
                    //     },
                    //     hoverAnimation: false,
                    //     label: {
                    //         normal: {
                    //             formatter: '{b}',
                    //             position: 'right',
                    //             show: true
                    //         }
                    //     },
                    //     itemStyle: {
                    //         normal: {
                    //             color: 'yellow',
                    //             shadowBlur: 10,
                    //             shadowColor: 'yellow'
                    //         }
                    //     },
                    //     zlevel: 1
                    // },
                ]
            };
            myChart.setOption(option);
        },
        // 渲染图表方法
        renderFunc(echartObj,option){
            echartObj.clear();//清空当前容器
            echartObj.setOption(option);//导入图表option参数进行渲染
            echartObj.resize();//根据容器尺寸重置图表大小
        },
        // 缓存数据到本地
        setStorage(key,val){
            window.sessionStorage.setItem(key,val);
        },
        // 获取本地缓存数据
        getStorage(key){
            return window.sessionStorage.getItem(key);
        },
        // 请求本地json文件
        getJson(url){
            return axios.get(url);
        }
    },
    // vue实例挂载后执行的函数
    mounted() {
        // 选中指定tab页
        this.checkIt();
        // 初始化echart图表
        this.initChart();
    }
});