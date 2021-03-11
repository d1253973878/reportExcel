API = {
  reportServlet: 'http://192.168.0.110:16654/reportRouterServlet'
}

Utils = {

  /**
   * 通用请求工具
   * @param {Object} params 参数
   *     type: POST|GET|DELETE|UPDATE
   *     contentType: application/json | application/x-www-form-urlencoded | text
   *     data: 请求数据
   *     async 是否为异步请求
   *     success: () => {}
   *     error: () => {}
   *     
   */
  request: function (params) {
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open(params.type || 'POST', params.url, params.async !== false);
    xhr.setRequestHeader('Content-Type', params.contentType || 'application/json');
    xhr.withCredentials = false;

    var sendData = null;
    const {
      contentType,
      data
    } = params;
    if (data) {
      if (contentType === "multipart/form-data") {
        sendData = new FormData();
        for (let key in data) {
          sendData.append(key, data[key]);
        }
      } else if (contentType === "application/json") {
        sendData = JSON.stringify(data);
      } else if (contentType === "text") {
        sendData = "";
        for (let key in data) {
          sendData += key + "=" + data[key] + "&";
        }
        if (sendData != "") {
          sendData = sendData.substring(0, sendData.length - 1);
        }
      } else if (contentType === "application/x-www-form-urlencoded") {
        sendData = "";
        for (let key in data) {
          sendData += key + "=" + data[key] + "&";
        }
        if (sendData != "") {
          sendData = sendData.substring(0, sendData.length - 1);
        }
      }
    }
    xhr.onreadystatechange = function () {
      if (4 === xhr.readyState) {
        const {
          success,
          error
        } = params;
        const {
          status,
          responseText
        } = xhr;
        if (200 == status) {
          typeof success === 'function' && success(JSON.parse(responseText));
        } else {
          typeof error === 'function' && success(responseText);
        }

      }
    }
    xhr.send(sendData);
  },

  /**
   * 普通 GET Http 请求
   * @param {Object} params 请求参数
   */
  httpGet: function (params) {
    params = Object.assign({
      type: 'GET',
    }, params)
    request(params);
  },

  /**
   * 平台请求
   * @param {Object} params 请求参数
   *      与上诉支持的请求参数一致，另外还支持以下
   *      operServiceId，operId，token
   */
  newtecRequest: function (params) {
    var params = Object.assign({
      url: API.reportServlet,
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
    }, params);
    const {
      data,
      operServiceId,
      operId,
      token
    } = params;
    delete params.operServiceId;
    delete params.operId;
    var rParams = {
      data,
      operServiceId,
      operId,
      token
    };
    params.data = {
      params: JSON.stringify(rParams)
    };
    this.request(params);
  },
  /**
   * 根据值类型获取该类型支持的所有操作符的配置信息
   * @param {String} type 值类型
   */
  getProperties: function (type) {
    var items = null;
    $.each(PROPERTY_TYPES, function (m) {
      if (type in PROPERTY_TYPES[m]) {
        var types = PROPERTY_TYPES[m];
        items = types[type];
        if (typeof (items) === 'string') {
          items = types[items];
        }
        return false;
      }
    });
    return items;
  },

  /**
   * 根据值类型获取该类型支持的操作符的配置信息
   * @param {String} type 值类型
   * @param {String} operator 操作符
   */
  getPropertyItemByOperator: function (type, operator) {
    var item = null,
      items = this.getProperties(type);
    if (Array.isArray(items)) {
      $.each(items, function (q) {
        if (operator == items[q].value) {
          item = items[q];
          return false;
        }
      });
    }
    return item;
  },

  /**
   * 根据字段类型获取支持的聚合函数类型
   */
  getAggregationFunctionTypes: function (type) {
    var types = COLUMN_AGGREGATION_TYPE[type];
    if (typeof types === 'string') {
      return COLUMN_AGGREGATION_TYPE[types];
    }
    return types;
  },

  /**
   * 格式化JSON源码(对象转换为JSON文本)
   * @param {String} 需要格式化或压缩的json格式的字符串
   * @param {Boolean} compress 是否压缩
   * @returns {String}
   */
  formatJson: function (txt, compress) {
    if (!txt) return '';
    var indentChar = '    ';
    if (/^\s*$/.test(txt)) {
      alert('数据为空,无法格式化! ');
      return;
    }
    try {
      var data = eval('(' + txt + ')');
    } catch (e) {
      alert('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
      return;
    };
    var draw = [],
      line = compress ? '' : '\n',
      nodeCount = 0,
      maxDepth = 0;

    var notify = function (name, value, isLast, indent /*缩进*/ , formObj) {
      nodeCount++; /*节点计数*/
      for (var i = 0, tab = ''; i < indent; i++) tab += indentChar; /* 缩进HTML */
      tab = compress ? '' : tab; /*压缩模式忽略缩进*/
      maxDepth = ++indent; /*缩进递增并记录*/
      if (value && value.constructor == Array) {
        /*处理数组*/
        draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line); /*缩进'[' 然后换行*/
        for (var i = 0; i < value.length; i++)
          notify(i, value[i], i == value.length - 1, indent, false);
        draw.push(tab + ']' + (isLast ? line : (',' + line))); /*缩进']'换行,若非尾元素则添加逗号*/
      } else if (value && typeof value == 'object') {
        /*处理对象*/
        draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line); /*缩进'{' 然后换行*/
        var len = 0,
          i = 0;
        for (var key in value) len++;
        for (var key in value) notify(key, value[key], ++i == len, indent, true);
        draw.push(tab + '}' + (isLast ? line : (',' + line))); /*缩进'}'换行,若非尾元素则添加逗号*/
      } else {
        if (typeof value == 'string') value = '"' + value + '"';
        draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
      };
    };
    var isLast = true,
      indent = 0;
    notify('', data, isLast, indent, false);
    return draw.join('');
  },

  /**
   * 格式化SQL
   * @param {Object} structure SQL构造器返回的数据
   */
  formatSQL: function (structure) {
    var that = this,
      sql = '',
      columnQuotes = "'",
      valueQuotes = "'"; // 在数据库类型不同的时候，引号不同，后面考虑数据库类型差异时使用
    if (!structure) return sql;
    var rules = structure.rules;
    $.each(rules, function (i) {
      if (i > 0) {
        sql += structure.connector;
      }
      sql += " " + this.alia + '.' + this.property + ' ' + this.operator + ' ';

      var isStr = SQL_VALUE_TYPES[this.type].isString;
      value = this.value;
      if (value instanceof Array) {
        isStr && (value = that.formatArrayValue(value, valueQuotes));
        sql += ' ( ' + value.join(',') + " ) ";
      } else if (value instanceof Object) {
        sql += ' ' + value.alia + '.' + value.property + ' ';
      } else {
        if (value === undefined) return;
        // 如果是 in 或 not in 查询
        if (this.operator == 'in' || this.operator == 'not in') {
          isStr && (value = that.formatCommaValue(value, valueQuotes));
          sql += ' ( ' + value + " ) ";
        } else {
          isStr && (value = that.formatSingleValue(value, valueQuotes));
          sql += ' ' + value + ' ';
        }
      }
    });

    var ruleGroups = structure.rulesGroup;
    $.each(ruleGroups, function (m) {
      sql += structure.connector + ' ( ';
      // 递归生成
      sql += Utils.formatSQL(ruleGroups[m]) + " ) ";
    });

    return sql = sql.trim();
  },

  /**
   * 给单个数据添加引号
   * @param {String} value 数据
   * @param {String} quotes 引号
   */
  formatSingleValue: function (value, quotes) {
    return quotes + value + quotes;
  },

  /**
   * 给数据中的字符串数据添加引号
   * @param {Array} values 数据
   * @param {String} quotes 引号
   */
  formatArrayValue: function (values, quotes) {
    if (Array.isArray(values)) {
      for (let i = 0; i < values.length; i++) {
        values[i] = this.formatSingleValue(values[i], quotes);
      }
    }
    return values;
  },

  /**
   * 给,分割的字符串数据添加引号
   * @param {String} value 数据
   * @param {String} quotes 引号
   */
  formatCommaValue: function (value, quotes) {
    return this.formatArrayValue(value.split(/[^\\],/), quotes);
  },

  isEmpty: function (obj) {
    if (typeof obj === "undefined" || obj == null || obj == "") {
      return true;
    }
    return false;
  },

  isFunction: function (fuc) {
    return typeof fuc == 'function';
  },

  /**
   * 生成UUID
   */
  uuid: function () {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * 创建弹窗
   * @param {Object} params 参数
   */
  createWindow: function (params) {
    params = params || {};
    params.height = this.getFormatPx(params.height);
    var style = params.height ? "height:" + params.height + ';' : '';
    params.width = this.getFormatPx(params.width);
    style += params.width ? "width:" + params.width + ';' : '';
    var $window = $("<div class='modal fade' id='" + this.uuid() + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>" +
      "	<div class='modal-dialog query-modal-dialog' " + (style ? "style='" + style + "'" : "") + " role='document'>" +
      "		<div class='modal-content query-modal-content " + (params.contentClass || '') + "'>" +
      "			<div class='modal-header query-modal-header " + (params.headerClass || '') + "'>" +
      "				<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
      "				<h4 class='modal-title'>" + (params.title || '') + "</h4>" +
      "			</div>" +
      "			<div class='modal-body query-modal-body " + (params.bodyClass || '') + "'></div>" +
      "			<div class='modal-footer query-modal-footer " + (params.footerClass || '') + "'>" +
      "           <button type='button' class='btn btn-primary' data-dismiss='modal'>确定</button>" +
      "         </div>" +
      "		</div>" +
      "	</div>" +
      "</div>");
    var $dialog = $window.find('.modal-dialog'),
      $content = $window.find('.modal-content'),
      $header = $window.find('.modal-header'),
      $body = $window.find('.modal-body'),
      $footer = $window.find('.modal-footer');

    params.header && $header.html(params.header);
    params.body && $body.html(params.body);
    params.footer && $footer.html(params.footer);
    $window.modal();
  },

  getFormatPx: function(value) {
    if(value == null) return '';
    var num = Number(value);
    return isNaN(num) ? value : num + 'px';
  },

  success: function (tip) {
    this.hint(tip, '提示');
  },

  error: function (tip, notThrowError) {
    this.hint(tip, '出错啦');
    if (!notThrowError) {
      throw new Error(tip);
    }
  },

  hint: function (tip, title) {
    this.createWindow({
      title: title,
      body: tip,
      width: 300,
      height: 150
    });
  }
}