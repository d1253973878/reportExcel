Newtec.Component(["Compage","Form","Table","TreeGrid"],
["page/power/person/personCreate.css"],
function(){
	if(Newtec.PersonCreate){
			console.error("newtec.compage.js已经存在");
			return ;
		}
//		if(!Newtec.TreeGrid){
//			Newtec.Utils.addJS("newtec.treegrid2.0.js","myqdp/js/widget/")
//		}
		    Newtec.PersonCreate = function (params) {
		    	var treeDs=params.treeDs||"department"
		    	treeDs=Newtec.Utils.isString(treeDs)?Newtec.DS.get(treeDs):treeDs;
		    	this.treeDs=treeDs;
		    	var tableDs=params.tableDs||"person";
		    	tableDs=Newtec.Utils.isString(tableDs)?Newtec.DS.get(tableDs):tableDs;
		    	this.tableDs=tableDs;
		        //默认
		        this.defaults = {
		        	
		        	appendTo:'body',
		        	showPContent:true,
		        	is100:true,
		        	leftTitle:"部门机构",
		        	leftHint:"部门机构名称",
		        	fisrtShowTree:true,
		        	showLeft:true,
		        	showLeftTree:true,
		        	showLeftTable:true,
		        	searchName:'name',
		        	menus:null,//array
		        	treeParam:{
		        		 ds:treeDs,
		        		  loadStepBS:true,
			    		 expand:false,
			    		 showRightMenu:false,
			    	     showCheckbox:false,
			    	     autoFetch: false,
			    		 tdStyle:'white-space: nowrap;',
			    		 fetchParam:{
			    			 operId:'getAbleDepsParentByPersonId',
			    			 data:{isLoad:"isLoad"}
			    		 },
			    		 tdValueHtmlFun: function(name,value,param){
			    			 var depId = Newtec.Person.get().depId;
			    			 if(param.sourceId== "-1"){
			    				 return '<span style="color:#adaaaa">'+ value +'</span';
			    			 }else if(param.id == depId){
			    				 return '<span style="color:#2277ee">'+ value +'</span';
			    			 }
			    			 return value;
			    		 }
			    	 },
			    	 lTableParam:{
			 				multSelect:false
			 				,fields:[{name:'name',title:'模型名称'}]
			 				,mode:2
			 				,height:'100%'
			 				,showThead:false
			 				,fetchParam:{operId:"getModeTree"}
			 				
			 			},
			    	tableParam:{
			    		ds: tableDs,
			    		fields:[{name:'name',title:'名称'}, 
			    			{name: "userName",title: "账号"},
			    			{name: "depName",title: "所属部门"},
			    			{name: "useStatus",title: "禁止状态"},
			    			{name: "banStatus",title: "停封状态"},
			    			{name: "lockStatus",title: "锁定状态"},]
					 	,showHeader:false
						,showFetchForm:false
						,fetchParam: {operId: "getPersonsBydepId"}
						,showFilter:false
		//				,multSelect: false
						,showMoreBtn:false
						,autoFetch:false
						,showPagin: true
						,mode: '2'
						,height:'100%'
						,tdValueHtmlFun:function(value,data,a,b,colName){
							if(colName=="useStatus"){
								value = value==0?"启用":"禁止";
				    		}
							if(colName=="banStatus"){
								value = value==0?"解封":"停封";
				    		}
							if(colName=="lockStatus"){
								value = value==0?"解锁":"锁定";
				    		}
							return value || ""
						}
			    	},
			    	showReSetBtn:true,//重置按钮
			    	inputKey:{'name':"请输入人员名称"},//输入框配置
		//	    	seleteParams:[{data:{'全部':"全部"}}],//下拉框配置
			    	seleteParam:{name:'type',search:false,isCenter:false,showDownIcon:true},//下拉框通用配置
			    	btns:null,
			    	showDepBtn:false,
		        };
		//        this.modelDs=params.treeDs||Newtec.DS.get("infoType");
		        this.UrlParam=null;
		    };
		    Newtec.PersonCreate.exte(Newtec.Compage, 'personCreate');
		    Newtec.PersonCreate.over({
		    	setContentBody: function (params) {
		    		var ly=$("<div class='c-main'></div>");
		            this.leftJQ = this.getLeftBody(params);
		    		ly.append(this.leftJQ).append(this.getRightBody(params));
		    		params.treeParam.autoFetch||this.getTreeData();
		    		ly.append("<div style='clear:both'></div>");
		    		return ly;
		        },
		        //左边的部门树
		    	getLeftBody:function(params){
		    		var ly=$("<div class='c-left'></div>");
		    		ly.append("<div class='c-title'>"+(params.leftTitle||"")+"</div>"+
		    				"<div class='search-div' style='padding: 5px 10px;background:#ddd;'>"+
	    					"<input type='text' maxlength='50' placeholder='"+(params.leftHint)+"' id='searchValue' style='width:240px; height: 30px;text-indent:10px'/>"+
	    					"<button id='searchBtn' style='height: 30px;width:50px;top:4px' class='glyphicon glyphicon-search'></button>"+
	    				"</div>");
		    		var treeLy=$("<div class='l-content l-tree'></div>");
		    		var treeBody=$("<div></div>");
		    		treeBody.append(this.getTreeBody(params));
		    		treeLy.append(treeBody);
		    		ly.append(treeLy);
		    		this.treeBody=treeBody,this.treeLy=treeLy;
		    		showLeftTree=params['showLeftTree']!==false,
		        	showLeftTable=params['showLeftTable']!==false,
		        	that=this;
		        	this.showLeftTree=showLeftTree;
		    		
		        	var allDataTree=0,
					tree=this.tree,table=this.lTable;
					allDataTable=0,searchName=params.searchName,		     
		        
		    		ly.on('click','#searchBtn',function(event) {
		    			var input=ly.find('input');
		    			setData(input.val());
		    		});
					
					function setData(searchWord){
						allDataTree=showLeftTree&&(allDataTree||tree.treeGridJsonData);
						allDataTable=showLeftTable&&(allDataTable);
						searchWord=searchWord.replace(/\s*/g,"");
						console.info("searchWord",searchWord)
						if(Newtec.Utils.isNull(searchWord)){
							var tagDatas=[];
							for ( var key in allDataTree) {
								var data1=allDataTree[key]
								delete data1.children;
								tagDatas.push(data1);
							}
							showLeftTree&&tree.setData(tagDatas);
							showLeftTable&&allDataTable&&table.setData(allDataTable);
						}else{
							var tagDatas= [],tagId={};
							if(showLeftTree){
								for (var key in allDataTree) {
									var data=allDataTree[key];
									delete data.children;
									if(data['name'].indexOf(searchWord)>=0){
										var parentId=data.parentId;
										if(!tagId[parentId]){
											while(!tagId[parentId]&&allDataTree[parentId]){
												tagDatas.push(allDataTree[parentId]);
												tagId[parentId]=true;
												parentId=allDataTree[parentId]['parentId'];
											}
										}
										tagId[key]=true;
										tagDatas.push(data);
									}
								}
								console.info("tagDatas:",tagDatas)
								tree.setData(tagDatas);
							}
							if(showLeftTable&&allDataTable){
								tagDatas= [];
								for (var i=0;i<allDataTable.length;i++) {
									var index=allDataTable[i][searchName].indexOf(searchWord);
									if(index>=0)
										tagDatas.push(allDataTable[i]);
								}
								table.setData(tagDatas);
							}
						}
						//showLeftTree&&tree.initTreeGrid();
						if(showLeftTree){
							setTimeout(function(){
					       	 	var roots = tree.getAllNodes();
						       	tree.expand(roots);
					       	}, 200)
						}
					}
					
		    		return ly;
		    		
		    		
		    	},	
		    	getTreeBody:function(params){
		    		var treeParam=params.treeParam||{};
		    		var selectId="",that=this;
		    		//部门树点击事件
		    		treeParam.onClick=treeParam.onClick||function(trDom){
			       		 var data=tree.getSelectedRecords();
			       		 if( that.oldClickDepId == data.id){
			       		 	return;
			       		 }
			       		 that.oldClickDepId = data.id;
			       		 if(data.sourceId == "-1"){
			       			that.table.empty();
			       		 }else{
			       			var name = that.inputDiv.find("input").val().replace(/\s*/g,"");
			       			that.table.fetchData({data:{depId: data.id, keyword:name}});
			       		 }
			       	};
			       	
			       	treeParam.ds=treeParam.ds||this.modelDs;
			       	var tree=Newtec.TreeGrid.create(treeParam);
			       	this.tree=tree;
			       	return tree.newtecJQ;
		    	},
		    	 getTreeData: function(){
		         	var that = this
		         	
		         	this.treeDs.fetchData({
		         		operId: 'getAbleDepsParentByPersonId',
		         		data:{isLoad:"isLoad"},
		         		callback: function(res){
		         			if(res.status == 0){
		         				var data = res.data;
		         				console.info("=====<<<<<<",data);
		         				var deps = [];
		             			for(var key in data){
//		            				delete data[key].isFolder;
		            				if(key.endWith('_0')){
		            					deps.push(data[key]);
		            				}else{
		            					data[key].sourceId = "-1";
		            					deps.push(data[key]);
		            				}
		            			}
		             			deps = that.sortData(deps);
		             			console.info("====deps>>>>",deps);
		             			that.tree.setData(deps);
		//             			that.tree.initTreeGrid();
		             			setTimeout(function(){
		            	       	 	var roots = that.tree.getRootNodes();
		            	       	 	that.tree.expand(roots);
		            	       	}, 500)
		         			}else{
		         				Newtec.Window.hint("错误：获取部门树失败！");
		         				console.error(res.errors);
		         			}
		         		}
		         	})
		         },
		    	getRightBody:function(params){
		    		var ly=$("<div class='c-right'></div>");
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
		    				var inputJQ=$("<input type='text' autocomplete='off'  maxlength='50' name='"+key+"' placeholder='"+(inputKey[key]||"")+"'/>")
		    				inputDiv.append(inputJQ);
		    				inputJQ.on('keyup',function(event) {
		        				if (event.keyCode == 13) {
		        					that.fetchData();
		        				}
		        			});
		    			}
		    			
		    			this.inputDiv=inputDiv;
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
		    			var name = inputDiv.find("input").val().replace(/\s*/g,"");
		    			var data = that.tree.getSelectedRecords();
		    			var depId = "";
		    			if(!Newtec.Utils.isNull(data)){
		    				depId = data.id
		//    				Newtec.Window.hint("请先选择部门");
		    			}
		    			that.table.fetchData({data:{keyword: name, depId: depId}});
		    		}});
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
		    		this.table.newtecJQ.css("overflow","auto");
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
		    	//根据sort为数据排序
		        sortData: function(datas){
		        	//根据价格（price）排序
		            function sortprice(a,b){
		              return a.sort - b.sort;
		            }
		            //利用sort方法排序
		            datas.sort(sortprice);
		            return datas;
		        },
		    	finsh: function (params) {
		    		this.leftJQ.mCustomScrollbar({
		                theme: "minimal-dark",
		                scrollInertia: 200
		            });
		        },
		    });
});
	
