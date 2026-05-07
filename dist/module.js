const Pt = typeof window != "undefined", Ot = Pt ? (
  /** @type {AnimeJSWindow} */
  /** @type {unknown} */
  window
) : null, G = Pt ? document : null, W = {
  OBJECT: 0,
  ATTRIBUTE: 1,
  CSS: 2,
  TRANSFORM: 3,
  CSS_VAR: 4
}, E = {
  NUMBER: 0,
  UNIT: 1,
  COLOR: 2,
  COMPLEX: 3
}, _t = {
  NONE: 0,
  AUTO: 1,
  FORCE: 2
}, Q = {
  replace: 0,
  none: 1,
  blend: 2
}, hs = /* @__PURE__ */ Symbol(), se = /* @__PURE__ */ Symbol(), Us = /* @__PURE__ */ Symbol(), ue = /* @__PURE__ */ Symbol(), cn = /* @__PURE__ */ Symbol(), O = 1e-11, Ve = 1e12, Bt = 1e3, Ue = 240, Nt = "", un = "var(", Je = /* @__PURE__ */ (() => {
  const e = /* @__PURE__ */ new Map();
  return e.set("x", "translateX"), e.set("y", "translateY"), e.set("z", "translateZ"), e;
})(), Wt = [
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
], Ws = /* @__PURE__ */ Wt.reduce((e, t) => ({ ...e, [t]: t + "(" }), {}), I = () => {
}, hn = /\)\s*[-.\d]/, dn = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i, fn = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i, pn = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i, mn = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i, _n = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i, ds = /[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi, gn = /^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i, yn = /([a-z])([A-Z])/g, Tn = /(\*=|\+=|-=)/, bn = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
const Se = {
  id: null,
  keyframes: null,
  playbackEase: null,
  playbackRate: 1,
  frameRate: Ue,
  loop: 0,
  reversed: !1,
  alternate: !1,
  autoplay: !0,
  persist: !1,
  duration: Bt,
  delay: 0,
  loopDelay: 0,
  ease: "out(2)",
  composition: Q.replace,
  modifier: (e) => e,
  onBegin: I,
  onBeforeUpdate: I,
  onUpdate: I,
  onLoop: I,
  onPause: I,
  onComplete: I,
  onRender: I
}, vn = {
  /** @type {Document|DOMTarget} */
  root: G
}, F = {
  /** @type {DefaultsParams} */
  defaults: Se,
  /** @type {Number} */
  precision: 4,
  /** @type {Number} equals 1 in ms mode, 0.001 in s mode */
  timeScale: 1,
  /** @type {Number} */
  tickThreshold: 200
}, zs = { version: "4.4.1", engine: null };
Pt && (Ot.AnimeJS || (Ot.AnimeJS = []), Ot.AnimeJS.push(zs));
const Ce = (e) => e.replace(yn, "$1-$2").toLowerCase(), q = (e, t) => e.indexOf(t) === 0, ne = Date.now, Mt = Array.isArray, Qt = (e) => e && e.constructor === Object, Vt = (e) => typeof e == "number" && !isNaN(e), ft = (e) => typeof e == "string", Ft = (e) => typeof e == "function", C = (e) => typeof e == "undefined", jt = (e) => C(e) || e === null, Xs = (e) => Pt && e instanceof SVGElement, Hs = (e) => dn.test(e), Ys = (e) => q(e, "rgb"), qs = (e) => q(e, "hsl"), Sn = (e) => Hs(e) || (Ys(e) || qs(e)) && (e[e.length - 1] === ")" || !hn.test(e)), ae = (e) => !F.defaults.hasOwnProperty(e), xn = ["opacity", "rotate", "overflow", "color"], En = (e, t) => {
  if (xn.includes(t)) return !1;
  if (e.getAttribute(t) || t in e) {
    if (t === "scale") {
      const s = (
        /** @type {SVGGeometryElement} */
        /** @type {DOMTarget} */
        e.parentNode
      );
      return s && s.tagName === "filter";
    }
    return !0;
  }
}, qt = Math.pow, Cn = Math.sqrt, wn = Math.sin, Rn = Math.cos, An = Math.floor, Nn = Math.asin, Ge = Math.PI, fs = Math.round, it = (e, t, s) => e < t ? t : e > s ? s : e, L = (e, t) => {
  if (t < 0) return e;
  if (!t) return fs(e);
  const s = 10 ** t;
  return fs(e * s) / s;
}, At = (e, t, s) => e + (t - e) * s, Ke = (e) => e === 1 / 0 ? Ve : e === -1 / 0 ? -Ve : e, le = (e) => e <= O ? O : Ke(L(e, 11)), st = (e) => Mt(e) ? [...e] : e, Fn = (e, t) => {
  const s = (
    /** @type {T & U} */
    { ...e }
  );
  for (let n in t) {
    const i = (
      /** @type {T & U} */
      e[n]
    );
    s[n] = C(i) ? (
      /** @type {T & U} */
      t[n]
    ) : i;
  }
  return s;
}, z = (e, t, s, n = "_prev", i = "_next") => {
  let r = e._head, o = i;
  for (s && (r = e._tail, o = n); r; ) {
    const c = r[o];
    t(r), r = c;
  }
}, Ut = (e, t, s = "_prev", n = "_next") => {
  const i = t[s], r = t[n];
  i ? i[n] = r : e._head = r, r ? r[s] = i : e._tail = i, t[s] = null, t[n] = null;
}, Lt = (e, t, s, n = "_prev", i = "_next") => {
  let r = e._tail;
  for (; r && s && s(r, t); ) r = r[n];
  const o = r ? r[i] : e._head;
  r ? r[i] = t : e._head = t, o ? o[n] = t : e._tail = t, t[n] = r, t[i] = o;
};
function ps(e) {
  const t = ft(e) ? vn.root.querySelectorAll(e) : e;
  if (t instanceof NodeList || t instanceof HTMLCollection) return t;
}
function Qe(e) {
  if (jt(e)) return (
    /** @type {TargetsArray} */
    []
  );
  if (!Pt) return (
    /** @type {JSTargetsArray} */
    Mt(e) && e.flat(1 / 0) || [e]
  );
  if (Mt(e)) {
    const s = e.flat(1 / 0), n = [];
    for (let i = 0, r = s.length; i < r; i++) {
      const o = s[i];
      if (!jt(o)) {
        const c = ps(o);
        if (c)
          for (let l = 0, a = c.length; l < a; l++) {
            const u = c[l];
            if (!jt(u)) {
              let d = !1;
              for (let f = 0, h = n.length; f < h; f++)
                if (n[f] === u) {
                  d = !0;
                  break;
                }
              d || n.push(u);
            }
          }
        else {
          let l = !1;
          for (let a = 0, u = n.length; a < u; a++)
            if (n[a] === o) {
              l = !0;
              break;
            }
          l || n.push(o);
        }
      }
    }
    return n;
  }
  const t = ps(e);
  return t ? (
    /** @type {DOMTargetsArray} */
    Array.from(t)
  ) : (
    /** @type {TargetsArray} */
    [e]
  );
}
function je(e) {
  const t = Qe(e), s = t.length;
  if (s)
    for (let n = 0; n < s; n++) {
      const i = t[n];
      if (!i[hs]) {
        i[hs] = !0;
        const r = Xs(i);
        /** @type {DOMTarget} */
        (i.nodeType || r) && (i[se] = !0, i[Us] = r, i[ue] = {});
      }
    }
  return t;
}
const Pn = (e, t, s) => {
  const n = e.style.transform;
  if (n) {
    const i = e[ue];
    let r = 0;
    const o = n.length;
    let c;
    for (; r < o; ) {
      for (; r < o && n.charCodeAt(r) === 32; ) r++;
      if (r >= o) break;
      const a = r;
      for (; r < o && n.charCodeAt(r) !== 40; ) r++;
      if (r >= o) break;
      const u = n.substring(a, r);
      let d = 1;
      const f = r + 1;
      let h = -1, p = -1;
      for (r++; r < o && d > 0; ) {
        const y = n.charCodeAt(r);
        y === 40 ? d++ : y === 41 ? d-- : y === 44 && d === 1 && (h === -1 ? h = r : p === -1 && (p = r)), r++;
      }
      const m = r - 1;
      u === "translate" || u === "translate3d" ? (h === -1 ? i.translateX = n.substring(f, m).trim() : (i.translateX = n.substring(f, h).trim(), p === -1 ? i.translateY = n.substring(h + 1, m).trim() : (i.translateY = n.substring(h + 1, p).trim(), i.translateZ = n.substring(p + 1, m).trim())), c = n.substring(f, m)) : u === "scale" || u === "scale3d" ? h === -1 ? i.scale = n.substring(f, m).trim() : (i.scaleX = n.substring(f, h).trim(), p === -1 ? i.scaleY = n.substring(h + 1, m).trim() : (i.scaleY = n.substring(h + 1, p).trim(), i.scaleZ = n.substring(p + 1, m).trim())) : i[u] = n.substring(f, m);
    }
    if (t === "translate3d" && c)
      return s && (s[t] = c), c;
    const l = i[t];
    if (!C(l))
      return s && (s[t] = l), l;
  }
  return t === "translate3d" ? "0px, 0px, 0px" : t === "rotate3d" ? "0, 0, 0, 0deg" : q(t, "scale") ? "1" : q(t, "rotate") || q(t, "skew") ? "0deg" : "0px";
}, Zs = (e) => {
  let t = Nt;
  for (let s = 0, n = Wt.length; s < n; s++) {
    const i = Wt[s], r = e[i];
    if (r !== void 0) {
      if (i === "translateX") {
        const o = e.translateY;
        if (o !== void 0) {
          const c = e.translateZ;
          c !== void 0 ? (t += `translate3d(${r},${o},${c}) `, s += 2) : (t += `translate(${r},${o}) `, s += 1);
          continue;
        }
      }
      if (i === "scaleX" && e.scale === void 0) {
        const o = e.scaleY;
        if (o !== void 0) {
          const c = e.scaleZ;
          c !== void 0 ? (t += `scale3d(${r},${o},${c}) `, s += 2) : (t += `scale(${r},${o}) `, s += 1);
          continue;
        }
      }
      t += `${Ws[i]}${r}) `;
    }
    i === "rotateZ" && e.rotate3d !== void 0 && (t += `rotate3d(${e.rotate3d}) `);
  }
  return e.matrix !== void 0 && (t += `matrix(${e.matrix}) `), e.matrix3d !== void 0 && (t += `matrix3d(${e.matrix3d}) `), t;
};
const In = (e) => {
  const t = fn.exec(e) || pn.exec(e), s = C(t[4]) ? 1 : +t[4];
  return [
    +t[1],
    +t[2],
    +t[3],
    s
  ];
}, kn = (e) => {
  const t = e.length, s = t === 4 || t === 5;
  return [
    +("0x" + e[1] + e[s ? 1 : 2]),
    +("0x" + e[s ? 2 : 3] + e[s ? 2 : 4]),
    +("0x" + e[s ? 3 : 5] + e[s ? 3 : 6]),
    t === 5 || t === 9 ? +(+("0x" + e[s ? 4 : 7] + e[s ? 4 : 8]) / 255).toFixed(3) : 1
  ];
}, De = (e, t, s) => (s < 0 && (s += 1), s > 1 && (s -= 1), s < 1 / 6 ? e + (t - e) * 6 * s : s < 1 / 2 ? t : s < 2 / 3 ? e + (t - e) * (2 / 3 - s) * 6 : e), $n = (e) => {
  const t = mn.exec(e) || _n.exec(e), s = +t[1] / 360, n = +t[2] / 100, i = +t[3] / 100, r = C(t[4]) ? 1 : +t[4];
  let o, c, l;
  if (n === 0)
    o = c = l = i;
  else {
    const a = i < 0.5 ? i * (1 + n) : i + n - i * n, u = 2 * i - a;
    o = L(De(u, a, s + 1 / 3) * 255, 0), c = L(De(u, a, s) * 255, 0), l = L(De(u, a, s - 1 / 3) * 255, 0);
  }
  return [o, c, l, r];
}, Dn = (e) => Ys(e) ? In(e) : Hs(e) ? kn(e) : qs(e) ? $n(e) : [0, 0, 0, 1];
const R = (e, t) => C(e) ? t : e, rt = (e, t, s, n, i, r) => {
  let o;
  if (Ft(e))
    o = () => {
      const c = (
        /** @type {Function} */
        e(t, s, n, r)
      );
      return isNaN(+c) ? c || 0 : +c;
    };
  else if (ft(e) && q(e, un))
    o = () => {
      var d;
      const c = e.match(bn), l = c[1], a = c[2];
      let u = (d = getComputedStyle(
        /** @type {HTMLElement} */
        t
      )) == null ? void 0 : d.getPropertyValue(l);
      return (!u || u.trim() === Nt) && a && (u = a.trim()), u || 0;
    };
  else
    return e;
  return i && (i.func = o), o();
}, ts = (e, t) => e[se] ? (
  // Handle SVG attributes
  e[Us] && En(e, t) ? W.ATTRIBUTE : (
    // Handle CSS Transform properties differently than CSS to allow individual animations
    Wt.includes(t) || Je.get(t) ? W.TRANSFORM : (
      // CSS variables
      q(t, "--") ? W.CSS_VAR : (
        // All other CSS properties
        t in /** @type {DOMTarget} */
        e.style ? W.CSS : (
          // Handle other DOM Attributes
          t in e ? W.OBJECT : W.ATTRIBUTE
        )
      )
    )
  )
) : W.OBJECT, ms = (e, t, s) => {
  const n = e.style[t];
  n && s && (s[t] = n);
  const i = n || getComputedStyle(e[cn] || e).getPropertyValue(t);
  return i === "auto" ? "0" : i;
}, Zt = (e, t, s, n) => {
  const i = C(s) ? ts(e, t) : s;
  if (i === W.OBJECT) {
    const r = e[t];
    return r && n && (n[t] = r), r || 0;
  }
  if (i === W.ATTRIBUTE) {
    const r = (
      /** @type {DOMTarget} */
      e.getAttribute(t)
    );
    return r && n && (n[t] = r), r;
  }
  return i === W.TRANSFORM ? Pn(
    /** @type {DOMTarget} */
    e,
    t,
    n
  ) : i === W.CSS_VAR ? ms(
    /** @type {DOMTarget} */
    e,
    t,
    n
  ).trimStart() : ms(
    /** @type {DOMTarget} */
    e,
    t,
    n
  );
}, te = (e, t, s) => s === "-" ? e - t : s === "+" ? e + t : e * t, es = () => ({
  /** @type {valueTypes} */
  t: E.NUMBER,
  n: 0,
  u: null,
  o: null,
  d: null,
  s: null
}), ht = (e, t) => {
  if (t.t = E.NUMBER, t.n = 0, t.u = null, t.o = null, t.d = null, t.s = null, !e) return t;
  const s = +e;
  if (isNaN(s)) {
    let n = (
      /** @type {String} */
      e
    );
    n[1] === "=" && (t.o = n[0], n = n.slice(2));
    const i = n.includes(" ") ? !1 : gn.exec(n);
    if (i)
      return t.t = E.UNIT, t.n = +i[1], t.u = i[2], t;
    if (t.o)
      return t.n = +n, t;
    if (Sn(n))
      return t.t = E.COLOR, t.d = Dn(n), t;
    {
      const r = n.match(ds);
      return t.t = E.COMPLEX, t.d = r ? r.map(Number) : [], t.s = n.split(ds) || [], t;
    }
  } else
    return t.n = s, t;
}, _s = (e, t) => (t.t = e._valueType, t.n = e._toNumber, t.u = e._unit, t.o = null, t.d = st(e._toNumbers), t.s = st(e._strings), t), dt = es(), Js = (e, t, s) => {
  const n = e._modifier, i = e._fromNumbers, r = e._toNumbers, o = L(it(
    /** @type {Number} */
    n(At(i[0], r[0], t)),
    0,
    255
  ), 0), c = L(it(
    /** @type {Number} */
    n(At(i[1], r[1], t)),
    0,
    255
  ), 0), l = L(it(
    /** @type {Number} */
    n(At(i[2], r[2], t)),
    0,
    255
  ), 0), a = it(
    /** @type {Number} */
    n(L(At(i[3], r[3], t), s)),
    0,
    1
  );
  if (e._composition !== Q.none) {
    const u = e._numbers;
    u[0] = o, u[1] = c, u[2] = l, u[3] = a;
  }
  return `rgba(${o},${c},${l},${a})`;
}, Gs = (e, t, s) => {
  const n = e._modifier, i = e._fromNumbers, r = e._toNumbers, o = e._strings, c = e._composition !== Q.none;
  let l = o[0];
  for (let a = 0, u = r.length; a < u; a++) {
    const d = (
      /** @type {Number} */
      n(L(At(i[a], r[a], t), s))
    ), f = o[a + 1];
    l += `${f ? d + f : d}`, c && (e._numbers[a] = d);
  }
  return l;
};
const St = (e) => e;
const re = (e = 1.68) => (t) => qt(t, +e), We = {
  in: (e) => (t) => e(t),
  out: (e) => (t) => 1 - e(1 - t),
  inOut: (e) => (t) => t < 0.5 ? e(t * 2) / 2 : 1 - e(t * -2 + 2) / 2,
  outIn: (e) => (t) => t < 0.5 ? (1 - e(1 - t * 2)) / 2 : (e(t * 2 - 1) + 1) / 2
}, On = Ge / 2, gs = Ge * 2, ys = {
  [Nt]: re,
  Quad: re(2),
  Cubic: re(3),
  Quart: re(4),
  Quint: re(5),
  /** @type {EasingFunction} */
  Sine: (e) => 1 - Rn(e * On),
  /** @type {EasingFunction} */
  Circ: (e) => 1 - Cn(1 - e * e),
  /** @type {EasingFunction} */
  Expo: (e) => e ? qt(2, 10 * e - 10) : 0,
  /** @type {EasingFunction} */
  Bounce: (e) => {
    let t, s = 4;
    for (; e < ((t = qt(2, --s)) - 1) / 11; ) ;
    return 1 / qt(4, 3 - s) - 7.5625 * qt((t * 3 - 2) / 22 - e, 2);
  },
  /** @type {BackEasing} */
  Back: (e = 1.7) => (t) => (+e + 1) * t * t * t - +e * t * t,
  /** @type {ElasticEasing} */
  Elastic: (e = 1, t = 0.3) => {
    const s = it(+e, 1, 10), n = it(+t, O, 2), i = n / gs * Nn(1 / s), r = gs / n;
    return (o) => o === 0 || o === 1 ? o : -s * qt(2, -10 * (1 - o)) * wn((1 - o - i) * r);
  }
}, Oe = /* @__PURE__ */ (() => {
  const e = { linear: St, none: St };
  for (let t in We)
    for (let s in ys) {
      const n = ys[s], i = We[t];
      e[t + s] = /** @type {EasingFunctionWithParams|EasingFunction} */
      s === Nt || s === "Back" || s === "Elastic" ? (r, o) => i(
        /** @type {EasingFunctionWithParams} */
        n(r, o)
      ) : i(
        /** @type {EasingFunction} */
        n
      );
    }
  return (
    /** @type {EasesFunctions} */
    e
  );
})(), de = { linear: St, none: St }, Ks = (e) => {
  if (de[e]) return de[e];
  if (e.indexOf("(") <= -1) {
    const s = (
      /** @type {EasingFunction} */
      We[e] || e.includes("Back") || e.includes("Elastic") ? (
        /** @type {EasingFunctionWithParams} */
        Oe[e]()
      ) : Oe[e]
    );
    return s ? de[e] = s : St;
  } else {
    const t = e.slice(0, -1).split("("), s = (
      /** @type {EasingFunctionWithParams} */
      Oe[t[0]]
    );
    return s ? de[e] = s(...t[1].split(",")) : St;
  }
}, Ts = ["steps(", "irregular(", "linear(", "cubicBezier("], ze = (e) => {
  if (ft(e)) {
    for (let s = 0, n = Ts.length; s < n; s++)
      if (q(e, Ts[s]))
        return console.warn(`String syntax for \`ease: "${e}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${e}\``), St;
  }
  return Ft(e) ? e : ft(e) ? Ks(
    /** @type {String} */
    e
  ) : St;
};
const Xe = {
  _head: null,
  _tail: null
}, bs = (e, t, s) => {
  let n = Xe._head, i;
  for (; n; ) {
    const r = n._next, o = n.$el === e, c = !t || n.property === t, l = !s || n.parent === s;
    if (o && c && l) {
      i = n.animation;
      try {
        i.commitStyles();
      } catch (u) {
      }
      i.cancel(), Ut(Xe, n);
      const a = n.parent;
      a && (a._completed++, a.animations.length === a._completed && (a.completed = !0, a.paused = !0, a.muteCallbacks || (a.onComplete(a), a._resolve(a))));
    }
    n = r;
  }
  return i;
}, vs = (e, t, s, n, i) => {
  const r = t.animate(n, i), o = i.delay + +i.duration * i.iterations;
  r.playbackRate = e._speed, e.paused && r.pause(), e.duration < o && (e.duration = o, e.controlAnimation = r), e.animations.push(r), bs(t, s), Lt(Xe, { parent: e, animation: r, $el: t, property: s, _next: null, _prev: null });
  const c = () => bs(t, s, e);
  return r.oncancel = c, r.onremove = c, e.persist || (r.onfinish = c), r;
};
const ye = (e, t = 100) => {
  const s = [];
  for (let n = 0; n <= t; n++) s.push(L(e(n / t), 4));
  return `linear(${s.join(", ")})`;
}, Ss = {}, xs = (e) => {
  let t = Ss[e];
  if (t) return t;
  if (t = "linear", ft(e)) {
    if (q(e, "linear") || q(e, "cubic-") || q(e, "steps") || q(e, "ease"))
      t = e;
    else if (q(e, "cubicB"))
      t = Ce(e);
    else {
      const s = Ks(e);
      Ft(s) && (t = s === St ? "linear" : ye(s));
    }
    Ss[e] = t;
  } else if (Ft(e)) {
    const s = ye(e);
    s && (t = s);
  } else /** @type {Spring} */
  e.ease && (t = ye(
    /** @type {Spring} */
    e.ease
  ));
  return t;
}, Qs = ["x", "y", "z"], Ln = [
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
  ...Qs
], Bn = [...Qs, ...Wt.filter((e) => ["X", "Y", "Z"].some((t) => e.endsWith(t)))];
let Le = null;
const ce = (e, t, s, n, i) => {
  let r = ft(t) ? t : rt(
    /** @type {any} */
    t,
    s,
    n,
    i,
    null,
    null
  );
  return Vt(r) ? Ln.includes(e) || q(e, "translate") ? `${r}px` : q(e, "rotate") || q(e, "skew") ? `${r}deg` : `${r}` : r;
}, Es = (e, t, s, n, i, r) => {
  let o = "0";
  const c = C(n) ? getComputedStyle(e)[t] : ce(t, n, e, i, r);
  return C(s) ? o = Mt(n) ? n.map((l) => ce(t, l, e, i, r)) : c : o = [ce(t, s, e, i, r), c], o;
};
class Mn {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   */
  constructor(t, s) {
    jt(Le) && (Pt && (C(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty")) ? Le = !1 : (Wt.forEach((h) => {
      const p = q(h, "skew"), m = q(h, "scale"), y = q(h, "rotate"), b = q(h, "translate"), x = y || p, $ = x ? "<angle>" : m ? "<number>" : b ? "<length-percentage>" : "*";
      try {
        CSS.registerProperty({
          name: "--" + h,
          syntax: $,
          inherits: !1,
          initialValue: b ? "0px" : x ? "0deg" : m ? "1" : "0"
        });
      } catch (N) {
      }
    }), Le = !0));
    const n = je(t);
    n.length || console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation.");
    const i = R(s.autoplay, F.defaults.autoplay), r = i && /** @type {ScrollObserver} */
    i.link ? i : !1, o = s.alternate && /** @type {Boolean} */
    s.alternate === !0, c = s.reversed && /** @type {Boolean} */
    s.reversed === !0, l = R(s.loop, F.defaults.loop), a = (
      /** @type {Number} */
      l === !0 || l === 1 / 0 ? 1 / 0 : Vt(l) ? l + 1 : 1
    ), u = o ? c ? "alternate-reverse" : "alternate" : c ? "reverse" : "normal", d = "both", f = F.timeScale === 1 ? 1 : Bt;
    this.targets = n, this.animations = [], this.controlAnimation = null, this.onComplete = s.onComplete || /** @type {Callback<WAAPIAnimation>} */
    /** @type {unknown} */
    F.defaults.onComplete, this.duration = 0, this.muteCallbacks = !1, this.completed = !1, this.paused = !i || r !== !1, this.reversed = c, this.persist = R(s.persist, F.defaults.persist), this.autoplay = i, this._speed = R(s.playbackRate, F.defaults.playbackRate), this._resolve = I, this._completed = 0, this._inlineStyles = [], n.forEach((h, p) => {
      const m = h[ue], y = Bn.some((S) => s.hasOwnProperty(S)), b = h.style, x = this._inlineStyles[p] = {}, $ = R(s.ease, F.defaults.ease), N = rt($, h, p, n, null, null), X = Ft(N) || ft(N) ? N : $, w = (
        /** @type {Spring} */
        $.ease && $
      ), Y = xs(X), j = (w ? (
        /** @type {Spring} */
        w.settlingDuration
      ) : rt(R(s.duration, F.defaults.duration), h, p, n, null, null)) * f, tt = rt(R(s.delay, F.defaults.delay), h, p, n, null, null) * f, M = (
        /** @type {CompositeOperation} */
        R(s.composition, "replace")
      );
      for (let S in s) {
        if (!ae(S)) continue;
        const A = {}, H = { iterations: a, direction: u, fill: d, easing: Y, duration: j, delay: tt, composite: M }, T = s[S], k = y ? Wt.includes(S) ? S : Je.get(S) : !1, V = k ? "transform" : S;
        x[V] || (x[V] = b[V]);
        let B;
        if (Qt(T)) {
          const U = (
            /** @type {WAAPITweenOptions} */
            T
          ), _ = R(U.ease, Y), P = (
            /** @type {Spring} */
            _.ease && _
          ), Z = (
            /** @type {WAAPITweenOptions} */
            U.to
          ), K = (
            /** @type {WAAPITweenOptions} */
            U.from
          );
          if (H.duration = (P ? (
            /** @type {Spring} */
            P.settlingDuration
          ) : rt(R(U.duration, j), h, p, n, null, null)) * f, H.delay = rt(R(U.delay, tt), h, p, n, null, null) * f, H.composite = /** @type {CompositeOperation} */
          R(U.composition, M), H.easing = xs(_), B = Es(h, S, K, Z, p, n), k ? (A[`--${k}`] = B, m[k] = B) : A[S] = Es(h, S, K, Z, p, n), vs(this, h, S, A, H), !C(K))
            if (!k)
              b[S] = A[S][0];
            else {
              const xt = `--${k}`;
              b.setProperty(xt, A[xt][0]);
            }
        } else
          B = Mt(T) ? T.map((U) => ce(S, U, h, p, n)) : ce(
            S,
            /** @type {any} */
            T,
            h,
            p,
            n
          ), k ? (A[`--${k}`] = B, m[k] = B) : A[S] = B, vs(this, h, S, A, H);
      }
      if (y) {
        let S = Nt;
        for (let A in m)
          S += `${Ws[A]}var(--${A})) `;
        b.transform = S;
      }
    }), r && this.autoplay.link(this);
  }
  /**
   * @callback forEachCallback
   * @param {globalThis.Animation} animation
   */
  /**
   * @param  {forEachCallback|String} callback
   * @return {this}
   */
  forEach(t) {
    try {
      const s = ft(t) ? (n) => n[t]() : t;
      this.animations.forEach(s);
    } catch (s) {
    }
    return this;
  }
  get speed() {
    return this._speed;
  }
  set speed(t) {
    this._speed = +t, this.forEach((s) => s.playbackRate = t);
  }
  get currentTime() {
    const t = this.controlAnimation, s = F.timeScale;
    return this.completed ? this.duration : t ? +t.currentTime * (s === 1 ? 1 : s) : 0;
  }
  set currentTime(t) {
    const s = t * (F.timeScale === 1 ? 1 : Bt);
    this.forEach((n) => {
      !this.persist && s >= this.duration && n.play(), n.currentTime = s;
    });
  }
  get progress() {
    return this.currentTime / this.duration;
  }
  set progress(t) {
    this.forEach((s) => s.currentTime = t * this.duration || 0);
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
  seek(t, s = !1) {
    return s && (this.muteCallbacks = !0), t < this.duration && (this.completed = !1), this.currentTime = t, this.muteCallbacks = !1, this.paused && this.pause(), this;
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
      this.targets.forEach((t) => {
        t.style.transform === "none" && t.style.removeProperty("transform");
      });
    }), this;
  }
  revert() {
    return this.cancel().targets.forEach((t, s) => {
      const n = t.style, i = this._inlineStyles[s];
      for (let r in i) {
        const o = i[r];
        C(o) || o === Nt ? n.removeProperty(Ce(r)) : t.style[r] = o;
      }
      t.getAttribute("style") === Nt && t.removeAttribute("style");
    }), this;
  }
  /**
   * @typedef {this & {then: null}} ResolvedWAAPIAnimation
   */
  /**
   * @param  {Callback<ResolvedWAAPIAnimation>} [callback]
   * @return Promise<this>
   */
  then(t = I) {
    const s = this.then, n = () => {
      this.then = null, t(
        /** @type {ResolvedWAAPIAnimation} */
        this
      ), this.then = s, this._resolve = I;
    };
    return new Promise((i) => (this._resolve = () => i(n()), this.completed && this._resolve(), this));
  }
}
const Vn = {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   * @return {WAAPIAnimation}
   */
  animate: (e, t) => new Mn(e, t),
  convertEase: ye
};
const Be = { deg: 1, rad: 180 / Ge, turn: 360 }, Cs = {}, xe = (e, t, s, n = !1) => {
  const i = t.u, r = t.n;
  if (t.t === E.UNIT && i === s)
    return t;
  const o = r + i + s, c = Cs[o];
  if (!C(c) && !n)
    t.n = c;
  else {
    let l;
    if (i in Be)
      l = r * Be[i] / Be[s];
    else {
      const u = (
        /** @type {DOMTarget} */
        e.cloneNode()
      ), d = e.parentNode, f = d && d !== G ? d : G.body;
      f.appendChild(u);
      const h = u.style;
      h.width = 100 + i;
      const p = (
        /** @type {HTMLElement} */
        u.offsetWidth || 100
      );
      h.width = 100 + s;
      const m = (
        /** @type {HTMLElement} */
        u.offsetWidth || 100
      ), y = p / m;
      f.removeChild(u), l = y * r;
    }
    t.n = l, Cs[o] = l;
  }
  return t.t, E.UNIT, t.u = s, t;
};
const Te = (e, t, s, n, i) => {
  const r = e.parent, o = e.duration, c = e.completed, l = e.iterationDuration, a = e.iterationCount, u = e._currentIteration, d = e._loopDelay, f = e._reversed, h = e._alternate, p = e._hasChildren, m = e._delay, y = e._currentTime, b = m + l, x = t - m, $ = it(y, -m, o), N = it(x, -m, o), X = x - y, w = N > 0, Y = N >= o, j = o <= O, tt = i === _t.FORCE;
  let M = 0, S = x, A = 0;
  if (a > 1) {
    const B = ~~(N / (l + (Y ? 0 : d)));
    e._currentIteration = it(B, 0, a), Y && e._currentIteration--, M = e._currentIteration % 2, S = N % (l + d) || 0;
  }
  const H = f ^ (h && M), T = (
    /** @type {Renderable} */
    e._ease
  );
  let k = Y ? H ? 0 : o : H ? l - S : S;
  T && (k = l * T(k / l) || 0);
  const V = (r ? r.backwards : x < y) ? !H : !!H;
  if (e._currentTime = x, e._iterationTime = k, e.backwards = V, w && !e.began ? (e.began = !0, !s && !(r && (V || !r.began)) && e.onBegin(
    /** @type {CallbackArgument} */
    e
  )) : x <= 0 && (e.began = !1), !s && !p && w && e._currentIteration !== u && e.onLoop(
    /** @type {CallbackArgument} */
    e
  ), tt || i === _t.AUTO && (t >= m && t <= b || // Normal render
  t <= m && $ > m || // Playhead is before the animation start time so make sure the animation is at its initial state
  t >= b && $ !== o) || k >= b && $ !== o || k <= m && $ > 0 || t <= $ && $ === o && c || // Force a render if a seek occurs on an completed animation
  Y && !c && j) {
    if (w && (e.computeDeltaTime($), s || e.onBeforeUpdate(
      /** @type {CallbackArgument} */
      e
    )), !p) {
      const B = tt || (V ? X * -1 : X) >= F.tickThreshold, U = e._offset + (r ? r._offset : 0) + m + k;
      let _ = (
        /** @type {Tween} */
        /** @type {JSAnimation} */
        e._head
      ), P, Z, K, xt, zt = 0;
      for (; _; ) {
        const gt = _._composition, ot = _._currentTime, at = _._changeDuration, ut = _._absoluteStartTime + _._changeDuration, It = _._nextRep, yt = _._prevRep, Tt = gt !== Q.none;
        if ((B || (ot !== at || U <= ut + (It ? It._delay : 0)) && (ot !== 0 || U >= _._absoluteStartTime)) && (!Tt || !_._isOverridden && (!_._isOverlapped || U <= ut) && (!It || It._isOverridden || U <= It._absoluteStartTime) && (!yt || yt._isOverridden || U >= yt._absoluteStartTime + yt._changeDuration + _._delay))) {
          const Xt = _._currentTime = it(k - _._startTime, 0, at), bt = _._ease(Xt / _._updateDuration), kt = _._modifier, vt = _._valueType, pt = _._tweenType, Et = pt === W.OBJECT, Ct = vt === E.NUMBER, $t = Ct && Et || bt === 0 || bt === 1 ? -1 : F.precision;
          let J, wt;
          if (Ct ? J = wt = /** @type {Number} */
          kt(L(At(_._fromNumber, _._toNumber, bt), $t)) : vt === E.UNIT ? (wt = /** @type {Number} */
          kt(L(At(_._fromNumber, _._toNumber, bt), $t)), J = `${wt}${_._unit}`) : vt === E.COLOR ? J = Js(_, bt, $t) : vt === E.COMPLEX && (J = Gs(_, bt, $t)), Tt && (_._number = wt), !n && gt !== Q.blend) {
            const lt = _.property;
            P = _.target, Et ? P[lt] = J : pt === W.ATTRIBUTE ? P.setAttribute(
              lt,
              /** @type {String} */
              J
            ) : (Z = /** @type {DOMTarget} */
            P.style, pt === W.TRANSFORM ? (P !== K && (K = P, xt = P[ue]), xt[lt] = J, zt = 1) : pt === W.CSS ? Z[lt] = J : pt === W.CSS_VAR && Z.setProperty(
              lt,
              /** @type {String} */
              J
            )), w && (A = 1);
          } else
            _._value = J;
        }
        zt && _._renderTransforms && (Z.transform = Zs(xt), zt = 0), _ = _._next;
      }
      !s && A && e.onRender(
        /** @type {JSAnimation} */
        e
      );
    }
    !s && w && e.onUpdate(
      /** @type {CallbackArgument} */
      e
    );
  }
  return r && j ? !s && // (tickableAbsoluteTime > 0 instead) of (tickableAbsoluteTime >= duration) to prevent floating point precision issues
  // see: https://github.com/juliangarnier/anime/issues/1088
  (r.began && !V && x > 0 && !c || V && x <= O && c) && (e.onComplete(
    /** @type {CallbackArgument} */
    e
  ), e.completed = !V) : w && Y ? a === 1 / 0 ? e._startTime += e.duration : e._currentIteration >= a - 1 && (e.paused = !0, !c && !p && (e.completed = !0, !s && !(r && (V || !r.began)) && (e.onComplete(
    /** @type {CallbackArgument} */
    e
  ), e._resolve(
    /** @type {CallbackArgument} */
    e
  )))) : e.completed = !1, A;
}, Jt = (e, t, s, n, i) => {
  const r = e._currentIteration;
  if (Te(e, t, s, n, i), e._hasChildren) {
    const o = (
      /** @type {Timeline} */
      e
    ), c = o.backwards, l = n ? t : o._iterationTime, a = ne();
    let u = 0, d = !0;
    if (!n && o._currentIteration !== r) {
      const f = o.iterationDuration;
      z(o, (h) => {
        if (!c)
          !h.completed && !h.backwards && h._currentTime < h.iterationDuration && Te(h, f, s, 1, _t.FORCE), h.began = !1, h.completed = !1;
        else {
          const p = h.duration, m = h._offset + h._delay, y = m + p;
          !s && p <= O && (!m || y === f) && h.onComplete(h);
        }
      }), s || o.onLoop(
        /** @type {CallbackArgument} */
        o
      );
    }
    z(o, (f) => {
      const h = L((l - f._offset) * f._speed, 12), p = f._fps < o._fps ? f.requestTick(a) : i;
      u += Te(f, h, s, n, p), !f.completed && d && (d = !1);
    }, c), !s && u && o.onRender(
      /** @type {CallbackArgument} */
      o
    ), (d || c) && o._currentTime >= o.duration && (o.paused = !0, o.completed || (o.completed = !0, s || (o.onComplete(
      /** @type {CallbackArgument} */
      o
    ), o._resolve(
      /** @type {CallbackArgument} */
      o
    ))));
  }
};
const ws = {}, js = (e, t, s) => {
  if (s === W.TRANSFORM) {
    const n = Je.get(e);
    return n || e;
  } else if (s === W.CSS || // Handle special cases where properties like "strokeDashoffset" needs to be set as "stroke-dashoffset"
  // but properties like "baseFrequency" should stay in lowerCamelCase
  s === W.ATTRIBUTE && Xs(t) && e in /** @type {DOMTarget} */
  t.style) {
    const n = ws[e];
    if (n)
      return n;
    {
      const i = e && Ce(e);
      return ws[e] = i, i;
    }
  } else
    return e;
}, tn = (e, t = !1) => {
  if (e._hasChildren)
    z(e, (s) => tn(s, t), !0);
  else {
    const s = (
      /** @type {JSAnimation} */
      e
    );
    s.pause(), z(s, (n) => {
      const i = n.property, r = n.target, o = n._tweenType, c = n._inlineValue, l = jt(c) || c === Nt;
      if (o === W.OBJECT)
        !t && !l && (r[i] = c);
      else if (r[se])
        if (o === W.ATTRIBUTE)
          t || (l ? r.removeAttribute(i) : r.setAttribute(
            i,
            /** @type {String} */
            c
          ));
        else {
          const a = (
            /** @type {DOMTarget} */
            r.style
          );
          if (o === W.TRANSFORM) {
            const u = r[ue];
            l ? delete u[i] : u[i] = c, n._renderTransforms && (Object.keys(u).length ? a.transform = Zs(u) : a.removeProperty("transform"));
          } else
            l ? a.removeProperty(Ce(i)) : a[i] = c;
        }
      r[se] && s._tail === n && s.targets.forEach((a) => {
        a.getAttribute && a.getAttribute("style") === Nt && a.removeAttribute("style");
      });
    });
  }
  return e;
};
class en {
  /** @param {Number} [initTime] */
  constructor(t = 0) {
    this.deltaTime = 0, this._currentTime = t, this._lastTickTime = t, this._startTime = t, this._lastTime = t, this._scheduledTime = 0, this._frameDuration = Bt / Ue, this._fps = Ue, this._speed = 1, this._hasChildren = !1, this._head = null, this._tail = null;
  }
  get fps() {
    return this._fps;
  }
  set fps(t) {
    const s = this._frameDuration, n = +t, i = n < O ? O : n, r = Bt / i;
    i > Se.frameRate && (Se.frameRate = i), this._fps = i, this._frameDuration = r, this._scheduledTime += r - s;
  }
  get speed() {
    return this._speed;
  }
  set speed(t) {
    const s = +t;
    this._speed = s < O ? O : s;
  }
  /**
   * @param  {Number} time
   * @return {tickModes}
   */
  requestTick(t) {
    const s = this._scheduledTime;
    if (this._lastTickTime = t, t < s) return _t.NONE;
    const n = this._frameDuration, i = t - s;
    return this._scheduledTime += i < n ? n : i, _t.AUTO;
  }
  /**
   * @param  {Number} time
   * @return {Number}
   */
  computeDeltaTime(t) {
    const s = t - this._lastTime;
    return this.deltaTime = s, this._lastTime = t, s;
  }
}
const ee = {
  animation: null,
  update: I
}, Un = (e) => {
  let t = ee.animation;
  return t || (t = {
    duration: O,
    computeDeltaTime: I,
    _offset: 0,
    _delay: 0,
    _head: null,
    _tail: null
  }, ee.animation = t, ee.update = () => {
    e.forEach((s) => {
      for (let n in s) {
        const i = s[n], r = i._head;
        if (r) {
          const o = r._valueType, c = o === E.COMPLEX || o === E.COLOR ? st(r._fromNumbers) : null;
          let l = r._fromNumber, a = i._tail;
          for (; a && a !== r; ) {
            if (c)
              for (let u = 0, d = a._numbers.length; u < d; u++) c[u] += a._numbers[u];
            else
              l += a._number;
            a = a._prevAdd;
          }
          r._toNumber = l, r._toNumbers = c;
        }
      }
    }), Te(t, 1, 1, 0, _t.FORCE);
  }), t;
};
const sn = Pt ? requestAnimationFrame : setImmediate, Wn = Pt ? cancelAnimationFrame : clearImmediate;
class zn extends en {
  /** @param {Number} [initTime] */
  constructor(t) {
    super(t), this.useDefaultMainLoop = !0, this.pauseOnDocumentHidden = !0, this.defaults = Se, this.paused = !0, this.reqId = 0;
  }
  update() {
    const t = this._currentTime = ne();
    if (this.requestTick(t)) {
      this.computeDeltaTime(t);
      const s = this._speed, n = this._fps;
      let i = (
        /** @type {Tickable} */
        this._head
      );
      for (; i; ) {
        const r = i._next;
        i.paused ? (Ut(this, i), this._hasChildren = !!this._tail, i._running = !1, i.completed && !i._cancelled && i.cancel()) : Jt(
          i,
          (t - i._startTime) * i._speed * s,
          0,
          // !muteCallbacks
          0,
          // !internalRender
          i._fps < n ? i.requestTick(t) : _t.AUTO
        ), i = r;
      }
      ee.update();
    }
  }
  wake() {
    return this.useDefaultMainLoop && !this.reqId && (this.requestTick(ne()), this.reqId = sn(nn)), this;
  }
  pause() {
    if (this.reqId)
      return this.paused = !0, Xn();
  }
  resume() {
    if (this.paused)
      return this.paused = !1, z(this, (t) => t.resetTime()), this.wake();
  }
  // Getter and setter for speed
  get speed() {
    return this._speed * (F.timeScale === 1 ? 1 : Bt);
  }
  set speed(t) {
    this._speed = t * F.timeScale, z(this, (s) => s.speed = s._speed);
  }
  // Getter and setter for timeUnit
  get timeUnit() {
    return F.timeScale === 1 ? "ms" : "s";
  }
  set timeUnit(t) {
    const n = t === "s", i = n ? 1e-3 : 1;
    if (F.timeScale !== i) {
      F.timeScale = i, F.tickThreshold = 200 * i;
      const r = n ? 1e-3 : Bt;
      this.defaults.duration *= r, this._speed *= r;
    }
  }
  // Getter and setter for precision
  get precision() {
    return F.precision;
  }
  set precision(t) {
    F.precision = t;
  }
}
const nt = /* @__PURE__ */ (() => {
  const e = new zn(ne());
  return Pt && (zs.engine = e, G.addEventListener("visibilitychange", () => {
    e.pauseOnDocumentHidden && (G.hidden ? e.pause() : e.resume());
  })), e;
})(), nn = () => {
  nt._head ? (nt.reqId = sn(nn), nt.update()) : nt.reqId = 0;
}, Xn = () => (Wn(
  /** @type {NodeJS.Immediate & Number} */
  nt.reqId
), nt.reqId = 0, nt);
const Ee = {
  /** @type {TweenReplaceLookups} */
  _rep: /* @__PURE__ */ new WeakMap(),
  /** @type {TweenAdditiveLookups} */
  _add: /* @__PURE__ */ new Map()
}, ss = (e, t, s = "_rep") => {
  const n = Ee[s];
  let i = n.get(e);
  return i || (i = {}, n.set(e, i)), i[t] ? i[t] : i[t] = {
    _head: null,
    _tail: null
  };
}, Hn = (e, t) => e._isOverridden || e._absoluteStartTime > t._absoluteStartTime, be = (e) => {
  e._isOverlapped = 1, e._isOverridden = 1, e._changeDuration = O, e._currentTime = O;
}, rn = (e, t) => {
  const s = e._composition;
  if (s === Q.replace) {
    const n = e._absoluteStartTime;
    Lt(t, e, Hn, "_prevRep", "_nextRep");
    const i = e._prevRep;
    if (i) {
      const r = i.parent, o = i._absoluteStartTime + i._changeDuration;
      if (
        // Check if the previous tween is from a different animation
        e.parent.id !== r.id && // Check if the animation has loops
        r.iterationCount > 1 && // Check if _absoluteChangeEndTime of last loop overlaps the current tween
        o + (r.duration - r.iterationDuration) > n
      ) {
        be(i);
        let a = i._prevRep;
        for (; a && a.parent.id === r.id; )
          be(a), a = a._prevRep;
      }
      const c = n - e._delay;
      if (o > c) {
        const a = i._startTime, u = o - (a + i._updateDuration), d = L(c - u - a, 12);
        i._changeDuration = d, i._currentTime = d, i._isOverlapped = 1, d < O && be(i);
      }
      let l = !0;
      if (z(r, (a) => {
        a._isOverlapped || (l = !1);
      }), l) {
        const a = r.parent;
        if (a) {
          let u = !0;
          z(a, (d) => {
            d !== r && z(d, (f) => {
              f._isOverlapped || (u = !1);
            });
          }), u && a.cancel();
        } else
          r.cancel();
      }
    }
  } else if (s === Q.blend) {
    const n = ss(e.target, e.property, "_add"), i = Un(Ee._add);
    let r = n._head;
    r || (r = { ...e }, r._composition = Q.replace, r._updateDuration = O, r._startTime = 0, r._numbers = st(e._fromNumbers), r._number = 0, r._next = null, r._prev = null, Lt(n, r), Lt(i, r));
    const o = e._toNumber;
    if (e._fromNumber = r._fromNumber - o, e._toNumber = 0, e._numbers = st(e._fromNumbers), e._number = 0, r._fromNumber = o, e._toNumbers) {
      const c = st(e._toNumbers);
      c && c.forEach((l, a) => {
        e._fromNumbers[a] = r._fromNumbers[a] - l, e._toNumbers[a] = 0;
      }), r._fromNumbers = c;
    }
    Lt(n, e, null, "_prevAdd", "_nextAdd");
  }
  return e;
}, Yn = (e) => {
  const t = e._composition;
  if (t !== Q.none) {
    const s = e.target, n = e.property, o = Ee._rep.get(s)[n];
    if (Ut(o, e, "_prevRep", "_nextRep"), t === Q.blend) {
      const c = Ee._add, l = c.get(s);
      if (!l) return;
      const a = l[n], u = ee.animation;
      Ut(a, e, "_prevAdd", "_nextAdd");
      const d = a._head;
      if (d && d === a._tail) {
        Ut(a, d, "_prevAdd", "_nextAdd"), Ut(u, d);
        let f = !0;
        for (let h in l)
          if (l[h]._head) {
            f = !1;
            break;
          }
        f && c.delete(s);
      }
    }
  }
  return e;
};
const Rs = (e) => (e.paused = !0, e.began = !1, e.completed = !1, e), He = (e) => (e._cancelled && (e._hasChildren ? z(e, He) : z(e, (t) => {
  t._composition !== Q.none && rn(t, ss(t.target, t.property));
}), e._cancelled = 0), e);
let As = 0;
const qn = (e, t) => e._priority > t._priority;
class Gt extends en {
  /**
   * @param {TimerParams} [parameters]
   * @param {Timeline} [parent]
   * @param {Number} [parentPosition]
   */
  constructor(t = {}, s = null, n = 0) {
    super(0), ++As;
    const {
      id: i,
      delay: r,
      duration: o,
      reversed: c,
      alternate: l,
      loop: a,
      loopDelay: u,
      autoplay: d,
      frameRate: f,
      playbackRate: h,
      priority: p,
      onComplete: m,
      onLoop: y,
      onPause: b,
      onBegin: x,
      onBeforeUpdate: $,
      onUpdate: N
    } = t, X = s ? 0 : nt._lastTickTime, w = s ? s.defaults : F.defaults, Y = (
      /** @type {Number} */
      Ft(r) || C(r) ? w.delay : +r
    ), j = Ft(o) || C(o) ? 1 / 0 : +o, tt = R(a, w.loop), M = R(u, w.loopDelay);
    let S = tt === !0 || tt === 1 / 0 || /** @type {Number} */
    tt < 0 ? 1 / 0 : (
      /** @type {Number} */
      tt + 1
    ), A = 0;
    s ? A = n : (nt.reqId || nt.requestTick(ne()), A = (nt._lastTickTime - nt._startTime) * F.timeScale), this.id = C(i) ? As : i, this.parent = s, this.duration = Ke((j + M) * S - M) || O, this.backwards = !1, this.paused = !0, this.began = !1, this.completed = !1, this.onBegin = x || w.onBegin, this.onBeforeUpdate = $ || w.onBeforeUpdate, this.onUpdate = N || w.onUpdate, this.onLoop = y || w.onLoop, this.onPause = b || w.onPause, this.onComplete = m || w.onComplete, this.iterationDuration = j, this.iterationCount = S, this._autoplay = s ? !1 : R(d, w.autoplay), this._offset = A, this._delay = Y, this._loopDelay = M, this._iterationTime = 0, this._currentIteration = 0, this._resolve = I, this._running = !1, this._reversed = +R(c, w.reversed), this._reverse = this._reversed, this._cancelled = 0, this._alternate = R(l, w.alternate), this._prev = null, this._next = null, this._lastTickTime = X, this._startTime = X, this._lastTime = X, this._fps = R(f, w.frameRate), this._speed = R(h, w.playbackRate), this._priority = +R(p, 1);
  }
  get cancelled() {
    return !!this._cancelled;
  }
  set cancelled(t) {
    t ? this.cancel() : this.reset(!0).play();
  }
  get currentTime() {
    return it(L(this._currentTime, F.precision), -this._delay, this.duration);
  }
  set currentTime(t) {
    const s = this.paused;
    this.pause().seek(+t), s || this.resume();
  }
  get iterationCurrentTime() {
    return it(L(this._iterationTime, F.precision), 0, this.iterationDuration);
  }
  set iterationCurrentTime(t) {
    this.currentTime = this.iterationDuration * this._currentIteration + t;
  }
  get progress() {
    return it(L(this._currentTime / this.duration, 10), 0, 1);
  }
  set progress(t) {
    this.currentTime = this.duration * t;
  }
  get iterationProgress() {
    return it(L(this._iterationTime / this.iterationDuration, 10), 0, 1);
  }
  set iterationProgress(t) {
    const s = this.iterationDuration;
    this.currentTime = s * this._currentIteration + s * t;
  }
  get currentIteration() {
    return this._currentIteration;
  }
  set currentIteration(t) {
    this.currentTime = this.iterationDuration * it(+t, 0, this.iterationCount - 1);
  }
  get reversed() {
    return !!this._reversed;
  }
  set reversed(t) {
    t ? this.reverse() : this.play();
  }
  get speed() {
    return super.speed;
  }
  set speed(t) {
    super.speed = t, this.resetTime();
  }
  /**
   * @param  {Boolean} [softReset]
   * @return {this}
   */
  reset(t = !1) {
    return He(this), this._reversed && !this._reverse && (this.reversed = !1), this._iterationTime = this.iterationDuration, Jt(this, 0, 1, ~~t, _t.FORCE), Rs(this), this._hasChildren && z(this, Rs), this;
  }
  /**
   * @param  {Boolean} internalRender
   * @return {this}
   */
  init(t = !1) {
    this.fps = this._fps, this.speed = this._speed, !t && this._hasChildren && Jt(this, this.duration, 1, ~~t, _t.FORCE), this.reset(t);
    const s = this._autoplay;
    return s === !0 ? this.resume() : s && !C(
      /** @type {ScrollObserver} */
      s.linked
    ) && s.link(this), this;
  }
  /** @return {this} */
  resetTime() {
    const t = 1 / (this._speed * nt._speed);
    return this._startTime = ne() - (this._currentTime + this._delay) * t, this;
  }
  /** @return {this} */
  pause() {
    return this.paused ? this : (this.paused = !0, this.onPause(this), this);
  }
  /** @return {this} */
  resume() {
    return this.paused ? (this.paused = !1, this.duration <= O && !this._hasChildren ? Jt(this, O, 0, 0, _t.FORCE) : (this._running || (Lt(nt, this, qn), nt._hasChildren = !0, this._running = !0), this.resetTime(), this._startTime -= 12, nt.wake()), this) : this;
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
  seek(t, s = 0, n = 0) {
    He(this), this.completed = !1;
    const i = this.paused;
    return this.paused = !0, Jt(this, t + this._delay, ~~s, ~~n, _t.AUTO), i ? this : this.resume();
  }
  /** @return {this} */
  alternate() {
    const t = this._reversed, s = this.iterationCount, n = this.iterationDuration, i = s === 1 / 0 ? An(Ve / n) : s;
    return this._reversed = +(this._alternate && !(i % 2) ? t : !t), s === 1 / 0 ? this.iterationProgress = this._reversed ? 1 - this.iterationProgress : this.iterationProgress : this.seek(n * i - this._currentTime), this.resetTime(), this;
  }
  /** @return {this} */
  play() {
    return this._reversed && this.alternate(), this.resume();
  }
  /** @return {this} */
  reverse() {
    return this._reversed || this.alternate(), this.resume();
  }
  // TODO: Move all the animation / tweens / children related code to Animation / Timeline
  /** @return {this} */
  cancel() {
    return this._hasChildren ? z(this, (t) => t.cancel(), !0) : z(this, Yn), this._cancelled = 1, this.pause();
  }
  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(t) {
    const s = this.duration, n = le(t);
    if (s === n) return this;
    const i = t / s, r = t <= O;
    return this.duration = r ? O : n, this.iterationDuration = r ? O : le(this.iterationDuration * i), this._offset *= i, this._delay *= i, this._loopDelay *= i, this;
  }
  /**
    * Cancels the timer by seeking it back to 0 and reverting the attached scroller if necessary
    * @return {this}
    */
  revert() {
    Jt(this, 0, 1, 0, _t.AUTO);
    const t = (
      /** @type {ScrollObserver} */
      this._autoplay
    );
    return t && t.linked && t.linked === this && t.revert(), this.cancel();
  }
  /**
    * Imediatly completes the timer, cancels it and triggers the onComplete callback
    * @param  {Boolean|Number} [muteCallbacks]
    * @return {this}
    */
  complete(t = 0) {
    return this.seek(this.duration, t).cancel();
  }
  /**
   * @typedef {this & {then: null}} ResolvedTimer
   */
  /**
   * @param  {Callback<ResolvedTimer>} [callback]
   * @return Promise<this>
   */
  then(t = I) {
    const s = this.then, n = () => {
      this.then = null, t(
        /** @type {ResolvedTimer} */
        this
      ), this.then = s, this._resolve = I;
    };
    return new Promise((i) => (this._resolve = () => i(n()), this.completed && this._resolve(), this));
  }
}
const g = es(), v = es(), Ht = {}, fe = { func: null }, Me = { func: null }, pe = [null], Yt = [null, null], me = { to: null };
let Zn = 0, Ns = 0, Dt, Rt;
const Jn = (e, t) => {
  const s = {};
  if (Mt(e)) {
    const n = [].concat(.../** @type {DurationKeyframes} */
    e.map((i) => Object.keys(i))).filter(ae);
    for (let i = 0, r = n.length; i < r; i++) {
      const o = n[i], c = (
        /** @type {DurationKeyframes} */
        e.map((l) => {
          const a = {};
          for (let u in l) {
            const d = (
              /** @type {TweenPropValue} */
              l[u]
            );
            ae(u) ? u === o && (a.to = d) : a[u] = d;
          }
          return a;
        })
      );
      s[o] = /** @type {ArraySyntaxValue} */
      c;
    }
  } else {
    const n = (
      /** @type {Number} */
      R(t.duration, F.defaults.duration)
    );
    Object.keys(e).map((r) => ({ o: parseFloat(r) / 100, p: e[r] })).sort((r, o) => r.o - o.o).forEach((r) => {
      const o = r.o, c = r.p;
      for (let l in c)
        if (ae(l)) {
          let a = (
            /** @type {Array} */
            s[l]
          );
          a || (a = s[l] = []);
          const u = o * n;
          let d = a.length, f = a[d - 1];
          const h = { to: c[l] };
          let p = 0;
          for (let m = 0; m < d; m++)
            p += a[m].duration;
          d === 1 && (h.from = f.to), c.ease && (h.ease = c.ease), h.duration = u - (d ? p : 0), a.push(h);
        }
      return r;
    });
    for (let r in s) {
      const o = (
        /** @type {Array} */
        s[r]
      );
      let c;
      for (let l = 0, a = o.length; l < a; l++) {
        const u = o[l], d = u.ease;
        u.ease = c || void 0, c = d;
      }
      o[0].duration || o.shift();
    }
  }
  return s;
};
class Gn extends Gt {
  /**
   * @param {TargetsParam} targets
   * @param {AnimationParams} parameters
   * @param {Timeline} [parent]
   * @param {Number} [parentPosition]
   * @param {Boolean} [fastSet=false]
   * @param {Number} [index=0]
   * @param {TargetsArray} [allTargets]
   */
  constructor(t, s, n, i, r = !1, o = 0, c) {
    super(
      /** @type {TimerParams & AnimationParams} */
      s,
      n,
      i
    ), ++Ns;
    const l = je(t), a = l.length, u = (
      /** @type {AnimationParams} */
      s.keyframes
    ), d = (
      /** @type {AnimationParams} */
      u ? Fn(Jn(
        /** @type {DurationKeyframes} */
        u,
        s
      ), s) : s
    ), {
      id: f,
      delay: h,
      duration: p,
      ease: m,
      playbackEase: y,
      modifier: b,
      composition: x,
      onRender: $
    } = d, N = n ? n.defaults : F.defaults, X = R(m, N.ease), w = R(y, N.playbackEase), Y = w ? ze(w) : null, j = !C(
      /** @type {Spring} */
      X.ease
    ), tt = j ? (
      /** @type {Spring} */
      X.ease
    ) : R(m, Y ? "linear" : N.ease), M = j ? (
      /** @type {Spring} */
      X.settlingDuration
    ) : R(p, N.duration), S = R(h, N.delay), A = b || N.modifier, H = C(x) && a >= Bt ? Q.none : C(x) ? N.composition : x, T = this._offset + (n ? n._offset : 0);
    j && (X.parent = this);
    let k = NaN, V = NaN, B = 0, U = 0;
    for (let _ = 0; _ < a; _++) {
      const P = l[_], Z = o || _, K = c || l;
      let xt = NaN, zt = NaN;
      for (let gt in d)
        if (ae(gt)) {
          const ot = ts(P, gt), at = js(gt, P, ot);
          let ut = d[gt];
          const It = Mt(ut);
          if (r && !It && (Yt[0] = ut, Yt[1] = ut, ut = Yt), It) {
            const vt = (
              /** @type {Array} */
              ut.length
            ), pt = !Qt(ut[0]);
            vt === 2 && pt ? (me.to = /** @type {TweenParamValue} */
            /** @type {unknown} */
            ut, pe[0] = me, Dt = pe) : vt > 2 && pt ? (Dt = [], ut.forEach((Et, Ct) => {
              Ct ? Ct === 1 ? (Yt[1] = Et, Dt.push(Yt)) : Dt.push(Et) : Yt[0] = Et;
            })) : Dt = /** @type {Array.<TweenKeyValue>} */
            ut;
          } else
            pe[0] = ut, Dt = pe;
          let yt = null, Tt = null, Xt = NaN, bt = 0, kt = 0;
          for (let vt = Dt.length; kt < vt; kt++) {
            const pt = Dt[kt];
            Qt(pt) ? Rt = pt : (me.to = /** @type {TweenParamValue} */
            pt, Rt = me), fe.func = null, Me.func = null;
            const Et = rt(R(Rt.composition, H), P, Z, K, null, null), Ct = Vt(Et) ? Et : Q[Et];
            !yt && Ct !== Q.none && (yt = ss(P, at));
            const $t = yt ? yt._tail : null, J = n && $t && $t.parent.parent === n ? $t : Tt, wt = rt(Rt.to, P, Z, K, fe, J);
            let lt;
            Qt(wt) && !C(wt.to) ? (Rt = wt, lt = wt.to) : lt = wt;
            const we = rt(Rt.from, P, Z, K, null, J), os = Rt.ease || tt, Re = rt(os, P, Z, K, null, J), ie = Ft(Re) || ft(Re) ? Re : os, as = !C(ie) && !C(
              /** @type {Spring} */
              ie.ease
            ), on = as ? (
              /** @type {Spring} */
              ie.ease
            ) : ie, an = as ? (
              /** @type {Spring} */
              ie.settlingDuration
            ) : rt(R(Rt.duration, vt > 1 ? rt(M, P, Z, K, null, J) / vt : M), P, Z, K, null, J), Ae = rt(R(Rt.delay, kt ? 0 : S), P, Z, K, null, J), Ne = Rt.modifier || A, Fe = !C(we), ls = !C(lt), he = Mt(lt), ln = he || Fe && ls, Pe = Tt ? bt + Ae : Ae, Ie = L(T + Pe, 12);
            !U && (Fe || he) && (U = 1);
            let mt = Tt;
            if (Ct !== Q.none) {
              let D = yt._head;
              for (; D && !D._isOverridden && D._absoluteStartTime <= Ie; )
                if (mt = D, D = D._nextRep, D && D._absoluteStartTime >= Ie)
                  for (; D; )
                    be(D), D = D._nextRep;
            }
            if (ln) {
              ht(he ? rt(lt[0], P, Z, K, Me, J) : we, g), ht(he ? rt(lt[1], P, Z, K, fe, J) : lt, v);
              const D = Zt(P, at, ot, Ht);
              g.t === E.NUMBER && (mt ? mt._valueType === E.UNIT && (g.t = E.UNIT, g.u = mt._unit) : (ht(
                D,
                dt
              ), dt.t === E.UNIT && (g.t = E.UNIT, g.u = dt.u)));
            } else
              ls ? ht(lt, v) : Tt ? _s(Tt, v) : ht(n && mt && mt.parent.parent === n ? mt._value : Zt(P, at, ot, Ht), v), Fe ? ht(we, g) : Tt ? _s(Tt, g) : ht(n && mt && mt.parent.parent === n ? mt._value : (
                // No need to get and parse the original value if the tween is part of a timeline and has a previous sibling part of the same timeline
                Zt(P, at, ot, Ht)
              ), g);
            if (g.o && (g.n = te(
              mt ? mt._toNumber : ht(
                Zt(P, at, ot, Ht),
                dt
              ).n,
              g.n,
              g.o
            )), v.o && (v.n = te(g.n, v.n, v.o)), g.t !== v.t) {
              if (g.t === E.COMPLEX || v.t === E.COMPLEX) {
                const D = g.t === E.COMPLEX ? g : v, et = g.t === E.COMPLEX ? v : g;
                et.t = E.COMPLEX, et.s = st(D.s), et.d = D.d.map(() => et.n);
              } else if (g.t === E.UNIT || v.t === E.UNIT) {
                const D = g.t === E.UNIT ? g : v, et = g.t === E.UNIT ? v : g;
                et.t = E.UNIT, et.u = D.u;
              } else if (g.t === E.COLOR || v.t === E.COLOR) {
                const D = g.t === E.COLOR ? g : v, et = g.t === E.COLOR ? v : g;
                et.t = E.COLOR, et.s = D.s, et.d = [0, 0, 0, 1];
              }
            }
            if (g.u !== v.u) {
              let D = v.u ? g : v;
              D = xe(
                /** @type {DOMTarget} */
                P,
                D,
                v.u ? v.u : g.u,
                !1
              );
            }
            if (v.d && g.d && v.d.length !== g.d.length) {
              const D = g.d.length > v.d.length ? g : v, et = D === g ? v : g;
              et.d = D.d.map((xi, us) => C(et.d[us]) ? 0 : et.d[us]), et.s = st(D.s);
            }
            const ke = L(+an || O, 12);
            let cs = Ht[at];
            jt(cs) || (Ht[at] = null);
            const ct = {
              parent: this,
              id: Zn++,
              property: at,
              target: P,
              _value: null,
              _toFunc: fe.func,
              _fromFunc: Me.func,
              _ease: ze(on),
              _fromNumbers: st(g.d),
              _toNumbers: st(v.d),
              _strings: st(v.s),
              _fromNumber: g.n,
              _toNumber: v.n,
              _numbers: st(g.d),
              // For additive tween and animatables
              _number: g.n,
              // For additive tween and animatables
              _unit: v.u,
              _modifier: Ne,
              _currentTime: 0,
              _startTime: Pe,
              _delay: +Ae,
              _updateDuration: ke,
              _changeDuration: ke,
              _absoluteStartTime: Ie,
              // NOTE: Investigate bit packing to stores ENUM / BOOL
              _tweenType: ot,
              _valueType: v.t,
              _composition: Ct,
              _isOverlapped: 0,
              _isOverridden: 0,
              _renderTransforms: 0,
              _inlineValue: cs,
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
            Ct !== Q.none && rn(ct, yt);
            const $e = ct._valueType;
            $e === E.COMPLEX ? ct._value = Gs(ct, 1, -1) : $e === E.COLOR ? ct._value = Js(ct, 1, -1) : $e === E.UNIT ? ct._value = `${Ne(ct._toNumber)}${ct._unit}` : ct._value = Ne(ct._toNumber), isNaN(Xt) && (Xt = ct._startTime), bt = L(Pe + ke, 12), Tt = ct, B++, Lt(this, ct);
          }
          (isNaN(V) || Xt < V) && (V = Xt), (isNaN(k) || bt > k) && (k = bt), ot === W.TRANSFORM && (xt = B - kt, zt = B);
        }
      if (!isNaN(xt)) {
        let gt = 0;
        z(this, (ot) => {
          gt >= xt && gt < zt && (ot._renderTransforms = 1, ot._composition === Q.blend && z(ee.animation, (at) => {
            at.id === ot.id && (at._renderTransforms = 1);
          })), gt++;
        });
      }
    }
    a || console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation."), V ? (z(this, (_) => {
      _._startTime - _._delay || (_._delay -= V), _._startTime -= V;
    }), k -= V) : V = 0, k || (k = O, this.iterationCount = 0), this.targets = l, this.id = C(f) ? Ns : f, this.duration = k === O ? O : Ke((k + this._loopDelay) * this.iterationCount - this._loopDelay) || O, this.onRender = $ || N.onRender, this._ease = Y, this._delay = V, this.iterationDuration = k, !this._autoplay && U && this.onRender(this);
  }
  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(t) {
    const s = this.duration;
    if (s === le(t)) return this;
    const n = t / s;
    return z(this, (i) => {
      i._updateDuration = le(i._updateDuration * n), i._changeDuration = le(i._changeDuration * n), i._currentTime *= n, i._startTime *= n, i._absoluteStartTime *= n;
    }), super.stretch(t);
  }
  /**
   * @return {this}
   */
  refresh() {
    return z(this, (t) => {
      const s = t._toFunc, n = t._fromFunc;
      (s || n) && (n ? (ht(n(), g), g.u !== t._unit && t.target[se] && xe(
        /** @type {DOMTarget} */
        t.target,
        g,
        t._unit,
        !0
      ), t._fromNumbers = st(g.d), t._fromNumber = g.n) : s && (ht(Zt(t.target, t.property, t._tweenType), dt), t._fromNumbers = st(dt.d), t._fromNumber = dt.n), s && (ht(s(), v), t._toNumbers = st(v.d), t._strings = st(v.s), t._toNumber = v.o ? te(t._fromNumber, v.n, v.o) : v.n));
    }), this.duration === O && this.restart(), this;
  }
  /**
   * Cancel the animation and revert all the values affected by this animation to their original state
   * @return {this}
   */
  revert() {
    return super.revert(), tn(this);
  }
  /**
   * @typedef {this & {then: null}} ResolvedJSAnimation
   */
  /**
   * @param  {Callback<ResolvedJSAnimation>} [callback]
   * @return Promise<this>
   */
  then(t) {
    return super.then(t);
  }
}
function Fs(e, t, s) {
  const n = je(e);
  if (!n.length) return;
  const [i] = n, r = ts(i, t), o = js(t, i, r);
  let c = Zt(i, o);
  if (C(s))
    return c;
  if (ht(c, dt), dt.t === E.NUMBER || dt.t === E.UNIT) {
    const l = xe(
      /** @type {DOMTarget} */
      i,
      dt,
      /** @type {String} */
      s,
      !1
    );
    return `${L(l.n, F.precision)}${l.u}`;
  }
}
const Ps = (e, t) => {
  if (!C(t))
    return t.duration = O, t.composition = R(t.composition, Q.none), new Gn(e, t, null, 0, !0).resume();
};
const Kn = (e = I) => new Gt({ duration: 1 * F.timeScale, onComplete: e }, null, 0).resume();
const Qn = () => {
  const e = G.createElement("div");
  G.body.appendChild(e), e.style.height = "100lvh";
  const t = e.offsetHeight;
  return G.body.removeChild(e), t;
}, _e = (e, t) => e && Ft(e) ? (
  /** @type {Function} */
  e(t)
) : (
  /** @type {T} */
  e
), Ye = /* @__PURE__ */ new Map();
class jn {
  /**
   * @param {HTMLElement} $el
   */
  constructor(t) {
    this.element = t, this.useWin = this.element === G.body, this.winWidth = 0, this.winHeight = 0, this.width = 0, this.height = 0, this.left = 0, this.top = 0, this.scale = 1, this.zIndex = 0, this.scrollX = 0, this.scrollY = 0, this.prevScrollX = 0, this.prevScrollY = 0, this.scrollWidth = 0, this.scrollHeight = 0, this.velocity = 0, this.backwardX = !1, this.backwardY = !1, this.scrollTicker = new Gt({
      autoplay: !1,
      onBegin: () => this.dataTimer.resume(),
      onUpdate: () => {
        const s = this.backwardX || this.backwardY;
        z(this, (n) => n.handleScroll(), s);
      },
      onComplete: () => this.dataTimer.pause()
    }).init(), this.dataTimer = new Gt({
      autoplay: !1,
      frameRate: 30,
      onUpdate: (s) => {
        const n = s.deltaTime, i = this.prevScrollX, r = this.prevScrollY, o = this.scrollX, c = this.scrollY, l = i - o, a = r - c;
        this.prevScrollX = o, this.prevScrollY = c, l && (this.backwardX = i > o), a && (this.backwardY = r > c), this.velocity = L(n > 0 ? Math.sqrt(l * l + a * a) / n : 0, 5);
      }
    }).init(), this.resizeTicker = new Gt({
      autoplay: !1,
      duration: 250 * F.timeScale,
      onComplete: () => {
        this.updateWindowBounds(), this.refreshScrollObservers(), this.handleScroll();
      }
    }).init(), this.wakeTicker = new Gt({
      autoplay: !1,
      duration: 500 * F.timeScale,
      onBegin: () => {
        this.scrollTicker.resume();
      },
      onComplete: () => {
        this.scrollTicker.pause();
      }
    }).init(), this._head = null, this._tail = null, this.updateScrollCoords(), this.updateWindowBounds(), this.updateBounds(), this.refreshScrollObservers(), this.handleScroll(), this.resizeObserver = new ResizeObserver(() => this.resizeTicker.restart()), this.resizeObserver.observe(this.element), (this.useWin ? Ot : this.element).addEventListener("scroll", this, !1);
  }
  updateScrollCoords() {
    const t = this.useWin, s = this.element;
    this.scrollX = L(t ? Ot.scrollX : s.scrollLeft, 0), this.scrollY = L(t ? Ot.scrollY : s.scrollTop, 0);
  }
  updateWindowBounds() {
    this.winWidth = Ot.innerWidth, this.winHeight = Qn();
  }
  updateBounds() {
    const t = getComputedStyle(this.element), s = this.element;
    this.scrollWidth = s.scrollWidth + parseFloat(t.marginLeft) + parseFloat(t.marginRight), this.scrollHeight = s.scrollHeight + parseFloat(t.marginTop) + parseFloat(t.marginBottom), this.updateWindowBounds();
    let n, i;
    if (this.useWin)
      n = this.winWidth, i = this.winHeight;
    else {
      const r = s.getBoundingClientRect();
      n = s.clientWidth, i = s.clientHeight, this.top = r.top, this.left = r.left, this.scale = r.width ? n / r.width : r.height ? i / r.height : 1;
    }
    this.width = n, this.height = i;
  }
  refreshScrollObservers() {
    z(this, (t) => {
      t._debug && t.removeDebug();
    }), this.updateBounds(), z(this, (t) => {
      t.refresh(), t.onResize(t), t._debug && t.debug();
    });
  }
  refresh() {
    this.updateWindowBounds(), this.updateBounds(), this.refreshScrollObservers(), this.handleScroll();
  }
  handleScroll() {
    this.updateScrollCoords(), this.wakeTicker.restart();
  }
  /**
   * @param {Event} e
   */
  handleEvent(t) {
    t.type === "scroll" && this.handleScroll();
  }
  revert() {
    this.scrollTicker.cancel(), this.dataTimer.cancel(), this.resizeTicker.cancel(), this.wakeTicker.cancel(), this.resizeObserver.disconnect(), (this.useWin ? Ot : this.element).removeEventListener("scroll", this), Ye.delete(this.element);
  }
}
const ti = (e) => {
  const t = (
    /** @type {HTMLElement} */
    e && Qe(e)[0] || G.body
  );
  let s = Ye.get(t);
  return s || (s = new jn(t), Ye.set(t, s)), s;
}, oe = (e, t, s, n, i) => {
  const r = t === "min", o = t === "max", c = t === "top" || t === "left" || t === "start" || r ? 0 : t === "bottom" || t === "right" || t === "end" || o ? "100%" : t === "center" ? "50%" : t, { n: l, u: a } = ht(c, dt);
  let u = l;
  return a === "%" ? u = l / 100 * s : a && (u = xe(e, dt, "px", !0).n), o && n < 0 && (u += n), r && i > 0 && (u += i), u;
}, ge = (e, t, s, n, i) => {
  let r;
  if (ft(t)) {
    const o = Tn.exec(
      /** @type {String} */
      t
    );
    if (o) {
      const c = o[0], l = c[0], a = (
        /** @type {String} */
        t.split(c)
      ), u = a[0] === "min", d = a[0] === "max", f = oe(e, a[0], s, n, i), h = oe(e, a[1], s, n, i);
      if (u) {
        const p = te(oe(e, "min", s), h, l);
        r = p < f ? f : p;
      } else if (d) {
        const p = te(oe(e, "max", s), h, l);
        r = p > f ? f : p;
      } else
        r = te(f, h, l);
    } else
      r = oe(e, t, s, n, i);
  } else
    r = /** @type {Number} */
    t;
  return L(r, 0);
}, Is = (e) => {
  let t;
  const s = e.targets;
  for (let n = 0, i = s.length; n < i; n++) {
    const r = s[n];
    if (r[se]) {
      t = /** @type {HTMLElement} */
      r;
      break;
    }
  }
  return t;
};
let ei = 0;
const ks = ["#FF4B4B", "#FF971B", "#FFC730", "#F9F640", "#7AFF5A", "#18FF74", "#17E09B", "#3CFFEC", "#05DBE9", "#33B3F1", "#638CF9", "#C563FE", "#FF4FCF", "#F93F8A"];
class si {
  /**
   * @param {ScrollObserverParams} parameters
   */
  constructor(t = {}) {
    const s = R(t.sync, "play pause"), n = s ? ze(
      /** @type {EasingParam} */
      s
    ) : null, i = s && (s === "linear" || s === St), r = s && !(n === St && !i), o = s && (Vt(s) || s === !0 || i), c = s && ft(s) && !r && !o, l = c ? (
      /** @type {String} */
      s.split(" ").map(
        (u) => () => {
          const d = this.linked;
          return d && d[u] ? d[u]() : null;
        }
      )
    ) : null, a = c && l.length > 2;
    this.index = ei++, this.id = C(t.id) ? this.index : t.id, this.container = ti(t.container), this.target = null, this.linked = null, this.repeat = null, this.horizontal = null, this.enter = null, this.leave = null, this.sync = r || o || !!l, this.syncEase = r ? n : null, this.syncSmooth = o ? s === !0 || i ? 1 : (
      /** @type {Number} */
      s
    ) : null, this.onSyncEnter = l && !a && l[0] ? l[0] : I, this.onSyncLeave = l && !a && l[1] ? l[1] : I, this.onSyncEnterForward = l && a && l[0] ? l[0] : I, this.onSyncLeaveForward = l && a && l[1] ? l[1] : I, this.onSyncEnterBackward = l && a && l[2] ? l[2] : I, this.onSyncLeaveBackward = l && a && l[3] ? l[3] : I, this.onEnter = t.onEnter || I, this.onLeave = t.onLeave || I, this.onEnterForward = t.onEnterForward || I, this.onLeaveForward = t.onLeaveForward || I, this.onEnterBackward = t.onEnterBackward || I, this.onLeaveBackward = t.onLeaveBackward || I, this.onUpdate = t.onUpdate || I, this.onResize = t.onResize || I, this.onSyncComplete = t.onSyncComplete || I, this.reverted = !1, this.ready = !1, this.completed = !1, this.began = !1, this.isInView = !1, this.forceEnter = !1, this.hasEntered = !1, this.offset = 0, this.offsetStart = 0, this.offsetEnd = 0, this.distance = 0, this.prevProgress = 0, this.thresholds = ["start", "end", "end", "start"], this.coords = [0, 0, 0, 0], this.debugStyles = null, this.$debug = null, this._params = t, this._debug = R(t.debug, !1), this._next = null, this._prev = null, Lt(this.container, this), Kn(() => {
      if (!this.reverted) {
        if (!this.target) {
          const u = (
            /** @type {HTMLElement} */
            Qe(t.target)[0]
          );
          this.target = u || G.body, this.refresh();
        }
        this._debug && this.debug();
      }
    });
  }
  /**
   * @param {Tickable|WAAPIAnimation} linked
   */
  link(t) {
    if (t && (t.pause(), this.linked = t, !C(t) && !C(
      /** @type {WAAPIAnimation} */
      t.persist
    ) && (t.persist = !0), !this._params.target)) {
      let s;
      C(
        /** @type {JSAnimation} */
        t.targets
      ) ? z(
        /** @type {Timeline} */
        t,
        (n) => {
          n.targets && !s && (s = Is(
            /** @type {JSAnimation} */
            n
          ));
        }
      ) : s = Is(
        /** @type {JSAnimation} */
        t
      ), this.target = s || G.body, this.refresh();
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
    const t = (this.scroll - this.offsetStart) / this.distance;
    return t === 1 / 0 || isNaN(t) ? 0 : L(it(t, 0, 1), 6);
  }
  refresh() {
    this.ready = !0, this.reverted = !1;
    const t = this._params;
    return this.repeat = R(_e(t.repeat, this), !0), this.horizontal = R(_e(t.axis, this), "y") === "x", this.enter = R(_e(t.enter, this), "end start"), this.leave = R(_e(t.leave, this), "start end"), this.updateBounds(), this.handleScroll(), this;
  }
  removeDebug() {
    return this.$debug && (this.$debug.parentNode.removeChild(this.$debug), this.$debug = null), this.debugStyles && (this.debugStyles.revert(), this.$debug = null), this;
  }
  debug() {
    this.removeDebug();
    const t = this.container, s = this.horizontal, n = t.element.querySelector(":scope > .animejs-onscroll-debug"), i = G.createElement("div"), r = G.createElement("div"), o = G.createElement("div"), c = ks[this.index % ks.length], l = t.useWin, a = l ? t.winWidth : t.width, u = l ? t.winHeight : t.height, d = t.scrollWidth, f = t.scrollHeight, h = this.container.width > 360 ? 320 : 260, p = s ? 0 : 10, m = s ? 10 : 0, y = s ? 24 : h / 2, b = s ? y : 15, x = s ? 60 : y, $ = s ? x : b, N = s ? "repeat-x" : "repeat-y", X = (M) => s ? "0px " + M + "px" : M + "px 2px", w = (M) => `linear-gradient(${s ? 90 : 0}deg, ${M} 2px, transparent 1px)`, Y = (M, S, A, H, T) => `position:${M};left:${S}px;top:${A}px;width:${H}px;height:${T}px;`;
    i.style.cssText = `${Y("absolute", p, m, s ? d : h, s ? h : f)}
      pointer-events: none;
      z-index: ${this.container.zIndex++};
      display: flex;
      flex-direction: ${s ? "column" : "row"};
      filter: drop-shadow(0px 1px 0px rgba(0,0,0,.75));
    `, r.style.cssText = `${Y("sticky", 0, 0, s ? a : y, s ? y : u)}`, n || (r.style.cssText += `background:
        ${w("#FFFF")}${X(y - 10)} / 100px 100px ${N},
        ${w("#FFF8")}${X(y - 10)} / 10px 10px ${N};
      `), o.style.cssText = `${Y("relative", 0, 0, s ? d : y, s ? y : f)}`, n || (o.style.cssText += `background:
        ${w("#FFFF")}${X(0)} / ${s ? "100px 10px" : "10px 100px"} ${N},
        ${w("#FFF8")}${X(0)} / ${s ? "10px 0px" : "0px 10px"} ${N};
      `);
    const j = [" enter: ", " leave: "];
    this.coords.forEach((M, S) => {
      const A = S > 1, H = (A ? 0 : this.offset) + M, T = S % 2, k = H < $, V = H > (A ? s ? a : u : s ? d : f) - $, B = (A ? T && !k : !T && !k) || V, U = G.createElement("div"), _ = G.createElement("div"), P = s ? B ? "right" : "left" : B ? "bottom" : "top", Z = B ? (s ? x : b) + (A ? s ? -1 : V ? 0 : -2 : s ? -1 : -2) : s ? 1 : 0;
      _.innerHTML = `${this.id}${j[T]}${this.thresholds[S]}`, U.style.cssText = `${Y("absolute", 0, 0, x, b)}
        display: flex;
        flex-direction: ${s ? "column" : "row"};
        justify-content: flex-${A ? "start" : "end"};
        align-items: flex-${B ? "end" : "start"};
        border-${P}: 2px solid ${c};
      `, _.style.cssText = `
        overflow: hidden;
        max-width: ${h / 2 - 10}px;
        height: ${b};
        margin-${s ? B ? "right" : "left" : B ? "bottom" : "top"}: -2px;
        padding: 1px;
        font-family: ui-monospace, monospace;
        font-size: 10px;
        letter-spacing: -.025em;
        line-height: 9px;
        font-weight: 600;
        text-align: ${s && B || !s && !A ? "right" : "left"};
        white-space: pre;
        text-overflow: ellipsis;
        color: ${T ? c : "rgba(0,0,0,.75)"};
        background-color: ${T ? "rgba(0,0,0,.65)" : c};
        border: 2px solid ${T ? c : "transparent"};
        border-${s ? B ? "top-left" : "top-right" : B ? "top-left" : "bottom-left"}-radius: 5px;
        border-${s ? B ? "bottom-left" : "bottom-right" : B ? "top-right" : "bottom-right"}-radius: 5px;
      `, U.appendChild(_);
      let K = H - Z + (s ? 1 : 0);
      U.style[s ? "left" : "top"] = `${K}px`, (A ? r : o).appendChild(U);
    }), i.appendChild(r), i.appendChild(o), t.element.appendChild(i), n || i.classList.add("animejs-onscroll-debug"), this.$debug = i, Fs(t.element, "position") === "static" && (this.debugStyles = Ps(t.element, { position: "relative " }));
  }
  updateBounds() {
    this._debug && this.removeDebug();
    let t;
    const s = this.target, n = this.container, i = this.horizontal, r = this.linked;
    let o, c = s;
    for (r && (o = r.currentTime, r.seek(0, !0)); c && c !== n.element && c !== G.body; ) {
      const T = Fs(c, "position") === "sticky" ? Ps(c, { position: "static" }) : !1;
      c = c.parentElement, T && (t || (t = []), t.push(T));
    }
    const l = s.getBoundingClientRect(), a = n.scale, u = (i ? l.left + n.scrollX - n.left : l.top + n.scrollY - n.top) * a, d = (i ? l.width : l.height) * a, f = i ? n.width : n.height, p = (i ? n.scrollWidth : n.scrollHeight) - f, m = this.enter, y = this.leave;
    let b = "start", x = "end", $ = "end", N = "start";
    if (ft(m)) {
      const T = (
        /** @type {String} */
        m.split(" ")
      );
      $ = T[0], b = T.length > 1 ? T[1] : b;
    } else if (Qt(m)) {
      const T = (
        /** @type {ScrollThresholdParam} */
        m
      );
      C(T.container) || ($ = T.container), C(T.target) || (b = T.target);
    } else Vt(m) && ($ = /** @type {Number} */
    m);
    if (ft(y)) {
      const T = (
        /** @type {String} */
        y.split(" ")
      );
      N = T[0], x = T.length > 1 ? T[1] : x;
    } else if (Qt(y)) {
      const T = (
        /** @type {ScrollThresholdParam} */
        y
      );
      C(T.container) || (N = T.container), C(T.target) || (x = T.target);
    } else Vt(y) && (N = /** @type {Number} */
    y);
    const X = ge(s, b, d), w = ge(s, x, d), Y = X + u - f, j = w + u - p, tt = ge(s, $, f, Y, j), M = ge(s, N, f, Y, j), S = X + u - tt, A = w + u - M, H = A - S;
    this.offset = u, this.offsetStart = S, this.offsetEnd = A, this.distance = H <= 0 ? 0 : H, this.thresholds = [b, x, $, N], this.coords = [X, w, tt, M], t && t.forEach((T) => T.revert()), r && r.seek(o, !0), this._debug && this.debug();
  }
  handleScroll() {
    if (!this.ready) return;
    const t = this.linked, s = this.sync, n = this.syncEase, i = this.syncSmooth, r = t && (n || i), o = this.horizontal, c = this.container, l = this.scroll, a = l <= this.offsetStart, u = l >= this.offsetEnd, d = !a && !u, f = l === this.offsetStart || l === this.offsetEnd, h = !this.hasEntered && f, p = this._debug && this.$debug;
    let m = !1, y = !1, b = this.progress;
    if (a && this.began && (this.began = !1), b > 0 && !this.began && (this.began = !0), r) {
      const x = t.progress;
      if (i && Vt(i)) {
        if (
          /** @type {Number} */
          i < 1
        ) {
          const N = x < b && b === 1 ? 1e-4 : x > b && !b ? -1e-4 : 0;
          b = L(At(x, b, At(
            0.01,
            0.2,
            /** @type {Number} */
            i
          )) + N, 6);
        }
      } else n && (b = n(b));
      m = b !== this.prevProgress, y = x === 1, m && !y && i && x && c.wakeTicker.restart();
    }
    if (p) {
      const x = o ? c.scrollY : c.scrollX;
      p.style[o ? "top" : "left"] = x + 10 + "px";
    }
    (d && !this.isInView || h && !this.forceEnter && !this.hasEntered) && (d && (this.isInView = !0), !this.forceEnter || !this.hasEntered ? (p && d && (p.style.zIndex = `${this.container.zIndex++}`), this.onSyncEnter(this), this.onEnter(this), this.backward ? (this.onSyncEnterBackward(this), this.onEnterBackward(this)) : (this.onSyncEnterForward(this), this.onEnterForward(this)), this.hasEntered = !0, h && (this.forceEnter = !0)) : d && (this.forceEnter = !1)), (d || !d && this.isInView) && (m = !0), m && (r && t.seek(t.duration * b), this.onUpdate(this)), !d && this.isInView && (this.isInView = !1, this.onSyncLeave(this), this.onLeave(this), this.backward ? (this.onSyncLeaveBackward(this), this.onLeaveBackward(this)) : (this.onSyncLeaveForward(this), this.onLeaveForward(this)), s && !i && (y = !0)), b >= 1 && this.began && !this.completed && (s && y || !s) && (s && this.onSyncComplete(this), this.completed = !0, (!this.repeat && !t || !this.repeat && t && t.completed) && this.revert()), b < 1 && this.completed && (this.completed = !1), this.prevProgress = b;
  }
  revert() {
    if (this.reverted) return;
    const t = this.container;
    return Ut(t, this), t._head || t.revert(), this._debug && this.removeDebug(), this.reverted = !0, this.ready = !1, this;
  }
}
const ni = (e = {}) => new si(e);
function $s(e, t) {
  return Vn.animate(e, t);
}
function ii(e) {
  return ni(e);
}
function ri(e) {
  return typeof e == "function" ? {
    enter: e,
    leave: void 0
  } : {
    enter: e == null ? void 0 : e.enter,
    leave: e == null ? void 0 : e.leave
  };
}
function Ds(e, t, s) {
  var a, u;
  const { enter: n, leave: i } = ri(t), r = (a = s == null ? void 0 : s.enterMargin) != null ? a : "0px", o = (u = s == null ? void 0 : s.leaveMargin) != null ? u : "0px";
  if (typeof IntersectionObserver != "function")
    return typeof n == "function" && n({ isIntersecting: !0, target: e }), () => {
    };
  let c = !!(s != null && s.initialIntersected);
  const l = new IntersectionObserver((d) => {
    for (const f of d)
      if (f.target === e) {
        if (!f.isIntersecting) {
          c && typeof i == "function" && i(f), c = !1;
          continue;
        }
        c || (c = !0, typeof n == "function" && n(f), s.replay || l.unobserve(e));
      }
  }, {
    threshold: s.threshold,
    rootMargin: `${o} 0px ${r} 0px`
  });
  return l.observe(e), () => {
    if (typeof l.disconnect == "function") {
      l.disconnect();
      return;
    }
    typeof l.unobserve == "function" && l.unobserve(e);
  };
}
const Os = {
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
}, Ls = {
  "bezier-in": "cubicBezier(0.5, 0, 0.9, 0.3)",
  "bezier-out": "cubicBezier(0.1, 0.7, 0.5, 1)"
};
function ve(e) {
  return Number.parseFloat(String(e).replaceAll("_", "."));
}
function ns(e, t, s) {
  return Math.min(Math.max(e, t), s);
}
function oi(e) {
  const t = ve(e);
  return Number.isFinite(t) ? ns(t, 0, 100) / 100 : null;
}
function ai(e, t) {
  const s = Number.parseInt(t, 10);
  if (!Number.isFinite(s)) return null;
  const n = ns(s, 100, 1e3) / 100;
  return `${e}(${Number.parseFloat(n.toFixed(2))})`;
}
function Bs(e) {
  const t = String(e).trim().replaceAll("_", ".");
  if (t.length === 0) return null;
  if (/^-?\d+(\.\d+)?p$/i.test(t))
    return `${t.slice(0, -1)}%`;
  if (/^-?\d+(\.\d+)?%$/.test(t))
    return t;
  if (/^-?\d+(\.\d+)?px$/i.test(t))
    return `${Number.parseFloat(t)}px`;
  const s = Number.parseFloat(t);
  return Number.isFinite(s) ? `${s}%` : null;
}
function li(e = []) {
  const t = {
    ...Os,
    parallax: { ...Os.parallax }
  };
  for (let s = 0; s < e.length; s += 1) {
    const n = e[s];
    if (n === "duration") {
      const i = ve(e[s + 1]);
      Number.isFinite(i) && (t.duration = i), s += 1;
      continue;
    }
    if (n === "delay") {
      const i = ve(e[s + 1]);
      Number.isFinite(i) && (t.delay = i), s += 1;
      continue;
    }
    if (n === "threshold") {
      const i = oi(e[s + 1]);
      i !== null && (t.threshold = i), s += 1;
      continue;
    }
    if (n === "ease") {
      const i = e[s + 1];
      if (Ls[i]) {
        t.ease = Ls[i], s += 1;
        continue;
      }
      if (i === "power-in" || i === "power-out") {
        const r = ai(i === "power-in" ? "in" : "out", e[s + 2]);
        r !== null && (t.ease = r), s += 2;
        continue;
      }
      continue;
    }
    if (n === "once") {
      t.replay = !1;
      continue;
    }
    if (n === "repeat") {
      t.replay = !0;
      continue;
    }
    if (n === "enter" || n === "start") {
      const i = Bs(e[s + 1]);
      i !== null && (t.enterMargin = i), s += 1;
      continue;
    }
    if (n === "leave" || n === "end") {
      const i = Bs(e[s + 1]);
      i !== null && (t.leaveMargin = i), s += 1;
      continue;
    }
    if (n === "amount") {
      const i = ve(e[s + 1]);
      Number.isFinite(i) && (t.parallax.amount = ns(i, 0, 1e3)), s += 1;
      continue;
    }
    if (n === "axis") {
      const i = e[s + 1];
      (i === "x" || i === "y") && (t.parallax.axis = i), s += 1;
      continue;
    }
    n === "reverse" && (t.parallax.reverse = !0);
  }
  return t;
}
const ci = {
  fade: { opacity: [0, 1] },
  "fade-in-out": { opacity: [0, 1] },
  "fade-right": { x: [-100, 0], opacity: [0, 1] },
  "fade-left": { x: [100, 0], opacity: [0, 1] },
  "fade-up": { y: [50, 0], opacity: [0, 1] },
  "fade-down": { y: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] },
  parallax: { type: "scroll", effect: "parallax" }
};
let is = { ...ci };
function ui(e, t) {
  typeof e != "string" || e.trim().length === 0 || !t || typeof t != "object" || (is[e] = t);
}
function qe(e) {
  return is[e];
}
function hi() {
  return Object.keys(is);
}
const di = /* @__PURE__ */ new Set(["duration", "delay", "ease", "opacity", "x", "y", "scale"]);
function Kt(e, t) {
  return Array.isArray(e) ? t === "last" ? e[e.length - 1] : e[0] : e;
}
function fi(e, t, s) {
  if (s != null) {
    if (t.includes("-")) {
      e.style.setProperty(t, String(s));
      return;
    }
    e.style[t] = String(s);
  }
}
function pi(e, t, s) {
  for (const [n, i] of Object.entries(t))
    di.has(n) || fi(e, n, Kt(i, s));
}
function Ze(e, t, s) {
  t.opacity && (e.style.opacity = String(Kt(t.opacity, s)));
  const n = [];
  t.x && n.push(`translateX(${Kt(t.x, s)}px)`), t.y && n.push(`translateY(${Kt(t.y, s)}px)`), t.scale && n.push(`scale(${Kt(t.scale, s)})`), e.style.transform = n.join(" "), pi(e, t, s);
}
function mi(e) {
  const t = e.parallax.amount / 2, s = t === 0 ? 0 : t, n = t === 0 ? 0 : -t;
  return e.parallax.reverse ? [n, s] : [s, n];
}
function _i(e, t) {
  return t === "x" ? `${e}px 0px` : `0px ${e}px`;
}
function gi(e) {
  e.style.translate = "0px 0px";
}
function yi(e, t) {
  Ze(e, t, "last"), t.opacity && (e.style.opacity = String(Kt(t.opacity, "first")));
}
function Ms() {
  return typeof globalThis.matchMedia != "function" ? !1 : globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Ti(e, { ignoreOpacity: t = !1 } = {}) {
  if (typeof e.checkVisibility == "function")
    return e.checkVisibility({
      contentVisibilityAuto: !0,
      opacityProperty: !t,
      visibilityProperty: !0
    });
  if (typeof globalThis.getComputedStyle != "function") return !0;
  const s = globalThis.getComputedStyle(e);
  return !(s.display === "none" || s.visibility === "hidden" || !t && s.opacity === "0");
}
function bi() {
  var t;
  const e = (t = globalThis.document) == null ? void 0 : t.documentElement;
  return {
    width: globalThis.innerWidth || (e == null ? void 0 : e.clientWidth) || 0,
    height: globalThis.innerHeight || (e == null ? void 0 : e.clientHeight) || 0
  };
}
function Vs(e, t) {
  if (!Ti(e, t) || typeof e.getBoundingClientRect != "function") return !1;
  const s = bi();
  if (s.width <= 0 || s.height <= 0) return !1;
  const n = e.getBoundingClientRect(), i = Math.min(n.right, s.width) - Math.max(n.left, 0), r = Math.min(n.bottom, s.height) - Math.max(n.top, 0);
  return i >= 1 && r >= 1;
}
function vi(e) {
  return typeof globalThis.addEventListener != "function" ? () => {
  } : (globalThis.addEventListener("load", e), globalThis.addEventListener("resize", e), () => {
    typeof globalThis.removeEventListener == "function" && (globalThis.removeEventListener("load", e), globalThis.removeEventListener("resize", e));
  });
}
function Si(e, { modifiers: t = [] }, { cleanup: s } = {}) {
  const n = t.filter((h) => !!qe(h));
  if (n.length !== 1)
    return;
  const i = n[0], r = qe(i), o = li(t);
  if (i === "parallax") {
    if (Ms()) {
      gi(e);
      return;
    }
    const h = mi(o), p = ii({
      target: e,
      axis: o.parallax.axis,
      sync: !0,
      enter: "end start",
      leave: "start end"
    }), m = $s(e, {
      translate: h.map((y) => _i(y, o.parallax.axis)),
      duration: 1e3,
      ease: "linear",
      autoplay: p
    });
    typeof s == "function" && s(() => {
      m && typeof m.cancel == "function" && m.cancel(), p && typeof p.revert == "function" && p.revert();
    });
    return;
  }
  if (Ms()) {
    Ze(e, r, "last");
    return;
  }
  let c, l = () => {
  }, a = () => {
  };
  const u = (h) => {
    var p, m, y;
    a(), a = () => {
    }, c && typeof c.cancel == "function" && c.cancel(), c = $s(e, {
      ...h,
      duration: (p = h.duration) != null ? p : o.duration,
      delay: (m = h.delay) != null ? m : o.delay,
      ease: (y = h.ease) != null ? y : o.ease
    });
  }, d = (h = !1) => {
    l = i === "fade-in-out" ? Ds(e, {
      enter: () => u({ opacity: [0, 1] }),
      leave: () => u({ opacity: [1, 0], delay: 0 })
    }, {
      ...o,
      initialIntersected: h
    }) : Ds(e, () => {
      u(r);
    }, {
      ...o,
      initialIntersected: h
    });
  }, f = () => {
    var h;
    a(), a = () => {
    }, yi(e, r), u({ opacity: (h = r.opacity) != null ? h : [0, 1] }), !(!o.replay && i !== "fade-in-out") && d(!0);
  };
  Vs(e) ? f() : (Ze(e, r, "first"), a = vi(() => {
    Vs(e, { ignoreOpacity: !0 }) && (l(), l = () => {
    }, f());
  }), d(!1)), typeof s == "function" && s(() => {
    c && typeof c.cancel == "function" && c.cancel(), a(), l();
  });
}
const rs = function(e) {
  e.directive("anime", Si);
};
rs.definePreset = ui;
rs.getPreset = qe;
rs.getPresetNames = hi;
export {
  rs as default,
  ui as definePreset,
  qe as getPreset,
  hi as getPresetNames
};
