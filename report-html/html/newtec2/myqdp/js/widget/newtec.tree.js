(function () {
    Newtec.Tree = function (params) {
        if (!Newtec.Utils.isJson(params)) {
            return;
        }
        this.defaults = {
            ds: '',//数据源
            fetchOperId: '',//查询访问方法
            addOperId: '',//添加访问方法
            delOperId: '',//删除访问方法
            upOperId: '',//更行访问方法
            data: '',//查询提交数据,
            async: false,//是否异步
            'expandAll': true,//是否自动展开

            //=====checkbox setting=====
            'showCheckbox': false,//是否显示checkbox
            'checkboxStyle': 'checkbox',//勾选框类型(checkbox 或 radio）[setting.check.enable = true 时生效]
            'checkboxType': {"Y": "ps", "N": "ps"},//勾选 checkbox 对于父子节点的关联关系。[setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效]
                                                   // Y 属性定义 checkbox 被勾选后的情况；
                                                   // N 属性定义 checkbox 取消勾选后的情况；
                                                   // "p" 表示操作会影响父级节点；
                                                   // "s" 表示操作会影响子级节点。
                                                   // 请注意大小写，不要改变
            'radioType': 'level'//radio 的分组范围，radioType = "level" 时，在每一级节点范围内当做一个分组，radioType = "all" 时，在整棵树范围内当做一个分组。[setting.check.enable = true 且 setting.check.chkStyle = "radio" 时生效]
            //=====checkbox setting end=====
        };
        var _this = this;
        this.treeSetting = {
            check: {
                enable: this.defaults.showCheckbox,
                chkStyle: this.defaults.checkboxStyle,
                chkboxType: this.defaults.checkboxType,
                radioType: this.defaults.radioType
            },
            data: {
                keep: {
                    parent: true,
                    leaf: true
                },
                simpleData: {
                    enable: true,
                    idKey: 'id',
                    pIdKey: 'parentId',
                    rootPid: null
                }
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false
            },
            view: {
                fontCss: {color: "#000"/*, height: "25px", "line-height": "25px"*/}
            },
            //后续控件请暂时不要增加callback参数，只添加以上的几个参数就好了
            callback: {
                beforeAsync: _this.beforeAsync.bind(this),
                beforeCheck: _this.beforeCheck.bind(this),
                beforeClick: _this.beforeClick.bind(_this),
                beforeCollapse: _this.beforeCollapse.bind(this),
                beforeDblClick: _this.beforeDblClick.bind(this),
                beforeDrag: _this.beforeDrag.bind(this),
                beforeDragOpen: _this.beforeDragOpen.bind(this),
                beforeDrop: _this.beforeDrop.bind(this),
                beforeEditName: _this.beforeEditName.bind(this),
                beforeExpand: _this.beforeExpand.bind(this),
                beforeMouseDown: _this.beforeMouseDown.bind(this),
                beforeMouseUp: _this.beforeMouseUp.bind(this),
                beforeRemove: _this.beforeRemove.bind(this),
                beforeRename: _this.beforeRename.bind(this),
                beforeRightClick: _this.beforeRightClick.bind(this),
                onAsyncError: _this.onAsyncError.bind(this),
                onAsyncSuccess: _this.onAsyncSuccess.bind(this),
                onCheck: _this.onCheck.bind(this),
                onClick: _this.onClick.bind(this),
                onCollapse: _this.onCollapse.bind(this),
                onDblClick: _this.onDblClick.bind(this),
                onDrag: _this.onDrag.bind(this),
                onDragMove: _this.onDragMove.bind(this),
                onDrop: _this.onDrop.bind(this),
                onExpand: _this.onExpand.bind(this),
                onMouseDown: _this.onMouseDown.bind(this),
                onMouseUp: _this.onMouseUp.bind(this),
                onNodeCreated: _this.onNodeCreated.bind(this),
                onRemove: _this.onRemove.bind(this),
                onRename: _this.onRename.bind(this),
                onRightClick: _this.onRightClick.bind(this)
            }
        };
        //合并参数
        this.defaults = $.extend(this.defaults, params, {});
        //合并zTree设置
        //this.treeSetting = $.extend(this.treeSetting, params.treeSetting, {});
        //处理其它信息
        if (Newtec.Utils.isString(this.defaults.ds)) {
            this.ds = new Newtec.DS(this.defaults.ds);
        } else {
            this.ds = this.defaults.ds;
        }

        //初始化右键菜单
        this.initRightMenu();
    };

    Newtec.Tree.exte(Newtec.Base, 'tree');

    Newtec.Tree.prototype.createNewtecJQ = function (params) {
        var element = $(this.defaults.appendTo);
        this.treeId = Newtec.Utils.uuid16();
        element.append($("<ul id='" + this.treeId + "' class='ztree'></ul>"));
        this.fetchData();
        return element;
    };

    Newtec.Tree.prototype.fetchData = function () {
        if (Newtec.Utils.isNull(this.ds)) {
            alert('数据源为空');
            return;
        }
        var that = this;
        that.ds.fetchData({
            operId: that.defaults.fetchOperId,
            data: that.defaults.data,
            callback: function (response) {
                console.log(response);
                that.build(response.data);
            }
        });
    };

    Newtec.Tree.prototype.setData = function (treeData) {
        this.destroy();
        this.build(treeData);
    };

    Newtec.Tree.prototype.getData = function () {
        if (Newtec.Utils.isNull(this.treeObj)) {
            return [];
        }
        var nodes = this.treeObj.getNodes();//获取树的所有节点
        var simpleNodes = this.treeObj.transformToArray(nodes);//转换为Array格式[{},{}...]
        //var json = JSON.stringify(simpleNodes);//转换为json字符串
        //这里我返回json对象，需要自己转成字符串
        return simpleNodes;
    };

    Newtec.Tree.prototype.build = function (treeData) {
        this.treeObj = $.fn.zTree.init($('#' + this.treeId), this.treeSetting, treeData);
        this.treeObj.expandAll(this.defaults.expandAll);
    };

    Newtec.Tree.prototype.destroy = function () {
        $.fn.zTree.destroy(this.treeId);
    };

    Newtec.Tree.prototype.destroyAll = function () {
        $.fn.zTree.destroy();
    };

    Newtec.Tree.prototype.addMenuItem = function (params) {
        var that = this;
        var zTree = this.treeObj,
            nodes = zTree.getSelectedNodes(),
            treeNode = nodes[0];
        if (!treeNode) {
            alert('没有选择节点');
            return;
        }
        //指定的父节点，如果增加根节点，请设置 parentNode 为 null 即可。
        var parentNode = treeNode;
        //需要增加的节点数据 JSON 对象集合，数据只需要满足 zTree 的节点数据必需的属性即可。
        var newNodes = {id: (100), parentId: treeNode.id, isParent: false, name: "new node"};//默认值，里面有些参数没用到，仅作为示例
        newNodes = $.extend({}, newNodes, params);//合并
        if (treeNode.isParent) {
            zTree.addNodes(treeNode, newNodes);
            //TODO 参数传递
            var a = {
                data: {
                    name: newNodes.name,
                    parentId: treeNode.id
                },
                operId: that.defaults.addOperId,
                callback: function (response) {
                    alert('完成');
                }

            };
            this.ds.addData(a);
        } else {
            alert('无法在叶子节点添加');
        }
    };

    Newtec.Tree.prototype.updateMenuItem = function (name, pId) {
        var zTree = this.treeObj,
            nodes = zTree.getSelectedNodes(),
            treeNode = nodes[0];
        if (nodes.length == 0) {
            alert("请先选择一个节点");
            return;
        }
        // treeNode = $.extend({}, treeNode, newTreeNode);
        if (name) {
            treeNode.name = name;
        }
        if (pId) {
            treeNode.pId = pId;
        }
        zTree.editName(treeNode);
    };

    Newtec.Tree.prototype.getSelectedNode = function () {
        var zTree = this.treeObj,
            nodes = zTree.getSelectedNodes(),
            treeNode = nodes[0];
        return treeNode;
    };

    Newtec.Tree.prototype.removeMenuItem = function () {
        //TODO 这里也可以通过getSelectedNode找到节点，然后把需要删除的节点通过参数传进来，然后删除
        var zTree = this.treeObj,
            nodes = zTree.getSelectedNodes(),
            treeNode = nodes[0];
        if (nodes.length == 0) {
            alert("请先选择一个节点");
            return false;
        }
        if (treeNode.children && treeNode.children.length > 0) {
            alert('找到子节点，不允许直接删除');
            return false;
        }
        var callbackFlag = true;//为true时会调用ztree setting里面的beforeRemove
        zTree.removeNode(treeNode, callbackFlag);
        return true;
    };

    Newtec.Tree.prototype.moveMenuItem = function () {
        alert('移动一个菜单项');
    };

    Newtec.Tree.prototype.getTreeObj = function () {
        return this.treeObj;
    };

    Newtec.Tree.prototype.showLoadingIcon = function (treeNode) {
        treeNode.icon = "myqdp/ztree/css/zTreeStyle/img/loading.gif";
        this.getTreeObj().updateNode(treeNode);
    };

    Newtec.Tree.prototype.hideLoadingIcon = function (treeNode) {
        treeNode.icon = null;
        this.getTreeObj().updateNode(treeNode);
    };

    Newtec.Tree.prototype.addStyle = function (params) {
        var zTree = this.treeObj;
        if (!zTree) {
            return;
        }
        var nodes = zTree.transformToArray(zTree.getNodes());
        console.log(nodes);
        if (!nodes) {
            return;
        }
        //对于异步加载的节点无效
        for (var i = 0; i < nodes.length; i++) {
            $('#' + nodes[i].tId + "_a").css(params);
        }
    };

    Newtec.Tree.prototype.addClass = function (className) {
        var zTree = this.treeObj;
        var nodes = zTree.transformToArray(zTree.getNodes());
        //对于异步加载的节点无效
        for (var i = 0; i < nodes.length; i++) {
            $('#' + nodes[i].tId + "_a").addClass(className);
        }
    };

    //  li id=XXX                   //li标签
    //    span id=XXX_switch        //前面的折叠按钮或者连接线
    //    span id=XXX_check         //选择框
    //    a id=XXX_a                //菜单标签
    //      span id=_ico            //菜单图标
    //      span id=_span           //菜单文字
    //=====以下几个是修改css的方法=====
    Newtec.Tree.prototype.addStyle4li = function (cssParams) {
        var zTree = this.treeObj;
        var nodes = zTree.transformToArray(zTree.getNodes());
        for (var i = 0; i < nodes.length; i++) {
            $('#' + nodes[i].tId).css(cssParams);
        }
    };
    Newtec.Tree.prototype.addStyle4switch = function (cssParams) {
        var zTree = this.treeObj;
        var nodes = zTree.transformToArray(zTree.getNodes());
        for (var i = 0; i < nodes.length; i++) {
            $('#' + nodes[i].tId + "_switch").css(cssParams);
        }
    };
    Newtec.Tree.prototype.addStyle4check = function (cssParams) {
        var zTree = this.treeObj;
        var nodes = zTree.transformToArray(zTree.getNodes());
        for (var i = 0; i < nodes.length; i++) {
            $('#' + nodes[i].tId + "_check").css(cssParams);
        }
    };
    Newtec.Tree.prototype.addStyle4a = function (cssParams) {
        var zTree = this.treeObj;
        var nodes = zTree.transformToArray(zTree.getNodes());
        for (var i = 0; i < nodes.length; i++) {
            $('#' + nodes[i].tId + "_a").css(cssParams);
        }
    };
    Newtec.Tree.prototype.addStyle4ico = function (cssParams) {
        var zTree = this.treeObj;
        var nodes = zTree.transformToArray(zTree.getNodes());
        for (var i = 0; i < nodes.length; i++) {
            $('#' + nodes[i].tId + "_ico").css(cssParams);
        }
    };
    Newtec.Tree.prototype.addStyle4span = function (cssParams) {
        var zTree = this.treeObj;
        var nodes = zTree.transformToArray(zTree.getNodes());
        for (var i = 0; i < nodes.length; i++) {
            $('#' + nodes[i].tId + "_span").css(cssParams);
        }
    };
    //=====以下几个是修改css的方法 END=====

    //===============以下是右键菜单处理===============

    Newtec.Tree.prototype.initRightMenu = function () {
        this.rMenuId = Newtec.Utils.uuid16();
        $('body').append("<div class='rMenu' id=" + this.rMenuId + "><ul class='dropdown-menu' style='position:static;display:block;font-size:0.9em;'></ul></div>");
        this.rMenu = $('#' + this.rMenuId);
    };

    Newtec.Tree.prototype.showRightMenu = function (type, x, y) {
        $("#" + this.rMenuId + " ul").show();
        this.rMenu.css({"top": y + "px", "left": x + "px", "visibility": "visible"});
        $("body").bind("mousedown", this.onBodyMouseDown.bind(this));
    };

    Newtec.Tree.prototype.hideRightMenu = function () {
        if (this.rMenu) {
            this.rMenu.css({"visibility": "hidden"});
        }
        $("body").unbind("mousedown", this.onBodyMouseDown.bind(this));
    };

    Newtec.Tree.prototype.onBodyMouseDown = function (event) {
        if (!(event.target.id == this.rMenuId || $(event.target).parents("#" + this.rMenuId).length > 0)) {
            this.rMenu.css({"visibility": "hidden"});
        }
    };

    Newtec.Tree.prototype.addRightButtons = function (params) {
        var $this = this;
        if (params instanceof Array) {
            for (var i = 0, l = params.length; i < l; i++) {
                this.addRightButtons(params[i]);
            }
        } else {
            var btnId = params['id'];
            if (!Newtec.Utils.isNull(btnId)) {
                // var html = "<li id='" + btnId + "'>" + params['title'] + "</li>";
                var html = '<li role="presentation" id="' + btnId + '"><a href="#" role="menuitem"><span class="glyphicon glyphicon-cog"> ' + params['title'] + '</span></a></li>';
                $('#' + this.rMenuId + ' ul').append($(html));
                $('#' + btnId).click(function () {
                    //注意这里，执行了点击事件后
                    //右键菜单不会自动隐藏
                    //需要手动调用隐藏方法
                    $this.hideRightMenu();
                    params['click']();
                });
            }
        }
    };

    //===============以上是右键菜单处理===============

    //===============以下是zTree的事件===============

    /**
     * 用于捕获异步加载之前的事件回调函数，zTree 根据返回值确定是否允许进行异步加载
     * @param treeId 对应 zTree 的 treeId，便于用户操控
     * @param treeNode json对象，进行异步加载的父节点 JSON 数据对象
     * @returns {boolean} 如果返回 false，zTree 将不进行异步加载，也无法触发 onAsyncSuccess / onAsyncError 事件回调函数
     */
    Newtec.Tree.prototype.beforeAsync = function (treeId, treeNode) {
        console.log('beforeAsync');
        if (this.defaults.callback && this.defaults.callback['beforeAsync']) {
            return this.defaults.callback['beforeAsync'](treeId, treeNode);
        }
    };
    /**
     * 用于捕获 勾选 或 取消勾选 之前的事件回调函数，并且根据返回值确定是否允许 勾选 或 取消勾选
     * @param treeId 对应 zTree 的 treeId，便于用户操控
     * @param treeNode json对象，进行 勾选 或 取消勾选 的节点 JSON 数据对象
     * @returns {boolean} 如果返回 false，将不会改变勾选状态，并且无法触发 onCheck 事件回调函数
     */
    Newtec.Tree.prototype.beforeCheck = function (treeId, treeNode) {
        console.log('beforeCheck');
        if (this.defaults.callback && this.defaults.callback['beforeCheck']) {
            return this.defaults.callback['beforeCheck']();
        }
    };
    /**
     * 用于捕获单击节点之前的事件回调函数，并且根据返回值确定是否允许单击操作
     * @param treeId 对应 zTree 的 treeId，便于用户操控
     * @param treeNode json对象，被单击的节点 JSON 数据对象
     * @param clickFlag 节点被点击后的选中操作类型，详细看api
     * @returns {boolean} 如果返回 false，zTree 将不会选中节点，也无法触发 onClick 事件回调函数
     */
    Newtec.Tree.prototype.beforeClick = function (treeId, treeNode, clickFlag) {
        console.log('beforeClick');
        if (this.defaults.callback && this.defaults.callback['beforeClick']) {
            return this.defaults.callback['beforeClick'](treeId, treeNode, clickFlag);
        }
    };
    /**
     * 用于捕获父节点折叠之前的事件回调函数，并且根据返回值确定是否允许折叠操作
     * @param treeId
     * @param treeNode
     * @returns {boolean} 如果返回 false，zTree 将不会折叠节点，也无法触发 onCollapse 事件回调函数
     */
    Newtec.Tree.prototype.beforeCollapse = function (treeId, treeNode) {
        console.log('beforeCollapse');
        if (this.defaults.callback && this.defaults.callback['beforeCollapse']) {
            return this.defaults.callback['beforeCollapse']();
        }
    };
    /**
     * 用于捕获 zTree 上鼠标双击之前的事件回调函数，并且根据返回值确定触发 onDblClick 事件回调函数
     * @param treeId
     * @param treeNode
     * @returns {boolean} 如果返回 false，将仅仅无法触发 onDblClick 事件回调函数，对其他操作无任何影响
     *                     此事件回调函数对双击节点展开功能无任何影响，如果需要设置请参考 setting.view.dblClickExpand 属性
     */
    Newtec.Tree.prototype.beforeDblClick = function (treeId, treeNode) {
        console.log('beforeDblClick');
        if (this.defaults.callback && this.defaults.callback['beforeDblClick']) {
            return this.defaults.callback['beforeDblClick']();
        }
    };
    /**
     * 用于捕获节点被拖拽之前的事件回调函数，并且根据返回值确定是否允许开启拖拽操作
     * @param treeId
     * @param treeNodes Array(JSON) 要被拖拽的节点 JSON 数据集合
     * @returns {boolean} 如果返回 false，zTree 将终止拖拽，也无法触发 onDrag / beforeDrop / onDrop 事件回调函数
     */
    Newtec.Tree.prototype.beforeDrag = function (treeId, treeNodes) {
        console.log('beforeDrag');
        if (this.defaults.callback && this.defaults.callback['beforeDrag']) {
            this.defaults.callback['beforeDrag']();
        }
    };
    /**
     * 用于捕获拖拽节点移动到折叠状态的父节点后，即将自动展开该父节点之前的事件回调函数，并且根据返回值确定是否允许自动展开操作
     * @param treeId
     * @param treeNode
     * @returns {boolean} 如果返回 false，zTree 将无法进行自动展开操作
     */
    Newtec.Tree.prototype.beforeDragOpen = function (treeId, treeNode) {
        console.log('beforeDragOpen');
        if (this.defaults.callback && this.defaults.callback['beforeDragOpen']) {
            this.defaults.callback['beforeDragOpen']();
        }
    };
    Newtec.Tree.prototype.beforeDrop = function (treeId, treeNodes, targetNode, moveType) {
        console.log('beforeDrop');
        if (this.defaults.callback && this.defaults.callback['beforeDrop']) {
            return this.defaults.callback['beforeDrop']();
        }
    };
    Newtec.Tree.prototype.beforeEditName = function (treeId, treeNode) {
        console.log('beforeEditName');
        if (this.defaults.callback && this.defaults.callback['beforeEditName']) {
            return this.defaults.callback['beforeEditName']();
        }
    };
    Newtec.Tree.prototype.beforeExpand = function (treeId, treeNode) {
        console.log('beforeExpand');
        if (this.defaults.callback && this.defaults.callback['beforeExpand']) {
            return this.defaults.callback['beforeExpand'](treeId, treeNode);
        }
    };
    Newtec.Tree.prototype.beforeMouseDown = function (treeId, treeNode) {
        console.log('beforeMouseDown');
        if (this.defaults.callback && this.defaults.callback['beforeMouseDown']) {
            return this.defaults.callback['beforeMouseDown']();
        }
    };
    Newtec.Tree.prototype.beforeMouseUp = function (treeId, treeNode) {
        console.log('beforeMouseUp');
        if (this.defaults.callback && this.defaults.callback['beforeMouseUp']) {
            return this.defaults.callback['beforeMouseUp']();
        }
    };
    Newtec.Tree.prototype.beforeRemove = function (treeId, treeNode) {
        console.log('beforeRemove');
        if (this.defaults.callback && this.defaults.callback['beforeRemove']) {
            return this.defaults.callback['beforeRemove'](treeId, treeNode);
        } else {
            // return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
        }
    };
    Newtec.Tree.prototype.beforeRename = function (treeId, treeNode, newName, isCancel) {
        console.log('beforeRename');
        if (this.defaults.callback && this.defaults.callback['beforeRename']) {
            return this.defaults.callback['beforeRename']();
        }
    };
    /**
     * 用于捕获 zTree 上鼠标右键点击之前的事件回调函数，并且根据返回值确定触发 onRightClick 事件回调函数
     * @param treeId 对应 zTree 的 treeId，便于用户操控
     * @param treeNode 鼠标右键点击时所在节点的 JSON 数据对象
     * @returns {boolean} 如果返回 false，将仅仅无法触发 onRightClick 事件回调函数，对其他操作无任何影响
     * @author 曾文杰
     */
    Newtec.Tree.prototype.beforeRightClick = function (treeId, treeNode) {
        console.log('beforeRightClick');
        if (this.defaults.callback && this.defaults.callback['beforeRightClick']) {
            return this.defaults.callback['beforeRightClick'](treeId, treeNode);
        } else {
            return true;
        }
    };
    Newtec.Tree.prototype.onAsyncError = function (event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
        console.log('onAsyncError');
        if (this.defaults.callback && this.defaults.callback['onAsyncError']) {
            this.defaults.callback['onAsyncError']();
        }
    };
    Newtec.Tree.prototype.onAsyncSuccess = function (event, treeId, treeNode, msg) {
        console.log('onAsyncSuccess');
        if (this.defaults.callback && this.defaults.callback['onAsyncSuccess']) {
            this.defaults.callback['onAsyncSuccess']();
        }
    };
    Newtec.Tree.prototype.onCheck = function (event, treeId, treeNode) {
        console.log('onCheck');
        if (this.defaults.callback && this.defaults.callback['onCheck']) {
            this.defaults.callback['onCheck']();
        }
    };
    Newtec.Tree.prototype.onClick = function (event, treeId, treeNode) {
        console.log('onClick');
        if (this.defaults.callback && this.defaults.callback['onClick']) {
            this.defaults.callback['onClick'](event, treeId, treeNode);
        }
    };
    Newtec.Tree.prototype.onCollapse = function (event, treeId, treeNode) {
        console.log('onCollapse');
        if (this.defaults.callback && this.defaults.callback['onCollapse']) {
            this.defaults.callback['onCollapse']();
        }
    };
    Newtec.Tree.prototype.onDblClick = function (event, treeId, treeNode) {
        console.log('onDblClick');
        if (this.defaults.callback && this.defaults.callback['onDblClick']) {
            this.defaults.callback['onDblClick']();
        }
    };
    Newtec.Tree.prototype.onDrag = function (event, treeId, treeNodes) {
        console.log('onDrag');
        if (this.defaults.callback && this.defaults.callback['onDrag']) {
            this.defaults.callback['onDrag']();
        }
    };
    Newtec.Tree.prototype.onDragMove = function (event, treeId, treeNodes) {
        console.log('onDragMove');
        if (this.defaults.callback && this.defaults.callback['onDragMove']) {
            this.defaults.callback['onDragMove']();
        }
    };
    Newtec.Tree.prototype.onDrop = function (event, treeId, treeNodes, targetNode, moveType) {
        console.log('onDrop');
        if (this.defaults.callback && this.defaults.callback['onDrop']) {
            this.defaults.callback['onDrop']();
        }
    };
    Newtec.Tree.prototype.onExpand = function (event, treeId, treeNode) {
        console.log('onExpand');
        if (this.defaults.callback && this.defaults.callback['onExpand']) {
            this.defaults.callback['onExpand'](event, treeId, treeNode);
        }
    };
    Newtec.Tree.prototype.onMouseDown = function (event, treeId, treeNode) {
        console.log('onMouseDown');
        if (this.defaults.callback && this.defaults.callback['onMouseDown']) {
            this.defaults.callback['onMouseDown']();
        }
    };
    Newtec.Tree.prototype.onMouseUp = function (event, treeId, treeNode) {
        console.log('onMouseUp');
        if (this.defaults.callback && this.defaults.callback['onMouseUp']) {
            this.defaults.callback['onMouseUp']();
        }
    };
    Newtec.Tree.prototype.onNodeCreated = function (event, treeId, treeNode) {
        console.log('onNodeCreated');
        if (this.defaults.callback && this.defaults.callback['onNodeCreated']) {
            this.defaults.callback['onNodeCreated']();
        }
    };
    Newtec.Tree.prototype.onRemove = function (event, treeId, treeNode) {
        console.log('onRemove');
        if (this.defaults.callback && this.defaults.callback['onRemove']) {
            this.defaults.callback['onRemove']();
        }
    };
    Newtec.Tree.prototype.onRename = function (event, treeId, treeNode, isCancel) {
        console.log('onRename');
        if (this.defaults.callback && this.defaults.callback['onRename']) {
            this.defaults.callback['onRename']();
        }
    };
    /**
     * 用于捕获 zTree 上鼠标右键点击之后的事件回调函数
     * 1、如果设置了 setting.callback.beforeRightClick 方法，且返回 false，将无法触发 onRightClick 事件回调函数。
     * 2、只要将 function 的引用赋给 onRightClick 属性，则右键点击 zTree 时，将屏蔽浏览器的右键菜单。
     * @param event 标准的 js event 对象
     * @param treeId 对应 zTree 的 treeId，便于用户操控
     * @param treeNode 鼠标右键点击时所在节点的 JSON 数据对象，如果不在节点上，则返回 null
     * @author 曾文杰
     */
    Newtec.Tree.prototype.onRightClick = function (event, treeId, treeNode) {
        console.log('onRightClick');
        if (this.defaults.callback && this.defaults.callback['onRightClick']) {
            this.defaults.callback['onRightClick'](event, treeId, treeNode);
        } else {
            if (!treeNode) {
                console.log('没有选中菜单');
                return;
            }
            console.log('当前选中菜单=' + treeNode.name);
            var zTree = this.treeObj;
            if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                zTree.cancelSelectedNode();
                this.showRightMenu("root", event.clientX, event.clientY);
            } else if (treeNode && !treeNode.noR) {
                zTree.selectNode(treeNode);
                this.showRightMenu("node", event.clientX, event.clientY);
            }
        }
    };

    //===============以上是zTree的事件===============
    Newtec.Module("Tree")
})();