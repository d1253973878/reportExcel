package com.newtec.report.db;

import java.sql.Clob;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.report.common.dto.DBFieldMeta;
import com.newtec.report.common.entity.MyqdpDatasource;

import cn.hutool.core.util.StrUtil;

public class ReportDBUtils {
	
	private final static Integer EXAMPLE_DATA_SIZE = 30;
	
	private static final String TABLE_SCHEMA = "TABLE_SCHEM";
	
	/**
	 * 方法说明：获得表的所有字段
	 * @param connection 数据库连接
	 * @param tableName 表名称
	 * @param closeConn 获取数据后是否关闭数据库连接
	 * @return
	 * @throws CustomException
	 */
	public static List<DBFieldMeta> getFieldsFromTable(Connection connection, String schemaPattern, String tableName, boolean closeConn) throws CustomException{
		long t = System.currentTimeMillis();
		if(StringUtils.isNull(tableName)) throw new CustomException("","表名称不能为空！");
		tableName = tableName.toUpperCase();
		
		if(!StringUtils.isNull(schemaPattern)) {
			schemaPattern = schemaPattern.toUpperCase();
		}
		
		List<DBFieldMeta> list = new ArrayList<DBFieldMeta>();
		ResultSet pkSet =null;
		ResultSet fieldSet=null;
		try {
			DatabaseMetaData result = connection.getMetaData();
			pkSet=result.getPrimaryKeys(null, schemaPattern, tableName);
			String pk = null;
			while(pkSet.next()){
				pk=pkSet.getString("PK_NAME");
			}
			fieldSet = result.getColumns(null, schemaPattern, tableName, null);
			while(fieldSet.next()){
				DBFieldMeta meta=new DBFieldMeta();
//			    System.out.print("列名："+resultSet.getString("COLUMN_NAME"));       //列名
//			    System.out.print("  类型名称是："+resultSet.getString("TYPE_NAME"));//类型名称
//			    System.out.print("  列大小是："+resultSet.getString("COLUMN_SIZE"));//列大小
//			    System.out.println("  注释是："+resultSet.getString("REMARKS"));//可能为null
//			    System.out.println("小数点位数："+resultSet.getString("DECIMAL_DIGITS"));//返回空时表示不是相应的数据类型,例如String类型返回null
//			    System.out.print("  default："+resultSet.getString("COLUMN_DEF"));//default值
//			    System.out.print(" 数据库名称："+resultSet.getString("TABLE_SCHEM"));//数据库名称
//			    System.out.print(" 是否允许为空："+resultSet.getString("IS_NULLABLE"));//no为不允许，yes为允许
			    String name=fieldSet.getString("COLUMN_NAME");
			    meta.setName(name.toLowerCase());
			    meta.setPk(name.equalsIgnoreCase(pk)? true : false);
			    meta.setDefaultValue(fieldSet.getString("COLUMN_DEF"));
			    meta.setRemark(fieldSet.getString("REMARKS"));
			    meta.setType(fieldSet.getString("TYPE_NAME"));
			    meta.setAbleNull("NO".equalsIgnoreCase(fieldSet.getString("IS_NULLABLE"))? false : true);
			    meta.setAccuracy(StringUtils.toInt(fieldSet.getString("DECIMAL_DIGITS"), 0));
			    meta.setLength(StringUtils.toInt(fieldSet.getString("COLUMN_SIZE"), 0));
			    list.add(meta);
			}

		} catch (SQLException e) {
			System.err.println("进入查询表字段异常。。。。。。。。。。。");
			e.printStackTrace();
			throw new CustomException("11111", e.getMessage());
		}finally{
			try { 
				if(fieldSet != null)fieldSet.close();
				if(pkSet != null) pkSet.close();
				if(connection != null && closeConn)connection.close();
			} catch (SQLException e) {
				e.printStackTrace();
				throw new CustomException("关闭错误", e.getMessage());
			}
		}
		System.err.println(list.size()+">>>.数据库结构时间：（"+(System.currentTimeMillis()-t)+"）");
		return list;
	}

