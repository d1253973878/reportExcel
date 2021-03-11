;(function(){
	
	if(Newtec.Button != undefined){
		return ;
	}
	
	//1.
	Newtec.Button = function (params) {
		if(!Newtec.Utils.isJson(params)){//不是json格式不能创建按钮
			return ;
		}
		//2.
		this.defaults = {
				id:'',
        		title:'',
        		name:'',
        		className:'btn-success',//btn-info;btn-warning;btn-danger
//        		style:'margin-right:5px;padding: 2px 12px;',
        		hint:"",
        		leftImg:false,
        		rightImg:false,
        		imgPath:null,
        		imgClass:'',
        		click:"",
        		
        };
	};
	Newtec.Button.exte(Newtec.Base,'button');
	Newtec.Button.prototype.createNewtecJQ=function(params){
		var hint=Newtec.Utils.isNull(params.hint)?"":"title='"+params.hint+"'";
		var defaults = this.defaults;
		var sign = "<i class = 'glyphicon glyphicon-search' style = 'font-size:12px;margin:0 5px;'/>"
		var button = "<button id = '" + this.id + "' type = 'button' " + hint + " class = 'btn newtec-btn " + defaults['className'] + "'>"
					+ (defaults.leftImg&&(defaults.imgPath&&"<img src = '" + defaults.imgPath + "' class = '" + defaults.imgClass + "'>"||sign)||"") 
					+ defaults['title']
					+ (defaults.rightImg&&(defaults.imgPath&&"<img src = '" + defaults.imgPath + "' class = '" + defaults.imgClass + "'>"||sign)||"")
					+ " </button>";
		button = $(button)
		this.button = button;
		var clickFun = this.defaults['click'];
		this.setClick(clickFun, false);
		this.button=button;
		return button;
	};
	Newtec.Button.prototype.setDisable=function(disable){
		this.button.attr('disabled',disable); 
	};
	Newtec.Button.prototype.setClickBeforeFun = function(clickBeforeFun){
		this.clickBeforeFun = clickBeforeFun;
	};
	Newtec.Button.prototype.setClick = function(clickFun,validate){
		var buttonThis = this;
		if(validate==false){//不需要验证；
			this.button.click(function(){
				if(buttonThis.clickBeforeFun != undefined)
					buttonThis.clickBeforeFun();
				if(Newtec.Utils.isFunction(clickFun))clickFun();
			});
		}else if(clickFun instanceof Function){//需要验证是函数；频繁注册会影响性能
			this.button.click(function(){
				if(buttonThis.clickBeforeFun != undefined)
					buttonThis.clickBeforeFun();
				if(Newtec.Utils.isFunction(clickFun))clickFun();
			});
		}
	};
	Newtec.Button.create = function(params){
		if(Newtec.Utils.isArray(params)){
			var btns = [];
			var len = params.length;
			for(var i=0;i<len;i++){
				btns.push(new Newtec.Button(params[i]).init(params));
			}
			return btns;
		}else{
			return new Newtec.Button(params).init(params);
		}
	};
	
	Newtec.Window = function(params){
		this.body;
		this.footer;
		this.defaults = {
        		title:'窗口标题',
        		backdrop: 'static',
        		keyboard: false,
        		headerClass:'',
        		footerClass:'',
        		width:'',
        		height:0,
        		header:'',
        		body:'',
        		footer:'',
        		canDrag:true,
        		remove:true,
        		canFullScreen:false,
        		closedFun:function(win){}
        };
    	this.callFinsh=false;
	};
	Newtec.Window.exte(Newtec.Base,'window');
	var window_ = window;
	Newtec.Utils.addCSS("jquery-ui.min.css");
	Newtec.Utils.addJS("jquery-ui.min.js");
	 Newtec.Window.prototype.copyParams=function(params){
		 return this.defaults=$.extend({},this.defaults,params);
	 }
	   Newtec.Window.prototype.createNewtecJQ=function(params){
		   var winHeight = $(window_).height();
		   var defaults= this.defaults;//newtec-window
		   var canDrag=defaults.canDrag;
			var window = "<div id='"+this.id+"' class='modal fade"+(canDrag&&" canDrag"||"")+"' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true' >"
			  +"</div>";
			var width = params['width'];
			if(width == undefined){
				width='';
			}else if(parseInt(width)==width){
				width = " width: "+width+"px; ";
			}else{
				width = " width: "+width+"; ";
			}
			 
			var height =params['height'];
//			alert('height=='+height);
			//有固定宽高的情况下才能据居中对齐//style='"+width+height+" position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: auto;'
			var winDialog =  "<div  class='modal-dialog"+(height&&" center-win"||"")+"' style=' "+(height&&"height:"+height+"px;"||"")+width+"'></div>";
			  var winContent= "<div class='modal-content'></div>";
			  
			  var winHeader ="<div class='modal-header "+(params['headerClass']||"")+"' ></div>";
			  var winHeadrCloseBtn = "<button type='button' class='close pull-right' data-dismiss='modal'><span aria-hidden='true' >x</span><span class='sr-only'>Close</span></button>";
			  var winHeaderTitle = "<h4 class='modal-title' id='myModalLabel'>"+this.defaults['title']+"</h4>";
			  
			  var winBody ="<div class='modal-body' id='"+this.id+"_body'>"
			  +"</div>";
			  var winFooter = "<div class='modal-footer "+(params['footerClass']||"")+"' style='"+params['footerStyle']+"'>"
			  +"</div>";
			  
			  this.window =window= $(window);
			  winDialog = $(winDialog);
			  winContent= $(winContent);
			  this.winHeader = winHeader=$(winHeader);
			  winHeadrCloseBtn = $(winHeadrCloseBtn);
			  this.winHeader.append(winHeadrCloseBtn);
			  winHeaderTitle = $(winHeaderTitle);
			  this.winBody = $(winBody);
			  this.winFooter = $(winFooter);
			  
			  this.window.append(winDialog);
			  winDialog.append(winContent);
			  if(defaults['canFullScreen']){
				  var winHeadrOpenBtn = $("<button type='button' class='close pull-right'><span><div class='open-div'><div class='open-icon'></div></div></button>");
				  this.winHeader.append(winHeadrOpenBtn);
				  var isOpenAll=false;
				  winHeadrOpenBtn.click(function(){
					  isOpenAll=!isOpenAll;
					  isOpenAll&&window.addClass('all')||window.removeClass('all');
					  winHeadrOpenBtn.blur();
				  });
			  }
			  
			  this.setHeader(this.defaults['header']);
			  this.winHeader.append(winHeaderTitle);
			  winContent.append(this.winHeader);
			  winContent.append(this.winBody);
			  winContent.append(this.winFooter);
			  $('body').append(this.window);//将这个模态窗口加入html〉body中
			  this.setBody(this.defaults['body']);
			  this.setFooter(this.defaults['footer']);
//			  alert('params=='+Newtec.Utils.json2str(params));
			  this.window.modal(params);
			  var t = this;
			  winHeadrCloseBtn.on('click',function(){
				  t.close();
			  });
			  //单窗口创建渲染后会回调shown.bs.modal，渲染前调用show.bs.modal
			
			  this.window.on('shown.bs.modal', function (e) {
				  if(t.nofirstOpen)return;
				  t.nofirstOpen=true;
				  t.callFinsh = true;
				 
				  
				  height=height||winDialog.outerHeight();
				  if(winHeight<height){
					  height= winHeight-40;
				  }
				  winDialog.css('height',height+'px');
				  winDialog.addClass('center-win');
				  var fisrt=true;
				  window.addClass('newtec-window')
//				  winDialog.css({top:offset.top,left:offset.left,bottom:'auto',right:'auto'})
				  var width= winDialog.outerWidth();
				  winDialog.animate({'opacity':1,top:0,bottom:0},300,canDrag&&function(){
					  var offset=winDialog.offset();
					  winDialog.css({top:offset.top-window.offset().top,left:offset.left,bottom:'auto',right:'auto'})
				  });
				  t.winBody.css({'top':t.winHeader.outerHeight()+'px',bottom:t.winFooter.outerHeight()+"px"});
				  if(!canDrag)return;
				
				  winDialog.draggable({
					  handle:'.modal-header,.modal-footer',
					  start:function(event, ui ){
						  fisrt=false;
						  $(document).trigger('click');
					  },
				  });
				  $(document).resize(function(){
					  if(fisrt){
						  winDialog.css({top:0,left:0,bottom:0,right:0});
						  var offset=winDialog.offset();
						  winDialog.css({top:offset.top-window.offset().top,left:offset.left,bottom:'auto',right:'auto'})
					  }
				  });
//				  $('body').css('padding-right','')
				  t.toFinsh(params);
				});
			  this.window.on('hidden.bs.modal', function (e) {
				  $('body').css('padding-right','')
				  if(t.defaults.remove){
					  t.window.remove();
				  }
				  var closedFun=params['closedFun'];
				  if (Newtec.Utils.isFunction(closedFun)) {
					  closedFun(t);
				}//				  $('.modal-backdrop').eq(0).remove();
			  });
			  /**
			   * 缩放按钮
			   */
			  return this.window;
		};
//	Newtec.Window.prototype.copyParams=function(params){
//		return this.defaults = $.extend({},this.defaults,params);
//	}
	Newtec.Window.prototype.show = function(){ 
		this.window.modal('show');
	} ;
	Newtec.Window.prototype.close = function(){
		this.window.modal('hide');
	};
	Newtec.Window.prototype.setHeader = function(header){
		if(Newtec.Utils.isNull(header))return ;
		Newtec.Utils.append(this.winHeader, header);
	};
	/**
	 * 设置窗口body,
	 * 注意：isRemoveOld=undefined或者true表示移除以前的
	 */
	Newtec.Window.prototype.setBody = function(body,isRemoveOld){
		if(isRemoveOld==undefined || isRemoveOld==true )
			this.winBody.empty();//清空孩子
		Newtec.Utils.append(this.winBody, body);
//		Newtec.Utils.append($("#"+this.id+"_body"), body);
		this.body = body;
	};
	Newtec.Window.prototype.setFooter = function(footer,isRemoveOld){
		if(isRemoveOld==undefined || isRemoveOld==true )
			this.winFooter.empty();//清空孩子
//		alert(footer+"-ff--"+this.winFooter);
		Newtec.Utils.append(this.winFooter, footer);
		this.footer = footer;
	};
	
	Newtec.Window.createConfirm = function(param){
		var executeFun = param['execute'];
		var btns = [];
		if(!Newtec.Utils.isNull(param['noTitle'])){
			console.info("--noTitle---");
			btns.push(Newtec.Button.create({title:param['noTitle'],className:param['noClass']==undefined?"":param['noClass'],click:function(){
				win.close();
				if(Newtec.Utils.isFunction(executeFun)){
					executeFun(false);
				}
			}}));
		}
		console.info("--okTitle---"+param['okTitle']);
		var okBtn=Newtec.Button.create({title:param['okTitle'],className:param['okClass']==undefined?"btn btn-success":param['okClass'],click:function(){
			win.close();
			if(Newtec.Utils.isFunction(executeFun)){
				executeFun(true);
			}
		}});
		if(!Newtec.Utils.isNull(param['okTitle'])){
			btns.push(okBtn);
		}
//		if(btns.length<=0){
//			return 
//		}
		var win = Newtec.Window.create({
			headerStyle:'padding: 5px 15px',
			footerStyle:'padding: 5px 15px',
			title:param['title'],
			body:"<div>"+param['html']+"</div>",width:400,canFullScreen:false,
			footer:btns,finsh:function(){
				btns.length==0||
				setTimeout(function(){
					btns[btns.length-1].newtecJQ.focus();
				},600);

			}});
		return win;
	};
	Newtec.Window.confirm=function(execute,html,title,okTitle,noTitle,okClass,noClass){
		if(!Newtec.Utils.isFunction(execute)){
			console.error("execute不是函数");
			return;
		}
		html=html||"是否进行该操作？？";
		title=title||"提示";
		okTitle=okTitle||"确定";
		return Newtec.Window.createConfirm({
			execute:execute,html:html,title:title,
			okTitle:okTitle,noTitle:noTitle,
			okClass:okClass,noClass:noClass
		});
	};
	Newtec.Window.createHint = function(params){
		var defaults = {title:'操作提示',noTitle:'确认',noClass:'',html:'<span>操作成功！<span>'};
		if(params != undefined){
			if(params['title'] != undefined){
				defaults['title'] = params['title'];
			}
			if(params['btnTitle'] != undefined){
				defaults['noTitle'] = params['btnTitle'];
			}
			if(params['className'] != undefined){
				defaults['noClass'] = params['className'];
			}
			if(params['html'] != undefined){
				defaults['html'] = params['html'];
			}
		}
		return Newtec.Window.createConfirm(defaults);
	};
	Newtec.Window.hint=function(html,title,btnTitle,btnClass){
		return Newtec.Window.createHint({
			html:html,title:title,btnTitle:btnTitle,className:btnClass
		});
	};
	Newtec.Window.createAdd = function(executeFun){
		Newtec.Window.createConfirm({title:'增加记录',noTitle:'取消',okTitle:'增加',html:'<span>确定增加？<span>'
			,okClass:'btn-warning'
			,execute:function(bool){
//				alert('addd.....'+bool);
				executeFun(bool);
			}});
	};
	Newtec.Window.createUpdate = function(executeFun){
		Newtec.Window.createConfirm({title:'更改记录',noTitle:'取消',okTitle:'更改',html:'<span>确定更改？<span>'
			,okClass:'btn-warning'
			,execute:function(bool){
				executeFun(bool);
			}});
	};
	Newtec.Window.createDelete = function(executeFun){
		Newtec.Window.createConfirm({title:'删除记录',noTitle:'取消',okTitle:'删除',html:'<span>确定删除？<span>'
			,okClass:'btn-warning'
			,execute:function(bool){
				executeFun(bool);
			}});
	};
	//-------选项卡-------
	Newtec.MyTab=function(params){
		var tabs=params['tabs'];
		this.defaults = {
				id:'',
//				tabTitles:['按钮','列表字段','表单字段','搜索字段','行集过滤方案'],
				tabs:[],//数据类型：[{title:'按钮',name:'btn',JQ:{jq对象}}]
//				tabsJQ:[],
				displayName:'name',
				displayTitle:'title',
				displayJQ:'JQ',
				maxHeight:500,
				minHeight:100,
				height:0,
				data:'',
				showBtn:true,
				isSingle:false,
				isSingleJQ:{},
				btnParams:[],
//				borderStyle:'#ddd',
				btnMode:'1',
				bodyClass:'',
				aClass:'',
				tableft:false,
				background:"#fff",
				tabChangBeforFun:function(tabThis,pretabJQ,preName,nextName){return null;},//返回true可以阻止此次操作
				/**
				 * myTabThis:mytab对象本身;
				 * currTab:当前选中的选择卡currNewtec对象;
				 * name:当前选项卡Name
				 * crrId:当前选项卡的id
				 * preId:上一个选项卡id
				 */
				tabChangFun:function(myTabThis,currNewtec,name,currId,preId){}
//				,autoFetch:false
				
        };
    	this.tabsDiv={};
    	this.defaults['tabs']=tabs;//防止克隆
	};
	Newtec.MyTab.exte(Newtec.Base,'myTab');
	
	Newtec.MyTab.over({
		createNewtecJQ:function(params){
			var tabs=params['tabs'];
			var mainDiv=$('<div class="newtec-myTab"></div>');
			var tabsHtml='<ul class="nav nav-tabs">';
			var first='';
			var tabsCacle={};
			var f=this.defaults;
			var displayName=f.displayName;
			var displayTitle=f.displayTitle;
			var displayJQ=f.displayJQ;
			var tabsDiv={};
			var tableft=params['tableft'];
			var maxHeight=params['maxHeight'];
			var minHeight=params['minHeight'];
			var height=params['height'];
			height=height==0?'max-height:'+maxHeight+'px;':'height:'+height+'px;';
			var body=$('<div class="myTab-body '+(params.bodyClass||"")+'" style=" '+(tableft?"border:1px solid #cccccc; padding:20px;background:#e8ebf3":"background:#"+params.background)+ ';min-height:'+minHeight+'px;'+height+'"></div>');
			var isSingle=f.isSingle;
			this.tabsCount=0;
			this.btns={};
//			var btn='<div class="glyphicon glyphicon-remove btn btn-default" style="padding: 2px 0;border:0;border-radius: 50px;height:26px;width:26px;position:absolute;'
//				+'right:-3px;top:9px; z-index: 1000;background-color: transparent;-moz-opacity:0.6; -khtml-opacity: 0.6;opacity: 0.6;"><div>';
			if (Newtec.Utils.isArray(tabs)) {
				var len =tabs.length;
				first=len>0?tabs[0][displayName]:"";
				for ( var i = 0; i < len; i++) {
					var tab=tabs[i];
					var name=tab[displayName];
					var id=this.getTabTitleId(name);
					tabsHtml+='<li role="presentation"  id="'+id+'" class="'+(tableft?"tablefttitle":"tabtitle")+'" ><a class="'+(params['aClass']||"")+'">'+tab[displayTitle]+'</a></li>';
					if(!isSingle){
						var JQ=tab[displayJQ];
						if (!Newtec.Utils.isNull(tabsCacle[name])) {
							alert('选项卡命名相同');
							return;
						}
						tabsCacle[name]=JQ;
						var tabDiv=this.getTabDiv(id);
						tabsDiv[id]=tabDiv;
						console.info(i+"==>>",tabsDiv,id);
						body.append(tabDiv);
						Newtec.Utils.appendTo(JQ,tabDiv);
					}
				
				}
			}else if(Newtec.Utils.isJson(tabs)){
				var name=first=tabs[displayName];
				var id=this.getTabTitleId(name);
				tabsHtml+='<li role="presentation" id="'+id+'" ><a class="'+(params['aClass']||"")+'" style="'+params['aStyle']+'">'+tabs[displayTitle]+'</a></li>';
				if(!isSingle){
					var JQ=tabs[displayJQ];
					tabsCacle[name]=JQ;
					var tabDiv=this.getTabDiv(id);
					tabsDiv[id]=tabDiv;
					body.append(tabDiv);
					Newtec.Utils.appendTo(JQ,tabDiv);
				}
			}
			if(isSingle){
				Newtec.Utils.appendTo(f.isSingleJQ,body);
			}
			var head=$('<div class="myTab-head  '+(tableft?"tablefthead":"")+' ">'+tabsHtml+'<div>');
			this.tabsDiv=tabsDiv;
			this.tabs=tabsCacle;
			this.first=first;
			this.isExit={};
			tabs+='</ul>';
			if(f.showBtn){
				var btnDiv="";
				if(f.btnMode=="1"){
					btnDiv=$("<div class='newtec-myTab-div1'></div>");
					head.append(btnDiv);
				}else if(f.btnMode=="2"){
					btnDiv=$('<div class="newtec-myTab-div2"></div>');
					var showAllbtn=false;
//					var tabThis=this;
					var allbtn=$("<div class='myTab-allbtn'><button class='btn btn-success'>全部按钮</button></div>");
					allbtn.on('click',function(){
						if(!showAllbtn)
							btnDiv.css('display','block');
						else
							btnDiv.css('display','none');
						showAllbtn=!showAllbtn;
					});
					head.append(allbtn);
					body.append(btnDiv);
				}
//				var btnDiv=$('<div style="border-radius: 0 0 5px 5px;position:absolute;overflow:hidden;padding:4px;min-height:100px;background:red;top:-80px;;right:0;display:none'
//						+'-moz-opacity:0.5; -khtml-opacity: 0.5;opacity: 0.5;z-index:1000"></div>');
//				body.append(btnDiv);
				this.btnDiv=btnDiv;
			}
			mainDiv.append(head);
			mainDiv.append(body);
			this.body=body;
			this.head=head;
			var tabThis=this;
			head.on('click','.nav-tabs li',function(){
				tabThis.tapClickFun(this,tableft);
			});
			return mainDiv;
		},
		hiden:function(){
			
		},
		show:function(){},
		addbtn:function(btnParams){
			if(!this.defaults.showBtn)return;
			var myTabThis=this;
			if(btnParams instanceof Array){
				var len = btnParams.length;
				for(var i=0;i<len;i++){
					var btnParam = btnParams[i];
					this.addbtn(btnParam);
				}
			}else {//单个情况
				var btnName=btnParams.name;
				var click=btnParams.click;
				btnParams.click=function(){//重写按钮点击事件
					if(Newtec.Utils.isFunction(click)){
						var name=myTabThis.getTabName(myTabThis.currId);
						var tabJQ=myTabThis.getTabByName(name);
						click(myTabThis,tabJQ,name);
					}
				};
				if(this.defaults.btnMode=="2"){
					btnParams.className="myTab-btn";
				}
				if(!Newtec.Utils.isNewtec(btnParams) && Newtec.Utils.isJson(btnParams)){//json情况先创建出button
					btnParams = Newtec.Button.create(btnParams);
				}
				this.btns[btnName]=btnParams;
				Newtec.Utils.appendTo(btnParams,this.btnDiv);
			}
		},
		getTabDiv:function(id,style){
			style=Newtec.Utils.isNull(style)?"":style;
			return $('<div id="'+this.getTabIdByTitleId(id)+'" class="body-item" style="'+style+'"></div>');
		},
		selectTab:function(name,tableft){
			this.selectTabById(this.getTabTitleId(name),null,tableft);
		},
		addTabs:function(tabs){
			var df=this.defaults;
			var isSingle=df.isSingle;
			if (Newtec.Utils.isArray(tabs)) {
				for ( var i = 0; i < tabs.length; i++) {
					this.addTabs(tabs[i]);
				}
			}else{
				var displayName=df.displayName;
				var displayTitle=df.displayTitle;
				var displayJQ=df.displayJQ;
				var name=tabs[displayName];
				var id=this.getTabTitleId(name);
				if(!isSingle){
					var mytabs=this.tabs;
					var JQ=tabs[displayJQ];
					if (!Newtec.Utils.isNull(mytabs[name])) {
						alert('选项卡命名相同');
						return;
					}
					mytabs[name]=JQ;
					var tabDiv=this.getTabDiv(id);
					this.tabsDiv[id]=tabDiv;
					this.body.append(tabDiv);
					Newtec.Utils.appendTo(JQ,tabDiv);
				}
				var li=$('<li role="presentation" id="'+id+'" ><a>'+tabs[displayTitle]+'</a></li>');
				this.head.find('ul.nav-tabs').append(li);
			}
		},
		selectTabById:function(id,currJQ,tableft){
			var preId =this.currId;
			var currId=id;
			var defaults=this.defaults;
			var head=this.head;
			if (preId==currId) return;
			var tabChangBeforFun=defaults.tabChangBeforFun;
			var name=this.getTabName(currId);
			if (Newtec.Utils.isFunction(tabChangBeforFun)) {
				var pretabJQ='';
				var preName='';
				if (!Newtec.Utils.isNull(preId)) {
					 preName=this.getTabName(preId);
					 pretabJQ=this.getTabByName(preName);
				}
				var befor=tabChangBeforFun(this,pretabJQ,preName,name);
				if(befor)return;
			}
			var tabsDiv=this.tabsDiv;
			if (!Newtec.Utils.isNull(preId)) {
				var preJQ=head.find('#'+preId);
				preJQ.removeClass('active');
				if(!defaults.isSingle)
					tabsDiv[preId].css('display','none');
			}
			
			var tabJQ=this.getTabByName(name);
			if(!defaults.isSingle){
				console.info(tabsDiv,currId)
				var currTabDiv=tabsDiv[currId];
				currTabDiv.css('display','block');
			}
			currJQ=Newtec.Utils.isNull(currJQ)?head.find('#'+currId):currJQ;
			tableft?currJQ.find("a").addClass("blackfont")&&currJQ.addClass("choosestab").removeClass("defaultstab"):currJQ.addClass('active');
			this.currId=currId;
			var tabChangFun=defaults.tabChangFun;
			if (Newtec.Utils.isFunction(tabChangFun)) {
				tableft?(currJQ.prevAll().find("a").removeClass("blackfont")&&currJQ.prevAll().removeClass("choosestab").addClass("defaultstab")):"";
				tableft?(currJQ.nextAll().find("a").removeClass("blackfont")&&currJQ.nextAll().removeClass("choosestab").addClass("defaultstab")):"";
				tabChangFun(this,tabJQ,name,currId,preId,tabsDiv[currId]);
			}
		},
		getSelectTap:function(){
			var currId=this.currId;
			var name=this.getTabName(currId);
			var tabJQ=this.getTabByName(name);
			return tabJQ;
		},
		tapClickFun:function(elem,tableft){
			var currJQ=$(elem);
			var currId=$(elem).attr('id');
			this.selectTabById(currId,currJQ,tableft);
		},
		getCurrTabTileId:function(){
//			var li=this.head.find('.nav-tabs li.active');
//			if (li[0]!=undefined) {
//				return li.attr('id');
//			}
			return this.currId;
		},
		getTabTitleId:function(name){
			return this.id+"_"+name;
		},
		getTabName:function(id){//选项卡标题id获取选项卡name,不传默认获取当前选项卡名字
			id=Newtec.Utils.isNull(id)?this.currId:id;
			var str=id.split('_');
			var len=str.length;
			if (len<=1) {
			     alert('选项卡标题id命名出错');return;	
			}
			return str[str.length-1];
		},
		getTabByName:function(name){
			var df=this.defaults;
			var tab=df.isSingle?df.isSingleJQ:this.tabs[name];
			return tab;
		},
//		getTabName:function(id){//选项卡标题id获取选项卡name
//			var str=id.split('_');
//			var len=str.length;
//			if (len<=0) {
//			     alert('选项卡标题id命名出错');return;	
//			}
//			return str[str.length-1];
//		},
		getTabId:function(name){
			return this.getTabTitleId(name)+"_tab";
		},
		getTabIdByTitleId:function(id){
			return id+"_tab";
		},
		finsh:function(params){
			var tabThis=this;
			tabThis.selectTab(tabThis.first,params['tableft']);
			var btnParams=params.btnParams;
			if(!Newtec.Utils.isNull(btnParams)){
				this.addbtn(btnParams);
			}
		}
	});
	Newtec.DropDownPane = function (params) {
		//2.
		this.defaults = {
				domStyle:{
					maxHeight:400,
					minHeight:100,
				},
				body:null,
				footer:null
        };
	};
	Newtec.DropDownPane.exte(Newtec.Base,'dropDownPane');
	Newtec.DropDownPane.over({
		createNewtecJQ:function(params){
			var newtecJQ=$("<span>下拉菜单</span>");
			var that=this;
			newtecJQ.click(function(){
				console.info("that.isOpen="+that.isOpen)
				that.isOpen?that.hide():that.show();
			});
			return newtecJQ;
		},
		createDropLayout:function(params){
			var style=this.styleJson2Str(params.domStyle);
			var dropLayt=$("<div class='newtec-drop-layout shadow' style='"+style+";border:1px solid red;'>");
			$('body').append(dropLayt);
			this.dropLayt=dropLayt;
		},
		show:function(){
			this.isOpen=true;
			var newtecJQ=this.newtecJQ;
			var top=newtecJQ.offset().top;
			this.dropLayt.css({top:top+newtecJQ.height(),display:'block'});
		},
		setBody:function(body){
			var dropLayt=this.dropLayt;
			dropLayt.empty();
			dropLayt.append(body);
		},
		hide:function(){
			this.isOpen=false;
			this.dropLayt.css('display','')
		},
		remove:function(){
			this.dropLayt.remove();
		},
		finsh:function(params){
			this.createDropLayout(params);
		}
	})
	//1.
	Newtec.LabelPane = function (params) {
		if(!Newtec.Utils.isJson(params)){//不是json格式不能创建按钮
			return ;
		}
		//2.
		this.defaults = {
				id:'',
				title:'',
				titleHeight:20,
				maxHeight:200,
				padding:'2px 3px',
				space:4,
				colNum:3,
				data:'',
				widgetMainStyle:'padding:5px 12px;',
				click:''
				,autoFetch:false
				,ds : ''
        };
    	$.extend(this.defaults,params);
    	this.data;
    	this.ds  = this.defaults.ds;
    	this.mapData={};//存放着数据下拉列表的所有数据，
    	this.labes=[];
    	this.clickData={};//index:  data:
	};
	//3.
//	Newtec.LabelPane.prototype = new Newtec.Base('labelPane');
	Newtec.LabelPane.exte(Newtec.Base,'labelPane');
	//4.
	Newtec.LabelPane.over({
		createNewtecJQ:function(params){
			var pane = "<div class='widget-box' >"
				+"<div class='widget-header widget-header-flat' id='"+this.id+"_headerId' style='height:"+params['titleHeight']+"px'>"
				+"<h4 class='widget-title' id='"+this.id+"_titleId' >"+params['title']+"</h4>" 
				+"</div>"
				+"<div class='widget-body' style='max-height:"+this.defaults.maxHeight+"px;overflow:auto'>"
				+"<div class='widget-main' id='"+this.id+"' style='"+params['widgetMainStyle']+"' >"
				+"<div class='row' >"
			+"</div>"
			+"</div>"
			+"</div>"
			+"</div>";
			return $(pane);
		},
		finsh:function(params){
			if(!Newtec.Utils.isNull(this.ds)){
				if(params.autoFetch==true){//自动查询数据
					this.fetchData();
				}
			}else if(!Newtec.Utils.isNull(params['data'])){//本地设置--
				this.setData(params['data']);
			}
			
		}
	});

	Newtec.LabelPane.prototype.getHeaderJQ=function(){
		return $("#"+this.id+"_headerId");
	};
	
	
	Newtec.LabelPane.prototype.fetchData = function(){
		if(Newtec.Utils.isNull(this.ds)) return ;
		var ds = this.ds;
		var select = ds['select'];
		if(!Newtec.Utils.isArray(select))select = [];
		var displayName = this.ds['displayName'];
		if(Newtec.Utils.isNull(displayName)){
			alert('属性displayName必须配置！');
			return ;
		}
		select.addUnique(displayName);
		var t = this;
		var datas = [];
		new Newtec.DS(this.ds.name).fetchData({
			select:select
		,sortBy:ds['sortBy']
		,startRow:ds['startRow']
		,data:ds['data']
		,callback:function(response){
			var result = response['data'];
//			alert('result=='+Newtec.Utils.json2str(result));
			var len = result.length;
			t.mapData = {};
			for(var i=0;i<len;i++){
				var v = result[i];
				var vDsiplay = v[displayName];
				datas.push(vDsiplay);
				t.mapData[i] = v;
			}
			t.setData(datas);
			ds['callback'](response);
		}});
	};
	Newtec.LabelPane.prototype.setData = function(data,append){
		if(!Newtec.Utils.isArray(data)){
			if(Newtec.Utils.isString(data)) data = [data];
		}
		var pane = $("#"+this.id);
		var total = data.length;
		if(!Newtec.Utils.isTrue(append)){//不是追加
			this.labes = [];
			pane.html('');
		}else{
			total = total = this.labels.length;
		}
		$('#'+this.id+"_titleId").html(this.defaults.title+"("+total+")");
		this.data = data;
		var len = data.length;
		var colNum = this.defaults['colNum'];
		var col = 12 / colNum;
		for(var i=0;i<len;i++){
			var row=0 ;
			if(i % colNum==0){
				row = $("<div class='row'></div>").appendTo(pane);
			}
			var div = $("<div class='col-sm-"+col+"' style='margin-bottom:5px; text-align:center;padding:1px 1px;'></div>").appendTo(row);
			this.labes.push($("<button  type='button' class='btn btn-white btn-yellow btn-sm' style='padding: "+this.defaults['padding']+"'>"+data[i]+"</button>").appendTo(div));
		}
		
		(function(t){
			var len = t.labes.length;
			var clickFun = t.defaults['click'];
			var isclickFun = Newtec.Utils.isFunction(clickFun);
			var oldLabel=null;
			for(var i =0;i<len;i++){
				(function(i){
					var label = t.labes[i];
					label.click(function(){
						if(oldLabel==label) {//选中原来的忽略
							return ;
						}
						t.clickData.index=i;
						t.clickData.data=t.data[i];
						label.css('border-color','red');
						if(oldLabel != undefined ){
							oldLabel.css('border-color','#ecd181');
						}
						oldLabel = label;
						if(isclickFun){
							clickFun(t.data[i],i);
						}
					});
				})(i);
			}
		})(this);
		
	};
	Newtec.LabelPane.create = function(params){
		return new Newtec.LabelPane(params).init();
	};
	//a标签集组控件
	Newtec.ListAs = function (params) {
		if(!Newtec.Utils.isJson(params)){//不是json格式不能创建按钮
			return ;
		}
		//2.
		this.defaults = {
				title:'按钮组',
//				data:['按钮1','按钮1','按钮1','按钮1'],
				itemWidth:80,
				click:'',
				moreClick:'',
				moreUrl:'',
				isUrl:true,
				maxNum:0,
				fontSize:13,
				itemStyle:'',
				style:'',
				active:'active',
				titleStyle:'',
				data:[{title:'显示名称1',url:'a点击路径',name:'a标签'},{title:'显示名称2',url:'a点击路径',name:'a标签'}],//数据格式
        };
    	this.hasMore=false;
	};
	Newtec.ListAs.exte(Newtec.Base,'listAs');
	Newtec.ListAs.over({
		createNewtecJQ:function(params){
			var titleStyle='float: left;color:black;border-bottom: 2px solid red;margin-left: 7px;font-size: 16px;padding-right: 7px;'+params['titleStyle'];
			var listItem=$("<div class='newtec_list_a' style='border: 1px solid #ddd;border-top: 0;"+params['style']+"'></div>");
			
			var head=$("<div><span style='"+titleStyle+"'>"+params.title+"</span></div>");
			listItem.append(head).append("<div class='clear'></div>");
			
			var listCateStyle='margin-top: 5px;';
			var listCate=$("<div style='"+listCateStyle+"'></div>");
			listItem.append(listCate);
			
			var click=params['click'];
			var active=params['active'];
			var This=this;
			listCate.on('click','a',function(){
				listCate.find('a.'+active).removeClass(active);
				var a=$(this);a.addClass(active);
				if(Newtec.Utils.isFunction(click)){
					var value=a.attr('title');
					value=Newtec.Utils.isNull(value)?a.text():value;
					click(value,a.attr('name'),this,params.title,This);
				}
			});
			var moreClick=params['moreClick'];
				head.on('click','.more',function(){
					if(Newtec.Utils.isFunction(moreClick))
						moreClick(this);
				});
			this.listCate=listCate;
			this.head=head;
			return listItem;
		},
		clearSelect:function(){
			var active=this.defaults['active'];
			this.newtecJQ.find('a.'+active).removeClass(active);
		},
		select:function(name){
			var active=this.defaults['active'];
			this.newtecJQ.find('a.'+active).removeClass(active);
			this.newtecJQ.find('a[name="'+name+'"]').addClass(active);
		},
		finsh:function(params){
			this.setDate(params.data);
			
		},
		setDate:function(data,isApenden){
			if(data==undefined)return;
			var listCate=this.listCate;
			if(!isApenden){
				listCate.empty();
				this.data=data;
				this.hasMore=false;
			}else{
				this.data=this.data.concat(data);
			}
			var head=this.head;
			var params=this.defaults;
			var itemWidth=params.itemWidth;
			var fontSize=params['fontSize'];
			var itemStyle="text-decoration: none;margin:0 6px;display:inline-block;text-align:center;overflow:hidden;background-color: #ECEBEB;padding: 2px 0;"
				+"width:"+itemWidth+"px;"+params.itemStyle+"font-size: "+fontSize+"px !important;";
			if(Newtec.Utils.isArray(data)){
				var len=0;
				
				if(this.hasMore){
					len=data.length;
				}else{
					var max=params['maxNum'];
					len=this.data.length;
					if(max!=0&&len>max){
						var moreStyle='float: right;color:red;font-size: 13px;margin-top: 5px;margin-right: 15px;cursor: pointer;';
						var url=!Newtec.Utils.isNull(params['moreUrl'])?"href='"+params['moreUrl']+"'":"";
						head.append("<a class='more' "+url+" style='"+moreStyle+"'>更多>></a>");
						len=data.length-(len-max);
					}
				}
				var html="";
				for ( var i = 0; i < len; i++) {
					var d=data[i];
					var title="";
					if(Newtec.Utils.isString(d)){
						var value=d;
						if(value.length*fontSize>(itemWidth+6)){
							title=" title='"+value+"' ";
							value=value.substring(0,parseInt(itemWidth/fontSize)-1)+"..";
						}
						html+="<a "+title+" style='"+itemStyle+"' name='"+value+"' >"+value+"</a>";
					}else{
						var value=d['title'];
						if(value.length*fontSize>(itemWidth+6)){
							title=" title='"+value+"' ";
							value=value.substring(0,parseInt(itemWidth/fontSize)-1)+"..";
						}
						var url=!Newtec.Utils.isNull(d['url'])?"href='"+d['url']+"'":"";
						var name=!Newtec.Utils.isNull(d['name'])?"name='"+d['name']+"'":"name='"+value+"'";
						html+="<a "+url+" "+name+title+" style='"+itemStyle+"'>"+value+"</a>";
					}
				}
				listCate.append(html);
			}
		}
		});
	Newtec.GroupListAs = function (params) {
		//2.
		this.defaults = {
				title:'',
				iconSrc:'',
				itemWidth:80,
				click:'',
				groupParams:'',//格式[]
				maxNum:0,
				moreClick:'',
				fontSize:13,
				style:'',
				headStyle:'',
				active:'active',
				data:'',//数据格式[{title:'显示名称',url:'a点击路径',name:'a标签'},]
				showAear:false,
				downImgSrc:"layoutit/images/down.png",
        };
	};
	Newtec.GroupListAs.exte(Newtec.Base,'groupListAs');
	Newtec.GroupListAs.over({
		createNewtecJQ:function(params){
			var headStyle='color:#fff;background:#f00 ;line-height:40px;font-size:22px;padding-left:50px;'+params['headStyle'];
			
			var newtecJQ=$("<div class='newtec_group_list_a' style='"+params['style']+";position:relative' >" +
					"<img alt='' src='"+params.iconSrc+"' style='width:33px;height:33px;margin:3px 0 0 3px;float:left;'>"+
					"<div style='"+headStyle+"'>"+params['title']+"</div></div>");
			var groupParams=params['groupParams'];
			var itemDiv=newtecJQ;
			if(params.showAear){
				itemDiv=$('<div style="display:none;position:absolute;background:#fff;z-index:1000"></div>');
				var down=true;
				var icn=$("<img alt='' src='"+params.downImgSrc+ "' style='position:absolute; top:8px; right:11px;width:30px;height:30px;'/>");
				newtecJQ.append(icn);
				icn.on('click',function(){
					if(down){
						down=false;
						icn.removeClass('rotate0').addClass('rotate180');
						itemDiv.css('display','block');
					}else{
						down=true;
						icn.removeClass('rotate180'	).addClass('rotate0');
						itemDiv.css('display','none');
					}
				});
			}
			newtecJQ.append(itemDiv);
			var listAs={};
			if(groupParams!=undefined){
				var groupclick=params['click'];
				if(Newtec.Utils.isArray(groupParams)){
					for ( var i = 0; i < groupParams.length; i++) {
						var p=$.extend(true, {},groupParams[i]);
						var key=p.name?p.name:p.title;
						var oldClick=p['click'];
						if(Newtec.Utils.isFunction(params['moreClick'])){
							p['moreClick']=params['moreClick'];
						}
						
						var click=function(value,name,elem,title,listaJQ){
							//清除其他的选中状态
							var val=listaJQ.defaults['name']?listaJQ.defaults['name']:listaJQ.defaults['title'];
							for ( var key in listAs) {
								if(key==val)continue;
								listAs[key].clearSelect();
								
							}
							if(!Newtec.Utils.isFunction(oldClick)&&Newtec.Utils.isFunction(groupclick))
									groupclick(value,name,elem,title,listaJQ);
							else{
								if(Newtec.Utils.isFunction(oldClick))
									oldClick(value,name,elem,title,listaJQ);
							}
						};
						p['click']=click;
						var group=Newtec.ListAs.create(p);
						group.index=i;
						itemDiv.append(group.newtecJQ);
						
						listAs[key]=group;
					}
				}else if(Newtec.Utils.isJson(groupParams)){
					if(Newtec.Utils.isNull(groupParams['click']))groupParams['click']=groupclick;
					var group=Newtec.ListAs.create(groupParams);
					var key=groupParams.name?groupParams.name:groupParams.title;
					listAs[key]=group;
					itemDiv.append(group.newtecJQ);
					listAs.push(group);
				}
			}
			this.listAs=listAs;
			return newtecJQ;
		},
		select:function(name,title){
			console.info(name);
			var listAs=this.listAs;
			for ( var key in listAs) {
				if(key==title){
					listAs[key].select(name);
				}else{
					listAs[key].clearSelect();
				}
			}
//			var active=this.defaults['active'];
//			this.newtecJQ.find('a.'+active).removeClass(active);
//			this.newtecJQ.find('a[name="'+name+'"]').addClass(active);
		},
		setData:function(date,title){
			var listAs=this.listAs;
			if(title!=undefined){
				if(Newtec.Utils.isArray(title)){
					for ( var i = 0; i < title.length; i++) {
						var as=listAs[title[i]];
						if(as!=undefined)as.setDate(date);
					}
				}
				else{
					var as=listAs[title];
					if(as!=undefined)as.setDate(date);
				}
			}else{
				for(var key in listAs){
					listAs[key].setDate(date[key]);
				}
			}
		}
		});
	Newtec.Nav = function (params) {
		//2.
		this.defaults = {
//				title:'',
//				iconUrl:'',
//				fontSize:'',
				data:'',//格式[{name:"biaoti",value:value}]或者[value1,value2,.....]
				click:'',
				mode:'',//nav(默认),nav1（大标题）、nav2(中型标题)、nav3（小标题）
				itemClass:'',
				'class':'',
				minClass:'',
				minContent:'|',//标题间的标识符
				numClass:'',//格式{'num0':'class1','num2':'class2'}表示第一个标题和第三个标题具有单独属性
				showSelect:false,
				selectName:''//指定选中对象
        };
	};
	Newtec.Nav.exte(Newtec.Base,'nav');
	Newtec.Nav.over({
		createNewtecJQ:function(params){
			var data=params['data'];
			if(Newtec.Utils.isNull(data)||!Newtec.Utils.isArray(data)){
				console.error("data不能为空！！");
				return ;
			}
			
				
			var mode=params['mode'];
			var minClass=params['minClass'];
			var newtecJQ=$("<ul class='newtec-nav "+mode+((params['class']&&" "+params['class'])||"")+"'></ul>");
			var html='';
			var minContent=params['minContent'];
			var numClass=params['numClass'];
			var itemClass=params['itemClass']||"";
			var showSelect=params['showSelect']===false?false:true;
			var active='';
			var selectName=params['selectName']
			for ( var i = 0; i < data.length; i++) {
				var d=data[i];
				active=(showSelect&&(!selectName&&i==0))||selectName&&d.name==selectName?'active':'';
				var iClass=(numClass['num'+i]||"")+" "+itemClass;
				if(Newtec.Utils.isString(d)){
					html+=html==""?'<li class="nav-title '+active+' '+iClass+'">'+d+'</li>':
						'<li class="nav-min '+minClass+'" ><b>'+minContent+'</b></li><li class="nav-title  '+active+' '+iClass+'" >'+d+'</li>';	
				}else if(Newtec.Utils.isJson(d)){
					var mClass=minClass+((d['minStyle']&&" "+d['minStyle'])||"");
					minContent=d['minContent']==undefined?minContent:d['minContent'];
					iClass+=(d['itemClass']&&" "+d['itemClass'])||"";
					html+=html==""?'<li class="nav-title  '+active+' '+iClass+'"  name="'+d['name']+'">'+d['value']+'</li>':
						'<li class="nav-min '+mClass+'"><b>'+minContent+'</b></li><li class="nav-title  '+active+' '+iClass+'"  name="'+d['name']+'">'+d['value']+'</li>';
				}
			}
			newtecJQ.append(html);
			var click=params['click'];
			newtecJQ.on('click','li.nav-title ',function(){
				var li=$(this);
				var isFalse=true;
				if(Newtec.Utils.isFunction(click))
					isFalse=click(li.text(),li.attr('name'),this);
				if(isFalse!==false){
					newtecJQ.find('li.active').removeClass('active');
					li.addClass('active');
				}
			});
			return newtecJQ;
		},
		/**
		 * 改变导航条title
		 * @param data 传入的数据
		 * @param index 当index有值且大于0时，去除导航条后面index个标题
		 */
		updateTitle:function(data,index){
			if(Newtec.Utils.isNull(data)||!Newtec.Utils.isArray(data)){
				console.error("data不能为空！！");
				return ;
			}
			var ul=this.newtecJQ;
			var params=this.defaults;
			var isTrue=false;
			if(!Newtec.Utils.isNull(index)&&!isNaN(index)){
				var lis=ul.find('li.nav-title ');
				var len=lis.length;
				for ( var i = index; i > 0; i--) {
					var d=data.shift();
					var li=$(lis[len-i]);
					if(Newtec.Utils.isNull(d)){
						li.remove();
					}else{
						if(Newtec.Utils.isString(d)){
							li.html(d);
						}else if(Newtec.Utils.isJson(d)){
							li.html(d['value']);
							li.attr('name',d['name']);
						}
					}
				}
			}
			var minContent=params['minContent'];
			var minClass=params['minClass'];
			var itemClass=params['itemClass'];
			var numClass=params['numClass'];
			var html='';
			for ( var i = 0; i < data.length; i++) {
				var iClass=(numClass['num'+i]||"")+" "+itemClass;
				var d=data[i];
				if(Newtec.Utils.isNull(d))continue;
				if(Newtec.Utils.isString(d)){
					html+=isTrue?'<li class="nav-title '+iClass+'">'+d+'</li>':
						'<li class="nav-min '+minClass+'" ><b>'+minContent+'</b></li><li class="nav-title '+iClass+'">'+d+'</li>';	
				}else if(Newtec.Utils.isJson(d)){
					var mClass=minClass+((d['minStyle']&&" "+d['minStyle'])||"");
					minContent=d['minContent']==undefined?minContent:d['minContent'];
					iClass+=(d['itemClass']&&" "+d['itemClass'])||"";
					html+=isTrue?'<li class="nav-title '+iClass+'" name="'+d['name']+'">'+d['value']+'</li>':
						'<li class="nav-min '+mClass+'" ><b>'+minContent+'</b></li><li class="nav-title '+iClass+'" name="'+d['name']+'">'+d['value']+'</li>';
				}
			}
			ul.append(html);
		}
	});
	Newtec.Ruler = function (params) {
		//2.
		this.defaults = {
			length:1000,//
			min:10,//最小刻度
			max:100,//
			mode:'H',//V:垂直,H:水平
			style:'',
			liStyle:'',
			lineColor:'',
			lines:null,
			hoverColor:'red',
			selectColor:'#1e43d8',
        };
        params=null;
        this.linesDiv={};
	};
	Newtec.Ruler.exte(Newtec.Base,'ruler');
	Newtec.Ruler.over({
		createNewtecJQ:function(params){
			var min=params.min;
		 	var max=params.max;
		 	var length=params.length;
		 	var n=length/min;
		 	var m=max/min;
		 	var mode=params.mode;
		 	var ul="";
		 	var style=params.style;
		 	var liStyle=" list-style: none;float: left; line-height: 10px;font-size: 10px;"+params.liStyle;
		 	if(mode=="H"){
		 		liStyle='border-left: 1px solid;'+liStyle;
		 		ul='<ul title="请双击" style="white-space: nowrap;position:relative;border-bottom: 1px solid;height: 15px;width:'+(length+min)+'px;'+style+'">';
		 		for(var i=0;i<n;i+=m){
			 		ul+='<li  style="height: 15px;width:'+min+'px;'+liStyle+'">'+i*min+' <li>';
			 		for(var j=1;j<m;j++){
			 			ul=ul+'<li style="height: 4px;margin-top: 11px;width:'+min+'px;'+liStyle+'"> </li>';
			 			if(i+j==n-1){
			 				break;
			 			}
			 		}
			 	}
//		 		ul=ul+'</ul>';
		 		ul=ul+'<li style=" white-space: nowrap; height: 15px;width:'+min+'px;'+liStyle+'">'+length+' <li></ul>';
		 	}else{
		 		liStyle='border-top: 1px solid;display: block;'+liStyle;
		 		ul='<ul title="请双击" style="position:relative;border-right: 1px solid;width: 15px;height:'+(length+min)+'px;'+style+';">';
		 		var t=0,l=0,c;
			 	for(var i=0;i<n;i+=m){
			 		c=i*min;
			 		if(c<10){
			 			t=1;
			 		}else if(c<100){
			 			t=4;
			 		}else if(c<1000){
			 			t=7;
			 		}else{
			 			t=10;
			 		}
			 		l=3-t;
			 		ul=ul+'<li style="width: 15px;height:'+min+'px;'+liStyle+'"> <p style="transform: rotate(-90deg);position: absolute;top:'+(t+c)+'px;left:'+l+'px;">'+i*min+'</p><li>';
			 		for(var j=1;j<m;j++){
			 			ul=ul+'<li style="width: 4px;margin-left: 11px;height:'+min+'px;'+liStyle+'"> </li>';
			 			if(i+j==n-1){
			 				break;
			 			}
			 		}
			 	}
			 	c=length;
			 	if(c<10){
		 			t=1;
		 		}else if(c<100){
		 			t=4;
		 		}else if(c<1000){
		 			t=7;
		 		}else{
		 			t=10;
		 		}
		 		ul=ul+'<li style="'+liStyle+'width: 15px;height:'+min+'px"> <p  style="transform: rotate(-90deg);position: absolute;top:'+(t+c)+'px;left:'+l+'px;">'+i*min+'</p> <li></ul>';
		 	}
		 	return $(ul);
		},
		finsh:function(f){
			var newtecJQ=this.newtecJQ;
			var dbclickFun="",that=this;
			if(f.mode=='H'){
				dbclickFun=function(e){
		   			var left=e.clientX-newtecJQ.offset().left;
		   			that.addLine(left);
//		   			var style='left:'+left+'px;top:0;height:'+newtecJQ.parent().height()+'px;border-left:1px solid #ddd;width:3px;'+f.lineStyle;
//		   			newtecJQ.append('<div class="rulerLine" style="cursor:pointer;position: absolute;'+style+'"></div>');
   				};
			}else{
				dbclickFun=function(e){
		   			var top=e.clientY-newtecJQ.offset().top;
		   			that.addLine(top);
//		   			var style='height:3;border-top:1px solid #ddd;width:'+newtecJQ.parent().width()+'px;left:0px;top:'+top+'px;'+f.lineStyle;
//		   			newtecJQ.append('<div class="rulerLine" style="cursor:pointer;position: absolute;'+style+'"></div>');
   				};
			}
			newtecJQ.on('dblclick',dbclickFun);
			newtecJQ.on('dblclick','.rulerLine',function(){
				$(this).remove();
		 		return false;
			});
			setTimeout(function(){
				if(f.lines){
					that.addLine(f.lines);
				}
				
			},500);
			$(document).bind('keydown',function(e){
				if(!that.selectLine)return;
				var theEvent = e || window.event;    
			    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
			    var selectLine=that.selectLine;
			    var px=Newtec.Utils.toInt(selectLine.attr('data'));
			    var linesDiv=that.linesDiv;
			    if(f.mode=="H"){
			    	
			    	if(code==37){//左
			    		linesDiv[px-1]=linesDiv[px];
			   	 		selectLine.css('left',(Newtec.Utils.toFloat(selectLine.css('left'))-1)+'px');
			   	 		selectLine.attr('data',px-1);
			 	  	}else if(code==39){//右
			 	  		linesDiv[px+1]=linesDiv[px];
			    		selectLine.css('left',(Newtec.Utils.toFloat(selectLine.css('left'))+1)+'px');
			    		selectLine.attr('data',px+1);
				  	}
			 	  	delete linesDiv[px];
			    }else{
			    	if(code==38){//上
			    		linesDiv[px-1]=linesDiv[px];
			    		selectLine.css('top',(Newtec.Utils.toFloat(selectLine.css('top'))-1)+'px');
			    		selectLine.attr('data',px-1);
			    	}else if(code==40){//下
			    		linesDiv[px+1]=linesDiv[px];
			    		selectLine.css('top',(Newtec.Utils.toFloat(selectLine.css('top'))+1)+'px');
			    		selectLine.attr('data',px+1);
			  		}
			    	delete linesDiv[px];
			    }
			 });
		},
		addLine:function(px){
			if(Newtec.Utils.isArray(px)){
				for (var i=0;i<px.length;i++) {
					this.addLine(px[i]);
				}
			}else{
				var px=Newtec.Utils.toInt(px,-1111);
				if(px==-1111)return;
				var f=this.defaults;
				var linesDiv=this.linesDiv;
				var newtecJQ=this.newtecJQ,h=0;
				var parent=f.lineParentJQ?f.lineParentJQ:newtecJQ.parent();
				var ctop =Newtec.Utils.toInt(newtecJQ.offset().top-parent.offset().top) ;
				var cleft=Newtec.Utils.toInt(newtecJQ.offset().left-parent.offset().left);
				var min=f.min;
				var m=px%min;
				px=m<3?px-m:(min-m<3?px+(min-m):px);
				if(isNaN(px)||px>f.length){
					console.error('该坐标：'+px+',不规范或者超过最大尺度');
					return ;
				}
				var style=f.mode=="H"?'left:'+(px+cleft)+'px;top:0;height:100%;border-left:1px solid;width:3px;'
					:'height:3px;border-top:1px solid;width:100%;left:0px;top:'+(px+ctop)+'px;';
				style=style+'border-color:'+f.lineColor;
				var line=$('<div title="双击隐藏" class="rulerLine" data="'+px+'" style="z-index:1099;cursor:pointer;position: absolute;'+style+'"></div>');
				parent.append(line);
				linesDiv[px]=line;
				var color=line.css('border-color'),selectColor=f.selectColor;
				line.on('dblclick',function(){
					$(this).remove();
					delete linesDiv[px];
					line=null;
			 		return false;
				});
				var that=this;
				line.on('click',function(){
					var jq=$(this);
					if(jq.attr('class').indexOf('ruler-selected')>=0){
						jq.removeClass('ruler-selected');
						that.selectLine=null;
					}else{
						if(that.selectLine){
							that.selectLine.removeClass('ruler-selected');
						}
						jq.addClass('ruler-selected');
						that.selectLine=jq;
					}
			 		return false;
				});
				line.hover(function(){
//					color=line.css('border-color');
					line.css('border-color',f.hoverColor);
				},function(){
					line.css('border-color',color);
				});
				if(f.mode=="H"){
					line.draggable({
					 axis: "x",
					 start:function(e,t){
					 	if(that.selectLine){
						 	that.selectLine.removeClass('ruler-selected');
					 	}
					 	var jq=$(this);
					 	jq.addClass('ruler-selected');
						that.selectLine=jq;
					 },
					 stop:function(e,t){
					 	var c =Newtec.Utils.toInt(t.position.left-t.originalPosition.left);
					 	var data=Newtec.Utils.toInt(line.attr('data'));
					 	linesDiv[data+c]=line;
					 	delete linesDiv[data];
					 	line.attr('data',data+c);
					}});
				}else{
					line.draggable({
					 axis: "y",
					 start:function(e,t){
					 	if(that.selectLine){
						 	that.selectLine.removeClass('ruler-selected');
					 	}
					 	var jq=$(this);
					 	jq.addClass('ruler-selected');
						that.selectLine=jq;
					 },
					 stop:function(e,t){
					 	var c =Newtec.Utils.toInt(t.position.top-t.originalPosition.top);
					 	var data=Newtec.Utils.toInt(line.attr('data'));
					 	linesDiv[data+c]=line;
					 	delete linesDiv[data];
					 	line.attr('data',data+c);
					}});
				}
			}
		},clear:function(px){
				if(Newtec.Utils.isArray(px)){
					for (var i=0;i<px.length;i++) {
						this.clear(px[i]);
					}
				}else{
					var linesDiv=this.linesDiv;
					if(Newtec.Utils.isNull(px)){
						for(var key in linesDiv){
							linesDiv[key].remove();
							delete linesDiv[key];
						}
					}else{
						if(linesDiv[px]){
							linesDiv[key].remove();
						}
						delete linesDiv[px];
					}
				}
			},
		getLinesNum:function(){
			var lines=[],linesDiv=this.linesDiv;
			for(var key in linesDiv){
				lines.push(Newtec.Utils.toInt(key));
			}
			return lines;
		},
		getOffsetLT:function(){
			var lines=[],linesDiv=this.linesDiv;
			var c=this.defaults.mode=="H"?this.newtecJQ.offset().left:this.newtecJQ.offset().top;
			for(var key in linesDiv){
				lines.push(Newtec.Utils.toInt(key)+c);
			}
			return lines;
		}
	});
	Newtec.Module("Widget")
})();