package com.newtec.report.common.common;

/**
 * @author 
 * @Description  系统返回码
 * @date  2018年7月12日
 * @version 1.0
 */
public enum ResultCodeEnum {
	
	SUCCESS("0","成功"),
	USER_ID_NULL("60015","用户id不能为空"),
	USER_NULL("60016","用户不存在"),
	AUTH_PHONE_HAS("60017","手机号已经存在"),
	PHONE_NULL("60018","手机号不能为空"),
	MONEY_ERROR("60019","操作的金额不合法(不能为空，不能小于0)"),
	ID_CARD_ERROR("60020","身份证错误"),
	ORDER_ID_NULL("60021","订单id不能为空"),
	ADVERT_ID_NULL("60022","广告id不能为空"),

	WEIXIN_ID_NULL("60023","微信id不能为空"),
	COUPONDETAIL_ID_NULL("60024","消费明细id不能为空"),
	STATUS_ERROR("60025","状态不合法"),
	PAY_MONEY_ERROR("60026","支付金额和订单金额不一致"),
	
	AUTH_PHONE_NO_HAS("60027","手机号不存在");
	
	String code;
	
	String message;
	
	ResultCodeEnum(String code,String message) {
		this.code = code;
		this.message = message;
	}
	
	public String getCode() {
		return this.code;
	}
	
	public String getMessage() {
		return this.message;
	}
}
