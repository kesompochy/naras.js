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

/***/ "./src/application.ts":
/*!****************************!*\
  !*** ./src/application.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var loader_1 = __importDefault(__webpack_require__(/*! ./loader */ "./src/loader.ts"));
var master_1 = __importDefault(__webpack_require__(/*! ./master */ "./src/master.ts"));
var container_1 = __webpack_require__(/*! ./container */ "./src/container.ts");
var App = /** @class */ (function () {
    function App() {
        this.loader = new loader_1.default();
        this.masterContainer = new container_1.MasterContainer();
        this._unlockEvents = ['click', 'scroll', 'touchstart'];
        for (var i = 0, len = this._unlockEvents.length; i < len; i++) {
            document.addEventListener(this._unlockEvents[i], this._initContext.bind(this), { once: true });
        }
        this._initContext();
    }
    App.prototype._initContext = function () {
        if (master_1.default.cxt.state === 'suspended') {
            master_1.default.cxt.resume();
        }
        for (var i = 0, len = this._unlockEvents.length; i < len; i++) {
            document.removeEventListener(this._unlockEvents[i], this._initContext.bind(this));
        }
    };
    App.prototype.addResource = function (id, src) {
        this.loader.add(id, src);
        return this;
    };
    App.prototype.loadAll = function () {
        this.loader.loadAll();
    };
    App.prototype.loadThen = function (func) {
        this.loader.loadThen(func);
    };
    return App;
}());
exports["default"] = App;


/***/ }),

