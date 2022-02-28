(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("NARAS", [], factory);
	else if(typeof exports === 'object')
		exports["NARAS"] = factory();
	else
		root["NARAS"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SoundMaster = exports.Sound = void 0;
var sound_1 = __importDefault(__webpack_require__(/*! ./sound */ "./src/sound.ts"));
exports.Sound = sound_1.default;
var master_1 = __importDefault(__webpack_require__(/*! ./master */ "./src/master.ts"));
exports.SoundMaster = master_1.default;


/***/ }),

/***/ "./src/loader.ts":
/*!***********************!*\
  !*** ./src/loader.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Loader = /** @class */ (function () {
    function Loader() {
        this.resources = new Map();
        this.tasks = [];
        this._loadThen = function () { };
    }
    Loader.prototype.add = function (id, src) {
        var promise = this._promiseLoadingSound(id, src);
        this.tasks.push(promise);
        return this;
    };
    Loader.prototype.loadAll = function () {
        var _this = this;
        Promise.all(this.tasks)
            .then(function () { _this._loadThen(); });
    };
    Loader.prototype.loadThen = function (func) {
        this._loadThen = func;
    };
    Loader.prototype._promiseLoadingSound = function (id, src) {
        var _this = this;
        var promise = new Promise(function (resolve) {
            fetch(src).then(function (res) {
                var data = res.arrayBuffer();
                _this.resources.set(id, data);
                resolve(data);
            });
        });
        return promise;
    };
    Loader.prototype.get = function (id) {
        return this.resources.get(id);
    };
    return Loader;
}());
exports["default"] = Loader;


/***/ }),

/***/ "./src/master.ts":
/*!***********************!*\
  !*** ./src/master.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var loader_1 = __importDefault(__webpack_require__(/*! ./loader */ "./src/loader.ts"));
var AudioContext = window.AudioContext || window.webkitAudioContext;
var SoundMaster = /** @class */ (function () {
    function SoundMaster() {
        this.cxt = new AudioContext();
        this._masterGain = this.cxt.createGain();
        this._unlockEvents = ['click', 'scroll', 'touchstart'];
        this.loader = new loader_1.default();
        this._masterGain.connect(this.cxt.destination);
        //for(let i=0, len=this._unlockEvents.length;i<len;i++){
        //    document.addEventListener(this._unlockEvents[i], this._initContext.bind(this), {once: true});
        //}
        this.initContext();
    }
    SoundMaster.prototype.initContext = function () {
        if (this.cxt.state === 'suspended') {
            this.cxt.resume();
        }
        for (var i = 0, len = this._unlockEvents.length; i < len; i++) {
            document.removeEventListener(this._unlockEvents[i], this.initContext.bind(this));
        }
    };
    return SoundMaster;
}());
exports["default"] = SoundMaster;


/***/ }),

/***/ "./src/sound.ts":
/*!**********************!*\
  !*** ./src/sound.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Sound = /** @class */ (function () {
    function Sound(acxt) {
        this._duration = 0;
        this.playing = false;
        this._volume = 1;
        this._loop = false;
        this._startTime = 0;
        this.playedTime = 0;
        this.acxt = acxt;
        var cxt = acxt.cxt;
        this._bufferSource = cxt.createBufferSource();
        this._gainNode = cxt.createGain();
        this._gainNode.connect(cxt.destination);
    }
    Sound.prototype.play = function () {
        var cxt = this.acxt.cxt;
        var sourceBuffer = cxt.createBufferSource();
        sourceBuffer.buffer = this._buffer;
        sourceBuffer.loop = this._loop;
        sourceBuffer.connect(this._gainNode);
        sourceBuffer.start(0, this.playedTime);
        this._bufferSource = sourceBuffer;
        this._startTime = cxt.currentTime;
        this.playing = true;
        if (!this._loop)
            this._endTimer = setTimeout(this.endThen.bind(this), this._duration * 1000);
    };
    Sound.prototype.pause = function () {
        if (this.playing) {
            this.playedTime = (this.playedTime + this.acxt.cxt.currentTime - this._startTime) % this._duration;
            this.playing = false;
            this._bufferSource.stop(0);
            this._clearTimer();
        }
    };
    Sound.prototype._clearTimer = function () {
        clearTimeout(this._endTimer);
    };
    Sound.prototype.stop = function () {
        if (this.playing)
            this._bufferSource.stop(0);
        this.endThen();
    };
    Sound.prototype.endThen = function () {
        this.playing = false;
        this._bufferSource.disconnect(0);
    };
    Object.defineProperty(Sound.prototype, "buffer", {
        set: function (buf) {
            this._buffer = buf;
            this._duration = buf.duration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "volume", {
        set: function (vol) {
            this._volume = vol;
            this._gainNode.gain.value = vol;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "loop", {
        get: function () {
            return this._loop;
        },
        set: function (bool) {
            this._loop = bool;
        },
        enumerable: false,
        configurable: true
    });
    return Sound;
}());
exports["default"] = Sound;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=bundle.js.map