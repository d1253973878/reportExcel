$(function () {
    //initContabs();
	
});

//初始化
function initContabs() {

    $('.J_menuItem').on('click', menuItem);

    $('.J_menuTabs').on('click', '.J_menuTab i', closeTab);

    $('.J_tabCloseOther').on('click', closeOtherTabs);

    $('.J_tabShowActive').on('click', showActiveTab);

    $('.J_menuTabs').on('click', '.J_menuTab', activeTab);

    $('.J_menuTabs').on('dblclick', '.J_menuTab', refreshTab);

    // 左移按扭
    $('.J_tabLeft').on('click', scrollTabLeft);

    // 右移按扭
    $('.J_tabRight').on('click', scrollTabRight);

    // 关闭全部
    $('.J_tabCloseAll').on('click', function () {
        $('.page-tabs-content').children("[data-id]").not(":first").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        $('.page-tabs-content').children("[data-id]:first").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').show();
            $(this).addClass("active");
        });
        $('.page-tabs-content').css("margin-left", "0");
    });
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

//var newtecTab;
//var newtecTabContent;
//var newtecTabs = {};
function menuItem(menuId) {
    // 获取标识数据
//    var id = $(this).attr('id');
	var id = menuId;
    var menuName = $.trim($(this).text());
    if (id == undefined || $.trim(id).length == 0)return ;
    var newTab = true;
    // 选项卡菜单已存在
    $('.J_menuTab').each(function () {//遍历已经打开的选项卡
        if ($(this).data('id') == id) {//找到点击菜单要打开的选项卡
        	console.log($(this).data('id')+"-------"+id+"==1。。。"+$(this).hasClass('active'));
            if (!$(this).hasClass('active')) {//打开的选项卡不是当前激活的
            	 var mainContentJQ =  $('.J_mainContent');
            	 //隐藏已经打开的
            	    var iframeJQs = mainContentJQ.find('iframe.J_iframe');
            	    var menuDivJQs = mainContentJQ.find('div.newtec_menu_div');
            	    iframeJQs.hide();
            	    menuDivJQs.hide();
                $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                scrollToTab(this);
                // 显示tab对应的内容区
                
                menuDivJQs.each(function () {
                	console.log($(this).data('id')+"-------"+id+"==3x");
                    if ($(this).data('id') == id) {
                    	console.log($(this).data('id')+"-------"+id+"==3");
//                        $(this).show().siblings('.newtec_menu_div').hide();
                    	$(this).show();
                        newTab = false;
                        return false;
                    }
                });
                
                if(newTab){
                	 iframeJQs.each(function () {
                     	alert($(this).data('id')+"-------"+id+"==2");
                         if ($(this).data('id') == id) {
//                             $(this).show().siblings('.J_iframe').hide();
                         	$(this).show();
                             newTab = false;
                             return false;
                         }
                     });
                }
            }
            newTab = false;
        }
    });


    // 选项卡菜单不存在
    if(newTab){
    	 var mainContentJQ =  $('.J_mainContent');
    	    var iframeJQs = mainContentJQ.find('iframe.J_iframe');
    	    var menuDivJQs = mainContentJQ.find('div.newtec_menu_div');
    	    iframeJQs.hide();
    	    menuDivJQs.hide();
    	//fa fa-times-circle
        $('.J_menuTab').removeClass('active');
        var menu = Newtec.menu[id];
        if(menu==undefined) return ;
        var type = menu.type;
        if(type=='url'){
        	alert('新开url');
        	   // 添加选项卡对应的iframe
            var str1 = '<iframe class="J_iframe" name="iframe' + id + '" width="100%" height="100%" src="' + menu.target + '" frameborder="0" data-id="' + id + '" seamless></iframe>';
//            $('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);
            mainContentJQ.append(str1);
        }else if(type='js'){
        	alert('新开js');
//          $('.J_mainContent').find('div.newtec_menu_div').hide().append("<div data-id='"+id+"' class='newtec_menu_div'>"+menu.target+"》"+menuName+"</div>");
        	mainContentJQ.append("<div data-id='"+id+"' class='newtec_menu_div'>"+menu.target+"》"+menuName+"</div>");
        }

        //显示loading提示
        // var loading = layer.load();
        //
        // $('.J_mainContent iframe:visible').load(function () {
        //     //iframe加载完成后隐藏loading提示
        //     layer.close(loading);
        // });
        // 添加选项卡
//        alert('点击菜单：'+Newtec.ds);
        var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + id + '">' + menuName + ' <i class="glyphicon glyphicon-remove-sign"></i></a>';
        $('.J_menuTabs .page-tabs-content').append(str);
    }
    scrollToTab($('.J_menuTab.active'));
}

// 关闭选项卡菜单
function closeTab() {
    var closeTabId = $(this).parents('.J_menuTab').data('id');
    var currentWidth = $(this).parents('.J_menuTab').width();

    // 当前元素处于活动状态
    if ($(this).parents('.J_menuTab').hasClass('active')) {

        // 当前元素后面有同辈元素，使后面的一个元素处于活动状态
        if ($(this).parents('.J_menuTab').next('.J_menuTab').size()) {

            var activeId = $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').data('id');
            $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').addClass('active');

            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == activeId) {
                    $(this).show().siblings('.J_iframe').hide();
                    return false;
                }
            });

            var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
            if (marginLeftVal < 0) {
                $('.page-tabs-content').animate({
                    marginLeft: (marginLeftVal + currentWidth) + 'px'
                }, "fast");
            }

            //  移除当前选项卡
            $(this).parents('.J_menuTab').remove();

            // 移除tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == closeTabId) {
                    $(this).remove();
                    return false;
                }
            });
        }

        // 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
        if ($(this).parents('.J_menuTab').prev('.J_menuTab').size()) {
            var activeId = $(this).parents('.J_menuTab').prev('.J_menuTab:last').data('id');
            $(this).parents('.J_menuTab').prev('.J_menuTab:last').addClass('active');
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == activeId) {
                    $(this).show().siblings('.J_iframe').hide();
                    return false;
                }
            });

            //  移除当前选项卡
            $(this).parents('.J_menuTab').remove();

            // 移除tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == closeTabId) {
                    $(this).remove();
                    return false;
                }
            });
        }
    }
    // 当前元素不处于活动状态
    else {
        //  移除当前选项卡
        $(this).parents('.J_menuTab').remove();

        // 移除相应tab对应的内容区
        $('.J_mainContent .J_iframe').each(function () {
            if ($(this).data('id') == closeTabId) {
                $(this).remove();
                return false;
            }
        });
        scrollToTab($('.J_menuTab.active'));
    }
    return false;
}

//关闭其他选项卡
function closeOtherTabs(){
    $('.page-tabs-content').children("[data-id]").not(":first").not(".active").each(function () {
        $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
        $(this).remove();
    });
    $('.page-tabs-content').css("margin-left", "0");
}

//滚动到已激活的选项卡
function showActiveTab(){
    scrollToTab($('.J_menuTab.active'));
}

// 点击选项卡菜单
function activeTab() {
    if (!$(this).hasClass('active')) {
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
    }
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
