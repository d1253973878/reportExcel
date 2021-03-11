; (function (Newtec) {
	if (typeof ($_) != 'undefined' && typeof ($_) != undefined) {
		return;
	}
	$_ = {
		iconBasePath: "/report/report/images/",
		autoToogleClass: 'auto-toogle-icon',
		// doubleWidthIcon: true
		lazyBtnClass: 'report-lazy-btn',
		lazyTime: 1500,
		ssoMainUrl: 'http://192.168.0.118:8181/newtec_sso1/MainIndexServlet?type=1'
	};
	var ulrParamsNo = {
		login: "", // 不要登录验证
	},
		ulrParams = {

		};

	var servlet = "webPageServlet?p=",
		host = 'http://localhost:16654',
		socketServer = "localhost:8889/report";
	$_.Config = {
		host: host,
		pageServlet: servlet,
		fetchUrl: host + "/reportRouterServlet"
	};
	var _ds = $_.ds = Newtec.DS.create("person");

	/**
	 * 访问后台方法
	 * params{
	 * 	operServiceId:访问服务名(必填)
	 *  operId:访问的方法名(必填)
	 *  data:请求后台的数据
	 *  callback:回调函数
	 * }
	 */
	$_.fetchData = function (params) {
		params.url = params.url || $_.Config.fetchUrl;
		params.token = $_.token;
		var callback = params.callback,
			exception = params.exception,
			loadingWin;
		// 是否显示 loading 提示
		if(params.showLoading !== false){
			Newtec.LizardWindow.create({
				name: 'Loading',
				content: params.loadingTip || '正在处理，请稍等....',
				createAfter: function(win){
					loadingWin = win;
				}
			});
		}
		params.callback = function(data){
			loadingWin && loadingWin.close(); // 关闭loading
			Newtec.Utils.isFunction(callback) && callback(data)
		}
		params.exception = function(res){
			loadingWin && loadingWin.close();
			var result;
			if(Newtec.Utils.isFunction(exception)){
				result = exception(res);
			}
			var text = res.responseText,
				error = text.error;
			if(!error){
				// 处理JSON中的双引号
				text = text.replace(/\"/g, "\\\"").replace(/\{[ ]*?\\\"/g, '{"').replace(/\\\"[ ]*?\}/g, '"}')
					.replace(/\\\"[ ]*?:/g, '":').replace(/:[ ]*?\\\"/g, ':"')
					.replace(/\\\"[ ]*?,/g, '",').replace(/,[ ]*?\\\"/g, ',"')
					.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
				text = JSON.parse(text);
				error = text.error;
			}
			if(result !== false){
				Newtec.LizardWindow.error(error);
			}
		}
		_ds.fetchData(params);
	}
	$_.updateData = function (params) {
		params.url = params.url || $_.Config.fetchUrl;
		_ds.updateData(params);
	}
	/**
	 * 上传文件的方法
	 * params{
	 * 	operServiceId:访问服务名(必填)
	 *  operId:访问的方法名(必填)
	 *  data:请求后台的数据
	 *  callback:回调函数
	 * }
	 */
	$_.uploadFile = function (params) {
		var callback = params.callback,
			exception = params.exception,
			loadingWin;
		// 是否显示 loading 提示
		if(params.showLoading !== false){
			Newtec.LizardWindow.create({name: 'Loading',
				content: params.loadingTip || '正在上传，请稍等....',
				createAfter: function(win){
					loadingWin = win;
				}
			});
		}
		params.callback = function(data){
			loadingWin && loadingWin.close(); // 关闭loading
			Newtec.Utils.isFunction(callback) && callback(data)
		}
		params.exception = function(res){
			loadingWin && loadingWin.close();
			var result;
			if(Newtec.Utils.isFunction(exception)){
				result = exception(res);
			}
			var text = res.responseText,
				error = text.error;
			if(!error){
				// 处理JSON中的双引号
				text = text.replace(/\"/g, "\\\"").replace(/\{[ ]*?\\\"/g, '{"').replace(/\\\"[ ]*?\}/g, '"}')
					.replace(/\\\"[ ]*?:/g, '":').replace(/:[ ]*?\\\"/g, ':"')
					.replace(/\\\"[ ]*?,/g, '",').replace(/,[ ]*?\\\"/g, ',"')
					.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
				text = JSON.parse(text);
				error = text.error;
			}
			if(result !== false){
				Newtec.LizardWindow.error(error);
			}
		}
		_ds.uploadFile(params);
	}
	$_.addData = function (params) {
		params.url = params.url || $_.Config.fetchUrl;
		_ds.addData(params);
	}
	$_.removeData = function (params) {
		params.url = params.url || $_.Config.fetchUrl;
		_ds.removeData(params);
	}

	/**
	 * 通过常规*_normal.png的图标名称得到*_hover.png激活图标名称
	 * @param {String} icon 常规图标 如 btn_i_more_normal.png
	 * @param {Boolean} deActive 获取未激活图标
	 */
	$_.getActiveIconName = function (icon, deActive) {
		var tmps = icon.split('_');
		if (tmps.length < 1) return;
		var last = tmps[tmps.length - 1],
			tmp = last.split('.');
		if (tmp.length != 2) return;
		tmps[tmps.length - 1] = (deActive ? 'normal.' : 'hover.') + tmp[1];
		var target = tmps.join('_');
		// console.info(deActive, icon + "  -->  " + target)
		return target;
	};

	/**
	 * 自动切换鼠标经过时的图标
	 */
	$_.autoToggleIconPath = function (pageJq) {
		pageJq.on("mouseenter", "." + $_.autoToogleClass, function () {
			$_.toggleIconPath($(this));
		});
		pageJq.on("mouseleave", "." + $_.autoToogleClass, function () {
			$_.toggleIconPath($(this), true);
		});
	}
	/**
	 * 切换图标
	 * @param {JQuery} $ele 触发元素
	 * @param {Boolean} deActive 非激活态
	 */
	$_.toggleIconPath = function ($ele, deActive) {
		var $img = $ele;
		if ($ele[0].tagName.toUpperCase() != 'IMG') {
			$img = $ele.find("img");
			if ($img.length < 1) return;
		}
		$img.attr('src', $_.getActiveIconName($img.attr('src'), deActive));
	};

	/**
	 * 需要在按钮上添加 report-lazy-btn 样式类。按钮点击一次后，按钮失效时间(ms)可以是默认的，$_.lazyTime
	 * 失效时间也可以是在调用bindLazyClick时传入的 time
	 * 失效时间也可以是按钮上配置的时间Class（配置TimeClass，如class='icon lazy100'，表示失效100ms）
	 * 优先级：TimeClass > time > $_.lazyTime
	 * @param {JQuery} $ele 绑定的元素
	 * @param {Number} time 多久内不可再次点击
	 */
	$_.bindLazyClick = function ($ele, time) {
		time = Number(time);
		$ele.on('click', '.' + $_.lazyBtnClass, function () {
			var $this = $(this);
			// 判断样式类上是否配置时间
			var classes = $this.attr('class'), tTime;
			if (classes) {
				var index = classes.startsWith('lazy') ? 0 : classes.lastIndexOf(' lazy');
				if (index != -1) {
					index = index == 0 ? index + 4 : index + 5;
					classes = classes.substring(index);
					index = classes.indexOf(' ');
					if (index != -1) {
						classes = classes.substring(0, index);
					}
					var tTime = Number(classes);
					time = isNaN(tTime) ? time : tTime;
				}
			}
			// 禁用按钮
			$this.addClass('disabled-click');
			// 在指定时长后启用按钮
			setTimeout(function () {
				$this.removeClass('disabled-click');
			}, isNaN(time) ? $_.lazyTime : time);
		});
	};

	$_.getIcon = function (className, title) {
		return "<span class='icon iconfont icon" + className + "'" + (title ? "title='" + title + "'" : "") + "></span>";
	};

	/**
	 * 简单格式化字符串
	 * @param {String} str 字符串
	 */
	$_.singleFormatStr = function (str, deafultV) {
		return !Newtec.Utils.isNull(str) ? str : !Newtec.Utils.isNull(deafultV) ? deafultV : "";
	};

	/**
	 * 获取URL参数
	 * @param {String} url URL
	 */
	$_.getUrlParams = function (url) {
		var paramsStr = decodeURIComponent(url);
		var startIndex = paramsStr.indexOf('=');
		if (startIndex == -1) return null;
		paramsStr = paramsStr.slice(startIndex + 1)
		return JSON.parse(paramsStr);
	}

	/**
	 * 
	 * @param {Object} args 可选，扩展 String.format方法
	 * 用法1: "姓名：{name}".format({name: 'zcf'})
	 * 用法2 "{0}, {0}, {1}, {1}".format(0, 1)
	 */
	String.prototype.format = function (args) {
		var result = this;
		if (arguments.length > 0) {
			if (arguments.length == 1 && typeof (args) == "object") {
				for (var key in args) {
					if (args[key] !== undefined) {
						var reg = new RegExp("({" + key + "})", "g");
						result = result.replace(reg, args[key]);
					}
				}
			}
			else {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] !== undefined) {
						//var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
						var reg2 = new RegExp("({)" + i + "(})", "g");
						result = result.replace(reg2, arguments[i]);
					}
				}
			}
		}
		return result;
	};

	/**
	 * 扩展日期格式化方法
	 */
	Date.prototype.format = function (fmt) {
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

	/**
	 * 计算字符串中英文混合时长度（中文+2，英文+1）
	 */
	String.prototype.len = function () {
		return this.replace(/[^\x00-\xff]/g, "aa").length;
	}


	/**
	 * @param String processId
	 * @param Function onopen
	 * @param Function onmessage
	 * @param Function onclose
	 */
	var allSockets = {};
	$_.openSocket = function (params) {
		if (!params) return;
		//如果浏览器支持WebSocket
		if (window.WebSocket && !Newtec.Utils.isNull(params.processId)) {
			let processId = params.processId, websocket = new WebSocket("ws://" + socketServer + "?" + processId);  //获得WebSocket对象

			//当有消息过来的时候触发
			websocket.onmessage = function (event) {
				// console.info('message', event.data);
				var onmessageFuc = params.onmessage;
				if (Newtec.Utils.isFunction(onmessageFuc)) {
					onmessageFuc(event.data);
				}
			}

			//连接关闭的时候触发
			websocket.onclose = function (event) {
				console.log('关闭连接。。。。');
				var closeFuc = params.onclose;
				if (Newtec.Utils.isFunction(closeFuc)) {
					closeFuc();
				}
			}

			// 连接打开的时候触发
			websocket.onopen = function (event) {
				console.log('建立连接。。。。');
				var onopenFuc = params.onopen;
				if (Newtec.Utils.isFunction(onopenFuc)) {
					onopenFuc();
				}
			}
			allSockets[processId] = websocket;
		} else {
			Newtec.Window.error("浏览器不支持WebSocket");
		}

		// function sendMsg(msg) { // 发送消息 
		// 	if(window.WebSocket){
		// 		if(websocket.readyState == WebSocket.OPEN) { // 如果WebSocket 是打开状态
		// 			websocket.send(msg); //send()发送消息
		// 		}
		// 	}else{
		// 		return;
		// 	}
		// }
	}

	$_.closeSocket = function (processId) {
		allSockets[processId] && allSockets[processId].close();
	}

	$_.Utils = {
		toPage: function (name, params, noNewWin) {
			//			this.setCrrPage(name);
			if (name == 'login') {
				this.goLoginPage();
				return;
			}
			//			var p=ulrParamsNo[name]&&(onCheckServlet+ulrParamsNo[name])||(servlet+ulrParams[name]);
			var p = servlet + name;
			for (var key in params) {
				p += "&" + key + "=" + params[key];
			}
			p += "&vt=" + new Date().getTime();
			if (noNewWin) {
				window.open(p);
			} else {
				window.location.href = p;
			}
		},
		setCrrPage: function (name) {
			Newtec.SessionStorage.setItem("crrp", name);
		},
		getCrrPage: function () {
			return Newtec.SessionStorage.getItem("crrp");
		},
		isCrrPage: function (name) {
			return this.getCrrPage() == name;
		},
		loginOut: function () {
			
			return true;
		},
		/*toPageNo:function(name,params,newWin){
			this.toPage(name,params,newWin===false?false:true,true);
			
		},*/
		goMainPage: function () {
			window.location.href = "mainpage.html";
			return true;
		},
		// goLoginPage: function () {
		// 	window.location.href = "login.html";
		// },
		loginSuccess: function () {
			$_.Person.setLoginStatus();
			var crrPage = this.getCrrPage();
			ulrParams[this.getCrrPage()] ? this.toPage(crrPage, null) : this.back();
		},
		// loginOut: function () {
		// 	$_.fetchData({
		// 		url: $_.Config.host + "/lockSmithManagerLogoutServlet",
		// 		callback: function (res) {
		// 			window.location.href = 'login.html';
		// 		}
		// 	});
		// },
		back: function () {
			document.referrer.indexOf(Newtec.project) >= 0
				&& window.history.back()
				|| this.goMainPage();
		},
		setThousandchart: function (num) {
			return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
		},
		/**
		 * 获取cookie中的某个值
		 */
		getCookie: function (key) {
			if (document.cookie) {
				var cookieArr = document.cookie.split('; ');
				for (var i = 0; i < cookieArr.length; i++) {
					var tmp = cookieArr[i].split('=');
					if (key == tmp[0]) {
						return decodeURIComponent(tmp[1]);
					}
				}
			}
		},
		/**
		 * 设置cookie
		 */
		setCookie: function (key, value) {
			if (!key || !value) return;
			document.cookie = key + '=' + encodeURIComponent(value);
		}
	}
	$_.dataCheck = {
		isPhone: function (phone) {
			return (/\d{3}-\d{8}|\d{4}-\d{7}/.test(phone))
		},
		isCellPhone: function (cellPhone) {
			return (/^1[34578]\d{9}$/.test(cellPhone))
		},
		isEmail: function (email) {
			var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			return myreg.test(email);
		},
		isNull: function (obj) {
			return Newtec.Utils.isNull(obj) || Newtec.Utils.isNull(obj.trim());
		}
	};
	var arrM = ["十二月", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月"];
	var now = new Date();                    //当前日期
	var nowDayOfWeek = now.getDay();         //今天本周的第几天
	var nowDay = now.getDate();              //当前日
	var nowMonth = now.getMonth();           //当前月
	var nowYear = now.getYear();             //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0;  //

	//格式化日期：yyyy-MM-dd
	function formatDate(date) {
		var myyear = date.getFullYear();
		var mymonth = date.getMonth() + 1;
		var myweekday = date.getDate();

		if (mymonth < 10) {
			mymonth = "0" + mymonth;
		}
		if (myweekday < 10) {
			myweekday = "0" + myweekday;
		}
		return (myyear + "-" + mymonth + "-" + myweekday);
	}
	$_Date = {
		//获得某月的天数
		getMonthDays: function (myMonth) {
			var monthStartDate = new Date(nowYear, myMonth, 1);
			var monthEndDate = new Date(nowYear, myMonth + 1, 1);
			var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
			return days;
		},

		//获得本季度的开始月份
		getQuarterStartMonth: function () {
			var quarterStartMonth = 0;
			if (nowMonth < 3) {
				quarterStartMonth = 0;
			}
			if (2 < nowMonth && nowMonth < 6) {
				quarterStartMonth = 3;
			}
			if (5 < nowMonth && nowMonth < 9) {
				quarterStartMonth = 6;
			}
			if (nowMonth > 8) {
				quarterStartMonth = 9;
			}
			return quarterStartMonth;
		},
		//获得本周的开始日期
		getWeekStartDate: function () {
			var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
			return weekStartDate.Format();
		},
		//获得本周的结束日期
		getWeekEndDate: function () {
			var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
			return weekEndDate.Format();
		},

		//获得本月的开始日期
		getMonthStartDate: function () {
			var monthStartDate = new Date(nowYear, nowMonth, 1);
			return monthStartDate.Format();
		},
		//获得本月的结束日期
		getMonthEndDate: function () {
			var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
			return formatDate(monthEndDate);
		},

		//获得本季度的开始日期
		getQuarterStartDate: function () {
			var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
			return quarterStartDate.Format();
		},
		//或的本季度的结束日期
		getQuarterEndDate: function () {
			var quarterEndMonth = getQuarterStartMonth() + 2;
			var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
			return quarterStartDate.Format();
		},
		addDate: function (date, days) {
			var d = new Date(date);
			d.setDate(d.getDate() + days);
			return d;
		},
		//日期加法
		addDateStr: function (date, days, format) {
			return this.addDate(date, days).Format(format);
		},
		/**
		 * 本周日期
		 */
		getNowWeeks: function (format) {
			var pre = now.getDay();
			var arr = [];
			for (; pre >= 0; pre--) {
				arr.push(this.addDateStr(now, -pre, format))
			}
			return arr;
		},
		/**
		 * 上周日期
		 */
		getPreWeeks: function () {
			var pre = now.getDay();
			var last = pre + 7
			var arr = [];
			for (; last > pre; last--) {
				arr.push(this.addDateStr(now, -last))
			}
			return arr;
		},
		/**
		 * 本月日期
		 */
		getNowMonths: function () {
			var pre = now.getDate() - 1;
			var arr = [];
			for (; pre >= 0; pre--) {
				arr.push(this.addDateStr(now, -pre))
			}
			return arr;
		},
		/**
		 * 上月日期
		 */
		getPreMonths: function () {
			var last = this.getMonthDays(nowMonth)
			console.info("====>>>>", last, nowMonth);
			var pre = now.getDate();
			last += pre - 2;
			var arr = [];
			for (; last >= pre; last--) {
				arr.push(this.addDateStr(now, -last))
			}
			return arr;
		},
		getDiffDays: function (strDateStart, strDateEnd) {
			var strSeparator = "-"; //日期分隔符
			var oDate1;
			var oDate2;
			var iDays;
			oDate1 = strDateStart.split(strSeparator);
			oDate2 = strDateEnd.split(strSeparator);
			var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
			var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
			iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数 
			return iDays;
		},
		getDays: function (strDateStart, strDateEnd) {
			var pre = this.getDiffDays(strDateStart, strDateEnd);
			var arr = [];
			var date = new Date(strDateEnd);
			console.info("===<<", pre, date);
			for (; pre >= 0; pre--) {
				arr.push(this.addDateStr(date, -pre))
			}
			return arr;
		},
		getMonthBetween: function (start, end) {
			var result = [];
			var s = start.split("-");
			var e = end.split("-");
			var min = new Date();
			var max = new Date();
			min.setFullYear(s[0], s[1]);
			max.setFullYear(e[0], e[1]);

			var arrMonth = [];
			var curr = min;
			while (curr <= max) {
				var month = curr.getMonth();
				curr.setMonth(month + 1);
				arrMonth.push(arrM[month]);
			}
			return arrMonth;
		},
		timeToMonth: function (strTime) {
			var m = new Date(strTime).getMonth() + 1;
			m = m == 12 ? 0 : m;
			return arrM[m];
		}
	}
	$_.Person = {
		person: null,
		setLoginStatus: function (login) {
			this.isLogin = true;
			Newtec.SessionStorage.setItem("loginStatus", login === false ? 0 : 1);
		},
		isLogin: false,
		toLogin: function () {

			return true;
		},
		setPerson: function (callback) {
			var that = this;
			_ds.fetchData({
				url: $_.Config.fetchUrl,
				operServiceId: 'personManager',
				operId: "getPerson",
				callback: function (res) {
					console.info('getPerson--', res);
					if (res.status == 0) {
						that.person = res['data'];
						//						that.person.ds='';that.person.pages='';
						//						that.person.apps='';that.person.nodes='';
						//						Newtec.SessionStorage.setItem("person",res['data']);
						if (that.person) that.isLogin = true;
					} else if (res.status == -4) {
						$_.Utils.goLoginPage();
					} else {
						Newtec.Window.hint("获取用户信息失败！！")
					}
					Newtec.Utils.isFunction(callback) && callback(res['data'])
				}
			})
			Newtec.Utils.isFunction(callback) && callback(that.person);
			return true;
		},
		getPerson: function (callback) {
			var person = this.person;
			(!person && this.setPerson(callback))
				|| Newtec.Utils.isFunction(callback) && callback(person);
		},
	}
	$_.error = {
		CELLPHONE: "请输入正确的手机号码！！",
		PHONE: "请输入正确的电话号码！！",
		EMAIL: '请输入正确的邮箱！！'
	}

	var personInfo = $_.Utils.getCookie('person');
	$_.token = $_.Utils.getCookie('JSESSIONID');
	if (personInfo) {
		personInfo = personInfo.split(',');
		$_.person = {
			personId: personInfo[0],
			personName: personInfo[1]
		};
	} else {
		$_.Utils.loginOut();
	}
})(Newtec);

