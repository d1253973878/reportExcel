;(function(){
	/**
	 * 子窗口
	 * @param {Object} params
	 */
	Newtec.BpmBaseWindow = function(params){
		this.defaults = {
			record : '',//当前选中的记录
			title : '',
			width : '',
			height :''
		};
		this.winBody;
		this.showApprovalForm = true;
		this.showSumbitBtn = true;
		this.showSaveDraftBtn = false;
		this.winFoot;
		this.approvalForm;
		this.win;
		$.extend(true,this.defaults,params);
	};
	
	Newtec.BpmBaseWindow.prototype = new Newtec.Base("bpmBaseWindow");
	
	Newtec.BpmBaseWindow.prototype.createNewtecJQ = function(params){
		var config = this.defaults;
		var title = config.title;
		var height = config.height;
		var width = config.width;
		var winBody = $('<div name="winBody"></div>');
		this.winBody = winBody;
		this.winFoot = $('<div id="buttons">');
		var winFoot = this.winFoot;
		this.win = Newtec.Window.create({
			title : title,
			body : winBody,
			height : height,
			width : width,
			footer : winFoot
		});
		this.initTabs(params);
		this.initBtns(params);
		//this.createApprovalForm(params);
		//this.createInvoice();
		return $(this.win);
	};
	
	Newtec.BpmBaseWindow.create = function(params){
		return new Newtec.BpmBaseWindow(params).init();
	};
	
	Newtec.BpmBaseWindow.prototype.initTabs = function(params){//单据数据相关
		var tabs = [
			{title:'审批表',name:'approvalTab'},
			{title:'审批过程',name:'approvalProcessTab'},
			{title:'审批过程2',name:'approvalProcessTab2'}
		];
		//var approvalFormBody = this.createApprovalForm(params);
		//var invoiceBody = this.createInvoice(params);
		var winBody = this.winBody;
		var showForm = this.showApprovalForm;
		var showApprovalProcess = this.showApprovalProcess;
		Newtec.MyTab.create({
			appendTo : winBody,
			tabChangFun : function(myTabThis,currNewtec,name,currId,preId){
				var currDiv = $('#'+currId+"_tab");
				var isEmpty = Newtec.Utils.isNull(currDiv.html());
				console.log(isEmpty);
				if(isEmpty){
					if(name=='approvalTab'){
						if(showForm){//是否显示审批意见
							var approvalFormFields = [
						    {name: "opera", title: '', data: {'Agree':'同意','DisAgree':'不同意'}, type: "radio"},
						    {name: 'content',title:'审批<br>意见',type:'textarea'}
						    ];
						              			  					
							this.approvalForm = Newtec.Form.create({
						     appendTo:currDiv,
						     titleColumn:2,
						     columnNum:1,
						     fields:approvalFormFields,
						     itemParams:{titleAlign:'center',titleRate:30}
							});
						}
						//var defaults = this.defaults;
						Newtec.InvoiceTemplate.create({//
							appendTo : currDiv,
							record : params.record
						});
						
					}
					if(name=='approvalProcessTab'){
						Newtec.ApprovalProcess.create({
							appendTo : currId+"_tab",
							bussId : params.record.bpmBussId,//取defaults.record.bpmBussId,便于测试先设置固定值
							showTable : params.isShowApprovalTable,
							showDigram : params.isShowApprovalDigram
						});
					}
					if(name=='approvalProcessTab2'){
						Newtec.ApprovalProcessSimp.create({
							appendTo : currId+"_tab",
							bussId : params.record.bpmBussId,//取defaults.record.bpmBussId,便于测试先设置固定值
							showTable : params.isShowApprovalTable,
							showDigram : params.isShowApprovalDigram
						});
					}
				}
			},
			height :params.height-90 ,
			tabs:tabs
		});
	};
	
	Newtec.BpmBaseWindow.prototype.initBtns = function(params){
		console.log(this.showSumbitBtn);
		if(this.showSumbitBtn){
			this.createSubmitBtn(params);
		}
		if(this.showSaveDraftBtn){
			this.createDraftBtn(params);
		}
	};
	
	Newtec.BpmBaseWindow.prototype.createSubmitBtn = function(params){//创建提交按钮 单据数据相关
		var winFoot = this.winFoot;
		var win = this.win;
		
		Newtec.Button.create({//
            id: 'approvalSubmit',
            title: '提交',
            appendTo : winFoot,
            click: function () {
            	if(this.approvalForm){
            		var formVals = this.approvalForm.getValues();
            	}
				var record = params.record;
				var data = _mergeMap(record,formVals);
            	Newtec.DS.get("bpmBussData").updateData({
                    operId: 'toApproval',
                    data:data,	
                    callback:function(res){
                    	//待实现
						win.close();
                    }
                });
            	
            }
			});
	};
	
	Newtec.BpmBaseWindow.prototype.createDraftBtn = function(params){
		var winFoot = this.winFoot;
		var win = this.win;
		Newtec.Button.create({//保存草稿按钮
            id: 'saveDraft',
            title: '保存草稿',
            appendTo : winFoot,
            click: function () {
            	Newtec.DS.get("bpmBussData").updateData({
                    operId: 'toSaveDraft',
                    data:this.invoice.getValues(),	
                    callback:function(res){
                    	//待实现
						win.close();
                    }
                });
            	
            }
			});
	};
	
	Newtec.BpmBaseWindow.prototype.createApprovalForm = function(params){//审批意见
		var approvalFormFields = [
			{name: "opera", title: '审批意见', data: {'同意':'同意','不同意':'不同意'}, type: "select"},
			{name: 'content',title:'备注',type:'textarea',}
			];
			  					
		var approvalForm = Newtec.Form.create({
			appendTo:'',
			 titleColumn:4,
			 columnNum:1,
			 fields:approvalFormFields,
			 itemParams:{titleAlign:'center'}
			});
		return approvalForm;
	};
	
	Newtec.BpmBaseWindow.prototype.createInvoice = function(params){//单据信息
		var defaults = this.defaults;
		var invoice = Newtec.InvoiceTemplate.create({
			appendTo : '#invoiceDetail',
			record : defaults.record
		});
		return invoice;
	};
	
	Newtec.BpmBaseWindow.prototype.loadApprovalProcess = function(params){//读取流程图
		
	};
	
	/**
	 * 新建单据窗口
	 */
	Newtec.BpmNewWindow = function(params){
		this.showSumbitBtn = true;
		this.showSaveDraftBtn = true;
		this.invoice;
	};
	
	Newtec.BpmNewWindow.exte(Newtec.BpmBaseWindow,"bpmNewWindow");
	
	Newtec.BpmNewWindow.over({
		initTabs : function(params){
			var tabs = [
				{title:'填写单据',name:'fillBill'},
			];
			var winBody = this.winBody;
			Newtec.MyTab.create({
				appendTo : winBody,
				tabChangFun : function(myTabThis,currNewtec,name,currId,preId){
					var currDiv = $('#'+currId+"_tab");
					var isEmpty = Newtec.Utils.isNull(currDiv.html());
					console.log(isEmpty);
					if(isEmpty){
						if(name=='fillBill'){			
							//var defaults = this.defaults;
							this.invoice = Newtec.InvoiceTemplate.create({
								appendTo : currDiv,
								type : '报销单'
							});
							
						}
					}
				},
				height :params.height-90 ,
				tabs:tabs
			});
			
		},
		createSubmitBtn:function(params){
			var winFoot = this.winFoot;
			Newtec.Button.create({//
                id: 'approvalSubmit',
                title: '提交',
                appendTo : winFoot,
                click: function () {
                	Newtec.DS.get("bpmBussData").updateData({
                        operId: 'toStartTask',
                        data:this.invoice.getValues(),	
                        callback:function(res){
                        	//待实现
							win.close();
                        }
                    });
                	
                }
				});
		}
	});
	
	Newtec.BpmSelfWindow = function(params){
		this.showSumbitBtn = false;
		this.showSaveDraftBtn = false;
		this.showApprovalForm = false;
	};
	
	Newtec.BpmSelfWindow.exte(Newtec.BpmBaseWindow,"bpmSelfWindow");
	
	Newtec.BpmSelfWindow.over({
		
	});
	
	Newtec.BpmCompleteWindow = function(params){
		this.showSumbitBtn = false;
		this.showSaveDraftBtn = false;
		this.showApprovalForm = false;
	};
	
	Newtec.BpmCompleteWindow.exte(Newtec.BpmBaseWindow,"bpmCompleteWindow");
	
	Newtec.BpmCompleteWindow.over({
		
	});
	
	Newtec.BpmDraftWindow = function(params){
		this.showApprovalForm = false;
		this.showSaveDraftBtn = true;
	}
	
	Newtec.BpmDraftWindow.exte(Newtec.BpmNewWindow,"bpmDraftWindow");
	
	Newtec.BpmDraftWindow.over({
		initTabs : function(params){
			var tabs = [
				{title:'填写单据',name:'fillBill'},
			];
			var winBody = this.winBody;
			Newtec.MyTab.create({
				appendTo : winBody,
				tabChangFun : function(myTabThis,currNewtec,name,currId,preId){
					var currDiv = $('#'+currId+"_tab");
					var isEmpty = Newtec.Utils.isNull(currDiv.html());
					console.log(isEmpty);
					if(isEmpty){
						if(name=='fillBill'){			
							//var defaults = this.defaults;
							this.invoice = Newtec.InvoiceTemplate.create({
								appendTo : currDiv,
								type : '报销单',
								record : params.record
							});
							
						}
					}
				},
				height :params.height-90 ,
				tabs:tabs
			});
			
		},
	});
	var _mergeMap = function(map){//将所有map合并成一个map
		for (var i=1;i<arguments.length;i++){
		    map2=arguments[i];
		    for (var k in map2){
		    	map[k]=map2[k];
		    };
		  }
		return map;
	};
})();
