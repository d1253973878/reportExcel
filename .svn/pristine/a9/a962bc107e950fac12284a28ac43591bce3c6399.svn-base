;(function(){
	Newtec.Utils.addJS("../../thirdparty/highcharts/highcharts.js");
	Newtec.Columnchart = function(params){
		this.defaults = {
				bigClick:null,
				dealDate:false,
				pointClick:null,
		};
		$.extend(true,this.defaults,params);
	};
	Newtec.Columnchart.exte(Newtec.Base,"columnchart");
	Newtec.Columnchart.over({
		createNewtecJQ:function(params){
			var defaults = this.defaults;
			this.createContainer(defaults);
			
			this.createChart();
			return $(this.container);
		},
		createContainer : function(defaults){
			this.container = $('<div class="newtec-baseChart"></div>');
		},
		createChart : function(){
			var chartContainer = $("<div class='chartContainer'></div>");
			this.container.append(chartContainer);
			this.chartContainer = chartContainer;
			var defaults = this.defaults;
			var series = defaults.series;
			var unit = defaults.unit||"单位：条";
			var title = defaults.title;
			var colors = defaults.colors;
			var bigClick = defaults.bigClick;
			var pointClick = defaults.pointClick;
			var height = defaults.height;
			var categories = defaults.categories;
			console.info("categories==",categories.length);
			if(defaults.dealDate){
				for(var i=0,len=categories.length;i<len;i++){
					categories[i]=new Date(categories[i]+"12:00:00").getTime();
				}
			}
			
			
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
		            type : 'column',
		            height : height,
		            marginLeft : 50,
		            marginTop : 50
		        },
		        xAxis : {
		            categories : categories,
		            tickInterval:categories.length>50&&3||categories.length>30&&2||null,
		            labels:{
		            	rotation:categories.length>15&&-45||0,
		            	align:'right'
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
							var value= this.value;
							value= (value>=100000000&&Highcharts.numberFormat(this.value/100000000,1)+"亿")
							||(value>=10000000&&Highcharts.numberFormat(this.value/10000000,1)+"千万")
							||(value>=1000000&&Highcharts.numberFormat(this.value/1000000,1)+"百万")
							||(value>=10000&&Highcharts.numberFormat(this.value/10000,1)+"万")
							||value;
							
							return isNaN(value)?value.replace(".0",""):value;
						}
					}
		        },
		        plotOptions : {
		        	column : {
						dataLabels : {
							crop:false,
							overflow:'none',
							enabled : true,
							style : {
								color:'#a9a9a9',
								fontSize:'14px',
								textOutline:"none",
							},
							x : 0,
							y : -5
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
			if(Newtec.Utils.isFunction(bigClick)){
				magnifier.click(function(){
					bigClick();
				});
			}
		},
		toReflow:function(){
			var chartContainer=this.chartContainer;
			if(!Newtec.Utils.isFunction(chartContainer.reflow)){
				chartContainer=chartContainer.highcharts();
			}
			chartContainer.reflow();
		},
		finsh:function(){
			var that = this;
			$(window).resize(function(){
				that.toReflow();
			});
		}
	});
	Newtec.Module("Columnchart")
})();