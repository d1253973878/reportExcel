/**
 * 系统：应用开发平台
 * 页面：页面定义
 * @author 曾文杰
 */
(function () {
	Newtec.Utils.addJS('page/newtec.compage.js');
	Newtec.Table||Newtec.Utils.addJS("widget/newtec.table.js");
	Newtec.Form||Newtec.Utils.addJS("widget/newtec.form.js");
	//---引入compage页面js
		//Newtec.Utils.addJS('page/newtec.compage.js');
     Newtec.dataSourcePage = function (params) {
        //默认
        this.defaults = {
            ds: 'dataSourceMeta',
            selectParam:{
                name: 'dataSourceMeta',
                title: '',
                type: 'select',
                showClearIcn:false,
                mouseShow:true,
                search:false,
                style:'border-color:transparent;',
                ds: {
                	name: 'dataSourceMeta',
                	operId:'getDsByAppId',
                	data:{relationLeftIdValue: Newtec.Person.getPowerAppId()},
                    startRow: -1,
                    select: ['id', 'name'],
                    sortBy: {id: 'desc', name: 'asc'},
                    callback: function (response) {
                    }
                }
            },
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
    Newtec.dataSourcePage.exte(Newtec.Base, 'dataSourcePage');
    Newtec.dataSourcePage.over({
        createNewtecJQ: function (params) {
        	var pageThis=this;
        	var app=parent.Newtec.app;
        	var seleData=app.getContabData().split(',');
        	var comDs=this.ds;
        	var btns = []; 
        	var seleId=seleData[0];
        	var dsName=seleData[1];
        	console.info("--附加数据-"+seleId);
        	var formData='';
        	var dsForm='';
        	var dsFieldTable='';
        	var dsMethTable='';
        	var dsTab='';
//        	var isSnyTable=false;
        	btns.push({
        		title:'预览表单',
        		click:function(){
        			comDs.fetchData({ds:'dataSourceFieldMeta',operId:'',datas:{fieldName:'dsName',operator:'equals',value:dsName},callback:function(response){
        				if(response['status']==0){
        					var data=response['data'];
        					var newDs={id:Newtec.Utils.uuid(32),dsName:dsName,pk:'id',fields:data};
        					var formParam= {
////        			 				"appendTo" : "#form1",
//        	        					titleColumn:2,
//        	        					columnNum: 4,
        	        					operType:Newtec.DS.OperType.update,
        	        					ds: newDs,
        	        			};
        					var form = Newtec.Form.create(formParam);
        					Newtec.Window.create({
        						title:'资源管理窗口',
        						width: 1024,
        						height:400,
        						body:form,
        						footer: Newtec.Button.create({
        							title: "资源管理",
        							click: function (a) {
        								
        							}
        						})
        					});
        				}
        			}});
        			}},
        	{
        		title:'显示网格',
        		click:function(){alert(1);}},
        	{
        		title:'预览表格',
        		click:function(){
        			comDs.fetchData({ds:'dataSourceFieldMeta',operId:'',datas:{fieldName:'dsName',operator:'equals',value:dsName},callback:function(response){
        				if(response['status']==0){
        					var data=response['data'];
//        					var newDs={id:Newtec.Utils.uuid(32),dsName:dsName,pk:'id',fields:data};
        					var newDs=	Newtec.DS.create(dsName,data);
        					var param= {ds: newDs,autoFetch:true};
        					var table = Newtec.Table.create(param);
        					Newtec.Window.create({
        						title:'资源管理窗口',
        						width: 1024,
        						height:400,
        						body:table,
        						footer: Newtec.Button.create({
        							title: "资源管理",
        							click: function (a) {
        								
        							}
        						})
        					});
        				}
        			}});
        			}},{
                		title:'同步表结构',
                		hint:"将数据实体属性或者源属性同步到数据库表结构！！",
                		className: 'btn-warning',
                    	click:function(){
                    		var data=[];
                    		var mes="实体";
                    	    if(Newtec.Utils.isNull(formData['jpaBean'])||Newtec.Utils.isNull(formData['jpaBean'].trim())){
                    	    	data=$.extend(true,[],dsFieldTable.pageDatas);
                    	    	mes="数据源";
                    	    }
                    	    console.info(formData);
                    	    data.push(formData);
                    		console.info(data);
                    		Newtec.Window.createConfirm({title:"同步表结构",html:"是否确认将"+mes+"结构同步到数据库表?",noTitle:'取消',okTitle:'确定',execute:function(isTrue){
                    			if(!isTrue)return;
                    			comDs.updateData({data:data,callback:function(respense){
                    				if(respense['status']==0){
                    					Newtec.Window.createHint({html:"同步成功！！"});
                    					}else{
                    					Newtec.Window.createHint({html:respense.error});
                    				}
                    			},operId:'snyDsToTable'});
                    		}});
                    		
                   }},{
                	   title:'同步数据源',
                	   className: 'btn-warning',
                	   hint:"将实体或者表结构同步数据源！！",
                	   click:function(){
                		    var data=$.extend(true,{},formData);
                		    var mes="";
                		    console.info(data);
                		    if(Newtec.Utils.isNull(data['jpaBean'])||Newtec.Utils.isNull(data['jpaBean'].trim())){
                		    	if(Newtec.Utils.isNull(data['tableName'])||Newtec.Utils.isNull(data['tableName'].trim())){
                		    		Newtec.Window.createHint({html:"实体类和表名不能同时不为空！！"});
                		    		return;
                		    	}
                		    	mes="数据库表"	;	
                		    }else{
                		    	mes='类实体';
                		    }
                		    	
                		    Newtec.Window.createConfirm({title:"同步数据源",html:"是否确认将"+mes+"结构同步到数据源?",noTitle:'取消',okTitle:'确定',execute:function(isTrue){
                		    	if(!isTrue)return;
                		    	comDs.updateData({data:data,callback:function(respense){
                		    		if(respense['status']==0){
                		    			console.info(respense.data);
                		    			Newtec.Window.createHint({html:"同步成功"});
                		    			var data=respense.data;
                		    			if(Newtec.Utils.isNull(data)||data.length==0)return;
                		    			dsFieldTable.setData(respense.data,true);
                		    		}else{
                		    			Newtec.Window.createHint({html:"同步失败！"});
                		    		}
                		    	},operId:'snyDsField'});
                		    }});
                   }},{
                	   title:'保存数据',
                	   click:function(){
                		   var formValues=$.extend(true,{},dsForm.getAllValues());
                           console.info(formData);
                           console.info(formValues);
                           var fData=$.extend(true,{},formData)
                           for (key in formValues) {
							     if(Newtec.Utils.isNull(formValues[key])&&fData[key]==undefined)
							    	 fData[key]="";
						    }
                		   if(Newtec.Utils.compareJson(fData,formValues)){
                			   formValues={name:formValues['name']};
                		   }else{
                			   formValues['jpaDataLoad']=1;
                		   }
//                		   console.info(data);
//                		   console.info(formValues);
//                		  
//                		   console.info(data);
                		   comDs.updateData({data:formValues,callback:function(respense){
                			   if(respense['status']==0){
                				   Newtec.Window.createHint({html:"更新成功"});
                				   formData=formValues; 
                			   }else{
                				   Newtec.Window.createHint({html:"更新失败"});
                			   }
                		   },operId:'updateDs'});
                 	}}
        	);
        
        	if(seleData.length!=2){
        		alert("选中数据不规范");return;
        	}
        
        	var comparams={btns:btns,pBodyStyle:'border:0;',pfootStyle:'border:0;'};
        	//---------------创建页面head
        	comparams.creatPHeadFun=function(pHead,comParams,compage,headBtnDiv){
//            	//========== 创建应用下拉列表 ==========
							var selectParam= params.selectParam;
            	appSelect = Newtec.MySelect.create(selectParam);
            	//重写onChange事件，加载对应应用页面
            	var count=0;
            	appSelect.onChange = function (element, checked, value, name) {
								selectParam.value=seleId;
            		console.log('切换应用id=' + name);
            		if(count==1){
            			seleId=name;
            			dsName=value;
            			dsFieldTable.fetchData({datas:{fieldName:'dsName',operator:'equals',value:dsName}});
            			dsMethTable.fetchData({datas:{fieldName:'dsName',operator:'equals',value:dsName}});
            			_getFormData(name);
            			setTimeout(function(){
            			},1000);
            		}else{
            			count++;
            		}
            		
            	};
            	var other = $('<div style="position:absolute;top:0;bottom:0;left:5px;margin:auto;height:37px;"></div>');
            	other.append(appSelect.newtecJQ);
            	pHead.append(other);
//            	headBtnDiv.append("<div class='pull-left checkbox' style='margin:0 10px;padding:3px 0;'>" +
//            			"<label class='radio-inline'> <input class='inradio' type='radio' name='inlineRadioOptions' value='jpa' checked> JPA"+
//                        "</label><label class='radio-inline'><input class='inradio' type='radio' name='inlineRadioOptions' value='sql' > SQL</label>"+
//            			"<label style='margin-left:10px;display:none;'  id='snyTable'> <input type='checkbox'>同步表结构</label></div>");
//            	headBtnDiv.on('change','.inradio',function(){
//            		var val=headBtnDiv.find('input[type=radio]:checked').val();
//            		var label=headBtnDiv.find("#snyTable");
//            		if(val=='jpa'){
//            			label.css('display','none');
//            			isSnyTable=false;
//            			label.find('input').prop('checked',isSnyTable);
//            		}else{
//            			label.css('display','inline-block');
//            			isSnyTable=true;
//            		}
//            	});
        	};
        	//-------------创建页面body
        	var _getFormData=function(seleId){
        		var getDataParams={datas:{fieldName:'id',operator:'equals',value:seleId},callback:function(response){
        			if(response.status!=0){
        				alert(response.error);
        				return;
        			};
        			formData=response.data.datas;
        			formData=Newtec.Utils.isArray(formData)?formData[0]:formData;
        			dsForm.clearValues();
        			dsForm.setValues(formData);
        			
        		}};
        		comDs.fetchData(getDataParams);
        	};
        	var extMeta=Newtec.DS.get("dataSourceFieldExtMeta");
         	var openWindow=function(OperType,title,clickFun,values,selectName,value){
	    		 var formParam= {
////					 "appendTo" : "#form1",
					 columnNum: 3,
						 operType:OperType,
						 ds: extMeta,
				 };
	    		 if(!Newtec.Utils.isNull(values)){
	    			formParam.values=values;
	    		 }
			   var form = Newtec.Form.create(formParam);
			   var modeSelect = Newtec.MySelectItem.create({title: '',
	                type: 'select',
	                showClearIcn:false,
	                mouseShow:true,
	                search:false,
	                width:300,
	                value:selectName,
//	                style:'border-color:transparent;',
	                data:{'other':'普通控件','table':'表格控件','add':'添加表单','remove':'删除表单','update':'更新表单'}});
				modeSelect.newtecJQ.css({'margin-bottom':'3px','width':'214px'});
				var mode='';
				modeSelect.onChange = function (element, checked, value, name) {
					mode=name=='other'?'':name+"-";
				};
				var content=$("<div style='overflow:hidden;'></div>");
				value=value==undefined?"":value;
				var valueDiv=$("<div class='pull-left' style='width:50%;'><label>内容：</label><textarea id='value' class='form-control' rows='3'>"+value+"</textarea></div>");
				content.append(valueDiv).append("<div class='pull-right' style='width:50%;'><label>json类型：</label><textarea id='jsonContent' class='form-control' rows='3'></textarea></div>");
				var windBody=$("<div></div>").append(form.newtecJQ).append(content);
				
				var jsonBtnDiv=$('<div style="margin:5px 0;"></div>');
				var jsonDs=	Newtec.DS.create("jsonDs",[{name:'key',title:'key',type:'text'},{name:'value',title:'value'}]);
				var jsonTable=Newtec.Table.create({ds:jsonDs,maxHeight:280,dbclickCanEdit:true,showFetchForm:false,autoFetch:false
					,showFilter:false,showHeader:false,showPagin:false,showFooter:false,tableStyle:'border-left:0;bordre-top:0;'});
				var jsonbtns= [{title:'插入一条数据',appdenToJQ:jsonBtnDiv,className:' btn-default',click:function(){
					jsonTable.setNullData(true,true);
				}},{title:'清除数据',appdenToJQ:jsonBtnDiv,className:' btn-default',click:function(){
					var data=jsonTable.getSelectedRecords();
           	jsonTable.removeRecords(data);
				}},{title:'获取数据',appdenToJQ:jsonBtnDiv,className:' btn-default',click:function(){
					var jsonString='';
           	var datas=jsonTable.pageDatas;
           	for(var i=0;i<datas.length;i++){
           		var d=datas[i];
           		jsonString+=jsonString==""?"{'"+d['key']+"':'"+d['value']+"'":",'"+d['key']+"':'"+d['value']+"'";
           	}
           	if(jsonString!="")jsonString+="}";
           	content.find("#jsonContent").val(jsonString);
				}}];
           pageThis.addPageBtns(jsonbtns)
				
				content.append(jsonBtnDiv);
				content.append(jsonTable.newtecJQ);
//				jsonBtnDiv.append(creJsonBtn.newtecJQ).append(cleJsonBtn.newtecJQ);
				var addWin= Newtec.Window.create({
					 title:'',
					 width: 1024,
					 height:600,
					 body:windBody,
					 header:modeSelect,
					 footer: Newtec.Button.create({
						 title: "确认"+title,
						 click: function (a) {
							 if(Newtec.Utils.isFunction(clickFun))
								 Newtec.Window.createConfirm({title:title+"操作",html:"是否确认"+title+"该拓展属性",noTitle:'取消',okTitle:'确定',execute:function(isTrue){
		                		    	if(!isTrue)return;
		                		    	clickFun(form,addWin,mode,content,a);
		                		    }});
							  
						 }
					 })
				 });
	    	};
        	comparams.creatPBodyFun=function(pBody,comParams,compage){
	 	    	var preId='';
        		var bHead=$('<div style="margin-top:2px;height:90px;"></div>');
        		var updateFormParam= {
//		 				"appendTo" : "#form1",
        					titleColumn:2,
        					columnNum: 4,
        					operType:Newtec.DS.OperType.update,
        					ds: comDs,
        					createFieldBefore:params['createFieldBefore']
        			};
        			dsForm = Newtec.Form.create(updateFormParam);
        			Newtec.Utils.append(bHead,dsForm);
        			_getFormData(seleId);
        		
        		var bBody=$('<div></div>');
        		var param1={height:"100%",maxHeight:170,dbclickCanEdit:true,ds:Newtec.DS.get("dataSourceFieldMeta"),showFetchForm:false,autoFetch:false
		 	    		   ,showHeader:false,showPagin:false,showFooter:false,tableStyle:'border-left:0;bordre-top:0;'};
        		
	 	    	var param2=$.extend(true,{},param1);param2.ds=extMeta;param2.dbclickCanEdit=false;
	 	    	var param3=$.extend(true,{},param1);param3.ds=Newtec.DS.get("formField");
	 	    	param1.fetchParam={datas:{fieldName:'dsName',operator:'equals',value:dsName}};
	 	    	param1.autoFetch=true;
	 	    	dsFieldTable=Newtec.Table.create(param1);
	 	    	var tdd2=Newtec.Table.create(param2);
  	 	    	tdd2.setDbclickRecord(function(data, t){
  	 	    		var key=data['key_'];
  	 	    		console.info("key="+key);
  	 	    		var selectName="other";
  	 	    		if(key.indexOf("-")!=-1){
  	 	    			selectName=key.split("-")[0];
  	 	    			if(!(selectName=="table"||selectName=='add'||selectName=="remove"||selectName=="update"))
  	 	    				selectName="other";
  	 	    			else{
  	 	    				data['key_']=key.substring(key.indexOf("-")+1);
  	 	    			}
  	 	    		}
  	 	    		console.info("key="+key);
  	 	    		openWindow(Newtec.DS.OperType.update,'更新',function(form,win,mode,content){
  	 	    			var values = form.getAllValues();
							 values['key_']=mode+values['key_'];
							 values['dsName']=dsName;
							 values['value']=content.find("#value").val();
							 values['fieldId']=preId;
							 values['newtecTRId']=undefined;
							 console.info(values);
							 tdd2.updateData(values,'',function(response){
								 if (response['status']==0) {
									 Newtec.Window.createHint({html:"更新成功！！"});
									 win.close();
								 } else{
									 Newtec.Window.createHint({html:response.error});
								 } 
							 });
  	 	    		},data,selectName,data['value']);
  	 	    	});
  	 	    	var tdd3=Newtec.Table.create(param3);
  	 	    	var tabs=[{title:'标准控件	',name:'dataSourceFieldMeta',JQ:dsFieldTable},{title:'拓展控件',name:'dataSourceFieldExtMeta',JQ:tdd2},{title:'验证控件',name:'formField',JQ:tdd3}
					];
	 	   
	 	    	var btnParams=[{
  	 	    		 title: "插入一列",
  	 	    		 name:'addNull',
  	 	    		 click:function(tab,tabJQ,name){
  	 	    			var table=tabJQ;
  	 	    			table.setNullData(true);
  	 	    		 }
  	 	    	},{
  	 	    		 title: "增加",
  	 	    		 name:'add',
  	 	    		 click:function(tab,tabJQ,name){
  	 	    			 if(name=="dataSourceFieldExtMeta"){
  	 	    				var data=dsFieldTable.getSelectedRecords();
  	 	    				if(Newtec.Utils.isNull(data)){
  	 	    					alert("请重新选择列");return;
  	 	    				};
  	 	    				openWindow(Newtec.DS.OperType.add,"增加",function(form,addWin,mode,content){
  	 	    					var values = form.getAllValues();
  	   							 values['fieldId']=preId;
  	   							 values['dsName']=dsName;
  	   							 values['key_']=mode+values['key_'];
  	   							 values['value']=content.find("#value").val();
  	   							 jsonString='';
  	   							 tabJQ.addData(values,'',function(response){
  	   								 if (response['status']==0) {
  	   								Newtec.Window.createHint({html:"增加成功"});
//  	 									 tabJQ.de(values);
  	   									 addWin.close();
  	   								 } else{
  	   									 alert(response.error);
  	   								 } 
  	   							 });
  	 	    				});
  	 	    				 
  	 	    			 }else{
  	 	    				Newtec.Window.createConfirm({title:"增加操作",html:"是否确认增加数据源属性？",noTitle:'取消',okTitle:'确定',execute:function(isTrue){
                		    	if(!isTrue)return;
                		    	var values= tabJQ.getSelectedRecords();
                		    	if (Newtec.Utils.isNull(values)||values.length==0) {
                		    		Newtec.Window.createHint({html:"请选择对应的记录！！"});
                		    		return;
                		    	}
                		    	
                		    	for ( var i = 0; i < values.length; i++) {
                		    		var v=values[i];
                		    		if(!Newtec.Utils.isNull(v.id)){
                		    			Newtec.Window.createHint({html:v.id+'该数据已经存在，请重新选择！',className:'btn btn-danger'});
                		    			return;
                		    		}
//  	 	    					 v['newtecTRId']=undefined;
//	 	    				 values[i].applicationId=Newtec.Person.getPowerAppId();
                		    		v.dsName=dsName;
//                		    		delete v.dsName;
                		    	}
                		    	tabJQ.addData(values,"",function(response){
                		    		if (response['status']==0) {
                		    			Newtec.Window.createHint({html:'增加成功！'});
                		    			
//	 	    					 tabJQ.de(values);
                		    		} else{
                		    			Newtec.Window.createHint({html:response.error});
                		    		} 
                		    	},false);
                		    }});
  	 	    			 }
  	 	    		 }
  	 	    	},{
  	 	    		 title: "修改",
  	 	    		 name:'update',
  	 	    		 click:function(tab,tabJQ,name){
  	 	    			Newtec.Window.createConfirm({title:"修改操作",html:"是否确认修改数据源对应属性",noTitle:'取消',okTitle:'确定',execute:function(isTrue){
            		    	if(!isTrue)return;
            		    	var values= tabJQ.getSelectedRecords();
            		    	if (Newtec.Utils.isNull(values)||values.length==0) {
            		    		Newtec.Window.createHint({html:"请选择对应的记录！！"});
            		    		return;
            		    	}
            		    	for ( var i = 0; i < values.length; i++) {
            		    		delete values[i]['newtecTRId'];
            		    	}
            		    	tabJQ.updateData(values,'',function(response){
            		    		if (response['status']==0) {
            		    			Newtec.Window.createHint({html:"修改成功！！"});
            		    		} else{
            		    			Newtec.Window.createHint({html:response.error});
            		    		}   				
            		    	});
            		    }});
  	 	    		 }
  	 	    	},
  	 	    	{
  	 	    		 title: "删除",
  	 	    	     className: 'btn-warning',
  	 	    		 name:'delete',
  	 	    		 click:function(tab,tabJQ,name){
  	 	    			Newtec.Window.createConfirm({title:"删除操作",html:"是否确认该删除操作？",noTitle:'取消',okTitle:'确定',execute:function(isTrue){
            		    	if(!isTrue)return;
            		    	var values=tabJQ.getSelectedRecords();
            		    	if (Newtec.Utils.isNull(values)||values.length==0) {
            		    		Newtec.Window.createHint({html:"请选择对应的记录！！"});
            		    		return;
            		    	}
//  	 	    			for ( var i = 0; i < values.length; i++) {
//  	 	    				delete values[i]['newtecTRId'];
//  						}
            		    	tabJQ.removeData(values,'',function(response){
            		    		if (response['status']==0) {
            		    			Newtec.Window.createHint({html:"删除成功！！",className:'btn btn-danger'});
            		    		}else{
            		    			Newtec.Window.createHint({html:response.error});
            		    		}  				
            		    	});
            		    }});
  	 	    		 }
  	 	    	}
  	 	    	];
	 	    	var count=0;
	 	    	dsTab=Newtec.MyTab.create({height:400,tabs:tabs,btnParams:btnParams,
	 	    		tabChangFun:function(myTabThis,currTab,name,currId){
	 	    			if(count==0){
	 	    				count=1;
	 	    			}else if(name=='dataSourceFieldExtMeta'){
	 	    				var data=dsFieldTable.getSelectedRecords();
	 	    				var id=Newtec.Utils.isArray(data)?data[0].id:data.id;
	 	    				if(Newtec.Utils.isNull(id)){
	 	    					console.error('id为空！！');
	 	    					return;}
	 	    				if(preId!=id){
	 	    					preId=id;
	 	    					currTab.fetchData({datas:[{fieldName:'dsName',operator:'equals',value:dsName},{fieldName:'fieldId',operator:'equals',value:id}]});
	 	    				}
	 	    			}
		 	        },tabChangBeforFun:function(tabThis,pretabJQ,preName,nextName){
		 	        	if(count!=0){
		 	        		if(nextName=="dataSourceFieldExtMeta"){
		 	        			var data=dsFieldTable.getSelectedRecords();
		 	        			if(Newtec.Utils.isNull(data)){
		 	        				Newtec.Window.createHint({html:"请选择对应的列"});
		 	        				return true;
		 	        			}
		 	        			var btns=dsTab.btns;
		 	        			btns['addNull'].setDisable(true);
		 	        		}else{
		 	        			var btns=dsTab.btns;
		 	        			btns['addNull'].setDisable(false);
		 	        		}
		 	        	}
		 	        	return null;
		 	        	}});
	 	   
	 	    	var tabss = [{title:'显示控件',name:'tabone'},{title:'其他操作',name:'tabtwo'}];
	 	    	var outertab = Newtec.MyTab.create({
	 	    		tableft:true,
	 	    		tabs:tabss,
	 	    		tabChangFun:function(myTabThis,currNewtec,name,currId,preId,div){
	 	    			if(!div.html()){
	 	    				if(name=='tabone'){
	 	    					Newtec.Utils.append(div,dsTab);
	 	    				}else{
	 	    					creatPFootFun(div)
	 	    				}
	 	    			}
	 	    		}
	 	    	
	 	    	});
	 	    	Newtec.Utils.append(bBody,outertab);
        		pBody.append(bHead).append(bBody);
        	};
        	
        	//-------------创建页面foot
        	creatPFootFun=function(div){
//        	comparams.creatPFootFun=function(pFoot,comParams,compage){
        		
        		var param1={maxHeight:170,dbclickCanEdit:true,ds:Newtec.DS.get("dataSourceMethodMeta"),showFetchForm:false,autoFetch:false
		 	    		   ,showHeader:false,showPagin:false,showFooter:false,tableStyle:'border-left:0;bordre-top:0;'};
	 	    	var param2=$.extend(true,{},param1);param2.ds=Newtec.DS.get("dataSourceFieldExtMeta");
	 	    	var param3=$.extend(true,{},param1);param3.ds=Newtec.DS.get("formField");
	 	     	param1.fetchParam={datas:{fieldName:'dsName',operator:'equals',value:dsName}};
  	 	    	param1.autoFetch=true;
  	 	    	dsMethTable=Newtec.Table.create(param1);
	 	    	var tdd2=Newtec.Table.create(param2);
	 	    	var tdd3=Newtec.Table.create(param3);
	 	    	var tabs=[{title:'操作映射',name:'dataSourceMethodMeta',JQ:dsMethTable},{title:'绑定脚本',name:'dataSourceFieldExtMeta',JQ:tdd2},{title:'自定义sql',name:'formField',JQ:tdd3}
					];
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
  	 	    				Newtec.Window.createHint({html:"请选择对应的记录！！"});
							return;
						}
  	 	    			 for ( var i = 0; i < values.length; i++) {
//  	 	    				values[i]['newtecTRId']=undefined;
//  	 	    				values[i].applicationId=Newtec.Person.getPowerAppId();
  	 	    				values[i].dsName=dsName;
  						}
  	 	    			 tabJQ.addData(values,'',function(response){
  	 	    				 if (response['status']==0) {
  	 	    					Newtec.Window.createHint({html:"增加成功"});
//  	 	    					 tabJQ.de(values);
  	 	    				 } else{
  	 	    					Newtec.Window.createHint({html:response.error,className:'btn btn-danger'});
  	 	    				 } 
  	 	    			 },false);
  	 	    		 }
  	 	    	},{
  	 	    		 title: "提交修改",
  	 	    		 click:function(tab,tabJQ,name){
  	 	    			 var values= tabJQ.getSelectedRecords();
  	 	    			 if (Newtec.Utils.isNull(values)||values.length==0) {
  	 	    				Newtec.Window.createHint({html:"请选择对应的记录！！"});
							return;
						}
  	 	    			 for ( var i = 0; i < values.length; i++) {
  	 	    				delete values[i]['newtecTRId'];
  						}
  	 	    			tabJQ.updateData(values,'',function(response){
  	 	                         if (response['status']==0) {
  									Newtec.Window.createHint({html:"修改成功！！"});
  								} else{
  									Newtec.Window.createHint({html:response.error});
  								}   				
  	 	    			});
  	 	    		 }
  	 	    	},
  	 	    	{
  	 	    		 title: "提交删除",
  	 	    		 click:function(tab,tabJQ,name){
  	 	    			 var values=tabJQ.getSelectedRecords();
  	 	    			if (Newtec.Utils.isNull(values)||values.length==0) {
  	 	    				Newtec.Window.createHint({html:"请选择对应的记录！！"});
							return;
						}
  	 	    			for ( var i = 0; i < values.length; i++) {
  	 	    				delete values[i]['newtecTRId'];
//  	 	    				delete values[i]['dataSourceFieldMeta'];
  						}
  	 	    			tabJQ.removeData(values,'',function(response){
  	                         if (response['statue']==0) {
  									Newtec.Window.createHint({html:"删除成功！！"});
  								}else{
  									Newtec.Window.createHint({html:response.error});
  								}  				
  	 	    			});
  	 	    		 }
  	 	    	}
  	 	    	];
	 	    	var mytab=Newtec.MyTab.create({height:240,tabs:tabs,btnParams:btnParams,btnMode:"1"});
//	 	    	Newtec.Utils.append(pFoot,mytab);
	 	    	div.append(mytab.newtecJQ);
	 	    	return div;
        	};
            //========== 创建页面 ==========
            var compage = Newtec.compage.create(comparams);
            //========== END OF 创建页面 ==========

            return compage.newtecJQ;
        },
        addPageBtns:function(btnParams){
       	 if(btnParams instanceof Array){
					var len = btnParams.length;
					for(var i=0;i<len;i++){
						var btnParam = btnParams[i];
						this.addPageBtns(btnParam);
					}
				}else {//单个情况
					appdenToJQ=Newtec.Utils.isNull(btnParams.appdenToJQ)?this.headBtnDiv:btnParams.appdenToJQ;
					if(!Newtec.Utils.isNewtec(btnParams) && Newtec.Utils.isJson(btnParams)){//json情况先创建出button
						btnParams = Newtec.Button.create(btnParams);
					}
					var b = Newtec.Utils.appendTo(btnParams,appdenToJQ);
					if(b){
						//设置buttons缓存
						var btnId = btnParams['id'];
						if(btnId != undefined && btnId != ''){
							if(this.buttons==undefined){this.buttons = {};}
							this.buttons[btnId] = btnParams;
						}
					}
				}
       }
    });
    Newtec.Module("dataSourcePage")
})();