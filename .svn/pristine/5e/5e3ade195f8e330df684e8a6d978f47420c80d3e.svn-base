
    Newtec.Component(
        function(){
        	
            Newtec.Utils.addCSS('chart.css', 'chart/css/')
            Newtec.Utils.addJS("echarts.js","thirdparty/echart/")
            var titleColor = '#1291EA'
            var barChart = $(  `
            <div class="barChartBox"  style=" width:33%; height: 100%; flex:3; position: relative; margin-right:10px; background:#fff">
                <div class="line"></div>
                <div id="barChart" style=" width:100%; height: 100% "> 
                </div>
                <div class="textBox">
                    <div class="left pull-left"><div>2,480</div><div>问题数据总数(条)</div></div>
                    <div class="right pull-right"><div>2,480</div><div>问题数据总数(条)</div></div>
                </div>
            </div>
            `)  
            var lineChart = $(` <div class="lineChartBox"  style="  height: 100%; flex:4; position: relative; margin-right:10px;background:#fff">
                    <div class="line"></div>
                    <div id="lineChart" style=" height: 100%; flex:4"></div>
                    </div>`)  
            var HlineChart =$(` <div class="HlineChartBox"  style="  height: 100%; flex:1.5; position: relative; margin-right:10px;background:#fff">
                    <div class="line"></div>
                    <div id="HlineChart" style=" height: 100%; flex:1.5"></div>
            </div>`)  

            var irregular = $(` <div class="irregularBox"  style="  height: 100%; flex:1.5; position: relative; margin-right:10px;background:#fff">
            <div class="line"></div>
            <div id="irregular" style=" height: 100%; flex:1.5"></div>
    </div>`)  
            
            $('.chart').append(barChart).append(lineChart).append(HlineChart).append(irregular)

           $(function(){
                var  barChartX = ['空值检查','值域检查','规范检查','重复数据','引用完整性','平衡性检查']
                var   barChartY = ['0','20','40','60','80','100']
                var barChartSeries =[
                        {
                            name:'空值检查',
                            value:110
                        },
                        {
                            name:'值域检查',
                            value:0,
                            itemStyle: {
                                color:'#FF2868'
                            }
                        },
                        {
                            name:'规范检查',
                            value:0,
                            itemStyle: {
                                color:'#FF2868'
                            }
                        },
                        {
                            name:'重复数据',
                            value:0,
                            itemStyle: {
                                color:'#FF2868'
                            }
                        },
                        {
                            name:'引用完整性',
                            value:0
                        },
                        {
                            name:'平衡性检查',
                            value:0
                        }
                    ]


                    var lineChartX = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    var lineChartY = ['0','100','200','300','400','500']
                    var lineChartSeries = [50,100,150,100,200,150,100,400,150,300,250,400]

                    var HlineChartY =  ['客户联系人信息','汇率服务','客户联系人信息','汇率服务','客户联系人信息','汇率服务','客户联系人信息','汇率服务','客户联系人信息','汇率服务']
                    var HlineChartSeries1 = [1500, 1500, 1500, 1500, 1500, 1500, 1500,1500,1500,1500]
                    var HlineChartSeries2 = [500, 1000, 500, 1000, 500, 1000, 500,1000,500,1000]


                    var irregulartSeries = [
                        {
                            value:[70, 60, 77, 80,56,44,60,23,30,80],
                        }
                    ]

                    var irregulartIndicator =  [
                        {
                             name: '公共代码',
                              max: 80,
                            axisLabel: {
                                show: true,
                                textStyle:{
                                    color:'#000'
                                }
                        }
                        },
                        {name:'',max: 80},
                        { name: '证书', max: 80 },
                        {name:'',max: 80},
                        { name: '客户', max: 80 },
                        {name:'',max: 80},
                        { name: '法人', max: 80 },
                        {name:'',max: 80},
                        { name: '人员', max: 80 },
                        {name:'',max: 80}
                    ]
                var barChartDom = echarts.init(document.getElementById('barChart'))
                var barChartOption = {
                    title: {
                        text:'数据质量达标情况',
                        textStyle:{
                            fontSize:20,
                            fontWeight:'bold',
                            color:titleColor,
                            
                        },
                        left:15
                    },
                    grid: {
                        top:'35%',
                        bottom:'5%',
                        left:'1%',
                        containLabel:true
                        
                    },
                    legend: {
                        data:['达标','不达标'],
                        top:90,
                        right:50,
                        itemWidth:14,
                        itemHeight:14
                    },
                    xAxis: {
                        type:'category',
                        data:barChartX,

                        axisTick: {
                            show:false
                       },
                       axisLine: {
                            show:false
                        },
                    },
                    yAxis:{
                        type:'value',
                        data:barChartY,
                        axisTick: {
                            show:false
                       },
                       axisLine: {
                           lineStyle:{
                               color:'#F1F1F1'
                           }
                       },
                       splitLine: {
                        show:false
                    },
                       axisLabel: {
                           color:'#000'
                       }
                       
                    },
                    series:[
                        {
                            name:'达标',
                            type:'bar',
                            data:barChartSeries,
                            markLine: {
                                symbol: ['none', 'none'],
                                silent:true,
                                lineStyle: {
                                    type:'solid',
                                    color:'#00B7AB'
                                },
                                data: [{
                                    yAxis: 80
                                }],
                                label: {
                                    formatter:'80分'
                                }
                            },
                            barWidth : 20,
                            itemStyle: {
                                color:'#00B7AB',
                                barBorderRadius:[20, 20, 0, 0]
                            },
                           
                        },
                       {
                           name:'不达标',
                           type:'bar',
                           itemStyle: {
                            color:'#FF2868',
                        },
                           data:[],
                           barGap:'-100%'
                       }
                     
                    ]
                }
                barChartDom.setOption(barChartOption)


                var lineChartDom = echarts.init(document.getElementById('lineChart')) 
                var lineChartOption = {
                    color:['#FF2868','#05C8BB'],
                    title: {
                            top:5,
                            left:10,
                            text:['{a|本年度数据质量趋势情况}',
                            '{b|单位：次}'].join('                                                                                  '),
                            textStyle:{
                            color:'#4593f3',
                            rich:{
                                b:{
                                    marginLeft:20,
                                    color:'black'
                                }
                            }
                        },
                        
                    },
                    tooltip: {
                        trigger:'axis',
                        axisPointer: {
                            type:'none',
                            label: {
                               
                            }
                        },
                        alwaysShowContent:true,
                    },
                   grid: {
                        left:'5%',
                        top:'25%',
                        bottom:'5%',
                        containLabel: true
                   },
                    legend: {
                           left:'6%',
                            top:'15%',
                            icon:'emptyCircle',
                            data:[
                                {
                                    name:'健康数据',
                                    textStyle: {
                                        color:'#000',
                                        
                                    }
                                },
                                {
                                    name:'问题数据',
                                    textStyle: {
                                        color:'#000'
                                    }
                                } 
                            ],
                            itemGap:30
                        },
                        xAxis: {
                            type:'category',
                            data:lineChartX,
                            axisTick: {
                                show:false
                           },
                           axisLine: {
                                show:false
                            },
                        },
                        yAxis: [
                            {
                                type:'value',
                                max:500,
                                min:0,
                               
                                nameTextStyle:{
                                    align:'center',
                                    // width:'100%'
                                },
                             
                                data:lineChartY,
                                axisTick: {
                                    show:false
                               },
                               axisLine: {
                                   show:false
                               },
                               splitLine: {
                                   lineStyle: {
                                       color:'#F4F4F4'
                                   }
                               }
                               
                            },
                        ],
                        series:[
                        
                            {
                                name:'问题数据',
                                type:'line',
                                data:lineChartSeries,
                                symbolSize:10,
                                lineStyle: {
                                    color:'#FF2868',
                                    width:2
                                },
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ 

                                        offset: 0,
                                        color: '#EEDBE2'
                                    },{
                                        offset: 1,
                                        color: '#FDECEF'
                                    }])
                                }  
                            },
                            {
                                name:'健康数据',
                                type:'line',
                                data:[150,200,250,200,300,250,200,500,250,400,350,500],
                                symbolSize:10,
                                lineStyle: {
                                    color:'#05C8BB',
                                    width:2
                                },
                            } ,
                            
                        ]
        
                }
                
                lineChartDom.setOption(lineChartOption)


                var HlineChartDom = echarts.init(document.getElementById('HlineChart')) 
                var HlineChartOption = {
                    title:{
                        top:5,
                        text:['{a|服务调用TOP10}',
                        '{b|单位：次}'].join('              '),
                        textStyle:{
                        color:'#4593f3',
                        rich:{
                            b:{
                                marginLeft:20,
                                color:'black'
                            }
                        }
                    },
        
            
            
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {          // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
            
                    grid: {
                        left:96,
                        width:126,
                        height:214,
            
                    },
                    xAxis:  {
                        type: 'value',
                        axisLine:{
                            show:false
                        },
                        axisLabel:false,
                        axisTick:false,
                        splitLine:false,
                    },
                    yAxis:[
                        {
                            type: 'category',
                            data:HlineChartY,
                            axisLine:{
                                show:false
                            },
                            axisTick:false,
                
                        },
                        // {
                        //     name:'单位：次',
                        //     axisLine: {
                        //         show:false
                        //     },
                        // }
                    ],
                    series: [
                        {
            
                            name: 'amount',
                            type: 'bar',
                            data:HlineChartSeries1 ,
                            itemStyle:{
                                barBorderRadius: 100,
                                color:'#cfe4ff'
                            }
            
                        },
                        {
                            barGap: '-100%', // Make series be overlap
                            name: '服务调用次数',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: [135, 5],
            
                                }
                            },
                            data: HlineChartSeries2,
                            itemStyle:{
                                barBorderRadius: [100, 0, 0, 100],
                                color:'#4593f3',
                            }
            
                        },
                    ]
                };
            
                HlineChartDom.setOption(HlineChartOption)

                var irregulartDom = echarts.init(document.getElementById('irregular')) 
                var irregularOption = {

                        title: {
                            top:5,
                            left:10,
                            text:['{a|各类情况调用情况}',
                            '{b|单位：次}'].join('           '),
                            textStyle:{
                            color:'#4593f3',
                            rich:{
                                b:{
                                    marginLeft:20,
                                    color:'black'
                                }
                            }
                        },
                      
                    },

                    // legend: {
                    //     bottom: 5,
                    //     data: ['北京', '上海', '广州'],
                    //     itemGap: 20,
                    //     textStyle: {
                    //         color: '#fff',
                    //         fontSize: 14
                    //     },
                    //     selectedMode: 'single'
                    // },
                    radar: {
                        center:['50%','60%'],
                        radius: '60%',
                        indicator:irregulartIndicator,
                        splitNumber: 4,
                        name: {
                            textStyle: {
                                color: '#000'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: [
                                    'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
                                    'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
                                    'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
                                ].reverse()
                                // color:'#E0E0E0'
                            }
                        },
                        splitArea: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                // color: 'rgba(238, 197, 102, 0.5)'
                                color: '#E0E0E0'
                            }
                        }
                    },
                    series: [
                        {
                            name: '各类情况调用情况',
                            type: 'radar',
                            data: irregulartSeries,
                            symbol: 'circle', 
                            symbolSize: 6,
                            itemStyle: {
                                    color: '#3AA1FF'
                            },
                            areaStyle: {
                                normal: {
                                    opacity: 0.3
                                }
                            }
                        }
                       
                       
                    ]
                };
                irregulartDom.setOption(irregularOption)
           })
            
        })

