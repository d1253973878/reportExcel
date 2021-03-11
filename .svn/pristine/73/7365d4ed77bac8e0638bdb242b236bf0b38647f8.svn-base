;(function(){
if(Newtec.MyCanvas != undefined){
		console.warn('newtec.menu.js已经被引入!');
		return ;
	}
Newtec.Utils.addCSS("widget/canvas-vertor.css");
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
		interval:200,
		itemW:150,
		showArrow:true,
		rightMenuTitle:[{title:"新增",name:'add',icon:"glyphicon glyphicon-plus"},{title:"删除",name:'remove',icon:"glyphicon glyphicon-trash"}],
		rightClick:function(name,data){
			console.info("-------,,"+name,data)
		}
    };
};
Newtec.CanvasVertor.exte(Newtec.Base,'myCanvas');
Newtec.CanvasVertor.over({
	createNewtecJQ:function(params){
		var newtecJQ=$('<div class="newtec-mycanvas" style="background:'+params.background+'"></div>')
		var canvas=$('<canvas></canvas>');
		/**
		 * 创建画布对象
		 */
		this.canvas=canvas;
		newtecJQ.append(canvas)
		 //excanvas框架中针对ie加载canvas延时问题手动初始化对象
		if (typeof G_vmlCanvasManager != "undefined") G_vmlCanvasManager.initElement(cvs);
            //2D画布对象
       	var cvs=canvas[0]
        if(!cvs.getContext){
        	alert("该浏览器不支持canvas！！");	
        	return;
        }
        this.context = cvs.getContext("2d");
        this.arrParam=[];
        /**
         * 创建一个基于画布之上的div
         */
        var div=$('<div class="main-body"></div>')
        this.itemsLayout=div;
        newtecJQ.append(div);
        var that=this;
        if(params.rightMenuTitle){
        	var rightMenuTitle=params.rightMenuTitle,
        	rightClick=params.rightClick;
        	var html='<ul class="dropdown-menu" >';
        	for(var i=0;i<rightMenuTitle.length;i++){
        		var rD=rightMenuTitle[i];
        		html+='<li data="'+rD.name+'"><i class="icon '+rD.icon+'"/>'+rD.title+'</li>'
        	}
        	var ulJQ=$(html+'</ul>');
        	this.menuJQ=ulJQ;
        	newtecJQ.append(ulJQ)
        	if(Newtec.Utils.isFunction(rightClick)){
        		ulJQ.on("click",'li',function(){
	        		var name=$(this).attr("data");
	        		rightClick(name,that.treeData[that.crrId]);
        		})
        	}
        	
        	$(document).click(function(){
        		ulJQ.css("display",'')
        	})
        }
		return newtecJQ;
	},
	
	/**
	 * 初始化
	 */
	draw:function(){
		var newtecJQ=this.newtecJQ;
		var h=this.defaults.height||newtecJQ.height();
		var w=this.defaults.width||newtecJQ.width();
		this.height=h;
		this.width=w;
		var canvas=this.canvas;
		var cvs=canvas[0]
	    cvs.width =w|| 1100;
		cvs.height =h || 600;
		newtecJQ.css({height:h,width:w});
	},
	drawCurvePath:function(  start, end, curveness ) {
	    // 计算中间控制点
	    
	    var ctx=this.context;
	    ctx.lineWidth = 1;
        ctx.strokeStyle = this.defaults.strokeStyle;
        ctx.beginPath();
	    var cp = [
	         ( start[ 0 ] + end[ 0 ] ) / 2 - ( start[ 1 ] - end[ 1 ] ) * curveness,
	         ( start[ 1 ] + end[ 1 ] ) / 2 - ( end[ 0 ] - start[ 0 ] ) * curveness
	    ];
	    ctx.moveTo( start[ 0 ], start[ 1 ] );
	    ctx.quadraticCurveTo( 
	        cp[ 0 ], cp[ 1 ],
	        end[ 0 ], end[ 1 ]
	    );
	    ctx.stroke();

	},

	/**
	 * 划线
	 * @param {Object} startNode
	 * @param {Object} endNode
	 * @param {Object} ops
	 */
	drawLine: function(startNode, endNode,ops) {
        var ctx=this.context,
        defaults=this.defaults;
        ctx.beginPath();
        ops=ops||{};
        ops.lineWidth=ops.lineWidth||1;
        ops.strokeStyle=ops.strokeStyle||defaults.strokeStyle;
        var isSige=ops.lineWidth==1;
        if(isSige){
        	startNode.x=startNode.x+0.5;
        	endNode.x=endNode.x+0.5;
        }
        for (var att in ops) ctx[att] = ops[att];
        ops.startNode=startNode;
        ops.endNode=endNode;
        ops.context=ctx;
        var lDraw=defaults.showArrow?new Belt(ops):new Line(ops);lDraw.draw()
   },
   drawMobileObj:function(startNode, endNode,params){
   		params=params||{};
   		params.startPoint=startNode;
   		params.endPoint=endNode;
   		params.appenToJQ=this.itemsLayout
   		new MobileObj(params)
   },
   setLyItem:function(item){
	   	if(!item){
	   		return;
	   	}
	   	var x=item.x,
	   	y=item.y,
	   	itemJQ=item.jq;
	   	itemJQ.css({'top':y,left:x,position:'absolute'})
	   	var that=this;
	   	itemJQ.attr("id",item.id)
		itemJQ.bind("contextmenu",function(e){ 
	  		var jq=$(this),newtecJQ=that.newtecJQ,
	  		id=jq.attr("id"),
	  		top=Newtec.Utils.toInt(jq.css("top"),0)+jq.height(),
	  		left=Newtec.Utils.toInt(jq.css("left"),0)+jq.width()/2;
	  		that.menuJQ.css({top:top,left:left,display:'block'});
			return false;
		})
		this.itemsLayout.append(itemJQ);
		var r=itemJQ.outerWidth()/2;
		itemJQ.css({'top':y-r,left:x-r,position:'absolute'})
		return r;
   },
    empty:function(){
    	this.newtecJQ.empty();
    },
    createVector:function(x,y){
    	return new Vector(x,y)
    }
});
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
	param
	this.line = new Line(param);
	this.arrow = new Arrow(param);
 	var doubleArrow=param.doubleArrow;
 	var curveness=param.curveness||0; //曲线弯曲程度
 	param.midNode={
	         x:( start.x + end.x) / 2 - ( start.y - end.y ) * curveness,
	         y:( start.y + end.y ) / 2 - ( end.x - start.x ) * curveness
	    };
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
	var wF=cW/frequency,hF=cH/frequency,count=0,that=this,first=true;
	frequency+=peek;
	var arrays=[];
	//移动
	this.move=function(){
//		this.copy();
		count++;
		first=false;
		var crrW=count*wF,crrH=count*hF;
		if(count>frequency){
			count=0;
			crrW=0;
			crrH=0;
			for(var i=0;len=arrays.length;i++){
				var item=arrays[i];
				item[0].remove();
				clearInterval(item[1]);
			}
			arrays=[];
		}
		if(!isCycle&&!first&&!count){
			objJQ.remove();
		}else{
			objJQ.css({'top':startY+crrH,"left":startX+crrW})
		}
		
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
var bezier = function(t,bezierCtrlNodesArr) { //贝塞尔公式调用
    var x = 0,
        y = 0,
        n = bezierCtrlNodesArr.length - 1;
    bezierCtrlNodesArr.forEach(function(item, index) {
        if(!index) {
            x += item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        } else {
            x += self.factorial(n) / self.factorial(index) / self.factorial(n - index) * item.x * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
            y += self.factorial(n) / self.factorial(index) / self.factorial(n - index) * item.y * Math.pow(( 1 - t ), n - index) * Math.pow(t, index) 
        }
    })
    return {
        x: x,
        y: y
    }
}
	Newtec.Module("Newtec.CanvasVertor2")

})();