;(function(){
CanvesVertor={};
Newtec.Utils.addCSS("widget/canvas-vertor.css");
Newtec.Utils.addJS("widget/canvasVertor/bezierMaker.js")

/**
 * 矢量图组件
 * @param {Object} params
 */
Newtec.CanvasVertor = function (params) {
	//2.
	this.defaults = {
		width:0,
		height:0,
		background:"#ddd",
		strokeStyle:'black',
		lineWidth:1,
		interval:200,
		itemW:150,
		showArrow:true,
		rightMenuTitle:[{title:"新增",name:'add',icon:"glyphicon glyphicon-plus"},{title:"删除",name:'remove',icon:"glyphicon glyphicon-trash"}],
		rightClick:null,//function(name,data){},
		pointtrack:{//轨迹运动功能
			show:false,//是否开启功能
			leng:100,//节点数量
			color:"#2277ee",//节点颜色
			interval:50
		},
		bodyDraggableParams:null,
		canDrag:true,
    };
    this.posArr=[];//存放线轨迹获取到的节点
    this.objects={};
    this.layersMap={};
};
Newtec.CanvasVertor.exte(Newtec.Base,'canvasVertor');
Newtec.CanvasVertor.over({
	createNewtecJQ:function(params){
		this.id=Newtec.Utils.uuid();
		console.info("====:this.id>>>>"+this.id)
		var newtecJQ=$('<div id="'+this.id+'" class="newtec-mycanvas" style="background:'+params.background+'"></div>')
		var bodyDiv=$("<div class='canvas-main"+(params.canDrag&&" can-drag"||"")+"'></div>")
		newtecJQ.append(bodyDiv)
		
		this.body=bodyDiv;
		var that=this;
		if(params.canDrag){//背景可拖拽
			bodyDiv.draggable(params.bodyDraggableParams||{
//				start:function(){
//					bodyDiv.add
//				},
				stop:function(){
					that.bodyOffset=bodyDiv.offset()
				}
			});
			bodyDiv.click(function(e){
				that.bodyClick(e,this);
			})
		}
		
        this.arrParam=[];
        var that=this;
        //右键功能
        if(params.rightMenuTitle){
        	var rightMenuTitle=params.rightMenuTitle,
        	rightClick=params.rightClick;
        	var html='<ul class="dropdown-menu" style="min-width:'+110+'px">';
        	for(var i=0;i<rightMenuTitle.length;i++){
        		var rD=rightMenuTitle[i];
        		html+='<li id="'+rD.name+'"><i class="icon '+rD.icon+'"/>'+rD.title+'</li>'
        	}
        	var ulJQ=$(html+'</ul>');
        	this.menuJQ=ulJQ;
        	newtecJQ.append(ulJQ)
        	ulJQ.on("click",'li',function(){
        		var name=$(this).attr("id");
        		Newtec.Utils.isFunction(rightClick)&&rightClick(name,that.objects[that.crrId]);
        		that.rightMenuClick(name,that.objects[that.crrId])
    		})
        	$(document).click(function(){
        		ulJQ.css("display",'')
        	})
        	bodyDiv.bind("contextmenu",function(e){ 
		  		var bodyOffSet=newtecJQ.offset();
		  		that.showRightMenu(e.clientX-bodyOffSet.left,e.clientY-bodyOffSet.top,{});
				return false;
			})
        }
        this.setCrrLayer(this.mainlayId=this.createLayer(params).id);
        this.createNewtecAfter(newtecJQ);
		return newtecJQ;
	},
	/**
	 * 外部调用，创建图层
	 */
	createMyLayer:function(){
		var map=this.createLayer();
		this.setCvsWH(
			this.height,this.width,
			map.canvas);
		return map;
	},
	/**
	 * 内部调用,创建图层
	 * @param {Object} params
	 */
	createLayer:function(params){
		var id=Newtec.Utils.uuid();
		var div=$('<div id="'+id+'" class="main-body"></div>')
        this.body.append(div);
        /**
         * 创建一个基于画布之上的div
         */
        
        var canvas=this.createCanvas(params,div,id);
        return this.layersMap[id]={id:id,layer:div,canvas:canvas};
	},
	createCanvas:function(params,bodydiv,id){
		var canvas=$('<canvas id="'+id+'"></canvas>');
		/**
		 * 创建画布对象
		 */
		bodydiv.append(canvas)
//		if(params.pointtrack.show){
		var canvasClear=$('<canvas></canvas>');
		this.canvasClear=canvasClear;
		bodydiv.append(canvasClear);
//		}
 		//excanvas框架中针对ie加载canvas延时问题手动初始化对象
		if (typeof G_vmlCanvasManager != "undefined") G_vmlCanvasManager.initElement(cvs);
            //2D画布对象
       	var cvs=canvas[0]
        if(!cvs.getContext){
        	alert("该浏览器不支持canvas！！");	
        	return;
        }
//      this.context = cvs.getContext("2d");
        return canvas;
	},
	setCrrLayer:function(layerId){
		var layerMap=this.layersMap[layerId]
		if(!layerMap){
			console.error("图层切换失败！！");
			return;
		}
		this.crrLyerId=layerId;
		if(this.itemsLayout){
			this.itemsLayout.css('display','none')
		}
		this.itemsLayout=layerMap.layer;
		this.canvas=layerMap.canvas
		this.context=this.cvs[0].getContext("2d");
		this.itemsLayout.css('display','')
	},
	rightMenuClick:function(name,data){},
	createNewtecAfter:function(newtecJQ){},
	/**
	 * 功能说明：创建完主体布局调用
	 * @param {Object} newtecJQ
	 */
	createNewtecAfter:function(newtecJQ){},
	/**
	 * 初始化
	 */
	draw:function(){
		var newtecJQ=this.newtecJQ,
		defaults=this.defaults,
		body=this.body,
		h=defaults.height||body.height()|| 600,
		w=defaults.width||body.width()|| 1100;
		this.height=h;
		this.width=w;
		this.setCvsWH(h,w,this.canvas);
//		if(defaults.pointtrack.show){
			var cvsClear=this.canvasClear[0]
			cvsClear.width=w;
			cvsClear.height=h;
			this.cvsClear=cvsClear.getContext("2d");
//		}
		this.drawAfter()
		this.bodyOffset=this.body.offset();
	},
	/**
	 * 设置画布宽，高
	 * @param {Object} height
	 * @param {Object} widht
	 * @param {Object} canvas
	 */
	setCvsWH:function(height,widht,canvas){
		var cvs=canvas[0]
	    cvs.width =widht;
		cvs.height =height  ;
	},
	/**
	 * 功能说明：画布绘画后调用
	 * 
	 */
	drawAfter:function(){},
	/**
	 * 功能说明，将矢量图上的线的运动轨迹运动起来
	 */
	drowPointtrack:function(){
		var pointtrack=this.defaults.pointtrack,that=this;
		if(!pointtrack.show){
			console.error("未开始轨迹运动功能！！");
			return;
		}
		var posArr=this.posArr,
		posLen=posArr.length,
		leng=pointtrack.leng,
		index=0,ydCanvas=this.canvasClear[0],
		ydCtx=ydCanvas.getContext('2d')
		function go(){
			if(index==leng){
				index=0;
			}
			that.clearCvsClear();
			
			for(var i=0;i< posLen;i++){
				var arr=posArr[i],
				obj=arr[index],
    			x = obj.x,
                y = obj.y
				ydCtx.beginPath()
				ydCtx.fillStyle=ydCtx.strokeStyle="#2277ee";
		        ydCtx.arc(x, y, 4, 0, Math.PI * 2, false)
		        ydCtx.fill()
		        ydCtx.stroke()
			}
			index++;
		}
		setInterval(go,pointtrack.interval);
	},
	clearCvsClear:function(){
		var ydCanvas=this.canvasClear[0]
        this.cvsClear.clearRect(0, 0, ydCanvas.width, ydCanvas.height)
	},
	clearCvs:function(){
		var ydCanvas=this.canvas[0]
        this.context.clearRect(0, 0, ydCanvas.width, ydCanvas.height)
	},
	/**
	 * 划线
	 * @param {Object} startNode
	 * @param {Object} endNode
	 * @param {Object} ops isClear:true:加载到频繁清除区
	 */
	drawLine: function(startNode, endNode,ops) {
		ops=ops||{};
        var isClear=ops.isClear,
        ctx=isClear?this.cvsClear:this.context,
        defaults=this.defaults;
        var i=isClear?"s":"ss";
        ctx.beginPath();
        ops.lineWidth=ops.lineWidth||defaults.lineWidth;
        ops.strokeStyle=ops.strokeStyle||defaults.strokeStyle;
        var isSige=ops.lineWidth==1;
        if(isSige){
        	startNode.x=startNode.x+0.5;
        	endNode.x=endNode.x+0.5;
        }
//      if(isClear){
//      	this.clearCvsClear();
//      }
        for (var att in ops) ctx[att] = ops[att];
        ops.startNode=startNode;
        ops.endNode=endNode;
        ops.context=ctx;
        if(defaults.pointtrack.show){
        	var pointtrack=defaults.pointtrack;
        	var curveness=ops.curveness||0; //曲线弯曲程度
        	var midNode=_getMidNode(startNode,endNode,curveness)
        	var bezierMaker=new CanvesVertor.
        		BezierMaker({canvas:this.canvas[0],bezierCtrlNodesArr:[startNode,midNode,endNode],leng:pointtrack.leng});
        	this.posArr.push(bezierMaker.getPoint());
        }
        var showArrow=ops.showArrow===undefined?defaults.showArrow:ops.showArrow;
        var lDraw=showArrow?new Belt(ops):new Line(ops);lDraw.draw()
   },
   /**
    * 功能说明：根据两个jq对象连线，运用向量数学公式
    * @param {Object} startJQ 开始位置jq对象,也可以为newtec
    * @param {Object} endJQ 结束位置jq对象,也可以为newtec
    * @param {Object} ops 参数配置
    */
   drawLineJQ:function(startJQ, endJQ,ops){
   		var arrPos=this.getPosByJq(startJQ,endJQ);
   		console.info("drawLineJQ-=",arrPos)
   		this.drawLine(arrPos[0],arrPos[1],ops)
   		return arrPos;
   },
   /**
    * 功能说明：jq到点的连线
     * @param {Object} startJQ 开始位置jq对象,也可以为newtec
    * @param {Object} endJQ 结束位置jq对象,也可以为newtec
    * @param {Object} ops 参数配置
    */
   drawLineJQ2Pos:function(startJQ,endPos,ops){
   		var arr=this.getPosJQ2Pos(startJQ,endPos)
   		return this.drawLine(arr[0],arr[1],ops);
   },
   /**
    * 功能说明：jq到点的 位置点
    * @param {Object} startJQ
    * @param {Object} endPos
    * @param {Object} ops
    */
   getPosJQ2Pos:function(startJQ,endPos){
   		startJQ=startJQ.newtecJQ||startJQ;
   		var stOffset=startJQ.offset(),
   		sWidth=startJQ.outerWidth()/2,
   		sHeight=startJQ.outerHeight()/2,
   		orOffSet=this.bodyOffset,
   		orX=orOffSet.left,
   		orY=orOffSet.top,
   		stX=stOffset.left+sWidth-orX,
	   	stY=stOffset.top+sHeight-orY,
	   	v1=new Vector(stX,stY);//起始向量
	   	var v2=new Vector(endPos.x,endPos.y);//终点向量
   		var v3=v2.sub(v1)//
   		v3=v3.scale(1/v3.length())
//	   	console.warn(v1,v3.scale(sWidth),v1.add(v3.scale(sWidth)))
		v1=v1.add(v3.scale(sWidth))
   		return [v1,v2];
   },
   /**
    * 功能说明：获取布局中心点矢量点
    * @param {Object} jq
    */
   getJQPos:function(jq){
   		jq=jq.newtecJQ||jq;
   		var sWidth=jq.outerWidth()/2,
   		sHeight=jq.outerHeight()/2,
   		bodyOffset=this.bodyOffset,
   		offset=jq.offset();
   		return new Vector(offset.left+sWidth-bodyOffset.left,offset.top+sHeight-bodyOffset.top)
   },
   /**
    * 功能说明：获取两布局位置
    * @param {Object} startJQ 
    * @param {Object} endJQ
    */
   getPosByJq:function(startJQ, endJQ){
   		startJQ=startJQ.newtecJQ||startJQ;
   		endJQ=endJQ.newtecJQ||endJQ;
   		var stOffset=startJQ.offset(),
   		enOffset=endJQ.offset(),
   		sWidth=startJQ.outerWidth()/2,
   		sHeight=startJQ.outerHeight()/2,
   		eWidth=endJQ.outerWidth()/2,
   		eHeight=endJQ.outerHeight()/2,
   		orOffSet=this.bodyOffset,
   		orX=orOffSet.left,
   		orY=orOffSet.top,
   		stX=stOffset.left+sWidth-orX,
	   	stY=stOffset.top+sHeight-orY,
	   	v1=new Vector(stX,stY);//起始向量
   		if(eHeight!=eWidth){//长方形处理方式,获取八个点连接点
	   		var enX=enOffset.left-orX,
	   		enY=enOffset.top-orY,
	   		eWidthL=eWidth*2,eHeightL=eHeight*2;
	   		var arr=[{x:enX,y:enY},{x:enX,y:enY+eHeight},{x:enX,y:enY+eHeightL},
		   		{x:enX+eWidth,y:enY},{x:enX+eWidth,y:enY+eHeightL},
		   		{x:enX+eWidthL,y:enY},{x:enX+eWidthL,y:enY+eHeight},{x:enX+eWidthL,y:enY+eHeightL},
	   		];
	   		var nodeOpsition=arr[0];min=squaredDiff(nodeOpsition,v1);
	   		for(var i=1;i<arr.length;i++){
	   			var l=squaredDiff(arr[i],v1);
	   			if(min>l){
	   				nodeOpsition=arr[i];
	   				min=l;
	   			}
	   		}
	   		return [v1,nodeOpsition]
   		}else{//圆处理方式
   			var enX=enOffset.left-orX+eWidth,
	   		enY=enOffset.top-orY+eHeight;
	   		var v2=new Vector(enX,enY);//终点向量
	   		var v3=v2.sub(v1)//
	   		v3=v3.scale(1/v3.length())
//	   		console.warn(v1,v3.scale(sWidth),v1.add(v3.scale(sWidth)))
			v1=v1.add(v3.scale(sWidth))
 	   		v2=v2.sub(v3.scale(eHeight));
	   		return [v1,v2]
   		}
   },
   
   /**
    * 功能说明：可运动节点
    * @param {Object} startNode
    * @param {Object} endNode
    * @param {Object} params
    */
   drawMobileObj:function(startNode, endNode,params){
   		params=params||{};
   		params.startPoint=startNode;
   		params.endPoint=endNode;
   		params.appenToJQ=this.itemsLayout
   		new MobileObj(params)
   },
   /**
    * 功能说明：将布局设置到画布中（其实是div中，可使用css属性）
    * @param {Object} item jq：jq对象，x:left，y:top,isCenter:是否为中心的，默认ture
    */
   setLyItem:function(item){
	   	if(!item){
	   		return;
	   	}
	   
	   	var x=item.x,
	   	y=item.y,
	   	itemJQ=item.jq;
	   	itemJQ.layerId=this.crrLyerId
	  	itemJQ=itemJQ.newtecJQ||itemJQ;
	   	var that=this;
	   	var id=item.id||Newtec.Utils.uuid();
	   	itemJQ.attr("id",id)
	   	this.objects[id]=item;
		itemJQ.bind("contextmenu",function(e){ 
	  		var jq=$(this),newtecJQ=that.newtecJQ,
	  		bodyOffSet=that.bodyOffset,
	  		offset=jq.offset()||{},
	  		body=that.body,
	  		id=jq.attr("id"),
	  		top=offset.top+10-bodyOffSet.top+Newtec.Utils.toInt(body.css('top'),0)+jq.height()/2,
	  		left=offset.left+jq.width()/2-bodyOffSet.left+Newtec.Utils.toInt(body.css('left'),0);
	  		that.showRightMenu(left,top,item);
	  		that.crrId=id;
			return false;
		})
		this.itemsLayout.append(itemJQ);
		var isCenter=item.isCenter===false?false:true;
		var r=itemJQ.outerWidth()/2;
		if(isCenter){
			r2=itemJQ.outerHeight()/2;
			itemJQ.css({'top':y-r2,left:x-r,position:'absolute'})
		}else{
			itemJQ.css({'top':y,left:x,position:'absolute'})
		}
		return r;
   },
   /**
    * 功能说明：显示右侧菜单
    * @param {Object} left 位置left
    * @param {Object} top  位置top
    * @param {Object} params 目标右键菜单参数
    */
   showRightMenu:function(left,top,params){
   		var names=this.rightMenuShowName(params),
   		menuJQ=this.menuJQ;
  		if(names&&names.length>0){
  			menuJQ.find("li").css('display',"none")
  			for(var i=0;i<names.length;i++){
  				menuJQ.find('#'+names[i]).css('display',"")
  			}
  		}else{
  			menuJQ.find("li").css('display',"")
  		}
  		menuJQ.css({top:top,left:left,display:'block'});
   },
   /**
    * 功能说明：菜单显示列
    * @param {Object} params
    */
   rightMenuShowName:function(params){
   		return null
   },
    empty:function(){
    	this.newtecJQ.empty();
    },
    createVector:function(x,y){
    	return new Vector(x,y)
    },
    /**
	 * 功能说明：贝塞尔公式反向求导中间点，只满足三个点求导
	 * @param {Object} t 点比例位置
	 * @param {Object} pos 线上中点
	 * @param {Object} startRow 开始节点
	 * @param {Object} endRow 结束节点
	 */
    bezierfxFun:function(t,pos,startRow,endRow){
    	return bezierfx(t,pos,startRow,endRow)
    },
    /**
     * 功能说明：组件被点击
     */
    bodyClick:function(){}
});
function squaredDiff(node1,node2){
	return (node1.x-node2.x)*(node1.x-node2.x)+(node1.y-node2.y)*(node1.y-node2.y);
}
function _getMidNode(start,end,curveness){
	return {
	         x:( start.x + end.x) / 2 - ( start.y - end.y ) * curveness,
	         y:( start.y + end.y ) / 2 - ( end.x - start.x ) * curveness
	    }
}
//=====================================================以下是向量画布类，定义了点，向量，线，圆，箭头的基本类=========
//点
function Position(x, y){
	this.x = x;
	this.y = y;
}
 
var Vector = function (x, y) {
	if(Newtec.Utils.isJson(x)){
		y=x.y;
		x=x.x;
	}
    var vec = {
        x: x,
        y: y,
        // 缩放
        scale: function (scale) {
            return new Vector(vec.x *scale,vec.y *scale);
        },
        //加 另一个向量
        add: function (vec2) {
           return new Vector(vec.x +vec2.x,vec.y +vec2.y);
        },
        //减 另一个向量
        sub: function (vec2) {
            return new Vector(vec.x -vec2.x,vec.y -vec2.y);
        },
        //相反方向
        negate: function () {
            return new Vector(-vec.x,-vec.y);
        },
        //向量长度
        length: function () {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
        },
        //向量长度的平方
        lengthSquared: function () {
            return vec.x * vec.x + vec.y * vec.y;
        },
        //标准化
        normalize: function () {
            var len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
            if (len) {
                vec.x /= len;
                vec.y /= len;
            }
            return len;
		},
        //旋转
        rotate: function (angle) {
            var x = vec.x,
                y = vec.y,
                cosVal = Math.cos(angle),
                sinVal = Math.sin(angle);
            return new Vector(x * cosVal - y * sinVal, x * sinVal + y * cosVal);
        },
        //调试
        toString: function () {
            return '(' + vec.x.toFixed(3) + ',' + vec.y.toFixed(3) + ')';
        }
    };
    return vec;
};
function Draw(context){
	this.context = context;
}
 //圆
function Circle(context, center){
	Draw.call(this, context);
	this.center = center;
	this.radius = 10.0;
	this.draw = function(){
		//外圆
		context.fillStyle = "#555555";
		context.strokeStyle = "#333333";
		context.beginPath();
		context.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI, true);
		context.closePath();
		context.stroke();
		context.fill();
		//内圆
		context.fillStyle = "#888888";
		context.beginPath();
		context.arc(this.center.x, this.center.y, this.radius * 0.5, 0, 2*Math.PI, true);
		context.closePath();
		context.fill();
	}
}
Circle.prototype = new Draw();
 //线
function Line(param){
	var context=param.context;
	Draw.call(this, context);
	var start=this.startNode = param.startNode;//开始节点
	var end=this.endNode = param.endNode;//结束节点
	var curveness=param.curveness||0; //曲线弯曲程度
	var midNode=param.midNode||{
	         x:( start.x + end.x) / 2 - ( start.y - end.y ) * curveness,
	         y:( start.y + end.y ) / 2 - ( end.x - start.x ) * curveness
	    }
	this.draw = function(){
		
	    context.lineWidth = param.lineWidth||1;//线宽度
        context.strokeStyle = param.strokeStyle|| "#0000ff";//线颜色	
        context.beginPath();
	    context.moveTo( start.x, start.y );
	    
	    context.quadraticCurveTo( 
	        midNode.x, midNode.y,
	        end.x, end.y
	    );
//		context.strokeStyle =param.strokeStyle|| "#00ff00";
//		this.context.lineWidth = param.lineWidth||1;
//		this.context.moveTo(this.startNode.x, this.startNode.y);
//		this.context.lineTo(this.endNode.x, this.endNode.y);
		this.context.stroke();
	}
}
Line.prototype = new Draw();
 //箭头
function Arrow(param){
	var context=param.context;
	Draw.call(this, context);
	this.startNode = param.startNode;
	this.endNode = param.endNode;
	this.draw = function(){
		var step = 5;
		var dir = Vector((this.endNode.x - this.startNode.x), (this.endNode.y - this.startNode.y));
		dir.normalize();
 
		context.strokeStyle = param.strokeStyle||"#0000ff";
		this.context.save();
		this.context.translate(this.endNode.x - step * dir.x, this.endNode.y - step * dir.y);
		this.context.moveTo(-step * dir.y , step * dir.x);
		this.context.lineTo(step * dir.x, step * dir.y);
		this.context.lineTo(step * dir.y , -step * dir.x);
		this.context.stroke();
		this.context.restore();
	}
}
Arrow.prototype = new Draw();
//带箭头的线 
function Belt(param){
	var context=param.context,
	startNode=param.startNode,
	endNode=param.endNode;
	
	Draw.call(this, context);
	this.line = new Line(param);
	var curveness=param.curveness||0; //曲线弯曲程度
	var endParam =$.extend(true, param, {});
	endParam.startNode=param.midNode||{
	         x:( startNode.x + endNode.x) / 2 - ( startNode.y - endNode.y ) * curveness,
	         y:( startNode.y + endNode.y ) / 2 - ( endNode.x - startNode.x ) * curveness
	 }
	this.arrow = new Arrow(endParam);
 	var doubleArrow=param.doubleArrow;
 	
 	if(doubleArrow){
 		
 		var beginParams =$.extend(true, param, {});
		beginParams.endNode=startNode
		beginParams.startNode=endNode;
		
		this.beginArrow = new Arrow(beginParams);
 	}
	this.draw = function(){
		this.line.draw();
		this.arrow.draw();
		doubleArrow&&this.beginArrow.draw();
	}
}
Belt.prototype = new Draw();
//自动移动对象
function MobileObj(param){
	var startPoint=param.startPoint;
	var endPoint=param.endPoint;
	var appenToJQ=param.appenToJQ;
	var curveness=param.curveness||0; //曲线弯曲程度
 	var midNode={
	         x:( startPoint.x + endPoint.x) / 2 - ( startPoint.y - endPoint.y ) * curveness,
	         y:( startPoint.y + endPoint.y ) / 2 - ( endPoint.x - startPoint.x ) * curveness
	    };
	if(!startPoint||!endPoint){
		console.error("起始点或终点未设置");
		return;
	}
	//是否循环播放
	var isCycle=param.isCycle===false?false:true;
	var peek=param.peek||1;//一定速度
	//不设置有默认的对象
	var objJQ=param.jq||$('<div class="mb-item" style="top:'+startPoint.y+'px;left:'+startPoint.x+'px;"></div>');
	objJQ.addClass("mobile-item");
	appenToJQ.append(objJQ)
	var jw=objJQ.width()/2,jH=objJQ.height()/2;
	var startX=startPoint.x-jw,startY=startPoint.y-jH;
	objJQ.css({'top':startY,"left":startX})
	var cW=endPoint.x-startX-jw;
	var cH=endPoint.y-startY-jH;
	var min=Math.sqrt(cW*cW+cH*cH);
	var frequency=min/peek//获取到频率数
	//同比例设置节点运行的位置
	var wF=cW/frequency,hF=cH/frequency,
	count=0,that=this,first=true,
	arrPosLen=0,arrPos=[],arrays=[],thredNode=[startPoint,midNode,endPoint];
	frequency+=peek;
	
    for(i = 0; i <= 100; i+=1) {//获取所有点
        arrPos.push(bezier(i/100,thredNode))
    }
    arrPosLen=arrPos.length-1;
	//移动
	this.move=function(){
		if(count==arrPosLen){
			count=0;
		}
		var obj=arrPos[count]
		if(!isCycle&&!first&&!count){
			objJQ.remove();
		}else{
			objJQ.css({'top':obj.x,"left":obj.y})
		}
		count++;
	}
	
	function copy(){
		var html=$(objJQ.prop("outerHTML"))
		appenToJQ.append(html)
		var t=0;//可能又内存溢出？？？
		var rNum=30;
		var min=3;
		var time=setInterval(function(){
			
			if(t<rNum){
				t+=2;
				var rate=1-t/rNum,w=html.width(),h=html.height(),
				wC=w*0.85,hC=h*0.85;
//				wC=wC<min?min:wC;
//				hC=hC<min?min:hC;
				var top=Newtec.Utils.toInt(html.css("top"))+(h-hC)/2,
				left=Newtec.Utils.toInt(html.css("left"))+(w-wC)/2;
				html.css({"opacity":rate,width:wC,height:hC,top:top,left:left});
			}else{
				html.remove();
				clearInterval(time);
			}
		},50)
		arrays.push([html,time])
	}
	setInterval(function(){
		copy();
	},80)
	//开始
	function go(){
		if(!isCycle&&!first&&!count){
			return;
		}
		setTimeout(function(){
			go();
			that.move();
		},10)
	}
	setTimeout(go,10)
}
var factorial = function(num) { //递归阶乘
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}
var bezier = function(t,bezierCtrlNodesArr) { //贝塞尔公式调用
    var x = 0,
        y = 0,
        n = bezierCtrlNodesArr.length - 1;
    bezierCtrlNodesArr.forEach(function(item, index) {
        if(!index) {
            x += item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        } else {
            x +=factorial(n) / factorial(index) / factorial(n - index) * item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y +=factorial(n) / factorial(index) / factorial(n - index) * item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        }
    })
    return {
        x: x,
        y: y
    }
}
/**
 * 功能说明：贝塞尔公式反向求导中间点，只满足三个点求导
 * @param {Object} t 点比例位置
 * @param {Object} pos 线上中点
 * @param {Object} startRow 开始节点
 * @param {Object} endRow 结束节点
 */
var bezierfx=function(t,pos,startRow,endRow){
	var x=pos.x,
		y=pos.y,
		n=2;
		x -=factorial(n) / factorial(0) / factorial(n - 0) * startRow.x * Math.pow(( 1 - t ), n - 0) * Math.pow(t, 0)
		y -=factorial(n) / factorial(0) / factorial(n - 0) * startRow.y * Math.pow(( 1 - t ), n - 0) * Math.pow(t, 0) 
		x -= endRow.x * Math.pow(( 1 - t ), n - 2) * Math.pow(t, 2) 
        y -= endRow.y * Math.pow(( 1 - t ), n - 2) * Math.pow(t, 2) 
		x=x/(Math.pow(( 1 - t ), n - 1) * Math.pow(t,1));
		y=y/(Math.pow(( 1 - t ), n - 1) * Math.pow(t, 1))
	return {
		x:x/2,
		y:y/2
	}
}
	Newtec.Module("CanvasVertor")
})();