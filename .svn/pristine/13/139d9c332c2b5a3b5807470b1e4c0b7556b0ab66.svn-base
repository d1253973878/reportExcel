;(function(){
if(Newtec.DsWidget != undefined){
		alert('newtec.dswidget.js已经被引入!');
		return ;
	}
	Newtec.DsWidget=function(params){
		var ds = params.ds;
		this.ds=params.ds = Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		this.defaults = {
			autoFetch:false,
			datas:'',//存放本地数据
			fetchParam:'',
        };
        $.extend(true,this.defaults,params);
        this.fetchParam=this.defaults.fetchParam
	};
	Newtec.DsWidget.exte(Newtec.Base,'dswidget');
	Newtec.DsWidget.prototype.fetchData=function(params){
		if(Newtec.Utils.isNull(this.ds)) return;
		var oldCallback = params['callback'];
		var that=this;
		var fetchParam=$.extend(true,{},this.fetchParam);
		params=$.extend(true,fetchParam,params);
		params['callback']=function(response){
			if(Newtec.Utils.isFunction(oldCallback)){
				oldCallback(response);
			}
			if(response.status==0){
				that.setData(response.data);
			}else{
				console.error(response.error)
			}
		}
		this.ds.fetchData(params);
	}
	Newtec.DsWidget.prototype.addData=function(record,operId,callback){
	}
	Newtec.DsWidget.prototype.removeData=function(records,operId,callback){
	}
	Newtec.DsWidget.prototype.updateData = function(record,operId,callback){
	}
	Newtec.DsWidget.prototype.setData=function(datas){
		
	}
	Newtec.DsWidget.prototype.toFinsh=function(params){
		Newtec.Base.prototype.toFinsh.call(this,params);
		var datas=params.datas;
		var that=this;
		if(Newtec.Utils.isNull(datas)?false:(Newtec.Utils.isArray(datas)?datas.length>0:true)){
			setTimeout(function(){
				that.setData(datas);
			});
		}else if(params.autoFetch){
			this.fetchData();
		}
	}
	Newtec.Module("DsWidget")
})();