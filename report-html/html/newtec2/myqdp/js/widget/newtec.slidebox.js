;(function(){
	if(Newtec.SlideBox != undefined){
		alert('newtec.slidebox.js已经被引入!');
		return ;
	}
	Newtec.SlideBox=function(params){
		this.defaults = {
        		title:'',
        		style:'',
        		width:100,
        		height:100,
        		srcs:[],//格式:['shop/images/ss.png','shop/images/ss.png']或者[{src:'shop/images/ss.png',name:'ss'},{src:'shop/images/gg.png',name:'gg'}]
//        		click:""
        };
	};
	Newtec.SlideBox.exte(Newtec.Base,'slidebox');
	Newtec.SlideBox.prototype.createNewtecJQ=function(params){
		var srcs=params['srcs'];
		if(Newtec.Utils.isNull(srcs)||!Newtec.Utils.isArray(srcs)){
			console.error("srcs数据为空或者不是数组！");return;
		}
        var width=params['width'];
        var height=params['height'];
        this.srow=width;
		var len=srcs.length;
		var newtecJQ=$("<div class='newtec_slidebox' style='"+params['style']+";overflow:hidden;position:relative;height:"+height+"px;width:"+width+"px;'></div>"),
		ul=$("<ul style='height:100%;width:"+(width*len)+"px;'></ul>"),itemUl=$("<ul style='position:absolute;bottom:0;width:"+(len*35)+"px;left:0;right:0;margin:auto;'></ul>");
        var titleDiv=$('<div style="position:absolute;top:50%;height:80px;margin-top:-40px;text-align:center;font-size:50px;width:100%;background-color:#650B0B;-moz-opacity:0.5; -khtml-opacity: 0.5;opacity: 0.5">'+
        		'<span style="width:100%;color:#fff;">'+params['title']+'</span></div>'); 
		newtecJQ.append(ul).append(itemUl).append(titleDiv);
		var html='',itemHtml='';
		var active='active';
		for ( var i = 0; i < len; i++) {
			var src=srcs[i];
			active=i!=0?"":active;
			if(Newtec.Utils.isString(src)){
				html+='<li style="float:left;" ><img src="'+src+'" alt="" style="width:'+width+'px;height:'+height+'px;" ></li>';
				itemHtml+="<li  class='"+active+"'  style='width:25px;height:25px;margin:0 5px;border-radius:50px;border:2px solid #ddd;background-color: #cccccc;float:left;'></li>";
			}else if(Newtec.Utils.isJson(src)){
				html+='<li style="float:left;" ><img src="'+src['src']+'" alt="" style="width:'+width+'px;height:'+height+'px;"></li>';
				itemHtml+="<li  class='"+active+"' style='width:25px;height:25px;margin:0 5px;border-radius:50px;border:2px solid #ddd;background-color: #cccccc;'></li>";
			}
		}
		ul.append(html);
		itemUl.append(itemHtml);
		this.slider=ul;
		this.itemUl=itemUl;
		return newtecJQ;
	};
	Newtec.SlideBox.prototype.finsh=function(params){
		console.info("!!!!!!!!",params)
		var len=params.srcs.length;
		var index = 1;  //图片序号
		var This=this;
		var isAdd=true;
		var move=function() {
			This.itemUl.find('li.active').removeClass('active');;
			This.itemUl.find('li:eq('+index+')').addClass('active');
			This.showImg(index);
			if(isAdd)
				index++;
			else
				index--;
			if (index == len) {       //最后一张图片之后，转到第一张
				isAdd=false;
				index=len-2;
			}else if(index==-1){
				isAdd=true;
				index=1;
			}
		};
		var first=0;
		this.itemUl.find('li').mouseover(function() {
			    if(first==0){first++;return;};
		        index = This.itemUl.find('li').index(this);  //获取鼠标悬浮 li 的index
		        This.itemUl.find('li.active').removeClass('active');
		        $(this).addClass('active');
		        This.showImg(index);
		    }).eq(0).mouseover();
		this.newtecJQ.hover(function() {
			clearInterval(adTimer);
		}, function() {
			adTimer = setInterval(move, 3000);
		}).trigger("mouseleave");
	};
	Newtec.SlideBox.prototype.showImg=function(index){
		var srow=this.srow;
		 this.slider.stop(true, false).animate({
            "marginLeft": -(srow) * index + "px"    //改变 marginTop 属性的值达到轮播的效果
        }, 1000);
      
	};
	Newtec.Module("SlideBox")
})();