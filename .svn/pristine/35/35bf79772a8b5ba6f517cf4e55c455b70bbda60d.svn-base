;(function(){
	/**
	 * 快速查询控件
	 * @param params
	 * @returns {Newtec.SimpleSearchInput}
	 */
	Newtec.SimpleSearchInput = function(params){
		this.defaults = {
			id:'simpleSearchInput',//可以改变控件默认ID，避免id重复问题
			appendTo : '',
			width : 316,
			height : 31,
			dsName : '',
			operId : '',
			searchFields : {//配置后台查询字段,以下是支持的数据匹配类型
				contains : '',// like '%%'
				equals : '',	// =
				notEqual : '',	//!=
				greaterThan : '',//>
				lessThan : '',//<
				greaterOrEqual : '',//>=
				lessOrEqual :'',//<=
				notContains : ''// not like'%%'
			},
			iconSrc : 'myqdp/images/bpm/searchLayout.png',//查询按钮的图标
			placeHolder : '',
			callback:function(res){//查询回调方法，可重写
				
			}
		};
		$.extend(true,this.defaults,params);
	};
	
	Newtec.SimpleSearchInput.prototype = new Newtec.Base("simpleSearchInput");
	
	Newtec.SimpleSearchInput.prototype.createNewtecJQ = function(params){
		var config = this.defaults;
		
		var inputWidth = config.width+'px';
		var inputHeight = config.height+'px';
		var itemWidth = (config.width+52)+'px';
		var itemHeight = (config.height+6)+'px';
		var iconSrc = config.iconSrc;
		var imgLeft = (config.width+8)+'px';
		
		var id = config.id;
		var placeHolder = config.placeHolder;
		
		var inputItem = $('<div class="searchLayout" style="width:'+itemWidth+';height:'+itemHeight+'"><input id="'+id+'" class="searchLayoutTextHint" style="width:'+inputWidth+';height:'+inputHeight+'" placeholder="'+placeHolder+'"></input></div>');
		var iconItem = $('<div style="left:'+imgLeft+';position:relative;top:-25px;cursor:pointer;z-index:204788;width:21px;height:21px"><img src="'+iconSrc+'" width="21px" height="21px"></img></div>');
		var newtecJQ;
		if(Newtec.Utils.isNull(config.appendTo)){
			newtecJQ = $("<div></div>");
		}else{
			newtecJQ = $(config.appendTo);
		}
		
		newtecJQ.attr('class','normal');
		inputItem.append(iconItem);
		newtecJQ.append(inputItem);
		
		//newtecJQ.append(iconItem);
		iconItem.on('click',function(){
			var inputId = '#'+id;
			var val = $(inputId).val();
			var data = config.searchFields;
			var callBackFun = config.callback;
			try{
				if(!Newtec.Utils.isFunction(callBackFun)){
					throw new Error('回调函数必须是function');
				}
			}catch(e){
				console.log(e);
			}
			data['value'] = val;
			var dsName = config.dsName;
			var operId = config.operId;
			Newtec.DS.get(dsName).fetchData({
				operId:operId,
				data:data,
				callback:function(res){
					callBackFun(res);
				}
			});	
		});
		return newtecJQ;
	};
	
	Newtec.SimpleSearchInput.create = function(params){
		return new Newtec.SimpleSearchInput(params).init();
	};
	Newtec.Module("SimpleSearchInput")
})();