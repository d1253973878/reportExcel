$(function () {
    //initContabs();
	
});

//初始化
function initContabs() {

	toMainTab();	
    $('.J_menuItem').on('click', menuItem);
    $('.J_menuTabs').on('click', '.J_menuTab', activeTab);//切换选项页
    $('.J_menuTabs').on('click', '.J_menuTab i', closeTab);//关闭选项页
    $('.J_tabCloseOther').on('click', closeOtherTabs);//关闭其他的选项页

    $('.J_tabShowActive').on('click', showActiveTab);
    $('.J_menuTabs').on('dblclick', '.J_menuTab', refreshTab);
    // 左移按扭
    $('.J_tabLeft').on('click', scrollTabLeft);
    // 右移按扭
    $('.J_tabRight').on('click', scrollTabRight);
    // 关闭全部
    $('.J_tabCloseAll').on('click', function () {
    	var i=0;
        for(var menuId in newtecTabOpen){
        	++i;
        	var tab = newtecTabOpen[menuId];
        	if(i == 1){
        		toMainTab();
        		continue;
        	}
        	removeTab(menuId);
        }
    });
}
function toMainTab(){
	toTab("newtecMain","主页xx");
}
//计算元素集合的总宽度
function calSumWidth(elements) {
    var width = 0;
    $(elements).each(function () {
        width += $(this).outerWidth(true);
    });
    return width;
}

//滚动到指定选项卡
function scrollToTab(element) {
    var marginLeftVal = calSumWidth($(element).prevAll()), marginRightVal = calSumWidth($(element).nextAll());
    // 可视区域非tab宽度
    var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
    //可视区域tab宽度
    var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
    //实际滚动宽度
    var scrollVal = 0;
    if ($(".page-tabs-content").outerWidth() < visibleWidth) {
        scrollVal = 0;
    } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
        if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
            scrollVal = marginLeftVal;
            var tabElement = element;
            while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                scrollVal -= $(tabElement).prev().outerWidth();
                tabElement = $(tabElement).prev();
            }
        }
    } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
        scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
    }
    $('.page-tabs-content').animate({
        marginLeft: 0 - scrollVal + 'px'
    }, "fast");	
}

//查看左侧隐藏的选项卡
function scrollTabLeft() {
    var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
    // 可视区域非tab宽度
    var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
    //可视区域tab宽度
    var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
    //实际滚动宽度
    var scrollVal = 0;
    if ($(".page-tabs-content").width() < visibleWidth) {
        return false;
    } else {
        var tabElement = $(".J_menuTab:first");
        var offsetVal = 0;
        while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
            offsetVal += $(tabElement).outerWidth(true);
            tabElement = $(tabElement).next();
        }
        offsetVal = 0;
        if (calSumWidth($(tabElement).prevAll()) > visibleWidth) {
            while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).prev();
            }
            scrollVal = calSumWidth($(tabElement).prevAll());
        }
    }
    $('.page-tabs-content').animate({
        marginLeft: 0 - scrollVal + 'px'
    }, "fast");
}

//查看右侧隐藏的选项卡
function scrollTabRight() {
    var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
    // 可视区域非tab宽度
    var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
    //可视区域tab宽度
    var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
    //实际滚动宽度
    var scrollVal = 0;
    if ($(".page-tabs-content").width() < visibleWidth) {
        return false;
    } else {
        var tabElement = $(".J_menuTab:first");
        var offsetVal = 0;
        while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
            offsetVal += $(tabElement).outerWidth(true);
            tabElement = $(tabElement).next();
        }
        offsetVal = 0;
        while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
            offsetVal += $(tabElement).outerWidth(true);
            tabElement = $(tabElement).next();
        }
        scrollVal = calSumWidth($(tabElement).prevAll());
        if (scrollVal > 0) {
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        }
    }
}
function menuItem() {
	toTab($(this).attr('id'));
}
var newtecTabActive;
var newtecTabContentActive;
var newtecTabOpen = {};
function toTab(menuId) {
    // 获取标识数据
//    var id = $(this).attr('id');
	var id = menuId;
    var menu = Newtec.menu[id];
    if(menu==undefined) return ;
    var menuName = menu.name;
    var newTab = true;
    // 选项卡菜单已存在
    
    var tab = newtecTabOpen[menuId];
    if(tab==undefined){//新打开
   	 var mainContentJQ =  $('.J_mainContent');
   	if(newtecTabContentActive != undefined)
   		newtecTabContentActive.hide();
   	if(newtecTabActive != undefined)
   		newtecTabActive.removeClass('active');
       var type = menu.type;
       if(type=='url'){
       	alert('新开url');
       	   // 添加选项卡对应的iframe
       	newtecTabContentActive = $('<iframe class="J_iframe" name="iframe' + id + '" width="100%" height="100%" src="' + menu.target + '" frameborder="0" data-id="' + id + '" seamless></iframe>');
           mainContentJQ.append(newtecTabContentActive);
       }else if(type='js'){
       	alert('新开js');
       	newtecTabContentActive = $("<div data-id='"+id+"' class='newtec_menu_div'>"+menu.target+"》"+menuName+"</div>");
       	mainContentJQ.append(newtecTabContentActive);
       	Newtec.EntityPage.create({}).newtecJQ.appendTo(newtecTabContentActive);//创建页面
       }

       //显示loading提示
      /*  var loading = layer.load();
        $('.J_mainContent iframe:visible').load(function () {
            //iframe加载完成后隐藏loading提示
            layer.close(loading);
        });*/
       // 添加选项卡
//       alert('点击菜单：'+Newtec.ds);
       var close = (id == 'newtecMain'? '':'&nbsp;<i class="glyphicon glyphicon-remove-sign"></i>');
       newtecTabActive = $('<a href="javascript:;" class="active J_menuTab" data-id="' + id + '">' + menuName + close+' </a>');
       $('.J_menuTabs .page-tabs-content').append(newtecTabActive);
       newtecTabOpen[id]={tab:newtecTabActive,content:newtecTabContentActive};
    }else{//已打开
    	if(tab.tab !=newtecTabActive){
           	newtecTabContentActive.hide();
           	newtecTabActive.removeClass('active');
    		newtecTabActive = tab.tab;
    		newtecTabContentActive = tab.content;
    		newtecTabContentActive.show();
           	newtecTabActive.addClass('active');
    	}
    }
    
    scrollToTab(newtecTabActive);
}

