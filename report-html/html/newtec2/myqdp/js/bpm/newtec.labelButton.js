;(function(){
	Newtec.LabelButton = function(params){
		this.defaults = {
			title : '',
			clickFun : function(){},
			right : '',
			left : '',
			top : '',
			bgColor : '',
			titleColor : '',
			border:''
		};
		this.container;
		this.titleLabel;
		$.extend(true,this.defaults,params);
	};
	
	Newtec.LabelButton.prototype = new Newtec.Base("labelButton");
	
	Newtec.LabelButton.prototype.createNewtecJQ = function(params){
		var config = this.defaults;
		//主页面右侧按钮 right 10,top 10,background-color:#01aeef,color:#FFF;
		//var rightbtn = $('<div class="label_radius_17" style="right:10px;width:70px;height:34px;top:10px;background-color:#01aeef;cursor:pointer;" align="center" valign="center" ><label style="white-space:nowrap;font-size:14px;font-family:微软雅黑;color:#FFF;">审&nbsp批</label></div>');
		//高级查询按钮
		//var submitBtn = $('<div class="label_radius_17" style="left:10px;width:70px;height:34px;background-color:#01aeef;cursor:pointer;" align="center" valign="center" ><label style="font-weight:100;white-space:nowrap;font-size:14px;font-family:微软雅黑;color:#FFF;">确&nbsp定</label></div>');
		//var cancelBtn = $('<div class="label_radius_17" style="border:2px solid #01aeef;left:90px;width:70px;height:34px;cursor:pointer;" align="center" valign="center" ><label style="font-weight:100;white-space:nowrap;font-size:14px;font-family:微软雅黑;color:#01aeef;">取&nbsp消</label></div>');
		//var clearBtn = $('<div class="label_radius_17" style="border:2px solid #01aeef;left:170px;idth:70px;height:34px;cursor:pointer;" align="center" valign="center" ><label style="font-weight:100;white-space:nowrap;font-size:14px;font-family:微软雅黑;color:#01aeef;">清&nbsp空</label></div>');
		//基本按钮
		var right = config.right;
		var left = config.left;
		var top = config.top;
		var bgColor = config.bgColor;
		var titleColor = config.titleColor;
		var border = config.border;
		var clickFun = config.clickFun;
		var container = $('<div class="label_radius_17" style="width:70px;height:34px;cursor:pointer;" align="center" valign="center" ></div>');
		if(!Newtec.Utils.isNull(right)){
			container.css('right',right);
		}
		if(!Newtec.Utils.isNull(left)){
			container.css('left',left);
		}
		if(!Newtec.Utils.isNull(top)){
			container.css('top',top);
		}
		if(!Newtec.Utils.isNull(bgColor)){
			container.css('bgColor',bgColor);
		}
		if(!Newtec.Utils.isNull(border)){
			container.css('border',border);
		}
		container.click(clickFun);
		var titleLabel =$('<label style="white-space:nowrap;font-size:14px;font-family:微软雅黑;">'+config.title+'</label>');
		if(!Newtec.Utils.isNull(titleColor)){
			container.css('color',titleColor);
		}
		container.append(titleLabel);
		return container;
	};
	
	Newtec.LabelButton.create = function(params){
		return new Newtec.LabelButton(params).init();
	};
})();