/**
 * 顶部导航
 * @author 曾文杰
 */
(function () {
    var MENU_TYPE_TREE = 'tree',
        MENU_TYPE_FOLDER = 'folder';
    Newtec.TopNav = function (params) {
        if (!Newtec.Utils.isJson(params)) {
            return;
        }
        this.defaults = {
            ds: '',//数据源
            operId: '',//查询访问方法
            data: '',//查询提交数据,

            menuType: MENU_TYPE_FOLDER,//支持类型 tree folder
            treeMenu: undefined,
            folderMenu: undefined,

            showIndex: false,//显示首页
            indexUrl: ''//首页链接
        };
        this.options = $.extend(this.defaults, params, {});
    };

    Newtec.TopNav.exte(Newtec.Base, 'topNav');

    Newtec.TopNav.prototype.createNewtecJQ = function () {
        var html = this.getHtml();
        this.fetchData();
        return $(html);
    };

    Newtec.TopNav.prototype.fetchData = function () {
        if (Newtec.Utils.isNull(this.options.ds)) {
            alert('数据源为空');
            return;
        }
        var that = this;
        that.options.ds.fetchData({
            operId: that.options.operId,
            data: that.options.data,
            callback: function (response) {
                that.data = response.data;
                that.build(response.data);
            }
        });
    };

    Newtec.TopNav.prototype.setData = function (data) {
        alert('waiting');
    };

    Newtec.TopNav.prototype.getData = function () {
        return this.data;
    };

    Newtec.TopNav.prototype.build = function (data) {
        var nav = $('#' + this.nav2Id + ' ul.pull-left');
        var html = '';
        for (var i = 0, l = data.length; i < l; i++) {
            var a = data[i];
            //topNavTab 标识a标签
            //newPage 标识加载方式，无该class的为通过js加载
            html += "<li><a class='topNavTab' app-id='" + a.id + "' href='javascript:void(0);'>" + a.name + "</a></li>";
        }
        nav.append($(html));
        var that = this;

        //阻止a标签跳转
        $('.topNavTab').on('click', function (event) {
            var t = $(this);

            var href = t.attr('href');
            var text = t.text();
            var appId = t.attr('app-id');

            Newtec.App.build(appId);

            //之前编写的方法，仅参考
            // var flag = false;
            // 系统已存在
            // $('.newtec_system').each(function () {
            //     if ($(this).data('id') == href) {
            //         $(this).addClass('active').siblings('.newtec_system').removeClass('active');
            //         $('.newtec_system').each(function () {
            //             if ($(this).data('id') == href) {
            //                 $(this).show().siblings('.newtec_system').hide();
            //             }
            //         });
            //         flag = true;
            //         return false;
            //     }
            // });
            // 系统不存在
            // if (!flag) {
            //     $('.newtec_system').removeClass('active').hide();
            //     $('#main').append("<div class='newtec_system active' data-id='" + href + "'>" + href + "</div>");
            //     new Newtec.DS("person").fetchData({
            //         operId: 'toApplication', data: {appId: appId}, callback: function (response) {
            //             console.log(response);
            //             if (response.status != 0) {
            //                 alert(response.failureMessage);
            //                 return;
            //             }
            //             console.log(response.data);
            //         }
            //     });
            // }
            // return false;
        });
    };

    /**
     * 加载系统
     * @author 曾文杰
     */
    Newtec.TopNav.prototype.getSystemHomePage = function (appId) {
        console.log('getSystemHomePage');
        // new Newtec.DS("person").fetchData({
        //     operId: 'toApplication', data: {}, callback: function (response) {
        //         alert(response);
        //         console.log(response);
        //     }
        // });
    };

    Newtec.TopNav.prototype.getHtml = function () {
        this.navId = 'navbar';
        this.logoId = Newtec.Utils.uuid16();
        this.nav2Id = Newtec.Utils.uuid16();
        console.log(this);

        var html = "";

        html += "\n<div id='navbar' class='navbar navbar-default ace-save-state color1' style='margin-bottom:0'>";
        html += "\n  <div class='navbar-container ace-save-state row' id='navbar-container' style='margin-left: 12px; margin-right: 12px;'>";
        html += "\n    <button type='button' class='navbar-toggle menu-toggler pull-left' id='menu-toggler' data-target='#sidebar'>";
        html += "\n      <span class='sr-only'>Toggle sidebar</span>";
        html += "\n      <span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span>";
        html += "\n    </button>";
        html += "\n    <div class='navbar-header pull-left'>";
        html += "\n      <a href='javascript:;' class='navbar-brand' id='sysTitle'><small><i class='fa fa-leaf'></i>Admin</small></a>";
        html += "\n    </div>";
        html += "\n    <div class='navbar-buttons navbar-header pull-right' role='navigation'></div>";
        html += "\n  </div>";
        html += "\n  <div id='" + this.nav2Id + "' class='row top-nav2' style='margin-left: 15px; margin-right: 15px;'>";
        html += "\n    <ul class='pull-left' style='padding-left: 0;'>";
        html += "\n      <li class='active'><a href='IndexPageServlet' class='topNavTab'>首页</a></li>";
        html += "\n    </ul>";
        html += "\n    <ul class='pull-right'>";
        html += "\n      <li style='padding: 5px 5px;'><a href='#'><span class='glyphicon glyphicon-list-alt'></span></a></li>";
        html += "\n      <li style='padding: 5px 5px;'><a href='#'>大</a></li>";
        html += "\n      <li style='padding: 5px 5px;'><a href='#'>中</a></li>";
        html += "\n      <li style='padding: 5px 5px;'><a href='#'>小</a></li>";
        html += "\n      <li style='padding: 5px 5px;'><a href='#'><span class='glyphicon glyphicon-chevron-up'></span></a></li>";
        html += "\n    </ul>";
        html += "\n  </div>";
        html += "\n</div>";

        return html;
    };

    var outside = {};

    $.extend(Newtec.TopNav, outside);
})();

