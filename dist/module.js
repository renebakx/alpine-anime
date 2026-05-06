const O = typeof window != "undefined", Q = O ? (
  /** @type {AnimeJSWindow} */
  /** @type {unknown} */
  window
) : null, Vt = O ? document : null, Ot = {
  replace: 0
}, pt = /* @__PURE__ */ Symbol(), Lt = /* @__PURE__ */ Symbol(), Bt = /* @__PURE__ */ Symbol(), It = /* @__PURE__ */ Symbol(), Wt = 1e-11, jt = 1e3, zt = 240, N = "", Dt = "var(", Xt = /* @__PURE__ */ (() => {
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
}, Zt = /([a-z])([A-Z])/g, Ht = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
const Ut = {
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
}, qt = {
  /** @type {Document|DOMTarget} */
  root: Vt
}, A = {
  /** @type {DefaultsParams} */
  defaults: Ut
}, $t = { version: "4.4.1", engine: null };
O && (Q.AnimeJS || (Q.AnimeJS = []), Q.AnimeJS.push($t));
const xt = (t) => t.replace(Zt, "$1-$2").toLowerCase(), m = (t, e) => t.indexOf(e) === 0, H = Array.isArray, Jt = (t) => t && t.constructor === Object, Mt = (t) => typeof t == "number" && !isNaN(t), V = (t) => typeof t == "string", U = (t) => typeof t == "function", x = (t) => typeof t == "undefined", X = (t) => x(t) || t === null, Qt = (t) => O && t instanceof SVGElement, Gt = (t) => !A.defaults.hasOwnProperty(t), R = Math.pow, Kt = Math.sqrt, te = Math.sin, ee = Math.cos, ne = Math.asin, Ct = Math.PI, se = Math.round, yt = (t, e, n) => t < e ? e : t > n ? n : t, oe = (t, e) => {
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
  const e = V(t) ? qt.root.querySelectorAll(t) : t;
  if (e instanceof NodeList || e instanceof HTMLCollection) return e;
}
function ae(t) {
  if (X(t)) return (
    /** @type {TargetsArray} */
    []
  );
  if (!O) return (
    /** @type {JSTargetsArray} */
    H(t) && t.flat(1 / 0) || [t]
  );
  if (H(t)) {
    const n = t.flat(1 / 0), s = [];
    for (let o = 0, i = n.length; o < i; o++) {
      const r = n[o];
      if (!X(r)) {
        const a = mt(r);
        if (a)
          for (let c = 0, l = a.length; c < l; c++) {
            const f = a[c];
            if (!X(f)) {
              let d = !1;
              for (let p = 0, u = s.length; p < u; p++)
                if (s[p] === f) {
                  d = !0;
                  break;
                }
              d || s.push(f);
            }
          }
        else {
          let c = !1;
          for (let l = 0, f = s.length; l < f; l++)
            if (s[l] === r) {
              c = !0;
              break;
            }
          c || s.push(r);
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
      if (!o[pt]) {
        o[pt] = !0;
        const i = Qt(o);
        /** @type {DOMTarget} */
        (o.nodeType || i) && (o[Lt] = !0, o[Bt] = i, o[It] = {});
      }
    }
  return e;
}
const g = (t, e) => x(t) ? e : t, F = (t, e, n, s, o, i) => {
  let r;
  if (U(t))
    r = () => {
      const a = (
        /** @type {Function} */
        t(e, n, s, i)
      );
      return isNaN(+a) ? a || 0 : +a;
    };
  else if (V(t) && m(t, Dt))
    r = () => {
      var d;
      const a = t.match(Ht), c = a[1], l = a[2];
      let f = (d = getComputedStyle(
        /** @type {HTMLElement} */
        e
      )) == null ? void 0 : d.getPropertyValue(c);
      return (!f || f.trim() === N) && l && (f = l.trim()), f || 0;
    };
  else
    return t;
  return r();
};
const M = (t) => t;
const B = (t = 1.68) => (e) => R(e, +t), tt = {
  in: (t) => (e) => t(e),
  out: (t) => (e) => 1 - t(1 - e),
  inOut: (t) => (e) => e < 0.5 ? t(e * 2) / 2 : 1 - t(e * -2 + 2) / 2,
  outIn: (t) => (e) => e < 0.5 ? (1 - t(1 - e * 2)) / 2 : (t(e * 2 - 1) + 1) / 2
}, le = Ct / 2, gt = Ct * 2, bt = {
  [N]: B,
  Quad: B(2),
  Cubic: B(3),
  Quart: B(4),
  Quint: B(5),
  /** @type {EasingFunction} */
  Sine: (t) => 1 - ee(t * le),
  /** @type {EasingFunction} */
  Circ: (t) => 1 - Kt(1 - t * t),
  /** @type {EasingFunction} */
  Expo: (t) => t ? R(2, 10 * t - 10) : 0,
  /** @type {EasingFunction} */
  Bounce: (t) => {
    let e, n = 4;
    for (; t < ((e = R(2, --n)) - 1) / 11; ) ;
    return 1 / R(4, 3 - n) - 7.5625 * R((e * 3 - 2) / 22 - t, 2);
  },
  /** @type {BackEasing} */
  Back: (t = 1.7) => (e) => (+t + 1) * e * e * e - +t * e * e,
  /** @type {ElasticEasing} */
  Elastic: (t = 1, e = 0.3) => {
    const n = yt(+t, 1, 10), s = yt(+e, Wt, 2), o = s / gt * ne(1 / n), i = gt / s;
    return (r) => r === 0 || r === 1 ? r : -n * R(2, -10 * (1 - r)) * te((1 - r - o) * i);
  }
}, G = /* @__PURE__ */ (() => {
  const t = { linear: M, none: M };
  for (let e in tt)
    for (let n in bt) {
      const s = bt[n], o = tt[e];
      t[e + n] = /** @type {EasingFunctionWithParams|EasingFunction} */
      n === N || n === "Back" || n === "Elastic" ? (i, r) => o(
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
})(), D = { linear: M, none: M }, ue = (t) => {
  if (D[t]) return D[t];
  if (t.indexOf("(") <= -1) {
    const n = (
      /** @type {EasingFunction} */
      tt[t] || t.includes("Back") || t.includes("Elastic") ? (
        /** @type {EasingFunctionWithParams} */
        G[t]()
      ) : G[t]
    );
    return n ? D[t] = n : M;
  } else {
    const e = t.slice(0, -1).split("("), n = (
      /** @type {EasingFunctionWithParams} */
      G[e[0]]
    );
    return n ? D[t] = n(...e[1].split(",")) : M;
  }
};
const et = {
  _head: null,
  _tail: null
}, St = (t, e, n) => {
  let s = et._head, o;
  for (; s; ) {
    const i = s._next, r = s.$el === t, a = !e || s.property === e, c = !n || s.parent === n;
    if (r && a && c) {
      o = s.animation;
      try {
        o.commitStyles();
      } catch (f) {
      }
      o.cancel(), ie(et, s);
      const l = s.parent;
      l && (l._completed++, l.animations.length === l._completed && (l.completed = !0, l.paused = !0, l.muteCallbacks || (l.onComplete(l), l._resolve(l))));
    }
    s = i;
  }
  return o;
}, wt = (t, e, n, s, o) => {
  const i = e.animate(s, o), r = o.delay + +o.duration * o.iterations;
  i.playbackRate = t._speed, t.paused && i.pause(), t.duration < r && (t.duration = r, t.controlAnimation = i), t.animations.push(i), St(e, n), re(et, { parent: t, animation: i, $el: e, property: n, _next: null, _prev: null });
  const a = () => St(e, n, t);
  return i.oncancel = a, i.onremove = a, t.persist || (i.onfinish = a), i;
};
const Y = (t, e = 100) => {
  const n = [];
  for (let s = 0; s <= e; s++) n.push(oe(t(s / e), 4));
  return `linear(${n.join(", ")})`;
}, vt = {}, Tt = (t) => {
  let e = vt[t];
  if (e) return e;
  if (e = "linear", V(t)) {
    if (m(t, "linear") || m(t, "cubic-") || m(t, "steps") || m(t, "ease"))
      e = t;
    else if (m(t, "cubicB"))
      e = xt(t);
    else {
      const n = ue(t);
      U(n) && (e = n === M ? "linear" : Y(n));
    }
    vt[t] = e;
  } else if (U(t)) {
    const n = Y(t);
    n && (e = n);
  } else /** @type {Spring} */
  t.ease && (e = Y(
    /** @type {Spring} */
    t.ease
  ));
  return e;
}, Rt = ["x", "y", "z"], fe = [
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
  ...Rt
], he = [...Rt, ...Z.filter((t) => ["X", "Y", "Z"].some((e) => t.endsWith(e)))];
let K = null;
const j = (t, e, n, s, o) => {
  let i = V(e) ? e : F(
    /** @type {any} */
    e,
    n,
    s,
    o,
    null,
    null
  );
  return Mt(i) ? fe.includes(t) || m(t, "translate") ? `${i}px` : m(t, "rotate") || m(t, "skew") ? `${i}deg` : `${i}` : i;
}, At = (t, e, n, s, o, i) => {
  let r = "0";
  const a = x(s) ? getComputedStyle(t)[e] : j(e, s, t, o, i);
  return x(n) ? r = H(s) ? s.map((c) => j(e, c, t, o, i)) : a : r = [j(e, n, t, o, i), a], r;
};
class de {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   */
  constructor(e, n) {
    X(K) && (O && (x(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty")) ? K = !1 : (Z.forEach((u) => {
      const y = m(u, "skew"), w = m(u, "scale"), k = m(u, "rotate"), v = m(u, "translate"), P = k || y, E = P ? "<angle>" : w ? "<number>" : v ? "<length-percentage>" : "*";
      try {
        CSS.registerProperty({
          name: "--" + u,
          syntax: E,
          inherits: !1,
          initialValue: v ? "0px" : P ? "0deg" : w ? "1" : "0"
        });
      } catch (z) {
      }
    }), K = !0));
    const s = ce(e);
    s.length || console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation.");
    const o = g(n.autoplay, A.defaults.autoplay), i = o && /** @type {ScrollObserver} */
    o.link ? o : !1, r = n.alternate && /** @type {Boolean} */
    n.alternate === !0, a = n.reversed && /** @type {Boolean} */
    n.reversed === !0, c = g(n.loop, A.defaults.loop), l = (
      /** @type {Number} */
      c === !0 || c === 1 / 0 ? 1 / 0 : Mt(c) ? c + 1 : 1
    ), f = r ? a ? "alternate-reverse" : "alternate" : a ? "reverse" : "normal", d = "both", p = 1;
    this.targets = s, this.animations = [], this.controlAnimation = null, this.onComplete = n.onComplete || /** @type {Callback<WAAPIAnimation>} */
    /** @type {unknown} */
    A.defaults.onComplete, this.duration = 0, this.muteCallbacks = !1, this.completed = !1, this.paused = !o || i !== !1, this.reversed = a, this.persist = g(n.persist, A.defaults.persist), this.autoplay = o, this._speed = g(n.playbackRate, A.defaults.playbackRate), this._resolve = S, this._completed = 0, this._inlineStyles = [], s.forEach((u, y) => {
      const w = u[It], k = he.some((h) => n.hasOwnProperty(h)), v = u.style, P = this._inlineStyles[y] = {}, E = g(n.ease, A.defaults.ease), z = F(E, u, y, s, null, null), Nt = U(z) || V(z) ? z : E, rt = (
        /** @type {Spring} */
        E.ease && E
      ), at = Tt(Nt), ct = (rt ? (
        /** @type {Spring} */
        rt.settlingDuration
      ) : F(g(n.duration, A.defaults.duration), u, y, s, null, null)) * p, lt = F(g(n.delay, A.defaults.delay), u, y, s, null, null) * p, ut = (
        /** @type {CompositeOperation} */
        g(n.composition, "replace")
      );
      for (let h in n) {
        if (!Gt(h)) continue;
        const b = {}, C = { iterations: l, direction: f, fill: d, easing: at, duration: ct, delay: lt, composite: ut }, L = n[h], T = k ? Z.includes(h) ? h : Xt.get(h) : !1, q = T ? "transform" : h;
        P[q] || (P[q] = v[q]);
        let I;
        if (Jt(L)) {
          const _ = (
            /** @type {WAAPITweenOptions} */
            L
          ), $ = g(_.ease, at), ft = (
            /** @type {Spring} */
            $.ease && $
          ), ht = (
            /** @type {WAAPITweenOptions} */
            _.to
          ), J = (
            /** @type {WAAPITweenOptions} */
            _.from
          );
          if (C.duration = (ft ? (
            /** @type {Spring} */
            ft.settlingDuration
          ) : F(g(_.duration, ct), u, y, s, null, null)) * p, C.delay = F(g(_.delay, lt), u, y, s, null, null) * p, C.composite = /** @type {CompositeOperation} */
          g(_.composition, ut), C.easing = Tt($), I = At(u, h, J, ht, y, s), T ? (b[`--${T}`] = I, w[T] = I) : b[h] = At(u, h, J, ht, y, s), wt(this, u, h, b, C), !x(J))
            if (!T)
              v[h] = b[h][0];
            else {
              const dt = `--${T}`;
              v.setProperty(dt, b[dt][0]);
            }
        } else
          I = H(L) ? L.map((_) => j(h, _, u, y, s)) : j(
            h,
            /** @type {any} */
            L,
            u,
            y,
            s
          ), T ? (b[`--${T}`] = I, w[T] = I) : b[h] = I, wt(this, u, h, b, C);
      }
      if (k) {
        let h = N;
        for (let b in w)
          h += `${Yt[b]}var(--${b})) `;
        v.transform = h;
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
      const n = V(e) ? (s) => s[e]() : e;
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
        x(r) || r === N ? s.removeProperty(xt(i)) : e.style[i] = r;
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
    return new Promise((o) => (this._resolve = () => o(s()), this.completed && this._resolve(), this));
  }
}
const pe = {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   * @return {WAAPIAnimation}
   */
  animate: (t, e) => new de(t, e),
  convertEase: Y
};
function ye(t, e) {
  return pe.animate(t, e);
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
function Et(t, e, n) {
  var l, f;
  const { enter: s, leave: o } = me(e), i = (l = n == null ? void 0 : n.enterMargin) != null ? l : "0px", r = (f = n == null ? void 0 : n.leaveMargin) != null ? f : "0px";
  if (typeof IntersectionObserver != "function")
    return typeof s == "function" && s({ isIntersecting: !0, target: t }), () => {
    };
  let a = !!(n != null && n.initialIntersected);
  const c = new IntersectionObserver((d) => {
    for (const p of d)
      if (p.target === t) {
        if (!p.isIntersecting) {
          a && typeof o == "function" && o(p), a = !1;
          continue;
        }
        a || (a = !0, typeof s == "function" && s(p), n.replay || c.unobserve(t));
      }
  }, {
    threshold: n.threshold,
    rootMargin: `${r} 0px ${i} 0px`
  });
  return c.observe(t), () => {
    if (typeof c.disconnect == "function") {
      c.disconnect();
      return;
    }
    typeof c.unobserve == "function" && c.unobserve(t);
  };
}
const ge = {
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
function Ft(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
function be(t) {
  const e = nt(t);
  return Number.isFinite(e) ? Ft(e, 0, 100) / 100 : null;
}
function Se(t, e) {
  const n = Number.parseInt(e, 10);
  if (!Number.isFinite(n)) return null;
  const s = Ft(n, 100, 1e3) / 100;
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
  const e = { ...ge };
  for (let n = 0; n < t.length; n += 1) {
    const s = t[n];
    if (s === "duration") {
      const o = nt(t[n + 1]);
      Number.isFinite(o) && (e.duration = o), n += 1;
      continue;
    }
    if (s === "delay") {
      const o = nt(t[n + 1]);
      Number.isFinite(o) && (e.delay = o), n += 1;
      continue;
    }
    if (s === "threshold") {
      const o = be(t[n + 1]);
      o !== null && (e.threshold = o), n += 1;
      continue;
    }
    if (s === "ease") {
      const o = t[n + 1];
      if (_t[o]) {
        e.ease = _t[o], n += 1;
        continue;
      }
      if (o === "power-in" || o === "power-out") {
        const i = Se(o === "power-in" ? "in" : "out", t[n + 2]);
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
      const o = kt(t[n + 1]);
      o !== null && (e.enterMargin = o), n += 1;
      continue;
    }
    if (s === "leave" || s === "end") {
      const o = kt(t[n + 1]);
      o !== null && (e.leaveMargin = o), n += 1;
    }
  }
  return e;
}
const ve = {
  fade: { opacity: [0, 1] },
  "fade-in-out": { opacity: [0, 1] },
  "fade-right": { x: [-100, 0], opacity: [0, 1] },
  "fade-left": { x: [100, 0], opacity: [0, 1] },
  "fade-up": { y: [50, 0], opacity: [0, 1] },
  "fade-down": { y: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] }
};
let ot = { ...ve };
function Te(t, e) {
  typeof t != "string" || t.trim().length === 0 || !e || typeof e != "object" || (ot[t] = e);
}
function st(t) {
  return ot[t];
}
function Ae() {
  return Object.keys(ot);
}
const Ee = /* @__PURE__ */ new Set(["duration", "delay", "ease", "opacity", "x", "y", "scale"]);
function W(t, e) {
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
  for (const [s, o] of Object.entries(e))
    Ee.has(s) || _e(t, s, W(o, n));
}
function Pt(t, e, n) {
  e.opacity && (t.style.opacity = String(W(e.opacity, n)));
  const s = [];
  e.x && s.push(`translateX(${W(e.x, n)}px)`), e.y && s.push(`translateY(${W(e.y, n)}px)`), e.scale && s.push(`scale(${W(e.scale, n)})`), t.style.transform = s.join(" "), ke(t, e, n);
}
function Pe() {
  return typeof globalThis.matchMedia != "function" ? !1 : globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Ie() {
  var e;
  const t = (e = globalThis.document) == null ? void 0 : e.documentElement;
  return {
    width: globalThis.innerWidth || (t == null ? void 0 : t.clientWidth) || 0,
    height: globalThis.innerHeight || (t == null ? void 0 : t.clientHeight) || 0
  };
}
function xe(t, e) {
  var y, w, k;
  if (typeof t.getBoundingClientRect != "function") return !1;
  const n = t.getBoundingClientRect(), s = (y = n.width) != null ? y : n.right - n.left, o = (w = n.height) != null ? w : n.bottom - n.top, i = Ie();
  if (i.width <= 0 || i.height <= 0) return !1;
  const r = 0, a = i.height, c = 0, l = i.width, f = Math.min(n.right, l) - Math.max(n.left, c), d = Math.min(n.bottom, a) - Math.max(n.top, r);
  if (s <= 0 || o <= 0) {
    const v = s > 0 || o > 0, P = n.right > c && n.left < l, E = n.bottom >= r && n.top <= a;
    return v && P && E;
  }
  if (f <= 0 || d <= 0) return !1;
  const p = f * d / (s * o), u = (k = e.threshold) != null ? k : 0;
  return u === 0 ? p > 0 : p >= u;
}
function Me(t, { modifiers: e = [] }, { cleanup: n } = {}) {
  const s = e.filter((d) => !!st(d));
  if (s.length !== 1)
    return;
  const o = s[0], i = st(o), r = we(e);
  if (Pe()) {
    Pt(t, i, "last");
    return;
  }
  const a = xe(t, r);
  if (Pt(t, i, a ? "last" : "first"), a && !r.replay && o !== "fade-in-out")
    return;
  let c;
  const l = (d) => {
    var p, u, y;
    c && typeof c.cancel == "function" && c.cancel(), c = ye(t, {
      ...d,
      duration: (p = d.duration) != null ? p : r.duration,
      delay: (u = d.delay) != null ? u : r.delay,
      ease: (y = d.ease) != null ? y : r.ease
    });
  }, f = o === "fade-in-out" ? Et(t, {
    enter: () => l({ opacity: [0, 1] }),
    leave: () => l({ opacity: [1, 0], delay: 0 })
  }, {
    ...r,
    initialIntersected: a
  }) : Et(t, () => {
    l(i);
  }, {
    ...r,
    initialIntersected: a
  });
  typeof n == "function" && n(() => {
    c && typeof c.cancel == "function" && c.cancel(), f();
  });
}
const it = function(t) {
  t.directive("anime", Me);
};
it.definePreset = Te;
it.getPreset = st;
it.getPresetNames = Ae;
export {
  it as default,
  Te as definePreset,
  st as getPreset,
  Ae as getPresetNames
};
