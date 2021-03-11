Newtec.Component([{js:"newtec.canvasVertor.js",src:"myqdp/js/widget/"}]
,function(){
if(Newtec.MyCanvas != undefined){
		console.warn('newtec.menu.js已经被引入!');
		return ;
	}
//Newtec.CanvasVertor||Newtec.Utils.addJS("widget/newtec.canvasVertor.js");
Newtec.MyCanvas = function (params) {
	
};
Newtec.MyCanvas.exte(Newtec.CanvasVertor,'myCanvas');
Newtec.MyCanvas.over({
   /*
    * 第一个节点必须为root节点
    */
   setData:function(datas){
   	var treeData=[],rootData=datas[0],
   	width=this.width,height=this.height,
   	defaults=this.defaults,
   	interval=defaults.interval||200,
   	itemW=defaults.itemW||150,
   	max=1;
   	itemW=itemW/2
   	for(var i=0;i<datas.length;i++){
   		var data=datas[i];
   		treeData[data.id]=data;
   	}
   	var arr=[];
   	rootData.index=0;
   	arr.push([rootData])
   	for(var i=1;i<datas.length;i++){
   		var data=datas[i],parentData=treeData[data.parentId];
   		if(parentData){
   			var index=parentData.index+1;
   			var carr=arr[index]=arr[index]||[],
   			clen=carr.length+1;
   			data.index=index;
// 			max=max>clen?max:clen;
   			carr.push(data);
   		}else{
   			data.index=0;
   			var clen=arr[0].length;
// 			max=max>clen?max:clen;
   			arr[0].push(data);
   		}
   	}
   	for(var i=arr.length-1;i>=0;i--){
   		var carr=arr[i];
   		var len=carr.length
   		for (var j=0;j<len;j++) {
   			var d=carr[j],pNode=treeData[d.parentId];
   			if(pNode){
   				var weight=pNode.weight||0;
   				weight+=d.weight||1;
   				max=max>weight?max:weight;
   				pNode.weight=weight;
   			}
   			d.weight=d.weight||1;
   		}
   	}
   	var mLength=max*interval,startX=(width-mLength)/2;
   	for(var i=0;i<arr.length;i++){
   		var carr=arr[i];
   		var len=carr.length
// 		var jg=mLength/len,//间隔
// 		hjq=jg/2;
   		for (var j=0;j<len;j++) {
   			var d=carr[j],pNode=treeData[d.parentId],
   			weiCw=d.weight*interval,
   			cX=startX,
   			jqW=d.jq.width()||itemW,
   			cY=i*100+100;
   			if(pNode){
   				cX=pNode.startX||cX;
   				pNode.startX=cX+weiCw;
   			}
   			d.startX=cX;
   			cX+=weiCw/2-jqW/2;
   			d.x=cX;d.y=cY;
   			
   		}
   	}
   	this.treeData=treeData;
   	this.setTreeData(datas);
   },
   addItem:function(data){
   		var treeData=this.treeData,
   		pData=treeData[data.parentId];
   		console.info("====MMMMM,,,",data.parentId)
   		if(data.x===undefined){
   			var startX=pData.startX,
   			defaults=this.defaults,
		   	interval=defaults.interval||200,
		   	itemW=defaults.itemW||150,
		   	jqW=data.jq.width()||itemW;
		    data.y=pData.y+100
		    data.x=startX+interval/2-jqW/2
		    pData.startX=startX+interval;
   		}
   		this.setLyItem(data)
		var jq=data.jq;
   		var w=data.width=jq.width(),
   		h=data.height=jq.height()+5,
   		x=data.x,y=data.y;
		this.drawLine(pData.node,{x:x+w/2,y:y})
		data.node={x:x+w/2,y:y+h}
   },
   setTreeData:function(datas){
   		var rootDt=datas[0];
   		var treeData=this.treeData;
   		this.setLyItem(rootDt)
   		var jq=rootDt.jq;
   		var w=rootDt.width=jq.width(),
   		h=rootDt.height=jq.height(),
   		x=rootDt.x,y=rootDt.y;
   		rootDt.node={x:x+w/2,y:y+h}
   		for(var i=1;i<datas.length;i++){
   			this.addItem(datas[i]);
   		}
   },
});
	Newtec.Module("MyCanvas")
});