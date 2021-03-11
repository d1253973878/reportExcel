/**
 * 与服务器有相关操作的逻辑
 */
(function () {
	/**
	 * @author 王仕通 2016-10-13 说明：表格查询操作
	 * params参数格式要求： {startRow:int,endRow:int,totalRow=-1,sortBy:{},
	 * callback:fun,operId='',clientType:'web',ds:'',operType='',
	 * data:{operator:'and',criteria:[{fieldName:'',operator:'equals',value:''},{fieldName:'',operator:'equals',value:''}]}}
	 */
	Newtec.Table.prototype.fetchData = function(params,noCover){
		if(Newtec.Utils.isNull(this.ds)) return;
		this.showEmptyTitle(false);
		this.showLoadDiv();
		if(Newtec.Utils.isNull(params)){params={ds:this.ds.dsName};};
	    //
		//合并初始化限制的请求条件
		var oldCallback = params['callback'];
		var startRow=params.startRow||params['startRow'];
		var totalRow=params.totalRow||-1;
		var endRow=params.endRow||params['endRow'];
		var fetchParam=noCover&&$.extend(true,{},this.fetchParam)||this.fetchParam;
		params=$.extend(true,fetchParam,params);
		params.startRow=startRow;
		params.totalRow=totalRow;
		params.endRow=endRow;
		var defaults=this.defaults;
		var beforeFunction = this.defaults.fetchBefore;
		if (Newtec.Utils.isFunction(beforeFunction)) {
			beforeFunction(params);
		}
		var defaults=this.defaults;
		var tableThis = this;
		var isAsyPagin=defaults.isAsyPagin;
		params['callback'] = function(response){
			if(Newtec.Utils.isFunction(oldCallback)){
				oldCallback(response);
			}
			params['callback'] = oldCallback;//还原之前的回调，避免使用新的回调
			tableThis.preFechParam = params;//缓存查询上下文供分页上下页使用
			tableThis.hideLoadDiv();
			if(response.status==0){
				var data = response['data'];
				
				var totalRow=0;
				if(data){
					if(data.datas){
					totalRow=data.total;
					data=data.datas;
					}else{
						totalRow=data.length;
					}
				}
				tableThis.setData(data||[],false,-1,true);
				if(defaults.showPagin&&!isAsyPagin){
					if(!tableThis.paginFetchData){
						tableThis.totalRow=totalRow;
						if(totalRow<=0){
							tableThis.pagin.hidden();
						}else{
							tableThis.pagin.createPagin(totalRow,null,defaults.maxRow);
							tableThis.pagin.show();
						}
						
					}else{
						tableThis.paginFetchData=false;
					}
				}
			}else{
				var erreMess=tableThis.defaults.erreMess;
				if(!Newtec.Utils.isNull(erreMess)){
					tableThis.showEmptyTitle(true,erreMess);
				}else{
					console.error(response.error);
				}
			}
		};
		if(Newtec.Utils.toInt(params['startRow'],-1)<0){
			if(Newtec.Utils.isFalse(this.defaults.showPagin)){//不分页
				params['startRow']=-1;
			}else{
				params['startRow']=0;
				params['endRow']=this.pagin.showNum;
			}
		}
		if(isAsyPagin&&Newtec.Utils.toInt(params['totalRow'],-1)<0&&Newtec.Utils.isTrue(this.defaults.showPagin)){
			params['totalRow']=1000;
			var totalParam=$.extend(true,{},params);
			totalParam['totalRow']=-1;
			totalParam['startRow']=0;
			totalParam['endRow']=1;
			totalParam.callback=function(response){
				if(response.status==0){
					if(!tableThis.paginFetchData){
						var totalRow=Newtec.Utils.toInt(response.data.total,0);
						tableThis.totalRow=totalRow;
						if(totalRow<=0){//总数零，隐藏分页组件
							tableThis.pagin.hidden();
						}else{//总数不为零，显示分页组件
							tableThis.pagin.createPagin(totalRow,null,defaults.maxRow);
							tableThis.pagin.show();
						}
					}else{
						tableThis.paginFetchData=false;
					}
				}else{
					console.error(response.error+"==>获取总数失败！！");
				}
			}
			this.ds.fetchData(totalParam);
		}
		this.ds.fetchData(params);
	};
	Newtec.Table.prototype.addData = function(record,operId,callback,isAppendData){
		if(Newtec.Utils.isNull(this.ds)) return;
		var tableThis = this;
		var trId=[];
		var trID=this.NEWTEC_TR_ID;
		isAppendData=Newtec.Utils.isNull(isAppendData)?true:isAppendData;
		if(isAppendData){
			if(Newtec.Utils.isArray(record)){
				for(var i=0;i<record.length;i++){
					delete record[i][trID];
				};
			}else{
				delete record[trID];
			}
		}else{
			if(Newtec.Utils.isArray(record)){
				for(var i=0;i<record.length;i++){
					trId.push(record[i][trID]);
					delete record[i][trID];
				};
			}else{
				trId.push(record[trID]);
				delete record[trID];
			}
		}
		this.ds.addData({data:record,
			callback:function(response){
				if(response['status']==0){
					if(isAppendData){
						tableThis.addRecords(Newtec.Utils.isNull(response['data'])?record:response['data']);
					}else{
						var data=response['data'];
						if(Newtec.Utils.isArray(data)){
							for(var i=0;i<trId.length;i++){
								data[i].newtecTRId=trId[i];
							}
						}else{
							data.newtecTRId=trId[0];
						}
						tableThis.updateRecords(data,true);
					}
				}else{console.error(response["error"]);}
				if(Newtec.Utils.isFunction(callback)){
					callback(response);
				}
			},operId:operId});
	};
	Newtec.Table.prototype.updateData = function(record,operId,callback){
		if(Newtec.Utils.isNull(this.ds)) return;
		var tableThis = this;
		this.ds.updateData({data:record,
			callback:function(response){
				if(response['status']==0){
					tableThis.updateRecords(Newtec.Utils.isNull(response['data'])||Newtec.Utils.isNull(response['data'][0])?record:response['data']);
				}
				if(Newtec.Utils.isFunction(callback)){
					callback(response);
				}
			},operId:operId});
	};
	Newtec.Table.prototype.removeData = function(records,operId,callback){
		if(Newtec.Utils.isNull(this.ds)) return;
		var tableThis = this;
//		var trId = record[this.NEWTEC_TR_ID];
		this.ds.removeData({data:records,
			callback:function(response){
				if(response['status']==0){
					tableThis.removeRecords(records);
					setTotalpage(Newtec.Utils.isArray(records)?tableThis.totalRow-records.length:tableThis.totalRow-1,tableThis);
				}else{
					alert(response['error']);
				}
				if(Newtec.Utils.isFunction(callback)){
					callback(response);
				}
			},operId:operId});
	};
	/**
	 * 功能说明：空数据显示区
	 * @param {Object} isTrue
	 * @param {Object} emptyTitle
	 */
	Newtec.Table.prototype.showEmptyTitle=function(isTrue,emptyTitle){
		var emptyDiv =this.emptyDiv;
		if(emptyDiv){
			emptyDiv.css('display',!isTrue?"none":'');
			if(emptyTitle){
				emptyDiv.text(emptyTitle);
			}
		}else{
			var df=this.defaults;
			emptyTitle=emptyTitle?emptyTitle:df.emptyTitle;
			emptyDiv=this.emptyDiv=$('<div class="table-empty" style="'+(!isTrue?"display:none;":'')+df.emptyStyle+'">'+emptyTitle+'</div>');
			this.table.append(emptyDiv);
		}
		
	}
	/**
	 * 显示加载样式
	 */
	Newtec.Table.prototype.showLoadDiv=function(){
		var loadDiv=this.loadDiv;
		var newtecJQ=this.newtecJQ;
        if(loadDiv==undefined){
        	var loadDiv=this.loadDiv=$('<div style="width:100%;height:100%;background:white;top:0;position:absolute;-moz-opacity:0.7; -khtml-opacity:0.7;opacity:0.7;"><div>');
        	loadDiv.append('<div style="position:absolute;width:143px;height:30px;margin:auto;top:0;bottom:0;left:0;right:0;">正在努力加载数据中....</div>');
        	newtecJQ.append(loadDiv);
        }else{
        	loadDiv.css('display','block');
        }
        newtecJQ.css('position','relative');
	};
	/**
	 * 隐藏加载样式
	 */
	Newtec.Table.prototype.hideLoadDiv=function(){
		var loadDiv=this.loadDiv;
		loadDiv.css('height',loadDiv.outerHeight());
	    loadDiv.fadeOut(300);
		this.newtecJQ.css('position','relative');
		setTimeout(function(){
			loadDiv.css('height',"100%");
		}, 400);
	};
})()
