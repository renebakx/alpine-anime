const R = typeof window != "undefined", K = R ? (
  /** @type {AnimeJSWindow} */
  /** @type {unknown} */
  window
) : null, jt = R ? document : null, Dt = {
  replace: 0
}, mt = /* @__PURE__ */ Symbol(), Xt = /* @__PURE__ */ Symbol(), Yt = /* @__PURE__ */ Symbol(), Lt = /* @__PURE__ */ Symbol(), $t = 1e-11, Ht = 1e3, Zt = 240, L = "", Ut = "var(", qt = /* @__PURE__ */ (() => {
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
], Qt = /* @__PURE__ */ H.reduce((t, e) => ({ ...t, [e]: e + "(" }), {}), x = () => {
}, Jt = /([a-z])([A-Z])/g, Gt = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
const Kt = {
  id: null,
  keyframes: null,
  playbackEase: null,
  playbackRate: 1,
  frameRate: Zt,
  loop: 0,
  reversed: !1,
  alternate: !1,
  autoplay: !0,
  persist: !1,
  duration: Ht,
  delay: 0,
  loopDelay: 0,
  ease: "out(2)",
  composition: Dt.replace,
  modifier: (t) => t,
  onBegin: x,
  onBeforeUpdate: x,
  onUpdate: x,
  onLoop: x,
  onPause: x,
  onComplete: x,
  onRender: x
}, te = {
  /** @type {Document|DOMTarget} */
  root: jt
}, E = {
  /** @type {DefaultsParams} */
  defaults: Kt
}, ee = { version: "4.4.1", engine: null };
R && (K.AnimeJS || (K.AnimeJS = []), K.AnimeJS.push(ee));
const Nt = (t) => t.replace(Jt, "$1-$2").toLowerCase(), b = (t, e) => t.indexOf(e) === 0, Z = Array.isArray, ne = (t) => t && t.constructor === Object, Rt = (t) => typeof t == "number" && !isNaN(t), N = (t) => typeof t == "string", U = (t) => typeof t == "function", _ = (t) => typeof t == "undefined", X = (t) => _(t) || t === null, se = (t) => R && t instanceof SVGElement, ie = (t) => !E.defaults.hasOwnProperty(t), V = Math.pow, oe = Math.sqrt, re = Math.sin, ae = Math.cos, le = Math.asin, Ot = Math.PI, ce = Math.round, gt = (t, e, n) => t < e ? e : t > n ? n : t, ue = (t, e) => {
  const n = 10 ** e;
  return ce(t * n) / n;
}, fe = (t, e, n = "_prev", s = "_next") => {
  const i = e[n], o = e[s];
  i ? i[s] = o : t._head = o, o ? o[n] = i : t._tail = i, e[n] = null, e[s] = null;
}, pe = (t, e, n, s = "_prev", i = "_next") => {
  let o = t._tail;
  for (; o && n && n(o, e); ) o = o[s];
  const r = o ? o[i] : t._head;
  o ? o[i] = e : t._head = e, r ? r[s] = e : t._tail = e, e[s] = o, e[i] = r;
};
function bt(t) {
  const e = N(t) ? te.root.querySelectorAll(t) : t;
  if (e instanceof NodeList || e instanceof HTMLCollection) return e;
}
function he(t) {
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
        const l = bt(r);
        if (l)
          for (let a = 0, c = l.length; a < c; a++) {
            const f = l[a];
            if (!X(f)) {
              let m = !1;
              for (let d = 0, p = s.length; d < p; d++)
                if (s[d] === f) {
                  m = !0;
                  break;
                }
              m || s.push(f);
            }
          }
        else {
          let a = !1;
          for (let c = 0, f = s.length; c < f; c++)
            if (s[c] === r) {
              a = !0;
              break;
            }
          a || s.push(r);
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
function de(t) {
  const e = he(t), n = e.length;
  if (n)
    for (let s = 0; s < n; s++) {
      const i = e[s];
      if (!i[mt]) {
        i[mt] = !0;
        const o = se(i);
        /** @type {DOMTarget} */
        (i.nodeType || o) && (i[Xt] = !0, i[Yt] = o, i[Lt] = {});
      }
    }
  return e;
}
const v = (t, e) => _(t) ? e : t, F = (t, e, n, s, i, o) => {
  let r;
  if (U(t))
    r = () => {
      const l = (
        /** @type {Function} */
        t(e, n, s, o)
      );
      return isNaN(+l) ? l || 0 : +l;
    };
  else if (N(t) && b(t, Ut))
    r = () => {
      var m;
      const l = t.match(Gt), a = l[1], c = l[2];
      let f = (m = getComputedStyle(
        /** @type {HTMLElement} */
        e
      )) == null ? void 0 : m.getPropertyValue(a);
      return (!f || f.trim() === L) && c && (f = c.trim()), f || 0;
    };
  else
    return t;
  return r();
};
const M = (t) => t;
const z = (t = 1.68) => (e) => V(e, +t), nt = {
  in: (t) => (e) => t(e),
  out: (t) => (e) => 1 - t(1 - e),
  inOut: (t) => (e) => e < 0.5 ? t(e * 2) / 2 : 1 - t(e * -2 + 2) / 2,
  outIn: (t) => (e) => e < 0.5 ? (1 - t(1 - e * 2)) / 2 : (t(e * 2 - 1) + 1) / 2
}, ye = Ot / 2, vt = Ot * 2, St = {
  [L]: z,
  Quad: z(2),
  Cubic: z(3),
  Quart: z(4),
  Quint: z(5),
  /** @type {EasingFunction} */
  Sine: (t) => 1 - ae(t * ye),
  /** @type {EasingFunction} */
  Circ: (t) => 1 - oe(1 - t * t),
  /** @type {EasingFunction} */
  Expo: (t) => t ? V(2, 10 * t - 10) : 0,
  /** @type {EasingFunction} */
  Bounce: (t) => {
    let e, n = 4;
    for (; t < ((e = V(2, --n)) - 1) / 11; ) ;
    return 1 / V(4, 3 - n) - 7.5625 * V((e * 3 - 2) / 22 - t, 2);
  },
  /** @type {BackEasing} */
  Back: (t = 1.7) => (e) => (+t + 1) * e * e * e - +t * e * e,
  /** @type {ElasticEasing} */
  Elastic: (t = 1, e = 0.3) => {
    const n = gt(+t, 1, 10), s = gt(+e, $t, 2), i = s / vt * le(1 / n), o = vt / s;
    return (r) => r === 0 || r === 1 ? r : -n * V(2, -10 * (1 - r)) * re((1 - r - i) * o);
  }
}, tt = /* @__PURE__ */ (() => {
  const t = { linear: M, none: M };
  for (let e in nt)
    for (let n in St) {
      const s = St[n], i = nt[e];
      t[e + n] = /** @type {EasingFunctionWithParams|EasingFunction} */
      n === L || n === "Back" || n === "Elastic" ? (o, r) => i(
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
})(), D = { linear: M, none: M }, me = (t) => {
  if (D[t]) return D[t];
  if (t.indexOf("(") <= -1) {
    const n = (
      /** @type {EasingFunction} */
      nt[t] || t.includes("Back") || t.includes("Elastic") ? (
        /** @type {EasingFunctionWithParams} */
        tt[t]()
      ) : tt[t]
    );
    return n ? D[t] = n : M;
  } else {
    const e = t.slice(0, -1).split("("), n = (
      /** @type {EasingFunctionWithParams} */
      tt[e[0]]
    );
    return n ? D[t] = n(...e[1].split(",")) : M;
  }
};
const st = {
  _head: null,
  _tail: null
}, xt = (t, e, n) => {
  let s = st._head, i;
  for (; s; ) {
    const o = s._next, r = s.$el === t, l = !e || s.property === e, a = !n || s.parent === n;
    if (r && l && a) {
      i = s.animation;
      try {
        i.commitStyles();
      } catch (f) {
      }
      i.cancel(), fe(st, s);
      const c = s.parent;
      c && (c._completed++, c.animations.length === c._completed && (c.completed = !0, c.paused = !0, c.muteCallbacks || (c.onComplete(c), c._resolve(c))));
    }
    s = o;
  }
  return i;
}, Tt = (t, e, n, s, i) => {
  const o = e.animate(s, i), r = i.delay + +i.duration * i.iterations;
  o.playbackRate = t._speed, t.paused && o.pause(), t.duration < r && (t.duration = r, t.controlAnimation = o), t.animations.push(o), xt(e, n), pe(st, { parent: t, animation: o, $el: e, property: n, _next: null, _prev: null });
  const l = () => xt(e, n, t);
  return o.oncancel = l, o.onremove = l, t.persist || (o.onfinish = l), o;
};
const Y = (t, e = 100) => {
  const n = [];
  for (let s = 0; s <= e; s++) n.push(ue(t(s / e), 4));
  return `linear(${n.join(", ")})`;
}, wt = {}, Et = (t) => {
  let e = wt[t];
  if (e) return e;
  if (e = "linear", N(t)) {
    if (b(t, "linear") || b(t, "cubic-") || b(t, "steps") || b(t, "ease"))
      e = t;
    else if (b(t, "cubicB"))
      e = Nt(t);
    else {
      const n = me(t);
      U(n) && (e = n === M ? "linear" : Y(n));
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
}, Wt = ["x", "y", "z"], ge = [
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
  ...Wt
], be = [...Wt, ...H.filter((t) => ["X", "Y", "Z"].some((e) => t.endsWith(e)))];
let et = null;
const B = (t, e, n, s, i) => {
  let o = N(e) ? e : F(
    /** @type {any} */
    e,
    n,
    s,
    i,
    null,
    null
  );
  return Rt(o) ? ge.includes(t) || b(t, "translate") ? `${o}px` : b(t, "rotate") || b(t, "skew") ? `${o}deg` : `${o}` : o;
}, At = (t, e, n, s, i, o) => {
  let r = "0";
  const l = _(s) ? getComputedStyle(t)[e] : B(e, s, t, i, o);
  return _(n) ? r = Z(s) ? s.map((a) => B(e, a, t, i, o)) : l : r = [B(e, n, t, i, o), l], r;
};
class ve {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   */
  constructor(e, n) {
    X(et) && (R && (_(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty")) ? et = !1 : (H.forEach((p) => {
      const u = b(p, "skew"), y = b(p, "scale"), T = b(p, "rotate"), g = b(p, "translate"), O = T || u, I = O ? "<angle>" : y ? "<number>" : g ? "<length-percentage>" : "*";
      try {
        CSS.registerProperty({
          name: "--" + p,
          syntax: I,
          inherits: !1,
          initialValue: g ? "0px" : O ? "0deg" : y ? "1" : "0"
        });
      } catch (j) {
      }
    }), et = !0));
    const s = de(e);
    s.length || console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation.");
    const i = v(n.autoplay, E.defaults.autoplay), o = i && /** @type {ScrollObserver} */
    i.link ? i : !1, r = n.alternate && /** @type {Boolean} */
    n.alternate === !0, l = n.reversed && /** @type {Boolean} */
    n.reversed === !0, a = v(n.loop, E.defaults.loop), c = (
      /** @type {Number} */
      a === !0 || a === 1 / 0 ? 1 / 0 : Rt(a) ? a + 1 : 1
    ), f = r ? l ? "alternate-reverse" : "alternate" : l ? "reverse" : "normal", m = "both", d = 1;
    this.targets = s, this.animations = [], this.controlAnimation = null, this.onComplete = n.onComplete || /** @type {Callback<WAAPIAnimation>} */
    /** @type {unknown} */
    E.defaults.onComplete, this.duration = 0, this.muteCallbacks = !1, this.completed = !1, this.paused = !i || o !== !1, this.reversed = l, this.persist = v(n.persist, E.defaults.persist), this.autoplay = i, this._speed = v(n.playbackRate, E.defaults.playbackRate), this._resolve = x, this._completed = 0, this._inlineStyles = [], s.forEach((p, u) => {
      const y = p[Lt], T = be.some((h) => n.hasOwnProperty(h)), g = p.style, O = this._inlineStyles[u] = {}, I = v(n.ease, E.defaults.ease), j = F(I, p, u, s, null, null), Bt = U(j) || N(j) ? j : I, lt = (
        /** @type {Spring} */
        I.ease && I
      ), ct = Et(Bt), ut = (lt ? (
        /** @type {Spring} */
        lt.settlingDuration
      ) : F(v(n.duration, E.defaults.duration), p, u, s, null, null)) * d, ft = F(v(n.delay, E.defaults.delay), p, u, s, null, null) * d, pt = (
        /** @type {CompositeOperation} */
        v(n.composition, "replace")
      );
      for (let h in n) {
        if (!ie(h)) continue;
        const S = {}, C = { iterations: c, direction: f, fill: m, easing: ct, duration: ut, delay: ft, composite: pt }, W = n[h], w = T ? H.includes(h) ? h : qt.get(h) : !1, Q = w ? "transform" : h;
        O[Q] || (O[Q] = g[Q]);
        let P;
        if (ne(W)) {
          const A = (
            /** @type {WAAPITweenOptions} */
            W
          ), J = v(A.ease, ct), ht = (
            /** @type {Spring} */
            J.ease && J
          ), dt = (
            /** @type {WAAPITweenOptions} */
            A.to
          ), G = (
            /** @type {WAAPITweenOptions} */
            A.from
          );
          if (C.duration = (ht ? (
            /** @type {Spring} */
            ht.settlingDuration
          ) : F(v(A.duration, ut), p, u, s, null, null)) * d, C.delay = F(v(A.delay, ft), p, u, s, null, null) * d, C.composite = /** @type {CompositeOperation} */
          v(A.composition, pt), C.easing = Et(J), P = At(p, h, G, dt, u, s), w ? (S[`--${w}`] = P, y[w] = P) : S[h] = At(p, h, G, dt, u, s), Tt(this, p, h, S, C), !_(G))
            if (!w)
              g[h] = S[h][0];
            else {
              const yt = `--${w}`;
              g.setProperty(yt, S[yt][0]);
            }
        } else
          P = Z(W) ? W.map((A) => B(h, A, p, u, s)) : B(
            h,
            /** @type {any} */
            W,
            p,
            u,
            s
          ), w ? (S[`--${w}`] = P, y[w] = P) : S[h] = P, Tt(this, p, h, S, C);
      }
      if (T) {
        let h = L;
        for (let S in y)
          h += `${Qt[S]}var(--${S})) `;
        g.transform = h;
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
        _(r) || r === L ? s.removeProperty(Nt(o)) : e.style[o] = r;
      }
      e.getAttribute("style") === L && e.removeAttribute("style");
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
const Se = {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   * @return {WAAPIAnimation}
   */
  animate: (t, e) => new ve(t, e),
  convertEase: Y
};
function Pt(t, e) {
  return Se.animate(t, e);
}
function xe(t) {
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
  const { enter: s, leave: i } = xe(e), o = (c = n == null ? void 0 : n.enterMargin) != null ? c : "0px", r = (f = n == null ? void 0 : n.leaveMargin) != null ? f : "0px";
  if (typeof IntersectionObserver != "function")
    return typeof s == "function" && s({ isIntersecting: !0, target: t }), () => {
    };
  let l = !!(n != null && n.initialIntersected);
  const a = new IntersectionObserver((m) => {
    for (const d of m)
      if (d.target === t) {
        if (!d.isIntersecting) {
          l && typeof i == "function" && i(d), l = !1;
          continue;
        }
        l || (l = !0, typeof s == "function" && s(d), n.replay || a.unobserve(t));
      }
  }, {
    threshold: n.threshold,
    rootMargin: `${r} 0px ${o} 0px`
  });
  return a.observe(t), () => {
    if (typeof a.disconnect == "function") {
      a.disconnect();
      return;
    }
    typeof a.unobserve == "function" && a.unobserve(t);
  };
}
function Te(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
function we(t) {
  var e, n, s, i;
  return t === "x" ? globalThis.innerWidth || ((n = (e = globalThis.document) == null ? void 0 : e.documentElement) == null ? void 0 : n.clientWidth) || 0 : globalThis.innerHeight || ((i = (s = globalThis.document) == null ? void 0 : s.documentElement) == null ? void 0 : i.clientHeight) || 0;
}
function _t(t, e) {
  if (typeof t.getBoundingClientRect != "function") return 0;
  const n = t.getBoundingClientRect(), s = we(e), i = e === "x" ? n.left : n.top, o = e === "x" ? n.width : n.height, r = s + o;
  return r <= 0 ? 0 : Te((s - i) / r, 0, 1);
}
function Ee(t, { axis: e = "y", onProgress: n } = {}) {
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
  }, l = () => {
    i && (globalThis.removeEventListener("scroll", o, { capture: !0 }), i = !1);
  }, a = new IntersectionObserver((c) => {
    for (const f of c)
      f.target === t && (s = f.isIntersecting, s ? r() : l(), o());
  });
  return a.observe(t), globalThis.addEventListener("resize", o), o(), () => {
    a.disconnect(), l(), globalThis.removeEventListener("resize", o);
  };
}
const Mt = {
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
}, It = {
  "bezier-in": "cubicBezier(0.5, 0, 0.9, 0.3)",
  "bezier-out": "cubicBezier(0.1, 0.7, 0.5, 1)"
};
function $(t) {
  return Number.parseFloat(String(t).replaceAll("_", "."));
}
function rt(t, e, n) {
  return Math.min(Math.max(t, e), n);
}
function Ae(t) {
  const e = $(t);
  return Number.isFinite(e) ? rt(e, 0, 100) / 100 : null;
}
function Pe(t, e) {
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
function ke(t = []) {
  const e = {
    ...Mt,
    parallax: { ...Mt.parallax }
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
      const i = Ae(t[n + 1]);
      i !== null && (e.threshold = i), n += 1;
      continue;
    }
    if (s === "ease") {
      const i = t[n + 1];
      if (It[i]) {
        e.ease = It[i], n += 1;
        continue;
      }
      if (i === "power-in" || i === "power-out") {
        const o = Pe(i === "power-in" ? "in" : "out", t[n + 2]);
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
const _e = {
  fade: { opacity: [0, 1] },
  "fade-in-out": { opacity: [0, 1] },
  "fade-right": { x: [-100, 0], opacity: [0, 1] },
  "fade-left": { x: [100, 0], opacity: [0, 1] },
  "fade-up": { y: [50, 0], opacity: [0, 1] },
  "fade-down": { y: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] },
  parallax: { type: "scroll", effect: "parallax" }
};
let at = { ..._e };
function Me(t, e) {
  typeof t != "string" || t.trim().length === 0 || !e || typeof e != "object" || (at[t] = e);
}
function it(t) {
  return at[t];
}
function Ie() {
  return Object.keys(at);
}
const Ce = /* @__PURE__ */ new Set(["duration", "delay", "ease", "opacity", "x", "y", "scale"]);
function k(t, e) {
  return Array.isArray(t) ? e === "last" ? t[t.length - 1] : t[0] : t;
}
function Ve(t, e, n) {
  if (n != null) {
    if (e.includes("-")) {
      t.style.setProperty(e, String(n));
      return;
    }
    t.style[e] = String(n);
  }
}
function zt(t, e, n) {
  for (const [s, i] of Object.entries(e))
    Ce.has(s) || Ve(t, s, k(i, n));
}
function ot(t, e, n) {
  e.opacity && (t.style.opacity = String(k(e.opacity, n)));
  const s = [];
  e.x && s.push(`translateX(${k(e.x, n)}px)`), e.y && s.push(`translateY(${k(e.y, n)}px)`), e.scale && s.push(`scale(${k(e.scale, n)})`), t.style.transform = s.join(" "), zt(t, e, n);
}
function Fe(t) {
  const e = t.parallax.amount / 2, n = e === 0 ? 0 : e, s = e === 0 ? 0 : -e;
  return t.parallax.reverse ? [s, n] : [n, s];
}
function Le(t, e) {
  return e === "x" ? `${t}px 0px` : `0px ${t}px`;
}
function Ne(t) {
  t.style.translate = "0px 0px", t.style.transform = "";
}
function Re(t) {
  t.style.translate = "", t.style.transform = "";
}
function Oe(t, e) {
  ot(t, e, "last"), e.opacity && (t.style.opacity = String(k(e.opacity, "first")));
}
function Vt() {
  return typeof globalThis.matchMedia != "function" ? !1 : globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function We() {
  var e, n;
  if (typeof globalThis.matchMedia == "function") {
    const s = "(max-width: 767px)", i = globalThis.matchMedia(s);
    if (i.media === s)
      return i.matches;
  }
  const t = globalThis.innerWidth || ((n = (e = globalThis.document) == null ? void 0 : e.documentElement) == null ? void 0 : n.clientWidth) || 0;
  return t > 0 && t < 768;
}
function ze(t, e) {
  e.opacity && (t.style.opacity = String(k(e.opacity, "last"))), zt(t, e, "last"), t.style.transform = "", t.style.translate = "";
}
function Be(t, { ignoreOpacity: e = !1 } = {}) {
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
function je() {
  var e;
  const t = (e = globalThis.document) == null ? void 0 : e.documentElement;
  return {
    width: globalThis.innerWidth || (t == null ? void 0 : t.clientWidth) || 0,
    height: globalThis.innerHeight || (t == null ? void 0 : t.clientHeight) || 0
  };
}
function Ft(t, e) {
  if (!Be(t, e) || typeof t.getBoundingClientRect != "function") return !1;
  const n = je();
  if (n.width <= 0 || n.height <= 0) return !1;
  const s = t.getBoundingClientRect(), i = Math.min(s.right, n.width) - Math.max(s.left, 0), o = Math.min(s.bottom, n.height) - Math.max(s.top, 0);
  return i >= 1 && o >= 1;
}
function De(t) {
  return typeof globalThis.addEventListener != "function" ? () => {
  } : (globalThis.addEventListener("load", t), globalThis.addEventListener("resize", t), () => {
    typeof globalThis.removeEventListener == "function" && (globalThis.removeEventListener("load", t), globalThis.removeEventListener("resize", t));
  });
}
function Xe(t, { modifiers: e = [] }, { cleanup: n } = {}) {
  const s = e.filter((u) => !!it(u));
  if (s.length !== 1)
    return;
  const i = s[0], o = it(i), r = ke(e), l = We();
  if (i === "parallax") {
    if (l) {
      Re(t);
      return;
    }
    if (Vt()) {
      Ne(t);
      return;
    }
    const u = Fe(r), y = Pt(t, {
      translate: u.map((g) => Le(g, r.parallax.axis)),
      duration: 1e3,
      ease: "linear",
      autoplay: !1,
      persist: !0
    }), T = Ee(t, {
      axis: r.parallax.axis,
      onProgress: (g) => {
        y && (y.progress = g);
      }
    });
    typeof n == "function" && n(() => {
      T(), y && typeof y.cancel == "function" && y.cancel();
    });
    return;
  }
  if (l) {
    ze(t, o);
    return;
  }
  if (Vt()) {
    ot(t, o, "last");
    return;
  }
  let a, c = () => {
  }, f = () => {
  };
  const m = (u) => {
    var y, T, g;
    f(), f = () => {
    }, a && typeof a.cancel == "function" && a.cancel(), a = Pt(t, {
      ...u,
      duration: (y = u.duration) != null ? y : r.duration,
      delay: (T = u.delay) != null ? T : r.delay,
      ease: (g = u.ease) != null ? g : r.ease
    });
  }, d = (u = !1) => {
    c = i === "fade-in-out" ? kt(t, {
      enter: () => m({ opacity: [0, 1] }),
      leave: () => m({ opacity: [1, 0], delay: 0 })
    }, {
      ...r,
      initialIntersected: u
    }) : kt(t, () => {
      m(o);
    }, {
      ...r,
      initialIntersected: u
    });
  }, p = () => {
    var u;
    f(), f = () => {
    }, Oe(t, o), m({ opacity: (u = o.opacity) != null ? u : [0, 1] }), !(!r.replay && i !== "fade-in-out") && d(!0);
  };
  Ft(t) ? p() : (ot(t, o, "first"), f = De(() => {
    Ft(t, { ignoreOpacity: !0 }) && (c(), c = () => {
    }, p());
  }), d(!1)), typeof n == "function" && n(() => {
    a && typeof a.cancel == "function" && a.cancel(), f(), c();
  });
}
const q = function(t) {
  t.directive("anime", Xe);
};
q.version = "1.0.0-beta-4";
q.definePreset = Me;
q.getPreset = it;
q.getPresetNames = Ie;
const Ye = "1.0.0-beta-4";
export {
  q as default,
  Me as definePreset,
  it as getPreset,
  Ie as getPresetNames,
  Ye as version
};
