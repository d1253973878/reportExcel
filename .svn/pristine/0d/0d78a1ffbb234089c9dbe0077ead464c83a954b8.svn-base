Newtec.Component(["Table"],function(){
	Newtec.TableExt=function(){
		
	}
	Newtec.TableExt.exte(Newtec.Table,'TableExt');
	Newtec.TableExt.over({
		getTable:function(params){
			var that=this;
			var table = "<div id='"+this.getTableId()+"' class='newtec-table "+(params['tableClass']||"")+"'></div>";//原来是table标签的 现在换成了div标签
			this.table = table=$(table);
			var thead=$("<div class='t-thead-div'>");
			var style=!params.is100Height&&'max-height:'+params.maxHeight+"px;min-height:"+params.minHeight+"px"||"";
			var tbodyDiv=$("<div class='t-tbody-div' style='"+style+"'>");
			table.append(tbodyDiv).append(thead);
			this.setTableBody(tbodyDiv,table);
			this.thead=thead;
			this.tbodyDiv=tbodyDiv;
			if(params.moreModule.show){//拓展模块展示
				Newtec.Utils.addJS('widget/table/newtec.table_sort.js',function(){
					that.setMoreModuleBody();
				})
			}
			this.setDS(params['ds'], true);
			var headHtmlArr=this.setFields(this.fields);
			var headHtml=thead;
			return table;
			
		},
		setFields: function(fields){
			if(Newtec.Utils.isNull(fields) || this.hasSetFields==true){
				return ;
			}
			
			this.tbodyHead.empty().append(exthead);
			
			thead="<table id = 'out-head' class='newtec-thead table table-bordered'><thead>"+thead+"</thead>";
			if (this.defaults.showFilter) {
				thead+='<tbody><tr id="'+this.getTrFilterId()+'" class="head-filter">'+getFilterTr(this,fields)+'</tr></tbody>';
			}
			thead+="</table>";
			this.thead.append(thead);
			
			this.theadTh=this.thead.find("th.h-column");
			this.tbodyTh=this.tbodyHead.find("th.h-column");
			if(!Newtec.Utils.isTrue(this.defaults['showThead']))//隐藏表头
				this.hiddeThead();
			return [thead,exthead];
		},
		createFieldHtml:function(){
			this.hasSetFields=true;
			this.fields = fields;
			var defaults=this.defaults;
			var checkStr = (this.multSelect==false)?"":"<th id='c' class='center check-box' style='width:"+this.getCheckeboxWidth()+"'>"
					+"<span class='check-item' id='"+this.getThCheckId()+"' >"	
					+"<img class='allimg' src='"+serverUrl+"myqdp/images/table/content_btn_selection.png'/>"
					+"<img class='noallimg' src='"+serverUrl+"myqdp/images/table/content_btn_half_election.png'/>"
					+"</span>"
					+"</th>";
			checkStr = (this.defaults.expand==false)?checkStr:"<th id='c' class='center' style='width:"+this.getCheckeboxWidth()+";border-bottom:none;border-left:0;'>"
					+"</th>";
			var thead = "";
			var otherFieldArray = this.defaults.otherFieldArray
			if(!Newtec.Utils.isNull(otherFieldArray)){
				for(var i = 0 ; i < otherFieldArray.length ; i++){
					var otherFields = otherFieldArray[i]
					thead += "<tr>"
						for(var y = 0 ; y < otherFields.length ; y++){
							var otherField = otherFields[y]
							thead += "<th class = 'center fieldStyle h-column'>" + otherField + "</th>"
						}
					thead += "</tr>"
				}
			}
			thead += "<tr id='"+this.getThId()+"'>"+checkStr;
			var len = fields.length,fixed=false,className=" h-column",title="";
			if(defaults.fixed&&defaults.headFixed){
				className+=" nowrap";fixed=true;
			}
			var lastName="";
			var exthead=thead;
			if(this.isTrBtnFun&&!this.defaults.trBtnLast){
				exthead=exthead+"<th class='center opear-btn' style=' width:"+this.getTrBtnWidth()+";border-left:1px;border-right:1px solid #dddddd;'>"+this.defaults['trBtnTitle']+"</th>";
				thead = thead+"<th id='"+this.getThbtnId()+"' class='center opear-btn' style=' width:"+this.getTrBtnWidth()+";border-left:1px;border-right:1px solid #dddddd;'>"+this.defaults['trBtnTitle']+"</th>";
				this.trBtnShow=true;//行上最后一列按钮是否显示
			}
			for(var i=0;i<len;i++){//此处要进行列名字验证 一定要存在 ‘name'属性
				var field = fields[i];
				var createFieldBefore = this.defaults.createFieldBefore;
				var createFieldBeforeRet = true;
				if(Newtec.Utils.isFunction(createFieldBefore))createFieldBeforeRet = createFieldBefore(field,"list",this.ds==undefined?"":this.ds.dsName);
				if(createFieldBeforeRet == false){//剔除的列
	//				fields[i] = undefined;
					fields.splice(i,1);
					len-=1;//长度减一！！！
					i--;//检索号减一！！！
					continue;
				}
				var fieldStyle = field['style'];
				title="";
				if(fieldStyle==undefined)fieldStyle="fieldStyle";
				var hidden = Newtec.Utils.getFieldAttrValue(field,'hidden');
				if(Newtec.Utils.isTrue(hidden)){
					hidden = ' display:none; ';
					field['h'] = true;//设置成隐藏，让创建tBody的时候使用
				}else{
					hidden = '';
					lastName=field['name'];
				}
				if(fixed){
					title="title='"+field['title']+"'";
				}
				var width=field.width;
				if(width!==undefined){
					width=";width:"+(width&&!isNaN(width)&&width+"px"||width);
					width+";min-width:auto;"
				}
				var thAlign = defaults.thAlign || "center" //表头标题位置
				exthead+="<th " + (Newtec.Utils.isNull(field['colspan']) ? "" : " colspan = '" + field['colspan'] + "' ") + " " + (Newtec.Utils.isNull(field['rowspan']) ? "" : " rowspan = '" + field['rowspan'] + "' ") + "class='"+this.getThFirstClass()+" "+thAlign+" "+fieldStyle+className+"' "+title+" style='"+hidden+width+"'>"+field['title']+"</th>";
			}
			thead=exthead;
			this.lastName=lastName;
			if(this.isTrBtnFun&&this.defaults.trBtnLast){
				exthead=exthead+"<th class='center opear-btn' style=' width:"+this.getTrBtnWidth()+";border-left:1px;border-right:0;'>"+this.defaults['trBtnTitle']+"</th>";
				thead = thead+"<th id='"+this.getThbtnId()+"' class='center opear-btn' style=' width:"+this.getTrBtnWidth()+";border-left:1px;border-right:0;'>"+this.defaults['trBtnTitle']+"</th>";
				this.trBtnShow=true;//行上最后一列按钮是否显示
			} 
			var tableThis=this;
			thead+="</tr>";
			exthead+="</tr>";
			return 
		},
	})
	Newtec.Module("TableExt")
});