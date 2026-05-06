const R = typeof window != "undefined", G = R ? (
  /** @type {AnimeJSWindow} */
  /** @type {unknown} */
  window
) : null, Ot = R ? document : null, Vt = {
  replace: 0
}, ht = /* @__PURE__ */ Symbol(), Lt = /* @__PURE__ */ Symbol(), Bt = /* @__PURE__ */ Symbol(), xt = /* @__PURE__ */ Symbol(), jt = 1e-11, Dt = 1e3, zt = 240, F = "", Wt = "var(", Xt = /* @__PURE__ */ (() => {
  const t = /* @__PURE__ */ new Map();
  return t.set("x", "translateX"), t.set("y", "translateY"), t.set("z", "translateZ"), t;
})(), Z = [
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
], Yt = /* @__PURE__ */ Z.reduce((t, e) => ({ ...t, [e]: e + "(" }), {}), S = () => {
}, Zt = /([a-z])([A-Z])/g, Ut = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
const qt = {
  id: null,
  keyframes: null,
  playbackEase: null,
  playbackRate: 1,
  frameRate: zt,
  loop: 0,
  reversed: !1,
  alternate: !1,
  autoplay: !0,
  persist: !1,
  duration: Dt,
  delay: 0,
  loopDelay: 0,
  ease: "out(2)",
  composition: Vt.replace,
  modifier: (t) => t,
  onBegin: S,
  onBeforeUpdate: S,
  onUpdate: S,
  onLoop: S,
  onPause: S,
  onComplete: S,
  onRender: S
}, $t = {
  /** @type {Document|DOMTarget} */
  root: Ot
}, v = {
  /** @type {DefaultsParams} */
  defaults: qt
}, Jt = { version: "4.4.1", engine: null };
R && (G.AnimeJS || (G.AnimeJS = []), G.AnimeJS.push(Jt));
const It = (t) => t.replace(Zt, "$1-$2").toLowerCase(), h = (t, e) => t.indexOf(e) === 0, U = Array.isArray, Qt = (t) => t && t.constructor === Object, Mt = (t) => typeof t == "number" && !isNaN(t), N = (t) => typeof t == "string", q = (t) => typeof t == "function", E = (t) => typeof t == "undefined", X = (t) => E(t) || t === null, Gt = (t) => R && t instanceof SVGElement, Ht = (t) => !v.defaults.hasOwnProperty(t), M = Math.pow, Kt = Math.sqrt, te = Math.sin, ee = Math.cos, ne = Math.asin, Ct = Math.PI, se = Math.round, yt = (t, e, n) => t < e ? e : t > n ? n : t, oe = (t, e) => {
  const n = 10 ** e;
  return se(t * n) / n;
}, ie = (t, e, n = "_prev", s = "_next") => {
  const o = e[n], i = e[s];
  o ? o[s] = i : t._head = i, i ? i[n] = o : t._tail = o, e[n] = null, e[s] = null;
}, re = (t, e, n, s = "_prev", o = "_next") => {
  let i = t._tail;
  for (; i && n && n(i, e); ) i = i[s];
  const r = i ? i[o] : t._head;
  i ? i[o] = e : t._head = e, r ? r[s] = e : t._tail = e, e[s] = i, e[o] = r;
};
function mt(t) {
  const e = N(t) ? $t.root.querySelectorAll(t) : t;
  if (e instanceof NodeList || e instanceof HTMLCollection) return e;
}
function ae(t) {
  if (X(t)) return (
    /** @type {TargetsArray} */
    []
  );
  if (!R) return (
    /** @type {JSTargetsArray} */
    U(t) && t.flat(1 / 0) || [t]
  );
  if (U(t)) {
    const n = t.flat(1 / 0), s = [];
    for (let o = 0, i = n.length; o < i; o++) {
      const r = n[o];
      if (!X(r)) {
        const a = mt(r);
        if (a)
          for (let l = 0, c = a.length; l < c; l++) {
            const d = a[l];
            if (!X(d)) {
              let y = !1;
              for (let p = 0, u = s.length; p < u; p++)
                if (s[p] === d) {
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
  const e = mt(t);
  return e ? (
    /** @type {DOMTargetsArray} */
    Array.from(e)
  ) : (
    /** @type {TargetsArray} */
    [t]
  );
}
function ce(t) {
  const e = ae(t), n = e.length;
  if (n)
    for (let s = 0; s < n; s++) {
      const o = e[s];
      if (!o[ht]) {
        o[ht] = !0;
        const i = Gt(o);
        /** @type {DOMTarget} */
        (o.nodeType || i) && (o[Lt] = !0, o[Bt] = i, o[xt] = {});
      }
    }
  return e;
}
const g = (t, e) => E(t) ? e : t, C = (t, e, n, s, o, i) => {
  let r;
  if (q(t))
    r = () => {
      const a = (
        /** @type {Function} */
        t(e, n, s, i)
      );
      return isNaN(+a) ? a || 0 : +a;
    };
  else if (N(t) && h(t, Wt))
    r = () => {
      var y;
      const a = t.match(Ut), l = a[1], c = a[2];
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
const P = (t) => t;
const L = (t = 1.68) => (e) => M(e, +t), et = {
  in: (t) => (e) => t(e),
  out: (t) => (e) => 1 - t(1 - e),
  inOut: (t) => (e) => e < 0.5 ? t(e * 2) / 2 : 1 - t(e * -2 + 2) / 2,
  outIn: (t) => (e) => e < 0.5 ? (1 - t(1 - e * 2)) / 2 : (t(e * 2 - 1) + 1) / 2
}, le = Ct / 2, gt = Ct * 2, bt = {
  [F]: L,
  Quad: L(2),
  Cubic: L(3),
  Quart: L(4),
  Quint: L(5),
  /** @type {EasingFunction} */
  Sine: (t) => 1 - ee(t * le),
  /** @type {EasingFunction} */
  Circ: (t) => 1 - Kt(1 - t * t),
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
    const n = yt(+t, 1, 10), s = yt(+e, jt, 2), o = s / gt * ne(1 / n), i = gt / s;
    return (r) => r === 0 || r === 1 ? r : -n * M(2, -10 * (1 - r)) * te((1 - r - o) * i);
  }
}, H = /* @__PURE__ */ (() => {
  const t = { linear: P, none: P };
  for (let e in et)
    for (let n in bt) {
      const s = bt[n], o = et[e];
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
})(), W = { linear: P, none: P }, ue = (t) => {
  if (W[t]) return W[t];
  if (t.indexOf("(") <= -1) {
    const n = (
      /** @type {EasingFunction} */
      et[t] || t.includes("Back") || t.includes("Elastic") ? (
        /** @type {EasingFunctionWithParams} */
        H[t]()
      ) : H[t]
    );
    return n ? W[t] = n : P;
  } else {
    const e = t.slice(0, -1).split("("), n = (
      /** @type {EasingFunctionWithParams} */
      H[e[0]]
    );
    return n ? W[t] = n(...e[1].split(",")) : P;
  }
};
const nt = {
  _head: null,
  _tail: null
}, St = (t, e, n) => {
  let s = nt._head, o;
  for (; s; ) {
    const i = s._next, r = s.$el === t, a = !e || s.property === e, l = !n || s.parent === n;
    if (r && a && l) {
      o = s.animation;
      try {
        o.commitStyles();
      } catch (d) {
      }
      o.cancel(), ie(nt, s);
      const c = s.parent;
      c && (c._completed++, c.animations.length === c._completed && (c.completed = !0, c.paused = !0, c.muteCallbacks || (c.onComplete(c), c._resolve(c))));
    }
    s = i;
  }
  return o;
}, wt = (t, e, n, s, o) => {
  const i = e.animate(s, o), r = o.delay + +o.duration * o.iterations;
  i.playbackRate = t._speed, t.paused && i.pause(), t.duration < r && (t.duration = r, t.controlAnimation = i), t.animations.push(i), St(e, n), re(nt, { parent: t, animation: i, $el: e, property: n, _next: null, _prev: null });
  const a = () => St(e, n, t);
  return i.oncancel = a, i.onremove = a, t.persist || (i.onfinish = a), i;
};
const Y = (t, e = 100) => {
  const n = [];
  for (let s = 0; s <= e; s++) n.push(oe(t(s / e), 4));
  return `linear(${n.join(", ")})`;
}, vt = {}, At = (t) => {
  let e = vt[t];
  if (e) return e;
  if (e = "linear", N(t)) {
    if (h(t, "linear") || h(t, "cubic-") || h(t, "steps") || h(t, "ease"))
      e = t;
    else if (h(t, "cubicB"))
      e = It(t);
    else {
      const n = ue(t);
      q(n) && (e = n === P ? "linear" : Y(n));
    }
    vt[t] = e;
  } else if (q(t)) {
    const n = Y(t);
    n && (e = n);
  } else /** @type {Spring} */
  t.ease && (e = Y(
    /** @type {Spring} */
    t.ease
  ));
  return e;
}, Ft = ["x", "y", "z"], fe = [
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
  ...Ft
], de = [...Ft, ...Z.filter((t) => ["X", "Y", "Z"].some((e) => t.endsWith(e)))];
let K = null;
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
  return Mt(i) ? fe.includes(t) || h(t, "translate") ? `${i}px` : h(t, "rotate") || h(t, "skew") ? `${i}deg` : `${i}` : i;
}, _t = (t, e, n, s, o, i) => {
  let r = "0";
  const a = E(s) ? getComputedStyle(t)[e] : j(e, s, t, o, i);
  return E(n) ? r = U(s) ? s.map((l) => j(e, l, t, o, i)) : a : r = [j(e, n, t, o, i), a], r;
};
class pe {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   */
  constructor(e, n) {
    X(K) && (R && (E(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty")) ? K = !1 : (Z.forEach((u) => {
      const m = h(u, "skew"), T = h(u, "scale"), D = h(u, "rotate"), _ = h(u, "translate"), O = D || m, x = O ? "<angle>" : T ? "<number>" : _ ? "<length-percentage>" : "*";
      try {
        CSS.registerProperty({
          name: "--" + u,
          syntax: x,
          inherits: !1,
          initialValue: _ ? "0px" : O ? "0deg" : T ? "1" : "0"
        });
      } catch (z) {
      }
    }), K = !0));
    const s = ce(e);
    s.length || console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation.");
    const o = g(n.autoplay, v.defaults.autoplay), i = o && /** @type {ScrollObserver} */
    o.link ? o : !1, r = n.alternate && /** @type {Boolean} */
    n.alternate === !0, a = n.reversed && /** @type {Boolean} */
    n.reversed === !0, l = g(n.loop, v.defaults.loop), c = (
      /** @type {Number} */
      l === !0 || l === 1 / 0 ? 1 / 0 : Mt(l) ? l + 1 : 1
    ), d = r ? a ? "alternate-reverse" : "alternate" : a ? "reverse" : "normal", y = "both", p = 1;
    this.targets = s, this.animations = [], this.controlAnimation = null, this.onComplete = n.onComplete || /** @type {Callback<WAAPIAnimation>} */
    /** @type {unknown} */
    v.defaults.onComplete, this.duration = 0, this.muteCallbacks = !1, this.completed = !1, this.paused = !o || i !== !1, this.reversed = a, this.persist = g(n.persist, v.defaults.persist), this.autoplay = o, this._speed = g(n.playbackRate, v.defaults.playbackRate), this._resolve = S, this._completed = 0, this._inlineStyles = [], s.forEach((u, m) => {
      const T = u[xt], D = de.some((f) => n.hasOwnProperty(f)), _ = u.style, O = this._inlineStyles[m] = {}, x = g(n.ease, v.defaults.ease), z = C(x, u, m, s, null, null), Rt = q(z) || N(z) ? z : x, rt = (
        /** @type {Spring} */
        x.ease && x
      ), at = At(Rt), ct = (rt ? (
        /** @type {Spring} */
        rt.settlingDuration
      ) : C(g(n.duration, v.defaults.duration), u, m, s, null, null)) * p, lt = C(g(n.delay, v.defaults.delay), u, m, s, null, null) * p, ut = (
        /** @type {CompositeOperation} */
        g(n.composition, "replace")
      );
      for (let f in n) {
        if (!Ht(f)) continue;
        const b = {}, I = { iterations: c, direction: d, fill: y, easing: at, duration: ct, delay: lt, composite: ut }, V = n[f], w = D ? Z.includes(f) ? f : Xt.get(f) : !1, $ = w ? "transform" : f;
        O[$] || (O[$] = _[$]);
        let k;
        if (Qt(V)) {
          const A = (
            /** @type {WAAPITweenOptions} */
            V
          ), J = g(A.ease, at), ft = (
            /** @type {Spring} */
            J.ease && J
          ), dt = (
            /** @type {WAAPITweenOptions} */
            A.to
          ), Q = (
            /** @type {WAAPITweenOptions} */
            A.from
          );
          if (I.duration = (ft ? (
            /** @type {Spring} */
            ft.settlingDuration
          ) : C(g(A.duration, ct), u, m, s, null, null)) * p, I.delay = C(g(A.delay, lt), u, m, s, null, null) * p, I.composite = /** @type {CompositeOperation} */
          g(A.composition, ut), I.easing = At(J), k = _t(u, f, Q, dt, m, s), w ? (b[`--${w}`] = k, T[w] = k) : b[f] = _t(u, f, Q, dt, m, s), wt(this, u, f, b, I), !E(Q))
            if (!w)
              _[f] = b[f][0];
            else {
              const pt = `--${w}`;
              _.setProperty(pt, b[pt][0]);
            }
        } else
          k = U(V) ? V.map((A) => j(f, A, u, m, s)) : j(
            f,
            /** @type {any} */
            V,
            u,
            m,
            s
          ), w ? (b[`--${w}`] = k, T[w] = k) : b[f] = k, wt(this, u, f, b, I);
      }
      if (D) {
        let f = F;
        for (let b in T)
          f += `${Yt[b]}var(--${b})) `;
        _.transform = f;
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
        E(r) || r === F ? s.removeProperty(It(i)) : e.style[i] = r;
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
  animate: (t, e) => new pe(t, e),
  convertEase: Y
};
function ye(t, e) {
  return he.animate(t, e);
}
function me(t) {
  return typeof t == "function" ? {
    enter: t,
    leave: void 0
  } : {
    enter: t == null ? void 0 : t.enter,
    leave: t == null ? void 0 : t.leave
  };
}
function kt(t, e, n) {
  var c, d;
  const { enter: s, leave: o } = me(e), i = (c = n == null ? void 0 : n.enterMargin) != null ? c : "0px", r = (d = n == null ? void 0 : n.leaveMargin) != null ? d : "0px";
  if (typeof IntersectionObserver != "function")
    return typeof s == "function" && s({ isIntersecting: !0, target: t }), () => {
    };
  let a = !1;
  const l = new IntersectionObserver((y) => {
    for (const p of y)
      if (p.target === t) {
        if (!p.isIntersecting) {
          a && typeof o == "function" && o(p), a = !1;
          continue;
        }
        a || (a = !0, typeof s == "function" && s(p), n.replay || l.unobserve(t));
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
const ge = {
  duration: 800,
  delay: 0,
  ease: "out(2)",
  threshold: 0.2,
  replay: !0,
  enterMargin: "0px",
  leaveMargin: "0px"
}, Et = {
  "bezier-in": "cubicBezier(0.5, 0, 0.9, 0.3)",
  "bezier-out": "cubicBezier(0.1, 0.7, 0.5, 1)"
};
function tt(t) {
  return Number.parseFloat(String(t).replaceAll("_", "."));
}
function Nt(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
function be(t, e) {
  const n = Number.parseInt(e, 10);
  if (!Number.isFinite(n)) return null;
  const s = Nt(n, 100, 1e3) / 100;
  return `${t}(${Number.parseFloat(s.toFixed(2))})`;
}
function Pt(t) {
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
function Se(t = []) {
  const e = { ...ge };
  for (let n = 0; n < t.length; n += 1) {
    const s = t[n];
    if (s === "duration") {
      const o = tt(t[n + 1]);
      Number.isFinite(o) && (e.duration = o), n += 1;
      continue;
    }
    if (s === "delay") {
      const o = tt(t[n + 1]);
      Number.isFinite(o) && (e.delay = o), n += 1;
      continue;
    }
    if (s === "threshold") {
      const o = tt(t[n + 1]);
      Number.isFinite(o) && (e.threshold = Nt(o, 0, 1)), n += 1;
      continue;
    }
    if (s === "ease") {
      const o = t[n + 1];
      if (Et[o]) {
        e.ease = Et[o], n += 1;
        continue;
      }
      if (o === "power-in" || o === "power-out") {
        const i = be(o === "power-in" ? "in" : "out", t[n + 2]);
        i !== null && (e.ease = i), n += 2;
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
      const o = Pt(t[n + 1]);
      o !== null && (e.enterMargin = o), n += 1;
      continue;
    }
    if (s === "leave" || s === "end") {
      const o = Pt(t[n + 1]);
      o !== null && (e.leaveMargin = o), n += 1;
    }
  }
  return e;
}
const we = {
  fade: { opacity: [0, 1] },
  "fade-in-out": { opacity: [0, 1] },
  "fade-right": { x: [-100, 0], opacity: [0, 1] },
  "fade-left": { x: [100, 0], opacity: [0, 1] },
  "fade-up": { y: [50, 0], opacity: [0, 1] },
  "fade-down": { y: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] }
};
let ot = { ...we };
function ve(t, e) {
  typeof t != "string" || t.trim().length === 0 || !e || typeof e != "object" || (ot[t] = e);
}
function st(t) {
  return ot[t];
}
function Ae() {
  return Object.keys(ot);
}
const _e = /* @__PURE__ */ new Set(["duration", "delay", "ease", "opacity", "x", "y", "scale"]);
function B(t, e) {
  return Array.isArray(t) ? e === "last" ? t[t.length - 1] : t[0] : t;
}
function ke(t, e, n) {
  if (n != null) {
    if (e.includes("-")) {
      t.style.setProperty(e, String(n));
      return;
    }
    t.style[e] = String(n);
  }
}
function Ee(t, e, n) {
  for (const [s, o] of Object.entries(e))
    _e.has(s) || ke(t, s, B(o, n));
}
function Tt(t, e, n) {
  e.opacity && (t.style.opacity = String(B(e.opacity, n)));
  const s = [];
  e.x && s.push(`translateX(${B(e.x, n)}px)`), e.y && s.push(`translateY(${B(e.y, n)}px)`), e.scale && s.push(`scale(${B(e.scale, n)})`), t.style.transform = s.join(" "), Ee(t, e, n);
}
function Pe() {
  return typeof globalThis.matchMedia != "function" ? !1 : globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Te(t, { modifiers: e = [] }, { cleanup: n } = {}) {
  const s = e.filter((c) => !!st(c));
  if (s.length !== 1)
    return;
  const o = st(s[0]), i = Se(e);
  if (Pe()) {
    Tt(t, o, "last");
    return;
  }
  Tt(t, o, "first");
  let r;
  const a = (c) => {
    var d, y, p;
    r && typeof r.cancel == "function" && r.cancel(), r = ye(t, {
      ...c,
      duration: (d = c.duration) != null ? d : i.duration,
      delay: (y = c.delay) != null ? y : i.delay,
      ease: (p = c.ease) != null ? p : i.ease
    });
  }, l = s[0] === "fade-in-out" ? kt(t, {
    enter: () => a({ opacity: [0, 1] }),
    leave: () => a({ opacity: [1, 0], delay: 0 })
  }, i) : kt(t, () => {
    a(o);
  }, i);
  typeof n == "function" && n(() => {
    r && typeof r.cancel == "function" && r.cancel(), l();
  });
}
function it(t) {
  t.directive("anime", Te);
}
it.definePreset = ve;
it.getPreset = st;
it.getPresetNames = Ae;
export {
  it as default
};
