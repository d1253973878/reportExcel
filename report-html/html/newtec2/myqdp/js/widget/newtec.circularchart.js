;(function(){
	Newtec.Utils.addJS("../../thirdparty/highcharts/highcharts.js");
	Newtec.Circularchart = function(params){
		this.defaults = {
				
		};
		$.extend(true,this.defaults,params);
	};
	Newtec.Circularchart.exte(Newtec.Base,"circularchart");
	Newtec.Circularchart.over({
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
			var title = defaults.title;
			var colors = defaults.colors;
		
			series = [{
				type : 'pie',
				innerSize : '80%',//内圆比例
				name : '比例',
				data : [
				      //方式1
				      {
				    	  name : '测试1',
				    	  y : 25,
				    	//  selected : true,//
				    	//  sliced : true,//加载后突出
				      },
				      //方式2
				      ['测试2', 10],
				      ['其他', 65]
				 ]
			}];
			
			chartContainer.highcharts({
				chart : {
					spacing : [40, 0, 40, 0]
				},
				title : {
					floating : true,
					text : title
				},
				credits : {
					enabled : false
				},
				series : series
			}/*,function(c){//图表初始化完毕后的回调函数
				//环形圆心
				var centerY = c.series[0].center[1];
				var	titleHeight = parseInt(c.title.styles.fontSize);
				//动态设置标题位置
				c.setTitle({
					y : centerY + titleHeight/2
				});
			}*/);
		},
		toReflow:function(){
			var chartContainer = this.chartContainer;
			if(!Newtec.Utils.isFunction(chartContainer.reflow)){
				chartContainer = chartContainer.highcharts();
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
	Newtec.Module("Newtec.Circularchart")
})();