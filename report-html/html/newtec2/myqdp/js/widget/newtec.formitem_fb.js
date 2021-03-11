;(function(){
	
	//1.
	Newtec.FormItem = function () {
		//2.
		this.defaults = {
			//缺省	
			showTitle:true,
			mainDivStyle:'',
			inputDivStyle:''
        };
		this.newtecForm;
//		this.name=params.name;
//    	$.extend(this.defaults,params);
	};
	//3.
	Newtec.FormItem.prototype = new Newtec.Base('formItem');
	//4.
	Newtec.FormItem.prototype.createNewtecJQ=function(f){
		alert(f.name+"文本框jquery");
	};
	Newtec.FormItem.prototype.getFormFieldValueId = function(){
		if(Newtec.Utils.isNull(this.newtecForm))return this.id+"_"+this.defaults['name']+"_v";
    	return this.newtecForm.id+"_"+this.defaults['name']+"_v";
    };
    Newtec.FormItem.prototype.getMainDiv=function(){
    	var f=this.defaults;
    	var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
    	var div1 =$( "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-"+f.column+"' "+this.getFormFieldStyle(f)+">"
    	+"</div>");
    	if(f.showTitle){
    		var t=$("<label class='control-label col-"+f.columnType+"-"+f.titleNum+" no-padding-right'  style='white-space:nowrap;padding-left: 0;'>"+f['title']+"</label>");
    	    div1.append(t);
    	}
    	return div1;
    };
    Newtec.FormItem.prototype.getInputDiv=function(){
    	var f=this.defaults;
    	var div2 = "<div class='col-xs-12 col-"+f.columnType+"-"+f.valueNum+" multiselectDiv' style='"+f.inputDivStyle+"'></div>";
    	return $(div2);
    }
	Newtec.FormItem.prototype.getValue = function(){
		
	};
	/*Newtec.FormItem.prototype.initItem = function(field,newtecForm){
//		this.newtecForm = newtecForm;
		this.newtecForm=Newtec.Utils.isNull(newtecForm)?this.defaults['newtecForm']:newtecForm;//表单设置
		this.name=field.name;
		this.type = Newtec.Utils.isNull(this.type) ? field.type : this.type;
		return this.init(field);
	};*/
	Newtec.FormItem.prototype.init = function(field,newtecForm){
//		this.newtecForm = newtecForm;
		this.newtecForm=Newtec.Utils.isNull(newtecForm)?this.defaults['newtecForm']:newtecForm;//表单设置
		this.name=field.name;
		this.type = Newtec.Utils.isNull(this.type) ? field.type : this.type;
//		return this.parent.prototype.init.apply(this.a, arguments);//不起作用(之前将parent设置好)
		return Newtec.Base.prototype.init.call(this,field,newtecForm);//调用父类的方法（这种调用方式比普通的调用方式慢2倍，上万次调用才会体现）
		//return Newtec.Base.prototype.init.apply(this, arguments);//调用父类的方法（这种调用方式比普通的调用方式慢4倍，上万次调用才会体现）
	};
	Newtec.FormItem.prototype.getFormFieldStyle = function(field,otherStyle){
		var f=this.defaults;
    	var hidden = Newtec.Utils.isTrue(Newtec.Utils.getFieldAttrValue(field,'hidden',Newtec.Utils.isNull(this.newtecForm)?'':this.newtecForm.operType))?"display:none; ":" ";
//    	if(field['name']=='address')
//    		alert(field['name']+this.newtecForm.operType+'=='+Newtec.Utils.getFieldAttrValue(field,'hidden',this.newtecForm.operType)+"==>"+hidden+"--"+Newtec.Utils.json2str(field)+"---");
    	if(otherStyle==undefined) otherStyle = "";
    	style = " style='margin-left:0;margin-right:0;"+hidden+ otherStyle+f.mainDivStyle+"' ";
    	return style;
    };
	/*Newtec.LabelPane.create = function(params){
		return new Newtec.LabelPane(params).init();
	};*/
	 /*******文本框开始******************/
	Newtec.TextItem = function () {
		//1.定义缺省参数.
		var p='';
		if(this.defaults!=undefined){
			p=this.defaults;
		}
		this.defaults = {
			//type:'text'
			btnFun:function(item,field){},//这是一个函数，函数的返回值为构建按钮的json或按钮本身
        };
    	$.extend(true,this.defaults,p);
	};
	/*var parent = new Newtec.FormItem('text');
	Newtec.TextItem.prototype = parent;*/
	//2.继承父类
//	alert('Newtec.funcType1=='+Newtec.funcType);
	Newtec.TextItem.exte(Newtec.FormItem,'text');
//	alert('Newtec.funcType2=='+Newtec.funcType);
//	Newtec.TextItem.prototype.parent = parent;
	//3.实现接口
	Newtec.TextItem.over({
		/*createNewtecJQ:function(f){
			var form = this.newtecForm;
	    	var name = f['name'];
	    	var id = form.getFormFieldId(f['name']);
	    	var disabled = Newtec.Utils.getFieldAttr("disabled",Newtec.Utils.getFieldAttrValue(f,'disabled',this.operType));
	    	var readonly = Newtec.Utils.getFieldAttr('readonly',Newtec.Utils.getFieldAttrValue(f,'readonly',this.operType));
	    	var value = f['value']==undefined ? "": " value='"+f['value']+"' ";
	    	var item = "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-"+f.column+"' "+this.getFormFieldStyle(f)+" >"
			+"<label   class='col-"+f.columnType+"-"+f.titleNum+" control-label no-padding-right' for='form-field-1' style='white-space:nowrap;padding-left: 0;'>"+f['title']+" </label>"
			+"<span    class='col-"+f.columnType+"-"+f.valueNum+" input-icon'>"
//			+"<div class='input-group'>"
			+"<input type='"+f['type']+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='padding-left:5px;padding-right:5px;' class='form-control' />"
			+"<span class='input-group-btn'>"
			+"<button class='btn btn-default btn-danger' type='button' onclick='alert(1)'>xxx!</button>"
			+"<button class='btn btn-default btn-danger' type='button' onclick='alert(1)'>xxx!</button>"
			+"</span>"
//			+"</div>"
			+"</span>"
			+"</div>";
	    	return $(item);
		},*/
		createNewtecJQ:function(f){
			var form = this.newtecForm;
	    	var name = f['name'];
	    	var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
	    	var disabled = Newtec.Utils.getFieldAttr("disabled",Newtec.Utils.getFieldAttrValue(f,'disabled',this.operType));
	    	var readonly = Newtec.Utils.getFieldAttr('readonly',Newtec.Utils.getFieldAttrValue(f,'readonly',this.operType));
	    	var value = f['value']==undefined ? "": " value='"+f['value']+"' ";
//	    	var item = "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-"+f.column+"' "+this.getFormFieldStyle(f)+" >"
//			+"<label   class='col-"+f.columnType+"-"+f.titleNum+" control-label no-padding-right' for='form-field-1' style='white-space:nowrap;padding-left: 0;'>"+f['title']+" </label>"
//			+"<span    class='col-"+f.columnType+"-"+f.valueNum+" input-icon'>"
////			+"<div class='input-group'>"
//			+"<input type='"+f['type']+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='padding-left:5px;padding-right:5px;' class='form-control' />"
			/*+"<span class='input-group-btn'>"
			+"<button class='btn btn-default btn-danger' type='button' onclick='alert(1)'>xxx!</button>"
			+"<button class='btn btn-default btn-danger' type='button' onclick='alert(1)'>xxx!</button>"
			+"</span>"*/
//			+"</div>"
//			+"</span>"
//			+"</div>";
	    	//item = $(item);
//	    	item.append("<label   class='col-"+f.columnType+"-"+f.titleNum+" control-label no-padding-right' for='form-field-1' style='white-space:nowrap;padding-left: 0;'>"+f['title']+" </label>");
//	    	var span = $("<span    class='col-"+f.columnType+"-"+f.valueNum+" input-icon'></span>");
	    	var item=this.getMainDiv();
	    	
	    	var span=this.getInputDiv();
	    	item.append(span);
	    	var btn = f.btnFun;
	    	var result = Newtec.Utils.isFunction(btn) ? btn(this,f):undefined;
	    	if(Newtec.Utils.isFunction(btn) && result != undefined){
	    		var div = $("<div class='input-group'></div>");
	    		span.append(div);
	    		div.append("<input type='"+f['type']+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='padding-left:5px;padding-right:5px;' class='form-control' />");
	    		var spanBtn =$("<span class='input-group-btn'></span>");
	    		div.append(spanBtn);
	    		if(Newtec.Utils.isString(result)){
		    		result = $(result);
					spanBtn.append(result);
				}else{
					var len = result.length;
					if(len>0){
						for(var bb=0;bb<len;bb++){
							if(result[bb].style==undefined) result[bb].style = '';
							spanBtn.append(result[bb]['newtecJQ']==undefined?Newtec.Button.create(result[bb])['newtecJQ']:result[bb]['newtecJQ']);
						}
					}else{
						if(result.style==undefined) result.style = '';
						spanBtn.append(result['newtecJQ']==undefined?Newtec.Button.create(result)['newtecJQ']:result['newtecJQ']);
					}
				}
	    	}else{
	    		span.append("<input type='"+f['type']+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='padding-left:5px;padding-right:5px;' class='form-control' />");
	    	}
	    	this.item=item;
	    	return item;
		},
		getValue:function(){
			return $('#'+this.getFormFieldValueId()).val();
		},
		setValue : function(value){
//			this.newtecForm.form.find('#'+this.getFormFieldValueId()).each(function(){
//				$(this).val(value);
//			});
			this.item.find('#'+this.getFormFieldValueId()).each(function(){
				$(this).val(value);
			});
//			$('#'+this.getFormFieldValueId()).val(value);//不起作用，要在setTimeout中才起作用
		}
	});
//	Newtec.TextItem.create();
//	Newtec.TextItem.prototype.createNewtecJQ=function(f){
//			var form = this.newtecForm;
//	    	var name = f['name'];
//	    	var id = form.getFormFieldId(f['name']);
//	    	var disabled = Newtec.Utils.getFieldAttr("disabled",Newtec.Utils.getFieldAttrValue(f,'disabled',this.operType));
//	    	var readonly = Newtec.Utils.getFieldAttr('readonly',Newtec.Utils.getFieldAttrValue(f,'readonly',this.operType));
//	    	var value = f['value']==undefined ? "": " value='"+f['value']+"' ";
//	    	var item = "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-"+f.column+"' "+this.getFormFieldStyle(f)+" >"
//			+"<label   class='col-"+f.columnType+"-"+f.titleNum+" control-label no-padding-right' for='form-field-1' style='white-space:nowrap;padding-left: 0;'>"+f['title']+" </label>"
//			+"<span   class='col-"+f.columnType+"-"+f.valueNum+" input-icon'>"
//			+"<input type='"+f['type']+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='padding-left:5px;padding-right:5px;' class='form-control' />"
//			+"</span>"
//			+"</div>";
//	    	return $(item);
//		};
//	 Newtec.TextItem.prototype.getValue = function(){
//		return $('#'+this.getFormFieldValueId()).val();
//	}
//	Newtec.TextItem.prototype.setValue = function(value){
//		this.newtecForm.form.find('#'+this.getFormFieldValueId()).each(function(){
//			$(this).val(value);
//		});
////		$('#'+this.getFormFieldValueId()).val(value);//不起作用，要在setTimeout中才起作用
//	}
//	Newtec.TextItem.create = function(f,newtecForm){
//		var v = Newtec.TextItem;
//		return new v().initItem(f,newtecForm);
//	};
	/*******文本框结束******************/
	Newtec.TextAreaItem = function () {
		var p='';
		if(this.defaults!=undefined){
			p=this.defaults;
		}
		//1.定义缺省参数.
		this.defaults = {
			//type:'text'
			btnFun:function(item,field){},//这是一个函数，函数的返回值为构建按钮的json或按钮本身
        };
		$.extend(true,this.defaults,p);
	};
	Newtec.TextAreaItem.exte(Newtec.FormItem,'textarea');
	//3.实现接口
	Newtec.TextAreaItem.over({
		createNewtecJQ:function(f){
	    	var name = f['name'];
	    	var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
	    	var disabled = Newtec.Utils.getFieldAttr("disabled",Newtec.Utils.getFieldAttrValue(f,'disabled',this.operType));
	    	var readonly = Newtec.Utils.getFieldAttr('readonly',Newtec.Utils.getFieldAttrValue(f,'readonly',this.operType));
	    	var value = f['value']==undefined ? "": " value='"+f['value']+"' ";
//	    	var item = "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-"+f.column+"' "+this.getFormFieldStyle(f)+" >"
//			+"</div>";
//	    	item = $(item);
//	    	item.append("<label   class='col-"+f.columnType+"-"+f.titleNum+" control-label no-padding-right' for='form-field-1' style='white-space:nowrap;padding-left: 0;'>"+f['title']+" </label>");
//	    	var span = $("<span    class='col-"+f.columnType+"-"+f.valueNum+" input-icon'></span>");
            var item=this.getMainDiv();
	    	
	    	var span=this.getInputDiv();
	    	item.append(span);
	    	var btn = f.btnFun;
	    	var result = Newtec.Utils.isFunction(btn) ? btn(this,f):undefined;
	    	if(Newtec.Utils.isFunction(btn) && result != undefined){
	    		var div = $("<div class='input-group'></div>");
	    		span.append(div);
	    		div.append("<textarea type='"+f['type']+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='padding-left:5px;padding-right:5px;' class='form-control' ></textarea>");
	    		var spanBtn =$("<span class='input-group-btn'></span>");
	    		div.append(spanBtn);
	    		if(Newtec.Utils.isString(result)){
		    		result = $(result);
					spanBtn.append(result);
				}else{
					var len = result.length;
					if(len>0){
						for(var bb=0;bb<len;bb++){
							if(result[bb].style==undefined) result[bb].style = '';
							spanBtn.append(result[bb]['newtecJQ']==undefined?Newtec.Button.create(result[bb])['newtecJQ']:result[bb]['newtecJQ']);
						}
					}else{
						if(result.style==undefined) result.style = '';
						spanBtn.append(result['newtecJQ']==undefined?Newtec.Button.create(result)['newtecJQ']:result['newtecJQ']);
					}
				}
	    	}else{
	    		span.append("<textarea type='"+f['type']+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='padding-left:5px;padding-right:5px;' class='form-control' /></textarea>");
	    	}
	    	return item;
		},
		getValue:function(){
			return $('#'+this.getFormFieldValueId()).val();
		},
		setValue : function(value){
			this.newtecForm.form.find('#'+this.getFormFieldValueId()).each(function(){
				$(this).text(value);
			});
//			$('#'+this.getFormFieldValueId()).val(value);//不起作用，要在setTimeout中才起作用
		}
	});
	/*******文本域开始******************/
	
	/*******文本域结束******************/
	 /*******单选、多选开始******************/
	Newtec.RadioItem = function () {
		var p='';
		if(this.defaults!=undefined){
			p=this.defaults;
		}
		this.defaults = {
				defdata:{'true':'是','false':'否'}
		};
		$.extend(true,this.defaults,p);
	};
	Newtec.RadioItem.exte(Newtec.FormItem,"radio");
	Newtec.RadioItem.over({
		createNewtecJQ:function(f){
//			var form = this.newtecForm;
			var def=this.defaults;
//			var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
	    	var div1=this.getMainDiv();
	    	var div2=this.getInputDiv();
	    	div1.append(div2);
	    	var defaultValue = f['value'];
	    	console.info("--radio--");
	    	var data=Newtec.Utils.isNull(f['data'])?def['defdata']:f['data'];
	    	var radio='';
	    	for ( var key in data) {
	    		var checked=defaultValue==key?'checked':'';
	    		radio+='<label class="radio-inline" style="margin:0 10px 0 0;">'
	  	    	  +'<input type="radio" name="inlineRadioOptions" id="'+key+'" value="'+key+'" '+checked+'>'+data[key]+'</label>';
			}
	    	div2.append(radio);
	    	this.checkDiv=div2;
	    	return div1;
		},
	getValue:function(){
		return this.checkDiv.find('input:checked').val();
	},
	setValue : function(value){
	   this.checkDiv.find('input[id='+value+']').prop('checked',true);
	}
	});
	Newtec.CheckboxItem = function () {
		this.defaults = {};
	};
	Newtec.CheckboxItem.exte(Newtec.FormItem,"checkbox");
	Newtec.CheckboxItem.over({
		createNewtecJQ:function(f){
//			var form = this.newtecForm;
			var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
	    	var div1=getItemDIv1(f,id,this);
	    	var div2=getItemDIv2(f);
	    	div1.append(div2);
	    	var defaultValue = f['value'];
	    	var checked='';
	    	if(defaultValue!=false&&defaultValue!='false'&&!Newtec.Utils.isNull(defaultValue)){
	    		checked='checked';
	    	}
	    	var checkbox='<label style="padding:6px 0 0 0;"><input type="checkbox" '+checked+'></label>';
	    	div2.append(checkbox);
	    	this.checkDiv=div2;
	    	return div1;
		},
	getValue:function(){
		return this.checkDiv.find('input').prop('checked');
	},
	setValue : function(value){
		var checked=false;
		if(value!=false&&value!='false'&&!Newtec.Utils.isNull(value)){
    		checked=true;
    	}
	   this.checkDiv.find('input').prop('checked',checked);
	}
	});
	Newtec.CheckItem = function () {
		var p='';
		if(this.defaults!=undefined){
			p=this.defaults;
		}
		//2.
		this.defaults = {
				
        };
    	$.extend(this.defaults,p);
	};
	var getItemDIv1=function(f,id,itemThis){
		var div1 = "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-"+f.column+"' "+itemThis.getFormFieldStyle(f)+">"
    	+"<label class='control-label col-"+f.columnType+"-"+f.titleNum+" no-padding-right'  style='white-space:nowrap;padding-left: 0;'>"+f['title']+"</label>"
    	+"</div>";
		return $(div1);
	};
	var getItemDIv2=function(f){
		var div2 = "<div class='col-xs-12 col-"+f.columnType+"-"+f.valueNum+" multiselectDiv'></div>";
		return $(div2);
	};
	/*var parent = new Newtec.FormItem('text');
	Newtec.TextItem.prototype = parent;*/
	Newtec.CheckItem.exte(Newtec.FormItem,"check");
//	Newtec.TextItem.prototype.parent = parent;
	Newtec.CheckItem.prototype.createNewtecJQ=function(f){
		var form = this.newtecForm;
    	var id = form.getFormFieldId(f['name']);
    	var selectHeight = 34;
    	var str = "<div id='"+id+"' class='form-group col-xs-12  col-"+f.columnType+"-"+f.column+" ' "+this.getFormFieldStyle(f,"height:"+selectHeight+";")+">"
			+"<label class='control-label col-"+f.columnType+"-"+f.titleNum+" no-padding-right' style='white-space:nowrap;padding-left: 0;'>"+f['title']+"</label>";
			var datas = f['data'];
			var name = f['name'];
			var type = f['type'];
			str =str+ "<div class='col-"+f.columnType+"-"+f.valueNum+"'>";
			var defaultValue = f['value'];//默认值使用
			if(datas instanceof Array){//数组格式[{text:'',value:''},{text:'',value:''}]
				var len = datas.length;
				for(var i=0;i<len;i++){
					var data = datas[i];
					var checked = "";
					var key = data['value'];
					if(typeof(defaultValue)=='string' && defaultValue==key){//一个初始值用字符串
						checked=" checked='checked' ";
					}else if(defaultValue instanceof Array && defaultValue.indexOf(key)>=0){//多个初始值用数组
						checked=" checked='checked' ";
					}
					str = str /*+"<div class='checkbox'>"*/
					+"<label class='checkbox-inline '>"
					+"<input name='"+name+"' type='"+type+"' class='ace' value='"+key+"' "+checked+"/>"
					+"<span class='lbl'> "+data['text']+"</span>"
					+"</label>"
					/*+"</div>"*/;
				}
			}else{//json格式{key:value}
//				var data = datas[i];
				for(var key in datas){
					var checked = "";
					if(typeof(defaultValue)=='string' && defaultValue==key){//一个初始值用字符串
						checked=" checked='checked' ";
					}else if(defaultValue instanceof Array && defaultValue.indexOf(key)>=0){//多个初始值用数组
						checked=" checked='checked' ";
					}
					str = str /*+"<div class='checkbox'>"*/
					+"<label class='checkbox-inline '>"
					+"<input name='"+name+"' type='"+type+"' class='ace' value='"+key+"' "+checked+"/>"
					+"<span class='lbl'> "+datas[key]+"</span>"
					+"</label>";
				}
			}
			str = str+"</div>";
			var item = $(str+"</div>");
			return item;
	};
//	Newtec.CheckItem.create = function(f,newtecForm){
//		return new Newtec.CheckItem().initItem(f,newtecForm);
//	};
	/*******单选、多选结束******************/
	/*******新下拉列表开始******************/
	Newtec.MySelectItem=function(){
		var p='';
		if(this.defaults!=undefined){
			p=this.defaults;
		}
		this.defaults={
				id:''
					,useFirstValue:true
					,value:''
					,displayName:'name'
					,valueName:'id'
					,showMaxSelect:3
					,showSingleIcn:false
					,defaultValue:'请选择！！'
					,autoLoadData:true
					,everyLoadData:false
					,minWidth:150
					,showClearIcn:true//显示清楚按钮
					,isLeft:true
					,maxHeight:300
					,showFirstItem:true
					,maxWidth:250
					,autoWidth:true//true:下拉框大小随着结果框大小变化
					,data:[]//本地数据
		            ,isCenter:true
		            ,canEdit:false
		            ,mouseShow:false
		            ,search:true
		            ,style:''//按钮的样式
					,ds:{//数据源从服务器加载
						name:''
						,select:[]
						,sortBy:''
						,data:''//查询条件
						,callback:''
					}
					,copyField:''//下拉列表选中改变时，将选中的记录行值里的copyField对应的key值复制到表单中相应的name中，格式：{dsField:formField,dsField1:formField2}
					,loadDataBefore:''//下拉列表加载数据前执行的函数
					,changeAfter:''
					,setValueAfter:''//设置值后
		};
		this.firstOpen= true;//第一次加载数据
		this.mapData={};//存放着数据下拉列表的所有数据，
		this.readonly=true;
		this.disabled=false;
		$.extend(true,this.defaults,p);
	};
	Newtec.MySelectItem.exte(Newtec.FormItem,"select");
	Newtec.MySelectItem.over({
		createNewtecJQ:function(f){
			var def=this.defaults;
			this.value = def.value;
			this.field = f;//存放列信息
			this.values={};
			this.disabled =Newtec.Utils.getFieldAttrValue(f,'disabled',this.operType);
//	    	var readonly = Newtec.Utils.getFieldAttrValue(f,'readonly',this.operType);
//			var id = this.newtecForm.getFormFieldId(f['name']);
			var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
			this.id = id;
			var btnStyle= def.style;
			this.multiple=f['multiple']=='true'||f['multiple']?true:false;
//			var div1 = "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-"+f.column+"' "+this.getFormFieldStyle(f)+">"
//	    	+"<label class='control-label col-"+f.columnType+"-"+f.titleNum+" no-padding-right'  style='white-space:nowrap;padding-left: 0;'>"+f['title']+"</label>"
//	    	+"</div>";
//	    	var div2 = "<div class='col-xs-12 col-"+f.columnType+"-"+f.valueNum+" multiselectDiv'></div>";
			var div1=this.getMainDiv();
			var div2=this.getInputDiv();
	    	var paddingR='';
	    	var leftOrRight=this.defaults.isLeft?'left':'right';
	    	if (def.showClearIcn) 
	    		paddingR="padding-right:26px;";
	    	var canEdit=def.canEdit?'':'readOnly="true"';
//	    	canEdit='';
	    	var isCenter=def.isCenter?'text-align:center;':'';
//	    	var defaultValue=this.defaults.defaultValue=!this.defaults.isCenter?"<p id='defaultValue' style='width:20px;margin:0;'>"+this.defaults.defaultValue+"</p>":"<p id='defaultValue' style='margin:0;'>"+this.defaults.defaultValue+"</p>";
			var select = $('<div class="btn-group select" style="position:relative;width:100%; height:34px;">'
			+'<button type="button" class="btn btn-default dropdown-toggle" style="min-height:32px;'+paddingR+'width:100%;overflow:hidden;'+btnStyle+'" >'
			+'<div style="width:100%;display:inline-block;overflow:hidden;"  class="content pull-left">'
			+'<input type="text" align="center"  name="'+f['name']+'" '+canEdit+' value="" style="'+isCenter+'border:0;background: transparent;width: 100%;outline:none;" placeholder="'+this.defaults.defaultValue+'"/></div> </button>'
			+'</div>');
			if (def.showClearIcn) {
				select.append('<div class="glyphicon glyphicon-remove btn btn-default" style="padding: 2px 0;border:0;border-radius: 50px;height:26px;width:26px;position:absolute;'
						+'right:-1px;top:6px; z-index: 1000;background-color: transparent;-moz-opacity:0.6; -khtml-opacity: 0.6;opacity: 0.6;"><div>');
			}
			this.select = select;
			var selectOpenDiv=$('<div id="'+id+'_openDiv" class="menu-div" style="padding: 3px 0 ;overflow: hidden;min-width: 100px;position:absolute;z-index: 1300;display:none;top:100%;'+leftOrRight+':0;'
			+'margin: 2px 0 0;background-color: #fff;border-radius: 4px;-webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);box-shadow: 0 6px 12px rgba(0,0,0,.175);">'
			+'</div>');
//			select.append(this.selectOpenDiv);
			$('body').append(selectOpenDiv);
			if(def.search){
				selectOpenDiv.append('<div class="input-group" style="z-index:1300;">'
						+'  <div class="input-group-addon btn-default" style="padding:8px 12px 4px;cursor:pointer;"><label class="glyphicon glyphicon-search" style="cursor:pointer;"></label></div>'
						+' <input class="form-control" id="searchWord" type="text" placeholder="请输入.."></div>');
			}
			selectOpenDiv.append('<div  style="position:absolute;top:0;z-index:1100;right:0;height:'+(this.defaults.maxHeight+40)+'px;width:5px;background:white;"></div>');
			this.selectOpenDiv=selectOpenDiv;
			 div1 = $(div1);
			 div2 = $(div2);
			 div1.append(div2);
			 div2.append(select);
			 if(Newtec.Utils.isTrue(f['autoLoadData']))
				 this.loadData();
//			 this.registeFunction();
	    	return div1;
		},
		
		getValue:function(){
			var value=[];
			for(key in this.values){
				value.push(key);
			}
			if(this.multiple==true){
				return value;
			}else if(value.length>0){
				return value[0];
			}
//			return this.values;
		},
		setValue : function(name,value,isOpen){
			if (!Newtec.Utils.isNull(name)&&Newtec.Utils.isNull(value)) {
				if (name instanceof Array) {
					for ( var int = 0; int < name.length; int++) {
						this.selecByName(name[int],isOpen);
					}
				}else{
					this.selecByName(name,isOpen);
				}
			
				return;
			}
			var content='';
			var title='';
			if(Newtec.Utils.isArray[value]){
				
			}else if(!Newtec.Utils.isNull(value)){
				for(var key in value){
					title+=Newtec.Utils.isNull(content)?value[key]:","+value[key];
					content+=Newtec.Utils.isNull(content)?value[key]:","+value[key];
//					content+='<div style="float:left;padding:1px;margin:1px;border:1px solid #cccccc;border-radius: 3px;">'+value[key]+'</div>'
				}
			}
			var contentJQ=this.select.find(".content");
//			contentJQ.find('input').on('keyup',function(){
//				console.info("dfd");
//			});
			contentJQ.find('input').val(content);
			contentJQ.find('input').trigger('keyup');
			contentJQ.find('input').trigger('input');
			
//			content=Newtec.Utils.isNull(content)?this.defaults.defaultValue:content;
//			contentJQ.empty();
//			alert(this.defaults.isCenter);
//			if (!this.defaults.isCenter) {
//				content="<p style='width:20px;margin:0;'>"+content+"</p>";
//			}
//			contentJQ.html(content);
			contentJQ.attr('title',title);
			var setValueAfterFun = this.defaults.setValueAfter;
			if(Newtec.Utils.isFunction(setValueAfterFun)){
				 setValueAfterFun(value,this);
	         }
		}
		});

	Newtec.MySelectItem.prototype.loadData=function(append){
		var f = this.defaults;
		var datas = f['data'];
		var value = f['value'];//默认值使用
		this.loaded=true;
		var loadDataBeforeFun = this.defaults['loadDataBefore'];
		if(Newtec.Utils.isFunction(loadDataBeforeFun)){
			if(loadDataBeforeFun(f,this)==false)return ;
		}
//		console.info("------="+Newtec.Utils.isNull(datas))
		if(!Newtec.Utils.isNull(datas)){
			this.setData(datas,this.value,append);
		}else{
			var ds = f['ds'];
			if(Newtec.Utils.isNull(ds))return ;
			var dsName = ds['name'];
			if(Newtec.Utils.isNull(dsName)){
				alert('下拉列表【'+f['name']+'】数据源名称不能为空！');
				return ;
			}
			console.info(ds);
			var newtecDS = Newtec.DS.create(dsName);
			console.info(newtecDS);
			
			var select = ds['select'];
			if(!Newtec.Utils.isArray(select))select = [];
			var displayName = f['displayName'];
			if(Newtec.Utils.isNull(displayName)){
				alert('下拉列表【'+f['name']+'】属性displayName必须配置！');
				return ;
			}
			var valueName = f['valueName'];
			if(Newtec.Utils.isNull(valueName)){
				alert('下拉列表【'+f['name']+'】valueName！');
				return ;
			}
			select.addUnique(valueName);
			select.addUnique(displayName);
			var selectThis = this;
			datas = {};
			var dsD=Newtec.Utils.isNull(ds['data'])?{}:ds['data'];
			var param={
					select:select
					,sortBy:ds['sortBy']
					,startRow:ds['startRow']
					,data:dsD};
			if(ds.operId!=undefined)
				param.operId=ds.operId;
			if(ds.operType!=undefined)
				param.operType=ds.operType;
			param.callback=function(response){
				if(response.status != 0 ){
					alert(response.failureMessage);
					return ;
				}
				var result = response['data'];
				var len = result.length;
				var mapData = {};
				for(var i=0;i<len;i++){
					var v = result[i];
					var vValue = v[valueName];
					var vDsiplay = v[displayName];
					datas[vValue] = vDsiplay;
					mapData[vValue] = v;
				}
				selectThis.defaults.data=datas;
				selectThis.dataLen=len;
				selectThis.mapData = mapData;
				selectThis.setData(datas,value,true);
				if(ds['callback'] !=undefined)
					ds['callback'](response);
			};
			newtecDS.fetchData(param);
		}
		
	};
	Newtec.MySelectItem.prototype.finsh=function(){
		_registeFunction(this);
	};
	Newtec.MySelectItem.prototype.searchWord=function(searchWord){
		var datas=this.defaults.data;
		
		if(Newtec.Utils.isNull(searchWord)){
			if(this.selectOpenDiv.find('ul.dropdown-menu li').length!=this.dataLen){
				this.clearAll();
				this.setData(datas,'',false,true);
			}	
		}else{
			var tagDatas= new Array();
			for (var key in datas) {
				var index=datas[key].indexOf(searchWord);
				if(index>=0)
					tagDatas.push({id:key,name:datas[key],sort:index});
			}
			tagDatas.sort(this.sortFun);//排序
			this.clearAll();
			this.setData(tagDatas, '', false,true);
		}
	};
	Newtec.MySelectItem.prototype.setData = function(datas,defaultValue,append,isOpen){
//		alert(this.defaults.name+'>开始=='+defaultValue);
		if (datas==undefined)return;
		var wHtml=!this.defaults.autoWidth?'max-width:'+this.defaults.maxWidth+'px;':'width'+(this.select.outerWidth()+17)+'px;';
		var select ='<ul class="dropdown-menu" role="menu" style="'+wHtml+'max-height:'+this.defaults.maxHeight+'px;'
		+'px;overflow: hidden;overflow-y:auto;position: relative !important;display: block;border: 0;margin: 0;box-shadow: none;-webkit-box-shadow:none">';
		var droMeDivJQ=this.selectOpenDiv;
		if(Newtec.Utils.isTrue(append))//不是追加的情况清除掉原来的
			select +=Newtec.Utils.isNull(droMeDivJQ.find('ul').html())?"":droMeDivJQ.find('ul').html();
		if (droMeDivJQ.find('ul.dropdown-menu')) {//移除原有的ul
			droMeDivJQ.find('ul.dropdown-menu').remove();
		}
		var useFirstValue=this.defaults.useFirstValue;
			if(datas instanceof Array){//数组格式[{text:'',value:''},{text:'',value:''}]
				var displayName = this.defaults.displayName;
				var valueName = this.defaults.valueName;
				for(var i=0;i<datas.length; i++){
					var data = datas[i];
					var key = data[valueName];
					select = select +'<li style="margin:1px 0;">'+this.getItemA(key, data[displayName], i)+'</label></a></li>';
					if(!defaultValue!==false&&(Newtec.Utils.isNull(defaultValue)&&useFirstValue))defaultValue=key;//默认值如果没有设置就使用第一个值
				}
			}else{//json格式{key:value}
				for(var key in datas){
					select = select +'<li style="margin:1px 0;" >'+this.getItemA(key, datas[key])+'</label></a></li>';
					if(defaultValue!==false&&(Newtec.Utils.isNull(defaultValue)&&useFirstValue)){
						defaultValue=key;//默认值如果没有设置就使用第一个值
					}
				}
			}
		select+='</ul>';
		
		if(!Newtec.Utils.isNull(select)){
			droMeDivJQ.append(select);
		}
//		if(defaultValue!==false)
		this.setValue(defaultValue,'',isOpen);
	};
	/**
	 * 排序函数
	 */
	Newtec.MySelectItem.prototype.sortFun=function(a,b){
		return a['sort']-b['sort'];
	};
	/**
	 * 清除所有选中的对象
	 */
	Newtec.MySelectItem.prototype.clearAll=function(){
		this.selectOpenDiv.find('ul li').removeClass("active");
		for ( var key in this.values) {
			var JQ=!this.defaults.showSingleIcn&&!this.multiple?this.selectOpenDiv.find('ul a[name='+key+']'):this.selectOpenDiv.find("ul a label input[name="+key+"]");
			this.onChange(JQ[0],false,this.values[key],key);
		}
		this.values={};
		this.selectOpenDiv.find(" input:checked").prop('checked',false);
		var inputs=this.selectOpenDiv.find(" input:checked");
		inputs.prop('checked',false);
		this.setValue("","");
	};
	var _registeFunction=function(selectThis){
		selectThis.select.on('click','.dropdown-toggle',function(){
			var isOpen=selectThis.isOpen;
			if(!isOpen){
				selectThis.open();
			}else {
			  selectThis.close();
		    }
			return false;
		});
		if(selectThis.defaults.mouseShow){
			selectThis.isIn1=false;
			selectThis.isIn2=false;
			selectThis.select.on('mousemove',function(){
				selectThis.open();
				selectThis.isIn1=true;
				selectThis.isIn2=false;
			});
			selectThis.selectOpenDiv.on('mousemove',function(){
				selectThis.open();
				selectThis.isIn2=true;
				selectThis.isIn1=false;
			});
			selectThis.selectOpenDiv.on('mouseout',function(){
				if(!selectThis.isIn1)
					selectThis.close();
			});
			selectThis.select.on('mouseout',function(){
				if(!selectThis.isIn2)
					selectThis.close();
				
			});
		}
		$('html').on('resize',function(){
			if (selectThis.defaults.autoWidth) {
				var w=selectThis.select.outerWidth();
				selectThis.selectOpenDiv.css("width",w+"px");
				selectThis.selectOpenDiv.find('ul.dropdown-menu').css("width",(w+17)+'px');
			}
			var height=selectThis.select.outerHeight();
			var width=(selectThis.select.outerWidth(true)-selectThis.select.outerWidth())/2;
			var left=selectThis.select.offset().left+width;
			var top=selectThis.select.offset().top+height;
			var selectOpenDiv=selectThis.selectOpenDiv;
			if (left!=selectOpenDiv.offset().left||top!=selectOpenDiv.offset().top) {
				selectOpenDiv.css({left:left,top:top});
			}
//			if(selectThis.isOpen)
//				selectThis.close();
		});
		$(document).bind("click",function(e){ 
			var target = $(e.target); 
			if(!target.closest('#'+selectThis.id+"_openDiv").length&&!target.closest('#'+selectThis.id+" .select").length){ 
				if(selectThis.isOpen)
					selectThis.close();
			} 
		}) ;
		$(document).on('click','#'+selectThis.id+' .glyphicon-remove',function(){
			selectThis.clearAll();
		});
		
		//获取ul对象，判断是否已经渲染完成
		function getJQ(JQ){
			if (JQ[0]==undefined) {
				JQ=selectThis.selectOpenDiv.find('ul');
//				alert("-=="+JQ[0]);
				setTimeout(function(){
					getJQ(JQ);
				}, 200);
			}else if(JQ[0]!=undefined){
//				alert("-=="+selectThis.select.find('ul')[0]);
				selectThis.romancefinish();
			}
		}
		getJQ(selectThis.selectOpenDiv.find('ul'));
	};
	Newtec.MySelectItem.prototype.close=function(){
		console.info('--close-----');
		this.isOpen=false;
		this.selectOpenDiv.css('display','none');
	};
	Newtec.MySelectItem.prototype.open=function(){
		if (this.disabled)return;
		this.isOpen=true;
		var selectOpenDiv=this.selectOpenDiv;
		if (this.defaults.everyLoadData||!this.loaded) {
			if(this.defaults.everyLoadData)
				this.defaults['data']=[];
			this.loadData();
		}
		var height=this.select.outerHeight();
		var width=(this.select.outerWidth(true)-this.select.outerWidth())/2;
		var left=this.select.offset().left+width;
//		var right=this.select.offset().right;
		var top=this.select.offset().top;
//		console.info("height:"+height+"=left="+left+"=top="+top);
		selectOpenDiv.css({left:left,top:top+height});
		selectOpenDiv.css('display','block');
		if (this.defaults.autoWidth) {
			var w=this.select.outerWidth();
			selectOpenDiv.css("width",w+"px");
			selectOpenDiv.find('ul.dropdown-menu').css("width",(w+17)+'px');
		}else if(this.firstOpen){
			this.firstOpen=false;
			selectOpenDiv.css("width",(selectOpenDiv.find('ul').outerWidth()-17)+"px");
		}
		this.openAfter();
	};
	/**
	 * 渲染完成调用
	 */
	
	Newtec.MySelectItem.prototype.romancefinish=function(){
		var selectThis=this;
		if (this.multiple) {
			this.selectOpenDiv.on('click',"ul a label input[type=checkbox]",function(e){
				var JQ=$(this);
				if (JQ.prop('checked')) {
					selectThis.selecByJQ(JQ,true);
				}else{
					selectThis.removeSelecByJQ(JQ, true);
				}
			});
		}else{
			if (this.defaults.showSingleIcn) {
				this.selectOpenDiv.on('click','ul a label input[type=radio]',function(e){
					var JQ=$(this);
					selectThis.selecByJQ(JQ);
				});
			}else{
				this.selectOpenDiv.on('click','ul a',function(){
					selectThis.selecByJQ($(this));
				});
			}
		}
		this.selectOpenDiv.on('input','#searchWord',function(){
			var searchWord=$(this).val();
//			console.info(searchWord);
			selectThis.searchWord(searchWord);
		});
	};
	Newtec.MySelectItem.prototype.openAfter=function(){};
	
	Newtec.MySelectItem.prototype.selecByName=function(name,open){
		if(Newtec.Utils.isNull(name))return;
		var JQ=!this.defaults.showSingleIcn&&!this.multiple?this.selectOpenDiv.find('ul a[name='+name+']'):this.selectOpenDiv.find("ul a label input[name="+name+"]");
		if (this.firstOpen) {//处理由于延迟产生的bug
			var selectThis=this;
			function getJQ(count){
				if (count<4&&JQ[0]==undefined) {
					JQ=!selectThis.defaults.showSingleIcn&&!selectThis.multiple?selectThis.selectOpenDiv.find('ul a[name='+name+']'):selectThis.selectOpenDiv.find(" ul a label input[name="+name+"]");
					setTimeout(function(){
						getJQ(count++);
					}, 200);
				}else if(JQ[0]!=undefined){
					selectThis.selecByJQ(JQ,open);
				}
			}
			getJQ(1);
		}
		this.scrollToChlidByJQ(JQ);
		this.selecByJQ(JQ,open);
	};
	Newtec.MySelectItem.prototype.copyFieldValue = function(selectValue){
		 if(!Newtec.Utils.isNull(this.newtecForm) && this.newtecForm.operType != 'fetch'){//查询表单不复值
			 var copyField = this.field['copyField'];
              if(!Newtec.Utils.isNull(copyField)){
           	   var value =Newtec.Utils.isNull(selectValue)?"": this.mapData[selectValue];
	               if(value != undefined ){
	            	   var copyValue = {};
	            	   for(var key in copyField){
	            		   copyValue[copyField[key]] = value[key];
	            	   }
	            	  this.newtecForm.setValues(copyValue);//给别的列赋值
	               }
              }
		 }
	};
	/**
	 * 功能：根据JQ对象选中下拉选项
	 * @param JQ
	 * @param openz
	 */
	Newtec.MySelectItem.prototype.selecByJQ=function(JQ,open){
		if(JQ[0]==undefined)return;
		if (!this.multiple){ 
			this.selectOpenDiv.find('ul li').removeClass("active");
			if (this.defaults.showSingleIcn) {
				this.selectOpenDiv.find("input[type=radio]:checked").prop('checked',false);
			}
			this.values={};
		}
		open=Newtec.Utils.isNull(JQ)?false:open;
		if (!open) 
			this.close();
		var addClassJQ=this.defaults.showSingleIcn||this.multiple?JQ.parent().parent().parent():JQ.parent();
		addClassJQ.addClass("active");
		var name=JQ.attr('name');
		JQ.prop("checked",true);
		var value=Newtec.Utils.isNull(JQ.attr('value'))?JQ.html():JQ.attr('value');
		this.values[name]=value;
		this.setValue('',this.values);
		this.onChange(JQ[0],true,value,name);
		
	};
	/**
	 * 功能：更加name移除选中状态
	 * @param name:移除选中状态的name选项
	 * @param open:是否显示下拉选项
	 */
	Newtec.MySelectItem.prototype.removeSelecByName=function(name,open){
		if(Newtec.Utils.isNull(name))return;
		var JQ=!this.defaults.showSingleIcn&&!this.multiple?this.selectOpenDiv.find('ul a[name='+name+']'):this.selectOpenDiv.find("input[name="+name+"]");
		this.removeSelecByJQ(JQ,open);
	};
	/**
	 * 功能：更加JQ对象移除选中状态
	 * @param JQ:移除选中状态的jq对象
	 * @param open:是否显示下拉选项
	 */
	Newtec.MySelectItem.prototype.removeSelecByJQ=function(JQ,open){
		if(Newtec.Utils.isNull(JQ[0]))return;
		open=Newtec.Utils.isNull(JQ)?false:open;
		if (!open) 
			this.close();
		JQ.parent().parent().parent().removeClass("active");
		var name=JQ.attr('name');
		var value =this.values[name];
		delete this.values[name];
		this.setValue('',this.values);
		this.onChange(JQ[0],false,value,name);
	};
	/**
	 * 功能：下拉列表选择改变时触发事件
	 * @param element：当前元素
	 * @param checked：选中状态
	 * @param value：当前值
	 * @param name：当前name
	 */
	Newtec.MySelectItem.prototype.onChange=function(element,checked,value,name){
		var changeAfterFun =this.field['changeAfter'];
		if(Newtec.Utils.isFunction(changeAfterFun)){
			changeAfterFun(element, checked, value,name);
		}
		this.copyFieldValue((checked?name:""));
	};
	/**
	 * 功能：根据name是下拉选项滚动中间位置
	 * @param name
	 */
    Newtec.MySelectItem.prototype.scrollToChlidByName=function(name){
    	var chlidJQ;
    	if(this.multiple||this.defaults.showSingleIcn){
    		chlidJQ=this.selectOpenDiv.find("input[name="+name+"]").parent();
    	}else{
    		chlidJQ=this.selectOpenDiv.find("a[name="+name+"]");
    	}
    	this.scrollToChlidByJQ(chlidJQ);
	};
	Newtec.MySelectItem.prototype.scrollToChlidByJQ=function(JQ){
		if (JQ[0]==undefined) return;
		var container=this.selectOpenDiv.find('ul');
		var top=JQ.offset().top - container.offset().top + container.scrollTop()-this.defaults.minHeight/2;
		if(top>0)
		   container.scrollTop(top);
	};
	Newtec.MySelectItem.prototype.getItemA=function(key,value,checked,sort){
		if(!this.defaults.showSingleIcn&&!this.multiple){
			return '<a title="'+value+'" name="'+key+'">'+value+'</a>' ;
		}
		var labelClass=this.multiple?"checkbox-inline":"radio-inline";
		var inputType=this.multiple?"checkbox":"radio";
		return '<a style="padding:0 30px 0 0;"><label class="'+labelClass+'" style="overflow:hidden;width: 100%;margin:0 10px;padding:5px 0 5px 25px;" title="'+value+'">'
			+'<input type="'+inputType+'" name="'+key+'" value="'+value+'">'+value+'</label></a>';
		
		
	};
	/*******新下拉列表结束******************/
	 /*******下拉列表开始******************/
	  //1.
		Newtec.SelectItem = function (params,newtecForm) {
			var p='';
			if(this.defaults!=undefined){
				p=this.defaults;
			}
			//2.
			this.defaults = {
					id:''
					,value:''
					,displayName:'name'
					,valueName:'id'
					,autoLoadData:true
					,everyLoadData:false
					,data:''//本地数据
					,ds:{//数据源从服务器加载
						name:''
						,select:[]
						,sortBy:''
						,data:''//查询条件
						,callback:''
					}
					,copyField:''//下拉列表选中改变时，将选中的记录行值里的copyField对应的key值复制到表单中相应的name中，格式：{dsField:formField,dsField1:formField2}
					,loadDataBefore:''//下拉列表加载数据前执行的函数
					,changeAfter:''
					,setValueAfter:''//设置值后
	        };
			/*if(!Newtec.Utils.isJson(params)){//不是json格式不能创建按钮
			return ;
			}*/
			this.field;//存放列的配置信息
//			this.defaults = $.extend({},this.defaults,params);
			 $.extend(true,this.defaults,p);
			this.value = this.defaults.value;
	    	this.mapData={};//存放着数据下拉列表的所有数据，
	    	this.firstLoadData = true;//第一次加载数据
			/*this.newtecForm=Newtec.Utils.isNull(newtecForm)?this.defaults['newtecForm']:newtecForm;//表单设置
			if(this.newtecForm==undefined){
				alert('下拉列表没有设置属性newtecForm！');
			}*/
		};
		//3.
//		Newtec.SelectItem.prototype = new Newtec.FormItem('select');
		Newtec.SelectItem.exte(Newtec.FormItem,"select1");
		//4.
		Newtec.SelectItem.prototype.createNewtecJQ=function(f){
			this.value = this.defaults.value;
			this.field = f;
			var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
//			alert("id=="+id);
			var div1 = "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-"+f.column+"' "+this.getFormFieldStyle(f)+">"
	    	+"<label class='control-label col-"+f.columnType+"-"+f.titleNum+" no-padding-right'  style='white-space:nowrap;padding-left: 0;'>"+f['title']+"</label>"
	    	+"</div>";
	    	var div2 = "<div class='col-xs-12 col-"+f.columnType+"-"+f.valueNum+" multiselectDiv'></div>";
			var select = $("<select  name='"+f['name']+"' class='multiselect '"+Newtec.Utils.getFieldAttr('multiple',f['multiple'])+" ></select>");
			this.select = select;
			var s = this;
			 div1 = $(div1);
			 div2 = $(div2);
			 div1.append(div2);
			 div2.append(select);
			 select.multiselect({
				 maxHeight:400,
				 buttonWidth:'100%',
				 nonSelectedText: (Newtec.Utils.isNull(f['emptyText'])?('请选择'+f['title']):f['emptyText']),
				 enableFiltering: true,
				 enableHTML: true,
				 buttonClass: 'btn btn-white btn-primary',
				 templates: {
					button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown" style="text-align: left; border-color:#ccc;"><span class="multiselect-selected-text" style="color:#858585 ; margin-left:-5px;"></span> &nbsp;<b class="fa fa-caret-down" style="position:absolute;right:15px;top:10px;"></b></button>',
					ul: '<ul class="multiselect-container dropdown-menu"></ul>',
					filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="fa fa-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
					filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default btn-white btn-grey multiselect-clear-filter" type="button"><i class="fa fa-times-circle red2"></i></button></span>',
					li: '<li><a tabindex="0"><label></label></a></li>',
			        divider: '<li class="multiselect-item divider"></li>',
			        liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
				 },
				 onChange: function(option, checked, select) {
//		                alert('Changed option ' + $(option).val() + '.'+checked+">>>"+select);
//					 alert('=='+s.newtecForm.operType);
					/* if(s.newtecForm.operType != 'fetch'){//查询表单不复值
						 var copyField = f['copyField'];
			               if(!Newtec.Utils.isNull(copyField)){
			            	   var value = s.mapData[$(option).val()];
				               if(value != undefined ){
				            	   var copyValue = {};
				            	   for(var key in copyField){
				            		   copyValue[copyField[key]] = value[key];
				            	   }
				            	   s.newtecForm.setValues(copyValue);//给别的列赋值
				               }
			               }
					 }*/
					 s.copyFieldValue($(option).val());
		               var changeAfterFun = f['changeAfter'];
		               if(Newtec.Utils.isFunction(changeAfterFun)){
		            	   changeAfterFun(option, checked, s);
		               }
//		                alert("12=="+Newtec.Utils.json2str(s.mapData[$(option).val()]));
		            },
		            onDropdownShow: function(event) {
//		                alert('Dropdown shown.+'+event+"==="+f['everyLoadData']+"-----"+s.loadDataFinsh);
		            	 if(Newtec.Utils.isTrue(f['everyLoadData']) || Newtec.Utils.isTrue(s.firstLoadData))
		            		 s.loadData();
		            }
				});
			 if(Newtec.Utils.isTrue(f['autoLoadData']))
				 this.loadData();
			 return div1;
		};
		Newtec.SelectItem.prototype.copyFieldValue = function(selectValue){
			 if(this.newtecForm.operType != 'fetch'){//查询表单不复值
				 var copyField = this.field['copyField'];
	               if(!Newtec.Utils.isNull(copyField)){
	            	   var value = this.mapData[selectValue];
		               if(value != undefined ){
		            	   var copyValue = {};
		            	   for(var key in copyField){
		            		   copyValue[copyField[key]] = value[key];
		            	   }
		            	  this.newtecForm.setValues(copyValue);//给别的列赋值
		               }
	               }
			 }
		};
		Newtec.SelectItem.prototype.setValue = function(value){
				console.info('valuexx=='+value);
//			if(Newtec.Utils.isNull(value)){
//				this.select.multiselect('deselectAll', false);
//    			this.select.multiselect('updateButtonText');
//    			this.select.multiselect('select', value);
//			}
			this.value = value;
			this.selectValue(value);
			console.info('valuex1x=='+value);
//			this.copyFieldValue(value);//需要触发？设置值，自动回触发changge
			setValueAfterFun = this.defaults.setValueAfter;
			 if(Newtec.Utils.isFunction(setValueAfterFun)){
				 console.info(value+"dddd");
				 setValueAfterFun(value,this);
	         }
		};
		Newtec.SelectItem.prototype.selectValue = function(value){
			console.info('selectValue=='+value);
			this.select.multiselect('select', value, true);
		};
		Newtec.SelectItem.prototype.getValue = function(){
			var selected = [];
	        this.select.find('option:selected').each(function() {
	            selected.push($(this).val());
	        });
	        var multiple = this.defaults['multiple'];
	        if(multiple=='true' || multiple==true){
	        	return selected;
	        }
	        else{
	        	return selected.length>=1?selected[0]:'';
	        }
		};
		
		Newtec.SelectItem.prototype.loadData = function(append){
			var f = this.defaults;
			var datas = f['data'];
//			var value = f['value'];//默认值使用
			var loadDataBeforeFun = this.defaults['loadDataBefore'];
			if(Newtec.Utils.isFunction(loadDataBeforeFun)){
				if(loadDataBeforeFun(f,this)==false)return ;
			}
			if(!Newtec.Utils.isNull(datas)){
				this.setData(datas,this.value,append);
			}else{
				var ds = f['ds'];
				if(Newtec.Utils.isNull(ds))return ;
				var dsName = ds['name'];
				if(Newtec.Utils.isNull(dsName)){
					alert('下拉列表【'+f['name']+'】数据源名称不能为空！');
					return ;
				}
				var newtecDS = Newtec.DS.create(dsName);
				var select = ds['select'];
				if(!Newtec.Utils.isArray(select))select = [];
				var displayName = f['displayName'];
				if(Newtec.Utils.isNull(displayName)){
					alert('下拉列表【'+f['name']+'】属性displayName必须配置！');
					return ;
				}
				var valueName = f['valueName'];
				if(Newtec.Utils.isNull(valueName)){
					alert('下拉列表【'+f['name']+'】valueName！');
					return ;
				}
				select.addUnique(valueName);
				select.addUnique(displayName);
				var t = this;
				datas = {};
				newtecDS.fetchData({
					select:select
				,sortBy:ds['sortBy']
				,startRow:ds['startRow']
				,data:ds['data']
				,callback:function(response){
					if(response.status != 0 ){
						alert(response.failureMessage);
						return ;
					}
					var result = response['data'];
					var len = result.length;
					var mapData = {};
					for(var i=0;i<len;i++){
						var v = result[i];
						var vValue = v[valueName];
						var vDsiplay = v[displayName];
						datas[vValue] = vDsiplay;
						mapData[vValue] = v;
					}
					t.mapData = mapData;
//					alert(Newtec.Utils.json2str(datas)+"=="+t.value+"="+valueName+"---"+displayName);
					t.setData(datas,t.value,append);
					if(ds['callback'] !=undefined)
						ds['callback'](response);
				}});
			}
			this.firstLoadData = false;
		};
		Newtec.SelectItem.prototype.clearOption = function(){
			  this.select.html('');//不是追加的情况清除掉原来的
			  this.select.multiselect('rebuild');
		};
		Newtec.SelectItem.prototype.setData = function(datas,defaultValue,append){
//			alert(this.defaults.name+'>开始=='+defaultValue);
			if(!Newtec.Utils.isTrue(append)){
				this.select.html('');//不是追加的情况清除掉原来的
			}
			if(Newtec.Utils.isNull(datas)) return ;
			var select = "";
			if(datas instanceof Array){//数组格式[{text:'',value:''},{text:'',value:''}]
				var displayName = this.defaults.displayName;
				var valueName = this.defaults.valueName;
				for(var i in datas){
					var data = datas[i];
					var selected = "";
					var key = data[valueName];
					/*if(typeof(defaultValue)=='string' && defaultValue==key){//一个初始值用字符串
						selected=" selected='selected' ";
					}else if(defaultValue != undefined && defaultValue.length>0 && defaultValue.indexOf(key)>=0){//多个初始值用数组
						selected=" selected='selected' ";
					}*/
					select = select +"<option value='"+key+"' "+selected+">"+data[displayName]+"</option>";
					if(Newtec.Utils.isNull(defaultValue))defaultValue=key;//默认值如果没有设置就使用第一个值
				}
			}else{//json格式{key:value}
				for(var key in datas){
					var selected = "";
					/*if(typeof(defaultValue)=='string' && defaultValue==key){//一个初始值用字符串
						selected=" selected='selected' ";
					}else if(defaultValue != undefined && defaultValue.length>0 && defaultValue.indexOf(key)>=0){//多个初始值用数组
						selected=" selected='selected' ";
					}*/
					select = select +"<option value='"+key+"' "+selected+">"+datas[key]+"</option>";
//					firstValue= firstValue==''?key : firstValue;
					if(Newtec.Utils.isNull(defaultValue)){
						defaultValue=key;//默认值如果没有设置就使用第一个值
//						alert(datas[key]+'》》》defaultValue='+defaultValue);
					}
				}
			}
			if(!Newtec.Utils.isNull(select)){
				this.select.append(select);
			}
			this.select.multiselect('rebuild');
			if(!Newtec.Utils.isNull(select) && defaultValue != undefined){
//				this.selectValue(defaultValue);
//				alert(this.defaults.name+'>结束=='+defaultValue);
//				this.newtecForm.setValue(this.defaults.name,defaultValue);
				this.setValue(defaultValue);
			}
//			this.setValue(firstValue);
		};
//		Newtec.SelectItem.create = function(field,newtecForm){
//			return new Newtec.SelectItem(/*field,newtecForm*/).initItem(field,newtecForm);
//		};
	    /*******下拉列表结束******************/
	
})();