;(function(){
	if(!Newtec.Utils.isNull(Newtec.Table)){
		return ;
	}
	var serverUrl=Newtec.ServerUrl;
	Newtec.Utils.addJS("newtec.pagin2.js","myqdp/js/widget/");
//	var tableThis;//当前表格this对象
	var childRowClass='child_row';
	Newtec.Table = function(params){
		this.defaults = {
			leng:5,
			beginpage:1,
			focuspage:1,
			fields:'',
			datas:'',
			src:serverUrl+'myqdp',
			tableDivClass:'',
			maxHeight:400,
			minHeight:0,
			is100Height:false,
			height:'',
			mode:'1',//1,   2：表示普通的简单表格
			multSelect:true//是否能多选，默认可以多选；多选的话出现复选框
			,expand:false
			,expandFun:null
			,checkeboxWidth:35
			,tdWidth:150
			,emptyTitle:'无数据...'
			,erreMess:''
			,emptyStyle:''
			,fixed:false
			,headFixed:true
			,colspan:0
			,pages:[10,20,30,50,100]
			,tdValueHtmlFun:''//每列可以修饰
			,trBtnFun:''//行最后一列按钮
			,trBtnTitle:'操 作'
			,trBtnWidth:120
			,headerTitle:''
			,showHeader:true
			,showThead:true
			,showPagin:true
			,showFetchForm:true
			,autoFetch:false
			,fetchTitle:'查&nbsp;询'
			,fetchFormParam:{}//查询表单的构建参数，外部可以设置
	        /**
	         * params：查询参数，以修改后的为标准
	         */
			,fetchBefore:function(params){return true;}//返回false阻止删除操作
			,fetchParam:{
				data:{}
			}//表单查询时的参数
			,showFooter:true
			,pageSize:3
			,editHandler:""
			,dbclickCanEdit:false
			,dbclickEditFun:null
			,showMoreDivWidth:200//更多功能弹窗宽度
			,canDraft:true//是否列宽可拖拽
			,showFilter:false
			,showHeaderBtn:true
			,tableClass:''//表内容tablediv样式，可以通过'border:0;'控制表身无边框
			,searchBtnStyle:''
			,groupBy:""
			,change:""
			,rowspan:null
			,rowspanStyle:""
			,createFieldBefore:function(field,type,dsName){}//列表字段创建前
			,setDataBefore:function(table,datas,isAppendData,index,noSetTotalPage){}//数据设置前
			,setDataAfter:function(table,datas,isAppendData,index,noSetTotalPage){}//数据设置后
			,isAsyPagin:false
			,tBodyNoScorll:false//表格身体滚动
			,tBodyNoScorllX:false//
			,selectChangeFun:null//function(data,changeStatus选中为true,取消为false,isAll:是否全选){}
			,searchInputParam:{//检索功能参数
				show:false,//是否显示，优先级高于showFetchForm
				hint:'请输入关键字',//提示关键字
				maxlength:50,//输入框长度限制
				searchKey:['keyword'],//传递回后端的name值
				btnTitle:'查询',//按钮的值
			}
	//		,showMoreBtn:true//是否显示更多功能按钮
			,moreModule:{//拓展模块
				show:false,
				sort:{//排序展示
					show:true,
					title:'排序'
				},
				showTitle:{//显示表
					show:true,
					title:'列显示'
				}
			},
			trBtnLast:true,
			paginLocation:'right',
			maxLength:50,
			thAlign:"",
			otherFieldArray:null,
			colnumsArray:null,
			rownumsArray:null,
		};
		var mode=params.mode;
		var def=this.defaults;
		if(mode=='2'){
			def.showHeader=params.showHeader||false;
			def.showPagin=params.showPagin||false;
			def.showFetchForm=params.showFetchForm||false;
			def.showFooter=params.showFooter||false;
			def.showHeaderBtn=params.showHeaderBtn||false;
		}
		this.isTrBtnFun = false;
		this.isTdValueHtmlFun = false;
		this.preRowMax=0;
		this.mapToData={};//表格自动生成id,与数据绑定关系
	};
	Newtec.Table.exte(Newtec.Base,'table');
	Newtec.Utils.addJS(["widget/table/newtec.table_edit.js","widget/table/newtec.table_network.js"],function(){
		//-----------初始化完毕
		Newtec.Module("Newtec.Table")
	});
	Newtec.Table.prototype.NEWTEC_TR_ID = 'newtecTRId';//增加在每行数据[this.datas/this.pageDatas]中的缓存key,和dom中的trId值对应
	Newtec.Table.prototype.setParams=function(params){
		var def=this.defaults;
		var config="";
		this.isRowspan=Newtec.Utils.isArray(def.rowspan);
		var skin="";
		this.headClass="table-header ";
		this.currentPage=1;
		this.selectedClss="selected ";
		if(Newtec.Utils.isTrue(def.showPagin))def.showFooter = true;
//		var backgroundColor=def.backgroundColor;
		this.pk ;
		this.multSelect=true;//标记单选和多选
		this.trBtnShow=false;//行上最后一列按钮是否显示
		this.selectRecord;//单选时维护选中的记录，多选的情况下不维护这个值，动态获取。
		this.ds = def.ds;
		this.fields = '';
		this.datas = '';
		this.pageDatas;//当前页面的数据
		this.tableDiv;
		this.tableHeader;
		this.tableHeaderBtns;
		this.tableHeaderOther=def.tableHeaderOther;
		this.table ;
		this.tdWidth = def.tdWidth;
		this.isDouble = def.isDouble;
		this.thead;
		this.tbody;
		this.tbodyTable;
		this.tbodyDiv;
		this.tdJQs;//tbody上的第一行的所有td JQuery集合
		this.thJQs;//thead所有th JQuery集合
		this.clickRecord=function(){};
		this.dbclickRecord=function(){};
		this.pageSize = def.pageSize;//每页的大小
		this.totalRow=-1;//总记录数
		this.fetchParam=def.fetchParam;
		this.preFechParam={};
//		this.oldFetchParam=$.extend(true,{},this.fetchParam);//存放最原始查询条件
		this.showMoreBtn=def.showMoreBtn;//拓展功能按钮是否显示
		this.showMoreDivStyle="-webkit-box-shadow: -2px 2px 2px; -moz-box-shadow: -2px 2px 2px;box-shadow:-2px 2px 2px; ";
		this.showMoreDivWidth=def.showMoreDivWidth;
		this.selectedColors={};//存放选中颜色
		this.firstSetDate=true;
		this.fecthType='defaultType';
		this.editFun={};
	}
	Newtec.Table.prototype.createNewtecJQ=function(params){
		var defaults=this.defaults;
		this.setParams(params);
		this.isTdValueHtmlFun = Newtec.Utils.isFunction(params['tdValueHtmlFun'])?true: false;
		this.isTrBtnFun = Newtec.Utils.isFunction(params['trBtnFun'])?true:false;
		
		this.multSelect =params['expand']==true?false: params['multSelect'];
		this.setPK(params['pk']);
		var fields = params['fields'];
		this.fields = fields;
		var is100Height=params.is100Height
		is100Height=params.is100Height=params.height&&params.height.indexOf("100%")>=0||is100Height
		this.tableDiv = $("<div id='"+this.getTableDivId()+"' class='newtec-table-div "+((params.fixed&&"fixed")||"")
				+(params.showFilter&&" show-filter"||"")+(is100Height&&" height100"||"")+"'></div>");
		this.tableHeaderOther = params.tableHeaderOther;
		//创建表头thead
		var showSearch=defaults.searchInputParam&&defaults.searchInputParam.show==true;
		var showFetchForm=Newtec.Utils.isTrue(this.defaults.showFetchForm)&&!showSearch;
		if(Newtec.Utils.isTrue(this.defaults.showHeader)){
			this.tableHeader = $("<div  class='table-header'></div>");
			if(params['headerTitle']){
				var headerTitleJQ=$("<span id='headerTitle'>"+params['headerTitle']+"</span>");
				this.tableHeader.append(headerTitleJQ)
				this.headerTitleJQ=headerTitleJQ;
			}
			this.tableHeaderBtns = $("<div class='"+(defaults.tableHeaderDirection=="left"&&"pull-left"||"pull-right")+"' style='margin: 3px 0;'></div>");
			if(showFetchForm){
				var tableThis=this;
				if(this.defaults.showHeaderBtn){
					this.tableHeaderShowBtn = $("<div ' class='pull-left' title='收起' style='margin: 3px 0;color:black;cursor:pointer;'><img width='12px' src='"+params['src']+"/images/table/chevron-down1.png'></div>");
					$(document).on('click',"#"+this.getTableDivId()+" .table-header .pull-left",function(){
						tableThis.tableHeaderShowBtnClick(this);
					});
					this.tableHeader.append(this.tableHeaderShowBtn);
				}
				Newtec.Utils.appendTo(this.tableHeaderOther,this.tableHeader);
			}
			Newtec.Utils.appendTo(this.tableHeaderBtns,this.tableHeader);
			Newtec.Utils.appendTo($("<div class='clearfix'></div>"),this.tableHeader);
			Newtec.Utils.append(this.tableDiv,this.tableHeader);
		}
		if(showSearch){
			this.defaults.showFetchForm=false;
			this.fetchFormJQ=this.setSearchInput(defaults.searchInputParam)
			Newtec.Utils.append(this.tableDiv,this.fetchFormJQ);
		}else if(showFetchForm){
			var showFetchForm = this.createFetchForm();
			this.fetchFormJQ=showFetchForm.newtecJQ;
			Newtec.Utils.append(this.tableDiv,this.fetchFormJQ);
		}
		this.tableBodyDiv=$("<div class='t-table-body-div'></div>")
		.append(this.showMoreDiv).append(this.getTable(params));
		Newtec.Utils.append(this.tableDiv,this.tableBodyDiv);
		if(Newtec.Utils.isTrue(this.showMoreBtn)){
			this.showMoreDiv=this.getMoreDiv();
		}
		if(Newtec.Utils.isTrue(this.defaults.showFooter)){
			this.tableFooter = $("<div class='table-footer' ></div>");
			Newtec.Utils.append(this.tableDiv,this.tableFooter);
			this.footstart= $("<div style='float:left;width:100%;color:red;'></div>");
			this.footend = $("<div style='float:left;width:100%;color:red;'></div>");
			this.totalpage = $("<div style='float:left;margin:2px 0 0 5px'></div>");

			this.Pagmain=$("<div style='width:100%;margin:5px 0;overflow:hidden';></div>").append(this.totalpage);	
			this.tableFooter.append(this.footstart).append(this.Pagmain);

		}
       

		//事件处理
		this.setClickRecord(params['clickRecord']);
		this.setDbclickRecord(params['dbclickRecord']);
		return this.tableDiv;
	};
	/**
	 * 表格搜索框
	 */
	Newtec.Table.prototype.setSearchInput=function(searchInputParam){
		var showFields=searchInputParam.showFields,defaults=this.defaults;
		var div=$("<div class='clear-float table-search-layout'>" +
				"<div class='select-min pull-left'>" +
				"<input maxlength='"+searchInputParam.maxlength+"' placeholder='"+searchInputParam.hint+"' id='minInput'>" +
				"<button class='btn' id='minBtn'>"+searchInputParam.btnTitle+"</button></div>" +
				"</div>");
		var minInput=div.find('#minInput');
		var that=this;
		minInput.on('keyup',function(e){
			if(e.keyCode==13){
				search()
			}
		})
		div.find('#minBtn').click(function(){
			search();
		})
		var searchKeys=searchInputParam.searchKey||['keyword'];
		var keyLen=searchKeys.length;
		function search(){
			var keyword=minInput.val();
			keyword=keyword&&keyword.trim();
			var data={};
			for(var i=0;i<keyLen;i++)data[searchKeys[i]]=keyword;
			that.fetchData({data:data});
		}
		return div;
	}
	/**
	 * 获取表格，表格是由连个表格组成，表头与表身两个表格
	 * @param params
	 * @returns {String}
	 */
	Newtec.Table.prototype.getTable=function(params){
		var that=this;
		var table = "<div id='"+this.getTableId()+"' class='newtec-table "+(params['tableClass']||"")+"'></div>";//原来是table标签的 现在换成了div标签
		this.table = table=$(table);
		var thead=$("<div class='t-thead-div'>");
		var style=!params.is100Height&&'max-height:'+params.maxHeight+"px;min-height:"+params.minHeight+"px"||"";
		var tbodyDiv=$("<div class='t-tbody-div' style='"+style+"'>");
		table.append(tbodyDiv).append(thead);
		this.setTableBody(tbodyDiv,table);
		this.thead=thead;
		this.tbodyDiv=tbodyDiv;
		if(params.moreModule.show){//拓展模块展示
			Newtec.Utils.addJS('widget/table/newtec.table_sort.js',function(){
				that.setMoreModuleBody();
			})
		}
//		this.setDS(params['ds'], true);
//			this.setFields(this.fields);
		return table;
	}
	Newtec.Table.prototype.setTableBody=function(tbodyDiv,table){
		var tableThis=this;
		this.tbody = $("<tbody ></tbody>");
		this.tbodyHead=$('<thead></thead>')
		var tbodyTable=this.tbodyTable = $("<table id = 'in-table' class='newtec-tbody table table-striped table-bordered table-hover' ></table>");
		var defaults=this.defaults;
		tbodyDiv.empty();
		tbodyDiv.append(tbodyTable);
		tbodyTable.append(this.tbodyHead).append(this.tbody);
		this.isSetScrollbar=false;
		this.setScrollbar=function(){
			if(!defaults.tBodyNoScorll)
				tbodyDiv.mCustomScrollbar({//设置滚动条
					theme: "minimal-dark",
					scrollInertia:defaults.scrollTime,
					callbacks:defaults.callbacksscroll||{},
//					scrollInertia:200,
//					setTop:100
				});
			if(!defaults.tBodyNoScorllX)
				table.mCustomScrollbar({//设置滚动条
					theme: "minimal-dark"
						,axis:"x"
							,scrollInertia:200
				});
		}
//		var setResize=false;
		table.resize(function() {
			if (tableThis.noReWidth)return;
			tableThis.first=false;//是否需求重新计算列宽
			_setTdWidth(tableThis,true);
		});
	}
	Newtec.Table.prototype.updateHeadTitle=function(title){
		this.headerTitleJQ&&this.headerTitleJQ.text(title);
	}
	Newtec.Table.prototype.createFetchForm = function(){
		var tableThis = this;//设置当前表格this
		var fetchForm =null;
		
		var param = {ds:this.ds,operType:Newtec.DS.OperType.fetch,titleColumn : 3,columnNum: 4,style:'padding:5px 0;'
			,createFieldBefore:this.defaults.createFieldBefore
			,footer:$("<div class='pull-right' style='margin-right:24px'><button  type='button' class='btn-sm btn btn-success' style='padding: 1px 15px;"+this.defaults['searchBtnStyle']+"'>"+this.defaults['fetchTitle']+"</button></div>")
			.click(function(){
				var fetchP = fetchForm.getValues(true);
				tableThis.fetchData({data:fetchP});
			})};
		Newtec.Utils.jsonCopy(this.defaults.fetchFormParam,param);
		fetchForm = Newtec.Form.create(param);
		return fetchForm;
	};
	Newtec.Table.prototype.initPagination = function(){
		var params=this.defaults,
		that=this,
		pages=params['pages'],
		showNum=pages[0];
		this.paginFetchData=false;
		var pagin=Newtec.Pagin2.create({
			float:params['paginLocation']||"right",
			style:params['paginStyle']||"",
			paginClass:params['paginClass']||{},
			pages:pages,
			showNum:showNum,
			changeFunction:function(index,totalPage,begin,totalRow,seltype){
				showNum=pagin.showNum;
				var p=that.preFechParam
				p.startRow=(showNum*(index-1));
				p.endRow=showNum*index;
				p.totalRow=totalRow;
				that.paginFetchData=true;
				that.fetchData(p);
		}});
		this.pagin=pagin;
		this.Pagmain.append(pagin.newtecJQ);
	};
	var getLastPage = function(tableThis){
		//console.info("--->>>>",tableThis.totalRow,tableThis.pageSize,tableThis.totalRow%tableThis.pageSize);
		return tableThis.totalRow%tableThis.pageSize==0? tableThis.totalRow/tableThis.pageSize:Newtec.Utils.toInt(tableThis.totalRow/tableThis.pageSize)+1;
	};
	var setToPage = function(to,tableThis){
		to = Newtec.Utils.toInt(to,-1);
		if(to>0 && to<=getLastPage(tableThis)){
//			tableThis.pageSize = to;
			$("#toPageId").val(to);
			return true;
		}
		return false;
	};
	var setTotalpage = function(total,tableThis){
		tableThis.pagin.createPagin(total);
	};
	
	
	Newtec.Table.prototype.finsh = function(params){
		var tableThis = this;
//		this.newtecJQ.css("height",'100%');
		
		this.setDS(params['ds'], true);
		this.setFields(this.fields);
		if(Newtec.Utils.isTrue(this.defaults.showFooter)){
			this.initPagination();
			this.tableFooter.append(this.footend);
		}
		//设置值
		var datas = params['datas'];
		if(this.defaults.autoFetch==true){//自动查询数据
			this.fetchData(this.fetchParam);
		}else  if(!Newtec.Utils.isNull(datas)){//本地设置--
			setTimeout(function(){
				tableThis.setData(datas);
			},300);
		}
		if(Newtec.Utils.isTrue(tableThis.defaults.canDraft)){
			_colResizable(this);
			registeFunction(this);
		};
		var heightStyle='';
		if(params.is100Height){
			var newteJQ=this.newtecJQ;
			var tableFooter=this.tableFooter;
			var tableHeader=tableThis.tableHeader;
			var fetchFormJQ=tableThis.fetchFormJQ
			function resizeFun(){
				_resizeFun(tableThis);
			}
			tableFooter&&tableFooter.resize(resizeFun)
			fetchFormJQ&&fetchFormJQ.resize(resizeFun)
			tableHeader&&tableHeader.resize(resizeFun)
			_resizeFun(tableThis);
		}
//		this.setScrollbar();
		_setFunction(this,params);
		
	};
	function _resizeFun(tableThis){
		var tableFooter=tableThis.tableFooter;
		var tableHeader=tableThis.tableHeader;
		var fetchFormJQ=tableThis.fetchFormJQ
		function resizeFun(){
			var top=0;
			if(tableHeader!=undefined){
				
				top+=tableHeader.outerHeight(true);
			}
			if(fetchFormJQ!=undefined){
				top+=fetchFormJQ.outerHeight(true);
			}
			var bottom=0;
			if(tableFooter!=undefined){
				bottom=tableFooter.outerHeight(true);
			}
			tableThis.tableBodyDiv.css({'top':top,'bottom':bottom});
		}
		resizeFun();
		tableFooter&&tableFooter.resize(resizeFun)
		fetchFormJQ&&fetchFormJQ.resize(resizeFun)
		tableHeader&&tableHeader.resize(resizeFun)
	}
	/**
	 * 注册事件
	 */
	var _setFunction=function(tableThis,params){
//		var preDbclickTdId=''; 
		var canClick = true;//是否是触发单击
		var clickEventTime =null;
		var table=tableThis.table;
		var defaults=tableThis.defaults;
		var colspan=tableThis.defaults.colspan;
		//
//		var clickEvent = true;
//		var dbclickEvent = true;
		if(tableThis.multSelect){
			tableThis.tableDiv.on('click',"#"+tableThis.getThCheckId(),function(){//头部的复选框 选中和反全选
//				if(Newtec.Utils.isNull(tableThis.pageDatas)) return ;
				tableThis.selectAll(!$(this).hasClass("selected"));
				Newtec.Utils.isFunction(defaults.selectChangeFun)&&defaults.selectChangeFun(null,!$(this).hasClass("selected"),true)
			});
			tableThis.tableDiv.on('click',"tr>td:first-child>.check-item",function(){//头部的复选框 选中和反全选
				var jq=$(this);
				var trId=tableThis.trCheckId2TrId(jq.attr('id'));
				var data=tableThis.getRowRecord(trId);
				if(jq.hasClass("selected")){
					tableThis.selectByTRId(trId,false,data);
					jq.removeClass("selected")
				}else{
					tableThis.selectByTRId(trId,true,data);
					jq.addClass("selected")
				}
				Newtec.Utils.isFunction(defaults.selectChangeFun)&&defaults.selectChangeFun(data,!jq.hasClass("selected"))
			});
		}
		table.on('click','.newtec-tbody tbody>tr.'+childRowClass,function(){
			var clickEvent = Newtec.Utils.isFunction(tableThis.clickRecord);
			var dbclickEvent = Newtec.Utils.isFunction(tableThis.dbclickRecord);
			tableThis.newtecJQ.find("tr.clickClass").removeClass("clickClass")
			$(this).addClass("clickClass")
			var trId=$(this).attr('id');
			var data=tableThis.getRowRecord(trId);
			if(canClick==false){//单击复选框不出发单击行记录
				canClick = true;
				return ;
			}
			if (tableThis.multSelect==false) 
			     tableThis.selectByTRId(trId,true,data);
			if(clickEvent){//设置单击事件
				if(dbclickEvent){//当双击事件同时存在的情况下，利用单击延时避免覆盖双击事件
					var j = $(this);
					setTimeout(function(){tableThis.clickRecord(data,j);},200);	
				}else{
					tableThis.clickRecord(data,$(this));
				}
			}
		});
		table.on('dblclick','.newtec-tbody tbody>tr.'+childRowClass,function(){
				var dbclickEvent = Newtec.Utils.isFunction(tableThis.dbclickRecord);
				if(dbclickEvent){//当单击事件同时存在的情况下，双击的时候需要移除掉产生的无效单击
					clearTimeout(clickEventTime);
				}else{
					return;
				}
				var data=tableThis.getRowRecord($(this).attr('id'));
				tableThis.dbclickRecord(data,$(this));
			});
			console.info("childRowClass==",childRowClass)
		table.on('click','.newtec-tbody tbody>tr.'+childRowClass+'>td:first-child .check-item',function(){
			var trId=tableThis.trCheckId2TrId($(this).attr('id'));
			var data=tableThis.getRowRecord(trId);
			canClick = false;
			if ($(this).hasClass("selected")) {
				
				tableThis.selectByTRId(trId,true,data);
			}else{
				tableThis.selectByTRId(trId,false,data);
			}
		});
		table.on('click','.newtec-tbody tbody>tr.group_row>td:first-child .check-item',function(){
			var iput=$(this);
			var clazz=iput.attr('id');
			if(Newtec.Utils.isNull(clazz))return;
			var checked=!iput.hasClass("selected");
			table.find("."+clazz).each(function(){
				tableThis.selectByTRId($(this).attr('id'),checked);
			});
			
		});
		if(params.expand){
			table.on('click','td.expendTd',function(){
				//glyphicon-minus glyphicon-plus
				var jq=$(this),i=jq.find('i'),cla=i.attr('class'),
				tr=jq.parent(),id=jq.attr('id'),trNext=tr.next(),
				trId=tr.attr('id'),indext=tableThis.trId2Index(trId),
				data=tableThis.getRowRecord(indext);
				if(cla.indexOf('glyphicon-plus')>=0){
					i.removeClass('glyphicon-plus').addClass('glyphicon-minus');
					if(trNext&&trNext.attr('id')==(id+"_expendTd")){
						trNext.css('display','');
						if(Newtec.Utils.isFunction(params.expandFun))params.expandFun(data,jq,trNext,trNext.children(),false,true);
					}else{
//						var fieldslen=thi+2;
						var td=$('<td colspan='+colspan+' style="padding-left:35px;background:#ddd;"></td>')
						trNext=$('<tr id="'+(id+"_expendTd")+'" ></tr>').append(td);
						tr.after(trNext);
						if(Newtec.Utils.isFunction(params.expandFun))params.expandFun(data,jq,trNext,td,true,true);
					}
				}else{
					i.removeClass('glyphicon-minus').addClass('glyphicon-plus');
					trNext.css('display','none');
					if(Newtec.Utils.isFunction(params.expandFun))params.expandFun(data,jq,trNext,trNext.children(),false,false);
				}
			});
		}
		if (params.dbclickCanEdit) {//是否可双击编辑
			var dbclickEditFun=params.dbclickEditFun
			table.on('dblclick','tbody>tr.'+childRowClass+'>td',function(){
				var td = $(this);
				var id=td.attr('id');
				var name=tableThis.getTdId2Name(id);
				if(id=='c_0'||name=='btn')return;
				var tr=td.parent();
				var trId=tr.attr('id');
				if(tableThis.editFun[trId]!=undefined&&tableThis.editFun[trId][name]!=undefined)return true;
				var data=tableThis.getRowRecord(trId);
				var isNoEdit=Newtec.Utils.isFunction(dbclickEditFun)&&dbclickEditFun(name,data)===false||false;
				if(isNoEdit)return;
				var field='';
				var fields=tableThis.fields;
				for ( var i = 0; i < fields.length; i++) {
					if(fields[i].name==name){
						field=fields[i];
						break;
					}
				}
				//调用双击编辑事件
				tableThis.tdToCanEdit(td,tableThis,data,field,trId,true,true,function(newText,text){
					if(text!=newText)
						  td.addClass('edit-tr');
				});
				tableThis.selectByData(data);
				return false;
			});
			/**
			 * 监听行集点击
			 */
			table.on('click','tbody>tr.'+childRowClass,function(){
				return tableThis.trClickEdit($(this),$(this).attr("id"))
			});
			/**
			 * 监听全局点击
			 */
			$(document).on("click",function(){
				tableThis.trClickEdit()
			})
			tableThis.newtecJQ.on("click",function(){
				tableThis.trClickEdit()
			})
		}
	};
	Newtec.Table.prototype.setPK = function(pk){
		if(!Newtec.Utils.isNull(pk))
			this.pk = pk;
	};
	Newtec.Table.prototype.setDS = function(ds,useDSFields){
		if(ds==undefined){
			return;
		}
		this.ds = ds;
		if(Newtec.Utils.isNull(this.pk))
			this.setPK(this.ds.pk);
		if(useDSFields && Newtec.Utils.isNull(this.fields)){
			if(Newtec.Utils.isNull(ds.fields))return;
//			var dsFields = ds.fields;
			var dsFields ={};
			this.fields=$.extend(true, [],ds.fields);
//			this.setFields(dsFields);
		}
	};
	Newtec.Table.prototype.getCheckeboxWidth = function(){
		return Newtec.Utils.toInt(this.defaults['checkeboxWidth'],30)+"px";
	};
	Newtec.Table.prototype.getTrBtnWidth = function(){
		return Newtec.Utils.toInt(this.defaults['trBtnWidth'],120)+"px";
	};
	Newtec.Table.prototype.hiddeThead = function(){
		this.thead.hide();
		this.tbodyHead.hide();
	};
	Newtec.Table.prototype.setFields = function(fields){
		if(Newtec.Utils.isNull(fields) || this.hasSetFields==true){
			return ;
		}
		this.hasSetFields=true;
		this.fields = fields;
		var defaults=this.defaults;
		var checkStr = (this.multSelect==false)?"":"<th id='c' class='center check-box' style='width:"+this.getCheckeboxWidth()+"'>"
				+"<span class='check-item' id='"+this.getThCheckId()+"' >"	
				+"<img class='allimg' src='"+serverUrl+"myqdp/images/table/content_btn_selection.png'/>"
				+"<img class='noallimg' src='"+serverUrl+"myqdp/images/table/content_btn_half_election.png'/>"
				+"</span>"
				+"</th>";
		checkStr = (this.defaults.expand==false)?checkStr:"<th id='c' class='center' style='width:"+this.getCheckeboxWidth()+";border-bottom:none;border-left:0;'>"
				+"</th>";
		var thead = "";
		var otherFieldArray = this.defaults.otherFieldArray
		if(!Newtec.Utils.isNull(otherFieldArray)){
			for(var i = 0 ; i < otherFieldArray.length ; i++){
				var otherFields = otherFieldArray[i]
				thead += "<tr>"
					for(var y = 0 ; y < otherFields.length ; y++){
						var otherField = otherFields[y]
						thead += "<th class = 'center fieldStyle h-column'>" + otherField + "</th>"
					}
				thead += "</tr>"
			}
		}
		thead += "<tr id='"+this.getThId()+"'>"+checkStr;
		var len = fields.length,fixed=false,className=" h-column",title="";
		if(defaults.fixed&&defaults.headFixed){
			className+=" nowrap";fixed=true;
		}
		var lastName="";
		var exthead=thead;
		if(this.isTrBtnFun&&!this.defaults.trBtnLast){
			exthead=exthead+"<th class='center opear-btn' style=' width:"+this.getTrBtnWidth()+";border-left:1px;border-right:1px solid #dddddd;'>"+this.defaults['trBtnTitle']+"</th>";
			thead = thead+"<th id='"+this.getThbtnId()+"' class='center opear-btn' style=' width:"+this.getTrBtnWidth()+";border-left:1px;border-right:1px solid #dddddd;'>"+this.defaults['trBtnTitle']+"</th>";
			this.trBtnShow=true;//行上最后一列按钮是否显示
		}
		var totalW=0,noWidth=0;
		for(var i=0;i<len;i++){//此处要进行列名字验证 一定要存在 ‘name'属性
			var field = fields[i];
			var createFieldBefore = this.defaults.createFieldBefore;
			var createFieldBeforeRet = true;
			if(Newtec.Utils.isFunction(createFieldBefore))createFieldBeforeRet = createFieldBefore(field,"list",this.ds==undefined?"":this.ds.dsName);
			if(createFieldBeforeRet == false){//剔除的列
//				fields[i] = undefined;
				fields.splice(i,1);
				len-=1;//长度减一！！！
				i--;//检索号减一！！！
				continue;
			}
			var fieldStyle = field['style'];
			title="";
			if(fieldStyle==undefined)fieldStyle="fieldStyle";
			var hidden = Newtec.Utils.getFieldAttrValue(field,'hidden');
			var width=field.width;
			if(Newtec.Utils.isTrue(hidden)){
				hidden = ' display:none; ';
				field['h'] = true;//设置成隐藏，让创建tBody的时候使用
			}else{
				totalW+=Newtec.Utils.toInt(width,100)||100
				hidden = '';
				lastName=field['name'];
			}
			if(fixed){
				title="title='"+field['title']+"'";
			}
			
			if(i==len-1&&!noWidth)width=undefined;
			if(width!==undefined){
				width=";width:"+(width&&!isNaN(width)&&width+"px"||width);
				width+";min-width:auto;"
			}else{
				noWidth++;
			}
			var thAlign = defaults.thAlign || "center" //表头标题位置
			exthead+="<th " + (Newtec.Utils.isNull(field['colspan']) ? "" : " colspan = '" + field['colspan'] + "' ") + " " + (Newtec.Utils.isNull(field['rowspan']) ? "" : " rowspan = '" + field['rowspan'] + "' ") + "class='"+this.getThFirstClass()+" "+thAlign+" "+fieldStyle+className+"' "+title+" style='"+hidden+width+"'>"+field['title']+"</th>";
//			thead+="<th id='"+this.getThtdId(field['name'])+"'  "+title+"  class='"+this.getThFirstClass()+" center "+fieldStyle+className+"' style='"+hidden+width+"'>"+field['title']
//			+"<div class='thead-sort'><i class='glyphicon glyphicon-triangle-top'/><i class='glyphicon glyphicon-triangle-bottom'/></div></th>";
		}
		thead=exthead;
		this.lastName=lastName;
		if(this.isTrBtnFun&&this.defaults.trBtnLast){
			exthead=exthead+"<th class='center opear-btn' style=' width:"+this.getTrBtnWidth()+";border-left:1px;border-right:0;'>"+this.defaults['trBtnTitle']+"</th>";
			thead = thead+"<th id='"+this.getThbtnId()+"' class='center opear-btn' style=' width:"+this.getTrBtnWidth()+";border-left:1px;border-right:0;'>"+this.defaults['trBtnTitle']+"</th>";
			this.trBtnShow=true;//行上最后一列按钮是否显示
		} 
		var tableThis=this;
		thead+="</tr>";
		exthead+="</tr>";
		this.iniWidth=totalW;
		this.tbodyHead.empty().append(exthead);
		
		thead="<table id = 'out-head' class='newtec-thead table table-bordered'><thead>"+thead+"</thead>";
		if (this.defaults.showFilter) {
			thead+='<tbody><tr id="'+this.getTrFilterId()+'" class="head-filter">'+getFilterTr(this,fields)+'</tr></tbody>';
		}
		thead+="</table>";
		exthead+="</table>";
		this.thead.append(thead);
		
		this.theadTh=this.thead.find("th.h-column");
		this.tbodyTh=this.tbodyHead.find("th.h-column");
		if(!Newtec.Utils.isTrue(this.defaults['showThead']))//隐藏表头
			this.hiddeThead();
		if(true){
			var colnumsArray = this.defaults.colnumsArray
			var rownumsArray = this.defaults.rownumsArray
			setTimeout(function(){
				if(!Newtec.Utils.isNull(colnumsArray)){
					for(var i = 0 ; i < colnumsArray.length ; i++){
						var num = colnumsArray[i]
						rowSpan("#out-table",num)
						rowSpan("#in-table",num)
					}
				}
				if(!Newtec.Utils.isNull(rownumsArray)){
					for(var i = 0 ; i < rownumsArray.length ; i++){
						var num = rownumsArray[i]
						colSpan("#out-table",num)
						colSpan("#in-table",num)
					}
				}
			},50)
		}
	};
	var rowSpan = function(tableId,colnum){
	    var firstTd = "";
	    var currentTd = "";
	    var table_SpanNum = 0;
	    var table_Obj = newtecJQ.find(tableId + " tr th:nth-child(" + colnum + ")");
	    table_Obj.each(function(i){
	        if(i==0){
	            firstTd = $(this);
	            table_SpanNum = 1;
	        }else{
	        	currentTd = $(this);
	            if(firstTd.text()==currentTd.text()){
	                table_SpanNum++;
	                currentTd.hide(); //remove();
	                firstTd.attr("rowSpan",table_SpanNum);
	            }else{
	                firstTd = $(this);
	                table_SpanNum = 1;
	            }
	        }
	    }); 
	};
	function colSpan(tableId,rownum,maxColnum){
	    if(maxColnum == void 0){maxColnum=0;}
	    var firstTd = "";
	    var currentTd = "";
	    var table_SpanNum = 0;
	    $(tableId + " tr:nth-child(" + rownum + ")").each(function(i){
	        var table_Obj = $(this).children();
	        table_Obj.each(function(i){
	            if(i==0){
	                firstTd = $(this);
	                table_SpanNum = 1;
	            }else if((maxColnum>0)&&(i>maxColnum)){
	                return "";
	            }else{
	                currentTd = $(this);
	                if(firstTd.text()==currentTd.text()){
	                    table_SpanNum++;
	                    currentTd.hide(); //remove();
	                    firstTd.attr("colSpan",table_SpanNum);
	                }else{
	                    firstTd = $(this);
	                    table_SpanNum = 1;
	                }
	            }
	        });
	    });
	}	
	
	var getFilterTr = function(tableThis,fields){
		if(Newtec.Utils.isNull(fields)){
			return "";
		}
		var trHTML = (tableThis.multSelect==false&&tableThis.defaults.expand==false)?"":"<td class='center' id='c_"+0+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+"</td>";
		var len = fields.length-1;
		var lastName=tableThis.lastName
		for(var col=0;col<=len;col++){
			var field = fields[col];
			var colName = field['name'];
			var hidden =Newtec.Utils.isTrue(field['h'])?'display:none;':'';
			trHTML += "<td id='"+tableThis.getThFilterId(colName)+"' style='"+hidden+/*width+*/"'>"
			+"<input type='text' class='filter-input' maxlength='"+tableThis.defaults.maxLength+"'  name='"+colName+"'/>" +
					"" +(lastName!=colName?"":'<div class="glyphicon glyphicon-filter" id="'+tableThis.getFilterBtnId()+'"></div>' )
					"</td>";
		}
		if(tableThis.isTrBtnFun){
			trHTML+='<td ></td>';
		}
		var filterBtn='<div class="glyphicon glyphicon-filter" id="'+tableThis.getFilterBtnId()+'"></div>'; 
		$(document).on('click','#'+tableThis.getFilterBtnId(),function(){
			var inputs=$("#"+tableThis.getTrFilterId()+' input');
			var data={};
			for ( var i = 0; i < inputs.length; i++) {
				var input=$(inputs[i]);
				var value=input.val();
				if (!Newtec.Utils.isNull(value)) {
					data[input.attr('name')] = value.replace(/\s*/g,"");
				}
			}
			tableThis.fetchData({data:data},true);
		});
		return trHTML;
	};
	/**
	 * 更多功能
	 */
	Newtec.Table.prototype.getMoreDiv=function(){
		this.hiddeMoreBtnId=this.id+"_hiddeMoreBtnId";
		var tableThis=this;
		var btnDiv=$("<div style='"+this.showMoreDivStyle+"border-top: 1px solid #9c9A9A;margin-left:3px;width:20px;float:left;' class='myborder'>"+
				"<span id='"+this.hiddeMoreBtnId+"' class='btn-default center' style='height:38px;width:20px;background-color:#e8ebf3;color: #707070;"
				+"display: block;font-weight: 700;padding:8px;cursor:pointer'>></span></div>");
		$(document).on('click','#'+this.hiddeMoreBtnId,function(){
			tableThis.showMoreDiv.css("display","none");
		});
		this.moreContent=$("<div style='"+this.showMoreDivStyle+"width:100%;height:300px;background-color:#e8ebf3;border-top: 1px solid #9c9A9A;margin: 0 0 0 23px;' >455</div>");
		return $("<div style='position:absolute;min-height:50px;right:0;top:0;display:none; z-index: 200;overflow:hidden;width:"+this.showMoreDivWidth+"px;padding-bottom:3px '></div>")
		.append(btnDiv).append(this.moreContent);
	};
	/**
	 * 表头收起按钮触发事件
	 */
	Newtec.Table.prototype.tableHeaderShowBtnClick=function(JQ){
		var obj=$(JQ);
		var title=obj.attr("title");
		var path=this.defaults['src']+'/images/table';
		if (title=='收起') {
			this.fetchFormJQ.css({'height':1,opacity:0,overflow:'hidden'})
			obj.attr('title','展开');
			obj.find('img').attr('src',path+"/chevron-up1.png");
		}else if(title=='展开'){
			var fetchFormJQ=this.fetchFormJQ;
			fetchFormJQ.css({'height':"",overflow:''})
			obj.attr('title','收起');
			obj.find('img').attr('src',path+"/chevron-down1.png");
			
			setTimeout(function(){
				fetchFormJQ.css({'opacity':""})
			},100);
		}
	};
	/**
	 * 功能说明：更新标题
	 * @param {Object} name
	 * @param {Object} title
	 */
	Newtec.Table.prototype.updateTitle=function(name,title){
		var fields=this.fields;
		for(var i=0;i<fields.length;i++){
			if(fields[i].name==name){
				fields[i].title=title;
				$("#"+this.getThtdId(name)).text(title);
				break;
			}
		}
	}
	Newtec.Table.prototype.showThead = function(names){
		if(Newtec.Utils.isNull(names)){//显示整个表头
			Newtec.Window.createHint({html:'<span>参数为空！<span>'});
			return;
		}
		var thWs=0;
		if(Newtec.Utils.isArray(names)){
			for(var i=0;i<names.length;i++){
				var name = names[i];
				$("#"+this.getThFilterId(name)).css('display','');
				var th=$("#"+this.getThtdId(name));
				th.css('display','');
				var thW=th.outerWidth()<=0?150:th.outerWidth();
				thWs+=thW;
				var len = this.pageDatas.length;
				for(var row=0;row<len;row++){
					$("#"+this.getTdId(row,name)).css('display','');
				}
			}
		}else if(Newtec.Utils.isString(names)){
			$("#"+this.getThFilterId(names)).css('display','none');
			var th=$("#"+this.getThtdId(names));
			th.css('display','');
			var thW=th.outerWidth()<=0?150:th.outerWidth();//假如没有列宽，则设置150px
			thWs=thW;
			var len = this.pageDatas.length;
			for(var row=0;row<len;row++){
				$("#"+this.getTdId(row,names)).css('display','');
			}
		}
		var width=this.tbodyDiv.width()+thWs;
		this.tbodyDiv.css('width',width+"px");
		this.thead.css('width',width+"px");
		this.table.find('.mCustomScrollBox .mCSB_container').css('width',width+"px");
		_RemCustomScrollbar(this);
		this.setFieldsValue(names, "table-hidden", "false");
		this.first=false;
		_setTdWidth(this);
	};
	Newtec.Table.prototype.hideLastBtn = function(names){
		if(!this.isTrBtnFun)return;
		this.isTrBtnFun=false;
		this.closeLastBtn=true;
		this.newtecJQ.find("table>tbody>tr>td.opear-btn").css('display','none')
		this.newtecJQ.find("table>thead>tr>th.opear-btn").css('display','none')
		_setTdWidth(this);
	}
	Newtec.Table.prototype.showLastBtn = function(names){
		if(!this.closeLastBtn)return;
		this.closeLastBtn=false;
		this.isTrBtnFun=true;
		this.newtecJQ.find("table>tbody>tr>td.opear-btn").css('display','')
		this.newtecJQ.find("table>thead>tr>th.opear-btn").css('display','')
		_setTdWidth(this);
	}
	Newtec.Table.prototype.hideThead = function(names){
		if(Newtec.Utils.isNull(names)){//隐藏列
			Newtec.Window.createHint({html:'<span>参数为空！<span>'});
			return;
		}
		var thWs=0;
		if(Newtec.Utils.isArray(names)){
			for(var i=0;i<names.length;i++){
				var name = names[i];
				var th=$("#"+this.getThtdId(name));
				$("#"+this.getThFilterId(name)).css('display','none');
				th.css('display','none');
				thWs+=th.outerWidth();
				var len = this.pageDatas.length;
				for(var row=0;row<len;row++){
					$("#"+this.getTdId(row,name)).css('display','none');
				}
			}
		}else if(Newtec.Utils.isString(names)){
			var th=$("#"+this.getThtdId(names));
			$("#"+this.getThFilterId(names)).css('display','none');
			th.css('display','none');
			thWs=th.outerWidth();
			var len = this.pageDatas.length;
			for(var row=0;row<len;row++){
				$("#"+this.getTdId(row,names)).css('display','none');
			}
		}
		var width=this.tbodyDiv.outerWidth()-thWs;
		width=this.table.width()>width?this.table.outerWidth():width;
		this.tbodyDiv.css('width',width+"px");
		this.thead.css('width',width+"px");
		this.table.find('.mCustomScrollBox .mCSB_container').css('width',width+"px");
		_RemCustomScrollbar(this);
		this.setFieldsValue(names, "table-hidden", "true");
		this.first=false;
		_setTdWidth(this);
	};

	Newtec.Table.prototype.getButtonId=function(btnId){
		return this.id+"_"+btnId;
	};

	/**
	 * @author 王仕通 2016-10-11
	 * 说明：增加按钮
	 */
	Newtec.Table.prototype.addButtons=function(btnParams){
		if(btnParams instanceof Array){
			var len = btnParams.length;
			for(var i=0;i<len;i++){
				var btnParam = btnParams[i];
				this.addButtons(btnParam);
			}
		}else {//单个情况
			var click=btnParams['click'];
			var tableThis=this;
			btnParams['click']=function(){
				if(Newtec.Utils.isFunction(click))
					click(tableThis);
			};
			if(!Newtec.Utils.isNewtec(btnParams) && Newtec.Utils.isJson(btnParams)){//json情况先创建出button
				btnParams = Newtec.Button.create(btnParams);
			}
			var b = Newtec.Utils.appendTo(btnParams,this.tableHeaderBtns);
//			alert(btnParams+"==="+b);
			if(b){
				//设置buttons缓存
				var btnId = btnParams['id'];
				if(btnId != undefined && btnId != ''){
					if(this.buttons==undefined){this.buttons = {};}
					this.buttons[this.getButtonId(btnId)] = btnParams;
				}
			}
		}
	};
	/**
	 * @author 王仕通 2016-10-11 
	 * 说明：删除按钮
	 */
	Newtec.Table.prototype.removeButtons=function(btnIds){
		if(btnIds instanceof Array){
			var len = btnIds.length;
			for(var i=0;i<len;i++){
				this.removeButtons(btnIds[i]);
			}
		}else{
			var btn = this.buttons[this.getButtonId(btnIds)];
			Newtec.Utils.remove(btn);
//			if(Newtec.Utils.isJquery(btn)){
//			btn.remove();
//			}
		}
	};
	Newtec.Table.prototype.getTableId=function(){
		return this.id;
	};
	Newtec.Table.prototype.getTableDivId=function(){
		return this.id+'_div';
	};
	Newtec.Table.prototype.getThId=function(){
		return this.id+'_th';
	};
	Newtec.Table.prototype.getThtdId=function(name){
		return this.id+'_'+name;
	};
	Newtec.Table.prototype.getThbtnId=function(name){
		return this.id+'_btn';
	};
	Newtec.Table.prototype.getThCheckId = function(){
		return this.id+"_c";
	};
	Newtec.Table.prototype.getThCheckName = function(){
		return this.id+"_hcn";
	};
	Newtec.Table.prototype.getTdId=function(row,name){
		return this.id+"_"+name+"_"+row;
	};
	Newtec.Table.prototype.getTrCheckName = function(){
		return this.id+"_rcn";
	};
	Newtec.Table.prototype.trId2TrCheckId = function(trId){
		return trId+"_c";
	};
	Newtec.Table.prototype.trId2Index = function(trId){
		trId=trId.split('_');
		var i=Newtec.Utils.toInt(trId[trId.length-1],0);
		return i;
	};
	Newtec.Table.prototype.trCheckId2TrId = function(checkId){
		var trId=checkId.substring(0,checkId.length-2);
		return trId;
	};
	Newtec.Table.prototype.getTrBtnId = function(row){
		return this.getThbtnId()+"_"+row;
	};
	Newtec.Table.prototype.getTdFirstClass = function(){
		return this.id+"_td_first";
	};
	Newtec.Table.prototype.getThFirstClass = function(){
		return this.id+"_th_first";
	};
	Newtec.Table.prototype.getTrFilterId = function(){
		return this.id+"_tr_filter";
	};
	Newtec.Table.prototype.getThFilterId = function(name){
		return this.getThtdId(name)+'_filter';
	};
	Newtec.Table.prototype.getFilterBtnId = function(){
		return this.id+"_filterBtn";
	};
	Newtec.Table.prototype.getTdId2Name = function(tdId){
		var strs=tdId.split('_');
		var len=strs.length;
		if (len<4) {
			return "";
		}else if(len>4){
			var name=strs[2];
			console.info("===>>>",name)
			for ( var i = 3; i < strs.length-1; i++) {
				name+='_'+strs[i];
			}
			console.info("",name)
			return name;
		}
		return strs[len-2];
	};
	Newtec.Table.prototype.getGroupTeamClass = function(row){
		return this.id+"_groupteam_"+row;
	};
	
	/**
	 * @author 王仕通 2016-10-14 说明：
	 * UI表格增加数据(与服务器无关)
	 * records:往表格填充的新数据
	 * index:插在第index行之前（isAppendData必须为true才有意义）
	 * 空表示插入最后；小于0表示插入第一行之前；
	 */
	Newtec.Table.prototype.addRecords = function(records,index){
		this.setData(records,true,index);
	}; 

	Newtec.Table.prototype.updateRecords = function(records,isAdd){
		console.info("updateRecords==>.",records);
		if(Newtec.Utils.isNull(this.pk)){
			alert("表没设置主键pk不能更新！");
			return ;
		}
		//console.info(this.pageDatas)
		//console.info(records);
		if(Newtec.Utils.isArray(records)){
			var len = records.length;
			for(var i=0;i<len;i++){
				this.updateRecords(records[i]);
			}
		}else{
			var pk=isAdd?this.NEWTEC_TR_ID:this.pk;
			var pkValue = records[pk];
             
			var len = this.pageDatas.length;
			var tdValueHtmlFun=this.defaults['tdValueHtmlFun'];
//			alert(len);
			var isTrBtnFun=this.isTrBtnFun;
			for(var i=0;i<len;i++){
				var data = this.pageDatas[i];
				if(data[pk]==pkValue) {//找到要更新的行
//					data = records;//不能采用直接赋值，直接赋值的话，原来注册事件上的行data将不会拿到新数据
					var trID=data[this.NEWTEC_TR_ID];
					records[this.NEWTEC_TR_ID]=trID;
					for(var key in records){//采用遍历赋值
						data[key] = records[key];
					}
					//alert("这里还需要测试数据不对。。。。。。。。。=="+Newtec.Utils.json2str(records));
//					this.addRecords(records, rowIndex);
//					this.removeRecords(rowIndex);
//					alert(i+"--"+$('#'+this.getTrBtnId(i)).prop("outerHTML"));
					var tr = $("#"+trID);
					var tds=tr.find('td');
					var fields=this.fields;
					var begin=!this.multSelect?0:1;
					for ( var i = 0; i <fields.length; i++) {
						var colName = fields[i]['name'];
						var tdValue = data[colName];
						if(this.isTdValueHtmlFun){
							tdValue = tdValueHtmlFun(tdValue,data,-1,i,colName);
							if(tdValue==undefined) tdValue = "";
						}
						$(tds[i+begin]).html(tdValue);
					}
//					tr.html(getTRHTML(i,data,this));
					this.cleartrEdit(tr);
					console.info("-------");
					isTrBtnFun&&tr.find('td:last-child').remove()&&this.addtrBtn(i,data,tr);
//					trBtnFun
					if(i==0){
						this.tdJQs = $('.'+this.getTdFirstClass());//由于第一行被重新设置html，所以需要重新设置this.tdJQs
						_setTdWidth(this);
					}
					break;
				}
			}
			//console.info(this.pageDatas);
		}
	};

	/**
	 * @author 王仕通 2016-10-17 f
	 * 说明：UI表格删除数据(与服务器无关)
	 * records：数组或单条数据，数据可以是:
	 * 1.行索引
	 * 2.tr的Jquery对象
	 * 3.trId
	 * 4.tr行数据Json对象
	 * 
	 */
	Newtec.Table.prototype.removeRecords = function(records){
		console.info("--removeRecords---",records);
		if(Newtec.Utils.isArray(records)){
			var len = records.length;
			for(var i=0;i<len;i++){
				this.removeRecords(records[i]);
			}
		}else{
			var trJQ=null ;
			var rowIndex =0;
			if(Newtec.Utils.toInt(records,-99) != -99){//数值代表 行索引
				rowIndex = records;
				trJQ = $("#"+this.pageDatas[records][this.NEWTEC_TR_ID]);
			}else if(Newtec.Utils.isJquery(records)){//tr行JQuery对象
				trJQ = records;
				rowIndex = this.getRowIndex(records.attr('id'));
			}else if(Newtec.Utils.isString(records)){//TrId
				trJQ = $("#"+records);
				rowIndex = this.getRowIndex(records);
			}else if(Newtec.Utils.isJson(records)){//数值代表 行索引
				var trId = records[this.NEWTEC_TR_ID];
				trJQ = $("#"+trId);
				rowIndex = this.getRowIndex(trId);
			}
			if(Newtec.Utils.isJquery(trJQ)){
				if(this.isGroupBy){
					var clas=trJQ.attr('class').split(" ");
					for ( var i = 0; i < clas.length; i++) {
						if(clas[i].indexOf('groupteam')>=0){
							clas=clas[i];
							continue;
						}
					}
					var tr=this.table.find('.'+clas);
					if(tr.length==1){
						trJQ.prev().remove();
					}
					
				}
				
				
				trJQ.remove();
				this.pageDatas.splice(rowIndex, 1);
				this.selectRecord=null;
				if(this.defaults.showPagin)
					setTotalpage(this.totalRow-1,this);
			}
			if(rowIndex==0){
			   _setTdWidth(this);
			}
		}
	};
	/**
	 * @author 王仕通 2016-10-18 
	 * 说明：获得行记录
	 * obj: 1.行索引；2.trId,3.行数据pk主键
	 */
	Newtec.Table.prototype.getRowRecord = function(obj){
		if(!isNaN(obj)&&Newtec.Utils.toInt(obj,-99) != -99){//是行索引
			return this.pageDatas[obj];
		}else if(Newtec.Utils.isString(obj)){
			return this.mapToData[obj]
		}else{
			return obj;
		}
	};

	Newtec.Table.prototype.getRowIndex = function(obj){
		if(Newtec.Utils.toInt(obj,-99) != -99){//是行索引
			return obj;
		}else{
			if(Newtec.Utils.isJson(obj)){
				obj = obj[this.NEWTEC_TR_ID];
			}
			var len = this.pageDatas.length;
			for(var i=0;i<len;i++){
				var data = this.pageDatas[i];
				if(data[this.NEWTEC_TR_ID] == obj || data[this.pk]==obj) return i;
			}
		}
	};
	
	Newtec.Table.prototype.getSelectedRecords = function(){
		if(this.multSelect==false){//单选
			var selectRecord=this.selectRecord;
			console.info("selectRecord=="+selectRecord)
			return selectRecord&&$.extend(true,{},selectRecord)||null;
		}
		//多选
		var values = [];
		var tableThis = this;
		this.tbodyDiv.find('tr>td:first-child .check-item.selected').each(function(){
			var id=$(this).parent().parent().attr("id")
			console.info("=====<<<",id,tableThis.mapToData);
			values.push(tableThis.mapToData[id]);
		});
		return values.length>0?$.extend(true,[],values):null;
	};
	Newtec.Table.prototype.selectAll=function(isAll,isCheckAllBtn){
		console.info("isAll===",isAll)
		if (this.tbodyDiv==undefined) return;
		var items=this.tbodyDiv.find('tbody>tr>td:first-child .check-item')
		if(isAll){
			items.addClass("selected");
			this.newtecJQ.find(" thead>tr>th:first-child>.check-item").removeClass("selected1").addClass("selected")
		}else{
			this.newtecJQ.find(" thead>tr>th:first-child>.check-item").removeClass("selected selected1")
			items.removeClass("selected");
		}
		this.setTrColor('','',isAll);
		var change= this.defaults.change;
		if(Newtec.Utils.isFunction(change)){
			change(isAll);
		}
	};
	
	Newtec.Table.prototype.select = function(rowIndexs){
		if(Newtec.Utils.isArray(rowIndexs)){
			var len = rowIndexs.length;
			for(var i=0;i<len;i++){
				this.select(rowIndexs[i]);
			}
		}else{
			var row = this.getRowIndex(rowIndexs);
			var data=this.getRowRecord(row);
			this.selectByTRId(data[this.NEWTEC_TR_ID],data);
		}
	};
	Newtec.Table.prototype.selectByData= function(datas){
		
		if (Newtec.Utils.isArray(datas)) {
			for ( var i = 0; i < datas.length; i++) {
				var data=datas[i];
				this.selectByData(data);
			}
		}else{
			var pageDatas=this.pageDatas;
			for ( var i = 0; i < pageDatas.length; i++) {
				var d=pageDatas[i];
				if(d.id==datas.id){
					this.selectByTRId(d[this.NEWTEC_TR_ID],true,d);
					break;
				}
			}
		}
	};
	/**
	 * trId:
	 * isTrue:true为选中，false取消选中
	 */
	Newtec.Table.prototype.selectByTRId=function(trId,isTrue,data){
		var that = this
		if(Newtec.Utils.isNull(trId))return;
		var multSelect=this.multSelect;
		isTrue=Newtec.Utils.isNull(isTrue)?true:isTrue;
		if(isTrue){
			if(multSelect==false){
				if (!Newtec.Utils.isNull(this.selectRecord)) {
					if(this.isDouble){
						this.setTrColor("","")
					}else{
						this.setTrColor("",this.selectRecord[this.NEWTEC_TR_ID]);
					}
				}
				data=data==undefined?this.getRowRecord(trId):data;
				this.selectRecord=data;
			}
			this.setTrColor(trId);
		}else{
			$("#"+this.getThCheckId()).prop('checked', false);
			if(this.multSelect==false&&this.selectRecord==data)
				this.selectRecord="";
			this.setTrColor('',trId);
		}
		isTrue&&this.newtecJQ.find("#"+trId+">td>.check-item").addClass("selected")||$("#"+this.trId2TrCheckId(trId)).removeClass("selected")
		this.isAllSelct();
		if(this.isGroupBy)
			this.isGroupSelct(trId);
		var change=this.defaults.change;
		if(Newtec.Utils.isFunction(change))
			change(isTrue,data,trId);
	};
	Newtec.Table.prototype.isGroupSelct = function(trId){
		
		var clas=$("#"+trId).attr('class').split(" ");
		for ( var i = 0; i < clas.length; i++) {
			if(clas[i].indexOf("groupteam")>=0)
				clas=clas[i];
		}
		var inputs=this.tbodyDiv.find('table>tbody>tr.'+clas+'>td:first-child .check-item');
		if(inputs.length==inputs.filter(".selected").length)
			$('#'+clas).prop('checked', true);
		else
			$('#'+clas).prop('checked', false);
	};
	Newtec.Table.prototype.isAllSelct = function(){
		var pageDatas=this.pageDatas;
		if (this.tbodyDiv!=undefined&&pageDatas&&pageDatas.length>0) {
			var inputChkecked=this.tbodyDiv.find('table>tbody>tr.'+childRowClass+'>td:first-child .check-item.selected');
			if (inputChkecked.length==this.pageDatas.length) {
				this.newtecJQ.find(" thead>tr>th:first-child>.check-item").removeClass('selected1').addClass("selected")
				return true;
			}else if(inputChkecked.length>0){//选一部分
				this.newtecJQ.find(" thead>tr>th:first-child>.check-item").removeClass('selected').addClass("selected1")
				return false;
			}else{
				this.newtecJQ.find(" thead>tr>th:first-child>.check-item").removeClass("selected selected1")
				return false;
			}
		}
	};
	Newtec.Table.prototype.deselect = function(rowIndexs){
		if(Newtec.Utils.isArray(rowIndexs)){
			var len = rowIndexs.length;
			for(var i=0;i<len;i++){
				this.deselect(rowIndexs[i]);
			}
		}else{
			var row = this.getRowIndex(rowIndexs);
			var data=this.getRowRecord(row);
			this.selectByTRId(data[this.NEWTEC_TR_ID],false,data);
		}
	};
	Newtec.Table.prototype.deselectByData= function(datas){
		if (Newtec.Utils.isArray(datas)) {
			for ( var i = 0; i < datas.length; i++) {
				this.deselectByData(datas[i]);
			}
		}else{
			var pageDatas=this.pageDatas;
			for ( var i = 0; i < pageDatas.length; i++) {
				var d=pageDatas[i];
				if(d.id==datas.id){
					this.selectByTRId(d[this.NEWTEC_TR_ID],false,d);
					break;
				}
			}
		}
		
	};

	/**
	 * @author 王仕通 2016-10-18 说明：外部调用增加单击事件
	 */
	Newtec.Table.prototype.setClickRecord = function(handlerFun){
		this.clickRecord = handlerFun;
	};
	/**
	 * @author 王仕通 2016-10-18 说明：外部调用增加双击事件
	 */
	Newtec.Table.prototype.setDbclickRecord = function(handlerFun){
		this.dbclickRecord = handlerFun;
//		alert('dbclickRecord='+Newtec.Utils.isFunction(this.dbclickRecord));
	};
	var getTdBtnJQ = function(btn){
		var btnJQ = btn['newtecJQ'];
		if(btnJQ==undefined){
			btnJQ = Newtec.Button.create(btn);
			btnJQ.setClickBeforeFun(function(){
				canClick = false;
			});
			btnJQ = btnJQ['newtecJQ'];
		}else{
			btnJQ.setClickBeforeFun(function(){
				clikChecke = false;
			});
		}
		return btnJQ;
	};
	var recordHandler = function(datas,oldPageSize,tableThis){
		var len = datas.length;
		for(var i=0;i<len;i++){//这边注意数据更新后是否有效
			(function(i){
				var data = datas[i];
				var tr = $("#"+data[tableThis.NEWTEC_TR_ID]);
				tableThis.addtrBtn(oldPageSize+i,data,tr);
			})(i);
		}
	};

	/**
	 * setColorTr:需要设置颜色的tr对象
	 * color：颜色
	 * canColorTr：需求取消颜色的tr对象
	 * setAll：true：背景颜色全选
	 */
	Newtec.Table.prototype.setTrColor=function(setColorTrId,canColorTrId,setAll){
//		selected
		var selectTrs=this.selectTrs==undefined?this.selectTrs={}:this.selectTrs;
		
    	if (!Newtec.Utils.isNull(canColorTrId)) {
    		var tr=$('#'+canColorTrId);
    		tr.removeClass(this.selectedClss);
		}
    	if (!Newtec.Utils.isNull(setColorTrId)) {
    		var tr=$('#'+setColorTrId);
    		tr.addClass(this.selectedClss);
    	}
    	if (!Newtec.Utils.isNull(setAll)) {
    		var trs=this.tbodyDiv.find('tr.'+childRowClass);
    		if (setAll) {
    			trs.addClass(this.selectedClss);
			}else{
				trs.removeClass(this.selectedClss);
			}
    	}
    };
    var getTrCheckId=function(trId){
    	return trId+"_c";
    };
    var getTRHTMLGroup = function(rowIndex,content,tableThis,trId){
		var trHTML ="<td class='center' id='c_"+0+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+"<span class='check-item' id='"+getTrCheckId(trId,rowIndex)+"' name='"+tableThis.getTrCheckName()+"' value='"+data[tableThis.NEWTEC_TR_ID]+"'>"	
				+"<img src='"+serverUrl+"myqdp/images/table/content_btn_selection.png'/>"
				+"</span>"
				+"</td>";
		var fields = tableThis.fields;
		var len =  (tableThis.multSelect==false||tableThis.defaults.expand)?fields.length-1:fields.length;
		var isAdd=false;
		var className = rowIndex==0? "class='"+tableThis.getTdFirstClass()+"'": "";
			
		for(var col=0;col<len;col++){
			var field = fields[col];
			var hidden ="";
			
			if(Newtec.Utils.isTrue(field['h'])){
				hidden='  display:none; ';
			}else{
				isAdd=true;
				
			}
			trHTML += "<td "+className+"  style='"+hidden+/*width+*/"'>"+content+"</td>";
            if(isAdd){
            	content='';
			}
		}
		return trHTML;
	};
	var getTRHTML = function(rowIndex,data,tableThis,trId){
		var trHTML = (tableThis.multSelect==false)?"":"<td class='center' id='c_"+0+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+"<span class='check-item' id='"+getTrCheckId(trId,rowIndex)+"' name='"+tableThis.getTrCheckName()+"' value='"+data[tableThis.NEWTEC_TR_ID]+"'>"	
				+"<img src='"+serverUrl+"myqdp/images/table/content_btn_selection.png'/>"
				+"</span>"
				+"</td>";
		trHTML = (tableThis.defaults.expand==false)?trHTML:"<td class='center expendTd'  id='"+data.id+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+'<i class="glyphicon glyphicon-plus">'
				+"</td>";
		var fields = tableThis.fields;
		var len = fields.length;
		var tdValueHtmlFun=tableThis.defaults['tdValueHtmlFun'];
		var className = rowIndex==0?tableThis.getTdFirstClass(): "",fixed=false;
		
		if(tableThis.defaults.fixed){
			className+=" nowrap";fixed=true;
		}
		var cellColorColumnName = tableThis.defaults.cellColorColumnName, rowColors = cellColorColumnName ? data[cellColorColumnName]: null;
		for(var col=0;col<len;col++){
			var field = fields[col];
			var colName = field['name'];
			var tdValue = data[colName];
			if(tdValue==undefined)tdValue = "";
			var valueHtml = tdValue,title='';
			
			//这里要进行有下拉列表列的数据转-
			if(tableThis.isTdValueHtmlFun){
				valueHtml = tdValueHtmlFun(valueHtml,data,rowIndex,col,colName);
				if(valueHtml==undefined) valueHtml = "";
			}
			var hidden = Newtec.Utils.isTrue(field['h'])?'  display:none; ':'';
			if(fixed)title="title='"+valueHtml+"'";
			
			var colorStyle = rowColors && rowColors[colName] ? ';background-color: ' + rowColors[colName] : '';

			trHTML += "<td class='"+className+"' "+title+" id='"+tableThis.getTdId(rowIndex,colName)+"' style='"+hidden+/*width+*/ colorStyle + "'>"+valueHtml+"</td>";
		}
		return trHTML;
	};
	
	var getTRHTMLRowspan = function(rowIndex,data,tableThis,isStart,mapTagNum,maptagValue,trId){
		var trHTML = (tableThis.multSelect==false)?"":"<td class='center' id='c_"+0+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+"<span class='check-item' id='"+getTrCheckId(trId,rowIndex)+"' name='"+tableThis.getTrCheckName()+"' value='"+data[tableThis.NEWTEC_TR_ID]+"'>"	
				+"<img src='"+serverUrl+"myqdp/images/table/content_btn_selection.png'/>"
				+"</span>"
				+"</td>";
		trHTML = (tableThis.defaults.expand==false)?trHTML:"<td class='center expendTd'  id='"+data.id+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+'<i class="glyphicon glyphicon-plus">'
				+"</td>";
		var fields = tableThis.fields;
		var len = fields.length;
		var tdValueHtmlFun=tableThis.defaults['tdValueHtmlFun'];
		var tdRowNumFun=tableThis.defaults['tdRowNumFun'];
		var className = rowIndex==0?tableThis.getTdFirstClass(): "",fixed=false;
		
		if(tableThis.defaults.fixed){
			className+=" nowrap";fixed=true;
		}
		var rowspanStyle=tableThis.defaults.rowspanStyle;
		for(var col=0;col<len;col++){
			var field = fields[col];
			var colName = field['name'];
			var tdValue = data[colName];
			var isRowspanName=mapTagNum[colName];
			var rowNum=1;
			if(isRowspanName){//是合并列
				if(maptagValue[colName]===tdValue){//跟前一列值相等
					continue;
				}
				maptagValue[colName]=tdValue;
				rowNum=isRowspanName.shift();
			}
			if(tdValue==undefined)tdValue = "";
			var valueHtml = tdValue,title='';
			//这里要进行有下拉列表列的数据转-
			if(tableThis.isTdValueHtmlFun){
				valueHtml = tdValueHtmlFun(valueHtml,data,rowIndex,col,colName,isStart,isRowspanName);
				if(valueHtml==undefined) valueHtml = "";
			}
			var rowNum1=Newtec.Utils.isFunction(tdRowNumFun)&&tdRowNumFun(valueHtml,data,rowIndex,col,colName,isStart,rowNum)||-1;
			console.info(rowNum1+'--------rowNum--->>>'+rowNum+"==colName=="+colName);
			if(rowNum1<-1)continue;
			isRowspanName=isRowspanName||rowNum1>-1;
			var hidden = Newtec.Utils.isTrue(field['h'])?'  display:none; ':'';
			if(fixed)title="title='"+valueHtml+"'";
			trHTML += "<td class='"+className+"' "+(isRowspanName?("rowspan="+((rowNum1>-1&&rowNum1)||rowNum)):"")+" "+title+" id='"+tableThis.getTdId(rowIndex,colName)+"' style='"+hidden+/*width+*/" "+(isRowspanName?rowspanStyle:"")+"'>"+valueHtml+"</td>";
		}
		return trHTML;
	};
	Newtec.Table.prototype.addtrBtn =function(row,data,tr){
		if(this.isTrBtnFun==false) return ;
//		var tdStyle=this.tdStyle;
//		tdStyle+=row==0&&!this.isGroupBy?'border-top:0 !important;':'';
		var td = $("<td id='"+this.getTrBtnId(row)+"'  class='opear-btn'></td>");
		var btn = this.defaults["trBtnFun"](row,data,tr,td);
		if(Newtec.Utils.isNull(btn)) btn="" ;
		if(this.defaults.trBtnLast){
			Newtec.Utils.appendTo(td,tr);//最后一列的按钮
		}else{
			if(this.defaults.multSelect){
				var targetEle = tr.find("td:nth-child(2)")
				tr[0].insertBefore(td[0],targetEle[0]);
			}else{
				var targetEle = tr.find("td:first-child")
				tr[0].insertBefore(td[0],targetEle[0]);
			}
		}
		if(Newtec.Utils.isString(btn)){
			btn = $(btn);
			td.append(btn);
			btn.click(function(){canClick = false;});
		}else if(Newtec.Utils.isArray(btn)){
			var len = btn['length'];
			if(len>0){
				for(var bb=0;bb<len;bb++){
					td.append(getTdBtnJQ(btn[bb]));
				}
			}else{
				td.append(getTdBtnJQ(btn));
			}
		}else if(Newtec.Utils.isJquery(btn)){
			td.append(btn);
		}
	};
	Newtec.Table.prototype.setFieldsValue=function(names,attr,value){
		if(Newtec.Utils.isNull(names)||Newtec.Utils.isNull(attr)||Newtec.Utils.isNull(value)){
			Newtec.Window.createHint({html:'<span>参数为空！<span>'});
			return;
		}
		var fields = this.fields;
		if(Newtec.Utils.isArray(names)){
			var index=0;
			var len=names.length;
			for(var i=0;i<fields.length;i++){
				var f=fields[i];
				if(f.name==names[index]){
					f[attr]=value;
					index++;
					if(index==len)return;
				}
			}

		}else if(Newtec.Utils.isString(names)){
			for(var i=0;i<fields.length;i++){
				var f=fields[i];
				if(f.name==names){
					f[attr]=value;
					return;
				}
			}
		}

	};
	Newtec.Table.prototype.setNullData=function(isAppendData,isLast,index,defData){
		var fields=this.fields;
		isAppendData=isAppendData===false?false:true;
		var data=defData||{};
		for ( var i = 0; i < fields.length; i++) {
			data[fields[i]['name']]='';
		}
		if(isLast){
			index=this.pageDatas==undefined||this.pageDatas.length==0?0:this.pageDatas.length;
		}else{
			index=index==undefined?-1:index;
		}
		this.setData(data,isAppendData,index);
		this.selectByTRId(data['newtecTRId'],true,data);
		this.toCanEdit(data);
		var that=this;
		_setTdWidth(that,true);
		
	};
	Newtec.Table.prototype.empty=function(){
		if(this.defaults.showPagin){
			setToPage(1,this);
			setTotalpage(0,this);
			this.currentPage=1;
			//console.info("---this.toPage---",this.toPage);
			
			this.toPage.val(1);
		}
		this.setData([]);
	};
	
	/**
	 * 功能说明：获取数据列标记id
	 * @param {Object} data 数据
	 */
	Newtec.Table.prototype.getTdTagId=function(data){
		var id=Newtec.Utils.uuid16()
		this.mapToData[id]=data;
		return id;
	}

	/**
	 * @author 王仕通 2016-10-14 说明：
	 * 表格设置数据
	 * datas:往表格填充的新数据
	 * isAppendData：默认值为
	 * true:表示保留原来的旧数据，新的数据追加；
	 * 其余值:删掉旧的数据，只设置新的数据（默认情况）
	 * index:插在第index行之前（isAppendData必须为true才有意义）
	 * 空表示插入最后；小于0表示插入第一行之前；
	 */
	Newtec.Table.prototype.setData=function(datas,isAppendData,index,noSetTotalPage){
//		alert(index+"设置数据："+datas.length);
		var def=this.defaults;
		this.selectRecord=null;
		var setDataBefore = def['setDataBefore'];
		if(Newtec.Utils.isFunction(setDataBefore)){
			var newData=setDataBefore(this,datas,isAppendData,index,noSetTotalPage);
			if(!Newtec.Utils.isNull(newData)&&Newtec.Utils.isArray(newData))datas=newData;
		}
		
//		if(Newtec.Utils.isNull(datas))return;
		var tableThis = this;	
		//	alert(Newtec.Utils.isArray(datas)+'1---'+Newtec.Utils.isJson(datas));
		var createTbody = function(){
//			alert(Newtec.Utils.isJson(datas)+'s2'+Newtec.Utils.isArray(datas));
			if(Newtec.Utils.isJson(datas)){
				datas = [datas];
			}else if(!Newtec.Utils.isArray(datas)){
				return ;
			}
			
			var count =tLen= datas.length;
			if(count==0){
				tableThis.showEmptyTitle(true);
				if(!isAppendData){
					tableThis.tbody&&tableThis.tbody.empty();
					tableThis.pageDatas=[];
					tableThis.datas=[];
					tableThis.mapToData={};
				}
				
				return;
			}else{
				tableThis.showEmptyTitle(false);
			}
			var pageDatas=tableThis.pageDatas;
			var tr = "";
			var NEWTEC_TR_ID = tableThis.NEWTEC_TR_ID;
			var cPageSize = 0;
			var preRowMax=0;
			if(Newtec.Utils.isTrue(isAppendData) && !Newtec.Utils.isNull(tableThis.tbody)){//追加数据
				cPageSize = Newtec.Utils.isNull(tableThis.pageDatas)?0:tableThis.pageDatas.length;
				preRowMax=tableThis.preRowMax+=count;
			}else{
				tableThis.preRowMax=count;
			}
			//alert(count+'=content='+datas);
			var borderRight='border-right:1px;';
			var groupBy=tableThis.defaults['groupBy'];
			var tag="";
			var isGroupBy=false;
			var groupClass=tableThis.getGroupTeamClass(0);
			if(!Newtec.Utils.isNull(groupBy)&&datas.length!=0){
				tag=datas[0][groupBy];
				datas=sortArray(groupBy,datas);
				if(Newtec.Utils.isNull(tag)){
					//console.error('不可分组，数据不含有《'+groupBy+'》属性！');
				}else{
					tableThis.isGroupBy=isGroupBy=true;
					tr+="<tr class='group_row'  style='"+borderRight+";'>" +
					getTRHTMLGroup(0,tag,tableThis);
					+"</tr>";
				}
			}
			if(isGroupBy){
				for(var row=0;row<count;row++){
					var newRow = row+preRowMax;
					var data = datas[row];
					var newtecTRId=tableThis.getTdTagId(data)
					data[tableThis.NEWTEC_TR_ID]=newtecTRId;
					if (row==count-1) {
						borderRight='border-right:0;';
					}
					if(tag!=data[groupBy]){
						tag=data[groupBy];
						groupClass=tableThis.getGroupTeamClass(row);
						tr+="<tr class='group_row' style='"+borderRight+";'>" +
						getTRHTMLGroup(row,tag,tableThis);
						+"</tr>";
					}
					tr+="<tr class='"+childRowClass+" "+groupClass+"' id='"+newtecTRId+"' style='"+borderRight+"'>" 
					+getTRHTML(newRow,data,tableThis,isGroupBy,newtecTRId);
					+"</tr>";
//				alert(alert('isTrBtnFun=='+isTrBtnFun));
				}
			}else if(tableThis.isRowspan){
				
				var rowspanName=def.rowspan, rowspanFiled=rowspanName[0],
				tag=null,tagNum=0,mapTagNum={};
				var rowspanLen=rowspanName.length;
				for(var i=0;i<rowspanName.length;i++){
					var rowspanF=rowspanName[i];
					mapTagNum[rowspanF]=[];
				}
				var maptagValue={};
				for(var i=0,len=datas.length;i<len;i++){
					var data=datas[i];
					var firstTag=data[rowspanFiled]//首行标记
					var rowspan=mapTagNum[rowspanFiled];
					var start=false;
					if(tag==data[rowspanFiled]){
						rowspan[rowspan.length-1]=rowspan[rowspan.length-1]+1;
					}else{
						tag=data[rowspanFiled];
						rowspan.push(1);
						start=true;
					}
					if(rowspanLen>1){
						for(var j=1;j<rowspanLen;j++){
							var rowspanF=rowspanName[j]
							rowspan=mapTagNum[rowspanF]
							if(!start&&maptagValue[rowspanF]==data[rowspanF]){//首行是否为重新开始，如果是重新开始，不是比较上一次的值
								rowspan[rowspan.length-1]=rowspan[rowspan.length-1]+1;
							}else{
								maptagValue[rowspanF]=data[rowspanF];
								rowspan.push(1);
							}
						}
					}
					
					
				}
				tag=null,isStart=true;
				maptagValue={};
				for(var row=0;row<count;row++){
					// debugger;
					var newRow = row+preRowMax;
					var data = datas[row];
					var newtecTRId=tableThis.getTdTagId(data)
					data[tableThis.NEWTEC_TR_ID]=newtecTRId;
					if (row==count-1) {
						borderRight='border-right:0;';
					}
					isStart=!(tag==data[rowspanFiled]);//首行开始
					if(isStart){
						tag=data[rowspanFiled];
						maptagValue={}
						for(var i=0;i<rowspanLen;i++){
							maptagValue[rowspanName[i]]={};
						}
					}
					tr+="<tr class='"+childRowClass+"' id='"+newtecTRId+"' style='"+borderRight+"'>" 
					+getTRHTMLRowspan(newRow,data,tableThis,isStart,mapTagNum,maptagValue,newtecTRId);
					+"</tr>";
//				alert(alert('isTrBtnFun=='+isTrBtnFun));
				}
			} else{
				for(var row=0;row<count;row++){
					var newRow = row+preRowMax;
					var data = datas[row];
					var newtecTRId=tableThis.getTdTagId(data)
					data[tableThis.NEWTEC_TR_ID]=newtecTRId;
					if (row==count-1) {
						borderRight='border-right:0;';
					}
					tr+="<tr class='"+childRowClass+"' id='"+newtecTRId+"' style='"+borderRight+"'>" 
					+getTRHTML(newRow,data,tableThis,newtecTRId);
					+"</tr>";
//				alert(alert('isTrBtnFun=='+isTrBtnFun));
				}
			}
			var pageDatas=tableThis.pageDatas;
			if(pageDatas!=undefined&&pageDatas.length!=0&&Newtec.Utils.isTrue(isAppendData) && !Newtec.Utils.isNull(tableThis.tbody)){//追加数据
				var after = "after";//标记追加在所有的tr最后
				index = Newtec.Utils.toInt(index,after);
				if(index==after){//进入标记
					Newtec.Utils.appendTo($(tr),tableThis.tbody);
					tableThis.pageDatas.pushs(datas);
//					alert("1=="+tableThis.pageDatas.length);
				}else if(index<0){//加在最开始一个tr之前
					tableThis.tbody.prepend(tr); 
					tableThis.pageDatas.insert(datas,0);
//					alert("2=="+tableThis.pageDatas.length);
				}else{
					index = (index>=cPageSize)? cPageSize-1 : index;
					index = (index<0)?0:index;
					tableThis.tbody.append(tr); 
					tableThis.pageDatas.insert(datas,index+1);
				}
				count = count + (tableThis.totalRow<0?0:tableThis.totalRow);
			}else{//替换数据
				tableThis.tbody.html(tr);
				tableThis.tdJQs = $('.'+tableThis.getTdFirstClass());
				tableThis.pageDatas = datas;
				
			}
			tableThis.datas = tableThis.pageDatas;//这里还要考虑怎么设置 有分页和没分页情况
			if(!Newtec.Utils.isTrue(noSetTotalPage)&&tableThis.defaults.showPagin){
				setTotalpage(count,tableThis);
			}
			//事件处理
			recordHandler(datas,cPageSize,tableThis);
		};
		createTbody();
		var setDataAfter = this.defaults['setDataAfter'];
		if(Newtec.Utils.isFunction(setDataAfter)){
			setDataAfter(this,datas,isAppendData,index,noSetTotalPage);
		}
		_setTdWidth(this);
		this.isAllSelct();
	};
	/**
	 * 渲染完成调用
	 */
	Newtec.Table.prototype.romancefinish=function(calFun){
		if (Newtec.Utils.isFunction(this.romanceFun)) {
			this.romanceFun();
		}
	};
	var registeFunction=function(tableThis){
		console.info(":---registeFunction-<<<")
		tableThis.table.on('mousedown','div.colResizable',function(event){
			tableThis.noReWidth=true;
			var JQ=$(this);
			var data=JQ.attr('data');
			var strs=data.split('_');
			var name=strs[strs.length-1];
			var lastOne=false;
			var th=JQ.parent();
			var bTh=tableThis.tbodyHead.find("#"+th.attr("id"));
			console.info("====",th[0],bTh[0]);
			if (name=='lastOne') {
				lastOne=true;
				name=strs[strs.length-2];
				for ( var i = 0; i < strs.length-1; i++) {
					data+=i==0?strs[i]:"_"+strs[i];
				}
			}
			//console.info("lastOne:"+lastOne);
			var originX=event.clientX;
			var originW=lastOne&&tableThis.trBtnShow?tableThis.defaults['trBtnWidth']:th.outerWidth();
			var originBodyW=tableThis.tbodyDiv.width();
			var originCanWidth=tableThis.canWidth;
			var scrollLeft=tableThis.table.scrollLeft();
            tableThis.tableDiv.on('mousemove',function(event){
				 if(!tableThis.noReWidth)return;
            	 var xx = event.clientX;
            	 var yd= xx-originX;//鼠标拖拽的距离
            	 tableThis.yd=yd;
            	 $(this).css('cursor','e-resize');
            	 var width=originW+yd;
//            	 console.info("originW:"+originW+"==yd:"+yd+"=width:"+width);
            	 tableThis.table.addClass('user-select');
            	 if(!Newtec.Utils.isNull(tableThis.defaults.doubleChange)){
            		 tableThis.defaults.doubleChange(tableThis);
            	 }
            	 if (width>37){//宽度小于37则返回
            		 if (!lastOne) {
            			 $("#"+data).css('width',width+"px");
            			 $("#"+data+'_0').css('width',width+"px");
					 }else if(tableThis.trBtnShow){
						 if (yd>0) {
							 width+=tableThis.canWidth;
							 tableThis.canWidth=0;
						 }
						 tableThis.defaults['trBtnWidth']=width;
					 }else{
						 width+=tableThis.canWidth;
						 tableThis.canWidth=0;
					 }
            		 
            		 var bodyW=originBodyW+yd;
//          		     //console.info("-table.width=="+tableThis.table.width()+"--=bodyW:"+bodyW);
            		 if (tableThis.table.width()>bodyW) {
            			 if (!lastOne) 
            				 tableThis.canWidth=originCanWidth+(tableThis.table.width()-bodyW);//将设置给最后一列多余的宽度存起来
            			 bodyW=tableThis.table.width();
					 }
            		 tableThis.bodyW=bodyW;
//            		 //console.info(tableThis.canWidth+"---<<>>>>>--"+yd);
            		 if (yd>0) {//列宽变大,假如canWidth大于拖拽的大小，则无需调整表头表身宽度
            			 tableThis.draftSm=false;
            			if(tableThis.canWidth>yd)return;
            			 bodyW-=tableThis.canWidth;
            			 tableThis.thead.css('width',bodyW+"px");
            			 tableThis.tbodyDiv.css('width',bodyW+"px");
            			 tableThis.table.find('.mCustomScrollBox .mCSB_container:first-child').css('width',(bodyW)+"px");
            		 }else if(yd<0){//列宽变小，拖拽结束后再调整表格整体宽度
            			 tableThis.thead.css('width',bodyW+"px");
            			 tableThis.draftSm=true;
            		 }
            		 th.css('width',width);
//            		 bTh.css('width',width);
//          		 _setTdWidth(tableThis)
            		 if (tableThis.trBtnShow||!lastOne) {
            			 tableThis.setFieldsValue(strs[strs.length-1],'width',width);
					 }
            		 return false;
            	 }
            });
		});
		$(document).on('mouseup mouseleave',function(event){
			unBind(tableThis);
		});
		var unBind=function(tableThis){//取消鼠标拖动事件
			if(!tableThis.noReWidth)return;
			tableThis.noReWidth=false;
			tableThis.tableDiv.unbind('mousemove');
			 tableThis.table.removeClass('user-select');
			tableThis.table.find('div.colResizable').unbind('mousedown');
			tableThis.tableDiv.css('cursor','default');
			if(tableThis.draftSm){
				tableThis.tbodyDiv.css('width',tableThis.bodyW+"px");
				tableThis.table.find('.mCustomScrollBox .mCSB_container').css('width',(tableThis.bodyW)+"px");
			}else{
				tableThis.canWidth=tableThis.canWidth-tableThis.yd>0?tableThis.canWidth-tableThis.yd:0;
			}
			_setTdWidth(tableThis);
    		_RemCustomScrollbar(tableThis);
		};
	};
	/**
	 * 功能：设置可以拖拽
	 */
	var _colResizable=function(tableThis){
		var ths="";
		tableThis.canWidth=0;//记录没有调整过列宽而给最后一列添加宽度的宽度值
//		tableThis.table.css('width',"100%");
		if(tableThis.thead==undefined)return;
		ths=tableThis.thead.find('thead>tr:first-child>th');//获取所有可见的th
		var tableBodyDiv=tableThis.table;
		var height=tableBodyDiv.height()+50;
		if (ths[0]==undefined) return;
		var data="";//存放上一个th的id
		var start=0;
		var title='';
		for ( var i = start,len= ths.length; i < len; i++) {
			var th=$(ths[i]);
			data=th.attr('id');
			if(tableThis.showMoreBtn){
				if (i==len-2) {
					data=data+"_lastOne";
					title='title="可拖拽"';
				}
				if (i==len-1)continue;
			}else if(i==len-1){
				data=data+"_lastOne";
				title='title="可拖拽"';
				right=th.outerWidth()/2;
			}
			var colResizable=$('<div class="colResizable" '+title+' name="'+(i-start)+'" data="'+data+'"></div>');
			th.append(colResizable);
			th.css('position','relative');
		}
		
	};
	/**
	 * 重新产生滚动条
	 */
    var _RemCustomScrollbar=function(tableThis){
    	tableThis.table.mCustomScrollbar("update");
    	tableThis.tbodyDiv.mCustomScrollbar("update");
    };
	/**
	 * 功能：调整td宽度
	 */
	Newtec.Table.prototype.setTdWidth=function(setWidth){
		_setTdWidth(this,setWidth)
	}
	var _setTdWidth =  function(tableThis,setWidth){
//		tableThis.wtime=
//		if(!tableThis.firstSetWidth){
	//检查可能会错位问题
			var iniWidth=tableThis.iniWidth;
			var w=tableThis.tbodyDiv.outerWidth()
			var w2=tableThis.tableBodyDiv.outerWidth();
			if(w2>w){
				w=w2;
				tableThis.tbodyDiv.css('width',w)
				tableThis.thead.css('width',w)
			}
			if(iniWidth>w){
				tableThis.tbodyDiv.css('width',tableThis.iniWidth)
				tableThis.thead.css('width',tableThis.iniWidth)
			}
			
//		}
		tableThis.firstSetWidth=true;
		tableThis.wtime&&clearTimeout(tableThis.wtime)
		tableThis.wtime=setTimeout(function(){
			if(!tableThis.isSetScrollbar&&setWidth){
				tableThis.setScrollbar();
				tableThis.isSetScrollbar=true;
			}
			var theadTh=tableThis.theadTh;
			var tbodyTh=tableThis.defaults.showThead===false?tableThis.tbodyTable.find(">tbody>tr>."+tableThis.getTdFirstClass()):tableThis.tbodyTh;
			var len=theadTh.length-1;//不设置最后一个宽度
			var defaults=tableThis.defaults
				for(var i=0;i<len;i++){
					$(tbodyTh[i]).css("width",$(theadTh[i]).outerWidth());
				}
				
//			}
		},50);
	};

	var sortArray=function(sort1,array){
		var d=array.shift();
		var tag1=d[sort1];
		
		var toAddArry=[];
		toAddArry.push(d);
		var len=array.length;
		while(len>0){
			for ( var i = 0; i < len; i++) {
				if(tag1==array[i][sort1]){
					toAddArry.push(array[i]);
					array.splice(i,1);
					len--;
					i--;
				}
			}
			if(len>0){
				var t=array.shift();
				toAddArry.push(t);
				tag1=t[sort1];
				len--;
			}
		}
		return toAddArry;
	};
	Newtec.Module("Table")
})();