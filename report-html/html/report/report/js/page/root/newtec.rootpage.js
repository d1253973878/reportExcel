/**
 * 鎻忚堪锛氬畾涔夋渶鍩烘湰鐨勪笁灞傜粨鏋勶細top ,content,foot 椤甸潰锛氶�氱敤椤甸潰
 * @author
 */
Newtec.Component([{js: "report.js", src: "report/js/" }],
	[{ css: "lizard.rootpage.css", src: "report/css/" },
	{ css: "iconfont.css", src: "report/css/" }],
	function () {
		if (Newtec.RootPage) {
			console.error("newtec.rootpage.js宸茬粡瀛樺湪");
			return;
		}
		Newtec.Button || Newtec.Utils.addJS("newtec.widget.js", "myqdp/js/widget/");
		document.title = AppParam.application.pageHint;
		Newtec.RootPage = function (params) {
			// 榛樿
			this.defaults = {
				appendTo: 'body',
				showTop: true,
				showPContent: true,
				systemTitle: AppParam.application.applicationTitle,
				menus: [{
					id: '689de407d275479d84f60028de64e9ee',
					title: '妯″瀷绠＄悊',
					src: 'processManager.html',
					// src: 'processDesign.html',
					defaultIcon: 'menu_i_experiment_management_normal',
					pressIcon: 'menu_i_experiment_management_pressed',
					click: function (btnJq) {}
				}, {
					id: '013adbc5e0e3478cb0d40a2b0625acd2',
					title: '鏁版嵁闆嗙鐞�',
					src: 'datasetManager.html',
					defaultIcon: 'menu_i_data_set_normal',
					pressIcon: 'menu_i_data_set_pressed',
					click: function (btnJq) {}
				}, {
					id: '12a92dace658482c93fb7fb40b790558',
					title: '鏈嶅姟绠＄悊',
					src: 'serviceManager.html',
					defaultIcon: 'menu_i_service_management_normal',
					pressIcon: 'menu_i_service_management_pressed',
					click: function (btnJq) {}
				}, {
					id: 'ccae4204ab3c453f8fbec54d5a19acb4',
					title: '妯″瀷鑷涔�',
					src: 'autoModelManager.html',
					defaultIcon: 'menu_i_model_selflearning_normal',
					pressIcon: 'menu_i_model_selflearning_pressed',
					click: function (btnJq) {}
				}]
			};
			this.bodyClickEvent = [];
			this.windowScrollEvent = [];
			this.windowResizeEvent = [];

			var that = this;
			// 娑堟伅锛堜换鍔＄殑娑堟伅锛夊鐞嗗櫒瀵硅薄
			this.messageHanddler = {
				bodyClick: function(data){
					that.bodyClick();
				},
				jump: function (params) {
					that.jumpToPage(params);
				}
			},
			$.extend(true, this.defaults, params);
		};
		Newtec.RootPage.exte(Newtec.Base, 'rootpage');
		Newtec.RootPage.over({
			createNewtecJQ: function () {
				$_.fetchData({
					operServiceId: 'reportService',
					operId: 'queryAllReport',
					showLoading: false,
					data: {
						taskId: 123
					},
					callback: function (res) {
						console.info('res', res)
					}
				});
				var pageThis = this,
					htmlBody = $('body'),
					defaults = this.defaults,
					pageJq = pageThis.getPageRootJq();
				this.createPageBefore(pageJq);
				// 椤堕儴淇℃伅鏍�
				if(defaults.showTop){
					pageThis.setTopBodyBefore(pageJq);
					pageJq.append(pageThis.setTopBody(pageJq));
					pageThis.setTopBodyAfter(pageJq);
				}
				// 搴曢儴璺熼〉闈俊鎭�
				pageThis.setBottomBodyBefore(pageJq);
				pageJq.append(pageThis.setBottomBody(pageJq));
				pageThis.setBottomBodyAfter(pageJq);
				
				htmlBody.append(pageJq);
				// 閫忔槑鑳屾櫙灞�
				htmlBody.append("<div class='bg-shadow' style='display:none;width: 100%;height: 100%;background: rgb(0,0,1);position: fixed;top: 0px;left: 0px;z-index: 998;opacity: 0.2;'></div>");
				// 鑳屾櫙灞傜偣鍑讳簨浠�
				htmlBody.find(".bg-shadow").click(function () {
					htmlBody.find(".bg-shadow").css("display", "none");
				});
				pageThis.createPageAfter(pageJq);
				return pageJq;
			},
			getPageRootJq: function(){
				return $("<div class='root-page'></div>");
			},
			setTopBody: function(pageJq){
				var topJq = $("<div class='page-top'>"
				+ "	<div class='page-top-left'>"
				+ "		<img class='system-icon' src='" + $_.iconBasePath + "logo.png'>"
				+ "		<label class='system-title'>" + this.defaults.systemTitle + "</label>"
				+ "	</div>"
				+ "	<div class='page-top-right'>"
				+ "		<div class='log-out'><span class='glyphicon glyphicon-log-out'></span>&nbsp;閫�鍑�</div>"	
				+ "		<div class='to-sso-main'><a href='" + $_.ssoMainUrl + "'>杩斿洖涓婚〉闈�</a></div>"
				+ "		<div class='user-info'><span class='glyphicon glyphicon-user'></span>&nbsp;" + (!$_.person ? "鏃犲悕" : $_.person.personName) + "</div>"
				+ "	</div>"
				+ "</div>")
				topJq.find('.log-out').click(function(){
					$_.Utils.loginOut();
				});
				return topJq;
			},
			setBottomBody: function(pageJq){
				var bottomJq = $("<div class='page-bottom'></div>");
				bottomJq.append(this.getBottomMenu(pageJq));
				bottomJq.append(this.getBottomRightBody(pageJq));
				return bottomJq;
			},
			/**
			 * 璁剧疆搴曢儴鑿滃崟鏍�
			 */
			getBottomMenu: function(pageJq){
				var that = this,
					defaults = that.defaults,
					menus = defaults.menus,
					menusJq = $("<div class='page-bottom-left page-menus'></div>");
				var menusInfo = this.menusInfo = {}; // 鑿滃崟淇℃伅
				var tabsInfo = this.tabsInfo = {}; // 鏍囩淇℃伅
				if(Newtec.Utils.isArray(menus)){
					for(let menu of menus){
						let menuId = menu.id || Newtec.Utils.uuid(32);
						let menuJq = $("<div class='page-menu-item" + (menu.className ? " "+menu.className : "") + "' data-id='" + menuId + "'>"
						+ $_.getIcon(menu.defaultIcon) + "<div class='menu-title'>" + (menu.title || "") + "</div>"
						+ "</div>");
						let infoItem = $.extend({}, menu);
						infoItem.jq = menuJq;
						infoItem.id = menuId;
						menusInfo[menuId] = infoItem;
						tabsInfo[menuId] = {id: menuId, src: menu.src, title: menu.title}
						menusJq.append(menuJq);
					}
				}
				this.menusJq = menusJq;
				menusJq.on('click', '.page-menu-item', function(event){
					var self = $(this),
						id = self.data('id'),
						menuInfo = menusInfo[id]
						clickFuc = menuInfo.click;
					that.toggleMenuByNode(self, menuInfo.pressIcon); // 鍒囨崲鑿滃崟鐘舵��
					Newtec.Utils.isFunction() && clickFuc(menuInfo, event)
					that.openPageByMenu(id); // 鎵撳紑椤甸潰
				});
				// 榛樿鎵撳紑绗竴涓彍鍗曟爣绛�
				setTimeout(function(){
					menusJq.find('.page-menu-item:first-child').click();
				}, 200);
				return menusJq;
			},
			/**
			 * 閫氳繃鑿滃崟 JQuery 瀵硅薄鍒囨崲鑿滃崟鐘舵��
			 * @param {JQuery} node 鑿滃崟 JQuery 瀵硅薄
			 */
			toggleMenuByNode: function(node, icon){
				this.clearMenuStatus();
				node.find("img").attr('src', icon)
				node.addClass('active');
			},

			/**
			 * 鏍规嵁鑿滃崟 id 鍒囨崲鑿滃崟鐘舵��
			 * @param {String} id 鑿滃崟 id
			 */
			toggleMenuById: function(id){
				var menuInfo = this.menusInfo[id];
				menuInfo && this.toggleMenuByNode(menuInfo.jq, menuInfo.pressIcon);
			},

			/**
			 * 娓呴櫎鎵�鏈夎彍鍗曠殑鐘舵��
			 */
			clearMenuStatus: function(){
				var $menu = this.menusJq.find('.page-menu-item.active'),
					menuInfo = this.menusInfo[$menu.data('id')];
				if(!menuInfo) return;
				$menu.find("img").attr('src', menuInfo.defaultIcon);
				$menu.removeClass('active');
			},

			/**
			 * 鏍规嵁鑿滃崟 id 鏉ユ墦寮�椤甸潰
			 * @param {String} menuId 鑿滃崟id
			 * @param {String} isFefresh 鏄惁鍒锋柊椤甸潰
			 */
			openPageByMenu: function(menuId, isFefresh){
				var menuInfo = this.menusInfo[menuId];
				if(!menuInfo) return;
				this.openPage(menuInfo.id, menuInfo.src, menuInfo.title, isFefresh);
			},
			/**
			 * 寮�鍚〉闈�
			 * @param {String} id 椤甸潰id
			 * @param {String} src 椤甸潰鍦板潃
			 * @param {String} title tab 鏍囩鏍囬
			 * @param {String} isFefresh 鏄惁鍒锋柊椤甸潰
			 */
			openPage: function(id, src, title, isFefresh){
				var tabsInfo = this.tabsInfo,
					menusInfo = this.menusInfo[id],
					tabInfo = tabsInfo[id] || menusInfo;
				if(!menusInfo) this.clearMenuStatus();
				if(!tabInfo && (!src || !title)){
					console.error("src鎴杢itle涓嶅厑璁镐负绌�");
					return;
				}
				src = src || tabInfo.src;
				title = title || tabInfo.title;
				if(!tabInfo){
					tabsInfo[id] = {id: id, src: src, title: title}
				}
				var	tabsJq = this.tabsJq,
					iframesJq = this.iframesJq,
					tab = tabsJq.find(".history-tab-item[data-id=" + id + "]"), // 鎵惧埌瀵瑰簲鐨� tab 鏍囩
					iframe = iframesJq.find("#"+id); // 鎵惧埌瀵瑰簲鐨刬frame
				// 鍒囨崲鏍囩
				this.getCurrentPageTab().removeClass('active');
				if(tab.length < 1){
					var newTab = this.createTab(id, title);
					newTab.addClass('active');
				} else{
					tab.addClass('active');
				}
				src = $_.Config.pageServlet + src;
				// iframe 鏍囩
				iframesJq.find("iframe").hide();
				iframe = iframe.length < 1 ? this.createIframe(id, src) : iframe;
				iframe.show();
				if(isFefresh){
					iframe.get(0).contentWindow.location.reload(true); // 鍒锋柊 iframe
				} else if(src != iframe.attr('src')) {
					iframe.attr('src', src); // 鍒锋柊 iframe
				}
				this.updatePreviousAndNextTabStatus(); // 鏇存柊鍓嶈繘鍜屽悗閫�鎸夐挳鐨勭姸鎬�
				this.toggleMenuById(id); // 濡傛灉椤甸潰鏈夊搴旂殑鑿滃崟鏍囩锛屽垯鍒囨崲鑿滃崟鐨勭姸鎬�
			},
			/**
			 * 鎵撳紑鍓嶄竴涓〉闈�
			 */
			openPreviousPage: function(){
				var tab = this.getCurrentPageTab();
				if(tab.length < 1) return;
				var previous = tab.prev();
				if(previous.length < 1) return;
				this.openPage(previous.data("id"));
			},
			/**
			 * 鎵撳紑鍚庝竴涓〉闈�
			 */
			openNextPage: function(){
				var tab = this.getCurrentPageTab();
				if(tab.length < 1) return;
				var next = tab.next();
				if(next.length < 1) return;
				this.openPage(next.data("id"));
			},
			/**
			 * 鏇存柊鍓嶈繘鎴栧悗閫�鎸夐挳鐨勭姸鎬�
			 */
			updatePreviousAndNextTabStatus: function(){
				var curTab = this.getCurrentPageTab();
				if(curTab.length < 1) return;
				var previouTab = this.previouTab,
					nextTab = this.nextTab;
				curTab.prev().length > 0 ? previouTab.removeClass('lizard-disabled') : previouTab.addClass('lizard-disabled');
				curTab.next().length > 0 ? nextTab.removeClass('lizard-disabled') : nextTab.addClass('lizard-disabled');
			},
			postClickEvent: function(){
				var iframeJq = this.getCurrentPage();
				if(!iframeJq || iframeJq.length < 1) return;
				this.postMessage(iframeJq.get(0).contentWindow, 'bodyClick');
			},
			getCurrentPageTab: function(){
				return this.tabsJq.find(".history-tab-item.active");
			},

			getCurrentPage: function(){
				var tab = this.getCurrentPageTab();
				if(tab.length < 1) return;
				return this.iframesJq.find('#'+tab.data('id'));
			},
			/**
			 * 绉婚櫎椤甸潰
			 * @param {String} id 椤甸潰id
			 */
			removePage: function(id){
				var	that = this,
					tabsJq = that.tabsJq,
					tab = tabsJq.find(".history-tab-item[data-id=" + id + "]");
				// 绉婚櫎椤甸潰瀵瑰簲 tab 鏍囩
				if(tab.length < 1) return;
				var preTab = tab.prev(),
					nextTab = tab.next(), // 绉婚櫎椤甸潰鍚庨粯璁ゆ樉绀哄墠涓�涓� tab 鏍囩瀵瑰簲鐨勯〉闈紝濡傛灉涓嶅瓨鍦紝鍒欏悗涓�涓� tab 鏍囩瀵瑰簲鐨勯〉闈�
					nextId = preTab.length > 0 ? preTab.data('id') : nextTab.length > 0 ? nextTab.data('id') : '';
				that.removeIframe(id); // 绉婚櫎iframe
				tab.remove();
				delete that.tabsInfo[id];
				// 濡傛灉娌℃湁 tab 椤甸潰鍙互鏄剧ず锛屽垯娓呴櫎鑿滃崟鐨勯�変腑鐘舵��
				nextId ? that.openPage(nextId) : this.clearMenuStatus();
			},
			/**
			 * 鍏抽棴鎵�鏈夐〉闈�
			 * @param {String} excludes 涓嶉渶瑕佸叧闂殑椤甸潰id锛岀敤閫楀彿鍒嗛殧杩炴帴锛屽id1,id2,id3
			 */
			closeAllPage: function(excludes){
				var tabsInfo = this.tabsInfo;
				var ids = [];
				for(let key in tabsInfo){
					ids.push(key);
				}
				if(excludes){
					excludes = excludes.split(',');
				}
				for(let id of ids){
					if(excludes && excludes.indexOf(id) != -1) continue;
					this.removePage(id);
				}
			},
			getBottomRightBody: function(pageJq){
				var that = this,
					rightJq = $("<div class='page-bottom-right'>"
					+ "  <div class='child-page-tools'>"
					+ "    <div class='history-tabs'></div>"
					+ "    <div class='history-tab-tools'>"
					+ "      <div class='previou-tab lizard-disabled'><span class='glyphicon glyphicon-backward'></span></div>"
					+ "      <div class='next-tab lizard-disabled'><span class='glyphicon glyphicon-forward'></span></div>"
					+ "      <div class='batch-remove'>鍏抽棴鎿嶄綔&nbsp;<span class='glyphicon glyphicon-play'></span></div>"
					+ "    </div>"
					+ "  </div>"
					+ "</div>");
				that.iframesJq = $("<div class='child-page-content'></div>");
				rightJq.append(that.iframesJq);
				var tabsJq = that.tabsJq = rightJq.find('.history-tabs');
				tabsJq.on('click', '.history-tab-item', function(){
					that.openPage($(this).data('id'));
				});

				that.previouTab = rightJq.find('.previou-tab');
				that.nextTab = rightJq.find('.next-tab')

				that.previouTab.click(function(){
					that.openPreviousPage();
				});

				that.nextTab.click(function(){
					that.openNextPage();
				});

				var betchSelectJq = $("<div class='batch-select'>"
					+ "  <div class='batch-select-item'>鍏抽棴鍏ㄩ儴閫夐」鍗�</div>"
					+ "  <div class='batch-select-item'>鍏抽棴鍏朵粬閫夐」鍗�</div>"
					+ "</div>");
				rightJq.find('.batch-remove').click(function(){
					var self = $(this), offset = self.offset();
					betchSelectJq.css({top: offset.top+self.height()+4, left: offset.left-(betchSelectJq.width()-self.width())})
					betchSelectJq.show();
					return false
				});

				// 鐐瑰嚮椤甸潰鍏朵粬浣嶇疆锛屽叧闂�夋嫨妗�
				this.bodyClickEvent.push(function(){
					betchSelectJq.hide();
				});

				betchSelectJq.find('.batch-select-item').click(function(){
					if(this.innerHTML == "鍏抽棴鍏ㄩ儴閫夐」鍗�"){
						that.closeAllPage();
					}else{
						var currentTab = that.getCurrentPageTab();
						currentTab && that.closeAllPage(currentTab.data('id'));
					}
				});

				pageJq.append(betchSelectJq);
				return rightJq;
			},
			createIframe: function(id, src, className){
				var iframeJq = $("<iframe id='" + id + "' src='" + src + "' class='child-iframe" + (className ? ' '+className : '') + "' width='100%' height='100%' frameborder='0' seamless=''></iframe>");
				this.iframesJq.append(iframeJq);
				return iframeJq;
			},
			/**
			 * 绉婚櫎iframe
			 * @param {String} id 椤甸潰id
			 */
			removeIframe: function(id){
				this.iframesJq.find("#"+id).remove();
			},
			/**
			 * 鍒涘缓椤甸潰鏍囩
			 * @param {*} id 椤甸潰id
			 * @param {*} title 鏍囩鏍囬
			 */
			createTab: function(id, title){
				var that = this,
					tabJq = $("<div class='history-tab-item' data-id='" + id + "'>"
					+ "  <label class='mark-circle'></label>&nbsp;&nbsp;&nbsp;"
					+ "  <span>" + (title || '榛樿鏍囩') + "</span>&nbsp;&nbsp;"
					+ "  <span class='history-tab-refresh'>" + $_.getIcon('btn_refresh_normal ' + $_.autoToogleClass) + "</span>"
					+ "  <span class='history-tab-remove'>" + $_.getIcon('btn_close_normal ' + $_.autoToogleClass) + "</span>"
					+ "  </div>");
				that.tabsJq.append(tabJq);
				// 鍒锋柊椤甸潰
				tabJq.find('.history-tab-refresh').click(function(){
					that.openPage(id, null, null, true);
					return false;
				});
				// 绉婚櫎椤甸潰
				tabJq.find('.history-tab-remove').click(function(){
					that.removePage(id);
					return false;
				});
				return tabJq;
			},

			/**
			 * 澶勭悊瀛愰〉闈㈤〉闈㈣烦杞殑璇锋眰
			 * @param {Object} params 鍙傛暟
			 */
			jumpToPage: function (params) {
				var data = params.data,
					src = params.src || 'processDesign.html';
				if(data){
					src += "?params=" + JSON.stringify(data);
				}
				// 鏇挎崲鍦板潃涓殑%
				if(src.indexOf('%') > -1) {
					src = src.replace(/%/g, '%25')
				}
				src = encodeURIComponent(src);
				this.openPage(params.pageId, src, params.title || '榛樿鏍囬');
			},

			/**
			 * 鍙戦�� JSON 娑堟伅鍒板瓙椤甸潰
			 * @param {String} order 浠诲姟鍚�
			 * @param {Object} data 鏁版嵁
			 */
			postMessage: function(target, order, data){
				target && target.postMessage(JSON.stringify({order: order, data: data}), "*");
			},
			/**
			 * 澶勭悊瀛愰〉闈㈠彂閫佽繃鏉ョ殑娑堟伅
			 * @param {String} msg JSON瀛楃涓叉秷鎭�
			 */
			handleMessage: function(msg){
				var that = this, message;
				try {
					message = JSON.parse(msg); // 瑙ｆ瀽 JSON 娑堟伅
				} catch(err){
					// console.error(err);
				}
				if(!message || Newtec.Utils.isNull(message.order)) return;
				var handdler = that.messageHanddler[message.order]; // 娑堟伅瀵瑰簲鐨勫鐞嗗櫒
				Newtec.Utils.isFunction(handdler) && handdler(message.data);
			},
			/**
			 * 娣诲姞娑堟伅澶勭悊鍣�
			 */
			addHanddler: function(order, handdler){
				this.messageHanddler[order] = handdler;
			},
			/**
			 * 鍒犻櫎娑堟伅澶勭悊鍣�
			 */
			removeHanddler: function(order){
				delete this.messageHanddler[order];
			},
			bodyClick: function (e) {
				var bodyClickEvent = this.bodyClickEvent;
				for (let i = 0, len = bodyClickEvent.length; i < len; i++) {
					bodyClickEvent[i] && bodyClickEvent[i](e);
				}
			},
			windowResize: function (e) {
				var windowResizeEvent = this.windowResizeEvent;
				for (let i = 0, len = windowResizeEvent.length; i < len; i++) {
					windowResizeEvent[i] && windowResizeEvent[i](e);
				}
			},
			windowScroll: function (e) {
				var windowScrollEvent = this.windowScrollEvent;
				for (let i = 0, len = windowScrollEvent.length; i < len; i++) {
					windowScrollEvent[i] && windowScrollEvent[i](e);
				}
			},
			setTopBodyBefore: function (pageJq) { },
			setTopBodyAfter: function (pageJq) { },
			setBottomBodyBefore: function (pageJq) { },
			setBottomBodyAfter: function (pageJq) { },
			setContentBodyAfter: function (pageJq) { },
			createPageBefore: function (pageJq) { },
			createPageAfter: function (pageJq) {
				var that = this;
				$('body').on('click', function (e) {
					that.postClickEvent()
					that.bodyClick(e);
				});

				window.onscroll = function () {
					that.windowScroll();
			   	}
				$(window).resize(function (e) {
					that.windowResize(e);
				});
				window.addEventListener('message',function(event){
					if(event.origin != window.location.origin) return;
					// console.info("璺熼〉闈㈡敹鍒版潵鑷瓙椤甸潰鐨勬秷鎭細", event.data)
					that.handleMessage(event.data); // 澶勭悊鏁版嵁
				},false);
				$_.autoToggleIconPath(pageJq);
			},
		});

		function _getUrlParams(that) {
			return that.UrlParam = Newtec.Utils.getUrlParams();
		}
		Newtec.Module("RootPage");
	});