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
    function Loader(cxt) {
        this.resources = new Map();
        this.tasks = [];
        this._loadThen = function () { };
        this._cxt = cxt;
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
                return res.arrayBuffer();
            }).then(function (data) {
                return _this._cxt.decodeAudioData(data);
            }).then(function (buf) {
                _this.resources.set(id, buf);
                resolve(buf);
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
        this.children = [];
        this.loader = new loader_1.default(this.cxt);
        this._masterGain.connect(this.cxt.destination);
        for (var i = 0, len = this._unlockEvents.length; i < len; i++) {
            document.addEventListener(this._unlockEvents[i], this._initContext.bind(this), { once: true });
        }
        this._initContext();
    }
    SoundMaster.prototype._initContext = function () {
        if (this.cxt.state === 'suspended') {
            this.cxt.resume();
        }
        for (var i = 0, len = this._unlockEvents.length; i < len; i++) {
            document.removeEventListener(this._unlockEvents[i], this._initContext.bind(this));
        }
    };
    SoundMaster.prototype.addResource = function (id, src) {
        this.loader.add(id, src);
        return this;
    };
    SoundMaster.prototype.loadAll = function () {
        this.loader.loadAll();
    };
    SoundMaster.prototype.addChild = function (sound) {
        this.children.push(sound);
        sound.acquireContext(this.cxt);
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
//メモ　detune.value は +100で1/12オクターブ上　+1200で1オクターブ上 -1200で1オクターブ下
var Sound = /** @class */ (function () {
    function Sound(buf, options) {
        this._playing = false;
        this._duration = 0;
        this._startedTime = 0;
        this._playedTime = 0;
        this._loop = false;
        this._volume = 1;
        this._pitch = 1;
        this._buffer = buf;
        this._duration = buf.duration;
        this.loop = (options === null || options === void 0 ? void 0 : options.loop) || false;
        this.volume = (options === null || options === void 0 ? void 0 : options.volume) || 1;
    }
    Object.defineProperty(Sound.prototype, "buffer", {
        set: function (buffer) {
            this._buffer = buffer;
            this._duration = buffer.duration;
        },
        enumerable: false,
        configurable: true
    });
    Sound.prototype.acquireContext = function (cxt) {
        this._cxt = cxt;
        this._gainNode = cxt.createGain();
        this._gainNode.connect(this._cxt.destination);
    };
    Sound.prototype.reStart = function () {
        this.play(this._playedTime);
    };
    Sound.prototype.start = function () {
        this._playedTime = 0;
        this.play(0);
    };
    Sound.prototype.play = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (!this._cxt || !this._buffer || !this._gainNode) {
            return;
        }
        var cxt = this._cxt;
        this._sourceNode = cxt.createBufferSource();
        this._sourceNode.buffer = this._buffer;
        this._sourceNode.loop = this._loop;
        this._sourceNode.playbackRate.value = this._pitch;
        this._gainNode.gain.value = this._volume;
        var sourceNode = this._sourceNode;
        sourceNode.connect(this._gainNode);
        sourceNode.start(0, offset);
        this._sourceNode = sourceNode;
        this._startedTime = cxt.currentTime;
        this._playing = true;
        if (!this.loop) {
            if (this._endTimer)
                this._clearTimer();
            this._endTimer = setTimeout(this._endThen.bind(this), this._duration * 1000 / this._pitch);
        }
    };
    Sound.prototype.stop = function () {
        if (this._playing && this._sourceNode) {
            this._sourceNode.stop(0);
            this._sourceNode.disconnect(0);
            this._endThen();
        }
    };
    Sound.prototype.pause = function () {
        if (this._playing) {
            this._playedTime = (this._playedTime + this._cxt.currentTime - this._startedTime) % this._duration;
            this._playing = false;
            this._sourceNode.stop(0);
            this._clearTimer();
        }
    };
    Sound.prototype._clearTimer = function () {
        clearTimeout(this._endTimer);
        this._endTimer = undefined;
    };
    Sound.prototype._endThen = function () {
        this._playing = false;
        this._playedTime = 0;
        this._sourceNode.disconnect(0);
    };
    Object.defineProperty(Sound.prototype, "playing", {
        get: function () {
            return this._playing;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "loop", {
        get: function () {
            return this._loop;
        },
        set: function (flag) {
            this._loop = flag;
            if (this._sourceNode) {
                this._sourceNode.loop = flag;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            if (this._gainNode) {
                this._gainNode.gain.value = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "pitch", {
        get: function () {
            return this._pitch;
        },
        set: function (value) {
            this._pitch = value;
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