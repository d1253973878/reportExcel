;(function(){
	if(Newtec.NewMenu != undefined){
		console.warn('newtec.newMenu.js已经被引入!');
		return;
	}
	Newtec.NewMenu = function(params){
		 this.defaults={
				click:null,
				showIcon:true,
				isMin:false,
		};
		 var defaults=$.extend(true,this.defaults,params);
		this.showIcon = defaults.showIcon;
		this.menuDatas={};
		this.isMin=defaults.isMin;
	};
	Newtec.Menu||Newtec.Utils.addJS("newtec.menu.js","myqdp/js/widget/");
	Newtec.Utils.addCSS("newtec.menu-skin2.css","myqdp/css/widget/");
	Newtec.NewMenu.exte(Newtec.Menu,'newMenu');
	Newtec.NewMenu.over({
		createNewtecJQ:function(params){
			var defaults = this.defaults,
			newtecJQ=$('<div class="newtec-newMenu'+(defaults.isMin&&" min"||"")+'"><ul class="menuul"></ul></div>');
			return newtecJQ;
		},
		finsh:function(params){
			var newtecJQ = this.newtecJQ,
			that=this;
			newtecJQ.on('click',' ul li ',function(){
				that.onClick($(this),params,true);
			});
		},
		isMinMenu:function(isMin){
			this.isMin=isMin=isMin===undefined?!this.isMin:isMin;
			isMin&&this.newtecJQ.addClass('min')||this.newtecJQ.removeClass('min');
		},
		setSelectedByJQ:function(jq,isHead){
			var newtecJQ=this.newtecJQ;
			isHead=isHead===undefined?jq.attr('class').indexOf('header')>=0:isHead;
			if(jq.attr("data")=="yhzxsy"){
				return;
			}else{
				if(isHead&&jq.hasClass('active')){
					jq.removeClass('active');
					if(isHead){
						jq.parent().removeClass('active');
					}
					return;
				}else{
					newtecJQ.find('.active').removeClass('active');
					jq.addClass('active');
				}
				this.srcchange(jq);
				if(isHead){
					newtecJQ.find('.active').removeClass('active');
					var index=Newtec.Utils.toInt(jq.attr('index-data'),0)+1;
					for(var i=0;i<index;i++){
						jq=i%2?jq.parent():jq;
						jq.addClass("active");
					} 
				}
			}
			
			
		},
		srcchange:function(jq){
			jq.parent().children('li').children(".icon").css("display","inline");
			jq.parent().children('li').children(".iconchoose").css("display","none");
			if(jq.hasClass('active')){
				jq.children(".icon").css("display","none");
				jq.children(".iconchoose").css("display","inline");
			}
		},
		//在生成菜单的js调用
		setData:function(datas){
			var array = this.transData(datas,"id","parentId","children");
			var tempHtml=this.recursion(array);
			this.newtecJQ.find('[class="menuul"]').append(tempHtml);
		},
		recursion:function(data,index){
			var len = data.length;
			if(len==0){
				return "";
			}
			index=index||0;
			var html="";
			for(var i=0;i<len;i++){
				var b = data[i],childs=b["children"];
				html+=this.createFirstCol(b,index,childs);
				this.menuDatas[b["id"]] = b;
				if(childs){
					index++;
					var cL=childs.length;
					html+='<ul>';
					for(var j=0;j<childs.length;j++){
						var c=childs[j];
						this.menuDatas[c["id"]] =c;
						console.info(c,c['children']);
						html+=c['children']&&(this.recursion([c],index))||this.createCol(c, index);
					}
					index--;
					html+='</ul>';
				}
				html+="</li>";
			}
			return html;
		},
		createFirstCol:function(data,index,childs){
			index=index||0;
			var html="";
			if(index==0){
				html='<li class="header" data="'+data["id"]+'" index-data="'+index+'">';
			}else{
				html='<li class="has-rows" data="'+data["id"]+'" index-data="'+index+'">';	
			}
			/*html+='<a href="#">';*/
			while(index--){
				html+="<span class='space'></span>";
			}
			if(this.showIcon){
				if(data['icon']){
					html+="<img class='icon' src='"+data['icon']+"'/><img class='iconchoose' src='"+data['iconchoose']+"'/><br/>";
				}else{
					var pData = this.menuDatas[data.parentId];
					if(pData&&pData['icon']){
						html+="<span class='icon'/></span><br/>";
					}
				}
			}
			html+="<span class='bigname'>"+data['name']+"</span>"/*+"</a>"*/;
			return html;
		},
		createCol:function(data,index,col){
			index=index||1;
			var html='<li class="rows" data="'+data["id"]+'" index-data="'+index+'">'  /* <a href="#">*/;
			while(index--){
				html+="<span class='space'></span>";
			}
			if(this.showIcon){
				if(data['icon']){
					html+="<img class='icon' src='"+data['icon']+"'/><br/>";
				}else{
					var pData=this.menuDatas[data.parentId];
					if(pData&&pData['icon']){
						html+="<span class='icon'/></span><br/>";
					}
				}
			}
			html+="<span class='bigname'>"+data['name']+"</span>";
			html+="</li>";
			return html;
		}
	});
	Newtec.Module("NewMenu")
})();