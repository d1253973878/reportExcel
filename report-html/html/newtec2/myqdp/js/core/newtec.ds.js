;(function(){
	Newtec.DS = function(dsName,fields,pk){
		this.dsName = dsName;
		this.pk = Newtec.Utils.isNull(pk)?"id":pk;//数据源主键
		this.fields = fields;
		this.toLogion=true;
//		this.fields = '';
		this.firstGo=true;
		
	}
	if(Newtec.DS.OperType==undefined){//操作类型用个枚举
		Newtec.DS.OperType = {
				fetch : "fetch",
				add : "add",
				update : "update",
				remove : "remove",
				custom : "custom",
				download:"download",
				upload:"upload"
		}
	}
	/**
	 * 方法说明：同步获取登陆用户，只获取第一次，以后从缓存Newtec.person中取
	 */
	Newtec.getPerson = function(){
		if(Newtec.person != undefined) return Newtec.person;
		//获取用户信息，这个方法是集成在平台内部的，必须在数据源加载完成后才能去取数据
		new Newtec.DS('loginDS').fetchData({async:false,operId:'getPersonId',callback:function(response){
			if(response.status==0){
				var person = response.data;
				Newtec.person = person;			
			}
		}});
		return Newtec.person;
	}
	
	/**
	 * 方法说明：装载所有数据源
	 */
	Newtec.DS.loadAll = function(callback){
		this.load('', callback);
	}
	Newtec.DS.get = function(dsName){
//		alert(parent+"=="+parent.parent.parent.parent);
//		alert(dsName+">>>"+parent.parent.parent.parent.Newtec.Utils.json2str(parent.parent.parent.parent.parent.Newtec.person));
		var ds = parent.Newtec.person['ds'][dsName];
		if(parent.frameWinow==undefined) parent.frameWinow={};
		if(!ds){
			console.error("该数据源【"+dsName+"】未被授权或未创建");
			return ;
		}
		ds.id=Newtec.Utils.uuid(32);//给没个数据源设置唯一id
		parent.frameWinow[ds.id] = window;//缓存当前frame的窗口在parent.frameWinow相对应的数据源中
		return ds;
	}
	/**
	 *方法说明：装载服务器端数据源
	 *ds:
	 *1.''或null或undefined表示装载所有数据源
	 *2.多个数据源用逗号分隔或传入数组
	 *callback:数据源装载完成后回调函数
	 */
	Newtec.DS.load = function(ds,callback){
		if(Newtec.Utils.isArray(ds)){
			ds = ds.join(",");
		}
		new Newtec.DS("testds").updateData({async:false,operId:'loadDS',data:{ds:ds},callback:function(response){
			if(response.status==0){
				Newtec.DS.set(response.data);
			}
			if(Newtec.Utils.isFunction(callback))
				callback(response);
		}}); 
	}
	Newtec.DS.set = function(data){
	//	alert("pk="+Newtec.Utils.json2str(data['person']));
		for(var ds in data){
			var dds = data[ds];
			var fields = dds['fields'];
			if(fields != undefined && fields.length>0){
				var fieldLen = fields.length;
				for(var i=0;i<fieldLen;i++){
					var field = fields[i];
					var exts = field['exts'];
					if(exts==undefined) continue;
						for(var key in exts){
							var value = exts[key];
							try{
								 value = eval("("+value+")");//转化
							}catch (e) {
//								alert(value+'>转化数据源出错：'+e.message);
							}
							field[key] = value;
						}
					field['exts']=undefined;
				}
			}
			var person=Newtec.person=Newtec.person||{};
			if(person['ds']==undefined) person['ds']={};
			person['ds'][ds] = Newtec.DS.create(ds, fields,dds.pk);
		}
	}
	/**
	 * 功能说明：文件下载，比较原生，没有任何包装
	 * @param url  请求路劲
	 * @param params 参数 json格式
	 * @param method
	 */
	Newtec.DS.prototype.download = function(url, params,method){
		if(Newtec.Utils.isNull(url)){
			console.error("url为空");return;
		}
		var html='<form action="'+url+'" method="'+(method||'post')+'" style="display:none;">';
		if(Newtec.Utils.isJson(params)){
			for(var key in params){
				html+='<input type="text" name="'+key+'" />'
			}
		}
		html+="</form>";
		html=$(html)
		if(Newtec.Utils.isJson(params)){
			for(var key in params){
				html.find('input[name='+key+']').val(params[key]);
			}
		}
	    jQuery(html)
	    .appendTo('body').submit().remove();
	};
	/**
	 * 功能说明：文件下载，可调用DMI，下载没有返回值，返回值是下载文件
	 * @param params
	 */
	Newtec.DS.prototype.downloadFile = function(params){
		if(Newtec.Utils.isNull(params.ds)){
			params.ds = this.dsName;
		}
		params.operType = Newtec.DS.OperType.download;
		if(params.clientType==undefined || params.clientType==''){
			params.clientType = 'web';
		}
		this.download(Newtec.Utils.getDMIServlet(params),{params:JSON.stringify(params)})
	};
	var xhrOnProgress = function (fun) {
	       xhrOnProgress.onprogress = fun; //绑定监听
	       //使用闭包实现监听绑
	       return function () {
	           //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
	           var xhr = $.ajaxSettings.xhr();
	           //判断监听函数是否为函数
	           if (typeof xhrOnProgress.onprogress !== 'function')
	               return xhr;
	           //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
	           if (xhrOnProgress.onprogress && xhr.upload) {
	               xhr.upload.onprogress = xhrOnProgress.onprogress;
	           }
	           return xhr;
	       }
	 }
	/**
	 * 功能说明：上传文件
	 * @param params 必须包含formData,携带文件数据
	 * showProgress：true（显示进度条）
	 *  progress:{uploadIngFun:function(percent){上传过程调用，重写则不使用默认进度条，uploadIngMess:'上传过程的提示默认（正在上传中...）',finshMess:"完成提示（上传完成！）"，errorMess:"异常提示"}}
	 */
	Newtec.DS.prototype.uploadFile= function(params){
		if(Newtec.Utils.isNull(params.ds)){
			params.ds = this.dsName;
		}
		if(!params.formData){
			console.error("formData为空！！");
			return;
		}
		params.operType = Newtec.DS.OperType.upload;
		if(params.clientType==undefined || params.clientType==''){
			params.clientType = 'web';
		}
		/**
		 * 是否显示上传进度条
		 */
		if(params.showProgress||params.progress){
			var progress=params.progress||{};
			var ajaxParams=params.ajaxParams||{};
			var uploadIngFun=progress.uploadIngFun;
			if(!uploadIngFun){//
				var bar=$('<div><div class="progress" style="margin-top:10px; margin-bottom: 10px;"><div id="progress" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">60%</div></div></div>');
					bar.append("<p id='finsh'>"+(progress.uploadIngMess||"正在上传中...")+"</p>")
					var window=Newtec.Window.create({
						body:bar,title:progress.title||'下载进度',width:400,
				});
				uploadIngFun=function(percent){
					if(percent>=1){
						setTimeout(function(){
							window.close();
						},1000)
						
						var textJQ=bar.find("#finsh");
						var result=params.finsh&&params.finsh(text);
						textJQ.text(result||progress.finshMess||"上传完成！");
					}
					percent=(percent*100).toFixed(2)+"%"
					bar.find("#progress").css("width",percent);
					bar.find("#progress").text(percent)
					
				}
			}
			
			ajaxParams.xhr=xhrOnProgress(function(e){
				var percent=(e.loaded/e.total);
				uploadIngFun(percent)
				
			}),
			params.ajaxParams=ajaxParams;
			var oldCallback=params.callback;
			params.callback=function(res){
				Newtec.Utils.isFunction(oldCallback)&&oldCallback(res);
				if(res.status==0)
					Newtec.Utils.isFunction(params['success'])&&params['success'](res);
				else{
					if(!progress.uploadIngFun){
						bar.find("#finsh").text(progress.errorMess||"出现异常！"+res.error);
					}
				}
			}
		}
		this.ajax(params);
	}
	/**
	 * @author 王仕通 2016-10-13 说明：数据源查询操作
	 * params参数格式要求： {startRow:int,endRow:int,totalRow=-1,sortBy:{},select:[],
	 * callback:fun,operId='',clientType:'web',ds:'',operType='',pageId:''
	 * -------------------------这里要做处理或合并查询条件--------------------***********
	 * 查询条件支持两种；两种条件会合并
	 * 简单查询条件，用模糊匹配。如 data:{k1:v1,k2:v2};
	 * 复杂查询条件，如  datas：{operator:'and',criteria:[{fieldName:'',operator:'equals',value:''},{fieldName:'',operator:'equals',value:''}]}}
	 * 	datas：[{fieldName:'',operator:'equals',value:''},{fieldName:'',operator:'equals',value:''}]
	 * 	或单个条件， datas:{fieldName:'',operator:'equals',value:''}
	 */
	Newtec.DS.prototype.fetchData = function(params){
		try {
			if(parent.frameWinow != undefined && parent.frameWinow[this.id] != undefined){
				var pageId = Newtec.AppUtils.getFramePageId(parent.frameWinow[this.id].frameElement);
				if(!Newtec.Utils.isNull(pageId))
					params.pageId = pageId;
			}
		} catch (e) {
			console.warn(e);
		}
		
		if(!params.pageId){//默认页面id为空时，获取当前打开的页面id
			params.pageId=Newtec.app&&Newtec.app.getCrrPageId();
		}
		if(Newtec.Utils.isNull(params.ds)){
			params.ds = this.dsName;
		}
		if(params.operType==undefined || Newtec.DS.OperType[params.operType]==undefined){
			params.operType = Newtec.DS.OperType.fetch;
		}
		Newtec.Utils.setDefaultValue(params,'clientType','web');
		//Newtec.Utils.setDefaultValue(params,'totalRow',-1);
		if(params['startRow']==undefined){
			params['startRow'] = 0;
		}
		if(params['endRow']==undefined){
			params['endRow'] = 20;
		}
		if(params['totalRow']==undefined){
			params['totalRow'] = -1;
		}
		var data = params['data'];
		if(data != undefined && data==''){//修正data
			params['data']={};
		}
		var datas= params['datas'];
		if (!Newtec.Utils.isNull(datas)) {
			if(Newtec.Utils.isArray(datas)){
				var criteria=[];
				for(var i=0;i<datas.length;i++){
					criteria.push(datas[i]);
				}
				var newDatas={operator:'and',criteria:criteria};
				params['datas']=newDatas;
			}else if(Newtec.Utils.isNull(datas.criteria)){
				var newDatas={operator:'and',criteria:[datas]};
				params['datas']=newDatas;
			}
		}
		this.ajax(params);
	};
	/**
	 * 
	 * 方法说明：AJAX请求服务器端
	 * 注意参数：
	 * 	login:false表示服务器端不需要登录验证；loing:true表示服务器端需要登录验证(默认)
	 * async：true:同步
	 */
	Newtec.DS.prototype.ajax = function(params){
		//参数处理，复杂的转化
		if(params.operType == Newtec.DS.OperType.fetch){//查询操作
			if(params['data'] != undefined && params['data']['criteria'] != undefined){//复杂条件应该设置datas
				params['datas'] = params['data'];
				params['data'] = undefined;
			}
			var data = params['data'];
			for(var key in data){//空查询条件去掉
				if(Newtec.Utils.isNull(data[key])) data[key]=undefined;
			}
		}else{//非查询操作
			if(params['data'] != undefined && Newtec.Utils.isArray(params['data']) ){//复杂的条件处理
				params['datas'] = params['data'] ;
				params['data'] = undefined;
			}
		}
		var toLogion=this.toLogion;
		var appCallBack=Newtec.appCallBak;
		var that=this;
		var reloadId="reloadId_"+Newtec.project;
		var data=null;
		var formData=params.formData
		if(formData){
			formData.append("params",JSON.stringify(params))
			data=formData;
		}else{
			data={params:JSON.stringify(params)};
		}
		var ajaxParams={url:(Newtec.projectHttp||"")+Newtec.Utils.getDMIServlet(params),
				type:'POST',
				data:data,//{params:JSON.stringify(params)},
				dataType:'json',
				async: (params['async']=='false' || params['async']==false)?false:true,
				success:function(response){
					if(that.firstGo){
						that.firstGo=false;
						if(Newtec.SessionStorage.getItem(reloadId)==='false'){
							Newtec.SessionStorage.setItem(reloadId,true);
						}
					}
					if(toLogion){
						if(response.status=="-4"||(response.error&&response.error.indexOf('用户未登录')>=0))
							window.location.href="login.html";
					}
					Newtec.Utils.isFunction(appCallBack)&&appCallBack(response,params);
					var callback = params['callback'];
					if(Newtec.Utils.isFunction(callback)){
						callback(response);
						if(response.status!=0)console.error(response.error);
						return ;
					}
						
					if(response.status==0)
						Newtec.Utils.isFunction(params['success'])&&params['success'](response);
					else
						Newtec.Utils.isFunction(params['error'])?params['error'](response):Newtec.Window.hint(response.error);
					
				},error:function(res){
//					if(isTrue!=="false"){
//						Newtec.SessionStorage.setItem(reloadId,false);
						var herf=location.href
						console.info("======herf====",herf);
						if(herf&&herf.indexOf("reloadxx=1")<0){
							console.info("======herf=加载1111==");
							window.location.href=herf.indexOf("?")>=0?herf+"&reloadxx=1":herf+"?reloadxx=1"
							
						}
//					}
					Newtec.Utils.isFunction(params['exception'])&&params['exception'](res);
					console.error("network is error",res)
				}};
		if(formData){
			ajaxParams.contentType=false;  
	        ajaxParams.processData=false;
	        
		}
		var ajaxP=params.ajaxParams;
		$.extend(true,ajaxParams,ajaxP);
		if(!formData&&params.cross!==false){
			ajaxParams.crossDomain=true;
			ajaxParams.xhrFields={
				withCredentials: true
			}
		}
		
		$.ajax(ajaxParams);
	};
	Newtec.DS.prototype.relAjax=function(url,data,callback,async,cross,dataType,progressFunction){
		var toLogion=this.toLogion;
		if(Newtec.Utils.isNull(async)){
			async = true;
		}
		var ajaxParams={  
		          url: url ,  
		          type: 'POST',  
		          data: data,  
		          async: async,  
		          cache: false,  
		          contentType: false,  
		          processData: false,
		          dataType:dataType||'json',
		          success: function (res) {
		        	 console.info("==>>",res);
		        	  if(toLogion){
							if(res.status=="-4"||(res.error&&res.error.indexOf('用户未登录')>=0))
								window.location.href="login.html";
						}
		        	 !Newtec.Utils.isFunction(callback)||callback(res);
		        	 
		          },  
		          
		     }
		 if(Newtec.Utils.isFunction(progressFunction)){
			 ajaxParams.xhr=function(){
				 myXhr = $.ajaxSettings.xhr(); 
		         if(myXhr.upload){ //检查upload属性是否存在  
		            //绑定progress事件的回调函数  
	                myXhr.upload.addEventListener('progress',progressFunction, false);   
		         }  
	             return myXhr; //xhr对象返回给jQuery使用   
			 }
		 }
		if(cross!==false){
			ajaxParams.crossDomain=true;
			ajaxParams.xhrFields={
				withCredentials: true
			}
		}
		$.ajax(ajaxParams);
	};
	/**
	 * @author 王仕通 2016-10-13 说明：增加操作
	 * params参数格式要求： {callback:fun,operId='',clientType:'web',ds:'',operType='',data:{key1:value1,key2:values},login:false}
	 */
	Newtec.DS.prototype.addData = function(params){
		if(Newtec.Utils.isNull(params.ds)){
			params.ds = this.dsName;
		}
		if(params.operType==undefined || Newtec.DS.OperType[params.operType]==undefined){
			params.operType = Newtec.DS.OperType.add;
		}
		if(params.clientType==undefined || params.clientType==''){
			params.clientType = 'web';
		}
		this.ajax(params);
	}
	/**
	 * @author 王仕通 2016-10-13 说明：数据源更新操作
	 * 注意：提交想后台时,operType默认是 update
	 * params参数格式要求： {callback:fun,operId='',clientType:'web',ds:'',operType='',data:{key1:value1,key2:values},login:false} 
	 */
	Newtec.DS.prototype.updateData = function(params){
		if(Newtec.Utils.isNull(params.ds)){
			params.ds = this.dsName;
		}
		if(params.operType==undefined || Newtec.DS.OperType[params.operType]==undefined){
			params.operType = Newtec.DS.OperType.update;
		}
		if(params.clientType==undefined || params.clientType==''){
			params.clientType = 'web';
		}
		this.ajax(params);
	}
	//删除
	Newtec.DS.prototype.removeData = function(params){
		if(params.ds==undefined || params.ds==''){
			params.ds = this.dsName;
		}
		if(params.operType==undefined || Newtec.DS.OperType[params.operType]==undefined){
			params.operType = Newtec.DS.OperType.remove;
		}
		if(params.clientType==undefined || params.clientType==''){
			params.clientType = 'web';
		}
		this.ajax(params);
	}
	Newtec.DS.create = function(dsName,fields,pk){
		return new Newtec.DS(dsName,fields,pk);
	}
	/*Newtec.DS.create = function(params){
		return new Newtec.DS(params.name,params.fields);
	}*/
})()