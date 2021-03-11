/**
 * 组件：BpmNode
 * 功能：流程节点，定义了三种流程节点，极度依赖于父类对象Newtec.MyBpmDesign
 * @author 吴明坤
 */
Newtec.Component([{js:"bpm.node.js",src:"bpm/js/"}],function(){
	Newtec.StartNode = function (params) {};
	Newtec.StartNode.exte(Newtec.BpmNode,'startNode');
	Newtec.StartNode.over({
	  getImageName:function(){
	  		return "bpm/images/node/big-start.png";
	  }
	});
});