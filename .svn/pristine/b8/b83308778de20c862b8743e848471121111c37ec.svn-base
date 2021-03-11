;(function(){
Newtec.Utils.addJS('webuploader.js',"thirdparty/other/")
Newtec.Utils.addCSS('webuploader.css',"thirdparty/other/")
/**
 * webuploader组件，可处理断点续传，自带断点续传逻辑
 * @param {Object} params
 */
Newtec.Webuploader = function (params) {
	//2.
	this.defaults = {
    };
	this.defaults=$.extend(true,this.defaults,params);
};
Newtec.Webuploader.exte(Newtec.Base,'newtecFile');
Newtec.Webuploader.over({
	createNewtecJQ:function(params){
		var newtecJQ=$("<div id='"+this.id+"'><div id='fileList'></div></div>")
		var dndArea=$("<div id='dndArea'></div>")
		var fileList=$("<div id='fileList'></div>")
		var filePicker=$('<div id="filePicker">文件上传</div>');
		newtecJQ.append(dndArea).append(fileList).append(filePicker)
		return newtecJQ;
	},
	//点选续传的方法初始化
	goOnAload:function(){
		// 监听分块上传的时间点，断点续传
		var id=this.id;
		var fileMd5;
		WebUploader.Uploader.register({
			"before-send-file":"beforeSendFile",
			"before-send":"beforeSend",
			"after-send-file":"afterSendFile"
			},{
				beforeSendFile:function(file) {
					// 创建一个deffered,用于通知是否完成操作
					var deferred = WebUploader.Deferred();
					
					// 计算文件的唯一标识，用于断点续传和妙传
					(new WebUploader.Uploader()).md5File(file, 0, 5*1024*1024)
						.progress(function(percentage){
							console.info("正在获取文件信息...");
						})
						.then(function(val) {
							fileMd5 = val;
							console.info("成功获取文件信息");
							// 放行
							deferred.resolve();
						});
					// 通知完成操作
					return deferred.promise();
				},
				beforeSend:function(block) {
					var deferred = WebUploader.Deferred();
					
					// 支持断点续传，发送到后台判断是否已经上传过
					$.ajax(
						{
							type:"POST",
							url:"UploadActionServlet?action=checkChunk",
							data:{
								// 文件唯一表示								
								fileMd5:fileMd5,
								// 当前分块下标
								chunk:block.chunk,
								// 当前分块大小
								chunkSize:block.end-block.start
							},
							dataType:"json",
							success:function(response) {
								console.info("==是否上传过=>>>",response)
								if(response.ifExist) {
									// 分块存在，跳过该分块
									deferred.reject();
								} else {
									// 分块不存在或不完整，重新发送
									deferred.resolve();
								}
							}
						}
					);
					
					
					// 发送文件md5字符串到后台
					this.owner.options.formData.fileMd5 = fileMd5;
					return deferred.promise();
				},
				afterSendFile:function(file) {
					console.info("afterSendFile:function==",file)
					// 通知合并分块
					$.ajax(
						{
							type:"POST",
							url:"UploadActionServlet?action=mergeChunks",
							data:{
								fileMd5:fileMd5,
							},
							success:function(response){
								
							}
						}
					);
				}
			}
		);
		// 上传基本配置
		var uploader = WebUploader.create(
			{
				server:"FileUploadServlet",
				pick:"#"+id+" #filePicker",
				auto:true,
				//dnd:"#dndArea",
				disableGlobalDnd:true,
				//paste:"#uploader",
				
				// 分块上传设置
				// 是否分块
				chunked:true,
				// 每块文件大小（默认5M）
				chunkSize:5*1024*1024,
				// 开启几个并非线程（默认3个）
				threads:3,
				// 在上传当前文件时，准备好下一个文件
				prepareNextFile:true
			}		
		);
		// 生成缩略图和上传进度
		uploader.on("fileQueued", function(file) {
				console.info("fileQueued",file)
		}); 
		
		// 监控上传进度
		// percentage:代表上传文件的百分比
		uploader.on("uploadProgress", function(file, percentage) {
			console.info(Math.round(percentage * 100) + "%");
		});
	}
});
	Newtec.Module("Webuploader")
})();