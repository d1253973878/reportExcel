/**
 * 平台构建
 * TODO 1.提供底色;2.顶部收缩;3.左侧parent图标显示
 * @author 曾文杰
 */
(function () {
	var serverUrl=Newtec.ServerUrl||"";
	//引入css样式
	Newtec.Utils.addCSS("font-awesome.min.css","myqdp/font-awesome/4.5.0/css/");
//	Newtec.Utils.addCSS("fonts.googleapis.com.css");
//	Newtec.Utils.addCSS("zTreeStyle/zTreeStyle.css","myqdp/ztree/css/");
	Newtec.Utils.addCSS("newtec.contabs.css");
	Newtec.Utils.addCSS("newtec.css");
	Newtec.Utils.addCSS("newtec.sidebar.css");
	
	Newtec.Utils.addCSS("skin/newtec-skin.css");
	//js
//	Newtec.Utils.addJS("jquery.ztree.all.js","myqdp/ztree/js/");
	Newtec.Utils.addJS("widget/newtec.sidebar.js");
	Newtec.Utils.addJS("widget/newtec.table.js");
	Newtec.Utils.addJS("widget/newtec.menu.js");
    Newtec.App = function (params) {
    	var logoutServlet=AppParam.LogoutServlet,
    	goMainPage=AppParam.goMainPage;
    	var application=AppParam.application
    	this.defaults = {
        		applicationTitle:application.applicationTitle,
        		logoutServlet:logoutServlet||"LogoutServlet",
        		goMainPage:goMainPage||"SSOIndexPageServlet",
        		showRightMenu:false,
        		companyName: "广州粤信科技有限公司(2000~2018)",
        		changeData:true,//是否进行数据转换
        		showScroll:true,//显示菜单滚动条
        };	
    	this.showHome=application.showHome||false;
    	this.openPage=application.openPage||false;
        $.extend(this.defaults, params, {});
        this.childBodys={};
        this.ds = new Newtec.DS('loginDS');
        //存放已经加载的应用信息
        this.app = {};
        this.menuNewtec={};
        this.appDatas=null;
				this.logoImg={};
				this.appDivMap={};
    };
    Newtec.App.exte(Newtec.Base, 'app');
    Newtec.App.over({
        createNewtecJQ: function () {
        	this.body=$(this.defaults.appendTo);
        	this.fetchData();
        	console.warn("==============",body[0])
            return this.body;
        }
    });

    Newtec.App.appList = {};//追加外部可以直接访问的部分，和内部的this.app是同样的数据

    Newtec.App.config = {
        prefix: {
            tab: 'tab_',
            iframe: 'iframe_'
        },
        /**
         * 获取当前使用的skin名称
         */
        getCurrentSkinConfig: function () {
            console.log('调用Newtec.App.config.getCurrentSkinConfig()');
            return Newtec.App.config.skinCurrent;
        },
        /**
         * 通过提供名称，获取对应的设置
         * @param widget 不可空，具体是哪个组件
         * @param key 可空，底下的属性
         */
        getSkinConfig: function (widget, key) {
            console.warn('调用Newtec.App.config.getSkinConfig()');
            var skinName = Newtec.App.config.getCurrentSkinConfig();
            var a = Newtec.App.config.skin[skinName][widget];
            if (Newtec.Utils.isNull(key)) {
                return a;
            } else {
                return a[key];
            }
        },
        getSkinClassName:function(key1,key2){
        	if(Newtec.Utils.isNull(key1))return;
        	var className='skin';
        	if(Newtec.Utils.isArray(key1)){
        		for ( var i = 0; i < key1.length; i++) {
        			className+="_"+key1[i];
				}
        		return className;
        	}else{
        		className+="_"+key1;
        		if(!Newtec.Utils.isNull(key2))	
        			className+="_"+key2;
        		return className;
        	}
        },
        /**
         * 设置组件属性
         * @param widget 组件，如table
         * @param keyValue json属性{key1:value1,key2:value2}
         */
        setWidgetConfig: function (widget, keyValue) {
            var skinName = Newtec.App.config.getCurrentSkinConfig();
            Newtec.App.config.skin[skinName][widget] = keyValue;
        },
        /**
         * 设置组件属性
         * @param widget 组件名
         * @param key 属性key
         * @param value 值value
         */
        setWidgetConfigAttr: function (widget, key, value) {
            var skinName = Newtec.App.config.getCurrentSkinConfig();
            Newtec.App.config.skin[skinName][widget][key] = value;
        },
       
        /**
         * 设置skin
         * @param skinName
         */
        setSkin: function (skinName) {
        	var preClass=this.preClass||"no-skin";
        	console.info("preClass",preClass);
        	$('body').removeClass(preClass)
        	$('body').addClass(skinName)
        	this.preClass=skinName;
        	var childBodys=this.childBodys
        	for(var key in childBodys){
        		var cBody=childBodys[key];
        		cBody.removeClass(preClass)
        		cBody.addClass(skinName)
        	}
        },
        changeSkin:function(className,skinConfig,document){
        	 for ( var key in skinConfig) {
        		 var skins=skinConfig[key];
        		 if(Newtec.Utils.isString(skins)){
        			 var tagetJQ=document.find(className+"_"+key);
        			 if(Newtec.Utils.isNull(skins)||tagetJQ[0]==undefined)continue;
        			 var styles=skins.split(";");
        			 var param={};
        			 for ( var i = 0; i < styles.length; i++) {
        				 var style=styles[i].split(":");
        				 if(style.length<2)continue;
        				 param[style[0]]=style[1];
        			 }
        			 tagetJQ.css(param);
        		 }else if(Newtec.Utils.isJson(skins)){
        			this.changeSkin(className+"_"+key,skins,document);
        		 }
  			}
        },
        setAppColor: function (bgColor) {
            $('body').css('background', bgColor);
        },
        //记录当前使用的skin
        skinCurrent: 'default',
        //具体设置skin
        skin: {
        	'no-skin': {
        		title: '默认',
        	},
            "black-skin": {
                title: '暗黑色',
            },
        },
        color: {
            'currentColor': 'color1',//当前使用的颜色
            'green': 'color1',
            'red': 'color2',
            'brown': 'color3'
        },
        fontSize: {
            'currentFontSize': '18px',
            'large': '21px',
            'normal': '18px',
            'small': '13px'
        }
    };

    /**
     * 查询数据
     * @author 曾文杰
     */
    Newtec.App.prototype.fetchData = function () {
        var that = this;
        this.ds.fetchData({
            operId: 'getPersonApplication', data: {}, callback: function (response) {
                if (response.status != 0) {//未登录
                    window.location.href = "login.html";
                    return;
                }
                var person=response.data;
                var appDatas={};
                var apps=person.apps;
                if(!apps)return;
                for(var i=0;i<apps.length;i++ ){
                	var app=apps[i]
                	appDatas[app.id]=app;
                }
                that.appDatas=appDatas;
                console.info("appDatas---",appDatas);
                Newtec.person = response.data;
                // 需要加载顶部导航条
                that.buildTopNav(response.data);
                // 需要加载底部导航条
                that.buildBottomNav({});
            }
        });
    };

    /**
     * 构建顶部导航条
     * @author 曾文杰
     */
    Newtec.App.prototype.buildTopNav = function (data) {
    	console.warn("w==buildTopNav===");
        var defaults=this.defaults;
        var topNavData = data.apps;
        this.topNavData = topNavData
        var appNum = topNavData.length
        this.topNavId = 'nav_top_' + Newtec.Utils.uuid16();//顶部应用导航条对象
        this.topNavAppId = 'nav_top_app_' + Newtec.Utils.uuid16();
        console.info( this.body[0],this.topNavId);
        this.topNav =$("<div id='" + this.topNavId + "'></div>")
        this.body.append( this.topNav);

        var html = "";
        html += "\n<div id='topNav' class='navbar navbar-default ace-save-state " + Newtec.App.config.color.currentColor + "' style='margin-bottom:0'>";
        html += "\n  <div class='navbar-container ace-save-state row' id='navbar-container' style='margin-left: 12px; margin-right: 12px;'>";
        html += "\n    <div class='navbar-header pull-left'>";
        html += "\n      <a href='javascript:;' class='navbar-brand' id='sysTitle'><small><img style='width:25px; margin: -16px 5px' src='"+serverUrl+"myqdp/images/depmentlogo.png'/>"+this.defaults.applicationTitle+"</small></a>";
        html += "\n    </div>";
        html +=this.getTopHeadButtonHtml(data,defaults)
        if(appNum==1){
        	html += "\n    <ul class='top-ul-nav' style='float:right;margin-top:3px;margin-right:20px;'>";
        	html += "\n      <li style='padding: 5px 5px;'>";
        	html += "\n      <div id='themeSwitch' class='dropdown'>";
        	html += "\n        <a class='dropdown-toggle' data-toggle='dropdown' href='#' aria-expanded='false'><i class='glyphicon glyphicon-picture'></i><b class='caret'></b></a>";
        	html += "\n          <ul class='dropdown-menu' style='width:100px; min-width:100px;'>";
        	
        	for (var key in Newtec.App.config.skin) {
        		var s = Newtec.App.config.skin[key];
        		var ss = "Newtec.App.config.setSkin(\""+key+"\")";
        		html += "\n            <li style='padding:5px 10px;'><a href='javascript:;' onclick='" + ss + "'><font color='black'>" + s.title + "</font></a></li>";
        	}
        	html += "\n          </ul>";
        	html += "\n        </div>";
        	html += "\n      </li>";
        	html += "\n      <li class='font-item' style='padding: 5px 5px;' data='large' ><a href='#'>大</a></li>";
        	html += "\n      <li class='font-item' style='padding: 5px 5px;' data='normal'><a href='#'>中</a></li>";
        	html += "\n      <li class='font-item active' style='padding: 5px 5px;' data='small' ><a href='#'>小</a></li>";
        	html += "\n      <li  style='padding: 5px;display: none;' id='min-logout-link'><a href='LogoutServlet'><i class='glyphicon glyphicon-log-out'></i></a></li>";
        	// html += "\n      <li style='padding: 5px 5px;'><a href='#' id='switchHeadType'><span class='glyphicon glyphicon-chevron-up' data-icon1='glyphicon glyphicon-chevron-up' data-icon2='glyphicon glyphicon-chevron-down'></span></a></li>";
//        	html += "\n      <li style='padding: 5px 5px;'><a href='#' id='switchHeadType'><img src='myqdp/images/table/chevron-up2.png' alt='' width='12' height='12' data-img1='myqdp/images/table/chevron-up2.png' data-img2='myqdp/images/table/chevron-down2.png'></a></li>";
        	html += "\n    </ul>";
        	html += "\n  </div>";
        }else{
        	html += "\n  </div>";
	        html += "\n  <div id='" + this.topNavAppId + "' class='row top-nav2' style='margin-left: 15px; margin-right: 15px; position: relative; height: 41px;'>";
	        html += "\n    <ul class='' style='padding-left: 0; position: absolute; top 0; left: 0'>";
	//        html += "\n      <li class='active'><a href='javascript:void(0);' data-id='IndexPageServlet' class='topNavTab active' style='outline:0;'>首页</a></li>";
	        if (topNavData != undefined) {
	    		for (var i = 0, l = appNum; i < l; i++) {
	    			var a = topNavData[i];
	    			html += "\n      <li><a id='top_"+a.id+"' class='topNavTab "+(i==0?"active":'')+"' style='outline:0;' data-id='" + a.id + "' href='javascript:void(0);'>" + a.name + "</a></li>";
	    		}
	        }
	        html += "\n    </ul>";
	        html += "\n    <ul class='' style='position: absolute; right: 0; top: 0;'>";
	        html += "\n      <li style='padding: 5px 5px;'>";
	        html += "\n      <div id='themeSwitch' class='dropdown'>";
	        html += "\n        <a class='dropdown-toggle' data-toggle='dropdown' href='#' aria-expanded='false'><i class='glyphicon glyphicon-picture'></i><b class='caret'></b></a>";
	        html += "\n          <ul class='dropdown-menu' style='width:100px; min-width:100px;'>";
	
	        for (var key in Newtec.App.config.skin) {
	            var s = Newtec.App.config.skin[key];
	            var ss = "Newtec.App.config.setSkin(\""+key+"\")";
	            html += "\n            <li style='padding:5px 10px;'><a href='javascript:;' onclick='" + ss + "'><font color='black'>" + s.title + "</font></a></li>";
	        }
	        html += "\n          </ul>";
	        html += "\n        </div>";
	        html += "\n      </li>";
	        html += "\n      <li class='font-item' style='padding: 5px 5px;' data='large' ><a href='#'>大</a></li>";
	        html += "\n      <li class='font-item' style='padding: 5px 5px;' data='normal'><a href='#'>中</a></li>";
	        html += "\n      <li class='font-item active' style='padding: 5px 5px;' data='small' ><a href='#'>小</a></li>";
	        html += "\n      <li  style='padding: 5px;display: none;' id='min-logout-link'><a href='LogoutServlet'><i class='glyphicon glyphicon-log-out'></i></a></li>";
	        // html += "\n      <li style='padding: 5px 5px;'><a href='#' id='switchHeadType'><span class='glyphicon glyphicon-chevron-up' data-icon1='glyphicon glyphicon-chevron-up' data-icon2='glyphicon glyphicon-chevron-down'></span></a></li>";
	        html += "\n      <li style='padding: 5px 5px;'><a href='#' id='switchHeadType'><img src='"+serverUrl+"myqdp/images/table/chevron-up2.png' alt='' width='12' height='12' data-img1='"+serverUrl+"myqdp/images/table/chevron-up2.png' data-img2='"+serverUrl+"myqdp/images/table/chevron-down2.png'></a></li>";
	        html += "\n    </ul>";
	        html += "\n  </div>";
        }
        html += "\n</div>";
        
        var layout=$(html);
        if(appNum==1){
        	var contentLayout = $('.newtec_system').parent()
        	contentLayout.css("top","45px")
        }
        console.info("==>>>>>", this.topNav[0]);
        this.topNav.append(layout);

        var that = this;
        var startHexColor = '#98bf21';
        var endRGBColor = inside.generateRGB(inside.convertHex2RGB(startHexColor));

        //这里添加平台首页，方便查找
        this.app['IndexPageServlet'] = {};
        Newtec.App.appList['IndexPageServlet'] = {};
        
        if(topNavData&&appNum>0){//第一次初始化，如果存在外部指定appId,跳转到指定appId
        	toAppId&&that.openApp(toAppId)
        	|| that.buildApp(topNavData[0]['id']);
        }
        $('.topNavTab').on('click', function () {
            var appId = $(this).data('id');
            that.buildApp(appId);
            $('.topNavTab').removeClass('active');
            $(this).addClass('active');
        });
        layout.on('click','.top-nav2 ul li.font-item',function(){
        	var jq=$(this);
        	layout.find('.top-nav2 ul li.active').removeClass('active')
        	jq.addClass("active")
        	var fontSizeType=jq.attr("data");
        	 var fontSize = Newtec.App.config.fontSize[fontSizeType];
             $('body').css('font-size', fontSize);
             fontSizeType=="large"&&$('body').addClass("body-large")||$('body').removeClass("body-large")
        }) 
        layout.on('click','.top-ul-nav li.font-item',function(){
        	var jq=$(this);
        	layout.find('.top-ul-nav li.active').removeClass('active')
        	jq.addClass("active")
        	var fontSizeType=jq.attr("data");
        	 var fontSize = Newtec.App.config.fontSize[fontSizeType];
             $('body').css('font-size', fontSize);
        }) 
    };
    /**
     * 功能说明：头部右侧工具按钮栏
     * @param data 用户信息
     * @param defaults 自定义参数
     * @returns {String} html 代码
     */
    Newtec.App.prototype.getTopHeadButtonHtml=function(data,defaults){
    	
    	var html = "\n    <div class='navbar-buttons navbar-header pull-right' role='navigation'>";
        html += "\n      <a class='n-btn'>当前用户：<span>" + data.name + "</span></a>";
        html += "\n      <a class='n-btn' >机构：" + data.depName + "</a>";
        html += "\n      <a class='n-btn'>|</a>";
        html += "\n      <a href='"+(defaults.goMainPage)+"' class='n-btn'>返回主页面</a>";
        html += "\n      <a href='"+(defaults.logoutServlet)+"' class='n-btn roll-nav roll-right J_tabExit'><i class='glyphicon glyphicon-log-out'></i> 退出</a>";
        html += "\n    </div>";
        return html;
    }
    /**
     * 构建底部导航条
     * @author 曾文杰
     */
    Newtec.App.prototype.buildBottomNav = function (bottomNavData) {
        //加载底部导航条
        var html = "";

        this.bottomNavId = 'nav_bottom_' + Newtec.Utils.uuid16();
        this.newtecJQ.append("<div id='" + this.bottomNavId + "'></div>");

        html += "\n<div id='bottomNav' class='bottom-nav " + Newtec.App.config.color.currentColor + "'>";
        html += "\n  <ul id='" + this.bottomNavId + "' style='padding-left: 5px;'>";
//        html += "\n    <li><a href='javascript:void(0);'><i id='closeOrOpen' title='点击收起菜单' style='z-index: 1086;' class='glyphicon glyphicon-folder-close'></i></a></li>";
        html += "\n    <li><a href='javascript:void(0);'><i id='closeOrOpen'  style='z-index: 1086;'><img title='点击收起菜单' style='width:25px;' src='"+serverUrl+"myqdp/images/icon/close.png'/></i></a></li>";
        html += "\n  </ul>";
        html +="<p class='foot-copy'>Copyright  "+  this.defaults.companyName+"</p>";
        html += "\n</div>";

        this.bottomNav = $('#' + this.bottomNavId);//底部快捷方式对象
        this.bottomNav.append($(html));
    };
    //根据appId打开云应用
    Newtec.App.prototype.openApp=function(appId){
    	var appJQ= $("#top_"+appId);
    	if(!appJQ[0])return false;
        $('.topNavTab').removeClass('active');
        
        $("#top_"+appId).addClass('active')
        this.buildApp(appId);
        return true;
    }
    /**
     * 构建系统，这里会判断应用是否加载过
     * @author 曾文杰
     */
    Newtec.App.prototype.buildApp = function (appId) {
        var app = this.app[appId];
        if (app != undefined) {
            //应用已存在，切换到该应用
            Newtec.person = Newtec.p[appId];
            this.switchApp(appId);
        } else {
            //应用不存在，需要构建系统
            this.buildNewApp(appId);
        }
    };

    /**
     * 构建新系统
     * @author 曾文杰
     */
    Newtec.App.prototype.buildNewApp = function (appId) {
        //开始构建系统
        var that = this;
        $('.newtec_system').removeClass('active').hide();
        new Newtec.DS('loginDS').fetchData({
            operId: 'toApplication', appId: appId, /*data: {appId: appId},*/ callback: function (response) {
                if (response.status != 0) {
                    alert(response.failureMessage);
                    return;
                }
                var person=response.data;
                var crrApp=that.appDatas[appId];
                person.app=crrApp;
                console.info("======person======<<<<",person);
                Newtec.person = person;
                if (Newtec.p == undefined) Newtec.p = {};
                Newtec.p[appId] = Newtec.person;//将每次的用户缓存在Newtec.p中，在切换应用时，取缓存的应用需要重设置回Newtec.person
                Newtec.DS.set(response.data.ds);
                var appObj = $("<div class='newtec_system active' style='height:100%;' id='" + appId + "'></div>");
                $('#main').append(appObj);
                var menuObj = that.buildMenu(appId, person.nodes, person.app.nodeType);
                var bodyObj = that.buildBody(appId, person.app.mainUrl);

                //=====left & right=====
                var lt = $("<div class='lt newtec-menu-div' id='lt_" + appId + "' ></div>");
                var rt = $("<div class='rt' id='rt_" + appId + "'></div>");
                $('#' + appId).append(lt);
                $('#' + appId).append(rt);
                // Newtec.Utils.append(lt, menuObj);
                // Newtec.Utils.append(lt, bodyObj);
                if (Newtec.Utils.isNewtec(menuObj)) {
                    lt.append(menuObj.newtecJQ);
                } else {
                    lt.append(menuObj);
                }
                rt.append(bodyObj);
                var nodes=person.nodes;
                var nodeMap={};
                for(var i=0,len=nodes.length;i<len;i++){
                	var node=nodes[i];
                	nodeMap[node.id]=node;
                }
                crrApp.nodeMap=nodeMap;
                // $('#' + appId).append(menuObj);
                // $('#' + appId).append(bodyObj);
                var menuMin = that.buildMinMenu(appId, person.nodes, person.app.nodeType);
                $('#' + appId + ' .lt').append(menuMin);
                // var thisContabs = Newtec.Contabs.create({'appId': appId, 'mainUrl': response.data.app.mainUrl, 'appendTo': appId});
                var appData = {
                    id: appId,//当前应用id
                    data: response.data,//当前应用数据
                    app: appObj,//当前应用对象
                    menu: menuObj,//当前应用的大菜单
                    body: bodyObj//当前应用页面显示对象
                };
                that.app[appId] = appData;
                Newtec.App.appList[appId] = appData;

                //绑定事件
                // initContabs(appId);
                that.initContabs(appId, response.data.app.mainUrl);
                enableSidebar();
                function enableSidebar() {
                    var $sidebar = $('.sidebar');
                    if ($.fn.ace_sidebar) $sidebar.ace_sidebar();
                    if ($.fn.ace_sidebar_scroll) $sidebar.ace_sidebar_scroll({
                        'include_toggle': false || ace.vars['safari'] || ace.vars['ios_safari']
                    });
                    if ($.fn.ace_sidebar_hover) $sidebar.ace_sidebar_hover({
                        'sub_hover_delay': 750,
                        'sub_scroll_style': 'no-track scroll-thin scroll-margin scroll-visible'
                    });
                }
                
//                appObj.append(   "<a href='javascript:void(0);'>ddddddd<i id='closeOrOpen'  style='z-index: 1086;'><img title='点击收起菜单' style='width:25px;' src='"+serverUrl+"myqdp/images/icon/close.png'/></i></a></li>")
//                    Newtec.App.config.setSkin();
                if(that.defaults.showScroll)
	                lt.mCustomScrollbar({//设置滚动条
							theme: "minimal-dark"
								,scrollInertia:200
					});
                // }, 0);
            }
        });
    };

    /**
     * 切换系统
     * @author 曾文杰
     */
    Newtec.App.prototype.switchApp = function (appId) {
        //开始切换应用

        $('.newtec_system').each(function () {
            if ($(this).attr('id') == appId) {
                $(this).addClass('active').siblings('.newtec_system').removeClass('active');
                $('.newtec_system').each(function () {
                    if ($(this).attr('id') == appId) {
                        $(this).show().siblings('.newtec_system').hide();
                    }
                });
            }
        });
    };

    /**
     * 功能说明：获取指定app当前打开的页面id
     * @param appId 可空，空则获取选中系统
     * @returns 当前页面id，可能是菜单id也可能是页面id
     */
    Newtec.App.prototype.getCrrPageId=function(appId){
    	if(!appId){
    		appId=$('.topNavTab.active').attr('data-id');
    	}
    	if(!appId)return null;
    	return $('#'+appId+" .J_menuTab.active").attr('data-id')
    }
    /**
     * 构建系统左侧菜单
     * @author 曾文杰
     */
    Newtec.App.prototype.buildMenu = function (appId, data, type) {
        //构建系统左侧菜单
        var menuObj;
        if (type == 1 || type == 2) {
            menuObj = this.buildFolderMenu(appId, data, type);
        } else {
            menuObj = this.buildTreeMenu(appId, data, type);
        }
        this.menuNewtec[appId]=menuObj;
        return menuObj;
    };

    /**
     * 构建系统左侧菜单(folder)，供buildMenu()使用
     * @author 曾文杰
     * @param appId 应用id
     * @param data 菜单数据
     * @returns {*|void|jQuery} menu对象
     */
    Newtec.App.prototype.buildFolderMenu = function (appId, data, type) {
        if (Newtec.Utils.isNull(data)) {
            return;
        }
        var withRoot = true;
        var html = '';
        var setting = {idKey: 'id', parentKey: 'parentId', childKey: 'children'};
        var arr = inside.transformTozTreeFormat(setting, data);
        html = inside.getDom(arr, withRoot);

        html = "<div id='sidebar' class='sidebar responsive' style='border-right:none;'>" + html + "</div>";
        var menuObj = $(html);
        return menuObj;
    };

	Newtec.App.prototype.getMenuNewtec=function(frontImgUrl,click){
		return Newtec.Menu.create({frontImgUrl:frontImgUrl,click:click});	
	}
    /**
     * 构建系统左侧菜单(tree)，供buildMenu()使用
     * @author 曾文杰
     */
   var params= Newtec.Utils.getUrlParams()||{};
   var fisrtPageId=params['p'],toAppId=params['a'];
    Newtec.App.prototype.buildTreeMenu = function (appId, data, type) {
        console.log('tree menu data', appId, data);
        var appThis = this;
        var treeId = "tree_" + Newtec.Utils.uuid16();

        
        var treeNewtecJQ=this.getMenuNewtec(serverUrl,function(a,that,elJQ){
        	console.info("==>>",a)
        	 if (Newtec.Utils.isNull(a.pageId) && Newtec.Utils.isNull(a.content)) {
                 return;
             }

             appThis.addContabs(a.name, a.id, a.applicationId, 'create by tree menu clicked');
        });
        var setting = {idKey: 'id', parentKey: 'parentId', childKey: 'children'};
        var a = this.defaults.changeData?inside.transformTozTreeFormat(setting, data):data;
   		var operData=this.openPage[appId];
   		if(operData&&operData.noShow){//判断是否存在不显示菜单
   			var parentId='';
   			var noShowArr= operData.noShow;
   			console.info(noShowArr)
   			for(var i=0,aLen=a.length;i<aLen;i++){
   				var node=a[i],id=node.id,parentId=node.parentId;
   				console.info(node);
   				for(var k=0,len=noShowArr.length;k<len;k++){
   					if(id==noShowArr[k]||parentId==noShowArr[k]){//子节点也不显示
   						noShowArr[len]=id;
   						len++;
   						aLen--;
   						for(var j=i;j<aLen;j++){
   							a[j]=a[j+1]
   						}
   						i--;
   						break;
   					}
   				}
   			}
   			a.length=aLen;
   		}
        treeNewtecJQ.setData(a);
        var that=this;
        if(fisrtPageId){//外部传入菜单id
        	var a=treeNewtecJQ.menuDatas[fisrtPageId];
        	if (!a||(Newtec.Utils.isNull(a.pageId) && Newtec.Utils.isNull(a.content))) {
                return treeNewtecJQ;
            }
        	setTimeout(function(){
        		treeNewtecJQ.setSelected(fisrtPageId)
        		appThis.addContabs(a.name, a.id, a.applicationId, 'create by tree menu clicked');
        	}, 100)
        }else if(this.openPage&&this.openPage[appId]){//内部配置菜单id
        	
        	var pageId= operData['id']||operData;
        	var a=treeNewtecJQ.menuDatas[pageId];
        	if (!a||(Newtec.Utils.isNull(a.pageId) && Newtec.Utils.isNull(a.content))) {
                return treeNewtecJQ;
            }
        	setTimeout(function(){
        		operData.selectNode&&treeNewtecJQ.setSelected(pageId)
        		appThis.addContabs(a.name, a.id, a.applicationId, 'create by tree menu clicked');
        	}, 100)
        }
        return treeNewtecJQ;
    };

    /**
     * 构建小菜单
     * @param appId
     * @param data
     * @returns {*|jQuery|HTMLElement}
     */
    Newtec.App.prototype.buildMinMenu = function (appId, data, type) {
        // console.log('menu-min data', data);
        var setting = {idKey: 'id', parentKey: 'parentId', childKey: 'children'};
        for (var i in data) {
            //这里我发现有些节点已经有了children属性
        	var d=data[i]
        	if(d.icon){
        		d.icon=serverUrl+d.icon;
        	}
            delete d.children;
        }
        // var arr = inside.transData(data, 'id', 'parentId', 'children');
        var arr = outside.jsonTree(data, {
            id: 'id',
            pid: 'parentId',
            children: 'children'
        }).data;
        var that = this;
        var html = "";
        html += "<ul class='menu-min' style='display:none;'>";
        console.info("------------kkllk",arr);
        for(var i=0;i<arr.length;i++){
        	var b = arr[i];
            html += "\n    <li>";
            if (Newtec.Utils.isNull(b.pageId) && Newtec.Utils.isNull(b.content)) {
                html += "\n        <a href='#' class='' id='" + b.id + "' style='outline:0;' title='" + b.name + "' data-title='" + b.name + "'><img src='" + b.icon + "' alt=''><br/>" /*+ b.name*/ + "</a>";
            } else {
                html += "\n        <a href='#' class='J_menuItem_min' id='" + b.id + "' style='outline:0;' data-title='" + b.name + "' title='" + b.name + "'><img src='" + b.icon + "' alt=''><br/>" /*+ b.name*/ + "</a>";
            }
            if (b.children) {
                html += "\n        <ul class='sub'>";
                for (var k = 0; k < b.children.length; k++) {
                    var c = b.children[k];
                    html += "\n            <li><a href='#' class='J_menuItem_min' id='" + c.id + "' style='margin-left: 15px; margin-right: 15px;outline:0;' title='" + c.name + "' title='" + c.name + "' data-title='" + c.name + "'>" + c.name + "</a></li>";
                }
                html += "\n        </ul>";
            }
            html += "\n    </li>";
        }

        html += "</ul>";

        return $(html);
    };

    /**
     * 构建中间部分nav_top
     * @author 曾文杰
     * @param appId 应用id
     * @param mainUrl 应用首页链接
     * @returns {*|void|jQuery} body对象
     */
    Newtec.App.prototype.buildBody = function (appId, mainUrl) {
        var html = "";
        // html += "\n<div class='rt'>";
        html += "\n    <div class='main-content'>";
        html += "\n        <div class='main-content-inner'>";
        html += "\n            <div class='breadcrumbs'>";
        html += "\n                <div class='content-tabs'>";
        html += "\n                    <nav class='page-tabs J_menuTabs'>";
        html += "\n                        <div class='page-tabs-content'>";
        html += this.showHome&& "\n                            <a href='javascript:;' class='active J_menuTab' id='" + Newtec.App.config.prefix.tab + mainUrl + "'>首页</a>"||"";
        html += "\n                        </div>";
        html += "\n                    </nav>";
        html += "\n                    <button class='roll-nav roll-left J_tabLeft'><i class='glyphicon glyphicon-backward'></i></button>";
        html += "\n                    <button class='roll-nav roll-right J_tabRight'><i class='glyphicon glyphicon-forward'></i>";
        html += "\n                    </button>";
        html += "\n                    <div class='btn-group roll-nav roll-right'>";
        html += "\n                        <button class='dropdown dropdown-toggle J_tabClose' data-toggle='dropdown'>关闭操作<span class='caret' style='margin-left:0'></span>";
        html += "\n                        </button>";
        html += "\n                        <ul role='menu' class='dropdown-menu dropdown-menu-right'>";
        html += "\n                            <li class='J_tabShowActive'><a>定位当前选项卡</a>";
        html += "\n                            </li>";
        html += "\n                            <li class='divider'></li>";
        html += "\n                            <li class='J_tabCloseAll'><a>关闭全部选项卡</a>";
        html += "\n                            </li>";
        html += "\n                            <li class='J_tabCloseOther'><a>关闭其他选项卡</a>";
        html += "\n                            </li>";
        html += "\n                        </ul>";
        html += "\n                    </div>";
        // html += "\n                    <a href='LogoutServlet' class='roll-nav roll-right J_tabExit'><i class='glyphicon glyphicon-log-out'></i> 退出</a>";
        html += "\n                </div>";
        html += "\n            </div>";
				html += "\n            <div id='bg_logo' style='text-align: center; margin:0 8px;display:none'><img style='min-height: 60px;  max-height: 120px;width:100%;' src='sso/image/buss1.png'/></div>";
        html += "\n            <div id='contentMain' class='content-main J_mainContent'>";
        html +=this.showHome&& "\n                <iframe class='J_iframe' name='" + Newtec.App.config.prefix.iframe + mainUrl + "' width='100%' height='100%' src='networkx.html' frameborder='0' seamless=''></iframe>"||"";
        html += "\n            </div>";
        html += "\n        </div>";
        html += "\n    </div>";
        // html += "\n</div>";
        /**
         * 业务导向div存储
         */
        var bodyObj = $(html);
				this.appDivMap[appId]={
						bgLogo:bodyObj.find("#bg_logo"),
						contentMain:bodyObj.find('#contentMain')
					}
        return bodyObj;
    };
    /**
     * 自定义模块初始化
     * @param div 自定义div
     */
	Newtec.App.prototype.setInitLogo = function (div) {
			var bgLogo= this.bgLogo;
			bgLogo.empty();
			bgLogo.append(div)
	}
	/**
	 * 设置业务导向默认图片路径
	 */
	Newtec.App.prototype.setLogoImgUrl = function (src,crrTabId) {
			var divJson=this.appDivMap[Newtec.Person.get().app.id]
			var bgLogo= divJson.bgLogo;
			crrTabId=crrTabId|| this.getCrrTabId()
			if(src){
				this.logoImg[crrTabId]=src;
			}else{
				src=this.logoImg[crrTabId];
			}
			if(src){
					var that=this;
					bgLogo.css("display","");
					bgLogo.find("img").attr('src',src);
					setTimeout(function(){
						var h=bgLogo.outerHeight();
						divJson.contentMain.css("height","calc(100% - "+(h+40)+"px)")
					},50)
					
					
			}else{
				divJson.contentMain.css("height","calc(100% - 40px)")
				bgLogo.css("display","none");
			}
			
			
	}
	/**
	 * 获取当前tabid
	 * @returns tabId
	 */
	Newtec.App.prototype.getCrrTabId=function(){
		var appId = Newtec.Person.get().app.id;
		var jq=$('#' + appId + ' .J_menuTab.active');
		return jq[0]&&jq.attr("id")||null;
	}
    //========================================
    //=====菜单以及选项卡相关代码 start
    //========================================

    /**
     * 绑定contabs事件
     * @param appId
     * @param mainUrl
     */
    Newtec.App.prototype.initContabs = function (appId, mainUrl) {
        var appThis = this,defaults=this.defaults;
        console.info("--appId",appId);
        //左侧菜单点击事件
        $('#' + appId).on('click', '.J_menuItem', function () {
            var menuId = $(this).attr('id'),//左侧菜单获取的Node的id值
                menuName = $.trim($(this).text());
            appThis.addContabs(menuName, menuId, appId, 'create by menu clicked');
            scrollToTab($('#' + appId + ' .J_menuTab.active'));
            return false;
        });
        $('#' + appId).on('click', '.J_menuItem_min', function () {
            console.log('min', this);
            var menuId = $(this).attr('id'),//左侧菜单获取的Node的id值
                menuName = $.trim($(this).text());
            if (Newtec.Utils.isNull(menuName)) {
                menuName = $.trim($(this).data('title'));
            }
            appThis.addContabs(menuName, menuId, appId, 'create by menu-min clicked');
            // scrollToTab($('#' + appId + ' .J_menuTab_min.active'));
            return false;
        });

        //选项卡点击事件
        $('#' + appId + ' .J_menuTabs').on('click', '.J_menuTab', function () {
            if (!$(this).hasClass('active')) {
                var currentTabId = $(this).attr('id'),
                    showIframeName = currentTabId.replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
                //显示tab对应的内容区
                $('#' + appId + ' .J_mainContent .J_iframe').each(function () {
                    if ($(this).attr('name') == showIframeName) {
                        $(this).addClass('active').show().siblings('.J_iframe').removeClass('active').hide();
                        return false;
                    }
                });
                $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                scrollToTab(this);
                var pageId=$(this).attr('data-id');
                appThis.menuNewtec[appId].setSelected(pageId);
                appThis.setLogoImgUrl(null,currentTabId)
                appThis.menuNewtec[appId].setSelected(pageId);
                
            }
        });
        var rightMenuJQ= this.rightMenuJQ
        if(defaults.showRightMenu)
	        $('#' + appId).on('contextmenu','.J_menuTabs .J_menuTab',function(e){
	        	console.info("===,<<<",e);
	        	var y=e.clientY,x=e.clientX;
	        	rightMenuJQ.css({display:'block',top:y+10,left:x});
	        	return false;
	        });
        //选项卡关闭事件
        $('#' + appId + ' .J_menuTabs').on('click', '.J_menuTab i.fa-times', function () {
            var thisTab = $(this).parent('.J_menuTab');
            var currentWidth =thisTab.width();
            var closeTabId = thisTab.attr('id'),
                closeMenuId = closeTabId.replace(Newtec.App.config.prefix.tab, ''),
                closeIframeName = closeTabId.replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
            //移除当前选项卡
            var prevTab=thisTab.prev();
            thisTab.remove();
            //移除tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).attr('name') == closeIframeName) {
                    $(this).remove();
                }
            });
            //显示首页选项卡
            var homePageTabId = prevTab.attr("data-id"),
                homePageIframeId = Newtec.App.config.prefix.iframe + appThis.convertMenuId(homePageTabId);
            $('#' + appId + " .J_menuTab").removeClass('active');
            prevTab.addClass('active');
            $('iframe[name=' + homePageIframeId + ']').show();
            appThis.setLogoImgUrl();
            //显示首页对应的内容区
            return false;
        });
        //选项卡刷新事件
        $('#' + appId + ' .J_menuTabs').on('click', '.J_menuTab i.glyphicon-refresh', function () {
        	 var thisTab = $(this).parent('.J_menuTab');
        	 console.info(Newtec.AppUtils.getFrameWin(thisTab.attr('data-id')));
        	 Newtec.AppUtils.getFrameWin("iframe_"+thisTab.attr('data-id')).window.location.reload()
            return false;
        });
        //关闭其他选项卡
        $('#' + appId + ' .J_tabCloseOther').on('click', {appId: appId}, function () {
            $('#' + appId + ' .page-tabs-content').children("[id]").not(":first").not(".active").each(function () {
                var tabId = $(this).attr('id');
                var iframeName = tabId.replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
                $('#' + appId + ' .J_iframe[name="' + iframeName + '"]').remove();
                $(this).remove();
            });
            $('#' + appId + ' .page-tabs-content').css("margin-left", "0");
        });

        //滚动到已激活的选项卡
        $('#' + appId + ' .J_tabShowActive').on('click', {appId: appId}, function () {
            scrollToTab($('#' + appId + ' .J_menuTab.active'));
        });

        //左移按扭
        $('#' + appId + ' .J_tabLeft').on('click', {appId: appId}, scrollTabLeft);

        //右移按扭
        $('#' + appId + ' .J_tabRight').on('click', {appId: appId}, scrollTabRight);

        //关闭全部
        $('#' + appId + ' .J_tabCloseAll').on('click', function () {
            $('#' + appId + ' .page-tabs-content').children("[id]").not(":first").each(function () {
                var tabId = $(this).attr('id');
                var iframeName = tabId.replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
                $('#' + appId + ' .J_iframe[name="' + iframeName + '"]').remove();
                $(this).remove();
            });
            $('#' + appId + ' .page-tabs-content').children("[id]:first").each(function () {
                var tabId = $(this).attr('id');
                var iframeName = tabId.replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
                $('#' + appId + ' .J_iframe[name="' + iframeName + '"]').show();
                $(this).addClass("active");
            });
            $('#' + appId + ' .page-tabs-content').css("margin-left", "0");
            appThis.setLogoImgUrl();
        });

        //计算元素集合的总宽度
        function calSumWidth(elements) {
            var width = 0;
            $(elements).each(function () {
                width += $(this).outerWidth(true);
            });
            return width;
        }

        //滚动到指定选项卡
        function scrollToTab(element) {
            var appId = $(element).closest('.newtec_system').attr('id');
            if (appId == null || appId == '') {
                alert('appId为空');
                return;
            }
            var marginLeftVal = calSumWidth($(element).prevAll()), marginRightVal = calSumWidth($(element).nextAll());
            //可视区域非tab宽度(这部分就是右边那些箭头以及按钮加起来的宽度)
            var tabOuterWidth = calSumWidth($("#" + appId + " .content-tabs").children().not(".J_menuTabs"));
            //可视区域tab宽度
            var visibleWidth = $("#" + appId + " .content-tabs").outerWidth(true) - tabOuterWidth;
            //实际滚动宽度
            var scrollVal = 0;
            if ($("#" + appId + " .page-tabs-content").outerWidth() < visibleWidth) {
                scrollVal = 0;
            } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
                if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                    scrollVal = marginLeftVal;
                    var tabElement = element;
                    while ((scrollVal - $(tabElement).outerWidth()) > ($("#" + appId + " .page-tabs-content").outerWidth() - visibleWidth)) {
                        scrollVal -= $(tabElement).prev().outerWidth();
                        tabElement = $(tabElement).prev();
                    }
                }
            } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
                scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
            }
            $('#' + appId + ' .page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        }

        //查看左侧隐藏的选项卡
        function scrollTabLeft() {
            var marginLeftVal = Math.abs(parseInt($('#' + appId + ' .page-tabs-content').css('margin-left')));
            //可视区域非tab宽度
            var tabOuterWidth = calSumWidth($("#" + appId + " .content-tabs").children().not(".J_menuTabs"));
            //可视区域tab宽度
            var visibleWidth = $("#" + appId + " .content-tabs").outerWidth(true) - tabOuterWidth;
            //实际滚动宽度
            var scrollVal = 0;
            if ($("#" + appId + " .page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $("#" + appId + " .J_menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                if (calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                    while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                        offsetVal += $(tabElement).outerWidth(true);
                        tabElement = $(tabElement).prev();
                    }
                    scrollVal = calSumWidth($(tabElement).prevAll());
                }
            }
            $('#' + appId + ' .page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        }

        //查看右侧隐藏的选项卡
        function scrollTabRight() {
            var marginLeftVal = Math.abs(parseInt($('#' + appId + ' .page-tabs-content').css('margin-left')));
            //可视区域非tab宽度
            var tabOuterWidth = calSumWidth($("#" + appId + " .content-tabs").children().not(".J_menuTabs"));
            //可视区域tab宽度
            var visibleWidth = $("#" + appId + " .content-tabs").outerWidth(true) - tabOuterWidth;
            //实际滚动宽度
            var scrollVal = 0;
            if ($("#" + appId + " .page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $("#" + appId + " .J_menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                scrollVal = calSumWidth($(tabElement).prevAll());
                if (scrollVal > 0) {
                    $('#' + appId + ' .page-tabs-content').animate({
                        marginLeft: 0 - scrollVal + 'px'
                    }, "fast");
                }
            }
        }
    };

    /**
     * 添加contabs
     * @param menuName 菜单名称
     * @param menuId 菜单id，可空，为空时使用随机数
     * @param appId 应用id，对应的应用必须已经打开，可空
     * @param additional 附加数据，会增加在选项卡以及iframe增加属性data-additional保存该数据，可空
     * @param type 类型 为true时增加data-type='page'，可空
     */
    Newtec.App.prototype.addContabs = function (menuName, menuId, appId, additional, type,isClear) {
        if (Newtec.Utils.isNull(menuId)) {
            menuId = Newtec.Utils.uuid16();
        }else{
        	if(isClear){
//        		menuId=menuId.replaceAll('//','_');
        		 var newMenuId = this.convertMenuId(menuId);
           	 var thisTab = $('#tab_'+newMenuId);
                var closeIframeName = "iframe_"+newMenuId.replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
                //移除当前选项卡
                thisTab.remove();
                //移除tab对应的内容区
                $('.J_mainContent .J_iframe').each(function () {
                	console.info($(this).attr('name')+"==>>"+closeIframeName)
                    if ($(this).attr('name') == closeIframeName) {
                        $(this).remove();
                    }
                });
           }
        }
        
        if (Newtec.Utils.isNull(appId)) {
            var person = Newtec.Person.get();
            appId = person.app.id;
        }
        if (Newtec.Utils.isNull(type)) {
            type = false;
        }
        var appThis = this;
        var newMenuId = this.convertMenuId(menuId);

        var iframeName = Newtec.App.config.prefix.iframe + newMenuId,
            tabId = Newtec.App.config.prefix.tab + newMenuId,
            flag = true;
        if (menuId == undefined || $.trim(menuId).length == 0) {
            return;
        }
        this.setLogoImgUrl(null,tabId);
        //通过遍历.J_menuTab，判断选项卡菜单是否存在
        $('#' + appId + ' .J_menuTab').each(function () {
            if ($(this).attr('id') == tabId) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('#' + appId + ' .J_menuTab').removeClass('active');//更改焦点tab
                    // scrollToTab(this);
                    //显示tab对应的内容区
                    $('#' + appId + ' .J_mainContent .J_iframe').each(function () {
                        if ($(this).attr('name') == iframeName) {
                            // if (this.contentWindow.onfocus) {
                            // this.contentWindow.onfocus('父页面传过来的参数xxxxxxxxxxxxx');
                            // }
                            $(this).show().siblings('.J_iframe').hide();
                            return;
                        }
                    });
                }
                flag = false;
            }
        });
        //选项卡菜单不存在
        if (flag) {
            //构建新选项卡
        	var pageId=menuId.replaceAll("\\\\",'/')
            var iframe_src = 'PageServlet?p=' + pageId + '&' + new Date().getTime();
            var type_str = "";
            if (type == true) {
                type_str = " data-type='page' ";
                iframe_src += '&page=page';
            }
            var additional_str = "";
            if (!Newtec.Utils.isNull(additional)) {
                additional_str = " data-additional='" + additional + "'";
            }
            var str =this.getTabItemHtml(tabId,menuId,additional_str,menuName);
            var str1 = '<iframe style="padding:5px;" class="J_iframe active" ' + additional_str + type_str + ' data-id="' + menuId + '" name="' + iframeName + '" width="100%" height="100%" src="' + iframe_src + '" frameborder="0" seamless></iframe>';
            $('#' + appId + ' .J_menuTab').removeClass('active');
            //添加iframe
            var iframeJQ = $(str1);
            var mainContent=$('#' + appId + ' .J_mainContent');
            mainContent.find('iframe.J_iframe').removeClass('active').hide();
            mainContent.append(iframeJQ);
            iframeJQ.bind('load', function () {
                iframeJQ.unbind('load');
            });
            //添加选项卡
            var newTab = $(str);
            $('#' + appId + ' .J_menuTabs .page-tabs-content').append(newTab);
            // scrollToTab($('#' + appId + ' .J_menuTab.active'));

            var appData = appThis.app[appId];
        }
        
    };
    Newtec.App.prototype.getTabItemHtml=function(tabId,menuId,additional_str,menuName){
    	 return '<a href="javascript:;" class="active J_menuTab" id="' + tabId + '" data-id="' + menuId + '" ' + additional_str + '>' + menuName + ' <i class="glyphicon glyphicon-refresh" style="visibility: hidden;font-size: 12px;margin:0 2px;"></i> <i class="fa fa-times" style="visibility: hidden;"></i></a>';
    }
    /**
     * 关闭选项卡
     * @param menuId 菜单id，可空，默认使用当前选项卡
     * @param appId 应用id，可空，默认使用当前打开的应用，非当前应用使用需要加上appId
     */
    Newtec.App.prototype.closeContab = function (menuId, appId) {
        if (Newtec.Utils.isNull(appId)) {
            var person = Newtec.Person.get();
            appId = person.app.id;
        }
        var thisTab = undefined;
        var closeIframeName = '';
        if (Newtec.Utils.isNull(menuId)) {
            $('#' + appId + ' .J_menuTab').each(function () {
                var $this = $(this);
                if ($this.hasClass('active')) {
                    closeIframeName = $this.attr('id').replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
                    thisTab = $this;
                }
            });
        } else {
            thisTab = $('#' + appId + ' #' + Newtec.App.config.prefix.tab + menuId);
            closeIframeName = Newtec.App.config.prefix.iframe + menuId;
        }
        //移除当前选项卡
        thisTab.remove();
        //移除tab对应的内容区
        $('.J_mainContent .J_iframe').each(function () {
            if ($(this).attr('name') == closeIframeName) {
                $(this).remove();
            }
        });
        this.setLogoImgUrl();
    };

    /**
     * 设置选项卡附加数据
     * @param additional 数据
     * @param menuId 菜单id，可空，默认使用当前选项卡
     * @param appId 应用id，可空，默认使用当前打开的应用，非当前应用使用需要加上appId
     */
    Newtec.App.prototype.setContabData = function (additional, menuId, appId) {
        if (Newtec.Utils.isNull(appId)) {
            var person = Newtec.Person.get();
            appId = person.app.id;
        }
        var thisTab = undefined;
        if (Newtec.Utils.isNull(menuId)) {
            $('#' + appId + ' .J_menuTab').each(function () {
                var $this = $(this);
                if ($this.hasClass('active')) {
                    thisTab = $this;
                }
            });
        } else {
            var tabId = Newtec.App.config.prefix.tab + menuId;
            var iframeName = Newtec.App.config.prefix.iframe + menuId;
            thisTab = $('#' + appId + ' #' + tabId, parent.document);
        }
        // thisTab.data('additional', additional);
        // thisIframe.data('additional', additional);
        // 关于这里没使用data进行赋值，原因请看http://www.cnblogs.com/52cik/p/jquery-data.html
        thisTab.attr('data-additional', additional);
    };

    /**
     * 获取选项卡附加数据
     * @param menuId 菜单id，可空，默认使用当前选项卡
     * @param appId 应用id，可空，默认使用当前打开的应用，非当前应用使用需要加上appId
     */
    Newtec.App.prototype.getContabData = function (menuId, appId) {
        var thisTab = undefined;
        if (Newtec.Utils.isNull(appId)) {
            var person = Newtec.Person.get();
            appId = person.app.id;
        }
        if (Newtec.Utils.isNull(menuId)) {
            $('#' + appId + ' .J_menuTab').each(function () {
                var $this = $(this);
                if ($this.hasClass('active')) {
                    thisTab = $this;
                }
            });
        } else {
            var tabId = Newtec.App.config.prefix.tab + menuId;
            var iframeName = Newtec.App.config.prefix.iframe + menuId;
            thisTab = $('#' + appId + ' #' + tabId, parent.document);
        }
        var additional = thisTab.attr('data-additional');
        return additional;
    };

    /**
     * 转换menuId，在添加选项卡时使用
     * @param menuId
     * @returns {string}
     */
    Newtec.App.prototype.convertMenuId = function (menuId) {
        var newId = menuId.replace('\\', '_').replace('/', '_').replace('.', '_');
        return newId;
    };

    /**
     * 获取应用选中的选项卡id，即创建contab时提供的menuId
     * @param appId 应用id，可空，默认使用当前打开的应用，非当前应用使用需要加上appId
     * @returns {string}
     */
    Newtec.App.prototype.getMenuId = function (appId) {
        if (Newtec.Utils.isNull(appId)) {
            var person = Newtec.Person.get();
            appId = person.app.id;
        }
        var thisTab = undefined;
        var menuId = '';
        $('#' + appId + ' .J_menuTab').each(function () {
            var $this = $(this);
            if ($this.hasClass('active')) {
                thisTab = $this;
                menuId = thisTab.data('id');
            }
        });
        return menuId;
    };

    /**
     * 获取当前应用已打开的所有选项卡列表
     * @param appId 应用id，可空，默认使用当前打开的应用，非当前应用使用需要加上appId
     * @returns {{}} 返回K-V形式的数据，key为你构建这个contab时提供的menuId，value为json数据
     */
    Newtec.App.prototype.getContabList = function (appId) {
        if (Newtec.Utils.isNull(appId)) {
            var person = Newtec.Person.get();
            appId = person.app.id;
        }
        var list = {};
        $('#' + appId + ' .J_menuTab').each(function () {
            var $this = $(this);
            var id = $this.attr('id');
            var dataId = $this.data('id');
            var show = false;
            if ($this.hasClass('active')) {
                show = true;
            }
            var iframeName = id.replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
            var iframe = $('#' + appId + ' .J_iframe[name="' + iframeName + '"]');
            var a = {
                'id': id,
                'data-id': dataId,
                'show': show,
                'tab': $this,
                'iframe': iframe
            };
            list[dataId] = a;
        });
        return list;
    };

    //========================================
    //=====菜单以及选项卡相关代码 end
    //========================================

    /**
     * 登录
     * @author 曾文杰
     */
    Newtec.App.prototype.login = function (username, password) {
        if (Newtec.Utils.isNull(this.ds)) {
            alert('请提供数据源');
            return;
        }
        this.ds.fetchData({
            login: false,
            operId: 'loginId',
            data: {userName: username, password: password},
            callback: function (response) {
                if (response.status == 0) {
                    var person = response.data[0];
                    window.location.href = "IndexPageServlet";
                } else {
                    Newtec.Window.createHint({html: "用户名或密码错误！", className: 'btn btn-danger'});
                }
            }
        });
    };

    Newtec.App.prototype.finsh = function () {
        Newtec.app = this;
		document.title=AppParam.application&&AppParam.application.pageHint;
        //选项卡的关闭按钮显隐控制
        $(document).on('mouseenter', '.J_menuTab', function () {
            var $this = $(this);
            // $this.find('i').show();
            $this.find('i').css('visibility', 'visible');
        });
        $(document).on('mouseleave', '.J_menuTab', function () {
            var $this = $(this);
            // $this.find('i').hide();
            $this.find('i').css('visibility', 'hidden');
        });

        //左侧菜单折叠按钮显隐控制
        $(document).on('mouseenter', '.lt', function () {
            var $this = $(this);
            // $this.find('i').show();
            $('.menu-toggle').css('visibility', 'visible');
        });
        $(document).on('mouseleave', '.lt', function () {
            $('.menu-toggle').css('visibility', 'hidden');
        });

        //头部收缩功能
        $(document).on('click', '#switchHeadType', function () {
            var a = $(this);
            // var icon = a.find('span');
            // var icon1 = icon.data('icon1');
            // var icon2 = icon.data('icon2');
            // icon.toggleClass(icon1).toggleClass(icon2);
            var img = $(this).find('img');
            var img1 = img.data('img1');
            var img2 = img.data('img2');
            var curImg = img.attr('src');
            if (curImg == img1) {
                img.attr('src', img2);
            } else {
                img.attr('src', img1);
            }

            $('#min-logout-link').toggle('fast');

            $('#navbar-container').toggle('fast');

            var c = $('#main');
            var top = c.css('top');
            if (top == '83px') {
                top = '45px';
            } else {
                top = '83px';
            }
            c.css('top', top);
        });
        var newtecJQ=this.newtecJQ;
        var that=this;
        newtecJQ.on('click','#closeOrOpen',function(){
        	 var person = Newtec.Person.get();
             appId = person.app.id;
        	var jq=$(this),imgJQ=jq.find('img');
        	var menuJQ=$('#' + appId + ' .menu-min');
        	var nemu=newtecJQ.find('.newtec_system.active');
        	if(nemu.attr("data")=="close"){//展开
        		jq.attr("data","open")
        		imgJQ.attr('src',serverUrl+'myqdp/images/icon/close.png')
        		imgJQ.attr('title','点击收起菜单');
        		newtecJQ.find('.newtec_system.active').removeClass('min-menu');
        	}else{//收起
        		newtecJQ.find('.newtec_system.active').addClass('min-menu');
        		imgJQ.attr('src',serverUrl+'myqdp/images/icon/open.png')
        		jq.attr("data","close")
        		imgJQ.attr('title','点击展开菜单');
        		
        	}
        	
        	menuJQ.toggle('fast');
            if (Newtec.Utils.isNewtec(that.app[appId].menu)) {
                that.app[appId].menu.newtecJQ.toggle('fast');
            } else {
                that.app[appId].menu.toggle('fast');
            }
        });
        //右键菜单
        var rightMenuJQ= this.rightMenuJQ=$(_getRigthMenuHtml())
        $('body').append(rightMenuJQ)
        rightMenuJQ.on('click','')
        $(document).click(function(){
        	rightMenuJQ.css('display',"");
        })
    };
    Newtec.App.prototype.childClick=function(e){
    	this.rightMenuJQ.css('display',"");
    }
    Newtec.App.prototype.setChildDom=function(cDom,pageThis){
    	var that=this;
    	var cDomJQ=$(cDom);
    	cDomJQ.click(function(){
    		that.childClick();
        })
       var menuId=this.getMenuId();
       this.childBodys[menuId]=cDomJQ.find("body");
    }
    Newtec.App.get = function () {
        return parent.Newtec.app;
    };

    /**
     * 内部使用方法
     */
    var inside = {
        getDom: function (arr, withRoot) {
            var html = "<ul class='nav nav-list'>\n";

            if (withRoot) {
                html += this.initDom(arr)
            } else {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].children) {
                        html += this.initDom(arr[i].children);
                    }
                }
            }

            html += "</ul>\n";

            // 收缩按钮
            // html += "<div class='sidebar-toggle sidebar-collapse' id='sidebar-collapse' style='position:absolute;top:50%;right:0;border:1px solid #666;'><i style='background: none; border: none;' id='sidebar-toggle-icon' class='ace-icon glyphicon glyphicon-chevron-left ace-save-state' data-icon1='ace-icon glyphicon glyphicon-chevron-left' data-icon2='ace-icon glyphicon glyphicon-chevron-right'></i></div>"

            return html;
        },
        initDom: function (arr) {
            var html = "";

            for (var i = 0; i < arr.length; i++) {
                var node = arr[i];
                if (node.children) {
                    //有叶子
                    html += "<li class=''><a href='' class='dropdown-toggle' style=''><i class='menu-icon glyphicon glyphicon-cog'></i><span class='menu-text'>" + node.name + "</span><b class='arrow fa fa-angle-down'></b></a>\n";
                    html += "<ul class='submenu'>\n";
                    html += this.initDom(node.children);
                    html += "</ul>\n";
                    html += "</li>\n";
                } else {
                    //无叶子
                    html += "<li><a class='J_menuItem' id='" + node.id + "' href='#' style='padding-left:0;margin-left:37px;' ><i class='menu-icon fa null'></i><span class='menu-text'>" + node.name + "</span></a></li>\n";
                }
            }

            return html;
        },

        transformTozTreeFormat: function (setting, sNodes) {
//            var sNodes = [];
//            for (k in map) {//这里讲Map转化成数组，后期文杰处理
//                sNodes.push(map[k]);
//            }
            var i, l,
                key = setting.idKey,
                parentKey = setting.parentKey,
                childKey = setting.childKey;
            if (!key || key == "" || !sNodes) return [];
            sNodes.sort(function(a,b){
            	return a.sort-b.sort;
            })
            var r = [];
            var tmpMap = {};
            for (i = 0, l = sNodes.length; i < l; i++) {
                tmpMap[sNodes[i][key]] = sNodes[i];
            }
            for (i = 0, l = sNodes.length; i < l; i++) {
                if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
                    if (!tmpMap[sNodes[i][parentKey]][childKey]) {
                        tmpMap[sNodes[i][parentKey]][childKey] = [];
                    }
                    tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
                } else {
                    r.push(sNodes[i]);
                }
            }
            return r;
        },
        transData: function (a, idStr, pidStr, chindrenStr) {
            var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
            for (; i < len; i++) {
                hash[a[i][id]] = a[i];
            }
            for (; j < len; j++) {
                var aVal = a[j], hashVP = hash[aVal[pid]];
                if (hashVP) {
                    !hashVP[children] && (hashVP[children] = []);
                    hashVP[children].push(aVal);
                } else {
                    r.push(aVal);
                }
            }
            return r;
        },

        /**
         * 将hex的颜色值变成RGB数组
         * @param sColor hex方式的颜色值，前面带上'#'
         * @returns {*} 返回RGB数组，请自行拼成rgb(r, g, b)
         */
        convertHex2RGB: function (sColor) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var sColor = sColor.toLowerCase();
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                var sColorChange = [];
                for (var i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return sColorChange;
            } else {
                return sColor;
            }
        },
        /**
         * 生成一个rgb颜色，按照一定计算
         * @param sColor convertHex2RGB()里面生成数组
         * @returns {string} rgb颜色值
         */
        generateRGB: function (sColor) {
            var r = parseInt(sColor[0] * 1.5), g = parseInt(sColor[1] * 1.5), b = parseInt(sColor[2] * 1.5);
            r = r > 255 ? 255 : r;
            g = g > 255 ? 255 : g;
            b = b > 255 ? 255 : b;
            var rgbColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            return rgbColor;
        }
    };

    /**
     * 外部使用方法
     */
    var outside = {
        /**
         * 修改 css link 链接
         * @param originCssId 原始 css id
         * @param newCssHref 新 css 链接
         */
        changeCssHref: function (originCssId, newCssHref) {
            //TODO 通过ID值查找，然后修改掉href值
        },
        /**
         * 切换字体大小，字体配置在 Newtec.App.config.fontSize
         * @param fontSizeType
         */
        changeFontSizeType: function (fontSizeType) {
            var fontSize = Newtec.App.config.fontSize[fontSizeType];
            alert(fontSize);
            $('body').css('font-size', fontSize);
        },
        /**
         * 切换字体大小
         * @param fontSize 字体大小
         */
        changeFontSize: function (fontSize) {
            $('body').css('font-size', fontSize);
        },
        /**
         * 切换窗口宽度
         * @param width
         */
        changeBodyWidth: function (width) {
            $('body').css('width', width);
        },
        jsonTree: function (data, config) {
            var id = config.id || 'id',
                pid = config.pid || 'pid',
                children = config.children || 'children';
            var idMap = {},
                jsonTree = [];
            for (var i = 0; i < data.length; i++) {
                var v = data[i];
                idMap[v[id]] = v;
            }
            for (var i = 0; i < data.length; i++) {
                var v = data[i];
                var parent = idMap[v[pid]];
                if (parent) {
                    !parent[children] && (parent[children] = []);
                    // console.log('1', v.name);
                    parent[children].push(v);
                } else {
                    jsonTree.push(v);
                    // console.log('2', v.name);
                }
                // console.log(JSON.stringify(jsonTree, null, '\t'));
            }
            return {data: jsonTree};
        }
    };
    function _getRigthMenuHtml(){
    	return '<ul role="menu" class="dropdown-menu dropdown-right-menu">'+
    			  '<li data="refer"><a>刷新</a>'+
    			  '</li>'+
			      '<li data="close"><a>关闭</a>'+
			      '</li>'+
			      '</li>'+
			      '<li data="other"><a>关闭其他</a>'+
			      '</li>'+
			      '<li data="left"><a>关闭左侧</a>'+
			      '</li>'+
			      '<li data="right"><a>关闭右侧</a>'+
			      '</li>'+
			      '<li class="divider"></li>'+
			      '<li data="all"><a>关闭全部</a>'+
			  '</ul>';
    }
    $.extend(Newtec.App, outside);
})();