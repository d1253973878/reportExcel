/**
 * TODO 请不要再使用该文件，准备移除该文件
 * 系统：应用开发平台
 * 页面：菜单定义，负责创建左侧application列表，中间和右侧由newtec.treepage.js创建
 * @author 曾文杰
 */
(function () {
    Newtec.MenuPage = function (params) {
        this.defaults = {
            ds: '',

            'showHead': true,
            'headText': '应用列表'
        };
        this.defaults = $.extend(this.defaults, params, {});
        var ds = this.defaults.ds;
        this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;
    };
    Newtec.MenuPage.exte(Newtec.Base, 'menuPage');
    Newtec.MenuPage.over({
        createNewtecJQ: function (params) {
            var that = this;
            var ax = Newtec.Utils.uuid16();
            var thisJQ = $("<div id='" + ax + "' class='col-xs-12' style='padding-left:0;padding-right:0;height:100%;'></div>").appendTo($(params.appendTo));//整体

            //=====左边
            var appTableId = Newtec.Utils.uuid16(),
                appleTableJQ = $("<div id='" + appTableId + "' class='' style='width:250px;float:left;padding-left:0;padding-right:0;height:100%;border-right:1px solid #ccc;'></div>").appendTo(thisJQ);
            if (this.defaults.showHead) {
                var a = this.createHead();
                appleTableJQ.append(a);
            }
            var appTable = Newtec.Table.create({
                'appendTo': '#' + appTableId,
                'ds': Newtec.DS.get('application'),
                'showHeader': false,
                'showPagin': false,
                'showThead': false,
                'showFooter': false,
                'multSelect': false,
                'autoFetch': true,
                "showFetchForm": false
            });
            appTable.setClickRecord(function (a) {
                console.log(a);
                if (a.id != Newtec.Person.getPowerAppId()) {
                    Newtec.Person.setPowerAppId(a.id);
                    that.getApplicationNodes(a.id);
                }
            });
            if (Newtec.Utils.isNull(Newtec.Person.getPowerAppId())) {
                that.getApplicationNodes(Newtec.Person.getPowerAppId());
            }
            this.appleTableJQ = appleTableJQ;

            //=====右边
            var treeAreaId = Newtec.Utils.uuid16(),
                treeAreaJQ = $("<div id='" + treeAreaId + "' class='' style='margin-left:250px;padding-left:0;padding-right:0;height:100%;'></div>").appendTo(thisJQ);
            this.treeAreaId = treeAreaId;
            this.treeAreaJQ = treeAreaJQ;
            this.getApplicationNodes(Newtec.Person.getPowerAppId());

            return thisJQ;
        },
        finsh: function () {
        },
        getApplicationNodes: function (applicationId) {
            if (Newtec.Utils.isNull(applicationId)) {
                return;
            }
            var that = this;
            that.treeAreaJQ.empty();
            var treeArea = Newtec.TreePage.create({
                "appendTo": "#" + that.treeAreaId,
                "ds": 'node',
                "data": {"applicationId": applicationId},
                "expand": true
            });
        },
        createHead: function () {
            var html = "<div style='width:100%;height:35px; line-height:35px; background:#e8ebf3; text-align:center;'>" + this.defaults.headText + "</div>";
            return $(html);
        }
    });
    Newtec.Module("MenuPage")
})();