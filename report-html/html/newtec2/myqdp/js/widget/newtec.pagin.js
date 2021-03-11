;(function(){
	if(Newtec.Pagin != undefined){
		alert('newtec.pagin.js已经被引入!');
		return ;
	}
	Newtec.Pagin=function(params){
		this.defaults = {
				headTitles:"",//格式['标题1','标题1','标题1']或者[{name:key,value:'标题1'},{name:key,value:'标题1'}]
		        style:'',
		        active:'active',
		        aStyle:'',
		        total:0,//总共多少数据
		        showNum:10,//每一页显示的数量
		        len:10,//可显示的最大页数
		        beginNum:1,
		        changedNum:4,
        };
		 $(true,this.defaults,params);
		 this.start=this.defaults.start;
		 this.nowPag=1;
		 this.showNum=this.defaults['showNum'];
		 this.total=this.defaults['total'];
		 this.beginNum=this.defaults['beginNum'];
		 this.totalPage=Math.ceil(this.total/this.showNum);
		 this.len=this.defaults['len'];
	};
	Newtec.Pagin.exte(Newtec.Base,'pagin');
	Newtec.Pagin.prototype.createNewtecJQ=function(params){
		var newtecJQ=$("<div class='newtec-pagin' style='"+params['style']+" id='pagin' '></div>");
		
		return newtecJQ;
	};
	Newtec.Pagin.prototype.finsh=function(params){
		console.info("--finsh---"+params['total']);
		console.info(this.total);
		if(this.total>0)this.createPagin(this.total,1);
		var active=params['active'];
		var This=this;
		this.newtecJQ.on('click','li',function(){
			var oldLi=This.newtecJQ.find('li.'+active);
			var nowPage=oldLi.attr('data');
			var li=$(this);
			var pageNum=li.attr('data');
			if(nowPage==pageNum)return;
			nowPage=parseInt(nowPage);
			if(pageNum=='pre'){
				if(nowPage==1)return;
//				This.toFristPage(this);
				oldLi.prev().addClass(active);
//				li.next().addClass(active);
				pageNum=nowPage-1;
			}else if(pageNum=='next'){
				if(nowPage==This.endPage)return;
				oldLi.next().addClass(active);
//				li.prev().addClass(active);
//				This.toLastPage(this);
				pageNum=nowPage+1;
			}else{
				pageNum=parseInt(pageNum);
				li.addClass(active);
			}
			oldLi.removeClass(active);
			This.changedPage(pageNum);
		});
	};
	Newtec.Pagin.prototype.createPagin=function(total,focusNum,showNum,nowPag){
		  var myself=this;
		  var newtecJQ=this.newtecJQ;
		  newtecJQ.empty();
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
		  
		  var html='<nav><ul class="pagination user-select" style="cursor:pointer;"><li  data="pre"><a>&laquo;</a></li>';
		  var len=this.len;
		  var index=myself.beginNum;
		  if (totalPage<(len+index)) {
			  len=totalPage-index+1;
		  }
		  len+=(index-1);
		  this.endPage=len;
		  for ( var i = index; i <=len; i++) {
			  if(focusNum==i){
				  html+='<li class="'+active+'" data="'+i+'"><a>'+i+'</a></li>';
			  }else{
				  html+='<li data="'+i+'"><a>'+i+'</a></li>';
			  }
		}
		  html+='<li data="next"><a>&raquo;</a></li></ul></nav>';
		  
		  newtecJQ.append($(html));
	};
	/**
	 * 功能：页码改变时回调函数
	 */
	Newtec.Pagin.prototype.changedPage=function(index){
		  this.nowPag=index;
		 var changedNum=this.defaults.changedNum+1;
		  if(index==this.endPage){
			  if(index!=this.totalPage){
				  this.beginNum=index-changedNum>0? (index-changedNum):1;
				  this.createPagin(null,index);
			  }
		  }else if(index==this.beginNum&&index!=0){
			  
			  this.beginNum=index-(11-changedNum)>0? (index-(11-changedNum)):1;
			  this.createPagin(null,index);
		}
		  var changeFunction=this.defaults['changeFunction']; 
		  if(Newtec.Utils.isFunction(changeFunction)) changeFunction(index,this.totalPage,this.beginNum,this.total);
	};
	Newtec.Pagin.prototype.toFristPage=function(obj){
		if (this.nowPag==1)return;
		this.newtecJQ.find('li').removeClass('active');
		obj=$(obj).next();
		obj.addClass('active');
		this.beginNum=0;
		this.nowPag=1;
		this.createPagin();
		var changeFunction=this.defaults['changeFunction'];
		if(Newtec.Utils.isFunction(changeFunction)) changeFunction(1,this.totalPage,this.beginNum,this.total);
	};
	Newtec.Pagin.prototype.toLastPage=function(obj){
		if (this.nowPag==this.totalPage)return;
		this.newtecJQ.find('li').removeClass('active');
		  obj=$(obj).prev();
		  obj.addClass('active');
		this.nowPag=this.totalPage;
		this.beginNum=this.totalPage-10>0?(this.totalPage-10):0;
		this.createPagin(null,this.totalPage);
		var changeFunction=this.defaults['changeFunction'];
		if(Newtec.Utils.isFunction(changeFunction)) changeFunction(this.totalPage,this.totalPage,this.beginNum,this.total);
	};
	
	/*Newtec.Pagin.prototype.createNewtecJQ=function(params){
		var newtecJQ=$("<div style='"+params['style']+"'></div>");
		
		return newtecJQ;
	};
	Newtec.Pagin.prototype.finsh=function(params){
		if(params['total']>0)this.createPagin(params);
		this.newtecJQ.on('click','li',function(){
			nav.find('li.'+active).removeClass(active);
			var li=$(this);
			var pageNum=li.attr('data');
			if(pageNum=='previous')
				li.next().addClass(active);
			else if(pageNum=='next')
				li.prev().addClass(active);
			else{
				li.addClass(active);
			}
		});
	};
	Newtec.Pagin.prototype.createPagin=function(params){
		var aStyle=params['aStyle'];
		var total=params['total'];
		var fcusPage=this.fcusPage;
		var start=this.start;
		var showMax=params['showMax'];
		var mun=params['mun'];
		var totalPage=Math.ceil(total/mun);
		showMax=(totalPage-start)>showMax
		var html="<ul class='pagination' style='margin-right:15px;float:right;'>" +
		"<li data='previous'><a style='"+aStyle+"'> <spanaria-hidden='true'>&laquo;</span></a></li>";
		var active=params.selectedClass;
		for ( var i = 1; i < 7; i++) {
			html+=i==1?'<li class="'+active+'" data="'+i+'"><a style="'+aStyle+'">'+i+'</a></li>':'<li data="'+i+'"><a style="'+aStyle+'">'+i+'</a></li>';
		}
		html+="<li  data='next'><a style='"+aStyle+"'> <spanaria-hidden='true'>&raquo;</span></a></li></ul>";
		var ul=$(html);
		this.newtecJQ.append(ul);
	};
	Newtec.Pagin.prototype.init=function(params){
		this.defaults=$(true,this.defaults,params);
		this.newtecJQ.empty();
		this.createPagin(this.defaults);
	}*/
	Newtec.Module("Pagin")
})();