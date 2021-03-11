;(function(){
	//alert('=='+Newtec.AppUtils.getNodeId());
	
	Newtec = parent.Newtec;
	$ = parent.$;
	Function = parent.Function;
	var f1 = function(){};
	var f2 = new Function();
	var f3 = new parent.Function();
	alert('f1='+Newtec.Utils.isXX(f1));
	alert('f2='+Newtec.Utils.isXX(f2));
	alert('f3='+Newtec.Utils.isXX(f3)+f3.exte);
	/*Newtec.EntityPage = new function (params) {
		var ds = params.ds;
		params.ds = Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		this.defaults = {
				 ds: '',
				add:true,
				remove:true,
				update:true,
				fetch:true,
				 trBtnWidth: 180,
			        showHeader: true,
			        autoFetch: true,
			        fetchParam: {endRow: 2}
			       , tdValueHtmlFun: function (tdValue, data, row, col,colName) {}
			        , trBtnFun: function (row, record, tr, table) {}
		};//定义缺省参数.
	};*/
	var ss = "var ds = params.ds;"+
	"params.ds = Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;"+
	"this.defaults = {"+
			 "ds: '',"+
			"add:true,"+
			"remove:true,"+
			"update:true,"+
			"fetch:true,"+
			"trBtnWidth: 180,"+
		        "showHeader: true,"+
		        "autoFetch: true,"+
		        "fetchParam: {endRow: 2}"+
		       /*, tdValueHtmlFun: function (tdValue, data, row, col,colName) {}*/
		        ", trBtnFun: function (row, record, tr, table) {}"+
	"};";
	Newtec.EntityPage = new Function ('params',ss) ;
	Newtec.EntityPage.exte(Newtec.Base,'entitypage');
	Newtec.EntityPage.over({
		finAppendToJQ:function(params){
			/*var name = window.frameElement.name;
			var ff = $(parent.window.frames[name].document).find(params["appendTo"]);*/
			var frame = window.frameElement;
			if(frame==null || frame==undefined) return params["appendTo"];
			var frame = Newtec.AppUtils.getFrameWin(frame.name);
			return $(frame.document).find(params["appendTo"]);;
		},
		createNewtecJQ:function(params){
		var ds = params.ds;
		params.showFetchForm = params.fetch;
	    var tdd = Newtec.Table.create(params);// 创建表
//	    var tdd = new Newtec.Table(params);
//	    tdd.init(params);
	    if(params.update){
	    	alert(123);
	    	 tdd.setDbclickRecord(function (data, t) {
	 			alert('双击：'+Newtec.Utils.json2str(data));
	 	        var updateForm = Newtec.Form.create({
//	 				"appendTo" : "#form1",
	 	            titleColumn: 4,
	 	            columnNum: 4,
	 	            ds: ds,
	 	            values: data
	 	        });
	 	        var updateWin = Newtec.Window.create({
	 	            title: '网点服务修改窗口',
	 	            width: 1024,
	 	            body: updateForm,
	 	            footer: Newtec.Button.create({
	 	                title: '更新>>',
	 	                id: 'a1x',
	 	                click: function (a) {
//	 						alert(Newtec.Utils.json2str(updateForm.getValues()));
	 	                    Newtec.Window.createUpdate(function (bool) {
	 	                        if (bool == false) return;
	 	                        tdd.updateData(updateForm.getValues(), '', function (response) {
//	 								alert(Newtec.Utils.json2str(response));
	 	                            updateWin.close();
	 	                            Newtec.Window.createHint({html: '<span>更新成功！<span>'});
	 	                            //alert('更新返回值：'+Newtec.Utils.json2str(response));
	 	                        });
	 	                    });
	 	                }
	 	            })
	 	        });

	 	    });
	    }
	    var btns = [];
	     if(params.add){
	    	 btns.push({
	             title: '增&nbsp;加',
	             click: function () {
	                 var form = Newtec.Form.create({
	                     titleColumn: 4,
	                     columnNum: 4,
	                     ds: ds
	                 });// form結束,
	                 var win = Newtec.Window.create({
	                     title: '网点服务增加窗口',
	                     width: 1024,
	                     body: form,
	                     footer: Newtec.Button.create({
	                         title: '增加>>',
	                         id: 'a1x',
	                         click: function (a) {
//	 										alert('表单内容：'+Newtec.Utils.json2str(form.getValues()));
//	 										if(true) return ;
	                             var validate = form.validate();
//	 										var t = form.form.data('bootstrapValidator').validate();
	                             if (validate) {//验证通过
	                                 Newtec.Window.createAdd(function (bool) {
	                                     if (bool == false) return;
	                                     tdd.addData(form.getValues(), 'addNetworkId', function (response) {
//	 													alert('增加返回值：'+Newtec.Utils.json2str(response));
	                                         win.close();
	                                         Newtec.Window.createHint();
	                                     });
	                                 });
	                             }

	                         }
	                     })
	                 });
	             }
	         });
	    }
	    if(params.remove){
	    	btns.push({
	            title: '删除',
	            className: 'btn-warning',
	            click: function () {/*
	                var datas = tdd.getSelectedRecords();
	                if (datas.length <= 0) {
	                    Newtec.Window.createHint({html: '请选择要删除的记录！', className: 'btn btn-danger'});
	                    return;
	                }
	                Newtec.Window.createDelete(function (bool) {
	                    if (bool == false) return;
	                    tdd.removeData(datas, function () {
	                        Newtec.Window.createHint({html: '<span>删除成功！<span>'});
	                    });
	                });
	            */}
	        });
	    }
	    tdd.addButtons(btns);
	    this.page = $('<div></div>'); 
	    this.page.append(tdd.newtecJQ);
	    return  this.page;
	}});
	Newtec.Module("EntityPage")
})();