const L = typeof window != "undefined", Q = L ? (
  /** @type {AnimeJSWindow} */
  /** @type {unknown} */
  window
) : null, Lt = L ? document : null, Ot = {
  replace: 0
}, yt = /* @__PURE__ */ Symbol(), Bt = /* @__PURE__ */ Symbol(), Wt = /* @__PURE__ */ Symbol(), It = /* @__PURE__ */ Symbol(), zt = 1e-11, jt = 1e3, Dt = 240, N = "", Xt = "var(", Yt = /* @__PURE__ */ (() => {
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
], Zt = /* @__PURE__ */ Z.reduce((t, e) => ({ ...t, [e]: e + "(" }), {}), S = () => {
}, Ht = /([a-z])([A-Z])/g, Ut = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
const qt = {
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
  duration: jt,
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
}, $t = {
  /** @type {Document|DOMTarget} */
  root: Lt
}, T = {
  /** @type {DefaultsParams} */
  defaults: qt
}, Jt = { version: "4.4.1", engine: null };
L && (Q.AnimeJS || (Q.AnimeJS = []), Q.AnimeJS.push(Jt));
const Mt = (t) => t.replace(Ht, "$1-$2").toLowerCase(), y = (t, e) => t.indexOf(e) === 0, H = Array.isArray, Qt = (t) => t && t.constructor === Object, Ct = (t) => typeof t == "number" && !isNaN(t), R = (t) => typeof t == "string", U = (t) => typeof t == "function", k = (t) => typeof t == "undefined", X = (t) => k(t) || t === null, Gt = (t) => L && t instanceof SVGElement, Kt = (t) => !T.defaults.hasOwnProperty(t), C = Math.pow, te = Math.sqrt, ee = Math.sin, ne = Math.cos, se = Math.asin, Vt = Math.PI, ie = Math.round, mt = (t, e, n) => t < e ? e : t > n ? n : t, oe = (t, e) => {
  const n = 10 ** e;
  return ie(t * n) / n;
}, re = (t, e, n = "_prev", s = "_next") => {
  const i = e[n], o = e[s];
  i ? i[s] = o : t._head = o, o ? o[n] = i : t._tail = i, e[n] = null, e[s] = null;
}, ae = (t, e, n, s = "_prev", i = "_next") => {
  let o = t._tail;
  for (; o && n && n(o, e); ) o = o[s];
  const r = o ? o[i] : t._head;
  o ? o[i] = e : t._head = e, r ? r[s] = e : t._tail = e, e[s] = o, e[i] = r;
};
function gt(t) {
  const e = R(t) ? $t.root.querySelectorAll(t) : t;
  if (e instanceof NodeList || e instanceof HTMLCollection) return e;
}
function ce(t) {
  if (X(t)) return (
    /** @type {TargetsArray} */
    []
  );
  if (!L) return (
    /** @type {JSTargetsArray} */
    H(t) && t.flat(1 / 0) || [t]
  );
  if (H(t)) {
    const n = t.flat(1 / 0), s = [];
    for (let i = 0, o = n.length; i < o; i++) {
      const r = n[i];
      if (!X(r)) {
        const a = gt(r);
        if (a)
          for (let u = 0, l = a.length; u < l; u++) {
            const f = a[u];
            if (!X(f)) {
              let m = !1;
              for (let h = 0, c = s.length; h < c; h++)
                if (s[h] === f) {
                  m = !0;
                  break;
                }
              m || s.push(f);
            }
          }
        else {
          let u = !1;
          for (let l = 0, f = s.length; l < f; l++)
            if (s[l] === r) {
              u = !0;
              break;
            }
          u || s.push(r);
        }
      }
    }
    return s;
  }
  const e = gt(t);
  return e ? (
    /** @type {DOMTargetsArray} */
    Array.from(e)
  ) : (
    /** @type {TargetsArray} */
    [t]
  );
}
function le(t) {
  const e = ce(t), n = e.length;
  if (n)
    for (let s = 0; s < n; s++) {
      const i = e[s];
      if (!i[yt]) {
        i[yt] = !0;
        const o = Gt(i);
        /** @type {DOMTarget} */
        (i.nodeType || o) && (i[Bt] = !0, i[Wt] = o, i[It] = {});
      }
    }
  return e;
}
const g = (t, e) => k(t) ? e : t, V = (t, e, n, s, i, o) => {
  let r;
  if (U(t))
    r = () => {
      const a = (
        /** @type {Function} */
        t(e, n, s, o)
      );
      return isNaN(+a) ? a || 0 : +a;
    };
  else if (R(t) && y(t, Xt))
    r = () => {
      var m;
      const a = t.match(Ut), u = a[1], l = a[2];
      let f = (m = getComputedStyle(
        /** @type {HTMLElement} */
        e
      )) == null ? void 0 : m.getPropertyValue(u);
      return (!f || f.trim() === N) && l && (f = l.trim()), f || 0;
    };
  else
    return t;
  return r();
};
const x = (t) => t;
const W = (t = 1.68) => (e) => C(e, +t), tt = {
  in: (t) => (e) => t(e),
  out: (t) => (e) => 1 - t(1 - e),
  inOut: (t) => (e) => e < 0.5 ? t(e * 2) / 2 : 1 - t(e * -2 + 2) / 2,
  outIn: (t) => (e) => e < 0.5 ? (1 - t(1 - e * 2)) / 2 : (t(e * 2 - 1) + 1) / 2
}, ue = Vt / 2, bt = Vt * 2, St = {
  [N]: W,
  Quad: W(2),
  Cubic: W(3),
  Quart: W(4),
  Quint: W(5),
  /** @type {EasingFunction} */
  Sine: (t) => 1 - ne(t * ue),
  /** @type {EasingFunction} */
  Circ: (t) => 1 - te(1 - t * t),
  /** @type {EasingFunction} */
  Expo: (t) => t ? C(2, 10 * t - 10) : 0,
  /** @type {EasingFunction} */
  Bounce: (t) => {
    let e, n = 4;
    for (; t < ((e = C(2, --n)) - 1) / 11; ) ;
    return 1 / C(4, 3 - n) - 7.5625 * C((e * 3 - 2) / 22 - t, 2);
  },
  /** @type {BackEasing} */
  Back: (t = 1.7) => (e) => (+t + 1) * e * e * e - +t * e * e,
  /** @type {ElasticEasing} */
  Elastic: (t = 1, e = 0.3) => {
    const n = mt(+t, 1, 10), s = mt(+e, zt, 2), i = s / bt * se(1 / n), o = bt / s;
    return (r) => r === 0 || r === 1 ? r : -n * C(2, -10 * (1 - r)) * ee((1 - r - i) * o);
  }
}, G = /* @__PURE__ */ (() => {
  const t = { linear: x, none: x };
  for (let e in tt)
    for (let n in St) {
      const s = St[n], i = tt[e];
      t[e + n] = /** @type {EasingFunctionWithParams|EasingFunction} */
      n === N || n === "Back" || n === "Elastic" ? (o, r) => i(
        /** @type {EasingFunctionWithParams} */
        s(o, r)
      ) : i(
        /** @type {EasingFunction} */
        s
      );
    }
  return (
    /** @type {EasesFunctions} */
    t
  );
})(), D = { linear: x, none: x }, fe = (t) => {
  if (D[t]) return D[t];
  if (t.indexOf("(") <= -1) {
    const n = (
      /** @type {EasingFunction} */
      tt[t] || t.includes("Back") || t.includes("Elastic") ? (
        /** @type {EasingFunctionWithParams} */
        G[t]()
      ) : G[t]
    );
    return n ? D[t] = n : x;
  } else {
    const e = t.slice(0, -1).split("("), n = (
      /** @type {EasingFunctionWithParams} */
      G[e[0]]
    );
    return n ? D[t] = n(...e[1].split(",")) : x;
  }
};
const et = {
  _head: null,
  _tail: null
}, vt = (t, e, n) => {
  let s = et._head, i;
  for (; s; ) {
    const o = s._next, r = s.$el === t, a = !e || s.property === e, u = !n || s.parent === n;
    if (r && a && u) {
      i = s.animation;
      try {
        i.commitStyles();
      } catch (f) {
      }
      i.cancel(), re(et, s);
      const l = s.parent;
      l && (l._completed++, l.animations.length === l._completed && (l.completed = !0, l.paused = !0, l.muteCallbacks || (l.onComplete(l), l._resolve(l))));
    }
    s = o;
  }
  return i;
}, wt = (t, e, n, s, i) => {
  const o = e.animate(s, i), r = i.delay + +i.duration * i.iterations;
  o.playbackRate = t._speed, t.paused && o.pause(), t.duration < r && (t.duration = r, t.controlAnimation = o), t.animations.push(o), vt(e, n), ae(et, { parent: t, animation: o, $el: e, property: n, _next: null, _prev: null });
  const a = () => vt(e, n, t);
  return o.oncancel = a, o.onremove = a, t.persist || (o.onfinish = a), o;
};
const Y = (t, e = 100) => {
  const n = [];
  for (let s = 0; s <= e; s++) n.push(oe(t(s / e), 4));
  return `linear(${n.join(", ")})`;
}, Tt = {}, Et = (t) => {
  let e = Tt[t];
  if (e) return e;
  if (e = "linear", R(t)) {
    if (y(t, "linear") || y(t, "cubic-") || y(t, "steps") || y(t, "ease"))
      e = t;
    else if (y(t, "cubicB"))
      e = Mt(t);
    else {
      const n = fe(t);
      U(n) && (e = n === x ? "linear" : Y(n));
    }
    Tt[t] = e;
  } else if (U(t)) {
    const n = Y(t);
    n && (e = n);
  } else /** @type {Spring} */
  t.ease && (e = Y(
    /** @type {Spring} */
    t.ease
  ));
  return e;
}, Ft = ["x", "y", "z"], de = [
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
], he = [...Ft, ...Z.filter((t) => ["X", "Y", "Z"].some((e) => t.endsWith(e)))];
let K = null;
const z = (t, e, n, s, i) => {
  let o = R(e) ? e : V(
    /** @type {any} */
    e,
    n,
    s,
    i,
    null,
    null
  );
  return Ct(o) ? de.includes(t) || y(t, "translate") ? `${o}px` : y(t, "rotate") || y(t, "skew") ? `${o}deg` : `${o}` : o;
}, At = (t, e, n, s, i, o) => {
  let r = "0";
  const a = k(s) ? getComputedStyle(t)[e] : z(e, s, t, i, o);
  return k(n) ? r = H(s) ? s.map((u) => z(e, u, t, i, o)) : a : r = [z(e, n, t, i, o), a], r;
};
class pe {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   */
  constructor(e, n) {
    X(K) && (L && (k(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty")) ? K = !1 : (Z.forEach((c) => {
      const p = y(c, "skew"), v = y(c, "scale"), A = y(c, "rotate"), P = y(c, "translate"), O = A || p, I = O ? "<angle>" : v ? "<number>" : P ? "<length-percentage>" : "*";
      try {
        CSS.registerProperty({
          name: "--" + c,
          syntax: I,
          inherits: !1,
          initialValue: P ? "0px" : O ? "0deg" : v ? "1" : "0"
        });
      } catch (j) {
      }
    }), K = !0));
    const s = le(e);
    s.length || console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation.");
    const i = g(n.autoplay, T.defaults.autoplay), o = i && /** @type {ScrollObserver} */
    i.link ? i : !1, r = n.alternate && /** @type {Boolean} */
    n.alternate === !0, a = n.reversed && /** @type {Boolean} */
    n.reversed === !0, u = g(n.loop, T.defaults.loop), l = (
      /** @type {Number} */
      u === !0 || u === 1 / 0 ? 1 / 0 : Ct(u) ? u + 1 : 1
    ), f = r ? a ? "alternate-reverse" : "alternate" : a ? "reverse" : "normal", m = "both", h = 1;
    this.targets = s, this.animations = [], this.controlAnimation = null, this.onComplete = n.onComplete || /** @type {Callback<WAAPIAnimation>} */
    /** @type {unknown} */
    T.defaults.onComplete, this.duration = 0, this.muteCallbacks = !1, this.completed = !1, this.paused = !i || o !== !1, this.reversed = a, this.persist = g(n.persist, T.defaults.persist), this.autoplay = i, this._speed = g(n.playbackRate, T.defaults.playbackRate), this._resolve = S, this._completed = 0, this._inlineStyles = [], s.forEach((c, p) => {
      const v = c[It], A = he.some((d) => n.hasOwnProperty(d)), P = c.style, O = this._inlineStyles[p] = {}, I = g(n.ease, T.defaults.ease), j = V(I, c, p, s, null, null), Rt = U(j) || R(j) ? j : I, at = (
        /** @type {Spring} */
        I.ease && I
      ), ct = Et(Rt), lt = (at ? (
        /** @type {Spring} */
        at.settlingDuration
      ) : V(g(n.duration, T.defaults.duration), c, p, s, null, null)) * h, ut = V(g(n.delay, T.defaults.delay), c, p, s, null, null) * h, ft = (
        /** @type {CompositeOperation} */
        g(n.composition, "replace")
      );
      for (let d in n) {
        if (!Kt(d)) continue;
        const b = {}, M = { iterations: l, direction: f, fill: m, easing: ct, duration: lt, delay: ut, composite: ft }, B = n[d], w = A ? Z.includes(d) ? d : Yt.get(d) : !1, q = w ? "transform" : d;
        O[q] || (O[q] = P[q]);
        let _;
        if (Qt(B)) {
          const E = (
            /** @type {WAAPITweenOptions} */
            B
          ), $ = g(E.ease, ct), dt = (
            /** @type {Spring} */
            $.ease && $
          ), ht = (
            /** @type {WAAPITweenOptions} */
            E.to
          ), J = (
            /** @type {WAAPITweenOptions} */
            E.from
          );
          if (M.duration = (dt ? (
            /** @type {Spring} */
            dt.settlingDuration
          ) : V(g(E.duration, lt), c, p, s, null, null)) * h, M.delay = V(g(E.delay, ut), c, p, s, null, null) * h, M.composite = /** @type {CompositeOperation} */
          g(E.composition, ft), M.easing = Et($), _ = At(c, d, J, ht, p, s), w ? (b[`--${w}`] = _, v[w] = _) : b[d] = At(c, d, J, ht, p, s), wt(this, c, d, b, M), !k(J))
            if (!w)
              P[d] = b[d][0];
            else {
              const pt = `--${w}`;
              P.setProperty(pt, b[pt][0]);
            }
        } else
          _ = H(B) ? B.map((E) => z(d, E, c, p, s)) : z(
            d,
            /** @type {any} */
            B,
            c,
            p,
            s
          ), w ? (b[`--${w}`] = _, v[w] = _) : b[d] = _, wt(this, c, d, b, M);
      }
      if (A) {
        let d = N;
        for (let b in v)
          d += `${Zt[b]}var(--${b})) `;
        P.transform = d;
      }
    }), o && this.autoplay.link(this);
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
      const n = R(e) ? (s) => s[e]() : e;
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
      const s = e.style, i = this._inlineStyles[n];
      for (let o in i) {
        const r = i[o];
        k(r) || r === N ? s.removeProperty(Mt(o)) : e.style[o] = r;
      }
      e.getAttribute("style") === N && e.removeAttribute("style");
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
    return new Promise((i) => (this._resolve = () => i(s()), this.completed && this._resolve(), this));
  }
}
const ye = {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   * @return {WAAPIAnimation}
   */
  animate: (t, e) => new pe(t, e),
  convertEase: Y
};
function me(t, e) {
  return ye.animate(t, e);
}
function ge(t) {
  return typeof t == "function" ? {
    enter: t,
    leave: void 0
  } : {
    enter: t == null ? void 0 : t.enter,
    leave: t == null ? void 0 : t.leave
  };
}
function Pt(t, e, n) {
  var l, f;
  const { enter: s, leave: i } = ge(e), o = (l = n == null ? void 0 : n.enterMargin) != null ? l : "0px", r = (f = n == null ? void 0 : n.leaveMargin) != null ? f : "0px";
  if (typeof IntersectionObserver != "function")
    return typeof s == "function" && s({ isIntersecting: !0, target: t }), () => {
    };
  let a = !!(n != null && n.initialIntersected);
  const u = new IntersectionObserver((m) => {
    for (const h of m)
      if (h.target === t) {
        if (!h.isIntersecting) {
          a && typeof i == "function" && i(h), a = !1;
          continue;
        }
        a || (a = !0, typeof s == "function" && s(h), n.replay || u.unobserve(t));
      }
  }, {
    threshold: n.threshold,
    rootMargin: `${r} 0px ${o} 0px`
  });
  return u.observe(t), () => {
    if (typeof u.disconnect == "function") {
      u.disconnect();
      return;
    }
    typeof u.unobserve == "function" && u.unobserve(t);
  };
}
const be = {
  duration: 800,
  delay: 0,
  ease: "out(2)",
  threshold: 0,
  replay: !0,
  enterMargin: "0px",
  leaveMargin: "0px"
}, _t = {
  "bezier-in": "cubicBezier(0.5, 0, 0.9, 0.3)",
  "bezier-out": "cubicBezier(0.1, 0.7, 0.5, 1)"
};
function nt(t) {
  return Number.parseFloat(String(t).replaceAll("_", "."));
}
function Nt(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
function Se(t) {
  const e = nt(t);
  return Number.isFinite(e) ? Nt(e, 0, 100) / 100 : null;
}
function ve(t, e) {
  const n = Number.parseInt(e, 10);
  if (!Number.isFinite(n)) return null;
  const s = Nt(n, 100, 1e3) / 100;
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
  return Number.isFinite(n) ? `${n}%` : null;
}
function we(t = []) {
  const e = { ...be };
  for (let n = 0; n < t.length; n += 1) {
    const s = t[n];
    if (s === "duration") {
      const i = nt(t[n + 1]);
      Number.isFinite(i) && (e.duration = i), n += 1;
      continue;
    }
    if (s === "delay") {
      const i = nt(t[n + 1]);
      Number.isFinite(i) && (e.delay = i), n += 1;
      continue;
    }
    if (s === "threshold") {
      const i = Se(t[n + 1]);
      i !== null && (e.threshold = i), n += 1;
      continue;
    }
    if (s === "ease") {
      const i = t[n + 1];
      if (_t[i]) {
        e.ease = _t[i], n += 1;
        continue;
      }
      if (i === "power-in" || i === "power-out") {
        const o = ve(i === "power-in" ? "in" : "out", t[n + 2]);
        o !== null && (e.ease = o), n += 2;
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
      const i = kt(t[n + 1]);
      i !== null && (e.enterMargin = i), n += 1;
      continue;
    }
    if (s === "leave" || s === "end") {
      const i = kt(t[n + 1]);
      i !== null && (e.leaveMargin = i), n += 1;
    }
  }
  return e;
}
const Te = {
  fade: { opacity: [0, 1] },
  "fade-in-out": { opacity: [0, 1] },
  "fade-right": { x: [-100, 0], opacity: [0, 1] },
  "fade-left": { x: [100, 0], opacity: [0, 1] },
  "fade-up": { y: [50, 0], opacity: [0, 1] },
  "fade-down": { y: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] }
};
let ot = { ...Te };
function Ee(t, e) {
  typeof t != "string" || t.trim().length === 0 || !e || typeof e != "object" || (ot[t] = e);
}
function st(t) {
  return ot[t];
}
function Ae() {
  return Object.keys(ot);
}
const Pe = /* @__PURE__ */ new Set(["duration", "delay", "ease", "opacity", "x", "y", "scale"]);
function F(t, e) {
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
function ke(t, e, n) {
  for (const [s, i] of Object.entries(e))
    Pe.has(s) || _e(t, s, F(i, n));
}
function it(t, e, n) {
  e.opacity && (t.style.opacity = String(F(e.opacity, n)));
  const s = [];
  e.x && s.push(`translateX(${F(e.x, n)}px)`), e.y && s.push(`translateY(${F(e.y, n)}px)`), e.scale && s.push(`scale(${F(e.scale, n)})`), t.style.transform = s.join(" "), ke(t, e, n);
}
function xe(t, e) {
  it(t, e, "last"), e.opacity && (t.style.opacity = String(F(e.opacity, "first")));
}
function Ie() {
  return typeof globalThis.matchMedia != "function" ? !1 : globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Me(t, { ignoreOpacity: e = !1 } = {}) {
  if (typeof t.checkVisibility == "function")
    return t.checkVisibility({
      contentVisibilityAuto: !0,
      opacityProperty: !e,
      visibilityProperty: !0
    });
  if (typeof globalThis.getComputedStyle != "function") return !0;
  const n = globalThis.getComputedStyle(t);
  return !(n.display === "none" || n.visibility === "hidden" || !e && n.opacity === "0");
}
function Ce() {
  var e;
  const t = (e = globalThis.document) == null ? void 0 : e.documentElement;
  return {
    width: globalThis.innerWidth || (t == null ? void 0 : t.clientWidth) || 0,
    height: globalThis.innerHeight || (t == null ? void 0 : t.clientHeight) || 0
  };
}
function xt(t, e) {
  if (!Me(t, e) || typeof t.getBoundingClientRect != "function") return !1;
  const n = Ce();
  if (n.width <= 0 || n.height <= 0) return !1;
  const s = t.getBoundingClientRect(), i = Math.min(s.right, n.width) - Math.max(s.left, 0), o = Math.min(s.bottom, n.height) - Math.max(s.top, 0);
  return i >= 1 && o >= 1;
}
function Ve(t) {
  return typeof globalThis.addEventListener != "function" ? () => {
  } : (globalThis.addEventListener("load", t), globalThis.addEventListener("resize", t), () => {
    typeof globalThis.removeEventListener == "function" && (globalThis.removeEventListener("load", t), globalThis.removeEventListener("resize", t));
  });
}
function Fe(t, { modifiers: e = [] }, { cleanup: n } = {}) {
  const s = e.filter((c) => !!st(c));
  if (s.length !== 1)
    return;
  const i = s[0], o = st(i), r = we(e);
  if (Ie()) {
    it(t, o, "last");
    return;
  }
  let a, u = () => {
  }, l = () => {
  };
  const f = (c) => {
    var p, v, A;
    l(), l = () => {
    }, a && typeof a.cancel == "function" && a.cancel(), a = me(t, {
      ...c,
      duration: (p = c.duration) != null ? p : r.duration,
      delay: (v = c.delay) != null ? v : r.delay,
      ease: (A = c.ease) != null ? A : r.ease
    });
  }, m = (c = !1) => {
    u = i === "fade-in-out" ? Pt(t, {
      enter: () => f({ opacity: [0, 1] }),
      leave: () => f({ opacity: [1, 0], delay: 0 })
    }, {
      ...r,
      initialIntersected: c
    }) : Pt(t, () => {
      f(o);
    }, {
      ...r,
      initialIntersected: c
    });
  }, h = () => {
    var c;
    l(), l = () => {
    }, xe(t, o), f({ opacity: (c = o.opacity) != null ? c : [0, 1] }), !(!r.replay && i !== "fade-in-out") && m(!0);
  };
  xt(t) ? h() : (it(t, o, "first"), l = Ve(() => {
    xt(t, { ignoreOpacity: !0 }) && (u(), u = () => {
    }, h());
  }), m(!1)), typeof n == "function" && n(() => {
    a && typeof a.cancel == "function" && a.cancel(), l(), u();
  });
}
const rt = function(t) {
  t.directive("anime", Fe);
};
rt.definePreset = Ee;
rt.getPreset = st;
rt.getPresetNames = Ae;
export {
  rt as default,
  Ee as definePreset,
  st as getPreset,
  Ae as getPresetNames
};
