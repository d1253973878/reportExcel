;(function(){
if(Newtec.File != undefined){
		console.warn('newtec.menu.js已经被引入!');
		return ;
	}
Newtec.Utils.addJS('webuploader.js',"thirdparty/other/")
Newtec.File = function (params) {
	//2.
	this.defaults = {
			click:null//data,that,elJQ
			,files:null//表示允许的文件名后缀['txt','png']
			,singleFile:true//true:表示上传单个文件 false:表示上传文件夹，文件夹功能只能在chrome内核浏览器使用  //by 张远 2019-3-4 15:46:27
			,className:''
			,btnClass:''
			,title:"选择文件"
			,hint:''
			,accept:""
			,btnTitle:'选择'
			,btnTitle2:'上传'
			,changeFun:null
//			,domStyle:{
//				btnStyle:null
//			},
			,textClick:null
			,mode:1
    };
	this.defaults=$.extend(true,this.defaults,params);
};
Newtec.File.exte(Newtec.Base,'newtecFile');
Newtec.File.over({
	createNewtecJQ:function(params){
		var defaults=this.defaults;
		var pStyle="",inputStyle='',btnStyle="";
		if(Newtec.Utils.isJson(params.domStyle)){
			var domStyle=params.domStyle;
			pStyle=this.removeParentStyle(domStyle);
			btnStyle=this.styleJson2Str(domStyle.btnStyle);
			inputStyle=this.styleJson2Str(domStyle);
		}
		var id=this.id;
		var webkitdirectory = params.singleFile?"":"webkitdirectory";
		var newtecJQ="";
		if(params['mode']==1){
			newtecJQ = $("<form class='newtec-file clear-float "+(params['className']||"")+"' method='post' enctype='multipart/form-data' style='"+pStyle+"'>"+
				(defaults['title']&&"<div class='item file-title'>选择文件</div>"||"")+
    			"<div class='item clear-float '>" +
    			"<input class='content-input "+(params['inputClass']||"")+"' type='text' readonly='readonly' style='"+inputStyle+"'"
    			+(defaults.hint&&" placeholder='"+defaults.hint+"'"||"")+"/>"+
    			"<button id='fileBtn' class='btn "+(params['btnClass']||"")+"' style='"+btnStyle+"'>"+params.btnTitle+"</button>" +
    			"<input id='"+id+"' name='file' "+webkitdirectory+" multiple='true' "+(params.accept&&"accept='"+params.accept+"'"||"")+"  type='file' class='content-input'/>"+
    			"</div></form>");
		}else{
			newtecJQ = $("<form class = 'newtec-file clear-float "+(params['className']||"")+"' method = 'post' enctype = 'multipart/form-data' style='"+pStyle+"'>"+
			(defaults['title']&&"<div class='item file-title'>选择文件</div>"||"")+
			"<div class = 'item clear-float'><div class = 'fileContent' style = 'position:relative'>" +
			"<input class = 'content-input "+(params['inputClass']||"")+"' type = 'text' readonly = 'readonly' style = 'height:30px;width:calc(100% - 80px);border:none;background: #f1f1f1;padding-left:30px;"+inputStyle+"'"
			+(defaults.hint&&" placeholder = '"+defaults.hint+"'"||"")+"/>"+
			"</div></div></form>")
			var btnPramas=$.extend(true,{title:"上传",className:"file-mode2"},defaults.btnParams);
			newtecJQ.find(".fileContent").append(Newtec.Button.create(btnPramas).newtecJQ)
				.append("<input id='"+id+"' name = 'file' "+webkitdirectory+" multiple = 'true' "+(params.accept&&"accept='"+params.accept+"'"||"")+" type='file' class='content-input' style='calc(100% - 80px)'/>")
				.append("<i class = 'glyphicon glyphicon-list-alt' style = 'position:absolute;left:8px;top:8px;'/>")
		}
		
		this.fileJQ=newtecJQ.find('input[type=file]'),
		this.textJQ=newtecJQ.find('input[type=text]');
		this.fileBtn=newtecJQ.find('#fileBtn');
		this.netecJQ = newtecJQ;
		return newtecJQ;
	},
	finsh:function(params){
		var that=this,
		prevfiles=null,
		defaults=this.defaults,
		changeFun = defaults.changeFun,
		files=defaults.files;
		var clear
		var explorer = window.navigator.userAgent,
		mutiply = explorer.indexOf("Chrome")>=0&&!defaults.singleFile;
		
		this.fileJQ.change(function(){
			if(this.files.length<1){
				this.files = prevfiles;
				return;
			}else{
				console.info(this.files);
				console.info(this.files[0]);
				var fname=this.files[0].name;
				if(files&&Newtec.Utils.isArray(files)){
					var len=files.length,
					isTrue=false;
					while(len--){
						if(fname.endsWith("."+files[len])){
							isTrue=true;
							break;
						}
					}
					if(!isTrue){
						Newtec.Window.hint("只允许上传【"+files.toString()+"】后缀的文件！！");
						return;
					}
				}
				if(mutiply){
					fname = this.files[0].webkitRelativePath.split("/")[0];
				}
				if(params['mode']==2){
					if(clear){
						clear.css("display","block")
					}else{
						clear = $("<i class = 'glyphicon glyphicon-remove-circle' style = 'position:absolute;right:90px;top:8px;'>")
						that.textJQ.parent().append(clear)
					}
					clear.click(function(){
						that.textJQ.val("")
						clear.css("display","none")
					})
				}
				that.textJQ.val(fname);
				prevfiles = this.files;
			}
			Newtec.Utils.isFunction(changeFun)&&changeFun(prevfiles);
		
		});
		if(Newtec.Utils.isFunction(params.textClick)){
			var fileBtn=this.fileBtn;
			this.textJQ.click(function(){
				params.textClick(that.textJQ.val(),that,this)
			})
			setTimeout(function(){
				that.fileJQ.css({"width":fileBtn.outerWidth(),left:'auto',right:0});
			}, 300);
		}
		
	},
	getFileName:function(){
		return this.textJQ.val();
	},
	getData:function(formData,name){
		var val= this.textJQ.val();
		if(Newtec.Utils.isNull(val))return;
		var defaults=this.defaults;
		if(defaults.singleFile){
			if(formData){
				formData.append(name||"file", this.newtecJQ.find('input[type=file]')[0].files[0])
				return formData
			}else{
				var newFormData = new FormData();
				newFormData.append("file",this.fileJQ[0].files[0]);
				return newFormData
			}
		}else{
			if(formData){
				var files = this.newtecJQ.find('input[type=file]')[0].files;
				for ( var i = 0; i < files.length; i++) {
					formData.append("file",files[i]);
				}
				return formData;
			}else{
				return new FormData(this.newtecJQ[0]);
			}
		}
	},
	upload:function(url,callback){
		if(!url){
			Newtec.Window.hint("上传请求路径为空！！");
			return;
		}
		Newtec.DS.create().relAjax(url, this.getData(), callback)
	}
});
	Newtec.Module("File")
})();