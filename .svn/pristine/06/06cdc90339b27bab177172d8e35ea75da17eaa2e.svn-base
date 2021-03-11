package com.newtec.report.service.report.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import javax.persistence.EntityManager;

import com.newtec.json.utils.JsonUtil;
import com.newtec.myqdp.entity.orga.Person;
import com.newtec.myqdp.server.utils.QueryResult;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.reflect.annotation.RpcParam;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.common.dto.DsQueryParamsDTO;
import com.newtec.report.common.dto.ReportDTO;
import com.newtec.report.common.entity.api.APIDataset;
import com.newtec.report.common.entity.report.Report;
import com.newtec.report.common.entity.report.ReportConfig;
import com.newtec.report.common.entity.sql.SQLDataset;
import com.newtec.report.common.utils.ReportConstant;
import com.newtec.report.service.api.impl.APIDatasetServiceImpl;
import com.newtec.report.service.report.ReportService;
import com.newtec.report.service.sql.impl.SQLDatasetServiceImpl;
import com.newtec.report.utils.ApiDatasetUtil;
import com.newtec.report.utils.SqlDatasetUtil;
import com.newtec.router.request.FetchWebRequest;
import com.newtec.rpc.db.DBManager;
import com.newtec.rpc.db.DBexecuteVoid;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.PatternPool;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;

/**
 * @author 朱才富
 */
@RpcClass("reportService")
public class ReportServiceImpl implements ReportService{
	
	/**
	 * 保存报表
	 * @Author: 朱才富
	 * @param request
	 * @throws CustomException
	 */
	@Override
	public void saveReport(@RpcParam(loginPersonParam = true) WebRequest<ReportDTO> request) throws CustomException {
		ReportDTO reportDTO = request.getData();
		Report report = reportDTO.getReport();
		String config = reportDTO.getConfig();
		if(report == null) throw new CustomException("", "报表参数不能为空");
		if(StrUtil.hasEmpty(config)) throw new CustomException("", "报表配置不能为空");
		if(StrUtil.hasEmpty(report.getName())) throw new CustomException("", "报表名称不能为空");
		if(StrUtil.hasEmpty(config)) throw new CustomException("", "报表配置不能为空");
		Person person = request.getLoginPerson();
		boolean isUpdate = report.getId() != null;
		ReportConfig oldConfig = null;
		if(isUpdate) { // 更新流程
			List<Report> reports = ReportDBManager.get()
					.createQuery("FROM Report WHERE id=? AND person_id=?", Report.class)
					.setParameter(1, report.getId())
					.setParameter(2, person.getId())
					.getResultList();
			if(reports.size() < 0) throw new CustomException("", "报表ID不存在！");
			
			report.setUpdateTime(DateUtil.date().getTime());
			List<ReportConfig> configs = ReportDBManager.get()
					.createQuery("FROM ReportConfig WHERE id=?", ReportConfig.class)
					.setParameter(1, report.getId())
					.getResultList();
			if(configs.size() > 0) {
				oldConfig = configs.get(0);
			}
		} else { // 保存流程
			report.setCreateTime(DateUtil.date().getTime());
			report.setUpdateTime(report.getCreateTime());
			report.setPersonId(person.getId());
			report.setPersonName(report.getPersonName());
			report.setTemplate(ReportConstant.NO);
			report.setType(ReportConstant.ReportType.DATA_REPORT);
		}
		
		final ReportConfig oldTmpConfig = oldConfig;
		ReportDBManager.execute(new DBexecuteVoid() {
			@Override
			public void execute(EntityManager em) throws CustomException {
				// 更新报表
				if(isUpdate) {
					em.merge(report);
					// 原报表配置存不存在，存在则更新，，不存在则保存
					if(oldTmpConfig != null) {
						if(!oldTmpConfig.getConfig().equals(config)) {
							oldTmpConfig.setConfig(config);
							em.merge(oldTmpConfig);
						}
					} else {
						em.persist(new ReportConfig(report.getId(), config));
					}
					
				} else { // 报存报表
					em.persist(report);
					ReportConfig reportConfig = new ReportConfig(report.getId(), config);
					em.persist(reportConfig);
				}
			}
		});
	}
	
