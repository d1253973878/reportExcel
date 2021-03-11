package com.newtec.report.common.entity;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.common.utils.ReportConstant.DatabaseType;

@Entity
@Table(name="t_myqdp_datasource")
public class MyqdpDatasource implements Serializable{
	
	private static final long serialVersionUID = -6703828717062664144L;
	
	@Id
	@GenericGenerator(name = "hibernate-uuid", strategy = "uuid")
	@GeneratedValue(generator = "hibernate-uuid")
	private String id;

	private String name;
	
	@Column(name="db_type")
	private String dbType;
	
	@Column(name="server_name")
	private String serverName;
	
	@Column(name="db_name")
	private String dbName;
	
	private Integer port;
	
	@Column(name="jdbc_url")	
	private String jdbcUrl;
	
	@Column(name="driver_class")	
	private String driverClass;
	
	@Column(name="driver_class_jta")
	private String driverClassJta;
	
	@Column(name="user_name")
	private String userName;
	
	@Column(name="password")
	private String password;
	
	@Column(name="status")
	private String status="启用";
	
	/**
	 * 1-系统类别,  2-lizard增加的类别
	 */
	@Column(name="system_type")
	private Integer systemType = 1;
	
	@Column(name="create_time")
	private String createTime;
	
	@Column(name="last_time")
	private String lastTime;
	
	@Column(name="person_id")
	private String personId;
	
	@Column(name="person_name")
	private String personName;
	
	private String remark;
	
	/**
	 * 连接属性
	 */
	@Transient
	private Map<String,Object> connMap;
	
	public MyqdpDatasource(){}
	
	/**
	 * @param type
	 * @param driverClass
	 * @param driverClassJta
	 * @param jdbcUrl
	 * @param userName
	 * @param password
	 * @param status
	 * @throws CustomException 
	 */
	public MyqdpDatasource(String name,String dbType, String serverName,
			 String dbName,Integer port,/*String jdbcUrl,*/ String userName,
			String password, String status,String personName,String remark) throws CustomException {
		super();
		this.name =  name;
		if(StringUtils.isNull(dbType))
			throw new CustomException("","类别不能为空！");
		// dbType = dbType.toLowerCase().trim();
		this.dbType = DatabaseType.getName(dbType);
		this.serverName = serverName;
		this.dbName = dbName;
		this.port = port;
		this.createTime = StringUtils.getCurrentTime();
		this.reSetMyqdpDataSource();
		// this.driverClass = driverClass.trim();
		// this.driverClassJta = driverClassJta;
		// this.jdbcUrl = jdbcUrl.trim();
		this.userName = userName.trim();
		this.password = password.trim();
		this.status = status.trim();
		this.remark = remark;
		this.personName = personName;
		this.lastTime = this.createTime;
	}
	
	public void reSetMyqdpDataSource() throws CustomException{
		if(isOracle()){ // 默认端口1521
			this.jdbcUrl = "jdbc:oracle:thin:@"+serverName+":"+port+":"+dbName;
			this.driverClass = "oracle.jdbc.OracleDriver";
			this.driverClassJta="oracle.jdbc.xa.client.OracleXADataSource";
		}else if(isSqlServer()){ // 默认端口1433
			this.jdbcUrl="jdbc:sqlserver://"+serverName+":"+port+";databaseName="+dbName;
			this.driverClass = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
			this.driverClassJta="com.microsoft.sqlserver.jdbc.SQLServerXADataSource";
		}else if(isMysql()){ // 默认端口3306
			this.jdbcUrl="jdbc:mysql://"+serverName+":"+port+"/"+dbName;
			this.driverClass="com.mysql.jdbc.Driver";
			this.driverClassJta="com.mysql.jdbc.jdbc2.optional.MysqlXADataSource";
		}else if(isPostGresql()){ // 默认端口5432
			this.jdbcUrl = "jdbc:postgresql://"+serverName+":"+port+"/"+dbName;
			this.driverClass="org.postgresql.Driver";
			this.driverClassJta="org.postgresql.xa.PGXADataSource";
		}else if(isBigData()){ // 默认端口
			this.jdbcUrl = "jdbc:hive2://"+serverName+":"+port+"/"+dbName;
			this.driverClass="org.apache.hive.jdbc.HiveDriver";
			// this.driverClassJta="org.postgresql.xa.PGXADataSource";
		}else{
			throw new CustomException("","数据库类型【"+dbType+"】暂时不支持！");
		}
	}
	@Override
	public String toString() {
		return "id:"+id+";userName:"+userName+";password:"+password+";url:"+jdbcUrl+"driver:"+driverClass+";jta:"+driverClassJta;
	}
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the dbType
	 */
	public String getDbType() {
		return dbType;
	}
	/**
	 * @param dbType the dbType to set
	 */
	public void setDbType(String dbType) {
		this.dbType = DatabaseType.getName(dbType);
	}
	/**
	 * @return the serverName
	 */
	public String getServerName() {
		return serverName;
	}
	/**
	 * @param serverName the serverName to set
	 */
	public void setServerName(String serverName) {
		this.serverName = serverName;
	}
	/**
	 * @return the dbName
	 */
	public String getDbName() {
		return dbName;
	}
	/**
	 * @param dbName the dbName to set
	 */
	public void setDbName(String dbName) {
		this.dbName = dbName;
	}
	/**
	 * @return the port
	 */
	public Integer getPort() {
		return port;
	}
	/**
	 * @param port the port to set
	 */
	public void setPort(Integer port) {
		this.port = port;
	}
	/**
	 * @return the systemType
	 */
	public Integer getSystemType() {
		return systemType;
	}
	/**
	 * @param systemType the systemType to set
	 */
	public void setSystemType(Integer systemType) {
		this.systemType = systemType;
	}
	/**
	 * @return the createTime
	 */
	public String getCreateTime() {
		return createTime;
	}
	/**
	 * @param createTime the createTime to set
	 */
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	/**
	 * @return the lastTime
	 */
	public String getLastTime() {
		return lastTime;
	}
	/**
	 * @param lastTime the lastTime to set
	 */
	public void setLastTime(String lastTime) {
		this.lastTime = lastTime;
	}
	public String getPersonId() {
		return personId;
	}

