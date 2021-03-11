package com.newtec.report.servlet;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.newtec.http.common.HTTPParam;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.router.servlet.rpc.JsonRouterServlet;

/**
 * @ClassName: reportRouterServlet
 * @Description: 空实现的路由servlet
 * @author 朱才富
 * @date 2019年9月16日 下午3:05:18
 */
@RpcClass("reportRouterServlet")
public class ReportRouterServlet extends JsonRouterServlet {
	
	private static final long serialVersionUID = -8254344750313366280L;

	/**
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