	/**
	 * 创建报表
	 * @Author: 朱才富
	 * @param request
	 * @throws CustomException
	 */
	@Override
	public Report createReport(@RpcParam(loginPersonParam = true) WebRequest<String> request) throws CustomException {
		Person person = request.getLoginPerson();
		String name= request.getData();
		Report report = new Report();
		report.setName(getReportDefaultName(name, person));
		report.setCreateTime(DateUtil.date().getTime());
		report.setUpdateTime(report.getUpdateTime());
		report.setPersonId(person.getId());
		report.setPersonName(person.getName());
		report.setTemplate(ReportConstant.NO);
		report.setType(ReportConstant.ReportType.DATA_REPORT);
		ReportDBManager.execute(new DBexecuteVoid() {
			@Override
			public void execute(EntityManager em) throws CustomException {
				em.persist(report);
			}
		});
		return report;
	}
	
	/**
	 * 获取报表信息
	 * @Author: 朱才富
	 * @param request
	 *             id 报表ID
	 *             config 是否需要返回报表的JSON配置：0-否，1-是
	 * @return 
	 * @throws CustomException
	 */
	@Override
	public ReportDTO getReport(@RpcParam(loginPersonParam = true) WebRequest<Map<String, Object>> request) throws CustomException {
		
		Map<String, Object> params = request.getData();
		Long id = StringUtils.toLong(params.get("id"), -1);
		Integer needConfig = (Integer) params.get("config");
		if(id == null || id == -1) throw new CustomException("", "报表ID为空或不合法");
		Person person = request.getLoginPerson();
		Report report =getOneReport(id, person, true);
		// 是否需要返回JSON配置
		ReportConfig config = needConfig == null || needConfig == 0 ? null : getOneReportConfig(id);
		return new ReportDTO(report, config == null ? null : config.getConfig());
	}
	
	/**
	 * 获取报表配置信息
	 * @Author: 朱才富
	 * @param request id 报表ID
	 * @throws CustomException
	 */
	@Override
	public String getReportConfig(@RpcParam(loginPersonParam = true) WebRequest<Long> request) throws CustomException {
		Long id = request.getData();
		if(id == null) throw new CustomException("", "报表ID不能为空");
		Person person = request.getLoginPerson();
		getOneReport(id, person, true);
		ReportConfig config = getOneReportConfig(id);
		return config == null ? null : config.getConfig();
	}
	
	/**
	 * 删除报表
	 * @Author: 朱才富
	 * @param request id 报表ID
	 * @throws CustomException
	 */
	@Override
	public void deleteReport(@RpcParam(loginPersonParam = true) WebRequest<Long> request) throws CustomException {
		Long id = request.getData();
		if(id == null) throw new CustomException("", "报表ID不能为空");
		
		Person person = request.getLoginPerson();
		isReportExist(id, person);
		
		ReportDBManager.execute(new DBexecuteVoid() {
			@Override
			public void execute(EntityManager em) throws CustomException {
				em.createNativeQuery("DELETE FROM t_report WHERE id=" + id).executeUpdate();
				em.createNativeQuery("DELETE FROM t_report_config WHERE id=" + id).executeUpdate();
				// 删除报表API数据集
				APIDatasetServiceImpl.deleteDatasetByReportId(id);
				// 删除报表SQL数据集
				SQLDatasetServiceImpl.deleteDatasetByReportId(id);
			}
		});
	}
	
	/**
	 * 收藏/取消收藏报表
	 * @Author: 朱才富
	 * @param request 
	 *             id 报表ID
	 *             template 0-取消收藏，1-收藏
	 * @throws CustomException 执行SQL失败或参数不合法时
	 */
	@Override
	public void collectReport(@RpcParam(loginPersonParam = true) WebRequest<Map<String, Object>> request) throws CustomException {
		Map<String, Object> params = request.getData();
		Long id = StringUtils.toLong(params.get("id"), -1);
		Integer template = (Integer) params.get("template");	
		if(id == null || id == -1) throw new CustomException("", "报表ID不能为空");
		if(template == null || (template != ReportConstant.YES && template != ReportConstant.NO)) throw new CustomException("", "操作不合法");
		Person person = request.getLoginPerson();
		isReportExist(id, person);
		
		ReportDBManager.execute(new DBexecuteVoid() {
			@Override
			public void execute(EntityManager em) throws CustomException {
				em.createNativeQuery("UPDATE t_report SET template=" + template + " WHERE id=" + id).executeUpdate();
			}
		});
	}
	
