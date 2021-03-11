/**
 * 文件编辑选择页面
 * @author 曾文杰
 */
(function () {
    Newtec.FilePage = function (params) {
        this.defaults = {
            "ds": "",

            "showFileDetail": true,//点击文件时是否显示文件内容
            "showNewFileButton": true,//是否显示新建按钮
            "showSaveFileButton": true,//是否显示保存按钮，注意必须showFileDetail为true才有
            "showCheckbox": false,
            "showIcon": true,
            "showLoadingHint": false,

            "width": "1024",//window整体宽度
            "treeWidth": "300",//tree宽度
            "height": "5000",

            "iconType": 1,//图标类型，1=font 2=图片
            "fileIcon": "fa fa-file-o",
            "folderIcon": "fa fa-folder-open-o",

            "mainUrl": "",

            "suffix": "html,htm,jsp,js,css",//加载的文件后缀，type为2时无效
            "type": "1",//1=加载文件，2=只加载文件夹
            "pathType": "1",//预设路径类型，1=WebContent，2=

            "footer": []
        };
        this.defaults = $.extend(this.defaults, params, {});
        var ds = this.defaults.ds;
        this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;

        this.leftId = "";
        this.rightId = "";
        this.leftJQ = null;//左侧树
        this.rightJQ = null;//右侧显示内容区域
        this.textareaDivJQ = null;//内容部分
        this.editor = null;//编辑器
        this.treeData = {};//文件树数据
    };
    Newtec.FilePage.exte(Newtec.Base, 'filePage');
    Newtec.FilePage.over({
        createNewtecJQ: function (params) {
            console.time("创建文件树");

            var that = this;

            //弹框底部按钮
            if (that.defaults["showFileDetail"] == true && that.defaults["showSaveFileButton"] == true) {
                that.defaults["footer"].push(Newtec.Button.create({
                    "title": "保存",
                    "className": 'btn-success',
                    "click": function () {
                        var newContent = that.editor.getValue();
                        var treeNode = that.treeNewtecJQ.getSelectedNode();
                        that.ds.updateData({
                            operId: 'updateData',
                            data: {content: newContent, id: treeNode.id},
                            callback: function (response) {
                                if (response.status == 0) {
                                    Newtec.Window.createHint({html: '成功！', className: 'btn btn-danger'});
                                } else {
                                    Newtec.Window.createHint({html: '失败！' + response.failureMessage, className: 'btn btn-danger'});
                                }
                            }
                        });
                    }
                }));
            }
            //弹框顶部按钮
            var newBtn = Newtec.Button.create({
                title: '新建',
                click: function () {
                    var zTree = treeNewtecJQ.getTreeObj();
                    if (!zTree) {
                        alert('ztree is undefined');
                        return;
                    }
                    var nodes = zTree.getSelectedNodes(),
                        treeNode = nodes[0];
                    if (!treeNode) {
                        alert('treenode is undefined');
                        return;
                    }
                    var addNewFileNameWindow = Newtec.Window.create({
                        title: '新建文件',
                        width: 450,
                        body: $("<div><form class='form-horizontal'> <div class='form-group'> <label class='col-sm-2 control-label'>文件名</label> <div class='col-sm-10'> <input type='text' class='form-control' id='newFileName'> </div> </div> </form></div>"),
                        footer: Newtec.Button.create({
                            title: '选择',
                            click: function () {
                                var newName = $('#newFileName').val();
                                if (!newName || newName == '') {
                                    alert('name is null');
                                    return;
                                }
                                var parentId = '';
                                if (treeNode.isParent) {
                                    var h = treeNode.getParentNode();
                                    if (h) {
                                        parentId = h.id;
                                    }
                                } else {
                                    parentId = treeNode.parentId ? '' : treeNode.parentId;
                                }
                                var newNodes = {parentId: parentId, isParent: false, name: newName};
                                // zTree.addNodes(treeNode, newNodes);
                                that.ds.fetchData({
                                    operId: 'addNewFile',
                                    data: {parentId: treeNode.id, name: newName, content: newName},
                                    callback: function (response) {
                                        if (response.status == 0) {
                                            Newtec.Window.createHint({html: '成功！', className: 'btn btn-danger'});
                                            treeNewtecJQ.setData(response.data);
                                        } else {
                                            Newtec.Window.createHint({html: '失败！' + response.failureMessage, className: 'btn btn-danger'});
                                        }
                                    }
                                });
                            }
                        })
                    });
                }
            });
            newBtn.newtecJQ.css("margin-left", "10px");
            that.newBtn = newBtn;

            //弹框
            var windowBodyId = Newtec.Utils.uuid16(),
                windowBodyJQ = $("<div id='" + windowBodyId + "' style='height:100%;'></div>");
            var chooseWindow = Newtec.Window.create({
                title: '选择文件',
                width: that.defaults.width,
                height: that.defaults.height,
                body: windowBodyJQ,
                footer: that.defaults["footer"],
                finsh: function () {
                    if (that.defaults["showFileDetail"] == true) {
                        that.createNewTextarea("");
                    }

                    that.setTitle("选择文件");
                }
            });
            chooseWindow.winBody.css('padding', "0");
            this.chooseWindow = chooseWindow;

            //创建左右两部分，左边显示树，右边显示内容
            var leftId = "left_" + Newtec.Utils.uuid16(),
                rightId = "right_" + Newtec.Utils.uuid16(),
                leftJQ = $("<div id='" + leftId + "' style='width:" + this.defaults["treeWidth"] + "px;float:left;height:100%;'></div>"),
                rightJQ = $("<div id='" + rightId + "' style='margin-left: " + this.defaults["treeWidth"] + "px;'></div>"),
                // leftHead = createHead(),
                // rightHead = createHead(),
                textareaDivID = Newtec.Utils.uuid16(),
                textareaDivJQ = $("<div id='" + textareaDivID + "' style=''></div>");
            // leftJQ.append(leftHead);
            // rightJQ.append(rightHead);
            this.leftId = leftId;
            this.rightId = rightId;
            this.leftJQ = leftJQ;
            this.rightJQ = rightJQ;
            this.textareaDivID = textareaDivID;
            this.textareaDivJQ = textareaDivJQ;
            windowBodyJQ.append(leftJQ);
            if (that.defaults["showFileDetail"]) {
                rightJQ.append(textareaDivJQ);
                windowBodyJQ.append(rightJQ);
            }

            function createHead() {
                var html = "<div style='width:100%;height:35px; line-height:35px; background:#e8ebf3;'></div>";
                return $(html);
            }

            console.timeEnd("创建文件树");
            return windowBodyJQ;
        },
        getClickedRecord: function () {
            return this.treeNewtecJQ.getClickedRecord();
        },
        close: function () {
            this.chooseWindow.close();
        },
        showLoading: function () {
            if (Newtec.Utils.isNull(this.loadingJQ)) {
                var html = "<div id='loading' style='display:none;position:absolute;right:50px;top:10px;background:#000;color:#fff;'>正在加载中....</div>";
                this.loadingJQ = $(html);
                $("body").append(this.loadingJQ);
            }
            this.loadingJQ.show();
        },
        hideLoading: function () {
            if (!Newtec.Utils.isNull(this.loadingJQ)) {
                this.loadingJQ.hide();
            }
        },
        createNewTextarea: function (data, suffix) {
            var that = this;
            var textareaID = Newtec.Utils.uuid16(),
                ccc = Newtec.Utils.uuid16();
            //清空原有内容，并加载到textarea里面
            this.textareaDivJQ.empty();
            this.textareaDivJQ.append("<div id='" + ccc + "' style='position:absolute;top:0;bottom:0;right:0;left:300px;'><textarea id='" + textareaID + "'></textarea></div>");
            $("#" + textareaID).text(data.content);
            //创建编辑器
            var textarea = document.getElementById(textareaID);
            var mode = "text/html";
            if (suffix == "css") {
                mode = "text/css";
            } else if (suffix == "js") {
                mode = "javascript";
            }
            var editor = CodeMirror.fromTextArea(textarea, {
                // styleActiveLine: true,//line选择是是否加亮
                lineNumbers: true,//是否显示行数
                lineWrapping: true,//是否自动换行
                mode: mode
            });
            that.editor = editor;
            //添加样式保持编辑器高度100%
            $('#' + ccc + ' .CodeMirror').css({"height": "100%"});
            this.chooseWindow.winFooter.prepend($("<span>" + new Date(data.lastModified) + "</span>"));
        },
        finsh: function (params) {
            var that = this;
            // 弄个定时器先把弹框显示出来，不然卡死页面
            // var a = Newtec.Window.createHint({html: '<span>正在加载中，请耐心等待……<span>'});
            setTimeout(function () {
                //创建左边树
                var treeNewtecJQ = Newtec.TreeGrid.create({
                    "appendTo": "#" + that.leftId,
                    "ds": that.ds["dsName"],
                    "autoFetch": false,
                    "showBorder": false,
                    "showCheckbox": that.defaults["showCheckbox"],
                    "showIcon": that.defaults["showIcon"],
                    "iconType": 1,
                    "showFunctionButtons": false,
                    "expand": false,
                    "beforeFetchDataCallback": function (params, response, treeGrid) {
                        // a.close();
                    },
                    "onClick": function (thisTR) {
                        var id = treeNewtecJQ.getNodeId(thisTR);
                        var data = treeNewtecJQ.treeGridJsonData[id];

                        var newTitle = $("<div></div>");
                        newTitle.append("<div class='pull-left'>选择文件：" + data["name"] + "</div>");
                        if (that.defaults["showNewFileButton"] == true) {
                            newTitle.append($("<div class='pull-right'></div>").append(that.newBtn.newtecJQ.css("margin-right", "10px")));
                        }
                        that.chooseWindow.winHeaderTitle.empty();
                        that.chooseWindow.winHeaderTitle.append(newTitle);

                        if (that.defaults["showFileDetail"] == true) {
                            var path = data["path"];
                            that.ds.fetchData({
                                "operId": "getPageDetail",
                                "data": {"path": path},
                                "callback": function (response) {
                                    var index1 = path.lastIndexOf(".");
                                    var index2 = path.length;
                                    var suffix = path.substring(index1 + 1, index2);//后缀名
                                    that.createNewTextarea(response.data, suffix);
                                }
                            });
                        }
                    }
                });
                that.treeNewtecJQ = treeNewtecJQ;
                that.ds.fetchData({
                    "operId": 'getPageData',
                    "data": {suffix: that.defaults["suffix"], "type": that.defaults["type"], "mainUrl": that.defaults["mainUrl"]},
                    callback: function (response) {
                        var a = that.treeNewtecJQ.transData(response.data, "id", "parentId", "children");
                        // that.treeNewtecJQ.addRecords(response.data);
                        //先把第一层拿出来生成，
                        //再开始遍历第二层
                        var firstLevel = [];
                        var secondLevel = [];
                        var otherLevel = [];
                        for (var i = 0; i < a.length; i++) {
                            var b = a[i];
                            if (b["isFile"]) {
                                b.fontIcon = that.defaults.fileIcon;
                            } else {
                                b.fontIcon = that.defaults.folderIcon
                            }
                            firstLevel.push(b);
                            if (b["children"]) {
                                var c = b["children"];
                                for (var j = 0; j < c.length; j++) {
                                    var d = c[j];
                                    if (d["isFile"]) {
                                        d.fontIcon = that.defaults.fileIcon;
                                    } else {
                                        d.fontIcon = that.defaults.folderIcon
                                    }
                                    secondLevel.push(d);
                                }
                            }
                        }
                        that.treeNewtecJQ.addRecords(firstLevel);
                        that.treeNewtecJQ.addRecords(secondLevel, true);
                        for (var i = 0; i < secondLevel.length; i++) {
                            var b = secondLevel[i];
                            if (b["children"]) {
                                g(b["children"]);
                            }
                        }
                        function g(a) {
                            for (var i = 0; i < a.length; i++) {
                                var b = a[i];
                                if (b["isFile"]) {
                                    b.fontIcon = that.defaults.fileIcon;
                                } else {
                                    b.fontIcon = that.defaults.folderIcon
                                }
                                otherLevel.push(b);
                                if (b["children"]) {
                                    g(b["children"]);
                                }
                            }
                        }

                        that.setTitle("正在加载……");

                        setTimeout(function () {
                            that.treeNewtecJQ.addRecords(otherLevel, true);
                            that.setTitle("选择文件");
                        }, 300);
                        // g(a);
                    }
                });

                //设置滚动条
                that.leftJQ.mCustomScrollbar({
                    theme: "minimal-dark",
                    scrollInertia: 200
                });
            }, 500);
        },
        setTitle: function (title) {
            var that = this;
            var newTitle = $("<div></div>");
            newTitle.append("<div class='pull-left'>" + title + "</div>");
            if (that.defaults["showNewFileButton"] == true) {
                newTitle.append($("<div class='pull-right'></div>").append(that.newBtn.newtecJQ.css("margin-right", "10px")));
            }
            that.chooseWindow.winHeaderTitle.empty();
            that.chooseWindow.winHeaderTitle.append(newTitle);
        },
        setFooter: function () {}
    });
    Newtec.Module("FilePage")
})();