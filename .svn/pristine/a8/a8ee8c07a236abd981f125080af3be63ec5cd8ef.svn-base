;(function(){
	/**
	 * 流程基础页面
	 * @param {Object} params
	 */
	Newtec.BpmBasePage = function(params){
		this.defaults = {
			showSimpSearch : true,//显示快速查询
			showAdvSearch : true,//显示高级查询
			showTable : true,     //显示下方的table
			appendTo : '',
			dsName : '',
			operId : ''
		};
		this.topLayout = {};
		this.bottomLayout = {};
		this.table = {};
		this.advForm;
		$.extend(true,this.defaults,params);
	};
	
	Newtec.BpmBasePage.prototype = new Newtec.Base("bpmBasePage");
	
	Newtec.BpmBasePage.prototype.createNewtecJQ = function(params){
		this.createBefore();
		
		this.bottomLayout = this.createBottomLayout(params);
		this.topLayout = this.createTopLayout(params);
		this.finish();
		var body = $(this.defaults.appendTo);
		body.append(this.topLayout);
		body.append(this.bottomLayout);
		return body;
	};
	
	Newtec.BpmBasePage.create = function(params){
		return new Newtec.BpmBasePage(params).init();
	};
	
	Newtec.BpmBasePage.prototype.createBefore = function(){//页面创建前
		
	};
	
	Newtec.BpmBasePage.prototype.createTopLayout = function(params){//创建页面上部分
		var topLayout = $("<div style='height:10%;width:100%;padding:10px'></div>");
		//var params = this.defaults;
		var showSimpSearch = params.showSimpSearch;
		var showAdvSearch = params.showAdvSearch;
		this.topLayout = topLayout;
		if(showSimpSearch){
			this.createSimpleSearchInput(params);
		}
		if(showAdvSearch){
			this.createAdvForm(params);
			this.createAdvSearchInput(params);
		}
		return topLayout;
	};
	
	Newtec.BpmBasePage.prototype.createBottomLayout = function(params){//创建页面下部分
		var bottomLayout = $("<div style='height:90%;width:100%'></div>");
		//var params = this.defaults;
		this.bottomLayout = bottomLayout;
		this.table = {};
		if(params.showTable){
			this.createTable(params);
		}
		return bottomLayout;
	};
	
	Newtec.BpmBasePage.prototype.finish = function(){//页面创建后
		
	};
	
	Newtec.BpmBasePage.prototype.addBtn = function(btn){//添加按钮
		//this.topLayout.append(btn);
		Newtec.Utils.appendTo(btn,this.topLayout);
	};
	
	Newtec.BpmBasePage.prototype.createSimpleSearchInput = function(params){//创建快速查询按钮
		var topLayout = this.topLayout;
		var table = this.table;
		console.log(table);
			var input = Newtec.SimpleSearchInput.create({
				appendTo : topLayout,
				placeHolder : '请输入单据标题/单据类型',
				dsName : params.dsName,
				operId : params.operId,
				searchFields : {
					contains : 'bpmBussNam,bpmProcessName'
				},
				callback : function(res){
					if(table){
					table.setData(res.data,false,null);
					}
				}
			});
			return input;
	};
	
	Newtec.BpmBasePage.prototype.createAdvSearchInput = function(){//创建高级查询按钮
		var topLayout = this.topLayout;
			var label = $('<label style="white-space:nowrap;font-size:14px;font-family:微软雅黑;color:blue;position:relative;left:374px;top:10px;cursor:pointer;font-weight:100;">高级搜索</label>');
			var pageBody = $(this.defaults.appendTo);
			var $advForm = $("#advForm")
			//console.log(advForm);
			$advForm.hide();
			label.click(function(){
				pageBody.hide();
				$advForm.show();
			});
			topLayout.append(label);
	};
	/**
	 * 创建高级查询表单
	 * @param {Object} params
	 */
	Newtec.BpmBasePage.prototype.createAdvForm = function(params){
		var body = $("body");
		var advForm;
		var changeAfter = function(element, checked, value,name){
			if(advForm){
				var expenseField =[
					{name:"expenseAmount",title:"报销金额"},
					{name:"payType",title:"结算方式"},
					{name:"payDirection",title:"支付方向"},
					{name:"reason",title:"报销事由"}
					]
				var loanBillField =[
					{name:"loanPerson",title:"借款人"},
					{name:"loanAmount",title:"借款金额"},
					{name:"reason",title:"借款事由"},
					{name:"costType",title:"费用类型"},
					{name:"drawDate",title:"取款日期"}
					]
				var travelRequestField=[
					{name:"startPoint",title:"起点"},
					{name:"endPoint",title:"终点"},
					{name:"cost",title:"金额"},
					{name:"theme",title:"出差主题"}
					]
				if(advForm.form){
					advForm.form.clearValues();
				}
				if(name=='报销单'){
					if(advForm.form){
						advForm.form.setFields(expenseField,0);
					}
				}
				if(name=='借款单'){
					if(advForm.form){
						advForm.form.setFields(loanBillField,0);
					}
				}
				if(name=='出差单'){
					if(advForm.form){
						advForm.form.setFields(travelRequestField,0);
					}	
				}
			}
			
		};
			var pickFields = [
			{name: "bpmProcessName", title: '单据类型', data: {'报销单':'报销单','借款单':'借款单','出差单':'出差单'}, type: "select",changeAfter:changeAfter}
			                  ];
			advForm = Newtec.BpmAdvSearchForm.create({
				appendTo : body,
				pickListParam : pickFields,
				operId : params.operId,
				dsName : params.dsName,
				pageBody :params.appendTo,
				pageTable : this.table
			});
			console.log(this.table);
			this.advForm = advForm;
			
			
	}
	Newtec.BpmBasePage.prototype.createTable = function(params){//创建下方表格
		var tdd={};
		var bottomLayout = this.bottomLayout;
		var dataFields = [//查询页面显示的字段
				{name:"bpmProcessKey",title:"流程Key"},
				{name:"bpmBussNam",title:"单据标题"},
				{name:"bpmProcessName",title:"单据类型"},
				{name:"bpmOwerName",title:"提单人"},
				{name:"bpmStatus",title:"状态"},
				{name:"bpmStartTime",title:"开始时间"},
				{name:"bpmLastTime",title:"最后审批时间"},
				{name:"bpmLastUser",title:"最后审批用户"},
				{name:"bpmPart",title:"参与过的人"}
				];
		tdd = Newtec.Table.create({
				appendTo:bottomLayout,
				fields:dataFields,
				showFilter: false,
				showHeader: false,
				showHeaderBtn:true,
				showFetchForm: false,
				multSelect:true
				});
		Newtec.DS.get(params.dsName).fetchData({
			operId:params.operId,
			callback:function(res){
				tdd.setData(res.data,false,null);	
			}
		});
		this.table = tdd;
	};
	
	/**
	 * 待办页面
	 */
	Newtec.BpmWaitPage = function(){
		this.defaults = {
			
		};
	};
	
	Newtec.BpmWaitPage.exte(Newtec.BpmBasePage,"bpmWaitPage");//继承
	
	Newtec.BpmWaitPage.over({//重写方法
		finish:function(){
			var tdd = this.table;
			var batchbutton = $('<div class="label_radius_17" style="right:10px;width:70px;height:34px;top:10px;background-color:#01aeef;cursor:pointer;" align="center" valign="center" ><label style="white-space:nowrap;font-size:14px;font-family:微软雅黑;color:#FFF;">审&nbsp批</label></div>');
			batchbutton.click(function(){
				if(tdd){
					console.log(tdd);
					var records = tdd.getSelectedRecords();
					var approvalForm;
					if(Newtec.Utils.isNull(records)){
						alert('请选择待审批数据！');
					}else{
						var approvalFormFields = [
						    {name: "opera", title: '', data: {'同意':'同意','不同意':'不同意'}, type: "select"},
						    {name: 'content',title:'审批意见',type:'textarea',}
						    ]
						var approvalWin = Newtec.Window.create({
							title: '批量审批',
					        width: 500,
					        height: 300,
					        body: '<div id="approvalForm" style="height:100%;margin:0;padding:0;"></div>',
					        finsh: function(){
					        	approvalForm = Newtec.Form.create({
					        		appendTo:'#approvalForm',
					        		titleColumn:4,
					        		columnNum:1,
					        		fields:approvalFormFields,
					        		itemParams:{titleAlign:'center'}
					        	});

					        },
					        footer: Newtec.Button.create({//
				                id: 'sumbitApprovalBtn',
				                title: '提交审批',
				                click: function () {
				                	var data = approvalForm.getValues();
				                	Newtec.DS.get("bpmBussData").updateData({
				                        operId: 'toBatchApproval',
				                        data:data,
				                        datas:records,	
				                        callback:function(res){
				                        	console.log(res);
											//tdd.setData(res.data,false,null)
				                        }
				                    });
				                	
				                }
								})
						})
					}
				}
			});
			this.addBtn(batchbutton);
			
			tdd.setDbclickRecord(function(data,$record){
				var processId = data.id;
				//console.log(processId);
			    var win = Newtec.BpmBaseWindow.create({
					record:data,
					width : 800,
					height : 600,
					title : '审批窗口',
					isShowApprovalTable : true,
					submitDsName :'bpmBussData',
					submitOperId :'toApproval',
					isShowInvoice :true,
					isShowApprovalDigram :true
					});
				});
		},
		addBtn:function(f){//调用父类方法
			Newtec.BpmBasePage.prototype.addBtn.call(this,f);
		}
	});
	/**
	 * 我的单据页面
	 */
	Newtec.BpmSelfPage = function(params){
		
	};
	
	Newtec.BpmSelfPage.exte(Newtec.BpmWaitPage,"bpmSelfPage");//继承
	Newtec.BpmSelfPage.over({
		finish:function(){
			var tdd = this.table;
//			var newBpmBtn = Newtec.LabelButton.create({
//				title : '发&nbsp布',
//				right : '10px',
//				top : '10px',
//				bgColor : '#01aeef',
//				titleColor : '#FFF',
//				clickFun : function(){
//					console.log('publish...');
//				}
//			});
			var newBpmBtn = $('<div class="label_radius_17" style="right:10px;width:70px;height:34px;top:10px;background-color:#01aeef;cursor:pointer;" align="center" valign="center" ><label style="white-space:nowrap;font-size:14px;font-family:微软雅黑;color:#FFF;">发&nbsp起</label></div>');
			newBpmBtn.click(function(){
				Newtec.BpmNewWindow.create({
					width : 800,
					height : 600,
					title : '发起流程'
					
				});
			});
			this.addBtn(newBpmBtn);
			
			tdd.setDbclickRecord(function(data,$record){
				var processId = data.id;
				//console.log(processId);
			    var win = Newtec.BpmSelfWindow.create({
					record:data,
					width : 800,
					height : 600,
					title : '查看单据',
					isShowApprovalTable : true,
					isShowInvoice :true,
					isShowApprovalDigram :true
					});
				});
		},
		addBtn:function(f){//调用父类方法
			Newtec.BpmBasePage.prototype.addBtn.call(this,f);
		}
	});
	/**
	 * 已办事项页面
	 */
	Newtec.BpmCompletePage = function(params){
		
	};
	
	Newtec.BpmCompletePage.exte(Newtec.BpmSelfPage,"bpmCompletePage");
	
	Newtec.BpmCompletePage.over({
		finsh : function(){
			var tdd = this.table;
			tdd.setDbclickRecord(function(data,$record){
				//var processId = data.id;
				//console.log(processId);
			    var win = Newtec.BpmCompleteWindow.create({
					record:data,
					width : 800,
					height : 600,
					title : '查看单据',
					isShowApprovalTable : true,
					isShowInvoice :true,
					isShowApprovalDigram :true
					});
				});
		}
	});
	
	Newtec.BpmDraftPage = function(params){
		
	};
	
	Newtec.BpmDraftPage.exte(Newtec.BpmBasePage,"bpmWaitPage");
	
	Newtec.BpmDraftPage.over({
		finsh : function(){
			var tdd = this.table;
			tdd.setDbclickRecord(function(data,$record){
				//var processId = data.id;
				//console.log(processId);
			    var win = Newtec.BpmDraftWindow.create({
					record:data,
					width : 800,
					height : 600,
					title : '查看草稿',
					isShowApprovalTable : true,
					isShowInvoice :true,
					isShowApprovalDigram :true
					});
				});
		}
	})
})();
