package com.newtec.http.core;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadPoolExecutor;

import javax.net.ssl.SSLEngine;
import javax.servlet.Filter;
import javax.servlet.ServletException;

import com.newtec.http.common.HTTPParam;
import com.newtec.http.common.HttpData;
import com.newtec.http.filter.HttpFilterConfig;
import com.newtec.http.route.HttpRouteFactory;
import com.newtec.http.service.HttpService;
import com.newtec.http.session.HttpSessionManager;
import com.newtec.http.transmit.TranAuthManager;
import com.newtec.http.utils.SslContextFactory;
import com.newtec.myqdp.print.utils.Print;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.reflect.client.ClassUtils;
import com.newtec.reflect.enums.RpcInitType;
import com.newtec.reflect.meta.ClassMeta;
import com.newtec.reflect.utils.Utils;
import com.newtec.rpc.core.RPCParam;
import com.newtec.rpc.node.NodeUtils;
import com.newtec.rpc.utils.RpcUtils;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import io.netty.handler.ssl.SslHandler;

/**
 * @author Yuexin
 * @Description  提供http支持
 * @date  2017年12月5日
 * @version 1.0
 */
public class HttpServerManager {

	static private ThreadPoolExecutor threadPoolExecutor;
	static private Map<String,List<HttpFilterConfig>> filterMap = new HashMap<String,List<HttpFilterConfig>>();
	
