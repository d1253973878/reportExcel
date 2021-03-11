Newtec.Component(
["Compage",'Table','Form','TreeGrid'],
['page/power/department/personDepartment.css']
,function () {
	if(Newtec.DeparmentPerson){
		console.error("newtec.compage.js已经存在");
		return ;
	}
	var depDs = Newtec.DS.create("department");
	    Newtec.DeparmentPerson = function (params) {
	        //默认
	        this.defaults = {
	        	appendTo:'body',
	        	showPContent:true,
	        	is100:true,
	        	leftTitle:"部门机构",
	        	treeParam:{
	        		 ds:depDs,
		    		 expand:false,
		    		 showRightMenu:false,
		    		 fetchParam: {
		    			 operId: "getDepsParentByPersonId",
		    		 },
	//	    	     showCheckbox:false,
		    	     autoFetch: false,
		    		 tdStyle:'white-space: nowrap;',
		    		 tdValueHtmlFun: function(name,value,params){
		    			 var depId = Newtec.Person.get().depId;
		    			 if(params.sourceId== "-1"){
		    				 return '<span style="color:#adaaaa">'+ value +'</span';
		    			 }else if(params.id == depId){
		    				 return '<span style="color:#2277ee">'+ value +'</span';
		    			 }
		    			 return value;
		    		 }
		    	 },
		    	tableParam:{
		    		ds: Newtec.DS.create("person"),
		    		fields:[{name:'name',title:'名称'}]
				 	,showHeader:false
					,showFetchForm:false
					,showFilter:false
					,multSelect: true
					,showMoreBtn:false
					,autoFetch: true
					,fetchParam:{
						operId:"getPersonsByPersonId",
						data:{personId: Newtec.Person.get().id}
					}
	//				,showPagin: false
	//				,mode: '2'
					,height:'100%'
		    	},
		    	inputKey:{'name':"请输入人员名称"},//输入框配置
	//	    	seleteParams:[{data:{'全部':"全部"}}],//下拉框配置
		    	seleteParam:{name:'type',search:false,isCenter:false,showDownIcon:true},//下拉框通用配置
		    	btns:null,
		    	showDepBtn:false,
	        };
	//        this.modelDs=params.treeDs||Newtec.DS.get("infoType");
	        this.UrlParam=null;
	    };
	    var departmentDs = Newtec.DS.create("department");
	    Newtec.DeparmentPerson.exte(Newtec.Compage, 'personDepartment');
	    Newtec.DeparmentPerson.over({
	    	setContentBody: function (params) {
	    		var ly=$("<div class='c-main'></div>");
	    		ly.append(this.getHeadBody(params));
	    		this.rightJQ = this.getRightBody(params);
	    		ly.append(this.getLeftBody(params)).append(this.rightJQ);
	    		this.getTreeData();
	    		return ly;
	        },
	        getHeadBody: function(params){
	        	var headBody =  $("<div class='c-head'></div>");
	        	headBody.append(this.getHeadLeftBody(params))
	        	headBody.append(this.getExtendBtns(params));
	        	return headBody;
	        },
	    	getRightBody:function(params){
	    		var ly=$("<div class='c-right'></div>");
	    		ly.append($("<div class='c-title'>"+(params.leftTitle||"")+"</div>" ));
	    		var treeLy=$("<div class='l-content l-tree'></div>");
	    		var treeBody=$("<div></div>");
	    		treeBody.append(this.getTreeBody(params));
	    		treeLy.append(treeBody);
	    		ly.append(treeLy);
	    		this.treeBody=treeBody,this.treeLy=treeLy;
	    		return ly;
	    	},	
	    	getTreeBody:function(params){
	    		var treeParam=params.treeParam||{};
	    		var selectId="",that=this;
	//    		treeParam.onClick=treeParam.onClick||function(trDom){
	//	       		 var data=tree.getSelectedRecords();
	//	       		 if(data.sourceId == "-1"){
	//	       			 return
	//	       		 }
	//	       		that.table.fetchData({data:{depId: data.id}});
	//	       	};
		       	treeParam.ds=treeParam.ds||this.modelDs;
		       	var tree=Newtec.TreeGrid.create(treeParam);
		       	this.tree=tree;
		       	return tree.newtecJQ;
	    	},
	    	//获取部门树的数据
	    	getTreeData: function(){
	        	var that = this
	        	departmentDs.fetchData({
	        		operId: 'getDepsParentByPersonId',
	        		callback: function(res){
	        			if(res.status == 0){
	        				var data = res.data;
	        				var deps = [];
	            			for(var key in data){
//	            				delete data[key].isFolder;
	            				if(key.endWith('_0')){
	            					deps.push(data[key]);
	            				}else{
	            					data[key].sourceId = "-1"
	            					deps.push(data[key]);
	            				}
	            			}
	            			that.tree.setData(deps);
	//            			that.tree.initTreeGrid();
	            			setTimeout(function(){
	            	       	 	var roots = that.tree.getRootNodes();
	            	       	 	that.tree.expand(roots);
	            	       	}, 500)
	        			}else{
	        				Newtec.Window.hint("错误：获取部门树失败！");
	        				console.err(res.errors);
	        			}
	        			
	        		}
	        	})
	        },
	    	getLeftBody:function(params){
	    		var ly=$("<div class='c-left'></div>");
	    		var content=$("<div class='l-content'></div>");
	    		ly.append(content);
	    		content.append(this.getLeftTableBody(params));
	    		return ly;
	    	},
	    	getHeadLeftBody:function(params){
	    		var ly=$("<div class='r-head clear-float'></div>");
	    		var inputKey=params.inputKey,that=this,showDepBtn=params.showDepBtn;
	    		if(inputKey){
	    			var inputDiv=$("<div class='head-item'></div>");
	    			ly.append(inputDiv)
	    			for(var key in inputKey){
	    				var inputJQ=$("<input type='text'  maxlength='50' autocomplete='off' name='"+key+"' placeholder='"+(inputKey[key]||"")+"'/>")
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
	    			that.fetchData();
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
	    		var that = this;
	    		var ly=$("<div class='ext-btn'></div>");
	//    		for(var i=0;i<extendBtns.length;i++){
	//				var newtecJQ=Newtec.Button.create(extendBtns[i]).newtecJQ
	//				ly.append(newtecJQ);
	//			}
	    		var newtecJQ=Newtec.Button.create({title: '设置',
				    click: function () {
				    	var departmentIds = that.checkData(that);
				    	if(departmentIds == "错误"){
				    		return;
				    	}
				    	var datas=that.table.getSelectedRecords();
				    	if(!datas||datas.length==0){
				    		Newtec.Window.hint("请选择对应用户！");
				    		return;
				    	}
				    	var personId ="";
				    	for(var i=0,len=datas.length;i<len;i++)personId+=(i==0?"":",")+datas[i].id;
				    	var ds = Newtec.DS.create("departmentPerson");
			    		ds.fetchData({
			    			operId:"updateDepartmentPerson",
			    			data: {personIds: personId, departmentIds: departmentIds},
			    			callback: function(res){
			    				if(res.status == 0){
			    					Newtec.Window.hint("分配成功");
			    				}else{
			    					Newtec.Window.hint(res.error);
			    				}
			    			}
			    		})
				    }
				}).newtecJQ;
	    		ly.append(newtecJQ);
	    		return ly;
	    	},
	    	//检测新分配的权限
	    	checkData: function(that){
	    		var personData = that.table.getSelectedRecords();
	    		if(Newtec.Utils.isNull(personData)){
	    			Newtec.Window.hint("请选择人员");
	    			return "错误";
	    		}
	    		var treeData = that.tree.getSelectedRecords();
	    		var oldRelation = that.oldRelation;
	    		if(Newtec.Utils.isNull(treeData) && Newtec.Utils.isNull(oldRelation)){
	    			Newtec.Window.hint("数据没有发生变化");
	    			return "错误";
	    		}
	    		var newRelation = [];
	    		var departmentIds = "";
	    		if(Newtec.Utils.isArray(treeData)){
	    			for(var i = 0; i < treeData.length; i++){
	    				if(treeData[i].sourceId == "-1"){
	    					Newtec.Window.hint("只能选择本部门或子部门");
	    					return "错误";
	    				}
	    				//插入新的关系
	    				newRelation.push({personId:personData.id, departmentId: treeData[i].id});
	    				departmentIds += (departmentIds?",":"") + treeData[i].id
	    			}
	    		}
	    		that.oldRelation = newRelation;
	    		return departmentIds;
	    	},
	    	getLeftTableBody:function(params){
	    		var that = this;
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
	    		that.table=table=Newtec.Table.create(tableParam);
	    		that.table.setClickRecord(function(data){
	    			that.searchPersonDepartment(data);
				})
				table.newtecJQ.css("top",0);
	    		return table.newtecJQ;
	    	},
	    	//查询已分配的部门人员数据
	    	searchPersonDepartment: function(data){
	    		var that = this;
	    		var ds = Newtec.DS.create("departmentPerson");
	    		ds.fetchData({
	    			operId:"getDepartmentPersonByPersonId",
	    			data:{personId: data.id},
	    			callback: function(res){
	    				if(res.status == 0){
	    					var treeData = that.tree.getData();
	    					var oldRelation = res.data;
	    					var selectData = [];
	    					that.tree.selectAll(false);
	    					if(Newtec.Utils.isNull(oldRelation)){
	    						oldRelation = [];
	    					}
	    					that.oldRelation = oldRelation;
	    					//对比新旧数据
	    					for(var i = 0; i < treeData.length; i++){
	    						for(var j = 0; j < oldRelation.length; j++){
	        						if(treeData[i].id == oldRelation[j])
	        							selectData.push(treeData[i])
	        					}
	    					}
	    					
	    					that.tree.selectByData(selectData);
	    				}
	    			}
	    		})
	    	},
	    	//查询人员名称
	    	fetchData:function(parmas){
	    		if(this.inputDiv){
	    			parmas=parmas||{};
	    			var data=parmas.data=parmas.data||{};
	    			var inputDiv=this.inputDiv
	    			inputDiv.find("input").each(function(){
	    				console.info($(this).attr('name'));
	    				var jq=$(this);
	    				var value=jq.val()||"";
	    				value=value.replace(/\s*/g,"")
	    				data[jq.attr('name')]=value||null;
	    			});
	    		}
	    		this.table.fetchData(parmas);
	    	},
	    	finsh: function (params) {
	    		this.rightJQ.mCustomScrollbar({
	                theme: "minimal-dark",
	                scrollInertia: 200
	            });
	        },
	    });
});