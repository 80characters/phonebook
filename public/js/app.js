/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"/public/js/app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"./public/js/vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/css/app.sass":
/*!********************************!*\
  !*** ./resources/css/app.sass ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Ractive = __webpack_require__(/*! ractive */ "./node_modules/ractive/ractive.mjs")["default"];

var phonebookList = __webpack_require__(/*! ./components/phonebook/list/list */ "./resources/js/components/phonebook/list/list.js");

var signupForm = __webpack_require__(/*! ./components/auth/signup/signup */ "./resources/js/components/auth/signup/signup.js");

new Ractive({
  target: '#application',
  template: __webpack_require__(/*! ./app.mustache */ "./resources/js/app.mustache")["default"].toString(),
  data: {
    page: PAGE
  },
  components: {
    'app-header': __webpack_require__(/*! ./components/header/header */ "./resources/js/components/header/header.js"),
    'app-footer': __webpack_require__(/*! ./components/footer/footer */ "./resources/js/components/footer/footer.js"),
    'app-phonebook-list': phonebookList,
    'app-signup-form': signupForm
  },
  "goto": function goto(page) {
    if (!page) {
      return;
    }

    this.set('page', page);
  }
});

/***/ }),

/***/ "./resources/js/app.mustache":
/*!***********************************!*\
  !*** ./resources/js/app.mustache ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<app-header/>\n<section class=\"app\">\n    <div class=\"wrap\" id=\"{{page}}\">\n        {{#if page == 'SIGNUP'}}\n            <app-signup-form/>\n        {{else}}\n            <app-phonebook-list/>\n        {{/if}}\n    </div>\n</section>\n<app-footer/>");

/***/ }),

/***/ "./resources/js/components/auth/signup/signup.js":
/*!*******************************************************!*\
  !*** ./resources/js/components/auth/signup/signup.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Ractive = __webpack_require__(/*! ractive */ "./node_modules/ractive/ractive.mjs")["default"];

var service = __webpack_require__(/*! ../../../services/auth */ "./resources/js/services/auth.js")["default"];

var swal = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");

module.exports = Ractive.extend({
  template: __webpack_require__(/*! ./signup.mustache */ "./resources/js/components/auth/signup/signup.mustache")["default"].toString(),
  data: {},
  on: {
    signup: function signup(ctx) {
      var self = this;
      service.isAvaiable({
        email: self.get('email'),
        password: self.get('password')
      }).then(function (res) {
        swal.fire('Good job!', 'Welcome bro', 'success').then(function () {
          self.parent["goto"]('HOME');
        });
      })["catch"](function (err) {
        swal.fire(err.statusText);
      });
      return false;
    }
  }
});

/***/ }),

/***/ "./resources/js/components/auth/signup/signup.mustache":
/*!*************************************************************!*\
  !*** ./resources/js/components/auth/signup/signup.mustache ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<section class=\"signup\">\n    <form class=\"frm_signup\" on-submit=\"signup\">\n        <p>\n            <label for=\"email\">Email</label>\n            <input id=\"email\" type=\"email\" value=\"{{email}}\"/>\n        </p>\n        <p>\n            <label for=\"password\">Password</label>\n            <input id=\"password\" type=\"password\" value=\"{{password}}\"/>\n        </p>\n        <p>\n            <button type=\"submit\">Signup</button>\n        </p>\n    </form>\n</section>\n");

/***/ }),

/***/ "./resources/js/components/footer/footer.js":
/*!**************************************************!*\
  !*** ./resources/js/components/footer/footer.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Ractive = __webpack_require__(/*! ractive */ "./node_modules/ractive/ractive.mjs")["default"];

module.exports = Ractive.extend({
  template: __webpack_require__(/*! ./footer.mustache */ "./resources/js/components/footer/footer.mustache")["default"].toString(),
  data: {}
});

/***/ }),

/***/ "./resources/js/components/footer/footer.mustache":
/*!********************************************************!*\
  !*** ./resources/js/components/footer/footer.mustache ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<footer class=\"footer\">\n    <div class=\"wrap\">\n        <p>Made with <img src=\"/images/heart.svg\"/> ft. cafein!</p>\n    </div>\n</footer>\n");

/***/ }),

/***/ "./resources/js/components/header/header.js":
/*!**************************************************!*\
  !*** ./resources/js/components/header/header.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Ractive = __webpack_require__(/*! ractive */ "./node_modules/ractive/ractive.mjs")["default"];

