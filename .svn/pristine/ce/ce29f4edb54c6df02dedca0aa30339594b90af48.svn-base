Newtec.Component(
['widget/newtec.table.js','widget/newtec.form.js','widget/newtec.treegrid2.0.js',
{js:'codemirror.js',src:'thirdparty/codemirror/lib/'},{js:'xml.js',src:'thirdparty/codemirror/mode/xml/'},{js:'css.js',src:'thirdparty/codemirror/mode/css/'},
{js:'javascript.js',src:'thirdparty/codemirror/mode/javascript/'},{js:'simplescrollbars.js',src:'thirdparty/codemirror/addon/scroll/'}],
[{css:'codemirror.css',src:'thirdparty/codemirror/lib/'},{css:'simplescrollbars.css',src:'thirdparty/codemirror/addon/scroll/'},"demo.css"]
,function () {
    Newtec.Demo = function (params) {
        if (!Newtec.Utils.isJson(params)) {
            return;
        }
        this.defaults = {
            appendTo: '',
            previewAreaId: 'demo',//演示的代码添加id，需要添加多个演示案例，请用数据
            previewAreaStyle: '',//给预览区域添加样式，我在这里加的基本上都是宽度，这里针对这个预览区域的样式
            previewAreaTitle: '',//每一块预览区域的标题，这里跟previewAreaId一样，id是数组，这里也必须是数组，顺序要一致，不需要标题请使用空字符串''
            sourceCode: '',//源代码
            title: '示例',
            description: '小标题',
            apiFields: [
                {name: "name", title: '参数'},
                {name: "type", title: '类型'},
                {name: "need", title: '是否必填'},
                {name: "def", title: '默认值'},
                {name: "description", title: '描述'},
                {name: "demo", title: '示例'}
            ],//api字段
            apiDatas: [],//api数据
            funcFields: [
                {name: "method", title: '方法名'},
                {name: "params", title: '参数'},
                {name: "return", title: '返回值'},
                {name: "description", title: '描述'},
                {name: "demo", title: '示例'}
            ],//方法表格字段
            requiredJS: [],//该控件必需js
            requiredCSS: [],//该控件必须css
            funcDatas: [],//方法表格数据
            solutions: [],//预设方案,
            showApiTable: true,
            showFuncTable: true,
            autoRunSourceCode: true,
            doubleLine: false,
            column: 1,//示例显示列数，默认是1列，用到的样式是col-xs-12，请使用1-3列，是通过12 / column 计算的
            height: "300"//代码以及预览的高度
        };
        $.extend(this.defaults, params, {});

        this.editor = undefined;//CodeMirror编辑器
        this.previewAreaId = this.defaults.previewAreaId;//左侧预览区域id
        this.sourceCodeAreaId = Newtec.Utils.uuid16();//右侧代码区域id
        this.sourceCodeTextareaId = Newtec.Utils.uuid16();
        this.apiAreaId = Newtec.Utils.uuid16();//api文档显示区域id
        this.funcAreaId = Newtec.Utils.uuid16();//方法表格显示区域id
        this.fullLineCheckbox = undefined;//默认是代码以及预览各占50%宽度显示在同一行，有些预览需要更大的宽度
        this.previewBtn = undefined;
        this.previewBtnId = Newtec.Utils.uuid16();
        this.seeHtmlBtn = undefined;
        this.apiTitle = '参数列表';
        this.funcTitle = '方法列表';
    };
    Newtec.Demo.exte(Newtec.Base, 'demo');
    Newtec.Demo.over({
        createNewtecJQ: function (params) {
            //写入样式，有checkbox美化、高度100%给mCustomScrollbar用，边距
            Newtec.Utils.addStyle("" +
                "html,body{width:100%;height:100%;}" +
                ".nomargin{margin:0;padding: 1px 0;}" +
                "label.new i {background:#fff;font-size:12px;font-style:normal;display:inline-block;width:12px;height:12px;text-align:center;line-height:12px;color:#fff;vertical-align:middle;margin:-2px 2px 1px 0px;border:#2489c5 1px solid;}" +
                "label.new input[type='checkbox'],input[type='radio'] {display:none;}" +
                "label.new input[type='radio'] + i {border-radius:7px;}" +
                "label.new input[type='checkbox']:checked + i,input[type='radio']:checked + i {background:#2489c5;}" +
                "label.new input[type='checkbox']:disabled + i,input[type='radio']:disabled + i {border-color:#ccc;}" +
                "label.new input[type='checkbox']:checked:disabled + i,input[type='radio']:checked:disabled + i {background:#ccc;}");
            //最外层滚动条
            $(this.defaults.appendTo)
                .addClass('mCustomScrollbar')
                .attr('data-mcs-theme', 'minimal-dark')
                .css({'width': '100%', 'height': '100%'});
            var jq = $("<div></div>");
            var previewArea = "";
            var clz = "col-xs-" + (12 / this.defaults.column);//计算显示列
            if (Newtec.Utils.isArray(this.previewAreaId)) {
                for (var i = 0; i < this.previewAreaId.length; i++) {
                    previewArea += "<div class='" + clz + "' style='padding:10px;" + this.defaults.previewAreaStyle + "'>";
                    if (!Newtec.Utils.isNull(this.defaults.previewAreaTitle) && this.defaults.previewAreaTitle[i] != '') {
                        previewArea += "<p class='text-danger'>" + this.defaults.previewAreaTitle[i] + "</p>";
                    }
                    previewArea += "<div id='" + this.previewAreaId[i] + "'></div>";
                    previewArea += "</div>";
                }
            } else {
                previewArea += "<div class='" + clz + "' style='padding:10px;" + this.defaults.previewAreaStyle + "'>";
                if (!Newtec.Utils.isNull(this.defaults.previewAreaTitle) && this.defaults.previewAreaTitle != '') {
                    previewArea += "<p class='text-danger'>" + this.defaults.previewAreaTitle + "</p>";
                }
                previewArea += "<div id='" + this.previewAreaId + "'></div>";
                previewArea += "</div>";
            }
            var a = "" +
                "<div class='col-sm-12'>" +
                "  <div class='row'>" +
                "    <div class='panel nomargin'>" +
                "      <div class='page-header nomargin' style='margin-bottom:10px;margin-top:0;margin-bottom:0;'>" +
                "        <h1 class='nomargin'>" + this.defaults.title + " <small>" + this.defaults.description + "</small></h1>" +
                "      </div>" +
                "      <div class='panel panel-success nomargin' style='border-top:0;border-bottom:0;margin-bottom:0;margin-right:12px;'>" +
                "        <div class='panel-heading' style='height:50px;line-height:50px;padding-top:0;padding-bottom:0;font-size:22px;'>" +
                "          <div class='pull-left'>控件预览</div>" +
                "          <div class='pull-right' id='" + this.previewBtnId + "'></div>" +
                "          <div class='clearfix'></div>" +
                "        </div>" +
                "        <div class='panel-body nomargin' id='top_panel' style='padding:0;height:" + this.defaults.height + "px;'>" +
                "          <div id='left_preview' style='width:50%;overflow:auto;float:left;height:100%;'>" +
                // "            <div id='" + this.previewAreaId + "'></div>" +
                previewArea +
                "          </div>" +
                "          <div id='right_sourceCode' style='width:50%;overflow:auto;margin-left:50%;height:100%;'>" +
                "            <div id='" + this.sourceCodeAreaId + "' style='height:100%;width:100%;'>" +
                "              <textarea id='" + this.sourceCodeTextareaId + "'>" + this.defaults.sourceCode + "</textarea>" +
                "            </div>" +
                "          </div>" +
                "        </div>" +
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</div>";

            if (this.defaults.showApiTable) {
                a += "" +
                    "<div class='col-sm-12'>" +
                    "  <h3>" + this.apiTitle + "</h3>" +
                    "  <div id='" + this.apiAreaId + "'></div>" +
                    "</div>";
            }
            if (this.defaults.showFuncTable) {
                a += "" +
                    "<div class='col-sm-12'>" +
                    "  <h3>" + this.funcTitle + "</h3>" +
                    "  <div id='" + this.funcAreaId + "'></div>" +
                    "</div>";
            }

            jq.append(a);
            return jq;
        },
        finsh: function () {
            var that = this;
            that.initPreview();
            if (that.defaults.showApiTable) {
                that.initApiTable();
            }
            if (that.defaults.showFuncTable) {
                that.initFuncTable();
            }

            $('#left_preview').mCustomScrollbar({
                theme: "minimal-dark",
                scrollInertia: 200,
                axis: "yx"//加上水平滚动条
            });
        },
        initFuncTable: function () {
            var that = this;
            var funcTable = Newtec.Table.create({
                appendTo: that.funcAreaId,
                autoFetch: false,
                showHeader: false,
                showFetchForm: false,
                showFilter: false,
                showMoreBtn: false,
                showPagin: false,
                showFooter: false,
                fields: that.defaults.funcFields,
                datas: that.defaults.funcDatas
            });
        },
        initApiTable: function () {
            var that = this;
            var apiTable = Newtec.Table.create({
                appendTo: that.apiAreaId,
                autoFetch: false,
                showHeader: false,
                showFetchForm: false,
                showFilter: false,
                showMoreBtn: false,
                showPagin: false,
                showFooter: false,
                fields: that.defaults.apiFields,
                datas: that.defaults.apiDatas
            });
        },
        initPreview: function () {
            var that = this;
            var a = this.sourceCodeTextareaId;

            var editor = CodeMirror.fromTextArea(document.getElementById(a), {
                styleActiveLine: true,//line选择是是否加亮
                lineNumbers: true,//是否显示行数
                lineWrapping: true,//是否自动换行
                mode: 'text/javascript'
            });
            //CodeMirror内置两种样式 simple和overlay 两种，使用必须引入simplescrollbars.css和simplescrollbars.js
            editor.setOption('scrollbarStyle', 'simple');
            this.editor = editor;
            var h = $('#right_sourceCode').height();
            this.editor.setSize(null, h + 'px');

            var cb_id = Newtec.Utils.uuid16();
            var cb_status = "";
            if (this.defaults.doubleLine) {
                cb_status = "checked";
            }
            var cb_html = "" +
                "<div style='display:inline;'>" +
                "  <label class='new' style='font-size: 13px;font-weight: 400;height:30px;line-height:30px;'>" +
                "    <input type='checkbox' id='" + cb_id + "' " + cb_status + ">" +
                "    <i style='width:16px;height:16px;'>✓</i>双行显示&nbsp;&nbsp;" +
                "  </label>" +
                "</div>";
            Newtec.Utils.append($("#" + this.previewBtnId), $(cb_html));
            this.fullLineCheckbox = $('#' + cb_id);
            this.doubleLine(this.defaults.doubleLine);
            this.fullLineCheckbox.on('change', function () {
                var left = $('#left_preview');
                var right = $('#right_sourceCode');
                var top = $('#top_panel');
                that.doubleLine(that.fullLineCheckbox.is(':checked'));
                // if (that.fullLineCheckbox.is(':checked')) {
                //     that.doubleLine(true);
                // } else {
                //     that.doubleLine(false);
                // }
            });

            this.previewBtn = Newtec.Button.create({
                title: '运行代码',
                className: 'btn btn-success',
                click: function () {
                    that.preview();
                }
            });
            Newtec.Utils.append($("#" + this.previewBtnId), this.previewBtn);

            this.seeHtmlBtn = Newtec.Button.create({
                title: '生成页面',
                className: 'btn btn-primary',
                click: function () {
                    var html = that.generateHTML();
                    console.log(html);
                    var body = $("<pre style='width:100%;height:360px;'></pre>");
                    var footer = new Array();
                    // footer.push(Newtec.Button.create({
                    //     title: '复制到剪切板',
                    //     click: function () {
                    //         alert('未完成');
                    //     }
                    // }));
                    footer.push(Newtec.Button.create({
                        title: '关闭',
                        className: 'btn btn-default',
                        click: function () {
                            window.close();
                        }
                    }));
                    body.append(html);
                    var window = Newtec.Window.create({
                        title: '查看页面',
                        width: 900,
                        body: body,
                        footer: footer,
                        height: 400,
                        finsh: function () {
                            body.mCustomScrollbar({
                                theme: "minimal-dark",
                                axis: "yx"//加上水平滚动条
                            });
                        }
                    });
                }
            });
            Newtec.Utils.append($("#" + this.previewBtnId), this.seeHtmlBtn);

            if (this.defaults.autoRunSourceCode) {
                this.preview();
            }
        },
        preview: function () {
            if (Newtec.Utils.isArray(this.previewAreaId)) {
                for (var i = 0; i < this.previewAreaId.length; i++) {
                    $('#' + this.previewAreaId[i]).empty();
                }
            } else {
                $('#' + this.previewAreaId).empty();
            }
            var src = this.editor.getValue();
            eval(src);
        },
        doubleLine: function (b) {
            var that = this;
            var left = $('#left_preview');
            var right = $('#right_sourceCode');
            var top = $('#top_panel');
            if (b) {
                top.css({"height": 2 * that.defaults.height + "px"});
                left.css({"width": "100%", "overflow": "auto", "height": "50%", "border-bottom": "1px solid #ccc"});
                right.css({"width": "100%", "overflow": "auto", "height": "50%", "margin-left": "0"});
            } else {
                top.css({"height": that.defaults.height + "px"});
                left.css({"width": "50%", "overflow": "auto", "float": "left", "height": "100%", "border-bottom": "none"});
                right.css({"width": "50%", "overflow": "auto", "margin-left": "50%", "height": "100%"});
            }
        },
        generateHTML: function () {
            function html_encode(str) {
                var s = "";
                if (str.length == 0) return "";
                s = str.replace(/&/g, "&gt;");
                s = s.replace(/</g, "&lt;");
                s = s.replace(/>/g, "&gt;");
                s = s.replace(/ /g, "&nbsp;");
                s = s.replace(/\'/g, "&#39;");
                s = s.replace(/\"/g, "&quot;");
                s = s.replace(/\n/g, "<br>");
                return s;
            }

            function html_decode(str) {
                var s = "";
                if (str.length == 0) return "";
                s = str.replace(/&gt;/g, "&");
                s = s.replace(/&lt;/g, "<");
                s = s.replace(/&gt;/g, ">");
                s = s.replace(/&nbsp;/g, " ");
                s = s.replace(/&#39;/g, "\'");
                s = s.replace(/&quot;/g, "\"");
                s = s.replace(/<br>/g, "\n");
                return s;
            }
            var html = "" +
                "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\"/>\n" +
                "    <meta name=\"description\" content=\"\"/>\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0\"/>\n" +
                "\n" +
                "    <link rel=\"stylesheet\" href=\"myqdp/css/bootstrap.min.css\"/>\n" +
                "    <!--[if !IE]> -->\n" +
                "    <script src=\"myqdp/js/jquery-2.1.4.min.js\"></script>\n" +
                "    <!-- <![endif]-->\n" +
                "    <!--[if IE]>\n" +
                "    <script src=\"myqdp/js/jquery-1.11.3.min.js\"></script>\n" +
                "    <![endif]-->\n" +
                "    <script src=\"myqdp/js/bootstrap.min.js\"></script>\n" +
                "\n" +
                "    <script src=\"myqdp/js/core/newtec.js\"></script>\n" +
                "    <script src=\"myqdp/js/core/newtec.ds.js\"></script>\n" +
                "\n";

            var js = this.defaults.requiredJS;
            var css = this.defaults.requiredCSS;
            for (var i = 0; i < js.length; i++) {
                html += "    <script src='" + js[i] + "'></script>\n";
            }
            for (var i = 0; i < css.length; i++) {
                html += "    <link rel='stylesheet' href='" + css[i] + "'/>\n";
            }

            html += "" +
                "    <title>Title</title>\n" +
                "</head>\n" +
                "<body>\n";

            if (Newtec.Utils.isArray(this.previewAreaId)) {
                for (var i = 0; i < this.previewAreaId.length; i++) {
                    html += "<div class='col-xs-12' style='padding:10px;" + this.defaults.previewAreaStyle + "'>\n";
                    if (!Newtec.Utils.isNull(this.defaults.previewAreaTitle) && this.defaults.previewAreaTitle[i] != '') {
                        html += "<p class='text-danger'>" + this.defaults.previewAreaTitle[i] + "</p>\n";
                    }
                    html += "<div id='" + this.previewAreaId[i] + "'></div>\n";
                    html += "</div>\n";
                }
            } else {
                html += "<div class='col-xs-12' style='padding:10px;" + this.defaults.previewAreaStyle + "'>\n";
                if (!Newtec.Utils.isNull(this.defaults.previewAreaTitle) && this.defaults.previewAreaTitle != '') {
                    html += "<p class='text-danger'>" + this.defaults.previewAreaTitle + "</p>\n";
                }
                html += "<div id='" + this.previewAreaId + "'></div>\n";
                html += "</div>\n";
            }

            html += "\n" +
                "<script>\n" +
                "    $(function () {\n";

            var src = this.editor.getValue();
            html += src;

                html +="    });\n" +
                "</script>\n" +
                "</body>\n" +
                "</html>";
            return html_encode(html);
        }
    })
});