/**
 * 底部导航
 * @author 曾文杰
 */
(function () {
    var that;

    Newtec.BottomNav = function (params) {
        if (!Newtec.Utils.isJson(params)) {
            return;
        }
        that = this;
        this.defaults = {
            appendTo: ''//添加到哪个元素
        };
        that.options = $.extend(this.defaults, params, {});
    };

    Newtec.BottomNav.prototype = new Newtec.Base('topNav');

    Newtec.BottomNav.prototype.createNewtecJQ = function () {
        var html = inside.getHtml();
        this.fetchData();
        return $(html);
    };

    Newtec.BottomNav.prototype.fetchData = function () {
    };

    Newtec.BottomNav.prototype.addButtons = function (params) {
        if (Newtec.Utils.isNull(that.navULObj)) {
            that.navULObj = $('#' + that.navULId);
        }
        if (params instanceof Array) {
            for (var i = 0, l = params.length; i < l; i++) {
                this.addButtons(params[i]);
            }
        } else {
            var btnId = params['id'];
            if (!Newtec.Utils.isNull(btnId)) {
                var html = "<li><a id='" + btnId + "' href='javascript:void(0);'>" + params['title'] + "</a></li>";
                that.navULObj.append($(html));
                $('#' + btnId).click(params['click']);
            }
        }
    };

    var inside = {
        getHtml: function () {
            var html = "";

            that.navULId = Newtec.Utils.uuid16();

            html += "<div class='bottom-nav color1'>";
            html += "  <ul id='" + that.navULId + "' style='padding-left: 5px;'>";
            html += "    <li><a href='javascript:void(0);'><i class='glyphicon glyphicon-th'></i></a></li>";
            html += "  </ul>";
            html += "</div>";

            return html;
        }
    };

    var outside = {};

    $.extend(Newtec.BottomNav, outside);
})();

/**
 * 左侧菜单（折叠型）
 * @author 曾文杰
 */
