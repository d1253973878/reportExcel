/**
 * TreeGrid扩展控件，主要
 * @author 曾文杰
 */
(function () {
	Newtec.Table||Newtec.Utils.addJS("Table");
	Newtec.Form||Newtec.Utils.addJS("Form");
	Newtec.TreeGrid||Newtec.Utils.addJS("TreeGrid");
    Newtec.DepartmentPage = function (params) {
           this.defaults = {
               appendTo: '',
               ds: 'department',
               add: true,
               update: true,
               remove: true,
               expand: true,
               leftHint:"部门机构名称",
               showIcon: false,
               showCheckbox: false,
               treeParam: {
   	    		 showRightMenu: false,
   	    	     showCheckbox: false,
   	    	     autoFetch: false,
   	    		 tdStyle:'white-space: nowrap;',
   	    		 fetchParam:{
   	    			 operId:'getDepsParentByPersonId',
   	    		 },
   	    		 tdValueHtmlFun: function(name,value,param){
   	    			 var depId = Newtec.Person.get().depId;
   	    			 if(param.sourceId== "-1"){
   	    				 return '<span style="color:#adaaaa">'+ value +'</span';
   	    			 }else if(param.id == depId){
   	    				 return '<span style="color:#2277ee">'+ value +'</span';
   	    			 }
   	    			 return value;
   	    		 }
               }
           };
           $.extend(this.defaults, params);
       };
       var departmentDs = Newtec.DS.create("department");
       Newtec.DepartmentPage.exte(Newtec.Base, 'departmentPage');
       Newtec.DepartmentPage.over({
           createNewtecJQ: function (params) {
               var that = this,leftId='',win='',form='',departmentds=Newtec.DS.create("departmentDS");
               var thisJQ = $(this.defaults.appendTo);
               this.getTreeData();
               this.createHead();
               this.createTopButton(params);
               thisJQ.append(this.head);
               this.leftId = 'treePage_left_' + Newtec.Utils.uuid16();
               this.leftJQ = $("<div id='" + this.leftId + "' class='' style='width:50%;float:left;position:absolute;left:0;top:40px;right:50%;bottom:0;border-top: 3px solid white;border-right: 3px solid white;padding-right:3px;'>"+
            		   "<div class='search-div' style='padding: 5px 10px;background:#ddd;'>"+
   					"<input type='text' maxlength='50' placeholder='"+(params.leftHint)+"' id='searchValue' style='width:240px; height: 30px;text-indent:10px'/>"+
   					"<button id='searchBtn' style='height: 30px;width:50px;top:2px' class='glyphicon glyphicon-search'></button>"+
   				"</div>"+"</div>");
               this.rightId = 'treePage_right_' + Newtec.Utils.uuid16();
               this.rightJQ = $("<div id='" + this.rightId + "' class='' style='padding-top:20px;width:49%;float:left;left:50%;top:40px;right:0;position: absolute;bottom:0;border-top: 1px solid #cccccc;'></div>");
               thisJQ.append(this.leftJQ).append(this.rightJQ);
               this.leftJQ.append(this.createLeftTree(params));
               
              // this.treeBody=treeBody,this.treeLy=treeLy;
	    		showLeftTree=params['showLeftTree']!==false,
	        	showLeftTable=params['showLeftTable']!==false,
	        	that=this;
	        	this.showLeftTree=showLeftTree;
	    		
	        	var allDataTree=0,
				tree=this.tree,table=this.lTable;
				allDataTable=0,searchName=params.searchName;	     

				var input=this.leftJQ.find('input');
				input.on('keyup',function(event) {
       			if (event.keyCode == 13) {
       				setData(input.val());
       				tree.expandAll(true);
       			}
       		});
				this.leftJQ.on('click','#searchBtn',function(event) {
	    			setData(input.val());
	    			
	    			tree.expandAll(true);
	    		});
				
				function setData(searchWord){
					allDataTree=showLeftTree&&(allDataTree||tree.treeGridJsonData);
					allDataTable=showLeftTable&&(allDataTable);
					searchWord=searchWord.replace(/\s*/g,"");
					console.info("searchWord",searchWord)
					if(Newtec.Utils.isNull(searchWord)){
						var tagDatas=[];
						for ( var key in allDataTree) {
							var data1=allDataTree[key]
							delete data1.children;
							tagDatas.push(data1);
						}
						showLeftTree&&tree.setData(tagDatas);
						showLeftTable&&allDataTable&&table.setData(allDataTable);
					}else{
						var tagDatas= [],tagId={};
						if(showLeftTree){
							for (var key in allDataTree) {
								var data=allDataTree[key];
								delete data.children;
								if(data['name'].indexOf(searchWord)>=0){
									var parentId=data.parentId;
									if(!tagId[parentId]){
										while(!tagId[parentId]&&allDataTree[parentId]){
											tagDatas.push(allDataTree[parentId]);
											tagId[parentId]=true;
											parentId=allDataTree[parentId]['parentId'];
										}
									}
									tagId[key]=true;
									tagDatas.push(data);
								}
							}
							if(tagDatas.length==0){
								Newtec.Window.hint("不存在此名称的机构");
								var tagDatas=[];
								for ( var key in allDataTree) {
									var data1=allDataTree[key]
									delete data1.children;
									tagDatas.push(data1);
								}
							}
							tree.setData(tagDatas);
						}
						if(showLeftTable&&allDataTable){
							tagDatas=[];
							for (var i=0;i<allDataTable.length;i++) {
								var index=allDataTable[i][searchName].indexOf(searchWord);
								if(index>=0)
									tagDatas.push(allDataTable[i]);
							}
							table.setData(tagDatas);
						}
					}
				}       
               return thisJQ;
           },
           getTreeData: function(){
           	var that = this;
           	departmentDs.fetchData({
           		operId: 'getDepsParentByPersonId',
           		callback: function(res){
           			if(res.status == 0){
           				var data = res.data;
           				var deps = [];
               			for(var key in data){
               				delete data[key].isFolder;
               				if(key.endWith('_0')){
               					deps.push(data[key]);
               				}else{
               					data[key].sourceId = "-1"
               					deps.push(data[key]);
               				}
               			}
               			deps = that.sortData(deps);
               			that.depData = deps;//所有部门的id;
               			that.tree.setData(deps);
   //            			that.tree.initTreeGrid();
               			that.rightJQ.empty();
               			that.updateForm = that.createForm(1, deps);
   //            			that.updateForm.clearValues();
               			that.rightJQ.append($("<div style='padding: 20px 15%'></div>").append(that.updateForm.newtecJQ));
           			}else{
           				Newtec.Window.hint("错误：获取部门树失败！");
           				console.err(res.errors);
           			}
           		}
           	})
           },
           //根据sort为数据排序
           sortData: function(datas){
           	//根据价格（price）排序
               function sortprice(a,b){
                 return a.sort - b.sort;
               }
               //利用sort方法排序
               datas.sort(sortprice);
               return datas;
           },
           createHead: function () {
               var head = $("<div style='width:100%;height:40px;position: absolute;left:0;top:0; line-height:40px; background:#e8ebf3; text-align:center;'></div>");
               var headLeft = $("<div class='pull-left'></div>");
               var headRight = $("<div class='pull-right'></div>");
               head.append(headLeft);
               head.append(headRight);
               this.head = head;
               this.headLeft = headLeft;
               this.headRight = headRight;
               return head;
           },
           createLeftTree: function(params){
           	var treeParam = params.treeParam;
           	var that = this;
           	treeParam.ds = params.ds;
           	//点击部门树，显示对应的部门信息
           	treeParam.onClick=treeParam.onClick||function(trDom){
   	       		 var data = that.tree.getSelectedRecords();
   	       		 var updateForm = that.updateForm;
   	       		 var typeDiv = updateForm.form.find('input').get(1);
   				 typeDiv = $(typeDiv).parent().parent().parent().parent().parent();
   	       		 updateForm.clearValues();
   	       		 if(data.sourceId == "-1"){//如果不为本部门及其下属，隐藏父节点选项，并返回
   	       			typeDiv.hide();
   	       			return;
   	       		 }else if(Newtec.Utils.isNull(data.parentId)){//根节点隐藏父节点选项
   	       			typeDiv.hide();
   	       		 }else{
   	       			typeDiv.show();
   	       		 }
   	       		 that.updateForm.setValues(data);
   	       		 that.selectData = data;
   	       	};
           	var tree = Newtec.TreeGrid.create(treeParam);
           	that.tree = tree;
           	return tree.newtecJQ;
           },
           createTopButton: function(params){
           	var that = this;
           	var btns = [{
   	        		title:"迁移",
   	        		click: function(){
   	        			that.moveDepartment();
   	        		}
   	        	},{
   	        		title:"新增",
   	        		click: function(){
   	        			that.addDepartment();
   	        		}
   	        	},{
   	        		title:"修改",
   	        		className: 'btn btn-warning',
   	        		click: function(){
   	        			var data = that.tree.getSelectedRecords();
   	        			if(Newtec.Utils.isNull(data)){
   	                		Newtec.Window.hint("请选择需要修改的数据");
   	                		return
   	                	}
   	        			if(data.sourceId == "-1"){
   	        				Newtec.Window.hint("没有修改非自己部门的权限");
   		   	       			return;
   	        			}
   	        			that.updateDepartment();
   	        		}
   	        	},{
   	        		title:"删除",
   	        		className: 'btn btn-danger',
   	        		click: function(){
   	        			var data = that.tree.getSelectedRecords();
   	                	if(Newtec.Utils.isNull(data)){
   	                		Newtec.Window.hint("请选择需要删除的数据");
   	                		return
   	                	}
   	        			if(data.sourceId == "-1"){
   	        				Newtec.Window.hint("没有删除非自己部门的权限");
   		   	       			 return;
   	        			}
   	        			delete data.children;
   	                	Newtec.Window.confirm(function(isTrue){
   	                		departmentDs.updateData({
   		        				operId: "toDeleteDepartment", 
   		        				data: data,
   		        				callback: function(res){
   		        					if(res.status == 0){
   		        						Newtec.Window.hint("删除成功");
   		        						that.tree.removeRecords(data);
   		        						that.updateForm.clearValues();
   		        						//移除数据
   		        						var depData = that.depData;
   		        						for(var i = 0; i < depData.length; i++){
   		        							if(depData[i].id == data.id){
   		        								depData.splice(i, 1);
   		        								break
   		        							}
   		        						}
   		        						that.depData = depData;
   		        					}else{
   		        						Newtec.Window.hint("错误：" + res.error);
   		        					}
   		        				}
   		        			})
   	                	},"是否删除该部门及其底下的所有部门");
   	        		}
   	        	}
           	]
           	for(var i = 0; i < btns.length; i++){
           		that.headRight.append(Newtec.Button.create(btns[i]).newtecJQ);
           	}
           },
           finsh: function (params) {
               this.rightJQ.mCustomScrollbar({
                   theme: "minimal-dark",
                   scrollInertia: 200
               });
               this.leftJQ.mCustomScrollbar({
                   theme: "minimal-dark",
                   scrollInertia: 200
               });
           },
           //更新部门在树的位置
           updateTreeData: function(data, isAdd){
        	   if(isAdd)this.tree.setSortData(data);
        	   else this.tree.updateRecords(data);
//           	var that = this;
//           	var bodyJQ = that.leftJQ.find(".mCSB_container");
//           	bodyJQ.empty();
//           	var datas = that.depData;
//           	if(isAdd){
//           		datas.push(data);
//           	}else{
//           		for(var i = 0; i < datas.length; i++){
//           			if(datas[i].id == data.id){
//           				datas[i] = data; //更新数据
//           			}
//           		}
//           	}
//           	datas = that.sortData(datas);
//           	bodyJQ.append(that.createLeftTree(that.defaults));
//           	for(var i=0;i<datas.length;i++){//删除数据集里面children属性
//           		delete datas[i].children;
//           	}
//           	that.depData = datas;
//           	that.tree.setData(datas);
   //        	that.tree.initTreeGrid();
           },
           
           moveDepartment: function(){
           	var that = this;
           	var data = that.tree.getSelectedRecords();
           	if(Newtec.Utils.isNull(data)){
           		Newtec.Window.hint("请选择需要迁移的部门");
           		return
           	}
   			if(data.sourceId == "-1"){
   				Newtec.Window.hint("没有迁移非自己部门的权限");
   	       			 return;
   			}
   			if(Newtec.Utils.isNull(data.parentId)){
   				Newtec.Window.hint("部门根节点不能删除");
   	       			 return;
   			}
   			var parentData = that.depData;
   			var treeData = that.tree.treeGridJsonData;
   			var selectData = that.removeDepData(parentData, treeData[data.id]);
   			var form = Newtec.Form.create({
   				fields: [
   					{
   						name: "parentId", title: "上级部门", type: "select",showDownIcon:true,
   						required:"上级部门名字不能为空",redstar:true,data: selectData,
   						domStyle: {
   							padding: "20px 0 0 0 ",
   							width: "100%",
   							titleStyle: { width: "20%" },
   							valueParentStyle: { width: "75%" },
   						}
   					},
   				],
   			});
   			var footer = $("<div></div>")
   			var win = Newtec.Window.create({
   				title: "选择迁移的父部门",
   				width: 500,
              		body: form.newtecJQ,
               	height: 200,
               	canDrag: false,
               	footer: footer.append(Newtec.Button.create({
               		title:'迁移',
                   	click:function(){
                   		if(!form.validate())
                   			return
                   		var dep = form.getValues();
                   		if(Newtec.Utils.isNull(dep.parentId)){
                   			Newtec.Window.hint("请选择正确的父部门");
                   			return
                   		}
                   		data.parentId = dep.parentId;
                   		Newtec.Window.confirm(function(isTrue){
                       		departmentDs.updateData({
                   				operId: "toUpdateDepartment", 
                   				data: data,
                   				callback: function(res){
                   					if(res.status == 0){
                   						Newtec.Window.hint("迁移成功");
                       					win.close();
                       					that.updateTreeData(res.data, false);
                   					}else{
                   						Newtec.Window.hint("错误：" + res.error);
                   					}
                   				}
                   			})
                       	},"是否迁移该部门及其底下的所有部门");
                   	}
                	}).newtecJQ).append(Newtec.Button.create({
               		title:'取消',
               		className: 'btn2',
                   	click:function(){
                   		win.close();
                   	}
                	}).newtecJQ),
                	canFullScreen:true,
           	});
           },
           //移除部门树下选中部门及所有子部门数据
           removeDepData: function(parentData, data){
           	var depData = this.getDepChild(data,[]);
           	for(var i = parentData.length -1; i >= 0; i--){
           		for(var j = 0; j < depData.length; j++){
           			if(parentData[i].id == depData[j].id){
           				parentData.splice(i, 1); 
           			}
           		}
           	}
           	return parentData;
           },
           //获取当前部门及所有子部门数据
           getDepChild: function(data, depData){
           	var that = this;
           	if(Newtec.Utils.isArray(data)){
           		var hasChild = false;
           		for(var i = 0; i < data.length; i++){
           			depData.push(data[i]);
           			if(!Newtec.Utils.isNull(data.children)){
           				hasChild = true;
           				return that.getDepChild(data.children, depData);//存在子节点，递归
                   	}
           		}
           		if(!hasChild){//全部没有子节点，返回
           			return depData;
           		}
           	}else{
           		depData.push(data);
           		if(Newtec.Utils.isNull(data.children)){
               		return depData;
               	}else{
               		return that.getDepChild(data.children, depData);//存在子节点，递归
               	}
           	}
           },
           addDepartment: function(){
           	var that = this;
           	var parentData = that.tree.getSelectedRecords();
           	if(Newtec.Utils.isNull(parentData)){
           		Newtec.Window.hint("请选中新增部门的上级部门");
           		return;
           	}
           	if(parentData.sourceId == "-1"){
           		Newtec.Window.hint("你没有权限操作改部门");
           		return;
           	}
           	var depDatas = that.depData;//所有部门包括父部门
       		var childDeps = [];
       		for(var i = 0; i < depDatas.length; i++){
       			if(depDatas[i].sourceId != "-1"){
       				childDeps.push(depDatas[i]);
       			}
       		}
           	var form = that.createForm(2, childDeps);
           	var depData =  that.tree.clickedRecord;
           	if(depData.sourceId == 1){
           		form.setValues({parentId: depData.id});
           	}
           	var win = Newtec.Window.create({
           		title: '新增部门',
              		width: 900,
              		body: form.newtecJQ,
               	height: 500,
               	canDrag: false,
             	  //header: header,
               	footer: Newtec.Button.create({
               		title:'保存',
                   	click:function(){
                   		if(!form.validate())
                   			return
                   		var data = form.getValues();
                   		if(!Newtec.Utils.isNull(data.sort) && data.sort <= 0 ){
                   			Newtec.Window.hint("序号请输入大于0的整数");
                   			return
                   		}
                   		departmentDs.addData({
                   			operId:"toAddDepartment",
                   			data:data,
                   			callback: function(res){
                   				if(res.status == 0){
                   					Newtec.Window.hint("添加成功");
                   					that.updateTreeData(res.data, true);
                   					win.close();
                   				}else{
                   					if(res.error.match("UNIQUE_DEP_USERCODE")){
                   						Newtec.Window.hint("部门编码已经存在");
                   					}else{
                   						Newtec.Window.hint("错误："+res.error);
                   					}
                   				}
                   			}
                   		})
                   	}
                	}),
                	canFullScreen:true,
           	});
           },
           //更新部门信息
           updateDepartment: function(){
           	var that = this;
           	var oldData = that.selectData;
           	if(Newtec.Utils.isNull(oldData)){
           		Newtec.Window.hint("请选择需要修改的数据");
           		return
           	}
           	var form = that.updateForm;
           	if(!form.validate())
       			return
       		var data = form.getValues();
           	data['id'] = oldData.id;
           	if(data.id == data.parentId){
           		Newtec.Window.hint("不能选择本部门为其上级部门");
           		return
           	}
           	//判断选择的父部门是否在权限内
           	if(oldData.parentId != data.parentId){
           		console.info("that.depData");
           		var deps = that.depData;
           		for(var i = 0; i < deps.length; i++){
           			if(deps[i].id == data.parentId && deps[i].sourceId == "-1"){
               			Newtec.Window.hint("您没有权限选择"+deps[i].name+"为上级部门");
               			return
           			}
           		}
           	}
       		departmentDs.updateData({
       			operId:"toUpdateDepartment",
       			data:data,
       			callback: function(res){
       				if(res.status == 0){
       					Newtec.Window.hint("修改成功");
       					that.updateTreeData(res.data, false);
       				}else{
       					if(res.error.match("UNIQUE_DEP_USERCODE")){
       						Newtec.Window.hint("部门编码已经存在");
       					}else{
       						Newtec.Window.hint("错误："+res.error);
       					}
       				}
       			}
       		})
           },
           createForm: function(columnNum, data){
           	var that = this;
           	var fields = [
       	        //类型默认为text
       	        {name: "name", title: '部门名称',required:"部门名字不能为空",redstar:true},
       	        {name: "userCode", title: '部门编码',required:"部门编码不能为空",redstar:true},
       	        {name: "parentId", title: '上级部门', data: data, type: "select",showDownIcon:true,required:"上级部门名字不能为空",redstar:true,},
       	        {name: "areaId", title: '区划名称', type: "select",showDownIcon:true,
           	        	ds: {name:'areaNode',endRow:1000,},displayName:'name',valueName: 'id',required:"区划不能为空",redstar:true,value:"086151698acd42189ab05153dd9c8424"},
   //    	        {name: "code", title: '系统编码'},
   //    	        {name: "userCode", title: '业务编码'},
   //    	        {name: "fullName", title: '全路径'},
   //    	        {name: "sourceId", title: 'sourceId'},
           	    {name: "sort", title: '序号'},
       	        {name: "email", title: 'email'},
       	        {name: "leve", title: '级别'},
       	        {name: "description", title: '描述'},
       	        {name: "fax", title: '传真'},
       	        {name: "addr", title: '地址'},
   //    	        {name: "sort", title: '排序'},
       	        {name: "status", title: '状态', data: {'禁用':'禁用','启用':'启用'}, type: "select",showDownIcon:true},
   //    	        {name: "name", title: '是否目录'},
       	    ];
           	var form = Newtec.Form.create({
           		titleColumn: 4,
           	    columnNum: columnNum,
           	    fields: fields,
           	})
           	form.items.userCode.newtecJQ.keyup(function(){
           		var inputJQ = $($(this).find("input"));
           		var value = inputJQ.val();
           		if(!Newtec.Utils.isNull(value)){
           			value = value.replace(/[^\w_]/g,'');
           			inputJQ.val(value);
           		}
       		})
           	return form;
           },
           
       })
})();