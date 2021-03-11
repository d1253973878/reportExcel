;(function(){
//	alert('window.frameElement=='+window.frameElement);
	Newtec.Table||Newtec.Utils.addJS("widget/newtec.table.js");
	Newtec.Form||Newtec.Utils.addJS("widget/newtec.form.js");

	Newtec.EntityPage = function (params) {
		var ds = params.ds;
		params.ds = Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		this.dsName = params.ds.dsName;
		this.table;
		this.defaults = {
				 ds: '',
				add:true,
				addId:'',//后台请求的增加id
				addTitle:'增&nbsp;加',
				addFun:'',//重写该方法，则默认的添加方法不调用，该方法可以获取到table,params,pageThis
				addBefore:function(values){return true;},//返回fale可以阻止增加操作
				addAfter:function(response){},
				remove:true,
				removeId:'',
				removeTitle:'删&nbsp;除',
				removeFun:'',//重写该方法则默认删除方法不调用，该方法可以获取到data,table,params,pageThis
				removeBefore:function(values){return true;},//返回false阻止删除操作
				removeAfter:function(response){},
				update:true,
				updateId:'',
				updateTitle:'修&nbsp;改',
				updateFun:'',//重写该方法，则默认更新方法不调用，该方法可以获取到data,table,params,pageThis
				updateBefore:'',
				updateAfter:'',
				updateCreateWin:function(data,table){return null},//假如返回值不为空，默认的窗口不创建
				updateCreateWinAfter:function(data,table,win){},
				fetch:true,
				fetchId:'',
				fetchTitle:'查&nbsp;询',
				height: '100%',
				fetchBefore:function(values){return true;},//返回false阻止删除操作
				initBtns:function(btns){},//可以增加或移除按钮
				 trBtnWidth: 180,
			        showHeader: true,
			        autoFetch: true,
			        fetchParam: {endRow: 2}
			       , tdValueHtmlFun: function (tdValue, data, row, col,colName) {return tdValue;}
			        , trBtnFun: function (row, record, tr, table) {}
			        ,createPageAfter:function(page,params,tdd){}
		};//定义缺省参数.
	};
	Newtec.EntityPage.exte(Newtec.Base,'entitypage');
	Newtec.EntityPage.over({
		getAddBtnId:function(){
			return this.dsName+"_"+Newtec.DS.OperType.add+"_button_id";
		},
		getRemoveBtnId:function(){
			return this.dsName+"_"+Newtec.DS.OperType.remove+"_button_id";
		},
		getUpdateBtnId:function(){
			return this.dsName+"_"+Newtec.DS.OperType.update+"_button_id";
		},
		getFetchBtnId:function(){
			return this.dsName+"_"+Newtec.DS.OperType.fetch+"_button_id";
		},
		finAppendToJQ:function(params){
			/*var name = window.frameElement.name;
			var ff = $(parent.window.frames[name].document).find(params["appendTo"]);*/
			var frame = window.frameElement;
			if(frame==null || frame==undefined) return params["appendTo"];
			var frame = Newtec.AppUtils.getFrameWin(frame.name);
			return $(frame.document).find(params["appendTo"]);;
		},
		createNewtecJQ:function(params){
			 /** 1表示高安全级别权限控制(field)，按钮和数据的行列集权限由权限控制；
			 * 0表示低安全级别权限控制(node)，系统出菜单外的资源不受权限控制，默认全部显示
			 * 2：表示菜单和按钮受权限控制(butto、n)*/
		var appAuthorLevel = Newtec.Person.get().app.authorityControl;//系统的权限级别	
		var has = appAuthorLevel==0; 
		  //数据库中的权限
	    var btnMap = {};
	    if(has==false)//需要授权
	    	btnMap = Newtec.Person.getButton();
		var ds = params.ds;
		var btnFetch = btnMap[this.getFetchBtnId()];
		if(params[Newtec.DS.OperType.fetch]&&(has || btnFetch != undefined)){//表格参数中的Fetch必须为true
			params.showFetchForm = true;
			if(appAuthorLevel==2){//字段权限需要控制
				var fetchFormFields = Newtec.Person.getPowerField(ds['fields'],'fetchFields',ds.dsName+"_fetch_id","searchLabelSign","searchLabel");
				console.log(fetchFormFields);
	     		if(fetchFormFields.length<=0){
	     			params.showFetchForm = false;
	     			Newtec.Window.createHint({html: '查询表单没有分配权限字段！', className: 'btn btn-danger'});
//	                return;
	     		}else{
	     			params.fetchFormParam = {fields:fetchFormFields};
	     		}
	     		
			}
			params.fetchTitle = btnFetch==undefined || btnFetch.name=='' ? params['fetchTitle'] : btnFetch.name;
			var operId = btnFetch==undefined?'':btnFetch['operationId'];
			params.fetchParam.operId = Newtec.Utils.isNull(operId) ? (params["fetchId"]==undefined?'':params["fetchId"]) :operId;
		}
		params.id = '';//不要让page的id覆盖到table的id
		if(appAuthorLevel==2){//字段权限需要控制
			console.info(ds['fields']);
			params['fields'] = Newtec.Person.getPowerField(ds['fields'],'listFields',ds.dsName+"_list_id","listColumnSign","listColumn");
     		if(params['fields'].length<=0){
     			Newtec.Window.createHint({html: '列表字段没有分配权限字段！', className: 'btn btn-danger'});
                return;
     		}
		}
	    var tdd = Newtec.Table.create(params);// 创建表
	    this.table = tdd;
	    var btns = [];
	    var btnAdd = btnMap[this.getAddBtnId()];
//	    alert(has+"----->"+Newtec.Utils.json2str(btnMap));
	     if(params[Newtec.DS.OperType.add]&&(has || btnAdd != undefined)){//表格参数中的Add必须为true
	    	 var addTitle = btnAdd==undefined || btnAdd.name=='' ? params['addTitle'] : btnAdd.name;
	    	 btns.push({
	             title: addTitle,
	             click: function () {
	            	 var addFun=params.addFun;
	            	 if(Newtec.Utils.isFunction(addFun)){
	            		 addFun(tdd,params,this);
	            	 }else{
	            		 console.log(ds);
	            		 var addFormParam = {
	            				 titleColumn: 4,
	            				 columnNum: 3,
	            				 operType:Newtec.DS.OperType.add,
	            				 ds: ds,
	            				 createFieldBefore:params['createFieldBefore']
	            		 };
	            		 if(appAuthorLevel==2){//字段权限需要控制
	            			 addFormParam['fields'] = Newtec.Person.getPowerField(ds['fields'],'formFields',ds.dsName+"_add_id","formLabelSign","formLabel");
	            			 if(addFormParam['fields'].length<=0){
	            				 Newtec.Window.createHint({html: '增加表单没有分配权限字段！', className: 'btn btn-danger'});
	            				 return;
	            			 }
	            		 }
	            		 var form = Newtec.Form.create(addFormParam);// form結束,
	            		 
	            		 var win = Newtec.Window.create({
	            			 title: addTitle+'窗口',
	            			 width: 1024,
	            			 body: form,
	            			 footer: Newtec.Button.create({
	            				 title: addTitle,
	            				 click: function (a) {
//	 										alert('表单内容：'+Newtec.Utils.json2str(form.getValues()));
//	 										if(true) return ;
	            					 var validate = form.validate();
//	 										var t = form.form.data('bootstrapValidator').validate();
	            					 if (validate) {//验证通过
	            						 Newtec.Window.createAdd(function (bool) {
	            							 if (bool == false) return;
//	                                     var values = form.getValues();
	            							 var values = form.getAllValues();
	            							 var addBefore = params['addBefore'];
	            							 if(Newtec.Utils.isFunction(addBefore)){
	            								 if(addBefore(values)==false) return ;
	            							 }
	            							 var operId = btnAdd==undefined?'':btnAdd['operationId'];
	            							 operId = Newtec.Utils.isNull(operId) ? (params["addId"]==undefined?'':params["addId"]) :operId;
	            							 tdd.addData(values, operId, function (response) {
//	 													alert('增加返回值：'+Newtec.Utils.json2str(response));
	            								 if(response.status==0){
	            									 win.close();
	            									 Newtec.Window.createHint({html: '<span>'+addTitle+'成功！<span>'});
	            								 }else{
	            									 Newtec.Window.createHint({html: response.error, className: 'btn btn-danger'});
	            								 }
	            								 var addAfter = params['addAfter'];
	            								 if(Newtec.Utils.isFunction(addAfter)){
	            									 addAfter(response);
	            								 }
	            							 });
	            						 });
	            					 }
	            					 
	            				 }
	            			 })
	            		 });
	            	 }
	             }
	         });
	    }
	     var btnRemove = btnMap[this.getRemoveBtnId()];
	     if(params[Newtec.DS.OperType.remove]&&(has || btnRemove!= undefined)){
	    	 var removeTitle = btnRemove==undefined || btnRemove.name== ''? params['removeTitle']:btnRemove.name;
	    	btns.push({
	            title: removeTitle,
	            className: 'btn-warning',
	            click: function () {
	            	var datas = tdd.getSelectedRecords();
            		if (datas.length <= 0) {
            			Newtec.Window.createHint({html: '请选择要删除的记录！', className: 'btn btn-danger'});
            			return;
            		}
	            	var removeFun=params.removeFun;
	            	if(Newtec.Utils.isFunction(removeFun)){
	            		removeFun(datas,tdd,params,this);
	            	}else{
	            		Newtec.Window.createDelete(function (bool) {
	            			if (bool == false) return;
	            			var removeBefore = params['removeBefore'];
	            			if(Newtec.Utils.isFunction(removeBefore)){
	            				if(removeBefore(datas)==false) return ;
	            			}
	            			var operId = btnRemove==undefined?'':btnRemove['operationId'];
	            			operId = Newtec.Utils.isNull(operId) ? (params["removeId"]==undefined?'':params["removeId"]) :operId;
	            			tdd.removeData(datas,operId, function (response) {
	            				if(response.status==0){
	            					Newtec.Window.createHint({html: '<span>'+removeTitle+'成功！<span>'});
	            				}else{
	            					Newtec.Window.createHint({html: response.error, className: 'btn btn-danger'});
	            				}
	            				
	            				var removeAfter = params['removeAfter'];
	            				if(Newtec.Utils.isFunction(removeAfter)){
	            					removeAfter(response);
	            				}
	            			});
	            		});
	            	}
	            }
	        });
	    }
	     var btnUpdate = btnMap[this.getUpdateBtnId()];
	     if(params[Newtec.DS.OperType.update]&&(has || btnUpdate!= undefined)){
	    	 
	    		 tdd.setDbclickRecord(function (data, t) {
	    			 var updateFun=params.updateFun;
	    			 console.info(data);
	    			 if (Newtec.Utils.isFunction(updateFun)) {
	    				 updateFun(data,tdd,params,this);
	    			 }else{
	    				 var updateWin=params.updateCreateWin(data, t);
	    				 if (Newtec.Utils.isNull(updateWin)) {
	    					 var updateFormParam= {
//		 				"appendTo" : "#form1",
	    							 titleColumn: 3,
	    							 columnNum: 3,
	    							 operType:Newtec.DS.OperType.update,
	    							 ds: ds,
	    							 values: data,
	    							 createFieldBefore:params['createFieldBefore']
	    					 };
	    					 if(appAuthorLevel==2){//字段权限需要控制
	    						 updateFormFields = Newtec.Person.getPowerField(ds['fields'],'formFields',ds.dsName+"_update_id","formLabelSign","formLabel");
	    						 if(updateFormFields.length<=0){
	    							 Newtec.Window.createHint({html: '更新表单没有分配权限字段！', className: 'btn btn-danger'});
	    							 return;
	    						 }
//	             		updateFormFields.push({name:ds.pk ,hidden:true});//增加主键到更新表单
	    						 updateFormParam['fields'] = updateFormFields;
	    					 }
	    					 console.info(updateFormParam);
	    					 var updateForm = Newtec.Form.create(updateFormParam);
	    					 
	    					 var updateTitle = btnUpdate==undefined || btnUpdate.name=='' ? params['updateTitle']: btnUpdate.name;
	    					 updateWin = Newtec.Window.create({
	    						 title: updateTitle+'窗口',
	    						 width: 1024,
	    						 body: updateForm,
	    						 footer: Newtec.Button.create({
	    							 title: updateTitle,
	    							 click: function (a) {
	    								 Newtec.Window.createUpdate(function (bool) {
	    									 if (bool == false) return;
	    									 var values = updateForm.getValues();
	    									 var updateBefore = params['updateBefore'];
	    									 if(Newtec.Utils.isFunction(updateBefore)){
	    										 if(updateBefore(values)==false) return ;
	    									 }
	    									 var operId = btnUpdate==undefined?'':btnUpdate['operationId'];
	    									 operId = Newtec.Utils.isNull(operId) ? (params["updateId"]==undefined?'':params["updateId"]) :operId;
	    									 values[ds.pk] = data[ds.pk];//增加主键的值
	    									 tdd.updateData(values, operId, function (response) {
//	 								alert(Newtec.Utils.json2str(response));
	    										 if(response.status==0){
	    											 updateWin.close();
	    											 Newtec.Window.createHint({html: '<span>'+updateTitle+'成功！<span>'});
	    										 }else{
	    											 Newtec.Window.createHint({html: response.error, className: 'btn btn-danger'});
	    										 }
	    										 //alert('更新返回值：'+Newtec.Utils.json2str(response));
	    										 var updateAfter = params['updateAfter'];
	    										 if(Newtec.Utils.isFunction(updateAfter)){
	    											 updateAfter(response);
	    										 }
	    									 });
	    								 });
	    							 }
	    						 })
	    					 });
	    				 }
	    				 var updateCreateWinAfter=params['updateCreateWinAfter'];
	    				 if (Newtec.Utils.isFunction(updateCreateWinAfter)) {
	    					 updateCreateWinAfter(data, t,updateWin);
	    				 }
	    				 
	    			 }
	    		 });
			
	    }
	    var initBtns = params['initBtns'];
	    if(Newtec.Utils.isFunction(initBtns)){
	    	initBtns(btns);
	    }
	    tdd.addButtons(btns);
	    this.page = $('<div style="height: 100%"></div>'); 
	    this.page.append(tdd.newtecJQ);
	    this.finsh=function(params){
			var createPageAfter=params['createPageAfter'];
			if (Newtec.Utils.isFunction(createPageAfter)) {
				createPageAfter(this,params,tdd);
			}
		}
	    return  this.page;
	}
	});
	Newtec.Module("EntityPage")
})();