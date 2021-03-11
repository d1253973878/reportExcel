/**
 * 系统：应用开发平台
 * 页面：页面定义
 * @author 曾文杰
 */
(function () {
		Newtec.TreeGrid||Newtec.Utils.addJS("widget/newtec.treegrid2.0.js")
		Newtec.FilePage||Newtec.Utils.addJS("page/newtec.filepage.js")
		Newtec.EntityPage||Newtec.Utils.addJS("page/newtec.entitypage.js")
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
            var appSelect = Newtec.MySelect.createAdmin();
            //重写onChange事件，加载对应应用页面
            appSelect.onChange = function (element, checked, value, name) {
                console.log('切换应用id=' + name);
                console.log('根据应用id查询');
                entityPageNewtecJQ.table.fetchData({data: {"applicationId": name}});
                Newtec.Person.setPowerAppId(name);//保存当前选择应用
            };
            var other = $("<div class='pull-left' style='margin-left:10px;'></div>");
            other.append(appSelect.newtecJQ);
            //========== END OF 创建应用下拉列表 ==========

            //========== 创建页面 ==========
            var entityPageNewtecJQ = Newtec.EntityPage.create({
                ds: this.ds,
                fetchParam: {data: {applicationId: Newtec.Person.getPowerAppId()}},
                appendTo: this.defaults.appendTo,
                tableHeaderOther: other,autoFetch:false,
                fetchBefore: function (param) {
                	var data=param.data;
                	if(data['applicationId']){
                		delete data['applicationId'];
                	}
                	param.datas={fieldName:'applicationId',operator:'equals',value:appSelect.getValue()};
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
                                "ds": that.ds,
                                "width": 1024,
                                "height": 9999,
                                "showFileDetail": true,
                                "showLoadingHint": true
                            });
                        }
                    },
                    {
                        title: '资源管理',
                        click: function (table) {
   						 var data=table.getSelectedRecords();
   						 if (Newtec.Utils.isNull(data)||data.length==0) {
							alert("请选择对应的页面！！");
							return;
						 }
   						 data=Newtec.Utils.isArray(data)?data[data.length-1]:data;
       	 	    	   var fetchParam={datas:{fieldName:'pageId',operator:'equals',value:data.id}};
       	 	    	  var param1={maxHeight:225,dbclickCanEdit:true,ds:Newtec.DS.get("button"),showFetchForm:false,autoFetch:true
       		 	    		   ,showHeader:false,showPagin:false,showFooter:false,tableStyle:'border-left:0;bordre-top:0;',fetchParam:fetchParam};
       	 	    	  var param2=$.extend(true,{},param1);param2.ds=Newtec.DS.get("listField");
       	 	    	   var param3=$.extend(true,{},param1);param3.ds=Newtec.DS.get("formField");
       	 	    	   var param4=$.extend(true,{},param1);param4.ds=Newtec.DS.get("searchField");
       	 	    	   var param5=$.extend(true,{},param1);param5.ds=Newtec.DS.get("rowFilterScheme");
       	 	    	   var tdd1=Newtec.Table.create(param1);
       	 	    	   var tdd2=Newtec.Table.create(param2);
       	 	    	   var tdd3=Newtec.Table.create(param3);
       	 	    	   var tdd4=Newtec.Table.create(param4);
       	 	    	   var tdd5=Newtec.Table.create(param5);
       	 	    	 var tabs=[{title:'按钮',name:'button',JQ:tdd1},{title:'列表字段',name:'listField',JQ:tdd2},{title:'表单字段',name:'formField',JQ:tdd3}
       					,{title:'搜索字段',name:'searchField',JQ:tdd4},{title:'行集过滤方案',name:'rowFilterScheme',JQ:tdd5}];
       	 	    	var btnParams=[{
       	 	    		 title: "插入一列",
       	 	    		 click:function(tab,tabJQ,name){
       	 	    			var table=tabJQ;
       	 	    			table.setNullData(true);
       	 	    		 }
       	 	    	},{
       	 	    		 title: "提交增加",
       	 	    		 click:function(tab,tabJQ,name){
       	 	    			 var values= tabJQ.getSelectedRecords();
       	 	    			if (Newtec.Utils.isNull(values)||values.length==0) {
       	 	    			Newtec.Window.createHint({html:"请选择对应的记录！！",className:"btn-warning"});
								return;
							}
       	 	    			Newtec.Window.createConfirm({title:"增加",html:"是否确认增加该记录?",noTitle:'取消',okTitle:'确定',execute:function(isTrue){
       	 	    				if(!isTrue)return;
       	 	    				for ( var i = 0; i < values.length; i++) {
       	 	    					values[i]['newtecTRId']=undefined;
       	 	    					values[i].applicationId=Newtec.Person.getPowerAppId();
       	 	    					values[i].pageId=data.id;
       	 	    				}
       	 	    				tabJQ.addData(values,'',function(response){
       	 	    					if (response['statue']==0) {
       	 	    						Newtec.Window.createHint({html:"操作成功！！"});
       	 	    					}else{
       	 	    						Newtec.Window.createHint({html:response.error});
       	 	    					}  
       	 	    				},false);
       	 	    			}});

       	 	    		 }
       	 	    	},{
       	 	    		 title: "提交修改",
       	 	    		 click:function(tab,tabJQ,name){
       	 	    			 var values= tabJQ.getSelectedRecords();
       	 	    			 if (Newtec.Utils.isNull(values)||values.length==0) {
       	 	    				Newtec.Window.createHint({html:"请选择对应的记录！！",className:"btn-warning"});
								return;
							}
       	 	    			 Newtec.Window.createConfirm({title:"提交",html:"是否确认修改该记录?",noTitle:'取消',okTitle:'确定',execute:function(isTrue){
       	 	    				 if(!isTrue)return;
       	 	    				 for ( var i = 0; i < values.length; i++) {
       	 	    					 delete values[i]['newtecTRId'];
       	 	    				 }
       	 	    				 tabJQ.updateData(values,'',function(response){
       	 	    				 if (response['statue']==0) {
    	 	    						Newtec.Window.createHint({html:"操作成功！！"});
    	 	    					 }else{
    	 	    						Newtec.Window.createHint({html:response.error});
    	 	    					 }  				
       	 	    				 });
       	 	    			 }});
       	 	    		 }
       	 	    	},
       	 	    	{
       	 	    		 title: "提交删除",
       	 	    		 className:"btn-warning",
       	 	    		 click:function(tab,tabJQ,name){
       	 	    			 var values=tabJQ.getSelectedRecords();
       	 	    			 if (Newtec.Utils.isNull(values)||values.length==0) {
       	 	    				 alert("请选择对应的记录！！");
       	 	    				 Newtec.Window.createHint({html:"请选择对应的记录！！",className:"btn-warning"});
       	 	    				 return;
       	 	    			 }
       	 	    			 Newtec.Window.createConfirm({title:"删除",html:"是否确认将该记录删除?",noTitle:'取消',okTitle:'确定',execute:function(isTrue){
       	 	    				 if(!isTrue)return;
       	 	    				 var operId="delete";
       	 	    				 if(name=="button")
       	 	    					 operId+="Buttons";
       	 	    				 else if(name=="listField")
       	 	    					 operId+="ListFields";
       	 	    				 else if(name=="formField")
       	 	    					 operId+="FormFields";
       	 	    				 else if(name=="searchField")
       	 	    					 operId+="SearchFields";
       	 	    				 else if(name=="rowFilterScheme")
       	 	    					 operId+="RowFilters";
       	 	    				 tabJQ.removeData(values,operId,function(response){
       	 	    					 if (response['statue']==0) {
       	 	    						Newtec.Window.createHint({html:"操作成功！！"});
       	 	    					 }else{
       	 	    						Newtec.Window.createHint({html:response.error});
       	 	    					 }  				
       	 	    				 });
       	 	    			 }});
       	 	    		 }
       	 	    	}
       	 	    	];
       	 	    	  var myTab=Newtec.MyTab.create({tabs:tabs,btnParams:btnParams,height:300,tabChangFun:function(mytabThis){
       		 	        }});
                        	 var win = Newtec.Window.create({
        	    				 title:'资源管理窗口',
        	    				 width: 1024,
        	    				 height:450,
        	    				 body:myTab,
        	    				 footer: Newtec.Button.create({
        	    					 title: "资源管理",
        	    					 click: function (a) {
        	    						 
        	    					 }
        	    				 })
        	    			 });

                        }
                    });
                },
                addBefore: function (values) {
                    console.log(values);
                },
                finsh: function () {
                    console.log('EntityPage finish');
                },
                updateCreateWinAfter:function(data,table,win){}
            });
            //========== END OF 创建页面 ==========

            return entityPageNewtecJQ.newtecJQ;
        }
    });
})();