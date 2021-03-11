(function () {
	/**
	 * 
	 * @author: 吴明坤   
	 * @date: 2019年3月28日 下午3:33:31 
	 * @Description
	 * 调查问卷组件
	 */
	if(Newtec.QuestionBook){
		console.error("newtec.questionBook.js已经存在");
		return ;
	}
	Newtec.Question||Newtec.Utils.addCSS("newtec-question.css",'myqdp/css/widget/')
	Newtec.Utils.addJS("newtec.question.js",'myqdp/js/widget/')
	Newtec.Utils.addJS("newtec.questionEdit.js",'myqdp/js/widget/')
    Newtec.QuestionBook = function (params) {
		this.defaults={
			title:'标题',
			isEdit:true
		}
		this.datas=[];
		this.sort=0;
	};
    Newtec.QuestionBook.exte(Newtec.Base, 'questionbook');
    Newtec.QuestionBook.over({
    	createNewtecJQ:function(params){
    		var title=params.title
    		var isEdit=params.isEdit;
    		var newtecJQ=$("<div class='newtec-questionbook'></div>");
    		var titleDiv=$("<p class='book-title'>"+(isEdit&&"<input maxlength='100' type='text' value='"+title+"'>"||title)+"</p>")
    		newtecJQ.append(titleDiv)
    		if(isEdit){
    			var opearDiv=$('<div class="book-opear"><label class="pull-right singleBtn"><i class="glyphicon glyphicon-plus"/>添加单选</label><label class="pull-right multBtn"><i class="glyphicon glyphicon-plus"/>添加多选</label></div>')
	    		newtecJQ.append(opearDiv)
	    		var that=this;
	    		opearDiv.on('click','label.singleBtn',function(){
	    			var question=Newtec.QuestionEdit.create({sort:that.sort=++that.sort,multSelect:false,
	    				deleteFun:function(params){
	        			console.log("====<<<",params)
	        			return that.removeData(params);
	        		}});
	    			that.body.append(question.newtecJQ);
	    			that.datas.push(question)
	    		});
	    		opearDiv.on('click','label.multBtn',function(){
	    			var question=Newtec.QuestionEdit.create({sort:that.sort=++that.sort,multSelect:true,
	    				deleteFun:function(params){
	        			console.log("====<<<",params)
	        			return that.removeData(params);
	        		}});
	    			that.body.append(question.newtecJQ);
	    			that.datas.push(question)
	    		});
    		}
    		newtecJQ.append(this.setBody(params))
    		this.titleInput=titleDiv.find("input");
    		return newtecJQ;
    	},
    	/**
    	 * 调查问卷body
    	 * @param {Object} params
    	 */
    	setBody:function(params){
    		var body=$('<div class="book-body"></div>');
    		return this.body=body;
    	},
    	/**
    	 * 设置调查问卷数据
    	 * @param {Object} datas
    	 */
        setData:function(datas){
        	if(!Newtec.Utils.isArray(datas)||datas.length<=0)return;
        	var that=this;
        	var defaults=this.defaults;
        	var isEdit=defaults.isEdit
        	if(isEdit){
        		for (var i=0,len=datas.length;i<len;i++) {
	        		var data=datas[i];
	        		var question=Newtec.QuestionEdit.create({sort:i+1,data:data,multSelect:data.type=="多选"||data.type=='checkbox',
	        		deleteFun:function(params){
	        			console.log("====<<<",params)
	        			return that.removeData(params);
	        		}});
	        		this.body.append(question.newtecJQ);
	        		this.datas.push(question)
	        	}
        	}else{
        		for (var i=0,len=datas.length;i<len;i++) {
	        		var data=datas[i];
	        		var question=Newtec.Question.create({sort:i+1,data:data,multSelect:data.type=="多选",
	        		deleteFun:function(params){
	        			console.log("====<<<",params)
	        			return that.removeData(params);
	        		}});
	        		this.body.append(question.newtecJQ);
	        		this.datas.push(question)
	        	}
        	}
        	
        	this.sort=len;
        },
        removeData:function(params){
    		var sort=params.sort;
    		var datas=this.datas;
    		var len=datas.length;
    		if(len<=1){
    			Newtec.Window.hint("最后一道题目无法删除！");
    			return true;
    		}
    		
    		for(var i=sort;i<len;i++){
    			var newtecJQ=datas[i]
    			newtecJQ.setSort(i)
    			datas[i-1]=newtecJQ;
    		}
    		datas.length=len-1;
    		this.sort--;
    		console.info("removeData====",datas)
    		return false;
    	},
        getData:function(){
        	var name=this.titleInput.val();
        	var data={name:name&&name.trim()||""};
        	var datas=this.datas;
        	var nodes=[]
        	for (var i=0,len=datas.length;i<len;i++) {
        		var newtec=datas[i]
        		nodes.push(newtec.getData());
        	}
        	data.nodes=nodes;
        	return data;
        },
    });
    Newtec.Module("QuestionBook")
})();