    /**
	 * 方法说明：获得SQL执行结果中包含的字段
	 * 
	 * @param connection 数据库连接
	 * @param sql        SQL语句
	 * @param closeConn  获取数据后是否关闭数据库连接
	 * @return
	 * @throws CustomException
	 */
	public static List<DBFieldMeta> getFieldsBySQLResult(Connection connection, String sql, boolean closeConn)
			throws CustomException {
		long t = System.currentTimeMillis();
		if (StringUtils.isNull(sql))
			throw new CustomException("", "SQL名称不能为空！");

		// 返回结果定义
		List<DBFieldMeta> list = new ArrayList<DBFieldMeta>();
		try {
			PreparedStatement pStatement = connection.prepareStatement(sql);
			// 执行结果的集合
			ResultSet reSet = pStatement.executeQuery();
			// 通过ResultSetMetaData获取字段
			ResultSetMetaData metaData = reSet.getMetaData();
			if (metaData != null) {
				int count = metaData.getColumnCount();
				for (int i = 1; i <= count; i++) {
					DBFieldMeta dataSetEntity = new DBFieldMeta();
					// 获取字段别名
					String aliasName = metaData.getColumnLabel(i);
					// 如果没有别名
					if (StrUtil.isEmpty(aliasName)) {
						// 字段名称
						dataSetEntity.setName(metaData.getColumnName(i));
					} else {
						dataSetEntity.setName(aliasName);
					}
					// 字段长度
					dataSetEntity.setLength(metaData.getColumnDisplaySize(i));

					 //字段类型 metaData.getColumnType(i)
					 String fieldTypeName = metaData.getColumnTypeName(i);
					 dataSetEntity.setType(fieldTypeName);
					list.add(dataSetEntity);
				}
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.err.println(list.size() + ">>>.数据库结构时间：（" + (System.currentTimeMillis() - t) + "）");
		return list;
	}

    
	/**
	 * 获得表的示例数据
	 * @Author: 朱才富
	 * @param datasource
	 * @param tableName
	 * @param closeConn
	 * @return
	 * @throws CustomException
	 */
	public static List<Object[]> getTableExampleDatas(MyqdpDatasource datasource, String schemaPattern, String tableName, boolean closeConn) throws CustomException{
		if(StringUtils.isNull(tableName)) throw new CustomException("","表名称不能为空！");
		String schema = null;
		if(!StringUtils.isNull(schema))
			tableName = schema+"."+tableName;
		Connection connection = getConnection(datasource);
		List<DBFieldMeta> fields = getFieldsFromTable(connection, schemaPattern, tableName, false);
		String fieldStr = getFormatFiledString(fields);
		String sql = getSelectSql(datasource, tableName, fieldStr);
		return getTableExampleDatas(connection, sql, fields.size(), true);
	}

	/**
	 * 查询数据库30条示例数据
	 * @Author: 朱才富
	 * @param connection 数据库连接对象
	 * @param sql 需要执行的查询数据的SQL
	 * @param columnNum 需要查询的列数
	 * @param closeConn 查询完成后是否关闭连接
	 * @return
	 * @throws CustomException
	 */
	public static List<Object[]> getTableExampleDatas(Connection connection, String sql, Integer columnNum, boolean closeConn) throws CustomException{
		List<Object[]> list = new ArrayList<Object[]>();
		System.out.println(sql);
		ResultSet result = null;
		try {
			//创建 prepareStatement 对象，用于执行 SQL
			PreparedStatement ps = connection.prepareStatement(sql);
            // 获取查询结果集
            result = ps.executeQuery();
            while(result.next()){
            	// 获取每一条数据
            	Object[] values = new Object[columnNum];
            	for(int i = 0; i < columnNum; i++) {
            		Object resultObject = result.getObject(i+1);
            		// 针对大文本类型的数据，需要进行转换，否则会出现序列化错误的问题
            		if(resultObject instanceof Clob) {
            			Clob clob = (Clob) resultObject;
                		try {
                			values[i] = clob.getSubString(1, (int) clob.length());
                		} catch (SQLException e) {
                			e.printStackTrace();
                		}
            		} else {
            			values[i] = resultObject;
            		}
            	}
                list.add(values);
            }
		} catch (SQLException e) {
			System.err.println("进入查询表数据异常。。。。。。。。。。。");
			throw new CustomException("", e.getMessage());
		}finally{
			try { 
				if(result != null) result.close();
				if(connection != null && closeConn)connection.close();
			} catch (SQLException e) {
				e.printStackTrace();
				throw new CustomException("关闭错误", e.getMessage());
			}
		}
		return list;
	}
	
	/**
	 * 获取所有字段名用 , 号分隔后的字符串
	 * @Author: 朱才富
	 * @param fields 数据库字段
	 * @return
	 */
	public static String getFormatFiledString(List<DBFieldMeta> fields){
		String fieldStr = "";
		int fieldNum = fields.size();
		for(int i = 0; i < fieldNum - 1; i++) {
			fieldStr += fields.get(i).getName() + ",";
		}
		fieldStr += fields.get(fieldNum - 1).getName();
		return fieldStr;
	}
	
	/** 获取所有字段名用 , 号分隔后的字符串
	 * @Author: 朱才富
	 * @param fields
	 * @return
	 * @throws CustomException 
	 */
	public static String getSelectSql(MyqdpDatasource datasource, String tableName, String fieldStr) throws CustomException{
		String sql = null;
		if(datasource.isOracle()){
			sql = "SELECT " + fieldStr + " FROM " + tableName + " WHERE ROWNUM <= " + EXAMPLE_DATA_SIZE;
		}else if(datasource.isSqlServer()){
			sql = "SELECT TOP " + EXAMPLE_DATA_SIZE + fieldStr + " FROM " + tableName;
		}else if(datasource.isMysql() || datasource.isPostGresql() || datasource.isBigData()){
			sql = "SELECT " + fieldStr + " FROM " + tableName + " LIMIT " + EXAMPLE_DATA_SIZE;
		} else{
			throw new CustomException("","数据库类型【"+datasource.getDbType()+"】暂时不支持！");
		}
		return sql;
	}
	
	/**
	 * 获取数据库连接对象
	 * @Author: 朱才富
	 * @Description: 
	 * @param datasources
	 * @return
	 * @throws CustomException
	 */
	public static Connection getConnection(MyqdpDatasource datasource) throws CustomException{
		Connection conn;
		try {
			conn = DriverManager.getConnection(datasource.getJdbcUrl(), datasource.getUserName(), datasource.getPassword());
		} catch (SQLException e) {
			e.printStackTrace();
			throw new CustomException(e);
		}
		return conn;
	}
	
	public static List<String> getTables(Connection connection, boolean closeConn) throws CustomException{
		return getTables(connection, null, closeConn);
	}
	
	public static List<String> getTables(Connection connection, String schemaPattern, boolean closeConn) throws CustomException{
		long t = System.currentTimeMillis();
		List<String> list = new ArrayList<String>();
		ResultSet tableSet = null;
		try {
			DatabaseMetaData result = connection.getMetaData();
			if(!StringUtils.isNull(schemaPattern)) {
				schemaPattern = schemaPattern.toUpperCase();
			}
			tableSet = result.getTables(null, schemaPattern, null, null);
			while(tableSet.next()){
			    String name= tableSet.getString("TABLE_NAME");
			   list.add(name);
			}
		} catch (SQLException e) {
			System.err.println("进入查询表字段异常。。。。。。。。。。。");
			e.printStackTrace();
			throw new CustomException("11111", e.getMessage());
		}finally{
			try {
				if(tableSet != null)tableSet.close();
				if(connection != null && closeConn)connection.close();
			} catch (SQLException e) {
				e.printStackTrace();
				throw new CustomException("关闭错误", e.getMessage());
			}
		}
		System.err.println(list.size()+">>>.数据库结构时间：（"+(System.currentTimeMillis()-t)+"）");
		return list;
	}
	
	/**
	 * 查询数据库所以的模式
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param connection
	 * @param closeConn
	 * @return
	 * @throws CustomException
	 */
	public static List<String> getSchemas(Connection connection, boolean closeConn) throws CustomException {
        List<String> schemaList = new ArrayList<>();
        try {
            DatabaseMetaData dbMetaData = connection.getMetaData();
            ResultSet schemaSet = dbMetaData.getSchemas();
            while (schemaSet.next()) {
                schemaList.add(schemaSet.getString(TABLE_SCHEMA));
            }
        } catch (Exception e) {
        	System.err.println("进入查询数据库模式异常。。。。。。。。。。。");
			e.printStackTrace();
			throw new CustomException("11111", e.getMessage());
        }      
        return schemaList;
    }
	
	public static void main(String[] args) throws CustomException {
		MyqdpDatasource m = new MyqdpDatasource("xx", "oracle", "xxx", "testdb", 1521, "SPIDERFLOW", "SPIDERFLOW", "启用", "myqdp_infoshar1", "remark");
		m.setDriverClass("oracle.jdbc.driver.OracleDriver");
		m.setJdbcUrl("jdbc:oracle:thin:@192.168.0.193:1521:orcl");
		
		boolean t = m.validateConnect(false);
		System.err.println("返回值："+t);
		System.out.println(getTables(getConnection(m), "SPIDERFLOW", true));
		System.out.println(getFieldsFromTable(getConnection(m), "SPIDERFLOW", "T_LABEL", true));
//		System.out.println(getTables(getConnection(m), true));
	}
	
}
