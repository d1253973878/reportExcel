	
	//菜单
	var newmenudesc = {
		"click":{name: 'click', type: 'function', need: '否', def: '', description: '点击菜单触发的方法', demo: 'click:function(){}'},
		"isMin":{name: 'isMin', type: 'boolean', need: '否', def: 'false', description: '是否显示缩小状态', demo: 'isMin:false'},
		"showIcon":{name: 'showIcon', type: 'boolean', need: '否', def: 'true', description: '是否显示图片', demo: 'showIcon:true'},
		"selectFirst":{name: 'selectFirst', type: '', need: '', def: '', description: '没有引用', demo: ''},
		"id":{name: 'id', type: 'string', need: '否', def: '自动生成', description: '使用uuid16自动生成的id，不是控件的属性,对控件本身没有影响', demo: ''},
	};
	//分页
	var pagindesc = {
		"total":{name: 'total', type: 'number', need: '否', def: '79', description: '数据的总条数', demo: 'total:79 '},
		"len":{name: 'len', type: 'number', need: '否', def: '5', description: '可显示的最大页数', demo: 'len:5'},
		"pages":{name: 'pages', type: 'array', need: '否', def: '[20,10,30,50]', description: '下拉菜单的选项', demo: 'pages:[10,20]'},
		"active":{name: 'active', type: 'string', need: '否', def: 'active', description: 'class的名称，修改选中按钮的样式', demo: 'active:"active"'},
		"style":{name: 'style', type: 'string', need: '否', def: '无', description: '分页控件的样式', demo: 'style:"border:1px solid #d3d3d3"'},
		"beginNum":{name: 'beginNum', type: 'number', need: '否', def: '1', description: '分页控件的开始数字', demo: 'beginNum:1'},
		"changedNum":{name: 'changedNum', type: 'number', need: '否', def: '2', description: '分页控件的自动改变的数量（与其他设置关联，改动后会有异常）', demo: 'changedNum:2'},
		"focusPage":{name: 'focusPage', type: 'number', need: '否', def: '1', description: '分页控件当前选中的页码', demo: 'focusPage:1'},
		"id":{name: 'id', type: 'string', need: '否', def: '自动生成', description: '使用uuid16自动生成的id，不是控件的属性,对控件本身没有影响', demo: ''},
	};
	//轮播
	var slideboxdesc = {
		"title":{name: 'title', type: 'string', need: '否', def: '无', description: '标题', demo: 'title: "质检信息资源综合应用服务系统" '},
		"style":{name: 'style', type: 'string', need: '否', def: '无', description: '样式', demo: 'style:"height:100%;"'},
		"width":{name: 'width', type: 'number', need: '否', def: '100', description: '宽度', demo: 'width:905'},
		"height":{name: 'height', type: 'number', need: '否', def: '100', description: '高度', demo: 'height:433'},
		"srcs":{name: 'srcs', type: 'array', need: '否', def: '无', description: '图片列表', demo: 'srcs:["http://wingwan.github.io/basic/images/slider/slider1.jpg","http://wingwan.github.io/basic/images/slider/slider2.jpg"]'},
	};
	
	var widgetnames = {
			"newmenu":newmenudesc,
			"pagin":pagindesc,
			"slidebox":slideboxdesc,
	};
	
	var showdescription = function(widgetname,field){
		var desc = widgetnames[widgetname][field];
		if(desc==undefined){
			desc={name: field, type: '', need: '', def: '', description: '', demo: ''};
		}
		return desc;
	};