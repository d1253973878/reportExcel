/**
 * 设计器头部
 */
(function(){
	/**
	    * 设置顶部布局
	    * @param {Object} newtecJQ ：父布局
	    */
   Newtec.MyBpmDesign.prototype.setHeadBody=function(newtecJQ){
   		var layout=$("<div class='canvas-head'><span class='top-title'>工具栏<span></div>");
   		var btnDiv=$("<div class='btn-div pull-right'></div>");
   		var that=this,select=false,isArrow=false;
   		layout.append(btnDiv)
   		that.lineType="straight";
   		var itemsLayout=this.itemsLayout;
   		var arr=[
   			{name:'select',title:'选中',isRetrun:true,click:function(selected){
   				console.info("====selected===",selected)
   				if(selected){//选中功能开启
   					var startX=0,startY=0,endX=0,endY=0,multNewtecs;	
   					itemsLayout.on('mousedown',function(e){
   						multNewtecs=that.multNewtecs=[];
			   			var x=e.offsetX,y=e.offsetY;
			   			itemsLayout.addClass("select-draging")
			   			if(that.selectLineObje){
			   				that.selectLineObje.remove();
			   				that.selectLineObje=null;
			   			}
			   			startX=x;
			   			startY=y;
						itemsLayout.on("mousemove",function(e2){
							var x2=e2.offsetX,y2=e2.offsetY;
							var path="M"+x+","+y+"L"+x2+","+y+" "+x2+","+y2+" "+x+","+y2+" "+x+","+y;
							if(that.selectLineObje){
								that.selectLineObje.attr('path',path)
							}else{
								that.selectLineObje=that.drawPath(path,{"stroke-dasharray":"-",stroke:"#333	",showArrow:false,"stroke-width": 1})
							}
							endX=x2;
							endY=y2;
							return false;
						})
						return false;
					})
	   				itemsLayout.on("mouseup",function(e2){
						itemsLayout.unbind("mousemove")
						itemsLayout.removeClass("select-draging");
						if(!that.selectLineObje)return;
						that.mutleSelect=true;
						that.selectLineObje.remove();
						that.selectLineObje=null;
						var nodeNewtecs=that.nodeNewtecs;
						var count=0;
						if(startX>endX){
							var t=startX;
							startX=endX;
							endX=t;
						}
						if(startY>endY){
							var t=startY;
							startY=endY;
							endY=t;
						}
						for(var i=0,len=nodeNewtecs.length;i<len;i++){
							var pos=nodeNewtecs[i].getPosition(),x=pos.left,y=pos.top;
							if(x>=startX&&x<=endX&&y>=startY&&y<=endY){
								var dSelect=that.designSelects[count];
								if(!dSelect){
									dSelect=Newtec.DesignSelect.create({
						   				design:that,parentDiv:that.itemsLayout,
						   				start:{x:0,y:0},end:{x:10,y:10}
						   			})
						   			that.designSelects.push(dSelect)
								}
								multNewtecs.push(nodeNewtecs[i]);
								dSelect.selectJQ(nodeNewtecs[i]);
								count++
							}
						}
						return false;
					})
	   			}else{
	   				that.mutleSelect=false;
	   				multNewtecs=that.multNewtecs=null;
	   				itemsLayout.unbind("mousedown");
	   				itemsLayout.unbind("mouseup")
	   			}
   				
   			}},
   			{name:'line',title:'线',isRetrun:true,click:function(isArroww){
   				setLayoutStatus(isArroww);
   				if(isArroww){
   					that.noDrag=true;
   				that.lineType="straight"
   			}
   			}},
   			{name:'curve',title:'曲线',isRetrun:true,click:function(isArroww){
   				setLayoutStatus(isArroww);
   				if(isArroww){
   					that.noDrag=true;
   				that.lineType="curve";
   			}
   			}},
   			{name:'delete',title:'删除',click:function(){
   				that.deleteCrr()
   			}},
   			{name:'edit',title:'编辑',isRetrun:true,click:function(){
   				that.editMess()
   			}},
   			{name:'chang',title:'模式切换',isRetrun:true,click:function(){
   				setLayoutStatus();
   				var nodeNewtecs=that.nodeNewtecs,lineNewtecs=that.lineNewtecs;
   				for(var i=0,len=nodeNewtecs.length;i<len;i++){
   					var newtecJQ=nodeNewtecs[i];
   					Newtec.Utils.isFunction(newtecJQ.changeModel)&&newtecJQ.changeModel();
   				}
   				that.clearCvs();
   				for(var i=0,len=lineNewtecs.length;i<len;i++){
   					lineNewtecs[i].reDraw();
   				}
   				that.clearStatus();
   			}},
   			{name:'undo',title:'撤回',click:function(){
   				setLayoutStatus();
   				that.undo()}},
   			{name:'redo',title:'重做',click:function(){
   				that.redo()
   				setLayoutStatus();	
   			}},
   		]
   		var src="bpm/images/new/";
   		var preName="";
   		for(var i=0,len=arr.length;i<len;i++){
   			var data=arr[i],
   			btn=$("<span title='"+data.title+"' data='"+data.name+"'><img src='"+src+data.name+".png'></span>");
   			btnDiv.append(btn);
   			(function(btn,data){
   				btn.click(function(){
	   				var pre=btnDiv.find(".a-ative"),
	   				jq=$(this);
	   				pre.removeClass("a-ative")
	   				pre.find('img').attr("src",src+pre.attr("data")+".png");
	   				var crrName=data.name;
	   				setLayoutStatus();
	   				if(crrName==preName&&data.isRetrun){
	   					preName=null;
	   					data.click&&data.click(false);
	   					return;
	   				}
	   				preName=crrName;
	   				jq.addClass("a-ative")
	   				jq.find('img').attr("src",src+preName+"ed.png");
	   				data.click&&data.click(true);
   				})
   			})(btn,data);
   			
   		}
   		var headBtn=this.defaults.headBtn;
   		var save=$("<button class='btn btn-blue' ><img src='bpm/images/new/save.png'/>保存</button>");
   		var addBnt=$("<button class='btn btn-blue'><img src='bpm/images/new/add.png'/>新增</button>");
   		btnDiv.append(save).append(addBnt)
   		if(headBtn&&headBtn.length>0)
	   		for(var i=0;i<headBtn.length;i++){
	   			var btnd=headBtn[i],
	   			btn=$("<button class='btn "+(btnd.className||"btn-blue")+"'><img src='"+(btnd.imgurl||"bpm/images/new/add.png")+"'/>"+btnd.title+"</button>");
	   			(function(btnd,btn){
	   				btn.click(function(){
	   					btnd.click&&btnd.click();
	   				})
	   			})(btnd,btn);
	   			btnDiv.append(btn)
	   		}
   		save.click(function(){
   			that.saveData();
   		})
   		addBnt.click(function(){
   			that.saveData(true);
   		})
   		newtecJQ.append(layout)
   		function setLayoutStatus(){
			that.noDrag=false;
		}
   		this.setLayoutStatus=setLayoutStatus;
   }
   /**
    * 功能说明：删除当前选中
    */
    Newtec.MyBpmDesign.prototype.deleteCrr=function(){
    	if(this.mutleSelect){
    		var multNewtecs=this.multNewtecs
    		for(var i=0;i<multNewtecs.length;i++){
    			multNewtecs[i].remove();
    		}
    		this.multNewtecs=null;
    	}else{
    		this.selectNewtec.remove();
    	}
    	this.clearStatus();
    }
})();
