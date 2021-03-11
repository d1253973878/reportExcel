package com.newtec.params;

import java.util.Map;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.server.utils.properties.PropertiesFile;

/**
 * Lizard 登录参数管理
 * @author 朱才富
 *
 */
public class ReportSessionParam {
	
	final static public String ssoProjectPathKey = "ssoProjectPath";

	final static public String httpLoginPathKey = "httpLoginPath";
	
	final static public String loginSucessKey = "loginSucess";
	
	final static public String logoutKey = "logout";
	
	final static public String PERSON = "person";
	
	final static public String ssoProjectPath;
	
	final static public String httpLoginPath;
	
	final static public String loginSucess;
	
	final static public String logout;
	
	static{
		Map<String,String> map = null;
		try {
			map = PropertiesFile.properties2Map("report.sso");
		} catch (CustomException e) {
			e.printStackTrace();
			System.exit(-1);
		}
		ssoProjectPath = map.get(ssoProjectPathKey);
		httpLoginPath = map.get(httpLoginPathKey);
		loginSucess = map.get(loginSucessKey);
		logout = map.get(logoutKey);
	}
}
