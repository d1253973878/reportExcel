package com.newtec.filter;  
  
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.newtec.http.filter.HttpFilterConfig;
import com.newtec.http.utils.HttpUtil;
import com.newtec.params.ReportSessionParam;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.sso.client.servlet.AuthFilter;
import com.newtec.sso.client.utils.Utils;
import com.newtec.sso.entity.PersonClass;
import com.newtec.sso.entity.SSOPerson;

//@RpcClass(filterMapping="/*")
public class ReportAuthFilter extends AuthFilter {

	public void doFilter(ServletRequest req1, ServletResponse resp1, FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest req = (HttpServletRequest)req1;
        HttpServletResponse resp = (HttpServletResponse)resp1;
        // 判断 session 中用户信息是否存在
        Object oPerson1 = Utils.getPerson(req);
		if(oPerson1 != null) {
			PersonClass person = (PersonClass) oPerson1;
			SSOPerson sPerson= (SSOPerson) person.getPerson();
			req.getSession().setAttribute(ReportSessionParam.PERSON, sPerson);
			// 设置cookie
			String personInfo = sPerson.getId() + "," + sPerson.getName();
			HttpUtil.setCookie(resp, ReportSessionParam.PERSON, personInfo);
		}
		
		super.doFilter(req, resp, chain);
//		Object oPerson2 = Utils.getPerson(req);
//		if(oPerson1 == null && oPerson2 != null) {
//			PersonClass person = (PersonClass) oPerson2;
//			SSOPerson sPerson= (SSOPerson) person.getPerson();
//			HttpRequestUtils.sendGet(LizardSessionParam.httpLoginPath + "?" + Constants.PARAMS + "=" + JsonUtil.objecte2JsonString(sPerson), null, req.getSession().getId());
//		}
		
	}
	
    public void init(FilterConfig arg0) throws ServletException {
    	HttpFilterConfig config = (HttpFilterConfig) arg0;
    	Map<String, String> inItParameters = new HashMap<String, String>();
		inItParameters.put("ssoProjectPath", ReportSessionParam.ssoProjectPath);
    	inItParameters.put("loginSucess", ReportSessionParam.loginSucess);    	
    	inItParameters.put("logout", ReportSessionParam.logout);
		inItParameters.put("excludedRequests", "personInfoServlet");
    	config.setInItParameters(inItParameters);
        super.init(config);
    }

}