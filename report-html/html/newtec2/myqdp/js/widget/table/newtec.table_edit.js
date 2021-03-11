/**
 * 表格双击可编辑模块
 */
(function () {
	Newtec.Table.prototype.clearEditStyle=function(datas){
		if (Newtec.Utils.isArray(datas)) {
			for ( var i = 0; i < datas.length; i++) {
				this.clearEditStyle(datas[i]);
			}
		}else{
			var id= datas[this.NEWTEC_TR_ID];
			var tr=$('#'+id);
			_cleartrEdit(tr);
		}
	};
	Newtec.Table.prototype.cleartrEdit=function(tr){
		_cleartrEdit(tr);
	}
	var _cleartrEdit=function(tr){
		//console.info("_cleartrEdit");
		var tds=tr.find('td.edit-tr');
		//console.info(tds.length);
		for ( var i = 0; i < tds.length; i++) {
			$(tds[i]).removeClass('edit-tr');
		}
	};
	
	/**
	 * 将该列变成可编辑
	 * 
	 */
	Newtec.Table.prototype.toCanEdit=function(datas){
		if (Newtec.Utils.isNull(datas)) {
			return;
		}
		if (Newtec.Utils.isArray(datas)) {
			for ( var i = 0; i < datas.length; i++) {
				this.toCanEdit(datas[i]);
			}
		}else{
			var id= datas[this.NEWTEC_TR_ID];
			var tr=$('#'+id);
			var count=0;
			var tds=tr.find('td');
//			var fields=this.fields;
			var tableThis=this;
			var fields=$.extend(true,[],this.fields);
			_tdBlurFun(tr,function(elem,fun){
				if(count==0){
					count=1;return;
				}
				var isNnbind=true;
				for(var i = 0; i < fields.length; i++){
					var fn=tableThis.editFun[id][fields[i]['name']];
					if(Newtec.Utils.isFunction(fn))
						if(fn("",true))isNnbind=false;
				}
//				if(isNnbind)
				    $(elem).unbind('click',fun);
			},this);
			var begin=!this.multSelect&&!this.expand?0:1;
			for ( var i = 0; i < fields.length; i++) {
				var f=fields[i];
				_tdToCanEdit($(tds[i+begin]),this,datas,f,id);
			}
		}
	};
	/**
	 * 功能说明：tr被点击回调
	 * @param {Object} tr tr的jq对象
	 * @param {Object} id tr的id
	 */
	Newtec.Table.prototype.trClickEdit=function(tr,id){
		if(id==this.preEditTrId)return false;
		var tdEditMap=this.tdEditMap;
		if(!tdEditMap)return;
		for(var key in tdEditMap){
			tdEditMap&&tdEditMap[key](key,true);
		}
		this.preEditTrId=null;
		this.tdEditMap=null;
	}
	/**
	 * 双击编辑事件
	 * @param {Object} td 双击的td对象
	 * @param {Object} tableThis 表格本身
	 * @param {Object} data 对应数据
	 * @param {Object} f 对应表单参数
	 * @param {Object} trId tr的id
	 * @param {Object} inputed 是否输入
	 * @param {Object} isFocus 是否获取焦点
	 * @param {Object} callFun 完成时回调
	 */
	Newtec.Table.prototype.tdToCanEdit=function(td,tableThis,data,f,trId,inputed,isFocus,callFun){
		_tdToCanEdit(td,tableThis,data,f,trId,inputed,isFocus,callFun);
	}
	/**
	 * 创建表单item
	 * @param {Object} f 对应表单参数
	 * @param {Object} tableThis 表格本身
	 */
	var _createField = function(f,tableThis){
    	var type = f['type'];
    	if(Newtec.Utils.isNull(type)){
    		type='text';
    		f['type'] = type;
    	}
    	var name = f['name'];
    	f['id'] = Newtec.Utils.uuid16()+"_"+f['type']+"_"+f['name'];
    	var item ;
    	if(true){
    		var funcType = Newtec.funcType[type];
    		if(funcType==undefined){
    			alert(name+"字段"+type+"类型没有处理类，请确认extend(Newtec.FormItem,'')");
    		}
    		f.showTitle=false;
    		f.title="";
    		f.itemDivStyle='padding:0;margin:0;';
    	    f.valueDivStyle='padding:0;margin:0;';
    		item = funcType.create(f);
    		return item;
    	}
	};
	var _tdBlurFun=function(td,blurFun,tableThis){
		var fun='';
		fun=function(e){
			var This=this;
			console.info("===_tdBlurFun==========")
			setTimeout(function(fun){
				if(tableThis.itemClick){
					tableThis.itemClick=false;return;
				}
				var target = $(e.target); 
				if(!target.closest(td).length){ 
					blurFun(This,fun);
				} 
			}, 300);
			
		};
		$(document).on("click",fun) ;
	};
	
	/**
	 *  功能说明：td变成可编辑状态
	 * @param {Object} td 当前操作的tdjq对象
	 * @param {Object} tableThis 表格对象
	 * @param {Object} data 数据
	 * @param {Object} f td的formItem的参数
	 * @param {Object} trId tr的id
	 * @param {Object} inputed 是否已经输入过
	 * @param {Object} isFocus 是否获取焦点
	 * @param {Object} callFun 失去焦点触发事件
	 */
	var _tdToCanEdit=function(td,tableThis,data,f,trId,inputed,isFocus,callFun){
		
		var tdEditMap=tableThis.tdEditMap;
		var tdId=td.attr("id")
		if(tdEditMap&&tdEditMap[tdId])return;
		var txt='';
		var setValue=true;
		var name=f.name;
		var text = data[name]===undefined&&td.text()||data[name];
		if(f.type=="addressItem")f.defaultStyle={}
		var required=f.required;
		if(tableThis.editFun[trId]==undefined){
			tableThis.editFun[trId]=editFun={};
		}
		var clicked=false;//记录是否已经被点击过
		//失去焦点触发事件
		var blurFun=function(elem,input){
			console.warn("tableThis.itemClic==>",tableThis.itemClick)
//			if(!inputed&&!input)return true;
			if(f.type=="select"){
				txt.mySelect.close()
			}
			var newText=txt.getValue();
			newText=Newtec.Utils.isNull(newText)?"":newText;
			newText=Newtec.Utils.isString(newText)?newText.trim():newText;
			var newtecJQ=txt['newtecJQ'];
			if(!Newtec.Utils.isNull(required)){
				newtecJQ.css({'border':"1px solid red",'border-radius':"3px"});
//				alert(required);
				return true;
			}
			data[name]=newText;
			newtecJQ.remove();
			if(tableThis.isTdValueHtmlFun){
				var tdValueHtmlFun=tableThis.defaults['tdValueHtmlFun'];
				newText = tdValueHtmlFun(newText,data,-1,-1,name);
				if(newText==undefined) newText = "";
			}
			
			td.text(newText);
			var editHandler=tableThis.defaults.editHandler;
			if(Newtec.Utils.isFunction(editHandler))
				editHandler(newText,text,data,txt,name);
			if(Newtec.Utils.isFunction(callFun)){
				callFun(newText,text,txt);
			}
			
			tableThis.setTdWidth(tableThis)
		};
		f.rigData=$.extend(true,{},data);
		txt=_createField(f,tableThis);
		td.text("");
		td.append(txt['newtecJQ']);
		txt.setValue(text);
		if(isFocus)
			txt.focus();
		var trId=data[tableThis.NEWTEC_TR_ID]+"";	
		console.warn("======_tdToCanEdit=================",tableThis.preEditTrId,trId)
		if(tableThis.preEditTrId){
			
			if(trId!=tableThis.preEditTrId){
				for(var key in tdEditMap){
					tdEditMap&&tdEditMap[key](key,true);
				}
				tdEditMap=tableThis.tdEditMap={};
				tableThis.newtecJQ.find("#"+tableThis.preEditTrId).unbind('click')
				tableThis.PreEditTrId=trId;
			}
			tdEditMap[tdId]=blurFun;
		}else{
			tableThis.preEditTrId=trId;
			tableThis.tdEditMap={}
			tableThis.tdEditMap[tdId]=blurFun
		}
	};
})()
