;(function(){
	Newtec.Table||Newtec.Utils.addJS("newtec.table.js","myqdp/js/widget/")
	Newtec.Form||Newtec.Utils.addJS("widget/newtec.form.js");
	Newtec.Many2ManyPage = function (params) {
		if(params.ds){
			params.ds =Newtec.Utils.isString(params.ds)?Newtec.DS.get(params.ds) :params.ds;
			this.dsName=params.ds.dsName;
		}
		
		this.defaults = {
				 ds: '',
				 showHead:true,
				update:true,
				allDate:false,
				updateId:'',
				updateTitle:'设&nbsp;置',
				updateBefore:'',
				updateAfter:'',
				headStyle:'',
				warnMess:'请先选择对应的应用',
				leftDivWidth:'',
				rightDivWidth:'',
				showFoot:false,
				border:'9px solid #efeeee;',
				initBtns:function(btns){},//可以增加或移除按钮
				 trBtnWidth: 180,
			        showHeader: true,
			        autoFetch: true,
			        fetchParam: {endRow: 2}
			       , tdValueHtmlFun: function (tdValue, data, row, col,colName) {return tdValue;}
			        , trBtnFun: function (row, record, tr, table) {}
			        ,comParam:{//左右表格通用的参数设置
			        	showHeader:false
			        	,showPagin:false
			        	,showFetchForm:false
			        	,showFooter:false
			        	,height: "100%"
//			        	,showMoreBtn:false
//			        	,maxHeight:500
			        }
			        ,topHeight:42
			        ,bottomHeight:293
			        ,leftParam:{//左边表格的参数设置
			        	 multSelect:false
			        	,autoFetch:true
//			        	,showFilter:true
			        	,selctFun:''
			        }
			        ,rightParam:{//右边表格的参数设置
			        	setDataAfter:'',
			        	setDataBefore:'',
			        	everAutoFetch:true,
			        	createFieldBefore:"",
			        	showFilter:true,			        }
			        ,relationData:{
						relationLeftIdValue:"",
			        }
			        ,updateParam:{
			        	    operType:'update',
							callback:''
						    ,data:{
						    	relationLeftIdValue:'',
					        	relationRightIdValues:'',
								deleteIds:''
						    }
					},updateBefore:function(updateParam){}
			        ,getDateParam:{
						data:{relationLeftIdValue:""},
					},creatTableAfter:function(page,leftTable,rightTable,params){}
					,createHeadBeforFun:function(page,head){}
					,createHeadAfaterFun:function(page,head){}
					,createMinddlePFun:function(page,mindPage){}
					,createLetfGridJQ:function(pageThis,params,leftDiv){//重写该方法需要返还控件的JQ对象，内部会调用该对象的newtecJQ加入对应布局
						return null;
						}
					,createrightGridJQ:function(pageThis,params,rightDiv){//重写该方法需要返还控件的JQ对象，内部会调用该对象的newtecJQ加入对应布局
						return null;
						}
					,createFootGridJQ:function(pageThis,params){//重写该方法需要返还控件的JQ对象，内部会调用该对象的newtecJQ加入对应布局 
						return null;
					}
		};//定义缺省参数.
	};
	Newtec.Many2ManyPage.exte(Newtec.Base,'many2ManyPage');
	Newtec.Many2ManyPage.over({
		getSetbtnId:function(){
			return this.dsName+"_allocation_button_id";
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
		var btnMap = {};
		var ds = params.ds;
		params.ds = Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
	    if(has==false)//需要授权
	    	btnMap = Newtec.Person.getButton();
			var appendTo=params['appendTo'];
			var topHeight=params['topHeight'];
			var showFoot=params['showFoot'];
			var bottomHeight=!showFoot?0:params['bottomHeight'];
//			$(appendTo).css('height','100%');
			this.cacheData={};//将已经关联的数据存在cacheData中
			this.leftSelectId='';//当前左表选择的id
			/**
			 * 重写该页面时，特别添加控件，需要维护oldSelectData，负责需要自己重写选中与修改设定表关系的功能
			 * oldSelectData：关联表右表原本选择的数据
			 */
			this.oldSelectData=[];//当前选择的数据
			var pageThis=this;
            this.buttons={};
            var comDs=params.ds;
//		     this.table
			 var border=params.border;
			 var page=$('<div ></div>');
			 this.headBtnDiv=$('<div style="position:absolute;top:0;bottom:0;right:5px;margin:auto;height:26px;"></div>');
			 var headH=$('<div style="height:100%;width:100%;background:#d9dfea;margin-bottom:2px;'+params.headStyle+'padding:2px 2px 3px;overflow:hidden;"></div>').append(this.headBtnDiv);
			 var head=$('<div style="width:100%;height:'+topHeight+'px;position:relative;"></div>').append(headH);
			 page.append(head);
			 this.head=head;
			 var createHeadBeforFun=params.createHeadBeforFun;
			 if(Newtec.Utils.isFunction(createHeadBeforFun)){
				 createHeadBeforFun(this.page,headH);
			 }
			 if ( Newtec.Utils.isTrue(params.showHead)) {
				 
			}
			this.mHeadBtnDiv=$('<div class="pull-right"></div>');
			this.middleHead=$('<div style="width:100%;background:#e8ebf3;margin-bottom:2px;'+params.headStyle+'overflow:hidden;"></div>').append(this.mHeadBtnDiv);
			this.middle=$('<div style="width:100%;overflow:hidden;position:absolute;top:'+(topHeight-2)+'px;bottom:'+(bottomHeight)+'px;"></div>').append(this.middleHead);
			var leftDiv=$('<div class="pull-left" style="min-height:100px;width:50%;padding-right:3px;height:100%;overflow:auto;border-right:'+border+';"></div>');
			var rightDiv=$('<div class="pull-right" style="min-height:100px;width:50%;height:100% !important;overflow:auto;padding-left:3px;"></div>');
			this.middle.append(leftDiv).append(rightDiv);
			page.append(this.middle);
		
			var createMinddlePFun=params.createMinddlePFun;
			 if ( Newtec.Utils.isTrue(createMinddlePFun)) {
				 createMinddlePFun(page,this.middle);
				}
			this.page=page;
			//左边的table表格
			var leftParams=params.leftParam;
			var comParam=$.extend(true,{},params.comParam);
			leftParams=$.extend(true,comParam,leftParams);
			var leftDs=leftParams.ds;
			if(Newtec.Utils.isNull(leftDs)){
				leftParams.ds=comDs;
			}else if(Newtec.Utils.isString(leftDs)){
				leftParams.ds=Newtec.DS.get(leftDs);
			}
			var leftGridJQ = null;
			var createLetfGridJQ=params.createLetfGridJQ;
			if(appAuthorLevel==2){//字段权限需要控制
				var ds=leftParams.ds;
				leftParams['fields'] = Newtec.Person.getPowerField(ds['fields'],'listFields',ds.dsName+"_list_id","listColumnSign","listColumn");
				console.info(leftParams['fields']);
				if(leftParams['fields'].length<=0){
	     			Newtec.Window.createHint({html: '列表字段没有分配权限字段！', className: 'btn btn-danger'});
	                return;
	     		}
			}
			if (Newtec.Utils.isFunction(createLetfGridJQ)) {
				leftGridJQ=createLetfGridJQ(this,params,leftDiv);
			}
			leftGridJQ=Newtec.Utils.isNull(leftGridJQ)?Newtec.Table.create(leftParams):leftGridJQ;
			this.leftGridJQ=leftGridJQ;
//			leftGridJQ.fetchData(leftParams.fetchParam);
//			leftDiv.append(leftGridJQ.newtecJQ);
			Newtec.Utils.appendTo(leftGridJQ,leftDiv);
			this.leftDiv=leftDiv;
			
			//右边的table表格
			var rightParams=params.rightParam;
			comParam=$.extend(true,{},params.comParam);
			rightParams=$.extend(true,comParam,rightParams);
			var rightDs=rightParams.ds;
			if(Newtec.Utils.isNull(rightDs)){
				rightParams.ds=comDs;
			}else if(Newtec.Utils.isString(rightDs)){
				rightParams.ds=Newtec.DS.get(rightDs);
			}
			var leftClick=false;
			if (!Newtec.Utils.isFunction(rightParams.setDataAfter)) {
				rightParams.setDataAfter=function(table,datas,isAppendData,index,noSetTotalPage){
					if(pageThis.oldSelectData!=undefined&&pageThis.oldSelectData.length!=0){//设置选中
//						table.selectAll(false);
//						table.selectByData(pageThis.oldSelectData);
						pageThis.select(table,pageThis.oldSelectData);
					}
					if (leftClick){
						leftClick=false;
						if(params.allDate){
							table.fetchData();	
						}
					}
				};
			}
			if (!Newtec.Utils.isFunction(rightParams.setDataBefore)) {
				rightParams.setDataBefore=function(table,datas,isAppendData,index,noSetTotalPage){
					var leftSelectId=pageThis.leftSelectId;
					if (leftClick){
//						if (Newtec.Utils.isNull(cacheData[leftSelectId])) {
//							cacheData[leftSelectId]=datas;
//						}
//						oldSelectData=datas;
					}else{
						var cDatas=pageThis.getSelectedData(leftSelectId);
						if (!Newtec.Utils.isNull(cDatas)) {
//							var indexs=[];//存放需要删除的数据索引
							var selectData=[];
							for ( var i = 0,len=cDatas.length; i <len; i++) {
								var d=cDatas[i];
								for ( var j = 0,len1=datas.length; j <len1; j++) {
									if (d.id==datas[j].id) {
//										indexs.push(j);
										selectData.push(d);
										datas.splice(j,1);
										len1--;
										continue;
									}
								}
							}
							var oldSelectData=[];
							for ( var i = 0; i < cDatas.length; i++) {//保留原有选中的顺序
								for ( var j = 0; j < selectData.length; j++) {
									var d=selectData[j];
									if (cDatas[i].id==d.id) {
										oldSelectData.push(d);
									}
								}
							}
							for ( var i = oldSelectData.length-1; i >=0 ; i--) {//将选中的数据加到最前
								datas.unshift(oldSelectData[i]);
							}
//							console.info(pageThis.oldSelectData);
//							pageThis.oldSelectData=oldSelectData;
						}
					}
//				
				};
			}
			
			var rightGridJQ = null;
			var createrightGridJQ=params.createrightGridJQ;
			if(appAuthorLevel==2){//字段权限需要控制
				var ds=rightParams.ds;
				rightParams['fields'] = Newtec.Person.getPowerField(ds['fields'],'listFields',ds.dsName+"_list_id","listColumnSign","listColumn");
				console.info("==========>>>.",rightParams['fields'],ds);
				if(rightParams['fields'].length<=0){
					Newtec.Window.createHint({html: '列表字段没有分配权限字段！', className: 'btn btn-danger'});
					return;
				}
			}
			if (Newtec.Utils.isFunction(createrightGridJQ)) {
				rightGridJQ=createrightGridJQ(this,params,rightDiv);
			}
			
			rightGridJQ=Newtec.Utils.isNull(rightGridJQ)?Newtec.Table.create(rightParams):rightGridJQ;
			this.rightGridJQ=rightGridJQ;
			Newtec.Utils.appendTo(rightGridJQ,rightDiv);
//			rightDiv.append(rightGridJQ.newtecJQ);
			this.rightDiv=rightDiv;
			var getDateParam=params.getDateParam;
			if(!Newtec.Utils.isFunction(leftGridJQ.getSelectedRecords)){
				alert("请提供leftGridJQ控件获取选中数据方法getSelectedRecords()");
			}
			if(!Newtec.Utils.isFunction(rightGridJQ.getSelectedRecords)){
				alert("请提供rightGridJQ控件获取选中数据方法getSelectedRecords()");
			}
			//左边控件点击事件
			if (Newtec.Utils.isFunction(leftGridJQ.setClickRecord)) {
				var preId=
				leftGridJQ.setClickRecord(function(){
					var cacheData=pageThis.cacheData;
					var selectedRecord=leftGridJQ.getSelectedRecords();
					console.info("selectedRecord=============================>",leftGridJQ, selectedRecord);
					var id=selectedRecord.id;
					if(preId==id)return;
					preId=id;
					pageThis.leftSelectId=id;
					if (!Newtec.Utils.isFunction(leftParams.selctFun)) {
						leftClick=true;
						getDateParam.data.relationLeftIdValue=id;
						var data=pageThis.getSelectedData(id);
						if(!rightParams.everAutoFetch){
							pageThis.rightFetchData(function(){
								toGo();
							},id)
						}else{
							toGo();
						}
						function toGo(){
//							if (Newtec.Utils.isNull(data)) {
								getDateParam.callback=function(response){
									if(response.status==0){
										data=response['data'];
										data=data.datas&&data.datas||data;
										if(!Newtec.Utils.isNull(data)){
											pageThis.setSelectedData(data,id);
										}else{
											rightParams.everAutoFetch&&rightGridJQ.empty();
										}
										
										rightParams.everAutoFetch
										&&rightGridJQ.setData(data);
										rightGridJQ.selectAll(false);
										rightGridJQ.selectByData(data);
									}else{
										alert("数据获取失败失败！！");
									}
								};
								comDs.fetchData(getDateParam);
//							}else{
//	//							pageThis.oldSelectData=data;
//								rightParams.everAutoFetch&&rightGridJQ.setData(data,false);
//								rightGridJQ.selectByData(data);
//							}
						}
						
					}else{
						leftParams.selctFun(pageThis,leftGridJQ,rightGridJQ,params,selectedRecord);
					}
				});
			}else{
				alert("请提供leftGridJQ控件点击方法setClickRecord(clickFun)");
			}
			var btns=this.setButs(btnMap,params,comDs,has,rightParams)||[]
			 var initBtns = params['initBtns'];
			    if(Newtec.Utils.isFunction(initBtns)){
			    	initBtns(btns);
			    }
			addPageBtns(btns,this);
			if (showFoot) {
				var footDiv=$('<div class="foot" style="border-top:'+border+';padding-top:3px;position:absolute;height:'+bottomHeight+'px;bottom:0;width:100%;"></div>');
				var createFootGridJQ=params['createFootGridJQ'];
				if (Newtec.Utils.isFunction(createFootGridJQ)) {
					var footGrid=createFootGridJQ(pageThis,params);
					if(!Newtec.Utils.isNull(footGrid))
						Newtec.Utils.appendTo(footGrid,footDiv);
				}
				page.append(footDiv);
			}
			 var oldFinsh=params['finsh'];
			 params['finsh']=function(This,params){
				 var createHeadAfaterFun=params['createHeadAfaterFun'];
				 if (Newtec.Utils.isFunction(createHeadAfaterFun))
					  createHeadAfaterFun(pageThis,headH,leftGridJQ,rightGridJQ,params);
				 if(Newtec.Utils.isFunction(oldFinsh)){
					 oldFinsh(This,params);
				 }
			 };
			return this.page;
		},
		setButs:function(btnMap,params,comDs,has){
			var btns = [],
			updateParam =params.updateParam;
			updateRelationData=updateParam.data
			pageThis=this,
			rightGridJQ=this.rightGridJQ;
			var btnUpdate=btnMap[this.getSetbtnId()];
			if(params[Newtec.DS.OperType.update]&&(has || btnUpdate != undefined)){
				var updateTitle = btnUpdate==undefined || btnUpdate.name=='' ? params['updateTitle'] : btnUpdate.name;
				//设置按钮comDs
				btns.push({
					title: updateTitle,
//	             appdenToJQ:pageThis.mHeadBtnDiv,
					click: function () {
						if (Newtec.Utils.isNull(pageThis.leftSelectId)) {
							Newtec.Window.hint(params['warnMess']);
							return;
						}
						var leftSelectId=pageThis.leftSelectId;
						var oldRightSelects=pageThis.oldSelectData||[];
						console.info("oldRightSelects,========================>>",oldRightSelects);
						var rTotalData=pageThis.getRTotalDatas(rightGridJQ);//右边选中的数据
						console.info(rTotalData);
						console.info(oldRightSelects);
						var temp=[];
						//挑选在右表中存在的旧的选中的数据
						for( var i = 0; i < oldRightSelects.length; i++) {
							var d=oldRightSelects[i];
							for ( var j = 0; j < rTotalData.length; j++) {
							    if(d.id==rTotalData[j].id){
							    	temp.push(d);
							    }	
							}
						}
						oldRightSelects=temp;
						console.info(oldRightSelects);
						//获取需要设置或者删除的关系对数据
						var newRightSelects=pageThis.getRSelectedRecords(rightGridJQ)||[];
						var olds=[];
						var news=[];
						var addRela="";
						for ( var i = 0; i < oldRightSelects.length; i++) {
							olds.push(oldRightSelects[i]);
						}
//	            	 var indexs=[];
						for ( var i = 0; i < newRightSelects.length; i++) {
							var newId=newRightSelects[i];
							var addArr=true;
							for ( var j = 0,len=olds.length; j < len; j++) {
								if (newId.id==olds[j].id) {
//								olds[j]='';
//								indexs.push(j);
									olds.splice(j,1);
									len--;
									addArr=false;
									continue;
								}
							}
							if (addArr) {
								news.push(newId);
							}
						}
						console.info("olds,news========================>>",olds,news);
						if (olds.length==0&&news.length==0) {
							alert("数据并没有变化！！");
							return;
						}
						//组合数据类型
						for ( var i = 0; i < news.length; i++) {
							if (Newtec.Utils.isNull(news[i].id)) continue;
							addRela+=Newtec.Utils.isNull(addRela)?news[i].id:","+news[i].id;
						}
						var deleteIds='';
						for ( var i = 0; i < olds.length; i++) {
							if (Newtec.Utils.isNull(olds[i].id)) continue;
							deleteIds+=Newtec.Utils.isNull(deleteIds)?olds[i].id:","+olds[i].id;
						}
						updateRelationData.relationLeftIdValue=leftSelectId;
						updateRelationData.relationRightIdValues=addRela;
						updateRelationData.deleteIds=deleteIds;
						var updateBefore=params['updateBefore'];
						if (Newtec.Utils.isFunction(updateBefore)) {
							updateBefore(updateParam);
						}
						var operId=btnUpdate==undefined?'':btnUpdate['operationId'];
						console.info(updateParam);
						updateParam.operId= Newtec.Utils.isNull(operId) ? (updateParam['operId']==undefined?'':updateParam['operId']) :operId;
//						console.info(updateParam);
//						return;
						updateParam.callback=function(response){
							if(response.status==0){
								alert("设置成功！！");
								console.info("pageThis======================>",pageThis);
								console.info("newRightSelects======================>",newRightSelects);
								pageThis.oldSelectData = newRightSelects;
								var cData=pageThis.cacheData[pageThis.getCacheDataId(leftSelectId)]||[];
//	            			 var indexs=[];
								//剔除掉缓存中已经删除关系的数据
								for(var i=0;i<olds.length;i++){
									for ( var j = 0,len=cData.length; j <len; j++) {
										var d=cData[j];
										if (d.id==olds[i].id) {
//										indexs.push(i);
											cData.splice(j,1);
											len--;
											continue;
										}
									}
								}
//	            			 for ( var i = 0; i < indexs.length; i++) {//删除缓存中取消关联的数据
//	            				 cData.splice((indexs[i]-i),1);
//							 }
								//更新缓存关系数据的新增数据
								pageThis.cacheData[pageThis.getCacheDataId(leftSelectId)]= cData.concat(news);
								console.info(pageThis.cacheData[pageThis.getCacheDataId(leftSelectId)]);
							}else{
								alert("设置失败！！");
							}
						};
						comDs.fetchData(updateParam);
					} 
				});
			}
			return btns
		},
		getSelectedData:function(id){//默认获取当前右表与左表关联的数据
			 id=Newtec.Utils.isNull(id)?this.getCacheDataId(this.leftSelectId):id;
			 var data=this.cacheData[id]
			 this.oldSelectData=data;
			 return  data;
		},
		rightFetchData:function(callback,selectId){
			this.rightGridJQ.fetchData({callback:callback});
		},
		setSelectedData:function(data,id){//该方法默认存放右表与左表关联的数据，所以不传id默认id为左表选中id
			console.info("==setSelectedData===");
			id=Newtec.Utils.isNull(id)?this.getCacheDataId(this.leftSelectId):id;
			 if(Newtec.Utils.isNull(this.cacheData[id])){
				 if (Newtec.Utils.isNull(id)) {
					alert("当前左表没有选中的id");
					return;
				 }
				 this.cacheData[id]=data;
			 }
			 this.oldSelectData=data;
		},
		getLeftSelectId:function(){
			var data=this.leftGridJQ.getSelectedRecords();
			if (Newtec.Utils.isNull(data)) return '';
			return data.id;
		},
		getRSelectedRecords:function(JQ){
			if (JQ==undefined)return;
			return JQ.getSelectedRecords();
		},
		getRTotalDatas:function(JQ){
			if (JQ==undefined)return;
			return JQ.pageDatas;
		},
		getCacheDataId:function(id){
			return id;
		},
		select:function(JQ,data,isAll,type){
			
			isAll=Newtec.Utils.isNull(isAll)?false:isAll;
			JQ.selectAll(isAll);
			JQ.selectByData(data);
		}
	});
	var addPageBtns=function(btnParams,pageThis){
		 if(btnParams instanceof Array){
				var len = btnParams.length;
				for(var i=0;i<len;i++){
					var btnParam = btnParams[i];
					addPageBtns(btnParam,pageThis);
				}
			}else {//单个情况
				appdenToJQ=Newtec.Utils.isNull(btnParams.appdenToJQ)?pageThis.headBtnDiv:btnParams.appdenToJQ;
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
	 };
	Newtec.Module("Many2ManyPage")
})();