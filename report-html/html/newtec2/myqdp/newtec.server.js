;(function(){
	// var serverUrl="http://192.168.0.42:18666/newtec2/",
	// var serverUrl="http://203.110.160.71:9001/newtec2/",
	var serverUrl="http://localhost:16690/newtec2/",
	jsPath=serverUrl+"myqdp/js/";
	var head=document.getElementsByTagName('head')[0];
	 function loadScript(js, callback) {
	        var script = document.createElement('script');
	        script.type = "text/javaScript";
	        
	        if (script.readyState) {//IE
	            script.onreadystatechange = function() {
	                if (script.readyState == "loaded"
	                        || script.readyState == "complete") {
	                    script.onreadystatechange = null;
	                    callback&&callback();
	                }
	            };
	        } else {// 其他浏览器
	            script.onload = function() {
	            	callback&&callback();
	            };
	        }
	        script.src = jsPath+js;
	        head.appendChild(script);
	    }
	 var link = document.createElement('link');
	 link.rel = "shortcut icon";
	 link.href = serverUrl+"thirdparty/favicon.ico";
	 head.appendChild(link);
	 var isReady=false;
	//优先加载jquery
	  loadScript("jquery-2.1.4.min.js",function(){
		  $.holdReady(true);//阻止$.rendy事件触发
		  Newtec.pageStatus=0;
	  	var oldNewtec=Newtec;
//	  		Newtec=undefined;
	  		loadScript("core/newtec.js",function(){
			  
		  	  for(var key in oldNewtec){
		  	  		Newtec[key]=oldNewtec[key];
		  	  }
			  Newtec.isServer=false;
			  Newtec.ServerUrl=serverUrl;
			  Newtec.jsPath=serverUrl+Newtec.jsPath
			  Newtec.cssPath=serverUrl+Newtec.cssPath
			  var arrJs=['bootstrap.min.js',
	                      "core/newtec.ds.js",
	                      "core/newtec.module.js",
	                      "widget/newtec.widget.js",
	                      "jquery.mCustomScrollbar.concat.min.js"]
			  Newtec.Utils.addJS("newtec.appParam.js","myqdp/",function(){
				  Newtec.Utils.addJS(arrJs,null,function(){
				  	if(AppParam.modules)
				  		Newtec.addModules(AppParam.modules)
					isReady=true;
					if(AppParam.preJS){
						  Newtec.Utils.addJS(AppParam.preJS,null,function(){
							  loadPageJs();
						  }) 
					}else
						  loadPageJs();
				  });
			  },true);
		  })
	  })
	  function loadPageJs(){
		  if(Newtec.Client){
			  var arr= Newtec.Client.pageJS;
			  //加载页面引入的js
				 Newtec.Utils.addJS(arr,null,function(){
					 var loadFuns=Newtec.Client.loadFuns;
					 //引入jq未加载时已经注入到$.rendy事件
					 if(Newtec.Utils.isArray(Newtec.Client.loadFuns)){
					 	$(function(){
							for(var i=0;i<loadFuns.length;i++){
								Newtec.Utils.isFunction(loadFuns[i])&&loadFuns[i]();
							}
					 	})
					 	
					 }
				 });
				 
			} else{
				//接触$.ready锁定
				 $.holdReady(true);
			}
	  }
})()