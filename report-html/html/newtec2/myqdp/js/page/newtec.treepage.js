/**
 * TreeGrid扩展控件，主要
 * @author 曾文杰
 */
(function () {
	Newtec.Table||Newtec.Utils.addJS("widget/newtec.table.js");
	Newtec.Form||Newtec.Utils.addJS("widget/newtec.form.js");
	Newtec.TreeGrid||Newtec.Utils.addJS("widget/newtec.treegrid2.0.js");
    Newtec.TreePage = function (params) {
        this.defaults = {
            appendTo: '',
            ds: '',

            add: true,
            update: true,
            remove: true,

            expand: true,
            showIcon: false,
            showCheckbox: false
        };
        $.extend(this.defaults, params);
        var ds = this.defaults.ds;
        this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;
        this.dsName = this.ds.dsName;

        this.head = undefined;
        this.headLeft = undefined;
        this.headRight = undefined;

        this.leftId = '';
        this.leftJQ = undefined;
        this.rightId = '';
        this.rightJQ = undefined;

        this.treeGrid = undefined;
    };
    Newtec.TreePage.exte(Newtec.Base, 'treePage');
    Newtec.TreePage.over({
        createNewtecJQ: function (params) {
            var that = this;
            var thisJQ = $(this.defaults.appendTo);
            this.createHead();
            thisJQ.append(this.head);
            this.leftId = 'treePage_left_' + Newtec.Utils.uuid16();
            this.leftJQ = $("<div id='" + this.leftId + "' class='' style='width:50%;float:left;position:absolute;left:0;top:40px;right:50%;bottom:0;border-top: 3px solid white;border-right: 3px solid white;padding-right:3px;'></div>");
            this.rightId = 'treePage_right_' + Newtec.Utils.uuid16();
            this.rightJQ = $("<div id='" + this.rightId + "' class='' style='padding-top:20px;width:50%;float:left;left:50%;top:40px;right:0;position: absolute;bottom:0;border-top: 3px solid #cccccc;'></div>");
            thisJQ.append(this.leftJQ).append(this.rightJQ);

            var appAuthorLevel = Newtec.Person.get().app.authorityControl;
            var has = appAuthorLevel == 0;
            var btnMap = {};
            if (has == false) {
                btnMap = Newtec.Person.getButton();
            }
            console.log('btnMap', btnMap);
            var btns = [];
            //===== add
            var btnAdd = btnMap[this.getAddBtnId()];
            if (params[Newtec.DS.OperType.add] && (has || btnAdd != undefined)) {
                console.log('btn add');
                var addTitle = btnAdd == undefined || btnAdd.name == '' ? params['addTitle'] : btnAdd.name;
                btns.push({
                    title: addTitle,
                    className: 'btn btn-success',
                    click: function () {
                        alert('add');
                    }
                });
            }
            //===== remove
            var btnRemove = btnMap[this.getRemoveBtnId()];
            if (params[Newtec.DS.OperType.remove] && (has || btnRemove != undefined)) {
                console.log('btn remove');
                var removeTitle = btnRemove == undefined || btnRemove.name == '' ? params['removeTitle'] : btnRemove.name;
                btns.push({
                    title: removeTitle,
                    className: 'btn btn-danger',
                    click: function () {
                        alert('remove');
                    }
                });
            }
            //===== update
            var btnUpdate = btnMap[this.getUpdateBtnId()];
            var updateBtn = undefined;
            if (params[Newtec.DS.OperType.update] && (has || btnUpdate != undefined)) {
                updateBtn = Newtec.Button.create({
                    title: '修改',
                    className: 'btn btn-warning',
                    style: 'float:right; margin-right:45px;',
                    id: Newtec.Utils.uuid16(),
                    click: function () {
                    }
                });
            }
            console.log('btns', btns);
            console.log(params);
            this.addButtons(btns);

            var leftParams = {
                appendTo: '#' + this.leftId,
                ds: this.ds,
                expand: params.expand,
                showIcon: params.showIcon,
                showCheckbox: params.showCheckbox,
                onClick: function (thisTR) {
                    var id = that.treeGrid.getNodeId(thisTR);
                    that.ds.fetchData({
                        "operId": "",
                        "data": {"id": id},
                        "callback": function (response) {
                            that.rightJQ.empty();
                            var rightParams = {
                                appendTo: '#' + that.rightId,
                                ds: that.ds,
                                titleColumn: 3,
                                columnNum: 1,
                                operType: Newtec.DS.OperType.update,
                                values: response.data[0],
                                footer: updateBtn
                            };
                            Newtec.Form.create(rightParams);
                        }
                    });
                }
            };
            this.treeGrid = Newtec.TreeGrid.create(leftParams);

            return thisJQ;
        },
        createHead: function () {
            var head = $("<div style='width:100%;height:40px;position: absolute;left:0;top:0; line-height:40px; background:#e8ebf3; text-align:center;'></div>");
            var headLeft = $("<div class='pull-left'></div>");
            var headRight = $("<div class='pull-right'></div>");
            head.append(headLeft);
            head.append(headRight);
            this.head = head;
            this.headLeft = headLeft;
            this.headRight = headRight;
            return head;
        },
        addButtons: function (btnParams) {
            if (btnParams instanceof Array) {
                var len = btnParams.length;
                for (var i = 0; i < len; i++) {
                    var btnParam = btnParams[i];
                    this.addButtons(btnParam);
                }
            } else {
                var click = btnParams['click'];
                var that = this;
                btnParams['click'] = function () {
                    if (Newtec.Utils.isFunction(click))
                        click(that);
                };
                if (!Newtec.Utils.isNewtec(btnParams) && Newtec.Utils.isJson(btnParams)) {//json情况先创建出button
                    btnParams = Newtec.Button.create(btnParams);
                }
                var b = Newtec.Utils.appendTo(btnParams, this.headRight);
            }
        },
        finsh: function (params) {
            this.leftJQ.mCustomScrollbar({
                theme: "minimal-dark",
                scrollInertia: 200
            });
            this.rightJQ.mCustomScrollbar({
                theme: "minimal-dark",
                scrollInertia: 200
            });
        },
        getAddBtnId: function () {
            return this.dsName + "_" + Newtec.DS.OperType.add + "_button_id";
        },
        getRemoveBtnId: function () {
            return this.dsName + "_" + Newtec.DS.OperType.remove + "_button_id";
        },
        getUpdateBtnId: function () {
            return this.dsName + "_" + Newtec.DS.OperType.update + "_button_id";
        }
    });
    Newtec.Module("TreePage")
})();