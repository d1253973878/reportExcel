/**
 * 此方法中的每个参数对应的函数都必须传入两个值
 * params: 系统必须参数，包含以下键值对
 * 				tip: 新增组件的输入提示信息
 * 				value: 新增组件的默认值,如果 value 对应的值包含多个，则这多个值组成数组
 * tipSource: 必传参数，自定义传入数据的格式，主要来自于回调函数返回的值
 */
var methods = {
	new_date_in: {
		new_: function (params, tipSource) {
			var $date = $('<input size="16" type="text" value="' + params.value + '" readonly class="form-control date-type" placeholder = "' + params.tip + '">');
			$date.datetimepicker({
				format: 'yyyy-mm-dd hh:ii',
				autoclose: true
			});
			return $date;
		},
		get_: function ($parent) {
			var date = $parent.find('> .date-type').val();
			if (date.replace(/(^\s*)/g, "") == '') {
				return error({msg: '请输入非空字符串', node: $parent.find('> .date-type')});
			}
			return success({value: date});
		}
	},
	new_val_typeahead: {
		new_: function (params, tipSource) {
			var length = params.length ? "maxlength='" + params.length + "'" : "";
				$input = $('<input size="16" type="text" ' + length + ' value="' + params.value + '" class="form-control typeahead-type" placeholder = "' + params.tip + '">');
			$input.data('number', params.isNumber ? 1 : 0);
			$input.data('min', params.min);
			$input.data('max', params.max);
			$input.typeahead({
				source: tipSource, // 绑定数据源
				highlighter: function (item) {
					return item.split("-\$-")[0];
				},
				updater: function (item) {
					return item.split("-\$-")[0];
				},
				afterSelect: function (item) {
				}
			});
			$input.on("input", function(e) {
				this.value = this.value.replace(/[^0-9\.]/g, '');
			});
			return $input;
		},
		get_: function ($parent) {
			var $input = $parent.find('> .typeahead-type'),
				value = $input.val();
			if (value.replace(/(^\s*)/g, "") == '') {
				return error({msg: '请输入非空值', node: $input});
			}
			if($input.data('number') == 1 && !isNumber(value)){
				return error({msg: '请输入合法的数字', node: $input});
			}
			var min = $input.data('min'),
				max = $input.data('max');
			if((!Utils.isEmpty(min) && value < min) || (!Utils.isEmpty(max) && value > max)){
				return error({msg: '您输入的值不在合法范围内', node: $input});				
			}
			return success({value: value});
		}
	},
	new_val_input: {
		new_: function (params, tipSource) {
			var length = params.isString && params.length ? "maxlength='" + params.length + "'" : "",
				$input = $('<input class="form-control sigle-input" ' + length + ' type="text" placeholder = "' + params.tip + '" value = "' + params.value + '"/>');
			$input.data('number', params.isNumber ? 1 : 0);
			$input.data('min', params.min);
			$input.data('max', params.max);
			$input.on("input", function(e) {
				this.value = this.value.replace(/[^0-9\.]/g, '');
			});
			return $input;
		},
		get_: function ($parent) {
			var $input = $parent.find('> .sigle-input'),
				value = $input.val();
			if (value.replace(/(^\s*)/g, "") == '') {
				return error({msg: '请输入非空值', node: $input});
			}
			if($input.data('number') == 1 && !isNumber(value)){
				return error({msg: '请输入合法的数字', node: $input});
			}
			var min = $input.data('min'),
				max = $input.data('max');
			if((!Utils.isEmpty(min) && value < min) || (!Utils.isEmpty(max) && value > max)){
				return error({msg: '您输入的值不在合法范围内', node: $input});				
			}
			return success({value: value});
		}
	},
	new_val_select: {
		new_: function (params, datas) {
			var $select = $('<select class="form-control selectpicker bs-select-hidden mobile-device val_sel" placeholder = "' + params.tip + '">');
			$.each(datas, function (i, j) {
				$select.append('<option value="' + this.value + '">' + this.text + '</option>');
			});
			$select.val(params.value);
			return $select;
		},
		get_: function ($parent) {
			var value = $parent.find('> .val_sel').val();
			if (value.replace(/(^\s*)/g, "") == '') {
				return error({msg: '请选择一个有效值', node: $parent.find('> .val_sel')});
			} 
			return success({value: value});
		}
	},
	new_val_foreign_select: {
		new_: function (params, datas) {
			var $select = $('<select class="form-control selectpicker bs-select-hidden mobile-device foreign-value"  placeholder = "' + params.tip + '">');
			$.each(datas, function (i, j) {
				var entityName = this.entityName;
				var alias = this.alias;
				var properties = this.properties;
				$.each(alias, function (n, m) {
					var $group = $('<optgroup>').attr('label', entityName + "." + alias[n]);
					$.each(properties, function (o, p) {
						$group.append('<option value="' + entityName + "."
							+ alias[n] + "." + this.name + "." + this.type
							+ '">' + this.name + '</option>');
					});
					$select.append($group);
				});
			});
			$select.val(params.value);
			return $select;
		},
		get_: function ($parent) {
			var values = $parent.find('> .foreign-value').val().split('.')
			if (values.length != 4) {
				return error({msg: '请输入非空值', node: $parent.find('> .foreign-value')});
			}
			return success({value: { 'entity': values[0], 'alia': values[1], 'property': values[2] }});
		}
	}
};

function success (result){
	result.success = true;
	return result;
}

function error (result){
	result.success = false;
	return result;
}

function isNumber(str){
	return /^[0-9]+([.]{1}[0-9]+){0,1}$/.test(str);
}