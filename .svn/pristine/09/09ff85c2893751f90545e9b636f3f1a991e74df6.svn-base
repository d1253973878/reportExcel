(function () {
    Newtec.PagePage = function (params) {
        this.defaults = {
            ds: '',

            beforeTreeClick: function (event, treeId, treeNode) {},//树点击事件之前
            afterTreeClick: function (event, treeId, treeNode) {},//树点击事件之后

            beforeModifyBtnClick: function (event, treeId, treeNode) {},//修改按钮点击事件之前
            modifyBtnClick: null,//修改按钮点击事件
            afterModifyBtnClick: function (event, treeId, treeNode) {}//修改按钮点击事件之后
        };
        this.defaults = $.extend(this.defaults, params, {});
        var ds = this.defaults.ds;
        this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;
        if (!this.ds) {
            console.log("ds is undefined");
            alert('ds is undefined');
        }
        this.currentSelectApplicationId = parent.Newtec.powerCurrentSelectAppId;
    };

    Newtec.PagePage.exte(Newtec.Base, 'pagePage');
    Newtec.PagePage.over({
        createNewtecJQ: function (params) {
            var pageThis = this,
                pageThisJQ = $(pageThis.defaults.appendTo);
            //创建顶部应用部分
            var topId = Newtec.Utils.uuid16();
            pageThisJQ.append($("<div id='" + topId + "' style=''></div>"));
            //创建左右两部分，左边显示树，右边显示内容
            var leftId = Newtec.Utils.uuid16(),
                rightId = Newtec.Utils.uuid16();
            pageThisJQ.append($("<div id='" + leftId + "' style='width:300px;float:left;'></div>"));
            pageThisJQ.append($("<div id='" + rightId + "' style='margin-left: 300px;'></div>"));
            var leftHead = pageThis.createHead(),
                rightHead = pageThis.createHead();
            var rightJQ = $('#' + rightId);
            $('#' + leftId).append(leftHead);
            //创建顶部
            // var topForm = Newtec.Form.create({
            //     appendTo: '#' + topId,
            //     titleColumn: 3,
            //     columnNum: 1,
            //     ds: Newtec.DS.get('application')
            // });
            // var params2 = {
            //     appendTo: '#' + topId,
            //     ds: Newtec.DS.get('node')
            // };
            // var t2 = Newtec.MenuPage.create(params2);
            var uploadButton = Newtec.Button.create({
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
                    console.log(treeNode);
                    // treeNewtecJQ.addMenuItem({parentId: treeNode.parentId});//暂时不用原来封装的添加节点方法，改用自己的
                    var newName = prompt("当前目录 " + treeNode.name + "\n请输入文件名:", Newtec.Utils.uuid16() + ".html");
                    if (!newName || newName == '') {
                        alert('name is null');
                        return;
                    }
                    var newNodes = {parentId: treeNode.id, isParent: false, name: newName};
                    // zTree.addNodes(treeNode, newNodes);
                    pageThis.ds.fetchData({
                        operId: 'addNewFile',
                        data: {parentId: treeNode.id, name: newName, content: newName},
                        callback: function (response) {
                            console.log(response);
                            if (response.status != 0) {
                                alert(response.failureMessage);
                                return;
                            }
                            treeNewtecJQ.setData(response.data);
                            alert('add success');
                        }
                    });
                }
            });
            // Newtec.Utils.appendTo(uploadButton, $('#' + topId));
            Newtec.Utils.appendTo(uploadButton, rightHead);
            rightJQ.append(rightHead);
            //创建左边树
            var treeNewtecJQ = Newtec.Tree.create({
                appendTo: '#' + leftId,
                ds: pageThis.ds,
                fetchOperId: 'getPageData',
                data: {},
                expandAll: false,
                callback: {
                    onClick: function (event, treeId, treeNode) {
                        //点击事件之前
                        if (Newtec.Utils.isFunction(pageThis.defaults['beforeTreeClick'])) {
                            pageThis.defaults['beforeTreeClick'](event, treeId, treeNode);
                        }

                        if (treeNode.isParent) {
                            console.log('加载子目录文件');
                            console.log(treeNewtecJQ);
                            if (!treeNode.zAsync && !treeNode.isAjaxing) {
                                treeNewtecJQ.showLoadingIcon(treeNode);
                                pageThis.ds.fetchData({
                                    operId: 'getPageData',
                                    data: {id: treeNode.id},
                                    callback: function (response) {
                                        treeNewtecJQ.hideLoadingIcon(treeNode);
                                        console.log(response);
                                        treeNode.zAsync = true;//ztree自带，已经加载过数据
                                        treeNode.isAjaxing = false;//ztree自带，已经结束ajax
                                        treeNewtecJQ.getTreeObj().addNodes(treeNode, response.data);
                                    }
                                });
                            } else {
                                treeNewtecJQ.getTreeObj().expandNode(treeNode);
                            }
                        } else {
                            console.log('加载文件内容');
                            pageThis.ds.fetchData({
                                operId: 'getPageDetail',
                                data: {id: treeNode.id},
                                callback: function (response) {
                                    console.log(response);
                                    var textareaID = Newtec.Utils.uuid16(),
                                        ccc = Newtec.Utils.uuid16(),
                                        pathID = Newtec.Utils.uuid16();
                                    rightJQ.empty();
                                    Newtec.Utils.appendTo(uploadButton, rightHead);
                                    rightJQ.append(rightHead);
                                    // rightJQ.append("<p id='" + pathID + "' style='position:absolute;top:0'>" + treeNode.name + "</p>");
                                    rightJQ.append("<div id='" + ccc + "' style='position:absolute;top:40px;bottom:0;right:0;left:300px;'><textarea id='" + textareaID + "'></textarea></div>");
                                    $("#" + textareaID).text(response.data);
                                    var textarea = document.getElementById(textareaID);
                                    var editor = CodeMirror.fromTextArea(textarea, {
                                        // styleActiveLine: true,//line选择是是否加亮
                                        lineNumbers: true,//是否显示行数
                                        lineWrapping: true,//是否自动换行
                                        // mode: "application/xml"
                                    });
                                    pageThis.editor = editor;

                                    var modifyBtn = Newtec.Button.create({
                                        title: '修改',
                                        style: "margin-left:20px;margin-right:5px; padding: 2px 12px;",
                                        click: function () {
                                            //点击事件之前
                                            if (Newtec.Utils.isFunction(pageThis.defaults['beforeModifyBtnClick'])) {
                                                pageThis.defaults['beforeModifyBtnClick'](event, treeId, treeNode);
                                            }

                                            if (!pageThis.defaults['modifyBtnClick']) {
                                                var newContent = editor.getValue();
                                                pageThis.ds.updateData({
                                                    operId: 'updateData',
                                                    data: {content: newContent, id: treeNode.id},
                                                    callback: function (response) {
                                                        console.log(response);
                                                        if (response.status == 0) {
                                                            alert('fin')
                                                        } else {
                                                            alert(response.failureMessage);
                                                        }
                                                    }
                                                });
                                            } else {
                                                if (Newtec.Utils.isFunction(pageThis.defaults['modifyBtnClick'])) {
                                                    pageThis.defaults['modifyBtnClick'](event, treeId, treeNode);
                                                }
                                            }

                                            //点击事件之后
                                            if (Newtec.Utils.isFunction(pageThis.defaults['afterModifyBtnClick'])) {
                                                pageThis.defaults['afterModifyBtnClick'](event, treeId, treeNode);
                                            }
                                        }
                                    });
                                    Newtec.Utils.appendTo(modifyBtn, $('#' + pathID));

                                    //添加样式保持高度100%
                                    $('#' + ccc + ' .CodeMirror').css({"height": "100%"});
                                }
                            });
                        }

                        //点击事件之后
                        if (Newtec.Utils.isFunction(pageThis.defaults['afterTreeClick'])) {
                            pageThis.defaults['afterTreeClick'](event, treeId, treeNode);
                        }
                    }
                }
            });
            pageThis.treeNewtecJQ = treeNewtecJQ;
            return pageThisJQ;
        },
        createHead: function () {
            var html = "<div style='width:100%;height:35px; line-height:35px; background:#e8ebf3;'></div>";
            return $(html);
        },
        getCodeMirrorEditor: function () {
            return this.editor;
        }
    });
    Newtec.Module("PagePage")
})();