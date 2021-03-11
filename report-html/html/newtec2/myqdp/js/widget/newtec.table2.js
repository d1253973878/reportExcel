;(function(){
	if(!Newtec.Utils.isNull(Newtec.Table)){
		return ;
	}
		Newtec.Pagin2||Newtec.Utils.addJS("newtec.pagin2.js","myqdp/js/widget/");
//	var tableThis;//当前表格this对象
	var childRowClass='child_row';
	Newtec.Table = function(params){
		this.defaults = {
				leng:5,
				beginpage:1,
				focuspage:1,
				fields:'',
				datas:'',
				src:'myqdp',
				tableDivClass:'',
				maxHeight:400,
				minHeight:100,
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
				,pages:[30,10,20,50,100]
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
								}//表单查询时的参数
		,showFooter:true
		,pageSize:3
		,editHandler:""
		,dbclickCanEdit:false
		,showMoreBtn:false//是否显示更多功能按钮
		,showMoreDivWidth:200//更多功能弹窗宽度
		,canDraft:true//是否列宽可拖拽
		,showFilter:false
		,showHeaderBtn:true
//		,selectedStyle:''
//		,editTrStyle:''
		,tableClass:''//表内容tablediv样式，可以通过'border:0;'控制表身无边框
//		,groupTrStyle:''
//		,backgroundColor:'#e8ebf3'
//		,filterInputStyle:''
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
		};
		$.extend(true,this.defaults,params);
		var mode=params.mode;
		var def=this.defaults;
		if(mode=='2'){
			def.showHeader=params.showHeader||false;
			def.showPagin=params.showPagin||false;
			def.showFetchForm=params.showFetchForm||false;
			def.showFooter=params.showFooter||false;
			def.showHeaderBtn=params.showHeaderBtn||false;
			def.showMoreBtn=params.showMoreBtn||false;
		}
	};
	
	this.isTrBtnFun = false;
	this.isTdValueHtmlFun = false;
	Newtec.Table.prototype = new Newtec.Base('table');
	Newtec.Table.prototype.NEWTEC_TR_ID = 'newtecTRId';//增加在每行数据[this.datas/this.pageDatas]中的缓存key,和dom中的trId值对应
	Newtec.Table.prototype.setParams=function(params){
		var def=this.defaults;
		var config="";
		this.isRowspan=Newtec.Utils.isArray(def.rowspan);
		var skin="";
		this.headClass="table-header ";
		this.currentPage=1;
		this.selectedClss="selected ";
		if(parent.Newtec.App!=undefined){
			config=parent.Newtec.App.config;
			this.headClass+=config.getSkinClassName("table","nav");
			this.footClass=""+config.getSkinClassName("table","foot");
			this.selectedClss+=+config.getSkinClassName("table","selected");
			skin=config.getSkinConfig("table");
		}
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
		is100Height=params.is100Height=params.height.indexOf("100%")>=0||is100Height
		this.tableDiv = $("<div id='"+this.getTableDivId()+"' class='newtec-table-div "+((params.fixed&&"fixed")||"")
				+(is100Height&&" height100"||"")+"'></div>");
		this.tableHeaderOther = params.tableHeaderOther;
		//创建表头thead
		if(Newtec.Utils.isTrue(this.defaults.showHeader)){
			this.tableHeader = $("<div  class='table-header'></div>");
			if(params['headerTitle']){
				var headerTitleJQ=$("<span id='headerTitle'>"+params['headerTitle']+"</span>");
				this.tableHeader.append(headerTitleJQ)
				this.headerTitleJQ=headerTitleJQ;
			}
			this.tableHeaderBtns = $("<div class='pull-right' style='margin: 3px 0;'></div>");
			if(Newtec.Utils.isTrue(this.defaults.showFetchForm)){
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
		/**
		 * 查询表单
		 */
		if(Newtec.Utils.isTrue(this.defaults.showFetchForm)){
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
	Newtec.Table.prototype.getTable=function(params){
		var table = "<div id='"+this.getTableId()+"' class='newtec-table "+(params['tableClass']||"")+"'></div>";//原来是table标签的 现在换成了div标签
		this.table = table=$(table);
		var thead=$("<div class='t-thead-div'>");
		var style=!params.is100Height&&'max-height:'+params.maxHeight+"px;min-height:"+params.minHeight+"px"||"";
		var tbodyDiv=$("<div class='t-tbody-div' style='"+style+"'>");
		table.append(thead).append(tbodyDiv);
		this.thead=thead;
		this.tbodyDiv=tbodyDiv;
		return table;
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
		console.info("==pages=",pages,showNum);
		this.paginFetchData=false;
		var pagin=Newtec.Pagin2.create({pages:pages,showNum:showNum,changeFunction:function(index,totalPage,begin,totalRow,seltype){
			showNum=pagin.showNum;
			console.info(that.totalNum+"=totalRow==<<><>"+showNum);
			var p=that.preFechParam
			p.startRow=(showNum*(index-1));
			p.endRow=showNum*index;
			p.totalRow=totalRow;
//			if(Newtec.Utils.isFunction(params['changePageFun'])){
//				params['changePageFun'](index,showNum*(index-1),showNum*index,p);
//			}
			that.paginFetchData=true;
			that.fetchData(p);
		}});
		this.pagin=pagin;
		console.info("===>>>",pagin.newtecJQ);
		this.Pagmain.append(pagin.newtecJQ);
//		if( this.pagination || Newtec.Utils.isFalse(this.defaults.showPagin)) return ;
//		var tableThis = this;//设置当前表格this
//		var params=this.defaults;
//		var pages = params.pages;
//		this.pageSize = pages[0];
//		var ps = "";
//		for(var i=0;i<pages.length;i++){
//			var selected = i==0? " selected='selected' " : "";
//			ps = ps+"<option "+selected+" value='"+pages[i]+"'>"+pages[i]+"条/页"+"</option>";
//		}
//		var pagination = $('<div style="float: right;  margin-right: 5px;">'+
//				'<table class="pagin-table" style="color:gray;line-height: 18px">'+
//				' <tbody>'+
//				'<tr>'+
//				'<td id="totalshow"></td>'+
//////			'   <td id="firstPageId"  title="第一页"><span class="ui-icon" >&lt;&lt;</span></td>'+
////				'   <td id="firstPageId"  title="第一页"><span class="ui-icon" ><img width="19px" src="'+params["src"]+'/images/table/left-arrows1.png"/></span></td>'+
//////				'  <td id="prevPageId" class="pagingDisabled" title="上一页"><span class="ui-icon" style="padding: 0px 4px;" >&lt;</span></td>'+
////				'  <td id="prevPageId" class="pagingDisabled" title="上一页"><span class="ui-icon" style="padding: 0px 4px;" ><img width="14px" src="'+params['src']+'/images/table/left-arrow1.png"/></span></td>'+
//				'  <td id="prevPageId" class="pagingDisabled" title="上一页"><button><a><</a></button></td>'+
////				'<td >|&nbsp;</td>'+
//				'<td></td>'+
////				' <td ><input id="toPageId" type="text" style="height:30px;width:30px;text-align:center" readonly="readonly" value="1"/>'+
//////				'  <select id="toPageId" style="border: 1px solid #cccccc;height:25px">'+
//////				'       <option selected="selected" value="1">1</option>'+
//////				'     <option value="2">2</option>'+
//////				'     <option value="3">3</option>'+
//////				'  </select>'+
////				'</td>'+
////				'<td >&nbsp;|</td>'+
//////				' <td id="nextPageId" title="下一页" class="" ><span class="ui-icon" style="padding: 0px 5px;"s>&gt;</span></td>'+
//				' <td id="nextPageId" title="下一页" class="" ><button><a>></a></button></td>'+
//////				' <td id="lastPageId" title="最后一页"><span class="ui-icon">&gt;&gt;</span></td>'+
////				' <td id="lastPageId" title="最后一页"><span class="ui-icon"><img width="19px"  src="'+params['src']+'/images/table/right-arrows1.png"/></span></td>'+
//				' <td>'+
//				'  <select id="pageSizeId" style="border: 1px solid #f2f5fb;height:30px;width:100px;background:#f2f5fb;">'+
//				ps+
//				'  </select>'+
//				'</td>'+
//				'<td><span>跳至</span></td>'+
//				'<td><input id="toPageId" type="text" style="width:40px;height:30px;border:1px solid #f2f5fb;background-color: #f2f5fb;text-align:center" value="1"/></td>'+
//				'<td><span>页</span></td>'+
//				' </tr>'+
//				'</tbody>'+
//		'</div>');
//		this.pagination=pagination;
//		this.Pagmain.append(pagination);
//
//
////		this.totalpage = $("<div style='float:left;margin-left:5px'></div>");
////		this.tableFooter.append(this.headpage).append(this.totalpage).append(this.pagination).append(this.footpage);
//		var toPage =pagination.find("#toPageId") ;
//		var firstPageBtn = pagination.find("#firstPageId");
//		var prevPageBtn = pagination.find("#prevPageId");
//		var nextPageBtn =pagination.find("#nextPageId");
//		var lastPageBtn=pagination.find("#lastPageId");
//		var toFetch = function(page){
////			alert("tableThis.pageSize=="+tableThis.pageSize);
//			tableThis.currentPage = Newtec.Utils.toInt(page);
//			toPage.val(page);
//			var last = getLastPage(tableThis);
////			$("#toPageId option[val='"+toPageId.val()+"']").attr("selected", true);
//			if(page==1){
//				prevPageBtn.addClass("pagingDisabled");
//				firstPageBtn.addClass("pagingDisabled");
//				nextPageBtn.removeClass("pagingDisabled");
//				lastPageBtn.removeClass("pagingDisabled");
//			}else if (page==last){
//				nextPageBtn.addClass("pagingDisabled");
//				lastPageBtn.addClass("pagingDisabled");
//				firstPageBtn.removeClass("pagingDisabled");
//				prevPageBtn.removeClass("pagingDisabled");
//			}else{
//				prevPageBtn.removeClass("pagingDisabled");
//				nextPageBtn.removeClass("pagingDisabled");
//				firstPageBtn.removeClass("pagingDisabled");
//				lastPageBtn.removeClass("pagingDisabled");
//			}
//			////console.info("---->>",page-1,tableThis.pageSize);
//			tableThis.preFechParam['startRow']=(page-1)*tableThis.pageSize;
//			tableThis.preFechParam['endRow'] = page*tableThis.pageSize;
//			tableThis.preFechParam['totalRow'] = tableThis.totalRow;
//			////console.info("》》》》",tableThis.preFechParam);
//			tableThis.fetchData(tableThis.preFechParam);
//			
//		};
//		var toOthernext =function(focuspage){
//			params.focuspage = focuspage;
//			var totalPage = getLastPage(tableThis);
//			params.beginpage = focuspage+1;
//			setTotalpage(tableThis.totalRow,tableThis);
//		};
//		
//		var toOtherprev = function(focuspage){
//			params.focuspage = focuspage;
//			if(focuspage-4>1){
//				params.beginpage = focuspage-5;
//				setTotalpage(tableThis.totalRow,tableThis);
//			}else{
//				params.beginpage = 1;
//				setTotalpage(tableThis.totalRow,tableThis);
//			}
//		};
//		
////		firstPageBtn.click(function(){
////			toFetch(1);
////		});
//		prevPageBtn.click(function(){
//			var startnum = $(this).next().children().eq(1).attr("data");
//			if(startnum==params.focuspage){
//				toOtherprev(tableThis.currentPage);
//				params.focuspage=tableThis.currentPage-1;
//				toFetch(tableThis.currentPage-1);
//			}else{
//				params.focuspage=tableThis.currentPage-1;
//				toFetch(tableThis.currentPage-1);
//			}
//		});
//		nextPageBtn.click(function(){
//			var endnum = $(this).prev().children().eq(-2).attr("data");
//			if(endnum==params.focuspage){
//				toOthernext(tableThis.currentPage);
//				params.focuspage=tableThis.currentPage+1;
//				toFetch(tableThis.currentPage+1);
//			}else{
//				params.focuspage=tableThis.currentPage+1;
//				toFetch(tableThis.currentPage+1);
//			}
//		});
////		lastPageBtn.click(function(){
//////			alert(tableThis.totalRow+">>"+tableThis.pageSize+"----"+tableThis.totalRow%tableThis.pageSize+'last=='+last);
////			var index=getLastPage(tableThis);
////			//console.info('>><<index:'+index);
////			toFetch(index);
////		});
//		toPage.bind('keypress',function(event){
//			if(event.keyCode == "13"){
//				var topag = $(this).val();
//				if(setToPage(topag,tableThis)){
//					params.focuspage=topag;
//					params.beginpage=(Math.floor((topag-1)/5))*5+1;
//					toFetch(topag); 
//					setTotalpage(tableThis.totalRow,tableThis);
//				}else{
//					toPage.val(tableThis.currentPage);
//				}
//			}
//		});
//		
//		tableThis.toPage=toPage;
////		$("#pageSizeId").change(function(){//ie不兼容
////		alert("-==");
////		tableThis.pageSize = $(this).val();
////		toFetch(1);
////		});
////		$(divId+" #pageSizeId").on("change",function(){//ie不兼容
////			tableThis.pageSize = $(this).val();
////			toFetch(1);
////		});
//		pagination.on("change","#pageSizeId",function(){
//			tableThis.pageSize = Newtec.Utils.toInt($(this).val(),5);
//			var totalPage = getLastPage(tableThis);
//			if(((tableThis.totalRow/tableThis.pageSize)+1)>totalPage){
//				params.focuspage=1;
//				params.beginpage=1;
//				toFetch(params.focuspage);
//				setTotalpage(tableThis.totalRow,tableThis);
//			}else{
//				toFetch(params.focuspage);
//				setTotalpage(tableThis.totalRow, tableThis);
//			}
//			
//		});
//		pagination.on("click",".changepageBtn",function(){
//			$(this).prevAll().removeClass("active");
//			$(this).nextAll().removeClass("active");
//			$(this).addClass("active");
//			params.focuspage=$(this).attr('data');
//			console.log(params.focuspage);
//			toFetch($(this).attr('data'));
//		});
//		pagination.on("click","#othernext",function(){
//			var endcount = $(this).prev().attr("data");
//			tableThis.currentPage=Newtec.Utils.toInt(endcount,0);
//			toOthernext(tableThis.currentPage);
//			params.focuspage=tableThis.currentPage+1;
//			toFetch(tableThis.currentPage+1);
//		});
//		pagination.on("click","#otherprev",function(){
//			var startcount = $(this).next().attr("data");
//			tableThis.currentPage=Newtec.Utils.toInt(startcount,0);
//			toOtherprev(tableThis.currentPage);
//			params.focuspage=tableThis.currentPage-1;
//			toFetch(tableThis.currentPage-1);
//		});
////		this.tableFooter.append(this.pagination);
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
		this.setFields(this.fields);
		this.setDS(params['ds'], true);
		
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
			var top=0;
			if(this.tableHeader!=undefined){
				
				top+=this.tableHeader.outerHeight(true);
			}
			console.info("---top><>"+top);
			if(this.fetchFormJQ!=undefined){
				top+=this.fetchFormJQ.outerHeight(true);
			}
			console.info("---top><>"+top);
			var bottom=0;
			var tableFooter=this.tableFooter;
			if(tableThis.tableFooter!=undefined){
				bottom=tableFooter.outerHeight(true);
			}
			this.tableBodyDiv.css({'top':top,'bottom':bottom});
		}
		_setFunction(this,params);
		
	};
	/**
	 * 注册事件
	 */
	var _setFunction=function(tableThis,params){
//		var preDbclickTdId=''; 
		var canClick = true;//是否是触发单击
		var clickEventTime =null;
		var table=tableThis.table;
		var colspan=tableThis.defaults.colspan;
		//
//		var clickEvent = true;
//		var dbclickEvent = true;
		if(tableThis.multSelect){
			tableThis.tableDiv.on('click',"#"+tableThis.getThCheckId(),function(){//头部的复选框 选中和反全选
//				if(Newtec.Utils.isNull(tableThis.pageDatas)) return ;
				tableThis.selectAll($(this).is(':checked'));
			});
		}
		table.on('click','.newtec-tbody tbody>tr.'+childRowClass,function(){
			var clickEvent = Newtec.Utils.isFunction(tableThis.clickRecord);
			var dbclickEvent = Newtec.Utils.isFunction(tableThis.dbclickRecord);
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
//					alert('单击');
					var j = $(this);
					//console.info(tableThis);
//					clearTimeout(clickEventTime);
//					alert(tableThis.clickRecord+"=进入=="+tableThis.ds.dsName);
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
		table.on('click','.newtec-tbody tbody>tr.'+childRowClass+'>td:first-child input',function(){
			var trId=tableThis.trCheckId2TrId($(this).attr('id'));
			var data=tableThis.getRowRecord(trId);
			canClick = false;
			if ($(this).prop('checked')) {
				tableThis.selectByTRId(trId,true,data);
//				tableThis.setTrColor(data[tableThis.NEWTEC_TR_ID]);
			}else{
				tableThis.selectByTRId(trId,false,data);
//				tableThis.setTrColor('',data[tableThis.NEWTEC_TR_ID]);
			}
		});
		table.on('click','.newtec-tbody tbody>tr.group_row>td:first-child input',function(){
			var iput=$(this);
			var clazz=iput.attr('id');
			if(Newtec.Utils.isNull(clazz))return;
			var checked=iput.prop('checked');
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
		if (params.dbclickCanEdit) {
			table.on('dblclick','tbody>tr.'+childRowClass+'>td',function(){
				var td = $(this);
				// 根据表格文本创建文本框 并加入表表中--文本框的样式自己调整
//				var text = td.text();
//				var txt = $("<input type='text' style='width:100%;'>").val(text);
				var id=td.attr('id');
				var name=tableThis.getTdId2Name(id);
				if(id=='c_0'||name=='btn')return;
				var tr=td.parent();
				var trId=tr.attr('id');
				//console.info(tableThis.editFun);
				if(tableThis.editFun[trId]!=undefined&&tableThis.editFun[trId][name]!=undefined)return true;
				var data=tableThis.getRowRecord(trId);
				var field='';
				var fields=tableThis.fields;
				for ( var i = 0; i < fields.length; i++) {
					if(fields[i].name==name){
						field=fields[i];
						break;
					}
				}
				_tdToCanEdit(td,tableThis,data,field,trId,true,true,function(newText,text){
					if(text!=newText)
						  td.addClass('edit-tr');
				});
				tableThis.selectByData(data);
			});
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
			dsFields=$.extend(true, [],ds.fields);
			this.setFields(dsFields);
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
	};
	Newtec.Table.prototype.setFields = function(fields){
		if(Newtec.Utils.isNull(fields) || this.hasSetFields==true){
			return ;
		}
		this.hasSetFields=true;
		this.fields = fields;
		var defaults=this.defaults;
		var checkStr = (this.multSelect==false)?"":"<th id='c' class='center' style='width:"+this.getCheckeboxWidth()+";border-bottom:none;border-left:0;'>"
				+"<span class='pos-rel'>"
				+"	<input type='checkbox' class='ace' id='"+this.getThCheckId()+"'/>"
				+"	<span class='lbl'></span>"
				+"</span>"
				+"</th>";
		checkStr = (this.defaults.expand==false)?checkStr:"<th id='c' class='center' style='width:"+this.getCheckeboxWidth()+";border-bottom:none;border-left:0;'>"
				+"</th>";
		var thead = "<thead><tr id='"+this.getThId()+"'>"+checkStr;
		var len = fields.length,fixed=false,className="",title="";
		if(defaults.fixed&&defaults.headFixed){
			className+=" nowrap";fixed=true;
		}
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
			if(Newtec.Utils.isTrue(hidden)){
				hidden = ' display:none; ';
				field['h'] = true;//设置成隐藏，让创建tBody的时候使用
			}else{
				hidden = '';
			}
			if(fixed){
				title="title='"+field['title']+"'";
			}
			var width=field.width;
			if(width!==undefined){
				width=";width:"+(width&&!isNaN(width)&&width+"px"||width);
			}
			thead+="<th id='"+this.getThtdId(field['name'])+"'  "+title+"  class='"+this.getThFirstClass()+" center "+fieldStyle+className+"' style='"+hidden+width+"'>"+field['title']+"</th>";
		}
		if(this.isTrBtnFun){
			thead = thead+"<th id='"+this.getThbtnId()+"' class='center' style=' width:"+this.getTrBtnWidth()+";border-left:1px;border-right:0;'>"+this.defaults['trBtnTitle']+"</th>";
			this.trBtnShow=true;//行上最后一列按钮是否显示
		} 
		var tableThis=this;
		if (this.showMoreBtn) {
			this.showMoreBtnId=this.id+"_showMoreBtnId";
			thead=thead+"<th style='width:13px;border-bottom:none;cursor:pointer;border-right:0;' class='center' id='"+this.showMoreBtnId+"'><</th>";
			$(document).on('click','#'+this.showMoreBtnId,function(){
				tableThis.showMoreDiv.css("display","block");
			});
		}
		thead+="</tr>";
		if (this.defaults.showFilter) {
			thead+='<tr id="'+this.getTrFilterId()+'" class="head-filter">'+getFilterTr(this,fields)+'</tr>';
		}
		thead+="</thead>";
		this.extThead=thead;
		thead="<table class='newtec-thead table table-bordered'>"+thead+"</table>";
		console.info(this.thead);
		this.thead.append(thead);
		if(!Newtec.Utils.isTrue(this.defaults['showThead']))//隐藏表头
			this.hiddeThead();
	};

	var getFilterTr = function(tableThis,fields){
//		var fields = tableThis.fields;
		if(Newtec.Utils.isNull(fields)){
			return "";
		}
		var trHTML = (tableThis.multSelect==false&&tableThis.defaults.expand==false)?"":"<th class='center' id='c_"+0+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+"</th>";
		var len = fields.length;
//		var filterInputStyle=tableThis.filterInputStyle;
//		var filterThStyle=tableThis.filterThStyle;
		for(var col=0;col<len;col++){
			var field = fields[col];
			var colName = field['name'];
			var hidden =Newtec.Utils.isTrue(field['h'])?'display:none;':'';
			trHTML += "<th id='"+tableThis.getThFilterId(colName)+"' style='"+hidden+/*width+*/"'>"
			+"<input type='text' class='filter-input'  name='"+colName+"'/></th>";
		}
		if(tableThis.isTrBtnFun){
			trHTML+='<th ></th>';
		}
		var filterBtn='<div class="glyphicon glyphicon-filter" id="'+tableThis.getFilterBtnId()+'" style="cursor:pointer;top:3px;left:3px;"></div>'; 
		trHTML+='<th style="border-right:0;">'+filterBtn+'</th>';
		$(document).on('click','#'+tableThis.getFilterBtnId(),function(){
			var inputs=$("#"+tableThis.getTrFilterId()+' input');
			var data={};
			for ( var i = 0; i < inputs.length; i++) {
				var input=$(inputs[i]);
				var value=input.val();
				if (!Newtec.Utils.isNull(value)) {
					data[input.attr('name')]=value;
				}
			}
			tableThis.fetchData({data:data});
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
			this.fetchFormJQ.css('display','none');
			obj.attr('title','展开');
			obj.find('img').attr('src',path+"/chevron-up1.png");
		}else if(title=='展开'){
			this.fetchFormJQ.css('display','block');
			obj.attr('title','收起');
			obj.find('img').attr('src',path+"/chevron-down1.png");
		}
//		if(!Newtec.Utils.isNull(this.showMoreDiv)){
//		var top=$("#"+this.getTableId()).offset().top;
//		this.showMoreDiv.css('top',top+"px");
//		}
	};
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
//		return this.id;
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
	Newtec.Table.prototype.getTrId=function(row){
		return this.id+"_"+row;
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
			var name='';
			for ( var i = 2; i < strs.length-1; i++) {
				name+=strs[i]==''?'_':strs[i];
			}
			return name;
		}
		return strs[len-2];
	};
	Newtec.Table.prototype.getGroupTeamClass = function(row){
		return this.id+"_groupteam_"+row;
	};
	/**
	 * @author 王仕通 2016-10-13 说明：表格查询操作
	 * params参数格式要求： {startRow:int,endRow:int,totalRow=-1,sortBy:{},
	 * callback:fun,operId='',clientType:'web',ds:'',operType='',
	 * data:{operator:'and',criteria:[{fieldName:'',operator:'equals',value:''},{fieldName:'',operator:'equals',value:''}]}}
	 */
	Newtec.Table.prototype.fetchData = function(params,noCover){
		if(Newtec.Utils.isNull(this.ds)) return;
		this.showLoadDiv();
		if(Newtec.Utils.isNull(params)){params={ds:this.ds.dsName};};
	    //
		//合并初始化限制的请求条件
		var fetchParam=noCover&&$.extend(true,{},this.fetchParam)||this.fetchParam;
		params=$.extend(true,fetchParam,params);
		var defaults=this.defaults;
		var beforeFunction = this.defaults.fetchBefore;
		if (Newtec.Utils.isFunction(beforeFunction)) {
			beforeFunction(params);
		}
		var defaults=this.defaults;
		var oldCallback = params['callback'];
		var tableThis = this;
		var isAsyPagin=defaults.isAsyPagin;
		params['callback'] = function(response){
			if(Newtec.Utils.isFunction(oldCallback)){
				oldCallback(response);
			}
			params['callback'] = oldCallback;//还原之前的回调，避免使用新的回调
			tableThis.preFechParam = params;//缓存查询上下文供分页上下页使用
//			tableThis.loadDiv.css('display','none');
			tableThis.hideLoadDiv();
//			alert((response.status==0)+"data777=="+Newtec.Utils.json2str(response));
			if(response.status==0){
				var data = response['data'];
				data=data?data:[];
//				if(data==undefined || data.)
//				alert("x="+(Newtec.Utils.toInt(params['startRow'],0)/tableThis.pageSize +1));
				tableThis.setData(data,false,-1,true);
//				for(var i=0;i<1;i++){
//				tableThis.setData(data,true,-1,true);
//				}
////				setToPage((Newtec.Utils.toInt(params['startRow'],0)/tableThis.pageSize +1),tableThis);
//				isAsyPagin||pagin.setTotal(Newtec.Utils.toInt(response['totalRow'],-1)<=0?data.length:response['totalRow']);
				if(defaults.showPagin&&!isAsyPagin){
					if(!tableThis.paginFetchData){
						tableThis.totalNum=response.totalRow;
						tableThis.pagin.createPagin(response.totalRow,null,defaults.maxRow);
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
						tableThis.totalNum=response.totalRow;
						tableThis.pagin.createPagin(response.totalRow,null,defaults.maxRow);
					}else{
						tableThis.paginFetchData=false;
					}
				}else{
					console.error(response.error+"==>获取总数失败！！");
				}
			}
			this.ds.fetchData(totalParam);
		}
//		alert('fetch='+Newtec.Utils.json2str(params));
		this.ds.fetchData(params);
	};
	Newtec.Table.prototype.addData = function(record,operId,callback,isAppendData){
		if(Newtec.Utils.isNull(this.ds)) return;
		//console.info(record);
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
//				alert((response['status']==0)+"==="+Newtec.Utils.json2str(response['data']));
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
						$(tds[i+begin]).text(tdValue);
					}
//					tr.html(getTRHTML(i,data,this));
					_cleartrEdit(tr);
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
		if(Newtec.Utils.toInt(obj,-99) != -99){//是行索引
			return this.pageDatas[obj];
		}else if(Newtec.Utils.isString(obj)){
			var len = this.pageDatas.length;
			for(var i=0;i<len;i++){
				var data = this.pageDatas[i];
				if(data[this.NEWTEC_TR_ID] == obj || data[this.pk]==obj) return data;
			}
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
	/**
	 * @author 王仕通 2016-10-18
	 *  说明：获得行jquery对象
	 *  obj:1.行索引；2.trId;3.tr对应的数据主键;4.行数据
	 */
	Newtec.Table.prototype.getRowJquery = function(obj){
		var trId =null;
		if(Newtec.Utils.toInt(obj,-99) != -99){//是行索引
			trId = this.getTrId(obj);
		}else if(Newtec.Utils.isString(obj)){//pk 或trId
			if(obj.startWith(this.id)){//trId
				trId = obj;
			}else{//pk==>trId
				trId = this.getRowRecord(obj)[this.NEWTEC_TR_ID];
			}
		}else if(Newtec.Utils.isJson(obj)){
			trId = obj[this.NEWTEC_TR_ID];
		}

		if(!Newtec.Utils.isNull(trId)){
			return $("#"+trId);
		}else if(Newtec.Utils.isJquery(obj)){
			return obj;
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
		$("input[name='"+this.getTrCheckName()+"']:checked").each(function(){
			values.push(tableThis.getRowRecord($(this).val()));
		});
		return values.length>0?$.extend(true,[],values):null;
	};
	Newtec.Table.prototype.selectAll=function(isAll,isCheckAllBtn){
		if (this.tbodyDiv==undefined) return;
		this.tbodyDiv.find('table>tbody>tr>td:first-child input').prop('checked', isAll);
		this.setTrColor('','',isAll);
		var change= this.defaults.change;
		if(Newtec.Utils.isFunction(change)){
			change(isAll);
		}
		$("#"+this.getThCheckId()).prop("checked",isAll);
	};
	Newtec.Table.prototype.clearEditStyle=function(datas){
		if (Newtec.Utils.isArray(datas)) {
			for ( var i = 0; i < datas.length; i++) {
				this.clearEditStyle(datas[i]);
			}
		}else{
			var id= datas[this.NEWTEC_TR_ID];
			var tr=$('#'+id);
			_cleartrEdit(tr);
		}
	};
	var _cleartrEdit=function(tr){
		//console.info("_cleartrEdit");
		var tds=tr.find('td.edit-tr');
		//console.info(tds.length);
		for ( var i = 0; i < tds.length; i++) {
			$(tds[i]).removeClass('edit-tr');
		}
	};
	/**
	 * 将该列变成可编辑
	 * 
	 */
	Newtec.Table.prototype.toCanEdit=function(datas){
		if (Newtec.Utils.isNull(datas)) {
			return;
		}
		if (Newtec.Utils.isArray(datas)) {
			for ( var i = 0; i < datas.length; i++) {
				this.toCanEdit(datas[i]);
			}
		}else{
			var id= datas[this.NEWTEC_TR_ID];
			var tr=$('#'+id);
			var count=0;
			var tds=tr.find('td');
//			var fields=this.fields;
			var tableThis=this;
			var fields=$.extend(true,[],this.fields);
			_tdBlurFun(tr,function(elem,fun){
				if(count==0){
					count=1;return;
				}
				var isNnbind=true;
				for(var i = 0; i < fields.length; i++){
					var fn=tableThis.editFun[id][fields[i]['name']];
					if(Newtec.Utils.isFunction(fn))
						if(fn("",true))isNnbind=false;
				}
//				if(isNnbind)
				    $(elem).unbind('click',fun);
			},this);
			var begin=!this.multSelect&&!this.expand?0:1;
			for ( var i = 0; i < fields.length; i++) {
				var f=fields[i];
				_tdToCanEdit($(tds[i+begin]),this,datas,f,id);
			}
		}
	};
	var _createField = function(f,tableThis){
    	var type = f['type'];
    	if(Newtec.Utils.isNull(type)){
    		type='text';
    		f['type'] = type;
    	}
    	var name = f['name'];
    	f['id'] = Newtec.Utils.uuid16()+"_"+f['type']+"_"+f['name'];
    	var item ;
    	if(true){
    		var funcType = Newtec.funcType[type];
    		if(funcType==undefined){
    			alert(name+"字段"+type+"类型没有处理类，请确认extend(Newtec.FormItem,'')");
    		}
    		f.showTitle=false;
    		f.itemDivStyle='padding:0;margin:0;';
    	    f.valueDivStyle='padding:0;margin:0;';
    		item = funcType.create(f);
    		return item;
    	}
	};
	var _tdBlurFun=function(td,blurFun,tableThis){
		var fun='';
		fun=function(e){
			var This=this;
			
			setTimeout(function(fun){
				if(tableThis.itemClick){
					tableThis.itemClick=false;return;
				}
				var target = $(e.target); 
				if(!target.closest(td).length){ 
					blurFun(This,fun);
				} 
			}, 300);
		};
		$(document).bind("click",fun) ;
	};
	var _tdToCanEdit=function(td,tableThis,data,f,trId,inputed,isFocus,callFun){
		var text = td.text();
		var txt='';
		var setValue=true;
		var name=f.name;
		var required=f.required;
		var editFun=tableThis.editFun[trId];
		if(tableThis.editFun[trId]==undefined){
			tableThis.editFun[trId]=editFun={};
		}
		f.clickFun=function(){
			tableThis.itemClick=true;
		};
		if(!inputed){
			f.inputFun=function(elem){
				inputed=true;
			};
		}
		var blurFun=function(elem,input){
			if(!inputed&&!input)return true;
			var newText=txt.getValue();
			newText=Newtec.Utils.isNull(newText)?"":newText;
			var newtecJQ=txt['newtecJQ'];
			if(Newtec.Utils.isNull(newText.trim())&&!Newtec.Utils.isNull(required)){
				newtecJQ.css({'border':"1px solid red",'border-radius':"3px"});
//				alert(required);
				return true;
			}
			data[name]=newText;
			newtecJQ.remove();
			td.text(newText);
			delete editFun[name];
			if(Newtec.Utils.isFunction(callFun)){
				var editHandler=tableThis.defaults.editHandler;
				if(Newtec.Utils.isFunction(editHandler))
					editHandler(newText,text,data,txt,name);
				callFun(newText,text,txt);
			}
		};
		f.blurFun=blurFun;
		editFun[name]=blurFun;
		txt=_createField(f,tableThis);
		td.text("");
		td.append(txt['newtecJQ']);
		txt.setValue(text);
		if(isFocus)
			txt.focus();
	};
	
//	var _tdToCanEdit1=function(td,tableThis,data,id){
//		var id=td.attr('id');
////		if(id=='c_0'||name=='btn')return;
//		var text = td.text();
//		var txt = $("<input type='text' style='width:100%;'>").val(text);
//		var name=tableThis.getTdId2Name(id);
//		txt.on('input',function(){
//			txt.blur(function(){
//				// 失去焦点，保存值。于服务器交互自己再写,最好ajax
//				var newText = $(this).val();
//				data[name]=newText;
//				// 移除文本框,显示新值
//				$(this).remove();
////				td.addClass('edit-tr');
//				td.text(newText);
//			});
//			txt.unbind(text);
//		});
////		tr.blur(function(){
////			// 失去焦点，保存值。于服务器交互自己再写,最好ajax
////			var newText = $(this).val();
////			data[name]=newText;
////			// 移除文本框,显示新值
////			$(this).remove();
////			td.text(newText);
////		});
//		td.text("");
//		td.append(txt);
//	};
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
//			var trId=datas[this.NEWTEC_TR_ID];
		
		}
	};
	/**
	 * trId:
	 * isTrue:true为选中，false取消选中
	 */
	Newtec.Table.prototype.selectByTRId=function(trId,isTrue,data){
		if(Newtec.Utils.isNull(trId))return;
		var multSelect=this.multSelect;
		isTrue=Newtec.Utils.isNull(isTrue)?true:isTrue;
		if(isTrue){
			if(multSelect==false){
				if (!Newtec.Utils.isNull(this.selectRecord)) {
					this.setTrColor("",this.selectRecord[this.NEWTEC_TR_ID]);
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
		$("#"+this.trId2TrCheckId(trId)).prop('checked', isTrue);
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
		var inputs=this.tbodyDiv.find('table>tbody>tr.'+clas+'>td:first-child input');
		if(inputs.length==inputs.filter(":checked").length)
			$('#'+clas).prop('checked', true);
		else
			$('#'+clas).prop('checked', false);
	};
	Newtec.Table.prototype.isAllSelct = function(){
		var pageDatas=this.pageDatas;
		if (this.tbodyDiv!=undefined&&pageDatas.length>0) {
			var inputChkecked=this.tbodyDiv.find('table>tbody>tr.'+childRowClass+'>td:first-child input').filter(":checked");
			if (inputChkecked.length==this.pageDatas.length) {
				$("#"+this.getThCheckId()).prop('checked', true);
				return true;
			}else{
				$("#"+this.getThCheckId()).prop('checked', false);
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
//			$("#"+this.getTrCheckId(this.getRowIndex(rowIndexs))).prop('checked', false);
//			this.setTrColor('',this.getRowRecord(row)[this.NEWTEC_TR_ID]);
//			this.deselectByData(this.getRowRecord(row));
			var row = this.getRowIndex(rowIndexs);
			var data=this.getRowRecord(row);
			this.selectByTRId(data[this.NEWTEC_TR_ID],false,data);
//			if(this.multSelect==false && !Newtec.Utils.isNull(this.selectRecord)){//取消单选
//				if(this.getRowIndex(this.selectRecord)==rowIndexs){
//					this.selectRecord = "";
//				}
//			}
		}
	};
	Newtec.Table.prototype.deselectByData= function(datas){
		if (Newtec.Utils.isArray(datas)) {
			for ( var i = 0; i < datas.length; i++) {
				this.deselectByData(datas[i]);
			}
		}else{
//			var trId=datas[this.NEWTEC_TR_ID];
//			this.setTrColor('',trId);
//			$("#"+this.trId2TrCheckId(trId)).prop('checked', false);
			var pageDatas=this.pageDatas;
			for ( var i = 0; i < pageDatas.length; i++) {
				var d=pageDatas[i];
				if(d.id==datas.id){
					this.selectByTRId(d,false,d);
					break;
				}
			}
		}
		
	};

//	var setSelectRecord = function(obj,tableThis){//设置单选
//		if(tableThis.multSelect==false)
//			tableThis.selectRecord = tableThis.getRowRecord(obj);
//	};

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
//		var t = new Date().getTime();
//		var f = function(){}
//		for(var k=0;k<100000000;k++){
////		var tt = Newtec.Utils.isArray(f);
////		var tt = f['length'];
//		var tt = Newtec.Utils.isString(f);
//		}
//		alert("ttt"+tt+(new Date().getTime()-t));
//		alert("sadf".length+">>>"+[].length+"---"+{}.length);
//		var canClick = true;//是否是触发单击
//		var clickEventTime =null;
//		alert('double='+Newtec.Utils.isFunction(tableThis.dbclickRecord));
		var len = datas.length;
//		var clickEvent = Newtec.Utils.isFunction(tableThis.clickRecord);
//		var dbclickEvent = Newtec.Utils.isFunction(tableThis.dbclickRecord);
//		var color=tableThis.defaults.selectedColor;
		for(var i=0;i<len;i++){//这边注意数据更新后是否有效
			(function(i){
				var data = datas[i];
				var tr = $("#"+data[tableThis.NEWTEC_TR_ID]);
				//alert(data[newtecTable.NEWTEC_TR_ID]+"=="+tr[0]);
//				if(tableThis.multSelect==false && clickEvent==false){
//					
//					tr.click(function(){
////						var oldTr='';
////						if (!Newtec.Utils.isNull(tableThis.selectRecord)) {
////							oldTr=tableThis.selectRecord[tableThis.NEWTEC_TR_ID];
////						}
////						tableThis.setTrColor(data[tableThis.NEWTEC_TR_ID],oldTr);
////						setSelectRecord(data,tableThis);
//						tableThis.selectByData(data);
//						});
//				}
//				if(clickEvent){//设置单击事件
//					tr.click(function(ee){
//						if(canClick==false){//单击复选框不出发单击行记录
//							canClick = true;
//							return ;
//						}
////						//console.log(i+"=="+ee[i]);
////						data =  newtecTable.pageDatas[i];
//						if (tableThis.multSelect==false) {
////							var oldTr='';
////							if (!Newtec.Utils.isNull(tableThis.selectRecord)) {
////								oldTr=tableThis.selectRecord[tableThis.NEWTEC_TR_ID];
////							}
////							tableThis.setTrColor(data[tableThis.NEWTEC_TR_ID],oldTr);
//							tableThis.selectByData(data);
//						}
////						setSelectRecord(data,tableThis);
//						if(dbclickEvent){//当双击事件同时存在的情况下，利用单击延时避免覆盖双击事件
////							alert('单击');
//							var j = $(this);
//							clearTimeout(clickEventTime);
////							alert(tableThis.clickRecord+"=进入=="+tableThis.ds.dsName);
//							clickEventTime = setTimeout(function(){tableThis.clickRecord(data,j);},200);	
//						}else{
//							tableThis.clickRecord(data,$(this));
//						}
//					});
//				}
//				if(dbclickEvent){//设置双击事件
//					tr.dblclick(function(){
////						data = newtecTable.pageDatas[i];
//						if(dbclickEvent){//当单击事件同时存在的情况下，双击的时候需要移除掉产生的无效单击
//							clearTimeout(clickEventTime);
//						}
//						tableThis.dbclickRecord(data,$(this));
//					});
//				}
////				alert((data[newtecTable.NEWTEC_TR_ID]+"_c")+"=="+$("#"+(data[newtecTable.NEWTEC_TR_ID]+"_c"))[0]);
//				$("#"+tableThis.trId2TrCheckId(data[tableThis.NEWTEC_TR_ID])).click(function(){//复选框的单击
//					canClick = false;
//					if ($(this).prop('checked')) {
//						tableThis.selectByData(data);
////						tableThis.setTrColor(data[tableThis.NEWTEC_TR_ID]);
//					}else{
//						tableThis.deselectByData(data);
////						tableThis.setTrColor('',data[tableThis.NEWTEC_TR_ID]);
//					}
//				});
				//最后一行按钮
//				if(isTrBtnFun){
				tableThis.addtrBtn(oldPageSize+i,data,tr);
//				var btn = tableThis.defaults["trBtnFun"](oldPageSize+i,data,tr,tableThis);
//				if(Newtec.Utils.isNull(btn)) return ;
//				var td = $("<td id='"+tableThis.getTrBtnId(oldPageSize+i)+"'></td>");
//				Newtec.Utils.appendTo(td,tr);//最后一列的按钮
//				if(Newtec.Utils.isString(btn)){
//				btn = $(btn);
//				td.append(btn);
//				btn.click(function(){canClick = false;});
//				}else{
//				var len = btn['length'];
//				if(len>0){
//				for(var bb=0;bb<len;bb++){
//				td.append(getTdBtnJQ(btn[bb]));
//				}
//				}else{
//				td.append(getTdBtnJQ(btn));
//				}
//				}
//				}
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
//    		tr.attr("style",selectTrs[canColorTrId]);
		}
    	if (!Newtec.Utils.isNull(setColorTrId)) {
    		var tr=$('#'+setColorTrId);
//    		var selectedStyles=this.selectedStyle.split(';');
//    		var selStyle='';
//    		var newCss={};
//    		var oldCss={};
//    		for ( var i = 0; i < selectedStyles.length; i++) {
//    			var s =selectedStyles[i].split(':');
//    			if(s.length!=2)continue;
//    			newCss[s[0]]=s.indexOf('important')>0?s+';':s+' !important;';
//    			oldCss[s[0]]=tr.attr(s[0]);
//    		}
//    		selectTrs[setColorTrId]=tr.attr("style");
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
    var getTrCheckId=function(tableThis,row){
    	return tableThis.getTrId(row)+"_c";
    };
    var getTRHTMLGroup = function(rowIndex,content,tableThis){
//    	var tdStyle=tableThis.tdStyle;
//		tdStyle+=rowIndex==0?'border-top:0 !important;':'';
		var trHTML ="<td class='center' id='c_"+0+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+"<span class='pos-rel'>"
				+"<input  id='"+tableThis.getGroupTeamClass(rowIndex)+"' type='checkbox' class='ace' />"//checkbox的name相同，值和行trid相同，便于查询
				+"<span class='lbl'></span>"
				+"</span>"
				+"</td>";
		var fields = tableThis.fields;
		var len =  (tableThis.multSelect==false||tableThis.defaults.expand)?fields.length-1:fields.length;
		var isAdd=false;
		var className = rowIndex==0? "class='"+tableThis.getTdFirstClass()+"'": "";
//		tdStyle+="border-right:0 !important;border-left:0 !important;"
			
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
	var getTRHTML = function(rowIndex,data,tableThis){
//		var tdStyle=tableThis.tdStyle;
//		tdStyle+=rowIndex==0?'border-top:0 !important;':'';
		var trHTML = (tableThis.multSelect==false)?"":"<td class='center' id='c_"+0+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+"<span class='pos-rel'>"
				+"<input type='checkbox' class='ace' id='"+getTrCheckId(tableThis,rowIndex)+"' name='"+tableThis.getTrCheckName()+"' value='"+data[tableThis.NEWTEC_TR_ID]+"'/>"//checkbox的name相同，值和行trid相同，便于查询
				+"<span class='lbl'></span>"
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
			trHTML += "<td class='"+className+"' "+title+" id='"+tableThis.getTdId(rowIndex,colName)+"' style='"+hidden+/*width+*/"'>"+valueHtml+"</td>";
		}
		return trHTML;
	};
	
	var getTRHTMLRowspan = function(rowIndex,data,tableThis,isStart,rowNum,rowspanNames){
//		tdStyle+=rowIndex==0?'border-top:0 !important;':'';
		var trHTML = (tableThis.multSelect==false)?"":"<td class='center' id='c_"+0+"' style='width:"+tableThis.getCheckeboxWidth()+";'>"//chekcBOx
				+"<span class='pos-rel'>"
				+"<input type='checkbox' class='ace' id='"+getTrCheckId(tableThis,rowIndex)+"' name='"+tableThis.getTrCheckName()+"' value='"+data[tableThis.NEWTEC_TR_ID]+"'/>"//checkbox的name相同，值和行trid相同，便于查询
				+"<span class='lbl'></span>"
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
			var isRowspanName=rowspanNames[colName];
			if(!isStart&&isRowspanName)continue;
			var tdValue = data[colName];
			if(tdValue==undefined)tdValue = "";
			var valueHtml = tdValue,title='';
			//这里要进行有下拉列表列的数据转-
			if(tableThis.isTdValueHtmlFun){
				valueHtml = tdValueHtmlFun(valueHtml,data,rowIndex,col,colName,isStart,isRowspanName);
				if(valueHtml==undefined) valueHtml = "";
			}
			var rowNum1=Newtec.Utils.isFunction(tdRowNumFun)&&tdRowNumFun(valueHtml,data,rowIndex,col,colName,isStart,rowNum)||-1;
			console.info(rowNum1+'--------rowNum--->>>'+rowNum);
			if(rowNum1<-1)continue;
			isRowspanName=isRowspanName||rowNum1>-1;
			var hidden = Newtec.Utils.isTrue(field['h'])?'  display:none; ':'';
//			console.info("----",isRowspanName,colName,tdStyle)
			if(fixed)title="title='"+valueHtml+"'";
			trHTML += "<td class='"+className+"' "+(isRowspanName?("rowspan="+((rowNum1>-1&&rowNum1)||rowNum)):"")+" "+title+" id='"+tableThis.getTdId(rowIndex,colName)+"' style='"+hidden+/*width+*/" "+(isRowspanName?rowspanStyle:"")+"'>"+valueHtml+"</td>";
		}
		return trHTML;
	};
	Newtec.Table.prototype.addtrBtn =function(row,data,tr){
		if(this.isTrBtnFun==false) return ;
//		var tdStyle=this.tdStyle;
//		tdStyle+=row==0&&!this.isGroupBy?'border-top:0 !important;':'';
		var td = $("<td id='"+this.getTrBtnId(row)+"'></td>");
		var btn = this.defaults["trBtnFun"](row,data,tr,td);
		if(Newtec.Utils.isNull(btn)) btn="" ;
		Newtec.Utils.appendTo(td,tr);//最后一列的按钮
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
	Newtec.Table.prototype.hideLoadDiv=function(){
		var loadDiv=this.loadDiv;
		loadDiv.css('height',loadDiv.outerHeight());
	    loadDiv.fadeOut(300);
		this.newtecJQ.css('position','relative');
		setTimeout(function(){
			loadDiv.css('height',"100%");
		}, 400);
	};
	Newtec.Table.prototype.setNullData=function(isAppendData,isLast,index){
		var fields=this.fields;
		var data={};
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
			emptyDiv=this.emptyDiv=$('<div style="text-align:center;padding: 5px;'+(!isTrue?"display:none;":'')+df.emptyStyle+'">'+emptyTitle+'</div>');
			this.table.append(emptyDiv);
		}
		
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
				}
				
				return;
			}else{
				tableThis.showEmptyTitle(false);
			}
			var pageDatas=tableThis.pageDatas;
			//插入最前面数据，表格数据重新刷新
			if(isAppendData&&index<=0&&pageDatas&&pageDatas.length>0){
				while (tLen--) {
					pageDatas.insert(datas[tLen]);
				}
				tableThis.setData(pageDatas);
				return;
			}
			var tr = "";
			var NEWTEC_TR_ID = tableThis.NEWTEC_TR_ID;
			var cPageSize = 0;
			if(Newtec.Utils.isTrue(isAppendData) && !Newtec.Utils.isNull(tableThis.tbody)){//追加数据
				cPageSize = Newtec.Utils.isNull(tableThis.pageDatas)?0:tableThis.pageDatas.length;
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
					var newRow = row+cPageSize;
					var newtecTRId = tableThis.getTrId(newRow);
					var data = datas[row];
					data[NEWTEC_TR_ID] = newtecTRId;//缓存每行的trId在数据中
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
					+getTRHTML(newRow,data,tableThis,isGroupBy);
					+"</tr>";
//				alert(alert('isTrBtnFun=='+isTrBtnFun));
				}
			}else if(tableThis.isRowspan){
				var rowspanName=def.rowspan, rowspanFiled=rowspanName[0],map={},
				rowspan=[],tag=datas[0][rowspanFiled],tagNum=0;
				for(var i=0;i<rowspanName.length;i++){
					map[rowspanName[i]]=1;
				}
//				var tags=datas[0],tagNums={},rowspans={};
				for(var i=0,len=datas.length;i<len;i++){
					var data=datas[i];
					if(tag==data[rowspanFiled]){
						tagNum++;
					}else{
						tag=data[rowspanFiled];
						rowspan.push(tagNum);
						tagNum=1;
					}
//					for ( var i = 0; i < rowspanName.length; i++) {
//						var rF=rowspanName[i];
//						if(tags[rF]==data[rF]){
////							tagNum++;
//							tagNums[rF]++;
//						}else{
//							tags[rF]=data[rF];
//							rowspans[rF]=rowspans[rF]||[];
//							rowspans[rF].push(tagNums[rF]);
//							tagNums[rF]=1;
//						}
//					}
				}
//				for ( var i = 0; i < rowspanName.length; i++) {
//					var rF=rowspanName[i];
//					rowspans[rF].push(tagNums[rF]);
//				}
				rowspan.push(tagNum);
				tag=null,isStart=true;
				for(var row=0;row<count;row++){
					var newRow = row+cPageSize;
					var newtecTRId = tableThis.getTrId(newRow);
					var data = datas[row];
					data[NEWTEC_TR_ID] = newtecTRId;//缓存每行的trId在数据中
					if (row==count-1) {
						borderRight='border-right:0;';
					}
					isStart=!(tag==data[rowspanFiled]);
					console.info("====",isStart);
					if(isStart){
						tag=data[rowspanFiled];
						tagNum=rowspan.shift();
						console.info("--<<<",tagNum,rowspan);
					}
					tr+="<tr class='"+childRowClass+"' id='"+newtecTRId+"' style='"+borderRight+"'>" 
					+getTRHTMLRowspan(newRow,data,tableThis,isStart,tagNum,map);
					+"</tr>";
//				alert(alert('isTrBtnFun=='+isTrBtnFun));
				}
			} else{
				for(var row=0;row<count;row++){
					var newRow = row+cPageSize;
					var newtecTRId = tableThis.getTrId(newRow);
					var data = datas[row];
					data[NEWTEC_TR_ID] = newtecTRId;//缓存每行的trId在数据中
					if (row==count-1) {
						borderRight='border-right:0;';
					}
					tr+="<tr class='"+childRowClass+"' id='"+newtecTRId+"' style='"+borderRight+"'>" 
					+getTRHTML(newRow,data,tableThis);
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
					$("#"+pageDatas[0][NEWTEC_TR_ID]).before(tr); 
					tableThis.pageDatas.insert(datas,0);
//					alert("2=="+tableThis.pageDatas.length);
				}else{
					index = (index>=cPageSize)? cPageSize-1 : index;
					index = (index<0)?0:index;
					$("#"+pageDatas[index][NEWTEC_TR_ID]).after(tr); 
					tableThis.pageDatas.insert(datas,index+1);
				}
				count = count + (tableThis.totalRow<0?0:tableThis.totalRow);
				if(tableThis.totalRow<=0||index<=0){//之前没有数据的情况下插入数据需要调整列
					console.info('12333-========');
					var tdJQs= tableThis.tdJQs=tableThis.tbody.find('>tr:first-child>td');
//					tableThis.tdJQs = $('.'+tableThis.getTdFirstClass());
					console.info("----<><>>",tableThis.tdJQs[0]);
					console.info("----<><>>",tableThis.tbody.find('>tr:first-child>td')[0]);
					_setTdWidth(tableThis);
				}
			}else{//替换数据
				if(Newtec.Utils.isNull(tableThis.tbody)){//第一次构建body
//					alert('第一次='+datas.length);
					tableThis.tbody = $("<tbody >"+tr+"</tbody>");
       //style='"+tableThis.tBodyStyle+"'
//					var tBodyStyle=tableThis.tBodyStyle;
					tableThis.tbodyTable = $("<table class='newtec-tbody table table-striped table-bordered table-hover' >"+tableThis.extThead+"</table>");
					var defaults=tableThis.defaults;
//					var maxHeight = "max-height:" + tableThis.defaults['maxHeight']+"px;";
					tableThis.tbodyDiv.append(tableThis.tbodyTable);
					tableThis.tbodyTable.append(tableThis.tbody);


					tableThis.tdJQs = $('.'+tableThis.getTdFirstClass());
					tableThis.thJQs = $('.'+tableThis.getThFirstClass());
					var setScrollbar=function(){
						if(!defaults.tBodyNoScorll)
							tableThis.tbodyDiv.mCustomScrollbar({//设置滚动条
								theme: "minimal-dark"
									,scrollInertia:200
							});
						tableThis.table.mCustomScrollbar({//设置滚动条
							theme: "minimal-dark"
								,axis:"x"
									,scrollInertia:200
						});
					}
//					alert(tableThis.tdJQs.length);
					_setTdWidth(tableThis);
					/*tableThis.tbodyTable.resize(function() {
						_setTdWidth(tableThis);
					});*/ 
					setScrollbar();
//					var setResize=false;
					tableThis.table.resize(function() {
						if (tableThis.noReWidth)return;
						tableThis.first=false;//是否需求重新计算列宽
						_setTdWidth(tableThis);
//						if(!setResize){
//							setScrollbar();
//							setResize=true;
//						}
					});

				}else{//不是第一次构建body
//					alert('不是第一次'+datas.length);
					tableThis.tbody.html(tr);
//					tableThis.thJQs = $('.'+tableThis.getThFirstClass());
					tableThis.tdJQs = $('.'+tableThis.getTdFirstClass());
					_setTdWidth(tableThis);
				}
				tableThis.pageDatas = datas;
			}
			tableThis.datas = tableThis.pageDatas;//这里还要考虑怎么设置 有分页和没分页情况
			//换数据后需要清除缓存
//			this.tdJQs ='';
//			this.thJQs = '';
//			alert(total +""+ datas.length);
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
		this.isAllSelct();
		/*function romancefinish(JQ){
			if (JQ[0]==undefined) {
				JQ=tableThis.tbodyDiv.find('tbody>tr>td');
//				alert("-=="+JQ[0]);
				setTimeout(function(){
					getJQ(JQ);
				}, 200);
			}else if(JQ[0]!=undefined){
//				alert("-=="+selectThis.select.find('ul')[0]);
				tableThis.romancefinish();
			}
		}
		romancefinish(tableThis.tbodyDiv.find('tbody>tr>td'));*/
	};
	/**
	 * 渲染完成调用
	 */
	Newtec.Table.prototype.romancefinish=function(calFun){
//		this.tbodyDiv.find('tbody>tr>td').filter(":visible:last-child").css('border-right','0');
		if (Newtec.Utils.isFunction(this.romanceFun)) {
			this.romanceFun();
		}
	};
	var registeFunction=function(tableThis){
		
		tableThis.table.on('mousedown','div.colResizable',function(event){
			tableThis.noReWidth=true;
			var JQ=$(this);
			if (JQ[0]==undefined) return;
			var data=JQ.attr('data');
			var strs=data.split('_');
			var name=strs[strs.length-1];
			var lastOne=false;
			if (name=='lastOne') {
				lastOne=true;
				name=strs[strs.length-2];
				for ( var i = 0; i < strs.length-1; i++) {
					data+=i==0?strs[i]:"_"+strs[i];
				}
			}
			//console.info("lastOne:"+lastOne);
			var originX=event.clientX;
			var originW=lastOne&&tableThis.trBtnShow?tableThis.defaults['trBtnWidth']:$("#"+JQ.attr('data')).outerWidth();
			var originBodyW=tableThis.tbodyDiv.width();
			var originCanWidth=tableThis.canWidth;
			var scrollLeft=tableThis.table.scrollLeft();
//			$(document).on('mousemove','.tableDraftDiv',function(event){
//            tableThis.tableBodyDiv.on('mousemove',function(event){
            tableThis.tableDiv.on('mousemove',function(event){
				 if(!tableThis.noReWidth)return;
            	 var xx = event.clientX;
            	 var yd= xx-originX;//鼠标拖拽的距离
            	 tableThis.yd=yd;
            	 $(this).css('cursor','e-resize');
            	 var width=originW+yd;
//            	 //console.info("originW:"+originW+"==yd:"+yd+"=width:"+width);
            	 tableThis.table.addClass('user-select');
            	 if (width>37){//宽度小于37则返回
//          		 JQ.css('left',xx+"px");
//          		 JQ.css('left',(JQ.offset().left+yd+tableThis.table.scrollLeft())+"px");
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
//            		 else{
//						 $("#"+data).css('width',width+"px");
//            			 $("#"+data+'_0').css('width',(width+25)+"px");
//					}
            		 
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
//			tableThis.tableBodyDiv.unbind('mousemove mouseup');
			tableThis.tableDiv.unbind('mousemove');
			 tableThis.table.removeClass('user-select');
//			$(eleme).unbind('mousemove mouseup');
//			$('.tableDraftDiv').unbind('mousemove mouseup');
			tableThis.table.find('div.colResizable').unbind('mousedown');
			tableThis.tableDiv.css('cursor','default');
//			tableThis.tableDiv.unbind('mousemove');
//			$(document).unbind('mousemove');
			if(tableThis.draftSm){
				tableThis.tbodyDiv.css('width',tableThis.bodyW+"px");
				tableThis.table.find('.mCustomScrollBox .mCSB_container').css('width',(tableThis.bodyW)+"px");
			}else{
				tableThis.canWidth=tableThis.canWidth-tableThis.yd>0?tableThis.canWidth-tableThis.yd:0;
			}
    		_RemCustomScrollbar(tableThis);
		};
	};
	/**
	 * 功能：设置可以拖拽
	 */
	var _colResizable=function(tableThis){
//		//console.info("-===colResizable=");
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
		var type='right:0px;z-index:3;';
		for ( var i = start,len= ths.length; i < len; i++) {
			var th=$(ths[i]);
			data=th.attr('id');
			if(tableThis.showMoreBtn){
				if (i==len-2) {
					type="right:0;left:0;margin:auto;z-index:30;";
					data=data+"_lastOne";
					title='title="可拖拽"';
				}
				if (i==len-1)continue;
			}else if(i==len-1){
				type="right:0;left:0;margin:auto;z-index:30;";
				data=data+"_lastOne";
				title='title="可拖拽"';
				right=th.outerWidth()/2;
			}
			var colResizable=$('<div class="colResizable" '+title+' name="'+(i-start)+'" style="height:'+height+'px;'+type+'cursor: e-resize;top:0;width:5px;position:absolute;" data="'+data+'"></div>');
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
	var _setTdWidth =  function(tableThis,setWidth){
		
		if(true)return;
		tableThis.noSetWidth=Newtec.Utils.isNull(setWidth)?0:setWidth;//默认为0，隐藏：1，显示为：2
		if (tableThis.first) {
			var ths=tableThis.thead.find('thead>tr:first-child>th').filter(":visible");//获取所有可见的th
			var tds=tableThis.tbodyDiv.find('tbody>tr:first-child>td').filter(":visible");
			var end=tableThis.defaults.showMoreBtn?2:1;
			for ( var i = 0,len= ths.length; i <len; i++) {
				if (i==len-end) continue;
				var th=$(ths[i]);
				var width=th.outerWidth();
				$(tds[i]).css('width',width);
			}
			return;
		}
		var tableJQ = tableThis.table;
		tableThis.canWidth=0;
		tableThis.first=true;
		var tbodyJQ = tableThis.tbodyDiv;
		var thead= tableThis.thead;
		var sy = 0;
		var gd = 0;
		var tdHasWidthField = {};
		var fields = tableThis.fields;
		var len = fields.length;
		var lastFieldName="" ;
		if(sy==0){//这里要判断是否需要重计算
			sy = 0;
			gd = (tableThis.trBtnShow==true?tableThis.defaults['trBtnWidth']:0)+(tableThis.multSelect==true?tableThis.defaults['checkeboxWidth']:0)+(tableThis.defaults.expand==true?tableThis.defaults['checkeboxWidth']:0);
			tdHasWidthField = {};
			for(var i=0;i<len;i++){
				var field = fields[i];
				if((Newtec.Utils.getFieldAttrValue(field,'hidden')+"")=='true')continue;
				lastFieldName = field.name;//保存最后一个列名称
				var width = Newtec.Utils.getFieldAttrValue(field,'width');
				width = Newtec.Utils.toInt(width,-1);
				if(width != -1){
					gd = gd + width;
					tdHasWidthField[field.name]=width;
				}else{
					sy++;
				}
			}
		}

		var ths = tableThis.thJQs;
		var tds = tableThis.tdJQs;
		var scrollbarWidth =tbodyJQ[0].offsetWidth - tbodyJQ[0].scrollWidth;
		scrollbarWidth=scrollbarWidth>17||scrollbarWidth<0?0:scrollbarWidth;
		var table_width = tableJQ.width() ;
		var thead_width=thead.outerWidth() ;
		var gd_sy=gd+sy*tableThis.tdWidth;
		if (table_width < gd_sy) {// 表格所占可视面积的宽度小于(gd+不设置宽度列数*150)
			if (thead_width <= gd_sy) {// 当前表格宽度小于(gd+不设置宽度列数*150)，出现x轴滚动条
				table_width = gd_sy;
				tbodyJQ.css('width', table_width + "px");
				thead.css('width', table_width + "px");
				tableJQ.find('.mCSB_container').css('width',
						table_width + "px");//屏蔽mCustomScrollbar与显示和隐藏产生的bug
				_RemCustomScrollbar(tableThis);
			} else {// 当前表格宽度大于(gd+不设置宽度列数*150)无需设置宽度
				return;//
			}
		} else {
			tbodyJQ.css('width', table_width + "px");
			thead.css('width', table_width + "px");
			tableJQ.find('.mCSB_container')
			.css('width', table_width + "px");//屏蔽mCustomScrollbar与显示和隐藏产生的bug
			_RemCustomScrollbar(tableThis);
		}
		var wit_body = table_width - scrollbarWidth;
		var wit_td = (wit_body - gd) / sy;
		var wit_th = (table_width - gd-scrollbarWidth) / sy;
		tds.css('width',  wit_td+ "px");
		ths.css('width', wit_th + 'px');
		
		for(var f in tdHasWidthField){
			var width = tdHasWidthField[f];
			$('#'+tableThis.getTdId(0,f)).css('width',width+'px');
			$('#'+tableThis.getThtdId(f)).css('width',width+'px');
		}

		if(tableThis.isTrBtnFun){
			console.info("-tableThis.isTrBtnFun-----"+tableThis.isTrBtnFun)
			$('#'+tableThis.getThbtnId()).css('width','auto');
			$('#'+tableThis.getTrBtnId(0)).css('width','auto');
			console.info(tableThis.getTrBtnId(0));
			console.info($('#'+tableThis.getTrBtnId(0))[0]);
		}else{
			$('#'+tableThis.getTdId(0,lastFieldName)).css('width','auto');
			$('#'+tableThis.getThtdId(lastFieldName)).css('width','auto');
		}
		
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
	Newtec.Table.create = function(params){
//		var newtecTable = new Newtec.Table(params);
//		return newtecTable;
		return new Newtec.Table(params).init();

	};
})();