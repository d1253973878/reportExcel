/**
 * @Title: LizardConstant.java
 * @Package com.newtec.lizard.common.utils
 * @Description: (用一句话描述该文件做什么)
 * @Author 朱才富
 * @Date 2020年4月9日 上午9:16:58
 * @Version V1.0
 */
package com.newtec.report.common.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author 朱才富
 * @Description: 常量类
 */
public class ReportConstant {

	public static final String INFOSHAR_DATASOURCE_PREFIX = "INFOSHAR_";
	
	final static public Integer YES = 1; // 是
	
	final static public Integer NO = 0; // 否

	/**
	 * 数据库连接信息常量
	 */
	public final static class DatabaseType {

		final static public String DB_TYPE_ORACLE = "Oracle"; // 数据库类型 Oracle

		final static public String DB_TYPE_SQLSERVER = "Microsoft SQL Server(Microsoft)"; // 数据库类型 Microsoft SQL
																							// Server(Microsoft)

		final static public String DB_TYPE_MYSQL = "MySQL"; // 数据库类型 MySQL

		final static public String DB_TYPE_POSTGRESQL = "PostgreSQL"; // 数据库类型 PostgreSQL

		final static public String DB_TYPE_BIGDATA = "bigdata"; // 数据库类型 bigdata

		final static public String DB_TYPE_SYBASE = "Sybase"; // 数据库类型 Sybase jtds:sybase://

		final static public String DB_TYPE_HSQLDB = "HSQLDB"; // 数据库类型 bigdata hsqldb://

		final static public String DB_TYPE_ODBCBRIDGE = "ODBC Bridge(e.g.Access)"; // 数据库类型 ODBC Bridge(e.g.Access)
																					// odbc://

		final static public String DB_TYPE_INGRESS = "Ingress"; // 数据库类型 Ingress ingres://

		final static public String DB_TYPE_ACCESSDB = "AccessDB"; // 数据库类型 AccessDB ucanaccess://

		final static public String DB_TYPE_JTDSSQLSERVER = "Microsoft SQL Server(JTDS)"; // 数据库类型 Microsoft SQL
																							// Server(JTDS)
																							// jtds:sqlserver://

		/**
		 * 数据库类型对应的实际值（与软件保持一致的值）
		 */
		public static Map<String, String> nameMap = new HashMap<String, String>() {

			private static final long serialVersionUID = 8704849852129058742L;

			{
				put(DB_TYPE_ORACLE.toLowerCase(), DB_TYPE_ORACLE);
				put(DB_TYPE_SQLSERVER.toLowerCase(), DB_TYPE_SQLSERVER);
				put(DB_TYPE_MYSQL.toLowerCase(), DB_TYPE_MYSQL);
				put(DB_TYPE_POSTGRESQL.toLowerCase(), DB_TYPE_POSTGRESQL);
				put(DB_TYPE_BIGDATA.toLowerCase(), DB_TYPE_BIGDATA);
				put(DB_TYPE_SYBASE.toLowerCase(), DB_TYPE_SYBASE);
				put(DB_TYPE_HSQLDB.toLowerCase(), DB_TYPE_HSQLDB);
				put(DB_TYPE_ODBCBRIDGE.toLowerCase(), DB_TYPE_ODBCBRIDGE);
				put(DB_TYPE_INGRESS.toLowerCase(), DB_TYPE_INGRESS);
				put(DB_TYPE_ACCESSDB.toLowerCase(), DB_TYPE_ACCESSDB);
				put(DB_TYPE_JTDSSQLSERVER.toLowerCase(), DB_TYPE_JTDSSQLSERVER);
			}
		};

		public static String getName(String type) {
			return nameMap.get(type.toLowerCase());
		}
	}

	/**
	 * 报表类型
	 */
	public static class ReportType {

		/**
		 * 全部
		 */
		public static final int ALL = 0;

		/**
		 * 数据报表
		 */
		public static final int DATA_REPORT = 1;

		/**
		 * 打印报表
		 */
		public static final int PRINT_REPORT = 2;

		/**
		 * 图形报表
		 */
		public static final int GRAPH_REPORT = 3;

		/**
		 * 值对应的中文名称
		 */
		public static Map<Integer, String> nameMap = new HashMap<Integer, String>() {

			private static final long serialVersionUID = 8704849852129058742L;
			{
				put(ALL, "全部");
				put(DATA_REPORT, "打印报表");
				put(PRINT_REPORT, "模型自学习任务");
				put(GRAPH_REPORT, "图形报表");
			}
		};

		public static String getName(int status) {
			return nameMap.get(status);
		}

	}
	
	/**
	 * 数据源类型
	 */
	public static class DBSystemType {

		/**
		 * 全部
		 */
		public static final int ALL = 0;

		/**
		 * 用户数据源
		 */
		public static final int USER = 1;
		
		/**
		 * 系统数据源
		 */
		public static final int SYSTEM = 2;

		/**
		 * 值对应的名称
		 */
		public static Map<Integer, String> nameMap = new HashMap<Integer, String>() {

			private static final long serialVersionUID = 8704849852129058742L;
			{
				put(ALL, "全部");
				put(USER, "用户数据源");
				put(SYSTEM, "系统数据源");
			}
		};

		public static String getName(int status) {
			return nameMap.get(status);
		}

	}
	
	/**
	 * 字段类型
	 * @Author 朱才富
	 * @Description: (这里用一句话描述这个类的作用)
	 */
	public static class FieldType {

		/**
		 * 数值类型
		 */
		public static final int NUMERIC = 0;

		/**
		 * 字符类型
		 */
		public static final int CHART = 1;

		/**
		 * 日期类型
		 */
		public static final int DATE = 2;

		/**
		 * 时间类型
		 */
		public static final int DATETIME = 3;

		/**
		 * 值对应的中文名称
		 */
		public static Map<Integer, String> nameMap = new HashMap<Integer, String>() {

			private static final long serialVersionUID = 8704849852129058742L;
			{
				put(NUMERIC, "数值类型");
				put(CHART, "字符类型");
				put(DATE, "日期类型");
				put(DATETIME, "时间类型");
			}
		};

		public static String getName(int status) {
			return nameMap.get(status);
		}

	}
	
	/**
	 * 查询模式
	 * @Author 朱才富
	 */
	public static class QueryMode {

		/**
		 * 单条件查询
		 */
		public static final int SINGLE = 0;

		/**
		 * 范围查询
		 */
		public static final int RANGE = 1;

		/**
		 * 多选查询
		 */
		public static final int MULTIPLE = 2;

		/**
		 * 值对应的中文名称
		 */
		public static Map<Integer, String> nameMap = new HashMap<Integer, String>() {

			private static final long serialVersionUID = 8704849852129058742L;
			{
				put(SINGLE, "单条件查询");
				put(RANGE, "范围查询");
				put(MULTIPLE, "多选查询");
			}
		};

		public static String getName(int status) {
			return nameMap.get(status);
		}

	}
	
	/**
	 * API类型
	 * @Author 朱才富
	 * @Description: (这里用一句话描述这个类的作用)
	 */
	public static class RequestType {

		/**
		 * GET
		 */
		public static final int GET = 0;

		/**
		 * POST
		 */
		public static final int POST = 1;

		/**
		 * 值对应的中文名称
		 */
		public static Map<Integer, String> nameMap = new HashMap<Integer, String>() {

			private static final long serialVersionUID = 8704849852129058742L;
			{
				put(GET, "GET");
				put(POST, "POST");
			}
		};

		public static String getName(int status) {
			return nameMap.get(status);
		}

	}
	
}
