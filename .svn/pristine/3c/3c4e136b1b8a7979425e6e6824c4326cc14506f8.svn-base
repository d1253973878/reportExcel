;(function(){
	Newtec.SearchPage||Newtec.Utils.addJS("newtec.searchpage.js","myqdp/js/page/widget/");
	Newtec.Form||Newtec.Utils.addJS("widget/newtec.form.js");
	$(function(){
		var ds=Newtec.DS.get('myTabletest');
		ds.fields[3].hidden=true;
		var page=Newtec.SearchPage.create({ds:ds,removeId:"deleteTables"
			,addClickFun:function(){openWin()}
		,dbclick:function(data){
			openWin(data);
		}});
		function openWin(tableValue){
			var body=$("<div><button id='addField' class='btn btn-success' style='z-index:1;position: absolute;top: 22px;height: 32px;right: 16px;'>添加字段</button></div>");
			var chaData={};
			var form=Newtec.Form.create({
				fields:[{title:'表名称',name:'name',valiType:"en",required:"不能为空",domStyle:{titleStyle:{width:60},width:"45%"}}
				,{title:"描述",name:'remark',domStyle:{titleStyle:{width:60},width:"45%"}}]
				,values:tableValue
			});
			body.append(form.newtecJQ)
			var tParams={mode:2,multSelect:false,
				fields:[{name:'name',title:'字段名称'},{name:'type',title:'字段类型'},
				        {name:'leng',title:'字段长度'},{name:'ispk',title:'是否为主键'}],
				trBtnFun:function(row,data){
					return Newtec.Nav.create({
						data:["修改","删除"],click:function(text){
							if(text=="删除"){
								delete chaData[data.name]
								table.removeRecords(data);
							}else{
								openFieldWin(chaData,table,data)
							}
						}
					}).newtecJQ;
				}
			}
			if(tableValue){
				tParams.ds=ds;
				tParams.fetchParam={operId:"getFields",data:{
					tableId:tableValue.id
				}}
				tParams.autoFetch=true;
				tParams.tdValueHtmlFun=function(value,data){
					chaData[data.name]=data;
					return value;
				};
			}
			var table =Newtec.Table.create(tParams);
			body.on("click","#addField",function(){
				openFieldWin(chaData,table)
			});
			body.append(table.newtecJQ)
			var win=Newtec.Window.create({
				title:tableValue&&"更新表"||'创建表',
				body:body,height:600,width:1100,
				footer:Newtec.Button.create({
					title:'确定',
					click:function(){
						if(form.validate()){
							var datas=[];
							for(var key in chaData){datas.push(chaData[key])}
							var fData=form.getValues();
							if(tableValue){
								tableValue.name=fData.name; 
								tableValue.remark=fData.remark; 
								fData=tableValue;
								delete tableValue.newtecTRId
							}
							console.info("----<<<<",fData);
							ds.addData({
								operId:tableValue&&"updateTable"||"createTable",
								data:fData,
								datas:datas,
								success:function(){
									Newtec.Window.hint("保存成功");
									win.close();
									page.fetchData();
								}
							});
						}
						
					}
				})
			});

		}
		function openFieldWin(chaData,table,oldValues){
			var fieldForm=Newtec.Form.create({
				fields:[{title:'字段名称',name:'name',valiType:"en",required:"不能为空"},
				        {title:'字段类型',name:'type',type:'select',data:{'varchar':"字符串",'integer':"数字"},showClearIcn:false,search:false},
				        {title:'字符长度',name:'leng',valiType:"number",required:"不能为空"},
				        {title:'知否为主键',name:"ispk",type:'radio',data:{'false':'否','true':'是'}}],
				values:oldValues
			});
			var fieldWin=Newtec.Window.create({
				title:'表字段添加',
				body:fieldForm,
				footer:Newtec.Button.create({
					title:'确定',
					click:function(){
						if(fieldForm.validate()){
							var values=fieldForm.getValues();
							var name=values.name;
							if(oldValues){
								values.id=oldValues.id;
								if(values.name!=name&&chaData[name]){
									Newtec.Window.hint("该字段名称已经存在！！");
									return;
								}
								chaData[name]=values;
								fieldWin.close();
								table.updateRecords([values])
							}else{
								if(chaData[name]){
									Newtec.Window.hint("该字段名称已经存在！！");
									return;
								}
								values.id=Newtec.Utils.uuid();
								chaData[name]=values;
								fieldWin.close();
								table.setData([values],true)
							}
						}
					}
				})
			});
		}
	})
	Newtec.Module("CreateTable")
})();
//