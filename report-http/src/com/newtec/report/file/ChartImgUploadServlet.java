package com.newtec.report.file;

import com.newtec.json.utils.JsonUtil;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.report.common.utils.ReportUtils;
import com.newtec.router.servlet.file.UploadFileServlet;

import java.io.File;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

/**
 * 
 * @Author 朱才富
 * @Date 2019年11月6日 下午5:34:45
 * @Description: 管理平台商品文件上传接口
 */
@RpcClass("chartImgUploadServlet")
public class ChartImgUploadServlet extends UploadFileServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected String getFilePath() {
		return ReportUtils.getRootPath() + File.separator + "chart";
	}
	
	@SuppressWarnings("unchecked")
	@Override
	protected Object uploadFinsh(HttpServletRequest req, Map<String, String> fileMap) throws CustomException {
		String filePathMapJson = fileMap.remove("filePathMap");
		Map<String, String> filePathMap = JsonUtil.jsonString2Map(filePathMapJson);
		
		// 前端传递过来的参数
		String datasJson = fileMap.get("datas");
		System.out.println("datasJson: " + datasJson);
		
//		if(StringUtils.isNull(datasJson)) throw new CustomException("", "商品信息为空");
//		WebRequest<Map<String, Object>> webRequest = new WebRequest<>();
//		Map<String, Object> data = JsonUtil.jsonString2Map(datasJson);
//		
//		webRequest.setData(data);
//		
//		// 获取登录用户的信息
//		Person person = (Person) RouterParam.getJsonSessionpersonmanager().getPerson(req);
//		webRequest.setLoginPerson(person);
//		webRequest.setOperServiceId("managerGoodsService");
//		Response response = null;
//		webRequest.setOperType(OperationType.ADD.getValue());
//		webRequest.setOperId("saveGoods");
//		response = CallProxy.callObjs(RPCParam.MANAGER_KEY, webRequest.getOperServiceId(), webRequest.getOperId(), webRequest);
//		// RPC调用失败抛出错误信息
//		if(response == null || !response.success()) {
//			System.out.println("result: " + JsonUtil.objecte2JsonString(response));
//			throw new CustomException("", response.getError());
//		}
		return null;
	}

}
