/**   
* @Title: LizardLoginSuccess.java
* @Package com.newtec.shop.servlet 
* @Description: TODO(用一句话描述该文件做什么) 
* @author 王仕通 
* @date 2017-5-5 下午3:04:17 
* @version V1.0   
*/ 
package com.newtec.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.newtec.http.utils.HttpUtil;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.params.ReportSessionParam;
import com.newtec.sso.client.extend.LoginSucess;
import com.newtec.sso.client.utils.Utils;
import com.newtec.sso.entity.SSOPerson;

import java.io.IOException;

/**
 * @author 王仕通
 * @date 2017-5-5 下午3:04:17 
 *@Description 用一句话描述该类做什么
 */
public class ReportLoginSuccess extends LoginSucess{

	public boolean execute(Object person, HttpServletRequest req,
			HttpServletResponse resp) throws CustomException {

		com.newtec.rpc.auth.AuthManager a;

		SSOPerson sPerson= (SSOPerson) person;
		String personInfo = sPerson.getId() + "," + sPerson.getName();
		// 将用户信息写入cookie
		HttpUtil.setCookie(resp, ReportSessionParam.PERSON, personInfo);
		// 重定向回原请求页面
		try {
			resp.sendRedirect(getPath(req));
		} catch (IOException var6) {
			var6.printStackTrace();
			throw new CustomException("", var6.getMessage());
		}
		return false;
	}

	protected static String getPath(HttpServletRequest req) {
		String queryString = req.getQueryString();
		String url = req.getRequestURL().toString();
		if (queryString != null && !"".equals(queryString)) {
			queryString = Utils.removeSTParam(queryString, req.getParameter("ST123"));
			queryString = Utils.removeUserNamePassword(req, queryString);
			return "".equals(queryString) ? url : url + "?" + queryString;
		} else {
			return url + "?p=index.html";
		}
	}

}
