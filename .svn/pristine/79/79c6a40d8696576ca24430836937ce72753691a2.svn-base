/**
 * TODO 准备移除该文件，请不要再次使用
 */

if (typeof jQuery === 'undefined') {
    throw new Error('Ace\'s JavaScript requires jQuery')
}

/**
 Required. Ace's Basic File to Initiliaze Different Parts and Some Variables.
 */
//some basic variables
(function (undefined) {
    if (!('ace' in window)) window['ace'] = {}
    if (!('helper' in window['ace'])) window['ace'].helper = {}
    if (!('vars' in window['ace'])) window['ace'].vars = {}
    window['ace'].vars['icon'] = ' ace-icon ';
    window['ace'].vars['.icon'] = '.ace-icon';

    ace.vars['touch'] = ('ontouchstart' in window);//(('ontouchstart' in document.documentElement) || (window.DocumentTouch && document instanceof DocumentTouch));

    //sometimes the only good way to work around browser's pecularities is to detect them using user-agents
    //though it's not accurate
    var agent = navigator.userAgent
    ace.vars['webkit'] = !!agent.match(/AppleWebKit/i)
    ace.vars['safari'] = !!agent.match(/Safari/i) && !agent.match(/Chrome/i);
    ace.vars['android'] = ace.vars['safari'] && !!agent.match(/Android/i)
    ace.vars['ios_safari'] = !!agent.match(/OS ([4-9])(_\d)+ like Mac OS X/i) && !agent.match(/CriOS/i)

    ace.vars['ie'] = window.navigator.msPointerEnabled || (document.all && document.querySelector);//8-11
    ace.vars['old_ie'] = document.all && !document.addEventListener;//8 and below
    ace.vars['very_old_ie'] = document.all && !document.querySelector;//7 and below
    ace.vars['firefox'] = 'MozAppearance' in document.documentElement.style;

    ace.vars['non_auto_fixed'] = ace.vars['android'] || ace.vars['ios_safari'];
})();

(function ($, undefined) {
    //sometimes we try to use 'tap' event instead of 'click' if jquery mobile plugin is available
    ace['click_event'] = ace.vars['touch'] && $.fn.tap ? 'tap' : 'click';
})(jQuery);

//document ready function
jQuery(function ($) {
    enableSidebar();

    function enableSidebar() {
        //initiate sidebar function
        var $sidebar = $('.sidebar');
        if ($.fn.ace_sidebar) $sidebar.ace_sidebar();
        if ($.fn.ace_sidebar_scroll) $sidebar.ace_sidebar_scroll({
            //for other options please see documentation
            'include_toggle': false || ace.vars['safari'] || ace.vars['ios_safari'] //true = include toggle button in the scrollbars
        });
        if ($.fn.ace_sidebar_hover)    $sidebar.ace_sidebar_hover({
            'sub_hover_delay': 750,
            'sub_scroll_style': 'no-track scroll-thin scroll-margin scroll-visible'
        });
    }
});//jQuery document ready

//some ace helper functions
(function ($$, undefined) {//$$ is ace.helper
    $$.unCamelCase = function (str) {
        return str.replace(/([a-z])([A-Z])/g, function (match, c1, c2) {
            return c1 + '-' + c2.toLowerCase()
        })
    }
    $$.strToVal = function (str) {
        var res = str.match(/^(?:(true)|(false)|(null)|(\-?[\d]+(?:\.[\d]+)?)|(\[.*\]|\{.*\}))$/i);

        var val = str;
        if (res) {
            if (res[1]) val = true;
            else if (res[2]) val = false;
            else if (res[3]) val = null;
            else if (res[4]) val = parseFloat(str);
            else if (res[5]) {
                try {
                    val = JSON.parse(str)
                }
                catch (err) {
                }
            }
        }

        return val;
    }
    $$.getAttrSettings = function (elem, attr_list, prefix) {
        if (!elem) return;
        var list_type = attr_list instanceof Array ? 1 : 2;
        //attr_list can be Array or Object(key/value)
        var prefix = prefix ? prefix.replace(/([^\-])$/, '$1-') : '';
        prefix = 'data-' + prefix;

        var settings = {}
        for (var li in attr_list) if (attr_list.hasOwnProperty(li)) {
            var name = list_type == 1 ? attr_list[li] : li;
            var attr_val, attr_name = $$.unCamelCase(name.replace(/[^A-Za-z0-9]{1,}/g, '-')).toLowerCase()

            if (!((attr_val = elem.getAttribute(prefix + attr_name))  )) continue;
            settings[name] = $$.strToVal(attr_val);
        }

        return settings;
    }

    $$.scrollTop = function () {
        return document.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
    }
    $$.winHeight = function () {
        return window.innerHeight || document.documentElement.clientHeight;
    }
    $$.redraw = function (elem, force) {
        if (!elem) return;
        var saved_val = elem.style['display'];
        elem.style.display = 'none';
        elem.offsetHeight;
        if (force !== true) {
            elem.style.display = saved_val;
        }
        else {
            //force redraw for example in old IE
            setTimeout(function () {
                elem.style.display = saved_val;
            }, 10);
        }
    }
})(ace.helper);

/**
 <b>Sidebar functions</b>. Collapsing/expanding, toggling mobile view menu and other sidebar functions.
 */
