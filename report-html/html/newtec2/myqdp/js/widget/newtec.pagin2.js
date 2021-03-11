;(function(){
	if(Newtec.Pagin2 != undefined){
		alert('newtec.pagin2.js已经被引入!');
		return ;
	}
	Newtec.Utils.addCSS("newtec-pagin2.css","myqdp/css/widget/");
	Newtec.Pagin2=function(params){
		this.defaults = {
		        style:'',
		        active:'active',
		        total:0,//总共多少数据
		        len:5,//可显示的最大页数
		        beginNum:1,
		        changedNum:2,
		        pages:[10,20,30,50,100],
		        focusPage:1,
		        float:"right",
		        showToPage:true,
		        showSelNum:true,
		        paginClass:{
		        	buttonStyle:"",
			        buttonAStyle:"",
			        buttonActiveStyle:"",
			        buttonAActiveStyle:"",
			        toPageStyle:"",
			        spanStyle:"",
		        }
		        
        };
		$.extend(true,this.defaults,params);
		 this.nowPag=1;
		 this.changedNum=this.defaults['changedNum'];
		 this.showNum=this.defaults['pages'][0];
		 this.total=this.defaults['total'];
		 this.beginNum=this.defaults['beginNum'];
		 this.totalPage=Math.ceil(this.total/this.showNum);
		 this.len=this.defaults['len'];
		 this.pages=this.defaults.pages;
		 this.focusnum=this.defaults.focusPage;
	};

	Newtec.Pagin2.exte(Newtec.Base,'newtec.pagin2');
	Newtec.Pagin2.prototype.createNewtecJQ=function(params){
		var that = this;
		var floatFlag = params['float'] == "right" && true || false
		var newtecJQ=$("<div class='newtec-pagin2' style='"+params['style']+"' id='pagin2'></div>");
		if(floatFlag){
			newtecJQ.addClass("pull-right")
		}else{
			newtecJQ.addClass("pull-left")
		}
		var content =$("<div class='content clear-float'></div>");
		newtecJQ.append(content);
		
		
		var toPageStyle = this.defaults['paginClass']['toPageStyle'];
		var selectStyle = this.defaults['paginClass']['selectStyle'];
		var spanStyle = this.defaults['paginClass']['spanStyle'];

		var Shownumbutton = $("<div class='shownumbutton pull-left'></div>");
		content.append(Shownumbutton);
		if(params['showSelNum']){
			var Showselshownum = $("<div class='showselshownum pull-left'></div>");
			content.append(Showselshownum);
		}
		if(params['showToPage']){
			var ShowchangenowPage = $("<div class='changeNowPage pull-left'><span class = '"+spanStyle+"'>跳至</span><input type='text' id='toPageId' class='"+toPageStyle+"' value='"+this.focusnum+"'/><span class = '"+spanStyle+"'>页</span></div></div>");
			content.append(ShowchangenowPage);
		}
		
		/**
		 * toPage
		 */
		var toPage = newtecJQ.find("#toPageId");
		toPage.bind('keypress',function(event){
			  if(event.keyCode == "13"){
				  if(setToPage($(this).val(),that.totalPage)){
					  var tonum=$(this).val();
					  that.beginNum = (Math.floor((tonum-1)/4)*4)+1;
					  that.nowPag=tonum;
					  var changeFunction=that.defaults['changeFunction']; 
					  that.createPagin(that.total,tonum,that.showNum,that.nowPag);
					  if(Newtec.Utils.isFunction(changeFunction)) 
						  changeFunction($(this).val(),that.totalPage,that.beginNum,that.total);
				  }else{
					  toPage.val(that.nowPage);
				  }
			  }
		  });
		var ps = "";
		var pages=this.pages;
		for(var i=0;i<pages.length;i++){
			var selected = " selected='selected' ";
			if(pages[i]==this.showNum){
				ps = ps+"<option "+selected+"  value='"+pages[i]+"'>"+pages[i]+"条/页"+"</option>";
			}else{
				ps = ps+"<option  value='"+pages[i]+"'>"+pages[i]+"条/页"+"</option>";
			}
		}
		/**
		 * toSelectPage
		 */
		var select = $('<select id = "pageSizeId" class = "'+selectStyle+'" style="border:1px solid #f2f5fb;height:30px;width:100px;background:#f2f5fb;">' + ps + '</select>');
		newtecJQ.find('.showselshownum').append(select);
		var obj = newtecJQ.find("#pageSizeId");
		var oldShowNum=this.showNum;
		$(obj).on('change',function() {
			var vals = $(obj).children("option:selected");
			oldShowNum=that.showNum;
			showNum = vals.val();
			that.showNum = showNum;
			var changeFunction = that.defaults['changeFunction'];
			var newtotalPage = Math.ceil(that.total/that.showNum);
			if(oldShowNum!=vals.val()){
				if(that.nowPag>newtotalPage){
					that.beginNum=1;
					that.nowPag=1;
					that.createPagin(that.total,that.nowPag);
					if (Newtec.Utils.isFunction(changeFunction))
						changeFunction(that.focusnum, that.totalPage,that.beginNum, that.total);
				}else{
					that.createPagin(that.total,that.nowPag,that.showNum,that.nowPag);
					if (Newtec.Utils.isFunction(changeFunction))
						changeFunction(that.nowPag, that.totalPage,that.beginNum, that.total);
				}
				
			}
			return showNum;
		});
	  
		return newtecJQ;
	};
	Newtec.Pagin2.prototype.finsh=function(params){
		console.info("--finsh---"+params['total']);
		console.info(this.total);
		console.info(this.showNum);
		if(this.total>0)this.createPagin(this.total,1);
		var active=params['active'];
		var This=this;
		
		this.newtecJQ.on('click','.shownumbutton button',function(){
			//点击前
			var oldButton=This.newtecJQ.find('button.'+active);
			var nowPage=oldButton.attr('data');
			//点击后
			var newButton=$(this);
			var pageNum=newButton.attr('data');
			
			
			
			if(nowPage==pageNum)return;
			nowPage=parseInt(nowPage);
			if(pageNum=='pre'){
				if(nowPage==1)
					return;
				if(isNaN(oldButton.prev().attr('data'))){
					This.toPrevP(page,true);
					pageNum=page;
					return;
				}else{
					oldButton.prev().addClass(active);
					pageNum=nowPage-1;
				}
			}else if(pageNum=='next'){
				if(nowPage==This.endPage)return;
				oldButton.next().addClass(active);
				pageNum=nowPage+1;
			}
			else if(pageNum=='last'){
				if(nowPage==this.totalPage)return;
				This.toLastPage(this.totalPage);
				pageNum=this.totalPage;
				newButton.prev().prev().addClass(active);
				return;
			}
//			}else if(pageNum=='first'){
//				if(nowPage==1)return;
//				This.toFristPage(1);
//				pageNum=1;
//				newButton.next().next().addClass(active);
//				return;
//			}
			else if(pageNum=="other"){
				var page = newButton.prev().attr('data');
				This.toNextPage(page);
				pageNum=page;
				return;
			}else if(pageNum=="otherprev"){
				var page = newButton.next().attr('data');
				This.toPrevPage(page);
				pageNum=page;
				return;
			}
//			else if(pageNum=="none"){
//				return;
//			}
			else{
				pageNum=parseInt(pageNum);
				this.focusPage=pageNum;
				newButton.addClass(active);
			}
			oldButton.removeClass(active);
			This.changedPage(pageNum);
		});
	};
	

	
	
	Newtec.Pagin2.prototype.createPagin=function(total,focusNum,showNum,nowPag){
		  var myself=this;
		  var Shownumbutton=this.newtecJQ.find(".shownumbutton");
		  
		  var sumpage = Math.ceil(this.total/this.showNum);
		  
		  Shownumbutton.empty();
		  if ((Newtec.Utils.isNull(total)&&Newtec.Utils.isNull(this.total)))return;
		  var active=this.defaults['active'];
		  showNum=showNum==undefined?this.showNum:this.showNum=showNum;
		  nowPag=nowPag==undefined?this.nowPag:this.nowPag=nowPag;
		  focusNum=focusNum==undefined?1:focusNum;
		  
		  var totalPage=this.totalPage;
		  if(!Newtec.Utils.isNull(total)){
			  if(total==0)return;
			  this.total=total;
			  totalPage=this.totalPage=Math.ceil(total/showNum);
		  }
	
		  
		  var Showtotals=$('<input type="hidden" value="'+this.total+'" id="showtotals">');
		  var ShowTotalCount=this.newtecJQ.find(".showTotalCount");
		  ShowTotalCount.append($(Showtotals));
		  
		  var buttonStyle = this.defaults['paginClass']['buttonStyle'];
		  var buttonAStyle = this.defaults['paginClass']['buttonAStyle'];
		  var buttonActiveStyle = this.defaults['paginClass']['buttonActiveStyle'];
		  var buttonAActiveStyle = this.defaults['paginClass']['buttonAActiveStyle'];
		  var spanStyle = this.defaults['paginClass']['spanStyle']
		  
	      var html='';
	      html+='<span class = "'+spanStyle+'">共</span><span class="showTotalCount '+spanStyle+'">'+this.total+'</span><span class = "'+spanStyle+'">条</span>';
	      html+='<button data ="pre" class="shangyiye '+buttonStyle+'"><a class = "'+buttonAStyle+'"><</a></button>';
			
	      
		  var len=this.len;
		  var index=myself.beginNum;
		  if(totalPage!=sumpage){
			  index=1;
		  }
		  if (totalPage<(len+index)) {
			  len=totalPage-index+1;
		  }
		  len+=(index-1);
		  this.endPage=len;
		  
		  if(index>1){
			  html+='<button data="otherprev" id="otherprev" class="'+buttonStyle+'" style="display:inline;"><a class = "'+buttonAStyle+'">'+"..."+'</a></button>';
		  }
		  
		  
		  for ( var i = index; i <=len; i++) {
			  if(focusNum==i){
				  html+='<button class="'+active+' '+buttonActiveStyle+'" data="'+i+'"><a class = "'+buttonAActiveStyle+'">'+i+'</a></button>';
			  }else{
				  html+='<button data="'+i+'" class = "'+buttonStyle+'"><a class = "'+buttonAStyle+'">'+i+'</a></button>';
			  }
		  }
		  if(totalPage-index>4){
			  if(index+5==totalPage){
				  html+='<button data="last" id="othernext" class="'+buttonStyle+'" style="display:inline;"><a class = "'+buttonAStyle+'">'+totalPage+'</a></button>';
			  }else{
				  html+='<button data="other" id="othernext" class="'+buttonStyle+'" style="display:inline;"><a class = "'+buttonAStyle+'">'+"..."+'</a></button>';
				  html+='<button data="last" id="othernext" class="'+buttonStyle+'" style="display:inline;"><a class = "'+buttonAStyle+'">'+totalPage+'</a></button>';
			  }
		  }
		  html+='<button data="next" class="xiayiye '+buttonStyle+'"><a class = "'+buttonAStyle+'">></a></button>';
			
		Shownumbutton.append($(html));
	};
	
	var setToPage = function(to,totalpage){
		to = Newtec.Utils.toInt(to,-1);
		if(to>0 && to<=totalpage){
			$("#toPageId").val(to);
			return true;
		}
		return false;
	};
	
	/**
	 * 功能：页码改变时回调函数
	 */
	Newtec.Pagin2.prototype.changedPage=function(index){
		  this.nowPag=index;
		  var changedNum=this.changedNum+1;
		  if(index==this.endPage){
			  if(index!=this.totalPage){
				  this.beginNum=index-(5-changedNum)>0? (index-(5-changedNum)):1;
				  this.createPagin(null,index);
			  }
		  }else if(index==this.beginNum&&index!=0){
			  
			  this.beginNum=index-(5-changedNum)>0? (index-(5-changedNum)):1;
			  this.createPagin(null,index,this.showNum,this.nowPag);
		}
		  var changeFunction=this.defaults['changeFunction']; 
		  if(Newtec.Utils.isFunction(changeFunction)) changeFunction(index,this.totalPage,this.beginNum,this.total);
	};
	
	//省略号翻页
	Newtec.Pagin2.prototype.toNextPage=function(obj){
		
		this.newtecJQ.find('button').removeClass('active');
		obj=$(obj).prev();
		obj.addClass('active');
		this.beginNum=this.endPage;
		this.nowPag=this.endPage;
		this.createPagin(null,this.endPage,this.showNum,this.nowPag);
		
		
		var changeFunction=this.defaults['changeFunction'];
		if(Newtec.Utils.isFunction(changeFunction)) changeFunction(this.beginNum,this.totalPage,this.beginNum,this.total);
	};
	
	Newtec.Pagin2.prototype.toPrevPage=function(obj){
		
		this.newtecJQ.find('button').removeClass('active');
		obj=$(obj).next();
		obj.addClass('active');
		this.beginNum=this.beginNum-4;
		this.nowPag=this.beginNum;
		if(this.beginNum<1){
			this.beginNum=1;
			this.createPagin(null,this.nowPag,this.showNum,this.nowPag);
			var prevli= $(".shangyiye");
			prevli.next().addClass('active');
		}else{
			this.createPagin(null,this.nowPag,this.showNum,this.nowPag);
		}
		
		
		var changeFunction=this.defaults['changeFunction'];
		if(Newtec.Utils.isFunction(changeFunction)) changeFunction(this.beginNum,this.totalPage,this.beginNum,this.total);
	};
	
	Newtec.Pagin2.prototype.toPrevP=function(obj,flag){
		
		this.newtecJQ.find('button').removeClass('active');
		obj=$(obj).next().next().next().next().next();
		obj.addClass('active');
		this.beginNum=this.beginNum-4;
		this.nowPag=this.beginNum+3;
		if(this.beginNum<1){
			this.beginNum=1;
			this.createPagin(null,this.nowPag,this.showNum,this.nowPag);
			if(!flag){
				var prevli= $(".shangyiye");
				prevli.next().addClass('active');
			}
		}else{
			this.createPagin(null,this.nowPag,this.showNum,this.nowPag);
		}
		
		
		var changeFunction=this.defaults['changeFunction'];
		if(Newtec.Utils.isFunction(changeFunction)) changeFunction(this.beginNum,this.totalPage,this.beginNum,this.total);
	};
	
	//首页
	Newtec.Pagin2.prototype.toFristPage=function(obj){
		if (this.nowPag==1)return;
		this.newtecJQ.find('button').removeClass('active');
		obj=$(obj).next().next();
		obj.addClass('active');
		this.beginNum=1;
		this.nowPag=1;
		this.createPagin(null,1);
		var changeFunction=this.defaults['changeFunction'];
		if(Newtec.Utils.isFunction(changeFunction)) changeFunction(1,this.totalPage,this.beginNum,this.total);
	};
	
	//末页
	Newtec.Pagin2.prototype.toLastPage=function(obj){
		if (this.nowPag==this.totalPage)return;
		this.newtecJQ.find('button').removeClass('active');
		obj=$(obj).prev().prev();
		obj.addClass('active');
		this.nowPag=this.totalPage;
		this.beginNum=this.totalPage-4>0?(this.totalPage-4):1;
		this.createPagin(null,this.totalPage);
		
		var changeFunction=this.defaults['changeFunction'];
		if(Newtec.Utils.isFunction(changeFunction)) changeFunction(this.totalPage,this.totalPage,this.beginNum,this.total);
	};

	Newtec.Module("Pagin2")
})();