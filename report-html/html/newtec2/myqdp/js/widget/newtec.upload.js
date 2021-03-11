;(function(){
	if(Newtec.Upload != undefined){
		console.log('上传控件已经优质啦');
		return ;
	}
	Newtec.Utils.addCSS("fileinput.css");
	Newtec.Utils.addStyle(".file-input .input-group .input-group-btn button,.file-input .input-group .input-group-btn a{border: 1px solid #cccccc;}"+
    ".file-input .input-group .input-group-btn .btn-file{border: 1px solid transparent !important;}");
	
	Newtec.Utils.addJS(["fileinput.js",'zh.js']);
	Newtec.Upload = function (params) {
		if(!Newtec.Utils.isJson(params)){//不是json格式不能创建按钮
			return ;
		}
		//2.
		this.defaults = {
				url:'CPImgUploadServlet',
				data :'',
				imgs :'',
				showUpload:false,
				dropZoneEnabled:true,
				maxFileCount:20,
				showRemove:false,
				showCaption:false,
				showDelete:false,
				showCancel:false,
        };
    	this.defaults = $.extend({},this.defaults,params);
	};
	//3.
	Newtec.Upload.exte(Newtec.Base,'upload2');
//	Newtec.Upload.prototype = new Newtec.Base('upload');
//	Newtec.Button.prototype.type='button';
	//4.
	Newtec.Upload.prototype.createNewtecJQ=function(params){
		var that = this;
		this.filenames=[];
		this.jqUpload = $("<input id='"+this.id+"' class='file' type='file' name='file' multiple='true' data-min-file-count='1'/>");
		this.jqUpload.on('fileuploaded', function(event, data, previewId, index) {
			var filenames = Newtec.Utils.json2str(data.response.file)
			filenames = filenames.substring(1,filenames.length-1);
			that.filenames.push(filenames);
			var loadSuccess = params['loadSuccess'];
			if(Newtec.Utils.isFunction(loadSuccess)){
				loadSuccess(data);
			}
		});
		this.jqUpload.on('fileuploaderror', function(event, data, previewId, index) {
			alert(data+"失败："+Newtec.Utils.json2str(data));
		});
		this.jqUpload.on('filesuccessremove',)
		return this.jqUpload;
	};
	Newtec.Upload.prototype.upload = function(){
		this.jqUpload.fileinput('upload');
	};
	Newtec.Upload.prototype.finsh = function(params){
		if(params['appendTo']==undefined) return ;
		this.set();
//		this.newtecJQ = $("#"+this.id);
//		if(true) return ;
	}
	/**
	 * @author   2016-10-24 说明：
	 * 设置上传控件
	 */
	Newtec.Upload.prototype.set = function(){
		var temp = {
			language: 'zh',
			/* secureuri: false, */
			 showUpload: this.defaults.showUpload,//上传按钮
			 dropZoneEnabled:this.defaults.dropZoneEnabled,
			 uploadExtraData:this.defaults['data'],
			/* showRemove: false, */
			uploadUrl: this.defaults['url'],  //上传的地址
			maxFileCount: this.defaults.maxFileCount,//最多只能放的张数
			previewSettings: {image: {width: "120px", height: "100px"}},
//			  minImageWidth: 50, //图片的最小宽度
//            minImageHeight: 50,//图片的最小高度
//            maxImageWidth: 100,//图片的最大宽度
//            maxImageHeight: 100,//图片的最大高度
			initialPreview:this.defaults['imgs'],
		    allowedFileExtensions: ['jpg', 'png', 'gif'], //接收的文件后缀
			showCaption: this.defaults.showCaption, //是否显示标题
			showDelete: this.defaults.showDelete,
			showRemove: this.defaults.showRemove, //是否显示移除按钮
			showCancel: this.defaults.showCancel, //是否显示取消按钮
			browseClass: "btn btn-primary", //按钮样式  
			enctype: 'multipart/form-data',
			overwriteInitial:false,
			validateInitialCount:true,
//			initialPreview:["<img src='lottery/images/bg.jpg'/>","<img src='lottery/images/bg.jpg'/>"],
//			previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
		};
		this.temp = $.extend({},temp,this.defaults.temp);
		this.jqUpload.fileinput(this.temp); 
	}
	Newtec.Upload.prototype.getValue = function(){
		return this.jqUpload.attr("url");
	}
	Newtec.Upload.prototype.filereset = function(temp){
		this.temp = $.extend({},this.temp,temp);
		console.info("-----this.temp--------",this.temp);
		this.jqUpload.fileinput(this.temp); 
	}
	Newtec.Upload.prototype.fileinput = function(temp){
		this.jqUpload.fileinput(temp); 
	}
	Newtec.Upload.prototype.getImage = function(){
		return this.jqUpload.find(".file-preview-image")
	}
	Newtec.Upload.prototype.getFileName = function(){
//		var files = this.jqUpload.parents(".file-input").find(".file-live-thumbs").children();
//		var filesName=[];
//		files.each(function(){
//			var name =$(this).find(".file-footer-caption").attr("title");
//			filesName.push(name);
//		})
//		var names=filesName.join(",");
//		return names;
		
		var names = this.filenames;
		var filenames=names.join(",");
		return filenames;
	}
	Newtec.Upload.prototype.getData = function(formData,name){
		return formData&&formData.append(name||"file", this.jqUpload.find('input[type=file]')[0].files[0])||new FormData(this.jqUpload[0]);
	}
	Newtec.Upload.create = function(params){
		var uploadJQ = new Newtec.Upload(params).init();
		return uploadJQ;
	};
	Newtec.Module("Upload")
})();