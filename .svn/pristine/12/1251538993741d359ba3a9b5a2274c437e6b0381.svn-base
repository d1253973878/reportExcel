
;(function(){
	if(Newtec.Percent != undefined){
		alert('Newtec.Percent已经加载过来.js');
		return ;
	}
	Newtec.Percent.create=function(params){
		var t1 = Date.parse(new Date());
		this.defaults = {
		        'dataPercent':5,
		        'dataSize':40,
		        class1 : 'easy-pie-chart percentage',
		        class2 : 'percent'
		   };
		params = $.extend({},this.defaults,params);
		var data = params["dataPercent"];
		var div = "<div class='"+params['class1']+"' data-percent='"+data+"' data-size='"+params['dataSize']+"'>"
			+"<span class='"+params['class2']+"'>"+data+"</span>%"
			+"</div>";
		var dataPercent = $(div);
		Newtec.Utils.appendTo(dataPercent, params["appendTo"]);
//		alert('好事：（'+(Date.parse(new Date())-t1)+'）');
		
		dataPercent.click(function () { 
			var clickFun = params["click"];
			if(clickFun instanceof Function)
				clickFun();
			
			var ds = new Newtec.DS('testDSID');
		
			alert("删除");
			var remove = {
					operId:'操作删除updateID123',
						data:{name:'张代售点发送'},
						callback:function(data){
							alert('删除结果>>>>>>>>>>>'+JSON.stringify(data));
						}
					};
			ds.removeData(remove);
			
		}); 
		return dataPercent;
	};
	Newtec.Percent = function  (){};
	Newtec.Module("Percent")
)();