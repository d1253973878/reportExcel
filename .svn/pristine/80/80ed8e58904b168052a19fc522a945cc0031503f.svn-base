/**
 * 系统：应用开发平台
 * 页面：菜单定义，负责创建左侧application列表，中间和右侧由newtec.treepage.js创建
 * @author 曾文杰
 */
(function () {
	Newtec.Table||Newtec.Utils.addJS("widget/newtec.table.js");
	Newtec.Form||Newtec.Utils.addJS("widget/newtec.form.js");
	Newtec.TreeGrid||Newtec.Utils.addJS("widget/newtec.treegrid2.0.js");
   Newtec.NodePage = function (params) {
        this.defaults = {};
        $.extend(this.defaults, params);
        var ds = this.defaults.ds;
        this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;

        this.head = undefined;
        this.headLeft = undefined;
        this.headRight = undefined;
    };
    Newtec.NodePage.exte(Newtec.Base, 'nodePage');
    function dealImg(value){return value.replaceAll('/','_').replaceAll('\\.','_');}
    Newtec.NodePage.over({
        createNewtecJQ: function (params) {
            var that = this;
            var ax = Newtec.Utils.uuid16();
            var thisJQ = $("<div id='" + ax + "' class='col-xs-12' style='padding-left:0;padding-right:0;height:100%;'></div>").appendTo($(params.appendTo));//整体
            var fields=that.ds.fields;
	   		 for(var i=0;i<fields.length;i++){
	   			 var field=fields[i],name=field.name;
	   			 if(name=='applicationId'){
	   				 field.hidden=true;
	   				 field.type='text';
	   			 }
	   		 }
            //创建头部
            this.createHead();
            thisJQ.append(this.head);
            var btns = [
//            {
//                    title: '上传图标',
//                    className: 'btn btn-success',
//                    id: Newtec.Utils.uuid16(),
//                    click: function () {
//                    	$("#btn_file").click();
//                    }
//             },
             {
                title: '添加',
                className: 'btn btn-success',
                click: function () {
                	that.funcAdd();
                }
            }, {
                title: '删除',
                className: 'btn btn-danger',
                click: function () {
                    that.funcDel();
                }
            }, ];
            this.createHeadBtns(btns);
            var appSelect = that.createAppSelect();
            if (Newtec.Utils.isNull(Newtec.Person.getPowerAppId())) {
                that.getApplicationNodes(Newtec.Person.getPowerAppId());
            }
            Newtec.Utils.append(this.headLeft, appSelect);
            //下面
            var treeAreaId = Newtec.Utils.uuid16(),
                treeAreaJQ = $("<div id='" + treeAreaId + "' class='' style='width:100%;padding-left:0;padding-right:0;margin-top:20px;'></div>").appendTo(thisJQ);
            this.treeAreaId = treeAreaId;
            this.treeAreaJQ = treeAreaJQ;
            this.treeAreaLeftId = Newtec.Utils.uuid16();
            this.treeAreaRightId = Newtec.Utils.uuid16();
            this.treeAreaLeftJQ = $("<div id='" + this.treeAreaLeftId + "'style='width:300px;float:left;position:absolute;top: 65px;bottom: 0px;overflow:auto;'></div>");
            this.treeAreaRightJQ = $("<div id='" + this.treeAreaRightId + "' class='' style='height:500px;width:500px;float:left;margin-left: 300px;'></div>");
            Newtec.Utils.append(this.treeAreaJQ, this.treeAreaLeftJQ);
            Newtec.Utils.append(this.treeAreaJQ, this.treeAreaRightJQ);
            $("body").append($('<input type="file" id="btn_file" style="display:none">'));//
            $("#btn_file").change(function(ev){
            	that.uploadIcon(ev);
            })
            var fields = that.ds.fields;
        	for(var i = 0; i < fields.length; i++){ 
        		if(fields[i].name == "icon"){
        			fields[i] = {id: "30",name: "icon",showDownIcon: true,sort: 0,title: "图标",type: "textbtn",click:function(){
        				that.getAppImgData(function(){
        					that.showIconWindow();
        				})
			        	return false;
			        }};
        		}
        	}
            this.getApplicationNodes(Newtec.Person.getPowerAppId());
            return thisJQ;
        },
        getAppImgData: function(callback){
        	var that = this;
        	if(this.appImgMap){
        		callback();
        	}else{
        		var appImgMap=this.appImgMap=[];
                var appImgMapRel=this.appImgMapRel={};
                that.ds.fetchData({operId:"getAppImg",callback:function(res){
                	if(res.status==0){
                		console.info("getAppImg==",res.data);
                		var data=res.data;
                		for(var key in data){
                			var value=dealImg(key);
                			appImgMap.push({id:value,name:key,iconUrl:key});
                			appImgMapRel[value]=key;
                		}
                		callback();
                	}else{
                		console.info(res.error);
                	}
                }});
        	}
        	
        },
        //创建下拉控件
        createAppSelect: function(){
        	var that = this;
        	 var appSelect = Newtec.MySelect.createAdmin();
             appSelect.onChange = function (element, checked, value, name) {
            	 that.crrAppId=name;
                 if (name != Newtec.Person.getPowerAppId()) {
                     Newtec.Person.setPowerAppId(name);
                     that.getApplicationNodes(name);
                 }
             };
             return appSelect;
        },
        //添加菜单
        funcAdd: function(isBrother,data) {
        	var that = this;
            var selectedRecord = data||that.treeNewtecJQ.getClickedRecord();
            var form = Newtec.Form.create({
                'operType': 'add',
                'titleColumn': 4,
                'columnNum': 2,
                'ds': that.ds,
            });
            that.formJQ = form;
            $(form.newtecJQ.find('.text-btn  button')).removeClass('btn-success').addClass('btn-primary');
            var win = Newtec.Window.create({
                title: '增加',
                width: 1024,
                body: form,
                footer: Newtec.Button.create({
                    title: '添加',
                    id: Newtec.Utils.uuid16(),
                    click: function () {
                    	if(!form.validate()){
                    		return
                    	}
                    	var d=form.getValues();
                    	d.applicationId=that.crrAppId;
//                    	d['icon'] = that.appImgMapRel[d['icon']];
                        var a = {
                            data: d,
                            operId: "addNode",
                            callback: function (response) {
                                if (response.status != 0) {
                                    Newtec.Window.hint(response.error);
                                } else {
                                	that.treeNewtecJQ.addRecords(response.data);
                                	win.close();
                                	 Newtec.Window.hint('添加成功！');
                                }
                            }

                        };
                        that.ds.addData(a);
                    }
                })
            });
            win.finsh=function(){
            	var data={module:selectedRecord.module};
            	data.parentId=isBrother&&selectedRecord.id||selectedRecord.parentId;
                form.setValues(data);
            }
        },
        //删除菜单
        funcDel: function() {
        	var that = this;
            var selectedRecord = that.treeNewtecJQ.getClickedRecord();
            if (!selectedRecord) {
            	Newtec.Window.hint('请选中一个节点');
                return;
            }
            Newtec.Window.confirm(function(isgo) {
            		if(!isgo)return ;
            		delete selectedRecord.children;
                    var a = {
                        operId: "removeNode",
                        data: selectedRecord,
                        callback: function (response) {
                            if (response.status != 0) {
                                alert(response.error);
                            } else {
                                Newtec.Window.hint('删除成功');
                                that.treeNewtecJQ.removeRecords(selectedRecord);
                            }
                        }
                    };
                    that.ds.removeData(a);
//                }
            },"确认删除 节点 [ " + selectedRecord.name + " ] 吗？")
        },
        
        createHead: function () {
            var head = $("<div style='width:100%;height:50px; line-height:50px; background:#e8ebf3; text-align:center;'></div>");
            var headLeft = $("<div class='pull-left' style='margin-left:10px;'></div>");
            var headRight = $("<div class='pull-right'></div>");
            head.append(headLeft);
            head.append(headRight);
            this.head = head;
            this.headLeft = headLeft;
            this.headRight = headRight;
            return head;
        },
        createHeadBtns: function (btnParams) {
            if (btnParams instanceof Array) {
                for (var i = 0; i < btnParams.length; i++) {
                    this.createHeadBtns(btnParams[i]);
                }
            } else {
                if (Newtec.Utils.isJson(btnParams)) {
                    var btn = Newtec.Button.create(btnParams);
                    Newtec.Utils.append(this.headRight, btn);
                } else {
                    Newtec.Utils.append(this.headRight, btnParams);
                }
            }
        },
        //创建表单底部的按钮
        createFormBtn: function(){
        	var that = this;
        	return Newtec.Button.create({
                title: '修改',
                className: 'btn-success btn-warning pull-right',
                id: Newtec.Utils.uuid16(),
                click: function () {
                	//if(true)return;
                	var form = that.updateForm;
                	var d=form.getValues();
                	d.applicationId=that.crrAppId
//                	d['icon']=that.appImgMapRel[d['icon']];
                    var a = {
                        data: d,
                        operId: "updateNode",
                        callback: function (response) {
                            if (response.status != 0) {
                                alert(response.error);
                            } else {
                                var name = form.getValues().name;
                                that.treeNewtecJQ.updateRecords(response.data);
//                                that.treeNewtecJQ.fetchData(that.defaults);
                                Newtec.Window.hint("修改成功")
                            }
                        }

                    };
                    that.ds.updateData(a);
                }
            })
        },
        //上传图标
        uploadIcon: function(ev){
        	var that = this;
        	var data = new FormData($("#btn_file"));
        	var file = ev.target.files[0];
        	var fileName = file.name.split(".");
        	var fileType = fileName[fileName.length - 1];
        	if(fileType != "png" && fileType != "jpg"){
        		Newtec.Window.hint("只能上传phg,jpg类型的图片");
        		return
        	}
        	data.append('file', file);
        	that.ds.relAjax('IconFileUpload',data,function(res){
        		debugger;
        		if(Newtec.Utils.isNull(res)){
        			Newtec.Window.hint('上传失败');
        		}else{
        			Newtec.Window.hint('保存成功');
	    			var key = res;
	                var value = dealImg(key);
	                that.appImgMap.push({id:value,name:key,iconUrl:key});
	                that.appImgMapRel[value] = key;
	                var iconItem = $("<div  style='height:60px; width:60px; padding: 8px; margin:2px;border-radius: 5px;background:#3f6186'></div>");
	            	iconItem.append($("<img style='height:40px;width:40px' src="+ key +">")) 
	            	iconItem.click(function(e){
	            		 that.oldClickImg&&$(that.oldClickImg).css("background", "#3f6186");//
	            		 that.oldClickImg = this;
	            		$(this).css("background", "#1a66e2");
	            	})
	            	$("#iconBody").append(iconItem);
        		}
	    	})
        },
        //创建树
        getApplicationNodes: function (applicationId) {
            if (Newtec.Utils.isNull(applicationId)) {
                return;
            }
            var fields=this.ds['fields'];
            for(var i=0;i<fields.length;i++){
            	var f=fields[i];
            	if(f.name=='applicationId'){
            		f['ds']['data']={id:applicationId};
            	}else if(f.type=='select'&&f['ds']){
            		f['ds']=f['ds']||[]
            		f['ds']['data']={applicationId:applicationId};
            	}
            }
            var that = this;
            that.treeAreaLeftJQ.empty();
            that.treeAreaRightJQ.empty();
            that.updateForm=null;
            var treeParams = {
                "appendTo": "#" + that.treeAreaLeftId,
                "ds": 'node',
                "showCheckbox": false,
                "fetchParam": {
                	operId:'getNodeList',
                    "data": {"applicationId": applicationId}
            		,sortBy: {sort: 'asc'}
                },
                "expand": true,
                "onClick": function (thisTR) {
                	that.treeClickFun(thisTR);
                },
                showRightMenu:true,
                menuTitle:[{title:'删除',name:'remove1',icon:'glyphicon-trash'},
                           {title:'添加同级',name:'addSameLevel',icon:'glyphicon-plus'},
                           {title:'添加下级',name:'addChild',icon:'glyphicon-plus'}],
                menuClick:function(e,exData){
                	var data=exData.data,name=exData.name;
                	if(name=="addSameLevel"){
                		that.funcAdd(false,data);
                	}else if(name=="addChild"){
                		that.funcAdd(true,data);
                	}else if(name=="remove1"){
                		that.funcDel();
                	}
                		
                }
            };
            that.treeNewtecJQ = Newtec.TreeGrid.create(treeParams);
        },
        //显示图标弹框 
        showIconWindow: function(){
        	var that = this;
        	var body = $('<div id="iconBody" style="display: flex;flex-wrap: wrap;"></div>');
            var appImgMapRel = this.appImgMapRel ;
            that.oldClickImg;//存放上一次点击选中的对象。
            //生成图标
            for(var key in appImgMapRel){
            	var iconItem = $("<div  style='height:60px; width:60px; padding: 8px; margin:2px;border-radius: 5px;background:#3f6186'></div>");
            	iconItem.append($("<img style='height:40px;width:40px' src="+ appImgMapRel[key] +">")) 
            	iconItem.click(function(e){
            		 that.oldClickImg&&$(that.oldClickImg).css("background", "#3f6186");//
            		 that.oldClickImg = this;
            		$(this).css("background", "#1a66e2");
            	})
            	body.append(iconItem);
            } 
            var footer=$('<div class="btn-group"></div>')
             footer.append( Newtec.Button.create({
        		title:'上传图片',
            	click:function(){
            		$("#btn_file").click();
            		return ;
            	}
         	}).newtecJQ)
            footer.append( Newtec.Button.create({
        		title:'选择',
            	click:function(){
            		var src = $(that.oldClickImg).children().attr("src");
            		that.formJQ.setValues({icon:getFileName(src)});
            		win.close();
            		return ;
            	}
         	}).newtecJQ)
        	var win = Newtec.Window.create({
        		title: '选择图标',
           		width: 800,
           		body: body,
            	height: 500,
            	canDrag: false,
            	footer:footer,
             	canFullScreen:true,
         	});
//        	win.newtecJQ.find(".modal-content").css("background", "#afacac");
        },
        //树点击事件
        treeClickFun: function(thisTR){
        	var that = this;
        	var treeNewtecJQ=that.treeNewtecJQ
        	var id = treeNewtecJQ.getNodeId(thisTR);
        	var data=treeNewtecJQ.treeGridJsonData[id];
        	if(!that.updateForm){
        		 var treeGridJsonData=treeNewtecJQ.treeGridJsonData;
        		 var arr=[];
        		 for(var key in treeGridJsonData){
        			 arr.push(treeGridJsonData[key])
        		 }
        		 that.treeAreaRightJQ.empty();
        		 var fields=$.extend(true,[],that.ds.fields);
        		 for(var i=0;i<fields.length;i++){
        			 var field=fields[i],name=field.name;
        			 if(name=="parentId"){
        				 field.ds=null;
        				 field.data=arr;
        			 }
        		 }
                 var form = Newtec.Form.create({
                     appendTo: '#' + that.treeAreaRightId,
                     titleColumn: 3,
                     columnNum: 1,
                     operType: Newtec.DS.OperType.update,
                     fields: fields,
                     footer: that.createFormBtn(),
                     createFieldBefore: function (field, operType, ds) {
                     }
                 });
                 $(form.newtecJQ.find('.text-btn  button')).removeClass('btn-success').addClass('btn-primary');
                 that.updateForm = form;
        	}
        	that.formJQ = that.updateForm;
        	data=$.extend(true,{},data);
        	data.icon=getFileName(data.icon)
        	that.updateForm.clearValues();
        	that.updateForm.setValues(data);
        	
          
        
        },
        finsh: function () {
//            this.treeAreaLeftJQ.css("height", "500px");
//            this.treeAreaLeftJQ.mCustomScrollbar({
//                theme: "minimal-dark",
//                scrollInertia: 200
//            });
        }
    });
    var getFileName=function(src){
    	if(!src)return src
    	src=src.split('/')
    	return src[src.length-1];
    }
    Newtec.Module("NodePage")
})();
