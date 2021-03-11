/**
 * 获取流程审批过长控件，必须参数是bpmBussId
 */
;(function(){
if(Newtec.BpmHistory != undefined){
		console.warn('Newtec.BpmHistory.js已经被引入!');
		return ;
	}
Newtec.Table||Newtec.Utils.addJS("newtec.table.js","myqdp/js/widget/")
Newtec.BpmHistory = function (params) {
	var ds=params.ds||Newtec.DS.create("bpmData");
	this.ds=Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds
	this.defaults = {
		lineSart:88,
		firstTitle:'提交订阅',
		nodes:null
    };
};
Newtec.BpmHistory.exte(Newtec.Base,'bpmHistory');
Newtec.BpmHistory.over({
	createNewtecJQ:function(params){
		if(!params.bpmBussId){
			Newtec.Window.hint("流程key和流程Id不能为空");
			return;
		}
		var newtecJQ=$('<div class="newtec-bpm-history"></div>');
		var headJQ=$("<div class='bpm-head'></div>");
		var bodyJQ=$("<div id='tableDiv' class='bpm-body'></div>");
		this.headJQ=headJQ;
		this.bodyJQ=bodyJQ;
		return newtecJQ.append(headJQ).append(bodyJQ);
	},
	setNode:function(datas){
		var width= this.newtecJQ.width();
		var headJQ=this.headJQ,
		defaults=this.defaults,
		lineSart=defaults.lineSart||0,
		headHtml="";
		var tagW=35;
		headJQ.empty();
		var nodeLength=datas.length;
		
		width=width-tagW*(nodeLength)-lineSart*2;
		width=width/nodeLength;
		var lastOpera="";
		datas[0].opera="开始";
		nodeLength=nodeLength-1;
		
		for(var i=0;i<=nodeLength;i++){
			var data=datas[i];
			lastOpera=i==nodeLength?data.opera:"";
			headHtml+=i==0?"":_getHeadLine(lineSart+(i-1)*width,data,width);
			headHtml+=_getHeadItem(data,(i)*width+(i==0?0:tagW),null,data.operType);
		}
		var lastData={opera:lastOpera=="同意(完)"?"已完成":(lastOpera=="不同意(完)"?"不完成":"完成")}
		headHtml+=_getHeadLine(lineSart+(i-1)*width,lastData,width);
		headHtml+=_getHeadItem(lastData,(i)*width+tagW);
		headJQ.append(headHtml);
	},
	finsh:function(params){
		var that=this;
		this.ds.fetchData({
			operId:"getAuditDetail",
			data:{bpmId:params.bpmBussId},
			success:function(res){
				var data=res.data,
				nodes=data.nodes,
				history=data.history;
				var titleNodes=params.nodes||{};
				
				for(var i=1,len=nodes.length,node=nodes[0];i<=len;node=nodes[i++]){
					var nodeFlag=node.nodeFlag;
					var tagNode=titleNodes[nodeFlag];
					var opera=i==1&&params.firstTitle||i==len&&"审批"||"审核";
					var title=node['nodeName']||(node['departmentName']||node['personName']||"");
					if(tagNode){
						if(!tagNode.title){
							title+=tagNode.opera||opera;
							tagNode.title=title;
						}
						node.title=tagNode.title;
					}else{
						title+=opera;
						node.title=title;
						titleNodes[nodeFlag]={title:title};
					}
				}
				for(var i=1,len=history.length,h=history[0];i<=len;h=history[i++]){
					h.nodeName=titleNodes[h.nodeFlag].title;
				}
				that.setNode(nodes)
				that.setData(history)
			}
		})
	},
	setData:function(datas){
		if(!Newtec.Utils.isArray(datas))return;
		var table=Newtec.Table.create({
			fields:[{title:"节点名称",name:'nodeName'},{title:'起始时间',name:'startTime',width:160},
			        {title:'结束时间',name:'endTime',width:160},{title:"审批人",name:'personName',width:140},
			        {title:'状态',name:'opera',width:90},{title:'审批意见',name:'content'}],mode:2,maxHeight:320,
			datas:datas,multSelect:false,fixed:true
		})
		this.bodyJQ.append(table.newtecJQ);
	}
});

function _getHeadLine(left,data,width){
	opera=data['opera'];
	opera=opera=="待审"||opera=="完成"||opera=='不完成'?"":(opera.indexOf("不同意")>=0?"fail":"success")
	return "<div class='bpm-line "+opera+"' style='left:"+left+"px;width:"+(width)+"px;'><div class='arrow-right'></div></div>";
}
function _getHeadItem(data,left,url){
	left=left||0;
	opera=data['opera'];
	var tagUrl="";
	var text=data.title;
	console.info("132",data,data.title);
	if(opera=="开始"){
		tagUrl="myqdp/images/bpm/bpmstart.png";
	}else if(opera=="待审"){
		tagUrl="myqdp/images/bpm/audit.png";
	}else if(opera=="同意(完)"||opera=="同意"){
		tagUrl="myqdp/images/bpm/audited.png";
	}else if(opera=="不同意(完)"||opera=="不同意"){
		tagUrl="myqdp/images/bpm/auditerr.png";
	}else if(opera=="已完成"){
		tagUrl="myqdp/images/bpm/ended.png";
		text="完成";
	}else if(opera=="不完成"){
		text="完成";
		tagUrl="myqdp/images/bpm/end.png";
	}else{
		text="完成";
		tagUrl="myqdp/images/bpm/end.png";
	}
	url=tagUrl;
	return "<div class='bpm-item' style='left:"+left+"px;'>" +
			"<img src='"+url+"'/>" +
			"<p>"+text+
			"</p>" +
			"<p>"+(data['endTime']||data['startTime']||"")+"</p>" +
			"</div>";
}


})();