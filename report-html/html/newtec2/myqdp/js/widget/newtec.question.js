(function () {
	if(Newtec.Question){
		console.error("AddComTable.js已经存在");
		return ;
	}
//	Newtec.Question||Newtec.Utils.addCSS("newtec-question.css",'myqdp/css/widget/')
    Newtec.Question = function (params) {
		this.defaults={
			sort:2,
			questiontTitle:'选项',
			multSelect:true,
			name:'',
			isEdit:false
//			data:{sort:3,name:'我是一个选择题',props:['选项','选项']}//null//['选项','选项']
		}
	};
    Newtec.Question.exte(Newtec.Base, 'question');
    Newtec.Question.over({
    	createNewtecJQ:function(params){
    		var newtecJQ=$("<div class='newtec-question'></div>");
    		var data=params.data;
    		this.sort=data&&data.sort||params.sort||1
    		var sortDiv=$("<div class='q-sort'><p id='sortValue'>"+(params.data&&params.data.sort||params.sort||1)+"</p></div>")
    		newtecJQ.append(sortDiv)
    		this.sortInput=sortDiv.find('#sortValue');
    		newtecJQ.append(this.setContentBody(params))
    		var that=this;
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
    		var html="<p class='qc-title'>";
    		html+=title;
    		html+="</p>";
    		var titleDiv=$("<p class='qc-title'>"+title+"</p>");
    		contentDiv.append(titleDiv)
    		contentDiv.append(this.setQuestionBody(params));
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
    		var id=this.id;
    		console.info("=====MMMMM",data)
    		if(data&&Newtec.Utils.isArray(data.props)&&data.props.length>0){
    			datas=data.props
    			for (var i=0,len=datas.length;i<len;i++) {
	    			div.append(_setQuestionItem(datas[i],multSelect,id));
	    		}
    		}
    		this.len=len;
    		return this.questionBody=div;
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
    		data.sort=defaults.sort||1
    		var arr=[]
    		this.questionBody.find('input:checked').each(function(){
    			var value=$(this).attr("id");
    			value=value&&value.trim()||"";
    			arr.push(value)
    		})
    		data.props=arr;
    		return data
    	},
    	
    });
	function _setQuestionItem(data,multSelect,id){
		return '<div class="'+(multSelect?"checkbox":'radio')+' item"><label><input id="'+data.id+'" name="'+id+'"  type="'+(multSelect?"checkbox":'radio')+'" value="">'+
			(data.value||data.name||data||"")+'</label></div>';
	}
	Newtec.Module("Question")
})();
