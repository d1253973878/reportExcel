; (function () {
	if (Newtec.Ckeditor != undefined) {
		alert('newtec.ckeditor.js已经被引入!');
		return;
	}
	Newtec.Ckeditor = function (params) {
		this.defaults = {
		};
	};
	Newtec.Ckeditor.exte(Newtec.Base, 'ckeditor');
	Newtec.Ckeditor.prototype.createNewtecJQ = function (params) {
		console.info(this.id)
		var id = Newtec.Utils.uuid16();
		this.id = id;
		return $('<textarea id="' + id + '"></textarea>');
	};
	Newtec.Ckeditor.prototype.finsh = function (params) {
		var that = this;
		setTimeout(function () {
			that.editor = CKEDITOR.replace(that.id, params);
		}, 100);
	};

	Newtec.Ckeditor.prototype.getValue = function () {
		return this.editor.getData();
	};
	Newtec.Ckeditor.prototype.setValue = function (value) {
		this.editor.setData(value);
	};
})();