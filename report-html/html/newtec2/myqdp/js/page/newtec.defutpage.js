/**
 * 系统：应用开发平台
 * 页面：页面定义
 * @author 曾文杰
 */
(function () {
	Newtec.FilePage||Newtec.Utils.addJS("page/newtec.filepage.js")
	Newtec.EntityPage||Newtec.Utils.addJS("page/newtec.entitypage.js")
   Newtec.DefutPage = function (params) {
        //默认
        this.defaults = {
            ds: '',
            entityParam:{
            	fetchParam:{operId:'getDsByAppId'},
            	autoFetch:false,
            }
        };
        //合并
        this.defaults = $.extend(true,this.defaults, params);
        //处理数据源
        var ds = this.defaults.ds;
        this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;
        params.ds = this.ds;
        if (!this.ds) {
            console.log("ds is undefined");
            alert('ds is undefined');
        }
    };
    Newtec.DefutPage.exte(Newtec.Base, 'DefutPage');
    Newtec.DefutPage.over({
        createNewtecJQ: function (params) {
          
            //========== END OF 创建应用下拉列表 ==========
            var entityParam=params.entityParam;
            if(Newtec.Utils.isNull(entityParam.ds)){
            	entityParam.ds=params.ds;
            }
            entityParam.ds='dataSourceMeta';
            if(Newtec.Utils.isNull(entityParam.fetchParam)){
            	entityParam.fetchParam={data: {applicationId: Newtec.Person.getPowerAppId()}};
            }
            var appSelect='';
            var table='';
            if(Newtec.Utils.isNull(entityParam.tableHeaderOther)){
            	var that = this,thatJQ = $(that.defaults.appendTo);
            	//========== 创建应用下拉列表 ==========
            	appSelect = Newtec.MySelect.createAdmin();
            	//重写onChange事件，加载对应应用页面
            	appSelect.onChange = function (element, checked, value, name) {
            		console.log('切换应用id=' + name);
            		console.log('根据应用id查询');
            		Newtec.Person.setPowerAppId(name);//保存当前选择应用
            		if(table==''){
            			table=entityPageNewtecJQ.table;
            		}
            		if(table!=undefined){
            			var data=table.fetchParam.data==undefined?{}:table.fetchParam.data;
            			data.relationLeftIdValue=name;
            			table.fetchParam.data=data;
            			table.fetchData();
            		}
            	};
            	var other = $("<div class='pull-left' style='margin-left:10px;'></div>");
            	other.append(appSelect.newtecJQ);
            	entityParam.tableHeaderOther=other;
            }
            //========== 创建页面 ==========
            var entityPageNewtecJQ = Newtec.EntityPage.create(entityParam);
            //========== END OF 创建页面 ==========
//            entityPageNewtecJQ.newtecJQ.css('height','100%');
            return entityPageNewtecJQ.newtecJQ;
        }
    });
    Newtec.Module("DefutPage")
})();