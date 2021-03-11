Newtec.Component(["Newtec.SearchPage"])
console.info("==dd=>page>>")
$(function(){
	console.info("===>page>>",page)
	var page=Newtec.SearchPage.create({
		tableParam:{
			autoFetch:false,
			fields:[{name:'id',title:'id'},{name:'ids',title:'ids'}],
			datas:[{id:'ddddd',ids:'ddd'}]
		}
	})
	console.info("===>page>>",page)
//	var datas=[];
//	for(var i=0;i<20;i++){
//		datas.push({id:"sdfdfd"+i,name_12:'name'+i,title:"titleds"+i,addrrs:{province:"河北省",city:"唐山市",county:"路南区"}})
//	}
//	var table=Newtec.Table.create({
//		autoFetch: false,
//	    showHeader: false,
//	    showFetchForm: false,
//	    showFilter: false,
//	    showMoreBtn: false,
//	    showPagin: false,
//	    showFooter: false,
// 	    multSelect:false,
////	    canDraft:false,
//	    tdValueHtmlFun:function(tdValue,data,a,b,colName){
//	    	if(colName=='addrrs'){
//	    		var value="";
//	    		for(var key in tdValue){
//	    			value+=(tdValue[key]||"")
//	    		}
//	    		return value;
//	    	}
//	    	else return tdValue;
//	    },
//		ds:Newtec.DS.create("test"),/*is100Height:true,*/dbclickCanEdit:true,
//		fields:[{name:'id',title:"id",type:'datetime'},{name:'name_12',title:"name",type:"select",data:{id:'daf',name:'dsfsdf'}},
//		{name:'title',type:'radio',title:"title"},{name:'addrrs',type:'addressItem',title:"addrrs"}]
//	})
//	$('body').append(table.newtecJQ)
//	table.setData(datas)
//	$('body').append(Newtec.Button.create({
//		title:'选中',
//		click:function(){
//			console.info(table.getSelectedRecords());
//		}
//	}).newtecJQ)
//	$('body').append(Newtec.Button.create({
//		title:'添加',
//		click:function(){
//			table.addRecords({id:'dddddd===',name:'dddd',title:"dsfdsfd"},-1);
//		}
//	}).newtecJQ)
//	var form=Newtec.Form.create({
//		fields:[{title:'name1',name:'name1',type:'radio'},{title:'name2',name:'name2',type:'file'}]
//	})
//	$('body').append(form.newtecJQ)
	
})
