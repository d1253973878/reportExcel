package com.newtec.report.service;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;
import java.util.Map.Entry;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.server.utils.file.FileUtils;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.reflect.annotation.RpcMethod;

/**
 * 
 * @author wst
 *
 */
@RpcClass("uploadFileRPC")
public class UploadFileRPC {
	
	@RpcMethod(loginValidate=false)
	public void upload(Map<String, byte[]> files,Map<String, String> datas) throws CustomException {
		System.err.println("filesMap111="+files+"|"+datas);
		saveUploadFile(files,datas,null);
	}
	
	protected void saveUploadFile(Map<String, byte[]> files, Map<String, String> datas,String filePath) throws CustomException {
		if(filePath == null) {
			throw new CustomException("","请配置上传路径");
		}
		OutputStream output = null;
		BufferedOutputStream bufferedOutput = null;
		FileUtils.createDirectory(filePath);	//创建目录
		System.out.println(">>>>>>>>>>>>>>>>>>>filePath:"+filePath);
			
		for(Entry<String, byte[]> entry : files.entrySet()) {
			try {
//				System.out.println("file bytes:>>>>>>>>>"+Arrays.toString(entry.getValue()));
				
				String fileName = datas.get(entry.getKey());
				File file = new File(filePath,fileName);
				if(!file.exists()) {
					file.createNewFile();
				}
				output = new FileOutputStream(file);
				bufferedOutput = new BufferedOutputStream(output);
				bufferedOutput.write(entry.getValue());
				bufferedOutput.flush();			
				
			} catch (IOException e) {
				e.printStackTrace();
				throw new CustomException("","保存文件失败");
			}finally {
				try {
					if(bufferedOutput != null)
						bufferedOutput.close();
					if(output != null)
						output.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
		}
	}
	
}