/***/ "./src/container.ts":
/*!**************************!*\
  !*** ./src/container.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MasterContainer = exports.defaultOptions = void 0;
var master_1 = __importDefault(__webpack_require__(/*! ./master */ "./src/master.ts"));
var AbstractSounder = /** @class */ (function () {
    function AbstractSounder() {
    }
    return AbstractSounder;
}());
var defaultDelayParams = {
    interval: 1,
    attenuation: 0.5
};
exports.defaultOptions = {
    volume: 1,
    loop: false,
    pitch: 1,
    delay: defaultDelayParams
};
var ActionFuncsName;
(function (ActionFuncsName) {
    ActionFuncsName["play"] = "play";
    ActionFuncsName["stop"] = "stop";
    ActionFuncsName["restart"] = "restart";
    ActionFuncsName["pause"] = "pause";
})(ActionFuncsName || (ActionFuncsName = {}));
;
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container(options) {
        var _this = _super.call(this) || this;
        //すべてのContainerは音をinputNodeから取り込み、gainNodeから排出していくことにする。
        _this._cxt = master_1.default.cxt;
        _this._inputNode = master_1.default.cxt.createGain();
        _this.outputNode = master_1.default.cxt.createGain();
        _this._gainNode = master_1.default.cxt.createGain();
        _this._attenuationNode = master_1.default.cxt.createGain();
        _this._delayNode = master_1.default.cxt.createDelay();
        _this._delaySwitch = master_1.default.cxt.createGain();
        _this._pannerNode = master_1.default.cxt.createPanner();
        _this._volume = 1;
        _this._pitch = 1;
        _this._delay = defaultDelayParams;
        _this.children = [];
        _this.actionFuncs = { play: _this.playFunc, stop: _this.stopFunc, restart: _this.restartFunc, pause: _this.pauseFunc };
        _this.playFunc = function () { };
        _this.stopFunc = function () { };
        _this.pauseFunc = function () { };
        _this.restartFunc = function () { };
        _this._inputNode.connect(_this._gainNode);
        _this._gainNode.connect(_this._pannerNode);
        _this._pannerNode.connect(_this.outputNode);
        _this._attenuationNode.connect(_this._delayNode);
        _this._delayNode.connect(_this._attenuationNode);
        _this._delayNode.connect(_this._delaySwitch);
        if (!options)
            options = exports.defaultOptions;
        _this.volume = options.volume || exports.defaultOptions.volume;
        _this.pitch = options.pitch || exports.defaultOptions.pitch;
        if (options.delay) {
            _this.useDelay();
            _this.delay = options.delay;
        }
        _this._inputNode.connect(_this._delayNode);
        return _this;
    }
    Container.prototype.useDelay = function () {
        this._delaySwitch.connect(this._gainNode);
    };
    Container.prototype.unuseDelay = function () {
        this._delaySwitch.disconnect(0);
    };
    Container.prototype.addChild = function (obj) {
        this.children.push(obj);
        obj.outputNode.connect(this._inputNode);
        obj.parent = this;
    };
    Container.prototype._makeAllChildrenDo = function (funcName) {
        var children = this.children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i].actionFuncs[funcName]();
        }
    };
    Container.prototype.play = function () {
        this.playFunc();
        this._makeAllChildrenDo(ActionFuncsName.play);
    };
    Container.prototype.stop = function () {
        this.stopFunc();
        this._makeAllChildrenDo(ActionFuncsName.stop);
    };
    Container.prototype.pause = function () {
        this.pauseFunc();
        this._makeAllChildrenDo(ActionFuncsName.pause);
    };
    Container.prototype.restart = function () {
        this.restartFunc();
        this._makeAllChildrenDo(ActionFuncsName.restart);
    };
    Object.defineProperty(Container.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            this._gainNode.gain.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "pitch", {
        get: function () {
            return this._pitch;
        },
        set: function (value) {
            this._pitch = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "worldPitch", {
        get: function () {
            if (this.parent) {
                return this.parent.worldPitch * this.parent.pitch;
            }
            else {
                return 1;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "delay", {
        get: function () {
            return this._delay;
        },
        set: function (options) {
            this._delay = options;
            this._attenuationNode.gain.value = options.attenuation;
            this._delayNode.delayTime.value = options.interval;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "delayIntarval", {
        get: function () {
            return this._delay.interval;
        },
        set: function (value) {
            value = Math.max(value, 0);
            this._delay.interval = value;
            this._delayNode.delayTime.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "delayAttenuation", {
        get: function () {
            return this._delay.attenuation;
        },
        set: function (value) {
            value = Math.max(value, 0);
            this._delay.attenuation = value;
            this._attenuationNode.gain.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "panX", {
        get: function () {
            return this._pannerNode.positionX.value;
        },
        set: function (value) {
            this._pannerNode.positionX.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "panY", {
        get: function () {
            return this._pannerNode.positionY.value;
        },
        set: function (value) {
            this._pannerNode.positionY.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "panZ", {
        get: function () {
            return this._pannerNode.positionZ.value;
        },
        set: function (value) {
            this._pannerNode.positionZ.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Container.prototype.setPanning = function (x, y, z) {
        if (!y || !z) {
            if (isFinite(x))
                this._pannerNode.positionX.value = this._pannerNode.positionY.value = this._pannerNode.positionZ.value = x;
        }
        else if (!z) {
            if (isFinite(x) && isFinite(y)) {
                this._pannerNode.positionX.value = x;
                this._pannerNode.positionY.value = y;
            }
        }
        else {
            if (isFinite(x) && isFinite(y) && isFinite(z)) {
                this._pannerNode.positionX.value = x;
                this._pannerNode.positionY.value = y;
                this._pannerNode.positionZ.value = z;
            }
        }
    };
    return Container;
}(AbstractSounder));
exports["default"] = Container;
var MasterContainer = /** @class */ (function (_super) {
    __extends(MasterContainer, _super);
    function MasterContainer() {
        var _this = _super.call(this) || this;
        _this.outputNode.connect(master_1.default.cxt.destination);
        return _this;
    }
    return MasterContainer;
}(Container));
exports.MasterContainer = MasterContainer;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Container = exports.App = exports.SoundMaster = exports.Sound = void 0;
var sound_1 = __importDefault(__webpack_require__(/*! ./sound */ "./src/sound.ts"));
exports.Sound = sound_1.default;
var master_1 = __importDefault(__webpack_require__(/*! ./master */ "./src/master.ts"));
exports.SoundMaster = master_1.default;
var application_1 = __importDefault(__webpack_require__(/*! ./application */ "./src/application.ts"));
exports.App = application_1.default;
var container_1 = __importDefault(__webpack_require__(/*! ./container */ "./src/container.ts"));
exports.Container = container_1.default;


/***/ }),

/***/ "./src/loader.ts":
/*!***********************!*\
  !*** ./src/loader.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var master_1 = __importDefault(__webpack_require__(/*! ./master */ "./src/master.ts"));
var Loader = /** @class */ (function () {
    function Loader() {
        this._resources = new Map();
        this._datas = new Map();
        this._tasks = [];
        this._loadThen = function () { };
        this._cxt = master_1.default.cxt;
    }
    Loader.prototype.add = function (id, src) {
        var promise = this._promiseLoadingSound(id, src);
        this._tasks.push(promise);
        return this;
    };
    Loader.prototype.loadAll = function () {
        var _this = this;
        Promise.all(this._tasks)
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
                _this._datas.set(id, data);
                return _this._cxt.decodeAudioData(data);
            }).then(function (buf) {
                _this._resources.set(id, buf);
                resolve(buf);
            });
        });
        return promise;
    };
    Loader.prototype.getResource = function (id) {
        return this._resources.get(id);
    };
    Loader.prototype.getData = function (id) {
        return this._datas.get(id);
    };
    return Loader;
}());
exports["default"] = Loader;


/***/ }),

/***/ "./src/master.ts":
/*!***********************!*\
  !*** ./src/master.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var AudioContext = window.AudioContext || window.webkitAudioContext;
var Master = /** @class */ (function () {
    function Master() {
    }
    Master.cxt = new AudioContext();
    return Master;
}());
exports["default"] = Master;


/***/ }),

/***/ "./src/sound.ts":
/*!**********************!*\
  !*** ./src/sound.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var container_1 = __webpack_require__(/*! ./container */ "./src/container.ts");
var defaultSoundOptions = Object.assign(container_1.defaultOptions, { loop: false });
var container_2 = __importDefault(__webpack_require__(/*! ./container */ "./src/container.ts"));
var Sound = /** @class */ (function (_super) {
    __extends(Sound, _super);
    function Sound(buf, options) {
        var _this = _super.call(this, options) || this;
        _this._duration = 0;
        _this._playedTime = 0;
        _this._startedTime = 0;
        _this._loop = false;
        _this._playing = false;
        _this.reStartFunc = function () {
            _this._play(_this._playedTime);
        };
        _this.playFunc = function () {
            _this._playedTime = 0;
            _this._play(0);
        };
        _this.stopFunc = function () {
            if (_this._playing && _this._sourceNode) {
                _this._sourceNode.stop(0);
                _this._sourceNode.disconnect(0);
                _this._endThen();
            }
        };
        _this.pauseFunc = function () {
            if (_this._playing) {
                _this._playedTime = (_this._playedTime + _this._cxt.currentTime - _this._startedTime) % _this._duration;
                _this._playing = false;
                _this._sourceNode.stop(0);
            }
        };
        _this._buffer = buf;
        _this._duration = buf.duration;
        if (!options)
            options = defaultSoundOptions;
        _this.loop = options.loop || defaultSoundOptions.loop;
        _this.actionFuncs = { play: _this.playFunc, restart: _this.restartFunc, stop: _this.stopFunc, pause: _this.pauseFunc };
        return _this;
    }
    Object.defineProperty(Sound.prototype, "buffer", {
        set: function (buffer) {
            this._buffer = buffer;
            this._duration = buffer.duration;
        },
        enumerable: false,
        configurable: true
    });
    Sound.prototype._play = function (offset) {
        if (offset === void 0) { offset = 0; }
        if (!this._buffer) {
            return;
        }
        var cxt = this._cxt;
        this._sourceNode = cxt.createBufferSource();
        this._sourceNode.buffer = this._buffer;
        this._sourceNode.loop = this._loop;
        var realPitch = this.worldPitch * this._pitch;
        this._sourceNode.playbackRate.value = realPitch;
        var sourceNode = this._sourceNode;
        sourceNode.connect(this._inputNode);
        sourceNode.start(0, offset);
        this._sourceNode = sourceNode;
        this._startedTime = cxt.currentTime;
        this._playing = true;
        if (!this.loop) {
            var endTime = this._duration * 1000 / realPitch;
            setTimeout(this._disconnectSourceNode.bind(this), endTime, sourceNode);
            if (this._endTimer) {
                clearTimeout(this._endTimer);
                this._endTimer = undefined;
            }
            this._endTimer = setTimeout(this._endThen.bind(this), endTime);
        }
    };
    Sound.prototype._disconnectSourceNode = function (sourceNode) {
        sourceNode.disconnect(0);
    };
    Sound.prototype._endThen = function () {
        this._playing = false;
        this._playedTime = 0;
        this._endTimer = undefined;
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
    return Sound;
}(container_2.default));
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