;(function(){
	Newtec.Utils.addJS("../../thirdparty/highcharts/highcharts.js");
	
	
	Newtec.Splinechart = function(params){
		this.defaults = {
				bigClick:null,
				dealDate:false,
				toDateStr:true,
				pointClick:null,
			};
			$.extend(true,this.defaults,params);
	};
	Newtec.Splinechart.exte(Newtec.Base,"splineChart");
	Newtec.Splinechart.over({
		createNewtecJQ :function(params){
			var defaults = this.defaults;
			this.createContainer(defaults);
			
			this.createChart();
			return $(this.container);
		},
		createContainer :function(defaults){
			this.container =$('<div class="newtec-baseChart"></div>');
		},
		createChart:function(){
			var chartContainer = $("<div class='chartContainer'></div>");
			
			this.container.append(chartContainer);
			this.chartContainer = chartContainer;
			var defaults=this.defaults;
			var series = defaults.series;
			var unit = defaults.unit==undefined?"单位：条":defaults.unit;
			var enabled = defaults.enabled==false?false:true;
			var title = defaults.title;
			var colors = defaults.colors;
			var bigClick = defaults.bigClick;
			var pointClick = defaults.pointClick;
			var height = defaults.height;
			var categories = defaults.categories;
			var type = "datetime";
			var OldInterval = 3;
			console.info("categories==",categories.length);
			if(defaults.dealDate){
				for(var i=0,len=categories.length;i<len;i++){
					categories[i]=new Date(categories[i]+" 12:00:00").getTime()||categories[i];
				}
			}
			if(Newtec.Utils.isFunction(bigClick)){
				var magnifier = $('<i id="magnifier" class="fa fa-search-plus" aria-hidden="true"></i>');
				this.container.append(magnifier);
				magnifier.click(function(){
					bigClick();
				});
			}
			Highcharts.setOptions({
				lang:{
					resetZoom:'返回',
					resetZoomTitle:'返回缩放比例'
				}
			});
			var that=this;
			chartContainer.highcharts({
				colors : colors,
				title : {
					text : title
				},
				legend : {
					layout : 'vertical',    //图例说明布局（垂直显示,默认横向显示）
		            align : 'right',        //图例说明的显示位置
		            verticalAlign : 'top',  //纵向的位置
		            x : -93,  
		            y : 0,  
		            borderWidth : 0,
		            floating : true		   //可以出现在图中
				},
				credits : {
				    enabled : false
				},
		        chart : {
		            type : 'spline',
		            zoomType:"x", 
		            events: {
		            	//监听图表区域选择事件
		            	selection: function () {
		            	//动态修改
		            	that.DynamicChangeTickInterval(1,this);
		            	}
		            },
		            height : height,
		            marginLeft : 50,
		            marginTop : 50,
		        },
		        xAxis : {
		            categories : categories,
		            type:type,
//		            type:Newtec.Utils.isNull(type)&&'datetime'||type,
		            tickWidth:0,
		            tickInterval:len>20&&OldInterval||null,
		            labels:{
		            	y:categories.length>15?32:15,
		            	rotation: categories.length>15?-45:0,
		            	formatter:function(){
		            		var value=this.value;
		            		return Highcharts.dateFormat('%Y/%m/%d',value)||value;
		            	}
		            }
		        },
		        yAxis : {
		            title : {
		            	text : '',
		            	rotation : 0,
					},
					labels:{
						x:-4,
						formatter: function(){
							var value=this.value;
							value= (value>=100000000&&Highcharts.numberFormat(this.value/100000000,1)+"亿")
							||(value>=10000000&&Highcharts.numberFormat(this.value/10000000,1)+"千万")
							||(value>=1000000&&Highcharts.numberFormat(this.value/1000000,1)+"百万")
							||(value>=10000&&Highcharts.numberFormat(this.value/10000,1)+"万")
							||value;
							
							return isNaN(value)?value.replace(".0",""):value;
						}
					}
		        },
		        tooltip : {
		        	crosshairs: {
		        		width:1,
		        		color:'#d3d3d3'
		        	},
		        	backgroundColor:'#666666',
		        	borderColor: '#666666',  
		        	borderRadius:15,
		        	opacity: 0.5,
		        	shadow:true,
		        	animation:true,
		        	style: {                      // 文字内容相关样式
		        		color: "#ffffff",
		        		fontSize: "14px",
		        		fontWeight: "blod",
		        		fontFamily: "Courir new"
		        	},
		        	formatter: function () {
		        		var x=this.x;
		        		if(defaults.dealDate){
		        			var d=new Date(this.x);
		        			x=(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());
		        		}
		        		var s = '<span>' + x+ '</span>';
		        		s += '<br/><span style="font-size:20px;color:' + this.point.series.color + '">\u25CF </span>';
		        		s += '<span>'  + this.point.y + '</span>';
		        		return s;
		        	}
		        },
		        plotOptions : {
		        	spline : {
						dataLabels : {
							crop:false,
							overflow:'none',
							enabled : enabled,
							style : {
								color:'#a9a9a9',
								fontSize:'14px',
								textOutline:"none",
							},
							x : 0,
							y : 0
						},
						marker:{
							symbol:'circle'
						},
						enableMouseTracking : true,
						point : {
							events : {
								click:function(){
									if(Newtec.Utils.isFunction(pointClick)){
										pointClick();
									}
								}
							}
						}
					}
		        },
		        series : series,
		        exporting : {
		        	enabled:false,
		        	sourceHeight:500,
		        	sourceWidth:1200
		        }
		    },function(chart){
		    	chart.renderer.label('<span>'+unit+'</span>',0,0,null,null,null,true).css({
		    		color:'#999b9b',
		    		fontSize:'16px'
		    	}).add();
		    }
			);
			this.ExtendHighcharts(OldInterval,this,categories);
			
		},
		//拖动图表放大后改变间隔
		DynamicChangeTickInterval:function(interval,chart){
			chart.xAxis[0].update({
				tickInterval: interval
			});
		},
		//点击还原按钮返回原间隔
		ExtendHighcharts:function(OldInterval,_this,categories){
			Highcharts.extend(Highcharts.Chart.prototype,{zoomOut:function(){
				var len=categories.length;
				OldInterval=len>20&&OldInterval||null;
				_this.DynamicChangeTickInterval(OldInterval,this);
				this.zoom();
			}
			});
		},
		toReflow:function(){
			var chartContainer=this.chartContainer;
			if(!Newtec.Utils.isFunction(chartContainer.reflow)){
				chartContainer=chartContainer.highcharts();
			}
			chartContainer.reflow();
		},
		finsh:function(){
			var that=this;
			$(window).resize(function() {
				that.toReflow();
	    	});
		}
	});
	Newtec.Module("Splinechart")
})();