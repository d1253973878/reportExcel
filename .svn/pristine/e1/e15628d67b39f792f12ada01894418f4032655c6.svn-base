/**
 * 组件：BpmNode
 * 功能：流程节点，定义了三种流程节点，极度依赖于父类对象Newtec.MyBpmDesign
 * @author 吴明坤
 */
(function(){
	Newtec.BpmNode = function (params) {
		this.defaults={
			title:'标题',
			type:'',//节点类型，start:开始节点,task：任务节点,end：结束节点
			top:'',//初始位置top
			left:'',//初始位置left
			data:null,//节点携带的数据
			model:2,//1:默认样式，2：图标样式
		}
		this.toLine=[];//向其他节点连线
		this.formLine=[];//其他节点向他连线
		this.defaults.data=this.defaults.data||{name:this.defaults.title}
		
	};
	Newtec.BpmNode.exte(Newtec.Base,'bpmNode');
	Newtec.BpmNode.over({
	  createNewtecJQ:function(params){
	  	this.isModel2=params.model==2;
	  	var propeties=params.propeties=this.propeties=params.data.propeties||{};
	  	var style="";
	  	console.info("propeties=",propeties)
	  	if(propeties.width){
	  		this.changeWidth=true;
	  		style="width:"+propeties.width+"px;height:"+propeties.height+"px";
	  	}
	  	var nodeJQ=$("<div class='node-item "+(this.isModel2?"model2":"model1")+(this.changeWidth?"":" n-nowrap")+"' style='"+style+"'></div>");
	  	var menuDiv=$("<div class='node-menu'></div>");
	  	nodeJQ.append(menuDiv)
	  	var mdoelPlay1=this.getModelPlay1(params,nodeJQ)
	  	nodeJQ.append(mdoelPlay1);
	  	var mdoelPlay2=this.getModelPlay2(params,nodeJQ);
	  	nodeJQ.append(mdoelPlay2);
  		return nodeJQ;
	  },
	  setTitle:function(title){
	  	this.newtecJQ.find("p").html(title)
	  	if(this.isModel2){
	  		this.setModel2width()
	  	}else{
	  		this.setModel1width();
	  	}
	  },
	  /**
	   * 功能说明：获取标题布局
	   * @param {Object} title 标题
	   */
	   getTitleDiv:function(title){
	  	return "<p class='node-title'>"+title+"</p>";
	  },
	  /**
	   * 功能说明：节点模式转换
	   */
	  changeModel:function(){
	  	this.isModel2=!this.isModel2;
	  	var newtecJQ=this.newtecJQ;
	  	if(this.isModel2){
	  		newtecJQ.css("width","")
	  		newtecJQ.removeClass("model1").addClass("model2")
	  	}else{
	  		newtecJQ.removeClass("model2").addClass("model1")
	  		this.setModel1width();
	  	}
	  },
	  /**
	   * 功能说明：获取模式一布局
	   * @param {Object} params  自定义参数
	   * @param {Object} nodeJQ  newtecJQ组件本身
	   */
	  getModelPlay1:function(params,nodeJQ){
	  	var body=$("<div class='node-body model-play1'>"+this.getTitleDiv(params.title)+"</div>");
	  	var pJQ=body.find('p')
	  	body.on('dblclick',function(){
	  		var title=pJQ.text();
	  		var width=nodeJQ.width()-10;
	  		var input=$("<input type='text' value='"+title+"' style='width:"+width+"px'/>");
	  		pJQ.html(input)
	  		input.on('blur',function(){
	  			var text=input.val();
	  			if(Newtec.Utils.isNull(input))return;
	  			input.remove();
	  			pJQ.text(text);
	  			setWidht();
	  		})
	  	})
	  	var that=this;
	  	function setWidht(){
	  		if(that.changeWidth)return;
	  		nodeJQ.css('width',pJQ.outerWidth()+10)
	  	}
	  	this.setModel1width=setWidht;
	  	if(!this.isModel2)
		  	setTimeout(function(){//不是很严谨
		  		setWidht();
		  	},10)
	  	return body;
	  },
	  /**
	   * 功能说明：获取节点图片
	   */
	  getImageName:function(){
	  		return this.defaults.imageUrl||"big-node.png";
	  },
	   /**
	   * 功能说明：获取模式二布局
	   * @param {Object} params  自定义参数
	   * @param {Object} nodeJQ  newtecJQ组件本身
	   */
	  getModelPlay2:function(params,nodeJQ){
	  	var body=$("<div class='node-body model-play2'>"+
	  	"<img src='bpm/images/node/"+this.getImageName()+"'/>"+
	  	this.getTitleDiv(params.title)+"</div>");
	  	var pJQ=body.find('p')
	  	var inputW=120,pWidth=0,that=this;
	  	pJQ.on('dblclick',function(){
	  		var parent=that.parent;
	  		var title=pJQ.text();
	  		var input=$("<input type='text' value='"+title+"' style='width:"+inputW+"px'/>");
	  		pWidth=pWidth||body.outerWidth();
	  		pJQ.css('left',(pWidth-inputW)/2)
	  		pJQ.html(input)
	  		input.on('blur',blur)
	  		function blur(){
	  			var text=input.val();
	  			if(Newtec.Utils.isNull(input))return;
	  			input.remove();
	  			pJQ.text(text);
	  			setWidht();
	  			input=null;
	  			parent.bodyClickEvent.remove(blur);
	  		}
	  		parent.bodyClickEvent.push(blur);
	  	})
	  	function setWidht(){
	  		var pw=pJQ.outerWidth()
	  		pWidth=pWidth||body.outerWidth();
	  		pJQ.css('left',(pWidth-pw)/2)
	  	}
	  	this.setModel2width=setWidht;
	  	setTimeout(function(){//不是很严谨
	  		setWidht();
	  	},10)
	  	return body;
	  },
	  /**
	   * 功能说明：为了设置Newtec.MyBpmDesign
	   * @param {Object} parent Newtec.MyBpmDesign
	   */
	  setParent:function(parent){
	  	this.parent=parent;
	  	return this;
	  },
	  /**
	   * 功能说明：获取propeties属性
	   */
	  getPropeties:function(){
	  	var pos=this.getPosition()
	  	var propeties=this.propeties;
	  	propeties.positionX=pos.left;
	  	propeties.positionY=pos.top;
	  	return propeties;
	  },
	  /**
	   * 功能说明：重新构建节点位置，宽，高
	   * @param {Object} pos 节点位置
	   * @param {Object} width 宽
	   * @param {Object} height 高
	   */
	   reDraw:function(pos,width,height){
	   	this.newtecJQ.removeClass("n-nowrap")
	  	this.newtecJQ.css({left:pos.left,top:pos.top,width:width,height:height});
	  	this.reLine();
	  	this.changeWidth=true;
	  	this.propeties={width:width,height:height,positionX:pos.left,positionY:pos.top}
	  },
	  /**
	   * 功能说明：获取布局初始，保证在该节点已经添加到dom在调用
	   */
	  draw:function(){
	  	this.width=this.newtecJQ.outerWidth();
	  	this.heigth=this.newtecJQ.outerHeight();
	  },
	  /**
	   * 功能说明：获取布局中心节点
	   */
	  getPosition:function(isCenter){
	  	var newtecJQ=this.newtecJQ,offset=newtecJQ.offset(),bodyOffSet=this.parent.bodyOffset,
	  	top=offset.top-bodyOffSet.top,
	  	left=offset.left+this.width/2-bodyOffSet.left;
	  	if(isCenter){
	  		top+=this.heigth/2;
	  		left+=this.width/2;
	  	}
	  	return {left:left,top:top}
	  },
	  setPosition:function(left,top){
	  	this.propeties={positionX:left,positionY:top}
	  	this.newtecJQ.css({left:left,top:top})
	  	this.reLine();
	  },
	  /**
	   * 功能说明：节点删除
	   */
	  remove:function(){
	  	var that=this,
	  	parent=that.parent,
	  	id=this.id;
	  	delete parent.objects[id];//清除父类数据中保存的对象
	  	this.clearMyLines();
	  	parent.nodeNewtecs.remove(this)
	  	this.newtecJQ.remove();	
	  	if(this.type=="startNode")parent.hasStart=false;
	  },
	  /**
	   * 功能说明：清除与本节点连接的线
	   */
	  clearMyLines:function(){
	  	var toLine=this.toLine,
	  	formLine=this.formLine;
	  	if(toLine){
			for(var i=0,len=toLine.length;i<len;i++){
				toLine[i].remove();
			}
		}
		if(formLine){
			for(var i=0,len=formLine.length;i<len;i++){
				formLine[i].remove();
			}
		}
		this.toLine=[];
		this.formLine=[];
	  },
	  /**
	   * 功能说明：线重画功能
	   */
	  reLine:function(){
	  	var toLine=this.toLine,
	  	formLine=this.formLine;
	  	if(toLine){
			for(var i=0,len=toLine.length;i<len;i++){
				toLine[i].reDraw();
			}
		}
		if(formLine){
			for(var i=0,len=formLine.length;i<len;i++){
				formLine[i].reDraw();
			}
		}
	  },
	  /**
	   * 功能说明：布局克隆
	   */
	  cloneNewtecJQ:function(){
	  	var jq=$(this.newtecJQ.prop("outerHTML"))
	  	jq.addClass('n-clone')
	  	return jq;
	  },
	  /**
	   * 功能说明：布局构建完成调用
	   * @param {Object} params 用户自定义参数
	   */
	  finsh:function(params){
	  	var that=this,
	  	newtecJQ=this.newtecJQ,
	  	toLine=this.toLine,
	  	formLine=this.formLine,
	  	parent=null,
	  	toNodes=null,
	  	formNodes=null,
	  	mutleSelect=0,
	  	multNewtecs=0,
	  	hasLine=false;
	  	//节点拖拽
	  	this.newtecJQ.draggable({
	  		helper:function(){
	  			return that.cloneNewtecJQ();
	  		},
	  		start:function(){//拖拽开始
	  			parent=parent||that.parent;
	  			if(parent.noDrag){//禁止节点拖拽
	  				parent.startNoDarg(that);
	  				return false;
	  			}
	  			//判断自身是否带有连线
	  			if(toLine.length>0||formLine.length>0){
	  				hasLine=true;
	  			}else{
	  				hasLine=false;
	  			}
	  			mutleSelect=parent.mutleSelect;
	  			if(mutleSelect){//判断是否为多选操作
	  				var newtecs=parent.multNewtecs;
	  				multNewtecs=[];
	  				for(var i=0,len=newtecs.length;i<len;i++){
	  					var node=newtecs[i];
	  					if(node==that)continue;
	  					var jq=node.cloneNewtecJQ();
	  					parent.itemsLayout.append(jq)
	  					multNewtecs.push([node,node.getPosition(false),jq])
	  				}
	  			}
	  			that.selected(false);
	  		},
	  		drag:function(event, ui){//拖拽过程中，拖拽过程中需要将线
	  			if(mutleSelect){//多选操作
	  				var originalPosition=ui.originalPosition,
	  				position=ui.position,
	  				cLeft=position.left-originalPosition.left,
	  				cTop=position.top-originalPosition.top;
	  				for(var i=0,len=multNewtecs.length;i<len;i++){
	  					var arr=multNewtecs[i],newtecJQ=arr[2],
	  					orp=arr[1];
	  					newtecJQ.css({left:orp.left+cLeft,top:orp.top+cTop})
	  				}
	  			}
//	  			
//	  			if(!hasLine)return;
//	  			that.reLine()
	  		},
	  		stop:function( event, ui ){//拖拽结束
	  			var position=ui.position,
	  			originalPosition=ui.originalPosition;
	  			var redo=function(){//重做
   					that.setPosition(position.left,position.top)
   					if(mutleSelect){
		  				var cLeft=position.left-originalPosition.left,
		  				cTop=position.top-originalPosition.top;
		  				for(var i=0,len=multNewtecs.length;i<len;i++){
		  					var arr=multNewtecs[i],node=arr[0],
		  					orp=arr[1];
		  					arr[2].remove();
		  					node.setPosition(orp.left+cLeft,orp.top+cTop)
		  					
		  				}
		  			}
   					that.selected(true);
   				}
   				redo();
   				//撤销重做操作
   				parent.setdo(redo,function(){//撤回
   					that.setPosition(originalPosition.left,originalPosition.top)
   					if(mutleSelect){
		  				for(var i=0,len=multNewtecs.length;i<len;i++){
		  					var arr=multNewtecs[i],node=arr[0],
		  					orp=arr[1];
		  					node.setPosition(orp.left,orp.top)
		  					
		  				}
		  			}
   					that.selected(true);
   				})
   				
			}
	  	})
	  	newtecJQ.on("mouseenter",function(){//进入节点
	  		if(that.parent.isLineing){//正在连线状态
  				that.parent.enterLineNode(that);
  				return ;
	  		}
	  	})
	  	newtecJQ.on("mousemove",function(){//进入节点
	  		if(that.parent.isLineing){//正在连线状态
  				return false;
	  		}
	  		
	  	})
	  	newtecJQ.on("mouseleave",function(){//离开节点
	  		if(that.parent.isLineing){//正在连线状态
  				that.parent.leaveLineNode(that);
  				return ;
	  		}
	  	})
	  	newtecJQ.on("mousedown",function(){//进入节点
	  		return false;
	  	})
	  	newtecJQ.click(function(){
	  		that.parent.nodeClick=true;
	  		that.parent.selected(that);
	  		setTimeout(function(){
	  			that.parent.nodeClick=false;
	  		},0)
	  		return false;
	  	})
	  },
	  selected:function(isSelect){
	  		isSelect=isSelect===false?false:true;
	  		this.parent.clearStatus();
//	  		isSelect&&this.newtecJQ.addClass("selected")||this.newtecJQ.removeClass("selected");
			if(isSelect)this.parent.designSelect.selectJQ(this)
			else this.parent.designSelect.show(false);
			
	  },
	});
	/**
	 * 开始节点
	 * @param {Object} params 自定义参数
	 */
	Newtec.StartNode = function (params) {};
	Newtec.StartNode.exte(Newtec.BpmNode,'startNode');
	Newtec.StartNode.over({
	  getImageName:function(){
	  		return "big-start.png";
	  }
	});
	/**
	 * 结束节点
	 * @param {Object} params 自定义参数
	 */
	Newtec.EndNode = function (params) {};
	Newtec.EndNode.exte(Newtec.BpmNode,'endNode');
	Newtec.EndNode.over({
	  getImageName:function(){
	  		return "big-end.png";
	  }
	});
})();