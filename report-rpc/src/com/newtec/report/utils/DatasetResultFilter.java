/**
 * @Title: DatasetResultFilter.java
 * @Package com.newtec.report.utils
 * @Description: (用一句话描述该文件做什么)
 * @Author 朱才富
 * @Version V1.0
 */
package com.newtec.report.utils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.newtec.report.common.dto.DsQueryParamsDTO;
import com.newtec.report.common.utils.ReportConstant.FieldType;
import com.newtec.report.common.utils.ReportConstant.QueryMode;

import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;

/**
 * @Author 朱才富
 * @Description: 过滤器，用于按查询参数过滤数据集查询得到的数据
 */
public class DatasetResultFilter {
	
	/**
	 * 根据查询参数过滤数据
	 * @Author: 朱才富
	 * @param datas 数据
	 * @param queryParams 查询数据集时的过滤参数
	 * @return
	 */
	public static List<Map<String, Object>> filterData(List<Map<String, Object>> datas, List<DsQueryParamsDTO> queryParams) {
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		// 根据参数类型将值转换成对应的类，避免后面每次比较都进行转换，提高效率
		for(DsQueryParamsDTO params : queryParams) {
			String value = params.getValue() == null ? null : params.getValue().toString(); // 单值
			String min = params.getMin() == null ? null : params.getMin().toString(); // 最小值（下界）
			String max = params.getMax() == null ? null : params.getMax().toString(); // 最大值（上界）
			if(params.getType() == FieldType.NUMERIC) { // 数值类型，避免损失精度，都转成 BigDecimal
				params.setValue(NumberUtil.isNumber(value) ? NumberUtil.toBigDecimal(value) : null);
				params.setMin(NumberUtil.isNumber(min) ? NumberUtil.toBigDecimal(min) : null);
				params.setMax(NumberUtil.isNumber(max) ? NumberUtil.toBigDecimal(max) : null);
			} else { // 其他类型转成字符串
				params.setValue(value);
				params.setMin(min);
				params.setMax(max);
			}
		}
		
		for(Map<String, Object> data : datas) {
			if(filterDataRow(data, queryParams)) {
				result.add(data);
			}
		}
		return result;
	}
	
	/**
	 * 通过查询参数过滤行
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param data 行数据
	 * @param queryParams 查询数据集时的过滤参数
	 * @return false-过滤，true-不过滤
	 */
	public static boolean filterDataRow(Map<String, Object> data, List<DsQueryParamsDTO> queryParams) {
		for(DsQueryParamsDTO params : queryParams) {
			String key = params.getName();
			Object pValue = params.getValue();
			Object dValue = data.get(key);
			if(!data.containsKey(key)) continue;
			
			if(params.getType() == FieldType.NUMERIC) { // 数值类型
				String tmp = dValue == null ? null : dValue.toString();
				BigDecimal tPValue = (BigDecimal) pValue;
				BigDecimal tDValue = NumberUtil.isNumber(tmp) ? NumberUtil.toBigDecimal(tmp) : null;
				if(params.getMode() == QueryMode.SINGLE) { // 单条件查询
					// tPValue 或 tPValue一个为 null，一个不为 null，也不相等，过滤掉
					if(tPValue == null) {
						return tDValue != null;
					}
					if(tDValue == null) {
						return tPValue != null;
					}
					// 两个值不相等则过滤掉
					return NumberUtil.equals(tPValue, tDValue);
				} else if(params.getMode() == QueryMode.RANGE) { // 范围查询 (min, max]
					BigDecimal min = (BigDecimal) params.getMin();
					BigDecimal max = (BigDecimal) params.getMax();
					// 如果值为 null， 则也不在范围内
					if(tDValue == null) {
						return false;
					}
					// 若果没有下界，则判断上界
					if(min == null) {
						return max == null ? true : NumberUtil.isLessOrEqual(tDValue, max);
					}
					// 如果没有上界，则判断下界
					if(max == null) {
						return NumberUtil.isGreater(tDValue, min);
					}
					return NumberUtil.isGreater(tDValue, min) && NumberUtil.isLessOrEqual(tDValue, max);
				}
			}
			// 字符类型、日期类型、时间类型统一使用字符创进行比较
			else if(params.getType() == FieldType.CHART || params.getType() == FieldType.DATE || params.getType() == FieldType.DATETIME) { // 字符类型
				String tPValue = pValue == null ? null : pValue.toString();
				String tDValue = dValue == null ? null : dValue.toString();
				if(params.getMode() == QueryMode.SINGLE) { // 单条件查询
					if(!StrUtil.equals(tPValue, tDValue)) {
						return false;
					}
				} else if(params.getMode() == QueryMode.RANGE) { // 范围查询 (min, max]
					String min = (String) params.getMin();
					String max = (String) params.getMax();
					// System.out.println("min: " + min + " max: " + max + " value: " + tDValue);
					// 如果值为 null， 则也不在范围内
					if(tDValue == null) {
						return false;
					}
					// 若果没有下界，则判断上界
					if(min == null) {
						return max == null ? true : tDValue.compareTo(max) < 1; // tDValue <= max
					}
					// 如果没有上界，则判断下界
					if(max == null) {
						return min == null ? true : tDValue.compareTo(min) > 0; // tDValue > min
					}
					return tDValue.compareTo(max) < 1 && tDValue.compareTo(min) > 0;
				}
			}
		}
		return true;
	}
	
}
