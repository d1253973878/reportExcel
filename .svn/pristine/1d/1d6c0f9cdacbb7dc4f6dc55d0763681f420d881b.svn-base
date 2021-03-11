;(function(){
if(Newtec.DateTime != undefined){
		console.warn('newtec.datetime.js已经被引入!');
		return ;
	}
Newtec.Utils.addJS(["moment.min.js",{js:'daterangepicker.js',src:"thirdparty/daterangepicker/js/"}]);
Newtec.Utils.addCSS("daterangepicker.css",'thirdparty/daterangepicker/css/');
Newtec.DateTime = function (params) {
	//2.
	this.defaults = {
			className:'',
			inputStyle:'',
//			limitNow:false,
			canedit:false,
			change:null,
			hint:'',
			timeParams:{
				maxDate:moment(),	//最大时间
				showDropdowns : true,	//框内选择后跳转
				opens : 'right',	//框弹出的位置
				buttonClasses : [ 'btn btn-default' ],	//按钮样式
				applyClass : 'btn-small btn-primary blue',	//确认
				cancelClass : 'btn-small',	//取消
				linkedCalendars: false,
				singleDatePicker : true,	//是否显示单个
				autoUpdateInput:false,
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
	$.extend(true,this.defaults,params);
};
Newtec.DateTime.exte(Newtec.Base,'dateTime');
Newtec.DateTime.over({
	createNewtecJQ:function(params){
		var that = this;
		var dateThis = this;
		var defaults=this.defaults;
		var parentEl=this.id;
		defaults['timeParams']['parentEl']="#"+parentEl;
		var dateDiv=$('<div id="'+parentEl+'"></div>')
		$('body').prepend(dateDiv)
		var canedit = defaults.canedit==true?true:false;
		var pStyle="",inputStyle='',btnStyle="";
		if(Newtec.Utils.isJson(params.domStyle)){
			var domStyle=params.domStyle;
			pStyle=this.removeParentStyle(domStyle);
			btnStyle=this.styleJson2Str(domStyle.btnStyle);
			inputStyle=this.styleJson2Str(domStyle);
		}
		var newtecJQ=$('<div class="dateRange newtec-dateTime'
				+(defaults.className&&" "+defaults.className||"")
				+'" style="'+pStyle+'" ><input class="'+params.inputClass+'" id="searchDate" name="'+params.name+'" '+
				'style="background-color:#fff '+inputStyle+'" '+(canedit==false&&(readonly="readonly")||"")+
				'  '+(defaults.value&&" val='"+defaults.value+"'"||"")+' '+( params.hint&&'placeholder="'+params.hint+'"'||"")+'>'
				+'</input><i id="iBtn"class="glyphicon glyphicon-calendar fa fa-calendar" style="'+btnStyle+'"></i></div>');
		var input=newtecJQ.find('input');
		defaults['timeParams'].singleDatePicker = Newtec.Utils.isNull(params.singleDatePicker)?defaults['timeParams'].singleDatePicker:params.singleDatePicker
		input.daterangepicker(defaults['timeParams']);
		this.dateInput=input;
		var i = newtecJQ.find('i');
		$(i).click(function(){
			$(this).parent().children("input").focus();
		});
		var change=defaults.change;
		input.on('apply.daterangepicker',function(event,obj){
			
			input.trigger('keyup');
			input.trigger('input');
			var text=inputJQ.val();
			that.setDate(text);
//			that.getDate();
			var start = $.trim(text.split("~")[0]);
			var end = $.trim(text.split("~")[1]);
			Newtec.Utils.isFunction(change)&&change(text,start,end);
			return false;
		});	
		var parentElJQ=$("#"+parentEl),
		daterangepicker=parentElJQ.find(".daterangepicker");
		console.info("==>>")
		if(defaults.mouseShow){
			this.isIn1=false;
			this.isIn2=false;
			var time = null;
			var that = this;
			var minT=100;
			input.on('mousemove',function(){
				if(time){
					clearInterval(time);
				}
				that.isIn1=true;
				that.isIn2=false;
				time = setInterval(function(){
					input.focus();
					clearInterval(time);
				},minT);
			});
			
			daterangepicker.on('mousemove',function(){
				if(time){
					clearInterval(time);
				}
				that.isIn1=false;
				that.isIn2=true;
				time = setInterval(function(){
					input.focus();
					clearInterval(time);
				},minT);
			});
			daterangepicker.on('mouseout',function(){
				if(time){
					clearInterval(time);
				}
				if(!that.isIn1){
					time = setInterval(function(){
						that.isIn1=false;
						that.isIn2=false;
						parentElJQ.find(".daterangepicker").find(".cancelBtn").click();
						clearInterval(time);
					},minT);
				}
			});
			input.on('mouseout',function(){
				if(time){
					clearInterval(time);
				}
				if(!that.isIn2){
					time = setInterval(function(){
						that.isIn1=false;
						that.isIn2=false;
						parentElJQ.find(".daterangepicker").find(".cancelBtn").click();
						clearInterval(time);
					},minT);
				}
			});
		}
		var isMove = false;
		daterangepicker.on('mouseenter',function(){
			isMove=true;
		});
		daterangepicker.on('mouseleave',function(){
			isMove=false;
		});
//		$(document).bind('mousewheel',function(){
//			!isMove&&$(parentEl).find(".daterangepicker").find(".cancelBtn").click();
//		});
		daterangepicker.on("click",function(){
			return false;
		})
	
		return newtecJQ;
	},
	getDate:function(){
		var time = this.dateInput.val();
		var start = $.trim(time.split("~")[0]);
		var end = $.trim(time.split("~")[1]);
		console.info("--->>>getDate:"+time+"  开始时间:"+start+"  结束时间:"+end);
		return time;
		
	},
	setDate:function(date){
		var dateInput=this.dateInput;
		dateInput.val(date);
		dateInput.trigger('keyup');
		dateInput.trigger('input');
	},
});
Newtec.Module("DateTime")
})();