package com.newtec.report.utils;

import org.apache.commons.codec.binary.Base64;
import com.newtec.myqdp.server.utils.exception.CustomException;
import java.io.UnsupportedEncodingException;

/**
 * @User zcf
 * @Create 2018/7/22 8:07
 * @Desc Base64加密工具类
 * Base64: 简单来将，Base64就是一种用64个Ascii字符来表示任意二进制数据的方法。
 * 主要用于将不可打印的字符转换成可打印字符，或者简单的说将二进制数据编码成Ascii字符。
 * Base64是网络上最常用的传输8bit字节数据的编码方式之一。
 */
public class Base64Util {

    private static final String charset = "UTF-8";

    /**
     * Base64解密
     */
    public static String decode(String data) throws CustomException {
        try {
            if (data == null) {
                return null;
            }
            return new String(Base64.decodeBase64(data.getBytes(charset)), charset);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new CustomException("", "Base64解密失败");
        }
    }
    
    public static String decode(byte[] binaryData) throws CustomException {
        try {
            return new String(Base64.decodeBase64(binaryData), charset);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new CustomException("", "Base64解密失败");
        }
    }
    
    public static byte[] decode2Byte(String data) throws CustomException {
        try {
            if (data == null) {
                return null;
            }
            return Base64.decodeBase64(data.getBytes(charset));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new CustomException("", "Base64解密失败");
        }
    }

    /**
     * Base64加密
     */
    public static String encode(String data) throws CustomException {
        try {
            if (data == null) {
                return null;
            }
            return encode(Base64.encodeBase64(data.getBytes(charset)));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new CustomException("", "Base64加密失败");
        }
    }
    
    public static String encode(byte[] binaryData) throws CustomException {
        return new String(Base64.encodeBase64(binaryData));
    }
    
}