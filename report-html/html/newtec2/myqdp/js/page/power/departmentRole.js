(function () {
	Newtec.Utils.addJS("Table");
	Newtec.Utils.addJS("Form");
	Newtec.Utils.addJS("TreeGrid");
    Newtec.DepartmentRole = function (params) {
           this.defaults = {
               appendTo: '',
               ds: 'department',
               add: true,
               update: true,
               remove: true,
               expand: true,
               showIcon: false,
               showCheckbox: false,
               loadStepBS:false,
               treeParam: {
   	    		 showRightMenu: false,
   	    	     showCheckbox: false,
   	    	     autoFetch: false,
   	    	     loadStepBS:true,
   	    		 tdStyle:'white-space: nowrap;',
   	    		 fetchParam:{
   	    			 operId:'getAbleDepsParentByPersonId',
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
            if(this.defaults.loadStepBS){
            	var treeParam=this.defaults.treeParam;
           		treeParam.expand=false;
           		treeParam.loadStepBS=true;
           		treeParam.fetchParam.data= {isLoad:"isLoad"};
           		this.loadStepBS=true;
           }
       };
       var departmentDs = Newtec.DS.get("department");
       Newtec.DepartmentRole.exte(Newtec.Base, 'departmentRole');
       Newtec.DepartmentRole.over({
           createNewtecJQ: function (params) {
               var that = this,leftId='',win='',form='',departmentds=Newtec.DS.create("departmentDS");
               var thisJQ = $(this.defaults.appendTo);
               this.getTreeData();
               this.createHead();
               this.createSelectApp(params);
               this.createTopButton(params);
               thisJQ.append(this.head);
               this.leftId = 'treePage_left_' + Newtec.Utils.uuid16();
               this.leftJQ = $("<div id='" + this.leftId + "' class='' style='width:50%;float:left;position:absolute;left:0;top:40px;right:50%;bottom:0;border-top: 3px solid white;border-right: 3px solid white;padding-right:3px;'></div>");
               this.rightId = 'treePage_right_' + Newtec.Utils.uuid16();
               this.rightJQ = $("<div id='" + this.rightId + "' class='' style='padding-top:5px;heigth:100%;width:49%;float:left;left:50%;top:40px;right:0;position: absolute;bottom:0;border-top: 1px solid #cccccc;'></div>");
               thisJQ.append(this.leftJQ).append(this.rightJQ);
               this.leftJQ.append(this.createLeftTree(params));
               this.rightJQ.append(this.createRightTable(params));
               return thisJQ;
           },
           //获取左树的显示
           getTreeData: function(){
           	var that = this;
						console.info("======getTreeData========")
           	departmentDs.fetchData({
           		operId: 'getAbleDepsParentByPersonId',
           		data:this.loadStepBS&&{isLoad:"isLoad"}||null,
           		callback: function(res){
           			if(res.status == 0){
           				var data = res.data;
           				var deps = [];
               			for(var key in data){
//             				delete data[key].isFolder;
               				if(key.endWith('_0')){
               					deps.push(data[key]);
               				}else{
               					data[key].sourceId = "-1"
               					deps.push(data[key]);
               				}
               			}
										console.info("-------deps--",deps);
               			that.depData = deps;//所有部门的id;
               			that.tree.setData(deps);
   //            			that.tree.initTreeGrid();
           			}else{
           				Newtec.Window.hint("错误：获取部门树失败！");
           				console.err(res.errors);
           			}
           		}
           	})
           },
           createHead: function () {
               var head = $("<div style='width:100%;height:40px;position: absolute;left:0;top:0; line-height:40px; background:#e8ebf3; text-align:center;'></div>");
               var headLeft = $("<div class='pull-left' style='margin-left:10px;'></div>");
               var headRight = $("<div class='pull-right'></div>");
               head.append(headLeft);
               head.append(headRight);
               this.head = head;
               this.headLeft = headLeft;
               this.headRight = headRight;
               return head;
           },
           //创建左边的树
           createLeftTree: function(params){
           	var treeParam = params.treeParam;
           	var that = this;
           	treeParam.ds = params.ds;
           	treeParam.onClick=treeParam.onClick||function(trDom){
   	       		 var depData=tree.getSelectedRecords();
   	       		that.table.selectAll(false);
   	       		 if(depData.sourceId == "-1"){
   	       			return;
   	       		 }
   	       		 var data = {
   	       			relationLeftIdValue: depData.id, 
   	       			applicationId: that.selectApp.getValue(),
   	       		 }
   	       		 departmentDs.fetchData({
   	       			 operId: "getNodeByAppAndDepartment",
   	       			 data: data,
   	       			 callback: function(res){
   	       			 	 that.depRoleData = res.data;
   	       				 if(res.status == 0 && !Newtec.Utils.isNull(res.data)){
   	       					 that.table.selectByData(res.data); 
   	       				 }
   	       			 }
   	       		})
   	       	};
   	       	console.warn("==treeParam=??",treeParam)
           	var tree = Newtec.TreeGrid.create(treeParam);
           	this.tree = tree;
           	return tree.newtecJQ;
           },
           
           createRightTable: function(params){
           	var that = this;
           	var table = Newtec.Table.create({
           		ds: Newtec.DS.get("role"),
           		 fetchParam:{operId:'getRole'},
           		showHeader: false,
   	        	showPagin: true,
   	        	showFetchForm: false,
   	        	showFooter: true,
     	        height: '100%',
   	        	showFilter: true,
   //	        	autoFetch: true,
           	})
           	that.table = table;
           	return table.newtecJQ;
           },
           //下拉框
           createSelectApp: function(params){
           	var that = this;
           	var selectApp = Newtec.MySelect.createAdmin() ;
						selectApp.onChange = function (element, checked, value, name) {
                that.table.fetchParam = {data: {applicationId: name}};
                that.table.fetchData();
                var depData = that.tree.getSelectedRecords();
                if(!Newtec.Utils.isNull(depData)){
                	var data = {
                				relationLeftIdValue: depData.id, 
                				applicationId: name,
                			}
                			departmentDs.fetchData({
                				operId: "getNodeByAppAndDepartment",
                				data: data,
                				callback: function(res){
                					if(res.status == 0 && !Newtec.Utils.isNull(res.data)){
                						setTimeout(function(){
                								that.table.selectByData(res.data);
                								that.depRoleData = res.data;
                	}, 100);
                					}
                				}
                			})
                }
            };
           	that.selectApp = selectApp;
           	that.headLeft.append(selectApp.newtecJQ);
           },
           //顶部事件
           createTopButton: function(params){
           	var that = this;
           	var btns = [{
   	        		title:"机构分配角色",
   	        		click: function(){
   	        			var data = that.getUpdateRelaData();
   	        			if(Newtec.Utils.isNull(data))
   	        				return
   	        			departmentDs.updateData({
   	        				operId:"setDepartmentAndRoleRelation",
   	        				data: data,
   	        				callback: function(res){
   	        					if(res.status == 0){
   	        						Newtec.Window.hint("分配成功");
   	        						that.depRoleData = that.table.getSelectedRecords();
   	        					}
   	        				}
   	        			})
   	        		}
   	        	}
           	]
           	for(var i = 0; i < btns.length; i++){
           		that.headRight.append(Newtec.Button.create(btns[i]).newtecJQ);
           	}
           },
           //获取部门设置角色的数据
           getUpdateRelaData: function(){
           	var that = this;
   			var depData = that.tree.getSelectedRecords();
           	if(Newtec.Utils.isNull(depData)){
   				Newtec.Window.hint("请选择需要分配的部门");
   				return
   			}
           	if(depData.sourceId == "-1"){
   				Newtec.Window.hint("没有操作"+ depData.name +"的权限");
   				return
   			}
   			var roleData = that.table.getSelectedRecords();//新的角色关系
           	var depRoleData = that.depRoleData; //旧的角色关系
   			var relationRightIdValues = "";
   			var deleteIds = "";
   			if(Newtec.Utils.isNull(roleData) && Newtec.Utils.isNull(depRoleData)){
   				Newtec.Window.hint("数据没有发生变化");
   				return
   			}
   			if(Newtec.Utils.isNull(roleData)){//取消全选
   				for(var i = 0; i < depRoleData.length; i++){
   					deleteIds += (deleteIds?",":"") + depRoleData[i].id;
   				}
   			}else if(Newtec.Utils.isNull(depRoleData)){//新增
   				for(var i = 0; i < roleData.length; i++){
   					relationRightIdValues += (relationRightIdValues?",":"") + roleData[i].id;
   				}
   			}else if(Newtec.Utils.isArray(roleData) && Newtec.Utils.isArray(depRoleData)){//有新增，有删除
   				for(var i = 0; i < roleData.length; i++){//移除没有修改的数据
   					for(var j = 0; j < depRoleData.length; j++){
   						if(roleData[i].id == depRoleData[j].id){
   							roleData.splice(i, 1);
   							depRoleData.splice(j, 1);
   						}
   					}
   				}
   				for(var i = 0; i < depRoleData.length; i++){
   					deleteIds = deleteIds?",":"" + depRoleData[i].id;
   				}
   				for(var i = 0; i < roleData.length; i++){
   					relationRightIdValues = relationRightIdValues?",":"" + roleData[i].id;
   				}
   			}
   			if(Newtec.Utils.isNull(relationRightIdValues) && Newtec.Utils.isNull(deleteIds)){
   				Newtec.Window.hint("数据没有发生变化");
   				return
   			}
           	var data = {
       			relationLeftIdValue: depData.id,
       			relationRightIdValues: relationRightIdValues,
       			deleteIds: deleteIds,
       		}
           	return data;
           },
           finsh: function (params) {
               this.leftJQ.mCustomScrollbar({
                   theme: "minimal-dark",
                   scrollInertia: 200
               });
//             this.rightJQ.mCustomScrollbar({
//                 theme: "minimal-dark",
//                 scrollInertia: 200
//             });
           },
           
       });
    
 
})();