(function ($, undefined) {
    var sidebar_count = 0;

    function Sidebar(sidebar, settings) {
        var self = this;
        this.$sidebar = $(sidebar);
        this.$sidebar.attr('data-sidebar', 'true');
        if (!this.$sidebar.attr('id')) this.$sidebar.attr('id', 'id-sidebar-' + (++sidebar_count))


        //get a list of 'data-*' attributes that override 'defaults' and 'settings'
        var attrib_values = ace.helper.getAttrSettings(sidebar, $.fn.ace_sidebar.defaults, 'sidebar-');
        this.settings = $.extend({}, $.fn.ace_sidebar.defaults, settings, attrib_values);


        //some vars
        this.minimized = false;//will be initiated later
        this.collapsible = false;//...
        this.horizontal = false;//...
        this.mobile_view = false;//


        this.vars = function () {
            return {'minimized': this.minimized, 'collapsible': this.collapsible, 'horizontal': this.horizontal, 'mobile_view': this.mobile_view}
        }
        this.get = function (name) {
            if (this.hasOwnProperty(name)) return this[name];
        }
        this.set = function (name, value) {
            if (this.hasOwnProperty(name)) this[name] = value;
        }


        this.ref = function () {
            //return a reference to self
            return this;
        }

        var toggleIcon = function (minimized) {
            var icon = $(this).find(ace.vars['.icon']), icon1, icon2;
            if (icon.length > 0) {
                icon1 = icon.attr('data-icon1');//the icon for expanded state
                icon2 = icon.attr('data-icon2');//the icon for collapsed state

                if (minimized !== undefined) {
                    if (minimized) icon.removeClass(icon1).addClass(icon2);
                    else icon.removeClass(icon2).addClass(icon1);
                }
                else {
                    icon.toggleClass(icon1).toggleClass(icon2);
                }
            }
        }

        var findToggleBtn = function () {
            var toggle_btn = self.$sidebar.find('.sidebar-collapse');
            if (toggle_btn.length == 0) toggle_btn = $('.sidebar-collapse[data-target="#' + (self.$sidebar.attr('id') || '') + '"]');
            if (toggle_btn.length != 0) toggle_btn = toggle_btn[0];
            else toggle_btn = null;

            return toggle_btn;
        }

        //collapse/expand button
        this.toggleMenu = function (toggle_btn, save) {
            if (this.collapsible) return;

            //var minimized = this.$sidebar.hasClass('menu-min');
            this.minimized = !this.minimized;

            try {
                //toggle_btn can also be a param to indicate saving to cookie or not?! if toggle_btn === false, it won't be saved
                ace.settings.sidebar_collapsed(sidebar, this.minimized, !(toggle_btn === false || save === false));//@ ace-extra.js
            } catch (e) {
                if (this.minimized)
                    this.$sidebar.addClass('menu-min');
                else this.$sidebar.removeClass('menu-min');
            }

            if (!toggle_btn) {
                toggle_btn = findToggleBtn();
            }
            if (toggle_btn) {
                toggleIcon.call(toggle_btn, this.minimized);
            }

            //force redraw for ie8
            if (ace.vars['old_ie']) ace.helper.redraw(sidebar);
        }
        this.collapse = function (toggle_btn, save) {
            if (this.collapsible) return;
            this.minimized = false;

            this.toggleMenu(toggle_btn, save);
        }
        this.expand = function (toggle_btn, save) {
            if (this.collapsible) return;
            this.minimized = true;

            this.toggleMenu(toggle_btn, save);
        }


        //collapse/expand in 2nd mobile style
        this.toggleResponsive = function (toggle_btn) {
            if (!this.mobile_view || this.mobile_style != 3) return;

            if (this.$sidebar.hasClass('menu-min')) {
                //remove menu-min because it interferes with responsive-max
                this.$sidebar.removeClass('menu-min');
                var btn = findToggleBtn();
                if (btn) toggleIcon.call(btn);
            }


            this.minimized = !this.$sidebar.hasClass('responsive-min');
            this.$sidebar.toggleClass('responsive-min responsive-max');


            if (!toggle_btn) {
                toggle_btn = this.$sidebar.find('.sidebar-expand');
                if (toggle_btn.length == 0) toggle_btn = $('.sidebar-expand[data-target="#' + (this.$sidebar.attr('id') || '') + '"]');
                if (toggle_btn.length != 0) toggle_btn = toggle_btn[0];
                else toggle_btn = null;
            }

            if (toggle_btn) {
                var icon = $(toggle_btn).find(ace.vars['.icon']), icon1, icon2;
                if (icon.length > 0) {
                    icon1 = icon.attr('data-icon1');//the icon for expanded state
                    icon2 = icon.attr('data-icon2');//the icon for collapsed state

                    icon.toggleClass(icon1).toggleClass(icon2);
                }
            }

            $(document).triggerHandler('settings.ace', ['sidebar_collapsed', this.minimized]);
        }

        //some helper functions
        this.is_collapsible = function () {
            var toggle
            return (this.$sidebar.hasClass('navbar-collapse'))
                && ((toggle = $('.navbar-toggle[data-target="#' + (this.$sidebar.attr('id') || '') + '"]').get(0)) != null)
                && toggle.scrollHeight > 0
            //sidebar is collapsible and collapse button is visible?
        }
        this.is_mobile_view = function () {
            var toggle
            return ((toggle = $('.menu-toggler[data-target="#' + (this.$sidebar.attr('id') || '') + '"]').get(0)) != null)
                && toggle.scrollHeight > 0
        }


        //toggling submenu
        this.$sidebar.on(ace.click_event + '.ace.submenu', '.nav-list', function (ev) {
            var nav_list = this;

            //check to see if we have clicked on an element which is inside a .dropdown-toggle element?!
            //if so, it means we should toggle a submenu
            var link_element = $(ev.target).closest('a');
            if (!link_element || link_element.length == 0) return;//return if not clicked inside a link element

            var minimized = self.minimized && !self.collapsible;
            //if .sidebar is .navbar-collapse and in small device mode, then let minimized be uneffective

            if (!link_element.hasClass('dropdown-toggle')) {//it doesn't have a submenu return
                //just one thing before we return
                //if sidebar is collapsed(minimized) and we click on a first level menu item
                //and the click is on the icon, not on the menu text then let's cancel event and cancel navigation
                //Good for touch devices, that when the icon is tapped to see the menu text, navigation is cancelled
                //navigation is only done when menu text is tapped

                if (ace.click_event == 'tap'
                    &&
                    minimized
                    &&
                    link_element.get(0).parentNode.parentNode == nav_list)//only level-1 links
                {
                    var text = link_element.find('.menu-text').get(0);
                    if (text != null && ev.target != text && !$.contains(text, ev.target)) {//not clicking on the text or its children
                        ev.preventDefault();
                        return false;
                    }
                }


                //ios safari only has a bit of a problem not navigating to link address when scrolling down
                //specify data-link attribute to ignore this
                if (ace.vars['ios_safari'] && link_element.attr('data-link') !== 'false') {
                    //only ios safari has a bit of a problem not navigating to link address when scrolling down
                    //please see issues section in documentation
                    document.location = link_element.attr('href');
                    ev.preventDefault();
                    return false;
                }

                return;
            }

            ev.preventDefault();


            var sub = link_element.siblings('.submenu').get(0);
            if (!sub) return false;
            var $sub = $(sub);

            var height_change = 0;//the amount of height change in .nav-list

            var parent_ul = sub.parentNode.parentNode;
            if
            (
                ( minimized && parent_ul == nav_list )
                ||
                ( ( $sub.parent().hasClass('hover') && $sub.css('position') == 'absolute' ) && !self.collapsible )
            ) {
                return false;
            }


            var sub_hidden = (sub.scrollHeight == 0)

            //if not open and visible, let's open it and make it visible
            if (sub_hidden) {//being shown now
                $(parent_ul).find('> .open > .submenu').each(function () {
                    //close all other open submenus except for the active one
                    if (this != sub && !$(this.parentNode).hasClass('active')) {
                        height_change -= this.scrollHeight;
                        self.hide(this, self.settings.duration, false);
                    }
                })
            }

            if (sub_hidden) {//being shown now
                self.show(sub, self.settings.duration);
                //if a submenu is being shown and another one previously started to hide, then we may need to update/hide scrollbars
                //but if no previous submenu is being hidden, then no need to check if we need to hide the scrollbars in advance
                if (height_change != 0) height_change += sub.scrollHeight;//we need new updated 'scrollHeight' here
            } else {
                self.hide(sub, self.settings.duration);
                height_change -= sub.scrollHeight;
                //== -1 means submenu is being hidden
            }

            //hide scrollbars if content is going to be small enough that scrollbars is not needed anymore
            //do this almost before submenu hiding begins
            //but when minimized submenu's toggle should have no effect
            if (height_change != 0) {
                if (self.$sidebar.attr('data-sidebar-scroll') == 'true' && !self.minimized)
                    self.$sidebar.ace_sidebar_scroll('prehide', height_change)
            }

            return false;
        })

        var submenu_working = false;
        this.show = function (sub, $duration, shouldWait) {
            //'shouldWait' indicates whether to wait for previous transition (submenu toggle) to be complete or not?
            shouldWait = (shouldWait !== false);
            if (shouldWait && submenu_working) return false;

            var $sub = $(sub);
            var event;
            $sub.trigger(event = $.Event('show.ace.submenu'))
            if (event.isDefaultPrevented()) {
                return false;
            }

            if (shouldWait) submenu_working = true;


            $duration = $duration || this.settings.duration;

            $sub.css({
                height: 0,
                overflow: 'hidden',
                display: 'block'
            })
                .removeClass('nav-hide').addClass('nav-show')//only for window < @grid-float-breakpoint and .navbar-collapse.menu-min
                .parent().addClass('open');

            sub.scrollTop = 0;//this is for submenu_hover when sidebar is minimized and a submenu is scrollTop'ed using scrollbars ...

            if ($duration > 0) {
                $sub.css({
                    height: sub.scrollHeight,
                    'transition-property': 'height',
                    'transition-duration': ($duration / 1000) + 's'
                })
            }

            var complete = function (ev, trigger) {
                ev && ev.stopPropagation();
                $sub
                    .css({'transition-property': '', 'transition-duration': '', overflow: '', height: ''})
                //if(ace.vars['webkit']) ace.helper.redraw(sub);//little Chrome issue, force redraw ;)

                if (trigger !== false) $sub.trigger($.Event('shown.ace.submenu'))

                if (shouldWait) submenu_working = false;
            }

            if ($duration > 0 && !!$.support.transition.end) {
                $sub.one($.support.transition.end, complete);
            }
            else complete();

            //there is sometimes a glitch, so maybe retry
            if (ace.vars['android']) {
                setTimeout(function () {
                    complete(null, false);
                    ace.helper.redraw(sub);
                }, $duration + 20);
            }

            return true;
        }


        this.hide = function (sub, $duration, shouldWait) {
            //'shouldWait' indicates whether to wait for previous transition (submenu toggle) to be complete or not?
            shouldWait = (shouldWait !== false);
            if (shouldWait && submenu_working) return false;


            var $sub = $(sub);
            var event;
            $sub.trigger(event = $.Event('hide.ace.submenu'))
            if (event.isDefaultPrevented()) {
                return false;
            }

            if (shouldWait) submenu_working = true;


            $duration = $duration || this.settings.duration;

            $sub.css({
                height: sub.scrollHeight,
                overflow: 'hidden',
                display: 'block'
            })
                .parent().removeClass('open');

            sub.offsetHeight;
            //forces the "sub" to re-consider the new 'height' before transition

            if ($duration > 0) {
                $sub.css({
                    'height': 0,
                    'transition-property': 'height',
                    'transition-duration': ($duration / 1000) + 's'
                });
            }


            var complete = function (ev, trigger) {
                ev && ev.stopPropagation();
                $sub
                    .css({display: 'none', overflow: '', height: '', 'transition-property': '', 'transition-duration': ''})
                    .removeClass('nav-show').addClass('nav-hide')//only for window < @grid-float-breakpoint and .navbar-collapse.menu-min

                if (trigger !== false) $sub.trigger($.Event('hidden.ace.submenu'))

                if (shouldWait) submenu_working = false;
            }

            if ($duration > 0 && !!$.support.transition.end) {
                $sub.one($.support.transition.end, complete);
            }
            else complete();


            //there is sometimes a glitch, so maybe retry
            if (ace.vars['android']) {
                setTimeout(function () {
                    complete(null, false);
                    ace.helper.redraw(sub);
                }, $duration + 20);
            }

            return true;
        }

        this.toggle = function (sub, $duration) {
            $duration = $duration || self.settings.duration;

            if (sub.scrollHeight == 0) {//if an element is hidden scrollHeight becomes 0
                if (this.show(sub, $duration)) return 1;
            } else {
                if (this.hide(sub, $duration)) return -1;
            }
            return 0;
        }


        //sidebar vars
        var minimized_menu_class = 'menu-min';
        var responsive_min_class = 'responsive-min';
        var horizontal_menu_class = 'h-sidebar';

        var sidebar_mobile_style = function () {
            //differnet mobile menu styles
            this.mobile_style = 1;//default responsive mode with toggle button inside navbar
            if (this.$sidebar.hasClass('responsive') && !$('.menu-toggler[data-target="#' + this.$sidebar.attr('id') + '"]').hasClass('navbar-toggle')) this.mobile_style = 2;//toggle button behind sidebar
            else if (this.$sidebar.hasClass(responsive_min_class)) this.mobile_style = 3;//minimized menu
            else if (this.$sidebar.hasClass('navbar-collapse')) this.mobile_style = 4;//collapsible (bootstrap style)
        }
        sidebar_mobile_style.call(self);

        function update_vars() {
            this.mobile_view = this.mobile_style < 4 && this.is_mobile_view();
            this.collapsible = !this.mobile_view && this.is_collapsible();

            this.minimized =
                (!this.collapsible && this.$sidebar.hasClass(minimized_menu_class))
                ||
                (this.mobile_style == 3 && this.mobile_view && this.$sidebar.hasClass(responsive_min_class))

            this.horizontal = !(this.mobile_view || this.collapsible) && this.$sidebar.hasClass(horizontal_menu_class)
        }

        //update some basic variables
        $(window).on('resize.sidebar.vars', function () {
            update_vars.call(self);
        }).triggerHandler('resize.sidebar.vars')

    }//end of Sidebar


    //sidebar events

    //menu-toggler
    $(document)
        .on(ace.click_event + '.ace.menu', '.menu-toggler', function (e) {
            var btn = $(this);
            var sidebar = $(btn.attr('data-target'));
            if (sidebar.length == 0) return;

            e.preventDefault();

            sidebar.toggleClass('display');
            btn.toggleClass('display');

            var click_event = ace.click_event + '.ace.autohide';
            var auto_hide = sidebar.attr('data-auto-hide') === 'true';

            if (btn.hasClass('display')) {
                //hide menu if clicked outside of it!
                if (auto_hide) {
                    $(document).on(click_event, function (ev) {
                        if (sidebar.get(0) == ev.target || $.contains(sidebar.get(0), ev.target)) {
                            ev.stopPropagation();
                            return;
                        }

                        sidebar.removeClass('display');
                        btn.removeClass('display');
                        $(document).off(click_event);
                    })
                }

                if (sidebar.attr('data-sidebar-scroll') == 'true') sidebar.ace_sidebar_scroll('reset');
            }
            else {
                if (auto_hide) $(document).off(click_event);
            }

            return false;
        })
        //sidebar collapse/expand button
        .on(ace.click_event + '.ace.menu', '.sidebar-collapse', function (e) {

            var target = $(this).attr('data-target'), $sidebar = null;
            if (target) $sidebar = $(target);
            if ($sidebar == null || $sidebar.length == 0) $sidebar = $(this).closest('.sidebar');
            if ($sidebar.length == 0) return;

            e.preventDefault();
            $sidebar.ace_sidebar('toggleMenu', this);
        })
        //this button is used in `mobile_style = 3` responsive menu style to expand minimized sidebar
        .on(ace.click_event + '.ace.menu', '.sidebar-expand', function (e) {
            var target = $(this).attr('data-target'), $sidebar = null;
            if (target) $sidebar = $(target);
            if ($sidebar == null || $sidebar.length == 0) $sidebar = $(this).closest('.sidebar');
            if ($sidebar.length == 0) return;

            var btn = this;
            e.preventDefault();
            $sidebar.ace_sidebar('toggleResponsive', this);

            var click_event = ace.click_event + '.ace.autohide';
            if ($sidebar.attr('data-auto-hide') === 'true') {
                if ($sidebar.hasClass('responsive-max')) {
                    $(document).on(click_event, function (ev) {
                        if ($sidebar.get(0) == ev.target || $.contains($sidebar.get(0), ev.target)) {
                            ev.stopPropagation();
                            return;
                        }

                        $sidebar.ace_sidebar('toggleResponsive', btn);
                        $(document).off(click_event);
                    })
                }
                else {
                    $(document).off(click_event);
                }
            }
        })


    $.fn.ace_sidebar = function (option, value) {
        var method_call;

        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data('ace_sidebar');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('ace_sidebar', (data = new Sidebar(this, options)));
            if (typeof option === 'string' && typeof data[option] === 'function') {
                if (value instanceof Array) method_call = data[option].apply(data, value);
                else method_call = data[option](value);
            }
        });

        return (method_call === undefined) ? $set : method_call;
    };


    $.fn.ace_sidebar.defaults = {
        'duration': 300
    }


})(window.jQuery);

