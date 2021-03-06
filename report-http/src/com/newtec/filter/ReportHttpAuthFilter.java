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
        if(LOGOUT.equals(logout)) { // ??????????????????????????????
        	resp.sendRedirect("/logoutServlet");
        } else if(person != null) { // ?????? session ??????
        	chain.doFilter(req1, resp1);
        } else if(excludedRequest(req, resp, chain)) {
        	chain.doFilter(req1, resp1);
        } else {
        	String paramsStr = req.getParameter(Constants.PARAMS);
    		// ???????????? session ???????????????????????????????????????????????? token????????????????????????-->Html??? sessionId??? ???
    		if(!StringUtils.isStrNull(paramsStr)) {
//    			Map<String, Object> parmas = JsonUtil.jsonString2Map(paramsStr);
//    			String sessionId = (String) parmas.remove("token");
//    			if(StringUtils.isStrNull(sessionId)) { // sessionId ?????????????????????
//    				resp.sendRedirect("/nonAuthServlet");
//    			}
    			// ????????????Http?????????????????????
    			String logoutUrl = URLEncoder.encode(req.getRequestURL() + "?logout=logout", "UTF-8" ); 
    			// ????????? Http ??? sessionId ????????? Html???Html ???????????????????????????????????? sessionId ????????????Http???????????????????????????
    			String requestParam = "?id=" + session.getId() + "&logout=" + logoutUrl; 
    			String personUrl = PERSON_INFO_API + requestParam;
    			// ????????? sessionId ??? ??????????????? Html ??? sessionId??????????????????????????????-->Html????????????????????????session????????????????????????
    			String result="{\"areaCode\":\"000000\",\"areaId\":\"1\",\"areaName\":\"?????????????????????\",\"depCode\":\"001\",\"depId\":\"0ca53d2390da412c9bebac874ae0042c\",\"depName\":\"??????????????????????????????\",\"id\":\"4028814d38307fdb013830b7d3370002\",\"name\":\"??????????????????\",\"userCode\":\"sysadmin\",\"userName\":\"sysadmin\"}\r\n" + 
    					"";
//    			result = HttpRequestUtils.sendGet(personUrl, null, sessionId); 
    			// ?????????????????????????????????????????????
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