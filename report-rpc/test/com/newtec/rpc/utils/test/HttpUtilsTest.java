package com.newtec.rpc.utils.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import com.newtec.myqdp.server.utils.StringUtils;

/**
 * @Description
 * @date  2019年4月2日
 * @version 1.0
 */
public class HttpUtilsTest {

	/**
	 * 
	 * 方法说明:  发送Post请求
	 * @param 	url              请求的url
	 * @param 	params           传递的请求参数
	 * @return  String         	   请求结果
	 * @throws IOException 
	 */
	public static boolean sendPostRequest(String url, String params) throws IOException {
		URL object = new URL(url);
		HttpURLConnection con = (HttpURLConnection) object.openConnection();
		con.setDoOutput(true);
		con.setDoInput(true);
		con.setRequestProperty("Content-Type", "application/json");
		con.setRequestProperty("Accept", "application/json");
		con.setReadTimeout(10 * 1000);
		con.setConnectTimeout(10 * 1000);
		con.setRequestMethod("POST");
		OutputStreamWriter wr = new OutputStreamWriter(con.getOutputStream());
		wr.write(params);
		wr.flush();
		StringBuilder sb = new StringBuilder();
		int HttpResult = 0;
		try {
			HttpResult = con.getResponseCode();
		} catch (java.net.SocketTimeoutException e) {
			throw e;
		}
		if (HttpResult == HttpURLConnection.HTTP_OK) {
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
			String line = null;
			while ((line = br.readLine()) != null) {
				sb.append(line + "\n");
			}
			br.close();
			return true;
		}
		return false;
	}
	
	
	public static boolean sendGetRequest(String url,String params) throws IOException {
		if(!StringUtils.isNull(params)) {
			url = url + "?"+ params;
		}
//		long system = System.currentTimeMillis();
		URL object = new URL(url);
		HttpURLConnection con = (HttpURLConnection) object.openConnection();
		con.setRequestMethod("GET");
		con.setDoOutput(false);
		con.setDoInput(true);
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "*/*");
		con.setReadTimeout(30 * 1000);
		con.setConnectTimeout(30 * 1000);		
//		System.err.println("构造发送对象耗时:"+(System.currentTimeMillis()-system));
//		long system1 = System.currentTimeMillis();
		con.connect();
		StringBuilder sb = new StringBuilder();
		int HttpResult = 0;
		try {
			HttpResult = con.getResponseCode();
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (HttpResult == HttpURLConnection.HTTP_OK) {
//			System.err.println("响应回来时间:"+(System.currentTimeMillis()-system1));
			long system2 = System.currentTimeMillis();
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
			String line = null;
			while ((line = br.readLine()) != null) {
				sb.append(line + "\n");
			}
//			System.err.println("读取内容耗时:"+(System.currentTimeMillis()-system2));
			br.close();
			return true;
		}
		return false;
	}
}
