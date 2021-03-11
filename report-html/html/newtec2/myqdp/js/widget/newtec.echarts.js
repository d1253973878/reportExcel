;(function(){
	if(Newtec.Echarts != undefined){
		alert('newtec.echarts.js已经被引入!');
		return ;
	}
	Newtec.Echarts=function(params){
		var ds=params['ds'];
		this.ds=Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		//symbol: 'circle',<!-- 配置样式  ：飞机planePath  圆点circle  箭头arrow-->
		this.defaults = {
			appendTo: '',
			planePath : 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
			color : ['#ffffb2'],
			datas:'',
			autoFetch:false,
			size:30,
			regions:null,
			option:{
			      backgroundColor: '#f0f1f3',    //整个页面的背景颜色
				   /*  title : {
				        text: '模拟迁徙',
				        subtext: '数据纯属虚构',
				        left: 'center',
				        textStyle : {
				            color: '#fff'
				        }
				    }, */
				     tooltip : {
				        trigger: 'item'
				    }, 
				    legend: {						
				        orient: 'vertical',        //  按钮竖着排序
				        top: 'bottom',			   //  按钮出现最下方
				        left: 'right',			   //  按钮出现在最右边
				        data:['北京 Top', '上海 Top', '广州 Top'],  //  按钮功能
				        textStyle: {
				            color: '#2277ee'         //  文本颜色
				        },
				        selectedMode: 'single'   //   作为地图的操作交互  ,这里的属性值为 'single'即单选
				    },
				    geo: {
				    	map: 'china',            //   引入中国地图
				    	regions: [{				 //   在地图中对特定的区域配置样式。
				    	    name: '广东',
				    	    itemStyle: {
				    	        normal: {
				    	            areaColor: '#0170aa',
				    	            color: '#0170aa'
				    	        }
				    	    }
				    	}], 
				    	label: {
				            emphasis: {
				                show: true      //  是否显示省名称
				            }
				        },
				        roam: true,              //可以拖动       
				        itemStyle: {			 //设置中国地图颜色
				            normal: {
				            	areaColor: '#0476e1',    // 设置初始中国地图颜色0170aa
				            	borderColor: '#fff'   // 设置中国地图背景颜色
				            },
				            emphasis: {
				                areaColor: '#7ec1e4'     // 设置鼠标悬浮到省的颜色
				            }
				        }
				    },
				}
        };
		this.defaults=$.extend(true,this.defaults,params);
		this.defaults['option']['geo']['regions']=params['regions'];
	};
	Newtec.Utils.addJS('echarts-all-3.js','thirdparty/echarts/js/echarts/');
	Newtec.Utils.addJS('china.js','thirdparty/echarts/js/echarts/map/');
	Newtec.Echarts.exte(Newtec.Base,'echarts');
	Newtec.Echarts.prototype.createNewtecJQ=function(params){
		var newtecJQ=params['appendTo']?$(params['appendTo']):$('<div></div>');
		this.myChart = echarts.init(newtecJQ[0]);   //初始化
		return newtecJQ;
	};
	
	Newtec.Echarts.prototype.setData=function(datas,append){
		if(!Newtec.Utils.isArray(datas)){
			alert('传入数据是非数组');return;
		}
		var series = [],
		defaults=this.defaults,
		color =defaults.color, 
		planePath=defaults.planePath,
		option=	defaults.option,
		size=defaults.size,
		titles=[];
		
		datas.forEach(function (item, i) { // 在地图上加载三条航线    配置航线的信息  -->
			var name=item['title'],
			data=item['data'],
			myColor=item['color']?item['color']:color;
			titles.push(name);
			series.push({
		        name:name,// 只显示该条航线的详细信息  -->
//		        tooltip:{formatter:'donsdgnas'},
				type: 'lines',
		        zlevel: 1,			   // 让飞机尾部喷气特效显示在地图上面 -->
		        effect: {              // 配置飞机尾部喷气特效 -->
		       	    show: true,		   // 是否显示飞机尾部喷气特效     默认false -->
		            period: 6,         // 配置飞机尾部喷气特效速度 -->
		            trailLength: 0.7,  // 配置飞机尾部喷气的显示痕迹 -->
		            color: '#fff',
		            symbolSize: 3
		        },
		        lineStyle: {		  // 飞机的飞行轨迹跟航线统一 ，  航线.飞机颜色跟地名颜色统一  -->
	        	normal: {
	                color: myColor,  // 按钮颜色跟随航线颜色  -->
	                width: 0,         // 航线虚化  -->
		        	curveness: 0.2    // 飞机尾部喷气特效跟飞机的飞行轨迹统一  -->
	            }
	        },
	       		 data: convertData(data)  // 加载飞机尾部喷气特效  -->
		    },
		    {
		    	name: name,
//		    	tooltip:{formatter:'donsdgnas'},
		        type: 'lines',
		        zlevel: 2,           // 让航线的终点指标名称显示在地图上面 -->
		        effect: {  			 // 配置飞机信息-->
		        	show: true,	     // 是否显示飞机    默认false-->
		            period: 6,		 // 配置飞机速度 -->
		            trailLength: 0,  // 配置飞机的显示痕迹 -->
		       		symbol: planePath,// 配置样式  ：飞机-->
		       		symbolSize: 7 	 // 配置飞机大小-->
		        },
		        lineStyle: {  
		        	normal: {
		        		color: "#ffffcc",// 给飞机的颜色配置成航线的颜色-->
		                width: 1,
		                opacity: 0.4,
		                curveness: 0.2  // 配置飞机飞行的航线-->
		            }
		        },
		        data: convertData(data) // 加载飞机配置信息  -->
		    },
		    {
		    	name: name, 
		    	type: 'effectScatter',
		    	tooltip:{formatter:function(e){console.info("-->>>",e);}},
		    	coordinateSystem: 'geo',  
		    	zlevel: 2,         // 让航线的线路显示在地图上面 -->
		        rippleEffect: {
		            brushType: 'stroke'
		        },label: {
		            normal: {
		                show: true,        // 配置是否显示坐标名称 -->
		                position: 'right', // 配置坐标名称显示在右侧 -->
		                formatter: '{b}' ,  // 配置显示的坐标名称内容 -->
		                color:'black'
		            }
		        },
		        
		        symbolSize: function (val) {// 根据该航线地点的value/8来设置该图标的大小 -->
		            return val[2] / 8;
		        },
		        itemStyle: {                // 配置航线地点（图标，名称）的颜色跟航线的颜色匹配 -->
		            normal: {
		                color: function(e,t){
		                	return e['name']=='北京'?"#ffff00":myColor;
		                }
		            }
		        },
		         // 所有航线地点详情 -->
		        data: data.map(function (dataItem) {
		        	return {					
		            	name: dataItem['fromName'],  										// 鼠标悬浮地点（显示地点名称） -->
		                value: geoCoordMap[dataItem['fromName']].concat([(dataItem['size']?dataItem['size']:size)])// 鼠标悬浮地点（显示地点坐标 ）-->
		            };
		        })
		    });
		});
		option.series=series;
		option.legend.data=titles;
		this.myChart.setOption(option, true);
	};
	Newtec.Echarts.prototype.finsh=function(params){
		
	};
	Newtec.Echarts.prototype.fetchData=function(params){
		if(Newtec.Utils.isNull(this.ds)) return;
		if(Newtec.Utils.isNull(params)){params={ds:this.ds.dsName};};
		var This=this;
	    //
		//合并初始化限制的请求条件
		var fetchParam=$.extend(true,{},this.defaults['fetchParams']);
		params=$.extend(true,fetchParam,params);
		var callback=params['callback'];
		params['callback']=function(response){
			This.hideLoadDiv();
			if(Newtec.Utils.isFunction(callback)){
				callback(response);
			}
			if(response.status==0){
				This.setData(response.data);
			}else{
				console.error(response.error);
			}
		};
		this.ds.fetchData(params);
	};
	var convertData = function (data) {
	    var res = [];
	    for (var i = 0; i < data.length; i++) {
	        var dataItem = data[i];
	        if(dataItem['fromName']=='北京')continue;
	        var  fromCoord= geoCoordMap[dataItem['fromName']];  //出发地坐标
	        var toCoord = geoCoordMap[dataItem['toName']];	//目的地坐标
	        if (fromCoord && toCoord) {
	        	res.push([{									//配置航线幅度
	            	coord: fromCoord                       
	            }, {
	            	coord: toCoord
	            }]);
	        }
	    }
	    return res;
	};
	var geoCoordMap=function(name){
		console.info("-----geoCoordMap-----");
		var url='http://api.map.baidu.com/geocoder/v2/';
		jQuery.ajax({url:url,
			type:'POST',
			data:{address:name,output:'json',ak:'6eea93095ae93db2c77be9ac910ff311'},
			dataType:'json',
			async: (params['async']=='false' || params['async']==false)?false:true,
			success:function(response){
				console.info("=-==....",response);
			}});
		return geoCoordMap1[name];
	}
	//http://api.map.baidu.com/geocoder/v2/?address=地址&output=json&ak=6eea93095ae93db2c77be9ac910ff311
	var geoCoordMap = {
		    '上海': [121.4648,31.2891],
		    '东莞': [113.8953,22.901],
		    '江苏': [119.3684,33.013],
		    '山东': [118.5276,36.0992],
		    '东营': [118.7073,37.5513],
		    '中山': [113.4229,22.478],
		    '临汾': [111.4783,36.1615],
		    '临沂': [118.3118,35.2936],
		    '丹东': [124.541,40.4242],
		    '丽水': [119.5642,28.1854],
		    '乌鲁木齐': [87.9236,43.5883],
		    '佛山': [112.8955,23.1097],
		    '保定': [115.0488,39.0948],
		    '甘肃': [103.5901,36.3043],
		    '包头': [110.3467,41.4899],
		    '北京': [116.4551,40.2539],
		    '北海': [109.314,21.6211],
		    '南京': [118.8062,31.9208],
		    '南宁': [108.479,23.1152],
		    '江西': [116.0046,28.6633],
//		    '浙江': [121.82895,29.930743],
		    '南通': [121.1023,32.1625],
		    '厦门': [118.1689,24.6478],
		    '台州': [121.1353,28.6688],
		    '安徽': [117.29,32.0581],
		    '呼和浩特': [111.4124,40.4901],
		    '咸阳': [108.4131,34.8706],
		    '黑龙江': [127.9688,45.368],
		    '唐山': [118.4766,39.6826],
		    '嘉兴': [120.9155,30.6354],
		    '大同': [113.7854,39.8035],
		    '大连': [122.2229,39.4409],
		    '天津': [117.4219,39.4189],
		    '山西': [112.3352,37.9413],
		    '威海': [121.9482,37.1393],
		    '宁波': [121.5967,29.6466],
		    '宝鸡': [107.1826,34.3433],
		    '宿迁': [118.5535,33.7775],
		    '常州': [119.4543,31.5582],
		    '广东': [113.5107,23.2196],
		    '廊坊': [116.521,39.0509],
		    '延安': [109.1052,36.4252],
		    '张家口': [115.1477,40.8527],
		    '徐州': [117.5208,34.3268],
		    '德州': [116.6858,37.2107],
		    '惠州': [114.6204,23.1647],
		    '四川': [103.9526,30.7617],
		    '扬州': [119.4653,32.8162],
		    '承德': [117.5757,41.4075],
		    '拉萨': [91.1865,30.1465],
		    '无锡': [120.3442,31.5527],
		    '日照': [119.2786,35.5023],
		    '云南': [102.9199,25.4663],
		    '浙江': [119.5313,29.8773],
		    '枣庄': [117.323,34.8926],
		    '柳州': [109.3799,24.9774],
		    '株洲': [113.5327,27.0319],
		    '湖北': [114.3896,30.6628],
		    '汕头': [117.1692,23.3405],
		    '江门': [112.6318,22.1484],
		    '辽宁': [123.1238,42.1216],
		    '沧州': [116.8286,38.2104],
		    '河源': [114.917,23.9722],
		    '泉州': [118.3228,25.1147],
		    '泰安': [117.0264,36.0516],
		    '泰州': [120.0586,32.5525],
		    '济南': [117.1582,36.8701],
		    '济宁': [116.8286,35.3375],
		    '海南': [110.3893,19.8516],
		    '淄博': [118.0371,36.6064],
		    '淮安': [118.927,33.4039],
		    '深圳': [114.5435,22.5439],
		    '清远': [112.9175,24.3292],
		    '温州': [120.498,27.8119],
		    '渭南': [109.7864,35.0299],
		    '湖州': [119.8608,30.7782],
		    '湘潭': [112.5439,27.7075],
		    '滨州': [117.8174,37.4963],
		    '潍坊': [119.0918,36.524],
		    '烟台': [120.7397,37.5128],
		    '玉溪': [101.9312,23.8898],
		    '珠海': [113.7305,22.1155],
		    '盐城': [120.2234,33.5577],
		    '盘锦': [121.9482,41.0449],
		    '河北': [114.4995,38.1006],
		    '福建': [119.4543,25.9222],
		    '秦皇岛': [119.2126,40.0232],
		    '绍兴': [120.564,29.7565],
		    '聊城': [115.9167,36.4032],
		    '肇庆': [112.1265,23.5822],
		    '舟山': [122.2559,30.2234],
		    '苏州': [120.6519,31.3989],
		    '莱芜': [117.6526,36.2714],
		    '菏泽': [115.6201,35.2057],
		    '营口': [122.4316,40.4297],
		    '葫芦岛': [120.1575,40.578],
		    '衡水': [115.8838,37.7161],
		    '衢州': [118.6853,28.8666],
		    '青海': [101.4038,36.8207],
		    '陕西': [109.1162,34.2004],
		    '贵州': [106.6992,26.7682],
		    '连云港': [119.1248,34.552],
		    '邢台': [114.8071,37.2821],
		    '邯郸': [114.4775,36.535],
		    '河南': [113.4668,34.6234],
		    '鄂尔多斯': [108.9734,39.2487],
		    '重庆': [107.7539,30.1904],
		    '金华': [120.0037,29.1028],
		    '铜川': [109.0393,35.1947],
		    '银川': [106.3586,38.1775],
		    '镇江': [119.4763,31.9702],
		    '吉林': [125.8154,44.2584],
		    '湖南': [113.0823,28.2568],
		    '长治': [112.8625,36.4746],
		    '阳泉': [113.4778,38.0951],
		    '青岛': [120.4651,36.3373],
		    '韶关': [113.7964,24.7028]
		};
	Newtec.Module("Echarts")
})();