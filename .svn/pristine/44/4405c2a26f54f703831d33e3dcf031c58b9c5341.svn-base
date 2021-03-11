package com.newtec.report.utils;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.report.common.dto.DBFieldMeta;
import com.newtec.report.common.dto.DsQueryParamsDTO;
import com.newtec.report.common.entity.MyqdpDatasource;
import com.newtec.report.common.entity.sql.SQLDataset;
import com.newtec.report.common.entity.sql.SQLDatasetField;
import com.newtec.report.common.entity.sql.SQLDatasetParam;
import com.newtec.report.db.ReportDBUtils;
import com.newtec.report.service.connection.impl.ConnectionServiceImpl;
import com.newtec.report.service.sql.impl.SQLDatasetServiceImpl;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;

/**
 * SQL数据集实现工具类
 * 
 * @author hhy
 *
 */
public class SqlDatasetUtil {

	/**
	 * 根据 id 查询出 SQL 数据集对应的数据数组
	 * 
	 * @param reportDb      SQL 数据集对象
	 * @param queryParams   查询数据集时的过滤参数
	 * @param dynamicParams 查询数据集时的动态过滤参数，如name=${name}
	 * @return
	 * @throws CustomException
	 */
	public static List<Map<String, Object>> findSqlData(SQLDataset dataset, List<DsQueryParamsDTO> fieldParams,
			List<DsQueryParamsDTO> dynamicParams) throws CustomException {
		List<Map<String, Object>> datas = findSqlData(dataset, dynamicParams);
		if (fieldParams != null && fieldParams.size() > 0) {
			return DatasetResultFilter.filterData(datas, fieldParams);
		}
		return datas;
	}

	/**
	 * 根据 reportDb 信息 查询并返回 SQL 数据集对应的数据数组
	 * 
	 * @param reportDb      SQL 数据集对象信息
	 * @param dynamicParams 查询数据集时的动态过滤参数，如name=${name}
	 * @return
	 * @throws CustomException
	 */
	public static List<Map<String, Object>> findSqlData(SQLDataset dataset, List<DsQueryParamsDTO> dynamicParams)
			throws CustomException {
		return querySqlDatasetData(dataset, SQLDatasetServiceImpl.getDatasetParams(dataset.getId(), false),
				dynamicParams);
	}

