	//自动义的API关键字
	var obj = {};
	
	//api文档说明 需要设置参数才生效
	var objContent = {};
	
	obj.db = ["createDatabase()","createDatabase(databaseName)","createTable(tableName)","createTable(databaseName,tableName)",
		"deleteData(tableName,id)","deleteData(databaseName,tableName,id)",
		"dropDatabase(databaseName)","dropTable(databaseName,tableName)",
		"exist(tableName,id)","exist(tableName,columnsArray,valuesArray)",
		"exist(databaseName,tableName,id)","exist(databaseName,tableName,columnsArray,valuesArray)",
		"findData(tableName,columnsArray,valuesArray,fqColumnsArray,fqValuesArray,startRowKey,maxRecord)",
		"findData(tableName,columnsArray,valuesArray,startRowKey,maxRecord)",
		"findData(tableName,startRowKey,maxRecord)","findData(databaseName,tableName,id)",
		"findData(databaseName,tableName,columnsArray,valuesArray,fqColumnsArray,fqValuesArray,startRowKey,maxRecord)",
		"findData(databaseName,tableName,columnsArray,valuesArray,startRowKey,maxRecord)",
		"findData(databaseName,tableName,startRowKey,maxRecord)",
		"findDataByComplexCondition(tableName, String[][] columnOpValues, String[][] fqColumnOpValues, startRowKey, maxRecord)",
		"findDataByComplexCondition(databaseName, tableName, String[][] columnOpValues, String[][] fqColumnOpValues, startRowKey,maxRecord)",
		"findDataFQ(tableName,columnsArray,valuesArray, startRowKey,maxRecord)",
		"findDataFQ(databaseName, tableName,columnsArray,valuesArray, startRowKey, long maxRecord)",
		"updateData(tableName,columnsArray,valuesArray)",
		"updateData(databaseName, tableName,columnsArray,valuesArray)",
		"updateData(databaseName, tableName, id,columnsArray,valuesArray)",
		"updateDataById(tableName, id,columnsArray,valuesArray)",
		"updateDataById(databaseName, tableName, id,columnsArray,valuesArray)"
		];
	obj.cache = ["getCacheEntry(cacheName, cacheKey)","getEternalCacheEntry(cacheName, cacheKey)",
		"putCacheEntry(cacheName, cacheKey, cacheValue)",
		"putEternalCacheEntry(cacheName, cacheKey, cacheValue)",
		"removeCacheEntry(cacheName, cacheKey)",
		"removeEternalCacheEntry(cacheName, cacheKey)"];
	obj.log = ["DEBUG(ObjectLog)","DEBUG(StringLog)","DEBUG(template,varsArrayArray)",
		"ERROR(ObjectLog)","ERROR(StringLog)","ERROR(template,varsArray)","FINAL(ObjectLog)",
		"FINAL(StringLog)","FINAL(template,varsArray)","INFO(ObjectLog)","INFO(StringLog)",
		"INFO(template,varsArray)","WARN(ObjectLog)","WARN(StringLog)",
		"WARN(template,varsArray)"];
	obj.http = ["sendGet(url)","sendGet(url, MaphttpHeaderMap)","sendPost(url, MapformParams)",
		"sendPost(url, MapformParams, MaphttpHeaderMap)","sendPost(url, jsonString, MapformParams, MaphttpHeaderMap)",
		"sendHttpsGet(url)",
		"sendHttpsGet(url, MaphttpHeaderMap)","sendHttpsJsonPost(url, jsonString, MaphttpHeaderMap)",
		"sendHttpsPost(url, MapformParams)",
		"sendHttpsPost(url, MapformParams, MaphttpHeaderMap)","sendJsonPost(url, jsonString, MaphttpHeaderMap)"];
	obj.security = ["decrypt(encryptStr,password)","decryptBASE64ToString(key)",
		"decryptUrlSafeBASE64(key)","encrypt(content, password)",
		"encryptHMAC(content, key)","encryptHMACSHA1(data, key)",
		"encryptMD5(content)","encryptSHA(content)",
		"encryptSHA1(content)","encryptSimpleMD5(content)",
		"encryptSimpleSHA(content)"];
	obj.timer = ["pauseAllTimer()","addTimer(timerName, appId, version, driverName, cronExpression)",
		"pauseTimer(timerName)",
		"removeTimer(timerName)","resumeAllTimer()","resumeTimer(timerName)",
		"updateTimer(timerName, cronExpression)"];
	obj.webTools = ["getUUID()","getJsonMessage(booleanResult,code,ObjectData,exception,message)",
		"htmlEscape(escapeString)",
		"htmlUnEscape(escapeString)","jsonStringToMap(jsonString)","objectToJsonString(obj)",
		"parseXML(xml)","randomAlphabetic(intSize)","randomAlphanumeric(intSize)",
		"split(string,separatorChars)","utf8UnEscape(escapeString)",
		"validateCaptcha(webParamObject,captchaCode)"];
	obj.webParams = ["getDomain()","getSiteId()",
		"getServiceId()","getParamValues()",
		"getMultiParamValues()","getServiceUrl()",
		"getAppReleaseId()","getAppId()",
		"getSessionItem()","getAfterSiteUrl()","getAfterServiceUrl()"];
	obj.collectionTools = ["getList()","getMap()","getSet()",
		"getObjectArray()","getStringArray()"];
	obj.mail = ["sendMail(smtpAccountName, smtpPassword, smtpServerAddress, smtpServerPort, boolean isSSL, fromMailAddress, toMailAddress, subject, htmlMessage, txtMessage)"];
	obj.vm = ["assemble(content,charset,dataMap)"];
	






	objContent.createDatabase = ["创建数据库 createDatabase() 说明：创建一个当前应用的默认数据库，如果已经存在，则不做任何操作 返回值：Map对象",
		"创建新数据库 方法：createDatabase(String databaseName) 说明：创建一个新的数据库，如果已经存在，则不做任何操作 返回值：Map对象",
		"默认数据库内创建表 方法：createTable(String tableName) 说明：在应用默认数据库内创建表，如果已经有同名表，则不作处理 返回值：Map对象",
		"创建一张新的表 方法：createTable(String databaseName,String tableName) 说明：创建一张新的表，如果数据库不存在则按照指定数据库名字创建这个数据库 返回值：Map对象",
		"根据id删除当前app的表数据 方法：deleteData(String tableName,String id) 说明：根据id删除当前app的表数据 返回值：Map对象",
		"根据id删除指定app表数据 方法：deleteData(String databaseName,String tableName,String id) 说明：根据id删除指定appid的表数据 返回值：Map对象",
		"删除指定库 方法：dropDatabase(String databaseName) 说明：删除一个指定名称数据库，并且删除以下所有表及数据 返回值：void",
		"删除指定库指定表 方法： dropTable(String databaseName, String tableName) 说明：删除指定数据库的数据表 返回值：void",
		"当前app根据id查数据存在 方法： exist(String tableName, String id) 说明：根据id查询当前app中某个表中是否存在某条数据 返回值：boolean",
		"当前app根据列值查数据存在 方法： exist(String tableName, String[] columns, String[] values) 说明：根据字段名称和对应值查询表中数据是否存在 返回值：boolean",
		"指定库根据id查数据存在 方法： exist(String databaseName, String tableName, String id) 说明：根据id判断是否在指定数据库内表数据是否存在 返回值：boolean",
		"指定库表数据是否存在 方法： exist(String databaseName, String tableName, String[] columns, String[] values) 说明：判断是否在指定数据库内表数据是否存在 返回值：boolean",
		"当前app复杂条件查询 方法： findData(String tableName, String[] columns, String[] values, String[] fqColumns, String[] fqValues, String startRowKey, long maxRecord) 说明：默认查询当前app，根据字段名，字段值，复杂查询条件，起始记录和结束记录查询，返回Map集合 返回值：Map",
		"当前app列值查询 方法： findData(String tableName, String[] columns, String[] values, String startRowKey, long maxRecord) 说明：默认查询当前app，根据字段名，字段值，组合复杂查询条件，起始记录和结束记录查询，返回Map集合 返回值：Map",
		"当前app起始记录查询 方法：findData(String tableName, String startRowKey, int maxRecord) 说明：默认查询当前app，根据表名，开始记录数，记录数目查询 返回值：Map",
		"指定库表按主键查询 方法： findData(String databaseName, String tableName, String id) 说明：在应用指定数据库内按照主键查找数据 返回值：Map",
		"指定库复杂条件查询 方法：findData(String databaseName, String tableName, String[] columns, String[] values, String[] fqColumns, String[] fqValues, String startRowKey, long maxRecord)说明：指定查询数据库，根据字段名，字段值，组合复杂查询条件，起始记录和记录数目查询，返回Map集合 返回值：Map",
		"指定库表数据列值查询 方法： findData(String databaseName, String tableName, String[] columns, String[] values, String startRowKey, long maxRecord) 说明：指定查询数据库，根据字段名，字段值，起始记录和记录数目查询，返回Map集合 返回值：Map",
		"指定库起止记录查询 方法： findData(String databaseName, String tableName, String startRowKey, int maxRecord) 说明：指定查询数据库，根据起始记录和记录数目查询，返回Map集合 返回值：Map",
		"当前app复合条件查询 方法： findDataByComplexCondition(String tableName, String[][] columnOpValues, String[][] fqColumnOpValues, String startRowKey, long maxRecord) 说明：复合条件查询，默认当前app 返回值：Map",
		"指定库复合条件查询 方法： findDataByComplexCondition(String databaseName, String tableName, String[][] columnOpValues, String[][] fqColumnOpValues, String startRowKey, long maxRecord) 说明：复合条件查询，指定app数据库名称 返回值：Map",
		"当前app列值组合查询 方法：findDataFQ(String tableName, String[] columns, String[] values, String startRowKey, long maxRecord) 说明：默认当前app，根据字段名，字段值，起始记录和记录数目查询 返回值：Map",
		"指定库列值组合查询 方法： findDataFQ(String databaseName, String tableName, String[] columns, String[] values, String startRowKey, long maxRecord) 说明：指定app数据库名称，根据字段名，字段值，起始记录和记录数目查询 返回值：Map",
		"当前app更新表数据 方法： updateData(String tableName, String[] columns, Object[] values) 说明：在指定应用默认数据库内更新表数据，如果数据库和表均为建立，则直接建立数据库和表之后插入数据，id可包含在 @param columns 内，用于更新某条记录，如果无id则系统自动生成并插入新纪录 返回值：Map",
		"指定库更新表数据 方法： updateData(String databaseName, String tableName, String[] columns, Object[] values) 说明：在指定数据库内更新表数据，如果数据库和表均为建立，则直接建立数据库和表之后插入数据，如果数据库或者表不存在，则创建数据库或者表之后再行插入数据，id可包含在 @param columns 内，用于更新某条记录，如果无id则系统自动生成并插入新纪录 返回值：Map",
		"指定库根据id更新表数据 方法： updateData(String databaseName, String tableName, String id, String[] columns, String[] values) 说明：指定app数据库名称，根据id根据表的数据，字段和表不存在则创建 返回值：Map",
		"当前app根据id更新表数据 方法： updateDataById(String tableName, String id, String[] columns, String[] values) 说明：在应用默认数据库内更新表数据，如果数据库和表均为建立，则直接建立数据库和表之后插入数据，如果数据库或者表不存在，则创建数据库或者表之后再行插入数据，可以指定id，用于更新某条记录，如果id为null则系统自动生成，并插入新数据 返回值：Map",
		"指定库根据id列值更新表数据 方法： updateDataById(String databaseName, String tableName, String id, String[] columns, String values) 说明：在指定数据库内更新表数据，如果数据库和表均为建立，则直接建立数据库和表之后插入数据，如果数据库或者表不存在，则创建数据库或者表之后再行插入数据，可以指定id，用于更新某条记录，如果id为null则系统自动生成，并插入新数据 返回值：Map"
	];
	objContent.getCacheEntrycacheNamecacheKey = ["获取缓存 方法：getCacheEntry(String cacheName, String cacheKey) 说明：根据缓存的name和key获取缓存的数据实体 返回值：Map对象",
		"获取永久缓存 方法：getEternalCacheEntry(String cacheName, String cacheKey) 说明：根据缓存的name和key获取永久缓存的数据实体 返回值：Map对象",
		"设置缓存 方法：putCacheEntry(String cacheName, String cacheKey, String cacheValue) 说明：根据缓存的name、key和value设置缓存数据 返回值：Map对象",
		"设置永久缓存 方法：putEternalCacheEntry(String cacheName, String cacheKey, String cacheValue) 说明：根据缓存的name、key和value设置永久缓存数据 返回值：Map对象",
		"移除缓存 方法：removeCacheEntry(String cacheName, String cacheKey) 说明：根据缓存的name和key移除缓存数据 返回值：Map对象",
		"移除永久缓存 方法：removeEternalCacheEntry(String cacheName, String cacheKey) 说明：根据缓存的name和key移除永久缓存数据 返回值：Map对象"
	];

	objContent.DEBUGObjectLog = ["调试级别-对象 方法：DEBUG(Object log) 说明：调试级别，输出对象 返回值：void",
		"调试级别-字符串 方法：DEBUG(String log) 说明：调试级别，输出字符串 返回值：void",
		"调试级别-模板-数组 方法：DEBUG(String template, String[] vars) 说明：调试级别，输出模板，数组变量 返回值：void",
		"错误级别-对象 方法：ERROR(Object log) 说明：错误级别，输出对象 返回值：void",
		"错误级别-字符串 方法：ERROR(String log) 说明：错误级别，输出字符串 返回值：void",
		"错误级别-模板-数组 方法：ERROR(String template, String[] vars) 说明：错误级别，输出模板，数组变量 返回值：void",
		"FINAL级别-对象 方法：FINAL(Object log) 说明：FINAL级别，输出对象 返回值：void",
		"FINAL级别-字符串 方法：FINAL(String log) 说明：FINAL级别，输出字符串 返回值：void",
		"FINAL级别-模板-数组 方法：FINAL(String template, String[] vars) 说明：FINAL级别，输出模板，数组变量 返回值：void",
		"普通级别-对象 方法：INFO(Object log) 说明：普通级别，输出对象 返回值：void",
		"普通级别-字符串 方法：INFO(String log) 说明：普通级别，输出字符串 返回值：void",
		"普通级别-模板-数组  方法：INFO(String template, String[] vars) 说明：普通级别，输出模板，数组变量 返回值：void",
		"警告级别-对象 方法：WARN( Object log) 说明：警告级别，输出对象 返回值：void",
		"警告级别-字符串 方法：WARN(String log) 说明：警告级别，输出字符串 返回值：void",
		"警告级别-模板-数组 方法：WARN(String template, String[] vars) 说明：警告级别，输出模板，数组变量 返回值：void"
	];

	objContent.sendGeturl = ["GET获取方式 方法：sendGet(String url) 说明：get方法获取远程地址内容 返回值：Map对象",
		"带header的Get获取方式 方法：sendGet(String url, MaphttpHeaderMap) 说明：get方法获取远程地址内容，指定http的header部分 返回值：Map对象",
		"Post方式提交数据 方法：sendPost(String url, MapformParams) 说明：post方法发送表单给远程地址 返回值：Map对象",
		"带header的Post方式 方法：sendPost(String url, MapformParams, MaphttpHeaderMap) 说明：post方法发送表单给远程地址，指定http的header部分 返回值：Map对象",
		"Post方式提交json数据 方法：sendPost(String url, String jsonString, MapformParams, MaphttpHeaderMap) 说明：支持json字符串方式post至远程服务器 返回值：Map对象",
		"HTTPS协议GET获取方式 方法：sendHttpsGet(String url) 说明：使用https协议安全的get方法获取远程地址内容 返回值：String",
		"带header的HTTPS协议的GET获取方式 方法：sendHttpsGet(String url, MaphttpHeaderMap) 说明：带http头的https安全的get方法获取远程地址内容 返回值：String",
		"HTTPS协议带header的Post方式提交json数据 方法：sendHttpsJsonPost(String url, String jsonString, MaphttpHeaderMap) 说明：HTTPS协议的安全的带header的Post方式提交json数据 返回值：String",
		"HTTPS协议form表单Post提交数据 方法：sendHttpsPost(String url,  MapformParams) 说明：HTTPS协议下，使用form表单的方式Post提交数据 返回值：String",
		"HTTPS协议带header的form表单Post提交数据 方法：sendHttpsPost(String url, MapformParams, MaphttpHeaderMap) 说明：HTTPS协议下，带header的使用form表单的方式Post提交数据 返回值：Map对象",
		"带header的Post方式提交json数据 方法：sendJsonPost(String url, String jsonString, MaphttpHeaderMap) 说明：带header的Post方式提交json数据 返回值：Map对象"
	];

	objContent.decryptencryptStrpassword = ["AES 解密 方法：decrypt(String encryptStr, String password) 说明：AES 解密，解密字符串，密码 返回值：String",
		"UrlSafe的Base64反编码 方法：decryptBASE64ToString(String key) 说明：UrlSafe的Base64反编码同 decryptUrlSafeBASE64 返回值：String",
		"UrlSafe的Base64反编码 方法：decryptUrlSafeBASE64(String key) 说明：UrlSafe的Base64反编码 返回值：String",
		"AES 加密 方法：encrypt(String content, String password) 说明：AES 加密，加密内容，密码 返回值：String",
		"HMAC加密 方法：encryptHMAC(String content, String key) 说明：HMAC加密 返回值：String",
		"HMac-SHA1 编码 方法：encryptHMACSHA1(String data, String key) 说明：HMac-SHA1 编码 返回值：String",
		"MD5加密 方法：encryptMD5(String content) 说明：对内容进行MD5加密 返回值：String",
		"SHA加密 方法：encryptSHA(String content) 说明：对内容进行SHA加密 返回值：String",
		"SHA1加密 方法：encryptSHA1(String content) 说明：对内容进行SHA1加密 返回值：String",
		"MD5纯加密 方法：encryptSimpleMD5(String content) 说明：MD5纯加密 返回值：String",
		"SHA纯加密 方法：encryptSimpleSHA(String content)  说明：SHA纯加密 返回值：String"
	];

	objContent.pauseAllTimer = ["暂停所有计时器 方法：pauseAllTimer() 说明：暂停所有计时器 返回值：void",
		"添加一个定时器 方法：addTimer(String timerName, String appId, String version, String driverName, String cronExpression) 说明：添加一个定时器 返回值：void",
		"暂停指定计时器 方法：pauseTimer(String timerName) 说明：暂停指定计时器 返回值：void",
		"删除一个定时器 方法：removeTimer(String timerName) 说明：删除一个定时器 返回值：void",
		"恢复所有计时器 方法： resumeAllTimer() 说明：恢复所有计时器 返回值：void",
		"恢复一个计时器 方法： resumeTimer(String timerName) 说明：恢复一个计时器 返回值：void",
		"更新一个定时器时间 方法： updateTimer(String timerName, String cronExpression) 说明：更新一个定时器时间 返回值：void"
	];

	objContent.getUUID = ["取得UUID 方法：getUUID() 说明：取得uuid 返回值：String",
		"返回Json数据 方法： getJsonMessage(boolean result,   String code, Object data,   String exception, String message) 说明：返回给前端的json数据 返回值：Map",
		"封装html数据 方法： htmlEscape(String escapeString) 说明：封装html数据 返回值：String",
		"解析html数据 方法： htmlUnEscape(String escapeString) 说明：解析html数据 返回值：String",
		"json字符串转为map对象 方法：jsonStringToMap(String jsonString) 说明：json字符串转为map对象 返回值：Map",
		"对象转为json字符串 方法： objectToJsonString(Object obj) 说明：对象转为json字符串 返回值：String",
		"解析xml数据 方法：parseXML(String xml) 说明：解析xml数据 返回值：String",
		"指定位数随机数 方法：randomAlphabetic(int size) 说明：指定位数随机数 返回值：String",
		"指定位数随机数  方法： randomAlphanumeric(int size) 说明：指定位数随机数 返回值：String",
		"指定字符分割字符串 方法：split(String string,   String separatorChars) 说明：指定字符分割字符串 返回值：String",
		"utf编码解析html 方法：utf8UnEscape(String escapeString) 说明：utf编码解析html 返回值：String",
		"验证验证码的正确性 方法：validateCaptcha(WebParamObject webParamObject,   String captchaCode) 说明：验证验证码的正确性 返回值：boolean"
	];

	objContent.getDomain = ["取得网站域名 方法：getDomain() 说明：取得网站域名 返回值：String",
		"取得网站siteId 方法：getSiteId()  说明： 取得网站siteId 返回值：String",
		"获取网站服务id 方法：getServiceId() 说明：获取网站服务id 返回值：String",
		"获取网站请求参数 方法： MapgetParamValues(); 说明：获取网站请求参数 返回值：Map",
		"获取多参数值 方法：Map getMultiParamValues() 说明：获取多个请求参数的值 返回值：String",
		"获取网站服务url 方法：String getServiceUrl() 说明：获取网站服务url 返回值：String",
		"获取App发布版本id 方法：String getServiceId() 说明：获取App发布版本id 返回值：String",
		"获取AppId 方法：String getAppId() 说明：获取AppId 返回值：String",
		"获取Session项 方法：com.ms.security.model.SecurityObjectContext getSessionItem() 说明：获取Session项  返回值：SecurityObjectContext",
		"获取网站url后面部分 方法： String getAfterSiteUrl() 说明：获取网站url后面部分 返回值：String",
		"获取网站服务url后面部分 方法：String getAfterServiceUrl() 说明：获取网站服务url后面部分 返回值：String"
	];

	objContent.getList = ["取得List集合 方法：getList() 说明：取得List集合 返回值：ArrayList",
		"取得Map集合 方法：getMap() 说明：取得Map集合 返回值：HashMap",
		"获取Set对象 方法：getSet() 说明：获取Set对象 返回值：HashSet",
		"获取Object对象数组 方法：getObjectArray(Object... objects) 说明：获取Object对象数组 返回值：Object[]",
		"获取字符串数组 方法：getStringArray(String... strings) 说明：获取字符串数组对象 返回值：String[]"
	];
  
	objContent.assemblecontentcharsetdataMap = ["组装模板 方法：assemble(String content,String charset,Map dataMap) 说明：组装模板 返回值：String"];
	objContent.sendMail = ["发送邮件 说明：发送邮件，传递参数账号名称，账户密码，server地址，端口号，是否SSL，发件人邮箱，收件人邮箱，主题， 邮件内容html消息，邮件内容文本消息 返回值：void"];