/**
 * 
 */
;(function(){
	if(Newtec.Fetch != undefined){
		alert('newtec.resultadapter.js已经被引入!');
		return ;
	}
	Newtec.Fetch=function(params){
		var ds=params['ds'];
		this.ds=Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		this.defaults = {
				
        };
		 this.totalData=[];
		 this.pageDatas=[];
		$.extend(true,this.defaults,params);
		if(this.showPagin){
			this.defaults.endRow=this.defaults.maxRow;
		}
		this.fetchParam=this.defaults['fetchParams']
	};
	Newtec.Pagin2||Newtec.Utils.addJS('newtec.pagin2.js','myqdp/js/widget/');
	Newtec.Fetch.exte(Newtec.Base,'fetch');
	Newtec.Fetch.over({
		
	});
	Newtec.Module("Fetch")
})();