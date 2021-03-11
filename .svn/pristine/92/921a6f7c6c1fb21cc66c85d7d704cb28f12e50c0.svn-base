Newtec.Component("CanvasVertor",function(){
console.info("======CanvasVertor====")
CanvesVertor={};
Newtec.Utils.addJS("processDesigner/raphael.js")
/**
 * Raphael矢量图组件
 * 该组件可对绘画的对象添加鼠标事件，集成由于画布矢量图对象
 */
Newtec.RaphaelVertor = function (params) {
	var defaults=this.defaults;
	defaults.arrowType=params.arrowType||"classic-wide-long"; //block-wide-long:三角形箭头 open-wide-long：折线箭头 oval-wide-long：圆点箭头 ：diamond-wide-long：方形箭头
};
Newtec.RaphaelVertor.exte(Newtec.CanvasVertor,'RaphaelVertor');
Newtec.RaphaelVertor.over({
	/**
	 * 功能说明：设计器画布对象
	 * @param {Object} params
	 * @param {Object} bodyDiv
	 */
	createCanvas:function(params,bodyDiv,id){
		var canvas=$('<div id="'+id+'_raphael" class="raphael-canvas"></div>');
		/**
		 * 创建画布对象
		 */
		bodyDiv.append(canvas)	
		return canvas;
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
		this.raphael=this.layersMap[this.mainlayId].raphael=this.createRaphael(h,w,this.mainlayId);
		this.height=h;
		this.width=w;
		this.drawAfter()
		this.bodyOffset=this.body.offset();
	},
	createRaphael:function(height,width,id){
		return new Raphael(id+"_raphael",width,height);
	},
	/**
	 * 外部调用，创建图层
	 */
	createMyLayer:function(){
		var map=this.createLayer();
		map.raphael=this.createRaphael(this.height,this.width,map.id)
		return map;
	},
	/**
	 * 重写设置当前图层逻辑
	 * @param {Object} layerId
	 */
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
		this.raphael=layerMap.raphael
		this.itemsLayout.css('display','')
		console.info("===>>>>")
	},
	/**
	 * 功能说明：画布绘画后调用
	 * 
	 */
	drawAfter:function(){},
	/**
	 * 功能说明，将矢量图上的线的运动轨迹运动起来
	 */
	drowPointtrack:function(){},
	clearCvsClear:function(){
	},
	clearCvs:function(){
	},
	/**
	 * 划线
	 * @param {Object} startNode
	 * @param {Object} endNode
	 * @param {Object} ops isClear:true:加载到频繁清除区
	 */
	drawLine: function(startNode, endNode,ops) {
       return this.drawPath(this.getPath(startNode, endNode,ops),ops);
   },
   /**
	 * 功能说明：获取路劲
	 * @param {Object} startNode
	 * @param {Object} endNode
	 * @param {Object} ops isClear:true:加载到频繁清除区
	 */
   getPath:function(startNode, endNode,ops){
   		ops=ops||{};
		var defaults=this.defaults;
        var curveness=ops.curveness||0; //曲线弯曲程度
        var path="M"+startNode.x+","+startNode.y;
        var midNode=null;
        if(curveness||ops.midNode){
        	var midNode=ops.midNode||{
		         x:( start.x + end.x) / 2 - ( start.y - end.y ) * curveness,
		         y:( start.y + end.y ) / 2 - ( end.x - start.x ) * curveness
	    	}
        	path+=" Q"+midNode.x+","+midNode.y+" "+endNode.x+","+endNode.y;
        }else{
        	path+=" L"+endNode.x+","+endNode.y;
        }
        return path;
   },
   /**
    * 功能说明：根据jq到点获取路劲问题
    * @param {Object} startJQ
    * @param {Object} endPos
    * @param {Object} ops
    */
   getPathJQ2Pos:function(startJQ,endPos,ops){
   		var arr=this.getPosJQ2Pos(startJQ,endPos)
   		return this.getPath(arr[0],arr[1],ops);
   },
   /**
    * 功能说明：根据路径画对象
    * @param {Object} path
    * @param {Object} ops
    */
   drawPath:function(path,ops){
   		ops=ops||[];
   		var defaults=this.defaults;
        ops["stroke-width"]=ops["stroke-width"]||ops.lineWidth||defaults.lineWidth;
        ops.stroke=ops.stroke||ops.strokeStyle||defaults.strokeStyle;
        var isSige=ops.lineWidth==1;
        if(isSige){
        	startNode.x=startNode.x+0.5;
        	endNode.x=endNode.x+0.5;
        }
        var showArrow=ops.showArrow===undefined?defaults.showArrow:ops.showArrow;
        if(showArrow){
        	ops['arrow-end']=ops['arrow-end']||defaults.arrowType
        }
   		return  this.raphael.path(path).attr(ops);
   },
   /**
    * 功能说明：可运动节点
    * @param {Object} startNode
    * @param {Object} endNode
    * @param {Object} params
    */
   drawMobileObj:function(startNode, endNode,params){},
});
	Newtec.Module("RaphaelVertor")
});