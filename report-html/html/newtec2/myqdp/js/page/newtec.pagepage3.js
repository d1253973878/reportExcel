//TODO 内容加载本地文件
//TODO 页面文件新增
//TODO 整体样式bug修改

//TODO 新建文件弹框修改，包括弹框页面修改

(function () {
     Newtec.PageDefPage = function (params) {
        //默认
        this.defaults = {
            ds: ''
        };
        //合并
        this.defaults = $.extend(this.defaults, params, {});
        //处理数据源
        var ds = this.defaults.ds;
        this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;
        params.ds = this.ds;
        if (!this.ds) {
            console.log("ds is undefined");
            alert('ds is undefined');
        }
    };
    Newtec.PageDefPage.exte(Newtec.Base, 'pageDefPage');
    Newtec.PageDefPage.over({
        createNewtecJQ: function (params) {
            var that = this,
                thatJQ = $(that.defaults.appendTo);
            //========== 创建应用下拉列表 ==========
            var appSelect = Newtec.MySelectItem.createAdmin();
            //重写onChange事件，加载对应应用页面
            appSelect.onChange = function (element, checked, value, name) {
                console.log('切换应用id=' + name);
                console.log('根据应用id查询');
                Newtec.Person.setPowerAppId(name);//保存当前选择应用
                that.ds.fetchData({
                    data: {"applicationId": name},
                    callback: function (response) {
                        entityPageNewtecJQ.table.setData(response.data);
                    }
                });
            };
            var other = $("<div class='pull-left' style='margin-left:10px;'></div>");
            other.append(appSelect.newtecJQ);
            //========== END OF 创建应用下拉列表 ==========

            //========== 创建页面 ==========
            var entityPageNewtecJQ = Newtec.EntityPage.create({
                ds: this.ds,
                fetchParam: {data: {applicationId: Newtec.Person.getPowerAppId()}},
                appendTo: this.defaults.appendTo,
                tableHeaderOther: other,
                fetchBefore: function (values) {
                    values.applicationId = appSelect.getValue();
                },
                createFieldBefore: function (field, type, ds) {
                    // console.log(field);
                    // console.log(type);
                    // console.log(ds);
                    if (field.name == 'content' && (type == "update" || type == "add")) {
                        field.btnFun = function (item, f) {
                            console.log(item);
                            console.log(f);
                            return [
                                {
                                    title: "<i class='glyphicon glyphicon-search'></i>",
                                    click: function () {
                                        var aid = Newtec.Utils.uuid16(),
                                            leftId = Newtec.Utils.uuid16(),
                                            rightId = Newtec.Utils.uuid16(),
                                            a = $("<div id='" + aid + "'></div>");
                                        a.append($("<div id='" + leftId + "' style='width:300px;float:left;'></div>"));
                                        a.append($("<div id='" + rightId + "' style='margin-left: 300px;'></div>"));
                                        var selectWindow = Newtec.Window.create({
                                            title: '选择文件',
                                            width: 450,
                                            body: a,
                                            footer: Newtec.Button.create({
                                                title: '选择',
                                                click: function () {
                                                    var treeNode = treeNewtecJQ.getSelectedNode();

                                                    if (treeNode.isParent) {
                                                        alert('请选择文件');
                                                        return;
                                                    }

                                                    if (treeNode.level == 0) {
                                                        item.setValue(treeNode.id);
                                                    } else {
                                                        var rootTreeNode = getCurrentRoot(treeNode);
                                                        var module = rootTreeNode.id;
                                                        console.log(rootTreeNode);
                                                        var items = item.newtecForm.items;//这个是当前form表单的items newtecJQ对象
                                                        items.module.setValue(module);

                                                        item.setValue(treeNode.id.replace(module + "\\", ""));
                                                    }

                                                    selectWindow.close();

                                                    //获取当前节点的根节点(treeNode为当前节点)
                                                    function getCurrentRoot(treeNode) {
                                                        if (treeNode.getParentNode() != null) {
                                                            var parentNode = treeNode.getParentNode();
                                                            return getCurrentRoot(parentNode);
                                                        } else {
                                                            return treeNode;
                                                        }
                                                    }
                                                }
                                            })
                                        });
                                        console.log(selectWindow);
                                        //文件选择树
                                        var person = Newtec.Person.get(),
                                            apps = person.apps,
                                            mainUrl = '';
                                        for (var i = 0; i < apps.length; i++) {
                                            var app = apps[i];
                                            if (app.id == Newtec.Person.getPowerAppId()) {
                                                mainUrl = app.mainUrl;
                                            }
                                        }
                                        //创建树的时候提供应用的mainUrl，用来加载对应的目录
                                        console.log('applicationId=' + Newtec.Person.getPowerAppId() + '\nmainUrl=' + mainUrl);
                                        var treeNewtecJQ = Newtec.Tree.create({
                                            appendTo: '#' + leftId,
                                            ds: that.ds,
                                            fetchOperId: 'getPageData',
                                            data: {applicationId: Newtec.Person.getPowerAppId(), mainUrl: mainUrl},
                                            expandAll: false,
                                            callback: {
                                                onClick: function (event, treeId, treeNode) {
                                                    // if (treeNode.isParent) {
                                                    //     console.log('加载子目录文件');
                                                    //     console.log(treeNewtecJQ);
                                                    //     if (!treeNode.zAsync && !treeNode.isAjaxing) {
                                                    //         treeNewtecJQ.showLoadingIcon(treeNode);
                                                    //         that.ds.fetchData({
                                                    //             operId: 'getPageData',
                                                    //             data: {id: treeNode.id, applicationId: parent.Newtec.powerCurrentSelectAppId, mainUrl: mainUrl},
                                                    //             callback: function (response) {
                                                    //                 treeNewtecJQ.hideLoadingIcon(treeNode);
                                                    //                 console.log(response);
                                                    //                 treeNode.zAsync = true;//ztree自带，已经加载过数据
                                                    //                 treeNode.isAjaxing = false;//ztree自带，已经结束ajax
                                                    //                 treeNewtecJQ.getTreeObj().addNodes(treeNode, response.data);
                                                    //             }
                                                    //         });
                                                    //     } else {
                                                    //         treeNewtecJQ.getTreeObj().expandNode(treeNode);
                                                    //     }
                                                    // } else {
                                                    //     var pathID = Newtec.Utils.uuid16(),
                                                    //         rightJQ = $('#' + rightId);
                                                    //     rightJQ.empty().append("<p id='" + pathID + "' style='position:absolute;top:0'>" + treeNode.name + "</p>");
                                                    // }

                                                    if (treeNode.isParent) {
                                                        treeNewtecJQ.getTreeObj().expandNode(treeNode);
                                                    } else {
                                                        console.log(selectWindow);
                                                        selectWindow.winHeaderTitle.text('选择文件：' + treeNode.id);
                                                    }
                                                }
                                            }
                                        });
                                        setTimeout(function () {
                                            //设置选中状态
                                            var treeObj = treeNewtecJQ.getTreeObj();
                                            var nodes = treeObj.transformToArray(treeObj.getNodes());
                                            for (var i = 0; i < nodes.length; i++) {
                                                var n = nodes[i];
                                                var module = item.newtecForm.items.module.getValue();
                                                if (module) {
                                                    if (n.id == (module + "\\" + item.getValue())) {
                                                        treeObj.selectNode(n);
                                                        selectWindow.winHeaderTitle.text('选择文件：' + n.id);
                                                    }
                                                } else {
                                                    if (n.id == item.getValue()) {
                                                        treeObj.selectNode(n);
                                                        selectWindow.winHeaderTitle.text('选择文件：' + n.id);
                                                    }
                                                }
                                            }
                                        }, 500);
                                    }
                                }
                            ];
                        };
                    } else if (field.name == 'applicationId') {
                        console.log(field);
                        // alert("xx=" + appSelect.getValue());
                        // alert('==' + parent.Newtec.powerCurrentSelectAppId);
                        field.value = appSelect.getValue();
                        // item.setValue(parent.Newtec.powerCurrentSelectAppId);
                    }
                },
                initBtns: function (btns) {
                    btns.push({
                        title: '管理页面文件',
                        click: function () {
                            Newtec.FilePage.create({
                                ds: that.ds,
                                width: 1024,
                                height: 9999,
                                showFileDetail: true
                            });
                        }
                    });
                },
                addBefore: function (values) {
                    console.log(values);
                },
                finsh: function () {
                    console.log('EntityPage finish');
                }
            });
            //========== END OF 创建页面 ==========

            return entityPageNewtecJQ.newtecJQ;
        }
    });
    Newtec.Module("PageDefPage")
})();