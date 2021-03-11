module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "9896");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01d1":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("baa9");
var isArrayIteratorMethod = __webpack_require__("1a0a");
var toLength = __webpack_require__("a187");
var bind = __webpack_require__("0c1b");
var getIteratorMethod = __webpack_require__("203f");
var iteratorClose = __webpack_require__("cd08");

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator);
      throw error;
    }
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};


/***/ }),

/***/ "01e5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var global = __webpack_require__("f14a");
var getBuiltIn = __webpack_require__("902e");
var IS_PURE = __webpack_require__("941f");
var DESCRIPTORS = __webpack_require__("8fe5");
var NATIVE_SYMBOL = __webpack_require__("177b");
var USE_SYMBOL_AS_UID = __webpack_require__("34c7");
var fails = __webpack_require__("7ce6");
var has = __webpack_require__("2ccf");
var isArray = __webpack_require__("0914");
var isObject = __webpack_require__("97f5");
var anObject = __webpack_require__("baa9");
var toObject = __webpack_require__("f8d3");
var toIndexedObject = __webpack_require__("b7d9");
var toPrimitive = __webpack_require__("3de9");
var createPropertyDescriptor = __webpack_require__("1f88");
var nativeObjectCreate = __webpack_require__("a447");
var objectKeys = __webpack_require__("e505");
var getOwnPropertyNamesModule = __webpack_require__("a34a");
var getOwnPropertyNamesExternal = __webpack_require__("d085");
var getOwnPropertySymbolsModule = __webpack_require__("4b7d");
var getOwnPropertyDescriptorModule = __webpack_require__("38e3");
var definePropertyModule = __webpack_require__("d320");
var propertyIsEnumerableModule = __webpack_require__("9f6b");
var createNonEnumerableProperty = __webpack_require__("28e6");
var redefine = __webpack_require__("bbee");
var shared = __webpack_require__("afb0");
var sharedKey = __webpack_require__("6484");
var hiddenKeys = __webpack_require__("555d");
var uid = __webpack_require__("4f83");
var wellKnownSymbol = __webpack_require__("3086");
var wrappedWellKnownSymbolModule = __webpack_require__("ca66");
var defineWellKnownSymbol = __webpack_require__("bd91");
var setToStringTag = __webpack_require__("d1d6");
var InternalStateModule = __webpack_require__("28d0");
var $forEach = __webpack_require__("59bf").forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.es/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.es/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.es/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),

/***/ "01ea":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return baseFull; });
var baseFull = "" + "";


/***/ }),

/***/ "02ac":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),

/***/ "05e7":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("3086");
var create = __webpack_require__("a447");
var definePropertyModule = __webpack_require__("d320");

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "0664":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__("e6d2");
var requireObjectCoercible = __webpack_require__("4023");

// `String.prototype.repeat` method implementation
// https://tc39.es/ecma262/#sec-string.prototype.repeat
module.exports = ''.repeat || function repeat(count) {
  var str = String(requireObjectCoercible(this));
  var result = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};


/***/ }),

/***/ "07b4":
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__("b22b");
var classofRaw = __webpack_require__("36b2");
var wellKnownSymbol = __webpack_require__("3086");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),

/***/ "08b5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__("7ce6");

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

exports.UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});


/***/ }),

/***/ "0914":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("36b2");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),

/***/ "0c1b":
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__("02ac");

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "0f92":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* reexport */ render; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* reexport */ staticRenderFns; });

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartMapSetting.vue?vue&type=template&id=280f617a&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"10"}},[_c('template',{slot:"title"},[_vm._v(" 地图设置 ")]),_c('div',{staticClass:"blockDiv"},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("地图 ")]),_c('div',{staticStyle:{"display":"flex"}},[_c('i-select',{staticClass:"iSelect",staticStyle:{"width":"110px"},attrs:{"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.map),callback:function ($$v) {_vm.$set(_vm.mapOption, "map", $$v)},expression:"mapOption.map"}},_vm._l((_vm.allMapList),function(map,index){return _c('i-option',{key:index,attrs:{"value":map.name,"index":index}},[_vm._v(" "+_vm._s(map.label.substr(0, 5))+" ")])}),1),_c('i-button',{staticStyle:{"margin-left":"5px"},attrs:{"type":"primary","size":"small"},on:{"click":function($event){return _vm.mapManage(true)}}},[_vm._v("维护")])],1)]),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("比例 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"step":0.1,"max":2},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.zoom),callback:function ($$v) {_vm.$set(_vm.mapOption, "zoom", $$v)},expression:"mapOption.zoom"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体大小 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onGeoChange},model:{value:(_vm.mapOption.label_fontSize),callback:function ($$v) {_vm.$set(_vm.mapOption, "label_fontSize", $$v)},expression:"mapOption.label_fontSize"}})],1),(typeof _vm.mapOption.label_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.label_color),callback:function ($$v) {_vm.$set(_vm.mapOption, "label_color", $$v)},expression:"mapOption.label_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.label_color),callback:function ($$v) {_vm.$set(_vm.mapOption, "label_color", $$v)},expression:"mapOption.label_color"}})],1)])],1)],1):_vm._e(),(typeof _vm.mapOption.emphasis_label_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体高亮颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.emphasis_label_color),callback:function ($$v) {_vm.$set(_vm.mapOption, "emphasis_label_color", $$v)},expression:"mapOption.emphasis_label_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.emphasis_label_color),callback:function ($$v) {_vm.$set(_vm.mapOption, "emphasis_label_color", $$v)},expression:"mapOption.emphasis_label_color"}})],1)])],1)],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("区域线 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"step":0.1,"max":5},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.itemStyle_borderWidth),callback:function ($$v) {_vm.$set(_vm.mapOption, "itemStyle_borderWidth", $$v)},expression:"mapOption.itemStyle_borderWidth"}})],1),(typeof _vm.mapOption.itemStyle_areaColor !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("区域颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.itemStyle_areaColor),callback:function ($$v) {_vm.$set(_vm.mapOption, "itemStyle_areaColor", $$v)},expression:"mapOption.itemStyle_areaColor"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.itemStyle_areaColor),callback:function ($$v) {_vm.$set(_vm.mapOption, "itemStyle_areaColor", $$v)},expression:"mapOption.itemStyle_areaColor"}})],1)])],1)],1):_vm._e(),(typeof _vm.mapOption.emphasis_itemStyle_areaColor !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("区域高亮颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.emphasis_itemStyle_areaColor),callback:function ($$v) {_vm.$set(_vm.mapOption, "emphasis_itemStyle_areaColor", $$v)},expression:"mapOption.emphasis_itemStyle_areaColor"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.emphasis_itemStyle_areaColor),callback:function ($$v) {_vm.$set(_vm.mapOption, "emphasis_itemStyle_areaColor", $$v)},expression:"mapOption.emphasis_itemStyle_areaColor"}})],1)])],1)],1):_vm._e(),(typeof _vm.mapOption.itemStyle_borderColor !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("边框颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.itemStyle_borderColor),callback:function ($$v) {_vm.$set(_vm.mapOption, "itemStyle_borderColor", $$v)},expression:"mapOption.itemStyle_borderColor"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onGeoChange},model:{value:(_vm.mapOption.itemStyle_borderColor),callback:function ($$v) {_vm.$set(_vm.mapOption, "itemStyle_borderColor", $$v)},expression:"mapOption.itemStyle_borderColor"}})],1)])],1)],1):_vm._e()],1)],2),_c('div',[_c('Modal',{attrs:{"class-name":"vertical-center-modal-big","fullscreen":"true","loading":_vm.loading,"title":"地图维护"},on:{"on-cancel":_vm.callMapDb},model:{value:(_vm.mapListModal),callback:function ($$v) {_vm.mapListModal=$$v},expression:"mapListModal"}},[_c('i-form',{attrs:{"inline":"","label-width":85}},[_c('Row',[_c('i-col',{attrs:{"span":"6"}},[_c('form-item',{attrs:{"label":"名称:"}},[_c('i-input',{staticStyle:{"width":"253px"},attrs:{"type":"text","placeholder":"请输入名称"},model:{value:(_vm.queryParams.label),callback:function ($$v) {_vm.$set(_vm.queryParams, "label", $$v)},expression:"queryParams.label"}})],1)],1),_c('i-col',{attrs:{"span":"6"}},[_c('form-item',{attrs:{"label":"编码:"}},[_c('i-input',{staticStyle:{"width":"300px"},attrs:{"type":"text","placeholder":"请输入编码"},model:{value:(_vm.queryParams.name),callback:function ($$v) {_vm.$set(_vm.queryParams, "name", $$v)},expression:"queryParams.name"}})],1)],1),_c('i-col',{attrs:{"span":"2"}},[_c('i-button',{attrs:{"type":"primary","icon":"ios-search"},on:{"click":function($event){return _vm.loadData(1)}}},[_vm._v("查询")])],1),_c('i-col',{attrs:{"span":"2"}},[_c('i-button',{attrs:{"type":"primary","icon":"ios-refresh"},on:{"click":_vm.clearQuery}},[_vm._v("重置")])],1)],1)],1),_c('Row',{staticStyle:{"margin-top":"25px"}},[_c('i-col',{attrs:{"span":"3"}},[_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.addMapData}},[_vm._v("新增")])],1)],1),[_c('i-table',{staticStyle:{"margin-top":"1%"},attrs:{"border":"","stripe":"","columns":_vm.mapTab.columns,"data":_vm.mapTab.data}}),_c('div',{staticClass:"page"},[_c('Page',{attrs:{"total":_vm.page.total,"show-total":"","show-elevator":""},on:{"on-change":_vm.handleCurrentChange,"on-page-size-change":_vm.handleSizeChange}})],1)],_c('template',{slot:"footer"},[_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.callMapDb}},[_vm._v("关闭")])],1)],2),_c('Modal',{attrs:{"loading":_vm.loading,"title":"数据源","width":35},on:{"on-cancel":_vm.clearMapDb,"on-ok":_vm.saveMapDb},model:{value:(_vm.mapDataModal),callback:function ($$v) {_vm.mapDataModal=$$v},expression:"mapDataModal"}},[_c('div',{staticStyle:{"padding-right":"30px"}},[_c('i-form',{ref:"mapSource",attrs:{"model":_vm.mapSource,"rules":_vm.dataFormValidate,"label-colon":"","label-width":100}},[_c('form-item',{staticStyle:{"height":"50px"},attrs:{"prop":"label","label":"地图名称"}},[_c('i-input',{attrs:{"placeholder":"请输入地图名称"},model:{value:(_vm.mapSource.label),callback:function ($$v) {_vm.$set(_vm.mapSource, "label", $$v)},expression:"mapSource.label"}})],1),_c('form-item',{staticStyle:{"height":"50px"},attrs:{"prop":"name","label":"地图编码"}},[_c('i-input',{attrs:{"placeholder":"请输入地图编码"},model:{value:(_vm.mapSource.name),callback:function ($$v) {_vm.$set(_vm.mapSource, "name", $$v)},expression:"mapSource.name"}})],1),_c('form-item',{attrs:{"prop":"data","label":"地图数据"}},[_c('i-input',{attrs:{"type":"textarea","autosize":{ minRows: 15, maxRows: 15 },"placeholder":"请输入地图数据"},model:{value:(_vm.mapSource.data),callback:function ($$v) {_vm.$set(_vm.mapSource, "data", $$v)},expression:"mapSource.data"}}),_c('a',{attrs:{"href":"http://datav.aliyun.com/tools/atlas","target":"_blank"}},[_vm._v("地图数据json下载")])],1)],1)],1)])],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartMapSetting.vue?vue&type=template&id=280f617a&scoped=true&


/***/ }),

/***/ "1188":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");

module.exports = global;


/***/ }),

/***/ "11d8":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("2ccf");
var toObject = __webpack_require__("f8d3");
var sharedKey = __webpack_require__("6484");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__("c529");

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "16ca":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var fails = __webpack_require__("7ce6");
var isArray = __webpack_require__("0914");
var isObject = __webpack_require__("97f5");
var toObject = __webpack_require__("f8d3");
var toLength = __webpack_require__("a187");
var createProperty = __webpack_require__("98a5");
var arraySpeciesCreate = __webpack_require__("6827");
var arrayMethodHasSpeciesSupport = __webpack_require__("7041");
var wellKnownSymbol = __webpack_require__("3086");
var V8_VERSION = __webpack_require__("69a9");

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ "177b":
/***/ (function(module, exports, __webpack_require__) {

var IS_NODE = __webpack_require__("2083");
var V8_VERSION = __webpack_require__("69a9");
var fails = __webpack_require__("7ce6");

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  /* global Symbol -- required for testing */
  return !Symbol.sham &&
    // Chrome 38 Symbol has incorrect toString conversion
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    (IS_NODE ? V8_VERSION === 38 : V8_VERSION > 37 && V8_VERSION < 41);
});


/***/ }),

/***/ "1a0a":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("3086");
var Iterators = __webpack_require__("4de8");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "1a58":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("36b2");
var regexpExec = __webpack_require__("5a62");

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};



/***/ }),

/***/ "1bc7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("7ce6");
var getPrototypeOf = __webpack_require__("11d8");
var createNonEnumerableProperty = __webpack_require__("28e6");
var has = __webpack_require__("2ccf");
var wellKnownSymbol = __webpack_require__("3086");
var IS_PURE = __webpack_require__("941f");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if ((!IS_PURE || NEW_ITERATOR_PROTOTYPE) && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "1d10":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "1d43":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("8fe5");
var defineProperty = __webpack_require__("d320").f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),

/***/ "1e54":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__("bc46");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "1eaf":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMapSetting_vue_vue_type_style_index_0_id_280f617a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("afba");
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMapSetting_vue_vue_type_style_index_0_id_280f617a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMapSetting_vue_vue_type_style_index_0_id_280f617a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "1f04":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var getOwnPropertyDescriptor = __webpack_require__("38e3").f;
var createNonEnumerableProperty = __webpack_require__("28e6");
var redefine = __webpack_require__("bbee");
var setGlobal = __webpack_require__("9448");
var copyConstructorProperties = __webpack_require__("a123");
var isForced = __webpack_require__("dd95");

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "1f88":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "203f":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("07b4");
var Iterators = __webpack_require__("4de8");
var wellKnownSymbol = __webpack_require__("3086");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "2083":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("36b2");
var global = __webpack_require__("f14a");

module.exports = classof(global.process) == 'process';


/***/ }),

/***/ "2409":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "2456":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");

module.exports = global.Promise;


/***/ }),

/***/ "24a1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__("902e");
var definePropertyModule = __webpack_require__("d320");
var wellKnownSymbol = __webpack_require__("3086");
var DESCRIPTORS = __webpack_require__("8fe5");

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ "24a8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("8fe5");
var global = __webpack_require__("f14a");
var isForced = __webpack_require__("dd95");
var redefine = __webpack_require__("bbee");
var has = __webpack_require__("2ccf");
var classof = __webpack_require__("36b2");
var inheritIfRequired = __webpack_require__("83d4");
var toPrimitive = __webpack_require__("3de9");
var fails = __webpack_require__("7ce6");
var create = __webpack_require__("a447");
var getOwnPropertyNames = __webpack_require__("a34a").f;
var getOwnPropertyDescriptor = __webpack_require__("38e3").f;
var defineProperty = __webpack_require__("d320").f;
var trim = __webpack_require__("f8d5").trim;

var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classof(create(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classof(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
    // ESNext
    'fromString,range'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global, NUMBER, NumberWrapper);
}


/***/ }),

/***/ "2606":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("2ccf");
var toIndexedObject = __webpack_require__("b7d9");
var indexOf = __webpack_require__("8141").indexOf;
var hiddenKeys = __webpack_require__("555d");

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "27ae":
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__("b22b");
var redefine = __webpack_require__("bbee");
var toString = __webpack_require__("acce");

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ "28d0":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__("5055");
var global = __webpack_require__("f14a");
var isObject = __webpack_require__("97f5");
var createNonEnumerableProperty = __webpack_require__("28e6");
var objectHas = __webpack_require__("2ccf");
var shared = __webpack_require__("db94");
var sharedKey = __webpack_require__("6484");
var hiddenKeys = __webpack_require__("555d");

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "28e6":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("8fe5");
var definePropertyModule = __webpack_require__("d320");
var createPropertyDescriptor = __webpack_require__("1f88");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "2b31":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__("c462");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "2ccf":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "2e38":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__("baa9");

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "2ed9":
/***/ (function(module, exports, __webpack_require__) {

var userAgent = __webpack_require__("3902");

module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);


/***/ }),

/***/ "2f9a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var exportApi = {
  reportId: '40',
  // 报表ID

  /**
   * 移动图表
   * @param {string} chartId 图表Id
   * @param {number[]} position 偏移量 [0, 0]
   */
  updateLayerOffset: function updateLayerOffset(chartId, offset) {},

  /**
   * 弹出提示信息
   * @param {string} message 
   */
  tip: function tip(message) {},

  /**
   * 设置单元格的属性
   * @param {number} ri 行下标
   * @param {number} ci 列下标
   * @param {number} prop 属性
   */
  cellProp: function cellProp(ri, ci, prop) {},

  /**
   * 设置背景
   * @param {Object} setting 背景配置
   */
  setBackground: function setBackground(setting) {},

  /**
   * 更新图表
   * @param {string} chartId 图标ID
   * @param {Object} setting 图表配置
   */
  updateChart: function updateChart(chartId, setting) {},

  /**
   * 更新图表其他配置信息（如chartId, chartType）
   * @param {string} chartId 图标ID
   * @param {Object} setting 图表配置
   */
  updateChartExtData: function updateChartExtData(chartId, setting) {},

  /**
   * 添加图表
   * @param {Object} option Echarts 图表配置
   * @param {*} configUrl Echarts 图表配置 API，用于请求此配置信息，可选
   * @param {(chartInfo)=>{}} callback 回调方法
   */
  addChart: function addChart(option, configUrl, callback) {},

  /**
   * 保存表达式
   * @param {Object} expression 表达式
   */
  setSelectCellExpress: function setSelectCellExpress(expression) {},

  /**
   * 注册地图
   * @param {string} type 地图类型，如 china
   * @param {Object} mapData 地图数据
   */
  registerMap: function registerMap(type, mapData) {},

  /**
   * 获取电子表格的数据，需要将电子表格的数据传入回调方法
   * @param {(excelData) => {}} callback 回调
   */
  getExcelData: function getExcelData(callback) {
    typeof callback === 'function' && callback({});
  },

  /**
   * 将数据加载到电子表格，与电子表格的 loadData 一致
   * @param {Object} datas 需要加载的数据
   */
  loadData: function loadData(datas) {}
};
/* harmony default export */ __webpack_exports__["a"] = (exportApi);

/***/ }),

/***/ "3086":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var shared = __webpack_require__("afb0");
var has = __webpack_require__("2ccf");
var uid = __webpack_require__("4f83");
var NATIVE_SYMBOL = __webpack_require__("177b");
var USE_SYMBOL_AS_UID = __webpack_require__("34c7");

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (NATIVE_SYMBOL && has(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "31e1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__("b7d9");
var addToUnscopables = __webpack_require__("05e7");
var Iterators = __webpack_require__("4de8");
var InternalStateModule = __webpack_require__("28d0");
var defineIterator = __webpack_require__("e8d3");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "3269":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "3337":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var $map = __webpack_require__("59bf").map;
var arrayMethodHasSpeciesSupport = __webpack_require__("7041");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "34c7":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__("177b");

module.exports = NATIVE_SYMBOL
  /* global Symbol -- safe */
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "3621":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "3689":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("db94");

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "36b2":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "36c9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartDatasourceSetting_vue_vue_type_style_index_0_id_63fb805c_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3621");
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartDatasourceSetting_vue_vue_type_style_index_0_id_63fb805c_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartDatasourceSetting_vue_vue_type_style_index_0_id_63fb805c_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "36d7":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};


/***/ }),

/***/ "3768":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("4023");

var quot = /"/g;

// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
// https://tc39.es/ecma262/#sec-createhtml
module.exports = function (string, tag, attribute, value) {
  var S = String(requireObjectCoercible(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};


/***/ }),

/***/ "38e3":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("8fe5");
var propertyIsEnumerableModule = __webpack_require__("9f6b");
var createPropertyDescriptor = __webpack_require__("1f88");
var toIndexedObject = __webpack_require__("b7d9");
var toPrimitive = __webpack_require__("3de9");
var has = __webpack_require__("2ccf");
var IE8_DOM_DEFINE = __webpack_require__("e15d");

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),

/***/ "3902":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("902e");

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ "3b2b":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("1f04");
var assign = __webpack_require__("cc2e");

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
$({ target: 'Object', stat: true, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),

/***/ "3bae":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var DOMIterables = __webpack_require__("8c0f");
var forEach = __webpack_require__("d0fa");
var createNonEnumerableProperty = __webpack_require__("28e6");

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}


/***/ }),

/***/ "3de9":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("97f5");

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "4023":
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "4116":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ _toConsumableArray; });

// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/arrayLikeToArray.js
var arrayLikeToArray = __webpack_require__("fbb5");

// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return Object(arrayLikeToArray["a" /* default */])(arr);
}
// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.symbol.js
var es_symbol = __webpack_require__("01e5");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.symbol.description.js
var es_symbol_description = __webpack_require__("e487");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__("27ae");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.symbol.iterator.js
var es_symbol_iterator = __webpack_require__("c2f8");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.string.iterator.js
var es_string_iterator = __webpack_require__("591f");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.array.iterator.js
var es_array_iterator = __webpack_require__("31e1");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator = __webpack_require__("feb3");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.array.from.js
var es_array_from = __webpack_require__("7a3a");

// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/iterableToArray.js








function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/unsupportedIterableToArray.js
var unsupportedIterableToArray = __webpack_require__("b63d");

// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || Object(unsupportedIterableToArray["a" /* default */])(arr) || _nonIterableSpread();
}

/***/ }),

/***/ "4200":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var IndexedObject = __webpack_require__("4f06");
var toIndexedObject = __webpack_require__("b7d9");
var arrayMethodIsStrict = __webpack_require__("d714");

var nativeJoin = [].join;

var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),

/***/ "46cb":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "47b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var $findIndex = __webpack_require__("59bf").findIndex;
var addToUnscopables = __webpack_require__("05e7");

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-array.prototype.findindex
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);


/***/ }),

/***/ "4978":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("902e");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "4b7d":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "4d70":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "4de8":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "4f06":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("7ce6");
var classof = __webpack_require__("36b2");

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),

/***/ "4f83":
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),

/***/ "5055":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var inspectSource = __webpack_require__("3689");

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),

/***/ "50e5":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return typeJudge; });
/* unused harmony export addChartModalSelectedStyle */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return handleChartOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return handleChartExtData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return subStringStr; });
/* unused harmony export json2Config */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return queryApiData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return querySqlData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return config2Json; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return xsSetNewdata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return setExcelData; });
/* unused harmony export handleMultiUnderline */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getSelectType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return refreshChart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addChartPreHandler; });
/* harmony import */ var D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4116");
/* harmony import */ var D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ae1d");
/* harmony import */ var D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("8d67");
/* harmony import */ var D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("f076");
/* harmony import */ var D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("6e8c");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("3337");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("e3b5");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("3bae");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("1d43");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("3b2b");
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("5d08");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("27ae");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("16ca");
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_array_join_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("4200");
/* harmony import */ var core_js_modules_es_array_join_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_join_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("5b12");
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("9b5f");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("fc13");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("62f9");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var core_js_modules_es_string_repeat_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("90aa");
/* harmony import */ var core_js_modules_es_string_repeat_js__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_repeat_js__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("d447");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("ca00");
/* harmony import */ var _utils_config__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("01ea");
/* harmony import */ var _exportApi__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("2f9a");























var vm = {}; // 选中绑定配置

function json2Config(echartInfo, dataAllocation, option) {
  //样式
  json2ConfigStyle(echartInfo, option, option.series[0].type); //根据图表类型处理数据

  if (option.series[0].type === 'bar' || option.series[0].type === 'line' || option.series[0].type === 'scatter') {
    var optdata = '{"categories":' + JSON.stringify(option.xAxis.data ? option.xAxis.data : '', null, "\t") + "," + '"series":' + JSON.stringify(option.series, null, "\t") + "}";
    dataAllocation.optionData = optdata;
  } else if (option.series[0].type === 'pie' || option.series[0].type === 'radar') {
    dataAllocation.optionData = JSON.stringify(option.series[0].data, null, "\t");

    if (option.series[0].data.length > 0) {
      //自定义颜色配置
      var data = option.series[0].data.map(function (item) {
        var color = {
          "color1": null
        };

        if (item.itemStyle) {
          color = {
            "color1": item.itemStyle.color
          };
        }

        return color;
      });
      echartInfo.colorMatchData = data.filter(function (item) {
        return item.color1 && item.color1.length > 0;
      });
    }
  } else if (option.series[0].type === 'map') {
    dataAllocation.optionData = null;
  }
} //配置刷新运行json


function config2Json(echartInfo, optionData, selectOptionData) {
  //根据类型处理数据
  var obj = optionData && optionData.length > 0 ? JSON.parse(optionData) : null;

  if (selectOptionData.series[0].type === 'bar' || selectOptionData.series[0].type === 'line' || selectOptionData.series[0].type === 'scatter') {
    selectOptionData.xAxis.data = obj.categories;
    selectOptionData.series = obj.series;
  } else if (selectOptionData.series[0].type === 'pie') {
    var copyObj = JSON.parse(JSON.stringify(obj)); //是否排序

    copyObj = echartInfo.autoSort ? copyObj.sort(function (a, b) {
      return a.value - b.value;
    }) : obj;
    copyObj.forEach(function (item, index) {
      //设置颜色
      var color = getMatchColor(echartInfo, index);

      if (item.itemStyle) {
        item.itemStyle.color = color;
      } else {
        item.itemStyle = {
          'color': color
        }; //Vue.set(item, 'itemStyle', {'color':color})
      }
    });
    selectOptionData.series[0].data = copyObj; // 图例数据设置

    selectOptionData.legend.data = selectOptionData.series[0].data.map(function (item) {
      return item.name;
    });
  } else if (selectOptionData.series[0].type === 'map') {
    if (obj && obj.length > 0) {
      selectOptionData.geo.map = obj[0].name;
    } else {
      selectOptionData.geo.map = 'china';
    }
  } //样式


  config2JsonStyle(selectOptionData, echartInfo, selectOptionData.series[0].type);
  return selectOptionData;
}
/**
 * 转换请求 api 数据
 * @param {string} charType 图表类型
 * @param {Object} result API返回结果 { data }
 * @param {Object} optionData Echarts 的 option 配置
 */


function queryApiData(charType, result, optionData) {
  var obj = optionData && optionData.length > 0 ? JSON.parse(optionData) : null;

  if (charType === 'bar' || charType === 'line') {
    var xAxisData = [];
    var seriesData = [];
    result.data.forEach(function (item) {
      for (var d in item) {
        if (d === 'name') {
          xAxisData.push(item[d]);
        }

        if (d === 'value') {
          seriesData.push(item[d]);
        }
      }
    });
    obj.categories = xAxisData; //包含分类多组数据处理

    if (result.category) {
      var series = []; //设置图例数据

      vm.echartInfo.legendData = result.category;
      result.category.forEach(function (name, index) {
        //获取series默认样式
        var commonObj = Object.assign(obj.series[0], {
          name: name,
          data: []
        }); //判断原有样式是否存在

        var hasSeries = obj.series.filter(function (item) {
          return item.name === name;
        });

        if (hasSeries != null && hasSeries.length > 0) {
          commonObj = Object.assign(hasSeries[0], {
            name: name,
            data: []
          });
        } //多种图表的series公共样式获取

        /* if(result.type && result.type.length>0){
             let filter = obj.series.filter(serie=>serie.type == result.type[index]);
             if(filter&&filter.length>0){
                 commonObj=Object.assign(filter[0],{name:name,data:[]});
             }
         }*/


        var seriesObj = JSON.parse(JSON.stringify(commonObj)); //获取series的data数据集

        seriesObj.data = seriesData.map(function (item) {
          return item[index];
        });
        series[index] = seriesObj;
      });
      obj.series = series;
    } else {
      obj.series[0].data = seriesData;
    }

    return obj;
  } else if (charType === 'pie') {
    obj = result.data;
    return obj;
  } else if (charType === 'scatter') {
    obj.series[0].data = result.data.map(function (item) {
      return [item.name, item.value];
    });
    return obj;
  } else if (charType === 'map') {
    obj = result.data;
    _exportApi__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"].registerMap(obj[0].name, obj[0].map);
    return obj;
  }
}
/**
 * 转换请求sql数据
 * @param {*} charType 
 * @param {*} result 
 * @param {*} sqlxAxis 
 * @param {*} sqlseries 
 * @param {*} sqlgroup 
 * @param {*} seriesTypeData 
 * @param {*} optionData 
 */


function querySqlData(charType, result, sqlxAxis, sqlseries, sqlgroup, seriesTypeData, optionData) {
  var obj = JSON.parse(optionData);
  var resultArr = JSON.parse(JSON.stringify(result)); //记录结果集数据

  if (charType === 'bar' || charType === 'line') {
    var xAxisData = [];
    var seriesData = [];
    var legendData = []; //图例数据
    //饼图、柱形图特有样式

    var linestyle = {
      "yAxisIndex": 1,
      "step": false,
      "showSymbol": true,
      "smooth": false,
      "symbolSize": 5,
      "lineStyle": {
        "width": 2
      }
    };
    var barstyle = {
      "barWidth": 15,
      "barMinHeight": 2
    };
    result.forEach(function (item) {
      for (var d in item) {
        if (xAxisData.indexOf(item[d]) != -1) {
          var index = xAxisData.indexOf(item[d]);
          seriesData[index] = parseFloat(seriesData[index]) + parseFloat(item[sqlseries]);
          delete item[sqlseries];
        } else {
          if (d === sqlxAxis) {
            xAxisData.push(item[d]);
          }

          if (d === sqlseries) {
            seriesData.push(item[d]);
          }

          if (d === sqlgroup && legendData.indexOf(item[d]) == -1) {
            legendData.push(item[d]);
          }
        }
      }
    });
    obj.categories = xAxisData; //图例数据大于0，多组分类数据

    if (legendData.length > 1) {
      //设置图例数据
      vm.echartInfo.legendData = legendData; //处理分组数据

      var series = [];
      legendData.forEach(function (name, index) {
        //获取series公共样式
        var commonObj = Object.assign(obj.series[0], {
          name: name,
          data: []
        });

        if (legendData.length > 1) {
          //多组多案例
          var hasSeries = obj.series.filter(function (item) {
            return item.name === name;
          });

          if (hasSeries != null && hasSeries.length > 0) {
            //设置存在好的样式
            commonObj = Object.assign(hasSeries[0], {
              name: name,
              data: []
            });
          } //自定义的图表类型（折柱）


          if (vm.specialChartType === 'linebar') {
            //判断系列自定义样式
            var filterArr = seriesTypeData.filter(function (seriesType) {
              return seriesType.name === name;
            }); //获取到对应系列的类型

            if (filterArr && filterArr.length > 0) {
              //判断系列自定义样式
              var type = filterArr[0].type;

              if (type === 'line') {
                commonObj = Object.assign({
                  name: name,
                  data: [],
                  type: type,
                  itemStyle: obj.series[0].itemStyle
                }, linestyle);
              } else {
                //柱子样式
                var itemStyle = JSON.parse(JSON.stringify(obj.series[0].itemStyle));

                if (Object.prototype.toString.call(itemStyle.normal.barBorderRadius).slice(8, -1) === 'Undefined') {
                  itemStyle.normal.barBorderRadius = 0;
                }

                commonObj = Object.assign({
                  name: name,
                  data: [],
                  type: type,
                  itemStyle: itemStyle
                }, barstyle);
              }
            }
          }
        }

        var seriesObj = JSON.parse(JSON.stringify(commonObj)); //获取series的data数据集

        var _iterator = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(resultArr),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;

            if (seriesObj.data.length == xAxisData.length) {
              break;
            }

            if (item[sqlgroup] === name) {
              seriesObj.data.push(item[sqlseries]);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        series[index] = seriesObj;
      });
      obj.series = series;
    } else {
      obj.series[0].data = seriesData;
    }

    return obj;
  } else if (charType === 'pie') {
    var objpie = [];
    result.forEach(function (item) {
      var objres = {};

      for (var d in item) {
        if (d === sqlxAxis) {
          objres['name'] = item[d];
        }

        if (d === sqlseries) {
          objres['value'] = item[d];
        }
      }

      objpie.push(objres);
    });
    obj = mergeObject(objpie);
    return obj;
  } else if (charType === 'scatter') {
    obj.series[0].data = result.map(function (item) {
      return [item[sqlxAxis], item[sqlseries]];
    });
    return obj;
  }
} // 数组对象去重


function mergeObject(array) {
  var arrayFilted = [];
  array.forEach(function (value) {
    if (arrayFilted.length == 0) {
      arrayFilted.push(value);
    } else {
      var flag = true;
      arrayFilted.forEach(function (valueIndex) {
        if (valueIndex.name && valueIndex.name === value.name) {
          valueIndex.value = valueIndex.value + value.value;
          flag = false;
        }
      });

      if (flag) {
        arrayFilted.push(value);
      }
    }
  });
  return arrayFilted;
}

function xsSetNewdata(data, newxsdata) {
  xs.data.rows["_"][data.sri].cells[data.sci].text = newxsdata;
  vm.excel.excelValue = newxsdata;
  xs.sheet.reload();
}

function setExcelData(_ref, text) {
  var _ref$ri = _ref.ri,
      ri = _ref$ri === void 0 ? 0 : _ref$ri,
      _ref$ci = _ref.ci,
      ci = _ref$ci === void 0 ? 0 : _ref$ci;
  var isDrag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var style = arguments.length > 3 ? arguments[3] : undefined;
  var merge = arguments.length > 4 ? arguments[4] : undefined;

  var cell = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])({}, ci, {
    "text": text
  }); //第一个单元格样式


  if (style || style == 0) {
    cell[ci]['style'] = style;
  }

  if (merge) {
    //加入合并单元格
    cell[ci]["merge"] = merge;
  }

  var tableData = {};
  var rowsData = xs.getData().rows;

  if (rowsData[ri]) {
    //有数据
    var cells = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])({}, rowsData[ri].cells), cell);

    tableData = {
      "rows": Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])({}, rowsData), {}, Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])({}, ri, {
        cells: cells,
        isDrag: isDrag
      }))
    };
  } else {
    tableData = {
      "rows": Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])({}, rowsData), {}, Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])({}, ri, {
        "cells": cell,
        isDrag: isDrag
      }))
    };
  } //加入高度设置


  var row = xs.getData().rows[ri];
  var height = row && row.height;

  if (height) {
    tableData.rows[ri].height = height;
  }

  _exportApi__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"].loadData(Object.assign({}, tableData, {
    background: xs.data.background
  }));
}

function setExcelCoordinate(ev) {
  var data = xs.data.getCellRectByXY(ev.offsetX, ev.offsetY);
  if (data.ri < 0 || data.ci < 0) return;
  vm.excel.coordinate = "".concat(data.ri, ",").concat(data.ci);
  vm.excel.ri = data.ri;
  vm.excel.ci = data.ci;
}

function getMatchColor(echartInfo, index) {
  var matchColors = echartInfo.colorMatchData || [];

  if (matchColors && matchColors[index]) {
    var color1 = matchColors[index].color1;
    return color1;
  } else {
    return null;
  }
}

function subStringStr(str, strStart, strEnd) {
  /* 找出指定的2个字符在 该字符串里面的 位置 */
  var strStartIndex = str.indexOf(strStart);
  var strEndIndex = str.indexOf(strEnd);
  /* index 为负数 即表示该字符串中 没有该字符 */

  if (strStartIndex < 0) {
    return "";
  }

  if (strEndIndex < 0) {
    return "";
  }
  /* 开始截取 */


  var result = str.substring(strStartIndex, strEndIndex).substring(strStart.length);
  return result;
} // //单击事件
// sheetDiv.onclick = function (ev) {
//   Object.keys(vm.excel).map(k => {
//     vm.excel[k] = ''
//   })
//   setExcelCoordinate(ev);
//   let row = xs.getData().rows[vm.excel.ri];
//   let text = "";
//   if (row) {
//     text = row.cells[vm.excel.ci] ? row.cells[vm.excel.ci].text : "";
//   }
//   vm.excel.excelValue = text;
//   vm.excel.hasGroup = false
//   let cellMe = [];
//   if (text && text != "") {
//     if (text.indexOf("#{") != -1) {
//       cellMe = subStringStr(text, "#{", "}").split(".");
//       vm.excel.hasGroup = true
//     } else if (text.indexOf("${") != -1) {
//       cellMe = subStringStr(text, "${", "}").split(".");
//     }
//     let field = cellMe[1] || ''
//     if (field.indexOf("group(") != -1) {
//       vm.excel.polyWay = "group"
//     } else {
//       vm.excel.polyWay = "select"
//     }
//     if (field.indexOf("groupRight(") != -1) {
//       vm.excel.direction = "right"
//       vm.excel.polyWay = "group"
//       // vm.$refs.excelPolyWay.disabled = true;
//     } else {
//       vm.excel.direction = "down"
//       //  vm.$refs.excelPolyWay.disabled = false;
//     }
//     if (field.indexOf("eachTitle(") != -1) {
//       vm.excel.advanced = "title"
//     } else if (field.indexOf("dynamic(") != -1) {
//       vm.excel.advanced = "dynamic"
//     } else {
//       vm.excel.advanced = "default"
//     }
//     vm.excel.isDict = row.cells[vm.excel.ci] ? row.cells[vm.excel.ci].isDict : "";
//     vm.excel.dictCode = row.cells[vm.excel.ci] ? row.cells[vm.excel.ci].dictCode : "";
//   }
// }
// // 拖拽结束
// sheetDiv.ondrop = function (ev) {
//   ev.preventDefault();
//   let id = ev.dataTransfer.getData('id');
//   let dbText = ev.dataTransfer.getData('dbText').trim();
//   dbText = vm.treeObj[dbText];
//   //获取实际的字段名,根据是否是列表属性 设置表达式#/$
//   let dbFieldSpan = document.getElementById(id).querySelector('.jm-db-field')
//   //设置pop后的text文本获取
//   let text = dbFieldSpan.innerHTML.trim();
//   let isList = dbFieldSpan.getAttribute('isList');
//   vm.excel.hasGroup = isList ? true : false;
//   let excelExpressChar = isList ? '#' : '$';
//   let excelText = `${excelExpressChar}{${dbText}.${text}}`;
//   excelText = excelText.replace(/\((.+?)\)/g, '');
//   let {
//     ri,
//     ci
//   } = xs.data.getCellRectByXY(ev.offsetX, ev.offsetY);
//   vm.excel.excelValue = excelText;
//   vm.excel.coordinate = `${ri},${ci}`;
//   vm.excel.ri = ri;
//   vm.excel.ci = ci;
//   vm.excel.polyWay = 'select';
//   vm.excel.direction = 'down';
//   xs.cellText(ri, ci, excelText)
//   //设置撤销操作
//   xs.sheet.toolbar.undoEl.setState(false);
//   //{"rows":{"3":{"cells":{"5":{"text":""}}},"len":100}}
//   const rowData = JSON.parse(JSON.stringify(xs.data.rows["_"]));
//   rowData[ri]["cells"][ci].text = "";
//   xs.data.history.undoItems.push(JSON.stringify({
//     "rows": rowData
//   }));
// };
//图表选中样式绑定


function json2ConfigStyle(echartInfo, option, charType) {
  //标题
  echartInfo.titleText = option.title.text ? option.title.text : '';
  echartInfo.titleFontSize = option.title.textStyle.fontSize ? option.title.textStyle.fontSize : 20;
  echartInfo.titleFontWeight = option.title.textStyle.fontSize ? option.title.textStyle.fontWeight : 'bolder';
  echartInfo.titleColor = option.title.textStyle.color ? option.title.textStyle.color : '#c43632';
  echartInfo.titleLocation = option.title.left; //饼图

  if (charType === 'pie') {
    echartInfo.isRadius = option.series[0].isRadius;
    echartInfo.radius = option.series[0].isRadius ? option.series[0].pieRadius : '55%';

    if (option.series[0].isRadius) {
      echartInfo.pieRadius = option.series[0].pieRadius ? option.series[0].pieRadius : '45%,55%';
    }

    echartInfo.roseType = option.series[0].roseType == 'radius' ? true : false;
    echartInfo.minAngle = option.series[0].minAngle;
    echartInfo.pieLabelPosition = option.series[0].label.position;
    echartInfo.autoSort = option.series[0].autoSort;
    echartInfo.notCount = option.series[0].notCount; //数值显示

    echartInfo.numerShow = option.series[0].label.show;
    echartInfo.numerTextSize = option.series[0].label.textStyle.fontSize;
    echartInfo.numerTextcol = option.series[0].label.textStyle.color;
    echartInfo.numerTextweig = option.series[0].label.textStyle.fontWeight; //边距

    echartInfo.gridLeft = option.series[0].left;
    echartInfo.gridTop = option.series[0].top;
    echartInfo.gridRight = option.series[0].right;
    echartInfo.gridBottom = option.series[0].bottom;
  }

  if (charType === 'bar' || charType === 'line' || charType === 'scatter') {
    //series为多数据多图表的处理
    var colorList = [];
    option.series.forEach(function (item) {
      if (item.type === 'bar') {
        //柱体
        echartInfo.barWidth = item.barWidth;
        echartInfo.barRadius = item.itemStyle.normal.barBorderRadius;
        echartInfo.barMinHeight = item.barMinHeight;
        echartInfo.seriesItemNorCol = option.series.length == 1 ? item.itemStyle.normal.color : '';
        if (vm.isMultiChart && item.itemStyle.normal.color) colorList.push({
          name: item.name,
          color1: item.itemStyle.normal.color
        });
      }

      if (item.type === 'line') {
        echartInfo.step = item.step; //阶梯线图

        echartInfo.showSymbol = item.showSymbol; //标记点

        echartInfo.smooth = item.smooth; //平滑曲线

        echartInfo.symbolSize = item.symbolSize; // 设置折线上圆点大小

        echartInfo.linewidth = item.lineStyle.width; // 设置线宽

        echartInfo.seriesLinemNorCol = option.series.length == 1 ? item.lineStyle.color : null; //线条颜色

        if (vm.isMultiChart && item.lineStyle.color) colorList.push({
          name: item.name,
          color1: item.lineStyle.color
        });
      }

      if (item.type === 'scatter') {
        echartInfo.seriesItemNorCol = item.itemStyle.normal.color ? item.itemStyle.normal.color : '';
        echartInfo.symbolSize = item.symbolSize; // 设置折线上圆点大小
      }
    });
    if (vm.isMultiChart) echartInfo.colorMatchData = vm.uniqueArr(colorList).map(function (color) {
      if (color.color1) return {
        color1: color.color1
      };
    }); //X轴

    echartInfo.xaxisShow = option.xAxis.show;
    echartInfo.xaxisText = option.xAxis.name;
    echartInfo.xaxisLine = option.xAxis.splitLine.show;
    echartInfo.xaxisLinecol = option.xAxis.splitLine.lineStyle.color;
    echartInfo.xaxisTextsize = option.xAxis.axisLabel.textStyle.fontSize;
    echartInfo.axisLabelRotate = option.xAxis.axisLabel.rotate; //Y轴（多数据处理）

    var yAxis = typeJudge(option.yAxis, 'Array') ? option.yAxis[0] : option.yAxis;
    var yAxisName = typeJudge(option.yAxis, 'Array') ? option.yAxis.map(function (item) {
      return item.name;
    }).join(",") : option.yAxis.name;
    echartInfo.yaxisShow = yAxis.show;
    echartInfo.yaxisText = yAxisName;
    echartInfo.yaxisLine = yAxis.splitLine.show;
    echartInfo.yaxisLinecol = yAxis.splitLine.lineStyle.color;
    echartInfo.yaxisTextsize = yAxis.axisLabel.textStyle.fontSize; //数值显示

    echartInfo.numerShow = option.series[0].itemStyle.normal.label.show;
    echartInfo.numerTextSize = option.series[0].itemStyle.normal.label.textStyle.fontSize;
    echartInfo.numerTextcol = option.series[0].itemStyle.normal.label.textStyle.color;
    echartInfo.numerTextweig = option.series[0].itemStyle.normal.label.textStyle.fontWeight; //轴边距

    echartInfo.gridLeft = option.grid.left;
    echartInfo.gridTop = option.grid.top;
    echartInfo.gridRight = option.grid.right;
    echartInfo.gridBottom = option.grid.bottom; //轴线和字体颜色

    echartInfo.axisLabelTextCol = option.xAxis.axisLabel.textStyle.color;
    echartInfo.axisLineLineCol = option.xAxis.axisLine.lineStyle.color;
  }

  if (charType === 'map') {
    //区域线的宽度、颜色、区域颜色
    echartInfo.scale = option.geo.zoom;
    echartInfo.xaxisTextsize = option.geo.label.fontSize;
    echartInfo.numerTextcol = option.geo.label.color;
    echartInfo.numerTextHighCol = option.geo.emphasis.label.color;
    echartInfo.borderWidth = option.geo.itemStyle.borderWidth;
    echartInfo.areaCol = option.geo.itemStyle.areaColor;
    echartInfo.areaHighCol = option.geo.emphasis.itemStyle.areaColor;
    echartInfo.borderCol = option.geo.itemStyle.borderColor;
    echartInfo.gridLeft = option.geo.left;
    echartInfo.gridTop = option.geo.top;
    echartInfo.gridRight = option.geo.right;
    echartInfo.gridBottom = option.geo.bottom;
  } else {
    //提示框
    echartInfo.tooltipShow = option.tooltip.show;
    echartInfo.tooltipTextSize = option.tooltip.textStyle.fontSize;
    echartInfo.tooltipTextcol = option.tooltip.textStyle.color; //图例

    echartInfo.legendShow = option.legend.show;
    echartInfo.legendData = option.legend.data;
    echartInfo.legendTop = option.legend.top;
    echartInfo.legendLeft = option.legend.left;
    echartInfo.legendOrient = option.legend.orient;
    echartInfo.legendTextcol = option.legend.textStyle.color ? option.legend.textStyle.color : '';
    echartInfo.legendTextsize = option.legend.textStyle.fontSize;
  }
} //图表运行json数据样式


function config2JsonStyle(selectOptionData, echartInfo, charType) {
  //标题
  selectOptionData.title.text = echartInfo.titleText;
  selectOptionData.title.textStyle.fontSize = echartInfo.titleFontSize;
  selectOptionData.title.textStyle.fontWeight = echartInfo.titleFontWeight;
  selectOptionData.title.textStyle.color = echartInfo.titleColor;
  selectOptionData.title.left = echartInfo.titleLocation;

  if (charType === 'pie') {
    //饼图
    selectOptionData.series[0].isRadius = echartInfo.isRadius;
    selectOptionData.series[0].radius = echartInfo.isRadius ? echartInfo.pieRadius.split(',') : '55%';
    selectOptionData.series[0].pieRadius = echartInfo.isRadius ? echartInfo.pieRadius : '45%,55%';
    selectOptionData.series[0].roseType = echartInfo.roseType ? 'radius' : "";
    selectOptionData.series[0].minAngle = echartInfo.minAngle;
    selectOptionData.series[0].label.position = echartInfo.pieLabelPosition;
    selectOptionData.series[0].notCount = echartInfo.notCount;
    selectOptionData.series[0].autoSort = echartInfo.autoSort; //数值显示

    selectOptionData.series[0].label.show = echartInfo.numerShow;
    selectOptionData.series[0].label.textStyle.fontSize = echartInfo.numerTextSize;
    selectOptionData.series[0].label.textStyle.color = echartInfo.numerTextcol;
    selectOptionData.series[0].label.textStyle.fontWeight = echartInfo.numerTextweig; //轴边距

    selectOptionData.series[0].left = echartInfo.gridLeft;
    selectOptionData.series[0].top = echartInfo.gridTop;
    selectOptionData.series[0].right = echartInfo.gridRight;
    selectOptionData.series[0].bottom = echartInfo.gridBottom;
  }

  if (charType === 'bar' || charType === 'line' || charType === 'scatter') {
    //多数据多图表处理
    selectOptionData.series.forEach(function (item) {
      //柱体样式
      if (item.type == 'bar') {
        item.barWidth = echartInfo.barWidth;
        item.barMinHeight = echartInfo.barMinHeight;
        item.itemStyle.normal.barBorderRadius = echartInfo.barRadius;
        item.itemStyle.normal.color = echartInfo.seriesItemNorCol;

        if (vm.isMultiChart) {
          echartInfo.legendData.forEach(function (name, index) {
            if (name === item.name) {
              if (echartInfo.colorMatchData[index]) item.itemStyle.normal.color = echartInfo.colorMatchData[index].color1;
            }
          });
        }
      } //折线样式


      if (item.type == 'line') {
        item.step = echartInfo.step; //阶梯线图

        item.showSymbol = echartInfo.showSymbol; //标记点

        item.symbolSize = echartInfo.symbolSize; // 设置折线上圆点大小

        item.smooth = echartInfo.smooth; //平滑曲线

        item.lineStyle.width = echartInfo.linewidth; // 设置线宽

        item.lineStyle.color = echartInfo.seriesLinemNorCol;

        if (vm.isMultiChart) {
          echartInfo.legendData.forEach(function (name, index) {
            if (name === item.name) {
              if (echartInfo.colorMatchData[index]) item.lineStyle.color = echartInfo.colorMatchData[index].color1;
            }
          });
        }
      }

      if (item.type === 'scatter') {
        item.itemStyle.normal.color = echartInfo.seriesItemNorCol;
        item.symbolSize = echartInfo.symbolSize; // 设置折线上圆点大小
      }
    }); //X轴样式

    selectOptionData.xAxis.show = echartInfo.xaxisShow;
    selectOptionData.xAxis.name = echartInfo.xaxisText;
    selectOptionData.xAxis.splitLine.show = echartInfo.xaxisLine;
    selectOptionData.xAxis.splitLine.lineStyle.color = echartInfo.xaxisLinecol;
    selectOptionData.xAxis.axisLabel.textStyle.fontSize = echartInfo.xaxisTextsize;
    selectOptionData.xAxis.axisLabel.rotate = echartInfo.axisLabelRotate; //Y轴样式

    if (typeJudge(selectOptionData.yAxis, 'Array')) {
      selectOptionData.yAxis[0].splitLine.show = echartInfo.yaxisLine; //多y轴分割线显示设置

      selectOptionData.yAxis.forEach(function (item, index) {
        item.show = echartInfo.yaxisShow;
        item.name = echartInfo.yaxisText.indexOf(",") != -1 ? echartInfo.yaxisText.split(",")[index] : echartInfo.yaxisText;
        item.splitLine.lineStyle.color = echartInfo.yaxisLinecol;
        item.axisLabel.textStyle.fontSize = echartInfo.yaxisTextsize; //y轴线和字体颜色

        item.axisLabel.textStyle.color = echartInfo.axisLabelTextCol;
        item.axisLine.lineStyle.color = echartInfo.axisLineLineCol;
      });
    } else {
      selectOptionData.yAxis.show = echartInfo.yaxisShow;
      selectOptionData.yAxis.name = echartInfo.yaxisText;
      selectOptionData.yAxis.splitLine.show = echartInfo.yaxisLine;
      selectOptionData.yAxis.splitLine.lineStyle.color = echartInfo.yaxisLinecol;
      selectOptionData.yAxis.axisLabel.textStyle.fontSize = echartInfo.yaxisTextsize; //y轴线和字体颜色

      selectOptionData.yAxis.axisLabel.textStyle.color = echartInfo.axisLabelTextCol;
      selectOptionData.yAxis.axisLine.lineStyle.color = echartInfo.axisLineLineCol;
    } //数值显示


    selectOptionData.series.forEach(function (item) {
      item.itemStyle.normal.label.show = echartInfo.numerShow;
      item.itemStyle.normal.label.textStyle.fontSize = echartInfo.numerTextSize;
      item.itemStyle.normal.label.textStyle.color = echartInfo.numerTextcol;
      item.itemStyle.normal.label.textStyle.fontWeight = echartInfo.numerTextweig;
    }); //图例文字

    if (selectOptionData.series.length == 1) {
      selectOptionData.legend.data[0] = echartInfo.yaxisText;
      selectOptionData.series[0].name = echartInfo.yaxisText;
    } else {
      if (echartInfo.legendData.length > 0) {
        selectOptionData.legend.data = echartInfo.legendData;
      }
    } //轴边距


    selectOptionData.grid.left = echartInfo.gridLeft;
    selectOptionData.grid.top = echartInfo.gridTop;
    selectOptionData.grid.right = echartInfo.gridRight;
    selectOptionData.grid.bottom = echartInfo.gridBottom; //轴线和字体颜色

    selectOptionData.xAxis.axisLabel.textStyle.color = echartInfo.axisLabelTextCol;
    selectOptionData.xAxis.axisLine.lineStyle.color = echartInfo.axisLineLineCol;
  }

  if (charType === 'map') {
    //区域线的宽度、颜色、区域颜色
    selectOptionData.geo.zoom = echartInfo.scale;
    selectOptionData.geo.label.fontSize = echartInfo.xaxisTextsize;
    selectOptionData.geo.label.color = echartInfo.numerTextcol;
    selectOptionData.geo.emphasis.label.color = echartInfo.numerTextHighCol;
    selectOptionData.geo.itemStyle.borderWidth = echartInfo.borderWidth;
    selectOptionData.geo.itemStyle.areaColor = echartInfo.areaCol;
    selectOptionData.geo.emphasis.itemStyle.areaColor = echartInfo.areaHighCol;
    selectOptionData.geo.itemStyle.borderColor = echartInfo.borderCol;
    return false;
  } //提示框


  selectOptionData.tooltip.show = echartInfo.tooltipShow;
  selectOptionData.tooltip.textStyle.fontSize = echartInfo.tooltipTextSize;
  selectOptionData.tooltip.textStyle.color = echartInfo.tooltipTextcol; //图例

  selectOptionData.legend.show = echartInfo.legendShow; //selectOptionData.legend.itemWidth = echartInfo.legendItemWidth;

  selectOptionData.legend.top = echartInfo.legendTop;
  selectOptionData.legend.left = echartInfo.legendLeft;
  selectOptionData.legend.orient = echartInfo.legendOrient;
  if (echartInfo.legendTextcol) selectOptionData.legend.textStyle.color = echartInfo.legendTextcol;
  selectOptionData.legend.textStyle.fontSize = echartInfo.legendTextsize;
} //判断数据类型


function typeJudge(o, type) {
  return Object.prototype.toString.call(o).slice(8, -1) === type;
}

function addChartModalSelectedStyle() {
  var chartArray = document.querySelectorAll('.chart-modal-content .ivu-col');

  for (var a = 0; a < chartArray.length; a++) {
    var chart = chartArray[a];

    chart.onmouseover = function (e) {
      var tar = e.target;
      var activeDiv;

      if (tar.tagName === 'IMG') {
        activeDiv = tar.parentNode;
      } else {
        var col = tar.className;

        if (col && col.indexOf('ivu-col') >= 0) {
          activeDiv = tar.querySelector('div');
        }
      }

      if (activeDiv && activeDiv.parentNode.className.indexOf('no-allowed') >= 0) {
        return;
      }

      if (activeDiv) {
        activeDiv.className = activeDiv.className + ' chart-active';
      }
    };

    chart.onmouseout = function (e) {
      var tar = e.target;
      var activeDiv;

      if (tar.tagName === 'IMG') {
        activeDiv = tar.parentNode;
      } else {
        var col = tar.className;

        if (col && col.indexOf('ivu-col') >= 0) {
          activeDiv = tar.querySelector('div');
        }
      }

      if (activeDiv && activeDiv.parentNode.className.indexOf('no-allowed') >= 0) {
        return;
      }

      if (activeDiv) {
        activeDiv.className = activeDiv.className.replace(' chart-active', '');
      }
    };
  }
}
/**
 * 处理 extdata 右侧运行后才有
 * @param extData
 */


function handleChartExtData(extData) {
  var _this = this;

  // 清空所有值
  Object.keys(this.dataSettings).map(function (k) {
    _this.dataSettings[k] = '';
  });
  this.dataSettings['chartType'] = this.selectedChartType;
  this.dataSettings.id = this.echartInfo.id; //如果没有配置 数据集 则设置默认值

  if (!extData || !extData.dataId) {
    this.dataSettings.dataType = 'api';
    this.dataSettings.apiStatus = '0';
    return;
  }

  this.dataSettings['chartId'] = extData.chartId;

  if (extData.dataId && extData['dataType'] == 'sql') {
    this.sqlDatasets.forEach(function (item) {
      if (item.dbId === extData.dataId) {
        _this.sqlDatasetFields = item.children;
      }

      if (item.dbId === extData.dataId1) {
        _this.sqlDatasetFields2 = item.children;
      }
    });
  }

  this.dataSettings = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])({}, extData);
}
/**
 * 处理图表背景
 * @param options
 */


function handleChartBackground(options) {
  this.chartBackground.color = '#fff';
  this.chartBackground.repeat = 'repeat';
  this.chartBackground.image = '';
  this.chartBackground.enabled = false;

  if (options.backgroundColor) {
    this.chartBackground.enabled = true;
    var src = options.backgroundColor.src;

    if (src) {
      this.chartBackground.image = src;
    } else {
      var color = options.backgroundColor;
      this.chartBackground.color = color;
    }
  }
}
/**
 * 选中图表后需要加载图表的配置信息 到 当前vue实例中去
 */


function handleChartOptions(options) {
  clearSettings.call(this);
  this.chartOptions = options; // 处理标题

  this.titleSettings = option2Setting(options.title); // 处理背景

  handleChartBackground.call(this, options); // 处理图例

  if (options.legend) {
    this.legendSettings = option2Setting(options.legend);
  } // 处理提示信息


  if (options.tooltip) {
    this.tooltipSettings = option2Setting(options.tooltip);
  }
  /*************** 注意下面的属性都不一定会出现在 option 中 ***************/
  // 处理 grid


  if (options.grid) {
    this.gridSettings = option2Setting(options.grid);
  } // 处理 xAxis X轴坐标信息


  if (options.xAxis) {
    this.xAxisSettings = option2Setting(options.xAxis);
  } //处理 yAxis Y轴坐标信息


  if (options.yAxis) {
    if (this.selectedChartType === 'mixed.linebar') {
      this.yAxisSettings = array2Setting(options.yAxis);
    } else {
      this.yAxisSettings = option2Setting(options.yAxis);
    }
  } // 处理 geo 地图信息


  if (options.geo) {
    this.mapGeoSettings = option2Setting(options.geo);
  } // 处理雷达图信息


  if (options.radar) {
    this.radarSettings = array2Setting(options.radar);
    this.centralPointSettings = this.radarSettings[0];
  } // 终极处理 series


  var series = options.series;

  if (!series) {
    this.$message.warning('后台json配置有问题！');
    return;
  }

  this.isMultiChart = series.length > 1;
  handleSingleSeries.call(this, series[0]);

  if (this.isMultiChart) {
    handleMultiSeries.call(this, series);
  } // 处理自定义颜色和系列


  handleCustomData.call(this, series); // 获取api静态数据

  var chartType = this.selectedChartType || this.dataSettings['chartType'] || '';

  if (!chartType) {
    this.$message.warning('版本升级导致数据不兼容，请删除图表重新添加!');
  }

  this.apiStaticData = getChartDataList(options, chartType);
}
/**
 * 处理一些特有的Series中的配置 如柱状图柱体宽度 折线图线条颜色
 * @param object
 */


function handleSingleSeries(object) {
  var type = object.type;

  if (type == 'bar') {
    handleBarSettings.call(this, object);
  } else if (type == 'line') {
    handleLineSettings.call(this, object);
  } else if (type == 'pie') {
    handlePieSettings.call(this, object);
  } else if (type == 'scatter') {
    handleScatterSettings.call(this, object);
  } else if (type == 'funnel') {
    handleFunnelSettings.call(this, object);
  } else if (type == 'graph') {
    handleGraphSettings.call(this, object);
  } else if (type == 'pictorialBar') {
    handlePictorialSettings.call(this, object);
  } else if (type == 'radar') {
    handleRadarSettings.call(this, object);
  } else if (type == 'gauge') {
    handleGaugeSettings.call(this, object);
  }

  if (object.label) {
    this.seriesLabelSettings = option2Setting(object['label']);
    this.labelPositionArray = getSeriesLabelPostion.call(this);
    this.seriesLabelSettings.labelPositionArray = this.labelPositionArray;
  }
}
/**
 * 处理一些特有的Series中的配置 如折柱图等
 * @param object
 */


function handleMultiSeries(arr) {
  var _this2 = this;

  arr.forEach(function (object) {
    var type = object.type;

    if (type == 'bar') {
      handleBarSettings.call(_this2, object);
    } else if (type == 'line') {
      handleLineSettings.call(_this2, object);
    }
  });
}
/**
 * 处理一些自定义的数据 如自定义系列和自定义颜色等
 * @param object
 */


function handleCustomData(arr) {
  var colorArr = [];
  var colorName = [];
  arr.forEach(function (object) {
    var type = object.type;

    if (type == 'bar' || type == 'line') {
      if (object.itemStyle && object.itemStyle.color) {
        colorArr.push({
          name: object.name,
          color: object.itemStyle.color
        });
      }

      colorName.push(object.name);
    } else if (type == 'graph') {
      //关系图自定义的数据
      object.categories.forEach(function (categoryObj) {
        if (categoryObj.itemStyle && categoryObj.itemStyle.color) {
          colorArr.push({
            name: categoryObj.name,
            color: categoryObj.itemStyle.color
          });
        }
      });
      colorName = object.categories.map(function (item) {
        return item.name;
      }).filter(function (item, index, self) {
        return self.indexOf(item) == index;
      });
    } else if (type == 'scatter') {
      if (object.itemStyle && object.itemStyle.color && object.itemStyle.color.colorStops) {
        var colorStops = object.itemStyle.color.colorStops;
        colorArr.push({
          name: object.name,
          color: colorStops[0].color,
          edgeColor: colorStops[1].color
        });
      }

      colorName.push(object.name);
    } else if (type == 'radar') {
      object.data.forEach(function (item) {
        if (item.areaStyle && item.areaStyle.color && item.areaStyle.color != '') {
          colorArr.push({
            name: item.name,
            color: item.areaStyle.color,
            opacity: item.areaStyle.opacity,
            lineColor: item.lineStyle.color
          });
        }

        colorName.push(item.name);
      });
    } else if (type == 'pie' || type == 'funnel') {
      object.data.map(function (item) {
        if (item.itemStyle && item.itemStyle.color) {
          colorArr.push({
            name: item.name,
            color: item.itemStyle.color
          });
        }

        colorName.push(item.name);
      });
    } else if (type == 'gauge') {
      var _arr = object.axisLine.lineStyle.color;

      for (var j = 0, len = _arr.length; j < len; j++) {
        if (_arr[0] && _arr[0][1] == '#91c7ae' && _arr[1] && _arr[1][1] == '#63869E') {
          break;
        }

        colorArr.push({
          color: _arr[j][1],
          name: ""
        });
      }
    }
  });
  vm.colorMatchData = colorArr; //特殊图表的系列类型配置

  if (vm.selectedChartType === 'mixed.linebar' || vm.selectedChartType === 'bar.stack') {
    var data = [{
      "name": arr[0].name,
      "type": arr[0].type
    }];
    vm.seriesTypeData = arr[0].typeData ? arr[0].typeData : data;
  } //获取颜色对应的数据 颜色设置的下拉框用


  vm.customColorNameList = colorName;
}

function handleBarSettings(object) {
  var arr = ['barWidth', 'barMinHeight', 'itemStyle', 'backgroundStyle', 'showBackground'];
  this.barSettings = option2Setting(object, arr);
}

function handleLineSettings(object) {
  var arr = ['step', 'showSymbol', 'smooth', 'symbolSize', 'itemStyle', 'lineStyle', 'areaStyle', 'isArea'];
  this.lineSettings = option2Setting(object, arr);
}

function handlePieSettings(object) {
  var arr = ['isRadius', 'radius', 'minAngle', 'roseType', 'isRose', 'center'];
  this.pieSettings = option2Setting(object, arr);
  this.centralPointSettings = option2Setting(object, 'center');
}

function handleScatterSettings(object) {
  var arr = ['symbolSize', 'itemStyle'];
  this.scatterSettings = option2Setting(object, arr);
}

function handleGraphSettings(object) {
  var arr = ['layout', 'links', 'categories', 'label', 'lineStyle', 'center'];
  this.graphSettings = option2Setting(object, arr);
  this.centralPointSettings = option2Setting(object, 'center');
}

function handleFunnelSettings(object) {
  var arr = ['width', 'sort', 'gap', 'orient'];
  this.funnelSettings = option2Setting(object, arr);
  this.marginSettings = option2Setting(object, ['left', 'top', 'bottom']);
}

function handleGaugeSettings(object) {
  var arr = ['radius', 'detail', 'axisLabel', 'axisLine', 'pointer', 'itemStyle', 'axisTick', 'splitLine', 'title', 'center'];
  this.gaugeSettings = option2Setting(object, arr);
  this.centralPointSettings = option2Setting(object, 'center');
}

function handleRadarSettings(object) {
  var arr = [];
  this.raderSettings = option2Setting(object, arr);
}

function handlePictorialSettings(object) {
  this.legendSettings = false;
  this.tooltipSettings = false;
  var arr = ['symbolMargin', 'symbolSize', 'double', 'secondOpacity', 'symbolBoundingData', 'symbol'];
  this.pictorialSettings = option2Setting(object, arr);
}
/**
 * 清除原属性
 */


function clearSettings() {
  /*Object.keys(this.titleSettings).map(k=>{
      this.titleSettings[k]=''
  })*/
  this.chartOptions = '';
  this.titleSettings = {};
  this.legendSettings = false;
  this.tooltipSettings = false;
  this.mapGeoSettings = false;
  this.gridSettings = false;
  this.xAxisSettings = false;
  this.yAxisSettings = false;
  this.doubleyAxisSettings = false;
  this.barSettings = false;
  this.lineSettings = false;
  this.pieSettings = false;
  this.scatterSettings = false;
  this.funnelSettings = false;
  this.marginSettings = false;
  this.centralPointSettings = false;
  this.pictorialSettings = false;
  this.radarSettings = false;
  this.gaugeSettings = false;
  this.graphSettings = false;
  this.seriesLabelSettings = false;
  this.labelPositionArray = [];
  this.apiStaticData = '';
  this.colorMatchData = [];
  this.seriesTypeData = [];
  this.customColorNameList = [];
  this.isMultiChart = false;
}
/**
 * 图表option转实际配置 单个
 */


function option2Setting(option, keyArray) {
  var setting = {};

  if (option) {
    var optionKeys = Object.keys(option);

    for (var i = 0; i < optionKeys.length; i++) {
      var key = optionKeys[i];

      if (keyArray && keyArray.indexOf(key) < 0) {
        continue;
      }

      var obj = option[key];
      handleMultiObject(setting, obj, key);
    }
  }

  return setting;
}
/**
 * 图表arr转实际配置 多个
 */


function array2Setting(array, keyArray) {
  var setting = [];

  var _iterator2 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(array),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var obj = _step2.value;
      var option = option2Setting(obj, keyArray);
      setting.push(option);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return setting;
}
/**
 * 处理多层子对象的属性
 * @param setting
 * @param obj
 * @param key
 */


function handleMultiObject(setting, obj, key) {
  if (!obj && obj != false) {
    setting[key] = '';
  } else if (Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(obj) == 'object') {
    if (obj.constructor == Object) {
      Object.keys(obj).map(function (subKey) {
        handleMultiObject(setting, obj[subKey], key + '_' + subKey);
      });
    } else if (obj.constructor == Array) {
      setting[key] = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(obj);
    }
  } else {
    setting[key] = obj;
  }
} //处理多段下划线属性


function handleMultiUnderline(value, obj, arr, index) {
  var key = arr[index];

  if (index == arr.length - 1) {
    obj[key] = value;
    return;
  }

  if (!obj[key]) {
    obj[key] = {};
  }

  handleMultiUnderline(value, obj[key], arr, ++index);
}

function getSeriesLabelPostion() {
  var postion = [{
    value: 'start',
    text: '线的起始点',
    type: 'line'
  }, {
    value: 'middle',
    text: '线的中点',
    type: 'line'
  }, {
    value: 'end',
    text: '线的结束点',
    type: 'line'
  }, {
    value: 'top',
    text: '上方',
    type: 'bar'
  }, {
    value: 'left',
    text: '左边',
    type: 'bar'
  }, {
    value: 'right',
    text: '右边',
    type: 'bar'
  }, {
    value: 'bottom',
    text: '下方',
    type: 'bar'
  }, {
    value: 'inside',
    text: '内部',
    type: 'bar'
  }, {
    value: 'outside',
    text: '外侧',
    type: 'pie'
  }, {
    value: 'inside',
    text: '内部',
    type: 'pie'
  }, {
    value: 'left',
    text: '左边',
    type: 'funnel'
  }, {
    value: 'right',
    text: '右边',
    type: 'funnel'
  }, {
    value: 'inside',
    text: '内部',
    type: 'funnel'
  }, {
    value: 'insideRight',
    text: '内部右侧',
    type: 'funnel'
  }, {
    value: 'insideLeft',
    text: '内部左侧',
    type: 'funnel'
  }];

  if (this.barSettings || this.lineSettings || this.scatterSettings || this.pictorialSettings || this.graphSettings) {
    return postion.filter(function (item) {
      return item.type == 'bar';
    });
  }

  if (this.funnelSettings) {
    return postion.filter(function (item) {
      return item.type == 'funnel';
    });
  }
  /* if(this.lineSettings){
       return postion.filter(item=>{
           return item.type == 'line'
       })
   }*/


  if (this.pieSettings) {
    return postion.filter(function (item) {
      return item.type == 'pie';
    });
  }
}
/**
 * 获取自定义的json的图表类型
 */


function getSelectType(option) {
  var series = option.series;

  if (!series) {
    this.selectedChartType = 'apiUrlType';
  } else {
    var typeArr = series.map(function (item) {
      return item.type;
    });

    if (typeArr.length > 1) {
      if (typeArr.indexOf('bar') != -1 && typeArr.indexOf('line') != -1) {
        this.selectedChartType = 'mixed.linebar';
      } else if (typeArr.indexOf('bar') != -1) {
        this.selectedChartType = option.yAxis && option.yAxis.data ? 'bar.multi.horizontal' : 'bar.multi';
      } else if (typeArr.indexOf('line') != -1) {
        this.selectedChartType = 'line.multi';
      }
    } else {
      var type = typeArr[0];

      switch (type) {
        case 'line':
          this.selectedChartType = 'line.simple';
          break;

        case 'bar':
          this.selectedChartType = 'bar.simple';
          break;

        case 'pie':
          this.selectedChartType = 'pie.simple';
          break;

        case 'funnel':
          this.selectedChartType = 'funnel.simple';
          break;

        case 'gauge':
          this.selectedChartType = 'gauge.simple';
          break;

        case 'scatter':
          this.selectedChartType = 'scatter.simple';
          break;

        case 'pictorial.spirits':
          this.selectedChartType = 'pictorial.spirits';
          break;

        default:
          this.selectedChartType = 'apiUrlType';
          break;
      }
    }
  }
}
/**
 * 刷新图表
 * @param {string} id 图表ID
 * @param {Object} chartOptions 图表配置 {chartId, chartType, series, xAxis...}
 * @param {Object} dataSettings 
 * @param {Object} dataList 
 */


function refreshChart(id, chartOptions, dataSettings, dataList) {
  var _this3 = this;

  var seriesConfig = chartOptions['series'];
  var chartType = dataSettings['chartType'];
  var chartId = dataSettings['chartId'];

  if (!chartType) {
    this.$Message.warning('版本升级导致数据不兼容，请删除图表重新添加!');
  }

  if (chartType === 'bar.simple' || chartType.indexOf('line.') !== -1 && chartType !== 'line.multi') {
    var axisX = dataSettings.axisX,
        axisY = dataSettings.axisY; // axisX，axisY 表示X，Y轴的值在 dataList 中的 key

    var xarray = [];
    var yarray = [];

    var _iterator3 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var item = _step3.value;
        xarray.push(item[axisX]);
        yarray.push(item[axisY]);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    if (dataSettings['run'] === 1) {
      this.xAxisSettings.data = xarray;
    }

    chartOptions['xAxis']['data'] = xarray;
    seriesConfig[0].data = yarray;
  } else if (chartType === 'scatter.simple') {
    var _axisX = dataSettings.axisX,
        _axisY = dataSettings.axisY;
    var array = [];

    var _iterator4 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _item = _step4.value;
        array.push([_item[_axisX], _item[_axisY]]);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    seriesConfig[0].data = array;
  } else if (chartType === 'scatter.bubble') {
    (function () {
      var axisX = dataSettings.axisX,
          axisY = dataSettings.axisY,
          series = dataSettings.series;
      var seriesMap = {};

      var _iterator5 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _item2 = _step5.value;
          //获取series数据
          seriesMap[_item2[series]] = 1;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      var realSeries = [];
      var legendData = Object.keys(seriesMap);
      var singleSeries = seriesConfig[0];

      var _loop = function _loop(i) {
        var name = legendData[i];
        var seriesData = [];
        var temparr = dataList.filter(function (item) {
          return item[series] == name;
        });
        temparr.forEach(function (e) {
          seriesData.push([e[axisX], e[axisY]]);
        });
        var itemstyle = getSeriesItemStyle(seriesConfig, i, name);
        var obj = Object.assign({}, singleSeries, itemstyle, {
          name: name,
          data: seriesData
        });
        realSeries.push(obj);
      };

      for (var i = 0; i < legendData.length; i++) {
        _loop(i);
      }

      if (dataSettings['run'] === 1) {
        _this3.legendSettings.data = legendData;
      }

      chartOptions['legend']['data'] = legendData;
      chartOptions['series'] = realSeries;
    })();
  } else if (chartType.indexOf('pie') != -1 || chartType === 'funnel.simple') {
    var _axisX2 = dataSettings.axisX,
        _axisY2 = dataSettings.axisY;
    var ls = [],
        _xarray = [];

    var _iterator6 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
        _step6;

    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var _item3 = _step6.value;
        var tempName = _item3[_axisX2];
        var itemStyle = getSeriesDataItemStyle(seriesConfig[0].data, tempName);
        ls.push({
          name: tempName,
          value: _item3[_axisY2],
          itemStyle: itemStyle
        });

        _xarray.push(_item3[_axisX2]);
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }

    if (dataSettings['run'] === 1) {
      this.legendSettings.data = _xarray;
    }

    chartOptions['legend']['data'] = _xarray;
    seriesConfig[0].data = ls;
  } else if (chartType === 'pictorial.spirits') {
    var _axisX3 = dataSettings.axisX,
        _axisY3 = dataSettings.axisY;
    var _xarray2 = [];
    var _yarray = [];

    var _iterator7 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
        _step7;

    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var _item4 = _step7.value;

        _xarray2.push(_item4[_axisX3]);

        _yarray.push(_item4[_axisY3]);
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }

    if (dataSettings['run'] === 1) {
      this.yAxisSettings.data = _xarray2;
    }

    chartOptions['yAxis']['data'] = _xarray2;

    var _iterator8 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(seriesConfig),
        _step8;

    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var _item5 = _step8.value;
        _item5['data'] = _yarray;
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
  } else if (chartType.indexOf('gauge.simple') != -1) {
    var _axisX4 = dataSettings.axisX,
        _axisY4 = dataSettings.axisY;
    var _array = [];

    var _iterator9 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
        _step9;

    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var _item6 = _step9.value;

        _array.push({
          name: _item6[_axisX4],
          value: _item6[_axisY4]
        });
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }

    seriesConfig[0].data = _array;
  } else if (chartType.indexOf('bar.multi') !== -1 || chartType === 'line.multi' || chartType.indexOf('bar.stack') !== -1) {
    var _ret = function () {
      var axisX = dataSettings.axisX,
          axisY = dataSettings.axisY,
          series = dataSettings.series;
      var xarray = [];
      var seriesMap = {};

      var _iterator10 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var _item7 = _step10.value;
          var tempX = _item7[axisX]; //获取x轴数据

          if (xarray.indexOf(tempX) < 0) {
            xarray.push(tempX);
          } //获取series数据


          seriesMap[_item7[series]] = 1;
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }

      var realSeries = [];
      var singleSeries = seriesConfig[0];
      var legendData = Object.keys(seriesMap);

      var _loop2 = function _loop2(i) {
        var name = legendData[i];
        var seriesData = [];

        var _iterator11 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(xarray),
            _step11;

        try {
          var _loop3 = function _loop3() {
            var x = _step11.value;
            var temparr = dataList.filter(function (item) {
              return item[axisX] == x && item[series] == name;
            });

            if (temparr && temparr.length > 0) {
              seriesData.push(temparr[0][axisY]);
            } else {
              seriesData.push(0);
            }
          };

          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            _loop3();
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }

        var itemstyle = getSeriesItemStyle(seriesConfig, i, name);
        var obj = Object.assign({}, singleSeries, itemstyle, {
          name: name,
          data: seriesData,
          typeData: _this3.seriesTypeData
        }); //处理堆叠情况

        if (chartType === 'bar.stack' || chartId === 'bar.negative') {
          //只有点击运行才配置
          if (!dataSettings['run']) {
            return {
              v: {
                v: void 0
              }
            };
          }

          var tempStack = _this3.seriesTypeData.filter(function (item) {
            return item.name === name;
          });

          if (tempStack[0] && tempStack[0].stack) {
            obj['stack'] = tempStack[0].stack;
          } else {
            obj['stack'] = '';
          }
        }

        realSeries.push(obj);
      };

      for (var i = 0; i < legendData.length; i++) {
        var _ret2 = _loop2(i);

        if (Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(_ret2) === "object") return _ret2.v;
      }

      if (dataSettings['run'] === 1) {
        _this3.xAxisSettings.data = xarray;
        _this3.legendSettings.data = legendData;
      }

      if (chartType === 'bar.stack.horizontal' || chartType === 'bar.multi.horizontal' || chartType === 'bar.negative') {
        chartOptions['yAxis']['data'] = xarray;
      } else {
        chartOptions['xAxis']['data'] = xarray;
      }

      chartOptions['legend']['data'] = legendData;
      chartOptions['series'] = realSeries;
    }();

    if (Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(_ret) === "object") return _ret.v;
  } else if (chartType === 'mixed.linebar') {
    //刷新页面的时候
    if (!dataSettings['run']) {
      return;
    }

    var _axisX5 = dataSettings.axisX,
        _axisY5 = dataSettings.axisY,
        series = dataSettings.series;
    var _xarray3 = [];
    var seriesMap = {};

    var _iterator12 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
        _step12;

    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var _item8 = _step12.value;
        var tempX = _item8[_axisX5]; //获取x轴数据

        if (_xarray3.indexOf(tempX) < 0) {
          _xarray3.push(tempX);
        } //获取series数据


        seriesMap[_item8[series]] = 1;
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }

    var realSeries = [];
    var barSeries = _util__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].setting2Option(this.barSettings) ? _util__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].setting2Option(this.barSettings) : {
      "barWidth": 15,
      "barMinHeight": 2,
      "itemStyle": {
        "barBorderRadius": 0,
        "color": ""
      }
    };
    var lineSeries = _util__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].setting2Option(this.lineSettings) ? _util__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].setting2Option(this.lineSettings) : {
      "step": false,
      "showSymbol": true,
      "smooth": false,
      "symbolSize": 5,
      "lineStyle": {
        "width": 2
      },
      "itemStyle": {
        "color": ""
      }
    };
    var labelSeries = _util__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].setting2Option(this.seriesLabelSettings) ? _util__WEBPACK_IMPORTED_MODULE_20__[/* default */ "a"].setting2Option(this.seriesLabelSettings) : {
      "show": true,
      "position": "top",
      "textStyle": {
        "color": "black",
        "fontSize": 16,
        "fontWeight": "bolder"
      }
    };
    var legendData = Object.keys(seriesMap);
    /*  //判断系列和图例是否有一致
      if(!isEquals(chartOptions.legend.data,legendData)){
          this.seriesTypeData=[];
      }*/

    legendData.map(function (name) {
      var seriesData = []; //默认柱子样式 【JMREP-652】问题加label

      var singleSeries = Object.assign(barSeries, {
        label: labelSeries
      }, {
        type: "bar"
      });

      var _iterator13 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(_xarray3),
          _step13;

      try {
        var _loop4 = function _loop4() {
          var x = _step13.value;
          var temparr = dataList.filter(function (item) {
            return item[_axisX5] == x && item[series] == name;
          });

          if (temparr && temparr.length > 0) {
            seriesData.push(temparr[0][_axisY5]);
          } else {
            seriesData.push(0);
          }
        };

        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          _loop4();
        } //处理自定义系列

      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      if (_this3.seriesTypeData.length > 0) {
        var _series = _this3.seriesTypeData.filter(function (item) {
          return item.name === name;
        });

        if (_series && _series.length > 0) {
          if (_series[0].type === 'line') {
            singleSeries = Object.assign(lineSeries, {
              label: labelSeries
            }, {
              type: 'line',
              "yAxisIndex": 1
            });
          }
        }
      }

      var obj = Object.assign({}, singleSeries, {
        name: name,
        data: seriesData,
        typeData: _this3.seriesTypeData
      });
      realSeries.push(obj);
    });

    if (dataSettings['run'] === 1) {
      this.xAxisSettings.data = _xarray3;
      this.legendSettings.data = legendData;
    }

    chartOptions['xAxis']['data'] = _xarray3;
    chartOptions['legend']['data'] = legendData;
    chartOptions['series'] = realSeries;
  } else if (chartType === 'map.scatter') {
    (function () {
      var axisX = dataSettings.axisX,
          axisY = dataSettings.axisY;
      var ls = [];

      var selectMap = _this3.$refs.mapModal.allMapList.filter(function (obj) {
        return obj.name === chartOptions['geo']['map'];
      });

      var _iterator14 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
          _step14;

      try {
        var _loop5 = function _loop5() {
          var item = _step14.value;
          var v = [];

          if (selectMap && selectMap.length > 0) {
            var data = JSON.parse(selectMap[0].data);
            var mapFeature = data.features.filter(function (district) {
              return district.properties.name.indexOf(item[axisX]) != -1;
            });

            if (mapFeature && mapFeature.length > 0) {
              var coordinate = mapFeature[0].properties.center;
              var lng = coordinate[0] ? coordinate[0] : coordinate.lng;
              var lat = coordinate[1] ? coordinate[1] : coordinate.lat;
              v = [lng, lat, item[axisY]];
              ls.push({
                name: item[axisX],
                value: v
              });
            }
          }
        };

        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          _loop5();
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      if (ls && ls.length > 0) seriesConfig[0].data = ls;
      chartOptions['series'] = seriesConfig;
    })();
  } else if (chartType === 'radar.basic' || chartType === 'radar.custom') {
    // 雷达图
    handleRadarChart(dataSettings, dataList, chartOptions);
  }

  if (chartType === 'graph.simple') {
    //关系图
    handleGraphChart(dataSettings, dataList, chartOptions);
  }

  _exportApi__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"].updateChart(id, chartOptions);

  if (dataSettings['run'] === 1) {
    handleCustomData(chartOptions['series']);
    delete dataSettings['run'];
    _exportApi__WEBPACK_IMPORTED_MODULE_22__[/* default */ "a"].updateChartExtData(id, dataSettings);
  }
}
/**
 * 处理关系图图表
 * @param {*} dataSettings 
 * @param {*} dataList 
 * @param {*} chartOptions 
 */


function handleGraphChart(dataSettings, dataList, chartOptions) {
  var axisX = dataSettings.axisX,
      axisY = dataSettings.axisY,
      series = dataSettings.series;
  var seriesConfig = chartOptions['series'];
  var data = dataList.data;
  var links = dataList.links;
  var seriesMap = {};
  var categories = [];

  var _loop6 = function _loop6(i, len) {
    //系列已存在
    if (seriesMap[data[i][series]]) {
      data[i].category = seriesMap[data[i][series]];
      return "continue";
    } else {
      //获取series数据
      seriesMap[data[i][series]] = i; //获取categories数据和样式

      var singleSeries = seriesConfig[0].categories.filter(function (item) {
        return item.name === data[i][series];
      });
      var itemStyle = singleSeries && singleSeries.length > 0 ? singleSeries[0]['itemStyle'] : {
        "color": ""
      };
      categories.push({
        name: data[i][series],
        itemStyle: itemStyle
      }); //获取data.categories为坐标

      data[i].category = i;
    }
  };

  for (var i = 0, len = data.length; i < len; i++) {
    var _ret3 = _loop6(i, len);

    if (_ret3 === "continue") continue;
  }

  var legendData = Object.keys(seriesMap);
  seriesConfig[0].data = data.map(function (item) {
    return {
      name: item[axisX],
      value: item[axisY],
      category: item.category
    };
  });
  seriesConfig[0].links = links;
  seriesConfig[0].categories = categories;
  chartOptions['legend']['data'] = legendData;
  chartOptions['series'] = seriesConfig;
} //数组对象替换的键值对


function convertKey(arr, keyMap) {
  var tempString = JSON.stringify(arr);

  for (var key in keyMap) {
    var reg = "/\"".concat(key, "\":/g");
    tempString = tempString.replace(eval(reg), '"' + keyMap[key] + '":');
  }

  return JSON.parse(tempString);
} //处理雷达图数据


function handleRadarChart(dataSettings, dataList, chartOptions) {
  var axisX = dataSettings.axisX,
      axisY = dataSettings.axisY,
      series = dataSettings.series;
  var array = []; //分类数组

  var seriesMap = {};
  var seriesConfig = chartOptions['series'];

  var _iterator15 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(dataList),
      _step15;

  try {
    for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
      var item = _step15.value;
      var temp = item[axisX]; //获取x轴数据

      if (array.indexOf(temp) < 0) {
        array.push(temp);
      } //获取系列


      seriesMap[item[series]] = 1;
    }
  } catch (err) {
    _iterator15.e(err);
  } finally {
    _iterator15.f();
  }

  var realSeries = [];
  var realData = [];
  var legendData = Object.keys(seriesMap); //新的系列data
  //雷达数据

  var indicatorData = [];

  var _loop7 = function _loop7(i) {
    var name = legendData[i]; //系列值

    var seriesData = [];

    var _iterator16 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(array),
        _step16;

    try {
      var _loop8 = function _loop8() {
        var x = _step16.value;
        var indicator = {
          name: x,
          max: 0
        };
        var temparr = dataList.filter(function (item) {
          return item[axisX] == x && item[series] == name;
        });

        if (temparr && temparr.length > 0) {
          seriesData.push(temparr[0][axisY]);
          indicator['max'] = temparr[0][axisY];
        } else {
          seriesData.push(0);
        } //判断取出设置数据的最大值


        var tempIndicator = indicatorData.filter(function (item) {
          return item['name'] == x;
        });

        if (tempIndicator && tempIndicator.length > 0) {
          //存在就判断大小并赋值
          if (tempIndicator[0]['max'] < indicator['max']) {
            tempIndicator[0]['max'] = indicator['max'];
          }
        } else {
          //不存在就直接push
          indicatorData.push(indicator);
        }
      };

      for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
        _loop8();
      }
    } catch (err) {
      _iterator16.e(err);
    } finally {
      _iterator16.f();
    }

    var singleSeries = seriesConfig[0].data.filter(function (item) {
      return item.name === name;
    }); //雷达图的样式获取配置的

    singleSeries = singleSeries.length > 0 ? singleSeries[0] : {};
    var obj = Object.assign({}, singleSeries, {
      name: name,
      value: seriesData
    });
    realData.push(obj);
  };

  for (var i = 0; i < legendData.length; i++) {
    _loop7(i);
  }

  var obj = Object.assign({}, {
    type: 'radar',
    data: realData
  });
  realSeries.push(obj); //最大值的配置获取

  var indicators = chartOptions['radar'][0]['indicator']; //修改最大值的大小

  indicatorData.forEach(function (item) {
    var ogn = indicators.filter(function (indicator) {
      return indicator.name === item.name;
    });
    item.max = ogn && ogn.length > 0 ? ogn[0].max : calcuMaxVal(item.max);
  });

  if (dataSettings['run'] === 1) {
    vm.legendSettings.data = legendData;
    vm.radarSettings[0].indicator = indicatorData;
  }

  chartOptions['legend']['data'] = legendData;
  chartOptions['radar'][0]['indicator'] = indicatorData;
  chartOptions['series'] = realSeries;
} //计算雷达图边界数据


function calcuMaxVal(val) {
  var first = val.toString().substr(0, 1);
  first = parseInt(first) + 1;
  val = first + val.toString().substr(1);
  return parseInt(val);
}

function getChartDataList(options, chartType) {
  var series = options['series'];
  var ls = []; //象形图

  if (chartType == 'pictorial.spirits') {
    var xdata = options['yAxis'].data;
    var ydata = series[0].data;

    for (var i = 0; i < xdata.length; i++) {
      ls.push({
        name: xdata[i],
        value: ydata[i]
      });
    }
  } else if (chartType == 'map.scatter') {
    var data = series[0].data;

    for (var _i = 0; _i < data.length; _i++) {
      ls.push({
        name: data[_i]['name'],
        value: data[_i]['value'][2]
      });
    }
  } else if (chartType.indexOf('scatter.bubble') >= 0) {
    var _iterator17 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(series),
        _step17;

    try {
      for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
        var item = _step17.value;
        var type = item['name'];
        var arr = item['data'];

        for (var _i2 = 0; _i2 < arr.length; _i2++) {
          ls.push({
            name: arr[_i2][0],
            value: arr[_i2][1],
            type: type
          });
        }
      }
    } catch (err) {
      _iterator17.e(err);
    } finally {
      _iterator17.f();
    }
  } else if (series.length > 1 || chartType.indexOf('horizontal') != -1) {
    //处理条形图的情况
    var zdata = options['xAxis'].data;

    if (chartType === 'bar.stack.horizontal' || chartType === 'bar.multi.horizontal' || chartType === 'bar.negative') {
      zdata = options['yAxis'].data;
    }

    var _iterator18 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(series),
        _step18;

    try {
      for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
        var _item9 = _step18.value;
        var _type = _item9['name'];
        var _arr2 = _item9['data'];

        for (var _i3 = 0; _i3 < _arr2.length; _i3++) {
          ls.push({
            name: zdata[_i3],
            value: _arr2[_i3],
            type: _type
          });
        }
      }
    } catch (err) {
      _iterator18.e(err);
    } finally {
      _iterator18.f();
    }
  } else {
    if (chartType && (chartType.indexOf('pie') >= 0 || chartType.indexOf('funnel') >= 0 || chartType.indexOf('gauge') >= 0)) {
      var sdata = series[0].data;

      var _iterator19 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(sdata),
          _step19;

      try {
        for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
          var _item10 = _step19.value;
          ls.push({
            name: _item10['name'],
            value: _item10['value']
          });
        }
      } catch (err) {
        _iterator19.e(err);
      } finally {
        _iterator19.f();
      }
    } else if (chartType.indexOf('scatter') >= 0) {
      var _sdata = series[0].data;

      for (var _i4 = 0; _i4 < _sdata.length; _i4++) {
        ls.push({
          name: _sdata[_i4][0],
          value: _sdata[_i4][1]
        });
      }
    } else if (chartType.indexOf('radar') >= 0) {
      //静态数据
      var _sdata2 = series[0].data;
      var indicator = options['radar'][0]['indicator'];

      for (var _i5 = 0; _i5 < _sdata2.length; _i5++) {
        var valueArr = _sdata2[_i5]['value'];

        for (var j = 0; j < valueArr.length; j++) {
          ls.push({
            name: indicator[j]['name'],
            value: valueArr[j],
            type: _sdata2[_i5]['name']
          });
        }
      }
    } else if (chartType.indexOf('graph') >= 0) {
      //关系图静态数据
      var links = options['series'][0]['links'];
      var _data = options['series'][0]['data'];
      var categories = options['series'][0]['categories'];

      _data.forEach(function (item) {
        item.type = categories[item.category] ? categories[item.category].name : '';
      });

      for (var _j = 0; _j < _data.length; _j++) {
        ls.push({
          name: _data[_j]['name'],
          value: _data[_j]['value'],
          type: _data[_j]['type']
        });
      }

      var _str = '';

      for (var _i6 = 0; _i6 < ls.length; _i6++) {
        _str += "\n" + JSON.stringify(ls[_i6]);

        if (_i6 < ls.length - 1) {
          _str += ',';
        }
      }

      var str2 = '';

      for (var _i7 = 0; _i7 < links.length; _i7++) {
        str2 += "\n" + JSON.stringify(links[_i7]);

        if (_i7 < links.length - 1) {
          str2 += ',';
        }
      }

      return '{\n"data":[' + _str + '\n],\n"links":[' + str2 + '\n]}';
    } else {
      if (options['xAxis']) {
        var _xdata = options['xAxis'].data;
        var _ydata = series[0].data;

        for (var _i8 = 0; _i8 < _xdata.length; _i8++) {
          ls.push({
            name: _xdata[_i8],
            value: _ydata[_i8]
          });
        }
      }
    }
  }

  var str = '';

  for (var _i9 = 0; _i9 < ls.length; _i9++) {
    str += "\n" + JSON.stringify(ls[_i9]);

    if (_i9 < ls.length - 1) {
      str += ',';
    }
  }

  return '[' + str + '\n]';
}
/**
 * 添加图表 前置操作
 */


function addChartPreHandler(option) {
  var chartType = this.selectedChartType;
  option['selfChartType'] = chartType; //象形图

  if (chartType.indexOf('pictorial') >= 0) {
    var symbol = option.series[0]['symbol'];

    if (!symbol) {
      var icon = chartType.split('.')[1];
      var pre = _utils_config__WEBPACK_IMPORTED_MODULE_21__[/* baseFull */ "a"];
      var path = "image://".concat(pre, "/jmreport/desreport_/chartsImg/pictorialIcon/").concat(icon, ".png");

      var _iterator20 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(option.series),
          _step20;

      try {
        for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
          var item = _step20.value;
          item['symbol'] = path;
        }
      } catch (err) {
        _iterator20.e(err);
      } finally {
        _iterator20.f();
      }
    }
  } else if (chartType.indexOf('map.scatter') >= 0) {
    var ls = [];
    var selectMap = mapTypeList.filter(function (item) {
      return item.name === option.geo.map;
    });

    var _iterator21 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(option.series[0].data),
        _step21;

    try {
      var _loop9 = function _loop9() {
        var item = _step21.value;
        var v = [];

        if (selectMap && selectMap.length > 0) {
          var data = selectMap[0].data;
          var mapFeature = data.features.filter(function (district) {
            return district.properties.name.indexOf(item['name']) != -1;
          });

          if (mapFeature && mapFeature.length > 0) {
            var coordinate = mapFeature[0].properties.center;
            var lng = coordinate[0] ? coordinate[0] : coordinate.lng;
            var lat = coordinate[1] ? coordinate[1] : coordinate.lat;
            v = [lng, lat, item['value']];
            ls.push({
              name: item['name'],
              value: v
            });
          }
        }
      };

      for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
        _loop9();
      }
    } catch (err) {
      _iterator21.e(err);
    } finally {
      _iterator21.f();
    }

    option.series[0]['data'] = ls;
  }
}
/**
 * 获取当前Series index对应的itemstyle 适用于多柱体多折线
 * @param seriesConfig
 * @param index
 * @param name
 * @returns {{itemStyle: any}}
 */


function getSeriesItemStyle(seriesConfig, index, name) {
  var itemStyle = JSON.parse(JSON.stringify(seriesConfig[0]['itemStyle']));
  itemStyle['color'] = '';

  if (seriesConfig[index] && seriesConfig[index].name == name) {
    itemStyle['color'] = seriesConfig[index]['itemStyle']['color'];
  }

  return {
    itemStyle: itemStyle
  };
}
/**
 * 获取当前Series data中的itemstyle 适用于饼状图 漏斗图
 * @param seriesData
 * @param name
 * @returns {{color: string}}
 */


function getSeriesDataItemStyle(seriesData, name) {
  var itemStyle = {
    color: ''
  };

  var _iterator22 = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_createForOfIteratorHelper__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(seriesData),
      _step22;

  try {
    for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
      var item = _step22.value;

      if (name === item.name) {
        itemStyle = item['itemStyle'];
        break;
      }
    }
  } catch (err) {
    _iterator22.e(err);
  } finally {
    _iterator22.f();
  }

  return itemStyle;
}

function isEquals(a, b) {
  return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
}



/***/ }),

/***/ "5156":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("e6d2");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "555d":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "591f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__("8e50").charAt;
var InternalStateModule = __webpack_require__("28d0");
var defineIterator = __webpack_require__("e8d3");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "59bf":
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__("0c1b");
var IndexedObject = __webpack_require__("4f06");
var toObject = __webpack_require__("f8d3");
var toLength = __webpack_require__("a187");
var arraySpeciesCreate = __webpack_require__("6827");

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_OUT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterOut
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterOut` method
  // https://github.com/tc39/proposal-array-filtering
  filterOut: createMethod(7)
};


/***/ }),

/***/ "5a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");
var transformData = __webpack_require__("dc9c");
var isCancel = __webpack_require__("7368");
var defaults = __webpack_require__("f11f");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "5a62":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpFlags = __webpack_require__("2e38");
var stickyHelpers = __webpack_require__("08b5");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
// eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "5b12":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__("9194");
var isRegExp = __webpack_require__("d192");
var anObject = __webpack_require__("baa9");
var requireObjectCoercible = __webpack_require__("4023");
var speciesConstructor = __webpack_require__("b418");
var advanceStringIndex = __webpack_require__("c11d");
var toLength = __webpack_require__("a187");
var callRegExpExec = __webpack_require__("1a58");
var regexpExec = __webpack_require__("5a62");
var fails = __webpack_require__("7ce6");

var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegExpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);


/***/ }),

/***/ "5b81":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__("02ac");

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "5bff":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "5d08":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var isObject = __webpack_require__("97f5");
var isArray = __webpack_require__("0914");
var toAbsoluteIndex = __webpack_require__("5156");
var toLength = __webpack_require__("a187");
var toIndexedObject = __webpack_require__("b7d9");
var createProperty = __webpack_require__("98a5");
var wellKnownSymbol = __webpack_require__("3086");
var arrayMethodHasSpeciesSupport = __webpack_require__("7041");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ "5d22":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "5e03":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");
var settle = __webpack_require__("e8a0");
var cookies = __webpack_require__("7ca9");
var buildURL = __webpack_require__("c6da");
var buildFullPath = __webpack_require__("73cb");
var parseHeaders = __webpack_require__("8a65");
var isURLSameOrigin = __webpack_require__("f2b1");
var createError = __webpack_require__("2b31");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "6266":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("eef6")))

/***/ }),

/***/ "62f9":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("1f04");
var toObject = __webpack_require__("f8d3");
var nativeKeys = __webpack_require__("e505");
var fails = __webpack_require__("7ce6");

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),

/***/ "6484":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("afb0");
var uid = __webpack_require__("4f83");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "676c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var createHTML = __webpack_require__("3768");
var forcedStringHTMLMethod = __webpack_require__("bc12");

// `String.prototype.fixed` method
// https://tc39.es/ecma262/#sec-string.prototype.fixed
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fixed') }, {
  fixed: function fixed() {
    return createHTML(this, 'tt', '', '');
  }
});


/***/ }),

/***/ "6827":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("97f5");
var isArray = __webpack_require__("0914");
var wellKnownSymbol = __webpack_require__("3086");

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),

/***/ "69a9":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var userAgent = __webpack_require__("3902");

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),

/***/ "6a8c":
/***/ (function(module, exports) {

// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "6b33":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("3086");

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};


/***/ }),

/***/ "6b78":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("bbee");

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};


/***/ }),

/***/ "6d1f":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "6d39":
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "6e8c":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _createForOfIteratorHelper; });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("01e5");
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e487");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("27ae");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c2f8");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("591f");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("31e1");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("feb3");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("b63d");








function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = Object(_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"])(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function F() {};

      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

/***/ }),

/***/ "7041":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("7ce6");
var wellKnownSymbol = __webpack_require__("3086");
var V8_VERSION = __webpack_require__("69a9");

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ "721d":
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var anObject = __webpack_require__("baa9");
var aPossiblePrototype = __webpack_require__("8830");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "7282":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "7368":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "736a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var IS_PURE = __webpack_require__("941f");
var NativePromise = __webpack_require__("2456");
var fails = __webpack_require__("7ce6");
var getBuiltIn = __webpack_require__("902e");
var speciesConstructor = __webpack_require__("b418");
var promiseResolve = __webpack_require__("b7bb");
var redefine = __webpack_require__("bbee");

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromise && fails(function () {
  NativePromise.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = typeof onFinally == 'function';
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// patch native Promise.prototype for native async functions
if (!IS_PURE && typeof NativePromise == 'function' && !NativePromise.prototype['finally']) {
  redefine(NativePromise.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
}


/***/ }),

/***/ "73cb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__("d259");
var combineURLs = __webpack_require__("1d10");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "73da":
/***/ (function(module, exports, __webpack_require__) {

var toObject = __webpack_require__("f8d3");

var floor = Math.floor;
var replace = ''.replace;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace.call(replacement, symbols, function (match, ch) {
    var capture;
    switch (ch.charAt(0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return str.slice(0, position);
      case "'": return str.slice(tailPos);
      case '<':
        capture = namedCaptures[ch.slice(1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};


/***/ }),

/***/ "73ef":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("77ad");

/***/ }),

/***/ "76ec":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("3337");

__webpack_require__("1d43");

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// import exportApi from "@/utils/exportApi";
// 初始化地图数据
function loadMap(item) {
  var config = JSON.parse(item.config);
  $http.post({
    contentType: "json",
    url: api.queryMapByCode,
    data: JSON.stringify({
      name: config.geo.map
    }),
    success: function success(result) {
      var data = JSON.parse(result.data);
      exportApi.registerMap(result.name, data);
      exportApi.updateChart(item.layer_id, config);
    }
  });
}

/***/ }),

/***/ "77ad":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");
var bind = __webpack_require__("4d70");
var Axios = __webpack_require__("a78d");
var mergeConfig = __webpack_require__("de7f");
var defaults = __webpack_require__("f11f");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__("bc46");
axios.CancelToken = __webpack_require__("1e54");
axios.isCancel = __webpack_require__("7368");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__("5bff");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__("782d");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "782d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "79e4":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "7a3a":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("1f04");
var from = __webpack_require__("f180");
var checkCorrectnessOfIteration = __webpack_require__("7e06");

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),

/***/ "7ca9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "7cb5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("4d70");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "7ce6":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "7e06":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("3086");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "8141":
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__("b7d9");
var toLength = __webpack_require__("a187");
var toAbsoluteIndex = __webpack_require__("5156");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "836a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__("9194");
var anObject = __webpack_require__("baa9");
var toLength = __webpack_require__("a187");
var requireObjectCoercible = __webpack_require__("4023");
var advanceStringIndex = __webpack_require__("c11d");
var regExpExec = __webpack_require__("1a58");

// @@match logic
fixRegExpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      if (!rx.global) return regExpExec(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),

/***/ "83d4":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("97f5");
var setPrototypeOf = __webpack_require__("721d");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ "8830":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("97f5");

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),

/***/ "8a65":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "8b9c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__("1bc7").IteratorPrototype;
var create = __webpack_require__("a447");
var createPropertyDescriptor = __webpack_require__("1f88");
var setToStringTag = __webpack_require__("d1d6");
var Iterators = __webpack_require__("4de8");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "8ba8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_12_0_node_modules_thread_loader_2_1_3_thread_loader_dist_cjs_js_node_modules_babel_loader_8_2_2_babel_loader_lib_index_js_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMapSetting_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("76ec");
/* harmony import */ var _node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_12_0_node_modules_thread_loader_2_1_3_thread_loader_dist_cjs_js_node_modules_babel_loader_8_2_2_babel_loader_lib_index_js_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMapSetting_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_12_0_node_modules_thread_loader_2_1_3_thread_loader_dist_cjs_js_node_modules_babel_loader_8_2_2_babel_loader_lib_index_js_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMapSetting_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_12_0_node_modules_thread_loader_2_1_3_thread_loader_dist_cjs_js_node_modules_babel_loader_8_2_2_babel_loader_lib_index_js_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMapSetting_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = require("Vue");

/***/ }),

/***/ "8c0f":
/***/ (function(module, exports) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "8d67":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _objectSpread2; });
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("62f9");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("01e5");
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e3b5");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("9996");
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptor_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("3bae");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("b126");
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptors_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("f076");








function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        Object(_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/***/ }),

/***/ "8d9b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var IS_PURE = __webpack_require__("941f");
var global = __webpack_require__("f14a");
var getBuiltIn = __webpack_require__("902e");
var NativePromise = __webpack_require__("2456");
var redefine = __webpack_require__("bbee");
var redefineAll = __webpack_require__("6b78");
var setToStringTag = __webpack_require__("d1d6");
var setSpecies = __webpack_require__("24a1");
var isObject = __webpack_require__("97f5");
var aFunction = __webpack_require__("02ac");
var anInstance = __webpack_require__("e6a2");
var inspectSource = __webpack_require__("3689");
var iterate = __webpack_require__("01d1");
var checkCorrectnessOfIteration = __webpack_require__("7e06");
var speciesConstructor = __webpack_require__("b418");
var task = __webpack_require__("ae2b").set;
var microtask = __webpack_require__("e904");
var promiseResolve = __webpack_require__("b7bb");
var hostReportErrors = __webpack_require__("36d7");
var newPromiseCapabilityModule = __webpack_require__("5b81");
var perform = __webpack_require__("bfd8");
var InternalStateModule = __webpack_require__("28d0");
var isForced = __webpack_require__("dd95");
var wellKnownSymbol = __webpack_require__("3086");
var IS_NODE = __webpack_require__("2083");
var V8_VERSION = __webpack_require__("69a9");

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var PromiseConstructor = NativePromise;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (V8_VERSION === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!IS_NODE && !NATIVE_REJECTION_EVENT) return true;
  }
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromiseConstructor.prototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  task.call(global, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  task.call(global, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && typeof NativePromise == 'function') {
    nativeThen = NativePromise.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(NativePromise.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') $({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
      }
    });
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "8e50":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("e6d2");
var requireObjectCoercible = __webpack_require__("4023");

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "8fe5":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("7ce6");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "902e":
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__("1188");
var global = __webpack_require__("f14a");

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "90aa":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("1f04");
var repeat = __webpack_require__("0664");

// `String.prototype.repeat` method
// https://tc39.es/ecma262/#sec-string.prototype.repeat
$({ target: 'String', proto: true }, {
  repeat: repeat
});


/***/ }),

/***/ "9194":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__("9b5f");
var redefine = __webpack_require__("bbee");
var fails = __webpack_require__("7ce6");
var wellKnownSymbol = __webpack_require__("3086");
var regexpExec = __webpack_require__("5a62");
var createNonEnumerableProperty = __webpack_require__("28e6");

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};


/***/ }),

/***/ "9334":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _ChartMapSetting_vue_vue_type_template_id_280f617a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0f92");
/* harmony import */ var _ChartMapSetting_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8ba8");
/* harmony import */ var _ChartMapSetting_vue_vue_type_style_index_0_id_280f617a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1eaf");
/* harmony import */ var _node_modules_vue_loader_15_9_6_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5d22");






/* normalize component */

var component = Object(_node_modules_vue_loader_15_9_6_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])(
  _ChartMapSetting_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ChartMapSetting_vue_vue_type_template_id_280f617a_scoped_true___WEBPACK_IMPORTED_MODULE_0__[/* render */ "a"],
  _ChartMapSetting_vue_vue_type_template_id_280f617a_scoped_true___WEBPACK_IMPORTED_MODULE_0__[/* staticRenderFns */ "b"],
  false,
  null,
  "280f617a",
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "941f":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "9448":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var createNonEnumerableProperty = __webpack_require__("28e6");

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "97f5":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "9896":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@4.4.6@@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("79e4")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/typeof.js
var esm_typeof = __webpack_require__("ae1d");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.array.map.js
var es_array_map = __webpack_require__("3337");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.function.name.js
var es_function_name = __webpack_require__("1d43");

// EXTERNAL MODULE: ./src/packages/index.less
var src_packages = __webpack_require__("6d1f");

// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__("8bbf");
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);

// EXTERNAL MODULE: ./src/utils/exportApi.js
var exportApi = __webpack_require__("2f9a");

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/ChartSetting.vue?vue&type=template&id=28a5d899&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{},[[_c('Modal',{attrs:{"loading":_vm.loading,"title":"数据编辑","width":50},on:{"on-ok":_vm.addEchartData},model:{value:(_vm.addEchart),callback:function ($$v) {_vm.addEchart=$$v},expression:"addEchart"}},[_c('div',[_c('i-form',[_c('form-item',[_c('i-input',{attrs:{"type":"textarea","autosize":{ minRows: 15, maxRows: 15 }},model:{value:(_vm.apiStaticData),callback:function ($$v) {_vm.apiStaticData=$$v},expression:"apiStaticData"}})],1)],1)],1)]),_c('chart-type-list',{attrs:{"selectedId":_vm.selectedChartId,"showModal":_vm.chartModule},on:{"on-cancel":function($event){_vm.selectedChartId = ''},"on-ok":_vm.setSelectCharType}}),_c('Modal',{attrs:{"loading":_vm.loading,"title":"系列类型信息","width":30},on:{"on-ok":_vm.addSeriesType,"on-cancel":function($event){_vm.seriesObj = {}}},model:{value:(_vm.seriesModal),callback:function ($$v) {_vm.seriesModal=$$v},expression:"seriesModal"}},[_c('div',{staticStyle:{"padding-right":"50px"}},[_c('i-form',{attrs:{"model":_vm.seriesObj,"label-colon":"","label-width":90}},[_c('form-item',{attrs:{"label":"系列"}},[_c('i-select',{staticStyle:{"width":"100%"},attrs:{"placeholder":"请选择"},on:{"on-change":_vm.selectMenuList},model:{value:(_vm.seriesObj.name),callback:function ($$v) {_vm.$set(_vm.seriesObj, "name", $$v)},expression:"seriesObj.name"}},_vm._l((_vm.customColorNameList),function(item,index){return _c('i-option',{key:index,attrs:{"index":index,"value":item}},[_vm._v(_vm._s(item)+" ")])}),1)],1),(
              _vm.selectedChartType !== 'bar.stack' &&
              _vm.selectedChartId != 'bar.negative'
            )?_c('form-item',{attrs:{"label":"图表类型"}},[_c('i-select',{attrs:{"placeholder":"请选择图表类型"},model:{value:(_vm.seriesObj.type),callback:function ($$v) {_vm.$set(_vm.seriesObj, "type", $$v)},expression:"seriesObj.type"}},[_c('i-option',{attrs:{"value":"bar"}},[_vm._v("柱形图")]),_c('i-option',{attrs:{"value":"line"}},[_vm._v("折线图")])],1)],1):_vm._e(),(
              _vm.selectedChartType === 'bar.stack' ||
              _vm.selectedChartId === 'bar.negative'
            )?_c('form-item',{attrs:{"label":"堆栈类型"}},[_c('i-input',{attrs:{"placeholder":"请输入堆栈类型"},model:{value:(_vm.seriesObj.stack),callback:function ($$v) {_vm.$set(_vm.seriesObj, "stack", $$v)},expression:"seriesObj.stack"}})],1):_vm._e()],1)],1)]),_c('Modal',{staticClass:"expression",attrs:{"loading":_vm.loading,"title":"添加表达式","width":1000},on:{"on-ok":_vm.expressionSave,"on-cancel":_vm.expressionCancel},model:{value:(_vm.customExpressionShow),callback:function ($$v) {_vm.customExpressionShow=$$v},expression:"customExpressionShow"}},[_c('i-form',{attrs:{"label-colon":"","label-width":90}},[_c('Row',{attrs:{"justify":"center"}},[_c('i-col',[_c('span',{staticClass:"fontColor"},[_vm._v("请在下面的文本框中输入公式，不需要输入开头的等号:")])])],1),_c('Row',{staticStyle:{"margin-top":"10px"},attrs:{"justify":"center"}},[_c('i-col',[_c('i-input',{staticClass:"expressionInput",attrs:{"type":"textarea","placeholder":"请输入表达式"},model:{value:(_vm.expression),callback:function ($$v) {_vm.expression=$$v},expression:"expression"}})],1)],1),_c('Row',{staticStyle:{"margin-top":"10px"},attrs:{"justify":"center"}},[_c('i-col',{staticClass:"functionDiv",attrs:{"span":"6"}},[_c('div',{class:_vm.leftFunctionIndex == 0 ? 'leftFunctionSelect' : 'leftFunction',on:{"click":function($event){return _vm.leftFunctionClick(0)}}},[_c('span',{staticClass:"fontColor"},[_vm._v("常用函数")])])]),_c('i-col',{attrs:{"span":"1"}}),_c('i-col',{attrs:{"span":"13"}},[_c('div',{staticClass:"childrenDiv"},_vm._l((_vm.newFunctionList),function(item,index){return (_vm.commonFunction)?_c('div',{key:index,class:_vm.rightFunctionIndex == index
                    ? 'rightFunctionSelect'
                    : 'activeItem',on:{"click":function($event){return _vm.rightFunctionClick(item, index)}}},[_c('span',{staticClass:"fontColor"},[_vm._v(_vm._s(item))])]):_vm._e()}),0)]),_c('i-col',{attrs:{"span":"5"}},[_c('function-interpretation-setting',{attrs:{"text":_vm.interpretation}})],1)],1)],1)],1)],(_vm.propsContentShow)?_c('Card',{staticStyle:{"width":"100%"}},[_c('Tabs',{attrs:{"size":"small"},model:{value:(_vm.rightTabName),callback:function ($$v) {_vm.rightTabName=$$v},expression:"rightTabName"}},[_c('tab-pane',{class:'little-input',attrs:{"label":"基本","name":"name1"}},[_c('div',{staticClass:"layout-content"},[_c('div',[_c('p',[_vm._v("坐标")]),_c('i-input',{attrs:{"disabled":""},model:{value:(_vm.excel.coordinate),callback:function ($$v) {_vm.$set(_vm.excel, "coordinate", $$v)},expression:"excel.coordinate"}}),_c('p',[_vm._v("类型")]),_c('i-select',{model:{value:(_vm.excel.type),callback:function ($$v) {_vm.$set(_vm.excel, "type", $$v)},expression:"excel.type"}},[_c('i-option',{key:"1",attrs:{"value":"text"}},[_vm._v("文本")]),_c('i-option',{key:"2",attrs:{"value":"pic"}},[_vm._v("图片")]),_c('i-option',{key:"3",attrs:{"value":"barCode"}},[_vm._v("条形码")]),_c('i-option',{key:"4",attrs:{"value":"chart"}},[_vm._v("图表")])],1),_c('p',[_vm._v("值")]),_c('div',[_c('i-input',{nativeOn:{"keyup":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.submitValue($event)}},model:{value:(_vm.excel.excelValue),callback:function ($$v) {_vm.$set(_vm.excel, "excelValue", $$v)},expression:"excel.excelValue"}})],1),(_vm.excel.hasGroup)?_c('div',[_c('p',[_vm._v("聚合方式")]),_c('i-select',{ref:"excelPolyWay",attrs:{"model":_vm.excel.polyWay},on:{"update:model":function($event){return _vm.$set(_vm.excel, "polyWay", $event)},"on-change":_vm.selectPolyList},model:{value:(_vm.excel.polyWay),callback:function ($$v) {_vm.$set(_vm.excel, "polyWay", $$v)},expression:"excel.polyWay"}},_vm._l((_vm.polyWayList),function(item,index){return _c('i-option',{key:index},[_vm._v(_vm._s(item.label))])}),1),_c('p',[_vm._v("扩展方向")]),_c('i-select',{attrs:{"model":_vm.excel.direction},on:{"update:model":function($event){return _vm.$set(_vm.excel, "direction", $event)},"on-change":_vm.selectDirectionList},model:{value:(_vm.excel.direction),callback:function ($$v) {_vm.$set(_vm.excel, "direction", $$v)},expression:"excel.direction"}},_vm._l((_vm.directionList),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.value}},[_vm._v(_vm._s(item.label))])}),1),_c('p',[_vm._v("高级配置")]),_c('i-select',{attrs:{"model":_vm.excel.advanced},on:{"update:model":function($event){return _vm.$set(_vm.excel, "advanced", $event)},"on-change":_vm.selectAdvancedList},model:{value:(_vm.excel.advanced),callback:function ($$v) {_vm.$set(_vm.excel, "advanced", $$v)},expression:"excel.advanced"}},_vm._l((_vm.advancedList),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.value}},[_vm._v(_vm._s(item.label))])}),1)],1):_vm._e(),_c('p',[_vm._v("超链接")]),_c('div',[_c('i-input'),_c('Icon',{attrs:{"type":"md-create"}})],1),_c('p',[_vm._v("弹出目标")]),_c('i-select',[_c('i-option',{key:"1",attrs:{"value":"1"}},[_vm._v("当前窗口")]),_c('i-option',{key:"2",attrs:{"value":"2"}},[_vm._v("新窗口")]),_c('i-option',{key:"3",attrs:{"value":"3"}},[_vm._v("父窗口")]),_c('i-option',{key:"4",attrs:{"value":"4"}},[_vm._v("顶层窗口")]),_c('i-option',{key:"5",attrs:{"value":"5"}},[_vm._v("自定义")])],1),_c('p',[_vm._v("自定义属性")]),_c('div',[_c('i-input')],1),(_vm.isChartSetting)?_c('p',[_vm._v("偏移量")]):_vm._e(),(_vm.isChartSetting)?_c('div',[_c('i-input',{on:{"on-blur":_vm.changeLayerOffset},model:{value:(_vm.offsetInfo),callback:function ($$v) {_vm.offsetInfo=$$v},expression:"offsetInfo"}})],1):_vm._e(),_c('p',[_vm._v("小数位数")]),_c('div',[_c('i-input',{on:{"on-blur":_vm.onChangeDecimalPlaces},model:{value:(_vm.excel.decimalPlaces),callback:function ($$v) {_vm.$set(_vm.excel, "decimalPlaces", $$v)},expression:"excel.decimalPlaces"}})],1)],1)])]),(_vm.isChartSetting && !_vm.backgroundSettingShow)?_c('tab-pane',{attrs:{"label":"样式","name":"name2","disabled":_vm.selectedChartType === 'apiUrlType'}},[_c('i-menu',{class:_vm.menuitemClasses,staticStyle:{"margin-left":"-20px"},attrs:{"theme":"light","width":"auto","accordion":""}},[(_vm.titleSettings)?_c('chart-title-setting',{attrs:{"settings":_vm.titleSettings},on:{"change":_vm.onSettingsChange}}):_vm._e(),(_vm.barSettings)?_c('chart-bar-setting',{attrs:{"settings":_vm.barSettings,"is-multi-chart":_vm.isMultiChart},on:{"change":_vm.onSeriesChange}}):_vm._e(),(_vm.lineSettings)?_c('chart-line-setting',{attrs:{"settings":_vm.lineSettings,"is-multi-chart":_vm.isMultiChart},on:{"change":_vm.onSeriesChange}}):_vm._e(),(_vm.pieSettings)?_c('chart-pie-setting',{attrs:{"settings":_vm.pieSettings},on:{"change":_vm.onSeriesChange}}):_vm._e(),(_vm.marginSettings)?_c('chart-margin-setting',{attrs:{"settings":_vm.marginSettings},on:{"change":_vm.onSeriesChange}}):_vm._e(),(_vm.centralPointSettings)?_c('chart-central-point-setting',{attrs:{"settings":_vm.centralPointSettings},on:{"change":_vm.onSeriesChange}}):_vm._e(),(_vm.funnelSettings)?_c('chart-funnel-setting',{attrs:{"settings":_vm.funnelSettings},on:{"change":_vm.onSeriesChange}}):_vm._e(),(_vm.pictorialSettings)?_c('chart-pictorial-setting',{attrs:{"settings":_vm.pictorialSettings},on:{"change":_vm.onPictorialChange,"upload-success":_vm.pictorialIconUploadSuccess}}):_vm._e(),(_vm.mapGeoSettings)?_c('chart-map-setting',{ref:"mapModal",attrs:{"settings":_vm.mapGeoSettings},on:{"change":_vm.onSettingsChange}}):_vm._e(),(_vm.scatterSettings)?_c('chart-scatter-setting',{attrs:{"settings":_vm.scatterSettings},on:{"change":_vm.onSeriesChange}}):_vm._e(),(_vm.radarSettings)?_c('chart-radar-setting',{attrs:{"settings":_vm.radarSettings},on:{"change":_vm.onSettingsChange}}):_vm._e(),(_vm.gaugeSettings)?_c('chart-gauge-setting',{attrs:{"settings":_vm.gaugeSettings},on:{"change":_vm.onSeriesChange}}):_vm._e(),(_vm.xAxisSettings)?_c('chart-xAxis-setting',{attrs:{"settings":_vm.xAxisSettings},on:{"change":_vm.onSettingsChange}}):_vm._e(),(_vm.yAxisSettings)?_c('chart-yAxis-setting',{attrs:{"settings":_vm.yAxisSettings},on:{"change":_vm.onSettingsChange}}):_vm._e(),(_vm.seriesLabelSettings)?_c('chart-series-setting',{attrs:{"settings":_vm.seriesLabelSettings},on:{"change":_vm.onSeriesChange}}):_vm._e(),(_vm.tooltipSettings)?_c('chart-tooltip-setting',{attrs:{"settings":_vm.tooltipSettings},on:{"change":_vm.onSettingsChange}}):_vm._e(),(_vm.gridSettings)?_c('chart-grid-setting',{attrs:{"settings":_vm.gridSettings},on:{"change":_vm.onSettingsChange}}):_vm._e(),(_vm.legendSettings)?_c('chart-legend-setting',{attrs:{"settings":_vm.legendSettings},on:{"change":_vm.onSettingsChange}}):_vm._e(),(
              _vm.graphSettings ||
              _vm.gaugeSettings ||
              _vm.funnelSettings ||
              _vm.pieSettings ||
              _vm.isMultiChart ||
              _vm.selectedChartType.indexOf('multi') != -1 ||
              _vm.selectedChartType == 'radar.basic'
            )?_c('chart-match-setting',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"chart-options":_vm.chartOptions,"data-settings":_vm.dataSettings}}):_vm._e(),_c('chart-background-setting',{attrs:{"settings":_vm.chartBackground},on:{"change":_vm.chartBackgroundChange,"upload-success":_vm.chartBackgroundUploadSuccess,"remove":_vm.removeChartBackground}})],1)],1):_vm._e(),(_vm.isChartSetting && _vm.selectedChartType !== 'map.simple')?_c('tab-pane',{staticClass:"little-input",attrs:{"label":"数据","name":"name3"}},[_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("数据类型:")]),_c('i-select',{attrs:{"disabled":_vm.selectedChartType === 'apiUrlType'},on:{"on-change":_vm.dataTypeChange},model:{value:(_vm.dataSettings.dataType),callback:function ($$v) {_vm.$set(_vm.dataSettings, "dataType", $$v)},expression:"dataSettings.dataType"}},[_c('i-option',{attrs:{"value":"sql"}},[_vm._v("SQL 数据集")]),_c('i-option',{attrs:{"value":"api"}},[_vm._v("API 数据集")])],1)],1),(_vm.dataSettings.dataType == 'api')?_c('div',{staticClass:"datasource-type"},[_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("API 类型:")]),_c('i-select',{attrs:{"disabled":_vm.selectedChartType === 'apiUrlType'},on:{"on-change":_vm.apiTypeOnChage},model:{value:(_vm.dataSettings.apiStatus),callback:function ($$v) {_vm.$set(_vm.dataSettings, "apiStatus", $$v)},expression:"dataSettings.apiStatus"}},[_c('i-option',{attrs:{"value":"0"}},[_vm._v("静态数据")]),_c('i-option',{attrs:{"value":"1"}},[_vm._v("动态数据")]),_c('i-option',{attrs:{"value":"2"}},[_vm._v("接口请求")])],1)],1),(_vm.dataSettings.apiStatus == '0')?_c('div',{staticClass:"datasource-type"},[_c('span',{staticStyle:{"display":"inline-block","text-align":"left","width":"calc(100% - 50px)"}},[_vm._v("请自定义数据值:")]),_c('i-button',{staticStyle:{"width":"44px"},attrs:{"size":"small","type":"primary"},on:{"click":function($event){_vm.addEchart = true}}},[_vm._v("编辑")])],1):_vm._e(),(_vm.dataSettings.apiStatus == '2')?_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("接口url: ")]),_c('i-input',{attrs:{"autosize":true,"type":"textarea","placeholder":"请输入接口地址..."},model:{value:(_vm.dataSettings.apiUrl),callback:function ($$v) {_vm.$set(_vm.dataSettings, "apiUrl", $$v)},expression:"dataSettings.apiUrl"}})],1):_vm._e(),(_vm.dataSettings.apiStatus == '1')?_c('div',{staticClass:"datasource-type"},[_c('div',[_c('p',[_vm._v("绑定数据集:")]),_c('i-select',{on:{"on-change":_vm.onSelectApiDataset},model:{value:(_vm.dataSettings.dataId),callback:function ($$v) {_vm.$set(_vm.dataSettings, "dataId", $$v)},expression:"dataSettings.dataId"}},_vm._l((_vm.apiDatasets),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.dbId}},[_vm._v(_vm._s(item.title))])}),1)],1)]):_vm._e(),(_vm.dataSettings.apiStatus == '1')?_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("分类属性:")]),_c('i-select',{on:{"on-change":_vm.onAxisXConfigChange},model:{value:(_vm.dataSettings.axisX),callback:function ($$v) {_vm.$set(_vm.dataSettings, "axisX", $$v)},expression:"dataSettings.axisX"}},_vm._l((_vm.apiDatasetFields),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.name}},[_vm._v(_vm._s(item.title))])}),1)],1):_vm._e(),(_vm.dataSettings.apiStatus == '1')?_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("值属性:")]),_c('i-select',{attrs:{"model":_vm.dataSettings.axisY},on:{"update:model":function($event){return _vm.$set(_vm.dataSettings, "axisY", $event)},"on-change":_vm.onAxisYConfigChange},model:{value:(_vm.dataSettings.axisY),callback:function ($$v) {_vm.$set(_vm.dataSettings, "axisY", $$v)},expression:"dataSettings.axisY"}},_vm._l((_vm.apiDatasetFields),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.name}},[_vm._v(_vm._s(item.title))])}),1)],1):_vm._e()]):_vm._e(),(_vm.dataSettings.dataType == 'sql')?_c('div',{staticClass:"datasource-type"},[_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("绑定数据集:")]),_c('i-select',{on:{"on-change":_vm.onSelectSqlDataset},model:{value:(_vm.dataSettings.dataId),callback:function ($$v) {_vm.$set(_vm.dataSettings, "dataId", $$v)},expression:"dataSettings.dataId"}},_vm._l((_vm.sqlDatasets),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.dbId}},[_vm._v(_vm._s(item.title))])}),1)],1),_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("分类属性:")]),_c('i-select',{on:{"on-change":_vm.onAxisXConfigChange},model:{value:(_vm.dataSettings.axisX),callback:function ($$v) {_vm.$set(_vm.dataSettings, "axisX", $$v)},expression:"dataSettings.axisX"}},_vm._l((_vm.sqlDatasetFields),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.name}},[_vm._v(_vm._s(item.title))])}),1)],1),_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("值属性:")]),_c('i-select',{attrs:{"model":_vm.dataSettings.axisY},on:{"update:model":function($event){return _vm.$set(_vm.dataSettings, "axisY", $event)},"on-change":_vm.onAxisYConfigChange},model:{value:(_vm.dataSettings.axisY),callback:function ($$v) {_vm.$set(_vm.dataSettings, "axisY", $$v)},expression:"dataSettings.axisY"}},_vm._l((_vm.sqlDatasetFields),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.name}},[_vm._v(_vm._s(item.title))])}),1)],1),(
              _vm.isMultiChart ||
              _vm.selectedChartType.indexOf('radar') !== -1 ||
              _vm.selectedChartType == 'graph.simple'
            )?[_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("系列属性:")]),_c('i-select',{model:{value:(_vm.dataSettings.series),callback:function ($$v) {_vm.$set(_vm.dataSettings, "series", $$v)},expression:"dataSettings.series"}},_vm._l((_vm.sqlDatasetFields),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.title}},[_vm._v(_vm._s(item.title))])}),1)],1)]:_vm._e(),(_vm.selectedChartType == 'graph.simple')?[_c('Divider',{staticStyle:{"margin":"20px 0 20px 0"}}),_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("绑定节点关系数据集:")]),_c('i-select',{on:{"on-change":_vm.onSelectSqlDataset2},model:{value:(_vm.dataSettings.dataId1),callback:function ($$v) {_vm.$set(_vm.dataSettings, "dataId1", $$v)},expression:"dataSettings.dataId1"}},_vm._l((_vm.sqlDatasets),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.dbId}},[_vm._v(_vm._s(item.title))])}),1)],1),_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("来源属性:")]),_c('i-select',{model:{value:(_vm.dataSettings.source),callback:function ($$v) {_vm.$set(_vm.dataSettings, "source", $$v)},expression:"dataSettings.source"}},_vm._l((_vm.sqlDatasetFields2),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.title}},[_vm._v(_vm._s(item.title))])}),1)],1),_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("目标属性:")]),_c('i-select',{attrs:{"model":_vm.dataSettings.target},on:{"update:model":function($event){return _vm.$set(_vm.dataSettings, "target", $event)}},model:{value:(_vm.dataSettings.target),callback:function ($$v) {_vm.$set(_vm.dataSettings, "target", $$v)},expression:"dataSettings.target"}},_vm._l((_vm.sqlDatasetFields2),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.title}},[_vm._v(_vm._s(item.title))])}),1)],1)]:_vm._e()],2):_vm._e(),(
            ((_vm.dataSettings.dataType == 'sql' ||
              _vm.dataSettings.apiStatus == '1' ||
              _vm.dataSettings.apiStatus == '0') &&
              (_vm.selectedChartType == 'mixed.linebar' ||
                _vm.selectedChartType == 'bar.stack')) ||
            _vm.selectedChartId == 'bar.negative'
          )?_c('div',{staticClass:"datasource-type"},[_c('p',[_vm._v("系列类型:")]),_c('div',{staticStyle:{"margin-top":"5px"}},[_c('Row',{staticClass:"ivurow",staticStyle:{"margin-top":"5px"}},[_c('i-button',{attrs:{"type":"primary","size":"small"},on:{"click":function($event){_vm.seriesModal = true}}},[_vm._v("新增")])],1),_c('i-table',{attrs:{"stripe":"","columns":_vm.seriesColumns,"data":_vm.seriesTypeData}})],1)]):_vm._e(),(
            _vm.dataSettings.apiStatus === '1' || _vm.dataSettings.dataType == 'sql'
          )?[_c('div',{staticClass:"datasource-type"},[_c('span',{staticStyle:{"display":"inline-block","text-align":"left","width":"calc(100% - 50px)"}},[_vm._v("定时刷新:")]),_c('i-switch',{attrs:{"size":"small"},on:{"on-change":_vm.timerChange},model:{value:(_vm.dataSettings.isTiming),callback:function ($$v) {_vm.$set(_vm.dataSettings, "isTiming", $$v)},expression:"dataSettings.isTiming"}})],1),(_vm.dataSettings.isTiming)?_c('div',{staticClass:"datasource-type",staticStyle:{"display":"flex","align-items":"center"}},[_c('span',{staticStyle:{"display":"inline-block","text-align":"left","width":"calc(100% - 100px)"}},[_vm._v("刷新间隔:")]),_c('i-input',{staticStyle:{"width":"100px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.timerChange},model:{value:(_vm.dataSettings.intervalTime),callback:function ($$v) {_vm.$set(_vm.dataSettings, "intervalTime", $$v)},expression:"dataSettings.intervalTime"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_vm._v("秒")])])],1):_vm._e()]:_vm._e(),_c('i-button',{staticStyle:{"width":"100%","height":"36px","margin-top":"10%"},attrs:{"type":"primary"},on:{"click":_vm.runChart}},[_vm._v("运行 ")])],2):_vm._e(),(_vm.backgroundSettingShow)?_c('tab-pane',{class:'little-input',staticStyle:{"visibility":"visible"},attrs:{"label":"背景图设置","name":"name4"}},[_c('div',{class:_vm.backgroundSettings.path ? 'excel-backgroud-st' : '',staticStyle:{"height":"500px","overflow-y":"auto"}},[_c('span',{staticStyle:{"display":"inline-block","margin":"5px 0"}},[_vm._v("图片：")]),_c('Upload',{ref:"upload",staticStyle:{"display":"inline-block","width":"58px"},attrs:{"show-upload-list":false,"default-file-list":_vm.backgroundImg,"on-success":_vm.backgroundImgUploadSuccess,"on-exceeded-size":function (e) { return _vm.handleMaxSize(e, 10); },"format":['jpg', 'jpeg', 'png'],"max-size":10240,"action":_vm.actionUrlPre + '/jmreport/upload'}},[(_vm.backgroundSettings.path)?_c('div',{staticClass:"pictorial-icon-upload",staticStyle:{"display":"block"}},[_c('img',{staticStyle:{"width":"196px","max-height":"100px"},attrs:{"src":_vm.getBackgroundImg()}}),_c('div',{staticClass:"cover",staticStyle:{"width":"196px"}},[_c('Icon',{attrs:{"type":"ios-create-outline"}})],1)]):_c('i-button',{staticStyle:{"margin-left":"25px"},attrs:{"type":"primary","size":"small"}},[_vm._v("上传")])],1),_c('div',{staticStyle:{"width":"100%"}},[_c('p',{staticStyle:{"padding":"6px 0"}},[_vm._v("图片宽度:")]),_c('i-input',{on:{"on-blur":_vm.backgroundChange},model:{value:(_vm.backgroundSettings.width),callback:function ($$v) {_vm.$set(_vm.backgroundSettings, "width", $$v)},expression:"backgroundSettings.width"}}),_c('p',{staticStyle:{"padding":"6px 0"}},[_vm._v("图片高度:")]),_c('i-input',{on:{"on-blur":_vm.backgroundChange},model:{value:(_vm.backgroundSettings.height),callback:function ($$v) {_vm.$set(_vm.backgroundSettings, "height", $$v)},expression:"backgroundSettings.height"}})],1),_c('div',{staticStyle:{"width":"100%"}},[_c('p',{staticStyle:{"padding":"6px 0"}},[_vm._v("重复设置:")]),_c('i-select',{staticStyle:{"width":"99%"},on:{"on-change":_vm.backgroundChange},model:{value:(_vm.backgroundSettings.repeat),callback:function ($$v) {_vm.$set(_vm.backgroundSettings, "repeat", $$v)},expression:"backgroundSettings.repeat"}},[_c('i-option',{attrs:{"value":"repeat"}},[_vm._v("默认")]),_c('i-option',{attrs:{"value":"repeat-x"}},[_vm._v("水平重复")]),_c('i-option',{attrs:{"value":"repeat-y"}},[_vm._v("垂直重复")]),_c('i-option',{attrs:{"value":"no-repeat"}},[_vm._v("无重复")])],1)],1),(_vm.backgroundSettings.path)?_c('i-button',{staticStyle:{"width":"99%","margin":"10px 0"},attrs:{"type":"primary"},on:{"click":_vm.removeBackground}},[_vm._v("取消背景图")]):_vm._e()],1)]):_vm._e(),(_vm.barcodeSettings)?_c('tab-pane',{class:'little-input',staticStyle:{"visibility":"visible"},attrs:{"label":"条形码设置","name":"name5"}},[_c('bar-code-setting',{attrs:{"settings":_vm.barcodeSettings},on:{"change":_vm.onBarcodeChange}})],1):_vm._e(),(_vm.qrcodeSettings)?_c('tab-pane',{class:'little-input',staticStyle:{"visibility":"visible"},attrs:{"label":"二维码设置","name":"name6"}},[_c('qr-code-setting',{attrs:{"settings":_vm.qrcodeSettings},on:{"change":_vm.onBarcodeChange}})],1):_vm._e()],1)],1):_vm._e()],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/ChartSetting.vue?vue&type=template&id=28a5d899&

// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/createForOfIteratorHelper.js
var createForOfIteratorHelper = __webpack_require__("6e8c");

// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__("f076");

// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/objectSpread2.js
var objectSpread2 = __webpack_require__("8d67");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.array.splice.js
var es_array_splice = __webpack_require__("bf2f");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__("b3b0");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.string.includes.js
var es_string_includes = __webpack_require__("a5f8");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.string.replace.js
var es_string_replace = __webpack_require__("fc13");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.regexp.exec.js
var es_regexp_exec = __webpack_require__("9b5f");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each = __webpack_require__("3bae");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.string.split.js
var es_string_split = __webpack_require__("5b12");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.object.assign.js
var es_object_assign = __webpack_require__("3b2b");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.array.join.js
var es_array_join = __webpack_require__("4200");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.object.keys.js
var es_object_keys = __webpack_require__("62f9");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.string.repeat.js
var es_string_repeat = __webpack_require__("90aa");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.array.filter.js
var es_array_filter = __webpack_require__("e3b5");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.array.concat.js
var es_array_concat = __webpack_require__("16ca");

// EXTERNAL MODULE: ./src/utils/config.js
var utils_config = __webpack_require__("01ea");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.promise.js
var es_promise = __webpack_require__("8d9b");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.object.to-string.js
var es_object_to_string = __webpack_require__("27ae");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.promise.finally.js
var es_promise_finally = __webpack_require__("736a");

// EXTERNAL MODULE: ./node_modules/_axios@0.21.1@axios/index.js
var _axios_0_21_1_axios = __webpack_require__("73ef");
var _axios_0_21_1_axios_default = /*#__PURE__*/__webpack_require__.n(_axios_0_21_1_axios);

// CONCATENATED MODULE: ./src/utils/api.js


var api_api;



var api_token = "==========";

function getUrl(url) {
  return "".concat(utils_config["a" /* baseFull */], "/jmreport") + url;
} //拼接待tokenurl


function getHasTokenUrl(url, id) {
  if (id) {
    return "".concat(utils_config["a" /* baseFull */], "/jmreport").concat(url, "/").concat(id, "?token=").concat(api_token);
  } else {
    return "".concat(utils_config["a" /* baseFull */], "/jmreport").concat(url, "?token=").concat(api_token);
  }
}

var api = (api_api = {
  reportServlet: 'http://192.168.0.110:16654/reportRouterServlet',
  //预览界面
  view: getUrl('/view/'),

  /****************************************报表接口****************************************/
  //查询报表
  excelQueryByTemplate: getUrl('/excelQueryByTemplate'),
  //保存报表
  saveReport: getUrl('/save'),
  //检测报名名字是否存在
  excelQueryName: getUrl('/excelQueryName'),
  //加载数据源表信息
  loadTable: getUrl('/loadTable'),
  //加载数据源表数据信息
  loadTableData: getUrl('/loadTableData'),
  //解析sql
  executeSelectSql: getUrl('/executeSelectSql'),
  // 解析api
  executeSelectApi: getUrl('/executeSelectApi'),
  //查询报表
  getReport: function getReport(id) {
    return getHasTokenUrl('/get', id);
  },
  queryIsPage: function queryIsPage(id) {
    return getHasTokenUrl('/queryIsPage', id);
  },

  /****************************************数据源数据集接口****************************************/
  //初始化数据源
  initDataSource: getHasTokenUrl('/initDataSource'),
  //添加数据源
  addDataSource: getUrl('/addDataSource'),
  //删除数据源
  delDataSource: getUrl('/delDataSource'),
  //测试数据源连接
  testConnection: getUrl('/testConnection'),
  //批量删除报表参数
  deleteParamByIds: getUrl('/deleteParamByIds'),
  //批量删除报表参数
  deleteFieldByIds: getUrl('/deleteFieldByIds'),
  //查询数据集
  loadDbData: getUrl('/loadDbData'),
  //报错数据集
  saveDb: getUrl('/saveDb')
}, Object(defineProperty["a" /* default */])(api_api, "loadDbData", function loadDbData(dbId) {
  return getHasTokenUrl('/loadDbData', dbId);
}), Object(defineProperty["a" /* default */])(api_api, "mapList", getUrl('/map/mapList')), Object(defineProperty["a" /* default */])(api_api, "addMapData", getUrl('/map/addMapData')), Object(defineProperty["a" /* default */])(api_api, "delMapSource", getUrl('/map/delMapSource')), Object(defineProperty["a" /* default */])(api_api, "queryMapByCode", getUrl('/map/queryMapByCode')), api_api);

// CONCATENATED MODULE: ./src/utils/request.js








 // request interceptor

var err = function err(error) {
  if (error.response) {
    var data = error.response.data;
    Vue.prototype.$Message.destroy();

    if (error.response.status === 401) {
      Vue.prototype.$Message.error('登录超时,或未登录系统');
    } else if (error.response.status === 403) {
      Vue.prototype.$Message.error('资源不可访问');
    } else if (error.response.status === 502) {
      Vue.prototype.$Message.error('连接服务器失败');
    } else if (error.response.status === 429) {
      Vue.prototype.$Message.error('访问太过频繁，请稍后再试!');
    } else {
      Vue.prototype.$Message.error('服务器异常');
    }
  }

  return Promise.reject(error);
};

_axios_0_21_1_axios_default.a.interceptors.request.use(function (config) {
  var token = window.localStorage.getItem('JmReport-Access-Token');

  if (token) {
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers['X-Access-Token'] = token;
  }

  return config;
}, err);
_axios_0_21_1_axios_default.a.interceptors.response.use(function (response) {
  var code = response.data.code;

  if (code === 403 || code === 500) {
    var message = response.data.message;

    if (message) {
      var confirmMessage = '';

      if (message.includes('Token失效') || message.includes('token不能为空') || message.includes('token非法')) {
        confirmMessage = '操作失败，Token失效，请重新登录!';
      }

      if (confirmMessage) {
        Vue.prototype.$Modal.warning({
          title: '登录已过期',
          content: '很抱歉,登录已过期,请重新登录',
          onOk: function onOk() {
            //window.open(window._CONFIG['domianURL'],'_self');
            window.opener = null;
            window.open('', '_self');
            window.close();
          }
        });
      }
    }
  }

  return response;
}, function (error) {
  return Promise.reject(error);
});
var $http = {
  get: function get(option, that) {
    var params = option.data ? option.data : {};

    var config = Object(objectSpread2["a" /* default */])({
      params: params
    }, option);

    _axios_0_21_1_axios_default.a.get(option.url, config).then(function (res) {
      if (res.data.success) {
        option.success && option.success(res.data.result, res.data);
      } else {
        if (res.data.message) {
          Vue.prototype.$Message.error(res.data.message);
        }

        option.fail && option.fail(res.data);
      }
    }).catch(function (error) {
      console.log(error);
      option.error && option.error(error);
    });
  },
  del: function del(option, that) {
    var params = option.data ? option.data : {};

    var config = Object(objectSpread2["a" /* default */])({
      params: params
    }, option);

    _axios_0_21_1_axios_default.a.delete(option.url, config).then(function (res) {
      if (res.data.success) {
        if (res.data.message) {
          Vue.prototype.$Message.info(res.data.message);
        }

        option.success && option.success(res.data.result, res.data);
      } else {
        if (res.data.message) {
          Vue.prototype.$Message.error(res.data.message);
        }

        option.fail && option.fail(res.data);
      }
    }).catch(function (error) {
      console.log(error);
      option.error && option.error(error);
    });
  },
  post: function post(option, that) {
    var params = option.data ? option.data : {};
    var contentType = option.contentType ? 'json' : 'form';
    var config = {
      url: option.url,
      data: params,
      method: 'post'
    };

    if (contentType == 'json') {
      config.headers = {
        "Content-Type": "application/json;charset=UTF-8"
      };
    } else {
      config.transformRequest = [function (data, headers) {
        return Qs.stringify(Object(objectSpread2["a" /* default */])({}, data));
      }];
      config.headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
    }

    _axios_0_21_1_axios_default.a.request(config).then(function (res) {
      if (res.data.success) {
        if (res.data.message) {
          Vue.prototype.$Message.info(res.data.message);
        }

        option.success && option.success(res.data.result, res.data);
      } else {
        if (res.data.message) {
          Vue.prototype.$Message.error(res.data.message);
        }

        option.fail && option.fail(res.data);
      }
    }).catch(function (error) {
      console.log(error);
      option.error && option.error(error);
    }).finally(function (res) {
      option.finally && option.finally(res);
    });
  },
  confirm: function confirm(option, that) {
    var me = this;
    var method = option.method ? option.method : 'del';
    that.$Modal.confirm({
      content: '<i class="ivu-icon ivu-icon-ios-alert" style="color: #f90;font-size: 20px;margin-right: 5px;"></i>' + option.content,
      onOk: function onOk() {
        if (method == 'del') {
          me.del(option, that);
        } else {
          me.get(option, that);
        }
      }
    });
  }
};
/**
 * 通用请求工具
 * @param {Object} params 参数
 *     type: POST|GET|DELETE|UPDATE
 *     contentType: application/json | application/x-www-form-urlencoded | text
 *     data: 请求数据
 *     async 是否为异步请求
 *     success: () => {}
 *     error: () => {}
 *     
 */

function request(params) {
  var xhr = null;

  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xhr.open(params.type || 'POST', params.url, params.async !== false);
  xhr.setRequestHeader('Content-Type', params.contentType || 'application/json');
  xhr.withCredentials = false;
  var sendData = null;
  var contentType = params.contentType,
      data = params.data;

  if (data) {
    if (contentType === "multipart/form-data") {
      sendData = new FormData();

      for (var key in data) {
        sendData.append(key, data[key]);
      }
    } else if (contentType === "application/json") {
      sendData = JSON.stringify(data);
    } else if (contentType === "text") {
      sendData = "";

      for (var _key in data) {
        sendData += _key + "=" + data[_key] + "&";
      }

      if (sendData != "") {
        sendData = sendData.substring(0, sendData.length - 1);
      }
    } else if (contentType === "application/x-www-form-urlencoded") {
      sendData = "";

      for (var _key2 in data) {
        sendData += _key2 + "=" + data[_key2] + "&";
      }

      if (sendData != "") {
        sendData = sendData.substring(0, sendData.length - 1);
      }
    }
  }

  xhr.onreadystatechange = function () {
    if (4 === xhr.readyState) {
      var success = params.success,
          error = params.error;
      var _xhr = xhr,
          status = _xhr.status,
          responseText = _xhr.responseText;

      if (200 == status) {
        typeof success === 'function' && success(JSON.parse(responseText));
      } else {
        typeof error === 'function' && success(responseText);
      }
    }
  };

  xhr.send(sendData);
}
/**
 * 普通 GET Http 请求
 * @param {Object} params 请求参数
 */


function httpGet(params) {
  params = Object.assign({
    type: 'GET'
  }, params);
  request(params);
}
/**
 * 平台请求
 * @param {Object} params 请求参数
 *      与上诉支持的请求参数一致，另外还支持以下
 *      operServiceId，operId，token
 */


function newtecRequest(params) {
  var params = Object.assign({
    url: api.reportServlet,
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded'
  }, params);
  var _params = params,
      data = _params.data,
      operServiceId = _params.operServiceId,
      operId = _params.operId,
      token = _params.token;
  var rParams = {
    data: data,
    operServiceId: operServiceId,
    operId: operId,
    token: token
  };
  params.data = {
    params: JSON.stringify(rParams)
  };
  request(params);
} // newtecRequest({
//   url: 'http://192.168.60.104:16654/reportRouterServlet',
//   operServiceId: "chartConfigService",
//   operId: "getEchartDefaultConfig",
//   token: "e3f20cc5d3d544a38a4d84d5d668b511",
//   data: "bar.background",
//   success: function (res) {
//     console.info("res", res)
//   }
// });



// EXTERNAL MODULE: ./src/utils/util.js
var util = __webpack_require__("ca00");

// EXTERNAL MODULE: ./src/utils/design.js
var design = __webpack_require__("50e5");

// CONCATENATED MODULE: ./src/data/chartTypeList.js
/***
 * 图表选择 dialog 数据
 */
/* harmony default export */ var chartTypeList = ([{
  "label": "柱形图",
  "name": "bar",
  "typeList": [{
    "id": "bar.simple",
    "name": "普通柱形图",
    "type": "bar.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/bar-1.jpg",
    "allowed": true
  }, {
    "id": "bar.background",
    "name": "带背景柱形图",
    "type": "bar.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/bar-2.jpg",
    "allowed": true
  }, {
    "id": "bar.multi",
    "name": "多数据对比柱形图",
    "type": "bar.multi",
    "imgUrl": "/jmreport/desreport_/chartsImg/bar-3.jpg",
    "allowed": true
  }, {
    "id": "bar.negative",
    "name": "正负条形图",
    "type": "bar.stack.horizontal",
    "imgUrl": "/jmreport/desreport_/chartsImg/bar-4.jpg",
    "allowed": true
  }, {
    "id": "bar.stack",
    "name": "堆叠柱形图",
    "type": "bar.stack",
    "imgUrl": "/jmreport/desreport_/chartsImg/bar-5.jpg",
    "allowed": true
  }, {
    "id": "bar.stack.horizontal",
    "name": "堆叠条形图",
    "type": "bar.stack.horizontal",
    "imgUrl": "/jmreport/desreport_/chartsImg/bar-6.png",
    "allowed": true
  }, {
    "id": "bar.multi.horizontal",
    "name": "多数据条形柱状图",
    "type": "bar.multi.horizontal",
    "imgUrl": "/jmreport/desreport_/chartsImg/bar-7.png",
    "allowed": true
  }]
}, {
  "label": "折线图",
  "name": "line",
  "typeList": [{
    "id": "line.simple",
    "name": "普通折线图",
    "type": "line.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/line-1.jpg",
    "allowed": true
  }, {
    "id": "line.area",
    "name": "面积堆积折线图",
    "type": "line.area",
    "imgUrl": "/jmreport/desreport_/chartsImg/line-2.jpg",
    "allowed": true
  }, {
    "id": "line.smooth",
    "name": "平滑曲线折线图",
    "type": "line.smooth",
    "imgUrl": "/jmreport/desreport_/chartsImg/line-3.jpg",
    "allowed": true
  }, {
    "id": "line.multi",
    "name": "多数据对比折线图",
    "type": "line.multi",
    "imgUrl": "/jmreport/desreport_/chartsImg/line-4.png",
    "allowed": true
  }, {
    "id": "line.step",
    "name": "阶梯折线图",
    "type": "line.step",
    "imgUrl": "/jmreport/desreport_/chartsImg/line-6.png",
    "allowed": true
  }]
}, {
  "label": "饼图",
  "name": "pie",
  "typeList": [{
    "id": "pie.simple",
    "name": "普通饼图",
    "type": "pie.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/pie-1.png",
    "allowed": true
  }, {
    "id": "pie.doughnut",
    "name": "环状饼图",
    "type": "pie.doughnut",
    "imgUrl": "/jmreport/desreport_/chartsImg/pie-2.png",
    "allowed": true
  }, {
    "id": "pie.rose",
    "name": "南丁格尔玫瑰饼图",
    "type": "pie.rose",
    "imgUrl": "/jmreport/desreport_/chartsImg/pie-3.png",
    "allowed": true
  }]
}, {
  "label": "折柱图",
  "name": "mixed.linebar",
  "typeList": [{
    "id": "mixed.linebar",
    "name": "普通折柱图",
    "type": "mixed.linebar",
    "imgUrl": "/jmreport/desreport_/chartsImg/mix-line-bar.jpg",
    "allowed": true
  }]
}, {
  "label": "散点图",
  "name": "scatter",
  "typeList": [{
    "id": "scatter.simple",
    "name": "普通散点图",
    "type": "scatter.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/scatter-simple.jpg",
    "allowed": true
  }, {
    "id": "scatter.bubble",
    "name": "气泡散点图",
    "type": "scatter.bubble",
    "imgUrl": "/jmreport/desreport_/chartsImg/scatter_bubble.png",
    "allowed": true
  }]
}, {
  "label": "漏斗图",
  "name": "funnel",
  "typeList": [{
    "id": "funnel.simple",
    "name": "普通漏斗图",
    "type": "funnel.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/funnel.png",
    "allowed": true
  }, {
    "id": "funnel.pyramid",
    "name": "金字塔漏斗图",
    "type": "funnel.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/funnel.pyramid.png",
    "allowed": true
  }]
}, {
  "label": "雷达图",
  "name": "radar",
  "typeList": [{
    "id": "radar.basic",
    "name": "普通雷达图",
    "type": "radar.basic",
    "imgUrl": "/jmreport/desreport_/chartsImg/radar.png",
    "allowed": true
  }, {
    "id": "radar.custom",
    "name": "圆形雷达图",
    "type": "radar.basic",
    "imgUrl": "/jmreport/desreport_/chartsImg/radar-2.png",
    "allowed": true
  }]
}, {
  "label": "象形图",
  "name": "pictorial",
  "typeList": [{
    "id": "pictorial.spirits",
    "name": "普通象形图",
    "type": "pictorial.spirits",
    "imgUrl": "/jmreport/desreport_/chartsImg/pictorialBar-spirit.png",
    "allowed": true
  }]
}, {
  "label": "地图",
  "name": "map",
  "typeList": [{
    "id": "map.simple",
    "name": "区域地图",
    "type": "map.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/map.png",
    "allowed": true
  }, {
    "id": "map.scatter",
    "name": "点地图",
    "type": "map.scatter",
    "imgUrl": "/jmreport/desreport_/chartsImg/map_scatter.png",
    "allowed": true
  }]
}, {
  "label": "仪表盘",
  "name": "gauge",
  "typeList": [{
    "id": "gauge.simple",
    "name": "360°仪表盘",
    "type": "gauge.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/gauge.png",
    "allowed": true
  }, {
    "id": "gauge.simple180",
    "name": "180°仪表盘",
    "type": "gauge.simple180",
    "imgUrl": "/jmreport/desreport_/chartsImg/gauge180.png",
    "allowed": true
  }]
}, {
  "label": "关系图",
  "name": "graph",
  "typeList": [{
    "id": "graph.simple",
    "name": "普通关系图",
    "type": "graph.simple",
    "imgUrl": "/jmreport/desreport_/chartsImg/graph.png",
    "allowed": true
  }]
}]);
// CONCATENATED MODULE: ./src/data/defaultChartConfig.js
/***
 * 不同类型的图表的默认数据
 */
/* harmony default export */ var defaultChartConfig = ({
  "bar.simple": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "销量",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "服饰",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "barWidth": 50,
      "data": [5, 20, 36, 10, 10, 20],
      "name": "销量",
      "itemStyle": {
        "color": "#c43632",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "top": "5",
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "bar.background": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "销量",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "服饰",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "barWidth": 50,
      "data": [5, 20, 36, 10, 10, 20],
      "showBackground": true,
      "name": "销量",
      "backgroundStyle": {
        "color": "rgba(220, 220, 220, 0.8)"
      },
      "itemStyle": {
        "color": "#c43632",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "bar.multi": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type ": "value"
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type": "category"
    },
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["直接访问", "邮件营销", "联盟广告"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "barWidth": 0,
      "data": [320, 332, 301, 334, 390, 330, 320],
      "name": "直接访问",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 0,
      "data": [120, 132, 101, 134, 90, 230, 210],
      "name": "邮件营销",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 0,
      "data": [220, 182, 191, 234, 290, 330, 310],
      "name": "联盟广告",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }],
    "tooltip": {
      "show": true,
      "axisPointer": {
        "type": "shadow"
      },
      "trigger": "axis",
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "bar.negative": {
    "yAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type": "category"
    },
    "xAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": true
      },
      "type ": "value"
    },
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["利润", "支出", "收入"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "barWidth": 25,
      "stack": "利润",
      "data": [200, 170, 240, 244, 200, 220, 210],
      "name": "利润",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "inside"
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 25,
      "stack": "总量",
      "data": [320, 302, 341, 374, 390, 450, 420],
      "name": "收入",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 5,
      "stack": "总量",
      "data": [-120, -132, -101, -134, -190, -230, -210],
      "name": "支出",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "left"
      },
      "type": "bar",
      "barMinHeight": 2
    }],
    "tooltip": {
      "show": true,
      "axisPointer": {
        "type": "shadow"
      },
      "trigger": "axis",
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "利润统计",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "bar.stack": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type ": "value"
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type": "category"
    },
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["直接访问", "邮件营销", "联盟广告", "百度", "谷歌", "必应"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "barWidth": 15,
      "stack": "",
      "data": [320, 332, 301, 334, 390, 330, 320],
      "name": "直接访问",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 15,
      "stack": "总量",
      "data": [120, 132, 101, 134, 90, 230, 210],
      "name": "邮件营销",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 15,
      "stack": "总量",
      "data": [220, 182, 191, 234, 290, 330, 310],
      "name": "联盟广告",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 15,
      "stack": "搜索引擎",
      "data": [620, 732, 701, 734, 1090, 1130, 1120],
      "name": "百度",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 15,
      "stack": "搜索引擎",
      "data": [120, 132, 101, 134, 290, 230, 220],
      "name": "谷歌",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 15,
      "stack": "搜索引擎",
      "data": [60, 72, 71, 74, 190, 130, 110],
      "name": "必应",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "type": "bar",
      "barMinHeight": 2
    }],
    "tooltip": {
      "show": true,
      "axisPointer": {
        "type": "shadow"
      },
      "trigger": "axis",
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "bar.stack.horizontal": {
    "yAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["周一", "周二", "周三", "周四", "周五"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type": "category"
    },
    "xAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type ": "value"
    },
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["直接访问", "邮件营销", "联盟广告"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "barWidth": 15,
      "stack": "总量",
      "data": [320, 332, 301, 334, 390],
      "name": "直接访问",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 15,
      "stack": "总量",
      "data": [120, 132, 101, 134, 90],
      "name": "邮件营销",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 15,
      "stack": "总量",
      "data": [220, 182, 191, 234, 290],
      "name": "联盟广告",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "type": "bar",
      "barMinHeight": 2
    }],
    "tooltip": {
      "show": true,
      "axisPointer": {
        "type": "shadow"
      },
      "trigger": "axis",
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "bar.multi.horizontal": {
    "yAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["周一", "周二", "周三", "周四", "周五"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type": "category"
    },
    "xAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type ": "value"
    },
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["直接访问", "邮件营销", "联盟广告"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "barWidth": 0,
      "data": [320, 332, 301, 334, 390],
      "name": "直接访问",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "right",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 0,
      "data": [120, 132, 101, 134, 90],
      "name": "邮件营销",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "right",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 0,
      "data": [220, 182, 191, 234, 290],
      "name": "联盟广告",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "right",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }],
    "tooltip": {
      "show": true,
      "axisPointer": {
        "type": "shadow"
      },
      "trigger": "axis",
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "line.simple": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "销量",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "服饰",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "areaStyle": {
        "color": "rgba(220,38,38,0)",
        "opacity": 1
      },
      "data": [5, 20, 36, 10, 10, 20],
      "showSymbol": true,
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 5,
      "isArea": false,
      "name": "销量",
      "itemStyle": {
        "color": "#c43632"
      },
      "step": false,
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "line",
      "smooth": false
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 10],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "line.area": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "销量",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "服饰",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "areaStyle": {
        "color": "#c43632",
        "opacity": 1
      },
      "data": [5, 20, 36, 10, 10, 20],
      "showSymbol": true,
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 5,
      "isArea": true,
      "name": "销量",
      "itemStyle": {
        "color": "#c43632"
      },
      "step": false,
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "line",
      "smooth": false
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 10],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "line.smooth": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "销量",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "服饰",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "areaStyle": {
        "color": "rgba(220,38,38,0)",
        "opacity": 1
      },
      "data": [5, 20, 36, 10, 10, 20],
      "showSymbol": true,
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 5,
      "isArea": false,
      "name": "销量",
      "itemStyle": {
        "color": "#c43632"
      },
      "step": false,
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "line",
      "smooth": true
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 10],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "line.multi": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type": "value"
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["周一", "周二", "周三", "周四", "周五"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type": "category",
      "boundaryGap": true
    },
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["意向", "预购", "成交"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "data": [30, 182, 434, 791, 390],
      "showSymbol": true,
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 5,
      "name": "预购",
      "itemStyle": {
        "color": ""
      },
      "step": false,
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "line",
      "smooth": false
    }, {
      "data": [10, 12, 21, 54, 260],
      "showSymbol": true,
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 5,
      "name": "成交",
      "itemStyle": {
        "color": ""
      },
      "step": false,
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "line",
      "smooth": false
    }, {
      "data": [1320, 1132, 601, 234, 120],
      "showSymbol": true,
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 5,
      "name": "意向",
      "itemStyle": {
        "color": ""
      },
      "step": false,
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "line",
      "smooth": false
    }],
    "tooltip": {
      "show": true,
      "trigger": "axis",
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某楼盘销售情况",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "line.step": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "销量",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "服饰",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "areaStyle": {
        "color": "rgba(220,38,38,0)",
        "opacity": 1
      },
      "data": [5, 20, 36, 10, 10, 20],
      "showSymbol": true,
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 5,
      "isArea": false,
      "name": "销量",
      "itemStyle": {
        "color": "#c43632"
      },
      "step": true,
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "line",
      "smooth": false
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 10],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "pie.simple": {
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["视频广告", "联盟广告", "邮件营销", "直接访问", "搜索引擎", "间接访问"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "series": [{
      "isRose": false,
      "data": [{
        "name": "视频广告",
        "itemStyle": {
          "color": null
        },
        "value": 1170
      }, {
        "name": "联盟广告",
        "itemStyle": {
          "color": null
        },
        "value": 417
      }, {
        "name": "邮件营销",
        "itemStyle": {
          "color": null
        },
        "value": 335
      }, {
        "name": "直接访问",
        "itemStyle": {
          "color": null
        },
        "value": 410
      }, {
        "name": "搜索引擎",
        "itemStyle": {
          "color": null
        },
        "value": 800
      }],
      "isRadius": false,
      "roseType": "",
      "notCount": false,
      "center": [320, 180],
      "name": "访问来源",
      "minAngle": 0,
      "label": {
        "show": true,
        "position": "outside",
        "textStyle": {
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "pie",
      "radius": "55%",
      "autoSort": false
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 10],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "pie.doughnut": {
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["视频广告", "联盟广告", "邮件营销", "直接访问", "搜索引擎", "间接访问"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "series": [{
      "isRose": false,
      "data": [{
        "name": "视频广告",
        "itemStyle": {
          "color": null
        },
        "value": 1170
      }, {
        "name": "联盟广告",
        "itemStyle": {
          "color": null
        },
        "value": 417
      }, {
        "name": "邮件营销",
        "itemStyle": {
          "color": null
        },
        "value": 335
      }, {
        "name": "直接访问",
        "itemStyle": {
          "color": null
        },
        "value": 410
      }, {
        "name": "搜索引擎",
        "itemStyle": {
          "color": null
        },
        "value": 800
      }],
      "isRadius": true,
      "roseType": "",
      "notCount": false,
      "center": [320, 180],
      "name": "访问来源",
      "minAngle": 0,
      "label": {
        "show": true,
        "position": "outside",
        "textStyle": {
          "color": "",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "pie",
      "radius": ["45%", "55%"],
      "autoSort": false
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 10],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "pie.rose": {
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["视频广告", "联盟广告", "邮件营销", "直接访问", "搜索引擎", "间接访问"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "series": [{
      "isRose": true,
      "data": [{
        "name": "视频广告",
        "itemStyle": {
          "color": null
        },
        "value": 1170
      }, {
        "name": "联盟广告",
        "itemStyle": {
          "color": null
        },
        "value": 417
      }, {
        "name": "邮件营销",
        "itemStyle": {
          "color": null
        },
        "value": 335
      }, {
        "name": "直接访问",
        "itemStyle": {
          "color": null
        },
        "value": 410
      }, {
        "name": "搜索引擎",
        "itemStyle": {
          "color": null
        },
        "value": 800
      }],
      "isRadius": false,
      "roseType": "radius",
      "notCount": false,
      "center": [320, 180],
      "name": "访问来源",
      "minAngle": 0,
      "label": {
        "show": true,
        "position": "outside",
        "textStyle": {
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "pie",
      "radius": "55%",
      "autoSort": false
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 10],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "mixed.linebar": {
    "yAxis": [{
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "水量",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type": "value"
    }, {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "温度",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "type": "value"
    }],
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "data": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      },
      "axisPointer": {
        "type": "shadow"
      },
      "type": "category"
    },
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["蒸发量", "降水量", "平均温度"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "barWidth": 15,
      "data": [2, 4.9, 7, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20, 6.4, 3.3],
      "name": "蒸发量",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "barWidth": 15,
      "data": [2.6, 5.9, 9, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6, 2.3],
      "name": "降水量",
      "itemStyle": {
        "color": "",
        "barBorderRadius": 0
      },
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "bar",
      "barMinHeight": 2
    }, {
      "data": [2, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23, 16.5, 12, 6.2],
      "showSymbol": true,
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 5,
      "name": "平均温度",
      "itemStyle": {
        "color": ""
      },
      "step": false,
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "line",
      "yAxisIndex": 1,
      "smooth": false
    }],
    "chartType": "linebar",
    "tooltip": {
      "show": true,
      "axisPointer": {
        "crossStyle": {
          "color": "#999"
        },
        "type": "cross"
      },
      "trigger": "axis",
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "scatter.simple": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "data": [[10, 8.04], [8, 6.95], [13, 7.58], [9, 8.81], [11, 8.33], [14, 9.96], [6, 7.24], [4, 4.26], [12, 10.84], [7, 4.82], [5, 5.68]],
      "symbolSize": 20,
      "itemStyle": {
        "color": "#C23531",
        "opacity": 1
      },
      "label": {
        "show": true,
        "position": "top",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        },
        "opacity": 1
      },
      "type": "scatter"
    }],
    "tooltip": {
      "formatter": "{c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "散点图",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "scatter.bubble": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "interval": 0,
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "legend": {
      "padding": [25, 20, 25, 10],
      "top": "top",
      "orient": "horizontal",
      "data": ["1990", "2015"],
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "series": [{
      "data": [[28604, 77], [31163, 77.4], [1516, 68], [13670, 74.7], [28599, 75], [29476, 77.1], [31476, 75.4], [28666, 78.1], [1777, 57.7], [29550, 79.1], [2076, 67.9], [12087, 72], [24021, 75.4], [43296, 76.8], [10088, 70.8], [19349, 69.6]],
      "symbolSize": 20,
      "name": "1990",
      "itemStyle": {
        "shadowOffsetY": 5,
        "color": {
          "r": 0.8,
          "colorStops": [{
            "offset": 0,
            "color": "#E7727C"
          }, {
            "offset": 1,
            "color": "#D7291F"
          }],
          "type": "radial"
        },
        "shadowBlur": 10,
        "shadowColor": "rgba(25, 100, 150, 0.5)"
      },
      "type": "scatter"
    }, {
      "data": [[44056, 81.8], [43294, 81.7], [13334, 76.9], [21291, 78.5], [38923, 80.8], [37599, 81.9], [44053, 81.1], [42182, 82.8], [5903, 66.8], [36162, 83.5], [1390, 71.4], [34644, 80.7], [34186, 80.6], [64304, 81.6], [24787, 77.3]],
      "symbolSize": 20,
      "name": "2015",
      "itemStyle": {
        "shadowOffsetY": 5,
        "color": {
          "r": 0.8,
          "colorStops": [{
            "offset": 0,
            "color": "#70D1E1"
          }, {
            "offset": 1,
            "color": "#0188FB"
          }],
          "type": "radial"
        },
        "shadowBlur": 10,
        "shadowColor": "rgba(25, 100, 150, 0.5)"
      },
      "type": "scatter"
    }],
    "tooltip": {
      "formatter": "{c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "散点图",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "funnel.simple": {
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["展现", "点击", "访问", "咨询", "订单"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "series": [{
      "orient": "vertical",
      "data": [{
        "name": "访问",
        "value": 60
      }, {
        "name": "咨询",
        "value": 40
      }, {
        "name": "订单",
        "value": 20
      }, {
        "name": "点击",
        "value": 80
      }, {
        "name": "展现",
        "value": 100
      }],
      "bottom": 60,
      "itemStyle": {
        "borderColor": "#fff",
        "borderWidth": 1
      },
      "sort": "descending",
      "label": {
        "show": true,
        "position": "inside",
        "textStyle": {
          "fontSize": 16,
          "fontWeight": "normal"
        }
      },
      "labelLine": {
        "lineStyle": {
          "width": 1,
          "type": "solid"
        },
        "length": 10
      },
      "type": "funnel",
      "top": 60,
      "left": "10%",
      "gap": 2,
      "name": "漏斗图",
      "width": "80%",
      "emphasis": {
        "label": {
          "fontSize": 20
        }
      }
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "trigger": "item",
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "funnel.pyramid": {
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["展现", "点击", "访问", "咨询", "订单"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "series": [{
      "orient": "vertical",
      "data": [{
        "name": "访问",
        "value": 60
      }, {
        "name": "咨询",
        "value": 40
      }, {
        "name": "订单",
        "value": 20
      }, {
        "name": "点击",
        "value": 80
      }, {
        "name": "展现",
        "value": 100
      }],
      "bottom": 60,
      "itemStyle": {
        "borderColor": "#fff",
        "borderWidth": 1
      },
      "sort": "ascending",
      "label": {
        "show": true,
        "position": "inside",
        "textStyle": {
          "fontSize": 16,
          "fontWeight": "normal"
        }
      },
      "labelLine": {
        "lineStyle": {
          "width": 1,
          "type": "solid"
        },
        "length": 10
      },
      "type": "funnel",
      "top": 60,
      "left": "10%",
      "gap": 2,
      "name": "金字塔漏斗图",
      "width": "80%",
      "emphasis": {
        "label": {
          "fontSize": 20
        }
      }
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "trigger": "item",
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "radar.basic": {
    "radar": [{
      "indicator": [{
        "max": 6500,
        "name": "销售（sales）"
      }, {
        "max": 16000,
        "name": "管理（Administration）"
      }, {
        "max": 30000,
        "name": "信息技术（Information Techology）"
      }, {
        "max": 38000,
        "name": "客服（Customer Support）"
      }, {
        "max": 52000,
        "name": "研发（Development）"
      }, {
        "max": 25000,
        "name": "市场（Marketing）"
      }],
      "shape": "polygon",
      "axisLine": {
        "lineStyle": {
          "color": "gray",
          "opacity": 0.5
        }
      },
      "center": [320, 200],
      "name": {
        "formatter": "【{value}】",
        "textStyle": {
          "color": "#72ACD1",
          "fontSize": 14
        }
      },
      "splitLine": {
        "lineStyle": {
          "color": "gray",
          "opacity": 0.5
        }
      }
    }],
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["预算分配（Allocated Budget）", "实际开销（Actual Spending）"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "series": [{
      "data": [{
        "lineStyle": {},
        "name": "预算分配（Allocated Budget）",
        "value": [4300, 10000, 28000, 35000, 50000, 19000]
      }, {
        "lineStyle": {},
        "name": "实际开销（Actual Spending）",
        "value": [5000, 14000, 28000, 31000, 42000, 21000]
      }],
      "name": "预算 vs 开销（Budget vs spending）",
      "type": "radar"
    }],
    "tooltip": {
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "基础雷达图",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "radar.custom": {
    "radar": [{
      "indicator": [{
        "max": 6500,
        "name": "指标一"
      }, {
        "max": 6500,
        "name": "指标二"
      }, {
        "max": 6500,
        "name": "指标三"
      }, {
        "max": 6500,
        "name": "指标四"
      }, {
        "max": 6500,
        "name": "指标五"
      }],
      "startAngle": 90,
      "shape": "circle",
      "splitArea": {
        "areaStyle": {
          "color": ["rgba(114, 172, 209, 0.2)", "rgba(114, 172, 209, 0.4)", "rgba(114, 172, 209, 0.6)", "rgba(114, 172, 209, 0.8)", "rgba(114, 172, 209, 1)"],
          "shadowBlur": 10,
          "shadowColor": "rgba(0, 0, 0, 0.3)"
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": "gray",
          "opacity": 0.5
        }
      },
      "center": [320, 200],
      "name": {
        "formatter": "【{value}】",
        "textStyle": {
          "color": "#72ACD1"
        }
      },
      "splitLine": {
        "lineStyle": {
          "color": "gray",
          "opacity": 0.5
        }
      },
      "splitNumber": 4,
      "radius": 90
    }],
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["图一", "图二"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "series": [{
      "data": [{
        "lineStyle": {},
        "name": "图一",
        "value": [1000, 2000, 3000, 4000, 2000]
      }, {
        "lineStyle": {},
        "name": "图二",
        "value": [5000, 4000, 3000, 100, 1500]
      }],
      "name": "雷达图",
      "type": "radar"
    }],
    "tooltip": {
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [8, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "圆形雷达图",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "pictorial.spirits": {
    "yAxis": {
      "axisLabel": {
        "textStyle": {
          "color": "#999",
          "fontSize": 16
        }
      },
      "inverse": false,
      "data": ["2017", "2018", "2019", "2020"],
      "axisLine": {
        "lineStyle": {
          "color": "#333"
        }
      },
      "show": true,
      "name": "",
      "axisTick": {
        "show": false
      },
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "xAxis": {
      "axisLabel": {
        "rotate": 0,
        "margin": 10,
        "interval": 0,
        "textStyle": {
          "color": "green",
          "fontSize": 12
        }
      },
      "max": 2000,
      "axisLine": {
        "lineStyle": {
          "color": "#999"
        }
      },
      "show": true,
      "name": "",
      "splitLine": {
        "lineStyle": {
          "color": "red",
          "width": 1,
          "type": "solid"
        },
        "show": false
      }
    },
    "grid": {
      "top": 60,
      "left": 60,
      "bottom": 60,
      "right": 60
    },
    "series": [{
      "symbol": "",
      "symbolRepeat": "fixed",
      "symbolMargin": "5%!",
      "data": [891, 1220, 660, 1670],
      "symbolSize": 30,
      "double": false,
      "symbolBoundingData": 2000,
      "label": {
        "show": true,
        "position": "right",
        "textStyle": {
          "color": "black",
          "fontSize": 16,
          "fontWeight": "bolder"
        }
      },
      "type": "pictorialBar",
      "symbolClip": true,
      "secondOpacity": 0.2
    }],
    "title": {
      "padding": [5, 20, 5, 20],
      "top": "5",
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "map.simple": {
    "geo": {
      "regions": [],
      "layoutSize": 600,
      "emphasis": {
        "itemStyle": {
          "areaColor": "red"
        },
        "label": {
          "color": "#fff"
        }
      },
      "itemStyle": {
        "borderColor": "#000",
        "areaColor": "#fff",
        "borderWidth": 0.5
      },
      "zoom": 0.5,
      "label": {
        "color": "#000",
        "show": true,
        "fontSize": 12
      },
      "roam": true,
      "map": "china",
      "layoutCenter": ["50%", "50%"]
    },
    "series": [{
      "name": "地图",
      "coordinateSystem": "geo",
      "type": "map"
    }],
    "chartType": "map",
    "title": {
      "padding": [5, 20, 5, 10],
      "left": "left",
      "show": true,
      "text": "中国地图",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "map.scatter": {
    "geo": {
      "regions": [],
      "layoutSize": 600,
      "emphasis": {
        "itemStyle": {
          "areaColor": "red"
        },
        "label": {
          "color": "#fff"
        }
      },
      "itemStyle": {
        "borderColor": "#000",
        "areaColor": "#fff",
        "borderWidth": 0.5
      },
      "zoom": 0.5,
      "label": {
        "color": "#000",
        "show": true,
        "fontSize": 12
      },
      "roam": true,
      "map": "china",
      "layoutCenter": ["50%", "50%"]
    },
    "series": [{
      "encode": {
        "value": [2]
      },
      "data": [{
        "name": "河北",
        "value": 279
      }, {
        "name": "海南",
        "value": 273
      }, {
        "name": "山东",
        "value": 229
      }, {
        "name": "甘肃",
        "value": 194
      }, {
        "name": "宁夏",
        "value": 193
      }, {
        "name": "浙江",
        "value": 177
      }, {
        "name": "湖南",
        "value": 119
      }, {
        "name": "湖北",
        "value": 79
      }, {
        "name": "河南",
        "value": 67
      }, {
        "name": "北京",
        "value": 58
      }, {
        "name": "天津",
        "value": 59
      }, {
        "name": "上海",
        "value": 63
      }, {
        "name": "广州",
        "value": 74
      }],
      "name": "",
      "emphasis": {
        "label": {
          "show": true
        }
      },
      "itemStyle": {
        "color": "purple"
      },
      "coordinateSystem": "geo",
      "label": {
        "formatter": "{b}",
        "show": false,
        "position": "right"
      },
      "type": "scatter"
    }],
    "chartType": "map",
    "tooltip": {
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 10],
      "left": "left",
      "show": true,
      "text": "主要城市空气质量",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "gauge.simple": {
    "series": [{
      "pointer": {
        "show": true
      },
      "data": [{
        "name": "完成率",
        "value": 50
      }],
      "center": [330, 200],
      "itemStyle": {
        "color": "#63869E"
      },
      "type": "gauge",
      "title": {
        "show": true,
        "textStyle": {
          "color": "#000000",
          "shadowBlur": 10,
          "fontSize": 20,
          "shadowColor": "#000"
        }
      },
      "axisLabel": {
        "color": "auto",
        "show": true,
        "textStyle": {
          "fontSize": 10
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": [[0.2, "#91c7ae"], [0.8, "#63869E"], [1, "#C23531"]],
          "width": 25
        }
      },
      "name": "业务指标",
      "axisTick": {
        "lineStyle": {
          "color": "#fff"
        },
        "length": 10
      },
      "splitLine": {
        "lineStyle": {
          "color": "#ffffff",
          "width": 3
        },
        "length": 30
      },
      "detail": {
        "formatter": "{value}%",
        "textStyle": {
          "color": "auto",
          "fontSize": 25
        }
      },
      "radius": "75%"
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "gauge.simple180": {
    "series": [{
      "pointer": {
        "show": true
      },
      "startAngle": 190,
      "data": [{
        "name": "成绩",
        "value": 60
      }],
      "center": [330, 200],
      "endAngle": -10,
      "itemStyle": {
        "color": "#63869E"
      },
      "type": "gauge",
      "title": {
        "show": true,
        "textStyle": {
          "color": "#000",
          "shadowBlur": 10,
          "fontSize": 20,
          "shadowColor": "#000"
        }
      },
      "axisLabel": {
        "color": "auto",
        "show": true,
        "textStyle": {
          "fontSize": 10
        }
      },
      "axisLine": {
        "lineStyle": {
          "color": [[0.2, "#91c7ae"], [0.8, "#63869E"], [1, "#C23531"]],
          "width": 25
        }
      },
      "name": "业务指标",
      "axisTick": {
        "lineStyle": {
          "color": "#fff"
        },
        "length": 10
      },
      "splitLine": {
        "lineStyle": {
          "color": "#fff",
          "width": 3
        },
        "length": 30
      },
      "detail": {
        "formatter": "{value}%",
        "textStyle": {
          "color": "auto",
          "fontSize": 25
        }
      }
    }],
    "tooltip": {
      "formatter": "{b} : {c}",
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  },
  "graph.simple": {
    "legend": {
      "padding": [25, 20, 25, 10],
      "data": ["类目1", "类目2", "类目3", "类目4", "类目5", "类目6"],
      "top": "top",
      "orient": "horizontal",
      "left": "center",
      "show": true,
      "textStyle": {
        "color": "#333",
        "fontSize": 12
      }
    },
    "series": [{
      "layout": "circular",
      "lineStyle": {
        "curveness": 0.3,
        "color": "source"
      },
      "data": [{
        "name": "测试0",
        "category": 0,
        "value": 28
      }, {
        "name": "测试1",
        "category": 1,
        "value": 9
      }, {
        "name": "测试2",
        "category": 2,
        "value": 23
      }, {
        "name": "测试3",
        "category": 3,
        "value": 8
      }, {
        "name": "测试4",
        "category": 4,
        "value": 8
      }, {
        "name": "测试5",
        "category": 5,
        "value": 20
      }],
      "center": [320, 150],
      "name": "关系图",
      "links": [{
        "source": "测试1",
        "target": "测试0"
      }, {
        "source": "测试2",
        "target": "测试0"
      }, {
        "source": "测试3",
        "target": "测试1"
      }, {
        "source": "测试4",
        "target": "测试1"
      }, {
        "source": "测试5",
        "target": "测试2"
      }, {
        "source": "测试5",
        "target": "测试3"
      }, {
        "source": "测试3",
        "target": "测试2"
      }, {
        "source": "测试3",
        "target": "测试1"
      }, {
        "source": "测试2",
        "target": "测试1"
      }, {
        "source": "测试2",
        "target": "测试5"
      }, {
        "source": "测试4",
        "target": "测试5"
      }, {
        "source": "测试4",
        "target": "测试0"
      }, {
        "source": "测试4",
        "target": "测试1"
      }, {
        "source": "测试4",
        "target": "测试2"
      }, {
        "source": "测试5",
        "target": "测试0"
      }, {
        "source": "测试5",
        "target": "测试4"
      }, {
        "source": "测试4",
        "target": "测试3"
      }, {
        "source": "测试3",
        "target": "测试0"
      }, {
        "source": "测试3",
        "target": "测试1"
      }, {
        "source": "测试0",
        "target": "测试4"
      }],
      "categories": [{
        "name": "类目1",
        "itemStyle": {
          "color": ""
        }
      }, {
        "name": "类目2",
        "itemStyle": {
          "color": ""
        }
      }, {
        "name": "类目3",
        "itemStyle": {
          "color": ""
        }
      }, {
        "name": "类目4",
        "itemStyle": {
          "color": ""
        }
      }, {
        "name": "类目5",
        "itemStyle": {
          "color": ""
        }
      }, {
        "name": "类目6",
        "itemStyle": {
          "color": ""
        }
      }],
      "label": {
        "show": true,
        "position": "right",
        "textStyle": {
          "color": "#333",
          "fontSize": 12
        }
      },
      "type": "graph",
      "roam": true
    }],
    "tooltip": {
      "show": true,
      "textStyle": {
        "color": "#fff",
        "fontSize": 18
      }
    },
    "title": {
      "padding": [5, 20, 5, 20],
      "left": "left",
      "show": true,
      "text": "某站点用户访问来源",
      "textStyle": {
        "color": "#c23531",
        "fontSize": 18,
        "fontWeight": "bolder"
      }
    }
  }
});
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/modal/ChartTypeList.vue?vue&type=template&id=22a704f9&
var ChartTypeListvue_type_template_id_22a704f9_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Modal',{attrs:{"loading":_vm.loading,"title":"添加图表","width":1000},model:{value:(_vm.show),callback:function ($$v) {_vm.show=$$v},expression:"show"}},[_c('div',{attrs:{"slot":"footer"},slot:"footer"},[_c('Button',{attrs:{"type":"text","size":"large"},on:{"click":_vm.onCancel}},[_vm._v("取消")]),_c('Button',{attrs:{"type":"primary","size":"large","loading":_vm.showLoading},on:{"click":_vm.onOk}},[_vm._v("确定")])],1),_c('Tabs',{staticClass:"chart-modal-content",attrs:{"value":"bar"}},_vm._l((_vm.chartTypeList),function(categories,index){return _c('tab-pane',{key:index,attrs:{"label":categories.label,"name":categories.name}},[_c('Row',{attrs:{"justify":"center"}},_vm._l((categories.typeList),function(item,index){return _c('i-col',{key:index,class:item.allowed ? '' : 'no-allowed',staticStyle:{"margin-top":"20px"},attrs:{"span":"5","offset":"1"}},[_c('div',{class:_vm.activeId == item.id ? 'chart-selected' : '',staticStyle:{"border":"solid 1px #dcdee2","width":"180px","height":"130px"},on:{"click":function($event){return _vm.selected(item)}}},[_c('img',{staticStyle:{"width":"95%","height":"95%","margin":"0 5px"},attrs:{"src":'https://bootapi.jeecg.com/' + item.imgUrl}}),_c('span',{staticStyle:{"float":"left","width":"180px","margin-top":"8px","text-align":"center","font-size":"12px"}},[_vm._v(_vm._s(item.name))])])])}),1)],1)}),1)],1)}
var ChartTypeListvue_type_template_id_22a704f9_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/modal/ChartTypeList.vue?vue&type=template&id=22a704f9&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/modal/ChartTypeList.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ChartTypeListvue_type_script_lang_js_ = ({
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    showModal: {
      type: Boolean,
      default: false
    },
    selectedId: {
      type: String,
      default: null
    }
  },
  watch: {
    selectedId: {
      immediate: true,
      handler: function handler(val) {
        this.activeId = val;
      }
    },
    showModal: {
      immediate: true,
      handler: function handler(val) {
        this.show = val;
        val == true && (this.showLoading = false);
      }
    }
  },
  methods: {
    onOk: function onOk() {
      if (this.activeType != null) {
        this.showLoading = this.loading;
        this.$emit("on-ok", this.activeType);
      } else {
        this.$Message.info('请选择图标类型');
      }
    },
    onCancel: function onCancel() {
      this.show = false;
      this.$emit("on-cancel");
    },
    selected: function selected(item) {
      if (item.allowed) {
        this.activeId = item.id;
        this.activeType = item;
        this.$emit("selected", item);
      }
    }
  },
  data: function data() {
    return {
      chartTypeList: chartTypeList,
      show: false,
      activeId: null,
      activeType: null,
      showLoading: false
    };
  }
});
// CONCATENATED MODULE: ./src/components/modal/ChartTypeList.vue?vue&type=script&lang=js&
 /* harmony default export */ var modal_ChartTypeListvue_type_script_lang_js_ = (ChartTypeListvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/_vue-loader@15.9.6@vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("5d22");

// CONCATENATED MODULE: ./src/components/modal/ChartTypeList.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  modal_ChartTypeListvue_type_script_lang_js_,
  ChartTypeListvue_type_template_id_22a704f9_render,
  ChartTypeListvue_type_template_id_22a704f9_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ChartTypeList = (component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/media/BarCodeSetting.vue?vue&type=template&id=5825bb34&scoped=true&
var BarCodeSettingvue_type_template_id_5825bb34_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"height":"auto","overflow":"hidden","padding-bottom":"200px"}},[_c('i-form',{staticClass:"newtec-form-barcode",attrs:{"label-position":"top"}},[_c('form-item',{attrs:{"label":"条形码内容:"}},[_c('i-input',{attrs:{"type":"textarea","rows":2},on:{"on-blur":_vm.onBarcodeChange},model:{value:(_vm.barcodeContent),callback:function ($$v) {_vm.barcodeContent=$$v},expression:"barcodeContent"}})],1),_c('form-item',{attrs:{"label":"条间距:"}},[_c('i-input',{attrs:{"placeholder":"请输入条间距","min":1,"type":"number"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.width),callback:function ($$v) {_vm.width=$$v},expression:"width"}})],1),_c('form-item',{attrs:{"label":"高度:"}},[_c('i-input',{attrs:{"placeholder":"请输入高度","min":1,"type":"number"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.height),callback:function ($$v) {_vm.height=$$v},expression:"height"}})],1),_c('form-item',{attrs:{"label":"条颜色:"}},[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.lineColor),callback:function ($$v) {_vm.lineColor=$$v},expression:"lineColor"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.lineColor),callback:function ($$v) {_vm.lineColor=$$v},expression:"lineColor"}})],1)])],1),_c('form-item',{attrs:{"label":"背景色:"}},[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.background),callback:function ($$v) {_vm.background=$$v},expression:"background"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.background),callback:function ($$v) {_vm.background=$$v},expression:"background"}})],1)])],1),_c('form-item',{staticClass:"newtec-form-horizontal",attrs:{"label":"是否显示文字:"}},[_c('div',[_c('i-switch',{on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.displayValue),callback:function ($$v) {_vm.displayValue=$$v},expression:"displayValue"}})],1)]),(_vm.displayValue)?[_c('form-item',{attrs:{"label":"覆盖文字:"}},[_c('i-input',{attrs:{"placeholder":"请输入覆盖文字"},on:{"on-blur":_vm.onBarcodeChange},model:{value:(_vm.text),callback:function ($$v) {_vm.text=$$v},expression:"text"}})],1),_c('form-item',{attrs:{"label":"文字位置:"}},[_c('i-select',{attrs:{"placeholder":"请选择文字位置"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.textPosition),callback:function ($$v) {_vm.textPosition=$$v},expression:"textPosition"}},[_c('i-option',{attrs:{"value":"bottom"}},[_vm._v("底部")]),_c('i-option',{attrs:{"value":"top"}},[_vm._v("上方")])],1)],1),_c('form-item',{attrs:{"label":"文字水平对齐:"}},[_c('i-select',{attrs:{"placeholder":"请选择水平对齐方式"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.textAlign),callback:function ($$v) {_vm.textAlign=$$v},expression:"textAlign"}},[_c('i-option',{attrs:{"value":"center"}},[_vm._v("居中")]),_c('i-option',{attrs:{"value":"left"}},[_vm._v("左对齐")]),_c('i-option',{attrs:{"value":"right"}},[_vm._v("右对齐")])],1)],1),_c('form-item',{attrs:{"label":"文字大小:"}},[_c('i-input',{attrs:{"placeholder":"请输入文字大小","min":1,"type":"number"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.fontSize),callback:function ($$v) {_vm.fontSize=$$v},expression:"fontSize"}})],1),_c('form-item',{attrs:{"label":"文字样式:"}},[_c('i-select',{attrs:{"placeholder":"请选择文字样式"},on:{"on-change":_vm.onBarcodeChange},model:{value:(_vm.fontOptions),callback:function ($$v) {_vm.fontOptions=$$v},expression:"fontOptions"}},[_c('i-option',{attrs:{"value":"bold"}},[_vm._v("加粗")]),_c('i-option',{attrs:{"value":"italic"}},[_vm._v("斜体")]),_c('i-option',{attrs:{"value":"bold italic"}},[_vm._v("加粗&斜体")])],1)],1)]:_vm._e()],2)],1)}
var BarCodeSettingvue_type_template_id_5825bb34_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/media/BarCodeSetting.vue?vue&type=template&id=5825bb34&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/media/BarCodeSetting.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var BarCodeSettingvue_type_script_lang_js_ = ({
  name: 'bar-code-setting',
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {
        return {
          barcodeContent: "广州粤信科技有限公司",
          background: "#fff",
          lineColor: "#000",
          width: "",
          height: "",
          displayValue: false,
          text: "",
          textPosition: "bottom",
          textAlign: "center",
          fontSize: "",
          fontOptions: ""
        };
      }
    }
  },
  data: function data() {
    return {};
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.resetForm();
      }
    }
  },
  methods: {
    validateBarcode: function validateBarcode(value) {
      var reg = /^[a-zA-Z0-9]+$/;
      var reg2 = /^.{4,18}$/; // 长度为4到18个字符

      if (value !== "" && !reg.test(value)) {
        Vue.prototype.$Message.error("条码内容只允许字母、数字");
        return false;
      }

      return true;
    },
    resetForm: function resetForm() {
      var _this = this;

      if (this.settings) {
        Object.keys(this.settings).map(function (k) {
          _this[k] = _this.settings[k];
        });
      }
    },
    onBarcodeChange: function onBarcodeChange() {
      var _this2 = this;

      if (this.validateBarcode(this.barcodeContent)) {
        var obj = {};
        Object.keys(this.settings).map(function (k) {
          obj[k] = _this2[k];
        }); //清除颜色后恢复默认

        obj.background = this.background ? obj.background : "#ffffff";
        obj.lineColor = this.lineColor ? obj.lineColor : "#000000";
        this.$emit("change", obj);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/media/BarCodeSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var media_BarCodeSettingvue_type_script_lang_js_ = (BarCodeSettingvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/setting/media/BarCodeSetting.vue?vue&type=style&index=0&id=5825bb34&scoped=true&lang=css&
var BarCodeSettingvue_type_style_index_0_id_5825bb34_scoped_true_lang_css_ = __webpack_require__("ad97");

// CONCATENATED MODULE: ./src/components/setting/media/BarCodeSetting.vue






/* normalize component */

var BarCodeSetting_component = Object(componentNormalizer["a" /* default */])(
  media_BarCodeSettingvue_type_script_lang_js_,
  BarCodeSettingvue_type_template_id_5825bb34_scoped_true_render,
  BarCodeSettingvue_type_template_id_5825bb34_scoped_true_staticRenderFns,
  false,
  null,
  "5825bb34",
  null
  
)

/* harmony default export */ var BarCodeSetting = (BarCodeSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/media/QRCodeSetting.vue?vue&type=template&id=e6150b12&scoped=true&
var QRCodeSettingvue_type_template_id_e6150b12_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"height":"auto","overflow":"hidden","padding-bottom":"300px"}},[_c('i-form',{staticClass:"newtec-form-barcode",attrs:{"label-position":"top"}},[_c('form-item',{attrs:{"label":"二维码内容:"}},[_c('i-input',{attrs:{"type":"textarea","rows":2},on:{"on-blur":_vm.onCodeChange},model:{value:(_vm.text),callback:function ($$v) {_vm.text=$$v},expression:"text"}})],1),_c('form-item',{attrs:{"label":"宽度:"}},[_c('i-input',{attrs:{"placeholder":"请输入宽度","min":1,"type":"number"},on:{"on-blur":_vm.onCodeChange},model:{value:(_vm.width),callback:function ($$v) {_vm.width=$$v},expression:"width"}})],1),_c('form-item',{attrs:{"label":"高度:"}},[_c('i-input',{attrs:{"placeholder":"请输入高度","min":1,"type":"number"},on:{"on-blur":_vm.onCodeChange},model:{value:(_vm.height),callback:function ($$v) {_vm.height=$$v},expression:"height"}})],1),_c('form-item',{attrs:{"label":"前景色:"}},[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onCodeChange},model:{value:(_vm.colorDark),callback:function ($$v) {_vm.colorDark=$$v},expression:"colorDark"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorDark",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onCodeChange},model:{value:(_vm.colorLight),callback:function ($$v) {_vm.colorLight=$$v},expression:"colorLight"}})],1)])],1),_c('form-item',{attrs:{"label":"背景色:"}},[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onCodeChange},model:{value:(_vm.colorLight),callback:function ($$v) {_vm.colorLight=$$v},expression:"colorLight"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onCodeChange},model:{value:(_vm.colorLight),callback:function ($$v) {_vm.colorLight=$$v},expression:"colorLight"}})],1)])],1)],1)],1)}
var QRCodeSettingvue_type_template_id_e6150b12_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/media/QRCodeSetting.vue?vue&type=template&id=e6150b12&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/media/QRCodeSetting.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var QRCodeSettingvue_type_script_lang_js_ = ({
  name: "qr-code-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {
        return {
          text: "广州粤信科技有限公司",
          width: 128,
          height: 128,
          colorDark: "#000000",
          colorLight: "#ffffff"
        };
      }
    }
  },
  data: function data() {
    return {
      text: "",
      width: "",
      height: "",
      colorLight: "#fff",
      colorDark: "#000"
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.resetForm();
      }
    }
  },
  methods: {
    resetForm: function resetForm() {
      var _this = this;

      if (this.settings) {
        Object.keys(this.settings).map(function (k) {
          _this[k] = _this.settings[k];
        });
      }
    },
    onCodeChange: function onCodeChange() {
      var _this2 = this;

      var obj = {};
      Object.keys(this.settings).map(function (k) {
        obj[k] = _this2[k];
      }); //清除颜色后恢复默认

      obj.colorLight = this.colorLight ? obj.colorLight : "#ffffff";
      obj.colorDark = this.colorDark ? this.colorDark : "#000000";
      this.$emit("change", obj);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/media/QRCodeSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var media_QRCodeSettingvue_type_script_lang_js_ = (QRCodeSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/media/QRCodeSetting.vue





/* normalize component */

var QRCodeSetting_component = Object(componentNormalizer["a" /* default */])(
  media_QRCodeSettingvue_type_script_lang_js_,
  QRCodeSettingvue_type_template_id_e6150b12_scoped_true_render,
  QRCodeSettingvue_type_template_id_e6150b12_scoped_true_staticRenderFns,
  false,
  null,
  "e6150b12",
  null
  
)

/* harmony default export */ var QRCodeSetting = (QRCodeSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartTitleSetting.vue?vue&type=template&id=d5cc2236&scoped=true&
var ChartTitleSettingvue_type_template_id_d5cc2236_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"1"}},[_c('template',{slot:"title"},[_vm._v("标题设置")]),_c('div',{staticClass:"blockDiv"},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("显示 ")]),_c('i-switch',{staticStyle:{"margin-left":"105px"},attrs:{"size":"small"},on:{"on-change":_vm.onTitleChange},model:{value:(_vm.titleOption.show),callback:function ($$v) {_vm.$set(_vm.titleOption, "show", $$v)},expression:"titleOption.show"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("标题文字 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-blur":_vm.onTitleChange},model:{value:(_vm.titleOption.text),callback:function ($$v) {_vm.$set(_vm.titleOption, "text", $$v)},expression:"titleOption.text"}})],1),(typeof _vm.titleOption.textStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onTitleChange},model:{value:(_vm.titleOption.textStyle_color),callback:function ($$v) {_vm.$set(_vm.titleOption, "textStyle_color", $$v)},expression:"titleOption.textStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onTitleChange},model:{value:(_vm.titleOption.textStyle_color),callback:function ($$v) {_vm.$set(_vm.titleOption, "textStyle_color", $$v)},expression:"titleOption.textStyle_color"}})],1)])],1)],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体加粗 ")]),_c('i-select',{staticClass:"iSelect",attrs:{"size":"small"},on:{"on-change":_vm.onTitleChange},model:{value:(_vm.titleOption.textStyle_fontWeight),callback:function ($$v) {_vm.$set(_vm.titleOption, "textStyle_fontWeight", $$v)},expression:"titleOption.textStyle_fontWeight"}},[_c('i-option',{attrs:{"value":"normal"}},[_vm._v("normal")]),_c('i-option',{attrs:{"value":"bold"}},[_vm._v("bold")]),_c('i-option',{attrs:{"value":"bolder"}},[_vm._v("bolder")]),_c('i-option',{attrs:{"value":"lighter"}},[_vm._v("lighter")])],1)],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体大小 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small","type":"number"},on:{"on-change":_vm.onTitleChange},model:{value:(_vm.titleOption.textStyle_fontSize),callback:function ($$v) {_vm.$set(_vm.titleOption, "textStyle_fontSize", $$v)},expression:"titleOption.textStyle_fontSize"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("标题位置 ")]),_c('i-select',{staticClass:"iSelect",attrs:{"size":"small"},on:{"on-change":_vm.onTitleChange},model:{value:(_vm.titleOption.left),callback:function ($$v) {_vm.$set(_vm.titleOption, "left", $$v)},expression:"titleOption.left"}},[_c('i-option',{attrs:{"value":"left"}},[_vm._v("left")]),_c('i-option',{attrs:{"value":"center"}},[_vm._v("center")]),_c('i-option',{attrs:{"value":"right"}},[_vm._v("right")])],1)],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("顶边距 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"tip-format":_vm.formatTop},on:{"on-change":_vm.onTitleChange},model:{value:(_vm.titleOption.top),callback:function ($$v) {_vm.$set(_vm.titleOption, "top", $$v)},expression:"titleOption.top"}})],1)],1)],2)}
var ChartTitleSettingvue_type_template_id_d5cc2236_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartTitleSetting.vue?vue&type=template&id=d5cc2236&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartTitleSetting.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartTitleSettingvue_type_script_lang_js_ = ({
  name: "chart-title-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {
        return {
          padding: [5, 20, 5, 20],
          top: "5",
          left: "left",
          show: true,
          text: "某站点用户访问来源",
          textStyle: {
            color: "#c23531",
            fontSize: 18,
            fontWeight: "bolder"
          }
        };
      }
    }
  },
  data: function data() {
    var _titleOption;

    return {
      titleOption: (_titleOption = {
        show: true,
        top: 5,
        text: "",
        textStyle_color: "",
        textStyle_fontWeight: ""
      }, Object(defineProperty["a" /* default */])(_titleOption, "textStyle_fontWeight", ""), Object(defineProperty["a" /* default */])(_titleOption, "textStyle_fontSize", ""), Object(defineProperty["a" /* default */])(_titleOption, "left", ""), _titleOption)
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    formatTop: function formatTop(val) {
      return val + "px";
    },
    initData: function initData() {
      if (this.settings) {
        this.titleOption = Object.assign(this.titleOption, this.settings);
      }
    },
    onTitleChange: function onTitleChange() {
      this.$emit("change", "title", this.titleOption);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartTitleSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartTitleSettingvue_type_script_lang_js_ = (ChartTitleSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartTitleSetting.vue





/* normalize component */

var ChartTitleSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartTitleSettingvue_type_script_lang_js_,
  ChartTitleSettingvue_type_template_id_d5cc2236_scoped_true_render,
  ChartTitleSettingvue_type_template_id_d5cc2236_scoped_true_staticRenderFns,
  false,
  null,
  "d5cc2236",
  null
  
)

/* harmony default export */ var ChartTitleSetting = (ChartTitleSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartBarSetting.vue?vue&type=template&id=ba68edd6&scoped=true&
var ChartBarSettingvue_type_template_id_ba68edd6_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"2"}},[_c('template',{slot:"title"},[_vm._v(" 柱体设置 ")]),_c('div',{staticClass:"blockDiv"},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("宽度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onBarChange},model:{value:(_vm.barOptions.barWidth),callback:function ($$v) {_vm.$set(_vm.barOptions, "barWidth", $$v)},expression:"barOptions.barWidth"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("圆角 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onBarChange},model:{value:(_vm.barOptions.itemStyle_barBorderRadius),callback:function ($$v) {_vm.$set(_vm.barOptions, "itemStyle_barBorderRadius", $$v)},expression:"barOptions.itemStyle_barBorderRadius"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("最小高度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onBarChange},model:{value:(_vm.barOptions.barMinHeight),callback:function ($$v) {_vm.$set(_vm.barOptions, "barMinHeight", $$v)},expression:"barOptions.barMinHeight"}})],1),(
        _vm.isMultiChart === false &&
        typeof _vm.barOptions.itemStyle_color !== 'undefined'
      )?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("柱体颜色 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onBarChange},model:{value:(_vm.barOptions.itemStyle_color),callback:function ($$v) {_vm.$set(_vm.barOptions, "itemStyle_color", $$v)},expression:"barOptions.itemStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onBarChange},model:{value:(_vm.barOptions.itemStyle_color),callback:function ($$v) {_vm.$set(_vm.barOptions, "itemStyle_color", $$v)},expression:"barOptions.itemStyle_color"}})],1)])],1):_vm._e(),(
        _vm.isMultiChart === false &&
        typeof _vm.barOptions.backgroundStyle_color !== 'undefined'
      )?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("柱体背景 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onBarChange},model:{value:(_vm.barOptions.backgroundStyle_color),callback:function ($$v) {_vm.$set(_vm.barOptions, "backgroundStyle_color", $$v)},expression:"barOptions.backgroundStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onBarChange},model:{value:(_vm.barOptions.backgroundStyle_color),callback:function ($$v) {_vm.$set(_vm.barOptions, "backgroundStyle_color", $$v)},expression:"barOptions.backgroundStyle_color"}})],1)])],1):_vm._e()],1)],2)}
var ChartBarSettingvue_type_template_id_ba68edd6_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartBarSetting.vue?vue&type=template&id=ba68edd6&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartBarSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartBarSettingvue_type_script_lang_js_ = ({
  name: "chart-bar-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    },
    isMultiChart: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      barOptions: {
        barWidth: 50,
        itemStyle_barBorderRadius: 0,
        itemStyle_color: "#c43632",
        barMinHeight: 2,
        textStyle_color: "black",
        textStyle_fontWeight: "bolder"
      }
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.barOptions = Object.assign(this.barOptions, this.settings);
      }
    },
    onBarChange: function onBarChange() {
      this.$emit("change", this.barOptions);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartBarSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartBarSettingvue_type_script_lang_js_ = (ChartBarSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartBarSetting.vue





/* normalize component */

var ChartBarSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartBarSettingvue_type_script_lang_js_,
  ChartBarSettingvue_type_template_id_ba68edd6_scoped_true_render,
  ChartBarSettingvue_type_template_id_ba68edd6_scoped_true_staticRenderFns,
  false,
  null,
  "ba68edd6",
  null
  
)

/* harmony default export */ var ChartBarSetting = (ChartBarSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartLineSetting.vue?vue&type=template&id=123c2536&scoped=true&
var ChartLineSettingvue_type_template_id_123c2536_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"3"}},[_c('template',{slot:"title"},[_vm._v(" 折线设置 ")]),_c('div',{staticClass:"blockDiv"},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("平滑曲线 ")]),_c('i-switch',{staticStyle:{"margin-left":"77px"},attrs:{"size":"small"},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.smooth),callback:function ($$v) {_vm.$set(_vm.lineOptions, "smooth", $$v)},expression:"lineOptions.smooth"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("标记点 ")]),_c('i-switch',{staticStyle:{"margin-left":"90px"},attrs:{"size":"small"},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.showSymbol),callback:function ($$v) {_vm.$set(_vm.lineOptions, "showSymbol", $$v)},expression:"lineOptions.showSymbol"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("点大小 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.symbolSize),callback:function ($$v) {_vm.$set(_vm.lineOptions, "symbolSize", $$v)},expression:"lineOptions.symbolSize"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("阶梯线图 ")]),_c('i-switch',{staticStyle:{"margin-left":"77px"},attrs:{"size":"small"},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.step),callback:function ($$v) {_vm.$set(_vm.lineOptions, "step", $$v)},expression:"lineOptions.step"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("线条宽度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"max":5},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.lineStyle_width),callback:function ($$v) {_vm.$set(_vm.lineOptions, "lineStyle_width", $$v)},expression:"lineOptions.lineStyle_width"}})],1),(
        _vm.isMultiChart === false &&
        typeof _vm.lineOptions.itemStyle_color !== 'undefined'
      )?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("线条颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.itemStyle_color),callback:function ($$v) {_vm.$set(_vm.lineOptions, "itemStyle_color", $$v)},expression:"lineOptions.itemStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.itemStyle_color),callback:function ($$v) {_vm.$set(_vm.lineOptions, "itemStyle_color", $$v)},expression:"lineOptions.itemStyle_color"}})],1)])],1)],1):_vm._e(),(_vm.isMultiChart === false)?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("面积折线 ")]),_c('i-switch',{staticStyle:{"margin-left":"77px"},attrs:{"size":"small"},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.isArea),callback:function ($$v) {_vm.$set(_vm.lineOptions, "isArea", $$v)},expression:"lineOptions.isArea"}})],1):_vm._e(),(_vm.lineOptions.isArea)?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("面积颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.areaStyle_color),callback:function ($$v) {_vm.$set(_vm.lineOptions, "areaStyle_color", $$v)},expression:"lineOptions.areaStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.areaStyle_color),callback:function ($$v) {_vm.$set(_vm.lineOptions, "areaStyle_color", $$v)},expression:"lineOptions.areaStyle_color"}})],1)])],1)],1):_vm._e(),(_vm.lineOptions.isArea)?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("面积透明度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"110px","margin-left":"5px"},attrs:{"max":1,"step":0.1},on:{"on-change":_vm.onLineChange},model:{value:(_vm.lineOptions.areaStyle_opacity),callback:function ($$v) {_vm.$set(_vm.lineOptions, "areaStyle_opacity", $$v)},expression:"lineOptions.areaStyle_opacity"}})],1):_vm._e()],1)],2)}
var ChartLineSettingvue_type_template_id_123c2536_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartLineSetting.vue?vue&type=template&id=123c2536&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartLineSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartLineSettingvue_type_script_lang_js_ = ({
  name: "chart-line-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    },
    isMultiChart: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      lineOptions: {
        smooth: false,
        showSymbol: true,
        symbolSize: 5,
        step: false,
        lineStyle_width: 2,
        itemStyle_color: "#c43632",
        isArea: false,
        areaStyle_color: "rgba(220,38,38,0)",
        areaStyle_opacity: 1
      }
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.lineOptions = Object.assign(this.lineOptions, this.settings);
      }
    },
    onLineChange: function onLineChange() {
      this.$emit("change", this.lineOptions);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartLineSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartLineSettingvue_type_script_lang_js_ = (ChartLineSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartLineSetting.vue





/* normalize component */

var ChartLineSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartLineSettingvue_type_script_lang_js_,
  ChartLineSettingvue_type_template_id_123c2536_scoped_true_render,
  ChartLineSettingvue_type_template_id_123c2536_scoped_true_staticRenderFns,
  false,
  null,
  "123c2536",
  null
  
)

/* harmony default export */ var ChartLineSetting = (ChartLineSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartPieSetting.vue?vue&type=template&id=b231b11a&scoped=true&
var ChartPieSettingvue_type_template_id_b231b11a_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"4"}},[_c('template',{slot:"title"},[_vm._v(" 饼图设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("环形饼图 ")]),_c('i-switch',{staticStyle:{"margin-left":"77px"},attrs:{"size":"small"},on:{"on-change":_vm.pieTypeChange},model:{value:(_vm.pieOption.isRadius),callback:function ($$v) {_vm.$set(_vm.pieOption, "isRadius", $$v)},expression:"pieOption.isRadius"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("南丁格尔玫瑰 ")]),_c('i-switch',{staticStyle:{"margin-left":"50px"},attrs:{"size":"small"},on:{"on-change":function($event){return _vm.pieTypeChange('1')}},model:{value:(_vm.pieOption.isRose),callback:function ($$v) {_vm.$set(_vm.pieOption, "isRose", $$v)},expression:"pieOption.isRose"}})],1),(_vm.pieOption.isRadius)?[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("饼块半径 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-blur":_vm.onPieChange},model:{value:(_vm.pieOption.radius[1]),callback:function ($$v) {_vm.$set(_vm.pieOption.radius, 1, $$v)},expression:"pieOption.radius[1]"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("内环半径 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-blur":_vm.onPieChange},model:{value:(_vm.pieOption.radius[0]),callback:function ($$v) {_vm.$set(_vm.pieOption.radius, 0, $$v)},expression:"pieOption.radius[0]"}})],1)]:_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("饼块半径 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-blur":_vm.onPieChange},model:{value:(_vm.pieOption.radius),callback:function ($$v) {_vm.$set(_vm.pieOption, "radius", $$v)},expression:"pieOption.radius"}})],1),_c('Row',{staticClass:"ivurow"},[_c('span',[_vm._v("最小角度 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onPieChange},model:{value:(_vm.pieOption.minAngle),callback:function ($$v) {_vm.$set(_vm.pieOption, "minAngle", $$v)},expression:"pieOption.minAngle"}})],1)],2)],2)}
var ChartPieSettingvue_type_template_id_b231b11a_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartPieSetting.vue?vue&type=template&id=b231b11a&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartPieSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ChartPieSettingvue_type_script_lang_js_ = ({
  name: "chart-pie-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      pieOption: {
        isRadius: false,
        isRose: true,
        radius: "55%",
        roseType: "radius",
        minAngle: 0
      }
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    formatTop: function formatTop(val) {
      return val + "px";
    },
    initData: function initData() {
      if (this.settings) {
        this.pieOption = Object.assign(this.pieOption, this.settings);
      }
    },
    pieTypeChange: function pieTypeChange(type) {
      if (type === "1") {
        this.pieOption.roseType = this.pieOption.isRose ? "radius" : "";
      } else {
        this.pieOption.radius = this.pieOption.isRadius ? Object(design["k" /* typeJudge */])(this.pieOption.radius, "Array") ? this.pieOption.radius : ["45%", this.pieOption.radius] : Object(design["k" /* typeJudge */])(this.pieOption.radius, "Array") ? this.pieOption.radius[1] : this.pieOption.radius;
      }

      this.onPieChange();
    },
    onPieChange: function onPieChange() {
      this.$emit("change", this.pieOption);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartPieSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartPieSettingvue_type_script_lang_js_ = (ChartPieSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartPieSetting.vue





/* normalize component */

var ChartPieSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartPieSettingvue_type_script_lang_js_,
  ChartPieSettingvue_type_template_id_b231b11a_scoped_true_render,
  ChartPieSettingvue_type_template_id_b231b11a_scoped_true_staticRenderFns,
  false,
  null,
  "b231b11a",
  null
  
)

/* harmony default export */ var ChartPieSetting = (ChartPieSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartMarginSetting.vue?vue&type=template&id=948d55b2&scoped=true&
var ChartMarginSettingvue_type_template_id_948d55b2_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"5"}},[_c('template',{slot:"title"},[_vm._v(" 边距设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("左边距(%)")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"tip-format":_vm.percentFormat,"value":_vm.getNumberFromPercent(_vm.marginOptions.left)},on:{"on-change":function (value) { return _vm.onPercentChange(value, 'marginOptions.left', 'onPieChange'); }}})],1),(_vm.marginOptions.right)?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("右边距(%)")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"tip-format":_vm.percentFormat,"value":_vm.getNumberFromPercent(_vm.marginOptions.right)},on:{"on-change":function (value) { return _vm.onPercentChange(value, 'marginOptions.right', 'onPieChange'); }}})],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("顶边距 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onMarginChange},model:{value:(_vm.marginOptions.top),callback:function ($$v) {_vm.$set(_vm.marginOptions, "top", $$v)},expression:"marginOptions.top"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("底边距 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onMarginChange},model:{value:(_vm.marginOptions.bottom),callback:function ($$v) {_vm.$set(_vm.marginOptions, "bottom", $$v)},expression:"marginOptions.bottom"}})],1)],1)],2)}
var ChartMarginSettingvue_type_template_id_948d55b2_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartMarginSetting.vue?vue&type=template&id=948d55b2&scoped=true&

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.number.constructor.js
var es_number_constructor = __webpack_require__("24a8");

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartMarginSetting.vue?vue&type=script&lang=js&





//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartMarginSettingvue_type_script_lang_js_ = ({
  name: "chart-margin-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    },
    isMultiChart: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      marginOptions: {}
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    percentFormat: function percentFormat(val) {
      return val + "%";
    },
    //通过百分数转化 获取实际数字
    getNumberFromPercent: function getNumberFromPercent(p) {
      var suffix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      if (!p) {
        return 0;
      }

      return Number((p + "").replace("%", "").replace(suffix, ""));
    },
    initData: function initData() {
      if (this.settings) {
        this.marginOptions = Object.assign(this.marginOptions, this.settings);
      }
    },
    //slider 百分数改变事件
    onPercentChange: function onPercentChange(value, key, eventName) {
      var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
      var arr = key.split(".");

      if (arr.length > 1) {
        var temp = this;

        for (var i = 0; i < arr.length - 1; i++) {
          temp = temp[arr[i]];
        }

        temp[arr[arr.length - 1]] = value + "%" + suffix;
      } else {
        this[key] = value + "%" + suffix;
      } //this[eventName]();


      this.$emit("change", this.marginOptions);
    },
    onMarginChange: function onMarginChange() {
      this.$emit("change", this.marginOptions);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartMarginSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartMarginSettingvue_type_script_lang_js_ = (ChartMarginSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartMarginSetting.vue





/* normalize component */

var ChartMarginSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartMarginSettingvue_type_script_lang_js_,
  ChartMarginSettingvue_type_template_id_948d55b2_scoped_true_render,
  ChartMarginSettingvue_type_template_id_948d55b2_scoped_true_staticRenderFns,
  false,
  null,
  "948d55b2",
  null
  
)

/* harmony default export */ var ChartMarginSetting = (ChartMarginSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartFunnelSetting.vue?vue&type=template&id=7e53d18d&scoped=true&
var ChartFunnelSettingvue_type_template_id_7e53d18d_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"6"}},[_c('template',{slot:"title"},[_vm._v(" 漏斗设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("图形间距 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onFunnelChange},model:{value:(_vm.funnelOptions.gap),callback:function ($$v) {_vm.$set(_vm.funnelOptions, "gap", $$v)},expression:"funnelOptions.gap"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("数据排序 ")]),_c('i-select',{staticClass:"iSelect",staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onFunnelChange},model:{value:(_vm.funnelOptions.sort),callback:function ($$v) {_vm.$set(_vm.funnelOptions, "sort", $$v)},expression:"funnelOptions.sort"}},[_c('i-option',{attrs:{"value":"ascending"}},[_vm._v("升序")]),_c('i-option',{attrs:{"value":"descending"}},[_vm._v("降序")]),_c('i-option',{attrs:{"value":"none"}},[_vm._v("无序")])],1)],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("宽度(%) ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"tip-format":_vm.util.percentFormat,"value":_vm.util.getNumberFromPercent(_vm.funnelOptions.width)},on:{"on-change":function (value) { return _vm.onPercentChange(value, 'funnelOptions.width', 'onFunnelChange'); }}})],1)],1)],2)}
var ChartFunnelSettingvue_type_template_id_7e53d18d_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartFunnelSetting.vue?vue&type=template&id=7e53d18d&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartFunnelSetting.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ChartFunnelSettingvue_type_script_lang_js_ = ({
  name: "chart-funnel-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    },
    isMultiChart: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      funnelOptions: {
        gap: 2,
        sort: "descending",
        width: "80%"
      },
      util: util["a" /* default */]
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.funnelOptions = Object.assign(this.funnelOptions, this.settings);
      }
    },
    //slider 百分数改变事件
    onPercentChange: function onPercentChange(value, key, eventName) {
      var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
      var arr = key.split(".");

      if (arr.length > 1) {
        var temp = this;

        for (var i = 0; i < arr.length - 1; i++) {
          temp = temp[arr[i]];
        }

        temp[arr[arr.length - 1]] = value + "%" + suffix;
      } else {
        this[key] = value + "%" + suffix;
      } //this[eventName]();


      this.$emit("change", this.funnelOptions);
    },
    onFunnelChange: function onFunnelChange() {
      this.$emit("change", this.funnelOptions);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartFunnelSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartFunnelSettingvue_type_script_lang_js_ = (ChartFunnelSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartFunnelSetting.vue





/* normalize component */

var ChartFunnelSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartFunnelSettingvue_type_script_lang_js_,
  ChartFunnelSettingvue_type_template_id_7e53d18d_scoped_true_render,
  ChartFunnelSettingvue_type_template_id_7e53d18d_scoped_true_staticRenderFns,
  false,
  null,
  "7e53d18d",
  null
  
)

/* harmony default export */ var ChartFunnelSetting = (ChartFunnelSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartPictorialSetting.vue?vue&type=template&id=e0bd2e4e&scoped=true&
var ChartPictorialSettingvue_type_template_id_e0bd2e4e_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"8"}},[_c('template',{slot:"title"},[_vm._v(" 象形图设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('span',{staticStyle:{"display":"inline-block","line-height":"0px","height":"20px","width":"53px","vertical-align":"middle"},attrs:{"title":"建议上传至服务器本地,若上传至云服务器,可能导出/打印等功能不可用"}},[_vm._v("图标")]),_c('Upload',{ref:"upload",staticStyle:{"display":"inline-block","width":"58px"},attrs:{"show-upload-list":false,"default-file-list":_vm.pictorialIcon,"on-exceeded-size":function (e) { return _vm.handleMaxSize(e, 2); },"on-success":_vm.uploadSuccess,"format":['jpg', 'jpeg', 'png'],"max-size":2048,"data":_vm.localUpload,"action":_vm.actionUrlPre + '/jmreport/upload'}},[_c('div',{staticClass:"pictorial-icon-upload"},[_c('img',{ref:"symbol",staticStyle:{"width":"36px","height":"36px"},attrs:{"src":_vm.getPathBySymbol()}}),_c('div',{staticClass:"cover"},[_c('Icon',{attrs:{"type":"ios-create-outline"}})],1)])])],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("图标大小 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-blur":_vm.onPictorialChange},model:{value:(_vm.pictorialOptions.symbolSize),callback:function ($$v) {_vm.$set(_vm.pictorialOptions, "symbolSize", $$v)},expression:"pictorialOptions.symbolSize"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("图标间距 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"type":"number","size":"small","value":_vm.util.getNumberFromPercent(_vm.pictorialOptions.symbolMargin, '!')},on:{"on-blur":function (e) { return _vm.onPercentChange(
              e.target.value,
              'pictorialOptions.symbolMargin',
              'onPictorialChange',
              '!'
            ); }}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_vm._v("%")])])],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("最大值 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-blur":_vm.onPictorialChange},model:{value:(_vm.pictorialOptions.symbolBoundingData),callback:function ($$v) {_vm.$set(_vm.pictorialOptions, "symbolBoundingData", $$v)},expression:"pictorialOptions.symbolBoundingData"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("是否补全 ")]),_c('i-switch',{staticStyle:{"margin-left":"85px"},attrs:{"size":"small"},on:{"on-change":_vm.onPictorialChange},model:{value:(_vm.pictorialOptions.double),callback:function ($$v) {_vm.$set(_vm.pictorialOptions, "double", $$v)},expression:"pictorialOptions.double"}})],1),(_vm.pictorialOptions.double)?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("透明度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"110px","margin-left":"5px"},attrs:{"max":1,"step":0.1},on:{"on-change":_vm.onPictorialChange},model:{value:(_vm.pictorialOptions.secondOpacity),callback:function ($$v) {_vm.$set(_vm.pictorialOptions, "secondOpacity", $$v)},expression:"pictorialOptions.secondOpacity"}})],1):_vm._e()],1)],2)}
var ChartPictorialSettingvue_type_template_id_e0bd2e4e_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartPictorialSetting.vue?vue&type=template&id=e0bd2e4e&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartPictorialSetting.vue?vue&type=script&lang=js&





//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var ChartPictorialSettingvue_type_script_lang_js_ = ({
  name: "chart-pictorial-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    },
    isMultiChart: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      //象形图 图标配置
      pictorialIcon: [{
        name: "pictorialIcon",
        url: ""
      }],
      actionUrlPre: utils_config["a" /* baseFull */],
      pictorialOptions: {},
      localUpload: {
        bizType: "local"
      },
      util: util["a" /* default */]
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.pictorialOptions = Object.assign(this.pictorialOptions, this.settings);
      }
    },
    getPathBySymbol: function getPathBySymbol() {
      var symbol = this.pictorialOptions["symbol"];

      if (!symbol) {
        var path = utils_config["a" /* baseFull */] + "/jmreport/desreport_/chartsImg/pictorialIcon/spirits.png";
        return path;
      } else {
        return symbol.replace("image://", "");
      }
    },
    //图片上传文件大小
    handleMaxSize: function handleMaxSize(file, size) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件  " + file.name + " 太大，请上传" + size + "M以内图片",
        duration: 6
      });
    },
    //slider 百分数改变事件
    onPercentChange: function onPercentChange(value, key, eventName) {
      var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
      var arr = key.split(".");

      if (arr.length > 1) {
        var temp = this;

        for (var i = 0; i < arr.length - 1; i++) {
          temp = temp[arr[i]];
        }

        temp[arr[arr.length - 1]] = value + "%" + suffix;
      } else {
        this[key] = value + "%" + suffix;
      } //this[eventName]();


      this.onPictorialChange();
    },
    uploadSuccess: function uploadSuccess(res) {
      var _this = this;

      this.$emit("upload-success", res, function (symbol) {
        _this.pictorialOptions["symbol"] = symbol;

        _this.$forceUpdate(function () {
          _this.getPathBySymbol();
        });
      });
    },
    onPictorialChange: function onPictorialChange() {
      this.$emit("change", this.pictorialOptions);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartPictorialSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartPictorialSettingvue_type_script_lang_js_ = (ChartPictorialSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartPictorialSetting.vue





/* normalize component */

var ChartPictorialSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartPictorialSettingvue_type_script_lang_js_,
  ChartPictorialSettingvue_type_template_id_e0bd2e4e_scoped_true_render,
  ChartPictorialSettingvue_type_template_id_e0bd2e4e_scoped_true_staticRenderFns,
  false,
  null,
  "e0bd2e4e",
  null
  
)

/* harmony default export */ var ChartPictorialSetting = (ChartPictorialSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartScatterSetting.vue?vue&type=template&id=160d1a62&scoped=true&
var ChartScatterSettingvue_type_template_id_160d1a62_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"9"}},[_c('template',{slot:"title"},[_vm._v(" 散点设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("大小 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onScatterChange},model:{value:(_vm.scatterOption.symbolSize),callback:function ($$v) {_vm.$set(_vm.scatterOption, "symbolSize", $$v)},expression:"scatterOption.symbolSize"}})],1),(typeof _vm.scatterOption.itemStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onScatterChange},model:{value:(_vm.scatterOption.itemStyle_color),callback:function ($$v) {_vm.$set(_vm.scatterOption, "itemStyle_color", $$v)},expression:"scatterOption.itemStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onScatterChange},model:{value:(_vm.scatterOption.itemStyle_color),callback:function ($$v) {_vm.$set(_vm.scatterOption, "itemStyle_color", $$v)},expression:"scatterOption.itemStyle_color"}})],1)])],1)],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("透明度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"110px","margin-left":"5px"},attrs:{"max":1,"step":0.1},on:{"on-change":_vm.onScatterChange},model:{value:(_vm.scatterOption.itemStyle_opacity),callback:function ($$v) {_vm.$set(_vm.scatterOption, "itemStyle_opacity", $$v)},expression:"scatterOption.itemStyle_opacity"}})],1)],1)],2)}
var ChartScatterSettingvue_type_template_id_160d1a62_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartScatterSetting.vue?vue&type=template&id=160d1a62&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartScatterSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartScatterSettingvue_type_script_lang_js_ = ({
  name: "chart-scatter-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      scatterOption: {
        itemStyle_color: "#C23531"
      }
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.scatterOption = Object.assign(this.scatterOption, this.settings);
      }
    },
    onScatterChange: function onScatterChange() {
      this.$emit("change", this.scatterOption);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartScatterSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartScatterSettingvue_type_script_lang_js_ = (ChartScatterSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartScatterSetting.vue





/* normalize component */

var ChartScatterSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartScatterSettingvue_type_script_lang_js_,
  ChartScatterSettingvue_type_template_id_160d1a62_scoped_true_render,
  ChartScatterSettingvue_type_template_id_160d1a62_scoped_true_staticRenderFns,
  false,
  null,
  "160d1a62",
  null
  
)

/* harmony default export */ var ChartScatterSetting = (ChartScatterSetting_component.exports);
// EXTERNAL MODULE: ./src/components/setting/chart/ChartMapSetting.vue
var ChartMapSetting = __webpack_require__("9334");

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartRadarSetting.vue?vue&type=template&id=0e86f538&scoped=true&
var ChartRadarSettingvue_type_template_id_0e86f538_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"10"}},[_c('template',{slot:"title"},[_vm._v(" 雷达图设置 ")]),_c('div',{staticClass:"blockDiv"},[_vm._l((_vm.radarOption[0].indicator),function(item,index){return _c('Row',{key:index,staticClass:"ivurow"},[_c('Tooltip',{attrs:{"content":item.name,"placement":"bottom"}},[_c('p',[_vm._v(_vm._s(item.name.substr(0, 2))+"..最大值 ")])]),_c('i-input',{staticStyle:{"width":"81px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onRadarChange},model:{value:(item.max),callback:function ($$v) {_vm.$set(item, "max", $$v)},expression:"item.max"}})],1)}),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体大小 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onRadarChange},model:{value:(_vm.radarOption[0].name_textStyle_fontSize),callback:function ($$v) {_vm.$set(_vm.radarOption[0], "name_textStyle_fontSize", $$v)},expression:"radarOption[0].name_textStyle_fontSize"}})],1),(typeof _vm.radarOption[0].name_textStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体颜色 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onRadarChange},model:{value:(_vm.radarOption[0].name_textStyle_color),callback:function ($$v) {_vm.$set(_vm.radarOption[0], "name_textStyle_color", $$v)},expression:"radarOption[0].name_textStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onRadarChange},model:{value:(_vm.radarOption[0].name_textStyle_color),callback:function ($$v) {_vm.$set(_vm.radarOption[0], "name_textStyle_color", $$v)},expression:"radarOption[0].name_textStyle_color"}})],1)])],1):_vm._e(),(typeof _vm.radarOption[0].axisLine_lineStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("轴线颜色 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onRadarChange},model:{value:(_vm.radarOption[0].axisLine_lineStyle_color),callback:function ($$v) {_vm.$set(_vm.radarOption[0], "axisLine_lineStyle_color", $$v)},expression:"radarOption[0].axisLine_lineStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onRadarChange},model:{value:(_vm.radarOption[0].axisLine_lineStyle_color),callback:function ($$v) {_vm.$set(_vm.radarOption[0], "axisLine_lineStyle_color", $$v)},expression:"radarOption[0].axisLine_lineStyle_color"}})],1)])],1):_vm._e()],2)],2)}
var ChartRadarSettingvue_type_template_id_0e86f538_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartRadarSetting.vue?vue&type=template&id=0e86f538&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartRadarSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartRadarSettingvue_type_script_lang_js_ = ({
  name: "chart-radar-setting",
  props: {
    settings: {
      type: Array,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      radarOption: []
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.radarOption = Object.assign(this.radarOption, this.settings);
      }
    },
    onRadarChange: function onRadarChange() {
      this.$emit("change", "radar", this.radarOption);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartRadarSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartRadarSettingvue_type_script_lang_js_ = (ChartRadarSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartRadarSetting.vue





/* normalize component */

var ChartRadarSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartRadarSettingvue_type_script_lang_js_,
  ChartRadarSettingvue_type_template_id_0e86f538_scoped_true_render,
  ChartRadarSettingvue_type_template_id_0e86f538_scoped_true_staticRenderFns,
  false,
  null,
  "0e86f538",
  null
  
)

/* harmony default export */ var ChartRadarSetting = (ChartRadarSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartGaugeSetting.vue?vue&type=template&id=6ce9764a&scoped=true&
var ChartGaugeSettingvue_type_template_id_6ce9764a_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"20"}},[_c('template',{slot:"title"},[_vm._v(" 仪表盘数据设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("标题显示 ")]),_c('i-switch',{staticStyle:{"margin-left":"80px"},attrs:{"size":"small"},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.title_show),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "title_show", $$v)},expression:"gaugeOption.title_show"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("标题字体大小 ")]),_c('i-input',{staticStyle:{"width":"100px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.title_textStyle_fontSize),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "title_textStyle_fontSize", $$v)},expression:"gaugeOption.title_textStyle_fontSize"}})],1),(typeof _vm.gaugeOption.title_textStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("标题颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.title_textStyle_color),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "title_textStyle_color", $$v)},expression:"gaugeOption.title_textStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.title_textStyle_color),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "title_textStyle_color", $$v)},expression:"gaugeOption.title_textStyle_color"}})],1)])],1)],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("指针显示 ")]),_c('i-switch',{staticStyle:{"margin-left":"80px"},attrs:{"size":"small"},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.pointer_show),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "pointer_show", $$v)},expression:"gaugeOption.pointer_show"}})],1),(typeof _vm.gaugeOption.itemStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("指针颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.itemStyle_color),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "itemStyle_color", $$v)},expression:"gaugeOption.itemStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.itemStyle_color),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "itemStyle_color", $$v)},expression:"gaugeOption.itemStyle_color"}})],1)])],1)],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("指针字体大小 ")]),_c('i-input',{staticStyle:{"width":"100px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.detail_textStyle_fontSize),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "detail_textStyle_fontSize", $$v)},expression:"gaugeOption.detail_textStyle_fontSize"}})],1),(typeof _vm.gaugeOption.detail_textStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("指针字体颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.detail_textStyle_color),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "detail_textStyle_color", $$v)},expression:"gaugeOption.detail_textStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.detail_textStyle_color),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "detail_textStyle_color", $$v)},expression:"gaugeOption.detail_textStyle_color"}})],1)])],1)],1):_vm._e()],1)],2),_c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"21"}},[_c('template',{slot:"title"},[_vm._v(" 仪表盘刻度设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("刻度值显示 ")]),_c('i-switch',{staticStyle:{"margin-left":"80px"},attrs:{"size":"small"},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.axisLabel_show),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "axisLabel_show", $$v)},expression:"gaugeOption.axisLabel_show"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("刻度值字体大小 ")]),_c('i-input',{staticStyle:{"width":"100px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.axisLabel_textStyle_fontSize),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "axisLabel_textStyle_fontSize", $$v)},expression:"gaugeOption.axisLabel_textStyle_fontSize"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("仪表盘半径(%) ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"tip-format":_vm.util.percentFormat,"value":_vm.util.getNumberFromPercent(_vm.gaugeOption.radius)},on:{"on-change":function (value) { return _vm.onPercentChange(value, 'gaugeOption.radius', 'onGaugeChange'); }}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("轴线宽度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"max":50,"step":5},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.axisLine_lineStyle_width),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "axisLine_lineStyle_width", $$v)},expression:"gaugeOption.axisLine_lineStyle_width"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("分割线长度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"max":50,"step":2},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.splitLine_length),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "splitLine_length", $$v)},expression:"gaugeOption.splitLine_length"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("刻度线长度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},attrs:{"max":50,"step":2},on:{"on-change":_vm.onGaugeChange},model:{value:(_vm.gaugeOption.axisTick_length),callback:function ($$v) {_vm.$set(_vm.gaugeOption, "axisTick_length", $$v)},expression:"gaugeOption.axisTick_length"}})],1)],1)],2)],1)}
var ChartGaugeSettingvue_type_template_id_6ce9764a_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartGaugeSetting.vue?vue&type=template&id=6ce9764a&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartGaugeSetting.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ChartGaugeSettingvue_type_script_lang_js_ = ({
  name: "chart-gauge-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      gaugeOption: {
        title_textStyle_color: "",
        detail_textStyle_color: "",
        itemStyle_color: ""
      },
      util: util["a" /* default */]
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.gaugeOption = Object.assign(this.gaugeOption, this.settings);
      }
    },
    //slider 百分数改变事件
    onPercentChange: function onPercentChange(value, key, eventName) {
      var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
      var arr = key.split(".");

      if (arr.length > 1) {
        var temp = this;

        for (var i = 0; i < arr.length - 1; i++) {
          temp = temp[arr[i]];
        }

        temp[arr[arr.length - 1]] = value + "%" + suffix;
      } else {
        this[key] = value + "%" + suffix;
      } //this[eventName]();


      this.$emit("change", this.gaugeOption);
    },
    onGaugeChange: function onGaugeChange() {
      this.$emit("change", this.gaugeOption);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartGaugeSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartGaugeSettingvue_type_script_lang_js_ = (ChartGaugeSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartGaugeSetting.vue





/* normalize component */

var ChartGaugeSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartGaugeSettingvue_type_script_lang_js_,
  ChartGaugeSettingvue_type_template_id_6ce9764a_scoped_true_render,
  ChartGaugeSettingvue_type_template_id_6ce9764a_scoped_true_staticRenderFns,
  false,
  null,
  "6ce9764a",
  null
  
)

/* harmony default export */ var ChartGaugeSetting = (ChartGaugeSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartXAxisSetting.vue?vue&type=template&id=bcd086c4&scoped=true&
var ChartXAxisSettingvue_type_template_id_bcd086c4_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"11"}},[_c('template',{slot:"title"},[_vm._v(" X轴设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("显示 ")]),_c('i-switch',{staticStyle:{"margin-left":"105px"},attrs:{"size":"small"},on:{"on-change":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.show),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "show", $$v)},expression:"xAxisOption.show"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("X轴名称 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-blur":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.name),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "name", $$v)},expression:"xAxisOption.name"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("分隔线 ")]),_c('i-switch',{staticStyle:{"margin-left":"90px"},attrs:{"size":"small"},on:{"on-change":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.splitLine_show),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "splitLine_show", $$v)},expression:"xAxisOption.splitLine_show"}})],1),(typeof _vm.xAxisOption.splitLine_show !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("颜色设置 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.splitLine_lineStyle_color),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "splitLine_lineStyle_color", $$v)},expression:"xAxisOption.splitLine_lineStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.splitLine_lineStyle_color),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "splitLine_lineStyle_color", $$v)},expression:"xAxisOption.splitLine_lineStyle_color"}})],1)])],1)],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("文字角度 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.axisLabel_rotate),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "axisLabel_rotate", $$v)},expression:"xAxisOption.axisLabel_rotate"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体大小 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.axisLabel_textStyle_fontSize),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "axisLabel_textStyle_fontSize", $$v)},expression:"xAxisOption.axisLabel_textStyle_fontSize"}})],1),(typeof _vm.xAxisOption.axisLabel_textStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.axisLabel_textStyle_color),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "axisLabel_textStyle_color", $$v)},expression:"xAxisOption.axisLabel_textStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.axisLabel_textStyle_color),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "axisLabel_textStyle_color", $$v)},expression:"xAxisOption.axisLabel_textStyle_color"}})],1)])],1)],1):_vm._e(),(typeof _vm.xAxisOption.axisLine_lineStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("轴线颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.axisLine_lineStyle_color),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "axisLine_lineStyle_color", $$v)},expression:"xAxisOption.axisLine_lineStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onXAxisChange},model:{value:(_vm.xAxisOption.axisLine_lineStyle_color),callback:function ($$v) {_vm.$set(_vm.xAxisOption, "axisLine_lineStyle_color", $$v)},expression:"xAxisOption.axisLine_lineStyle_color"}})],1)])],1)],1):_vm._e()],1)],2)}
var ChartXAxisSettingvue_type_template_id_bcd086c4_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartXAxisSetting.vue?vue&type=template&id=bcd086c4&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartXAxisSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartXAxisSettingvue_type_script_lang_js_ = ({
  template: "chart-xAxis-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      xAxisOption: {
        splitLine_lineStyle_color: "",
        axisLabel_textStyle_color: "",
        axisLine_lineStyle_color: ""
      }
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.xAxisOption = Object.assign(this.xAxisOption, this.settings);
      }
    },
    onXAxisChange: function onXAxisChange() {
      this.$emit("change", "xAxis", this.xAxisOption);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartXAxisSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartXAxisSettingvue_type_script_lang_js_ = (ChartXAxisSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartXAxisSetting.vue





/* normalize component */

var ChartXAxisSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartXAxisSettingvue_type_script_lang_js_,
  ChartXAxisSettingvue_type_template_id_bcd086c4_scoped_true_render,
  ChartXAxisSettingvue_type_template_id_bcd086c4_scoped_true_staticRenderFns,
  false,
  null,
  "bcd086c4",
  null
  
)

/* harmony default export */ var ChartXAxisSetting = (ChartXAxisSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartYAxisSetting.vue?vue&type=template&id=a37cf18c&scoped=true&
var ChartYAxisSettingvue_type_template_id_a37cf18c_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',_vm._l((_vm.yAxisOptions),function(item,index){return _c('Submenu',{key:index,staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":'yAxis' + index}},[_c('template',{slot:"title"},[_vm._v(" "+_vm._s(_vm.getTitle(index))+"Y轴设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("显示 ")]),_c('i-switch',{staticStyle:{"margin-left":"105px"},attrs:{"size":"small"},on:{"on-change":_vm.onYAxisChange},model:{value:(item.show),callback:function ($$v) {_vm.$set(item, "show", $$v)},expression:"item.show"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("Y轴名称 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-blur":_vm.onYAxisChange},model:{value:(item.name),callback:function ($$v) {_vm.$set(item, "name", $$v)},expression:"item.name"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("分隔线 ")]),_c('i-switch',{staticStyle:{"margin-left":"90px"},attrs:{"size":"small"},on:{"on-change":_vm.onYAxisChange},model:{value:(item.splitLine_show),callback:function ($$v) {_vm.$set(item, "splitLine_show", $$v)},expression:"item.splitLine_show"}})],1),(typeof item.splitLine_show !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("颜色设置 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onYAxisChange},model:{value:(item.splitLine_lineStyle_color),callback:function ($$v) {_vm.$set(item, "splitLine_lineStyle_color", $$v)},expression:"item.splitLine_lineStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onYAxisChange},model:{value:(item.splitLine_lineStyle_color),callback:function ($$v) {_vm.$set(item, "splitLine_lineStyle_color", $$v)},expression:"item.splitLine_lineStyle_color"}})],1)])],1)],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("字体大小 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onYAxisChange},model:{value:(item.axisLabel_textStyle_fontSize),callback:function ($$v) {_vm.$set(item, "axisLabel_textStyle_fontSize", $$v)},expression:"item.axisLabel_textStyle_fontSize"}})],1),(typeof item.axisLabel_textStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onYAxisChange},model:{value:(item.axisLabel_textStyle_color),callback:function ($$v) {_vm.$set(item, "axisLabel_textStyle_color", $$v)},expression:"item.axisLabel_textStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onYAxisChange},model:{value:(item.axisLabel_textStyle_color),callback:function ($$v) {_vm.$set(item, "axisLabel_textStyle_color", $$v)},expression:"item.axisLabel_textStyle_color"}})],1)])],1)],1):_vm._e(),(typeof item.axisLine_lineStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("轴线颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onYAxisChange},model:{value:(item.axisLine_lineStyle_color),callback:function ($$v) {_vm.$set(item, "axisLine_lineStyle_color", $$v)},expression:"item.axisLine_lineStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onYAxisChange},model:{value:(item.axisLine_lineStyle_color),callback:function ($$v) {_vm.$set(item, "axisLine_lineStyle_color", $$v)},expression:"item.axisLine_lineStyle_color"}})],1)])],1)],1):_vm._e()],1)],2)}),1)}
var ChartYAxisSettingvue_type_template_id_a37cf18c_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartYAxisSetting.vue?vue&type=template&id=a37cf18c&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartYAxisSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartYAxisSettingvue_type_script_lang_js_ = ({
  name: "chart-yAxis-setting",
  props: {
    settings: {
      type: [Object, Array],
      required: true,
      default: null
    },
    dataIndex: 0
  },
  data: function data() {
    return {
      yAxisOption: {},
      yAxisOptions: []
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    getTitle: function getTitle(index) {
      if (this.settings instanceof Array) {
        if (index == 0) {
          return "左";
        }

        if (index == 1) {
          return "右";
        }
      } else {
        return "";
      }
    },
    initData: function initData() {
      if (this.settings) {
        if (this.settings instanceof Array) {
          this.yAxisOptions = this.settings;
          this.yAxisOption = Object.assign(this.yAxisOption, this.settings[this.dataIndex]);
        } else {
          this.yAxisOptions = [];
          this.yAxisOptions.push(this.settings);
          this.yAxisOption = Object.assign(this.yAxisOption, this.settings);
        }
      }
    },
    onYAxisChange: function onYAxisChange() {
      if (this.settings instanceof Array) {
        this.$emit("change", "yAxis", this.yAxisOptions);
      } else {
        this.$emit("change", "yAxis", this.yAxisOptions[0]);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartYAxisSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartYAxisSettingvue_type_script_lang_js_ = (ChartYAxisSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartYAxisSetting.vue





/* normalize component */

var ChartYAxisSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartYAxisSettingvue_type_script_lang_js_,
  ChartYAxisSettingvue_type_template_id_a37cf18c_scoped_true_render,
  ChartYAxisSettingvue_type_template_id_a37cf18c_scoped_true_staticRenderFns,
  false,
  null,
  "a37cf18c",
  null
  
)

/* harmony default export */ var ChartYAxisSetting = (ChartYAxisSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartSeriesSetting.vue?vue&type=template&id=113fabe3&scoped=true&
var ChartSeriesSettingvue_type_template_id_113fabe3_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"15"}},[_c('template',{slot:"title"},[_vm._v(" 数值设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("显示 ")]),_c('i-switch',{staticStyle:{"margin-left":"105px"},attrs:{"size":"small"},on:{"on-change":_vm.onSeriesLabelChange},model:{value:(_vm.seriesOption.show),callback:function ($$v) {_vm.$set(_vm.seriesOption, "show", $$v)},expression:"seriesOption.show"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体大小 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onSeriesLabelChange},model:{value:(_vm.seriesOption.textStyle_fontSize),callback:function ($$v) {_vm.$set(_vm.seriesOption, "textStyle_fontSize", $$v)},expression:"seriesOption.textStyle_fontSize"}})],1),(typeof _vm.seriesOption.textStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onSeriesLabelChange},model:{value:(_vm.seriesOption.textStyle_color),callback:function ($$v) {_vm.$set(_vm.seriesOption, "textStyle_color", $$v)},expression:"seriesOption.textStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onSeriesLabelChange},model:{value:(_vm.seriesOption.textStyle_color),callback:function ($$v) {_vm.$set(_vm.seriesOption, "textStyle_color", $$v)},expression:"seriesOption.textStyle_color"}})],1)])],1)],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体粗细 ")]),_c('i-select',{staticClass:"iSelect",attrs:{"size":"small"},on:{"on-change":_vm.onSeriesLabelChange},model:{value:(_vm.seriesOption.textStyle_fontWeight),callback:function ($$v) {_vm.$set(_vm.seriesOption, "textStyle_fontWeight", $$v)},expression:"seriesOption.textStyle_fontWeight"}},[_c('i-option',{attrs:{"value":"normal"}},[_vm._v("normal")]),_c('i-option',{attrs:{"value":"bold"}},[_vm._v("bold")]),_c('i-option',{attrs:{"value":"bolder"}},[_vm._v("bolder")]),_c('i-option',{attrs:{"value":"lighter"}},[_vm._v("lighter")])],1)],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("字体位置 ")]),_c('i-select',{staticClass:"iSelect",attrs:{"size":"small"},on:{"on-change":_vm.onSeriesLabelChange},model:{value:(_vm.seriesOption.position),callback:function ($$v) {_vm.$set(_vm.seriesOption, "position", $$v)},expression:"seriesOption.position"}},_vm._l((_vm.seriesOption.labelPositionArray),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.value,"index":index}},[_vm._v(" "+_vm._s(item.text)+" ")])}),1)],1)],1)],2)}
var ChartSeriesSettingvue_type_template_id_113fabe3_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartSeriesSetting.vue?vue&type=template&id=113fabe3&scoped=true&

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.symbol.js
var es_symbol = __webpack_require__("01e5");

// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
// CONCATENATED MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/objectWithoutProperties.js


function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartSeriesSetting.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartSeriesSettingvue_type_script_lang_js_ = ({
  name: "chart-series-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      seriesOption: {
        textStyle_color: ""
      },
      labelPositions: []
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.seriesOption = Object.assign(this.seriesOption, this.settings);
      }
    },
    onSeriesLabelChange: function onSeriesLabelChange() {
      var _this$seriesOption = this.seriesOption,
          labelPositionArray = _this$seriesOption.labelPositionArray,
          otherOptions = _objectWithoutProperties(_this$seriesOption, ["labelPositionArray"]);

      this.$emit("change", otherOptions, "label");
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartSeriesSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartSeriesSettingvue_type_script_lang_js_ = (ChartSeriesSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartSeriesSetting.vue





/* normalize component */

var ChartSeriesSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartSeriesSettingvue_type_script_lang_js_,
  ChartSeriesSettingvue_type_template_id_113fabe3_scoped_true_render,
  ChartSeriesSettingvue_type_template_id_113fabe3_scoped_true_staticRenderFns,
  false,
  null,
  "113fabe3",
  null
  
)

/* harmony default export */ var ChartSeriesSetting = (ChartSeriesSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartTooltipSetting.vue?vue&type=template&id=18e2e062&scoped=true&
var ChartTooltipSettingvue_type_template_id_18e2e062_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"16"}},[_c('template',{slot:"title"},[_vm._v(" 提示语设置 ")]),_c('div',{staticClass:"blockDiv"},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("显示 ")]),_c('i-switch',{staticStyle:{"margin-left":"105px"},attrs:{"size":"small"},on:{"on-change":_vm.onTooltipChange},model:{value:(_vm.tooltipOption.show),callback:function ($$v) {_vm.$set(_vm.tooltipOption, "show", $$v)},expression:"tooltipOption.show"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体大小 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onTooltipChange},model:{value:(_vm.tooltipOption.textStyle_fontSize),callback:function ($$v) {_vm.$set(_vm.tooltipOption, "textStyle_fontSize", $$v)},expression:"tooltipOption.textStyle_fontSize"}})],1),(typeof _vm.tooltipOption.textStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("字体颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onTooltipChange},model:{value:(_vm.tooltipOption.textStyle_color),callback:function ($$v) {_vm.$set(_vm.tooltipOption, "textStyle_color", $$v)},expression:"tooltipOption.textStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},on:{"on-change":_vm.onTooltipChange},model:{value:(_vm.tooltipOption.textStyle_color),callback:function ($$v) {_vm.$set(_vm.tooltipOption, "textStyle_color", $$v)},expression:"tooltipOption.textStyle_color"}})],1)])],1)],1):_vm._e()],1)],2)}
var ChartTooltipSettingvue_type_template_id_18e2e062_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartTooltipSetting.vue?vue&type=template&id=18e2e062&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartTooltipSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartTooltipSettingvue_type_script_lang_js_ = ({
  name: "chart-tooltip-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      tooltipOption: {
        textStyle_color: ""
      }
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.tooltipOption = Object.assign(this.tooltipOption, this.settings);
      }
    },
    onTooltipChange: function onTooltipChange() {
      this.$emit("change", "tooltip", this.tooltipOption);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartTooltipSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartTooltipSettingvue_type_script_lang_js_ = (ChartTooltipSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartTooltipSetting.vue





/* normalize component */

var ChartTooltipSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartTooltipSettingvue_type_script_lang_js_,
  ChartTooltipSettingvue_type_template_id_18e2e062_scoped_true_render,
  ChartTooltipSettingvue_type_template_id_18e2e062_scoped_true_staticRenderFns,
  false,
  null,
  "18e2e062",
  null
  
)

/* harmony default export */ var ChartTooltipSetting = (ChartTooltipSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartGridSetting.vue?vue&type=template&id=7e6818b6&scoped=true&
var ChartGridSettingvue_type_template_id_7e6818b6_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"18"}},[_c('template',{slot:"title"},[_vm._v(" 坐标轴边距 ")]),_c('div',{staticClass:"blockDiv"},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("左边距 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onGridChange},model:{value:(_vm.gridOptions.left),callback:function ($$v) {_vm.$set(_vm.gridOptions, "left", $$v)},expression:"gridOptions.left"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("顶边距 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onGridChange},model:{value:(_vm.gridOptions.top),callback:function ($$v) {_vm.$set(_vm.gridOptions, "top", $$v)},expression:"gridOptions.top"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("右边距 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onGridChange},model:{value:(_vm.gridOptions.right),callback:function ($$v) {_vm.$set(_vm.gridOptions, "right", $$v)},expression:"gridOptions.right"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("底边距 ")]),_c('slider',{staticStyle:{"margin-top":"-9px","width":"120px","margin-left":"5px"},on:{"on-change":_vm.onGridChange},model:{value:(_vm.gridOptions.bottom),callback:function ($$v) {_vm.$set(_vm.gridOptions, "bottom", $$v)},expression:"gridOptions.bottom"}})],1)],1)],2)}
var ChartGridSettingvue_type_template_id_7e6818b6_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartGridSetting.vue?vue&type=template&id=7e6818b6&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartGridSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartGridSettingvue_type_script_lang_js_ = ({
  name: "chart-grid-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      gridOptions: {}
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.gridOptions = Object.assign(this.gridOptions, this.settings);
      }
    },
    onGridChange: function onGridChange() {
      this.$emit("change", "grid", this.gridOptions);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartGridSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartGridSettingvue_type_script_lang_js_ = (ChartGridSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartGridSetting.vue





/* normalize component */

var ChartGridSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartGridSettingvue_type_script_lang_js_,
  ChartGridSettingvue_type_template_id_7e6818b6_scoped_true_render,
  ChartGridSettingvue_type_template_id_7e6818b6_scoped_true_staticRenderFns,
  false,
  null,
  "7e6818b6",
  null
  
)

/* harmony default export */ var ChartGridSetting = (ChartGridSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartLegendSetting.vue?vue&type=template&id=04ee705e&scoped=true&
var ChartLegendSettingvue_type_template_id_04ee705e_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"legend"}},[_c('template',{slot:"title"},[_vm._v(" 图例设置 ")]),_c('div',{staticClass:"blockDiv"},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("显示 ")]),_c('i-switch',{staticStyle:{"margin-left":"105px"},attrs:{"size":"small"},on:{"on-change":_vm.onLegendChange},model:{value:(_vm.legendOptions.show),callback:function ($$v) {_vm.$set(_vm.legendOptions, "show", $$v)},expression:"legendOptions.show"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体大小 ")]),_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small","type":"number"},on:{"on-blur":_vm.onLegendChange},model:{value:(_vm.legendOptions.textStyle_fontSize),callback:function ($$v) {_vm.$set(_vm.legendOptions, "textStyle_fontSize", $$v)},expression:"legendOptions.textStyle_fontSize"}})],1),(typeof _vm.legendOptions.textStyle_color !== 'undefined')?_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("字体颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.onLegendChange},model:{value:(_vm.legendOptions.textStyle_color),callback:function ($$v) {_vm.$set(_vm.legendOptions, "textStyle_color", $$v)},expression:"legendOptions.textStyle_color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.onLegendChange},model:{value:(_vm.legendOptions.textStyle_color),callback:function ($$v) {_vm.$set(_vm.legendOptions, "textStyle_color", $$v)},expression:"legendOptions.textStyle_color"}})],1)])],1)],1):_vm._e(),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("纵向位置 ")]),_c('i-select',{staticStyle:{"width":"180%"},attrs:{"size":"small"},on:{"on-change":_vm.onLegendChange},model:{value:(_vm.legendOptions.top),callback:function ($$v) {_vm.$set(_vm.legendOptions, "top", $$v)},expression:"legendOptions.top"}},[_c('i-option',{attrs:{"value":"top"}},[_vm._v("顶部")]),_c('i-option',{attrs:{"value":"bottom"}},[_vm._v("底部")])],1)],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("横向位置 ")]),_c('i-select',{staticClass:"iSelect",attrs:{"size":"small"},on:{"on-change":_vm.onLegendChange},model:{value:(_vm.legendOptions.left),callback:function ($$v) {_vm.$set(_vm.legendOptions, "left", $$v)},expression:"legendOptions.left"}},[_c('i-option',{attrs:{"value":"left"}},[_vm._v("左对齐")]),_c('i-option',{attrs:{"value":"center"}},[_vm._v("居中")]),_c('i-option',{attrs:{"value":"right"}},[_vm._v("右对齐")])],1)],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title",staticStyle:{"margin-bottom":"10px"}},[_vm._v("布局朝向 ")]),_c('i-select',{staticStyle:{"width":"180%"},attrs:{"size":"small"},on:{"on-change":_vm.onLegendChange},model:{value:(_vm.legendOptions.orient),callback:function ($$v) {_vm.$set(_vm.legendOptions, "orient", $$v)},expression:"legendOptions.orient"}},[_c('i-option',{attrs:{"value":"horizontal"}},[_vm._v("横排")]),_c('i-option',{attrs:{"value":"vertical"}},[_vm._v("竖排")])],1)],1)],1)],2)}
var ChartLegendSettingvue_type_template_id_04ee705e_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartLegendSetting.vue?vue&type=template&id=04ee705e&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartLegendSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartLegendSettingvue_type_script_lang_js_ = ({
  name: "chart-legend-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      legendOptions: {
        textStyle_color: ""
      }
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.legendOptions = Object.assign(this.legendOptions, this.settings);
      }
    },
    onLegendChange: function onLegendChange() {
      this.$emit("change", "legend", this.legendOptions);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartLegendSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartLegendSettingvue_type_script_lang_js_ = (ChartLegendSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartLegendSetting.vue





/* normalize component */

var ChartLegendSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartLegendSettingvue_type_script_lang_js_,
  ChartLegendSettingvue_type_template_id_04ee705e_scoped_true_render,
  ChartLegendSettingvue_type_template_id_04ee705e_scoped_true_staticRenderFns,
  false,
  null,
  "04ee705e",
  null
  
)

/* harmony default export */ var ChartLegendSetting = (ChartLegendSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartBackgroundSetting.vue?vue&type=template&id=240cd810&scoped=true&
var ChartBackgroundSettingvue_type_template_id_240cd810_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"background"}},[_c('template',{slot:"title"},[_vm._v(" 背景设置 "),_c('Tooltip',{attrs:{"placement":"top","content":"背景图片会覆盖背景颜色","transfer":true}},[_c('Icon',{staticStyle:{"margin-left":"10px"},attrs:{"size":"16","type":"ios-help-circle-outline"}})],1)],1),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"20px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("启用背景 ")]),_c('i-switch',{staticStyle:{"margin-left":"80px"},attrs:{"size":"small"},on:{"on-change":_vm.chartBackgroundChange},model:{value:(_vm.chartBackground.enabled),callback:function ($$v) {_vm.$set(_vm.chartBackground, "enabled", $$v)},expression:"chartBackground.enabled"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("背景颜色 ")]),_c('Col',[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},on:{"on-change":_vm.chartBackgroundChange},model:{value:(_vm.chartBackground.color),callback:function ($$v) {_vm.$set(_vm.chartBackground, "color", $$v)},expression:"chartBackground.color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"alpha":"","transfer":true,"size":"small"},on:{"on-change":_vm.chartBackgroundChange},model:{value:(_vm.chartBackground.color),callback:function ($$v) {_vm.$set(_vm.chartBackground, "color", $$v)},expression:"chartBackground.color"}})],1)])],1)],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("背景图片 ")]),_c('div',{staticStyle:{"height":"0"}},[_c('Upload',{staticStyle:{"display":"inline-block","width":"58px"},attrs:{"show-upload-list":false,"default-file-list":_vm.chartBackgroundImg,"on-success":_vm.uploadSuccess,"on-exceeded-size":function (e) { return _vm.handleMaxSize(e, 10); },"format":['jpg', 'jpeg', 'png'],"max-size":10240,"action":_vm.actionUrlPre + '/jmreport/upload'}},[(_vm.chartBackground.image)?_c('i-button',{staticStyle:{"margin-left":"65px"},attrs:{"type":"primary","size":"small"}},[_vm._v("修改")]):_c('i-button',{staticStyle:{"margin-left":"65px"},attrs:{"type":"primary","size":"small"}},[_vm._v("上传")])],1)],1)]),_c('Row',{staticClass:"ivurow"},[(_vm.chartBackground.image)?_c('div',{staticClass:"pictorial-icon-upload",staticStyle:{"width":"196px"}},[_c('img',{staticStyle:{"max-width":"196px","max-height":"50px"},attrs:{"src":_vm.getChartBackgroundImg()}}),_c('div',{staticClass:"cover"},[_c('Icon',{attrs:{"type":"ios-trash-outline"},on:{"click":_vm.removeChartBackground}})],1)]):_vm._e()])],1)],2)}
var ChartBackgroundSettingvue_type_template_id_240cd810_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartBackgroundSetting.vue?vue&type=template&id=240cd810&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartBackgroundSetting.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ChartBackgroundSettingvue_type_script_lang_js_ = ({
  template: "chart-background-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      chartBackgroundImg: [{
        name: "chartBackgroundImg",
        url: ""
      }],
      actionUrlPre: utils_config["a" /* baseFull */],
      chartBackground: {
        color: ""
      }
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.chartBackground = Object.assign(this.chartBackground, this.settings);
      }
    },
    //获取图片预览图
    getChartBackgroundImg: function getChartBackgroundImg() {
      var path = this.chartBackground["image"];

      if (path) {
        if (path.indexOf("http") < 0) {
          path = utils_config["a" /* baseFull */] + path;
        }
      }

      return path;
    },
    //图片上传文件大小
    handleMaxSize: function handleMaxSize(file, size) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件  " + file.name + " 太大，请上传" + size + "M以内图片",
        duration: 6
      });
    },
    uploadSuccess: function uploadSuccess(res) {
      var _this = this;

      this.$emit("upload-success", res, this.chartBackground, function (image) {
        _this.chartBackground["image"] = image;

        _this.$forceUpdate(function () {
          _this.getChartBackgroundImg();
        });
      });
    },
    removeChartBackground: function removeChartBackground() {
      var _this2 = this;

      this.chartBackground["image"] = "";
      this.$forceUpdate(function () {
        _this2.getChartBackgroundImg();
      });
      this.$emit("remove", this.chartBackground);
    },
    chartBackgroundChange: function chartBackgroundChange() {
      this.$emit("change", this.chartBackground);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartBackgroundSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartBackgroundSettingvue_type_script_lang_js_ = (ChartBackgroundSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartBackgroundSetting.vue





/* normalize component */

var ChartBackgroundSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartBackgroundSettingvue_type_script_lang_js_,
  ChartBackgroundSettingvue_type_template_id_240cd810_scoped_true_render,
  ChartBackgroundSettingvue_type_template_id_240cd810_scoped_true_staticRenderFns,
  false,
  null,
  "240cd810",
  null
  
)

/* harmony default export */ var ChartBackgroundSetting = (ChartBackgroundSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartMatchSetting.vue?vue&type=template&id=1dca8cd0&scoped=true&
var ChartMatchSettingvue_type_template_id_1dca8cd0_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"match-setting"},[_c('Submenu',{attrs:{"name":"19"}},[_c('template',{slot:"title"},[_vm._v(" 自定义配色 "),(_vm.selectedChartType.indexOf('scatter.bubble') !== -1)?_c('Tooltip',{attrs:{"placement":"top","content":"【边缘颜色】选用相对更深色","transfer":true}},[_c('Icon',{staticStyle:{"margin-left":"10px"},attrs:{"size":"16","type":"ios-help-circle-outline"}})],1):_vm._e()],1),_c('div',{staticStyle:{"margin-left":"25px","margin-top":"-15px"}},[_c('Row',{staticClass:"ivurow",staticStyle:{"margin-bottom":"5px"}},[_c('i-button',{attrs:{"type":"primary","size":"small"},on:{"click":_vm.colorMatchModalOpen}},[_vm._v("新增")])],1),_c('i-table',{attrs:{"columns":_vm.columns2,"data":_vm.colorMatchData}})],1)],2),_c('Modal',{attrs:{"loading":_vm.loading,"title":"自定义配色","width":30},on:{"on-ok":_vm.addColorMatch,"on-cancel":_vm.onCancel},model:{value:(_vm.colorMatchModal),callback:function ($$v) {_vm.colorMatchModal=$$v},expression:"colorMatchModal"}},[_c('div',{staticStyle:{"padding-right":"50px"}},[_c('i-form',{attrs:{"model":_vm.colorMatch,"label-colon":"","label-width":90}},[(_vm.selectedChartType.indexOf('gauge') == -1)?_c('form-item',{attrs:{"label":"系列"}},[_c('i-select',{staticStyle:{"width":"100%"},attrs:{"placeholder":"请选择配置系列"},model:{value:(_vm.colorMatch.name),callback:function ($$v) {_vm.$set(_vm.colorMatch, "name", $$v)},expression:"colorMatch.name"}},_vm._l((_vm.seriesList),function(item,index){return _c('i-option',{key:index,attrs:{"index":index,"value":item}},[_vm._v(_vm._s(item))])}),1)],1):_vm._e(),_c('form-item',{attrs:{"label":_vm.colorLabel}},[_c('row',[_c('i-col',{attrs:{"span":"12"}},[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},model:{value:(_vm.colorMatch.color),callback:function ($$v) {_vm.$set(_vm.colorMatch, "color", $$v)},expression:"colorMatch.color"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},model:{value:(_vm.colorMatch.color),callback:function ($$v) {_vm.$set(_vm.colorMatch, "color", $$v)},expression:"colorMatch.color"}})],1)])],1)],1)],1),(_vm.selectedChartType.indexOf('scatter.bubble') !== -1)?_c('form-item',{attrs:{"label":"边缘颜色"}},[_c('row',[_c('i-col',{attrs:{"span":"12"}},[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},model:{value:(_vm.colorMatch.edgeColor),callback:function ($$v) {_vm.$set(_vm.colorMatch, "edgeColor", $$v)},expression:"colorMatch.edgeColor"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},model:{value:(_vm.colorMatch.edgeColor),callback:function ($$v) {_vm.$set(_vm.colorMatch, "edgeColor", $$v)},expression:"colorMatch.edgeColor"}})],1)])],1)],1)],1):_vm._e(),(_vm.selectedChartType.indexOf('radar') > -1)?_c('form-item',{attrs:{"label":"边框颜色"}},[_c('row',[_c('i-col',{attrs:{"span":"12"}},[_c('i-input',{staticStyle:{"width":"111px"},attrs:{"size":"small"},model:{value:(_vm.colorMatch.lineColor),callback:function ($$v) {_vm.$set(_vm.colorMatch, "lineColor", $$v)},expression:"colorMatch.lineColor"}},[_c('span',{attrs:{"slot":"append"},slot:"append"},[_c('color-picker',{staticClass:"colorPicker",attrs:{"editable":false,"transfer":true,"size":"small"},model:{value:(_vm.colorMatch.lineColor),callback:function ($$v) {_vm.$set(_vm.colorMatch, "lineColor", $$v)},expression:"colorMatch.lineColor"}})],1)])],1)],1)],1):_vm._e()],1)],1)])],1)}
var ChartMatchSettingvue_type_template_id_1dca8cd0_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartMatchSetting.vue?vue&type=template&id=1dca8cd0&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartMatchSetting.vue?vue&type=script&lang=js&









//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ChartMatchSettingvue_type_script_lang_js_ = ({
  name: "chart-match-setting",
  props: {
    chartOptions: {
      type: Object,
      default: function _default() {}
    },
    dataSettings: {
      type: [Object, String],
      default: function _default() {}
    }
  },
  data: function data() {
    var _this = this;

    return Object(defineProperty["a" /* default */])({
      colorMatchData: [],
      colorMatch: {
        name: "",
        color: "",
        edgeColor: "",
        opacity: 1,
        lineColor: ""
      },
      seriesList: [],
      selectedChartType: "",
      colorMatchModal: false,
      loading: true,
      columns2: [{
        title: "系列颜色",
        key: "color",
        align: "left",
        width: 110,
        render: function render(h, params) {
          return _this.renderColorButton(h, params, "color", 1);
        }
      }, {
        title: "操作",
        key: "action",
        align: "right",
        width: 80,
        render: function render(h, params) {
          return _this.renderColorButton(h, params, "action", 1);
        }
      }]
    }, "colorMatchModal", false);
  },
  watch: {
    chartOptions: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  computed: {
    colorLabel: function colorLabel() {
      return this.selectedChartType.indexOf("scatter.bubble") !== -1 ? "中心颜色" : "颜色";
    }
  },
  methods: {
    //渲染button
    renderColorButton: function renderColorButton(h, params, key, type) {
      var _this2 = this;

      if (key == "action") {
        return h("div", {
          style: {
            display: "flex"
          }
        }, [h("i-button", {
          props: Object.assign({}, Object(defineProperty["a" /* default */])({
            type: "default",
            size: "small"
          }, "type", "text"), {
            icon: "md-create"
          }),
          on: {
            click: function click() {
              if (type == 1) {
                _this2.colorMatch = params.row;
                _this2.colorMatchModal = true;
              } else {
                _this2.seriesObj = params.row;
                _this2.seriesModal = true;
              }
            }
          }
        }), h("i-button", {
          props: Object.assign({}, {
            size: "small",
            type: "text"
          }, {
            icon: "md-close"
          }),
          on: {
            click: function click() {
              _this2.$Modal.confirm({
                title: "提示",
                content: "是否确认删除?",
                onOk: function onOk() {
                  if (type == 1) {
                    _this2.colorMatchData.splice(params.index, 1);

                    _this2.onColorChange();
                  } else {
                    _this2.seriesTypeData.splice(params.index, 1);

                    _this2.runChart();
                  }
                }
              });
            }
          }
        })]);
      } else {
        //行数据显示渲染和编辑操作
        return h("div", {
          style: {
            display: "flex",
            width: "100px",
            alignItems: "center"
          }
        }, [type === 1 ? h("div", {
          style: {
            background: params.row.color,
            width: "15px",
            height: "15px"
          }
        }) : h("div", {
          style: {}
        }, params.row.type), h("div", [h("div", {
          style: {
            display: "inherit",
            width: type === 1 ? "75px" : "60px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        }, "\xa0" + params.row.name)])]);
      }
    },
    colorMatchModalOpen: function colorMatchModalOpen() {
      this.colorMatchModal = true;
    },
    initData: function initData() {
      if (this.chartOptions) {
        this.selectedChartType = this.dataSettings.chartType;
        var colorArr = [];
        var seriesList = [];
        var arr = this.chartOptions.series;
        arr.forEach(function (object) {
          var type = object.type;

          if (type == "bar" || type == "line") {
            if (object.itemStyle && object.itemStyle.color) {
              colorArr.push({
                name: object.name,
                color: object.itemStyle.color
              });
            }

            seriesList.push(object.name);
          } else if (type == "graph") {
            //关系图自定义的数据
            object.categories.forEach(function (categoryObj) {
              if (categoryObj.itemStyle && categoryObj.itemStyle.color) {
                var isExis = colorArr.filter(function (item) {
                  return item.name === categoryObj.name;
                });

                if (isExis.length === 0) {
                  colorArr.push({
                    name: categoryObj.name,
                    color: categoryObj.itemStyle.color
                  });
                }
              }
            });
            seriesList = object.categories.map(function (item) {
              return item.name;
            }).filter(function (item, index, self) {
              return self.indexOf(item) == index;
            });
          } else if (type == "scatter") {
            if (object.itemStyle && object.itemStyle.color && object.itemStyle.color.colorStops) {
              var colorStops = object.itemStyle.color.colorStops;
              colorArr.push({
                name: object.name,
                color: colorStops[0].color,
                edgeColor: colorStops[1].color
              });
            }

            seriesList.push(object.name);
          } else if (type == "radar") {
            object.data.forEach(function (item) {
              if (item.areaStyle && item.areaStyle.color && item.areaStyle.color != "") {
                colorArr.push({
                  name: item.name,
                  color: item.areaStyle.color,
                  opacity: item.areaStyle.opacity,
                  lineColor: item.lineStyle.color
                });
              }

              seriesList.push(item.name);
            });
          } else if (type == "pie" || type == "funnel") {
            object.data.map(function (item) {
              if (item.itemStyle && item.itemStyle.color) {
                colorArr.push({
                  name: item.name,
                  color: item.itemStyle.color
                });
              }

              seriesList.push(item.name);
            });
          } else if (type == "gauge") {
            var _arr = object.axisLine.lineStyle.color;

            for (var j = 0, len = _arr.length; j < len; j++) {
              if (_arr[0] && _arr[0][1] == "#91c7ae" && _arr[1] && _arr[1][1] == "#63869E") {
                break;
              }

              colorArr.push({
                color: _arr[j][1],
                name: ""
              });
            }
          }
        }); //已设置的颜色配置

        this.colorMatchData = colorArr; //系列下拉框数据

        this.seriesList = seriesList;
      }
    },
    addColorMatch: function addColorMatch() {
      var obj = Object(objectSpread2["a" /* default */])({}, this.colorMatch);

      if (obj._index >= 0) {
        this.colorMatchData.splice(obj._index, 1, obj);
      } else {
        this.colorMatchData.push(obj);
      } //运行到图表


      this.onColorChange();
      this.colorMatchModal = false;
      this.colorMatch = {
        name: "",
        color: "",
        edgeColor: "",
        opacity: 1,
        lineColor: ""
      };
    },
    onColorChange: function onColorChange() {
      var _this3 = this;

      if (!this.colorMatchData) {
        return;
      }

      var arr = [];

      if (this.selectedChartType.indexOf("pie") >= 0 || this.selectedChartType.indexOf("funnel") >= 0 || this.selectedChartType.indexOf("radar") >= 0) {
        arr = this.chartOptions["series"][0]["data"];
      } else if (this.selectedChartType.indexOf("graph") >= 0) {
        //处理关系图的自定义配色
        arr = this.chartOptions["series"][0]["categories"];
      } else {
        arr = this.chartOptions["series"];
      }

      var seriesArray = [];

      var _iterator = Object(createForOfIteratorHelper["a" /* default */])(arr),
          _step;

      try {
        var _loop = function _loop() {
          var item = _step.value;
          //删除背景色
          delete item["areaStyle"];
          delete item["lineStyle"];

          if (_this3.selectedChartType.indexOf("gauge") >= 0) {
            return "break";
          }

          var temp = _this3.colorMatchData.filter(function (c) {
            return c.name == item["name"];
          });

          if (_this3.selectedChartType.indexOf("radar") >= 0) {
            var color = "";
            var lineColor = "";
            var opacity = 1;

            if (temp && temp.length > 0) {
              color = temp[0]["color"];
              lineColor = temp[0]["lineColor"];
              opacity = temp[0]["opacity"]; //设置雷达图背景色和透明度

              if (color) {
                item["areaStyle"] = {
                  color: color,
                  opacity: opacity
                };
              } //设置雷达图边框颜色


              if (lineColor) {
                item["lineStyle"] = {
                  color: lineColor
                };
              }
            }
          } else if (_this3.selectedChartType.indexOf("scatter") >= 0) {
            if (temp && temp.length > 0) {
              var _color = temp[0]["color"]; //0%处的颜色 中心

              var edgeColor = temp[0]["edgeColor"]; //100%处的颜色 边缘

              var tempColorStyle = {
                type: "radial",
                r: 0.5,
                colorStops: [{
                  offset: 0,
                  color: _color
                }, {
                  offset: 1,
                  color: edgeColor
                }]
              };

              if (!item["itemStyle"]) {
                item["itemStyle"] = {
                  color: tempColorStyle
                };
              } else {
                item["itemStyle"]["color"] = tempColorStyle;
              }
            }
          } else {
            if (!item["itemStyle"]) {
              item["itemStyle"] = {
                color: ""
              };
            }

            var _color2 = "";

            if (temp && temp.length > 0) {
              _color2 = temp[0]["color"];
            }

            item["itemStyle"]["color"] = _color2;
          }

          if (_this3.selectedChartType.indexOf("mixed") >= 0) {
            seriesArray.push(JSON.parse(JSON.stringify(item)));
          }
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _ret = _loop();

          if (_ret === "break") break;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (this.selectedChartType.indexOf("mixed") >= 0) {
        this.chartOptions["series"] = seriesArray;
      } //TODO 仪表盘目前只支持设置三色0.2/0.8/1，后期优化修改


      if (this.selectedChartType.indexOf("gauge") >= 0) {
        var c1 = this.colorMatchData[0] ? this.colorMatchData[0].color : "#91c7ae";
        var c2 = this.colorMatchData[1] ? this.colorMatchData[1].color : "#63869E";
        var c3 = this.colorMatchData[2] ? this.colorMatchData[2].color : "#C23531";
        var _arr2 = [[0.2, c1], [0.8, c2], [1, c3]];
        this.chartOptions["series"][0]["axisLine"]["lineStyle"].color = _arr2;
      }

      var id = this.dataSettings.id;
      exportApi["a" /* default */].updateChart(id, this.chartOptions);
    },
    onCancel: function onCancel() {
      this.colorMatch = {
        color: "",
        edgeColor: "",
        lineColor: ""
      };
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartMatchSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartMatchSettingvue_type_script_lang_js_ = (ChartMatchSettingvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/setting/chart/ChartMatchSetting.vue?vue&type=style&index=0&id=1dca8cd0&scoped=true&lang=css&
var ChartMatchSettingvue_type_style_index_0_id_1dca8cd0_scoped_true_lang_css_ = __webpack_require__("a7ac");

// CONCATENATED MODULE: ./src/components/setting/chart/ChartMatchSetting.vue






/* normalize component */

var ChartMatchSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartMatchSettingvue_type_script_lang_js_,
  ChartMatchSettingvue_type_template_id_1dca8cd0_scoped_true_render,
  ChartMatchSettingvue_type_template_id_1dca8cd0_scoped_true_staticRenderFns,
  false,
  null,
  "1dca8cd0",
  null
  
)

/* harmony default export */ var ChartMatchSetting = (ChartMatchSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartDatasourceSetting.vue?vue&type=template&id=63fb805c&scoped=true&
var ChartDatasourceSettingvue_type_template_id_63fb805c_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('Modal',{staticClass:"dataSource",attrs:{"fullscreen":true,"loading":_vm.loading,"width":"100%","title":_vm.moduleTitle},on:{"on-cancel":_vm.clearDb,"on-ok":_vm.saveDbTip},model:{value:(_vm.sqlModal),callback:function ($$v) {_vm.sqlModal=$$v},expression:"sqlModal"}},[_c('Row',[(_vm.sqlForm.dbType == 0)?_c('i-col',{attrs:{"span":"4"}},[(_vm.forward == '0')?_c('Icon',{staticStyle:{"float":"left","margin-top":"-12px","cursor":"pointer"},attrs:{"size":"25","type":"ios-arrow-back"},on:{"click":function($event){return _vm.forwardClick('1')}}}):_vm._e(),(_vm.forward == '1')?_c('Icon',{staticStyle:{"float":"left","margin-top":"-12px","cursor":"pointer","border-right":"1px solid #dcdee2"},attrs:{"size":"25","type":"ios-arrow-forward"},on:{"click":function($event){return _vm.forwardClick('0')}}}):_vm._e()],1):_vm._e()],1),_c('Row',[(_vm.sqlForm.dbType == 0 && _vm.forward == '0')?_c('i-col',{attrs:{"span":"4"}},[_c('Card',{staticStyle:{"height":"800px"}},[_c('div',[_c('i-select',{staticStyle:{"width":"80%"},attrs:{"model":_vm.sqlForm.dbSource,"clearable":""},on:{"update:model":function($event){return _vm.$set(_vm.sqlForm, "dbSource", $event)},"on-change":_vm.selectdbSource},model:{value:(_vm.sqlForm.dbSource),callback:function ($$v) {_vm.$set(_vm.sqlForm, "dbSource", $$v)},expression:"sqlForm.dbSource"}},_vm._l((_vm.sourceTab.data),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.id}},[_vm._v(_vm._s(item.name))])}),1),(_vm.sqlForm.dbType == 0)?_c('i-button',{staticStyle:{"margin-top":"10px"},attrs:{"type":"primary"},on:{"click":_vm.sourceManage}},[_vm._v("数据源维护")]):_vm._e()],1),(_vm.tableList && _vm.tableList.length > 0)?_c('div',{staticStyle:{"margin-top":"10px"}},[_c('List',{ref:"taList",staticStyle:{"overflow-y":"auto","height":"720px"},attrs:{"size":"small","border":""}},_vm._l((_vm.tableList),function(item,index){return _c('ListItem',{key:index,attrs:{"id":index}},[_c('Tooltip',{attrs:{"content":item.Name,"transfer":""}},[_c('a',{class:{
                      on: _vm.currentIndex === index,
                      nameCla: index === index,
                    },attrs:{"href":"Javascript:void(0)"},on:{"click":function($event){return _vm.tableNameClick(item, index)}}},[_vm._v(" "+_vm._s(item.Comment ? item.Comment : item.Name)+" ")])])],1)}),1)],1):_vm._e()])],1):_vm._e(),(_vm.sqlForm.dbType == 0 && _vm.forward == '1')?_c('div',{staticStyle:{"height":"800px","box-sizing":"border-box","width":"26px","float":"left","border-right":"1px solid #dcdee2"}}):_vm._e(),_c('i-col',{attrs:{"span":_vm.secondSpan}},[_c('div',{staticStyle:{"margin-left":"20px"}},[_c('i-form',{ref:"sqlForm",attrs:{"model":_vm.sqlForm,"rules":_vm.sqlFormValidate,"inline":"","label-width":85}},[_c('Row',{attrs:{"span":"24"}},[_c('i-col',{attrs:{"span":"4"}},[_c('form-item',{attrs:{"prop":"dbCode","label":"编码:"}},[_c('i-input',{staticStyle:{"width":"153px"},attrs:{"disabled":_vm.sqlForm.id != '' && _vm.sqlForm.id != undefined,"type":"text","placeholder":"请输入编码"},model:{value:(_vm.sqlForm.dbCode),callback:function ($$v) {_vm.$set(_vm.sqlForm, "dbCode", $$v)},expression:"sqlForm.dbCode"}})],1)],1),_c('i-col',{staticStyle:{"margin-left":"20px"},attrs:{"span":"4"}},[_c('form-item',{attrs:{"prop":"dbChName","label":"名称:"}},[_c('i-input',{staticStyle:{"width":"200px"},attrs:{"type":"text","placeholder":"请输入名称"},model:{value:(_vm.sqlForm.dbChName),callback:function ($$v) {_vm.$set(_vm.sqlForm, "dbChName", $$v)},expression:"sqlForm.dbChName"}})],1)],1),_c('i-col',{attrs:{"span":"3"}},[_c('form-item',[_c('Checkbox',{staticStyle:{"width":"100px","margin-left":"10%"},attrs:{"checked":_vm.sqlForm.isList},on:{"update:checked":function($event){return _vm.$set(_vm.sqlForm, "isList", $event)},"on-change":_vm.isListChange},model:{value:(_vm.sqlForm.isList),callback:function ($$v) {_vm.$set(_vm.sqlForm, "isList", $$v)},expression:"sqlForm.isList"}},[_vm._v("是否列表")])],1)],1),_c('i-col',{attrs:{"span":"3"}},[_c('form-item',[(_vm.sqlForm.isList == true)?_c('Checkbox',{staticStyle:{"width":"100px"},attrs:{"checked":_vm.sqlForm.isPage},on:{"update:checked":function($event){return _vm.$set(_vm.sqlForm, "isPage", $event)},"on-change":_vm.checkChange},model:{value:(_vm.sqlForm.isPage),callback:function ($$v) {_vm.$set(_vm.sqlForm, "isPage", $$v)},expression:"sqlForm.isPage"}},[_vm._v("是否分页")]):_vm._e()],1)],1),(_vm.sqlForm.dbType == 1)?_c('i-col',{attrs:{"span":"3"}},[_c('form-item',{attrs:{"prop":"apiMethod","label":"请求方式:"}},[_c('i-select',{staticStyle:{"width":"153px"},attrs:{"placeholder":"请输入请求方式"},model:{value:(_vm.sqlForm.apiMethod),callback:function ($$v) {_vm.$set(_vm.sqlForm, "apiMethod", $$v)},expression:"sqlForm.apiMethod"}},[_c('i-option',{attrs:{"value":"0"}},[_vm._v("get")]),_c('i-option',{attrs:{"value":"1"}},[_vm._v("post")])],1)],1)],1):_vm._e()],1),_c('Row',{staticStyle:{"margin-top":"1%"}},[_c('i-col',{attrs:{"span":"24"}},[(_vm.sqlForm.dbType == 0)?_c('form-item',{attrs:{"prop":"dbDynSql","label":"报表SQL:"}},[_c('i-input',{staticStyle:{"min-height":"120px","max-height":"620px","width":"950px"},attrs:{"type":"textarea","rows":4,"placeholder":"请输入查询SQL"},on:{"on-blur":_vm.dbDynSqlBlur},model:{value:(_vm.sqlForm.dbDynSql),callback:function ($$v) {_vm.$set(_vm.sqlForm, "dbDynSql", $$v)},expression:"sqlForm.dbDynSql"}})],1):_c('form-item',{attrs:{"prop":"apiUrl","label":"Api地址:"}},[_c('i-input',{staticStyle:{"min-height":"120px","max-height":"620px","width":"950px"},attrs:{"type":"textarea","rows":4,"placeholder":"请输入Api地址"},on:{"on-blur":_vm.dbApiBlur},model:{value:(_vm.sqlForm.apiUrl),callback:function ($$v) {_vm.$set(_vm.sqlForm, "apiUrl", $$v)},expression:"sqlForm.apiUrl"}})],1),(_vm.sqlForm.dbType == 0)?_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.handleSQLAnalyze}},[_vm._v("SQL解析")]):_vm._e(),(_vm.sqlForm.dbType == 1)?_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.handleApiAnalyze}},[_vm._v("Api解析")]):_vm._e()],1)],1)],1),(_vm.spinShow)?_c('Spin',{attrs:{"fix":""}},[_c('Icon',{staticClass:"demo-spin-icon-load",attrs:{"type":"ios-loading","size":"18"}}),_c('div',[_vm._v("Loading")])],1):_vm._e(),_c('Tabs',{staticStyle:{"margin-top":"15px"},model:{value:(_vm.tabValue),callback:function ($$v) {_vm.tabValue=$$v},expression:"tabValue"}},[_c('tab-pane',{attrs:{"label":"动态报表配置明细","name":"1"}},[(_vm.tab1.selectParamTables.length > 0)?_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.removeFieldTable}},[_vm._v("删除")]):_vm._e(),_c('i-table',{ref:"dynamicTable",staticStyle:{"padding-bottom":"10%"},attrs:{"stripe":"","columns":_vm.tab1.columns,"data":_vm.tab1.data,"height":_vm.tableHeight},on:{"on-select":_vm.selectField,"on-select-all":_vm.selectFieldAll,"on-select-all-cancel":_vm.cancelFieldAll,"on-select-cancel":_vm.cancelField}})],1),_c('tab-pane',{attrs:{"label":"报表参数","name":"2"}},[_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.addParamTable}},[_vm._v("新增")]),(_vm.tab2.selectParamTables.length > 0)?_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.removeParamTable}},[_vm._v("删除")]):_vm._e(),_c('i-table',{ref:"paramTable",attrs:{"stripe":"","columns":_vm.tab2.columns,"data":_vm.tab2.data,"height":_vm.paramTableHeight},on:{"on-select":_vm.selectParam,"on-select-all":_vm.selectParamAll,"on-select-all-cancel":_vm.cancelParamAll,"on-select-cancel":_vm.cancelParam}})],1),(_vm.sqlForm.dbType == 0)?_c('tab-pane',{attrs:{"label":"数据预览","name":"3"}},[_c('i-table',{ref:"paramTable",attrs:{"stripe":"","columns":_vm.tab3.columns,"data":_vm.tab3.data,"loading":_vm.tab3Loading}}),_c('div',{staticStyle:{"float":"right","margin-top":"20px"}},[_c('Page',{attrs:{"total":_vm.tab3.page.total},on:{"on-change":_vm.handleCurrentChange}})],1)],1):_vm._e()],1)],1)])],1)],1),_c('Modal',{attrs:{"class-name":"vertical-center-modal","fullscreen":true,"loading":_vm.loading,"title":"数据源维护"},on:{"on-ok":_vm.saveSourceDb},model:{value:(_vm.sourceModal),callback:function ($$v) {_vm.sourceModal=$$v},expression:"sourceModal"}},[_c('Row',[_c('i-col',{attrs:{"span":"3"}},[_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.addDataSource}},[_vm._v("新增")])],1)],1),[_c('i-table',{staticStyle:{"margin-top":"1%"},attrs:{"border":"","columns":_vm.sourceTab.columns,"data":_vm.sourceTab.data}})]],2),_c('Modal',{attrs:{"loading":_vm.loading,"title":"数据源","width":35},on:{"on-cancel":_vm.clearDbSou,"on-ok":_vm.saveDataSource},model:{value:(_vm.visibleData),callback:function ($$v) {_vm.visibleData=$$v},expression:"visibleData"}},[_c('div',{staticStyle:{"padding-right":"30px"}},[_c('i-form',{ref:"dataSource",attrs:{"model":_vm.dataSource,"rules":_vm.dataFormValidate,"label-colon":"","label-width":100}},[_c('form-item',{staticStyle:{"height":"50px"},attrs:{"prop":"name","label":"数据源名称"}},[_c('i-input',{attrs:{"placeholder":"请输入数据源名称"},model:{value:(_vm.dataSource.name),callback:function ($$v) {_vm.$set(_vm.dataSource, "name", $$v)},expression:"dataSource.name"}})],1),_c('form-item',{staticStyle:{"height":"50px"},attrs:{"prop":"dbType","label":"数据源类型"}},[_c('i-select',{attrs:{"model":_vm.dataSource.dbType},on:{"update:model":function($event){return _vm.$set(_vm.dataSource, "dbType", $event)},"on-change":_vm.selectdbType},model:{value:(_vm.dataSource.dbType),callback:function ($$v) {_vm.$set(_vm.dataSource, "dbType", $$v)},expression:"dataSource.dbType"}},_vm._l((_vm.dataSourceTypeList),function(item,index){return _c('i-option',{key:index,attrs:{"value":item.value}},[_vm._v(_vm._s(item.label))])}),1)],1),_c('form-item',{staticStyle:{"height":"50px"},attrs:{"prop":"dbDriver","label":"驱动类"}},[_c('i-input',{attrs:{"placeholder":"请输入驱动类"},model:{value:(_vm.dataSource.dbDriver),callback:function ($$v) {_vm.$set(_vm.dataSource, "dbDriver", $$v)},expression:"dataSource.dbDriver"}})],1),_c('form-item',{staticStyle:{"height":"50px"},attrs:{"prop":"dbUrl","label":"数据源地址"}},[_c('i-input',{attrs:{"placeholder":"请输入数据源地址"},model:{value:(_vm.dataSource.dbUrl),callback:function ($$v) {_vm.$set(_vm.dataSource, "dbUrl", $$v)},expression:"dataSource.dbUrl"}})],1),_c('form-item',{staticStyle:{"height":"50px"},attrs:{"prop":"dbUsername","label":"用户名"}},[_c('i-input',{attrs:{"placeholder":"请输入用户名"},model:{value:(_vm.dataSource.dbUsername),callback:function ($$v) {_vm.$set(_vm.dataSource, "dbUsername", $$v)},expression:"dataSource.dbUsername"}})],1),_c('form-item',{staticStyle:{"height":"50px","width":"100%"},attrs:{"prop":"dbPassword","label":"密码"}},[_c('i-input',{staticStyle:{"width":"calc(100% - 60px)"},attrs:{"type":"password","password":"","placeholder":"请输入密码"},model:{value:(_vm.dataSource.dbPassword),callback:function ($$v) {_vm.$set(_vm.dataSource, "dbPassword", $$v)},expression:"dataSource.dbPassword"}}),_c('i-button',{staticStyle:{"width":"50px"},attrs:{"size":"small","type":"primary"},on:{"click":_vm.dataSourceTest}},[_vm._v("测试")])],1)],1)],1)]),_c('Modal',{attrs:{"title":"确认删除"},on:{"on-ok":_vm.deleteParamTable},model:{value:(_vm.deleteParamModel),callback:function ($$v) {_vm.deleteParamModel=$$v},expression:"deleteParamModel"}},[_c('p',[_c('Icon',{attrs:{"type":"ios-alert","color":"#f90","size":"20px"}}),_vm._v("是否删除选中数据? ")],1)]),_c('Modal',{attrs:{"title":"确认删除"},on:{"on-ok":_vm.deleteFieldTable},model:{value:(_vm.deleteFieldModel),callback:function ($$v) {_vm.deleteFieldModel=$$v},expression:"deleteFieldModel"}},[_c('p',[_c('Icon',{attrs:{"type":"ios-alert","color":"#f90","size":"16px"}}),_vm._v("是否删除选中配置? ")],1)]),_c('Modal',{attrs:{"title":"报表SQL已修改"},on:{"on-ok":_vm.reportOk,"on-cancel":_vm.reportCancel},model:{value:(_vm.reportSql),callback:function ($$v) {_vm.reportSql=$$v},expression:"reportSql"}},[_c('p',[_vm._v("报表SQL已修改，是否保存")])])],1)}
var ChartDatasourceSettingvue_type_template_id_63fb805c_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartDatasourceSetting.vue?vue&type=template&id=63fb805c&scoped=true&

// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.13.9@@babel/runtime/helpers/esm/toConsumableArray.js + 3 modules
var toConsumableArray = __webpack_require__("4116");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.string.fixed.js
var es_string_fixed = __webpack_require__("676c");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.string.trim.js
var es_string_trim = __webpack_require__("ea94");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.array.find-index.js
var es_array_find_index = __webpack_require__("47b8");

// EXTERNAL MODULE: ./node_modules/_core-js@3.9.1@core-js/modules/es.string.match.js
var es_string_match = __webpack_require__("836a");

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartDatasourceSetting.vue?vue&type=script&lang=js&




var _methods;


















//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var ChartDatasourceSettingvue_type_script_lang_js_ = ({
  name: "chart-datasource-setting",
  props: {
    settings: {
      type: Object,
      required: false,
      default: function _default() {}
    }
  },
  data: function data() {
    var _this = this;

    return {
      forward: "1",
      //图片切换
      reportSql: false,
      //控制Modal当SQL报表改变的时候
      loading: true,
      tab3Loading: false,
      spinShow: false,
      menuitem: "printinfo",
      selectTableName: "",
      currentIndex: -1,
      moduleTitle: "",
      tableHeight: 0,
      paramTableHeight: 0,
      tabValue: "1",
      deleteParamModel: false,
      deleteFieldModel: false,
      dataSourceTypeList: [{
        value: "MYSQL5.5",
        label: "MySQL5.5"
      }, {
        value: "MYSQL5.7",
        label: "MySQL5.7+"
      }, {
        value: "ORACLE",
        label: "Oracle"
      }, {
        value: "SQLSERVER",
        label: "SQLServer"
      }, {
        value: "POSTGRESQL",
        label: "PostgreSQL"
      }],
      designerObj: {
        id: "",
        name: "",
        type: "printinfo"
      },
      tab1: {
        selectParamTables: [],
        data: [],
        columns: [{
          type: "selection",
          width: 35,
          align: "center"
        }, {
          type: "index",
          width: 60,
          align: "center"
        }, {
          title: "字段名",
          key: "name",

          /*width: '220',*/
          render: function render(h, params) {
            return _this.renderInput(h, params, "name", "tab1");
          }
        }, {
          title: "排序",
          key: "orderNum",

          /*width: '80',*/
          render: function render(h, params) {
            return _this.renderInput(h, params, "orderNum", "tab1");
          }
        }, {
          title: "字段文本",

          /*width: '220',*/
          key: "remark",
          render: function render(h, params) {
            return _this.renderInput(h, params, "remark", "tab1");
          }
        }, {
          title: "类型",

          /*width: '140',*/
          key: "widgetType",
          render: function render(h, params) {
            var options = [// 下拉选项
            {
              title: "数值类型",
              value: "number"
            }, {
              title: "字符类型",
              value: "string"
            }, {
              title: "日期类型",
              value: "date"
            }, {
              title: "时间类型",
              value: "datetime"
            }];
            return h("i-select", {
              props: {
                size: "small",
                value: _this.tab1.data[params.index].widgetType
              },
              on: {
                "on-change": function onChange(value) {
                  _this.tab1.data[params.index].widgetType = value;
                }
              }
            }, options.map(function (item) {
              return h("i-option", {
                props: {
                  value: item.value
                }
              }, item.title);
            }));
          }
        }, {
          title: "字典code",

          /*width: '220',*/
          key: "dictCode",
          render: function render(h, params) {
            return _this.renderInput(h, params, "dictCode", "tab1");
          }
        }, {
          title: "查询",
          width: "80",
          key: "searchFlag",
          render: function render(h, params) {
            return h("Checkbox", {
              props: {
                size: "small",
                value: _this.tab1.data[params.index].searchFlag,
                trueValue: 1,
                falseValue: 0
              },
              on: {
                "on-change": function onChange(value) {
                  _this.tab1.data[params.index].searchFlag = value;

                  if (value == 0) {// _this.tab1.data[params.index].searchMode = null;
                  }
                }
              }
            });
          }
        }, {
          title: "查询模式",

          /*width: '140',*/
          key: "searchMode",
          render: function render(h, params) {
            var options = [// 下拉选项
            {
              title: "单条件查询",
              value: 1
            }, {
              title: "范围查询",
              value: 2
            }, {
              title: "多选查询",
              value: 3,
              tip: "须设置字典code"
            }];
            return h("i-select", {
              props: {
                size: "small",
                value: _this.tab1.data[params.index].searchMode
              },
              on: {
                "on-change": function onChange(value) {
                  _this.tab1.data[params.index].searchMode = value; // this.tab1.data
                }
              }
            }, options.map(function (item) {
              var optionObject = {
                props: {
                  value: item.value
                }
              };

              if (item.tip) {
                optionObject["attrs"] = {
                  title: item.tip
                };
              }

              return h("i-option", optionObject, item.title);
            }));
          }
        }]
      },
      tab2: {
        selectParamTables: [],
        data: [],
        columns: [{
          type: "selection",
          width: 35,
          align: "center"
        }, {
          type: "index",
          width: 60,
          align: "center"
        }, {
          title: "参数",
          key: "paramName",
          width: "300",
          render: function render(h, params) {
            return _this.renderInput(h, params, "paramName", "tab2");
          }
        }, {
          title: "参数文本",
          key: "paramTxt",
          width: "300",
          render: function render(h, params) {
            return _this.renderInput(h, params, "paramTxt", "tab2");
          }
        }, {
          title: "默认值",
          key: "paramValue",
          width: "300",
          render: function render(h, params) {
            return _this.renderInput(h, params, "paramValue", "tab2");
          }
        }, {
          title: "排序",
          key: "orderNum",
          width: "300",
          render: function render(h, params) {
            return _this.renderInput(h, params, "orderNum", "tab2");
          }
        }]
      },
      tab3: {
        columns: [],
        page: {
          //分页参数
          page: 1,
          size: 10,
          total: 0
        },
        data: []
      },
      sqlForm: {
        dbCode: "",
        dbChName: "",
        dbDynSql: "",
        dbType: "",
        apiUrl: "",
        apiMethod: "0",
        isPage: false,
        isList: false,
        dbSource: ""
      },
      sqlModal: false,
      sqlFormValidate: {
        dbCode: [{
          required: true,
          message: "编码不能为空",
          trigger: "blur"
        }, {
          validator: this.validateCodeExist,
          trigger: "blur"
        }],
        dbChName: [{
          required: true,
          message: "名称不能为空",
          trigger: "blur"
        }],
        dbDynSql: [{
          required: true,
          message: "报表SQL不能为空",
          trigger: "blur"
        }],
        apiUrl: [{
          required: true,
          message: "请求地址不能为空",
          trigger: "blur"
        }]
      },
      sourceModal: false,
      sourceTab: {
        //selectParamTables:[],
        data: [],
        columns: [{
          type: "index",
          width: 60,
          align: "center"
        }, {
          title: "数据源名称",
          key: "name"
        }, {
          title: "数据库类型",
          key: "dbType",
          render: function render(h, params) {
            switch (params.row.dbType) {
              case "MYSQL5.5":
                return h("span", "MySQL5.5");
                break;

              case "MYSQL5.7":
                return h("span", "MySQL5.7");
                break;

              case "ORACLE":
                return h("span", "Oracle");
                break;

              case "SQLSERVER":
                return h("span", "SQLServer");
                break;

              case "POSTGRESQL":
                return h("span", "PostgreSQL");
            }
          }
        }, {
          title: "用户名",
          key: "dbUsername"
        }, {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: function render(h, params) {
            return _this.renderButton(h, params);
          }
        }]
      },
      visibleData: false,
      dataSource: {
        id: "",
        code: "",
        reportId: "",
        name: "",
        dbType: "",
        dbDriver: "",
        dbUrl: "",
        dbUsername: "",
        dbPassword: ""
      },
      dataFormValidate: {
        name: [{
          required: true,
          message: "数据源名称不能为空",
          trigger: "blur"
        }],
        dbType: [{
          required: true,
          message: "数据源类型不能为空",
          trigger: "blur"
        }],
        dbDriver: [{
          required: true,
          message: "驱动类不能为空",
          trigger: "blur"
        }],
        dbUrl: [{
          required: true,
          message: "数据源地址不能为空",
          trigger: "blur"
        }],
        dbUsername: [{
          required: true,
          message: "用户名不能为空",
          trigger: "blur"
        }],
        dbPassword: [{
          required: true,
          message: "密码不能为空",
          trigger: "blur"
        }]
      },
      tableList: [],
      oldDbDynSql: "" //旧的数据集

    };
  },
  mounted: function mounted() {
    //多数据源
    this.initDataSource();
  },
  computed: {
    secondSpan: function secondSpan() {
      if (this.forward == "1" && this.sqlForm.dbType == "0") {
        return 23;
      }

      return this.sqlForm.dbType == "0" ? 20 : 24;
    }
  },
  watch: {
    tab1: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.changeTab3Head();
      }
    },
    tabValue: {
      deep: true,
      immediate: true,
      handler: function handler(val) {
        if (val === "3") {
          this.spinShow = true;
          this.loadTableData(1);
        }
      }
    },
    tab2: {
      deep: true,
      immediate: true,
      handler: function handler() {
        if (this.sqlForm.dbType == "1") {
          this.createParams();
        }
      }
    }
  },
  methods: (_methods = {
    changeTab3Head: function changeTab3Head() {
      var _this2 = this;

      //获取table3表头
      var tab3Head = [];
      this.tab1.data.forEach(function (item, index) {
        var temp = {
          title: item.remark,
          key: item.name,
          tooltip: true,
          width: 100
        };

        if (_this2.tab1.data.length > 15) {
          if (index < 3) {
            temp.fixed = "left";
          }

          if (index == _this2.tab1.data.length - 1) {
            temp.fixed = "right";
          }
        }

        tab3Head.push(temp);
      });
      this.tab3.columns = tab3Head;
    },
    //校验数据集编码
    validateCodeExist: function validateCodeExist(rule, value, callback) {
      if (this.sqlForm.id) {
        callback();
      }

      var reg = /^.[A-Za-z]+$/;

      if (!reg.test(value)) {
        callback(new Error("编码只能是英文"));
      }

      $jm.dataCodeExist(excel_config_id, value, function (result) {
        if (result === true) {
          callback("编码已存在!");
        } else {
          callback();
        }
      });
    },
    onMenuSelect: function onMenuSelect(name) {
      this.menuitem = name;
      var modalFlag = false;

      if (name === "sqlInfo") {
        //sql
        this.moduleTitle = "SQL数据集";
        this.sqlForm.dbType = "0";
        modalFlag = true;
      } else if (name === "apiInfo") {
        //api
        this.moduleTitle = "Api数据集";
        this.sqlForm.dbType = "1";
        modalFlag = true;
      }

      this.sqlForm.dbCode = "";
      this.sqlForm.dbChName = "";
      this.sqlForm.dbDynSql = "";
      this.sqlForm.apiUrl = "";
      this.sqlForm.dbSource = "";
      this.tab1.data = [];
      this.tab2.data = [];
      this.sqlModal = modalFlag;
    },
    editById: function editById(dbId) {
      var _this3 = this;

      this.tabValue = "1";
      $http.get({
        url: api.loadDbData(dbId),
        success: function success(result) {
          var reportResult = result;

          if (!reportResult) {
            return;
          } //设置数据


          _this3.sqlForm = reportResult.reportDb;
          var bol = reportResult.reportDb.isPage;
          var isList = reportResult.reportDb.isList;
          _this3.tab1.data = reportResult.fieldList;

          if (_this3.tab1.data) {
            _this3.tab1.data.forEach(function (item, index) {
              item.tableIndex = index + 1;
            });
          }

          _this3.tab2.data = reportResult.paramList;

          if (_this3.tab2.data) {
            _this3.tab2.data.forEach(function (item, index) {
              item.tableIndex = index + 1;
            });
          }

          if (_this3.sqlForm.dbType === "0") {
            _this3.moduleTitle = "SQL数据集";
            _this3.oldDbDynSql = _this3.sqlForm.dbDynSql;
          } else {
            _this3.moduleTitle = "Api数据集";
          }

          if (bol == "1") {
            _this3.sqlForm.isPage = true;
            _this3.sqlForm.isList = true;
          } else {
            _this3.sqlForm.isPage = false;
          }

          if (isList == "1") {
            _this3.sqlForm.isList = true;
          } else {
            _this3.sqlForm.isPage = false;
          }

          _this3.handleDbSourceTable();

          _this3.sqlModal = true;
        }
      });
    },
    clearDb: function clearDb() {
      this.getReport();

      for (var key in this.sqlForm) {
        this.sqlForm[key] = "";
      }

      this.sqlForm.isPage = true;
      this.sqlForm.isList = true;
      this.sqlForm.apiMethod = "0";
      this.tab1.data = [];
      this.tab2.data = [];
      this.tab2.selectParamTables = [];
    },
    getReport: function getReport() {
      var _this4 = this;

      $http.get({
        url: api.getReport(excel_config_id),
        success: function success(result) {
          if (result) {
            _this4.$emit("cancelback", result);

            _this4.designerObj = result;
          }
        }
      });
    },
    handleCurrentChange: function handleCurrentChange(val) {
      this.loadTableData(val);
    },
    loadTableData: function loadTableData(page) {
      var _this5 = this;

      if (page) {
        this.tab3.page.page = page;
      }

      var dbSource = this.sqlForm.dbSource;

      if (!this.selectTableName) {
        if (this.sqlForm.dbDynSql) {
          var form_number = this.sqlForm.dbDynSql.indexOf("from ");
          var where_number = this.sqlForm.dbDynSql.indexOf(" where");
          var tableName = (where_number > -1 ? this.sqlForm.dbDynSql.substring(form_number + 4, where_number) : this.sqlForm.dbDynSql.substring(form_number + 4)).trim();
          this.selectTableName = tableName;
        }
      }

      if (!this.selectTableName) {
        this.spinShow = false;
        return;
      }

      if (this.tabValue === "3" && !this.sqlForm.dbDynSql) {
        this.spinShow = false;
        return;
      }

      this.tab3Loading = true;
      $http.post({
        url: api.loadTableData,
        data: {
          dbSource: dbSource,
          tableName: this.selectTableName,
          pageNo: this.tab3.page.page,
          pageSize: this.tab3.page.size
        },
        success: function success(result) {
          _this5.tab3Loading = false;
          _this5.spinShow = false;
          _this5.tab3.data = result.records;
          _this5.tab3.page.total = result.total;
        },
        fail: function fail(res) {
          _this5.tab3Loading = false;
          _this5.spinShow = false;
        }
      });
    },
    //保存之前先判断报表SQl是否已改变
    saveDbTip: function saveDbTip() {
      //当为数据源SQL并且报表SQl已改变则提示
      if (this.sqlForm.dbType == "0" && this.oldDbDynSql && this.oldDbDynSql != this.sqlForm.dbDynSql) {
        this.reportSql = true;
      } else {
        this.saveDb();
      }
    },
    saveDb: function saveDb() {
      var _this6 = this;

      this.$refs.sqlForm.validate(function (valid) {
        if (valid) {
          //保存表单
          var reportDb = {};
          reportDb.id = _this6.sqlForm.id;
          reportDb.jimuReportId = excel_config_id;
          reportDb.dbCode = _this6.sqlForm.dbCode;
          reportDb.dbChName = _this6.sqlForm.dbChName;
          reportDb.dbType = _this6.sqlForm.dbType;
          reportDb.dbSource = _this6.sqlForm.dbSource;

          if (_this6.sqlForm.isList) {
            reportDb.isList = "1";
          } else {
            reportDb.isList = "0";
            reportDb.isPage = "0";
          }

          if (_this6.sqlForm.isPage) {
            /*if (this.addIsPage){
                    reportDb.isPage = '0'
                } else {
                    reportDb.isPage = '1'
                }*/
            reportDb.isPage = "1";
            reportDb.isList = "1";
          } else {
            reportDb.isPage = "0";
          }

          if (_this6.sqlForm.dbType == "0") {
            reportDb.dbDynSql = _this6.sqlForm.dbDynSql;
          } else {
            reportDb.apiUrl = _this6.sqlForm.apiUrl;
            reportDb.apiMethod = _this6.sqlForm.apiMethod;
          }

          reportDb.fieldList = _this6.tab1.data; //解析出表字段

          reportDb.paramList = _this6.tab2.data; //动态表单参数

          $http.post({
            url: api.saveDb,
            contentType: "json",
            data: JSON.stringify(reportDb),
            success: function success(res) {
              _this6.$emit("saveback", res.id);

              for (var key in _this6.sqlForm) {
                _this6.sqlForm[key] = "";
              }

              _this6.sqlForm.isPage = false;
              _this6.sqlForm.apiMethod = "0";
              _this6.tab1.data = [];
              _this6.tab2.data = [];
              _this6.sqlModal = false;
              _this6.oldDbDynSql = "";
              _this6.tab2.selectParamTables = [];
            },
            finally: function _finally() {
              setTimeout(function () {
                _this6.loading = false;

                _this6.$nextTick(function () {
                  _this6.loading = true;
                });
              }, 500);
            }
          });
          return;
        } else {
          setTimeout(function () {
            _this6.loading = false;

            _this6.$nextTick(function () {
              _this6.loading = true;
            });
          }, 500);
          return;
        }
      });
    },
    isListChange: function isListChange(isList) {
      if (!isList) {
        this.sqlForm.isPage = false;
      }
    },
    checkChange: function checkChange(ispage) {
      var _this7 = this;

      if (ispage) {
        $http.get({
          url: api.queryIsPage(excel_config_id),
          success: function success(result) {
            if (result) {
              _this7.$Modal.confirm({
                content: "已有数据集分页,是否更改?",
                onOk: function onOk() {
                  _this7.sqlForm.isPage = true;
                  _this7.sqlForm.isList = true;
                },
                onCancel: function onCancel() {
                  _this7.sqlForm.isPage = false;
                }
              });
            }
          }
        });
      }
    },
    selectdbSource: function selectdbSource(val) {
      //this.clearSqlForm()
      this.sqlForm.dbSource = val;
      /*加载数据源的表信息*/

      this.handleDbSourceTable();
    },
    clearSqlForm: function clearSqlForm() {
      this.sqlForm.dbDynSql = "";
      this.tab1.data = [];
      this.tab2.data = [];
    },
    handleDbSourceTable: function handleDbSourceTable() {
      var _this8 = this;

      this.tableList = [];
      var dbSource = this.sqlForm.dbSource;

      if (!dbSource) {
        return;
      }

      $http.post({
        url: api.loadTable,
        data: {
          dbSource: dbSource
        },
        success: function success(result) {
          _this8.tableList = result; //存在dbDynSql，就是编辑的状态

          if (_this8.sqlForm.dbDynSql) {
            var form_number = _this8.sqlForm.dbDynSql.indexOf("from ");

            var where_number = _this8.sqlForm.dbDynSql.indexOf(" where");

            var tableName = (where_number > -1 ? _this8.sqlForm.dbDynSql.substring(form_number + 4, where_number) : _this8.sqlForm.dbDynSql.substring(form_number + 4)).trim();
            _this8.selectTableName = tableName;
            _this8.currentIndex = _this8.tableList.findIndex(function (item) {
              return item.Name === tableName;
            });
            /*this.$nextTick(() => {
                    document.getElementById(this.currentIndex+'').scrollIntoView()
                })*/
          }
        }
      });
    },
    tableNameClick: function tableNameClick(item, index) {
      this.currentIndex = index;
      this.tabValue = "1";
      var sql = "select *  from " + item.Name;
      this.sqlForm.dbDynSql = sql;
      this.selectTableName = item.Name;
    },
    sourceManage: function sourceManage() {
      this.sourceModal = true;
    },
    handleSQLAnalyze: function handleSQLAnalyze() {
      var _this9 = this;

      var dbDynSql = this.sqlForm.dbDynSql;
      var dbSource = this.sqlForm.dbSource;

      if (!dbDynSql) {
        return;
      }

      if (dbDynSql.indexOf("where") != -1) {
        dbDynSql = dbDynSql.substr(0, dbDynSql.indexOf("where"));
      }

      $http.post({
        url: api.executeSelectSql,
        data: {
          sql: dbDynSql,
          dbSource: dbSource
        },
        success: function success(result) {
          _this9.tab1.data = result;

          _this9.tab1.data.forEach(function (item, index) {
            item.tableIndex = index + 1;
          });
        }
      });
    },
    handleApiAnalyze: function handleApiAnalyze() {
      var _this10 = this;

      var dbDynApi = this.sqlForm.apiUrl;

      if (!dbDynApi) {
        return;
      }

      if (dbDynApi.indexOf("?") != -1) {
        dbDynApi = dbDynApi.substr(0, dbDynApi.indexOf("?"));
      }

      var apiMethod = this.sqlForm.apiMethod;
      $http.post({
        url: api.executeSelectApi,
        data: {
          api: dbDynApi,
          method: apiMethod
        },
        success: function success(result) {
          _this10.tab1.data = result;

          _this10.tab1.data.forEach(function (item, index) {
            item.tableIndex = index + 1;
          });
        }
      });
    },
    removeFieldTable: function removeFieldTable() {
      this.deleteFieldModel = true;
    },
    selectFieldAll: function selectFieldAll() {
      this.tab1.selectParamTables = this.tab1.data.map(function (item) {
        return {
          tableIndex: item.tableIndex,
          id: item.id
        };
      });
    },
    cancelFieldAll: function cancelFieldAll() {
      this.tab1.selectParamTables = [];
    },
    selectField: function selectField(selection, row) {
      this.tab1.selectParamTables = [].concat(Object(toConsumableArray["a" /* default */])(this.tab1.selectParamTables), [{
        tableIndex: row.tableIndex,
        id: row.id
      }]);
    },
    cancelField: function cancelField(selection, row) {
      this.tab1.selectParamTables = this.tab1.selectParamTables.filter(function (item) {
        return item.tableIndex != row.tableIndex;
      });
    },
    dbDynSqlBlur: function dbDynSqlBlur() {
      //获得原数据Map
      var dataMap = {};

      if (this.tab2.data && this.tab2.data.length > 0) {
        this.tab2.data.forEach(function (item) {
          dataMap[item.paramName] = item;
        });
      }

      var dbDynSql = this.sqlForm.dbDynSql;
      var reg = /\$\{(\S+)\}/g;

      if (!reg.test(dbDynSql)) {
        return;
      }

      var dbDynSqlArr = dbDynSql.match(reg);
      var paramsArr = [];

      if (dbDynSqlArr && dbDynSqlArr.length > 0) {
        var maxOrderNum = 1;
        dbDynSqlArr.forEach(function (item, index) {
          item = item.replace("${", "").replace("}", "").trim();
          var paramObj = {};
          paramObj.paramName = item;
          paramObj.paramTxt = item;
          paramObj.orderNum = maxOrderNum++;
          paramObj.tableIndex = paramObj.orderNum;
          var oldItem = dataMap[item];
          paramObj.id = oldItem && oldItem.id || "";
          paramObj.paramValue = oldItem && oldItem.paramValue || "";
          paramsArr.push(paramObj);
        });
      }

      this.tab2.data = [].concat(paramsArr);
    },
    //API解析
    dbApiBlur: function dbApiBlur() {
      //获得原数据Map
      var dataMap = {};

      if (this.tab2.data && this.tab2.data.length > 0) {
        this.tab2.data.forEach(function (item) {
          dataMap[item.paramName] = item;
        });
      }

      var apiUrl = this.sqlForm.apiUrl; //判断是否包含问号

      if (apiUrl.indexOf("?") == -1) {
        this.tab2.data = [];
        return;
      }

      var apiUrlArr = apiUrl.substr(apiUrl.indexOf("?"), apiUrl.length - 1); //去除?和&

      var urlArr = apiUrlArr.split(/[?&]/);
      var paramsArr = [];

      if (urlArr && urlArr.length > 0) {
        var maxOrderNum = 1;
        urlArr.forEach(function (item, index) {
          if (item.indexOf("=") != -1) {
            var strings = item.split("=");
            item = item.substr(0, item.indexOf("="));
            item = item.replace("${", "").replace("}", "").trim();
            var paramObj = {};
            paramObj.paramName = item;
            paramObj.paramTxt = item;
            paramObj.orderNum = maxOrderNum++;
            paramObj.tableIndex = paramObj.orderNum;
            var oldItem = dataMap[item];
            paramObj.id = oldItem && oldItem.id || "";
            paramObj.paramValue = oldItem && oldItem.paramValue || "";
            paramsArr.push(paramObj);
          }
        });
        this.tab2.data = [].concat(paramsArr);
      }
    },
    addParamTable: function addParamTable() {
      var indexArr = this.tab2.data.map(function (item) {
        return item.tableIndex;
      });
      var orderNumArr = this.tab2.data.map(function (item) {
        return item.orderNum;
      });

      if (indexArr.length == 0) {
        indexArr = [0];
      }

      if (orderNumArr.length == 0) {
        orderNumArr = [0];
      }

      this.tab2.selectParamTables = [];
      this.tab2.data = [].concat(Object(toConsumableArray["a" /* default */])(this.tab2.data), [{
        paramName: "",
        paramTxt: "",
        paramValue: "",
        orderNum: Math.max.apply(Math, Object(toConsumableArray["a" /* default */])(orderNumArr)) + 1,
        tableIndex: Math.max.apply(Math, Object(toConsumableArray["a" /* default */])(indexArr)) + 1
      }]);
    },
    removeParamTable: function removeParamTable() {
      this.deleteParamModel = true;
    },
    deleteParamTable: function deleteParamTable() {
      if (this.sqlForm.dbType == 0) {
        var tableIndexArr = this.tab2.selectParamTables.map(function (item) {
          return item.tableIndex;
        });
        this.tab2.data = this.tab2.data.filter(function (item) {
          return !tableIndexArr.includes(item.tableIndex);
        });
        var selectTableObj = this.tab2.selectParamTables.filter(function (item) {
          return item.id;
        });
        var selectIds = selectTableObj.map(function (item) {
          return item.id;
        });
        this.tab2.selectParamTables = [];
        var dbDynSql = this.sqlForm.dbDynSql;
        dbDynSql = dbDynSql.substring(0, dbDynSql.indexOf("where"));
        var paramArr = [];

        if (this.tab2.data.length > 0) {
          dbDynSql = dbDynSql + " where ";
          this.tab2.data.forEach(function (item) {
            var paramName = "${item.paramName}";
            paramArr.push("${paramName}='" + "${" + paramName + "}'");
          });
        }

        dbDynSql = dbDynSql + paramArr.join(" and ");
        this.sqlForm.dbDynSql = dbDynSql.trim();
        var deleParams = {
          selectIds: selectIds,
          id: this.sqlForm.id,
          dbDynSql: dbDynSql
        }; //后台删除,保存时删除

        if (selectIds.length > 0) {
          $http.post({
            url: api.deleteParamByIds,
            contentType: "json",
            data: JSON.stringify(deleParams),
            success: function success(result) {}
          });
        }
      } else {
        var apiUrl = this.sqlForm.apiUrl;
        var newApiUrl = [];

        if (apiUrl.indexOf("?") != -1) {
          newApiUrl = apiUrl.substr(apiUrl.indexOf("?"), apiUrl.length - 1).split(/[?&]/);
        }

        var _tableIndexArr = this.tab2.selectParamTables.map(function (item) {
          return item.tableIndex;
        });

        var data = this.tab2.data;
        var newData = [];

        var _iterator = Object(createForOfIteratorHelper["a" /* default */])(data),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;

            if (!_tableIndexArr.includes(item.tableIndex)) {
              newData.push(item);
            } else {
              var pageName = item.paramName;

              if (pageName && newApiUrl.length > 1) {
                for (var i = 0; i < newApiUrl.length; i++) {
                  if (newApiUrl[i].includes(pageName)) {
                    newApiUrl.splice(i, 1);
                  }
                }
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var apiUrlArr = apiUrl.substr(0, apiUrl.indexOf("?") + 1);

        if (newApiUrl.length > 1) {
          var _iterator2 = Object(createForOfIteratorHelper["a" /* default */])(newApiUrl),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _api = _step2.value;

              if (_api) {
                apiUrlArr = apiUrlArr + _api + "&";
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          apiUrlArr = apiUrlArr.substr(0, apiUrlArr.length - 1);
          this.sqlForm.apiUrl = apiUrlArr;
        } else {
          this.sqlForm.apiUrl = apiUrl.substr(0, apiUrl.indexOf("?"));
        }

        this.tab2.data = newData;
      }

      this.tab2.selectParamTables = [];
    }
  }, Object(defineProperty["a" /* default */])(_methods, "removeFieldTable", function removeFieldTable() {
    this.deleteFieldModel = true;
  }), Object(defineProperty["a" /* default */])(_methods, "deleteFieldTable", function deleteFieldTable() {
    var tableIndexArr = this.tab1.selectParamTables.map(function (item) {
      return item.tableIndex;
    });
    this.tab1.data = this.tab1.data.filter(function (item) {
      return !tableIndexArr.includes(item.tableIndex);
    });
    var selectTableObj = this.tab1.selectParamTables.filter(function (item) {
      return item.id;
    });
    var selectIds = selectTableObj.map(function (item) {
      return item.id;
    });
    this.tab1.selectParamTables = [];

    if (selectIds.length > 0) {
      var deleParams = "";

      var _iterator3 = Object(createForOfIteratorHelper["a" /* default */])(selectIds),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var str = _step3.value;
          deleParams = deleParams + str + ",";
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      deleParams = deleParams.substr(0, deleParams.lastIndexOf(","));
      $http.del({
        contentType: "json",
        url: api.deleteFieldByIds,
        data: deleParams,
        success: function success(result) {}
      });
    }
  }), Object(defineProperty["a" /* default */])(_methods, "selectParamAll", function selectParamAll() {
    this.tab2.selectParamTables = this.tab2.data.map(function (item) {
      return {
        tableIndex: item.tableIndex,
        id: item.id
      };
    });
  }), Object(defineProperty["a" /* default */])(_methods, "cancelParamAll", function cancelParamAll() {
    this.tab2.selectParamTables = [];
  }), Object(defineProperty["a" /* default */])(_methods, "selectParam", function selectParam(selection, row) {
    this.tab2.selectParamTables = [].concat(Object(toConsumableArray["a" /* default */])(this.tab2.selectParamTables), [{
      tableIndex: row.tableIndex,
      id: row.id
    }]);
  }), Object(defineProperty["a" /* default */])(_methods, "cancelParam", function cancelParam(selection, row) {
    this.tab2.selectParamTables = this.tab2.selectParamTables.filter(function (item) {
      return item.tableIndex != row.tableIndex;
    });
  }), Object(defineProperty["a" /* default */])(_methods, "saveSourceDb", function saveSourceDb() {
    this.sourceModal = false;
  }), Object(defineProperty["a" /* default */])(_methods, "addDataSource", function addDataSource() {
    var _this11 = this;

    Object.keys(this.dataSource).map(function (k) {
      _this11.dataSource[k] = "";
    });
    this.visibleData = true;
  }), Object(defineProperty["a" /* default */])(_methods, "selectdbType", function selectdbType(name) {
    if (name === "MYSQL5.7") {
      this.dataSource.dbDriver = "com.mysql.cj.jdbc.Driver";
      this.dataSource.dbUrl = "jdbc:mysql://127.0.0.1:3306/jeecg-boot?useUnicode=true&characterEncoding=UTF-8&serverTimezone=GMT%2B8";
    } else if (name === "MYSQL5.5") {
      this.dataSource.dbDriver = "com.mysql.jdbc.Driver";
      this.dataSource.dbUrl = "jdbc:mysql://127.0.0.1:3306/jeecg-boot?characterEncoding=UTF-8&useUnicode=true&useSSL=false&serverTimezone=GMT%2B8";
    } else if (name === "ORACLE") {
      this.dataSource.dbDriver = "oracle.jdbc.OracleDriver";
      this.dataSource.dbUrl = "jdbc:oracle:thin:@127.0.0.1:1521:ORCL";
    } else if (name === "SQLSERVER") {
      this.dataSource.dbDriver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
      this.dataSource.dbUrl = "jdbc:sqlserver://127.0.0.1:1433;SelectMethod=cursor;DatabaseName=jeecgboot";
    } else if (name === "POSTGRESQL") {
      this.dataSource.dbDriver = "org.postgresql.Driver";
      this.dataSource.dbUrl = "jdbc:postgresql://127.0.0.1:5432/jeecg-boot";
    }
  }), Object(defineProperty["a" /* default */])(_methods, "clearDbSou", function clearDbSou() {
    this.$refs.dataSource.resetFields();
    this.initDataSource();
  }), Object(defineProperty["a" /* default */])(_methods, "saveDataSource", function saveDataSource() {
    var _this12 = this;

    this.$refs.dataSource.validate(function (valid) {
      if (valid) {
        //保存表单
        var dbSource = {};
        dbSource.id = _this12.dataSource.id;
        dbSource.reportId = excel_config_id;
        dbSource.code = _this12.dataSource.code;
        dbSource.name = _this12.dataSource.name;
        dbSource.dbType = _this12.dataSource.dbType;
        dbSource.dbDriver = _this12.dataSource.dbDriver;
        dbSource.dbUrl = _this12.dataSource.dbUrl;
        dbSource.dbUsername = _this12.dataSource.dbUsername;
        dbSource.dbPassword = _this12.dataSource.dbPassword;
        $http.post({
          contentType: "json",
          url: api.addDataSource,
          data: JSON.stringify(dbSource),
          success: function success(result) {
            _this12.initDataSource();

            _this12.dataSource = {};
            _this12.visibleData = false;
          }
        });
        return;
      } else {
        setTimeout(function () {
          _this12.loading = false;

          _this12.$nextTick(function () {
            _this12.loading = true;
          });
        }, 500);
        return;
      }
    });
  }), Object(defineProperty["a" /* default */])(_methods, "initDataSource", function initDataSource() {
    var _this13 = this;

    $http.get({
      url: api.initDataSource,
      success: function success(result) {
        var reportResult = result;

        if (!reportResult) {
          return;
        }

        _this13.sourceTab.data = reportResult;

        _this13.sourceTab.data.forEach(function (item, index) {
          item.tableIndex = index + 1;
        });
      }
    });
  }), Object(defineProperty["a" /* default */])(_methods, "renderButton", function renderButton(h, params) {
    var _this14 = this;

    return h("div", [h("i-button", {
      props: {
        type: "primary",
        size: "small"
      },
      style: {
        "margin-right": "5px"
      },
      on: {
        click: function click() {
          _this14.sourceTab.data.forEach(function (item) {
            if (item.id === params.row.id) {
              _this14.dataSource = item;
            }
          });

          _this14.visibleData = true;
        }
      }
    }, "编辑"), h("i-button", {
      props: {
        type: "primary",
        size: "small"
      },
      on: {
        click: function click() {
          _this14.$Modal.confirm({
            title: "提示",
            content: "是否确认删除?",
            onOk: function onOk() {
              var dbSource = {};
              dbSource.id = params.row.id;
              $http.post({
                contentType: "json",
                url: api.delDataSource,
                data: JSON.stringify(dbSource),
                success: function success(result) {
                  _this14.$Notice.success({
                    title: "删除成功"
                  });

                  _this14.initDataSource();
                }
              });
            }
          });
        }
      }
    }, "删除")]);
  }), Object(defineProperty["a" /* default */])(_methods, "renderInput", function renderInput(h, params, field, tabIndex) {
    var _this15 = this;

    return h("i-input", {
      props: {
        size: "small",
        type: "text",
        value: this[tabIndex].data[params.index][field],
        placeholder: "\u8BF7\u8F93\u5165" + params.column.title
      },
      on: {
        "on-blur": function onBlur(event) {
          if (tabIndex === "tab2") {
            var tableIndexArr = _this15.tab2.selectParamTables.map(function (item) {
              return item.tableIndex;
            });

            _this15.tab2.data.forEach(function (item) {
              if (tableIndexArr.includes(item.tableIndex)) {
                item._checked = true;
              }
            });
          }

          _this15[tabIndex].data[params.index][field] = event.target.value;
        }
      }
    });
  }), Object(defineProperty["a" /* default */])(_methods, "dataSourceTest", function dataSourceTest() {
    var dbSource = {};
    dbSource.dbType = this.dataSource.dbType;
    dbSource.dbDriver = this.dataSource.dbDriver;
    dbSource.dbUrl = this.dataSource.dbUrl;
    dbSource.dbName = this.dataSource.dbName;
    dbSource.dbUsername = this.dataSource.dbUsername;
    dbSource.dbPassword = this.dataSource.dbPassword;
    $http.post({
      contentType: "json",
      url: api.testConnection,
      data: JSON.stringify(dbSource)
    });
  }), Object(defineProperty["a" /* default */])(_methods, "forwardClick", function forwardClick(val) {
    this.forward = val;
  }), Object(defineProperty["a" /* default */])(_methods, "reportOk", function reportOk() {
    this.reportSql = false;
    this.saveDb();
  }), Object(defineProperty["a" /* default */])(_methods, "reportCancel", function reportCancel() {
    var _this16 = this;

    this.reportSql = false;
    this.sqlModal = true;
    setTimeout(function () {
      _this16.loading = false;

      _this16.$nextTick(function () {
        _this16.loading = true;
      });
    }, 500);
  }), Object(defineProperty["a" /* default */])(_methods, "createParams", function createParams() {
    var tabData = this.tab2.data;
    var apiUrl = this.sqlForm.apiUrl;

    if (apiUrl.includes("?")) {
      apiUrl = apiUrl.substr(0, apiUrl.indexOf("?"));
    }

    var _iterator4 = Object(createForOfIteratorHelper["a" /* default */])(tabData),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var argument = _step4.value;
        var paramName = argument.paramName;
        var paramTxt = argument.paramTxt;
        var s = paramName + "=$" + "{" + paramTxt + "}";

        if (s && !apiUrl.includes(s)) {
          if (apiUrl.includes("?")) {
            apiUrl = apiUrl + "&" + paramName + "=" + "'$" + "{" + paramName + "}'";
          } else {
            apiUrl = apiUrl + "?" + paramName + "=" + "'$" + "{" + paramName + "}'";
          }
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    this.sqlForm.apiUrl = apiUrl;
  }), _methods)
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartDatasourceSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartDatasourceSettingvue_type_script_lang_js_ = (ChartDatasourceSettingvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/setting/chart/ChartDatasourceSetting.vue?vue&type=style&index=0&id=63fb805c&scoped=true&lang=css&
var ChartDatasourceSettingvue_type_style_index_0_id_63fb805c_scoped_true_lang_css_ = __webpack_require__("36c9");

// CONCATENATED MODULE: ./src/components/setting/chart/ChartDatasourceSetting.vue






/* normalize component */

var ChartDatasourceSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartDatasourceSettingvue_type_script_lang_js_,
  ChartDatasourceSettingvue_type_template_id_63fb805c_scoped_true_render,
  ChartDatasourceSettingvue_type_template_id_63fb805c_scoped_true_staticRenderFns,
  false,
  null,
  "63fb805c",
  null
  
)

/* harmony default export */ var ChartDatasourceSetting = (ChartDatasourceSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartCentralPointSetting.vue?vue&type=template&id=8cdfd518&scoped=true&
var ChartCentralPointSettingvue_type_template_id_8cdfd518_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('Submenu',{staticStyle:{"border-bottom":"inset 1px"},attrs:{"name":"5"}},[_c('template',{slot:"title"},[_vm._v(" 中心点设置 ")]),_c('div',{staticClass:"blockDiv",staticStyle:{"padding-bottom":"10px"}},[_c('Row',{staticClass:"ivurow"},[_c('p',{staticClass:"config-item-title"},[_vm._v("x轴 ")]),_c('i-input',{staticStyle:{"width":"120px","margin-left":"5px"},attrs:{"size":"small","type":"number","value":_vm.centralPoint.center[0]},on:{"on-change":_vm.onMarginChange},model:{value:(_vm.centralPoint.center[0]),callback:function ($$v) {_vm.$set(_vm.centralPoint.center, 0, $$v)},expression:"centralPoint.center[0]"}})],1),_c('Row',{staticClass:"ivurow"},[_c('p',{staticStyle:{"margin-bottom":"10px"}},[_vm._v("y轴 ")]),_c('i-input',{staticStyle:{"width":"120px","margin-left":"5px"},attrs:{"size":"small","type":"number","value":_vm.centralPoint.center[1]},on:{"on-change":_vm.onMarginChange},model:{value:(_vm.centralPoint.center[1]),callback:function ($$v) {_vm.$set(_vm.centralPoint.center, 1, $$v)},expression:"centralPoint.center[1]"}})],1)],1)],2)}
var ChartCentralPointSettingvue_type_template_id_8cdfd518_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/chart/ChartCentralPointSetting.vue?vue&type=template&id=8cdfd518&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/chart/ChartCentralPointSetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChartCentralPointSettingvue_type_script_lang_js_ = ({
  name: "chart-central-point-setting",
  props: {
    settings: {
      type: Object,
      required: true,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      centralPoint: {
        center: []
      }
    };
  },
  watch: {
    settings: {
      deep: true,
      immediate: true,
      handler: function handler() {
        this.initData();
      }
    }
  },
  methods: {
    initData: function initData() {
      if (this.settings) {
        this.centralPoint = Object.assign(this.centralPoint, this.settings);
      }
    },
    onMarginChange: function onMarginChange() {
      this.$emit("change", this.centralPoint);
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/chart/ChartCentralPointSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var chart_ChartCentralPointSettingvue_type_script_lang_js_ = (ChartCentralPointSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/chart/ChartCentralPointSetting.vue





/* normalize component */

var ChartCentralPointSetting_component = Object(componentNormalizer["a" /* default */])(
  chart_ChartCentralPointSettingvue_type_script_lang_js_,
  ChartCentralPointSettingvue_type_template_id_8cdfd518_scoped_true_render,
  ChartCentralPointSettingvue_type_template_id_8cdfd518_scoped_true_staticRenderFns,
  false,
  null,
  "8cdfd518",
  null
  
)

/* harmony default export */ var ChartCentralPointSetting = (ChartCentralPointSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/extend/FunctionInterpretationSetting.vue?vue&type=template&id=cc4b8aa0&scoped=true&
var FunctionInterpretationSettingvue_type_template_id_cc4b8aa0_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.text == 'SUM')?_c('div',{staticClass:"interpretation"},[_c('p',[_vm._v("函数描述： 对可单元格或集合表达式求最大值")]),_c('p',[_vm._v("示例：")]),_c('p',[_vm._v("例1：SUM(C6),对C6单元格或数据集合求最大值")]),_c('p',[_vm._v("例2：SUM(A6,C6)，对A6和C6单元格计算最大值")]),_c('p',[_vm._v("例3：SUM(A6:C6)，对A6到C6单元格计算最大值")])]):_vm._e(),(_vm.text == 'DBSUM')?_c('div',{staticClass:"interpretation"},[_c('p',[_vm._v("函数描述： 对可扩展单元格集合所有数据进行求和")]),_c('p',[_vm._v("示例：")]),_c('p',[_vm._v("DBSUM（a.name）,a.name 这个单元格所有数据求和")])]):_vm._e(),(_vm.text == 'AVERAGE')?_c('div',{staticClass:"interpretation"},[_c('p',[_vm._v("函数描述： 对可单元格或集合表达式求平均值")]),_c('p',[_vm._v("示例：")]),_c('p',[_vm._v("例1：AVERAGE(C6),对C6单元格或数据集合求平均值")]),_c('p',[_vm._v("例2：AVERAGE(A6,C6)，对A6和C6单元格计算平均值")]),_c('p',[_vm._v("例3：AVERAGE(A6:C6)，对A6到C6单元格计算平均值")])]):_vm._e(),(_vm.text == 'DBAVERAGE')?_c('div',{staticClass:"interpretation"},[_c('p',[_vm._v("函数描述： 对可扩展单元格集合所有数据进行求平均值")]),_c('p',[_vm._v("示例：")]),_c('p',[_vm._v(" DBAVERAGE(db.salary)，对编码为db的数据集中的字段salary进行平均值计算 ")])]):_vm._e(),(_vm.text == 'MAX')?_c('div',{staticClass:"interpretation"},[_c('p',[_vm._v("函数描述： 对可单元格或集合表达式求最大值")]),_c('p',[_vm._v("示例：")]),_c('p',[_vm._v("例1：MAX(C6),对C6单元格或数据集合求最大值")]),_c('p',[_vm._v("例2：MAX(A6,C6)，对A6和C6单元格计算最大值")]),_c('p',[_vm._v("例3：MAX(A6:C6)，对A6到C6单元格计算最大值")])]):_vm._e(),(_vm.text == 'DBMAX')?_c('div',{staticClass:"interpretation"},[_c('p',[_vm._v("函数描述： 对可扩展单元格集合所有数据进行求最大值")]),_c('p',[_vm._v("示例：")]),_c('p',[_vm._v("DBMAX(db.salary)，对编码为db的数据集中的字段salary进行最大值计算")])]):_vm._e(),(_vm.text == 'MIN')?_c('div',{staticClass:"interpretation"},[_c('p',[_vm._v("函数描述： 对可单元格或集合表达式求最小值")]),_c('p',[_vm._v("示例：")]),_c('p',[_vm._v("例1：MIN(C6),对C6单元格或数据集合求最小值")]),_c('p',[_vm._v("例2：MIN(A6,C6)，对A6和C6单元格计算最小值")]),_c('p',[_vm._v("例3：MIN(A6:C6)，对A6到C6单元格计算最小值")])]):_vm._e(),(_vm.text == 'DBMIN')?_c('div',{staticClass:"interpretation"},[_c('p',[_vm._v("函数描述： 对可扩展单元格集合所有数据进行求最小值；")]),_c('p',[_vm._v("示例：")]),_c('p',[_vm._v("DBMIN(db.salary)，对编码为db的数据集中的字段salary进行最小值计算")])]):_vm._e()])}
var FunctionInterpretationSettingvue_type_template_id_cc4b8aa0_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/extend/FunctionInterpretationSetting.vue?vue&type=template&id=cc4b8aa0&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/extend/FunctionInterpretationSetting.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var FunctionInterpretationSettingvue_type_script_lang_js_ = ({
  name: "function-interpretation-setting",
  props: {
    text: {
      type: String,
      required: true,
      default: ""
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/extend/FunctionInterpretationSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var extend_FunctionInterpretationSettingvue_type_script_lang_js_ = (FunctionInterpretationSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/setting/extend/FunctionInterpretationSetting.vue





/* normalize component */

var FunctionInterpretationSetting_component = Object(componentNormalizer["a" /* default */])(
  extend_FunctionInterpretationSettingvue_type_script_lang_js_,
  FunctionInterpretationSettingvue_type_template_id_cc4b8aa0_scoped_true_render,
  FunctionInterpretationSettingvue_type_template_id_cc4b8aa0_scoped_true_staticRenderFns,
  false,
  null,
  "cc4b8aa0",
  null
  
)

/* harmony default export */ var FunctionInterpretationSetting = (FunctionInterpretationSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2b36525a-vue-loader-template"}!./node_modules/_vue-loader@15.9.6@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/extend/DataDictionarySetting.vue?vue&type=template&id=366d0569&scoped=true&
var DataDictionarySettingvue_type_template_id_366d0569_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"dictClass"},[_c('Modal',{attrs:{"loading":_vm.loading,"width":"100%","title":_vm.moduleTitle,"fullscreen":true},model:{value:(_vm.dictShow),callback:function ($$v) {_vm.dictShow=$$v},expression:"dictShow"}},[_c('div',{attrs:{"slot":"footer"},slot:"footer"},[_c('i-button',{on:{"click":_vm.close}},[_vm._v("关闭")])],1),_c('div',{staticStyle:{"margin-top":"10px"}},[_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.dictClick}},[_vm._v("添加")]),_c('i-button',{attrs:{"icon":"ios-loading","type":"primary"},on:{"click":_vm.dictReflesh}},[_vm._v("刷新缓存")]),_c('i-button',{attrs:{"icon":"ios-trash","type":"primary"},on:{"click":_vm.recycleBinClick}},[_vm._v("回收站")]),(_vm.dictDeleteShow == true)?_c('i-button',{attrs:{"type":"error"},on:{"click":_vm.dictDeleteBatch}},[_vm._v("删除")]):_vm._e()],1),_c('div',{staticStyle:{"margin-top":"10px"}},[_c('i-table',{staticStyle:{"margin-top":"1%"},attrs:{"border":"","stripe":"","columns":_vm.dictData.columns,"data":_vm.dictData.data},on:{"on-selection-change":_vm.dictTableSelect},scopedSlots:_vm._u([{key:"action",fn:function(ref){
var row = ref.row;
var index = ref.index;
return [_c('i-button',{attrs:{"type":"primary","size":"small"},on:{"click":function($event){return _vm.editDict(row)}}},[_vm._v("编辑")]),_c('i-button',{attrs:{"type":"primary","size":"small"},on:{"click":function($event){return _vm.dictConfig(row.id)}}},[_vm._v("字典配置")]),_c('Poptip',{attrs:{"confirm":"","placement":"bottom","title":"确定要删除吗?","transfer":true},on:{"on-ok":function($event){return _vm.dictRemove(row)}}},[_c('i-button',{attrs:{"type":"error","size":"small"}},[_vm._v("删除")])],1)]}}])}),_c('div',{staticClass:"page"},[_c('Page',{attrs:{"total":_vm.dictData.page.total,"show-total":"","show-elevator":""},on:{"on-change":_vm.handleCurrentChange,"on-page-size-change":_vm.handleSizeChange}})],1)],1),_c('Modal',{attrs:{"width":"36%","title":_vm.dictTitle,"mask-closable":false},model:{value:(_vm.createDictShow),callback:function ($$v) {_vm.createDictShow=$$v},expression:"createDictShow"}},[_c('div',{attrs:{"slot":"footer"},slot:"footer"},[_c('i-button',{on:{"click":function($event){return _vm.cancelReset('dictModel')}}},[_vm._v("取消")]),_c('i-button',{attrs:{"loading":_vm.createDictLoading,"type":"primary"},on:{"click":function($event){return _vm.createDictOk('dictModel')}}},[_vm._v("确定")])],1),_c('i-form',{ref:"dictModel",staticClass:"dict",attrs:{"model":_vm.dictModel,"rules":_vm.dictModelRule,"label-width":100}},[_c('form-item',{attrs:{"label":"字典名称:","prop":"dictName"}},[_c('i-input',{attrs:{"placeholder":"请填写字典名称"},model:{value:(_vm.dictModel.dictName),callback:function ($$v) {_vm.$set(_vm.dictModel, "dictName", $$v)},expression:"dictModel.dictName"}})],1),_c('form-item',{attrs:{"label":"字典编码:","prop":"dictCode"}},[_c('i-input',{attrs:{"placeholder":"请填写字典编码"},model:{value:(_vm.dictModel.dictCode),callback:function ($$v) {_vm.$set(_vm.dictModel, "dictCode", $$v)},expression:"dictModel.dictCode"}})],1),_c('form-item',{attrs:{"label":"描述:","prop":"description"}},[_c('i-input',{model:{value:(_vm.dictModel.description),callback:function ($$v) {_vm.$set(_vm.dictModel, "description", $$v)},expression:"dictModel.description"}})],1)],1)],1),_c('Modal',{attrs:{"width":"50%","title":"回收站","mask-closable":false},model:{value:(_vm.recycleBinShow),callback:function ($$v) {_vm.recycleBinShow=$$v},expression:"recycleBinShow"}},[_c('div',{attrs:{"slot":"footer"},slot:"footer"},[_c('i-button',{on:{"click":_vm.recycleBinReset}},[_vm._v("关闭")])],1),_c('div',{staticStyle:{"margin-top":"10px"}},[_c('i-table',{staticStyle:{"margin-top":"1%"},attrs:{"border":"","stripe":"","columns":_vm.recycleBin.columns,"data":_vm.recycleBin.data},scopedSlots:_vm._u([{key:"action",fn:function(ref){
var row = ref.row;
var index = ref.index;
return [_c('i-button',{staticStyle:{"cursor":"pointer"},attrs:{"type":"primary","size":"small"},on:{"click":function($event){return _vm.recycleBinRetrieve(row.id)}}},[_vm._v("取回")]),_c('Poptip',{attrs:{"confirm":"","placement":"bottom","title":"确定要彻底删除吗","content":"删除之后不可取回","transfer":true},on:{"on-ok":function($event){return _vm.recycleBinDelete(row.id)}}},[_c('i-button',{attrs:{"type":"error","size":"small"}},[_vm._v("彻底删除")])],1)]}}])})],1)]),_c('Drawer',{staticClass:"dictDrawer",attrs:{"transfer":true,"width":"500","title":"字典类表","closable":false},model:{value:(_vm.itemDrawer),callback:function ($$v) {_vm.itemDrawer=$$v},expression:"itemDrawer"}},[_c('div',{staticStyle:{"margin-top":"10px"}},[_c('i-button',{attrs:{"type":"primary"},on:{"click":_vm.dictItemClick}},[_vm._v("添加")])],1),_c('div',{staticStyle:{"margin-top":"10px"}},[_c('i-table',{staticStyle:{"margin-top":"1%"},attrs:{"border":"","stripe":"","columns":_vm.dictItemList.columns,"data":_vm.dictItemList.data,"rowClassName":_vm.getRowClassname},scopedSlots:_vm._u([{key:"action",fn:function(ref){
var row = ref.row;
var index = ref.index;
return [_c('i-button',{attrs:{"type":"primary","size":"small"},on:{"click":function($event){return _vm.editItemDict(row)}}},[_vm._v("编辑")]),_c('Poptip',{attrs:{"confirm":"","placement":"bottom","title":"确定要删除吗?","transfer":true},on:{"on-ok":function($event){return _vm.dictItemRemove(row)}}},[_c('i-button',{attrs:{"type":"error","size":"small"}},[_vm._v("删除")])],1)]}}])}),_c('div',{staticClass:"page"},[_c('Page',{attrs:{"total":_vm.dictItemList.page.total,"show-total":"","show-elevator":""},on:{"on-change":_vm.handleItemCurrentChange,"on-page-size-change":_vm.handleItemSizeChange}})],1)],1)]),_c('Modal',{attrs:{"width":"50%","title":_vm.dictItemTitle,"class-name":"dictItem"},model:{value:(_vm.createDictItemShow),callback:function ($$v) {_vm.createDictItemShow=$$v},expression:"createDictItemShow"}},[_c('div',{attrs:{"slot":"footer"},slot:"footer"},[_c('i-button',{on:{"click":function($event){return _vm.cancelItemReset('dictItemModel')}}},[_vm._v("取消")]),_c('i-button',{attrs:{"loading":_vm.createDictItemLoading,"type":"primary"},on:{"click":function($event){return _vm.createItemDictOk('dictItemModel')}}},[_vm._v("确定 ")])],1),_c('i-form',{ref:"dictItemModel",staticClass:"dict",attrs:{"model":_vm.dictItemModel,"rules":_vm.dictItemModelRule,"label-width":100}},[_c('form-item',{attrs:{"label":"名称:","prop":"itemText"}},[_c('i-input',{attrs:{"placeholder":"请填写名称"},model:{value:(_vm.dictItemModel.itemText),callback:function ($$v) {_vm.$set(_vm.dictItemModel, "itemText", $$v)},expression:"dictItemModel.itemText"}})],1),_c('form-item',{attrs:{"label":"数据值:","prop":"itemValue"}},[_c('i-input',{attrs:{"placeholder":"请填写数据值"},model:{value:(_vm.dictItemModel.itemValue),callback:function ($$v) {_vm.$set(_vm.dictItemModel, "itemValue", $$v)},expression:"dictItemModel.itemValue"}})],1),_c('form-item',{attrs:{"label":"描述:","prop":"description"}},[_c('i-input',{model:{value:(_vm.dictItemModel.description),callback:function ($$v) {_vm.$set(_vm.dictItemModel, "description", $$v)},expression:"dictItemModel.description"}})],1),_c('form-item',{attrs:{"label":"排序值:","prop":"sortOrder"}},[_c('input-number',{attrs:{"step":1,"min":1},model:{value:(_vm.dictItemModel.sortOrder),callback:function ($$v) {_vm.$set(_vm.dictItemModel, "sortOrder", $$v)},expression:"dictItemModel.sortOrder"}})],1),_c('form-item',{attrs:{"label":"是否启用:","prop":"status"}},[_c('i-switch',{attrs:{"true-value":1,"false-value":0},model:{value:(_vm.dictItemModel.status),callback:function ($$v) {_vm.$set(_vm.dictItemModel, "status", $$v)},expression:"dictItemModel.status"}})],1)],1)],1)],1)],1)}
var DataDictionarySettingvue_type_template_id_366d0569_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/setting/extend/DataDictionarySetting.vue?vue&type=template&id=366d0569&scoped=true&

// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/setting/extend/DataDictionarySetting.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var DataDictionarySettingvue_type_script_lang_js_ = ({
  name: "data-dictionary-setting",
  data: function data() {
    return {
      moduleTitle: "添加字典",
      loading: false,
      dictShow: false,
      dictData: {
        data: [],
        columns: [{
          type: "selection",
          width: 60,
          align: "center"
        }, {
          title: "字典名称",
          key: "dictName",
          align: "center"
        }, {
          title: "字典编号",
          key: "dictCode",
          align: "center"
        }, {
          title: "描述",
          key: "description",
          align: "center"
        }, {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          slot: "action"
        }],
        //字典集合
        page: {
          //分页参数
          page: 1,
          size: 10,
          total: 0
        }
      },
      dictItemList: {
        data: [],
        columns: [{
          title: "名称",
          key: "itemText",
          align: "center"
        }, {
          title: "数据值",
          key: "itemValue",
          align: "center"
        }, {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          slot: "action"
        }],
        //字典集合
        page: {
          //分页参数
          page: 1,
          size: 10,
          total: 0
        }
      },
      //字典详细集合
      recycleBin: {
        data: [],
        columns: [{
          type: "selection",
          width: 60,
          align: "center"
        }, {
          title: "字典名称",
          key: "dictName",
          align: "center"
        }, {
          title: "字典编号",
          key: "dictCode",
          align: "center"
        }, {
          title: "描述",
          key: "description",
          align: "center"
        }, {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          slot: "action"
        }]
      },
      //回收站
      createDictShow: false,
      dictTitle: "添加字典",
      dictItemTitle: "新增",
      dictModel: {
        id: "",
        dictName: "",
        dictCode: "",
        description: ""
      },
      //新增字典集合
      dictItemModel: {
        id: "",
        itemText: "",
        itemValue: "",
        description: "",
        sortOrder: 1,
        status: 1
      },
      dictItemModelRule: {
        itemText: [{
          required: true,
          message: "请输入名称",
          trigger: "blur"
        }],
        itemValue: [{
          required: true,
          message: "请输入数据值",
          trigger: "blur"
        }]
      },
      dictModelRule: {
        dictName: [{
          required: true,
          message: "请输入字典名称",
          trigger: "blur"
        }],
        dictCode: [{
          required: true,
          message: "请输入字典编码",
          trigger: "blur"
        }]
      },
      //字典验证
      createDictLoading: false,
      //批量删除按钮是否显示
      dictDeleteShow: false,
      //批量删除选中的数据
      dictSelectData: [],
      //抽屉显示事件
      itemDrawer: false,
      dictId: "",
      //字典id
      createDictItemShow: false,
      //字典详细是否显示
      createDictItemLoading: false,
      recycleBinShow: false //回收站显示

    };
  },
  created: function created() {
    this.loadData();
  },
  methods: {
    loadData: function loadData() {
      //加载数据列表
      var that = this;
      $http.get({
        url: api.dictList,
        data: {
          pageNo: that.dictData.page.page,
          pageSize: that.dictData.page.size
        },
        success: function success(res) {
          that.dictData.data = res.records;
          that.dictData.page.size = res.size;
          that.dictData.page.total = res.total;
        }
      });
    },
    loadItemData: function loadItemData() {
      //加载数据列表
      var that = this;
      $http.get({
        url: api.dictItemList,
        data: {
          pageNo: that.dictItemList.page.page,
          pageSize: that.dictItemList.page.size,
          dictId: this.dictId
        },
        success: function success(res) {
          that.dictItemList.data = res.records;
          that.dictItemList.page.size = res.size;
          that.dictItemList.page.total = res.total;
        }
      });
    },
    handleSizeChange: function handleSizeChange(val) {
      this.dictData.page.size = val;
      this.loadData();
    },
    handleCurrentChange: function handleCurrentChange(val) {
      this.dictData.page.page = val;
      this.loadData();
    },
    //字典新增
    dictClick: function dictClick() {
      this.moduleTitle = "添加字典";
      this.createDictShow = true;
    },
    //字典添加和修改确定操作
    createDictOk: function createDictOk(name) {
      var _this = this;

      var that = this;
      this.$refs[name].validate(function (valid) {
        if (valid) {
          _this.createDictLoading = true;
          var url = "";

          if (that.dictModel.id) {
            url = api.dictEdit;
          } else {
            url = api.dictAdd;
          }

          $http.post({
            url: url,
            contentType: "json",
            data: JSON.stringify(that.dictModel),
            success: function success(res) {
              _this.createDictShow = false;
              that.dictModel = {};

              _this.loadData();
            },
            finally: function _finally() {
              _this.createDictLoading = false;
            }
          });
        }
      });
    },
    createItemDictOk: function createItemDictOk(name) {
      var _this2 = this;

      var that = this;
      this.$refs[name].validate(function (valid) {
        if (valid) {
          _this2.createDictItemLoading = true;
          var url = "";

          if (that.dictItemModel.id) {
            url = api.dictItemEdit;
          } else {
            url = api.dictItemAdd;
          }

          that.dictItemModel.dictId = _this2.dictId;

          if (!that.dictItemModel.sortOrder) {
            that.dictItemModel.sortOrder = 1;
          }

          $http.post({
            url: url,
            contentType: "json",
            data: JSON.stringify(that.dictItemModel),
            success: function success(res) {
              _this2.createDictItemShow = false;
              that.dictItemModel = {};

              _this2.loadItemData();
            },
            finally: function _finally() {
              _this2.createDictItemLoading = false;
            }
          });
        }
      });
    },
    //表单验证情况清空
    cancelReset: function cancelReset(name) {
      this.$refs[name].resetFields();
      this.createDictShow = false;
      this.dictModel = {};
      this.loadData();
    },
    cancelItemReset: function cancelItemReset(name) {
      this.$refs[name].resetFields();
      this.createDictItemShow = false;
      this.dictItemModel = {};
      this.loadItemData();
    },
    //字典编辑
    editDict: function editDict(row) {
      this.moduleTitle = "修改字典";
      this.dictModel = row;
      this.createDictShow = true;
    },
    //字典删除
    dictRemove: function dictRemove(row) {
      var _this3 = this;

      var id = row.id;
      $http.del({
        url: api.dictDelete,
        data: {
          id: id
        },
        success: function success(res) {
          _this3.loadData();
        }
      });
    },
    //字典详情删除
    dictItemRemove: function dictItemRemove(row) {
      var _this4 = this;

      var id = row.id;
      $http.del({
        url: api.dictItemDelete,
        data: {
          id: id
        },
        success: function success(res) {
          _this4.loadItemData();
        }
      });
    },
    //复选框选中事件
    dictTableSelect: function dictTableSelect(selection) {
      if (selection.length > 0) {
        this.dictDeleteShow = true;
        this.dictSelectData = selection;
      } else {
        this.dictDeleteShow = false;
      }
    },
    //批量删除点击事件
    dictDeleteBatch: function dictDeleteBatch() {
      var _this5 = this;

      var dictSelectData = this.dictSelectData;
      var ids = "";

      var _iterator = Object(createForOfIteratorHelper["a" /* default */])(dictSelectData),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var dictSelectDatum = _step.value;
          var id = dictSelectDatum.id;
          ids = ids + id + ",";
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (ids.length > 1) {
        ids = ids.substr(0, ids.lastIndexOf(","));
      }

      this.$Modal.confirm({
        title: "批量删除",
        content: "确定要删除吗",
        closable: true,
        onOk: function onOk(res) {
          $http.del({
            url: api.dictDeleteBatch,
            data: {
              ids: ids
            },
            success: function success(res) {
              _this5.loadData();
            }
          });
        }
      });
    },
    //字典配置选项
    dictConfig: function dictConfig(id) {
      this.itemDrawer = true;
      this.dictId = id;
      this.loadItemData();
    },
    handleItemSizeChange: function handleItemSizeChange(val) {
      this.dictItemList.page.size = val;
      this.loadItemData();
    },
    handleItemCurrentChange: function handleItemCurrentChange(val) {
      this.dictItemList.page.page = val;
      this.loadItemData();
    },
    //字典详细添加
    dictItemClick: function dictItemClick() {
      this.dictItemModel = {};
      this.dictItemTitle = "新增";
      this.createDictItemShow = true;
    },
    //字典详情编辑
    editItemDict: function editItemDict(row) {
      this.dictItemTitle = "修改";
      this.dictItemModel = row;
      this.createDictItemShow = true;
    },
    close: function close() {
      this.dictShow = false;
    },
    getRowClassname: function getRowClassname(row) {
      if (row.status == 0) {
        return "data-rule-invalid";
      }
    },
    //刷新缓存
    dictReflesh: function dictReflesh() {
      var that = this;
      $http.get({
        url: api.refleshCache,
        success: function success(res) {
          that.$Message.success(res);
        }
      });
    },
    //回收站点击按钮事件
    recycleBinClick: function recycleBinClick() {
      this.recycleBinShow = true;
      this.loadRecycleBin();
    },
    //回收站关闭事件
    recycleBinReset: function recycleBinReset() {
      this.recycleBinShow = false;
    },
    //加载回收站数据
    loadRecycleBin: function loadRecycleBin() {
      var _this6 = this;

      $http.get({
        url: api.deleteList,
        success: function success(res) {
          _this6.recycleBin.data = res;
        }
      });
    },
    //回收站字典取回
    recycleBinRetrieve: function recycleBinRetrieve(id) {
      var _this7 = this;

      $http.post({
        url: api.back,
        contentType: "json",
        data: {
          id: id
        },
        success: function success(res) {
          _this7.loadRecycleBin();

          _this7.loadData();
        }
      });
    },
    //回收站字典彻底删除
    recycleBinDelete: function recycleBinDelete(id) {
      var _this8 = this;

      $http.del({
        url: api.thoroughDelete,
        data: {
          id: id
        },
        success: function success(res) {
          _this8.loadRecycleBin();
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/setting/extend/DataDictionarySetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var extend_DataDictionarySettingvue_type_script_lang_js_ = (DataDictionarySettingvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/setting/extend/DataDictionarySetting.vue?vue&type=style&index=0&id=366d0569&scoped=true&lang=css&
var DataDictionarySettingvue_type_style_index_0_id_366d0569_scoped_true_lang_css_ = __webpack_require__("caa5");

// CONCATENATED MODULE: ./src/components/setting/extend/DataDictionarySetting.vue






/* normalize component */

var DataDictionarySetting_component = Object(componentNormalizer["a" /* default */])(
  extend_DataDictionarySettingvue_type_script_lang_js_,
  DataDictionarySettingvue_type_template_id_366d0569_scoped_true_render,
  DataDictionarySettingvue_type_template_id_366d0569_scoped_true_staticRenderFns,
  false,
  null,
  "366d0569",
  null
  
)

/* harmony default export */ var DataDictionarySetting = (DataDictionarySetting_component.exports);
// CONCATENATED MODULE: ./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--12-0!./node_modules/_thread-loader@2.1.3@thread-loader/dist/cjs.js!./node_modules/_babel-loader@8.2.2@babel-loader/lib!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.6@vue-loader/lib??vue-loader-options!./src/components/ChartSetting.vue?vue&type=script&lang=js&


















//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








var ChartSettingvue_type_script_lang_js_excel_config_id = "aqgagtetwtwywyewy";
 // import ChartDataSetting from "@/components/group/ChartDataSetting";











 // 存在未解决的问题




 // 存在未解决的问题







 // 存在未解决的问题




/* harmony default export */ var ChartSettingvue_type_script_lang_js_ = ({
  name: "chart-setting",
  components: {
    "chart-type-list": ChartTypeList,
    // "chart-data-setting": ChartDataSetting,
    "bar-code-setting": BarCodeSetting,
    "qr-code-setting": QRCodeSetting,
    "chart-title-setting": ChartTitleSetting,
    "chart-bar-setting": ChartBarSetting,
    "chart-line-setting": ChartLineSetting,
    "chart-pie-setting": ChartPieSetting,
    "chart-margin-setting": ChartMarginSetting,
    "chart-funnel-setting": ChartFunnelSetting,
    "chart-pictorial-setting": ChartPictorialSetting,
    "chart-scatter-setting": ChartScatterSetting,
    "chart-map-setting": ChartMapSetting["default"],
    "chart-radar-setting": ChartRadarSetting,
    "chart-gauge-setting": ChartGaugeSetting,
    "chart-xAxis-setting": ChartXAxisSetting,
    "chart-yAxis-setting": ChartYAxisSetting,
    "chart-series-setting": ChartSeriesSetting,
    "chart-tooltip-setting": ChartTooltipSetting,
    "chart-grid-setting": ChartGridSetting,
    "chart-legend-setting": ChartLegendSetting,
    "chart-background-setting": ChartBackgroundSetting,
    "chart-match-setting": ChartMatchSetting,
    "chart-datasource-setting": ChartDatasourceSetting,
    // 存在问题
    "chart-central-point-setting": ChartCentralPointSetting,
    "function-interpretation-setting": FunctionInterpretationSetting,
    "data-dictionary-setting": DataDictionarySetting
  },
  created: function created() {
    this.offsetInfo = "0,0";
    this.windowHeight = window.innerHeight;
  },
  mounted: function mounted() {// 图表选择弹框样式添加
    // addChartModalSelectedStyle();
    // return;
    // const type = "bar.simple";
    // this.showChartConfig(type, defaultChartConfig[type]);
    // var datas = {
    //   id: "3gIUhnvK4hKynMxV",
    //   chartType: "bar.simple",
    //   options: {
    //     yAxis: {
    //       axisLabel: { textStyle: { color: "#333", fontSize: 12 } },
    //       axisLine: { lineStyle: { color: "#333" } },
    //       show: true,
    //       name: "销量",
    //       splitLine: {
    //         lineStyle: { color: "red", width: 1, type: "solid" },
    //         show: false,
    //       },
    //     },
    //     xAxis: {
    //       axisLabel: {
    //         rotate: 0,
    //         interval: 0,
    //         textStyle: { color: "#333", fontSize: 12 },
    //       },
    //       data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    //       axisLine: { lineStyle: { color: "#333" } },
    //       show: true,
    //       name: "服饰",
    //       splitLine: {
    //         lineStyle: { color: "red", width: 1, type: "solid" },
    //         show: false,
    //       },
    //     },
    //     grid: { top: 60, left: 60, bottom: 60, right: 60 },
    //     series: [
    //       {
    //         barWidth: 50,
    //         data: ["1", "2", "3", "4", "5", "6", "7"],
    //         name: "销量",
    //         itemStyle: { color: "#c43632", barBorderRadius: 0 },
    //         label: {
    //           show: true,
    //           position: "top",
    //           textStyle: { color: "black", fontSize: 16, fontWeight: "bolder" },
    //         },
    //         type: "bar",
    //         barMinHeight: 2,
    //       },
    //     ],
    //     tooltip: {
    //       formatter: "{b} : {c}",
    //       show: true,
    //       textStyle: { color: "#fff", fontSize: 18 },
    //     },
    //     title: {
    //       padding: [5, 20, 5, 20],
    //       top: 5,
    //       left: "left",
    //       show: true,
    //       text: "某站点用户访问来源",
    //       textStyle: { color: "#c23531", fontSize: 18, fontWeight: "bolder" },
    //     },
    //   },
    //   extData: {
    //     dbCode: "",
    //     dataType: "sql",
    //     dataId1: "",
    //     source: "",
    //     isTiming: "",
    //     target: "",
    //     apiUrl: "",
    //     dataId: 33,
    //     chartId: "3gIUhnvK4hKynMxV",
    //     series: "",
    //     axisY: "price",
    //     axisX: "name",
    //     chartType: "bar.simple",
    //     id: "",
    //     apiStatus: "",
    //     intervalTime: "",
    //   },
    //   offset: [0, 0],
    //   type: "chart",
    //   chartId: "3gIUhnvK4hKynMxV",
    // };
    // this.selectChart(datas);
    // setTimeout(() => {
    //   exportApi.updateChart(datas.id, datas.options);
    // }, 500);
  },
  data: function data() {
    var _this = this;

    return {
      chartTypeList: chartTypeList,
      defaultChartConfig: defaultChartConfig,
      windowHeight: "",
      actionUrlPre: utils_config["a" /* baseFull */],
      dataXs: "",
      chartOptions: {},
      polyWayList: [{
        value: "select",
        label: "列表"
      }, {
        value: "group",
        label: "分组"
      }],
      directionList: [{
        value: "down",
        label: "纵向"
      }, {
        value: "right",
        label: "横向"
      }],
      advancedList: [{
        value: "default",
        label: "普通属性"
      }, {
        value: "title",
        label: "循环表头"
      }, {
        value: "dynamic",
        label: "动态属性"
      }],

      /*dataSourceTypeList:[{value: 'MYSQL5.5',label: 'MySQL5.5'},{value: 'MYSQL5.7',label: 'MySQL5.7'},{value: 'ORACLE',label: 'Oracle'},{value: 'SQLSERVER',label: 'SQLServer'}],
       */
      designerObj: {
        id: "",
        name: "",
        type: "printinfo"
      },
      visible: false,
      apiModal: false,
      deleteParamModel: false,
      deleteFieldModel: false,
      dataShow: true,
      // 数据显示/隐藏
      propsContentShow: true,
      // 属性显示/隐藏
      tabStyleShow: false,
      // 右侧样式设置显示隐藏
      tabDataShow: false,
      // 右侧数据显示隐藏
      tabValue: "1",
      treeSpanNum: 3,
      tableSpanNum: 21,
      propsSpanNum: 3,
      excel: {
        excelValue: "",
        type: "text",
        coordinate: "",
        // 坐标
        ri: 0,
        ci: 0,
        polyWay: "",
        advanced: "default",
        direction: "",
        isDict: 0,
        dictCode: "",
        hasGroup: false
      },
      offsetInfo: "0,0",
      loading: true,
      tableHeight: 0,
      paramTableHeight: 0,
      treeData: null,
      visibleData: false,
      // 自定义颜色名称
      customColorNameList: [],
      // 数值显示位置集合
      labelPositionArray: [],
      // 数值设置 series中的label配置信息
      seriesLabelSettings: {},
      // 象形柱图设置
      pictorialSettings: {},
      // 漏斗设置
      funnelSettings: {},
      // 边距设置
      marginSettings: {},
      // 中心点设置
      centralPointSettings: {},
      // 饼块设置 饼状图专有
      pieSettings: {},
      // 线条设置 折线图专有
      lineSettings: {},
      // 柱体设置 柱状图专有
      barSettings: {},
      // 散点设置 散点图专有
      scatterSettings: {},
      // 仪表图设置 仪表图专有
      gaugeSettings: {},
      // 关系图设置 关系图专有
      graphSettings: {},
      // 地图设置 地图专有
      mapGeoSettings: {},
      // 雷达图设置 雷达图专有
      radarSettings: [],
      // 图表grid配置 s
      gridSettings: {},
      // 图表坐标轴配置 s
      xAxisSettings: {},
      yAxisSettings: "",
      doubleyAxisSettings: [],
      // 图表标题配置 c
      titleSettings: {},
      // 图表标题配置 c
      legendSettings: {},
      // 图表提示语配置 c
      tooltipSettings: {},
      // 数据集配置
      dataSettings: {
        dataType: "api",
        apiStatus: "",
        apiUrl: "",
        dataId: "",
        axisX: "name",
        axisY: "value",
        series: "type",
        yText: "",
        xText: "",
        dbCode: [],
        dataId1: "",
        source: "",
        target: "",
        isTiming: false,
        intervalTime: "5"
      },
      // api静态数据
      apiStaticData: "",
      // sql数据集
      sqlDatasets: [],
      // sql数据集字段
      sqlDatasetFields: [],
      // sql数据集字段2
      sqlDatasetFields2: [],
      // api数据集
      apiDatasets: [],
      apiDatasetFields: [],
      // 背景图设置
      backgroundImg: [{
        name: "backgroundImg",
        url: ""
      }],
      backgroundSettingShow: false,
      backgroundSettings: {
        path: "",
        repeat: "",
        width: "",
        height: ""
      },
      // 图表背景图设置
      chartBackgroundImg: [{
        name: "chartBackgroundImg",
        url: ""
      }],
      chartBackground: {
        color: "#fff",
        enabled: false,
        image: "",
        repeat: "repeat"
      },
      // 条形码设置
      barcodeSettings: false,
      // 二维码设置
      qrcodeSettings: false,
      echartInfo: {
        id: "",
        //标题
        titleShow: true,
        titleText: "",
        titleFontSize: 20,
        titleFontWeight: "bolder",
        titleColor: "#c43632",
        titleLocation: "left",
        //柱体
        barWidth: 0,
        barRadius: 0,
        barMinHeight: 0,
        //折线
        step: false,
        //阶梯线图
        showSymbol: true,
        //标记点
        smooth: false,
        //平滑曲线
        symbolSize: 8,
        // 设置折线上圆点大小
        linewidth: 5,
        // 设置线宽
        //饼图
        pieLabelPosition: "outside",
        //标签位置
        minAngle: 0,
        //最小角度
        notCount: false,
        //不展示零
        autoSort: false,
        //自动排序
        roseType: false,
        //南丁格尔玫瑰
        isRadius: false,
        //是否环形
        pieRadius: "40%,50%",
        //半径大小
        //地图
        scale: 0,
        numerTextHighCol: "",
        borderWidth: 0,
        areaCol: "",
        areaHighCol: "",
        borderCol: "",
        //X轴样式
        xaxisShow: true,
        xaxisText: "",
        xaxisLine: true,
        xaxisLinecol: "#c43632",
        xaxisTextsize: 0,
        axisLabelRotate: 0,
        //Y轴样式
        yaxisShow: true,
        yaxisText: "",
        yaxisLine: true,
        yaxisLinecol: "#c43632",
        yaxisTextsize: 0,
        //数值设置
        numerShow: true,
        numerTextSize: 0,
        numerTextcol: "#c43632",
        numerTextweig: "",
        //提示框
        tooltipShow: true,
        tooltipTextSize: 0,
        tooltipTextcol: "#c43632",
        //图例
        legendShow: true,
        //legendItemWidth: 0,
        legendTop: "top",
        legendLeft: "left",
        legendOrient: "horizontal",
        legendTextcol: "#c43632",
        legendTextsize: 0,
        //图例数据
        legendData: [],
        //轴边距
        gridLeft: 0,
        gridTop: 0,
        gridRight: 0,
        gridBottom: 0,
        //xy轴字体颜色/轴线颜色
        axisLabelTextCol: "#c43632",
        axisLineLineCol: "#c43632",
        seriesItemNorCol: "#c43632",
        seriesLinemNorCol: "#c43632"
      },
      dataAllocation: {
        dataType: "sqlechData",
        status: "staticData",
        optionData: "{}",
        selectOptionData: {},
        apiListOpt: [],
        sqlListOpt: [],
        sqlListField: [],
        sqlxAxis: "",
        sqlseries: "",
        sqlgroup: "",
        //系列属性
        sqltype: "",
        //系列类型
        selectId: "",
        seriesTypeData: [] //系列类型数据

      },
      addEchart: false,
      chartModule: false,
      chartsType: "",
      selectedChartId: "",
      // 图表选择Id
      selectedChartType: "",
      // 图表选择类型
      // 自定义颜色样式
      colorMatchData: [],
      colorMatchModal: false,
      colorMatch: {
        name: "",
        color: "",
        edgeColor: "",
        opacity: 1,
        lineColor: ""
      },
      isChartSetting: false,
      isMultiChart: false,
      // 是否多组
      rightTabName: "name1",
      chartsTypeArr: [],
      seriesTypeData: [],
      // 系列类型数据
      specialChartType: "",
      seriesModal: false,
      tabDisabled: false,
      seriesObj: {},
      seriesColumns: [{
        title: "系列类型",
        key: "name",
        align: "left",
        width: 110,
        render: function render(h, params) {
          return _this.renderColorButton(h, params, "name", 2);
        }
      }, {
        title: "操作",
        key: "action",
        align: "right",
        width: 80,
        render: function render(h, params) {
          return _this.renderColorButton(h, params, "action", 2);
        }
      }],
      customExpressionShow: false,
      // 添加表达式
      expression: "",
      // 表达式
      commonFunction: false,
      // 常用函数
      functionList: [{
        name: "SUM,DBSUM,AVERAGE,DBAVERAGE,MIN,DBMIN,MAX,DBMAX"
      }],
      // 函数集合
      newFunctionList: [],
      interpretation: "",
      leftFunctionIndex: -1,
      // 父级选中样式坐标
      rightFunctionIndex: -1 // 子级选中样式坐标

    };
  },
  watch: {
    // 观察的属性名
    dataSettings: {
      handler: function handler(newSettings, oldSettings) {
        console.info("=============================", newSettings, oldSettings);

        if (newSettings.dataType != oldSettings.dataType) {
          this.dataTypeChange();
        }

        if (oldSettings && newSettings.dataId != oldSettings.dataId) {
          this.onDatasetIdChange(newSettings.dataId);
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    menuitemClasses: function menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    colorLabel: function colorLabel() {
      return this.selectedChartType.indexOf("scatter.bubble") !== -1 ? "中心颜色" : "颜色";
    },
    centerDivClass: function centerDivClass() {
      var str = "chart-designer";

      if (!this.dataShow && !this.propsContentShow) {
        str += " all";
      } else if (!this.dataShow) {
        str += " left";
      } else if (!this.propsContentShow) {
        str += " right";
      }

      return str;
    }
  },
  methods: {
    // 自定义系列类型
    addSeriesType: function addSeriesType() {
      var obj = Object(objectSpread2["a" /* default */])({}, this.seriesObj);

      if (obj._index >= 0) {
        this.seriesTypeData.splice(obj._index, 1, obj);
      } else {
        this.seriesTypeData.push(obj);
      } //运行到图表


      this.runChart();
      this.seriesObj = {
        name: "",
        type: ""
      };
      this.seriesModal = false;
    },
    showChartConfig: function showChartConfig(key, value) {
      this.selectChart({
        type: "chart",
        extData: "",
        chartType: key,
        options: value
      });
    },
    // 设置选择图表类型
    setSelectCharType: function setSelectCharType(item) {
      var _this2 = this;

      newtecRequest({
        operServiceId: "chartConfigService",
        operId: "getEchartDefaultConfig",
        data: item.id,
        success: function success(res) {
          var status = res.status,
              data = res.data,
              error = res.error;

          if (status == 0) {
            _this2.selectedChartType = item.type;
            _this2.selectedChartId = item.id;
            var options = JSON.parse(data);
            design["a" /* addChartPreHandler */].call(_this2, options);
            options.backgroundColor = "#fff";
            exportApi["a" /* default */].addChart(options, null, function (result) {
              _this2.selectChart(result);

              exportApi["a" /* default */].updateChartExtData(result.id, {
                chartId: item.id,
                chartType: item.type
              });
            });
            _this2.chartModule = false;
            _this2.specialChartType = ""; //判断图表类型

            _this2.isMultiChart = options.series.length > 1 ? true : false;
            _this2.isChartSetting = true;
          } else {
            _this2.$Message.info(error || "图表数据加载失败");
          }
        }
      });
    },
    submitValue: function submitValue(e) {
      var value = e.target.value;
      Object(design["i" /* setExcelData */])({
        ri: this.excel.ri,
        ci: this.excel.ci
      }, value);
    },
    selectMenuList: function selectMenuList(val) {
      this.designerObj.type = val;
    },
    savePopup: function savePopup() {
      var that = this;
      var creatFlag = that.excelQueryName();

      if (creatFlag) {
        var data = that.dataXs;

        var saveFn = function saveFn(obj) {
          // 判断报表是否有分组字段
          var rows = data.rows;
          var groupField = "";

          for (var key in rows) {
            if (groupField) break;
            var cells = rows[key].cells;

            for (var cellKey in cells) {
              var text = cells[cellKey].text;
              if (!text) continue;

              if (text.includes(".group(")) {
                groupField = text.replace("group(", "").replace(")}", "").replace("#{", "");
                break;
              }
            }
          }

          if (groupField) {
            data.isGroup = true;
            data.groupField = groupField;
          }

          if (data.chartList && data.chartList.length > 0) {
            data.chartList.forEach(function (item) {
              if (item.width === 0 || item.height === 0) {
                item.width = "650";
                item.height = "350";
              }
            });
          }

          var dataStr = JSON.stringify(Object(objectSpread2["a" /* default */])({
            designerObj: obj
          }, data));

          if (obj.name != null && obj.name != "") {
            $http.post({
              contentType: "json",
              url: api.saveReport,
              data: dataStr,
              success: function success(result) {
                exportApi["a" /* default */].tip("保存成功!");
                onbeforeunload = "return true";
                window.location.reload();
              }
            });
          }
        };

        that.handleCreate(saveFn, data);
        that.visible = false;
      }
    },
    handleCreate: function handleCreate(cb, data) {
      var that = this;
      var obj = that.designerObj;

      if (obj.name == "" || obj.name == null) {
        that.visible = true;
        that.dataXs = data; //that.$Message.error("名称不能为空!");

        return "";
      } //同步校验


      var creatFlag = that.excelQueryName();

      if (creatFlag) {
        obj.id = ChartSettingvue_type_script_lang_js_excel_config_id;
        cb(obj);
      }
    },
    excelQueryName: function excelQueryName() {
      var creatFlag = true;
      var that = this;
      var obj = that.designerObj;

      if (obj.name != "" && obj.name != null) {
        $http.post({
          contentType: "json",
          url: api.excelQueryName,
          data: JSON.stringify(obj),
          fail: function fail(result) {
            obj.name = "";
            creatFlag = false;
          }
        });
      }

      return creatFlag;
    },
    onChangeDecimalPlaces: function onChangeDecimalPlaces(e) {
      exportApi["a" /* default */].cellProp(this.excel.ri, this.excel.ci, {
        decimalPlaces: e.target.value
      });
    },
    selectPolyList: function selectPolyList(name) {
      exportApi["a" /* default */].getExcelData(function (excelData) {
        //下拉改变单元格值
        var data = excelData.getSelectArea();
        if (data.sri < 0 || data.sci < 0) return;
        if (!excelData.rows["_"][data.sri]) return;
        if (!excelData.rows["_"][data.sri].cells[data.sci]) return;
        var textr = excelData.rows["_"][data.sri].cells[data.sci].text;

        if (textr != "" && textr.indexOf("#{") != -1) {
          if (name === "group") {
            if (excelData.rows["_"][data.sri].cells[data.sci].direction === "right") return;
            excelData.rows["_"][data.sri].cells[data.sci].aggregate = "group";
            var text = excelData.rows["_"][data.sri].cells[data.sci].text;
            var newxsdata = text.replace(Object(design["j" /* subStringStr */])(text, "#{", "}").split(".")[1], "group(" + Object(design["j" /* subStringStr */])(text, "#{", "}").split(".")[1] + ")");
            Object(design["l" /* xsSetNewdata */])(data, newxsdata);
          } else if (name === "select") {
            if (excelData.rows["_"][data.sri].cells[data.sci].direction === "right") return;
            excelData.rows["_"][data.sri].cells[data.sci].aggregate = "select";
            var _text = excelData.rows["_"][data.sri].cells[data.sci].text;
            var subtext = Object(design["j" /* subStringStr */])(_text, "#{", "}").split(".")[1];

            var _newxsdata = _text.replace(subtext, Object(design["j" /* subStringStr */])(subtext, "group(", ")"));

            Object(design["l" /* xsSetNewdata */])(data, _newxsdata);
          }
        }
      });
    },
    selectDirectionList: function selectDirectionList(name) {
      var _this3 = this;

      exportApi["a" /* default */].getExcelData(function (excelData) {
        //下拉改变单元格值
        var data = excelData.getSelectArea();
        if (data.sri < 0 || data.sci < 0) return;
        if (!excelData.rows["_"][data.sri]) return;
        if (!excelData.rows["_"][data.sri].cells[data.sci]) return;
        var textr = excelData.rows["_"][data.sri].cells[data.sci].text;

        if (textr != "" && textr.indexOf("#{") != -1) {
          if (name === "right") {
            excelData.rows["_"][data.sri].cells[data.sci].direction = "right";
            var text = excelData.rows["_"][data.sri].cells[data.sci].text;
            var text2 = Object(design["j" /* subStringStr */])(text, "#{", "}").split(".")[1];
            var text4 = "";

            if (text2.indexOf("group(") != -1) {
              text4 = Object(design["j" /* subStringStr */])(text2, "group(", ")");
            } else {
              text4 = text2;
            }

            var text3 = "groupRight(" + text4 + ")";
            var newxsdata = text.replace(text2, text3);
            Object(design["l" /* xsSetNewdata */])(data, newxsdata);
            _this3.excel.polyWay = "group";
            _this3.$refs.excelPolyWay.disabled = true;
          } else if (name === "down") {
            excelData.rows["_"][data.sri].cells[data.sci].direction = "down";
            var _text2 = excelData.rows["_"][data.sri].cells[data.sci].text;
            var subtext = Object(design["j" /* subStringStr */])(_text2, "#{", "}").split(".")[1];

            var _newxsdata2 = _text2.replace(subtext, Object(design["j" /* subStringStr */])(subtext, "groupRight(", ")"));

            Object(design["l" /* xsSetNewdata */])(data, _newxsdata2);
            _this3.excel.polyWay = "select";
            _this3.$refs.excelPolyWay.disabled = false;
          }
        }
      });
    },
    selectAdvancedList: function selectAdvancedList(name) {
      var _this4 = this;

      exportApi["a" /* default */].getExcelData(function (excelData) {
        //下拉改变单元格值
        var data = excelData.getSelectArea();
        if (data.sri < 0 || data.sci < 0) return;
        if (!excelData.rows["_"][data.sri]) return;
        if (!excelData.rows["_"][data.sri].cells[data.sci]) return;
        var textr = excelData.rows["_"][data.sri].cells[data.sci].text;

        if (textr != "" && textr.indexOf("#{") != -1) {
          if (name === "dynamic") {
            _this4.excel.advanced = "dynamic";
            if (excelData.rows["_"][data.sri].cells[data.sci].aggregate === "dynamic") return;
            excelData.rows["_"][data.sri].cells[data.sci].aggregate = "dynamic";
            var text = excelData.rows["_"][data.sri].cells[data.sci].text;
            text = text.replace("eachTitle(", "").replace(")", "");
            var newxsdata = text.replace(Object(design["j" /* subStringStr */])(text, "#{", "}").split(".")[1], "dynamic(" + Object(design["j" /* subStringStr */])(text, "#{", "}").split(".")[1] + ")");
            Object(design["l" /* xsSetNewdata */])(data, newxsdata);
          } else if (name === "title") {
            _this4.excel.advanced = "title";
            if (excelData.rows["_"][data.sri].cells[data.sci].aggregate === "eachTitle") return;
            excelData.rows["_"][data.sri].cells[data.sci].aggregate = "eachTitle";
            var _text3 = excelData.rows["_"][data.sri].cells[data.sci].text;
            _text3 = _text3.replace("dynamic(", "").replace(")", "");

            var _newxsdata3 = _text3.replace(Object(design["j" /* subStringStr */])(_text3, "#{", "}").split(".")[1], "eachTitle(" + Object(design["j" /* subStringStr */])(_text3, "#{", "}").split(".")[1] + ")");

            Object(design["l" /* xsSetNewdata */])(data, _newxsdata3);
          } else if (name === "default") {
            _this4.excel.advanced = "default";
            excelData.rows["_"][data.sri].cells[data.sci].aggregate = "";
            var _text4 = excelData.rows["_"][data.sri].cells[data.sci].text;
            _text4 = _text4.replace("dynamic(", "").replace(")", "").replace("eachTitle(", "").replace(")", "");

            var _newxsdata4 = _text4.replace(Object(design["j" /* subStringStr */])(_text4, "#{", "}").split(".")[1], Object(design["j" /* subStringStr */])(_text4, "#{", "}").split(".")[1]);

            Object(design["l" /* xsSetNewdata */])(data, _newxsdata4);
          }
        }
      });
    },
    // 是否使用字典下拉框改变事件
    selectUseDict: function selectUseDict(value) {
      var _this5 = this;

      //下拉改变单元格值
      if (!value && value != 0) {
        return;
      }

      exportApi["a" /* default */].getExcelData(function (excelData) {
        var data = excelData.getSelectArea();

        if (data.sri < 0 || data.sci < 0) {
          return;
        }

        if (value == 0) {
          var code = _this5.excel.dictCode;

          _this5.removeReportDictCode(code);

          _this5.excel.dictCode = "";
          excelData.rows["_"][data.sri].cells[data.sci]["dictCode"] = "";
        }

        excelData.rows["_"][data.sri].cells[data.sci]["isDict"] = value; //xs.sheet.reload()
      });
    },
    // 字典编码改变事件
    changeDictCode: function changeDictCode() {
      var _this6 = this;

      exportApi["a" /* default */].getExcelData(function (excelData) {
        var value = _this6.excel.dictCode;
        var data = excelData.getSelectArea();
        if (data.sri < 0 || data.sci < 0) return;

        if (_this6.excel.isDict == 1) {
          excelData.rows["_"][data.sri].cells[data.sci]["dictCode"] = value;

          _this6.addReportDictCode(value);
        }
      });
    },
    // 新增字典编码到excel data dicts
    addReportDictCode: function addReportDictCode(code) {
      exportApi["a" /* default */].getExcelData(function (excelData) {
        if (!excelData.dicts) {
          excelData.dicts = [];
        }

        excelData.dicts.push(code);
      });
    },
    // 移除字典编码
    removeReportDictCode: function removeReportDictCode(code) {
      exportApi["a" /* default */].getExcelData(function (excelData) {
        if (excelData.dicts) {
          var index = excelData.dicts.indexOf(code);

          if (index >= 0) {
            excelData.dicts.splice(index, 1);
          }
        }
      });
    },
    // 渲染button
    renderColorButton: function renderColorButton(h, params, key, type) {
      var _this7 = this;

      if (key == "action") {
        return h("div", {
          style: {
            display: "flex"
          }
        }, [h("i-button", {
          props: Object.assign({}, Object(defineProperty["a" /* default */])({
            type: "default",
            size: "small"
          }, "type", "text"), {
            icon: "md-create"
          }),
          on: {
            click: function click() {
              _this7.seriesObj = params.row;
              _this7.seriesModal = true;
            }
          }
        }), h("i-button", {
          props: Object.assign({}, {
            size: "small",
            type: "text"
          }, {
            icon: "md-close"
          }),
          on: {
            click: function click() {
              _this7.$Modal.confirm({
                title: "提示",
                content: "是否确认删除?",
                onOk: function onOk() {
                  _this7.seriesTypeData.splice(params.index, 1);

                  _this7.runChart();
                }
              });
            }
          }
        })]);
      } else {
        //行数据显示渲染和编辑操作
        return h("div", {
          style: {
            display: "flex",
            width: "100px",
            alignItems: "center"
          }
        }, [type === 1 ? h("div", {
          style: {
            background: params.row.color,
            width: "15px",
            height: "15px"
          }
        }) : h("div", {
          style: {}
        }, params.row.type), h("div", [h("div", {
          style: {
            display: "inherit",
            width: type === 1 ? "75px" : "60px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        }, "\xa0" + params.row.name)])]);
      }
    },
    // 图表标题
    echTilChange: function echTilChange(status) {
      this.echartInfo.titleShow = status;
    },
    addEchartData: function addEchartData() {
      this.addEchart = false;
      var str = this.apiStaticData;
      var settings = Object.assign(this.dataSettings, {
        run: 1,
        axisX: "name",
        axisY: "value",
        series: "type"
      });
      design["h" /* refreshChart */].call(this, this.echartInfo.id, this.chartOptions, settings, JSON.parse(str));
    },
    // 选择图表sql
    selectSqlListOpt: function selectSqlListOpt(name) {
      var _this8 = this;

      this.dataAllocation.sqlxAxis = "";
      this.dataAllocation.sqlseries = "";
      this.dataAllocation.sqlgroup = "";
      this.dataAllocation.sqltype = "";
      this.dataAllocation.seriesTypeData = [];
      this.dataAllocation.sqlListOpt.forEach(function (item) {
        if (item.dbId === name) {
          _this8.dataAllocation.sqlListField = item.children;
        }
      });
    },
    changeLayerOffset: function changeLayerOffset() {
      var value = this.offsetInfo;

      if (!value) {
        exportApi["a" /* default */].updateLayerOffset(this.echartInfo.id, [0, 0]);
        return;
      }

      if (value.indexOf(",") < 0) {
        this.$Message.warning("偏移量格式不正确！");
        return;
      }

      var arr = value.split(",");

      if (arr.length != 2) {
        this.$Message.warning("偏移量格式不正确！");
        return;
      }

      exportApi["a" /* default */].updateLayerOffset(this.echartInfo.id, arr);
    },
    // 单击选中图表
    selectChart: function selectChart(data) {
      if (!data) {
        console.error("选中图层但是未回调任何信息!");
        return;
      }

      this.echartInfo.id = data.id;

      if (!data.offset) {
        this.offsetInfo = "0,0";
      } else {
        this.offsetInfo = data.offset.join(",");
      }

      if (data.type == "barcode") {
        //条形码走这个逻辑
        this.barcodeSettings = JSON.parse(data.jsonString);
        this.rightTabName = "name5";
      } else if (data.type == "qrcode") {
        this.qrcodeSettings = JSON.parse(data.jsonString);
        this.rightTabName = "name6";
      } else {
        // 图表点击走这个逻辑
        this.selectedChartType = data["chartType"];
        this.selectedChartId = data["chartId"];
        this.chartOptions = "";

        if (!data.options) {
          return;
        }

        this.rightTabName = "name2";
        this.isChartSetting = true;

        if (this.selectedChartType === "apiUrlType") {
          this.dataSettings.dataType = "api";
          this.dataSettings.apiStatus = "2";
          this.dataSettings.apiUrl = data.extData["apiUrl"];
          return;
        }

        design["e" /* handleChartOptions */].call(this, data.options);
        design["d" /* handleChartExtData */].call(this, data.extData);
      }
    },
    styleChanges: function styleChanges(key) {
      if (!key) {
        this.echDataRun();
      } else {}
    },

    /**
     * 背景图重复设置改变事件
     * @param value
     */
    backgroundChange: function backgroundChange() {
      exportApi["a" /* default */].setBackground(this.backgroundSettings);
    },

    /**
     * 消除右侧tabpane的显示属性
     */
    clearRightTabpane: function clearRightTabpane() {
      this.barcodeSettings = false;
      this.qrcodeSettings = false;
      this.backgroundSettingShow = false;
      this.isChartSetting = false;
    },
    // 条形码/二维码设置改变事件
    onBarcodeChange: function onBarcodeChange(settings) {
      var id = this.echartInfo.id;
      exportApi["a" /* default */].updateChart(id, settings);
    },
    onClickCell: function onClickCell() {
      this.rightTabName = "name1";
      this.clearRightTabpane();
    },
    // 鼠标右键背景图设置 事件
    handleBackground: function handleBackground(param) {
      var _this9 = this;

      this.clearRightTabpane();
      Object.keys(this.backgroundSettings).map(function (k) {
        _this9.backgroundSettings[k] = param[k] ? param[k] : "";
      });
      this.rightTabName = "name4";
      this.backgroundSettingShow = true;
    },
    removeBackground: function removeBackground() {
      var _this10 = this;

      Object.keys(this.backgroundSettings).map(function (k) {
        _this10.backgroundSettings[k] = "";
      });
      exportApi["a" /* default */].setBackground({
        path: false
      });
    },
    // 文件上传成功，修改 excel 背景图
    backgroundImgUploadSuccess: function backgroundImgUploadSuccess(res) {
      if (!res.success) {
        this.$Message.warning(res.message);
      } else {
        var path = res.message;

        if (path.indexOf("http") < 0) {
          if (path.indexOf("/") != 0) {
            path = "/" + path;
          }
        }

        this.backgroundSettings["path"] = path;

        if (!this.backgroundSettings["repeat"]) {
          this.backgroundSettings["repeat"] = "repeat";
        }

        exportApi["a" /* default */].setBackground(this.backgroundSettings);
      }
    },
    // 图表背景图上传成功
    chartBackgroundUploadSuccess: function chartBackgroundUploadSuccess(res, chartBackground, callback) {
      if (!res.success) {
        this.$Message.warning(res.message);
      } else {
        var path = res.message;

        if (path.indexOf("http") < 0) {
          if (path.indexOf("/") != 0) {
            path = "/" + path;
          }
        }

        this.chartBackground["image"] = path;
        callback && callback(path);
        this.chartBackgroundChange(chartBackground);
      }
    },
    // 设置图表背景色
    chartBackgroundChange: function chartBackgroundChange(chartBackground) {
      if (chartBackground["enabled"]) {
        // 启用设置
        var imageSrc = chartBackground["image"];
        var color = chartBackground["color"];

        if (imageSrc) {
          this.chartOptions["backgroundColor"] = {
            src: imageSrc
          };
        } else if (color) {
          this.chartOptions["backgroundColor"] = color;
        } else {
          if (this.chartOptions["backgroundColor"]) {
            delete this.chartOptions["backgroundColor"];
          }
        }
      } else {
        if (this.chartOptions["backgroundColor"]) {
          delete this.chartOptions["backgroundColor"];
        }
      } //TODO 图标背景图有个坑 项目地址切换导致图片显示不了


      var id = this.echartInfo.id;
      exportApi["a" /* default */].updateChart(id, this.chartOptions);
    },
    // 获取图片预览图
    getBackgroundImg: function getBackgroundImg() {
      var path = this.backgroundSettings["path"];

      if (path) {
        if (path.indexOf("http") < 0) {
          path = utils_config["a" /* baseFull */] + path;
        }
      }

      return path;
    },
    // 获取图片预览图
    getChartBackgroundImg: function getChartBackgroundImg() {
      var path = this.chartBackground["image"];

      if (path) {
        if (path.indexOf("http") < 0) {
          path = utils_config["a" /* baseFull */] + path;
        }
      }

      return path;
    },
    // 删除背景图意味着要重置背景
    removeChartBackground: function removeChartBackground(chartBackground) {
      this.chartBackgroundChange(chartBackground);
    },
    // 图片上传文件大小
    handleMaxSize: function handleMaxSize(file, size) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件  " + file.name + " 太大，请上传" + size + "M以内图片",
        duration: 6
      });
    },
    // 象形图图标上传回调
    pictorialIconUploadSuccess: function pictorialIconUploadSuccess(res, callback) {
      if (!res.success) {
        this.$Message.warning(res.message);
      } else {
        var symbol = "image://";

        if (res.message.indexOf("http") == 0) {
          symbol += res.message;
        } else {
          symbol += window.location.origin + utils_config["a" /* baseFull */] + "/" + res.message;
        }

        this.pictorialSettings["symbol"] = symbol;
        callback && callback(symbol);

        var _iterator = Object(createForOfIteratorHelper["a" /* default */])(this.chartOptions["series"]),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            item["symbol"] = symbol;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var id = this.echartInfo.id;
        exportApi["a" /* default */].updateChart(id, this.chartOptions);
      }
    },
    getPathBySymbol: function getPathBySymbol() {
      var symbol = this.pictorialSettings["symbol"];

      if (!symbol) {
        var path = utils_config["a" /* baseFull */] + "/jmreport/desreport_/chartsImg/pictorialIcon/spirits.png";
        return path;
      } else {
        return symbol.replace("image://", "");
      }
    },
    onAxisYConfigChange: function onAxisYConfigChange(value) {
      var fields = this.dataSettings.dataType == "sql" ? this.sqlDatasetFields : this.apiDatasetFields;

      var _iterator2 = Object(createForOfIteratorHelper["a" /* default */])(fields),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var field = _step2.value;

          if (field["title"] == value) {
            this.dataSettings["yText"] = field["remark"];
            break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    },
    onAxisXConfigChange: function onAxisXConfigChange(value) {
      var fields = this.dataSettings.dataType == "sql" ? this.sqlDatasetFields : this.apiDatasetFields;

      var _iterator3 = Object(createForOfIteratorHelper["a" /* default */])(fields),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var field = _step3.value;

          if (field["title"] == value) {
            this.dataSettings["xText"] = field["remark"];
            break;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    },
    timerChange: function timerChange() {
      // 时间的变换，更新dataSetting
      var id = this.echartInfo.id;
      exportApi["a" /* default */].updateChartExtData(id, this.dataSettings);
    },
    onLegendChange: function onLegendChange() {
      this.onSettingsChange("legend", this.legendSettings);
    },
    onTooltipChange: function onTooltipChange() {
      this.onSettingsChange("tooltip", this.tooltipSettings);
    },
    onGridChange: function onGridChange() {
      this.onSettingsChange("grid", this.gridSettings);
    },
    onDoubleYAxisChange: function onDoubleYAxisChange() {
      this.onSettingsChange("yAxis", this.doubleyAxisSettings);
    },
    onGeoChange: function onGeoChange() {
      this.onSettingsChange("geo", this.mapGeoSettings);
    },
    onGraphChange: function onGraphChange() {
      this.onSeriesChange(this.graphSettings);
    },
    onPictorialChange: function onPictorialChange(pictorialSettings) {
      var settings = pictorialSettings;
      var arr = this.chartOptions["series"];
      var oneSeries = arr[0];
      var option = util["a" /* default */].setting2Option(pictorialSettings);
      Object.assign(oneSeries, option);
      /*if(!oneSeries['symbol']){
          oneSeries['symbol'] = base64_spirits
      }*/

      this.chartOptions["xAxis"]["max"] = option["symbolBoundingData"];
      var newSeries = [];
      newSeries.push(oneSeries);

      if (settings["double"] == true) {
        var itemStyle = {
          normal: {
            opacity: settings["secondOpacity"]
          }
        };
        var twoSeries = Object.assign({}, oneSeries, {
          symbolClip: false,
          itemStyle: itemStyle
        });
        newSeries.push(twoSeries);
      }

      this.chartOptions["series"] = newSeries;
      var id = this.echartInfo.id;
      exportApi["a" /* default */].updateChart(id, this.chartOptions);
    },
    onSeriesLabelChange: function onSeriesLabelChange() {
      this.onSeriesChange(this.seriesLabelSettings, "label");
    },
    // series更新事件
    onSeriesChange: function onSeriesChange(whatSetting, propName) {
      var option = {};

      if (!propName) {
        option = util["a" /* default */].setting2Option(whatSetting);
      } else {
        option[propName] = util["a" /* default */].setting2Option(whatSetting);
      }

      var arr = this.chartOptions["series"];

      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var temp = JSON.parse(JSON.stringify(option)); //颜色 走自定义的设定

        if (this.isMultiChart === true && temp["itemStyle"]) {
          temp["itemStyle"]["color"] = item["itemStyle"]["color"];
        }

        if (this.isMultiChart === false && item["type"] === "line" && temp["isArea"] === false) {
          //设置面积折线
          temp["areaStyle"] = null;
        }

        Object.assign(item, temp);
      }

      if (arr[0].type === "gauge") {
        var c1 = this.colorMatchData[0] ? this.colorMatchData[0].color : "#91c7ae";
        var c2 = this.colorMatchData[1] ? this.colorMatchData[1].color : "#63869E";
        var c3 = this.colorMatchData[2] ? this.colorMatchData[2].color : "#C23531";
        var _arr = [[0.2, c1], [0.8, c2], [1, c3]];
        this.chartOptions["series"][0]["axisLine"]["lineStyle"].color = _arr;
      } //雷达图中心点设置刷新


      if (arr[0].type === "radar") {
        this.chartOptions["radar"][0]["center"] = this.centralPointSettings.center;
      }

      if (arr[0].type === "pie") {
        this.chartOptions["series"][0]["center"] = this.centralPointSettings.center;
      }

      var id = this.echartInfo.id;
      exportApi["a" /* default */].updateChart(id, this.chartOptions);
    },
    onSettingsChange: function onSettingsChange(optionKey, whatSetting) {
      var _this11 = this;

      var option = null;

      if (Object(design["k" /* typeJudge */])(whatSetting, "Array")) {
        option = util["a" /* default */].setting2Array(whatSetting);
      } else {
        option = util["a" /* default */].setting2Option(whatSetting);
      }

      this.chartOptions[optionKey] = option;
      var id = this.echartInfo.id; // 地图注册

      if (this.chartOptions["geo"]) {
        var map = this.$refs.mapModal.allMapList.filter(function (item) {
          return item.name === _this11.chartOptions["geo"]["map"];
        });

        if (map[0]) {
          exportApi["a" /* default */].registerMap(this.chartOptions["geo"]["map"], map[0].data);
        }
      }

      exportApi["a" /* default */].updateChart(id, this.chartOptions);
    },

    /**
     * 图表sql数据集发生改变时
     */
    onSelectSqlDataset: function onSelectSqlDataset() {
      var _this12 = this;

      var dataId = this.dataSettings["dataId"];
      Object.keys(this.dataSettings).map(function (k) {
        _this12.dataSettings[k] = "";
      });
      this.dataSettings["dataType"] = "sql";
      this.dataSettings["dataId"] = dataId;
      this.onDatasetIdChange(dataId);
    },
    onSelectSqlDataset2: function onSelectSqlDataset2() {
      var _this13 = this;

      var dataId1 = this.dataSettings["dataId1"];
      this.dataSettings["dataId1"] = dataId1;
      this.loadDasetField(dataId1, function (options) {
        _this13.sqlDatasetFields2 = options;
      });
    },
    onDatasetIdChange: function onDatasetIdChange(dataId) {
      var _this14 = this;

      this.loadDasetField(dataId, function (options) {
        _this14["".concat(_this14.dataSettings.dataType, "DatasetFields")] = options;
      });
    },

    /**
     * @param {string} dataId 数据集ID
     * @param {(filedOptions) => {}} callback 回调方法
     * 加载SQL数据集字段信息
     */
    loadDasetField: function loadDasetField(dataId, callback) {
      this.seriesTypeData = [];
      var that = this,
          type = this.dataSettings.dataType;

      if (type == "api" || type == "sql") {
        newtecRequest({
          operServiceId: "".concat(type, "DatasetService"),
          operId: "queryDatasetInfo",
          data: parseInt(dataId),
          success: function success(res) {
            var status = res.status,
                data = res.data;
            var options = [];

            if (status == 0 && Array.isArray(data.fields)) {
              var _iterator4 = Object(createForOfIteratorHelper["a" /* default */])(data.fields),
                  _step4;

              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  var item = _step4.value;
                  options.push({
                    title: item.remark,
                    name: item.name
                  });
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
            }

            callback && callback(options);
          }
        });
      }
    },

    /**
     * @param {string} dataId 数据集ID
     * @param {(sqlData) => {}} callback 回调方法
     * 加载SQL数据集数据
     */
    loadSqlDatasetData: function loadSqlDatasetData(dataId, callback) {
      newtecRequest({
        operServiceId: "sqlDatasetService",
        operId: "queryDatasetData",
        data: dataId,
        success: function success(res) {
          var status = res.status,
              data = res.data;

          if (status == 0 && data) {
            callback && callback(data);
          }
        }
      });
    },
    onSelectApiDataset: function onSelectApiDataset(value) {
      this.customColorNameList = [];
      var arr = this.apiDatasets.filter(function (item) {
        return item.dbId === value;
      });
      this.onDatasetIdChange(value);

      if (arr.length > 0) {
        this.dataSettings["dbCode"] = arr[0].code;
        this.dataSettings["apiUrl"] = arr[0].apiUrl;
        var id = this.echartInfo.id;
        this.dataSettings["chartType"] = this.selectedChartType;
        this.dataSettings["chartId"] = this.selectedChartId;
        this.dataSettings["run"] = 1; // this.runByDataSettings(id, this.chartOptions, this.dataSettings);
      }
    },
    runChart: function runChart() {
      var id = this.echartInfo.id;
      this.dataSettings["chartType"] = this.selectedChartType;
      this.dataSettings["chartId"] = this.selectedChartId;
      this.dataSettings["run"] = 1;
      this.runByDataSettings(id, this.chartOptions, this.dataSettings);
    },

    /**
     * 刷新图表
     * @param chartId 图表id
     * @param options 图表options
     * @param settings 图表extData
     */
    runByDataSettings: function runByDataSettings(chartId, options, settings) {
      var _this15 = this;

      var dataId = settings.dataId;
      var that = this;

      if (settings.dataType === "sql") {
        this.loadSqlDatasetData(dataId, function (sqlData) {
          // 如果是关系图
          if (settings["chartType"] === "graph.simple") {
            _this15.loadSqlDatasetData(settings.dataId1, function (res) {
              var source = settings.source,
                  target = settings.target;
              var links = res.map(function (item, index) {
                return {
                  source: item[source],
                  target: item[target]
                };
              });
              design["h" /* refreshChart */].call(_this15, chartId, options, settings, {
                data: sqlData,
                links: links
              });
            });
          } else {
            design["h" /* refreshChart */].call(_this15, chartId, options, settings, sqlData);
          }
        });
      } else if (settings.dataType === "api") {
        // API数据集
        Object.assign(settings, {
          axisX: settings.axisX,
          axisY: settings.axisY,
          series: settings.series
        });

        if (settings.apiStatus == "0") {
          // 静态数据
          design["h" /* refreshChart */].call(this, chartId, options, settings, JSON.parse(that.apiStaticData));
        } else if (settings.apiStatus == "1") {
          newtecRequest({
            operServiceId: "apiDatasetService",
            operId: "queryDatasetData",
            data: dataId,
            success: function success(res) {
              var status = res.status,
                  data = res.data;

              if (status == 0) {
                // let result = settings["chartType"] === "graph.simple" ? res : res.data;
                design["h" /* refreshChart */].call(_this15, chartId, options, settings, data);
              }
            }
          });
        } else if (settings.apiStatus == "2") {
          httpGet({
            url: settings.apiUrl,
            success: function success(res) {
              if (res.option) {
                // 判断请求到的 json 的数据类型
                design["c" /* getSelectType */].call(that, res.option);
                var chartExtData = Object.assign(settings, {
                  dataId: chartId,
                  chartType: that.selectedChartType,
                  chartId: _this15.selectedChartId
                });
                exportApi["a" /* default */].updateChart(chartId, res.option); //更新ExtData

                exportApi["a" /* default */].updateChartExtData(chartId, chartExtData);

                if (that.selectedChartType !== "apiUrlType") {
                  //绑定样式
                  design["e" /* handleChartOptions */].call(that, res.option);
                }
              }
            }
          });
        }
      }
    },
    // 将配置运行为图表
    echDataRun: function echDataRun() {
      var that = this;
      var id = that.echartInfo.id;
      if (!that.dataAllocation.selectOptionData.series) return;
      var charType = that.dataAllocation.selectOptionData.series[0].type; //动态api数据获取

      if (that.dataAllocation.dataType === "sqlechData" && that.dataAllocation.selectId != "") {
        var sqlxAxis = that.dataAllocation.sqlxAxis;
        var sqlseries = that.dataAllocation.sqlseries;
        var sqlgroup = that.dataAllocation.sqlgroup;
        var sqltype = that.dataAllocation.sqltype;
        var seriesTypeData = that.dataAllocation.seriesTypeData;
        $jm.qurestSql(that.dataAllocation, function (result) {
          var backObj = Object(design["g" /* querySqlData */])(charType, result, sqlxAxis, sqlseries, sqlgroup, seriesTypeData, that.dataAllocation.optionData);
          that.dataAllocation.optionData = JSON.stringify(backObj);
        });
      } else if (that.dataAllocation.dataType === "apiechData" && that.dataAllocation.selectId != "") {
        if (that.dataAllocation.status == "dynamicData") {
          $jm.qurestApi(that.dataAllocation, function (res) {
            var backObj = Object(design["f" /* queryApiData */])(charType, res, that.dataAllocation.optionData);
            that.dataAllocation.optionData = JSON.stringify(backObj);
          });
        }
      } //静态数据组装json


      var options = Object(design["b" /* config2Json */])(that.echartInfo, that.dataAllocation.optionData, this.dataAllocation.selectOptionData); //通过id修改配置

      var chartExtData = {};
      chartExtData.dataType = that.dataAllocation.dataType;
      chartExtData.status = that.dataAllocation.status;
      chartExtData.selectId = that.dataAllocation.selectId;
      chartExtData.sqlxAxis = that.dataAllocation.sqlxAxis;
      chartExtData.sqlseries = that.dataAllocation.sqlseries;
      chartExtData.sqlgroup = that.dataAllocation.sqlgroup;
      chartExtData.sqltype = that.dataAllocation.sqltype;
      chartExtData.seriesTypeData = that.dataAllocation.seriesTypeData;
      exportApi["a" /* default */].updateChart(id, options);
      exportApi["a" /* default */].updateChartExtData(id, chartExtData);
      var data = {};
      data.id = id;
      data.options = options;
      data.extData = chartExtData;
      this.selectChart(data);
    },
    // 打开图表选择弹框
    addChartModule: function addChartModule() {
      this.selectedChartType = "";
      this.selectedChartId = "";
      this.chartModule = true;
    },
    dataTypeChange: function dataTypeChange() {
      this.seriesTypeData = [];
      var that = this,
          type = this.dataSettings.dataType;

      if (type == "api" || type == "sql") {
        newtecRequest({
          operServiceId: "".concat(type, "DatasetService"),
          operId: "getDatasetIdAndName",
          data: exportApi["a" /* default */].reportId,
          success: function success(res) {
            var status = res.status,
                data = res.data;
            var options = [];

            if (status == 0) {
              var _iterator5 = Object(createForOfIteratorHelper["a" /* default */])(data),
                  _step5;

              try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                  var item = _step5.value;
                  options.push({
                    title: "".concat(item.name, "(").concat(item.id, ")"),
                    dbId: item.id
                  });
                }
              } catch (err) {
                _iterator5.e(err);
              } finally {
                _iterator5.f();
              }

              that["".concat(type, "Datasets")] = options;
            }
          }
        });
      }
    },
    // 页面有图表时显示样式和数据tab
    tabPaneShow: function tabPaneShow() {
      this.isChartSetting = true;
    },
    // 进入设计页面或刷新时运行所有图表
    refreshAllChart: function refreshAllChart(chartList) {
      var that = this;

      var _iterator6 = Object(createForOfIteratorHelper["a" /* default */])(chartList),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var item = _step6.value;
          var id = item.layer_id;
          var options = JSON.parse(item.config);
          that.runByDataSettings(id, options, item.extData);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    },
    // 添加表达式点击事件
    customExpression: function customExpression() {
      this.customExpressionShow = true;
    },
    // 左侧函数点击事件
    leftFunctionClick: function leftFunctionClick(index) {
      var functionListElement = this.functionList[index];
      this.newFunctionList = functionListElement.name.split(",");
      this.leftFunctionIndex = index;
      this.commonFunction = true;
    },
    // 右侧函数点击事件
    rightFunctionClick: function rightFunctionClick(val, index) {
      this.expression = "=" + val + "()";
      this.interpretation = val;
      this.rightFunctionIndex = index;
    },
    // 表达式保存
    expressionSave: function expressionSave() {
      exportApi["a" /* default */].setSelectCellExpress(this.expression);
      this.expressionCancel();
    },
    // 表达式取消
    expressionCancel: function expressionCancel() {
      this.expression = "";
      this.commonFunction = false;
      this.customExpressionShow = false;
      this.loading = false;
      this.leftFunctionIndex = -1;
      this.rightFunctionIndex = -1;
    },

    /**
     * API 类型改变事件
     * @param {number} value API 类型
     */
    apiTypeOnChage: function apiTypeOnChage(value) {
      if (value != 2) {
        this.seriesTypeData = [];
      }
    },
    // 添加字典点击事件
    createDictClick: function createDictClick() {
      this.$refs.dataDictionary.dictShow = true;
    }
  }
});
// CONCATENATED MODULE: ./src/components/ChartSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_ChartSettingvue_type_script_lang_js_ = (ChartSettingvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/ChartSetting.vue?vue&type=style&index=0&lang=css&
var ChartSettingvue_type_style_index_0_lang_css_ = __webpack_require__("e9bf");

// CONCATENATED MODULE: ./src/components/ChartSetting.vue






/* normalize component */

var ChartSetting_component = Object(componentNormalizer["a" /* default */])(
  components_ChartSettingvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ChartSetting = (ChartSetting_component.exports);
// CONCATENATED MODULE: ./src/packages/index.js







 // 所有需要用到的组件

var components = [ChartSetting];
/**
 * 定义初始化方法 必须调用
 * @param {Object} Vue 
 * @param {Object} [options={}] 
 */

var install = function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!install.componentInstalled) {
    // 注册组件
    components.map(function (component) {
      Vue.component(component.name, component);
    });
    install.componentInstalled = true;
  }
};

install(external_Vue_default.a);
var newtecChart = {
  init: init,
  exportApi: exportApi["a" /* default */]
};
/**
 * 初始化图表配置栏
 * @param {HTMLElement} outDom 
 * @param {Object} lang 语言
 */

function init(outDom) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var lang = arguments.length > 2 ? arguments[2] : undefined;
  // 初始化 API 信息
  var apiOptions = options.api;

  if (apiOptions && Object(esm_typeof["a" /* default */])(apiOptions) === 'object') {
    for (var key in apiOptions) {
      api[key] = apiOptions[key];
    }
  }

  var dom = document.createElement('div');
  dom.id = 'report-chart';
  outDom.appendChild(dom);
  new external_Vue_default.a({
    el: '#report-chart',
    data: function data() {
      return {
        lang: lang
      };
    },
    mounted: function mounted() {
      var chartSetting = this.$refs.chartSetting;

      newtecChart.loadChart = function (options) {
        chartSetting.selectChart(options);
      };

      newtecChart.selectChart = function () {
        chartSetting.addChartModule();
      };

      newtecChart.onClickCell = function (cell) {
        chartSetting.onClickCell(cell);
      };
    },
    template: "<chart-setting ref='chartSetting'></chart-setting>"
  });
}

if (!window.newtecChart) {
  window.newtecChart = newtecChart;
}

/* harmony default export */ var src_packages_0 = (newtecChart);
// CONCATENATED MODULE: ./node_modules/_@vue_cli-service@4.4.6@@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_packages_0);



/***/ }),

/***/ "98a5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__("3de9");
var definePropertyModule = __webpack_require__("d320");
var createPropertyDescriptor = __webpack_require__("1f88");

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ "9996":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("1f04");
var fails = __webpack_require__("7ce6");
var toIndexedObject = __webpack_require__("b7d9");
var nativeGetOwnPropertyDescriptor = __webpack_require__("38e3").f;
var DESCRIPTORS = __webpack_require__("8fe5");

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});


/***/ }),

/***/ "9b5f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var exec = __webpack_require__("5a62");

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),

/***/ "9d9a":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "9f6b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;


/***/ }),

/***/ "a123":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("2ccf");
var ownKeys = __webpack_require__("f725");
var getOwnPropertyDescriptorModule = __webpack_require__("38e3");
var definePropertyModule = __webpack_require__("d320");

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),

/***/ "a187":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("e6d2");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "a34a":
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__("2606");
var enumBugKeys = __webpack_require__("6d39");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "a447":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("baa9");
var defineProperties = __webpack_require__("e0d1");
var enumBugKeys = __webpack_require__("6d39");
var hiddenKeys = __webpack_require__("555d");
var html = __webpack_require__("4978");
var documentCreateElement = __webpack_require__("d7a5");
var sharedKey = __webpack_require__("6484");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject -- old IE */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),

/***/ "a5f8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var notARegExp = __webpack_require__("c6c0");
var requireObjectCoercible = __webpack_require__("4023");
var correctIsRegExpLogic = __webpack_require__("6b33");

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "a78d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");
var buildURL = __webpack_require__("c6da");
var InterceptorManager = __webpack_require__("bd59");
var dispatchRequest = __webpack_require__("5a56");
var mergeConfig = __webpack_require__("de7f");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "a7ac":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMatchSetting_vue_vue_type_style_index_0_id_1dca8cd0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("46cb");
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMatchSetting_vue_vue_type_style_index_0_id_1dca8cd0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartMatchSetting_vue_vue_type_style_index_0_id_1dca8cd0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "acce":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__("b22b");
var classof = __webpack_require__("07b4");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ "ad97":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_BarCodeSetting_vue_vue_type_style_index_0_id_5825bb34_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c050");
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_BarCodeSetting_vue_vue_type_style_index_0_id_5825bb34_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_BarCodeSetting_vue_vue_type_style_index_0_id_5825bb34_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "ae1d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _typeof; });
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("01e5");
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e487");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("27ae");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c2f8");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("591f");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("31e1");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("feb3");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_6__);







function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ "ae2b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var fails = __webpack_require__("7ce6");
var bind = __webpack_require__("0c1b");
var html = __webpack_require__("4978");
var createElement = __webpack_require__("d7a5");
var IS_IOS = __webpack_require__("2ed9");
var IS_NODE = __webpack_require__("2083");

var location = global.location;
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins -- safe
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func -- spec requirement
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    typeof postMessage == 'function' &&
    !global.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),

/***/ "afb0":
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__("941f");
var store = __webpack_require__("db94");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.9.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "afba":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "b126":
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__("1f04");
var DESCRIPTORS = __webpack_require__("8fe5");
var ownKeys = __webpack_require__("f725");
var toIndexedObject = __webpack_require__("b7d9");
var getOwnPropertyDescriptorModule = __webpack_require__("38e3");
var createProperty = __webpack_require__("98a5");

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});


/***/ }),

/***/ "b22b":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("3086");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "b3b0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var $includes = __webpack_require__("8141").includes;
var addToUnscopables = __webpack_require__("05e7");

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ "b418":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("baa9");
var aFunction = __webpack_require__("02ac");
var wellKnownSymbol = __webpack_require__("3086");

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};


/***/ }),

/***/ "b63d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _unsupportedIterableToArray; });
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5d08");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("27ae");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("1d43");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("7a3a");
/* harmony import */ var core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_from_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("591f");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fbb5");






function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return Object(_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Object(_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"])(o, minLen);
}

/***/ }),

/***/ "b7bb":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("baa9");
var isObject = __webpack_require__("97f5");
var newPromiseCapability = __webpack_require__("5b81");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "b7d9":
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__("4f06");
var requireObjectCoercible = __webpack_require__("4023");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "baa9":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("97f5");

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),

/***/ "bbee":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var createNonEnumerableProperty = __webpack_require__("28e6");
var has = __webpack_require__("2ccf");
var setGlobal = __webpack_require__("9448");
var inspectSource = __webpack_require__("3689");
var InternalStateModule = __webpack_require__("28d0");

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});


/***/ }),

/***/ "bc12":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("7ce6");

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
module.exports = function (METHOD_NAME) {
  return fails(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};


/***/ }),

/***/ "bc46":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "bd59":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "bd91":
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__("1188");
var has = __webpack_require__("2ccf");
var wrappedWellKnownSymbolModule = __webpack_require__("ca66");
var defineProperty = __webpack_require__("d320").f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),

/***/ "bf2f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var toAbsoluteIndex = __webpack_require__("5156");
var toInteger = __webpack_require__("e6d2");
var toLength = __webpack_require__("a187");
var toObject = __webpack_require__("f8d3");
var arraySpeciesCreate = __webpack_require__("6827");
var createProperty = __webpack_require__("98a5");
var arrayMethodHasSpeciesSupport = __webpack_require__("7041");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),

/***/ "bfd8":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ "c050":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "c11d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__("8e50").charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ "c2f8":
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__("bd91");

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),

/***/ "c462":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "c529":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("7ce6");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "c6c0":
/***/ (function(module, exports, __webpack_require__) {

var isRegExp = __webpack_require__("d192");

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),

/***/ "c6da":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "ca00":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4116");
/* harmony import */ var D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ae1d");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("3337");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("62f9");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("5b12");
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("9b5f");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("3bae");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("24a8");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("fc13");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_8__);









/* harmony default export */ __webpack_exports__["a"] = ({
  /**
   * 实际配置转图表option 单个
   * @param setting
   * @returns {{}}
   */
  setting2Option: function setting2Option(setting) {
    var _this = this;

    var option = {};
    Object.keys(setting).map(function (key) {
      var str = setting[key];

      if (str && Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(str) == 'object' && str.constructor == Array) {
        option[key] = Object(D_CompanyFiles_report_plugins_reportChart_node_modules_babel_runtime_7_13_9_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(str);
      } else if (key.indexOf('_') > 0) {
        var arr = key.split('_');

        _this.handleMultiUnderline(str, option, arr, 0);
      } else {
        option[key] = str;
      }
    });
    return option;
  },
  //处理多段下划线属性
  handleMultiUnderline: function handleMultiUnderline(value, obj, arr, index) {
    var key = arr[index];

    if (index == arr.length - 1) {
      obj[key] = value;
      return;
    }

    if (!obj[key]) {
      obj[key] = {};
    }

    this.handleMultiUnderline(value, obj[key], arr, ++index);
  },
  //百分数格式化
  percentFormat: function percentFormat(val) {
    return val + '%';
  },

  /**
   * 实际配置转图表array 多个
   * @param setting
   * @returns []
   */
  setting2Array: function setting2Array(setting) {
    var _this2 = this;

    var array = [];
    setting.forEach(function (item) {
      var option = _this2.setting2Option(item);

      array.push(option);
    });
    return array;
  },
  //通过百分数转化 获取实际数字
  getNumberFromPercent: function getNumberFromPercent(p) {
    var suffix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (!p) {
      return 0;
    }

    return Number((p + '').replace('%', '').replace(suffix, ''));
  },
  //将数据列表按某个字段进行分组
  arrayGroupBy: function arrayGroupBy(list, field) {
    var sorted = this.groupBy(list, function (item) {
      return [item[field]];
    });
    return sorted;
  },
  groupBy: function groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }
});

/***/ }),

/***/ "ca66":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("3086");

exports.f = wellKnownSymbol;


/***/ }),

/***/ "caa5":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_DataDictionarySetting_vue_vue_type_style_index_0_id_366d0569_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9d9a");
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_DataDictionarySetting_vue_vue_type_style_index_0_id_366d0569_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_DataDictionarySetting_vue_vue_type_style_index_0_id_366d0569_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "cc2e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("8fe5");
var fails = __webpack_require__("7ce6");
var objectKeys = __webpack_require__("e505");
var getOwnPropertySymbolsModule = __webpack_require__("4b7d");
var propertyIsEnumerableModule = __webpack_require__("9f6b");
var toObject = __webpack_require__("f8d3");
var IndexedObject = __webpack_require__("4f06");

var nativeAssign = Object.assign;
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  /* global Symbol -- required for testing */
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;


/***/ }),

/***/ "cd08":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("baa9");

module.exports = function (iterator) {
  var returnMethod = iterator['return'];
  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};


/***/ }),

/***/ "d085":
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__("b7d9");
var nativeGetOwnPropertyNames = __webpack_require__("a34a").f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};


/***/ }),

/***/ "d0fa":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__("59bf").forEach;
var arrayMethodIsStrict = __webpack_require__("d714");

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),

/***/ "d192":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("97f5");
var classof = __webpack_require__("36b2");
var wellKnownSymbol = __webpack_require__("3086");

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),

/***/ "d1d6":
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__("d320").f;
var has = __webpack_require__("2ccf");
var wellKnownSymbol = __webpack_require__("3086");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ "d259":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "d260":
/***/ (function(module, exports, __webpack_require__) {

var userAgent = __webpack_require__("3902");

module.exports = /web0s(?!.*chrome)/i.test(userAgent);


/***/ }),

/***/ "d320":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("8fe5");
var IE8_DOM_DEFINE = __webpack_require__("e15d");
var anObject = __webpack_require__("baa9");
var toPrimitive = __webpack_require__("3de9");

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "d447":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefine = __webpack_require__("bbee");
var anObject = __webpack_require__("baa9");
var fails = __webpack_require__("7ce6");
var flags = __webpack_require__("2e38");

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}


/***/ }),

/***/ "d714":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("7ce6");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),

/***/ "d7a5":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var isObject = __webpack_require__("97f5");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "db94":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var setGlobal = __webpack_require__("9448");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),

/***/ "dc9c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "dd95":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("7ce6");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "de7f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "e0d1":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("8fe5");
var definePropertyModule = __webpack_require__("d320");
var anObject = __webpack_require__("baa9");
var objectKeys = __webpack_require__("e505");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),

/***/ "e15d":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("8fe5");
var fails = __webpack_require__("7ce6");
var createElement = __webpack_require__("d7a5");

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "e3b5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var $filter = __webpack_require__("59bf").filter;
var arrayMethodHasSpeciesSupport = __webpack_require__("7041");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "e487":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__("1f04");
var DESCRIPTORS = __webpack_require__("8fe5");
var global = __webpack_require__("f14a");
var has = __webpack_require__("2ccf");
var isObject = __webpack_require__("97f5");
var defineProperty = __webpack_require__("d320").f;
var copyConstructorProperties = __webpack_require__("a123");

var NativeSymbol = global.Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),

/***/ "e505":
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__("2606");
var enumBugKeys = __webpack_require__("6d39");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "e6a2":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),

/***/ "e6d2":
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),

/***/ "e8a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__("2b31");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "e8d3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var createIteratorConstructor = __webpack_require__("8b9c");
var getPrototypeOf = __webpack_require__("11d8");
var setPrototypeOf = __webpack_require__("721d");
var setToStringTag = __webpack_require__("d1d6");
var createNonEnumerableProperty = __webpack_require__("28e6");
var redefine = __webpack_require__("bbee");
var wellKnownSymbol = __webpack_require__("3086");
var IS_PURE = __webpack_require__("941f");
var Iterators = __webpack_require__("4de8");
var IteratorsCore = __webpack_require__("1bc7");

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),

/***/ "e904":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var getOwnPropertyDescriptor = __webpack_require__("38e3").f;
var macrotask = __webpack_require__("ae2b").set;
var IS_IOS = __webpack_require__("2ed9");
var IS_WEBOS_WEBKIT = __webpack_require__("d260");
var IS_NODE = __webpack_require__("2083");

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};


/***/ }),

/***/ "e9bf":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartSetting_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7282");
/* harmony import */ var _node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartSetting_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_0_9_0_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_3_6_0_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_15_9_6_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_3_0_0_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_4_1_0_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_15_9_6_vue_loader_lib_index_js_vue_loader_options_ChartSetting_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "ea94":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("1f04");
var $trim = __webpack_require__("f8d5").trim;
var forcedStringTrimMethod = __webpack_require__("ed58");

// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});


/***/ }),

/***/ "ed58":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("7ce6");
var whitespaces = __webpack_require__("6a8c");

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};


/***/ }),

/***/ "eef6":
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    setTimeout(function () {
        fn.apply(null, args);
    }, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__("6266");
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),

/***/ "f076":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _defineProperty; });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "f11f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__("7cb5");
var normalizeHeaderName = __webpack_require__("3269");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__("5e03");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__("5e03");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("eef6")))

/***/ }),

/***/ "f14a":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  /* global globalThis -- safe */
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("2409")))

/***/ }),

/***/ "f180":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__("0c1b");
var toObject = __webpack_require__("f8d3");
var callWithSafeIterationClosing = __webpack_require__("fd17");
var isArrayIteratorMethod = __webpack_require__("1a0a");
var toLength = __webpack_require__("a187");
var createProperty = __webpack_require__("98a5");
var getIteratorMethod = __webpack_require__("203f");

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ "f2b1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("7cb5");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "f725":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("902e");
var getOwnPropertyNamesModule = __webpack_require__("a34a");
var getOwnPropertySymbolsModule = __webpack_require__("4b7d");
var anObject = __webpack_require__("baa9");

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "f8d3":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("4023");

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "f8d5":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("4023");
var whitespaces = __webpack_require__("6a8c");

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ }),

/***/ "fbb5":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _arrayLikeToArray; });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "fc13":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__("9194");
var anObject = __webpack_require__("baa9");
var toLength = __webpack_require__("a187");
var toInteger = __webpack_require__("e6d2");
var requireObjectCoercible = __webpack_require__("4023");
var advanceStringIndex = __webpack_require__("c11d");
var getSubstitution = __webpack_require__("73da");
var regExpExec = __webpack_require__("1a58");

var max = Math.max;
var min = Math.min;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];
});


/***/ }),

/***/ "fd17":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("baa9");
var iteratorClose = __webpack_require__("cd08");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    iteratorClose(iterator);
    throw error;
  }
};


/***/ }),

/***/ "feb3":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("f14a");
var DOMIterables = __webpack_require__("8c0f");
var ArrayIteratorMethods = __webpack_require__("31e1");
var createNonEnumerableProperty = __webpack_require__("28e6");
var wellKnownSymbol = __webpack_require__("3086");

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}


/***/ })

/******/ });
//# sourceMappingURL=newtecchart.common.js.map