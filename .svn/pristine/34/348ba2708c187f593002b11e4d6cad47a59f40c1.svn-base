;(function(){
	if(Newtec.AutoComplete != undefined){
		alert('按钮已经优质啦');
		return ;
	}
	

	Newtec.Utils.addCSS("jquery-ui.min.css");
	Newtec.Utils.addJS("jquery-ui.min.js");
	
	$.widget( "custom.catcomplete", $.ui.autocomplete, {
		_create: function() {
			this._super();
			this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
		},
		_renderMenu: function( ul, items ) {
			var that = this,
			currentCategory = "";
			$.each( items, function( index, item ) {
				var li;
				if ( item.category != currentCategory ) {
					ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
					currentCategory = item.category;
				}
				li = that._renderItemData( ul, item );
					if ( item.category ) {
					li.attr( "aria-label", item.category + " : " + item.label );
				}
			});
		}
	});	
	//1.
	Newtec.AutoComplete = function (params) {
		if(!Newtec.Utils.isJson(params)){//不是json格式不能创建按钮
			return ;
		}
		//2.
		this.defaults = {
				placeholder:'',
				dat:{}//格式：{"":['无分组测试1','无分组测试2'],分组一:['值11','值12','值13']};
        };
    	this.defaults = $.extend({},this.defaults,params);
	};
	//3.
	Newtec.AutoComplete.prototype = new Newtec.Base('autocomplete');
//	Newtec.Button.prototype.type='autocomplete';
	//4.
	Newtec.AutoComplete.prototype.createNewtecJQ=function(params){
		var input = "<input type='text' class='form-control' "+Newtec.Utils.getFieldAttr("placeholder",params['placeholder'])+" />";
//		var div = "<div class='col-sm-8 col-md-7'></div>";
		this.input = $(input);
//		div = $(div);
//		Newtec.Utils.append(div,input);
		/*var data = [
					{ label: "anders", category: "" },
					{ label: "andreas", category: "" },
					{ label: "antal", category: "" },
//					{ label: "annhhx10", category: "Products" },
//					{ label: "annk K12", category: "Products" },
//					{ label: "annttop C13", category: "Products" },
//					{ label: "anders andersson", category: "People" },
//					{ label: "andreas andersson", category: "People" },
//					{ label: "andreas johnson", category: "People" }
				];*/
		this.setData(params['data'])
//		return div;
		return this.input;
	};
	Newtec.AutoComplete.prototype.setData = function(data){
		if(data==undefined) return ;
		var data1 = [];
		for(var key in data){
			var value = data[key];
			if(Newtec.Utils.isArray(value)){
				var len = value.length;
				for(var i=0;i<len;i++){
					data1.push({label:value[i],category:key});
				}
			}else{
				data1.push({label:value,category:key});
			}
		}
		this.input.catcomplete({
			delay: 0,
			source: data1
		});
	}
	Newtec.AutoComplete.create = function(params){
		return new Newtec.AutoComplete(params).init();
	};
	Newtec.Module("AutoComplete")
})();