	/**
	 * 复制报表
	 * @Author: 朱才富
	 * @param request id 报表ID
	 * @throws CustomException
	 */
	@Override
	public void copyReport(@RpcParam(loginPersonParam = true) WebRequest<Long> request) throws CustomException {
		Long id = request.getData();
		if(id == null) throw new CustomException("", "报表ID不能为空");
		
		Person person = request.getLoginPerson();
		Report report = getOneReport(id, person, true);
		ReportConfig oConfig = getOneReportConfig(report.getId());
		
		report.setName(getReportDefaultName(report.getName(), person));
		report.setCreateTime(DateUtil.date().getTime());
		report.setUpdateTime(report.getCreateTime());
		report.setId(null);
		report.setPersonId(person.getId());
		report.setPersonName(person.getName());
		
		ReportDBManager.execute(new DBexecuteVoid() {
			@Override
			public void execute(EntityManager em) throws CustomException {
				em.persist(report);
				if(oConfig != null) {
					em.persist(new ReportConfig(report.getId(), oConfig.getConfig()));
				}
			}
		});
	}
	
	/**
	 * 查询所有报表（不分页）
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param req
	 * @return
	 * @throws CustomException
	 */
	@Override
	public List<Report> queryAllReport(@RpcParam(loginPersonParam = true) WebRequest<Map<String, Object>> request) throws CustomException {
		// Map<String, Object> params = (Map<String, Object>) request.getData();
		return DBManager.get().createQuery("FROM Report ", Report.class).getResultList();
	}
	
	/**
	 * 查询报表（分页）
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param req
	 *            name: 报表名称
	 *            template: 模板， 0-非模板
	 * @return
	 * @throws CustomException
	 */
	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public QueryResult<Report> queryReportList(@RpcParam(loginPersonParam = true) FetchWebRequest req) throws CustomException {
		Person person = req.getLoginPerson();
		Map<String, Object> params = (Map<String, Object>) req.getData();
		final String name = (String) params.get("name");
		final Integer template = (Integer) params.get("template");
		String where= "WHERE person_id='" + person.getId() + "'";
		if(!StrUtil.hasEmpty(name)) {
			where = "WHERE name like '%" + name + "%'";
		}
		if(template != null) {
			where = "WHERE template=" + template;
		}
		
		int start = req.getStartRow();
		int end = req.getEndRow();
		EntityManager database = DBManager.get();
		Object obj = database.createNativeQuery("SELECT COUNT(id) FROM t_report " + where).getSingleResult();
		int totalRow = StringUtils.toInt(obj, 0);
		List<Report> result  = new ArrayList<Report>();
		if(totalRow > 0) {
//			where += " ORDER BY create_time DESC";
			where += " ORDER BY id ASC";
			result = database.createQuery("FROM Report " + where, 
					Report.class).setFirstResult(start).setMaxResults(end-start).getResultList();
		}
		return new QueryResult<Report>(result, totalRow);
	}
	
	/**
	 * 判断报表是否存在
	 * @param id  报表ID
	 * @param person 当前登录用户
	 * @return
	 * @throws CustomException
	 */
	public static boolean isReportExist(Long id, Person person) throws CustomException {
		getOneReport(id, person, true);
		return true;
	}
	
	/**
	 * 根据报表ID获取一个此用户有权访问的报表
	 * @param id 报表id
	 * @param person 当前登录用户
	 * @param check 是否检查报表是否存在（若true，则报表不存在，则会抛出异常）
	 * @return
	 * @throws CustomException 报表ID为空或报表不存在时
	 */
	public static Report getOneReport(Long id, Person person, boolean check) throws CustomException {
		if(StringUtils.isNull(id)) throw new CustomException("","报表ID不能为空");
		List<Report> reports = ReportDBManager.get()
				.createQuery(" FROM Report WHERE id=? AND person_id=?", Report.class)
				.setParameter(1, id)
				.setParameter(2, person.getId())
				.getResultList();
		if(reports.size() < 1) throw new CustomException("", "报表ID不存在或无权限操作");
		return reports.get(0);
	}
	
