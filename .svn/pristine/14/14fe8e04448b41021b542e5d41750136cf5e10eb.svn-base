/**
 * 平台构建
 * TODO 1.提供底色;2.顶部收缩;3.左侧parent图标显示
 * @author 曾文杰
 */
(function () {
    Newtec.App = function (params) {
        this.defaults = {
        		applicationTitle:"信息资源综合管理服务系统"
            //scroll:false
        };

        $.extend(this.defaults, params, {});

        this.ds = new Newtec.DS('person');
        //存放已经加载的应用信息
        this.app = {};
    };
    Newtec.App.exte(Newtec.Base, 'app');
    Newtec.App.over({
        createNewtecJQ: function () {
            this.fetchData();
            return $(this.defaults.appendTo);
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
            console.log('调用Newtec.App.config.getSkinConfig()');
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
         * 设置选项卡的颜色
         * @param skinName skin名称，具体查看Newtec.App.config.skin
         */
        setTab: function (skinName) {
            var c = Newtec.App.config.getSkinConfig('tab');
            console.log('调用Newtec.App.config.setTab()', c);
            var nod = document.createElement("style"), str = "" +
                ".page-tabs a.active {background-color:" + c.selectedBackgroundColor + ";color:" + c.fontColor + "}" +
                ".page-tabs a{background-color:" + c.unSelectBackgroundColor + ";color:" + c.fontColor + "}" +
                "nav.page-tabs{background-color:" + c.unSelectBackgroundColor + ";}";
            nod.type = "text/css";
            if (nod.styleSheet) {
                nod.styleSheet.cssText = str;
            } else {
                nod.innerHTML = str;
            }
            document.getElementsByTagName("head")[0].appendChild(nod);
        },
        /**
         * 设置背景颜色
         * @param startColor
         * @param endColor
         */
        setBackgroundColor: function (startColor, endColor) {
            console.log('调用Newtec.App.config.setBackgroundColor()', startColor, endColor);
            //修改头部
            $('#topNav').css({
                'background-color': startColor,
                'background-image': '-o-linear-gradient(left, ' + endColor + ' 0%, ' + startColor + ' 100%)',
                'background-image': '-moz-linear-gradient(left, ' + endColor + ' 0%, ' + startColor + ' 100%)',
                'background-image': '-webkit-linear-gradient(left, ' + endColor + ' 0%, ' + startColor + ' 100%)',
                'background-image': '-ms-linear-gradient(left, ' + endColor + ' 0%, ' + startColor + ' 100%)',
                'background-image': 'linear-gradient(to left, ' + endColor + ' 0%, ' + startColor + ' 100%)'
            });
            //修改底部
            $('#bottomNav').css({
                'background-color': startColor,
                'background-image': '-o-linear-gradient(left, ' + endColor + ' 0%, ' + startColor + ' 100%)',
                'background-image': '-moz-linear-gradient(left, ' + endColor + ' 0%, ' + startColor + ' 100%)',
                'background-image': '-webkit-linear-gradient(left, ' + endColor + ' 0%, ' + startColor + ' 100%)',
                'background-image': '-ms-linear-gradient(left, ' + endColor + ' 0%, ' + startColor + ' 100%)',
                'background-image': 'linear-gradient(to left, ' + endColor + ' 0%, ' + startColor + ' 100%)'
            });
        },
        /**
         * 设置左侧菜单的颜色
         * @param startColor
         * @param endColor
         */
        setMenuBackgroundColor: function (startColor, endColor) {
            console.log('调用Newtec.App.config.setMenuBackgroundColor()', startColor, endColor);
            //修改左侧菜单
            $('.lt').css('background-color', startColor);
            Newtec.App.config.skin[Newtec.App.config.skinCurrent].menu.unSelectBackgroundColor = startColor;
            //修改菜单内部
            for (var key in Newtec.App.appList) {
                var menu = Newtec.App.appList[key].menu;
                if (!Newtec.Utils.isNull(menu)) {
                    menu.changeColor('', '', startColor, '#fff');
                }
            }
            $('.menu-min > li').css('background-color', startColor);
            $('.menu-min').css('background-color', startColor);
            $('.menu-min .sub').css('background-color', endColor);
            $('.menu-min .sub li').css('background-color', endColor);
            $('.menu-min li').unbind('hover');
            $('.menu-min > li').hover(function () {
                $(this).css('background-color', endColor);
            }, function () {
                $(this).css('background-color', startColor);
            });

            /*$('.menu-min .sub > li').hover(function () {
                $(this).css('background-color', startColor);
            }, function () {
                $(this).css('background-color', endColor);
            });*/
        },
        /**
         * 设置skin
         * @param skinName
         */
        setSkin: function (skinName) {
            console.log('调用Newtec.App.config.setSkin()', skinName);
            if (Newtec.Utils.isNull(skinName)) {
                skinName = Newtec.App.config.skinCurrent ? Newtec.App.config.skinCurrent : 'default';
            }
            Newtec.App.config.skinCurrent = skinName;
            if (Newtec.Utils.isNull(skinName)) {
                skinName = 'default';
            }
            var skinConfig = Newtec.App.config.skin[skinName];
            if (Newtec.Utils.isNull(skinConfig)) {
                skinConfig = Newtec.App.config.skin['default'];
            }
            Newtec.App.config.setBackgroundColor(skinConfig.nav.darkBackgroundColor, skinConfig.nav.lightBackgroundColor);
            Newtec.App.config.setMenuBackgroundColor(skinConfig.nav.darkBackgroundColor, skinConfig.nav.lightBackgroundColor);
            Newtec.App.config.setTab(skinName);
            // $('iframe').contents().css('background', '#f00');
//            var frame = window.frameElement;
            var This=this;
            var table=skinConfig['table'];
            $('iframe').each(function(index,element){
            	var frame =  Newtec.AppUtils.getFrameWin($(this).attr("name"));
            	var document=$(frame.document);
            	This.changeSkin(".skin", skinConfig, document);
            	
            });
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
        	'default': {
        		title: '默认',
        		app: {
        			bgColor:'#fff'
        		},
        		nav: {
        			//从左到右颜色渐变
        			darkBackgroundColor: '#3f6186',//左
        			lightBackgroundColor: '#385e88'//右
        		},
        		menu: {
        			selectedBackgroundColor: '#fff',//背景色
        			unSelectBackgroundColor: '#385e88',//选中
        		},
        		tab: {
        			selectedBackgroundColor: '#fff',//选中
        			unSelectBackgroundColor: '#e8ebf3',//未选中
        			fontSize: '14px',
        			fontColor: '#000'
        		},
        		table: {
//                   claName:'skin_table',
//                   top_claName:'', 
        			nav:"background:#e8ebf3;",
        			head:"background:#e8ebf3;color:#707070;",
        			foot:"background:#e8ebf3;",
        			selected:"background:rgb(191, 205, 245);"
        		}
        	},
        	'default1': {
                title: '默认',
                app: {
                    bgColor:'#fff'
                },
                nav: {
                    //从左到右颜色渐变
                    darkBackgroundColor: '#3e2c2c',//左
                    lightBackgroundColor: '#0e0e0e'//右
                },
                menu: {
                    selectedBackgroundColor: '#909cea',//背景色
                    unSelectBackgroundColor: '#6cb5fd',//选中
                },
                tab: {
                    selectedBackgroundColor: '#fff',//选中
                    unSelectBackgroundColor: '#e8ebf3',//未选中
                    fontSize: '14px',
                    fontColor: '#000'
                },
                table: {
//                   claName:'skin_table',
//                   top_claName:'', 
                    nav:"background:#e8ebf3;",
                    head:"background:#e8ebf3;color:#707070;",
                    foot:"background:#e8ebf3;",
                    selected:"background:rgb(191, 205, 245);"
                }
            },
            'default2': {
                title: '默认',
                app: {
                    bgColor:'#fff'
                },
                nav: {
                    //从左到右颜色渐变
                    darkBackgroundColor: '#429f53',//左
                    lightBackgroundColor: '#347b41'//右
                },
                menu: {
                    selectedBackgroundColor: '#fff',//背景色
                    unSelectBackgroundColor: '#429f53'//选中
                },
                tab: {
                    selectedBackgroundColor: '#fff',//选中
                    unSelectBackgroundColor: '#e8ebf3',//未选中
                    fontSize: '14px',
                    fontColor: '#000'
                },
                table: {
//                   claName:'skin_table',
//                   top_claName:'', 
                    nav:"background:#e8ebf3;",
                    head:"background:#e8ebf3;color:#707070;",
                    foot:"background:#e8ebf3;",
                    selected:"background:rgb(191, 205, 245);"
                }
            },
            red: {
                title: '红色',
                app: {},
                nav: {
                    darkBackgroundColor: '#c43c26',
                    lightBackgroundColor: '#f66e58'
                },
                menu: {
                    selectedBackgroundColor: '#fff',//背景色
                    unSelectBackgroundColor: '#c43c26'//选中
                },
                tab: {
                    selectedBackgroundColor: '#fff',//选中
                    unSelectBackgroundColor: '#e8ebf3',//未选中
                    fontSize: '14px',
                    fontColor: '#000'
                },
                table: {
                	claName:'skin_table',
                	nav:"background:red;",
                	head:"background:red;color:white;",
                	foot:"background:red;",
                	selected:"background:red;"
                }
            },
            brown: {
                title: '棕色',
                app: {},
                nav: {
                    darkBackgroundColor: '#806047',
                    lightBackgroundColor: '#b29279'
                },
                menu: {
                    selectedBackgroundColor: '#fff',//背景色
                    unSelectBackgroundColor: '#806047'//选中
                },
                tab: {
                    selectedBackgroundColor: '#fff',//选中
                    unSelectBackgroundColor: '#e8ebf3',//未选中
                    fontSize: '14px',
                    fontColor: '#000'
                },
                table: {
                	
                	nav:"background:#806047;",
                	head:"background:#806047;color:white;",
                	foot:"background:#806047;",
                	selected:"background:#806047;"
                }
            }
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
            // 'large': '2rem',
            // 'normal': '1rem',
            // 'small': '0.5rem'
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
        console.log('data', data);
        var topNavData = data.apps;
        this.topNavId = 'nav_top_' + Newtec.Utils.uuid16();//顶部应用导航条对象
        this.topNavAppId = 'nav_top_app_' + Newtec.Utils.uuid16();

        this.newtecJQ.append("<div id='" + this.topNavId + "'></div>");

        var html = "";
        html += "\n<div id='topNav' class='navbar navbar-default ace-save-state " + Newtec.App.config.color.currentColor + "' style='margin-bottom:0'>";
        html += "\n  <div class='navbar-container ace-save-state row' id='navbar-container' style='margin-left: 12px; margin-right: 12px;'>";
        html += "\n    <div class='navbar-header pull-left'>";
        html += "\n      <a href='javascript:;' class='navbar-brand' id='sysTitle'><small><i class='fa fa-leaf'></i>"+this.defaults.applicationTitle+"</small></a>";
        html += "\n    </div>";
        html += "\n    <div class='navbar-buttons navbar-header pull-right' role='navigation'>";
        // html += "\n      <a href='LogoutServlet' style='background-color: transparent;color:#fff; height:40px;line-height:40px;margin-right:8px;' class='roll-nav roll-right J_tabExit'><i class='glyphicon glyphicon-log-out'></i> 退出</a>";
        html += "\n      <a style='background-color:transparent;color:#fff;height:40px;line-height:40px;margin-right:8px;text-decoration:none;'>当前用户：<span style='color:#fff;'>" + data.name + "</span></a>";
        html += "\n      <a style='background-color:transparent;color:#fff;height:40px;line-height:40px;margin-right:8px;text-decoration:none;'>机构：" + data.depName + "</a>";
        html += "\n      <a style='background-color:transparent;color:#fff;height:40px;line-height:40px;margin-right:8px;text-decoration:none;'>|</a>";
        html += "\n      <a href='LogoutServlet' style='background-color: transparent;color:#fff; height:40px;line-height:40px;margin-right:8px;text-decoration: none;' class='roll-nav roll-right J_tabExit'><i class='glyphicon glyphicon-log-out'></i> 退出</a>";
        html += "\n    </div>";
        html += "\n  </div>";
        html += "\n  <div id='" + this.topNavAppId + "' class='row top-nav2' style='margin-left: 15px; margin-right: 15px; position: relative; height: 41px;'>";
        html += "\n    <ul class='' style='padding-left: 0; position: absolute; top 0; left: 0'>";
//        html += "\n      <li class='active'><a href='javascript:void(0);' data-id='IndexPageServlet' class='topNavTab active' style='outline:0;'>首页</a></li>";
        if (topNavData != undefined) {
            for (var i = 0, l = topNavData.length; i < l; i++) {
                var a = topNavData[i];
                html += "\n      <li><a class='topNavTab "+(i==0?"active":'')+"' style='outline:0;' data-id='" + a.id + "' href='javascript:void(0);'>" + a.name + "</a></li>";
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
        html += "\n      <li style='padding: 5px 5px;' onclick='Newtec.App.changeFontSizeType(\"large\")'><a href='#'>大</a></li>";
        html += "\n      <li style='padding: 5px 5px;' onclick='Newtec.App.changeFontSizeType(\"normal\")'><a href='#'>中</a></li>";
        html += "\n      <li style='padding: 5px 5px;' onclick='Newtec.App.changeFontSizeType(\"small\")'><a href='#'>小</a></li>";
        html += "\n      <li style='padding: 5px;display: none;' id='min-logout-link'><a href='LogoutServlet'><i class='glyphicon glyphicon-log-out'></i></a></li>";
        // html += "\n      <li style='padding: 5px 5px;'><a href='#' id='switchHeadType'><span class='glyphicon glyphicon-chevron-up' data-icon1='glyphicon glyphicon-chevron-up' data-icon2='glyphicon glyphicon-chevron-down'></span></a></li>";
        html += "\n      <li style='padding: 5px 5px;'><a href='#' id='switchHeadType'><img src='myqdp/images/table/chevron-up2.png' alt='' width='12' height='12' data-img1='myqdp/images/table/chevron-up2.png' data-img2='myqdp/images/table/chevron-down2.png'></a></li>";
        html += "\n    </ul>";
        html += "\n  </div>";
        html += "\n</div>";

        this.topNav = $('#' + this.topNavId);
        this.topNav.append($(html));

        var that = this;
        var startHexColor = '#98bf21';
        var endRGBColor = inside.generateRGB(inside.convertHex2RGB(startHexColor));
        // setTimeout(function () {
        //     $('#topNav').css({
        //         'background-color': '#' + startHexColor + '',
        //         'background-image': '-o-linear-gradient(left, ' + endRGBColor + ' 0%, ' + startHexColor + ' 100%)',
        //         'background-image': '-moz-linear-gradient(left, ' + endRGBColor + ' 0%, ' + startHexColor + ' 100%)',
        //         'background-image': '-webkit-linear-gradient(left, ' + endRGBColor + ' 0%, ' + startHexColor + ' 100%)',
        //         'background-image': '-ms-linear-gradient(left, ' + endRGBColor + ' 0%, ' + startHexColor + ' 100%)',
        //         'background-image': 'linear-gradient(to left, ' + endRGBColor + ' 0%, ' + startHexColor + ' 100%)',
        //         '-webkit-box-shadow': 'inset 0 1px 0 ' + endRGBColor,
        //         '-moz-box-shadow': 'inset 0 1px 0 ' + endRGBColor,
        //         'box-shadow': 'inset 0 1px 0 ' + endRGBColor,
        //         'text-shadow': '0 1px 0 ' + endRGBColor
        //     });
        // }, 1000);

        //这里添加平台首页，方便查找
        this.app['IndexPageServlet'] = {};
        Newtec.App.appList['IndexPageServlet'] = {};
        if(topNavData&&topNavData.length>0){
        	that.buildApp(topNavData[0]['id']);
        }
        $('.topNavTab').on('click', function () {
            var appId = $(this).data('id');
            that.buildApp(appId);
            $('.topNavTab').removeClass('active');
            $(this).addClass('active');
        });
    };

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
        html += "\n    <li><a href='javascript:void(0);'><i id='closeOrOpen' title='点击收起菜单' style='z-index: 1086;' class='glyphicon glyphicon-folder-close'></i></a></li>";
        html += "\n  </ul>";
        html +="<p class='foot-copy'>Copyright © 广州粤信科技有限公司</p>";
        html += "\n</div>";

        this.bottomNav = $('#' + this.bottomNavId);//底部快捷方式对象
        this.bottomNav.append($(html));
    };

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
        console.warn('----buildNewApp------'+appId)
        new Newtec.DS("person").fetchData({
            operId: 'toApplication', appId: appId, /*data: {appId: appId},*/ callback: function (response) {
                if (response.status != 0) {
                    alert(response.failureMessage);
                    return;
                }
                Newtec.person = response.data;
                if (Newtec.p == undefined) Newtec.p = {};
                Newtec.p[Newtec.person.app.id] = Newtec.person;//将每次的用户缓存在Newtec.p中，在切换应用时，取缓存的应用需要重设置回Newtec.person
                Newtec.DS.set(response.data.ds);
                var appObj = $("<div class='newtec_system active' style='height:100%;' id='" + appId + "'></div>");
                $('#main').append(appObj);
                var menuObj = that.buildMenu(appId, response.data.nodes, response.data.app.nodeType);
                var bodyObj = that.buildBody(appId, response.data.app.mainUrl);

                //=====left & right=====
                var lt = $("<div class='lt' id='lt_" + appId + "' style='color:#fff;background-color:" + Newtec.App.config.skin[Newtec.App.config.skinCurrent].menu.unSelectBackgroundColor + "'></div>");
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

                // $('#' + appId).append(menuObj);
                // $('#' + appId).append(bodyObj);
                var menuMin = that.buildMinMenu(appId, response.data.nodes, response.data.app.nodeType);
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

                // 给菜单加上滚动条
                // setTimeout(function () {
                    // lt.mCustomScrollbar({
                    //     theme: "minimal-dark",
                    //     scrollInertia: 200
                    // });
                    // var toggle = "<div id='menu-toggle' class='menu-toggle' style='position:absolute;top:50%;right:0;z-index:999999999;'><i style='background: none; border: none;' id='sidebar-toggle-icon' class='ace-icon glyphicon glyphicon-chevron-left ace-save-state' data-icon1='ace-icon glyphicon glyphicon-chevron-left' data-icon2='ace-icon glyphicon glyphicon-chevron-right'></i></div>";
//                    var toggle = "<div id='menu-toggle' class='menu-toggle' style='visibility:hidden;position:absolute;top:50%;right:0;z-index:999999999;'><img src='myqdp/images/table/chevron-left1.png' alt='' width='16' height='16' data-img1='myqdp/images/table/chevron-left1.png' data-img2='myqdp/images/table/chevron-right1.png'></div>";
//                    lt.append($(toggle));
                    Newtec.App.config.setSkin();
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

    /**
     * 构建系统左侧菜单(tree)，供buildMenu()使用
     * @author 曾文杰
     */
    Newtec.App.prototype.buildTreeMenu = function (appId, data, type) {
        console.log('tree menu data', appId, data);
        var appThis = this;
        var treeId = "tree_" + Newtec.Utils.uuid16();
        var treeSetting = {
            // appendTo: "#" + appId + " .lt",
            // appendTo: '#tree-menu-' + appId,
            ds: "node",
            autoFetch: false,
            expand: true,
            showIcon: true,
            showRightMenu: false,
            showCheckbox: false,
            showFunctionButtons: false,
            showFollowButtons: false,
            // expanderTemplate: '<span class="treegrid-expander" style="display:none;"></span>',
            // expanderExpandedClass: 'treegrid-expander-expanded',
            // expanderCollapsedClass: 'treegrid-expander-collapsed',
            expanderTemplate: '<span class="treegrid-expander"></span>',
            // expanderExpandedClass: 'glyphicon glyphicon-minus',
            // expanderCollapsedClass: 'glyphicon glyphicon-plus',
            expanderExpandedClass: 'fa fa-minus',
            expanderCollapsedClass: 'glyphicon glyphicon-plus',
            indentTemplate: '<span class="treegrid-indent"></span>',
            // iconStyle: "height:24px;width:24px;",
            tableStyle: 'min-width:175px;margin-bottom:0;',
            selectedBackgroundColor: Newtec.App.config.skin[Newtec.App.config.skinCurrent].menu.selectedBackgroundColor,
            unSelectBackgroundColor: Newtec.App.config.skin[Newtec.App.config.skinCurrent].menu.unSelectBackgroundColor,
            showBorder: false,
            onClick: function (thisTR) {
            	console.info("---onClick--");
                var menuId = treeNewtecJQ.getNodeId(thisTR);
                console.log('tree', treeNewtecJQ);
                var menuName = $('#text_' + menuId).text();
                var id = treeNewtecJQ.getNodeId(thisTR);
                var a = treeNewtecJQ.treeGridJsonData[id];
                if (Newtec.Utils.isNull(a.pageId) && Newtec.Utils.isNull(a.content)) {
                    return;
                }

                appThis.addContabs(menuName, menuId, appId, 'create by tree menu clicked');
            }
        };
        
//        var treeNewtecJQ = Newtec.TreeGrid.create(treeSetting);
        var treeNewtecJQ=Newtec.Menu.create({click:function(a,that,elJQ){
        	console.info("==>>",a)
        	 if (Newtec.Utils.isNull(a.pageId) && Newtec.Utils.isNull(a.content)) {
                 return;
             }

             appThis.addContabs(a.name, menuId, a.applicationId, 'create by tree menu clicked');
        }});
        var setting = {idKey: 'id', parentKey: 'parentId', childKey: 'children'};
        var a = inside.transformTozTreeFormat(setting, data);
        treeNewtecJQ.setData(a);
        //这里直接使用下面两行代码即可生成树，因为我要区分顶级菜单和菜单的样式，所以手动添加
        // treeNewtecJQ.setData(a);
        // treeNewtecJQ.initTreeGrid();

//        var firstLevel = [];
//        var otherLevel = [];
//        for (var i = 0; i < a.length; i++) {
//            var b = a[i];
//            // b.icon = '';//不显示图标
//            // b.tdStyle = "height:40px;line-height:40px;";
//            firstLevel.push(b);
//        }
//        treeNewtecJQ.addRecords(firstLevel);
//        for (var i = 0; i < firstLevel.length; i++) {
//            var b = firstLevel[i];
//            if (b["children"]) {
//                g(b["children"]);
//            }
//        }
//        function g(a) {
//            for (var i = 0; i < a.length; i++) {
//                var b = a[i];
//                //这里加上了判断是否有子菜单
//                //如果有子菜单就显示图片，没有子菜单就不显示
//                //我认为不怎么好看
//                if (b.children) {
//                    b.showIcon = true;
//                } else {
//                    // b.icon = '';
//                    b.showIcon = false;
//                }
//                // b.tdStyle = "font-size:13px;";
//                b.iconStyle = "height:16px;width:16px;";
//                b.iconClass = "";
//                otherLevel.push(b);
//                if (b["children"]) {
//                    g(b["children"]);
//                }
//            }
//        }
//
//        treeNewtecJQ.addRecords(otherLevel, true);
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
        var xxx = [];
        for (var key in data) {
            //这里我发现有些节点已经有了children属性
            delete data[key].children;
            xxx.push(data[key]);
        }
        // var arr = inside.transData(data, 'id', 'parentId', 'children');
        var arr = outside.jsonTree(xxx, {
            id: 'id',
            pid: 'parentId',
            children: 'children'
        }).data;
        var that = this;
        var html = "";
        html += "<ul class='menu-min' style='display:none;background-color:" + Newtec.App.config.skin[Newtec.App.config.skinCurrent].menu.unSelectBackgroundColor + ";'>";

        for (var i = 0; i < arr.length; i++) {
            var a = arr[i];
            if (a.children) {
                for (var j = 0; j < a.children.length; j++) {
                    var b = a.children[j];
                    html += "\n    <li>";
                    if (Newtec.Utils.isNull(b.pageId) && Newtec.Utils.isNull(b.content)) {
                        html += "\n        <a href='#' class='' id='" + b.id + "' style='outline:0;' title='" + b.name + "' data-title='" + b.name + "'><img src='" + b.icon + "' alt=''><br/>" /*+ b.name*/ + "</a>";
                    } else {
                        html += "\n        <a href='#' class='J_menuItem_min' id='" + b.id + "' style='outline:0;' data-title='" + b.name + "' title='" + b.name + "'><img src='" + b.icon + "' alt=''><br/>" /*+ b.name*/ + "</a>";
                    }
                    if (b.children) {
                        html += "\n        <ul class='sub' style='background-color:" + Newtec.App.config.skin[Newtec.App.config.skinCurrent].menu.unSelectBackgroundColor + ";'>";
                        for (var k = 0; k < b.children.length; k++) {
                            var c = b.children[k];
                            html += "\n            <li><a href='#' class='J_menuItem_min' id='" + c.id + "' style='margin-left: 15px; margin-right: 15px;outline:0;' title='" + c.name + "' title='" + c.name + "' data-title='" + c.name + "'>" + c.name + "</a></li>";
                        }
                        html += "\n        </ul>";
                    }
                    html += "\n    </li>";
                }
            }
        }

        html += "</ul>";

//        $('#' + appId).on('click', '#menu-toggle', function (e) {
//            $('#' + appId + ' .menu-min').toggle('fast');
//            if (Newtec.Utils.isNewtec(that.app[appId].menu)) {
//                that.app[appId].menu.newtecJQ.toggle('fast');
//            } else {
//                that.app[appId].menu.toggle('fast');
//            }
//            // var icon = $(this).find('i');
//            // var icon1 = icon.data('icon1');
//            // var icon2 = icon.data('icon2');
//            // icon.toggleClass(icon1).toggleClass(icon2);
//            var img = $(this).find('img');
//            var img1 = img.data('img1');
//            var img2 = img.data('img2');
//            var curImg = img.attr('src');
//            if (curImg == img1) {
//                img.attr('src', img2);
//            } else {
//                img.attr('src', img1);
//            }
//            // alert(appId);
//        });

        return $(html);
    };

    /**
     * 构建中间部分
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
        html += "\n                            <a href='javascript:;' class='active J_menuTab' id='" + Newtec.App.config.prefix.tab + mainUrl + "'>首页</a>";
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
        html += "\n            <div class='content-main J_mainContent'>";
        html += "\n                <iframe class='J_iframe' name='" + Newtec.App.config.prefix.iframe + mainUrl + "' width='100%' height='100%' src='networkx.html' frameborder='0' seamless=''></iframe>";
        html += "\n            </div>";
        html += "\n        </div>";
        html += "\n    </div>";
        // html += "\n</div>";

        var bodyObj = $(html);
        return bodyObj;
    };

    //========================================
    //=====菜单以及选项卡相关代码 start
    //========================================

    /**
     * 绑定contabs事件
     * @param appId
     * @param mainUrl
     */
    Newtec.App.prototype.initContabs = function (appId, mainUrl) {
        var appThis = this;

        //左侧菜单点击事件
        $('#' + appId).on('click', '.J_menuItem', function () {
            var menuId = $(this).attr('id'),//左侧菜单获取的Node的id值
                menuName = $.trim($(this).text());
            appThis.addContabs(menuName, menuId, appId, 'create by menu clicked');
            // $('#' + appId + ' .J_menuItem').css('background-color', '#e8ebf3');
            // $(this).css('background-color', '');
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
                        // if (window.frames[this.name].document.onfocus) {
                        //     window.frames[this.name].document.onfocus('父页面传过来的参数');
                        // this.contentWindow.onfocus('父页面传过来的参数');
                        // }
                        $(this).addClass('active').show().siblings('.J_iframe').removeClass('active').hide();
                        return false;
                    }
                });
                $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                scrollToTab(this);
            }
        });

        //选项卡关闭事件
        $('#' + appId + ' .J_menuTabs').on('click', '.J_menuTab i.fa-times', function () {
            var currentWidth = $(this).parents('.J_menuTab').width();
            var thisTab = $(this).parent('.J_menuTab');
            var closeTabId = thisTab.attr('id'),
                closeMenuId = closeTabId.replace(Newtec.App.config.prefix.tab, ''),
                closeIframeName = closeTabId.replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
            //移除当前选项卡
            thisTab.remove();
            //移除tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).attr('name') == closeIframeName) {
                    $(this).remove();
                }
            });
            //显示首页选项卡
            var homePageTabId = Newtec.App.config.prefix.tab + mainUrl,
                homePageIframeId = Newtec.App.config.prefix.iframe + mainUrl;
            $('#' + appId + " .J_menuTab").removeClass('active');
            $('#' + homePageTabId).addClass('active');
            $('iframe[name=' + homePageIframeId + ']').show();
            //显示首页对应的内容区
            return false;
        });
        //选项卡刷新事件
        $('#' + appId + ' .J_menuTabs').on('click', '.J_menuTab i.glyphicon-refresh', function () {
        	 var thisTab = $(this).parent('.J_menuTab');
        	 var frame = Newtec.AppUtils.getFrameObj();
        	 var frameJQ = $(frame);
        	 appThis.addContabs(thisTab.text(),thisTab.attr('data-id'),'',thisTab.attr('data-additional'),'page'==frameJQ.data('type'),true);
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
           	 var thisTab = $('#tab_'+menuId);
                var closeIframeName = "iframe_"+menuId.replace(Newtec.App.config.prefix.tab, Newtec.App.config.prefix.iframe);
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
        //通过遍历.J_menuTab，判断选项卡菜单是否存在
        console.time('J_menuTab添加');
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
            var iframe_src = 'PageServlet?p=' + menuId + '&' + new Date().getTime();
            var type_str = "";
            if (type == true) {
                type_str = " data-type='page' ";
                iframe_src += '&page=page';
            }
            var additional_str = "";
            if (!Newtec.Utils.isNull(additional)) {
                additional_str = " data-additional='" + additional + "'";
            }
            var str = '<a href="javascript:;" class="active J_menuTab" id="' + tabId + '" data-id="' + menuId + '" ' + additional_str + '>' + menuName + ' <i class="glyphicon glyphicon-refresh" style="visibility: hidden;font-size: 12px;margin:0 2px;"></i> <i class="fa fa-times" style="visibility: hidden;"></i></a>';
            var str1 = '<iframe style="padding:5px;" class="J_iframe active" ' + additional_str + type_str + ' data-id="' + menuId + '" name="' + iframeName + '" width="100%" height="100%" src="' + iframe_src + '" frameborder="0" seamless></iframe>';
            $('#' + appId + ' .J_menuTab').removeClass('active');
            //添加iframe
            var iframeJQ = $(str1);
            $('#' + appId + ' .J_mainContent').find('iframe.J_iframe').removeClass('active').hide().parents('#' + appId + ' .J_mainContent').append(iframeJQ);
            iframeJQ.bind('load', function () {
                iframeJQ.unbind('load');
            });
            //添加选项卡
            var newTab = $(str);
            $('#' + appId + ' .J_menuTabs .page-tabs-content').append(newTab);
            // scrollToTab($('#' + appId + ' .J_menuTab.active'));

            var appData = appThis.app[appId];
        }
        console.timeEnd('J_menuTab添加');
        
    };

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
        	var jq=$(this);
        	var menuJQ=$('#' + appId + ' .menu-min');
        	if(jq.hasClass('glyphicon-folder-close')){
        		jq.addClass('glyphicon-folder-open').removeClass("glyphicon-folder-close");
        		jq.attr('title','点击展开菜单');
        		menuJQ.parent().parent().parent().addClass('menu-close');
        	}else{
        		jq.attr('title','点击收起菜单');
        		jq.removeClass('glyphicon-folder-open').addClass("glyphicon-folder-close");
        		menuJQ.parent().parent().removeClass('menu-close');
        	}
        	menuJQ.toggle('fast');
            if (Newtec.Utils.isNewtec(that.app[appId].menu)) {
                that.app[appId].menu.newtecJQ.toggle('fast');
            } else {
                that.app[appId].menu.toggle('fast');
            }
        });
    };

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

        transformTozTreeFormat: function (setting, map) {
            var sNodes = [];
            for (k in map) {//这里讲Map转化成数组，后期文杰处理
                sNodes.push(map[k]);
            }
            var i, l,
                key = setting.idKey,
                parentKey = setting.parentKey,
                childKey = setting.childKey;
            if (!key || key == "" || !sNodes) return [];

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

    $.extend(Newtec.App, outside);
})();