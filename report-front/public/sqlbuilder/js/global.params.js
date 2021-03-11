/**
 * 这是初始化的元数据
 * @type {*[]}
 */
var sourceData = [{
  "title": '用户表', // 表中文名称
  "entityName": "User", // 实体名
  "tableName": 't_user', // 表名
  "properties": [{
      "name": "id", // 字段名
      "title": "ID", // 字段中文名
      "type": "string" // 字段类型
    },
    {
      "name": "name",
      "title": "姓名",
      "type": "string"
    },
    {
      "name": "age",
      "title": "年龄",
      "type": "int"
    },
    {
      "name": "depart_num",
      "title": "部门编号",
      "type": "foreign"
    },
    {
      "name": "createTime",
      "title": "创建时间",
      "type": "string"
    },
    {
      "name": "updateTime",
      "title": "更新时间",
      "type": "string"
    }
  ],
  "alias": [ // 表别名，在做表连接的时候使用
    "User1",
    "User2"
  ]
}];

/**
 * 保存的查询SQL的结构，次结构可上传到后台，在后台生成SQL
 * @type {{rules: *[], rulesGroup: *[]}}
 */
var saveJson = {
  "connector": "or",
  "rules": [{
      "entity": "User", // 实体名
      "alia": "User1", // 别名
      "property": "id", // 字段名
      "type": "string", // 字段类型
      "operator": "=", // 条件符号
      "value": "372930" // 条件值
    },
    {
      "entity": "User",
      "alia": "User2",
      "property": "name",
      "type": "string",
      "operator": "in",
      "value": [
        "郭鹏飞",
        "武彩平"
      ]
    }
  ],
  "rulesGroup": [ // 嵌套规则组，与上层结构一致
    {
      "connector": "and",
      "rules": [{
          "entity": "User",
          "alia": "User1",
          "property": "id",
          "type": "string",
          "operator": "=",
          "value": "372930"
        },
        {
          "entity": "User",
          "alia": "User2",
          "property": "depart_num",
          "type": "foreign",
          "operator": "=",
          "value": {
            "entity": "User",
            "alia": "User1",
            "property": "id"
          }
        }
      ],
      "rulesGroup": []
    }
  ]
};

/**
 * key 和 连接符的映射关系
 * @type {*[]}
 */
var PROPERTY_TYPES = [{
    "byte": [{
        "value": "=",
        "text": "等于",
        "inputType": "new_val_input",
        "tip": "请输入一个字节",
        "callback": false
      },
      {
        "value": ">=",
        "text": "大于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个字节",
        "callback": false
      },
      {
        "value": "<=",
        "text": "小于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个字节",
        "callback": false
      },
      {
        "value": "!=",
        "text": "不等于",
        "inputType": "new_val_input",
        "tip": "请输入一个字节",
        "callback": false
      }
    ]
  },
  {
    "short": [{
        "value": "=",
        "text": "等于",
        "inputType": "new_val_input",
        "tip": "请输入一个short数据",
        "callback": false
      },
      {
        "value": ">=",
        "text": "大于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个short数据",
        "callback": false
      },
      {
        "value": "<=",
        "text": "小于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个short数据",
        "callback": false
      },
      {
        "value": "!=",
        "text": "不等于",
        "inputType": "new_val_input",
        "tip": "请输入一个short数据",
        "callback": false
      }
    ]
  },
  {
    "int": [{
        "value": "=",
        "text": "等于",
        "inputType": "new_val_input",
        "tip": "请输入一个整数",
        "callback": false
      },
      {
        "value": ">=",
        "text": "大于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个整数",
        "callback": false
      },
      {
        "value": "<=",
        "text": "小于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个整数",
        "callback": false
      },
      {
        "value": "!=",
        "text": "不等于",
        "inputType": "new_val_input",
        "tip": "请输入一个整数",
        "callback": false
      }
    ]
  },
  {
    "float": [{
        "value": "=",
        "text": "等于",
        "inputType": "new_val_input",
        "tip": "请输入一个小数",
        "callback": false
      },
      {
        "value": ">=",
        "text": "大于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个小数",
        "callback": false
      },
      {
        "value": "<=",
        "text": "小于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个小数",
        "callback": false
      },
      {
        "value": "!=",
        "text": "不等于",
        "inputType": "new_val_input",
        "tip": "请输入一个小数",
        "callback": false
      }
    ]
  },
  {
    "double": [{
        "value": "=",
        "text": "等于",
        "inputType": "new_val_input",
        "tip": "请输入一个小数",
        "callback": false
      },
      {
        "value": ">=",
        "text": "大于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个小数",
        "callback": false
      },
      {
        "value": "<=",
        "text": "小于等于",
        "inputType": "new_val_input",
        "tip": "请输入一个小数",
        "callback": false
      },
      {
        "value": "!=",
        "text": "不等于",
        "inputType": "new_val_input",
        "tip": "请输入一个小数",
        "callback": false
      }
    ],
    "NUMBER": "double",
  },
  {
    "date": [{
        "value": "=",
        "text": "等于",
        "inputType": "new_val_input",
        "tip": "请选择日期",
        "callback": false
      },
      {
        "value": "!=",
        "text": "不等于",
        "inputType": "new_val_input",
        "tip": "请选择日期",
        "callback": false
      },
      {
        "value": ">=",
        "text": "大于等于",
        "inputType": "new_val_input",
        "tip": "请选择日期",
        "callback": false
      },
      {
        "value": "<=",
        "text": "小于等于",
        "inputType": "new_date_in",
        "tip": "请选择日期",
        "callback": false
      }
    ]
  },
  {
    "timestamp": [{
        "value": "=",
        "text": "等于",
        "inputType": "new_date_in",
        "tip": "请选择日期",
        "callback": false
      },
      {
        "value": "!=",
        "text": "不等于",
        "inputType": "new_date_in",
        "tip": "请选择日期",
        "callback": false
      },
      {
        "value": ">=",
        "text": "大于等于",
        "inputType": "new_date_in",
        "tip": "请选择日期",
        "callback": false
      },
      {
        "value": "<=",
        "text": "小于等于",
        "inputType": "new_date_in",
        "tip": "请选择日期",
        "callback": false
      }
    ]
  },
  {
    "string": [{
        "value": "=",
        "text": "等于",
        "inputType": "new_val_typeahead",
        "tip": "请输入一个字符串",
        "callback": true
      },
      {
        "value": "!=",
        "text": "不等于",
        "inputType": "new_val_typeahead",
        "tip": "请输入一个字符串",
        "callback": true
      },
      {
        "value": "in",
        "text": "包含",
        "inputType": "new_val_typeahead",
        "tip": "请输入多个字符串，以英文逗号分割",
        "callback": true
      },
      {
        "value": "not in",
        "text": "不包含",
        "inputType": "new_val_typeahead",
        "tip": "请输入多个字符串，以英文逗号分割",
        "callback": true
      },
      {
        "value": " is null",
        "text": "为空",
        "inputType": "null",
        "callback": true
      },
      {
        "value": "is not null",
        "text": "不为空",
        "inputType": "null",
        "callback": true
      }
    ],
    "VARCHAR2": "string",
    "NVARCHAR2": "string",
    "CHAR": "string",
    "CLOB": "string",
    "NCLOB": "string",
  },
  {
    "foreign": [{
      "source": true,
      "value": "=",
      "text": "等于",
      "tip": "请选择关联属性",
      "inputType": "new_val_foreign_select",
      "callback": false
    }]
  }
];

