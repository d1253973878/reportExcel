/**
 * 
 */
var AppParam = {
	goMainPage: "MainIndexServlet",//返回主页链接地址
	application: {
		pageHint: '在线报表设计',//进入应用系统的页面提示
		applicationTitle: "在线报表设计",//应用系统名称
		login: {
			title: '在线报表设计',//登陆页面的标题,可使用html标签
			logo: 'locksmith/images/icon/logo.png',//登陆页面的logo图标
			pageHint: '在线报表设计'//登陆页面链接页面提示
		},
		openPage: {
			"402880ce6d533cb0016d5c301e550002": {//appId
				id: "402880b963a44dcc0163a5f19fcd0000",//菜单id
				selectNode: true//是否打开首页的时候同时显示
			},
			"3MKJDDCPE083I19MXO6TWXAQX0AHJ5YC": {//appId
				id: "f949a60c542722fa01542775a529001b",//菜单id
				selectNode: true//是否打开首页的时候同时显示
			},
			"402880ec4125a17c014125bd48140003": {//appId
				id: "402880ec4125a17c014125d2b467000b",//菜单id
				selectNode: true//是否打开首页的时候同时显示
			},
		},
	},
	main: {//单点登录主页
		title: '<p></p>',//可使用html标签
		logo: 'index_img/logo.png',
		pageHint: '',
	},
	modules: [{
		name: 'RootPage',
		js: { js: 'newtec.rootpage.js', src: '/report/report/js/page/root/' }
	},{
		name: 'TreeTable',
		js: { js: 'lizard.treetable.js', src: '/report/report/js/widget/' }
	}],
	preJS: [{ js: "report.js", src: "report/js/" }]
}