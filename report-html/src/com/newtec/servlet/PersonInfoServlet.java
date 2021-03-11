/**
 * @Title: PersonInfoServlet.java
 * @Package com.newtec.servlet
 * @Description: (用一句话描述该文件做什么)
 * @Author 朱才富
 * @Version V1.0
 */
package com.newtec.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.map.HashedMap;

import com.newtec.json.utils.JsonUtil;
import com.newtec.myqdp.print.utils.Print;
import com.newtec.reflect.annotation.RpcClass;

/**
 * @Author 朱才富
 * @Description: (这里用一句话描述这个类的作用)
 */
@RpcClass("personInfoServlet")
public class PersonInfoServlet  extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected final void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.doPost(req, resp);
    }

	@Override
    protected final void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	
		String sessionId = req.getParameter("id"); // 客户端-->Http的 sessionId
    	String url = req.getParameter("logout"); // Http 退出登录的请求地址
		
        // 保存上诉信息到 session
		Map<String, String> targetHttp = new HashedMap();
        targetHttp.put("sessionId", sessionId);
        targetHttp.put("logout", url);
        System.out.println("targetHttp>>>>>>>>>>>>>>>>>>>>>>>: " + targetHttp);
        req.getSession().setAttribute("http", targetHttp);
        
        Print.info("获取用户信息返回结果(" + sessionId + ")：" + JsonUtil.objecte2JsonString(getPerson(req)));
		PrintWriter printWriter = resp.getWriter();
        printWriter.write(JsonUtil.objecte2JsonString(getPerson(req)));
        printWriter.flush();
    }
	
    protected Object getPerson(HttpServletRequest req) {
        return req.getSession().getAttribute("person");
    }
	
}