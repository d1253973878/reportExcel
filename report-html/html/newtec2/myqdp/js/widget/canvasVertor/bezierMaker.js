
(function (CanvesVertor) {
/**
 * canvas canvas的dom对象
 * bezierCtrlNodesArr 控制点数组，包含x，y坐标
 * color 曲线颜色
 */
CanvesVertor.BezierMaker = function(params) {
    this.canvas = params.canvas
    this.ctx = this.canvas.getContext('2d')
    this.bezierCtrlNodesArr = params.bezierCtrlNodesArr ? params.bezierCtrlNodesArr : []
    this.color = params.color ? params.color: '#ffffff'
    this.bezierArr = []
   	var leng=params.leng||100;
   	this.min=1/leng;
    if(params.ydCanvas){
    	this.ydCanvas=params.ydCanvas;
     	this.ydCtx = params.ydCanvas.getContext('2d')
    }
    
}
/**
 * 功能说明：获取节点位置
 * @param {Object} t 0-1 点参数位置
 */
CanvesVertor.BezierMaker.prototype.bezier = function(t) { //贝塞尔公式调用
    var x = 0,
        y = 0,
        bezierCtrlNodesArr = this.bezierCtrlNodesArr,
        n = bezierCtrlNodesArr.length - 1,
        self = this
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
/**
 * 功能说明：画圈线
 */
CanvesVertor.BezierMaker.prototype.drawBezier = function() { //通过控制点算出实时xy值渲染到canvas
    var nodeArr = this.bezierCtrlNodesArr  
    if(nodeArr.length === 2) {
        console.warn('Control nodes should be more then two!')
        var startNode = nodeArr[0],
            endNode = nodeArr[1]
        this.ctx.moveTo(startNode.x, startNode.y)
        this.ctx.lineTo(endNode.x, endNode.y)
        this.ctx.strokeStyle = this.color
        this.ctx.stroke()
    } else if(nodeArr.length === 3) {
        var startNode = nodeArr[0],
            ctrlNode = nodeArr[1],
            endNode = nodeArr[2]
        this.ctx.beginPath()
        this.ctx.moveTo(startNode.x, startNode.y)
        this.ctx.quadraticCurveTo(ctrlNode.x, ctrlNode.y, endNode.x, endNode.y)
        this.ctx.strokeStyle = this.color
        this.ctx.stroke()
    } else if(nodeArr.length === 4) {
        var startNode = nodeArr[0],
            ctrlNodeA = nodeArr[1],
            ctrlNodeB = nodeArr[2],
            endNode = nodeArr[3]
        this.ctx.beginPath()
        this.ctx.moveTo(startNode.x, startNode.y)
        this.ctx.bezierCurveTo(ctrlNodeA.x, ctrlNodeA.y, ctrlNodeB.x, ctrlNodeB.y, endNode.x, endNode.y)
        this.ctx.strokeStyle = this.color
        this.ctx.stroke()
    } else {
        var self = this
        for(i = 0; i < 1; i+=0.01) {
        	
            this.bezierArr.push(this.bezier(i))
        }
        this.bezierArr.forEach(function(obj, index) {
            if (index) {
                var startX = self.bezierArr[index - 1].x,
                    startY = self.bezierArr[index - 1].y,
                    x = obj.x,
                    y = obj.y
                self.ctx.beginPath()
                self.ctx.moveTo(startX, startY)
                self.ctx.lineTo(x, y)
                self.ctx.strokeStyle = self.color
                self.ctx.stroke()
            }
        })
    }
    return this;
}
/**
 *	功能说明:获取所有轨迹运动点 
 */
CanvesVertor.BezierMaker.prototype.getPoint=function(){
	var nodeArr = this.bezierCtrlNodesArr  
	var arr=[];
	var min=this.min
	for(i = 0; i <= 1; i+=min) {//获取所有点
        arr.push(this.bezier(i))
    }
	return arr;
}
/**
 *	功能说明：画轨迹线 
 */
CanvesVertor.BezierMaker.prototype.drawPos = function() { //通过控制点算出实时xy值渲染到canvas
    var self = this;
    var arr=this.getPoint();
    var len=arr.length-1;
    var index=1;
    if(self.ydCtx){
    	console.error("未设置清除的Canvas");return;
    }
    function go(){
    	if(index<len){
    		var obj=arr[index],
    			x = obj.x,
                y = obj.y
	        self.ydCtx.beginPath()
	       	self.ydCtx.clearRect(0, 0, self.ydCanvas.width, self.ydCanvas.height)
	        self.ydCtx.arc(x, y, 4, 0, Math.PI * 2, true)
	        self.ydCtx.fill()
    	}else{
    		index=0;
    	}
    	index++;
    }
  	setInterval(go,50);
    return this;
}
CanvesVertor.BezierMaker.prototype.factorial = function(num) { //递归阶乘
    if (num <= 1) {
        return 1;
    } else {
        return num * this.factorial(num - 1);
    }
}
})(CanvesVertor);