	public void setPersonId(String personId) {
		this.personId = personId;
	}

	public String getPersonName() {
		return personName;
	}

	public void setPersonName(String personName) {
		this.personName = personName;
	}
	/**
	 * @return the remark
	 */
	public String getRemark() {
		return remark;
	}
	/**
	 * @param remark the remark to set
	 */
	public void setRemark(String remark) {
		this.remark = remark;
	}
	/**
	 * @return the driverClass
	 */
	public String getDriverClass() {
		return driverClass;
	}
	/**
	 * @param driverClass the driverClass to set
	 */
	public void setDriverClass(String driverClass) {
		this.driverClass = driverClass;
	}
	/**
	 * @return the driverClassJta
	 */
	public String getDriverClassJta() {
		return driverClassJta;
	}
	/**
	 * @param driverClassJta the driverClassJta to set
	 */
	public void setDriverClassJta(String driverClassJta) {
		this.driverClassJta = driverClassJta;
	}
	/**
	 * @return the jdbcUrl
	 */
	public String getJdbcUrl() {
		return jdbcUrl;
	}
	/**
	 * @param jdbcUrl the jdbcUrl to set
	 */
	public void setJdbcUrl(String jdbcUrl) {
		this.jdbcUrl = jdbcUrl;
	}
	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}
	/**
	 * @param userName the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}
	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}
	/**
	 * @param password the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}
	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(String status) {
		this.status = status;
	}
	
	public static void main(String[] args) throws CustomException {
		MyqdpDatasource m = new MyqdpDatasource("xx", "oracle", "xxx", "mesdb", 1521, "SPIDERFLOW", "SPIDERFLOW", "启用", "myqdp_infoshar1", "remark");
		m.setDriverClass("oracle.jdbc.driver.OracleDriver");
//		m.setJdbcUrl("jdbc:oracle:thin:@10.10.8.65:1521:mesdb");
		m.setJdbcUrl("jdbc:oracle:thin:@192.168.0.193:1521:orcl");
		
//		jdbc.driver = oracle.jdbc.driver.OracleDriver
//				jdbc.driver_jta = oracle.jdbc.xa.client.OracleXADataSource
//				jdbc.url = jdbc:oracle:thin:@10.10.8.65:1521:mesdb
		boolean t = m.validateConnect(false);
		System.err.println("返回值："+t);
	}
	
	
	public boolean validateConnect() throws CustomException{
		return validateConnect(false);
	}
	public boolean validateConnect(boolean isJTA) throws CustomException{
		return validateConnect(isJTA,-1);
	}
	public boolean validateConnect(Integer timeOut) throws CustomException{
		return validateConnect(false,timeOut);
	}
	public boolean validateConnect(boolean isJTA,Integer timeOut) throws CustomException{
		String className = isJTA ? this.driverClassJta : this.driverClass;
		Connection conn = null;
		try {
			Class.forName(className);
			if(timeOut>0){
				DriverManager.setLoginTimeout(timeOut);
			}
			conn = DriverManager.getConnection(this.jdbcUrl, this.userName, this.password);
		} catch (ClassNotFoundException e) {
			System.err.println("111111111"+e.getMessage());
			throw new CustomException("","【"+this.id+"】驱动类【"+className+"】没发现！");
		} catch (SQLException e) {
			e.printStackTrace();
			System.err.println("22222"+e.getMessage());
			throw new CustomException("","【"+this.getName()+"】连接失败，请联系管理员！");
		}/*finally{
			System.err.println("333333");
			if(conn==null )return false;
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
				throw new CustomException("","【"+this.id+"】关闭连接错误！"+e.getMessage());
			}
			System.err.println("["+this.id+"]验证通过"+(isJTA? "JTA" :" 非JTA"));
			conn = null;
			return true;
		}*/
		System.err.println("333333");
		if(conn==null )return false;
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
			throw new CustomException("","【"+this.id+"】关闭连接错误！"+e.getMessage());
		}
		System.err.println("["+this.id+"]验证通过"+(isJTA? "JTA" :" 非JTA"));
		conn = null;
		return true;
	}
	
	public boolean isOracle(){
		return DatabaseType.DB_TYPE_ORACLE.equalsIgnoreCase(getDbType());
	}
	public boolean isSqlServer(){
		return DatabaseType.DB_TYPE_SQLSERVER.equalsIgnoreCase(getDbType());
	}
	public boolean isMysql(){
		return DatabaseType.DB_TYPE_MYSQL.equalsIgnoreCase(getDbType());
	}
	public boolean isPostGresql(){
		return DatabaseType.DB_TYPE_POSTGRESQL.equalsIgnoreCase(getDbType());
	}
	public boolean isBigData(){
		return DatabaseType.DB_TYPE_BIGDATA.equalsIgnoreCase(getDbType());
	}
	public Map<String, Object> getConnMap() {
		return connMap;
	}
	public void setConnMap(Map<String, Object> connMap) {
		this.connMap = connMap;
	}
}
