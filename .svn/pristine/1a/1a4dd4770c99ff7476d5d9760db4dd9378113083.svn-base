;(function(){
if(Newtec.DoubleTable != undefined){
		console.warn('newtec.doubletable.js已经被引入!');
		return ;
	}
Newtec.Table||Newtec.Utils.addJS("newtec.table.js","myqdp/js/widget/");
Newtec.Utils.addCSS("newtec-doubletable.css","myqdp/css/widget/");
//Newtec.Pagin||Newtec.Utils.addJS('newtec.pagin.js','myqdp/js/widget/');
//Newtec.Pagin2||Newtec.Utils.addJS('newtec.pagin2.js','myqdp/js/widget/');
Newtec.DoubleTable = function(params){
	var ds=params['ds'];
	this.ds=Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
	this.defaults={
			ds:null,
			fetchParam:null,
			fetchParam2:null,
			secondTitle:null,
			maxRow:10,
			datas:null,
			showPagin:true,
			autoFetch:false,
			synFetch:false,
			t1Param:null,
			t2Param:null,
			is100Height:false,
			checkeboxWidth:35,
			dblclick:null,
			maxHeight:625,
			tmaxHeight:675,
			doubletableNoScorll:false,
			table2Width:null,
	}
	var defaults=$.extend(true,this.defaults,params);
	var fetchParam=defaults.fetchParam?defaults.fetchParam:defaults.fetchParam={};
	fetchParam.endRow=defaults.maxRow;
};
Newtec.DoubleTable.exte(Newtec.Base,'doubleTable');
Newtec.DoubleTable.over({
	createNewtecJQ:function(params){
		var defaults=this.defaults;
		var newtecJQ=$('<div class="double-table clear-float'+(params.secondTitle&&" showHeader"||"")+'"></div>');
		newtecJQ
		.append(this.createTBody(params))
		
		defaults.showPagin&&newtecJQ.append(this.createPain())
		this.setScrollbars = function(){
			if(!this.defaults.doubletableNoScorll){
				newtecJQ.mCustomScrollbar({
					theme:"minimal-dark",
					scrollInertia:200
				})
			}
		}
		return newtecJQ;
	},
	fetchData:function(relParam){
		if(Newtec.Utils.isNull(this.ds)){ console.error("数据源为空！"); return };
		if(Newtec.Utils.isNull(relParam)){relParam={ds:this.ds.dsName};};
		var This=this;
//		this.showLoadDiv(this.resultListJQ);
	    //
		//合并初始化限制的请求条件
		var fetchParam=$.extend(true,{},this.defaults['fetchParam']),
		defaults=this.defaults;
		var fbParam=$.extend(true,{},relParam);
		params=$.extend(true,fetchParam,relParam);
		var callback=params['callback'];
		console.info("===fetchData>>.",This.paginFetchData);
		if(defaults.synFetch){
			console.info("---------<<<<<123");
			params['callback']=function(response){
//				This.hideLoadDiv();
				This.preFechParam = params;
//				if(Newtec.Utils.isFunction(callback))
//					callback(response);
				if(response.status==0){
					var data = response.data||{} 
					if(This.defaults.showPagin){
						console.info("----------<<<<<",This.paginFetchData);
						if(!This.paginFetchData){
							var totalRow = Newtec.Utils.toInt(data.total)
							This.totalNum=totalRow;
							This.pagin.createPagin(totalRow,null,defaults.maxRow);
						}else{
							This.paginFetchData=false;
						}
					}
					This.table1.setData(data.datas);
				}else{
					console.error(response.error);
				}
			};
			this.ds.fetchData(params);
			var fetchParam2=$.extend(true,{},this.defaults['fetchParam2']);
			fetchParam2.endRow=10
			fbParam=$.extend(true,fetchParam2,fbParam);
			fbParam['callback']=function(response){
//				This.hideLoadDiv();
//				if(Newtec.Utils.isFunction(callback))
//					callback(response);
				if(response.status==0){
					This.table2.setData(response.data.datas);
				}else{
					console.error(response.error);
				}
			};
			this.ds.fetchData(fbParam);
		}else{
			console.info("---------<<<<<12");
			params['callback']=function(response){
//				This.hideLoadDiv();
				This.preFechParam = params;
//				if(Newtec.Utils.isFunction(callback))
//					callback(response);
				if(response.status==0){
					var data=response.data||{};
					if(This.defaults.showPagin){
						console.warn("===response>>.",response.data.totalRow,This.paginFetchData);
						if(!This.paginFetchData){
							var totalRow = Newtec.Utils.toInt(data.total)
							This.totalNum=totalRow;
							This.pagin.createPagin(totalRow,null,defaults.maxRow);
						}
						This.paginFetchData=false;
					}
					This.setData(data.datas);
				}else{
					console.error(response.error);
				}
			};
			console.info("params==>",params);
			this.ds.fetchData(params);
		}
		
	},
	finsh:function(params){
		var datas=params['datas'];
		console.info("==>>",params.autoFetch);
		if(!Newtec.Utils.isNull(datas)&&Newtec.Utils.isArray(datas)){
			this.setData(datas);
		}else if(params.autoFetch){
			this.fetchData();
		}
		var that = this
		setTimeout(function(){
			var thead2 = that.table2.thead
			var height = $(thead2).css("height")
			console.warn("height>>>>>>>",height)
			var thead2Title = $(that.table2.headerTitleJQ)
			var titleH = 0
			if(!Newtec.Utils.isNull(thead2Title)){
				titleH = thead2Title.parent().css("height")
			}
			console.warn("?height2>>>>>>",titleH)
			height2 = height + titleH + 1 
			console.warn("target1>>========",$(that.table1.tbodyDiv).find(".newtec-tbody").find("thead").find("tr").find("th").css("height"))
			var interHead = $(that.table1.tbodyDiv).find(".newtec-tbody").find("thead").find("tr").css("height",height2)
			console.warn("target2>>========",$(that.table1.tbodyDiv).find(".newtec-tbody").find("thead").find("tr").find("th").css("height"))
			var outerHead = $(that.table1.thead).find("thead").find("tr").css("height",height2)
		},500)
		
//		var thead = tableThis.thead
//		var height = $(thead).css('height')
//		//内表格头部
//		console.warn(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",height)
//		var innerHead = thead.parents(".t-right").prev().find(".newtec-tbody").find("thead")
//		innerHead.find("tr").css("height",height);
//		console.warn(">>>>>>>>>>>>>>>>>innerHead>>>>>>>>>>>>>",innerHead)
//		//显示表格头部
//		var outerHead = thead.parents(".t-right").prev().find(".t-thead-div").find("thead")
//		outerHead.find("tr").css("height",height);
//		console.warn(">>>>>>>>>>>>>>>>>outerHead>>>>>>>>>>>>>",outerHead)
	},
	updateTitle:function(name,title){
		this.table1.updateTitle(name,title);
		this.table2.updateTitle(name,title);
	},
	setData:function(data,append){
		var newData=$.extend(true,[],data);
		this.table1.setData(data,append);
		this.table2.setData(newData,append);
	},
	createPain:function(){
		var params=this.defaults;
		var This=this;
		var showNum=params['maxRow'];
		this.paginFetchData=false;
		var pagin=Newtec.Pagin2.create({showNum:showNum,changeFunction:function(index,totalPage,begin,totalRow){
			showNum=pagin.showNum;
			console.info(This.totalNum+"=totalRow==<<><>"+totalRow);
			var p=This.preFechParam
			p.startRow=(showNum*(index-1));
			p.endRow=showNum*index;
			p.totalRow=totalRow;
//			if(Newtec.Utils.isFunction(params['changePageFun'])){
//				params['changePageFun'](index,showNum*(index-1),showNum*index,p);
//			}
			This.paginFetchData=true;
			This.fetchData(p);
		}});
		this.pagin=pagin;
		return pagin.newtecJQ;
	},
	updateHeadTitle:function(title){
		this.table2.updateHeadTitle(title);
	},
	createTBody:function(params){
		var layout=$("<div class='clear-float'></div>");
		var leftLayout=$("<div class='t-left'></div>");
		var rightLayout=$("<div class='t-right'></div>");
		var that=this;
		var f1=params.fields1;
		var f2=params.fields2;
		if(!Newtec.Utils.isArray(f1)||!Newtec.Utils.isArray(f2)){
			console.error("fields1/fields2不是数组！！");
			return ;
		}
		var isSelect=true;
		var t1Param=params.t1Param,
		t2Param=params.t2Param,
		secondTitle=params.secondTitle,
		dblclick=params.dblclick,
		tbParams={
				fields:f1,mode:2,multSelect:false,tBodyNoScorll:true,
				fixed:true,headFixed:false,dbclickRecord:dblclick,
				change:function(isTrue,data,trId){
					console.info("====1<",isSelect)	
					if(!isSelect)return;
					isSelect=false;
					var id=data.id;
					var table2=that.table2;
					var data2=table2.pageDatas;
					for(var i=0;i<data2.length;i++){
						if(data2[i].id==id){
							table2.selectByData(data2[i]);	
							break;
						}
					}
					isSelect=true;
				},
			},
			tbParams2={
				mode:2,multSelect:false,tBodyNoScorll:true,showHeader:secondTitle?true:false,
				headerTitle:secondTitle||null,fixed:true,dbclickRecord:dblclick,
				change:function(isTrue,data,trId){
					if(!isSelect)return;
					isSelect=false;
					var id=data.id;
					var data1=table1.pageDatas;
					for(var i=0;i<data1.length;i++){
						if(data1[i].id==id){
							table1.selectByData(data1[i]);	
							break;
						}
					}
					isSelect=true;			
				},
				doubleChange:function(tableThis){
					var thead = tableThis.thead
					var height = $(thead).css('height')
					//内表格头部
					var innerHead = thead.parents(".t-right").prev().find(".newtec-tbody").find("thead")
					innerHead.find("tr").css("height",height);
					//显示表格头部
					var outerHead = thead.parents(".t-right").prev().find(".t-thead-div").find("thead")
					outerHead.find("tr").css("height",height);
				},
			};
		$.extend(true,tbParams,t1Param)
		$.extend(true,tbParams2,t2Param)
		var table1=Newtec.Table.create(tbParams);
		
		console.info("---secondTitle-<<<",secondTitle);
		this.reSetFields2=function(fs){
			rightLayout.empty();
			tbParams2.fields=fs;
			var table2=Newtec.Table.create(tbParams2)
			rightLayout.append(table2.newtecJQ)
			this.table2=table2;
		};
		leftLayout.append(table1.newtecJQ);
		this.table1=table1;
		this.reSetFields2(f2);
		this.rightLayout=rightLayout;
		return layout.append(leftLayout).append(rightLayout);
	}
});
})();