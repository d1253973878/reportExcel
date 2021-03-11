/**
 * @Title: HttpUtil.java
 * @Package com.newtec.http.utils
 * @Description: (用一句话描述该文件做什么)
 * @Author 朱才富
 * @Version V1.0
 */
package com.newtec.http.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletResponse;

import com.newtec.http.servlet.NettyServletResponse;

import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpHeaders;

/**
 * @Author 朱才富
 * @Description: (这里用一句话描述这个类的作用)
 */
public class HttpUtil {

	/**
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param resp
	 * @param person
	 */
	public static void setCookie(HttpServletResponse resp, String name, String value) {
	   String cookie = null;
	   try {
		   cookie = name + "=" + URLEncoder.encode(value, "utf-8");
	   } catch (UnsupportedEncodingException e) {
	       e.printStackTrace();
	   }
	   if(cookie != null) {
		   NettyServletResponse response = (NettyServletResponse) resp;
		   FullHttpResponse fullResponse = response.getNettyResponse();
		   HttpHeaders responseHeader = fullResponse.headers();
		   responseHeader.set(HttpHeaderNames.SET_COOKIE, cookie);
	   }
	}
	
}
