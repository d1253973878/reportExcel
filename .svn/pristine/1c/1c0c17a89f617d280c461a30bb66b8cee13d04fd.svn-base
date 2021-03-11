(function () {
	Newtec.Table||Newtec.Utils.addJS("newtec.table.js","myqdp/js/widget/")
	Newtec.Form||Newtec.Utils.addJS("widget/newtec.form.js");
	Newtec.TreeGrid||Newtec.Utils.addJS("widget/newtec.treegrid2.0.js")
	Newtec.AreaTreepage = function (params) {
			this.defaults = {
				appendTo: '',
				ds: '',
				add: true,
				update: true,
				remove: true,
				expand: false,
				showIcon: false,
				showCheckbox: false
			}
			$.extend(this.defaults,params);
			var ds = this.defaults.ds;
			this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;
			this.dsName = this.ds.dsName;
			this.head = undefined;
			this.headLeft = undefined;
			this.headRight = undefined;
			
			this.leftId = "";
			this.leftJQ = undefined;
			this.rightId = "";
			this.rightJQ = undefined;
			this.treeGrid = undefined;
			
			this.rightParams = {
				ds: this.ds,
				titleColumn: 3,
				columnNum: 2,
				operType: Newtec.DS.OperType.update
			};
		}
		var areaNodeds = Newtec.DS.create("areaNodeDS");
		Newtec.AreaTreepage.exte(Newtec.Base,'areaTreepage')
		Newtec.AreaTreepage.over({
			createNewtecJQ: function (params) {
				var that = this, leftId = '', win = '', form = '', areaNodeds = Newtec.DS.create("areaNodeDS")
				this.areaNodeds = areaNodeds;
				var thisJQ = $(this.defaults.appendTo);
				this.leftId = 'treePage_left_' + Newtec.Utils.uuid16();			this.leftJQ = $("<div id = '" + this.leftId + "' class = '' style = 'width:20%;float:left;position:absolute;left:0;top:0;right:80%;bottom:0;border-top: 3px solid white;border-right: 3px solid white;padding-right:3px;'></div>")
				this.leftJQ.append($("<div class = 'treePage_left_head' style = 'background:#eee;padding:5px 5px 5px 10px;font-size:16px;'><span>行政区划</span></div>"))
				this.rightId = 'treePage_right_' + Newtec.Utils.uuid16()
				this.rightJQ = $("<div id = '" + this.rightId + "' class = '' style = 'width:80%;float:left;position:absolute;left:20%;top:0;right:0;bottom:0;border-top: 3px solid white;'></div>")
				this.rightJQ.append(this.createheaddiv());
				thisJQ.append(this.leftJQ).append(this.rightJQ);
				var leftParams = {
					appendTo: '#' + this.leftId,
					ds: this.ds,
					expand:false,
					autoFetch: false,
	//				expand: params.expand,
					showRightMenu: false,
					showIcon: params.showIcon,
					showCheckbox: params.showCheckbox,
					onClick: function (thisTR) {
						that.clickAreaTreeFun();
					}
				}
				this.treeGrid = Newtec.TreeGrid.create(leftParams);
				this.getAreaNodeData();
				return thisJQ;
			},
			//获取区划树数据，并进行缓存
			getAreaNodeData: function(){
				var that = this;
				that.ds.fetchData({
					operId: "getAllAreaNodeList",
					callback: function (res) {
						var areaDatas = res.data;
						that.setAreaTreeData(areaDatas);
					}
				});
			},
			setAreaTreeData: function(areaDatas){
				var treeGrid = this.treeGrid;
				areaDatas.sort(function(obj1,obj2){
				    var val1 = obj1.sort;
				    var val2 = obj2.sort;
				    if(val1 < val2){
				       return -1;
				    }else if(val1 > val2){
				       return 1;
				    }else{
				       return 0;
				    }
				})
				this.areaDatas = areaDatas;
				for(var i = 0; i < areaDatas.length; i++){
					delete areaDatas[i].isFolder;
				}
				treeGrid.setData(areaDatas, true);
				setTimeout(function(){
					var nodes = treeGrid.getRootNodes()
					console.info("nodes=================>", nodes);
//					treeGrid.expand(treeGrid.getRoot());
				},500);
			},
			//点击区划树显示数据在表单上
			clickAreaTreeFun: function(){
				var that = this;
				var selectArea = that.treeGrid.getSelectedRecords();
				delete selectArea.children;
				var updateForm = that.updateForm;
				if(Newtec.Utils.isNull(updateForm)){
					that.updateForm = updateForm = that.createForm(true);
					that.rightJQ.append(updateForm.newtecJQ);
				}
	//			selectArea.parentId || (selectArea.parentId = '');
				updateForm.setValues(selectArea);
			},
			//创建右上方点击按钮
			createheaddiv: function (leftId) {
				var that = this;
				var btnHeadDiv = $("<div class = 'treePage_right_head' style = 'background:#eee;padding:5px 5px 5px 10px;"
					+"font-size:16px;margin-bottom:10px;'><span>行政区划属性维护</span></div>");
				btnHeadDiv.append(Newtec.Button.create({title: "删除", className: "pull-right btn btn-danger buton",
					click: function(){
						that.deleteArea();
					}
				}).newtecJQ)
				.append(Newtec.Button.create({title: "修改", className: "pull-right btn btn-warning buton",
					click: function(){
						that.updateArea();
						
					}
				}).newtecJQ)
				.append(Newtec.Button.create({title: "新增", className: "pull-right btn btn-success buton",
					click: function(){
						that.addArea();
				}}).newtecJQ);
				return btnHeadDiv;
			},
			/**
			 * 创建表单
			 * isUpdate: 是否为更新表单 
			 * param: 表单参数
			 * return form
			 */
			createForm: function (isUpdate, param) {
				var that = this;
				if(Newtec.Utils.isNull(param)){
					param = this.rightParams;
				}
				var form = '', areaNodeds = Newtec.DS.create("areaNodeDS");//fields = ds['fields']
				var fields = [{"name":"id","title":"id","type":"text","hidden":true},
					{"name":"name","title":"区划名称","type":"text","redstar":true,required:"区划名称不能为空",
						blurFun: function(textJQ){that.inputName(that, textJQ,isUpdate)}},
					{"name":"parentId","title":"上级区划名称","type":"select","value":"1","showDownIcon":true,
						change: function(textJQ){that.inputParentId(that, textJQ,isUpdate)},
						"ds":{"name":"areaNode","startRow":-1,"select":["id","name"],"sortBy":{"id":"desc","name":"asc"}}},
	//				{"name":"code","title":"城市代码","type":"text","redstar":true,"readonly":true,"disabled":true},
					{"name":"cityCode","title":"城市区划代码","type":"text","hidden":false,"readonly":false,"redstar":true,"disabled":false,"required":"城市区划代码不能为空"},
					{"name":"fullName","title":"区划名称全路径","redstar":true,"required":"区划名称全路径不能为空","readonly":true,"disabled":true},
					{"name":"sort","title":"排序","type":"text", vilaType: "number"},
					{"name":"status","title":"状态","type":"select","data":{0:'启用',1:'禁用'},"showDownIcon":true,"redstar":true,"required":"状态不能为空"},
					{"name":"remark","title":"描述","type":"text"},
					{"name":"rootid","title":"rootid","type":"text","hidden":true},
	//				{"name":"isfolder","title":"是否目录","type":"text"},
					{"name":"hasUnit","title":"has_unit","type":"text","hidden":true,"readonly":false,"disabled":false}
				]
				param.fields = fields;
				form = Newtec.Form.create(param);
				return form;
			},
			//填入区划名称自动生成区划名称全路径
			inputName: function(that, textJQ, isUpdate){
				var name = textJQ.getValue();
				var data = that.treeGrid.getSelectedRecords();
				var form = '';
				if(isUpdate){//更新的表单
					form = that.updateForm;
					if(data.code == "1"){
						var fullName = "/"+ name +"/";
						var parentId = '';
						form.setValues({'fullName':fullName,'parentId':parentId});
					}else{
						var datas = Newtec.SessionStorage.getItem("areaNodeData",true);
						var fullName = '';
						for(var i = 0; i < datas.length; i++){
							if(datas[i].id == data.parentId){
								fullName = datas[i].fullName;
								break;
							}
						}
						var fullNameNew = fullName+name+"/"
						form.setValues({'fullName':fullNameNew})
					}
				}else{
					that.addForm.setValues({'fullName':data.fullName+name+"/"})
				}
			},
			//填入父id自动生成区划名称全路径和城市代码------暂时屏蔽
			inputParentId: function(that, textJQ, isUpdate){
				return;
				var form = '';
				if(isUpdate){//更新的表单
					form = that.updateForm;
				}else{
					form = that.addForm;
				}
				var values = form.getAllValues()
				var name = values['name'];
				name = name? name+"/":'';
				var parentId = values['parentId'];
				if(Newtec.Utils.isNull( parentId)){
					return;
				}
				var fullName = '';
				form.setValues({'fullName':fullNameNew});
				var datas = Newtec.SessionStorage.getItem("areaNodeData",true);
				for(var i = 0; i < datas.length; i++){
					if(datas[i].id == parentId){
						fullName = datas[i].full_name;
						break;
					}
				}
				var fullNameNew = fullName+ name;
				form.setValues({'fullName':fullNameNew})
				areaNodeds.fetchData({
					operId: "getMaxCode",
					data: values,
					callback: function(res){
						//父节点时不调用方法
						if(values.code == '1'){
							return
						}
						if(res.status == 0 ){
							var data = res.data
							var code = data['code']
							form.setValue('code',code);
						}else{
							Newtec.Window.createHint({html:res.error, className:'btn btn-danger'})
						}
					}
				})	
			},
			//删除行政区划
			deleteArea: function(){
				var that = this;
				var selectArea = that.treeGrid.getSelectedRecords();
				if(Newtec.Utils.isNull(selectArea)){
					Newtec.Window.hint("请选择需要删除的节点");
					return 
				}
				Newtec.Window.createConfirm({title:'删除行政区划信息',noTitle:'取消',okTitle:'删除',html:'<span>确定删除该行政区划吗?</span>',okClass:'btn btn-danger',execute:function(isTrue){
					if(isTrue){
						that.areaNodeds.removeData({
							operId: "deleteAreaNode",
							data: {id: selectArea.id},
							callback: function (res) {
								if(res.status == 0){
									Newtec.Window.createHint({html:"删除成功!"})
									that.updateForm.clearValues();
									that.treeGrid.removeRecords({id: selectArea.id});
									var datas = that.areaDatas;
									for(var i = 0; i < datas.length; i++){
										if(datas[i].id == selectArea.id){
											datas.splice(i,1);
										}
									}
									that.areaDatas = datas;
								}else{
									Newtec.Window.createHint({html:res.error, className:'btn btn-danger'})
								}
							}
						})
					}
				}})
			},
			//增加行政区划
			addArea: function(){
				var that = this;
				var selectArea = that.treeGrid.getSelectedRecords();
				if(Newtec.Utils.isNull(selectArea)){
					Newtec.Window.hint("请选择需要增加的父节点");
					return 
				}
				var addFormParam = {
					titleColumn: 3,
					columnNum: 1,
					operType:Newtec.DS.OperType.add,
					ds: that.ds
				};
				var addForm = that.createForm(false,addFormParam);
				addForm.setValues({parentId: selectArea.id});
				var addBtn = Newtec.Button.create({
					title: '增加',
					click: function (e) {
						if(!addForm.validate()) return;
						var data = addForm.getAllValues();
						data['rootId'] = data['rootId']||'1';
						data['personName'] = Newtec.Person.get().name;
						console.info("1234151===================>", data);
						that.ds.addData({
							operId:'addAreaNode',
							data:data,
							callback:function (res) {
								if(res.status == 0) {
									Newtec.Window.hint("添加成功");
									//缓存新加的数据
									var datas = that.areaDatas;
									datas.push(res.data);
									that.treeGrid.addRecords(res.data);
									that.areaDatas = datas;
									win.close();
								}else{
									if(res.error.search("UNIQUE_AREANODE_CITYCODE") != -1){
										Newtec.Window.createHint({html:"城市区划代码已经存在", className:'btn btn-danger'})
									}else{
										Newtec.Window.createHint({html:res.error, className:'btn btn-danger'})
									}
								}
							}
						})
					}
				})
				win = Newtec.Window.create({
					title: '增加区划单位',
					width: 600,
					height: 500,
					body: addForm,
					footer: addBtn
				})
				that.addForm = addForm;
			},
			//修改行政区划
			updateArea: function(){
				var that = this;
				console.info("name============>",that);
				var selectArea = that.treeGrid.getSelectedRecords();
				if(Newtec.Utils.isNull(selectArea)){
					Newtec.Window.hint("请选择需要修改的节点");
					return 
				}
				if(!that.updateForm.validate()) return;
				var values = that.updateForm.getAllValues();
				var isFolder = values['isFolder'];
				var parentId = values['parentId'];
	        	if(isFolder=="true"&&that.parentIdOld!=parentId){
	        		Newtec.Window.createHint({html:"无法更改有下级区域的行政区域", className:'btn btn-danger'})
	        		return
	        	}
	        	values['rootId'] = values['rootId']||'1';
	    		values['hasUnit'] = values['rootId']||'0';
	    		values['lastTime'] = getNowFormatDate();
				that.ds.updateData({
					data: values,
					operId:'updateAreaNode',
					callback: function(res) {
						if(res.status == 0) {
							Newtec.Window.hint("修改成功");
	        				that.treeGrid.updateRecords(values);
	        				var datas = that.areaDatas;
							for(var i = 0; i < datas.length; i++){
								if(datas[i].id == values.id){
									datas[i] = values;
								}
							}
//							that.setAreaTreeData(datas);
							that.areaDatas = datas;
						}else{
							Newtec.Window.createHint({html:res.error, className:'btn btn-danger'})
						}
					}
				})
			},
			finsh: function (params) {
				this.leftJQ.mCustomScrollbar({
					theme: "minimal-dark",
					scrollInertia: 200
				})
	//			this.rightJQ.mCustomScrollbar({
	//				theme: "minimal-dark",
	//				scrollInertia: 200
	//			})
			}
		})
		function getNowFormatDate() {
			var date = new Date()
			var seperator1 = "-"
			var seperator2 = ":"
			var month = date.getMonth() + 1
			var strDate = date.getDate()
			var hours = date.getHours()
			var minutes = date.getMinutes()
			var seconds = date.getSeconds()
			if (month >= 1 && month <= 9) {
				month = "0" + month
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate
			}
			if (hours >= 0 && hours <= 9) {
				hours = "0" + hours
			}
			if (minutes >= 0 && minutes <= 9) {
				minutes = "0" + minutes
			}
			if (seconds >= 0 && seconds <= 9) {
				seconds = "0" + seconds
			}
			var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
					+ " " + hours + seperator2 + minutes + seperator2 + seconds
			return currentdate
		}
		Newtec.Module("AreaTreepage")
})();