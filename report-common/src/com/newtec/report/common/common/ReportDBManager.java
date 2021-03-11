package com.newtec.report.common.common;

import javax.persistence.EntityManager;

import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.rpc.db.DBManager;
import com.newtec.rpc.db.DBexecute;
import com.newtec.rpc.db.DBexecuteVoid;

/**
 * 数据库连接管理
 * @Author 朱才富
 * @Description: (这里用一句话描述这个类的作用)
 */
public class ReportDBManager {
	
	final static private String ReportConnectionId = "report";
	
	/**
	 * 方法说明：获取实体管理器
	 * @return EntityManager
	 * @throws CustomException
	 */
	static public EntityManager get() throws CustomException{
		return DBManager.get(ReportConnectionId);
	}

	/**
	 * 方法说明：获取实体管理器
	 * @param connectionId
	 * @return
	 * @throws CustomException
	 */
	static public EntityManager get(String connectionId) throws CustomException{
		if(StringUtils.isStrNull(connectionId)) throw new CustomException("", "数据库连接ID不能为空");
		EntityManager manager = DBManager.get(connectionId);
		if(manager == null) throw new CustomException("", "数据库连接ID不存在");
		return DBManager.get(connectionId);
	}
	
	static public void execute(DBexecuteVoid execute) throws CustomException{
		DBManager.execute(execute, ReportConnectionId);
	}
	
	static public <T> T execute(DBexecute<T> execute) throws CustomException {
		return DBManager.execute(execute, ReportConnectionId);
	}
	
}
