const R = typeof window != "undefined", Q = R ? (
  /** @type {AnimeJSWindow} */
  /** @type {unknown} */
  window
) : null, Rt = R ? document : null, Ot = {
  replace: 0
}, ht = /* @__PURE__ */ Symbol(), Vt = /* @__PURE__ */ Symbol(), Lt = /* @__PURE__ */ Symbol(), Et = /* @__PURE__ */ Symbol(), jt = 1e-11, Bt = 1e3, Dt = 240, F = "", zt = "var(", Wt = /* @__PURE__ */ (() => {
  const t = /* @__PURE__ */ new Map();
  return t.set("x", "translateX"), t.set("y", "translateY"), t.set("z", "translateZ"), t;
})(), Y = [
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
], Xt = /* @__PURE__ */ Y.reduce((t, e) => ({ ...t, [e]: e + "(" }), {}), S = () => {
}, Yt = /([a-z])([A-Z])/g, Zt = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
const $t = {
  id: null,
  keyframes: null,
  playbackEase: null,
  playbackRate: 1,
  frameRate: Dt,
  loop: 0,
  reversed: !1,
  alternate: !1,
  autoplay: !0,
  persist: !1,
  duration: Bt,
  delay: 0,
  loopDelay: 0,
  ease: "out(2)",
  composition: Ot.replace,
  modifier: (t) => t,
  onBegin: S,
  onBeforeUpdate: S,
  onUpdate: S,
  onLoop: S,
  onPause: S,
  onComplete: S,
  onRender: S
}, Ut = {
  /** @type {Document|DOMTarget} */
  root: Rt
}, v = {
  /** @type {DefaultsParams} */
  defaults: $t
}, qt = { version: "4.4.1", engine: null };
R && (Q.AnimeJS || (Q.AnimeJS = []), Q.AnimeJS.push(qt));
const Pt = (t) => t.replace(Yt, "$1-$2").toLowerCase(), p = (t, e) => t.indexOf(e) === 0, Z = Array.isArray, Jt = (t) => t && t.constructor === Object, Tt = (t) => typeof t == "number" && !isNaN(t), N = (t) => typeof t == "string", $ = (t) => typeof t == "function", k = (t) => typeof t == "undefined", W = (t) => k(t) || t === null, Qt = (t) => R && t instanceof SVGElement, Gt = (t) => !v.defaults.hasOwnProperty(t), M = Math.pow, Ht = Math.sqrt, Kt = Math.sin, te = Math.cos, ee = Math.asin, It = Math.PI, ne = Math.round, pt = (t, e, n) => t < e ? e : t > n ? n : t, se = (t, e) => {
  const n = 10 ** e;
  return ne(t * n) / n;
}, oe = (t, e, n = "_prev", s = "_next") => {
  const o = e[n], i = e[s];
  o ? o[s] = i : t._head = i, i ? i[n] = o : t._tail = o, e[n] = null, e[s] = null;
}, ie = (t, e, n, s = "_prev", o = "_next") => {
  let i = t._tail;
  for (; i && n && n(i, e); ) i = i[s];
  const r = i ? i[o] : t._head;
  i ? i[o] = e : t._head = e, r ? r[s] = e : t._tail = e, e[s] = i, e[o] = r;
};
function yt(t) {
  const e = N(t) ? Ut.root.querySelectorAll(t) : t;
  if (e instanceof NodeList || e instanceof HTMLCollection) return e;
}
function re(t) {
  if (W(t)) return (
    /** @type {TargetsArray} */
    []
  );
  if (!R) return (
    /** @type {JSTargetsArray} */
    Z(t) && t.flat(1 / 0) || [t]
  );
  if (Z(t)) {
    const n = t.flat(1 / 0), s = [];
    for (let o = 0, i = n.length; o < i; o++) {
      const r = n[o];
      if (!W(r)) {
        const a = yt(r);
        if (a)
          for (let l = 0, c = a.length; l < c; l++) {
            const d = a[l];
            if (!W(d)) {
              let y = !1;
              for (let h = 0, u = s.length; h < u; h++)
                if (s[h] === d) {
                  y = !0;
                  break;
                }
              y || s.push(d);
            }
          }
        else {
          let l = !1;
          for (let c = 0, d = s.length; c < d; c++)
            if (s[c] === r) {
              l = !0;
              break;
            }
          l || s.push(r);
        }
      }
    }
    return s;
  }
  const e = yt(t);
  return e ? (
    /** @type {DOMTargetsArray} */
    Array.from(e)
  ) : (
    /** @type {TargetsArray} */
    [t]
  );
}
function ae(t) {
  const e = re(t), n = e.length;
  if (n)
    for (let s = 0; s < n; s++) {
      const o = e[s];
      if (!o[ht]) {
        o[ht] = !0;
        const i = Qt(o);
        /** @type {DOMTarget} */
        (o.nodeType || i) && (o[Vt] = !0, o[Lt] = i, o[Et] = {});
      }
    }
  return e;
}
const g = (t, e) => k(t) ? e : t, C = (t, e, n, s, o, i) => {
  let r;
  if ($(t))
    r = () => {
      const a = (
        /** @type {Function} */
        t(e, n, s, i)
      );
      return isNaN(+a) ? a || 0 : +a;
    };
  else if (N(t) && p(t, zt))
    r = () => {
      var y;
      const a = t.match(Zt), l = a[1], c = a[2];
      let d = (y = getComputedStyle(
        /** @type {HTMLElement} */
        e
      )) == null ? void 0 : y.getPropertyValue(l);
      return (!d || d.trim() === F) && c && (d = c.trim()), d || 0;
    };
  else
    return t;
  return r();
};
const E = (t) => t;
const L = (t = 1.68) => (e) => M(e, +t), tt = {
  in: (t) => (e) => t(e),
  out: (t) => (e) => 1 - t(1 - e),
  inOut: (t) => (e) => e < 0.5 ? t(e * 2) / 2 : 1 - t(e * -2 + 2) / 2,
  outIn: (t) => (e) => e < 0.5 ? (1 - t(1 - e * 2)) / 2 : (t(e * 2 - 1) + 1) / 2
}, ce = It / 2, mt = It * 2, gt = {
  [F]: L,
  Quad: L(2),
  Cubic: L(3),
  Quart: L(4),
  Quint: L(5),
  /** @type {EasingFunction} */
  Sine: (t) => 1 - te(t * ce),
  /** @type {EasingFunction} */
  Circ: (t) => 1 - Ht(1 - t * t),
  /** @type {EasingFunction} */
  Expo: (t) => t ? M(2, 10 * t - 10) : 0,
  /** @type {EasingFunction} */
  Bounce: (t) => {
    let e, n = 4;
    for (; t < ((e = M(2, --n)) - 1) / 11; ) ;
    return 1 / M(4, 3 - n) - 7.5625 * M((e * 3 - 2) / 22 - t, 2);
  },
  /** @type {BackEasing} */
  Back: (t = 1.7) => (e) => (+t + 1) * e * e * e - +t * e * e,
  /** @type {ElasticEasing} */
  Elastic: (t = 1, e = 0.3) => {
    const n = pt(+t, 1, 10), s = pt(+e, jt, 2), o = s / mt * ee(1 / n), i = mt / s;
    return (r) => r === 0 || r === 1 ? r : -n * M(2, -10 * (1 - r)) * Kt((1 - r - o) * i);
  }
}, G = /* @__PURE__ */ (() => {
  const t = { linear: E, none: E };
  for (let e in tt)
    for (let n in gt) {
      const s = gt[n], o = tt[e];
      t[e + n] = /** @type {EasingFunctionWithParams|EasingFunction} */
      n === F || n === "Back" || n === "Elastic" ? (i, r) => o(
        /** @type {EasingFunctionWithParams} */
        s(i, r)
      ) : o(
        /** @type {EasingFunction} */
        s
      );
    }
  return (
    /** @type {EasesFunctions} */
    t
  );
})(), z = { linear: E, none: E }, le = (t) => {
  if (z[t]) return z[t];
  if (t.indexOf("(") <= -1) {
    const n = (
      /** @type {EasingFunction} */
      tt[t] || t.includes("Back") || t.includes("Elastic") ? (
        /** @type {EasingFunctionWithParams} */
        G[t]()
      ) : G[t]
    );
    return n ? z[t] = n : E;
  } else {
    const e = t.slice(0, -1).split("("), n = (
      /** @type {EasingFunctionWithParams} */
      G[e[0]]
    );
    return n ? z[t] = n(...e[1].split(",")) : E;
  }
};
const et = {
  _head: null,
  _tail: null
}, bt = (t, e, n) => {
  let s = et._head, o;
  for (; s; ) {
    const i = s._next, r = s.$el === t, a = !e || s.property === e, l = !n || s.parent === n;
    if (r && a && l) {
      o = s.animation;
      try {
        o.commitStyles();
      } catch (d) {
      }
      o.cancel(), oe(et, s);
      const c = s.parent;
      c && (c._completed++, c.animations.length === c._completed && (c.completed = !0, c.paused = !0, c.muteCallbacks || (c.onComplete(c), c._resolve(c))));
    }
    s = i;
  }
  return o;
}, St = (t, e, n, s, o) => {
  const i = e.animate(s, o), r = o.delay + +o.duration * o.iterations;
  i.playbackRate = t._speed, t.paused && i.pause(), t.duration < r && (t.duration = r, t.controlAnimation = i), t.animations.push(i), bt(e, n), ie(et, { parent: t, animation: i, $el: e, property: n, _next: null, _prev: null });
  const a = () => bt(e, n, t);
  return i.oncancel = a, i.onremove = a, t.persist || (i.onfinish = a), i;
};
const X = (t, e = 100) => {
  const n = [];
  for (let s = 0; s <= e; s++) n.push(se(t(s / e), 4));
  return `linear(${n.join(", ")})`;
}, wt = {}, vt = (t) => {
  let e = wt[t];
  if (e) return e;
  if (e = "linear", N(t)) {
    if (p(t, "linear") || p(t, "cubic-") || p(t, "steps") || p(t, "ease"))
      e = t;
    else if (p(t, "cubicB"))
      e = Pt(t);
    else {
      const n = le(t);
      $(n) && (e = n === E ? "linear" : X(n));
    }
    wt[t] = e;
  } else if ($(t)) {
    const n = X(t);
    n && (e = n);
  } else /** @type {Spring} */
  t.ease && (e = X(
    /** @type {Spring} */
    t.ease
  ));
  return e;
}, Mt = ["x", "y", "z"], ue = [
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
  ...Mt
], fe = [...Mt, ...Y.filter((t) => ["X", "Y", "Z"].some((e) => t.endsWith(e)))];
let H = null;
const j = (t, e, n, s, o) => {
  let i = N(e) ? e : C(
    /** @type {any} */
    e,
    n,
    s,
    o,
    null,
    null
  );
  return Tt(i) ? ue.includes(t) || p(t, "translate") ? `${i}px` : p(t, "rotate") || p(t, "skew") ? `${i}deg` : `${i}` : i;
}, At = (t, e, n, s, o, i) => {
  let r = "0";
  const a = k(s) ? getComputedStyle(t)[e] : j(e, s, t, o, i);
  return k(n) ? r = Z(s) ? s.map((l) => j(e, l, t, o, i)) : a : r = [j(e, n, t, o, i), a], r;
};
class de {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   */
  constructor(e, n) {
    W(H) && (R && (k(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty")) ? H = !1 : (Y.forEach((u) => {
      const m = p(u, "skew"), P = p(u, "scale"), B = p(u, "rotate"), x = p(u, "translate"), O = B || m, T = O ? "<angle>" : P ? "<number>" : x ? "<length-percentage>" : "*";
      try {
        CSS.registerProperty({
          name: "--" + u,
          syntax: T,
          inherits: !1,
          initialValue: x ? "0px" : O ? "0deg" : P ? "1" : "0"
        });
      } catch (D) {
      }
    }), H = !0));
    const s = ae(e);
    s.length || console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation.");
    const o = g(n.autoplay, v.defaults.autoplay), i = o && /** @type {ScrollObserver} */
    o.link ? o : !1, r = n.alternate && /** @type {Boolean} */
    n.alternate === !0, a = n.reversed && /** @type {Boolean} */
    n.reversed === !0, l = g(n.loop, v.defaults.loop), c = (
      /** @type {Number} */
      l === !0 || l === 1 / 0 ? 1 / 0 : Tt(l) ? l + 1 : 1
    ), d = r ? a ? "alternate-reverse" : "alternate" : a ? "reverse" : "normal", y = "both", h = 1;
    this.targets = s, this.animations = [], this.controlAnimation = null, this.onComplete = n.onComplete || /** @type {Callback<WAAPIAnimation>} */
    /** @type {unknown} */
    v.defaults.onComplete, this.duration = 0, this.muteCallbacks = !1, this.completed = !1, this.paused = !o || i !== !1, this.reversed = a, this.persist = g(n.persist, v.defaults.persist), this.autoplay = o, this._speed = g(n.playbackRate, v.defaults.playbackRate), this._resolve = S, this._completed = 0, this._inlineStyles = [], s.forEach((u, m) => {
      const P = u[Et], B = fe.some((f) => n.hasOwnProperty(f)), x = u.style, O = this._inlineStyles[m] = {}, T = g(n.ease, v.defaults.ease), D = C(T, u, m, s, null, null), Nt = $(D) || N(D) ? D : T, it = (
        /** @type {Spring} */
        T.ease && T
      ), rt = vt(Nt), at = (it ? (
        /** @type {Spring} */
        it.settlingDuration
      ) : C(g(n.duration, v.defaults.duration), u, m, s, null, null)) * h, ct = C(g(n.delay, v.defaults.delay), u, m, s, null, null) * h, lt = (
        /** @type {CompositeOperation} */
        g(n.composition, "replace")
      );
      for (let f in n) {
        if (!Gt(f)) continue;
        const b = {}, I = { iterations: c, direction: d, fill: y, easing: rt, duration: at, delay: ct, composite: lt }, V = n[f], w = B ? Y.includes(f) ? f : Wt.get(f) : !1, U = w ? "transform" : f;
        O[U] || (O[U] = x[U]);
        let _;
        if (Jt(V)) {
          const A = (
            /** @type {WAAPITweenOptions} */
            V
          ), q = g(A.ease, rt), ut = (
            /** @type {Spring} */
            q.ease && q
          ), ft = (
            /** @type {WAAPITweenOptions} */
            A.to
          ), J = (
            /** @type {WAAPITweenOptions} */
            A.from
          );
          if (I.duration = (ut ? (
            /** @type {Spring} */
            ut.settlingDuration
          ) : C(g(A.duration, at), u, m, s, null, null)) * h, I.delay = C(g(A.delay, ct), u, m, s, null, null) * h, I.composite = /** @type {CompositeOperation} */
          g(A.composition, lt), I.easing = vt(q), _ = At(u, f, J, ft, m, s), w ? (b[`--${w}`] = _, P[w] = _) : b[f] = At(u, f, J, ft, m, s), St(this, u, f, b, I), !k(J))
            if (!w)
              x[f] = b[f][0];
            else {
              const dt = `--${w}`;
              x.setProperty(dt, b[dt][0]);
            }
        } else
          _ = Z(V) ? V.map((A) => j(f, A, u, m, s)) : j(
            f,
            /** @type {any} */
            V,
            u,
            m,
            s
          ), w ? (b[`--${w}`] = _, P[w] = _) : b[f] = _, St(this, u, f, b, I);
      }
      if (B) {
        let f = F;
        for (let b in P)
          f += `${Xt[b]}var(--${b})) `;
        x.transform = f;
      }
    }), i && this.autoplay.link(this);
  }
  /**
   * @callback forEachCallback
   * @param {globalThis.Animation} animation
   */
  /**
   * @param  {forEachCallback|String} callback
   * @return {this}
   */
  forEach(e) {
    try {
      const n = N(e) ? (s) => s[e]() : e;
      this.animations.forEach(n);
    } catch (n) {
    }
    return this;
  }
  get speed() {
    return this._speed;
  }
  set speed(e) {
    this._speed = +e, this.forEach((n) => n.playbackRate = e);
  }
  get currentTime() {
    const e = this.controlAnimation;
    return this.completed ? this.duration : e ? +e.currentTime * 1 : 0;
  }
  set currentTime(e) {
    const n = e * 1;
    this.forEach((s) => {
      !this.persist && n >= this.duration && s.play(), s.currentTime = n;
    });
  }
  get progress() {
    return this.currentTime / this.duration;
  }
  set progress(e) {
    this.forEach((n) => n.currentTime = e * this.duration || 0);
  }
  resume() {
    return this.paused ? (this.paused = !1, this.forEach("play")) : this;
  }
  pause() {
    return this.paused ? this : (this.paused = !0, this.forEach("pause"));
  }
  alternate() {
    return this.reversed = !this.reversed, this.forEach("reverse"), this.paused && this.forEach("pause"), this;
  }
  play() {
    return this.reversed && this.alternate(), this.resume();
  }
  reverse() {
    return this.reversed || this.alternate(), this.resume();
  }
  /**
   * @param {Number} time
   * @param {Boolean} muteCallbacks
   */
  seek(e, n = !1) {
    return n && (this.muteCallbacks = !0), e < this.duration && (this.completed = !1), this.currentTime = e, this.muteCallbacks = !1, this.paused && this.pause(), this;
  }
  restart() {
    return this.completed = !1, this.seek(0, !0).resume();
  }
  commitStyles() {
    return this.forEach("commitStyles");
  }
  complete() {
    return this.seek(this.duration);
  }
  cancel() {
    return this.muteCallbacks = !0, this.commitStyles().forEach("cancel"), this.animations.length = 0, requestAnimationFrame(() => {
      this.targets.forEach((e) => {
        e.style.transform === "none" && e.style.removeProperty("transform");
      });
    }), this;
  }
  revert() {
    return this.cancel().targets.forEach((e, n) => {
      const s = e.style, o = this._inlineStyles[n];
      for (let i in o) {
        const r = o[i];
        k(r) || r === F ? s.removeProperty(Pt(i)) : e.style[i] = r;
      }
      e.getAttribute("style") === F && e.removeAttribute("style");
    }), this;
  }
  /**
   * @typedef {this & {then: null}} ResolvedWAAPIAnimation
   */
  /**
   * @param  {Callback<ResolvedWAAPIAnimation>} [callback]
   * @return Promise<this>
   */
  then(e = S) {
    const n = this.then, s = () => {
      this.then = null, e(
        /** @type {ResolvedWAAPIAnimation} */
        this
      ), this.then = n, this._resolve = S;
    };
    return new Promise((o) => (this._resolve = () => o(s()), this.completed && this._resolve(), this));
  }
}
const he = {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   * @return {WAAPIAnimation}
   */
  animate: (t, e) => new de(t, e),
  convertEase: X
};
function pe(t, e) {
  return he.animate(t, e);
}
function ye(t) {
  return typeof t == "function" ? {
    enter: t,
    leave: void 0
  } : {
    enter: t == null ? void 0 : t.enter,
    leave: t == null ? void 0 : t.leave
  };
}
function xt(t, e, n) {
  var c, d;
  const { enter: s, leave: o } = ye(e), i = (c = n == null ? void 0 : n.enterMargin) != null ? c : "0px", r = (d = n == null ? void 0 : n.leaveMargin) != null ? d : "0px";
  if (typeof IntersectionObserver != "function")
    return typeof s == "function" && s({ isIntersecting: !0, target: t }), () => {
    };
  let a = !1;
  const l = new IntersectionObserver((y) => {
    for (const h of y)
      if (h.target === t) {
        if (!h.isIntersecting) {
          a && typeof o == "function" && o(h), a = !1;
          continue;
        }
        a || (a = !0, typeof s == "function" && s(h), n.replay || l.unobserve(t));
      }
  }, {
    threshold: n.threshold,
    rootMargin: `${r} 0px ${i} 0px`
  });
  return l.observe(t), () => {
    if (typeof l.disconnect == "function") {
      l.disconnect();
      return;
    }
    typeof l.unobserve == "function" && l.unobserve(t);
  };
}
const me = {
  duration: 800,
  delay: 0,
  ease: "out(2)",
  threshold: 0.2,
  replay: !0,
  enterMargin: "0px",
  leaveMargin: "0px"
}, _t = {
  "bezier-in": "cubicBezier(0.5, 0, 0.9, 0.3)",
  "bezier-out": "cubicBezier(0.1, 0.7, 0.5, 1)"
};
function K(t) {
  return Number.parseFloat(String(t).replaceAll("_", "."));
}
function Ct(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
function ge(t, e) {
  const n = Number.parseInt(e, 10);
  if (!Number.isFinite(n)) return null;
  const s = Ct(n, 100, 1e3) / 100;
  return `${t}(${Number.parseFloat(s.toFixed(2))})`;
}
function kt(t) {
  const e = String(t).trim().replaceAll("_", ".");
  if (e.length === 0) return null;
  if (/^-?\d+(\.\d+)?p$/i.test(e))
    return `${e.slice(0, -1)}%`;
  if (/^-?\d+(\.\d+)?%$/.test(e))
    return e;
  if (/^-?\d+(\.\d+)?px$/i.test(e))
    return `${Number.parseFloat(e)}px`;
  const n = Number.parseFloat(e);
  return Number.isFinite(n) ? `${n}px` : null;
}
function be(t = []) {
  const e = { ...me };
  for (let n = 0; n < t.length; n += 1) {
    const s = t[n];
    if (s === "duration") {
      const o = K(t[n + 1]);
      Number.isFinite(o) && (e.duration = o);
      continue;
    }
    if (s === "delay") {
      const o = K(t[n + 1]);
      Number.isFinite(o) && (e.delay = o);
      continue;
    }
    if (s === "threshold") {
      const o = K(t[n + 1]);
      Number.isFinite(o) && (e.threshold = Ct(o, 0, 1));
      continue;
    }
    if (s === "ease") {
      const o = t[n + 1];
      if (_t[o]) {
        e.ease = _t[o];
        continue;
      }
      if (o === "power-in" || o === "power-out") {
        const i = ge(o === "power-in" ? "in" : "out", t[n + 2]);
        i !== null && (e.ease = i);
        continue;
      }
      continue;
    }
    if (s === "once") {
      e.replay = !1;
      continue;
    }
    if (s === "repeat") {
      e.replay = !0;
      continue;
    }
    if (s === "enter" || s === "start") {
      const o = kt(t[n + 1]);
      o !== null && (e.enterMargin = o);
      continue;
    }
    if (s === "leave" || s === "end") {
      const o = kt(t[n + 1]);
      o !== null && (e.leaveMargin = o);
    }
  }
  return e;
}
const Se = {
  fade: { opacity: [0, 1] },
  "fade-in-out": { opacity: [0, 1] },
  "fade-right": { x: [-100, 0], opacity: [0, 1] },
  "fade-left": { x: [100, 0], opacity: [0, 1] },
  "fade-up": { y: [50, 0], opacity: [0, 1] },
  "fade-down": { y: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] }
};
let st = { ...Se };
function we(t, e) {
  typeof t != "string" || t.trim().length === 0 || !e || typeof e != "object" || (st[t] = e);
}
function nt(t) {
  return st[t];
}
function ve() {
  return Object.keys(st);
}
const Ae = /* @__PURE__ */ new Set(["duration", "delay", "ease", "opacity", "x", "y", "scale"]);
function xe(t, e) {
  return Array.isArray(t) ? e === "last" ? t[t.length - 1] : t[0] : t;
}
function _e(t, e, n) {
  if (n != null) {
    if (e.includes("-")) {
      t.style.setProperty(e, String(n));
      return;
    }
    t.style[e] = String(n);
  }
}
function Ft(t, e, n) {
  for (const [s, o] of Object.entries(e))
    Ae.has(s) || _e(t, s, xe(o, n));
}
function ke(t, e) {
  e.opacity && (t.style.opacity = String(e.opacity[0]));
  const n = [];
  e.x && n.push(`translateX(${e.x[0]}px)`), e.y && n.push(`translateY(${e.y[0]}px)`), e.scale && n.push(`scale(${e.scale[0]})`), n.length > 0 && (t.style.transform = n.join(" ")), Ft(t, e, "first");
}
function Ee(t, e) {
  e.opacity && (t.style.opacity = String(e.opacity[e.opacity.length - 1]));
  const n = [];
  e.x && n.push(`translateX(${e.x[e.x.length - 1]}px)`), e.y && n.push(`translateY(${e.y[e.y.length - 1]}px)`), e.scale && n.push(`scale(${e.scale[e.scale.length - 1]})`), t.style.transform = n.join(" "), Ft(t, e, "last");
}
function Pe() {
  return typeof globalThis.matchMedia != "function" ? !1 : globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Te(t, { modifiers: e = [] }, { cleanup: n } = {}) {
  const s = e.filter((c) => !!nt(c));
  if (s.length !== 1)
    return;
  const o = nt(s[0]);
  if (!o)
    return;
  const i = be(e);
  if (Pe()) {
    Ee(t, o);
    return;
  }
  ke(t, o);
  let r;
  const a = (c) => {
    var d, y, h;
    r && typeof r.cancel == "function" && r.cancel(), r = pe(t, {
      ...c,
      duration: (d = c.duration) != null ? d : i.duration,
      delay: (y = c.delay) != null ? y : i.delay,
      ease: (h = c.ease) != null ? h : i.ease
    });
  }, l = s[0] === "fade-in-out" ? xt(t, {
    enter: () => a({ opacity: [0, 1] }),
    leave: () => a({ opacity: [1, 0], delay: 0 })
  }, i) : xt(t, () => {
    a(o);
  }, i);
  typeof n == "function" && n(() => {
    r && typeof r.cancel == "function" && r.cancel(), l();
  });
}
function ot(t) {
  t.directive("anime", Te);
}
ot.definePreset = we;
ot.getPreset = nt;
ot.getPresetNames = ve;
export {
  ot as default
};
