;(function(){
	Newtec.InvoiceTemplate = function(params){
		this.defaults = {
			record : {},
			appendTo :'',//
			type : '',//单据类型
			canEdit :true//单据可编辑、不可编辑	
		};
		this.form ={};
		this.fields ={};
		this.expenseField =[//报销单
		    {name:"bpmProcessKey",hidden:true},                
		    {name:"expenseAmount",title:"报销金额"},
			{name:"payType",title:"结算方式"},
			{name:"payDirection",title:"支付方向"},
			{name:"reason",title:"报销事由"}
		];
		this.loanBillField =[//借款单
		    {name:"bpmProcessKey",hidden:true},
			{name:"loanPerson",title:"借款人"},
			{name:"loanAmount",title:"借款金额"},
			{name:"reason",title:"借款事由"},
			{name:"costType",title:"费用类型"},
			{name:"drawDate",title:"取款日期"}
		];
		this.travelRequestField=[//出差单
		    {name:"bpmProcessKey",hidden:true},
		 	{name:"startPoint",title:"起点"},
			{name:"endPoint",title:"终点"},
			{name:"cost",title:"金额"},
			{name:"theme",title:"出差主题"}
		];
		
		$.extend(true,this.defaults,params);
	};
	
	Newtec.InvoiceTemplate.prototype = new Newtec.Base("invoiceTemplate");
	
	Newtec.InvoiceTemplate.prototype.createNewtecJQ = function(params){
		var record = this.defaults.record;
		var type = this.defaults.type;
		if(Newtec.Utils.isNull(type)){
			type = record.bpmProcessName;
		}
		if(!Newtec.Utils.isNull(type)){//若record为空则为新建单据
			if(type=='报销单'){
				this.fields = this.expenseField;
			}
			if(type=='借款单'){
				this.fields = this.loanBillField;
			}
			if(type=='出差单'){
				this.fields = this.travelRequestField;
			}	
		}
		
		var title = '<div id="invoiceTitle" style="text-align:center;"><h2>'+type+'</h2></div><div id="invoice"></div>';
		$(this.defaults.appendTo).append(title);
		this.form = Newtec.Form.create({
			appendTo:'invoice',
    		titleColumn:4,
    		columnNum:2,
    		fields:this.fields,
    		itemParams:{titleAlign:'center',titleRate:25}
		});
		if(!Newtec.Utils.isNull(record)){
			console.log(record);
			this.form.setValues(record);
		}
		return $(this.defaults.appendTo);
	};
	
	
	Newtec.InvoiceTemplate.create = function(params){
		return new Newtec.InvoiceTemplate(params).init();
	};
	
	Newtec.InvoiceTemplate.prototype.getValues = function(){
		if(!Newtec.Utils.isNull(this.form)){
			return this.form.getValues();
		}else {
			return '';
		}
		
	};
})();