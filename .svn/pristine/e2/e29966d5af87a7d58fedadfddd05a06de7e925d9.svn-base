package com.newtec.report.cache;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.report.common.entity.MyqdpDatasource;

public class ReportCacheManager {

	//这里后续可以换成分布式缓存（只有分布式缓存才能支持RPC水平扩展）
	static private Map<Integer, MyqdpDatasource> processMap = new ConcurrentHashMap<Integer, MyqdpDatasource>();
	
	/**
	 * 方法说明：根据流程id获得数据源
	 * @param processId
	 * @return
	 * @throws CustomException
	 */
	static public MyqdpDatasource getProcess(Integer processId) {
		MyqdpDatasource process = processMap.get(processId);
		return process;
	}
	
	static public void addProcess(Integer processId, MyqdpDatasource process) {
		 processMap.put(processId,process);
	}
	
	static public void removeProcess(Integer processId) {
		 processMap.remove(processId);
	}
}
