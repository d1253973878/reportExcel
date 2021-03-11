

;(function(){
	
//	if(typeof (Newtec) !='undefined' && typeof (Newtec) != undefined){//
//		return ;
//	}
	Newtec ={};
	Newtec.project = window.document.location.pathname.substring(1,window.document.location.pathname.substr(1).indexOf('/')+1);
//	Newtec.myqdpServlet = '/'+Newtec.project+'/myqdp/MyQDPServlet';
//	Newtec.DMILoginServlet = '/'+Newtec.project+'/DMILoginServlet'; 
	var projectName=Newtec.project!='/'&& '/'+Newtec.project+'/'||"";
	Newtec.DMIServlet =projectName+'DMIServlet'; 
	Newtec.PageServlet = projectName+'PageServlet2'; 
	Newtec.ServerUrl="";
	Newtec.jsPath = 'myqdp/js/';
	Newtec.cssPath ='myqdp/css/';
	Newtec.version=1.0;

	Newtec.powerCurrentSelectAppId = '';//应用开发平台当前选择的应用  存取 parent.Newtec.powerCurrentSelectAppId = 'XXX'
	// base64加密开始  
    var base64KeyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"  
            + "wxyz0123456789+/" + "=";  
	/**
	 * 缓存页面加载的js和css
	 */
//标记第一次进来
	var loadJSCount=0;
	var  jsDataArr={};
	var  cssDataArr=[];
	var  loadedJs=0;
	Newtec.Utils = {
			isXX:function(f){
				return f instanceof Function;
			},
			getDMIServlet : function(jsonParam){
				//其实这里可以直接返回不需要登录的DMIServlet，因为后台DMI每个方法做了登录拦截验证
//				return Newtec.Utils.isTrue(jsonParam['login'])?Newtec.DMILoginServlet: Newtec.DMIServlet ;//
				return Newtec.Utils.isNull(jsonParam['url'])?Newtec.DMIServlet:jsonParam['url'];
			},
			getPageServlet:function(pageId){
				return Newtec.PageServlet+"?p="+pageId;
			},
			 getFieldAttr : function(attr,value,ope){
				 	ope = (Newtec.Utils.isNull(ope))? "=": ope;//
			    	if(attr=='disabled'){
			    		return (value == true || value=='true' || value==attr)?" disabled"+ope+"'disabled' ":"" ;
			    	}else if(attr=='readonly'){
			    		return (value == true || value=='true' || value==attr)?" readonly"+ope+"'true' ":"" ;
			    	}else if(attr=='checked'){
			    		return (value == true || value=='true' || value==attr)?" checked"+ope+"'checked' ":"" ;
			    	}else if(attr=='multiple'){
			    		return (value == true || value=='true' || value==attr)?" multiple"+ope+"'multiple' ":"" ;
			    	}else if(attr=='selected'){
			    		return (value == true || value=='true' || value==attr)?" selected"+ope+"'selected' ":"" ;
			    	}else if(!Newtec.Utils.isNull(value)){
			    		return " "+attr+ope+"'"+value+"' ";
			    	}else{
			    		return "";
			    	}
			    },
			/**
			 * @author 王仕通 2016-10-13 
			 * 说明：获取表单或表格字段的属性值；举列：对于增加表单的 title描述如下：add-title或 form-title 或 title 优先级依次降低
			 * field:字段的json格式 
			 * attr:需要获取的字段属性 
			 * type:需要获取的类型  增删改查表单或表格，默认是表格
			 */
			getFieldAttrValue : function(field,attr,type){
		    	if (Newtec.Utils.isNull(field) || Newtec.Utils.isNull(attr)) return '';
	    		if(type==Newtec.DS.OperType.add || type==Newtec.DS.OperType.update || type==Newtec.DS.OperType.remove || type==Newtec.DS.OperType.fetch || type=="form"){//增删
	    			var value = field[type+"-"+attr];
	    			if(value != undefined) return value;
	    			if(type !="form"){
	    				value = field["form-"+attr];
	    				if(value != undefined) return value;
	    			}
	    		}else{
	    			var value = field["table-"+attr];
	    			if(value != undefined) return value;
	    		}
	    		value = field[attr];
	    		if(value == undefined) value='';
	    		return value;
		    },
			getJqueryObj : function(obj){
				if(Newtec.Utils.isNull(obj)) return "";
				if(Newtec.Utils.isJquery(obj)){//jquery对象
					return obj;
				}else if( typeof(obj)=='string'){//字符串
					obj = obj.trim();
					if(obj.startWith("<") && obj.endWith(">")){//html文本如：<p>xxxd</p>
//						alert("obj==="+obj);
						return $(obj);
					}else{//id查找或.class查找
						if(!obj.startWith('#') && !obj.startWith('.'))obj = "#"+obj;
						var obj = $(obj);
						if(obj[0] != undefined)//找到并返回
							return obj;
					}
				}else{
					//alert('123=='+obj);
					obj = obj['newtecJQ'];
					if(Newtec.Utils.isJquery(obj)) return obj;
				}
				return "";
			},
			append : function (parent, childs) {
				var jqparent = Newtec.Utils.getJqueryObj(parent);
				if(Newtec.Utils.isNull(jqparent)) return false;
				if(childs instanceof Array){
					var len = childs.length;
					for(var i=0;i<len;i++){
						Newtec.Utils.append(jqparent,childs[i]);//数组的话采用递归调用
					}
				}else{
//					alert('childs='+childs);
					var jqchild = Newtec.Utils.getJqueryObj(childs);
//					alert(childs+"=1="+jqchild[0]);
					if(Newtec.Utils.isNull(jqchild)) return false;
					jqparent.append(jqchild);
				}
					return true; 
				},
				/**
				 * 
				 */
				appendTo : function(childs,parent){
					return Newtec.Utils.append(parent, childs);
				},
			remove:function(obj){
				obj = this.getJqueryObj(obj);
				if(!this.isNull(obj) ){
					obj.remove();
				}
			}, 
			isJquery: function(obj){
				return obj instanceof jQuery;
			},
			/**
			 * 方法说明：判断是否为Json对象
			 */
			isJson : function(obj){
				return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;    
			},
			isNewtec: function(obj){
//				return obj instanceof Newtec.Base;
				return obj['newtecJQ'] != undefined;
			},
			isDOMElement:function(obj) {
		         return !!(obj && typeof window !== 'undefined' && (obj === window || obj.nodeType));
		    },
			isString : function(obj){
				return typeof(obj)=='string';
			},
			isArray : function(obj){
//				return obj instanceof Array;
				return Object.prototype.toString.call(obj) == "[object Array]";
			},
			/*isFunction:function(obj){
				return obj instanceof Function;
			},*/
			isFunction:function(obj){
				return "function" == (typeof obj);
			},
			isNull : function(obj){
				return (obj==undefined || obj=='' || obj=='null') && (obj+'')!='0' && (obj !== false);//修正false==''
			},
			isTrue : function(obj){
				return (obj+'').trim()=='true';
			},
			isFalse : function(obj){
				return (obj+'').trim()=='false';
			},
			toInt : function(obj,defaultValue){
				obj = parseInt(obj);
				return obj+""=='NaN'?defaultValue:obj;
			},
			toFloat:function(obj,defaultValue){
				obj = parseFloat(obj);
				return obj+""=='NaN'?defaultValue:obj;
			},
			fomatFloat: function (src,pos){   
			       return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);   
			} ,
			getValue : function(value){
				return value==undefined ? "" : value;
			},
			/**
			 * 设置缺省值，如果对应属性的值为空，则设置初始值
			 */
			setDefaultValue : function(obj,attr,value){
				if(obj != null && Newtec.Utils.isNull(obj[attr])){
					obj[attr] = value;
				}
			},
			json2str : function(obj){
				return JSON.stringify(obj);//此处是jquery提供的方法
			},
			fun2str:function(obj){
				if(this.isJson(obj)){
					for ( var key in obj) {
						if(this.isJson(obj[key]))this.fun2str(obj[key]);
						else if(this.isFunction(obj[key]))obj[key]=obj[key]+"";
					}
				}else if(this.isArray(obj)){
					for ( var i = 0; i < array.length; i++) {
						this.fun2str(obj[i]);
					}
				}
				return obj;
			},
			str2json : function(str,defaut){
				if(!this.isString(str))return this.isNull(str)?str:defaut;
				if(!str.startWith("("))
					str = "("+str+")";
				try{
					str=eval(str);
				}catch(e){
//					console.warn(e);
					str=defaut;
				}
				return str;
			},
			/**
			 * @author 作者 :吴明坤
			 * @version 创建时间：2019-3-4 上午14:24:46 
			 * 方法说明：进行base64加密  
			 * @param input 需要加密的字符串
			 * @returns {String} 返回加密后的字符串
			 */
			encode64: function (input) {  
		  
		        var output = "";  
		        var chr1, chr2, chr3 = "";  
		        var enc1, enc2, enc3, enc4 = "";  
		        var i = 0;  
		        do {
		            chr1 = input.charCodeAt(i++);  
		            chr2 = input.charCodeAt(i++);  
		            chr3 = input.charCodeAt(i++);  
		            enc1 = chr1 >> 2;  
		            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
		            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
		            enc4 = chr3 & 63;  
		            if (isNaN(chr2)) {  
		                enc3 = enc4 = 64;  
		            } else if (isNaN(chr3)) {  
		                enc4 = 64;  
		            }  
		            output = output + base64KeyStr.charAt(enc1) + base64KeyStr.charAt(enc2)  
		                    + base64KeyStr.charAt(enc3) + base64KeyStr.charAt(enc4);  
		            chr1 = chr2 = chr3 = "";  
		            enc1 = enc2 = enc3 = enc4 = "";  
		        } while (i < input.length);  
		  
		        return output;  
		    },
			/**
			 * json复制，将fromJson复制到toJson中()
			 * return 合并json,相同的Key使用fromJson的值
			 */
			jsonCopy :function(fromJson,toJson){
				if(fromJson==undefined) return toJson;
				if(toJson==undefined) toJson={};
				for(var key in fromJson){
//					alert(key+"==copy=="+fromJson[key]);
//					alert(Newtec.Utils.json2str(fromJson[key]));
					toJson[key] = fromJson[key];
				}
				return toJson;
			},
			getCookie:function(name,isObject){
				var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
				if (arr = document.cookie.match(reg)){
					var value=decodeURI(arr[2]);
					if(isObject)value=Newtec.Utils.str2json(Newtec.Utils.str2json(value));
					return value;
				}
				else
					return null;
			},
			deleteCookie:function(name){
				var exp = new Date();
				exp.setTime(exp.getTime() - 1);
				var cval=this.getCookie(name);
				if(cval!=null)
				document.cookie= name + "="+cval+";expires="+exp.toGMTString();

			},
			serialize:function(obj){
				var result="";
				
				if(typeof(obj)!= "object"||obj==null){
					if (typeof obj == "string") {
                   		result  = "'"+obj.replace(/\"/g,"\\\"") + "'";
               		}else{
                   		result = obj+"";
                	}
				}else {
					if (this.isArray(obj)) {
						result+="[";
						for(var i=0;i<obj.length;i++){
							result+=i==0?this.serialize(obj[i]):","+this.serialize(obj[i]);
						}
						result+="]\n";
					}else{
						for(var key in obj){
							result+=result==""?"{'"+key+"':"+this.serialize(obj[key]):",'"+key+"':"+this.serialize(obj[key]);
						}
						result+="}\n";
					}
				}
				return result;
			},
			setCookie:function(name,value,time){
				var strsec = getsec(time);
				var exp = new Date();
				exp.setTime(exp.getTime() + strsec*1);
				document.cookie = name + "="+ encodeURI(value) + ";expires=" + exp.toGMTString();
			},
			/**
			 *比较两个Json对象是否相等
			 */
			compareJson : function(objA, objB) {
				if(!Newtec.Utils.isJson(objA) || !Newtec.Utils.isJson(objB)) return false; //判断类型是否正确
				var getLength = function(object) {
					var count = 0;
					for(var i in object) count++;
					return count;
				}
				if(getLength(objA) != getLength(objB)) return false; //判断长度是否一致
				var compareObj = function(objA, objB,flag){
					for(var key in objA) {
						if(!flag) //跳出整个循环
							break;
						if(!objB.hasOwnProperty(key)) {
							flag = false;
							break;
						}
						if(!Newtec.Utils.isArray(objA[key])) { //子级不是数组时,比较属性值
							if(objB[key] != objA[key]) {
								flag = false;
								break;
							}
						} else {
							if(!Newtec.Utils.isArray(objB[key])) {
								flag = false;
								break;
							}
							var oA = objA[key],
								oB = objB[key];
							if(oA.length != oB.length) {
								flag = false;
								break;
							}
							for(var k in oA) {
								if(!flag) //这里跳出循环是为了不让递归继续
									break;
								flag = CompareObj(oA[k], oB[k], flag);
							}
						}
					}
					return flag;
				}
				return compareObj(objA,objB,true);

			},
			getId : function(id){
				return (id==undefined || id=='')? "":" id='"+id+"' ";
			},
			uuid16 : function(){
				return Newtec.Utils.uuid(16);
			},
			uuid : function(len) {
				return Newtec.Utils.uuid(len,16);
			},
			/**
			 * 产生唯一的随机数
			 * //	// 8 character ID (base=2)
//			uuid(8, 2)  //  "01001010"
//			// 8 character ID (base=10)
//			uuid(8, 10) // "47473046"
//			// 8 character ID (base=16)
//			uuid(8, 16) // "098F4D35"
			 */
			 uuid : function(len, radix) {
			    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			    var uuid = [], i;
			    radix = radix || chars.length;
			    if (len) {
			      // Compact form
			      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
			    } else {
			      // rfc4122, version 4 form
			      var r;
			      // rfc4122 requires these characters
			      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			      uuid[14] = '4';
			      // Fill in random data.  At i==19 set the high bits of clock sequence as
			      // per rfc4122, sec. 4.1.5
			      for (i = 0; i < 36; i++) {
			        if (!uuid[i]) {
			          r = 0 | Math.random()*16;
			          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			        }
			      }
			    }
			    return uuid.join('');
			},
			getAttrAndValue : function(params,attr){
				var value = params[attr];
				if(value != undefined && value != '')
					return attr+":"+value;
				return "";
			},
			isServer:function(src){
				src=src.trim()
				//console.error(f+"=dddddddddddd=isServer=="+src)
				return src.indexOf("myqdp/")==0||(src.indexOf("thirdparty/")==0&&src.indexOf("thirdparty/css"));
			},
			addCSS : function(css,src){
				if(Newtec.Utils.isNull(css))return;
				if(Newtec.Utils.isNull(src))src=Newtec.cssPath;
				else{src=this.isServer(src)&&(Newtec.ServerUrl+src)||src};
				if(Newtec.Utils.isArray(css)){
					var len = css.length;
					for(var i=0;i<len;i++){
						var cOject=css[i];
						if(Newtec.Utils.isJson(cOject))
								this.addCSS(cOject.css,cOject.src||src);
						else
								this.addCSS(cOject,src);
					}
				}else{
					src=src+css;
					if(cssDataArr.contains(src)){
							console.warn("===改css已经加载=【"+(src)+"】")
							return;
					}
					cssDataArr.push(src);
					var ss = css.split("/")
					$('head').append("<link rel='stylesheet' href='"+src+"' />");
					cssDataArr.push(src)
				}
			},
			/**
			 * 动态架子啊js
			 */
				addJS : function(js,src,callback,isLocal){
					if(Newtec.Utils.isNull(js))return;
//					console.info("=addJS==>>>",js,src,callback,isLocal)
					if(Newtec.Utils.isJson(js)){
						console.info((Newtec.Utils.isFunction(src)&&src))
						callback=(Newtec.Utils.isFunction(src)&&src)||callback||js.callback
						src=js.src
						isLocal=js.isLocal
						js=js.js;
					}else{
						if(Newtec.Utils.isFunction(src)){
							isLocal=callback;
							callback=src;src=null;
						}
					}
//					console.info("=addJS2111==>>>",js,src,callback,isLocal)
					if(Newtec.Utils.isNull(src))src=Newtec.jsPath;
					else if(!isLocal) {src=this.isServer(src)&&(Newtec.ServerUrl+src)||src}
					if(Newtec.Utils.isArray(js)){//数组进行异步加载
						var len = js.length;
							var i=0;
							var that=this;
							function addJsTest(){//自定义回调递归
								// console.info(len+"=addJsTest===="+i);
								if(i<len){
										var crrJs=js[i];
										i++;
										if(Newtec.Utils.isJson(crrJs))
												that.addJS(crrJs.js,crrJs.src,addJsTest);
										else
												that.addJS(crrJs,src,addJsTest);
								}else{
									callback&&callback()
								}
								
							}
							addJsTest();
					}else{//单个模式
//						var jsId = "js_"+js.substring(0,js.indexOf("."));
						if(moduleMap[js]){//如果是模块
							Newtec.Utils.addModule(js,callback);
							return;
						}
						src=src+js
						//
						if(jsDataArr[src]){
								
								if(jsDataArr[src].isCall){
//									console.warn("=重复引入==已加载=【"+(src)+"】")
									callback&&callback()
								}else{
//									console.warn("=重复引入==进入等待队列=【"+(src)+"】")
									jsDataArr[src].callbacks.push(callback);
								}
								return;
						}
						loadJSCount++;
						var script = document.createElement('script');
						script.type = "text/javaScript";
						var callJson={
								isCall:false,
								callbacks:[callback],
								call:function(){
									loadJSCount--;
									this.isCall=true;
									loadedJs++;
									var callbacks=this.callbacks;
									for(var i=0;i<callbacks.length;i++){
										callbacks[i]&&callbacks[i]();
									}
									if(loadJSCount==0){
										Newtec.ready();
									}
								}
						}
						jsDataArr[src]=callJson;
						
						if (script.readyState) {//IE
							script.onreadystatechange = function() {
									if (script.readyState == "loaded"
													|| script.readyState == "complete") {
											script.onreadystatechange = null;
//											console.info("=callback==>>>")
											callJson.call();
									}
							};
						} else {//其他浏览器
							script.onload = function() {
//								console.info("=callback==>>>",js)
								callJson.call();
							};
						}
						
						script.src = src;
						document.getElementsByTagName('head')[0].appendChild(script);
						
					}
				
			},
			/**
			 * 功能：模块引入，通过模块名引入js
			 * @param {Object} moduleName
			 * @param {Object} callback
			 */
			addModule : function(moduleName,callback){
				if(Newtec.Utils.isArray(moduleName)){
					var len = moduleName.length;
					var i=0;
					var that=this;
					function addModuleCall_(){//自定义回调递归
						if(i<len){
							var mName=moduleName[i];
							console.info(i+"=addModuleCall_===mName=",mName);
							i++;
							that.addModule(mName,addModuleCall_);
						}else{
							callback&&callback();
						}
						
					}
					addModuleCall_();
				}else{
					if(moduleAloaded[moduleName]){
						callback&&callback()
						return;
					};
					var js=moduleMap[moduleName];
					if(js)
						this.addJS(js)
					else{
						if(Newtec.Utils.isJson(moduleName)||moduleName.lastIndexOf(".js")>0){
							Newtec.Utils.addJS(moduleName,callback)
							return;
						}else{
							console.error("找不到指定模块【"+moduleName+"】")
						}
						
					}
						
					callback&&Newtec.Module(moduleName,callback)
				}
			},
			/**
			 * 处理特殊字符
			 */
			dealLikeSpChart:function(str){
				return str&&str.replace(/%/g,'/%').replace(/_/g,'/_')||"";
			},
			addStyle:function(style){
				if(Newtec.Utils.isArray(style)){
					var len = style.length;
					for(var i=0;i<len;i++){
						addCSS(style[i]);
					}
				}else{
					var obj=$('style');
					if(obj[0]==undefined||obj[0]==null){
						obj = $('<style type="text/css"></style>');
						$('head').prepend(obj);
					}
					obj.prepend(style);
				}
			},
			getCurrentScript: function(){
			    //取得正在解析的script节点
				var DOC = document;
			    if(DOC.currentScript) { //firefox 4+
			        return DOC.currentScript.src;
			    }

			    // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
			    var stack;
			    try {
			        a.b.c(); //强制报错,以便捕获e.stack
			    } catch(e) {//safari的错误对象只有line,sourceId,sourceURL
			        stack = e.stack;
			        if(!stack && window.opera){
			            //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
			            stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
			        }
			    }
			    if(stack) {
			        /**e.stack最后一行在所有支持的浏览器大致如下:
			        *chrome23:
			        * at http://113.93.50.63/data.js:4:1
			        *firefox17:
			        *@http://113.93.50.63/query.js:4
			        *opera12:
			        *@http://113.93.50.63/data.js:4
			        *IE10:
			        *  at Global code (http://113.93.50.63/data.js:4:1)
			        */
			        stack = stack.split( /[@ ]/g).pop();//取得最后一行,最后一个空格或@之后的部分
			        stack = stack[0] == "(" ? stack.slice(1,-1) : stack;
			        return stack.replace(/(:\d+)?:\d+$/i, "");//去掉行号与或许存在的出错字符起始位置
			    }
			    var nodes = head.getElementsByTagName("script"); //只在head标签中寻找
			    for(var i = 0, node; node = nodes[i++];) {
			        if(node.readyState === "interactive") {
			            return node.className = node.src;
			        }
			    }
			},
			setCookie:function(name,value,seconds){
				var exdate=new Date();
				exdate.setSeconds(exdate.getSeconds()+expiredays);
				document.cookie=name+ "=" +escape(value)+
				((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
			},
			getCoolie:function(name){
				if (document.cookie.length>0){
					c_start=document.cookie.indexOf(name + "=");
					if (c_start!=-1)
					{ 
						c_start=c_start + name.length+1 ;
						c_end=document.cookie.indexOf(";",c_start);
						if (c_end==-1) c_end=document.cookie.length;
						return unescape(document.cookie.substring(c_start,c_end));
					} 
				}
				return "";
			},
			getUrlParams:function(){
//				console.info(decodeURI(window.location.search));
				var params=decodeURI(window.location.search).substring(1).split("&");
				var data={};
				for ( var i = 0; i < params.length; i++) {
					var p=params[i];
					 if(Newtec.Utils.isNull(p))continue;
					 p=p.split("=");
					 data[p[0]]=p[1];
				}
				return data;
			},
			isChinese: function CheckChinese(obj){     
				return new RegExp("[\\u4E00-\\u9FFF]+","g").test(obj);
			},
			getBeforMonth:function(beforMonth,newDate,toSecond){
				    beforMonth=this.isNull(beforMonth)?0:beforMonth;
				    var resultDate,year,month,date,hms="";
				    var currDate = new Date();
				    year = currDate.getFullYear();
				    month = currDate.getMonth()+1;
				    date = this.isNull(newDate)? currDate.getDate():newDate;
				   
				    if(beforMonth>12){
				    	year-=this.toInt(beforMonth/12,0);
				    	beforMonth=beforMonth%12;
				    }
				    month-=beforMonth;
				    if(month<=0){
				    	month+=12;
				    	year-=1;
				    }
				    month = (month < 10) ? ('0' + month) : month;
				    date=date<10?('0' + date) : date;
				    if(toSecond)
				    	 hms = currDate.getHours() + ':' + currDate.getMinutes() + ':' + (currDate.getSeconds() < 10 ? '0'+currDate.getSeconds() : currDate.getSeconds());
				    resultDate = year + '-'+month+'-'+date+' ' + hms;
				  return resultDate;

			},
			addDate: function (date,days){ 
		       var d=new Date(date); 
		       d.setDate(d.getDate()+days); 
		       var m=d.getMonth()+1; 
		       return d.getFullYear()+'-'+m+'-'+d.getDate(); 
			}
			,compareDate:function(d1,d2){
				  return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
			},
			date2week:function(riqi){
				var arys1= new Array();  
				var week=['星期天','星期一','星期二','星期三','星期四','星期五','星期六']
			    arys1=riqi.split('-');     //日期为输入日期，格式为 2013-3-10
			    var ssdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);   
			    var int=ssdate.getDay();
			    console.info("---date2week-->>"+int)
			    return week[int];
			},
			setThousandchart:function(num){
				return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
			} 
	};
	Newtec.SessionStorage={
			setItem:function(key,value){
				if(typeof(value) == "object")
					value=Newtec.Utils.serialize(value);
				try{
					sessionStorage.setItem(key,value);
				}catch(e){
					alert(e.message);
				}
			},
			/**
			 * 
			 * @param key
			 * @param arrayOrJson:不传此参数默认value为字符串,false:数组;true:json对象
			 */
		    getItem:function(key,isObject){
		    	var value=0;
		    	try{
		    		value=sessionStorage.getItem(key);
		    	}catch(e){
		    		alert(e.message);
		    	}
		    	if(typeof(value) == "object")
					value=Newtec.Utils.serialize(value);
		    	if(isObject)value=Newtec.Utils.str2json(value);
		    	return value;
		    },
		    removeItem:function(key){
		    	if(Newtec.Utils.isArray(key)){
		    		for ( var i = 0; i < array.length; i++) {
		    			sessionStorage.removeItem(key[i]);
					}
		    	}else{
		    		sessionStorage.removeItem(key);
		    	}
		    },
		    clear:function(){
		    	sessionStorage.clear();
		    }
	};
	Newtec.LocalStorage={
			setItem:function(key,value){
				if(typeof(value) == "object")
					value=Newtec.Utils.serialize(value);
				localStorage.setItem(key,value);
			},
			/**
			 * 
			 * @param key
			 * @param arrayOrJson:不传此参数默认value为字符串,false:数组;true:json对象
			 */
		    getItem:function(key,isObject){
		    	var value=localStorage.getItem(key);
//		    	if(key=='treeArray')console.info("=treeArray=="+value)
		    	if(isObject)value=Newtec.Utils.str2json(value);
		    	return value;
		    },
		    removeItem:function(key){
		    	if(Newtec.Utils.isArray(key)){
		    		for ( var i = 0; i < array.length; i++) {
		    			localStorage.removeItem(key[i]);
					}
		    	}else{
		    		localStorage.removeItem(key);
		    	}
		    },
		    clear:function(){
		    	localStorage.clear();
		    }
	};
	Newtec.Person = {
			get:function(){return  parent.Newtec.person;}
		,getPage:function(){ return Newtec.Person.get().pages[Newtec.AppUtils.getFramePageId()];}
		,getButton:function(){
			var page = Newtec.Person.getPage();
//			alert("页面："+Newtec.Utils.json2str(page));
//			alert("列表："+Newtec.Utils.json2str(page['listFields']));
//			alert("表单："+Newtec.Utils.json2str(page['formFields']));
//			alert("查询："+Newtec.Utils.json2str(page['searchFields']));
//			alert("杭集："+Newtec.Utils.json2str(page['rowFilterSchemes']));
			if(page==undefined||page['buttons']==undefined) return ;
		    var btns = page['buttons'];
		   var btnMap = {};
		    var len = btns.length;
		    for(var i=0;i<len;i++){//
		    	var btn = btns[i];
		    	btnMap[btn.buttonId]=btn;
		    }
		    return btnMap;
		},
		/**
		 * 方法说明：获取用户权限的列表字段，必须包含在数据源范围内
		 * @param ds 数据源字段不提供时，直接返回空
		 */
		/*getListField:function(ds){
			if(ds==undefined) return [];
			var dsFields = ds['fields'];
			if(dsFields==undefined || dsFields.length<=0) return [];
			var page = Newtec.Person.getPage();
			var listFields = page['listFields'][ds.dsName+"_list_id"];
			if(listFields==undefined || listFields.length<=0) return [];
			var listFieldJson = {};//收集数据库中的字段名称值文本
			var len = listFields.length;
			for(i=0;i<len;i++){
				var listField = listFields[i];
				listFieldJson[listField["listColumnSign"]]= listField["listColumn"];
			}
			var fields = [];
			len = dsFields.length;
			for(i=0;i<len;i++){
				var dsField = dsFields[i];
				var title = listFieldJson[dsField['name']];
				if(title==undefined) continue;
				var newJson = {};
				Newtec.Utils.jsonCopy(dsField,newJson);
				newJson['title'] = title;
				fields.push(newJson);
			}
			return fields;
		},*/
		getPowerField:function(dsFields,type,typeKey,nameField,titleField){
			if(dsFields==undefined || dsFields.length<=0) return [];
			var page = Newtec.Person.getPage();
			if(!page||!page[type])return [];
			var listFields = page[type][typeKey];
			console.log("getPowerField===",page);
			console.log(dsFields);
			console.log(type);
			console.log(typeKey);
			console.log(page);
			if(listFields==undefined || listFields.length<=0) return [];
			var listFieldJson = {};//收集数据库中的字段名称值文本
			var len = listFields.length;
			for(i=0;i<len;i++){
				var listField = listFields[i];
				listFieldJson[listField[nameField]]= listField[titleField];
			}
			var fields = [];
			len = dsFields.length;
//			window.alert("listFieldJson=="+Newtec.Utils.json2str(listFieldJson));
			for(i=0;i<len;i++){
				var dsField = dsFields[i];
				var title = listFieldJson[dsField['name']];
				if(title==undefined) continue;
				var newJson = {};
				Newtec.Utils.jsonCopy(dsField,newJson);
				newJson['title'] = title;
				fields.push(newJson);
			}
			return fields;
		}
		,getPowerAppId:function(){
			return Newtec.Person.get().powerAppId;
		}
		,setPowerAppId:function(powerAppId){
			Newtec.Person.get().powerAppId = powerAppId;
		}
	};
	Newtec.AppUtils ={
			/**
			 * 获得Iframe对象的PageId(必须要在子页面iframe调用这个方法)
			 * @returns
			 */
			getFramePageId:function(frame){
				if(frame==undefined)
					frame = Newtec.AppUtils.getFrameObj();
				if(frame==null || frame==undefined) return "";
				var frameJQ = $(frame);
				var frameName = frameJQ.attr('name');
				frameName = frameName.split("_")[1];
				if('page'==frameJQ.data('type')){//,如果iframe中存在data-type='page',则iframe中放的是页面Id
					return frameName;
				}else{
					return parent.Newtec.person.app.nodeMap[frameName]['pageId'];
				}
				
//				return $('iframe').data('id');
			},
			/**
			 * 获得Iframe对象不包括里面的html(必须要在子页面iframe调用这个方法)
			 * @returns
			 */
			getFrameObj:function(){
				 return window.frameElement;
			},
			/**
			 * 获得Iframe窗口 包括里面的html页面
			 * @returns
			 */
			getFrameWin:function(frameName){
//				var frame = Newtec.AppUtils.getFrameObj();
//				if(frame !=undefined)
				if(frameName != undefined)
					return parent.window.frames[frameName];
			}
	};
	Newtec.Base = function(type){
		var tt=1;
//		this.defaults = {};
		if(Newtec.Utils.isNull(type)){
			alert("控件的类型没有指定,new Newtec.Base(type)需要设置类型参数！");
		}else 
			this.type = type;
	};
	var domStyle={
		maxHeight:'max-height',
		minHeight:'min-height',
		//**边距
		marginL:'margin-left',
		marginR:'margin-right',
		marginT:'margin-top',
		marginB:'margin-bottom',
		paddingL:'padding-left',
		paddingR:'padding-right',
		paddingT:'padding-top',
		paddingB:'padding-bottom',
		//**字体
		fontSize:'font-size',
		fontStyle:'font-style',
		lineHeight:'line-height',
		fontWeight:'font-weight',
		textAlign:"text-align",
		//**背景属性
		bgColor:'background-color',
		bgImage:'backgroundImage',
		borderColor:"border-color",
		//border
		borderL:'border-left',
		borderR:'border-rigth',
		borderT:'border-top',
		borderB:'border-bottom',
	}
	var parentStyle=['width','height','float','display'];
	var pSLen=parentStyle.length;
	Newtec.Base.prototype = {
			id:'动态Id',//控件Id
			type:'',//控件类型
			newtecJQ:'jqObject',//控件jquery对象createNewtecJQ调用
			space1:0,//前间距
			space2:0,//后边距
//			scroll:false,//细滚动条
			callFinsh:true,
			/**
			 * 创建控件Jquery对象
			 */
			createNewtecJQ:function(params){},
			finsh:function(params){},
			toFinsh:function(params){
				if(this.callFinsh){
					this.finsh(params);
					var finshFun = params['finsh'];
					if(finshFun != undefined){
						finshFun(this,params);
					}
				}
			},
			initParams:function(params){},
			init:function(params){
				if(this.type==undefined || ""==this.type){
					alert("控件的类型没有指定！");
					return ;
				}
				if(Newtec.Utils.isNull(params)) params = {};
				this.initParams(params);
//				$.extend(this.defaults,params);params-->this.defaults//浅度
//				console.info("==<<>>>",params);
//				$.extend(true,this.defaults,params);//params-->this.defaults//深度
//				this.defaults = $.extend({},this.defaults,params);
				params=this.copyParams(params);
//				$.extend(true,this.defaults,params);
//				params=this.defaults;
		    	//alert(1+"=="+Newtec.Utils.json2str(this.defaults));
				this.id = Newtec.Utils.isNull(params['id']) ? this.type+"_"+Newtec.Utils.uuid(16) : params['id'];
				params['id'] = this.id;
				this.newtecJQ = this.createNewtecJQ(params);
				if(!Newtec.Utils.isJquery(this.newtecJQ)){
					alert(this.type+"类型的控件的createNewtecJQ方法需要实现返回Jquery对象！");
					return this;
				}
				var space = Newtec.Utils.toInt(params['space1'], -99);
				if(space>0){
					Newtec.Utils.appendTo("<div class='space-"+space+"'></div>", params["appendTo"]);
				}
//				Newtec.Utils.appendTo(this.newtecJQ, params["appendTo"]);
				Newtec.Utils.appendTo(this.newtecJQ, this.finAppendToJQ(params));
				space = Newtec.Utils.toInt(params['space2'], -99);
				if(space>0){
					Newtec.Utils.appendTo("<div class='space-"+space+"'></div>", params["appendTo"]);
				}
				this.toFinsh(params);
//				if(params.scroll){
//					 this.newtecJQ.mCustomScrollbar({//设置滚动条
//					 	theme: "minimal-dark"
//					 });
//				}
				return this;
			}
			,finAppendToJQ:function(params){
				return params["appendTo"];
			}
			,copyParams:function(params){
				return $.extend(true,this.defaults,params);
			}
			,styleJson2Str:function(styleJson){//json转成style样式字符串，自动替换特殊名称
				if(!Newtec.Utils.isJson(styleJson))return "";
				var style="";
				for(var key in styleJson){
					var value =styleJson[key];
					if(!Newtec.Utils.isString(value)&&isNaN(value)||value===null)continue;
					key=domStyle[key]||key;
					value=!isNaN(value)&&!(key.indexOf("weight")>=0||key.indexOf("index")>=0||key.indexOf("opacity")>=0)&&value+"px"||value;
					style+=key+":"+value+";";
				}
				return style;
			}
			//属性移除
			,removeParentStyle:function(domStyle){//必须定义在父布局才生效的样式
				if(!Newtec.Utils.isJson(domStyle))return "";
				var style={};
				for(var i=0;i<pSLen;i++){
					var key=parentStyle[i]
					if(domStyle[key]){
						style[key]=domStyle[key];
						delete domStyle[key];
					}
				}
				return this.styleJson2Str(style)
			},
			//组件隐藏
			hidden:function(){
				this.newtecJQ.addClass("newtec-hidden");
			},
			//组件显示
			show:function(){
				this.newtecJQ.removeClass("newtec-hidden");
			}
			
	};
	/**
	 * 吴明坤------2019-05-27----begin----
	 * 方法说明：组件创建申明
	 * @param js 组件需要提前引入的js
	 * @param css 组件需要引入的css
	 * @param callback 构建组件核心逻辑函数
	 */
	var addCount=0,callbackArr=[];
	Newtec.Component=function(module,css,callback){
		if(Newtec.Utils.isFunction(module)){
				callback=module;
				css=null;module=null;
		}
		if(Newtec.Utils.isFunction(css)){
				callback=css;
				css=null;
		}
		addCount++;
		css&&Newtec.Utils.addCSS(css);
		Newtec.Utils.addModule(module,function(){
			console.info("模块加载完毕！！")
			callback&&callback()
		})
	}
	var moduleAloaded={},moduleCall={};
	/**
	 * 功能说明：初始化模块或者给模块添加回调函数
	 * @param {Object} module 模块名
	 * @param {Object} callback 回调函数，不为空则为模块添加回调函数，为空则模块初始化完成
	 */
	var moduleMap={};
	/**
	  * 自定义模块导入
	  * @param {Object} modules 各类模块
	  */ 
	Newtec.addModules=function(modules){
		for(var i=0,len=modules.length;i<len;i++){
			var md=modules[i];
			if(moduleMap[md.name]){
				console.info("moduleMap",moduleMap,md)
				console.error(i+"模块名已经被占用【"+md.name+"】")
				return;
			}else{
				moduleMap[md.name]=md.js;
			}
		}
	}
	Newtec.Module=function(module,callback){
//		console.warn("==ModuleModule=>>>",module,callback)
		if(Newtec.Utils.isFunction(callback)){//为模块添加回调
			if(moduleAloaded[module]){
				callback();
			}else{
				if(!moduleCall[module])moduleCall[module]=[];
				moduleCall[module].push(callback)
			}
		}else{
			if(moduleAloaded[module]){
				console.error("该模块已经被加载，检查是否出现重名加载【"+module+"】")
				return;
			}
			console.info("已加载模块==："+module)
			moduleAloaded[module]=1;//标记模块已经初始化
			
			if(moduleCall[module]){
				var arr=moduleCall[module];
				for(var i=0,len=arr.length;i<len;i++){
					arr[i]();
				}
				delete moduleCall[module];
			}
			isCallBack();//检查页面的js是否加载完成
		}
	}
	/**
	 * 记录页面加载函数
	 */
	var readyCalls=[];
	Newtec.ready=function(callback){
		console.warn("Newtec.ready：",callback)
		if(Newtec.pageStatus==2){
			callback&&callback();
			readyCalls=null;
			return;
		}
		callback&&readyCalls.push(callback);
		console.info("==>>>",addCount,loadJSCount)
		console.info("===还在等待加载的模块：===",moduleCall);
		if(addCount||loadJSCount)return;//Component优先级别加载，必须等到其记载完毕
		setTimeout(function(){
			if(addCount||loadJSCount){//有人还在加载，继续等待
				Newtec.ready();
			}else{
				runCall();
			}
			
		},5)
		
	}
	//运行页面加载的方法
	var runCall=function(){
			if(Newtec.pageStatus==2)return;
			console.info("===页面加载完毕===",readyCalls.length);
			console.info("===剩下Component加载的js有==="+addCount); 
			console.info("===剩下加载的js有==="+loadJSCount);
			console.info("===还在等待加载的模块：===",moduleCall);
			for(var i=0;i<readyCalls.length;i++){
				console.info(readyCalls[i])
					readyCalls[i]&&readyCalls[i]();
			}
			$.holdReady(false);
			readyCalls=null;
			Newtec.pageStatus=2;
	}

	function isCallBack(){
			addCount--;
			addCount=addCount<0?0:addCount;
			if(addCount==0){
				for(var i=callbackArr.length-1;i>=0;i--){
						Newtec.Utils.isFunction(callbackArr[i])&&callbackArr[i]();
				}
				callbackArr=[];
				Newtec.ready();
			}
			
	}
	function _toCopy(toConPyObj,params){
		var Utils=Newtec.Utils;
		if(Utils.isArray(params)){
			toConPyObj=Utils.isArray(toConPyObj)?toConPyObj:[];
			for (var i = 1,len=params.length,tagP=params[0]; i <= len; tagP=params[i++]) {
				if(Utils.isJson(tagP)&&!(Utils.isJquery(tagP)||Utils.isNewtec(tagP)||Utils.isDOMElement(tagP))){
					toConPyObj.push(_toCopy(tagP,{}));
				}else if(Utils.isArray(tagP)){
					toConPyObj.push(_toCopy(tagP,[]));
				}else{
					toConPyObj.push(tagP);
				}
			}
		}else{
			for(var key in params){
				var tagP=params[key];
				
				if(Utils.isJson(tagP)&&!(Utils.isJquery(tagP)||Utils.isNewtec(tagP)||Utils.isDOMElement(tagP))){
					toConPyObj[key]=_toCopy(tagP,{});
				}else if(Utils.isArray(tagP)){
					toConPyObj[key]=_toCopy(tagP,[]);
				}else{
					toConPyObj[key]=tagP;
				}
				
			}
		}
		return toConPyObj;
	}
	Newtec.Utils.toCopy=_toCopy;
	/**字符串扩展方法开始---------------------------------------*/
	String.prototype.endWith = function(str) {
		if (str == null || str == "" || this.length == 0
				|| str.length > this.length)
			return false;
		if (this.substring(this.length - str.length) == str)
			return true;
		else
			return false;
		return true;
	}
	String.prototype.replaceAll = function(find,repla){
		var exp = new RegExp(find,"g");
		return this.replace(exp,repla);
	}

	String.prototype.startWith = function(str) {
		if (str == null || str == "" || this.length == 0
				|| str.length > this.length)
			return false;
		if (this.substr(0, str.length) == str)
			return true;
		else
			return false;
		return true;
	}
	String.prototype.startWithIgnoreCase = function(str) {
		if(this.toLocaleLowerCase().indexOf(str.toLocaleLowerCase()) == 0)
			return true;
		else return false;
	}
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
	String.prototype.hintMethodArray = function() {
		var all = this.split('|');
		var result = [];
		for(var i=0;i< all.length;i++){
			if(all[i].trim() !='')
				result.push("."+all[i]+";");
		}
		return result;
	}
	/**
	 * 字符不能为空并且只能由 0到9 a到z 下划线组成
	 * 
	 */
	 String.prototype.isVarName = function() {
		var re = /^[_0-9a-zA-Z]{0,20}$/
		if (!re.test(this.trim())) {
//			alert("对不起,输入的字符不能为空并且只能由 0到9 a到z 下划线组成! ");
			return false;
		}else
			return true;
	}

	/*
	 * =========================================== //转换成日期
	 * ===========================================
	 */
	String.prototype.toDate = function() {
		try {
			return new Date(this.replace(/-/g, "\/"));
		} catch (e) {
			return null;
		}
	}
	/**字符串扩展方法结束---------------------------------------*/
	/**数组扩展方法开始---------------------------------------*/
		/**
		 * @author 王仕通 2016-10-14 说明：在数组中指定位置之后插入数组或元素
		 * index:插入指定的位置；位置不指定或小于0时候插入在开头；index大于原数组长度时候插入之后
		 * arrays:被插入的数组或元素
		 */
		Array.prototype.insert = function (obj, index) {
			index = Newtec.Utils.toInt(index, 0);
			index = (index>this.length)? this.length : index;
			if(Newtec.Utils.isArray(obj)){
				var len = obj.length;
				for(var i=0;i<len;i++){
					this.splice(index++, 0, obj[i]);
				}
			}else
				this.splice(index, 0, obj);
		};
		Array.prototype.unique=function()
		{
			var a={};
			for(var i=0;i<this.length;i++){
				if(typeof a[this[i]]=="undefined")
					a[this[i]]=1;
				}
			this.length=0;
			for(var i in a)
				this[this.length]=i;
			return this;
		}
	/**
	 * 数组中是否存在元素
	 */
	Array.prototype.contains = function (element) { 
			for (var i = 0; i < this.length; i++) { 
				if (this[i] == element) { 
					return true; 
				} 
			} 
			return false; 
		}
	Array.prototype.addUnique = function (element) { 
		if(!this.contains(element))
			this.push(element);
	},
	/**
	 * @author 王仕通 2016-10-14 说明：数组中增加另一个数组
	 */
	Array.prototype.pushs = function(array2){
		Array.prototype.push.apply(this, array2);
	},
	/**
	 * 在一个升序的数组中加入一个元素仍升序
	 * @param {Object} element
	 */
	Array.prototype.pushSort1 = function(element){
		this.push(element);
		for(var i=this.length-1;i>0;i--){
			if(this[i]<this[i-1]){
				var temp = this[i];
				this[i] = this[i-1];
				this[i-1] = temp;
			}else{
				break;
			}
		}
	},
	/**
	 * 在一个降序的数组中加入一个元素扔降序
	 * @param {Object} element
	 */
	Array.prototype.pushSort2 = function(element){
		this.push(element);
		for(var i=this.length-1;i>0;i--){
			if(this[i]>this[i-1]){
				var temp = this[i];
				this[i] = this[i-1];
				this[i-1] = temp;
			}else{
				break;
			}
		}
	}
	 Array.prototype.indexOf = function(val) {
	            for (var i = 0; i < this.length; i++) {
	                if (this[i] == val) return i;
	            }
	            return -1;
	        };
	/**
	 * 删除数组中的某个元素
	 * @param {Object} val
	 * @memberOf {TypeName} 
	 */
	Array.prototype.remove = function(val) {
	     var index = this.indexOf(val);
	     if (index > -1) {
	      	return this.splice(index, 1);//删除数组中index索引的一个元素
	     }
	};
	
	/**
	 * 删除数组中的子数组
	 * @param {Object} a
	 * @memberOf {TypeName} 
	 */
	Array.prototype.removes = function(a) {
	    for(var i=0;i<a.length;i++)
	    	this.remove(a[i]);
	};
	/**
	 * 克隆数组
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	Array.prototype.clone=function(){ 
	    var a=[]; 
	    for(var i=0,l=this.length;i<l;i++) 
	        a.push(this[i]); 
	    return a; 
	}

	/**数组扩展方法结束---------------------------------------*/
	
	/**函数扩展方法开始---------------------------------------*/
	/**
	 * 继承父亲
	 * type：类型
	 */
	 Function.prototype.exte = function(parent,type,js,url){
			
		 if(type==undefined ){
			 var c = new this();
			 if(c.defaults != undefined)
				 type = c.defaults.type;
		 }
		 this.prototype = new parent(type);
		 if(type != undefined){
			 if(Newtec.funcType==undefined)Newtec.funcType = {};
			 if(Newtec.funcType[type]){
				 console.error("该类型【"+type+"】已经存在,请修改type名称!!");
				 return ;
			 }
			 Newtec.funcType[type] = this;//根据类别type缓存组件类在Newtec.funcType中
//			 alert('进来：'+Newtec.funcType);
			 this.prototype.type = type; 
		 }
//		 this.prototype.parent = parent;
		 //给每个组件类增加静态方法 create(定义成一个参数的数组可能更好，因为参数根据不同的组件封装，参数个数是可变的)
		 this.create = function(json,form){
			 json=json||{};
			 return new this(json,form).init(json,form);
		 }
	 }
	 
	 /**
	  * 重写
	  */
	 Function.prototype.over = function(json){
		 for(var key in json){
			 this.prototype[key] = json[key];
		 }
	 }
	/**函数扩展方法结束---------------------------------------*/
	 /**时间扩展方法开始---------------------------------------*/
	 Date.prototype.Format = function (fmt) { //author: meizz
		 fmt = fmt||"yyyy/MM/dd";
		 var o = {
		 "M+": this.getMonth() + 1, //月份
		 "d+": this.getDate(), //日
		 "h+": this.getHours(), //小时
		 "m+": this.getMinutes(), //分
		 "s+": this.getSeconds(), //秒
		 "q+": Math.floor((this.getMonth() + 3) / 3), //季度
		 "S": this.getMilliseconds() //毫秒
		 };
		 if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		 for (var k in o)
		 if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		 return fmt;
		 }
	 /**时间扩展方法结束---------------------------------------*/
//	alert(new Newtec.Percent()===new Newtec.Percent());
	
	//滚动条所有的都需要
// 	Newtec.Utils.addCSS("jquery.mCustomScrollbar.min.css");
// 	Newtec.Utils.addJS("jquery.mCustomScrollbar.concat.min.js");
	 var whenReady = (function() {               //这个函数返回whenReady()函数
		    var funcs = [];             //当获得事件时，要运行的函数
		    var ready = false;          //当触发事件处理程序时,切换为true
		    
		    //当文档就绪时,调用事件处理程序
		    function handler(e) {
		        if(ready) return;       //确保事件处理程序只完整运行一次
		        
		        //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
		        if(e.type === 'onreadystatechange' && document.readyState !== 'complete') {
		            return;
		        }
		        
		        //运行所有注册函数
		        //注意每次都要计算funcs.length
		        //以防这些函数的调用可能会导致注册更多的函数
		        for(var i=0; i<funcs.length; i++) {
		            funcs[i].call(document);
		        }
		        //事件处理函数完整执行,切换ready状态, 并移除所有函数
		        ready = true;
		        funcs = null;
		    }
		    //为接收到的任何事件注册处理程序
		    if(document.addEventListener) {
		        document.addEventListener('DOMContentLoaded', handler, false);
		        document.addEventListener('readystatechange', handler, false);            //IE9+
		        window.addEventListener('load', handler, false);
		    }else if(document.attachEvent) {
		        document.attachEvent('onreadystatechange', handler);
		        window.attachEvent('onload', handler);
		    }
		    //返回whenReady()函数
		    return function whenReady(fn) {
		        if(ready) { fn.call(document); }
		        else { funcs.push(fn); }
		    }
		})();
})();

