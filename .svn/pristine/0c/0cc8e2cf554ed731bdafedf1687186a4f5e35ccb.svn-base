(function ($) {
    $.fn.queryBuilder = function (config) {
        //判断要绑定的是否是一个JQuery对象
        if (this.size() != 1)
            throw new Error('请将该事件正确绑定到一个jQuery对象中！');

        var defaults = {
            sourceData: [], // 元数据
            // saveJson: {}, // 保存的查询结构
            onPageClicked: null // 回调函数
        };

        return this.each(function () {
            let $body = $(this);
            
            config && $.extend(defaults, config);

            /**
             * 获取SQL语句
             */
            $.fn.parseSQL = function () {
                return Utils.formatSQL(getData());
            }

            /**
             * 重置控件
             */
            $.fn.reset = function () {
                var $this = $(this);
                $this.empty();
                buildComponent(defaults.sourceData, defaults.saveJson, $this, false, 0);
            }

            /**
             * 获取控件格式化JSON数据
             */
            $.fn.getFormatJson = function () {
                return Utils.formatJson(JSON.stringify(getData()));
            }

            $.fn.getJsonData = function () {
                return getData();
            }

            /**
             * 获取控件JSON数据
             */
            function getData(){
                var $ruleGroup = $body.find("> .rule-group");
                removeError($ruleGroup);
                var resultSQLJson = collectionData($ruleGroup);
                return resultSQLJson;
            }

            /**
             * 使用统一的结构收集控件上的数据
             * @param {JQuery} $ruleGroup 父组件
             */
            function collectionData($ruleGroup) {
                var result = {};
                var rules = [];

                var oprator = $ruleGroup.find('> .group-tools .group-left .btn input[type="radio"]:checked ').val();
                result.connector = oprator;
                $ruleGroup.find("> .query-statement .rule-row").each(function () {
                    var rule = {},
                        $this = $(this),
                        $column = $this.find('> .column-key .column-select'),
                        column = $column.val();
                    if(!column || column == '请选择'){
                        $column.parent().addClass('has-error');
                        throw new Error('请选择筛选字段');
                    }else{
                        $column.parent().removeClass('has-error');
                    }
                    var columnInfos = column.split('.');
                    rule.entity = columnInfos[0];
                    rule.alia = columnInfos[1];
                    rule.property = columnInfos[2];
                    rule.type = columnInfos[3];
                    rule.operator = $this.find('> .column-operator .operator-select').val();
                   
                    var $value = $this.find('> .column-value'),
                        item = Utils.getPropertyItemByOperator(columnInfos[3], rule.operator);
                    if(!item){
                        throw new Error('未找到获取此自定义组件的值的方法');
                    }
                    var method = item.inputType;
                    if(method === 'null'){
                        rule.value = undefined;
                    } else {
                        var tResult = methods[method].get_($value);
                        if (tResult.success) {
                            rule.value = tResult.value;
                        } else {
                            // 根据错误地方添加错误显示信息
                            tResult.node.parent().addClass('has-error error').attr('title', tResult.msg).tooltip();
                            throw new Error(tResult.msg);
                        }
                    }
                    rules.push(rule);
                });

                var rulesGroup = [];
                result.rules = rules;

                $ruleGroup.find('> .rule-group').each(function () {
                    rulesGroup.push(collectionData($(this)));
                });
                result.rulesGroup = rulesGroup;
                return result;
            };
            
            /**
             * 初始化一个规则
             * @param {Object} rule  规则数据
             * @param {String} i  第几个规则
             *
             * @return {*|jQuery}
             */
            function createRule (rule, i) {
                var $ruleRow = null;
                if (rule == null || rule == "") {
                    $ruleRow = initFirstRule(defaults.sourceData, (i == 0 ? false : true));
                } else {
                    $ruleRow = $('<div class="rule-row">');
                    var $columnKey = $('<div class="column-key">'),
                        firstSelect = createColumnSelect(defaults.sourceData);
                    firstSelect.val(rule.entity + "." + rule.alia + "." + rule.property + "." + rule.type);  // 设置选中
                    $columnKey.append(firstSelect);// 没有设置选中
                    $ruleRow.append($columnKey);

                    var $operator = $('<div class="column-operator">'),
                        propertypeType = rule.type,
                        operator = rule.operator,
                        $operatorSelect = null,
                        items = Utils.getProperties(propertypeType);
                    if(!Array.isArray(items)){
                        Utils.error("属性 " + this.entity + "." + this.alia + " 的类型 " + this.property + " 无匹配的连接符", true);
                        return false;
                    }
                    $operatorSelect = createOperatorSelect(items);
                    $operatorSelect.val(operator);
                    
                    $operator.append($operatorSelect);

                    var $value = $('<div class="column-value">');
                    // 此处可以通过 propertypeType 来确定要生成什么类型的 ipnut 输入值
                    // $value.append('<input type="text" class="form-control" />');

                    var $deleteBtn = createOperatorDelele((i == 0 ? false : true));
                    $ruleRow.append($operator).append($value).append($deleteBtn);
                    bindOperatorEvent($operator);
                    $operator.find('.operator-select').change();
                }
                bindConnectorEvent($ruleRow);
                return $ruleRow;
            };

            /**
             * 给操作符绑定事件
             * @param $operator 连接符所在的父类div jquery 对象
             */
            function bindOperatorEvent ($operator) {
                // 第二个下拉发生改变
                $operator.find('.operator-select').on('change', function () {
                    // 根据选择的树形类型和连接符，确定是否调用回调函数，如果需要调用回调函数，则需要等待接收回掉函数的返回值，并作用于等待填充的待选值的提示信息
                    var $this = $(this),
                        operator = $this.val(), 
                        fullKey = $this.parent().prev().find('select').val(),
                        temp = fullKey.split('.'),
                        entity = temp[0],
                        property = temp[2],
                        type = temp[3];

                    var inputType = "",
                        tip = "",
                        method = false,
                        source = false,
                        item = Utils.getPropertyItemByOperator(type, operator);
                    if(item){
                        inputType = item.inputType;
                        tip = item.tip;
                        method = item.callback;
                        source = item.source;
                    }

                    var field = defaults.sourceData.tables[entity].fields[property], typeDetails = SQL_VALUE_TYPES[type];
                    var datas = { 'tip': tip, 'value': '', isString: typeDetails.isString, isNumber: typeDetails.isNumber, type: type, min: field.min, max: field.max, length: field.length},
                        tipSource = null;
                    // 判断是触发的什么类型的操作符，如果是系统默认的方法
                    if (method) {
                        // 需要回调函数
                        tipSource = defaults.onPageClicked.call(this, entity, property, type);
                    } else if (source) {
                        // foreign
                        tipSource = defaults.sourceData;
                    }

                    var $value = $this.parents('.column-operator:first').next('.column-value');
                    $value.empty();
                    // 找到这个方法
                    if (inputType in methods) {
                        var $input = methods[inputType].new_(datas, tipSource);
                        $value.append($input);
                    } else {
                        if (inputType == "") {
                            // 针对这个类型的属性没有定义对应的组件追加的方法
                            Utils.error("自定义的" + type + "类型的属性" + property + "的连接符为" + operator + "没有设置组件的追加方式，请修改全局参数PROPERTY_TYPES!", true);
                        } else if (inputType != null && inputType != 'null') {
                            Utils.error("全局方法中没有 " + operator + " 对应的实现方法，请在queryBuilder.methos.js文件中的methods参数中写入自定义参数类型对应的创建组件的方法!", true);
                        }
                    }
                });
            };

            /**
             * 给连接符绑定事件
             * @param {JQuery} $ruleRow 规则行的 JQuery 对象
             */
            var bindConnectorEvent = function ($ruleRow) {
                // 选择的字段发生改变
                $ruleRow.find('.column-select').on('change', function () {
                    var $this = $(this),
                        tmp = $this.val(),
                        all = tmp.split('.'),
                        $operator = $this.parents('.column-key:first').next('.column-operator');
                    $operator.empty();
                    var $operatorSelect = null;
                    var items = Utils.getProperties(all[3]);
                    if(Array.isArray(items)){
                        $operatorSelect = createOperatorSelect(items);
                    }
                    $operator.append($operatorSelect);
                    $operator.next().empty();
                    bindOperatorEvent($operator);
                    $operator.find('.operator-select').change();
                });
            };

            /**
             * 构建SQL Builder主方法
             * @param tables 数据库表数据
             * @param datas  保存的SQL结构, 至少为[]数组
             * @param $container 父类节点对象
             * @param showDeleteBtn 是否显示删除按钮
             * @param i 遍历节点
             **/
            function buildComponent(tables, datas, $container, showDeleteBtn, i) {
                var count = 0, 
                    connector = datas ? datas.connector : 'and',
                    $ruleGroup = $('<div class="rule-group" align="center">'), // 规则组
                    $goupTools = $('<div class="group-tools">'),   // 顶部工具栏
                    $groupBtns = createRightGroupBtns(showDeleteBtn);
                
                $goupTools.append(createLeftConnectors(i, connector)); // 创建左边连接符按钮组
                $goupTools.append($groupBtns); // 右边按钮工具组

                // 添加规则
                $groupBtns.find('button.add-rule').click(function () {
                    $(this).parents('.group-tools:first').next().append(createRule(null, 1)); 
                });
                // 添加子规则组
                $groupBtns.find('button.add-group').click(function () {
                    buildComponent(tables, null, $(this).parents('.rule-group:first'), true, i + '_' + (++count));
                });
                // 删除子规则组
                $groupBtns.find('button.delete-group').click(function () {
                    $(this).parents('.rule-group:first').remove();
                });
                $ruleGroup.append($goupTools);

                var $statement = $('<div class="query-statement">');
                if (Utils.isEmpty(datas) || !datas.rules || 0 >= datas.length) {
                    // 仅仅创建一个空白的界面，没有保存的SQL结构
                    var $rule = initFirstRule(tables);
                    $statement.append($rule);
                    $ruleGroup.append($statement);
                    $container.append($ruleGroup);
                    bindConnectorEvent($rule);
                    return false;
                }

                // 创建所有规则
                var rules = datas.rules;
                $.each(rules, function (i) {
                    $statement.append(createRule(this, i));
                });
                $ruleGroup.append($statement);
                $container.append($ruleGroup);
                // 创建所有子规则组
                var rulesGroup = datas.rulesGroup;
                $.each(rulesGroup, function (m) {
                    buildComponent(tables, this, $ruleGroup, true, i + '_' + m);
                });
            }
            
            buildComponent(defaults.sourceData, defaults.saveJson, $body, false, 0);
        });
    };

    /**
     * 移除行错误标志
     * @param {JQuery} $parent 父DIV
     */
    function removeError($parent) {
        $parent.find("> .query-statement .rule-row").each(function () {
            var $this = $(this)
            $this.find('> .column-key').removeClass('has-error');
            $this.find('> .column-operator').removeClass('has-error');
            $this.find('> .column-value').removeClass('has-error');
            $this.find('> .error').removeAttr('title').removeAttr('data-original-title').removeClass('error');
        });
        $parent.find('> .rule-group').each(function () {
            removeError($(this));
        });
    }

    /***
     * 初始化组级联操作
     * @param {Boolean} showDeleteBtn 删除组按钮是否显
     * @return {jQuery|HTMLElement}
     */
    function createRightGroupBtns(showDeleteBtn) {
        var $right = $('<div class="btn-group btn-group-xs group-right" role="group" aria-label="...">');
        $right.append('<button type="button" class="btn btn-primary add-rule"><span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>&nbsp;添加规则</button>'
            + '<button type="button" class="btn btn-info add-group"><span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>&nbsp;添加组</button>'
            + '<button type="button" class="btn btn-xs btn-danger delete-group" style="display: ' + (showDeleteBtn ? "block" : "none") + '"><span class="glyphicon glyphicon-trash" aria-hidden="true" ></span>&nbsp;删除组</button>');
        return $right;
    }

    /***
     * 初始化删除行操作组件
     * @param {Boolean} enableDeleteBtn 是否启用删除行按钮
     * @return {jQuery|HTMLElement}
     */
    function createOperatorDelele(enableDeleteBtn) {
        var $operator = $('<div class="row-tools">');
        $operator.append("<button type='button' class='btn btn-danger " + (enableDeleteBtn ? "del" : "head") + "'><span class='glyphicon glyphicon-minus'></span></button>");
        $operator.find('.del').on('click', function () {
            $(this).parents('.rule-row:first').remove(); //删除一行数据
        });
        return $operator;
    }

    /**
     * 创建选择字段的下拉组件
     * @param {Array} datas 下拉组件的数据
     * @return {*|jQuery}
     */
    function createColumnSelect(datas) {
        var select = $('<select>').addClass("form-control selectpicker bs-select-hidden mobile-device column-select");
        select.append('<option >请选择</option>');
        var tables = datas.tables = {};
        $.each(datas, function (i, j) {
            var entityName = this.entityName;
            var alias = this.alias;
            var title = this.title;
            var properties = this.properties;
            var table = tables[entityName] = {
                name: entityName,
                title: title
            }
            var fields = table.fields = {}, isEmpty = true;
            if(Array.isArray(alias)){
                $.each(alias, function (n, m) {
                    var group = $('<optgroup>').attr('label', title + "（" + alias[n] + '）');
                    $.each(properties, function (o, p) {
                        isEmpty && (fields[this.name] = this)
                        group.append('<option value="' + entityName + "." + alias[n] + "." + this.name + "." + this.type + '">' + this.title + '</option>');
                    });
                    isEmpty = false;
                    select.append(group);
                });
            }else{
                var group = $('<optgroup>').attr('label', title);
                $.each(properties, function (o, p) {
                    fields[this.name] = this;
                    group.append('<option value="' + entityName + "." + entityName + "." + this.name + "." + this.type + '">' + this.title + '</option>');
                });
                select.append(group);
            }
        });
        return select;
    }

    /**
     * 生成一个普通下拉组件
     * @param {Array} options 下拉框组件的选项
     */
    function createOperatorSelect(options) {
        var select = $('<select>').addClass("form-control selectpicker bs-select-hidden mobile-device operator-select");
        $.each(options, function (i, j) {
            select.append('<option value="' + this.value + '">' + this.text + '</option>');
        });
        return select;
    }

    /**
     * 初始化第一个规则
     * @param {Object} sourceJson  元数据
     * @param {Boolean} showDelete  是否显示删除按钮
     * @return {*|jQuery}
     */
    function initFirstRule(sourceJson, showDelete) {
        var $container = $('<div class="rule-row">');
        var $columnKey = $('<div class="column-key">');
        $columnKey.append(createColumnSelect(sourceJson));
        $container.append($columnKey).append('<div class="column-operator">').append('<div class="column-value">').append(createOperatorDelele(showDelete));
        return $container;
    }

    /**
     * 初始化一个and, or连接符按钮组
     * @param {String} name  @param name 单选组件的name 属性值
     * @param {String} defaultValue  @param defaultValue 初始化默认选中值
     * @return {*|jQuery}
     */
    function createLeftConnectors(name, defaultValue) {
        var $left = $(' <div class="btn-group btn-group-xs group-left" data-toggle="buttons">')
        $left.append('<label class="btn btn-primary"><input type="radio" name="' + name + '" autocomplete="off" value="and" checked>并且</label><label class="btn btn-primary"><input type="radio" name="' + name + '" value="or" autocomplete="off"> 或者</label>');
        $left.find("> .btn input[type=radio][value=" + defaultValue + "]").attr("checked", 'checked');
        $left.find("> .btn input[type=radio][value=" + defaultValue + "]").parents('label:first').addClass('active');
        return $left;
    }
})(jQuery);