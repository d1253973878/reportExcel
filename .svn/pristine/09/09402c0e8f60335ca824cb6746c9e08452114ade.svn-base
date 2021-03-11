/**
 * 描述：定义最基本的三层结构：top ,content,foot
 * 页面：通用页面
 * @author wmk
 */
Newtec.Component('Params'
,function () {
	if(Newtec.Compage){
		console.error("newtec.compage.js已经存在");
		return ;
	}
	console.info("====Newtec.Compage==========")
	Newtec.Utils.addCSS("newtec-page.css","myqdp/css/widget/")
    Newtec.Compage = function (params) {
        //默认
        this.defaults = {
        	appendTo:'body',
        	showLink:true,
        	className:"",
        	showCopyright:true,
        	showPTop:true,
        	showPContent:true,
        	showPFoot:false,
        	pTopClass:null,
        	pContentClass:null,
        	pFootClass:null,
        	setTopBodyFun:null,
        	setContentBodyFun:null,
        	setFootBodyFun:null,
        	is100:true,
        	createPagebefore:null,
        	createPageAfter:null,
        };
        this.UrlParam=null;
    };
    Newtec.Compage.exte(Newtec.Base, 'compage');
    Newtec.Compage.over({
        createNewtecJQ: function (params) {
        	var pageThis=this,
        	page=$("<div class='newtec-page "+(this.type)+(params.is100&&" height100"||"")+(params.className&&" "+params.className||"")+"'></div>"),
        	defaults=this.defaults;
        	this.isAdminPage=parent.Newtec.app!=undefined;
        	this.isAdminPage&&_getAuthor(this);
        	this.createPageBefore(defaults,page);
        	Newtec.Utils.isFunction(params.createPagebefore)&&params.createPagebefore(pageThis,defaults);
        	//top
        	if(defaults.showPTop){
        		this.pageTopJQ=$(this.getBodyHtml("page-top")).append(pageThis.setTopBody(defaults,page));
        		page.append(this.pageTopJQ);
        		pageThis.setTopBodyAfter(defaults,page);
        	}
        	//conntent
        	if(defaults.showPContent){
        		this.pageContentJQ=$(this.getBodyHtml("page-minddle")).append(pageThis.setContentBody(defaults,page))
        		page.append(this.pageContentJQ)
        		pageThis.setContentBodyAfter(defaults,page);
        	}
        	//foot
        	if(defaults.showPFoot){
        		this.pageFootJQ=$(this.getBodyHtml("page-foot")).append(pageThis.setFootBody(defaults,page));
        		page.append(this.pageFootJQ)
        		&&pageThis.setFootBodyAfter(defaults,page);
        	}
        	$('body').append(page);
        	//
            return page;
        },
        setTopBody:function(defaults,page){
        	return "页面头部，请重写setTopBody";
        },
        setContentBody:function(defaults,page){
        	return "页面内容部分，请重写setContentBody";
        },
        setFootBody:function(defaults,page){
        	return "页面底部部分，请重写setFootBody";
        },
        createPageBefore:function(defaults,page){},
        createPageAfter:function(defaults,page){},
        setTopBodyAfter:function(defaults,page){},
        setContentBodyAfter:function(defaults,page){},
        setFootBodyAfter:function(defaults,page){},
        setBody:function(defaults,setBodyFun,layoutClass){
        	var layout=$(this.getBodyHtml(layoutClass));
        	var body=Newtec.Utils.isFunction(setBodyFun)&&setBodyFun(defaults,layout);
        	body&&topBody.append(body);
        	return layout;
        },
        finsh:function(defaults){
        	var that=this;
        	if(this.isAdminPage){//管理端页面执行逻辑
        		var app=that.getApp();
        		that.getApp().setChildDom(document,this);
//        		$(document).click(function(){
//	          		that.getApp().childClick();
//	            })
        	}
        	Newtec.Utils.isFunction(defaults.createPageAfter)&&params.createPageAfter(that,defaults);
	        this.createPageAfter(defaults,this);   
        },
        getBodyHtml:function(layoutClass){
        	return "<div class='page-item "+(layoutClass||"")+"'></div>";
        },
        getAppId:function(){
        	return this.appId=this.appId&&Newtec.Person.getPowerAppId();
        },
        getApp:function(){
        	return this.parentApp;
        },
        gotoPage:function(menuName, menuId, appId, additional, type,isClear){
        	this.getApp().addContabs(menuName, menuId, appId, additional, type,isClear);
        },
        getAddData:function(){
        	return this.getApp().getContabData();
        },
//        finAppendToJQ:function(params){
//			var frame = window.frameElement;
//			if(frame==null || frame==undefined) return params["appendTo"];
//			var frame = Newtec.AppUtils.getFrameWin(frame.name);
//			return $(frame.document).find(params["appendTo"]);;
//		},
		getAuthorBtns:function(){
			return Newtec.Person.getButton();
		},
        hint:function(html,title,btnTitle,btnClass){
        	return Newtec.Window.hint(html,title,btnTitle,btnClass);
        },
        confirm:function(execute,html,title,okTitle,noTitle,okClass,noClass){
        	return Newtec.Window.confirm(execute,html,title,okTitle,noTitle,okClass,noClass);
        }
//		appAuthorLevel:
    });
    /**
	 * 权限资源控制
	 */
   function _getAuthor(pathThis){
	   pathThis.parentApp=parent.Newtec.app;
	 //权限等级
	   pathThis.appAuthorLevel=Newtec.Person.get().app.authorityControl;
   }
  Newtec.Module("Compage")
	 console.info("====Newtec.Compage=====11111=====")
});