	/**
	 * 根据报表 JSON 配置
	 * @param id 报表id
	 * @return
	 * @throws CustomException 查询数据库出现异常时
	 */
	public static ReportConfig getOneReportConfig(Long id) throws CustomException {
		if(StringUtils.isNull(id)) throw new CustomException("","报表ID不能为空");
		List<ReportConfig> configs = ReportDBManager.get()
				.createQuery(" FROM ReportConfig WHERE id=?", ReportConfig.class)
				.setParameter(1, id)
				.getResultList();
		if(configs.size() < 1) return null;
		return configs.get(0);
	}
	
	/**
	 * 获取报表默认不重名的名称
	 * @param defaultName 默认名称，可以为空
	 * @return 名称
	 * @throws CustomException 查询数据库所有报表名称出现异常时
	 */
	@SuppressWarnings("unchecked")
	public String getReportDefaultName(String defaultName, Person person) throws CustomException {
		if(StrUtil.hasEmpty(defaultName)) defaultName = "报表";
		
		List<String> names = ReportDBManager.get().createNativeQuery("SELECT name FROM t_report WHERE person_id='" + person.getId() + "'").getResultList();
		Map<String, Boolean> nameMap = new HashMap<>();
		for(String name : names) {
			nameMap.put(name, true);
		}
		// 判断名称是否是：名称(1), 名称(2)，如果是，则获取名称时自动递增
		int index1 = defaultName.lastIndexOf('(');
		int index2 = defaultName.lastIndexOf(')');
		int i = 1;
		String tmp = defaultName;
		if (index1 != -1 && index2 != -1) {
			int num = StringUtils.toInt(defaultName.substring(index1 + 1, index2), -1);
			if (num != -1) {
				i = num;
				// 获取序号(如：“(1)”) 前面的部分 
				tmp = defaultName.substring(0, index1);
			}
		}
		for (; ; i++) {
			if (nameMap.get(defaultName) == null) break;
			defaultName = tmp + '(' + i + ')';
		}
		return defaultName;
	}
	
