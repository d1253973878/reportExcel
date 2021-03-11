/**
 * @Title: DBMetaManager.java
 * @Package com.newtec.lottery.utils.meta
 * @Description: (用一句话描述该文件做什么)
 * @Author 朱才富
 * @Version V1.0
 */
package com.newtec.report.utils.meta;

import java.util.List;

import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.report.common.dto.DBTableMeta;
import com.newtec.report.common.entity.MyqdpDatasource;
import com.newtec.report.common.entity.meta.DBFieldMeta;
import com.newtec.report.common.entity.meta.DBForeignKeyMeta;
import com.newtec.report.common.entity.meta.DBIndexMeta;

/**
 * @Author 朱才富
 * @Description: 数据库元数据管理工具
 */
public class DBMetaManager {
	
	/**
	 * 查询数据库中所有的表信息
	 * @param datasource 数据库连接
	 * @throws CustomException
	 */
	public List<DBTableMeta> getTables(MyqdpDatasource datasource) throws CustomException{
		return null;
	}
	
	/**
	 * 查询数据库表中所有的字段信息
	 * @param datasource 数据库连接
	 * @param tableName 表名称
	 * @throws CustomException
	 */
	public List<DBFieldMeta> getFieldsByTableName(MyqdpDatasource datasource, String tableName) throws CustomException{
		return null;
	}
	
	/**
	 * 根据字段名称查询数据库表中字段信息
	 * @param datasource 数据库连接
	 * @param tableName 表名称
	 * @param fieldName 字段名称
	 * @throws CustomException
	 */
	public DBFieldMeta getFieldFromMetaTable(MyqdpDatasource datasource, String tableName, String fieldName) throws CustomException {
		return null;
	}
	
	public List<DBForeignKeyMeta> getForeignKeys(MyqdpDatasource datasource, String tableName) throws CustomException {
        return null;
    }
	
	public List<DBIndexMeta> getIndexs(MyqdpDatasource datasource, String tableName) throws CustomException {
		return null;
	}
	
	public void addPrimaryKey(MyqdpDatasource datasource, String tableName, String fieldName, String schema) throws CustomException {}
	
	public void removePrimaryKey(MyqdpDatasource datasource, String tableName, String fieldName, String schema) throws CustomException {}
	
	public void addForeignKey(MyqdpDatasource datasource, String constraintName, String tableName, String schema, String fieldName, String rTableName, String rSchema, String rColumnName) throws CustomException {}
	
	public void addForeignKey(MyqdpDatasource datasource, String constraintName, String tableName, String schema, String fieldName, String rTableName, String rSchema, String rColumnName, String deleteRule) throws CustomException {}
	
	public boolean isForeignKeyExit(MyqdpDatasource datasource, String tableName, String constraintName) throws CustomException { return false;}
	
	public void addIndex(MyqdpDatasource datasource, String indexName, String tableName, String fields, String type, String schema) throws CustomException {}
	
	public void removeIndex(MyqdpDatasource datasource, String indexName) throws CustomException {}
	
	public boolean isIndexExit(MyqdpDatasource datasource, String indexName) throws CustomException { return false;}
	
	public void removeForeignKey(MyqdpDatasource datasource, String tableName, String fieldName, String schema) throws CustomException {}
	
	public void enableForeignKey(MyqdpDatasource datasource, String tableName, String constraintName, String schema) throws CustomException {}

	public void disableForeignKey(MyqdpDatasource datasource, String tableName, String constraintName, String schema) throws CustomException {}

	public DBIndexMeta getIndex(MyqdpDatasource datasource, String indexName) throws CustomException {
		return null;
	}

	public void renameIndex(MyqdpDatasource datasource, String oldName, String newName) throws CustomException {}

	public DBForeignKeyMeta getForeignKey(MyqdpDatasource datasource, String tableName, String constraintName) throws CustomException {
		return null;
	}

	public String getPrefixSchema(String schema) throws CustomException {
		return StringUtils.isStrNull(schema) ? "" : schema + ".";
	}
	
	/**
	 * 获取数据库连接ID与表名拼接的表全名
	 * @param connectionId
	 * @param tableName
	 * @return
	 * @throws CustomException
	 */
	public String getFullTableName(String connectionId, String tableName) throws CustomException {
		return connectionId + "||" + tableName;
	}

}
