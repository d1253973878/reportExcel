package com.newtec.report.start;

import com.newtec.http.start.HttpNode;
//import com.newtec.lizard.common.common.LizardGlobalParam;
import com.newtec.myqdp.server.utils.MyqdpEncryptImpl;

/**
 * @author 
 * @Description
 * @date  2018年10月26日
 * @version 1.0
 */
public class ReportServlet {

	public static void start() throws Exception {
		HttpNode.start();
//		LizardGlobalParam.initParam(null);
//		MyqdpEncryptImpl.getMyqdpServerHttpAddr();
	}
	
}