	/**
	 * 根据报表id 和 sheet表传过来的信息 查询出报表要展示的数据
	 * @author 黄腾
	 * @param request 包含报表id 和 sheet表内设置好的信息
	 * @param reportId 报表id
	 * @param sheetInfo sheet表内设置的信息
	 *           rows 对应 sheet表 每行的数据 格式如下
	 *           {
	 *             rIndex(行号为key):{
	 *               cells(单元格对象):{ 
	 *                 cIndex(列号为key):{ 
	 *                   style(单元格设置的样式属性): v( 对应sheetInfo中的styles数组对应的序号 ),         text(单元格中内容属性): v(字符串类型的内容)
	 *	           	   merge(合并单元格属性，该属性为数组，长度为2，
	 *	           	     第0个元素对应合并的行数（如 3行3列合并成1个单元格那么行数为2），
	 *                   	 第1个元素对应合并的列数（如 3行3列合并成1个单元格那么列数为2）
	 *                   ):[2,2]
	 *                 }, 
	 *                 ... 
	 *               }
	 *             },
	 *             ...
	 *           } 
	 * @return 返回 设置有查询出的数据的sheetInfo对象
	 * @throws CustomException
	 */
	@Override
	public JSONObject findReportDatasById(WebRequest<Map<String, String>> request) throws CustomException {
		
		Map<String, String> params = request.getData();
		
		Long reportId = StringUtils.toLong(params.get("id"), -1);
		if(reportId == -1) throw new CustomException("", "报表ID不合法");
		// 获取报表配置
		String sheetConfigStr = getOneReportConfig(reportId).getConfig();
		if(StrUtil.isEmpty(sheetConfigStr)) {
			return new JSONObject();
		}
		
		// 解析字段和动态参数信息
		String fieldParamsStr = params.get("fieldParams"); // 根据字段进行数据过滤的参数信息
		String dynamicParamsStr = params.get("dynamicParams"); // 动态过滤参数
		Map<String, List<DsQueryParamsDTO>> fieldParams = new HashMap<String, List<DsQueryParamsDTO>>();
		Map<String, List<DsQueryParamsDTO>> dynamicParams = new HashMap<String, List<DsQueryParamsDTO>>();
		if(!StrUtil.hasEmpty(fieldParamsStr)) {
			fieldParams = JsonUtil.jsonString2MapList(fieldParamsStr, String.class, DsQueryParamsDTO.class);
		}
		if(!StrUtil.hasEmpty(dynamicParamsStr)) {
			dynamicParams = JsonUtil.jsonString2MapList(dynamicParamsStr, String.class, DsQueryParamsDTO.class);
		}
		
		JSONObject sheetConfig = JSONUtil.parseObj(sheetConfigStr);
		JSONObject printArea = sheetConfig.getJSONObject("printArea"); // 打印区域
		JSONObject rows = sheetConfig.getJSONObject("rows"); // rows 对象
		JSONObject cols = sheetConfig.getJSONObject("cols"); // cols 对象
		
		// 根据打印区域设置显示的行列
		if(printArea != null) {
			if(printArea.containsKey("row")) {
				rows.set("len", printArea.get("row"));
			}
			if(printArea.containsKey("col")) {
				cols.set("len", printArea.get("col"));
			}
		}
		
		Set<String> datasetCodes = new HashSet<String>(); // 配置中使用到的数据集编码
		JSONObject rowColInfo = new JSONObject(); // 保存 行列信息 
		
		// 正则表达式验证单元格的值是否是数据集编码字段 ${datasetCode.fieldName}
		Pattern pattern = PatternPool.get("^(\\$\\{){1}(\\w+)(\\.){1}(\\w+)(\\}){1}$", Pattern.DOTALL);
		
		Iterator<String> rowIterator = rows.keySet().iterator();
		// 遍历每个单元格，收集包含数据集动态字段的单元格信息
		while(rowIterator.hasNext()) { // 遍历行
			
			String rowIndex = rowIterator.next(); // 行号
			if(rowIndex.equals("len")) continue;
			
			JSONObject row = rows.getJSONObject(rowIndex);
			JSONObject cells = row.getJSONObject("cells");
			Iterator<String> cellsIterator = cells.keySet().iterator();
			// 记录 列信息的数组对象
			JSONArray newColAry = new JSONArray();
			
			while(cellsIterator.hasNext()) { // 遍历列
				String colIndex = cellsIterator.next(); // 列号
				JSONObject cell = cells.getJSONObject(colIndex);
				String text = cell.getStr("text"); // 单元格的值
				
				// 记录 列信息
				JSONObject newCol = new JSONObject();
				// 记录 列号
				newCol.set("colIndex", colIndex);
				// 记录 列对应的对象
				newCol.set("col", cell);
				// 记录 行高
				if(row.containsKey("height")) {
					newCol.set("height", row.getInt("height"));
				}
				// 判判断是否是动态数据集属性
				if(ReUtil.isMatch(pattern, text)) {	
					// 动态属性的数据集编码
					String dsCode = text.substring(text.indexOf("${")+2, text.indexOf("."));
					datasetCodes.add(dsCode);
					newCol.set("isDynamic", true); // 设置 标识
					newCol.set("code", dsCode); // 设置 数据集code
					// 动态属性的数据集字段名称
					newCol.set("filed", text.substring(text.indexOf(".")+1, text.indexOf("}")));
				}else {
					newCol.set("isDynamic", false);
				}
				newColAry.add(newCol);
			}
			rowColInfo.set(rowIndex, newColAry);
		}
		
		// 判断 如果 没有数据集 则不进行查询
		if(datasetCodes.size() > 0) {
			// 数据集字符串作为条件进行查询
			String[] codes = datasetCodes.toArray(new String[datasetCodes.size()]);
			List<SQLDataset> sqlDatasets = SQLDatasetServiceImpl.queryDatasets(reportId, codes);
			List<APIDataset> apiDatasets = APIDatasetServiceImpl.queryDatasets(reportId, codes);
			if((apiDatasets == null || apiDatasets.size() == 0) && (sqlDatasets == null || sqlDatasets.size() == 0)) {
				throw new CustomException("", "未查询到报表中数据集信息！ ");
			}
			
			// 所有数据集返回的数据
			JSONObject datasetDatas = new JSONObject();
			// 查询 SQL 数据集的数据
			for (SQLDataset dataset : sqlDatasets) {
				datasetDatas.set(dataset.getCode(),
						SqlDatasetUtil.findSqlData(dataset, fieldParams.get(dataset.getCode()), dynamicParams.get(dataset.getCode())));
			}
			
			// 查询 API 数据集的数据
			for (APIDataset dataset : apiDatasets) {
				datasetDatas.set(dataset.getCode(),
						ApiDatasetUtil.getApiDatasetData(dataset, fieldParams.get(dataset.getCode()), dynamicParams.get(dataset.getCode())));		
			}
			
			// 获取 rowColInfo 中的下标并进行排序（升序）
			int rowLen = rowColInfo.keySet().size();
			String[] tRowIndexes = rowColInfo.keySet().toArray(new String[rowLen]);
			Integer[] rowIndexes = new Integer[rowLen];
			for(int i = 0; i < rowLen; i++) {
				rowIndexes[i] = Integer.parseInt(tRowIndexes[i]);
			}
			Arrays.sort(rowIndexes);
			
			// 最终的rows对象
			JSONObject lastRows = new JSONObject();
			// 记录最大行数
			int maxRow = 0;
			// 记录 原先行对应现在的行数
			JSONObject newOldRow = new JSONObject();
		
			for (int ri = 0; ri < rowLen; ri++) {
				
				String rowIndex = rowIndexes[ri].toString(); // 行号 
				// 行对象
				JSONArray nrow = rowColInfo.getJSONArray(rowIndex);
				
				// 两行中间有空行的情况
				if(ri > 0) {
					// 上一行行号
					String rowIndexPre = rowIndexes[ri - 1].toString();
					
					if(Integer.parseInt(rowIndexPre) + 1 != Integer.parseInt(rowIndex)) {
						maxRow += Integer.parseInt(rowIndex) - Integer.parseInt(rowIndexPre) - 1;
					}
				}
				
				// 设置最大行数
				if(maxRow < Integer.parseInt(rowIndex)) {
					maxRow = Integer.parseInt(rowIndex);
				}
				
				// 行对象
				JSONObject lastRow = new JSONObject();;
				// cells 对象
				JSONObject lastCells = new JSONObject();;
				
				// 循环 nrow 并判断 
				// 如果该行有动态属性 就记录该属性数据集的最大行数
				// 记录最大行数
				int maxResult = -1;
				
				for (int i = 0; i < nrow.size(); i++) {
					// 列对象
					JSONObject ncol = nrow.getJSONObject(i);
					// 列号
					String colIndex = ncol.getStr("colIndex");
					// 是否动态属性标识
					boolean isDynamic = ncol.getBool("isDynamic");
					// 源列数据对象
					JSONObject sourceCol = ncol.getJSONObject("col");
					// 数据集code
					String code = ncol.getStr("code");
					// filed 
					String filed = ncol.getStr("filed");
					// last列对象
					JSONObject lastCol = JSONUtil.parseObj(sourceCol);
					// text
					String text = sourceCol.getStr("text");

					if(isDynamic) {
						// 动态属性
						// 获取第0行的属性
						text = datasetDatas.getJSONArray(code).getJSONObject(0).getStr(filed);
					}
					
					// 进行判断 如果此列之前行存在动态属性， 则按照最大行进行设置
					// 是否存在动态属性
					boolean hasDyn = false;
					
					for (int j = 0; j < ri; j++) {
						// 行对象
						JSONArray jrow = rowColInfo.getJSONArray(rowIndexes[j].toString());
						// 查找相同的列号
						for (int k = 0; k < jrow.size(); k++) {
							// 列对象
							JSONObject jcol = jrow.getJSONObject(k);
							
							if(jcol == null) {
								continue;
							}
							
							// 列号
							String colIndexk = jcol.getStr("colIndex");
							
							if(colIndexk.equals(colIndex)) {
								// 是否动态属性标识
								boolean isDynamicj = jcol.getBool("isDynamic");
								
								if(isDynamicj) {
									hasDyn = true;
									break;
								}
							}							
						}
						
						if(hasDyn) {
							break;
						}
					}
					
					if(!hasDyn) {
						if(newOldRow.containsKey(rowIndex+"")) {
							if (newOldRow.getInt(rowIndex) >= maxRow) {
								// 存在 则获取行信息
								lastRow = lastRows.getJSONObject(""+rowIndex);
								// cells
								if (lastRow == null) {
									lastRow = new JSONObject();
									lastCells = new JSONObject();
								}else {
									lastCells = JSONUtil.parseObj(lastRow.getJSONObject("cells"));
								}
							}else if (lastRows.containsKey(maxRow+"")) {
								// 存在 则获取行信息
								lastRow = lastRows.getJSONObject(""+maxRow);
								// cells
								lastCells = JSONUtil.parseObj(lastRow.getJSONObject("cells"));
							}
						}
					}					
					
					// 设置text
					if(text != null) {
						lastCol.set("text", text);
					}
					
					lastCells.set(colIndex, lastCol);
					lastRow.set("cells", lastCells);
					
					//判断是否有行高设置
					if(ncol.containsKey("height")) {
						lastRow.set("height", ncol.getInt("height"));
					}
					
					// 判断是否已经包含 rowIndex
					if(!newOldRow.containsKey(rowIndex+"")) {
						// 记录 新旧行对应关系
						newOldRow.set(rowIndex, maxRow);
					}
					
					if(hasDyn || (Integer.parseInt(rowIndex) <= maxRow)) {
						lastRows.set(maxRow+"", lastRow);
					}
					else {
						lastRows.set(newOldRow.getStr(rowIndex), lastRow);
					}
					
					// 如果是动态属性 则继续向下 添加行
					if(isDynamic) {
						// 记录 maxResult
						if(maxResult < datasetDatas.getJSONArray(code).size()) {
							maxResult = datasetDatas.getJSONArray(code).size();
						}
						
						// 获取 当前行对应的行数
						int newrIndex = newOldRow.getInt(rowIndex);
						
						for (int j = 0; j < datasetDatas.getJSONArray(code).size(); j++) {						
							
							// 不存在 则新建行信息
							JSONObject lastRowj;
							// cells
							JSONObject lastRowjCells;
							// lastj列对象
							JSONObject lastColj = JSONUtil.parseObj(sourceCol);
							
							lastColj.set("text", datasetDatas.getJSONArray(code).getJSONObject(j).getStr(filed));
							
							// 先判断是否存在行信息
							if(lastRows.containsKey(""+(newrIndex+j))) {
								// 存在 则获取行信息
								lastRowj = lastRows.getJSONObject(""+(newrIndex+j));
								// cells
								lastRowjCells = lastRowj.getJSONObject("cells");
							}else {
								lastRowj = new JSONObject();
								lastRowjCells = new JSONObject();
							}
							
							lastRowjCells.set(colIndex, lastColj);
							lastRowj.set("cells", lastRowjCells);
							
							//判断是否有行高设置
							if(ncol.containsKey("height")) {
								lastRowj.set("height", ncol.getInt("height"));
							}
							
							// 不存在行的key 则加入
							lastRows.set(""+(newrIndex+j), lastRowj);
							
							// 记录 新旧行对应关系
							newOldRow.set((Integer.parseInt(rowIndex)+j)+"", newrIndex+j);
						}
					}
				}
				
				if(maxResult > 0) {
					// 获取 当前行对应的行数
					int newrIndex = newOldRow.getInt(rowIndex);
					// 如果  newrIndex + maxResult <= maxRow 表示不需要进行最大行的设置
					// 如果  newrIndex + maxResult > maxRow 表示需要进行设置
					if((newrIndex + maxResult) > maxRow) {
						maxRow = newrIndex + maxResult;
					}
				}else {
					// 记录 新旧行对应关系
					newOldRow.set(rowIndex, maxRow++);
				}
			}

			sheetConfig.set("rows", lastRows);
		}
		System.out.println("sheetConfig: " + sheetConfig);
		return sheetConfig;
	}
	
	public static void main(String[] args) {
		String[] ids = {"id1", "id2"};
		String where = StringUtils.Array2String(ids, "");
		System.out.println(where.substring(7, where.length()));
		
		String[] indexes = {"5", "3", "4", "2", "0", "1"};
		Arrays.sort(indexes);
		System.out.println(JsonUtil.objecte2JsonString(indexes));
	}
	
}