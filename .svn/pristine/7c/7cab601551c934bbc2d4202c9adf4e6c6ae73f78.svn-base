/**
 * 组件：MyBpmDesign
 * 功能：流程组件，定义了流程基本操作，极度依赖于子类对象Newtec.BpmNode
 * @author 吴明坤
 */
Newtec.Component([{js:"newtec.raphaelVertor.js",src:"myqdp/js/widget/"},
{js:"bpm.node.js",src:"bpm/js/"},{js:"bpm.line.js",src:"bpm/js/"},{js:"design.select.js",src:"bpm/js/"}],
[{css:"bpm-design.css",src:"bpm/css/"}]
,function(){
	Newtec.MyBpmDesign = function (params) {
		var that=this,
		defaults=this.defaults;
		defaults.background="#fff";//背景色
		defaults.lineWidth=2;//连线宽度
		defaults.strokeStyle="#2277ee";//连线颜色
		//右键功能能
		defaults.rightMenuTitle=[
		{title:"复制",name:'copy',icon:"glyphicon glyphicon-trash"},
		{title:"黏贴",name:'paste',icon:"glyphicon glyphicon-trash"},
		{title:"删除",name:'remove',icon:"glyphicon glyphicon-trash"},
		{title:"删除连线",name:'removeLine',icon:"glyphicon glyphicon-trash"},
		{title:"连线",name:'line',icon:"glyphicon glyphicon-arrow-right"},
		{title:"信息配置",name:'setting',icon:"glyphicon glyphicon-asterisk"},
		],
		this.lineNewtecs=[]//存放连线对象
		this.nodeNewtecs=[];//存放节点对象
		this.maxDo=params.maxDo||3;//撤回数组能放入的最大的量
		this.undoArr=[];//撤回事件数组
		this.redoArr=[];//重做数组
		this.nodeFlag=1;
		defaults.headBtn=null//设计器头部的自定义按钮 [{title:'按钮名称',className:'类名',click:function点击事件,imgurl:'图标路劲'}]
		this.bodyClickEvent=[];//设计器点击身体触发事件
		this.designSelects=[];
		this.multNewtecs=[];
	};
	Newtec.MyBpmDesign.exte(Newtec.RaphaelVertor,'MyBpmDesign');
	Newtec.Utils.addJS("design-headbody.js","bpm/js/")
	Newtec.MyBpmDesign.over({
	   createNewtecAfter:function(newtecJQ){
	   		
	   		var that=this,itemsLayout=this.itemsLayout;
	   		var div=this.bpmBody=$("<div class='bpm-body'></div>");
	   		newtecJQ.prepend(div);
	   		this.setHeadBody(newtecJQ);
	   		this.setLeftBody(newtecJQ);
	   		this.setRightBody(newtecJQ);
	   		this.itemsLayout.click(function(){
	   			if(that.nodeClick)return false;
	   			that.selected()
	   			that.clearStatus(); 
	   		})
	   		setTimeout(function(){
	   			that.designSelect=Newtec.DesignSelect.create({
	   				design:that,parentDiv:that.itemsLayout,
	   				start:{x:1200,y:100},end:{x:1500,y:180}
	   			})
	   			that.designSelects.push(that.designSelect);
	   		},10)
   			
	   },
	   
	   /**
	    * 功能说明：设置左侧布局
	    * @param {Object} newtecJQ ：父布局
	    */
	   setLeftBody:function(newtecJQ){
	   		var layout=$("<div class='canvas-left'></div>"),that=this;
	   		var arr=[
	   			{name:'startNode',title:'开始节点'},
	   			{name:'bpmNode',title:'任务节点'},
	   			{name:'endNode',title:'结束节点'},
	   			{name:'node2',title:'自定义节点'},
	   		]
	   		var src="bpm/images/node/";
	   		for(var i=0,len=arr.length;i<len;i++){
	   			var data=arr[i],
	   			btn=$("<div class='org-item' title='"+data.title+"' data='"+data.name+"'><img src='"+src+data.name+".png'></div>");
	   			layout.append(btn)
	   			
	   		}
	   		layout.find('.org-item').draggable({
	   			helper:'clone',
	   			start:function(){
	   				if(that.hasStart&&$(this).attr('data')=="startNode"){
	   					Newtec.Window.hint("开始节点只能有一个！！");
	   					return false;
	   				}
	   				that.setLayoutStatus();
	   			},
//			  	appendTo:"#"+this.id+" .main-body",
			  	stop:function( event, ui ){
			  		return setNode(ui);
			  	}
			});
			//设置节点
			function setNode(ui){
				var bodyOffset=that.bodyOffset,
				jq=ui.helper,
				offset=jq.offset(),
				left=offset.left-bodyOffset.left,
				top=offset.top-bodyOffset.top,
				type=jq.attr('data'),
		  		text=jq.attr('title');
		  		var bpmNode=null;
		  		var nodeFlag=that.nodeFlag*10
		  		var redo=function(){
		  			bpmNode=that.createNode({
		  				title:text,type:type,nodeFlag:that.nodeFlag
			  		});
			  		that.setLyItem({jq:bpmNode,x:left,y:top,isCenter:false,type:"node"})
			  		bpmNode.draw();
			  		bpmNode.nodeFlag=nodeFlag;
			  		that.nodeNewtecs.push(bpmNode);
		  		}
		  		redo();
		  		that.nodeFlag++;
		  		//撤销重做操作
		  		that.setdo(redo,function(){
		  			bpmNode.remove();
		  		},function(){
		  			bpmNode=null;
		  		})
//		  		return false;
			}
	   		newtecJQ.append(layout)
	   },
	   /**
	    * 功能说明：创建节点
	    * @param {Object} param 节点参数
	    */
	   createNode:function(param){
	   		var type=_getType(param.type)
	   		funcType=Newtec.funcType[type];
    		funcType=funcType||Newtec.BpmNode;
    		if(type=="startNode")this.hasStart=true;
  			return bpmNode=funcType.create(param).setParent(this);
	   },
	   /**
	    * 功能说明：设置节点详情布局
	    * @param {Object} newtecJQ 组件最外层父类
	    */
	   setRightBody:function(newtecJQ){
	   	 	var rightDiv=$("<div class='right-menu'><p id='formTitle' class='r-menu-title'>基本信息</p></div>"),
	   	 	open=$("<div class='right-menu-icon i-open'><img src='bpm/images/close.png'/></div>"),
	   	 	close=$("<div class='right-menu-icon i-close'><img src='bpm/images/open.png'/></div>"),
	   	 	baseFields=this.baseFields(),
	   	 	that=this,
	   	 	crrForm=0;
	   	 	rightDiv.append(open)
	   	 	
	   	 	open.click(function(){
	   	 		that.showRight(false);
	   	 	})
	   	 	
	   	 	rightDiv.append(close)
	   	 	close.click(function(){
	   	 		that.showRight();
	   	 	})
	   	 	var formMap=this.formMap={};
	   	 	var formDiv=$("<div class='form-div'  ></div>")//style='height:calc(100% - 71px)'
	   	 	this.baseForm=setForm("base",baseFields,this.defaults.baseData)
	   	 	/**
	   	 	 * 功能说明：设置信息栏布局
	   	 	 * @param {Object} name 所属名称
	   	 	 * @param {Object} datas 字段信息{key:fields}
	   	 	 * @param {Object} baseData 表单数据
	   	 	 */
	   	 	function setForm(name,datas,baseData){
	   	 		var baseDiv=$("<div class='form-group-div f-acitive' id='"+name+"'></div>")
	   	 		baseData=baseData||{};
		   	 	var forms={}
		   	 	var count=0;
		   	 	for(var key in datas){
		   	 		var data=datas[key];
		   	 		var id=name+"_"+key;
		   	 		var formItem=$("<div class='form-item"+(count?"":" f-acitive")+"' data='"+name+"' data-t='"+key+"'><p class='i-title'><img src='bpm/images/new/open.png'/>"+data.title+"</p></div>")
		   	 		baseDiv.append(formItem)
		   	 		var fields=data.fields
		   	 		for(var i=0;i<fields.length;i++){
		   	 			var field=fields[i];
		   	 			if(field.name=="name"){//监听需要实时改变的属性
		   	 				field.inputFun=function(newtecObj){
		   	 					var value=newtecObj.getValue();
		   	 					if(that.selectNewtec){
		   	 						that.selectNewtec.setTitle(value);
		   	 					}
		   	 				}
		   	 			}
		   	 		}
		   	 		var form=Newtec.Form.create({
			   	 		columnNum:1,
			 			fields:fields,
			 			values:baseData[key]||baseData,
			 			
			 		})
		   	 		forms[key]=form
		   	 		formItem.append(form.newtecJQ)
		   	 		count++;
		   	 	}
		   	 	baseDiv.on("click",".form-item>.i-title>img",function(){
		   	 		baseDiv.find(".f-acitive").removeClass("f-acitive")
		   	 		$(this).parent().parent().addClass("f-acitive")
		   	 	})
		   	 	formMap[name]=forms;
		   	 	baseDiv.find(">.form-item").css("height","calc(100% - "+((count-1)*30)+"px)")
		   	 	formDiv.append(baseDiv)
		   	 	return forms;
	   	 	}
	   	 	rightDiv.append(formDiv)
	   	 	newtecJQ.append(rightDiv)
	   	 	/**
	   	 	 * 功能说明：显示或者隐藏右侧布局
	   	 	 */
	   	 	this.showRight=function(show){
	   	 		show=show===false?false:true
	   	 		show?rightDiv.addClass("n-open"):rightDiv.removeClass("n-open")
	   	 		
	   	 	}
	   	 	//设置表单数据
	   	 	this.setFormData=function(data){
	   	 		formDiv.find(">.f-acitive").removeClass("f-acitive")
				if(that.selectNewtec){
					var selectNewtec=that.selectNewtec;
					console.info("selectNewtec.type=",selectNewtec.type)
					if(selectNewtec.type=="curve"||selectNewtec.type=="straight"){
						var id="line_"+selectNewtec.id;
						if(!formMap[nodeFlag]){
					 		selectNewtec.dataForm=setForm(id,that.getLineForm(selectNewtec),selectNewtec.defaults.data);
		   	 			}else{
		   	 				formDiv.find("#"+nodeFlag).addClass("f-acitive")
		   	 			}
		   	 			rightDiv.find("#formTitle").text("连线信息")
					}else{
		   	 			var nodeFlag="node_"+selectNewtec.nodeFlag;
		   	 			if(!formMap[nodeFlag]){
					 		selectNewtec.dataForm=setForm(nodeFlag,that.getNodeForm(selectNewtec),selectNewtec.defaults.data);
		   	 			}else{
		   	 				formDiv.find("#"+nodeFlag).addClass("f-acitive")
		   	 			}
		   	 			
		   	 			rightDiv.find("#formTitle").text("节点信息")
					}
	   	 		}else{
	   	 			formDiv.find("#base").addClass("f-acitive")
	   	 			rightDiv.find("#formTitle").text("基本信息")
	   	 		}
	   	 	}
	   	 	
	   },
	   /**
	    * 功能说明：子节点拖拽开始时，父组件that.noDrag：true触发
	    */
	   startNoDarg:function(nodeNewtec,isRight){
//	   		var pos=nodeNewtec.getPosition();//获取箭头初始位置
	   		var that=this;
	   		var itemsLayout=this.itemsLayout;
	   		that.isLineing=true;
	   		that.crrNode=nodeNewtec;
	   		that.noDrag=true;
	   		var lineObj=that.crrLineObje=0;
	   		itemsLayout.on('mousemove',function(e){
	   			if(that.enterIng)return;
	   			var x=e.offsetX,y=e.offsetY;
	   			that.clearCvsClear();
	   			if(lineObj)
	   				lineObj.attr('path',that.getPathJQ2Pos(nodeNewtec,{x:x,y:y}))
	   			else{
	   				that.crrLineObje=lineObj=that.drawLineJQ2Pos(nodeNewtec,{x:x,y:y},{})
	   				
	   			}
	   			
	   		})
	   		itemsLayout.on("mouseup",function(e){
	   			itemsLayout.unbind("mousemove mouseup")
	   			lineObj.remove();
	   			if(that.enterIng){
	   				var formNode=that.crrNode,
	   				toNode=that.toNode,
	   				toId=toNode.id,
	   				formId=formNode.id,
	   				line=0;
	   				var redo=function(){//撤回
	   					that.clearCvsClear();
		   				line=that.setLine(formNode,toNode)
	   				}
	   				redo();
	   				//撤销重做操作
	   				that.setdo(redo,function(){//重做
	   					line.remove();
	   				})
	   			}
	   			if(isRight)that.noDrag=false;
	   			that.isLineing=false;
	   			that.enterIng=false;
	   		})
	   },
	   /**
	    * 功能说明：线条进入节点触发
	    * @param {Object} nodeNewtec 节点对象
	    */
	   enterLineNode:function(nodeNewtec){
	   		this.enterIng=true;
	   		this.clearCvsClear();
	   		this.toNode=nodeNewtec;
//	   		this.clearCvsClear();
	   		var arr=this.getPosByJq(this.crrNode,nodeNewtec,{isClear:true})
	   		this.crrLineObje.attr('path',this.getPath(arr[0],arr[1]))
	   },
	   /**
	    * 功能说明：线条离开节点触发
	    * @param {Object} nodeNewtec 节点对象
	    */
	   leaveLineNode:function(nodeNewtec){
	   		console.info("==leaveLineNode==");
	   		this.enterIng=false;
	   },
	   /**
	    * 功能说明：布局初始化后调用
	    */
	   drawAfter:function(){
	   		var bpmBody=this.bpmBody,
	   		body=this.body,
	   		width=bpmBody.width(),
	   		height=bpmBody.height();
	   		var min=10;
	   		for(var i=min;i<width;i+=min){
	   			bpmBody.append("<div class='h-line' style='left:"+i+"px'></div>")
	   		}
	   		console.info("===<<<",height)
	   		for(var i=min;i<height;i+=min){
	   			bpmBody.append("<div class='v-line' style='top:"+i+"px'></div>")
	   		}
	   },
	   /**
	    * 功能说明：撤回操作
	    */
	   undo:function(){
	   		console.info("=撤回====")
		   	var undoArr=this.undoArr;//撤回事件数组
		   	var len=undoArr.length;
		   	if(len>0){
		   		var dos=undoArr.splice(len-1,1)[0];
		   		dos[1]();
		   		this.redoArr.push(dos)
		   	}
	   },
	   /**
	    * 功能说明：重做操作
	    */
	   redo:function(){
	   		var redoArr=this.redoArr;//撤回事件数组
		   	var len=redoArr.length;
		   	if(len>0){
		   		var dos=redoArr.splice(len-1,1)[0];
		   		dos[0]();
		   		this.undoArr.push(dos)
		   	}
	   },
	   /**
	    * 功能说明：设置重做和撤回操作
	    * @param {Function} redo 重做操作
	    * @param {Function} undo 撤回操作
	    * @param {Function} deleteRes 置空资源，仅仅为了让垃圾回收机制回收
	    */
	   setdo:function(redo,undo,deleteRes){
	   		var undoArr=this.undoArr;//撤回事件数组
	   		var len=undoArr.length;
//	   		console.info("deleteRes==",deleteRes)
	   		undoArr.push([redo,undo,deleteRes])
	   		if(this.maxDo<=len){
	   			var dos=undoArr.splice(0,1)[0];
	   			dos[2]&&dos[2]();//销毁资源操作
	   		}
			var redoArr=this.redoArr;
			this.redoArr=[];//重做数组
			for(var i=0;i<redoArr.length;i++){
				redoArr[i][2]&&redoArr[i][2]();
			}
			redoArr=null;
	   },
	   setLine:function(formNode,toNode){
	   		var line=Newtec.BpmLine.create({toNode:toNode,formNode:formNode,parent:this,type:this.lineType})
	   		this.lineNewtecs.push(line);
	   		formNode.toLine.push(line);
		   	toNode.formLine.push(line);
		   	this.lineType="straight";
		   	return line;
	   },
	   rightMenuClick:function(name,data){
	   		
	   		if(name=="remove"){
	   			this.deleteCrr();
	   		}else if(name=='setting'){
				this.showRight();
			}else{
				var rightType=this.rightType;
				if(rightType=="node"){
	   				this.rightMenuNode(name,data)
		   		}else if(rightType=="line"){
		   			this.rightMenuLine(name,data)
		   		}else{
		   			this.rightMenuBase(name,data)
		   		}
			}
	   		
	   		
	  },
	   /**
	   * 功能说明：右键线回调
	   * @param {Object} name 名称
	   * @param {Object} data 参数
	   */
	  rightMenuBase:function(name,data){
		  	if(name=="remove"){//删除
		  		
			}else if(name=='setting'){
				this.showRight();
			}
	  },
	  /**
	   * 功能说明：右键节点回调
	   * @param {Object} name 名称
	   * @param {Object} data 参数
	   */
	  rightMenuNode:function(name,data){
	  	if(name=='line'){//连线
			this.startNoDarg(data.jq,true)
		}else if(name=="remove"){//删除
			data.jq.remove();
		}else if(name=='removeLine'){
			data.jq.clearMyLines();
		}
	 },
	  /**
	   * 功能说明：右键线回调
	   * @param {Object} name 名称
	   * @param {Object} data 参数
	   */
	  rightMenuLine:function(name,data){
	  	
	  },
	  rightMenuShowName:function(parms){
	  	var rightType=parms&&parms.type||"base";
	  	if(this.enterLines)rightType="line";
	  	this.rightType=rightType;
	  	
   		if(rightType=="node"){
   			this.selected(parms.jq);
   		}else if(rightType=="line"){
   			this.selected(this.enterLines);
   			return ['remove','setting']
   		}else{
   			this.selected(this.enterLines);
   			return ['remove','setting',"paste"]
   		}
	  	
	  },
	   /**
	     * 功能说明：画布数据清空
	     */
	    clear:function(){
		  	 this.clearCvsClear();
		  	 this.clearCvs();
		  	 var objects=this.objects;
		  	 for(var id in objects){
		  	 	var obj=objects[id].jq,
		  	 	jq=obj.newtecJQ||obj;
		  	 	jq.remove();
		  	 	obj=null;
		  	 }
		  	 this.lineNewtecs=[];
		  	 this.nodeNewtecs=[];
		  	 this.objects={};
		},
		/**
		 * 功能说明：清楚编辑区操作状态
		 */
		clearStatus:function(){
			if(this.mutleSelect){//多选
				var designSelects=this.designSelects
				for(var i=0,len=designSelects.length;i<len;i++){
					designSelects[i].show(false);
				}
			}else{
				this.designSelect.show(false);
			}
			this.mutleSelect=false;
		},
		selected:function(newtecJQ){
			if(this.selectNewtec){
	  			this.selectNewtec.selected(false);
	  		}
	  		this.selectNewtec=newtecJQ;
	  		newtecJQ&&newtecJQ.selected();
	  		this.setFormData();
		},
	   //---------------以下为可能使用到方法
	   /**
	    * 功能说明：节点设置
	    * @param {Object} data {jq:newtec}其他内容根据传入的来决定
	    */
	   nodeSetting:function(data){},
	   bodyClick:function(e){
	   		var bodyClickEvent=this.bodyClickEvent;
	   		for(var i=0,len=bodyClickEvent.length;i<len;i++){
	   			bodyClickEvent[i]&&bodyClickEvent[i]();
	   		}
	   },
	   /**
	    * 功能说明：数据添加调用
	    */
	   saveData:function(isAdd){},
	   baseFields:function(){
	   		return {"base":{fields:[
	   			{name:'name',title:'流程名称'},
	   			{name:'remark',title:'流程备注'},
	   		],title:'基本信息'}};
	   },
	   getNodeForm:function(selectNewtec){
	   		return  {"base":{fields:[
	   			{name:'name',title:'流程名称'},
	   			{name:'status',title:'状态'},
	   			{name:'remark',title:'流程备注'},
	   		],title:'基本信息'}}
	   },
	   getLineForm:function(lineNewtec){
	   		return  {"base":{fields:[
	   			{name:'name',title:'标题'},
	   		],title:'基本信息'},
	   		"condition":{fields:[
	   			{name:'condition',title:'条件内容',type:'textarea'},
	   		],title:'流向条件'}}
	   }
	});
	/**
	 * 功能说明：获取节点类型
	 * @param {Object} type
	 */
	function _getType(type){
		if(type=="开始"){
			return "startNode";
		}else if(type=="完成"){
			return "endNode";
		}else if(type=="node"){
			return "bpmNode"
		}else {
			return type;
		}
	}
});