module.exports = Ractive.extend({
  template: __webpack_require__(/*! ./header.mustache */ "./resources/js/components/header/header.mustache")["default"].toString(),
  data: {}
});

/***/ }),

/***/ "./resources/js/components/header/header.mustache":
/*!********************************************************!*\
  !*** ./resources/js/components/header/header.mustache ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<header class=\"header\">\n    <div class=\"wrap\">\n        <h1>Phonebook</h1>    \n    </div>\n</header>");

/***/ }),

/***/ "./resources/js/components/phonebook/list/list.js":
/*!********************************************************!*\
  !*** ./resources/js/components/phonebook/list/list.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Ractive = __webpack_require__(/*! ractive */ "./node_modules/ractive/ractive.mjs")["default"];

var service = __webpack_require__(/*! ../../../services/phonebooks */ "./resources/js/services/phonebooks.js")["default"];

module.exports = Ractive.extend({
  template: __webpack_require__(/*! ./list.mustache */ "./resources/js/components/phonebook/list/list.mustache")["default"].toString(),
  data: {},
  oncomplete: function oncomplete() {
    var self = this;
    service.getAll().then(function (items) {
      self.set('items', items);
    });
  }
});

/***/ }),

/***/ "./resources/js/components/phonebook/list/list.mustache":
/*!**************************************************************!*\
  !*** ./resources/js/components/phonebook/list/list.mustache ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<section class=\"phonebooks\">\n    {{#items}}\n        <article id=\"person-{{_id}}\" class=\"person\">\n            <h3>{{name}}</h3>\n            <div class=\"person__detail\">\n                <div>\n                    <img src=\"{{picture}}\"/>\n                </div>\n                <div>                    \n                    <p>Phone: {{phone}}</p>\n                    <p>Email: <a href=\"mailto:{{email}}\">{{email}}</a></p>                    \n                    <p>Address: {{address}}</p>\n                </div>\n            </div>\n            <p>{{about}}</p>         \n        </article>\n    {{/items}}\n</section>");

/***/ }),

/***/ "./resources/js/models/phonebook/collection.js":
/*!*****************************************************!*\
  !*** ./resources/js/models/phonebook/collection.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "./node_modules/backbone/backbone.js");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);


var model = __webpack_require__(/*! ./model */ "./resources/js/models/phonebook/model.js")["default"];

/* harmony default export */ __webpack_exports__["default"] = (backbone__WEBPACK_IMPORTED_MODULE_0___default.a.Collection.extend({
  url: '/phonebooks',
  model: model
}));

/***/ }),

/***/ "./resources/js/models/phonebook/model.js":
/*!************************************************!*\
  !*** ./resources/js/models/phonebook/model.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! backbone */ "./node_modules/backbone/backbone.js");
/* harmony import */ var backbone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(backbone__WEBPACK_IMPORTED_MODULE_0__);



/* harmony default export */ __webpack_exports__["default"] = (backbone__WEBPACK_IMPORTED_MODULE_0___default.a.Model.extend({
  idAttribute: '_id'
}));

/***/ }),

/***/ "./resources/js/services/auth.js":
/*!***************************************!*\
  !*** ./resources/js/services/auth.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");

var AuthService = {
  isAvaiable: function isAvaiable(params) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/auth//signup',
        method: 'post',
        type: 'json',
        data: params
      }).done(function (res) {
        resolve(res);
      }).fail(function (err) {
        reject(err);
      });
    });
  }
};
/* harmony default export */ __webpack_exports__["default"] = (AuthService);

/***/ }),

/***/ "./resources/js/services/phonebooks.js":
/*!*********************************************!*\
  !*** ./resources/js/services/phonebooks.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Collection = __webpack_require__(/*! ../models/phonebook/collection */ "./resources/js/models/phonebook/collection.js")["default"];

var PhonebookService = {
  getAll: function getAll() {
    return new Collection().fetch();
  }
};
/* harmony default export */ __webpack_exports__["default"] = (PhonebookService);

/***/ }),

/***/ 0:
/*!************************************************************!*\
  !*** multi ./resources/js/app.js ./resources/css/app.sass ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /home/thangtt/Documents/nodejs/80c-phonebook-server/resources/js/app.js */"./resources/js/app.js");
module.exports = __webpack_require__(/*! /home/thangtt/Documents/nodejs/80c-phonebook-server/resources/css/app.sass */"./resources/css/app.sass");


/***/ })

/******/ });
//# sourceMappingURL=app.js.map