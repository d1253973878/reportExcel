/**
 * 描述：定义最基本的三层结构：top ,content,foot
 * 页面：通用查询页面
 * @author wmk
 */

Newtec.Component(['Compage','Table','Form']
,function () {
	console.info("=====SearchPage=====SearchPage===")
	if(Newtec.SearchPage){
		console.error("newtec.compage.js已经存在");
		return ;
	}
	console.info("=====SearchPage========")
    Newtec.SearchPage = function (params) {
    	var defaults=this.defaults;
    	var wParams =Newtec.Params.widget;
    	defaults.topHint=wParams.HINTTITLE;
    	defaults.btnClass=wParams.BTNSUCCESS;
    	//新增按钮
    	defaults.showAddBtn=1;
    	defaults.addTitle=wParams.ADDTITLE;
    	defaults.addClass=wParams.BTNSUCCESS;
    	defaults.addWinTitle=defaults.addTitle+wParams.WINTITLE;
    	defaults.winOkTitle=wParams.OK;
    	defaults.winNOTitle=wParams.NO;
    	//删除按钮
    	defaults.showDeleteBtn=1;
    	defaults.deleteTitle=wParams.DELETETITLE;
    	defaults.deleteClass=wParams.BTNDANGER;
    	defaults.searchKey="name";
    	defaults.className="searchpage";
    	defaults.tableParam={
    			autoFetch:true,
    			fetchParam:{
    				data:{}
    			}
    	}
    };
    Newtec.SearchPage.exte(Newtec.Compage, 'searchpage');
    Newtec.SearchPage.over({
    	initParams:function(params){
    		var ds=params.ds; 
        	this.ds=Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
        	//params.tableParam=params.tableParam||{}
        	//addClickFun
        	//createFieldBefore
    	},
        setTopBody:function(params,page){
        	var divJQ=$('<div class="clear-float"></div>');
        	divJQ.append(this.getSearchBody(params))
        	divJQ.append(this.getBtnDiv(params))
        	return divJQ;
        },
        getSearchBody:function(params){
        	var that=this;
        	var searChBody=$("<div class='t-item search-div' id='testId'>"+
					"<input class='search-input' maxLength='"+(params.maxLength||50)+"' placeholder='"+(params['topHint']||"")+"'  id='searchValue'/>"+
					"<button class='glyphicon glyphicon-search' id='searchBtn'></button>"+
			"</div>");
        	var searchValueJQ=searChBody.find("#searchValue");
        	var searchKey=params.searchKey
        	searchValueJQ.on('keyup',function(event) {
				if (event.keyCode == 13) {
					var data={};
					data[searchKey]=Newtec.Utils.dealLikeSpChart(searchValueJQ.val());
					that.fetchData({data:data});
				}
			});
			searChBody.on("click","#searchBtn",function(){
				var data={};
				data[searchKey]=Newtec.Utils.dealLikeSpChart(searchValueJQ.val());
				that.fetchData({data:data});
			});
        	
        	return searChBody;
        },
        fetchData:function(params){
        	this.table.fetchData(params);
        },
        getBtnDiv:function(params){
        	var that=this;
        	var btns=params.btns||[];
        	
        	params['showAddBtn']&&btns.push(this.getAddBtn(params))
        	params['showDeleteBtn']&&btns.push(this.getDeleteBtn(params))
        	var len=btns.length;
        	if(len>0){
        		var btnDiv=$("<div class='t-item pull-right'></div>");
        		var btnClass=params['btnClass']
        		for(var i=1,btn=btns[0];i<=len;btn=btns[i++]){
        			btn.className=btn.className||btnClass;
        			btnDiv.append(Newtec.Button.create(btn).newtecJQ)
        		}
        		return btnDiv;
        	}
        },
        setContentBody:function(params,page){
        	console.info(params);
        	var f=[],data=[];
        	for(var i=0;i<7;i++){
        		f.push({name:'name_'+i,title:"列头_"+i})
        	}
        	for(var i=0;i<20;i++){
        		var d={};
        		for(var j=0;j<f.length;j++){
            		d[f[j]['name']]="内容——"+i;
            	}
        		data.push(d);
        	}
        	var tableParam=params.tableParam||{};
        	tableParam.ds=this.ds;
        	tableParam.showHeader=false;
        	tableParam.showFetchForm=false;
        	tableParam.showHeader=false;
        	tableParam.showHeaderBtn=false;
        	tableParam.height='100%';
        	console.info("---------,.m,.,.",tableParam);
        	var table=Newtec.Table.create(tableParam);
        	Newtec.Utils.isFunction(params.dbclick)&&table.setDbclickRecord(params.dbclick)
        	this.table=table;
        	var div = $("<div style = 'padding:10px; background:white; height:100%'></div>")
        	var btnData = this.getPageBtnData(params)
        	if(btnData && btnData.length > 0){
        		div.css("height","95%")
        		var btnDiv = $("<div style = 'margin-bottom: 10px;' ></div>")
        		for(var i = 0 ; i < btnData.length ; i++){
        			var btn = Newtec.Button.create({
        				title: btnData[i].title,
        				className: i == 0 ? btnData[i].className : btnData[i].className+" margin10",
        				click: Newtec.Utils.isFunction(btnData[i].click) && btnData[i].click
        			})
        			btnDiv.append(btn.newtecJQ)
        		}
        		div.append(btnDiv)
        	}
        	return div.append(table.newtecJQ);
        },
        getPageBtnData : function(params){
        	return [];
        },
        createPageAfter:function(){
        	var newtecJQ=this.newtecJQ,
        	pageTopJQ=this.pageTopJQ,
        	pageContentJQ=this.pageContentJQ,
        	pageFootJQ =this.pageFootJQ;
        	function setHeight(){
        		var tHeight=pageTopJQ&& pageTopJQ.outerHeight()||0;
        		var fHeight=pageFootJQ&& pageFootJQ.outerHeight()||0;
        		pageContentJQ.css({top:tHeight,bottom:fHeight})
        	}
        	pageTopJQ&&pageTopJQ.resize(function(){
        		setHeight();
        	})
        	pageFootJQ&&pageFootJQ.resize(function(){
        		setHeight();
        	})
        	
        	setHeight();
        },
        getAddBtn:function(params){
        	var that=this,ds=this.ds;
        	var title=params['addTitle'];
        	var tdd=0;
        	console.info("title=<"+title,params['addWinTitle'],params);
        	return {
        		title:title,className:params['addClass']
        		,click:params['addClickFun']||function(e){
        			tdd=tdd||that.table;
        			 var addFormParam = {
            				 titleColumn: 4,
            				 columnNum: 3,
            				 operType:Newtec.DS.OperType.add,
            				 ds: ds,
            				 createFieldBefore:params['createFieldBefore']
            		 };
        			 var form = Newtec.Form.create(addFormParam);// form結束,
        			var win=Newtec.Window.create({
        				title:params['addWinTitle'],
        				body:form,
        				footer:Newtec.Button.create({
        					title:params['winOkTitle'],
        					click:function(){
        						if(form.validate()){
        							 Newtec.Window.createAdd(function (bool) {
            							 if (bool == false) return;
            							 var values = form.getAllValues();
            							 var addBefore = params['addBefore'];
            							 if(Newtec.Utils.isFunction(addBefore)){
            								 if(addBefore(values)==false) return ;
            							 }
            							 tdd.addData(values, params["addId"], function (response) {
            								 if(response.status==0){
            									 win.close();
            									 that.hint( '<span>'+title+'成功！<span>');
            								 }else{
            									 that.hint(response.error,null,null, 'btn btn-danger');
            								 }
            								Newtec.Utils.isFunction(params['addAfter'])&& params['addAfter'](response)
            							 });
            						 });
        						}
        					}
        				})
        			});
        		}
        	};
        },
        getDeleteBtn:function(params){
        	var that=this,ds=this.ds;
        	var title=params['deleteTitle'];
        	var tdd=0;
        	return {
        		title:title,className:params['deleteClass']
        		,click:params['deleteClickFun']||function(e){
        			tdd=tdd||that.table;
	            	var datas = tdd.getSelectedRecords();
            		if (!Newtec.Utils.isArray(datas)||datas.length <= 0) {
            			Newtec.Window.createHint({html: '请选择要删除的记录！', className: 'btn btn-danger'});
            			return;
            		}
	            	var removeFun=params.removeFun;
	            	if(Newtec.Utils.isFunction(removeFun)){
	            		removeFun(datas,tdd,params,this);
	            	}else{
	            		Newtec.Window.createDelete(function (bool) {
	            			if (bool == false) return;
	            			var removeBefore = params['removeBefore'];
	            			if(Newtec.Utils.isFunction(removeBefore)){
	            				if(removeBefore(datas)==false) return ;
	            			}
	            			tdd.removeData(datas,params["removeId"], function (response) {
	            				if(response.status==0){
	            					Newtec.Window.createHint({html: '<span>'+removeTitle+'成功！<span>'});
	            				}else{
	            					Newtec.Window.createHint({html: response.error, className: 'btn btn-danger'});
	            				}
	            				
	            				var removeAfter = params['removeAfter'];
	            				if(Newtec.Utils.isFunction(removeAfter)){
	            					removeAfter(response);
	            				}
	            			});
	            		});
	            	}
	            
        		}
        	};
        }
    });
    Newtec.Module("SearchPage")
});