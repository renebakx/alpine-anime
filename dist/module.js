const N = typeof window != "undefined", J = N ? (
  /** @type {AnimeJSWindow} */
  /** @type {unknown} */
  window
) : null, It = N ? document : null, Mt = {
  replace: 0
}, ut = /* @__PURE__ */ Symbol(), Ct = /* @__PURE__ */ Symbol(), Ft = /* @__PURE__ */ Symbol(), kt = /* @__PURE__ */ Symbol(), Rt = 1e-11, Nt = 1e3, Ot = 240, F = "", Vt = "var(", Lt = /* @__PURE__ */ (() => {
  const t = /* @__PURE__ */ new Map();
  return t.set("x", "translateX"), t.set("y", "translateY"), t.set("z", "translateZ"), t;
})(), z = [
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
], jt = /* @__PURE__ */ z.reduce((t, e) => ({ ...t, [e]: e + "(" }), {}), S = () => {
}, Dt = /([a-z])([A-Z])/g, Wt = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
const Xt = {
  id: null,
  keyframes: null,
  playbackEase: null,
  playbackRate: 1,
  frameRate: Ot,
  loop: 0,
  reversed: !1,
  alternate: !1,
  autoplay: !0,
  persist: !1,
  duration: Nt,
  delay: 0,
  loopDelay: 0,
  ease: "out(2)",
  composition: Mt.replace,
  modifier: (t) => t,
  onBegin: S,
  onBeforeUpdate: S,
  onUpdate: S,
  onLoop: S,
  onPause: S,
  onComplete: S,
  onRender: S
}, Bt = {
  /** @type {Document|DOMTarget} */
  root: It
}, w = {
  /** @type {DefaultsParams} */
  defaults: Xt
}, Yt = { version: "4.4.1", engine: null };
N && (J.AnimeJS || (J.AnimeJS = []), J.AnimeJS.push(Yt));
const At = (t) => t.replace(Dt, "$1-$2").toLowerCase(), p = (t, e) => t.indexOf(e) === 0, Z = Array.isArray, zt = (t) => t && t.constructor === Object, xt = (t) => typeof t == "number" && !isNaN(t), R = (t) => typeof t == "string", $ = (t) => typeof t == "function", T = (t) => typeof t == "undefined", B = (t) => T(t) || t === null, Zt = (t) => N && t instanceof SVGElement, $t = (t) => !w.defaults.hasOwnProperty(t), M = Math.pow, qt = Math.sqrt, Qt = Math.sin, Ut = Math.cos, Jt = Math.asin, Tt = Math.PI, Gt = Math.round, ft = (t, e, n) => t < e ? e : t > n ? n : t, Ht = (t, e) => {
  const n = 10 ** e;
  return Gt(t * n) / n;
}, Kt = (t, e, n = "_prev", s = "_next") => {
  const o = e[n], i = e[s];
  o ? o[s] = i : t._head = i, i ? i[n] = o : t._tail = o, e[n] = null, e[s] = null;
}, te = (t, e, n, s = "_prev", o = "_next") => {
  let i = t._tail;
  for (; i && n && n(i, e); ) i = i[s];
  const r = i ? i[o] : t._head;
  i ? i[o] = e : t._head = e, r ? r[s] = e : t._tail = e, e[s] = i, e[o] = r;
};
function dt(t) {
  const e = R(t) ? Bt.root.querySelectorAll(t) : t;
  if (e instanceof NodeList || e instanceof HTMLCollection) return e;
}
function ee(t) {
  if (B(t)) return (
    /** @type {TargetsArray} */
    []
  );
  if (!N) return (
    /** @type {JSTargetsArray} */
    Z(t) && t.flat(1 / 0) || [t]
  );
  if (Z(t)) {
    const n = t.flat(1 / 0), s = [];
    for (let o = 0, i = n.length; o < i; o++) {
      const r = n[o];
      if (!B(r)) {
        const a = dt(r);
        if (a)
          for (let l = 0, c = a.length; l < c; l++) {
            const d = a[l];
            if (!B(d)) {
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
  const e = dt(t);
  return e ? (
    /** @type {DOMTargetsArray} */
    Array.from(e)
  ) : (
    /** @type {TargetsArray} */
    [t]
  );
}
function ne(t) {
  const e = ee(t), n = e.length;
  if (n)
    for (let s = 0; s < n; s++) {
      const o = e[s];
      if (!o[ut]) {
        o[ut] = !0;
        const i = Zt(o);
        /** @type {DOMTarget} */
        (o.nodeType || i) && (o[Ct] = !0, o[Ft] = i, o[kt] = {});
      }
    }
  return e;
}
const g = (t, e) => T(t) ? e : t, C = (t, e, n, s, o, i) => {
  let r;
  if ($(t))
    r = () => {
      const a = (
        /** @type {Function} */
        t(e, n, s, i)
      );
      return isNaN(+a) ? a || 0 : +a;
    };
  else if (R(t) && p(t, Vt))
    r = () => {
      var y;
      const a = t.match(Wt), l = a[1], c = a[2];
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
const _ = (t) => t;
const L = (t = 1.68) => (e) => M(e, +t), tt = {
  in: (t) => (e) => t(e),
  out: (t) => (e) => 1 - t(1 - e),
  inOut: (t) => (e) => e < 0.5 ? t(e * 2) / 2 : 1 - t(e * -2 + 2) / 2,
  outIn: (t) => (e) => e < 0.5 ? (1 - t(1 - e * 2)) / 2 : (t(e * 2 - 1) + 1) / 2
}, se = Tt / 2, ht = Tt * 2, pt = {
  [F]: L,
  Quad: L(2),
  Cubic: L(3),
  Quart: L(4),
  Quint: L(5),
  /** @type {EasingFunction} */
  Sine: (t) => 1 - Ut(t * se),
  /** @type {EasingFunction} */
  Circ: (t) => 1 - qt(1 - t * t),
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
    const n = ft(+t, 1, 10), s = ft(+e, Rt, 2), o = s / ht * Jt(1 / n), i = ht / s;
    return (r) => r === 0 || r === 1 ? r : -n * M(2, -10 * (1 - r)) * Qt((1 - r - o) * i);
  }
}, G = /* @__PURE__ */ (() => {
  const t = { linear: _, none: _ };
  for (let e in tt)
    for (let n in pt) {
      const s = pt[n], o = tt[e];
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
})(), X = { linear: _, none: _ }, oe = (t) => {
  if (X[t]) return X[t];
  if (t.indexOf("(") <= -1) {
    const n = (
      /** @type {EasingFunction} */
      tt[t] || t.includes("Back") || t.includes("Elastic") ? (
        /** @type {EasingFunctionWithParams} */
        G[t]()
      ) : G[t]
    );
    return n ? X[t] = n : _;
  } else {
    const e = t.slice(0, -1).split("("), n = (
      /** @type {EasingFunctionWithParams} */
      G[e[0]]
    );
    return n ? X[t] = n(...e[1].split(",")) : _;
  }
};
const et = {
  _head: null,
  _tail: null
}, yt = (t, e, n) => {
  let s = et._head, o;
  for (; s; ) {
    const i = s._next, r = s.$el === t, a = !e || s.property === e, l = !n || s.parent === n;
    if (r && a && l) {
      o = s.animation;
      try {
        o.commitStyles();
      } catch (d) {
      }
      o.cancel(), Kt(et, s);
      const c = s.parent;
      c && (c._completed++, c.animations.length === c._completed && (c.completed = !0, c.paused = !0, c.muteCallbacks || (c.onComplete(c), c._resolve(c))));
    }
    s = i;
  }
  return o;
}, mt = (t, e, n, s, o) => {
  const i = e.animate(s, o), r = o.delay + +o.duration * o.iterations;
  i.playbackRate = t._speed, t.paused && i.pause(), t.duration < r && (t.duration = r, t.controlAnimation = i), t.animations.push(i), yt(e, n), te(et, { parent: t, animation: i, $el: e, property: n, _next: null, _prev: null });
  const a = () => yt(e, n, t);
  return i.oncancel = a, i.onremove = a, t.persist || (i.onfinish = a), i;
};
const Y = (t, e = 100) => {
  const n = [];
  for (let s = 0; s <= e; s++) n.push(Ht(t(s / e), 4));
  return `linear(${n.join(", ")})`;
}, gt = {}, bt = (t) => {
  let e = gt[t];
  if (e) return e;
  if (e = "linear", R(t)) {
    if (p(t, "linear") || p(t, "cubic-") || p(t, "steps") || p(t, "ease"))
      e = t;
    else if (p(t, "cubicB"))
      e = At(t);
    else {
      const n = oe(t);
      $(n) && (e = n === _ ? "linear" : Y(n));
    }
    gt[t] = e;
  } else if ($(t)) {
    const n = Y(t);
    n && (e = n);
  } else /** @type {Spring} */
  t.ease && (e = Y(
    /** @type {Spring} */
    t.ease
  ));
  return e;
}, _t = ["x", "y", "z"], ie = [
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
  ..._t
], re = [..._t, ...z.filter((t) => ["X", "Y", "Z"].some((e) => t.endsWith(e)))];
let H = null;
const j = (t, e, n, s, o) => {
  let i = R(e) ? e : C(
    /** @type {any} */
    e,
    n,
    s,
    o,
    null,
    null
  );
  return xt(i) ? ie.includes(t) || p(t, "translate") ? `${i}px` : p(t, "rotate") || p(t, "skew") ? `${i}deg` : `${i}` : i;
}, St = (t, e, n, s, o, i) => {
  let r = "0";
  const a = T(s) ? getComputedStyle(t)[e] : j(e, s, t, o, i);
  return T(n) ? r = Z(s) ? s.map((l) => j(e, l, t, o, i)) : a : r = [j(e, n, t, o, i), a], r;
};
class ae {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   */
  constructor(e, n) {
    B(H) && (N && (T(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty")) ? H = !1 : (z.forEach((u) => {
      const m = p(u, "skew"), E = p(u, "scale"), D = p(u, "rotate"), A = p(u, "translate"), O = D || m, P = O ? "<angle>" : E ? "<number>" : A ? "<length-percentage>" : "*";
      try {
        CSS.registerProperty({
          name: "--" + u,
          syntax: P,
          inherits: !1,
          initialValue: A ? "0px" : O ? "0deg" : E ? "1" : "0"
        });
      } catch (W) {
      }
    }), H = !0));
    const s = ne(e);
    s.length || console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation.");
    const o = g(n.autoplay, w.defaults.autoplay), i = o && /** @type {ScrollObserver} */
    o.link ? o : !1, r = n.alternate && /** @type {Boolean} */
    n.alternate === !0, a = n.reversed && /** @type {Boolean} */
    n.reversed === !0, l = g(n.loop, w.defaults.loop), c = (
      /** @type {Number} */
      l === !0 || l === 1 / 0 ? 1 / 0 : xt(l) ? l + 1 : 1
    ), d = r ? a ? "alternate-reverse" : "alternate" : a ? "reverse" : "normal", y = "both", h = 1;
    this.targets = s, this.animations = [], this.controlAnimation = null, this.onComplete = n.onComplete || /** @type {Callback<WAAPIAnimation>} */
    /** @type {unknown} */
    w.defaults.onComplete, this.duration = 0, this.muteCallbacks = !1, this.completed = !1, this.paused = !o || i !== !1, this.reversed = a, this.persist = g(n.persist, w.defaults.persist), this.autoplay = o, this._speed = g(n.playbackRate, w.defaults.playbackRate), this._resolve = S, this._completed = 0, this._inlineStyles = [], s.forEach((u, m) => {
      const E = u[kt], D = re.some((f) => n.hasOwnProperty(f)), A = u.style, O = this._inlineStyles[m] = {}, P = g(n.ease, w.defaults.ease), W = C(P, u, m, s, null, null), Pt = $(W) || R(W) ? W : P, nt = (
        /** @type {Spring} */
        P.ease && P
      ), st = bt(Pt), ot = (nt ? (
        /** @type {Spring} */
        nt.settlingDuration
      ) : C(g(n.duration, w.defaults.duration), u, m, s, null, null)) * h, it = C(g(n.delay, w.defaults.delay), u, m, s, null, null) * h, rt = (
        /** @type {CompositeOperation} */
        g(n.composition, "replace")
      );
      for (let f in n) {
        if (!$t(f)) continue;
        const b = {}, I = { iterations: c, direction: d, fill: y, easing: st, duration: ot, delay: it, composite: rt }, V = n[f], v = D ? z.includes(f) ? f : Lt.get(f) : !1, q = v ? "transform" : f;
        O[q] || (O[q] = A[q]);
        let x;
        if (zt(V)) {
          const k = (
            /** @type {WAAPITweenOptions} */
            V
          ), Q = g(k.ease, st), at = (
            /** @type {Spring} */
            Q.ease && Q
          ), ct = (
            /** @type {WAAPITweenOptions} */
            k.to
          ), U = (
            /** @type {WAAPITweenOptions} */
            k.from
          );
          if (I.duration = (at ? (
            /** @type {Spring} */
            at.settlingDuration
          ) : C(g(k.duration, ot), u, m, s, null, null)) * h, I.delay = C(g(k.delay, it), u, m, s, null, null) * h, I.composite = /** @type {CompositeOperation} */
          g(k.composition, rt), I.easing = bt(Q), x = St(u, f, U, ct, m, s), v ? (b[`--${v}`] = x, E[v] = x) : b[f] = St(u, f, U, ct, m, s), mt(this, u, f, b, I), !T(U))
            if (!v)
              A[f] = b[f][0];
            else {
              const lt = `--${v}`;
              A.setProperty(lt, b[lt][0]);
            }
        } else
          x = Z(V) ? V.map((k) => j(f, k, u, m, s)) : j(
            f,
            /** @type {any} */
            V,
            u,
            m,
            s
          ), v ? (b[`--${v}`] = x, E[v] = x) : b[f] = x, mt(this, u, f, b, I);
      }
      if (D) {
        let f = F;
        for (let b in E)
          f += `${jt[b]}var(--${b})) `;
        A.transform = f;
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
      const s = e.style, o = this._inlineStyles[n];
      for (let i in o) {
        const r = o[i];
        T(r) || r === F ? s.removeProperty(At(i)) : e.style[i] = r;
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
const ce = {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   * @return {WAAPIAnimation}
   */
  animate: (t, e) => new ae(t, e),
  convertEase: Y
};
function le(t, e) {
  return ce.animate(t, e);
}
function ue(t) {
  return typeof t == "function" ? {
    enter: t,
    leave: void 0
  } : {
    enter: t == null ? void 0 : t.enter,
    leave: t == null ? void 0 : t.leave
  };
}
function vt(t, e, n) {
  var c, d;
  const { enter: s, leave: o } = ue(e), i = (c = n == null ? void 0 : n.enterMargin) != null ? c : "0px", r = (d = n == null ? void 0 : n.leaveMargin) != null ? d : "0px";
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
const fe = {
  duration: 800,
  delay: 0,
  ease: "outQuad",
  threshold: 0.2,
  replay: !0,
  enterMargin: "0px",
  leaveMargin: "0px"
};
function K(t) {
  return Number.parseFloat(String(t).replaceAll("_", "."));
}
function de(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
function wt(t) {
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
function he(t = []) {
  const e = { ...fe };
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
      Number.isFinite(o) && (e.threshold = de(o, 0, 1));
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
      const o = wt(t[n + 1]);
      o !== null && (e.enterMargin = o);
      continue;
    }
    if (s === "leave" || s === "end") {
      const o = wt(t[n + 1]);
      o !== null && (e.leaveMargin = o);
    }
  }
  return e;
}
const Et = {
  fade: { opacity: [0, 1] },
  "fade-in-out": { opacity: [0, 1] },
  "fade-right": { x: [-100, 0], opacity: [0, 1] },
  "fade-left": { x: [100, 0], opacity: [0, 1] },
  "fade-up": { y: [50, 0], opacity: [0, 1] },
  "fade-down": { y: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] }
}, pe = Object.keys(Et);
function ye(t) {
  return Et[t];
}
function me(t, e) {
  e.opacity && (t.style.opacity = String(e.opacity[0]));
  const n = [];
  e.x && n.push(`translateX(${e.x[0]}px)`), e.y && n.push(`translateY(${e.y[0]}px)`), e.scale && n.push(`scale(${e.scale[0]})`), n.length > 0 && (t.style.transform = n.join(" "));
}
function ge(t, e) {
  e.opacity && (t.style.opacity = String(e.opacity[e.opacity.length - 1]));
  const n = [];
  e.x && n.push(`translateX(${e.x[e.x.length - 1]}px)`), e.y && n.push(`translateY(${e.y[e.y.length - 1]}px)`), e.scale && n.push(`scale(${e.scale[e.scale.length - 1]})`), t.style.transform = n.join(" ");
}
function be() {
  return typeof globalThis.matchMedia != "function" ? !1 : globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Se(t, { modifiers: e = [] }, { cleanup: n } = {}) {
  const s = e.filter((c) => pe.includes(c));
  if (s.length !== 1)
    return;
  const o = ye(s[0]);
  if (!o)
    return;
  const i = he(e);
  if (be()) {
    ge(t, o);
    return;
  }
  me(t, o);
  let r;
  const a = (c) => {
    var d, y, h;
    r && typeof r.cancel == "function" && r.cancel(), r = le(t, {
      ...c,
      duration: (d = c.duration) != null ? d : i.duration,
      delay: (y = c.delay) != null ? y : i.delay,
      ease: (h = c.ease) != null ? h : i.ease
    });
  }, l = s[0] === "fade-in-out" ? vt(t, {
    enter: () => a({ opacity: [0, 1] }),
    leave: () => a({ opacity: [1, 0], delay: 0 })
  }, i) : vt(t, () => {
    a(o);
  }, i);
  typeof n == "function" && n(() => {
    r && typeof r.cancel == "function" && r.cancel(), l();
  });
}
function ve(t) {
  t.directive("anime", Se);
}
export {
  ve as default
};
