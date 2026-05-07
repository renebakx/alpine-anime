const R = typeof window != "undefined", K = R ? (
  /** @type {AnimeJSWindow} */
  /** @type {unknown} */
  window
) : null, Wt = R ? document : null, jt = {
  replace: 0
}, mt = /* @__PURE__ */ Symbol(), Dt = /* @__PURE__ */ Symbol(), Xt = /* @__PURE__ */ Symbol(), Ft = /* @__PURE__ */ Symbol(), Yt = 1e-11, $t = 1e3, Ht = 240, F = "", Zt = "var(", Ut = /* @__PURE__ */ (() => {
  const t = /* @__PURE__ */ new Map();
  return t.set("x", "translateX"), t.set("y", "translateY"), t.set("z", "translateZ"), t;
})(), H = [
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
], qt = /* @__PURE__ */ H.reduce((t, e) => ({ ...t, [e]: e + "(" }), {}), x = () => {
}, Jt = /([a-z])([A-Z])/g, Qt = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
const Gt = {
  id: null,
  keyframes: null,
  playbackEase: null,
  playbackRate: 1,
  frameRate: Ht,
  loop: 0,
  reversed: !1,
  alternate: !1,
  autoplay: !0,
  persist: !1,
  duration: $t,
  delay: 0,
  loopDelay: 0,
  ease: "out(2)",
  composition: jt.replace,
  modifier: (t) => t,
  onBegin: x,
  onBeforeUpdate: x,
  onUpdate: x,
  onLoop: x,
  onPause: x,
  onComplete: x,
  onRender: x
}, Kt = {
  /** @type {Document|DOMTarget} */
  root: Wt
}, w = {
  /** @type {DefaultsParams} */
  defaults: Gt
}, te = { version: "4.4.1", engine: null };
R && (K.AnimeJS || (K.AnimeJS = []), K.AnimeJS.push(te));
const Nt = (t) => t.replace(Jt, "$1-$2").toLowerCase(), y = (t, e) => t.indexOf(e) === 0, Z = Array.isArray, ee = (t) => t && t.constructor === Object, Rt = (t) => typeof t == "number" && !isNaN(t), N = (t) => typeof t == "string", U = (t) => typeof t == "function", k = (t) => typeof t == "undefined", X = (t) => k(t) || t === null, ne = (t) => R && t instanceof SVGElement, se = (t) => !w.defaults.hasOwnProperty(t), C = Math.pow, ie = Math.sqrt, oe = Math.sin, re = Math.cos, ae = Math.asin, Ot = Math.PI, le = Math.round, gt = (t, e, n) => t < e ? e : t > n ? n : t, ce = (t, e) => {
  const n = 10 ** e;
  return le(t * n) / n;
}, ue = (t, e, n = "_prev", s = "_next") => {
  const i = e[n], o = e[s];
  i ? i[s] = o : t._head = o, o ? o[n] = i : t._tail = i, e[n] = null, e[s] = null;
}, fe = (t, e, n, s = "_prev", i = "_next") => {
  let o = t._tail;
  for (; o && n && n(o, e); ) o = o[s];
  const r = o ? o[i] : t._head;
  o ? o[i] = e : t._head = e, r ? r[s] = e : t._tail = e, e[s] = o, e[i] = r;
};
function bt(t) {
  const e = N(t) ? Kt.root.querySelectorAll(t) : t;
  if (e instanceof NodeList || e instanceof HTMLCollection) return e;
}
function pe(t) {
  if (X(t)) return (
    /** @type {TargetsArray} */
    []
  );
  if (!R) return (
    /** @type {JSTargetsArray} */
    Z(t) && t.flat(1 / 0) || [t]
  );
  if (Z(t)) {
    const n = t.flat(1 / 0), s = [];
    for (let i = 0, o = n.length; i < o; i++) {
      const r = n[i];
      if (!X(r)) {
        const a = bt(r);
        if (a)
          for (let u = 0, c = a.length; u < c; u++) {
            const f = a[u];
            if (!X(f)) {
              let m = !1;
              for (let d = 0, l = s.length; d < l; d++)
                if (s[d] === f) {
                  m = !0;
                  break;
                }
              m || s.push(f);
            }
          }
        else {
          let u = !1;
          for (let c = 0, f = s.length; c < f; c++)
            if (s[c] === r) {
              u = !0;
              break;
            }
          u || s.push(r);
        }
      }
    }
    return s;
  }
  const e = bt(t);
  return e ? (
    /** @type {DOMTargetsArray} */
    Array.from(e)
  ) : (
    /** @type {TargetsArray} */
    [t]
  );
}
function he(t) {
  const e = pe(t), n = e.length;
  if (n)
    for (let s = 0; s < n; s++) {
      const i = e[s];
      if (!i[mt]) {
        i[mt] = !0;
        const o = ne(i);
        /** @type {DOMTarget} */
        (i.nodeType || o) && (i[Dt] = !0, i[Xt] = o, i[Ft] = {});
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
  else if (N(t) && y(t, Zt))
    r = () => {
      var m;
      const a = t.match(Qt), u = a[1], c = a[2];
      let f = (m = getComputedStyle(
        /** @type {HTMLElement} */
        e
      )) == null ? void 0 : m.getPropertyValue(u);
      return (!f || f.trim() === F) && c && (f = c.trim()), f || 0;
    };
  else
    return t;
  return r();
};
const _ = (t) => t;
const B = (t = 1.68) => (e) => C(e, +t), nt = {
  in: (t) => (e) => t(e),
  out: (t) => (e) => 1 - t(1 - e),
  inOut: (t) => (e) => e < 0.5 ? t(e * 2) / 2 : 1 - t(e * -2 + 2) / 2,
  outIn: (t) => (e) => e < 0.5 ? (1 - t(1 - e * 2)) / 2 : (t(e * 2 - 1) + 1) / 2
}, de = Ot / 2, vt = Ot * 2, St = {
  [F]: B,
  Quad: B(2),
  Cubic: B(3),
  Quart: B(4),
  Quint: B(5),
  /** @type {EasingFunction} */
  Sine: (t) => 1 - re(t * de),
  /** @type {EasingFunction} */
  Circ: (t) => 1 - ie(1 - t * t),
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
    const n = gt(+t, 1, 10), s = gt(+e, Yt, 2), i = s / vt * ae(1 / n), o = vt / s;
    return (r) => r === 0 || r === 1 ? r : -n * C(2, -10 * (1 - r)) * oe((1 - r - i) * o);
  }
}, tt = /* @__PURE__ */ (() => {
  const t = { linear: _, none: _ };
  for (let e in nt)
    for (let n in St) {
      const s = St[n], i = nt[e];
      t[e + n] = /** @type {EasingFunctionWithParams|EasingFunction} */
      n === F || n === "Back" || n === "Elastic" ? (o, r) => i(
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
})(), D = { linear: _, none: _ }, ye = (t) => {
  if (D[t]) return D[t];
  if (t.indexOf("(") <= -1) {
    const n = (
      /** @type {EasingFunction} */
      nt[t] || t.includes("Back") || t.includes("Elastic") ? (
        /** @type {EasingFunctionWithParams} */
        tt[t]()
      ) : tt[t]
    );
    return n ? D[t] = n : _;
  } else {
    const e = t.slice(0, -1).split("("), n = (
      /** @type {EasingFunctionWithParams} */
      tt[e[0]]
    );
    return n ? D[t] = n(...e[1].split(",")) : _;
  }
};
const st = {
  _head: null,
  _tail: null
}, xt = (t, e, n) => {
  let s = st._head, i;
  for (; s; ) {
    const o = s._next, r = s.$el === t, a = !e || s.property === e, u = !n || s.parent === n;
    if (r && a && u) {
      i = s.animation;
      try {
        i.commitStyles();
      } catch (f) {
      }
      i.cancel(), ue(st, s);
      const c = s.parent;
      c && (c._completed++, c.animations.length === c._completed && (c.completed = !0, c.paused = !0, c.muteCallbacks || (c.onComplete(c), c._resolve(c))));
    }
    s = o;
  }
  return i;
}, Tt = (t, e, n, s, i) => {
  const o = e.animate(s, i), r = i.delay + +i.duration * i.iterations;
  o.playbackRate = t._speed, t.paused && o.pause(), t.duration < r && (t.duration = r, t.controlAnimation = o), t.animations.push(o), xt(e, n), fe(st, { parent: t, animation: o, $el: e, property: n, _next: null, _prev: null });
  const a = () => xt(e, n, t);
  return o.oncancel = a, o.onremove = a, t.persist || (o.onfinish = a), o;
};
const Y = (t, e = 100) => {
  const n = [];
  for (let s = 0; s <= e; s++) n.push(ce(t(s / e), 4));
  return `linear(${n.join(", ")})`;
}, wt = {}, Et = (t) => {
  let e = wt[t];
  if (e) return e;
  if (e = "linear", N(t)) {
    if (y(t, "linear") || y(t, "cubic-") || y(t, "steps") || y(t, "ease"))
      e = t;
    else if (y(t, "cubicB"))
      e = Nt(t);
    else {
      const n = ye(t);
      U(n) && (e = n === _ ? "linear" : Y(n));
    }
    wt[t] = e;
  } else if (U(t)) {
    const n = Y(t);
    n && (e = n);
  } else /** @type {Spring} */
  t.ease && (e = Y(
    /** @type {Spring} */
    t.ease
  ));
  return e;
}, zt = ["x", "y", "z"], me = [
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
  ...zt
], ge = [...zt, ...H.filter((t) => ["X", "Y", "Z"].some((e) => t.endsWith(e)))];
let et = null;
const W = (t, e, n, s, i) => {
  let o = N(e) ? e : V(
    /** @type {any} */
    e,
    n,
    s,
    i,
    null,
    null
  );
  return Rt(o) ? me.includes(t) || y(t, "translate") ? `${o}px` : y(t, "rotate") || y(t, "skew") ? `${o}deg` : `${o}` : o;
}, At = (t, e, n, s, i, o) => {
  let r = "0";
  const a = k(s) ? getComputedStyle(t)[e] : W(e, s, t, i, o);
  return k(n) ? r = Z(s) ? s.map((u) => W(e, u, t, i, o)) : a : r = [W(e, n, t, i, o), a], r;
};
class be {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   */
  constructor(e, n) {
    X(et) && (R && (k(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty")) ? et = !1 : (H.forEach((l) => {
      const p = y(l, "skew"), b = y(l, "scale"), v = y(l, "rotate"), A = y(l, "translate"), O = v || p, I = O ? "<angle>" : b ? "<number>" : A ? "<length-percentage>" : "*";
      try {
        CSS.registerProperty({
          name: "--" + l,
          syntax: I,
          inherits: !1,
          initialValue: A ? "0px" : O ? "0deg" : b ? "1" : "0"
        });
      } catch (j) {
      }
    }), et = !0));
    const s = he(e);
    s.length || console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation.");
    const i = g(n.autoplay, w.defaults.autoplay), o = i && /** @type {ScrollObserver} */
    i.link ? i : !1, r = n.alternate && /** @type {Boolean} */
    n.alternate === !0, a = n.reversed && /** @type {Boolean} */
    n.reversed === !0, u = g(n.loop, w.defaults.loop), c = (
      /** @type {Number} */
      u === !0 || u === 1 / 0 ? 1 / 0 : Rt(u) ? u + 1 : 1
    ), f = r ? a ? "alternate-reverse" : "alternate" : a ? "reverse" : "normal", m = "both", d = 1;
    this.targets = s, this.animations = [], this.controlAnimation = null, this.onComplete = n.onComplete || /** @type {Callback<WAAPIAnimation>} */
    /** @type {unknown} */
    w.defaults.onComplete, this.duration = 0, this.muteCallbacks = !1, this.completed = !1, this.paused = !i || o !== !1, this.reversed = a, this.persist = g(n.persist, w.defaults.persist), this.autoplay = i, this._speed = g(n.playbackRate, w.defaults.playbackRate), this._resolve = x, this._completed = 0, this._inlineStyles = [], s.forEach((l, p) => {
      const b = l[Ft], v = ge.some((h) => n.hasOwnProperty(h)), A = l.style, O = this._inlineStyles[p] = {}, I = g(n.ease, w.defaults.ease), j = V(I, l, p, s, null, null), Bt = U(j) || N(j) ? j : I, lt = (
        /** @type {Spring} */
        I.ease && I
      ), ct = Et(Bt), ut = (lt ? (
        /** @type {Spring} */
        lt.settlingDuration
      ) : V(g(n.duration, w.defaults.duration), l, p, s, null, null)) * d, ft = V(g(n.delay, w.defaults.delay), l, p, s, null, null) * d, pt = (
        /** @type {CompositeOperation} */
        g(n.composition, "replace")
      );
      for (let h in n) {
        if (!se(h)) continue;
        const S = {}, M = { iterations: c, direction: f, fill: m, easing: ct, duration: ut, delay: ft, composite: pt }, z = n[h], T = v ? H.includes(h) ? h : Ut.get(h) : !1, J = T ? "transform" : h;
        O[J] || (O[J] = A[J]);
        let P;
        if (ee(z)) {
          const E = (
            /** @type {WAAPITweenOptions} */
            z
          ), Q = g(E.ease, ct), ht = (
            /** @type {Spring} */
            Q.ease && Q
          ), dt = (
            /** @type {WAAPITweenOptions} */
            E.to
          ), G = (
            /** @type {WAAPITweenOptions} */
            E.from
          );
          if (M.duration = (ht ? (
            /** @type {Spring} */
            ht.settlingDuration
          ) : V(g(E.duration, ut), l, p, s, null, null)) * d, M.delay = V(g(E.delay, ft), l, p, s, null, null) * d, M.composite = /** @type {CompositeOperation} */
          g(E.composition, pt), M.easing = Et(Q), P = At(l, h, G, dt, p, s), T ? (S[`--${T}`] = P, b[T] = P) : S[h] = At(l, h, G, dt, p, s), Tt(this, l, h, S, M), !k(G))
            if (!T)
              A[h] = S[h][0];
            else {
              const yt = `--${T}`;
              A.setProperty(yt, S[yt][0]);
            }
        } else
          P = Z(z) ? z.map((E) => W(h, E, l, p, s)) : W(
            h,
            /** @type {any} */
            z,
            l,
            p,
            s
          ), T ? (S[`--${T}`] = P, b[T] = P) : S[h] = P, Tt(this, l, h, S, M);
      }
      if (v) {
        let h = F;
        for (let S in b)
          h += `${qt[S]}var(--${S})) `;
        A.transform = h;
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
      const s = e.style, i = this._inlineStyles[n];
      for (let o in i) {
        const r = i[o];
        k(r) || r === F ? s.removeProperty(Nt(o)) : e.style[o] = r;
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
  then(e = x) {
    const n = this.then, s = () => {
      this.then = null, e(
        /** @type {ResolvedWAAPIAnimation} */
        this
      ), this.then = n, this._resolve = x;
    };
    return new Promise((i) => (this._resolve = () => i(s()), this.completed && this._resolve(), this));
  }
}
const ve = {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   * @return {WAAPIAnimation}
   */
  animate: (t, e) => new be(t, e),
  convertEase: Y
};
function Pt(t, e) {
  return ve.animate(t, e);
}
function Se(t) {
  return typeof t == "function" ? {
    enter: t,
    leave: void 0
  } : {
    enter: t == null ? void 0 : t.enter,
    leave: t == null ? void 0 : t.leave
  };
}
function kt(t, e, n) {
  var c, f;
  const { enter: s, leave: i } = Se(e), o = (c = n == null ? void 0 : n.enterMargin) != null ? c : "0px", r = (f = n == null ? void 0 : n.leaveMargin) != null ? f : "0px";
  if (typeof IntersectionObserver != "function")
    return typeof s == "function" && s({ isIntersecting: !0, target: t }), () => {
    };
  let a = !!(n != null && n.initialIntersected);
  const u = new IntersectionObserver((m) => {
    for (const d of m)
      if (d.target === t) {
        if (!d.isIntersecting) {
          a && typeof i == "function" && i(d), a = !1;
          continue;
        }
        a || (a = !0, typeof s == "function" && s(d), n.replay || u.unobserve(t));
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
function xe(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
function Te(t) {
  var e, n, s, i;
  return t === "x" ? globalThis.innerWidth || ((n = (e = globalThis.document) == null ? void 0 : e.documentElement) == null ? void 0 : n.clientWidth) || 0 : globalThis.innerHeight || ((i = (s = globalThis.document) == null ? void 0 : s.documentElement) == null ? void 0 : i.clientHeight) || 0;
}
function _t(t, e) {
  if (typeof t.getBoundingClientRect != "function") return 0;
  const n = t.getBoundingClientRect(), s = Te(e), i = e === "x" ? n.left : n.top, o = e === "x" ? n.width : n.height, r = s + o;
  return r <= 0 ? 0 : xe((s - i) / r, 0, 1);
}
function we(t, { axis: e = "y", onProgress: n } = {}) {
  if (typeof n != "function") return () => {
  };
  if (typeof IntersectionObserver != "function")
    return n(_t(t, e)), () => {
    };
  let s = !1, i = !1;
  const o = () => {
    s && n(_t(t, e));
  }, r = () => {
    i || (globalThis.addEventListener("scroll", o, { passive: !0, capture: !0 }), i = !0);
  }, a = () => {
    i && (globalThis.removeEventListener("scroll", o, { capture: !0 }), i = !1);
  }, u = new IntersectionObserver((c) => {
    for (const f of c)
      f.target === t && (s = f.isIntersecting, s ? r() : a(), o());
  });
  return u.observe(t), globalThis.addEventListener("resize", o), o(), () => {
    u.disconnect(), a(), globalThis.removeEventListener("resize", o);
  };
}
const It = {
  duration: 800,
  delay: 0,
  ease: "out(2)",
  threshold: 0,
  replay: !0,
  enterMargin: "0px",
  leaveMargin: "0px",
  parallax: {
    amount: 120,
    axis: "y",
    reverse: !1
  }
}, Mt = {
  "bezier-in": "cubicBezier(0.5, 0, 0.9, 0.3)",
  "bezier-out": "cubicBezier(0.1, 0.7, 0.5, 1)"
};
function $(t) {
  return Number.parseFloat(String(t).replaceAll("_", "."));
}
function rt(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
function Ee(t) {
  const e = $(t);
  return Number.isFinite(e) ? rt(e, 0, 100) / 100 : null;
}
function Ae(t, e) {
  const n = Number.parseInt(e, 10);
  if (!Number.isFinite(n)) return null;
  const s = rt(n, 100, 1e3) / 100;
  return `${t}(${Number.parseFloat(s.toFixed(2))})`;
}
function Ct(t) {
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
function Pe(t = []) {
  const e = {
    ...It,
    parallax: { ...It.parallax }
  };
  for (let n = 0; n < t.length; n += 1) {
    const s = t[n];
    if (s === "duration") {
      const i = $(t[n + 1]);
      Number.isFinite(i) && (e.duration = i), n += 1;
      continue;
    }
    if (s === "delay") {
      const i = $(t[n + 1]);
      Number.isFinite(i) && (e.delay = i), n += 1;
      continue;
    }
    if (s === "threshold") {
      const i = Ee(t[n + 1]);
      i !== null && (e.threshold = i), n += 1;
      continue;
    }
    if (s === "ease") {
      const i = t[n + 1];
      if (Mt[i]) {
        e.ease = Mt[i], n += 1;
        continue;
      }
      if (i === "power-in" || i === "power-out") {
        const o = Ae(i === "power-in" ? "in" : "out", t[n + 2]);
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
      const i = Ct(t[n + 1]);
      i !== null && (e.enterMargin = i), n += 1;
      continue;
    }
    if (s === "leave" || s === "end") {
      const i = Ct(t[n + 1]);
      i !== null && (e.leaveMargin = i), n += 1;
      continue;
    }
    if (s === "amount") {
      const i = $(t[n + 1]);
      Number.isFinite(i) && (e.parallax.amount = rt(i, 0, 1e3)), n += 1;
      continue;
    }
    if (s === "axis") {
      const i = t[n + 1];
      (i === "x" || i === "y") && (e.parallax.axis = i), n += 1;
      continue;
    }
    s === "reverse" && (e.parallax.reverse = !0);
  }
  return e;
}
const ke = {
  fade: { opacity: [0, 1] },
  "fade-in-out": { opacity: [0, 1] },
  "fade-right": { x: [-100, 0], opacity: [0, 1] },
  "fade-left": { x: [100, 0], opacity: [0, 1] },
  "fade-up": { y: [50, 0], opacity: [0, 1] },
  "fade-down": { y: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] },
  parallax: { type: "scroll", effect: "parallax" }
};
let at = { ...ke };
function _e(t, e) {
  typeof t != "string" || t.trim().length === 0 || !e || typeof e != "object" || (at[t] = e);
}
function it(t) {
  return at[t];
}
function Ie() {
  return Object.keys(at);
}
const Me = /* @__PURE__ */ new Set(["duration", "delay", "ease", "opacity", "x", "y", "scale"]);
function L(t, e) {
  return Array.isArray(t) ? e === "last" ? t[t.length - 1] : t[0] : t;
}
function Ce(t, e, n) {
  if (n != null) {
    if (e.includes("-")) {
      t.style.setProperty(e, String(n));
      return;
    }
    t.style[e] = String(n);
  }
}
function Ve(t, e, n) {
  for (const [s, i] of Object.entries(e))
    Me.has(s) || Ce(t, s, L(i, n));
}
function ot(t, e, n) {
  e.opacity && (t.style.opacity = String(L(e.opacity, n)));
  const s = [];
  e.x && s.push(`translateX(${L(e.x, n)}px)`), e.y && s.push(`translateY(${L(e.y, n)}px)`), e.scale && s.push(`scale(${L(e.scale, n)})`), t.style.transform = s.join(" "), Ve(t, e, n);
}
function Le(t) {
  const e = t.parallax.amount / 2, n = e === 0 ? 0 : e, s = e === 0 ? 0 : -e;
  return t.parallax.reverse ? [s, n] : [n, s];
}
function Fe(t, e) {
  return e === "x" ? `${t}px 0px` : `0px ${t}px`;
}
function Ne(t) {
  t.style.translate = "0px 0px";
}
function Re(t, e) {
  ot(t, e, "last"), e.opacity && (t.style.opacity = String(L(e.opacity, "first")));
}
function Vt() {
  return typeof globalThis.matchMedia != "function" ? !1 : globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Oe(t, { ignoreOpacity: e = !1 } = {}) {
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
function ze() {
  var e;
  const t = (e = globalThis.document) == null ? void 0 : e.documentElement;
  return {
    width: globalThis.innerWidth || (t == null ? void 0 : t.clientWidth) || 0,
    height: globalThis.innerHeight || (t == null ? void 0 : t.clientHeight) || 0
  };
}
function Lt(t, e) {
  if (!Oe(t, e) || typeof t.getBoundingClientRect != "function") return !1;
  const n = ze();
  if (n.width <= 0 || n.height <= 0) return !1;
  const s = t.getBoundingClientRect(), i = Math.min(s.right, n.width) - Math.max(s.left, 0), o = Math.min(s.bottom, n.height) - Math.max(s.top, 0);
  return i >= 1 && o >= 1;
}
function Be(t) {
  return typeof globalThis.addEventListener != "function" ? () => {
  } : (globalThis.addEventListener("load", t), globalThis.addEventListener("resize", t), () => {
    typeof globalThis.removeEventListener == "function" && (globalThis.removeEventListener("load", t), globalThis.removeEventListener("resize", t));
  });
}
function We(t, { modifiers: e = [] }, { cleanup: n } = {}) {
  const s = e.filter((l) => !!it(l));
  if (s.length !== 1)
    return;
  const i = s[0], o = it(i), r = Pe(e);
  if (i === "parallax") {
    if (Vt()) {
      Ne(t);
      return;
    }
    const l = Le(r), p = Pt(t, {
      translate: l.map((v) => Fe(v, r.parallax.axis)),
      duration: 1e3,
      ease: "linear",
      autoplay: !1,
      persist: !0
    }), b = we(t, {
      axis: r.parallax.axis,
      onProgress: (v) => {
        p && (p.progress = v);
      }
    });
    typeof n == "function" && n(() => {
      b(), p && typeof p.cancel == "function" && p.cancel();
    });
    return;
  }
  if (Vt()) {
    ot(t, o, "last");
    return;
  }
  let a, u = () => {
  }, c = () => {
  };
  const f = (l) => {
    var p, b, v;
    c(), c = () => {
    }, a && typeof a.cancel == "function" && a.cancel(), a = Pt(t, {
      ...l,
      duration: (p = l.duration) != null ? p : r.duration,
      delay: (b = l.delay) != null ? b : r.delay,
      ease: (v = l.ease) != null ? v : r.ease
    });
  }, m = (l = !1) => {
    u = i === "fade-in-out" ? kt(t, {
      enter: () => f({ opacity: [0, 1] }),
      leave: () => f({ opacity: [1, 0], delay: 0 })
    }, {
      ...r,
      initialIntersected: l
    }) : kt(t, () => {
      f(o);
    }, {
      ...r,
      initialIntersected: l
    });
  }, d = () => {
    var l;
    c(), c = () => {
    }, Re(t, o), f({ opacity: (l = o.opacity) != null ? l : [0, 1] }), !(!r.replay && i !== "fade-in-out") && m(!0);
  };
  Lt(t) ? d() : (ot(t, o, "first"), c = Be(() => {
    Lt(t, { ignoreOpacity: !0 }) && (u(), u = () => {
    }, d());
  }), m(!1)), typeof n == "function" && n(() => {
    a && typeof a.cancel == "function" && a.cancel(), c(), u();
  });
}
const q = function(t) {
  t.directive("anime", We);
};
q.version = "1.0.0-beta-3";
q.definePreset = _e;
q.getPreset = it;
q.getPresetNames = Ie;
const je = "1.0.0-beta-3";
export {
  q as default,
  _e as definePreset,
  it as getPreset,
  Ie as getPresetNames,
  je as version
};
