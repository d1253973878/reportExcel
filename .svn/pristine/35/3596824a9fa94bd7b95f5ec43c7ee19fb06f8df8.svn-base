package com.newtec.report.common.utils;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

import com.newtec.json.utils.JsonUtil;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;

/**
 * @ClassName:SendFileUtils
 * @Description: 发送http请求，发送文件和文本信息
 * @author 张远
 * @date 2019年11月4日 下午5:42:01
 */
public class SendFileUtils {

	/**
	 * @Description 发送http请求，发送文件和文本信息
	 * @param httpUrl 访问地址
	 * @param filePathMap 发送的图片集合{key:字段名(此key用于获取返回的文件名称);value:文件路径}
	 * @param param 发送的非文件信息{key:字段名;value:值}
	 * @return status:0,发送成功;非0,调用失败; error:调用失败原因; data:执行成功返回值,是一个map格式的字符串
	 * @throws CustomException http调用失败！
	 */
	@SuppressWarnings("unchecked")
	public static Map<String,Object> httpUpload(String httpUrl,Map<String,String> filePathMap,Map<String,Object> param) throws CustomException{
		String boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"; //边界符
	    String prefix="--";//前缀 上传时需要多出两个-- 一定需要注意！！！
	    String end="\r\n";//这里也需要注意，在html协议中，用 “/r/n” 换行，而不是 “/n”。
	    DataOutputStream out = null;
	    BufferedReader reader=null;
	    try {
	        URL http=new URL(httpUrl);
	        HttpURLConnection conn= (HttpURLConnection) http.openConnection();
	        conn.setRequestMethod("POST");
	        conn.setReadTimeout(5000);
	        conn.setDoInput(true);//准许向服务器读数据
	        conn.setDoOutput(true);//准许向服务器写入数据

	        /*设置向服务器上传数据的请求方式  默认的是表单形式
	         *	通过Content-Type协议向服务器上传数据
	         *	boundary
	         */
	        String charSet = "UTF-8";
	        conn.setRequestProperty("Content-Type","multipart/form-data;boundary="+boundary);
	        conn.setRequestProperty("Charsert", charSet);

	        //创建一个输出流对象，
	        out=new DataOutputStream(conn.getOutputStream());
	        /*
	        *
	          -----------------------------WebKitFormBoundary7MA4YWxkTrZu0gW
	          Content-Disposition: form-data; name="file"; filename="D:\18fb1f51c9eb63489cce9e029154782e.jpg"
	          Content-Type: image/jpeg
	                                    //这里是空一行  需要注意
	          	<二进制文件数据未显示>
	          ---------------------------WebKitFormBoundary7MA4YWxkTrZu0gW--
	          */
	        if(!StringUtils.isNull(filePathMap)) {//写入文件
	        	for (String keyName : filePathMap.keySet()) {
	        		String filePath = filePathMap.get(keyName);
	        		File file = new File(filePath);
	        		if(!file.exists())continue;
	        		//向服务器写入数据  这里就需要完全根据以上协议格式来写，需要仔细，避免出错。
	        		out.writeBytes(prefix+boundary+end);//这是第一行  并回车换行
	        		//这是第二行，文件名和对应服务器的
	        		String keyValue="Content-Disposition: form-data; name=\""+keyName+"\"; filename=\""+file.getName()+"\""+end;
	        		out.write(keyValue.getBytes(charSet));//这是第二行
	        		out.writeBytes(end);//空一行
	        		//以下写入图片
	        		FileInputStream fileInputStream=new FileInputStream(file);
	        		byte[]buff=new byte[1024*4];//缓冲区
	        		int len;
	        		//循环读数据
	        		while((len=fileInputStream.read(buff))!=-1){
	        			out.write(buff, 0, len);
	        		}
	        		//写完数据后 回车换行
	        		out.writeBytes(end);
	        		fileInputStream.close();
				}
	        }
	        if(!StringUtils.isNull(param)) {
	        	for (String key : param.keySet()) {
	        		//向服务器写入数据  这里就需要完全根据以上协议格式来写，需要仔细，避免出错。
	        		out.writeBytes(prefix+boundary+end);//这是第一行  并回车换行
	        		String keyValue="Content-Disposition: form-data; name=\""+key+"\""+end;
	        		out.write(keyValue.getBytes(charSet));//这是第二行
	        		out.writeBytes(end);//空一行
	        		out.write((param.get(key)+"").getBytes(charSet));//内容
	        		//写完数据后 回车换行
	        		out.writeBytes(end);
				}
	        }
	        
	        out.writeBytes(prefix + boundary + prefix + end);
	        out.flush();//清空

	        //创建一个输入流对象  获取返回的信息  是否上传成功
	        reader=new BufferedReader(new InputStreamReader(conn.getInputStream(),charSet));
	        StringBuffer sb=new StringBuffer();
	        String str;
	        while((str=reader.readLine())!=null){
	            sb.append(str);
	        }
	        System.out.print("返回结果："+sb.toString());
	        return JsonUtil.jsonString2Map(sb.toString());
	    } catch (Exception e) {
	       e.printStackTrace();
	       throw new CustomException("",e.getMessage());
	    }finally {
	    	//关闭流信息
	    	if(out!=null) {
	    		try {
	    			out.close();
	    		} catch (IOException e) {
	    			e.printStackTrace();
	    		}
	    	}
	        if(reader!=null) {
	        	try {
	        		reader.close();
	        	} catch (IOException e) {
	        		e.printStackTrace();
	        	}
	        }
		}
	}
	
}
