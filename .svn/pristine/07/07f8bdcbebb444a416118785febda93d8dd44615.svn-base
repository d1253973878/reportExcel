package com.newtec.report.utils.meta;

import java.util.HashMap;
import java.util.Map;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.rpc.db.DBManager;

public class DBMetaUtils {
	
	public final static String DB_TYPE_ORACLE = "Oracle"; // 数据库类型 Oracle
	
	public final static String DB_TYPE_MYSQL = "MySQL"; // 数据库类型 MySQL
	
	final static public String DB_TYPE_POSTGRESQL = "PostgreSQL"; // 数据库类型 PostgreSQL
	
	public final static String DB_TYPE_SQLSERVER = "Microsoft SQL Server(Microsoft)"; // 数据库类型 Microsoft SQL Server
	
	private static final Map<String, DBMetaManager> managers = new HashMap<String, DBMetaManager>();
	
	static {
		managers.put(DB_TYPE_ORACLE, new OracleDBMetaManager());
		managers.put(DB_TYPE_MYSQL, new MySQLDBMetaManager());
	}
	
	public static DBMetaManager getDbMetaManager(String type) throws CustomException {
		DBMetaManager manager = managers.get(type);
		if(manager == null) throw new CustomException("", "暂不支持此数据库类型（" + type + "）");
		return manager;
	}
	
	public static DBMetaManager getDbMetaManager() throws CustomException {
		return getDbMetaManager(DB_TYPE_ORACLE);
	}

	/** 
	 * @throws CustomException 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 */
	public static void main(String[] args) throws CustomException {
		
		System.out.println(DBManager.get("402880f676692473017755fdf10000"));
		
//		System.out.println(JsonUtil.objecte2JsonString(ReportDBManager.get().createNativeQuery("SELECT ID,NAME,UNION_ID,BALANCE,IS_REAL,CREATE_TIME,INCOME,EXPENDITURE,OPEN_ID,ID_CARD,PHONE_NUM,STATUS,MP_OPEN_ID,SOURCE,SEX,NICK_NAME,COUNTRY,PAY_OPEN_ID,APP_OPEN_ID,PASSWORD,STANDARD_GATE,PASSWORD_GATE,BIRTHDAY,ID_CARD_TYPE,CITY,COUPON_NUM,ACCOUNT FROM LOTTERY.T_USER WHERE ROWNUM <= 1").getResultList()));
		
		// List<DBFieldMeta> fields = getFieldsFromTable(getConnection(), "T_ORDER", true);
//		String sql = "SELECT t1.id,t1.name,t2.id,t2.type FROM LOTTERY.T_USER t1 LEFT JOIN LOTTERY.USER_LEVEL_FLOW t2 ON t1.id = t2.user_id ";
//		Object result = LotteryDBManager.get().createNativeQuery(sql).getResultList();
		
//		getFieldsByTableNameFromMetaTable("T_USER");
//		String tableName = "LOTTERY.T_ORDER";
//		String fieldName = "USER_ID";
//		LotteryDBManager.execute(new DBexecute<String>() {
//			@Override
//			public String execute(EntityManager em) throws CustomException {
//				em.createNativeQuery("ALTER TABLE " + tableName + " DROP CONSTRAINT PK_T_ORDER_ID").executeUpdate();
//				return null;
//			}
//		});
//		DBMetaManager manager = getDbMetaManager();
//		System.out.println(JsonUtil.objecte2JsonString(manager.getFieldFromMetaTable("TEST2", "WEIGHT")));
		
		
//		Map<String, String> data = new HashedMap();
//		data.put("oldName", "INDEX_TEST1_NAME");
//		data.put("name", "INDEX_TEST1_NAME1111111");
//		data.put("tableName", "TEST2");
//		data.put("constraintName", "TTTT");
//		data.put("type", "Normal");
//		data.put("fields", "NAME");
//		data = JsonUtil.jsonString2Map("{\"constraintName\":\"FK_HEIGHT_ADDRESS1111\",\"tableName\":\"TEST2\",\"columnName\":\"HEIGHT\",\"rTableName\":\"TEST1\",\"rColumnName\":\"NAME\",\"oTableName\":\"TEST2\",\"oConstraintName\":\"FK_HEIGHT_ADDRESS\"}");
		
//		WebRequest request = new WebRequest();
//		request.setData(data);
//		DsManagerWebService service = new DsManagerWebService();
//		service.updateForeignKey(request);
		
	}
	
}
