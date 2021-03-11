;(function(){
	var hideTimerOfRect;
	var background; //背景
	var paperWidth ;//画板长 包括工具栏
	var paperHeight;  //画板宽
	var lineColor = "#000" //线的颜色
	var nodes = []; //所有节点
	var lines = []; //所有的线
	var remarks = [];//区域备注
	var processDesigner = {};
	var paper;
	var nodeNameCount = 1; //节点名称计数器
	var defaultNodeFlag = 0;//默认节点标记
	var processProp;
	Newtec.ProcessDigram = function(params) {//流程设计器类
		this.defaults = {//默认参数
			key:''
		};
		$.extend(true,this.defaults,params);
	};
	
	Newtec.ProcessDigram.prototype = new Newtec.Base('processDesigner');
	
	Newtec.ProcessDigram.prototype.createNewtecJQ = function(f){
		var processContainer = document.getElementById(f.appendTo);
		processContainer.setAttribute("class","containerStyle");
		paperWidth = processContainer.offsetWidth-1;
		paperHeight = processContainer.offsetHeight-7;
		paper = Raphael(processContainer,paperWidth,paperHeight);  //创建出画图的paper
		window.onresize = function(){ // 注册window大小监听事件  窗口大小改变时paper大小改变
			var curWidth = processContainer.offsetWidth-1;
			var curHeight = processContainer.offsetHeight-7; 
			if(paperWidth==curWidth&&paperHeight==curHeight){ //没有变化
				return;
			}else{
				if(paperWidth==curWidth){ //width没变 即是height变了
					paperHeight=curHeight;
					paper.setSize(paperWidth,paperHeight);
				}else{
					if(paperHeight==curHeight){ //width变了 height没变
						paperWidth=curWidth;
						paper.setSize(paperWidth,paperHeight);
					}else{ //两个都变了
						paperWidth=curWidth;
						paperHeight=curHeight;
						paper.setSize(paperWidth,paperHeight);
					}
				}
			}
		};
		createBackground();//创建背景画板
		if(f.key){
			load(f.key);
		}
		return $(processContainer);
	};
	
	var createBackground = function (){
		background = paper.rect(0,0,2000,2000).attr({"stroke-width":0,fill:"#AEAEAE","fill-opacity":0});//画一个背景 方便实现点击空白地方触发事件
		background.toBack();
	}
	Newtec.ProcessDigram.create = function(params){
		return new Newtec.ProcessDigram(params).init();
	};
	/*读出流程*/
	var load = function (processId){ 
        Newtec.DS.get("bPMProcess").updateData({
            operId: 'getProcessNode',
            data:{processId:processId},	
            callback:function(res){
            	var str = res.data;
            	var index = str.indexOf("[");
            	var remarkstr = str.substring(index,str.length);
            	var otherstr = str.substring(0,index);
            	var remarks =  JSON.parse(remarkstr);
            	var others = JSON.parse(otherstr);
            	var process = {
            		id: others.processId,
            		key: others.key,
            		name: others.name,
           			version: others.version,
       				status: others.status,
            		createPersonId: others.createPersonId,
            		createPersonName: others.createPersonName,
            		createDepartmentId: others.createDepartmentId,
            		createDepartmentName: others.createDepartmentName,
           			createTime: others.createTime,
            		updateTime: others.updateTime,
            		description: others.description,
            		finshProcessBefore: others.finshProcessBefore,
            		finshProcessAfter: others.finshProcessAfter,
            		startProcessBefore: others.startProcessBefore,
            		startProcessAfter: others.startProcessAfter,
           			imports: others.imports,
           			bussClass: others.bussClass
            	};
            	
            	var pnodes =[];
            	for(var i=0;i<others.nodeNum;i++){
            		pnodes.push({
        				complateTaskAfter: others["n_"+i+"_"+"complateTaskAfter"],
        				complateTaskBefore: others["n_"+i+"_"+"complateTaskBefore"],
        				departmentId: others["n_"+i+"_"+"departmentId"],
        				departmentName: others["n_"+i+"_"+"departmentName"],
        				juheNodeProcess: others["n_"+i+"_"+"juheNodeProcess"],
        				juheNodeUser: others["n_"+i+"_"+"juheNodeUser"],
        				name: others["n_"+i+"_"+"name"],
        				nodeFlag: others["n_"+i+"_"+"nodeFlag"],
        				personName: others["n_"+i+"_"+"personName"],
        				positionX: others["n_"+i+"_"+"positionX"],
        				positionY: others["n_"+i+"_"+"positionY"],
        				toNodeFlag: others["n_"+i+"_"+"toNodeFlag"],
        				type: others["n_"+i+"_"+"type"],
        				userName: others["n_"+i+"_"+"userName"]
            		})
            	}
            	var plines =[];
            	for(var i=0;i<others.lineNum;i++){
            		plines.push({
            			conditionProcess: others["l_"+i+"_"+"conditionProcess"],
            			fromNodeFlag: others["l_"+i+"_"+"fromNodeFlag"],
            			toNodeFlag: others["l_"+i+"_"+"toNodeFlag"],
            			type: others["l_"+i+"_"+"type"]
            		})
            			
            	}
            	drawAndSetData(process,pnodes,plines,remarks);
            }
        });	
	}
	/**
	 * 画流程图
	 */
	var drawAndSetData = function(process,pnodes,plines,premarks){
		//设流程属性
		var processProp = this.processProp
		for(x in processProp){
			processProp[x] = process[x];
		}
		//画节点
		for(var i=0;i<pnodes.length;i++){
			var pnode = pnodes[i];
			var x  = pnode.positionX;
			var y = pnode.positionY;
			var type = pnode.type;
			var node;
			if(type=="node"){
				node  =  new Node(x-30,y-19,60,38);
				nodes.push(node);
				node.getShape().text.attr("text",pnode.name);
			}else if (type=="开始"){
				node  =  new StartNode(x-9.5,y-9.5,19);
				nodes.push(node);
				node.getShape().text.attr("text",pnode.name);
			}else if (type=="完成"){
				node  =  new EndNode(x-9.5,y-9.5,19);
				nodes.push(node);
			}
			for(x in node.nodeProp){
				node.nodeProp[x] = pnode[x];
			}
		}
		//画线
		for(var i=0;i<plines.length;i++){
			var pline = plines[i];
			var from;
			var to;
			var type = pline.type;
			
			for(var j=0;j<nodes.length;j++){ //找到两个链接节点
				if(nodes[j].nodeProp.nodeFlag ==pline.fromNodeFlag){
					from = nodes[j].getShape();
				}
				if(nodes[j].nodeProp.nodeFlag ==pline.toNodeFlag){
					to = nodes[j].getShape();
				}
			}
			var line = connect(from,to,lineColor,type);
			line.line.attr({"arrow-end":"open-wide-long"});
		}
		
		//画区域备注
		for(var i=0;i<premarks.length;i++){
			var x = premarks[i].positionX;
			var y = premarks[i].positionY;
			var width =premarks[i].width;
			var height = premarks[i].height;
			var contents = premarks[i].contents;
			
			var remark  =  new RemarkArea(x,y);
			remark.resizeTo(width,height);
			remarks.push(remark);
			remark.text.attr("text",contents);
			for(var j=remarks.length-1;j>=0;j--){ // 从后往前遍历remark让其toBack 让新出来的在最上面
				remarks[j].toBack();
			}
		}
	}
	/*父类 流程节点，有子类普通节点 开始点 结束点
	 * 
	 * 分两级  ProcessNode  shape
	 *  ProcessNode.getShape() 可以得到raphael对应的元素
	 *  shape.procNode可以得到ProcessNode
	 * */
	var ProcessNode = function (left,top,width,height){
		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;
		this.shape = this.createShape();
	}
	//流程相关属性	
	ProcessNode.prototype.id = "123456";

	ProcessNode.prototype.mouseoverEve = function(){//鼠标移进事件
			this.attr({cursor:"pointer",fill:"#FBCA98"});
		};	
	ProcessNode.prototype.mouseoutEve = function(){ //鼠标移出事件
		var node = this;
		this.text.timer = window.setTimeout(function(){
			node.attr({cursor:"default",fill:"#FBFB98"});
			},100);
		};
	/*给图形添加事件,子类获得该图形后可重写事件*/
	ProcessNode.prototype.createShape = function (){
		var node = this.getRealShape();
		node.procNode = this; //给图形一个得到节点的属性，维护关系
		node.fromline = []; //记录来向线
		node.toline = [];  //记录去向线
		node.visible = true;//是否可见
		node.ischoose = false;//是否在选中
		if(node.type=="rect"){
			/*定义文字对象*/	
			node.text =paper.text(node.attr("x")+node.attr("width")/2,node.attr("y")+node.attr("height")/2,"节点"+nodeNameCount++).attr({cursor:"pointer","font-family":"微软雅黑","font-size":"10"});
		}else{
			/*定义文字对象*/
			var name = this.haveCre? "节点"+nodeNameCount++:"结束点"; //有创建按钮的圆形是开始点
			node.text =paper.text(node.attr("cx"),node.attr("cy"),name).attr({cursor:"pointer","font-family":"微软雅黑","font-size":"10"});
		}
		node.text.belongNode=node;//建立关系
		node.text.mouseover(function(){ //进入字体时取消节点出去时的两个计时器
			window.clearTimeout(this.timer);
		})
		node.attr("title",node.text.attr("text"));
		node.mouseover(this.mouseoverEve);  
		node.mouseout(this.mouseoutEve);
		return node;
	}
	/*给图形的实际形状，供子类重写*/
	ProcessNode.prototype.getRealShape = function(){
		var node = paper.rect();
		node.attr({x:this.left,y:this.top,"width":this.width,"height":this.height,fill:"#FBFB98",stroke:"black","stroke-width":"0.5",r:8});			
		return node;
	}
	ProcessNode.prototype.getShape = function(){
		return this.shape;
	}

	/*子类 普通节点*/
	var Node =function(left,top,width,height){
		this.left =parseInt(left);
		this.top = parseInt(top);
		this.width = width;
		this.height = height;
		this.nodeProp = new NodeProp();  //业务属性
		this.shape = this.createShape(); //创建图形 
		this.nodeProp.name = this.shape.text.attr("text");
		this.nodeProp.nodeFlag = (this.defaultNodeFlag+=10);	
		this.nodeProp.type = "node";
	}
	/*开始节点*/
	var StartNode = function(left,top,r){
		this.left =parseInt(left);
		this.top = parseInt(top);
		this.r = r;
		this.nodeProp = new NodeProp();//业务属性
		this.nodeProp.type = "开始";
		this.nodeProp.nodeFlag = (this.defaultNodeFlag+=10);	
		/*子类 重写获得的图形*/
		this.getRealShape = function(){
			return paper.circle(this.left+this.r/2,this.top+this.r/2,r).attr({"fill":"#FBFB98","stroke-width":"0.5",stroke:"black"});
		}
		this.shape = this.createShape(); //创建图形 
		this.nodeProp.name = this.shape.text.attr("text");
	}
	/*结束节点*/
	var EndNode = function(left,top,r){
		this.left =parseInt(left);
		this.top = parseInt(top);
		this.r = r;
		this.nodeProp = new NodeProp();//业务属性
		this.nodeProp.type = "完成";
		this.nodeProp.name = "完成点";
		this.nodeProp.nodeFlag = (this.defaultNodeFlag+=10);	
		/*子类 重写获得的图形*/
		this.getRealShape = function(){
			return paper.circle(this.left+this.r/2,this.top+this.r/2,r).attr({"stroke-width":0.5,fill:"#AEAEAE","fill-opacity":"0.1"});
		}
		this.shape = this.createShape(); //创建图形 
	}
	extend(Node,ProcessNode);   // node继承processNode 
	extend(StartNode,ProcessNode);   // StartNode继承processNode 
	extend(EndNode,ProcessNode);   // EndNode继承processNode 
	
	function extend(Child,Parent){  //实现继承
		var F = function (){};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
	}
	/*流程线   分三级  ProcessLine    lineObj       line
	 * 	ProcessLine.lineObj 得到 lineObj
	 *  line.lineObj 得到 lineObj
	 *  lineObj.procLine 得到ProcessLine
	 *  lineObj.line 得到line
	 * */
	var ProcessLine  = function(obj1, obj2, path,type,color,bg){
		this.lineProp = new LineProp();//业务属性
		/*流程线属性*/
		this.createLine = function()
		{ 
			var lineObj = {};//操作线的对象
			lineObj.line = paper.path(path).attr({stroke: color, fill: "none",cursor:"pointer"});//,"arrow-end":"open-wide-long"
			lineObj.bg = bg && bg.split && paper.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3});
			lineObj.from = obj1;
			lineObj.to = obj2;
			lineObj.type = type;
			lineObj.procLine = this;  //维护关系
			lineObj.line.isChooing = false;
			var realLine = lineObj.line;
			realLine.lineObj = lineObj;
			realLine.visible=true;
			realLine.ischoose = false;
			return lineObj;
		}
		
		this.getLine =function(){	
			return line;	
		}

		var line = this.createLine();
	}
	/*区域备注*/
	var RemarkArea = function(x,y){
		var self =this;
		var titHei = 25; //标题宽度
		var areaWid =400 //area长度;
		var areaHei =300 //area宽度;
		var minWidth = 180;
		var minHeight = 90;
		var text = this.text = paper.text(x+10,y-titHei+10,"区域备注").attr({"cursor":"pointer","text-anchor":"start","font-family":"微软雅黑","font-weight":"bold","font-size":"10"});
		var titleRect = this.titleRect = paper.rect(x,y-titHei,areaWid,titHei).attr({"fill":"#CCFFCC","cursor":"crosshair","stroke-width":"0.2"});
		var remarkArea = this.remarkArea = paper.rect(x,y,areaWid,areaHei).attr({"fill":"#CCFFCC","cursor":"crosshair","stroke-width":"0.2"});
		var deleteBtn = paper.image(crossDeleteSrc,x+areaWid-18,y-23,16,16).attr("cursor","pointer");
		var ctrlPoint = paper.rect(x+areaWid-3,y+areaHei-3,6,6).attr({"fill":"red","cursor":"se-resize","stroke-width":"0","fill-opacity":"0"});   //右下方控制点
		var bottomLine = paper.rect(x-3,y+areaHei-3,areaWid,6).attr({"fill":"red","cursor":"s-resize","stroke-width":"0","fill-opacity":"0"});  ; // 下方拖动线
		var rightLine = paper.rect(x+areaWid-3,y-3,6,areaHei).attr({"fill":"red","cursor":"e-resize","stroke-width":"0","fill-opacity":"0"}); ;  //  右方拖动线
		/*被点击的备注在备注之中最前*/
		var remarkup = function(){
			remarks.splice(remarks.indexOf(self), 1);
			remarks.push(self);
			for(var i=remarks.length-1;i>=0;i--){ 
				remarks[i].toBack();
			}
		}
		titleRect.click(remarkup);
		remarkArea.click(remarkup);
		text.click(remarkup);

		this.show = function(){
			text.show();
			titleRect.show();
			remarkArea.show();
			deleteBtn.show();
			ctrlPoint.show();
			bottomLine.show();
			rightLine.show();
		}
		this.resizeTo = function(width,height){
			var ox = remarkArea.attr("x");
			var oy = remarkArea.attr("y");
			var owid = remarkArea.attr("width");
			var ohei = remarkArea.attr("height");
			var ocx = ox+owid-3;
			var ocy = oy+ohei-3;
			var ctrlX = ox+width-3;  //控制点x
			var ctrlY = oy+height-3; //控制点y
			
			if(width>minWidth){
				titleRect.attr({"width":width});
				remarkArea.attr({"width":width});
				areaWid =width; //area长度;
				ctrlPoint.attr({"x":ctrlX});
				rightLine.attr({"x":ctrlX});
				bottomLine.attr({"width":width});
			}
			
			if(height>minHeight){
				remarkArea.attr({"height":height});
				areaHei =height; //area宽度;
				ctrlPoint.attr({"y":ctrlY});
				bottomLine.attr({"y":ctrlY});
				rightLine.attr({"height":height});
			}		
			deleteBtn.attr({"x":remarkArea.attr("x")+remarkArea.attr("width")-18,"y":remarkArea.attr("y")-23});
		}
	}
	
	 /*节点业务属性*/
	function NodeProp(){
		this.id="";
		this.processId="";
		this.key=""; // 流程定义标记
		this.nodeFlag=""; // 节点标记
		this.name=""; // 节点名称
		this.departmentId=""; // 节点审批部门Id(部门Id存在时，部门名称也必须存在)
		this.departmentName="";
		this.userName=""; // 审批账号(账号存在时，名字也必须存在；多个用户用分号分割)
		this.personName=""; // 节点审批用户名字
		this.toNodeFlag=""; // 下一个节点（下个节点如果连接两个 则用逗号分隔开）
		this.type = ""; // 节点类型 start:开始节点 node:中间节点 end:结束节点
		this.juheNodeUser = "and"; // 聚合点分支类型
		this.juheNodeProcess = "and"; // 聚合点分支类型
		this.complateTaskBefore="";
		this.complateTaskAfter="";
		this.conditionData="";
		this.positionX="";
		this.positionY="";
	}
	/*流程业务属性*/
	function ProcessProp(){
		this.id=""; 
		this.key=""; 
		this.version="";  
		this.name="";   
		this.status=""; 
		this.createTime=""; 
		this.updateTime="";   
		this.createPersonName="";  
		this.createPersonId="";  
		this.createDepartmentName="";  
		this.createDepartmentId="";   
		this.description="";  
		this.areaDesc="";  
		this.startProcessBefore="";  
		this.startProcessAfter="";  
		this.finshProcessBefore="";  
		this.finshProcessAfter="";  
		this.imports="";  
		this.bussClass=""; 
	}
	/*线的业务属性*/
	function LineProp(){
		this.conditionProcessRemark=""; //流程流向条件描述
		this.conditionData=""; //数据条件条件
		this.conditionProcess=""; //流程流向条件
	}
	
	function writeObj(obj){ 
		 var description = ""; 
		 for(var i in obj){ 
		 var property=obj[i]; 
		 description+=i+" = "+property+"\n"; 
		 } 
		 console.log(description); 
	};	
	/*创建线或重连那条线 
	参数1：连的对象1，或是一条线对象，会重连那条线并调整位置
	参数2：连的对象2,可能是一个点对象
	参数3：线的颜色
	参数4：线的类型 不填是直线 curve是曲线  poly是折线
	参数5：背景线 位置与主线一样 但是可以控制颜色和粗细 来达到更好的效果 color|strokeWidth
	曲线*/
	var connect = function (obj1, obj2, line, type, bg) {
		if (obj1.line && obj1.from && obj1.to) {
			line = obj1;
			obj1 = line.from;
			obj2 = line.to;
			type = line.type;
		}
		//算出两个对象的八个点
		var bb1 = obj1.getBBox(),
			bb2 = obj2.flag==undefined?obj2.getBBox():{x:obj2.x,y:obj2.y,width:0,height:0};
			p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
			{x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
			{x: bb1.x - 1, y: bb1.y + bb1.height / 2},
			{x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
			{x: bb2.x + bb2.width / 2, y: bb2.y - 1},
			{x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
			{x: bb2.x - 1, y: bb2.y + bb2.height / 2},
			{x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
			d = {}, dis = [];
		//找出可能的组合并把距离存起来
		for (var i = 0; i < 4; i++) {
			for (var j = 4; j < 8; j++) {
				var dx = Math.abs(p[i].x - p[j].x),
					dy = Math.abs(p[i].y - p[j].y);
				if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
					if(type==="curve"||type ==="poly"){
						dis.push(dx + dy);
						d[dis[dis.length - 1]] = [i, j];
					}else{
						dis.push(Math.sqrt(dx*dx + dy*dy));
						d[dis[dis.length - 1]] = [i, j];	
					}
				}
			}
		}
		//找出最小距离
		if (dis.length == 0) {
			var res = [0, 4];
		} else {
			res = d[Math.min.apply(Math, dis)];
		}
		//根据 找到的最小距离配对 的两个点 的位置 决定控制点
		var x1 = p[res[0]].x,
			y1 = p[res[0]].y,
			x4 = p[res[1]].x,
			y4 = p[res[1]].y;
		dx = Math.max(Math.abs(x1 - x4) / 2, 10);
		dy = Math.max(Math.abs(y1 - y4) / 2, 10);	
		var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
			y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
			x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
			y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);

		//开始决定线的路径  M 第一个点 C 控制点1 控制点2 第二个点 （曲线）（svg path）
		var path;
		if(type==="curve"){
			path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
		}else if(type ==="poly"){
			path = ["M", x1.toFixed(3), y1.toFixed(3), "L", x2, y2, "L", x3, y3,"L", x4.toFixed(3), y4.toFixed(3)].join(",");
		}else{
			path = ["M", x1.toFixed(3), y1.toFixed(3),"L", x4.toFixed(3), y4.toFixed(3)].join(",");
		}
		 
		if (line && line.line) {	
			line.bg && line.bg.attr({path: path});
			line.line.attr({path: path});
		} else {
			var color = typeof line == "string" ? line : "#000";
			var processLine = new ProcessLine(obj1,obj2,path,type,color,bg); //创建流程线对象
			var line = processLine.getLine();  //获取线对象
			//把线放进节点中 注意是以上的线对象
			if(obj2.toline){//有时候可能是暂时线，有这个属性证明不是暂时线构造的对象
			obj1.toline.push(line);}  
			if(obj2.fromline){	
			obj2.fromline.push(line);
			lines.push(processLine);} //全局放流程线对象
			return line;
		}
	};
	Newtec.Module("ProcessDigram")
})();