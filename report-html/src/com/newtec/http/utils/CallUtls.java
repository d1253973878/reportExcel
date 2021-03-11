package com.newtec.http.utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.Filter;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;

import com.newtec.http.common.HTTPParam;
import com.newtec.http.common.HttpData;
import com.newtec.http.core.HttpServerManager;
import com.newtec.http.core.NettyRequest;
import com.newtec.http.filter.HttpFilterChain;
import com.newtec.http.filter.HttpFilterConfig;
import com.newtec.http.servlet.NettyServletRequest;
import com.newtec.http.servlet.NettyServletResponse;
import com.newtec.myqdp.print.utils.Print;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.reflect.client.ClassUtils;
import com.newtec.reflect.meta.ClassMeta;
import com.newtec.reflect.utils.Utils;
import com.newtec.rpc.cluster.ClusterManager;
import com.newtec.rpc.node.Node;
import com.newtec.rpc.node.ServerInfo;

import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.util.CharsetUtil;

public class CallUtls {

	/**
	 * 方法说明: 进行serlvet调用
	 * @param serlvetName  		serlvet名字
	 * @param nettyHttpRequest  封装请求参数
	 * @return String           调用结果
	 */
	static public Object doServlet(String context, NettyServletRequest nettyServletRequest,
			NettyServletResponse nettyServletResponse) {
		ClassMeta classMeta = ClassUtils.getClassMetaMap().get(context);
		try {
			Object instance = Utils.generatorInstance(classMeta);
			if (!(instance instanceof HttpServlet))
				return ("serlvet不支持http服务 " + context).getBytes(CharsetUtil.UTF_8);
			HttpServlet servlet = (HttpServlet) instance;
			servlet.service(nettyServletRequest, nettyServletResponse);//直接servlet调用，不要用反射的方式
			return nettyServletResponse.getContent();
		} catch (Throwable e) {
			//设置返回状态码和堆栈异常
			nettyServletResponse.getNettyResponse().setStatus(HttpResponseStatus.INTERNAL_SERVER_ERROR);
//			return "处理失败: " + e.getMessage();
			return getStackTrace(e).getBytes(CharsetUtil.UTF_8);
		}
	}
	
	public static String getStackTrace(Throwable throwable){
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        try{
            throwable.printStackTrace(pw);
            return sw.toString();
        } finally{
            pw.close();
        }
    }

	/**
	 * 
	 * 方法说明: 截取path内最后1个/后开始的内容 
	 * @param path
	 * @return String 
	 */
	static public String getServletName(String path) {
		String result;
		if(path.indexOf("/") == 0) {
			// 如果以/开头，则去掉/
			path = path.substring(1);
		}
		if (path.contains("?")) {
			String servletName = path.substring(0, path.indexOf("?"));
			servletName = servletName.substring(servletName.lastIndexOf("/") + 1);
			result = servletName;
		} else {
			result = path.substring(path.lastIndexOf("/") + 1);
		}
		return result;
	}

	static public String getPathServletName(String path, NettyRequest parseRequest) {
		if (path.contains("?")) {
			path = path.substring(0, path.indexOf("?"));
		}
		path = path.substring(HttpData.SERVLET_PATH.length());
		String servletName = path.substring(0, path.indexOf("/"));
		String methodName = path.substring(path.lastIndexOf("/") + 1);
		int strStartIndex = path.indexOf(servletName);
		int strEndIndex = path.indexOf(methodName);
		String serviceName = path.substring(strStartIndex, strEndIndex - 1).substring(servletName.length() + 1);
		parseRequest.getParameters().put(HttpData.OPER_SERVICE_ID,serviceName);
		parseRequest.getParameters().put(HttpData.OPER_METHOD_ID, methodName);
		return servletName;
	}


	/**
	 * 方法说明:    查找集群是否有该名字的servlet
	 * @param    servletName servlet名字
	 * @return   ServerInfo  null(没有该servlet),！null()
	 */
	static public ServerInfo isServletCall(String servletName) {
		Map<String, ClassMeta> classMetas = ClassUtils.getClassMetaMap();
		if (classMetas != null && classMetas.get(servletName) != null)
			return Node.getServerInfo();
		for (ServerInfo serverInfo : ClusterManager.getServerInfos().values()) {
			Map<String, ClassMeta> map = serverInfo.getServiceInfoMap();
			if (map == null || map.isEmpty() || map.get(servletName) == null)
				continue;
			return serverInfo;
		}
		return null;
	}