/**
 * SQL 聚合函数
 */
var SQL_AGGREGATION_FUNCTION = {
  AVG: '平均值',
  COUNT: '项目数',
  MAX: '最大值',
  MIN: '最小值',
  SUM: '总和'
}

/**
 * 表连接关系
 */
var TABLE_JOIN_TYPES = [{
    name: 'LEFT JOIN',
    title: '左连接'
  },
  {
    name: 'RIGHT JOIN',
    title: '右连接'
  },
  {
    name: 'INNER JOIN',
    title: '等值连接'
  },
];

var TABLE_JOIN_CONNECTOR = [{
    name: '=',
    title: '等于'
  },
  {
    name: '<',
    title: '小于'
  },
  {
    name: '>',
    title: '大于'
  },
  {
    name: '>=',
    title: '大于等于'
  },
  {
    name: '<=',
    title: '小于等于'
  },
];

// 字段类型支持的聚合函数类型（数据表示真正的聚合函数类型数组，如果是字符串，则表示指向另一种类型的聚合函数类型数组）
var COLUMN_AGGREGATION_TYPE = {
  "NUMBER": ['AVG', 'COUNT', 'MAX', 'MIN', 'SUM'],
  "string": ['COUNT', 'MAX', 'MIN'],
  "VARCHAR2": "string",
  "NVARCHAR2": "string",
  "CHAR": "string",
  "CLOB": "string",
  "NCLOB": "string",
};

// SQL 值类型
var SQL_VALUE_TYPES = {
  /** MySQL 数值类型 */
  "TINYINT": {
    isNumber: true
  },
  "SMALLINT": {
    isNumber: true
  },
  "MEDIUMINT": {
    isNumber: true
  },
  "INT": {
    isNumber: true
  },
  "BIGINT": {
    isNumber: true
  },
  "FLOAT": {
    isNumber: true
  },
  "DOUBLE": {
    isNumber: true
  },
  "DECIMAL": {
    isNumber: true
  },
  /** MySQL 日期和时间类型 */
  "DATE": {
    isString: true
  },
  "TIME": {
    isString: true
  },
  "YEAR": {
    isString: true
  },
  "DATETIME": {
    isString: true
  },
  "TIMESTAMP": {
    isString: true
  },
  /** MySQL 字符串类型 */
  "CHAR": {
    isString: true
  },
  "VARCHAR": {
    isString: true
  },
  "TINYBLOB": {
    isString: true
  },
  "TINYTEXT": {
    isString: true
  },
  "BLOB": {
    isString: true
  },
  "TEXT": {
    isString: true
  },
  "MEDIUMBLOB": {
    isString: true
  },
  "MEDIUMTEXT": {
    isString: true
  },
  "LONGBLOB": {
    isString: true
  },
  "LONGTEXT": {
    isString: true
  },

  /** Oracle 字符串类型 */
  "VARCHAR2": {
    isString: true
  },
  "NVARCHAR2": {
    isString: true
  },
  "CHAR": {
    isString: true
  },
  "CLOB": {
    isString: true
  },
  "NCLOB": {
    isString: true
  },

  /** Oracle 数值类型 */
  "NUMBER": {
    isNumber: true
  },
  "FLOAT": {
    isNumber: true
  },

  /** Oracle 二进制类型 */
  "RAW": {},
  "ROWID": {},

  /** Oracle 时间类型 */
  "DATE": {
    isString: true
  },
  "TIMESTAMP": {
    isString: true
  },
  "TIMESTAMP WITH TIMEZONE": {
    isString: true
  },
  "INTERVAL YEAR TO MONTH": {
    isString: true
  },
  "INTERVAL DAY TO SECOND": {
    isString: true
  }
}
