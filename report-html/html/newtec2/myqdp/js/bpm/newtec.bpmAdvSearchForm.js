;(function(){
	Newtec.BpmAdvSearchForm = function(params){
		this.defaults = {
			title : '高级搜索',
			appendTo : '',
			pickListParam : '',//下拉列表参数
			formFields : '',
			pageBody : '',//主页面
			pageTable : '',//页面表格
			dsName : '',
			operId : ''
		};
		this.btns;
		this.pickListForm;
		this.form;
		this.formBody;
		this.container;
		$.extend(true,this.defaults,params);
	};
	
	Newtec.BpmAdvSearchForm.prototype = new Newtec.Base("bpmAdvSearchForm");
	
	Newtec.BpmAdvSearchForm.prototype.createNewtecJQ = function(params){
		var config = this.defaults;
		var pickListParam = config.pickListParam;
		var advForm = $("<div style='width:100%;height:100%;padding:30px' id = 'advForm'></div>");
		var title = $('<div><label style="white-space:nowrap;font-size:16px;font-family:微软雅黑;color:#000;font-weight:100;">'+config.title+'</label></div>');
		var pickList = $("<div></div>");
		this.pickListForm = Newtec.Form.create({//下拉列表
		    appendTo:pickList,
		    titleColumn:2,
		    columnNum:4,
		    fields:pickListParam,
		    formType:'bottomBorder',
		    itemParams:{titleAlign:'center',titleWRate:25}
		});
		this.formBody = $("<div name = 'formBody'></div>");
		this.form = Newtec.Form.create({//表单
			appendTo:this.formBody,
			titleColumn:2,
			columnNum:4,
			formType:'bottomBorder',
			itemParams:{titleAlign:'center',titleWRate:25}
		});
		var btns = $("<div></div>");
		this.btns = btns;
		this.initBtns(params);//加载按钮
		advForm.append(title);
		advForm.append(pickList);
		advForm.append(this.formBody);
		advForm.append(btns);
		$(config.appendTo).append(advForm);
		this.container = advForm;
		return advForm;
	};
	
	Newtec.BpmAdvSearchForm.create = function(params){
		return new Newtec.BpmAdvSearchForm(params).init();
	};
	
	Newtec.BpmAdvSearchForm.prototype.initBtns = function(params){
		var config = this.defaults;
		var table = config.pageTable;
		var pageBody = config.pageBody;
		console.log(table)
		var submitBtn = $('<div class="label_radius_17" style="left:10px;width:70px;height:34px;background-color:#01aeef;cursor:pointer;" align="center" valign="center" ><label style="font-weight:100;white-space:nowrap;font-size:14px;font-family:微软雅黑;color:#FFF;">确&nbsp定</label></div>');
		var cancelBtn = $('<div class="label_radius_17" style="border:2px solid #01aeef;left:90px;width:70px;height:34px;cursor:pointer;" align="center" valign="center" ><label style="font-weight:100;white-space:nowrap;font-size:14px;font-family:微软雅黑;color:#01aeef;">取&nbsp消</label></div>');
		var clearBtn = $('<div class="label_radius_17" style="border:2px solid #01aeef;left:170px;idth:70px;height:34px;cursor:pointer;" align="center" valign="center" ><label style="font-weight:100;white-space:nowrap;font-size:14px;font-family:微软雅黑;color:#01aeef;">清&nbsp空</label></div>');
		console.log(this.form);
		console.log(this.pickListForm);
		var form = this.form;
		var pickListForm = this.pickListForm;
		submitBtn.click(function(){
			Newtec.DS.get(params.dsName).fetchData({
				operId:params.operId,
				data : _mergeMap(pickListForm.getValues(),form.getValues()),
				callback:function(res){
					table.setData(res.data,false,null);	
				}
			});
			$("#advForm").hide();
			$(pageBody).show();
		})
		
		cancelBtn.click(function(){
			$("#advForm").hide();
			$(pageBody).show();
		})
		
		clearBtn.click(function(){
			this.form.clearValues();
		})
		this.btns.append(submitBtn,cancelBtn,clearBtn);
	};
	
	Newtec.BpmAdvSearchForm.prototype.addBtn = function(btn){
		this.btns.append(btn);
	};
	
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
