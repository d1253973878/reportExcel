Newtec.Component(["Many2ManyPage","TreeGrid"],function(){
	if(Newtec.CompMany2ManyPage){
		console.info("已经引入Newtec.CompMany2ManyPage")
		return;
	}
	
	Newtec.Many2ManyPage||Newtec.Utils.addJS("page/newtec.many2manypage.js");
	Newtec.TreeGrid||Newtec.Utils.addJS("widget/newtec.treegrid2.0.js");
	if(Newtec.Utils.isNull(Newtec.Many2ManyPage)){
		alert("请先 引入newtec.many2manypage.js");
		return;
	}
	
	Newtec.CompMany2ManyPage = function (params) {
		var ds = params.ds;
		params.ds = Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		this.defaults = {
				leftParam:{//左边表格的参数设置
		        	autoFetch:false
				},
//		        selectParam:{
//		        	 name: 'applicationId',
//		                title: '',
//		                value: parent.Newtec.powerCurrentSelectAppId,
//		                type: 'select',
//		                showClearIcn:false,
//		                mouseShow:false,
//		                style:'border-color:transparent;',
//		                search:false,
//		                ds: {
//		                    name: 'application',
//		                    startRow: -1,
//		                    select: ['id', 'name'],
//		                    sortBy: {id: 'desc', name: 'asc'},
//		                    callback: function (response) {
//		                    }
//		                }
//		        },
				topChangeParam:{//head中控件选择数据变化触发的数据请求后台参数
					data:{relationLeftIdValue:""}
				},
				creatTopGridJQ:function(page,params,topDiv){
					return null;
				}
		};
		
	};
	Newtec.CompMany2ManyPage.exte(Newtec.Base,'compMany2ManyPage');
	Newtec.CompMany2ManyPage.over({
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
			var comDs=params.ds,
			many2ManyPage=0,
			getDateParam=params.getDateParam,
			leftParam=params.leftParam;
			if (!Newtec.Utils.isFunction(leftParam.selctFun)) {
				leftParam.selctFun=function(page,leftGridJQ,rightGridJQ,lParams,leftSelectedRd){
					var applicationId=page.topSelect;
					if(Newtec.Utils.isNull(applicationId)){
						alert(params.warnMess);
						return;
					}
					var data={};
					var selData=page.getSelectedData();
					var id = leftSelectedRd.id;
					if(Newtec.Utils.isNull(selData)){
						data.relationLeftIdValue=id;
						data.applicationId=applicationId;
						getDateParam.data=data;
						getDateParam.callback=function(response){
							if (response.status==0) {
								var datas=response['data']||[];
								var oldSelectData=[];
								var pageDatas=rightGridJQ.pageDatas;
								for(var i=0;i<datas.length;i++){
									var d=datas[i];
									for(var j=0,len=pageDatas.length;j<len;j++){
										var pd=pageDatas[j];
										if(pd.id==d.id){
											oldSelectData.push(pd);
										}
									}
								}
								page.select(rightGridJQ,oldSelectData);
								rightGridJQ.selectAll(false);//清除之前选中的数据
								rightGridJQ.selectByData(oldSelectData);
								page.setSelectedData(oldSelectData,id);
							}else
								alert("获取数据失败");
						};
						comDs.fetchData(getDateParam);
					}else{
						rightGridJQ.selectAll(false);//清除之前选中的数据
						rightGridJQ.selectByData(selData);
					}
				};
			}
			if (!Newtec.Utils.isFunction(params.createHeadAfaterFun)) {
			   params.createHeadAfaterFun=function(page,head,leftGridJQ,rightGridJQ,sParams){
					var appSelect = Newtec.MySelect.createAdmin();
					var other = $("<div class='pull-left' style='margin-left:10px;'></div>");
					
					other.append(appSelect.newtecJQ);
					appSelect.onChange = function(element, checked, value,name) {
//						if(!name){
//							return;
//						}
						page.topSelect=name;
						page.oldSelectData=[];
						if(many2ManyPage!=0){
							many2ManyPage.cacheData={};
						}
						var data1={relationLeftIdValue:name};
						var data2={applicationId:name};
						leftGridJQ.fetchParam.data=data1;
						rightGridJQ.fetchParam.data=data2;
						leftGridJQ.fetchData();
						rightGridJQ.fetchData();
//						var appData=page.getSelectedData(name);
//						if (!Newtec.Utils.isNull(appData)) {
//							var data=appData;
//							var leftData = data['leftData'];
//							var rightData = data['rightData'];
//							leftGridJQ.setData(leftData, false);
//							rightGridJQ.setData(rightData, false);
//						} else {
//							var param = params.topChangeParam;
//							param.data.relationLeftIdValue = name;
//							param.callback = function(response) {
//								if (response.status == 0) {
//									var data = response['data'];
//									var leftData = data['leftData'];
//									var rightData = data['rightData'];
//									leftGridJQ.setData(leftData, false);
//									rightGridJQ.setData(rightData, false);
//									page.cacheData[name]=data;
//									page.setSelectedData(data,name);
//								} else {
//									alert("数据获取失败失败！！");
//								}
//							};
//							comDs.fetchData(param);
//						}
					};
					
					
					head.append(other);
				};
			}
			var many2ManyPage= Newtec.Many2ManyPage.create(params);
			return  many2ManyPage.newtecJQ;
		},
		setTopSelected:function(name){
			
		}
	});
	Newtec.Module("CompMany2ManyPage")
});