$(function () {
    	var top1=Newtec.Paragraph.create({
    		appendTo:'#test',title:'一、编写实体类',
    		content:'首先要在项目中新建一个实体类,在src下自定义包，新建一个实体类(<font class="greenfont">我的实例图中创建了TestPerson</font>)，项目结构如<font class="redfont">【图1-1】</font>，实体类如<font class="redfont">【图1-2】</font>',
    		imgs:[{src:"myqdp/images/demo/sysadmin/poject.png",title:'图1-1',class:'imgtag'},{src:"myqdp/images/demo/sysadmin/entity.png",title:'图1-2',class:'imgtag'}],
    	})
    	var top2=Newtec.Paragraph.create({
    		appendTo:'#test',title:'二、新建数据库',
    		content:'新建一个与实体类对应的数据库，字段与实体类一一对应，数据库名称为test_person,结果如如<font class="redfont">【图2-1】</font>所示',
    		imgs:[{src:"myqdp/images/demo/sysadmin/sql.png",title:'图2-1',class:'imgtag'}],		
    	})
    	var top3=Newtec.Paragraph.create({
    		appendTo:'#test',title:'三、数据源定义',
    		content:'界面的组件是通过数据源关联数据库，也是通过数据源来请求后台，所以需要先定义一个数据源',
    		steps:['在导航栏上跳转到<font class="redfont">《应用开发平台》</font>',
    		       '点击左侧菜单<font class="redfont">《数据源定义》</font>',
    		       '下拉框选择刚刚新建的应用，示例图片中选中测试系统',
    		       '点击右上方<font class="redfont">《添加》</font>，添加菜单，操作如下图<font class="redfont">【图3-1】</font>'],
    		imgs:[{src:"myqdp/images/demo/sysadmin/DataSource.png",title:'图3-1',class:'imgtag'}],		
    	})
    	Newtec.Paragraph.create({
    		appendTo:'#test',
    		content:'点击新增按钮后，弹出新增窗口，填写完信息，就可以绑定dmi层',
    		steps:['自定义<font class="redfont">《名称》</font>，实例图片中名称为test123',
    		       '填写<font class="redfont">《实体类》</font>，其中要输入实体类的全路径',
    		       '填写<font class="redfont">《表名》</font>，表名为实体类对应的数据库表',
    		       '状态选择启动'
    		       ,'自定义<font class="redfont">《DMI》</font>，实例图片中名称为testDMI,名称与项目中的dmi类同名'
    		       ,'映射主键填写id'
    		       ,'点击新增，创建一个数据源，操作如下图<font class="redfont">【图3-2】</font>'],
    		imgs:[{src:"myqdp/images/demo/sysadmin/addDataSource.png",title:'图3-2',class:'imgtag'}],		
    	})
    	var top4=Newtec.Paragraph.create({
    		appendTo:'#test',title:'四、同步数据源',
    		content:'新建完数据源后，由于数据源里没有字段，所以要为它添加字段信息',
    		steps:['在数据源定义的界面双击新增的数据源，<font class="greenfont">实例图片中选择test123的数据源</font>',
    		       '进入数据源的编辑界面',
    		       '点击右上角的<font class="redfont">《同步数据源》</font>'
    		       ,'数据源就会自动添加与实体类相同的字段，如下图<font class="redfont">【图4-1】</font>'],
    		imgs:[{src:"myqdp/images/demo/sysadmin/sysDataSource.png",title:'图4-1',class:'imgtag'}],		
    	})
    	var top5=Newtec.Paragraph.create({
    		appendTo:'#test',title:'五、编写dmi',
    		content:'需要编写一个dmi类来调用service层的方法',
    		steps:['dmi的名字与数据源中定义的同名，见图4-1中的dmi',
    		       '编写逻辑处理方法，对应的方法名为界面需要传入的参数，如下图<font class="redfont">【图5-1】</font>',
    		     ],
    		imgs:[{src:"myqdp/images/demo/sysadmin/dmi.png",title:'图5-1',class:'imgtag'}],		
    	})
    	var top6=Newtec.Paragraph.create({
    		appendTo:'#test',title:'六、编写service',
    		content:'编写一个service类来执行对应的sql语句',
    		steps:['获得从前端传进来的参数',
    		       '调用对应的方法执行sql语句，如下图<font class="redfont">【图6-1】</font>',
    		       ],
    		imgs:[{src:"myqdp/images/demo/sysadmin/service.png",title:'图6-1',class:'imgtag'}],		
    	})
    	var top7=Newtec.Paragraph.create({
    		appendTo:'#test',title:'七、js数据请求',
    		content:'HTML上的组件需要编写js来实现后台数据请求',
    		steps:['在HTML上有一个id为table的div，用来显示表格组件，如下图<font class="redfont">【图7-1】</font>',
    		       '在js文件中获得具体的数据源，实例图片中的数据源为test123',
    		       '使用表格组件，传入ds数据源参数',
    		       '调用fetchData方法传入的operID参数为dmi类中的方法名，如下图<font class="redfont">【图7-2】</font>'],
    		imgs:[{src:"myqdp/images/demo/sysadmin/html.png",title:'图7-1',class:'imgtag'},{src:"myqdp/images/demo/sysadmin/js.png",title:'图7-2',class:'imgtag'}],		
    	})
    	var top8=Newtec.Paragraph.create({
    		appendTo:'#test',title:'八、结果',
    		content:'上述操作完成后，就可以在界面使用表格组件实现数据请求，结果如【图8-1】所示',
    		imgs:[{src:"myqdp/images/demo/sysadmin/table.png",title:'图8-1',class:'imgtag'}],		
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
    		,{id:top7.id ,title:top7.defaults.title}
    		,{id:top8.id ,title:top8.defaults.title}
		]);
    });