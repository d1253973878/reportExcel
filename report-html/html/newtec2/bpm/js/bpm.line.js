/**
 * 组件：BpmLine
 * 功能：流程节点，定义了流程线，极度依赖于父类对象Newtec.MyBpmDesign
 * @author 吴明坤
 */
(function(){
	Newtec.BpmLine = function (params) {
		this.toNode=params.toNode;
		this.formNode=params.formNode;
		this.parent=params.parent;
		delete params.toNode;
		delete params.formNode;
		delete params.parent;
		this.defaults={
			top:'',//初始位置top
			left:'',//初始位置left
			width:6,
			"arrow-end":"classic-wide-long",
			"stroke-width": 2,
			selectStroke:'#cb6225',
			stroke:"#2277ee",
			type:'straight' //curve
		}
		this.nodes={};//线上的点数组
		var propeties=this.propeties=params.propeties=params.propeties||{};
		this.rigOps=this.parent.getPosByJq(this.formNode,this.toNode)
		this.isChange=!Newtec.Utils.isNull(propeties.midNodes);
		var width=this.defaults.width||8;
		this.r=width/2;
		if(!this.isChange){
			this.arrPos=[_getMindelPos(this.rigOps[0],this.rigOps[1],this.r)]
		}else{
			var pos=propeties.midNodes.split(";"),
			arr=[];
			for(var i=0;i<pos.length;i++){
				var p=pos[i].split(",");
				arr.push({x:Newtec.Utils.toInt(p[0]),y:Newtec.Utils.toInt(p[1])})
			}
			this.arrPos=arr;
		}
		console.info("arr==",arr)
		this.isSelect=false;
	};
	Newtec.BpmLine.exte(Newtec.Base,'BpmLine');
	Newtec.BpmLine.over({
	  createNewtecJQ:function(params){
	  	this.type=this.defaults.type;
	  	var rigOps=this.rigOps,
	  	width=params.width,
	  	parent=this.parent;
	  	
	  	var newtecJQ=0,
	  	arrPos=this.arrPos,
	  	arrJQ=[]
	  	for(var i=0;i<arrPos.length;i++){
	  		var midP=arrPos[i];
	  		newtecJQ=this.getPosJq(midP.x,midP.y,width,i);
	  		arrJQ.push(newtecJQ);
	  		parent.setLyItem({jq:newtecJQ,x:midP.x,y:midP.y,type:'line'});
	  	}
	  	this.arrJQ=arrJQ;
  		return newtecJQ;
	  },
	  /**
	   * 功能说明：获取propeties属性
	   */
	  getPropeties:function(){
	  	var propeties={},arrPos=this.arrPos,midNodes="";
	  	if(arrPos.length>0){
		  	for(var i=0;i<arrPos.length;i++){
		  		var ap=arrPos[i];
		  		midNodes+=(i==0?"":";")+ap.x+","+ap.y;
		  	}
		  	propeties.midNodes=midNodes;
	  	}
	  	
	  	return propeties;
	  },
	  /**
	   * 功能说明：获取点jq
	   * return jq 点对象
	   */
	  getPosJq:function(left,top,width,index){
	  	var jq=$("<div class='bpm-line "+(isNaN(index)?"temp":"")+"' style='diplay:none;width:"+width+"px;height:"+width+"px;left:"+left+"px;top:"+top+"px;' data='"+index+"'></div>");
	  	width=width/2;
	  	var that=this,
	  	parent=this.parent,
	  	rigOps=0,
	  	lineNewtecs=this.parent.lineNewtecs;
	 	
	  	jq.draggable({
	  		start:function(){//线上红点拖拽开始
	  			 that.isChange=true;
	  			 var jq=$(this),index=jq.attr("data");
	  			if(index.indexOf("_")>=0){
	  				index=index.split("_");
	  				if(index[1]==0){//前面点
	  					index=Newtec.Utils.toInt(index[0],0)
	  				}else{
	  					index=Newtec.Utils.toInt(index[0],1)+1
	  				}
	  				var arrPos=that.arrPos
	  				arrPos.push({});
	  				for(var i=arrPos.length-1;i>=index+1;i--){
	  					arrPos[i]=arrPos[i-1];
	  				}
	  				jq.attr("data",index)
	  				jq.removeClass("temp")
	  			}
	  			var arrJQ=that.arrJQ;
	  			for(var i=0,len=arrJQ.length;i<len;i++){
	  				if(arrJQ[i].hasClass("temp"))arrJQ[i].css("display","none")
	  			}
	  		},
	  		drag:function(){//拖拽过程
	  			var jq=$(this),index=jq.attr("data");
	  			var left=Newtec.Utils.toInt(jq.css("left"),0)+width,
	  			top=Newtec.Utils.toInt(jq.css("top"),0)+width;
	  			that.arrPos[index]={x:left,y:top}
	  			that.reDraw(true);
	  		},
	  		stop:function(){//拖拽结束
	  			var jq=$(this),index=jq.attr("data");
	  			var left=Newtec.Utils.toInt(jq.css("left"),0)+width,
	  			top=Newtec.Utils.toInt(jq.css("top"),0)+width;
	  			that.arrPos[index]={x:left,y:top}
	  			that.reDraw();
	  		}
	  	})
	  	jq.mouseover(function(){
  			that.move(true);
  			return false;
  		})
  		jq.mouseout(function(){
  			that.move(false);
  			return false;
  		})
  		jq.on("mousedown",function(){//防止事假传递
	  		return false;
	  	})
	  	return jq;
	  },
	  /**
	   * 功能说明：线选中功能
	   * @param {Object} isSelect
	   * @param {Object} noChange
	   */
	  selected:function(isSelect,noChange){
	  	
	  	isSelect=isSelect===undefined?!this.isSelect:isSelect
	  	if(!noChange)this.isSelect=isSelect;
	  	var arrJQ=this.arrJQ;
	  	if(isSelect){
	  		this.drawObj.attr({stroke: this.defaults.selectStroke});
	  		for(var i=0;i<arrJQ.length;i++){
	  			arrJQ[i].removeClass("l-active")
	  		}
	  		
	  	}else{
	  		this.drawObj.attr({stroke: this.defaults.stroke});
	  		for(var i=0;i<arrJQ.length;i++){
	  			arrJQ[i].addClass("l-active")
	  		}
	  	}
	  },
	   /**
	   * 功能说明：线鼠标进入功能
	   * @param {Object} isSelect
	   * @param {Object} noChange
	   */
	   move:function(isSelect){
	  	if(this.isSelect)return;
	  	var arrJQ=this.arrJQ;
	  	if(isSelect){
	  		this.drawObj.attr({stroke: this.defaults.selectStroke});
	  		for(var i=0;i<arrJQ.length;i++){
	  			arrJQ[i].removeClass("l-active")
	  		}
	  	}else{
	  		this.drawObj.attr({stroke: this.defaults.stroke});
	  		for(var i=0;i<arrJQ.length;i++){
	  			arrJQ[i].addClass("l-active")
	  		}
	  	}
	  },
	  /**
	   * 功能说明：连线重新构建功能
	   * @param {Object} isClear true：进行清除布局，false:进入长久布局
	   */
	  reDraw:function(isClear){
	  	if(this.drawObj){
	  		this.move(true)
	  		this.drawObj.attr('path',this.getPath(isClear))
	  	}else{
	  		var that=this,isMove=true;
	  		var drawObj=this.drawObj=this.parent.drawPath(this.getPath(isClear),this.defaults)
	  		drawObj.click(function(){
	  			setTimeout(function(){
	  				if(that.isSelect){
	  					that.parent.selected(null)
		  			}else{
		  				that.parent.selected(that)
		  			}
	  			},10)
	  		})
	  		drawObj.mouseover(function(){
	  			that.move(true);
	  			that.parent.enterLines=that;
	  		})
	  		drawObj.mouseout(function(){
	  			that.move(false);
	  			that.parent.enterLines=false;
	  		})
	  	}
	  	this.move(false)
	  	this.setTitlePos();
	  },
	  /**
	   * 功能：获取连线路劲
	   */
	  getPath:function(isClear){
	  	var r=this.r,parent=this.parent,
	  	midP=0,path;
	  	var defaults=this.defaults;
	  	if(!this.isChange){//是否已经被改变过点位置
	  		var rigOps=this.rigOps=parent.getPosByJq(this.formNode,this.toNode),
	  		midP=_getMindelPos(rigOps[0],rigOps[1],r),startNode=rigOps[0],endNode=rigOps[1];
	  		path="M"+startNode.x+","+startNode.y+" "+" L"+endNode.x+","+endNode.y;
	  		this.newtecJQ.css({left:midP.x,top:midP.y})
	  	}else{
	  		var arrPos=this.arrPos;
	  		if(this.type=="straight"){//折线点，理论上支持无线点
	  			var arrJQ=this.arrJQ;
	  			if(isClear){
	  				for(var i=0,len=arrPos.length;i<len;i++){
		  				var apos=arrPos[i];
		  				if(i==0){//开始点
		  					var startNode=parent.getPosByJq(arrJQ[0],this.formNode)[1],//ja
		  					path="M"+startNode.x+","+startNode.y +" L";
		  				}
		  				path+=" "+apos.x+","+apos.y;
		  				if(i==len-1){//结束点
		  					var tag=arrJQ[arrJQ.length-1]
		  					if(tag.hasClass("temp"))tag=arrJQ[arrJQ.length-2]
		  					var endNode=parent.getPosByJq(tag,this.toNode)[1]
		  					path+=" "+endNode.x+","+endNode.y;
		  				}
		  			}
	  			}else{
	  				for(var i=0;i<arrJQ.length;i++){
		  				arrJQ[i].remove();
		  				arrJQ[i]=null;
		  			}
		  			arrJQ=this.arrJQ=[]
		  			var width=r+r;
	//	  			path+=" L"+midNode.x+","+midNode.y+" "+endNode.x+","+endNode.y;
		  			for(var i=0,len=arrPos.length;i<len;i++){
		  				var apos=arrPos[i];
		  				var jq=this.getPosJq(apos.x-r,apos.y-r,width,i)
		  				parent.setLyItem({jq:jq,x:apos.x,y:apos.y});
		  				arrJQ.push(jq)
	//	  				console.info("==apos=>>>",apos)
		  				if(i==0){//开始点
		  					var startNode=parent.getPosByJq(jq,this.formNode)[1],//ja
		  					path="M"+startNode.x+","+startNode.y +" L";
		  					var apos1=_getMindelPos(startNode,apos,r)
	//	  					console.info("==apos=>>>",apos1,startNode)
		  					jq=this.getPosJq(apos1.x,apos1.y,width,i+"_0");
		  					parent.setLyItem({jq:jq,x:apos1.x+r,y:apos1.y+r});
		  					arrJQ.push(jq);
		  				}
		  				path+=" "+apos.x+","+apos.y;
		  				if(i==len-1){//结束点
		  					var endNode=parent.getPosByJq(jq,this.toNode)[1]
		  					path+=" "+endNode.x+","+endNode.y;
		  					var apos1=_getMindelPos(apos,endNode,r)
		  					jq=this.getPosJq(apos1.x,apos1.y,width,i+"_1");
		  					parent.setLyItem({jq:jq,x:apos1.x+r,y:apos1.y+r});
		  					arrJQ.push(jq);
		  				}else{
		  					var apos1=_getMindelPos(apos,arrPos[i+1],r)
		  					jq=this.getPosJq(apos1.x,apos1.y,width,i+"_1");
		  					parent.setLyItem({jq:jq,x:apos1.x+r,y:apos1.y+r});
		  					arrJQ.push(jq);
		  				}
		  			}
	  			}
	  			
	  		}else{
	  			var rigOps=this.rigOps=parent.getPosByJq(this.newtecJQ,this.toNode),
		  		midP=this.arrPos[0];
		  		rigOps[0]=pos1=parent.getPosByJq(this.newtecJQ,this.formNode)[1],//ja
		  		midNode=parent.bezierfxFun(0.5,{x:midP.x,y:midP.y},pos1,rigOps[1]),
		  		startNode=rigOps[0],endNode=rigOps[1],defaults.midNode;
		  		defaults.midNode=midNode;
		  		path="M"+startNode.x+","+startNode.y+" Q"+midNode.x+","+midNode.y+" "+endNode.x+","+endNode.y;
	  		}
	  		
	  	}
	  	return path;
	  },
	  remove:function(){
	  	this.drawObj&&this.drawObj.remove()
	  	this.newtecJQ.remove();	
	  	this.parent.lineNewtecs.remove(this);
	  	this.formNode.toLine.remove(this);
	  	this.toNode.formLine.remove(this);
	  	this.titleJQ.remove();
	  	var arrJQ=this.arrJQ;
	  	for(var i=0;i<arrJQ.length;i++){
	  		arrJQ[i].remove();
	  	}
	  },
	  /**
	   * 功能说明：创建标题布局
	   * @param {Object} title
	   * @param {Object} position
	   */
	 	createTitle:function(title,position){
	 		var jq=$("<div class='line-title'><p>"+title+"</p></div>")
	 		if(!position){//默认位置
	 			var arrPos=this.arrPos,
	 			len=arrPos.length,mL=this.tagLen=Math.ceil(len/2)-1,
	 			tagX=3,tagY=3;this.tagPos={x:tagX,y:tagY};
	 			console.info("mL==",len,mL)
	 			if(len%2==0){
	 				var p1=arrPos[mL],p2=arrPos[mL+1],
	 				position={x:(p1.x+p2.x)/2+tagX,y:(p1.y+p2.y)/2+tagY}
	 			}else{
	 				position=arrPos[mL];
	 				position={x:position.x+tagX,y:position.y+tagY};
	 			}
	 		}else{//已经有位置，计算相对位置
	 			var min=squaredDiff(position,arrPos[0]),tagLen=0;
	 			for(var i=1;i<arrPos.length;i++){
	 				var l=squaredDiff(position,arrPos[i])
	 				if(min>l){
	 					min=l;
	 					tagLen=i;
	 				}
	 			}
	 			this.tagLen=tagLen;
	 			this.tagPos={x:position.x-arrPos[tagLen].x,y:position.y-arrPos[tagLen].y}
	 		}
	 		this.titleJQ=jq;
	 		this.parent.itemsLayout.append(jq);
	 		this.setTitlePos();
	 	},
	 	/**
	 	 * 功能说明：设置标题位置
	 	 */
	 	setTitlePos:function(){
	 		if(!this.titleJQ)return;
	 		var w=this.titleJQ.outerWidth()
	 		var tag=this.arrPos[this.tagLen],tagPos=this.tagPos;
	 		this.titleJQ.css({left:tag.x+tagPos.x-w/2,top:tag.y+tagPos.y})
	 	},
	  /**
	   * 功能说明：设置标题
	   */
		setTitle:function(title){
		 	if(!this.titleJQ){
		 		this.createTitle(title);
		 	}
		 	this.titleJQ.find('p').html(title);
		 	this.setTitlePos();
		},
	  /**
	   * 功能说明：布局构建完成调用
	   * @param {Object} params 用户自定义参数
	   */
	  finsh:function(params){
	  	this.reDraw();
	  	return this;
	  }
	});
	 function _getMindelPos(start,end,r){
	  	return {x:(start.x+end.x)/2-r,y:(start.y+end.y)/2-r}
	  }
	 function squaredDiff(node1,node2){
			return (node1.x-node2.x)*(node1.x-node2.x)+(node1.y-node2.y)*(node1.y-node2.y);
		}
})();