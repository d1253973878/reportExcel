(function () {
	if(Newtec.QuestionEdit){
		console.error("QuestionEdit.js已经存在");
		return ;
	}
//	Newtec.Question||Newtec.Utils.addCSS("newtec-question.css",'myqdp/css/widget/')
    Newtec.QuestionEdit = function (params) {
		this.defaults={
			sort:2,
			questiontTitle:'选项',
			multSelect:true,
			name:'',
//			data:{sort:3,name:'我是一个选择题',props:['选项','选项']}//null//['选项','选项']
		}
		this.count=0;
	};
    Newtec.QuestionEdit.exte(Newtec.Base, 'QuestionEdit');
    Newtec.QuestionEdit.over({
    	createNewtecJQ:function(params){
    		var newtecJQ=$("<div class='newtec-question'></div>");
    		var data=params.data;
    		this.sort=data&&data.sort||params.sort||1
    		var sortDiv=$("<div class='q-sort'><p id='sortValue'>"+(params.data&&params.data.sort||params.sort||1)+"</p></div>")
    		newtecJQ.append(sortDiv)
    		this.sortInput=sortDiv.find('#sortValue');
    		newtecJQ.append(this.setContentBody(params))
    		var that=this;
    		$(document).on('click',function(){
    			 that.questionBody.find('.active').removeClass("active")
    		})
    		return newtecJQ;
    	},
    	/**
    	 * 功能说明：构建组件主体
    	 * @param {Object} params
    	 */
    	setContentBody:function(params){
    		var contentDiv=$('<div class="q-content"></div>');
    		var data=params.data
    		var title=data&&data.name||(params.name||(params.multSelect&&"多选题"||"单选题"));
    		var titleDiv=$("<p class='qc-title'><input id='questionTitle' maxlength='120' type='text' value='"+title+"'/></p>");
    		contentDiv.append(titleDiv)
    		contentDiv.append(this.setQuestionBody(params));
    		contentDiv.append(this.setQuestionFooter(params))
    		this.titleJQ=titleDiv.find('#questionTitle')
    		return contentDiv;
    	},
    	/**
    	 * 功能说明：构建问题内容主体
    	 * @param {Object} params
    	 */
    	setQuestionBody:function(params){
    		var div=$("<div class='qc-question'></div>");
    		var multSelect=params.multSelect;
    		var data=params.data;
    		var len=4;
    		if(data&&Newtec.Utils.isArray(data.props)&&data.props.length>0){
    			datas=data.props
    			for (var i=0,len=datas.length;i<len;i++) {
	    			div.append(_setQuestionItem(datas[i],multSelect));
	    		}
    		}else{
    			var questiontTitle=params.questiontTitle||"";
    			for (var i=0;i<len;i++) {
	    			div.append(_setQuestionItem(questiontTitle+" "+(i+1),multSelect));
	    		}
    		}
    		div.on('click','.item',function(){
				div.find('.active').removeClass("active")
				$(this).addClass('active')
				return false;
			})
			div.on('click','.glyphicon-trash',function(){
				$(this).parent().parent().remove();
			})
    		this.count=len;
    		this.len=len;
    		return this.questionBody=div;
    	},
    	/**
    	 * 功能说明：设置组件的底部
    	 * @param {Object} params
    	 */
    	setQuestionFooter:function(params){
    		var questionBody=this.questionBody;
    		var div=$("<div class='qc-footer'><label id='addBtn'><i class='glyphicon glyphicon-plus'/>添加选项</label></div>");
    		var that=this;
    		if(Newtec.Utils.isFunction(params.deleteFun)){
    			div.append("<label id='removeBtn'><i class='glyphicon glyphicon-trash'/>删除题目</label>");
    			div.on("click",'#removeBtn',function(){
	    			params.deleteFun(params)||that.newtecJQ.remove();
	    		})
    		}
    		var questiontTitle=params.questiontTitle||"";
    		var multSelect=params.multSelect
    		var len=this.len
    		div.on("click",'#addBtn',function(){
    			that.count++
    			if(that.count>20){
    				Newtec.Window.hint("选项不可超过20条！");
    				return;
    			}
    			len++;
    			questionBody.append(_setQuestionItem(questiontTitle+" "+len,multSelect))
    		})
    		return div;
    	},
    	/**
    	 * 功能说明：获取组件数据 
    	 * return data {name:名称,sort:序号,type:题目类型,props:题目选项}
    	 */
    	getData:function(){
    		var title=this.titleJQ.val();
    		title=title&&title.trim()||"";
    		var defaults=this.defaults;
    		var data=defaults.data||{};
    		data.name=title;
    		data.type=defaults.multSelect&&"多选"||"单选";
    		
    		data.sort=defaults.sort||1
    		var arr=[]
    		this.questionBody.find('.input-value').each(function(){
    			var value=$(this).val();
    			value=value&&value.trim()||"";
    			arr.push(value)
    		})
    		data.props=arr;
    		return data
    	},
    	/**
    	 * 功能说明：设置题目序号
    	 * @param {Object} sort
    	 */
    	setSort:function(sort){
    		this.defaults.sort=sort;
    		this.sortInput.text(sort)
    	}
    	
    });
	function _setQuestionItem(data,multSelect){
		console.info(data);
		return '<div class="'+(multSelect?"checkbox":'radio')+' item"><label><input disabled name="optionsRadios" class="i-check" type="'+(multSelect?"checkbox":'radio')+'" value="">'+
			'<input class="input-value" maxlength="80"  type="text" value="'+(data.value||data.name||data||"")+'"/><i class="glyphicon glyphicon-trash"></label></div>';
	}
	Newtec.Module("QuestionEdit")
})();
