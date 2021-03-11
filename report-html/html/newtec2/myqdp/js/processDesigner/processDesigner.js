(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
			: typeof define === 'function' && define.amd ? define(factory)
					: (global.ProcessDesigner = factory(global.Raphael || {}));
}
		(
				this,
				(function() {
					// if(Raphael==undefined) console.error("没有加载raphael.js!");
					// console.log(Raphael);

					var userAgent = navigator.userAgent;

					var ie_upto10 = /MSIE \d/.test(userAgent);
					var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/
							.test(userAgent);
					var ie = ie_upto10 || ie_11up; // 是否为IE

					var background; // 背景
					var defaultOn = true // 默认选择状态
					var curlineOn = false; // 曲线按钮激活状态
					var polylineOn = false; // 折线按钮激活状态
					var straightlineOn = false; // 直线按钮激活状态
					var nodeIcon; // 左边工具栏节点图标对象
					var curlineIcon; // 左边工具栏曲线图标对象
					var polylineIcon; // 左边工具栏折线图标对象
					var straightlineIcon; // 左边工具栏直线图标对象

					var choosingObjs = []; // 正在选中的节点和 线 （实际线）

					var paperWidth;// 画板长 包括工具栏
					var paperHeight; // 画板宽
					var toolBarWidth = 40; // 工具栏宽度
					var lineColor = "#154188" // 线的颜色

					var nodes = []; // 所有节点
					var lines = []; // 所有的线
					var remarks = [];// 区域备注
					var processDesigner = {};
					var paper;

					var container; // 页面上的元素
					var undoStack = []; // 回退栈 每做一次操作 往回退栈中添加操作对象（包含当前操作及其反操作）
					// 并清空重做栈 点解回退按钮时 把栈顶元素弹出执行操作并把操作压入重做栈
					var redoStack = []; // 重做栈 每次重做就把操作从重做栈中弹出并执行
					var nodeNameCount = 1; // 节点名称计数器
					var defaultNodeFlag = 0;// 默认节点标记

					var newtecYeWu = true; // 业务相关 操作
					var processProp;

					var toolbarColor = "#D1E1F0";
					var nodeColor = "#D5E7FF";
					var nodeBorderColor = "#8AA2BE";
					var mouseOverRectColor = "#EBF0F6";
					var mouseOverRectBordColor = "#8F9BA7";
					var nodeTextColor = "#154188";
					/* 创建流程设计器 */
					processDesigner.create = function(processContainer,
							closeEle) {

						clearStaticParam(); // 清空共用属性

						paperWidth = processContainer.offsetWidth - 1;
						paperHeight = processContainer.offsetHeight - 7;
						// alert("offsetWidth: "
						// +processContainer.offsetWidth+"offsetHeight: " +
						// processContainer.offsetHeight );
						paper = Raphael(processContainer, paperWidth,
								paperHeight); // 创建出画图的paper
						container = processContainer;

						/* 构造外面页面dom结构 */
						var parent = processContainer.parentNode;
						parent.removeChild(processContainer);

						var mainDiv = document.createElement("div");
						mainDiv.id = "mainDiv"
						var processDiv = document.createElement("div");
						processDiv.id = "processForm";
						//processDiv.className = 'form';
						var nodeDiv = document.createElement("div");
						nodeDiv.id = "nodeForm";
						//nodeDiv.className = 'form';
						var lineDiv = document.createElement("div");
						lineDiv.id = "lineForm";
						//nodeDiv.className = 'form';
						mainDiv.appendChild(processContainer);
						mainDiv.appendChild(processDiv);
						mainDiv.appendChild(nodeDiv);
						mainDiv.appendChild(lineDiv);
						parent.appendChild(mainDiv);

						window.onresize = function() { // 注册window大小监听事件
							// 窗口大小改变时paper大小改变
							var curWidth = processContainer.offsetWidth - 1;
							var curHeight = processContainer.offsetHeight - 7;
							if (paperWidth == curWidth
									&& paperHeight == curHeight) { // 没有变化
								return;
							} else {
								if (paperWidth == curWidth) { // width没变
									// 即是height变了
									paperHeight = curHeight;
									paper.setSize(paperWidth, paperHeight);
								} else {
									if (paperHeight == curHeight) { // width变了
										// height没变
										paperWidth = curWidth;
										paper.setSize(paperWidth, paperHeight);
									} else { // 两个都变了
										paperWidth = curWidth;
										paperHeight = curHeight;
										paper.setSize(paperWidth, paperHeight);
									}
								}
							}
						};

						createToolBar(); // 工具栏
						createBackground(); // 透明背景加事件
						// createRenameDiv();
						// createTable(processContainer);
						setTimeout(function() {/* upbtn(); */
							rightbtn();
						}, 100);// 右方列表按钮

						// var a =
						// paper.text(100,100,"哈哈哈").attr({width:"100px",height:"100px","font-size":"20px"});

						/* 业务相关 */
						if (newtecYeWu) {
							initForm(); // 创建下方表单
							processProp = new ProcessProp();// 流程属性
							formFieldEve(); // 给表单项加事件
						}
					}
					/* 创建流程设计器并读取流程 */
					processDesigner.loadProcess = function(processContainer,
							processId) {
						processDesigner.create(processContainer);
						load(processId);
					}
					/* 关闭流程设计器 */
					var closeProcessDesigner = function() {
						var a = document.getElementById("mainDiv")
						a.style.display = "none";
					};

					/* 设置设计器关闭时该执行的操作 由外部操作 */
					processDesigner.setCloseDesignerFun = function(closefun) {
						if (typeof closefun == "function") {
							closeProcessDesigner = closefun;
						} else {
							throw "is not a function";
						}
					}
					// 设计上的不够面向对象 导致每次进来要初始化共有变量0.0 惭愧惭愧
					function clearStaticParam() {
						defaultOn = true; // 默认选择状态
						curlineOn = false; // 曲线按钮激活状态
						polylineOn = false; // 折线按钮激活状态
						straightlineOn = false; // 直线按钮激活状态
						nodes = []; // 所有节点
						lines = []; // 所有的线
						remarks = [];// 区域备注
						undoStack = []; // 回退栈 每做一次操作 往回退栈中添加操作对象（包含当前操作及其反操作）
						// 并清空重做栈 点解回退按钮时 把栈顶元素弹出执行操作并把操作压入重做栈
						redoStack = []; // 重做栈 每次重做就把操作从重做栈中弹出并执行
						choosingObjs = []; // 正在选中的节点和 线 （实际线）
						nodeNameCount = 1; // 节点名称计数器
						defaultNodeFlag = 0;// 默认节点标记

					}

					/**
					 * 右侧明细表单
					 */

					function rightbtn() {
						var rightbtn = paper.image(rightbtnBSrc,
								getPaperWidth() - 56, getPaperHeight() / 2, 48,
								32);
						rightbtn.attr("title", "显示表格");
						rightbtn.mousemove(function() {
							rightbtn.attr("src", rightbtnRSrc);
						});
						rightbtn.mouseout(function() {
							rightbtn.attr("src", rightbtnBSrc);
						});
						rightbtn.click(function() {
							curShowFormEle = Newtec.ProcessNode.getCurFormEle();
							dataTable = curShowFormEle ? curShowFormEle
									: document.getElementById("processForm");
							console.log("dataTable Id :" + dataTable.id);
							console.log("dataTable width :"
									+ dataTable.style.width);
							if (dataTable.style.width != "0%") { // 正在显示 要隐藏
								dataTable.style.width = "0%";
								dataTable.style.display = "none";
								//nodeFormEle.style.display ="none";
								container.style.width = "100%";
								rightbtn.attr("x", getPaperWidth() - 56); // 重设下按钮位置
								rightbtn.attr("src", rightbtnBSrc);
								rightbtn.unmousemove();
								rightbtn.unmouseout();
								rightbtn.mouseover(function() {
									rightbtn.attr("src", rightbtnRSrc);
								});
								rightbtn.mouseout(function() {
									rightbtn.attr("src", rightbtnBSrc);
								});
							} else { // 隐藏中
								dataTable.style.display = "block";
								// dataTable.style.float="left";
								//container.style.height = "100%";
								//dataTable.style.height = "100%";
								dataTable.style.height = container.style.height;
								container.style.width = "70%";
								dataTable.style.width = "30%";
								dataTable.style.right ="0";
								//dataTable.style.overflow = "auto";
								rightbtn.attr("x", getPaperWidth() - 56);
								rightbtn.attr("src", leftbtnBSrc);
								rightbtn.unmousemove();
								rightbtn.unmouseout();
								rightbtn.mousemove(function() {
									rightbtn.attr("src", leftbtnRSrc);
								});
								rightbtn.mouseout(function() {
									rightbtn.attr("src", leftbtnBSrc);
								});
							}
						});

						container.onscroll = function() {
							var a = container.scrollTop + getPaperHeight();
							// console.log("a ="+(a-28)/2);
							rightbtn.attr("y", (a - 28) / 2);
						};
					}
					/* 添加操作,参数是两个function对象表示正反操作 */
					function addOpera(undo, redo) {
						redoStack = Newtec.ProcessNode.getRedoStack();
						undoStack = Newtec.ProcessNode.getUndoStack();
						undoStack.push({
							undo : undo,
							redo : redo
						});
						redoStack.splice(0);// 每次添加操作清空重做栈
						Newtec.ProcessNode.setRedoStack(redoStack);
						Newtec.ProcessNode.setUndoStack(undoStack);
					}
					function undo() {
						redoStack = Newtec.ProcessNode.getRedoStack();
						undoStack = Newtec.ProcessNode.getUndoStack();
						var opera = undoStack.pop();
						if (opera) {
							opera.undo(); // 执行undo
							redoStack.push(opera);
						}
						Newtec.ProcessNode.setRedoStack(redoStack);
						Newtec.ProcessNode.setUndoStack(undoStack);
					}
					function redo() {
						edoStack = Newtec.ProcessNode.getRedoStack();
						undoStack = Newtec.ProcessNode.getUndoStack();
						var opera = redoStack.pop();
						if (opera) {
							opera.redo();
							undoStack.push(opera);
						}
						Newtec.ProcessNode.setRedoStack(redoStack);
						Newtec.ProcessNode.setUndoStack(undoStack);
					}

					/* 关闭其它图标的功能 */
					var closeAllStatus = function() {
						if (defaultOn) {
							defaultOn = false;
							Newtec.ProcessNode.setDefaultOn(defaultOn);
						}
						if (curlineOn) {
							lineClose(curlineIcon.line, curlineIcon.bg,
									curlineIcon.over, curlineIcon.out,
									curlineIcon.type);
						}
						if (polylineOn) {
							lineClose(polylineIcon.line, polylineIcon.bg,
									polylineIcon.over, polylineIcon.out,
									polylineIcon.type);
						}
						if (straightlineOn) {
							lineClose(straightlineIcon.line,
									straightlineIcon.bg, straightlineIcon.over,
									straightlineIcon.out, straightlineIcon.type);
						}
					}

					/* 打开及关闭曲线折线直线开关 type为线的类型 */
					function lineOpen(line, bg, type) {
						closeAllStatus(); // 关闭所有图标功能
						line.unmouseover();
						bg.unmouseover();
						bg.unmouseout(); // 取消原有移进移出事件

						bg.attr({
							"fill-opacity" : 0
						});
						line.attr({
							stroke : "red"
						});
						type == "curve" ? curlineOn = true
								: type == "poly" ? polylineOn = true
										: straightlineOn = true;
						Newtec.ProcessNode.setLineBtnOn(type);
					}
					function lineClose(line, bg, over, out, type) {
						line.mouseover(over);
						bg.mouseover(over);
						bg.mouseout(out);
						line.attr({
							"stroke" : "#000"
						});
						type == "curve" ? curlineOn = false
								: type == "poly" ? polylineOn = false
										: straightlineOn = false;
						Newtec.ProcessNode.setLineBtnOff(type);
					}
					function getPaperWidth() {
						return container.offsetWidth - 1;
					}
					function getPaperHeight() {
						return container.offsetHeight - 7;
					}

					/* 创建表格 */
					function createTable(container) {

						var id = document.createElement("input");
						id.title = "流程ID";
					}

					/* paper在浏览器中的位置 */
					function getPaperLeft() {
						return container.offsetLeft;
					}
					function getPaperTop() {
						return container.offsetTop;
					}
					/* 创建透明背景长方形，方便点击空白处添加事件 */
					function createBackground() {
						// background =
						// paper.rect(toolBarWidth,toolBarWidth,paperWidth-toolBarWidth,paperHeight-toolBarWidth).attr({"stroke-width":0,fill:"#AEAEAE","fill-opacity":0.1});//画一个背景
						// 方便实现点击空白地方触发事件
						// container.scrollWidth
						background = paper.rect(0, 0, 2000, 2000).attr({
							"stroke-width" : 0,
							fill : "#FFFFFF",
							//"fill-opacity" : 0
						});// 画一个背景 方便实现点击空白地方触发事件
						background.toBack();
						// var click = function(){
						// dechooseAll(); //把其它都否选
						//
						// };
						// background.click(click);
						/* 实现框选 */
						background
								.mousedown(function(e, ox, oy) {

									var tempRect = paper.rect(0, 0).attr({
										"stroke-width" : 0.5
									});
									dechooseAll(); // 把其它都否选
									//background.toFront(); // 开始拖动时提到最前
									var move = function(e1, x, y) {
										// background.unclick(click);
										// //取消click事件

										// var left =
										// Math.min(e1.offsetX,ox)-getPaperLeft()+4;
										// var top =
										// Math.min(e1.offsetY,oy)-getPaperTop()+4;
										var left = Math.min(e1.offsetX,
												e.offsetX) + 4;
										var top = Math.min(e1.offsetY,
												e.offsetY) + 4;
										var width = Math.abs(e1.offsetX
												- e.offsetX - 8);
										var height = Math.abs(e1.offsetY
												- e.offsetY - 8);
										tempRect.attr({
											x : left,
											y : top,
											width : width,
											height : height
										});
									}
									background.mousemove(move);

									var up = function(e, x, y) {
										var left = tempRect.attr("x");
										var top = tempRect.attr("y");
										var width = tempRect.attr("width");
										var height = tempRect.attr("height");
										for ( var i = 0; i < nodes.length; i++) {
											var node = nodes[i].getShape();
											if (node.type == "rect") {
												if (node.attr("x") > left
														&& node.attr("y") > top
														&& node.attr("x")
																+ node
																		.attr("width") < left
																+ width
														&& node.attr("y")
																+ node
																		.attr("height") < top
																+ height) {
													node.mutichoose();
												}
											} else {
												var cx = node.attr("cx");
												var cy = node.attr("cy");
												var r = node.attr("r");
												if (cx - r > left
														&& cy - r > top
														&& cx + r < left
																+ width
														&& cy + r < top
																+ height) {
													node.mutichoose();
												}
											}
										}
										tempRect.remove();
										background.unmousemove(move);
										background.unmouseup(up);
										background.toBack();
										if (newtecYeWu) {
											showProcessForm(); // 显示表格
										}
										// window.setTimeout(function(){background.click(click);},100);//延迟回复click事件
									}
									background.mouseup(up);

								});
					}
					/* 创建工具栏及工具 */
					function createToolBar() {
						/* 参数 */
						/* 创建边线 */
						// var pathString = "M"+toolBarWidth+"
						// "+paperHeight+"V"+toolBarWidth+" H"+paperWidth;
						// var line = paper.path(pathString);
						// line.attr({stroke:"black","stroke-width":"0.5"});
						var x = 0;
						var y = 0;
						var toolbarV = paper.rect(x, y, toolBarWidth,
								paperHeight);
						toolbarV.attr({
							stroke : toolbarColor,
							fill : toolbarColor,
							"stroke-width":0
						});
						var toolbarH = paper.rect(x, y, paperWidth,
								toolBarWidth - 10);
						toolbarH.attr({
							stroke : toolbarColor,
							fill : toolbarColor,
							"stroke-width":0
						});
//						paper.rect(x,y,160,toolBarWidth-10).attr({
//							fill : toolbarColor,
//							stroke : "#FFFFFF",
//							"stroke-width" :1
//							});
//						paper.image(titleIconSrc,x+5,y+5,toolBarWidth-20,toolBarWidth-20);
//						paper.text(toolBarWidth+23,y+13,"测试节点3").attr({
//							"font-family":"SimHei",
//							"font-size":"14",
//							"font-weight":"bold"
//							});
						/* 创建节点工具 */
						nodeIcon = drawNodeTool(); // 创建节点图标
						drawStartPoint(); // 创建开始点图标
						drawEndPoint(); // 创建结束点图标
						curlineIcon = lineTool("curve"); // 曲线图标
						polylineIcon = lineTool("poly"); // 折线图标
						straightlineIcon = lineTool("straight"); // 直线图标
						remark(); // 区域备注图标
						redoBtn(); // 重做按钮
						undoBtn(); // 回退按钮
						leftAlignBtn(); // 左对齐按钮
						topAlignBtn(); // 上对齐按钮
						deleteBtn(); // 删除按钮
						saveBtn(); // 新建按钮
						saveasBtn(); // 保存按钮
					}

					/* 创建节点图标 */
					function drawNodeTool() {
						//var nodeIcon = paper.rect(5, 40, 30, 30, 5); // 创建长方形
						var nodeIcon = paper.image(nodeImgSrc,5,40,26,26);
						// x,y,width,height,radius
						nodeIcon.attr({
							fill : "#FBFB98",
							stroke : "black",
							"stroke-width" : "0.5",
							title : "流程节点"
						});
						/* 添加鼠标移上去的事件 */
						nodeIcon.mouseover(function() {
							nodeIcon.attr({
								cursor : "move",
								fill : mouseOverRectColor,
								stroke : mouseOverRectBordColor
							});
						});
						nodeIcon.mouseout(function() {
							nodeIcon.attr({
								fill : "#FBFB98",
								stroke : "black"
							});
						});

						var dragStart = function(x, y) {
							closeAllStatus(); // 关闭所有图标功能
							defaultOn = true;
							Newtec.ProcessNode.setDefaultOn(defaultOn);
							this.ox = this.attr("x");
							this.oy = this.attr("y");
							// if(!this.tempShape) {//创建暂时出现的拖动块
							this.tempShape = paper.rect(this.ox, this.oy, 30,
									30, 5);
							this.tempShape.attr({
								cursor : "move",
								fill : "#FBFB98",
								stroke : "black",
								"stroke-width" : "0.5"
							});
							// }
						}
						var dragMove = function(dx, dy) {
							this.tempShape.attr({
								x : this.ox + dx,
								y : this.oy + dy
							});
						}
						var dragEnd = function() {
							var x = this.tempShape.attr("x");
							var y = this.tempShape.attr("y");
							if (x > toolBarWidth && y > toolBarWidth) {
								// 创建节点
								var proNode = Newtec.ProcessNode.create({
									'x':x,
									'y':y,
									'width':100,
									'height':38,
									'paper':paper,
									'nodeType' : 'node',
									'nodeNameCount':nodeNameCount++,
									'container':container
									});
								var node = proNode.currNode;
								nodes.push(node);
								/* 定义回退重做的要做的操作 */
								var undo = function() {
									node.getShape().hide();
									node.getShape().text.hide();
									node.getShape().img.hide();
									nodes.splice(nodes.indexOf(node), 1);
								};
								var redo = function() {
									node.getShape().show();
									node.getShape().text.show();
									node.getShape().img.show();
									nodes.push(node);
								};
								addOpera(undo, redo);
							}
							this.tempShape.remove();
							this.tempShape = undefined;
						}
						nodeIcon.drag(dragMove, dragStart, dragEnd);
						return nodeIcon;
					}
					/* 创建开始点图标 */
					function drawStartPoint() {

						var startPoint = paper.set();
						// var bg =
						// paper.rect(5,75,30,30,5).attr("title","开始点");
						var bg = paper.rect(5, 75, 30, 30).attr("title", "开始点");
						// var c1 =paper.circle(20,90,6.5);
//						var c2 = paper.circle(20, 90, 13).attr({
//							"fill" : "#FBFB98",
//							"stroke-width" : "0.5",
//							stroke : "black",
//							title : "开始点"
//						});
						var c2 = paper.image(startSrc,7,77,26,26).attr("cursor","move");
						bg.attr({
							
							"stroke-width" : 0
						});
						// c1.attr({"stroke-width":2});

						// startPoint.push(c1);
						startPoint.push(c2);
						startPoint.push(bg);

						startPoint.mousemove(function() {
							bg.attr({
								fill : mouseOverRectColor,
								"fill-opacity" : 1,
								stroke : mouseOverRectBordColor,
								"stroke-width" : 0.5
							})
							// c1.attr({stroke:"red"});
							// c2.attr({stroke:"red"});
						});
						startPoint.mouseout(function() {
							bg.attr("fill-opacity", "0");
							bg.attr("stroke-width", "0");
							// c1.attr({stroke:"#000"});
							c2.attr({
								stroke : "#000"
							});
						});

						var dragStart = function(x, y) {
							closeAllStatus(); // 关闭所有图标功能
							defaultOn = true;
							Newtec.ProcessNode.setDefaultOn(defaultOn);
							this.ox = this.attr("x")+10;
							this.oy = this.attr("y")+10;
							// if(!this.tempShape) {//创建暂时出现的拖动块
							this.tempShape = paper.circle(this.ox, this.oy, 19)
									.attr({
										cursor : "move",
										"fill" : "#FBFB98",
										"stroke-width" : "0.5",
										stroke : "black"
									});
							// }
						}
						var dragMove = function(dx, dy) {
							this.tempShape.attr({
								cx : this.ox + dx,
								cy : this.oy + dy
							});
						}
						var dragEnd = function() {
							var x = this.tempShape.attr("cx")
									- this.tempShape.attr("r");
							var y = this.tempShape.attr("cy")
									- this.tempShape.attr("r");
							//console.log(x+"=="+y+"=="+"=="+toolBarWidth)
							if (x > toolBarWidth && y > toolBarWidth) {
								// 创建节点
								//var node = new StartNode(x, y, 19);
								var proNode = Newtec.ProcessNode.create({
									'x':x,
									'y': y,
									'paper':paper,
									'r': 19,
									'nodeType' : 'start',
									'nodeNameCount':nodeNameCount++,
									'container':container
									});
								var node = proNode.currNode;
								nodes.push(node);
								/* 定义回退重做的要做的操作 */
								var undo = function() {
									node.getShape().hide();
									node.getShape().text.hide();
									node.getShape().img.hide();
									nodes.splice(nodes.indexOf(node), 1);
								};
								var redo = function() {
									node.getShape().show();
									node.getShape().text.show();
									node.getShape().img.show();
									nodes.push(node);
								};
								addOpera(undo, redo);
							}
							this.tempShape.remove();
							this.tempShape = undefined;
						}
						c2.drag(dragMove, dragStart, dragEnd);
						return c2;

					}
					/* 创建结束点图标 */
					function drawEndPoint() {
						var endPoint = paper.set();
						// var bg =
						// paper.rect(5,110,30,30,5).attr("title","结束点");
						var bg = paper.rect(5, 110, 30, 30)
								.attr("title", "结束点");
						// var line = paper.path("M12.5 135.6 L27.5 114.4")
//						var c2 = paper.circle(20, 125, 12).attr({
//							"stroke-width" : 1.5,
//							fill : "#AEAEAE",
//							"fill-opacity" : "0.1",
//							title : "结束点"
//						});
						var c2 = paper.image(endSrc,7,112,26,26).attr("cursor","move")

						bg.attr({
							"stroke-width" : 0
						});
						// line.attr({"stroke-width":2});

						// endPoint.push(line);
						endPoint.push(c2);
						endPoint.push(bg);

						endPoint.mousemove(function() {
							bg.attr({
								fill : mouseOverRectColor,
								"fill-opacity" : 1,
								stroke : mouseOverRectBordColor,
								"stroke-width" : 0.5
							})
							// line.attr({stroke:"red"});
							// c2.attr({stroke:"red"});
						});
						endPoint.mouseout(function() {
							bg.attr("fill-opacity", "0");
							bg.attr("stroke-width", "0");
							// line.attr({stroke:"#000"});
							c2.attr({
								stroke : "#000"
							});
						});

						var dragStart = function(x, y) {
							closeAllStatus(); // 关闭所有图标功能
							defaultOn = true;
							Newtec.ProcessNode.setDefaultOn(defaultOn);
							this.ox = this.attr("x");
							this.oy = this.attr("y");
							// if(!this.tempShape) {//创建暂时出现的拖动块
							this.tempShape = paper.circle(this.ox, this.oy, 19)
									.attr({
										cursor : "move",
										"stroke-width" : 0.5,
										fill : "#AEAEAE",
										"fill-opacity" : "0.1"
									});
							// }
						}
						var dragMove = function(dx, dy) {
							this.tempShape.attr({
								cx : this.ox + dx,
								cy : this.oy + dy
							});
						}
						var dragEnd = function() {
							var x = this.tempShape.attr("cx")
									- this.tempShape.attr("r");
							var y = this.tempShape.attr("cy")
									- this.tempShape.attr("r");
							if (x > toolBarWidth && y > toolBarWidth) {
								// 创建节点
								//var node = new EndNode(x, y, 19);
								var proNode = Newtec.ProcessNode.create({
									'x':x - 9.5,
									'y': y - 9.5,
									'paper':paper,
									'r': 19,
									'nodeType' : 'end',
									'container':container
									});
								var node = proNode.currNode;
								nodes.push(node);
								/* 定义回退重做的要做的操作 */
								var undo = function() {
									node.getShape().hide();
									node.getShape().text.hide();
									node.getShape().img.hide();
									nodes.splice(nodes.indexOf(node), 1);
								};
								var redo = function() {
									node.getShape().show();
									node.getShape().text.show();
									node.getShape().img.show();
									nodes.push(node);
								};
								addOpera(undo, redo);
							}
							this.tempShape.remove();
							this.tempShape = undefined;
						}
						c2.drag(dragMove, dragStart, dragEnd);
						return c2;

					}
					/* 创建线按钮图标 */
					function lineTool(type) {
						/* 背景 */
						var bg;
						/* 曲线 */
						var lineString;
						var lineTitle;
						if (type == "curve") {
							lineString = "M8 148 C20 148 20 172 32 172";
							bg = paper.rect(5, 145, 30, 30, 5);
							lineTitle = "曲线";
						} else if (type == "poly") {
							lineString = "M8 183 L20 183 L20 207 L32 207";
							bg = paper.rect(5, 180, 30, 30, 5);
							lineTitle = "折线";
						} else {
							lineString = "M8 218 L32 242";
							bg = paper.rect(5, 215, 30, 30, 5);
							lineTitle = "直线";
						}
						var line = paper.path(lineString);
						line.attr({
							"stroke-width" : 2,
							cursor : "pointer",
							title : lineTitle
						});

						bg.attr({
							"stroke-width" : 0,
							cursor : "pointer",
							title : lineTitle
						});

						var over = function() {
							bg.attr({
								fill : "#FBCA98",
								"fill-opacity" : 1
							});
							line.attr({
								stroke : "red"
							});
						}
						line.mouseover(over);
						bg.mouseover(over);
						var out = function() {
							bg.attr({
								"fill-opacity" : 0
							});
							line.attr({
								"stroke" : "#000"
							});
						}
						bg.mouseout(out);
						/* 点击开启或关闭画线 */

						var changeStatus;
						if (type == "curve") {
							changeStatus = function() {
								if (curlineOn) { // 关闭
									lineClose(line, bg, over, out, type);
									defaultOn = true; // 开启默认选择
									Newtec.ProcessNode.setDefaultOn(defaultOn);
								} else { // 开启
									lineOpen(line, bg, type);
								}
							}
						} else if (type == "poly") {
							changeStatus = function() {
								if (polylineOn) { // 关闭
									lineClose(line, bg, over, out, type);
									defaultOn = true; // 开启默认选择
									Newtec.ProcessNode.setDefaultOn(defaultOn);
								} else { // 开启
									lineOpen(line, bg, type);
								}
							}
						} else if (type == "straight") {
							changeStatus = function() {
								if (straightlineOn) { // 关闭
									lineClose(line, bg, over, out, type);
									defaultOn = true; // 开启默认选择
									Newtec.ProcessNode.setDefaultOn(defaultOn);
								} else { // 开启

									lineOpen(line, bg, type);
								}
							}
						}

						bg.click(changeStatus);
						line.click(changeStatus);

						return {
							"line" : line,
							"bg" : bg,
							"over" : over,
							"out" : out,
							"type" : type
						};
					}
					/* 创建区域备注图标 */
					function remark() {
						var remarkIcon = paper.rect(5, 250, 30, 30, 5).attr({
							"fill" : "#CCFFCC",/* "cursor":"pointer", */
							"stroke-width" : "0.5"
						});
						var dragStart = function(x, y) {
							closeAllStatus(); // 关闭所有图标功能
							defaultOn = true;
							Newtec.ProcessNode.setDefaultOn(defaultOn);
							this.ox = this.attr("x");
							this.oy = this.attr("y");
							// if(!this.tempShape) {//创建暂时出现的拖动块
							this.tempShape = paper.rect(this.ox, this.oy, 30,
									30, 5);
							this.tempShape.attr({
								fill : "#CCFFCC",
								"stroke-width" : "0.5"
							});
							// }
						}
						var dragMove = function(dx, dy) {
							this.tempShape.attr({
								x : this.ox + dx,
								y : this.oy + dy
							});
						}
						var dragEnd = function() {
							var x = this.tempShape.attr("x");
							var y = this.tempShape.attr("y");
							if (x > toolBarWidth && y > toolBarWidth) {
								// 创建节点
								var remark = new RemarkArea(x, y);
								remarks.push(remark);
								for ( var i = remarks.length - 1; i >= 0; i--) { // 从后往前遍历remark让其toBack
									// 让新出来的在最上面
									remarks[i].toBack();
								}
								/* 定义回退重做的要做的操作 */
								var undo = function() {
									remark.hide();
									remarks.splice(remarks.indexOf(remark), 1);
								};
								var redo = function() {
									remark.show();
									remarks.push(remark);
								};
								addOpera(undo, redo);
							}
							this.tempShape.remove();
							this.tempShape = undefined;
						}
						remarkIcon.drag(dragMove, dragStart, dragEnd);
						return remarkIcon;
					}

					/* 新建按钮 */
					function saveBtn() {
						var saveBtn = paper.image(saveBSrc, 40, 4, 19, 19);
						saveBtn.attr("title", "新建");
						saveBtn.mousemove(function() {
							saveBtn.attr("src", saveRSrc);
						});
						saveBtn.mouseout(function() {
							saveBtn.attr("src", saveBSrc);
						});
						saveBtn.click(save);
						return saveBtn;
					}
					/* 保存按钮 */
					function saveasBtn() {
						var saveasBtn = paper.image(saveasBSrc, 75, 4, 20, 20);
						saveasBtn.attr("title", "保存");
						saveasBtn.mousemove(function() {
							saveasBtn.attr("src", saveasRSrc);
						});
						saveasBtn.mouseout(function() {
							saveasBtn.attr("src", saveasBSrc);
						});
						saveasBtn.click(saveas);
						return saveasBtn;
					}
					/* 回退按钮 */
					function undoBtn() {
						var undoBtn = paper.image(undoBtnBSrc, 110, 4, 20, 20);
						undoBtn.attr("title", "回退");
						undoBtn.mousemove(function() {
							undoBtn.attr("src", undoBtnRSrc);
						});
						undoBtn.mouseout(function() {
							undoBtn.attr("src", undoBtnBSrc);
						});
						undoBtn.click(undo);
						return undoBtn;
					}
					/* 重做按钮 */
					function redoBtn() {
						var redoBtn = paper.image(redoBtnBSrc, 145, 4, 20, 20);
						redoBtn.attr("title", "重做");
						redoBtn.mousemove(function() {
							redoBtn.attr("src", redoBtnRSrc);
						});
						redoBtn.mouseout(function() {
							redoBtn.attr("src", redoBtnBSrc);
						});
						redoBtn.click(redo);
						return redoBtn;
					}
					/* 左对齐按钮 */
					function leftAlignBtn() {
						var leftAlignBtn = paper.image(leftAlignBSrc, 180, 4,
								20, 20);
						leftAlignBtn.attr("title", "左对齐");
						leftAlignBtn.mousemove(function() {
							leftAlignBtn.attr("src", leftAlignRSrc);
						});
						leftAlignBtn.mouseout(function() {
							leftAlignBtn.attr("src", leftAlignBSrc);
						});
						leftAlignBtn.click(leftAlign);
						return leftAlignBtn;
					}
					/* 左对齐 */
					function leftAlign() {
						var curObjs = []; // 存放当时操作的选中对象
						for ( var i = 0; i < choosingObjs.length; i++) {
							var objcx = choosingObjs[i].type == "rect" ? choosingObjs[i]
									.attr("x")
									+ choosingObjs[i].attr("width") / 2
									: choosingObjs[i].attr("cx");
							curObjs[i] = {
								obj : choosingObjs[i],
								x : objcx
							};
						}

						var left = 10000;
						for ( var i = 0; i < choosingObjs.length; i++) {
							var objcx = choosingObjs[i].type == "rect" ? choosingObjs[i]
									.attr("x")
									+ choosingObjs[i].attr("width") / 2
									: choosingObjs[i].attr("cx");
							if (objcx < left) {
								left = objcx;
							}
						}
						for ( var i = 0; i < choosingObjs.length; i++) {
							var objcy = choosingObjs[i].type == "rect" ? choosingObjs[i]
									.attr("y")
									+ choosingObjs[i].attr("height") / 2
									: choosingObjs[i].attr("cy");
							choosingObjs[i].moveTo(left, objcy);
						}

						var undo = function() {
							for ( var i = 0; i < curObjs.length; i++) {
								var objcy = curObjs[i].obj.type == "rect" ? curObjs[i].obj
										.attr("y")
										+ curObjs[i].obj.attr("height") / 2
										: curObjs[i].obj.attr("cy");
								curObjs[i].obj.moveTo(curObjs[i].x, objcy);
							}
						};
						var redo = function() {
							for ( var i = 0; i < curObjs.length; i++) {
								var objcy = curObjs[i].obj.type == "rect" ? curObjs[i].obj
										.attr("y")
										+ curObjs[i].obj.attr("height") / 2
										: curObjs[i].obj.attr("cy");
								curObjs[i].obj.moveTo(left, objcy);
							}
						};
						addOpera(undo, redo);
					}
					/* 上对齐按钮 */
					function topAlignBtn() {
						var topAlignBtn = paper.image(topAlignBSrc, 215, 4, 20,
								20);
						topAlignBtn.attr("title", "上对齐");
						topAlignBtn.mousemove(function() {
							topAlignBtn.attr("src", topAlignRSrc);
						});
						topAlignBtn.mouseout(function() {
							topAlignBtn.attr("src", topAlignBSrc);
						});
						topAlignBtn.click(topAlign);
						return topAlignBtn;
					}
					/* 上对齐 */
					function topAlign() {
						var curObjs = []; // 存放当时操作的选中对象
						for ( var i = 0; i < choosingObjs.length; i++) {
							var objcy = choosingObjs[i].type == "rect" ? choosingObjs[i]
									.attr("y")
									+ choosingObjs[i].attr("height") / 2
									: choosingObjs[i].attr("cy");
							curObjs[i] = {
								obj : choosingObjs[i],
								y : objcy
							};
						}

						var top = 10000;
						for ( var i = 0; i < choosingObjs.length; i++) {
							var objcy = choosingObjs[i].type == "rect" ? choosingObjs[i]
									.attr("y")
									+ choosingObjs[i].attr("height") / 2
									: choosingObjs[i].attr("cy");
							if (objcy < top) {
								top = objcy;
							}
						}
						for ( var i = 0; i < choosingObjs.length; i++) {
							var objcx = choosingObjs[i].type == "rect" ? choosingObjs[i]
									.attr("x")
									+ choosingObjs[i].attr("width") / 2
									: choosingObjs[i].attr("cx");
							choosingObjs[i].moveTo(objcx, top);
						}

						var undo = function() {
							for ( var i = 0; i < curObjs.length; i++) {
								var objcx = curObjs[i].obj.type == "rect" ? curObjs[i].obj
										.attr("x")
										+ curObjs[i].obj.attr("width") / 2
										: curObjs[i].obj.attr("cx");
								curObjs[i].obj.moveTo(objcx, curObjs[i].y);
							}
						};
						var redo = function() {
							for ( var i = 0; i < curObjs.length; i++) {
								var objcx = curObjs[i].obj.type == "rect" ? curObjs[i].obj
										.attr("x")
										+ curObjs[i].obj.attr("width") / 2
										: curObjs[i].obj.attr("cx");
								curObjs[i].obj.moveTo(objcx, top);
							}
						};
						addOpera(undo, redo);
					}
					/* 删除按钮 */
					function deleteBtn() {
						var deleteBtn = paper.image(deleteBSrc, 250, 4, 20, 20);
						deleteBtn.attr("title", "删除选中项");
						deleteBtn.mousemove(function() {
							deleteBtn.attr("src", deleteRSrc);
						});
						deleteBtn.mouseout(function() {
							deleteBtn.attr("src", deleteBSrc);
						});
						deleteBtn
								.click(function() { // 框选时 只会选到节点和线其中一样 不会混选的
									// 不用考虑 删除自身方法里面关系的互相影响
									var curObjs = [];
									for ( var i = 0; i < choosingObjs.length; i++) {
										curObjs[i] = choosingObjs[i];
										choosingObjs[i].deleteSelf(false);
									}

									var undo = function() {
										for ( var i = 0; i < curObjs.length; i++) {
											if (curObjs[i].type == "path") { // 是线
												curObjs[i].show();
												curObjs[i].visible = true;
												curObjs[i].lineObj.from.toline
														.push(curObjs[i].lineObj);
												curObjs[i].lineObj.to.fromline
														.push(curObjs[i].lineObj);
											} else {// 是节点
												var shape = curObjs[i];
												shape.visible = true;
												shape.show()
												shape.text.show();
												nodes.push(shape.procNode);
												for ( var j = 0; j < shape.fromline.length; j++) {
													shape.fromline[j].line
															.show();
													shape.fromline[j].line.visible = true;
												}
												for ( var j = 0; j < shape.toline.length; j++) {
													shape.toline[j].line.show();
													shape.toline[j].line.visible = true;
												}
											}
										}
									};
									var redo = function() {
										for ( var i = 0; i < curObjs.length; i++) {
											if (curObjs[i].type == "path") { // 是线
												curObjs[i].hide();
												curObjs[i].visible = false;
												curObjs[i].lineObj.from.toline
														.splice(
																curObjs[i].lineObj.from.toline
																		.indexOf(curObjs[i]),
																1);
												curObjs[i].lineObj.to.fromline
														.splice(
																curObjs[i].lineObj.to.fromline
																		.indexOf(curObjs[i]),
																1);
											} else {// 是节点
												var shape = curObjs[i];
												shape.visible = false;
												shape.hide();
												shape.text.hide();
												shape.quickToolBar.hide();
												nodes
														.splice(
																nodes
																		.indexOf(shape.procNode),
																1);
												for ( var j = 0; j < shape.fromline.length; j++) {
													shape.fromline[j].line
															.hide();
													shape.fromline[j].line.visible = false;
												}
												for ( var j = 0; j < shape.toline.length; j++) {
													shape.toline[j].line.hide();
													shape.toline[j].line.visible = false;
												}
											}
										}
									};
									addOpera(undo, redo);
								});
						return deleteBtn;
					}
					/* 快速删除按钮 */
					function quickDeleteBut(node) {}
					/* 快速创建按钮 */
					function quickCreateBut(node) {}

					/* 快速直线按钮 */
					function quickStraightBut(node) {}
					/* 快速折线按钮 */
					function quickPolylineBut(node) {}
					/* 快速曲线按钮 */
					function quickCurveBut(node) {}
					var hideTimerOfRect; // 计时器 弄成全局方便取消
					
					// 根据移动的节点重设线的位置
					function resetLine(node) {}
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
							}
							realLine.dechoose = function() {
								this.ischoose = false;
								this.attr({
									stroke : "black",
									"stroke-dasharray" : ""
								});
								choosingObjs.splice(choosingObjs.indexOf(this),
										1);
							}
							realLine.click(function() {
								if (realLine.ischoose) {
									this.dechoose();
								} else {
									this.choose();
								}
								if (newtecYeWu) {
									showLineForm(lineObj.procLine);
								}
							})
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
							}
							return lineObj;
						}

						this.getLine = function() {
							return line;
						}

						var line = this.createLine();
					}
					/* 区域备注 */
					var RemarkArea = function(x, y) {
						var self = this;
						var titHei = 25; // 标题宽度
						var areaWid = 400 // area长度;
						var areaHei = 300 // area宽度;
						var minWidth = 180;
						var minHeight = 90;
						var text = this.text = paper.text(x + 10,
								y - titHei + 10, "区域备注").attr({
							"cursor" : "pointer",
							"text-anchor" : "start",
							"font-family" : "微软雅黑",
							"font-weight" : "bold",
							"font-size" : "10"
						});
						var titleRect = this.titleRect = paper.rect(x,
								y - titHei, areaWid, titHei).attr({
							"fill" : "#CCFFCC",
							"cursor" : "crosshair",
							"stroke-width" : "0.2"
						});
						var remarkArea = this.remarkArea = paper.rect(x, y,
								areaWid, areaHei).attr({
							"fill" : "#CCFFCC",
							"cursor" : "crosshair",
							"stroke-width" : "0.2"
						});
						var deleteBtn = paper.image(crossDeleteSrc,
								x + areaWid - 18, y - 23, 16, 16).attr(
								"cursor", "pointer");
						var ctrlPoint = paper.rect(x + areaWid - 3,
								y + areaHei - 3, 6, 6).attr({
							"fill" : "red",
							"cursor" : "se-resize",
							"stroke-width" : "0",
							"fill-opacity" : "0"
						}); // 右下方控制点
						var bottomLine = paper.rect(x - 3, y + areaHei - 3,
								areaWid, 6).attr({
							"fill" : "red",
							"cursor" : "s-resize",
							"stroke-width" : "0",
							"fill-opacity" : "0"
						});
						; // 下方拖动线
						var rightLine = paper.rect(x + areaWid - 3, y - 3, 6,
								areaHei).attr({
							"fill" : "red",
							"cursor" : "e-resize",
							"stroke-width" : "0",
							"fill-opacity" : "0"
						});
						; // 右方拖动线
						var dragStart = function(x, y) {
							this.ox = remarkArea.attr("x");
							this.oy = remarkArea.attr("y");
						}
						var dragMove = function(dx, dy, x, y) {
							remarkArea.attr({
								"x" : this.ox + dx,
								"y" : this.oy + dy
							});
							titleRect.attr({
								"x" : this.ox + dx,
								"y" : this.oy + dy - titHei
							});
							text.attr({
								"x" : this.ox + dx + 10,
								"y" : this.oy + dy - titHei + 10
							});
							deleteBtn.attr({
								"x" : this.ox + dx + areaWid - 18,
								"y" : this.oy + dy - 23
							});
							ctrlPoint.attr({
								"x" : this.ox + dx + areaWid - 3,
								"y" : this.oy + dy + areaHei - 3
							});
							bottomLine.attr({
								"x" : this.ox + dx - 3,
								"y" : this.oy + dy + areaHei - 3
							});
							rightLine.attr({
								"x" : this.ox + dx + areaWid - 3,
								"y" : this.oy + dy - 3
							});
						}
						var dragEnd = function() {
							var ox = this.ox;
							var oy = this.oy;
							var finalX = remarkArea.attr("x");
							var finalY = remarkArea.attr("y");
							var undo = function() {
								remarkArea.attr({
									"x" : ox,
									"y" : oy
								});
								titleRect.attr({
									"x" : ox,
									"y" : oy - titHei
								});
								text.attr({
									"x" : ox + 10,
									"y" : oy - titHei + 10
								});
								deleteBtn.attr({
									"x" : ox + areaWid - 18,
									"y" : oy - 23
								});
								ctrlPoint.attr({
									"x" : ox + areaWid - 3,
									"y" : oy + areaHei - 3
								});
								bottomLine.attr({
									"x" : ox - 3,
									"y" : oy + areaHei - 3
								});
								rightLine.attr({
									"x" : ox + areaWid - 3,
									"y" : oy - 3
								});
							};
							var redo = function() {
								remarkArea.attr({
									"x" : finalX,
									"y" : finalY
								});
								titleRect.attr({
									"x" : finalX,
									"y" : finalY - titHei
								});
								text.attr({
									"x" : finalX + 10,
									"y" : finalY - titHei + 10
								});
								deleteBtn.attr({
									"x" : finalX + areaWid - 18,
									"y" : finalY - 23
								});
								ctrlPoint.attr({
									"x" : finalX + areaWid - 3,
									"y" : finalY + areaHei - 3
								});
								bottomLine.attr({
									"x" : finalX - 3,
									"y" : finalY + areaHei - 3
								});
								rightLine.attr({
									"x" : finalX + areaWid - 3,
									"y" : finalY - 3
								});
							};
							addOpera(undo, redo);
						}
						text.drag(dragMove, dragStart, dragEnd);
						titleRect.drag(dragMove, dragStart, dragEnd);
						remarkArea.drag(dragMove, dragStart, dragEnd);
						var renameEve = function(e, x, y) {
							text.hide();
							var input = document.createElement("input");
							input.type = "text";
							input.value = text.attr("text");
							input.className = "tempInput";
							input.style.left = titleRect.attr("x") + "px";
							input.style.top = titleRect.attr("y") + "px";
							input.style.width = titleRect.attr("width") * 0.6
									+ "px";
							input.style.height = titleRect.attr("height")
									+ "px";
							input.style.position = "absolute";
							input.maxLength = 12;
							container.appendChild(input);
							input.focus();
							input.select();
							input.onblur = function() {
								input.style.display = "none";
								text.attr("text", input.value);
								text.show();
							}
							background.toFront(); // 为了让点到背景
							// 顺利触发onblur事件（点到svg元素是不触发onblur的，而我不知到为什么这个background就能触发。。也是rect）
						}
						text.dblclick(renameEve);
						titleRect.dblclick(renameEve);
						/* 被点击的备注在备注之中最前 */
						var remarkup = function() {
							remarks.splice(remarks.indexOf(self), 1);
							remarks.push(self);
							for ( var i = remarks.length - 1; i >= 0; i--) {
								remarks[i].toBack();
							}
						}
						titleRect.click(remarkup);
						remarkArea.click(remarkup);
						text.click(remarkup);

						/* 右下方控制点拖动事件 调整大小 */
						ctrlPoint.drag(function(dx, dy, x, y) { // dragMove
							self.resizeTo(this.owidth + dx, this.oheight + dy);

						}, function() { // dragStart
							this.ox = this.attr("x"); // 控制点的x
							this.oy = this.attr("y");
							this.owidth = remarkArea.attr("width");
							this.oheight = remarkArea.attr("height");
						}, function() {// dragEnd
							var fx = this.attr("x");
							var fy = this.attr("y");
							var fwidth = remarkArea.attr("width");
							var fheight = remarkArea.attr("height");
							var ox = this.ox;// 控制点的x
							var oy = this.oy;
							var owidth = this.owidth;
							var oheight = this.oheight;

							var undo = function() {
								titleRect.attr({
									"width" : owidth
								});
								remarkArea.attr({
									"width" : owidth,
									"height" : oheight
								});
								ctrlPoint.attr({
									"x" : ox,
									"y" : oy
								});
								rightLine.attr({
									"x" : ox,
									"height" : oheight
								});
								bottomLine.attr({
									"width" : owidth,
									"y" : oy
								});
								areaWid = owidth; // area长度;
								areaHei = oheight; // area宽度;
								deleteBtn.attr({
									"x" : remarkArea.attr("x")
											+ remarkArea.attr("width") - 18,
									"y" : remarkArea.attr("y") - 23
								});
							};
							var redo = function() {
								titleRect.attr({
									"width" : fwidth
								});
								remarkArea.attr({
									"width" : fwidth,
									"height" : fheight
								});
								ctrlPoint.attr({
									"x" : fx,
									"y" : fy
								});
								rightLine.attr({
									"x" : fx,
									"height" : fheight
								});
								bottomLine.attr({
									"width" : fwidth,
									"y" : fy
								});
								areaWid = fwidth; // area长度;
								areaHei = fheight; // area宽度;
								deleteBtn.attr({
									"x" : remarkArea.attr("x")
											+ remarkArea.attr("width") - 18,
									"y" : remarkArea.attr("y") - 23
								});
							};
							addOpera(undo, redo);
						})

						/* 下方控制线拖动事件 调整大小 只能调整宽度 */
						bottomLine.drag(function(dx, dy, x, y) { // dragMove
							self.resizeTo(this.owidth, this.oheight + dy);
						}, function() { // dragStart
							this.oy = this.attr("y");
							this.owidth = remarkArea.attr("width");
							this.oheight = remarkArea.attr("height");
						}, function() {// dragEnd
							var fy = this.attr("y");
							var fheight = remarkArea.attr("height");
							var oy = this.oy;
							var oheight = this.oheight;

							var undo = function() {
								remarkArea.attr({
									"height" : oheight
								});
								ctrlPoint.attr({
									"y" : oy
								});
								rightLine.attr({
									"height" : oheight
								});
								bottomLine.attr({
									"y" : oy
								});
								areaHei = oheight; // area宽度;
								deleteBtn.attr({
									"y" : remarkArea.attr("y") - 23
								});
							};
							var redo = function() {
								remarkArea.attr({
									"height" : fheight
								});
								ctrlPoint.attr({
									"y" : fy
								});
								rightLine.attr({
									"height" : fheight
								});
								bottomLine.attr({
									"y" : fy
								});
								areaHei = fheight; // area宽度;
								deleteBtn.attr({
									"y" : remarkArea.attr("y") - 23
								});
							};
							addOpera(undo, redo);
						})

						/* 右方控制线拖动事件 调整大小 只能调整长度 */
						rightLine.drag(function(dx, dy, x, y) { // dragMove
							self.resizeTo(this.owidth + dx, this.oheight);
						}, function() { // dragStart
							this.ox = this.attr("x");
							this.owidth = remarkArea.attr("width");
							this.oheight = remarkArea.attr("height");
						}, function() {// dragEnd
							var fx = this.attr("x");
							var fwidth = remarkArea.attr("width");
							var ox = this.ox;// 控制点的x
							var owidth = this.owidth;

							var undo = function() {
								titleRect.attr({
									"width" : owidth
								});
								remarkArea.attr({
									"width" : owidth
								});
								ctrlPoint.attr({
									"x" : ox
								});
								rightLine.attr({
									"x" : ox
								});
								bottomLine.attr({
									"width" : owidth
								});
								areaWid = owidth; // area长度;
								deleteBtn.attr({
									"x" : remarkArea.attr("x")
											+ remarkArea.attr("width") - 18
								});
							};
							var redo = function() {
								titleRect.attr({
									"width" : fwidth
								});
								remarkArea.attr({
									"width" : fwidth
								});
								ctrlPoint.attr({
									"x" : fx
								});
								rightLine.attr({
									"x" : fx
								});
								bottomLine.attr({
									"width" : fwidth
								});
								areaWid = fwidth; // area长度;
								deleteBtn.attr({
									"x" : remarkArea.attr("x")
											+ remarkArea.attr("width") - 18
								});
							};
							addOpera(undo, redo);
						})
						this.toBack = function() {
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
						this.hide = function() {
							text.hide();
							titleRect.hide();
							remarkArea.hide();
							deleteBtn.hide();
							ctrlPoint.hide();
							bottomLine.hide();
							rightLine.hide();
						}
						this.show = function() {
							text.show();
							titleRect.show();
							remarkArea.show();
							deleteBtn.show();
							ctrlPoint.show();
							bottomLine.show();
							rightLine.show();
						}
						this.resizeTo = function(width, height) {
							var ox = remarkArea.attr("x");
							var oy = remarkArea.attr("y");
							var owid = remarkArea.attr("width");
							var ohei = remarkArea.attr("height");
							var ocx = ox + owid - 3;
							var ocy = oy + ohei - 3;
							var ctrlX = ox + width - 3; // 控制点x
							var ctrlY = oy + height - 3; // 控制点y

							if (width > minWidth) {
								titleRect.attr({
									"width" : width
								});
								remarkArea.attr({
									"width" : width
								});
								areaWid = width; // area长度;
								ctrlPoint.attr({
									"x" : ctrlX
								});
								rightLine.attr({
									"x" : ctrlX
								});
								bottomLine.attr({
									"width" : width
								});
							}

							if (height > minHeight) {
								remarkArea.attr({
									"height" : height
								});
								areaHei = height; // area宽度;
								ctrlPoint.attr({
									"y" : ctrlY
								});
								bottomLine.attr({
									"y" : ctrlY
								});
								rightLine.attr({
									"height" : height
								});
							}
							deleteBtn.attr({
								"x" : remarkArea.attr("x")
										+ remarkArea.attr("width") - 18,
								"y" : remarkArea.attr("y") - 23
							});
						}
						deleteBtn.click(function() {
							self.hide();
							addOpera(function() {
								self.show();
							}, function() {
								self.hide();
							});
						})
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
						var bb1 = obj1.getBBox(), bb2 = obj2.flag == undefined ? obj2
								.getBBox()
								: {
									x : obj2.x,
									y : obj2.y,
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

					function resetTextPos(node) {}
					// 拖动结束时 节点自动对齐
					function autoAdjust(node) {}
					/*-----------------------------------------------业务相关的------------------------------------------------*/

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
					/* 创建三个表单 */
					function initForm() { // 业务
						var processFields = [
						   {name:'id',title:'主键',hidden:true},
						   {title:'分组1',name:'g1',type:'line',itemDivStyle:'background:#ddd;'},
						   {name:'key',title:'流程定义'},
						   {name:'name',title:'流程名称'},
						   {name:'version',title:'版本',hidden:true},
						   {name:'status',title:'流程状态'},
						   {name:'createTime',title:'创建时间'},
						   {name:'updateTime',title:'更新时间'},
						   {name:'createPersonId',title:'创建人员Id',hidden:true},
						   {name:'createPersonName',title:'创建人员'},
						   {name:'createDepartmentId',title:'创建部门Id',hidden:true},
						   {name:'createDepartmentName',title:'创建部门'},
						   {title:'分组2',name:'g2',type:'line',itemDivStyle:'background:#ddd;'},
						   {name:'description',title:'流程描述'},
						   {name:'finshProcessBefore',title:'流程开始节点前脚本'},
						   {name:'finshProcessAfter',title:'流程开始节点前脚本'},
						   {name:'startProcessBefore',title:'流程开始节点前脚本'},
						   {name:'startProcessAfter',title:'流程开始节点前脚本'},
						   {name:'imports',title:'导入包'},
						   {name:'bussClass',title:'业务导入包'}
						                     ];
						processForm = Newtec.Form.create({
							appendTo : '#processForm',
							//ds : Newtec.DS.get('bPMProcess'),
							//autoFetch : true,
							titleColumn : "2",
							columnNum : "1",
							itemParams:{ titleWRate:50,autoTitle:false,titleAlign:'left',inputStyle:'padding:2px;height:25px;',itemDivStyle:"padding:0;margin:0;",titleStyle:'padding:2px'},
							//titleWRate :'20',
							fields : processFields,
							formType : 'table'
						});
						var nodeFields = [
						                  {title:'分组1',name:'g1',type:'line',itemDivStyle:'background:#ddd;'},
										  {name:'id',title:'主键',hidden:true},
										  //{title:'分组1',name:'g1',type:'line',itemDivStyle:'background:#ddd;'},
										  {name:'processId',title:'流程定义',hidden:true},
										  {name:'nodeFlag',title:'节点标记'},
										  {name:'name',title:'节点名称'},
										  {name:'type',title:'流程状态',hidden:true},
										  {name:'toNodeFlag',title:'创建时间',hidden:true},
										  {name:'juheNodeProcess',title:'流程聚合'},
										  {name:'departmentId',title:'审批部门Id',hidden:true},
										  {name:'departmentName',title:'审批部门'},
										  {name:'userName',title:'审批账号'},
										  {name:'personName',title:'审批姓名'},
										  //{title:'分组2',name:'g2',type:'line',itemDivStyle:'background:#ddd;'},
										  {name:'conditionProcessRemark',title:'流程条件描述',hidden:true},
										  {name:'conditionData',title:'数据条件'},
										  {name:'positionX',title:'x坐标',hidden:true},
										  {name:'positionY',title:'y坐标',hidden:true},
										  {name:'complateTaskBefore',title:'流程条件开始脚本'},
										  {name:'complateTaskAfter',title:'流程条件开始脚本'},
			
										  ];
						nodeForm = Newtec.Form.create({
							appendTo : '#nodeForm',
							titleColumn : "2",
							columnNum : "1",
							itemParams:{ titleWRate:50,autoTitle:false,titleAlign:'left',inputStyle:'padding:2px;height:25px;',itemDivStyle:"padding:0;margin:0;",titleStyle:'padding:2px'},
							//titleWRate :'20',
							fields : nodeFields,
							formType : 'table'
						});
						
						var lineField = [
						                 {name:'conditionProcessRemark' ,title:'流程条件描述',hidden:true},
						                 {name:'conditionData',title:'数据条件',hidden:true},
						                 {name:'conditionProcess',title:'流程条件'}
						                 ]
						lineForm = Newtec.Form.create({
							appendTo : '#lineForm',
							titleColumn : "2",
							columnNum : "1",
							itemParams:{ titleWRate:50,autoTitle:false,titleAlign:'left',inputStyle:'padding:2px;height:25px;',itemDivStyle:"padding:0;margin:0;",titleStyle:'padding:2px'},
							//titleWRate :'20',
							fields : lineField,
							formType : 'table'
						});

						processFormEle = document.getElementById("processForm");
						nodeFormEle = document.getElementById("nodeForm");
						lineFormEle = document.getElementById("lineForm");

						nodeFormEle.style.display = "none";
						lineFormEle.style.display = "none";
						// processFormEle.style.height = "0%";
						// nodeFormEle.style.height = "0%";
						// lineFormEle.style.height = "0%";
						processFormEle.style.width = "0%";
						nodeFormEle.style.width = "0%";
						lineFormEle.style.width = "0%";
						processFormEle.style.top = "16px";
						nodeFormEle.style.top = "20px";
						lineFormEle.style.top = "20px";
						processFormEle.style.position='absolute';
						nodeFormEle.style.position='absolute';
						lineFormEle.style.position='absolute';
						
						curShowForm = processForm;
						curShowFormEle = processFormEle;
						Newtec.ProcessNode.setCurFormEle(curShowFormEle);
						Newtec.ProcessNode.setCurShowForm(curShowForm);
						Newtec.ProcessNode.setNodeFormEle(nodeFormEle);
						Newtec.ProcessNode.setLineFormEle(lineFormEle)
					}
//					/* 显示表格并设置数据 */
					function showProcessForm() {
						curShowFormEle = Newtec.ProcessNode.getCurFormEle();
						curShowForm =  Newtec.ProcessNode.getCurShowForm();
						curShowFormEle.style.display = "none";
						if(curShowFormEle.style.width!="0%"){
							processFormEle.style.display = "block";
							processFormEle.style.right="0";
							processFormEle.style.width="30%";
						}
						curShowFormEle = processFormEle;
						curShowForm = processForm;
						Newtec.ProcessNode.setCurFormEle(curShowFormEle);
						Newtec.ProcessNode.setCurShowForm(curShowForm);
					}

					/* 显示表格并设置数据 */
					function showLineForm(processLine) {
						curShowFormEle = Newtec.ProcessNode.getCurFormEle();
						curShowFormEle.style.display = "none";
						if(curShowFormEle.style.width!="0%"){
						lineFormEle.style.display = "block";
						lineFormEle.style.right="0";
						lineFormEle.style.width="30%";
						}
						curShowFormEle = lineFormEle;
						curShowForm = lineForm;
						curLine = processLine;
						Newtec.ProcessNode.setCurFormEle(curShowFormEle);
						Newtec.ProcessNode.setCurShowForm(curShowForm);
						var inputs = $(lineFormEle).find("input");
						for ( var i = 0; i < inputs.length; i++) {
							inputs[i].value = curLine.lineProp[inputs[i].name];
						}
					}
					/* 保存方法 */
					function save() {
						newOrSave();

					}
					/* 保存流程 id为空则新建 */
					function newOrSave(id) {
						var prop = {};
						for (x in processProp) { // 构造流程属性 带前缀 p
							if (id) {
								processProp.id = id;
							} else {
								processProp.id = "";
							}// 若id参数存在 即为保存操作 否则为新建操作
							prop['p_' + x] = processProp[x];
						}
						for ( var i = 0; i < nodes.length; i++) { // 构造节点属性
							// 带前缀 n-下标-
							var nodeProp = nodes[i].nodeProp;
							var nodeShape = nodes[i].getShape();
							/* 先给nodeProp赋必要的属性 */
							nodeProp.positionX = nodeShape.type == "rect" ? (nodeShape
									.attr("x") + nodeShape.attr("width") / 2)
									.toFixed()
									: nodeShape.attr("cx").toFixed();
							nodeProp.positionY = nodeShape.type == "rect" ? (nodeShape
									.attr("y") + nodeShape.attr("height") / 2)
									.toFixed()
									: nodeShape.attr("cy").toFixed();
							nodeProp.toNodeFlag = "";
							// 拼凑toNodeFlag;
							for ( var j = 0; j < nodeShape.toline.length; j++) {
								if (nodeShape.toline[j].line.visible) { // 处理线之间的关系有点复杂
									// 但已经严格控制好visible
									// 所以用visible来判断就行了
									// 为true的才是真正存在的线
									if (nodeProp.toNodeFlag == "") {
										nodeProp.toNodeFlag = nodeShape.toline[j].to.procNode.nodeProp.nodeFlag;
									} else {
										nodeProp.toNodeFlag = ""
												+ nodeProp.toNodeFlag
												+ ","
												+ nodeShape.toline[j].to.procNode.nodeProp.nodeFlag;
									}
								}
							}

							for (x in nodeProp) {
								prop['n_' + i + '_' + x] = nodeProp[x];
							}
						}
						var trueLines = []; // 真正传到后台的线的
						var t = 0; // 临时计算用
						for ( var i = 0; i < lines.length; i++) { // 构造线属性 带前缀
							// l-下标-
							if (lines[i].getLine().line.visible) {// 处理线之间的关系有点复杂
								// 但已经严格控制好visible
								// 所以用visible来判断就行了
								// 为true的才是真正存在的线

								var lineProp = lines[i].lineProp;
								lineProp.fromNodeFlag = lines[i].getLine().from.procNode.nodeProp.nodeFlag;
								lineProp.toNodeFlag = lines[i].getLine().to.procNode.nodeProp.nodeFlag;
								lineProp.type = lines[i].getLine().type
								for (x in lineProp) {
									prop['l_' + t + '_' + x] = lineProp[x]; // 这里用t
									// 不用i
									// 保证传到后台线数据的排序正确

								}
								trueLines.push(lines[i]);// 真正传到后台的线的
								t++;
							}
						}
						for ( var i = 0; i < remarks.length; i++) { // 构造区域备注属性
							// 带前缀 r-下标-
							prop['r_' + i + '_' + 'contents'] = remarks[i].text
									.attr("text");
							prop['r_' + i + '_' + 'positionX'] = remarks[i].remarkArea
									.attr("x").toFixed();
							prop['r_' + i + '_' + 'positionY'] = remarks[i].remarkArea
									.attr("y").toFixed();
							prop['r_' + i + '_' + 'width'] = remarks[i].remarkArea
									.attr("width");
							prop['r_' + i + '_' + 'height'] = remarks[i].remarkArea
									.attr("height");
						}

						prop.nodeNum = nodes.length;
						prop.lineNum = trueLines.length;
						// prop.lineNum = lines.length; //因为线的逻辑难以处理
						// 所以是通过visible来判断是否真的存在线 所以不能用lines的长度来判断真正传到后台的线
						// lines里面的线有些是被删了的
						prop.remarkNum = remarks.length;

						// var data =
						// '{"processProp":'+processJson+',"nodeProps":'+nodeJson+',"lineProps":'+lineJson+'}'
						Newtec.DS.get("bPMProcess").updateData(
								{
									operId : 'saveProcessNode',
									data : prop,
									callback : function(res) {
										Newtec.Window.createHint({
											html : '<span>' + res.data.message
													+ '<span>'
										});
										if (res.data.message == "保存成功") {
											closeProcessDesigner();// 关闭流程设计器
										}
										// alert(Newtec.Utils.json2str(res));
									}
								});
					}
					/* 保存流程 */
					function saveas() { // 必须读取后才能保存流程 未读取只能新建
						var processId = processProp.id;
						if (!processId) {
							Newtec.Window.createHint({
								html : '<span>旧版本流程不存在,请先新建流程！<span>'
							});
							return;
						}
						// var process_id = "dfgdfg:2" //测试时使用
						newOrSave(processId);
					}
					/* 读出流程 */
					function load(processId) {
						// processId = "yyy:2"; // 测试用,到时候注释掉
						Newtec.DS
								.get("bPMProcess")
								.updateData(
										{
											operId : 'getProcessNode',
											data : {
												processId : processId
											},
											callback : function(res) {
												var str = res.data;
												var index = str.indexOf("[");
												var remarkstr = str.substring(
														index, str.length);
												var otherstr = str.substring(0,
														index);
												var remarks = JSON
														.parse(remarkstr);
												var others = JSON
														.parse(otherstr);
												// alert(Newtec.Utils.json2str(res));

												var process = {
													id : others.processId,
													key : others.key,
													name : others.name,
													version : others.version,
													status : others.status,
													createPersonId : others.createPersonId,
													createPersonName : others.createPersonName,
													createDepartmentId : others.createDepartmentId,
													createDepartmentName : others.createDepartmentName,
													createTime : others.createTime,
													updateTime : others.updateTime,
													description : others.description,
													finshProcessBefore : others.finshProcessBefore,
													finshProcessAfter : others.finshProcessAfter,
													startProcessBefore : others.startProcessBefore,
													startProcessAfter : others.startProcessAfter,
													imports : others.imports,
													bussClass : others.bussClass
												};

												var pnodes = [];
												for ( var i = 0; i < others.nodeNum; i++) {
													pnodes
															.push({
																complateTaskAfter : others["n_"
																		+ i
																		+ "_"
																		+ "complateTaskAfter"],
																complateTaskBefore : others["n_"
																		+ i
																		+ "_"
																		+ "complateTaskBefore"],
																departmentId : others["n_"
																		+ i
																		+ "_"
																		+ "departmentId"],
																departmentName : others["n_"
																		+ i
																		+ "_"
																		+ "departmentName"],
																juheNodeProcess : others["n_"
																		+ i
																		+ "_"
																		+ "juheNodeProcess"],
																juheNodeUser : others["n_"
																		+ i
																		+ "_"
																		+ "juheNodeUser"],
																name : others["n_"
																		+ i
																		+ "_"
																		+ "name"],
																nodeFlag : others["n_"
																		+ i
																		+ "_"
																		+ "nodeFlag"],
																personName : others["n_"
																		+ i
																		+ "_"
																		+ "personName"],
																positionX : others["n_"
																		+ i
																		+ "_"
																		+ "positionX"],
																positionY : others["n_"
																		+ i
																		+ "_"
																		+ "positionY"],
																toNodeFlag : others["n_"
																		+ i
																		+ "_"
																		+ "toNodeFlag"],
																type : others["n_"
																		+ i
																		+ "_"
																		+ "type"],
																userName : others["n_"
																		+ i
																		+ "_"
																		+ "userName"]
															})
												}

												var plines = [];
												for ( var i = 0; i < others.lineNum; i++) {
													plines
															.push({
																conditionProcess : others["l_"
																		+ i
																		+ "_"
																		+ "conditionProcess"],
																fromNodeFlag : others["l_"
																		+ i
																		+ "_"
																		+ "fromNodeFlag"],
																toNodeFlag : others["l_"
																		+ i
																		+ "_"
																		+ "toNodeFlag"],
																type : others["l_"
																		+ i
																		+ "_"
																		+ "type"]
															})

												}

												drawAndSetData(process, pnodes,
														plines, remarks);
											}
										});
					}
					function drawAndSetData(process, pnodes, plines, premarks) {
						// 设流程属性
						for (x in processProp) {
							processProp[x] = process[x];
						}
						var inputs = $(processFormEle).find("input");
						for ( var i = 0; i < inputs.length; i++) {
							inputs[i].value = processProp[inputs[i].name];
						}
						// 画节点
						for ( var i = 0; i < pnodes.length; i++) {
							var pnode = pnodes[i];
							var x = pnode.positionX;
							var y = pnode.positionY;
							var type = pnode.type;
							var node;
							if (type == "node") {
								//var node1 = new Node(x - 30, y - 19, 60+40, 38);
								//writeObj(node1);
								var proNode = Newtec.ProcessNode.create({
									'x':x-30,
									'y':y-19,
									'width':60+40,
									'height':38,
									'paper':paper,
									'nodeType' : 'node',
									'nodeNameCount':nodeNameCount++,
									'canEdit' :true,
									'container':container
									});
								node = proNode.currNode;
								nodes.push(node);
								node.getShape().text.attr("text",pnode.name);
								var imgX = x-30;
								var imgY = y-19;
								//paper.image(nodeImgSrc,imgX+2,imgY+6,25,25);
							} else if (type == "开始") {
								//node = new StartNode(x - 9.5, y - 9.5, 19);
								var proNode = Newtec.ProcessNode.create({
									'x':x - 9.5,
									'y': y - 9.5,
									'paper':paper,
									'r': 19,
									'nodeType' : 'start',
									'nodeNameCount':nodeNameCount++,
									'canEdit' :true,
									'container':container
									});
								node = proNode.currNode;
								nodes.push(node);
								node.getShape().text.attr("text", pnode.name);
								//paper.image(startSrc,x - 19,y - 19,38,38)
							} else if (type == "完成") {
								var proNode = Newtec.ProcessNode.create({
									'x':x,
									'y': y,
									'paper':paper,
									'r': 19,
									'nodeType' : 'end',
									'canEdit' :true,
									'container':container
									});
								//node = new EndNode(x, y, 19);
								node = proNode.currNode;
								nodes.push(node);
								//paper.image(endSrc,x - 9.5,y - 9.5,38,38)
							}

							for (x in node.nodeProp) {
								node.nodeProp[x] = pnode[x];
							}
						}
						// 画线
						for ( var i = 0; i < plines.length; i++) {
							var pline = plines[i];
							var from;
							var to;
							var type = pline.type;

							for ( var j = 0; j < nodes.length; j++) { // 找到两个链接节点
								if (nodes[j].nodeProp.nodeFlag == pline.fromNodeFlag) {
									from = nodes[j].getShape();
								}
								if (nodes[j].nodeProp.nodeFlag == pline.toNodeFlag) {
									to = nodes[j].getShape();
								}
							}
							var line = connect(from, to, lineColor, type);
							line.line.attr({
								"arrow-end" : "open-wide-long"
							});
						}

						// 画区域备注
						for ( var i = 0; i < premarks.length; i++) {
							var x = premarks[i].positionX;
							var y = premarks[i].positionY;
							var width = premarks[i].width;
							var height = premarks[i].height;
							var contents = premarks[i].contents;

							var remark = new RemarkArea(x, y);
							remark.resizeTo(width, height);
							remarks.push(remark);
							remark.text.attr("text", contents);
							for ( var j = remarks.length - 1; j >= 0; j--) { // 从后往前遍历remark让其toBack
								// 让新出来的在最上面
								remarks[j].toBack();
							}
						}
					}

					var curFocusInput; // 当前focus的input输入框,为了解决点击节点时不触发onblur事件而诞生

					/* 给input 添加事件输入后保存到对应的属性上 */
					function formFieldEve() { // 这里使用了jq 反正是业务相关的 而newtec
						// 使用了jq 不影响设计器用纯js写的问题
						var inputs = $(processFormEle).find("input");
						for ( var i = 0; i < inputs.length; i++) {
							inputs.eq(i).blur(function() {
								processProp[this.name] = this.value;
							})
							// 给特定几个输入框加脚本编辑事件
							if (inputs[i].name == "startProcessBefore"
									|| inputs[i].name == "startProcessAfter"
									|| inputs[i].name == "finshProcessBefore"
									|| inputs[i].name == "finshProcessAfter") {
								inputs.eq(i).dblclick(function() {
									createCodeHint(this.value, this);
								})
							}

						}
						var inputsN = $(nodeFormEle).find("input");
						for ( var i = 0; i < inputsN.length; i++) {
							inputsN[i].blurr = false;
							inputsN
									.eq(i)
									.blur(
											function() {
												curNode = Newtec.ProcessNode.getCurNode();
												curNode.nodeProp[this.name] = this.value;
												if (this.name == "name") {
													if (curNode.getShape().type == "rect") {
														curNode.getShape().text
																.attr(
																		"text",
																		this.value
																				.substring(
																						0,
																						4)
																				+ "\n"
																				+ this.value
																						.substring(
																								4,
																								8));
													} else {
														curNode.getShape().text
																.attr(
																		"text",
																		this.value
																				.substring(
																						0,
																						2)
																				+ "\n"
																				+ this.value
																						.substring(
																								2,
																								5));
													}
												}

											})
							// 给特定几个输入框加脚本编辑事件
							if (inputsN[i].name == "complateTaskBefore"
									|| inputsN[i].name == "complateTaskAfter") {
								inputsN.eq(i).dblclick(function() {
									createCodeHint(this.value, this);
								})
							}

							inputsN.eq(i).focus(function() { // 为了解决点击节点时不触发onblur事件而诞生
								// 选择输入框时
								// 作好当前输入框标记 以便
								curFocusInput = this;
							})
						}

						var inputsL = $(lineFormEle).find("input");
						for ( var i = 0; i < inputsL.length; i++) {
							inputsL.eq(i).blur(function() {
								if(!curLine){
									curLine = Newtec.ProcessNode.getCurLine();
								}
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
					// 在浏览器控制台打印对象的属性值
					function writeObj(obj) {
						var description = "";
						for ( var i in obj) {
							var property = obj[i];
							description += i + " = " + property + "\n";
						}
						console.log(description);
					}

					function setHintJson() { // 这里是设置提示的内容 Json格式 不设置默认只有几个提示
						var Json;// 自己设置Json对象
						return Json;
					}
					// 在浏览器控制台打印文本
					function log(obj) {
						console.log(obj);
					}

					/*-----------------------------------------------脚本编辑器------------------------------------------------*/

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
					return processDesigner;
				})))