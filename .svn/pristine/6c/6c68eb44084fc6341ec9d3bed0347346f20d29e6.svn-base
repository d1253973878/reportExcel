$(function () {
		var top1=Newtec.Paragraph.create({
		appendTo:'#test',title:'一、创建应用',
		content:'系统创建首先需要新建一个应用，到应用开发平台创建，创建的系统管理员为创建人，步骤如下',
		steps:['先打开轻量级开发系统，跳转到<font class="redfont">《应用开发平台》</font>',
		       '点击左侧菜单<font class="redfont">《 应用系统定义》</font>',
		       '就可打开《应用系统定义》页面,操作如下图<font class="redfont">【图1-1】</font>'],
		imgs:[{src:"myqdp/images/demo/sysadmin/createapp.png",title:'图1-1',class:'imgtag'}],
		});

    	Newtec.Paragraph.create({
    		appendTo:'#test',
    		content:' 点击右上角的新增按钮，弹出新增应用的信息框，填写完对应信息，就可以新建一个应用，步骤如下',
    		steps:['自定义一个<font class="redfont">《应用名称》</font>，实例图片中名称为测试',
    		       '<font class="redfont">《菜单文件夹》</font>名称与项目中HTML文件存放文件夹名称相同(<font class="greenfont">没有则需新建</font>)，项目结构如<font class="redfont">【图1-2】</font>'
    		       ,'<font class="redfont">《应用状态》</font>选为启用'
    		       ,'填写<font class="redfont">《应用描述》</font>，为应用添加说明性描述'
    		       ,'<font class="redfont">《应用来源》</font>选择外部系统'
    		       ,'<font class="redfont">《权限级别》</font>默认选择菜单权限(<font class="greenfont">权限级别包含-菜单权限/字段权限/按钮权限-三种，分别代表三种不同的权限</font>)'
    		       ,'自定义<font class="redfont">《应用密码》</font>(<font class="greenfont">目前的密码没有作用</font>)'
    		       ,'点击新增按钮，就可以新增一个应用，操作如<font class="redfont">【图1-3】</font>'],
    		imgs:[{src:"myqdp/images/demo/sysadmin/pageIndex.png",title:'图1-2',class:'imgtag'},{src:"myqdp/images/demo/sysadmin/createApp1.png",title:'图1-3',class:'imgtag'}],
    	})
  
    	var top2=Newtec.Paragraph.create({
    		appendTo:'#test', title:'二、菜单定义',
    		content:'创建完应用后需要创建应用的菜单，即界面左边的导航栏，一个菜单绑定一个界面，一个界面代表一个html文件'+
    		'',
    		steps:['点击左侧菜单<font class="redfont">《菜单定义》</font>',
    		       '下拉框选择刚刚新建的应用，示例图片中选中测试系统',
    		       '点击右上方<font class="redfont">《添加》</font>，添加菜单，操作如下图<font class="redfont">【图2-1】</font>'],
    		imgs:[{src:"myqdp/images/demo/sysadmin/menu.png",title:'图2-1',class:'imgtag'}],
    	})
    	Newtec.Paragraph.create({
    		appendTo:'#test',
    		content:' 点击添加按钮后，弹出新增菜单信息窗口，新建的应用没有任何菜单，首先需要创建一个根目录（起始的节点），'+
    		'',
    		steps:['自定义名称，实例图片中名称为测试',
    		       '填写module属性，值为应用菜单文件夹名称（<font class="greenfont">详情见【图1-3】中的属性</font>），',
    		       '序号填写为0'
    		       ,'点击添加，为应用添加第一个节点，操作如下图<font class="redfont">【图2-2】</font>'],
    		imgs:[{src:"myqdp/images/demo/sysadmin/createMenu.png",title:'图2-2',class:'imgtag'}],
    	})
    	Newtec.Paragraph.create({
    		appendTo:'#test',
    		content:'创建完父节点后，就可以在父节点下创建子菜单</font>',
    		steps:['自定义名称，实例图片中名称为测试1',
    		       '父节点选择刚刚图3-2创建的父节点',
    		       '其中module为菜单文件夹中的子目录，content填写为html的文件名(<font class="greenfont">没有则需新建</font>)，项目结构如下图<font class="redfont">【图2-3】</font>'
    		       ,'序号填写为1'
    		       ,'点击添加，为应用添加子节点，操作如下图<font class="redfont">【图2-4】</font>'],
    		imgs:[{src:"myqdp/images/demo/sysadmin/pageIndex2.png",title:'图2-3',class:'imgtag'},{src:"myqdp/images/demo/sysadmin/createTwoMenu.png",title:'图2-4',class:'imgtag'}],
    	})
    	var top3=Newtec.Paragraph.create({
    		appendTo:'#test',title:'三、页面定义',
    		content:'一个应用至少需要一个定义一个页面',
    		steps:['点击左侧菜单<font class="redfont">《页面定义》</font>',
    		       '点击右上角的新增按钮，弹出信息框，',
    		       '填写窗口的信息，确认增加页面'
    		       ,'结果如下图<font class="redfont">【图3-1】</font>'],
    		imgs:[{src:"myqdp/images/demo/sysadmin/page.png",title:'图3-1',class:'imgtag'}],
    	})
    	
    	var top4=Newtec.Paragraph.create({
    		appendTo:'#test',title:'四、应用指定用户',
    		content:'为用户分配查看应用的权限，实例中的用户为系统超级用户'+
    		'',
    		steps:['在顶部导航栏上点击跳转到<font class="redfont">《统一权限平台》</font>，',
    		       '点击左侧菜单<font class="redfont">《应用指定用户》，</font>操作如下图<font class="redfont">【图4-1】</font>',
    		       '选择刚刚的应用，为它分配用户(<font class="greenfont">当前用户为系统超级用户，为应用分配当前用户</font>)，</font>操作过程如<font class="redfont">【图4-2】</font>'
    		       ],
    		imgs:[{src:"myqdp/images/demo/sysadmin/personApp.png",title:'图4-1',class:'imgtag'},{src:"myqdp/images/demo/sysadmin/appToPerson.png",title:'图4-2',class:'imgtag'}],
    	})
    	
    	var top5=Newtec.Paragraph.create({
    		appendTo:'#test',title:'五、用户分配菜单',
    		content:'对用户分配查看菜单的权限，实例中的用户为系统超级用户'+
    		'',
    		steps:['在《统一权限平台》上，点击左侧菜单<font class="redfont">《用户分配菜单》</font>',
    		       '下拉框选择刚刚新建的应用，示例图片中选中测试系统，操作如下图<font class="redfont">【图5-1】</font>',
    		       '选择用户，为它分配菜单，</font>操作过程如<font class="redfont">【图5-2】</font>'
    		       ],
    		imgs:[{src:"myqdp/images/demo/sysadmin/personMenu.png",title:'图5-1',class:'imgtag'},{src:"myqdp/images/demo/sysadmin/menuToPerson.png",title:'图5-2',class:'imgtag'}],
    	})
    	
    	var top6=Newtec.Paragraph.create({
    		appendTo:'#test',title:'六、结果',
    		content:'上述操作完成后，即成功自定义一个系统，结果如【图6-1】所示'+
    		'',
    		imgs:[{src:"myqdp/images/demo/sysadmin/result.png",title:'图6-1',class:'imgtag'}],
    	})
    	
    	var container=$('#link');
    	function setBtn(btns){
    		var html='',btn=0;
    		for ( var i = 0; i < btns.length; i++) {
    			btn=btns[i];
    			html+='<a href="#'+btn['id']+'" title="">'+btn['title']+'</a>';
			}
    		container.append(html);
    	}
    	setBtn([{id:top1.id,title:top1.defaults.title}
    		,{id:top2.id ,title:top2.defaults.title}
    		,{id:top3.id ,title:top3.defaults.title}
    		,{id:top4.id ,title:top4.defaults.title}
    		,{id:top5.id ,title:top5.defaults.title}
    		,{id:top6.id ,title:top6.defaults.title}
		]);
 });