/**
 <b>Submenu hover adjustment</b>. Automatically move up a submenu to fit into screen when some part of it goes beneath window.
 Pass a "true" value as an argument and submenu will have native browser scrollbars when necessary.
 */
(function ($, undefined) {

    if (ace.vars['very_old_ie']) return;
    //ignore IE7 & below

    var hasTouch = ace.vars['touch'];
    var nativeScroll = ace.vars['old_ie'] || hasTouch;


    var is_element_pos =
        'getComputedStyle' in window ?
            //el.offsetHeight is used to force redraw and recalculate 'el.style.position' esp. for webkit!
            function (el, pos) {
                el.offsetHeight;
                return window.getComputedStyle(el).position == pos
            }
            :
            function (el, pos) {
                el.offsetHeight;
                return $(el).css('position') == pos
            }


    $(window).on('resize.sidebar.ace_hover', function () {
        $('.sidebar[data-sidebar-hover=true]').ace_sidebar_hover('update_vars').ace_sidebar_hover('reset');
    })

    $(document).on('settings.ace.ace_hover', function (e, event_name, event_val) {
        if (event_name == 'sidebar_collapsed') $('.sidebar[data-sidebar-hover=true]').ace_sidebar_hover('reset');
        else if (event_name == 'navbar_fixed') $('.sidebar[data-sidebar-hover=true]').ace_sidebar_hover('update_vars');
    })

    var sidebars = [];

    function Sidebar_Hover(sidebar, settings) {
        var self = this, that = this;

        var attrib_values = ace.helper.getAttrSettings(sidebar, $.fn.ace_sidebar_hover.defaults);
        this.settings = $.extend({}, $.fn.ace_sidebar_hover.defaults, settings, attrib_values);


        var $sidebar = $(sidebar), nav_list = $sidebar.find('.nav-list').get(0);
        $sidebar.attr('data-sidebar-hover', 'true');

        sidebars.push($sidebar);

        var sidebar_vars = {};
        var old_ie = ace.vars['old_ie'];


        var scroll_right = false;
        //scroll style class
        var hasHoverDelay = self.settings.sub_hover_delay || false;

        if (hasTouch && hasHoverDelay) self.settings.sub_hover_delay = parseInt(Math.max(self.settings.sub_hover_delay, 2500));//for touch device, delay is at least 2.5sec

        var $window = $(window);
        //navbar used for adding extra offset from top when adjusting submenu
        var $navbar = $('.navbar').eq(0);
        var navbar_fixed = $navbar.css('position') == 'fixed';
        this.update_vars = function () {
            navbar_fixed = $navbar.css('position') == 'fixed';
        }

        self.dirty = false;
        //on window resize or sidebar expand/collapse a previously "pulled up" submenu should be reset back to its default position
        //for example if "pulled up" in "responsive-min" mode, in "fullmode" should not remain "pulled up"
        this.reset = function () {
            if (self.dirty == false) return;
            self.dirty = false;//so don't reset is not called multiple times in a row!

            $sidebar.find('.submenu').each(function () {
                var $sub = $(this), li = $sub.parent();
                $sub.css({'top': '', 'bottom': '', 'max-height': ''});

                if ($sub.hasClass('ace-scroll')) {
                    $sub.ace_scroll('disable');
                }
                else {
                    $sub.removeClass('sub-scroll');
                }

                if (is_element_pos(this, 'absolute')) $sub.addClass('can-scroll');
                else $sub.removeClass('can-scroll');

                li.removeClass('pull_up').find('.menu-text:first').css('margin-top', '');
            })

            $sidebar.find('.hover-show').removeClass('hover-show hover-shown hover-flip');
        }

        this.updateStyle = function (newStyle) {
            sub_scroll_style = newStyle;
            $sidebar.find('.submenu.ace-scroll').ace_scroll('update', {styleClass: newStyle});
        }
        this.changeDir = function (dir) {
            scroll_right = (dir === 'right');
        }


        //update submenu scrollbars on submenu hide & show

        var lastScrollHeight = -1;
        //hide scrollbars if it's going to be not needed anymore!
        if (!nativeScroll)
            $sidebar.on('hide.ace.submenu.sidebar_hover', '.submenu', function (e) {
                if (lastScrollHeight < 1) return;

                e.stopPropagation();
                var $sub = $(this).closest('.ace-scroll.can-scroll');
                if ($sub.length == 0 || !is_element_pos($sub[0], 'absolute')) return;

                if ($sub[0].scrollHeight - this.scrollHeight < lastScrollHeight) {
                    $sub.ace_scroll('disable');
                }
            });


        //reset scrollbars
        if (!nativeScroll)
            $sidebar.on('shown.ace.submenu.sidebar_hover hidden.ace.submenu.sidebar_hover', '.submenu', function (e) {
                if (lastScrollHeight < 1) return;

                var $sub = $(this).closest('.ace-scroll.can-scroll');
                if ($sub.length == 0 || !is_element_pos($sub[0], 'absolute')) return;

                var sub_h = $sub[0].scrollHeight;

                if (lastScrollHeight > 14 && sub_h - lastScrollHeight > 4) {
                    $sub.ace_scroll('enable').ace_scroll('reset');//don't update track position
                }
                else {
                    $sub.ace_scroll('disable');
                }
            });


        ///////////////////////


        var currentScroll = -1;

        //some mobile browsers don't have mouseenter
        var event_1 = !hasTouch ? 'mouseenter.sub_hover' : 'touchstart.sub_hover';// pointerdown.sub_hover';
        var event_2 = !hasTouch ? 'mouseleave.sub_hover' : 'touchend.sub_hover touchcancel.sub_hover';// pointerup.sub_hover pointercancel.sub_hover';

        $sidebar.on(event_1, '.nav-list li, .sidebar-shortcuts', function (e) {
            sidebar_vars = $sidebar.ace_sidebar('vars');


            //ignore if collapsible mode (mobile view .navbar-collapse) so it doesn't trigger submenu movements
            //or return if horizontal but not mobile_view (style 1&3)
            if (sidebar_vars['collapsible'] /**|| sidebar_vars['horizontal']*/) return;

            var $this = $(this);

            var shortcuts = false;
            var has_hover = $this.hasClass('hover');

            var sub = $this.find('> .submenu').get(0);
            if (!(sub || ((this.parentNode == nav_list || has_hover || (shortcuts = $this.hasClass('sidebar-shortcuts'))) /**&& sidebar_vars['minimized']*/))) {
                if (sub) $(sub).removeClass('can-scroll');
                return;//include .compact and .hover state as well?
            }

            var target_element = sub, is_abs = false;
            if (!target_element && this.parentNode == nav_list) target_element = $this.find('> a > .menu-text').get(0);
            if (!target_element && shortcuts) target_element = $this.find('.sidebar-shortcuts-large').get(0);
            if ((!target_element || !(is_abs = is_element_pos(target_element, 'absolute'))) && !has_hover) {
                if (sub) $(sub).removeClass('can-scroll');
                return;
            }


            var sub_hide = hasHoverDelay ? getSubHide(this) : null;
            //var show_sub = false;

            if (sub) {
                if (is_abs) {
                    self.dirty = true;

                    var newScroll = ace.helper.scrollTop();
                    //if submenu is becoming visible for first time or document has been scrolled, then adjust menu
                    if ((hasHoverDelay && !sub_hide.is_visible()) || (!hasTouch && newScroll != currentScroll) || old_ie) {
                        //try to move/adjust submenu if the parent is a li.hover or if submenu is minimized
                        //if( is_element_pos(sub, 'absolute') ) {//for example in small device .hover > .submenu may not be absolute anymore!
                        $(sub).addClass('can-scroll');
                        //show_sub = true;
                        if (!old_ie && !hasTouch) adjust_submenu.call(this, sub);
                        else {
                            //because ie8 needs some time for submenu to be displayed and real value of sub.scrollHeight be kicked in
                            var that = this;
                            setTimeout(function () {
                                adjust_submenu.call(that, sub)
                            }, 0)
                        }
                        //}
                        //else $(sub).removeClass('can-scroll');
                    }
                    currentScroll = newScroll;
                }
                else {
                    $(sub).removeClass('can-scroll');
                }
            }
            //if(show_sub)
            hasHoverDelay && sub_hide.show();

        }).on(event_2, '.nav-list li, .sidebar-shortcuts', function (e) {
            sidebar_vars = $sidebar.ace_sidebar('vars');

            if (sidebar_vars['collapsible'] /**|| sidebar_vars['horizontal']*/) return;

            if (!$(this).hasClass('hover-show')) return;

            hasHoverDelay && getSubHide(this).hideDelay();
        });


        function subHide(li_sub) {
            var self = li_sub, $self = $(self);
            var timer = null;
            var visible = false;

            this.show = function () {
                if (timer != null) clearTimeout(timer);
                timer = null;

                $self.addClass('hover-show hover-shown');
                visible = true;

                //let's hide .hover-show elements that are not .hover-shown anymore (i.e. marked for hiding in hideDelay)
                for (var i = 0; i < sidebars.length; i++) {
                    sidebars[i].find('.hover-show').not('.hover-shown').each(function () {
                        getSubHide(this).hide();
                    })
                }
            }

            this.hide = function () {
                visible = false;

                $self.removeClass('hover-show hover-shown hover-flip');

                if (timer != null) clearTimeout(timer);
                timer = null;

                var sub = $self.find('> .submenu').get(0);
                if (sub) getSubScroll(sub, 'hide');
            }

            this.hideDelay = function (callback) {
                if (timer != null) clearTimeout(timer);

                $self.removeClass('hover-shown');//somehow marked for hiding

                timer = setTimeout(function () {
                    visible = false;
                    $self.removeClass('hover-show hover-flip');
                    timer = null;

                    var sub = $self.find('> .submenu').get(0);
                    if (sub) getSubScroll(sub, 'hide');

                    if (typeof callback === 'function') callback.call(this);
                }, that.settings.sub_hover_delay);
            }

            this.is_visible = function () {
                return visible;
            }
        }

        function getSubHide(el) {
            var sub_hide = $(el).data('subHide');
            if (!sub_hide) $(el).data('subHide', (sub_hide = new subHide(el)));
            return sub_hide;
        }


        function getSubScroll(el, func) {
            var sub_scroll = $(el).data('ace_scroll');
            if (!sub_scroll) return false;
            if (typeof func === 'string') {
                sub_scroll[func]();
                return true;
            }
            return sub_scroll;
        }

        function adjust_submenu(sub) {
            var $li = $(this);
            var $sub = $(sub);
            sub.style.top = '';
            sub.style.bottom = '';


            var menu_text = null
            if (sidebar_vars['minimized'] && (menu_text = $li.find('.menu-text').get(0))) {
                //2nd level items don't have .menu-text
                menu_text.style.marginTop = '';
            }

            var scroll = ace.helper.scrollTop();
            var navbar_height = 0;

            var $scroll = scroll;

            if (navbar_fixed) {
                navbar_height = sidebar.offsetTop;//$navbar.height();
                $scroll += navbar_height + 1;
                //let's avoid our submenu from going below navbar
                //because of chrome z-index stacking issue and firefox's normal .submenu over fixed .navbar flicker issue
            }


            var off = $li.offset();
            off.top = parseInt(off.top);

            var extra = 0, parent_height;

            sub.style.maxHeight = '';//otherwise scrollHeight won't be consistent in consecutive calls!?
            var sub_h = sub.scrollHeight;
            var parent_height = $li.height();
            if (menu_text) {
                extra = parent_height;
                off.top += extra;
            }
            var sub_bottom = parseInt(off.top + sub_h)

            var move_up = 0;
            var winh = $window.height();


            //if the bottom of menu is going to go below visible window

            var top_space = parseInt(off.top - $scroll - extra);//available space on top
            var win_space = winh;//available window space

            var horizontal = sidebar_vars['horizontal'], horizontal_sub = false;
            if (horizontal && this.parentNode == nav_list) {
                move_up = 0;//don't move up first level submenu in horizontal mode
                off.top += $li.height();
                horizontal_sub = true;//first level submenu
            }

            if (!horizontal_sub && (move_up = (sub_bottom - (winh + scroll))) >= 0) {
                //don't move up more than available space
                move_up = move_up < top_space ? move_up : top_space;

                //move it up a bit more if there's empty space
                if (move_up == 0) move_up = 20;
                if (top_space - move_up > 10) {
                    move_up += parseInt(Math.min(25, top_space - move_up));
                }


                //move it down if submenu's bottom is going above parent LI
                if (off.top + (parent_height - extra) > (sub_bottom - move_up)) {
                    move_up -= (off.top + (parent_height - extra) - (sub_bottom - move_up));
                }

                if (move_up > 0) {
                    sub.style.top = -(move_up) + 'px';
                    if (menu_text) {
                        menu_text.style.marginTop = -(move_up) + 'px';
                    }
                }
            }
            if (move_up < 0) move_up = 0;//when it goes below

            var pull_up = move_up > 0 && move_up > parent_height - 20;
            if (pull_up) {
                $li.addClass('pull_up');
            }
            else $li.removeClass('pull_up');


            //flip submenu if out of window width
            if (horizontal) {
                if ($li.parent().parent().hasClass('hover-flip')) $li.addClass('hover-flip');//if a parent is already flipped, flip it then!
                else {
                    var sub_off = $sub.offset();
                    var sub_w = $sub.width();
                    var win_w = $window.width();
                    if (sub_off.left + sub_w > win_w) {
                        $li.addClass('hover-flip');
                    }
                }
            }


            //don't add scrollbars if it contains .hover menus
            var has_hover = $li.hasClass('hover') && !sidebar_vars['mobile_view'];
            if (has_hover && $sub.find('> li > .submenu').length > 0) return;


            //if(  ) {
            var scroll_height = (win_space - (off.top - scroll)) + (move_up);
            //if after scroll, the submenu is above parent LI, then move it down
            var tmp = move_up - scroll_height;
            if (tmp > 0 && tmp < parent_height) scroll_height += parseInt(Math.max(parent_height, parent_height - tmp));

            scroll_height -= 5;

            if (scroll_height < 90) {
                return;
            }

            var ace_scroll = false;
            if (!nativeScroll) {
                ace_scroll = getSubScroll(sub);
                if (ace_scroll == false) {
                    $sub.ace_scroll({
                        //hideOnIdle: true,
                        observeContent: true,
                        detached: true,
                        updatePos: false,
                        reset: true,
                        mouseWheelLock: true,
                        styleClass: self.settings.sub_scroll_style
                    });
                    ace_scroll = getSubScroll(sub);

                    var track = ace_scroll.get_track();
                    if (track) {
                        //detach it from body and insert it after submenu for better and cosistent positioning
                        $sub.after(track);
                    }
                }

                ace_scroll.update({size: scroll_height});
            }
            else {
                $sub
                    .addClass('sub-scroll')
                    .css('max-height', (scroll_height) + 'px')
            }


            lastScrollHeight = scroll_height;
            if (!nativeScroll && ace_scroll) {
                if (scroll_height > 14 && sub_h - scroll_height > 4) {
                    ace_scroll.enable()
                    ace_scroll.reset();
                }
                else {
                    ace_scroll.disable();
                }

                //////////////////////////////////
                var track = ace_scroll.get_track();
                if (track) {
                    track.style.top = -(move_up - extra - 1) + 'px';

                    var off = $sub.position();
                    var left = off.left
                    if (!scroll_right) {
                        left += ($sub.outerWidth() - ace_scroll.track_size());
                    }
                    else {
                        left += 2;
                    }
                    track.style.left = parseInt(left) + 'px';

                    if (horizontal_sub) {//first level submenu
                        track.style.left = parseInt(left - 2) + 'px';
                        track.style.top = parseInt(off.top) + (menu_text ? extra - 2 : 0) + 'px';
                    }
                }
            }
            //}


            //again force redraw for safari!
            if (ace.vars['safari']) {
                ace.helper.redraw(sub)
            }
        }

    }


    /////////////////////////////////////////////
    $.fn.ace_sidebar_hover = function (option, value) {
        var method_call;

        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data('ace_sidebar_hover');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('ace_sidebar_hover', (data = new Sidebar_Hover(this, options)));
            if (typeof option === 'string' && typeof data[option] === 'function') {
                method_call = data[option](value);
            }
        });

        return (method_call === undefined) ? $set : method_call;
    }

    $.fn.ace_sidebar_hover.defaults = {
        'sub_sub_hover_delay': 750,
        'sub_scroll_style': 'no-track scroll-thin'
    }


})(window.jQuery);

