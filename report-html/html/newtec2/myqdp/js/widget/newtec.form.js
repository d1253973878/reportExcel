;(function(){
	if(Newtec.Form){
		console.warn("已经在加载")
		return;
	}
	/*if($('#bootstrap-multiselect_css')[0]==undefined){//确保加入第一；和顺序有关哦
		$('head').prepend("<link rel='stylesheet' href='"+Newtec.cssPath+"bootstrap-multiselect.min.css' id='bootstrap-multiselect_css'/>");
	}
	if($('#bootstrap-multiselect_js')[0]==undefined){
		document.write("<script src='"+Newtec.jsPath+"bootstrap-multiselect.min.js' id='bootstrap-multiselect_js'></script>");
	}*/
//	Newtec.Utils.addCSS("bootstrap-multiselect.min.css");
//	Newtec.Utils.addJS("bootstrap-multiselect.min.js");
	Newtec.Utils.addCSS("newtec-form.css","myqdp/css/widget/");
	Newtec.Utils.addCSS("bootstrapValidator.min.css");
	Newtec.Utils.addJS("bootstrapValidator.min.js");
	
	Newtec.Utils.addStyle(".multiselectDiv .radio{padding:5px 3px}"+
			".multiselectDiv input[type=radio].ace:checked+.lbl::before { content: none;}"+
			".multiselectDiv input[type=radio].ace:checked+.lbl::before { content: none;}"+
			".multiselectDiv input[type=radio].ace+.lbl::before {content: none;}");
	Newtec.Utils.addJS(["widget/newtec.formitem.js","widget/newtec.myformItem.js"]);
//	multiselect-radio
//	alert('3='+$('#bootstrap-multiselect_js')[0]);
//	alert('4='+$('#bootstrap-multiselect_css')[0]);
//	document.write("<link rel='stylesheet' href='assets/css/ace.min.css' class='ace-main-stylesheet' id='main-ace-style' />");
	if(Newtec.Form != undefined){
		alert('表單已经初始化啦');
		return ;
	}
    Newtec.Form = function (params) {
    	this.defaults = {
    			operType:'form',//增删改查表单类型
        		formColumn:12,/*一行表单的总列数*/
            /**一列放的控件个数：支持 1 2 3 4 6 12*/
        		columnNum: 2,
        		titleColumn:3,
            /**支持栅格 xs sm md lg*/
        		columnType: 'md',
        		innerClass:'',
        		method: 'get',
        		enctype: 'text/plain',
        		fields: [],
        		footer : '',
        		itemParams:'',//所以列通用属性
        		values:'',
        		formType:'',//默认为空;table:将form由table形状展示;bottomBorder:只有个下划线
        		toString:true,
        		showMax:0,
        		formClass:'',
//        		borderColor:'#a9a5a5',
        		hidenHeigth:0,
        		domStyle:null,
        		createFieldBefore:function(field){return true;}//创建之字段前可以改变field的内容；返回false表示不创建该字段
        };
//    	alert("params=="+Newtec.Utils.json2str(params));
    	this.defaults = $.extend({},this.defaults,params);
//    	alert("this.defaults=="+Newtec.Utils.json2str(this.defaults));
    	this.operType = this.defaults.operType;
//    	alert('this.operType=='+this.operType);
    	this.ds = this.defaults.ds;
    	this.fields='';
    	this.form = '';//jquery真是Form对象
    	this.items = {};
    	this.formDiv1 ;
    	this.formDiv2 ;
    	this.otherValue={};//装着其他非表单项目的值，通过getAllValues可以取到所有值
    };
//    Newtec.Form.prototype = new Newtec.Base('form');;
    Newtec.Form.exte(Newtec.Base,'form');
//	Newtec.Form.prototype.type='form';
    Newtec.Form.prototype.createNewtecJQ=function(params){
//    	alert("------------"+JSON.stringify(params));
    	var formColumn = this.defaults['formColumn'];//一行表单的总列数
    	//alert(column);
//    	var form = "<div class='row'>"
//    			+"<div class='col-xs-"+formColumn+"'>"
//    			+"<form class='form-horizontal' role='form' id='"+this.id+"'>";
//    	form=form+"</div>"
//		+"</div>";
//    	var formDiv = "<div></div>"
    	var style=this.styleJson2Str(params.domStyle);
    	var formDiv1 = "<div class='row newtec-form' style='"+style+"'></div>";
    	var formDiv2 = "<div class='form-body col-xs-"+formColumn+(params['innerClass']&&" "+(params['innerClass'])||"")+" "+(params.formType||"")+"' style='"+((params['innerStyle'])&&(params['innerStyle'])||"")+"'></div>";
//  	var form = "<form class='form-horizontal "+(params['formClass']||"")+"' onkeydown='if(event.keyCode==13)return false;' id='"+this.id+"' style='"+((params['formStyle'])&&(params['formStyle'])||"")+"'>";
    	var form = "<form class='form-horizontal "+(params['formClass']||"")+"' id='"+this.id+"' style='"+((params['formStyle'])&&(params['formStyle'])||"")+"'>";
		this.form = $(form);
//		this.formDiv = $(formDiv)
		this.formDiv1 = $(formDiv1) ;
		this.formDiv2 = $(formDiv2) ;
		this.formDiv2.append(this.form);
		this.formDiv1.append(this.formDiv2);
//		this.formDiv.append(this.formDiv1);
		var fields = this.defaults['fields'];
		this.setFields(fields);
		this.setDS(this.defaults['ds'], true);
		this.initValidator();
		this.setFooter(this.defaults['footer']);
    	return this.formDiv1;
    };
    Newtec.Form.prototype.showMore=function(){
    	var showMoveDiv=this.showMoveDiv;
    	var This=this;
    	var params=this.defaults;
    	var hidenHeigth=params.hidenHeigth;
    	if(showMoveDiv){
    		showMoveDiv.css('display','block');
    	}else{
    		this.formDiv2.css({'overflow':'hidden','height':hidenHeigth});
    		this.formDiv1.append('<div style="clear: both;"></div>');
    		showMoveDiv=this.showMoveDiv=$("<div style='text-align: center;height	:0px;border-bottom:1px solid #ddd;margin-bottom:30px;"+params['moreStyle']+"'>"+
					"<button class='button' "+
					"style='background: #fff; font-size: 16px;color: #A29D9D; height: 36px; width: 180px; border: 1px solid #ddd; padding-left: 10px;'>"+
					"更多∨"+
					"</button>"+
			"</div>");
    		this.formDiv1.append(showMoveDiv);
    		var fields=this.fields;
    		var showMax=params.showMax;
    		showMoveDiv.on('click','button',function(){
    			var text=$(this).text();
    			var button=$(this);
    			if(text=='更多∨'){
    				This.formDiv2.css("height","auto");
//    				This.setFields(fields,showMax);
    				button.text('收起∧');
    			}else{
//    				This.setFields(fields)
    				This.formDiv2.css("height",params.hidenHeigth);
    				button.text('更多∨');
    			}
    		});
    	}
    };
    Newtec.Form.prototype.hidenMore=function(){
    	this.showMoveDiv.css('display','none');
    };
    Newtec.Form.prototype.setFooter = function(footer){
    	if(!Newtec.Utils.isNull(footer)){
    		Newtec.Utils.append($("<div class='row'></div>").appendTo(this.formDiv1),footer);
    	}
    };
    Newtec.Form.prototype.initValidator=function(){
    	var fieldValidator = {};
    	var fields = this.fields;
		var len = fields.length;
		var validators ;
    	for(var i=0;i<len;i++){
    		var field = fields[i];
    		var name = field['name'];
    		var valiType=field['valiType'];
    		var fieldValidators = field['validators'];
    		if(fieldValidators != undefined){//将字段的验证信息收集
    			if(validators==undefined)validators={};
    			validators[name] = {'validators':fieldValidators};
    		}
    		var required = Newtec.Utils.getFieldAttrValue(field,'required',this.defaults.type);
    		if(!Newtec.Utils.isNull(required)){//必填字段加入验证
    			if(validators==undefined)validators={}; 
    			var nameVa = validators[name];
    			if(nameVa==undefined){
    				nameVa={};
    				validators[name]=nameVa;
    			}
    			if(nameVa.validators==undefined)nameVa.validators={};
//    			alert(nameVa.validators+"==="+field['name']);
    			nameVa.validators.notEmpty = {message: required};
    			if(!Newtec.Utils.isNull(valiType)){
    				if(valiType=="tel"){
    					nameVa.validators.regexp = {
    							regexp:/^1[345789]\d{9}$/,
    							message:"请输入正确的手机号码"
    							};
    				}else if(valiType=="phone"){
    					nameVa.validators.regexp = {
    							regexp:/^0\d{2,3}-?\d{7,8}$/,
    							message:"请输入正确的电话号码，例：0220-8888888"
    					}
    				}else if(valiType=="email"){
    					nameVa.validators.regexp = {
    							regexp:/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    							message:"请输入正确的邮箱,如163@163.com"
    					}
    				}else if(valiType=="number"){
    					nameVa.validators.regexp = {
    							regexp:/^\d+(\.\d+)?$/,
    							message:"请输入正确数字"
    					}
    				}else if(valiType=="datetime"){
    					nameVa.validators.regexp = {
    							regexp:/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
    							message:"请输入正确的日期格式，例：2014-01-01"
    					}
    				}else if(valiType=="en"){
    					nameVa.validators.regexp = {
    							regexp:/^[A-Za-z]*$/,
    							message:"请输入纯字母"
    					}
    				}else if(valiType=="noCh"){
    					console.info("=============1==========");
    					nameVa.validators.regexp = {
    							regexp:/[^\u4E00-\u9FA5]$/,
    							message:"请输入非中文字符"
    					}
    				}else if(valiType=="idCard"){
    					nameVa.validators.regexp = {
    							regexp:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    							message:"请输入正确的身份证号，例：111111191111111111"
    					}
    				}
    			}
//    			{validators:{notEmpty: {message: required}}};
    		}
    	}
//    	alert(name+">>>"+Newtec.Utils.json2str(validators));
    	if(validators != undefined){
    		this.form.bootstrapValidator({
    			message: 'This value is not valid',excluded: ':disabled',
    			feedbackIcons: {
    				valid: 'glyphicon glyphicon-ok',
    				invalid: 'glyphicon glyphicon-remove',
    				validating: 'glyphicon glyphicon-refresh'
    			},
		             fields:   validators
		        });
    	}
		/* this.form.bootstrapValidator({
		message: 'This value is not valid',container: 'tooltip',excluded: ':disabled',
		             feedbackIcons: {
		                 valid: 'glyphicon glyphicon-ok',
		                 invalid: 'glyphicon glyphicon-remove',
		                 validating: 'glyphicon glyphicon-refresh'
		             },
//		             fields : fieldValidator
		             fields:  {
		            	 te1:{
			                    validators: {
			                        notEmpty: {
			                            message: '街道不能为空'
			                        },
			                        callback: {
			                            message: 'Please choose 2-3 browsers you use for developing',
			                            callback: function(value, validator) {
			                            	if(Newtec.Utils.isNull(value)) return false;
			                            	else return true;
			                            }
			                        }
			                    }
			                }
		             }
		        });*/
		 /*this.form.bootstrapValidator({
	            message: 'This value is not valid',
	            container: 'tooltip',
	            feedbackIcons: {
	                valid: 'glyphicon glyphicon-ok',
	                invalid: 'glyphicon glyphicon-remove',
	                validating: 'glyphicon glyphicon-refresh'
	            },
	            fields: {
	            	te1: {
	                    message: 'The postal code is not valid',
	                    validators: {
	                    	notEmpty: {
	                            message: 'Your postal code is required and cannot be empty'
	                        }
	                    }
	                }
	            }
	        })*/
		 var t = this;
		 this.form.on('success.form.bv', function(e) {
//             alert(  '-->success');
			 t.validateResult = true;
//			 e.preventDefault();
         }).on('error.form.bv', function(e) {
//        	 alert('-->error');
        	 t.validateResult = false;
         });
    };
    Newtec.Form.prototype.finsh = function(){
//    	this.validate();
    	this.setValues(this.defaults['values']);
    };
    Newtec.Form.prototype.validate = function(){
//    	this.form.bootstrapValidator('validate');
    	var result = this.form.bootstrapValidator('submit');
//    	alert('验证结果：'+result);
    	return this.validateResult;
    };
    Newtec.Form.prototype.setColmnNum = function(columnNum){
    	if(columnNum>12) columnNum = 12;
    	else if(columnNum<1) columnNum =1;
		this.defaults.columnNum = columnNum;
		var col = parseInt(this.defaults.formColumn / columnNum);
    	for(var i in this.fields){
    		$('#'+this.getFormFieldId(this.fields[i]['name'])).attr("class", "form-group col-xs-12 col-"+this.defaults.columnType+"-"+col);
    	}
	
    };
    Newtec.Form.prototype.getFormFieldId = function(fieldName){
    	return this.id+"_"+fieldName;
    }
    Newtec.Form.prototype.setDS = function(ds,useDSFields){
    	if(ds==undefined) return ;
    	this.ds = ds;
    	if(useDSFields && Newtec.Utils.isNull(this.fields)){
    		if(Newtec.Utils.isNull(ds.fields))return;
    		var dsFields = $.extend(true, [], ds.fields);
    		this.setFields(dsFields);
    	}
    };
    Newtec.Form.prototype.setFields = function(fields,begin){
    	if(Newtec.Utils.isNull(fields)) return ;
    	this.fields = fields;
    	var params = this.defaults;
    	var formColumn = params['formColumn'];
    	var columnNum = params['columnNum'];//一行的控件数量
//    	columnNum = fields.length<columnNum?fields.length:columnNum;//如果字段的个数少于一行控件的数量的话，将一行控件的数量设置成字段数量
//    	params['columnNum'] = columnNum;
//    	columnNum =
    	var titleColumn =  params['titleColumn'];
    	var columnType = params['columnType'];
    	begin=begin?begin:0;
    	if(begin==0)this.form.empty();
    	var column = parseInt(formColumn/columnNum); //每个控件所占有的数量（包括标题和内容）
//    	alert(formColumn+""+columnNum+""+(formColumn/columnNum)+'columnType==='+columnType);
    	var len = fields.length;
    	if(params.showMax>0&&len>params.showMax&&begin==0){
    		this.showMore();
//    		len=params.showMax;
    	}
    	var formType=params.formType
    	var borderColor=params.borderColor;
    	
    	for(var i=begin;i<len;i++){
			var field = fields[i];
			if(!Newtec.Utils.isNull(params['itemParams'])){
    			var itemParams=$.extend(true,{},params['itemParams'])
    			fields[i]=field=$.extend(true,itemParams,field);
    		}
			var titleNum = field['titleColumn'] || titleColumn;
//			if(formType=="table"){
//	    		var itemDivStyle=';margin:0;padding:0;border-bottom:1px solid ;border-right:1px solid;'
//				if(i%columnNum==0){//每行第一个
//					itemDivStyle+='border-left:1px solid;'
//				}
//				if(columnNum>i){//第一行
//					itemDivStyle+='border-top:1px solid;'
//				}
//				var valueDivClass="";
//				field.valueDivStyle+=";border-left:1px solid;border-color:"+borderColor+";"
//				field.itemDivStyle+=itemDivStyle+'border-color:'+borderColor+';color:#676666;';
//				field.inputStyle+=';border:0;background:transparent;';
//				
				
//			}else if(formType=='bottomBorder'){
//				field.valueDivStyle+=";border-bottom:1px solid; border-color:"+borderColor+";";
//				field.inputStyle+=';border:0;background:transparent;'
//			}
			field.valueDivClass=(field.valueDivClass||"")+" col-value";
			field.inputClass=(field.inputClass||"")+" col-input";
			var valueNum = field['valueColumn'] || (12-titleNum);
			field.placeholder = Newtec.Utils.isNull(field['placeholder']) ? "": (" placeholder='"+field['placeholder']+"' ");
			field.columnType = columnType;
			field.column =field['column']||column;
			field.titleNum = titleNum;
			field.valueNum= valueNum;
			var createFieldBefore = this.defaults.createFieldBefore;
			var createFieldBeforeRet = true;
			if(Newtec.Utils.isFunction(createFieldBefore))createFieldBeforeRet = createFieldBefore(field,this.operType,this.ds==undefined ? '' : this.ds.dsName);
			if(createFieldBeforeRet != false){
				var fieldObj = this.createField(field);
//				alert(fieldObj+"......"+i+"\\\\"+JSON.stringify(field)+"........."+this.form);
				Newtec.Utils.appendTo(fieldObj,this.form);
			}
		}
    };
    Newtec.Form.prototype.addFormItem=function(field){
    	if(Newtec.Utils.isArray(field)){
    		for ( var i = 0; i < field.length; i++) {
				this.addFormItem(field[i]);
			}
    	}else{
    		var params=this.defaults;
    		var fields=this.fields; 
    		fields.push(field);
    		var formColumn = params['formColumn'];
        	var columnNum = params['columnNum'];//一行的控件数量
        	var titleColumn =  params['titleColumn'];
        	var columnType = params['columnType'];
        	columnNum = fields.length<columnNum?fields.length:columnNum;//如果字段的个数少于一行控件的数量的话，将一行控件的数量设置成字段数量
        	params['columnNum'] = columnNum;
    		var titleNum = field['titleColumn'] || titleColumn;
			var valueNum = field['valueColumn'] || (12-titleNum);
			var column = parseInt(formColumn/columnNum);
			field.placeholder = Newtec.Utils.isNull(field['placeholder']) ? "": (" placeholder='"+field['placeholder']+"' ");
			field.columnType = columnType;field.column = column;field.titleNum = titleNum;field.valueNum= valueNum;
			var createFieldBefore = this.defaults.createFieldBefore;
			var createFieldBeforeRet = true;
			if(Newtec.Utils.isFunction(createFieldBefore))createFieldBeforeRet = createFieldBefore(field,this.operType,this.ds==undefined ? '' : this.ds.dsName);
			if(createFieldBeforeRet != false){
				var fieldObj = this.createField(field);
//				alert(fieldObj+"......"+i+"\\\\"+JSON.stringify(field)+"........."+this.form);
				Newtec.Utils.appendTo(fieldObj,this.form);
			}
    	}
    	
    };
    Newtec.Form.prototype.removeFormItem=function(names){
    	if(Newtec.Utils.isArray(names)){
    		for ( var i = 0; i < names.length; i++) {
    			this.removeFormItem(names[i]);
    		}
    	}else{
    		var item =this.items[names];
    		if(Newtec.Utils.isNewtec(item)){
    			item.newtecJQ.remove();
    			delete this.items[name]; 
    		}
    	}
    };
    Newtec.Form.prototype.setValues = function(jsonValue){
    	if(!Newtec.Utils.isJson(jsonValue)) return ;
    	for(var name in jsonValue){
        	this.setValue(name,jsonValue[name]);
    	}
    	
    }
    /**
	 * @author 王仕通 2016-10-17 
	 * 说明：下拉列表赋值还未实现
	 */
    Newtec.Form.prototype.setValue = function(name,value){
    	if(Newtec.Utils.isNull(name)&&!Newtec.Utils.isNull(value)){
    		var items=this.items;
    		for ( var key in items) {
    			if(!Newtec.Utils.isFunction(items[key].setValue))
    				continue;
    			items[key].setValue(value);
			}
    	}
    	var item = this.items[name];
    	if(item != undefined){
    		if(!Newtec.Utils.isFunction(item.setValue)){
//  			alert(name+"没有setValue方法！");
    			return;
    		}
    		item.setValue(value);
    	}else{
    		if(Newtec.Utils.json2str(this.otherValue))this.otherValue={}
    		this.otherValue[name] = value;
    	}
    }
    /**
     * 方法说明：清除值，(后期利用分发到每个item上自身处理)
     * noClearFields:不需要清除的字段[]
     */
    Newtec.Form.prototype.clearValues = function(noClearFields){
    	if(Newtec.Utils.isNull(noClearFields)){
    		var fields=this.fields;
    		for(var i=0;i<fields.length;i++){
    			var f=fields[i];
    			this.setValue(f['name'],'');
    		}
    	}else{
    		if(Newtec.Utils.isString(noClearFields)) noClearFields = [noClearFields];
    		for(var i=0;i<noClearFields.length;i++){
    			this.setValue(noClearFields[i],'');
    		}
    	}
    };
    Newtec.Form.prototype.getValue = function(name){
    	console.info(this.items[name]);
    	return this.items[name].getValue();
    };
    Newtec.Form.prototype.getFormDatas = function(name){
    	if(Newtec.Utils.isNull(name)){
    		var items=this.items;
			var formData=new FormData();
    		for(var key in items){
    			var item=items[key];
				if(item.type!="file")continue;
				console.info(item);
				item.getValue(formData);
    		}
			console.info("===>>",formData);
			return formData;
    	}else{
    		return this.items[name].getData();
    	}
    	return this.items[name].getData();
    };
    Newtec.Form.prototype.getAllValues = function(){
    	return Newtec.Utils.jsonCopy(this.getValues(),Newtec.Utils.jsonCopy(this.otherValue));
    };
    Newtec.Form.prototype.getValues = function(visable){
    	var date1 = new Date();
    	var values = {};
//    	console.log(this.form.serializeArray());
    	for(var name in this.items){
    		var getValue=this.items[name].getValue;
    		if(!Newtec.Utils.isFunction(getValue))return;
    		var v = this.items[name].getValue();
    		if(!(this.operType ==Newtec.DS.OperType.add && Newtec.Utils.isNull(v))){//增加表单中的表单项为空值不传向后台
    			values[name] = v;
//    			alert(name+"=="+v+"--"+this.operType+(this.operType ==Newtec.DS.OperType.add)+(Newtec.Utils.isNull(v)));
    		}/*else{
//    			alert("name123=="+name);
    		}*/
    	}
    	if(visable ==true || visable=='true'){//只留下可见的
    		var vis = [];
    		var len = this.fields.length;
    		for(var i=0;i<len;i++){
    			var f = this.fields[i];
    			if((Newtec.Utils.getFieldAttrValue(f,'hidden',this.operType)+"")!='true'){//可见的
    				vis.push(f.name);
    			}
    		}
    		for(var key in values){
    			if(vis.indexOf(key)==-1)//不可见
    				values[key] = undefined;
        	}
//    		alert('values==='+values);
    	}

//    	alert("时间：("+(new Date().getTime()-date1.getTime())+")");
    	return values;
    };
    Newtec.Form.prototype.fetchData = function(){
    	if(Newtec.Utils.isNull(this.ds)) return;
    	this.ds.fetchData(this.getValues());
    };
   /**
 * @author 王仕通 2016-10-14 
 * 说明：表单数据保存，包括数据的增加和修改（无主键或主键值为空时表示增加；主键有值表示更新）
 * callback:回调函数
 * operId:操作Id
 */
    Newtec.Form.prototype.saveData = function(callback,operId){
    	if(Newtec.Utils.isNull(this.ds)) return;
    	var values = this.getValues();
    	var pk = this.ds.pk;
    	var params = {};//将格式转化成ds需要的格式{... data:{}}
    	//此处需要验证values值的合法性哈。。。。。。
    	
		params['data'] = values;
		params['callback']=callback;
		if(!Newtec.Utils.isNull(operId))
			params['operId'] = operId;
    	if(!Newtec.Utils.isNull(pk) && !Newtec.Utils.isNull(values[pk])){//更新操作
    		this.ds.updateData(params);
    	}else{//增加操作
    		this.ds.addData(params);
    	}
    	
    }
   
    Newtec.Form.prototype.createField = function(f){
    	var type = f['type'];
    	var params=this.defaults;
    	if(Newtec.Utils.isNull(type)){
    		type='text';
    		f['type'] = type;
    	}
    	var name = f['name'];
    	f['id'] = this.getFormFieldId(name);
    	var item ;
    	
    	if(true){
    		var funcType = Newtec.funcType[type];
    		if(funcType==undefined){
    			alert(name+"字段"+type+"类型没有处理类，请确认extend(Newtec.FormItem,'')");
    		}
//    		item = new funcType().initItem(f,this);
    		//alert(12);
    		item = funcType.create(f,this);
    		this.items[name] = item;
    		return item['newtecJQ'];
    	}
    	
    	/*if(type=='text' || type=='password'){
//    		item = this.createTextField(f);
    		item = Newtec.TextItem.create(f,this);
    	}else if(type=='checkbox' || type=='radio'){
//    		item = this.createCheckboxField(f);
    		item = Newtec.CheckItem.create(f,this);
    	}else if(type=='select'){
    		item = Newtec.SelectItem.create(f,this);
    	}
    	this.items[name] = item;
//    	if(Newtec.Utils.isString(item)){
//    		return item;
//    	}else
    		return item['newtecJQ'];*/
    };

//    Newtec.Form.create = function (params) {
//    	return new Newtec.Form(params).init(params);
//    };
    /**
     * 表单制定item隐藏
     */
    Newtec.Form.prototype.hidden = function(names){
    	if(Newtec.Utils.isArray(names)){
    		for(var i=0;i<names.length;i++){
    			this.hidden(names[i])
    		}
    	}else if(Newtec.Utils.isNull(names)){
    		this.newtecJQ.addClass("newtec-hidden");
    	}else{
    		this.items[names]&&this.items[names].hidden();
    		this.enableValidators( names,false)
    	}
    	
    }
    /**
     * 功能：设置列的验证功能
     * @param {Object} names 指定列明
     * @param {Object} isAble ture:开启验证 false：关闭验证
     */
    Newtec.Form.prototype.enableValidators = function(names,isAble){
    	if(Newtec.Utils.isArray(names)){
    		for(var i=0;i<names.length;i++){
    			this.enableValidators(names[i],isAble)
    		}
    	}else{
    		this.form.bootstrapValidator('enableFieldValidators', names,isAble)
    	}
    	
    }
    /**
     * 表单制定item显示
     */
    Newtec.Form.prototype.show = function(names){
    	if(Newtec.Utils.isArray(names)){
    		for(var i=0;i<names.length;i++){
    			this.show(names[i])
    		}
    	}else if(Newtec.Utils.isNull(names)){
    		this.newtecJQ.removeClass("newtec-hidden");
    	}else{
    		this.items[names]&&this.items[names].show();
    		this.enableValidators( names,true)
    	}
    	
    }
    Newtec.Module("Form")
})();