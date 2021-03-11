/**
 * 组件：YWBpmDesign
 * 功能：业务流程设计器，跟业务挂钩
 * @author 吴明坤
 */
Newtec.Component([{js:'bpm.design.js',src:'bpm/js/'},"widget/newtec.table.js","widget/newtec.form.js"],
	function(){
	Newtec.YWBpmDesign = function (params) {};
	Newtec.YWBpmDesign.exte(Newtec.MyBpmDesign,'YWBpmDesign');
	Newtec.YWBpmDesign.over({
		/**
	    * 功能说明：节点设置
	    * @param {Object} data {jq:newtec}其他内容根据传入的来决定
	    */
	 	nodeSetting:function(data){
	 		this.setFormData()
	 		this.showRight();
	 	},
	 	/**
	 	 * 
	 	 * @param {Object} nodes {name:节点名称，type:节点类型，fromNodeFlag：节点的标记，positionX：节点x坐标，positionY：节点y坐标}
	 	 * @param {Object} lines {fromNodeFlag：起始点标记，toNodeFlag：结束点标记，midNodes：连线中间的点，可存多个点，用分好隔开，逗号隔开区分x和y，如：x1,y1;x2,y2}
	 	 * @param {Object} isClear //是否清除之前的数据,默认是true
	 	 */
	 	setData:function(nodes,lines,isClear){
	 		isClear=isClear===false?false:true;
	 		if(isClear){//清除原有数据
	 			this.clear();
	 		}
	 		if(!Newtec.Utils.isArray(nodes)||nodes.length<=0){
	 			console.error("nodes为空！！")
	 			return ;
	 		}
	 		var nodeNewtecs=this.nodeNewtecs
	 		var flagMap={};
	 		//设置节点位置
	 		var maxFlag=this.nodeFlag*10;
	 		for(var i=0,len=nodes.length;i<len;i++){
	 			var node=nodes[i],
	 			fromNodeFlag=Newtec.Utils.toInt(node.fromNodeFlag,0),
	 			propeties=node.propeties,
	 			newtec=this.createNode({
	 				title:node.name,type:node.type,data:node
	 			});
	 			flagMap[fromNodeFlag]=newtec;
	 			newtec.nodeFlag=fromNodeFlag;
	 			if(maxFlag<fromNodeFlag){
	 				maxFlag=fromNodeFlag;
	 			}
	 			this.setLyItem({jq:newtec,x:propeties.positionX,y:propeties.positionY,isCenter:false,type:"node"});
	 			newtec.draw();
	 			nodeNewtecs.push(newtec);
	 		}
	 		this.nodeFlag=maxFlag/10+1;
	 		if(!Newtec.Utils.isArray(lines)||lines.length<=0)return;
	 		var lineNewtecs=this.lineNewtecs
	 		//连线
	 		for(var i=0,len=lines.length;i<len;i++){
	 			var line=lines[i],
	 			fromNodeFlag=line.fromNodeFlag,
	 			toNodeFlag=line.toNodeFlag,
	 			propeties=line.propeties,
	 			formNode=flagMap[fromNodeFlag],
	 			toNode=flagMap[toNodeFlag];
	 			if(!toNode||!formNode)continue;
	 			var pos=null;
//	 			if(!Newtec.Utils.isNull(midNodes)){
//	 				pos=midNodes.split(",");
//	 				if(pos.length==2){
//	 					pos={x:Newtec.Utils.toInt(pos[0],0),y:Newtec.Utils.toInt(pos[1],0)}
//	 				}else{
//	 					pos=null;
//	 				}
//	 			}
	 			var lineNewtec=Newtec.BpmLine.create({
	 				toNode:toNode,formNode:formNode,
	 				parent:this,propeties:propeties,type:line.type
	 			})
	 			lineNewtecs.push(lineNewtec);
//	 			lineNewtec.reDraw();
	 			formNode.toLine.push(lineNewtec);
		   		toNode.formLine.push(lineNewtec);
	 		}
	 		
	 	},
	 	/**
	 	 * 功能说明：获取业务数据
	 	 * return {nodes:节点，lines:线}
	 	 * nodes {name:节点名称，type:节点类型，fromNodeFlag：节点的标记，positionX：节点x坐标，positionY：节点y坐标}
	 	 * lines {fromNodeFlag：起始点标记，toNodeFlag：结束点标记，midNodes：连线中间的点，可存多个点，用分好隔开，逗号隔开区分x和y，如：x1,y1;x2,y2}
	 	 */
	 	getData:function(){
	 		var nodeNewtecs=this.nodeNewtecs;
	 		if(!Newtec.Utils.isArray(nodeNewtecs)||nodeNewtecs.length<=0)return {};
	 		var nodes=[],lines=[];
	 		for(var i=0,len=nodeNewtecs.length;i<len;i++){//处理节点
	 			var node=nodeNewtecs[i],
	 			data=(node.dataForm&&node.dataForm.getValues())||node.defaults.data||{},
	 			fromNodeFlag=node.nodeFlag,
	 			nlines=node.toLine;
	 			toNodeFlag='';
	 			data.propeties=node.getPropeties();
	 			data.fromNodeFlag=fromNodeFlag;
	 			for(var j=0;j<nlines.length;j++){//查找节点上的线
	 				var line=nlines[j],
	 				toNode=line.toNode,
	 				lPos=line.midPos,
	 				tFlag=toNode.nodeFlag,
	 				isChange=line.isChange;
	 				toNodeFlag+=(j==0?"":",")+tFlag;
	 				lines.push({fromNodeFlag:fromNodeFlag,
	 					toNodeFlag:tFlag,
	 					points:line.isChange?"curve":"straight",
	 					propeties:line.getPropeties()})
	 			}
	 			data.toNodeFlag=toNodeFlag;
	 			nodes.push(data)
	 		}
	 		return {nodes:nodes,lines:lines}
	 	},
	 	fetchData:function(){},
	 	 baseFields:function(){
	   		return {"base":{fields:[
	   			{name:'name',title:'流程名称'},
	   			{name:'remark',title:'流程备注'},
	   		],title:'基本信息'},
	   		"base1":{fields:[
	   			{name:'name',title:'流程名称'},
	   			{name:'remark',title:'流程备注'},
	   		],title:'基本信息2'},
	   		"base2":{fields:[
	   			{name:'name',title:'流程名称'},
	   			{name:'remark',title:'流程备注'},
	   		],title:'基本信息3'}};
	   },
	   getNodeForm:function(selectNewtec){
	   		return  {"基本信息":{fields:[
	   			{name:'name',title:'流程名称'},
	   			{name:'status',title:'状态'},
	   			{name:'remark',title:'流程备注'},
	   		],title:'基本信息'}}
	   },
	   getBaseData:function(){
	   		return this.baseForm.getValues();
	   }
	});
});