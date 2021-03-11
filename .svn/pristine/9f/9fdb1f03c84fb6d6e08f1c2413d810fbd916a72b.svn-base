/**
 * 描述：定义最基本的三层结构：top ,content,foot
 * 页面：通用查询页面
 * @author wmk
 */
(function () {
	if(Newtec.BPMDataPage){
		console.error("newtec.compage.js已经存在");
		return ;
	}
	Newtec.SearchPage||Newtec.Utils.addJS("newtec.searchpage.js","myqdp/js/page/widget/");
    Newtec.BPMDataPage = function (params) {
    	console.info("0-----BPMDataPage--<<<",params);
//    	params.ds=params.ds||Newtec.DS.get("bpmData")
    };
    Newtec.BPMDataPage.exte(Newtec.SearchPage, 'bpmdatapage');
    Newtec.BPMDataPage.over({});
})();