	/**
	 * 查询出 SQL 数据集对应的数据数组
	 * 
	 * @param reportDb      SQL 数据集对象
	 * @param dynamicParams 查询数据集时的动态过滤参数，如name=${name}
	 * @return
	 * @throws CustomException
	 */
	public static List<Map<String, Object>> querySqlDatasetData(SQLDataset dataset, List<SQLDatasetParam> params,
			List<DsQueryParamsDTO> dynamicParams) throws CustomException {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		String sql = dataset.getDbSql();
		if (StrUtil.isEmpty(sql))
			throw new CustomException("", "数据异常，sql不存在");

		// 如果没有参数，直接执行 SQL 请求数据
		MyqdpDatasource myqdpDatasource = ConnectionServiceImpl.getOneConnction(dataset.getConnectionId());
		Connection conn = null;
		Statement sta = null;
		ResultSet rs = null;
		// 如果参数为空
		if (params == null || params.size() == 0) {
			try {
				// 获取Connection
				conn = ReportDBUtils.getConnection(myqdpDatasource);
				// 获取Statement
				sta = conn.createStatement();
				rs = sta.executeQuery(sql);
				// 获取元数据字段
				ResultSetMetaData md = rs.getMetaData();
				// 获取字段数量
				int columnCount = md.getColumnCount();
				while (rs.next()) {
					Map<String, Object> rowMap = new HashMap<String, Object>();
					for (int i = 1; i <= columnCount; i++) {
						if (rs.getObject(i) == null || rs.getObject(i) == " "
								|| rs.getObject(i).toString().length() == 0) {
							rowMap.put(md.getColumnName(i), " ");
						} else {
							rowMap.put(md.getColumnName(i), rs.getObject(i).toString());
						}
					}
					list.add(rowMap);
				}
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				try {
					rs.close();
					sta.close();
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}

			}
		} else {
			// 得到通过 SQL 查询出来的字段
			List<DBFieldMeta> dbFieldMetas = ReportDBUtils.getFieldsBySQLResult(
					ReportDBUtils.getConnection(myqdpDatasource),
					sql.substring(sql.indexOf("select"), sql.indexOf("where")), true);

			Map<String, DBFieldMeta> metaMap = new HashMap<String, DBFieldMeta>();
			for (DBFieldMeta dbFieldMeta : dbFieldMetas) {
				metaMap.put(dbFieldMeta.getName(), dbFieldMeta);
			}
			// 所有数字类型
			JSONArray numType = new JSONArray();
			numType.add("INT");
			numType.add("TINYINT");
			numType.add("SMALLINT");
			numType.add("MEDIUMINT");
			numType.add("BIGINT");
			numType.add("BIT");
			numType.add("DOUBLE");
			numType.add("FLOAT");
			numType.add("DECIMAL");
			numType.add("CHAR");
			Map<String, String> valueMap = new HashMap<String, String>();
			// 预览页面用户设置的动态参数值
			if (dynamicParams != null) {
				for (DsQueryParamsDTO paramsDTO : dynamicParams) {
					Object value = paramsDTO.getValue();
					System.out.println("value:" + value);
					valueMap.put(paramsDTO.getName(), value == null ? "" : value.toString());
				}
			}
			String paramName = null;
			String paramValue = null;
			// 动态参数列表
			// 遍历参数列表拼装SQL语句
			for (int i = 0; i < params.size(); i++) {
				paramName = params.get(i).getName();
				paramValue = params.get(i).getDefaultValue();
				DBFieldMeta meta = metaMap.get(paramName);
				if (!StrUtil.hasEmpty(paramName) && valueMap.containsKey(paramName)) {
					if (valueMap.get(paramName) != null) {
						paramValue = valueMap.get(paramName);
						System.out.println("paramValue:" + paramValue);
					}
				}
				for (int j = 0; j < numType.size(); j++) {
					if (meta != null && meta.getType().equals(numType.get(j).toString())) {
						sql = sql.replaceAll("\\$\\{" + paramName + "\\}", paramValue);
					} else {
						sql = sql.replaceAll("\\$\\{" + paramName + "\\}", "'" + paramValue + "'");
					}
				}
				System.out.println("sql: " + sql);
				System.out.println("sql: " + sql.substring(sql.indexOf("select"), sql.indexOf("where")));
			}
			try {
				if (paramValue == null || paramValue == "" || paramValue.length() == 0) {
					// 获取Connection
					conn = ReportDBUtils.getConnection(myqdpDatasource);
					// 获取Statement
					sta = conn.createStatement();
					rs = sta.executeQuery(sql.substring(sql.indexOf("select"), sql.indexOf("where")));
					// 获取元数据字段
					ResultSetMetaData md = rs.getMetaData();
					// 获取字段数量
					int columnCount = md.getColumnCount();
					System.out.println("columnCount: " + columnCount);
					while (rs.next()) {
						Map<String, Object> rowMap = new HashMap<String, Object>();
						for (int j = 1; j <= columnCount; j++) {
							if (rs.getObject(j) == null || rs.getObject(j) == " "
									|| rs.getObject(j).toString().length() == 0) {
								rowMap.put(md.getColumnName(j), " ");
							} else {
								rowMap.put(md.getColumnName(j), rs.getObject(j).toString());
							}
						}
						list.add(rowMap);
					}
				} else {
					// 获取Connection
					conn = ReportDBUtils.getConnection(myqdpDatasource);
					// 获取Statement
					sta = conn.createStatement();

					rs = sta.executeQuery(sql);
					// 获取元数据字段
					ResultSetMetaData md = rs.getMetaData();
					// 获取字段数量
					int columnCount = md.getColumnCount();
					System.out.println("columnCount: " + columnCount);
					while (rs.next()) {
						Map<String, Object> rowMap = new HashMap<String, Object>();
						for (int j = 1; j <= columnCount; j++) {
							if (rs.getObject(j) == null || rs.getObject(j) == " "
									|| rs.getObject(j).toString().length() == 0) {
								rowMap.put(md.getColumnName(j), " ");
							} else {
								rowMap.put(md.getColumnName(j), rs.getObject(j).toString());
							}
						}
						list.add(rowMap);
					}
				}
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				try {
					rs.close();
					sta.close();
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}

			}
		}
		return list;
	}

	/**
	 * 分析SQL数据集返回结果中的字段信息
	 * 
	 * @param reportDb      SQL 数据集对象信息
	 * @param params        SQL数据集动态参数列表
	 * @param dynamicParams 查询数据集时的动态过滤参数，如name=${name}
	 * @return
	 * @throws CustomException
	 */
	public static List<SQLDatasetField> analysisSqlDatasetField(SQLDataset dataset, List<SQLDatasetParam> params,
			List<DsQueryParamsDTO> dynamicParams) throws CustomException {
		List<Map<String, Object>> datas = querySqlDatasetData(dataset, params, dynamicParams);
		List<SQLDatasetField> fields = new ArrayList<SQLDatasetField>();
		if (datas == null || datas.size() < 1)
			throw new CustomException("-1", "数据集请求返回结果中 data 数组为空");
		Map<String, Object> data = datas.get(0); // 根据第一行数据解析字段信息
		Set<String> keys = data.keySet();

		int i = 0;
		for (String key : keys) {
			SQLDatasetField filed = new SQLDatasetField();
			filed.setName(key);
			// 设置排序
			filed.setOrderNum(i++);
			// 设置字段文本
			filed.setRemark(key);
			// 设置查询 默认为0
			filed.setSearchFlag(0);
			filed.setDatasetId(dataset.getId());
			fields.add(filed);
		}
		return fields;
	}
}
