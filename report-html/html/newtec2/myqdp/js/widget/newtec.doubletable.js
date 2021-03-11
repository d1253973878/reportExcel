;(function(){
if(Newtec.Doubletable != undefined){
		console.warn('newtec.doubletable.js已经被引入!');
		return ;
	}
Newtec.Table||Newtec.Utils.addJS("newtec.table.js","myqdp/js/widget/");
Newtec.Utils.addCSS("newtec-doubletable.css","myqdp/css/widget/");
//Newtec.Pagin2||Newtec.Utils.addJS('newtec.pagin2.js','myqdp/js/widget/');
Newtec.Doubletable = function(params){
	var ds=params['ds'];
	this.ds=Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
	this.defaults={
			ds:null,
			fetchParam:null,
			fetchParam2:null,
			secondTitle:null,
			maxRow:10,
			datas:null,
			pk:"",
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
	};
	var defaults=$.extend(true,this.defaults,params);
	var fetchParam=defaults.fetchParam?defaults.fetchParam:defaults.fetchParam={};
	fetchParam.endRow=defaults.maxRow;
};
Newtec.Doubletable.exte(Newtec.Base,'doubletable');
Newtec.Doubletable.over({
	createNewtecJQ:function(params){
		var defaults=this.defaults;
		var newtecJQ=$('<div class="double-table clear-float'+(params.secondTitle&&" showHeader"||"")+'" style="'+(defaults.tmaxHeight&&"max-height:"+defaults.tmaxHeight+"px;"||'')+'position:relative;'+(defaults.is100Height&&" height:100%"||"")+'"></div>');
		newtecJQ.append(this.createTBody(params));
		newtecJQ.append($('<div class="double-table-footer" style="position:absolute;bottom:0;width:100%"></div>'));
		defaults.showPagin&&newtecJQ.find(".double-table-footer").append(this.createPain());
		this.setScrollbars = function(){
			if(!this.defaults.doubletableNoScorll){
				newtecJQ.mCustomScrollbar({
					theme:"minimal-dark",
					scrollInertia:200
				});
			}
		};
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
					var data=response.data||{};
					if(This.defaults.showPagin){
						console.info("----------<<<<<",This.paginFetchData);
						if(!This.paginFetchData){
							var totalRow=Newtec.Utils.toInt(data.total);
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
						if(!This.paginFetchData){
							var totalRow=Newtec.Utils.toInt(data.total);
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
		if(!Newtec.Utils.isNull(params.table2Width)){
			console.warn(this.table1.table)
			this.table1.table.parents(".t-left").css({"position":"absolute","width":"auto","left":"0","right":params.table2Width})
			this.table2.table.parents(".t-right").css({"position":"absolute","right":"0","width":params.table2Width})
		}
		if(!Newtec.Utils.isNull(datas)&&Newtec.Utils.isArray(datas)){
			this.setData(datas);
		}else if(params.autoFetch){
			this.fetchData();
		}
	},
	updateTitle:function(name,title){
		this.table1.updateTitle(name,title);
		this.table2.updateTitle(name,title);
	},
	setData:function(data,append){
		var newData=$.extend(true,[],data);
		console.warn(">>>>>>>>>>>>>>>>>>1",data)
		this.table1.setData(data,append);
		console.warn(">>>>>>>>>>>>>>>>>>2",newData)
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
		var layout=$("<div class='clear-float' style='position:absolute;left:0;right:0;top:0;bottom:50px;'></div>");
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
		isgrow=true,
		callbacksscroll={
					whileScrolling:function(){
						if(!isgrow){
							isgrow=true;
							return;
						}
						isgrow=false;
						console.info("=========<<<<1"+isgrow);
						if($(this).parents().hasClass("t-left")){
							that.lefttop = $(this).children(".mCustomScrollBox").children().css("top");
							table2.newtecJQ.find(".t-tbody-div").mCustomScrollbar("scrollTo",that.lefttop,{scrollInertia:0});
						}
					}
		},
		callbacksscroll2={
				whileScrolling:function(){
					if(!isgrow){
						isgrow=true;
						return;
					}
					isgrow=false;
					console.info("=========<<<<2"+isgrow);
					if($(this).parents().hasClass("t-right")){
						that.righttop = $(this).children(".mCustomScrollBox").children().css("top");
						console.info("tableThis.lefttop-----------------",that.righttop)
						console.info($(this).parents(".t-right").prev())
						table1.newtecJQ.find(".t-tbody-div").mCustomScrollbar("scrollTo",that.righttop,{scrollInertia:0});
					}
				}
		},
		tbParams={
				fields:f1,mode:2,multSelect:true,tBodyNoScorll:false,
				fixed:true,headFixed:false,dbclickRecord:dblclick,callbacksscroll:callbacksscroll,isDouble:true,
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
				doubleChange:function(tableThis){
					var thead = tableThis.thead
					var height = $(thead).css('height')
					//内表格头部
					var innerHead = thead.parents(".t-left").next().find(".newtec-tbody").find("thead")
					innerHead.find("tr").css("height",height);
					//显示表格头部
					var outerHead = thead.parents(".t-left").next().find(".t-thead-div").find("thead")
					outerHead.find("tr").css("height",height);
				},
			},
			tbParams2={
				mode:2,multSelect:false,tBodyNoScorll:false,showHeader:secondTitle?true:false,
				headerTitle:secondTitle||null,fixed:true,dbclickRecord:dblclick,callbacksscroll:callbacksscroll2,isDouble:true,
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
		tbParams.maxHeight=this.defaults.maxHeight;
		tbParams2.maxHeight=this.defaults.maxHeight;
		var table1=Newtec.Table.create(tbParams);
		var table2=0;
		console.info("---secondTitle-<<<",secondTitle);
		this.reSetFields2=function(fs){
			rightLayout.empty();
			tbParams2.fields=fs;
			table2=Newtec.Table.create(tbParams2)
			rightLayout.append(table2.newtecJQ)
			this.table2=table2;
		};
		leftLayout.append(table1.newtecJQ);
		this.table1=table1;
		this.reSetFields2(f2);
		this.rightLayout=rightLayout;
		
		/* 动态表头---开始 */
		var choosefieldsdiv = $("<div class='choosefieldsdiv' style='position:absolute;top:296px;width:200px;right:26px;background:white;border:1px solid #d3d3d3'></div>");
		var topdiv = $("<div class='choosefieldsdiv-top' style='padding:10px;border-bottom:1px solid #d3d3d3;'><span>选择显示的字段</span></div>")
		var middiv = $("<div class='choosefieldsdiv-mid' style='padding:5px;text-align:left;'></div>");
		var botdiv = $("<div class='choosefieldsdiv-bot clear-float' style='padding:10px;border-top:1px solid #d3d3d3;'></div>");
		var oldshownames = [];
		for(var j = 0 ; j < table1.fields.length ; j++ ) {
			var item = table1.fields[j];
			var itemJQ = "<div><input type='checkbox' class='itemfield' style='margin-right:10px;'>"+item['title']+"</div>"
			oldshownames.push(item['name']);
			middiv.append($(itemJQ))
		}
		middiv.on("click","input",function(){
			if($(this).parent().hasClass("select")){
				$(this).parent().removeClass("select")
				$(this).removeAttr("checked");
			}else{
				$(this).parent().addClass("select")
				$(this).prop("checked","true");
			}
		});
		
		botdiv.append(Newtec.Button.create({title:"取消",className:'pull-left btn2',
			click:function(){
				that.choosefieldsdiv.css("display","none");
			},
		}).newtecJQ).append(Newtec.Button.create({title:"确认",className:'pull-right btn-red',
			click:function(){
				var shownames = [],hidenames=[],showtitles = [],hidetitles=[];
				var begin = 0,len = $(that.table1.tbodyHead[0]).children("tr").children().length;
				var itemJQ = $(that.table1.tbodyHead[0]).children("tr").children();
				if(table1.defaults.multSelect){
					begin = 1;
				}
				if(table1.defaults.trBtnFun){
					len = len-1;
				}
				for(var i = 0 ; i < middiv.children().length ; i++ ) {
					var div = middiv.children().eq(i);
					if(div.hasClass("select")){
						showtitles.push(div.text());
						for(var j = 0 ; j < table1.fields.length ; j++ ) {
							if(table1.fields[j].title==div.text()){
								shownames.push(table1.fields[j].name);
							}
						}
					}else{
						hidetitles.push(div.text());
						for(var j = 0 ; j < table1.fields.length ; j++ ) {
							if(table1.fields[j].title==div.text()){
								hidenames.push(table1.fields[j].name);
							}
						}
					}
				}
				
				if(!Newtec.Utils.isNull(shownames)&&!Newtec.Utils.isNull(hidenames)){
					that.table1.showThead(shownames);
					that.table1.hideThead(hidenames);
					console.info(that);
					console.info($(that.table1.tbodyHead[0]))
					for(begin ; begin < len ; begin++ ) {
						var title = $(itemJQ[begin]).text();
						var flag = false;
						for(var x = 0 ; x < showtitles.length ; x++ ) {
							if(showtitles[x]==title){
								$(itemJQ[begin]).css("display","");
								flag = true;
								break;
							}
						}
						if(!flag){
							$(itemJQ[begin]).css("display","none");
						}
					}
//					var interwidth = $(itemJQ[0]).css("width");
//					$(that.table1.thead[0]).find("tr").find("#c").css("cssText","width: "+interwidth+" !important;");
//					$(itemJQ[0]).css("cssText", "width:21px !important;");
				}else if(Newtec.Utils.isNull(shownames)){
					that.hideThead(hidenames);
					for(begin ; begin < len ; begin++ ) {
						$(itemJQ[begin]).css("display","none");
					}
				}else{
					that.showThead(shownames);
					for(begin ; begin < len ; begin++ ) {
						$(itemJQ[begin]).css("display","");
					}
				}
				that.choosefieldsdiv.css("display","none");
			},
		}).newtecJQ);
		choosefieldsdiv.append(topdiv).append(middiv).append(botdiv);
		this.choosefieldsdiv = choosefieldsdiv;
		
		rightLayout.on("click",".glyphicon-menu-hamburger",function(){
			if(!$(this).parents("body").children().hasClass("choosefieldsdiv")){
				$(this).parents("body").css("position","relative");
				$(this).parents("body").append(that.choosefieldsdiv);
			}else{
				that.choosefieldsdiv.css("display","block");
			}
			var lefttable = $(this).parents(".t-right").prev();
			var divitems = lefttable.find(".t-thead-div").find("tr").children("th");
			for(var i = 0 ; i < divitems.length ; i++ ) {
				var field = divitems.eq(i);
				var mid = that.choosefieldsdiv.find(".choosefieldsdiv-mid");
				for(var y = 0 ; y < mid.children().length ; y++ ) {
					var item = mid.children().eq(y);
					if(field.text()==item.text()&&field.css('display')!="none"){
						item.addClass("select");
						item.find("input").prop("checked","true");
					}
				}
			}
		})
		
		return layout.append(leftLayout).append(rightLayout);
	},
	/* 结束 */
	showThead:function(names){
		if(Newtec.Utils.isNull(names)){//显示整个表头
			Newtec.Window.createHint({html:'<span>参数为空！<span>'});
			return;
		}
		var thWs=0;
		if(Newtec.Utils.isArray(names)){
			for(var i=0;i<names.length;i++){
				var name = names[i];
				$("#"+this.table1.getThFilterId(name)).css('display','');
				var th=$("#"+this.table1.getThtdId(name));
				th.css('display','');
//				var thW=th.outerWidth()<=0?150:th.outerWidth();
				var thW=th.outerWidth()<=0?150:150;
				thWs+=thW;
				var len = this.table1.pageDatas.length;
				for(var row=0;row<len;row++){
					$("#"+this.table1.getTdId(row,name)).css('display','');
				}
			}
		}else if(Newtec.Utils.isString(names)){
			$("#"+this.table1.getThFilterId(names)).css('display','');
			var th=$("#"+this.table1.getThtdId(names));
			th.css('display','');
			var thW=th.outerWidth()<=0?150:150;//假如没有列宽，则设置150px
			thWs=thW;
			var len = this.table1.pageDatas.length;
			for(var row=0;row<len;row++){
				$("#"+this.table1.getTdId(row,names)).css('display','');
			}
		}
		var width=this.table1.tbodyDiv.width()+thWs;
		this.table1.tbodyDiv.css('width',width+"px");
		this.table1.thead.css('width',width+"px");
		this.table1.table.find('.mCustomScrollBox .mCSB_container').css('width',width+"px");
		this._RemCustomScrollbar(this.table1);
		this.table1.setFieldsValue(names, "table-hidden", "false");
		this.table1.first=false;
		this._setTdWidth(this.table1);
	},
	hideThead:function(names){
		if(Newtec.Utils.isNull(names)){//隐藏列
			Newtec.Window.createHint({html:'<span>参数为空！<span>'});
			return;
		}
		var thWs=0;
		if(Newtec.Utils.isArray(names)){
			for(var i=0;i<names.length;i++){
				var name = names[i];
				var th=$("#"+this.table1.getThtdId(name));
				$("#"+this.table1.getThFilterId(name)).css('display','none');
				th.css('display','none');
				thWs+=th.outerWidth();
				var len = this.table1.pageDatas.length;
				for(var row=0;row<len;row++){
					$("#"+this.table1.getTdId(row,name)).css('display','none');
				}
			}
		}else if(Newtec.Utils.isString(names)){
			var th=$("#"+this.table1.getThtdId(names));
			$("#"+this.table1.getThFilterId(names)).css('display','none');
			th.css('display','none');
			thWs=th.outerWidth();
			var len = this.table1.pageDatas.length;
			for(var row=0;row<len;row++){
				$("#"+this.table1.getTdId(row,names)).css('display','none');
			}
		}
		var width=this.table1.tbodyDiv.outerWidth()-thWs;
		width=this.table1.table.width()>width?this.table1.table.outerWidth():width;
		this.table1.tbodyDiv.css('width',width+"px");
		this.table1.thead.css('width',width+"px");
		this.table1.table.find('.mCustomScrollBox .mCSB_container').css('width',width+"px");
		this._RemCustomScrollbar(this.table1);
		this.table1.setFieldsValue(names, "table-hidden", "true");
		this.table1.first=false;
		this._setTdWidth(this.table1);
	},
	
	setFieldsValue:function(names,attr,value){
		if(Newtec.Utils.isNull(names)||Newtec.Utils.isNull(attr)||Newtec.Utils.isNull(value)){
			Newtec.Window.createHint({html:'<span>参数为空！<span>'});
			return;
		}
		var fields = this.table1.fields;
		if(Newtec.Utils.isArray(names)){
			var index=0;
			var len=names.length;
			for(var i=0;i<fields.length;i++){
				var f=fields[i];
				console.warn("xxxx")
				console.info(f);
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
	},
	getRowRecord:function(obj){
		if(Newtec.Utils.toInt(obj,-99) != -99){//是行索引
			return this.pageDatas[obj];
		}else if(Newtec.Utils.isString(obj)){
			var len = this.table1.pageDatas.length;
			for(var i=0;i<len;i++){
				var data = this.pageDatas[i];
				if(data[this.NEWTEC_TR_ID] == obj || data[this.pk]==obj) return data;
			}
		}else{
			return obj;
		}
	},
	getSelectedRecords:function(){
		if(this.table1.multSelect==false){//单选
			var selectRecord=this.table1.selectRecord;
			console.info("selectRecord==",selectRecord)
			return selectRecord&&$.extend(true,{},selectRecord)||null;
		}
		//多选
		var values = [];
		var table = this.table1;
		var tableThis = this;
		console.info($("input[name='"+table.getTrCheckName()+"']:checked"));
		$("input[name='"+table.getTrCheckName()+"']:checked").each(function(){
			values.push(table.getRowRecord($(this).val()));
		});
		return values.length>0?$.extend(true,[],values):null;
	},
	getTrCheckName:function(){
		return this.id+"_rcn";
	},
	getThFilterId:function(name){
		return this.getThtdId(name)+'_filter';
	},
	getThtdId:function(name){
		return this.id+'_'+name;
	},
	getTdId:function(row,name){
		return this.id+"_"+name+"_"+row;
	},
	getCheckeboxWidth:function(){
		return Newtec.Utils.toInt(this.defaults['checkeboxWidth'],30)+"px";
	},
	updateRecords:function(records,isAdd){
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
						this._setTdWidth(this.table1);
					}
					break;
				}
			}
			//console.info(this.pageDatas);
		}
	},
	removeRecords:function(records){
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
				this.table1.pageDatas.splice(rowIndex, 1);
				this.selectRecord=null;
				this.setTotalpage(this.totalNum-1,this);
			}
			if(rowIndex==0){
			   this._setTdWidth(this.table1);
			}
		}
	},
	getRowIndex:function(obj){
		if(Newtec.Utils.toInt(obj,-99) != -99){//是行索引
			return obj;
		}else{
			if(Newtec.Utils.isJson(obj)){
				obj = obj[this.NEWTEC_TR_ID];
			}
			var len = this.table1.pageDatas.length;
			for(var i=0;i<len;i++){
				var data = this.table1.pageDatas[i];
				if(data[this.NEWTEC_TR_ID] == obj || data[this.pk]==obj) return i;
			}
		}
	},
	setTotalpage:function(total,tableThis){
		tableThis.pagin.createPagin(total);
	},
	_RemCustomScrollbar:function(tableThis){
    	tableThis.table.mCustomScrollbar("update");
    	tableThis.tbodyDiv.mCustomScrollbar("update");
    },
	_setTdWidth:function(tableThis,setWidth){
		if(!tableThis.isSetScrollbar&&setWidth){
			tableThis.setScrollbar();
			this.setScrollbars();
			tableThis.isSetScrollbar=true;
		}
		var theadTh=tableThis.theadTh;
		var tbodyTh=tableThis.tbodyTh;
		var len=theadTh.length;//不设置最后一个宽度
		var defaults=tableThis.defaults
		if(defaults.fixed&&defaults.headFixed){
			var tdWidth=defaults.tdWidth
			var fields = tableThis.fields;
			$(tbodyTh[i]).outerWidth()
			var totalW=tableThis.thead.outerWidth();
			var userWidth=0;
			var count=0;
			for(var i=0;i<len;i++){
				var field=fields[i];
				if(field.width){
					var width=field.width;
					count++;
					userWidth+=Newtec.Utils.isString(width)&&width.indexOf('%')?Newtec.Utils.toInt(width,0)/100*userWidth:Newtec.Utils.toInt(width,0);
				}
			}
			totalW=(totalW-userWidth)/len-count;
			totalW=totalW<tdWidth?tdWidth:totalW
			for(var i=0;i<len;i++){
				var field=fields[i];
				if(!field.width){
					$(theadTh[i]).css("width",totalW);
					$(tbodyTh[i]).css("width",totalW);
				}
			}
			
		}else{
			for(var i=0;i<len;i++){
				$(theadTh[i]).css("width",$(tbodyTh[i]).outerWidth());
			}
		}
	},
});
	Newtec.Module("Doubletable")
})();