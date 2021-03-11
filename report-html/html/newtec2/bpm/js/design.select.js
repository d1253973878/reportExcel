/**
 * 组件：DesignSelect
 * 功能：设计器选择对线，必须制定parentDiv：父布局和设计器对象design
 * @author 吴明坤
 */
(function(){
	Newtec.DesignSelect = function (params) {
		this.parentDiv=params.parentDiv;//需要设置的父布局
		this.design=params.design;
		delete params.parentDiv;
		delete params.design;
		this.defaults={
			isEnd:true,//是否形成闭环
			posLen:8,//最大点数
			diameter:4,//直径长度
			"stroke-dasharray":".",
			showArrow:false,
			stroke:"#26a786",
			dragEnd:null,//function
//			"stroke-width": 1.5,
		}
		
	};
	Newtec.DesignSelect.exte(Newtec.Base,'DesignSelect');
	Newtec.DesignSelect.over({
	  createNewtecJQ:function(params){
	  	var d=params.diameter,r=d/2
	  	posarr=this.posarr=get8Pos(params.start,params.end);
	  	var parentDiv=this.parentDiv
	  	var arrJQ=this.arrJQ=[]
	  	for(var i=0;i<8;i++){
	  		var p=posarr[i],jq=this.getPosJq(p.x-r,p.y-r,d,i);
	  		arrJQ.push(jq)
	  		parentDiv.append(jq)
	  	}
  		return arrJQ[0];
	  },
	  /**
	   * 功能说明：获取点jq
	   * @param {Object} left 定位left
	   * @param {Object} top 定位top
	   * @param {Object} width jq宽度
	   * @param {Object} index jq的索引
	   */
	  getPosJq:function(left,top,width,index){
	  	var jq=$("<div class='bpm-select-pos' data='"+index+"' style='display:none;width:"+width+"px;height:"+width+"px;left:"+left+"px;top:"+top+"px;' data='"+index+"'></div>");
	  	var that=this,r=width/2,setPosition=0,
	  	defaults=this.defaults,design=that.design,
	  	parentDiv=this.parentDiv,
	  	axis=null;
	  	/**
	  	 * 功能说明:八个节点的选中事件
	  	 */
	  	if(index==0){//第一个点
	  		setPosition=function(pos){
	  			var posarr=that.posarr,left=pos.left+r,top=pos.top+r;
	  			posarr[index]={x:left,y:top}
	  			posarr[1].x=posarr[5].x=(left+posarr[2].x)/2;
	  			posarr[2].y=posarr[1].y=top;
	  			posarr[6].x=posarr[7].x=left;
	  			posarr[7].y=posarr[3].y=(top+posarr[6].y)/2;
	  			that.reDraw();
	  		}
	  		
	  	}else if(index==1){
	  		setPosition=function(pos){
	  			var posarr=that.posarr,left=pos.left+r,top=pos.top+r;
	  			posarr[index]={x:left,y:top}
	  			posarr[0].y=posarr[2].y=top;
	  			posarr[7].y=posarr[3].y=(top+posarr[6].y)/2;
	  			that.reDraw();
	  		}
	  		axis="y";
	  	}else if(index==2){
	  		setPosition=function(pos){
	  			var posarr=that.posarr,left=pos.left+r,top=pos.top+r;
	  			posarr[index]={x:left,y:top}
	  			posarr[1].x=posarr[5].x=(left+posarr[0].x)/2;
	  			posarr[0].y=posarr[1].y=top;
	  			posarr[4].x=posarr[3].x=left;
	  			posarr[7].y=posarr[3].y=(top+posarr[6].y)/2;
	  			that.reDraw();
	  		}
	  	}else if(index==3){
	  		setPosition=function(pos){
	  			var posarr=that.posarr,left=pos.left+r,top=pos.top+r;
	  			posarr[index]={x:left,y:top}
	  			posarr[2].x=posarr[4].x=left;
	  			posarr[1].x=posarr[5].x=(left+posarr[0].x)/2;
	  			that.reDraw();
	  		}
	  		axis="x";
	  	}else if(index==4){
	  		setPosition=function(pos){
	  			var posarr=that.posarr,left=pos.left+r,top=pos.top+r;
	  			posarr[index]={x:left,y:top}
	  			posarr[3].y=posarr[7].y=(top+posarr[0].y)/2;
	  			posarr[2].x=posarr[3].x=left;
	  			posarr[5].y=posarr[6].y=top;
	  			posarr[1].x=posarr[5].x=(left+posarr[6].x)/2;
	  			that.reDraw();
	  		}
	  	}else if(index==5){
	  		setPosition=function(pos){
	  			var posarr=that.posarr,left=pos.left+r,top=pos.top+r;
	  			posarr[index]={x:left,y:top}
	  			posarr[3].y=posarr[7].y=(top+posarr[0].y)/2;
	  			posarr[6].y=posarr[4].y=top;
	  			that.reDraw();
	  		}
	  		axis="y";
	  	}else if(index==6){
	  		setPosition=function(pos){
	  			var posarr=that.posarr,left=pos.left+r,top=pos.top+r;
	  			posarr[index]={x:left,y:top}
	  			posarr[3].y=posarr[7].y=(top+posarr[0].y)/2;
	  			posarr[0].x=posarr[7].x=left;
	  			posarr[5].y=posarr[4].y=top;
	  			posarr[1].x=posarr[5].x=(left+posarr[2].x)/2;
	  			that.reDraw();
	  		}
	  	}else{
	  		setPosition=function(pos){
	  			var posarr=that.posarr,left=pos.left+r,top=pos.top+r;
	  			posarr[index]={x:left,y:top}
	  			posarr[1].x=posarr[5].x=(left+posarr[2].x)/2;
	  			posarr[0].x=posarr[6].x=left;
	  			that.reDraw();
	  		}
	  		axis="x";
	  	}
	  	jq.draggable({
	  		axis:axis,
	  		start:function(e,d){//线上红点拖拽开始
	  			//select-draging
	  			parentDiv.addClass("select-draging")
	  		},
	  		drag:function(e,d){//拖拽过程
	  			setPosition(d.position)
	  		},
	  		stop:function(e,d){//拖拽结束
	  			setPosition(d.position)
	  			var arr=that.getPosMess();
	  			design.selectNewtec&&design.selectNewtec.reDraw(arr[0],arr[1].width,arr[1].height);
	  			parentDiv.removeClass("select-draging")
	  		}
		})
	  	jq.on("mousedown",function(){//防止事假传递
	  		return false;
	  	})
	  	return jq;
	},
	/**
	 * 功能说明：显示或者隐藏选中
	 * @param {Object} isShow 默认是true,true:显示，false隐藏
	 */
	show:function(isShow){
		var arrJQ=this.arrJQ;
		isShow=isShow===false?false:true;
		for(var i=0;i<arrJQ.length;i++){
			arrJQ[i].css('display',isShow?"":"none");
		}
		if(isShow){
			this.drawLine()
		}else{
			this.lineObj&&this.lineObj.remove();
			this.lineObj=null;
		}
		
	},
	/**
	 * 功能说明：重画选中
	 */
	reDraw:function(){
		var posarr=this.posarr,arrJQ=this.arrJQ,r=this.defaults.diameter/2
		for(var i=0;i<posarr.length;i++){
			var pos=posarr[i]
			arrJQ[i].css({left:pos.x-r,top:pos.y-r})
		}
		this.drawLine()
		this.show();
	},
	/**
	 * 功能说明：设置选中jq 
	 * @param {Object} newtecJQ 目标布局
	 */
	selectJQ:function(newtecJQ){
		var newtecJQ=newtecJQ.newtecJQ||newtecJQ,offset=newtecJQ.offset(),
		bodyOffSet=this.design.bodyOffset,
	  	top=offset.top-bodyOffSet.top-2,
	  	left=offset.left-bodyOffSet.left-2;
	  	this.posarr=get8Pos({x:left,y:top},{x:left+newtecJQ.outerWidth()+4,y:top+newtecJQ.outerHeight()+4})
	  	this.reDraw()
	  	return this;
	},
	/**
	 * 功能说明：绘画线条
	 */
	drawLine:function(){
		var posarr=this.posarr,firsNode=posarr[0],path="M"+firsNode.x+","+firsNode.y+" L",
		design=this.design,arrJQ=this.arrJQ;
		for(var i=0;i<posarr.length;i++){
			var pos=posarr[i];
			path+=" "+pos.x+","+pos.y
		}
		path+=" "+firsNode.x+","+firsNode.y;
		if(this.lineObj){
			this.lineObj.attr("path",path)
		}else
			this.lineObj=design.drawPath(path,this.defaults)
	},
	/**
	 * 获取选中框信息
	 */
	getPosMess:function(){
		var posarr=this.posarr,firsNode=posarr[0],
		fleft=firsNode.x+2,ftop=firsNode.y+2,
		endNode=posarr[4],eleft=endNode.x-2,etop=endNode.y-2;
		return [{left:fleft,top:ftop},{width:eleft-fleft,height:etop-ftop}]
	},
	finsh:function(){
		this.show(false);	
	}
});
/**
 * 功能说明：获取八个节点，顺时针获取
 * @param {Object} start 开始节点
 * @param {Object} end 结束节点
 */
function get8Pos(start,end){
	var sx=start.x,sy=start.y,ex=end.x,ey=end.y,w=ex-sx,h=ey-sy
  	posarr=[];
  	/**
  	 * 八个节点计算
  	 */
  	posarr.push(start);
  	posarr.push({x:sx+w/2,y:sy});
  	posarr.push({x:sx+w,y:sy});
  	posarr.push({x:sx+w,y:sy+h/2});
  	posarr.push({x:sx+w,y:sy+h});
  	posarr.push({x:sx+w/2,y:sy+h});
  	posarr.push({x:sx,y:sy+h});
  	posarr.push({x:sx,y:sy+h*(1/2)});
  	return posarr;
}
})();