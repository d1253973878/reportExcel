/**
 * @Title: LizardLogout
 * @Package com.newtec.filter
 * @Description: (用一句话描述该文件做什么)
 * @Author ZCF
 * @Date 2020/10/23 16:26
 * @Version V1.0
 */
package com.newtec.filter;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.newtec.http.utils.HttpUtil;
import com.newtec.params.ReportSessionParam;
import com.newtec.sso.client.extend.Logout;
import com.newtec.sso.client.utils.HttpRequestUtils;

/**
 * @Author ZCF
 * @Date 2020/10/23 16:26
 * @Description: (这里用一句话描述这个类的作用)
 */
public class ReportLogout extends Logout {

	@SuppressWarnings("unchecked")
	@Override
	public void before(Object person, HttpServletRequest req, HttpServletResponse resp) {
		// 清除cookie
		HttpUtil.setCookie(resp, ReportSessionParam.PERSON, "");
		// 清除 session
		HttpSession session = req.getSession();
		session.removeAttribute(ReportSessionParam.PERSON);
		session.removeAttribute("ssoPerson");
		// 发送退出登录请求到 Http 退出登录
		Map<String, String> http = (Map<String, String>) session.getAttribute("http");
		if(http != null) {
			String sessionId = http.get("sessionId");
			String logout = http.get("logout");
			System.out.println("发送请求Http退出登录: " + sessionId + " " + logout);
			HttpRequestUtils.sendGet(logout, null, sessionId);
		}
	}
	
    @Override
    public void after(Object person, HttpServletRequest req, HttpServletResponse resp) {
    	// 重定向回登录页面
    	try {
			ReportAuthFilter.toSSOLoginServerlet(req, resp, "");
		} catch (IOException e) {
			e.printStackTrace();
		}
    }
	
}
