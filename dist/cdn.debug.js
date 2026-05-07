var AlpineAnime = (function() {
  "use strict";
  const isBrowser = typeof window !== "undefined";
  const win = isBrowser ? (
    /** @type {AnimeJSWindow} */
    /** @type {unknown} */
    window
  ) : null;
  const doc = isBrowser ? document : null;
  const tweenTypes = {
    OBJECT: 0,
    ATTRIBUTE: 1,
    CSS: 2,
    TRANSFORM: 3,
    CSS_VAR: 4
  };
  const valueTypes = {
    NUMBER: 0,
    UNIT: 1,
    COLOR: 2,
    COMPLEX: 3
  };
  const tickModes = {
    NONE: 0,
    AUTO: 1,
    FORCE: 2
  };
  const compositionTypes = {
    replace: 0,
    none: 1,
    blend: 2
  };
  const isRegisteredTargetSymbol = /* @__PURE__ */ Symbol();
  const isDomSymbol = /* @__PURE__ */ Symbol();
  const isSvgSymbol = /* @__PURE__ */ Symbol();
  const transformsSymbol = /* @__PURE__ */ Symbol();
  const proxyTargetSymbol = /* @__PURE__ */ Symbol();
  const minValue = 1e-11;
  const maxValue = 1e12;
  const K = 1e3;
  const maxFps = 240;
  const emptyString = "";
  const cssVarPrefix = "var(";
  const shortTransforms = /* @__PURE__ */ (() => {
    const map = /* @__PURE__ */ new Map();
    map.set("x", "translateX");
    map.set("y", "translateY");
    map.set("z", "translateZ");
    return map;
  })();
  const validTransforms = [
    "perspective",
    "translateX",
    "translateY",
    "translateZ",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY"
  ];
  const transformsFragmentStrings = /* @__PURE__ */ validTransforms.reduce((a, v) => ({ ...a, [v]: v + "(" }), {});
  const noop = () => {
  };
  const validRgbHslRgx = /\)\s*[-.\d]/;
  const hexTestRgx = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i;
  const rgbExecRgx = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i;
  const rgbaExecRgx = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
  const hslExecRgx = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i;
  const hslaExecRgx = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
  const digitWithExponentRgx = /[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi;
  const unitsExecRgx = /^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i;
  const lowerCaseRgx = /([a-z])([A-Z])/g;
  const relativeValuesExecRgx = /(\*=|\+=|-=)/;
  const cssVariableMatchRgx = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
  const defaults = {
    id: null,
    keyframes: null,
    playbackEase: null,
    playbackRate: 1,
    frameRate: maxFps,
    loop: 0,
    reversed: false,
    alternate: false,
    autoplay: true,
    persist: false,
    duration: K,
    delay: 0,
    loopDelay: 0,
    ease: "out(2)",
    composition: compositionTypes.replace,
    modifier: (v) => v,
    onBegin: noop,
    onBeforeUpdate: noop,
    onUpdate: noop,
    onLoop: noop,
    onPause: noop,
    onComplete: noop,
    onRender: noop
  };
  const scope = {
    /** @type {Document|DOMTarget} */
    root: doc
  };
  const globals = {
    /** @type {DefaultsParams} */
    defaults,
    /** @type {Number} */
    precision: 4,
    /** @type {Number} equals 1 in ms mode, 0.001 in s mode */
    timeScale: 1,
    /** @type {Number} */
    tickThreshold: 200
  };
  const globalVersions = { version: "4.4.1", engine: null };
  if (isBrowser) {
    if (!win.AnimeJS) win.AnimeJS = [];
    win.AnimeJS.push(globalVersions);
  }
  const toLowerCase = (str) => str.replace(lowerCaseRgx, "$1-$2").toLowerCase();
  const stringStartsWith = (str, sub) => str.indexOf(sub) === 0;
  const now = Date.now;
  const isArr = Array.isArray;
  const isObj = (a) => a && a.constructor === Object;
  const isNum = (a) => typeof a === "number" && !isNaN(a);
  const isStr = (a) => typeof a === "string";
  const isFnc = (a) => typeof a === "function";
  const isUnd = (a) => typeof a === "undefined";
  const isNil = (a) => isUnd(a) || a === null;
  const isSvg = (a) => isBrowser && a instanceof SVGElement;
  const isHex = (a) => hexTestRgx.test(a);
  const isRgb = (a) => stringStartsWith(a, "rgb");
  const isHsl = (a) => stringStartsWith(a, "hsl");
  const isCol = (a) => isHex(a) || (isRgb(a) || isHsl(a)) && (a[a.length - 1] === ")" || !validRgbHslRgx.test(a));
  const isKey = (a) => !globals.defaults.hasOwnProperty(a);
  const svgCssReservedProperties = ["opacity", "rotate", "overflow", "color"];
  const isValidSVGAttribute = (el, propertyName) => {
    if (svgCssReservedProperties.includes(propertyName)) return false;
    if (el.getAttribute(propertyName) || propertyName in el) {
      if (propertyName === "scale") {
        const elParentNode = (
          /** @type {SVGGeometryElement} */
          /** @type {DOMTarget} */
          el.parentNode
        );
        return elParentNode && elParentNode.tagName === "filter";
      }
      return true;
    }
  };
  const pow = Math.pow;
  const sqrt = Math.sqrt;
  const sin = Math.sin;
  const cos = Math.cos;
  const floor = Math.floor;
  const asin = Math.asin;
  const PI = Math.PI;
  const _round = Math.round;
  const clamp$1 = (v, min, max) => v < min ? min : v > max ? max : v;
  const round = (v, decimalLength) => {
    if (decimalLength < 0) return v;
    if (!decimalLength) return _round(v);
    const p = 10 ** decimalLength;
    return _round(v * p) / p;
  };
  const lerp = (start, end, factor) => start + (end - start) * factor;
  const clampInfinity = (v) => v === Infinity ? maxValue : v === -Infinity ? -maxValue : v;
  const normalizeTime = (v) => v <= minValue ? minValue : clampInfinity(round(v, 11));
  const cloneArray = (a) => isArr(a) ? [...a] : a;
  const mergeObjects = (o1, o2) => {
    const merged = (
      /** @type {T & U} */
      { ...o1 }
    );
    for (let p in o2) {
      const o1p = (
        /** @type {T & U} */
        o1[p]
      );
      merged[p] = isUnd(o1p) ? (
        /** @type {T & U} */
        o2[p]
      ) : o1p;
    }
    return merged;
  };
  const forEachChildren = (parent, callback, reverse, prevProp = "_prev", nextProp = "_next") => {
    let next = parent._head;
    let adjustedNextProp = nextProp;
    if (reverse) {
      next = parent._tail;
      adjustedNextProp = prevProp;
    }
    while (next) {
      const currentNext = next[adjustedNextProp];
      callback(next);
      next = currentNext;
    }
  };
  const removeChild = (parent, child, prevProp = "_prev", nextProp = "_next") => {
    const prev = child[prevProp];
    const next = child[nextProp];
    prev ? prev[nextProp] = next : parent._head = next;
    next ? next[prevProp] = prev : parent._tail = prev;
    child[prevProp] = null;
    child[nextProp] = null;
  };
  const addChild = (parent, child, sortMethod, prevProp = "_prev", nextProp = "_next") => {
    let prev = parent._tail;
    while (prev && sortMethod && sortMethod(prev, child)) prev = prev[prevProp];
    const next = prev ? prev[nextProp] : parent._head;
    prev ? prev[nextProp] = child : parent._head = child;
    next ? next[prevProp] = child : parent._tail = child;
    child[prevProp] = prev;
    child[nextProp] = next;
  };
  function getNodeList(v) {
    const n = isStr(v) ? scope.root.querySelectorAll(v) : v;
    if (n instanceof NodeList || n instanceof HTMLCollection) return n;
  }
  function parseTargets(targets) {
    if (isNil(targets)) return (
      /** @type {TargetsArray} */
      []
    );
    if (!isBrowser) return (
      /** @type {JSTargetsArray} */
      isArr(targets) && targets.flat(Infinity) || [targets]
    );
    if (isArr(targets)) {
      const flattened = targets.flat(Infinity);
      const parsed = [];
      for (let i = 0, l = flattened.length; i < l; i++) {
        const item = flattened[i];
        if (!isNil(item)) {
          const nodeList2 = getNodeList(item);
          if (nodeList2) {
            for (let j = 0, jl = nodeList2.length; j < jl; j++) {
              const subItem = nodeList2[j];
              if (!isNil(subItem)) {
                let isDuplicate = false;
                for (let k = 0, kl = parsed.length; k < kl; k++) {
                  if (parsed[k] === subItem) {
                    isDuplicate = true;
                    break;
                  }
                }
                if (!isDuplicate) {
                  parsed.push(subItem);
                }
              }
            }
          } else {
            let isDuplicate = false;
            for (let j = 0, jl = parsed.length; j < jl; j++) {
              if (parsed[j] === item) {
                isDuplicate = true;
                break;
              }
            }
            if (!isDuplicate) {
              parsed.push(item);
            }
          }
        }
      }
      return parsed;
    }
    const nodeList = getNodeList(targets);
    if (nodeList) return (
      /** @type {DOMTargetsArray} */
      Array.from(nodeList)
    );
    return (
      /** @type {TargetsArray} */
      [targets]
    );
  }
  function registerTargets(targets) {
    const parsedTargetsArray = parseTargets(targets);
    const parsedTargetsLength = parsedTargetsArray.length;
    if (parsedTargetsLength) {
      for (let i = 0; i < parsedTargetsLength; i++) {
        const target = parsedTargetsArray[i];
        if (!target[isRegisteredTargetSymbol]) {
          target[isRegisteredTargetSymbol] = true;
          const isSvgType = isSvg(target);
          const isDom = (
            /** @type {DOMTarget} */
            target.nodeType || isSvgType
          );
          if (isDom) {
            target[isDomSymbol] = true;
            target[isSvgSymbol] = isSvgType;
            target[transformsSymbol] = {};
          }
        }
      }
    }
    return parsedTargetsArray;
  }
  const parseInlineTransforms = (target, propName, animationInlineStyles) => {
    const inlineTransforms = target.style.transform;
    if (inlineTransforms) {
      const cachedTransforms = target[transformsSymbol];
      let pos = 0;
      const len = inlineTransforms.length;
      let fullTranslateValue;
      while (pos < len) {
        while (pos < len && inlineTransforms.charCodeAt(pos) === 32) pos++;
        if (pos >= len) break;
        const nameStart = pos;
        while (pos < len && inlineTransforms.charCodeAt(pos) !== 40) pos++;
        if (pos >= len) break;
        const name = inlineTransforms.substring(nameStart, pos);
        let depth = 1;
        const valueStart = pos + 1;
        let c1 = -1, c2 = -1;
        pos++;
        while (pos < len && depth > 0) {
          const c = inlineTransforms.charCodeAt(pos);
          if (c === 40) depth++;
          else if (c === 41) depth--;
          else if (c === 44 && depth === 1) {
            if (c1 === -1) c1 = pos;
            else if (c2 === -1) c2 = pos;
          }
          pos++;
        }
        const valueEnd = pos - 1;
        if (name === "translate" || name === "translate3d") {
          if (c1 === -1) {
            cachedTransforms.translateX = inlineTransforms.substring(valueStart, valueEnd).trim();
          } else {
            cachedTransforms.translateX = inlineTransforms.substring(valueStart, c1).trim();
            if (c2 === -1) {
              cachedTransforms.translateY = inlineTransforms.substring(c1 + 1, valueEnd).trim();
            } else {
              cachedTransforms.translateY = inlineTransforms.substring(c1 + 1, c2).trim();
              cachedTransforms.translateZ = inlineTransforms.substring(c2 + 1, valueEnd).trim();
            }
          }
          fullTranslateValue = inlineTransforms.substring(valueStart, valueEnd);
        } else if (name === "scale" || name === "scale3d") {
          if (c1 === -1) {
            cachedTransforms.scale = inlineTransforms.substring(valueStart, valueEnd).trim();
          } else {
            cachedTransforms.scaleX = inlineTransforms.substring(valueStart, c1).trim();
            if (c2 === -1) {
              cachedTransforms.scaleY = inlineTransforms.substring(c1 + 1, valueEnd).trim();
            } else {
              cachedTransforms.scaleY = inlineTransforms.substring(c1 + 1, c2).trim();
              cachedTransforms.scaleZ = inlineTransforms.substring(c2 + 1, valueEnd).trim();
            }
          }
        } else {
          cachedTransforms[name] = inlineTransforms.substring(valueStart, valueEnd);
        }
      }
      if (propName === "translate3d" && fullTranslateValue) {
        if (animationInlineStyles) animationInlineStyles[propName] = fullTranslateValue;
        return fullTranslateValue;
      }
      const cached = cachedTransforms[propName];
      if (!isUnd(cached)) {
        if (animationInlineStyles) animationInlineStyles[propName] = cached;
        return cached;
      }
    }
    return propName === "translate3d" ? "0px, 0px, 0px" : propName === "rotate3d" ? "0, 0, 0, 0deg" : stringStartsWith(propName, "scale") ? "1" : stringStartsWith(propName, "rotate") || stringStartsWith(propName, "skew") ? "0deg" : "0px";
  };
  const buildTransformString = (props) => {
    let str = emptyString;
    for (let i = 0, l = validTransforms.length; i < l; i++) {
      const key2 = validTransforms[i];
      const val = props[key2];
      if (val !== void 0) {
        if (key2 === "translateX") {
          const next = props.translateY;
          if (next !== void 0) {
            const next2 = props.translateZ;
            if (next2 !== void 0) {
              str += `translate3d(${val},${next},${next2}) `;
              i += 2;
            } else {
              str += `translate(${val},${next}) `;
              i += 1;
            }
            continue;
          }
        }
        if (key2 === "scaleX" && props.scale === void 0) {
          const next = props.scaleY;
          if (next !== void 0) {
            const next2 = props.scaleZ;
            if (next2 !== void 0) {
              str += `scale3d(${val},${next},${next2}) `;
              i += 2;
            } else {
              str += `scale(${val},${next}) `;
              i += 1;
            }
            continue;
          }
        }
        str += `${transformsFragmentStrings[key2]}${val}) `;
      }
      if (key2 === "rotateZ") {
        if (props.rotate3d !== void 0) str += `rotate3d(${props.rotate3d}) `;
      }
    }
    if (props.matrix !== void 0) str += `matrix(${props.matrix}) `;
    if (props.matrix3d !== void 0) str += `matrix3d(${props.matrix3d}) `;
    return str;
  };
  const rgbToRgba = (rgbValue) => {
    const rgba = rgbExecRgx.exec(rgbValue) || rgbaExecRgx.exec(rgbValue);
    const a = !isUnd(rgba[4]) ? +rgba[4] : 1;
    return [
      +rgba[1],
      +rgba[2],
      +rgba[3],
      a
    ];
  };
  const hexToRgba = (hexValue) => {
    const hexLength = hexValue.length;
    const isShort = hexLength === 4 || hexLength === 5;
    return [
      +("0x" + hexValue[1] + hexValue[isShort ? 1 : 2]),
      +("0x" + hexValue[isShort ? 2 : 3] + hexValue[isShort ? 2 : 4]),
      +("0x" + hexValue[isShort ? 3 : 5] + hexValue[isShort ? 3 : 6]),
      hexLength === 5 || hexLength === 9 ? +(+("0x" + hexValue[isShort ? 4 : 7] + hexValue[isShort ? 4 : 8]) / 255).toFixed(3) : 1
    ];
  };
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
  };
  const hslToRgba = (hslValue) => {
    const hsla = hslExecRgx.exec(hslValue) || hslaExecRgx.exec(hslValue);
    const h = +hsla[1] / 360;
    const s = +hsla[2] / 100;
    const l = +hsla[3] / 100;
    const a = !isUnd(hsla[4]) ? +hsla[4] : 1;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = round(hue2rgb(p, q, h + 1 / 3) * 255, 0);
      g = round(hue2rgb(p, q, h) * 255, 0);
      b = round(hue2rgb(p, q, h - 1 / 3) * 255, 0);
    }
    return [r, g, b, a];
  };
  const convertColorStringValuesToRgbaArray = (colorString) => {
    return isRgb(colorString) ? rgbToRgba(colorString) : isHex(colorString) ? hexToRgba(colorString) : isHsl(colorString) ? hslToRgba(colorString) : [0, 0, 0, 1];
  };
  const setValue = (targetValue, defaultValue) => {
    return isUnd(targetValue) ? defaultValue : targetValue;
  };
  const getFunctionValue = (value, target, index, targets, store, prevTween) => {
    let func;
    if (isFnc(value)) {
      func = () => {
        const computed = (
          /** @type {Function} */
          value(target, index, targets, prevTween)
        );
        return !isNaN(+computed) ? +computed : computed || 0;
      };
    } else if (isStr(value) && stringStartsWith(value, cssVarPrefix)) {
      func = () => {
        var _a;
        const match = value.match(cssVariableMatchRgx);
        const cssVarName = match[1];
        const fallbackValue = match[2];
        let computed = (_a = getComputedStyle(
          /** @type {HTMLElement} */
          target
        )) == null ? void 0 : _a.getPropertyValue(cssVarName);
        if ((!computed || computed.trim() === emptyString) && fallbackValue) {
          computed = fallbackValue.trim();
        }
        return computed || 0;
      };
    } else {
      return value;
    }
    if (store) store.func = func;
    return func();
  };
  const getTweenType = (target, prop) => {
    return !target[isDomSymbol] ? tweenTypes.OBJECT : (
      // Handle SVG attributes
      target[isSvgSymbol] && isValidSVGAttribute(target, prop) ? tweenTypes.ATTRIBUTE : (
        // Handle CSS Transform properties differently than CSS to allow individual animations
        validTransforms.includes(prop) || shortTransforms.get(prop) ? tweenTypes.TRANSFORM : (
          // CSS variables
          stringStartsWith(prop, "--") ? tweenTypes.CSS_VAR : (
            // All other CSS properties
            prop in /** @type {DOMTarget} */
            target.style ? tweenTypes.CSS : (
              // Handle other DOM Attributes
              prop in target ? tweenTypes.OBJECT : tweenTypes.ATTRIBUTE
            )
          )
        )
      )
    );
  };
  const getCSSValue = (target, propName, animationInlineStyles) => {
    const inlineStyles = target.style[propName];
    if (inlineStyles && animationInlineStyles) {
      animationInlineStyles[propName] = inlineStyles;
    }
    const value = inlineStyles || getComputedStyle(target[proxyTargetSymbol] || target).getPropertyValue(propName);
    return value === "auto" ? "0" : value;
  };
  const getOriginalAnimatableValue = (target, propName, tweenType, animationInlineStyles) => {
    const type = !isUnd(tweenType) ? tweenType : getTweenType(target, propName);
    if (type === tweenTypes.OBJECT) {
      const value = target[propName];
      if (value && animationInlineStyles) animationInlineStyles[propName] = value;
      return value || 0;
    }
    if (type === tweenTypes.ATTRIBUTE) {
      const value = (
        /** @type {DOMTarget} */
        target.getAttribute(propName)
      );
      if (value && animationInlineStyles) animationInlineStyles[propName] = value;
      return value;
    }
    return type === tweenTypes.TRANSFORM ? parseInlineTransforms(
      /** @type {DOMTarget} */
      target,
      propName,
      animationInlineStyles
    ) : type === tweenTypes.CSS_VAR ? getCSSValue(
      /** @type {DOMTarget} */
      target,
      propName,
      animationInlineStyles
    ).trimStart() : getCSSValue(
      /** @type {DOMTarget} */
      target,
      propName,
      animationInlineStyles
    );
  };
  const getRelativeValue = (x, y, operator) => {
    return operator === "-" ? x - y : operator === "+" ? x + y : x * y;
  };
  const createDecomposedValueTargetObject = () => {
    return {
      /** @type {valueTypes} */
      t: valueTypes.NUMBER,
      n: 0,
      u: null,
      o: null,
      d: null,
      s: null
    };
  };
  const decomposeRawValue = (rawValue, targetObject) => {
    targetObject.t = valueTypes.NUMBER;
    targetObject.n = 0;
    targetObject.u = null;
    targetObject.o = null;
    targetObject.d = null;
    targetObject.s = null;
    if (!rawValue) return targetObject;
    const num = +rawValue;
    if (!isNaN(num)) {
      targetObject.n = num;
      return targetObject;
    } else {
      let str = (
        /** @type {String} */
        rawValue
      );
      if (str[1] === "=") {
        targetObject.o = str[0];
        str = str.slice(2);
      }
      const unitMatch = str.includes(" ") ? false : unitsExecRgx.exec(str);
      if (unitMatch) {
        targetObject.t = valueTypes.UNIT;
        targetObject.n = +unitMatch[1];
        targetObject.u = unitMatch[2];
        return targetObject;
      } else if (targetObject.o) {
        targetObject.n = +str;
        return targetObject;
      } else if (isCol(str)) {
        targetObject.t = valueTypes.COLOR;
        targetObject.d = convertColorStringValuesToRgbaArray(str);
        return targetObject;
      } else {
        const matchedNumbers = str.match(digitWithExponentRgx);
        targetObject.t = valueTypes.COMPLEX;
        targetObject.d = matchedNumbers ? matchedNumbers.map(Number) : [];
        targetObject.s = str.split(digitWithExponentRgx) || [];
        return targetObject;
      }
    }
  };
  const decomposeTweenValue = (tween, targetObject) => {
    targetObject.t = tween._valueType;
    targetObject.n = tween._toNumber;
    targetObject.u = tween._unit;
    targetObject.o = null;
    targetObject.d = cloneArray(tween._toNumbers);
    targetObject.s = cloneArray(tween._strings);
    return targetObject;
  };
  const decomposedOriginalValue = createDecomposedValueTargetObject();
  const composeColorValue = (tween, progress, precision) => {
    const mod = tween._modifier;
    const fn = tween._fromNumbers;
    const tn = tween._toNumbers;
    const r = round(clamp$1(
      /** @type {Number} */
      mod(lerp(fn[0], tn[0], progress)),
      0,
      255
    ), 0);
    const g = round(clamp$1(
      /** @type {Number} */
      mod(lerp(fn[1], tn[1], progress)),
      0,
      255
    ), 0);
    const b = round(clamp$1(
      /** @type {Number} */
      mod(lerp(fn[2], tn[2], progress)),
      0,
      255
    ), 0);
    const a = clamp$1(
      /** @type {Number} */
      mod(round(lerp(fn[3], tn[3], progress), precision)),
      0,
      1
    );
    if (tween._composition !== compositionTypes.none) {
      const ns = tween._numbers;
      ns[0] = r;
      ns[1] = g;
      ns[2] = b;
      ns[3] = a;
    }
    return `rgba(${r},${g},${b},${a})`;
  };
  const composeComplexValue = (tween, progress, precision) => {
    const mod = tween._modifier;
    const fn = tween._fromNumbers;
    const tn = tween._toNumbers;
    const ts = tween._strings;
    const hasComposition = tween._composition !== compositionTypes.none;
    let v = ts[0];
    for (let j = 0, l = tn.length; j < l; j++) {
      const n = (
        /** @type {Number} */
        mod(round(lerp(fn[j], tn[j], progress), precision))
      );
      const s = ts[j + 1];
      v += `${s ? n + s : n}`;
      if (hasComposition) {
        tween._numbers[j] = n;
      }
    }
    return v;
  };
  const none = (t) => t;
  const easeInPower = (p = 1.68) => (t) => pow(t, +p);
  const easeTypes = {
    in: (easeIn) => (t) => easeIn(t),
    out: (easeIn) => (t) => 1 - easeIn(1 - t),
    inOut: (easeIn) => (t) => t < 0.5 ? easeIn(t * 2) / 2 : 1 - easeIn(t * -2 + 2) / 2,
    outIn: (easeIn) => (t) => t < 0.5 ? (1 - easeIn(1 - t * 2)) / 2 : (easeIn(t * 2 - 1) + 1) / 2
  };
  const halfPI = PI / 2;
  const doublePI = PI * 2;
  const easeInFunctions = {
    [emptyString]: easeInPower,
    Quad: easeInPower(2),
    Cubic: easeInPower(3),
    Quart: easeInPower(4),
    Quint: easeInPower(5),
    /** @type {EasingFunction} */
    Sine: (t) => 1 - cos(t * halfPI),
    /** @type {EasingFunction} */
    Circ: (t) => 1 - sqrt(1 - t * t),
    /** @type {EasingFunction} */
    Expo: (t) => t ? pow(2, 10 * t - 10) : 0,
    /** @type {EasingFunction} */
    Bounce: (t) => {
      let pow2, b = 4;
      while (t < ((pow2 = pow(2, --b)) - 1) / 11) ;
      return 1 / pow(4, 3 - b) - 7.5625 * pow((pow2 * 3 - 2) / 22 - t, 2);
    },
    /** @type {BackEasing} */
    Back: (overshoot = 1.7) => (t) => (+overshoot + 1) * t * t * t - +overshoot * t * t,
    /** @type {ElasticEasing} */
    Elastic: (amplitude = 1, period = 0.3) => {
      const a = clamp$1(+amplitude, 1, 10);
      const p = clamp$1(+period, minValue, 2);
      const s = p / doublePI * asin(1 / a);
      const e = doublePI / p;
      return (t) => t === 0 || t === 1 ? t : -a * pow(2, -10 * (1 - t)) * sin((1 - t - s) * e);
    }
  };
  const eases = /* @__PURE__ */ (() => {
    const list = { linear: none, none };
    for (let type in easeTypes) {
      for (let name in easeInFunctions) {
        const easeIn = easeInFunctions[name];
        const easeType = easeTypes[type];
        list[type + name] = /** @type {EasingFunctionWithParams|EasingFunction} */
        name === emptyString || name === "Back" || name === "Elastic" ? (a, b) => easeType(
          /** @type {EasingFunctionWithParams} */
          easeIn(a, b)
        ) : easeType(
          /** @type {EasingFunction} */
          easeIn
        );
      }
    }
    return (
      /** @type {EasesFunctions} */
      list
    );
  })();
  const easesLookups = { linear: none, none };
  const parseEaseString = (string) => {
    if (easesLookups[string]) return easesLookups[string];
    if (string.indexOf("(") <= -1) {
      const hasParams = easeTypes[string] || string.includes("Back") || string.includes("Elastic");
      const parsedFn = (
        /** @type {EasingFunction} */
        hasParams ? (
          /** @type {EasingFunctionWithParams} */
          eases[string]()
        ) : eases[string]
      );
      return parsedFn ? easesLookups[string] = parsedFn : none;
    } else {
      const split = string.slice(0, -1).split("(");
      const parsedFn = (
        /** @type {EasingFunctionWithParams} */
        eases[split[0]]
      );
      return parsedFn ? easesLookups[string] = parsedFn(...split[1].split(",")) : none;
    }
  };
  const deprecated = ["steps(", "irregular(", "linear(", "cubicBezier("];
  const parseEase = (ease) => {
    if (isStr(ease)) {
      for (let i = 0, l = deprecated.length; i < l; i++) {
        if (stringStartsWith(ease, deprecated[i])) {
          console.warn(`String syntax for \`ease: "${ease}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${ease}\``);
          return none;
        }
      }
    }
    const easeFunc = isFnc(ease) ? ease : isStr(ease) ? parseEaseString(
      /** @type {String} */
      ease
    ) : none;
    return easeFunc;
  };
  const WAAPIAnimationsLookups = {
    _head: null,
    _tail: null
  };
  const removeWAAPIAnimation = ($el, property, parent) => {
    let nextLookup = WAAPIAnimationsLookups._head;
    let anim;
    while (nextLookup) {
      const next = nextLookup._next;
      const matchTarget = nextLookup.$el === $el;
      const matchProperty = !property || nextLookup.property === property;
      const matchParent = !parent || nextLookup.parent === parent;
      if (matchTarget && matchProperty && matchParent) {
        anim = nextLookup.animation;
        try {
          anim.commitStyles();
        } catch (e) {
        }
        anim.cancel();
        removeChild(WAAPIAnimationsLookups, nextLookup);
        const lookupParent = nextLookup.parent;
        if (lookupParent) {
          lookupParent._completed++;
          if (lookupParent.animations.length === lookupParent._completed) {
            lookupParent.completed = true;
            lookupParent.paused = true;
            if (!lookupParent.muteCallbacks) {
              lookupParent.onComplete(lookupParent);
              lookupParent._resolve(lookupParent);
            }
          }
        }
      }
      nextLookup = next;
    }
    return anim;
  };
  const addWAAPIAnimation = (parent, $el, property, keyframes2, params) => {
    const animation = $el.animate(keyframes2, params);
    const animTotalDuration = params.delay + +params.duration * params.iterations;
    animation.playbackRate = parent._speed;
    if (parent.paused) animation.pause();
    if (parent.duration < animTotalDuration) {
      parent.duration = animTotalDuration;
      parent.controlAnimation = animation;
    }
    parent.animations.push(animation);
    removeWAAPIAnimation($el, property);
    addChild(WAAPIAnimationsLookups, { parent, animation, $el, property, _next: null, _prev: null });
    const handleRemove = () => removeWAAPIAnimation($el, property, parent);
    animation.oncancel = handleRemove;
    animation.onremove = handleRemove;
    if (!parent.persist) {
      animation.onfinish = handleRemove;
    }
    return animation;
  };
  const easingToLinear = (fn, samples = 100) => {
    const points = [];
    for (let i = 0; i <= samples; i++) points.push(round(fn(i / samples), 4));
    return `linear(${points.join(", ")})`;
  };
  const WAAPIEasesLookups = {};
  const parseWAAPIEasing = (ease) => {
    let parsedEase = WAAPIEasesLookups[ease];
    if (parsedEase) return parsedEase;
    parsedEase = "linear";
    if (isStr(ease)) {
      if (stringStartsWith(ease, "linear") || stringStartsWith(ease, "cubic-") || stringStartsWith(ease, "steps") || stringStartsWith(ease, "ease")) {
        parsedEase = ease;
      } else if (stringStartsWith(ease, "cubicB")) {
        parsedEase = toLowerCase(ease);
      } else {
        const parsed = parseEaseString(ease);
        if (isFnc(parsed)) parsedEase = parsed === none ? "linear" : easingToLinear(parsed);
      }
      WAAPIEasesLookups[ease] = parsedEase;
    } else if (isFnc(ease)) {
      const easing = easingToLinear(ease);
      if (easing) parsedEase = easing;
    } else if (
      /** @type {Spring} */
      ease.ease
    ) {
      parsedEase = easingToLinear(
        /** @type {Spring} */
        ease.ease
      );
    }
    return parsedEase;
  };
  const transformsShorthands = ["x", "y", "z"];
  const commonDefaultPXProperties = [
    "perspective",
    "width",
    "height",
    "margin",
    "padding",
    "top",
    "right",
    "bottom",
    "left",
    "borderWidth",
    "fontSize",
    "borderRadius",
    ...transformsShorthands
  ];
  const validIndividualTransforms = /* @__PURE__ */ (() => [...transformsShorthands, ...validTransforms.filter((t) => ["X", "Y", "Z"].some((axis) => t.endsWith(axis)))])();
  let transformsPropertiesRegistered = null;
  const normalizeTweenValue = (propName, value, $el, i, parsedTargets) => {
    let v = isStr(value) ? value : getFunctionValue(
      /** @type {any} */
      value,
      $el,
      i,
      parsedTargets,
      null,
      null
    );
    if (!isNum(v)) return v;
    if (commonDefaultPXProperties.includes(propName) || stringStartsWith(propName, "translate")) return `${v}px`;
    if (stringStartsWith(propName, "rotate") || stringStartsWith(propName, "skew")) return `${v}deg`;
    return `${v}`;
  };
  const parseIndividualTweenValue = ($el, propName, from, to, i, parsedTargets) => {
    let tweenValue = "0";
    const computedTo = !isUnd(to) ? normalizeTweenValue(propName, to, $el, i, parsedTargets) : getComputedStyle($el)[propName];
    if (!isUnd(from)) {
      const computedFrom = normalizeTweenValue(propName, from, $el, i, parsedTargets);
      tweenValue = [computedFrom, computedTo];
    } else {
      tweenValue = isArr(to) ? to.map((v) => normalizeTweenValue(propName, v, $el, i, parsedTargets)) : computedTo;
    }
    return tweenValue;
  };
  class WAAPIAnimation {
    /**
     * @param {DOMTargetsParam} targets
     * @param {WAAPIAnimationParams} params
     */
    constructor(targets, params) {
      if (isNil(transformsPropertiesRegistered)) {
        if (isBrowser && (isUnd(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty"))) {
          transformsPropertiesRegistered = false;
        } else {
          validTransforms.forEach((t) => {
            const isSkew = stringStartsWith(t, "skew");
            const isScale = stringStartsWith(t, "scale");
            const isRotate = stringStartsWith(t, "rotate");
            const isTranslate = stringStartsWith(t, "translate");
            const isAngle = isRotate || isSkew;
            const syntax = isAngle ? "<angle>" : isScale ? "<number>" : isTranslate ? "<length-percentage>" : "*";
            try {
              CSS.registerProperty({
                name: "--" + t,
                syntax,
                inherits: false,
                initialValue: isTranslate ? "0px" : isAngle ? "0deg" : isScale ? "1" : "0"
              });
            } catch (e) {
            }
          });
          transformsPropertiesRegistered = true;
        }
      }
      const parsedTargets = registerTargets(targets);
      if (!parsedTargets.length) {
        console.warn(`No target found. Make sure the element you're trying to animate is accessible before creating your animation.`);
      }
      const autoplay = setValue(params.autoplay, globals.defaults.autoplay);
      const scroll = autoplay && /** @type {ScrollObserver} */
      autoplay.link ? autoplay : false;
      const alternate = params.alternate && /** @type {Boolean} */
      params.alternate === true;
      const reversed = params.reversed && /** @type {Boolean} */
      params.reversed === true;
      const loop = setValue(params.loop, globals.defaults.loop);
      const iterations = (
        /** @type {Number} */
        loop === true || loop === Infinity ? Infinity : isNum(loop) ? loop + 1 : 1
      );
      const direction = alternate ? reversed ? "alternate-reverse" : "alternate" : reversed ? "reverse" : "normal";
      const fill = "both";
      const timeScale = globals.timeScale === 1 ? 1 : K;
      this.targets = parsedTargets;
      this.animations = [];
      this.controlAnimation = null;
      this.onComplete = params.onComplete || /** @type {Callback<WAAPIAnimation>} */
      /** @type {unknown} */
      globals.defaults.onComplete;
      this.duration = 0;
      this.muteCallbacks = false;
      this.completed = false;
      this.paused = !autoplay || scroll !== false;
      this.reversed = reversed;
      this.persist = setValue(params.persist, globals.defaults.persist);
      this.autoplay = autoplay;
      this._speed = setValue(params.playbackRate, globals.defaults.playbackRate);
      this._resolve = noop;
      this._completed = 0;
      this._inlineStyles = [];
      parsedTargets.forEach(($el, i) => {
        const cachedTransforms = $el[transformsSymbol];
        const hasIndividualTransforms = validIndividualTransforms.some((t) => params.hasOwnProperty(t));
        const elStyle = $el.style;
        const inlineStyles = this._inlineStyles[i] = {};
        const easeToParse = setValue(params.ease, globals.defaults.ease);
        const easeFunctionResult = getFunctionValue(easeToParse, $el, i, parsedTargets, null, null);
        const keyEasing = isFnc(easeFunctionResult) || isStr(easeFunctionResult) ? easeFunctionResult : easeToParse;
        const spring = (
          /** @type {Spring} */
          easeToParse.ease && easeToParse
        );
        const easing = parseWAAPIEasing(keyEasing);
        const duration = (spring ? (
          /** @type {Spring} */
          spring.settlingDuration
        ) : getFunctionValue(setValue(params.duration, globals.defaults.duration), $el, i, parsedTargets, null, null)) * timeScale;
        const delay = getFunctionValue(setValue(params.delay, globals.defaults.delay), $el, i, parsedTargets, null, null) * timeScale;
        const composite = (
          /** @type {CompositeOperation} */
          setValue(params.composition, "replace")
        );
        for (let name in params) {
          if (!isKey(name)) continue;
          const keyframes2 = {};
          const tweenParams = { iterations, direction, fill, easing, duration, delay, composite };
          const propertyValue = params[name];
          const individualTransformProperty = hasIndividualTransforms ? validTransforms.includes(name) ? name : shortTransforms.get(name) : false;
          const styleName = individualTransformProperty ? "transform" : name;
          if (!inlineStyles[styleName]) {
            inlineStyles[styleName] = elStyle[styleName];
          }
          let parsedPropertyValue;
          if (isObj(propertyValue)) {
            const tweenOptions = (
              /** @type {WAAPITweenOptions} */
              propertyValue
            );
            const tweenOptionsEase = setValue(tweenOptions.ease, easing);
            const tweenOptionsSpring = (
              /** @type {Spring} */
              tweenOptionsEase.ease && tweenOptionsEase
            );
            const to = (
              /** @type {WAAPITweenOptions} */
              tweenOptions.to
            );
            const from = (
              /** @type {WAAPITweenOptions} */
              tweenOptions.from
            );
            tweenParams.duration = (tweenOptionsSpring ? (
              /** @type {Spring} */
              tweenOptionsSpring.settlingDuration
            ) : getFunctionValue(setValue(tweenOptions.duration, duration), $el, i, parsedTargets, null, null)) * timeScale;
            tweenParams.delay = getFunctionValue(setValue(tweenOptions.delay, delay), $el, i, parsedTargets, null, null) * timeScale;
            tweenParams.composite = /** @type {CompositeOperation} */
            setValue(tweenOptions.composition, composite);
            tweenParams.easing = parseWAAPIEasing(tweenOptionsEase);
            parsedPropertyValue = parseIndividualTweenValue($el, name, from, to, i, parsedTargets);
            if (individualTransformProperty) {
              keyframes2[`--${individualTransformProperty}`] = parsedPropertyValue;
              cachedTransforms[individualTransformProperty] = parsedPropertyValue;
            } else {
              keyframes2[name] = parseIndividualTweenValue($el, name, from, to, i, parsedTargets);
            }
            addWAAPIAnimation(this, $el, name, keyframes2, tweenParams);
            if (!isUnd(from)) {
              if (!individualTransformProperty) {
                elStyle[name] = keyframes2[name][0];
              } else {
                const key2 = `--${individualTransformProperty}`;
                elStyle.setProperty(key2, keyframes2[key2][0]);
              }
            }
          } else {
            parsedPropertyValue = isArr(propertyValue) ? propertyValue.map((v) => normalizeTweenValue(name, v, $el, i, parsedTargets)) : normalizeTweenValue(
              name,
              /** @type {any} */
              propertyValue,
              $el,
              i,
              parsedTargets
            );
            if (individualTransformProperty) {
              keyframes2[`--${individualTransformProperty}`] = parsedPropertyValue;
              cachedTransforms[individualTransformProperty] = parsedPropertyValue;
            } else {
              keyframes2[name] = parsedPropertyValue;
            }
            addWAAPIAnimation(this, $el, name, keyframes2, tweenParams);
          }
        }
        if (hasIndividualTransforms) {
          let transforms = emptyString;
          for (let t in cachedTransforms) {
            transforms += `${transformsFragmentStrings[t]}var(--${t})) `;
          }
          elStyle.transform = transforms;
        }
      });
      if (scroll) {
        this.autoplay.link(this);
      }
    }
    /**
     * @callback forEachCallback
     * @param {globalThis.Animation} animation
     */
    /**
     * @param  {forEachCallback|String} callback
     * @return {this}
     */
    forEach(callback) {
      try {
        const cb = isStr(callback) ? (a) => a[callback]() : callback;
        this.animations.forEach(cb);
      } catch (e) {
      }
      return this;
    }
    get speed() {
      return this._speed;
    }
    set speed(speed) {
      this._speed = +speed;
      this.forEach((anim) => anim.playbackRate = speed);
    }
    get currentTime() {
      const controlAnimation = this.controlAnimation;
      const timeScale = globals.timeScale;
      return this.completed ? this.duration : controlAnimation ? +controlAnimation.currentTime * (timeScale === 1 ? 1 : timeScale) : 0;
    }
    set currentTime(time) {
      const t = time * (globals.timeScale === 1 ? 1 : K);
      this.forEach((anim) => {
        if (!this.persist && t >= this.duration) anim.play();
        anim.currentTime = t;
      });
    }
    get progress() {
      return this.currentTime / this.duration;
    }
    set progress(progress) {
      this.forEach((anim) => anim.currentTime = progress * this.duration || 0);
    }
    resume() {
      if (!this.paused) return this;
      this.paused = false;
      return this.forEach("play");
    }
    pause() {
      if (this.paused) return this;
      this.paused = true;
      return this.forEach("pause");
    }
    alternate() {
      this.reversed = !this.reversed;
      this.forEach("reverse");
      if (this.paused) this.forEach("pause");
      return this;
    }
    play() {
      if (this.reversed) this.alternate();
      return this.resume();
    }
    reverse() {
      if (!this.reversed) this.alternate();
      return this.resume();
    }
    /**
     * @param {Number} time
     * @param {Boolean} muteCallbacks
     */
    seek(time, muteCallbacks = false) {
      if (muteCallbacks) this.muteCallbacks = true;
      if (time < this.duration) this.completed = false;
      this.currentTime = time;
      this.muteCallbacks = false;
      if (this.paused) this.pause();
      return this;
    }
    restart() {
      this.completed = false;
      return this.seek(0, true).resume();
    }
    commitStyles() {
      return this.forEach("commitStyles");
    }
    complete() {
      return this.seek(this.duration);
    }
    cancel() {
      this.muteCallbacks = true;
      this.commitStyles().forEach("cancel");
      this.animations.length = 0;
      requestAnimationFrame(() => {
        this.targets.forEach(($el) => {
          if ($el.style.transform === "none") $el.style.removeProperty("transform");
        });
      });
      return this;
    }
    revert() {
      this.cancel().targets.forEach(($el, i) => {
        const targetStyle = $el.style;
        const targetInlineStyles = this._inlineStyles[i];
        for (let name in targetInlineStyles) {
          const originalInlinedValue = targetInlineStyles[name];
          if (isUnd(originalInlinedValue) || originalInlinedValue === emptyString) {
            targetStyle.removeProperty(toLowerCase(name));
          } else {
            $el.style[name] = originalInlinedValue;
          }
        }
        if ($el.getAttribute("style") === emptyString) $el.removeAttribute("style");
      });
      return this;
    }
    /**
     * @typedef {this & {then: null}} ResolvedWAAPIAnimation
     */
    /**
     * @param  {Callback<ResolvedWAAPIAnimation>} [callback]
     * @return Promise<this>
     */
    then(callback = noop) {
      const then = this.then;
      const onResolve = () => {
        this.then = null;
        callback(
          /** @type {ResolvedWAAPIAnimation} */
          this
        );
        this.then = then;
        this._resolve = noop;
      };
      return new Promise((r) => {
        this._resolve = () => r(onResolve());
        if (this.completed) this._resolve();
        return this;
      });
    }
  }
  const waapi = {
    /**
     * @param {DOMTargetsParam} targets
     * @param {WAAPIAnimationParams} params
     * @return {WAAPIAnimation}
     */
    animate: (targets, params) => new WAAPIAnimation(targets, params),
    convertEase: easingToLinear
  };
  const angleUnitsMap = { "deg": 1, "rad": 180 / PI, "turn": 360 };
  const convertedValuesCache = {};
  const convertValueUnit = (el, decomposedValue, unit, force = false) => {
    const currentUnit = decomposedValue.u;
    const currentNumber = decomposedValue.n;
    if (decomposedValue.t === valueTypes.UNIT && currentUnit === unit) {
      return decomposedValue;
    }
    const cachedKey = currentNumber + currentUnit + unit;
    const cached = convertedValuesCache[cachedKey];
    if (!isUnd(cached) && !force) {
      decomposedValue.n = cached;
    } else {
      let convertedValue;
      if (currentUnit in angleUnitsMap) {
        convertedValue = currentNumber * angleUnitsMap[currentUnit] / angleUnitsMap[unit];
      } else {
        const baseline = 100;
        const tempEl = (
          /** @type {DOMTarget} */
          el.cloneNode()
        );
        const parentNode = el.parentNode;
        const parentEl = parentNode && parentNode !== doc ? parentNode : doc.body;
        parentEl.appendChild(tempEl);
        const elStyle = tempEl.style;
        elStyle.width = baseline + currentUnit;
        const currentUnitWidth = (
          /** @type {HTMLElement} */
          tempEl.offsetWidth || baseline
        );
        elStyle.width = baseline + unit;
        const newUnitWidth = (
          /** @type {HTMLElement} */
          tempEl.offsetWidth || baseline
        );
        const factor = currentUnitWidth / newUnitWidth;
        parentEl.removeChild(tempEl);
        convertedValue = factor * currentNumber;
      }
      decomposedValue.n = convertedValue;
      convertedValuesCache[cachedKey] = convertedValue;
    }
    decomposedValue.t === valueTypes.UNIT;
    decomposedValue.u = unit;
    return decomposedValue;
  };
  const render = (tickable, time, muteCallbacks, internalRender, tickMode) => {
    const parent = tickable.parent;
    const duration = tickable.duration;
    const completed = tickable.completed;
    const iterationDuration = tickable.iterationDuration;
    const iterationCount = tickable.iterationCount;
    const _currentIteration = tickable._currentIteration;
    const _loopDelay = tickable._loopDelay;
    const _reversed = tickable._reversed;
    const _alternate = tickable._alternate;
    const _hasChildren = tickable._hasChildren;
    const tickableDelay = tickable._delay;
    const tickablePrevAbsoluteTime = tickable._currentTime;
    const tickableEndTime = tickableDelay + iterationDuration;
    const tickableAbsoluteTime = time - tickableDelay;
    const tickablePrevTime = clamp$1(tickablePrevAbsoluteTime, -tickableDelay, duration);
    const tickableCurrentTime = clamp$1(tickableAbsoluteTime, -tickableDelay, duration);
    const deltaTime = tickableAbsoluteTime - tickablePrevAbsoluteTime;
    const isCurrentTimeAboveZero = tickableCurrentTime > 0;
    const isCurrentTimeEqualOrAboveDuration = tickableCurrentTime >= duration;
    const isSetter = duration <= minValue;
    const forcedTick = tickMode === tickModes.FORCE;
    let isOdd = 0;
    let iterationElapsedTime = tickableAbsoluteTime;
    let hasRendered = 0;
    if (iterationCount > 1) {
      const currentIteration = ~~(tickableCurrentTime / (iterationDuration + (isCurrentTimeEqualOrAboveDuration ? 0 : _loopDelay)));
      tickable._currentIteration = clamp$1(currentIteration, 0, iterationCount);
      if (isCurrentTimeEqualOrAboveDuration) tickable._currentIteration--;
      isOdd = tickable._currentIteration % 2;
      iterationElapsedTime = tickableCurrentTime % (iterationDuration + _loopDelay) || 0;
    }
    const isReversed = _reversed ^ (_alternate && isOdd);
    const _ease = (
      /** @type {Renderable} */
      tickable._ease
    );
    let iterationTime = isCurrentTimeEqualOrAboveDuration ? isReversed ? 0 : duration : isReversed ? iterationDuration - iterationElapsedTime : iterationElapsedTime;
    if (_ease) iterationTime = iterationDuration * _ease(iterationTime / iterationDuration) || 0;
    const isRunningBackwards = (parent ? parent.backwards : tickableAbsoluteTime < tickablePrevAbsoluteTime) ? !isReversed : !!isReversed;
    tickable._currentTime = tickableAbsoluteTime;
    tickable._iterationTime = iterationTime;
    tickable.backwards = isRunningBackwards;
    if (isCurrentTimeAboveZero && !tickable.began) {
      tickable.began = true;
      if (!muteCallbacks && !(parent && (isRunningBackwards || !parent.began))) {
        tickable.onBegin(
          /** @type {CallbackArgument} */
          tickable
        );
      }
    } else if (tickableAbsoluteTime <= 0) {
      tickable.began = false;
    }
    if (!muteCallbacks && !_hasChildren && isCurrentTimeAboveZero && tickable._currentIteration !== _currentIteration) {
      tickable.onLoop(
        /** @type {CallbackArgument} */
        tickable
      );
    }
    if (forcedTick || tickMode === tickModes.AUTO && (time >= tickableDelay && time <= tickableEndTime || // Normal render
    time <= tickableDelay && tickablePrevTime > tickableDelay || // Playhead is before the animation start time so make sure the animation is at its initial state
    time >= tickableEndTime && tickablePrevTime !== duration) || iterationTime >= tickableEndTime && tickablePrevTime !== duration || iterationTime <= tickableDelay && tickablePrevTime > 0 || time <= tickablePrevTime && tickablePrevTime === duration && completed || // Force a render if a seek occurs on an completed animation
    isCurrentTimeEqualOrAboveDuration && !completed && isSetter) {
      if (isCurrentTimeAboveZero) {
        tickable.computeDeltaTime(tickablePrevTime);
        if (!muteCallbacks) tickable.onBeforeUpdate(
          /** @type {CallbackArgument} */
          tickable
        );
      }
      if (!_hasChildren) {
        const forcedRender = forcedTick || (isRunningBackwards ? deltaTime * -1 : deltaTime) >= globals.tickThreshold;
        const absoluteTime = tickable._offset + (parent ? parent._offset : 0) + tickableDelay + iterationTime;
        let tween = (
          /** @type {Tween} */
          /** @type {JSAnimation} */
          tickable._head
        );
        let tweenTarget;
        let tweenStyle;
        let tweenTargetTransforms;
        let tweenTargetTransformsProperties;
        let tweenTransformsNeedUpdate = 0;
        while (tween) {
          const tweenComposition = tween._composition;
          const tweenCurrentTime = tween._currentTime;
          const tweenChangeDuration = tween._changeDuration;
          const tweenAbsEndTime = tween._absoluteStartTime + tween._changeDuration;
          const tweenNextRep = tween._nextRep;
          const tweenPrevRep = tween._prevRep;
          const tweenHasComposition = tweenComposition !== compositionTypes.none;
          if ((forcedRender || (tweenCurrentTime !== tweenChangeDuration || absoluteTime <= tweenAbsEndTime + (tweenNextRep ? tweenNextRep._delay : 0)) && (tweenCurrentTime !== 0 || absoluteTime >= tween._absoluteStartTime)) && (!tweenHasComposition || !tween._isOverridden && (!tween._isOverlapped || absoluteTime <= tweenAbsEndTime) && (!tweenNextRep || (tweenNextRep._isOverridden || absoluteTime <= tweenNextRep._absoluteStartTime)) && (!tweenPrevRep || (tweenPrevRep._isOverridden || absoluteTime >= tweenPrevRep._absoluteStartTime + tweenPrevRep._changeDuration + tween._delay)))) {
            const tweenNewTime = tween._currentTime = clamp$1(iterationTime - tween._startTime, 0, tweenChangeDuration);
            const tweenProgress = tween._ease(tweenNewTime / tween._updateDuration);
            const tweenModifier = tween._modifier;
            const tweenValueType = tween._valueType;
            const tweenType = tween._tweenType;
            const tweenIsObject = tweenType === tweenTypes.OBJECT;
            const tweenIsNumber = tweenValueType === valueTypes.NUMBER;
            const tweenPrecision = tweenIsNumber && tweenIsObject || tweenProgress === 0 || tweenProgress === 1 ? -1 : globals.precision;
            let value;
            let number;
            if (tweenIsNumber) {
              value = number = /** @type {Number} */
              tweenModifier(round(lerp(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
            } else if (tweenValueType === valueTypes.UNIT) {
              number = /** @type {Number} */
              tweenModifier(round(lerp(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
              value = `${number}${tween._unit}`;
            } else if (tweenValueType === valueTypes.COLOR) {
              value = composeColorValue(tween, tweenProgress, tweenPrecision);
            } else if (tweenValueType === valueTypes.COMPLEX) {
              value = composeComplexValue(tween, tweenProgress, tweenPrecision);
            }
            if (tweenHasComposition) {
              tween._number = number;
            }
            if (!internalRender && tweenComposition !== compositionTypes.blend) {
              const tweenProperty = tween.property;
              tweenTarget = tween.target;
              if (tweenIsObject) {
                tweenTarget[tweenProperty] = value;
              } else if (tweenType === tweenTypes.ATTRIBUTE) {
                tweenTarget.setAttribute(
                  tweenProperty,
                  /** @type {String} */
                  value
                );
              } else {
                tweenStyle = /** @type {DOMTarget} */
                tweenTarget.style;
                if (tweenType === tweenTypes.TRANSFORM) {
                  if (tweenTarget !== tweenTargetTransforms) {
                    tweenTargetTransforms = tweenTarget;
                    tweenTargetTransformsProperties = tweenTarget[transformsSymbol];
                  }
                  tweenTargetTransformsProperties[tweenProperty] = value;
                  tweenTransformsNeedUpdate = 1;
                } else if (tweenType === tweenTypes.CSS) {
                  tweenStyle[tweenProperty] = value;
                } else if (tweenType === tweenTypes.CSS_VAR) {
                  tweenStyle.setProperty(
                    tweenProperty,
                    /** @type {String} */
                    value
                  );
                }
              }
              if (isCurrentTimeAboveZero) hasRendered = 1;
            } else {
              tween._value = value;
            }
          }
          if (tweenTransformsNeedUpdate && tween._renderTransforms) {
            tweenStyle.transform = buildTransformString(tweenTargetTransformsProperties);
            tweenTransformsNeedUpdate = 0;
          }
          tween = tween._next;
        }
        if (!muteCallbacks && hasRendered) {
          tickable.onRender(
            /** @type {JSAnimation} */
            tickable
          );
        }
      }
      if (!muteCallbacks && isCurrentTimeAboveZero) {
        tickable.onUpdate(
          /** @type {CallbackArgument} */
          tickable
        );
      }
    }
    if (parent && isSetter) {
      if (!muteCallbacks && // (tickableAbsoluteTime > 0 instead) of (tickableAbsoluteTime >= duration) to prevent floating point precision issues
      // see: https://github.com/juliangarnier/anime/issues/1088
      (parent.began && !isRunningBackwards && tickableAbsoluteTime > 0 && !completed || isRunningBackwards && tickableAbsoluteTime <= minValue && completed)) {
        tickable.onComplete(
          /** @type {CallbackArgument} */
          tickable
        );
        tickable.completed = !isRunningBackwards;
      }
    } else if (isCurrentTimeAboveZero && isCurrentTimeEqualOrAboveDuration) {
      if (iterationCount === Infinity) {
        tickable._startTime += tickable.duration;
      } else if (tickable._currentIteration >= iterationCount - 1) {
        tickable.paused = true;
        if (!completed && !_hasChildren) {
          tickable.completed = true;
          if (!muteCallbacks && !(parent && (isRunningBackwards || !parent.began))) {
            tickable.onComplete(
              /** @type {CallbackArgument} */
              tickable
            );
            tickable._resolve(
              /** @type {CallbackArgument} */
              tickable
            );
          }
        }
      }
    } else {
      tickable.completed = false;
    }
    return hasRendered;
  };
  const tick = (tickable, time, muteCallbacks, internalRender, tickMode) => {
    const _currentIteration = tickable._currentIteration;
    render(tickable, time, muteCallbacks, internalRender, tickMode);
    if (tickable._hasChildren) {
      const tl = (
        /** @type {Timeline} */
        tickable
      );
      const tlIsRunningBackwards = tl.backwards;
      const tlChildrenTime = internalRender ? time : tl._iterationTime;
      const tlCildrenTickTime = now();
      let tlChildrenHasRendered = 0;
      let tlChildrenHaveCompleted = true;
      if (!internalRender && tl._currentIteration !== _currentIteration) {
        const tlIterationDuration = tl.iterationDuration;
        forEachChildren(tl, (child) => {
          if (!tlIsRunningBackwards) {
            if (!child.completed && !child.backwards && child._currentTime < child.iterationDuration) {
              render(child, tlIterationDuration, muteCallbacks, 1, tickModes.FORCE);
            }
            child.began = false;
            child.completed = false;
          } else {
            const childDuration = child.duration;
            const childStartTime = child._offset + child._delay;
            const childEndTime = childStartTime + childDuration;
            if (!muteCallbacks && childDuration <= minValue && (!childStartTime || childEndTime === tlIterationDuration)) {
              child.onComplete(child);
            }
          }
        });
        if (!muteCallbacks) tl.onLoop(
          /** @type {CallbackArgument} */
          tl
        );
      }
      forEachChildren(tl, (child) => {
        const childTime = round((tlChildrenTime - child._offset) * child._speed, 12);
        const childTickMode = child._fps < tl._fps ? child.requestTick(tlCildrenTickTime) : tickMode;
        tlChildrenHasRendered += render(child, childTime, muteCallbacks, internalRender, childTickMode);
        if (!child.completed && tlChildrenHaveCompleted) tlChildrenHaveCompleted = false;
      }, tlIsRunningBackwards);
      if (!muteCallbacks && tlChildrenHasRendered) tl.onRender(
        /** @type {CallbackArgument} */
        tl
      );
      if ((tlChildrenHaveCompleted || tlIsRunningBackwards) && tl._currentTime >= tl.duration) {
        tl.paused = true;
        if (!tl.completed) {
          tl.completed = true;
          if (!muteCallbacks) {
            tl.onComplete(
              /** @type {CallbackArgument} */
              tl
            );
            tl._resolve(
              /** @type {CallbackArgument} */
              tl
            );
          }
        }
      }
    }
  };
  const propertyNamesCache = {};
  const sanitizePropertyName = (propertyName, target, tweenType) => {
    if (tweenType === tweenTypes.TRANSFORM) {
      const t = shortTransforms.get(propertyName);
      return t ? t : propertyName;
    } else if (tweenType === tweenTypes.CSS || // Handle special cases where properties like "strokeDashoffset" needs to be set as "stroke-dashoffset"
    // but properties like "baseFrequency" should stay in lowerCamelCase
    tweenType === tweenTypes.ATTRIBUTE && (isSvg(target) && propertyName in /** @type {DOMTarget} */
    target.style)) {
      const cachedPropertyName = propertyNamesCache[propertyName];
      if (cachedPropertyName) {
        return cachedPropertyName;
      } else {
        const lowerCaseName = propertyName ? toLowerCase(propertyName) : propertyName;
        propertyNamesCache[propertyName] = lowerCaseName;
        return lowerCaseName;
      }
    } else {
      return propertyName;
    }
  };
  const revertValues = (renderable, inlineStylesOnly = false) => {
    if (renderable._hasChildren) {
      forEachChildren(renderable, (child) => revertValues(child, inlineStylesOnly), true);
    } else {
      const animation = (
        /** @type {JSAnimation} */
        renderable
      );
      animation.pause();
      forEachChildren(animation, (tween) => {
        const tweenProperty = tween.property;
        const tweenTarget = tween.target;
        const tweenType = tween._tweenType;
        const originalInlinedValue = tween._inlineValue;
        const tweenHadNoInlineValue = isNil(originalInlinedValue) || originalInlinedValue === emptyString;
        if (tweenType === tweenTypes.OBJECT) {
          if (!inlineStylesOnly && !tweenHadNoInlineValue) {
            tweenTarget[tweenProperty] = originalInlinedValue;
          }
        } else if (tweenTarget[isDomSymbol]) {
          if (tweenType === tweenTypes.ATTRIBUTE) {
            if (!inlineStylesOnly) {
              if (tweenHadNoInlineValue) {
                tweenTarget.removeAttribute(tweenProperty);
              } else {
                tweenTarget.setAttribute(
                  tweenProperty,
                  /** @type {String} */
                  originalInlinedValue
                );
              }
            }
          } else {
            const targetStyle = (
              /** @type {DOMTarget} */
              tweenTarget.style
            );
            if (tweenType === tweenTypes.TRANSFORM) {
              const cachedTransforms = tweenTarget[transformsSymbol];
              if (tweenHadNoInlineValue) {
                delete cachedTransforms[tweenProperty];
              } else {
                cachedTransforms[tweenProperty] = originalInlinedValue;
              }
              if (tween._renderTransforms) {
                if (!Object.keys(cachedTransforms).length) {
                  targetStyle.removeProperty("transform");
                } else {
                  targetStyle.transform = buildTransformString(cachedTransforms);
                }
              }
            } else {
              if (tweenHadNoInlineValue) {
                targetStyle.removeProperty(toLowerCase(tweenProperty));
              } else {
                targetStyle[tweenProperty] = originalInlinedValue;
              }
            }
          }
        }
        if (tweenTarget[isDomSymbol] && animation._tail === tween) {
          animation.targets.forEach((t) => {
            if (t.getAttribute && t.getAttribute("style") === emptyString) {
              t.removeAttribute("style");
            }
          });
        }
      });
    }
    return renderable;
  };
  class Clock {
    /** @param {Number} [initTime] */
    constructor(initTime = 0) {
      this.deltaTime = 0;
      this._currentTime = initTime;
      this._lastTickTime = initTime;
      this._startTime = initTime;
      this._lastTime = initTime;
      this._scheduledTime = 0;
      this._frameDuration = K / maxFps;
      this._fps = maxFps;
      this._speed = 1;
      this._hasChildren = false;
      this._head = null;
      this._tail = null;
    }
    get fps() {
      return this._fps;
    }
    set fps(frameRate) {
      const previousFrameDuration = this._frameDuration;
      const fr = +frameRate;
      const fps = fr < minValue ? minValue : fr;
      const frameDuration = K / fps;
      if (fps > defaults.frameRate) defaults.frameRate = fps;
      this._fps = fps;
      this._frameDuration = frameDuration;
      this._scheduledTime += frameDuration - previousFrameDuration;
    }
    get speed() {
      return this._speed;
    }
    set speed(playbackRate) {
      const pbr = +playbackRate;
      this._speed = pbr < minValue ? minValue : pbr;
    }
    /**
     * @param  {Number} time
     * @return {tickModes}
     */
    requestTick(time) {
      const scheduledTime = this._scheduledTime;
      this._lastTickTime = time;
      if (time < scheduledTime) return tickModes.NONE;
      const frameDuration = this._frameDuration;
      const frameDelta = time - scheduledTime;
      this._scheduledTime += frameDelta < frameDuration ? frameDuration : frameDelta;
      return tickModes.AUTO;
    }
    /**
     * @param  {Number} time
     * @return {Number}
     */
    computeDeltaTime(time) {
      const delta = time - this._lastTime;
      this.deltaTime = delta;
      this._lastTime = time;
      return delta;
    }
  }
  const additive = {
    animation: null,
    update: noop
  };
  const addAdditiveAnimation = (lookups2) => {
    let animation = additive.animation;
    if (!animation) {
      animation = {
        duration: minValue,
        computeDeltaTime: noop,
        _offset: 0,
        _delay: 0,
        _head: null,
        _tail: null
      };
      additive.animation = animation;
      additive.update = () => {
        lookups2.forEach((propertyAnimation) => {
          for (let propertyName in propertyAnimation) {
            const tweens = propertyAnimation[propertyName];
            const lookupTween = tweens._head;
            if (lookupTween) {
              const valueType = lookupTween._valueType;
              const additiveValues = valueType === valueTypes.COMPLEX || valueType === valueTypes.COLOR ? cloneArray(lookupTween._fromNumbers) : null;
              let additiveValue = lookupTween._fromNumber;
              let tween = tweens._tail;
              while (tween && tween !== lookupTween) {
                if (additiveValues) {
                  for (let i = 0, l = tween._numbers.length; i < l; i++) additiveValues[i] += tween._numbers[i];
                } else {
                  additiveValue += tween._number;
                }
                tween = tween._prevAdd;
              }
              lookupTween._toNumber = additiveValue;
              lookupTween._toNumbers = additiveValues;
            }
          }
        });
        render(animation, 1, 1, 0, tickModes.FORCE);
      };
    }
    return animation;
  };
  const engineTickMethod = /* @__PURE__ */ (() => isBrowser ? requestAnimationFrame : setImmediate)();
  const engineCancelMethod = /* @__PURE__ */ (() => isBrowser ? cancelAnimationFrame : clearImmediate)();
  class Engine extends Clock {
    /** @param {Number} [initTime] */
    constructor(initTime) {
      super(initTime);
      this.useDefaultMainLoop = true;
      this.pauseOnDocumentHidden = true;
      this.defaults = defaults;
      this.paused = true;
      this.reqId = 0;
    }
    update() {
      const time = this._currentTime = now();
      if (this.requestTick(time)) {
        this.computeDeltaTime(time);
        const engineSpeed = this._speed;
        const engineFps = this._fps;
        let activeTickable = (
          /** @type {Tickable} */
          this._head
        );
        while (activeTickable) {
          const nextTickable = activeTickable._next;
          if (!activeTickable.paused) {
            tick(
              activeTickable,
              (time - activeTickable._startTime) * activeTickable._speed * engineSpeed,
              0,
              // !muteCallbacks
              0,
              // !internalRender
              activeTickable._fps < engineFps ? activeTickable.requestTick(time) : tickModes.AUTO
            );
          } else {
            removeChild(this, activeTickable);
            this._hasChildren = !!this._tail;
            activeTickable._running = false;
            if (activeTickable.completed && !activeTickable._cancelled) {
              activeTickable.cancel();
            }
          }
          activeTickable = nextTickable;
        }
        additive.update();
      }
    }
    wake() {
      if (this.useDefaultMainLoop && !this.reqId) {
        this.requestTick(now());
        this.reqId = engineTickMethod(tickEngine);
      }
      return this;
    }
    pause() {
      if (!this.reqId) return;
      this.paused = true;
      return killEngine();
    }
    resume() {
      if (!this.paused) return;
      this.paused = false;
      forEachChildren(this, (child) => child.resetTime());
      return this.wake();
    }
    // Getter and setter for speed
    get speed() {
      return this._speed * (globals.timeScale === 1 ? 1 : K);
    }
    set speed(playbackRate) {
      this._speed = playbackRate * globals.timeScale;
      forEachChildren(this, (child) => child.speed = child._speed);
    }
    // Getter and setter for timeUnit
    get timeUnit() {
      return globals.timeScale === 1 ? "ms" : "s";
    }
    set timeUnit(unit) {
      const secondsScale = 1e-3;
      const isSecond = unit === "s";
      const newScale = isSecond ? secondsScale : 1;
      if (globals.timeScale !== newScale) {
        globals.timeScale = newScale;
        globals.tickThreshold = 200 * newScale;
        const scaleFactor = isSecond ? secondsScale : K;
        this.defaults.duration *= scaleFactor;
        this._speed *= scaleFactor;
      }
    }
    // Getter and setter for precision
    get precision() {
      return globals.precision;
    }
    set precision(precision) {
      globals.precision = precision;
    }
  }
  const engine = /* @__PURE__ */ (() => {
    const engine2 = new Engine(now());
    if (isBrowser) {
      globalVersions.engine = engine2;
      doc.addEventListener("visibilitychange", () => {
        if (!engine2.pauseOnDocumentHidden) return;
        doc.hidden ? engine2.pause() : engine2.resume();
      });
    }
    return engine2;
  })();
  const tickEngine = () => {
    if (engine._head) {
      engine.reqId = engineTickMethod(tickEngine);
      engine.update();
    } else {
      engine.reqId = 0;
    }
  };
  const killEngine = () => {
    engineCancelMethod(
      /** @type {NodeJS.Immediate & Number} */
      engine.reqId
    );
    engine.reqId = 0;
    return engine;
  };
  const lookups = {
    /** @type {TweenReplaceLookups} */
    _rep: /* @__PURE__ */ new WeakMap(),
    /** @type {TweenAdditiveLookups} */
    _add: /* @__PURE__ */ new Map()
  };
  const getTweenSiblings = (target, property, lookup = "_rep") => {
    const lookupMap = lookups[lookup];
    let targetLookup = lookupMap.get(target);
    if (!targetLookup) {
      targetLookup = {};
      lookupMap.set(target, targetLookup);
    }
    return targetLookup[property] ? targetLookup[property] : targetLookup[property] = {
      _head: null,
      _tail: null
    };
  };
  const addTweenSortMethod = (p, c) => {
    return p._isOverridden || p._absoluteStartTime > c._absoluteStartTime;
  };
  const overrideTween = (tween) => {
    tween._isOverlapped = 1;
    tween._isOverridden = 1;
    tween._changeDuration = minValue;
    tween._currentTime = minValue;
  };
  const composeTween = (tween, siblings) => {
    const tweenCompositionType = tween._composition;
    if (tweenCompositionType === compositionTypes.replace) {
      const tweenAbsStartTime = tween._absoluteStartTime;
      addChild(siblings, tween, addTweenSortMethod, "_prevRep", "_nextRep");
      const prevSibling = tween._prevRep;
      if (prevSibling) {
        const prevParent = prevSibling.parent;
        const prevAbsEndTime = prevSibling._absoluteStartTime + prevSibling._changeDuration;
        if (
          // Check if the previous tween is from a different animation
          tween.parent.id !== prevParent.id && // Check if the animation has loops
          prevParent.iterationCount > 1 && // Check if _absoluteChangeEndTime of last loop overlaps the current tween
          prevAbsEndTime + (prevParent.duration - prevParent.iterationDuration) > tweenAbsStartTime
        ) {
          overrideTween(prevSibling);
          let prevPrevSibling = prevSibling._prevRep;
          while (prevPrevSibling && prevPrevSibling.parent.id === prevParent.id) {
            overrideTween(prevPrevSibling);
            prevPrevSibling = prevPrevSibling._prevRep;
          }
        }
        const absoluteUpdateStartTime = tweenAbsStartTime - tween._delay;
        if (prevAbsEndTime > absoluteUpdateStartTime) {
          const prevChangeStartTime = prevSibling._startTime;
          const prevTLOffset = prevAbsEndTime - (prevChangeStartTime + prevSibling._updateDuration);
          const updatedPrevChangeDuration = round(absoluteUpdateStartTime - prevTLOffset - prevChangeStartTime, 12);
          prevSibling._changeDuration = updatedPrevChangeDuration;
          prevSibling._currentTime = updatedPrevChangeDuration;
          prevSibling._isOverlapped = 1;
          if (updatedPrevChangeDuration < minValue) {
            overrideTween(prevSibling);
          }
        }
        let pausePrevParentAnimation = true;
        forEachChildren(prevParent, (t) => {
          if (!t._isOverlapped) pausePrevParentAnimation = false;
        });
        if (pausePrevParentAnimation) {
          const prevParentTL = prevParent.parent;
          if (prevParentTL) {
            let pausePrevParentTL = true;
            forEachChildren(prevParentTL, (a) => {
              if (a !== prevParent) {
                forEachChildren(a, (t) => {
                  if (!t._isOverlapped) pausePrevParentTL = false;
                });
              }
            });
            if (pausePrevParentTL) {
              prevParentTL.cancel();
            }
          } else {
            prevParent.cancel();
          }
        }
      }
    } else if (tweenCompositionType === compositionTypes.blend) {
      const additiveTweenSiblings = getTweenSiblings(tween.target, tween.property, "_add");
      const additiveAnimation = addAdditiveAnimation(lookups._add);
      let lookupTween = additiveTweenSiblings._head;
      if (!lookupTween) {
        lookupTween = { ...tween };
        lookupTween._composition = compositionTypes.replace;
        lookupTween._updateDuration = minValue;
        lookupTween._startTime = 0;
        lookupTween._numbers = cloneArray(tween._fromNumbers);
        lookupTween._number = 0;
        lookupTween._next = null;
        lookupTween._prev = null;
        addChild(additiveTweenSiblings, lookupTween);
        addChild(additiveAnimation, lookupTween);
      }
      const toNumber = tween._toNumber;
      tween._fromNumber = lookupTween._fromNumber - toNumber;
      tween._toNumber = 0;
      tween._numbers = cloneArray(tween._fromNumbers);
      tween._number = 0;
      lookupTween._fromNumber = toNumber;
      if (tween._toNumbers) {
        const toNumbers = cloneArray(tween._toNumbers);
        if (toNumbers) {
          toNumbers.forEach((value, i) => {
            tween._fromNumbers[i] = lookupTween._fromNumbers[i] - value;
            tween._toNumbers[i] = 0;
          });
        }
        lookupTween._fromNumbers = toNumbers;
      }
      addChild(additiveTweenSiblings, tween, null, "_prevAdd", "_nextAdd");
    }
    return tween;
  };
  const removeTweenSliblings = (tween) => {
    const tweenComposition = tween._composition;
    if (tweenComposition !== compositionTypes.none) {
      const tweenTarget = tween.target;
      const tweenProperty = tween.property;
      const replaceTweensLookup = lookups._rep;
      const replaceTargetProps = replaceTweensLookup.get(tweenTarget);
      const tweenReplaceSiblings = replaceTargetProps[tweenProperty];
      removeChild(tweenReplaceSiblings, tween, "_prevRep", "_nextRep");
      if (tweenComposition === compositionTypes.blend) {
        const addTweensLookup = lookups._add;
        const addTargetProps = addTweensLookup.get(tweenTarget);
        if (!addTargetProps) return;
        const additiveTweenSiblings = addTargetProps[tweenProperty];
        const additiveAnimation = additive.animation;
        removeChild(additiveTweenSiblings, tween, "_prevAdd", "_nextAdd");
        const lookupTween = additiveTweenSiblings._head;
        if (lookupTween && lookupTween === additiveTweenSiblings._tail) {
          removeChild(additiveTweenSiblings, lookupTween, "_prevAdd", "_nextAdd");
          removeChild(additiveAnimation, lookupTween);
          let shouldClean = true;
          for (let prop in addTargetProps) {
            if (addTargetProps[prop]._head) {
              shouldClean = false;
              break;
            }
          }
          if (shouldClean) {
            addTweensLookup.delete(tweenTarget);
          }
        }
      }
    }
    return tween;
  };
  const resetTimerProperties = (timer) => {
    timer.paused = true;
    timer.began = false;
    timer.completed = false;
    return timer;
  };
  const reviveTimer = (timer) => {
    if (!timer._cancelled) return timer;
    if (timer._hasChildren) {
      forEachChildren(timer, reviveTimer);
    } else {
      forEachChildren(timer, (tween) => {
        if (tween._composition !== compositionTypes.none) {
          composeTween(tween, getTweenSiblings(tween.target, tween.property));
        }
      });
    }
    timer._cancelled = 0;
    return timer;
  };
  let timerId = 0;
  const sortByPriority = (prev, child) => prev._priority > child._priority;
  class Timer extends Clock {
    /**
     * @param {TimerParams} [parameters]
     * @param {Timeline} [parent]
     * @param {Number} [parentPosition]
     */
    constructor(parameters = {}, parent = null, parentPosition = 0) {
      super(0);
      ++timerId;
      const {
        id,
        delay,
        duration,
        reversed,
        alternate,
        loop,
        loopDelay,
        autoplay,
        frameRate,
        playbackRate,
        priority,
        onComplete,
        onLoop,
        onPause,
        onBegin,
        onBeforeUpdate,
        onUpdate
      } = parameters;
      const timerInitTime = parent ? 0 : engine._lastTickTime;
      const timerDefaults = parent ? parent.defaults : globals.defaults;
      const timerDelay = (
        /** @type {Number} */
        isFnc(delay) || isUnd(delay) ? timerDefaults.delay : +delay
      );
      const timerDuration = isFnc(duration) || isUnd(duration) ? Infinity : +duration;
      const timerLoop = setValue(loop, timerDefaults.loop);
      const timerLoopDelay = setValue(loopDelay, timerDefaults.loopDelay);
      let timerIterationCount = timerLoop === true || timerLoop === Infinity || /** @type {Number} */
      timerLoop < 0 ? Infinity : (
        /** @type {Number} */
        timerLoop + 1
      );
      let offsetPosition = 0;
      if (parent) {
        offsetPosition = parentPosition;
      } else {
        if (!engine.reqId) engine.requestTick(now());
        offsetPosition = (engine._lastTickTime - engine._startTime) * globals.timeScale;
      }
      this.id = !isUnd(id) ? id : timerId;
      this.parent = parent;
      this.duration = clampInfinity((timerDuration + timerLoopDelay) * timerIterationCount - timerLoopDelay) || minValue;
      this.backwards = false;
      this.paused = true;
      this.began = false;
      this.completed = false;
      this.onBegin = onBegin || timerDefaults.onBegin;
      this.onBeforeUpdate = onBeforeUpdate || timerDefaults.onBeforeUpdate;
      this.onUpdate = onUpdate || timerDefaults.onUpdate;
      this.onLoop = onLoop || timerDefaults.onLoop;
      this.onPause = onPause || timerDefaults.onPause;
      this.onComplete = onComplete || timerDefaults.onComplete;
      this.iterationDuration = timerDuration;
      this.iterationCount = timerIterationCount;
      this._autoplay = parent ? false : setValue(autoplay, timerDefaults.autoplay);
      this._offset = offsetPosition;
      this._delay = timerDelay;
      this._loopDelay = timerLoopDelay;
      this._iterationTime = 0;
      this._currentIteration = 0;
      this._resolve = noop;
      this._running = false;
      this._reversed = +setValue(reversed, timerDefaults.reversed);
      this._reverse = this._reversed;
      this._cancelled = 0;
      this._alternate = setValue(alternate, timerDefaults.alternate);
      this._prev = null;
      this._next = null;
      this._lastTickTime = timerInitTime;
      this._startTime = timerInitTime;
      this._lastTime = timerInitTime;
      this._fps = setValue(frameRate, timerDefaults.frameRate);
      this._speed = setValue(playbackRate, timerDefaults.playbackRate);
      this._priority = +setValue(priority, 1);
    }
    get cancelled() {
      return !!this._cancelled;
    }
    set cancelled(cancelled) {
      cancelled ? this.cancel() : this.reset(true).play();
    }
    get currentTime() {
      return clamp$1(round(this._currentTime, globals.precision), -this._delay, this.duration);
    }
    set currentTime(time) {
      const paused = this.paused;
      this.pause().seek(+time);
      if (!paused) this.resume();
    }
    get iterationCurrentTime() {
      return clamp$1(round(this._iterationTime, globals.precision), 0, this.iterationDuration);
    }
    set iterationCurrentTime(time) {
      this.currentTime = this.iterationDuration * this._currentIteration + time;
    }
    get progress() {
      return clamp$1(round(this._currentTime / this.duration, 10), 0, 1);
    }
    set progress(progress) {
      this.currentTime = this.duration * progress;
    }
    get iterationProgress() {
      return clamp$1(round(this._iterationTime / this.iterationDuration, 10), 0, 1);
    }
    set iterationProgress(progress) {
      const iterationDuration = this.iterationDuration;
      this.currentTime = iterationDuration * this._currentIteration + iterationDuration * progress;
    }
    get currentIteration() {
      return this._currentIteration;
    }
    set currentIteration(iterationCount) {
      this.currentTime = this.iterationDuration * clamp$1(+iterationCount, 0, this.iterationCount - 1);
    }
    get reversed() {
      return !!this._reversed;
    }
    set reversed(reverse) {
      reverse ? this.reverse() : this.play();
    }
    get speed() {
      return super.speed;
    }
    set speed(playbackRate) {
      super.speed = playbackRate;
      this.resetTime();
    }
    /**
     * @param  {Boolean} [softReset]
     * @return {this}
     */
    reset(softReset = false) {
      reviveTimer(this);
      if (this._reversed && !this._reverse) this.reversed = false;
      this._iterationTime = this.iterationDuration;
      tick(this, 0, 1, ~~softReset, tickModes.FORCE);
      resetTimerProperties(this);
      if (this._hasChildren) {
        forEachChildren(this, resetTimerProperties);
      }
      return this;
    }
    /**
     * @param  {Boolean} internalRender
     * @return {this}
     */
    init(internalRender = false) {
      this.fps = this._fps;
      this.speed = this._speed;
      if (!internalRender && this._hasChildren) {
        tick(this, this.duration, 1, ~~internalRender, tickModes.FORCE);
      }
      this.reset(internalRender);
      const autoplay = this._autoplay;
      if (autoplay === true) {
        this.resume();
      } else if (autoplay && !isUnd(
        /** @type {ScrollObserver} */
        autoplay.linked
      )) {
        autoplay.link(this);
      }
      return this;
    }
    /** @return {this} */
    resetTime() {
      const timeScale = 1 / (this._speed * engine._speed);
      this._startTime = now() - (this._currentTime + this._delay) * timeScale;
      return this;
    }
    /** @return {this} */
    pause() {
      if (this.paused) return this;
      this.paused = true;
      this.onPause(this);
      return this;
    }
    /** @return {this} */
    resume() {
      if (!this.paused) return this;
      this.paused = false;
      if (this.duration <= minValue && !this._hasChildren) {
        tick(this, minValue, 0, 0, tickModes.FORCE);
      } else {
        if (!this._running) {
          addChild(engine, this, sortByPriority);
          engine._hasChildren = true;
          this._running = true;
        }
        this.resetTime();
        this._startTime -= 12;
        engine.wake();
      }
      return this;
    }
    /** @return {this} */
    restart() {
      return this.reset().resume();
    }
    /**
     * @param  {Number} time
     * @param  {Boolean|Number} [muteCallbacks]
     * @param  {Boolean|Number} [internalRender]
     * @return {this}
     */
    seek(time, muteCallbacks = 0, internalRender = 0) {
      reviveTimer(this);
      this.completed = false;
      const isPaused = this.paused;
      this.paused = true;
      tick(this, time + this._delay, ~~muteCallbacks, ~~internalRender, tickModes.AUTO);
      return isPaused ? this : this.resume();
    }
    /** @return {this} */
    alternate() {
      const reversed = this._reversed;
      const count = this.iterationCount;
      const duration = this.iterationDuration;
      const iterations = count === Infinity ? floor(maxValue / duration) : count;
      this._reversed = +(this._alternate && !(iterations % 2) ? reversed : !reversed);
      if (count === Infinity) {
        this.iterationProgress = this._reversed ? 1 - this.iterationProgress : this.iterationProgress;
      } else {
        this.seek(duration * iterations - this._currentTime);
      }
      this.resetTime();
      return this;
    }
    /** @return {this} */
    play() {
      if (this._reversed) this.alternate();
      return this.resume();
    }
    /** @return {this} */
    reverse() {
      if (!this._reversed) this.alternate();
      return this.resume();
    }
    // TODO: Move all the animation / tweens / children related code to Animation / Timeline
    /** @return {this} */
    cancel() {
      if (this._hasChildren) {
        forEachChildren(this, (child) => child.cancel(), true);
      } else {
        forEachChildren(this, removeTweenSliblings);
      }
      this._cancelled = 1;
      return this.pause();
    }
    /**
     * @param  {Number} newDuration
     * @return {this}
     */
    stretch(newDuration) {
      const currentDuration = this.duration;
      const normlizedDuration = normalizeTime(newDuration);
      if (currentDuration === normlizedDuration) return this;
      const timeScale = newDuration / currentDuration;
      const isSetter = newDuration <= minValue;
      this.duration = isSetter ? minValue : normlizedDuration;
      this.iterationDuration = isSetter ? minValue : normalizeTime(this.iterationDuration * timeScale);
      this._offset *= timeScale;
      this._delay *= timeScale;
      this._loopDelay *= timeScale;
      return this;
    }
    /**
      * Cancels the timer by seeking it back to 0 and reverting the attached scroller if necessary
      * @return {this}
      */
    revert() {
      tick(this, 0, 1, 0, tickModes.AUTO);
      const ap = (
        /** @type {ScrollObserver} */
        this._autoplay
      );
      if (ap && ap.linked && ap.linked === this) ap.revert();
      return this.cancel();
    }
    /**
      * Imediatly completes the timer, cancels it and triggers the onComplete callback
      * @param  {Boolean|Number} [muteCallbacks]
      * @return {this}
      */
    complete(muteCallbacks = 0) {
      return this.seek(this.duration, muteCallbacks).cancel();
    }
    /**
     * @typedef {this & {then: null}} ResolvedTimer
     */
    /**
     * @param  {Callback<ResolvedTimer>} [callback]
     * @return Promise<this>
     */
    then(callback = noop) {
      const then = this.then;
      const onResolve = () => {
        this.then = null;
        callback(
          /** @type {ResolvedTimer} */
          this
        );
        this.then = then;
        this._resolve = noop;
      };
      return new Promise((r) => {
        this._resolve = () => r(onResolve());
        if (this.completed) this._resolve();
        return this;
      });
    }
  }
  const fromTargetObject = createDecomposedValueTargetObject();
  const toTargetObject = createDecomposedValueTargetObject();
  const inlineStylesStore = {};
  const toFunctionStore = { func: null };
  const fromFunctionStore = { func: null };
  const keyframesTargetArray = [null];
  const fastSetValuesArray = [null, null];
  const keyObjectTarget = { to: null };
  let tweenId = 0;
  let JSAnimationId = 0;
  let keyframes;
  let key;
  const generateKeyframes = (keyframes2, parameters) => {
    const properties = {};
    if (isArr(keyframes2)) {
      const propertyNames = [].concat(.../** @type {DurationKeyframes} */
      keyframes2.map((key2) => Object.keys(key2))).filter(isKey);
      for (let i = 0, l = propertyNames.length; i < l; i++) {
        const propName = propertyNames[i];
        const propArray = (
          /** @type {DurationKeyframes} */
          keyframes2.map((key2) => {
            const newKey = {};
            for (let p in key2) {
              const keyValue = (
                /** @type {TweenPropValue} */
                key2[p]
              );
              if (isKey(p)) {
                if (p === propName) {
                  newKey.to = keyValue;
                }
              } else {
                newKey[p] = keyValue;
              }
            }
            return newKey;
          })
        );
        properties[propName] = /** @type {ArraySyntaxValue} */
        propArray;
      }
    } else {
      const totalDuration = (
        /** @type {Number} */
        setValue(parameters.duration, globals.defaults.duration)
      );
      const keys = Object.keys(keyframes2).map((key2) => {
        return { o: parseFloat(key2) / 100, p: keyframes2[key2] };
      }).sort((a, b) => a.o - b.o);
      keys.forEach((key2) => {
        const offset = key2.o;
        const prop = key2.p;
        for (let name in prop) {
          if (isKey(name)) {
            let propArray = (
              /** @type {Array} */
              properties[name]
            );
            if (!propArray) propArray = properties[name] = [];
            const duration = offset * totalDuration;
            let length = propArray.length;
            let prevKey = propArray[length - 1];
            const keyObj = { to: prop[name] };
            let durProgress = 0;
            for (let i = 0; i < length; i++) {
              durProgress += propArray[i].duration;
            }
            if (length === 1) {
              keyObj.from = prevKey.to;
            }
            if (prop.ease) {
              keyObj.ease = prop.ease;
            }
            keyObj.duration = duration - (length ? durProgress : 0);
            propArray.push(keyObj);
          }
        }
        return key2;
      });
      for (let name in properties) {
        const propArray = (
          /** @type {Array} */
          properties[name]
        );
        let prevEase;
        for (let i = 0, l = propArray.length; i < l; i++) {
          const prop = propArray[i];
          const currentEase = prop.ease;
          prop.ease = prevEase ? prevEase : void 0;
          prevEase = currentEase;
        }
        if (!propArray[0].duration) {
          propArray.shift();
        }
      }
    }
    return properties;
  };
  class JSAnimation extends Timer {
    /**
     * @param {TargetsParam} targets
     * @param {AnimationParams} parameters
     * @param {Timeline} [parent]
     * @param {Number} [parentPosition]
     * @param {Boolean} [fastSet=false]
     * @param {Number} [index=0]
     * @param {TargetsArray} [allTargets]
     */
    constructor(targets, parameters, parent, parentPosition, fastSet = false, index = 0, allTargets) {
      super(
        /** @type {TimerParams & AnimationParams} */
        parameters,
        parent,
        parentPosition
      );
      ++JSAnimationId;
      const parsedTargets = registerTargets(targets);
      const targetsLength = parsedTargets.length;
      const kfParams = (
        /** @type {AnimationParams} */
        parameters.keyframes
      );
      const params = (
        /** @type {AnimationParams} */
        kfParams ? mergeObjects(generateKeyframes(
          /** @type {DurationKeyframes} */
          kfParams,
          parameters
        ), parameters) : parameters
      );
      const {
        id,
        delay,
        duration,
        ease,
        playbackEase,
        modifier,
        composition,
        onRender
      } = params;
      const animDefaults = parent ? parent.defaults : globals.defaults;
      const animEase = setValue(ease, animDefaults.ease);
      const animPlaybackEase = setValue(playbackEase, animDefaults.playbackEase);
      const parsedAnimPlaybackEase = animPlaybackEase ? parseEase(animPlaybackEase) : null;
      const hasSpring = !isUnd(
        /** @type {Spring} */
        animEase.ease
      );
      const tEasing = hasSpring ? (
        /** @type {Spring} */
        animEase.ease
      ) : setValue(ease, parsedAnimPlaybackEase ? "linear" : animDefaults.ease);
      const tDuration = hasSpring ? (
        /** @type {Spring} */
        animEase.settlingDuration
      ) : setValue(duration, animDefaults.duration);
      const tDelay = setValue(delay, animDefaults.delay);
      const tModifier = modifier || animDefaults.modifier;
      const tComposition = isUnd(composition) && targetsLength >= K ? compositionTypes.none : !isUnd(composition) ? composition : animDefaults.composition;
      const absoluteOffsetTime = this._offset + (parent ? parent._offset : 0);
      if (hasSpring) animEase.parent = this;
      let iterationDuration = NaN;
      let iterationDelay = NaN;
      let animationAnimationLength = 0;
      let shouldTriggerRender = 0;
      for (let targetIndex = 0; targetIndex < targetsLength; targetIndex++) {
        const target = parsedTargets[targetIndex];
        const ti = index || targetIndex;
        const tl = allTargets || parsedTargets;
        let lastTransformGroupIndex = NaN;
        let lastTransformGroupLength = NaN;
        for (let p in params) {
          if (isKey(p)) {
            const tweenType = getTweenType(target, p);
            const propName = sanitizePropertyName(p, target, tweenType);
            let propValue = params[p];
            const isPropValueArray = isArr(propValue);
            if (fastSet && !isPropValueArray) {
              fastSetValuesArray[0] = propValue;
              fastSetValuesArray[1] = propValue;
              propValue = fastSetValuesArray;
            }
            if (isPropValueArray) {
              const arrayLength = (
                /** @type {Array} */
                propValue.length
              );
              const isNotObjectValue = !isObj(propValue[0]);
              if (arrayLength === 2 && isNotObjectValue) {
                keyObjectTarget.to = /** @type {TweenParamValue} */
                /** @type {unknown} */
                propValue;
                keyframesTargetArray[0] = keyObjectTarget;
                keyframes = keyframesTargetArray;
              } else if (arrayLength > 2 && isNotObjectValue) {
                keyframes = [];
                propValue.forEach((v, i) => {
                  if (!i) {
                    fastSetValuesArray[0] = v;
                  } else if (i === 1) {
                    fastSetValuesArray[1] = v;
                    keyframes.push(fastSetValuesArray);
                  } else {
                    keyframes.push(v);
                  }
                });
              } else {
                keyframes = /** @type {Array.<TweenKeyValue>} */
                propValue;
              }
            } else {
              keyframesTargetArray[0] = propValue;
              keyframes = keyframesTargetArray;
            }
            let siblings = null;
            let prevTween = null;
            let firstTweenChangeStartTime = NaN;
            let lastTweenChangeEndTime = 0;
            let tweenIndex = 0;
            for (let l = keyframes.length; tweenIndex < l; tweenIndex++) {
              const keyframe = keyframes[tweenIndex];
              if (isObj(keyframe)) {
                key = keyframe;
              } else {
                keyObjectTarget.to = /** @type {TweenParamValue} */
                keyframe;
                key = keyObjectTarget;
              }
              toFunctionStore.func = null;
              fromFunctionStore.func = null;
              const computedComposition = getFunctionValue(setValue(key.composition, tComposition), target, ti, tl, null, null);
              const tweenComposition = isNum(computedComposition) ? computedComposition : compositionTypes[computedComposition];
              if (!siblings && tweenComposition !== compositionTypes.none) siblings = getTweenSiblings(target, propName);
              const tailTween = siblings ? siblings._tail : null;
              const prevSiblingTween = parent && tailTween && tailTween.parent.parent === parent ? tailTween : prevTween;
              const computedToValue = getFunctionValue(key.to, target, ti, tl, toFunctionStore, prevSiblingTween);
              let tweenToValue;
              if (isObj(computedToValue) && !isUnd(computedToValue.to)) {
                key = computedToValue;
                tweenToValue = computedToValue.to;
              } else {
                tweenToValue = computedToValue;
              }
              const tweenFromValue = getFunctionValue(key.from, target, ti, tl, null, prevSiblingTween);
              const easeToParse = key.ease || tEasing;
              const easeFunctionResult = getFunctionValue(easeToParse, target, ti, tl, null, prevSiblingTween);
              const keyEasing = isFnc(easeFunctionResult) || isStr(easeFunctionResult) ? easeFunctionResult : easeToParse;
              const hasSpring2 = !isUnd(keyEasing) && !isUnd(
                /** @type {Spring} */
                keyEasing.ease
              );
              const tweenEasing = hasSpring2 ? (
                /** @type {Spring} */
                keyEasing.ease
              ) : keyEasing;
              const tweenDuration = hasSpring2 ? (
                /** @type {Spring} */
                keyEasing.settlingDuration
              ) : getFunctionValue(setValue(key.duration, l > 1 ? getFunctionValue(tDuration, target, ti, tl, null, prevSiblingTween) / l : tDuration), target, ti, tl, null, prevSiblingTween);
              const tweenDelay = getFunctionValue(setValue(key.delay, !tweenIndex ? tDelay : 0), target, ti, tl, null, prevSiblingTween);
              const tweenModifier = key.modifier || tModifier;
              const hasFromvalue = !isUnd(tweenFromValue);
              const hasToValue = !isUnd(tweenToValue);
              const isFromToArray = isArr(tweenToValue);
              const isFromToValue = isFromToArray || hasFromvalue && hasToValue;
              const tweenStartTime = prevTween ? lastTweenChangeEndTime + tweenDelay : tweenDelay;
              const absoluteStartTime = round(absoluteOffsetTime + tweenStartTime, 12);
              if (!shouldTriggerRender && (hasFromvalue || isFromToArray)) shouldTriggerRender = 1;
              let prevSibling = prevTween;
              if (tweenComposition !== compositionTypes.none) {
                let nextSibling = siblings._head;
                while (nextSibling && !nextSibling._isOverridden && nextSibling._absoluteStartTime <= absoluteStartTime) {
                  prevSibling = nextSibling;
                  nextSibling = nextSibling._nextRep;
                  if (nextSibling && nextSibling._absoluteStartTime >= absoluteStartTime) {
                    while (nextSibling) {
                      overrideTween(nextSibling);
                      nextSibling = nextSibling._nextRep;
                    }
                  }
                }
              }
              if (isFromToValue) {
                decomposeRawValue(isFromToArray ? getFunctionValue(tweenToValue[0], target, ti, tl, fromFunctionStore, prevSiblingTween) : tweenFromValue, fromTargetObject);
                decomposeRawValue(isFromToArray ? getFunctionValue(tweenToValue[1], target, ti, tl, toFunctionStore, prevSiblingTween) : tweenToValue, toTargetObject);
                const originalValue = getOriginalAnimatableValue(target, propName, tweenType, inlineStylesStore);
                if (fromTargetObject.t === valueTypes.NUMBER) {
                  if (prevSibling) {
                    if (prevSibling._valueType === valueTypes.UNIT) {
                      fromTargetObject.t = valueTypes.UNIT;
                      fromTargetObject.u = prevSibling._unit;
                    }
                  } else {
                    decomposeRawValue(
                      originalValue,
                      decomposedOriginalValue
                    );
                    if (decomposedOriginalValue.t === valueTypes.UNIT) {
                      fromTargetObject.t = valueTypes.UNIT;
                      fromTargetObject.u = decomposedOriginalValue.u;
                    }
                  }
                }
              } else {
                if (hasToValue) {
                  decomposeRawValue(tweenToValue, toTargetObject);
                } else {
                  if (prevTween) {
                    decomposeTweenValue(prevTween, toTargetObject);
                  } else {
                    decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : getOriginalAnimatableValue(target, propName, tweenType, inlineStylesStore), toTargetObject);
                  }
                }
                if (hasFromvalue) {
                  decomposeRawValue(tweenFromValue, fromTargetObject);
                } else {
                  if (prevTween) {
                    decomposeTweenValue(prevTween, fromTargetObject);
                  } else {
                    decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : (
                      // No need to get and parse the original value if the tween is part of a timeline and has a previous sibling part of the same timeline
                      getOriginalAnimatableValue(target, propName, tweenType, inlineStylesStore)
                    ), fromTargetObject);
                  }
                }
              }
              if (fromTargetObject.o) {
                fromTargetObject.n = getRelativeValue(
                  !prevSibling ? decomposeRawValue(
                    getOriginalAnimatableValue(target, propName, tweenType, inlineStylesStore),
                    decomposedOriginalValue
                  ).n : prevSibling._toNumber,
                  fromTargetObject.n,
                  fromTargetObject.o
                );
              }
              if (toTargetObject.o) {
                toTargetObject.n = getRelativeValue(fromTargetObject.n, toTargetObject.n, toTargetObject.o);
              }
              if (fromTargetObject.t !== toTargetObject.t) {
                if (fromTargetObject.t === valueTypes.COMPLEX || toTargetObject.t === valueTypes.COMPLEX) {
                  const complexValue = fromTargetObject.t === valueTypes.COMPLEX ? fromTargetObject : toTargetObject;
                  const notComplexValue = fromTargetObject.t === valueTypes.COMPLEX ? toTargetObject : fromTargetObject;
                  notComplexValue.t = valueTypes.COMPLEX;
                  notComplexValue.s = cloneArray(complexValue.s);
                  notComplexValue.d = complexValue.d.map(() => notComplexValue.n);
                } else if (fromTargetObject.t === valueTypes.UNIT || toTargetObject.t === valueTypes.UNIT) {
                  const unitValue = fromTargetObject.t === valueTypes.UNIT ? fromTargetObject : toTargetObject;
                  const notUnitValue = fromTargetObject.t === valueTypes.UNIT ? toTargetObject : fromTargetObject;
                  notUnitValue.t = valueTypes.UNIT;
                  notUnitValue.u = unitValue.u;
                } else if (fromTargetObject.t === valueTypes.COLOR || toTargetObject.t === valueTypes.COLOR) {
                  const colorValue = fromTargetObject.t === valueTypes.COLOR ? fromTargetObject : toTargetObject;
                  const notColorValue = fromTargetObject.t === valueTypes.COLOR ? toTargetObject : fromTargetObject;
                  notColorValue.t = valueTypes.COLOR;
                  notColorValue.s = colorValue.s;
                  notColorValue.d = [0, 0, 0, 1];
                }
              }
              if (fromTargetObject.u !== toTargetObject.u) {
                let valueToConvert = toTargetObject.u ? fromTargetObject : toTargetObject;
                valueToConvert = convertValueUnit(
                  /** @type {DOMTarget} */
                  target,
                  valueToConvert,
                  toTargetObject.u ? toTargetObject.u : fromTargetObject.u,
                  false
                );
              }
              if (toTargetObject.d && fromTargetObject.d && toTargetObject.d.length !== fromTargetObject.d.length) {
                const longestValue = fromTargetObject.d.length > toTargetObject.d.length ? fromTargetObject : toTargetObject;
                const shortestValue = longestValue === fromTargetObject ? toTargetObject : fromTargetObject;
                shortestValue.d = longestValue.d.map((_, i) => isUnd(shortestValue.d[i]) ? 0 : shortestValue.d[i]);
                shortestValue.s = cloneArray(longestValue.s);
              }
              const tweenUpdateDuration = round(+tweenDuration || minValue, 12);
              let inlineValue = inlineStylesStore[propName];
              if (!isNil(inlineValue)) inlineStylesStore[propName] = null;
              const tween = {
                parent: this,
                id: tweenId++,
                property: propName,
                target,
                _value: null,
                _toFunc: toFunctionStore.func,
                _fromFunc: fromFunctionStore.func,
                _ease: parseEase(tweenEasing),
                _fromNumbers: cloneArray(fromTargetObject.d),
                _toNumbers: cloneArray(toTargetObject.d),
                _strings: cloneArray(toTargetObject.s),
                _fromNumber: fromTargetObject.n,
                _toNumber: toTargetObject.n,
                _numbers: cloneArray(fromTargetObject.d),
                // For additive tween and animatables
                _number: fromTargetObject.n,
                // For additive tween and animatables
                _unit: toTargetObject.u,
                _modifier: tweenModifier,
                _currentTime: 0,
                _startTime: tweenStartTime,
                _delay: +tweenDelay,
                _updateDuration: tweenUpdateDuration,
                _changeDuration: tweenUpdateDuration,
                _absoluteStartTime: absoluteStartTime,
                // NOTE: Investigate bit packing to stores ENUM / BOOL
                _tweenType: tweenType,
                _valueType: toTargetObject.t,
                _composition: tweenComposition,
                _isOverlapped: 0,
                _isOverridden: 0,
                _renderTransforms: 0,
                _inlineValue: inlineValue,
                _prevRep: null,
                // For replaced tween
                _nextRep: null,
                // For replaced tween
                _prevAdd: null,
                // For additive tween
                _nextAdd: null,
                // For additive tween
                _prev: null,
                _next: null
              };
              if (tweenComposition !== compositionTypes.none) {
                composeTween(tween, siblings);
              }
              const vt = tween._valueType;
              if (vt === valueTypes.COMPLEX) {
                tween._value = composeComplexValue(tween, 1, -1);
              } else if (vt === valueTypes.COLOR) {
                tween._value = composeColorValue(tween, 1, -1);
              } else if (vt === valueTypes.UNIT) {
                tween._value = `${tweenModifier(tween._toNumber)}${tween._unit}`;
              } else {
                tween._value = tweenModifier(tween._toNumber);
              }
              if (isNaN(firstTweenChangeStartTime)) {
                firstTweenChangeStartTime = tween._startTime;
              }
              lastTweenChangeEndTime = round(tweenStartTime + tweenUpdateDuration, 12);
              prevTween = tween;
              animationAnimationLength++;
              addChild(this, tween);
            }
            if (isNaN(iterationDelay) || firstTweenChangeStartTime < iterationDelay) {
              iterationDelay = firstTweenChangeStartTime;
            }
            if (isNaN(iterationDuration) || lastTweenChangeEndTime > iterationDuration) {
              iterationDuration = lastTweenChangeEndTime;
            }
            if (tweenType === tweenTypes.TRANSFORM) {
              lastTransformGroupIndex = animationAnimationLength - tweenIndex;
              lastTransformGroupLength = animationAnimationLength;
            }
          }
        }
        if (!isNaN(lastTransformGroupIndex)) {
          let i = 0;
          forEachChildren(this, (tween) => {
            if (i >= lastTransformGroupIndex && i < lastTransformGroupLength) {
              tween._renderTransforms = 1;
              if (tween._composition === compositionTypes.blend) {
                forEachChildren(additive.animation, (additiveTween) => {
                  if (additiveTween.id === tween.id) {
                    additiveTween._renderTransforms = 1;
                  }
                });
              }
            }
            i++;
          });
        }
      }
      if (!targetsLength) {
        console.warn(`No target found. Make sure the element you're trying to animate is accessible before creating your animation.`);
      }
      if (iterationDelay) {
        forEachChildren(this, (tween) => {
          if (!(tween._startTime - tween._delay)) {
            tween._delay -= iterationDelay;
          }
          tween._startTime -= iterationDelay;
        });
        iterationDuration -= iterationDelay;
      } else {
        iterationDelay = 0;
      }
      if (!iterationDuration) {
        iterationDuration = minValue;
        this.iterationCount = 0;
      }
      this.targets = parsedTargets;
      this.id = !isUnd(id) ? id : JSAnimationId;
      this.duration = iterationDuration === minValue ? minValue : clampInfinity((iterationDuration + this._loopDelay) * this.iterationCount - this._loopDelay) || minValue;
      this.onRender = onRender || animDefaults.onRender;
      this._ease = parsedAnimPlaybackEase;
      this._delay = iterationDelay;
      this.iterationDuration = iterationDuration;
      if (!this._autoplay && shouldTriggerRender) this.onRender(this);
    }
    /**
     * @param  {Number} newDuration
     * @return {this}
     */
    stretch(newDuration) {
      const currentDuration = this.duration;
      if (currentDuration === normalizeTime(newDuration)) return this;
      const timeScale = newDuration / currentDuration;
      forEachChildren(this, (tween) => {
        tween._updateDuration = normalizeTime(tween._updateDuration * timeScale);
        tween._changeDuration = normalizeTime(tween._changeDuration * timeScale);
        tween._currentTime *= timeScale;
        tween._startTime *= timeScale;
        tween._absoluteStartTime *= timeScale;
      });
      return super.stretch(newDuration);
    }
    /**
     * @return {this}
     */
    refresh() {
      forEachChildren(this, (tween) => {
        const toFunc = tween._toFunc;
        const fromFunc = tween._fromFunc;
        if (toFunc || fromFunc) {
          if (fromFunc) {
            decomposeRawValue(fromFunc(), fromTargetObject);
            if (fromTargetObject.u !== tween._unit && tween.target[isDomSymbol]) {
              convertValueUnit(
                /** @type {DOMTarget} */
                tween.target,
                fromTargetObject,
                tween._unit,
                true
              );
            }
            tween._fromNumbers = cloneArray(fromTargetObject.d);
            tween._fromNumber = fromTargetObject.n;
          } else if (toFunc) {
            decomposeRawValue(getOriginalAnimatableValue(tween.target, tween.property, tween._tweenType), decomposedOriginalValue);
            tween._fromNumbers = cloneArray(decomposedOriginalValue.d);
            tween._fromNumber = decomposedOriginalValue.n;
          }
          if (toFunc) {
            decomposeRawValue(toFunc(), toTargetObject);
            tween._toNumbers = cloneArray(toTargetObject.d);
            tween._strings = cloneArray(toTargetObject.s);
            tween._toNumber = toTargetObject.o ? getRelativeValue(tween._fromNumber, toTargetObject.n, toTargetObject.o) : toTargetObject.n;
          }
        }
      });
      if (this.duration === minValue) this.restart();
      return this;
    }
    /**
     * Cancel the animation and revert all the values affected by this animation to their original state
     * @return {this}
     */
    revert() {
      super.revert();
      return revertValues(this);
    }
    /**
     * @typedef {this & {then: null}} ResolvedJSAnimation
     */
    /**
     * @param  {Callback<ResolvedJSAnimation>} [callback]
     * @return Promise<this>
     */
    then(callback) {
      return super.then(callback);
    }
  }
  function get(targetSelector, propName, unit) {
    const targets = registerTargets(targetSelector);
    if (!targets.length) return;
    const [target] = targets;
    const tweenType = getTweenType(target, propName);
    const normalizePropName = sanitizePropertyName(propName, target, tweenType);
    let originalValue = getOriginalAnimatableValue(target, normalizePropName);
    if (isUnd(unit)) {
      return originalValue;
    } else {
      decomposeRawValue(originalValue, decomposedOriginalValue);
      if (decomposedOriginalValue.t === valueTypes.NUMBER || decomposedOriginalValue.t === valueTypes.UNIT) {
        {
          const convertedValue = convertValueUnit(
            /** @type {DOMTarget} */
            target,
            decomposedOriginalValue,
            /** @type {String} */
            unit,
            false
          );
          return `${round(convertedValue.n, globals.precision)}${convertedValue.u}`;
        }
      }
    }
  }
  const set = (targets, parameters) => {
    if (isUnd(parameters)) return;
    parameters.duration = minValue;
    parameters.composition = setValue(parameters.composition, compositionTypes.none);
    return new JSAnimation(targets, parameters, null, 0, true).resume();
  };
  const sync = (callback = noop) => {
    return new Timer({ duration: 1 * globals.timeScale, onComplete: callback }, null, 0).resume();
  };
  const getMaxViewHeight = () => {
    const $el = doc.createElement("div");
    doc.body.appendChild($el);
    $el.style.height = "100lvh";
    const height = $el.offsetHeight;
    doc.body.removeChild($el);
    return height;
  };
  const parseScrollObserverFunctionParameter = (value, scroller) => value && isFnc(value) ? (
    /** @type {Function} */
    value(scroller)
  ) : (
    /** @type {T} */
    value
  );
  const scrollContainers = /* @__PURE__ */ new Map();
  class ScrollContainer {
    /**
     * @param {HTMLElement} $el
     */
    constructor($el) {
      this.element = $el;
      this.useWin = this.element === doc.body;
      this.winWidth = 0;
      this.winHeight = 0;
      this.width = 0;
      this.height = 0;
      this.left = 0;
      this.top = 0;
      this.scale = 1;
      this.zIndex = 0;
      this.scrollX = 0;
      this.scrollY = 0;
      this.prevScrollX = 0;
      this.prevScrollY = 0;
      this.scrollWidth = 0;
      this.scrollHeight = 0;
      this.velocity = 0;
      this.backwardX = false;
      this.backwardY = false;
      this.scrollTicker = new Timer({
        autoplay: false,
        onBegin: () => this.dataTimer.resume(),
        onUpdate: () => {
          const backwards = this.backwardX || this.backwardY;
          forEachChildren(this, (child) => child.handleScroll(), backwards);
        },
        onComplete: () => this.dataTimer.pause()
      }).init();
      this.dataTimer = new Timer({
        autoplay: false,
        frameRate: 30,
        onUpdate: (self) => {
          const dt = self.deltaTime;
          const px = this.prevScrollX;
          const py = this.prevScrollY;
          const nx = this.scrollX;
          const ny = this.scrollY;
          const dx = px - nx;
          const dy = py - ny;
          this.prevScrollX = nx;
          this.prevScrollY = ny;
          if (dx) this.backwardX = px > nx;
          if (dy) this.backwardY = py > ny;
          this.velocity = round(dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0, 5);
        }
      }).init();
      this.resizeTicker = new Timer({
        autoplay: false,
        duration: 250 * globals.timeScale,
        onComplete: () => {
          this.updateWindowBounds();
          this.refreshScrollObservers();
          this.handleScroll();
        }
      }).init();
      this.wakeTicker = new Timer({
        autoplay: false,
        duration: 500 * globals.timeScale,
        onBegin: () => {
          this.scrollTicker.resume();
        },
        onComplete: () => {
          this.scrollTicker.pause();
        }
      }).init();
      this._head = null;
      this._tail = null;
      this.updateScrollCoords();
      this.updateWindowBounds();
      this.updateBounds();
      this.refreshScrollObservers();
      this.handleScroll();
      this.resizeObserver = new ResizeObserver(() => this.resizeTicker.restart());
      this.resizeObserver.observe(this.element);
      (this.useWin ? win : this.element).addEventListener("scroll", this, false);
    }
    updateScrollCoords() {
      const useWin = this.useWin;
      const $el = this.element;
      this.scrollX = round(useWin ? win.scrollX : $el.scrollLeft, 0);
      this.scrollY = round(useWin ? win.scrollY : $el.scrollTop, 0);
    }
    updateWindowBounds() {
      this.winWidth = win.innerWidth;
      this.winHeight = getMaxViewHeight();
    }
    updateBounds() {
      const style = getComputedStyle(this.element);
      const $el = this.element;
      this.scrollWidth = $el.scrollWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      this.scrollHeight = $el.scrollHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      this.updateWindowBounds();
      let width, height;
      if (this.useWin) {
        width = this.winWidth;
        height = this.winHeight;
      } else {
        const elRect = $el.getBoundingClientRect();
        width = $el.clientWidth;
        height = $el.clientHeight;
        this.top = elRect.top;
        this.left = elRect.left;
        this.scale = elRect.width ? width / elRect.width : elRect.height ? height / elRect.height : 1;
      }
      this.width = width;
      this.height = height;
    }
    refreshScrollObservers() {
      forEachChildren(this, (child) => {
        if (child._debug) {
          child.removeDebug();
        }
      });
      this.updateBounds();
      forEachChildren(this, (child) => {
        child.refresh();
        child.onResize(child);
        if (child._debug) {
          child.debug();
        }
      });
    }
    refresh() {
      this.updateWindowBounds();
      this.updateBounds();
      this.refreshScrollObservers();
      this.handleScroll();
    }
    handleScroll() {
      this.updateScrollCoords();
      this.wakeTicker.restart();
    }
    /**
     * @param {Event} e
     */
    handleEvent(e) {
      switch (e.type) {
        case "scroll":
          this.handleScroll();
          break;
      }
    }
    revert() {
      this.scrollTicker.cancel();
      this.dataTimer.cancel();
      this.resizeTicker.cancel();
      this.wakeTicker.cancel();
      this.resizeObserver.disconnect();
      (this.useWin ? win : this.element).removeEventListener("scroll", this);
      scrollContainers.delete(this.element);
    }
  }
  const registerAndGetScrollContainer = (target) => {
    const $el = (
      /** @type {HTMLElement} */
      target ? parseTargets(target)[0] || doc.body : doc.body
    );
    let scrollContainer = scrollContainers.get($el);
    if (!scrollContainer) {
      scrollContainer = new ScrollContainer($el);
      scrollContainers.set($el, scrollContainer);
    }
    return scrollContainer;
  };
  const convertValueToPx = ($el, v, size, under, over) => {
    const clampMin = v === "min";
    const clampMax = v === "max";
    const value = v === "top" || v === "left" || v === "start" || clampMin ? 0 : v === "bottom" || v === "right" || v === "end" || clampMax ? "100%" : v === "center" ? "50%" : v;
    const { n, u } = decomposeRawValue(value, decomposedOriginalValue);
    let px = n;
    if (u === "%") {
      px = n / 100 * size;
    } else if (u) {
      px = convertValueUnit($el, decomposedOriginalValue, "px", true).n;
    }
    if (clampMax && under < 0) px += under;
    if (clampMin && over > 0) px += over;
    return px;
  };
  const parseBoundValue = ($el, v, size, under, over) => {
    let value;
    if (isStr(v)) {
      const matchedOperator = relativeValuesExecRgx.exec(
        /** @type {String} */
        v
      );
      if (matchedOperator) {
        const splitter = matchedOperator[0];
        const operator = splitter[0];
        const splitted = (
          /** @type {String} */
          v.split(splitter)
        );
        const clampMin = splitted[0] === "min";
        const clampMax = splitted[0] === "max";
        const valueAPx = convertValueToPx($el, splitted[0], size, under, over);
        const valueBPx = convertValueToPx($el, splitted[1], size, under, over);
        if (clampMin) {
          const min = getRelativeValue(convertValueToPx($el, "min", size), valueBPx, operator);
          value = min < valueAPx ? valueAPx : min;
        } else if (clampMax) {
          const max = getRelativeValue(convertValueToPx($el, "max", size), valueBPx, operator);
          value = max > valueAPx ? valueAPx : max;
        } else {
          value = getRelativeValue(valueAPx, valueBPx, operator);
        }
      } else {
        value = convertValueToPx($el, v, size, under, over);
      }
    } else {
      value = /** @type {Number} */
      v;
    }
    return round(value, 0);
  };
  const getAnimationDomTarget = (linked) => {
    let $linkedTarget;
    const linkedTargets = linked.targets;
    for (let i = 0, l = linkedTargets.length; i < l; i++) {
      const target = linkedTargets[i];
      if (target[isDomSymbol]) {
        $linkedTarget = /** @type {HTMLElement} */
        target;
        break;
      }
    }
    return $linkedTarget;
  };
  let scrollerIndex = 0;
  const debugColors = ["#FF4B4B", "#FF971B", "#FFC730", "#F9F640", "#7AFF5A", "#18FF74", "#17E09B", "#3CFFEC", "#05DBE9", "#33B3F1", "#638CF9", "#C563FE", "#FF4FCF", "#F93F8A"];
  class ScrollObserver {
    /**
     * @param {ScrollObserverParams} parameters
     */
    constructor(parameters = {}) {
      const syncMode = setValue(parameters.sync, "play pause");
      const ease = syncMode ? parseEase(
        /** @type {EasingParam} */
        syncMode
      ) : null;
      const isLinear = syncMode && (syncMode === "linear" || syncMode === none);
      const isEase = syncMode && !(ease === none && !isLinear);
      const isSmooth = syncMode && (isNum(syncMode) || syncMode === true || isLinear);
      const isMethods = syncMode && (isStr(syncMode) && !isEase && !isSmooth);
      const syncMethods = isMethods ? (
        /** @type {String} */
        syncMode.split(" ").map(
          (m) => () => {
            const linked = this.linked;
            return linked && linked[m] ? linked[m]() : null;
          }
        )
      ) : null;
      const biDirSync = isMethods && syncMethods.length > 2;
      this.index = scrollerIndex++;
      this.id = !isUnd(parameters.id) ? parameters.id : this.index;
      this.container = registerAndGetScrollContainer(parameters.container);
      this.target = null;
      this.linked = null;
      this.repeat = null;
      this.horizontal = null;
      this.enter = null;
      this.leave = null;
      this.sync = isEase || isSmooth || !!syncMethods;
      this.syncEase = isEase ? ease : null;
      this.syncSmooth = isSmooth ? syncMode === true || isLinear ? 1 : (
        /** @type {Number} */
        syncMode
      ) : null;
      this.onSyncEnter = syncMethods && !biDirSync && syncMethods[0] ? syncMethods[0] : noop;
      this.onSyncLeave = syncMethods && !biDirSync && syncMethods[1] ? syncMethods[1] : noop;
      this.onSyncEnterForward = syncMethods && biDirSync && syncMethods[0] ? syncMethods[0] : noop;
      this.onSyncLeaveForward = syncMethods && biDirSync && syncMethods[1] ? syncMethods[1] : noop;
      this.onSyncEnterBackward = syncMethods && biDirSync && syncMethods[2] ? syncMethods[2] : noop;
      this.onSyncLeaveBackward = syncMethods && biDirSync && syncMethods[3] ? syncMethods[3] : noop;
      this.onEnter = parameters.onEnter || noop;
      this.onLeave = parameters.onLeave || noop;
      this.onEnterForward = parameters.onEnterForward || noop;
      this.onLeaveForward = parameters.onLeaveForward || noop;
      this.onEnterBackward = parameters.onEnterBackward || noop;
      this.onLeaveBackward = parameters.onLeaveBackward || noop;
      this.onUpdate = parameters.onUpdate || noop;
      this.onResize = parameters.onResize || noop;
      this.onSyncComplete = parameters.onSyncComplete || noop;
      this.reverted = false;
      this.ready = false;
      this.completed = false;
      this.began = false;
      this.isInView = false;
      this.forceEnter = false;
      this.hasEntered = false;
      this.offset = 0;
      this.offsetStart = 0;
      this.offsetEnd = 0;
      this.distance = 0;
      this.prevProgress = 0;
      this.thresholds = ["start", "end", "end", "start"];
      this.coords = [0, 0, 0, 0];
      this.debugStyles = null;
      this.$debug = null;
      this._params = parameters;
      this._debug = setValue(parameters.debug, false);
      this._next = null;
      this._prev = null;
      addChild(this.container, this);
      sync(() => {
        if (this.reverted) return;
        if (!this.target) {
          const target = (
            /** @type {HTMLElement} */
            parseTargets(parameters.target)[0]
          );
          this.target = target || doc.body;
          this.refresh();
        }
        if (this._debug) this.debug();
      });
    }
    /**
     * @param {Tickable|WAAPIAnimation} linked
     */
    link(linked) {
      if (linked) {
        linked.pause();
        this.linked = linked;
        if (!isUnd(linked) && !isUnd(
          /** @type {WAAPIAnimation} */
          linked.persist
        )) {
          linked.persist = true;
        }
        if (!this._params.target) {
          let $linkedTarget;
          if (!isUnd(
            /** @type {JSAnimation} */
            linked.targets
          )) {
            $linkedTarget = getAnimationDomTarget(
              /** @type {JSAnimation} */
              linked
            );
          } else {
            forEachChildren(
              /** @type {Timeline} */
              linked,
              (child) => {
                if (child.targets && !$linkedTarget) {
                  $linkedTarget = getAnimationDomTarget(
                    /** @type {JSAnimation} */
                    child
                  );
                }
              }
            );
          }
          this.target = $linkedTarget || doc.body;
          this.refresh();
        }
      }
      return this;
    }
    get velocity() {
      return this.container.velocity;
    }
    get backward() {
      return this.horizontal ? this.container.backwardX : this.container.backwardY;
    }
    get scroll() {
      return this.horizontal ? this.container.scrollX : this.container.scrollY;
    }
    get progress() {
      const p = (this.scroll - this.offsetStart) / this.distance;
      return p === Infinity || isNaN(p) ? 0 : round(clamp$1(p, 0, 1), 6);
    }
    refresh() {
      this.ready = true;
      this.reverted = false;
      const params = this._params;
      this.repeat = setValue(parseScrollObserverFunctionParameter(params.repeat, this), true);
      this.horizontal = setValue(parseScrollObserverFunctionParameter(params.axis, this), "y") === "x";
      this.enter = setValue(parseScrollObserverFunctionParameter(params.enter, this), "end start");
      this.leave = setValue(parseScrollObserverFunctionParameter(params.leave, this), "start end");
      this.updateBounds();
      this.handleScroll();
      return this;
    }
    removeDebug() {
      if (this.$debug) {
        this.$debug.parentNode.removeChild(this.$debug);
        this.$debug = null;
      }
      if (this.debugStyles) {
        this.debugStyles.revert();
        this.$debug = null;
      }
      return this;
    }
    debug() {
      this.removeDebug();
      const container = this.container;
      const isHori = this.horizontal;
      const $existingDebug = container.element.querySelector(":scope > .animejs-onscroll-debug");
      const $debug = doc.createElement("div");
      const $thresholds = doc.createElement("div");
      const $triggers = doc.createElement("div");
      const color = debugColors[this.index % debugColors.length];
      const useWin = container.useWin;
      const containerWidth = useWin ? container.winWidth : container.width;
      const containerHeight = useWin ? container.winHeight : container.height;
      const scrollWidth = container.scrollWidth;
      const scrollHeight = container.scrollHeight;
      const size = this.container.width > 360 ? 320 : 260;
      const offLeft = isHori ? 0 : 10;
      const offTop = isHori ? 10 : 0;
      const half = isHori ? 24 : size / 2;
      const labelHeight = isHori ? half : 15;
      const labelWidth = isHori ? 60 : half;
      const labelSize = isHori ? labelWidth : labelHeight;
      const repeat = isHori ? "repeat-x" : "repeat-y";
      const gradientOffset = (v) => isHori ? "0px " + v + "px" : v + "px 2px";
      const lineCSS = (c) => `linear-gradient(${isHori ? 90 : 0}deg, ${c} 2px, transparent 1px)`;
      const baseCSS = (p, l, t, w, h) => `position:${p};left:${l}px;top:${t}px;width:${w}px;height:${h}px;`;
      $debug.style.cssText = `${baseCSS("absolute", offLeft, offTop, isHori ? scrollWidth : size, isHori ? size : scrollHeight)}
      pointer-events: none;
      z-index: ${this.container.zIndex++};
      display: flex;
      flex-direction: ${isHori ? "column" : "row"};
      filter: drop-shadow(0px 1px 0px rgba(0,0,0,.75));
    `;
      $thresholds.style.cssText = `${baseCSS("sticky", 0, 0, isHori ? containerWidth : half, isHori ? half : containerHeight)}`;
      if (!$existingDebug) {
        $thresholds.style.cssText += `background:
        ${lineCSS("#FFFF")}${gradientOffset(half - 10)} / ${isHori ? "100px 100px" : "100px 100px"} ${repeat},
        ${lineCSS("#FFF8")}${gradientOffset(half - 10)} / ${isHori ? "10px 10px" : "10px 10px"} ${repeat};
      `;
      }
      $triggers.style.cssText = `${baseCSS("relative", 0, 0, isHori ? scrollWidth : half, isHori ? half : scrollHeight)}`;
      if (!$existingDebug) {
        $triggers.style.cssText += `background:
        ${lineCSS("#FFFF")}${gradientOffset(0)} / ${isHori ? "100px 10px" : "10px 100px"} ${repeat},
        ${lineCSS("#FFF8")}${gradientOffset(0)} / ${isHori ? "10px 0px" : "0px 10px"} ${repeat};
      `;
      }
      const labels = [" enter: ", " leave: "];
      this.coords.forEach((v, i) => {
        const isView = i > 1;
        const value = (isView ? 0 : this.offset) + v;
        const isTail = i % 2;
        const isFirst = value < labelSize;
        const isOver = value > (isView ? isHori ? containerWidth : containerHeight : isHori ? scrollWidth : scrollHeight) - labelSize;
        const isFlip = (isView ? isTail && !isFirst : !isTail && !isFirst) || isOver;
        const $label = doc.createElement("div");
        const $text = doc.createElement("div");
        const dirProp = isHori ? isFlip ? "right" : "left" : isFlip ? "bottom" : "top";
        const flipOffset = isFlip ? (isHori ? labelWidth : labelHeight) + (!isView ? isHori ? -1 : -2 : isHori ? -1 : isOver ? 0 : -2) : !isView ? isHori ? 1 : 0 : isHori ? 1 : 0;
        $text.innerHTML = `${this.id}${labels[isTail]}${this.thresholds[i]}`;
        $label.style.cssText = `${baseCSS("absolute", 0, 0, labelWidth, labelHeight)}
        display: flex;
        flex-direction: ${isHori ? "column" : "row"};
        justify-content: flex-${isView ? "start" : "end"};
        align-items: flex-${isFlip ? "end" : "start"};
        border-${dirProp}: 2px ${isTail ? "solid" : "solid"} ${color};
      `;
        $text.style.cssText = `
        overflow: hidden;
        max-width: ${size / 2 - 10}px;
        height: ${labelHeight};
        margin-${isHori ? isFlip ? "right" : "left" : isFlip ? "bottom" : "top"}: -2px;
        padding: 1px;
        font-family: ui-monospace, monospace;
        font-size: 10px;
        letter-spacing: -.025em;
        line-height: 9px;
        font-weight: 600;
        text-align: ${isHori && isFlip || !isHori && !isView ? "right" : "left"};
        white-space: pre;
        text-overflow: ellipsis;
        color: ${isTail ? color : "rgba(0,0,0,.75)"};
        background-color: ${isTail ? "rgba(0,0,0,.65)" : color};
        border: 2px solid ${isTail ? color : "transparent"};
        border-${isHori ? isFlip ? "top-left" : "top-right" : isFlip ? "top-left" : "bottom-left"}-radius: 5px;
        border-${isHori ? isFlip ? "bottom-left" : "bottom-right" : isFlip ? "top-right" : "bottom-right"}-radius: 5px;
      `;
        $label.appendChild($text);
        let position = value - flipOffset + (isHori ? 1 : 0);
        $label.style[isHori ? "left" : "top"] = `${position}px`;
        (isView ? $thresholds : $triggers).appendChild($label);
      });
      $debug.appendChild($thresholds);
      $debug.appendChild($triggers);
      container.element.appendChild($debug);
      if (!$existingDebug) $debug.classList.add("animejs-onscroll-debug");
      this.$debug = $debug;
      const containerPosition = get(container.element, "position");
      if (containerPosition === "static") {
        this.debugStyles = set(container.element, { position: "relative " });
      }
    }
    updateBounds() {
      if (this._debug) {
        this.removeDebug();
      }
      let stickys;
      const $target = this.target;
      const container = this.container;
      const isHori = this.horizontal;
      const linked = this.linked;
      let linkedTime;
      let $el = $target;
      if (linked) {
        linkedTime = linked.currentTime;
        linked.seek(0, true);
      }
      while ($el && $el !== container.element && $el !== doc.body) {
        const isSticky = get($el, "position") === "sticky" ? set($el, { position: "static" }) : false;
        $el = $el.parentElement;
        if (isSticky) {
          if (!stickys) stickys = [];
          stickys.push(isSticky);
        }
      }
      const rect = $target.getBoundingClientRect();
      const scale = container.scale;
      const offset = (isHori ? rect.left + container.scrollX - container.left : rect.top + container.scrollY - container.top) * scale;
      const targetSize = (isHori ? rect.width : rect.height) * scale;
      const containerSize = isHori ? container.width : container.height;
      const scrollSize = isHori ? container.scrollWidth : container.scrollHeight;
      const maxScroll = scrollSize - containerSize;
      const enter = this.enter;
      const leave = this.leave;
      let enterTarget = "start";
      let leaveTarget = "end";
      let enterContainer = "end";
      let leaveContainer = "start";
      if (isStr(enter)) {
        const splitted = (
          /** @type {String} */
          enter.split(" ")
        );
        enterContainer = splitted[0];
        enterTarget = splitted.length > 1 ? splitted[1] : enterTarget;
      } else if (isObj(enter)) {
        const e = (
          /** @type {ScrollThresholdParam} */
          enter
        );
        if (!isUnd(e.container)) enterContainer = e.container;
        if (!isUnd(e.target)) enterTarget = e.target;
      } else if (isNum(enter)) {
        enterContainer = /** @type {Number} */
        enter;
      }
      if (isStr(leave)) {
        const splitted = (
          /** @type {String} */
          leave.split(" ")
        );
        leaveContainer = splitted[0];
        leaveTarget = splitted.length > 1 ? splitted[1] : leaveTarget;
      } else if (isObj(leave)) {
        const t = (
          /** @type {ScrollThresholdParam} */
          leave
        );
        if (!isUnd(t.container)) leaveContainer = t.container;
        if (!isUnd(t.target)) leaveTarget = t.target;
      } else if (isNum(leave)) {
        leaveContainer = /** @type {Number} */
        leave;
      }
      const parsedEnterTarget = parseBoundValue($target, enterTarget, targetSize);
      const parsedLeaveTarget = parseBoundValue($target, leaveTarget, targetSize);
      const under = parsedEnterTarget + offset - containerSize;
      const over = parsedLeaveTarget + offset - maxScroll;
      const parsedEnterContainer = parseBoundValue($target, enterContainer, containerSize, under, over);
      const parsedLeaveContainer = parseBoundValue($target, leaveContainer, containerSize, under, over);
      const offsetStart = parsedEnterTarget + offset - parsedEnterContainer;
      const offsetEnd = parsedLeaveTarget + offset - parsedLeaveContainer;
      const scrollDelta = offsetEnd - offsetStart;
      this.offset = offset;
      this.offsetStart = offsetStart;
      this.offsetEnd = offsetEnd;
      this.distance = scrollDelta <= 0 ? 0 : scrollDelta;
      this.thresholds = [enterTarget, leaveTarget, enterContainer, leaveContainer];
      this.coords = [parsedEnterTarget, parsedLeaveTarget, parsedEnterContainer, parsedLeaveContainer];
      if (stickys) {
        stickys.forEach((sticky) => sticky.revert());
      }
      if (linked) {
        linked.seek(linkedTime, true);
      }
      if (this._debug) {
        this.debug();
      }
    }
    handleScroll() {
      if (!this.ready) return;
      const linked = this.linked;
      const sync2 = this.sync;
      const syncEase = this.syncEase;
      const syncSmooth = this.syncSmooth;
      const shouldSeek = linked && (syncEase || syncSmooth);
      const isHori = this.horizontal;
      const container = this.container;
      const scroll = this.scroll;
      const isBefore = scroll <= this.offsetStart;
      const isAfter = scroll >= this.offsetEnd;
      const isInView = !isBefore && !isAfter;
      const isOnTheEdge = scroll === this.offsetStart || scroll === this.offsetEnd;
      const forceEnter = !this.hasEntered && isOnTheEdge;
      const $debug = this._debug && this.$debug;
      let hasUpdated = false;
      let syncCompleted = false;
      let p = this.progress;
      if (isBefore && this.began) {
        this.began = false;
      }
      if (p > 0 && !this.began) {
        this.began = true;
      }
      if (shouldSeek) {
        const lp = linked.progress;
        if (syncSmooth && isNum(syncSmooth)) {
          if (
            /** @type {Number} */
            syncSmooth < 1
          ) {
            const step = 1e-4;
            const snap = lp < p && p === 1 ? step : lp > p && !p ? -step : 0;
            p = round(lerp(lp, p, lerp(
              0.01,
              0.2,
              /** @type {Number} */
              syncSmooth
            )) + snap, 6);
          }
        } else if (syncEase) {
          p = syncEase(p);
        }
        hasUpdated = p !== this.prevProgress;
        syncCompleted = lp === 1;
        if (hasUpdated && !syncCompleted && (syncSmooth && lp)) {
          container.wakeTicker.restart();
        }
      }
      if ($debug) {
        const sticky = isHori ? container.scrollY : container.scrollX;
        $debug.style[isHori ? "top" : "left"] = sticky + 10 + "px";
      }
      if (isInView && !this.isInView || forceEnter && !this.forceEnter && !this.hasEntered) {
        if (isInView) this.isInView = true;
        if (!this.forceEnter || !this.hasEntered) {
          if ($debug && isInView) $debug.style.zIndex = `${this.container.zIndex++}`;
          this.onSyncEnter(this);
          this.onEnter(this);
          if (this.backward) {
            this.onSyncEnterBackward(this);
            this.onEnterBackward(this);
          } else {
            this.onSyncEnterForward(this);
            this.onEnterForward(this);
          }
          this.hasEntered = true;
          if (forceEnter) this.forceEnter = true;
        } else if (isInView) {
          this.forceEnter = false;
        }
      }
      if (isInView || !isInView && this.isInView) {
        hasUpdated = true;
      }
      if (hasUpdated) {
        if (shouldSeek) linked.seek(linked.duration * p);
        this.onUpdate(this);
      }
      if (!isInView && this.isInView) {
        this.isInView = false;
        this.onSyncLeave(this);
        this.onLeave(this);
        if (this.backward) {
          this.onSyncLeaveBackward(this);
          this.onLeaveBackward(this);
        } else {
          this.onSyncLeaveForward(this);
          this.onLeaveForward(this);
        }
        if (sync2 && !syncSmooth) {
          syncCompleted = true;
        }
      }
      if (p >= 1 && this.began && !this.completed && (sync2 && syncCompleted || !sync2)) {
        if (sync2) {
          this.onSyncComplete(this);
        }
        this.completed = true;
        if (!this.repeat && !linked || !this.repeat && linked && linked.completed) {
          this.revert();
        }
      }
      if (p < 1 && this.completed) {
        this.completed = false;
      }
      this.prevProgress = p;
    }
    revert() {
      if (this.reverted) return;
      const container = this.container;
      removeChild(container, this);
      if (!container._head) {
        container.revert();
      }
      if (this._debug) {
        this.removeDebug();
      }
      this.reverted = true;
      this.ready = false;
      return this;
    }
  }
  const onScroll = (parameters = {}) => new ScrollObserver(parameters);
  function animate(targets, parameters) {
    return waapi.animate(targets, parameters);
  }
  function createScrollObserver(parameters) {
    return onScroll(parameters);
  }
  function normalizeHandlers(handlers) {
    if (typeof handlers === "function") {
      return {
        enter: handlers,
        leave: void 0
      };
    }
    return {
      enter: handlers == null ? void 0 : handlers.enter,
      leave: handlers == null ? void 0 : handlers.leave
    };
  }
  function observe(element, handlers, config) {
    var _a, _b;
    const { enter, leave } = normalizeHandlers(handlers);
    const enterMargin = (_a = config == null ? void 0 : config.enterMargin) != null ? _a : "0px";
    const leaveMargin = (_b = config == null ? void 0 : config.leaveMargin) != null ? _b : "0px";
    {
      console.log("[Alpine Anime] Setting up observer", element);
      console.log("[Alpine Anime] Root margins - enter:", enterMargin, "leave:", leaveMargin);
      console.log("[Alpine Anime] Threshold:", config == null ? void 0 : config.threshold);
    }
    if (typeof IntersectionObserver !== "function") {
      {
        console.warn("[Alpine Anime] IntersectionObserver not supported, triggering enter immediately");
      }
      if (typeof enter === "function") {
        enter({ isIntersecting: true, target: element });
      }
      return () => {
      };
    }
    let hasIntersected = Boolean(config == null ? void 0 : config.initialIntersected);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== element) continue;
        if (!entry.isIntersecting) {
          if (hasIntersected && typeof leave === "function") {
            {
              console.log("[Alpine Anime] Leave viewport", entry.target);
            }
            leave(entry);
          }
          hasIntersected = false;
          continue;
        }
        if (hasIntersected) {
          continue;
        }
        hasIntersected = true;
        {
          console.log("[Alpine Anime] Enter viewport", entry.target);
        }
        if (typeof enter === "function") {
          enter(entry);
        }
        if (!config.replay) {
          {
            console.log("[Alpine Anime] Once: unobserving", entry.target);
          }
          observer.unobserve(element);
        }
      }
    }, {
      threshold: config.threshold,
      rootMargin: `${leaveMargin} 0px ${enterMargin} 0px`
    });
    observer.observe(element);
    return () => {
      {
        console.log("[Alpine Anime] Disconnecting observer", element);
      }
      if (typeof observer.disconnect === "function") {
        observer.disconnect();
        return;
      }
      if (typeof observer.unobserve === "function") {
        observer.unobserve(element);
      }
    };
  }
  const DEFAULT_CONFIG = {
    duration: 800,
    delay: 0,
    ease: "out(2)",
    threshold: 0,
    replay: true,
    enterMargin: "0px",
    leaveMargin: "0px",
    parallax: {
      amount: 120,
      axis: "y",
      reverse: false
    }
  };
  const BEZIER_EASES = {
    "bezier-in": "cubicBezier(0.5, 0, 0.9, 0.3)",
    "bezier-out": "cubicBezier(0.1, 0.7, 0.5, 1)"
  };
  function parseNumber(value) {
    return Number.parseFloat(String(value).replaceAll("_", "."));
  }
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function parseThreshold(value) {
    const parsed = parseNumber(value);
    if (!Number.isFinite(parsed)) return null;
    return clamp(parsed, 0, 100) / 100;
  }
  function formatPowerEase(direction, value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return null;
    const power = clamp(parsed, 100, 1e3) / 100;
    return `${direction}(${Number.parseFloat(power.toFixed(2))})`;
  }
  function parseMargin(value) {
    const raw = String(value).trim().replaceAll("_", ".");
    if (raw.length === 0) return null;
    if (/^-?\d+(\.\d+)?p$/i.test(raw)) {
      return `${raw.slice(0, -1)}%`;
    }
    if (/^-?\d+(\.\d+)?%$/.test(raw)) {
      return raw;
    }
    if (/^-?\d+(\.\d+)?px$/i.test(raw)) {
      return `${Number.parseFloat(raw)}px`;
    }
    const numeric = Number.parseFloat(raw);
    if (Number.isFinite(numeric)) {
      return `${numeric}%`;
    }
    return null;
  }
  function parseModifiers(modifiers = []) {
    const config = {
      ...DEFAULT_CONFIG,
      parallax: { ...DEFAULT_CONFIG.parallax }
    };
    for (let index = 0; index < modifiers.length; index += 1) {
      const modifier = modifiers[index];
      if (modifier === "duration") {
        const parsed = parseNumber(modifiers[index + 1]);
        if (Number.isFinite(parsed)) config.duration = parsed;
        index += 1;
        continue;
      }
      if (modifier === "delay") {
        const parsed = parseNumber(modifiers[index + 1]);
        if (Number.isFinite(parsed)) config.delay = parsed;
        index += 1;
        continue;
      }
      if (modifier === "threshold") {
        const parsed = parseThreshold(modifiers[index + 1]);
        if (parsed !== null) config.threshold = parsed;
        index += 1;
        continue;
      }
      if (modifier === "ease") {
        const name = modifiers[index + 1];
        if (BEZIER_EASES[name]) {
          config.ease = BEZIER_EASES[name];
          index += 1;
          continue;
        }
        if (name === "power-in" || name === "power-out") {
          const parsed = formatPowerEase(name === "power-in" ? "in" : "out", modifiers[index + 2]);
          if (parsed !== null) config.ease = parsed;
          index += 2;
          continue;
        }
        continue;
      }
      if (modifier === "once") {
        config.replay = false;
        continue;
      }
      if (modifier === "repeat") {
        config.replay = true;
        continue;
      }
      if (modifier === "enter" || modifier === "start") {
        const parsed = parseMargin(modifiers[index + 1]);
        if (parsed !== null) config.enterMargin = parsed;
        index += 1;
        continue;
      }
      if (modifier === "leave" || modifier === "end") {
        const parsed = parseMargin(modifiers[index + 1]);
        if (parsed !== null) config.leaveMargin = parsed;
        index += 1;
        continue;
      }
      if (modifier === "amount") {
        const parsed = parseNumber(modifiers[index + 1]);
        if (Number.isFinite(parsed)) config.parallax.amount = clamp(parsed, 0, 1e3);
        index += 1;
        continue;
      }
      if (modifier === "axis") {
        const axis = modifiers[index + 1];
        if (axis === "x" || axis === "y") config.parallax.axis = axis;
        index += 1;
        continue;
      }
      if (modifier === "reverse") {
        config.parallax.reverse = true;
      }
    }
    return config;
  }
  const BUILT_IN_PRESETS = {
    fade: { opacity: [0, 1] },
    "fade-in-out": { opacity: [0, 1] },
    "fade-right": { x: [-100, 0], opacity: [0, 1] },
    "fade-left": { x: [100, 0], opacity: [0, 1] },
    "fade-up": { y: [50, 0], opacity: [0, 1] },
    "fade-down": { y: [-50, 0], opacity: [0, 1] },
    "scale-in": { scale: [0.9, 1], opacity: [0, 1] },
    parallax: { type: "scroll", effect: "parallax" }
  };
  let presets = { ...BUILT_IN_PRESETS };
  function definePreset(name, preset) {
    if (typeof name !== "string" || name.trim().length === 0 || !preset || typeof preset !== "object") {
      return;
    }
    presets[name] = preset;
  }
  function getPreset(name) {
    return presets[name];
  }
  function getPresetNames() {
    return Object.keys(presets);
  }
  const NON_STYLE_PROPERTIES = /* @__PURE__ */ new Set(["duration", "delay", "ease", "opacity", "x", "y", "scale"]);
  function getFrameValue(value, frame) {
    if (!Array.isArray(value)) return value;
    return frame === "last" ? value[value.length - 1] : value[0];
  }
  function applyStyleValue(element, property, value) {
    if (value === void 0 || value === null) return;
    if (property.includes("-")) {
      element.style.setProperty(property, String(value));
      return;
    }
    element.style[property] = String(value);
  }
  function applyAdditionalStyles(element, preset, frame) {
    for (const [property, value] of Object.entries(preset)) {
      if (NON_STYLE_PROPERTIES.has(property)) continue;
      applyStyleValue(element, property, getFrameValue(value, frame));
    }
  }
  function applyStyles(element, preset, frame) {
    if (preset.opacity) {
      element.style.opacity = String(getFrameValue(preset.opacity, frame));
    }
    const transforms = [];
    if (preset.x) transforms.push(`translateX(${getFrameValue(preset.x, frame)}px)`);
    if (preset.y) transforms.push(`translateY(${getFrameValue(preset.y, frame)}px)`);
    if (preset.scale) transforms.push(`scale(${getFrameValue(preset.scale, frame)})`);
    element.style.transform = transforms.join(" ");
    applyAdditionalStyles(element, preset, frame);
  }
  function getParallaxValues(config) {
    const half = config.parallax.amount / 2;
    const from = half === 0 ? 0 : half;
    const to = half === 0 ? 0 : -half;
    return config.parallax.reverse ? [to, from] : [from, to];
  }
  function formatParallaxTranslate(value, axis) {
    return axis === "x" ? `${value}px 0px` : `0px ${value}px`;
  }
  function applyNeutralParallaxStyle(element) {
    element.style.translate = "0px 0px";
  }
  function applyStartupFadeStyles(element, preset) {
    applyStyles(element, preset, "last");
    if (preset.opacity) {
      element.style.opacity = String(getFrameValue(preset.opacity, "first"));
    }
  }
  function prefersReducedMotion() {
    if (typeof globalThis.matchMedia !== "function") return false;
    return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function isRendered(element, { ignoreOpacity = false } = {}) {
    if (typeof element.checkVisibility === "function") {
      return element.checkVisibility({
        contentVisibilityAuto: true,
        opacityProperty: !ignoreOpacity,
        visibilityProperty: true
      });
    }
    if (typeof globalThis.getComputedStyle !== "function") return true;
    const style = globalThis.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (!ignoreOpacity && style.opacity === "0") return false;
    return true;
  }
  function getViewportSize() {
    var _a;
    const doc2 = (_a = globalThis.document) == null ? void 0 : _a.documentElement;
    return {
      width: globalThis.innerWidth || (doc2 == null ? void 0 : doc2.clientWidth) || 0,
      height: globalThis.innerHeight || (doc2 == null ? void 0 : doc2.clientHeight) || 0
    };
  }
  function isVisibleInViewport(element, options) {
    if (!isRendered(element, options)) return false;
    if (typeof element.getBoundingClientRect !== "function") return false;
    const viewport = getViewportSize();
    if (viewport.width <= 0 || viewport.height <= 0) return false;
    const rect = element.getBoundingClientRect();
    const visibleWidth = Math.min(rect.right, viewport.width) - Math.max(rect.left, 0);
    const visibleHeight = Math.min(rect.bottom, viewport.height) - Math.max(rect.top, 0);
    return visibleWidth >= 1 && visibleHeight >= 1;
  }
  function createStartupVisibilityWatcher(callback) {
    if (typeof globalThis.addEventListener !== "function") return () => {
    };
    globalThis.addEventListener("load", callback);
    globalThis.addEventListener("resize", callback);
    return () => {
      if (typeof globalThis.removeEventListener !== "function") return;
      globalThis.removeEventListener("load", callback);
      globalThis.removeEventListener("resize", callback);
    };
  }
  function directive(element, { modifiers = [] }, { cleanup } = {}) {
    const presetNames = modifiers.filter((modifier) => Boolean(getPreset(modifier)));
    if (presetNames.length !== 1) {
      {
        console.warn("[Alpine Anime] Directive ignored: exactly one preset required, found:", presetNames);
      }
      return;
    }
    const presetName = presetNames[0];
    const preset = getPreset(presetName);
    const config = parseModifiers(modifiers);
    {
      console.log("[Alpine Anime] Initializing directive", element);
      console.log("[Alpine Anime] Preset:", presetNames[0], preset);
      console.log("[Alpine Anime] Config:", config);
    }
    if (presetName === "parallax") {
      if (prefersReducedMotion()) {
        applyNeutralParallaxStyle(element);
        return;
      }
      const values = getParallaxValues(config);
      const scrollObserver = createScrollObserver({
        target: element,
        axis: config.parallax.axis,
        sync: true,
        enter: "end start",
        leave: "start end"
      });
      const activeAnimation2 = animate(element, {
        translate: values.map((value) => formatParallaxTranslate(value, config.parallax.axis)),
        duration: 1e3,
        ease: "linear",
        autoplay: scrollObserver
      });
      if (typeof cleanup === "function") {
        cleanup(() => {
          if (activeAnimation2 && typeof activeAnimation2.cancel === "function") {
            activeAnimation2.cancel();
          }
          if (scrollObserver && typeof scrollObserver.revert === "function") {
            scrollObserver.revert();
          }
        });
      }
      return;
    }
    if (prefersReducedMotion()) {
      applyStyles(element, preset, "last");
      return;
    }
    let activeAnimation;
    let teardown = () => {
    };
    let stopStartupVisibilityWatcher = () => {
    };
    const animateWithConfig = (parameters) => {
      var _a, _b, _c;
      stopStartupVisibilityWatcher();
      stopStartupVisibilityWatcher = () => {
      };
      if (activeAnimation && typeof activeAnimation.cancel === "function") {
        activeAnimation.cancel();
      }
      {
        console.log("[Alpine Anime] Triggering animation", element);
        console.log("[Alpine Anime] Animation parameters:", parameters);
      }
      activeAnimation = animate(element, {
        ...parameters,
        duration: (_a = parameters.duration) != null ? _a : config.duration,
        delay: (_b = parameters.delay) != null ? _b : config.delay,
        ease: (_c = parameters.ease) != null ? _c : config.ease
      });
    };
    const setupObserver = (initialIntersected = false) => {
      teardown = presetName === "fade-in-out" ? observe(element, {
        enter: () => animateWithConfig({ opacity: [0, 1] }),
        leave: () => animateWithConfig({ opacity: [1, 0], delay: 0 })
      }, {
        ...config,
        initialIntersected
      }) : observe(element, () => {
        animateWithConfig(preset);
      }, {
        ...config,
        initialIntersected
      });
    };
    const finalizeStartup = () => {
      var _a;
      stopStartupVisibilityWatcher();
      stopStartupVisibilityWatcher = () => {
      };
      applyStartupFadeStyles(element, preset);
      animateWithConfig({ opacity: (_a = preset.opacity) != null ? _a : [0, 1] });
      if (!config.replay && presetName !== "fade-in-out") return;
      setupObserver(true);
    };
    if (isVisibleInViewport(element)) {
      finalizeStartup();
    } else {
      applyStyles(element, preset, "first");
      stopStartupVisibilityWatcher = createStartupVisibilityWatcher(() => {
        if (!isVisibleInViewport(element, { ignoreOpacity: true })) return;
        teardown();
        teardown = () => {
        };
        finalizeStartup();
      });
      setupObserver(false);
    }
    if (typeof cleanup === "function") {
      cleanup(() => {
        {
          console.log("[Alpine Anime] Cleaning up directive", element);
        }
        if (activeAnimation && typeof activeAnimation.cancel === "function") {
          activeAnimation.cancel();
        }
        stopStartupVisibilityWatcher();
        teardown();
      });
    }
  }
  const plugin = function(Alpine) {
    Alpine.directive("anime", directive);
  };
  plugin.definePreset = definePreset;
  plugin.getPreset = getPreset;
  plugin.getPresetNames = getPresetNames;
  document.addEventListener("alpine:init", () => {
    window.Alpine.plugin(plugin);
  });
  return plugin;
})();
