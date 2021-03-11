;(function(){
	if(Newtec.FormItem){
		console.warn("已被引入");
		return;
	}
	//1.
	var serverUrl=Newtec.ServerUrl||"";
	Newtec.FormItem = function (params) {
		//2.
		this.defaults = {};
		this.newtecForm;
	};
	//3.
	Newtec.FormItem.prototype = new Newtec.Base('formItem');
	//4.
	Newtec.FormItem.prototype.initParams=function(initParams){
		this.defaults = {
				//缺省	
				showTitle:true,
				itemDivClass:'',
				valueDivClass:'',
				event:{
					inputFun:'',//Newtec:组件本身，elemet
					clickOutFun:'',//Newtec:组件本身，elemet
					clickFun:'',//Newtec:组件本身，elemet
					blurFun:'',//Newtec:组件本身，elemet
				},
				domStyle:{
					color:null,
					marginL:null,
					fontSize:null,
					titleStyle:{},
					valueParentStyle:{},
					valueStyle:{},
				},
				rate:25,//自适应title比率，中文：1,英文：3
				autoTitle:true,
				autoTitleW:'',//title自适应省略号
				titleWRate:'',//该值只能是0-100以内数字，超出范围无效，title的宽度比值，value为：(100-titleWRate)%,title和value的宽度比值为默认25:75
				titleClass:'',
				titleAlign:'',//默认值(right)：right:向右对齐，left;center
				titleWidth:null,
	        };
	}
	Newtec.FormItem.prototype.createNewtecJQ=function(f){
		console.info("===<<",f)
		this.createBefore(f);
		var item=this.getItemDiv();
		this.item=item;
		var valueDiv=this.getValueDiv();
		this.valueDiv=valueDiv;
		item.append(valueDiv);
		var valueJQ=this.createValueJQ(f);
		if(Newtec.Utils.isNull(valueJQ)){
//			alert('createValueJQ必须返回对应Div或者Jquery对象');
			console.error('createValueJQ必须返回对应Jquery对象或者html');
			return;
		}
		valueJQ=Newtec.Utils.isString(valueJQ)?$(valueJQ):valueJQ;
		valueDiv.append(valueJQ);
		this.valueJQ=valueJQ;
		return item;
	};
	Newtec.FormItem.prototype.createBefore=function(){};
	Newtec.FormItem.prototype.getFormFieldValueId = function(){
		if(Newtec.Utils.isNull(this.newtecForm))return this.id+"_"+this.defaults['name']+"_v";
    	return this.newtecForm.id+"_"+this.defaults['name']+"_v";
    };
    Newtec.FormItem.prototype.getItemDiv=function(){
    	var f=this.defaults;
    	var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
    	var div1 =$( "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-"+f.column+((f.itemDivClass&&" "+f.itemDivClass)||"")+"' "+this.getFormFieldStyle(f)+">"
    	+"</div>");
    	if(f.showTitle||f.showTitle==undefined){
    		var titleStyle=f.domStyle||{},titleStyle=titleStyle.titleStyle;
    		var titleStyle=this.styleJson2Str(titleStyle);
    		var rate=f.titleWRate;
    		var titleWidth=f.titleWidth;
    		var width="";
    		if(rate){
    			 width=rate>=0&&rate<=100?"width:"+rate+"%;":"";
    		}
    		
    		var claName="",title='';
    		if(f.autoTitle===true||f.autoTitle===undefined){
    			claName="nowrap";
    			title='title="'+f['title']+'"';
    		}
    		var t=$("<label class='"+claName+" control-label col-"+(f.columnType||"")+"-"+(f.titleNum||"")+" group-title "+(f['titleAlign']||"")+"'  style='"+width+titleStyle+"' "+title+">"+(f['redstar']==true&&"<span style='color:red'>*</span>"||"")+f['title']+"</label>");
    		this.titleJQ=t;
    	    div1.append(t);
    	}
    	return div1;
    };
    Newtec.FormItem.prototype.getValueDiv=function(){
    	var f=this.defaults;
    	var rate=f.titleWRate;
    	var width=rate>0&&rate<=100?"width:"+(100-rate)+"%;":"";
    	var valueParentStyle=f.domStyle||{},valueParentStyle=valueParentStyle.valueParentStyle;
		var valueParentStyle=this.styleJson2Str(valueParentStyle);
    	return $("<div class='col-xs-12 col-"+(f.columnType||"")+"-"+(f.valueNum||"")+" multiselectDiv "+(f.valueDivClass||"")+"' style='"+valueParentStyle+";"+width+"'></div>");
    };
    Newtec.FormItem.prototype.finsh=function(f){
    	var event=f.event||{};
		var blurFun=event.blurFun||f.blurFun;
	    if(Newtec.Utils.isFunction(blurFun))
	    	this.blur(blurFun);
	    var inputFun=event.inputFun||f.inputFun;
	    if(Newtec.Utils.isFunction(inputFun))
	    	this.input(inputFun);
	    var clickOutFun=event.clickOutFun||f.clickOutFun;
	    if(Newtec.Utils.isFunction(clickOutFun))
	    	this.clickOut(clickOutFun);
	    var clickFun=event.clickFun||f.clickFun;
	    if(Newtec.Utils.isFunction(clickFun))
	    	this.click(clickFun);
	    var This=this;
	    var newtecJQ=this.newtecJQ;
	    var autoFun=0;
	    autoFun=function(){
	    	This.autoFun(f);
	    	newtecJQ.unbind('resize',autoFun);
	    };
	    if(f.autoTitleW!==false)
	    	newtecJQ.resize(autoFun);
    };
    Newtec.FormItem.prototype.autoFun=function(f){
    	var autoTitle=f['autoTitle']==undefined||f['autoTitle']==true?true:false;
//    	if(this.titleJQ&&autoTitle)
//    		autoTextFun(this.titleJQ,'',f);
    };
    var autoTextFun=function(titleJQ,width,f){
    	var fontSize=titleJQ.css('font-size');
    	fontSize=fontSize.substring(0,fontSize.length-2);
    	width=Newtec.Utils.isNull(width)?titleJQ.width():width;
    	var text=titleJQ.text();
    	width=width*Newtec.Utils.toInt(f.rate,1);
    	var len=text.length;
		var w=len*fontSize;
		if(w>width){
			var num=width/fontSize-1;
			var a=num/2<2?2:parseInt(num/2);
			var newtext=text.substring(0,a)+".."+text.substring((len+a-num+1));
			titleJQ.attr('title',text);
			titleJQ.text(newtext);
		}
    };
   
    Newtec.FormItem.prototype.createValueJQ=function(f){
    	/**
    	 * 通用的item只需重写该方法，返回对应的div或者jq对象
    	 */
    };
	Newtec.FormItem.prototype.getValue = function(){
		
	};
	Newtec.FormItem.prototype.getValueStr = function(){
		return this.getValue();
	};
	/**
	 * 返回外部所需样式字符串
	 * @returns
	 */
	Newtec.FormItem.prototype.getValueStyle = function(isTrue){
		var f=this.defaults;
		var valueStyle=f.domStyle||{},valueStyle=valueStyle.valueStyle;
		return isTrue? "style='"+this.styleJson2Str(valueStyle)+"'":this.styleJson2Str(valueStyle);
	};
	Newtec.FormItem.prototype.init = function(field,newtecForm){
		this.newtecForm=Newtec.Utils.isNull(newtecForm)?this.defaults['newtecForm']:newtecForm;//表单设置
		this.name=field.name;
		this.type = Newtec.Utils.isNull(this.type) ? field.type : this.type;
		return Newtec.Base.prototype.init.call(this,field,newtecForm);//调用父类的方法（这种调用方式比普通的调用方式慢2倍，上万次调用才会体现）
	};
	Newtec.FormItem.prototype.getFormFieldStyle = function(field,otherStyle){
		var f=this.defaults;
    	var hidden = Newtec.Utils.isTrue(Newtec.Utils.getFieldAttrValue(field,'hidden',Newtec.Utils.isNull(this.newtecForm)?'':this.newtecForm.operType))?"display:none; ":" ";
    	if(otherStyle==undefined) otherStyle = "";
    	style = " style='"+hidden+ otherStyle+f.itemDivStyle+";";
    	style+=this.styleJson2Str(f.domStyle)+"'";
    	return style;
    };
    Newtec.FormItem.prototype.getFormFieldAttr = function(){
    	var f=this.defaults;
    	var disabled = Newtec.Utils.getFieldAttr("disabled",Newtec.Utils.getFieldAttrValue(f,'disabled',this.operType));
    	var readonly = Newtec.Utils.getFieldAttr('readonly',Newtec.Utils.getFieldAttrValue(f,'readonly',this.operType));
    	return disabled +" "+readonly;
    };
    /**
     * 注意！！,以下方法请根据控件具体情况重写，可不重写
     */
    Newtec.FormItem.prototype.blur=function(blurFun){
    	var This=this;
    	this.valueDiv.on('blur',' input',function(){
    		blurFun(This,this);
    	});
    };
    Newtec.FormItem.prototype.input=function(inputFun){
    	var This=this;
    	this.valueDiv.on('input',' input',function(){
    		inputFun(This,this);
    	});
    };
    Newtec.FormItem.prototype.focus=function(inputFun){
    	this.valueDiv.find('input').focus();
    };
    Newtec.FormItem.prototype.click=function(clickFun){
    	var This=this;
    	this.newtecJQ.on('click',function(){
    		clickFun(This,this);
    	});
    };
    Newtec.FormItem.prototype.clickOut=function(clickOutFun){
    	var itemThis=this;
    	$(document).on("click",function(e){ 
			var target = $(e.target); 
			if(!target.closest(itemThis.newtecJQ).length){ 
				clickOutFun(itemThis);
			} 
		}) ;
    };
    Newtec.FormItem.prototype.setDisabled=function(disabled){
    	
    };
    Newtec.FormItem.prototype.setHidden=function(hidden){
    	
    };
    Newtec.FormItem.prototype.setReadonly=function(readonly){

    };
    Newtec.FormItem.prototype.setWidth=function(readonly){

    };
	 /*******文本框开始******************/
	Newtec.TextItem = function (params) {
		//1.定义缺省参数.
		params.btnFun=params.btnFun||null;
		params.shwoEdit=params.shwoEdit||false;
		params.textClick=params.textClick||null;
		//readonly:制度
		//
	};
	Newtec.TextItem.exte(Newtec.FormItem,'text');
	//3.实现接口
	Newtec.TextItem.over({
		createValueJQ:function(f){
	    	var name = f['name'];
	    	var disabled = Newtec.Utils.getFieldAttr("disabled",Newtec.Utils.getFieldAttrValue(f,'disabled',this.operType));
	    	var readonly = Newtec.Utils.getFieldAttr('readonly',Newtec.Utils.getFieldAttrValue(f,'readonly',this.operType));
	    	var value = f['value']==undefined ? "": " value='"+f['value']+"' ";
	    	//
	    	var div='';
	    	var btn = f.btnFun;
	    	var defaults=this.defaults;
	    	var result = Newtec.Utils.isFunction(btn) ? btn(this,f):undefined;
			var inputStyle=this.getValueStyle();
			var that=this;
	    	if(Newtec.Utils.isFunction(btn) && result != undefined){
	    		div = $("<div class='input-group'></div>");
	    		div.append("<input maxlength='"+(f['maxlength']||"50")+"' type='"+(f['inputType']||"text")+"' autocomplete='off' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='"+inputStyle+"' class='"+(f.inputClass||"")+"' />");
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
				if(Newtec.Utils.isFunction(defaults.textClick)){
					div.find("input").click(function(){
						defaults.textClick(this,that)
					});
				}
	    	}else{
	    		div=$("<input maxlength='"+(f['maxlength']||"50")+"' type='"+(f['inputType']||"text")+"' autocomplete='off' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='"+inputStyle+"' class='"+(f.inputClass||"")+"' />");
				// div=$("<input type='"+(f['inputType']||"text")+"' autocomplete='off' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='"+inputStyle+"' class='"+(f.inputClass||"")+"' />");
	    		if(Newtec.Utils.isFunction(defaults.textClick)){
					div.click(function(){
		    			defaults.textClick(this,that)
		    		});
				}
		    		
			}
//	    	this.item=item;
	    	return div;
		},
		finsh:function(f){
			Newtec.FormItem.prototype.finsh.call(this,f);
			var shwoEdit=f.shwoEdit;
			if(shwoEdit){
				var icJQ=$("<span class='glyphicon glyphicon-edit'></span>");
				this.newtecJQ.append(icJQ);
				icJQ.hover(function(){
					$(this).css('opacity',1);
				},function(){
					$(this).css('opacity',0.5);
				});
				var This=this;
				icJQ.click(function(){
					var textArea=$('<textarea style="width:100%;height:200px;">'+This.getValue()+'</textarea>');
					var win=Newtec.Window.create({
						body:textArea,title:f.title,
						footer:Newtec.Button.create({
							title:'保存',
							click:function(){
								This.setValue(textArea.val());
								win.close();
							}
						})
					})
				});
			}
		},
		getValue:function(){
			return this.valueDiv.find("input").val();
		},
		setValue : function(value){
			var input=this.valueDiv.find('input');
			input.each(function(){
				$(this).val(value);
			});
			input.trigger('keyup');
			input.trigger('input');
			
//			$('#'+this.getFormFieldValueId()).val(value);//不起作用，要在setTimeout中才起作用
		}
	});
	Newtec.TextDoubleItem = function (params) {
		//1.定义缺省参数.
		params.btnFun=params.btnFun||null;
		params.midTitle=params.midTitle||'至';
		params.split=params.split||',';
	};
	Newtec.TextDoubleItem.exte(Newtec.FormItem,'textdouble');
	//3.实现接口
	Newtec.TextDoubleItem.over({
		createValueJQ:function(f){
	    	var name = f['name'];
	    	var value = f['value']==undefined ? "": " value='"+f['value']+"' ";
	    	var midTitle=f.midTitle
	    	//
	    	var div="<div class='text-double'>";
	    	var defaults=this.defaults;
			var inputStyle=this.getValueStyle();
			value=Newtec.Utils.isArray(value)?value:[value];
    		div+="<input type='text' maxlength='"+(f['maxlength']||"50")+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+this.getFormFieldAttr()+" style='"+inputStyle+"' class='"+(f.inputClass||"")+"' value='"+value[0]+"'/>";
    		div+="<span class='mind-title'>"+midTitle+"</span>";
    		div+="<input type='text' maxlength='"+(f['maxlength']||"50")+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+this.getFormFieldAttr()+" style='"+inputStyle+"' class='"+(f.inputClass||"")+"' value='"+(value.length>=2?value[1]:value[0])+"'/>";
	    	return div+"</div>";
		},
		getValue:function(){
			var values="",value;
			var inputs=this.valueDiv.find("input");
			var split=this.defaults.split||",";
			inputs.each(function(){
//				values.push($(this).val());
				value=$(this).val();
				value=value&&value.trim()||"";
				values+=values==""&&value||split+value;
			});
			return values;
		},
		setValue : function(value){
			console.info(value,"-value-")
			value=value&&value.split(this.defaults.split||",")||[]
			this.valueDiv.find("input").each(function(i){
				console.info("===<<<<",i,value[i])
				$(this).val(value[i]||"");
			});
		}
	});
	/*******文本框结束******************/
	/*******颜色文本开始******************/
	Newtec.TextColorItem = function (params) {
		params.change=params.change||null;//Fun
	}
	Newtec.TextColorItem.exte(Newtec.TextItem,'textColor');
	Newtec.TextColorItem.over({
		finsh:function(f){
			var This=this;
			var inputFun=f.inputFun;
			f.inputFun=function(newtec,e){
				if(Newtec.Utils.isFunction(inputFun))
					inputFun(newtec,e)
				This.setJPickerValue($(e).val());
			}
			Newtec.FormItem.prototype.finsh.call(this,f);
			var span=$("<span><span>");
			this.valueDiv.append($("<div class='text-color'></div>").append(span));
			var that=this;
			span.jPicker( {
		        window:{
		            expandable: true
		        },color:{
		            alphaSupport: true,
		            active: new $.jPicker.Color({ hex: 'ffffff' })}
				},function(color, context){//确定后触发
		        	var all = color.val('all');
		         	that.setValue((all && '#' + all.hex || 'transparent'),true)
					var changeFun=that.defaults['change'];
					if(Newtec.Utils.isFunction(changeFun)){
						changeFun(that)
					}
		        },function(color,context){//选择过程中触发
		        	var all = color.val('all');
		        },function(color,context){//取消后触发
		        	
		        }
			);
			this.span=span;
			if(f.value){
				this.setValue(f.value);
			}else{
				this.setJPickerValue('transparent');
			}
		},
		setValue:function(value,isJPicker){
//			value=Newtec.Utils.colorRGB2Hex(value);
			if(!isJPicker){
				value= this.setJPickerValue(value);
			}
			Newtec.TextItem.prototype.setValue.call(this,value);
		},setJPickerValue:function(value){
   	   		var type="";
   	   		value=getHexByWord(value);
				if(value.indexOf('#')>=0){
					type='hex';
					value=value.substring(value.indexOf('#')+1)
				}else if(value.indexOf('rgb')>=0){
					type='rgb';
					value=value.substring(value.indexOf('(')+1)
					value=value.substring(0,value.indexOf(')'))
					value=value.split(',');
					var tagValue={};
					var keys=['r','g','b'];
					for(var i=0;i<value.length;i++){
						tagValue[keys[i]]=Newtec.Utils.toInt(value[i],0);
					}
					value=tagValue;
				}
			var span=this.span[0]; 
			var val=span.color.active.val(type,value, this);
			return "#"+span.color.active.val()['hex'];
 	   	}
	});
	var wordColor={ aquamarine: '#7FFFD4',beige :'#F5F5DC',black :'#000000',blue :'#0000FF',blueviolet:' #8A2BE2',
		brown:'#A52A2A',cadetblue:'#5F9EA0',chartreuse:'#7FFF00',chocolate:'#D2691E',coral:'#FF7F50',
		cornflowerblue:'#6495ED',cyan:'#00FFFF',firebrick:'#B22222',forestgreen:'#228B22',gold:'#FFD700',
		goldenrod:'#DAA520',gray:'#BEBEBE',green:'#00FF00',greenyellow:'#ADFF2F',hotpink:'#FF69B4',
		indianred:'#CD5C5C',khaki:'#F0E68C',lawngreen:'#7CFC00',limegreen:'#32CD32',magenta:'#FF00FF',
		maroon:'#B03060',navy:'#000080',orange:'#FFA500',orangered:'#FF4500',orchid:'#DA70D6',
		palegoldenrod:'#EEE8AA',pink:'#FFC0CB',purple:'#A020F0',red:'#FF0000',snow:'#FFFAFA',tomato:'#FF6347',
		wheat:'#F5DEB3',white:'#FFFFFF',yellow:'#FFFF00',yellowgreen:'#9ACD32'};
	function getHexByWord(name){
		var value=wordColor[name]
		return (Newtec.Utils.isNull(value)?name:value);
	}
	/*******颜色文本展结束******************/
	/*******文本域开始******************/
	Newtec.TextAreaItem = function () {
	};
	Newtec.TextAreaItem.exte(Newtec.FormItem,'textarea');
	//3.实现接口
	Newtec.TextAreaItem.over({
		createValueJQ:function(f){
	    	var name = f['name'];
//	    	var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
	    	var disabled = Newtec.Utils.getFieldAttr("disabled",Newtec.Utils.getFieldAttrValue(f,'disabled',this.operType));
	    	var readonly = Newtec.Utils.getFieldAttr('readonly',Newtec.Utils.getFieldAttrValue(f,'readonly',this.operType));
	    	var value = f['value']==undefined ? "": " value='"+f['value']+"' ";
	    	var btn = f.btnFun;
	    	var div='';
	    	var result = Newtec.Utils.isFunction(btn) ? btn(this,f):undefined;
	    	var inputStyle=this.getValueStyle();
	    	if(Newtec.Utils.isFunction(btn) && result != undefined){
	    		div = $("<div class='input-group'></div>");
	    		div.append("<textarea maxlength='"+(f['maxlength']||"1000")+"' type='"+f['type']+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='"+inputStyle+"' class='"+(f.inputClass||"")+"' ></textarea>");
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
	    		div=$("<textarea maxlength='"+(f['maxlength']||"1000")+"' type='"+f['type']+"' name='"+name+"' id='"+this.getFormFieldValueId()+"' "+value+f.placeholder+disabled+readonly+" style='"+inputStyle+"' class='"+(f.inputClass||"")+"' /></textarea>");
	    	}
	    	return div;
		},
		getValue:function(){
			return $('#'+this.getFormFieldValueId()).val();
		},
		setValue : function(value){
			this.newtecJQ.find('#'+this.getFormFieldValueId()).val(value);
			var input=this.valueDiv.find('textarea');
			input.trigger('keyup');
			input.trigger('input');
//			$('#'+this.getFormFieldValueId()).val(value);//不起作用，要在setTimeout中才起作用
		}
	});
	/*******文本域结束******************/
	 /*******换行符开始******************/
	Newtec.LineItem = function (p) {
		p.column=12;
	}
	Newtec.LineItem.exte(Newtec.FormItem,"line");
	Newtec.LineItem.over({
		createValueJQ:function(f){
			f.column=12;
			return $('<div><div>');
		},
		getItemDiv:function(){
	    	var f=this.defaults;
	    	var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
	    	var div1 =$( "<div id='"+id+"' class='form-group col-xs-12 col-"+f.columnType+"-12' "+this.getFormFieldStyle(f)+">"
	    	+"</div>");
	    	if(f.showTitle||f.showTitle==undefined){
	    		var rate=f.titleWRate;
	    		var width=rate>=0&&rate<=100?"width:"+rate+"%;":"";
	    		var titleAlign=f['titleAlign'];
	    		var titleStyle=f['titleStyle'];
	    		if(titleAlign=='left'){
	    			titleStyle+=";text-align: left; padding-right: 0; padding-left: 12px; ";
	    		}else if(titleAlign=='center'){
	    			titleStyle+=";text-align: center; padding-right: 0;";
	    		}
	    		var t=$("<label class='control-label col-"+f.columnType+"-"+f.titleNum+" no-padding-right'  style='white-space:nowrap;padding-left: 0;padding-bottom: 7px;"+width+titleStyle+"'>"+f['title']+"</label>");
	    		this.titleJQ=t;
	    	    div1.append(t);
	    	}
	    	return div1;
    	},setValue:null,getValue:null
	})
	 /*******换行符结束******************/
	 /*******单选、多选开始******************/
	Newtec.RadioItem = function (params) {
		params.defdata=params.defdata||{'true':'是','false':'否'};
		params.userFirst=params.userFirst!==undefined?params.userFirst:true;
//		$.extend(true,this.defaults,p);
	};
	Newtec.RadioItem.exte(Newtec.FormItem,"radio");
	Newtec.RadioItem.over({
		createValueJQ:function(f){
			var def=this.defaults,
			inputStyle=this.getValueStyle(1),
	    	defaultValue = f['value'],
	    	data=Newtec.Utils.isNull(f['data'])?def['defdata']:f['data'],
	    	radio="",
	    	userFirst=def.userFirst;
	    	for ( var key in data) {//遍历每个值
	    		var checked=(userFirst&&!defaultValue&&'checked')
	    		||(defaultValue==key&&'checked')||'';
	    		userFirst=false;
	    		radio+='<label id="'+key+'"  class="radio-inline  '+checked+'" '+inputStyle+' data="'+key+'">'
	  	    	  +'<span  class="radio-item"  ><span class="radio-item-item"></span></span><span> '+data[key]+'</span></label>';
			}
			var valueDiv=this.valueDiv
			var that=this;
			var inputFun=f.event.inputFun||f.inputFun
			//点击事件
			valueDiv.on('click',".radio-inline",function(){
				var jq=$(this);
				if(jq.hasClass("checked"))return;
				valueDiv.find('.checked').removeClass("checked")
				jq.addClass("checked");
				inputFun&&inputFun(that);
			})
	    	return radio;
		},
	getValue:function(){
		return this.valueDiv.find('.checked').attr("data");
	},
	setValue : function(value){
		this.valueDiv.find('.checked').removeClass("checked");
		if(Newtec.Utils.isNull(value))return;
		this.valueDiv.find('#'+value).addClass("checked");
	},
	focus:function(){
		this.focusing=true;
	},
	blur:function(blurFun){
		var radioThis=this;
		this.valueDiv.on('click',function(){
			radioThis.focusing=true;
		});
		$(document).on("click",function(e){ 
			var target = $(e.target); 
			if(!target.closest(radioThis.valueDiv).length&&radioThis.focusing){ 
				radioThis.focusing=false;
				blurFun&&blurFun(radioThis,this);
			} 
		}) ;
	}
	});
	Newtec.CheckboxItem = function (params) {
		params.mode=params.mode||'1';
		params.data=params.data||{key:"value",key2:"value2"};
	};
	Newtec.CheckboxItem.exte(Newtec.FormItem,"checkbox");
	Newtec.CheckboxItem.over({
		createValueJQ:function(f){
	    	var defaultValue = f['value'],
	    	data=f['data'],
	    	inputStyle=this.getValueStyle(1),
	    	html="";
	    	//获取每个孩子样式
	    	function getItem(name,value,checked){
	    		return "<label class='checkbox-inline' "+inputStyle+" data='"+name+"' id='"+name+"'>"+
	    		 " <span  class='checkbox-item' "+(checked&&"checked"||"")+"  > <img src='"+serverUrl+"myqdp/images/base/ok.png'/></span><span>"+(value||"")+"</span>"+
	    		"</label>";
	    	}
	    	if(Newtec.Utils.isJson(data)){
	    		defaultValue=Newtec.Utils.isArray(defaultValue)?defaultValue:[defaultValue];
	    		var len=defaultValue.length;
	    		for(var key in data){
	    			var checked=false;
	    			for(var i=0;i<len;i++){
	    				if(key==defaultValue[0]){
	    					checked=true;
	    					break;
	    				}
	    			}
	    			html+=getItem(key,data[key],checked);
	    		}
	    	}else{
	    		html=getItem("","",defaultValue!=false);
	    	}
	    	var valueDiv=this.valueDiv
	    	//点击事件
			valueDiv.on('click',".checkbox-inline",function(){
				var jq=$(this);
				if(jq.hasClass("checked")){
					jq.removeClass("checked");
				}else{
					jq.addClass("checked");
				}
				
			})
	    	return html;
		},
	getValue:function(){
		var value=[];
		this.valueDiv.find('.checked').each(function(){
			value.push($(this).attr("data"))
		});
		return value.length<=1?value[0]:value;
	},
	setValue : function(value,checked){
		var valueDiv= this.valueDiv;
		checked=checked===false||true;
		if(Newtec.Utils.isArray(value)){
			for(var i=0;i<value.length;i++){
				if(Newtec.Utils.isNull(value[i]))continue;
				if(checked)valueDiv.find('#'+value[i]).addClass('checked');
				else valueDiv.find('#'+value[i]).removeClass('checked');
			}
		}else if(!Newtec.Utils.isNull(value)){
			
			if(checked)valueDiv.find('#'+value).addClass('checked');
			else valueDiv.find('#'+value).removeClass('checked');
		}else{
			valueDiv.find('.checked').removeClass('checked');
		}
	    
	},
	input:function(inputFun){
		this.valueDiv.on('click','label',function(){
			inputFun(this);
		});
	},
//	blur:function(blurFun){}
	
	});
	/*******单选、多选结束******************/
	/*******新下拉列表开始******************/
	Newtec.MySelect||Newtec.Utils.addJS("widget/newtec.myselect.js");
	Newtec.MySelectItem=function(param){
	};
	Newtec.MySelectItem.exte(Newtec.FormItem,"select");
	Newtec.MySelectItem.over({
		createValueJQ:function(f){
			this.field=f;
			this.id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
			var oldChangeAfter=f.changeAfter,that=this;
			f.changeAfter=function(element, checked, value,name){
				that.onChange(element, checked, value,name);
				Newtec.Utils.isFunction(oldChangeAfter)&&oldChangeAfter(element, checked, value,name);
			};
			var domStyle=f.domStyle||{};
			
			f.domStyle=domStyle.valueStyle;
			var mySelect =Newtec.MySelect.create(f);
			this.mySelect=mySelect;
	    	return mySelect.newtecJQ;
		},
		getValue:function(){
			return this.mySelect.getValue();
		},
		setValue : function(name,value,isOpen){
			this.mySelect.setValue(name,value,isOpen);
		}
	});
	Newtec.MySelectItem.prototype.setData = function(datas,defaultValue,append,isOpen){
		this.mySelect.setData(datas,defaultValue,append,isOpen);
	};
	Newtec.MySelectItem.prototype.copyFieldValue = function(selectValue){
		 if(!Newtec.Utils.isNull(this.newtecForm) && this.newtecForm.operType != 'fetch'){//查询表单不复值
			 var copyField = this.field['copyField'];
              if(!Newtec.Utils.isNull(copyField)){
           	   var value =Newtec.Utils.isNull(selectValue)?"": this.mySelect.mapData[selectValue];
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
	 * 功能：下拉列表选择改变时触发事件
	 * @param element：当前元素
	 * @param checked：选中状态
	 * @param value：当前值
	 * @param name：当前name
	 */
	Newtec.MySelectItem.prototype.onChange=function(element,checked,value,name){
		this.copyFieldValue((checked?name:""));
	};
	Newtec.MySelectItem.prototype.input=function(inputFun){
		this.mySelect.input(inputFun);
	};
	Newtec.MySelectItem.prototype.focus=function(){
		this.focusing=true;
	};
	Newtec.MySelectItem.prototype.blur=function(blurFun){
		this.mySelect.blur(blurFun);
	};
	Newtec.MySelectItem.prototype.click=function(clickFun){
	    var This=this;
		this.newtecJQ.on('click',function(){
			clickFun(This,this);
		});
		this.mySelect.click(clickFun);
	};
	Newtec.MySelectItem.prototype.clickOut=function(clickOutFun){
		this.mySelect.click(clickOutFun);
	};
	/*******新下拉列表结束******************/
	
	/*******文本按钮开始******************/
	Newtec.TextBtnItem = function (params) {
		//1.定义缺省参数.
		params.btnTitle=params.btnTitle||"点击";
		var domStyle=params.domStyle||{};
		domStyle.btnStyle=null
//		$.extend(true,this.defaults,p);
	};
	Newtec.TextBtnItem.exte(Newtec.FormItem,'textbtn');
	//3.实现接口
	Newtec.TextBtnItem.over({
		createValueJQ:function(f){
			var defaults=this.defaults;
			var that=this;
			var id = Newtec.Utils.isNull(this.newtecForm)?(this.id+"_"+f['name']):this.newtecForm.getFormFieldId(f['name']);
			var domStyle=f.domStyle||{},
			valueStyle
			btnStyle="",pStyle="";
			if(f.domStyle){
				var valueJson=domStyle.valueStyle||{};
				pStyle =this.removeParentStyle(valueJson);
				if(domStyle.btnStyle){
					var btnjson=domStyle.btnStyle;
					if(btnjson.width){
						var valueStyle=domStyle.valueStyle=domStyle.valueStyle||{};
						valueStyle.paddingR=btnjson.width;	
					}
					btnStyle=this.styleJson2Str(domStyle.btnStyle);
				}
			}
			var inputStyle=this.getValueStyle(1);
	    	 var div=$("<div autocomplete='off' class='text-btn clear-float' style='"+pStyle+"' >" +
	    	 		"<input class='btn-input col-input' "+(f.readonly&&"readonly='readonly'"||"")+"	 value='"+(f.value||"")+"' "+(f.name&&" name='"+f.name+"'"||"")+" placeholder='"+(f.hint||"")+"' "+inputStyle+"/>" +
  			"<button class='btn  "+(f.btnclassName||"btn-success")+"' style='"+btnStyle+"'>"+f['btnTitle']+"</button></div>");
	    	 var click= f.click;
	    	 if(Newtec.Utils.isFunction(click))
		    	 div.find('button').click(function(){
		    		 return click();
		    	 })
		    this.valueInput=div.find('input');
	    	return div;
		},
		getValue:function(){
			return  this.valueInput.val();
		},
		setValue : function(value){
			var inputJQ=this.valueInput;
			inputJQ.val(value);
			inputJQ.trigger('keyup');
			inputJQ.trigger('input');
		},
	});
	/*******文本按钮结束******************/
	
	
	/*******选择文件开始******************/
	Newtec.File||Newtec.Utils.addJS('newtec.file.js','myqdp/js/widget/')
	Newtec.FileItem = function () {
			
//		$.extend(true,this.defaults,p);
	};
	Newtec.FileItem.exte(Newtec.FormItem,'file');
	//3.实现接口
	Newtec.FileItem.over({
		createValueJQ:function(f){
			var that=this;
			 f.valueId="file_"+f.name;
			 var valueJson=null;
			 if(f.domStyle){
				 var domStyle= f.domStyle;
				 var valueJson =domStyle.valueStyle||{};
				 valueJson.btnStyle=domStyle.btnStyle;
			 }
			 var filePramas=$.extend(true,{},f);
			 filePramas.btnClass=filePramas.btnClass||"btn-success";
			 filePramas.domStyle=valueJson;
			 filePramas.title="";
			 filePramas.inputClass='col-input',
			 filePramas.hint=f.hint||"选择文件";
			 filePramas.name=f.name;
			 filePramas.btnParams=f.btnParams;
  			var file=Newtec.File.create(filePramas);
  			this.file=file;
  			var name=f.name;
  			var  fileDiv=file.newtecJQ;
  			this.valueInput=fileDiv.find("input[type='text']");
  			return fileDiv;
		},
		getText:function(){
			return this.valueInput.val();
		},
		getValue:function(formData){
			return this.file.getData(formData,this.defaults.name);
		},
		setValue:function(value){
			this.valueInput.val(value)
			this.valueInput.trigger('keyup');
			this.valueInput.trigger('input');			
		},
	});
	/*******选择文件结束******************/
	
	
	/*******特殊文本域结束******************/
	Newtec.DateTime||Newtec.Utils.addJS('newtec.datetime.js','myqdp/js/widget/')
	/*******时间选择框开始******************/
	Newtec.dateTimeItem = function (params) {
		//1.定义缺省参数.
		params.isDouble=params.isDouble||false;
		params.midTitle=params.midTitle||"至";
//		$.extend(true,this.defaults,p);
	};
	Newtec.dateTimeItem.exte(Newtec.FormItem,'datetime');
	//3.实现接口
	Newtec.dateTimeItem.over({
		createValueJQ:function(f){
			var that=this;
			this.field=f;
			var isDouble=this.isDouble=f.isDouble;
			var midTitle=f.midTitle;
			var value=f.value;
			var div=$("<div class='select-datetime "+(isDouble&&"double"||"")+"'></div>")
			var valueJson=null;
			 if(f.domStyle){
				 var domStyle= f.domStyle;
				 var valueJson =domStyle.valueStyle||{};
				 valueJson.btnStyle=domStyle.btnStyle;
			 }
			var dateTime=Newtec.DateTime.create({timeParams:f.timeParams,name:f.name,inputClass:'col-input',showIcon:true,
				limitBefore:true,domStyle:valueJson,
				change:function(){
					valueInput.trigger('keyup');
					valueInput.trigger('input');
				}})
    		div.append(dateTime.newtecJQ);
			this.dateTime=dateTime;
			this.valueInput=div.find("input");  
			if(isDouble){
				div.append("<span class='mind-title'>"+midTitle+"</span>");
				var dateTime2=Newtec.DateTime.create({timeParams:f.timeParams,name:f.name,inputClass:'col-input',showIcon:true,
					limitBefore:true,domStyle:valueJson,
					change:function(){
						valueInput.trigger('keyup');
						valueInput.trigger('input');
					}})
				div.append(dateTime2.newtecJQ)
				this.dateTime2=dateTime2;
			}
			var valueInput=this.valueInput=div.find('input');
			return div;
		},
		getValue:function(formData){
			if(this.isDouble){
				return [this.dateTime.getDate(),this.dateTime2.getDate()]
			}else
				return this.dateTime.getDate();
		},
		setValue:function(value){
			this.valueInput.trigger('keyup');
			this.valueInput.trigger('input');
			if(this.isDouble){
				if(Newtec.Utils.isArray(value)&&value.length>1){
					this.dateTime.setDate(value[0]);
					this.dateTime2.setDate(value[1]);
				}else{
					this.dateTime.setDate(value);
					this.dateTime2.setDate(value);
				}
					
			}else{
				this.dateTime.setDate(value);
			}
		},
	});
	/*******时间选择框结束******************/
	Newtec.Upload||Newtec.Utils.addJS("newtec.upload.js","myqdp/js/widget/");
	/*******上传框开始******************/
	Newtec.uploadItem = function (params) {
		//1.定义缺省参数.
//		$.extend(true,this.defaults,p);
	};
	Newtec.uploadItem.exte(Newtec.FormItem,'upload');
	
	Newtec.uploadItem.over({
		createValueJQ:function(f){
			var that=this;
			this.field=f;
			if(f.domStyle){
				 var domStyle= f.domStyle;
				 var valueJson =domStyle.valueStyle||{};
				 valueJson.btnStyle=domStyle.btnStyle;
			 }
			var value = f.value;
			var div=$("<div class='uploadFile' id='"+this.id+"'></div>")
			setTimeout(function(){
				if(that.isSetting)return;
				that.isSetting=true;
//				var upload=Newtec.Upload.create({data:f.data,/*temp:{initialPreview:["<img src='lottery/images/bg.jpg' class='file-preview'/>"]},*/url:f.url,appendTo:".uploadFile"});
				that.reDraw({data:f.data,/*temp:{initialPreview:["<img src='lottery/images/bg.jpg' class='file-preview'/>"]},*/url:f.url,appendTo:"#"+this.id});
			},300)
			return div;
		},
		reDraw:function(params){
			console.info(this.newtecJQ)
			this.newtecJQ.find("#"+this.id).empty();
			var f=this.defaults;
			params.url=f.url;
			params.appendTo="#"+this.id;
			console.info(params)
			var upload=Newtec.Upload.create(params);
			this.initStyle();
			this.upload=upload;
		},
		getValue:function(){
			return this.upload.getFileName();
		},
		setValue:function(value){
			var that = this;
			if(!that.isSetting){
				that.isSetting=true;
				setTimeout(function(){
					var temp = {};
					var imgs = [], cons = [];
					for(var i =0 ;i<value.length;i++){
						var img = value[i];
						console.info("img====",img)
						if(img.split("/")[3] == null || img.split("/")[3]== undefined)continue;
						var name = img.split("/")[3].split("-")[1];
						imgs.push(img);
						var con = {caption:name,url:$_.Config.host+'/lotteryFile',extra:{type:'delete',file:img}};
						cons.push(con);
					}
//					var con =[{caption: "People-1.jpg", size: 1, width: "120px", url: "/site/file-delete", key: 1}, ]
					temp['initialPreview']=imgs;
					temp['initialPreviewAsData']=true;  
		            temp['initialPreviewFileType']='image';
		            temp['initialPreviewConfig']=cons;
		            temp['deleteUrl']=$_.Config.host+'/lotteryFile';
		            temp['deleteExtraData']={type:'delete'/*,file:img*/};
		            console.info("-----this.temp--------",temp);
		            that.reDraw({temp:temp})
				},400)
			}else{
				var temp = {};
				var imgs = [], cons = [];
				for(var i =0 ;i<value.length;i++){
					var img = value[i];
					console.info("img====",img)
					var name = img.split("/")[3].split("-")[1];
					imgs.push(img);
					var con = {caption:name,url:$_.Config.host+'/lotteryFile',extra:{type:'delete',file:img}};
					cons.push(con);
				}
//				var con =[{caption: "People-1.jpg", size: 576237, width: "120px", url: "/site/file-delete", key: 1}, ]
				temp['initialPreview']=imgs;
				temp['initialPreviewAsData']=true;  
	            temp['initialPreviewFileType']='image';
	            temp['initialPreviewConfig']=cons;
	            temp['deleteUrl']=$_.Config.host+'/lotteryFile';
	            temp['deleteExtraData']={type:'delete'/*,file:img*/};
	            that.reDraw({temp:temp})
			}
		},
		initStyle:function(){
			var file = this.newtecJQ.find(".file-input").find(".btn-file")
    		file.css({"background-image":"url(lottery/images/main/imp_file.png)",
    		"height": "135px","width": "122px","background-color":"white"})
		}
	});
	/*******上传框结束******************/
	Newtec.uploadItem1 = function (params) {
		//1.定义缺省参数.
//		$.extend(true,this.defaults,p);
	};
	Newtec.uploadItem1.exte(Newtec.FormItem,'upload1');
	
	Newtec.uploadItem1.over({
		createValueJQ:function(f){
			var that=this;
			this.field=f;
			var midTitle=f.midTitle;
			var value=f.value;
			var div=$("<div class='uploadFile'></div>")
			var valueJson=null;
			var upload=Newtec.Upload.create({data:f.data,url:f.url});
    		div.append(upload.newtecJQ);
			this.upload=upload;
			return div;
		},
		getValue:function(){
			return this.upload.getValue();
		},
	});
	Newtec.Module("FormItem")
	/*******上传框结束******************/
})();