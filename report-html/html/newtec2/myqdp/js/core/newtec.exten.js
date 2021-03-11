//继承封装
var _super = function (args) {
		var method = this ._super.caller;
		 if (!method) {
		throw "Cannot call _super outside!" ;
		} 
		var name = method.__name__;
		var superCls = method.__owner__._superClass;
		var superMethod = superCls[name];
		 if ( typeof superMethod !== 'function' ) {
		throw "Call the super class's " + name + ", but it is not a function!" ;
		} 
		return superMethod.apply( this , args);
		};
		Function.prototype.exten = function (SuperCls) {
		var SubCls = this;
		var fn = function () {};
		if ( typeof SuperCls !== 'function' ) {
		SuperCls = fn;
		}
		var overrides = SubCls.prototype;
		var superPro = SuperCls.prototype;
		fn.prototype = superPro;
		var subPro = SubCls.prototype = new fn;
		for ( var k in overrides) {
		var v = overrides[k];
		if ( typeof v === 'function' ) {
		v.__name__ = k;
		v.__owner__ = subPro;
		}
		subPro[k] = v;
		}
		subPro.constructor = SubCls;
		subPro._superClass = superPro;
		subPro._super = _super;
		};

	var A = function () {
	};
	A.prototype.method1 = function (i) {
		console .log( '1A#method'+i );
	};
	A.prototype.method2 = function (i) {
		console .log( '2A#method'+i );
	};
	var B = function () {
		
	};
	B.prototype.method2 = function (i) {
		alert(this+'arguments=='+arguments);
	this._super( arguments );
	console .log( 'B#method'+i );
	};
	B.exten( A);
	//B.prototype = new A();
	var t = new Date().getTime();
	for(var i=0;i<1;i++){
		var b = new B();
		b.method2(100); // 打印出: A#method B#method
		//new A().method();
	}
	alert(new Date().getTime()-t);