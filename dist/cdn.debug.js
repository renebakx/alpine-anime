var AlpineAnime = (function() {
  "use strict";
  const isBrowser = typeof window !== "undefined";
  const win = isBrowser ? (
    /** @type {AnimeJSWindow} */
    /** @type {unknown} */
    window
  ) : null;
  const doc = isBrowser ? document : null;
  const compositionTypes = {
    replace: 0
  };
  const isRegisteredTargetSymbol = /* @__PURE__ */ Symbol();
  const isDomSymbol = /* @__PURE__ */ Symbol();
  const isSvgSymbol = /* @__PURE__ */ Symbol();
  const transformsSymbol = /* @__PURE__ */ Symbol();
  const minValue = 1e-11;
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
  const lowerCaseRgx = /([a-z])([A-Z])/g;
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
    defaults
  };
  const globalVersions = { version: "4.4.1", engine: null };
  if (isBrowser) {
    if (!win.AnimeJS) win.AnimeJS = [];
    win.AnimeJS.push(globalVersions);
  }
  const toLowerCase = (str) => str.replace(lowerCaseRgx, "$1-$2").toLowerCase();
  const stringStartsWith = (str, sub) => str.indexOf(sub) === 0;
  const isArr = Array.isArray;
  const isObj = (a) => a && a.constructor === Object;
  const isNum = (a) => typeof a === "number" && !isNaN(a);
  const isStr = (a) => typeof a === "string";
  const isFnc = (a) => typeof a === "function";
  const isUnd = (a) => typeof a === "undefined";
  const isNil = (a) => isUnd(a) || a === null;
  const isSvg = (a) => isBrowser && a instanceof SVGElement;
  const isKey = (a) => !globals.defaults.hasOwnProperty(a);
  const pow = Math.pow;
  const sqrt = Math.sqrt;
  const sin = Math.sin;
  const cos = Math.cos;
  const asin = Math.asin;
  const PI = Math.PI;
  const _round = Math.round;
  const clamp$1 = (v, min, max) => v < min ? min : v > max ? max : v;
  const round = (v, decimalLength) => {
    const p = 10 ** decimalLength;
    return _round(v * p) / p;
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
    return func();
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
  const addWAAPIAnimation = (parent, $el, property, keyframes, params) => {
    const animation = $el.animate(keyframes, params);
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
      const timeScale = 1;
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
          const keyframes = {};
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
              keyframes[`--${individualTransformProperty}`] = parsedPropertyValue;
              cachedTransforms[individualTransformProperty] = parsedPropertyValue;
            } else {
              keyframes[name] = parseIndividualTweenValue($el, name, from, to, i, parsedTargets);
            }
            addWAAPIAnimation(this, $el, name, keyframes, tweenParams);
            if (!isUnd(from)) {
              if (!individualTransformProperty) {
                elStyle[name] = keyframes[name][0];
              } else {
                const key = `--${individualTransformProperty}`;
                elStyle.setProperty(key, keyframes[key][0]);
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
              keyframes[`--${individualTransformProperty}`] = parsedPropertyValue;
              cachedTransforms[individualTransformProperty] = parsedPropertyValue;
            } else {
              keyframes[name] = parsedPropertyValue;
            }
            addWAAPIAnimation(this, $el, name, keyframes, tweenParams);
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
      return this.completed ? this.duration : controlAnimation ? +controlAnimation.currentTime * 1 : 0;
    }
    set currentTime(time) {
      const t = time * 1;
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
  function animate(targets, parameters) {
    return waapi.animate(targets, parameters);
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
    leaveMargin: "0px"
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
    const config = { ...DEFAULT_CONFIG };
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
    "scale-in": { scale: [0.9, 1], opacity: [0, 1] }
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
