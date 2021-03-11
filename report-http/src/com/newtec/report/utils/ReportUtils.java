package com.newtec.report.utils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.newtec.myqdp.math.utils.MathUtls;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.server.utils.properties.PropertiesFile;

/**
 * @ClassName:LockSmithUtils
 * @Description: 公用工具类
 * @author 张远
 * @date 2019年9月6日 上午11:54:00
 */
public class ReportUtils {

	/**
	 * @Description: 生成4位验证码
	 * @return  String
	 */
	static public  String generateCode() {
		return (int)(Math.random()*9000)+1000 + "";
	}
	
	/**
	 * @Description: 生成6位验证码
	 * @return  String
	 */
	static public  String generateAuthCode() {
		return (int)(Math.random()*899999)+100000 + "";
	}
	
	/**
	 * 获取文件存放根路劲
	 * @return
	 */
	public static String getRootPath(String fileName,String key) {
		String rootPath="";
		if(StringUtils.isNull(fileName))fileName="config";
		try {
			Map<String, String> properties2Map = PropertiesFile.properties2Map(fileName);
			if(StringUtils.isNull(key)) {
				key=properties2Map.get("projectBasePath");
			}
			rootPath=properties2Map.get(key);
		} catch (CustomException e) {
			e.printStackTrace();
		}
		return rootPath;
	}
	
	public static String getRootPath(String key) {
		return getRootPath(null,key);
	}
	
	/**
	 * 将元转成分
	 * @param money 金额(元)
	 * @return
	 */
	public static int yuan2Fen(String money) {
		Double doubleMultiply = MathUtls.doubleMultiply(StringUtils.toDouble(money, 0), 100);
		return doubleMultiply.intValue();
	}
	
	/**
	 * 将分转成元
	 * @param money 金额(分)
	 * @return
	 */
	public static double fen2Yuan(String money) {
		return MathUtls.doubleDivide(money, "100");
	}
	
	/**
	 * 将Object集合转换成Map集合；map的key为Object的属性名，value为对象对应属性值
	 * @param results 需要转换成map的数据
	 * @param clazz Object字节类
	 * @return
	 * @throws CustomException 反射异常
	 */
	public static List<Map<String, Object>> objectToMap(List<?> results,Class<?> clazz) throws CustomException {
		List<Map<String, Object>> datas = new ArrayList<Map<String,Object>>();
		try {
			Field[] fields = clazz.getDeclaredFields();
			for (Object result : results) {
				Map<String, Object> data = new HashMap<String, Object>();
				for (Field field : fields) {
					field.setAccessible(true);
					String name = field.getName();
					Object value = field.get(result);
					data.put(name,value);
				}
				datas.add(data);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("",e.getMessage());
		}
		return datas;
	}
	
	/**
	 * 将Object对象转换成Map对象；map的key为Object的属性名，value为对象对应属性值
	 * @param t 需要转换成map的对象
	 * @return
	 * @throws CustomException 反射异常
	 */
	public static <T> Map<String, Object> objectToMap(T t) throws CustomException {
		Map<String, Object> data = new HashMap<String, Object>();
		if(StringUtils.isNull(t))return data;
		try {
			Field[] fields = t.getClass().getDeclaredFields();
			for (Field field : fields) {
				String name = field.getName();
				field.setAccessible(true);
				data.put(name, field.get(t));
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("",e.getMessage());
		}
		return data;
	}
	
	/**
	 * 根据map里面的值，设置Object属性值
	 * @param <T> 
	 * @param param {key:属性名;value:属性值}
	 * @param t 需要设置属性的Object对象
	 * @throws CustomException 反射异常
	 */
	public static <T> void setObjectByMap(Map<String, String> param,T t) throws CustomException{
		if(StringUtils.isNull(param)||StringUtils.isNull(t))return;
		try {
			Class<?> clazz = t.getClass();
			Field[] fields = clazz.getDeclaredFields();
			for (Field field : fields) {
				String name = field.getName();
				String value = param.get(name);
				if(StringUtils.isNull(value)==false) {
					field.setAccessible(true);
					Class<?> type = field.getType();
					if(type.getName().equals("int")||type.getName().equals(Integer.class.getName())) {
						field.set(t, StringUtils.toInt(value, 0));
					}else if(type.getName().equals("double")||type.getName().equals(Double.class.getName())) {
						field.set(t, StringUtils.toDouble(value, 0));
					}else if(type.getName().equals("float")||type.getName().equals(Float.class.getName())) {
						field.set(t, StringUtils.toFloat(value, 0));
					}else {
						field.set(t, value);
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("",e.getMessage());
		}
	}
	
}