/**
 <b>Ace custom scroller</b>. It is not as feature-rich as plugins such as NiceScroll but it's good enough for most cases.
 */
(function($ , undefined) {
    var Ace_Scroll = function(element , _settings) {
        var self = this;

        var attrib_values = ace.helper.getAttrSettings(element, $.fn.ace_scroll.defaults);
        var settings = $.extend({}, $.fn.ace_scroll.defaults, _settings, attrib_values);

        this.size = 0;
        this.lock = false;
        this.lock_anyway = false;

        this.$element = $(element);
        this.element = element;

        var vertical = true;

        var disabled = false;
        var active = false;
        var created = false;


        var $content_wrap = null, content_wrap = null;
        var $track = null, $bar = null, track = null, bar = null;
        var bar_style = null;

        var bar_size = 0, bar_pos = 0, bar_max_pos = 0, bar_size_2 = 0, move_bar = true;
        var reset_once = false;

        var styleClass = '';
        var trackFlip = false;//vertical on left or horizontal on top
        var trackSize = 0;

        var css_pos,
            css_size,
            max_css_size,
            client_size,
            scroll_direction,
            scroll_size;

        var ratio = 1;
        var inline_style = false;
        var mouse_track = false;
        var mouse_release_target = 'onmouseup' in window ? window : 'html';
        var dragEvent = settings.dragEvent || false;

        var trigger_scroll = _settings.scrollEvent || false;


        var detached = settings.detached || false;//when detached, hideOnIdle as well?
        var updatePos = settings.updatePos || false;//default is true

        var hideOnIdle = settings.hideOnIdle || false;
        var hideDelay = settings.hideDelay || 1500;
        var insideTrack = false;//used to hide scroll track when mouse is up and outside of track
        var observeContent = settings.observeContent || false;
        var prevContentSize = 0;

        var is_dirty = true;//to prevent consecutive 'reset' calls

        this.ref = function() {
            return this;
        }

        this.create = function(_settings) {
            if(created) return;

            if(_settings) settings = $.extend({}, $.fn.ace_scroll.defaults, _settings);

            this.size = parseInt(this.$element.attr('data-size')) || settings.size || 200;
            vertical = !settings['horizontal'];

            css_pos = vertical ? 'top' : 'left';//'left' for horizontal
            css_size = vertical ? 'height' : 'width';//'width' for horizontal
            max_css_size = vertical ? 'maxHeight' : 'maxWidth';

            client_size = vertical ? 'clientHeight' : 'clientWidth';
            scroll_direction = vertical ? 'scrollTop' : 'scrollLeft';
            scroll_size = vertical ? 'scrollHeight' : 'scrollWidth';



            this.$element.addClass('ace-scroll');
            if(this.$element.css('position') == 'static') {
                inline_style = this.element.style.position;
                this.element.style.position = 'relative';
            } else inline_style = false;

            var scroll_bar = null;
            if(!detached) {
                this.$element.wrapInner('<div class="scroll-content" />');
                this.$element.prepend('<div class="scroll-track"><div class="scroll-bar"></div></div>');
            }
            else {
                scroll_bar = $('<div class="scroll-track scroll-detached"><div class="scroll-bar"></div></div>').appendTo('body');
            }


            $content_wrap = this.$element;
            if(!detached) $content_wrap = this.$element.find('.scroll-content').eq(0);

            if(!vertical) $content_wrap.wrapInner('<div />');

            content_wrap = $content_wrap.get(0);
            if(detached) {
                //set position for detached scrollbar
                $track = scroll_bar;
                setTrackPos();
            }
            else $track = this.$element.find('.scroll-track').eq(0);

            $bar = $track.find('.scroll-bar').eq(0);
            track = $track.get(0);
            bar = $bar.get(0);
            bar_style = bar.style;

            //add styling classes and horizontalness
            if(!vertical) $track.addClass('scroll-hz');
            if(settings.styleClass) {
                styleClass = settings.styleClass;
                $track.addClass(styleClass);
                trackFlip = !!styleClass.match(/scroll\-left|scroll\-top/);
            }

            //calculate size of track!
            if(trackSize == 0) {
                $track.show();
                getTrackSize();
            }

            $track.hide();


            //if(!touchDrag) {
            $track.on('mousedown', mouse_down_track);
            $bar.on('mousedown', mouse_down_bar);
            //}

            $content_wrap.on('scroll', function() {
                if(move_bar) {
                    bar_pos = parseInt(Math.round(this[scroll_direction] * ratio));
                    bar_style[css_pos] = bar_pos + 'px';
                }
                move_bar = false;
                if(trigger_scroll) this.$element.trigger('scroll', [content_wrap]);
            })


            if(settings.mouseWheel) {
                this.lock = settings.mouseWheelLock;
                this.lock_anyway = settings.lockAnyway;

                //mousewheel library available?
                this.$element.on(!!$.event.special.mousewheel ? 'mousewheel.ace_scroll' : 'mousewheel.ace_scroll DOMMouseScroll.ace_scroll', function(event) {
                    if(disabled) return;
                    checkContentChanges(true);

                    if(!active) return !self.lock_anyway;

                    if(mouse_track) {
                        mouse_track = false;
                        $('html').off('.ace_scroll')
                        $(mouse_release_target).off('.ace_scroll');
                        if(dragEvent) self.$element.trigger('drag.end');
                    }


                    event.deltaY = event.deltaY || 0;
                    var delta = (event.deltaY > 0 || event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) ? 1 : -1
                    var scrollEnd = false//have we reached the end of scrolling?

                    var clientSize = content_wrap[client_size], scrollAmount = content_wrap[scroll_direction];
                    if( !self.lock ) {
                        if(delta == -1)	scrollEnd = (content_wrap[scroll_size] <= scrollAmount + clientSize);
                        else scrollEnd = (scrollAmount == 0);
                    }

                    self.move_bar(true);

                    //var step = parseInt( Math.min(Math.max(parseInt(clientSize / 8) , 80) , self.size) ) + 1;
                    var step = parseInt(clientSize / 8);
                    if(step < 80) step = 80;
                    if(step > self.size) step = self.size;
                    step += 1;

                    content_wrap[scroll_direction] = scrollAmount - (delta * step);


                    return scrollEnd && !self.lock_anyway;
                })
            }


            //swipe not available yet
            var touchDrag = ace.vars['touch'] && 'ace_drag' in $.event.special && settings.touchDrag //&& !settings.touchSwipe;
            //add drag event for touch devices to scroll
            if(touchDrag/** || ($.fn.swipe && settings.touchSwipe)*/) {
                var dir = '', event_name = touchDrag ? 'ace_drag' : 'swipe';
                this.$element.on(event_name + '.ace_scroll', function(event) {
                    if(disabled) {
                        event.retval.cancel = true;
                        return;
                    }
                    checkContentChanges(true);

                    if(!active) {
                        event.retval.cancel = this.lock_anyway;
                        return;
                    }

                    dir = event.direction;
                    if( (vertical && (dir == 'up' || dir == 'down'))
                        ||
                        (!vertical && (dir == 'left' || dir == 'right'))
                    )
                    {
                        var distance = vertical ? event.dy : event.dx;

                        if(distance != 0) {
                            if(Math.abs(distance) > 20 && touchDrag) distance = distance * 2;

                            self.move_bar(true);
                            content_wrap[scroll_direction] = content_wrap[scroll_direction] + distance;
                        }
                    }

                })
            }


            /////////////////////////////////

            if(hideOnIdle) {
                $track.addClass('idle-hide');
            }
            if(observeContent) {
                $track.on('mouseenter.ace_scroll', function() {
                    insideTrack = true;
                    checkContentChanges(false);
                }).on('mouseleave.ace_scroll', function() {
                    insideTrack = false;
                    if(mouse_track == false) hideScrollbars();
                });
            }



            //some mobile browsers don't have mouseenter
            this.$element.on('mouseenter.ace_scroll touchstart.ace_scroll', function(e) {
                is_dirty = true;
                if(observeContent) checkContentChanges(true);
                else if(settings.hoverReset) self.reset(true);

                $track.addClass('scroll-hover');
            }).on('mouseleave.ace_scroll touchend.ace_scroll', function() {
                $track.removeClass('scroll-hover');
            });
            //

            if(!vertical) $content_wrap.children(0).css(css_size, this.size);//the extra wrapper
            $content_wrap.css(max_css_size , this.size);

            disabled = false;
            created = true;
        }
        this.is_active = function() {
            return active;
        }
        this.is_enabled = function() {
            return !disabled;
        }
        this.move_bar = function($move) {
            move_bar = $move;
        }

        this.get_track = function() {
            return track;
        }

        this.reset = function(innert_call) {
            if(disabled) return;// this;
            if(!created) this.create();
            /////////////////////
            var size = this.size;

            if(innert_call && !is_dirty) {
                return;
            }
            is_dirty = false;

            if(detached) {
                var border_size = parseInt(Math.round( (parseInt($content_wrap.css('border-top-width')) + parseInt($content_wrap.css('border-bottom-width'))) / 2.5 ));//(2.5 from trial?!)
                size -= border_size;//only if detached
            }

            var content_size   = vertical ? content_wrap[scroll_size] : size;
            if( (vertical && content_size == 0) || (!vertical && this.element.scrollWidth == 0) ) {
                //element is hidden
                //this.$element.addClass('scroll-hidden');
                $track.removeClass('scroll-active')
                return;// this;
            }

            var available_space = vertical ? size : content_wrap.clientWidth;

            if(!vertical) $content_wrap.children(0).css(css_size, size);//the extra wrapper
            $content_wrap.css(max_css_size , this.size);


            if(content_size > available_space) {
                active = true;
                $track.css(css_size, available_space).show();

                ratio = parseFloat((available_space / content_size).toFixed(5))

                bar_size = parseInt(Math.round(available_space * ratio));
                bar_size_2 = parseInt(Math.round(bar_size / 2));

                bar_max_pos = available_space - bar_size;
                bar_pos = parseInt(Math.round(content_wrap[scroll_direction] * ratio));

                bar_style[css_size] = bar_size + 'px';
                bar_style[css_pos] = bar_pos + 'px';

                $track.addClass('scroll-active');

                if(trackSize == 0) {
                    getTrackSize();
                }

                if(!reset_once) {
                    //this.$element.removeClass('scroll-hidden');
                    if(settings.reset) {
                        //reset scrollbar to zero position at first
                        content_wrap[scroll_direction] = 0;
                        bar_style[css_pos] = 0;
                    }
                    reset_once = true;
                }

                if(detached) setTrackPos();
            } else {
                active = false;
                $track.hide();
                $track.removeClass('scroll-active');
                $content_wrap.css(max_css_size , '');
            }

            return;// this;
        }
        this.disable = function() {
            content_wrap[scroll_direction] = 0;
            bar_style[css_pos] = 0;

            disabled = true;
            active = false;
            $track.hide();

            this.$element.addClass('scroll-disabled');

            $track.removeClass('scroll-active');
            $content_wrap.css(max_css_size , '');
        }
        this.enable = function() {
            disabled = false;
            this.$element.removeClass('scroll-disabled');
        }
        this.destroy = function() {
            active = false;
            disabled = false;
            created = false;

            this.$element.removeClass('ace-scroll scroll-disabled scroll-active');
            this.$element.off('.ace_scroll')

            if(!detached) {
                if(!vertical) {
                    //remove the extra wrapping div
                    $content_wrap.find('> div').children().unwrap();
                }
                $content_wrap.children().unwrap();
                $content_wrap.remove();
            }

            $track.remove();

            if(inline_style !== false) this.element.style.position = inline_style;

            if(idleTimer != null) {
                clearTimeout(idleTimer);
                idleTimer = null;
            }
        }
        this.modify = function(_settings) {
            if(_settings) settings = $.extend({}, settings, _settings);

            this.destroy();
            this.create();
            is_dirty = true;
            this.reset(true);
        }
        this.update = function(_settings) {
            if(_settings) settings = $.extend({}, settings, _settings);
            else _settings = {}

            this.size = _settings.size || this.size;

            this.lock = _settings.mouseWheelLock || this.lock;
            this.lock_anyway = _settings.lockAnyway || this.lock_anyway;

            hideOnIdle = _settings.hideOnIdle || hideOnIdle;
            hideDelay = _settings.hideDelay || hideDelay;
            observeContent = _settings.observeContent || false;

            dragEvent = _settings.dragEvent || false;

            if(_settings.styleClass != undefined) {
                if(styleClass) $track.removeClass(styleClass);
                styleClass = _settings.styleClass;
                if(styleClass) $track.addClass(styleClass);
                trackFlip = !!styleClass.match(/scroll\-left|scroll\-top/);
            }
        }

        this.start = function() {
            content_wrap[scroll_direction] = 0;
        }
        this.end = function() {
            content_wrap[scroll_direction] = content_wrap[scroll_size];
        }

        this.hide = function() {
            $track.hide();
        }
        this.show = function() {
            $track.show();
        }


        this.update_scroll = function() {
            move_bar = false;
            bar_style[css_pos] = bar_pos + 'px';
            content_wrap[scroll_direction] = parseInt(Math.round(bar_pos / ratio));
        }

        function mouse_down_track(e) {
            e.preventDefault();
            e.stopPropagation();

            var track_offset = $track.offset();
            var track_pos = track_offset[css_pos];//top for vertical, left for horizontal
            var mouse_pos = vertical ? e.pageY : e.pageX;

            if(mouse_pos > track_pos + bar_pos) {
                bar_pos = mouse_pos - track_pos - bar_size + bar_size_2;
                if(bar_pos > bar_max_pos) {
                    bar_pos = bar_max_pos;
                }
            }
            else {
                bar_pos = mouse_pos - track_pos - bar_size_2;
                if(bar_pos < 0) bar_pos = 0;
            }

            self.update_scroll()
        }

        var mouse_pos1 = -1, mouse_pos2 = -1;
        function mouse_down_bar(e) {
            e.preventDefault();
            e.stopPropagation();

            if(vertical) {
                mouse_pos2 = mouse_pos1 = e.pageY;
            } else {
                mouse_pos2 = mouse_pos1 = e.pageX;
            }

            mouse_track = true;
            $('html').off('mousemove.ace_scroll').on('mousemove.ace_scroll', mouse_move_bar)
            $(mouse_release_target).off('mouseup.ace_scroll').on('mouseup.ace_scroll', mouse_up_bar);

            $track.addClass('active');
            if(dragEvent) self.$element.trigger('drag.start');
        }
        function mouse_move_bar(e) {
            e.preventDefault();
            e.stopPropagation();

            if(vertical) {
                mouse_pos2 = e.pageY;
            } else {
                mouse_pos2 = e.pageX;
            }


            if(mouse_pos2 - mouse_pos1 + bar_pos > bar_max_pos) {
                mouse_pos2 = mouse_pos1 + bar_max_pos - bar_pos;
            } else if(mouse_pos2 - mouse_pos1 + bar_pos < 0) {
                mouse_pos2 = mouse_pos1 - bar_pos;
            }
            bar_pos = bar_pos + (mouse_pos2 - mouse_pos1);

            mouse_pos1 = mouse_pos2;

            if(bar_pos < 0) {
                bar_pos = 0;
            }
            else if(bar_pos > bar_max_pos) {
                bar_pos = bar_max_pos;
            }

            self.update_scroll()
        }
        function mouse_up_bar(e) {
            e.preventDefault();
            e.stopPropagation();

            mouse_track = false;
            $('html').off('.ace_scroll')
            $(mouse_release_target).off('.ace_scroll');

            $track.removeClass('active');
            if(dragEvent) self.$element.trigger('drag.end');

            if(active && hideOnIdle && !insideTrack) hideScrollbars();
        }


        var idleTimer = null;
        var prevCheckTime = 0;
        function checkContentChanges(hideSoon) {
            //check if content size has been modified since last time?
            //and with at least 1s delay
            var newCheck = +new Date();
            if(observeContent && newCheck - prevCheckTime > 1000) {
                var newSize = content_wrap[scroll_size];
                if(prevContentSize != newSize) {
                    prevContentSize = newSize;
                    is_dirty = true;
                    self.reset(true);
                }
                prevCheckTime = newCheck;
            }

            //show scrollbars when not idle anymore i.e. triggered by mousewheel, dragging, etc
            if(active && hideOnIdle) {
                if(idleTimer != null) {
                    clearTimeout(idleTimer);
                    idleTimer = null;
                }
                $track.addClass('not-idle');

                if(!insideTrack && hideSoon == true) {
                    //hideSoon is false when mouse enters track
                    hideScrollbars();
                }
            }
        }

        function hideScrollbars() {
            if(idleTimer != null) {
                clearTimeout(idleTimer);
                idleTimer = null;
            }
            idleTimer = setTimeout(function() {
                idleTimer = null;
                $track.removeClass('not-idle');
            } , hideDelay);
        }

        //for detached scrollbars
        function getTrackSize() {
            $track.css('visibility', 'hidden').addClass('scroll-hover');
            if(vertical) trackSize = parseInt($track.outerWidth()) || 0;
            else trackSize = parseInt($track.outerHeight()) || 0;
            $track.css('visibility', '').removeClass('scroll-hover');
        }
        this.track_size = function() {
            if(trackSize == 0) getTrackSize();
            return trackSize;
        }

        //for detached scrollbars
        function setTrackPos() {
            if(updatePos === false) return;

            var off = $content_wrap.offset();//because we want it relative to parent not document
            var left = off.left;
            var top = off.top;

            if(vertical) {
                if(!trackFlip) {
                    left += ($content_wrap.outerWidth() - trackSize)
                }
            }
            else {
                if(!trackFlip) {
                    top += ($content_wrap.outerHeight() - trackSize)
                }
            }

            if(updatePos === true) $track.css({top: parseInt(top), left: parseInt(left)});
            else if(updatePos === 'left') $track.css('left', parseInt(left));
            else if(updatePos === 'top') $track.css('top', parseInt(top));
        }



        this.create();
        is_dirty = true;
        this.reset(true);
        prevContentSize = content_wrap[scroll_size];

        return this;
    }


    $.fn.ace_scroll = function (option,value) {
        var retval;

        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data('ace_scroll');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('ace_scroll', (data = new Ace_Scroll(this, options)));
            //else if(typeof options == 'object') data['modify'](options);
            if (typeof option === 'string') retval = data[option](value);
        });

        return (retval === undefined) ? $set : retval;
    };


    $.fn.ace_scroll.defaults = {
        'size' : 200,
        'horizontal': false,
        'mouseWheel': true,
        'mouseWheelLock': false,
        'lockAnyway': false,
        'styleClass' : false,

        'observeContent': false,
        'hideOnIdle': false,
        'hideDelay': 1500,

        'hoverReset': true //reset scrollbar sizes on mouse hover because of possible sizing changes
        ,
        'reset': false //true= set scrollTop = 0
        ,
        'dragEvent': false
        ,
        'touchDrag': true
        ,
        'touchSwipe': false
        ,
        'scrollEvent': false //trigger scroll event

        ,
        'detached': false
        ,
        'updatePos': true
        /**
         ,
         'track' : true,
         'show' : false,
         'dark': false,
         'alwaysVisible': false,
         'margin': false,
         'thin': false,
         'position': 'right'
         */
    }

    /**
     $(document).on('ace.settings.ace_scroll', function(e, name) {
		if(name == 'sidebar_collapsed') $('.ace-scroll').scroller('reset');
	});
     $(window).on('resize.ace_scroll', function() {
		$('.ace-scroll').scroller('reset');
	});
     */

})(window.jQuery);

