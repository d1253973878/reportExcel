var QueryBuilderPage = {
  defaults: {
    topTitle: 'SQL查询构建器',
    query: 'single',
    databseName: 'TestDB',
    pages: [10, 20, 30, 40, 50]
  },

  create: function (container, connectionId, options) {
    this.connectionId = connectionId;
    this.createPageBefore(container, options)
    var $page = $("<div class='main-container'></div>");
    this.finishEvents = [];
    if (options) {
      $.extend(true, this.defaults, options);
    }
    $page.append(this.setBottomBody());
    this.$page = $page;
    setTimeout(() => {
      $(container).append($page);
    }, 0);
    this.createPageAfter($page);
  },

  setTopBody: function () {
    var $top = $("<div class='top-content'>" + this.defaults.topTitle + "</div>");
    this.$top = $top;
    return $top;
  },

  setBottomBody: function () {
    var $bottom = $("<div class='bottom-content'></div>");
    $bottom.append(this.getBottomNavsJq());
    $bottom.append(this.getBottomNavContentsJq());
    this.$bottom = $bottom;
    return $bottom;
  },

  getBottomNavsJq: function () {
    var that = this,
      defaults = this.defaults;
    this.singleQueryKey = 'single';
    this.joinQueryKey = 'join';
    var $container = $("<div class='bottom-nav-container'>" +
      "	 <div class='bottom-navs'>" +
      "	   <div class='bottom-nav-item" + (defaults.query === 'single' ? ' active' : '') + "' target='single-table-query' data-name='" + this.singleQueryKey + "'>单表查询</div>" +
      "	   <div class='bottom-nav-item" + (defaults.query === 'join' ? ' active' : '') + "' target='join-table-query' data-name='" + this.joinQueryKey + "'>连接查询</div>" +
      "	 </div>" +
      "</div>");

    that.currentQuery = 'join';
    $container.on('click', '.bottom-nav-item', function () {
      var self = $(this),
        current = $container.find('.bottom-nav-item.active')
      sTarget = self.attr('target'),
        cTarget = current.attr('target');
      current.removeClass('active');
      self.addClass('active');
      that.currentQuery = self.data('name');
      // 切换内容
      that.$bottom.find('.nav-content-item.' + cTarget).hide();
      that.$bottom.find('.nav-content-item.' + sTarget).show();
    });
    this.$bottom = this.$bottom;
    return $container;
  },

  getBottomNavContentsJq() {
    var $container = $("<div class='bottom-nav-contents'></div>");
    var hiddenSingle = this.defaults.query === 'join';
    $container.append(this.getSingleTableQueryContent(hiddenSingle));
    $container.append(this.getJoinTableQueryContent(!hiddenSingle));
    return $container;
  },

  getDatabaseItem: function (params) { },

  getMetaItem: function (id, title, className) {
    var $item = $("<div class='meta-item " + (className || "") + "' title='" + title + "'>" + title + "</div>");
    $item.data('id', id);
    return $item;
  },

  /**
   * 显示SQL查询结果
   * @param {String} sql SQL
   * @param {Array} fields 字段信息
   */
  showSQLResult: function (sql, fields) {
    var tableFields = [];
    for (let field of fields) {
      tableFields.push({
        name: field.name || field,
        title: field.title || field
      });
    }
    Utils.createWindow({
      body: '',
      title: '查询结果',
      width: '95%',
      height: '90%',
    })
  },

  /**
   * 单表查询页面
   */
  getSingleTableQueryContent: function (hidden) {
    !hidden && (this.currentQuery = 'single');
    var that = this,
      defaults = this.defaults,
      $container = this.getNavContentBody('single-table-query', hidden);
    $container.append("<div class='operator-container'>" +
      "  <div class='table-container'>" +
      "    <div class='operator-title'>一、选择数据库表</div>" +
      "    <div class='operator-content'></div>" +
      "  </div>" +
      "  <div class='field-container'>" +
      "    <div class='operator-title'>二、选择需要查询的字段</div>" +
      "    <div class='operator-content'><select multiple='multiple' size='10'></select></div>" +
      "  </div>" +
      "  <div class='sql-container'>" +
      "    <div class='operator-title'>三、请选择查询条件</div>" +
      "    <div class='operator-content sql-builder'>" +
      "      <div class='builder-content'></div>" +
      "      <div class='builder-tools'>" +
      "        <div class='container-fluid'>" +
      "          <div class='btn-group btn-group-sm' role='group' aria-label='...'>"
      // + "            <button type='button' class='btn btn-primary sql-struct'>获取SQL结构</button>"
      +
      "            <button type='button' class='btn btn-primary parse-sql'>解析SQL</button>" +
      "            <button type='button' class='btn btn-primary advance'>高级查询</button>" +
      "            <button type='button' class='btn btn-primary excute-sql'>执行SQL</button>" +
      "            <button type='button' class='btn btn-primary reset'>重置</button>" +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</div>" +
      "<textarea class='result-sql'></textarea>");
    // 初始化选择数据库表的内容
    var $tables = $container.find(".table-container .operator-content");
    var tables = this.tables = {},
      datas = this.getTableInfo(),
      $defaultItem = null;
    if (Array.isArray(datas)) {
      for (let data of datas) {
        tables[data.name] = {
          name: data.name,
          title: data.remark || data.name
        };
        let $item = that.getMetaItem(data.name, data.remark || data.name, 'table-item');
        // 获取上一次编辑时选中的表
        if (defaults.query === 'single' && defaults.tableName === data.name) {
          $defaultItem = $item;
        }
        $tables.append($item);
      }
    }
    if (defaults.query === 'single') {
      // 如果上一次编辑没有选中表，则默认高亮第一个表
      if ($defaultItem == null) {
        $defaultItem = $tables.find('.table-item:first-child');
      }
      this.finishEvents.push(function () {
        $defaultItem.click();
      });
    }

    $tables.on("click", ".table-item", function () {
      var self = $(this);
      $container.find('.table-item.active').removeClass('active');
      self.addClass('active');
      var id = that.currentTableName = self.data('id');
      var datas = that.getTableFields(tables[id].name);
      if (Array.isArray(datas)) {
        tables[id].fields = datas;
        var dFileds = [];
        for (let data of datas) {
          data.title = data.title || data.name;
          dFileds.push({
            name: data.name,
            title: data.title || data.name
          });
        }
        that.updateOperators();
      }
    });

    var $singleQueryBuilder = this.$singleQueryBuilder = $container.find(".sql-builder .builder-content");
    this.$singleQueryFieldBox = $container.find(".field-container select");
    var $singleSQL = this.$singleSQL = $container.find('.result-sql');
    defaults.query === 'single' && defaults.sql && $singleSQL.val(defaults.sql);

    this.createFieldSeletor(this.$singleQueryFieldBox, 'single_query_fields');
    this.updateOperators(true);
    $container.on("click", ".sql-struct", function () {
      $singleSQL.val($singleQueryBuilder.getFormatJson());
    });
    $container.on("click", ".parse-sql", function () {
      var sql;
      try {
        sql = that.getSingleQuerySQL();
      } catch (err) {
        console.error(err);
        Utils.error(err.message, true);
        return;
      }
      $singleSQL.val(sql);
    });
    $container.on("click", ".excute-sql", function () {
      var sql = $singleSQL.val();
      Utils.isEmpty(sql) && Utils.error('SQL不能为空');
      // var fields = that.getSingleQueryFields();
      var fields = that.getQueryFieldsFromSQL(sql),
        tFields = [],
        titles = that.tables[that.currentTableName].titles;
      for (let f of fields) {
        let index1 = f.indexOf('('),
          index2 = f.indexOf(')'),
          tmp1 = f, // 字段名称
          tmp2 = ''; // 聚合函数名
        // 判断是否存在聚合函数，如：COUNT(name)，解析出name字段的中文名称
        if (index1 != -1 && index2 != -1) {
          tmp1 = f.substring(index1 + 1, index2);
          tmp2 = f.substring(0, index1);
        }
        tFields.push({
          name: f,
          title: tmp1 != f ? tmp2 + '(' + titles[tmp1] + ')' : tmp1
        });
      }
      Array.isArray(fields) && fields.length > 0 && that.showSQLResult(sql, tFields);
    });
    $container.on("click", ".reset", function () {
      $singleQueryBuilder.reset();
    });
    $container.on("click", ".advance", function () {
      that.createAdvanceQuery();
    });
    return $container;
  },

  getSingleQuerySQL: function () {
    if (!this.currentTableName) {
      throw new Error('请选择需要查询的数据库表');
    }
    var advance = this.advance ? this.advance[this.singleQueryKey] : null,
      tableName = this.tables[this.currentTableName].name;
    // tableName = this.defaults.databseName + "." + this.tables[this.currentTableName].name;
    fields = this.getSingleQueryFields().join(','); // 需要查询的字段
    var sql = "SELECT " + fields + " FROM " + tableName;
    var where = this.$singleQueryBuilder.parseSQL(), // 查询的 WHERE 条件
      group = '',
      orderBy = '',
      page = '';
    // 分组条件
    if (advance && Array.isArray(advance.groupFields)) {
      group = " GROUP BY " + advance.groupFields.join(',');
    }

    // 排序参数
    if (advance && Array.isArray(advance.orderBy)) {
      var orders = advance.orderBy,
        ordered = [];
      for (let order of orders) {
        if (ordered.indexOf(order.field) != -1) continue
        orderBy += order.field + ' ' + order.direction + ',';
        ordered.push(order.field);
      }
      orderBy = orderBy.substring(0, orderBy.length - 1);
    }

    // 分页参数
    if (advance && advance.pageSize) {
      var page = advance.page,
        pageSize = advance.pageSize,
        start = pageSize * (page - 1),
        end = start + Number(pageSize);
      page = start + " < ROWNUM AND ROWNUM <=" + (end);
    }

    if (where) {
      if (group && page) { // 分组和分页同时存在时
        sql += ' WHERE ' + where + ' AND ' + page + group;
      } else if (group) { // 只存在分组
        sql += ' WHERE ' + where + group;
      } else if (page) {
        sql += ' WHERE ' + where + ' AND ' + page;
      } else {
        sql += ' WHERE ' + where;
      }
    } else {
      if (group && page) { // 分组和分页同时存在时
        sql += ' WHERE ' + page + group;
      } else if (group) { // 只存在分组
        sql += group;
      } else if (page) {
        sql += ' WHERE ' + where + ' AND ' + page;
      }
    }
    if (orderBy) {
      sql += " ORDER BY " + orderBy;
    }
    return sql;
  },

  /**
   * 获取SQL构造器数据
   */
  getData: function () {
    var data = {
      query: this.currentQuery, // 当前查询类型
      advance: this.advance // 高级查询配置
    };
    try {
      if (this.currentQuery == 'join') { // 关联查询配置
        data.sql = this.getJoinQuerySQL();
        data.fields = this.getFieldBoxFileds(this.$joinQueryFieldBox);
        data.joinConfig = this.getJoinTableParams();
        data.config = this.$singleQueryBuilder.getJsonData();
      } else { // 单表查询配置
        data.sql = this.getSingleQuerySQL();
        data.fields = this.getFieldBoxFileds(this.$singleQueryFieldBox);
        data.tableName = this.currentTableName;
        data.config = this.$joinQueryBuilder.getJsonData();
      }
    } catch (err) {
      console.error(err);
      Utils.error(err.message, true);
      return null;
    }
    return data;
  },

  /**
   * 获取字段选择框中的字段信息
   * @param {*} $box 字段选择框
   */
  getFieldBoxFileds: function ($box) {
    return {
      selected: $box.getSelectedOptions(true),
      nonSelected: $box.getNonSelectedOptions(true)
    }
  },

  /**
   * 获取 SQL 查询的字段信息，包含聚合函数查询的信息
   */
  getSingleQueryFields: function () {
    var advance = this.advance ? this.advance[this.singleQueryKey] : null,
      fieldsStr = this.$singleQueryFieldBox.getSelectedOptions();
    var fields = fieldsStr ? fieldsStr.split(',') : [];
    // 聚合函数
    if (advance && Array.isArray(advance.aggregations)) {
      $.each(advance.aggregations, function () {
        fields.push(this.function + '(' + this.field.split('.')[0] + ')');
      });
    }
    if (fields.length < 1) {
      throw new Error('请选择需要查询的字段');
    }
    return fields;
  },

  /**
   * 创建SQL构建器
   */
  createSQLBuilder: function ($container, sourceData, saveJson) {
    $container.empty();
    $container.queryBuilder({
      sourceData: sourceData, // 元数据
      saveJson: saveJson,
      onPageClicked: function (entity, property, type) {
        return null;
      }
    });
  },

  /**
   * 创建字段选择器
   */
  createFieldSeletor: function ($container, name, selecteds, nonSelects) {
    $container.empty();
    $container.doublebox({
      name: name,
      filterTextClear: "<span class='glyphicon glyphicon-remove'></span>",
      filterTextClear: "清空",
      filterPlaceHolder: "Filter",
      nonSelectedListLabel: '未选择字段',
      selectedListLabel: '已选择字段',
      preserveSelectionOnMove: 'moved',
      moveOnSelect: false,
      showFilterInputs: true,
      nonSelectedList: nonSelects || [],
      selectedList: selecteds || [],
      optionValue: "name",
      optionText: "title",
      doubleMove: true,
    });
  },

  /**
   * 更新单表查询页面的 SQL 构建器 和字段选择器
   */
  updateOperators: function () {
    var tables = this.tables,
      currentTableName = this.currentTableName;
    if (!tables || !tables[currentTableName] || !tables[currentTableName].fields) return;
    var datas = this.tables[this.currentTableName],
      tableInfo = {
        "title": datas.title || datas.name,
        "entityName": datas.entityName || datas.name,
        "tableName": datas.name
      };
    tableInfo.properties = this.getCurrentTableFields();
    this.createSQLBuilder(this.$singleQueryBuilder, [tableInfo], this.defaults.config);
    this.$singleQueryFieldBox.clearAllOptions();

    var defaults = this.defaults,
      dFields = defaults.fields,
      selected = [],
      nonSelected = [],
      tFields = this.getCurrentTableFields();
    // 获取 defaults.fields.selected 初始化被选中的表字段
    if (dFields && defaults.query === 'single' && this.currentTableName === defaults.tableName) {
      var dSelected = dFields.selected;
      for (let tf of tFields) {
        if (dSelected.indexOf(tf.name) != -1) {
          selected.push(tf);
        } else {
          nonSelected.push(tf);
        }
      }
      // 只初始化一次
      delete defaults.fields;
    } else {
      nonSelected = tFields;
    }
    this.$singleQueryFieldBox.addSelectElement({
      selectedList: selected,
      nonSelectedList: nonSelected
    });
  },

  /**
   * 格式化字段信息
   */
  formatFields: function (fields) {
    var properties = [];
    for (let field of fields) {
      let range = field.range,
        ranges = range ? range.split('-') : ['', ''];
      properties.push({
        "name": field.name,
        "title": field.remark || field.name,
        "type": field.type,
        "length": field.length,
        "isPK": field.isPK === 1,
        "nullable": field.nullable === 1,
        "groupable": !(field.groupable === 0),
        "orderable": !(field.orderable === 0),
        "enable": !(field.enable === 0),
        "min": ranges[0],
        "max": ranges[1]
      });
    }
    return properties;
  },

  /**
   * 获取当前表的所有字段
   */
  getCurrentTableFields: function () {
    (!this.tables || !this.currentTableName) && Utils.error('请选择需要查询的表');
    return this.tables[this.currentTableName].fields;
  },

  /**
   * 多表关联查询页面
   */
  getJoinTableQueryContent: function (hidden) {
    !hidden && (this.currentQuery = 'join');
    var that = this,
      defaults = this.defaults,
      $container = this.getNavContentBody('join-table-query', hidden);
    $container.append("<div class='operator-container'>" +
      "  <div class='joiner-container'>" +
      "    <div class='operator-title'>一、请配置关联表</div>" +
      "    <div class='operator-content joiner-builder'>" +
      "      <div class='builder-content'></div>" +
      "      <div class='builder-tools'>" +
      "        <div class='container-fluid'>" +
      "          <div class='btn-group btn-group-sm' role='group' aria-label='...'>" +
      "            <button type='button' class='btn btn-primary reset'>重置</button>" +
      "            <button type='button' class='btn btn-primary submit'>确认</button>" +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "  <div class='field-container'>" +
      "    <div class='operator-title'>二、选择需要查询的字段</div>" +
      "    <div class='operator-content'><select multiple='multiple' size='10'></select></div>" +
      "  </div>" +
      "  <div class='sql-container'>" +
      "    <div class='operator-title'>三、请选择查询条件</div>" +
      "    <div class='operator-content sql-builder'>" +
      "      <div class='builder-content'></div>" +
      "      <div class='builder-tools'>" +
      "        <div class='container-fluid'>" +
      "          <div class='btn-group btn-group-sm' role='group' aria-label='...'>"
      // + "            <button type='button' class='btn btn-primary sql-struct'>获取SQL结构</button>"
      +
      "            <button type='button' class='btn btn-primary parse-sql'>解析SQL</button>" +
      "            <button type='button' class='btn btn-primary advance'>高级查询</button>" +
      "            <button type='button' class='btn btn-primary excute-sql'>执行SQL</button>" +
      "            <button type='button' class='btn btn-primary reset'>重置</button>" +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</div>" +
      "<textarea class='result-sql'></textarea>");

    var $joinQueryFieldBox = this.$joinQueryFieldBox = $container.find(".field-container select");
    this.createFieldSeletor($joinQueryFieldBox, 'join_query_fields', [], []);
    var $joinSQL = this.$joinSQL = $container.find('.result-sql');
    defaults.query === 'join' && defaults.sql && $joinSQL.val(defaults.sql);

    var $joinQueryBuilder = this.$joinQueryBuilder = $container.find(".sql-container .sql-builder .builder-content");
    this.createSQLBuilder($joinQueryBuilder, []);

    this.$joiners = $container.find(".joiner-builder .builder-content");
    this.createJoinersBuilder(this.defaults.joinConfig);

    // 选择表关联部分的按钮
    $container.on('click', '.joiner-builder .submit', function () {
      that.updateJoinersBuilder();
    });
    $container.on('click', '.joiner-builder .reset', function () {
      that.createJoinersBuilder();
    });

    // SQL 构造器的点击事件
    $container.on("click", ".sql-struct", function () {
      // $joinSQL.val($joinQueryBuilder.getFormatJson());
    });
    $container.on("click", ".parse-sql", function () {
      var sql;
      try {
        sql = that.getJoinQuerySQL();
      } catch (err) {
        console.error(err);
        Utils.error(err.message, true);
        return;
      }
      $joinSQL.val(sql);
    });
    $container.on("click", ".excute-sql", function () {
      var sql = $joinSQL.val();
      Utils.isEmpty(sql) && Utils.error('SQL不能为空，请先解析SQL');
      // var fields = that.getSelectedJoinQueryFields();
      var fields = that.getQueryFieldsFromSQL(sql),
        tables = that.tables,
        tFields = [],
        aliasCache = that.aliasCache;
      for (let field of fields) {
        let index1 = field.indexOf('('),
          index2 = field.indexOf(')'),
          tField = field, // 字段名称 table.filedName
          tmp2 = '', // 聚合函数名称
          tTitle; // 字段标题
        // 判断是否存在聚合函数，如：COUNT(table.filedName)，解析出 filedName 字段的中文名称
        if (index1 != -1 && index2 != -1) {
          tField = field.substring(index1 + 1, index2); // 字段名称
          tmp2 = field.substring(0, index1); // 聚合函数名称
        }
        var tmps = tField.split('.'),
          tableName = aliasCache[tmps[0]], // 实际表名，tmps[0]为表别名
          table = tables[tableName]; // 实际表信息
        tTitle = table ? (tmp2 == '' ? tmps[0] + '.' + table.titles[tmps[1]] : tmp2 + '(' + table.titles[tmps[1]] + ')') : field;
        tFields.push({
          name: field,
          title: tTitle
        });
      }
      Array.isArray(fields) && fields.length > 0 && that.showSQLResult(sql, tFields);
    });
    $container.on("click", ".reset", function () {
      $joinQueryBuilder.reset();
    });
    $container.on("click", ".advance", function () {
      that.createAdvanceQuery();
    });
    return $container;
  },

  updateJoinerFieldSeletor: function () {

  },

  /**
   * 更新关联查询的SQL条件构造器
   */
  updateJoinersBuilder: function () {
    var that = this,
      tables = that.tables,
      joinerTables = that.getAllJoinTables(),
      resultTableObj = {},
      resultTables = [];
    // 获取 Join 规则中所有使用到的表信息及自段信息
    for (let joinerTable of joinerTables) {
      var tableName = joinerTable.name,
        tableInfo = resultTableObj[tableName];
      if (tableInfo) {
        tableInfo.alias.push(joinerTable.alias);
      } else {
        var table = tables[tableName];
        tableInfo = {
          title: table.title || table.name,
          entityName: table.entityName || table.name,
          tableName: table.name,
          properties: that.getTableFields(tableName),
          alias: [joinerTable.alias]
        }
        resultTables.push(tableInfo);
        resultTableObj[tableName] = tableInfo;
      }
    };
    that.createSQLBuilder(that.$joinQueryBuilder, resultTables);
  },

  /**
   * 创建关联表构造器
   */
  createJoinersBuilder: function (datas) {

    var tableChange = function (value, $table) {
      var $row = $table.parents('.joiner-row'),
        $alias = $row.find('.table-alias'),
        lastTableName = $table.data('last'),
        alias = $alias.val();

      var fields = that.getTableFields(value);
      // 更新表在字段选择框中的字段信息
      that.updateFieldBoxByTable(fields, value, lastTableName, alias);
    }

    var that = this;
    this.aliasCache = {};
    this.$joiners.empty();
    this.$joinQueryFieldBox.clearAllOptions();

    // 初始化关联表信息
    if (Array.isArray(datas) && datas.length > 0) {
      for (let i = 0; i < datas.length; i++) {
        this.$joiners.append(this.getJoinerRow({
          data: datas[i],
          isFirst: i === 0,
          className: i === 0 ? 'first-joiner-row' : '',
          tableChange: tableChange
        }));
      }
      that.updateJoinersBuilder();
    } else { // 默认的关联表配置
      this.$joiners.append(this.getJoinerRow({
        disabled: true,
        isFirst: true,
        className: 'first-joiner-row',
        tableChange: tableChange
      }));
    }
  },

  /**
   * 获取表连接规则的行
   * @param {Object} params 
   */
  getJoinerRow: function (params) {
    var that = this,
      data = params.data,
      $row = $("<div class='joiner-row " + (params && params.className ? params.className : '') + "'></div>");
    if (!params || !params.isFirst) {
      // join 连接符
      var $connector = this.getSelectItem(TABLE_JOIN_TYPES, 'join-connector');
      $row.append(this.getJoinerRowItem('connector-item').append($connector));
    }
    // 选择表
    var $tableAlias, // 表别名输入框
      $rightField, // 右边选择自己表字段的下拉框
      $table = this.getSelectItem(this.tables, 'table-select', function (value, $select, lastValue) {
        /**
         * 在此修改表修改时的一些公共响应效果
         */
        var alias = $tableAlias.val();
        // 判断表别名是否为空，如果为空则自动设置
        if (!alias) {
          alias = that.getRandomAlias('', value);
          $tableAlias.val(alias)
          $tableAlias.data('last', alias);
        }
        that.replaceFieldsToJoinerRowLeftFieldSelectByTableName(value, alias, $select.data('last'));
        // 触发自定义表修改事件
        params && Utils.isFunction(params.tableChange) && params.tableChange(value, $select, lastValue);
      });
    $table.val('');
    $row.append(this.getJoinerRowItem('join-table-item').append($table));
    // 表别名输入框
    $tableAlias = $("<input class='filter form-control ue-form show-clear table-alias' type='text' placeholder='表别名' oninput=\"this.value=this.value.replace(/[^a-zA-Z0-9]/g,'')\">");
    // 绑定输入框的change事件，保存值改变前的值
    $tableAlias.change(function () {
      var aliasChange = params ? params.aliasChange : null,
        value = $tableAlias.val(), // 当前表别名
        oValue = $tableAlias.data('last'), // 旧表别名
        tableName = $table.val(); // 当前表名
      // 获取唯一的表别名
      var tmp = that.getRandomAlias(value, tableName);
      if (tmp != value) {
        value = tmp;
        $tableAlias.val(value)
      }
      that.updateAliasCache(oValue, value, tableName);
      // 触发自定义的别名修改事件
      Utils.isFunction(aliasChange) && aliasChange(oValue, value);

      // 更新字段信息
      if (!Utils.isEmpty(tableName)) {
        // 更新字段选择器中的字段信息
        that.$joinQueryFieldBox.updateOptions(that.formatFieldFullName('', tableName, oValue),
          that.formatFieldFullName('', tableName, value), (oValue || tableName) + '.', value + '.');
        // 更新右边选择自己表字段的下拉框
        var fields = that.getTableFields(tableName);
        $rightField && that.updateJoinerRowRightFieldSelect($rightField, fields, tableName, value);
        that.replaceFieldsToJoinerRowLeftFieldSelectByTableAlias(tableName, value, oValue);
      }
      $tableAlias.data('last', value); // 保存旧值
    });
    $row.append(this.getJoinerRowItem('table-alias-item').append($tableAlias));
    // 按钮组
    var $btns = this.getJoinerRowItem('btn-item');
    // 删除按钮
    $btns.append('<button type="button" class="btn btn-xs btn-danger btn-remove" ' + (params && params.disabled ? 'disabled' : '') + '><span class="glyphicon glyphicon-trash" aria-hidden="true" ></span></button>' +
      '&nbsp;<button type="button" class="btn btn-xs btn-primary btn-add"><span class="glyphicon glyphicon-plus" aria-hidden="true" ></span></button>');
    $btns.find('.btn-remove').click(function () {
      that.removeJoinerRow($row, $table.val(), $tableAlias.val());
    });
    // 添加按钮
    $btns.find('.btn-add').click(function () {
      $row.after(that.getJoinerRow({
        tableChange: function (value, $table) {
          var $row = $table.parents('.joiner-row'),
            $fields = $row.find('.right-field-select'),
            alias = $row.find('.table-alias').val();
          var fields = that.getTableFields(value);
          // 更新表在字段选择器中的字段信息
          that.updateFieldBoxByTable(fields, value, $table.data('last'), alias);
          // 更新右边选择自己表字段的下拉框
          that.updateJoinerRowRightFieldSelect($fields, fields, value, alias);
          that.addFieldsToJoinerRowLeftFieldSelect(value, alias);
        }
      }));
    });
    $row.append($btns);
    if (!params || !params.isFirst) {
      // 左边选择字段的下拉框
      var $leftField = this.getSelectItem([], 'left-field-select');
      var fieldsObj = that.getAllJoinTableFields();
      for (let key in fieldsObj) {
        var obj = fieldsObj[key];
        var $group = $('<optgroup>').attr('label', obj.fullTitle);
        $.each(obj.fields, function (o, p) {
          $group.append('<option value="' + this.name + '">' + this.title + '</option>');
        });
        $leftField.append($group);
      }
      $row.append(this.getJoinerRowItem('second-group').append($leftField));

      // 右边选择自己表字段的下拉框
      var $operator = this.getSelectItem(TABLE_JOIN_CONNECTOR, 'field-connector');
      $row.append(this.getJoinerRowItem('second-group').append($operator));

      $rightField = this.getSelectItem([], 'right-field-select');
      $row.append(this.getJoinerRowItem('second-group').append($rightField));
    }

    // 初始化联表表单信息
    if (data) {
      var rightAlias = data.rightAlias,
        rightTable = data.rightTable;
      rightAlias && $tableAlias.val(rightAlias);
      rightTable && $table.val(rightTable).change();
      rightAlias && $tableAlias.change();
    }
    // $table.change(); // 设置默认值时触发选择表的下拉框的change事件
    return $row;
  },

  /**
   * 获取关联表参数的信息
   */
  getSelectedJoinQueryFields: function () {
    var advance = this.advance ? this.advance[this.joinQueryKey] : null,
      fieldsStr = this.$joinQueryFieldBox.getSelectedOptions();
    var fields = fieldsStr ? fieldsStr.split(',') : [];

    for (let i = 0; i < fields.length; i++) {
      fields[i] = fields[i].substring(fields[i].indexOf('.') + 1);
    }
    // 聚合函数
    if (advance && Array.isArray(advance.aggregations)) {
      $.each(advance.aggregations, function () {
        var field = this.field,
          values = field.split('.');

        fields.push(this.function + '(' + values[1] + '.' + values[2] + ')');
      });
    }
    if (fields.length < 1) {
      throw new Error('请选择需要查询的字段');
    }
    return fields;
  },

  /**
   * 从 SQL 中获取需要查询的字段（主要是截取 SELECT 与 WHERE 之前的字符串进行解析）
   * @param {String} sql SQL 语句
   */
  getQueryFieldsFromSQL: function (sql) {
    Utils.isEmpty(sql) && Utils.error('数据查询 SQL 不合法！');
    var tmp = sql.toUpperCase(),
      index1 = tmp.indexOf('SELECT'),
      index2 = tmp.indexOf('FROM');
    if (index1 == -1 || index2 == -1) Utils.error('数据查询 SQL 不合法！');
    var fields = sql.substring(index1 + 6, index2).trim().split(',');
    for (let i = 0; i < fields.length; i++) {
      // 考虑给字段取了别名的情况
      var tmp = fields[i] = fields[i].trim();
      index3 = tmp.toUpperCase().indexOf(' AS ');
      if (index3 != -1) {
        fields[i] = fields[i].substring(index3 + 4).trim();
      }
      Utils.isEmpty(fields[i]) && Utils.error('数据查询 SQL 不合法！');
    }
    return fields;
  },

  /**
   * 获取关联表参数的信息
   */
  getJoinTableParams: function () {
    var that = this,
      params = []
    this.$joiners.find('.joiner-row').each(function () {
      var $this = $(this),
        isFirst = $this.hasClass('first-joiner-row'),
        $table = $this.find('.table-select'),
        $alias = $this.find('.table-alias'),
        tableName = that.getAndCheckValue($table, '关联表不能为空'),
        alias = that.getAndCheckValue($alias, '表别名不能为空');
      var param = {
        rightTable: tableName,
        rightAlias: alias,
        isFirst: isFirst
      };
      if (!isFirst) { // 除了第一个基表，其他关联表需要选择关联字段、关联类型、关联表、连接符等信息
        var $connector = $this.find('.join-connector'),
          $leftField = $this.find('.left-field-select'),
          $rightField = $this.find('.right-field-select'),
          $operator = $this.find('.field-connector');
        param.connector = that.getAndCheckValue($connector, '关联类型不能为空');

        param.leftField = that.getAndCheckValue($leftField, '关联字段不能为空');
        var tmps = param.leftField.split('.');
        param.leftTable = tmps[0];
        param.leftAlias = tmps[1];
        param.leftField = tmps[1] + '.' + tmps[2];

        param.rightField = that.getAndCheckValue($rightField, '关联字段不能为空');
        param.rightField = param.rightField.substring(param.rightField.indexOf('.') + 1)

        param.operator = that.getAndCheckValue($operator, '字段连接符不能为空');
      }
      params.push(param);
    });
    return params;
  },

  getAndCheckValue: function ($item, tip) {
    var value = $item.val();
    if (Utils.isEmpty(value)) {
      $item.parent().addClass('has-error');
      throw new Error(tip);
    } else {
      $item.parent().removeClass('has-error');
    }
    return value;
  },

  /**
   * 拼接连接查询的 SQL
   */
  getJoinQuerySQL: function () {
    var joinTables = this.getJoinTableParams();
    var database = '', // this.defaults.databseName + '.',
      fields = this.getSelectedJoinQueryFields().join(','), // 需要查询的字段
      advance = this.advance ? this.advance['join'] : null;
    var sql = "SELECT " + fields + " FROM ";

    var tableName = ''
    for (let table of joinTables) {
      if (table.isFirst) {
        tableName += database + table.rightTable + ' ' + table.rightAlias;
      } else {
        tableName += " " + table.connector + " " + database + table.rightTable + " " + table.rightAlias +
          " ON " + table.leftField + " " + table.operator + " " + table.rightField + " ";
      }
    }
    sql += tableName;
    var where = this.$joinQueryFieldBox.parseSQL(), // 查询的 WHERE 条件
      group = '',
      orderBy = '',
      page = '';
    if (advance) {

      // 分组条件
      var groupFields = advance.groupFields;
      if (Array.isArray(groupFields)) {
        group = " GROUP BY ";
        for (let i = 0; i < groupFields.length; i++) {
          group += groupFields[i].substring(groupFields[i].indexOf('.') + 1) + ',';
        }
        group = group.substring(0, group.length - 1);
      }

      // 排序参数
      if (Array.isArray(advance.orderBy)) {
        var orders = advance.orderBy,
          ordered = [];
        for (let order of orders) {
          var item = order.field;
          item = item.substring(item.indexOf('.') + 1);
          if (ordered.indexOf(item) != -1) continue;
          orderBy += item + ' ' + order.direction + ',';
          ordered.push(item);
        }
        orderBy = orderBy.substring(0, orderBy.length - 1);
      }

      // 分页参数
      if (advance.pageSize) {
        var page = advance.page,
          pageSize = advance.pageSize,
          start = pageSize * (page - 1),
          end = start + Number(pageSize);
        page = start + " < ROWNUM AND ROWNUM <=" + (end);
      }
    }
    if (where) {
      if (group && page) { // 分组和分页同时存在时
        sql += ' WHERE ' + where + ' AND ' + page + group;
      } else if (group) { // 只存在分组
        sql += ' WHERE ' + where + group;
      } else if (page) {
        sql += ' WHERE ' + where + ' AND ' + page;
      } else {
        sql += ' WHERE ' + where;
      }
    } else {
      if (group && page) { // 分组和分页同时存在时
        sql += ' WHERE ' + page + group;
      } else if (group) { // 只存在分组
        sql += group;
      } else if (page) {
        sql += ' WHERE ' + where + ' AND ' + page;
      }
    }
    if (orderBy) {
      sql += " ORDER BY " + orderBy;
    }
    return sql;
  },

  /**
   * 获取一个下拉框
   * @param {Array} datas 下拉框的数据
   * @param {String} className 类名
   * @param {String} nameKey datas 每一行数据中下拉框项 value 对应的 key
   * @param {String} titleKey datas 每一行数据中下拉框项 title 对应的 key
   */
  getSelectItem: function (datas, className, change, nameKey, titleKey) {
    var $select = $('<select class="form-control selectpicker bs-select-hidden mobile-device ' + className + '"></select>');
    nameKey = nameKey || 'name';
    titleKey = titleKey || 'title';
    $.each(datas, function (i, j) {
      $select.append('<option value="' + this[nameKey] + '">' + this[titleKey] + '</option>');
    });
    $select.change(function () {
      Utils.isFunction(change) && change($select.val(), $select, $select.data('last'));
      $select.data('last', $select.val()); // 保存旧的下拉框数据
    });
    return $select;
  },

  formatFieldFullName: function (value, tableName, tableAlias) {
    return tableName + '.' + (tableAlias || '') + '.' + (value || '');
  },

  /**
   * 更新右边选择自己表字段的下拉框
   * @param {JQuery} $fields 下拉框
   * @param {Array} fields 下拉框的选项数据
   * @param {String} tableName 当前行的表名
   * @param {String} alias 当前行的别名
   */
  updateJoinerRowRightFieldSelect: function ($fields, fields, tableName, alias) {
    $fields.empty();
    var that = this;
    $.each(fields, function (i, j) {
      $fields.append('<option value="' + that.formatFieldFullName(this.name, tableName, alias) + '">' + this.title + '</option>');
    });
    // 获取旧值，如果只是更新了别名，则设置回原来的值
    var oValue = $fields.data('last'),
      oValues = oValue ? oValue.split('.') : [];
    if (oValues.length > 2) {
      if (oValues[0] == tableName) {
        var tmp = that.formatFieldFullName(oValues[2], tableName, alias);
        $fields.val(tmp);
        $fields.data('last', tmp);
      }
    }
  },

  /**
   * 添加表字段到左边选择关联字段的下拉框
   * @param {String} tableName 表名
   * @param {String} alias 表别名
   */
  addFieldsToJoinerRowLeftFieldSelect: function (tableName, alias) {
    var that = this;
    var datas = {};
    var fields = that.getTableFields(tableName);
    var tArr = [];
    for (let field of fields) {
      tArr.push({
        name: that.formatFieldFullName(field.name, tableName, alias),
        title: alias + '.' + field.title
      });
    }
    datas.label = that.tables[tableName].title + '（' + alias + '）';
    datas.fields = tArr;
    // 拼装 optgroup
    var optgroup = "<optgroup label='" + datas.label + "'>";
    $.each(datas.fields, function () {
      optgroup += '<option value="' + this.name + '">' + this.title + '</option>';
    });
    optgroup += "</optgroup>";
    this.$joiners.find('.joiner-row .left-field-select').each(function () {
      var $this = $(this),
        cAlias = $this.parents('.joiner-row').find('.table-alias').val();
      cAlias != alias && $this.append(optgroup);
    });
  },

  /**
   * 通过表名替换表字段到左边选择关联字段的下拉框
   * @param {String} tableName 表名
   * @param {String} alias 表别名
   */
  replaceFieldsToJoinerRowLeftFieldSelectByTableName: function (tableName, alias, oldTableName) {
    if (oldTableName) {
      var tableTitle = this.tables[oldTableName].title + '（' + alias + '）';
      this.$joiners.find('.joiner-row .left-field-select optgroup[label=' + tableTitle + ']').remove();
      this.addFieldsToJoinerRowLeftFieldSelect(tableName, alias);
    }
  },

  /**
   * 通过表别名替换表字段到左边选择关联字段的下拉框
   * @param {String} tableName 表名
   * @param {String} alias 表别名
   */
  replaceFieldsToJoinerRowLeftFieldSelectByTableAlias: function (tableName, alias, oldAlias) {
    if (tableName) {
      var tableTitle = this.tables[tableName].title,
        tmp = this.formatFieldFullName('', tableName, alias);
      this.$joiners.find('.joiner-row .left-field-select optgroup[label=' + tableTitle + '（' + oldAlias + '）]').each(function () {
        var $this = $(this);
        $this.attr('label', tableTitle + '（' + alias + '）');
        $this.find('option').each(function () {
          var $option = $(this),
            values = $option.attr('value').split('.'),
            texts = $option.text().split('.');
          $option.attr('value', tmp + values[2]);
          $option.text(alias + '.' + texts[1]);
        });
      });
    }
  },

  /**
   * 更新表在字段选择框中的字段信息
   * @param {Array} fields 字段信息
   * @param {String} tableName 当前表名
   * @param {String} lastTableName 旧表名
   * @param {String} alias 当前表别名
   */
  updateFieldBoxByTable: function (fields, tableName, lastTableName, alias) {
    // 移除旧字段
    this.$joinQueryFieldBox.removeSelectElements(this.formatFieldFullName('', lastTableName, alias));
    var boxFields = []
    for (let field of fields) {
      var name = field.name;
      boxFields.push({
        name: this.formatFieldFullName(name, tableName, alias),
        title: (alias || tableName) + '.' + field.title
      });
    }
    // 添加更新后的字段
    this.$joinQueryFieldBox.addSelectElement({
      nonSelectedList: boxFields
    });
  },

  /**
   * 删除连接表的行
   * @param {JQuery} $row 行
   * @param {String} tableName 表名
   * @param {String} alias 表别名
   */
  removeJoinerRow: function ($row, tableName, alias) {
    if (tableName) {
      // 删除字段选择器中该表的字段信息
      this.$joinQueryFieldBox.removeSelectElements(this.formatFieldFullName('', tableName, alias));
      // 删除左边字段选择下拉框中该表的字段信息
      var tableTitle = this.tables[tableName].title + '（' + alias + '）';
      this.$joiners.find('.joiner-row .left-field-select optgroup[label=' + tableTitle + ']').remove();
    }
    delete this.aliasCache[alias];
    $row.remove();
  },

  /**
   * 获取表连接的一行规则
   * @param {String} className 类名
   */
  getJoinerRowItem: function (className) {
    return $("<div class='joiner-row-item " + (className || '') + "'></div>")
  },

  /**
   * 判断并生成随机不重复额别名（不完全随机）
   * @param {String} alias 别名
   */
  getRandomAlias: function (alias, tableName) {
    if (!alias) {
      alias = 't';
      // 未选择表先填别名时，设置为null
      this.aliasCache[alias] = tableName || 'null';
    }
    let tmp = alias;
    for (var i = 1; ; i++) {
      if (!this.aliasCache[alias]) break;
      alias = tmp + '' + i;
    }
    // 未选择表先填别名时，设置为null
    this.aliasCache[alias] = tableName || 'null';
    return alias;
  },

  /**
   * 更新当前别名缓存，为了别名不重复，维护一个{}保存别名
   * @param {String} oldAlias 旧别名
   * @param {String} newAlias 新别名
   */
  updateAliasCache: function (oldAlias, newAlias, tableName) {
    delete this.aliasCache[oldAlias];
    this.aliasCache[newAlias] = true;
  },

  /**
   * 获取所有 Join 的表字段信息
   * @param {String|Array} excludeTables 排除表名
   */
  getAllJoinTableFields: function (excludeTables) {
    var that = this,
      tables = this.tables,
      selectTables = this.getAllJoinTables(excludeTables),
      allFields = {};
    for (let table of selectTables) {
      var tableName = table.name,
        fields = that.getTableFields(tableName),
        tableTitle = tables[tableName].title,
        alias = table.alias,
        tfArr = [];
      for (let field of fields) {
        var tField = $.extend(true, {}, field);
        tField.name = that.formatFieldFullName(field.name, tableName, alias);
        tField.title = alias + '.' + field.title;
        tfArr.push(tField);
      }
      allFields[tableName + '.' + alias] = {
        name: tableName,
        alias: alias,
        title: tableTitle,
        fullTitle: tableTitle + '（' + alias + '）',
        fields: tfArr
      };
    }
    return allFields;
  },

  /**
   * 获取所有 Join 的表信息
   * @param {String|Array} excludeTables 排除表名
   */
  getAllJoinTables: function (excludeTables) {
    var tables = [];
    if (typeof excludeTables == 'string') {
      excludeTables = [excludeTables];
    }
    excludeTables = Array.isArray(excludeTables) ? excludeTables : null;
    this.$joiners.find('.joiner-row').each(function () {
      var $this = $(this),
        $table = $this.find('.table-select'),
        $alias = $this.find('.table-alias'),
        tableName = $table.val();
      if (!tableName || (excludeTables && excludeTables.indexOf(tableName) != -1)) return;
      var table = {
        name: tableName,
        lastName: $table.data('last'),
        alias: $alias.val(),
        lastAlias: $alias.data('last')
      };
      tables.push(table);
    });
    return tables;
  },

  /**
   * 顶部的导航栏
   * @param {String} className 类名
   * @param {String} hide 是否隐藏
   */
  getNavContentBody: function (className, hide) {
    return $("<div class='nav-content-item " + (className ? className : '') + "' " + (hide ? "style='display: none'" : "") + "></div>")
  },

  /**
   * 获取数据库表信息
   */
  getTableInfo() {
    var tables = [];
    Utils.newtecRequest({
      async: false,
      operServiceId: "metaService",
      operId: "getTables",
      data: this.connectionId,
      token: "e3f20cc5d3d544a38a4d84d5d668b511",
      success: function (res) {
        if (res.status === 0) {
          tables = res.data;
        }
      }
    });
    return tables;
  },

  /**
   * 获取数据库表字段信息
   * @param {String} tableName 表名
   */
  getTableFields(tableName) {
    var that = this,
      tables = this.tables,
      fields = [];
    if (tables && tables[tableName].fields) {
      fields = tables[tableName].fields;
    } else {
      Utils.newtecRequest({
        async: false,
        operServiceId: "metaService",
        operId: "getTableFields",
        data: {
          connectionId: this.connectionId,
          tableName: tableName
        },
        token: "e3f20cc5d3d544a38a4d84d5d668b511",
        success: function (res) {
          if (res.status === 0) {
            fields = that.formatFields(res.data);
          }
        }
      });
      var titles = {};
      for (let field of fields) {
        titles[field.name] = field.title;
      }
      tables[tableName].fields = fields;
      tables[tableName].titles = titles;
    };
    // 只返回需要显示的字段
    var result = [];
    if (Array.isArray(fields)) {
      for (let field of fields) {
        field.enable && result.push(field);
      }
    }
    return result;
  },

  /**
   * 高级查询
   */
  createAdvanceQuery: function () {
    this.advanceEnables = this.advanceEnables ? this.advanceEnables : {};
    this.advance = this.advance ? this.advance : {};
    var currentQuery = this.currentQuery,
      isSingleQuery = this.currentQuery == this.singleQueryKey, // 是否是单表查询
      advance = this.advance[currentQuery] ? this.advance[currentQuery] : null,
      enables = this.advanceEnables[currentQuery] = this.advanceEnables[currentQuery] || { // 启用/禁用高级选项
        group: false,
        order: false,
        aggregation: false,
        pagination: false
      }
    $footer = $("<button type='button' class='btn btn-primary' data-dismiss='modal'>确定</button>"),
      $body = $("<div class='advance-body'>" +
        "  <div class='advance-item group-container'>" +
        "    <div class='advance-item-title'>选择分组字段<div class='advance-item-tool'>&nbsp;<input type='checkbox' target='group' " + (!enables.group ? '' : 'checked') + ">&nbsp;" + (!enables.group ? '<span class="text-danger">禁用' : '<span>启用') + "</span></div></div>" +
        "    <div class='advance-item-content'><fieldset " + (!enables.group ? 'disabled' : '') + "><select multiple='multiple' size='10'></select></fieldset></div>" +
        "  </div>" +
        "  <div class='advance-item common-container aggregation-container'>" +
        "    <div class='advance-item-title'>配置聚合函数<div class='advance-item-tool'>&nbsp;<input type='checkbox' target='aggregation' " + (!enables.aggregation ? '' : 'checked') + ">&nbsp;" + (!enables.aggregation ? '<span class="text-danger">禁用' : '<span>启用') + "</span></div></div>" +
        "    <div class='advance-item-content'><fieldset " + (!enables.aggregation ? 'disabled' : '') + "></fieldset></div>" +
        "  </div>" +
        "  <div class='advance-item common-container order-container'>" +
        "    <div class='advance-item-title'>配置排序规则<div class='advance-item-tool'>&nbsp;<input type='checkbox' target='order' " + (!enables.order ? '' : 'checked') + ">&nbsp;" + (!enables.order ? '<span class="text-danger">禁用' : '<span>启用') + "</span></div></div>" +
        "    <div class='advance-item-content'><fieldset " + (!enables.order ? 'disabled' : '') + "></fieldset></div>" +
        "  </div>" +
        "  <div class='advance-item pagination-container'>" +
        "    <div class='advance-item-title'>配置分页条件<div class='advance-item-tool'>&nbsp;<input type='checkbox' target='pagination' " + (!enables.pagination ? '' : 'checked') + ">&nbsp;" + (!enables.pagination ? '<span class="text-danger">禁用' : '<span>启用') + "</span></div></div>" +
        "    <div class='advance-item-content'>" +
        "      <fieldset " + (!enables.pagination ? 'disabled' : '') + ">" +
        "        <div class='form-group'>" +
        "	      	 <label class='control-label'>页号</label>" +
        "	      	 <input type='text' class='form-control page-number' value='" + (advance && advance.page ? advance.page : '') + "' oninput=\"this.value = this.value.replace(/[^0-9]/g, '');\" placeholder='请输入页号'>" +
        "	       </div>" +
        "        <div class='form-group'>" +
        "	         <label class='control-label'>每页数据量</label>" +
        "		     <select class='form-control page-size'></select>" +
        "	       </div>" +
        "      </fieldset>" +
        "    </div>" +
        "  </div>" +
        "</div>");
    var $group = $body.find('.group-container .advance-item-content select'),
      $order = $body.find('.order-container .advance-item-content fieldset'),
      $pagination = $body.find('.pagination-container .advance-item-content fieldset'),
      $aggregation = $body.find('.aggregation-container .advance-item-content fieldset');
    enables.$group = $group.parent();
    enables.$order = $order;
    enables.$aggregation = $aggregation;
    enables.$pagination = $pagination;
    $body.find('.advance-item-tool input').change(function () {
      var target = $(this).attr('target'),
        $target = enables['$' + target];
      enables[target] = !enables[target];
      $tip = $(this).next();
      if (enables[target]) {
        $tip.text('启用').removeClass('text-danger');
        $target.removeAttr("disabled");
      } else {
        $tip.text('禁用').addClass('text-danger');
        $target.attr("disabled", 'disabled');
      }
    });

    var that = this,
      pages = this.defaults.pages,
      $pageSize = $pagination.find('.page-size');
    $.each(pages, function () {
      $pageSize.append("<option value='" + this + "'>" + this + " 条</option>");
    });
    advance && advance.pageSize && $pageSize.val(advance.pageSize);

    var allFields = isSingleQuery ? that.getCurrentTableFields() : that.getAllJoinTableFields();

    // 获取字段选择器的初始化字段
    var selecteds, nonSelects, allGroupFields = allFields;

    // 多表查询，需要把所有的表字段都合并到一个数组中
    if (!isSingleQuery) {
      allGroupFields = [];
      for (let key in allFields) {
        $.merge(allGroupFields, allFields[key].fields);
      }
    }
    if (advance && advance.groupFields && advance.groupFields.length > 0) {
      selecteds = [];
      nonSelects = [];
      var groupFields = advance.groupFields;
      for (let field of allGroupFields) {
        // 判断字段是否支持分组
        if (field.groupable) {
          if (groupFields.indexOf(field.name) != -1) {
            selecteds.push(field);
          } else {
            nonSelects.push(field);
          }
        }
      }
    } else {
      var tmpFields = [];
      for (let field of allGroupFields) {
        field.groupable && tmpFields.push(field);
      }
      nonSelects = tmpFields;
    }
    this.createFieldSeletor($group, 'group-fields', selecteds, nonSelects);

    // 初始化聚合函数选择器
    if (advance && Array.isArray(advance.aggregations) && advance.aggregations.length > 0) {
      var aggregations = advance.aggregations;
      for (let i = 0; i < aggregations.length; i++) {
        $aggregation.append(this.getAggregationRuleRow(allFields, i == 0, aggregations[i]));
      }
    } else {
      $aggregation.append(this.getAggregationRuleRow(allFields, true));
    }

    // 初始化排序规则选择器,获取支持排序的字段
    var orderFields;
    if (isSingleQuery) {
      orderFields = [];
      for (let field of allFields) {
        field.orderable && orderFields.push(field);
      }
    } else {
      var orderFields = $.extend(true, {}, allFields);
      for (let key in orderFields) {
        var tFields = [];
        for (let field of orderFields[key].fields) {
          field.orderable && tFields.push(field);
        }
        orderFields[key].fields = tFields;
      }
    }

    if (advance && Array.isArray(advance.orderBy) && advance.orderBy.length > 0) {
      var orders = advance.orderBy;
      for (let i = 0; i < orders.length; i++) {
        $order.append(this.getOrderRuleRow(orderFields, i == 0, orders[i]));
      }
    } else {
      $order.append(this.getOrderRuleRow(orderFields, true));
    }

    $footer.click(function () {
      var result = {
        groupFields: null,
        aggregations: [],
        orderBy: [],
        page: null,
        pageSize: null
      };
      // 获取分组字段信息
      if (enables.group) {
        var fields = $group.getSelectedOptions();
        result.groupFields = fields ? fields.split(',') : null;
      }

      // 获取聚合函数字段信息
      if (enables.aggregation) {
        var aggregations = result.aggregations;
        $aggregation.find('.aggregation-row').each(function () {
          var $this = $(this),
            field = $this.find('.first-select').val(),
            func = $this.find('.second-select').val();
          field && func && aggregations.push({
            field: field,
            function: func
          });
        });
      }

      // 获取排序字段信息
      if (enables.order) {
        var orderBy = result.orderBy;
        $order.find('.order-row').each(function () {
          var $this = $(this),
            orderField = $this.find('.first-select').val(),
            direction = $this.find('.second-select').val();
          orderField && direction && orderBy.push({
            field: orderField,
            direction: direction
          });
        })
      }

      // 获取分页信息
      if (enables.pagination) {
        result.page = $pagination.find('.page-number').val();
        result.pageSize = $pageSize.val();
      }
      that.advance[currentQuery] = result;
    });

    Utils.createWindow({
      body: $body,
      footer: $footer,
      title: '高级查询',
      width: '95%',
      height: '90%',
    })
  },

  /**
   * 获取排序规则的行
   * @param {Boolean} disabled 是否隐藏
   */
  getOrderRuleRow: function (fields, disabled, value) {
    that = this;
    return this.getRuleRow({
      name: 'order',
      select1: fields,
      select2: [{
        name: 'ASC',
        title: '升序'
      }, {
        name: 'DESC',
        title: '降序'
      }],
      addCall: function ($row) {
        $row.after(that.getOrderRuleRow(fields));
      },
      value: {
        select1: value ? value.field : null,
        select2: value ? value.direction : null
      },
      disabled: disabled
    });
  },

  /**
   * 获取聚合函数规则行
   * @param {Boolean} disabled 是否隐藏
   */
  getAggregationRuleRow: function (fields, disabled, value) {
    var that = this;
    aggregationFuncs = [{
      name: 'AVG',
      title: '平均值'
    },
    {
      name: 'COUNT',
      title: '项目数'
    },
    {
      name: 'MAX',
      title: '最大值'
    },
    {
      name: 'MIN',
      title: '最小值'
    },
    {
      name: 'SUM',
      title: '总和'
    }
    ] || SQL_AGGREGATION_FUNCTION;

    return this.getRuleRow({
      name: 'aggregation',
      select1: fields,
      select2: aggregationFuncs,
      addCall: function ($row) {
        $row.after(that.getAggregationRuleRow(fields));
      },
      optionValue: function (row) {
        return row.name + '.' + row.type
      },
      select1Change: function ($select1, $select2) {
        var value = $select1.val();
        if (!value) return;
        var values = value.split('.')
        type = values[values.length - 1],
          fucTypes = Utils.getAggregationFunctionTypes(type)
        functions = [];
        $select2.empty();
        if (Array.isArray(fucTypes)) {
          for (let fType of fucTypes) {
            $select2.append('<option value="' + fType + '">' + SQL_AGGREGATION_FUNCTION[fType] + '</option>');
          }
        }
      },
      value: {
        select1: value ? value.field : null,
        select2: value ? value.function : null
      },
      disabled: disabled
    });
  },

  /**
   * 获取排序规则的行
   */
  getRuleRow: function (params) {
    var $row = $("<div class='advance-row " + (params.name ? params.name + '-row' : '') + "'></div>"),
      item = "<div class='advance-row-item " + (params.name ? params.name + '-row-item' : '') + "'></div>";
    var select1 = params.select1,
      select2 = params.select2
    value = params.value;
    var $first = this.getRuleRowSelect(select1, 'first-select', params.optionValue);
    value.select1 && $first.val(value.select1);
    var $second = this.getRuleRowSelect(select2, 'second-select');
    value.select2 && $second.val(value.select2);

    // 绑定值改变事件
    $first.change(function () {
      Utils.isFunction(params.select1Change) && params.select1Change($first, $second);
    });
    $first.change();

    $row.append($(item).append($first));
    $row.append($(item).append($second));
    // 删除按钮
    var $delete = $(item).addClass('btn-item');
    $delete.append('<button type="button" class="btn btn-xs btn-danger" ' + (params.disabled ? 'disabled' : '') + '><span class="glyphicon glyphicon-trash" aria-hidden="true" ></span></button>');
    $delete.find('button').click(function () {
      Utils.isFunction(params.deleteCall) && params.deleteCall($row);
      $row.remove();
    });
    $row.append($delete);
    // 添加按钮
    var $add = $(item).addClass('btn-item');
    $add.append('<button type="button" class="btn btn-xs btn-primary"><span class="glyphicon glyphicon-plus" aria-hidden="true" ></span></button>');
    $add.find('button').click(function () {
      Utils.isFunction(params.addCall) && params.addCall($row);
    });
    $row.append($add);
    return $row;
  },

  /**
   * 针对多表关联时存在多个表的字段做分组显示
   * @param {Array} fields 字段
   * @param {String} className 类名
   * @param {String} valueFunc 取值的方法
   */
  getRuleRowSelect: function (fields, className, valueFunc) {
    var $select = $('<select class="form-control selectpicker bs-select-hidden mobile-device ' + className + '"></select>');
    if (Array.isArray(fields)) {
      $.each(fields, function (i, j) {
        $select.append('<option value="' + (Utils.isFunction(valueFunc) ? valueFunc(this) : this.name) + '">' + this.title + '</option>');
      });
    } else if (!Utils.isEmpty(fields)) {
      for (let key in fields) {
        var obj = fields[key];
        var $group = $('<optgroup>').attr('label', obj.fullTitle);
        $.each(obj.fields, function (o, p) {
          $group.append('<option value="' + (Utils.isFunction(valueFunc) ? valueFunc(this) : this.name) + '">' + this.title + '</option>');
        });
        $select.append($group);
      }
    }
    return $select;
  },
  setTopBodyBefore: function ($page) { },
  setTopBodyAfter: function ($page) { },
  setBottomBodyBefore: function ($page) { },
  setBottomBodyAfter: function ($page) { },
  createPageBefore: function ($page) { },
  createPageAfter: function ($page) {
    var finishEvents = this.finishEvents;
    for (let eventFunc of finishEvents) {
      eventFunc();
    }
  }
}
