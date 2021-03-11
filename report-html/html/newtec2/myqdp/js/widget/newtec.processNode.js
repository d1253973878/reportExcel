;(function(){
	var userAgent = navigator.userAgent;

	var ie_upto10 = /MSIE \d/.test(userAgent);
	var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.test(userAgent);
	var ie = ie_upto10 || ie_11up; // 是否为IE
	
	var toolbarColor = "#D1E1F0";
	var nodeColor = "#D5E7FF";
	var nodeBorderColor = "#8AA2BE";
	var mouseOverRectColor = "#EBF0F6";
	var mouseOverRectBordColor = "#8F9BA7";
	var nodeTextColor = "#154188";
	var undoStack = []; // 回退栈 每做一次操作 往回退栈中添加操作对象（包含当前操作及其反操作）
	// 并清空重做栈 点解回退按钮时 把栈顶元素弹出执行操作并把操作压入重做栈
	var redoStack = []; // 重做栈 每次重做就把操作从重做栈中弹出并执行
	var paper;
	var nodeNameCount = 1; // 节点名称计数器
	var defaultNodeFlag = 0;// 默认节点标记
	var defaultOn = true; // 默认选择状态
	
	var curlineOn = false; // 曲线按钮激活状态
	var polylineOn = false; // 折线按钮激活状态
	var straightlineOn = false; // 直线按钮激活状态
	
	var choosingObjs = []; // 正在选中的节点和 线 （实际线）
	var nodes = []; // 所有节点
	var lines = []; // 所有的线
	var remarks = [];// 区域备注
	var newtecYeWu = true; // 业务相关 操作
	var curFocusInput; // 当前focus的input输入框,为了解决点击节点时不触发onblur事件而诞生
	var processForm; // 流程表单
	var nodeForm; // 节点表单
	var lineForm; // 线表单
	var curShowForm; // 当前正在显示的表单

	var processFormEle;// 流程表单元素
	var nodeFormEle; // 节点表单元素
	var lineFormEle; // 线表单元素
	var curShowFormEle; // 当前显示表单的DOM元素

	var curNode;// 当前显示表单对应的节点
	var curLine;// 当前显示表单对应的箭头
	var nodeType = {//节点类型 开始、结束、普通
			start : "start",
			end : "end",
			node : "node"
	};
	var lineColor = "#154188";// 线的颜色
	var curFocusInput; // 当前focus的input输入框,为了解决点击节点时不触发onblur事件而诞生
	var processProp;
	var processForm; // 流程表单
	var nodeForm; // 节点表单
	var lineForm; // 线表单
	var curShowForm; // 当前正在显示的表单

	var processFormEle;// 流程表单元素
	var nodeFormEle; // 节点表单元素
	var lineFormEle; // 线表单元素
	var curShowFormEle; // 当前显示表单的DOM元素

	var curNode;// 当前显示表单对应的节点
	var curLine;// 当前显示表单对应的箭头	
	var container;//当前节点所处的容器
	var canEdit = true;
	
	var agreeColor = "#32CD32"; // 已同意节点的颜色 #66FF66
	var disAgreeColor = "#FFA500"; // 不同意节点的颜色
	var waitColor = "#DC143C";// 待审节点的颜色 #DC143C
	var pendingColor = "gray"; // 未审节点的颜色
	var backColor = "#FFA500"; //退回节点的颜色
	
	var fontFace = "微软雅黑";
	Newtec.ProcessNode = function(params){
		this.defaults ={//默认参数
			nodeType : ''	
		};
		this.currNode ={};
		$.extend(true,this.defaults,params);
	};
	
	Newtec.ProcessNode.prototype = new Newtec.Base('processNode');
	Newtec.ProcessNode.prototype.createNewtecJQ = function(params){
//		initForm();
//		formFieldEve();
		processProp = new ProcessProp();
		var x = params['x'];
		var y = params['y'];
		var width = params['width'];
		var height = params['height'];
		paper = params['paper'];
		var type = params['nodeType'];
		var r = params['r'];
		nodeNameCount = params['nodeNameCount'];
		container = params['container'];
		canEdit = params['canEdit'];
		var node = {};
		if(!type){//默认为普通节点
			type = nodeType.node;
		};
		if(type == nodeType.node){
			node = new Node(x,y,width,height);
		}
		if(type == nodeType.start){
			node = new StartNode(x,y,r);
		}
		if(type == nodeType.end){
			node = new EndNode(x,y,r);
		}
//		var node = "<p>进入.....</p>";
		this.currNode = node;
		//writeObj(node);
		return $("");
	};
	
	Newtec.ProcessNode.create = function(params){
		return new Newtec.ProcessNode(params).init();
	};
	Newtec.ProcessNode.getCurFormEle = function(){
		return curShowFormEle;
	};
	Newtec.ProcessNode.getCurShowForm = function(){
		return curShowForm;
	};
	Newtec.ProcessNode.setCurFormEle = function(formEle){
		curShowFormEle = formEle;
	};
	Newtec.ProcessNode.setCurShowForm = function(from){
		curShowForm = from;
	};
	Newtec.ProcessNode.getUndoStack = function(){
		return undoStack;
	};
	Newtec.ProcessNode.getRedoStack = function(){
		return redoStack;
	};
	Newtec.ProcessNode.setUndoStack = function(stack){
		undoStack = stack;
	};
	Newtec.ProcessNode.setRedoStack = function(stack){
		redoStack = stack;
	};
	Newtec.ProcessNode.setNodeFormEle = function(formEle){
		nodeFormEle = formEle;
	};
	Newtec.ProcessNode.setLineFormEle = function(formEle){
		lineFormEle = formEle;
	};
	Newtec.ProcessNode.getCurNode = function(){
		return curNode;
	};
	Newtec.ProcessNode.getCurLine = function(){
		return curLine;
	};
	Newtec.ProcessNode.setLineBtnOn = function(type){
		type == "curve" ? curlineOn = true
				: type == "poly" ? polylineOn = true
						: straightlineOn = true;
	};
	Newtec.ProcessNode.setLineBtnOff = function(type){
		type == "curve" ? curlineOn = false
				: type == "poly" ? polylineOn = false
						: straightlineOn = false;
	};
	Newtec.ProcessNode.setDefaultOn = function(isDefaultOn){
		defaultOn = isDefaultOn;
	};
	var ProcessNode = function(left, top, width, height) {
		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;
		this.shape = this.createShape();
	};
	
	ProcessNode.prototype.mouseoverEve = function() {// 鼠标移进事件
		if(canEdit){
			this.attr({
				cursor : "move",
				fill : "#FBCA98"
			});
		}else{
			showNodeInfo(this);
		}
		// this.text.hide(); //隐藏文字

	};
	
	ProcessNode.prototype.mouseoutEve = function() { // 鼠标移出事件
		if(canEdit){
			var node = this;
			this.text.timer = window.setTimeout(function() {
			node.attr({
				cursor : "default",
				fill : nodeColor
			});
			}, 100);
		}else{
			var div = document.getElementById("nodeDetail");
			div.style.display = "none";
		}
		
		// this.text.show(); //显示文字
	};
	/* 拖动开始事件 */
	ProcessNode.prototype.dragStart = function(x, y, e) {
		/* 为了拖动时不显示快捷工具栏 */
		this.unmouseover();// 先取消mouseover事件 在dragEnd重新启用
		this.unmouseout();
		this.quickToolBar.hide();
		// this.text.hide(); //拖动开始隐藏文字
		if (defaultOn) {
			if (ie) { // ie下得先对线作一定处理
				ieDragStartFix(this);
			}
			this.ox = this.type == "rect" ? this.attr("x")
					: this.attr("cx");
			this.oy = this.type == "rect" ? this.attr("y")
					: this.attr("cy");
		} else if (curlineOn || polylineOn || straightlineOn) {
			if (curlineOn) {
				this.templine = connect(this, {
					flag : 1,
					x : e.offsetX,
					y : e.offsetY
				}, lineColor, "curve");
			} else if (polylineOn) {
				this.templine = connect(this, {
					flag : 1,
					x : e.offsetX,
					y : e.offsetY
				}, lineColor, "poly");
			} else {
				this.templine = connect(this, {
					flag : 1,
					x : e.offsetX,
					y : e.offsetY
				}, lineColor, "straight");
			}

			this.ox = e.offsetX;
			this.oy = e.offsetY;

		}
	};
	/* 拖动移动事件 */
	ProcessNode.prototype.dragMove = function(dx, dy, x, y) {
		if (defaultOn) {
			var curx = this.type == "rect" ? this.attr("x")
					: this.attr("cx");
			var cury = this.type == "rect" ? this.attr("y")
					: this.attr("cy");
			this.type == "rect" ? this.attr({
				x : this.ox + dx,
				y : this.oy + dy
			}) : this.attr({
				cx : this.ox + dx,
				cy : this.oy + dy
			});
			// /*调整快捷工具栏*/
			// resetQuickToolBarPos(this.ox + dx - curx,this.oy
			// + dy - cury,this.quickToolBar); //这里要传的应该是每次的变化量
			// 而dxdy是总的变化量
			resetTextPos(this);
			/* 调整线 */
			if (this.fromline) {
				for ( var i = 0; i < this.fromline.length; i++) {
					connect(this.fromline[i]);
				}
			}
			if (this.toline) {
				for ( var i = 0; i < this.toline.length; i++) {
					connect(this.toline[i]);
				}
			}

		} else if (curlineOn || polylineOn || straightlineOn) {
			this.templine.to = {
				flag : 1,
				x : this.ox + dx,
				y : this.oy + dy
			};
			connect(this.templine);
			this.endX = x;
			this.endY = y;
		}
	};
	/* 拖动结束事件 */
	ProcessNode.prototype.dragEnd = function() {
		this.mouseover(this.procNode.mouseoverEve);// 回复mouseover事件
		// dragStart的时候取消了
		this.mouseover(this.quickToolBar.mouseover); // 回复关于工具栏的事件
		// dragStart的时候取消了
		this.mouseout(this.procNode.mouseoutEve);
		this.mouseout(this.quickToolBar.mouseout);
		// this.text.show();//拖动结束显示文字
		if (defaultOn) {
			autoAdjust(this); // 调整位置;
			/* 调整快捷工具栏 */
			resetQuickToolBarPos(this, this.quickToolBar);
			resetTextPos(this);// 调整文字
			/* 调整线 */
			if (this.fromline) {
				for ( var i = 0; i < this.fromline.length; i++) {
					connect(this.fromline[i]);
				}
			}
			if (this.toline) {
				for ( var i = 0; i < this.toline.length; i++) {
					connect(this.toline[i]);
				}
			}
			if (ie) { // ie下得先对线作一定处理
				ieDragEndFix(this);
			}
			/* 中心坐标 */
			var startCX = this.type == "rect" ? this.ox
					+ this.attr("width") / 2 : this.ox;
			var startCY = this.type == "rect" ? this.oy
					+ this.attr("height") / 2 : this.oy;
			var endCX = this.type == "rect" ? this.attr("x")
					+ this.attr("width") / 2 : this.attr("cx");
			var endCY = this.type == "rect" ? this.attr("y")
					+ this.attr("height") / 2 : this.attr("cy");
			var node = this;
			var undo = function() {
				node.moveTo(startCX, startCY);
			};
			var redo = function() {
				node.moveTo(endCX, endCY);
			};
			addOpera(undo, redo);

		} else if (curlineOn || polylineOn || straightlineOn) { // 三种线随意一种在画就触发
			// this.text.show();//拖动结束显示文字
			this.templine.line.remove();
			this.templine = undefined;
			var toElement = paper.getElementByPoint(this.endX,
					this.endY);
			if (toElement && toElement.type == "text") {
				toElement = toElement.belongNode;
			}// 如果得到是文字，重新指向其对应的节点
			if (toElement && toElement.type == "image") {
				toElement = toElement.belongNode;
			}// 如果得到是文字，重新指向其对应的节点
			if (toElement != null && toElement.id != this.id
					&& toElement.procNode) { // 有元素要连 并且不是自己
				// 且是节点
				var line;
				if (curlineOn) {// 连线 并加进当前对象的toline中 和
					// 另一对象toElement 的fromline中
					// 还加进全局的 lines中
					line = connect(this, toElement, lineColor,
							"curve");
				} else if (polylineOn) {
					line = connect(this, toElement, lineColor,
							"poly");
				} else { // 默认直线
					line = connect(this, toElement, lineColor,
							"straight");
				}
				line.line.attr({
					"arrow-end" : "open-wide-long"
				});
				var undo = function() {
					line.line.hide();
					line.line.visible = false;
					lines.splice(lines.indexOf(line.procLine),
							1);
				};
				var redo = function() {
					line.line.show();
					line.line.visible = true;
					lines.push(line.procLine);
				};
				addOpera(undo, redo);
			}
		}
	};
	ProcessNode.prototype.deleteSelf = function(unre) { // 定义节点自己的删除事件
		// 参数是否添加进回退栈中
		var shape = this;
		this.visible = false;
		this.hide();
		this.quickToolBar.hide();
		this.text.hide();
		this.img.hide();
		nodes.splice(nodes.indexOf(this.procNode), 1);

		for ( var i = 0; i < this.fromline.length; i++) {
			this.fromline[i].line.hide();
			this.fromline[i].line.visible = false;
		}
		for ( var i = 0; i < this.toline.length; i++) {
			this.toline[i].line.hide();
			this.toline[i].line.visible = false;
		}
		if (unre) {
			var undo = function() {
				shape.visible = true;
				shape.show();
				shape.text.show();
				shape.img.show();
				nodes.push(shape.procNode);
				for ( var i = 0; i < shape.fromline.length; i++) {
					shape.fromline[i].line.show();
					shape.fromline[i].line.visible = true;
				}
				for ( var i = 0; i < shape.toline.length; i++) {
					shape.toline[i].line.show();
					shape.toline[i].line.visible = true;
				}
			};
			var redo = function() {
				shape.visible = false;
				shape.hide();
				shape.text.hide();
				shape.img.hide();
				shape.quickToolBar.hide();
				nodes.splice(nodes.indexOf(shape.procNode), 1);
				for ( var i = 0; i < shape.fromline.length; i++) {
					shape.fromline[i].line.hide();
					shape.fromline[i].line.visible = false;
				}
				for ( var i = 0; i < shape.toline.length; i++) {
					shape.toline[i].line.hide();
					shape.toline[i].line.visible = false;
				}
			};
			addOpera(undo, redo);
		}
	};
	// 多选事件
	ProcessNode.prototype.mutichoose = function() {
		this.ischoose = true;
		this.attr({
			stroke : "red",
			"stroke-dasharray" : "- ",
			"stroke-width" : "1"
		});
		choosingObjs.push(this);
	};

	// 单选事件
	ProcessNode.prototype.choose = function() {
		dechooseAll(); // 全否选
		this.ischoose = true;
		this.attr({
			stroke : "red",
			"stroke-dasharray" : "- ",
			"stroke-width" : "1"
		});
		choosingObjs.push(this);
	};
	// 否选事件
	ProcessNode.prototype.dechoose = function() {
		this.ischoose = false;
		this.attr({
			stroke : "black",
			"stroke-dasharray" : "",
			"stroke-width" : "0.5"
		});
		choosingObjs.splice(choosingObjs.indexOf(this), 1);
	};
	
	var showNodeInfo = function(node){
		if(node.procNode.nodeProp.name!="完成点"){
		var div = document.getElementById("nodeDetail");
		if(node.type=="circle"){
			console.log(node);
			div.style.left = (node.attr("cx")+5)+"px";
			div.style.top = node.attr("cy")+"px";
		}else{
			div.style.left = (node.attr("x")+50)+"px";
			div.style.top = (node.attr("y")+20)+"px";
		}
		
		div.style.position = "absolute";
		div.style.display = "block";
		div.innerHTML ="";
		var info = node.procNode.approvalInfo;
		var nodeName = "<p><font color =#000000  ><b>节点名称:</b></font><font face ='"+fontFace+"'>"+info.nodeName+"</font></p>";
		var deptName = "<p><font color =#000000  ><b>审批部门:</b></font><font face ='"+fontFace+"'>"+info.deptName+"</font></p>";
		var personName ="<p><font color =#000000  ><b>审批人:</b></font><font face ='"+fontFace+"'>"+info.personName+"</font></p>";
		var stateStyle='';
		if(info.state=="开始")
		{
			stateStyle = "<font color = '"+agreeColor+"' ><b>"+info.state+"</b></font>";
		}else if(info.state=="待审")
		{
			stateStyle = "<font color = '"+waitColor+"' ><b>"+info.state+"</b></font>";
		}else if(info.state=="同意(完)")
		{
			stateStyle = "<font color = '"+agreeColor+"' ><b>"+info.state+"</b></font>";
		}else if(info.state=="不同意(完)")
		{
			stateStyle = "<font color = '"+disAgreeColor+"' ><b>"+info.state+"</b></font>";
		}else if(info.state=="同意")
		{
			stateStyle = "<font color = '"+agreeColor+"' ><b>"+info.state+"</b></font>";
		}else if(info.state=="不同意")
		{
			stateStyle = "<font color = '"+disAgreeColor+"' ><b>"+info.state+"</b></font>";
		}else if(info.state=="回退")
		{
			stateStyle = "<font color = '"+backColor+"' ><b>"+info.state+"</b></font>";
		}else
		{
			stateStyle = "<font face ='"+fontFace+"'>"+info.state+"</font>";
		}
		var state ="<p><font color =#000000  ><b>状态:</b></font>"+stateStyle+"</p>";
		var content ="<p><font color =#000000  ><b>审批意见:</b></font><font face ='"+fontFace+"'>"+info.content+"</font></p>";
		var startTime ="<p><font color =#000000  ><b>开始时间:</b></font><font face ='"+fontFace+"'>"+info.startTime+"</font></p>";
		var endTime ="<p><font color =#000000  ><b>结束时间:</b></font><font face ='"+fontFace+"'>"+info.endTime+"</font></p>";
		var time = "<p><font color =#000000  ><b>耗时:</b></font><font face ='"+fontFace+"'>"+info.useTime+"</font></p>";
		div.innerHTML=nodeName+deptName+personName+state+content+startTime+endTime+time;
		}
	};
	
	// 将节点移动到某个坐标，参数为中心坐标
	ProcessNode.prototype.haveDel = true; // 有快速删除按钮
	ProcessNode.prototype.haveCre = true; // 有快速创建按钮
	ProcessNode.prototype.haveStr = true; // 有快速直线按钮
	ProcessNode.prototype.havePol = true; // 有快速折线按钮
	ProcessNode.prototype.haveCur = true; // 有快速曲线按钮
	/* 给图形添加事件,子类获得该图形后可重写事件 */
	ProcessNode.prototype.createShape = function() {
		var node = this.getRealShape();
		node.procNode = this; // 给图形一个得到节点的属性，维护关系
		node.fromline = []; // 记录来向线
		node.toline = []; // 记录去向线
		node.visible = true;// 是否可见
		node.ischoose = false;// 是否在选中

		var tools = []; // 创建快速工具按钮
		if (this.haveDel) {
			tools.push(quickDeleteBut(node));
		}
		if (this.haveCre) {
			tools.push(quickCreateBut(node));
		}
		if (this.haveStr) {
			tools.push(quickStraightBut(node));
		}
		if (this.havePol) {
			tools.push(quickPolylineBut(node));
		}
		if (this.haveCur) {
			tools.push(quickCurveBut(node));
		}
		if (node.type == "rect") {// 定义节点自己的快速工具栏
			if(canEdit){
				node.quickToolBar = createQuickToolBar(node
					.attr("x"), node.attr("y"), tools, node);
			}
			
			/* 定义文字对象 */
			node.text = paper.text(
					node.attr("x") + node.attr("width") / 2,
					node.attr("y") + node.attr("height") / 2,
					"节点" + nodeNameCount).attr({
				cursor : "move",
				"font-family" : "微软雅黑",
				"font-size" : "10",
				"fill":nodeTextColor
			});
			node.img = paper.image(nodeImgSrc,node.attr("x")+2,node.attr("y")+6,25,25).attr("cursor","move");
			
		} else {
			if(canEdit){
			node.quickToolBar = createQuickToolBar(node
					.attr("cx"), node.attr("cy"), tools, node);
			}
			/* 定义文字对象 */
			var name = this.haveCre ? "节点" + nodeNameCount
					: "结束点"; // 有创建按钮的圆形是开始点
			node.text = paper.text(node.attr("cx"),
					node.attr("cy")+30, name).attr({
				cursor : "move",
				"font-family" : "微软雅黑",
				"font-size" : "10",
				"fill":nodeTextColor
			});
			if(name=="结束点"){
				node.img = paper.image(endSrc,node.attr("cx")-19,node.attr("cy")-19,38,38).attr("cursor","move");
			}else{
				node.img = paper.image(startSrc,node.attr("cx")-19,node.attr("cy")-19,38,38).attr("cursor","move");
			}
			
		}
		node.text.belongNode = node;// 建立关系
		node.img.belongNode = node;// 建立关系
		if(canEdit){
			createTextDragEve(node.text,node); // 给文字绑定拖动事件
		}
		if(node.type == "rect"){
			node.text.mouseover(function() { // 进入字体时取消节点出去时的两个计时器
				window.clearTimeout(this.timer);
				window.clearTimeout(hideTimerOfRect);
			});
		}else{
//			node.text.mouseover( 
//				node.quickToolBar.mouseover
//			);
//			node.text.mouseout(node.quickToolBar.mouseout);
		}
		if(canEdit){
			node.img.mouseover( // 进入图片时显示快捷栏
				node.quickToolBar.mouseover
			);
			node.img.mouseout( // 进入图片时取消节点出去时的两个计时器
				node.quickToolBar.mouseout
			);
		}else{
			node.img.mouseover(
				function(){
					console.log("img");
					showNodeInfo(node);// 进入图片时显示快捷栏
				}	
			);
			node.img.mouseout(function(){
				//node.quickToolBar.mouseout
				var div = document.getElementById("nodeDetail");
				div.style.display = "none";
			}// 进入图片时取消节点出去时的两个计时器
			);
			
			node.text.mouseover(
				function(){
					console.log("text");
					showNodeInfo(node);// 进入图片时显示快捷栏
				}
				
			);
			node.text.mouseout( function(){
				//node.quickToolBar.mouseout
				var div = document.getElementById("nodeDetail");
				div.style.display = "none";
			}// 进入图片时取消节点出去时的两个计时器
			
			);
		}
		if(canEdit){
		node.text.click(function() {
			if (node.ischoose) {
				if (choosingObjs.length > 1) { // 多选时再点一下这个节点
					node.choose();
				} else {
					node.dechoose();
				}
			} else {
				node.choose();
			}
			if (newtecYeWu) {
				showNodeForm(node.procNode);
			}// 表格显示并设值
		});
		
		node.img.click(function() {
			if (node.ischoose) {
				if (choosingObjs.length > 1) { // 多选时再点一下这个节点
					node.choose();
				} else {
					node.dechoose();
				}
			} else {
				node.choose();
			}
			if (newtecYeWu) {
				showNodeForm(node.procNode);
			}// 表格显示并设值
		});
		}
		
		
		/* 双击改名事件 */
		var renameEve = function() {
			node.text.hide();
			var input = document.createElement("input");
			input.type = "text";
			input.value = node.text.attr("text");
			input.className = "tempInput";
			input.style.left = (node.type == "rect" ? node
					.attr("x") : node.attr("cx")
					- node.attr("r"))
					+ 1 + "px";
			input.style.top = (node.type == "rect" ? node
					.attr("y") : node.attr("cy")+30
					- node.attr("r") / 2)
					+ 1 + "px";
			input.style.width = (node.type == "rect" ? node
					.attr("width") : node.attr("r") * 4 - 2)
					- 2 + "px";
			input.style.height = (node.type == "rect" ? node
					.attr("height") : 38)
					- 2 + "px";
			input.style.position = "absolute";
			input.maxLength = node.type == "rect" ? 8 : 5;
			container.appendChild(input);
			input.focus();
			input.select();
			input.onblur = function() {
				input.style.display = "none";
				var value;
				var n = node.type == "rect" ? 4 : 2;
				if (input.value.split("").length > n) {
					value = input.value.substring(0, n)
							+ "\n"
							+ input.value
									.substring(n, input.value
											.split("").length);
				} else {
					value = input.value;
				}
				if (curShowFormEle == nodeFormEle) { // 设置表单数据
					var inputsN = $(nodeFormEle).find("input");
					for ( var i = 0; i < inputsN.length; i++) {
						if (inputsN[i].name == "name") {
							inputsN[i].value = input.value;
						}
					}
				}
				node.procNode.nodeProp.name = input.value;
				node.text.attr("text", value);
				node.text.show();
			};
			//background.toFront(); // 为了让点到背景
			// 顺利触发onblur事件（点到svg元素是不触发onblur的，而我不知到为什么这个background就能触发。。也是rect）
		};
		node.mouseover(this.mouseoverEve);
		node.mouseout(this.mouseoutEve);
		if(canEdit){
		node.text.dblclick(renameEve);
		node.attr("title", node.text.attr("text"));
		node.dblclick(renameEve);
		node.drag(this.dragMove, this.dragStart, this.dragEnd); // 拖动事件
		node.deleteSelf = this.deleteSelf; // 删除自身的
		node.choose = this.choose; // 选中
		node.dechoose = this.dechoose;// 否选
		node.mutichoose = this.mutichoose; // 多选时自身操作
		node.click(function() {
			if (this.ischoose) {
				if (choosingObjs.length > 1) { // 多选时再点一下这个节点
					this.choose();
				} else {
					this.dechoose();
				}
			} else {
				this.choose();
			}
			showNodeForm(node.procNode);// 表格显示并设值

		});
		}
		return node;
	};
	/* 给图形的实际形状，供子类重写 */
	ProcessNode.prototype.getRealShape = function() {
		var node = paper.rect();
		node.attr({
			x : this.left,
			y : this.top,
			"width" : this.width,
			"height" : this.height,
			fill : nodeColor,
			stroke : nodeBorderColor,
			"stroke-width" : "0.5",
			r : 8
		});
		return node;
	};
	ProcessNode.prototype.getShape = function() {
		return this.shape;
	};
	
	/* 子类 普通节点 */
	var Node = function(left, top, width, height) {
		this.left = parseInt(left);
		this.top = parseInt(top);
		this.width = width;
		this.height = height;
		this.nodeProp = new NodeProp(); // 业务属性
		this.approvalInfo = new approvalInfo();// 审批历史信息		
		this.shape = this.createShape(); // 创建图形

		this.nodeProp.name = this.shape.text.attr("text");
		this.nodeProp.nodeFlag = (defaultNodeFlag += 10);
		this.nodeProp.type = "node";
		this.shape.moveTo = function(cx, cy) {
			this.ox = this.attr("x");// 重设快捷工具栏要用到 移动前的坐标
			this.oy = this.attr("y");
			this.attr("x", cx - this.attr("width") / 2);
			this.attr("y", cy - this.attr("height") / 2);
			// this.type==rect?this.attr("x",""):;
			resetQuickToolBarPos(this, this.quickToolBar); // 调整快捷工具栏
			resetTextPos(this);// 调整文字
			resetLine(this); // 调整线
		};
	};
	
	/* 开始节点 */
	var StartNode = function(left, top, r) {
		this.left = parseInt(left);
		this.top = parseInt(top);
		this.r = r;
		this.nodeProp = new NodeProp();// 业务属性
		this.approvalInfo = new approvalInfo();// 审批历史信息
		this.nodeProp.type = "开始";
		this.nodeProp.nodeFlag = (defaultNodeFlag += 10);
		/* 子类 重写获得的图形 */
		this.getRealShape = function() {
			return paper.circle(this.left + this.r / 2,
					this.top + this.r / 2, r).attr({
				"fill" : nodeColor,
				"stroke-width" : "0.5",
				stroke : nodeBorderColor,
				"fill-opacity":"0"
			});
		};

		this.shape = this.createShape(); // 创建图形
		this.nodeProp.name = this.shape.text.attr("text");
		this.shape.moveTo = function(cx, cy) {
			this.ox = this.attr("cx");// 重设快捷工具栏要用到 移动前的坐标
			this.oy = this.attr("cy");
			this.attr("cx", cx);
			this.attr("cy", cy+19);
			resetQuickToolBarPos(this, this.quickToolBar);
			resetTextPos(this);// 调整文字
			resetLine(this);// 调整线
		};
	};
	/* 结束节点 */
	var EndNode = function(left, top, r) {
		this.left = parseInt(left);
		this.top = parseInt(top);
		this.r = r;
		this.nodeProp = new NodeProp();// 业务属性
		this.approvalInfo = new approvalInfo();// 审批历史信息
		this.nodeProp.type = "完成";
		this.nodeProp.name = "完成点";
		this.nodeProp.nodeFlag = (defaultNodeFlag += 10);
		this.haveCre = false; // 无快速创建按钮
		this.haveStr = false; // 无快速直线按钮
		this.havePol = false; // 无快速折线按钮
		this.haveCur = false; // 无快速曲线按钮
		/* 子类 重写获得的图形 */
		this.getRealShape = function() {
			return paper.circle(this.left + this.r / 2,
					this.top + this.r / 2, r).attr({
				"stroke-width" : 0.5,
				fill : nodeColor,
				stroke : nodeBorderColor,
				"fill-opacity":"0"}).toFront();
		};

		this.shape = this.createShape(); // 创建图形
		this.shape.moveTo = function(cx, cy) {
			this.ox = this.attr("cx");// 重设快捷工具栏要用到 移动前的坐标
			this.oy = this.attr("cy");
			this.attr("cx", cx);
			this.attr("cy", cy);
			resetQuickToolBarPos(this, this.quickToolBar);
			resetTextPos(this);// 调整文字
			resetLine(this);// 调整线
		};
	};
	extend(Node, ProcessNode); // node继承processNode
	extend(StartNode, ProcessNode); // StartNode继承processNode
	extend(EndNode, ProcessNode); // EndNode继承processNode

	function extend(Child, Parent) { // 实现继承
		var F = function() {
		};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
	}
	
	/*
	 * 创建线或重连那条线 参数1：连的对象1，或是一条线对象，会重连那条线并调整位置
	 * 参数2：连的对象2,可能是一个点对象 参数3：线的颜色 参数4：线的类型 不填是直线 curve是曲线
	 * poly是折线 参数5：背景线 位置与主线一样 但是可以控制颜色和粗细 来达到更好的效果
	 * color|strokeWidth 曲线
	 */
	var connect = function(obj1, obj2, line, type, bg) {
		if (obj1.line && obj1.from && obj1.to) {
			line = obj1;
			obj1 = line.from;
			obj2 = line.to;
			type = line.type;
		}
		// 算出两个对象的八个点
		//console.log(obj2);
		var bb1 = obj1.getBBox(), bb2 = obj2.flag == undefined ? obj2
				.getBBox()
				: {
					x : obj2.x,
					y : obj2.y,
					//x : obj2.x-137,
					//y : obj2.y-388,
					width : 0,
					height : 0
				};
		p = [ {
			x : bb1.x + bb1.width / 2,
			y : bb1.y - 1
		}, {
			x : bb1.x + bb1.width / 2,
			y : bb1.y + bb1.height + 1
		}, {
			x : bb1.x - 1,
			y : bb1.y + bb1.height / 2
		}, {
			x : bb1.x + bb1.width + 1,
			y : bb1.y + bb1.height / 2
		}, {
			x : bb2.x + bb2.width / 2,
			y : bb2.y - 1
		}, {
			x : bb2.x + bb2.width / 2,
			y : bb2.y + bb2.height + 1
		}, {
			x : bb2.x - 1,
			y : bb2.y + bb2.height / 2
		}, {
			x : bb2.x + bb2.width + 1,
			y : bb2.y + bb2.height / 2
		} ], d = {}, dis = [];
		// 找出可能的组合并把距离存起来
		for ( var i = 0; i < 4; i++) {
			for ( var j = 4; j < 8; j++) {
				var dx = Math.abs(p[i].x - p[j].x), dy = Math
						.abs(p[i].y - p[j].y);
				if ((i == j - 4)
						|| (((i != 3 && j != 6) || p[i].x < p[j].x)
								&& ((i != 2 && j != 7) || p[i].x > p[j].x)
								&& ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
					if (type === "curve" || type === "poly") {
						dis.push(dx + dy);
						d[dis[dis.length - 1]] = [ i, j ];
					} else {
						dis.push(Math.sqrt(dx * dx + dy * dy));
						d[dis[dis.length - 1]] = [ i, j ];
					}
				}
			}
		}
		// 找出最小距离
		if (dis.length == 0) {
			var res = [ 0, 4 ];
		} else {
			res = d[Math.min.apply(Math, dis)];
		}
		// 根据 找到的最小距离配对 的两个点 的位置 决定控制点
		var x1 = p[res[0]].x, y1 = p[res[0]].y, x4 = p[res[1]].x, y4 = p[res[1]].y;
		dx = Math.max(Math.abs(x1 - x4) / 2, 10);
		dy = Math.max(Math.abs(y1 - y4) / 2, 10);
		var x2 = [ x1, x1, x1 - dx, x1 + dx ][res[0]]
				.toFixed(3), y2 = [ y1 - dy, y1 + dy, y1, y1 ][res[0]]
				.toFixed(3), x3 = [ 0, 0, 0, 0, x4, x4,
				x4 - dx, x4 + dx ][res[1]].toFixed(3), y3 = [
				0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4 ][res[1]]
				.toFixed(3);

		// 开始决定线的路径 M 第一个点 C 控制点1 控制点2 第二个点 （曲线）（svg path）
		var path;
		if (type === "curve") {
			path = [ "M", x1.toFixed(3), y1.toFixed(3), "C",
					x2, y2, x3, y3, x4.toFixed(3),
					y4.toFixed(3) ].join(",");
		} else if (type === "poly") {
			path = [ "M", x1.toFixed(3), y1.toFixed(3), "L",
					x2, y2, "L", x3, y3, "L", x4.toFixed(3),
					y4.toFixed(3) ].join(",");
		} else {
			path = [ "M", x1.toFixed(3), y1.toFixed(3), "L",
					x4.toFixed(3), y4.toFixed(3) ].join(",");
		}

		if (line && line.line) {
			line.bg && line.bg.attr({
				path : path
			});
			line.line.attr({
				path : path
			});
		} else {
			var color = typeof line == "string" ? line : "#000";
			var processLine = new ProcessLine(obj1, obj2, path,
					type, color, bg); // 创建流程线对象
			var line = processLine.getLine(); // 获取线对象
			// 把线放进节点中 注意是以上的线对象
			if (obj2.toline) {// 有时候可能是暂时线，有这个属性证明不是暂时线构造的对象
				obj1.toline.push(line);
			}
			if (obj2.fromline) {
				obj2.fromline.push(line);
				lines.push(processLine);
			} // 全局放流程线对象
			return line;
		}
	};
	
	/*
	 * 流程线 分三级 ProcessLine lineObj line ProcessLine.lineObj 得到
	 * lineObj line.lineObj 得到 lineObj lineObj.procLine
	 * 得到ProcessLine lineObj.line 得到line
	 */
	var ProcessLine = function(obj1, obj2, path, type, color,
			bg) {
		this.lineProp = new LineProp();// 业务属性
		/* 流程线属性 */
		this.createLine = function() {
			var lineObj = {};// 操作线的对象
			lineObj.line = paper.path(path).attr({
				stroke : color,
				fill : "none",
				cursor : "pointer"
			});// ,"arrow-end":"open-wide-long"
			lineObj.bg = bg && bg.split
					&& paper.path(path).attr({
						stroke : bg.split("|")[0],
						fill : "none",
						"stroke-width" : bg.split("|")[1] || 3
					});
			lineObj.from = obj1;
			lineObj.to = obj2;
			lineObj.type = type;
			lineObj.procLine = this; // 维护关系
			lineObj.line.isChooing = false;

			var realLine = lineObj.line;
			realLine.lineObj = lineObj;
			realLine.visible = true;
			realLine.ischoose = false;
			realLine.choose = function() {
				dechooseAll(); // 把其它都否选
				this.ischoose = true;
				this.attr({
					stroke : "red",
					"stroke-dasharray" : "- "
				});
				choosingObjs.push(this);
			};
			realLine.dechoose = function() {
				this.ischoose = false;
				this.attr({
					stroke : "black",
					"stroke-dasharray" : ""
				});
				choosingObjs.splice(choosingObjs.indexOf(this),
						1);
			};
			realLine.click(function() {
				if (realLine.ischoose) {
					this.dechoose();
				} else {
					this.choose();
				}
				if (newtecYeWu) {
					showLineForm(lineObj.procLine);
				}
			});
			realLine.deleteSelf = function(unre) {
				this.hide();
				this.visible = false;
				lines.splice(this.lineObj.procLine, 1);
				this.lineObj.from.toline.splice(
						this.lineObj.from.toline
								.indexOf(this.lineObj), 1);
				this.lineObj.to.fromline.splice(
						this.lineObj.to.fromline
								.indexOf(this.lineObj), 1);
				if (unre) {
					var undo = function() {
						this.show();
						this.visible = true;
						this.lineObj.from.toline.push(this);
						this.lineObj.to.fromline.push(this);
						lines.push(this.lineObj.procLine);
					};
					var redo = function() {
						this.hide();
						this.visible = false;
						this.lineObj.from.toline.splice(
								this.lineObj.from.toline
										.indexOf(this.lineObj),
								1);
						this.lineObj.to.fromline.splice(
								this.lineObj.to.fromline
										.indexOf(this.lineObj),
								1);
						lines.splice(this.lineObj.procLine, 1);
					};
					addOpera(undo, redo);
				}
			};
			return lineObj;
		};

		this.getLine = function() {
			return line;
		};

		var line = this.createLine();
	};
	
	function addOpera(undo, redo) {
		undoStack.push({
			undo : undo,
			redo : redo
		});
		redoStack.splice(0);// 每次添加操作清空重做栈
	};
	
	/* 显示表格并设置数据 */
	function showNodeForm(processNode) {
		if (curFocusInput) { // 选择节点时 先判断有没有触发blur
			curFocusInput.blur();
		}

		curShowFormEle.style.display = "none";//隐藏当前显示的form
		if(curShowFormEle.style.width!="0%"){//若表单为展开状态
			nodeFormEle.style.display = "block";
			nodeFormEle.style.right="0";
			nodeFormEle.style.width="30%";
		}
		curShowFormEle = nodeFormEle;
		curShowForm = nodeForm;
		curNode = processNode;
		
		var inputs = $(nodeFormEle).find("input");
		for ( var i = 0; i < inputs.length; i++) {
			inputs[i].value = curNode.nodeProp[inputs[i].name];
		}

	}
	

	/* 显示表格并设置数据 */
	function showLineForm(processLine) {
		curShowFormEle.style.display = "none";
		if(curShowFormEle.style.width!="0%"){
		lineFormEle.style.display = "block";
		lineFormEle.style.right="0";
		lineFormEle.style.width="30%";
		}
		curShowFormEle = lineFormEle;
		curShowForm = lineForm;
		curLine = processLine;

		var inputs = $(lineFormEle).find("input");
		for ( var i = 0; i < inputs.length; i++) {
			inputs[i].value = curLine.lineProp[inputs[i].name];
		}
	}
	
	/* 节点业务属性 */
	function NodeProp() {
		this.id = "";
		this.processId = "";
		this.key = ""; // 流程定义标记
		this.nodeFlag = ""; // 节点标记
		this.name = ""; // 节点名称
		this.departmentId = ""; // 节点审批部门Id(部门Id存在时，部门名称也必须存在)
		this.departmentName = "";
		this.userName = ""; // 审批账号(账号存在时，名字也必须存在；多个用户用分号分割)
		this.personName = ""; // 节点审批用户名字
		this.toNodeFlag = ""; // 下一个节点（下个节点如果连接两个 则用逗号分隔开）
		this.type = ""; // 节点类型 start:开始节点 node:中间节点 end:结束节点
		this.juheNodeUser = "and"; // 聚合点分支类型
		this.juheNodeProcess = "and"; // 聚合点分支类型
		this.complateTaskBefore = "";
		this.complateTaskAfter = "";
		this.conditionData = "";
		this.positionX = "";
		this.positionY = "";
	}
	/* 流程业务属性 */
	function ProcessProp() {
		this.id = "";
		this.key = "";
		this.version = "";
		this.name = "";
		this.status = "";
		this.createTime = "";
		this.updateTime = "";
		this.createPersonName = "";
		this.createPersonId = "";
		this.createDepartmentName = "";
		this.createDepartmentId = "";
		this.description = "";
		this.areaDesc = "";
		this.startProcessBefore = "";
		this.startProcessAfter = "";
		this.finshProcessBefore = "";
		this.finshProcessAfter = "";
		this.imports = "";
		this.bussClass = "";
	}
	/* 线的业务属性 */
	function LineProp() {
		this.conditionProcessRemark = ""; // 流程流向条件描述
		this.conditionData = ""; // 数据条件条件
		this.conditionProcess = ""; // 流程流向条件
	}
	
	/* 快速删除按钮 */
	function quickDeleteBut(node) {
		var deleteBut = paper
				.image(deleteButBSrc, 0, 0, 16, 16);
		// var deleteButOver =
		// paper.image("../image/rubbish-red.png");
		deleteBut.hide();

		deleteBut.mouseover(function() {
			deleteBut.attr("src", deleteButRSrc);
		})
		deleteBut.mouseout(function() {
			deleteBut.attr("src", deleteButBSrc);
		})
		deleteBut.click(function() {
			node.deleteSelf(true);
		});
		return deleteBut;
	}
	/* 快速创建按钮 */
	function quickCreateBut(node) {
		var createBut = paper
				.image(createButBSrc, 0, 0, 16, 16);
		// var deleteButOver =
		// paper.image("../image/rubbish-red.png");
		createBut.hide();

		createBut.mouseover(function() {
			createBut.attr("src", createButRSrc);
		})
		createBut.mouseout(function() {
			createBut.attr("src", createButBSrc);
		})
		createBut.click(function() {
			var x = node.type == "rect" ? node.attr("x") : node
					.attr("cx")
					- node.attr("r");
			var y = node.type == "rect" ? node.attr("y") : node
					.attr("cy")
					- node.attr("r");
			var node1 = new Node(x + 140, y, 100, 38); // 产生一个抽象节点
			// 此时
			// getShape()后才是那个图形
			nodes.push(node1);
			var nodeShape = node1.getShape();
			var line = connect(node, nodeShape, "#000");

			var undo = function() {
				nodeShape.hide();
				line.line.hide();
				nodes.splice(nodes.indexOf(node1), 1);
				lines.splice(lines.indexOf(line.procLine), 1);
			}
			var redo = function() {
				nodeShape.show();
				line.line.show();
				nodes.push(node1);
				lines.push(line.proCLine);
			}
			addOpera(undo, redo);
		});
		return createBut;
	}

	/* 快速直线按钮 */
	function quickStraightBut(node) {
		var straightBut = paper.image(straightButBSrc, 0, 0,
				16, 16);
		// var deleteButOver =
		// paper.image("../image/rubbish-red.png");
		straightBut.hide();

		straightBut.mouseover(function() {
			straightBut.attr("src", straightButRSrc);
		})
		straightBut.mouseout(function() {
			straightBut.attr("src", straightButBSrc);
		})
		var dragStart = function(x, y, e) {
			this.ox = e.offsetX;
			this.oy = e.offsetY;
			this.templine = connect(node, {
				flag : 1,
				x : e.offsetX,
				y : e.offsetY
			}, lineColor, "straight");
			// this.ox = x-getPaperLeft();
			// this.oy = y-getPaperTop();
			// this.templine =
			// connect(node,{flag:1,x:x-getPaperLeft(),y:y-getPaperTop()},lineColor,"straight");
		}
		var dragMove = function(dx, dy, x, y) {
			this.templine.to = {
				flag : 1,
				x : this.ox + dx,
				y : this.oy + dy
			};
			connect(this.templine);
			this.endX = x;
			this.endY = y;
		}
		var dragEnd = function() {
			this.templine.line.remove();
			this.templine = undefined;
			var toElement = paper.getElementByPoint(this.endX,
					this.endY);
			if (toElement && toElement.type == "text") {
				toElement = toElement.belongNode;
			}// 如果得到是文字，重新指向其对应的节点
			if (toElement && toElement.type == "image") {
				toElement = toElement.belongNode;
			}// 如果得到是图片，重新指向其对应的节点
			if (toElement != null && toElement.id != this.id
					&& toElement.procNode) { // 有元素要连 并且不是自己
				// 且是节点
				var line = connect(node, toElement, lineColor,
						"straight");
				line.line.attr({
					"arrow-end" : "open-wide-long"
				});
				var undo = function() {
					line.line.hide();
					lines.splice(lines.indexOf(line.procLine),
							1);
				};
				var redo = function() {
					line.line.show();
					lines.push(line.procLine);
				};
				addOpera(undo, redo);
			}
		}
		straightBut.drag(dragMove, dragStart, dragEnd);

		return straightBut;
	}
	/* 快速折线按钮 */
	function quickPolylineBut(node) {
		var polylineBut = paper.image(polylineButBSrc, 0, 0,
				16, 16);
		// var deleteButOver =
		// paper.image("../image/rubbish-red.png");
		polylineBut.hide();

		polylineBut.mouseover(function() {
			polylineBut.attr("src", polylineButRSrc);
		});
		polylineBut.mouseout(function() {
			polylineBut.attr("src", polylineButBSrc);
		});
		var dragStart = function(x, y, e) {
			this.ox = e.offsetX;
			this.oy = e.offsetY;
			this.templine = connect(node, {
				flag : 1,
				x : e.offsetX,
				y : e.offsetY
			}, lineColor, "poly");
			// this.ox = x-getPaperLeft();
			// this.oy = y-getPaperTop();
			// this.templine =
			// connect(node,{flag:1,x:x-getPaperLeft(),y:y-getPaperTop()},lineColor,"poly");
		}
		var dragMove = function(dx, dy, x, y) {
			this.templine.to = {
				flag : 1,
				x : this.ox + dx,
				y : this.oy + dy
			};
			connect(this.templine);
			this.endX = x;
			this.endY = y;
		}
		var dragEnd = function() {
			this.templine.line.remove();
			this.templine = undefined;
			var toElement = paper.getElementByPoint(this.endX,
					this.endY);
			if (toElement && toElement.type == "text") {
				toElement = toElement.belongNode;
			}// 如果得到是文字，重新指向其对应的节点
			if (toElement != null && toElement.id != this.id
					&& toElement.procNode) { // 有元素要连 并且不是自己
				// 且是节点
				var line = connect(node, toElement, lineColor,
						"poly");
				line.line.attr({
					"arrow-end" : "open-wide-long"
				});
				var undo = function() {
					line.line.hide();
					lines.splice(lines.indexOf(line.procLine),
							1);
				};
				var redo = function() {
					line.line.show();
					lines.push(line.procLine);
				};
				addOpera(undo, redo);
			}
		}
		polylineBut.drag(dragMove, dragStart, dragEnd);
		return polylineBut;
	}
	/* 快速曲线按钮 */
	function quickCurveBut(node) {
		var curveBut = paper.image(curveButBSrc, 0, 0, 16, 16);
		// var deleteButOver =
		// paper.image("../image/rubbish-red.png");
		curveBut.hide();

		curveBut.mouseover(function() {
			curveBut.attr("src", curveButRSrc);
		})
		curveBut.mouseout(function() {
			curveBut.attr("src", curveButBSrc);
		})
		var dragStart = function(x, y, e) {
			this.ox = e.offsetX;
			this.oy = e.offsetY;
			this.templine = connect(node, {
				flag : 1,
				x : e.offsetX,
				y : e.offsetY
			}, lineColor, "curve");
			// this.ox = x-getPaperLeft();
			// this.oy = y-getPaperTop();
			// this.templine =
			// connect(node,{flag:1,x:x-getPaperLeft(),y:y-getPaperTop()},lineColor,"curve");
		}
		var dragMove = function(dx, dy, x, y) {
			this.templine.to = {
				flag : 1,
				x : this.ox + dx,
				y : this.oy + dy
			};
			connect(this.templine);
			this.endX = x;
			this.endY = y;
		}
		var dragEnd = function() {
			this.templine.line.remove();
			this.templine = undefined;
			var toElement = paper.getElementByPoint(this.endX,
					this.endY);
			if (toElement && toElement.type == "text") {
				toElement = toElement.belongNode;
			}// 如果得到是文字，重新指向其对应的节点
			if (toElement != null && toElement.id != this.id
					&& toElement.procNode) { // 有元素要连 并且不是自己
				// 且是节点
				var line = connect(node, toElement, lineColor,
						"curve");
				line.line.attr({
					"arrow-end" : "open-wide-long"
				});
				var undo = function() {
					line.line.hide();
					lines.splice(lines.indexOf(line.procLine),
							1);
				};
				var redo = function() {
					line.line.show();
					lines.push(line.procLine);
				};
				addOpera(undo, redo);
			}
		}
		curveBut.drag(dragMove, dragStart, dragEnd);
		return curveBut;
	}
	var hideTimerOfRect; // 计时器 弄成全局方便取消
	
	/* 创建快速工具栏 */
	function createQuickToolBar(x, y, quickTools, node) {
		var width1 = 64; // 横的长
		var width2 = 63; // 竖的长
		var height = 22; // 共有宽
		var leftX; // 左上角X
		var topY; // 左上角Y
		if (node.type == "rect") {
			leftX = x + height - 2+40; // 左上角X
			topY = y - height; // 左上角Y
		} else {

			leftX = x - node.attr("r") - 2; // 左上角X
			topY = y - node.attr("r") - height - 1; // 左上角Y
		}
		var rightX = leftX + width1;
		var midY = topY + height;
		var midX = rightX - height;
		var butY = topY + width2;
		var piancha = 10;
		var path = [ "M", leftX + piancha, topY, "L",
				rightX - piancha, topY, "Q", rightX, topY,
				rightX, topY + piancha, "L", rightX,
				butY - piancha, "Q", rightX, butY,
				rightX - piancha, butY, "L", midX + piancha,
				butY, "Q", midX, butY, midX, butY - piancha,
				"L", midX, midY + piancha, "Q", midX, midY,
				midX - piancha, midY, "L", leftX + piancha,
				midY, "Q", leftX, midY, leftX, midY - piancha,
				"L", leftX, topY + piancha, "Q", leftX, topY,
				leftX + piancha, topY ].join(",");

		var quickToolBar = paper.path(path);
		quickToolBar.attr({
			fill : "#c1dbf3",
			"stroke-width" : 1,
			stroke : "#B2AFAF",
			"fill-opacity" : 0.7
		});
		if (!quickTools) {
			quickTools = []
		}
		;

		for ( var i = 0; i < quickTools.length; i++) {
			// 这里把组件放到特定位置 并和按钮建立关系
			var x = leftX + 4 + (i <= 2 ? i * 20 : 2 * 20);
			var y = topY + 3 + (i <= 2 ? 0 : (i - 2) * 20);
			quickTools[i].toFront();
			quickTools[i].attr({
				x : x,
				y : y
			});
			quickTools[i].hide();
			quickTools[i].bar = quickToolBar;
		}

		quickToolBar.hide();

		var hideTimerOfBar;

		/* 给所属的节点加事件和工具栏交互，并返回这两个事件给节点控制 */
		var nodeMouseover = function() {
			showAll();
			window.clearTimeout(hideTimerOfBar); // 把快捷工具条的计时器取消
		};

		var nodeMouseout = function() {
			hideTimerOfRect = window.setTimeout(function() {
				hideAll();
			}, 20); // 200毫秒后隐藏
		}
		node.mouseover(nodeMouseover);
		node.mouseout(nodeMouseout);
		quickToolBar.mouseover(function() {
			if (hideTimerOfRect)
				clearTimeout(hideTimerOfRect)
		}); // 把节点的计时器取消
		quickToolBar.mouseout(function() {
			hideTimerOfBar = window.setTimeout(function() {
				hideAll();
			}, 20); // 20毫秒后隐藏
		});

		for ( var i = 0; i < quickTools.length; i++) { // 给工具栏上面的工具加over事件
			// 取消工具栏的out事件计时器
			quickTools[i].mouseover(function() {
				window.clearTimeout(hideTimerOfBar);
			})
		}

		var showAll = function() {
			quickToolBar.show();
			for ( var i = 0; i < quickTools.length; i++) {
				quickTools[i].show();
			}
		}
		var hideAll = function() {
			quickToolBar.hide();
			for ( var i = 0; i < quickTools.length; i++) {
				quickTools[i].hide();
			}
		}

		return {
			bar : quickToolBar,
			tools : quickTools,
			show : showAll,
			hide : hideAll,
			mouseover : nodeMouseover,
			mouseout : nodeMouseout
		};
	}
	
	function createTextDragEve(text, node) {
		var dragmove = function(dx, dy, x, y) {
			if (defaultOn) {
				var curx = node.type == "rect" ? node.attr("x")
						: node.attr("cx");
				var cury = node.type == "rect" ? node.attr("y")
						: node.attr("cy");
				node.type == "rect" ? node.attr({
					x : node.ox + dx,
					y : node.oy + dy
				}) : node.attr({
					cx : node.ox + dx,
					cy : node.oy + dy
				});
				// /*调整快捷工具栏*/
				// resetQuickToolBarPos(node.ox + dx -
				// curx,node.oy + dy - cury,node.quickToolBar);
				// //这里要传的应该是每次的变化量 而dxdy是总的变化量
				resetTextPos(node);// 调整文字
				/* 调整线 */
				if (node.fromline) {
					for ( var i = 0; i < node.fromline.length; i++) {
						connect(node.fromline[i]);
					}
				}
				if (node.toline) {
					for ( var i = 0; i < node.toline.length; i++) {
						connect(node.toline[i]);
					}
				}

			} else if (curlineOn || polylineOn
					|| straightlineOn) {
				if(node.type=="circle"){
					node.templine.to = {
							flag : 1,
							x : (node.ox + dx)/2+40,
							y : (node.oy + dy)/2
						};
				}else{
					node.templine.to = {
							flag : 1,
							x : node.ox + dx,
							y : node.oy + dy
						};
				}
				
				//console.log((node.ox + dx)/2+","+(node.oy + dy)/2)
				connect(node.templine);
				node.endX = x;
				node.endY = y;
			}
		}
		var dragstart = function(x, y, e) {
			/* 为了拖动时不显示快捷工具栏 */
			node.unmouseover();// 先取消mouseover事件 在dragEnd重新启用
			node.unmouseout();
			node.quickToolBar.hide();
			// node.text.hide(); //拖动开始隐藏文字
			if (defaultOn) {
				if (ie) { // ie下得先对线作一定处理
					ieDragStartFix(node);
				}
				node.ox = node.type == "rect" ? node.attr("x")
						: node.attr("cx");
				node.oy = node.type == "rect" ? node.attr("y")
						: node.attr("cy");
			} else if (curlineOn || polylineOn
					|| straightlineOn) {
				// 因为点击的是字体 所以要获取字体的左上角坐标 而且加上offsetX 还是会有点偏差
				// 因为字体的x y是字体的中心点 无伤大雅
				node.ox = node.text.attr("x") + e.offsetX;
				node.oy = node.text.attr("y") + e.offsetY;
				if (curlineOn) {
					
					if(node.type=="circle"){
						console.log(e.offsetX+","+e.offsetY)
						node.templine = connect(node, {
							flag : 1,
							x : e.offsetX,
							y : e.offsetY
						}, lineColor, "curve");
					}else{
						node.templine = connect(node, {
							flag : 1,
							x : node.ox,
							y : node.oy
						}, lineColor, "curve");
					}
				} else if (polylineOn) {
					node.templine = connect(node, {
						flag : 1,
						x : node.ox,
						y : node.oy
					}, lineColor, "poly");
					if(node.type=="circle"){
						node.templine = connect(node, {
							flag : 1,
							x : e.offsetX,
							y : e.offsetX
						}, lineColor, "poly");
					}
				} else {
					node.templine = connect(node, {
						flag : 1,
						x : node.ox,
						y : node.oy
					}, lineColor, "straight");
					if(node.type=="circle"){
						node.templine = connect(node, {
							flag : 1,
							x : e.offsetX,
							y : e.offsetX
						}, lineColor, "straight");
					}
				}

				// node.ox = nodex+e.offsetX;
				// node.oy = nodey+e.offsetY;
			}
		};
		var dragend = function() {
			node.mouseover(node.procNode.mouseoverEve);// 回复mouseover事件
			// dragStart的时候取消了
			node.mouseover(node.quickToolBar.mouseover); // 回复关于工具栏的事件
			// dragStart的时候取消了
			node.mouseout(node.procNode.mouseoutEve);
			node.mouseout(node.quickToolBar.mouseout);
			// node.text.show();//拖动结束显示文字

			if (defaultOn) {
				autoAdjust(node); // 调整位置;
				/* 调整快捷工具栏 */
				resetQuickToolBarPos(node, node.quickToolBar);
				resetTextPos(node);// 调整文字
				/* 调整线 */
				if (node.fromline) {
					for ( var i = 0; i < node.fromline.length; i++) {
						connect(node.fromline[i]);
					}
				}
				if (node.toline) {
					for ( var i = 0; i < node.toline.length; i++) {
						connect(node.toline[i]);
					}
				}
				if (ie) { // ie下得先对线作一定处理
					ieDragEndFix(node);
				}
				/* 中心坐标 */
				var startCX = node.type == "rect" ? node.ox
						+ node.attr("width") / 2 : node.ox;
				var startCY = node.type == "rect" ? node.oy
						+ node.attr("height") / 2 : node.oy;
				var endCX = node.type == "rect" ? node
						.attr("x")
						+ node.attr("width") / 2 : node
						.attr("cx");
				var endCY = node.type == "rect" ? node
						.attr("y")
						+ node.attr("height") / 2 : node
						.attr("cy");

				var undo = function() {
					node.moveTo(startCX, startCY);
				};
				var redo = function() {
					node.moveTo(endCX, endCY);
				};
				addOpera(undo, redo);

			} else if (curlineOn || polylineOn
					|| straightlineOn) { // 三种线随意一种在画就触发
				node.text.show();// 拖动结束显示文字
				node.templine.line.remove();
				node.templine = undefined;
				var toElement = paper.getElementByPoint(
						node.endX, node.endY);
				if (toElement && toElement.type == "text") {
					toElement = toElement.belongNode;
				}// 如果得到是文字，重新指向其对应的节点
				if (toElement != null
						&& toElement.id != node.id
						&& toElement.procNode) { // 有元素要连
					// 并且不是自己
					// 且是节点
					var line;
					if (curlineOn) {// 连线 并加进当前对象的toline中 和
						// 另一对象toElement 的fromline中
						// 还加进全局的 lines中
						line = connect(node, toElement,
								lineColor, "curve");
					} else if (polylineOn) {
						line = connect(node, toElement,
								lineColor, "poly");
					} else { // 默认直线
						line = connect(node, toElement,
								lineColor, "straight");
					}
					line.line.attr({
						"arrow-end" : "open-wide-long"
					});
					var undo = function() {
						line.line.hide()
						line.line.visible = false;
						lines.splice(lines
								.indexOf(line.procLine), 1);
					};
					var redo = function() {
						line.line.show();
						line.line.visible = true;
						lines.push(line.procLine);
					};
					addOpera(undo, redo);
				}
			}
		};

		text.drag(dragmove, dragstart, dragend);
		node.img.drag(dragmove, dragstart, dragend);
	}
	
	function resetTextPos(node) {
		if (node.type == "rect") {// 定义节点自己的快速工具栏
			node.text.attr({
				x : node.attr("x") + node.attr("width") / 2,
				y : node.attr("y") + node.attr("height") / 2
			});
			node.img.attr({
				x : node.attr("x")+2,
				y : node.attr("y")+6
			});
		} else {
			node.text.attr({
				x : node.attr("cx"),
				y : node.attr("cy")+30
			});
			
			node.img.attr({
				x : node.attr("cx")-19,
				y : node.attr("cy")-19
			});
			
		}
	}
	// 拖动结束时 节点自动对齐
	function autoAdjust(node) {
		var piancha = 8;
		var closestX = 10000;// 最近的X
		var closestY = 10000; // 最近的Y
		var nodeCx = node.type == "rect" ? node.attr("x")
				+ node.attr("width") / 2 : node.attr("cx");
		var nodeCy = node.type == "rect" ? node.attr("y")
				+ node.attr("height") / 2 : node.attr("cy");

		for ( var i = 0; i < nodes.length; i++) {

			var shape = nodes[i].getShape();
			if (shape.id === node.id)
				continue; // 跳过自己
			var cx;
			var cy;
			if (shape.type == "rect") {
				cx = shape.attr("x") + shape.attr("width") / 2;
				cy = shape.attr("y") + shape.attr("height") / 2;
			} else {
				cx = shape.attr("cx");
				cy = shape.attr("cy");
			}
			Math.abs(nodeCx - cx) < Math.abs(nodeCx - closestX) ? closestX = cx
					: true;
			Math.abs(nodeCy - cy) < Math.abs(nodeCy - closestY) ? closestY = cy
					: true;
		}

		if (Math.abs(nodeCx - closestX) < piancha) { // 如果X轴离得最近的节点
			// 靠的足够近
			// 就把当前节点
			// 靠过去
			if (node.type == "rect") {
				node.attr("x", closestX - node.attr("width")
						/ 2);
			} else {
				node.attr("cx", closestX);
			}
		}

		if (Math.abs(nodeCy - closestY) < piancha) { // 如果X轴离得最近的节点
			// 靠的足够近
			// 就把当前节点
			// 靠过去
			if (node.type == "rect") {
				node.attr("y", closestY - node.attr("height")
						/ 2);
			} else {
				node.attr("cy", closestY);
			}
		}

	}

	function ieDragStartFix(node) { // ie 下线移动前的修复
		var allLines = node.fromline.concat(node.toline); // 拖动时先把箭头弄掉不然
		// ie下线是不能正常移动的
		for ( var i = 0; i < allLines.length; i++) {
			var line = allLines[i].line;
			var from = allLines[i].from;
			var to = allLines[i].to;
			var type = allLines[i].type;

			// lines.splice(lines.indexOf(allLines[i].procLine),
			// 1); //全局保存线的去掉这条线
			// var index = from.toline.indexOf(allLines[i]);
			// from.toline.splice(from.toline.indexOf(allLines[i]),
			// 1); //节点也把这条线删了
			// var index1 = from.toline.indexOf(allLines[i]);
			// to.fromline.splice(to.fromline.indexOf(allLines[i]),
			// 1);

			var newline = connect(from, to, lineColor, type); // 重连这条线
			// 是没有箭头的
			// 只取其形状
			// 即newline.line
			/* 因为connect时把线对象也加进全局保存的数组中,维护了关系， 所以要去掉关系 */
			lines.splice(lines.indexOf(newline.procLine), 1);
			from.toline.splice(from.toline.indexOf(newline), 1); // 节点也把这条线删了
			to.fromline.splice(to.fromline.indexOf(newline), 1);

			if (!from.visible || !to.visible) {// 任意一个节点是被删除了的就隐藏新创建的线
				newline.line.hide();
				newline.line.visible = false;
			}
			if (!line.visible) { // 如果原来的线是隐藏的，新线也隐藏
				newline.line.hide();
				newline.line.visible = false;
			}
			line.remove(); // 把原来的线去掉
			allLines[i].line = newline.line;// 保留原来的线对象，保留关系,改变其线形状.让其指向新的线形状
		}
	}
	function ieDragEndFix(node) {// ie 下线移动后的修复
		var allLines = node.fromline.concat(node.toline); // 拖动结束把箭头显示
		for ( var i = 0; i < allLines.length; i++) {
			allLines[i].line
					.attr("arrow-end", "open-wide-long");
		}
	}
	
	
	/* 重设快速工具栏的位置 */
	function resetQuickToolBarPos(node, quickToolBar) {
		var bar = quickToolBar.bar;
		var tools = quickToolBar.tools;
		var dx = (node.type == "rect" ? node.attr("x") : node
				.attr("cx"))
				- node.ox;
		var dy = (node.type == "rect" ? node.attr("y") : node
				.attr("cy"))
				- node.oy;
		bar.translate(dx, dy);
		for ( var i = 0; i < tools.length; i++) {
			tools[i].translate(dx, dy);
		}
	}
	/* 全部否选事件 */
	function dechooseAll() {
		for ( var i = 0; i < choosingObjs.length; i++) { // 把其它点都否选
			choosingObjs[i].ischoose = false;
			if (choosingObjs[i].type == "rect"
					|| choosingObjs[i].type == "circle") {
				choosingObjs[i].attr({
					stroke : "black",
					"stroke-dasharray" : "",
					"stroke-width" : "0.5"
				});
			} else {
				choosingObjs[i].attr({
					stroke : "black",
					"stroke-dasharray" : ""
				});
			}
		}
		choosingObjs.splice(0);
	}
	
	function writeObj(obj) {
		var description = "";
		for ( var i in obj) {
			var property = obj[i];
			description += i + " = " + property + "\n";
		}
		console.log(description);
	};
	
	// 根据移动的节点重设线的位置
	function resetLine(node) {
		if (ie) {// 如果是IE 要先把箭头去掉
			ieDragStartFix(node);
		}
		if (node.fromline) {
			for ( var i = 0; i < node.fromline.length; i++) {
				connect(node.fromline[i]);
			}
		}
		if (node.toline) {
			for ( var i = 0; i < node.toline.length; i++) {
				connect(node.toline[i]);
			}
		}
		if (ie) {
			ieDragEndFix(node);
		}
	}
	/*-----------------------------------------------脚本编辑器------------------------------------------------*/
	var editor
	function createCodeHint(value, input) {
		var win = Newtec.Window
				.create({
					title : '脚本编辑器',
					width : 1024,
					height : 600,
					body : '<iframe id ="codeEditor" src="thirdparty/codemirror/lib/codeEditor/html/codeEditor.html" width="990" height="560" frameborder="0"></iframe>',
					finsh : function() {
						var ifrWin = document
								.getElementById("codeEditor").contentWindow; // 获取编辑器页面的window对象
						ifrWin.initEditorContext(value); // 设置值
						if (setHintJson()) {
							ifrWin.setJavaJson(setHintJson())
						}
						;// 设置提示的内容
					},
					footer : Newtec.Button
							.create({
								id : 'save',
								title : '保存',
								click : function() {
									var ifrWin = document
											.getElementById("codeEditor").contentWindow
									input.value = ifrWin
											.getEditorContext();// 保存按钮
									processProp[input.name] = input.value;// 将数据保存到内存中，以便将脚本编辑器的脚本传到后台
									// by黎延晖
									win.close();
								}
							})

				});
	}
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

	var deleteButRSrc = "myqdp/images/processDesigner/rubbish-red.png"; // 红色
	var deleteButBSrc = "myqdp/images/processDesigner/rubbish-black.png"; // 黑色
	var createButRSrc = "myqdp/images/processDesigner/create-red.png";
	var createButBSrc = "myqdp/images/processDesigner/create-black.png";
	var straightButRSrc = "myqdp/images/processDesigner/straightline-red.png";
	var straightButBSrc = "myqdp/images/processDesigner/straightline-black.png";
	var polylineButRSrc = "myqdp/images/processDesigner/polyline-red.png";
	var polylineButBSrc = "myqdp/images/processDesigner/polyline-black.png";
	var curveButRSrc = "myqdp/images/processDesigner/curve-red.png";
	var curveButBSrc = "myqdp/images/processDesigner/curve-black.png";
	var redoBtnRSrc = "myqdp/images/processDesigner/redo-red.png";
	var redoBtnBSrc = "myqdp/images/processDesigner/redo-black.png";
	var undoBtnRSrc = "myqdp/images/processDesigner/undo-red.png";
	var undoBtnBSrc = "myqdp/images/processDesigner/undo-black.png";
	var leftAlignBSrc = "myqdp/images/processDesigner/left-alignment.png";
	var topAlignBSrc = "myqdp/images/processDesigner/top-alignment.png";
	var leftAlignRSrc = "myqdp/images/processDesigner/left-alignment-red.png";
	var topAlignRSrc = "myqdp/images/processDesigner/top-alignment-red.png";
	var deleteBSrc = "myqdp/images/processDesigner/deleteB.png";
	var deleteRSrc = "myqdp/images/processDesigner/deleteR.png";
	var upbtnBSrc = "myqdp/images/processDesigner/upB.png";
	var upbtnRSrc = "myqdp/images/processDesigner/upR.png";
	var downbtnBSrc = "myqdp/images/processDesigner/downB.png";
	var downbtnRSrc = "myqdp/images/processDesigner/downR.png";
	var crossDeleteSrc = "myqdp/images/processDesigner/crossDelete.png";
	var saveBSrc = "myqdp/images/processDesigner/saveB.png";
	var saveRSrc = "myqdp/images/processDesigner/saveR.png";
	var saveasBSrc = "myqdp/images/processDesigner/saveasB.png";
	var saveasRSrc = "myqdp/images/processDesigner/saveasR.png";
	var leftbtnBSrc = "myqdp/images/processDesigner/leftB.png";
	var leftbtnRSrc = "myqdp/images/processDesigner/leftR.png";
	var rightbtnBSrc = "myqdp/images/processDesigner/rightB.png";
	var rightbtnRSrc = "myqdp/images/processDesigner/rightR.png";
	var nodeImgSrc = "myqdp/images/processDesigner/node-img.png";
	var titleIconSrc = "myqdp/images/processDesigner/title-icon.png";
	var startSrc = "myqdp/images/processDesigner/start.png";
	var endSrc = "myqdp/images/processDesigner/end.png";
	Newtec.Module("ProcessNode")
})();