;(function(){
if(Newtec.Calendar != undefined){
		console.warn('newtec.calendar.js已经被引入!');
		return ;
	}
Newtec.Utils.addCSS("daterangepicker.css");
Newtec.Utils.addJS("moment.min.js");
Newtec.Utils.addJS("daterangepicker.js");
Newtec.Calendar = function (params) {
	//2.
	this.defaults = {
			className:"",
//			inputStyle:'',
//			showIcon:false,
			limitNow:false,
			canedit:true,
			timeParams:{
//				maxDate:moment(),	//最大时间
//				minDate:moment(),   //最小时间
//				startDate:moment(), //开始时间
//				endDate:moment(),   //结束时间
				showDropdowns : true,	//框内选择后跳转
				opens : 'right',	//框弹出的位置
				buttonClasses : [ 'btn btn-default' ],	//按钮样式
				applyClass : 'btn-small btn-primary blue',	//确认
				cancelClass : 'btn-small',	//取消
				singleDatePicker : true,	//是否显示单个
				
				locale : {  
					format: 'YYYY-MM-DD',	//控件中from和to 显示的日期格式
					separator: ' ~ ',	//分隔符
	                applyLabel : '确定',  
	                cancelLabel : '取消',  
	                fromLabel : '起始时间',  
	                toLabel : '结束时间',  
	                customRangeLabel : '自定义',  
	                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],  
	                monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',  
	                               '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
	                               firstDay : 1  
	            }	//汉化
			}
    };
	this.defaults=$.extend(true,this.defaults,params);
};
Newtec.Calendar.exte(Newtec.Base,'dateTime');
Newtec.Calendar.over({
	createNewtecJQ:function(params){
		
		var defaults=this.defaults,
		canedit = defaults.canedit==false?false:true,
		newtecJQ=$('<div class="newtec-datetime dateRange '+(defaults.className||"")+'"><input class="form-control" type="text" id="searchDate" '+(canedit==false&&(readonly="readonly")||"")+' style="background-color:#fff" ></input><i id="iconBtn" class="glyphicon glyphicon-calendar fa fa-calendar"></i></div>');
		var input=newtecJQ.find('input');
		var timeParams=defaults['timeParams'];
		if(defaults.limitNow)
			timeParams.maxDate=moment();
		input.daterangepicker(timeParams);
		this.dateInput=input;
		if(Newtec.Utils.isFunction(params.change)){
			input.on('change',function(a){
				params.change(input.val(),a);
			});
		}
		newtecJQ.find('#iconBtn').click(function(){
			input.focus();
		});
		return newtecJQ;
	},
	getDate:function(){
		return this.dateInput.val();
	},
	setDate:function(date){
		this.dateInput.val(date);
	},
});
	Newtec.Module("Newtec.Calendar")
})();