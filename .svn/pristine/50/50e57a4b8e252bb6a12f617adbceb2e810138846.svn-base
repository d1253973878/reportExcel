package com.newtec.report.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import com.newtec.myqdp.server.utils.exception.CustomException;

/**
 * 
 * @Author 朱才富
 * @Date 2020年5月29日 下午3:06:18
 * @Description: 解压缩字符串工具类
 */
public class ZipUtil {

	/**
	 * 功能：使用gzip进行压缩，然后再用Base64进行编码
	 * 
	 * @param 待压缩字符串
	 * @return 返回压缩后字符串
	 * @throws CustomException 
	 */
	public static String gzip(String primStr) throws CustomException {
		if (primStr == null || primStr.length() == 0) {
			return primStr;
		}

		ByteArrayOutputStream out = new ByteArrayOutputStream();

		GZIPOutputStream gzip = null;
		try {
			gzip = new GZIPOutputStream(out);
			gzip.write(primStr.getBytes());

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (gzip != null) {
				try {
					gzip.close();

				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return Base64Util.encode(out.toByteArray());
	}

	/**
	 *
	 * Description:使用gzip进行解压缩 先对压缩数据进行BASE64解码。再进行Gzip解压
	 * @param compressedStr 压缩字符串
	 * @return 返回解压字符串
	 * @throws CustomException 
	 */
	public static String gunzip(String compressedStr) throws CustomException {
		if (compressedStr == null) {
			return null;
		}

		ByteArrayOutputStream out = new ByteArrayOutputStream();
		ByteArrayInputStream in = null;
		GZIPInputStream ginzip = null;
		byte[] compressed = null;
		String decompressed = null;
		try {
			compressed = Base64Util.decode2Byte(compressedStr);
			in = new ByteArrayInputStream(compressed);
			ginzip = new GZIPInputStream(in);

			byte[] buffer = new byte[1024];
			int offset = -1;
			while ((offset = ginzip.read(buffer)) != -1) {
				out.write(buffer, 0, offset);
			}
			decompressed = out.toString();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (ginzip != null) {
				try {
					ginzip.close();
				} catch (IOException e) {
				}
			}
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
				}
			}
		}

		return decompressed;
	}

	/**
	 * 使用zip进行压缩
	 *
	 * @param str 压缩前的文本
	 * @return 返回压缩后的文本
	 * @throws CustomException 
	 */
	public static final String zip(String str) throws CustomException {
		if (str == null)
			return null;
		byte[] compressed;
		ByteArrayOutputStream out = null;
		ZipOutputStream zout = null;
		String compressedStr = null;
		try {
			out = new ByteArrayOutputStream();
			zout = new ZipOutputStream(out);
			zout.putNextEntry(new ZipEntry("0"));
			zout.write(str.getBytes());
			zout.closeEntry();
			compressed = out.toByteArray();
			compressedStr = Base64Util.decode(compressed);
		} catch (IOException e) {
			compressed = null;
		} finally {
			if (zout != null) {
				try {
					zout.close();
				} catch (IOException e) {
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
				}
			}
		}
		return compressedStr;
	}

	/**
	 * 使用zip进行解压缩
	 *
	 * @param compressed 压缩后的文本
	 * @return 解压后的字符串
	 * @throws CustomException 
	 */
	public static final String unzip(String compressedStr) throws CustomException {
		if (compressedStr == null) {
			return null;
		}

		ByteArrayOutputStream out = null;
		ByteArrayInputStream in = null;
		ZipInputStream zin = null;
		String decompressed = null;
		try {
			byte[] compressed = Base64Util.decode2Byte(compressedStr);
			out = new ByteArrayOutputStream();
			in = new ByteArrayInputStream(compressed);
			zin = new ZipInputStream(in);
			zin.getNextEntry();
			byte[] buffer = new byte[1024];
			int offset = -1;
			while ((offset = zin.read(buffer)) != -1) {
				out.write(buffer, 0, offset);
			}
			decompressed = out.toString();
		} catch (IOException e) {
			decompressed = null;
		} finally {
			if (zin != null) {
				try {
					zin.close();
				} catch (IOException e) {
				}
			}
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
				}
			}
		}
		return decompressed;
	}
	
	public static void main(String[] args) throws CustomException, UnsupportedEncodingException {
		String str = gzip(URLEncoder.encode("朱才富", "UTF-8"));
		System.out.println(str);
		System.out.println(gunzip(str));
	}

}