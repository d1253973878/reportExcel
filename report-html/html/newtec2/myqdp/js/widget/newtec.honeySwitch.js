;(function(){
	if(Newtec.HoneySwitch !=undefined){
		console.warn("newtec.honeySwitch.js已经被引入！");
		return ;
	}
	Newtec.HoneySwitch = function (params) {
		this.defaults = {
				ids:"",
				onOroff:"on",
				themeColor : "",
				clickon:null,
				clickoff:null,
		};
		this.defaults=$.extend(true,this.defaults,params);
	};
	Newtec.HoneySwitch.exte(Newtec.Base,'honeySwitch');
	Newtec.HoneySwitch.over({
		createNewtecJQ:function(params){
			var defaults = this.defaults;
			var onOroff = defaults.onOroff;
			var themeColor = defaults.themeColor||("rgb(100,189,99)");
			var ids = defaults.ids;
			var clickon = defaults.clickon;
			var clickoff = defaults.clickoff;
			var html = "<span id='"+ids+"' class='"+(onOroff=="on"?"switch-on":"switch-off")+"' themecolor='"+themeColor+"' " +
					" style='"+(onOroff=="on"?"border-color:"+themeColor+";box-shadow:"+themeColor+" 0px 0px 0px 16px inset;background-color:"+themeColor+"":"border-color:#dfdfdf;box-shadow:rgb(223, 223, 223) 0px 0px 0px 0px inset;background-color:rgb(255, 255, 255)")+"'><span class='slider'></span></span>";
			var newtecJQ = $(html);

			newtecJQ.find(".slider").click(function(){
				if($(this).parent().hasClass("switch-on")){
					$(this).parent().removeClass("switch-on").addClass("switch-off");
					$(".switch-off").css({
						'border-color' : '#dfdfdf',
						'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
						'background-color' : 'rgb(255, 255, 255)'
					});
					if(Newtec.Utils.isFunction(clickoff)){
						clickoff();
					}
				}else{
					$(this).parent().removeClass("switch-off").addClass("switch-on");
					var color = themeColor;
					$(".switch-on").css({
						'border-color' : color,
						'box-shadow' : color + ' 0px 0px 0px 16px inset',
						'background-color' : color
					});
					if(Newtec.Utils.isFunction(clickon)){
						clickon();
					}
					
				}
			});
			return newtecJQ;
		},
	});
	Newtec.Module("HoneySwitch")
})();