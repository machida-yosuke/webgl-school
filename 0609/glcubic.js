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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @example
 * step 1: let a = new gl3Audio(bgmGainValue, soundGainValue) <- float(0.0 to 1.0)
 * step 2: a.load(url, index, loop, background) <- string, int, boolean, boolean
 * step 3: a.src[index].loaded then a.src[index].play()
 */

/**
 * gl3Audio
 * @class gl3Audio
 */
var gl3Audio = function () {
    /**
     * @constructor
     * @param {number} bgmGainValue - BGM の再生音量
     * @param {number} soundGainValue - 効果音の再生音量
     */
    function gl3Audio(bgmGainValue, soundGainValue) {
        _classCallCheck(this, gl3Audio);

        /**
         * オーディオコンテキスト
         * @type {AudioContext}
         */
        this.ctx = null;
        /**
         * ダイナミックコンプレッサーノード
         * @type {DynamicsCompressorNode}
         */
        this.comp = null;
        /**
         * BGM 用のゲインノード
         * @type {GainNode}
         */
        this.bgmGain = null;
        /**
         * 効果音用のゲインノード
         * @type {GainNode}
         */
        this.soundGain = null;
        /**
         * オーディオソースをラップしたクラスの配列
         * @type {Array.<AudioSrc>}
         */
        this.src = null;
        if (typeof AudioContext != 'undefined' || typeof webkitAudioContext != 'undefined') {
            if (typeof AudioContext != 'undefined') {
                this.ctx = new AudioContext();
            } else {
                this.ctx = new webkitAudioContext();
            }
            this.comp = this.ctx.createDynamicsCompressor();
            this.comp.connect(this.ctx.destination);
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.connect(this.comp);
            this.bgmGain.gain.setValueAtTime(bgmGainValue, 0);
            this.soundGain = this.ctx.createGain();
            this.soundGain.connect(this.comp);
            this.soundGain.gain.setValueAtTime(soundGainValue, 0);
            this.src = [];
        } else {
            throw new Error('not found AudioContext');
        }
    }

    /**
     * ファイルをロードする
     * @param {string} path - オーディオファイルのパス
     * @param {number} index - 内部プロパティの配列に格納するインデックス
     * @param {boolean} loop - ループ再生を設定するかどうか
     * @param {boolean} background - BGM として設定するかどうか
     * @param {function} callback - 読み込みと初期化が完了したあと呼ばれるコールバック
     */


    _createClass(gl3Audio, [{
        key: 'load',
        value: function load(path, index, loop, background, callback) {
            var ctx = this.ctx;
            var gain = background ? this.bgmGain : this.soundGain;
            var src = this.src;
            src[index] = null;
            var xml = new XMLHttpRequest();
            xml.open('GET', path, true);
            xml.setRequestHeader('Pragma', 'no-cache');
            xml.setRequestHeader('Cache-Control', 'no-cache');
            xml.responseType = 'arraybuffer';
            xml.onload = function () {
                ctx.decodeAudioData(xml.response, function (buf) {
                    src[index] = new AudioSrc(ctx, gain, buf, loop, background);
                    src[index].loaded = true;
                    console.log('%c◆%c audio number: %c' + index + '%c, audio loaded: %c' + path, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                    callback();
                }, function (e) {
                    console.log(e);
                });
            };
            xml.send();
        }

        /**
         * ロードの完了をチェックする
         * @return {boolean} ロードが完了しているかどうか
         */

    }, {
        key: 'loadComplete',
        value: function loadComplete() {
            var i = void 0,
                f = void 0;
            f = true;
            for (i = 0; i < this.src.length; i++) {
                f = f && this.src[i] != null && this.src[i].loaded;
            }
            return f;
        }
    }]);

    return gl3Audio;
}();

/**
 * オーディオやソースファイルを管理するためのクラス
 * @class AudioSrc
 */


exports.default = gl3Audio;

var AudioSrc = function () {
    /**
     * @constructor
     * @param {AudioContext} ctx - 対象となるオーディオコンテキスト
     * @param {GainNode} gain - 対象となるゲインノード
     * @param {ArrayBuffer} audioBuffer - バイナリのオーディオソース
     * @param {boolean} bool - ループ再生を設定するかどうか
     * @param {boolean} background - BGM として設定するかどうか
     */
    function AudioSrc(ctx, gain, audioBuffer, loop, background) {
        _classCallCheck(this, AudioSrc);

        /**
         * 対象となるオーディオコンテキスト
         * @type {AudioContext}
         */
        this.ctx = ctx;
        /**
         * 対象となるゲインノード
         * @type {GainNode}
         */
        this.gain = gain;
        /**
         * ソースファイルのバイナリデータ
         * @type {ArrayBuffer}
         */
        this.audioBuffer = audioBuffer;
        /**
         * オーディオバッファソースノードを格納する配列
         * @type {Array.<AudioBufferSourceNode>}
         */
        this.bufferSource = [];
        /**
         * アクティブなバッファソースのインデックス
         * @type {number}
         */
        this.activeBufferSource = 0;
        /**
         * ループするかどうかのフラグ
         * @type {boolean}
         */
        this.loop = loop;
        /**
         * ロード済みかどうかを示すフラグ
         * @type {boolean}
         */
        this.loaded = false;
        /**
         * FFT サイズ
         * @type {number}
         */
        this.fftLoop = 16;
        /**
         * このフラグが立っている場合再生中のデータを一度取得する
         * @type {boolean}
         */
        this.update = false;
        /**
         * BGM かどうかを示すフラグ
         * @type {boolean}
         */
        this.background = background;
        /**
         * スクリプトプロセッサーノード
         * @type {ScriptProcessorNode}
         */
        this.node = this.ctx.createScriptProcessor(2048, 1, 1);
        /**
         * アナライザノード
         * @type {AnalyserNode}
         */
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.fftSize = this.fftLoop * 2;
        /**
         * データを取得する際に利用する型付き配列
         * @type {Uint8Array}
         */
        this.onData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    /**
     * オーディオを再生する
     */


    _createClass(AudioSrc, [{
        key: 'play',
        value: function play() {
            var _this = this;

            var i = void 0,
                j = void 0,
                k = void 0;
            var self = this;
            i = this.bufferSource.length;
            k = -1;
            if (i > 0) {
                for (j = 0; j < i; j++) {
                    if (!this.bufferSource[j].playnow) {
                        this.bufferSource[j] = null;
                        this.bufferSource[j] = this.ctx.createBufferSource();
                        k = j;
                        break;
                    }
                }
                if (k < 0) {
                    this.bufferSource[this.bufferSource.length] = this.ctx.createBufferSource();
                    k = this.bufferSource.length - 1;
                }
            } else {
                this.bufferSource[0] = this.ctx.createBufferSource();
                k = 0;
            }
            this.activeBufferSource = k;
            this.bufferSource[k].buffer = this.audioBuffer;
            this.bufferSource[k].loop = this.loop;
            this.bufferSource[k].playbackRate.value = 1.0;
            if (!this.loop) {
                this.bufferSource[k].onended = function () {
                    _this.stop(0);
                    _this.playnow = false;
                };
            }
            if (this.background) {
                this.bufferSource[k].connect(this.analyser);
                this.analyser.connect(this.node);
                this.node.connect(this.ctx.destination);
                this.node.onaudioprocess = function (eve) {
                    onprocessEvent(eve);
                };
            }
            this.bufferSource[k].connect(this.gain);
            this.bufferSource[k].start(0);
            this.bufferSource[k].playnow = true;

            function onprocessEvent(eve) {
                if (self.update) {
                    self.update = false;
                    self.analyser.getByteFrequencyData(self.onData);
                }
            }
        }

        /**
         * オーディオの再生を止める
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.bufferSource[this.activeBufferSource].stop(0);
            this.playnow = false;
        }
    }]);

    return AudioSrc;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @example
 * let wrapper = new gl3.Gui.Wrapper();
 * document.body.appendChild(wrapper.getElement());
 *
 * let slider = new gl3.Gui.Slider('test', 50, 0, 100, 1);
 * slider.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(slider.getElement());
 *
 * let check = new gl3.Gui.Checkbox('hoge', false);
 * check.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(check.getElement());
 *
 * let radio = new gl3.Gui.Radio('hoge', null, false);
 * radio.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(radio.getElement());
 *
 * let select = new gl3.Gui.Select('fuga', ['foo', 'baa'], 0);
 * select.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(select.getElement());
 *
 * let spin = new gl3.Gui.Spin('hoge', 0.0, -1.0, 1.0, 0.1);
 * spin.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(spin.getElement());
 *
 * let color = new gl3.Gui.Color('fuga', '#ff0000');
 * color.add('change', (eve, self) => {console.log(self.getValue(), self.getFloatValue());});
 * wrapper.append(color.getElement());
 */

/**
 * gl3Gui
 * @class gl3Gui
 */
var gl3Gui =
/**
 * @constructor
 */
function gl3Gui() {
  _classCallCheck(this, gl3Gui);

  /**
   * GUIWrapper
   * @type {GUIWrapper}
   */
  this.Wrapper = GUIWrapper;
  /**
   * GUIElement
   * @type {GUIElement}
   */
  this.Element = GUIElement;
  /**
   * GUISlider
   * @type {GUISlider}
   */
  this.Slider = GUISlider;
  /**
   * GUICheckbox
   * @type {GUICheckbox}
   */
  this.Checkbox = GUICheckbox;
  /**
   * GUIRadio
   * @type {GUIRadio}
   */
  this.Radio = GUIRadio;
  /**
   * GUISelect
   * @type {GUISelect}
   */
  this.Select = GUISelect;
  /**
   * GUISpin
   * @type {GUISpin}
   */
  this.Spin = GUISpin;
  /**
   * GUIColor
   * @type {GUIColor}
   */
  this.Color = GUIColor;
};

/**
 * GUIWrapper
 * @class GUIWrapper
 */


exports.default = gl3Gui;

var GUIWrapper = function () {
  /**
   * @constructor
   */
  function GUIWrapper() {
    var _this = this;

    _classCallCheck(this, GUIWrapper);

    /**
     * GUI 全体を包むラッパー DOM
     * @type {HTMLDivElement}
     */
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.top = '0px';
    this.element.style.right = '0px';
    this.element.style.width = '340px';
    this.element.style.height = '100%';
    this.element.style.transition = 'right 0.8s cubic-bezier(0, 0, 0, 1.0)';
    /**
     * GUI パーツを包むラッパー DOM
     * @type {HTMLDivElement}
     */
    this.wrapper = document.createElement('div');
    this.wrapper.style.backgroundColor = 'rgba(64, 64, 64, 0.5)';
    this.wrapper.style.height = '100%';
    this.wrapper.style.overflow = 'auto';
    /**
     * GUI 折りたたみトグル
     * @type {HTMLDivElement}
     */
    this.toggle = document.createElement('div');
    this.toggle.className = 'visible';
    this.toggle.textContent = '▶';
    this.toggle.style.fontSize = '18px';
    this.toggle.style.lineHeight = '32px';
    this.toggle.style.color = 'rgba(240, 240, 240, 0.5)';
    this.toggle.style.backgroundColor = 'rgba(32, 32, 32, 0.5)';
    this.toggle.style.border = '1px solid rgba(240, 240, 240, 0.2)';
    this.toggle.style.borderRadius = '25px';
    this.toggle.style.boxShadow = '0px 0px 2px 2px rgba(8, 8, 8, 0.8)';
    this.toggle.style.position = 'absolute';
    this.toggle.style.top = '20px';
    this.toggle.style.right = '360px';
    this.toggle.style.width = '32px';
    this.toggle.style.height = '32px';
    this.toggle.style.cursor = 'pointer';
    this.toggle.style.transform = 'rotate(0deg)';
    this.toggle.style.transition = 'transform 0.5s cubic-bezier(0, 0, 0, 1.0)';

    this.element.appendChild(this.toggle);
    this.element.appendChild(this.wrapper);

    this.toggle.addEventListener('click', function () {
      _this.toggle.classList.toggle('visible');
      if (_this.toggle.classList.contains('visible')) {
        _this.element.style.right = '0px';
        _this.toggle.style.transform = 'rotate(0deg)';
      } else {
        _this.element.style.right = '-340px';
        _this.toggle.style.transform = 'rotate(-180deg)';
      }
    });
  }
  /**
   * エレメントを返す
   * @return {HTMLDivElement}
   */


  _createClass(GUIWrapper, [{
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
    /**
     * 子要素をアペンドする
     * @param {HTMLElement} element - アペンドする要素
     */

  }, {
    key: 'append',
    value: function append(element) {
      this.wrapper.appendChild(element);
    }
  }]);

  return GUIWrapper;
}();

/**
 * GUIElement
 * @class GUIElement
 */


var GUIElement = function () {
  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   */
  function GUIElement() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, GUIElement);

    /**
     * エレメントラッパー DOM
     * @type {HTMLDivElement}
     */
    this.element = document.createElement('div');
    this.element.style.fontSize = 'small';
    this.element.style.textAlign = 'center';
    this.element.style.width = '320px';
    this.element.style.height = '30px';
    this.element.style.lineHeight = '30px';
    this.element.style.display = 'flex';
    this.element.style.flexDirection = 'row';
    this.element.style.justifyContent = 'flex-start';
    /**
     * ラベル用エレメント DOM
     * @type {HTMLSpanElement}
     */
    this.label = document.createElement('span');
    this.label.textContent = text;
    this.label.style.color = '#222';
    this.label.style.textShadow = '0px 0px 5px white';
    this.label.style.display = 'inline-block';
    this.label.style.margin = 'auto 5px';
    this.label.style.width = '100px';
    this.label.style.overflow = 'hidden';
    this.element.appendChild(this.label);
    /**
     * 値表示用 DOM
     * @type {HTMLSpanElement}
     */
    this.value = document.createElement('span');
    this.value.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
    this.value.style.color = 'whitesmoke';
    this.value.style.fontSize = 'x-small';
    this.value.style.textShadow = '0px 0px 5px black';
    this.value.style.display = 'inline-block';
    this.value.style.margin = 'auto 5px';
    this.value.style.width = '50px';
    this.value.style.overflow = 'hidden';
    this.element.appendChild(this.value);
    /**
     * コントロール DOM
     * @type {HTMLElement}
     */
    this.control = null;
    /**
     * ラベルに設定するテキスト
     * @type {string}
     */
    this.text = text;
    /**
     * イベントリスナ
     * @type {object}
     */
    this.listeners = {};
  }
  /**
   * イベントリスナを登録する
   * @param {string} type - イベントタイプ
   * @param {function} func - 登録する関数
   */


  _createClass(GUIElement, [{
    key: 'add',
    value: function add(type, func) {
      if (this.control == null || type == null || func == null) {
        return;
      }
      if (Object.prototype.toString.call(type) !== '[object String]') {
        return;
      }
      if (Object.prototype.toString.call(func) !== '[object Function]') {
        return;
      }
      this.listeners[type] = func;
    }
    /**
     * イベントを発火する
     * @param {string} type - 発火するイベントタイプ
     * @param {Event} eve - Event オブジェクト
     */

  }, {
    key: 'emit',
    value: function emit(type, eve) {
      if (this.control == null || !this.listeners.hasOwnProperty(type)) {
        return;
      }
      this.listeners[type](eve, this);
    }
    /**
     * イベントリスナを登録解除する
     */

  }, {
    key: 'remove',
    value: function remove() {
      if (this.control == null || !this.listeners.hasOwnProperty(type)) {
        return;
      }
      this.listeners[type] = null;
      delete this.listeners[type];
    }
    /**
     * ラベルテキストとコントロールの値を更新する
     * @param {mixed} value - 設定する値
     */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.value.textContent = value;
      this.control.value = value;
    }
    /**
     * コントロールに設定されている値を返す
     * @return {mixed} コントロールに設定されている値
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.control.value;
    }
    /**
     * コントロールエレメントを返す
     * @return {HTMLElement}
     */

  }, {
    key: 'getControl',
    value: function getControl() {
      return this.control;
    }
    /**
     * ラベルに設定されているテキストを返す
     * @return {string} ラベルに設定されている値
     */

  }, {
    key: 'getText',
    value: function getText() {
      return this.text;
    }
    /**
     * エレメントを返す
     * @return {HTMLDivElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }]);

  return GUIElement;
}();

/**
 * GUISlider
 * @class GUISlider
 */


var GUISlider = function (_GUIElement) {
  _inherits(GUISlider, _GUIElement);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {number} [value=0] - コントロールに設定する値
   * @param {number} [min=0] - スライダーの最小値
   * @param {number} [max=100] - スライダーの最大値
   * @param {number} [step=1] - スライダーのステップ数
   */
  function GUISlider() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    var step = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    _classCallCheck(this, GUISlider);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this2 = _possibleConstructorReturn(this, (GUISlider.__proto__ || Object.getPrototypeOf(GUISlider)).call(this, text));

    _this2.control = document.createElement('input');
    _this2.control.setAttribute('type', 'range');
    _this2.control.setAttribute('min', min);
    _this2.control.setAttribute('max', max);
    _this2.control.setAttribute('step', step);
    _this2.control.value = value;
    _this2.control.style.margin = 'auto';
    _this2.control.style.verticalAlign = 'middle';
    _this2.element.appendChild(_this2.control);

    // set
    _this2.setValue(_this2.control.value);

    // event
    _this2.control.addEventListener('input', function (eve) {
      _this2.emit('input', eve);
      _this2.setValue(_this2.control.value);
    }, false);
    return _this2;
  }
  /**
   * スライダーの最小値をセットする
   * @param {number} min - 最小値に設定する値
   */


  _createClass(GUISlider, [{
    key: 'setMin',
    value: function setMin(min) {
      this.control.setAttribute('min', min);
    }
    /**
     * スライダーの最大値をセットする
     * @param {number} max - 最大値に設定する値
     */

  }, {
    key: 'setMax',
    value: function setMax(max) {
      this.control.setAttribute('max', max);
    }
    /**
     * スライダーのステップ数をセットする
     * @param {number} step - ステップ数に設定する値
     */

  }, {
    key: 'setStep',
    value: function setStep(step) {
      this.control.setAttribute('step', step);
    }
  }]);

  return GUISlider;
}(GUIElement);

/**
 * GUICheckbox
 * @class GUICheckbox
 */


var GUICheckbox = function (_GUIElement2) {
  _inherits(GUICheckbox, _GUIElement2);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {boolean} [checked=false] - コントロールに設定する値
   */
  function GUICheckbox() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var checked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, GUICheckbox);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this3 = _possibleConstructorReturn(this, (GUICheckbox.__proto__ || Object.getPrototypeOf(GUICheckbox)).call(this, text));

    _this3.control = document.createElement('input');
    _this3.control.setAttribute('type', 'checkbox');
    _this3.control.checked = checked;
    _this3.control.style.margin = 'auto';
    _this3.control.style.verticalAlign = 'middle';
    _this3.element.appendChild(_this3.control);

    // set
    _this3.setValue(_this3.control.checked);

    // event
    _this3.control.addEventListener('change', function (eve) {
      _this3.emit('change', eve);
      _this3.setValue(_this3.control.checked);
    }, false);
    return _this3;
  }
  /**
   * コントロールに値を設定する
   * @param {boolean} checked - コントロールに設定する値
   */


  _createClass(GUICheckbox, [{
    key: 'setValue',
    value: function setValue(checked) {
      this.value.textContent = checked;
      this.control.checked = checked;
    }
    /**
     * コントロールの値を返す
     * @return {boolean} コントロールの値
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.control.checked;
    }
  }]);

  return GUICheckbox;
}(GUIElement);

/**
 * GUIRadio
 * @class GUIRadio
 */


var GUIRadio = function (_GUIElement3) {
  _inherits(GUIRadio, _GUIElement3);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {string} [name='gl3radio'] - エレメントに設定する名前
   * @param {boolean} [checked=false] - コントロールに設定する値
   */
  function GUIRadio() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'gl3radio';
    var checked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, GUIRadio);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this4 = _possibleConstructorReturn(this, (GUIRadio.__proto__ || Object.getPrototypeOf(GUIRadio)).call(this, text));

    _this4.control = document.createElement('input');
    _this4.control.setAttribute('type', 'radio');
    _this4.control.setAttribute('name', name);
    _this4.control.checked = checked;
    _this4.control.style.margin = 'auto';
    _this4.control.style.verticalAlign = 'middle';
    _this4.element.appendChild(_this4.control);

    // set
    _this4.setValue(_this4.control.checked);

    // event
    _this4.control.addEventListener('change', function (eve) {
      _this4.emit('change', eve);
      _this4.setValue(_this4.control.checked);
    }, false);
    return _this4;
  }
  /**
   * コントロールに値を設定する
   * @param {boolean} checked - コントロールに設定する値
   */


  _createClass(GUIRadio, [{
    key: 'setValue',
    value: function setValue(checked) {
      this.value.textContent = '---';
      this.control.checked = checked;
    }
    /**
     * コントロールの値を返す
     * @return {boolean} コントロールの値
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.control.checked;
    }
  }]);

  return GUIRadio;
}(GUIElement);

/**
 * GUISelect
 * @class GUISelect
 */


var GUISelect = function (_GUIElement4) {
  _inherits(GUISelect, _GUIElement4);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {Array.<string>} [list=[]] - リストに登録するアイテムを指定する文字列の配列
   * @param {number} [selectedIndex=0] - コントロールで選択するインデックス
   */
  function GUISelect() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var selectedIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, GUISelect);

    /**
     * コントロールエレメント
     * @type {HTMLSelectElement}
     */
    var _this5 = _possibleConstructorReturn(this, (GUISelect.__proto__ || Object.getPrototypeOf(GUISelect)).call(this, text));

    _this5.control = document.createElement('select');
    list.map(function (v) {
      var opt = new Option(v, v);
      _this5.control.add(opt);
    });
    _this5.control.selectedIndex = selectedIndex;
    _this5.control.style.width = '130px';
    _this5.control.style.margin = 'auto';
    _this5.control.style.verticalAlign = 'middle';
    _this5.element.appendChild(_this5.control);

    // set
    _this5.setValue(_this5.control.value);

    // event
    _this5.control.addEventListener('change', function (eve) {
      _this5.emit('change', eve);
      _this5.setValue(_this5.control.value);
    }, false);
    return _this5;
  }
  /**
   * コントロールで選択するインデックスを指定する
   * @param {number} index - 指定するインデックス
   */


  _createClass(GUISelect, [{
    key: 'setSelectedIndex',
    value: function setSelectedIndex(index) {
      this.control.selectedIndex = index;
    }
    /**
     * コントロールが現在選択しているインデックスを返す
     * @return {number} 現在選択しているインデックス
     */

  }, {
    key: 'getSelectedIndex',
    value: function getSelectedIndex() {
      return this.control.selectedIndex;
    }
  }]);

  return GUISelect;
}(GUIElement);

/**
 * GUISpin
 * @class GUISpin
 */


var GUISpin = function (_GUIElement5) {
  _inherits(GUISpin, _GUIElement5);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {number} [value=0.0] - コントロールに設定する値
   * @param {number} [min=-1.0] - スピンする際の最小値
   * @param {number} [max=1.0] - スピンする際の最大値
   * @param {number} [step=0.1] - スピンするステップ数
   */
  function GUISpin() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1.0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
    var step = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.1;

    _classCallCheck(this, GUISpin);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this6 = _possibleConstructorReturn(this, (GUISpin.__proto__ || Object.getPrototypeOf(GUISpin)).call(this, text));

    _this6.control = document.createElement('input');
    _this6.control.setAttribute('type', 'number');
    _this6.control.setAttribute('min', min);
    _this6.control.setAttribute('max', max);
    _this6.control.setAttribute('step', step);
    _this6.control.value = value;
    _this6.control.style.margin = 'auto';
    _this6.control.style.verticalAlign = 'middle';
    _this6.element.appendChild(_this6.control);

    // set
    _this6.setValue(_this6.control.value);

    // event
    _this6.control.addEventListener('input', function (eve) {
      _this6.emit('input', eve);
      _this6.setValue(_this6.control.value);
    }, false);
    return _this6;
  }
  /**
   * スピンの最小値を設定する
   * @param {number} min - 設定する最小値
   */


  _createClass(GUISpin, [{
    key: 'setMin',
    value: function setMin(min) {
      this.control.setAttribute('min', min);
    }
    /**
     * スピンの最大値を設定する
     * @param {number} max - 設定する最大値
     */

  }, {
    key: 'setMax',
    value: function setMax(max) {
      this.control.setAttribute('max', max);
    }
    /**
     * スピンのステップ数を設定する
     * @param {number} step - 設定するステップ数
     */

  }, {
    key: 'setStep',
    value: function setStep(step) {
      this.control.setAttribute('step', step);
    }
  }]);

  return GUISpin;
}(GUIElement);

/**
 * GUIColor
 * @class GUIColor
 */


var GUIColor = function (_GUIElement6) {
  _inherits(GUIColor, _GUIElement6);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {string} [value='#000000'] - コントロールに設定する値
   */
  function GUIColor() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#000000';

    _classCallCheck(this, GUIColor);

    /**
     * コントロールを包むコンテナエレメント
     * @type {HTMLDivElement}
     */
    var _this7 = _possibleConstructorReturn(this, (GUIColor.__proto__ || Object.getPrototypeOf(GUIColor)).call(this, text));

    _this7.container = document.createElement('div');
    _this7.container.style.lineHeight = '0';
    _this7.container.style.margin = '2px auto';
    _this7.container.style.width = '100px';
    /**
     * 余白兼選択カラー表示エレメント
     * @type {HTMLDivElement}
     */
    _this7.label = document.createElement('div');
    _this7.label.style.margin = '0px';
    _this7.label.style.width = 'calc(100% - 2px)';
    _this7.label.style.height = '24px';
    _this7.label.style.border = '1px solid whitesmoke';
    _this7.label.style.boxShadow = '0px 0px 0px 1px #222';
    /**
     * コントロールエレメントの役割を担う canvas
     * @type {HTMLCanvasElement}
     */
    _this7.control = document.createElement('canvas');
    _this7.control.style.margin = '0px';
    _this7.control.style.display = 'none';
    _this7.control.width = 100;
    _this7.control.height = 100;

    // append
    _this7.element.appendChild(_this7.container);
    _this7.container.appendChild(_this7.label);
    _this7.container.appendChild(_this7.control);

    /**
     * コントロール用 canvas の 2d コンテキスト
     * @type {CanvasRenderingContext2D}
     */
    _this7.ctx = _this7.control.getContext('2d');
    var grad = _this7.ctx.createLinearGradient(0, 0, _this7.control.width, 0);
    var arr = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'];
    for (var i = 0, j = arr.length; i < j; ++i) {
      grad.addColorStop(i / (j - 1), arr[i]);
    }
    _this7.ctx.fillStyle = grad;
    _this7.ctx.fillRect(0, 0, _this7.control.width, _this7.control.height);
    grad = _this7.ctx.createLinearGradient(0, 0, 0, _this7.control.height);
    arr = ['rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 0.0)', 'rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 1.0)'];
    for (var _i = 0, _j = arr.length; _i < _j; ++_i) {
      grad.addColorStop(_i / (_j - 1), arr[_i]);
    }
    _this7.ctx.fillStyle = grad;
    _this7.ctx.fillRect(0, 0, _this7.control.width, _this7.control.height);

    /**
     * 自身に設定されている色を表す文字列の値
     * @type {string}
     */
    _this7.colorValue = value;
    /**
     * クリック時にのみ colorValue を更新するための一時キャッシュ変数
     * @type {string}
     */
    _this7.tempColorValue = null;

    // set
    _this7.setValue(value);

    // event
    _this7.container.addEventListener('mouseover', function () {
      _this7.control.style.display = 'block';
      _this7.tempColorValue = _this7.colorValue;
    });
    _this7.container.addEventListener('mouseout', function () {
      _this7.control.style.display = 'none';
      if (_this7.tempColorValue != null) {
        _this7.setValue(_this7.tempColorValue);
        _this7.tempColorValue = null;
      }
    });
    _this7.control.addEventListener('mousemove', function (eve) {
      var imageData = _this7.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
      var color = _this7.getColor8bitString(imageData.data);
      _this7.setValue(color);
    });

    _this7.control.addEventListener('click', function (eve) {
      var imageData = _this7.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
      eve.currentTarget.value = _this7.getColor8bitString(imageData.data);
      _this7.tempColorValue = null;
      _this7.control.style.display = 'none';
      _this7.emit('change', eve);
    }, false);
    return _this7;
  }
  /**
   * 自身のプロパティに色を設定する
   * @param {string} value - CSS 色表現のうち 16 進数表記のもの
   */


  _createClass(GUIColor, [{
    key: 'setValue',
    value: function setValue(value) {
      this.value.textContent = value;
      this.colorValue = value;
      this.container.style.backgroundColor = this.colorValue;
    }
    /**
     * 自身に設定されている色を表す文字列を返す
     * @return {string} 16 進数表記の色を表す文字列
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.colorValue;
    }
    /**
     * 自身に設定されている色を表す文字列を 0.0 から 1.0 の値に変換し配列で返す
     * @return {Array.<number>} 浮動小数で表現した色の値の配列
     */

  }, {
    key: 'getFloatValue',
    value: function getFloatValue() {
      return this.getColorFloatArray(this.colorValue);
    }
    /**
     * canvas.imageData から取得する数値の配列を元に 16 進数表記文字列を生成して返す
     * @param {Array.<number>} color - 最低でも 3 つの要素を持つ数値の配列
     * @return {string} 16 進数表記の色の値の文字列
     */

  }, {
    key: 'getColor8bitString',
    value: function getColor8bitString(color) {
      var r = this.zeroPadding(color[0].toString(16), 2);
      var g = this.zeroPadding(color[1].toString(16), 2);
      var b = this.zeroPadding(color[2].toString(16), 2);
      return '#' + r + g + b;
    }
    /**
     * 16 進数表記の色表現文字列を元に 0.0 から 1.0 の値に変換した配列を生成し返す
     * @param {string} color - 16 進数表記の色の値の文字列
     * @return {Array.<number>} RGB の 3 つの値を 0.0 から 1.0 に変換した値の配列
     */

  }, {
    key: 'getColorFloatArray',
    value: function getColorFloatArray(color) {
      if (color == null || Object.prototype.toString.call(color) !== '[object String]') {
        return null;
      }
      if (color.search(/^#+[\d|a-f|A-F]+$/) === -1) {
        return null;
      }
      var s = color.replace('#', '');
      if (s.length !== 3 && s.length !== 6) {
        return null;
      }
      var t = s.length / 3;
      return [parseInt(color.substr(1, t), 16) / 255, parseInt(color.substr(1 + t, t), 16) / 255, parseInt(color.substr(1 + t * 2, t), 16) / 255];
    }
    /**
     * 数値を指定された桁数に整形した文字列を返す
     * @param {number} number - 整形したい数値
     * @param {number} count - 整形する桁数
     * @return {string} 16 進数表記の色の値の文字列
     */

  }, {
    key: 'zeroPadding',
    value: function zeroPadding(number, count) {
      var a = new Array(count).join('0');
      return (a + number).slice(-count);
    }
  }]);

  return GUIColor;
}(GUIElement);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * gl3Math
 * @class gl3Math
 */
var gl3Math =
/**
 * @constructor
 */
function gl3Math() {
    _classCallCheck(this, gl3Math);

    /**
     * Mat4
     * @type {Mat4}
     */
    this.Mat4 = Mat4;
    /**
     * Vec3
     * @type {Vec3}
     */
    this.Vec3 = Vec3;
    /**
     * Vec2
     * @type {Vec2}
     */
    this.Vec2 = Vec2;
    /**
     * Qtn
     * @type {Qtn}
     */
    this.Qtn = Qtn;
};

/**
 * Mat4
 * @class Mat4
 */


exports.default = gl3Math;

var Mat4 = function () {
    function Mat4() {
        _classCallCheck(this, Mat4);
    }

    _createClass(Mat4, null, [{
        key: "create",

        /**
         * 4x4 の正方行列を生成する
         * @return {Float32Array} 行列格納用の配列
         */
        value: function create() {
            return new Float32Array(16);
        }
        /**
         * 行列を単位化する（参照に注意）
         * @param {Float32Array.<Mat4>} dest - 単位化する行列
         * @return {Float32Array.<Mat4>} 単位化した行列
         */

    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 1;dest[1] = 0;dest[2] = 0;dest[3] = 0;
            dest[4] = 0;dest[5] = 1;dest[6] = 0;dest[7] = 0;
            dest[8] = 0;dest[9] = 0;dest[10] = 1;dest[11] = 0;
            dest[12] = 0;dest[13] = 0;dest[14] = 0;dest[15] = 1;
            return dest;
        }
        /**
         * 行列を乗算する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat0 - 乗算される行列
         * @param {Float32Array.<Mat4>} mat1 - 乗算する行列
         * @param {Float32Array.<Mat4>} [dest] - 乗算結果を格納する行列
         * @return {Float32Array.<Mat4>} 乗算結果の行列
         */

    }, {
        key: "multiply",
        value: function multiply(mat0, mat1, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var a = mat0[0],
                b = mat0[1],
                c = mat0[2],
                d = mat0[3],
                e = mat0[4],
                f = mat0[5],
                g = mat0[6],
                h = mat0[7],
                i = mat0[8],
                j = mat0[9],
                k = mat0[10],
                l = mat0[11],
                m = mat0[12],
                n = mat0[13],
                o = mat0[14],
                p = mat0[15],
                A = mat1[0],
                B = mat1[1],
                C = mat1[2],
                D = mat1[3],
                E = mat1[4],
                F = mat1[5],
                G = mat1[6],
                H = mat1[7],
                I = mat1[8],
                J = mat1[9],
                K = mat1[10],
                L = mat1[11],
                M = mat1[12],
                N = mat1[13],
                O = mat1[14],
                P = mat1[15];
            out[0] = A * a + B * e + C * i + D * m;
            out[1] = A * b + B * f + C * j + D * n;
            out[2] = A * c + B * g + C * k + D * o;
            out[3] = A * d + B * h + C * l + D * p;
            out[4] = E * a + F * e + G * i + H * m;
            out[5] = E * b + F * f + G * j + H * n;
            out[6] = E * c + F * g + G * k + H * o;
            out[7] = E * d + F * h + G * l + H * p;
            out[8] = I * a + J * e + K * i + L * m;
            out[9] = I * b + J * f + K * j + L * n;
            out[10] = I * c + J * g + K * k + L * o;
            out[11] = I * d + J * h + K * l + L * p;
            out[12] = M * a + N * e + O * i + P * m;
            out[13] = M * b + N * f + O * j + P * n;
            out[14] = M * c + N * g + O * k + P * o;
            out[15] = M * d + N * h + O * l + P * p;
            return out;
        }
        /**
         * 行列に拡大縮小を適用する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用を受ける行列
         * @param {Float32Array.<Vec3>} vec - XYZ の各軸に対して拡縮を適用する値の行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "scale",
        value: function scale(mat, vec, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            out[0] = mat[0] * vec[0];
            out[1] = mat[1] * vec[0];
            out[2] = mat[2] * vec[0];
            out[3] = mat[3] * vec[0];
            out[4] = mat[4] * vec[1];
            out[5] = mat[5] * vec[1];
            out[6] = mat[6] * vec[1];
            out[7] = mat[7] * vec[1];
            out[8] = mat[8] * vec[2];
            out[9] = mat[9] * vec[2];
            out[10] = mat[10] * vec[2];
            out[11] = mat[11] * vec[2];
            out[12] = mat[12];
            out[13] = mat[13];
            out[14] = mat[14];
            out[15] = mat[15];
            return out;
        }
        /**
         * 行列に平行移動を適用する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用を受ける行列
         * @param {Float32Array.<Vec3>} vec - XYZ の各軸に対して平行移動を適用する値の行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "translate",
        value: function translate(mat, vec, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            out[0] = mat[0];out[1] = mat[1];out[2] = mat[2];out[3] = mat[3];
            out[4] = mat[4];out[5] = mat[5];out[6] = mat[6];out[7] = mat[7];
            out[8] = mat[8];out[9] = mat[9];out[10] = mat[10];out[11] = mat[11];
            out[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12];
            out[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13];
            out[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
            out[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
            return out;
        }
        /**
         * 行列に回転を適用する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用を受ける行列
         * @param {number} angle - 回転量を表す値（ラジアン）
         * @param {Float32Array.<Vec3>} axis - 回転の軸
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "rotate",
        value: function rotate(mat, angle, axis, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
            if (!sq) {
                return null;
            }
            var a = axis[0],
                b = axis[1],
                c = axis[2];
            if (sq != 1) {
                sq = 1 / sq;a *= sq;b *= sq;c *= sq;
            }
            var d = Math.sin(angle),
                e = Math.cos(angle),
                f = 1 - e,
                g = mat[0],
                h = mat[1],
                i = mat[2],
                j = mat[3],
                k = mat[4],
                l = mat[5],
                m = mat[6],
                n = mat[7],
                o = mat[8],
                p = mat[9],
                q = mat[10],
                r = mat[11],
                s = a * a * f + e,
                t = b * a * f + c * d,
                u = c * a * f - b * d,
                v = a * b * f - c * d,
                w = b * b * f + e,
                x = c * b * f + a * d,
                y = a * c * f + b * d,
                z = b * c * f - a * d,
                A = c * c * f + e;
            if (angle) {
                if (mat != out) {
                    out[12] = mat[12];out[13] = mat[13];
                    out[14] = mat[14];out[15] = mat[15];
                }
            } else {
                out = mat;
            }
            out[0] = g * s + k * t + o * u;
            out[1] = h * s + l * t + p * u;
            out[2] = i * s + m * t + q * u;
            out[3] = j * s + n * t + r * u;
            out[4] = g * v + k * w + o * x;
            out[5] = h * v + l * w + p * x;
            out[6] = i * v + m * w + q * x;
            out[7] = j * v + n * w + r * x;
            out[8] = g * y + k * z + o * A;
            out[9] = h * y + l * z + p * A;
            out[10] = i * y + m * z + q * A;
            out[11] = j * y + n * z + r * A;
            return out;
        }
        /**
         * ビュー座標変換行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Vec3>} eye - 視点位置
         * @param {Float32Array.<Vec3>} center - 注視点
         * @param {Float32Array.<Vec3>} up - 上方向を示すベクトル
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "lookAt",
        value: function lookAt(eye, center, up, dest) {
            var eyeX = eye[0],
                eyeY = eye[1],
                eyeZ = eye[2],
                centerX = center[0],
                centerY = center[1],
                centerZ = center[2],
                upX = up[0],
                upY = up[1],
                upZ = up[2];
            if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
                return Mat4.identity(dest);
            }
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var x0 = void 0,
                x1 = void 0,
                x2 = void 0,
                y0 = void 0,
                y1 = void 0,
                y2 = void 0,
                z0 = void 0,
                z1 = void 0,
                z2 = void 0,
                l = void 0;
            z0 = eyeX - center[0];z1 = eyeY - center[1];z2 = eyeZ - center[2];
            l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= l;z1 *= l;z2 *= l;
            x0 = upY * z2 - upZ * z1;
            x1 = upZ * z0 - upX * z2;
            x2 = upX * z1 - upY * z0;
            l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!l) {
                x0 = 0;x1 = 0;x2 = 0;
            } else {
                l = 1 / l;
                x0 *= l;x1 *= l;x2 *= l;
            }
            y0 = z1 * x2 - z2 * x1;y1 = z2 * x0 - z0 * x2;y2 = z0 * x1 - z1 * x0;
            l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!l) {
                y0 = 0;y1 = 0;y2 = 0;
            } else {
                l = 1 / l;
                y0 *= l;y1 *= l;y2 *= l;
            }
            out[0] = x0;out[1] = y0;out[2] = z0;out[3] = 0;
            out[4] = x1;out[5] = y1;out[6] = z1;out[7] = 0;
            out[8] = x2;out[9] = y2;out[10] = z2;out[11] = 0;
            out[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
            out[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
            out[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
            out[15] = 1;
            return out;
        }
        /**
         * 透視投影変換行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {number} fovy - 視野角（度数法）
         * @param {number} aspect - アスペクト比（幅 / 高さ）
         * @param {number} near - ニアクリップ面までの距離
         * @param {number} far - ファークリップ面までの距離
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "perspective",
        value: function perspective(fovy, aspect, near, far, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var t = near * Math.tan(fovy * Math.PI / 360);
            var r = t * aspect;
            var a = r * 2,
                b = t * 2,
                c = far - near;
            out[0] = near * 2 / a;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = near * 2 / b;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = -(far + near) / c;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = -(far * near * 2) / c;
            out[15] = 0;
            return out;
        }
        /**
         * 正射影投影変換行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {number} left - 左端
         * @param {number} right - 右端
         * @param {number} top - 上端
         * @param {number} bottom - 下端
         * @param {number} near - ニアクリップ面までの距離
         * @param {number} far - ファークリップ面までの距離
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "ortho",
        value: function ortho(left, right, top, bottom, near, far, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var h = right - left;
            var v = top - bottom;
            var d = far - near;
            out[0] = 2 / h;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 2 / v;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = -2 / d;
            out[11] = 0;
            out[12] = -(left + right) / h;
            out[13] = -(top + bottom) / v;
            out[14] = -(far + near) / d;
            out[15] = 1;
            return out;
        }
        /**
         * 転置行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用する行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "transpose",
        value: function transpose(mat, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            out[0] = mat[0];out[1] = mat[4];
            out[2] = mat[8];out[3] = mat[12];
            out[4] = mat[1];out[5] = mat[5];
            out[6] = mat[9];out[7] = mat[13];
            out[8] = mat[2];out[9] = mat[6];
            out[10] = mat[10];out[11] = mat[14];
            out[12] = mat[3];out[13] = mat[7];
            out[14] = mat[11];out[15] = mat[15];
            return out;
        }
        /**
         * 逆行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用する行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "inverse",
        value: function inverse(mat, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var a = mat[0],
                b = mat[1],
                c = mat[2],
                d = mat[3],
                e = mat[4],
                f = mat[5],
                g = mat[6],
                h = mat[7],
                i = mat[8],
                j = mat[9],
                k = mat[10],
                l = mat[11],
                m = mat[12],
                n = mat[13],
                o = mat[14],
                p = mat[15],
                q = a * f - b * e,
                r = a * g - c * e,
                s = a * h - d * e,
                t = b * g - c * f,
                u = b * h - d * f,
                v = c * h - d * g,
                w = i * n - j * m,
                x = i * o - k * m,
                y = i * p - l * m,
                z = j * o - k * n,
                A = j * p - l * n,
                B = k * p - l * o,
                ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
            out[0] = (f * B - g * A + h * z) * ivd;
            out[1] = (-b * B + c * A - d * z) * ivd;
            out[2] = (n * v - o * u + p * t) * ivd;
            out[3] = (-j * v + k * u - l * t) * ivd;
            out[4] = (-e * B + g * y - h * x) * ivd;
            out[5] = (a * B - c * y + d * x) * ivd;
            out[6] = (-m * v + o * s - p * r) * ivd;
            out[7] = (i * v - k * s + l * r) * ivd;
            out[8] = (e * A - f * y + h * w) * ivd;
            out[9] = (-a * A + b * y - d * w) * ivd;
            out[10] = (m * u - n * s + p * q) * ivd;
            out[11] = (-i * u + j * s - l * q) * ivd;
            out[12] = (-e * z + f * x - g * w) * ivd;
            out[13] = (a * z - b * x + c * w) * ivd;
            out[14] = (-m * t + n * r - o * q) * ivd;
            out[15] = (i * t - j * r + k * q) * ivd;
            return out;
        }
        /**
         * 行列にベクトルを乗算する（ベクトルに行列を適用する）
         * @param {Float32Array.<Mat4>} mat - 適用する行列
         * @param {Array.<number>} vec - 乗算するベクトル（4 つの要素を持つ配列）
         * @return {Float32Array} 結果のベクトル
         */

    }, {
        key: "toVecIV",
        value: function toVecIV(mat, vec) {
            var a = mat[0],
                b = mat[1],
                c = mat[2],
                d = mat[3],
                e = mat[4],
                f = mat[5],
                g = mat[6],
                h = mat[7],
                i = mat[8],
                j = mat[9],
                k = mat[10],
                l = mat[11],
                m = mat[12],
                n = mat[13],
                o = mat[14],
                p = mat[15];
            var x = vec[0],
                y = vec[1],
                z = vec[2],
                w = vec[3];
            var out = [];
            out[0] = x * a + y * e + z * i + w * m;
            out[1] = x * b + y * f + z * j + w * n;
            out[2] = x * c + y * g + z * k + w * o;
            out[3] = x * d + y * h + z * l + w * p;
            vec = out;
            return out;
        }
        /**
         * カメラのプロパティに相当する情報を受け取り行列を生成する
         * @param {Float32Array.<Vec3>} position - カメラの座標
         * @param {Float32Array.<Vec3>} centerPoint - カメラの注視点
         * @param {Float32Array.<Vec3>} upDirection - カメラの上方向
         * @param {number} fovy - 視野角
         * @param {number} aspect - アスペクト比
         * @param {number} near - ニアクリップ面
         * @param {number} far - ファークリップ面
         * @param {Float32Array.<Mat4>} vmat - ビュー座標変換行列の結果を格納する行列
         * @param {Float32Array.<Mat4>} pmat - 透視投影座標変換行列の結果を格納する行列
         * @param {Float32Array.<Mat4>} dest - ビュー x 透視投影変換行列の結果を格納する行列
         */

    }, {
        key: "vpFromCameraProperty",
        value: function vpFromCameraProperty(position, centerPoint, upDirection, fovy, aspect, near, far, vmat, pmat, dest) {
            Mat4.lookAt(position, centerPoint, upDirection, vmat);
            Mat4.perspective(fovy, aspect, near, far, pmat);
            Mat4.multiply(pmat, vmat, dest);
        }
        /**
         * MVP 行列に相当する行列を受け取りベクトルを変換して返す
         * @param {Float32Array.<Mat4>} mat - MVP 行列
         * @param {Array.<number>} vec - MVP 行列と乗算するベクトル
         * @param {number} width - ビューポートの幅
         * @param {number} height - ビューポートの高さ
         * @return {Array.<number>} 結果のベクトル（2 つの要素を持つベクトル）
         */

    }, {
        key: "screenPositionFromMvp",
        value: function screenPositionFromMvp(mat, vec, width, height) {
            var halfWidth = width * 0.5;
            var halfHeight = height * 0.5;
            var v = Mat4.toVecIV(mat, [vec[0], vec[1], vec[2], 1.0]);
            if (v[3] <= 0.0) {
                return [NaN, NaN];
            }
            v[0] /= v[3];v[1] /= v[3];v[2] /= v[3];
            return [halfWidth + v[0] * halfWidth, halfHeight - v[1] * halfHeight];
        }
    }]);

    return Mat4;
}();

/**
 * Vec3
 * @class Vec3
 */


var Vec3 = function () {
    function Vec3() {
        _classCallCheck(this, Vec3);
    }

    _createClass(Vec3, null, [{
        key: "create",

        /**
         * 3 つの要素を持つベクトルを生成する
         * @return {Float32Array} ベクトル格納用の配列
         */
        value: function create() {
            return new Float32Array(3);
        }
        /**
         * ベクトルの長さ（大きさ）を返す
         * @param {Float32Array.<Vec3>} v - 3 つの要素を持つベクトル
         * @return {number} ベクトルの長さ（大きさ）
         */

    }, {
        key: "len",
        value: function len(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        }
        /**
         * 2 つの座標（始点・終点）を結ぶベクトルを返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つ始点座標
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つ終点座標
         * @return {Float32Array.<Vec3>} 視点と終点を結ぶベクトル
         */

    }, {
        key: "distance",
        value: function distance(v0, v1) {
            var n = Vec3.create();
            n[0] = v1[0] - v0[0];
            n[1] = v1[1] - v0[1];
            n[2] = v1[2] - v0[2];
            return n;
        }
        /**
         * ベクトルを正規化した結果を返す
         * @param {Float32Array.<Vec3>} v - 3 つの要素を持つベクトル
         * @return {Float32Array.<Vec3>} 正規化したベクトル
         */

    }, {
        key: "normalize",
        value: function normalize(v) {
            var n = Vec3.create();
            var l = Vec3.len(v);
            if (l > 0) {
                var e = 1.0 / l;
                n[0] = v[0] * e;
                n[1] = v[1] * e;
                n[2] = v[2] * e;
            } else {
                n[0] = 0.0;
                n[1] = 0.0;
                n[2] = 0.0;
            }
            return n;
        }
        /**
         * 2 つのベクトルの内積の結果を返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つベクトル
         * @return {number} 内積の結果
         */

    }, {
        key: "dot",
        value: function dot(v0, v1) {
            return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
        }
        /**
         * 2 つのベクトルの外積の結果を返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つベクトル
         * @return {Float32Array.<Vec3>} 外積の結果
         */

    }, {
        key: "cross",
        value: function cross(v0, v1) {
            var n = Vec3.create();
            n[0] = v0[1] * v1[2] - v0[2] * v1[1];
            n[1] = v0[2] * v1[0] - v0[0] * v1[2];
            n[2] = v0[0] * v1[1] - v0[1] * v1[0];
            return n;
        }
        /**
         * 3 つのベクトルから面法線を求めて返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v2 - 3 つの要素を持つベクトル
         * @return {Float32Array.<Vec3>} 面法線ベクトル
         */

    }, {
        key: "faceNormal",
        value: function faceNormal(v0, v1, v2) {
            var n = Vec3.create();
            var vec1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
            var vec2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
            n[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
            n[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
            n[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
            return Vec3.normalize(n);
        }
    }]);

    return Vec3;
}();

/**
 * Vec2
 * @class Vec2
 */


var Vec2 = function () {
    function Vec2() {
        _classCallCheck(this, Vec2);
    }

    _createClass(Vec2, null, [{
        key: "create",

        /**
         * 2 つの要素を持つベクトルを生成する
         * @return {Float32Array} ベクトル格納用の配列
         */
        value: function create() {
            return new Float32Array(2);
        }
        /**
         * ベクトルの長さ（大きさ）を返す
         * @param {Float32Array.<Vec2>} v - 2 つの要素を持つベクトル
         * @return {number} ベクトルの長さ（大きさ）
         */

    }, {
        key: "len",
        value: function len(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        }
        /**
         * 2 つの座標（始点・終点）を結ぶベクトルを返す
         * @param {Float32Array.<Vec2>} v0 - 2 つの要素を持つ始点座標
         * @param {Float32Array.<Vec2>} v1 - 2 つの要素を持つ終点座標
         * @return {Float32Array.<Vec2>} 視点と終点を結ぶベクトル
         */

    }, {
        key: "distance",
        value: function distance(v0, v1) {
            var n = Vec2.create();
            n[0] = v1[0] - v0[0];
            n[1] = v1[1] - v0[1];
            return n;
        }
        /**
         * ベクトルを正規化した結果を返す
         * @param {Float32Array.<Vec2>} v - 2 つの要素を持つベクトル
         * @return {Float32Array.<Vec2>} 正規化したベクトル
         */

    }, {
        key: "normalize",
        value: function normalize(v) {
            var n = Vec2.create();
            var l = Vec2.len(v);
            if (l > 0) {
                var e = 1.0 / l;
                n[0] = v[0] * e;
                n[1] = v[1] * e;
            }
            return n;
        }
        /**
         * 2 つのベクトルの内積の結果を返す
         * @param {Float32Array.<Vec2>} v0 - 2 つの要素を持つベクトル
         * @param {Float32Array.<Vec2>} v1 - 2 つの要素を持つベクトル
         * @return {number} 内積の結果
         */

    }, {
        key: "dot",
        value: function dot(v0, v1) {
            return v0[0] * v1[0] + v0[1] * v1[1];
        }
        /**
         * 2 つのベクトルの外積の結果を返す
         * @param {Float32Array.<Vec2>} v0 - 2 つの要素を持つベクトル
         * @param {Float32Array.<Vec2>} v1 - 2 つの要素を持つベクトル
         * @return {Float32Array.<Vec2>} 外積の結果
         */

    }, {
        key: "cross",
        value: function cross(v0, v1) {
            var n = Vec2.create();
            return v0[0] * v1[1] - v0[1] * v1[0];
        }
    }]);

    return Vec2;
}();

/**
 * Qtn
 * @class Qtn
 */


var Qtn = function () {
    function Qtn() {
        _classCallCheck(this, Qtn);
    }

    _createClass(Qtn, null, [{
        key: "create",

        /**
         * 4 つの要素からなるクォータニオンのデータ構造を生成する（虚部 x, y, z, 実部 w の順序で定義）
         * @return {Float32Array} クォータニオンデータ格納用の配列
         */
        value: function create() {
            return new Float32Array(4);
        }
        /**
         * クォータニオンを初期化する（参照に注意）
         * @param {Float32Array.<Qtn>} dest - 初期化するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 0;dest[1] = 0;dest[2] = 0;dest[3] = 1;
            return dest;
        }
        /**
         * 共役四元数を生成して返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn - 元となるクォータニオン
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "inverse",
        value: function inverse(qtn, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            out[0] = -qtn[0];
            out[1] = -qtn[1];
            out[2] = -qtn[2];
            out[3] = qtn[3];
            return out;
        }
        /**
         * 虚部を正規化して返す（参照に注意）
         * @param {Float32Array.<Qtn>} qtn - 元となるクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "normalize",
        value: function normalize(dest) {
            var x = dest[0],
                y = dest[1],
                z = dest[2];
            var l = Math.sqrt(x * x + y * y + z * z);
            if (l === 0) {
                dest[0] = 0;
                dest[1] = 0;
                dest[2] = 0;
            } else {
                l = 1 / l;
                dest[0] = x * l;
                dest[1] = y * l;
                dest[2] = z * l;
            }
            return dest;
        }
        /**
         * クォータニオンを乗算した結果を返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn0 - 乗算されるクォータニオン
         * @param {Float32Array.<Qtn>} qtn1 - 乗算するクォータニオン
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "multiply",
        value: function multiply(qtn0, qtn1, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            var ax = qtn0[0],
                ay = qtn0[1],
                az = qtn0[2],
                aw = qtn0[3];
            var bx = qtn1[0],
                by = qtn1[1],
                bz = qtn1[2],
                bw = qtn1[3];
            out[0] = ax * bw + aw * bx + ay * bz - az * by;
            out[1] = ay * bw + aw * by + az * bx - ax * bz;
            out[2] = az * bw + aw * bz + ax * by - ay * bx;
            out[3] = aw * bw - ax * bx - ay * by - az * bz;
            return out;
        }
        /**
         * クォータニオンに回転を適用し返す（参照に注意・戻り値としても結果を返す）
         * @param {number} angle - 回転する量（ラジアン）
         * @param {Array.<number>} axis - 3 つの要素を持つ軸ベクトル
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "rotate",
        value: function rotate(angle, axis, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            var a = axis[0],
                b = axis[1],
                c = axis[2];
            var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
            if (sq !== 0) {
                var l = 1 / sq;
                a *= l;
                b *= l;
                c *= l;
            }
            var s = Math.sin(angle * 0.5);
            out[0] = a * s;
            out[1] = b * s;
            out[2] = c * s;
            out[3] = Math.cos(angle * 0.5);
            return out;
        }
        /**
         * ベクトルにクォータニオンを適用し返す（参照に注意・戻り値としても結果を返す）
         * @param {Array.<number>} vec - 3 つの要素を持つベクトル
         * @param {Float32Array.<Qtn>} qtn - クォータニオン
         * @param {Array.<number>} [dest] - 3 つの要素を持つベクトル
         * @return {Array.<number>} 結果のベクトル
         */

    }, {
        key: "toVecIII",
        value: function toVecIII(vec, qtn, dest) {
            var out = dest;
            if (dest == null) {
                out = [0.0, 0.0, 0.0];
            }
            var qp = Qtn.create();
            var qq = Qtn.create();
            var qr = Qtn.create();
            Qtn.inverse(qtn, qr);
            qp[0] = vec[0];
            qp[1] = vec[1];
            qp[2] = vec[2];
            Qtn.multiply(qr, qp, qq);
            Qtn.multiply(qq, qtn, qr);
            out[0] = qr[0];
            out[1] = qr[1];
            out[2] = qr[2];
            return out;
        }
        /**
         * 4x4 行列にクォータニオンを適用し返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn - クォータニオン
         * @param {Float32Array.<Mat4>} [dest] - 4x4 行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "toMatIV",
        value: function toMatIV(qtn, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var x = qtn[0],
                y = qtn[1],
                z = qtn[2],
                w = qtn[3];
            var x2 = x + x,
                y2 = y + y,
                z2 = z + z;
            var xx = x * x2,
                xy = x * y2,
                xz = x * z2;
            var yy = y * y2,
                yz = y * z2,
                zz = z * z2;
            var wx = w * x2,
                wy = w * y2,
                wz = w * z2;
            out[0] = 1 - (yy + zz);
            out[1] = xy - wz;
            out[2] = xz + wy;
            out[3] = 0;
            out[4] = xy + wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz - wx;
            out[7] = 0;
            out[8] = xz - wy;
            out[9] = yz + wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        /**
         * 2 つのクォータニオンの球面線形補間を行った結果を返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn0 - クォータニオン
         * @param {Float32Array.<Qtn>} qtn1 - クォータニオン
         * @param {number} time - 補間係数（0.0 から 1.0 で指定）
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "slerp",
        value: function slerp(qtn0, qtn1, time, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            var ht = qtn0[0] * qtn1[0] + qtn0[1] * qtn1[1] + qtn0[2] * qtn1[2] + qtn0[3] * qtn1[3];
            var hs = 1.0 - ht * ht;
            if (hs <= 0.0) {
                out[0] = qtn0[0];
                out[1] = qtn0[1];
                out[2] = qtn0[2];
                out[3] = qtn0[3];
            } else {
                hs = Math.sqrt(hs);
                if (Math.abs(hs) < 0.0001) {
                    out[0] = qtn0[0] * 0.5 + qtn1[0] * 0.5;
                    out[1] = qtn0[1] * 0.5 + qtn1[1] * 0.5;
                    out[2] = qtn0[2] * 0.5 + qtn1[2] * 0.5;
                    out[3] = qtn0[3] * 0.5 + qtn1[3] * 0.5;
                } else {
                    var ph = Math.acos(ht);
                    var pt = ph * time;
                    var t0 = Math.sin(ph - pt) / hs;
                    var t1 = Math.sin(pt) / hs;
                    out[0] = qtn0[0] * t0 + qtn1[0] * t1;
                    out[1] = qtn0[1] * t0 + qtn1[1] * t1;
                    out[2] = qtn0[2] * t0 + qtn1[2] * t1;
                    out[3] = qtn0[3] * t0 + qtn1[3] * t1;
                }
            }
            return out;
        }
    }]);

    return Qtn;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * gl3Mesh
 * @class
 */
var gl3Mesh = function () {
    function gl3Mesh() {
        _classCallCheck(this, gl3Mesh);
    }

    _createClass(gl3Mesh, null, [{
        key: "plane",

        /**
         * 板ポリゴンの頂点情報を生成する
         * @param {number} width - 板ポリゴンの一辺の幅
         * @param {number} height - 板ポリゴンの一辺の高さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let planeData = gl3.Mesh.plane(2.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
         */
        value: function plane(width, height, color) {
            var w = void 0,
                h = void 0;
            w = width / 2;
            h = height / 2;
            if (color) {
                tc = color;
            } else {
                tc = [1.0, 1.0, 1.0, 1.0];
            }
            var pos = [-w, h, 0.0, w, h, 0.0, -w, -h, 0.0, w, -h, 0.0];
            var nor = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0];
            var col = [color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]];
            var st = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];
            var idx = [0, 1, 2, 2, 1, 3];
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 円（XY 平面展開）の頂点情報を生成する
         * @param {number} split - 円の円周の分割数
         * @param {number} rad - 円の半径
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let circleData = gl3.Mesh.circle(64, 1.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "circle",
        value: function circle(split, rad, color) {
            var i = void 0,
                j = 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            pos.push(0.0, 0.0, 0.0);
            nor.push(0.0, 0.0, 1.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5);
            for (i = 0; i < split; i++) {
                var r = Math.PI * 2.0 / split * i;
                var rx = Math.cos(r);
                var ry = Math.sin(r);
                pos.push(rx * rad, ry * rad, 0.0);
                nor.push(0.0, 0.0, 1.0);
                col.push(color[0], color[1], color[2], color[3]);
                st.push((rx + 1.0) * 0.5, 1.0 - (ry + 1.0) * 0.5);
                if (i === split - 1) {
                    idx.push(0, j + 1, 1);
                } else {
                    idx.push(0, j + 1, j + 2);
                }
                ++j;
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * キューブの頂点情報を生成する
         * @param {number} side - 正立方体の一辺の長さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線 ※キューブの中心から各頂点に向かって伸びるベクトルなので注意
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let cubeData = gl3.Mesh.cube(2.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "cube",
        value: function cube(side, color) {
            var hs = side * 0.5;
            var pos = [-hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs, -hs, -hs, hs, -hs, -hs, hs, hs, hs, hs, hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, -hs, hs, -hs, hs, -hs, -hs, hs, hs, -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, -hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs];
            var v = 1.0 / Math.sqrt(3.0);
            var nor = [-v, -v, v, v, -v, v, v, v, v, -v, v, v, -v, -v, -v, -v, v, -v, v, v, -v, v, -v, -v, -v, v, -v, -v, v, v, v, v, v, v, v, -v, -v, -v, -v, v, -v, -v, v, -v, v, -v, -v, v, v, -v, -v, v, v, -v, v, v, v, v, -v, v, -v, -v, -v, -v, -v, v, -v, v, v, -v, v, -v];
            var col = [];
            for (var i = 0; i < pos.length / 3; i++) {
                col.push(color[0], color[1], color[2], color[3]);
            }
            var st = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
            var idx = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 三角錐の頂点情報を生成する
         * @param {number} split - 底面円の円周の分割数
         * @param {number} rad - 底面円の半径
         * @param {number} height - 三角錐の高さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let coneData = gl3.Mesh.cone(64, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "cone",
        value: function cone(split, rad, height, color) {
            var i = void 0,
                j = 0;
            var h = height / 2.0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            pos.push(0.0, -h, 0.0);
            nor.push(0.0, -1.0, 0.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5);
            for (i = 0; i <= split; i++) {
                var r = Math.PI * 2.0 / split * i;
                var rx = Math.cos(r);
                var rz = Math.sin(r);
                pos.push(rx * rad, -h, rz * rad, rx * rad, -h, rz * rad);
                nor.push(0.0, -1.0, 0.0, rx, 0.0, rz);
                col.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
                st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5, (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5);
                if (i !== split) {
                    idx.push(0, j + 1, j + 3);
                    idx.push(j + 4, j + 2, split * 2 + 3);
                }
                j += 2;
            }
            pos.push(0.0, h, 0.0);
            nor.push(0.0, 1.0, 0.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5);
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 円柱の頂点情報を生成する
         * @param {number} split - 円柱の円周の分割数
         * @param {number} topRad - 円柱の天面の半径
         * @param {number} bottomRad - 円柱の底面の半径
         * @param {number} height - 円柱の高さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let cylinderData = gl3.Mesh.cylinder(64, 0.5, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "cylinder",
        value: function cylinder(split, topRad, bottomRad, height, color) {
            var i = void 0,
                j = 2;
            var h = height / 2.0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            pos.push(0.0, h, 0.0, 0.0, -h, 0.0);
            nor.push(0.0, 1.0, 0.0, 0.0, -1.0, 0.0);
            col.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5, 0.5, 0.5);
            for (i = 0; i <= split; i++) {
                var r = Math.PI * 2.0 / split * i;
                var rx = Math.cos(r);
                var rz = Math.sin(r);
                pos.push(rx * topRad, h, rz * topRad, rx * topRad, h, rz * topRad, rx * bottomRad, -h, rz * bottomRad, rx * bottomRad, -h, rz * bottomRad);
                nor.push(0.0, 1.0, 0.0, rx, 0.0, rz, 0.0, -1.0, 0.0, rx, 0.0, rz);
                col.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
                st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5, 1.0 - i / split, 0.0, (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5, 1.0 - i / split, 1.0);
                if (i !== split) {
                    idx.push(0, j + 4, j, 1, j + 2, j + 6, j + 5, j + 7, j + 1, j + 1, j + 7, j + 3);
                }
                j += 4;
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 球体の頂点情報を生成する
         * @param {number} row - 球の縦方向（緯度方向）の分割数
         * @param {number} column - 球の横方向（経度方向）の分割数
         * @param {number} rad - 球の半径
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let sphereData = gl3.Mesh.sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "sphere",
        value: function sphere(row, column, rad, color) {
            var i = void 0,
                j = void 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            for (i = 0; i <= row; i++) {
                var r = Math.PI / row * i;
                var ry = Math.cos(r);
                var rr = Math.sin(r);
                for (j = 0; j <= column; j++) {
                    var tr = Math.PI * 2 / column * j;
                    var tx = rr * rad * Math.cos(tr);
                    var ty = ry * rad;
                    var tz = rr * rad * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    pos.push(tx, ty, tz);
                    nor.push(rx, ry, rz);
                    col.push(color[0], color[1], color[2], color[3]);
                    st.push(1 - 1 / column * j, 1 / row * i);
                }
            }
            for (i = 0; i < row; i++) {
                for (j = 0; j < column; j++) {
                    var _r = (column + 1) * i + j;
                    idx.push(_r, _r + 1, _r + column + 2);
                    idx.push(_r, _r + column + 2, _r + column + 1);
                }
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * トーラスの頂点情報を生成する
         * @param {number} row - 輪の分割数
         * @param {number} column - パイプ断面の分割数
         * @param {number} irad - パイプ断面の半径
         * @param {number} orad - パイプ全体の半径
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let torusData = gl3.Mesh.torus(64, 64, 0.25, 0.75, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "torus",
        value: function torus(row, column, irad, orad, color) {
            var i = void 0,
                j = void 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            for (i = 0; i <= row; i++) {
                var r = Math.PI * 2 / row * i;
                var rr = Math.cos(r);
                var ry = Math.sin(r);
                for (j = 0; j <= column; j++) {
                    var tr = Math.PI * 2 / column * j;
                    var tx = (rr * irad + orad) * Math.cos(tr);
                    var ty = ry * irad;
                    var tz = (rr * irad + orad) * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    var rs = 1 / column * j;
                    var rt = 1 / row * i + 0.5;
                    if (rt > 1.0) {
                        rt -= 1.0;
                    }
                    rt = 1.0 - rt;
                    pos.push(tx, ty, tz);
                    nor.push(rx, ry, rz);
                    col.push(color[0], color[1], color[2], color[3]);
                    st.push(rs, rt);
                }
            }
            for (i = 0; i < row; i++) {
                for (j = 0; j < column; j++) {
                    var _r2 = (column + 1) * i + j;
                    idx.push(_r2, _r2 + column + 1, _r2 + 1);
                    idx.push(_r2 + column + 1, _r2 + column + 2, _r2 + 1);
                }
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }
    }]);

    return gl3Mesh;
}();

exports.default = gl3Mesh;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * gl3Util
 * @class gl3Util
 */
var gl3Util = function () {
    function gl3Util() {
        _classCallCheck(this, gl3Util);
    }

    _createClass(gl3Util, null, [{
        key: "hsva",

        /**
         * HSV カラーを生成して配列で返す
         * @param {number} h - 色相
         * @param {number} s - 彩度
         * @param {number} v - 明度
         * @param {number} a - アルファ
         * @return {Array.<number>} RGBA を 0.0 から 1.0 の範囲に正規化した色の配列
         */
        value: function hsva(h, s, v, a) {
            if (s > 1 || v > 1 || a > 1) {
                return;
            }
            var th = h % 360;
            var i = Math.floor(th / 60);
            var f = th / 60 - i;
            var m = v * (1 - s);
            var n = v * (1 - s * f);
            var k = v * (1 - s * (1 - f));
            var color = new Array();
            if (!s > 0 && !s < 0) {
                color.push(v, v, v, a);
            } else {
                var r = new Array(v, n, m, m, k, v);
                var g = new Array(k, v, v, n, m, m);
                var b = new Array(m, m, k, v, v, n);
                color.push(r[i], g[i], b[i], a);
            }
            return color;
        }

        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         * @return {number} イージングした結果
         */

    }, {
        key: "easeLiner",
        value: function easeLiner(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         * @return {number} イージングした結果
         */

    }, {
        key: "easeOutCubic",
        value: function easeOutCubic(t) {
            return (t = t / 1 - 1) * t * t + 1;
        }

        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         * @return {number} イージングした結果
         */

    }, {
        key: "easeQuintic",
        value: function easeQuintic(t) {
            var ts = (t = t / 1) * t;
            var tc = ts * t;
            return tc * ts;
        }

        /**
         * 度数法の角度から弧度法の値へ変換する
         * @param {number} deg - 度数法の角度
         * @return {number} 弧度法の値
         */

    }, {
        key: "degToRad",
        value: function degToRad(deg) {
            return deg % 360 * Math.PI / 180;
        }

        /**
         * 赤道半径（km）
         * @type {number}
         */

    }, {
        key: "lonToMer",


        /**
         * 経度を元にメルカトル座標を返す
         * @param {number} lon - 経度
         * @return {number} メルカトル座標系における X
         */
        value: function lonToMer(lon) {
            return gl3Util.EARTH_RADIUS * gl3Util.degToRad(lon);
        }

        /**
         * 緯度を元にメルカトル座標を返す
         * @param {number} lat - 緯度
         * @param {number} [flatten=0] - 扁平率
         * @return {number} メルカトル座標系における Y
         */

    }, {
        key: "latToMer",
        value: function latToMer(lat) {
            var flatten = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var flattening = flatten;
            if (isNaN(parseFloat(flatten))) {
                flattening = 0;
            }
            var clamp = 0.0001;
            if (lat >= 90 - clamp) {
                lat = 90 - clamp;
            }
            if (lat <= -90 + clamp) {
                lat = -90 + clamp;
            }
            var temp = 1 - flattening;
            var es = 1.0 - temp * temp;
            var eccent = Math.sqrt(es);
            var phi = gl3Util.degToRad(lat);
            var sinphi = Math.sin(phi);
            var con = eccent * sinphi;
            var com = 0.5 * eccent;
            con = Math.pow((1.0 - con) / (1.0 + con), com);
            var ts = Math.tan(0.5 * (Math.PI * 0.5 - phi)) / con;
            return gl3Util.EARTH_RADIUS * Math.log(ts);
        }

        /**
         * 緯度経度をメルカトル座標系に変換して返す
         * @param {number} lon - 経度
         * @param {number} lat - 緯度
         * @param {number} [flatten=0] - 扁平率
         * @return {obj}
         * @property {number} x - メルカトル座標系における X 座標
         * @property {number} y - メルカトル座標系における Y 座標
         */

    }, {
        key: "lonLatToMer",
        value: function lonLatToMer(lon, lat) {
            var flatten = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            return {
                x: gl3Util.lonToMer(lon),
                y: gl3Util.latToMer(lat, flattening)
            };
        }

        /**
         * メルカトル座標を緯度経度に変換して返す
         * @param {number} x - メルカトル座標系における X 座標
         * @param {number} y - メルカトル座標系における Y 座標
         * @return {obj}
         * @property {number} lon - 経度
         * @property {number} lat - 緯度
         */

    }, {
        key: "merToLonLat",
        value: function merToLonLat(x, y) {
            var lon = x / gl3Util.EARTH_HALF_CIRCUM * 180;
            var lat = y / gl3Util.EARTH_HALF_CIRCUM * 180;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return {
                lon: lon,
                lat: lat
            };
        }

        /**
         * 経度からタイルインデックスを求めて返す
         * @param {number} lon - 経度
         * @param {number} zoom - ズームレベル
         * @return {number} 経度方向のタイルインデックス
         */

    }, {
        key: "lonToTile",
        value: function lonToTile(lon, zoom) {
            return Math.floor((lon / 180 + 1) * Math.pow(2, zoom) / 2);
        }

        /**
         * 緯度からタイルインデックスを求めて返す
         * @param {number} lat - 緯度
         * @param {number} zoom - ズームレベル
         * @return {number} 緯度方向のタイルインデックス
         */

    }, {
        key: "latToTile",
        value: function latToTile(lat, zoom) {
            return Math.floor((-Math.log(Math.tan((45 + lat / 2) * Math.PI / 180)) + Math.PI) * Math.pow(2, zoom) / (2 * Math.PI));
        }

        /**
         * 緯度経度をタイルインデックスに変換して返す
         * @param {number} lon - 経度
         * @param {number} lat - 緯度
         * @param {number} zoom - ズームレベル
         * @return {obj}
         * @property {number} lon - 経度方向のタイルインデックス
         * @property {number} lat - 緯度方向のタイルインデックス
         */

    }, {
        key: "lonLatToTile",
        value: function lonLatToTile(lon, lat, zoom) {
            return {
                lon: gl3Util.lonToTile(lon, zoom),
                lat: gl3Util.latToTile(lat, zoom)
            };
        }

        /**
         * タイルインデックスから経度を求めて返す
         * @param {number} lon - 経度方向のタイルインデックス
         * @param {number} zoom - ズームレベル
         * @return {number} 経度
         */

    }, {
        key: "tileToLon",
        value: function tileToLon(lon, zoom) {
            return lon / Math.pow(2, zoom) * 360 - 180;
        }

        /**
         * タイルインデックスから緯度を求めて返す
         * @param {number} lat - 緯度方向のタイルインデックス
         * @param {number} zoom - ズームレベル
         * @return {number} 緯度
         */

    }, {
        key: "tileToLat",
        value: function tileToLat(lat, zoom) {
            var y = lat / Math.pow(2, zoom) * 2 * Math.PI - Math.PI;
            return 2 * Math.atan(Math.pow(Math.E, -y)) * 180 / Math.PI - 90;
        }

        /**
         * タイルインデックスから緯度経度を求めて返す
         * @param {number} lon - 経度
         * @param {number} lat - 緯度
         * @param {number} zoom - ズームレベル
         * @return {obj}
         * @property {number} lon - 経度方向のタイルインデックス
         * @property {number} lat - 緯度方向のタイルインデックス
         */

    }, {
        key: "tileToLonLat",
        value: function tileToLonLat(lon, lat, zoom) {
            return {
                lon: gl3Util.tileToLon(lon, zoom),
                lat: gl3Util.tileToLat(lat, zoom)
            };
        }
    }, {
        key: "EARTH_RADIUS",
        get: function get() {
            return 6378.137;
        }

        /**
         * 赤道円周（km）
         * @type {number}
         */

    }, {
        key: "EARTH_CIRCUM",
        get: function get() {
            return gl3Util.EARTH_RADIUS * Math.PI * 2.0;
        }

        /**
         * 赤道円周の半分（km）
         * @type {number}
         */

    }, {
        key: "EARTH_HALF_CIRCUM",
        get: function get() {
            return gl3Util.EARTH_RADIUS * Math.PI;
        }

        /**
         * メルカトル座標系における最大緯度
         * @type {number}
         */

    }, {
        key: "EARTH_MAX_LAT",
        get: function get() {
            return 85.05112878;
        }
    }]);

    return gl3Util;
}();

exports.default = gl3Util;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gl3Audio = __webpack_require__(0);

var _gl3Audio2 = _interopRequireDefault(_gl3Audio);

var _gl3Math = __webpack_require__(2);

var _gl3Math2 = _interopRequireDefault(_gl3Math);

var _gl3Mesh = __webpack_require__(3);

var _gl3Mesh2 = _interopRequireDefault(_gl3Mesh);

var _gl3Util = __webpack_require__(4);

var _gl3Util2 = _interopRequireDefault(_gl3Util);

var _gl3Gui = __webpack_require__(1);

var _gl3Gui2 = _interopRequireDefault(_gl3Gui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * glcubic
 * @class gl3
 */
var gl3 = function () {
    /**
     * @constructor
     */
    function gl3() {
        _classCallCheck(this, gl3);

        /**
         * version
         * @const
         * @type {string}
         */
        this.VERSION = '0.2.1';
        /**
         * pi * 2
         * @const
         * @type {number}
         */
        this.PI2 = 6.28318530717958647692528676655900576;
        /**
         * pi
         * @const
         * @type {number}
         */
        this.PI = 3.14159265358979323846264338327950288;
        /**
         * pi / 2
         * @const
         * @type {number}
         */
        this.PIH = 1.57079632679489661923132169163975144;
        /**
         * pi / 4
         * @const
         * @type {number}
         */
        this.PIH2 = 0.78539816339744830961566084581987572;
        /**
         * gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS を利用して得られるテクスチャユニットの最大利用可能数
         * @const
         * @type {number}
         */
        this.TEXTURE_UNIT_COUNT = null;

        /**
         * glcubic が正しく初期化されたどうかのフラグ
         * @type {boolean}
         */
        this.ready = false;
        /**
         * glcubic と紐付いている canvas element
         * @type {HTMLCanvasElement}
         */
        this.canvas = null;
        /**
         * glcubic と紐付いている canvas から取得した WebGL Rendering Context
         * @type {WebGLRenderingContext}
         */
        this.gl = null;
        /**
         * WebGL2RenderingContext として初期化したかどうかを表す真偽値
         * @type {bool}
         */
        this.isWebGL2 = false;
        /**
         * glcubic が内部的に持っているテクスチャ格納用の配列
         * @type {Array.<WebGLTexture>}
         */
        this.textures = null;
        /**
         * WebGL の拡張機能を格納するオブジェクト
         * @type {Object}
         */
        this.ext = null;

        /**
         * gl3Audio クラスのインスタンス
         * @type {gl3Audio}
         */
        this.Audio = _gl3Audio2.default;
        /**
         * gl3Mesh クラスのインスタンス
         * @type {gl3Mesh}
         */
        this.Mesh = _gl3Mesh2.default;
        /**
         * gl3Util クラスのインスタンス
         * @type {gl3Util}
         */
        this.Util = _gl3Util2.default;
        /**
         * gl3Gui クラスのインスタンス
         * @type {gl3Gui}
         */
        this.Gui = new _gl3Gui2.default();
        /**
         * gl3Math クラスのインスタンス
         * @type {gl3Math}
         */
        this.Math = new _gl3Math2.default();

        console.log('%c◆%c glcubic.js %c◆%c : version %c' + this.VERSION, 'color: crimson', '', 'color: crimson', '', 'color: royalblue');
    }

    /**
     * glcubic を初期化する
     * @param {HTMLCanvasElement|string} canvas - canvas element か canvas に付与されている ID 文字列
     * @param {Object} initOptions - canvas.getContext で第二引数に渡す初期化時オプション
     * @param {bool} webgl2Mode - webgl2 を有効化する場合 true
     * @return {boolean} 初期化が正しく行われたかどうかを表す真偽値
     */


    _createClass(gl3, [{
        key: 'init',
        value: function init(canvas, initOptions, webgl2Mode) {
            var opt = initOptions || {};
            this.ready = false;
            if (canvas == null) {
                return false;
            }
            if (canvas instanceof HTMLCanvasElement) {
                this.canvas = canvas;
            } else if (Object.prototype.toString.call(canvas) === '[object String]') {
                this.canvas = document.getElementById(canvas);
            }
            if (this.canvas == null) {
                return false;
            }
            if (webgl2Mode === true) {
                this.gl = this.canvas.getContext('webgl2', opt);
                this.isWebGL2 = true;
            }
            if (this.gl == null) {
                this.gl = this.canvas.getContext('webgl', opt) || this.canvas.getContext('experimental-webgl', opt);
            }
            if (this.gl != null) {
                this.ready = true;
                this.TEXTURE_UNIT_COUNT = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                this.textures = new Array(this.TEXTURE_UNIT_COUNT);
                this.ext = {
                    elementIndexUint: this.gl.getExtension('OES_element_index_uint'),
                    textureFloat: this.gl.getExtension('OES_texture_float'),
                    textureHalfFloat: this.gl.getExtension('OES_texture_half_float'),
                    drawBuffers: this.gl.getExtension('WEBGL_draw_buffers')
                };
            }
            return this.ready;
        }

        /**
         * フレームバッファをクリアする
         * @param {Array.<number>} color - クリアする色（0.0 ~ 1.0）
         * @param {number} [depth] - クリアする深度
         * @param {number} [stencil] - クリアするステンシル値
         */

    }, {
        key: 'sceneClear',
        value: function sceneClear(color, depth, stencil) {
            var gl = this.gl;
            var flg = gl.COLOR_BUFFER_BIT;
            gl.clearColor(color[0], color[1], color[2], color[3]);
            if (depth != null) {
                gl.clearDepth(depth);
                flg = flg | gl.DEPTH_BUFFER_BIT;
            }
            if (stencil != null) {
                gl.clearStencil(stencil);
                flg = flg | gl.STENCIL_BUFFER_BIT;
            }
            gl.clear(flg);
        }

        /**
         * ビューポートを設定する
         * @param {number} [x] - x（左端原点）
         * @param {number} [y] - y（下端原点）
         * @param {number} [width] - 横の幅
         * @param {number} [height] - 縦の高さ
         */

    }, {
        key: 'sceneView',
        value: function sceneView(x, y, width, height) {
            var X = x || 0;
            var Y = y || 0;
            var w = width || window.innerWidth;
            var h = height || window.innerHeight;
            this.gl.viewport(X, Y, w, h);
        }

        /**
         * gl.drawArrays をコールするラッパー
         * @param {number} primitive - プリミティブタイプ
         * @param {number} vertexCount - 描画する頂点の個数
         * @param {number} [offset=0] - 描画する頂点の開始オフセット
         */

    }, {
        key: 'drawArrays',
        value: function drawArrays(primitive, vertexCount) {
            var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.gl.drawArrays(primitive, offset, vertexCount);
        }

        /**
         * gl.drawElements をコールするラッパー
         * @param {number} primitive - プリミティブタイプ
         * @param {number} indexLength - 描画するインデックスの個数
         * @param {number} [offset=0] - 描画するインデックスの開始オフセット
         */

    }, {
        key: 'drawElements',
        value: function drawElements(primitive, indexLength) {
            var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_SHORT, offset);
        }

        /**
         * gl.drawElements をコールするラッパー（gl.UNSIGNED_INT） ※要拡張機能（WebGL 1.0）
         * @param {number} primitive - プリミティブタイプ
         * @param {number} indexLength - 描画するインデックスの個数
         * @param {number} [offset=0] - 描画するインデックスの開始オフセット
         */

    }, {
        key: 'drawElementsInt',
        value: function drawElementsInt(primitive, indexLength) {
            var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_INT, offset);
        }

        /**
         * VBO（Vertex Buffer Object）を生成して返す
         * @param {Array.<number>} data - 頂点情報を格納した配列
         * @return {WebGLBuffer} 生成した頂点バッファ
         */

    }, {
        key: 'createVbo',
        value: function createVbo(data) {
            if (data == null) {
                return;
            }
            var vbo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            return vbo;
        }

        /**
         * IBO（Index Buffer Object）を生成して返す
         * @param {Array.<number>} data - インデックス情報を格納した配列
         * @return {WebGLBuffer} 生成したインデックスバッファ
         */

    }, {
        key: 'createIbo',
        value: function createIbo(data) {
            if (data == null) {
                return;
            }
            var ibo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
            return ibo;
        }

        /**
         * IBO（Index Buffer Object）を生成して返す（gl.UNSIGNED_INT） ※要拡張機能（WebGL 1.0）
         * @param {Array.<number>} data - インデックス情報を格納した配列
         * @return {WebGLBuffer} 生成したインデックスバッファ
         */

    }, {
        key: 'createIboInt',
        value: function createIboInt(data) {
            if (data == null) {
                return;
            }
            var ibo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(data), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
            return ibo;
        }

        /**
         * ファイルを元にテクスチャを生成して返す
         * @param {string} source - ファイルパス
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @param {function} callback - 画像のロードが完了しテクスチャを生成した後に呼ばれるコールバック
         */

    }, {
        key: 'createTextureFromFile',
        value: function createTextureFromFile(source, number, callback) {
            var _this = this;

            if (source == null || number == null) {
                return;
            }
            var img = new Image();
            var gl = this.gl;
            img.onload = function () {
                _this.textures[number] = { texture: null, type: null, loaded: false };
                var tex = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0 + number);
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                _this.textures[number].texture = tex;
                _this.textures[number].type = gl.TEXTURE_2D;
                _this.textures[number].loaded = true;
                console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                gl.bindTexture(gl.TEXTURE_2D, null);
                if (callback != null) {
                    callback(number);
                }
            };
            img.src = source;
        }

        /**
         * オブジェクトを元にテクスチャを生成して返す
         * @param {object} object - ロード済みの Image オブジェクトや Canvas オブジェクト
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         */

    }, {
        key: 'createTextureFromObject',
        value: function createTextureFromObject(object, number) {
            if (object == null || number == null) {
                return;
            }
            var gl = this.gl;
            var tex = gl.createTexture();
            this.textures[number] = { texture: null, type: null, loaded: false };
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, object);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this.textures[number].texture = tex;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            console.log('%c◆%c texture number: %c' + number + '%c, object attached', 'color: crimson', '', 'color: blue', '');
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        /**
         * 画像を元にキューブマップテクスチャを生成する
         * @param {Array.<string>} source - ファイルパスを格納した配列
         * @param {Array.<number>} target - キューブマップテクスチャに設定するターゲットの配列
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @param {function} callback - 画像のロードが完了しテクスチャを生成した後に呼ばれるコールバック
         */

    }, {
        key: 'createTextureCubeFromFile',
        value: function createTextureCubeFromFile(source, target, number, callback) {
            var _this2 = this;

            if (source == null || target == null || number == null) {
                return;
            }
            var cImg = [];
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            for (var i = 0; i < source.length; i++) {
                cImg[i] = { image: new Image(), loaded: false };
                cImg[i].image.onload = function (index) {
                    return function () {
                        cImg[index].loaded = true;
                        if (cImg.length === 6) {
                            var f = true;
                            cImg.map(function (v) {
                                f = f && v.loaded;
                            });
                            if (f === true) {
                                var tex = gl.createTexture();
                                gl.activeTexture(gl.TEXTURE0 + number);
                                gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
                                for (var j = 0; j < source.length; j++) {
                                    gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cImg[j].image);
                                }
                                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                _this2.textures[number].texture = tex;
                                _this2.textures[number].type = gl.TEXTURE_CUBE_MAP;
                                _this2.textures[number].loaded = true;
                                console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source[0] + '...', 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                                if (callback != null) {
                                    callback(number);
                                }
                            }
                        }
                    };
                }(i);
                cImg[i].image.src = source[i];
            }
        }

        /**
         * glcubic が持つ配列のインデックスとテクスチャユニットを指定してテクスチャをバインドする
         * @param {number} unit - テクスチャユニット
         * @param {number} number - glcubic が持つ配列のインデックス
         */

    }, {
        key: 'bindTexture',
        value: function bindTexture(unit, number) {
            if (this.textures[number] == null) {
                return;
            }
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(this.textures[number].type, this.textures[number].texture);
        }

        /**
         * glcubic が持つ配列内のテクスチャ用画像が全てロード済みかどうか確認する
         * @return {boolean} ロードが完了しているかどうかのフラグ
         */

    }, {
        key: 'isTextureLoaded',
        value: function isTextureLoaded() {
            var i = void 0,
                j = void 0,
                f = void 0,
                g = void 0;
            f = true;g = false;
            for (i = 0, j = this.textures.length; i < j; i++) {
                if (this.textures[i] != null) {
                    g = true;
                    f = f && this.textures[i].loaded;
                }
            }
            if (g) {
                return f;
            } else {
                return false;
            }
        }

        /**
         * フレームバッファを生成しカラーバッファにテクスチャを設定してオブジェクトとして返す
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebuffer',
        value: function createFramebuffer(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var depthRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, fTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created', 'color: crimson', '', 'color: blue', '');
            return { framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture };
        }

        /**
         * フレームバッファを生成しカラーバッファにテクスチャを設定、ステンシル有効でオブジェクトとして返す
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthStencilRenderbuffer - 深度バッファ兼ステンシルバッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebufferStencil',
        value: function createFramebufferStencil(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var depthStencilRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilRenderBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, fTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created (enable stencil)', 'color: crimson', '', 'color: blue', '');
            return { framebuffer: frameBuffer, depthStencilRenderbuffer: depthStencilRenderBuffer, texture: fTexture };
        }

        /**
         * フレームバッファを生成しカラーバッファに浮動小数点テクスチャを設定してオブジェクトとして返す ※要拡張機能（WebGL 1.0）
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebufferFloat',
        value: function createFramebufferFloat(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            if (this.ext == null || this.ext.textureFloat == null && this.ext.textureHalfFloat == null) {
                console.log('float texture not support');
                return;
            }
            var gl = this.gl;
            var flg = this.ext.textureFloat != null ? gl.FLOAT : this.ext.textureHalfFloat.HALF_FLOAT_OES;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, fTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, flg, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created (enable float)', 'color: crimson', '', 'color: blue', '');
            return { framebuffer: frameBuffer, depthRenderbuffer: null, texture: fTexture };
        }

        /**
         * フレームバッファを生成しカラーバッファにキューブテクスチャを設定してオブジェクトとして返す
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {Array.<number>} target - キューブマップテクスチャに設定するターゲットの配列
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebufferCube',
        value: function createFramebufferCube(width, height, target, number) {
            if (width == null || height == null || target == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var depthRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, fTexture);
            for (var i = 0; i < target.length; i++) {
                gl.texImage2D(target[i], 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_CUBE_MAP;
            this.textures[number].loaded = true;
            console.log('%c◆%c texture number: %c' + number + '%c, framebuffer cube created', 'color: crimson', '', 'color: blue', '');
            return { framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture };
        }

        /**
         * HTML 内に存在する ID 文字列から script タグを参照しプログラムオブジェクトを生成する
         * @param {string} vsId - 頂点シェーダのソースが記述された script タグの ID 文字列
         * @param {string} fsId - フラグメントシェーダのソースが記述された script タグの ID 文字列
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス
         */

    }, {
        key: 'createProgramFromId',
        value: function createProgramFromId(vsId, fsId, attLocation, attStride, uniLocation, uniType) {
            if (this.gl == null) {
                return null;
            }
            var i = void 0;
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            mng.vs = mng.createShaderFromId(vsId);
            mng.fs = mng.createShaderFromId(fsId);
            mng.prg = mng.createProgram(mng.vs, mng.fs);
            if (mng.prg == null) {
                return mng;
            }
            mng.attL = new Array(attLocation.length);
            mng.attS = new Array(attLocation.length);
            for (i = 0; i < attLocation.length; i++) {
                mng.attL[i] = this.gl.getAttribLocation(mng.prg, attLocation[i]);
                mng.attS[i] = attStride[i];
            }
            mng.uniL = new Array(uniLocation.length);
            for (i = 0; i < uniLocation.length; i++) {
                mng.uniL[i] = this.gl.getUniformLocation(mng.prg, uniLocation[i]);
            }
            mng.uniT = uniType;
            mng.locationCheck(attLocation, uniLocation);
            return mng;
        }

        /**
         * シェーダのソースコード文字列からプログラムオブジェクトを生成する
         * @param {string} vs - 頂点シェーダのソース
         * @param {string} fs - フラグメントシェーダのソース
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス
         */

    }, {
        key: 'createProgramFromSource',
        value: function createProgramFromSource(vs, fs, attLocation, attStride, uniLocation, uniType) {
            if (this.gl == null) {
                return null;
            }
            var i = void 0;
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            mng.vs = mng.createShaderFromSource(vs, this.gl.VERTEX_SHADER);
            mng.fs = mng.createShaderFromSource(fs, this.gl.FRAGMENT_SHADER);
            mng.prg = mng.createProgram(mng.vs, mng.fs);
            if (mng.prg == null) {
                return mng;
            }
            mng.attL = new Array(attLocation.length);
            mng.attS = new Array(attLocation.length);
            for (i = 0; i < attLocation.length; i++) {
                mng.attL[i] = this.gl.getAttribLocation(mng.prg, attLocation[i]);
                mng.attS[i] = attStride[i];
            }
            mng.uniL = new Array(uniLocation.length);
            for (i = 0; i < uniLocation.length; i++) {
                mng.uniL[i] = this.gl.getUniformLocation(mng.prg, uniLocation[i]);
            }
            mng.uniT = uniType;
            mng.locationCheck(attLocation, uniLocation);
            return mng;
        }

        /**
         * ファイルからシェーダのソースコードを取得しプログラムオブジェクトを生成する
         * @param {string} vsPath - 頂点シェーダのソースが記述されたファイルのパス
         * @param {string} fsPath - フラグメントシェーダのソースが記述されたファイルのパス
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @param {function} callback - ソースコードのロードが完了しプログラムオブジェクトを生成した後に呼ばれるコールバック
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス ※ロード前にインスタンスは戻り値として返却される
         */

    }, {
        key: 'createProgramFromFile',
        value: function createProgramFromFile(vsPath, fsPath, attLocation, attStride, uniLocation, uniType, callback) {
            if (this.gl == null) {
                return null;
            }
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            var src = {
                vs: {
                    targetUrl: vsPath,
                    source: null
                },
                fs: {
                    targetUrl: fsPath,
                    source: null
                }
            };
            xhr(this.gl, src.vs);
            xhr(this.gl, src.fs);
            function xhr(gl, target) {
                var xml = new XMLHttpRequest();
                xml.open('GET', target.targetUrl, true);
                xml.setRequestHeader('Pragma', 'no-cache');
                xml.setRequestHeader('Cache-Control', 'no-cache');
                xml.onload = function () {
                    console.log('%c◆%c shader file loaded: %c' + target.targetUrl, 'color: crimson', '', 'color: goldenrod');
                    target.source = xml.responseText;
                    loadCheck(gl);
                };
                xml.send();
            }
            function loadCheck(gl) {
                if (src.vs.source == null || src.fs.source == null) {
                    return;
                }
                var i = void 0;
                mng.vs = mng.createShaderFromSource(src.vs.source, gl.VERTEX_SHADER);
                mng.fs = mng.createShaderFromSource(src.fs.source, gl.FRAGMENT_SHADER);
                mng.prg = mng.createProgram(mng.vs, mng.fs);
                if (mng.prg == null) {
                    return mng;
                }
                mng.attL = new Array(attLocation.length);
                mng.attS = new Array(attLocation.length);
                for (i = 0; i < attLocation.length; i++) {
                    mng.attL[i] = gl.getAttribLocation(mng.prg, attLocation[i]);
                    mng.attS[i] = attStride[i];
                }
                mng.uniL = new Array(uniLocation.length);
                for (i = 0; i < uniLocation.length; i++) {
                    mng.uniL[i] = gl.getUniformLocation(mng.prg, uniLocation[i]);
                }
                mng.uniT = uniType;
                mng.locationCheck(attLocation, uniLocation);
                callback(mng);
            }
            return mng;
        }

        /**
         * バッファオブジェクトを削除する
         * @param {WebGLBuffer} buffer - 削除するバッファオブジェクト
         */

    }, {
        key: 'deleteBuffer',
        value: function deleteBuffer(buffer) {
            if (this.gl.isBuffer(buffer) !== true) {
                return;
            }
            this.gl.deleteBuffer(buffer);
            buffer = null;
        }

        /**
         * テクスチャオブジェクトを削除する
         * @param {WebGLTexture} texture - 削除するテクスチャオブジェクト
         */

    }, {
        key: 'deleteTexture',
        value: function deleteTexture(texture) {
            if (this.gl.isTexture(texture) !== true) {
                return;
            }
            this.gl.deleteTexture(texture);
            texture = null;
        }

        /**
         * フレームバッファやレンダーバッファを削除する
         * @param {object} obj - フレームバッファ生成メソッドが返すオブジェクト
         */

    }, {
        key: 'deleteFramebuffer',
        value: function deleteFramebuffer(obj) {
            if (obj == null) {
                return;
            }
            for (var v in obj) {
                if (obj[v] instanceof WebGLFramebuffer && this.gl.isFramebuffer(obj[v]) === true) {
                    this.gl.deleteFramebuffer(obj[v]);
                    obj[v] = null;
                    continue;
                }
                if (obj[v] instanceof WebGLRenderbuffer && this.gl.isRenderbuffer(obj[v]) === true) {
                    this.gl.deleteRenderbuffer(obj[v]);
                    obj[v] = null;
                    continue;
                }
                if (obj[v] instanceof WebGLTexture && this.gl.isTexture(obj[v]) === true) {
                    this.gl.deleteTexture(obj[v]);
                    obj[v] = null;
                }
            }
            obj = null;
        }

        /**
         * シェーダオブジェクトを削除する
         * @param {WebGLShader} shader - シェーダオブジェクト
         */

    }, {
        key: 'deleteShader',
        value: function deleteShader(shader) {
            if (this.gl.isShader(shader) !== true) {
                return;
            }
            this.gl.deleteShader(shader);
            shader = null;
        }

        /**
         * プログラムオブジェクトを削除する
         * @param {WebGLProgram} program - プログラムオブジェクト
         */

    }, {
        key: 'deleteProgram',
        value: function deleteProgram(program) {
            if (this.gl.isProgram(program) !== true) {
                return;
            }
            this.gl.deleteProgram(program);
            program = null;
        }

        /**
         * ProgramManager クラスを内部プロパティごと削除する
         * @param {ProgramManager} prg - ProgramManager クラスのインスタンス
         */

    }, {
        key: 'deleteProgramManager',
        value: function deleteProgramManager(prg) {
            if (prg == null || !(prg instanceof ProgramManager)) {
                return;
            }
            this.deleteShader(prg.vs);
            this.deleteShader(prg.fs);
            this.deleteProgram(prg.prg);
            prg.attL = null;
            prg.attS = null;
            prg.uniL = null;
            prg.uniT = null;
            prg = null;
        }
    }]);

    return gl3;
}();

/**
 * プログラムオブジェクトやシェーダを管理するマネージャ
 * @class ProgramManager
 */


exports.default = gl3;

var ProgramManager = function () {
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - 自身が属する WebGL Rendering Context
     * @param {bool} webgl2Mode - webgl2 を有効化したかどうか
     */
    function ProgramManager(gl) {
        var webgl2Mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, ProgramManager);

        /**
         * 自身が属する WebGL Rendering Context
         * @type {WebGLRenderingContext}
         */
        this.gl = gl;
        /**
         * WebGL2RenderingContext として初期化したかどうかを表す真偽値
         * @type {bool}
         */
        this.isWebGL2 = webgl2Mode;
        /**
         * 頂点シェーダのシェーダオブジェクト
         * @type {WebGLShader}
         */
        this.vs = null;
        /**
         * フラグメントシェーダのシェーダオブジェクト
         * @type {WebGLShader}
         */
        this.fs = null;
        /**
         * プログラムオブジェクト
         * @type {WebGLProgram}
         */
        this.prg = null;
        /**
         * アトリビュートロケーションの配列
         * @type {Array.<number>}
         */
        this.attL = null;
        /**
         * アトリビュート変数のストライドの配列
         * @type {Array.<number>}
         */
        this.attS = null;
        /**
         * ユニフォームロケーションの配列
         * @type {Array.<WebGLUniformLocation>}
         */
        this.uniL = null;
        /**
         * ユニフォーム変数のタイプの配列
         * @type {Array.<string>}
         */
        this.uniT = null;
        /**
         * エラー関連情報を格納する
         * @type {object}
         * @property {string} vs - 頂点シェーダのコンパイルエラー
         * @property {string} fs - フラグメントシェーダのコンパイルエラー
         * @property {string} prg - プログラムオブジェクトのリンクエラー
         */
        this.error = { vs: null, fs: null, prg: null };
    }

    /**
     * script タグの ID を元にソースコードを取得しシェーダオブジェクトを生成する
     * @param {string} id - script タグに付加された ID 文字列
     * @return {WebGLShader} 生成したシェーダオブジェクト
     */


    _createClass(ProgramManager, [{
        key: 'createShaderFromId',
        value: function createShaderFromId(id) {
            var shader = void 0;
            var scriptElement = document.getElementById(id);
            if (!scriptElement) {
                return;
            }
            switch (scriptElement.type) {
                case 'x-shader/x-vertex':
                    shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                    break;
                case 'x-shader/x-fragment':
                    shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                    break;
                default:
                    return;
            }
            var source = scriptElement.text;
            if (this.isWebGL2 !== true) {
                if (source.search(/^#version 300 es/) > -1) {
                    console.warn('◆ can not use glsl es 3.0');
                    return;
                }
            }
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                var err = this.gl.getShaderInfoLog(shader);
                if (scriptElement.type === 'x-shader/x-vertex') {
                    this.error.vs = err;
                } else {
                    this.error.fs = err;
                }
                console.warn('◆ compile failed of shader: ' + err);
            }
        }

        /**
         * シェーダのソースコードを文字列で引数から取得しシェーダオブジェクトを生成する
         * @param {string} source - シェーダのソースコード
         * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
         * @return {WebGLShader} 生成したシェーダオブジェクト
         */

    }, {
        key: 'createShaderFromSource',
        value: function createShaderFromSource(source, type) {
            var shader = void 0;
            switch (type) {
                case this.gl.VERTEX_SHADER:
                    shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                    break;
                case this.gl.FRAGMENT_SHADER:
                    shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                    break;
                default:
                    return;
            }
            if (this.isWebGL2 !== true) {
                if (source.search(/^#version 300 es/) > -1) {
                    console.warn('◆ can not use glsl es 3.0');
                    return;
                }
            }
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                var err = this.gl.getShaderInfoLog(shader);
                if (type === this.gl.VERTEX_SHADER) {
                    this.error.vs = err;
                } else {
                    this.error.fs = err;
                }
                console.warn('◆ compile failed of shader: ' + err);
            }
        }

        /**
         * シェーダオブジェクトを引数から取得しプログラムオブジェクトを生成する
         * @param {WebGLShader} vs - 頂点シェーダのシェーダオブジェクト
         * @param {WebGLShader} fs - フラグメントシェーダのシェーダオブジェクト
         * @return {WebGLProgram} 生成したプログラムオブジェクト
         */

    }, {
        key: 'createProgram',
        value: function createProgram(vs, fs) {
            if (vs == null || fs == null) {
                return null;
            }
            var program = this.gl.createProgram();
            this.gl.attachShader(program, vs);
            this.gl.attachShader(program, fs);
            this.gl.linkProgram(program);
            if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                this.gl.useProgram(program);
                return program;
            } else {
                var err = this.gl.getProgramInfoLog(program);
                this.error.prg = err;
                console.warn('◆ link program failed: ' + err);
            }
        }

        /**
         * 自身の内部プロパティとして存在するプログラムオブジェクトを設定する
         */

    }, {
        key: 'useProgram',
        value: function useProgram() {
            this.gl.useProgram(this.prg);
        }

        /**
         * VBO と IBO をバインドして有効化する
         * @param {Array.<WebGLBuffer>} vbo - VBO を格納した配列
         * @param {WebGLBuffer} [ibo] - IBO
         */

    }, {
        key: 'setAttribute',
        value: function setAttribute(vbo, ibo) {
            var gl = this.gl;
            for (var i in vbo) {
                if (this.attL[i] >= 0) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
                    gl.enableVertexAttribArray(this.attL[i]);
                    gl.vertexAttribPointer(this.attL[i], this.attS[i], gl.FLOAT, false, 0, 0);
                }
            }
            if (ibo != null) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
            }
        }

        /**
         * シェーダにユニフォーム変数に設定する値をプッシュする
         * @param {Array.<mixed>} mixed - ユニフォーム変数に設定する値を格納した配列
         */

    }, {
        key: 'pushShader',
        value: function pushShader(mixed) {
            var gl = this.gl;
            for (var i = 0, j = this.uniT.length; i < j; i++) {
                var uni = 'uniform' + this.uniT[i].replace(/matrix/i, 'Matrix');
                if (gl[uni] != null) {
                    if (uni.search(/Matrix/) !== -1) {
                        gl[uni](this.uniL[i], false, mixed[i]);
                    } else {
                        gl[uni](this.uniL[i], mixed[i]);
                    }
                } else {
                    console.warn('◆ not support uniform type: ' + this.uniT[i]);
                }
            }
        }

        /**
         * アトリビュートロケーションとユニフォームロケーションが正しく取得できたかチェックする
         * @param {Array.<number>} attLocation - 取得したアトリビュートロケーションの配列
         * @param {Array.<WebGLUniformLocation>} uniLocation - 取得したユニフォームロケーションの配列
         */

    }, {
        key: 'locationCheck',
        value: function locationCheck(attLocation, uniLocation) {
            var i = void 0,
                l = void 0;
            for (i = 0, l = attLocation.length; i < l; i++) {
                if (this.attL[i] == null || this.attL[i] < 0) {
                    console.warn('◆ invalid attribute location: %c"' + attLocation[i] + '"', 'color: crimson');
                }
            }
            for (i = 0, l = uniLocation.length; i < l; i++) {
                if (this.uniL[i] == null || this.uniL[i] < 0) {
                    console.warn('◆ invalid uniform location: %c"' + uniLocation[i] + '"', 'color: crimson');
                }
            }
        }
    }]);

    return ProgramManager;
}();

window.gl3 = window.gl3 || new gl3();

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTQ1NzU1YTQzNjBkZTA3MTU0OWQiLCJ3ZWJwYWNrOi8vLy4vZ2wzQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzR3VpLmpzIiwid2VicGFjazovLy8uL2dsM01hdGguanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzTWVzaC5qcyIsIndlYnBhY2s6Ly8vLi9nbDNVdGlsLmpzIiwid2VicGFjazovLy8uL2dsM0NvcmUuanMiXSwibmFtZXMiOlsiZ2wzQXVkaW8iLCJiZ21HYWluVmFsdWUiLCJzb3VuZEdhaW5WYWx1ZSIsImN0eCIsImNvbXAiLCJiZ21HYWluIiwic291bmRHYWluIiwic3JjIiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiY3JlYXRlRHluYW1pY3NDb21wcmVzc29yIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiY3JlYXRlR2FpbiIsImdhaW4iLCJzZXRWYWx1ZUF0VGltZSIsIkVycm9yIiwicGF0aCIsImluZGV4IiwibG9vcCIsImJhY2tncm91bmQiLCJjYWxsYmFjayIsInhtbCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJyZXNwb25zZVR5cGUiLCJvbmxvYWQiLCJkZWNvZGVBdWRpb0RhdGEiLCJyZXNwb25zZSIsImJ1ZiIsIkF1ZGlvU3JjIiwibG9hZGVkIiwiY29uc29sZSIsImxvZyIsImUiLCJzZW5kIiwiaSIsImYiLCJsZW5ndGgiLCJhdWRpb0J1ZmZlciIsImJ1ZmZlclNvdXJjZSIsImFjdGl2ZUJ1ZmZlclNvdXJjZSIsImZmdExvb3AiLCJ1cGRhdGUiLCJub2RlIiwiY3JlYXRlU2NyaXB0UHJvY2Vzc29yIiwiYW5hbHlzZXIiLCJjcmVhdGVBbmFseXNlciIsInNtb290aGluZ1RpbWVDb25zdGFudCIsImZmdFNpemUiLCJvbkRhdGEiLCJVaW50OEFycmF5IiwiZnJlcXVlbmN5QmluQ291bnQiLCJqIiwiayIsInNlbGYiLCJwbGF5bm93IiwiY3JlYXRlQnVmZmVyU291cmNlIiwiYnVmZmVyIiwicGxheWJhY2tSYXRlIiwidmFsdWUiLCJvbmVuZGVkIiwic3RvcCIsIm9uYXVkaW9wcm9jZXNzIiwiZXZlIiwib25wcm9jZXNzRXZlbnQiLCJzdGFydCIsImdldEJ5dGVGcmVxdWVuY3lEYXRhIiwiZ2wzR3VpIiwiV3JhcHBlciIsIkdVSVdyYXBwZXIiLCJFbGVtZW50IiwiR1VJRWxlbWVudCIsIlNsaWRlciIsIkdVSVNsaWRlciIsIkNoZWNrYm94IiwiR1VJQ2hlY2tib3giLCJSYWRpbyIsIkdVSVJhZGlvIiwiU2VsZWN0IiwiR1VJU2VsZWN0IiwiU3BpbiIsIkdVSVNwaW4iLCJDb2xvciIsIkdVSUNvbG9yIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwicG9zaXRpb24iLCJ0b3AiLCJyaWdodCIsIndpZHRoIiwiaGVpZ2h0IiwidHJhbnNpdGlvbiIsIndyYXBwZXIiLCJiYWNrZ3JvdW5kQ29sb3IiLCJvdmVyZmxvdyIsInRvZ2dsZSIsImNsYXNzTmFtZSIsInRleHRDb250ZW50IiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwiY29sb3IiLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJjdXJzb3IiLCJ0cmFuc2Zvcm0iLCJhcHBlbmRDaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsInRleHQiLCJ0ZXh0QWxpZ24iLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwibGFiZWwiLCJ0ZXh0U2hhZG93IiwibWFyZ2luIiwiY29udHJvbCIsImxpc3RlbmVycyIsInR5cGUiLCJmdW5jIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiaGFzT3duUHJvcGVydHkiLCJtaW4iLCJtYXgiLCJzdGVwIiwic2V0QXR0cmlidXRlIiwidmVydGljYWxBbGlnbiIsInNldFZhbHVlIiwiZW1pdCIsImNoZWNrZWQiLCJuYW1lIiwibGlzdCIsInNlbGVjdGVkSW5kZXgiLCJtYXAiLCJ2Iiwib3B0IiwiT3B0aW9uIiwiYWRkIiwiY29udGFpbmVyIiwiZ2V0Q29udGV4dCIsImdyYWQiLCJjcmVhdGVMaW5lYXJHcmFkaWVudCIsImFyciIsImFkZENvbG9yU3RvcCIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwiY29sb3JWYWx1ZSIsInRlbXBDb2xvclZhbHVlIiwiaW1hZ2VEYXRhIiwiZ2V0SW1hZ2VEYXRhIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJnZXRDb2xvcjhiaXRTdHJpbmciLCJkYXRhIiwiY3VycmVudFRhcmdldCIsImdldENvbG9yRmxvYXRBcnJheSIsInIiLCJ6ZXJvUGFkZGluZyIsImciLCJiIiwic2VhcmNoIiwicyIsInJlcGxhY2UiLCJ0IiwicGFyc2VJbnQiLCJzdWJzdHIiLCJudW1iZXIiLCJjb3VudCIsImEiLCJBcnJheSIsImpvaW4iLCJzbGljZSIsImdsM01hdGgiLCJNYXQ0IiwiVmVjMyIsIlZlYzIiLCJRdG4iLCJGbG9hdDMyQXJyYXkiLCJkZXN0IiwibWF0MCIsIm1hdDEiLCJvdXQiLCJjcmVhdGUiLCJjIiwiZCIsImgiLCJsIiwibSIsIm4iLCJvIiwicCIsIkEiLCJCIiwiQyIsIkQiLCJFIiwiRiIsIkciLCJIIiwiSSIsIkoiLCJLIiwiTCIsIk0iLCJOIiwiTyIsIlAiLCJtYXQiLCJ2ZWMiLCJhbmdsZSIsImF4aXMiLCJzcSIsIk1hdGgiLCJzcXJ0Iiwic2luIiwiY29zIiwicSIsInUiLCJ3IiwieCIsInkiLCJ6IiwiZXllIiwiY2VudGVyIiwidXAiLCJleWVYIiwiZXllWSIsImV5ZVoiLCJjZW50ZXJYIiwiY2VudGVyWSIsImNlbnRlcloiLCJ1cFgiLCJ1cFkiLCJ1cFoiLCJpZGVudGl0eSIsIngwIiwieDEiLCJ4MiIsInkwIiwieTEiLCJ5MiIsInowIiwiejEiLCJ6MiIsImZvdnkiLCJhc3BlY3QiLCJuZWFyIiwiZmFyIiwidGFuIiwiUEkiLCJsZWZ0IiwiYm90dG9tIiwiaXZkIiwiY2VudGVyUG9pbnQiLCJ1cERpcmVjdGlvbiIsInZtYXQiLCJwbWF0IiwibG9va0F0IiwicGVyc3BlY3RpdmUiLCJtdWx0aXBseSIsImhhbGZXaWR0aCIsImhhbGZIZWlnaHQiLCJ0b1ZlY0lWIiwiTmFOIiwidjAiLCJ2MSIsImxlbiIsInYyIiwidmVjMSIsInZlYzIiLCJub3JtYWxpemUiLCJxdG4iLCJxdG4wIiwicXRuMSIsImF4IiwiYXkiLCJheiIsImF3IiwiYngiLCJieSIsImJ6IiwiYnciLCJxcCIsInFxIiwicXIiLCJpbnZlcnNlIiwieHgiLCJ4eSIsInh6IiwieXkiLCJ5eiIsInp6Iiwid3giLCJ3eSIsInd6IiwidGltZSIsImh0IiwiaHMiLCJhYnMiLCJwaCIsImFjb3MiLCJwdCIsInQwIiwidDEiLCJnbDNNZXNoIiwidGMiLCJwb3MiLCJub3IiLCJjb2wiLCJzdCIsImlkeCIsIm5vcm1hbCIsInRleENvb3JkIiwic3BsaXQiLCJyYWQiLCJwdXNoIiwicngiLCJyeSIsInNpZGUiLCJyeiIsInRvcFJhZCIsImJvdHRvbVJhZCIsInJvdyIsImNvbHVtbiIsInJyIiwidHIiLCJ0eCIsInR5IiwidHoiLCJpcmFkIiwib3JhZCIsInJzIiwicnQiLCJnbDNVdGlsIiwidGgiLCJmbG9vciIsInRzIiwiZGVnIiwibG9uIiwiRUFSVEhfUkFESVVTIiwiZGVnVG9SYWQiLCJsYXQiLCJmbGF0dGVuIiwiZmxhdHRlbmluZyIsImlzTmFOIiwicGFyc2VGbG9hdCIsImNsYW1wIiwidGVtcCIsImVzIiwiZWNjZW50IiwicGhpIiwic2lucGhpIiwiY29uIiwiY29tIiwicG93IiwibG9uVG9NZXIiLCJsYXRUb01lciIsIkVBUlRIX0hBTEZfQ0lSQ1VNIiwiYXRhbiIsImV4cCIsInpvb20iLCJsb25Ub1RpbGUiLCJsYXRUb1RpbGUiLCJ0aWxlVG9Mb24iLCJ0aWxlVG9MYXQiLCJnbDMiLCJWRVJTSU9OIiwiUEkyIiwiUElIIiwiUElIMiIsIlRFWFRVUkVfVU5JVF9DT1VOVCIsInJlYWR5IiwiY2FudmFzIiwiZ2wiLCJpc1dlYkdMMiIsInRleHR1cmVzIiwiZXh0IiwiQXVkaW8iLCJNZXNoIiwiVXRpbCIsIkd1aSIsImluaXRPcHRpb25zIiwid2ViZ2wyTW9kZSIsIkhUTUxDYW52YXNFbGVtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRQYXJhbWV0ZXIiLCJNQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyIsImVsZW1lbnRJbmRleFVpbnQiLCJnZXRFeHRlbnNpb24iLCJ0ZXh0dXJlRmxvYXQiLCJ0ZXh0dXJlSGFsZkZsb2F0IiwiZHJhd0J1ZmZlcnMiLCJkZXB0aCIsInN0ZW5jaWwiLCJmbGciLCJDT0xPUl9CVUZGRVJfQklUIiwiY2xlYXJDb2xvciIsImNsZWFyRGVwdGgiLCJERVBUSF9CVUZGRVJfQklUIiwiY2xlYXJTdGVuY2lsIiwiU1RFTkNJTF9CVUZGRVJfQklUIiwiY2xlYXIiLCJYIiwiWSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInZpZXdwb3J0IiwicHJpbWl0aXZlIiwidmVydGV4Q291bnQiLCJvZmZzZXQiLCJkcmF3QXJyYXlzIiwiaW5kZXhMZW5ndGgiLCJkcmF3RWxlbWVudHMiLCJVTlNJR05FRF9TSE9SVCIsIlVOU0lHTkVEX0lOVCIsInZibyIsImNyZWF0ZUJ1ZmZlciIsImJpbmRCdWZmZXIiLCJBUlJBWV9CVUZGRVIiLCJidWZmZXJEYXRhIiwiU1RBVElDX0RSQVciLCJpYm8iLCJFTEVNRU5UX0FSUkFZX0JVRkZFUiIsIkludDE2QXJyYXkiLCJVaW50MzJBcnJheSIsInNvdXJjZSIsImltZyIsIkltYWdlIiwidGV4dHVyZSIsInRleCIsImNyZWF0ZVRleHR1cmUiLCJhY3RpdmVUZXh0dXJlIiwiVEVYVFVSRTAiLCJiaW5kVGV4dHVyZSIsIlRFWFRVUkVfMkQiLCJ0ZXhJbWFnZTJEIiwiUkdCQSIsIlVOU0lHTkVEX0JZVEUiLCJnZW5lcmF0ZU1pcG1hcCIsInRleFBhcmFtZXRlcmkiLCJURVhUVVJFX01JTl9GSUxURVIiLCJMSU5FQVIiLCJURVhUVVJFX01BR19GSUxURVIiLCJURVhUVVJFX1dSQVBfUyIsIkNMQU1QX1RPX0VER0UiLCJURVhUVVJFX1dSQVBfVCIsIm9iamVjdCIsInRhcmdldCIsImNJbWciLCJpbWFnZSIsIlRFWFRVUkVfQ1VCRV9NQVAiLCJ1bml0IiwiZnJhbWVCdWZmZXIiLCJjcmVhdGVGcmFtZWJ1ZmZlciIsImJpbmRGcmFtZWJ1ZmZlciIsIkZSQU1FQlVGRkVSIiwiZGVwdGhSZW5kZXJCdWZmZXIiLCJjcmVhdGVSZW5kZXJidWZmZXIiLCJiaW5kUmVuZGVyYnVmZmVyIiwiUkVOREVSQlVGRkVSIiwicmVuZGVyYnVmZmVyU3RvcmFnZSIsIkRFUFRIX0NPTVBPTkVOVDE2IiwiZnJhbWVidWZmZXJSZW5kZXJidWZmZXIiLCJERVBUSF9BVFRBQ0hNRU5UIiwiZlRleHR1cmUiLCJmcmFtZWJ1ZmZlclRleHR1cmUyRCIsIkNPTE9SX0FUVEFDSE1FTlQwIiwiZnJhbWVidWZmZXIiLCJkZXB0aFJlbmRlcmJ1ZmZlciIsImRlcHRoU3RlbmNpbFJlbmRlckJ1ZmZlciIsIkRFUFRIX1NURU5DSUwiLCJERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQiLCJkZXB0aFN0ZW5jaWxSZW5kZXJidWZmZXIiLCJGTE9BVCIsIkhBTEZfRkxPQVRfT0VTIiwiTkVBUkVTVCIsInZzSWQiLCJmc0lkIiwiYXR0TG9jYXRpb24iLCJhdHRTdHJpZGUiLCJ1bmlMb2NhdGlvbiIsInVuaVR5cGUiLCJtbmciLCJQcm9ncmFtTWFuYWdlciIsInZzIiwiY3JlYXRlU2hhZGVyRnJvbUlkIiwiZnMiLCJwcmciLCJjcmVhdGVQcm9ncmFtIiwiYXR0TCIsImF0dFMiLCJnZXRBdHRyaWJMb2NhdGlvbiIsInVuaUwiLCJnZXRVbmlmb3JtTG9jYXRpb24iLCJ1bmlUIiwibG9jYXRpb25DaGVjayIsImNyZWF0ZVNoYWRlckZyb21Tb3VyY2UiLCJWRVJURVhfU0hBREVSIiwiRlJBR01FTlRfU0hBREVSIiwidnNQYXRoIiwiZnNQYXRoIiwidGFyZ2V0VXJsIiwieGhyIiwicmVzcG9uc2VUZXh0IiwibG9hZENoZWNrIiwiaXNCdWZmZXIiLCJkZWxldGVCdWZmZXIiLCJpc1RleHR1cmUiLCJkZWxldGVUZXh0dXJlIiwib2JqIiwiV2ViR0xGcmFtZWJ1ZmZlciIsImlzRnJhbWVidWZmZXIiLCJkZWxldGVGcmFtZWJ1ZmZlciIsIldlYkdMUmVuZGVyYnVmZmVyIiwiaXNSZW5kZXJidWZmZXIiLCJkZWxldGVSZW5kZXJidWZmZXIiLCJXZWJHTFRleHR1cmUiLCJzaGFkZXIiLCJpc1NoYWRlciIsImRlbGV0ZVNoYWRlciIsInByb2dyYW0iLCJpc1Byb2dyYW0iLCJkZWxldGVQcm9ncmFtIiwiZXJyb3IiLCJpZCIsInNjcmlwdEVsZW1lbnQiLCJjcmVhdGVTaGFkZXIiLCJ3YXJuIiwic2hhZGVyU291cmNlIiwiY29tcGlsZVNoYWRlciIsImdldFNoYWRlclBhcmFtZXRlciIsIkNPTVBJTEVfU1RBVFVTIiwiZXJyIiwiZ2V0U2hhZGVySW5mb0xvZyIsImF0dGFjaFNoYWRlciIsImxpbmtQcm9ncmFtIiwiZ2V0UHJvZ3JhbVBhcmFtZXRlciIsIkxJTktfU1RBVFVTIiwidXNlUHJvZ3JhbSIsImdldFByb2dyYW1JbmZvTG9nIiwiZW5hYmxlVmVydGV4QXR0cmliQXJyYXkiLCJ2ZXJ0ZXhBdHRyaWJQb2ludGVyIiwibWl4ZWQiLCJ1bmkiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFB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QUFLaWQsSUFBTCxDQUFVamQsQ0FBVixLQUFnQixJQUFoQixJQUF3QixLQUFLaWQsSUFBTCxDQUFVamQsQ0FBVixJQUFlLENBQTFDLEVBQTRDO0FBQ3hDSiw0QkFBUXdmLElBQVIsQ0FBYSxvQ0FBb0MvQyxZQUFZcmMsQ0FBWixDQUFwQyxHQUFxRCxHQUFsRSxFQUF1RSxnQkFBdkU7QUFDSDtBQUNKO0FBQ0o7Ozs7OztBQUdMd1gsT0FBT3ZDLEdBQVAsR0FBYXVDLE9BQU92QyxHQUFQLElBQWMsSUFBSUEsR0FBSixFQUEzQixDIiwiZmlsZSI6ImdsY3ViaWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTQ1NzU1YTQzNjBkZTA3MTU0OWQiLCJcclxuLyoqXHJcbiAqIEBleGFtcGxlXHJcbiAqIHN0ZXAgMTogbGV0IGEgPSBuZXcgZ2wzQXVkaW8oYmdtR2FpblZhbHVlLCBzb3VuZEdhaW5WYWx1ZSkgPC0gZmxvYXQoMC4wIHRvIDEuMClcclxuICogc3RlcCAyOiBhLmxvYWQodXJsLCBpbmRleCwgbG9vcCwgYmFja2dyb3VuZCkgPC0gc3RyaW5nLCBpbnQsIGJvb2xlYW4sIGJvb2xlYW5cclxuICogc3RlcCAzOiBhLnNyY1tpbmRleF0ubG9hZGVkIHRoZW4gYS5zcmNbaW5kZXhdLnBsYXkoKVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBnbDNBdWRpb1xyXG4gKiBAY2xhc3MgZ2wzQXVkaW9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsM0F1ZGlvIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmdtR2FpblZhbHVlIC0gQkdNIOOBruWGjeeUn+mfs+mHj1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNvdW5kR2FpblZhbHVlIC0g5Yq55p6c6Z+z44Gu5YaN55Sf6Z+z6YePXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGJnbUdhaW5WYWx1ZSwgc291bmRHYWluVmFsdWUpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCquODvOODh+OCo+OCquOCs+ODs+ODhuOCreOCueODiFxyXG4gICAgICAgICAqIEB0eXBlIHtBdWRpb0NvbnRleHR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jdHggPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODgOOCpOODiuODn+ODg+OCr+OCs+ODs+ODl+ODrOODg+OCteODvOODjuODvOODiVxyXG4gICAgICAgICAqIEB0eXBlIHtEeW5hbWljc0NvbXByZXNzb3JOb2RlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29tcCA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQkdNIOeUqOOBruOCsuOCpOODs+ODjuODvOODiVxyXG4gICAgICAgICAqIEB0eXBlIHtHYWluTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmJnbUdhaW4gPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWKueaenOmfs+eUqOOBruOCsuOCpOODs+ODjuODvOODiVxyXG4gICAgICAgICAqIEB0eXBlIHtHYWluTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNvdW5kR2FpbiA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kq44O844OH44Kj44Kq44K944O844K544KS44Op44OD44OX44GX44Gf44Kv44Op44K544Gu6YWN5YiXXHJcbiAgICAgICAgICogQHR5cGUge0FycmF5LjxBdWRpb1NyYz59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zcmMgPSBudWxsO1xyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICB0eXBlb2YgQXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiB3ZWJraXRBdWRpb0NvbnRleHQgIT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICApe1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgQXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4ID0gbmV3IHdlYmtpdEF1ZGlvQ29udGV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29tcCA9IHRoaXMuY3R4LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbXAuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcclxuICAgICAgICAgICAgdGhpcy5iZ21HYWluLmNvbm5lY3QodGhpcy5jb21wKTtcclxuICAgICAgICAgICAgdGhpcy5iZ21HYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoYmdtR2FpblZhbHVlLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZEdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRHYWluLmNvbm5lY3QodGhpcy5jb21wKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZEdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZShzb3VuZEdhaW5WYWx1ZSwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3JjID0gW107XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGZvdW5kIEF1ZGlvQ29udGV4dCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleOCoeOCpOODq+OCkuODreODvOODieOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSDjgqrjg7zjg4fjgqPjgqrjg5XjgqHjgqTjg6vjga7jg5HjgrlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIOWGhemDqOODl+ODreODkeODhuOCo+OBrumFjeWIl+OBq+agvOe0jeOBmeOCi+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBsb29wIC0g44Or44O844OX5YaN55Sf44KS6Kit5a6a44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJhY2tncm91bmQgLSBCR00g44Go44GX44Gm6Kit5a6a44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIOiqreOBv+i+vOOBv+OBqOWIneacn+WMluOBjOWujOS6huOBl+OBn+OBguOBqOWRvOOBsOOCjOOCi+OCs+ODvOODq+ODkOODg+OCr1xyXG4gICAgICovXHJcbiAgICBsb2FkKHBhdGgsIGluZGV4LCBsb29wLCBiYWNrZ3JvdW5kLCBjYWxsYmFjayl7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4O1xyXG4gICAgICAgIGxldCBnYWluID0gYmFja2dyb3VuZCA/IHRoaXMuYmdtR2FpbiA6IHRoaXMuc291bmRHYWluO1xyXG4gICAgICAgIGxldCBzcmMgPSB0aGlzLnNyYztcclxuICAgICAgICBzcmNbaW5kZXhdID0gbnVsbDtcclxuICAgICAgICBsZXQgeG1sID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeG1sLm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xyXG4gICAgICAgIHhtbC5zZXRSZXF1ZXN0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignQ2FjaGUtQ29udHJvbCcsICduby1jYWNoZScpO1xyXG4gICAgICAgIHhtbC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xyXG4gICAgICAgIHhtbC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGN0eC5kZWNvZGVBdWRpb0RhdGEoeG1sLnJlc3BvbnNlLCAoYnVmKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzcmNbaW5kZXhdID0gbmV3IEF1ZGlvU3JjKGN0eCwgZ2FpbiwgYnVmLCBsb29wLCBiYWNrZ3JvdW5kKTtcclxuICAgICAgICAgICAgICAgIHNyY1tpbmRleF0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIGF1ZGlvIG51bWJlcjogJWMnICsgaW5kZXggKyAnJWMsIGF1ZGlvIGxvYWRlZDogJWMnICsgcGF0aCwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfSwgKGUpID0+IHtjb25zb2xlLmxvZyhlKTt9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhtbC5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg63jg7zjg4njga7lrozkuobjgpLjg4Hjgqfjg4Pjgq/jgZnjgotcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOODreODvOODieOBjOWujOS6huOBl+OBpuOBhOOCi+OBi+OBqeOBhuOBi1xyXG4gICAgICovXHJcbiAgICBsb2FkQ29tcGxldGUoKXtcclxuICAgICAgICBsZXQgaSwgZjtcclxuICAgICAgICBmID0gdHJ1ZTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCB0aGlzLnNyYy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGYgPSBmICYmICh0aGlzLnNyY1tpXSAhPSBudWxsKSAmJiB0aGlzLnNyY1tpXS5sb2FkZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog44Kq44O844OH44Kj44Kq44KE44K944O844K544OV44Kh44Kk44Or44KS566h55CG44GZ44KL44Gf44KB44Gu44Kv44Op44K5XHJcbiAqIEBjbGFzcyBBdWRpb1NyY1xyXG4gKi9cclxuY2xhc3MgQXVkaW9TcmMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBjdHggLSDlr77osaHjgajjgarjgovjgqrjg7zjg4fjgqPjgqrjgrPjg7Pjg4bjgq3jgrnjg4hcclxuICAgICAqIEBwYXJhbSB7R2Fpbk5vZGV9IGdhaW4gLSDlr77osaHjgajjgarjgovjgrLjgqTjg7Pjg47jg7zjg4lcclxuICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGF1ZGlvQnVmZmVyIC0g44OQ44Kk44OK44Oq44Gu44Kq44O844OH44Kj44Kq44K944O844K5XHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJvb2wgLSDjg6vjg7zjg5flho3nlJ/jgpLoqK3lrprjgZnjgovjgYvjganjgYbjgYtcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYmFja2dyb3VuZCAtIEJHTSDjgajjgZfjgaboqK3lrprjgZnjgovjgYvjganjgYbjgYtcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoY3R4LCBnYWluLCBhdWRpb0J1ZmZlciwgbG9vcCwgYmFja2dyb3VuZCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5a++6LGh44Go44Gq44KL44Kq44O844OH44Kj44Kq44Kz44Oz44OG44Kt44K544OIXHJcbiAgICAgICAgICogQHR5cGUge0F1ZGlvQ29udGV4dH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlr77osaHjgajjgarjgovjgrLjgqTjg7Pjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7R2Fpbk5vZGV9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nYWluID0gZ2FpbjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgr3jg7zjgrnjg5XjgqHjgqTjg6vjga7jg5DjgqTjg4rjg6rjg4fjg7zjgr9cclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXlCdWZmZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hdWRpb0J1ZmZlciA9IGF1ZGlvQnVmZmVyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCquODvOODh+OCo+OCquODkOODg+ODleOCoeOCveODvOOCueODjuODvOODieOCkuagvOe0jeOBmeOCi+mFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48QXVkaW9CdWZmZXJTb3VyY2VOb2RlPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZSA9IFtdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCouOCr+ODhuOCo+ODluOBquODkOODg+ODleOCoeOCveODvOOCueOBruOCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hY3RpdmVCdWZmZXJTb3VyY2UgPSAwO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODq+ODvOODl+OBmeOCi+OBi+OBqeOBhuOBi+OBruODleODqeOCsFxyXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubG9vcCA9IGxvb3A7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Ot44O844OJ5riI44G/44GL44Gp44GG44GL44KS56S644GZ44OV44Op44KwXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGRlQg44K144Kk44K6XHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmZmdExvb3AgPSAxNjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgZPjga7jg5Xjg6njgrDjgYznq4vjgaPjgabjgYTjgovloLTlkIjlho3nlJ/kuK3jga7jg4fjg7zjgr/jgpLkuIDluqblj5blvpfjgZnjgotcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJHTSDjgYvjganjgYbjgYvjgpLnpLrjgZnjg5Xjg6njgrBcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODquODl+ODiOODl+ODreOCu+ODg+OCteODvOODjuODvOODiVxyXG4gICAgICAgICAqIEB0eXBlIHtTY3JpcHRQcm9jZXNzb3JOb2RlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMuY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigyMDQ4LCAxLCAxKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjg4rjg6njgqTjgrbjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7QW5hbHlzZXJOb2RlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIgPSB0aGlzLmN0eC5jcmVhdGVBbmFseXNlcigpO1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gMC44O1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZXIuZmZ0U2l6ZSA9IHRoaXMuZmZ0TG9vcCAqIDI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OH44O844K/44KS5Y+W5b6X44GZ44KL6Zqb44Gr5Yip55So44GZ44KL5Z6L5LuY44GN6YWN5YiXXHJcbiAgICAgICAgICogQHR5cGUge1VpbnQ4QXJyYXl9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5vbkRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLmFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCquODvOODh+OCo+OCquOCkuWGjeeUn+OBmeOCi1xyXG4gICAgICovXHJcbiAgICBwbGF5KCl7XHJcbiAgICAgICAgbGV0IGksIGosIGs7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGkgPSB0aGlzLmJ1ZmZlclNvdXJjZS5sZW5ndGg7XHJcbiAgICAgICAgayA9IC0xO1xyXG4gICAgICAgIGlmKGkgPiAwKXtcclxuICAgICAgICAgICAgZm9yKGogPSAwOyBqIDwgaTsgaisrKXtcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmJ1ZmZlclNvdXJjZVtqXS5wbGF5bm93KXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtqXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vbal0gPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBrID0gajtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihrIDwgMCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVt0aGlzLmJ1ZmZlclNvdXJjZS5sZW5ndGhdID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgICAgICAgICBrID0gdGhpcy5idWZmZXJTb3VyY2UubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVswXSA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgICAgICBrID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hY3RpdmVCdWZmZXJTb3VyY2UgPSBrO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXI7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10ubG9vcCA9IHRoaXMubG9vcDtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5wbGF5YmFja1JhdGUudmFsdWUgPSAxLjA7XHJcbiAgICAgICAgaWYoIXRoaXMubG9vcCl7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLm9uZW5kZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlub3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5iYWNrZ3JvdW5kKXtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uY29ubmVjdCh0aGlzLmFuYWx5c2VyKTtcclxuICAgICAgICAgICAgdGhpcy5hbmFseXNlci5jb25uZWN0KHRoaXMubm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5jb25uZWN0KHRoaXMuY3R4LmRlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uYXVkaW9wcm9jZXNzID0gKGV2ZSkgPT4ge29ucHJvY2Vzc0V2ZW50KGV2ZSk7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10uY29ubmVjdCh0aGlzLmdhaW4pO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLnN0YXJ0KDApO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLnBsYXlub3cgPSB0cnVlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbnByb2Nlc3NFdmVudChldmUpe1xyXG4gICAgICAgICAgICBpZihzZWxmLnVwZGF0ZSl7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5hbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShzZWxmLm9uRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqrjg7zjg4fjgqPjgqrjga7lho3nlJ/jgpLmraLjgoHjgotcclxuICAgICAqL1xyXG4gICAgc3RvcCgpe1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW3RoaXMuYWN0aXZlQnVmZmVyU291cmNlXS5zdG9wKDApO1xyXG4gICAgICAgIHRoaXMucGxheW5vdyA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNBdWRpby5qcyIsIlxyXG4vKipcclxuICogQGV4YW1wbGVcclxuICogbGV0IHdyYXBwZXIgPSBuZXcgZ2wzLkd1aS5XcmFwcGVyKCk7XHJcbiAqIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod3JhcHBlci5nZXRFbGVtZW50KCkpO1xyXG4gKlxyXG4gKiBsZXQgc2xpZGVyID0gbmV3IGdsMy5HdWkuU2xpZGVyKCd0ZXN0JywgNTAsIDAsIDEwMCwgMSk7XHJcbiAqIHNsaWRlci5hZGQoJ2lucHV0JywgKGV2ZSwgc2VsZikgPT4ge2NvbnNvbGUubG9nKHNlbGYuZ2V0VmFsdWUoKSk7fSk7XHJcbiAqIHdyYXBwZXIuYXBwZW5kKHNsaWRlci5nZXRFbGVtZW50KCkpO1xyXG4gKlxyXG4gKiBsZXQgY2hlY2sgPSBuZXcgZ2wzLkd1aS5DaGVja2JveCgnaG9nZScsIGZhbHNlKTtcclxuICogY2hlY2suYWRkKCdjaGFuZ2UnLCAoZXZlLCBzZWxmKSA9PiB7Y29uc29sZS5sb2coc2VsZi5nZXRWYWx1ZSgpKTt9KTtcclxuICogd3JhcHBlci5hcHBlbmQoY2hlY2suZ2V0RWxlbWVudCgpKTtcclxuICpcclxuICogbGV0IHJhZGlvID0gbmV3IGdsMy5HdWkuUmFkaW8oJ2hvZ2UnLCBudWxsLCBmYWxzZSk7XHJcbiAqIHJhZGlvLmFkZCgnY2hhbmdlJywgKGV2ZSwgc2VsZikgPT4ge2NvbnNvbGUubG9nKHNlbGYuZ2V0VmFsdWUoKSk7fSk7XHJcbiAqIHdyYXBwZXIuYXBwZW5kKHJhZGlvLmdldEVsZW1lbnQoKSk7XHJcbiAqXHJcbiAqIGxldCBzZWxlY3QgPSBuZXcgZ2wzLkd1aS5TZWxlY3QoJ2Z1Z2EnLCBbJ2ZvbycsICdiYWEnXSwgMCk7XHJcbiAqIHNlbGVjdC5hZGQoJ2NoYW5nZScsIChldmUsIHNlbGYpID0+IHtjb25zb2xlLmxvZyhzZWxmLmdldFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChzZWxlY3QuZ2V0RWxlbWVudCgpKTtcclxuICpcclxuICogbGV0IHNwaW4gPSBuZXcgZ2wzLkd1aS5TcGluKCdob2dlJywgMC4wLCAtMS4wLCAxLjAsIDAuMSk7XHJcbiAqIHNwaW4uYWRkKCdpbnB1dCcsIChldmUsIHNlbGYpID0+IHtjb25zb2xlLmxvZyhzZWxmLmdldFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChzcGluLmdldEVsZW1lbnQoKSk7XHJcbiAqXHJcbiAqIGxldCBjb2xvciA9IG5ldyBnbDMuR3VpLkNvbG9yKCdmdWdhJywgJyNmZjAwMDAnKTtcclxuICogY29sb3IuYWRkKCdjaGFuZ2UnLCAoZXZlLCBzZWxmKSA9PiB7Y29uc29sZS5sb2coc2VsZi5nZXRWYWx1ZSgpLCBzZWxmLmdldEZsb2F0VmFsdWUoKSk7fSk7XHJcbiAqIHdyYXBwZXIuYXBwZW5kKGNvbG9yLmdldEVsZW1lbnQoKSk7XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIGdsM0d1aVxyXG4gKiBAY2xhc3MgZ2wzR3VpXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNHdWkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlXcmFwcGVyXHJcbiAgICAgICAgICogQHR5cGUge0dVSVdyYXBwZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5XcmFwcGVyID0gR1VJV3JhcHBlcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlFbGVtZW50XHJcbiAgICAgICAgICogQHR5cGUge0dVSUVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5FbGVtZW50ID0gR1VJRWxlbWVudDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlTbGlkZXJcclxuICAgICAgICAgKiBAdHlwZSB7R1VJU2xpZGVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuU2xpZGVyID0gR1VJU2xpZGVyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdVSUNoZWNrYm94XHJcbiAgICAgICAgICogQHR5cGUge0dVSUNoZWNrYm94fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuQ2hlY2tib3ggPSBHVUlDaGVja2JveDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlSYWRpb1xyXG4gICAgICAgICAqIEB0eXBlIHtHVUlSYWRpb31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlJhZGlvID0gR1VJUmFkaW87XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJU2VsZWN0XHJcbiAgICAgICAgICogQHR5cGUge0dVSVNlbGVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlNlbGVjdCA9IEdVSVNlbGVjdDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlTcGluXHJcbiAgICAgICAgICogQHR5cGUge0dVSVNwaW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5TcGluID0gR1VJU3BpbjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlDb2xvclxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlDb2xvcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLkNvbG9yID0gR1VJQ29sb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlXcmFwcGVyXHJcbiAqIEBjbGFzcyBHVUlXcmFwcGVyXHJcbiAqL1xyXG5jbGFzcyBHVUlXcmFwcGVyIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJIOWFqOS9k+OCkuWMheOCgOODqeODg+ODkeODvCBET01cclxuICAgICAgICAgKiBAdHlwZSB7SFRNTERpdkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gJzM0MHB4JztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJ3JpZ2h0IDAuOHMgY3ViaWMtYmV6aWVyKDAsIDAsIDAsIDEuMCknO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdVSSDjg5Hjg7zjg4TjgpLljIXjgoDjg6njg4Pjg5Hjg7wgRE9NXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMud3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMud3JhcHBlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSg2NCwgNjQsIDY0LCAwLjUpJztcclxuICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgICAgIHRoaXMud3JhcHBlci5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUkg5oqY44KK44Gf44Gf44G/44OI44Kw44OrXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuY2xhc3NOYW1lID0gJ3Zpc2libGUnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnRleHRDb250ZW50ID0gJ+KWtic7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUuZm9udFNpemUgPSAnMThweCc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUubGluZUhlaWdodCA9ICczMnB4JztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5jb2xvciA9ICdyZ2JhKDI0MCwgMjQwLCAyNDAsIDAuNSknO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDMyLCAzMiwgMzIsIDAuNSknO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgcmdiYSgyNDAsIDI0MCwgMjQwLCAwLjIpJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnMjVweCc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUuYm94U2hhZG93ID0gJzBweCAwcHggMnB4IDJweCByZ2JhKDgsIDgsIDgsIDAuOCknO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS50b3AgPSAnMjBweCc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUucmlnaHQgPSAnMzYwcHgnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLndpZHRoID0gJzMycHgnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmhlaWdodCA9ICczMnB4JztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSgwZGVnKSc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUudHJhbnNpdGlvbiA9ICd0cmFuc2Zvcm0gMC41cyBjdWJpYy1iZXppZXIoMCwgMCwgMCwgMS4wKSc7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRvZ2dsZSk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMud3JhcHBlcik7XHJcblxyXG4gICAgICAgIHRoaXMudG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCd2aXNpYmxlJyk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudG9nZ2xlLmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSgwZGVnKSc7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJpZ2h0ID0gJy0zNDBweCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKC0xODBkZWcpJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg6zjg6Hjg7Pjg4jjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICBnZXRFbGVtZW50KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5a2Q6KaB57Sg44KS44Ki44Oa44Oz44OJ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0g44Ki44Oa44Oz44OJ44GZ44KL6KaB57SgXHJcbiAgICAgKi9cclxuICAgIGFwcGVuZChlbGVtZW50KXtcclxuICAgICAgICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlFbGVtZW50XHJcbiAqIEBjbGFzcyBHVUlFbGVtZW50XHJcbiAqL1xyXG5jbGFzcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJyl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Ko44Os44Oh44Oz44OI44Op44OD44OR44O8IERPTVxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSAnc21hbGwnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSAnMzIwcHgnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMzBweCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxpbmVIZWlnaHQgPSAnMzBweCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZsZXhEaXJlY3Rpb24gPSAncm93JztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnZmxleC1zdGFydCc7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Op44OZ44Or55So44Ko44Os44Oh44Oz44OIIERPTVxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MU3BhbkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICB0aGlzLmxhYmVsLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmNvbG9yID0gJyMyMjInO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUudGV4dFNoYWRvdyA9ICcwcHggMHB4IDVweCB3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5tYXJnaW4gPSAnYXV0byA1cHgnO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5YCk6KGo56S655SoIERPTVxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MU3BhbkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuMjUpJztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLmNvbG9yID0gJ3doaXRlc21va2UnO1xyXG4gICAgICAgIHRoaXMudmFsdWUuc3R5bGUuZm9udFNpemUgPSAneC1zbWFsbCc7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS50ZXh0U2hhZG93ID0gJzBweCAwcHggNXB4IGJsYWNrJztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLm1hcmdpbiA9ICdhdXRvIDVweCc7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS53aWR0aCA9ICc1MHB4JztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODqyBET01cclxuICAgICAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6njg5njg6vjgavoqK3lrprjgZnjgovjg4bjgq3jgrnjg4hcclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kk44OZ44Oz44OI44Oq44K544OKXHJcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqTjg5njg7Pjg4jjg6rjgrnjg4rjgpLnmbvpjLLjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0g44Kk44OZ44Oz44OI44K/44Kk44OXXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIC0g55m76Yyy44GZ44KL6Zai5pWwXHJcbiAgICAgKi9cclxuICAgIGFkZCh0eXBlLCBmdW5jKXtcclxuICAgICAgICBpZih0aGlzLmNvbnRyb2wgPT0gbnVsbCB8fCB0eXBlID09IG51bGwgfHwgZnVuYyA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0eXBlKSAhPT0gJ1tvYmplY3QgU3RyaW5nXScpe3JldHVybjt9XHJcbiAgICAgICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmMpICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdID0gZnVuYztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kk44OZ44Oz44OI44KS55m654Gr44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIOeZuueBq+OBmeOCi+OCpOODmeODs+ODiOOCv+OCpOODl1xyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlIC0gRXZlbnQg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGVtaXQodHlwZSwgZXZlKXtcclxuICAgICAgICBpZih0aGlzLmNvbnRyb2wgPT0gbnVsbCB8fCAhdGhpcy5saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkodHlwZSkpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0oZXZlLCB0aGlzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kk44OZ44Oz44OI44Oq44K544OK44KS55m76Yyy6Kej6Zmk44GZ44KLXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZSgpe1xyXG4gICAgICAgIGlmKHRoaXMuY29udHJvbCA9PSBudWxsIHx8ICF0aGlzLmxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXSA9IG51bGw7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMubGlzdGVuZXJzW3R5cGVdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg6njg5njg6vjg4bjgq3jgrnjg4jjgajjgrPjg7Pjg4jjg63jg7zjg6vjga7lgKTjgpLmm7TmlrDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bWl4ZWR9IHZhbHVlIC0g6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIHNldFZhbHVlKHZhbHVlKXtcclxuICAgICAgICB0aGlzLnZhbHVlLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+WApOOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7bWl4ZWR9IOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+WApFxyXG4gICAgICovXHJcbiAgICBnZXRWYWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiOOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIGdldENvbnRyb2woKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg6njg5njg6vjgavoqK3lrprjgZXjgozjgabjgYTjgovjg4bjgq3jgrnjg4jjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30g44Op44OZ44Or44Gr6Kit5a6a44GV44KM44Gm44GE44KL5YCkXHJcbiAgICAgKi9cclxuICAgIGdldFRleHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg6zjg6Hjg7Pjg4jjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICBnZXRFbGVtZW50KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSVNsaWRlclxyXG4gKiBAY2xhc3MgR1VJU2xpZGVyXHJcbiAqL1xyXG5jbGFzcyBHVUlTbGlkZXIgZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3ZhbHVlPTBdIC0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21pbj0wXSAtIOOCueODqeOCpOODgOODvOOBruacgOWwj+WApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttYXg9MTAwXSAtIOOCueODqeOCpOODgOODvOOBruacgOWkp+WApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtzdGVwPTFdIC0g44K544Op44Kk44OA44O844Gu44K544OG44OD44OX5pWwXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJywgdmFsdWUgPSAwLCBtaW4gPSAwLCBtYXggPSAxMDAsIHN0ZXAgPSAxKXtcclxuICAgICAgICBzdXBlcih0ZXh0KTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAncmFuZ2UnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtaW4nLCBtaW4pO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21heCcsIG1heCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHN0ZXApO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAnbWlkZGxlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sKTtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wudmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBldmVudFxyXG4gICAgICAgIHRoaXMuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdpbnB1dCcsIGV2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCueODqeOCpOODgOODvOOBruacgOWwj+WApOOCkuOCu+ODg+ODiOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIOacgOWwj+WApOOBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBzZXRNaW4obWluKXtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtaW4nLCBtaW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrnjg6njgqTjg4Djg7zjga7mnIDlpKflgKTjgpLjgrvjg4Pjg4jjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSDmnIDlpKflgKTjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgc2V0TWF4KG1heCl7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWF4JywgbWF4KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44K544Op44Kk44OA44O844Gu44K544OG44OD44OX5pWw44KS44K744OD44OI44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlcCAtIOOCueODhuODg+ODl+aVsOOBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBzZXRTdGVwKHN0ZXApe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCBzdGVwKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSUNoZWNrYm94XHJcbiAqIEBjbGFzcyBHVUlDaGVja2JveFxyXG4gKi9cclxuY2xhc3MgR1VJQ2hlY2tib3ggZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjaGVja2VkPWZhbHNlXSAtIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycsIGNoZWNrZWQgPSBmYWxzZSl7XHJcbiAgICAgICAgc3VwZXIodGV4dCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or44Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmNoZWNrZWQgPSBjaGVja2VkO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAnbWlkZGxlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sKTtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wuY2hlY2tlZCk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCBldmUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC5jaGVja2VkKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBq+WApOOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjaGVja2VkIC0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIHNldFZhbHVlKGNoZWNrZWQpe1xyXG4gICAgICAgIHRoaXMudmFsdWUudGV4dENvbnRlbnQgPSBjaGVja2VkO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5jaGVja2VkID0gY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Gu5YCk44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDjgrPjg7Pjg4jjg63jg7zjg6vjga7lgKRcclxuICAgICAqL1xyXG4gICAgZ2V0VmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sLmNoZWNrZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlSYWRpb1xyXG4gKiBAY2xhc3MgR1VJUmFkaW9cclxuICovXHJcbmNsYXNzIEdVSVJhZGlvIGV4dGVuZHMgR1VJRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0ZXh0PScnXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lPSdnbDNyYWRpbyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL5ZCN5YmNXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjaGVja2VkPWZhbHNlXSAtIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycsIG5hbWUgPSAnZ2wzcmFkaW8nLCBjaGVja2VkID0gZmFsc2Upe1xyXG4gICAgICAgIHN1cGVyKHRleHQpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgndHlwZScsICdyYWRpbycpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBuYW1lKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuY2hlY2tlZCA9IGNoZWNrZWQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUudmVydGljYWxBbGlnbiA9ICdtaWRkbGUnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2wpO1xyXG5cclxuICAgICAgICAvLyBzZXRcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC5jaGVja2VkKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRcclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIGV2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLmNoZWNrZWQpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Gr5YCk44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrZWQgLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgc2V0VmFsdWUoY2hlY2tlZCl7XHJcbiAgICAgICAgdGhpcy52YWx1ZS50ZXh0Q29udGVudCA9ICctLS0nO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5jaGVja2VkID0gY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Gu5YCk44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDjgrPjg7Pjg4jjg63jg7zjg6vjga7lgKRcclxuICAgICAqL1xyXG4gICAgZ2V0VmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sLmNoZWNrZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlTZWxlY3RcclxuICogQGNsYXNzIEdVSVNlbGVjdFxyXG4gKi9cclxuY2xhc3MgR1VJU2VsZWN0IGV4dGVuZHMgR1VJRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0ZXh0PScnXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gW2xpc3Q9W11dIC0g44Oq44K544OI44Gr55m76Yyy44GZ44KL44Ki44Kk44OG44Og44KS5oyH5a6a44GZ44KL5paH5a2X5YiX44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3NlbGVjdGVkSW5kZXg9MF0gLSDjgrPjg7Pjg4jjg63jg7zjg6vjgafpgbjmip7jgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnLCBsaXN0ID0gW10sIHNlbGVjdGVkSW5kZXggPSAwKXtcclxuICAgICAgICBzdXBlcih0ZXh0KTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTFNlbGVjdEVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XHJcbiAgICAgICAgbGlzdC5tYXAoKHYpID0+IHtcclxuICAgICAgICAgICAgbGV0IG9wdCA9IG5ldyBPcHRpb24odiwgdik7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbC5hZGQob3B0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLndpZHRoID0gJzEzMHB4JztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUubWFyZ2luID0gJ2F1dG8nO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ21pZGRsZSc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbCk7XHJcblxyXG4gICAgICAgIC8vIHNldFxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRcclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIGV2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBp+mBuOaKnuOBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOCkuaMh+WumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0g5oyH5a6a44GZ44KL44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIHNldFNlbGVjdGVkSW5kZXgoaW5kZXgpe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBjOePvuWcqOmBuOaKnuOBl+OBpuOBhOOCi+OCpOODs+ODh+ODg+OCr+OCueOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDnj77lnKjpgbjmip7jgZfjgabjgYTjgovjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgZ2V0U2VsZWN0ZWRJbmRleCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wuc2VsZWN0ZWRJbmRleDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSVNwaW5cclxuICogQGNsYXNzIEdVSVNwaW5cclxuICovXHJcbmNsYXNzIEdVSVNwaW4gZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3ZhbHVlPTAuMF0gLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbWluPS0xLjBdIC0g44K544OU44Oz44GZ44KL6Zqb44Gu5pyA5bCP5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21heD0xLjBdIC0g44K544OU44Oz44GZ44KL6Zqb44Gu5pyA5aSn5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MC4xXSAtIOOCueODlOODs+OBmeOCi+OCueODhuODg+ODl+aVsFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycsIHZhbHVlID0gMC4wLCBtaW4gPSAtMS4wLCBtYXggPSAxLjAsIHN0ZXAgPSAwLjEpe1xyXG4gICAgICAgIHN1cGVyKHRleHQpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgndHlwZScsICdudW1iZXInKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtaW4nLCBtaW4pO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21heCcsIG1heCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHN0ZXApO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAnbWlkZGxlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sKTtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wudmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBldmVudFxyXG4gICAgICAgIHRoaXMuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdpbnB1dCcsIGV2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCueODlOODs+OBruacgOWwj+WApOOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIOioreWumuOBmeOCi+acgOWwj+WApFxyXG4gICAgICovXHJcbiAgICBzZXRNaW4obWluKXtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtaW4nLCBtaW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrnjg5Tjg7Pjga7mnIDlpKflgKTjgpLoqK3lrprjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSDoqK3lrprjgZnjgovmnIDlpKflgKRcclxuICAgICAqL1xyXG4gICAgc2V0TWF4KG1heCl7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWF4JywgbWF4KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44K544OU44Oz44Gu44K544OG44OD44OX5pWw44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlcCAtIOioreWumuOBmeOCi+OCueODhuODg+ODl+aVsFxyXG4gICAgICovXHJcbiAgICBzZXRTdGVwKHN0ZXApe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCBzdGVwKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSUNvbG9yXHJcbiAqIEBjbGFzcyBHVUlDb2xvclxyXG4gKi9cclxuY2xhc3MgR1VJQ29sb3IgZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZhbHVlPScjMDAwMDAwJ10gLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnLCB2YWx1ZSA9ICcjMDAwMDAwJyl7XHJcbiAgICAgICAgc3VwZXIodGV4dCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or44KS5YyF44KA44Kz44Oz44OG44OK44Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUubGluZUhlaWdodCA9ICcwJztcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5tYXJnaW4gPSAnMnB4IGF1dG8nO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gJzEwMHB4JztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDkvZnnmb3lhbzpgbjmip7jgqvjg6njg7zooajnpLrjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTERpdkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUubWFyZ2luID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS53aWR0aCA9ICdjYWxjKDEwMCUgLSAycHgpJztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmhlaWdodCA9ICcyNHB4JztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgd2hpdGVzbW9rZSc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5ib3hTaGFkb3cgPSAnMHB4IDBweCAwcHggMXB4ICMyMjInO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiOOBruW9ueWJsuOCkuaLheOBhiBjYW52YXNcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTENhbnZhc0VsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLm1hcmdpbiA9ICcwcHgnO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC53aWR0aCA9IDEwMDtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuaGVpZ2h0ID0gMTAwO1xyXG5cclxuICAgICAgICAvLyBhcHBlbmRcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+eUqCBjYW52YXMg44GuIDJkIOOCs+ODs+ODhuOCreOCueODiFxyXG4gICAgICAgICAqIEB0eXBlIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNvbnRyb2wuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBsZXQgZ3JhZCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHRoaXMuY29udHJvbC53aWR0aCwgMCk7XHJcbiAgICAgICAgbGV0IGFyciA9IFsnI2ZmMDAwMCcsICcjZmZmZjAwJywgJyMwMGZmMDAnLCAnIzAwZmZmZicsICcjMDAwMGZmJywgJyNmZjAwZmYnLCAnI2ZmMDAwMCddO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGogPSBhcnIubGVuZ3RoOyBpIDwgajsgKytpKXtcclxuICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoaSAvIChqIC0gMSksIGFycltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWQ7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5jb250cm9sLndpZHRoLCB0aGlzLmNvbnRyb2wuaGVpZ2h0KTtcclxuICAgICAgICBncmFkID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgdGhpcy5jb250cm9sLmhlaWdodCk7XHJcbiAgICAgICAgYXJyID0gWydyZ2JhKDI1NSwgMjU1LCAyNTUsIDEuMCknLCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjApJywgJ3JnYmEoMCwgMCwgMCwgMC4wKScsICdyZ2JhKDAsIDAsIDAsIDEuMCknXTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwLCBqID0gYXJyLmxlbmd0aDsgaSA8IGo7ICsraSl7XHJcbiAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKGkgLyAoaiAtIDEpLCBhcnJbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY29udHJvbC53aWR0aCwgdGhpcy5jb250cm9sLmhlaWdodCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiHqui6q+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+iJsuOCkuihqOOBmeaWh+Wtl+WIl+OBruWApFxyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb2xvclZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kv44Oq44OD44Kv5pmC44Gr44Gu44G/IGNvbG9yVmFsdWUg44KS5pu05paw44GZ44KL44Gf44KB44Gu5LiA5pmC44Kt44Oj44OD44K344Ol5aSJ5pWwXHJcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRlbXBDb2xvclZhbHVlID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgIHRoaXMudGVtcENvbG9yVmFsdWUgPSB0aGlzLmNvbG9yVmFsdWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBpZih0aGlzLnRlbXBDb2xvclZhbHVlICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnRlbXBDb2xvclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGVtcENvbG9yVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGltYWdlRGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YShldmUub2Zmc2V0WCwgZXZlLm9mZnNldFksIDEsIDEpO1xyXG4gICAgICAgICAgICBsZXQgY29sb3IgPSB0aGlzLmdldENvbG9yOGJpdFN0cmluZyhpbWFnZURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoY29sb3IpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZURhdGEgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoZXZlLm9mZnNldFgsIGV2ZS5vZmZzZXRZLCAxLCAxKTtcclxuICAgICAgICAgICAgZXZlLmN1cnJlbnRUYXJnZXQudmFsdWUgPSB0aGlzLmdldENvbG9yOGJpdFN0cmluZyhpbWFnZURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMudGVtcENvbG9yVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCBldmUpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6Ieq6Lqr44Gu44OX44Ot44OR44OG44Kj44Gr6Imy44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBDU1Mg6Imy6KGo54++44Gu44GG44GhIDE2IOmAsuaVsOihqOiomOOBruOCguOBrlxyXG4gICAgICovXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy52YWx1ZS50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY29sb3JWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3JWYWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6Ieq6Lqr44Gr6Kit5a6a44GV44KM44Gm44GE44KL6Imy44KS6KGo44GZ5paH5a2X5YiX44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IDE2IOmAsuaVsOihqOiomOOBruiJsuOCkuihqOOBmeaWh+Wtl+WIl1xyXG4gICAgICovXHJcbiAgICBnZXRWYWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbG9yVmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOiHqui6q+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+iJsuOCkuihqOOBmeaWh+Wtl+WIl+OCkiAwLjAg44GL44KJIDEuMCDjga7lgKTjgavlpInmj5vjgZfphY3liJfjgafov5TjgZlcclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fSDmta7li5XlsI/mlbDjgafooajnj77jgZfjgZ/oibLjga7lgKTjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgZ2V0RmxvYXRWYWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbG9yRmxvYXRBcnJheSh0aGlzLmNvbG9yVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjYW52YXMuaW1hZ2VEYXRhIOOBi+OCieWPluW+l+OBmeOCi+aVsOWApOOBrumFjeWIl+OCkuWFg+OBqyAxNiDpgLLmlbDooajoqJjmloflrZfliJfjgpLnlJ/miJDjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g5pyA5L2O44Gn44KCIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk5pWw5YCk44Gu6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IDE2IOmAsuaVsOihqOiomOOBruiJsuOBruWApOOBruaWh+Wtl+WIl1xyXG4gICAgICovXHJcbiAgICBnZXRDb2xvcjhiaXRTdHJpbmcoY29sb3Ipe1xyXG4gICAgICAgIGxldCByID0gdGhpcy56ZXJvUGFkZGluZyhjb2xvclswXS50b1N0cmluZygxNiksIDIpO1xyXG4gICAgICAgIGxldCBnID0gdGhpcy56ZXJvUGFkZGluZyhjb2xvclsxXS50b1N0cmluZygxNiksIDIpO1xyXG4gICAgICAgIGxldCBiID0gdGhpcy56ZXJvUGFkZGluZyhjb2xvclsyXS50b1N0cmluZygxNiksIDIpO1xyXG4gICAgICAgIHJldHVybiAnIycgKyByICsgZyArIGI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDE2IOmAsuaVsOihqOiomOOBruiJsuihqOePvuaWh+Wtl+WIl+OCkuWFg+OBqyAwLjAg44GL44KJIDEuMCDjga7lgKTjgavlpInmj5vjgZfjgZ/phY3liJfjgpLnlJ/miJDjgZfov5TjgZlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciAtIDE2IOmAsuaVsOihqOiomOOBruiJsuOBruWApOOBruaWh+Wtl+WIl1xyXG4gICAgICogQHJldHVybiB7QXJyYXkuPG51bWJlcj59IFJHQiDjga4gMyDjgaTjga7lgKTjgpIgMC4wIOOBi+OCiSAxLjAg44Gr5aSJ5o+b44GX44Gf5YCk44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIGdldENvbG9yRmxvYXRBcnJheShjb2xvcil7XHJcbiAgICAgICAgaWYoY29sb3IgPT0gbnVsbCB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoY29sb3IpICE9PSAnW29iamVjdCBTdHJpbmddJyl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGlmKGNvbG9yLnNlYXJjaCgvXiMrW1xcZHxhLWZ8QS1GXSskLykgPT09IC0xKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IHMgPSBjb2xvci5yZXBsYWNlKCcjJywgJycpO1xyXG4gICAgICAgIGlmKHMubGVuZ3RoICE9PSAzICYmIHMubGVuZ3RoICE9PSA2KXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IHQgPSBzLmxlbmd0aCAvIDM7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgcGFyc2VJbnQoY29sb3Iuc3Vic3RyKDEsIHQpLCAxNikgLyAyNTUsXHJcbiAgICAgICAgICAgIHBhcnNlSW50KGNvbG9yLnN1YnN0cigxICsgdCwgdCksIDE2KSAvIDI1NSxcclxuICAgICAgICAgICAgcGFyc2VJbnQoY29sb3Iuc3Vic3RyKDEgKyB0ICogMiwgdCksIDE2KSAvIDI1NVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOaVsOWApOOCkuaMh+WumuOBleOCjOOBn+ahgeaVsOOBq+aVtOW9ouOBl+OBn+aWh+Wtl+WIl+OCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIOaVtOW9ouOBl+OBn+OBhOaVsOWApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0g5pW05b2i44GZ44KL5qGB5pWwXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IDE2IOmAsuaVsOihqOiomOOBruiJsuOBruWApOOBruaWh+Wtl+WIl1xyXG4gICAgICovXHJcbiAgICB6ZXJvUGFkZGluZyhudW1iZXIsIGNvdW50KXtcclxuICAgICAgICBsZXQgYSA9IG5ldyBBcnJheShjb3VudCkuam9pbignMCcpO1xyXG4gICAgICAgIHJldHVybiAoYSArIG51bWJlcikuc2xpY2UoLWNvdW50KTtcclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzR3VpLmpzIiwiXHJcbi8qKlxyXG4gKiBnbDNNYXRoXHJcbiAqIEBjbGFzcyBnbDNNYXRoXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNNYXRoIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWF0NFxyXG4gICAgICAgICAqIEB0eXBlIHtNYXQ0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuTWF0NCA9IE1hdDQ7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVmVjM1xyXG4gICAgICAgICAqIEB0eXBlIHtWZWMzfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVmVjMyA9IFZlYzM7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVmVjMlxyXG4gICAgICAgICAqIEB0eXBlIHtWZWMyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVmVjMiA9IFZlYzI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUXRuXHJcbiAgICAgICAgICogQHR5cGUge1F0bn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlF0biAgPSBRdG47XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYXQ0XHJcbiAqIEBjbGFzcyBNYXQ0XHJcbiAqL1xyXG5jbGFzcyBNYXQ0IHtcclxuICAgIC8qKlxyXG4gICAgICogNHg0IOOBruato+aWueihjOWIl+OCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5fSDooYzliJfmoLzntI3nlKjjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDE2KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6KGM5YiX44KS5Y2Y5L2N5YyW44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IGRlc3QgLSDljZjkvY3ljJbjgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOWNmOS9jeWMluOBl+OBn+ihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaWRlbnRpdHkoZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSAgPSAxOyBkZXN0WzFdICA9IDA7IGRlc3RbMl0gID0gMDsgZGVzdFszXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNF0gID0gMDsgZGVzdFs1XSAgPSAxOyBkZXN0WzZdICA9IDA7IGRlc3RbN10gID0gMDtcclxuICAgICAgICBkZXN0WzhdICA9IDA7IGRlc3RbOV0gID0gMDsgZGVzdFsxMF0gPSAxOyBkZXN0WzExXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxMl0gPSAwOyBkZXN0WzEzXSA9IDA7IGRlc3RbMTRdID0gMDsgZGVzdFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDooYzliJfjgpLkuZfnrpfjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0MCAtIOS5l+eul+OBleOCjOOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQxIC0g5LmX566X44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOS5l+eul+e1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g5LmX566X57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBtdWx0aXBseShtYXQwLCBtYXQxLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgbGV0IGEgPSBtYXQwWzBdLCAgYiA9IG1hdDBbMV0sICBjID0gbWF0MFsyXSwgIGQgPSBtYXQwWzNdLFxyXG4gICAgICAgICAgICBlID0gbWF0MFs0XSwgIGYgPSBtYXQwWzVdLCAgZyA9IG1hdDBbNl0sICBoID0gbWF0MFs3XSxcclxuICAgICAgICAgICAgaSA9IG1hdDBbOF0sICBqID0gbWF0MFs5XSwgIGsgPSBtYXQwWzEwXSwgbCA9IG1hdDBbMTFdLFxyXG4gICAgICAgICAgICBtID0gbWF0MFsxMl0sIG4gPSBtYXQwWzEzXSwgbyA9IG1hdDBbMTRdLCBwID0gbWF0MFsxNV0sXHJcbiAgICAgICAgICAgIEEgPSBtYXQxWzBdLCAgQiA9IG1hdDFbMV0sICBDID0gbWF0MVsyXSwgIEQgPSBtYXQxWzNdLFxyXG4gICAgICAgICAgICBFID0gbWF0MVs0XSwgIEYgPSBtYXQxWzVdLCAgRyA9IG1hdDFbNl0sICBIID0gbWF0MVs3XSxcclxuICAgICAgICAgICAgSSA9IG1hdDFbOF0sICBKID0gbWF0MVs5XSwgIEsgPSBtYXQxWzEwXSwgTCA9IG1hdDFbMTFdLFxyXG4gICAgICAgICAgICBNID0gbWF0MVsxMl0sIE4gPSBtYXQxWzEzXSwgTyA9IG1hdDFbMTRdLCBQID0gbWF0MVsxNV07XHJcbiAgICAgICAgb3V0WzBdICA9IEEgKiBhICsgQiAqIGUgKyBDICogaSArIEQgKiBtO1xyXG4gICAgICAgIG91dFsxXSAgPSBBICogYiArIEIgKiBmICsgQyAqIGogKyBEICogbjtcclxuICAgICAgICBvdXRbMl0gID0gQSAqIGMgKyBCICogZyArIEMgKiBrICsgRCAqIG87XHJcbiAgICAgICAgb3V0WzNdICA9IEEgKiBkICsgQiAqIGggKyBDICogbCArIEQgKiBwO1xyXG4gICAgICAgIG91dFs0XSAgPSBFICogYSArIEYgKiBlICsgRyAqIGkgKyBIICogbTtcclxuICAgICAgICBvdXRbNV0gID0gRSAqIGIgKyBGICogZiArIEcgKiBqICsgSCAqIG47XHJcbiAgICAgICAgb3V0WzZdICA9IEUgKiBjICsgRiAqIGcgKyBHICogayArIEggKiBvO1xyXG4gICAgICAgIG91dFs3XSAgPSBFICogZCArIEYgKiBoICsgRyAqIGwgKyBIICogcDtcclxuICAgICAgICBvdXRbOF0gID0gSSAqIGEgKyBKICogZSArIEsgKiBpICsgTCAqIG07XHJcbiAgICAgICAgb3V0WzldICA9IEkgKiBiICsgSiAqIGYgKyBLICogaiArIEwgKiBuO1xyXG4gICAgICAgIG91dFsxMF0gPSBJICogYyArIEogKiBnICsgSyAqIGsgKyBMICogbztcclxuICAgICAgICBvdXRbMTFdID0gSSAqIGQgKyBKICogaCArIEsgKiBsICsgTCAqIHA7XHJcbiAgICAgICAgb3V0WzEyXSA9IE0gKiBhICsgTiAqIGUgKyBPICogaSArIFAgKiBtO1xyXG4gICAgICAgIG91dFsxM10gPSBNICogYiArIE4gKiBmICsgTyAqIGogKyBQICogbjtcclxuICAgICAgICBvdXRbMTRdID0gTSAqIGMgKyBOICogZyArIE8gKiBrICsgUCAqIG87XHJcbiAgICAgICAgb3V0WzE1XSA9IE0gKiBkICsgTiAqIGggKyBPICogbCArIFAgKiBwO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOihjOWIl+OBq+aLoeWkp+e4ruWwj+OCkumBqeeUqOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQgLSDpgannlKjjgpLlj5fjgZHjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdmVjIC0gWFlaIOOBruWQhOi7uOOBq+WvvuOBl+OBpuaLoee4ruOCkumBqeeUqOOBmeOCi+WApOOBruihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NhbGUobWF0LCB2ZWMsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBvdXRbMF0gID0gbWF0WzBdICAqIHZlY1swXTtcclxuICAgICAgICBvdXRbMV0gID0gbWF0WzFdICAqIHZlY1swXTtcclxuICAgICAgICBvdXRbMl0gID0gbWF0WzJdICAqIHZlY1swXTtcclxuICAgICAgICBvdXRbM10gID0gbWF0WzNdICAqIHZlY1swXTtcclxuICAgICAgICBvdXRbNF0gID0gbWF0WzRdICAqIHZlY1sxXTtcclxuICAgICAgICBvdXRbNV0gID0gbWF0WzVdICAqIHZlY1sxXTtcclxuICAgICAgICBvdXRbNl0gID0gbWF0WzZdICAqIHZlY1sxXTtcclxuICAgICAgICBvdXRbN10gID0gbWF0WzddICAqIHZlY1sxXTtcclxuICAgICAgICBvdXRbOF0gID0gbWF0WzhdICAqIHZlY1syXTtcclxuICAgICAgICBvdXRbOV0gID0gbWF0WzldICAqIHZlY1syXTtcclxuICAgICAgICBvdXRbMTBdID0gbWF0WzEwXSAqIHZlY1syXTtcclxuICAgICAgICBvdXRbMTFdID0gbWF0WzExXSAqIHZlY1syXTtcclxuICAgICAgICBvdXRbMTJdID0gbWF0WzEyXTtcclxuICAgICAgICBvdXRbMTNdID0gbWF0WzEzXTtcclxuICAgICAgICBvdXRbMTRdID0gbWF0WzE0XTtcclxuICAgICAgICBvdXRbMTVdID0gbWF0WzE1XTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDooYzliJfjgavlubPooYznp7vli5XjgpLpgannlKjjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0g6YGp55So44KS5Y+X44GR44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHZlYyAtIFhZWiDjga7lkITou7jjgavlr77jgZfjgablubPooYznp7vli5XjgpLpgannlKjjgZnjgovlgKTjga7ooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRyYW5zbGF0ZShtYXQsIHZlYywgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIG91dFswXSA9IG1hdFswXTsgb3V0WzFdID0gbWF0WzFdOyBvdXRbMl0gID0gbWF0WzJdOyAgb3V0WzNdICA9IG1hdFszXTtcclxuICAgICAgICBvdXRbNF0gPSBtYXRbNF07IG91dFs1XSA9IG1hdFs1XTsgb3V0WzZdICA9IG1hdFs2XTsgIG91dFs3XSAgPSBtYXRbN107XHJcbiAgICAgICAgb3V0WzhdID0gbWF0WzhdOyBvdXRbOV0gPSBtYXRbOV07IG91dFsxMF0gPSBtYXRbMTBdOyBvdXRbMTFdID0gbWF0WzExXTtcclxuICAgICAgICBvdXRbMTJdID0gbWF0WzBdICogdmVjWzBdICsgbWF0WzRdICogdmVjWzFdICsgbWF0WzhdICAqIHZlY1syXSArIG1hdFsxMl07XHJcbiAgICAgICAgb3V0WzEzXSA9IG1hdFsxXSAqIHZlY1swXSArIG1hdFs1XSAqIHZlY1sxXSArIG1hdFs5XSAgKiB2ZWNbMl0gKyBtYXRbMTNdO1xyXG4gICAgICAgIG91dFsxNF0gPSBtYXRbMl0gKiB2ZWNbMF0gKyBtYXRbNl0gKiB2ZWNbMV0gKyBtYXRbMTBdICogdmVjWzJdICsgbWF0WzE0XTtcclxuICAgICAgICBvdXRbMTVdID0gbWF0WzNdICogdmVjWzBdICsgbWF0WzddICogdmVjWzFdICsgbWF0WzExXSAqIHZlY1syXSArIG1hdFsxNV07XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6KGM5YiX44Gr5Zue6Lui44KS6YGp55So44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdCAtIOmBqeeUqOOCkuWPl+OBkeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0g5Zue6Lui6YeP44KS6KGo44GZ5YCk77yI44Op44K444Ki44Oz77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IGF4aXMgLSDlm57ou6Ljga7ou7hcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJvdGF0ZShtYXQsIGFuZ2xlLCBheGlzLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgbGV0IHNxID0gTWF0aC5zcXJ0KGF4aXNbMF0gKiBheGlzWzBdICsgYXhpc1sxXSAqIGF4aXNbMV0gKyBheGlzWzJdICogYXhpc1syXSk7XHJcbiAgICAgICAgaWYoIXNxKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IGEgPSBheGlzWzBdLCBiID0gYXhpc1sxXSwgYyA9IGF4aXNbMl07XHJcbiAgICAgICAgaWYoc3EgIT0gMSl7c3EgPSAxIC8gc3E7IGEgKj0gc3E7IGIgKj0gc3E7IGMgKj0gc3E7fVxyXG4gICAgICAgIGxldCBkID0gTWF0aC5zaW4oYW5nbGUpLCBlID0gTWF0aC5jb3MoYW5nbGUpLCBmID0gMSAtIGUsXHJcbiAgICAgICAgICAgIGcgPSBtYXRbMF0sICBoID0gbWF0WzFdLCBpID0gbWF0WzJdLCAgaiA9IG1hdFszXSxcclxuICAgICAgICAgICAgayA9IG1hdFs0XSwgIGwgPSBtYXRbNV0sIG0gPSBtYXRbNl0sICBuID0gbWF0WzddLFxyXG4gICAgICAgICAgICBvID0gbWF0WzhdLCAgcCA9IG1hdFs5XSwgcSA9IG1hdFsxMF0sIHIgPSBtYXRbMTFdLFxyXG4gICAgICAgICAgICBzID0gYSAqIGEgKiBmICsgZSxcclxuICAgICAgICAgICAgdCA9IGIgKiBhICogZiArIGMgKiBkLFxyXG4gICAgICAgICAgICB1ID0gYyAqIGEgKiBmIC0gYiAqIGQsXHJcbiAgICAgICAgICAgIHYgPSBhICogYiAqIGYgLSBjICogZCxcclxuICAgICAgICAgICAgdyA9IGIgKiBiICogZiArIGUsXHJcbiAgICAgICAgICAgIHggPSBjICogYiAqIGYgKyBhICogZCxcclxuICAgICAgICAgICAgeSA9IGEgKiBjICogZiArIGIgKiBkLFxyXG4gICAgICAgICAgICB6ID0gYiAqIGMgKiBmIC0gYSAqIGQsXHJcbiAgICAgICAgICAgIEEgPSBjICogYyAqIGYgKyBlO1xyXG4gICAgICAgIGlmKGFuZ2xlKXtcclxuICAgICAgICAgICAgaWYobWF0ICE9IG91dCl7XHJcbiAgICAgICAgICAgICAgICBvdXRbMTJdID0gbWF0WzEyXTsgb3V0WzEzXSA9IG1hdFsxM107XHJcbiAgICAgICAgICAgICAgICBvdXRbMTRdID0gbWF0WzE0XTsgb3V0WzE1XSA9IG1hdFsxNV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgPSBtYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dFswXSAgPSBnICogcyArIGsgKiB0ICsgbyAqIHU7XHJcbiAgICAgICAgb3V0WzFdICA9IGggKiBzICsgbCAqIHQgKyBwICogdTtcclxuICAgICAgICBvdXRbMl0gID0gaSAqIHMgKyBtICogdCArIHEgKiB1O1xyXG4gICAgICAgIG91dFszXSAgPSBqICogcyArIG4gKiB0ICsgciAqIHU7XHJcbiAgICAgICAgb3V0WzRdICA9IGcgKiB2ICsgayAqIHcgKyBvICogeDtcclxuICAgICAgICBvdXRbNV0gID0gaCAqIHYgKyBsICogdyArIHAgKiB4O1xyXG4gICAgICAgIG91dFs2XSAgPSBpICogdiArIG0gKiB3ICsgcSAqIHg7XHJcbiAgICAgICAgb3V0WzddICA9IGogKiB2ICsgbiAqIHcgKyByICogeDtcclxuICAgICAgICBvdXRbOF0gID0gZyAqIHkgKyBrICogeiArIG8gKiBBO1xyXG4gICAgICAgIG91dFs5XSAgPSBoICogeSArIGwgKiB6ICsgcCAqIEE7XHJcbiAgICAgICAgb3V0WzEwXSA9IGkgKiB5ICsgbSAqIHogKyBxICogQTtcclxuICAgICAgICBvdXRbMTFdID0gaiAqIHkgKyBuICogeiArIHIgKiBBO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODk+ODpeODvOW6p+aomeWkieaPm+ihjOWIl+OCkueUn+aIkOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSBleWUgLSDoppbngrnkvY3nva5cclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gY2VudGVyIC0g5rOo6KaW54K5XHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHVwIC0g5LiK5pa55ZCR44KS56S644GZ44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsb29rQXQoZXllLCBjZW50ZXIsIHVwLCBkZXN0KXtcclxuICAgICAgICBsZXQgZXllWCAgICA9IGV5ZVswXSwgICAgZXllWSAgICA9IGV5ZVsxXSwgICAgZXllWiAgICA9IGV5ZVsyXSxcclxuICAgICAgICAgICAgY2VudGVyWCA9IGNlbnRlclswXSwgY2VudGVyWSA9IGNlbnRlclsxXSwgY2VudGVyWiA9IGNlbnRlclsyXSxcclxuICAgICAgICAgICAgdXBYICAgICA9IHVwWzBdLCAgICAgdXBZICAgICA9IHVwWzFdLCAgICAgdXBaICAgICA9IHVwWzJdO1xyXG4gICAgICAgIGlmKGV5ZVggPT0gY2VudGVyWCAmJiBleWVZID09IGNlbnRlclkgJiYgZXllWiA9PSBjZW50ZXJaKXtyZXR1cm4gTWF0NC5pZGVudGl0eShkZXN0KTt9XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIGxldCB4MCwgeDEsIHgyLCB5MCwgeTEsIHkyLCB6MCwgejEsIHoyLCBsO1xyXG4gICAgICAgIHowID0gZXllWCAtIGNlbnRlclswXTsgejEgPSBleWVZIC0gY2VudGVyWzFdOyB6MiA9IGV5ZVogLSBjZW50ZXJbMl07XHJcbiAgICAgICAgbCA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcclxuICAgICAgICB6MCAqPSBsOyB6MSAqPSBsOyB6MiAqPSBsO1xyXG4gICAgICAgIHgwID0gdXBZICogejIgLSB1cFogKiB6MTtcclxuICAgICAgICB4MSA9IHVwWiAqIHowIC0gdXBYICogejI7XHJcbiAgICAgICAgeDIgPSB1cFggKiB6MSAtIHVwWSAqIHowO1xyXG4gICAgICAgIGwgPSBNYXRoLnNxcnQoeDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyKTtcclxuICAgICAgICBpZighbCl7XHJcbiAgICAgICAgICAgIHgwID0gMDsgeDEgPSAwOyB4MiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbCA9IDEgLyBsO1xyXG4gICAgICAgICAgICB4MCAqPSBsOyB4MSAqPSBsOyB4MiAqPSBsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxOyB5MSA9IHoyICogeDAgLSB6MCAqIHgyOyB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xyXG4gICAgICAgIGwgPSBNYXRoLnNxcnQoeTAgKiB5MCArIHkxICogeTEgKyB5MiAqIHkyKTtcclxuICAgICAgICBpZighbCl7XHJcbiAgICAgICAgICAgIHkwID0gMDsgeTEgPSAwOyB5MiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbCA9IDEgLyBsO1xyXG4gICAgICAgICAgICB5MCAqPSBsOyB5MSAqPSBsOyB5MiAqPSBsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXRbMF0gPSB4MDsgb3V0WzFdID0geTA7IG91dFsyXSAgPSB6MDsgb3V0WzNdICA9IDA7XHJcbiAgICAgICAgb3V0WzRdID0geDE7IG91dFs1XSA9IHkxOyBvdXRbNl0gID0gejE7IG91dFs3XSAgPSAwO1xyXG4gICAgICAgIG91dFs4XSA9IHgyOyBvdXRbOV0gPSB5Mjsgb3V0WzEwXSA9IHoyOyBvdXRbMTFdID0gMDtcclxuICAgICAgICBvdXRbMTJdID0gLSh4MCAqIGV5ZVggKyB4MSAqIGV5ZVkgKyB4MiAqIGV5ZVopO1xyXG4gICAgICAgIG91dFsxM10gPSAtKHkwICogZXllWCArIHkxICogZXllWSArIHkyICogZXllWik7XHJcbiAgICAgICAgb3V0WzE0XSA9IC0oejAgKiBleWVYICsgejEgKiBleWVZICsgejIgKiBleWVaKTtcclxuICAgICAgICBvdXRbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDpgI/oppbmipXlvbHlpInmj5vooYzliJfjgpLnlJ/miJDjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IC0g6KaW6YeO6KeS77yI5bqm5pWw5rOV77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXNwZWN0IC0g44Ki44K544Oa44Kv44OI5q+U77yI5bmFIC8g6auY44GV77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbmVhciAtIOODi+OCouOCr+ODquODg+ODl+mdouOBvuOBp+OBrui3nembolxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZhciAtIOODleOCoeODvOOCr+ODquODg+ODl+mdouOBvuOBp+OBrui3nembolxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBsZXQgdCA9IG5lYXIgKiBNYXRoLnRhbihmb3Z5ICogTWF0aC5QSSAvIDM2MCk7XHJcbiAgICAgICAgbGV0IHIgPSB0ICogYXNwZWN0O1xyXG4gICAgICAgIGxldCBhID0gciAqIDIsIGIgPSB0ICogMiwgYyA9IGZhciAtIG5lYXI7XHJcbiAgICAgICAgb3V0WzBdICA9IG5lYXIgKiAyIC8gYTtcclxuICAgICAgICBvdXRbMV0gID0gMDtcclxuICAgICAgICBvdXRbMl0gID0gMDtcclxuICAgICAgICBvdXRbM10gID0gMDtcclxuICAgICAgICBvdXRbNF0gID0gMDtcclxuICAgICAgICBvdXRbNV0gID0gbmVhciAqIDIgLyBiO1xyXG4gICAgICAgIG91dFs2XSAgPSAwO1xyXG4gICAgICAgIG91dFs3XSAgPSAwO1xyXG4gICAgICAgIG91dFs4XSAgPSAwO1xyXG4gICAgICAgIG91dFs5XSAgPSAwO1xyXG4gICAgICAgIG91dFsxMF0gPSAtKGZhciArIG5lYXIpIC8gYztcclxuICAgICAgICBvdXRbMTFdID0gLTE7XHJcbiAgICAgICAgb3V0WzEyXSA9IDA7XHJcbiAgICAgICAgb3V0WzEzXSA9IDA7XHJcbiAgICAgICAgb3V0WzE0XSA9IC0oZmFyICogbmVhciAqIDIpIC8gYztcclxuICAgICAgICBvdXRbMTVdID0gMDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmraPlsITlvbHmipXlvbHlpInmj5vooYzliJfjgpLnlJ/miJDjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IC0g5bem56uvXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmlnaHQgLSDlj7Pnq69cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgLSDkuIrnq69cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3R0b20gLSDkuIvnq69cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIC0g44OL44Ki44Kv44Oq44OD44OX6Z2i44G+44Gn44Gu6Led6ZuiXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmFyIC0g44OV44Kh44O844Kv44Oq44OD44OX6Z2i44G+44Gn44Gu6Led6ZuiXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBvcnRobyhsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIG5lYXIsIGZhciwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIGxldCBoID0gKHJpZ2h0IC0gbGVmdCk7XHJcbiAgICAgICAgbGV0IHYgPSAodG9wIC0gYm90dG9tKTtcclxuICAgICAgICBsZXQgZCA9IChmYXIgLSBuZWFyKTtcclxuICAgICAgICBvdXRbMF0gID0gMiAvIGg7XHJcbiAgICAgICAgb3V0WzFdICA9IDA7XHJcbiAgICAgICAgb3V0WzJdICA9IDA7XHJcbiAgICAgICAgb3V0WzNdICA9IDA7XHJcbiAgICAgICAgb3V0WzRdICA9IDA7XHJcbiAgICAgICAgb3V0WzVdICA9IDIgLyB2O1xyXG4gICAgICAgIG91dFs2XSAgPSAwO1xyXG4gICAgICAgIG91dFs3XSAgPSAwO1xyXG4gICAgICAgIG91dFs4XSAgPSAwO1xyXG4gICAgICAgIG91dFs5XSAgPSAwO1xyXG4gICAgICAgIG91dFsxMF0gPSAtMiAvIGQ7XHJcbiAgICAgICAgb3V0WzExXSA9IDA7XHJcbiAgICAgICAgb3V0WzEyXSA9IC0obGVmdCArIHJpZ2h0KSAvIGg7XHJcbiAgICAgICAgb3V0WzEzXSA9IC0odG9wICsgYm90dG9tKSAvIHY7XHJcbiAgICAgICAgb3V0WzE0XSA9IC0oZmFyICsgbmVhcikgLyBkO1xyXG4gICAgICAgIG91dFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOi7oue9ruihjOWIl+OCkueUn+aIkOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQgLSDpgannlKjjgZnjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRyYW5zcG9zZShtYXQsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBvdXRbMF0gID0gbWF0WzBdOyAgb3V0WzFdICA9IG1hdFs0XTtcclxuICAgICAgICBvdXRbMl0gID0gbWF0WzhdOyAgb3V0WzNdICA9IG1hdFsxMl07XHJcbiAgICAgICAgb3V0WzRdICA9IG1hdFsxXTsgIG91dFs1XSAgPSBtYXRbNV07XHJcbiAgICAgICAgb3V0WzZdICA9IG1hdFs5XTsgIG91dFs3XSAgPSBtYXRbMTNdO1xyXG4gICAgICAgIG91dFs4XSAgPSBtYXRbMl07ICBvdXRbOV0gID0gbWF0WzZdO1xyXG4gICAgICAgIG91dFsxMF0gPSBtYXRbMTBdOyBvdXRbMTFdID0gbWF0WzE0XTtcclxuICAgICAgICBvdXRbMTJdID0gbWF0WzNdOyAgb3V0WzEzXSA9IG1hdFs3XTtcclxuICAgICAgICBvdXRbMTRdID0gbWF0WzExXTsgb3V0WzE1XSA9IG1hdFsxNV07XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6YCG6KGM5YiX44KS55Sf5oiQ44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdCAtIOmBqeeUqOOBmeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW52ZXJzZShtYXQsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBsZXQgYSA9IG1hdFswXSwgIGIgPSBtYXRbMV0sICBjID0gbWF0WzJdLCAgZCA9IG1hdFszXSxcclxuICAgICAgICAgICAgZSA9IG1hdFs0XSwgIGYgPSBtYXRbNV0sICBnID0gbWF0WzZdLCAgaCA9IG1hdFs3XSxcclxuICAgICAgICAgICAgaSA9IG1hdFs4XSwgIGogPSBtYXRbOV0sICBrID0gbWF0WzEwXSwgbCA9IG1hdFsxMV0sXHJcbiAgICAgICAgICAgIG0gPSBtYXRbMTJdLCBuID0gbWF0WzEzXSwgbyA9IG1hdFsxNF0sIHAgPSBtYXRbMTVdLFxyXG4gICAgICAgICAgICBxID0gYSAqIGYgLSBiICogZSwgciA9IGEgKiBnIC0gYyAqIGUsXHJcbiAgICAgICAgICAgIHMgPSBhICogaCAtIGQgKiBlLCB0ID0gYiAqIGcgLSBjICogZixcclxuICAgICAgICAgICAgdSA9IGIgKiBoIC0gZCAqIGYsIHYgPSBjICogaCAtIGQgKiBnLFxyXG4gICAgICAgICAgICB3ID0gaSAqIG4gLSBqICogbSwgeCA9IGkgKiBvIC0gayAqIG0sXHJcbiAgICAgICAgICAgIHkgPSBpICogcCAtIGwgKiBtLCB6ID0gaiAqIG8gLSBrICogbixcclxuICAgICAgICAgICAgQSA9IGogKiBwIC0gbCAqIG4sIEIgPSBrICogcCAtIGwgKiBvLFxyXG4gICAgICAgICAgICBpdmQgPSAxIC8gKHEgKiBCIC0gciAqIEEgKyBzICogeiArIHQgKiB5IC0gdSAqIHggKyB2ICogdyk7XHJcbiAgICAgICAgb3V0WzBdICA9ICggZiAqIEIgLSBnICogQSArIGggKiB6KSAqIGl2ZDtcclxuICAgICAgICBvdXRbMV0gID0gKC1iICogQiArIGMgKiBBIC0gZCAqIHopICogaXZkO1xyXG4gICAgICAgIG91dFsyXSAgPSAoIG4gKiB2IC0gbyAqIHUgKyBwICogdCkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzNdICA9ICgtaiAqIHYgKyBrICogdSAtIGwgKiB0KSAqIGl2ZDtcclxuICAgICAgICBvdXRbNF0gID0gKC1lICogQiArIGcgKiB5IC0gaCAqIHgpICogaXZkO1xyXG4gICAgICAgIG91dFs1XSAgPSAoIGEgKiBCIC0gYyAqIHkgKyBkICogeCkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzZdICA9ICgtbSAqIHYgKyBvICogcyAtIHAgKiByKSAqIGl2ZDtcclxuICAgICAgICBvdXRbN10gID0gKCBpICogdiAtIGsgKiBzICsgbCAqIHIpICogaXZkO1xyXG4gICAgICAgIG91dFs4XSAgPSAoIGUgKiBBIC0gZiAqIHkgKyBoICogdykgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzldICA9ICgtYSAqIEEgKyBiICogeSAtIGQgKiB3KSAqIGl2ZDtcclxuICAgICAgICBvdXRbMTBdID0gKCBtICogdSAtIG4gKiBzICsgcCAqIHEpICogaXZkO1xyXG4gICAgICAgIG91dFsxMV0gPSAoLWkgKiB1ICsgaiAqIHMgLSBsICogcSkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzEyXSA9ICgtZSAqIHogKyBmICogeCAtIGcgKiB3KSAqIGl2ZDtcclxuICAgICAgICBvdXRbMTNdID0gKCBhICogeiAtIGIgKiB4ICsgYyAqIHcpICogaXZkO1xyXG4gICAgICAgIG91dFsxNF0gPSAoLW0gKiB0ICsgbiAqIHIgLSBvICogcSkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzE1XSA9ICggaSAqIHQgLSBqICogciArIGsgKiBxKSAqIGl2ZDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDooYzliJfjgavjg5njgq/jg4jjg6vjgpLkuZfnrpfjgZnjgovvvIjjg5njgq/jg4jjg6vjgavooYzliJfjgpLpgannlKjjgZnjgovvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0g6YGp55So44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSB2ZWMgLSDkuZfnrpfjgZnjgovjg5njgq/jg4jjg6vvvIg0IOOBpOOBruimgee0oOOCkuaMgeOBpOmFjeWIl++8iVxyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5fSDntZDmnpzjga7jg5njgq/jg4jjg6tcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRvVmVjSVYobWF0LCB2ZWMpe1xyXG4gICAgICAgIGxldCBhID0gbWF0WzBdLCAgYiA9IG1hdFsxXSwgIGMgPSBtYXRbMl0sICBkID0gbWF0WzNdLFxyXG4gICAgICAgICAgICBlID0gbWF0WzRdLCAgZiA9IG1hdFs1XSwgIGcgPSBtYXRbNl0sICBoID0gbWF0WzddLFxyXG4gICAgICAgICAgICBpID0gbWF0WzhdLCAgaiA9IG1hdFs5XSwgIGsgPSBtYXRbMTBdLCBsID0gbWF0WzExXSxcclxuICAgICAgICAgICAgbSA9IG1hdFsxMl0sIG4gPSBtYXRbMTNdLCBvID0gbWF0WzE0XSwgcCA9IG1hdFsxNV07XHJcbiAgICAgICAgbGV0IHggPSB2ZWNbMF0sIHkgPSB2ZWNbMV0sIHogPSB2ZWNbMl0sIHcgPSB2ZWNbM107XHJcbiAgICAgICAgbGV0IG91dCA9IFtdO1xyXG4gICAgICAgIG91dFswXSA9IHggKiBhICsgeSAqIGUgKyB6ICogaSArIHcgKiBtO1xyXG4gICAgICAgIG91dFsxXSA9IHggKiBiICsgeSAqIGYgKyB6ICogaiArIHcgKiBuO1xyXG4gICAgICAgIG91dFsyXSA9IHggKiBjICsgeSAqIGcgKyB6ICogayArIHcgKiBvO1xyXG4gICAgICAgIG91dFszXSA9IHggKiBkICsgeSAqIGggKyB6ICogbCArIHcgKiBwO1xyXG4gICAgICAgIHZlYyA9IG91dDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqvjg6Hjg6njga7jg5fjg63jg5Hjg4bjgqPjgavnm7jlvZPjgZnjgovmg4XloLHjgpLlj5fjgZHlj5bjgorooYzliJfjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gcG9zaXRpb24gLSDjgqvjg6Hjg6njga7luqfmqJlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gY2VudGVyUG9pbnQgLSDjgqvjg6Hjg6njga7ms6joppbngrlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdXBEaXJlY3Rpb24gLSDjgqvjg6Hjg6njga7kuIrmlrnlkJFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IC0g6KaW6YeO6KeSXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXNwZWN0IC0g44Ki44K544Oa44Kv44OI5q+UXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbmVhciAtIOODi+OCouOCr+ODquODg+ODl+mdolxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZhciAtIOODleOCoeODvOOCr+ODquODg+ODl+mdolxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSB2bWF0IC0g44OT44Ol44O85bqn5qiZ5aSJ5o+b6KGM5YiX44Gu57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IHBtYXQgLSDpgI/oppbmipXlvbHluqfmqJnlpInmj5vooYzliJfjga7ntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gZGVzdCAtIOODk+ODpeODvCB4IOmAj+imluaKleW9seWkieaPm+ihjOWIl+OBrue1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdnBGcm9tQ2FtZXJhUHJvcGVydHkocG9zaXRpb24sIGNlbnRlclBvaW50LCB1cERpcmVjdGlvbiwgZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIHZtYXQsIHBtYXQsIGRlc3Qpe1xyXG4gICAgICAgIE1hdDQubG9va0F0KHBvc2l0aW9uLCBjZW50ZXJQb2ludCwgdXBEaXJlY3Rpb24sIHZtYXQpO1xyXG4gICAgICAgIE1hdDQucGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIHBtYXQpO1xyXG4gICAgICAgIE1hdDQubXVsdGlwbHkocG1hdCwgdm1hdCwgZGVzdCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIE1WUCDooYzliJfjgavnm7jlvZPjgZnjgovooYzliJfjgpLlj5fjgZHlj5bjgorjg5njgq/jg4jjg6vjgpLlpInmj5vjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0gTVZQIOihjOWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gdmVjIC0gTVZQIOihjOWIl+OBqOS5l+eul+OBmeOCi+ODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0g44OT44Ol44O844Od44O844OI44Gu5bmFXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g44OT44Ol44O844Od44O844OI44Gu6auY44GVXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0g57WQ5p6c44Gu44OZ44Kv44OI44Or77yIMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6vvvIlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlblBvc2l0aW9uRnJvbU12cChtYXQsIHZlYywgd2lkdGgsIGhlaWdodCl7XHJcbiAgICAgICAgbGV0IGhhbGZXaWR0aCA9IHdpZHRoICogMC41O1xyXG4gICAgICAgIGxldCBoYWxmSGVpZ2h0ID0gaGVpZ2h0ICogMC41O1xyXG4gICAgICAgIGxldCB2ID0gTWF0NC50b1ZlY0lWKG1hdCwgW3ZlY1swXSwgdmVjWzFdLCB2ZWNbMl0sIDEuMF0pO1xyXG4gICAgICAgIGlmKHZbM10gPD0gMC4wKXtyZXR1cm4gW05hTiwgTmFOXTt9XHJcbiAgICAgICAgdlswXSAvPSB2WzNdOyB2WzFdIC89IHZbM107IHZbMl0gLz0gdlszXTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBoYWxmV2lkdGggKyB2WzBdICogaGFsZldpZHRoLFxyXG4gICAgICAgICAgICBoYWxmSGVpZ2h0IC0gdlsxXSAqIGhhbGZIZWlnaHRcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVmVjM1xyXG4gKiBAY2xhc3MgVmVjM1xyXG4gKi9cclxuY2xhc3MgVmVjMyB7XHJcbiAgICAvKipcclxuICAgICAqIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44Or44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IOODmeOCr+ODiOODq+agvOe0jeeUqOOBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODmeOCr+ODiOODq+OBrumVt+OBle+8iOWkp+OBjeOBle+8ieOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2IC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44OZ44Kv44OI44Or44Gu6ZW344GV77yI5aSn44GN44GV77yJXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsZW4odil7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh2WzBdICogdlswXSArIHZbMV0gKiB2WzFdICsgdlsyXSAqIHZbMl0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruW6p+aome+8iOWni+eCueODu+e1gueCue+8ieOCkue1kOOBtuODmeOCr+ODiOODq+OCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MCAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk5aeL54K55bqn5qiZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYxIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTntYLngrnluqfmqJlcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMz59IOimlueCueOBqOe1gueCueOCkue1kOOBtuODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGlzdGFuY2UodjAsIHYxKXtcclxuICAgICAgICBsZXQgbiA9IFZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgblswXSA9IHYxWzBdIC0gdjBbMF07XHJcbiAgICAgICAgblsxXSA9IHYxWzFdIC0gdjBbMV07XHJcbiAgICAgICAgblsyXSA9IHYxWzJdIC0gdjBbMl07XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODmeOCr+ODiOODq+OCkuato+imj+WMluOBl+OBn+e1kOaenOOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2IC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMz59IOato+imj+WMluOBl+OBn+ODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKHYpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgbCA9IFZlYzMubGVuKHYpO1xyXG4gICAgICAgIGlmKGwgPiAwKXtcclxuICAgICAgICAgICAgbGV0IGUgPSAxLjAgLyBsO1xyXG4gICAgICAgICAgICBuWzBdID0gdlswXSAqIGU7XHJcbiAgICAgICAgICAgIG5bMV0gPSB2WzFdICogZTtcclxuICAgICAgICAgICAgblsyXSA9IHZbMl0gKiBlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBuWzBdID0gMC4wO1xyXG4gICAgICAgICAgICBuWzFdID0gMC4wO1xyXG4gICAgICAgICAgICBuWzJdID0gMC4wO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7jg5njgq/jg4jjg6vjga7lhoXnqY3jga7ntZDmnpzjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjAgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MSAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOWGheepjeOBrue1kOaenFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZG90KHYwLCB2MSl7XHJcbiAgICAgICAgcmV0dXJuIHYwWzBdICogdjFbMF0gKyB2MFsxXSAqIHYxWzFdICsgdjBbMl0gKiB2MVsyXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7jg5njgq/jg4jjg6vjga7lpJbnqY3jga7ntZDmnpzjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjAgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MSAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSDlpJbnqY3jga7ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyb3NzKHYwLCB2MSl7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIG5bMF0gPSB2MFsxXSAqIHYxWzJdIC0gdjBbMl0gKiB2MVsxXTtcclxuICAgICAgICBuWzFdID0gdjBbMl0gKiB2MVswXSAtIHYwWzBdICogdjFbMl07XHJcbiAgICAgICAgblsyXSA9IHYwWzBdICogdjFbMV0gLSB2MFsxXSAqIHYxWzBdO1xyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAzIOOBpOOBruODmeOCr+ODiOODq+OBi+OCiemdouazlee3muOCkuaxguOCgeOBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MCAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYxIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjIgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxWZWMzPn0g6Z2i5rOV57ea44OZ44Kv44OI44OrXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmYWNlTm9ybWFsKHYwLCB2MSwgdjIpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgdmVjMSA9IFt2MVswXSAtIHYwWzBdLCB2MVsxXSAtIHYwWzFdLCB2MVsyXSAtIHYwWzJdXTtcclxuICAgICAgICBsZXQgdmVjMiA9IFt2MlswXSAtIHYwWzBdLCB2MlsxXSAtIHYwWzFdLCB2MlsyXSAtIHYwWzJdXTtcclxuICAgICAgICBuWzBdID0gdmVjMVsxXSAqIHZlYzJbMl0gLSB2ZWMxWzJdICogdmVjMlsxXTtcclxuICAgICAgICBuWzFdID0gdmVjMVsyXSAqIHZlYzJbMF0gLSB2ZWMxWzBdICogdmVjMlsyXTtcclxuICAgICAgICBuWzJdID0gdmVjMVswXSAqIHZlYzJbMV0gLSB2ZWMxWzFdICogdmVjMlswXTtcclxuICAgICAgICByZXR1cm4gVmVjMy5ub3JtYWxpemUobik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWZWMyXHJcbiAqIEBjbGFzcyBWZWMyXHJcbiAqL1xyXG5jbGFzcyBWZWMyIHtcclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6vjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0g44OZ44Kv44OI44Or5qC857SN55So44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44OZ44Kv44OI44Or44Gu6ZW344GV77yI5aSn44GN44GV77yJ44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDjg5njgq/jg4jjg6vjga7plbfjgZXvvIjlpKfjgY3jgZXvvIlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxlbih2KXtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHZbMF0gKiB2WzBdICsgdlsxXSAqIHZbMV0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruW6p+aome+8iOWni+eCueODu+e1gueCue+8ieOCkue1kOOBtuODmeOCr+ODiOODq+OCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2MCAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk5aeL54K55bqn5qiZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYxIC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTntYLngrnluqfmqJlcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMj59IOimlueCueOBqOe1gueCueOCkue1kOOBtuODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGlzdGFuY2UodjAsIHYxKXtcclxuICAgICAgICBsZXQgbiA9IFZlYzIuY3JlYXRlKCk7XHJcbiAgICAgICAgblswXSA9IHYxWzBdIC0gdjBbMF07XHJcbiAgICAgICAgblsxXSA9IHYxWzFdIC0gdjBbMV07XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODmeOCr+ODiOODq+OCkuato+imj+WMluOBl+OBn+e1kOaenOOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2IC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMj59IOato+imj+WMluOBl+OBn+ODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKHYpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMi5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgbCA9IFZlYzIubGVuKHYpO1xyXG4gICAgICAgIGlmKGwgPiAwKXtcclxuICAgICAgICAgICAgbGV0IGUgPSAxLjAgLyBsO1xyXG4gICAgICAgICAgICBuWzBdID0gdlswXSAqIGU7XHJcbiAgICAgICAgICAgIG5bMV0gPSB2WzFdICogZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu44OZ44Kv44OI44Or44Gu5YaF56mN44Gu57WQ5p6c44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYwIC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdjEgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDlhoXnqY3jga7ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRvdCh2MCwgdjEpe1xyXG4gICAgICAgIHJldHVybiB2MFswXSAqIHYxWzBdICsgdjBbMV0gKiB2MVsxXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7jg5njgq/jg4jjg6vjga7lpJbnqY3jga7ntZDmnpzjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdjAgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2MSAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSDlpJbnqY3jga7ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyb3NzKHYwLCB2MSl7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMyLmNyZWF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB2MFswXSAqIHYxWzFdIC0gdjBbMV0gKiB2MVswXTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFF0blxyXG4gKiBAY2xhc3MgUXRuXHJcbiAqL1xyXG5jbGFzcyBRdG4ge1xyXG4gICAgLyoqXHJcbiAgICAgKiA0IOOBpOOBruimgee0oOOBi+OCieOBquOCi+OCr+OCqeODvOOCv+ODi+OCquODs+OBruODh+ODvOOCv+ani+mAoOOCkueUn+aIkOOBmeOCi++8iOiZmumDqCB4LCB5LCB6LCDlrp/pg6ggdyDjga7poIbluo/jgaflrprnvqnvvIlcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0g44Kv44Kp44O844K/44OL44Kq44Oz44OH44O844K/5qC857SN55So44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSg0KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kv44Kp44O844K/44OL44Kq44Oz44KS5Yid5pyf5YyW44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gZGVzdCAtIOWIneacn+WMluOBmeOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxRdG4+fSDntZDmnpzjga7jgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlkZW50aXR5KGRlc3Qpe1xyXG4gICAgICAgIGRlc3RbMF0gPSAwOyBkZXN0WzFdID0gMDsgZGVzdFsyXSA9IDA7IGRlc3RbM10gPSAxO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlhbHlvbnlm5vlhYPmlbDjgpLnlJ/miJDjgZfjgabov5TjgZnvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4gLSDlhYPjgajjgarjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48UXRuPn0g57WQ5p6c44Gu44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbnZlcnNlKHF0biwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBRdG4uY3JlYXRlKCk7fVxyXG4gICAgICAgIG91dFswXSA9IC1xdG5bMF07XHJcbiAgICAgICAgb3V0WzFdID0gLXF0blsxXTtcclxuICAgICAgICBvdXRbMl0gPSAtcXRuWzJdO1xyXG4gICAgICAgIG91dFszXSA9ICBxdG5bM107XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6Jma6YOo44KS5q2j6KaP5YyW44GX44Gm6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuIC0g5YWD44Go44Gq44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFF0bj59IOe1kOaenOOBruOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKGRlc3Qpe1xyXG4gICAgICAgIGxldCB4ID0gZGVzdFswXSwgeSA9IGRlc3RbMV0sIHogPSBkZXN0WzJdO1xyXG4gICAgICAgIGxldCBsID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgICAgICAgaWYobCA9PT0gMCl7XHJcbiAgICAgICAgICAgIGRlc3RbMF0gPSAwO1xyXG4gICAgICAgICAgICBkZXN0WzFdID0gMDtcclxuICAgICAgICAgICAgZGVzdFsyXSA9IDA7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcclxuICAgICAgICAgICAgZGVzdFswXSA9IHggKiBsO1xyXG4gICAgICAgICAgICBkZXN0WzFdID0geSAqIGw7XHJcbiAgICAgICAgICAgIGRlc3RbMl0gPSB6ICogbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCr+OCqeODvOOCv+ODi+OCquODs+OCkuS5l+eul+OBl+OBn+e1kOaenOOCkui/lOOBme+8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0bjAgLSDkuZfnrpfjgZXjgozjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4xIC0g5LmX566X44GZ44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFF0bj59IOe1kOaenOOBruOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbXVsdGlwbHkocXRuMCwgcXRuMSwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBRdG4uY3JlYXRlKCk7fVxyXG4gICAgICAgIGxldCBheCA9IHF0bjBbMF0sIGF5ID0gcXRuMFsxXSwgYXogPSBxdG4wWzJdLCBhdyA9IHF0bjBbM107XHJcbiAgICAgICAgbGV0IGJ4ID0gcXRuMVswXSwgYnkgPSBxdG4xWzFdLCBieiA9IHF0bjFbMl0sIGJ3ID0gcXRuMVszXTtcclxuICAgICAgICBvdXRbMF0gPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5O1xyXG4gICAgICAgIG91dFsxXSA9IGF5ICogYncgKyBhdyAqIGJ5ICsgYXogKiBieCAtIGF4ICogYno7XHJcbiAgICAgICAgb3V0WzJdID0gYXogKiBidyArIGF3ICogYnogKyBheCAqIGJ5IC0gYXkgKiBieDtcclxuICAgICAgICBvdXRbM10gPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCr+OCqeODvOOCv+ODi+OCquODs+OBq+Wbnui7ouOCkumBqeeUqOOBl+i/lOOBme+8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0g5Zue6Lui44GZ44KL6YeP77yI44Op44K444Ki44Oz77yJXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBheGlzIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTou7jjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48UXRuPn0g57WQ5p6c44Gu44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByb3RhdGUoYW5nbGUsIGF4aXMsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gUXRuLmNyZWF0ZSgpO31cclxuICAgICAgICBsZXQgYSA9IGF4aXNbMF0sIGIgPSBheGlzWzFdLCBjID0gYXhpc1syXTtcclxuICAgICAgICBsZXQgc3EgPSBNYXRoLnNxcnQoYXhpc1swXSAqIGF4aXNbMF0gKyBheGlzWzFdICogYXhpc1sxXSArIGF4aXNbMl0gKiBheGlzWzJdKTtcclxuICAgICAgICBpZihzcSAhPT0gMCl7XHJcbiAgICAgICAgICAgIGxldCBsID0gMSAvIHNxO1xyXG4gICAgICAgICAgICBhICo9IGw7XHJcbiAgICAgICAgICAgIGIgKj0gbDtcclxuICAgICAgICAgICAgYyAqPSBsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcyA9IE1hdGguc2luKGFuZ2xlICogMC41KTtcclxuICAgICAgICBvdXRbMF0gPSBhICogcztcclxuICAgICAgICBvdXRbMV0gPSBiICogcztcclxuICAgICAgICBvdXRbMl0gPSBjICogcztcclxuICAgICAgICBvdXRbM10gPSBNYXRoLmNvcyhhbmdsZSAqIDAuNSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44OZ44Kv44OI44Or44Gr44Kv44Kp44O844K/44OL44Kq44Oz44KS6YGp55So44GX6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSB2ZWMgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0biAtIOOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gW2Rlc3RdIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fSDntZDmnpzjga7jg5njgq/jg4jjg6tcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRvVmVjSUlJKHZlYywgcXRuLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IFswLjAsIDAuMCwgMC4wXTt9XHJcbiAgICAgICAgbGV0IHFwID0gUXRuLmNyZWF0ZSgpO1xyXG4gICAgICAgIGxldCBxcSA9IFF0bi5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgcXIgPSBRdG4uY3JlYXRlKCk7XHJcbiAgICAgICAgUXRuLmludmVyc2UocXRuLCBxcik7XHJcbiAgICAgICAgcXBbMF0gPSB2ZWNbMF07XHJcbiAgICAgICAgcXBbMV0gPSB2ZWNbMV07XHJcbiAgICAgICAgcXBbMl0gPSB2ZWNbMl07XHJcbiAgICAgICAgUXRuLm11bHRpcGx5KHFyLCBxcCwgcXEpO1xyXG4gICAgICAgIFF0bi5tdWx0aXBseShxcSwgcXRuLCBxcik7XHJcbiAgICAgICAgb3V0WzBdID0gcXJbMF07XHJcbiAgICAgICAgb3V0WzFdID0gcXJbMV07XHJcbiAgICAgICAgb3V0WzJdID0gcXJbMl07XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogNHg0IOihjOWIl+OBq+OCr+OCqeODvOOCv+ODi+OCquODs+OCkumBqeeUqOOBl+i/lOOBme+8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0biAtIOOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSA0eDQg6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRvTWF0SVYocXRuLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCk7fVxyXG4gICAgICAgIGxldCB4ID0gcXRuWzBdLCB5ID0gcXRuWzFdLCB6ID0gcXRuWzJdLCB3ID0gcXRuWzNdO1xyXG4gICAgICAgIGxldCB4MiA9IHggKyB4LCB5MiA9IHkgKyB5LCB6MiA9IHogKyB6O1xyXG4gICAgICAgIGxldCB4eCA9IHggKiB4MiwgeHkgPSB4ICogeTIsIHh6ID0geCAqIHoyO1xyXG4gICAgICAgIGxldCB5eSA9IHkgKiB5MiwgeXogPSB5ICogejIsIHp6ID0geiAqIHoyO1xyXG4gICAgICAgIGxldCB3eCA9IHcgKiB4Miwgd3kgPSB3ICogeTIsIHd6ID0gdyAqIHoyO1xyXG4gICAgICAgIG91dFswXSAgPSAxIC0gKHl5ICsgenopO1xyXG4gICAgICAgIG91dFsxXSAgPSB4eSAtIHd6O1xyXG4gICAgICAgIG91dFsyXSAgPSB4eiArIHd5O1xyXG4gICAgICAgIG91dFszXSAgPSAwO1xyXG4gICAgICAgIG91dFs0XSAgPSB4eSArIHd6O1xyXG4gICAgICAgIG91dFs1XSAgPSAxIC0gKHh4ICsgenopO1xyXG4gICAgICAgIG91dFs2XSAgPSB5eiAtIHd4O1xyXG4gICAgICAgIG91dFs3XSAgPSAwO1xyXG4gICAgICAgIG91dFs4XSAgPSB4eiAtIHd5O1xyXG4gICAgICAgIG91dFs5XSAgPSB5eiArIHd4O1xyXG4gICAgICAgIG91dFsxMF0gPSAxIC0gKHh4ICsgeXkpO1xyXG4gICAgICAgIG91dFsxMV0gPSAwO1xyXG4gICAgICAgIG91dFsxMl0gPSAwO1xyXG4gICAgICAgIG91dFsxM10gPSAwO1xyXG4gICAgICAgIG91dFsxNF0gPSAwO1xyXG4gICAgICAgIG91dFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu44Kv44Kp44O844K/44OL44Kq44Oz44Gu55CD6Z2i57ea5b2i6KOc6ZaT44KS6KGM44Gj44Gf57WQ5p6c44KS6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuMCAtIOOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0bjEgLSDjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIC0g6KOc6ZaT5L+C5pWw77yIMC4wIOOBi+OCiSAxLjAg44Gn5oyH5a6a77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFF0bj59IOe1kOaenOOBruOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2xlcnAocXRuMCwgcXRuMSwgdGltZSwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBRdG4uY3JlYXRlKCk7fVxyXG4gICAgICAgIGxldCBodCA9IHF0bjBbMF0gKiBxdG4xWzBdICsgcXRuMFsxXSAqIHF0bjFbMV0gKyBxdG4wWzJdICogcXRuMVsyXSArIHF0bjBbM10gKiBxdG4xWzNdO1xyXG4gICAgICAgIGxldCBocyA9IDEuMCAtIGh0ICogaHQ7XHJcbiAgICAgICAgaWYoaHMgPD0gMC4wKXtcclxuICAgICAgICAgICAgb3V0WzBdID0gcXRuMFswXTtcclxuICAgICAgICAgICAgb3V0WzFdID0gcXRuMFsxXTtcclxuICAgICAgICAgICAgb3V0WzJdID0gcXRuMFsyXTtcclxuICAgICAgICAgICAgb3V0WzNdID0gcXRuMFszXTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgaHMgPSBNYXRoLnNxcnQoaHMpO1xyXG4gICAgICAgICAgICBpZihNYXRoLmFicyhocykgPCAwLjAwMDEpe1xyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gKHF0bjBbMF0gKiAwLjUgKyBxdG4xWzBdICogMC41KTtcclxuICAgICAgICAgICAgICAgIG91dFsxXSA9IChxdG4wWzFdICogMC41ICsgcXRuMVsxXSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMl0gPSAocXRuMFsyXSAqIDAuNSArIHF0bjFbMl0gKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gKHF0bjBbM10gKiAwLjUgKyBxdG4xWzNdICogMC41KTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGggPSBNYXRoLmFjb3MoaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHB0ID0gcGggKiB0aW1lO1xyXG4gICAgICAgICAgICAgICAgbGV0IHQwID0gTWF0aC5zaW4ocGggLSBwdCkgLyBocztcclxuICAgICAgICAgICAgICAgIGxldCB0MSA9IE1hdGguc2luKHB0KSAvIGhzO1xyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gcXRuMFswXSAqIHQwICsgcXRuMVswXSAqIHQxO1xyXG4gICAgICAgICAgICAgICAgb3V0WzFdID0gcXRuMFsxXSAqIHQwICsgcXRuMVsxXSAqIHQxO1xyXG4gICAgICAgICAgICAgICAgb3V0WzJdID0gcXRuMFsyXSAqIHQwICsgcXRuMVsyXSAqIHQxO1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gcXRuMFszXSAqIHQwICsgcXRuMVszXSAqIHQxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzTWF0aC5qcyIsIlxyXG4vKipcclxuICogZ2wzTWVzaFxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsM01lc2gge1xyXG4gICAgLyoqXHJcbiAgICAgKiDmnb/jg53jg6rjgrTjg7Pjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIOadv+ODneODquOCtOODs+OBruS4gOi+uuOBruW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOadv+ODneODquOCtOODs+OBruS4gOi+uuOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5pcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgcGxhbmVEYXRhID0gZ2wzLk1lc2gucGxhbmUoMi4wLCAyLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHBsYW5lKHdpZHRoLCBoZWlnaHQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgdywgaDtcclxuICAgICAgICB3ID0gd2lkdGggLyAyO1xyXG4gICAgICAgIGggPSBoZWlnaHQgLyAyO1xyXG4gICAgICAgIGlmKGNvbG9yKXtcclxuICAgICAgICAgICAgdGMgPSBjb2xvcjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGMgPSBbMS4wLCAxLjAsIDEuMCwgMS4wXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBvcyA9IFtcclxuICAgICAgICAgICAgLXcsICBoLCAgMC4wLFxyXG4gICAgICAgICAgICAgdywgIGgsICAwLjAsXHJcbiAgICAgICAgICAgIC13LCAtaCwgIDAuMCxcclxuICAgICAgICAgICAgIHcsIC1oLCAgMC4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgbm9yID0gW1xyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgY29sID0gW1xyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IHN0ICA9IFtcclxuICAgICAgICAgICAgMC4wLCAwLjAsXHJcbiAgICAgICAgICAgIDEuMCwgMC4wLFxyXG4gICAgICAgICAgICAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMS4wLCAxLjBcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBpZHggPSBbXHJcbiAgICAgICAgICAgIDAsIDEsIDIsXHJcbiAgICAgICAgICAgIDIsIDEsIDNcclxuICAgICAgICBdO1xyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWGhu+8iFhZIOW5s+mdouWxlemWi++8ieOBrumggueCueaDheWgseOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwbGl0IC0g5YaG44Gu5YaG5ZGo44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkIC0g5YaG44Gu5Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3mlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDpoILngrnjgqvjg6njg7xcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHRleENvb3JkIC0g44OG44Kv44K544OB44Oj5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBpbmRleCAtIOmggueCueOCpOODs+ODh+ODg+OCr+OCue+8iGdsLlRSSUFOR0xFU++8iVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxldCBjaXJjbGVEYXRhID0gZ2wzLk1lc2guY2lyY2xlKDY0LCAxLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNpcmNsZShzcGxpdCwgcmFkLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGogPSAwO1xyXG4gICAgICAgIGxldCBwb3MgPSBbXSwgbm9yID0gW10sXHJcbiAgICAgICAgICAgIGNvbCA9IFtdLCBzdCAgPSBbXSwgaWR4ID0gW107XHJcbiAgICAgICAgcG9zLnB1c2goMC4wLCAwLjAsIDAuMCk7XHJcbiAgICAgICAgbm9yLnB1c2goMC4wLCAwLjAsIDEuMCk7XHJcbiAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgIHN0LnB1c2goMC41LCAwLjUpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHNwbGl0OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyLjAgLyBzcGxpdCAqIGk7XHJcbiAgICAgICAgICAgIGxldCByeCA9IE1hdGguY29zKHIpO1xyXG4gICAgICAgICAgICBsZXQgcnkgPSBNYXRoLnNpbihyKTtcclxuICAgICAgICAgICAgcG9zLnB1c2gocnggKiByYWQsIHJ5ICogcmFkLCAwLjApO1xyXG4gICAgICAgICAgICBub3IucHVzaCgwLjAsIDAuMCwgMS4wKTtcclxuICAgICAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgICAgICBzdC5wdXNoKChyeCArIDEuMCkgKiAwLjUsIDEuMCAtIChyeSArIDEuMCkgKiAwLjUpO1xyXG4gICAgICAgICAgICBpZihpID09PSBzcGxpdCAtIDEpe1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2goMCwgaiArIDEsIDEpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKDAsIGogKyAxLCBqICsgMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKytqO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgq3jg6Xjg7zjg5bjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaWRlIC0g5q2j56uL5pa55L2T44Gu5LiA6L6644Gu6ZW344GVXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3miDigLvjgq3jg6Xjg7zjg5bjga7kuK3lv4PjgYvjgonlkITpoILngrnjgavlkJHjgYvjgaPjgabkvLjjgbPjgovjg5njgq/jg4jjg6vjgarjga7jgafms6jmhI9cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgY3ViZURhdGEgPSBnbDMuTWVzaC5jdWJlKDIuMCwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3ViZShzaWRlLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGhzID0gc2lkZSAqIDAuNTtcclxuICAgICAgICBsZXQgcG9zID0gW1xyXG4gICAgICAgICAgICAtaHMsIC1ocywgIGhzLCAgaHMsIC1ocywgIGhzLCAgaHMsICBocywgIGhzLCAtaHMsICBocywgIGhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAtaHMsICBocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsIC1ocywgLWhzLFxyXG4gICAgICAgICAgICAtaHMsICBocywgLWhzLCAtaHMsICBocywgIGhzLCAgaHMsICBocywgIGhzLCAgaHMsICBocywgLWhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgIGhzLCAtaHMsIC1ocywgIGhzLFxyXG4gICAgICAgICAgICAgaHMsIC1ocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsICBocywgIGhzLCAgaHMsIC1ocywgIGhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAtaHMsIC1ocywgIGhzLCAtaHMsICBocywgIGhzLCAtaHMsICBocywgLWhzXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgdiA9IDEuMCAvIE1hdGguc3FydCgzLjApO1xyXG4gICAgICAgIGxldCBub3IgPSBbXHJcbiAgICAgICAgICAgIC12LCAtdiwgIHYsICB2LCAtdiwgIHYsICB2LCAgdiwgIHYsIC12LCAgdiwgIHYsXHJcbiAgICAgICAgICAgIC12LCAtdiwgLXYsIC12LCAgdiwgLXYsICB2LCAgdiwgLXYsICB2LCAtdiwgLXYsXHJcbiAgICAgICAgICAgIC12LCAgdiwgLXYsIC12LCAgdiwgIHYsICB2LCAgdiwgIHYsICB2LCAgdiwgLXYsXHJcbiAgICAgICAgICAgIC12LCAtdiwgLXYsICB2LCAtdiwgLXYsICB2LCAtdiwgIHYsIC12LCAtdiwgIHYsXHJcbiAgICAgICAgICAgICB2LCAtdiwgLXYsICB2LCAgdiwgLXYsICB2LCAgdiwgIHYsICB2LCAtdiwgIHYsXHJcbiAgICAgICAgICAgIC12LCAtdiwgLXYsIC12LCAtdiwgIHYsIC12LCAgdiwgIHYsIC12LCAgdiwgLXZcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBjb2wgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcG9zLmxlbmd0aCAvIDM7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHN0ID0gW1xyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgaWR4ID0gW1xyXG4gICAgICAgICAgICAgMCwgIDEsICAyLCAgMCwgIDIsICAzLFxyXG4gICAgICAgICAgICAgNCwgIDUsICA2LCAgNCwgIDYsICA3LFxyXG4gICAgICAgICAgICAgOCwgIDksIDEwLCAgOCwgMTAsIDExLFxyXG4gICAgICAgICAgICAxMiwgMTMsIDE0LCAxMiwgMTQsIDE1LFxyXG4gICAgICAgICAgICAxNiwgMTcsIDE4LCAxNiwgMTgsIDE5LFxyXG4gICAgICAgICAgICAyMCwgMjEsIDIyLCAyMCwgMjIsIDIzXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuInop5LpjJDjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGxpdCAtIOW6lemdouWGhuOBruWGhuWRqOOBruWIhuWJsuaVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZCAtIOW6lemdouWGhuOBruWNiuW+hFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOS4ieinkumMkOOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5pcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgY29uZURhdGEgPSBnbDMuTWVzaC5jb25lKDY0LCAxLjAsIDIuMCwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29uZShzcGxpdCwgcmFkLCBoZWlnaHQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgaiA9IDA7XHJcbiAgICAgICAgbGV0IGggPSBoZWlnaHQgLyAyLjA7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBwb3MucHVzaCgwLjAsIC1oLCAwLjApO1xyXG4gICAgICAgIG5vci5wdXNoKDAuMCwgLTEuMCwgMC4wKTtcclxuICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgc3QucHVzaCgwLjUsIDAuNSk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDw9IHNwbGl0OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyLjAgLyBzcGxpdCAqIGk7XHJcbiAgICAgICAgICAgIGxldCByeCA9IE1hdGguY29zKHIpO1xyXG4gICAgICAgICAgICBsZXQgcnogPSBNYXRoLnNpbihyKTtcclxuICAgICAgICAgICAgcG9zLnB1c2goXHJcbiAgICAgICAgICAgICAgICByeCAqIHJhZCwgLWgsIHJ6ICogcmFkLFxyXG4gICAgICAgICAgICAgICAgcnggKiByYWQsIC1oLCByeiAqIHJhZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBub3IucHVzaChcclxuICAgICAgICAgICAgICAgIDAuMCwgLTEuMCwgMC4wLFxyXG4gICAgICAgICAgICAgICAgcngsIDAuMCwgcnpcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29sLnB1c2goXHJcbiAgICAgICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHN0LnB1c2goXHJcbiAgICAgICAgICAgICAgICAocnggKyAxLjApICogMC41LCAxLjAgLSAocnogKyAxLjApICogMC41LFxyXG4gICAgICAgICAgICAgICAgKHJ4ICsgMS4wKSAqIDAuNSwgMS4wIC0gKHJ6ICsgMS4wKSAqIDAuNVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZihpICE9PSBzcGxpdCl7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaCgwLCBqICsgMSwgaiArIDMpO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2goaiArIDQsIGogKyAyLCBzcGxpdCAqIDIgKyAzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBqICs9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvcy5wdXNoKDAuMCwgaCwgMC4wKTtcclxuICAgICAgICBub3IucHVzaCgwLjAsIDEuMCwgMC4wKTtcclxuICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgc3QucHVzaCgwLjUsIDAuNSk7XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YaG5p+x44Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BsaXQgLSDlhobmn7Hjga7lhoblkajjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3BSYWQgLSDlhobmn7Hjga7lpKnpnaLjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3R0b21SYWQgLSDlhobmn7Hjga7lupXpnaLjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDlhobmn7Hjga7pq5jjgZVcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IGN5bGluZGVyRGF0YSA9IGdsMy5NZXNoLmN5bGluZGVyKDY0LCAwLjUsIDEuMCwgMi4wLCBbMS4wLCAxLjAsIDEuMCwgMS4wXSk7XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjeWxpbmRlcihzcGxpdCwgdG9wUmFkLCBib3R0b21SYWQsIGhlaWdodCwgY29sb3Ipe1xyXG4gICAgICAgIGxldCBpLCBqID0gMjtcclxuICAgICAgICBsZXQgaCA9IGhlaWdodCAvIDIuMDtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIHBvcy5wdXNoKDAuMCwgaCwgMC4wLCAwLjAsIC1oLCAwLjAsKTtcclxuICAgICAgICBub3IucHVzaCgwLjAsIDEuMCwgMC4wLCAwLjAsIC0xLjAsIDAuMCk7XHJcbiAgICAgICAgY29sLnB1c2goXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgc3QucHVzaCgwLjUsIDAuNSwgMC41LCAwLjUpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8PSBzcGxpdDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLlBJICogMi4wIC8gc3BsaXQgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnggPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJ6ID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIHBvcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgcnggKiB0b3BSYWQsICBoLCByeiAqIHRvcFJhZCxcclxuICAgICAgICAgICAgICAgIHJ4ICogdG9wUmFkLCAgaCwgcnogKiB0b3BSYWQsXHJcbiAgICAgICAgICAgICAgICByeCAqIGJvdHRvbVJhZCwgLWgsIHJ6ICogYm90dG9tUmFkLFxyXG4gICAgICAgICAgICAgICAgcnggKiBib3R0b21SYWQsIC1oLCByeiAqIGJvdHRvbVJhZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBub3IucHVzaChcclxuICAgICAgICAgICAgICAgIDAuMCwgMS4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICByeCwgMC4wLCByeixcclxuICAgICAgICAgICAgICAgIDAuMCwgLTEuMCwgMC4wLFxyXG4gICAgICAgICAgICAgICAgcngsIDAuMCwgcnpcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29sLnB1c2goXHJcbiAgICAgICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBzdC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgKHJ4ICsgMS4wKSAqIDAuNSwgMS4wIC0gKHJ6ICsgMS4wKSAqIDAuNSxcclxuICAgICAgICAgICAgICAgIDEuMCAtIGkgLyBzcGxpdCwgMC4wLFxyXG4gICAgICAgICAgICAgICAgKHJ4ICsgMS4wKSAqIDAuNSwgMS4wIC0gKHJ6ICsgMS4wKSAqIDAuNSxcclxuICAgICAgICAgICAgICAgIDEuMCAtIGkgLyBzcGxpdCwgMS4wXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmKGkgIT09IHNwbGl0KXtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIGogKyA0LCBqLFxyXG4gICAgICAgICAgICAgICAgICAgIDEsIGogKyAyLCBqICsgNixcclxuICAgICAgICAgICAgICAgICAgICBqICsgNSwgaiArIDcsIGogKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGogKyAxLCBqICsgNywgaiArIDNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaiArPSA0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnkIPkvZPjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3cgLSDnkIPjga7nuKbmlrnlkJHvvIjnt6/luqbmlrnlkJHvvInjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW4gLSDnkIPjga7mqKrmlrnlkJHvvIjntYzluqbmlrnlkJHvvInjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWQgLSDnkIPjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IHNwaGVyZURhdGEgPSBnbDMuTWVzaC5zcGhlcmUoNjQsIDY0LCAxLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNwaGVyZShyb3csIGNvbHVtbiwgcmFkLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGo7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPD0gcm93OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgLyByb3cgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnkgPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJyID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8PSBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHggPSByciAqIHJhZCAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCB0eSA9IHJ5ICogcmFkO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR6ID0gcnIgKiByYWQgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgcG9zLnB1c2godHgsIHR5LCB0eik7XHJcbiAgICAgICAgICAgICAgICBub3IucHVzaChyeCwgcnksIHJ6KTtcclxuICAgICAgICAgICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICAgICAgICAgIHN0LnB1c2goMSAtIDEgLyBjb2x1bW4gKiBqLCAxIC8gcm93ICogaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgcm93OyBpKyspe1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IChjb2x1bW4gKyAxKSAqIGkgKyBqO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociwgciArIDEsIHIgKyBjb2x1bW4gKyAyKTtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyBjb2x1bW4gKyAyLCByICsgY29sdW1uICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OI44O844Op44K544Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm93IC0g6Lyq44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sdW1uIC0g44OR44Kk44OX5pat6Z2i44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXJhZCAtIOODkeOCpOODl+aWremdouOBruWNiuW+hFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG9yYWQgLSDjg5HjgqTjg5flhajkvZPjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IHRvcnVzRGF0YSA9IGdsMy5NZXNoLnRvcnVzKDY0LCA2NCwgMC4yNSwgMC43NSwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdG9ydXMocm93LCBjb2x1bW4sIGlyYWQsIG9yYWQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgajtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8PSByb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5QSSAqIDIgLyByb3cgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnIgPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJ5ID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8PSBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHggPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLmNvcyh0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHkgPSByeSAqIGlyYWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHogPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJzID0gMSAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnQgPSAxIC8gcm93ICogaSArIDAuNTtcclxuICAgICAgICAgICAgICAgIGlmKHJ0ID4gMS4wKXtydCAtPSAxLjA7fVxyXG4gICAgICAgICAgICAgICAgcnQgPSAxLjAgLSBydDtcclxuICAgICAgICAgICAgICAgIHBvcy5wdXNoKHR4LCB0eSwgdHopO1xyXG4gICAgICAgICAgICAgICAgbm9yLnB1c2gocngsIHJ5LCByeik7XHJcbiAgICAgICAgICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgICAgICAgICBzdC5wdXNoKHJzLCBydCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgcm93OyBpKyspe1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IChjb2x1bW4gKyAxKSAqIGkgKyBqO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociwgciArIGNvbHVtbiArIDEsIHIgKyAxKTtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKHIgKyBjb2x1bW4gKyAxLCByICsgY29sdW1uICsgMiwgciArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzTWVzaC5qcyIsIlxyXG4vKipcclxuICogZ2wzVXRpbFxyXG4gKiBAY2xhc3MgZ2wzVXRpbFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzVXRpbCB7XHJcbiAgICAvKipcclxuICAgICAqIEhTViDjgqvjg6njg7zjgpLnlJ/miJDjgZfjgabphY3liJfjgafov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoIC0g6Imy55u4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcyAtIOW9qeW6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHYgLSDmmI7luqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhIC0g44Ki44Or44OV44KhXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gr5q2j6KaP5YyW44GX44Gf6Imy44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBoc3ZhKGgsIHMsIHYsIGEpe1xyXG4gICAgICAgIGlmKHMgPiAxIHx8IHYgPiAxIHx8IGEgPiAxKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCB0aCA9IGggJSAzNjA7XHJcbiAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKHRoIC8gNjApO1xyXG4gICAgICAgIGxldCBmID0gdGggLyA2MCAtIGk7XHJcbiAgICAgICAgbGV0IG0gPSB2ICogKDEgLSBzKTtcclxuICAgICAgICBsZXQgbiA9IHYgKiAoMSAtIHMgKiBmKTtcclxuICAgICAgICBsZXQgayA9IHYgKiAoMSAtIHMgKiAoMSAtIGYpKTtcclxuICAgICAgICBsZXQgY29sb3IgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICBpZighcyA+IDAgJiYgIXMgPCAwKXtcclxuICAgICAgICAgICAgY29sb3IucHVzaCh2LCB2LCB2LCBhKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgciA9IG5ldyBBcnJheSh2LCBuLCBtLCBtLCBrLCB2KTtcclxuICAgICAgICAgICAgbGV0IGcgPSBuZXcgQXJyYXkoaywgdiwgdiwgbiwgbSwgbSk7XHJcbiAgICAgICAgICAgIGxldCBiID0gbmV3IEFycmF5KG0sIG0sIGssIHYsIHYsIG4pO1xyXG4gICAgICAgICAgICBjb2xvci5wdXNoKHJbaV0sIGdbaV0sIGJbaV0sIGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqTjg7zjgrjjg7PjgrBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0IC0gMC4wIOOBi+OCiSAxLjAg44Gu5YCkXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOOCpOODvOOCuOODs+OCsOOBl+OBn+e1kOaenFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZWFzZUxpbmVyKHQpe1xyXG4gICAgICAgIHJldHVybiB0IDwgMC41ID8gNCAqIHQgKiB0ICogdCA6ICh0IC0gMSkgKiAoMiAqIHQgLSAyKSAqICgyICogdCAtIDIpICsgMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCpOODvOOCuOODs+OCsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHQgLSAwLjAg44GL44KJIDEuMCDjga7lgKRcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44Kk44O844K444Oz44Kw44GX44Gf57WQ5p6cXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBlYXNlT3V0Q3ViaWModCl7XHJcbiAgICAgICAgcmV0dXJuICh0ID0gdCAvIDEgLSAxKSAqIHQgKiB0ICsgMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCpOODvOOCuOODs+OCsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHQgLSAwLjAg44GL44KJIDEuMCDjga7lgKRcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44Kk44O844K444Oz44Kw44GX44Gf57WQ5p6cXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBlYXNlUXVpbnRpYyh0KXtcclxuICAgICAgICBsZXQgdHMgPSAodCA9IHQgLyAxKSAqIHQ7XHJcbiAgICAgICAgbGV0IHRjID0gdHMgKiB0O1xyXG4gICAgICAgIHJldHVybiAodGMgKiB0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDluqbmlbDms5Xjga7op5LluqbjgYvjgonlvKfluqbms5Xjga7lgKTjgbjlpInmj5vjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWcgLSDluqbmlbDms5Xjga7op5LluqZcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g5byn5bqm5rOV44Gu5YCkXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkZWdUb1JhZChkZWcpe1xyXG4gICAgICAgIHJldHVybiAoZGVnICUgMzYwKSAqIE1hdGguUEkgLyAxODA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotaTpgZPljYrlvoTvvIhrbe+8iVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBFQVJUSF9SQURJVVMoKXtyZXR1cm4gNjM3OC4xMzc7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6LWk6YGT5YaG5ZGo77yIa23vvIlcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgRUFSVEhfQ0lSQ1VNKCl7cmV0dXJuIGdsM1V0aWwuRUFSVEhfUkFESVVTICogTWF0aC5QSSAqIDIuMDt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotaTpgZPlhoblkajjga7ljYrliIbvvIhrbe+8iVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBFQVJUSF9IQUxGX0NJUkNVTSgpe3JldHVybiBnbDNVdGlsLkVBUlRIX1JBRElVUyAqIE1hdGguUEk7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KL5pyA5aSn57ev5bqmXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IEVBUlRIX01BWF9MQVQoKXtyZXR1cm4gODUuMDUxMTI4Nzg7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57WM5bqm44KS5YWD44Gr44Oh44Or44Kr44OI44Or5bqn5qiZ44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9uIC0g57WM5bqmXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+OBiuOBkeOCiyBYXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsb25Ub01lcihsb24pe1xyXG4gICAgICAgIHJldHVybiBnbDNVdGlsLkVBUlRIX1JBRElVUyAqIGdsM1V0aWwuZGVnVG9SYWQobG9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe3r+W6puOCkuWFg+OBq+ODoeODq+OCq+ODiOODq+W6p+aomeOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhdCAtIOe3r+W6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtmbGF0dGVuPTBdIC0g5omB5bmz546HXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+OBiuOBkeOCiyBZXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsYXRUb01lcihsYXQsIGZsYXR0ZW4gPSAwKXtcclxuICAgICAgICBsZXQgZmxhdHRlbmluZyA9IGZsYXR0ZW47XHJcbiAgICAgICAgaWYoaXNOYU4ocGFyc2VGbG9hdChmbGF0dGVuKSkpe1xyXG4gICAgICAgICAgICBmbGF0dGVuaW5nID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNsYW1wID0gMC4wMDAxO1xyXG4gICAgICAgIGlmKGxhdCA+PSA5MCAtIGNsYW1wKXtcclxuICAgICAgICAgICAgbGF0ID0gOTAgLSBjbGFtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYobGF0IDw9IC05MCArIGNsYW1wKXtcclxuICAgICAgICAgICAgbGF0ID0gLTkwICsgY2xhbXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB0ZW1wID0gKDEgLSBmbGF0dGVuaW5nKTtcclxuICAgICAgICBsZXQgZXMgPSAxLjAgLSAodGVtcCAqIHRlbXApO1xyXG4gICAgICAgIGxldCBlY2NlbnQgPSBNYXRoLnNxcnQoZXMpO1xyXG4gICAgICAgIGxldCBwaGkgPSBnbDNVdGlsLmRlZ1RvUmFkKGxhdCk7XHJcbiAgICAgICAgbGV0IHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XHJcbiAgICAgICAgbGV0IGNvbiA9IGVjY2VudCAqIHNpbnBoaTtcclxuICAgICAgICBsZXQgY29tID0gMC41ICogZWNjZW50O1xyXG4gICAgICAgIGNvbiA9IE1hdGgucG93KCgxLjAgLSBjb24pIC8gKDEuMCArIGNvbiksIGNvbSk7XHJcbiAgICAgICAgbGV0IHRzID0gTWF0aC50YW4oMC41ICogKE1hdGguUEkgKiAwLjUgLSBwaGkpKSAvIGNvbjtcclxuICAgICAgICByZXR1cm4gZ2wzVXRpbC5FQVJUSF9SQURJVVMgKiBNYXRoLmxvZyh0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnt6/luqbntYzluqbjgpLjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavlpInmj5vjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb24gLSDntYzluqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXQgLSDnt6/luqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZmxhdHRlbj0wXSAtIOaJgeW5s+eOh1xyXG4gICAgICogQHJldHVybiB7b2JqfVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHggLSDjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavjgYrjgZHjgosgWCDluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB5IC0g44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KLIFkg5bqn5qiZXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsb25MYXRUb01lcihsb24sIGxhdCwgZmxhdHRlbiA9IDApe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IGdsM1V0aWwubG9uVG9NZXIobG9uKSxcclxuICAgICAgICAgICAgeTogZ2wzVXRpbC5sYXRUb01lcihsYXQsIGZsYXR0ZW5pbmcpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODoeODq+OCq+ODiOODq+W6p+aomeOCkue3r+W6pue1jOW6puOBq+WkieaPm+OBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSDjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavjgYrjgZHjgosgWCDluqfmqJlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0g44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KLIFkg5bqn5qiZXHJcbiAgICAgKiBAcmV0dXJuIHtvYmp9XHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbG9uIC0g57WM5bqmXHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbGF0IC0g57ev5bqmXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBtZXJUb0xvbkxhdCh4LCB5KXtcclxuICAgICAgICBsZXQgbG9uID0gKHggLyBnbDNVdGlsLkVBUlRIX0hBTEZfQ0lSQ1VNKSAqIDE4MDtcclxuICAgICAgICBsZXQgbGF0ID0gKHkgLyBnbDNVdGlsLkVBUlRIX0hBTEZfQ0lSQ1VNKSAqIDE4MDtcclxuICAgICAgICBsYXQgPSAxODAgLyBNYXRoLlBJICogKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAobGF0ICogTWF0aC5QSSAvIDE4MCkpIC0gTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvbjogbG9uLFxyXG4gICAgICAgICAgICBsYXQ6IGxhdFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDntYzluqbjgYvjgonjgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLmsYLjgoHjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb24gLSDntYzluqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6b29tIC0g44K644O844Og44Os44OZ44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOe1jOW6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbG9uVG9UaWxlKGxvbiwgem9vbSl7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKGxvbiAvIDE4MCArIDEpICogTWF0aC5wb3coMiwgem9vbSkgLyAyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe3r+W6puOBi+OCieOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCueOCkuaxguOCgeOBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhdCAtIOe3r+W6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpvb20gLSDjgrrjg7zjg6Djg6zjg5njg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g57ev5bqm5pa55ZCR44Gu44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsYXRUb1RpbGUobGF0LCB6b29tKXtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoLU1hdGgubG9nKE1hdGgudGFuKCg0NSArIGxhdCAvIDIpICogTWF0aC5QSSAvIDE4MCkpICsgTWF0aC5QSSkgKiBNYXRoLnBvdygyLCB6b29tKSAvICgyICogTWF0aC5QSSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57ev5bqm57WM5bqm44KS44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K544Gr5aSJ5o+b44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9uIC0g57WM5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGF0IC0g57ev5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gem9vbSAtIOOCuuODvOODoOODrOODmeODq1xyXG4gICAgICogQHJldHVybiB7b2JqfVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxvbiAtIOe1jOW6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxhdCAtIOe3r+W6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbG9uTGF0VG9UaWxlKGxvbiwgbGF0LCB6b29tKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb246IGdsM1V0aWwubG9uVG9UaWxlKGxvbiwgem9vbSksXHJcbiAgICAgICAgICAgIGxhdDogZ2wzVXRpbC5sYXRUb1RpbGUobGF0LCB6b29tKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrnjgYvjgonntYzluqbjgpLmsYLjgoHjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb24gLSDntYzluqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6b29tIC0g44K644O844Og44Os44OZ44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOe1jOW6plxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdGlsZVRvTG9uKGxvbiwgem9vbSl7XHJcbiAgICAgICAgcmV0dXJuIChsb24gLyBNYXRoLnBvdygyLCB6b29tKSkgKiAzNjAgLSAxODA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrnjgYvjgonnt6/luqbjgpLmsYLjgoHjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXQgLSDnt6/luqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6b29tIC0g44K644O844Og44Os44OZ44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOe3r+W6plxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdGlsZVRvTGF0KGxhdCwgem9vbSl7XHJcbiAgICAgICAgbGV0IHkgPSAobGF0IC8gTWF0aC5wb3coMiwgem9vbSkpICogMiAqIE1hdGguUEkgLSBNYXRoLlBJO1xyXG4gICAgICAgIHJldHVybiAyICogTWF0aC5hdGFuKE1hdGgucG93KE1hdGguRSwgLXkpKSAqIDE4MCAvIE1hdGguUEkgLSA5MDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCueOBi+OCiee3r+W6pue1jOW6puOCkuaxguOCgeOBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvbiAtIOe1jOW6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhdCAtIOe3r+W6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpvb20gLSDjgrrjg7zjg6Djg6zjg5njg6tcclxuICAgICAqIEByZXR1cm4ge29ian1cclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb24gLSDntYzluqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsYXQgLSDnt6/luqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRpbGVUb0xvbkxhdChsb24sIGxhdCwgem9vbSl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9uOiBnbDNVdGlsLnRpbGVUb0xvbihsb24sIHpvb20pLFxyXG4gICAgICAgICAgICBsYXQ6IGdsM1V0aWwudGlsZVRvTGF0KGxhdCwgem9vbSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNVdGlsLmpzIiwiXHJcbmltcG9ydCBhdWRpbyBmcm9tICcuL2dsM0F1ZGlvLmpzJztcclxuaW1wb3J0IG1hdGggIGZyb20gJy4vZ2wzTWF0aC5qcyc7XHJcbmltcG9ydCBtZXNoICBmcm9tICcuL2dsM01lc2guanMnO1xyXG5pbXBvcnQgdXRpbCAgZnJvbSAnLi9nbDNVdGlsLmpzJztcclxuaW1wb3J0IGd1aSAgIGZyb20gJy4vZ2wzR3VpLmpzJztcclxuXHJcbi8qKlxyXG4gKiBnbGN1YmljXHJcbiAqIEBjbGFzcyBnbDNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsMyB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHZlcnNpb25cclxuICAgICAgICAgKiBAY29uc3RcclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVkVSU0lPTiA9ICcwLjIuMSc7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGkgKiAyXHJcbiAgICAgICAgICogQGNvbnN0XHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlBJMiA9IDYuMjgzMTg1MzA3MTc5NTg2NDc2OTI1Mjg2NzY2NTU5MDA1NzY7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGlcclxuICAgICAgICAgKiBAY29uc3RcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0MzM4MzI3OTUwMjg4O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBpIC8gMlxyXG4gICAgICAgICAqIEBjb25zdFxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5QSUggPSAxLjU3MDc5NjMyNjc5NDg5NjYxOTIzMTMyMTY5MTYzOTc1MTQ0O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBpIC8gNFxyXG4gICAgICAgICAqIEBjb25zdFxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5QSUgyID0gMC43ODUzOTgxNjMzOTc0NDgzMDk2MTU2NjA4NDU4MTk4NzU3MjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbC5NQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyDjgpLliKnnlKjjgZfjgablvpfjgonjgozjgovjg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4jjga7mnIDlpKfliKnnlKjlj6/og73mlbBcclxuICAgICAgICAgKiBAY29uc3RcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVEVYVFVSRV9VTklUX0NPVU5UID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2xjdWJpYyDjgYzmraPjgZfjgY/liJ3mnJ/ljJbjgZXjgozjgZ/jganjgYbjgYvjga7jg5Xjg6njgrBcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2xjdWJpYyDjgajntJDku5jjgYTjgabjgYTjgosgY2FudmFzIGVsZW1lbnRcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTENhbnZhc0VsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsY3ViaWMg44Go57SQ5LuY44GE44Gm44GE44KLIGNhbnZhcyDjgYvjgonlj5blvpfjgZfjgZ8gV2ViR0wgUmVuZGVyaW5nIENvbnRleHRcclxuICAgICAgICAgKiBAdHlwZSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZ2wgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQg44Go44GX44Gm5Yid5pyf5YyW44GX44Gf44GL44Gp44GG44GL44KS6KGo44GZ55yf5YG95YCkXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2x9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pc1dlYkdMMiA9IGZhbHNlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gj44Gm44GE44KL44OG44Kv44K544OB44Oj5qC857SN55So44Gu6YWN5YiXXHJcbiAgICAgICAgICogQHR5cGUge0FycmF5LjxXZWJHTFRleHR1cmU+fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXMgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdlYkdMIOOBruaLoeW8teapn+iDveOCkuagvOe0jeOBmeOCi+OCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5leHQgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbDNBdWRpbyDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAdHlwZSB7Z2wzQXVkaW99XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5BdWRpbyA9IGF1ZGlvO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsM01lc2gg44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICogQHR5cGUge2dsM01lc2h9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5NZXNoID0gbWVzaDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbDNVdGlsIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEB0eXBlIHtnbDNVdGlsfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVXRpbCA9IHV0aWw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2wzR3VpIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEB0eXBlIHtnbDNHdWl9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5HdWkgPSBuZXcgZ3VpKCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2wzTWF0aCDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAdHlwZSB7Z2wzTWF0aH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLk1hdGggPSBuZXcgbWF0aCgpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBnbGN1YmljLmpzICVj4peGJWMgOiB2ZXJzaW9uICVjJyArIHRoaXMuVkVSU0lPTiwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IHJveWFsYmx1ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2xjdWJpYyDjgpLliJ3mnJ/ljJbjgZnjgotcclxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8c3RyaW5nfSBjYW52YXMgLSBjYW52YXMgZWxlbWVudCDjgYsgY2FudmFzIOOBq+S7mOS4juOBleOCjOOBpuOBhOOCiyBJRCDmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbml0T3B0aW9ucyAtIGNhbnZhcy5nZXRDb250ZXh0IOOBp+esrOS6jOW8leaVsOOBq+a4oeOBmeWIneacn+WMluaZguOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHBhcmFtIHtib29sfSB3ZWJnbDJNb2RlIC0gd2ViZ2wyIOOCkuacieWKueWMluOBmeOCi+WgtOWQiCB0cnVlXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDliJ3mnJ/ljJbjgYzmraPjgZfjgY/ooYzjgo/jgozjgZ/jgYvjganjgYbjgYvjgpLooajjgZnnnJ/lgb3lgKRcclxuICAgICAqL1xyXG4gICAgaW5pdChjYW52YXMsIGluaXRPcHRpb25zLCB3ZWJnbDJNb2RlKXtcclxuICAgICAgICBsZXQgb3B0ID0gaW5pdE9wdGlvbnMgfHwge307XHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgIGlmKGNhbnZhcyA9PSBudWxsKXtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIGlmKGNhbnZhcyBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KXtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgfWVsc2UgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGNhbnZhcykgPT09ICdbb2JqZWN0IFN0cmluZ10nKXtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmNhbnZhcyA9PSBudWxsKXtyZXR1cm4gZmFsc2U7fVxyXG4gICAgICAgIGlmKHdlYmdsMk1vZGUgPT09IHRydWUpe1xyXG4gICAgICAgICAgICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wyJywgb3B0KTtcclxuICAgICAgICAgICAgdGhpcy5pc1dlYkdMMiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZ2wgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIG9wdCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIG9wdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZ2wgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLlRFWFRVUkVfVU5JVF9DT1VOVCA9IHRoaXMuZ2wuZ2V0UGFyYW1ldGVyKHRoaXMuZ2wuTUFYX0NPTUJJTkVEX1RFWFRVUkVfSU1BR0VfVU5JVFMpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzID0gbmV3IEFycmF5KHRoaXMuVEVYVFVSRV9VTklUX0NPVU5UKTtcclxuICAgICAgICAgICAgdGhpcy5leHQgPSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50SW5kZXhVaW50OiB0aGlzLmdsLmdldEV4dGVuc2lvbignT0VTX2VsZW1lbnRfaW5kZXhfdWludCcpLFxyXG4gICAgICAgICAgICAgICAgdGV4dHVyZUZsb2F0OiB0aGlzLmdsLmdldEV4dGVuc2lvbignT0VTX3RleHR1cmVfZmxvYXQnKSxcclxuICAgICAgICAgICAgICAgIHRleHR1cmVIYWxmRmxvYXQ6IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0JyksXHJcbiAgICAgICAgICAgICAgICBkcmF3QnVmZmVyczogdGhpcy5nbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RyYXdfYnVmZmVycycpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KS44Kv44Oq44Ki44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOOCr+ODquOCouOBmeOCi+iJsu+8iDAuMCB+IDEuMO+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtkZXB0aF0gLSDjgq/jg6rjgqLjgZnjgovmt7HluqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlbmNpbF0gLSDjgq/jg6rjgqLjgZnjgovjgrnjg4bjg7Pjgrfjg6vlgKRcclxuICAgICAqL1xyXG4gICAgc2NlbmVDbGVhcihjb2xvciwgZGVwdGgsIHN0ZW5jaWwpe1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgbGV0IGZsZyA9IGdsLkNPTE9SX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgZ2wuY2xlYXJDb2xvcihjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgaWYoZGVwdGggIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGdsLmNsZWFyRGVwdGgoZGVwdGgpO1xyXG4gICAgICAgICAgICBmbGcgPSBmbGcgfCBnbC5ERVBUSF9CVUZGRVJfQklUO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdGVuY2lsICE9IG51bGwpe1xyXG4gICAgICAgICAgICBnbC5jbGVhclN0ZW5jaWwoc3RlbmNpbCk7XHJcbiAgICAgICAgICAgIGZsZyA9IGZsZyB8IGdsLlNURU5DSUxfQlVGRkVSX0JJVDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wuY2xlYXIoZmxnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODk+ODpeODvOODneODvOODiOOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4XSAtIHjvvIjlt6bnq6/ljp/ngrnvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeV0gLSB577yI5LiL56uv5Y6f54K577yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3dpZHRoXSAtIOaoquOBruW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtoZWlnaHRdIC0g57im44Gu6auY44GVXHJcbiAgICAgKi9cclxuICAgIHNjZW5lVmlldyh4LCB5LCB3aWR0aCwgaGVpZ2h0KXtcclxuICAgICAgICBsZXQgWCA9IHggfHwgMDtcclxuICAgICAgICBsZXQgWSA9IHkgfHwgMDtcclxuICAgICAgICBsZXQgdyA9IHdpZHRoICB8fCB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBsZXQgaCA9IGhlaWdodCB8fCB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5nbC52aWV3cG9ydChYLCBZLCB3LCBoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdsLmRyYXdBcnJheXMg44KS44Kz44O844Or44GZ44KL44Op44OD44OR44O8XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJpbWl0aXZlIC0g44OX44Oq44Of44OG44Kj44OW44K/44Kk44OXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmVydGV4Q291bnQgLSDmj4/nlLvjgZnjgovpoILngrnjga7lgIvmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb2Zmc2V0PTBdIC0g5o+P55S744GZ44KL6aCC54K544Gu6ZaL5aeL44Kq44OV44K744OD44OIXHJcbiAgICAgKi9cclxuICAgIGRyYXdBcnJheXMocHJpbWl0aXZlLCB2ZXJ0ZXhDb3VudCwgb2Zmc2V0ID0gMCl7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHByaW1pdGl2ZSwgb2Zmc2V0LCB2ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnbC5kcmF3RWxlbWVudHMg44KS44Kz44O844Or44GZ44KL44Op44OD44OR44O8XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJpbWl0aXZlIC0g44OX44Oq44Of44OG44Kj44OW44K/44Kk44OXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhMZW5ndGggLSDmj4/nlLvjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgIvmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb2Zmc2V0PTBdIC0g5o+P55S744GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu6ZaL5aeL44Kq44OV44K744OD44OIXHJcbiAgICAgKi9cclxuICAgIGRyYXdFbGVtZW50cyhwcmltaXRpdmUsIGluZGV4TGVuZ3RoLCBvZmZzZXQgPSAwKXtcclxuICAgICAgICB0aGlzLmdsLmRyYXdFbGVtZW50cyhwcmltaXRpdmUsIGluZGV4TGVuZ3RoLCB0aGlzLmdsLlVOU0lHTkVEX1NIT1JULCBvZmZzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2wuZHJhd0VsZW1lbnRzIOOCkuOCs+ODvOODq+OBmeOCi+ODqeODg+ODkeODvO+8iGdsLlVOU0lHTkVEX0lOVO+8iSDigLvopoHmi6HlvLXmqZ/og73vvIhXZWJHTCAxLjDvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmltaXRpdmUgLSDjg5fjg6rjg5/jg4bjgqPjg5bjgr/jgqTjg5dcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleExlbmd0aCAtIOaPj+eUu+OBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBruWAi+aVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvZmZzZXQ9MF0gLSDmj4/nlLvjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7plovlp4vjgqrjg5Xjgrvjg4Pjg4hcclxuICAgICAqL1xyXG4gICAgZHJhd0VsZW1lbnRzSW50KHByaW1pdGl2ZSwgaW5kZXhMZW5ndGgsIG9mZnNldCA9IDApe1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHByaW1pdGl2ZSwgaW5kZXhMZW5ndGgsIHRoaXMuZ2wuVU5TSUdORURfSU5ULCBvZmZzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVkJP77yIVmVydGV4IEJ1ZmZlciBPYmplY3TvvInjgpLnlJ/miJDjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGRhdGEgLSDpoILngrnmg4XloLHjgpLmoLzntI3jgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge1dlYkdMQnVmZmVyfSDnlJ/miJDjgZfjgZ/poILngrnjg5Djg4Pjg5XjgqFcclxuICAgICAqL1xyXG4gICAgY3JlYXRlVmJvKGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGEgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgdmJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZibyk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGRhdGEpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiB2Ym87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJQk/vvIhJbmRleCBCdWZmZXIgT2JqZWN077yJ44KS55Sf5oiQ44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBkYXRhIC0g44Kk44Oz44OH44OD44Kv44K55oOF5aCx44KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTEJ1ZmZlcn0g55Sf5oiQ44GX44Gf44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44KhXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUlibyhkYXRhKXtcclxuICAgICAgICBpZihkYXRhID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGlibyA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGlibyk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBJbnQxNkFycmF5KGRhdGEpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGlibztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIElCT++8iEluZGV4IEJ1ZmZlciBPYmplY3TvvInjgpLnlJ/miJDjgZfjgabov5TjgZnvvIhnbC5VTlNJR05FRF9JTlTvvIkg4oC76KaB5ouh5by15qmf6IO977yIV2ViR0wgMS4w77yJXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBkYXRhIC0g44Kk44Oz44OH44OD44Kv44K55oOF5aCx44KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTEJ1ZmZlcn0g55Sf5oiQ44GX44Gf44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44KhXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUlib0ludChkYXRhKXtcclxuICAgICAgICBpZihkYXRhID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGlibyA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGlibyk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBVaW50MzJBcnJheShkYXRhKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiBpYm87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5XjgqHjgqTjg6vjgpLlhYPjgavjg4bjgq/jgrnjg4Hjg6PjgpLnlJ/miJDjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2UgLSDjg5XjgqHjgqTjg6vjg5HjgrlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBnbGN1YmljIOOBjOWGhemDqOeahOOBq+aMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCuSDigLvpnZ7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4hcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0g55S75YOP44Gu44Ot44O844OJ44GM5a6M5LqG44GX44OG44Kv44K544OB44Oj44KS55Sf5oiQ44GX44Gf5b6M44Gr5ZG844Gw44KM44KL44Kz44O844Or44OQ44OD44KvXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVRleHR1cmVGcm9tRmlsZShzb3VyY2UsIG51bWJlciwgY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKHNvdXJjZSA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICAgICAgbGV0IHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIG51bWJlcik7XHJcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleCk7XHJcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgaW1nKTtcclxuICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IHRleDtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZmlsZSBsb2FkZWQ6ICVjJyArIHNvdXJjZSwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgICAgICAgICAgaWYoY2FsbGJhY2sgIT0gbnVsbCl7Y2FsbGJhY2sobnVtYmVyKTt9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kq44OW44K444Kn44Kv44OI44KS5YWD44Gr44OG44Kv44K544OB44Oj44KS55Sf5oiQ44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IC0g44Ot44O844OJ5riI44G/44GuIEltYWdlIOOCquODluOCuOOCp+OCr+ODiOOChCBDYW52YXMg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrkg4oC76Z2e44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVRleHR1cmVGcm9tT2JqZWN0KG9iamVjdCwgbnVtYmVyKXtcclxuICAgICAgICBpZihvYmplY3QgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGxldCB0ZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleCk7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBvYmplY3QpO1xyXG4gICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gdGV4O1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBvYmplY3QgYXR0YWNoZWQnLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55S75YOP44KS5YWD44Gr44Kt44Ol44O844OW44Oe44OD44OX44OG44Kv44K544OB44Oj44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBzb3VyY2UgLSDjg5XjgqHjgqTjg6vjg5HjgrnjgpLmoLzntI3jgZfjgZ/phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHRhcmdldCAtIOOCreODpeODvOODluODnuODg+ODl+ODhuOCr+OCueODgeODo+OBq+ioreWumuOBmeOCi+OCv+ODvOOCsuODg+ODiOOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSDnlLvlg4/jga7jg63jg7zjg4njgYzlrozkuobjgZfjg4bjgq/jgrnjg4Hjg6PjgpLnlJ/miJDjgZfjgZ/lvozjgavlkbzjgbDjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAqL1xyXG4gICAgY3JlYXRlVGV4dHVyZUN1YmVGcm9tRmlsZShzb3VyY2UsIHRhcmdldCwgbnVtYmVyLCBjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoc291cmNlID09IG51bGwgfHwgdGFyZ2V0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGNJbWcgPSBbXTtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY0ltZ1tpXSA9IHtpbWFnZTogbmV3IEltYWdlKCksIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgICAgICBjSW1nW2ldLmltYWdlLm9ubG9hZCA9ICgoaW5kZXgpID0+IHtyZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY0ltZ1tpbmRleF0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmKGNJbWcubGVuZ3RoID09PSA2KXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY0ltZy5tYXAoKHYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGYgJiYgdi5sb2FkZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZiA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCB0ZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgc291cmNlLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0W2pdLCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBjSW1nW2pdLmltYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFX0NVQkVfTUFQKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gdGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfQ1VCRV9NQVA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmaWxlIGxvYWRlZDogJWMnICsgc291cmNlWzBdICsgJy4uLicsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrICE9IG51bGwpe2NhbGxiYWNrKG51bWJlcik7fVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTt9KShpKTtcclxuICAgICAgICAgICAgY0ltZ1tpXS5pbWFnZS5zcmMgPSBzb3VyY2VbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2xjdWJpYyDjgYzmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrnjgajjg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4jjgpLmjIflrprjgZfjgabjg4bjgq/jgrnjg4Hjg6PjgpLjg5DjgqTjg7Pjg4njgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB1bml0IC0g44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgYmluZFRleHR1cmUodW5pdCwgbnVtYmVyKXtcclxuICAgICAgICBpZih0aGlzLnRleHR1cmVzW251bWJlcl0gPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmdsLmFjdGl2ZVRleHR1cmUodGhpcy5nbC5URVhUVVJFMCArIHVuaXQpO1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUsIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdsY3ViaWMg44GM5oyB44Gk6YWN5YiX5YaF44Gu44OG44Kv44K544OB44Oj55So55S75YOP44GM5YWo44Gm44Ot44O844OJ5riI44G/44GL44Gp44GG44GL56K66KqN44GZ44KLXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDjg63jg7zjg4njgYzlrozkuobjgZfjgabjgYTjgovjgYvjganjgYbjgYvjga7jg5Xjg6njgrBcclxuICAgICAqL1xyXG4gICAgaXNUZXh0dXJlTG9hZGVkKCl7XHJcbiAgICAgICAgbGV0IGksIGosIGYsIGc7XHJcbiAgICAgICAgZiA9IHRydWU7IGcgPSBmYWxzZTtcclxuICAgICAgICBmb3IoaSA9IDAsIGogPSB0aGlzLnRleHR1cmVzLmxlbmd0aDsgaSA8IGo7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGV4dHVyZXNbaV0gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGYgPSBmICYmIHRoaXMudGV4dHVyZXNbaV0ubG9hZGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGcpe3JldHVybiBmO31lbHNle3JldHVybiBmYWxzZTt9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgavjg4bjgq/jgrnjg4Hjg6PjgpLoqK3lrprjgZfjgabjgqrjg5bjgrjjgqfjgq/jg4jjgajjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBruaoquW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSDnlJ/miJDjgZfjgZ/lkITnqK7jgqrjg5bjgrjjgqfjgq/jg4jjga/jg6njg4Pjg5fjgZfjgabov5TljbTjgZnjgotcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xGcmFtZWJ1ZmZlcn0gZnJhbWVidWZmZXIgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xSZW5kZXJidWZmZXJ9IGRlcHRoUmVuZGVyQnVmZmVyIC0g5rex5bqm44OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44Os44Oz44OA44O844OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMVGV4dHVyZX0gdGV4dHVyZSAtIOOCq+ODqeODvOODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODhuOCr+OCueODgeODo1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVGcmFtZWJ1ZmZlcih3aWR0aCwgaGVpZ2h0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgbGV0IGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lQnVmZmVyKTtcclxuICAgICAgICBsZXQgZGVwdGhSZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGxldCBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBmVGV4dHVyZSk7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlLCAwKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IGZUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmcmFtZWJ1ZmZlciBjcmVhdGVkJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhSZW5kZXJidWZmZXI6IGRlcHRoUmVuZGVyQnVmZmVyLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjgpLnlJ/miJDjgZfjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgavjg4bjgq/jgrnjg4Hjg6PjgpLoqK3lrprjgIHjgrnjg4bjg7Pjgrfjg6vmnInlirnjgafjgqrjg5bjgrjjgqfjgq/jg4jjgajjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBruaoquW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSDnlJ/miJDjgZfjgZ/lkITnqK7jgqrjg5bjgrjjgqfjgq/jg4jjga/jg6njg4Pjg5fjgZfjgabov5TljbTjgZnjgotcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xGcmFtZWJ1ZmZlcn0gZnJhbWVidWZmZXIgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xSZW5kZXJidWZmZXJ9IGRlcHRoU3RlbmNpbFJlbmRlcmJ1ZmZlciAtIOa3seW6puODkOODg+ODleOCoeWFvOOCueODhuODs+OCt+ODq+ODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODrOODs+ODgOODvOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFRleHR1cmV9IHRleHR1cmUgLSDjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg4bjgq/jgrnjg4Hjg6NcclxuICAgICAqL1xyXG4gICAgY3JlYXRlRnJhbWVidWZmZXJTdGVuY2lsKHdpZHRoLCBoZWlnaHQsIG51bWJlcil7XHJcbiAgICAgICAgaWYod2lkdGggPT0gbnVsbCB8fCBoZWlnaHQgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICBsZXQgZnJhbWVCdWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVCdWZmZXIpO1xyXG4gICAgICAgIGxldCBkZXB0aFN0ZW5jaWxSZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhTdGVuY2lsUmVuZGVyQnVmZmVyKTtcclxuICAgICAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfU1RFTkNJTCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX1NURU5DSUxfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCBkZXB0aFN0ZW5jaWxSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGxldCBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBmVGV4dHVyZSk7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlLCAwKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IGZUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmcmFtZWJ1ZmZlciBjcmVhdGVkIChlbmFibGUgc3RlbmNpbCknLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIHJldHVybiB7ZnJhbWVidWZmZXI6IGZyYW1lQnVmZmVyLCBkZXB0aFN0ZW5jaWxSZW5kZXJidWZmZXI6IGRlcHRoU3RlbmNpbFJlbmRlckJ1ZmZlciwgdGV4dHVyZTogZlRleHR1cmV9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Kr44Op44O844OQ44OD44OV44Kh44Gr5rWu5YuV5bCP5pWw54K544OG44Kv44K544OB44Oj44KS6Kit5a6a44GX44Gm44Kq44OW44K444Kn44Kv44OI44Go44GX44Gm6L+U44GZIOKAu+imgeaLoeW8teapn+iDve+8iFdlYkdMIDEuMO+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu5qiq5bmFXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu6auY44GVXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrkg4oC76Z2e44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IOeUn+aIkOOBl+OBn+WQhOeoruOCquODluOCuOOCp+OCr+ODiOOBr+ODqeODg+ODl+OBl+OBpui/lOWNtOOBmeOCi1xyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTEZyYW1lYnVmZmVyfSBmcmFtZWJ1ZmZlciAtIOODleODrOODvOODoOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFJlbmRlcmJ1ZmZlcn0gZGVwdGhSZW5kZXJCdWZmZXIgLSDmt7Hluqbjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg6zjg7Pjg4Djg7zjg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xUZXh0dXJlfSB0ZXh0dXJlIC0g44Kr44Op44O844OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44OG44Kv44K544OB44OjXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUZyYW1lYnVmZmVyRmxvYXQod2lkdGgsIGhlaWdodCwgbnVtYmVyKXtcclxuICAgICAgICBpZih3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGlmKHRoaXMuZXh0ID09IG51bGwgfHwgKHRoaXMuZXh0LnRleHR1cmVGbG9hdCA9PSBudWxsICYmIHRoaXMuZXh0LnRleHR1cmVIYWxmRmxvYXQgPT0gbnVsbCkpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmxvYXQgdGV4dHVyZSBub3Qgc3VwcG9ydCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgbGV0IGZsZyA9ICh0aGlzLmV4dC50ZXh0dXJlRmxvYXQgIT0gbnVsbCkgPyBnbC5GTE9BVCA6IHRoaXMuZXh0LnRleHR1cmVIYWxmRmxvYXQuSEFMRl9GTE9BVF9PRVM7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGxldCBmcmFtZUJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZUJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGZUZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBudW1iZXIpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlKTtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIDAsIGdsLlJHQkEsIGZsZywgbnVsbCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLk5FQVJFU1QpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5ORUFSRVNUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIGZUZXh0dXJlLCAwKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gZlRleHR1cmU7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZyYW1lYnVmZmVyIGNyZWF0ZWQgKGVuYWJsZSBmbG9hdCknLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIHJldHVybiB7ZnJhbWVidWZmZXI6IGZyYW1lQnVmZmVyLCBkZXB0aFJlbmRlcmJ1ZmZlcjogbnVsbCwgdGV4dHVyZTogZlRleHR1cmV9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Kr44Op44O844OQ44OD44OV44Kh44Gr44Kt44Ol44O844OW44OG44Kv44K544OB44Oj44KS6Kit5a6a44GX44Gm44Kq44OW44K444Kn44Kv44OI44Go44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7mqKrluYVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7pq5jjgZVcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IHRhcmdldCAtIOOCreODpeODvOODluODnuODg+ODl+ODhuOCr+OCueODgeODo+OBq+ioreWumuOBmeOCi+OCv+ODvOOCsuODg+ODiOOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSDnlJ/miJDjgZfjgZ/lkITnqK7jgqrjg5bjgrjjgqfjgq/jg4jjga/jg6njg4Pjg5fjgZfjgabov5TljbTjgZnjgotcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xGcmFtZWJ1ZmZlcn0gZnJhbWVidWZmZXIgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xSZW5kZXJidWZmZXJ9IGRlcHRoUmVuZGVyQnVmZmVyIC0g5rex5bqm44OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44Os44Oz44OA44O844OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMVGV4dHVyZX0gdGV4dHVyZSAtIOOCq+ODqeODvOODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODhuOCr+OCueODgeODo1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVGcmFtZWJ1ZmZlckN1YmUod2lkdGgsIGhlaWdodCwgdGFyZ2V0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwgfHwgdGFyZ2V0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgbGV0IGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lQnVmZmVyKTtcclxuICAgICAgICBsZXQgZGVwdGhSZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhSZW5kZXJCdWZmZXIpO1xyXG4gICAgICAgIGxldCBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBmVGV4dHVyZSk7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRhcmdldC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQodGFyZ2V0W2ldLCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSBmVGV4dHVyZTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfQ1VCRV9NQVA7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZnJhbWVidWZmZXIgY3ViZSBjcmVhdGVkJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhSZW5kZXJidWZmZXI6IGRlcHRoUmVuZGVyQnVmZmVyLCB0ZXh0dXJlOiBmVGV4dHVyZX07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIVE1MIOWGheOBq+WtmOWcqOOBmeOCiyBJRCDmloflrZfliJfjgYvjgokgc2NyaXB0IOOCv+OCsOOCkuWPgueFp+OBl+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZzSWQgLSDpoILngrnjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrnjgYzoqJjov7DjgZXjgozjgZ8gc2NyaXB0IOOCv+OCsOOBriBJRCDmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmc0lkIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44K944O844K544GM6KiY6L+w44GV44KM44GfIHNjcmlwdCDjgr/jgrDjga4gSUQg5paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBhdHRMb2NhdGlvbiAtIGF0dHJpYnV0ZSDlpInmlbDlkI3jga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGF0dFN0cmlkZSAtIGF0dHJpYnV0ZSDlpInmlbDjga7jgrnjg4jjg6njgqTjg4njga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHVuaUxvY2F0aW9uIC0gdW5pZm9ybSDlpInmlbDlkI3jga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHVuaVR5cGUgLSB1bmlmb3JtIOWkieaVsOabtOaWsOODoeOCveODg+ODieOBruWQjeWJjeOCkuekuuOBmeaWh+Wtl+WIlyDigLvkvovvvJonbWF0cml4NGZ2J1xyXG4gICAgICogQHJldHVybiB7UHJvZ3JhbU1hbmFnZXJ9IOODl+ODreOCsOODqeODoOODnuODjeODvOOCuOODo+ODvOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtRnJvbUlkKHZzSWQsIGZzSWQsIGF0dExvY2F0aW9uLCBhdHRTdHJpZGUsIHVuaUxvY2F0aW9uLCB1bmlUeXBlKXtcclxuICAgICAgICBpZih0aGlzLmdsID09IG51bGwpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgaTtcclxuICAgICAgICBsZXQgbW5nID0gbmV3IFByb2dyYW1NYW5hZ2VyKHRoaXMuZ2wsIHRoaXMuaXNXZWJHTDIpO1xyXG4gICAgICAgIG1uZy52cyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tSWQodnNJZCk7XHJcbiAgICAgICAgbW5nLmZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21JZChmc0lkKTtcclxuICAgICAgICBtbmcucHJnID0gbW5nLmNyZWF0ZVByb2dyYW0obW5nLnZzLCBtbmcuZnMpO1xyXG4gICAgICAgIGlmKG1uZy5wcmcgPT0gbnVsbCl7cmV0dXJuIG1uZzt9XHJcbiAgICAgICAgbW5nLmF0dEwgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBtbmcuYXR0UyA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IGF0dExvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLmF0dExbaV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKG1uZy5wcmcsIGF0dExvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgbW5nLmF0dFNbaV0gPSBhdHRTdHJpZGVbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlMID0gbmV3IEFycmF5KHVuaUxvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgdW5pTG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcudW5pTFtpXSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKG1uZy5wcmcsIHVuaUxvY2F0aW9uW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaVQgPSB1bmlUeXBlO1xyXG4gICAgICAgIG1uZy5sb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIG1uZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODieaWh+Wtl+WIl+OBi+OCieODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZzIC0g6aCC54K544K344Kn44O844OA44Gu44K944O844K5XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZnMgLSDjg5Xjg6njgrDjg6Hjg7Pjg4jjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGF0dExvY2F0aW9uIC0gYXR0cmlidXRlIOWkieaVsOWQjeOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gYXR0U3RyaWRlIC0gYXR0cmlidXRlIOWkieaVsOOBruOCueODiOODqeOCpOODieOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gdW5pTG9jYXRpb24gLSB1bmlmb3JtIOWkieaVsOWQjeOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gdW5pVHlwZSAtIHVuaWZvcm0g5aSJ5pWw5pu05paw44Oh44K944OD44OJ44Gu5ZCN5YmN44KS56S644GZ5paH5a2X5YiXIOKAu+S+i++8midtYXRyaXg0ZnYnXHJcbiAgICAgKiBAcmV0dXJuIHtQcm9ncmFtTWFuYWdlcn0g44OX44Ot44Kw44Op44Og44Oe44ON44O844K444Oj44O844Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVByb2dyYW1Gcm9tU291cmNlKHZzLCBmcywgYXR0TG9jYXRpb24sIGF0dFN0cmlkZSwgdW5pTG9jYXRpb24sIHVuaVR5cGUpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wgPT0gbnVsbCl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBpO1xyXG4gICAgICAgIGxldCBtbmcgPSBuZXcgUHJvZ3JhbU1hbmFnZXIodGhpcy5nbCwgdGhpcy5pc1dlYkdMMik7XHJcbiAgICAgICAgbW5nLnZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2UodnMsIHRoaXMuZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgbW5nLmZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2UoZnMsIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICBtbmcucHJnID0gbW5nLmNyZWF0ZVByb2dyYW0obW5nLnZzLCBtbmcuZnMpO1xyXG4gICAgICAgIGlmKG1uZy5wcmcgPT0gbnVsbCl7cmV0dXJuIG1uZzt9XHJcbiAgICAgICAgbW5nLmF0dEwgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBtbmcuYXR0UyA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IGF0dExvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLmF0dExbaV0gPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKG1uZy5wcmcsIGF0dExvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgbW5nLmF0dFNbaV0gPSBhdHRTdHJpZGVbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlMID0gbmV3IEFycmF5KHVuaUxvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgdW5pTG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBtbmcudW5pTFtpXSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKG1uZy5wcmcsIHVuaUxvY2F0aW9uW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW5nLnVuaVQgPSB1bmlUeXBlO1xyXG4gICAgICAgIG1uZy5sb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIG1uZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleOCoeOCpOODq+OBi+OCieOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODieOCkuWPluW+l+OBl+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZzUGF0aCAtIOmggueCueOCt+OCp+ODvOODgOOBruOCveODvOOCueOBjOiomOi/sOOBleOCjOOBn+ODleOCoeOCpOODq+OBruODkeOCuVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZzUGF0aCAtIOODleODqeOCsOODoeODs+ODiOOCt+OCp+ODvOODgOOBruOCveODvOOCueOBjOiomOi/sOOBleOCjOOBn+ODleOCoeOCpOODq+OBruODkeOCuVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gYXR0TG9jYXRpb24gLSBhdHRyaWJ1dGUg5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBhdHRTdHJpZGUgLSBhdHRyaWJ1dGUg5aSJ5pWw44Gu44K544OI44Op44Kk44OJ44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlMb2NhdGlvbiAtIHVuaWZvcm0g5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlUeXBlIC0gdW5pZm9ybSDlpInmlbDmm7TmlrDjg6Hjgr3jg4Pjg4njga7lkI3liY3jgpLnpLrjgZnmloflrZfliJcg4oC75L6L77yaJ21hdHJpeDRmdidcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0g44K944O844K544Kz44O844OJ44Gu44Ot44O844OJ44GM5a6M5LqG44GX44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQ44GX44Gf5b6M44Gr5ZG844Gw44KM44KL44Kz44O844Or44OQ44OD44KvXHJcbiAgICAgKiBAcmV0dXJuIHtQcm9ncmFtTWFuYWdlcn0g44OX44Ot44Kw44Op44Og44Oe44ON44O844K444Oj44O844Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5IOKAu+ODreODvOODieWJjeOBq+OCpOODs+OCueOCv+ODs+OCueOBr+aIu+OCiuWApOOBqOOBl+OBpui/lOWNtOOBleOCjOOCi1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtRnJvbUZpbGUodnNQYXRoLCBmc1BhdGgsIGF0dExvY2F0aW9uLCBhdHRTdHJpZGUsIHVuaUxvY2F0aW9uLCB1bmlUeXBlLCBjYWxsYmFjayl7XHJcbiAgICAgICAgaWYodGhpcy5nbCA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IG1uZyA9IG5ldyBQcm9ncmFtTWFuYWdlcih0aGlzLmdsLCB0aGlzLmlzV2ViR0wyKTtcclxuICAgICAgICBsZXQgc3JjID0ge1xyXG4gICAgICAgICAgICB2czoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXJsOiB2c1BhdGgsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnM6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFVybDogZnNQYXRoLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBudWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHhocih0aGlzLmdsLCBzcmMudnMpO1xyXG4gICAgICAgIHhocih0aGlzLmdsLCBzcmMuZnMpO1xyXG4gICAgICAgIGZ1bmN0aW9uIHhocihnbCwgdGFyZ2V0KXtcclxuICAgICAgICAgICAgbGV0IHhtbCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4bWwub3BlbignR0VUJywgdGFyZ2V0LnRhcmdldFVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhtbC5zZXRSZXF1ZXN0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICAgICAgeG1sLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBzaGFkZXIgZmlsZSBsb2FkZWQ6ICVjJyArIHRhcmdldC50YXJnZXRVcmwsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNvdXJjZSA9IHhtbC5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgICAgICAgICBsb2FkQ2hlY2soZ2wpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4bWwuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBsb2FkQ2hlY2soZ2wpe1xyXG4gICAgICAgICAgICBpZihzcmMudnMuc291cmNlID09IG51bGwgfHwgc3JjLmZzLnNvdXJjZSA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgICAgICBsZXQgaTtcclxuICAgICAgICAgICAgbW5nLnZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2Uoc3JjLnZzLnNvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgICAgIG1uZy5mcyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKHNyYy5mcy5zb3VyY2UsIGdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgICAgIG1uZy5wcmcgPSBtbmcuY3JlYXRlUHJvZ3JhbShtbmcudnMsIG1uZy5mcyk7XHJcbiAgICAgICAgICAgIGlmKG1uZy5wcmcgPT0gbnVsbCl7cmV0dXJuIG1uZzt9XHJcbiAgICAgICAgICAgIG1uZy5hdHRMID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIG1uZy5hdHRTID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGF0dExvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIG1uZy5hdHRMW2ldID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24obW5nLnByZywgYXR0TG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICAgICAgbW5nLmF0dFNbaV0gPSBhdHRTdHJpZGVbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbW5nLnVuaUwgPSBuZXcgQXJyYXkodW5pTG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgdW5pTG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbW5nLnVuaUxbaV0gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24obW5nLnByZywgdW5pTG9jYXRpb25baV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1uZy51bmlUID0gdW5pVHlwZTtcclxuICAgICAgICAgICAgbW5nLmxvY2F0aW9uQ2hlY2soYXR0TG9jYXRpb24sIHVuaUxvY2F0aW9uKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1uZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODkOODg+ODleOCoeOCquODluOCuOOCp+OCr+ODiOOCkuWJiumZpOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtXZWJHTEJ1ZmZlcn0gYnVmZmVyIC0g5YmK6Zmk44GZ44KL44OQ44OD44OV44Kh44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZUJ1ZmZlcihidWZmZXIpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wuaXNCdWZmZXIoYnVmZmVyKSAhPT0gdHJ1ZSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZUJ1ZmZlcihidWZmZXIpO1xyXG4gICAgICAgIGJ1ZmZlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg4bjgq/jgrnjg4Hjg6Pjgqrjg5bjgrjjgqfjgq/jg4jjgpLliYrpmaTjgZnjgotcclxuICAgICAqIEBwYXJhbSB7V2ViR0xUZXh0dXJlfSB0ZXh0dXJlIC0g5YmK6Zmk44GZ44KL44OG44Kv44K544OB44Oj44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVRleHR1cmUodGV4dHVyZSl7XHJcbiAgICAgICAgaWYodGhpcy5nbC5pc1RleHR1cmUodGV4dHVyZSkgIT09IHRydWUpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVUZXh0dXJlKHRleHR1cmUpO1xyXG4gICAgICAgIHRleHR1cmUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KE44Os44Oz44OA44O844OQ44OD44OV44Kh44KS5YmK6Zmk44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqIC0g44OV44Os44O844Og44OQ44OD44OV44Kh55Sf5oiQ44Oh44K944OD44OJ44GM6L+U44GZ44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZUZyYW1lYnVmZmVyKG9iail7XHJcbiAgICAgICAgaWYob2JqID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgZm9yKGxldCB2IGluIG9iail7XHJcbiAgICAgICAgICAgIGlmKG9ialt2XSBpbnN0YW5jZW9mIFdlYkdMRnJhbWVidWZmZXIgJiYgdGhpcy5nbC5pc0ZyYW1lYnVmZmVyKG9ialt2XSkgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nbC5kZWxldGVGcmFtZWJ1ZmZlcihvYmpbdl0pO1xyXG4gICAgICAgICAgICAgICAgb2JqW3ZdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKG9ialt2XSBpbnN0YW5jZW9mIFdlYkdMUmVuZGVyYnVmZmVyICYmIHRoaXMuZ2wuaXNSZW5kZXJidWZmZXIob2JqW3ZdKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsLmRlbGV0ZVJlbmRlcmJ1ZmZlcihvYmpbdl0pO1xyXG4gICAgICAgICAgICAgICAgb2JqW3ZdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKG9ialt2XSBpbnN0YW5jZW9mIFdlYkdMVGV4dHVyZSAmJiB0aGlzLmdsLmlzVGV4dHVyZShvYmpbdl0pID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2wuZGVsZXRlVGV4dHVyZShvYmpbdl0pO1xyXG4gICAgICAgICAgICAgICAgb2JqW3ZdID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBvYmogPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OI44KS5YmK6Zmk44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSBzaGFkZXIgLSDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZGVsZXRlU2hhZGVyKHNoYWRlcil7XHJcbiAgICAgICAgaWYodGhpcy5nbC5pc1NoYWRlcihzaGFkZXIpICE9PSB0cnVlKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgc2hhZGVyID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkuWJiumZpOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtXZWJHTFByb2dyYW19IHByb2dyYW0gLSDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZGVsZXRlUHJvZ3JhbShwcm9ncmFtKXtcclxuICAgICAgICBpZih0aGlzLmdsLmlzUHJvZ3JhbShwcm9ncmFtKSAhPT0gdHJ1ZSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgcHJvZ3JhbSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9ncmFtTWFuYWdlciDjgq/jg6njgrnjgpLlhoXpg6jjg5fjg63jg5Hjg4bjgqPjgZTjgajliYrpmaTjgZnjgotcclxuICAgICAqIEBwYXJhbSB7UHJvZ3JhbU1hbmFnZXJ9IHByZyAtIFByb2dyYW1NYW5hZ2VyIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICovXHJcbiAgICBkZWxldGVQcm9ncmFtTWFuYWdlcihwcmcpe1xyXG4gICAgICAgIGlmKHByZyA9PSBudWxsIHx8ICEocHJnIGluc3RhbmNlb2YgUHJvZ3JhbU1hbmFnZXIpKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMuZGVsZXRlU2hhZGVyKHByZy52cyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVTaGFkZXIocHJnLmZzKTtcclxuICAgICAgICB0aGlzLmRlbGV0ZVByb2dyYW0ocHJnLnByZyk7XHJcbiAgICAgICAgcHJnLmF0dEwgPSBudWxsO1xyXG4gICAgICAgIHByZy5hdHRTID0gbnVsbDtcclxuICAgICAgICBwcmcudW5pTCA9IG51bGw7XHJcbiAgICAgICAgcHJnLnVuaVQgPSBudWxsO1xyXG4gICAgICAgIHByZyA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgoTjgrfjgqfjg7zjg4DjgpLnrqHnkIbjgZnjgovjg57jg43jg7zjgrjjg6NcclxuICogQGNsYXNzIFByb2dyYW1NYW5hZ2VyXHJcbiAqL1xyXG5jbGFzcyBQcm9ncmFtTWFuYWdlciB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9IGdsIC0g6Ieq6Lqr44GM5bGe44GZ44KLIFdlYkdMIFJlbmRlcmluZyBDb250ZXh0XHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IHdlYmdsMk1vZGUgLSB3ZWJnbDIg44KS5pyJ5Yq55YyW44GX44Gf44GL44Gp44GG44GLXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGdsLCB3ZWJnbDJNb2RlID0gZmFsc2Upe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiHqui6q+OBjOWxnuOBmeOCiyBXZWJHTCBSZW5kZXJpbmcgQ29udGV4dFxyXG4gICAgICAgICAqIEB0eXBlIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nbCA9IGdsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQg44Go44GX44Gm5Yid5pyf5YyW44GX44Gf44GL44Gp44GG44GL44KS6KGo44GZ55yf5YG95YCkXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2x9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pc1dlYkdMMiA9IHdlYmdsMk1vZGU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6aCC54K544K344Kn44O844OA44Gu44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHR5cGUge1dlYkdMU2hhZGVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudnMgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODleODqeOCsOODoeODs+ODiOOCt+OCp+ODvOODgOOBruOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtXZWJHTFNoYWRlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmZzID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAdHlwZSB7V2ViR0xQcm9ncmFtfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucHJnID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjg4jjg6rjg5Pjg6Xjg7zjg4jjg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPG51bWJlcj59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hdHRMID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjg4jjg6rjg5Pjg6Xjg7zjg4jlpInmlbDjga7jgrnjg4jjg6njgqTjg4njga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPG51bWJlcj59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hdHRTID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6bjg4vjg5Xjgqnjg7zjg6Djg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPFdlYkdMVW5pZm9ybUxvY2F0aW9uPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVuaUwgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODpuODi+ODleOCqeODvOODoOWkieaVsOOBruOCv+OCpOODl+OBrumFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVuaVQgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCqOODqeODvOmWoumAo+aDheWgseOCkuagvOe0jeOBmeOCi1xyXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZzIC0g6aCC54K544K344Kn44O844OA44Gu44Kz44Oz44OR44Kk44Or44Ko44Op44O8XHJcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGZzIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44Kz44Oz44OR44Kk44Or44Ko44Op44O8XHJcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHByZyAtIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBruODquODs+OCr+OCqOODqeODvFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSB7dnM6IG51bGwsIGZzOiBudWxsLCBwcmc6IG51bGx9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2NyaXB0IOOCv+OCsOOBriBJRCDjgpLlhYPjgavjgr3jg7zjgrnjgrPjg7zjg4njgpLlj5blvpfjgZfjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHNjcmlwdCDjgr/jgrDjgavku5jliqDjgZXjgozjgZ8gSUQg5paH5a2X5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTFNoYWRlcn0g55Sf5oiQ44GX44Gf44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVNoYWRlckZyb21JZChpZCl7XHJcbiAgICAgICAgbGV0IHNoYWRlcjtcclxuICAgICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICBpZighc2NyaXB0RWxlbWVudCl7cmV0dXJuO31cclxuICAgICAgICBzd2l0Y2goc2NyaXB0RWxlbWVudC50eXBlKXtcclxuICAgICAgICAgICAgY2FzZSAneC1zaGFkZXIveC12ZXJ0ZXgnOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd4LXNoYWRlci94LWZyYWdtZW50JzpcclxuICAgICAgICAgICAgICAgIHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHNvdXJjZSA9IHNjcmlwdEVsZW1lbnQudGV4dDtcclxuICAgICAgICBpZih0aGlzLmlzV2ViR0wyICE9PSB0cnVlKXtcclxuICAgICAgICAgICAgaWYoc291cmNlLnNlYXJjaCgvXiN2ZXJzaW9uIDMwMCBlcy8pID4gLTEpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgY2FuIG5vdCB1c2UgZ2xzbCBlcyAzLjAnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGxldCBlcnIgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcclxuICAgICAgICAgICAgaWYoc2NyaXB0RWxlbWVudC50eXBlID09PSAneC1zaGFkZXIveC12ZXJ0ZXgnKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IudnMgPSBlcnI7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci5mcyA9IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjb21waWxlIGZhaWxlZCBvZiBzaGFkZXI6ICcgKyBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODieOCkuaWh+Wtl+WIl+OBp+W8leaVsOOBi+OCieWPluW+l+OBl+OCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSAtIOOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODiVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHR5cGUgLSBnbC5WRVJURVhfU0hBREVSIG9yIGdsLkZSQUdNRU5UX1NIQURFUlxyXG4gICAgICogQHJldHVybiB7V2ViR0xTaGFkZXJ9IOeUn+aIkOOBl+OBn+OCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVTaGFkZXJGcm9tU291cmNlKHNvdXJjZSwgdHlwZSl7XHJcbiAgICAgICAgbGV0IHNoYWRlcjtcclxuICAgICAgICBzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgdGhpcy5nbC5WRVJURVhfU0hBREVSOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlzV2ViR0wyICE9PSB0cnVlKXtcclxuICAgICAgICAgICAgaWYoc291cmNlLnNlYXJjaCgvXiN2ZXJzaW9uIDMwMCBlcy8pID4gLTEpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgY2FuIG5vdCB1c2UgZ2xzbCBlcyAzLjAnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGxldCBlcnIgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcclxuICAgICAgICAgICAgaWYodHlwZSA9PT0gdGhpcy5nbC5WRVJURVhfU0hBREVSKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IudnMgPSBlcnI7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci5mcyA9IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjb21waWxlIGZhaWxlZCBvZiBzaGFkZXI6ICcgKyBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOCkuW8leaVsOOBi+OCieWPluW+l+OBl+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdnMgLSDpoILngrnjgrfjgqfjg7zjg4Djga7jgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZzIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTFByb2dyYW19IOeUn+aIkOOBl+OBn+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtKHZzLCBmcyl7XHJcbiAgICAgICAgaWYodnMgPT0gbnVsbCB8fCBmcyA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IHByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2cyk7XHJcbiAgICAgICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnMpO1xyXG4gICAgICAgIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIHRoaXMuZ2wuTElOS19TVEFUVVMpKXtcclxuICAgICAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvZ3JhbTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbGV0IGVyciA9IHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IucHJnID0gZXJyO1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBsaW5rIHByb2dyYW0gZmFpbGVkOiAnICsgZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoh6rouqvjga7lhoXpg6jjg5fjg63jg5Hjg4bjgqPjgajjgZfjgablrZjlnKjjgZnjgovjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLoqK3lrprjgZnjgotcclxuICAgICAqL1xyXG4gICAgdXNlUHJvZ3JhbSgpe1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLnByZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWQk8g44GoIElCTyDjgpLjg5DjgqTjg7Pjg4njgZfjgabmnInlirnljJbjgZnjgotcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPFdlYkdMQnVmZmVyPn0gdmJvIC0gVkJPIOOCkuagvOe0jeOBl+OBn+mFjeWIl1xyXG4gICAgICogQHBhcmFtIHtXZWJHTEJ1ZmZlcn0gW2lib10gLSBJQk9cclxuICAgICAqL1xyXG4gICAgc2V0QXR0cmlidXRlKHZibywgaWJvKXtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGZvcihsZXQgaSBpbiB2Ym8pe1xyXG4gICAgICAgICAgICBpZih0aGlzLmF0dExbaV0gPj0gMCl7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmJvW2ldKTtcclxuICAgICAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuYXR0TFtpXSk7XHJcbiAgICAgICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuYXR0TFtpXSwgdGhpcy5hdHRTW2ldLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGlibyAhPSBudWxsKXtnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpYm8pO31cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOBq+ODpuODi+ODleOCqeODvOODoOWkieaVsOOBq+ioreWumuOBmeOCi+WApOOCkuODl+ODg+OCt+ODpeOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bWl4ZWQ+fSBtaXhlZCAtIOODpuODi+ODleOCqeODvOODoOWkieaVsOOBq+ioreWumuOBmeOCi+WApOOCkuagvOe0jeOBl+OBn+mFjeWIl1xyXG4gICAgICovXHJcbiAgICBwdXNoU2hhZGVyKG1peGVkKXtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGogPSB0aGlzLnVuaVQubGVuZ3RoOyBpIDwgajsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHVuaSA9ICd1bmlmb3JtJyArIHRoaXMudW5pVFtpXS5yZXBsYWNlKC9tYXRyaXgvaSwgJ01hdHJpeCcpO1xyXG4gICAgICAgICAgICBpZihnbFt1bmldICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYodW5pLnNlYXJjaCgvTWF0cml4LykgIT09IC0xKXtcclxuICAgICAgICAgICAgICAgICAgICBnbFt1bmldKHRoaXMudW5pTFtpXSwgZmFsc2UsIG1peGVkW2ldKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGdsW3VuaV0odGhpcy51bmlMW2ldLCBtaXhlZFtpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4Ygbm90IHN1cHBvcnQgdW5pZm9ybSB0eXBlOiAnICsgdGhpcy51bmlUW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCouODiOODquODk+ODpeODvOODiOODreOCseODvOOCt+ODp+ODs+OBqOODpuODi+ODleOCqeODvOODoOODreOCseODvOOCt+ODp+ODs+OBjOato+OBl+OBj+WPluW+l+OBp+OBjeOBn+OBi+ODgeOCp+ODg+OCr+OBmeOCi1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gYXR0TG9jYXRpb24gLSDlj5blvpfjgZfjgZ/jgqLjg4jjg6rjg5Pjg6Xjg7zjg4jjg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPFdlYkdMVW5pZm9ybUxvY2F0aW9uPn0gdW5pTG9jYXRpb24gLSDlj5blvpfjgZfjgZ/jg6bjg4vjg5Xjgqnjg7zjg6Djg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgbG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pe1xyXG4gICAgICAgIGxldCBpLCBsO1xyXG4gICAgICAgIGZvcihpID0gMCwgbCA9IGF0dExvY2F0aW9uLmxlbmd0aDsgaSA8IGw7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXR0TFtpXSA9PSBudWxsIHx8IHRoaXMuYXR0TFtpXSA8IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgaW52YWxpZCBhdHRyaWJ1dGUgbG9jYXRpb246ICVjXCInICsgYXR0TG9jYXRpb25baV0gKyAnXCInLCAnY29sb3I6IGNyaW1zb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoaSA9IDAsIGwgPSB1bmlMb2NhdGlvbi5sZW5ndGg7IGkgPCBsOyBpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLnVuaUxbaV0gPT0gbnVsbCB8fCB0aGlzLnVuaUxbaV0gPCAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGludmFsaWQgdW5pZm9ybSBsb2NhdGlvbjogJWNcIicgKyB1bmlMb2NhdGlvbltpXSArICdcIicsICdjb2xvcjogY3JpbXNvbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuZ2wzID0gd2luZG93LmdsMyB8fCBuZXcgZ2wzKCk7XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNDb3JlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==