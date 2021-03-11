;(function(){
	/**
	 * js客服端引用
	 */
	if(typeof (Newtec) !='undefined' && typeof (Newtec) != undefined){
		return ;
	}
	
	var loadFuns=[];
	//兼容页面直接调用jq的页面加载方法
	$=jQuery= function(callback){
		loadFuns.push(callback);
	}
	Newtec={
			isServer:true
	};
	Newtec.Client={
		pageJS:[],
		addPageJS:function(js,src){
			this.pageJS.push({js:js,src:src})
		},
		loadFuns:loadFuns
	};
	var src="",
	version=1.0,
	// serverUrl="http://192.168.0.42:18666/newtec2/",
	// serverUrl = "http://203.110.160.71:9001/newtec2/"; 
	serverUrl = "http://localhost:16680/newtec2/"; 
	// url="http://192.168.0.42:18666/newtec/myqdp/newtec.server.js";
	serverUrl="";
	url=serverUrl+"myqdp/newtec.server.js";
	var fileref = document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src",url);
    document.getElementsByTagName("head")[0].appendChild(fileref);
	
	 function loadCSS(css) {
	        var script = document.createElement('link');
	        script.rel = "stylesheet";
	        script.href = serverUrl+"myqdp/css/"+css;
	        document.getElementsByTagName('head')[0].appendChild(script);
	    }
	 loadCSS("bootstrap.min.css");
	 loadCSS("newtec.myqdp.css");
	 loadCSS("jquery.mCustomScrollbar.min.css");
})()