	static public void start() throws Exception {

//			threadPoolExecutor = RpcUtils.getThreadPoolExectutor(ParamManager.getCorePoolSize(),
//					ParamManager.getMaxiMumPoolSize());
		threadPoolExecutor = RpcUtils.getThreadPoolExectutor(HTTPParam.getCallCorePoolSize(),
				HTTPParam.getCallMaxPoolSize());
			boolean isHttpStart = HTTPParam.isHttpStart() ;
			boolean isHttpsStart = HTTPParam.isHttpSSLStart();
			if (isHttpStart)
				startHttp(false);
			if (isHttpsStart)
				startHttp(true);
//			HttpParamUtils.init();//初始化参数
			boolean staticServer =  HTTPParam.getStaticResourceType() != null;
			
			HttpRouteFactory.setRouteType(HTTPParam.getHttpRouteType());
			initService();
			
			startSuccessLog();
			
			HttpService.start();
				
			if(!staticServer || HTTPParam.getServletMap() != null) {
				try {
					Thread.sleep(5000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				HttpSessionManager.initHttpInfo(staticServer);
				TranAuthManager.init();
			}
						
	}

	/**
	 * 方法说明:  启动Http服务
	 * @param  isSSL 是否带有SSL功能的http服务
	 * @throws CustomException 
	 */
	static private void startHttp(final boolean isSSL) throws CustomException {

		String host = RPCParam.getHost();
		if(StringUtils.isNull(host)) {
			host = NodeUtils.getLocHost();
		}
		int httpPort;

		if (isSSL) {
			httpPort = HTTPParam.getHttpSSLPort();
		} else {
			httpPort = HTTPParam.getHttpPort();
		}

		if (!NodeUtils.isPortUsable(HTTPParam.getHttpIp(),httpPort)) {
			throw new CustomException("", HttpData.HTTP_MODE + " [" + httpPort + "]已经被占用了");
		}

		EventLoopGroup bossGroup = new NioEventLoopGroup();
		EventLoopGroup workerGroup = new NioEventLoopGroup();
		try {
			ServerBootstrap b = new ServerBootstrap();
//			b.option(ChannelOption.SO_REUSEADDR,true); 
//	        b.childOption(ChannelOption.SO_KEEPALIVE, true);
//	        b.option(ChannelOption.SO_KEEPALIVE,true);
//	        b.childOption(ChannelOption.TCP_NODELAY, true);
			b.group(bossGroup, workerGroup).channel(NioServerSocketChannel.class)
					.childHandler(new ChannelInitializer<SocketChannel>() {
						@Override
						public void initChannel(SocketChannel ch) throws Exception {
							// http与https的启动差别，https的ssl功能需要初始化Engine引擎和添加SSL处理器
							if (isSSL) {
								SSLEngine sslEngine = SslContextFactory.getServerContext().createSSLEngine();
								sslEngine.setUseClientMode(false);
								ch.pipeline().addLast(new SslHandler(sslEngine));
							}
							ch.pipeline().addLast(new HttpResponseEncoder());
							ch.pipeline().addLast(new HttpRequestDecoder());
							ch.pipeline().addLast("aggregator", new HttpObjectAggregator(64 * 1024 * 1024));
							ch.pipeline().addLast(new HttpServerHandler());

						}
					}).option(ChannelOption.SO_BACKLOG, 32459).childOption(ChannelOption.SO_KEEPALIVE, true)
					.childOption(ChannelOption.TCP_NODELAY, true);
			b.bind(httpPort).sync();
			if (isSSL) {
				Print.error(HttpData.HTTP_MODE + " httpSSL服务已经启动在 [" + host + ":" + httpPort + "]");
			} else {
				Print.error(HttpData.HTTP_MODE + " http服务已经启动在 [" + host + ":" + httpPort + "]");
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
			bossGroup.shutdownGracefully();
			workerGroup.shutdownGracefully();
		}finally{

		}
	}

	/** 
	 * 方法说明: 初始化服务
	 */
	static private void initService() {

		Map<String, ClassMeta> classMetas = ClassUtils.getClassMetaMap();
		if (classMetas == null)
			return;
		List<ClassMeta> metaList = new ArrayList<ClassMeta>();
		for (String metaName : classMetas.keySet()) {
			ClassMeta classMeta = classMetas.get(metaName);
			Class<?> meta = classMeta.getClazz();
			RpcClass rpcClass = meta.getAnnotation(RpcClass.class);
			//初始化filter
			try {
				if(Filter.class.isAssignableFrom(classMeta.getClazz())) {
					String[] names = rpcClass.paramNames();
					String[] values = rpcClass.paramValues();
					String mapping = rpcClass.filterMapping();
					if(mapping == null || "".equals(mapping.trim()))
						throw new CustomException("没有配置路径",metaName+"没有配置路径");
					
					HttpFilterConfig httpFilterConfig = new HttpFilterConfig(metaName);
				
					if((names == null && values != null)||(names != null && values == null)) {
						throw new CustomException("过滤器初始化失败",metaName+"参数错误");
					}
					if(names.length != values.length) {
						throw new CustomException("过滤器初始化失败",metaName+"参数错误");
					}else {
						Map<String,String> params = new HashMap<String,String>();
						for(int i = 0;i < names.length ;i ++) {
							params.put(names[i], values[i]);
							Print.debug(HttpData.HTTP_MODE + " 初始化参数："+names[i] + " 对应的值 ：" + values[i]);
						}
						httpFilterConfig.setInItParameters(params);
					}				
					List<HttpFilterConfig> filterList = filterMap.get(mapping);
					if(filterList == null) {
						filterList = new ArrayList<HttpFilterConfig>();
						filterMap.put(mapping, filterList);
					}
					Print.debug(HttpData.HTTP_MODE + " 拦截的url"+mapping + " 拦截的过滤器" + httpFilterConfig.getFilterName());
					
					Filter filter = (Filter) Utils.generatorInstance(classMeta);
					try {
						System.err.println("=="+filter.getClass().getSimpleName() + "初始化");
						filter.init(httpFilterConfig);
					} catch (ServletException e) {
						e.printStackTrace();
					}
					
					filterList.add(httpFilterConfig);
				}
			} catch (CustomException e) {
				e.printStackTrace();
			}

			if (rpcClass == null)
				continue;
			if (rpcClass.servletInit() == RpcInitType.NOINIT.getValue())
				continue;
			metaList.add(classMeta);
		}

		Collections.sort(metaList, new Comparator<ClassMeta>() {
			@Override
			public int compare(ClassMeta o1, ClassMeta o2) {
				RpcClass r1 = o1.getClazz().getAnnotation(RpcClass.class);
				RpcClass r2 = o2.getClazz().getAnnotation(RpcClass.class);
				if (r1.servletInit() > r2.servletInit()) {
					return 1;
				}
				if (r1.servletInit() < r2.servletInit()) {
					return -1;
				}
				return 0;
			}
		});

		for (ClassMeta classMeta : metaList) {
			RpcClass rpcClass = classMeta.getClazz().getAnnotation(RpcClass.class);
			String metaName = classMeta.getClazzName();
			if (!StringUtils.isNull(rpcClass.value())) {
				metaName = rpcClass.value();
			}
			Print.info(HttpData.HTTP_MODE + " 初始化serlvet :" + metaName);
			try {
				ClassUtils.callMethodObjs(metaName, "init", false,null);
			} catch (Exception e) {
				e.printStackTrace();
				Print.error(HttpData.HTTP_MODE + " 初始化serlvet失败 :" + metaName);
			}
		}
	}

	/**
	 * 方法说明: 启动日志输出 
	 */
	static private void startSuccessLog() {
		Print.warn(" ");
		Print.warn(" ");
		Print.warn(" --  --  ------  ------   -------");
		Print.warn(" --  --    --      --     -     -");
		Print.warn(" ------    --      --     -------");
		Print.warn(" --  --    --      --     --    ");
		Print.warn(" --  --    --      --     --    ");
		Print.warn(" ");
		Print.warn(" ");
	}
	
	static public void submit(Runnable runnable) {
		threadPoolExecutor.execute(runnable);
	}

	public static Map<String, List<HttpFilterConfig>> getFilterMap() {
		return filterMap;
	}

}
