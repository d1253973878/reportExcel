package com.newtec.report.common.dto;
/**
 * 
 * @Description 手机验证码
 * @date:   2019年8月14日 上午9:41:47
 */
public class PhoneCode{
	
	/**
	 * 存放在session的验证码键值
	 */
	public static final String SESSION_KEY_NAME       	= "phoneCode";
	/**
	 *  手机号
	 */
	private String phone;
	/**
	 *    验证码
	 */
	private String code;
	/**
	 *    生成时间戳
	 */
	private long time;
	
	public PhoneCode() {}
	
	public PhoneCode(String phone,String code) {
		this.phone = phone;
		this.code = code;
		this.time = System.currentTimeMillis();
	}

	public boolean isExpire() {
		int timeOut = 30*60*1000;
		if((System.currentTimeMillis() - time ) > timeOut)return true;
		return false;
	}
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public long getTime() {
		return time;
	}

	public void setTime(long time) {
		this.time = time;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	
}