(function () {
    var that;
    Newtec.FolderMenu = function (params) {
        if (!Newtec.Utils.isJson(params)) {
            return;
        }
        that = this;
        this.defaults = {
            appendTo: '',//添加到哪个元素
            ds: '',//数据源
            operId: '',//查询访问方法
            data: '',//查询提交数据,
            async: false,//是否异步
            withRoot: true,//是否加载根节点,
            collapse: true
        };

        that.options = $.extend(this.defaults, params, {});

        // var a = "0";
        // if (that.options.async) {
        //     a = "1";
        // }
        $.extend(that.options.data, {async: "0"});//暂时不用异步，统一加载全部数据

        that.tree = [];
        that.groups = {};
    };

    Newtec.FolderMenu.prototype = new Newtec.Base('folderMenu');

    Newtec.FolderMenu.prototype.createNewtecJQ = function () {
        that.fetchData();
        return $('<div></div>');
    };

    Newtec.FolderMenu.prototype.fetchData = function () {
        if (Newtec.Utils.isNull(that.options.ds)) {
            alert('数据源为空');
            return;
        }
        that.options.ds.fetchData({
            operId: that.options.operId,
            data: that.options.data,
            callback: function (response) {
                console.log(response);
                that.tree = response.data;
                that.build();
                initContabs();
            }
        });
    };

    Newtec.FolderMenu.prototype.setData = function () {
    };

    Newtec.FolderMenu.prototype.getData = function () {
    };

    Newtec.FolderMenu.prototype.build = function (data) {
        var html = '';
        var setting = {idKey: 'id', parentKey: 'pId', childKey: 'children'};
        var arr = inside.transformTozTreeFormat(setting, data);
        html = inside.getDom(arr, that.options.withRoot);

        $(this.defaults.appendTo).append($(html));
        if (that.options.collapse) {
            inside.addCollapseBtn();
        }
    };

    Newtec.FolderMenu.prototype.destroy = function () {
        that.data = [];
        $(that.options.appendTo).html('');
    };

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
            return html;
        },
        initDom: function (arr) {
            var html = "";

            for (var i = 0; i < arr.length; i++) {
                var node = arr[i];
                if (node.children) {
                    //有叶子
                    html += "<li><a href='' class='dropdown-toggle'><i class='menu-icon glyphicon glyphicon-cog'></i><span class='menu-text'>" + node.name + "</span><b class='arrow glyphicon glyphicon-chevron-down'></b></a><b class='arrow'></b>\n";
                    html += "<ul class='submenu'>\n";
                    html += this.initDom(node.children);
                    html += "</ul>\n";
                    html += "</li>\n";
                } else {
                    //无叶子
                    html += "<li><a class='J_menuItem' href='PageServlet?p=" + node.id + "'><i class='menu-icon fa null'></i><span class='menu-text'>" + node.name + "</span></a><b class='arrow'></b></li>\n";
                }
            }

            return html;
        },
        transformTozTreeFormat: function (setting, sNodes) {
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
        addCollapseBtn: function () {
            var html = "<div class='sidebar-toggle sidebar-collapse' id='sidebar-collapse'><i style='background: none; border: none;' id='sidebar-toggle-icon' class='ace-icon glyphicon glyphicon-chevron-left ace-save-state' data-icon1='ace-icon glyphicon glyphicon-chevron-left' data-icon2='ace-icon glyphicon glyphicon-chevron-right'></i></div>";
            $(that.options.appendTo).append($(html));
        }
    };

    var outside = {};

    $.extend(Newtec.TreeMenu, outside);
})();

/**
 * 页面主体
 * @author 曾文杰
 */
(function () {
    if (Newtec.MainNav != undefined) {
        console.log('Newtec.MainNav已经初始化');
        return;
    }
    Newtec.MainNav = function (params) {
        if (!Newtec.Utils.isNull(params)) {
            console.error('参数出错');
            return;
        }
        this.defaults = {};
        this.options = $.extend(this.defaults, params, {});
    };

    Newtec.MainNav.prototype = new Newtec.Base('mainNav');

    Newtec.MainNav.prototype.createNewtecJQ = function () {
        return $('<div></div>');
    };

    Newtec.MainNav.prototype.create = function () {
    };

    Newtec.MainNav.prototype.createSideNav = function () {
    };

    Newtec.MainNav.prototype.destroy = function () {
    };
    Newtec.Module("TopNav")
})();