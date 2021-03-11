/**
 * 组件：TreeGrid
 * 功能：负责创建tree控件
 * @author 曾文杰
 */
/**
 * 说明：组件已经做了本质修改，不再使用jquery.treegrid，所有事件自行初始化
 * 	由于原来的树控件存在各种刷新和展开问题，而且效率很低，因此重新构建整个树，方便后期拓展树的功能
 * 功能：负责创建tree控件
 * @author 吴明坤
 */
(function () {	
	var serverUrl=Newtec.ServerUrl||"";
	Newtec.Utils.addCSS("jquery.treegrid.css","myqdp/css/widget/")
    Newtec.TreeGrid = function (params) {
        if (!Newtec.Utils.isJson(params)) {
            return;
        }
       
        this.defaults = {
            appendTo: '',

            //=====查询数据相关=====
            ds: '',//数据源
            autoFetch: true,//自动查询
            fetchParam: {
                operId: '',//查询时的方法
                data: {},//查询时的参数
                endRow: -1,
                callback: function (response) {
                }//查询回调
            },
            //=====TreeGrid事件=====
            beforeCheck: null,//Function
            afterCheck: null,//Function
            rightClick:null,//Function
            menuTitle:[{title:'删除',name:'remove',icon:'glyphicon-trash'},
	            {title:'上移',name:'up',icon:'glyphicon-arrow-up'},
	            {title:'下移',name:'down',icon:'glyphicon-arrow-down'},
            	{title:'展开',name:'open',icon:'glyphicon-folder-open'},
            	{title:'收起',name:'close',icon:'glyphicon-folder-close'}],
            menuClick:null,//Function
            menuClickBefore:null,//Function
            canDrag:false,
            dragStart:null,//Function
            dragStop:null,//Function
            
            beforeUnCheck: null,//Function
            afterUnCheck: null,//Function

            beforeCollapse: null,//Function
            onCollapse: null,//Function
            afterCollapse: null,//Function

            beforeExpand: null,//Function
            onExpand: null,//Function
            afterExpand: null,//Function

            beforeChange: null,//Function
            onChange: null,//Function
            afterChange: null,//Function

            beforeClick: null,//Function
            onClick: null,//Function
            afterClick: null,//Function

            beforeDbClick: null,//Function
            onDbClick: null,//Function
            afterDbClick: null,//Function

            fetchBefore: function () {
            },
            fetchAfter: function () {
            },
            setDataBefore:null,//Function
            setDataAfter:null,
            finsh: null,//Function

            //=====TreeGrid属性=====
            column: 1,//
            showCheckbox: true,//是否显示选择框
            showBorder: true,//是否显示边框
            showIcon: true,//是否显示图标
            expand: true,//是否全部展开
            cascade: 1,//级联方式 1=关联子节点选中 2=只选择当前节点 3=关联父节点 4=关联父子节点
            async: false,//异步加载,
            saveState: false,//保存状态
            iconType: 2,//图标类型，1=font 2=图片
            fontIcon: "",//iconType=1时有效
            showRightMenu: true,//显示右键菜单
            showFollowButtons: false,//显示右侧功能按钮，跟showFunctionButtons的区别在于这个是跟在第一列的文字背后
            showFunctionButtons: false,//显示右侧功能按钮，即增删改这三个按钮
            expanderTemplate: '<span class="treegrid-expander"></span>',
            expanderExpandedClass: 'treegrid-expander-expanded',
            expanderCollapsedClass: 'treegrid-expander-collapsed',
            indentTemplate: '<span class="treegrid-indent"></span>',
			loadStepBS:false,//逐级加载
            //=====TreeGrid样式=====
            tableClass: 'table table-condensed',//用的是bootstrap的样式 表格+表格紧缩+表格边框
            tableStyle: '',
            trClass: '',
            trStyle: '',
            tdClass: '',
            tdStyle: 'cursor:pointer;',
            checkboxClass: '',
            checkboxStyle: '',
            iconClass: '',
            iconStyle: '',
            selectedBackgroundColor: '#e8ebf3',
            selectedColor: '#000',
            unSelectBackgroundColor: '',
            unSelectColor: '',
            displayName:null,//['name','id','test'],
            tdValueHtmlFun:null,
            isMyExpand:null,
            isCanSelectFun:null,
            isNowrap:true,	
            frontImgUrl:"",
            sortKey:'sort',
            scrollBar:{
            	show:false,//是否展示滚动条
            	theme: "minimal-dark",//滚动条风格
				axis:"y",//滚动条显示轴，x,y,xy
				scrollInertia:200,//滚动条风格
				height:'100%'
            },
            showScrollBar:false,
        };
//        $.extend(this.defaults, params, {});
        var ds = params.ds;
        try {
            this.ds = Newtec.Utils.isString(ds) ? Newtec.DS.get(ds) : ds;
        }
        catch (err) {
            console.log(err);
        }
        this.fetchParam = this.defaults.fetchParam;

        this.treeGridId = "";//当前TreeGrid(即table)的id值
        this.treeGridJQ = undefined;//当前TreeGrid的jQuery对象
        this.rightMenuId = '';
        this.rightMenuJQ = undefined;
        this.pageDatas = [];//后台请求得到的数据，数组形式，即原始数据
        this.treeGridJsonData = {};//转换之后的数据，json形式，key-value
        this.pageJsonData = {};//转换之后的层级数据，通过children
        this.treeGridSetting = {};
        this.clickRecord = function () {
        };
        this.clickedRecord = undefined;//当前点击的节点

        this.tempHtml = "";//临时用的变量，不要随便用
        this.clickTimer = undefined;//解决dblclick会调用两次click的问题
        this.isExpand = false;//解决expand时会调用到click事件，用来判断expand和click
        this.isCheckbox = false;//同上,解决checkbox时会调用到click事件，用来判断checkbox和click
        this.isFirstInit = true;
        this.expandNum={};
        this.first=true;
    };
    Newtec.TreeGrid.exte(Newtec.Base, 'treeGrid');
    Newtec.TreeGrid.prefix = {
        treeGrid: "treeGrid_",
        treeGridDefaultClass: " tree ",
        checkbox: 'checkbox_',
        icon: 'icon_'
    };

    Newtec.TreeGrid.prototype.createNewtecJQ = function (params) {
        this.treeGridJQ = this.createTreeGrid();
        this.rightMenuId = 'treegrid-menu-' + Newtec.Utils.uuid16();
        this.rightMenuJQ=$("<div  id='" + this.rightMenuId + "' style='position:absolute;display:none;z-index:10000'></div>");
        $('body').after(this.rightMenuJQ);
        if(params.scrollBar.show){
        	var layout=$("<div class='newtec-treegrid-layout' style='height:"+(params.scrollBar.height)+"'></div>").append(this.treeGridJQ);
        	return layout;
        }else
        	return this.treeGridJQ;
    };

    Newtec.TreeGrid.prototype.finsh = function (params) {
        var that = this;
        if (this.defaults.autoFetch == true) {
            var fetchParam = $.extend({}, this.defaults.fetchParam);
            fetchParam.endRow = -1;
            this.fetchData(fetchParam);
        }
        this.initCheckboxEvent();
        this.initClickEvent();
        this.initDbClickEvent();
        if (Newtec.Utils.isFunction(this.defaults.finsh)) {
            this.defaults.finsh(params);
        }

        var str = ".treegrid-menu{z-index:999;position:fixed;left:0;top:0;width:200px;background-color:#fff;display:none;border:1px solid #eee}";
        str += ".follow-button{margin-left:5px;}";
        //处理右键菜单
        var nod = document.createElement("style");
        nod.type = "text/css";
        if (nod.styleSheet) {
            nod.styleSheet.cssText = str;
        } else {
            nod.innerHTML = str;
        }
        document.getElementsByTagName("head")[0].appendChild(nod);

        if (this.defaults.showRightMenu == true) {
            this.initRightClickEvent();
        }
        //处理右键菜单 END

        this.treeGridJQ.on('click', '.treegrid-add', function (e) {
            e.stopPropagation();
            var $this = $(this);
            var id = $this.data('id');
            var currentNodeData = that.treeGridJsonData[id];
            var parentId = currentNodeData['parentId'];
            var parentNodeData = that.treeGridJsonData[parentId];
            var value = {
                parentId: currentNodeData.id
            };
            that.addDataWindow(value);
        });

        this.treeGridJQ.on('click', '.treegrid-update', function (e) {
            e.stopPropagation();
        });

        this.treeGridJQ.on('click', '.treegrid-remove', function (e) {
            e.stopPropagation();
        });

        this.rightMenuJQ.on('click', '.treegrid-add', function (e) {
            e.stopPropagation();
            var $this = $(this);
            var id = $this.data('id');
            if (!Newtec.Utils.isNull(id)) {
                var currentNodeData = that.treeGridJsonData[id];
                var parentId = currentNodeData['parentId'];
                var parentNodeData = that.treeGridJsonData[parentId];
                var value = {
                    // parentId: parentId
                    // parentId: parentNodeData.id
                    parentId: currentNodeData.id
                };
                that.addDataWindow(value);
            } else {
            }
        });
        var treeGridJQ=this.treeGridJQ;
        var newtecJQ=this.newtecJQ;
        var newDiv=$('<div class="user-select" style="border:1px solid #ddd;position:absolute;z-index:1888;display:none;"></div>');
        $('body').after(newDiv);
        var unBind=function(){
        	treeGridJQ.unbind('mousemove mouseleave mouseup');
        	newDiv.css('display','none')
        	treeGridJQ.removeClass('user-select');
        	treeGridJQ.find('>tbody>tr').unbind('mousemove mouseleave');
        }
        if(that.defaults.canDrag){
	        var dragStop=that.defaults.dragStop;
	        var dragStart=that.defaults.dragStart;
	        treeGridJQ.on('mousedown','>tbody>tr',function(e){
	        	if(e.button!=0)return;
	        	var orinY=e.clientY;
	        	var orinX=e.clientX;
	        	newDiv.empty();
	        	var trThis=this;
	        	newDiv.append(this.innerHTML);
	        	var id=that.getNodeId(this),
	        	data=that.treeGridJsonData[id],
	        	statu=0,isFirt=true;
	        	
	        	treeGridJQ.on('mousemove',function(e){
	        		var y=e.clientY;
	        		var x=e.clientX;
	        		if(isFirt){
	        			isFirt=false;
		        		if(Math.abs(x-orinX)<3&&Math.abs(y-orinY)<3){
		        			return false;
		        		};
		        		
	        		}
	        		if(Newtec.Utils.isFunction(dragStart)){
	        			if(dragStart(e,data)===false){return false;}
	        		}
	        		treeGridJQ.addClass('user-select');
	        		newDiv.css({top:y+3,left:x+10,display:'block'})
	        	});
		        treeGridJQ.on('mousemove','>tbody>tr',function(e){
		        	var trJQ=$(this);
		        	var tData=that.treeGridJsonData[that.getNodeId(this)];
		        	var isChild=data.isChild||tData.noBrother;
		        	if(trThis==this||tData.parentId==id){
		        		trJQ.addClass('_treemyseft');
		        		return;
		        	}
		        	var y=e.clientY;
	        		var x=e.clientX;
	        		
	        		var top=trJQ.offset().top;
	        		var height=trJQ.outerHeight();
	        		var h=8;
	        		if(isChild){
	        			statu=3;
		        		trJQ.addClass('_treechlid').removeClass('_treebroder_top _treebroder_bottom');
	        		}else{
	        			if(y-top<h){
		        			statu=1;
		        			trJQ.addClass('_treebroder_top').removeClass('_treechlid _treebroder_bottom');
		        		}else if(height-(y-top)<h){
		        			statu=2;
		        			trJQ.addClass('_treebroder_bottom').removeClass('_treechlid _treebroder_top');
		        		}else{
		        			statu=3;
		        			trJQ.addClass('_treechlid').removeClass('_treebroder_top _treebroder_bottom');
		        		}
	        		}
	        		
	        	});
	        	treeGridJQ.on('mouseleave','>tbody>tr',function(e){
		        	$(this).removeClass('_treebroder_top _treebroder_bottom _treechlid _treemyseft');
		        	$(this).css('cursor','pointer');
	        	});
	        	treeGridJQ.on('mouseup','>tbody>tr',function(e){
	        		var finshJQ=$(this);
	        		var finshThis=this;
		        	finshJQ.removeClass('_treebroder_top _treebroder_bottom _treechlid _treemyseft');
		        	var tData=that.treeGridJsonData[that.getNodeId(this)];
		        	if(trThis==this||tData.parentId==data.id){
		        		return;
		        	}
		        	
		        	var parentId="",oldParentId=data.parentId;
		        	
		        	if(statu==1){
		        		parentId=that.getParentNodeId(this);
		        	}else if(statu==2){
		        		parentId=that.getParentNodeId(this);
		        		var lastc= that.getLastChlid(this)
		        		if(!Newtec.Utils.isNull(lastc)){
		        			finshThis=$(lastc).next()[0];
		        			statu=finshThis==null?statu:1
		        		}
		        	}else{
		        		parentId=that.getNodeId(this);
		        	}
		        	if(Newtec.Utils.isNull(parentId))
        				data.parentId=null;
        			else
        				data.parentId=parentId;
//      			that.tempHtml = "";
//			        that.recursion([data]);
//			        html = that.tempHtml;
//			        if(statu==1){
//		        		finshJQ.before(html);
//		        	}else if(statu==2){
//		        		finshJQ.after(html);
//		        	}else{
//		        		finshJQ.after(html);
//		        	}
//					 var allChild=that.getAllChlid(trThis);
					 var chlidData=that.getChildData(data);
//					  console.info(allChild);
//		        	that.removeRecords(data);
		        	that.setSortData(data,finshThis,(statu==1));
		        	if(chlidData[0]){
		        		that.setSortData(chlidData);
		        	}
		        	if(Newtec.Utils.isFunction(dragStop)){
		        		var dragEvent={tElem:trThis,oldParentId:oldParentId,data:data,hData:that.treeGridJsonData[that.getNodeId(this)],hElem:this,type:(statu==1?'before':'after')}
		        		dragStop(e,dragEvent);
		        	}
//		        	var tr=$('.treegrid-'+data.id);
//		        	for (var i=0;i<allChild.length;i++) {
//		        		tr.after($(allChild[i]))
//		        	}
					that.setTrbgById(id);
	        	});
	        	$(document).on('mouseup mouseleave',function(event){
					unBind();
				});
	        });
        }
        setTimeout(function () {
            that.addFollowButtons([
                {
                    img: serverUrl+'myqdp/images/system/menu/power/2.png',
                    click: function () {
                    }
                }
            ]);
        }, 200);
        /**
         * 注册事件
         */
        _initEvents(this);
    };
    /**
     * 初始化事件
     */
	function _initEvents(that){
		var newtecJQ=that.newtecJQ,
		treeGridJsonData=that.treeGridJsonData;
			
		//点击收取按钮
		newtecJQ.on('click','.treegrid-expander-expanded',function(){
			//is-has-child
			_openNodeE(this,false);
		})
		//点击展开按钮
		newtecJQ.on('click','.treegrid-expander-collapsed',function(){
			_openNodeE(this,true);
		})
		//双击节点展开/关闭
		newtecJQ.on('dblclick','.is-tree-parent',function(){
			var jq=$(this)
			that.expandNode(jq.attr("id"),jq.find('.treegrid-expander-collapsed')[0],that)
		})
		//处理节点展开/关闭事件
		function _openNodeE(elem,isOpen){
			var jq=$(elem);
			var id=jq.parent().parent().attr("id")
			that.expandNode(id,isOpen,that)
			/**
			 * 逐级添加
			 */
			
		}
	}
	
    Newtec.TreeGrid.prototype.fetchData = function (params) {
        var that = this;
        params = $.extend(true, this.defaults.fetchParam, params);
        var beforeFunction = this.defaults.fetchBefore;
        if (Newtec.Utils.isFunction(beforeFunction)) {
            beforeFunction(params);
        }
        if (Newtec.Utils.isNull(this.ds)) {
            console.error("数据源为空！！");
            return;
        }
        // var originCallback = params['callback'];
        params['callback']=params['relCallback'] || function (response) {
            // if (Newtec.Utils.isFunction(originCallback)) {
            //     originCallback(response);
            // }
        	  console.info("data===>>",response);
            if (response.status != 0) {
                Newtec.Window.createHint({html: '查询数据出错！', className: 'btn btn-danger'});
                return;
            }
            var data =response.data;
            if(data&&data.datas)data=data.datas
            that.pageDatas = data;
            console.info("data===>>",data,response);
            that.setData(data);
        };
        this.ds.fetchData(params);
    };
//    Newtec.TreeGrid.prototype.initTreeGrid=function(){}
    Newtec.TreeGrid.prototype.addData = function (record, operId, callback) {
        if (Newtec.Utils.isNull(this.ds)) {
            return;
        }
        var that = this;
        this.ds.addData({
            "operId": operId,
            "data": record,
            "callback": function (response) {
                if (response["status"] == 0) {
                    that.addRecords((Newtec.Utils.isNull(response["data"]) ? record : response["data"]));
                }
                if (Newtec.Utils.isFunction(callback)) {
                    callback(response);
                }
            }
        });
    };

    Newtec.TreeGrid.prototype.updateData = function (record, operId, callback) {
        if (Newtec.Utils.isNull(this.ds)) {
            return;
        }
        var that = this;
        this.ds.updateData({
            "operId": operId,
            "data": record,
            "callback": function (response) {
                if (response["status"] == 0) {
                    that.updateRecords((Newtec.Utils.isNull(response["data"]) ? record : response["data"]));
                }
                if (Newtec.Utils.isFunction(callback)) {
                    callback(response);
                }
            }
        });
    };

    Newtec.TreeGrid.prototype.removeData = function (records, operId, callback) {
        if (Newtec.Utils.isNull(this.ds)) {
            return;
        }
        var that = this;
        this.ds.removeData({
            "operId": operId,
            "data": records,
            "callback": function (response) {
                that.removeRecords(records);
                if (Newtec.Utils.isFunction(callback)) {
                    callback(response);
                }
            }
        });
    };

    Newtec.TreeGrid.prototype.addRecords = function (records, reInitTreeGrid) {
        if (Newtec.Utils.isArray(records)) {
					
            for (var i = 0; i < records.length; i++) {
               this.addRecords(records[i])
            }
        } else {
            var html = this.createRowHtml(records);
            this.pageDatas.push(records);
            this.treeGridJsonData[records["id"]] = records;
			var nextNode=this.getNextData(records)
			if(nextNode){
				this.getNodeById(nextNode.id).before($(html))
			}else{
				this.treeGridJQ.append($(html));
			}
			if(records.parentId)
				this.expandNode(records.parentId,true);
        }
    };

    Newtec.TreeGrid.prototype.updateRecords = function (params) {
    	var id= params["id"];
        var thisTR = this.newtecJQ.find("#" + params["id"]);
        var spanHtm=thisTR.find(".treegrid-expander").prop('outerHTML')
        var newHtml = this.createRowHtml(params);
		var data=this.treeGridJsonData[params["id"]];
		var sortKey=this.defaults.sortKey;
		var noSort=data!==params&&data[sortKey]==params[sortKey]||false;
        for(var key in params){
			data[key]=params[key];
		}
        console.info("==========>>>");
        newHtml=$(newHtml)
        newHtml.find(".treegrid-expander").prop('outerHTML',spanHtm)
		if(!noSort){
	        var nextNode=this.getNextData(params)
	    	if(nextNode){
	    		this.getNodeById(nextNode.id).before(newHtml)
	    	}else{
	    			this.treeGridJQ.append(newHtml);
    		}
        	//更新孩子位置
        	this.updateNodeW(id,newHtml);
	    }else{
			thisTR.after(newHtml)
		}
		thisTR.remove();
//        this.treeGridJQ.treegrid(this.treeGridSetting);
    };
    /**
     * 更新孩子位置
     * @param id 父id
     * @param tr 父元素（可空）
     */
    Newtec.TreeGrid.prototype.updateNodeW=function(id,tr){
    	if(!this.hasChild(id))return;
    	tr=tr||this.getNodeById(id);
    	var thisTR = this.newtecJQ.find(".treegrid-parent-" + id);//获取孩子
    	tr.after(thisTR);
    	var that=this;
    	thisTR.each(function(){
    		var newtr=$(this);
    		that.updateNodeW(newtr.attr('id'),newtr)
    		
    	})
    }
    
    Newtec.TreeGrid.prototype.removeRecords = function (params) {
    	var id=params["id"];
        var thisTR = this.newtecJQ.find(".treegrid-" + id);
        this.removeChildren(thisTR);
        this.removeChlidData(params)
		this.pageDatas.remove(this.treeGridJsonData[id])
		delete this.treeGridJsonData[id];
		console.info("========"+params.parentId)
		if(params.parentId&&!this.hasChild(params.parentId))
				this.removeParentTag(params.parentId);
      
    };
		Newtec.TreeGrid.prototype.removeParentTag=function(id){
			this.getNodeById(id).find(".treegrid-expander-expanded,.treegrid-expander-collapsed").removeClass("treegrid-expander-expanded treegrid-expander-collapsed");
		}
    Newtec.TreeGrid.prototype.removeChildren=function(trs){
    	for (var i=0;i<trs.length;i++) {
    		this.removeChildren(this.getChildNodes(trs[i]))
    	}
    	trs.remove();
    };
   
    /**
     * 设置数据
     * @param data
     * @param clear 默认值为true，false表示保留原来的旧数据，新的数据追加，true为清空数据再添加
     */
    Newtec.TreeGrid.prototype.setData = function (data, clear) {
        if (Newtec.Utils.isNull(clear) || clear == true) {
            this.treeGridJQ.empty();
        }
        
        if(!Newtec.Utils.isArray(data)||data.length==0)return;
        var defaults=this.defaults;
        var setDataBefore=defaults.setDataBefore;
        if(Newtec.Utils.isFunction(setDataBefore)){
        	var dealData=setDataBefore(data,clear);
        	if(Newtec.Utils.isArray(dealData))data=dealData;
        }
        if(data[0].sort!==undefined){//先进行简单的排序
        	data.sort(function(a,b){
        		return a.sort-b.sort;
        	})
        }
        var that = this;
        var html = "";
        var arr = this.transData(data, "id", "parentId", "children");
        this.pageJsonData = arr;
        this.tempHtml = "";
        this.recursion(arr);
        html = this.tempHtml;
//      console.info("----"+html)
        if (Newtec.Utils.isNull(clear) || clear == true) {
            that.pageDatas = data;
        } else {
            that.pageDatas.push(data);
        }

        this.treeGridJQ.append($(html));
        var setDataAfter=this.defaults.setDataAfter;
        if(Newtec.Utils.isFunction(setDataAfter)){
        	setDataAfter(data,clear);
        }
        if(this.first){
        	var that=this;
        	if(defaults.scrollBar.show){
    			var scrollBar=defaults.scrollBar;
    			console.info("==scrollBar",scrollBar);
    			setTimeout(function(){
    				that.newtecJQ.mCustomScrollbar({//设置滚动条
    					theme: scrollBar.theme,
    					axis:scrollBar.axis,
    					scrollInertia:scrollBar.scrollInertia
    				});
    			}, 100)
    		}
        	this.first=false;
        }
//      if(defaults.loadStepBS)this.setMyExpand()
    };
    /**
     * 方法说明：有序添加方法
     * @param {Object} datas 添加数据 ，必填
     * @param {Object} elem  参照节点 可空
     * @param {Object} isBefore 是否参入前面
     * @param {Object} noInit 是否初始化数据
     */
    Newtec.TreeGrid.prototype.setSortData=function(datas,elem,isBefore,noInit){
    	if(Newtec.Utils.isArray(datas)){
    		for(var i=0;i<datas.length;i++){
    			this.setSortData(datas[i],elem,isBefore,noInit)
    		}
    	}else{
    		this.pageDatas.push(datas);
    		this.tempHtml = "";
			var childs=this.getChildData(datas);
			this.removeRecords(datas);
			if(childs[0]){
				childs.insert(datas);
				this.recursion(childs);
			}else{
				this.recursion([datas]);
			}
			var parentId=datas.parentId;
			var nextNode=this.getNextData(datas)
			if(nextNode){
				this.getNodeById(nextNode.id).before(this.tempHtml)
			}else{
				this.treeGridJQ.append(this.tempHtml);
			}
			if(parentId)
				this.expandNode(parentId,true,false);
    	}
    }
    Newtec.TreeGrid.prototype.getData = function () {
    	var treeGridJsonData=this.treeGridJsonData;
    	var datas=[]
    	for(var key in treeGridJsonData){
    		var d=treeGridJsonData[key];
    		delete d.children
    		datas.push(d)
    	}
        return this.pageDatas;
    };

    Newtec.TreeGrid.prototype.setClickRecord = function (clickFunction) {
        this.clickRecord = clickFunction;
    };

    Newtec.TreeGrid.prototype.createTreeGrid = function () {
        this.treeGridId = Newtec.TreeGrid.prefix.treeGrid + Newtec.Utils.uuid16();
        var tableClass = Newtec.TreeGrid.prefix.treeGridDefaultClass + this.defaults.tableClass,
            tableStyle = this.defaults.tableStyle;
        if (this.defaults.showBorder == true) {
            tableClass += " table-bordered";
        }
        var html = "<table id='" + this.treeGridId + "' class='user-select " + tableClass + "' style='" + tableStyle + "'></table>";
        return $(html);
    };

    /**
     * 获取当前点击行的数据
     */
    Newtec.TreeGrid.prototype.getClickedRecord = function () {
        return this.clickedRecord;
    };

    /**
     * 设置点击函数
     */
    Newtec.TreeGrid.prototype.getSelectedRecords = function () {
    	 if(this.defaults.showCheckbox){
     		
     		var that = this;
     		var arr = [];
     		this.treeGridJQ.find("tr>td>.check-box.ok").each(function () {
     			var id = $(this).attr('id').replace(Newtec.TreeGrid.prefix.checkbox, "");
     			var json = that.treeGridJsonData[id];
     			arr.push(json);
     		});
     		return arr;
     	}else{
     		return this.clickedRecord
     	}
    };

    Newtec.TreeGrid.prototype.selectByData = function (data) {
    	if(this.defaults.showCheckbox)
	        if (Newtec.Utils.isArray(data)) {
	        	var newtecJQ=this.newtecJQ;
	            for (var i = 0; i < data.length; i++) {
	                var a = data[i];
	                newtecJQ.find("#" + Newtec.TreeGrid.prefix.checkbox + a["id"]).addClass('ok');
	            }
	        } else {
	            this.newtecJQ.find("#" + Newtec.TreeGrid.prefix.checkbox + data["id"]).addClass('ok');
	        }
	    else{
	    	if(Newtec.Utils.isArray(data)){
	    		console.error("单选不能选中多条数据");return;
	    	}
	    	this.clickedRecord=data;
	    	this.setTrbgById(data.id)
	    }
    };

    Newtec.TreeGrid.prototype.selectAll = function (selectAll) {
        if (selectAll === false) {
            this.treeGridJQ.find("tr>td>.check-box.ok").removeClass('ok');;
        } else {
            this.treeGridJQ.find("tr>td>.check-box").addClass('ok');
        }
    };

    Newtec.TreeGrid.prototype.addFollowButtons = function (buttonsParams) {
        if (this.defaults.showFollowButtons == true) {
            if (Newtec.Utils.isArray(buttonsParams)) {
                for (var i = 0; i < buttonsParams.length; i++) {
                    this.addFollowButtons(buttonsParams[i]);
                }
            } else {
                //这里建议使用图片
                var img = buttonsParams.img;
                var clickEvent = buttonsParams.click;
                var id = 'follow-button-' + Newtec.Utils.uuid16();
                var html = "<span id='" + id + "' class='follow-button'>";
                html += "<img src='" + img + "' />";
                html += "</span>";

                var thisFollowButton = $(html);
                thisFollowButton.on('click', function (e) {
                    e.stopPropagation();
                    alert('follow button click');
                });
                $('.follow-button-group').append(thisFollowButton);
            }
        }
    };

    /**
     * 初始化checkbox的事件
     */
    Newtec.TreeGrid.prototype.initCheckboxEvent = function () {
        var that = this;
        var treeGridJQ=that.newtecJQ;
        
        that.treeGridJQ.on("click", "tbody>tr>td>.check-box", function () {
            that.isCheckbox = true;
            var jq=$(this);
            var id = $(this).attr('id').replace(Newtec.TreeGrid.prefix.checkbox, "");
            var isCheck=!jq.hasClass("ok");
            if (isCheck) {
            	jq.addClass('ok')
                function setCheck(element) {
                    var ele = $(element),
                        l = that.getChildNodes(ele);
                    if (!Newtec.Utils.isNull(l)) {
                        l.each(function () {
                        	var jq=$(this).find(".check-box");
                        	if(jq.hasClass('no-click'))return;
                            jq.addClass('ok');
                            setCheck(this);
                        });
                    }
                }

                function setParentCheck(element) {
                    var ele = $(element),
                        l = that.getParentNode(ele);
                  
                    if (!Newtec.Utils.isNull(l)) {
                        l.each(function () {
                            var jq=$(this).find(".check-box");
                        	if(jq.hasClass('no-click'))return;
                            jq.addClass('ok');
                            setParentCheck(this);
                        });
                    }
                }

                //before check
                if (Newtec.Utils.isFunction(that.defaults.beforeCheck)) {
                    that.defaults.beforeCheck();
                }

                //check
                if (that.defaults.cascade == 1) {
                    setCheck(treeGridJQ.find("#" + id ));
                } else if (that.defaults.cascade == 2) {
                } else if (that.defaults.cascade == 3) {
                    setParentCheck(treeGridJQ.find("#" + id));
                } else if (that.defaults.cascade == 4) {
                    var bb = treeGridJQ.find("#" + id);
                    console.info("================"+that.treeGridId)
                    setCheck(bb);
                    setParentCheck(bb);
                }

                //after check
                if (Newtec.Utils.isFunction(that.defaults.afterCheck)) {
                    that.defaults.afterCheck();
                }
            } else {
            	jq.removeClass('ok')
                function setUnCheck(element) {
                    var ele = $(element),
                        l = that.getChildNodes(ele);
                    if (!Newtec.Utils.isNull(l)) {
                        l.each(function () {
                            //$(this).find("input[type='checkbox']").removeAttr("checked");
                             $(this).find(".check-box").removeClass('ok');
                            setUnCheck(this);
                        });
                    }
                }

                function setParentUnCheck(element) {
                    var ele = $(element),
                        l = that.getParentNode(ele);
                    if (!Newtec.Utils.isNull(l)) {
                        l.each(function () {
                           $(this).find(".check-box").removeClass('ok');
                            setParentUnCheck(this);
                        });
                    }
                }

                //before unCheck
                if (Newtec.Utils.isFunction(that.defaults.beforeUnCheck)) {
                    that.defaults.beforeUnCheck();
                }

                //unCheck
                if (that.defaults.cascade == 1) {
                    setUnCheck( treeGridJQ.find("#" +id));
                } else if (that.defaults.cascade == 2) {
                } else if (that.defaults.cascade == 3) {
                    setParentUnCheck( treeGridJQ.find("#" +id));
                } else if (that.defaults.cascade == 4) {
                    var bb =  treeGridJQ.find("#" + id);
                    setUnCheck(bb);
//                    setParentUnCheck(bb);
                }

                //after unCheck
                if (Newtec.Utils.isFunction(that.defaults.afterUnCheck)) {
                    that.defaults.afterUnCheck();
                }
            }
        });
    };

    /**
     * 初始化click事件
     */
    Newtec.TreeGrid.prototype.initClickEvent = function () {
        var that = this;
        that.treeGridJQ.on("click", "tr", function () {
        	console.info('-----initClickEvent>>>..');
            var thisTR = this;//当前点击的tr行
            var id = that.getNodeId(this);
            that.clickedRecord = that.treeGridJsonData[id];
            
            //这里我判断了是否有子节点，是通过判断是否拥有展开收缩的那个样式
            //虽然看下面我的if逻辑都是一样的，不排除以后可能针对处理
            that.setClickTrbg(thisTR);
            clearTimeout(that.clickTimer);
            that.clickTimer = setTimeout(function () {
//                if (that.isExpand == false && that.isCheckbox == false) {
                    var beforeClickFunction = that.defaults.beforeClick,
                        onClickFunction = that.defaults.onClick,
                        afterClickFunction = that.defaults.afterClick;
                    if (Newtec.Utils.isFunction(beforeClickFunction)) {
                        beforeClickFunction(thisTR);
                    }
                    if (Newtec.Utils.isFunction(onClickFunction)) {
                        onClickFunction(thisTR);
                    }
                    that.clickRecord();
                    if (Newtec.Utils.isFunction(afterClickFunction)) {
                        afterClickFunction(thisTR);
                    }
//                } else {
//                    that.isExpand = false;
//                    that.isCheckbox = false;
//                }
            }, 200);
        });
    };
    Newtec.TreeGrid.prototype.setTrbgById=function(id){
    	this.setClickTrbg(this.getNodeById(id));
    }
    Newtec.TreeGrid.prototype.setClickTrbg=function(thisTR){
    	var a = $(thisTR).find('span');
    	var that = this;
		if (a.hasClass(that.defaults.expanderExpandedClass) || a.hasClass(that.defaults.expanderCollapsedClass)) {
            that.treeGridJQ.find("tr").css("background-color", that.defaults.unSelectBackgroundColor).css('color', that.defaults.unSelectColor);
            $(thisTR).css("background-color", that.defaults.selectedBackgroundColor).css("color", that.defaults.selectedColor);
        } else {
            that.treeGridJQ.find("tr").css("background-color", that.defaults.unSelectBackgroundColor).css('color', that.defaults.unSelectColor);
            $(thisTR).css("background-color", that.defaults.selectedBackgroundColor).css("color", that.defaults.selectedColor);
        }
    }
    /**
     * 初始化double click事件
     */
    Newtec.TreeGrid.prototype.initDbClickEvent = function () {
        var that = this;
        that.treeGridJQ.on("dblclick", "tr", function () {
            var thisTR = this;//当前点击的tr行
            var id = that.getNodeId(this);
            that.clickedRecord = that.treeGridJsonData[id];
            that.treeGridJQ.find("tr").css("background-color", that.defaults.unSelectBackgroundColor).css('color', that.defaults.unSelectColor);
            $(thisTR).css("background-color", that.defaults.selectedBackgroundColor).css('color', that.defaults.selectedColor);
            clearTimeout(that.clickTimer);
            var beforeDbClickFunction = that.defaults.beforeDbClick,
                onDbClickFunction = that.defaults.onDbClick,
                afterDbClick = that.defaults.afterDbClick;
            if (Newtec.Utils.isFunction(beforeDbClickFunction)) {
                beforeDbClickFunction(thisTR);
            }
            if (Newtec.Utils.isFunction(onDbClickFunction)) {
                onDbClickFunction(thisTR);
            }
            if (Newtec.Utils.isFunction(afterDbClick)) {
                afterDbClick(thisTR);
            }
        });
    };

    Newtec.TreeGrid.prototype.initRightClickEvent = function () {
    	console.info("-------initRightClickEvent---"+this.rightMenuId)
		var that=this;
        var  a =this.treeGridJQ, menuTitle=this.defaults.menuTitle,rightClick=this.defaults.rightClick,
        menuClick=this.defaults.menuClick,menuClickBefore=this.defaults.menuClickBefore,rightMenuJQ=this.rightMenuJQ,crrTrThis=0;
        if (!Newtec.Utils.isNull(menuTitle)&&Newtec.Utils.isArray(menuTitle)) {

            var c='<ul class="dropdown-menu" style="position:static;display:block;" >';
            for (var i=0;i<menuTitle.length;i++) {
            	var m=menuTitle[i];
          		c+='<li><a data="'+m['name']+'">'+(m.icon&&'<i class="glyphicon '+m.icon+'"/>'||'')+m['title']+'</a></li>';
            }
            c+='</ul>';
//          var c='<ul class="dropdown-menu" style="position:static;display:block;" >'+
//		          '<li><a >Action</a></li>'+
//		          '<li><a >Another action</a></li>'+
//		          '</ul>';
            rightMenuJQ.append($(c));
            if (!Newtec.Utils.isNull(a[0])) {
 				a.on('contextmenu','>tbody>tr',function(e){
 					var tag = e.target || e.srcElement;
//                  console.log('右键菜单点击', tag);
                    crrTrThis=this;
                    var e = e || window.event;
                    that.setClickTrbg(crrTrThis);
                    //鼠标点的坐标
                    
                    var oX = e.clientX;
                    var oY = e.clientY;
                    //菜单出现后的位置
										var body=$('body');
										var bw=body.outerWidth();
										var bH=body.outerHeight();
										var w=rightMenuJQ.outerWidth();
										var h=rightMenuJQ.outerHeight();
										if(bH<h+oY)oY=bH-h;
										if(bw<w+oX)oX=bH-w;
                    rightMenuJQ.css({display:"block",left:oX + "px",top:oY + "px"})
                    //阻止浏览器默认事件
                    if(Newtec.Utils.isFunction(rightClick)){
                    	rightClick(e,that.treeGridJsonData[that.getNodeId(this)]);
                    }
                    return false;//一般点击右键会出现浏览器默认的右键菜单，写了这句代码就可以阻止该默认事件。
 				});
                $(document).on('click contextmenu',function(){
                	var e = e || window.event;
                    rightMenuJQ.css('display','none');
                })
                rightMenuJQ.click(function (e) {
                    var e = e || window.event;
                    e.cancelBubble = true;
                });
            }
            rightMenuJQ.on('click','>ul>li',function(e){
            	var a=$(this).find('a');
            	var name=a.attr('data');
            	var exData={name:name,title:a.html(),data:data};
//          	var  crrTr=$(crrTrThis);
				var id=that.getNodeId(crrTrThis);
            	that.clickedRecord=that.treeGridJsonData[id];
            	rightMenuJQ.css('display','none');
            	if(Newtec.Utils.isFunction(menuClickBefore)){
            		if(menuClickBefore(exData)===false)return;
            	}
            	if(name=='remove'){
            		var data=that.treeGridJsonData[id];
            		exData.data=data;
            		if(that.ds){
            			that.removeData(data,'',function(res){
            				if(res.status==0){
            					alert('删除成功');
            				}else{
            					alert('删除失败');
            				}
            			});
            		}else{
            			that.removeRecords({id:that.getNodeId(crrTrThis)});
            		}
            	}else if(name=='up'){
            		var data=that.nodeUp(crrTrThis);
            		if(Newtec.Utils.isNull(data))return
            		exData.data=data;
            	}else if(name=='down'){
            		var data=that.nodeDown(crrTrThis);
            		if(Newtec.Utils.isNull(data))return
            		exData.data=data;
            	}else if(name=='open'){
            		that.expandNode(id,true)
            	}else if(name=='close'){
            		that.expandNode(id,false)
            	}
            	
            	if(Newtec.Utils.isFunction(menuClick))menuClick(e,exData);
            });
        }
    };
    Newtec.TreeGrid.prototype.nodeUp=function(thisNode){
    	var id=this.getNodeId(thisNode);
    	var data=this.treeGridJsonData[id];var parentId=data.parentId;
    	var  crrTr=$(thisNode);
     	var child=this.getChildNodes(thisNode);
     	var child=this.getChildNodes(thisNode);
		var brother=this.getPreBrother(thisNode);
//		if(brother!=null)$(brother).before(crrTr);
		if(!brother)return;
		this.setSortData(data,brother,true)
		this.setTrbgById(id);
		return data;
    }
    Newtec.TreeGrid.prototype.nodeDown=function(thisNode){
    	var id=this.getNodeId(thisNode);
    	var data=this.treeGridJsonData[id];var parentId=data.parentId;
    	var  crrTr=$(thisNode);
		var child=this.getLastChlid(thisNode);
		if(child!=null)crrTr=$(child);
		crrTr=crrTr.next();
		if(!crrTr[0]){
			console.info('无法下移');return;
		}
		child=this.getLastChlid(crrTr[0]);
		var nextParentId=this.getParentNodeId(crrTr[0]);
		if((!(Newtec.Utils.isNull(nextParentId)&&Newtec.Utils.isNull(parentId)))
		&&(parentId!=nextParentId))return;
		if(child!=null)crrTr=$(child);
		this.setSortData(data,crrTr[0])
		return data;
    }
    Newtec.TreeGrid.prototype.getPreBrother=function(thisNode){
       var crrTr=$(thisNode);
       var data=this.treeGridJsonData[this.getNodeId(thisNode)];
       var parentId=data.parentId
       parentId=Newtec.Utils.isNull(parentId)?null:parentId;
       var tTr=crrTr.prev();
       if(!tTr[0])return null;
       var tData=this.treeGridJsonData[this.getNodeId(tTr[0])];
       var tParentId=tData.parentId;
        tParentId=Newtec.Utils.isNull(tParentId)?null:tParentId;
       if(tData.id==parentId)return null;
       while(parentId!=tParentId){
       	   tTr=$(".treegrid-"+tParentId);
       	   console.info(parentId+"----"+tParentId)
       	   tParentId=this.treeGridJsonData[this.getNodeId(tTr[0])].parentId;
       	   tParentId=Newtec.Utils.isNull(tParentId)?null:tParentId;
       }
       return tTr[0];
    }
    Newtec.TreeGrid.prototype.getLastChlid=function(thisNode){
    	var chlids=this.getChildNodes(thisNode);
    	var last=null;
    	while(chlids[0]){
    		last=chlids[chlids.length-1];
    		chlids=this.getChildNodes(last);
    	}
    	return last;
    }
    Newtec.TreeGrid.prototype.getAllChlid=function(thisNode){
    	var allChids=[];
    	var chlids=this.getChildNodes(thisNode);
    	var last=null;
    	while(chlids[0]){
    		allChids.pushs(chlids);
    		last=chlids[chlids.length-1];
    		chlids=this.getChildNodes(last);
    	}
    	return allChids;
    }
    /**
     * json格式转树状结构
     * @param a json数据
     * @param idStr id的字符串
     * @param pidStr 父id的字符串
     * @param chindrenStr children的字符串
     * @returns {Array} 数组
     */
    Newtec.TreeGrid.prototype.transData = function (a, idStr, pidStr, chindrenStr) {
        var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP&&hashVP!=-1) {
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            } else {
                r.push(aVal);
            }
        }
        return r;
    };

    /**
     * 递归生成html
     * @param a json数组
     */
    Newtec.TreeGrid.prototype.recursion = function (a) {
    	var loadStepBS=this.defaults.loadStepBS
    	var defaults=this.defaults;
    	var expand=defaults.expand;
    	var treeGridJsonData=this.treeGridJsonData;
    	if(expand)
	        for (var i = 0; i < a.length; i++) {
	            var b = a[i];
	            var id=b.id;
	            treeGridJsonData[id] = b;
	            this.tempHtml += this.createRowHtml(b);
	            if (b["children"]) {
	                this.recursion(b["children"]);
	            }
	        }
	    else{
	    	for (var i = 0; i < a.length; i++) {
	            var b = a[i];
	            var id=b.id;
	            treeGridJsonData[id] = b;
	            this.tempHtml += this.createRowHtml(b,true,treeGridJsonData[b["parentId"]]!=undefined);
	            if (b["children"]) {
	                this.recursion(b["children"]);
	            }
	        }
	    }
    };

    /**
     * 创建表格行的html
     */
    Newtec.TreeGrid.prototype.createRowHtml = function (params,close,hidden) {
    	var defaults=this.defaults,
    	isNowrap=defaults.isNowrap;
        showCheckbox =defaults.showCheckbox,
            showIcon =defaults.showIcon,
            showBorder =defaults.showBorder,
            prefix_checkbox = Newtec.TreeGrid.prefix.checkbox,
            prefix_icon = Newtec.TreeGrid.prefix.icon;
        var trClass =defaults.trClass,
            trStyle =defaults.trStyle,
            tdClass = defaults.tdClass,
            tdStyle = defaults.tdStyle,
            checkboxClass =defaults.checkboxClass,
            checkboxStyle = defaults.checkboxStyle,
            iconClass = defaults.iconClass,
            iconStyle = defaults.iconStyle,
            loadStepBS=defaults.loadStepBS,
            isMyExpand=defaults.isMyExpand;
        if (params.trClass) trClass += params.trClass;
        if (params.trStyle) trStyle += params.trStyle;
        if (params.tdClass) tdClass += params.tdClass;
        if (params.tdStyle) tdStyle += params.tdStyle;
        if (params.checkboxClass) checkboxClass += params.checkboxClass;
        if (params.checkboxStyle) checkboxStyle += params.checkboxStyle;
        if (params.iconClass) iconClass += params.iconClass;
        if (params.iconStyle) iconStyle += params.iconStyle;
        if(isNowrap)tdClass+=" nowrap";
		if(hidden)trStyle+=";display:none";
        var id=params['id'],parentId=params['parentId'];
        var tagNum=this.expandNum[parentId]||0;
        this.expandNum[id]=tagNum+1;
        var tr_class = trClass + 'treegrid-' + params['id'];
        if (params['parentId']) {
            tr_class += ' treegrid-parent-' + params['parentId'];
        }
        //--------20109-03-20 15:30:00 吴明坤- begin
        var hasChild=loadStepBS&&((Newtec.Utils.isFunction(isMyExpand)&&isMyExpand(params))||Newtec.Utils.isTrue(params['isFolder']));
        if ((!Newtec.Utils.isNull(params['children']) && params['children'].length>0)||hasChild) {
            tr_class += ' is-tree-parent';
        } else {
            tr_class += ' is-tree-child';
        }
        if (this.defaults.showBorder == false) {
            tdStyle += ' border:none;';
        }
        
        //--------20109-03-20 15:30:00 吴明坤- end
        var html = "";
        html += "<tr id='"+id+"' class='" + tr_class + "' style='color:" + this.defaults.unSelectColor + ";background-color:" + this.defaults.unSelectBackgroundColor + ";" + trStyle + "'>\n";
        html += "<td class='" + tdClass +" "+ (hasChild?"has-childs":"")+"' style='" + tdStyle + "'>\n";
        while(tagNum--){
        	html+="<span class='treegrid-indent'></span>"
        }
        html+="<span class='treegrid-expander "+(params['children']&&(close&&"treegrid-expander-collapsed"||"treegrid-expander-expanded")||((hasChild)&&"treegrid-expander-collapsed is-has-child")||"")+"'>" +
        		"<img src='"+serverUrl+"myqdp/images/tree/"+(close?"expand.png":"collapse.png")+"'/>" +
        		"</span>";
//      if (showCheckbox) {
//          html += "<input type='checkbox' id='" + prefix_checkbox + "" + params['id'] + "' class='" + checkboxClass + "' style='" + checkboxStyle + "'/>\n";
//      }
		if (showCheckbox) {
			var isCanSelectFun=defaults.isCanSelectFun;
			var classN=Newtec.Utils.isFunction(isCanSelectFun)&&isCanSelectFun(params)===false&&"no-click"||""
	        html += "<span id='" + prefix_checkbox + "" + params['id'] + "' class='check-box "+classN+"'><span class='item'></span></span>\n";
	      }
        if (showIcon) {
            if (this.defaults.iconType == 1) {
                html += "<i class='" + iconClass + " " + params['fontIcon'] + "' style='margin-right:5px;" + iconStyle + "'></i>";
            } else {
                if (!Newtec.Utils.isNull(params['icon'])) {
                    //增加的一个参数，从后台传过来的node数据是没有showIcon的
                    //我这里通过showIcon来控制个别图标的显隐
                    if (params['showIcon'] == false) {
                    } else {
                        html += "<img class='" + iconClass + "' style='" + iconStyle + "' src='"+(defaults.frontImgUrl||"") + params['icon'] + "'/>\n";
                    }
                }
            }
        }
        var value=params["name"];
        var tdValueHtmlFun=defaults.tdValueHtmlFun;
        value=Newtec.Utils.isFunction(tdValueHtmlFun)?tdValueHtmlFun(name,value,params):value
        html += "<span id='text_" + params["id"] + "' "+(isNowrap?"title='"+value+"'":"")+">" + value+ "</span>\n";

        html += "<span class='pull-right follow-button-group'>";
        // html += "<span class='follow-button'><i class='fa fa-plus'></i></span>";
        // html += "<span class='follow-button'><img src='myqdp/images/system/menu/power/2.png' alt='' width='16' height='16'></span>";
        // html += "<span class='follow-button'><button type='button' class='btn btn-primary btn-xs'>添加</button></span>";
        html += "</span>";

        html += "</td>\n";
        
        var displayName=defaults.displayName;
        if(displayName)
	        for (var i=0;i<displayName.length;i++) {
	        	var key=displayName[i];
	        	value=params[key];
	        	value=Newtec.Utils.isFunction(tdValueHtmlFun)?tdValueHtmlFun(key,value,params):value;
	            html += "<td class='" + tdClass + "' style='" + tdStyle + "' "+(isNowrap?"title='"+value+"'":"")+">" + (value||"") + "</td>\n";
	        }
        if (this.defaults.showFunctionButtons) {
            html += '<td>';
            html += '  <div class="btn-group btn-group-xs" role="group" aria-label="...">';
            html += '    <button class="btn btn-success treegrid-add" data-id="' + params['id'] + '">增加</button>';
            html += '    <button class="btn btn-primary" data-id="' + params['id'] + '">更新</button>';
            html += '    <button class="btn btn-danger" data-id="' + params['id'] + '">删除</button>';
            html += '  </div>';
            html += '</td>';
        }
        html += "</tr>\n";
        return html;
    };

    //========================================
    //=====数据增删改 start
    //========================================
	Newtec.TreeGrid.prototype.expandAll= function (isOpen) {
		isOpen=isOpen!==false
		var src=serverUrl+"myqdp/images/tree/";
			if(isOpen){
				var jq=this.newtecJQ.find('.treegrid-expander-collapsed')
				jq.find("img").attr('src',src+'collapse.png');
				jq.removeClass("treegrid-expander-collapsed").addClass("treegrid-expander-expanded");
				this.newtecJQ.find("tbody>tr").css("display",'');
			}else{//收起
				var jq=this.newtecJQ.find('.treegrid-expander-expanded')
				jq.find("img").attr('src',src+'expand.png');
				jq.removeClass("treegrid-expander-expanded").addClass("treegrid-expander-collapsed");
				var trJq=this.newtecJQ.find("tbody>tr");
				trJq.css("display",'none')
				var pageDatas=this.pageDatas;
				var treeGridJsonData=this.treeGridJsonData;
				for(var i=0;i<pageDatas.length;i++){
					 var data=pageDatas[i]
					 if(!treeGridJsonData[data.parentId]){
						 this.getNodeById(data.id).css("display","")
					 }
				}
			}
       
    };
    Newtec.TreeGrid.prototype.addExpand= function (id) {
		this.getNodeById(id).find(".treegrid-expander").addClass("treegrid-expander-expanded")
    };
    Newtec.TreeGrid.prototype.expand= function (thidNode,isOpen) {
		this.expandNode(this.getNodeId(thidNode),isOpen)
    };
    var count=0;
    Newtec.TreeGrid.prototype.expandNode= function (id,isOpen,noLoad) {
       var jq=this.getNodeById(id).find('.treegrid-expander');
		isOpen&&jq.removeClass("treegrid-expander-collapsed").addClass("treegrid-expander-expanded")
		||jq.removeClass("treegrid-expander-expanded").addClass("treegrid-expander-collapsed");
//		var datas=this.getChildData({id:id});
		var newtecJQ=this.newtecJQ;
		var treeGridJsonData=this.treeGridJsonData;
		var that=this;
		var src=serverUrl+"myqdp/images/tree/";
		if(isOpen){
			jq.find("img").attr('src',src+'collapse.png');
			for(var key in treeGridJsonData){
				var data=treeGridJsonData[key];
				if(data.id==id)continue;
				if(data.parentId==id){
					_openNode(data.id,isOpen,this)
				}
			}
		}else{
			jq.find("img").attr('src',src+'expand.png');
			var datas=this.getChildData({id:id});
			for(var i=0,len=datas.length;i<len;i++){
				var data=datas[i];
				_openNode(data.id,isOpen,this)
			}
		}
		noLoad=noLoad===false?false:true
		if(isOpen&&jq.hasClass('is-has-child')&&noLoad){
			console.warn("逐级添加")
//			count++;
//			if(count>10)return;
			jq.removeClass('treegrid-expander-expanded');
			var data=this.treeGridJsonData[id]
			this.fetchData({relCallback:function(res){
    			var datas=res.data;
    			if(Newtec.Utils.isArray(datas)&&datas.length>0){
    				//console.info("------2131--???"+myExpandData);
    				data['children']=datas;
    				that.setSortData(datas,null,null,true)
    			}else{
    				jq.removeClass('treegrid-expander-expanded');
    			}
    			
			},data:{thisNodeId:id}})
		}
		
    };
    function _openNode(id,isOpen,treeThis){
    	var trJq=treeThis.newtecJQ.find('#'+id);
    	if(isOpen){
			trJq.css("display","")
//			trJq.find(".treegrid-expander-collapsed").removeClass("treegrid-expander-collapsed")
//			.addClass("treegrid-expander-expanded")
		}else{
			trJq.css("display",'none')
			trJq.find(".treegrid-expander-expanded").removeClass("treegrid-expander-expanded")
			.addClass("treegrid-expander-collapsed")
		}
    }
    /**
     * 创建一个表单
     */
    Newtec.TreeGrid.prototype.addDataForm = function (value) {
        var that = this;
        var formParams = {
            // appendTo: '',
            ds: that.ds,
            titleColumn: 3,
            columnNum: 1,
            operType: Newtec.DS.OperType.add,
            values: value
        };
        var addForm = Newtec.Form.create(formParams);
        return addForm;
    };

    /**
     * 创建一个弹窗，并显示表单
     */
    Newtec.TreeGrid.prototype.addDataWindow = function (value) {
        var addForm = this.addDataForm(value);
        var windowParams = {
            title: 'add',
            width: 450,
            body: addForm
        };
        Newtec.Window.create(windowParams);
    };

    /**
     * 创建一个表单
     */
    Newtec.TreeGrid.prototype.updateDataForm = function () {
    };

    /**
     * 创建一个弹窗，并显示表单
     */
    Newtec.TreeGrid.prototype.updateDataWindow = function () {
    };

    /**
     * 添加同级
     */
    Newtec.TreeGrid.prototype.addEqual = function (parentNodeData) {
        var that = this;
        var value = {
            parentId: parentNodeData.id
        };
        that.addDataWindow(value);
    };

    //========================================
    //=====数据增删改 end
    //========================================

    //========================================
    //=====美化相关 end
    //========================================

    /**
     * 修改TreeGrid颜色
     * @param selectedBackgroundColor 选中时的背景颜色，不修改请传入空字符串
     * @param selectedColor 选中时的颜色，不修改请传入空字符串
     * @param unSelectBackgroundColor 取消选中时的背景颜色，不修改请传入空字符串
     * @param unSelectColor 取消选中时的颜色，不修改请传入空字符串
     */
    Newtec.TreeGrid.prototype.changeColor = function (selectedBackgroundColor, selectedColor, unSelectBackgroundColor, unSelectColor) {
        var a = this.treeGridJQ.find("tr");
        if (!Newtec.Utils.isNull(selectedBackgroundColor)) {
            this.defaults.selectedBackgroundColor = selectedBackgroundColor;
        }
        if (!Newtec.Utils.isNull(selectedColor)) {
            this.defaults.selectedColor = selectedColor;
        }
        if (!Newtec.Utils.isNull(unSelectBackgroundColor)) {
            this.defaults.unSelectBackgroundColor = unSelectBackgroundColor;
            a.css("background-color", unSelectBackgroundColor)
        }
        if (!Newtec.Utils.isNull(unSelectColor)) {
            this.defaults.unSelectColor = unSelectColor;
            a.css('color', unSelectColor);
        }

        // $(thisTR).css("background-color", that.defaults.selectedBackgroundColor).css("color", that.defaults.selectedColor);
    };

    //========================================
    //=====美化相关 end
    //========================================

    //=====以下是jQuery TreeGrid public methods
  	Newtec.TreeGrid.prototype.isNodeExpand = function (id) {
        return this.getNodeById(id).find(".treegrid-expander-expanded")[0]!=undefined;
    };
    Newtec.TreeGrid.prototype.getRootNodes = function () {
        return this.newtecJQ.find("tbody>tr:first-child");
    };

    Newtec.TreeGrid.prototype.getNodeId = function (thisNode) {
        return $(thisNode).attr("id");
    };

    Newtec.TreeGrid.prototype.getParentNodeId = function (thisNode) {
    	var jq=$(thisNode);
    	console.info("getParentNodeId===",jq[0])
    	if(!jq[0])return null;
        return this.treeGridJsonData[jq.attr('id')].parentId;
    };

    Newtec.TreeGrid.prototype.getAllNodes = function () {
        return this.newtecJQ.find('tbody>tr');
    };

    Newtec.TreeGrid.prototype.getParentNode = function (thisNode) {
    	console.warn("---getParentNode",thisNode);
    	var parentId=this.getParentNodeId(thisNode)
        return parentId&&this.getNodeById(parentId);
    };
	Newtec.TreeGrid.prototype.getNodeById= function(id){
		return this.newtecJQ.find('#'+id);	
	}
    Newtec.TreeGrid.prototype.getChildNodes = function (thisNode) {
    	var jq=$(thisNode);
    	var id=jq.attr("id");
    	var datas=this.getChildData({id:id})
    	var arr=$("#sadfsadfsaf");
//    	console.info("=====datas=>>>>>",datas);
    	var newtecJQ=this.newtecJQ;
    	for (var i=0,len=datas.length;i<len;i++) {
    		arr.push(newtecJQ.find('#'+datas[i].id))
    	}
//    	console.info("=====arr=>>>>>",arr);
    	return arr;
//      return $(thisNode).treegrid('getChildNodes');
    };

    Newtec.TreeGrid.prototype.getDepth = function (thisNode) {
        return $(thisNode).treegrid('getDepth');
    };
    //========================================
    //=====处理树数据
    /**
     * 
     * @param {Object} data
     */
    Newtec.TreeGrid.prototype.getBotherNodes=function(data){
    	var arr=[];
    	var id=data.id;
    	var treeGridJsonData=this.treeGridJsonData
    	for(var key in treeGridJsonData){
    		var d=treeGridJsonData[key];
    		if(d.parentId==id){
    			arr.push(d);
    			var c=this.getChildData(d)
    			if(c[0]){
    				arr.pushs(c);
    			}
    		}
    	}
    	return arr;
    }
    /**
     * 获取目标节点的孩子所有数据
     * @param {Object} data
     */
    Newtec.TreeGrid.prototype.getChildData=function(data){
    	var arr=[];
    	var id=data.id;
//    	console.info("===getChildData<<",data);
    	var treeGridJsonData=this.treeGridJsonData
//    	console.info("===getChildData<<",treeGridJsonData);
    	for(var key in treeGridJsonData){
    		var d=treeGridJsonData[key];
//    		console.info(d.parentId,"=====",id);
    		if(d.parentId==id){
//    			console.info(d,"==1212211212===",id);
    			arr.push(d);
    			var c=this.getChildData(d)
    			if(c[0]){
    				arr.pushs(c);
    			}
    		}
    	}
    	return arr;
    }
    Newtec.TreeGrid.prototype.removeChlidData=function(data){
    	var id=data.id;
    	var treeGridJsonData=this.treeGridJsonData;
    	for(var key in treeGridJsonData){
    		var d=treeGridJsonData[key];
    		if(d.parentId==id){
    			this.removeChlidData(d)
    			delete treeGridJsonData[key];
    			
    		}
    	}
    }
    Newtec.TreeGrid.prototype.empty=function(){
    	this.treeGridJsonData={};
    	this.treeGridJQ.empty();
    }
    Newtec.TreeGrid.prototype.getNodebyData=function(data){
    	return this.newtecJQ.find('#'+data['id'])[0];
    }
    Newtec.TreeGrid.prototype.treeToArray=function(){
    	var nodes=this.getAllNodes();
    	var that=this;
    	var arr=[];
    	nodes.each(function(){
    		var id=that.getNodeId(this);
    		arr.push(that.treeGridJsonData[id])
    	});
    	return arr;
    }
    //按排序获取上一个节点位置
    Newtec.TreeGrid.prototype.getNextData=function(data){
    	var sortKey=this.defaults.sortKey
    	if(data[sortKey]==null||data[sortKey]==undefined)return;
    	var crrId=data.id;
			var parentId=data.parentId
    	var pageDatas=this.pageDatas;
    	var sort= data[sortKey];
    	if(!pageDatas||pageDatas.length==0)return null;
    	//获取比该节点序号小的孩子
    	var perNode=null,tagSort=1000000;
    	for(var i=0,len=pageDatas.length;i<len;i++){
    		var node=pageDatas[i]
				var nodeSort=node[sortKey];
    		if(crrId!=node.id&&node.parentId==parentId&&nodeSort>=sort&&nodeSort<tagSort){
    			tagSort=nodeSort;
					perNode=node;
    		}
    	}
		while(perNode==null&&parentId){//获取不到孩子，获取父亲节点
			var parentData=this.treeGridJsonData[parentId]
			parentId=parentData.parentId;
			crrId=parentData.id;
			sort= parentData[sortKey];
			for(var i=0,len=pageDatas.length;i<len;i++){
				var node=pageDatas[i]
				var nodeSort=node[sortKey];
				if(crrId!=node.id&&node.parentId==parentId&&nodeSort>=sort&&nodeSort<tagSort){
					tagSort=nodeSort;
					perNode=node;
				}
			}
		}
			return perNode;
    }
		Newtec.TreeGrid.prototype.hasChild=function(id){
			var pageDatas=this.pageDatas;
			if(!pageDatas||pageDatas.length==0)return false;
			for(var i=0,len=pageDatas.length;i<len;i++){
				if(pageDatas[i].parentId==id)return true;
			}
			return false;
		}
     //========================================
    //=====处理树数据end
    Newtec.Module("TreeGrid")
})();