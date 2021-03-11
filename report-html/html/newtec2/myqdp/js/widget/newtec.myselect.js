/**
 * 版本0.1（通用版本）
 * 吴明坤 2019-11-27 
 * 1.修改下拉列表多选样式,修改了多选的选中逻辑
 */
;(function(){
var serverUrl=Newtec.ServerUrl||"";
	if(Newtec.MySelect != undefined){
			console.warn('newtec.myselect.js已经被引入!');
			return ;
		}
	Newtec.MySelect = function (params) {
		this.defaults={
				id:''
					,useFirstValue:true
					,value:''
					,displayName:'name'
					,valueName:'id'
					,showSingleIcn:false
					,defaultValue:'请选择！！'
					,autoLoadData:true
					,everyLoadData:false
					,minWidth:150
					,showClearIcn:true//显示清楚按钮
					,isLeft:true
					,maxHeight:300
					,maxWidth:250
					,alwaysValue:''
					,autoWidth:true//true:下拉框大小随着结果框大小变化
					,data:[]//本地数据
		            ,isCenter:true
		            ,showDownIcon:false
		            ,canEdit:false
		            ,mouseShow:false
		            ,search:true
		            ,domStyle:{
		            	
		            }
		            ,addPreData:""
		            ,addLastData:""
					,ds:{//数据源从服务器加载
						name:''
						,select:[]
						,sortBy:''
						,data:''//查询条件
						,callback:''
					}
					,loadDataBefore:''//下拉列表加载数据前执行的函数
					,changeAfter:''
					,setValueAfter:''//设置值后]
					,change:''
		};
		this.firstOpen= true;//第一次加载数据
		this.mapData={};//存放着数据下拉列表的所有数据，
		this.readonly=true;
		this.disabled=false;
//		$.extend(true,this.defaults,params);
	};
	Newtec.MySelect.exte(Newtec.Base,'mySelect');
	Newtec.MySelect.over({
		createNewtecJQ:function(f){
			this.value = f.value;
			this.values={};
			this.disabled =Newtec.Utils.getFieldAttrValue(f,'disabled',this.operType);
			var id= this.id;
			var btnClass= (f['class']||"")+" "+(f.inputClass||"");
			this.multiple=f['multiple']||false;
	    	var leftOrRight=f.isLeft?'left':'right';
	    	var canEdit=f.canEdit?'':'readOnly="true"';
	    	var domStyle=f.domStyle;
	    	var divStyle="",btnStyle="";
	    	if(Newtec.Utils.isJson(domStyle)){
	    		divStyle=this.removeParentStyle(domStyle);
	    		btnStyle=this.styleJson2Str(domStyle);
	    	}
			var select = $('<div class="btn-group select newtec-myselect '+(f.showClearIcn&&"show-clear"||"")+(f.isCenter&&" "+"center"||"")+(f.className&&" "+f.className||"")+'" style="'+divStyle+'" >'
			+'<button type="button" class="btn btn-default dropdown-toggle '+btnClass+'" style="'+btnStyle+'">'
			+'<div class="content pull-left">'
			+'<input type="text" align="center"  name="'+f['name']+'" '+canEdit+' value=""  placeholder="'+f.defaultValue+'"/></div> </button>'
			+'</div>');
			
			if(f.showDownIcon){
				select.append('<div class="glyphicon glyphicon-triangle-bottom btn btn-default" ><div>');
			}else if (f.showClearIcn) {
				select.append('<div class="glyphicon glyphicon-remove btn btn-default"><div>');
			}
			this.select = select;
			var selectOpenDiv=$('<div id="'+id+'_openDiv" class="menu-div myselect-openDiv'+(f.isLeft&&" left"||" right")+'"></div>');
			$('body').append(selectOpenDiv);
			if(f.search){
				selectOpenDiv.append('<div class="input-group myselect-search">'
						+' <input class="form-control" id="searchWord" type="text" placeholder="请输入..">'
						+'  <div class="input-group-addon btn-default" ><label class="glyphicon glyphicon-search" style="cursor:pointer;"></label></div>'
						+'</div>');
			}
			selectOpenDiv.append('<div class="open-body" style="height:'+(this.defaults.maxHeight+40)+'px;"></div>');
			this.selectOpenDiv=selectOpenDiv;
	    	return select;
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
			console.warn("setValue:",name,value)
			if (!Newtec.Utils.isNull(name)&&Newtec.Utils.isNull(value)) {
				this.removeAll();
				if (name instanceof Array) {
					for ( var int = 0; int < name.length; int++) {
						this.selecByName(name[int],isOpen);
					}
				}else {
					name=Newtec.Utils.isString(name)&&name+"".replaceAll('\\.','_')||name;
					this.selecByName(name,isOpen);
				}
				return;
			}else if(Newtec.Utils.isNull(name)&&Newtec.Utils.isNull(value)){
				this.removeAll();
				for ( var key in this.values) {
					var JQ=!this.defaults.showSingleIcn&&!this.multiple?this.selectOpenDiv.find('ul a[name='+key+']'):this.selectOpenDiv.find("ul a label input[name="+key+"]");
					this.onChange(JQ[0],false,this.values[key],key);
				}
				this.values={};
				this.selectOpenDiv.find(" input:checked").prop('checked',false);
				var inputs=this.selectOpenDiv.find(" input:checked");
				inputs.prop('checked',false);
//			    return;
			}
			var content='';
			var title='';
			if(Newtec.Utils.isArray(value)){
				
			}else if(!Newtec.Utils.isNull(value)){
				for(var key in value){
					title+=Newtec.Utils.isNull(content)?value[key]:","+value[key];
					content+=Newtec.Utils.isNull(content)?value[key]:","+value[key];
				}
			}
			var contentJQ=this.select.find(".content");
			var alwaysValue=this.defaults.alwaysValue;
			content=Newtec.Utils.isNull(alwaysValue)?content:alwaysValue;
			contentJQ.find('input').val(content);
			contentJQ.find('input').trigger('keyup');
			contentJQ.find('input').trigger('input');
			
			contentJQ.attr('title',title);
			var setValueAfterFun = this.defaults.setValueAfter;
			if(Newtec.Utils.isFunction(setValueAfterFun)){
				 setValueAfterFun(value,this);
	         }
		}
		});

	Newtec.MySelect.prototype.loadData=function(append){
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
				console.warn('下拉列表【'+f['name']+'】数据源名称不能为空！');
				return ;
			}
			var newtecDS = Newtec.DS.create(dsName);
			
			var select = ds['select'];
			if(!Newtec.Utils.isArray(select))select = [];
			var displayName = f['displayName'];
			if(Newtec.Utils.isNull(displayName)){
				console.warn('下拉列表【'+f['name']+'】属性displayName必须配置！');
				return ;
			}
			var valueName = f['valueName'];
			if(Newtec.Utils.isNull(valueName)){
				console.warn('下拉列表【'+f['name']+'】valueName！');
				return ;
			}
			select.addUnique(valueName);
			select.addUnique(displayName);
			var selectThis = this;
			datas = {};
			var addPreData=f.addPreData;
			var addLastData=f.addLastData;
			if(!Newtec.Utils.isNull(addPreData)){
				var fData={};
				if(Newtec.Utils.isArray(addPreData)){
					for(var i=0;i<addPreData.length; i++){
						var d=addPreData[i];
						for(var key in d){
							fData[key]=d[key];
						}
					}
					for(var key in datas){
						fData[key]=datas[key];
					}
					datas=fData;
				}else{
					fData=$.extend(true,{},addPreData);
					for(var key in datas){
						fData[key]=datas[key];
					}
					datas=fData;
				}
			}
			var dsD=Newtec.Utils.isNull(ds['data'])?{}:ds['data'];
			var param={
					select:select,
					startRow:ds['startRow'],endRow:ds['endRow'],
					data:dsD};
			if(ds['sortBy'])
				param['sortBy']=ds['sortBy'];
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
				if(result.datas)result=result.datas;
				var len = result.length;
				if(!Newtec.Utils.isNull(addLastData)){
					if(Newtec.Utils.isArray(addLastData)){
						for(var i=0;i<addLastData.length; i++){
							var d=addLastData[i];
							for(var key in d){
								datas[key]=d[key];
							}
						}
					}else{
						for(var key in addLastData){
							datas[key]=addLastData[key];
						}
					}
				}else{
					datas=result;
				}
				selectThis.defaults.data=datas;
				selectThis.dataLen=len;
				selectThis.setData(datas,value,true);
				if(Newtec.Utils.isFunction(ds['callback']))
					ds['callback'](response);
			};
			newtecDS.fetchData(param);
		}
		
	};
	Newtec.MySelect.prototype.finsh=function(f){
		_registeFunction(this);
		 if(Newtec.Utils.isTrue(this.defaults['autoLoadData']))
			 this.loadData();
	};
	Newtec.MySelect.prototype.searchWord=function(searchWord){
		var defaults=this.defaults,datas=defaults.data;
		
		if(Newtec.Utils.isNull(searchWord)){
			
//			if(this.selectOpenDiv.find('ul.dropdown-menu li').length!=this.dataLen){
			this.clearAll();
			this.setData(datas,'',false,true,true);
//			}	
		}else{
			var tagDatas= new Array();
			var displayName=defaults.displayName;
			var valueName=defaults.valueName;
			if(Newtec.Utils.isArray(datas)){
				for (var i=0,len=datas.length;i<len;i++) {
					var d=datas[i],
					index=d[displayName].indexOf(searchWord);
					if(index>=0)
						tagDatas.push({id:d[valueName],name:d[displayName],sort:index});
				}
			}else{
				for (var key in datas) {
					var index=datas[key].indexOf(searchWord);
					if(index>=0){
						var d={};
						d[valueName]=key;
						d[displayName]=datas[key];
						d['sort']=index;
//						tagDatas.push({id:key,name:datas[key],sort:index});
						tagDatas.push(d);
					}
				}
			}
			
			tagDatas.sort(this.sortFun);//排序
			this.clearAll();
			this.setData(tagDatas, '', false,true,true);
		}
	};
	Newtec.MySelect.prototype.setData = function(datas,defaultValue,append,isOpen,isSearch){
//		table.setData();
//		tree.setData();
		if (datas==undefined)return;
		var f=this.defaults;
		if(!isSearch)f.data=datas;
		var droMeDivJQ=this.selectOpenDiv;
		var wHtml=!f.autoWidth?'max-width:'+f.maxWidth+'px;':'width:'+(this.select.outerWidth()+17)+'px;';
		var select ='<ul class="dropdown-menu" role="menu" style="'+wHtml+'max-height:'+this.defaults.maxHeight+'px;">';
		var mapData=null
		if(Newtec.Utils.isTrue(append)){//不是追加的情况清除掉原来的
			select +=Newtec.Utils.isNull(droMeDivJQ.find('ul').html())?"":droMeDivJQ.find('ul').html();
			 mapData= this.mapData
		}else{
			this.mapData = mapData={};
		}
		if (droMeDivJQ.find('ul.dropdown-menu')) {//移除原有的ul
			droMeDivJQ.find('ul.dropdown-menu').remove();
		}

		var useFirstValue=f.useFirstValue;
			if(Newtec.Utils.isArray(datas)){//数组格式[{text:'',value:''},{text:'',value:''}]
				var displayName =f.displayName;
				var valueName =f.valueName;
				for(var i=0;i<datas.length; i++){
					var data = datas[i];
					var key = data[valueName];
					mapData[key]=data;
					select = select +'<li >'+(data.iconUrl?this.getIconHtml(data.iconUrl):"")+this.getItemA(key, data[displayName], i)+'</label></a></li>';
					if(defaultValue!==false&&(Newtec.Utils.isNull(defaultValue)&&useFirstValue))defaultValue=key;//默认值如果没有设置就使用第一个值
				}
			}else{//json格式{key:value}
				for(var key in datas){
					mapData[key]= datas[key];
					select = select +'<li>'+this.getItemA(key, datas[key])+'</label></a></li>';
					if(defaultValue!==false&&(Newtec.Utils.isNull(defaultValue)&&useFirstValue)){
						defaultValue=key;//默认值如果没有设置就使用第一个值
					}
				}
			}
		select+='</ul>';
		if(!Newtec.Utils.isNull(select)){
			droMeDivJQ.append(select);
		}
		this.setDefaultValue=true;
		this.defaults['value']=defaultValue;//默认值使用
		this.setValue(defaultValue,'',isOpen);
	};
	Newtec.MySelect.prototype.getIconHtml=function(url){
		return "<img class='myselect-icon' src='"+url+"'/>";
	}
	/**
	 * 排序函数
	 */
	Newtec.MySelect.prototype.sortFun=function(a,b){
		return a['sort']-b['sort'];
	};
	/**
	 * 清除所有选中的对象
	 */
	Newtec.MySelect.prototype.clearAll=function(){
		this.setValue("","");
	};
	var _registeFunction=function(selectThis){
		if(!selectThis.defaults.mouseShow){
			
			selectThis.select.on('click','.dropdown-toggle',function(){
				setTimeout(function(){
					var isOpen=selectThis.isOpen;
					if(!isOpen){
						selectThis.open();
					}else {
						selectThis.close();
					}
					selectThis.focusing=true;
				},100);
//			return false;
			});
			selectThis.select.on('click','.glyphicon-triangle-bottom',function(){
				setTimeout(function(){
					
					var isOpen=selectThis.isOpen;
					if(!isOpen){
						selectThis.open();
					}else {
						selectThis.close();
					}
					selectThis.focusing=true;
				},100);
				//			return false;
			});
		}
		//滚动显示逻辑
		if(selectThis.defaults.mouseShow){
			selectThis.isIn1=false;
			selectThis.isIn2=false;
			var time=null;
			var minT=100;
			selectThis.selectOpenDiv.hover(function(){//鼠标进去
				if(time){
					clearInterval(time);
				}
				selectThis.isIn2=true;
				selectThis.isIn1=false;
			},function(){//鼠标出去
				selectThis.isIn2=false;
				selectThis.isIn1=false;
				time=setInterval(function(){
					if(selectThis.isIn2||selectThis.isIn1)return;
					selectThis.close();
					clearInterval(time);
				},minT);
			})
			selectThis.select.hover(function(){
				if(time){
					clearInterval(time);
				}
				selectThis.isIn2=false;
				selectThis.isIn1=true;
				selectThis.open();
			},function(){
				selectThis.isIn2=false;
				selectThis.isIn1=false;
				time=setInterval(function(){
					if(selectThis.isIn2||selectThis.isIn1)return;
					selectThis.close();
					clearInterval(time);
				},minT);
			})
		}
		var isMove=false;
		selectThis.selectOpenDiv.on('mouseenter',function(){
			isMove=true;
		});
		selectThis.selectOpenDiv.on('mouseleave',function(){
			isMove=false;
		});
		$(document).bind('mousewheel',function(){
			!isMove&&selectThis.close();
		})
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
		});
		 var inputFun=selectThis.defaults.inputFun;
		    if(!Newtec.Utils.isFunction(inputFun))
		    	selectThis.blur();
		    selectThis.select.on('click',' .glyphicon-remove',function(){
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
	Newtec.MySelect.prototype.close=function(){
		this.isOpen=false;
		this.selectOpenDiv.css('display','none');
//		this.select.find('button.dropdown-toggle').css('border-radius','4px');
	};
	var bodyJQ=$('body');
	/**
	 * 功能说明：打开下拉框主体内容
	 */
	Newtec.MySelect.prototype.open=function(){
		if (this.disabled)return;
		this.isOpen=true;
		var selectOpenDiv=this.selectOpenDiv;
		var defaults=this.defaults
		if (defaults.everyLoadData||!this.loaded) {
			if(defaults.everyLoadData)
				defaults['data']=[];
			this.loadData();
		}
		
		var bodyOffset=bodyJQ.offset()||{left:0,top:0};
		var height=this.select.height();
		//由于父布局会因为margin偏移，所以获取孩子btn位置
		var btnOffSet=this.select.find('>.dropdown-toggle').offset();
//		var width=(this.select.outerWidth(true)-this.select.outerWidth())/2;
		bwO=(bodyJQ.outerWidth(true)-bodyJQ.outerWidth())/2;
		bhO=(bodyJQ.outerHeight(true)-bodyJQ.outerHeight())/2;
//		var left=this.select.offset().left+width-bodyOffset.left+bwO;
//		var top=this.select.offset().top-bodyOffset.top+bhO;
		//减少body产生的偏移
		var left=btnOffSet.left-bodyOffset.left+0;
		var top=btnOffSet.top-bodyOffset.top+0;
		height+=top;
		var bodyH=$('body').outerHeight();
		var selH=selectOpenDiv.outerHeight();
		var cssStype={left:left,top:height,display:'block',height:''}
		if(bodyH<height+selH){
			top=top-selH-5;
			if(top>100){
				if(bodyH-height>150){
					height=bodyH-height-10;
					if(defaults.search){
						height-= 34;
					}
					selectOpenDiv.find('.dropdown-menu').css('height',height)
				}else{
					cssStype.top=top;
				}
			}
			
		}
		selectOpenDiv.css(cssStype);
	    var p=document.getElementById(this.id+"_openDiv");
	    p.style.display='block';
		if (this.defaults.autoWidth) {
			var w=this.select.outerWidth();
			selectOpenDiv.css("width",w+"px");
			selectOpenDiv.find('ul.dropdown-menu').css("width",(w+17)+'px');
		}else if(this.firstOpen){
			this.firstOpen=false;
			selectOpenDiv.css("width",(selectOpenDiv.find('ul').outerWidth()-17)+"px");
		}
//		this.select.find('button.dropdown-toggle').css('border-radius','4px 4px 0 0');
		this.openAfter();
	};
	/**
	 * 渲染完成调用
	 */

	Newtec.MySelect.prototype.romancefinish=function(){
		var selectThis=this;
		if (this.multiple) {
			this.selectOpenDiv.on('click',"ul a .checkbox-inline",function(e){
				var JQ=$(this);
				if (!JQ.hasClass('checked')) {
					selectThis.selecByJQ(JQ,true);
				}else{
					selectThis.removeSelecByJQ(JQ, true);
				
				}
					return false;
			});
		}else{
			if (this.defaults.showSingleIcn) {
				this.selectOpenDiv.on('click','ul a label input[type=radio]',function(e){
					var JQ=$(this);
					selectThis.selecByJQ(JQ);
					return false;
				});
			}else{
				this.selectOpenDiv.on('click','ul a',function(){
					selectThis.selecByJQ($(this));
					return false;
				});
			}
		}
		this.selectOpenDiv.on('input','#searchWord',function(){
			var searchWord=$(this).val();
//			console.info(searchWord);
			selectThis.searchWord(searchWord);
		});
	};
	Newtec.MySelect.prototype.openAfter=function(){};

	Newtec.MySelect.prototype.selecByName=function(name,open){
		if(Newtec.Utils.isNull(name))return;
		var JQ=!this.defaults.showSingleIcn&&!this.multiple?this.selectOpenDiv.find('ul a[name="'+name+'"]'):this.selectOpenDiv.find("ul a label[data-key="+name+"]");
		if (this.firstOpen) {//处理由于延迟产生的bug
			var selectThis=this;
			function getJQ(count){
				if (count<4&&JQ[0]==undefined) {
					JQ=!selectThis.defaults.showSingleIcn&&!selectThis.multiple?selectThis.selectOpenDiv.find('ul a[name='+name+']'):selectThis.selectOpenDiv.find(" ul a label[data-key="+name+"]");
					setTimeout(function(){
						getJQ(count++);
					}, 200);
				}else if(JQ[0]!=undefined){
					selectThis.selecByJQ(JQ,open);
				}
			}
			getJQ(1);
		}else{
			this.scrollToChlidByJQ(JQ);
			this.selecByJQ(JQ,open);

		}
//		console.info(JQ[0]);
	};
	Newtec.MySelect.prototype.getShowValue=function(){
			var value = []
			for(key in this.values){
				value.push(this.values[key])
			}
			if(this.multiple==true){
				return value
			}else if(value.length>0){
				return value[0]
			}
		};
	/**
	 * 功能：根据JQ对象选中下拉选项
	 * @param JQ
	 * @param openz
	 */
	Newtec.MySelect.prototype.selecByJQ=function(JQ,open){
		if(JQ[0]==undefined)return;
		var value=null,name=null;
		if (!this.multiple){ 
			this.selectOpenDiv.find('ul li').removeClass("active");
			this.values={};
			name=JQ.attr('name');
			JQ.prop("checked",true);
			value=Newtec.Utils.isNull(JQ.attr('value'))?JQ.html():JQ.attr('value');
			JQ.parent().addClass("active")
		}else{
			JQ.addClass("checked")
			name=JQ.attr("data-key")
			value=JQ.attr("title")
			JQ.parent().parent().addClass("active")
		}
		open=Newtec.Utils.isNull(JQ)?false:open;
		if (!open) 
			this.close();
		this.values[name]=value;
		this.setValue('',this.values);
		if(this.setDefaultValue){
			this.onChange(JQ[0],true,value,name);
		}else{
			this.setDefaultValue=false;
			
		}
	};
	/**
	 * 功能：更加name移除选中状态
	 * @param name:移除选中状态的name选项
	 * @param open:是否显示下拉选项
	 */
	Newtec.MySelect.prototype.removeSelecByName=function(name,open){
		if(Newtec.Utils.isNull(name))return;
		var JQ=!this.defaults.showSingleIcn&&!this.multiple?this.selectOpenDiv.find('ul a[name='+name+']'):this.selectOpenDiv.find("input[name="+name+"]");
		this.removeSelecByJQ(JQ,open);
	};
	/**
	 * 功能：更加JQ对象移除选中状态
	 * @param JQ:移除选中状态的jq对象
	 * @param open:是否显示下拉选项
	 */
	Newtec.MySelect.prototype.removeSelecByJQ=function(JQ,open){
		if(Newtec.Utils.isNull(JQ[0]))return;
		open=Newtec.Utils.isNull(JQ)?false:open;
		if (!open) 
			this.close();
		var name=null;
		if(!this.multiple){
			name=JQ.attr('name');
			JQ.prop("checked",false);
			JQ.parent().removeClass("active")
		}else{
			JQ.removeClass("checked")
			name=JQ.attr("data-key")
			JQ.parent().parent().removeClass("active")
		}
		var value =this.values[name];
		delete this.values[name];
		this.setValue('',this.values);
		if(this.setDefaultValue){
			this.onChange(JQ[0],false,value,name);
		}else{
			this.setDefaultValue=false;
			
		}
//		this.onChange(JQ[0],false,value,name);
	};
	Newtec.MySelect.prototype.removeAll=function(){
		this.values={};
		var select=this.selectOpenDiv.find('li.active')
		select.removeClass("active")
		select.find('label.checked').removeClass("checked")
	};
	/**
	 * 功能：下拉列表选择改变时触发事件
	 * @param element：当前元素
	 * @param checked：选中状态
	 * @param value：当前值
	 * @param name：当前name
	 */
	Newtec.MySelect.prototype.onChange=function(element,checked,value,name){
		var changeAfterFun =this.defaults['changeAfter'];
		var changeFun=this.defaults['change'];
		var valueData=this.mapData[name]
		if(Newtec.Utils.isFunction(changeFun)){
			changeFun(this,element, checked, value,name,valueData);
		}
		if(Newtec.Utils.isFunction(changeAfterFun)){
			changeAfterFun(element, checked, value,name,valueData);
		}
	};
	/**
	 * 功能：根据name是下拉选项滚动中间位置
	 * @param name
	 */
	Newtec.MySelect.prototype.scrollToChlidByName=function(name){
		var chlidJQ;
		if(this.multiple||this.defaults.showSingleIcn){
			chlidJQ=this.selectOpenDiv.find("input[name="+name+"]").parent();
		}else{
			chlidJQ=this.selectOpenDiv.find("a[name="+name+"]");
		}
		this.scrollToChlidByJQ(chlidJQ);
	};
	Newtec.MySelect.prototype.scrollToChlidByJQ=function(JQ){
		if (JQ[0]==undefined) return;
		var container=this.selectOpenDiv.find('ul');
		var top=JQ.offset().top - container.offset().top + container.scrollTop()-this.defaults.minHeight/2;
		if(top>0)
		   container.scrollTop(top);
	};
	Newtec.MySelect.prototype.getItemA=function(key,value,checked,sort){
		if(!this.defaults.showSingleIcn&&!this.multiple){
			return '<a class="nowrap" title="'+value+'" name="'+key+'">'+value+'</a>' ;
		}
		var labelClass=this.multiple?"checkbox-inline":"radio-inline";
		var inputType=this.multiple?"checkbox":"radio";
		return '<a class="item-a"><label class="nowrap checkbox-inline '+labelClass+'" data-key="'+key+'" title="'+value+'">'
			+'<span  class="checkbox-item" > <img src="'+serverUrl+'myqdp/images/base/ok.png"/></span><span>'+value+'</span></label></a>';
	};
	Newtec.MySelect.prototype.input=function(inputFun){
		var selectThis=this;
		this.select.find(".content").on('input','input',function(){
			if(selectThis.setDefaultValue){
				return;
			}
			inputFun(this);
		});
	};
	Newtec.MySelect.prototype.focus=function(){
		this.focusing=true;
	};

	Newtec.MySelect.prototype.blur=function(blurFun){
		var selectThis=this;
		var clickFun=function(e){ 
			var target = $(e.target);
			if(!target.closest('#'+selectThis.id+"_openDiv").length&&!target.closest('#'+selectThis.id+" .select").length){ 
				if(!selectThis.focusing)return;
				if(selectThis.isOpen)
					selectThis.close();
				if(Newtec.Utils.isFunction(blurFun)&&selectThis.focusing){
					selectThis.focusing=false;
					blurFun(selectThis,this);
				}
			} 
		}
		$(document).bind("click",clickFun) ;
	};
	Newtec.MySelect.prototype.click=function(clickFun){
	    var This=this;
		this.newtecJQ.on('click',function(){
			clickFun(This,this);
		});
		this.selectOpenDiv.on('click',function(){
			clickFun(This,this);
		});
	};
	Newtec.MySelect.prototype.clickOut=function(clickOutFun){
		var selectThis=this;
		$(document).bind("click",function(e){ 
			var target = $(e.target); 
			if(!target.closest('#'+selectThis.id+"_openDiv").length&&!target.closest('#'+selectThis.id+" .select").length){ 
				if(selectThis.isOpen)
					selectThis.close();
				if(Newtec.Utils.isFunction(blurFun)){
					clickOutFun(selectThis);
				}
			} 
		}) ;
	};
//开发平台及其权限系统专用系统下拉列表
Newtec.MySelect.createAdmin=function(){
//	var data=Newtec.SessionStorage.getItem("adminAppcations_"+Newtec.Person.get().id,true);
	var param={
			name: 'applicationId',
	        title: '',
//	        value: Newtec.Person.getPowerAppId(),
	        type: 'select',
	        search:false,
	        showClearIcn:false,
	        mouseShow:true,
	        style:'border-color:transparent;',
		}
	var data=parent.Newtec.app.adminApps;
	if(Newtec.Utils.isArray(data)&&data.length>0){
		param.data=data;
		setTimeout(function(){
			myselect.setValue(Newtec.Person.getPowerAppId()||data&&data[0].id)
		}, 300)
	}else{
		param.ds={
	        	 operId:'getApplicatoinbyAdmin',
		            name: 'application',
		            startRow: -1,
		            select: ['id', 'name'],
		            sortBy: {id: 'desc', name: 'asc'},
		            callback: function (response) {
		            	var data=response.data;
		            	data=data.datas||data;
		            	parent.Newtec.app.adminApps=data;
		            	console.info("==getApplicatoinbyAdmin=data>>>",data)
//		            	Newtec.SessionStorage.setItem("adminAppcations_"+Newtec.Person.get().id,data);
		            	myselect.setValue(Newtec.Person.getPowerAppId()||data&&data[0].id)
		            }
		        };
	}
	var myselect=Newtec.MySelect.create(param);
	return myselect;
}
	Newtec.Module("MySelect")
})();