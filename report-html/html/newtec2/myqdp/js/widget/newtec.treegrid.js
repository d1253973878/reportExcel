/**
 * 组件：treegrid
 * 功能：负责创建tree控件
 * @author 曾文杰
 */
(function () {
    Newtec.TreeGrid = function (params) {
        if (!Newtec.Utils.isJson(params)) {
            return;
        }
        this.defaults = {
            ds: '',
            fetchOperId: '',//查询访问方法
            addOperId: '',//添加访问方法
            delOperId: '',//删除访问方法
            upOperId: '',//更行访问方法
            data: {"parentId": ""},//查询提交数据

            doFetchData: true,
            fetchParam: {
                data: {}
            },//表单查询时的参数
            beforeFetchDataCallback: function (params, response, treeGrid) {
            },//查询回调
            afterFetchDataCallback: function (params, response, treeGrid) {
            },//查询回调

            //=====以下是treegrid的一些事件
            beforeCheck: null,//Function
            afterCheck: null,//Function

            beforeUnCheck: null,//Function
            afterUnCheck: null,//Function

            beforeCollapse: null,//Function
            onCollapse: null,//Function
            afterCollapse: null,//Function

            beforeExpand: null,//Function
            onExpand: null,//Function
            afterExpand: null,//Function

            beforeChange: null,//Function
            onChange: null,//Function
            afterChange: null,//Function

            beforeClick: null,//Function
            onClick: null,//Function
            afterClick: null,//Function

            beforeDbClick: null,//Function
            onDbClick: null,//Function
            afterDbClick: null,//Function

            finsh: null,

            //=====以下是树属性
            column: 1,//列数，目前不明用途
            showCheckbox: true,//是否显示选择框
            showBorder: false,//是否显示边框
            showIcon: true,//是否显示图标
            expand: true,//是否展开
            cascade: 1,//级联方式 1=关联子节点选中 2=只选择当前节点 3=关联父节点 4=关联父子节点
            async: false,//异步加载,
            saveState: false,//保存状态
            iconType: 2,//图标类型，1=font 2=图片
            fontIcon: "",//iconType=1时有效

            //=====以下是样式
            tableClass: 'table table-condensed',//用的是bootstrap的样式 表格+表格紧缩+表格边框
            tableStyle: '',
            trClass: '',
            trStyle: '',
            tdClass: '',
            tdStyle: '',
            checkboxClass: '',
            checkboxStyle: '',
            iconClass: '',
            iconStyle: '',

            //=====以下是会用到的一些KEY
            key: {
                id: "id",
                parentId: "parentId",
                children: "children"
            }
        };
        this.defaults = $.extend(this.defaults, params, {});
        this.fetchParam = this.defaults.fetchParam;
        var ds = this.defaults.ds;
        this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;
        if (!this.ds) {
            alert('ds is undefined');
            return;
        }

        this.treeGridJQ = undefined;//treeGrid jquery 对象
        this.pageDatas = [];//后台请求得到的数据，数组形式，即原始数据
        this.treeGridJsonData = {};//转换之后的数据，json形式，key-value
        this.pageJsonData = {};//转换之后的层级数据，通过children
        this.treeGridSetting = {};
        this.clickedRecord = undefined;//当前点击的节点

        this.tempHtml = "";//临时用的变量，不要随便用

        //=====
        this.clickTimer = undefined;//解决dblclick会调用两次click的问题
        this.isExpand = false;//解决expand时会调用到click事件，用来判断expand和click
        this.isCheckbox = false;//同上,解决checkbox时会调用到click事件，用来判断checkbox和click
        this.isFirstInit = true;
    };
    Newtec.TreeGrid.exte(Newtec.Base, 'treeGrid');
    Newtec.TreeGrid.PREFIX = {
        checkbox: 'checkbox_',
        icon: 'icon_'
    };
    Newtec.TreeGrid.over({
        createNewtecJQ: function (params) {
            var that = this;
            this.treeGridJQ = this.createTreeGrid();
            if (this.defaults.doFetchData) {
                this.fetchData(params);
            }
            return this.treeGridJQ;
        },
        /**
         * 这里只负责创建table，具体内部的tr td由setData负责创建
         */
        createTreeGrid: function () {

            this.treeGridId = "treegrid_" + Newtec.Utils.uuid16();
            var tableClass = "tree " + this.defaults.tableClass,
                tableStyle = this.defaults.tableStyle;
            if (this.defaults.showBorder == true) {
                tableClass += " table-bordered";
            }
            var html = "<table id='" + this.treeGridId + "' class='" + tableClass + "' style='" + tableStyle + "'></table>";
            return $(html);
        },
        /**
         * 查询数据，初始化treegrid
         */
        fetchData: function (params) {
            var that = this;
            // params = $.extend(params, this.fetchParam);
            if (Newtec.Utils.isNull(this.ds)) {
                Newtec.Window.createHint({html: '数据源为空！', className: 'btn btn-danger'});
                return;
            }
            if (this.defaults.async == true) {
                alert('异步加载暂未实现');
            }
            params["operId"] = this.defaults["fetchOperId"];
            params["callback"] = function (response) {
                if (Newtec.Utils.isFunction(that.defaults.beforeFetchDataCallback)) {
                    that.defaults.beforeFetchDataCallback(params, response, that);
                }
                if (response.status != 0) {
                    Newtec.Window.createHint({html: '查询数据出错！', className: 'btn btn-danger'});
                    return;
                }
                that.pageDatas = response.data;
                that.setData(response.data);
                that.initTreeGrid();
                if (Newtec.Utils.isFunction(that.defaults.afterFetchDataCallback)) {
                    that.defaults.afterFetchDataCallback(params, response, that);
                }
            };
            console.log("params", params);
            this.ds.fetchData(params);
        },
        initTreeGrid: function () {
            var that = this;
            var initialState = "expanded";
            if (that.defaults.expand == false) {
                initialState = "collapsed";
            }
            that.treeGridSetting = {
                'initialState': initialState,
                'saveState': that.defaults.saveState,
                /**
                 * Function, which will be executed when one of node will be expanded or collapsed
                 */
                'onChange': function () {
                    if (Newtec.Utils.isFunction(that.defaults.beforeChange)) {
                        that.defaults.beforeChange();
                    }
                    if (Newtec.Utils.isFunction(that.defaults.onChange)) {
                        that.defaults.onChange();
                    }
                    if (Newtec.Utils.isFunction(that.defaults.afterChange)) {
                        that.defaults.afterChange();
                    }
                },
                /**
                 *    Function, which will be executed when one of node will be collapsed
                 */
                'onCollapse': function () {
                    that.isExpand = true;
                    if (Newtec.Utils.isFunction(that.defaults.beforeCollapse)) {
                        that.defaults.beforeCollapse();
                    }
                    if (Newtec.Utils.isFunction(that.defaults.onCollapse)) {
                        that.defaults.onCollapse();
                    }
                    if (Newtec.Utils.isFunction(that.defaults.afterCollapse)) {
                        that.defaults.afterCollapse();
                    }
                },
                /**
                 * Function, which will be executed when one of node will be expanded
                 */
                'onExpand': function () {
                    that.isExpand = true;
                    if (Newtec.Utils.isFunction(that.defaults.beforeExpand)) {
                        that.defaults.beforeExpand();
                    }
                    if (Newtec.Utils.isFunction(that.defaults.onExpand)) {
                        that.defaults.onExpand();
                    }
                    if (Newtec.Utils.isFunction(that.defaults.afterExpand)) {
                        that.defaults.afterExpand();
                    }
                }
            };
            that.treeGridJQ.treegrid(that.treeGridSetting);
            that.isFirstInit = false;
        },
        /**
         * 获取数据
         * @returns {Array|*}
         */
        getData: function () {
            return this.pageDatas;
        },
        /**
         * 设置数据
         * @param data
         * @param isAppend 默认值为false，true表示保留原来的旧数据，新的数据追加，false为清空数据再添加
         */
        setData: function (data, isAppend) {
            if (isAppend == false) {
                this.treeGridJQ.empty();
            }
            var that = this;
            var html = "";

            var arr = this.transData(data, "id", "parentId", "children");
            this.pageJsonData = arr;

            // g(arr);
            this.tempHtml = "";
            this.recursion(arr);
            html = this.tempHtml;

            /**
             * 递归遍历生成html
             * @param a 数组
             */
            function g(a) {
                for (var i = 0; i < a.length; i++) {
                    var b = a[i];
                    that.treeGridJsonData[b["id"]] = b;
                    html += that.createRowHtml(b);
                    if (b["children"]) {
                        g(b["children"]);
                    }
                }
            }

            if (isAppend != true) {
                that.pageDatas = data;
            } else {
                that.pageDatas.push(data);
            }
            this.treeGridJQ.append($(html));
            if (this.isFirstInit == false) {
                //第一次初始化，即fetchData里面也调用到了这样的方法，除开第一次都要调用这方法
                that.treeGridJQ.treegrid(that.treeGridSetting);
            }
        },
        /**
         * 创建表格行的html
         */
        createRowHtml: function (params) {
            var showCheckbox = this.defaults.showCheckbox,
                showIcon = this.defaults.showIcon,
                prefix_checkbox = Newtec.TreeGrid.PREFIX.checkbox,
                prefix_icon = Newtec.TreeGrid.PREFIX.icon;
            var trClass = this.defaults.trClass,
                trStyle = this.defaults.trStyle,
                tdClass = this.defaults.tdClass,
                tdStyle = this.defaults.tdStyle,
                checkboxClass = this.defaults.checkboxClass,
                checkboxStyle = this.defaults.checkboxStyle,
                iconClass = this.defaults.iconClass,
                iconStyle = this.defaults.iconStyle;
            if (this.defaults.showBorder == false) {
                tdStyle += " border:none;";
            }
            var tr_class = trClass + 'treegrid-' + params["id"];
            if (params["parentId"]) {
                tr_class += ' treegrid-parent-' + params["parentId"];
            }
            var html = "";
            html += "<tr class='" + tr_class + "' style='" + trStyle + "'>\n";
            html += "<td class='" + tdClass + "' style='" + tdStyle + "'>\n";
            //这里不需要再计算缩进，借由调用this.treeGridJQ.treegrid("initTree")计算
            // var depth = parent.treegrid("getDepth");//父节点深度
            // for (var i = 0; i < depth + 1; i++) {
            //     html += "<span class='treegrid-indent'></span>";
            // }
            // html += "<span class='treegrid-expander'></span>";
            if (showCheckbox) {
                html += "<input type='checkbox' id='" + prefix_checkbox + "" + params["id"] + "' class='" + checkboxClass + "' style='" + checkboxStyle + "'/>\n";
            }
            if (showIcon) {
                if (this.defaults.iconType == 1) {
                    html += "<i class='" + params["fontIcon"] + "' style='margin-right:5px;'></i>";
                } else {
                    html += "<img src='" + params["icon"] + "'/>\n";
                }
            }
            html += "<span id='text_" + params["id"] + "'>" + params["name"] + "</span>\n";
            html += "</td>\n";
            for (var j = 1; j < this.defaults.column; j++) {
                html += "<td>" + params["id"] + "</td>\n";
            }
            html += "</tr>\n";
            return html;
        },
        /**
         * json格式转树状结构
         * @param a json数据
         * @param idStr id的字符串
         * @param pidStr 父id的字符串
         * @param chindrenStr children的字符串
         * @returns {Array} 数组
         */
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
         * 递归生成html
         * @param a json数组
         */
        recursion: function (a) {
            for (var i = 0; i < a.length; i++) {
                var b = a[i];
                this.treeGridJsonData[b["id"]] = b;
                this.tempHtml += this.createRowHtml(b);
                if (b["children"]) {
                    this.recursion(b["children"]);
                }
            }
        },

        //=====增删改=====
        addData: function (record, operId, callback) {
            if (Newtec.Utils.isNull(this.ds)) {
                return;
            }
            var that = this;
            this.ds.addData({
                "operId": operId,
                "data": record,
                "callback": function (response) {
                    if (response["status"] == 0) {
                        that.addRecords(Newtec.Utils.isNull((response["data"]) ? record : response["data"]));
                    }
                    if (Newtec.Utils.isFunction(callback)) {
                        callback(response);
                    }
                }
            });
        },
        addRecords: function (params, doInitTreeGrid) {
            if (Newtec.Utils.isArray(params)) {
                for (var i = 0; i < params.length; i++) {
                    var b = params[i];
                    var html = this.createRowHtml(b);
                    this.pageDatas.push(b);

                    this.treeGridJsonData[b["id"]] = b;
                    if (Newtec.Utils.isNull(b["parentId"])) {
                        this.treeGridJQ.append($(html));
                    } else {
                        var parent = $(".treegrid-" + b["parentId"]);
                        parent.after($(html));
                    }
                }
            } else {
                var html = this.createRowHtml(params);
                this.pageDatas.push(params);
                this.treeGridJsonData[params["id"]] = params;
                if (Newtec.Utils.isNull(params["parentId"])) {
                    this.treeGridJQ.append($(html));
                } else {
                    var parent = $(".treegrid-" + params["parentId"]);
                    parent.after($(html));
                }
            }
            // this.treeGridJQ.treegrid(this.treeGridSetting);
            if (!(doInitTreeGrid == false)) {
                this.initTreeGrid();
            }
        },
        updateData: function (record, operId, callback) {
            if (Newtec.Utils.isNull(this.ds)) {
                return;
            }
            var that = this;
            this.ds.updateData({
                "operId": operId,
                "data": record,
                "callback": function (response) {
                    if (response["status"] == 0) {
                        that.updateRecords(Newtec.Utils.isNull((response["data"]) ? record : response["data"]));
                    }
                    if (Newtec.Utils.isFunction(callback)) {
                        callback(response);
                    }
                }
            });
        },
        updateRecords: function (params) {
            var thisTR = $(".treegrid-" + params["id"]);
            var newHtml = this.createRowHtml(params);
            thisTR.prop('outerHTML', newHtml);
            this.treeGridJQ.treegrid(this.treeGridSetting);
        },
        removeData: function (records, operId, callback) {
            if (Newtec.Utils.isNull(this.ds)) {
                return;
            }
            var that = this;
            this.ds.removeData({
                "operId": operId,
                "data": records,
                "callback": function (response) {
                    that.removeRecords(records);
                    if (Newtec.Utils.isFunction(callback)) {
                        callback(response);
                    }
                }
            });
        },
        removeRecords: function (params) {
            var thisTR = $(".treegrid-" + params["id"]);
            thisTR.remove();
            this.treeGridJQ.treegrid(this.treeGridSetting);
        },
        //=====增删改=====

        getSelectedRowJson: function () {
            var that = this;
            var arr = [];
            this.treeGridJQ.find("tr").each(function () {
                var thisTR = this;
                var a = $(this).find("input[type='checkbox']");
                if (a.prop("checked")) {
                    var id = that.getNodeId(thisTR);
                    var json = that.treeGridJsonData[id];
                    arr.push(json);
                }
            });
            return arr;
        },
        getClickedRecord: function () {
            return this.clickedRecord;
        },
        getSelectedRecords: function () {
            var that = this;
            var arr = [];
            this.treeGridJQ.find("tr").each(function () {
                var thisTR = this;
                var a = $(this).find("input:checkbox:checked");
                if (a.prop("checked")) {
                    var id = that.getNodeId(thisTR);
                    var json = that.treeGridJsonData[id];
                    arr.push(json);
                }
            });
            return arr;
        },
        selectByData: function (datas) {
            var that = this;
            for (var i = 0; i < datas.length; i++) {
                var a = datas[i];
                $("#checkbox_" + a["id"]).prop("checked", "checked");
            }
        },
        selectAll: function (isSelectAll) {
            if (isSelectAll == false) {
                this.treeGridJQ.find("input:checkbox").removeAttr("checked");
            } else {
                this.treeGridJQ.find("input[type='checkbox']").prop("checked", "checked");
            }
        },
        /**
         * 初始化checkbox的事件
         */
        initCheckboxEvent: function () {
            //.treegrid('getChildNodes') 这个方法只能获取下一级的节点，不能所有所有的子节点
            var that = this;
            that.treeGridJQ.on("change", "input[type='checkbox']", function () {
                that.isCheckbox = true;

                var id = $(this).attr('id').replace(Newtec.TreeGrid.PREFIX.checkbox, "");
                if ($(this).is(':checked')) {
                    //before check
                    if (Newtec.Utils.isFunction(that.defaults.beforeCheck)) {
                        that.defaults.beforeCheck();
                    }

                    function setCheck(element) {
                        var ele = $(element),
                            l = that.getChildNodes(ele);
                        if (!Newtec.Utils.isNull(l)) {
                            l.each(function () {
                                $(this).find("input[type='checkbox']").prop("checked", "checked");
                                setCheck(this);
                            });
                        }
                    }

                    function setParentCheck(element) {
                        var ele = $(element),
                            l = that.getParentNode(ele);
                        if (!Newtec.Utils.isNull(l)) {
                            l.each(function () {
                                $(this).find("input[type='checkbox']").prop("checked", "checked");
                                setParentCheck(this);
                            });
                        }
                    }

                    if (that.defaults.cascade == 1) {
                        setCheck($("#" + that.treeGridId + " .treegrid-" + id));
                    } else if (that.defaults.cascade == 2) {
                    } else if (that.defaults.cascade == 3) {
                        setParentCheck($("#" + that.treeGridId + " .treegrid-" + id));
                    } else if (that.defaults.cascade == 4) {
                        var bb = $("#" + that.treeGridId + " .treegrid-" + id);
                        setCheck(bb);
                        setParentCheck(bb);
                    }

                    //after check
                    if (Newtec.Utils.isFunction(that.defaults.afterCheck)) {
                        that.defaults.afterCheck();
                    }
                } else {
                    //before unCheck
                    if (Newtec.Utils.isFunction(that.defaults.beforeUnCheck)) {
                        that.defaults.beforeUnCheck();
                    }

                    if (that.defaults.cascade == 1) {
                        setUnCheck($("#" + that.treeGridId + " .treegrid-" + id));
                    } else if (that.defaults.cascade == 2) {
                    } else if (that.defaults.cascade == 3) {
                        setParentUnCheck($("#" + that.treeGridId + " .treegrid-" + id));
                    } else if (that.defaults.cascade == 4) {
                        var bb = $("#" + that.treeGridId + " .treegrid-" + id);
                        setUnCheck(bb);
                        setParentUnCheck(bb);
                    }

                    function setUnCheck(element) {
                        var ele = $(element),
                            l = that.getChildNodes(ele);
                        if (!Newtec.Utils.isNull(l)) {
                            l.each(function () {
                                $(this).find("input[type='checkbox']").removeAttr("checked");
                                setUnCheck(this);
                            });
                        }
                    }

                    function setParentUnCheck(element) {
                        var ele = $(element),
                            l = that.getParentNode(ele);
                        if (!Newtec.Utils.isNull(l)) {
                            l.each(function () {
                                $(this).find("input[type='checkbox']").removeAttr("checked");
                                setParentUnCheck(this);
                            });
                        }
                    }

                    //after unCheck
                    if (Newtec.Utils.isFunction(that.defaults.afterUnCheck)) {
                        that.defaults.afterUnCheck();
                    }
                }
            });
        },
        /**
         * 初始化click事件
         */
        initClickEvent: function () {
            var that = this;
            that.treeGridJQ.on("click", "tr", function () {
                var thisTR = this;//当前点击的tr行
                var id = that.getNodeId(this);
                that.clickedRecord = that.treeGridJsonData[id];
                that.treeGridJQ.find("tr").css("background-color", "");
                $(thisTR).css("background-color", "rgb(191, 205, 245)");
                clearTimeout(that.clickTimer);
                that.clickTimer = setTimeout(function () {
                    if (that.isExpand == false && that.isCheckbox == false) {
                        var beforeClickFunction = that.defaults.beforeClick,
                            onClickFunction = that.defaults.onClick,
                            afterClickFunction = that.defaults.afterClick;
                        if (Newtec.Utils.isFunction(beforeClickFunction)) {
                            beforeClickFunction(thisTR);
                        }
                        if (Newtec.Utils.isFunction(onClickFunction)) {
                            onClickFunction(thisTR);
                        }
                        if (Newtec.Utils.isFunction(afterClickFunction)) {
                            afterClickFunction(thisTR);
                        }
                    } else {
                        that.isExpand = false;
                        that.isCheckbox = false;
                    }
                }, 200);
            });
        },
        /**
         * 初始化double click事件
         */
        initDbClickEvent: function () {
            var that = this;
            that.treeGridJQ.on("dblclick", "tr", function () {
                var thisTR = this;//当前点击的tr行
                var id = that.getNodeId(this);
                that.clickedRecord = that.treeGridJsonData[id];
                that.treeGridJQ.find("tr").css("background-color", "");
                $(thisTR).css("background-color", "rgb(191, 205, 245)");
                clearTimeout(that.clickTimer);
                var beforeDbClickFunction = that.defaults.beforeDbClick,
                    onDbClickFunction = that.defaults.onDbClick,
                    afterDbClick = that.defaults.afterDbClick;
                if (Newtec.Utils.isFunction(beforeDbClickFunction)) {
                    beforeDbClickFunction(thisTR);
                }
                if (Newtec.Utils.isFunction(onDbClickFunction)) {
                    onDbClickFunction(thisTR);
                }
                if (Newtec.Utils.isFunction(afterDbClick)) {
                    afterDbClick(thisTR);
                }
            });
        },
        finsh: function (params) {
            this.initCheckboxEvent();
            this.initClickEvent();
            this.initDbClickEvent();
            if (Newtec.Utils.isFunction(this.defaults.finsh)) {
                this.defaults.finsh(params);
            }
        }
    });

    //=====以下是jquery treegrid public methods

    Newtec.TreeGrid.prototype.getRootNodes = function () {
        return this.treeGridJQ.treegrid('getRootNodes');
    };

    Newtec.TreeGrid.prototype.getNodeId = function (thisNode) {
        return $(thisNode).treegrid('getNodeId');
    };

    Newtec.TreeGrid.prototype.getParentNodeId = function (thisNode) {
        return $(thisNode).treegrid('getParentNodeId');
    };

    Newtec.TreeGrid.prototype.getAllNodes = function () {
        return this.treeGridJQ.treegrid('getAllNodes');
    };

    Newtec.TreeGrid.prototype.getParentNode = function (thisNode) {
        return $(thisNode).treegrid('getParentNode');
    };

    Newtec.TreeGrid.prototype.getChildNodes = function (thisNode) {
        return $(thisNode).treegrid('getChildNodes');
    };

    Newtec.TreeGrid.prototype.getDepth = function (thisNode) {
        return $(thisNode).treegrid('getDepth');
    };

    Newtec.TreeGrid.prototype.isNode = function (thisNode) {
        return $(thisNode).treegrid('isNode');
    };

    Newtec.TreeGrid.prototype.isLeaf = function (thisNode) {
        return $(thisNode).treegrid('isLeaf');
    };

    Newtec.TreeGrid.prototype.isLast = function (thisNode) {
        return $(thisNode).treegrid('isLast');
    };

    Newtec.TreeGrid.prototype.isFirst = function (thisNode) {
        return $(thisNode).treegrid('isFirst');
    };

    Newtec.TreeGrid.prototype.isExpanded = function (thisNode) {
        return $(thisNode).treegrid('isExpanded');
    };

    Newtec.TreeGrid.prototype.isCollapsed = function (thisNode) {
        return $(thisNode).treegrid('isCollapsed');
    };

    Newtec.TreeGrid.prototype.isOneOfParentsCollapsed = function (thisNode) {
        return $(thisNode).treegrid('isOneOfParentsCollapsed');
    };

    Newtec.TreeGrid.prototype.expand = function (thisNode) {
        return $(thisNode).treegrid('expand');
    };

    Newtec.TreeGrid.prototype.collapse = function (thisNode) {
        return $(thisNode).treegrid('collapse');
    };

    Newtec.TreeGrid.prototype.expandRecursive = function (thisNode) {
        return $(thisNode).treegrid('expandRecursive');
    };

    Newtec.TreeGrid.prototype.collapseRecursive = function (thisNode) {
        return $(thisNode).treegrid('collapseRecursive');
    };

    Newtec.TreeGrid.prototype.expandAll = function () {
        return this.treeGridJQ.treegrid('expandAll');
    };

    Newtec.TreeGrid.prototype.collapseAll = function () {
        return this.treeGridJQ.treegrid('collapseAll');
    };

    Newtec.TreeGrid.prototype.toggle = function (thisNode) {
        return $(thisNode).treegrid('toggle');
    };

    Newtec.TreeGrid.prototype.render = function (thisNode) {
        return $(thisNode).treegrid('render');
    };
    Newtec.Module("TreeGrid")
})();
