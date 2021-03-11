/**
 * @Title: PersonInfoServlet.java
 * @Package com.newtec.servlet
 * @Description: (用一句话描述该文件做什么)
 * @Author 朱才富
 * @Version V1.0
 */
package com.newtec.report.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.newtec.http.common.HTTPParam;
import com.newtec.json.utils.JsonUtil;
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
		setCharacter(req, resp);
		PrintWriter printWriter = resp.getWriter();
        printWriter.write(JsonUtil.objecte2JsonString(getPerson(req)));
        printWriter.flush();
    }
	
    protected Object getPerson(HttpServletRequest req) {
    	Map<String, Object> result = new HashMap<String, Object>();
    	result.put("status", 0);
    	result.put("data", req.getSession().getAttribute("person"));
        return result;
    }
    
    /**
	 * 
	 * 方法说明: 设置编码格式，支持跨域
	 * @param req
	 * @param resp
	 * @date 2019年5月9日
	 */
	static public void setCharacter(HttpServletRequest req, HttpServletResponse resp) throws UnsupportedEncodingException {		
		req.setCharacterEncoding("utf-8");
		resp.setCharacterEncoding("utf-8");
		if(req.getHeader("Origin") !=  null) {
			resp.addHeader("Access-Control-Allow-Origin",req.getHeader("Origin"));
		}else if(req.getHeader("origin") != null) {
			resp.addHeader("Access-Control-Allow-Origin",req.getHeader("origin"));
		}else {
			resp.addHeader("Access-Control-Allow-Origin",HTTPParam.getServletAllowOrigin());
		}
		resp.addHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS,DELETE");
		resp.addHeader("Access-Control-Max-Age","3600");
		resp.addHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
		resp.addHeader("Access-Control-Allow-Credentials","true");
		
	}
	
}