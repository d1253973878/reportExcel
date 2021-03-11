/**
 * 系统：统一权限平台
 * 页面：角色定义
 * @author 王宇瀚
 */
(function () {
		Newtec.EntityPage||Newtec.Utils.addJS("page/newtec.entitypage.js");
   Newtec.RolePage = function (params) {
           //默认
           this.defaults = {
               ds: '',
   //            selectParam:{
   //            	 name: 'applicationId',
   //                 title: '',
   //                 mouseShow:false,
   //                 showDownIcon: true,
   //                 value: Newtec.Person.getPowerAppId("name"),
   //                 type: 'select',
   //                 ds: {
   //                     name: 'application',
   //                     startRow: -1,
   //                     select: ['id', 'name'],
   //                     sortBy: {id: 'desc', name: 'asc'},
   //                     callback: function (response) {
   //                     }
   //                }
   //            },
               entityParam:{
               	autoFetch:false,
               	 initBtns : function(btns){
   //            		btns.push({title:'新增',click:function(){alert(1);}});
    			 	},
                 addBefore:function(values){
               	values['applicationId']=Newtec.Person.getPowerAppId("name");
               	console.info("==>",values);
               },
               }
           };
           //合并
           this.defaults = $.extend(true,this.defaults, params);
           //处理数据源
           var ds = this.defaults.ds;
           this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;
           params.ds = this.ds;
           if (!this.ds) {
               console.log("ds is undefined");
               alert('ds is undefined');
           }
       };
       
       Newtec.RolePage.exte(Newtec.Base, 'rolePage');
       Newtec.RolePage.over({
       	
           createNewtecJQ: function (params) {
           	var that = this;
               var entityParam=params.entityParam;
               if(Newtec.Utils.isNull(entityParam.ds)){
               	entityParam.ds=params.ds;
               }
               if(Newtec.Utils.isNull(entityParam.fetchParam)){
               	entityParam.fetchParam={data: {applicationId: Newtec.Person.getPowerAppId("name")
               		/*personId:Newtec.Person.get().id*/},operId:'getRole'};
               }
               entityParam.initBtns = function(btns){//初始化右上方的按钮
               	btns.length=0;
           		btns.push({title:'新增',className: 'btn newtec-btn btn-success',click:function(){that.addRole()}});
           		btns.push({title:'修改',className: 'btn newtec-btn btn btn-warning',click:function(){that.updateRole()}});
           		btns.push({title:'批量删除',className: 'btn newtec-btn btn btn-danger',click:function(){that.deleteRole()}});
           		btns.push({title:'授权所有用户',className: 'btn newtec-btn btn btn-warning',click:function(){}});
           		btns.push({title:'回收授权所有用户',className: 'btn newtec-btn btn btn-danger',click:function(){}});
   			 }
               entityParam.tdValueHtmlFun=function(value,data,a,b,name){
               		if(name=='autoAddPerson'){
               			return value==0?"不自动授权":'添加用户自动授权该角色';
               		}else{
               			return value;
               		}
               }
               if(Newtec.Utils.isNull(entityParam.tableHeaderOther)){//显示应用选择的下拉框
               	var thatJQ = $(that.defaults.appendTo);
               	var other = $("<div class='pull-left' style='margin-left:10px;'></div>");
               	var appSelect = that.createAppSelect(params);
               	that.appSelect = appSelect;
               	other.append(appSelect.newtecJQ);
               	entityParam.tableHeaderOther=other;
               }
               //创建页面
               var entityPageNewtecJQ = Newtec.EntityPage.create(entityParam);
               that.entityPageNewtecJQ = entityPageNewtecJQ;
               that.table = entityPageNewtecJQ.table;
               that.table.setDbclickRecord(function(record){//双击显示修改表单
               	that.updateRole(record)
               });
               return entityPageNewtecJQ.newtecJQ;
           },
           // 创建应用下拉列表
           createAppSelect: function(params){
           	var that = this;
           	var appSelect = Newtec.MySelect.createAdmin();
           	//重写onChange事件，加载对应应用页面
           	appSelect.onChange = function (element, checked, value, name) {
           		console.log('切换应用id=' + name);
           		console.log('根据应用id查询');
           		Newtec.Person.setPowerAppId(name);//保存当前选择应用
           		var table = that.table;
           		if(table!=undefined){
           			var data=table.fetchParam.data==undefined?{}:table.fetchParam.data;
           			data.applicationId=name;
           			table.fetchParam.data=data;
           			table.fetchParam.operId='getRole'
           			table.fetchData();
           		}
           	};
           	return appSelect;
           },
           //添加角色
           addRole: function(){
           	var that = this;
           	that.createWindow("添加角色", "添加", function(data, win){
//           		data.personId=Newtec.Person.get().id;
           		that.ds.addData({
           			data: data,operId:"addRole",
           			callback: function(res){
           				if(res.status == 0){
           					win.close();
           					that.table.addRecords(res.data);
           					Newtec.Window.hint("添加角色成功");
           				}else{
           					Newtec.Window.hint("错误，", res.error);
           				}
           			}
           		})
           	});
           },
           //删除角色
           deleteRole: function(){
           	var that = this;
           	Newtec.Window.confirm(function(isTrue){
           		var data = that.table.getSelectedRecords();
               	if(Newtec.Utils.isNull(data)){
               		Newtec.Window.hint("请选择需要修改的数据");
               		return
               	}
               	var ids="";
               	for(var i=0;i<data.length;i++){
               		ids+=(i==0?"":",")+data[i].id;
               	}
               	that.ds.removeData({
           			data: {ids:ids},operId:'deleteRole',
           			callback: function(res){
           				if(res.status == 0){
           					that.table.removeRecords(data);
           					Newtec.Window.hint("修改角色成功");
           				}else{
           					if(res.error.match("a foreign key constraint fails")){
           						Newtec.Window.hint("该角色存在其他关联，无法执行删除");
           					}else{
           						Newtec.Window.hint("错误", res.error);
           					}
           				}
           			}
           		})
           	},"是否进行删除？");
           },
           //更新角色
           updateRole: function(record){
           	var that = this;
           	var updateData;
           	//判断是否为点击
           	if(Newtec.Utils.isNull(record)){
           		var roleData = that.table.getSelectedRecords();
           		if(Newtec.Utils.isNull(roleData)){
               		Newtec.Window.hint("请选择需要修改的数据");
               		return
               	}
               	if(Newtec.Utils.isArray(roleData) && roleData.length > 1){
               		Newtec.Window.hint("只能选择一条数据");
               		return
               	}
               	updateData = roleData[0];
           	}else{
           		updateData = record;
           	}
           	that.createWindow("修改角色", "修改", function(data, win){
           		that.ds.updateData({
           			data: data,operId:'updateRole',
           			callback: function(res){
           				if(res.status == 0){
           					win.close();
           					that.table.updateRecords(data);
           					Newtec.Window.hint("修改角色成功");
           				}else{
           					Newtec.Window.hint("错误，",res.error);
           				}
           			}
           		})
           	}, updateData);
           },
           //创建弹框表单，用于新增和修改角色 
           createWindow: function(title, btnTitle, clickFun, roleData){
           	var that = this;
           	var fields = that.ds.fields;//获取ds内的字段
           	var form = Newtec.Form.create({
           	    titleColumn: 3,
           	    columnNum: 1,
           	    fields: fields
           	});
           	if(!Newtec.Utils.isNull(roleData)){//修改时赋值
           		form.setValues(roleData);
           	}
           	var body = $("<div style='padding-top: 30px'></div>").append(form.newtecJQ);
           	var win = Newtec.Window.create({
           		title: title,
              		body: body,
              		width: 450,
               	height: 300,
               	canDrag: true,
               	canFullScreen:true,
               	footer: [Newtec.Button.create({
               		title:btnTitle,
                   	click:function(){
                   		if(!form.validate()){
                   			return ;
                   		}
                   		var data = form.getValues();
                   		var appId = that.appSelect.getValue();//获取当前appId;
                   		if(Newtec.Utils.isNull(appId)){
                   			Newtec.Window.hint("错误，应用id不能为空");
                   			return ;
                   		}
                   		if(Newtec.Utils.isNull(data.name)){
                   			Newtec.Window.hint("用户名不能为空");
                   			return ;
                   		}
                   		data.applicationId = appId;
                   		clickFun(data, win);//回调函数，并传入需要操作的数据和window对象
                   	}
                	}),Newtec.Button.create({
               		title:'取消',
               		className: 'btn newtec-btn btn btn-danger',
                   	click:function(){
                   		win.close();
                   	}
                	}),]
            	});
           }
       });
       Newtec.Module("RolePage")
})();