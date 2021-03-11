/**
 * 描述：代码编辑器，使用codemirror插件，定义了基本的鼠标事件
 * 页面：通用代码编辑器
 * @author wmk
 */

Newtec.Component(
	[
		{js:'codemirror.js',src:'thirdparty/codemirror/lib/'},
		{js:'javaHintTip.js',src:'myqdp/js/'},
		{js:'show-hint.js',src:'thirdparty/codemirror/addon/hint/'},
		{js:'xml.js',src:'thirdparty/codemirror/mode/xml/'},
		{js:'css.js',src:'thirdparty/codemirror/mode/css/'},
		{js:'javascript.js',src:'thirdparty/codemirror/mode/javascript/'},
		{js:'xml-hint.js',src:'thirdparty/codemirror/addon/hint/'},
		{js:'javascript-hint.js',src:'thirdparty/codemirror/addon/hint/'},
    	{js:'simplescrollbars.js',src:'thirdparty/codemirror/addon/scroll/'},
	],
    [
    	{css:'codemirror.css',src:'thirdparty/codemirror/lib/'},
    	{css:'show-hint.css',src:'thirdparty/codemirror/addon/hint/'},
    	{css:'simplescrollbars.css',src:'thirdparty/codemirror/addon/scroll/'}
    ]
,function () {
	Newtec.CodeEditor=function(params){
		this.defaults={
			minHeight:300,
			isHeight100:true,
			autofocus : true,
			autoDraw:true,
			editor:{
				matchBrackets: true,//括号匹配
				styleActiveLine: true,//line选择是是否加亮
	            lineNumbers: true,//是否显示行数
	            lineWrapping: true,//是否自动换行
	            mode: 'text/javascript'
			}
		}
	}
	Newtec.CodeEditor.exte(Newtec.Base, 'CodeEditor');
	Newtec.CodeEditor.over({
		createNewtecJQ:function(params){
			var newtecJQ=$("<div style='min-height:"+params.minHeight+"px;' class='newtec-codeEditor'><textarea style='display:none;'></textarea></div>");	
			return newtecJQ;
		},
		draw:function(){
			var defaults=this.defaults,
			newtecJQ=this.newtecJQ,
			codeEditor=CodeMirror.fromTextArea(newtecJQ.find("textarea")[0],defaults.editor);
//			codeEditor.on("cursorActivity", function () {
//			    codeEditor.showHint();
//			});
	codeEditor.on('keyup', function(  cm, name ,  Event ) {
		//定义按哪些键时弹出提示框
		if(isShow(name.keyCode))
		{
			var datas = {};
			var cur = cm.getCursor();
			var ch = cur.ch;
			var line = cur.line;
        	var lineStr = cm.getLine(line);
			var fromS = 0;
        	var fromSD = lineStr.lastIndexOf(".");
        	var endS = lineStr.length;
           var packgeArrary = ["db","cache","log","http","security","timer","webTools","webParams","collectionTools","mail","vm"];
           if(fromS > -1){
               if(fromSD > -1)
               {
                   if(fromS < fromSD)
                   {
                       var lineEnd = lineStr.substring(endS-1,endS);
                       if(lineEnd == ".")
                       {
                           lineStr = lineStr.substring(fromS,endS-1);
                           console.warn(lineStr)
                           var list = obj[lineStr];

                           if(typeof(list) != "undefined")
                           {

                               datas.list = list;
                               datas.from = {};
                               datas.from.line = line;
                               datas.from.ch = ch;
                               datas.to = {};
                               datas.to.line = line;
                               datas.to.ch = ch+1;
                              
                               codeEditor.showHint1({completeSingle: false},datas);
                           }
                       }else{
                           var packge = lineStr.substring(fromS,fromSD);
                           var functioStr = lineStr.substring(fromSD+1,endS).toLowerCase();
                           console.warn(functioStr)
                           var packgeList = obj[packge];
                           var showList = [];
                           var showList2 = [];
                           for (var a = 0; a < packgeList.length; a++)
                           {
                               var info = packgeList[a];
                               if(info.toLowerCase().lastIndexOf(functioStr) > -1)
                               {
                                   showList.push(info);
                                   showList2.push(a);
                               }
                           }
                           datas.list = showList;
                           datas.showList = showList2;
                           datas.key = packgeList[0];
                           datas.from = {};
                           datas.from.line = line;
                           datas.from.ch = ch;
                           datas.to = {};
                           datas.to.line = line;
                           datas.to.ch = fromSD+1;
                           codeEditor.showHint1({completeSingle: false},datas);
                       }

                   }else{
//                     codeEditor.showHint();  //满足自动触发自动联想功能
                   }
               }else{
                   var showList = [];

                   var packgeS = lineStr.substring(fromS,endS).toLowerCase();
                   if(packgeS == "" || packgeS == null)
                   {
                       datas.list = packgeArrary;
                   }else{
                       for (var a = 0; a < packgeArrary.length; a++)
                       {
                           var info = packgeArrary[a];
                           if(info.toLowerCase().lastIndexOf(packgeS) > -1)
                           {
                               showList.push(info);
                           }
                       }
                       datas.list = showList;
                   }

                   datas.from = {};
                   datas.from.line = line;
                   datas.from.ch = ch;
                   datas.to = {};
                   datas.to.line = line;
                   datas.to.ch = fromS;
                   codeEditor.showHint1({completeSingle: false},datas);
               }
           }else{
//             codeEditor.showHint();  //满足自动触发自动联想功能
           }
       }
   });

function isShow(z) {
        
       if(z == "8" ||z == "173"||z == "190"||z == "189" ||z == "110" ||z == "65" || z == "66" ||z == "67" ||z == "68" ||z == "69" ||z == "70" ||z == "71" ||z == "72" ||z == "73" ||z == "74" ||z == "75" ||z == "76" ||
               z == "77" || z == "78" ||z == "79" ||z == "80" ||z == "81" ||z == "82" ||z == "83" ||z == "84" ||z == "85" ||z == "86" ||z == "87" ||z == "88" ||z == "89" ||z == "90" )
       {
         return true;
       }else{
         return false;
       }
     }
			codeEditor.setSize("auto",newtecJQ.height()||"300px")
			this.codeEditor=codeEditor;
		},
		finsh:function(params){
			var that=this;
			if(params.autoDraw){
				setTimeout(function(){
					that.draw();
				},200)
			}
		},
		getCode:function(){
			var value=this.codeEditor.getValue();
			var lastIndex=value.lastIndexOf("import");
			var importArr=null,content=null;
			if(lastIndex>=0){
				var impStr=value.substr(0,lastIndex);
				var arr=impStr.split("import");
				importArr=[];
				for(var i=0;i<arr.length;i++){
					var imp=arr[i].split(";")[0].trim()
					if(imp)importArr.push(imp);
				}
				content=value.substr(lastIndex+6,value.length);
				lastIndex=content.indexOf(";")
				importArr.push(content.substr(0,lastIndex));
				content=content.substr(lastIndex+1,content.length);
			}
			return {code:value,"imports":importArr,content:content}
		},
		
	});
        Newtec.Module("Newtec.CodeEditor")

    });