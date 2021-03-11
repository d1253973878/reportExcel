;(function(){
	Newtec.Table||Newtec.Utils.addJS("widget/newtec.table.js");
	Newtec.Form||Newtec.Utils.addJS("widget/newtec.form.js");
	Newtec.TreeGrid||Newtec.Utils.addJS("widget/newtec.treegrid2.0.js");
	Newtec.ParamPage = function (params) {
		var ds = params.ds;
		params.ds = Newtec.Utils.isString(ds)?Newtec.DS.get(ds):ds;
		this.dsName = params.ds.dsName;
		this.ds=params.ds;	
		this.defaults = {
				ds: '',
				showHead:true,
				update:true,
				allDate:false,
				updateId:'',
				updateTitle:'设&nbsp;置',
				updateBefore:'',
				updateAfter:'',
				headStyle:'',
				showDetail:true,
				warnMess:'请先选择对应的应用',
				initBtns:function(btns){},//可以增加或移除按钮
				treeParams:{
					autoFetch:false,
					showRightMenu: true,
					menuTitle:[{title:'增加同级',name:'add1'},{title:'增加下级',name:'add2'},{title:'删除',name:'remove'}],
					showCheckbox:false,
				},
				formParams:{}
		};//定义缺省参数.
		console.info("==>>",this.defaults,params);
		$.extend(true,this.defaults,params);
	};
	Newtec.Utils.addStyle(".title{"+
       	    "padding: 8px 10px;"+
		    "background: #e8ebf3;"+
		    "border: 1px solid #ddd;"+
		    "border-bottom: 0;"+
		    "font-size: 17px;}");
	Newtec.ParamPage.exte(Newtec.Base,'paramPage');
	Newtec.ParamPage.over({
		getEditbtnId:function(){
			return this.dsName+"_allocation_edit_id";
		},
		getDetailBtnId:function(){
			return this.dsName+"_allocation_detail_id";
		},
		finAppendToJQ:function(params){
			/*var name = window.frameElement.name;
			var ff = $(parent.window.frames[name].document).find(params["appendTo"]);*/
			var frame = window.frameElement;
			if(frame==null || frame==undefined) return params["appendTo"];
			var frame = Newtec.AppUtils.getFrameWin(frame.name);
			return $(frame.document).find(params["appendTo"]);;
		},
		createNewtecJQ:function(params){
			 /** 1表示高安全级别权限控制(field)，按钮和数据的行列集权限由权限控制；
			 * 0表示低安全级别权限控制(node)，系统出菜单外的资源不受权限控制，默认全部显示
			 * 2：表示菜单和按钮受权限控制(butto、n)*/
		var appAuthorLevel = Newtec.Person.get().app.authorityControl,//系统的权限级别	
		has = appAuthorLevel==0,
		btnMap = {},
		ds=this.ds,
		that=this,
		appSelect=0,
		tree=0,
		detailTable=0,
		tagType=-111111,
		editTitle='',editShow='';
		crrApplictionId=Newtec.Person.getPowerAppId(),
		defaults=this.defaults,
		showHead=defaults['showHead'];
		console.info('---,,',defaults,params);
	    if(has==false)//需要授权
	    	btnMap = Newtec.Person.getButton()||{};
			var appendTo=params['appendTo'];
//			$(appendTo).css('height','100%');
			this.cacheData={};//将已经关联的数据存在cacheData中
			this.leftSelectId='';//当前左表选择的id
			var page=$('<div style="height:100%;width:100%;"></div>'),
			detailpdate=btnMap[that.getDetailBtnId()]||false;
			showDetail=params['showDetail']&&(has || detailpdate != undefined);
			body=$("<div style='position:absolute;top:"+(showHead?50:0)+"px;bottom:0;width:100%;'></div>"),
			left=$("<div style='width:460px;height:100%;position: relative;'><div class='title'>字典资源树</div><div id='left' style='position:absolute;width:100%;top:40px;bottom:0;overflow:auto;'></div></div>"),
			right=$("<div style='left:465px;right:"+(showDetail?405:0)+"px;top:0;bottom:0;position:absolute;' ><div class='title'>字典属性</div><div id='right' style='margin-top: 10px;'></div></div>"),
			detailDiv=0;
			body.append(left).append(right);
			if(showDetail){
				detailDiv=$("<div style='width:400px;right:0;top:0;bottom:0;position:absolute;' ><div class='title'>字典属性描述</div></div>");
				body.append(detailDiv);;
			}
			if(showHead){
				head=$("<div style='height:45px;background: #e8ebf3;border: 1px solid #ddd;' id='head'></div>");
				appSelect = Newtec.MySelect.createAdmin();
	            //重写onChange事件，加载对应应用页面
	            appSelect.onChange = function (element, checked, value, name) {
	                console.log('切换应用id=' + name);
	                console.log('根据应用id查询');
	                Newtec.Person.setPowerAppId(name);//保存当前选择应用
	                tree.fetchData({data:{'application_id':name}});
	                crrApplictionId=name;
	            };
	            var other = $("<div class='pull-left' style='margin-left:10px;'></div>");
	            other.append(appSelect.newtecJQ);
	            page.append(head);
	            head.append(other);
	            if(params.selAppId)
		            setTimeout(function(){
		            	appSelect.setValue(params.selAppId);
		            }, 300)
			}else{
				crrApplictionId=parent.Newtec.person.app.id;
				console.info("===="+crrApplictionId,Newtec.Person)
			}
			page.append(body);
//			树参数
			var treeParams=params['treeParams'],form=0;
			treeParams=treeParams?treeParams:{};
			treeParams.ds=ds;
			
			treeParams.menuClickBefore=function(a){
				if(a['name']=='add1'){
					var selData=tree.getSelectedRecords(),
					values={type:selData.type,
						code:selData['code'],
						'inner_type':selData['inner_type'],'qy_status':'启用',
						sort:Newtec.Utils.toInt(selData['sort'],0)+1},
					form=Newtec.Form.create({
						ds:ds,values:values,operType:Newtec.DS.OperType.add
					});
					var win=Newtec.Window.create({
						title:'添加操作',
						body:form.newtecJQ,
						width:1100,
						footer:Newtec.Button.create({
							title:'确定',
							click:function(){
								var data=form.getValues();
								data.parentId=selData['parentId'];
								data['application_id']=crrApplictionId;
								data['rootid']=selData['rootid'];
								var parentId=selData['parentId'];
								data['full_name']=tree.treeGridJsonData[parentId]['full_name']+'/'+data['name'];
								tree.addData(data,'addData',function(res){
									if(res.status==0){
										alert("添加成功");
										win.close();
									}else{
										alert(res.error);
									}
								});
							}
						})
					});
				}else if(a['name']=='add2'){
					var selData=tree.getSelectedRecords(),
					values={type:selData.type,
						code:selData['code'],
						'inner_type':selData['inner_type'],'qy_status':'启用',
						sort:Newtec.Utils.toInt(selData['sort'],0)+10},
					form=Newtec.Form.create({
						ds:ds,values:values,operType:Newtec.DS.OperType.add
					});
					var win=Newtec.Window.create({
						title:'添加操作',
						body:form.newtecJQ,
						width:1100,
						footer:Newtec.Button.create({
							title:'确定',
							click:function(){
								var data=form.getValues();
								data.parentId=selData['id'];
								data['application_id']=crrApplictionId;
								data['rootid']=selData['rootid'];
								data['full_name']=selData['full_name']+'/'+data['name'];
								tree.addData(data,'addData',function(res){
									if(res.status==0){
										alert("添加成功");
										win.close();
									}else{
										alert(res.error);
									}
								});
							}
						})
					});
				}else if(a['name']=='remove'){
					tree.removeData({id:tree.getSelectedRecords()['id']},'deleteData'
						,function(res){
							if(res.status==0){
								alert('删除成功');
							}else{
								alert('删除失败');
							}
					});
				}
				return false;
			};
			var typeParams=[];
			treeParams.onClick=function(){
				var data=tree.getSelectedRecords();
				data=Newtec.Utils.isArray(data)?data[0]:data;
				var type=data['type'];
				if(!typeParams[type+'title']){
					ds.fetchData({operId:'getParamDetail',data:{type:type},callback:function(res){
						if(res.status==0){
							var resData=res['data'],fields=$.extend(true,[],ds['fields']),fieldData=[],titles=-1,shows=-1;
							if(resData.length>0){
								if(resData[0]['id']=='title-'+type){
									titles=resData[0];
									shows=resData[1];
								}else{
									titles=resData[1];
									shows=resData[0];
								}
							}
							for(var i=0,len=fields.length;i<len;i++){
								var f=fields[i];
								if(Newtec.Utils.isTrue(f['hidden'])||Newtec.Utils.isTrue(f['form-hidden']))continue;
								var name=f['name'],
								d={name:name,title:f['title'], newTitle:"",show:true};
								if(titles!=-1&&!Newtec.Utils.isNull(titles[name])){
									f['title']=d['newTitle']=titles[name];
								}
								if(shows!=-1&&!Newtec.Utils.isNull(shows[name])){
									f['hidden']=!(d['show']=shows[name]=='false'?false:true);
									console.info("------132",f['hidden'],d['show'],shows[name]);
								}
								fieldData.push(d);
							}
							typeParams[type+"_fData"]=fieldData;
							typeParams[type+"_fields"]=fields;
							setParamsDetail(data,fieldData,fields,type);
						}
					}});
				}else{
					setParamsDetail(data,typeParams[type+"_fData"],typeParams[type+"_fields"],type);
				}
			};
			var setParamsDetail=function(data,fieldData,fields,type){
				editTitle=editShow=0;
				createFrom(data,fields,type);
				if(showDetail){
					if(detailTable==0){
						detailTable=Newtec.Table.create({
							multSelect:false,maxHeight:527,dbclickCanEdit:true,
							fields:[{name:'name',title:'属性',width:90},{name:'title',title:'旧文本',width:100},
							        {name:'newTitle',title:'新文本'},{name:'show',title:'显示',type:'radio',width:50}],
							        showFetchForm:false,showPagin:false,showHeader:false,showFooter:false,
							        editHandler:function(newText,text,data,jq,name){
							        	console.info(newText,text,data,jq,name);
							        	if(newText==text)return;
							        	if(name=='show'){
							        		if(editShow==0){
							        			editShow={id:'show-'+type};
							        		}
							        		editShow[data['name']]=newText;
							        	}else if(name=='newTitle'){
							        		if(editTitle==0){
							        			editTitle={id:'title-'+type};
							        		}
							        		editTitle[data['name']]=newText;
							        	}
							        }
						});
						detailDiv.append(detailTable.newtecJQ);
						var btn=$("<button class='btn btn-info' style='float:right;width:100px;margin: 10px;'>修改</button>")
						detailDiv.append(btn);
						btn.click(function(){
							if(editTitle==0&&editShow==0){
								alert('数据无变化');return;
							}
							var datas=[];
							if(editTitle!=0){
								datas.push(editTitle);
							}
							if(editShow!=0){
								datas.push(editShow);
							}
							ds.updateData({data:datas,operId:Newtec.Utils.isNull(detailpdate['operationId'])?'updateDetail':detailpdate['operationId'],callback:function(res){
								if(res.status==0){
									typeParams[type+"_fData"]=detailTable.pageDatas;
									if(editTitle!=0){
										for(var key in editTitle){
											for ( var i = 0; i < fields.length; i++) {
												console.info();
												if(fields[i]['name']==key){
													fields[i]['title']=editTitle[key];
													continue;
												}
											}
										}
									}
									if(editShow!=0){
										for(var key in editShow){
											for ( var i = 0; i < fields.length; i++) {
												if(fields[i]['name']==key){
													fields[i]['hidden']=editShow[key]=='false'?true:false;
													continue;
												}
											}
										}
									}
									console.info("[[jdljl]]",fields,editTitle,editShow);
									createFrom(data,fields,type,true);
									alert('修改成功！');
								}else{
									alert('修改失败！');
								}
							}});
						});
					}
					detailTable.setData(fieldData);
				}
			};
			var createFrom=function(data,fields,type,reCreate){
				if(tagType!=type||reCreate==true){
					if(form!==0){
						form.newtecJQ.remove();
						form=null;
					}
					var formParams=defaults['formParams'];
					formParams=formParams?formParams:{};
					formParams.fields=fields;
					formParams.values=data;
					form=Newtec.Form.create(formParams);
					var rightJQ=right.find('#right');
					rightJQ.prepend(form.newtecJQ);
					if(tagType===-111111){
							var btnUpdate=btnMap[that.getEditbtnId()];
						if(params[Newtec.DS.OperType.update]&&(has || btnUpdate != undefined)){
							var btn=$("<button class='btn btn-info' style='float:right;width:100px;margin-right: 50px;'>修改</button>")
							rightJQ.append(btn);
							btn.click(function(){
								var tagData=form.getValues();
								tagData['last_time']=new Date().Format("yyyy-MM-dd hh:mm:ss");
								if(Newtec.Utils.isNull(tagData['sort']))delete tagData['sort'];
								if(Newtec.Utils.isNull(tagData['sys_code']))delete tagData['sys_code'];
								ds.updateData({data:tagData,callback:function(res){
									if(res.status==0){
										tree.updateRecords(tagData);
										alert('修改成功！');
									}else{
										alert('修改失败！');
									}
								}});
							});
						}
					}
					tagType=type;
				}else{
					form.clearValues();
					form.setValues(data);
				}
			};
			tree=Newtec.TreeGrid.create(treeParams);
			left.find('#left').append(tree.newtecJQ);
			return page;
		},
		
	});
	Newtec.Module("ParamPage")
})();
//
