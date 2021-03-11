Newtec.Component(['Many2ManyPage'],function(){
	if(Newtec.Utils.isNull(Newtec.Many2ManyPage)){
		alert("请先 引入newtec.many2manypage.js");
		return;
	}
	
	Newtec.ResMany2ManyPage = function (params) {
		var ds = params.ds;
		params.ds = Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		this.defaults = {
				showFoot:true,
				comParam:{
					maxHeight:400
				},
				leftParam:{//左边表格的参数设置
		        	autoFetch:false,
				},
				rightParam:{
					showPagin:true,
					showFooter:true,
					multSelect:false,
				},
				comParam:{
					maxHeight:320
				},
		        selectParam:{
		        	 name: 'applicationId',
		                title: '',
		                value: parent.Newtec.powerCurrentSelectAppId,
		                type: 'select',
		                showClearIcn:false,
		                mouseShow:false,
		                search:false,
		                style:'border-color:transparent;',
		                ds: {
		                    name: 'application',
		                    startRow: -1,
		                    select: ['id', 'name'],
		                    sortBy: {id: 'desc', name: 'asc'},
		                    callback: function (response) {
		                    }
		                }
		        },
				topChangeParam:{//head中控件选择数据变化触发的数据请求后台参数
					data:{relationLeftIdValue:""}
				},
				creatTopGridJQ:function(page,params,topDiv){
					return null;
				},
				getDateBefore:function(params){//获取关联数据之前调用
					
				}
		};
		
	};
	Newtec.ResMany2ManyPage.exte(Newtec.Base,'ResMany2ManyPage');
	Newtec.ResMany2ManyPage.over({
		finAppendToJQ:function(params){
			/*var name = window.frameElement.name;
			var ff = $(parent.window.frames[name].document).find(params["appendTo"]);*/
			var frame = window.frameElement;
			if(frame==null || frame==undefined) return params["appendTo"];
			var frame = Newtec.AppUtils.getFrameWin(frame.name);
			return $(frame.document).find(params["appendTo"]);
		},
		createNewtecJQ:function(params){
//			var ds=Newtec.DS.get("person");
			var comDs=params.ds;
			var footGird='';
			var getDateParam=params.getDateParam;
			var reftId='';
			var leftParam=params.leftParam;
			var resouceAch={};
			var pageThis=this;
			var pageId='';
			var rightGridJQ='';
			var leftGridJQ='';//
			var manaPage='';//多对多页面对象
			var crrTdd="";//当前选项卡选中的控件对象
		    var crrName='';
		    var crrfetchParm='';
		    var isFetch="";
		    var applicationId="";
			if (!Newtec.Utils.isFunction(leftParam.selctFun)) {
				leftParam.selctFun=function(page,leftGridJQ,rightGridJQ,lParams,leftSelectedRd){
					reftId=leftSelectedRd.id;
					getRelativeData();
				};
			}
			if (!Newtec.Utils.isFunction(params.createHeadAfaterFun)) {
			   params.createHeadAfaterFun=function(page,head,leftGridJQ,rightGridJQ,sParams){
					var appSelect = Newtec.MySelect.createAdmin();
					var other = $("<div class='pull-left' style='margin-left:10px;'></div>");
					
					other.append(appSelect.newtecJQ);
					appSelect.onChange = function(element, checked, value,name) {
						page.topSelect=name;
						pageThis.applicationId=name;
						page.oldSelectData=[];
						var data1={relationLeftIdValue:name};
//						var data2={applicationId:name};
						var datas={fieldName:'applicationId',operator:'equals',value:name};
						leftGridJQ.fetchParam.data=data1;
						rightGridJQ.fetchParam.datas=datas;
						leftGridJQ.fetchData();
						rightGridJQ.fetchData();
					};
					head.append(other);
				};
			}
			var createFootGridJQ =params['createFootGridJQ'];
			if(!Newtec.Utils.isFunction(createFootGridJQ)||Newtec.Utils.isNull(createFootGridJQ())){
				params.createFootGridJQ=function(page,params){
					var param1={maxHeight:170,ds:Newtec.DS.get("button"),showFetchForm:false,showFilter:true,autoFetch:false
      		 	    		   ,showHeader:false,showPagin:false,showFooter:false,tableStyle:'border-left:0;bordre-top:0;'};
      	 	    	var param2=$.extend(true,{},param1);param2.ds=Newtec.DS.get("listField");
      	 	    	var param3=$.extend(true,{},param1);param3.ds=Newtec.DS.get("formField");
      	 	    	var param4=$.extend(true,{},param1);param4.ds=Newtec.DS.get("searchField");
      	 	    	var param5=$.extend(true,{},param1);param5.ds=Newtec.DS.get("rowFilterScheme");
      	 	    	param1.setDataAfter=function(){
      	 	    		if(crrName=='button')
      	 	    			getRelativeData();
      	 	    	};
      	 	    	param2.setDataAfter=function(){
      	 	    		if(crrName=='listField')
      	 	    			getRelativeData();
      	 	    	};
      	 	    	param3.setDataAfter=function(){
      	 	    		if(crrName=='formField')
      	 	    			getRelativeData();
      	 	    	};
      	 	    	param4.setDataAfter=function(){
      	 	    		if(crrName=='searchField')
      	 	    			getRelativeData();
      	 	    	};
      	 	    	param5.setDataAfter=function(){
      	 	    		if(crrName=='rowFilterScheme')
      	 	    			getRelativeData();
      	 	    	};
      	 	    	var tdd1=Newtec.Table.create(param1);
      	 	    	var tdd2=Newtec.Table.create(param2);
      	 	    	var tdd3=Newtec.Table.create(param3);
      	 	    	var tdd4=Newtec.Table.create(param4);
      	 	    	var tdd5=Newtec.Table.create(param5);
      	 	    	var count=0;
      	 	        var tabs=[{title:'按钮',name:'button',JQ:tdd1},{title:'列表字段',name:'listField',JQ:tdd2},{title:'表单字段',name:'formField',JQ:tdd3}
      					,{title:'搜索字段',name:'searchField',JQ:tdd4},{title:'行集过滤方案',name:'rowFilterScheme',JQ:tdd5}];
      	 	    	var btnParams=[{
      	 	    		 title: "分配资源",
      	 	    		 click:function(tab,tabJQ,name){
      	 	    			 return;
      	 	    			 var values= tabJQ.getSelectedRecords();
      	 	    			if (Newtec.Utils.isNull(values)||values.length==0) {
      	 	    				alert("请选择对应的记录！！");
								return;
							}
      	 	    			 for ( var i = 0; i < values.length; i++) {
      	 	    				values[i]['newtecTRId']=undefined;
      	 	    				values[i].applicationId=Newtec.Person.getPowerAppId();
      	 	    				values[i].pageId=data.id;
      						}
      	 	    			 tabJQ.addData(values,'',function(response){
      	 	    				 if (response['status']==0) {
      	 	    					 alert("增加成功");
//      	 	    					 tabJQ.de(values);
      	 	    				 } else{
      	 	    					 alert(response.error);
      	 	    				 } 
      	 	    			 },false);
      	 	    		 }
      	 	    	}
      	 	    	];
      	 	    	/**
      	 	    	  * 底部标签页切换逻辑
      	 	    	  */
      	 	    	footGird=Newtec.MyTab.create({maxHeight:250,tabs:tabs,btnParams:btnParams,showBtn:false,
      	 	    		tabChangFun:function(myTabThis,currTab,name,currId){
      	 	    			crrTdd=currTab;crrName=name;
      	 	    			if(count!=0){
      	 	    				var page=rightGridJQ.getSelectedRecords()||{};
      	 	    				pageId=page.id;
      	 	    				if(Newtec.Utils.isNull(pageId))return;
      	 	    				var fetchParam=crrTdd.fetchParam||{};
								fetchParam.datas={fieldName:'pageId',operator:'equals',value:pageId};
								crrTdd.fetchData();
//      	 	    					crrTdd.fetchData(crrfetchParm);
//    	 	    					isFetch[crrName]=true;
//    	 	    				}else{
//    	 	    					getRelativeData();
//    	 	    				}
      	 	    			}else{
      	 	    				count=1;
      	 	    			}
      		 	        }});
      	 	    	//-----------
      	 	    	var rightGridJQ=page.rightGridJQ;
					rightGridJQ.setClickRecord(function(){
						var data=rightGridJQ.getSelectedRecords();
						pageId=data.id;
						isFetch={};
						console.info("===>>>>>>",data,pageId);
//						var tapJQ=footGird.getSelectTap();
						crrfetchParm={datas:{fieldName:'pageId',operator:'equals',value:pageId}};
						var fetchParam=crrTdd.fetchParam||{};
						fetchParam.datas={fieldName:'pageId',operator:'equals',value:pageId};
						crrTdd.fetchData();
						isFetch[crrName]=true;
					});
      	 	    	return footGird;
				};
			}
			var updateBefore=params.updateBefore;
			if (!Newtec.Utils.isFunction(updateBefore)) {
				params.updateBefore=function(updateParams){
					updateParams.data.name=crrName;
				};
			}else{
				params.updateBefore=function(updateParams){
					updateBefore(updateParams,crrName);
				};
			}
			manaPage= Newtec.Many2ManyPage.create(params);
			this.rightGridJQ=rightGridJQ=manaPage.rightGridJQ;
			this.leftGridJQ=leftGridJQ=manaPage.leftGridJQ;
			//获取关联表数据并设置选中
			var getRelativeData=function(){
				var rData=rightGridJQ.getSelectedRecords();
				var lData=leftGridJQ.getSelectedRecords();
				if (Newtec.Utils.isNull(rData)||Newtec.Utils.isNull(lData)
						||Newtec.Utils.isNull(rData.id)||Newtec.Utils.isNull(lData.id)) {
					return;
				}
				reftId=lData.id;
				pageId=rData.id;
				var crrJQ=crrTdd;
				var resId=reftId+'_'+pageId;
				var resSelId=resId+'_'+crrName;
				var data =resouceAch[resId];
				crrJQ.selectAll(false);
				if (data==undefined) {
					var fData=getDateParam.data==undefined?{}:getDateParam.data;
					fData.reftId=reftId;
					fData.pageId=pageId;
					getDateParam.data=fData;
					
//					if(!Newtec.Utils.isFuntion(getDateParam.callback)){
						getDateParam.callback=function(response){
							if (response['status']==0) {
								console.info("---resSelId关联表的数据====="+resSelId);
								console.info(response['data']);
								data=response['data'];
								resouceAch[resId]=data;
								var cData=data[crrName];
								selected(crrJQ,cData,resSelId);
							}
						};
//					}
					if(Newtec.Utils.isFunction(params.getDateBefore))
							params.getDateBefore(getDateParam);
					comDs.fetchData(getDateParam);
				}else{
					var cData=manaPage.getSelectedData(resSelId);
					if (cData==undefined) {
						cData=data[crrName];
						selected(crrJQ,cData,resSelId);
					}else{
						console.info("-selectByData====");
						console.info(crrJQ.pageDatas);
						console.info(cData);
						crrJQ.selectByData(cData);
					}
				}
			};
			//设置选中
			var selected=function(crrJQ,cData,resSelId){
				var oldSelectData=[];
				if (!Newtec.Utils.isNull(crrJQ)) {
					var datas=crrJQ.pageDatas;
					console.info("-selectByData=ddd===");
					console.info(datas);
					console.info(cData);
					for ( var i = 0; i < datas.length; i++) {
						var data=datas[i];
						for(var j = 0; j < cData.length; j++){
							if(data.id==cData[j]){
								
								crrJQ.selectByData(data);
								oldSelectData.push(data);
							}
						}
					}
					
					manaPage.setSelectedData(oldSelectData,resSelId);
				}
			};
			
			//重写多对多页面部分方法
			manaPage.getCacheDataId=function(){
				return reftId+'_'+pageId+'_'+crrName;
			};
			manaPage.getRSelectedRecords=function(){
				return crrTdd.getSelectedRecords();
			};
			manaPage.getRTotalDatas=function(){
				return crrTdd.pageDatas;
			};
			return  manaPage.newtecJQ;
		},
	});
	Newtec.Module("ResMany2ManyPage")
});