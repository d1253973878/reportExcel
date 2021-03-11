$(function () {
		var top1=Newtec.Paragraph.create({
			appendTo:'#test',title:'一、资源管理',
			content:'资源管理首先需要选择一个应用，到《应用开发平台》选择，步骤如下',
			steps:[
		       '先打开轻量级开发系统，跳转到<font class="redfont">《应用开发平台》</font>',
		       '点击左侧菜单<font class="redfont">《 页面定义》</font>',
		       '就可打开《页面定义》页面,操作如下图<font class="redfont">【图1-1】</font>'
		    ],
		    imgs:[
		          {src:"myqdp/images/demo/sysadmin/resourceAllocation.png",title:'图1-1',class:'imgtag'}
		    ],
		});

    	Newtec.Paragraph.create({
    		appendTo:'#test',
    		content:' 鼠标移动到下拉列表控件上，弹出下拉选项，选择完对应系统，就可以进行资源管理，步骤如下',
    		steps:[
    		       '鼠标移动到<font class="redfont">下拉控件</font>',
    		       '在弹出的下拉选项中选择对应的系统，在表格中找到要修改的页面，如<font class="redfont">【图1-2】</font>',
    		       '选择后点击右上角的<font class="redfont">资源管理</font>按钮',
    		       '在弹出的弹窗控件中有五个标签页，选择对应的标签页，<font class="redfont">双击对应的数据</font>',
    		       '变为<font class="redfont">可编辑</font>状态，进行更改，如<font class="redfont">【图1-3】</font>',
    		       '更改完后，点击右上方的<font class="redfont">提交修改</font>按钮',
    		       '确认提交后，关闭弹窗控件，刷新页面，更换到对应的页面就能看到更改后的效果,如<font class="redfont">【图1-4】</font>'
    		],
    		imgs:[
    		      {src:"myqdp/images/demo/sysadmin/changeres.png",title:'图1-2',class:'imgtag'},
    		      {src:"myqdp/images/demo/sysadmin/changefinsh.png",title:'图1-3',class:'imgtag'},
    		      {src:"myqdp/images/demo/sysadmin/changefinsh2.png",title:'图1-4',class:'imgtag'},
    		],
    	});
  
    	var top2=Newtec.Paragraph.create({
    		appendTo:'#test', title:'二、资源分配',
    		content:'资源管理首先需要选择一个应用，到《统一权限平台》选择，步骤如下',
    		steps:[
    		       '先打开轻量级开发系统，跳转到<font class="redfont">《统一权限平台》</font>',
    		       '点击左侧菜单<font class="redfont">《角色管理》</font>中的<font class="redfont">《角色分配资源》</font>',
    		       '就可打开《角色分配资源》页面,操作如下图<font class="redfont">【图2-1】</font>'
    		],
    		imgs:[
    		      {src:"myqdp/images/demo/sysadmin/rolemanage.png",title:'图2-1',class:'imgtag'}
    		],
    	});
    	Newtec.Paragraph.create({
    		appendTo:'#test',
    		content:'鼠标移动到下拉列表控件上，弹出下拉选项，选择完对应系统，就可以进行资源分配，步骤如下',
    		steps:[
    		       '鼠标移动到<font class="redfont">下拉控件</font>',
    		       '在弹出的下拉选项中选择对应的系统，在左上方的表格中找到对应的角色，如<font class="redfont">【图2-2】</font>',
    		       '然后在右上方的表格中找到对应的页面，点击后就可以在该页面分配资源'
    		],
    		imgs:[{src:"myqdp/images/demo/sysadmin/roleallocation.png",title:'图2-2',class:'imgtag'}],
    	});
    	Newtec.Paragraph.create({
    		appendTo:'#test',
    		content:'选择完对应的页面后，在下方的表格就会发生变化',
    		steps:[
    		       '有五个标签页，分别对应不同的表格，选择对应的标签页',
    		       '就会看到对应的数据，有的数据已经被选中，有的数据没有被选中，如下图<font class="redfont">【图2-3】</font>',
    		       '选中的数据代表已经分配了，在该页面内已经被引用',
    		       '没有选中的数据代表还没有被引用',
    		       '修改完成后，就可以点击右上方的<font class="redfont">分配资源</font>按钮，进行修改'
    		],
    		imgs:[
    		      {src:"myqdp/images/demo/sysadmin/roleallocation2.png",title:'图2-3',class:'imgtag'},
    		],
    	})
    	var top3=Newtec.Paragraph.create({
    		appendTo:'#test',title:'三、结果',
    		content:'完成步骤后，即可成功分配资源',
    		steps:[
    		       '把图2-3中的新增数据的勾取消掉',
    		       '然后点击<font class="redfont">分配资源</font>按钮',
    		       '成功后，刷新页面，结果如下图<font class="redfont">【图3-1】</font>'
    		],
    		imgs:[{src:"myqdp/images/demo/sysadmin/allocationresult.png",title:'图3-1',class:'imgtag'}],
    	});
    	
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
		]);
 });