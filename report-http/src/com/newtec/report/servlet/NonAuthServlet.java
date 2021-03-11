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

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.newtec.myqdp.servlet.meta.Responses;
import com.newtec.reflect.annotation.RpcClass;

/**
 * @Author 朱才富
 * @Description: (这里用一句话描述这个类的作用)
 */
@RpcClass("nonAuthServlet")
public class NonAuthServlet  extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected final void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.doPost(req, resp);
    }

	@Override
    protected final void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		PrintWriter printWriter = resp.getWriter();
        printWriter.write(Responses.USER_SESSION_ERROR);
        printWriter.flush();
    }
	
}