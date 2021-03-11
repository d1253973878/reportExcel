;(function(){
if(Newtec.Menu != undefined){
		console.warn('newtec.menu.js已经被引入!');
		return ;
	}
Newtec.Menu = function (params) {
	//2.
	this.defaults = {
			click:null//data,that,elJQ
			,showIcon:true
			,frontImgUrl:null
    };
	this.defaults=$.extend(true,this.defaults,params);
	this.showIcon=this.defaults.showIcon;
	this.menuDatas={};
};
Newtec.Menu.exte(Newtec.Base,'menu');
Newtec.Menu.over({
	createNewtecJQ:function(params){
		var defaults=this.defaults,
		newtecJQ=$('<div class="newtec-menu"></div>');

		return newtecJQ;
	},
	finsh:function(params){
		var newtecJQ=this.newtecJQ,
		that=this;
		newtecJQ.on('click',' ul.nav>li.nav-header',function(){
			that.onClick($(this),params,true);
		});
		newtecJQ.on('click',' ul.nav>li.rows',function(){
			that.onClick($(this),params,false);
		});
	},
	onClick:function(elJQ,params,isHead){
		var data=this.menuDatas[elJQ.attr('data')];
		var isSelect =this.setSelectedByJQ(elJQ,isHead);
		Newtec.Utils.isFunction(params['click'])&&params['click'](data,this,elJQ,isSelect);
	},
	setSelected:function(id){
		console.info("0--setSelected-"+id)
		var jq=this.newtecJQ.find('[data='+id+']');
		jq[0]&&this.setSelectedByJQ(jq,true);
	},
	setSelectedByJQ:function(jq,isHead){
		var newtecJQ=this.newtecJQ;
		isHead=isHead===undefined?jq.attr('class').indexOf('nav-header')>=0:isHead;
		if(isHead&&jq.hasClass('active')){
			jq.removeClass('active');
			if(isHead){
				jq.parent().removeClass('nav-active');
			}
			return false;
		}else{
			newtecJQ.find('.active').removeClass('active')
			jq.addClass('active');
		}
		if(isHead){
			newtecJQ.find('.nav-active').removeClass('nav-active')
			var index=Newtec.Utils.toInt(jq.attr('index-data'),0)+1;
			for(var i=0;i<index;i++){
				jq=i%2?jq.parent().parent():jq.parent();
				jq.addClass("nav-active")
			} 
		}
		return true;
	},
	clearSelect:function(){
		var newtecJQ=this.newtecJQ;
		newtecJQ.find('.active').removeClass('active')
		newtecJQ.find('.nav-active').removeClass('nav-active');
	},
	setData:function(datas){
		 var arr = this.transData(datas, "id", "parentId", "children");
		 
		 var tempHtml=this.recursion(arr);
		 this.newtecJQ.append(tempHtml);
	},
	transData : function (a, idStr, pidStr, chindrenStr) {
        var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP) {
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            } else {
                r.push(aVal);
            }
        }
        return r;
    },
   recursion : function (a,index) {
    	var len=a.length;
    	if(len==0)return "";
    	index=index||0;
    	var html="";
        for (var i = 0; i < len; i++) {
            var b = a[i],chlids=b["children"]
            html+=this.createBeginHtml(b,index,chlids);
            this.menuDatas[b["id"]] = b;
            if (chlids) {
            	index++;
            	var cL=chlids.length;
            	for (var j = 0; j < chlids.length; j++) {
            		var c=chlids[j];
            		this.menuDatas[c["id"]] = c;
            		html+=c['children']&&('<li class="has-rows">'
            				+this.recursion([c],index)+"</li>")
            				||this.createRowHtml(c,index);
				}
            	index--;
            }
            html+="</ul>";
        }
        return html;
    },
    createBeginHtml:function(data,index,chlids){
    	var isOpen=data.isOpen
    	var html='<ul class="nav nav-list accordion-group'+(isOpen&&" nav-active"||"")+'">';
    	html+=this.createFirstROwHtml(data,index,chlids)
    	return html;
    },
   
    createFirstROwHtml:function(data,index,chlids){
    	index=index||0;
    	var isOpen=data.isOpen
    	var html='<li class="nav-header'+(chlids&&" h-row"||"")+(isOpen&&" active"||"")+'" data="'+data['id']+'" index-data='+index+'>';
    	//空格
    	while(index--){
    		html+='<span class="nav-span"></span>';
    	}
    	if(this.showIcon){
    		if(data['icon']){
        		html+="<img class='icon' src='"+(this.defaults.frontImgUrl||"")+data['icon']+"'/>"
        	}else{
        		var pData=this.menuDatas[data.parentId];
        		if(pData&&pData['icon'])
        			html+="<span class='icon'/></span>";
        	}
    	}
    	html+="<span>"+data['name']+'</span><i class="m-icon"/></li>';
    	return html;
    },
    
    createRowHtml:function(data,index,row){
    	index=index||1;
    	var html='<li class="rows" data="'+data['id']+'" index-data='+index+'>';
    	//空格
    	while(index--){
    		html+='<span class="nav-span"></span>';
    	}
    	if(this.showIcon){
    		if(data['icon']){
        		html+="<img class='icon' src='"+(this.defaults.frontImgUrl||"")+data['icon']+"'/>"
        	}else{
        		var pData=this.menuDatas[data.parentId];
        		if(pData&&pData['icon'])
        			html+="<span class='icon'/></span>";
        	}
    	}
    	
    	html+="<span>"+data['name']+'</span></li>';
    	return html;
    }
});
	Newtec.Module("Menu")
})();