	/**
	 * 方法说明: 在静态资源服务器上判断请求是否是静态资源
	 * 非静态服务器上的所有请求认为是非静态资源请求
	 * @param path 请求路径
	 */
	static public boolean isStaticResource(NettyRequest nettyRequest) {

		Set<String> suffixs = HTTPParam.getStaticResourceType();
		if (suffixs == null/* || suffixs.isEmpty()*/)
			return false;
//		System.err.println("之前123："+nettyRequest.getRequestUrl()+"|"+nettyRequest.getPath());
		String requestUrl = nettyRequest.getRequestUrl();
//		String fileName;
		int op1 = requestUrl.indexOf('?');
		if (op1 > 0) {
			String tempPath = requestUrl.substring(0, op1);

			nettyRequest.setPath(tempPath);

//			tempPath = tempPath.substring(tempPath.lastIndexOf("/") + 1);
//			fileName = tempPath;

		} else {
			nettyRequest.setPath(requestUrl);
//			fileName = requestUrl.substring(requestUrl.lastIndexOf("/") + 1);
		}
		int op = nettyRequest.getPath().lastIndexOf('.');
//		System.err.println("之后123："+nettyRequest.getRequestUrl()+"|"+nettyRequest.getPath());
		if (op > 0) {
			String suffix = nettyRequest.getPath().substring(op);
			nettyRequest.setSuffix(suffix);
			if (suffixs.contains(suffix))
				return true;
		}
		return false;
	}

	static public boolean doFilter(String path, ServletRequest req1, ServletResponse resp1) {
		if (HttpServerManager.getFilterMap().isEmpty() || path == null || "".equals(path)) {
			return true;
		}
		List<HttpFilterConfig> filterList = new ArrayList<HttpFilterConfig>();
		Map<String, List<HttpFilterConfig>> filterMap = HttpServerManager.getFilterMap();
		// 收集相关的所有拦截器，可能多个，但是目前没考虑顺序
		for (String mapping : filterMap.keySet()) {
			int op = mapping.indexOf("*");
			if (op == -1) {// 全匹配
				if (mapping.equals(path))
					filterList.addAll(filterMap.get(mapping));
			} else {// 出现*模糊匹配
				if (mapping.equals("/*") || mapping.equals("*")) {// 所有的都要拦截
					filterList.addAll(filterMap.get(mapping));
					continue;
				} else {// 部分
					String paths[] = path.split("*");
					int maxOP = -100;
					boolean isFlag = true;
					for (String pathx : paths) {
						int pathOP = mapping.indexOf(pathx);
						if (pathOP < 0 || pathOP < maxOP) {
							isFlag = false;
							break;
						}
						maxOP = pathOP;
					}
					if (isFlag) {
						filterList.addAll(filterMap.get(mapping));
					}
				}
			}
		}
		if (!filterList.isEmpty()) {
			HttpFilterChain chain = new HttpFilterChain();
			for (HttpFilterConfig config : filterList) {
				Map<String, ClassMeta> classMetas = ClassUtils.getClassMetaMap();
				if (classMetas == null)
					return false;
				ClassMeta classMeta = classMetas.get(config.getFilterName());
				if (classMeta == null)
					return false;
				Filter filter;
				try {
					chain.setSuccess(false);
					filter = (Filter) Utils.generatorInstance(classMeta);
					//filter.init(config);
					filter.doFilter(req1, resp1, chain);
				} catch (CustomException | IOException | ServletException e) {
					e.printStackTrace();
					Print.debug(HttpData.HTTP_MODE + filterList.size() + "个拦截器【" + config.getFilterName() + "】内部异常！"
							+ e.getMessage());
					return false;
				}

				if (chain.isSuccess()) {
					Print.debug(HttpData.HTTP_MODE + filterList.size() + "个拦截器【" + config.getFilterName() + "】放行通过:"
							+ path);
					continue;
				}
				Print.debug(HttpData.HTTP_MODE + filterList.size() + "个拦截器【" + config.getFilterName() + "】拦截阻止:" + path);
				return false;
			}
		}
		return true;
	}

	static public void setServletResponseHeaders(HttpHeaders headers) {
		headers.set("Access-Control-Allow-Origin", "*");
		headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
		headers.set("Access-Control-Allow-Headers", "x-requested-with");
	}
}
