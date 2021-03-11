;(function(){
	if(Newtec.ResultAdapter != undefined){
		alert('newtec.resultadapter.js已经被引入!');
		return ;
	}
	Newtec.ResultAdapter=function(params){
		var ds=params['ds'];
		this.ds=Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		this.defaults = {
				/**参数：getItem
				 * 该方法必须重写，必须返回一个jquery对象或者html代码,每一列结果集的样式
				 */
				getItem:function(data,resultListJQ,resultAdapter){},
				headTitles:"",//格式['标题1','标题1','标题1']或者[{name:key,value:'标题1'},{name:key,value:'标题1'}]
		        style:'',
//		        fetch:true,//旧的参数
		        autoFetch:true,
		        datas:'',
		        ds:'',
		        showFoot:false,
		        fetchParams:{},
		        showPagin:true,
		        selectedClass:'active',
		        titleClick:"",
		        pagainSelClass:'active',
		        paginAStyle:'',
		        maxRow:5,
		        newtecId:"newtecId",
		        fetchDataAfter:"",
		        setDataAfter:"",
		        showSelNum:false,
		        showToPage:true,
		        resultListDivStyle:"min-height:100px;",
		        changePageFun:"",
        };
		 this.totalData=[];
		 this.pageDatas=[];
		 params.autoFetch=params.fetch===undefined?params.autoFetch:params.fetch;
		$.extend(true,this.defaults,params);
		if(this.showPagin){
			this.defaults.endRow=this.defaults.maxRow;
		}
		this.fetchParam=this.defaults['fetchParams']
	};
	Newtec.Pagin2||Newtec.Utils.addJS('newtec.pagin2.js','myqdp/js/widget/');
	Newtec.ResultAdapter.exte(Newtec.Base,'resultadapter');
	Newtec.ResultAdapter.prototype.createNewtecJQ=function(params){
		
		var newtecJQ=$("<div class='newtec-resultadapter' style='"+params['style']+"'></div>");
		if(!Newtec.Utils.isNull(params['headTitles'])){
			newtecJQ.append(this.getHead(params));
		}
		var resultList=$("<div class='resultlist' style='"+params['resultListDivStyle']+"'></div>");
		newtecJQ.append(resultList);
		if(params.showPagin){
			this.createPagin(newtecJQ);
		}
		this.resultListJQ=resultList;
		
		return newtecJQ;
	};
	Newtec.ResultAdapter.prototype.getHead=function(params){
		var titles=params['headTitles'];
		if(!Newtec.Utils.isArray(titles))return "";
		var style='background-color: #cccccc;margin-right: 20px;height: 40px;font-size: 20px;line-height: 40px; width: 100%;';
		 var html="<ul class='inline-block' style='"+style+"' >";
		 var itemStyle='padding: 0 10px;border-right: 1px solid #fff;'
		 var selected='';
		 var selClass=params['selectedClass'];
		 for ( var i = 0; i < titles.length; i++) {
			var title=titles[i];
			selected=i==0?selClass:'';
			if(Newtec.Utils.isString(title)){
				html+="<li class='"+selected+"' style='"+itemStyle+"'><a >"+title+"</a></li>";
			}else if(Newtec.Utils.isJson(title)){
				html+="<li class='"+selected+"' style='"+itemStyle+"'><a name='"+title['name']+"'>"+title['value']+"</a></li>";
			}
		 }
		 html+="</ul>";
		 var head=$(html);
		 var titleClick= params.titleClick;
		 head.on('click','li',function(){
			 head.find('li.'+selClass).removeClass(selClass);
			 $(this).addClass(selClass);
			 if(Newtec.Utils.isFunction(titleClick))
				 titleClick(this);
		 });
		
		 return head;
	};
	Newtec.ResultAdapter.prototype.createPagin=function(newtecJQ){
		var params=this.defaults;
		var This=this;
		var showNum=params['maxRow'];
		this.paginFetchData=false;
		var pagin=Newtec.Pagin2.create({showNum:showNum,showToPage:params['showToPage'],changeFunction:function(index,totalPage,begin,totalRow){
			
			var p={startRow:(showNum*(index-1)),endRow:showNum*index,totalRow:totalRow};
			if(Newtec.Utils.isFunction(params['changePageFun'])){
				params['changePageFun'](index,showNum*(index-1),showNum*index,p);
			}
			This.paginFetchData=true;
			p.endRow=pagin.showNum
			This.fetchData(p);
			
		}});
		this.pagin=pagin;
		newtecJQ.append(pagin.newtecJQ);
	};
	Newtec.ResultAdapter.prototype.setData=function(datas,append){
		var resultListJQ=this.resultListJQ;
		if(Newtec.Utils.isNull(datas)||!Newtec.Utils.isArray(datas)){
			resultListJQ.empty();
			this.showNoData();
			return;
		}
		if(!append)
			resultListJQ.empty();
		var len=datas.length;
		if(len==0){
			if(this.totalData.length==0)this.showNoData();
		}else{
			this.hidenNoData();
		}
		this.pageDatas=datas;
		var params=this.defaults;
		var getItem=params['getItem'];
		if(!Newtec.Utils.isFunction(getItem)){
			console.error('getItem不是函数对象');return;
		}
		var newtecId=params['newtecId'];
		for ( var i = 0; i < len; i++) {
			var data=datas[i];
			data[newtecId]="result_"+Newtec.Utils.uuid(8)
			var item=getItem(data,resultListJQ,this);
			if(Newtec.Utils.isString(item))item=$(item);
			item.addClass('result');
			item.attr('data',data[newtecId]);
			resultListJQ.append(item);
		}
		var setDataAfter=params['setDataAfter'];
		if(Newtec.Utils.isFunction(setDataAfter))setDataAfter(datas,params);
	};
	Newtec.ResultAdapter.prototype.getDataById=function(id){
		if(Newtec.Utils.isNull(id))return;
		var pageDatas=this.pageDatas;
		var newtecId=this.defaults['newtecId'];
		console.info(newtecId);
		console.info(id);
		console.info(pageDatas);
		for ( var i = 0; i < pageDatas.length; i++) {
			var data=pageDatas[i];
			console.info(data[newtecId]);
			if(data[newtecId]==id||data['id']==id){
				console.info(data);
				return data;
			}
		}
	}
	Newtec.ResultAdapter.prototype.showNoData=function(){
		var noDataDiv=this.noDataDiv;
		if(noDataDiv){
			noDataDiv.css('display','block');
		}else{
			this.noDataDiv=noDataDiv=$("<div style='text-align:center;font-size:20px;margin:10px 0;'>无数据.....</div>")
			this.resultListJQ.append(noDataDiv);
		}
	};
	Newtec.ResultAdapter.prototype.hidenNoData=function(){
		if(this.noDataDiv){
			this.noDataDiv.css('display','none');
		}
	};
	Newtec.ResultAdapter.prototype.setFethchParams=function(params,isClear){
		console.info(this.defaults['fetchParams']);
		if(isClear)
			this.defaults['fetchParams']=params;
		else
			this.defaults['fetchParams']=$.extend(true,this.defaults['fetchParams'],params);
		console.info(this.defaults['fetchParams']);
	};
	Newtec.ResultAdapter.prototype.fetchData=function(params,noCover){
		if(Newtec.Utils.isNull(this.ds)) return;
		if(Newtec.Utils.isNull(params)){params={ds:this.ds.dsName};};
		var This=this,defaults=this.defaults;
		this.showLoadDiv(this.resultListJQ);
	    //
////		//合并初始化限制的请求条件
//		var fetchParam=$.extend(true,{},this.defaults['fetchParams']);
//		params=$.extend(true,fetchParam,params);
//		合并初始化限制的请求条件
		var startRow=params.startRow||params['startRow'];
		var totalRow=params.totalRow||-1;
		var endRow=params.endRow||defaults['maxRow'];
		var callback=params['callback'];
		var fetchDataAfter=defaults.fetchDataAfter;
		var fetchParam=noCover&&$.extend(true,{},this.fetchParam)||this.fetchParam;
		params=$.extend(true,fetchParam,params);
		params.startRow=startRow;
		params.totalRow=totalRow;
		params.totalRow=totalRow;
		params.endRow=endRow;
		params['callback']=function(response){
			This.hideLoadDiv();
			if(Newtec.Utils.isFunction(callback))
				callback(response);
			if(response.status==0){
				var data=response.data||{};
				if(This.defaults.showPagin){
					if(!This.paginFetchData){
						var totalRow=Newtec.Utils.toInt(data.total,0);
						This.totalNum=totalRow;
						if(totalRow<=0){
							This.pagin.hidden();
						}else{
							This.pagin.createPagin(totalRow,null,defaults.maxRow);
							This.pagin.show();
						}
						
					}else{
						This.paginFetchData=false;
					}
				}
				if(Newtec.Utils.isFunction(fetchDataAfter)){
					fetchDataAfter(response,params);
				}
				This.setData(data.datas);
			}else{
				console.error(response.error);
			}
		};
		this.ds.fetchData(params);
	};
	Newtec.ResultAdapter.prototype.finsh=function(params){
		var datas=params['datas'];
		console.info("----ResultAdapter-"+params.fetch);
		if(!Newtec.Utils.isNull(datas)&&Newtec.Utils.isArray(datas)){
			this.setData(datas);
		}else if(params.autoFetch){
			console.info("----ResultAdapter-"+params.fetch);
			this.fetchData();
		}
		setListenerFun(this);
	};
	var setListenerFun=function(This){
		var resultListJQ=This.resultListJQ;
		var params=This.defaults;
		var resuleClick=params.resuleClick;
		if(Newtec.Utils.isFunction(resuleClick))
			resultListJQ.on('click','.result',function(){
				var id=$(this).attr('data');
				var data=This.getDataById(id);
				resuleClick($(this).attr('data'),data,params);
			});
		
	};
	Newtec.ResultAdapter.prototype.showLoadDiv=function(){
		var loadDiv=this.loadDiv;
        if(loadDiv==undefined){
        	var newtecJQ=this.newtecJQ;
        	loadDiv=this.loadDiv=$('<div style="width:100%;height:100%;background:white;top:0;position:absolute;-moz-opacity:0.7; -khtml-opacity:0.7;opacity:0.7;"><div>');
        	loadDiv.append('<div style="position:absolute;width:180px;height:30px;margin:auto;top:0;bottom:0;left:0;right:0;">正在努力加载数据中....</div>');
        	newtecJQ.append(loadDiv);newtecJQ.css('position','relative');
        }else{
        	loadDiv.css('display','block');
        }
	};
	Newtec.ResultAdapter.prototype.hideLoadDiv=function(){
		var loadDiv=this.loadDiv;
		loadDiv.css('height',loadDiv.outerHeight());
	    loadDiv.fadeOut(300);
		//this.resultListJQ.css('position','static');
		setTimeout(function(){
			loadDiv.css('height',"100%");
		}, 400);
	};
	Newtec.ResultAdapterGrop=function(params){
		var ds=params['ds'];
		this.ds=Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		this.defaults.groupBy='';//格式：'key'或者 ['key1','key2']假如为数组，则优先级由高到底
		this.defaults.getGroup='';//函数返回分组div对象
		this.defaults.autoSort=true;
		this.defaults.mode=1;//1:默认结构，单行数组，2：数组内有数组如：[{key1:'',Key2:[]},{key1:'',Key2:[]}]
//		this.defaults={
//				groupBy:"",
//				getGroup:""
//		};
	};
	Newtec.ResultAdapterGrop.exte(Newtec.ResultAdapter,'resultadapterGrop');
	Newtec.ResultAdapterGrop.prototype.setData=function(datas,append){
		var resultListJQ=this.resultListJQ;
		if(!append)
			resultListJQ.empty();
		if(!Newtec.Utils.isArray(datas)||datas.length==0)return;
		var getItem=this.defaults['getItem'];
		if(!Newtec.Utils.isFunction(getItem)){
			console.error('getItem不是函数对象');return;
		}
		var params=this.defaults;
		var groupBy=params['groupBy'];
		if(Newtec.Utils.isNull(groupBy)){
			console.error('groupBy 不能为空！！');return;
		}
		
		datas=params.autoSort?sortArray(sort1,groupBy[1],datas):datas;
		if(params.mode==2){
			groupBy=Newtec.Utils.isArray(groupBy)?groupBy[0]:groupBy;
			for ( var i = 0; i < datas.length; i++) {
				var data=datas[i];
				var groupDiv=this.getGroupDiv(data);
				resultListJQ.append(groupDiv);
				var isGroupBegin=true;
				var newList=data[groupBy];
				var groupData=$.extend(true,{},data);groupData[groupBy]="";
				for ( var j = 0; j < newList.length; j++) {
					var d=newList[j];
					var item=getItem(d,isGroupBegin,resultListJQ,this,groupData);
					isGroupBegin=false;
					if(Newtec.Utils.isString(item))item=$(item);
					item.addClass('result');
					item.attr('data',d.id);
					groupDiv.append(item);
				}
			}
		}else{
			var sort1=groupBy[0];
			var d=datas[0];
			var tag1=d[sort1];
//			datas=sortArray(sort1,groupBy[1],datas);
			var groupDiv=this.getGroupDiv(d);
			resultListJQ.append(groupDiv);
			var isGroupBegin=true;
			for ( var i = 0; i < datas.length; i++) {
				d=datas[i];
				if(tag1!=d[sort1]){
					tag1=d[sort1];
					groupDiv=this.getGroupDiv(d);
					resultListJQ.append(groupDiv);
					isGroupBegin=true;
				}
				var item=getItem(d,isGroupBegin,resultListJQ,this);
				isGroupBegin=false;
				if(Newtec.Utils.isString(item))item=$(item);
				item.addClass('result');
				item.attr('data',d.id);
				groupDiv.append(item);
			}
		}
		
	};
	Newtec.ResultAdapterGrop.prototype.getGroupDiv=function(f){
		
		var getGroup=this.defaults['getGroup'];
		var group=$("<div></div>");
		if(Newtec.Utils.isFunction(getGroup))group=getGroup(f);
		return group;
	};
	var sortArray=function(sort1,sort2,array,toAddArry){
		var d=array.shift();
		var tag1=d[sort1];
		var tag2=d[sort2];
		
		toAddArry=toAddArry?toAddArry:[];
		toAddArry.push(d);
		var temp=[];
		var len=array.length;
//		for ( var j = 0; j < sorts.length; j++) {
//			tag[sorts[j]]=d[sorts[j]];
//		}
		while(len>0){
			for ( var i = 0; i < len; i++) {
				if(tag1==array[i][sort1]){
					temp.push(array[i]);
					array.splice(i,1);
					len--;
					i--;
				}
			}
			var tempLen=temp.length;
			while(tempLen>0){
				for ( var i = 0; i < tempLen; i++) {
					if(temp[i][sort2]==tag2){
						toAddArry.push(temp[i]);
						temp.splice(i,1);
						i--;tempLen--;
					}
				}
				if(tempLen>0){
					var t=temp.shift();
					toAddArry.push(t);
					tag2=t[sort2];
					tempLen--;
				}
			}
			if(len>0){
				var t=array.shift();
				toAddArry.push(t);
				tag1=t[sort1];
				len--;
			}
		}
		return toAddArry;
	};
	Newtec.Module("ResultAdapter")
})();