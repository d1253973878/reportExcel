;(function(){
	Newtec.Table||Newtec.Utils.addJS("widget/newtec.table.js");
	Newtec.Form||Newtec.Utils.addJS("widget/newtec.form.js");
	if(!Newtec.Utils.isNull(Newtec.LogPage))
			return
		Newtec.LogPage = function (params) {
	        //默认
	        this.defaults = {
	        	ds: "log"
	        };
	    };
	    var logDs = Newtec.DS.get("log");
	    Newtec.LogPage.exte(Newtec.Base,'logPage');
	    Newtec.LogPage.over({
			createNewtecJQ: function (params){
				var that = this;
				that.params = params;
				var appendTo = params.appendTo||"body";
				that.fetchData = {data: {} };
				var headJQ = $('<div class="top" style="height: 50px; padding:8px 5px"></div>');
				var bodyJQ = $('<div class="bottom" style="height: auto; top: 60px;bottom: 10px;left: 10px;right: 10px; position: absolute;min-width: 1180px;"></div>');
				headJQ.append(that.createHead());
				bodyJQ.append(that.createTable());
				return $(appendTo).append(headJQ).append(bodyJQ);
			},
			//搜索部分
			createHead: function(){
				var that = this;
				var headItems = $("<div ></div>");
				that.selectApp = that.createSelectApp();//下拉控件
				that.doubleTime = that.createDoubleTime();//时间控件
				var inputJQ = $('<div class="newtec-dateTime" " style="float: left"><input id="searchValue" type="text" maxlength="30" align="center" placeholder="请输入操作人"></div>');
				headItems.append(inputJQ).append(that.doubleTime.newtecJQ.css({"float":"left","margin":"0 20px"}))
					.append(that.selectApp.newtecJQ.css({"float":"left"}));
				//查询按钮
				var searchBtn = Newtec.Button.create({
					title: "查询",
					className: 'btn btn-primary',
					click: function(){
						var name = inputJQ.find("#searchValue").val();
						var time = that.doubleTime.getDate();
						var startTime = "";
						var endTime = "";
						if(!Newtec.Utils.isNull(time)){
							var times = time.split("~");
							startTime = times[0].replace(/(^\s*)|(\s*$)/g, ""); 
							endTime = times[1].replace(/(^\s*)|(\s*$)/g, ""); 
						}
						that.fetchData = {data: {name: name, startTime: startTime, endTime: endTime, appId: that.selectApp.getValue()}};
						console.info(that.fetchData);
	            		that.table.fetchData(that.fetchData);
					}
				})
				headItems.append(searchBtn.newtecJQ.css({"float":"left","margin-left":"20px","height": "32px","width": "70px"}));
	//			headItems.append(that.createFetchForm());
				return headItems;
			},
			//搜索表单
			createFetchForm: function(){
				var form = Newtec.Form.create({
					titleColumn: 0,
				    columnNum: 6,
				    fields: [
				        {name: "name",title:""},
				        {name: "status", title:"",ds: {name:'application', "select":["id","name"], "sortBy":{"id":"desc","name":"asc"}},
				        	search:false, type: "select",showDownIcon:true},
				        {name: "datetime",title:"", type:'datetime',isDouble: true}
				    ]
				})
				return form.newtecJQ;
			},
			//下拉控件
			createSelectApp: function(){
				var that = this;
				var selectApp = Newtec.MySelect.create({
	        		ds: {name:'application', "select":["id","name"], "sortBy":{"id":"desc","name":"asc"}},
	        		type: 'select',
	                showDownIcon:true,
	                mouseShow:false,
	                style:'border-color:transparent;',
	            	search:false,
	            	value: "请选择应用系统",
	            	change:function(selTath,element, checked, value,name){
	            		that.fetchData.data.appId = name;
	            		that.table.fetchData(that.fetchData);
	        		}
	        	}) ;
				return selectApp;
			},
			createDoubleTime: function(){
				var calendar2 = Newtec.DateTime.create({className:'cy-item',timeParams:{singleDatePicker:false}
				,change:function(text,start,end){
					beginTime=start;
					endTime=end;
					selectName="无";
	//				isMonth=$_Date.getDiffDays(start,end)>40;
	//				dataArr=isMonth?$_Date.getMonthBetween(start,end):$_Date.getDays(start,end);
	//				Newtec.Utils.isFunction(change)
	//				&&change(true,dataArr,beginTime,endTime,depId,cj_status,selectName,isMonth)
				}}); 
				return calendar2;
			},
			createDateTime: function(){
				var startTime = Newtec.DateTime.create({
					limitNow:true,
					mouseShow:false,
					canedit:false,
					timeParams:{
						showDropdowns : true,
						opens : "right",
						applyClass : "btn-small btn-success",
						cancelClass : "btn-small btn-warning",
						singleDatePicker : true
					}
				})
				var endTime = Newtec.DateTime.create({
					limitNow:true,
					mouseShow:false,
					canedit:false,
					timeParams:{
						showDropdowns : true,
						opens : "right",
						applyClass : "btn-small btn-success",
						cancelClass : "btn-small btn-warning",
						singleDatePicker : true
					}
				})
				var timebody = $("<div ></div>").append(startTime.newtecJQ)
					.append($("<span style='margin: 0 5px;'>至</span>")).append(endTime.newtecJQ);
				return timebody;
			},
			createTable: function(){
				var that = this;
				logDs.fields = [{name: "clientIp", title:"客户端ip",width:120},
					{name: "serverIp", title:"服务端ip",width:120},
					{name: "serverMac", title:"服务端mac地址"},
					{name: "person", title:"操作人"},
					{name: "applicationName", title:"应用名称"},
					{name: "ds", title:"数据源"},
					{name: "dsNameParam", title:"数据源名称"},
					{name: "method", title:"操作方法"},
					{name: "methodNameParam", title:"方法名称"},
					{name: "useTime", title:"使用时间",width:80},
					{name: "logType", title:"方法类型",width:80},
					{name: "time1", title:"操作时间"}];
				var table = Newtec.Table.create({ 
					ds: logDs,
					height: "100%",
					showHeader: false,
					showHeaderBtn: false,
					showFetchForm: false,
					autoFetch: true,
					fetchParam: {
						operId: "queryLog"
					},
					tdValueHtmlFun:function(value,data,a,b,colName){
						if(colName=="applicationName"){
							var appData = that.selectApp.mapData;
							if(!Newtec.Utils.isNull(data.applicationId)){
								value =appData[data.applicationId]&& appData[data.applicationId].name;
							}
							value = Newtec.Utils.isNull(value)?"运维管理系统":value;
			    		}
	//		    		else if(colName=="dsNameParam"){
	//		    			return  dsNameParam[data.ds];
	//		    		}else if(colName=="methodNameParam"){
	//		    			return  methodNameParam[data.method];
	//		    		}
						return value || ""
					}
				})
				this.table = table;
				return table.newtecJQ;
			}
		})
})();