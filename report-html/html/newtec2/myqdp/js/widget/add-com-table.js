(function () {
	if(Newtec.AddComTable){
		console.error("AddComTable.js已经存在");
		return ;
	}
	var shop=Newtec.DS.create('noShop');
	var newsDs=Newtec.DS.create('news');
	Newtec.Utils.addCSS("newtec-addc-com-table.css",'myqdp/css/widget/')
    Newtec.AddComTable = function (params) {
		this.defaults={
			fields:[{title:'种类',name:'type'},{title:'考评内容',name:'content'},
			{title:'考评指标',name:'standard'},{title:'考评等级',name:'grade'},{title:'考评分值',name:'score'}],
			operBtn:true,
		}
		this.num=0;
	};
    Newtec.AddComTable.exte(Newtec.Base, 'addcomtable');
    Newtec.AddComTable.over({
    	createNewtecJQ:function(params){
    		var id=this.id;
    		var newtecJQ=$('<div id="'+id+'" class="add-com-table-div"></div>');
    		var table=$("<table class='table add-com-table' ></table>");
    		table.append(this.setHeader(params)).append(this.setBody(params))
    		newtecJQ.append(table)
    		return newtecJQ;
    	},
    	/**
    	 * 方法说明：设置表格头
    	 * @param {Object} params 主要为了获取字段详细
    	 */
    	setHeader:function(params){
    		var div="<thead class='add-com-head'><tr>";
    		var fields=params.fields;
    		var id=this.id;
    		var len=this.fLen=fields.length;
    		for(var i=0;i<len;i++){
    			var f=fields[i];
    			div +='<th class="center" id="'+id+"_h_"+f['name']+'">'+f['title']+'</th>';
    		}
    		//最后一列的操作按钮
    		var operBtn=params.operBtn
    		if(operBtn){
    			div+='<th class="center" width="65" id="'+id+'"_h_oper">操作</th>';
    		}
    		div+='</tr></thead>';
    		return this.header=$(div)
    	},
    	/**
    	 * 方法说明：设置表格体
    	 * @param {Object} params 初始化参数
    	 */
    	setBody:function(params){
    		var body=$('<tbody class="add-com-body"></tbody>')
    		var that=this;
    		var fLen=this.fLen;
    		var operBtn=params.operBtn
    		body.append(that.setBodyTr(params))
    		var idsMap=this.idsMap={};//保存已经创建的id
    		that.addNum=1;//标记行数，主要为了保证最后一行不被删除
    		//添加监听行数
    		body.on('click',">tr>td>.item>.plus",function(){
    			var td=$(this).parent();
    			var tagClass=td.attr("data");
    			td=td.parent()
    			that.addNum++;
    			if(td.attr('data-extend')=='true'){//如果是第一行，则添加tr，另起一行
    				body.append(that.setBodyTr(params))
    			}else{
    				setAddItem(td,fLen,tagClass,operBtn,idsMap)
    			}
    			if(Newtec.Utils.isFunction(params.afterFun)){
        			params.afterFun(that);
        		}
    		})
    		//删除监听函数
    		body.on('click',">tr>td>.item>.oper-btn",function(){
    			if(that.addNum==1){
    				Newtec.Window.hint("无法删除最后一行！！");
    				return;
    			}
    			that.addNum--;
    			var td=$(this).parent();
    			var tagClass=td.attr("data");
    			var removeArr=body.find('.'+tagClass);
    			td=$(removeArr[0]).parent().prev();
    			var index=fLen-removeArr.length+1;
    			removeArr.remove();
    			tagClass=tagClass.substr(0,tagClass.length-2)
	    		while(index){
	    			var itemDiv=td.find('.'+tagClass);
	    			if(itemDiv[0]){
	    				index--;
	    				var top=itemDiv.css('padding-top')
	    				top=Newtec.Utils.toInt(top,0)||8;
	    				top=top-24;
	    				top=top<8?8:top;
	    				itemDiv.css('padding',top+"px 8px")
	    				td=td.prev();
	    			}else{
	    				tagClass=getParentId(tagClass)
	    			}
	    		}
    		})
    		return this.body=body;
    	},
    	/**
    	 * 功能说明：添加tr,主要为了另起一行tr，使用场景是第一列添加时
    	 * @param {Object} params
    	 * @param {Object} values 本行的值
    	 * @param {Object} flagClass idclass
    	 */
    	setBodyTr:function(params,values,flagClass){
    		var num=this.num++;
    		var id=this.id;
    		var tr='<tr id="'+id+"_tr_"+num+'">';
    		var fields=params.fields;
    		flagClass=flagClass||"class"+Newtec.Utils.uuid(8);
    		if(values){
    			for(var i=1,len=fields.length,f=fields[0];i<=len;f=fields[i++]){
	    			var name=f.name,title=f.title;
	    			var value=values[name]
	    			tr+="<td class='t-value' data='"+name+"' "+(i==1?'data-extend="true"':"")+" data-index='"+i+"'>"+setItem(flagClass,value)+"</td>";
	    		}
    		}else{
    			for(var i=1,len=fields.length,f=fields[0];i<=len;f=fields[i++]){
	    			var name=f.name,title=f.title;
	    			tr+="<td class='t-value' data='"+name+"' "+(i==1?'data-extend="true"':"")+" data-index='"+i+"'>"+setItem(flagClass)+"</td>";
	    		}
    		}
    		
    		var operBtn=params.operBtn
    		if(operBtn){
    			tr+="<td data='operbtn'  data-index='"+i+"'>"+setItemBtn(flagClass)+"</td>";
    		}
    		tr+='</tr>';
    		return $(tr);
    	},
    	/**
    	 * 功能说明：获取表格中数据
    	 * return array<json> 根据表头的fields的name是key
    	 */
    	getData:function(){
    		var body=this.body;
    		var trs=body.find('>tr');
    		var datas=[];
    		var dataMap={};
    		trs.each(function(){//遍历所有tr
    			var tds=$(this).find(">td.t-value");
    			tds.each(function(){//遍历所有td
    				var td=$(this);
    				var name=td.attr('data');
    				var items=$(this).find('>div.item')
    				items.each(function(){ //遍历所有item
    					var jq=$(this);
    					var id=jq.attr('data');//获取行集id
    					var data=dataMap[id]
    					if(!data){
    						data={};
    						if(hasParent(id)){//判断是否有父节点
    							var parentId=getParentId(id)
    							var parentData=dataMap[parentId];
    							for (var key in parentData) {//从父节点拷贝数据
    								data[key]=parentData[key]
    							}
    						}
    						dataMap[id]=data;
    						datas.push(data)
    					}
    					data[name]=jq.find("input").val();
    					
    				})
    			})
    		})
    		return datas;
    	},
    	/**
    	 * 
    	 * @param {Object} datas 需要添加的数据
    	 * @param {Object} isAppend 是否追加到原来数据后面
    	 */
    	setData:function(datas,isAppend){
    		if(!Newtec.Utils.isArray(datas)){
    			console.error("datas为空！！");
    			return;
    		}
    		var body=this.body;
    		if(!isAppend){//判断是否追加数据
    			body.empty();
    			this.addNum=0;
    		}
    		var len=datas.length;
    		var tagName="";
    		var params=this.defaults;
    		var fields=params.fields;
    		var firsName=fields[0].name;
    		var firstTag=null;
    		var tagClass="";
    		var tds=null;
    		var fLen=fields.length;
    		var preArray=[];
    		var operBtn=params.operBtn
    		var idsMap=this.idsMap
    		for (var i=0;i<len;i++) {
    			var data=datas[i];
    			var fisrtValue=data[firsName];
    			console.info(fisrtValue,firsName)
    			this.addNum++;
    			if(fisrtValue==firstTag){//值相同，进行合并
    				for (var j=1;j<fLen;j++) {
    					var tName=fields[j].name,tValue=data[tName];
    					if(tValue==preArray[j]){//比较上行的值是否相同，相同属于合并行
    						continue;
    					}else{//如果不同，说明另起一行，后面的数据不需要再进行比较
    						console.info("====<<<<<",j)
    						tagClass=setAddItem($(tds[j]),fLen,tagClass,operBtn,idsMap,data)
    						preArray[j]=tValue;
    						//保存后面的值以方便后面比较
    						for(var k=j;k<fLen;k++){
    							preArray[k]=data[fields[k].name]
    						}
    					}
    				}
    			}else{//值不同，另起一行
    				firstTag=fisrtValue;
    				tagClass=data.id||Newtec.Utils.uuid(8);
    				tagClass="class"+tagClass;
    				var tr=this.setBodyTr(params,data,tagClass)
    				tds=tr.find(">td");
    				console.info(tds.length)
    				body.append(tr);
    			}
    		}
    	}
    	,finsh:function(params){
    		var that=this;
    		if(Newtec.Utils.isFunction(params.afterFun)){
    			params.afterFun(that);
    		}
    	}
    });
    /**
     * 方法说明：判断是否存在父亲
     * @param {Object} id
     */
    var hasParent=function(id){
    	return id.split("_").length>1
    }
     /**
     * 方法说明：获取父亲id
     * @param {Object} id
     */
    var getParentId=function(id){
    	return id.substr(0,id.length-2)
    }
    /**
     *  添加tr中的行集
     * @param {Object} tagTd 一开始点击添加的目标td
     * @param {Object} fLen 列长
     * @param {Object} tagClass 目标class，也是本行唯一id
     * @param {Object} operBtn 是否显示操作按钮
     * @param {Object} idsMap 缓存id
     */
    var setAddItem=function(tagTd,fLen,tagClass,operBtn,idsMap,values){
    		var index=Newtec.Utils.toInt(tagTd.attr('data-index'),0),fLen=fLen-index;
    		td=tagTd;
    		//处理后面节点
    		var nextClass=tagClass+"_c";
    		while(idsMap[nextClass]){
    			nextClass=nextClass+"_c";
    		}
    		idsMap[nextClass]=1;
//  		tr.append(setItem(nextClass));
			var tname=td.attr('data')
    		var tagItem=td.find('.'+tagClass);
    		if(tagItem[0]){
				tagItem.after(setItem(nextClass,values&&values[tname]||""));
			}else{
				td.append(setItem(nextClass,values&&values[tname]||""));
			}
			if(values){
				while(fLen--){
	    			td=td.next();
	    			tname=td.attr('data')
	    			var div=setItem(nextClass,values[tname]||"");
	    			tagItem=td.find('.'+tagClass);
	    			if(tagItem[0]){
	    				tagItem.after(div);
	    			}else{
	    				td.append(div);
	    			}
	    		}
			}else{
				while(fLen--){
	    			td=td.next();
	    			var div=setItem(nextClass);
	    			tagItem=td.find('.'+tagClass);
	    			if(tagItem[0]){
	    				tagItem.after(div);
	    			}else{
	    				td.append(div);
	    			}
	    		}
			}
    		
    		if(operBtn){
    			td=td.next()
    			var div=setItemBtn(nextClass);
    			tagItem=td.find('.'+tagClass);
    			if(tagItem[0]){
    				tagItem.after(div);
    			}else{
    				td.append(div);
    			}
    		}
    		//处理前面节点
    		td=tagTd;
    		index--;
    		while(index){
    			var prevJQ=td.prev();
    			var itemDiv=prevJQ.find('.'+tagClass);
    			if(itemDiv[0]){
    				index--;
    				var top=itemDiv.css('padding-top')
    				top=Newtec.Utils.toInt(top,0)||8;
    				top=top+24;
    				itemDiv.css('padding',top+"px 8px")
    				td=prevJQ;
    			}else{
    				tagClass=getParentId(tagClass)
    			}
    		}
    		return nextClass;
    	}
    var setItem=function(flagClass,value,style){
    	return "<div class='item "+flagClass+"' data='"+flagClass+"' "+(style&&"style='"+style+"'"||"")
    	+"><input type='text' maxlength='50' value='"+(value||"")+"'/><span class='plus'>+</span></div>";
    }
    var setItemBtn=function(flagClass){
    	return "<div class='item "+flagClass+"' data='"+flagClass+"'><div class='oper-btn'>删除</div></div>";
    }
    Newtec.Module("AddComTable")
})();
