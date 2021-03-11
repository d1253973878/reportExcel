(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ProcessDesigner = factory(global.Raphael||{}));
}(this,(function(){
//	if(Raphael==undefined) console.error("没有加载raphael.js!");
//	console.log(Raphael);

	var userAgent = navigator.userAgent;
	
	var ie_upto10 = /MSIE \d/.test(userAgent);
	var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.test(userAgent);
	var ie = ie_upto10 || ie_11up; //是否为IE
	
	var background; //背景
	var defaultOn = true  //默认选择状态
	var curlineOn = false;  //曲线按钮激活状态
	var polylineOn = false; //折线按钮激活状态
	var straightlineOn = false; //直线按钮激活状态
	var nodeIcon;  //左边工具栏节点图标对象
	var curlineIcon; //左边工具栏曲线图标对象
	var polylineIcon; //左边工具栏折线图标对象
	var straightlineIcon; //左边工具栏直线图标对象
	
	var choosingObjs = []; //正在选中的节点和 线 （实际线）
	
	var paperWidth ;//画板长 包括工具栏
	var paperHeight;  //画板宽
	var toolBarWidth = 40;  //工具栏宽度 
	var lineColor = "#000" //线的颜色

	var nodes = []; //所有节点
	var lines = []; //所有的线
	var remarks = [];//区域备注
	var processDesigner = {};
	var paper;
	
	var container; //页面上的元素
	var undoStack = []; //回退栈    每做一次操作 往回退栈中添加操作对象（包含当前操作及其反操作）  并清空重做栈 点解回退按钮时 把栈顶元素弹出执行操作并把操作压入重做栈
	var redoStack = []; //重做栈 每次重做就把操作从重做栈中弹出并执行
	var nodeNameCount=1; //节点名称计数器
	var defaultNodeFlag = 0;//默认节点标记
	
	var newtecYeWu = true; //业务相关 操作
	var processProp;	
	
	/*创建流程设计器*/
	processDesigner.create = function(processContainer,height){
		
		clearStaticParam(); //清空共用属性
		
		paperWidth = processContainer.offsetWidth-1;
		paperHeight =height|| processContainer.offsetHeight-7;
//		alert("offsetWidth: " +processContainer.offsetWidth+"offsetHeight: " + processContainer.offsetHeight );
		paper = Raphael(processContainer,paperWidth,paperHeight);  //创建出画图的paper
		container = processContainer;
		
		/*构造外面页面dom结构*/
		var parent = processContainer.parentNode;
		parent.removeChild(processContainer);
		
		var mainDiv = document.createElement("div");
		mainDiv.id = "mainDiv"
		var processDiv = document.createElement("div");
		processDiv.id = "processForm";
		var nodeDiv = document.createElement("div");
		nodeDiv.id = "nodeForm";
		var lineDiv = document.createElement("div");
		lineDiv.id = "lineForm";
		mainDiv.appendChild(processContainer);
		mainDiv.appendChild(processDiv);
		mainDiv.appendChild(nodeDiv);
		mainDiv.appendChild(lineDiv);
		parent.appendChild(mainDiv);
		
		
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
		
		
//		createToolBar(); //工具栏
		createBackground(); //透明背景加事件
//		createRenameDiv();
//		createTable(processContainer);
		setTimeout(function(){upbtn(); },100);//下方上下按钮
		
		//var a = paper.text(100,100,"哈哈哈").attr({width:"100px",height:"100px","font-size":"20px"});
		
		/*业务相关*/
//		if(newtecYeWu){
//			initForm(); //创建下方表单
//			processProp  = new ProcessProp();//流程属性
//			formFieldEve(); //给表单项加事件 
//		}
	}
	var clickFun=null;
	var dblclickFun=null;
	/*创建流程设计器并读取流程*/
	processDesigner.loadProcess = function(param){
		clickFun=param.clickFun;
		dblclickFun=param.dblclickFun;
		var appendTo=$(param.appendTo)[0];
		processDesigner.create(appendTo,param.height);
		
		drawAndSetData(param);
	}
	/*关闭流程设计器*/
	var closeProcessDesigner = function(){
		var a = document.getElementById("mainDiv")
		a.style.display = "none";
	};
	
	/*设置设计器关闭时该执行的操作 由外部操作*/
	processDesigner.setCloseDesignerFun = function(closefun){	
			if( typeof closefun == "function"){
				closeProcessDesigner = closefun;
			}else{
				throw "is not a function";
			}
	}
	//设计上的不够面向对象 导致每次进来要初始化共有变量0.0 惭愧惭愧
	function clearStaticParam(){
		 defaultOn = true; //默认选择状态
		 curlineOn = false;  //曲线按钮激活状态
		 polylineOn = false; //折线按钮激活状态
		 straightlineOn = false; //直线按钮激活状态
		 nodes = []; //所有节点
		 lines = []; //所有的线
		 remarks = [];//区域备注
		 undoStack = []; //回退栈    每做一次操作 往回退栈中添加操作对象（包含当前操作及其反操作）  并清空重做栈 点解回退按钮时 把栈顶元素弹出执行操作并把操作压入重做栈
		 redoStack = []; //重做栈 每次重做就把操作从重做栈中弹出并执行
		 choosingObjs = []; //正在选中的节点和 线 （实际线）
		 nodeNameCount=1; //节点名称计数器
		 defaultNodeFlag = 0;//默认节点标记
		 
	}
	/*下方上下按钮*/
	function upbtn(){
		var upbtn = paper.image(upbtnBSrc,getPaperWidth()/2-24,getPaperHeight()-28,48,32);
		upbtn.attr("title","显示表格");
		upbtn.mousemove(function(){upbtn.attr("src",upbtnRSrc);});
		upbtn.mouseout(function(){upbtn.attr("src",upbtnBSrc);});
		upbtn.click(function(){
			dataTable = curShowFormEle?curShowFormEle:document.getElementById("processForm");
			if(dataTable.style.height!="0%"){  //正在显示 要隐藏
				dataTable.style.height = "0%";
				dataTable.style.display="none";	
				container.style.height = "100%";
				upbtn.attr("y",getPaperHeight()-28); //重设下按钮位置
				upbtn.attr("src",upbtnBSrc);
				upbtn.unmousemove();
				upbtn.unmouseout();
				upbtn.mouseover(function(){upbtn.attr("src",upbtnRSrc);});
				upbtn.mouseout(function(){upbtn.attr("src",upbtnBSrc);});
			}else {                                //隐藏中
				dataTable.style.display="block";
				container.style.height = "70%";
				dataTable.style.height = "30%";
				upbtn.attr("y",getPaperHeight()-28);
				upbtn.attr("src",downbtnBSrc);
				upbtn.unmousemove();
				upbtn.unmouseout();
				upbtn.mousemove(function(){upbtn.attr("src",downbtnRSrc);});
				upbtn.mouseout(function(){upbtn.attr("src",downbtnBSrc);});
			}
		});
		
		container.onscroll = function(){
				var a = container.scrollTop+getPaperHeight();
				upbtn.attr("y",a-28);
			};
	}
	
	
	/*添加操作,参数是两个function对象表示正反操作*/
	function addOpera(undo,redo){ 
		undoStack.push({undo:undo,redo:redo});
		redoStack.splice(0);//每次添加操作清空重做栈
	}
	function undo(){ 
		var opera = undoStack.pop();
		if(opera){
		opera.undo(); //执行undo
		redoStack.push(opera);
		}
	}
	function redo(){
		var opera = redoStack.pop();
		if(opera){
		opera.redo();
		undoStack.push(opera);
		}
	}

	
	/*关闭其它图标的功能*/
	var closeAllStatus = function(){
		if(defaultOn){
			defaultOn = false;}
		if(curlineOn){
			lineClose(curlineIcon.line,curlineIcon.bg,curlineIcon.over,curlineIcon.out,curlineIcon.type);}
		if(polylineOn){
			lineClose(polylineIcon.line,polylineIcon.bg,polylineIcon.over,polylineIcon.out,polylineIcon.type);}
		if(straightlineOn){
			lineClose(straightlineIcon.line,straightlineIcon.bg,straightlineIcon.over,straightlineIcon.out,straightlineIcon.type);}		
	}


	/*打开及关闭曲线折线直线开关 type为线的类型*/
	function lineOpen(line,bg,type){
		closeAllStatus(); //关闭所有图标功能
		line.unmouseover();
		bg.unmouseover();
		bg.unmouseout();    //取消原有移进移出事件 

		bg.attr({"fill-opacity":0});
		line.attr({stroke:"red"});
		type=="curve"? curlineOn =true:type=="poly"?polylineOn =true:straightlineOn = true;			
	}
	function lineClose(line,bg,over,out,type){
		line.mouseover(over); 
		bg.mouseover(over); 
		bg.mouseout(out);
		line.attr({"stroke":"#000"});
		type=="curve"? curlineOn =false:type=="poly"?polylineOn =false:straightlineOn = false;		
	}
	function getPaperWidth(){
		return container.offsetWidth-1;
	}
	function getPaperHeight(){
		return container.offsetHeight-7;
	}

	/*创建表格*/
	function createTable(container){
		
		var id = document.createElement("input");
		id.title="流程ID";
	}
	
	
	
	/*paper在浏览器中的位置*/
	function getPaperLeft(){return container.offsetLeft;}
	function getPaperTop(){return container.offsetTop;} 
	/*创建透明背景长方形，方便点击空白处添加事件*/
	function createBackground(){
//	    background = paper.rect(toolBarWidth,toolBarWidth,paperWidth-toolBarWidth,paperHeight-toolBarWidth).attr({"stroke-width":0,fill:"#AEAEAE","fill-opacity":0.1});//画一个背景 方便实现点击空白地方触发事件
		//container.scrollWidth
		background = paper.rect(0,0,2000,2000).attr({"stroke-width":0,fill:"#AEAEAE","fill-opacity":0});//画一个背景 方便实现点击空白地方触发事件
		background.toBack();
//		var click = function(){
//			dechooseAll(); //把其它都否选	
//
//		};
//		background.click(click);
		/*实现框选*/	
		background.mousedown(function(e,ox,oy){ 
			
			var tempRect = paper.rect(0,0).attr({"stroke-width":0.5});
			dechooseAll(); //把其它都否选
			background.toFront(); // 开始拖动时提到最前
			var move = function(e1,x,y){
//				background.unclick(click); //取消click事件
					
//				var left = Math.min(e1.offsetX,ox)-getPaperLeft()+4;
//				var top = Math.min(e1.offsetY,oy)-getPaperTop()+4;
				var left = Math.min(e1.offsetX,e.offsetX)+4;
				var top = Math.min(e1.offsetY,e.offsetY)+4;
				var width = Math.abs(e1.offsetX-e.offsetX-8);
				var height = Math.abs(e1.offsetY-e.offsetY-8);	
				tempRect.attr({x:left,y:top,width:width,height:height});
			}	
		    background.mousemove(move);
			
			var up =function(e,x,y){
				var left = tempRect.attr("x");
				var top = tempRect.attr("y");
				var width = tempRect.attr("width");
				var height =  tempRect.attr("height");
				for(var i=0;i<nodes.length;i++){
					var node = nodes[i].getShape();
					if(node.type=="rect"){
						if(node.attr("x")>left&&node.attr("y")>top&&node.attr("x")+node.attr("width")<left+width&&node.attr("y")+node.attr("height")<top+height){
							node.mutichoose();
						}
					}else{
						var cx = node.attr("cx");
						var cy = node.attr("cy");
						var r =node .attr("r");
						if(cx-r>left&&cy-r>top&&cx+r<left+width&&cy+r<top+height){
							node.mutichoose();
						}
					}
				}
				tempRect.remove();	
				background.unmousemove(move);
				background.unmouseup(up);
				background.toBack();
				if(newtecYeWu){
//					showProcessForm(); //显示表格
				}
//				window.setTimeout(function(){background.click(click);},100);//延迟回复click事件
			}
			background.mouseup(up);
			
			
		});
	}
	/*创建工具栏及工具*/
	function createToolBar(){    
		/*参数*/
		/*创建边线*/
		var pathString = "M"+toolBarWidth+" "+paperHeight+"V"+toolBarWidth+" H"+paperWidth;
		var line  = paper.path(pathString);
		line.attr({stroke:"black","stroke-width":"0.5"});       
		/*创建节点工具*/
		nodeIcon = drawNodeTool(5,40);  //创建节点图标
		drawNodeTool(5,75,true);  //
//		drawStartPoint(); //创建开始点图标
		drawEndPoint(); //创建结束点图标
		curlineIcon = lineTool("curve"); // 曲线图标
		polylineIcon = lineTool("poly"); // 折线图标
		straightlineIcon = lineTool("straight"); //直线图标
		remark(); //区域备注图标
		redoBtn(); //重做按钮
		undoBtn(); //回退按钮
		leftAlignBtn(); //左对齐按钮
		topAlignBtn(); //上对齐按钮
		deleteBtn(); //删除按钮
		saveBtn(); //新建按钮
		saveasBtn(); // 保存按钮
	}

	/*创建节点图标*/
	function drawNodeTool(x,y,isTrue){
		var nodeIcon = paper.rect(x,y,30,30,5); //创建长方形 x,y,width,height,radius
		nodeIcon.attr({fill:"#FBFB98",stroke:"black","stroke-width":"0.5",title:"流程节点"});
		/*添加鼠标移上去的事件*/
		nodeIcon.mouseover(function(){nodeIcon.attr({cursor:"pointer",fill:"#FBCA98"});});  
		nodeIcon.mouseout(function(){nodeIcon.attr({fill:"#FBFB98"});});
		
		var dragStart = function(x,y){
			closeAllStatus(); //关闭所有图标功能
			defaultOn = true;
			this.ox = this.attr("x");
			this.oy = this.attr("y");
			//		if(!this.tempShape) {//创建暂时出现的拖动块
			this.tempShape = paper.rect(this.ox,this.oy,30,30,5);
			this.tempShape.attr({fill:"#FBFB98",stroke:"black","stroke-width":"0.5"});
			//	}
		}
		var dragMove = function(dx,dy){
		this.tempShape.attr({x: this.ox + dx, y: this.oy + dy});
		}
		var dragEnd = function(){
			var x = this.tempShape.attr("x");
			var y = this.tempShape.attr("y");
			if(x>toolBarWidth&&y>toolBarWidth){ 
				//创建节点
				var node  = isTrue?new NodeExp(x,y,150,150): new Node(x,y,150,150);
				nodes.push(node);
				/*定义回退重做的要做的操作*/
				var undo = function(){
					node.getShape().hide();
					node.getShape().text.hide();
					nodes.splice(nodes.indexOf(node),1); 
				};
				var redo = function(){
					node.getShape().show();
					node.getShape().text.show();
					nodes.push(node);
				};
				addOpera(undo,redo);
			}
			this.tempShape.remove();
			this.tempShape = undefined;
		}
		nodeIcon.drag(dragMove,dragStart,dragEnd);
		return nodeIcon;
	}
	/*创建开始点图标*/
	function drawStartPoint(){
	
		var startPoint = paper.set();
		var bg = paper.rect(5,75,30,30,5).attr("title","开始点");
//		var c1 =paper.circle(20,90,6.5);
		var c2 =paper.circle(20,90,13).attr({"fill":"#FBFB98","stroke-width":"0.5",stroke:"black",title:"开始点"});
		
		bg.attr({"stroke-width":0});
//		c1.attr({"stroke-width":2});
	
//		startPoint.push(c1);
		startPoint.push(c2);
		startPoint.push(bg);

		startPoint.mousemove(function(){
			bg.attr({fill:"#FBCA98","fill-opacity":1})
//			c1.attr({stroke:"red"});
			c2.attr({stroke:"red"});
		});
		startPoint.mouseout(function(){
			bg.attr("fill-opacity","0");
//			c1.attr({stroke:"#000"});
			c2.attr({stroke:"#000"});
			});

		var dragStart = function(x,y){
			closeAllStatus(); //关闭所有图标功能
			defaultOn = true;
			this.ox = this.attr("cx");
			this.oy = this.attr("cy");
			//		if(!this.tempShape) {//创建暂时出现的拖动块
			this.tempShape = paper.circle(this.ox,this.oy,13).attr({"fill":"#FBFB98","stroke-width":"0.5",stroke:"black"});
			//	}
		}
		var dragMove = function(dx,dy){
		this.tempShape.attr({cx: this.ox + dx, cy: this.oy + dy});
		}
		var dragEnd = function(){
			var x = this.tempShape.attr("cx")-this.tempShape.attr("r");
			var y = this.tempShape.attr("cy")-this.tempShape.attr("r");
			if(x>toolBarWidth&&y>toolBarWidth){ 
				//创建节点
				var node  =  new StartNode(x,y,19);
				nodes.push(node);
				/*定义回退重做的要做的操作*/
				var undo = function(){
					node.getShape().hide();
					node.getShape().text.hide();
					nodes.splice(nodes.indexOf(node),1); 
				};
				var redo = function(){
					node.getShape().show();
					node.getShape().text.show();
					nodes.push(node);
				};
				addOpera(undo,redo);
			}
			this.tempShape.remove();
			this.tempShape = undefined;
		}
		c2.drag(dragMove,dragStart,dragEnd);
		return c2;

	}
	/*创建结束点图标*/
	function drawEndPoint(){
		var endPoint = paper.set();
		var bg = paper.rect(5,110,30,30,5).attr("title","结束点");
//		var line = paper.path("M12.5 135.6 L27.5 114.4")
		var c2 =paper.circle(20,125,12).attr({"stroke-width":1.5,fill:"#AEAEAE","fill-opacity":"0.1",title:"结束点"});

		bg.attr({"stroke-width":0});
//		line.attr({"stroke-width":2});
		
	
//		endPoint.push(line);
		endPoint.push(c2);
		endPoint.push(bg);

		endPoint.mousemove(function(){
			bg.attr({fill:"#FBCA98","fill-opacity":1})
//			line.attr({stroke:"red"});
			c2.attr({stroke:"red"});
		});
		endPoint.mouseout(function(){
			bg.attr("fill-opacity","0");
//			line.attr({stroke:"#000"});
			c2.attr({stroke:"#000"});
			});

		var dragStart = function(x,y){
			closeAllStatus(); //关闭所有图标功能
			defaultOn = true;
			this.ox = this.attr("cx");
			this.oy = this.attr("cy");
			//		if(!this.tempShape) {//创建暂时出现的拖动块
			this.tempShape = paper.circle(this.ox,this.oy,13).attr({"stroke-width":0.5,fill:"#AEAEAE","fill-opacity":"0.1"});
			//	}
		}
		var dragMove = function(dx,dy){
		this.tempShape.attr({cx: this.ox + dx, cy: this.oy + dy});
		}
		var dragEnd = function(){
			var x = this.tempShape.attr("cx")-this.tempShape.attr("r");
			var y = this.tempShape.attr("cy")-this.tempShape.attr("r");
			if(x>toolBarWidth&&y>toolBarWidth){ 
				//创建节点
				var node  =  new EndNode(x,y,19);
				nodes.push(node);
				/*定义回退重做的要做的操作*/
				var undo = function(){
					node.getShape().hide();
					node.getShape().text.hide();
					nodes.splice(nodes.indexOf(node),1); 
				};
				var redo = function(){
					node.getShape().show();
					node.getShape().text.show();
					nodes.push(node);
				};
				addOpera(undo,redo);
			}
			this.tempShape.remove();
			this.tempShape = undefined;
		}
		c2.drag(dragMove,dragStart,dragEnd);
		return c2;

	}
	/*创建线按钮图标*/
	function lineTool(type){
		/*背景*/
		var bg;
		/*曲线*/
		var lineString ;
		var lineTitle ;
		if(type=="curve"){
			lineString	= "M8 148 C20 148 20 172 32 172";
			bg = paper.rect(5,145,30,30,5);
			lineTitle= "曲线" ;
		}else if(type=="poly"){
			lineString	= "M8 183 L20 183 L20 207 L32 207";
			bg = paper.rect(5,180,30,30,5);
			lineTitle= "折线" ;
		}else{
			lineString	= "M8 218 L32 242";
			bg = paper.rect(5,215,30,30,5);
			lineTitle= "直线" ;
		}
		var line = paper.path(lineString);
		line.attr({"stroke-width":2,cursor:"pointer",title:lineTitle,});

		bg.attr({"stroke-width":0,cursor:"pointer",title:lineTitle});

		var over = function(){bg.attr({fill:"#FBCA98","fill-opacity":1});line.attr({stroke:"red"});}
		line.mouseover(over);  	
		bg.mouseover(over);  
		var out = function(){bg.attr({"fill-opacity":0});line.attr({"stroke":"#000"});}
		bg.mouseout(out);
		/*点击开启或关闭画线*/
		
		var changeStatus;
		if(type=="curve"){
			changeStatus= function(){
				if(curlineOn){ //关闭
						lineClose(line,bg,over,out,type);
						defaultOn = true; //开启默认选择
				}else{ //开启
						lineOpen(line,bg,type);
				}
			}
		}
		else if(type=="poly"){
			changeStatus= function(){
				if(polylineOn){ //关闭
						lineClose(line,bg,over,out,type);
						defaultOn = true; //开启默认选择
				}else{ //开启
						lineOpen(line,bg,type);
				}
			}
		}else if(type=="straight"){
			changeStatus= function(){
				if(straightlineOn){ //关闭
						lineClose(line,bg,over,out,type);
						defaultOn = true; //开启默认选择
				}else{ //开启

						lineOpen(line,bg,type);
				}
			}
		}

		
		bg.click(changeStatus);
		line.click(changeStatus);

		return {"line":line,"bg":bg,"over":over,"out":out,"type":type};
	}
	/*创建区域备注图标*/
	function remark(){
		var remarkIcon  = paper.rect(5,250,30,30,5).attr({"fill":"#CCFFCC","cursor":"pointer","stroke-width":"0.5"}).toBack();
		var dragStart = function(x,y){
			closeAllStatus(); //关闭所有图标功能
			defaultOn = true;
			this.ox = this.attr("x");
			this.oy = this.attr("y");
			//		if(!this.tempShape) {//创建暂时出现的拖动块
			this.tempShape = paper.rect(this.ox,this.oy,30,30,5);
			this.tempShape.attr({fill:"#CCFFCC","stroke-width":"0.5"});
			//	}
		}
		var dragMove = function(dx,dy){
		this.tempShape.attr({x: this.ox + dx, y: this.oy + dy});
		}
		var dragEnd = function(){
			var x = this.tempShape.attr("x");
			var y = this.tempShape.attr("y");
			if(x>toolBarWidth&&y>toolBarWidth){ 
				//创建节点
				var remark  =  new RemarkArea(x,y);
				remarks.push(remark);
				for(var i=remarks.length-1;i>=0;i--){ // 从后往前遍历remark让其toBack 让新出来的在最上面
					remarks[i].toBack();
				}
				/*定义回退重做的要做的操作*/
				var undo = function(){
					remark.hide();
					remarks.splice(remarks.indexOf(remark),1); 
				};
				var redo = function(){
					remark.show();
					remarks.push(remark);
				};
				addOpera(undo,redo);
			}
			this.tempShape.remove();
			this.tempShape = undefined;
		}
		remarkIcon.drag(dragMove,dragStart,dragEnd);
		return remarkIcon;
	}
	
	/*新建按钮*/
	function saveBtn(){
		var saveBtn = paper.image(saveBSrc,40,4,32,32);
		saveBtn.attr("title","新建");
		saveBtn.mousemove(function(){saveBtn.attr("src",saveRSrc);});
		saveBtn.mouseout(function(){saveBtn.attr("src",saveBSrc);});
		saveBtn.click(save);
		return saveBtn;
	}
	/*保存按钮*/
	function saveasBtn(){
		var saveasBtn = paper.image(saveasBSrc,75,4,32,32);
		saveasBtn.attr("title","保存");
		saveasBtn.mousemove(function(){saveasBtn.attr("src",saveasRSrc);});
		saveasBtn.mouseout(function(){saveasBtn.attr("src",saveasBSrc);});
		saveasBtn.click(saveas);	
		return saveasBtn;
	}
	/*回退按钮*/
	function undoBtn(){
		var undoBtn = paper.image(undoBtnBSrc,110,4,32,32);
		undoBtn.attr("title","回退");	
		undoBtn.mousemove(function(){undoBtn.attr("src",undoBtnRSrc);});
		undoBtn.mouseout(function(){undoBtn.attr("src",undoBtnBSrc);});
		undoBtn.click(undo);
		return undoBtn;
	}
	/*重做按钮*/
	function redoBtn(){
		var redoBtn = paper.image(redoBtnBSrc,145,4,32,32);
		redoBtn.attr("title","重做");
		redoBtn.mousemove(function(){redoBtn.attr("src",redoBtnRSrc);});
		redoBtn.mouseout(function(){redoBtn.attr("src",redoBtnBSrc);});
		redoBtn.click(redo);
		return redoBtn;
	}
	/*左对齐按钮*/
	function leftAlignBtn(){
		var leftAlignBtn = paper.image(leftAlignBSrc,180,4,32,32);
		leftAlignBtn.attr("title","左对齐");
		leftAlignBtn.mousemove(function(){leftAlignBtn.attr("src",leftAlignRSrc);});
		leftAlignBtn.mouseout(function(){leftAlignBtn.attr("src",leftAlignBSrc);});
		leftAlignBtn.click(leftAlign);
		return leftAlignBtn;
	}
	/*左对齐*/
	function leftAlign(){
		var curObjs=[]; //存放当时操作的选中对象
		for(var i =0;i<choosingObjs.length;i++){
			var objcx = choosingObjs[i].type=="rect"?choosingObjs[i].attr("x")+choosingObjs[i].attr("width")/2:choosingObjs[i].attr("cx");
			curObjs[i] = {obj:choosingObjs[i],x:objcx};
		}
		
		var left = 10000;
		for(var i =0;i<choosingObjs.length;i++){
			var objcx = choosingObjs[i].type=="rect"?choosingObjs[i].attr("x")+choosingObjs[i].attr("width")/2:choosingObjs[i].attr("cx");
			if(objcx<left){
				left = objcx;
			}
		}
		for(var i =0;i<choosingObjs.length;i++){
			var objcy = choosingObjs[i].type=="rect"?choosingObjs[i].attr("y")+choosingObjs[i].attr("height")/2:choosingObjs[i].attr("cy");
			choosingObjs[i].moveTo(left,objcy);
		}

		
		var undo = function(){
			for(var i =0;i<curObjs.length;i++){
				var objcy = curObjs[i].obj.type=="rect"?curObjs[i].obj.attr("y")+curObjs[i].obj.attr("height")/2:curObjs[i].obj.attr("cy");
				curObjs[i].obj.moveTo(curObjs[i].x,objcy);
			}
		};	
		var redo = function(){
			for(var i =0;i<curObjs.length;i++){
				var objcy = curObjs[i].obj.type=="rect"?curObjs[i].obj.attr("y")+curObjs[i].obj.attr("height")/2:curObjs[i].obj.attr("cy");
				curObjs[i].obj.moveTo(left,objcy);
			}	
		};
		addOpera(undo,redo);
	}
	/*上对齐按钮*/
	function topAlignBtn(){
		var topAlignBtn = paper.image(topAlignBSrc,215,4,32,32);
		topAlignBtn.attr("title","上对齐");
		topAlignBtn.mousemove(function(){topAlignBtn.attr("src",topAlignRSrc);});
		topAlignBtn.mouseout(function(){topAlignBtn.attr("src",topAlignBSrc);});
		topAlignBtn.click(topAlign);
		return topAlignBtn;
	}
	/*上对齐*/
	function topAlign(){
		var curObjs=[]; //存放当时操作的选中对象
		for(var i =0;i<choosingObjs.length;i++){
			var objcy = choosingObjs[i].type=="rect"?choosingObjs[i].attr("y")+choosingObjs[i].attr("height")/2:choosingObjs[i].attr("cy");
			curObjs[i] = {obj:choosingObjs[i],y:objcy};
		}
		
		var top = 10000;
		for(var i =0;i<choosingObjs.length;i++){
			var objcy = choosingObjs[i].type=="rect"?choosingObjs[i].attr("y")+choosingObjs[i].attr("height")/2:choosingObjs[i].attr("cy");
			if(objcy<top){
				top = objcy;
			}
		}
		for(var i =0;i<choosingObjs.length;i++){
			var objcx = choosingObjs[i].type=="rect"?choosingObjs[i].attr("x")+choosingObjs[i].attr("width")/2:choosingObjs[i].attr("cx");
			choosingObjs[i].moveTo(objcx,top);
		}
		
		var undo = function(){
			for(var i =0;i<curObjs.length;i++){
				var objcx = curObjs[i].obj.type=="rect"?curObjs[i].obj.attr("x")+curObjs[i].obj.attr("width")/2:curObjs[i].obj.attr("cx");
				curObjs[i].obj.moveTo(objcx,curObjs[i].y);
			}
		};
		var redo = function(){
			for(var i =0;i<curObjs.length;i++){
				var objcx = curObjs[i].obj.type=="rect"?curObjs[i].obj.attr("x")+curObjs[i].obj.attr("width")/2:curObjs[i].obj.attr("cx");
				curObjs[i].obj.moveTo(objcx,top);
			}
		};
		addOpera(undo,redo);
	}
	/*删除按钮*/
	function deleteBtn(){
		var deleteBtn = paper.image(deleteBSrc,250,4,32,32);
		deleteBtn.attr("title","删除选中项");
		deleteBtn.mousemove(function(){deleteBtn.attr("src",deleteRSrc);});
		deleteBtn.mouseout(function(){deleteBtn.attr("src",deleteBSrc);});
		deleteBtn.click(function(){ //框选时 只会选到节点和线其中一样 不会混选的 不用考虑 删除自身方法里面关系的互相影响
			var curObjs=[];
			for(var i=0;i<choosingObjs.length;i++){
				curObjs[i]=choosingObjs[i];
				choosingObjs[i].deleteSelf(false);
			}
			
			var undo = function(){
				for(var i=0;i<curObjs.length;i++){
					if(curObjs[i].type=="path"){ //是线
						curObjs[i].show();
						curObjs[i].visible=true;
						curObjs[i].lineObj.from.toline.push(curObjs[i].lineObj);
						curObjs[i].lineObj.to.fromline.push(curObjs[i].lineObj);
					}else{//是节点
						var shape = curObjs[i];
						shape.visible=true;
						shape.show()
						shape.text.show();
						nodes.push(shape.procNode);
						for(var j=0;j<shape.fromline.length;j++){
							shape.fromline[j].line.show();
							shape.fromline[j].line.visible=true;
						}
						for(var j=0;j<shape.toline.length;j++){
							shape.toline[j].line.show();
							shape.toline[j].line.visible=true;
						}
					}
				}
			};
			var redo = function(){
				for(var i=0;i<curObjs.length;i++){
					if(curObjs[i].type=="path"){ //是线
						curObjs[i].hide();
						curObjs[i].visible=false;
						curObjs[i].lineObj.from.toline.splice(curObjs[i].lineObj.from.toline.indexOf(curObjs[i]),1);
						curObjs[i].lineObj.to.fromline.splice(curObjs[i].lineObj.to.fromline.indexOf(curObjs[i]),1);
					}else{//是节点
						var shape = curObjs[i];
						shape.visible=false;
						shape.hide();
						shape.text.hide();
						shape.quickToolBar.hide();
						nodes.splice(nodes.indexOf(shape.procNode),1);
						for(var j=0;j<shape.fromline.length;j++){
							shape.fromline[j].line.hide();
							shape.fromline[j].line.visible=false;
						}
						for(var j=0;j<shape.toline.length;j++){
							shape.toline[j].line.hide();
							shape.toline[j].line.visible=false;
						}
					}
				}
			};
			addOpera(undo,redo);
		});
		return deleteBtn;
	}
	/*快速删除按钮*/
	function quickDeleteBut(node){
		var deleteBut = paper.image(deleteButBSrc,0,0,16,16);
//		var deleteButOver = paper.image("../image/rubbish-red.png");
		deleteBut.hide();

		deleteBut.mouseover(function(){
			deleteBut.attr("src",deleteButRSrc);
		})
		deleteBut.mouseout(function(){
			deleteBut.attr("src",deleteButBSrc);
		})
		deleteBut.click(function(){
          node.deleteSelf(true);
		});
		return deleteBut;
	}
		/*快速创建按钮*/
	function quickCreateBut(node){
		var createBut = paper.image(createButBSrc,0,0,16,16);
//		var deleteButOver = paper.image("../image/rubbish-red.png");
		createBut.hide();

		createBut.mouseover(function(){
			createBut.attr("src",createButRSrc);
		})
		createBut.mouseout(function(){
			createBut.attr("src",createButBSrc);
		})
		createBut.click(function(){
			var x = node.type=="rect"?node.attr("x"):node.attr("cx")-node.attr("r");
			var y =node.type=="rect"?node.attr("y"):node.attr("cy")-node.attr("r");
			var node1  =  new Node(x+100,y,60,38); //产生一个抽象节点 此时 getShape()后才是那个图形
			nodes.push(node1);
			var nodeShape = node1.getShape();
			var line = connect(node,nodeShape,"#000");
			
			var undo = function(){
				nodeShape.hide();
				line.line.hide();
				nodes.splice(nodes.indexOf(node1),1);
				lines.splice(lines.indexOf(line.procLine),1);	
			}
			var redo = function(){
				nodeShape.show();
				line.line.show();
				nodes.push(node1);
				lines.push(line.proCLine);	
			}
			addOpera(undo,redo);
		});
		return createBut;
	}
	
		/*快速直线按钮*/
	function quickStraightBut(node){
		var straightBut = paper.image(straightButBSrc,0,0,16,16);
//		var deleteButOver = paper.image("../image/rubbish-red.png");
		straightBut.hide();

		straightBut.mouseover(function(){
			straightBut.attr("src",straightButRSrc);
		})
		straightBut.mouseout(function(){
			straightBut.attr("src",straightButBSrc);
		})
		var dragStart = function(x,y,e){
			this.ox = e.offsetX;
			this.oy = e.offsetY;
			this.templine = connect(node,{flag:1,x:e.offsetX,y:e.offsetY},lineColor,"straight");
//			this.ox = x-getPaperLeft();
//			this.oy = y-getPaperTop();
//			this.templine = connect(node,{flag:1,x:x-getPaperLeft(),y:y-getPaperTop()},lineColor,"straight");
		}
		var dragMove = function(dx,dy,x,y){
			this.templine.to={flag:1,x:this.ox+dx,y:this.oy+dy};
			connect(this.templine);
			this.endX = x;
			this.endY = y;
		}
		var dragEnd = function(){
			this.templine.line.remove();this.templine=undefined;
			var toElement = paper.getElementByPoint(this.endX,this.endY);
			if(toElement&&(toElement.type=="text"||toElement.isChildNode)){toElement=toElement.belongNode;}//如果得到是文字，重新指向其对应的节点 
			if(toElement!=null&&toElement.id!=this.id&&toElement.procNode){ //有元素要连 并且不是自己 且是节点 
			var line = connect(node,toElement,lineColor,"straight");
			line.line.attr({"arrow-end":"open-wide-long"});
			var undo = function(){
				line.line.hide();
				lines.splice(lines.indexOf(line.procLine),1);
				};
			var redo = function(){
				line.line.show();
				lines.push(line.procLine);
				};
			addOpera(undo,redo);
			}
		}
		straightBut.drag(dragMove,dragStart,dragEnd);
	
		return straightBut;
	}
		/*快速折线按钮*/
	function quickPolylineBut(node){
		var polylineBut = paper.image(polylineButBSrc,0,0,16,16);
//		var deleteButOver = paper.image("../image/rubbish-red.png");
		polylineBut.hide();

		polylineBut.mouseover(function(){
			polylineBut.attr("src",polylineButRSrc);
		})
		polylineBut.mouseout(function(){
			polylineBut.attr("src",polylineButBSrc);
		})
		var dragStart = function(x,y,e){
			this.ox = e.offsetX;
			this.oy = e.offsetY;
			this.templine = connect(node,{flag:1,x:e.offsetX,y:e.offsetY},lineColor,"poly");
//			this.ox = x-getPaperLeft();
//			this.oy = y-getPaperTop();
//			this.templine = connect(node,{flag:1,x:x-getPaperLeft(),y:y-getPaperTop()},lineColor,"poly");
		}
		var dragMove = function(dx,dy,x,y){
			this.templine.to={flag:1,x:this.ox+dx,y:this.oy+dy};
			connect(this.templine);
			this.endX = x;
			this.endY = y;
		}
		var dragEnd = function(){
			this.templine.line.remove();this.templine=undefined;
			var toElement = paper.getElementByPoint(this.endX,this.endY);
			if(toElement&&toElement.type=="text"){toElement=toElement.belongNode;}//如果得到是文字，重新指向其对应的节点 
			if(toElement!=null&&toElement.id!=this.id&&toElement.procNode){ //有元素要连 并且不是自己 且是节点 
			var line = connect(node,toElement,lineColor,"poly");
			line.line.attr({"arrow-end":"open-wide-long"});
			var undo = function(){
				line.line.hide();
				lines.splice(lines.indexOf(line.procLine),1);
				};
			var redo = function(){
				line.line.show();
				lines.push(line.procLine);
				};
			addOpera(undo,redo);
			}
		}
		polylineBut.drag(dragMove,dragStart,dragEnd);
		return polylineBut;
	}
		/*快速曲线按钮*/
	function quickCurveBut(node){
		var curveBut = paper.image(curveButBSrc,0,0,16,16);
//		var deleteButOver = paper.image("../image/rubbish-red.png");
		curveBut.hide();

		curveBut.mouseover(function(){
			curveBut.attr("src",curveButRSrc);
		})
		curveBut.mouseout(function(){
			curveBut.attr("src",curveButBSrc);
		})
		var dragStart = function(x,y,e){
			this.ox = e.offsetX;
			this.oy = e.offsetY;
			this.templine = connect(node,{flag:1,x:e.offsetX,y:e.offsetY},lineColor,"curve");
//			this.ox = x-getPaperLeft();
//			this.oy = y-getPaperTop();
//			this.templine = connect(node,{flag:1,x:x-getPaperLeft(),y:y-getPaperTop()},lineColor,"curve");
		}
		var dragMove = function(dx,dy,x,y){
			this.templine.to={flag:1,x:this.ox+dx,y:this.oy+dy};
			connect(this.templine);
			this.endX = x;
			this.endY = y;
		}
		var dragEnd = function(){
			this.templine.line.remove();this.templine=undefined;
			var toElement = paper.getElementByPoint(this.endX,this.endY);
			if(toElement&&toElement.type=="text"){toElement=toElement.belongNode;}//如果得到是文字，重新指向其对应的节点 
			if(toElement!=null&&toElement.id!=this.id&&toElement.procNode){ //有元素要连 并且不是自己 且是节点 
			var line = connect(node,toElement,lineColor,"curve");
			line.line.attr({"arrow-end":"open-wide-long"});
			var undo = function(){
				line.line.hide();
				lines.splice(lines.indexOf(line.procLine),1);
				};
			var redo = function(){
				line.line.show();
				lines.push(line.procLine);
				};
			addOpera(undo,redo);
			}
		}
		curveBut.drag(dragMove,dragStart,dragEnd);
		return curveBut;
	}
	var hideTimerOfRect; //计时器 弄成全局方便取消
	/*创建快速工具栏*/
	function createQuickToolBar(x,y,quickTools,node){
		var width1 = 64; //横的长
		var width2  =63;  //竖的长
		var height = 22 ; //共有宽
		var leftX; //左上角X
		var topY;  //左上角Y
		if(node.type =="rect"){
			leftX = x+height-2; //左上角X
		 	topY = y-height;  //左上角Y
		}else{
			
			leftX = x-node.attr("r")-2; //左上角X
			topY = y-node.attr("r")-height-1; //左上角Y
		}
		
		var rightX = leftX+width1;
		var midY = topY+height;
		var midX = rightX-height;
		var butY = topY+width2;
		var piancha = 10;
		var path = ["M",leftX+piancha,topY,"L",rightX-piancha,topY,"Q",rightX,topY,rightX,topY+piancha,"L",rightX,butY-piancha,"Q",rightX,butY,rightX-piancha,butY,"L",midX+piancha,butY,"Q",midX,butY,midX,butY-piancha,"L",midX,midY+piancha,
			"Q",midX,midY,midX-piancha,midY,"L",leftX+piancha,midY,"Q",leftX,midY,leftX,midY-piancha,"L",leftX,topY+piancha,"Q",leftX,topY,leftX+piancha,topY].join(",");
		
		var quickToolBar = paper.path(path);
		quickToolBar.attr({fill:"#c1dbf3","stroke-width":1,stroke:"#B2AFAF","fill-opacity":0.7});
		if(!quickTools) {quickTools = []};
	
		for(var i =0;i<quickTools.length;i++){
		//这里把组件放到特定位置  并和按钮建立关系
			var x = leftX+4+(i<=2?i*20:2*20); 
			var y = topY+3+(i<=2?0:(i-2)*20);
			quickTools[i].toFront();
			quickTools[i].attr({x:x,y:y});
			quickTools[i].hide();	
			quickTools[i].bar = quickToolBar;
			}
		
		quickToolBar.hide();
		
		
		var hideTimerOfBar;
		
		/*给所属的节点加事件和工具栏交互，并返回这两个事件给节点控制*/
		var nodeMouseover = function(){
			showAll();
			window.clearTimeout(hideTimerOfBar); //把快捷工具条的计时器取消
			};
		
		var nodeMouseout = function(){ 
			hideTimerOfRect =window.setTimeout(function(){
				hideAll();
				},20); //200毫秒后隐藏
			}
		node.mouseover(nodeMouseover);  
		node.mouseout(nodeMouseout);  

		quickToolBar.mouseover(function(){if(hideTimerOfRect)clearTimeout(hideTimerOfRect)});  //把节点的计时器取消
		quickToolBar.mouseout(function(){	
			hideTimerOfBar =window.setTimeout(function(){
				hideAll();
			},20); //20毫秒后隐藏
		});

		for(var i = 0;i<quickTools.length;i++){  //给工具栏上面的工具加over事件 取消工具栏的out事件计时器
			quickTools[i].mouseover(function(){
				window.clearTimeout(hideTimerOfBar);	
			})
		}


		var showAll = function(){
			quickToolBar.show();
			for(var i =0;i<quickTools.length;i++){
				quickTools[i].show();	
				}
			}
		var hideAll = function(){
			quickToolBar.hide();	
			for(var i =0;i<quickTools.length;i++){
				quickTools[i].hide();
				}
			}
		
		return {bar:quickToolBar,tools:quickTools,show:showAll,hide:hideAll,mouseover:nodeMouseover,mouseout:nodeMouseout};
	}
	/*重设快速工具栏的位置*/
	function resetQuickToolBarPos(node,quickToolBar){
		var bar = quickToolBar.bar;	
		var tools = quickToolBar.tools;
		console.info("resetQuickToolBarPos",node.type,node.attr("y"),node.attr("cy"),node.oy);
		var dx = (node.type=="rect"?node.attr("x"):node.attr("cx"))-node.ox;
		var dy = (node.type=="rect"?node.attr("y"):node.attr("cy"))-node.oy;
		bar.translate(dx,dy);
		for(var i=0;i<tools.length;i++){
			tools[i].translate(dx,dy);
		}
	}
	//根据移动的节点重设线的位置
	function resetLine(node){
		if(ie){//如果是IE 要先把箭头去掉
			ieDragStartFix(node);
		}
		if(node.fromline){
			for(var i=0;i<node.fromline.length;i++){
				connect(node.fromline[i]);
			}
		}
		if(node.toline){
			for(var i=0;i<node.toline.length;i++){
				connect(node.toline[i]);
			}
		}
		if(ie){
			ieDragEndFix(node);
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
		this.attr({cursor:"pointer"});
	//	this.text.hide(); //隐藏文字
		
		};	
	ProcessNode.prototype.mouseoutEve = function(){ //鼠标移出事件
		var node = this;
		this.text.timer = window.setTimeout(function(){
			node.attr({cursor:"default"});
			},100);
	//	this.text.show(); //显示文字
		};
		/*拖动开始事件*/
	ProcessNode.prototype.dragStart = function(x,y,e){
			/*为了拖动时不显示快捷工具栏*/
			this.unmouseover();//先取消mouseover事件 在dragEnd重新启用
			this.unmouseout();
			if(this.quickToolBar)
		 			this.quickToolBar.hide();
	//		this.text.hide(); //拖动开始隐藏文字
			if(defaultOn){
				if(ie){ //ie下得先对线作一定处理
					ieDragStartFix(this);
				}
			  this.ox = this.type=="rect"?this.attr("x"):this.attr("cx");
			  this.oy = this.type=="rect"?this.attr("y"):this.attr("cy");
			}else if(curlineOn||polylineOn||straightlineOn){
				if(curlineOn){
					 this.templine = connect(this,{flag:1,x:e.offsetX,y:e.offsetY},lineColor,"curve");
				}else if(polylineOn){
					 this.templine = connect(this,{flag:1,x:e.offsetX,y:e.offsetY},lineColor,"poly");
				}else{
					 this.templine = connect(this,{flag:1,x:e.offsetX,y:e.offsetY},lineColor,"straight");		
				}
			
			  this.ox = e.offsetX;
			  this.oy = e.offsetY;

			}
		}
	/*拖动移动事件*/
	ProcessNode.prototype.dragMove = function(dx,dy,x,y){			
			if(defaultOn){
				var isRect=this.type=='rect';
				var curx = isRect?this.attr("x"):this.attr("cx");
				var cury =isRect?this.attr("y"):this.attr("cy");
//				isRect?this.attr({x: this.ox + dx, y: this.oy + dy}):this.attr({cx: this.ox + dx, cy: this.oy + dy});
//				/*调整快捷工具栏*/
//				resetQuickToolBarPos(this.ox + dx - curx,this.oy + dy - cury,this.quickToolBar); //这里要传的应该是每次的变化量  而dxdy是总的变化量
				resetTextPos(this);
				var x=this.ox + dx,y=this.oy + dy;
				if(isRect){
						this.attr({x:x, y:y});		
						var childNode=this.childNode;
						if(childNode&&childNode.length>0)
						for (var i=0;i<childNode.length;i++) {
								var cn=childNode[i];
								cn[0].attr({x:x+cn[1],y:y+cn[2]});
						}
				}else{
						this.attr({cx: x + dx, cy: y})
				}
				/*调整线*/
				if(this.fromline){
					for(var i=0;i<this.fromline.length;i++){
						connect(this.fromline[i]);
					}
				}
				if(this.toline){
					for(var i=0;i<this.toline.length;i++){
						connect(this.toline[i]);
					}
				}

			}else if(curlineOn||polylineOn||straightlineOn){			
				this.templine.to={flag:1,x:this.ox+dx,y:this.oy+dy};
				connect(this.templine);
				this.endX = x;
				this.endY = y;	
			}
		}
	/*拖动结束事件*/
	ProcessNode.prototype.dragEnd = function(){
			this.mouseover(this.procNode.mouseoverEve);//回复mouseover事件 dragStart的时候取消了
			if(this.quickToolBar)
				this.mouseover(this.quickToolBar.mouseover); //回复关于工具栏的事件 dragStart的时候取消了
			this.mouseout(this.procNode.mouseoutEve);
			if(this.quickToolBar)
				this.mouseout(this.quickToolBar.mouseout);
			//this.text.show();//拖动结束显示文字
			var isRect=this.type=="rect",x=this.attr("x") ,y=this.attr("y");
			if(isRect){
						var childNode=this.childNode;
						if(childNode&&childNode.length>0)
						for (var i=0;i<childNode.length;i++) {
								var cn=childNode[i];
								cn[0].attr({x:x+cn[1],y:y+cn[2]});
						}
				}
			if(defaultOn){
				autoAdjust(this); //调整位置;
				/*调整快捷工具栏*/
				if(this.quickToolBar)
						resetQuickToolBarPos(this,this.quickToolBar); 
				resetTextPos(this);//调整文字
				/*调整线*/
				if(this.fromline){
					for(var i=0;i<this.fromline.length;i++){
						connect(this.fromline[i]);
					}
				}
				if(this.toline){
					for(var i=0;i<this.toline.length;i++){
						connect(this.toline[i]);
					}
				}
				if(ie){ //ie下得先对线作一定处理	
					ieDragEndFix(this);
				}
				 /*中心坐标*/
				var startCX = this.type=="rect"?this.ox+this.attr("width")/2:this.ox;
				var startCY = this.type=="rect"?this.oy+this.attr("height")/2:this.oy;
				var endCX = this.type=="rect"?this.attr("x")+this.attr("width")/2:this.attr("cx");
				var endCY = this.type=="rect"?this.attr("y")+this.attr("height")/2:this.attr("cy");
				var node =this;
				var undo = function(){
					node.moveTo(startCX,startCY);
				};
				var redo = function(){
					node.moveTo(endCX,endCY);
				};
				addOpera(undo,redo);
				
			}else if(curlineOn||polylineOn||straightlineOn){ //三种线随意一种在画就触发
//				this.text.show();//拖动结束显示文字
				this.templine.line.remove();this.templine=undefined;
				var toElement = paper.getElementByPoint(this.endX,this.endY);
				if(toElement&&toElement.type=="text"){toElement=toElement.belongNode;}//如果得到是文字，重新指向其对应的节点 
				if(toElement!=null&&toElement.id!=this.id&&toElement.procNode){ //有元素要连 并且不是自己 且是节点 
					var line;
					if(curlineOn){//连线 并加进当前对象的toline中 和 另一对象toElement 的fromline中 还加进全局的 lines中
						line = connect(this,toElement,lineColor,"curve");
					}else if(polylineOn){
						line = connect(this,toElement,lineColor,"poly");
					}else{ //默认直线
						line = connect(this,toElement,lineColor,"straight");
					}
					line.line.attr({"arrow-end":"open-wide-long"});
					var undo = function(){
						line.line.hide()
						line.line.visible=false;
						lines.splice(lines.indexOf(line.procLine),1);
						};
					var redo = function(){
						line.line.show();
						line.line.visible=true;
						lines.push(line.procLine);
						};
					addOpera(undo,redo);
				}
			}
		}		
	ProcessNode.prototype.deleteSelf = function(unre){ //定义节点自己的删除事件  参数是否添加进回退栈中
		var shape = this;
		this.visible=false;
		this.hide();
		this.quickToolBar.hide();
		this.text.hide();
		nodes.splice(nodes.indexOf(this.procNode), 1);
		var child=this.childNode;
		for(var i=0;i<child.length;i++){
			child[i][0].hide();
		}
		for(var i=0;i<this.fromline.length;i++){
			this.fromline[i].line.hide();
			this.fromline[i].line.visible=false;
		}
		for(var i=0;i<this.toline.length;i++){
			this.toline[i].line.hide();
			this.toline[i].line.visible=false;
		}
		if(unre){ 
			var undo = function(){
				shape.visible=true;
				shape.show()
				shape.text.show();
				nodes.push(shape.procNode);
				for(var i=0;i<shape.fromline.length;i++){
					shape.fromline[i].line.show();
					shape.fromline[i].line.visible=true;
				}
				for(var i=0;i<shape.toline.length;i++){
					shape.toline[i].line.show();
					shape.toline[i].line.visible=true;
				}
			};
			var redo = function(){
				shape.visible=false;
				shape.hide();
				shape.text.hide();
				shape.quickToolBar.hide();
				nodes.splice(nodes.indexOf(shape.procNode), 1);
				for(var i=0;i<shape.fromline.length;i++){
					shape.fromline[i].line.hide();
					shape.fromline[i].line.visible=false;
				}
				for(var i=0;i<shape.toline.length;i++){
					shape.toline[i].line.hide();
					shape.toline[i].line.visible=false;
				}
			};
			addOpera(undo,redo);
		}
	}
	//多选事件
	ProcessNode.prototype.mutichoose = function(){
		this.ischoose = true;
		this.attr({stroke:"red","stroke-dasharray":"- ","stroke-width":"1"});
		choosingObjs.push(this);
	}
	
	//单选事件
	ProcessNode.prototype.choose = function(){ 
		dechooseAll() //全否选
		this.ischoose = true;
		this.attr({stroke:"red","stroke-dasharray":"- ","stroke-width":"1"});
		choosingObjs.push(this);		
	}
	//否选事件
	ProcessNode.prototype.dechoose = function(){ 	
		this.ischoose = false;
		this.attr({stroke:"black","stroke-dasharray":"","stroke-width":"0.5"});
		choosingObjs.splice(choosingObjs.indexOf(this),1);
	}
	//将节点移动到某个坐标，参数为中心坐标
	ProcessNode.prototype.haveDel = true; //有快速删除按钮
	ProcessNode.prototype.haveCre = true; //有快速创建按钮
	ProcessNode.prototype.haveStr = true; //有快速直线按钮
	ProcessNode.prototype.havePol = true; //有快速折线按钮
	ProcessNode.prototype.haveCur = true; //有快速曲线按钮
	/*给图形添加事件,子类获得该图形后可重写事件*/
	ProcessNode.prototype.setChildNode=function(childNode,height,width,left,top){//绑定孩子
		
	}
	ProcessNode.prototype.createShape = function (param){
		var node = this.getRealShape(param);
		node.procNode = this; //给图形一个得到节点的属性，维护关系
		node.fromline = []; //记录来向线
		node.toline = [];  //记录去向线
		node.visible = true;//是否可见
		node.ischoose = false;//是否在选中
		this.nodeData=param;
		var tools = [];  //创建快速工具按钮
		if(this.haveDel){tools.push(quickDeleteBut(node));}
		if(this.haveCre){tools.push(quickCreateBut(node));}
		if(this.haveStr){tools.push(quickStraightBut(node));}
		if(this.havePol){tools.push(quickPolylineBut(node));}
		if(this.haveCur){tools.push(quickCurveBut(node));}
		var isRect=node.type=="rect";
		var that=this;
		if(isRect){//定义节点自己的快速工具栏
				var height=this.height,width=this.width,left=this.left,top=this.top,
//				headIMg=paper.image("img/menu.png",left+10,top+10,10,10),
				bodyNode = paper.rect(),
				
//				
				childNode=0;
//				
				console.info(height,width)
//				node.quickToolBar = createQuickToolBar(node.attr("x")+88,node.attr("y"),tools,node);
				/*定义文字对象*/	
				var title=param.title;
				title=title.length>8?title.substr(0,8)+"...":title;
				var headText=node.text =paper.text(left+node.attr("width")/2,top+15,title);
				headText.attr({width:20,cursor:"pointer",fill:'#fff',"font-family":"微软雅黑","font-size":"12"});
				//
				bodyNode.attr({x:left,y:top+35,"width":this.width,fill:'#fff',"height":height-35,stroke:"black","stroke-width":"0.1"});
				
				
				childNode=[[bodyNode,0,35],[headText,node.attr("width")/2,15]]
				node.childNode=childNode;
				this.setChildNode(childNode,height,width,left,top);
				createTextDragEve(childNode,node);
				if(Newtec.Utils.isFunction(dblclickFun))
						setdblClick(node,childNode,dblclickFun,that);
				if(Newtec.Utils.isFunction(clickFun))
						setClick(node,childNode,clickFun,that);
				
		}else{
		node.quickToolBar = createQuickToolBar(node.attr("cx"),node.attr("cy"),tools,node);
		/*定义文字对象*/
		var name = this.haveCre? "节点"+nodeNameCount++:"结束点"; //有创建按钮的圆形是开始点
		node.text =paper.text(node.attr("cx"),node.attr("cy"),name).attr({cursor:"pointer","font-family":"微软雅黑","font-size":"10"});
		}
		node.text.param={height:35,isTitle:true};
//		node.text.belongNode=node;//建立关系
		createTextDragEve(node.text,node); //给文字绑定拖动事件
		node.text.mouseover(function(){ //进入字体时取消节点出去时的两个计时器
			window.clearTimeout(this.timer);
			window.clearTimeout(hideTimerOfRect);	
		})
		node.text.click(function(){
			if(node.ischoose){
				if(choosingObjs.length>1){ //多选时再点一下这个节点
					node.choose();
					}else{
						node.dechoose();
					}
			}else{
				node.choose();
			}
			if(newtecYeWu){
			showNodeForm(node.procNode);}//表格显示并设值
		})
		/*双击改名事件*/
//		node.text.dblclick(renameEve);
		node.attr("title",node.text.attr("text"));
		node.dblclick(renameEve);
		node.mouseover(this.mouseoverEve);  
		node.mouseout(this.mouseoutEve);  
		node.drag(this.dragMove,this.dragStart,this.dragEnd);  //拖动事件
		node.deleteSelf = this.deleteSelf; //删除自身的
		node.choose = this.choose; //选中
		node.dechoose = this.dechoose//否选 
		node.mutichoose = this.mutichoose; //多选时自身操作
		node.click(function(){
			if(this.ischoose){
				if(choosingObjs.length>1){ //多选时再点一下这个节点
						this.choose();
					}else{
						this.dechoose();
					}
			}else{
				this.choose();
			}
//			showNodeForm(node.procNode);//表格显示并设值
			
		});
		return node;
	}
	/*给图形的实际形状，供子类重写*/
	ProcessNode.prototype.getRealShape = function(param){
		var node = paper.rect();
		node.attr({x:this.left,y:this.top,"width":this.width,fill:param.headColor?param.headColor:'#2277ee',"height":this.height,stroke:"black","stroke-width":"0.3",r:0});			
		
		return node;
	}
	ProcessNode.prototype.getShape = function(){
		return this.shape;
		}
	
	function setClick(node,nodes,callback,that){
		for(var i=0,len=nodes.length;i<len;i++){
			var node=	nodes[i][0];
			node.click(function(){
					callback(node,that);
			})
		}
		
	}
	function setdblClick(node,nodes,callback,that){
		for(var i=0,len=nodes.length;i<len;i++){
			var node=	nodes[i][0];
			node.dblclick(function(){
				callback(node,that);
			})
		}
		
	}
	/**
	 * 
	 */
var renameEve = function(){
			var node=this.belongNode,isRect=node.type=="rect",
			param=this.param,tagElem=this,isTitle=param.isTitle,
			width=param.width,height=param.height,cLeft=param.cLeft,cTop=param.cTop;
			this.hide();
			cLeft=cLeft?cLeft:0;
			cTop=cTop?cTop:0;
			console.info(param)
			var input = document.createElement("input");
			input.type="text";
			input.value = node.text.attr("text");
			input.className = "tempInput";
			input.style.left = (isRect?node.attr("x"):node.attr("cx")-node.attr("r")) + 1+cLeft +"px";	
			input.style.top = (isRect?node.attr("y"):node.attr("cy")-node.attr("r")/2)+1 +cTop+"px";
			input.style.width =(width?width: (isRect?node.attr("width"):node.attr("r")*2-2)-2)+"px";
			input.style.height =(height?height:(isRect?"35px": (isRect?node.attr("height"):20))-2)+"px";
			input.style.position = "absolute";
			input.maxLength =isRect?16:5;
			console.info(input)
			container.appendChild(input);	
			input.focus();
			input.select();
			input.onblur = function(){
				input.style.display = "none";
				var value;
				var n = node.type=="rect"?4:2
//				if(input.value.split("").length>n){
//					value =input.value.substring(0,n)+"\n"+input.value.substring(n,input.value.split("").length);
//				}else{
//				}
					value=input.value;	
				if(curShowFormEle==nodeFormEle){ //设置表单数据
					var inputsN = $(nodeFormEle).find("input");
					for(var i=0;i<inputsN.length;i++){
						if(inputsN[i].name =="name"){
							inputsN[i].value = input.value;
						}	
					}
				}
				if(isTitle)node.procNode.nodeProp.name = input.value;
				tagElem.attr("text",value);
				tagElem.show();
			}	
			background.toFront(); // 为了让点到背景 顺利触发onblur事件（点到svg元素是不触发onblur的，而我不知到为什么这个background就能触发。。也是rect） 
		}
	/*子类 普通节点*/
	var Node =function(param){
		this.left =parseInt(param.left);
		this.top = parseInt(param.top);
		this.width = param.width||130;
		this.height = param.height||100;
		this.nodeProp = new NodeProp();  //业务属性
			this.nodeProp.type = "node";
		this.setChildNode=function(childNode,height,width,left,top){//绑定孩子
			
			
			var cHeadIMg=paper.image("img/menu.png",left+25,top+55,10,10),
			bodyCNode=paper.rect(),
			cnodeBodyn=paper.rect(),
			cHeadIMgEx=paper.image("img/expand.png",left+width-35,top+55,10,10),
			cHeadText =paper.text(left+(width-40)/2+15,top+60,param.minTitle);
			cHeadText.param={width:110,height:25,cLeft:20,cTop:50}
			cHeadText.dblclick(renameEve);
			cHeadText.attr({cursor:"pointer",fill:'#fff',"font-family":"微软雅黑","font-size":"10"});
			bodyCNode.attr({x:left+20,y:top+50,"width":width-40,fill:'#2277ee',"height":height-65,"stroke-width":"0",});
			cnodeBodyn.attr({x:left+20.5,y:top+70.5,"width":width-41,fill:'#fff',"height":height-86,"stroke-width":"0"});
			var bIMg=paper.image("img/book.png",left+52.5,top+75.5,40,50);
			childNode.push([cHeadIMg,25,55]);
			childNode.push([bodyCNode,20,50]);
			childNode.push([cnodeBodyn,20.5,70.5]);
			childNode.push([cHeadIMgEx,width-35,55]);
			childNode.push([cHeadText,(width-40)/2+15,60]);
			childNode.push([bIMg,52.5,75.5]);
		}
		this.shape = this.createShape(param); //创建图形 
		this.nodeProp.name = this.shape.text.attr("text");
		this.nodeProp.nodeFlag = (defaultNodeFlag+=10);	
	
		this.shape.moveTo = function(cx,cy){
			this.ox = this.attr("x");//重设快捷工具栏要用到  移动前的坐标
			this.oy = this.attr("y");
			this.attr("x",cx-this.attr("width")/2);
			this.attr("y",cy-this.attr("height")/2);
		//	this.type==rect?this.attr("x",""):;
			console.info("---Node--resetQuickToolBarPos-------")
			resetQuickToolBarPos(this,this.quickToolBar); //调整快捷工具栏
			resetTextPos(this);//调整文字
			resetLine(this); //调整线
		}
	}
	function getTextStyle(fontSize,color){
		
		return {cursor:"pointer",fill:color||'#fff',"font-family":"微软雅黑","font-size":fontSize||10}
	}
	/*子类 普通节点*/
	var NodeExp =function(param){
		this.left =parseInt(param.left||150);
		this.top = parseInt(param.top)||100;
		this.width = param.width||130;
		this.height = param.height||100;
		this.setChildNode=function(childNode,height,width,left,top){//绑定孩子
//			var total=param.total+"",tLen=total.length*3+48,
//			blood=param.blood+"",bLen=blood.length*3+58,
//			
//			totalText =paper.text(left+28,top+50,"总数："),
//			totalNum=paper.text(left+tLen,top+50,total),
//			bloodNum=paper.text(left+bLen,top+70,blood),
//			bloodText =paper.text(left+33,top+70,"血缘数：");
//			totalText.attr(getTextStyle(12,'black'))
//			bloodText.attr(getTextStyle(12,'black'))
//			totalNum.attr(getTextStyle(12,'black'))
//			bloodNum.attr(getTextStyle(12,'black'))
//			childNode.push([totalText,28,50]);
//			childNode.push([bloodText,33,70]);
//			childNode.push([totalNum,tLen,50]);
//			childNode.push([bloodNum,bLen,70])
			var units= param.units;
			for ( var i = 0; i < units.length; i++) {
				var unit=units[i],
				enName=unit['enName'],
				tagL=left+6,
				lEn=enName.length*3+tagL,
				type=typeMap[unit['type']]+"("+unit.leng+")",
				lTy=(enName.length*6+tagL)+type.length*3+10,
				t=top+50+i*20,
				enNode=paper.text(lEn,t,enName),
				tyNode=paper.text(lTy,t,type);
				enNode.attr(getTextStyle(12,'black'))
				tyNode.attr(getTextStyle(12,'black'))
				childNode.push([enNode,lEn-left,t-top])
				childNode.push([tyNode,lTy-left,t-top])
			}
		}
		this.nodeProp = new NodeProp(param);  //业务属性
		this.shape = this.createShape(param); //创建图形 
		this.nodeProp.name = this.shape.text.attr("text");
		this.nodeProp.nodeFlag = (defaultNodeFlag+=10);	
		this.nodeProp.type = "node";
		
		this.shape.moveTo = function(cx,cy){
			this.ox = this.attr("x");//重设快捷工具栏要用到  移动前的坐标
			this.oy = this.attr("y");
			this.attr("x",cx-this.attr("width")/2);
			this.attr("y",cy-this.attr("height")/2);
		//	this.type==rect?this.attr("x",""):;
			resetQuickToolBarPos(this,this.quickToolBar); //调整快捷工具栏
			resetTextPos(this);//调整文字
			resetLine(this); //调整线
		}
	}
	var typeMap={"字符串":'vachar'}
	/*开始节点*/
	var StartNode = function(left,top,r){
		this.left =parseInt(left);
		this.top = parseInt(top);
		this.r = r;
		this.nodeProp = new NodeProp();//业务属性
		
		this.nodeProp.type = "开始";
		this.nodeProp.nodeFlag = (defaultNodeFlag+=10);	
		/*子类 重写获得的图形*/
		this.getRealShape = function(param){
			console.info("StartNode---getRealShape--")
			return paper.circle(this.left+this.r/2,this.top+this.r/2,r).attr({"fill":"#FBFB98","stroke-width":"0.5",stroke:"black"});
		}

		this.shape = this.createShape(); //创建图形 
		this.nodeProp.name = this.shape.text.attr("text");
		this.shape.moveTo = function(cx,cy){
			this.ox = this.attr("cx");//重设快捷工具栏要用到  移动前的坐标
			this.oy = this.attr("cy");
			this.attr("cx",cx);
			this.attr("cy",cy);
			resetQuickToolBarPos(this,this.quickToolBar); 
			resetTextPos(this);//调整文字
			resetLine(this);//调整线
		}
	}
	/*结束节点*/
	var EndNode = function(left,top,r){
		this.left =parseInt(left);
		this.top = parseInt(top);
		this.r = r;
		this.nodeProp = new NodeProp();//业务属性
		this.nodeProp.type = "完成";
		this.nodeProp.name = "完成点";
		this.nodeProp.nodeFlag = (defaultNodeFlag+=10);	
		this.haveCre = false; //无快速创建按钮
		this.haveStr = false; //无快速直线按钮
		this.havePol = false; //无快速折线按钮
		this.haveCur = false; //无快速曲线按钮
		/*子类 重写获得的图形*/
		this.getRealShape = function(param){
			console.info("EndNode---getRealShape--")
			return paper.circle(this.left+this.r/2,this.top+this.r/2,r).attr({"stroke-width":0.5,fill:"#AEAEAE","fill-opacity":"0.1"});
		}

		this.shape = this.createShape(); //创建图形 
		this.shape.moveTo = function(cx,cy){
			this.ox = this.attr("cx");//重设快捷工具栏要用到  移动前的坐标
			this.oy = this.attr("cy");
			this.attr("cx",cx);
			this.attr("cy",cy);
			resetQuickToolBarPos(this,this.quickToolBar); 
			resetTextPos(this);//调整文字
			resetLine(this);//调整线
		}
	}
	extend(Node,ProcessNode);   // node继承processNode 
	extend(NodeExp,Node); 
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
			lineObj.line = paper.path(path).attr({stroke: "#21ED2F", fill: "none",cursor:"pointer",'stroke-width':2});//,"arrow-end":"open-wide-long"
			lineObj.bg = bg && bg.split && paper.path(path).attr({stroke: bg.split("|")[0], fill: "blue", "stroke-width": bg.split("|")[1] || 3});
			lineObj.from = obj1;
			lineObj.to = obj2;
			lineObj.type = type;
			lineObj.procLine = this;  //维护关系
			lineObj.line.isChooing = false;
			
			var realLine = lineObj.line;
			realLine.lineObj = lineObj;
			realLine.visible=true;
			realLine.ischoose = false;
			realLine.choose = function(){
				dechooseAll(); //把其它都否选
				this.ischoose=true;
				this.attr({stroke:"red","stroke-dasharray":"- "});
				choosingObjs.push(this);
			}
			realLine.dechoose = function(){
				this.ischoose=false;
				this.attr({stroke:"blue","stroke-dasharray":""});
				choosingObjs.splice(choosingObjs.indexOf(this),1);
			}	
			realLine.click(function(){
				if(realLine.ischoose){
					this.dechoose();
				}else{
					this.choose();
				}
				if(newtecYeWu){
					showLineForm(lineObj.procLine);
				}
			})
			realLine.deleteSelf = function(unre){
				this.hide();
				this.visible=false;
				lines.splice(this.lineObj.procLine,1);
				this.lineObj.from.toline.splice(this.lineObj.from.toline.indexOf(this.lineObj),1);
				this.lineObj.to.fromline.splice(this.lineObj.to.fromline.indexOf(this.lineObj),1);
				if(unre){
					var undo = function(){
						this.show();
						this.visible=true;
						this.lineObj.from.toline.push(this);
						this.lineObj.to.fromline.push(this);
						lines.push(this.lineObj.procLine);
					};
					var redo = function(){
						this.hide();
						this.visible=false;
						this.lineObj.from.toline.splice(this.lineObj.from.toline.indexOf(this.lineObj),1);
						this.lineObj.to.fromline.splice(this.lineObj.to.fromline.indexOf(this.lineObj),1);
						lines.splice(this.lineObj.procLine,1);
					};
					addOpera(undo,redo);
				}
			}
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
		var dragStart = function(x,y){
			this.ox = remarkArea.attr("x");
			this.oy = remarkArea.attr("y");
		}
		var dragMove = function(dx,dy,x,y){
			remarkArea.attr({"x":this.ox+dx,"y":this.oy+dy});
			titleRect.attr({"x":this.ox+dx,"y":this.oy+dy-titHei});
			text.attr({"x":this.ox+dx+10,"y":this.oy+dy-titHei+10});
			deleteBtn.attr({"x":this.ox+dx+areaWid-18,"y":this.oy+dy-23});	
			ctrlPoint.attr({"x":this.ox+dx+areaWid-3,"y":this.oy+dy+areaHei-3});	
			bottomLine.attr({"x":this.ox+dx-3,"y":this.oy+dy+areaHei-3});	
			rightLine.attr({"x":this.ox+dx+areaWid-3,"y":this.oy+dy-3});	
		}
		var dragEnd = function(){
			var ox = this.ox;
			var oy = this.oy;
			var finalX = remarkArea.attr("x");
			var finalY = remarkArea.attr("y");
			var undo = function(){
				remarkArea.attr({"x":ox,"y":oy});
				titleRect.attr({"x":ox,"y":oy-titHei});
				text.attr({"x":ox+10,"y":oy-titHei+10});
				deleteBtn.attr({"x":ox+areaWid-18,"y":oy-23});
				ctrlPoint.attr({"x":ox+areaWid-3,"y":oy+areaHei-3});
				bottomLine.attr({"x":ox-3,"y":oy+areaHei-3});	
				rightLine.attr({"x":ox+areaWid-3,"y":oy-3});
			};
			var redo = function(){
				remarkArea.attr({"x":finalX,"y":finalY});
				titleRect.attr({"x":finalX,"y":finalY-titHei});
				text.attr({"x":finalX+10,"y":finalY-titHei+10});
				deleteBtn.attr({"x":finalX+areaWid-18,"y":finalY-23});
				ctrlPoint.attr({"x":finalX+areaWid-3,"y":finalY+areaHei-3});
				bottomLine.attr({"x":finalX-3,"y":finalY+areaHei-3});	
				rightLine.attr({"x":finalX+areaWid-3,"y":finalY-3});
			};
			addOpera(undo,redo);
		}
		text.drag(dragMove,dragStart,dragEnd);
		titleRect.drag(dragMove,dragStart,dragEnd);
		remarkArea.drag(dragMove,dragStart,dragEnd);
		var renameEve = function(e,x,y){
			text.hide();
			var input = document.createElement("input");
			input.type="text";
			input.value = text.attr("text");
			input.className = "tempInput";
			input.style.left = titleRect.attr("x") +"px";	
			input.style.top = titleRect.attr("y") +"px";
			input.style.width = titleRect.attr("width")*0.6+"px";
			input.style.height = titleRect.attr("height") +"px";
			input.style.position = "absolute";
			input.maxLength = 12;
			container.appendChild(input);	
			input.focus();
			input.select();
			input.onblur = function(){
				input.style.display = "none";
				text.attr("text",input.value);
				text.show();
			}	
			background.toFront(); // 为了让点到背景 顺利触发onblur事件（点到svg元素是不触发onblur的，而我不知到为什么这个background就能触发。。也是rect） 
		}
		text.dblclick(renameEve);
		titleRect.dblclick(renameEve);
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

		/*右下方控制点拖动事件 调整大小*/
		ctrlPoint.drag(function(dx,dy,x,y){ //dragMove
			self.resizeTo(this.owidth+dx,this.oheight+dy);

		},function(){  //dragStart
			this.ox = this.attr("x"); //控制点的x
			this.oy = this.attr("y");
			this.owidth =remarkArea.attr("width");
			this.oheight = remarkArea.attr("height");
		},function(){//dragEnd
			var fx = this.attr("x");
			var fy = this.attr("y");
			var fwidth = remarkArea.attr("width");
			var fheight = remarkArea.attr("height");
			var ox = this.ox;//控制点的x
			var oy = this.oy;
			var owidth = this.owidth;
			var oheight = this.oheight;
			
			var undo = function(){
				titleRect.attr({"width":owidth});
				remarkArea.attr({"width":owidth,"height":oheight});
				ctrlPoint.attr({"x":ox,"y":oy});
				rightLine.attr({"x":ox,"height":oheight});
				bottomLine.attr({"width":owidth,"y":oy});
				areaWid =owidth; //area长度;
				areaHei =oheight; //area宽度;
				deleteBtn.attr({"x":remarkArea.attr("x")+remarkArea.attr("width")-18,"y":remarkArea.attr("y")-23});
			};
			var redo = function(){
				titleRect.attr({"width":fwidth});
				remarkArea.attr({"width":fwidth,"height":fheight});
				ctrlPoint.attr({"x":fx,"y":fy});
				rightLine.attr({"x":fx,"height":fheight});
				bottomLine.attr({"width":fwidth,"y":fy});
				areaWid =fwidth; //area长度;
				areaHei =fheight; //area宽度;
				deleteBtn.attr({"x":remarkArea.attr("x")+remarkArea.attr("width")-18,"y":remarkArea.attr("y")-23});
			};
			addOpera(undo,redo);
		})
		
		/*下方控制线拖动事件 调整大小 只能调整宽度*/
		bottomLine.drag(function(dx,dy,x,y){ //dragMove
			self.resizeTo(this.owidth,this.oheight+dy);
		},function(){  //dragStart
			this.oy = this.attr("y");
			this.owidth =remarkArea.attr("width");
			this.oheight = remarkArea.attr("height");
		},function(){//dragEnd
			var fy = this.attr("y");
			var fheight = remarkArea.attr("height");
			var oy = this.oy;
			var oheight = this.oheight;
			
			var undo = function(){
				remarkArea.attr({"height":oheight});
				ctrlPoint.attr({"y":oy});
				rightLine.attr({"height":oheight});
				bottomLine.attr({"y":oy});
				areaHei =oheight; //area宽度;
				deleteBtn.attr({"y":remarkArea.attr("y")-23});
			};
			var redo = function(){
				remarkArea.attr({"height":fheight});
				ctrlPoint.attr({"y":fy});
				rightLine.attr({"height":fheight});
				bottomLine.attr({"y":fy});
				areaHei =fheight; //area宽度;
				deleteBtn.attr({"y":remarkArea.attr("y")-23});
			};
			addOpera(undo,redo);
		})
		
		/*右方控制线拖动事件 调整大小 只能调整长度*/
		rightLine.drag(function(dx,dy,x,y){ //dragMove
			self.resizeTo(this.owidth+dx,this.oheight);
		},function(){  //dragStart
			this.ox = this.attr("x");
			this.owidth =remarkArea.attr("width");
			this.oheight = remarkArea.attr("height");
		},function(){//dragEnd
			var fx = this.attr("x");
			var fwidth = remarkArea.attr("width");
			var ox = this.ox;//控制点的x
			var owidth = this.owidth;
			
			var undo = function(){
				titleRect.attr({"width":owidth});
				remarkArea.attr({"width":owidth});
				ctrlPoint.attr({"x":ox});
				rightLine.attr({"x":ox});
				bottomLine.attr({"width":owidth});
				areaWid =owidth; //area长度;
				deleteBtn.attr({"x":remarkArea.attr("x")+remarkArea.attr("width")-18});
			};
			var redo = function(){
				titleRect.attr({"width":fwidth});
				remarkArea.attr({"width":fwidth});
				ctrlPoint.attr({"x":fx});
				rightLine.attr({"x":fx});
				bottomLine.attr({"width":fwidth});
				areaWid =fwidth; //area长度;
				deleteBtn.attr({"x":remarkArea.attr("x")+remarkArea.attr("width")-18});
			};
			addOpera(undo,redo);
		})
		this.toBack = function(){
			ctrlPoint.toBack();
			rightLine.toBack();
			bottomLine.toBack();
			deleteBtn.toBack();
			text.toBack();
			titleRect.toBack();
			remarkArea.toBack();
			background.toBack();
		}
		this.toBack();
		this.hide = function(){
			text.hide();
			titleRect.hide();
			remarkArea.hide();
			deleteBtn.hide();
			ctrlPoint.hide();
			bottomLine.hide();
			rightLine.hide();
		}
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
		deleteBtn.click(function(){
			self.hide();
			addOpera(function(){self.show();},function(){self.hide();});
		})	
	}
	/*全部否选事件*/
	function dechooseAll(){
		for(var i=0;i<choosingObjs.length;i++){ // 把其它点都否选
			choosingObjs[i].ischoose = false;
			if(choosingObjs[i].type=="rect"||choosingObjs[i].type=="circle"){
				choosingObjs[i].attr({stroke:"black","stroke-dasharray":"","stroke-width":"0.5"});
			}else{
				choosingObjs[i].attr({stroke:"black","stroke-dasharray":""});
			}
		}	
		choosingObjs.splice(0);
	}

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
	
	function resetTextPos(node){
		if(node.type=="rect"){//定义节点自己的快速工具栏  
//			node.text.attr({x:node.attr("x")+node.attr("width")/2,y:node.attr("y")+15});
			}else{
			node.text.attr({x:node.attr("cx"),y:node.attr("cy")});
			}
	}
	//拖动结束时 节点自动对齐
	function autoAdjust(node){
		var piancha = 8;
		var closestX=10000;//最近的X
		var closestY=10000; //最近的Y
		var nodeCx = node.type=="rect"? node.attr("x") + node.attr("width")/2:node.attr("cx");
		var nodeCy = node.type=="rect"? node.attr("y") + node.attr("height")/2:node.attr("cy");
	 
		for(var i = 0;i<nodes.length;i++){
			
			var shape= nodes[i].getShape();
			if(shape.id ===node.id) continue;  //跳过自己
			var cx;
			var cy;
			if(shape.type=="rect"){
				cx = shape.attr("x")+shape.attr("width")/2;
				cy = shape.attr("y")+shape.attr("height")/2;
			}else
			{
				cx = shape.attr("cx");
				cy=  shape.attr("cy");
			}
			Math.abs(nodeCx-cx)<Math.abs(nodeCx-closestX)?closestX = cx : true;
			Math.abs(nodeCy-cy)<Math.abs(nodeCy-closestY)?closestY = cy : true;
		}
			
		if(Math.abs(nodeCx-closestX)<piancha){ //如果X轴离得最近的节点 靠的足够近 就把当前节点 靠过去
			if(node.type=="rect"){
				node.attr("x",closestX-node.attr("width")/2);
			}else{
				node.attr("cx",closestX);
			}
		}
			
		if(Math.abs(nodeCy-closestY)<piancha){ //如果X轴离得最近的节点 靠的足够近 就把当前节点 靠过去
			if(node.type=="rect"){
				node.attr("y",closestY-node.attr("height")/2);
			}else{
				node.attr("cy",closestY);
			}
		}			
		
	}

	function ieDragStartFix(node){   //ie 下线移动前的修复
		var allLines = node.fromline.concat(node.toline); //拖动时先把箭头弄掉不然 ie下线是不能正常移动的
		for(var i = 0;i<allLines.length;i++){
			var line = allLines[i].line;
			var from = allLines[i].from;
			var to = allLines[i].to;
			var type = allLines[i].type;
			
			
	//		lines.splice(lines.indexOf(allLines[i].procLine), 1); //全局保存线的去掉这条线	
	//		var index = from.toline.indexOf(allLines[i]);
	//		from.toline.splice(from.toline.indexOf(allLines[i]), 1); //节点也把这条线删了
	//		var index1 = from.toline.indexOf(allLines[i]);
	//		to.fromline.splice(to.fromline.indexOf(allLines[i]), 1);
			
		    var newline = connect(from,to,lineColor,type); //重连这条线 是没有箭头的 只取其形状 即newline.line
		    /*因为connect时把线对象也加进全局保存的数组中,维护了关系， 所以要去掉关系*/
		    lines.splice(lines.indexOf(newline.procLine), 1);
		    from.toline.splice(from.toline.indexOf(newline), 1); //节点也把这条线删了
		    to.fromline.splice(to.fromline.indexOf(newline), 1);
		    
		    
		    if(!from.visible||!to.visible){//任意一个节点是被删除了的就隐藏新创建的线
		    	newline.line.hide();
		    	newline.line.visible=false;
		    }
		    if(!line.visible){  //如果原来的线是隐藏的，新线也隐藏
		    	newline.line.hide();
		    	newline.line.visible=false;
		    }
		    line.remove(); //把原来的线去掉
		    allLines[i].line = newline.line;//保留原来的线对象，保留关系,改变其线形状.让其指向新的线形状
		}
	}
	function ieDragEndFix(node){//ie 下线移动后的修复
		var allLines = node.fromline.concat(node.toline); //拖动结束把箭头显示
		for(var i = 0;i<allLines.length;i++){
			allLines[i].line.attr("arrow-end","open-wide-long");
		}
	}
	/*给字添加拖动事件 能够操纵节点*/
	function createTextDragEve(text,node){
		var dragmove = function(dx,dy,x,y){			
			if(defaultOn){
				var isRect=node.type=="rect",x=node.ox + dx,y=node.oy + dy;
				var curx = isRect?node.attr("x"):node.attr("cx");
				var cury = isRect?node.attr("y"):node.attr("cy");
//				node.type=="rect"?node.attr({x: node.ox + dx, y: node.oy + dy}):node.attr({cx: node.ox + dx, cy: node.oy + dy});
//				/*调整快捷工具栏*/
//				resetQuickToolBarPos(node.ox + dx - curx,node.oy + dy - cury,node.quickToolBar); //这里要传的应该是每次的变化量  而dxdy是总的变化量
				if(isRect){
						node.attr({x:x, y:y});		
						var childNode=node.childNode;
						if(childNode&&childNode.length>0)
						for (var i=0;i<childNode.length;i++) {
								var cn=childNode[i];
								cn[0].attr({x:x+cn[1],y:y+cn[2]});
						}
				}else{
					node.attr({cx: x, cy:y})
				}
				resetTextPos(node);//调整文字
				/*调整线*/
				if(node.fromline){
					for(var i=0;i<node.fromline.length;i++){
						connect(node.fromline[i]);
					}
				}
				if(node.toline){
					for(var i=0;i<node.toline.length;i++){
						connect(node.toline[i]);
					}
				}

			}else if(curlineOn||polylineOn||straightlineOn){			
				node.templine.to={flag:1,x:node.ox+dx,y:node.oy+dy};
				connect(node.templine);
				node.endX = x;
				node.endY = y;	
			}
		}
		var dragstart=function(x,y,e){
			/*为了拖动时不显示快捷工具栏*/
			node.unmouseover();//先取消mouseover事件 在dragEnd重新启用
			node.unmouseout();
			if(node.quickToolBar)
					node.quickToolBar.hide();
	//		node.text.hide(); //拖动开始隐藏文字
			if(defaultOn){
				if(ie){ //ie下得先对线作一定处理
					ieDragStartFix(node);
				}
			  node.ox = node.type=="rect"?node.attr("x"):node.attr("cx");
			  node.oy = node.type=="rect"?node.attr("y"):node.attr("cy");
			}else if(curlineOn||polylineOn||straightlineOn){
				 //因为点击的是字体 所以要获取字体的左上角坐标 而且加上offsetX   还是会有点偏差 因为字体的x y是字体的中心点   无伤大雅
				node.ox = node.text.attr("x")+e.offsetX;
				node.oy = node.text.attr("y")+e.offsetY;
				
				if(curlineOn){
					node.templine = connect(node,{flag:1,x:node.ox,y:node.oy},lineColor,"curve");
				}else if(polylineOn){
					node.templine = connect(node,{flag:1,x:node.ox,y:node.oy},lineColor,"poly");
				}else{
					node.templine = connect(node,{flag:1,x:node.ox,y:node.oy},lineColor,"straight");		
				}
			
//				node.ox = nodex+e.offsetX;
//				node.oy = nodey+e.offsetY;
			}
		};
		var dragend = function(dx,dy,x,y){
			node.mouseover(node.procNode.mouseoverEve);//回复mouseover事件 dragStart的时候取消了
			if(node.quickToolBar)
					node.mouseover(node.quickToolBar.mouseover); //回复关于工具栏的事件 dragStart的时候取消了
			node.mouseout(node.procNode.mouseoutEve);
			if(node.quickToolBar)
					node.mouseout(node.quickToolBar.mouseout);
			//node.text.show();//拖动结束显示文字
			
			var isRect=node.type=="rect",x=node.attr("x") ,y=node.attr("y");
			if(isRect){
						node.attr({x:x, y:y});		
						var childNode=node.childNode;
						if(childNode&&childNode.length>0)
						for (var i=0;i<childNode.length;i++) {
								var cn=childNode[i];
								cn[0].attr({x:x+cn[1],y:y+cn[2]});
						}
				}else{
					node.attr({cx: x, cy:y})
				}
			if(defaultOn){
				autoAdjust(node); //调整位置;
				/*调整快捷工具栏*/
				if(node.quickToolBar)
						resetQuickToolBarPos(node,node.quickToolBar); 
				resetTextPos(node);//调整文字
				/*调整线*/
				if(node.fromline){
					for(var i=0;i<node.fromline.length;i++){
						connect(node.fromline[i]);
					}
				}
				if(node.toline){
					for(var i=0;i<node.toline.length;i++){
						connect(node.toline[i]);
					}
				}
				if(ie){ //ie下得先对线作一定处理	
					ieDragEndFix(node);
				}
				 /*中心坐标*/
				var startCX = node.type=="rect"?node.ox+node.attr("width")/2:node.ox;
				var startCY = node.type=="rect"?node.oy+node.attr("height")/2:node.oy;
				var endCX = node.type=="rect"?node.attr("x")+node.attr("width")/2:node.attr("cx");
				var endCY = node.type=="rect"?node.attr("y")+node.attr("height")/2:node.attr("cy");
				
				var undo = function(){
					node.moveTo(startCX,startCY);
				};
				var redo = function(){
					node.moveTo(endCX,endCY);
				};
				addOpera(undo,redo);
				
			}else if(curlineOn||polylineOn||straightlineOn){ //三种线随意一种在画就触发
				node.text.show();//拖动结束显示文字
				node.templine.line.remove();node.templine=undefined;
				var toElement = paper.getElementByPoint(node.endX,node.endY);
				if(toElement&&toElement.type=="text"){toElement=toElement.belongNode;}//如果得到是文字，重新指向其对应的节点 
				if(toElement!=null&&toElement.id!=node.id&&toElement.procNode){ //有元素要连 并且不是自己 且是节点 
					var line;
					if(curlineOn){//连线 并加进当前对象的toline中 和 另一对象toElement 的fromline中 还加进全局的 lines中
						line = connect(node,toElement,lineColor,"curve");
					}else if(polylineOn){
						line = connect(node,toElement,lineColor,"poly");
					}else{ //默认直线
						line = connect(node,toElement,lineColor,"straight");
					}
					line.line.attr({"arrow-end":"open-wide-long"});
					var undo = function(){
						line.line.hide()
						line.line.visible=false;
						lines.splice(lines.indexOf(line.procLine),1);
						};
					var redo = function(){
						line.line.show();
						line.line.visible=true;
						lines.push(line.procLine);
						};
					addOpera(undo,redo);
				}
			}
		};
		if(Newtec.Utils.isArray(text)){
			for(var i=0;i<text.length;i++){
					var t=text[i][0];
					t.drag(dragmove,dragstart,dragend);
					t.belongNode=node
					t.isChildNode=true
			}
		}else{
			text.drag(dragmove,dragstart,dragend);
			text.belongNode=node
			text.isChildNode=true;
		}
	}
	
	
	/*-----------------------------------------------业务相关的------------------------------------------------*/
	
	 /*节点业务属性*/
	function NodeProp(){
		this.id="";
		this.processId="";
		this.key1=""; // 流程定义标记
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
		this.key1=""; 
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
	
	var processForm; //流程表单
	var nodeForm; //节点表单
	var lineForm; //线表单
	var curShowForm;  //当前正在显示的表单
	
	var processFormEle;//流程表单元素
	var nodeFormEle; //节点表单元素
	var lineFormEle; //线表单元素
	var curShowFormEle; //当前显示表单的DOM元素
	
	var curNode;//当前显示表单对应的节点
	var curLine;//当前显示表单对应的箭头
	/*创建三个表单*/
	function initForm(){ //业务
		 processForm = Newtec.Form.create({appendTo:'#processForm',ds:Newtec.DS.get('bPMProcess'),autoFetch:true,titleColumn:"2",columnNum:"3"});
		 nodeForm = Newtec.Form.create({appendTo:'#nodeForm',ds:Newtec.DS.get('bPMNode'),autoFetch:true,titleColumn:"2",columnNum:"3"});
		 lineForm=	Newtec.Form.create({appendTo:'#lineForm',ds:Newtec.DS.get('line'),autoFetch:true,titleColumn:"2",columnNum:"3"});
		
		 processFormEle = document.getElementById("processForm");
		 nodeFormEle = document.getElementById("nodeForm");
		 lineFormEle = document.getElementById("lineForm");
		 
		 nodeFormEle.style.display = "none";
		 lineFormEle.style.display = "none";
		 processFormEle.style.height = "0%";
		 nodeFormEle.style.height = "0%";
		 lineFormEle.style.height = "0%";
		 
		 curShowForm = processForm;
		 curShowFormEle = processFormEle;
	}
	
	/*显示表格并设置数据*/
	function showNodeForm(processNode){ 
//		if(curFocusInput){   //选择节点时 先判断有没有触发blur
//			curFocusInput.blur();
//		}
//		
//		curShowFormEle.style.display = "none";
//		nodeFormEle.style.display = "block";
//		curShowFormEle = nodeFormEle;
//		curShowForm = nodeForm;
//		curNode = processNode;
//		
//		var inputs = $(nodeFormEle).find("input");
//		for(var i=0;i<inputs.length;i++){
//			inputs[i].value = curNode.nodeProp[inputs[i].name];	
//		}
//		
	}
	/*显示表格并设置数据*/
	function showProcessForm(){
		curShowFormEle.style.display = "none";
		processFormEle.style.display = "block";
		curShowFormEle = processFormEle;
		curShowForm = processForm;
	}
	
	/*显示表格并设置数据*/
	function showLineForm(processLine){	
//		curShowFormEle.style.display = "none";
//		lineFormEle.style.display = "block";
//		curShowFormEle = lineFormEle;
//		curShowForm = lineForm;
//		curLine = processLine;
//		
//		var inputs = $(lineFormEle).find("input");
//		for(var i=0;i<inputs.length;i++){
//			inputs[i].value = curLine.lineProp[inputs[i].name];	
//		}
	}
	/*保存方法*/
	function save(){
		newOrSave();
		
	}
	/*保存流程 id为空则新建 */
	function newOrSave(id){
		var prop={};
		for(x in processProp){  //构造流程属性 带前缀 p
			if(id){processProp.id = id;}
			else{processProp.id = "";}//若id参数存在 即为保存操作 否则为新建操作
			prop['p_'+x] = processProp[x];
		}
		for(var i=0;i<nodes.length;i++){  //构造节点属性 带前缀 n-下标-
			var nodeProp = nodes[i].nodeProp;
			var nodeShape = nodes[i].getShape();
			/*先给nodeProp赋必要的属性*/
			nodeProp.positionX = nodeShape.type=="rect"?(nodeShape.attr("x")+nodeShape.attr("width")/2).toFixed():nodeShape.attr("cx").toFixed();
			nodeProp.positionY = nodeShape.type=="rect"?(nodeShape.attr("y")+nodeShape.attr("height")/2).toFixed():nodeShape.attr("cy").toFixed();
			nodeProp.toNodeFlag="";
			//拼凑toNodeFlag;
			for(var j=0;j<nodeShape.toline.length;j++){
				if(nodeShape.toline[j].line.visible){ //处理线之间的关系有点复杂 但已经严格控制好visible 所以用visible来判断就行了 为true的才是真正存在的线
					if(nodeProp.toNodeFlag==""){
						nodeProp.toNodeFlag  = nodeShape.toline[j].to.procNode.nodeProp.nodeFlag;
					}else{
						nodeProp.toNodeFlag  = ""+nodeProp.toNodeFlag+","+nodeShape.toline[j].to.procNode.nodeProp.nodeFlag;
					}
				}
			}
			
			
			for(x in nodeProp){
				prop['n_'+i+'_'+x]=nodeProp[x];
			}
		}
		var trueLines =[]; // 真正传到后台的线的
		var t=0; //临时计算用 
		for(var i=0;i<lines.length;i++){  //构造线属性 带前缀 l-下标-
			if(lines[i].getLine().line.visible){//处理线之间的关系有点复杂 但已经严格控制好visible 所以用visible来判断就行了 为true的才是真正存在的线
				
				var lineProp = lines[i].lineProp;
				lineProp.fromNodeFlag = lines[i].getLine().from.procNode.nodeProp.nodeFlag;
				lineProp.toNodeFlag = lines[i].getLine().to.procNode.nodeProp.nodeFlag;
				lineProp.type = lines[i].getLine().type
				for(x in lineProp){
					prop['l_'+t+'_'+x]=lineProp[x]; //这里用t 不用i 保证传到后台线数据的排序正确

				}
				trueLines.push(lines[i]);// 真正传到后台的线的
				t++;
			}
		}
		for(var i=0;i<remarks.length;i++){  //构造区域备注属性 带前缀 r-下标-
			prop['r_'+i+'_'+'contents'] = remarks[i].text.attr("text");
			prop['r_'+i+'_'+'positionX'] = remarks[i].remarkArea.attr("x").toFixed();
			prop['r_'+i+'_'+'positionY'] = remarks[i].remarkArea.attr("y").toFixed();
			prop['r_'+i+'_'+'width'] = remarks[i].remarkArea.attr("width");
			prop['r_'+i+'_'+'height'] = remarks[i].remarkArea.attr("height");		
		}
		
		
		prop.nodeNum = nodes.length;
		prop.lineNum = trueLines.length; 
	//	prop.lineNum = lines.length; //因为线的逻辑难以处理 所以是通过visible来判断是否真的存在线 所以不能用lines的长度来判断真正传到后台的线 lines里面的线有些是被删了的
		prop.remarkNum = remarks.length;
		
		console.log(prop);
//		var data = '{"processProp":'+processJson+',"nodeProps":'+nodeJson+',"lineProps":'+lineJson+'}'
        Newtec.DS.get("bPMProcess").updateData({
            operId: 'saveProcessNode',
            data:prop,	
            callback:function(res){
            	Newtec.Window.createHint({html: '<span>'+res.data.message+'<span>'});
            	if(res.data.message=="保存成功"){
            		closeProcessDesigner();//关闭流程设计器
            	}
//                alert(Newtec.Utils.json2str(res));
            }
        });
	}
	/*保存流程*/
	function saveas(){ //必须读取后才能保存流程 未读取只能新建
		var processId = processProp.id;
		if(!processId){Newtec.Window.createHint({html: '<span>旧版本流程不存在,请先新建流程！<span>'}); return;}
//		var process_id = "dfgdfg:2" //测试时使用
		newOrSave(processId);	
	}
	/*读出流程*/
	function load(processId){ 
        drawAndSetData();
	}
	function drawAndSetData(parasm){
	var time=new Date();time=time.getTime();
	var datas= parasm['datas'], index=1,tack=[],tackNum=[],//pop()
	 data=datas[0];rootId=data.id,max=0;plines=[],parentTo={},
	idtoMap={},idtoNum={},numTotal={'0':1};
	idtoNum[rootId]=0;
	parentTo['rootID']=[datas[0]['id']];
	
	for (var i=0;i<datas.length;i++) {
		var t=datas[i];
		idtoMap[t.id]=t;
	}
	var tagNumNodeId={};
	while(rootId){
		var taglen=0;
		for (var i =0;i<datas.length;i++) {
			var t2=datas[i];
			if(t2.parentId&&t2.parentId.indexOf(rootId)>=0){
				var cId=t2.id;
				if(parentTo[rootId]){
					var arr= parentTo[rootId];
					if(arr.contains(cId))continue;
					arr.push(cId);
				}else{
					parentTo[rootId]=[cId];
				}
				tack.push(cId)
				plines.push({fromNodeFlag:rootId,toNodeFlag:cId})
				tackNum.push(index+1);//层数加一
				taglen++;
				var tagnodeIds=tagNumNodeId[index]?tagNumNodeId[index]:"";
				numTotal[index]=numTotal[index]?(tagnodeIds.indexOf(cId)>0?numTotal[index]:numTotal[index]+1):1;
				tagNumNodeId[index]=tagnodeIds+","+cId;
				idtoNum[cId]=index;
			}
		}
		rootId=tack.pop()//获取下个
		index=tackNum.pop();//
		max=max>taglen?max:taglen;
	}
	var height=max*200;tagLeft=50,minLeft=250,pnodes=[],tagNum={},isPnodes={};
	idtoNum['rootID']=-1
	function getNode(rootId){
		var cIds=parentTo[rootId];
		if(cIds&&cIds.length>0){
			var len=numTotal[idtoNum[rootId]+1],
			reNum=0,
			tagHeigth=height/len;
			for (var i=0;i<cIds.length;i++) {
				var cId=cIds[i];
				if(isPnodes[cId]){
					continue;
				}else{
					isPnodes[cId]=true;
				}
				var aData=idtoMap[cId],nodeH=aData.height?aData.height:100;
				console.info("==="+nodeH)
				var  l=idtoNum[cId],
				t=tagNum[l]?tagNum[l]:0;
				tagNum[l]=t+1;
				aData['top']=tagHeigth*(t+0.5)-nodeH/2;
				aData['left']=(l)*minLeft+tagLeft;
				aData['nodeFlag']=aData['id'];
				aData['node']="node";
				pnodes.push(aData);
				getNode(cId)
			}
		}
		
	}
	console.info(pnodes);
		getNode("rootID")
		//设流程属性
		process=parasm.process||{};
		for(x in processProp){
			processProp[x] = process[x];
		}
		var inputs = $(processFormEle).find("input");
		for(var i=0;i<inputs.length;i++){
			inputs[i].value = processProp[inputs[i].name];	
		}
//		pnodes=parasm.nodes||[{type:'node',left:100,top:300,nodeFlag:20,title:'infoshar_459736185',minTitle:'dfdf',total:50000,blood:451}
//		,{type:'node',left:330,top:300,nodeFlag:30,title:'infoshar_459736185',minTitle:'dfdf',total:50000,blood:451}]
//		//画节点
		for(var i=0;i<pnodes.length;i++){
			var pnode = pnodes[i];
			var x  = pnode.left;
			var y = pnode.top;
			var type = pnode.type;
			var node= new NodeExp(pnode);
			nodes.push(node);
			for(x in node.nodeProp){
				node.nodeProp[x] = pnode[x];
			}
		}
//		plines=parasm.lines||[{fromNodeFlag:20,toNodeFlag:30}]
		//画线
		for(var i=0;i<plines.length;i++){
			var pline = plines[i];
			var from;
			var to;
			var type = "curve";
			
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
		var t2=new Date();
		console.info("花费时间为："+(t2.getTime()-time))
	}
	

	var curFocusInput; //当前focus的input输入框,为了解决点击节点时不触发onblur事件而诞生
	
	/*给input 添加事件输入后保存到对应的属性上*/
	function formFieldEve(){ //这里使用了jq 反正是业务相关的 而newtec 使用了jq 不影响设计器用纯js写的问题
		var inputs = $(processFormEle).find("input");
		for(var i=0;i<inputs.length;i++){
			inputs.eq(i).blur(function(){
				processProp[this.name] = this.value;
			})
			//给特定几个输入框加脚本编辑事件
			if(inputs[i].name == "startProcessBefore"||inputs[i].name == "startProcessAfter"||inputs[i].name == "finshProcessBefore"||inputs[i].name == "finshProcessAfter")
			{
				inputs.eq(i).dblclick(function(){
					createCodeHint(this.value,this);
				})
			}
			
			
		}
		var inputsN = $(nodeFormEle).find("input");
		for(var i=0;i<inputsN.length;i++){
			inputsN[i].blurr = false;
			inputsN.eq(i).blur(function(){
				curNode.nodeProp[this.name] = this.value;
				if(this.name =="name"){
					if(curNode.getShape().type=="rect"){
						curNode.getShape().text.attr("text",this.value.substring(0,4)+"\n"+this.value.substring(4,8));
					}else{
						curNode.getShape().text.attr("text",this.value.substring(0,2)+"\n"+this.value.substring(2,5));
					}
				}
				
			})
			//给特定几个输入框加脚本编辑事件
			if(inputsN[i].name == "complateTaskBefore"||inputsN[i].name == "complateTaskAfter"){
				inputsN.eq(i).dblclick(function(){
					createCodeHint(this.value,this);
				})
			}
			
			inputsN.eq(i).focus(function(){  //为了解决点击节点时不触发onblur事件而诞生 选择输入框时 作好当前输入框标记 以便
				curFocusInput =this;
			})
		}
		
		var inputsL = $(lineFormEle).find("input");
		for(var i=0;i<inputsL.length;i++){
			inputsL.eq(i).blur(function(){
				curLine.lineProp[this.name] = this.value;
			})
		}
		
	}

	
//		
//	
//	
	/*-----------------------------------------------业务相关的------------------------------------------------*/
	/*-----------------------------------------------脚本编辑器------------------------------------------------*/
	var editor
	function createCodeHint(value,input){
		var win = Newtec.Window.create({
	        title: '脚本编辑器',
	        width: 1024,
	        height: 600,
	        body: '<iframe id ="codeEditor" src="thirdparty/codemirror/lib/codeEditor/html/codeEditor.html" width="990" height="560" frameborder="0"></iframe>',
	        finsh:function(){
	        	var ifrWin = document.getElementById("codeEditor").contentWindow; //获取编辑器页面的window对象
	        	ifrWin.initEditorContext(value); //设置值
	        	if(setHintJson()){
	        	ifrWin.setJavaJson(setHintJson())};//设置提示的内容
			},
			footer:Newtec.Button.create({
                id: 'save',
                title: '保存',
                click: function () {
                	var ifrWin = document.getElementById("codeEditor").contentWindow
                	input.value = ifrWin.getEditorContext();//保存按钮
                	processProp[input.name] = input.value;//将数据保存到内存中，以便将脚本编辑器的脚本传到后台 by黎延晖
                	win.close();
                	
                }
				})
                
            });
	}
	//在浏览器控制台打印对象的属性值
	function writeObj(obj){ 
		 var description = ""; 
		 for(var i in obj){ 
		 var property=obj[i]; 
		 description+=i+" = "+property+"\n"; 
		 } 
		 console.log(description); 
		} 
	
	function setHintJson(){  //这里是设置提示的内容 Json格式 不设置默认只有几个提示
		var Json;//自己设置Json对象
		return Json;
	}
	//在浏览器控制台打印文本
	function log(obj){
		console.log(obj);
	}
	/**
	 * 功能：获取水平居中坐标
	 * @param {Object} left 父亲left值（x）
	 * @param {Object} pWidth 父亲宽度
	 * @param {Object} cWidth 孩子宽度
	 */
	function getLeftM(left,pWidth,cWidth){
		return (left+ (pWidth-cWidth)/2)
	}
	/**
	 * 
	 * @param {Object} top
	 * @param {Object} pHeight
	 * @param {Object} cHeight
	 */
	function getTopM(top,pHeight,cHeight){
		return (top+ (pHeight-cHeight)/2)
	}
	/*-----------------------------------------------脚本编辑器------------------------------------------------*/
	
	
	var deleteButRSrc = "myqdp/images/processDesigner/rubbish-red.png";  //红色
	var deleteButBSrc = "myqdp/images/processDesigner/rubbish-black.png"; //黑色
	var createButRSrc = "myqdp/images/processDesigner/create-red.png";
	var createButBSrc = "myqdp/images/processDesigner/create-black.png";
	var	straightButRSrc = "myqdp/images/processDesigner/straightline-red.png";
	var	straightButBSrc = "myqdp/images/processDesigner/straightline-black.png";
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
	return processDesigner;
})))