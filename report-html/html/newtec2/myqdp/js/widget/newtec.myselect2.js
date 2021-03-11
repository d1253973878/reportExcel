Newtec.Component('widget/newtec.select.js',
function(){
console.info("============MySelect");
	if(Newtec.MySelect != undefined){
			console.warn('newtec.myselect.js已经被引入!');
			return ;
		}
	Newtec.MySelect = function (params) {
		var defaults=this.defaults
		defaults.mode="table";//默认值是没有，则是正常的下拉框，table:下拉框内容是表格,tree:下拉框内容是树
		defaults.tableParams={
			fields:[{name:'name',title:'标题'}],
			showHeader:false,autoFetch:false,showFooter:false,fixed:true,
			showThead:false,showPagin:false,showFetchForm:false,tBodyNoScorll:true,tBodyNoScorllX:true
		}
	};
	Newtec.MySelect.exte(Newtec.Select,'mySelect');
	Newtec.MySelect.over({
		setData : function(datas,defaultValue,append,isOpen,isSearch){
			if (datas==undefined)return;
			var f=this.defaults;
			var select="";
			switch (f.mode) {
				case "table":
					this.setTable(datas,defaultValue,append,isOpen,isSearch);
					break;
				case "tree":
					
					break;
				default:
					this.getSelectBody(datas,defaultValue,append,isOpen,isSearch);
					break;
			}
			
			
//			this.setValue(f.defaultValue,'',isOpen);
		}, 
		setTable:function(datas,defaultValue,append,isOpen,isSearch){
			if(!this.table){
				var defaults=this.defaults
				var tableParams=defaults.tableParams
				tableParams.multSelect=this.multiple;
				var table=this.table=Newtec.Table.create(tableParams);
				var droMeDivJQ=this.selectOpenDiv;
				droMeDivJQ.append(table.newtecJQ)
				var that=this;
				table.setClickRecord(function(data){
					that.selectFun(data);
				});
				table.setDbclickRecord(function(data){
					that.selectFun(data);
				});
			}
			console.info("====<<<<",datas)
			this.table.setData(datas,append)
		},
		selectFun:function(data,open){
			if (!open) 
				this.close();
			var defaults =this.defaults;
			var name=data[defaults.valueName];
			var value=data[defaults.displayName];
			if(!this.multiple)this.values={};
			this.values[name]=value;
			this.setValue('',this.values);
			if(!this.setDefaultValue){
				this.onChange(this,true,value,name,data);
			}else{
				this.setDefaultValue=false;
			}
		}
	});
	
//开发平台及其权限系统专用系统下拉列表
Newtec.MySelect.createAdmin=function(){
	var data=Newtec.SessionStorage.getItem("adminAppcations",true);
	var param={
			name: 'applicationId',
	        title: '',
//	        value: Newtec.Person.getPowerAppId(),
	        type: 'select',
	        search:false,
	        showClearIcn:false,
	        mouseShow:true,
	        style:'border-color:transparent;',
		}
	if(Newtec.Utils.isArray(data)&&data.length>0){
		param.data=data;
		setTimeout(function(){
			myselect.setValue(Newtec.Person.getPowerAppId()||data&&data[0].id)
		}, 300)
	}else{
		param.ds={
	        	 operId:'getApplicatoinbyAdmin',
		            name: 'application',
		            startRow: -1,
		            select: ['id', 'name'],
		            sortBy: {id: 'desc', name: 'asc'},
		            callback: function (response) {
		            	var data=response.data;
		            	data=data.datas||data;
		            	Newtec.SessionStorage.setItem("adminAppcations",data);
		            	myselect.setValue(Newtec.Person.getPowerAppId()||data&&data[0].id)
		            }
		        };
	}
	var myselect=Newtec.MySelect.create(param);
	return myselect;
}
	Newtec.Module("MySelect2")
});