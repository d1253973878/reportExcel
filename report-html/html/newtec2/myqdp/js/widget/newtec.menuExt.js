/**
 * 菜单组件
 * TODO 适用只有两级的菜单，不适合多级菜单
 * @author 吴明坤
 */
(function(){
	Newtec.Utils.addCSS("widget/menu/newtec.menu-ext.css")
	Newtec.MenuExt = function (params) {
		//2.
		this.defaults = {
				click:null,//data,that,elJQ//点击事件
				showIcon:true, //是否显示图标
				frontImgUrl:null, //图片统一前缀路径
				id:'id',//id标记
				name:'name',//显示内容标记
				parentId:'parentId',//父亲标记
				icon:"icon"
	    };
		this.defaults=$.extend(true,this.defaults,params);
		this.showIcon=this.defaults.showIcon;
		this.menuDatas={};
	};
	Newtec.MenuExt.exte(Newtec.Base,'MenuExt');
	Newtec.MenuExt.over({
		createNewtecJQ:function(params){
			var defaults=this.defaults,
			newtecJQ=$('<div class="newtec-menuext"></div>');
	
			return newtecJQ;
		},
		/**
		 * 组件构建完成时调用
		 * @param {Object} params
		 */
		finsh:function(params){
			var newtecJQ=this.newtecJQ,
			that=this;
			newtecJQ.on('click',' ul.nav>li.nav-header',function(){
				that.onClick($(this),params,true);
			});
			newtecJQ.on('click',' ul.nav>li.rows',function(){
				that.onClick($(this),params,false);
			});
		},
		/**
		 * 选中事件
		 * @param {Object} id 数据标记
		 */
		setSelected:function(id){
			console.info("setSelected=",id);
			var jq=this.newtecJQ.find('#'+id);
			console.info(jq[0]);
			var data=this.menuDatas[id];
			var parentIdKey=this.defaults.parentId
			if(!jq[0]){
				if(data){
					this.setSelectedByJQ(this.newtecJQ.find('#'+data[parentIdKey]))
					jq=this.newtecJQ.find('#'+id);
				}else
					return;
			}else{
				if(this.menuDatas[data[parentIdKey]]){
					this.setSelectedByJQ(this.newtecJQ.find('#'+data[parentIdKey]))
				}
			}
			
			jq[0]&&this.setSelectedByJQ(jq);
		},
		/**
		 * 根据jq对象设置选中
		 * @param {Object} jq 选中jq对象
		 */
		setSelectedByJQ:function(jq){
			if(jq.hasClass("active"))return;
			var id=jq.attr("id"),
			newtecJQ=this.newtecJQ,
			divMenu=this.divMenu,
			defaults=this.defaults,
			secordDiv=this.secordDiv
			parentIdKey=defaults.parentId;
			
			if(jq.hasClass("item1")){//父节点
	    		var cArr=this.getChild(id,parentIdKey)
	    		this.firstDiv.find(".item1.active").removeClass("active")
	    		jq.addClass("active");
	    		if(!secordDiv){
	    			secordDiv=this.secordDiv=$('<div class="secord-div"></div>')
	    			newtecJQ.append(secordDiv)
	    		}
	    		
	    		if(divMenu[this.preId])divMenu[this.preId].css("display","none")
	    		if(divMenu[id]){
	    			divMenu[id].css("display","")
	    		}else{
	    			var jq=this.createSecordMenuJQ(cArr,secordDiv);
	    			secordDiv.append(jq);
	    			divMenu[id]=jq
	    		}
	    		this.preId=id;
			}else{
				secordDiv.find(".item2.active").removeClass("active")
				jq.addClass("active");
			}
			
    		var data=this.menuDatas[id]
    		Newtec.Utils.isFunction(defaults['click'])&&defaults['click'](data,this);
			return true;
		},
		/**
		 * 清除所有选中
		 */
		clearSelect:function(){
			var newtecJQ=this.newtecJQ;
			newtecJQ.find('.active').removeClass('active')
		},
		/**
		 * 设置数据
		 * @param {Object} datas [{id:'id',name:"name",parentId:'parentId',url:'img'}]
		 */
		setData:function(datas){
			if(!Newtec.Utils.isArray(datas)||datas.length==0){
				console.warn("datas数组为空！")
				return;
			}
			if(datas[0].sort!==undefined){//先进行简单的排序
	        	datas.sort(function(a,b){
	        		return a.sort-b.sort;
	        	})
	        }
			var len=datas.length,
			defaults=this.defaults,
			idKey=defaults.id,
			nameKey=defaults.name,
			parentIdKey=defaults.parentId;
			var menuDatas={};
			this.datas=datas;
			//保存id 与数据关系
			for(var i=0;i<len;i++){
				var data=datas[i];
				menuDatas[data[idKey]]=data;
			}
			var arr=[];
			for(var i=0;i<len;i++){//获取一级菜单
				var data=datas[i];
				if(!menuDatas[data[parentIdKey]])
					arr.push(data);
			}
			this.menuDatas=menuDatas;
			 var tempHtml=this.createFirstMenuJQ(arr);
			 this.newtecJQ.append(tempHtml);
		},
		getChild:function(parentId,parentKey){
			if(this.menuDatas[parentId].children)return this.menuDatas[parentId].children;
			var datas=this.datas,arr=[];
			console.info("=---=<<,",datas,parentId,parentKey)
			for(var i=0,len=datas.length;i<len;i++){
				var data=datas[i];
				if(data[parentKey]==parentId)arr.push(data);
			}
			return arr;
		},
	   createFirstMenuJQ : function (arr) {
	    	var div=$("<div class='first-div'></div>");
	    	var html="<ul class='nav nav-list'>";
	    	var defaults=this.defaults,
			id=defaults.id,
			name=defaults.name,
			icon=defaults.icon,
			that=this,
			frontImgUrl=defaults.frontImgUrl||"",
			parentId=defaults.parentId;
	    	for(var i=0;i<arr.length;i++){
	    		var data=arr[i],icon1=frontImgUrl+(data[icon]||"myqdp/images/system/menu/power/2.png");
	    		html+="<li class='item1' id='"+data[id]+"'><div><img src='"+(icon1)+"'/></div>"+data[name]+"<div class='triangle'></div></li>"
	    	}
	    	html=$(html+"</ul>")
	    	
	    	div.append(html);
	    	this.firstDiv=div;
	    	this.divMenu={},this.secordDiv=0, 
	    	newtecJQ=this.newtecJQ,
	    	preId=null;
	    	html.on("click",">li.item1",function(){
	    		that.setSelectedByJQ($(this));
	    	})
	        return div;
	    },
	    createSecordMenuJQ:function(arr,secordDiv){
	    	var html="<ul class='nav nav-list'>";
	    	var defaults=this.defaults,
			id=defaults.id,
			name=defaults.name,
			icon=defaults.icon,
			that=this,
			frontImgUrl=defaults.frontImgUrl||"",
			parentId=defaults.parentId;
	    	for(var i=0;i<arr.length;i++){
	    		var data=arr[i],icon=frontImgUrl+(data[icon]||"myqdp/images/system/menu/power/2.png");
	    		html+="<li class='item2' id='"+data[id]+"'>"+data[name]+"</li>"
	    	}
	    	html+="</ul>"
	    	html=$(html)
	    	html.on("click",">li.item2",function(){
	    		that.setSelectedByJQ($(this));
	    		return false;
	    	})
	    	return html;
	    },
	});
	Newtec.Module("MenuExt")
})();