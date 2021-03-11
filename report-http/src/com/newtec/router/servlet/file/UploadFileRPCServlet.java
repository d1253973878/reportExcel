package com.newtec.router.servlet.file;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;

import com.newtec.http.servlet.NettyServletRequest;
import com.newtec.http.servlet.NettyServletResponse;
import com.newtec.json.utils.JsonUtil;
import com.newtec.myqdp.entity.orga.Person;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.Responses;
import com.newtec.myqdp.servlet.meta.WebResponse;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.reflect.meta.MethodMeta;
import com.newtec.router.common.Constants;
import com.newtec.router.common.RouterParam;
import com.newtec.router.servlet.rpc.RouterServlet;
import com.newtec.rpc.call.client.CallProxy;
import com.newtec.rpc.call.client.Request;
import com.newtec.rpc.call.client.Response;
import com.newtec.rpc.core.RPCParam;
import com.newtec.rpc.core.SystemCodeManager;

import io.netty.handler.codec.http.multipart.FileUpload;

/**
 * @author 
 * @Description    Json格式请求路由 Servlet (适用于当前轻量级平台前端组件参数格式)  
 * 参数样例：params: {"url":"","operServiceId":"DrawWebService","operId":"getDraws","endRow":30,"startRow":0,"totalRow":-1,"ds":"person","operType":"fetch","clientType":"web"}
 * http://192.168.0.4:16668/st/jsonRouter/testRPCService/testRequestLoginPerson2?params={%22data%22:{%27id%27:%27ddddd%27},%22operServiceId%22:%22testRPCService%22,%22operId%22:%22testRequestLoginPerson2%22,%22endRow%22:30,%22startRow%22:0,%22totalRow%22:-1,%22ds%22:%22person%22,%22operType%22:%22fetch%22,%22clientType%22:%22web%22}   
 * @date  2018年8月30日
 * @version 1.0
 */
@RpcClass(value="reportFileUploadServlet")
public class UploadFileRPCServlet extends RouterServlet{

	private static final long serialVersionUID = -7834020057772894164L;
 
	@SuppressWarnings("unchecked")
	@Override
	protected void execute(final NettyServletRequest req, final NettyServletResponse resp)
			throws ServletException, IOException {
		
		System.out.println(">>>>>>>>>>>>>>>>>>>>>>上传文件1>>>>>>>>>>>>>>>>>>>>>>");
		final String webRequestParam = req.getParameter(Constants.PARAMS); 
		if(webRequestParam == null || "".equals(webRequestParam)) {
			printString(resp, Responses.PARAM_ERROR);
			return;
		}
		
		Map<String,Object> webRequestMap = JsonUtil.jsonString2Object(webRequestParam, Map.class);
		if(webRequestMap == null || webRequestMap.isEmpty()) {
			printString(resp, Responses.PARAM_ERROR);
			return;
		}
		
		String serviceName = (String)webRequestMap.get(Constants.OPER_SERVICE_ID);
		if(StringUtils.isNull(serviceName)){
			printString(resp, Responses.PARAM_ERROR);
			return ;
		}
		Map<String,byte[]> files = new HashMap<String, byte[]>();
		Map<String,FileUpload> fuMap = req.getNettyRequest().getFileParameters();
		Map<String,String> datas = req.getNettyRequest().getParameters();
		for(String key : fuMap.keySet()){
			FileUpload fu = fuMap.get(key);
			System.out.println("上传文件：" + fu.getFilename());
			files.put(key, fu.get());
			datas.put(key, fu.getFilename());
		}
		Object[] params = new Object[]{files,datas, req.getSession().getAttribute("person")};
		final int[] loginValidate = new int[1]; // 登录失败后记录标记到这里，下面用来判断（因为未登录的响应要自己输出）
		String methodName = (String)webRequestMap.get(Constants.OPER_ID);
		if(StringUtils.isNull(methodName)){
			methodName = "upload";
		}
		
		System.out.println(">>>>>>>>>>>>>>>>>>>>>>上传文件2>>>>>>>>>>>>>>>>>>>>>>");
		
		final Request rpcRequest = new Request(RPCParam.MANAGER_KEY, serviceName, methodName , params){
			private static final long serialVersionUID = 1L;
			@Override
			public <T extends MethodMeta> void findMethodFish(List<T> methods) throws CustomException {
				if(methods==null || methods.size() != 1) return;
				MethodMeta method = methods.get(0);
				Person person = null;
				if(method.isLoginValidate()){ // 需要用户登录验证
					person = (Person) RouterParam.getJsonSessionpersonmanager().getPerson(req);
					if(person==null){ // 用户未登录
						loginValidate[0] = 1; // 下面跟据这个标记输出 未登录 的状态码和信息
						throw SystemCodeManager.LoginPersonNoSetException;
					}
				}
				if(method.getLoginPersonParam() != null){
					if(person==null){ //测 试用而已，要注释掉的
						person = new Person();
					}
					this.setExtValue(person);
				}
			}	
		};
		
		Response response = CallProxy.call(rpcRequest);
		if(loginValidate[0]==1){ // 利用验证登录失败的标记在这里拦截输出
			printString(resp, Responses.USER_SESSION_ERROR);
			return ;
		}
		if (!response.success()){
			printString(resp, WebResponse.toErrorJson(response.getError())); // 效率比上面的json转化快
		}else{
			printResponse(resp,response.getResult());
		}
	}


	public static void main(String[] args) {
		long t = System.currentTimeMillis();
		String s = null;
		for(int i=0;i<1;i++){
			String ss = "{'url':'','operServiceId':'DrawWebService','operId':'getDraws','endRow':30,'startRow':0,'totalRow':-1,'ds':'person','operType':'fetch','clientType':'web'}";
			System.err.println(">>>"+JsonUtil.jsonString2Object(ss,Map.class));
		}
		
		System.err.println((System.currentTimeMillis()-t)+"=s==="+s);
	}
}