window.console = window.console || (function(){ 
	var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){}; 
	return c; 
})(); 
;(function($, h, c) {

	var a = $([]),
		e = $.resize = $.extend($.resize, {}),
		i, k = "setTimeout",
		j = "resize",
		d = j + "-special-event",
		b = "delay",
		f = "throttleWindow";
	e[b] = 250;
	e[f] = true;
	$.event.special[j] = {
		setup: function() {
			if(!e[f] && this[k]) {
				return false
			}
			var l = $(this);
			a = a.add(l);
			$.data(this, d, {
				w: l.width(),
				h: l.height()
			});
			if(a.length === 1) {
				g()
			}
		},
		teardown: function() {
			if(!e[f] && this[k]) {
				return false
			}
			var l = $(this);
			a = a.not(l);
			l.removeData(d);
			if(!a.length) {
				clearTimeout(i)
			}
		},
		add: function(l) {
			if(!e[f] && this[k]) {
				return false
			}
			var n;

			function m(s, o, p) {
				var q = $(this),
					r = $.data(this, d);
				r.w = o !== c ? o : q.width();
				r.h = p !== c ? p : q.height();
				n.apply(this, arguments)
			}
			if($.isFunction(l)) {
				n = l;
				return m
			} else {
				n = l.handler;
				l.handler = m
			}
		}
	};
	function g() {
		i = h[k](function() {
			a.each(function() {
				var n = $(this),
					m = n.width(),
					l = n.height(),
					o = $.data(this, d);
				if(m !== o.w || l !== o.h) {
					n.trigger(j, [o.w = m, o.h = l])
				}
			});
			g()
		}, e[b])
	}
	
	// Newtec.Utils.addJS("newtec.appParam.js","myqdp/js/system/");//添加页面的title参数等
	
})(jQuery, this);

