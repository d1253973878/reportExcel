(function(){
	 /*******文本框开始******************/
	Newtec.Utils.addCSS("font-awesome.min.css","myqdp/font-awesome/4.5.0/css/");
	Newtec.MyText=function(params){
		this.default={
			maxlength:50,
			inputType:'text'
		}
	}
	Newtec.MyText.exte(Newtec.Base,'myText');
	Newtec.MyText.over({
		createNewtecJQ:function(f){
			return $("<input class='myText' placeholder='"+(f.placeholder||"")+"' maxlength='"+(f['maxlength']||"50")+"' type='"+(f['inputType']||"text")+"' autocomplete='off' name='"+f.name+"'  val='"+(f.data||"")+"'/>")
		},
		setValue:function(value){
			this.newtecJQ.val(value);
		},
		getValue:function(){
			return this.newtecJQ.val();
		}
	})
	/**
	 * 自定义formItem，可以随意配置表单内多个列
	 * @param {Object} params 自定义参数
	 */
	Newtec.MyFormItem = function (params) {
		this.mapNewtec={}
	};
	Newtec.MyFormItem.exte(Newtec.FormItem,'myFormItem');
	//3.实现接口
	Newtec.MyFormItem.over({
		/**
		 * 创建内容区域
		 * @param {Object} f
		 */
		createValueJQ:function(f){
			console.info("=len===",f)
			this.createValueJQBefore(f);
			var layout =$("<div class='newtec-myLayout'></div>");
			var itemParms=f.itemParms;
			var len=itemParms.length,tagLen=len,tagC=100;
			
			for(var i=0;i<len;i++){//columnNum
				var iParam=itemParms[i],
				columnNum=Newtec.Utils.toFloat(iParam.columnNum,0);
				
				if(columnNum>0){
					tagLen--;
					tagC-columnNum;
					
				}else{
					columnNum=0;
				}
				iParam.columnNum=columnNum;
			}
			tagC= tagC/tagLen;
			var mapNewtec=this.mapNewtec;
			var divMap=this.divMap={};
			for(var i=0;i<len;i++){//columnNum
				var iParam=itemParms[i],
				columnNum=iParam.columnNum,
				styleStr=iParam.styleStr,
				name=iParam.name;
				console.info("iParam:",iParam)
				var newtec=this.getTypeNewtec(iParam)
				mapNewtec[name]=newtec;
				var div=$("<div class='item' style='width:"+(columnNum||tagC)+"%;"+styleStr+"'></div>").append(newtec.newtecJQ)
				divMap[name]=div;
				layout.append(div)	
			}
	    	return  layout;
		},
		createValueJQBefore:function(params){},
		/**
		 * 获取自定义组件
		 * @param {Object} param 自定义参数 组
		 */
		getTypeNewtec:function(param){
			var type=param.type||"myText"
			var funcType=Newtec.funcType[type];
			return funcType.create(param)
		},
		/**
		 * 获取值
		 */
		getValue:function(){
			var mapNewtec=this.mapNewtec
			var map={};
			for(var key in mapNewtec)map[key]=mapNewtec[key].getValue();
			return map;
		},
		getValueStr:function(){
			var mapNewtec=this.mapNewtec
			var value="";
			for(var key in mapNewtec)value+=(mapNewtec[key].getValue()||"");
			console.info("==getValueStr=>>",value);
			return value;
		},
		/**
		 * 插入值
		 * @param {Object} valueMap 值map key对应自定义组件
		 */
		setValue: function(valueMap){
			var mapNewtec=this.mapNewtec
			for(var key in valueMap){
				mapNewtec[key]&&mapNewtec[key].setValue(valueMap[key]);
			}
		}
	});
	Newtec.Utils.addJS("province.js","thirdparty/province/")
	/**
	 * 地址组件
	 * @param {Object} params
	 */
	Newtec.AddressItem = function (params) {
		
	};
	Newtec.AddressItem.exte(Newtec.MyFormItem,'addressItem');
	Newtec.AddressItem.over({
		initParams:function(params){
			var defaults=this.defaults
			defaults.showDetail=true;//是否显示详细地址输入框
			defaults.showStreet=true;//是否显示街道选择
			defaults.showCounty=true;//是否显示城镇选择
			defaults.showCity=true;//是否显示城市选择
			var defaultStyle=defaults.defaultStyle=params.defaultStyle||{//默认样式
				detail:"width:calc(100% - 540px)",
				street:"width:180px",
				county:"width:120px",
				city:"width:120px",
				province:"width:120px"
			}
			//具体地址参数配置
			defaults.detailParam={type:'myText',name:'detailAddress',placeholder:'请输入详细地址',styleStr:defaultStyle.detail}
			//街道选择参数配置
			defaults.streetParams={
					name:"street",showDownIcon:true,defaultValue:"街道/镇",valueName:"name",styleStr:defaultStyle.street,
					data:{"defaults":"区/县"},type:'mySelect',useFirstValue:false,
			}
			//城镇显示参数配置
			defaults.countyParams={
					name:"county",showDownIcon:true,defaultValue:"区/县",valueName:"name",styleStr:defaultStyle.county,
					data:{"defaults":"区/县"},type:'mySelect',useFirstValue:false}
			//城市显示参数配置
			defaults.cityParams={
					name:"city",showDownIcon:true,defaultValue:"市(省级)",valueName:"name",styleStr:defaultStyle.city,
					data:{"defaults":"市(省级)"},type:'mySelect',useFirstValue:false,
			};
		},
		createValueJQBefore:function(){
			var params=this.defaults;
			console.info("----MMM",params)
			var province=Newtec.Province;
			var provinceData={};
			var that=this;
			for(var i=0,len=province.length;i<len;i++)provinceData[province[i]]=province[i]
			var tagProvince=0,tagCity=0,tagCounty=0,tagStreet=0,
			preCitys=0,preCounty=0,
			/**
			 * 省份
			 */
			provinceParams={
				name:"province",showDownIcon:true,defaultValue:"省、直辖市",styleStr:params.defaultStyle&&params.defaultStyle.province,
				data:provinceData,type:'mySelect',useFirstValue:false,
				change:function(newtecThis,element, checked, value,name,valueData){
					var mapNewtec=that.mapNewtec
					tagProvince=name;
					if(mapNewtec){
						if(Newtec.City[name]){//数据已经加载过
							preCitys=Newtec.City[name].childs;
							if(preCitys.length==1){
									preCounty=preCitys[0].childs;
									mapNewtec["county"].setData(preCounty);
									mapNewtec["city"].setData([])
									that.divMap["city"].css("display",'none');
								}else{
									mapNewtec["city"].setData(preCitys)
									mapNewtec["county"].setData([]);
									that.divMap["city"].css("display",'');
								}
						}
						else{//数据第一次加载，加载对应省份
							Newtec.Utils.addJS(name+".js","thirdparty/province/",function(){
								var json=Newtec.City[name]
								preCitys=json.childs;
								if(preCitys.length==1){
									preCounty=preCitys[0].childs;
									mapNewtec["county"].setData(preCounty);
									mapNewtec["city"].setData([])
									that.divMap["city"].css("display",'none');
								}else{
									mapNewtec["city"].setData(preCitys)
									mapNewtec["county"].setData([]);
									that.divMap["city"].css("display",'');
								}
							})
						}
						mapNewtec["street"].setData([]);
					}
					
				}
			};
			var itemParms=params.itemParms=[provinceParams]
			/**
			 * 市(省级)
			 */
			if(params.showCity){
				params.cityParams.change=function(newtecThis,element, checked, value,name,valueData){
					var mapNewtec=that.mapNewtec
					tagCity=name;
					if(mapNewtec&&preCitys){
						var childs=preCitys
						for(var i=0,len=childs.length;i<len;i++){
							var ch=childs[i]
							if(ch.name==name){
								preCounty=ch.childs;
								mapNewtec["county"].setData(preCounty)
								return;
							}
						}
						mapNewtec["street"].setData([]);
					}
				}
				itemParms.push(params.cityParams)
			}
			if(params.showCity&&params.showCounty){
				params.countyParams.change=function(newtecThis,element, checked, value,name,valueData){
					var mapNewtec=that.mapNewtec
					tagCounty=name;
					if(mapNewtec&&preCounty){
						var childs=preCounty
						for(var i=0,len=childs.length;i<len;i++){
							var ch=childs[i]
							if(ch.name==name){
								mapNewtec["street"].setData(ch.childs)
								return;
							}
						}
					}
				}
				itemParms.push(params.countyParams)
			}
			
			if(params.showCity&&params.showCounty&&params.showStreet){
				itemParms.push(params.streetParams)
			}
			
			if(params.showDetail){
				itemParms.push(params.detailParam)
			}
		},
	})
	Newtec.Module("MyText")
})();
