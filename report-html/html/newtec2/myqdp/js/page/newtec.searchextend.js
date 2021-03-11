/**
 * 描述：定义最基本的三层结构：top ,content,foot
 * 页面：通用页面
 * @author wmk
 */
(function () {
	if(Newtec.SearchExtendPage){
		console.error("newtec.compage.js已经存在");
		return ;
	}
	Newtec.Compage||Newtec.Utils.addJS("newtec.compage.js","myqdp/js/page/widget/");
	Newtec.MySelect||Newtec.Utils.addJS("newtec.myselect.js","myqdp/js/widget/");
	Newtec.Table||Newtec.Utils.addJS("newtec.table.js","myqdp/js/widget/")
	if(!Newtec.TreeGrid){
		Newtec.Utils.addJS("newtec.treegrid2.0.js","myqdp/js/widget/")
		Newtec.Utils.addCSS("jquery.treegrid.css","thirdparty/jquery-treegrid/css/")
		Newtec.Utils.addJS("jquery.treegrid.js","thirdparty/jquery-treegrid/js/")
		Newtec.Utils.addJS("jquery.cookie.js","thirdparty/jquery-treegrid/js/")
	}
    Newtec.SearchExtendPage = function (params) {
        //默认
        this.defaults = {
        	appendTo:'body',
        	showPContent:true,
        	is100:true,
        	leftTitle:"信息资源列表",
        	treeParam:{
	    		 expand:false,
	    		 autoFetch:true,
	    		 showRightMenu:false,
	    	     showCheckbox:false,
	    		 tdStyle:'white-space: nowrap;',
	    		 fetchParam:{
	    			 operId:'getAllTypeListOnLine',
	    			 data:{type:0}
	    		 },
	    	 },
	    	rightTitle:'目录分类关联',
	    	tableParam:{
	    		fields:[{name:'name',title:'名称'}]
			 	,showHeader:false
				,showFetchForm:false
				,showFilter:false
				,showMoreBtn:false
				,autoFetch:true
				,trBtnWidth:50
				,height:'100%'
	    	},
	    	showReSetBtn:true,//重置按钮
	    	inputKey:{'name':"请输入资源目录名称"},//输入框配置
	    	seleteParams:[{data:{'全部':"全部"}}],//下拉框配置
	    	seleteParam:{name:'type',search:false,isCenter:false,showDownIcon:true},//下拉框通用配置
	    	btns:null,
	    	showDepBtn:false,
	    	depBtnTitle:'请选择提供方',
        };
        this.modelDs=params.treeDs||Newtec.DS.get("infoType");
        this.UrlParam=null;
    };
    Newtec.SearchExtendPage.exte(Newtec.Compage, 'searchExtendPage');
    Newtec.SearchExtendPage.over({
    	setContentBody: function (params) {
    		var ly=$("<div class='c-main'></div>");
    		ly.append(this.getLeftBody(params))
    		.append(this.getRightBody(params));
    		return ly;
        },
    	getLeftBody:function(params){
    		var ly=$("<div class='c-left'>" +
    				"<div class='c-title'><i class='glyphicon glyphicon-asterisk'/>"+(params.leftTitle||"")+"</div>" +
    				"</div>");
    		var treeLy=$("<div class='l-content l-tree'></div>");
    		var treeBody=$("<div></div>");
    		treeBody.append(this.getTreeBody(params));
    		treeLy.append(treeBody);
    		ly.append(treeLy);
    		
    		
    		this.treeBody=treeBody,this.treeLy=treeLy;
    		setTimeout(function () {
    			treeLy.mCustomScrollbar({
	                    theme: "minimal-dark",
	                    scrollInertia: 200
	                });
	            }, 500);
            setTimeout(function () {
            	treeBody.mCustomScrollbar({
                    theme: "minimal-dark",
                    scrollInertia: 200,
                    axis:"x"
                });
            }, 500);
    		return ly;
    	},	
    	getTreeBody:function(params){
    		var treeParam=params.treeParam||{};
    		var selectId="",that=this;
    		treeParam.onClick=treeParam.onClick||function(trDom){
	       		 var data=tree.getSelectedRecords();
	       		 if(selectId==data.id)return;
	   			 selectId=data.id;
	   			 that.fetchData({data:{selectId:selectId=="0ca53d2390da412c9bebac874ae0042c"?null:selectId}});
	       	};
	       	treeParam.ds=treeParam.ds||this.modelDs;
	       	var tree=Newtec.TreeGrid.create(treeParam);
	       	this.tree=tree;
	       	setTimeout(function(){
	       	 	var roots = tree.getRootNodes();
		       	tree.expand(roots);
	       	}, 500)
	      
	       	return tree.newtecJQ;
    	},
    	getRightBody:function(params){
    		var ly=$("<div class='c-right'>" +
    				"<div class='c-title'><i class='glyphicon glyphicon-asterisk'/>"+(params.rightTitle||"")+"</div>" +
    				"</div>");
    		var extendBtns=params.extendBtns;
    		var content=$("<div class='l-content "+(extendBtns&&"has-btn")+"'></div>");
    		ly.append(content)
    		content.append(this.getRightHeadBody(params))
    		extendBtns&&content.append(this.getExtendBtns(extendBtns,params))
    		content.append(this.getRightTableBody(params))
    		return ly;
    	},
    	getRightHeadBody:function(params){
    		var ly=$("<div class='r-head clear-float'></div>");
    		var inputKey=params.inputKey,that=this,showDepBtn=params.showDepBtn;
    		if(inputKey){
    			var inputDiv=$("<div class='head-item'></div>");
    			ly.append(inputDiv)
    			for(var key in inputKey){
    				var inputJQ=$("<input type='text' autocomplete='off' name='"+key+"' placeholder='"+(inputKey[key]||"")+"'/>")
    				inputDiv.append(inputJQ);
    				inputJQ.on('keyup',function(event) {
        				if (event.keyCode == 13) {
        					that.fetchData();
        				}
        			});
    			}
    			
    			this.inputDiv=inputDiv;
    		}
    		if(showDepBtn){
    			var inputDiv=$("<div class='head-item'></div>");
    			ly.append(inputDiv)
    			var inputJQ=$("<input type='text'  readonly='readonly' autocomplete='off' name='depId' placeholder='"+params.depBtnTitle+"'/>")
    			inputDiv.append(inputJQ)
    			this.inputDiv2=inputDiv;
    			var win=0;
    			inputJQ.click(function(){
    				if(win){
    					win.show();
    					return;
    				}
    				var tree=Newtec.TreeGrid.create({
    					 ds:'model',
    		    		 expand:false,
    		    		 autoFetch:true,
    		    		 showRightMenu:false,
    		    	     showCheckbox:false,
    		    		 tdStyle:'white-space: nowrap;',
    		    		 fetchParam:{
    		    			 operId:'getDepartment',
    		    		 },
    		    	 });
    				win=Newtec.Window.create({
    					title:'部门',
    					body:tree,
    					height:600,
    					width:600,
    					remove:false,
    					footer:Newtec.Button.create({
    						title:"确认",
    						className:'green-btn',
    						click:function(){
    							var data=tree.getSelectedRecords();
    							if(!data){
    								Newtec.Window.hint("未选择任何数据");
    							}
    							inputJQ.val(data.name);
    							that.fetchData({data:{depId:data.id,depName:data.name}});
    							win.close();
    						}
    					})
    				});
    				win.finsh=function(){
    					var roots = tree.getRootNodes();
    			       	tree.expand(roots);
    				}
    			})
    		}
    		var seleteParams=params.seleteParams
    		if(seleteParams){
    			var selectDiv=$("<div class='head-item'></div>");
    			ly.append(selectDiv);
    			var seleteParam=params.seleteParam;
        		for ( var i = 0; i < seleteParams.length; i++) {
        			var sParam=seleteParams[i];
        			$.extend(true,sParam,seleteParam);
        			sParam.change=sParam.change||function(myselet,element, checked, value,name){
        				var data={};
        				data[sParam.name]=name;
        				that.table&&that.fetchData({data:data});
        			}
        			var sel=Newtec.MySelect.create(sParam);
        			selectDiv.append(sel.newtecJQ);
        		}
    		}
    		var btns=params.btns||[];
    		btns.insert({title:'查询',className:'search-btn',click:function(){
    			that.fetchData();
    		}});
    		btns.push({title:'重置',className:'default',click:function(){
    			that.inputDiv&&that.inputDiv.find("input").val("");
    			that.inputDiv2&&that.inputDiv2.find("input").val("");
    			that.fetchData({data:{depId:'',depName:''}});
    		}})
    		if(btns){
    			var btnDiv=$("<div class='head-item'></div>");
    			ly.append(btnDiv)
    			for(var i=0;i<btns.length;i++){
    				var newtecJQ=Newtec.Button.create(btns[i]).newtecJQ
    				btnDiv.append(newtecJQ);
    			}
    		}
    		if(params.rightBtn){
    			var rightBtn=params.rightBtn;
    			var btnDiv=$("<div class='head-item-right'></div>");
    			ly.append(btnDiv)
    			for(var i=0;i<rightBtn.length;i++){
    				var newtecJQ=Newtec.Button.create(rightBtn[i]).newtecJQ
    				btnDiv.append(newtecJQ);
    			}
    		}
    		return ly;
    	},
    	getExtendBtns:function(extendBtns,params){
    		var ly=$("<div class='ext-btn'></div>");
    		for(var i=0;i<extendBtns.length;i++){
				var newtecJQ=Newtec.Button.create(extendBtns[i]).newtecJQ
				ly.append(newtecJQ);
			}
    		return ly;
    	},
    	getRightTableBody:function(params){
    		var tableParam=params.tableParam,
        	table=0;
    		tableParam.ds=tableParam.ds||this.modelDs;
    		if(params.tableBtn){
    			var tableBtnClick=params.tableBtnClick
    			tableParam.trBtnFun=function(row,data,tr,td){
    				return Newtec.Nav.create({data:params.tableBtn,click:function(value,name){
    					console.info(data,value,name);
    					tableBtnClick&&tableBtnClick(data,value,name)
    				}}).newtecJQ;
    			}
    		}
    		this.table=table=Newtec.Table.create(tableParam);
    		
    		return table.newtecJQ;
    	},
    	fetchData:function(parmas){
    		if(this.inputDiv){
    			parmas=parmas||{};
    			var data=parmas.data=parmas.data||{};
    			var inputDiv=this.inputDiv
    			inputDiv.find("input").each(function(){
    				console.info($(this).attr('name'));
    				var jq=$(this);
    				var value=jq.val()||"";
    				value=value.trim()
    				data[jq.attr('name')]=value||null;
    			});
    		}
 
    		this.table.fetchData(parmas);
    	},
    });
    Newtec.Module("SearchExtendPage")
})();