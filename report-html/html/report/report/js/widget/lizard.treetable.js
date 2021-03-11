/**
 * @author
 */
Newtec.Component([{ js: "bootstrap-treetable.js", src: "lizard/js/widget/" }, { js: "report.js", src: "report/js/" }],
	[{ css: "lizard.treetable.css", src: "lizard/css/" }],
	function () {
		if (Newtec.TreeTable) {
			console.error(" lizard.treetable.js 已经存在");
			return;
		}
		Newtec.TreeTable = function (params) {
			var that = this;
			// 默认
			this.defaults = {
				data: [],
				fields: [
					{ name: 'id', title: 'ID', hidden: false, center: true, width: 70, format: function () { } }
				],
				pidKey: 'parentId',
				idKey: 'id',
				tabBtnWidth: 150,
				tabBtns: [
					{
						tip: '属性',
						title: "<img class='" + $_.autoToogleClass + "' src='" + $_.iconBasePath + "i_attribute_normal.png'>",
						className: 'td-info',
						click: function (data) {

						}
					}
				],
				treeParam: {
					showTool: true,
				}
			};
			$.extend(true, this.defaults, params);
		};
		Newtec.TreeTable.exte(Newtec.Base, 'TreeTable');
		Newtec.TreeTable.over({
			createNewtecJQ: function (params) {
				this.treetable = this.createTreeTable(params.data);
				this.initOpenFolderEvent();
				return this.treetable;
			},
			initOpenFolderEvent: function () {
				var that = this,
					foldrOpenFuc = that.defaults.foldrOpenFuc;
				that.treetable.BootstrapTreeTable().on("show.bs.treetable", function (e, node) {
					var id = $(node).data('id'), pData = that.datas[id];
					Newtec.Utils.isFunction(foldrOpenFuc) && foldrOpenFuc(pData);
				});
			},
			/**
			 * 移除节点
			 * @param {*} id 节点id
			 * @param {*} isFolder 是否是文件夹节点
			 */
			removeNode: function (id, isFolder) {
				isFolder && this.treetable.BootstrapTreeTable('collapseById', id);
				this.treetable.BootstrapTreeTable('removeById', id);
				delete this.datas[id];
			},

			/**
			 * 筛选目录树
			 */
			filterAll: function () {
				this.treetable.BootstrapTreeTable('filterAll');
			},

			/**
			 * 插入新节点
			 * @param {Object} data 插入节点的数据
			 */
			appendNode: function (data) {
				var preId = this.getPreNodeId(data), // 插入的前一个节点的id
					pNode = this.treetable.find('tr[data-id=' + data.parentId + ']'), // 插入节点的层级
					level = Number(pNode.data('level')) + 1;
				this.treetable.BootstrapTreeTable('appendNode', preId, level, this.getTbodyTr(data));
				this.datas[data.id] = data;
			},
			/**
			 *  获取节点前一个节点的id
			 * @param {Object} data 节点数据
			 */
			getPreNodeId: function (data) {
				var datas = this.datas,
					parentId = data.parentId, // 父节点id
					preId = parentId, // 节点按序排列后其前一个节点的id
					isFolder = true, // 前一个节点的类型
					name = data.name, // 节点的名称
					tNodes = [],
					maxName = ''; // 在当前节点中小于节点名称的最大名称
				for (let key in datas) {
					let node = datas[key], nName = node.name.toLowerCase();
					if (node.parentId == parentId) {
						if (data.isFolder) { // 添加文件夹节点
							if ((node.isFolder && nName < name && nName > maxName)) {
								maxName = nName;
								preId = node.id;
								isFolder = node.isFolder;
							}
						} else { // 添加流程节点
							if ((node.isFolder && nName > maxName) // 当前节点是文件夹节点时，只需要文件夹节点大于当前最大名称即可
								|| (!node.isFolder && isFolder && nName < name) // 当前节点是流程节点时，并且上一个最大节点是文件夹节点时
								|| (!node.isFolder && !isFolder && nName < name && nName > maxName)) {  // 当前节点是流程节点时
								maxName = nName;
								preId = node.id;
								isFolder = node.isFolder;
							}
						}
					}
				}
				return preId;
			},

			/**
			 * 批量插入子节点
			 * @param {String} pid 父级节点id
			 * @param {Array} datas 节点的数据
			 */
			appendChildren: function (pid, children) {
				var datas = this.datas,
					nodes = [];
				if (Newtec.Utils.isArray(children)) {
					for (let data of children) {
						data.parentId = pid;
						datas[data.id] = data;
						nodes.push(this.getTbodyTr(data));
					}
				}
				this.treetable.BootstrapTreeTable('appendChildrenNode', pid, nodes);
			},

			/**
			 * 更新并显示右键菜单
			 * @param {Object} data 右键行的数据
			 * @param {JQuery} target 被点击的按钮 JQuery 对象
			 */
			updateAndShowMenu: function (data, parent, target) {
				if (!data || !target) return;
				var offset = target.offset(),
					popupMenu = this.$popupMenu,
					menus = this.menus;
				var cMenus = data.isFolder ? menus['nonleaf'] : menus['leaf'];
				// 更新显示菜单项
				popupMenu.empty();
				if (Array.isArray(cMenus)) {
					for (let menu of cMenus) {
						let $menu = $("<div class='popup-menu-item'>" + menu.title + "</div>");
						$menu.click(function () {
							menu.click(data, parent);
							popupMenu.hide();
						});
						popupMenu.append($menu);
					}
				}
				// 计算距离
				popupMenu.css({ top: offset.top + target.height() + 4, left: offset.left - (popupMenu.width() - target.width()) })
				popupMenu.show();
			},

			/**
			 * 创建表格+树
			 */
			createTreeTable: function (data) {
				var defaults = this.defaults;
				var treeParam = $.extend(true, {
					// levelSpacing: 20,//级次间距 px
					// column: 0,//指定排序列号
					expandlevel: 1,//默认展开级次
					expandAll: false,//是否全部展开
					collapseAll: false,//是否全部关闭
					expendedIcon: '<span class="glyphicon glyphicon-menu-up"></span>',//非叶子节点展开图标
					collapsedIcon: '<span class="glyphicon glyphicon-menu-right"></span>',//非叶子节点关闭图标
					nonLeafIcon: '',
					leafIcon: '',
					showTools: false,
					toolIcon: '',
					maxResult: ''//搜索最大结果集，超过将停止返回结果
				}, defaults.treeParam);
				this.treetable = this.createTable(data).BootstrapTreeTable(treeParam).on("initialized.bs.treetable", function () {
				});
				return this.treetable;
			},

			/**
			 * 创建表格
			 * @param {Array} data 表格数据
			 */
			createTable: function (data) {
				var $table = $("<table class='table table-hover table-bordered table-condensed treetable'></table>");
				$table.append(this.getThead());
				$table.append(this.getTbody(data));
				return $table;
			},

			/**
			 * 获取表格Tbody
			 * @param {Array} headers 标题
			 * @param {Object} data 数据
			 * @param {Array} tabs tab按钮
			 */
			getTbody: function (data) {
				var $tbody = $('<tbody></tbody>');
				var datas = this.datas = {};
				for (let item of data) {
					datas[item.id] = item;
					$tbody.append(this.getTbodyTr(item));
				}
				return $tbody;
			},

			/**
			 * 获取表格数据的行
			 * @param {Object} item 数据
			 */
			getTbodyTr: function (item) {
				var treeTableParams = this.defaults,
					headers = treeTableParams.fields,
					tabs = treeTableParams.tabBtns,
					tabBtnFuc = treeTableParams.tabBtnFuc,
					$tr = $("<tr data-id='" + (item[treeTableParams.idKey] || '') + "' data-pid='" + (item[treeTableParams.pidKey] || '') + "' data-leaf='" + (item.isFolder ? 0 : 1) + "'></tr>");
				for (let header of headers) {
					if (header.hidden) continue;
					var key = header.name,
						value = item[key],
						formatFuc = header.format; // 数据格式化方法
					value = Newtec.Utils.isFunction(formatFuc) ? formatFuc(value, item.isFolder) : (value || ''); // 数据格式化
					var className = header.center ? 'text-center' : '';
					className += header.className ? ' ' + header.className : '';
					$tr.append("<td" + (className ? " class='" + className + "'" : "") + ">" + value + "</td>");
				}
				// 添加 Tab 按钮
				var $toolTd = $("<td class='text-center'></td>");
				if (Newtec.Utils.isFunction(tabBtnFuc)) {
					tabs = tabBtnFuc(item, $tr);
				}
				if (Newtec.Utils.isArray(tabs)) {
					for (let tab of tabs) {
						let $tab = $("<a href='#' class='td-tab " + (tab.className ? tab.className : "") + "'" + (tab.tip ? " title='" + tab.tip + "'" : "") + (tab.hidden ? " style='display: none;'" : "") + ">" + (tab.title || "") + "</a>");
						$tab.click(function () {
							Newtec.Utils.isFunction(tab.click) && tab.click(item, $tr);
						});
						$toolTd.append($tab);
					}
				}
				item.hideTool && $tr.data('tool', 'false');
				$tr.append($toolTd);
				return $tr;
			},

			/**
			 * 生成表头
			 */
			getThead: function () {
				var defaults = this.defaults,
					headers = defaults.fields,
					showTabTd = Newtec.Utils.isArray(defaults.tabBtns),
					$thead = $("<thead></thead>"),
					$thr = $("<tr></tr>");
				for (let header of headers) {
					if (header.hidden) continue;
					$thr.append(this.getTheadTr(header));
				}
				showTabTd && $thr.append(this.getTheadTr({ title: "操作", width: defaults.tabBtnWidth }));
				$thead.append($thr);
				return $thead;
			},

			/**
			 * 获取表格标题列
			 * @param {Object} header 列属性
			 */
			getTheadTr: function (header) {
				return "<th" + (header.width ? " style='width: " + header.width + "px'" : '') + ">" + (header.title || '') + "</th>"
			}
		});

		Newtec.Module("TreeTable");
	});