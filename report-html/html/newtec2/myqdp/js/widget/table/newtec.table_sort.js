/**
 * 表格拓展模块代码块
 */
(function () {
	
	Newtec.Utils.addCSS('widget/table/newtec-table-more-module.css')
	/**
	 * 功能说明：设置拓展模块
	 */
	var serverUrl=Newtec.ServerUrl;
	var oldDatas = []
	var sortMode;//排序的模式，默认为单一排序
	
	var sortBtn = "" , TitleBtn = "" , showFieldsBody = "" , showSortBody = "" , oldNum = 0
	Newtec.Table.prototype.setMoreModuleBody=function(){
		var that = this
		var fieldsfields=this.defaults;
		var moreModule=this.defaults.moreModule;
		sortMode = this.defaults.sortMode || 1
		var layout=$("<div class='table-more-module btn-group btn-group-xs'></div>");
		this.thead.append(layout)
		var tbodyDiv=this.tbodyDiv
		var tableParams = $.extend(true,{},this.fetchParam)
		this.tableParams = tableParams
		//添加排序
		if(moreModule.sort.show){
			var param=moreModule.sort;
			var btn=$("<button class='btn sortTitle closeMenu'>"+param.title+"</button>");
			sortBtn = btn
			layout.append(btn)
			showSortFields(this.defaults.fields,layout,that)
			btn.on("click",function(){
				var otherDiv =  $(this).parent().find(".chooseFieldsDiv")
				var otherBtn =  $(this).parent().find(".showTitle")
				if($(this).hasClass("closeMenu")){
					if(oldNum==0){
						var oldDatas = $.extend(true,[],that.datas)
						that.oldDatas = oldDatas
						oldNum++
					}
					$(this).removeClass("closeMenu").addClass("openMenu")
					showSortBody.css("display","block")
				}else{
					$(this).removeClass("openMenu").addClass("closeMenu")
					showSortBody.css("display","none")
				}
				if(otherDiv.css("display")=="block"){
					otherDiv.css("display","none")
					otherBtn.removeClass("openMenu").addClass("closeMenu")
				}
			})
		}
		//隐藏与显示字符
		if(moreModule.showTitle.show){
			var param=moreModule.showTitle;
			var btn=$("<button class='btn showTitle closeMenu'>"+param.title+"</button>");
			TitleBtn = btn
			layout.append(btn)
			showChooseFields(this.defaults.fields,layout,that)
			btn.on("click",function(){
				var otherDiv =  $(this).parent().find(".sortFieldsDiv")
				var otherBtn =  $(this).parent().find(".sortTitle")
				if($(this).hasClass("closeMenu")){
					//打开与关闭菜单
					$(this).removeClass("closeMenu").addClass("openMenu")
					showFieldsBody.css("display","block")
					//自动选中表头的数据
					var divitems = that.thead.find("th")
					for(var i = 0 ; i < divitems.length; i++ ){
						var field = divitems.eq(i);
						var midBody = showFieldsBody.find(".choosefieldsdiv-mid")
						for(var y = 0 ; y < midBody.children().length ; y++ ) {
							var item = midBody.children().eq(y);
							if(!Newtec.Utils.isNull(field.text())){
								if(field.text()==item.text()&&field.css('display')!="none"){
									item.addClass("select")
//									item.find("input").prop("checked","true");
									item.find(".sortFieldImg").css("display","block")
								}
							}
						}
					}
				}else{
					//打开与关闭菜单
					$(this).removeClass("openMenu").addClass("closeMenu")
					showFieldsBody.css("display","none")
				}
				if(otherDiv.css("display")=="block"){
					otherDiv.css("display","none")
					otherBtn.removeClass("openMenu").addClass("closeMenu")
				}
			})
			
		}
	}
	function showSortFields(fields,layout,tableThis){
		var that = this
		var fieldMap = {}
		for(var i = 0 ; i < tableThis.fields.length ; i++){
			var field = tableThis.fields[i]
			fieldMap[field['title']] = field['name']
		}
		var div=$("<ul class='dropdown-menu sortFieldsDiv'></ul>");
		var topdiv = $("<div class = 'sortfieldsdiv-top'>选中排序的字段</div>")
		var middiv = $("<div class = 'sortfieldsdiv-mid'></div>")
		var botdiv = $("<div class = 'sortfieldsdiv-bot clear-float'></div>")
		var thead = tableThis.thead
		var iteminJQ = $(tableThis.tbodyHead[0]).children("tr").children();
		var itemoutJQ = tableThis.thead.find("th")
		var ths = thead.find(".newtec-thead th")
		for(var i = 0 ; i < ths.length ; i++ ) {
			var th = $(ths[i])
			for(var y = 0 ; y < fields.length ; y++) {
				var f = fields[y]
				if(th.text()==f.title&&f.showSort){
					th.append($("<i class='glyphicon glyphicon-triangle-top'/>"))
					th.append($("<i class='glyphicon glyphicon-triangle-bottom'/>"))
				}
			}
			
		}
		thead.on("click",".glyphicon-triangle-top",function(){
			var title = $(this).parent().text() , name = ""
			for(var i = 0 ; i < fields.length ; i++){
				var field = fields[i]
				if(field.title == title)name = field.name
			}
			var datas = []
			if(tableThis.totalRow==-1){
				datas = tableThis.datas
				datas.sort(function(obj1,obj2){
					if(typeof obj1[name] == "number"){
						return obj1[name] - obj2[name]
					}else{
						return obj1[name].localeCompare(obj2[name],"zh-CN")
					}
				})
				var begin = 0,len = $(tableThis.tbodyHead[0]).children("tr").children().length;
				if(tableThis.defaults.multSelect){begin = 1;}
				if(tableThis.defaults.trBtnFun){len = len-1;}
				var showName = that.showName
				
				if(Newtec.Utils.isNull(showName)){
					tableThis.setData(datas,false)
				}else{
					var newDatas = []
					for(var y = 0 ; y < datas.length ; y++ ) {
						var d = datas[y]
						for(var key in d){
							if(key=="newtecTRId")continue;
							var flag = false
							for(var i = 0 ; i < showName.length ; i++ ) {
								var n = showName[i]
								if(key==n){
									flag = true;
									break;
								}
							}
							if(!flag){
								delete d[key]
							}
						}
						newDatas.push(d)
					}
					console.warn(newDatas)
					tableThis.setData(newDatas,false)
				}
				
			}else{
				var fetchParam = tableThis.fetchParam
				var sortBy = fetchParam.sortBy||{}
				if(sortMode==1){
					for(var key in sortBy){
						delete sortBy[key]
					}
				}
				sortBy[name] = "asc"
				fetchParam.sortBy = sortBy
				var sel = fetchParam['select']||[]
				sel = that.showName||[]
				fetchParam['select'] = sel
				tableThis.fetchData(fetchParam)
			}
		})
		thead.on("click",".glyphicon-triangle-bottom",function(){
			var title = $(this).parent().text() , name = ""
			for(var i = 0 ; i < fields.length ; i++){
				var field = fields[i]
				if(field.title == title)name = field.name
			}
			var datas = []
			if(tableThis.totalRow==-1){
				datas = tableThis.datas
				datas.sort(function(obj1,obj2){
					if(typeof obj1[name] == "number"){
						return obj2[name] - obj1[name]
					}else{
						return obj2[name].localeCompare(obj1[name],"zh-CN")
					}
				})
				var begin = 0,len = $(tableThis.tbodyHead[0]).children("tr").children().length;
				if(tableThis.defaults.multSelect){begin = 1;}
				if(tableThis.defaults.trBtnFun){len = len-1;}
				var showName = that.showName
				
				if(Newtec.Utils.isNull(showName)){
					tableThis.setData(datas,false)
				}else{
					var newDatas = []
					for(var y = 0 ; y < datas.length ; y++ ) {
						var d = datas[y]
						for(var key in d){
							if(key=="newtecTRId")continue;
							var flag = false
							for(var i = 0 ; i < showName.length ; i++ ) {
								var n = showName[i]
								if(key==n){
									flag = true;
									break;
								}
							}
							if(!flag){
								delete d[key]
							}
						}
						for(var y = 0 ; y < datas.length ; y++ ) {
						var d = datas[y]
							for(var key in d){
								if(key=="newtecTRId")continue;
								var flag = false
								for(var i = 0 ; i < showName.length ; i++ ) {
									var n = showName[i]
									if(key==n){
										flag = true;
										break;
									}
								}
								if(!flag){
									delete d[key]
								}
							}
							newDatas.push(d)
						}
					}
					tableThis.setData(newDatas,false)
				}
			}else{
				var fetchParam = tableThis.fetchParam
				var sortBy = fetchParam.sortBy||{}
				if(sortMode==1){
					for(var key in sortBy){
						delete sortBy[key]
					}
				}
				sortBy[name] = "desc"
				fetchParam.sortBy = sortBy
				var sel = fetchParam['select']||[]
				sel = that.showName||[]
				fetchParam['select'] = sel
				tableThis.fetchData(fetchParam)
			}
		})
		for(var i=0;i<fields.length;i++){
			var item=fields[i]
			if(item.showSort){
				var itemJQ = "<div class = 'sortFieldItem'><span class = 'sortFieldSpan'></span><img class = 'sortFieldImg' src = '" + serverUrl + "myqdp/images/table/content_btn_selection.png'/><span class = 'itemfield'>" + item['title'] + "</span></div>"	
			}
			middiv.append($(itemJQ))
		}
		middiv.on("click",".itemfield",function(){
			var img = $(this).parent().find(".sortFieldImg")
			if(img.css("display")=="none"){
				img.css("display","block")
			}else{
				img.css("display","none")
			}
		})
		middiv.on("click",".sortFieldSpan",function(){
			var img = $(this).parent().find(".sortFieldImg")
			if(img.css("display")=="none"){
				img.css("display","block")
			}else{
				img.css("display","none")
			}
		})
		middiv.on("click",".sortFieldImg",function(){
			var img = $(this)
			if(img.css("display")=="none"){
				img.css("display","block")
			}else{
				img.css("display","none")
			}
		})
		botdiv.append(Newtec.Button.create({title:"升序",className:'pull-left',
			click:function(){
				var f = []
				var items = middiv.find(".sortFieldItem")
				for(var i = 0 ; i < items.length ; i++ ) {
					var item = items[i]
					var display = $(item).find(".sortFieldImg").css("display")
					if(display == "block"){
						for(var y = 0 ; y < fields.length ; y++ ) {
							if(fields[y].title == $(item).text()){
								f.push(fields[y].name)
							}
						}
					}
				}
				if(tableThis.totalRow==-1){
					datas = tableThis.datas
					for(var i = 0 ; i < f.length ; i++ ){
						var name = f[i]
						datas.sort(function(obj1,obj2){
							if(typeof obj1[name] == "number"){
								return obj1[name] - obj2[name]
							}else{
								return obj1[name].localeCompare(obj2[name],"zh-CN")
							}
						})
					}
					var begin = 0,len = $(tableThis.tbodyHead[0]).children("tr").children().length;
					if(tableThis.defaults.multSelect){begin = 1;}
					if(tableThis.defaults.trBtnFun){len = len-1;}
					var showName = that.showName
					
					if(Newtec.Utils.isNull(showName)){
						tableThis.setData(datas,false)
					}else{
						var newDatas = []
						for(var y = 0 ; y < datas.length ; y++ ) {
							var d = datas[y]
							for(var key in d){
								if(key=="newtecTRId")continue;
								var flag = false
								for(var i = 0 ; i < showName.length ; i++ ) {
									var n = showName[i]
									if(key==n){
										flag = true;
										break;
									}
								}
								if(!flag){
									delete d[key]
								}
							}
							for(var y = 0 ; y < datas.length ; y++ ) {
							var d = datas[y]
								for(var key in d){
									if(key=="newtecTRId")continue;
									var flag = false
									for(var i = 0 ; i < showName.length ; i++ ) {
										var n = showName[i]
										if(key==n){
											flag = true;
											break;
										}
									}
									if(!flag){
										delete d[key]
									}
								}
								newDatas.push(d)
							}
						}
						tableThis.setData(newDatas,false)
					}
				}else{
					var fetchParam = tableThis.fetchParam
					var sortBy = fetchParam.sortBy||{}
					for(var i = 0 ; i < f.length ; i++ ){
						var iName = f[i]
						sortBy[iName] = "asc"
					}
					fetchParam.sortBy = sortBy
					var sel = fetchParam['select']||[]
					sel = that.showName||[]
					fetchParam['select'] = sel
					tableThis.fetchData(fetchParam)
				}
				
			},
		}).newtecJQ).append(Newtec.Button.create({title:"降序",className:'pull-right',
			click:function(){
				var f = []
				var items = middiv.find(".sortFieldItem")
				for(var i = 0 ; i < items.length ; i++ ) {
					var item = items[i]
					var display = $(item).find(".sortFieldImg").css("display")
					if(display == "block"){
						for(var y = 0 ; y < fields.length ; y++ ) {
							if(fields[y].title == $(item).text()){
								f.push(fields[y].name)
							}
						}
					}
				}
				if(tableThis.totalRow==-1){
					datas = tableThis.datas
					for(var i = 0 ; i < f.length ; i++ ){
						var name = f[i]
						datas.sort(function(obj1,obj2){
							if(typeof obj1[name] == "number"){
								return obj2[name] - obj1[name]
							}else{
								return obj2[name].localeCompare(obj1[name],"zh-CN")
							}
						})
					}
					var begin = 0,len = $(tableThis.tbodyHead[0]).children("tr").children().length;
					if(tableThis.defaults.multSelect){begin = 1;}
					if(tableThis.defaults.trBtnFun){len = len-1;}
					var showName = that.showName
					if(Newtec.Utils.isNull(showName)){
						tableThis.setData(datas,false)
					}else{
						var newDatas = []
						for(var y = 0 ; y < datas.length ; y++ ) {
							var d = datas[y]
							for(var key in d){
								if(key=="newtecTRId")continue;
								var flag = false
								for(var i = 0 ; i < showName.length ; i++ ) {
									var n = showName[i]
									if(key==n){
										flag = true;
										break;
									}
								}
								if(!flag){
									delete d[key]
								}
							}
							for(var y = 0 ; y < datas.length ; y++ ) {
							var d = datas[y]
								for(var key in d){
									if(key=="newtecTRId")continue;
									var flag = false
									for(var i = 0 ; i < showName.length ; i++ ) {
										var n = showName[i]
										if(key==n){
											flag = true;
											break;
										}
									}
									if(!flag){
										delete d[key]
									}
								}
								newDatas.push(d)
							}
						}
						tableThis.setData(newDatas,false)
					}
				}else{
					var fetchParam = tableThis.fetchParam
					var sortBy = fetchParam.sortBy||{}
					for(var i = 0 ; i < f.length ; i++ ){
						var iName = f[i]
						sortBy[iName] = "desc"
					}
					fetchParam.sortBy = sortBy
					var sel = fetchParam['select']||[]
					sel = that.showName||[]
					fetchParam['select'] = sel
					tableThis.fetchData(fetchParam)
				}
			},
		}).newtecJQ).append(Newtec.Button.create({title:"默认",className:'resBtn pull-right',
			click:function(){
				if(tableThis.totalRow==-1){//静态数据
					console.warn(oldNum)
					var oldDatas = tableThis.oldDatas
					console.warn(oldDatas)
					tableThis.setData(oldDatas,false)
				}else{//查询后台
					var fetchParam = tableThis.tableParams
					var sortBy = null
					fetchParam.sortBy = sortBy
					console.warn(fetchParam)
					tableThis.fetchData(fetchParam)
				}
			}
		}).newtecJQ);
 		div.append(topdiv).append(middiv).append(botdiv)
 		showSortBody = div
 		layout.append(div)
	}
	function showChooseFields(fields,layout,tableThis){
		var that = this
		var div = $("<div class = 'chooseFieldsDiv pull-left'></div>")
		var topdiv = $("<div class = 'choosefieldsdiv-top'>选择显示的字段</div>")
		var middiv = $("<div class = 'choosefieldsdiv-mid'></div>")
		var botdiv = $("<div class = 'choosefieldsdiv-bot clear-float'></div>")
		
		for(var i = 0 ; i < fields.length ; i++){
			var item = fields[i]
			var itemJQ = "<div><span class = 'sortFieldSpan'></span><img class = 'sortFieldImg' src = '" + serverUrl + "myqdp/images/table/content_btn_selection.png'/><span class = 'itemfield'>" + item['title'] + "</span></div>"
			middiv.append($(itemJQ))
		}
		middiv.on("click",".itemfield",function(){
			var img = $(this).parent().find(".sortFieldImg")
				if(img.css("display")=="none"){
					img.css("display","block")
				}else{
					img.css("display","none")
				}
		})
		middiv.on("click",".sortFieldSpan",function(){
			var img = $(this).parent().find(".sortFieldImg")
			if(img.css("display")=="none"){
				img.css("display","block")
			}else{
				img.css("display","none")
			}
		})
		middiv.on("click",".sortFieldImg",function(){
			var img = $(this)
			if(img.css("display")=="none"){
				img.css("display","block")
			}else{
				img.css("display","none")
			}
		})
		botdiv.append(Newtec.Button.create({title:"取消",className:'pull-left',
			click:function(){
				div.css("display","none")
				TitleBtn.removeClass("openMenu").addClass("closeMenu")
			},
		}).newtecJQ).append(Newtec.Button.create({title:"确认",className:'pull-right',
			click:function(){
				var shownames = [],hidenames=[],showtitles = [],hidetitles=[];
				var begin = 0,len = $(tableThis.tbodyHead[0]).children("tr").children().length;
				//in内部表头、out外部表头		
				var iteminJQ = $(tableThis.tbodyHead[0]).children("tr").children();
				var itemoutJQ = tableThis.thead.find("th")
//				var width = itemoutJQ.width()
//				console.warn(width)
				//有多选从第一个开始
				if(tableThis.defaults.multSelect){
					begin = 1;
				}
				//有操作栏长度减1
				if(tableThis.defaults.trBtnFun){
					len = len-1;
				}
				//把数据存进数组中
				for(var i = 0 ; i < middiv.children().length ; i++ ) {
					var mdiv = middiv.children().eq(i);
					if(mdiv.find(".sortFieldImg").css("display") == "block"){
						showtitles.push(mdiv.text());
						for(var j = 0 ; j < fields.length ; j++ ) {
							if(fields[j].title==mdiv.text()){
								shownames.push(fields[j].name);
							}
						}
					}else{
						hidetitles.push(mdiv.text());
						for(var j = 0 ; j < fields.length ; j++ ) {
							if(fields[j].title==mdiv.text()){
								hidenames.push(fields[j].name);
							}
						}
					}
				}
				that.showName = shownames

				if(!Newtec.Utils.isNull(shownames)&&!Newtec.Utils.isNull(hidenames)){
					tableThis.showThead(shownames);
					tableThis.hideThead(hidenames);
//					var len = showtitles.length
//					console.warn(len)
//					var tableWidth = tableThis.tableDiv.width()
//					var thwidth = 0
//					if(tableWidth/len<width){
//						thwidth = width
//					}else{
//						thwidth = tableWidth/len
//					}
//					tableThis.tableDiv.css("width",tableWidth+"px")
					for(begin ; begin < len ; begin++ ) {
						//名称
						var title = $(itemoutJQ[begin]).text();
						var flag = false;
						for(var x = 0 ; x < showtitles.length ; x++ ) {
							if(showtitles[x]==title){
								$(itemoutJQ[begin]).css({"display":""});
								$(iteminJQ[begin]).css("display","");
								flag = true;
								break;
							}
						}
						if(!flag){
							$(itemoutJQ[begin]).css("display","none");
							$(iteminJQ[begin]).css("display","none");
						}
					}
				}else if(Newtec.Utils.isNull(shownames)){
					tableThis.hideThead(hidenames);
					for(begin ; begin < len ; begin++ ) {
						$(itemoutJQ[begin]).css("display","none");
						$(iteminJQ[begin]).css("display","none");
					}
				}else{
					tableThis.showThead(shownames);
					for(begin ; begin < len ; begin++ ) {
						$(itemoutJQ[begin]).css("display","");
						$(iteminJQ[begin]).css("display","");
					}
				}
				div.css("display","none");
				TitleBtn.removeClass("openMenu").addClass("closeMenu")
			},
		}).newtecJQ);
		div.append(topdiv).append(middiv).append(botdiv)
		showFieldsBody = div
		layout.append(div)
	}
})()
