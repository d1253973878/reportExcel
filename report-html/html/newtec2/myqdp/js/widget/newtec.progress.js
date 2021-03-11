(function () {
    var Newtec = window.Newtec || {};
    var Progress = Newtec.Progress || {};

    var defaults = {
        'type': 'circle',//支持line和circle
        'percent': 50,
        'color': '#87B87F',
        'clear': false,
        'css': '',
        'clazz': ''
    };

    var circleTpl = "<div class='easy-pie-chart percentage' data-percent='${percent}' data-color='${color}'><span class='percent'>${percent}</span>%</div>";
    var lineTpl = "<div class='progress pos-rel' data-percent='${percent}%' ><div class='progress-bar' style='width:${percent}%; background-color:${color};'></div></div>";

    Progress.create = function (options) {
        //合并参数
        defaults = $.extend({}, defaults, options);

        if (typeof (defaults['selector']) === 'undefined') {
            return;
        }
        var selector = Newtec.Utils.convert(defaults['selector']);

        if (typeof (defaults['css']) === 'undefined') {
        } else {
            if (defaults['css'] !== '') {
                selector.css(defaults['css']);
            }
        }

        if (typeof (defaults['clazz']) === 'undefined') {
        } else {
            selector.addClass(defaults['clazz']);
        }

        //生成内容
        var c;
        if (defaults['type'] === 'line') {
            c = Newtec.Utils.htmlTemplate(lineTpl, defaults);
        } else if (defaults['type'] === 'circle') {
            c = Newtec.Utils.htmlTemplate(circleTpl, defaults);
        }

        if (defaults['clear']) {
            Newtec.Utils.html(selector, '');
        }
        Newtec.Utils.append(selector, c);
        //使用circle进度条必须调用次方法
        initCircleProgressBar();

        return selector;
    };

    //使用circle进度条必须调用次方法
    var initCircleProgressBar = function () {
        $('.easy-pie-chart.percentage').each(function () {
            $(this).easyPieChart({
                barColor: $(this).data('color'),
                trackColor: '#EEEEEE',
                scaleColor: false,
                lineCap: 'butt',
                lineWidth: 8,
                animate: ace.vars['old_ie'] ? false : 1000,
                size: 75
            }).css('color', $(this).data('color'));
        });
    };

    Newtec.Progress = Progress;
    Newtec.Module("Progress");
})();