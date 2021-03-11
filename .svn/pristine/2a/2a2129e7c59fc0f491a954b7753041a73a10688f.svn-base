;(function(){
	var hideTimerOfRect;
	var background; //背景
	var paperWidth ;//画板长 包括工具栏
	var paperHeight;  //画板宽
	var lineColor = "gray" //线的颜色
	var nodes = []; //所有节点
	var lines = []; //所有的线
	var remarks = [];//区域备注
	var processDesigner = {};
	var paper;
	var nodeNameCount = 1; //节点名称计数器
	var defaultNodeFlag = 0;//默认节点标记
	var processProp;
	var key;
	
	var agreeColor = "#32CD32"; // 已同意节点的颜色 #66FF66
	var disAgreeColor = "#FFA500"; // 不同意节点的颜色
	var waitColor = "#DC143C";// 待审节点的颜色 #DC143C
	var pendingColor = "gray"; // 未审节点的颜色
	var backColor = "#FFA500"; //退回节点的颜色
	
	var jt_agree = "#32CD32"; // 同意箭头颜色 #66FF66
	var jt_disAgree = "#FFA500"; // 不同意箭头颜色 yellow
	var jt_wait = "#DC143C"; // 待审箭头颜色
	var jt_pending = "gray"; // 未审箭头颜色
	var container;
	var nodeDetail;
	var showTable = true;
	var showDigram = true;
	var processDigram;
	Newtec.ApprovalProcessSimp=function(params){
		this.defaults = {//默认参数
				bussId:''
			};
		$.extend(true,this.defaults,params);
	};
	
	Newtec.ApprovalProcessSimp.prototype = new Newtec.Base('approvalHistory');
	
	Newtec.ApprovalProcessSimp.prototype.createNewtecJQ=function(f){
		var processContainer = document.getElementById(f.appendTo);
		//创建一个div放入流程图
		var processDigram = document.createElement("div")
		processDigram.id = "processDigramSimp"
		processDigram.height ="50%";
		processDigram.width = "100%";
		processContainer.appendChild(processDigram)
		//processContainer.setAttribute("class","containerStyleNobord");
		paperWidth = processDigram.width-1;
		paperHeight = processDigram.height-7;
		//console.log(paperHeight)
		paper = Raphael(processDigram,paperWidth,paperHeight);  //创建出画图的paper
		window.onresize = function(){ // 注册window大小监听事件  窗口大小改变时paper大小改变
			var curWidth = processDigram.width-1;
			var curHeight = processDigram.height-7; 
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
		showTable = f.showTable;
		showDigram = f.showDigram;
		loadHistory(this.defaults.bussId);
		container = processDigram;
		var historyList = document.createElement("div");
		historyList.id = "historyTable2";
		processContainer.appendChild(historyList);
		nodeDetail = document.createElement("div");
		nodeDetail.id = "nodeDetail2";
		nodeDetail.style.display = "none"; 
		nodeDetail.style.width = '250px';
		nodeDetail.style.height = '215px';
		nodeDetail.style.border = '1px solid #838589';
		nodeDetail.style.padding = '10px';
		nodeDetail.style.lineHeight = '1';
//		nodeDetail.left = '250';
//		nodeDetail.top = '250';
		nodeDetail.style.backgroundColor="#eaebeb";
		nodeDetail.style.opacity = 0.85;
		processContainer.appendChild(nodeDetail);
		return $(processContainer);
	};
	
	Newtec.ApprovalProcessSimp.create = function(params){
		return new Newtec.ApprovalProcessSimp(params).init();
	};

	
	
	var loadHistory = function(bussId){//根据实例id获取审批历史
		Newtec.DS.get("processTest").fetchData({
			operId:'getApprovalHistoryData',
			data:{bussId:bussId},
			callback:function(res){
				var data = res.data;
				var nodeArr={};
				var arrowArr={};
				
				//var startNodeFlag = data[0].nodeFlag;//起点标记
				for(var i=0;i<data.length;i++){
					var historydata = data[i];
					var fromNodeFlag = historydata.fromNodeFlag;//来自哪个点
					var nodeFlag = historydata.nodeFlag;//点标记
					var opera = historydata.opera;//操作
					var color = getColorByOpera(opera);//获取颜色
					var startTime = historydata.startTime;
					var endTime = historydata.endTime==undefined?'':historydata.endTime;
					var useTime = '';
					if(!Newtec.Utils.isNull(endTime)){
						var startTimeStamp = Date.parse(new Date(startTime))/1000
						var endTimeStamp = Date.parse(new Date(endTime))/1000
						useTime = endTimeStamp- startTimeStamp;
					}
					historydata.useTime = '';
					if(!Newtec.Utils.isNull(useTime)){
						historydata.useTime = useTime+"秒";
					}
					
					var historyInfo = {
						nodeName : historydata.nodeName,
						deptName : historydata.departmentName,
						personName : historydata.personName,
						state : historydata.opera,
						content : historydata.content==undefined?'':historydata.content,
						startTime : historydata.startTime,
						endTime : historydata.endTime==undefined?'':historydata.endTime,
						useTime : historydata.useTime
					};
					
					if(Newtec.Utils.isNull(nodeArr[nodeFlag])){
						nodeArr[nodeFlag] = {
							'fromNodeFlag' : fromNodeFlag,
							'color' : color,
							'opera' : opera,
							'historyInfo':historyInfo
						};
					}else{
						nodeArr[nodeFlag].color = color;
						nodeArr[nodeFlag].opera = opera;
						nodeArr[nodeFlag].historyInfo = historyInfo;
					}
					if(fromNodeFlag!=nodeFlag){//从起点的下一个节点开始标记箭头
						if(opera=="不同意(完)"){//例外：指向不同意（完）的节点为绿色
							color = agreeColor;
						}
						if(Newtec.Utils.isNull(arrowArr[nodeFlag])){
							arrowArr[nodeFlag]={
								'fromNodeFlag' : fromNodeFlag,
								'color' : color	
							};
						}else{
							arrowArr[nodeFlag].color = color;
						}
					}
					
					
					if("回退(开)" == opera){//回退到开始节点，途径的节点变色
						var fromFlag = fromNodeFlag;
						var currNodeFlag = nodeFlag;
						while(fromFlag != currNodeFlag){
							if(nodeArr[fromFlag].fromNodeFlag!=fromFlag){//起点不用改颜色
								//nodeArr[fromFlag].color = disAgreeColor;
								arrowArr[fromFlag].color = disAgreeColor;
							}
							currNodeFlag = fromFlag;
							fromFlag = nodeArr[fromFlag].fromNodeFlag;
						}
					}
					
					data[i] = historydata;
				}
				var dataFields = [
				{name:"nodeName",title:"审批节点"},
				{name:"personName",title:"审批人"},
				{name:"opera",title:"状态"},
				{name:"content",title:"审批意见"},
				{name:"startTime",title:"起始时间"},
				{name:"endTime",title:"结束时间"},
				{name:"useTime",title:"耗时"}
				];
				Newtec.Table.create({
					appendTo:'#historyTable2',
					datas:data,
					fields:dataFields,
					showFilter: false,
					 showPagin: false,
					  showFetchForm: false,
					  multSelect:false,
					  showHeader:false
				});
				key = data[0].processKey;//取流程对应的key
				load(key,nodeArr,arrowArr);
			}
		});
	};
	
	function writeObj(obj){ 
		 var description = ""; 
		 for(var i in obj){ 
		 var property=obj[i]; 
		 description+=i+" = "+property+"\n"; 
		 } 
		 console.log(description); 
	};	 
	
	var createBackground = function (){
		background = paper.rect(0,0,paperWidth,paperHeight).attr({"stroke-width":0,fill:"white"/*,"fill-opacity":0*/});//画一个背景 方便实现点击空白地方触发事件
		//background.toBack();
	};
	
	/*读出流程*/
	var load = function (processId,nodeArr,arrowArr){ 
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
            		});
            	}
            	var plines =[];
            	for(var i=0;i<others.lineNum;i++){
            		plines.push({
            			conditionProcess: others["l_"+i+"_"+"conditionProcess"],
            			fromNodeFlag: others["l_"+i+"_"+"fromNodeFlag"],
            			toNodeFlag: others["l_"+i+"_"+"toNodeFlag"],
            			type: others["l_"+i+"_"+"type"]
            		});
            			
            	}
            	drawAndSetData(process,pnodes,plines,remarks,nodeArr,arrowArr);
            }
        });	
	};
	
	/**
	 * 画流程图
	 */
	var drawAndSetData = function(process,pnodes,plines,premarks,nodeArr,arrowArr){
		//设流程属性
		var processProp = this.processProp;
		for(x in processProp){
			processProp[x] = process[x];
		}
		//画节点
		var isFinsh = false;
		var isAgree = false;
		for(var i=0;i<pnodes.length;i++){
			var pnode = pnodes[i];
			var x  = pnode.positionX;
			var y = pnode.positionY;
			var type = pnode.type;
			var node;
			if(type=="node"){
				//node  =  new Node(x-9.5,y-9.5,19);
				var proNode = Newtec.ProcessNodeSimple.create({
					'x':x - 9.5,
					'y': y - 9.5,
					'paper':paper,
					'r': 19,
					'canEdit':false,
					'nodeType':'node',
					'container':container
				});
				node = proNode.currNode;
				nodes.push(node);
				node.getShape().text.attr("text",pnode.name);
				
			}else if (type=="开始"){
				//node  =  new StartNode(x-9.5,y-9.5,19);
				var proNode = Newtec.ProcessNodeSimple.create({
					'x':x - 9.5,
					'y': y - 9.5,
					'paper':paper,
					'r': 19,
					'canEdit':false,
					'nodeType':'start',
					'container':container
				});
				node = proNode.currNode;
				nodes.push(node);
				node.getShape().text.attr("text",pnode.name);
			}else if (type=="完成"){
				//node  =  new EndNode(x-9.5,y-9.5,19);
				var proNode = Newtec.ProcessNodeSimple.create({
					'x':x - 9.5,
					'y': y - 9.5,
					'paper':paper,
					'r': 19,
					'canEdit':false,
					'nodeType':'end',
					'container':container
				});
				node = proNode.currNode;
				if(isFinsh&&isAgree){
					setNodeColor(node,agreeColor);
				}else{
					if(isFinsh){
						setNodeColor(node,disAgreeColor);
					}else{
						setNodeColor(node,pendingColor);
					}
					
				}
				nodes.push(node);
			}
			
			if(!Newtec.Utils.isNull(nodeArr[pnode.nodeFlag])){//审过的节点都有相应的颜色填充，没审过的都为默认颜色
				setNodeColor(node,nodeArr[pnode.nodeFlag].color);
				if(nodeArr[pnode.nodeFlag].opera=="同意(完)"){
					isFinsh = true;
					isAgree = true;
				}
				if(nodeArr[pnode.nodeFlag].opera=="不同意(完)"){
					isFinsh = true;
					isAgree = false;
				}
				for(x in node.approvalInfo){
					node.approvalInfo[x] = nodeArr[pnode.nodeFlag].historyInfo[x]
				}
				var endTime = node.approvalInfo.endTime;
				if(endTime){
					paper.text(node.getShape().attr("cx"),node.getShape().attr("cy")+60, endTime.replace(' ','\n')).attr({
						cursor : "default",
						"font-family" : "微软雅黑",
						"font-size" : "10",
						"fill":"black",
						});
				}
				
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
			var lineColor = jt_pending;
			if(!Newtec.Utils.isNull(arrowArr[pline.toNodeFlag])){
				lineColor=arrowArr[pline.toNodeFlag].color;
			}else{//为连接结束节点的线上色
				if(isFinsh&&isAgree){
					lineColor =jt_agree;
				}else{
					if(isFinsh){
						lineColor =jt_disAgree;
					}else{
						lineColor =jt_pending;
					}
					
				}
			}
			var line = connect(from,to,lineColor,type);
			line.line.attr({"arrow-end":"open-wide-long"});
		}
	};
	
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
	};
	
	/*给图形添加事件,子类获得该图形后可重写事件*/
	ProcessNode.prototype.createShape = function (){
		var node = this.getRealShape();
		node.procNode = this; //给图形一个得到节点的属性，维护关系
		node.fromline = []; //记录来向线
		node.toline = [];  //记录去向线
		node.visible = true;//是否可见
		if(node.type=="rect"){
			/*定义文字对象*/	
			node.text =paper.text(node.attr("x")+node.attr("width")/2,node.attr("y")+node.attr("height")/2,"节点"+nodeNameCount++).attr({cursor:"pointer","font-family":"微软雅黑","font-size":"10"});
		}else{
			/*定义文字对象*/
			var name = this.haveCre? "节点"+nodeNameCount++:"结束点"; //有创建按钮的圆形是开始点
			node.text =paper.text(node.attr("cx"),node.attr("cy"),name).attr({cursor:"pointer","font-family":"微软雅黑","font-size":"10"});
		}
		node.text.belongNode=node;//建立关系
		node.attr("title",node.text.attr("text"));
		return node;
	};
	
	/*给图形的实际形状，供子类重写*/
	ProcessNode.prototype.getRealShape = function(){
		//var r=19;
		var node = paper.rect();
		node.attr({x:this.left,y:this.top,"width":this.width,"height":this.height,fill:"#FBFB98",stroke:"black","stroke-width":"0.5",r:8});	
		return node;
		//return paper.circle(this.left+this.r/2,this.top+this.r/2,r).attr({"fill":"#FBFB98","stroke-width":"0.5",stroke:"black"});
	};
	ProcessNode.prototype.getShape = function(){
		return this.shape;
	};
	
	/*子类 普通节点*/
	var Node =function(left,top,r){
		this.left =parseInt(left);
		this.top = parseInt(top);
		this.r = r;
		this.nodeProp = new NodeProp();//业务属性
		this.nodeProp.type = "node";
		this.nodeProp.nodeFlag = (this.defaultNodeFlag+=10);	
		/*子类 重写获得的图形*/
		this.getRealShape = function(){
			return paper.circle(this.left+this.r/2,this.top+this.r/2,r).attr({"fill":pendingColor,"stroke-width":"0.5",stroke:"black"});
		};
		this.shape = this.createShape(); //创建图形 
		this.nodeProp.name = this.shape.text.attr("text");
	};
	
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
			return paper.circle(this.left+this.r/2,this.top+this.r/2,r).attr({"fill":pendingColor,"stroke-width":"0.5",stroke:"black"});
		};
		this.shape = this.createShape(); //创建图形 
		this.nodeProp.name = this.shape.text.attr("text");
	};
	
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
			return paper.circle(this.left+this.r/2,this.top+this.r/2,r).attr({"stroke-width":0.5,fill:pendingColor/*,"fill-opacity":"0.1"*/});
		};
		this.shape = this.createShape(); //创建图形 
	};
	extend(Node,ProcessNode);   // node继承processNode 
	extend(StartNode,ProcessNode);   // StartNode继承processNode 
	extend(EndNode,ProcessNode);   // EndNode继承processNode 
	
	function extend(Child,Parent){  //实现继承
		var F = function (){};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
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
	};
	
	/*线的业务属性*/
	function LineProp(){
		this.conditionProcessRemark=""; //流程流向条件描述
		this.conditionData=""; //数据条件条件
		this.conditionProcess=""; //流程流向条件
	}
	
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
			var color = typeof line == "string" ? line : pendingColor;
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
	
	var setNodeColor = function(node,color){
		console.log(node);
		node.getShape().attr({"fill":color});
	};
	
	var setLineColor = function(line,color){
		line.line.attr({"fill":color});
	};
	
	var getColorByOpera = function(opera){//根据流程审批的opera字段获取颜色
		if(opera=="开始"||opera=="同意"||opera=="同意(完)"){
			return agreeColor;
		}
		if(opera=="不同意"||opera=="不同意(完)"||opera=="退出"){
			return disAgreeColor;
		}
		if(opera=="待审"){
			return waitColor;
		}
		if(opera=="回退"||opera=="回退(开)"){
			return backColor;
		}
		return pendingColor;
	};
	var approvalInfo = function(){
		this.nodeName = '';
		this.deptName = '';
		this.personName = '';
		this.state = '';
		this.content = '';
		this.startTime = '';
		this.endTime = '';
		this.useTime = '';
		
	}
})();