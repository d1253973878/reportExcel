package com.newtec.filter;  
  
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.newtec.json.utils.JsonUtil;
import com.newtec.myqdp.entity.orga.Person;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.router.common.Constants;
import com.newtec.sso.entity.SSOPerson;

@RpcClass(filterMapping="/*")
public class ReportHttpAuthFilter implements Filter {

	protected String LOGOUT = "logout";
	
	protected static List<String> excludedRequests = Arrays.asList("/imitateAuthServlet");
	
	protected String PERSON_INFO_API = "http://192.168.60.104:16690/report/personInfoServlet";
	
	
	private boolean excludedRequest(HttpServletRequest req, HttpServletResponse resp, FilterChain chain) {
        String url = req.getServletPath().toLowerCase();
        if (!url.endsWith(".css") && !url.endsWith(".js") && !url.endsWith(".ico") && !url.endsWith(".jpg") && !url.endsWith(".png") && !url.endsWith(".gif") && !url.endsWith(".woff2") && !url.endsWith(".ttf") && !url.endsWith(".woff")/* && !this.isResourceRequest(req) */) {
            if (!url.endsWith("/login") && !url.endsWith("/logout")) {
                Iterator<String> var6 = excludedRequests.iterator();
                while(var6.hasNext()) {
                    String excludedRequest = (String)var6.next();
                    excludedRequest = excludedRequest.toLowerCase();
                    if (excludedRequest.contains("*")) {
                        excludedRequest = excludedRequest.replace("*", "");
                        if (url.contains(excludedRequest)) {
                            return true;
                        }
                    } else {
                        excludedRequest = excludedRequest.startsWith("/") ? excludedRequest : "/" + excludedRequest;
                        if (url.equals(excludedRequest)) {
                            return true;
                        }
                    }
                }
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
	
	@Override
	public void doFilter(ServletRequest req1, ServletResponse resp1, FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest req = (HttpServletRequest)req1;
        HttpServletResponse resp = (HttpServletResponse)resp1;
        HttpSession session = req.getSession();
        Person person = (Person) session.getAttribute("person");
        String logout = req.getParameter(LOGOUT);
        if(LOGOUT.equals(logout)) { // 是否是退出登录的操作
        	resp.sendRedirect("/logoutServlet");
        } else if(person != null) { // 存在 session 放行
        	chain.doFilter(req1, resp1);
        } else if(excludedRequest(req, resp, chain)) {
        	chain.doFilter(req1, resp1);
        } else {
        	String paramsStr = req.getParameter(Constants.PARAMS);
    		// 如果当前 session 中没有用户的信息，并且参数中存在 token（实际上是客户端-->Html的 sessionId） 时
    		if(!StringUtils.isStrNull(paramsStr)) {
//    			Map<String, Object> parmas = JsonUtil.jsonString2Map(paramsStr);
//    			String sessionId = (String) parmas.remove("token");
//    			if(StringUtils.isStrNull(sessionId)) { // sessionId 为空，没有登录
//    				resp.sendRedirect("/nonAuthServlet");
//    			}
    			// 退出当前Http登录的请求地址
    			String logoutUrl = URLEncoder.encode(req.getRequestURL() + "?logout=logout", "UTF-8" ); 
    			// 将当前 Http 的 sessionId 也传到 Html，Html 可以通过此退出登录地址和 sessionId 模拟当前Http的会话实现退出登录
    			String requestParam = "?id=" + session.getId() + "&logout=" + logoutUrl; 
    			String personUrl = PERSON_INFO_API + requestParam;
    			// 这里的 sessionId 是 客户端请求 Html 的 sessionId，这样可以模拟客户端-->Html的会话，进而获取session会话中的用户信息
    			String result="{\"areaCode\":\"000000\",\"areaId\":\"1\",\"areaName\":\"中华人民共和国\",\"depCode\":\"001\",\"depId\":\"0ca53d2390da412c9bebac874ae0042c\",\"depName\":\"国家市场监督管理总局\",\"id\":\"4028814d38307fdb013830b7d3370002\",\"name\":\"系统超级用户\",\"userCode\":\"sysadmin\",\"userName\":\"sysadmin\"}\r\n" + 
    					"";
//    			result = HttpRequestUtils.sendGet(personUrl, null, sessionId); 
    			// 没有返回登录信息，则代表未登录
    			if(StringUtils.isStrNull(result)) {
    				resp.sendRedirect("/nonAuthServlet");
    			}
    			System.out.println("========person result" + result);
    			SSOPerson sPerson = JsonUtil.jsonString2Object(result, SSOPerson.class);
    			if(sPerson == null) {
    				resp.sendRedirect("/nonAuthServlet");
    			}
    			person = new Person();
    			person.setId(sPerson.getId());
    			person.setName(sPerson.getName());
    			person.setUserName(sPerson.getUserName());
    			person.setUserCode(sPerson.getUserCode());
    			person.setDepId(sPerson.getDepId());
    			person.setDepName(sPerson.getDepName());
    			person.setSex(sPerson.getSex());
    			person.setDepCode(sPerson.getDepCode());
    			person.setAreaCode(sPerson.getAreaCode());
    			person.setAreaId(sPerson.getAreaId());
    			person.setAreaName(sPerson.getAreaName());
    			session.setAttribute("person", person);
    			chain.doFilter(req1, resp1);
    		} else { 
    			resp.sendRedirect("/nonAuthServlet");
            }
        }
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void destroy() {

	}

}