// 关闭选项卡菜单
function closeTab(event) {
	var menuId = $(this).parent().data('id');
	var tab = newtecTabOpen[menuId];
	if(tab != undefined){
		if(tab.tab == newtecTabActive){//关闭的是激活的选项卡必须重新激活一个
			toTab("newtecMain");
		}
		tab.tab.remove();
		tab.content.remove();
//		tab = undefined;
		newtecTabOpen[menuId] = undefined;
	}
	event.stopPropagation();//阻止事件传像父亲
}

//关闭其他选项卡
function closeOtherTabs(){
	var i=0;
    for(var menuId in newtecTabOpen){
    	++i;
    	var tab = newtecTabOpen[menuId];
    	if(i == 1 || tab.tab == newtecTabActive){
    		continue;
    	}
    	removeTab(menuId);
    }
}

function removeTab(menuId){
	var tab = newtecTabOpen[menuId];
	if(tab != undefined){
		tab.tab.remove();
		tab.content.remove();
//		tab = undefined;
		newtecTabOpen[menuId] = undefined;
		return true;
	}
	return false;
}

//滚动到已激活的选项卡
function showActiveTab(){
    scrollToTab($('.J_menuTab.active'));
}

// 点击选项卡菜单
function activeTab() {
   /* if (!$(this).hasClass('active')) {
        var currentId = $(this).data('id');
        // 显示tab对应的内容区
        $('.J_mainContent .J_iframe').each(function () {
            if ($(this).data('id') == currentId) {
                $(this).show().siblings('.J_iframe').hide();
                return false;
            }
        });
        $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
        scrollToTab(this);
    }*/
    toTab($(this).data('id'));
}

//刷新iframe
function refreshTab() {
    var target = $('.J_iframe[data-id="' + $(this).data('id') + '"]');
    var url = target.attr('src');
    //显示loading提示
    // var loading = layer.load();
    target.attr('src', url).load(function () {
        //关闭loading提示
        // layer.close(loading);
    });
}

function getActiveTab(){
	return $(".J_iframe:visible");
}

//打开选项卡菜单
function openTab(url,title, isNew){//isNew 为true时，打开一个新的选项卡；为false时，如果选项卡不存在，打开一个新的选项卡，如果已经存在，使已经存在的选项卡变为活跃状态。
	
	 // 获取标识数据
    var dataUrl = url,
        dataIndex ,
        menuName = title,
        flag = true;
    if (dataUrl == undefined || top.$.trim(dataUrl).length == 0)return false;
    
    if(!isNew){
		    top.$('.J_menuTab').each(function () {
		        if (top.$(this).data('id') == dataUrl) {// 选项卡已存在，激活。
		            if (!top.$(this).hasClass('active')) {
		            	top.$(this).addClass('active').siblings('.J_menuTab').removeClass('active');
		                scrollToTab(top.$(this));
		                // 显示tab对应的内容区
		                top.$('.J_mainContent .J_iframe').each(function () {
		                    if (top.$(this).data('id') == dataUrl) {
		                    	top.$(this).show().siblings('.J_iframe').hide();
		                        return false;
		                    }
		                });
		            }
		            flag = false;
		            return false;
		        }
		    });
    }
    
    if(isNew || flag){//isNew为true，打开一个新的选项卡； flag为true，选项卡不存在，打开一个新的选项卡。
            //fa fa-times-circle
	        var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="glyphicon glyphicon-remove-sign"></i></a>';
	        top.$('.J_menuTab').removeClass('active');
	
	        // 添加选项卡对应的iframe
	        var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
	        top.$('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);
	
	        //显示loading提示
	        // var loading = layer.load();
	
	        top.$('.J_mainContent iframe:visible').load(function () {
	            //iframe加载完成后隐藏loading提示
	            // layer.close(loading);
	        });
	        // 添加选项卡
	        top.$('.J_menuTabs .page-tabs-content').append(str);
	        scrollToTab(top.$('.J_menuTab.active'));
    	
    }
    return false;
	
}
