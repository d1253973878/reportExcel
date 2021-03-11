;(function(){
	Newtec.RecordClickWindow = function(params){
		this.defaults = {
			record : '',//当前选中的记录
			isShowApprovalDigram : true,//控制审批过程图显示
			isShowApprovalTable : true,//控制审批过程数据表格显示
			isShowApprovalForm : true,//控制显示审批意见表单
			isShowInvoice : false,//控制显示单据
			isShowSubmitBtn : true,//控制显示提交按钮
			isShowSaveDraftBtn : false,//控制显示保存草稿按钮
			width : 1200,
			height : 1000,
			submitBtnTitle : '提交审批',
			saveDraftTitle : '保存草稿',
			submitDsName : '',//提交按钮绑定数据源名称
			saveDraftDsName : '',//保存草稿按钮绑定数据源名称
			submitOperId : '',//提交按钮绑定后台dmi方法
			saveDraftOperId :''//保存草稿按钮绑定后台dmi方法
		};
		this.data ={};//当前窗口可提交的数据
		this.approvalForm ={};
		this.invoice ={};
		$.extend(true,this.defaults,params);
	};
	
	Newtec.RecordClickWindow.prototype = new Newtec.Base('recordClickWindow');
	
	Newtec.RecordClickWindow.prototype.createNewtecJQ = function(f){
		var defaults = this.defaults;
		var win = Newtec.Window.create({
			title : defaults.record.bpmBussNam,
			width : defaults.width,
			height : defaults.height,
			body : '<div id="processDigram"></div><div id="invoiceDetail" style="border:1px solid black;margin:10px"></div><div id="approvalContent"></div>',
			footer:'<div id="buttons">',
			finsh:function(){
				if(defaults.isShowApprovalTable||defaults.isShowApprovalDigram){//显示流程图
					Newtec.ApprovalProcess.create({
						appendTo : 'processDigram',
						bussId : 'c-2017051801',//取defaults.record.bpmBussId,便于测试先设置固定值
						showTable : defaults.isShowApprovalTable,
						showDigram : defaults.isShowApprovalDigram
					});
				}
				if(defaults.isShowInvoice){//显示单据
					Newtec.InvoiceTemplate.create({
						appendTo : '#invoiceDetail',
						record : defaults.record
					});
				}
				if(defaults.isShowApprovalForm){//显示审批意见
					var approvalFormFields = [
					  					    {name: "opera", title: '审批意见', data: {'同意':'同意','不同意':'不同意'}, type: "select"},
					  					    {name: 'content',title:'备注',type:'textarea',}
					  					    ];
					  					
					this.approvalForm = Newtec.Form.create({
					  		        		appendTo:'#approvalContent',
					  		        		titleColumn:4,
					  		        		columnNum:1,
					  		        		fields:approvalFormFields,
					  		        		itemParams:{titleAlign:'center'}
					  		        	});
				}
				
				if(defaults.isShowSubmitBtn){
					Newtec.Button.create({//
		                id: 'approvalSubmit',
		                title: defaults.submitBtnTitle,
		                appendTo : '#buttons',
		                click: function () {
		                	if(defaults.isShowApprovalForm&&defaults.isShowInvoice){
		                		this.data = mergeMap(this.approvalForm.getValues(),this.invoice.getValues());
		                	}else if(defaults.isShowApprovalForm){
		                		this.data = this.approvalForm.getValues();
		                	}else{
		                		this.data = this.invoice.getValues();
		                	}
		                	Newtec.DS.get(defaults.submitDsName).updateData({
		                        operId: defaults.submitOperId,
		                        data:this.data,	
		                        callback:function(res){
		                        	//待实现

		                        }
		                    });
		                	
		                }
						});
				}
				
				if(defaults.isShowSaveDraftBtn){
					Newtec.Button.create({//
		                id: 'saveDraft',
		                title: defaults.saveDraftTitle,
		                appendTo : '#buttons',
		                click: function () {
		                	Newtec.DS.get(defaults.saveDraftDsName).updateData({
		                        operId: defaults.saveDraftOperId,
		                        data:this.data,	
		                        callback:function(res){
		                        	

		                        }
		                    });
		                	
		                }
						});
				}
			}

		});
		return $(win);
	};
	
	Newtec.RecordClickWindow.create = function(params){
		return new Newtec.RecordClickWindow(params).init();
	};
	
	var mergeMap = function(map){//将所有map合并成一个map
		for (var i=1;i<arguments.length;i++){
		    map2=arguments[i];
		    for (var k in map2){
		    	map[k]=map2[k];
		    }
		  }
		return map;
	};
	/**
	 * 设置所有区域
	 */
	Newtec.RecordClickWindow.prototype.setFieldsReadOnly = function(){
		
	};
})();