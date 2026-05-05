var yr = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: "normal",
  autoplay: !0,
  timelineOffset: 0
}, G = {
  duration: 1e3,
  delay: 0,
  endDelay: 0,
  easing: "easeOutElastic(1, .5)",
  round: 0
}, jr = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"], H = {
  CSS: {},
  springs: {}
};
function E(r, e, n) {
  return Math.min(Math.max(r, e), n);
}
function z(r, e) {
  return r.indexOf(e) > -1;
}
function Y(r, e) {
  return r.apply(null, e);
}
var c = {
  arr: function(r) {
    return Array.isArray(r);
  },
  obj: function(r) {
    return z(Object.prototype.toString.call(r), "Object");
  },
  pth: function(r) {
    return c.obj(r) && r.hasOwnProperty("totalLength");
  },
  svg: function(r) {
    return r instanceof SVGElement;
  },
  inp: function(r) {
    return r instanceof HTMLInputElement;
  },
  dom: function(r) {
    return r.nodeType || c.svg(r);
  },
  str: function(r) {
    return typeof r == "string";
  },
  fnc: function(r) {
    return typeof r == "function";
  },
  und: function(r) {
    return typeof r == "undefined";
  },
  nil: function(r) {
    return c.und(r) || r === null;
  },
  hex: function(r) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(r);
  },
  rgb: function(r) {
    return /^rgb/.test(r);
  },
  hsl: function(r) {
    return /^hsl/.test(r);
  },
  col: function(r) {
    return c.hex(r) || c.rgb(r) || c.hsl(r);
  },
  key: function(r) {
    return !yr.hasOwnProperty(r) && !G.hasOwnProperty(r) && r !== "targets" && r !== "keyframes";
  }
};
function mr(r) {
  var e = /\(([^)]+)\)/.exec(r);
  return e ? e[1].split(",").map(function(n) {
    return parseFloat(n);
  }) : [];
}
function br(r, e) {
  var n = mr(r), a = E(c.und(n[0]) ? 1 : n[0], 0.1, 100), t = E(c.und(n[1]) ? 100 : n[1], 0.1, 100), u = E(c.und(n[2]) ? 10 : n[2], 0.1, 100), o = E(c.und(n[3]) ? 0 : n[3], 0.1, 100), s = Math.sqrt(t / a), i = u / (2 * Math.sqrt(t * a)), p = i < 1 ? s * Math.sqrt(1 - i * i) : 0, f = 1, l = i < 1 ? (i * s + -o) / p : -o + s;
  function h(y) {
    var v = e ? e * y / 1e3 : y;
    return i < 1 ? v = Math.exp(-v * i * s) * (f * Math.cos(p * v) + l * Math.sin(p * v)) : v = (f + l * v) * Math.exp(-v * s), y === 0 || y === 1 ? y : 1 - v;
  }
  function w() {
    var y = H.springs[r];
    if (y)
      return y;
    for (var v = 1 / 6, b = 0, M = 0; ; )
      if (b += v, h(b) === 1) {
        if (M++, M >= 16)
          break;
      } else
        M = 0;
    var g = b * v * 1e3;
    return H.springs[r] = g, g;
  }
  return e ? h : w;
}
function Nr(r) {
  return r === void 0 && (r = 10), function(e) {
    return Math.ceil(E(e, 1e-6, 1) * r) * (1 / r);
  };
}
var zr = (function() {
  var r = 11, e = 1 / (r - 1);
  function n(f, l) {
    return 1 - 3 * l + 3 * f;
  }
  function a(f, l) {
    return 3 * l - 6 * f;
  }
  function t(f) {
    return 3 * f;
  }
  function u(f, l, h) {
    return ((n(l, h) * f + a(l, h)) * f + t(l)) * f;
  }
  function o(f, l, h) {
    return 3 * n(l, h) * f * f + 2 * a(l, h) * f + t(l);
  }
  function s(f, l, h, w, y) {
    var v, b, M = 0;
    do
      b = l + (h - l) / 2, v = u(b, w, y) - f, v > 0 ? h = b : l = b;
    while (Math.abs(v) > 1e-7 && ++M < 10);
    return b;
  }
  function i(f, l, h, w) {
    for (var y = 0; y < 4; ++y) {
      var v = o(l, h, w);
      if (v === 0)
        return l;
      var b = u(l, h, w) - f;
      l -= b / v;
    }
    return l;
  }
  function p(f, l, h, w) {
    if (!(0 <= f && f <= 1 && 0 <= h && h <= 1))
      return;
    var y = new Float32Array(r);
    if (f !== l || h !== w)
      for (var v = 0; v < r; ++v)
        y[v] = u(v * e, f, h);
    function b(M) {
      for (var g = 0, d = 1, I = r - 1; d !== I && y[d] <= M; ++d)
        g += e;
      --d;
      var D = (M - y[d]) / (y[d + 1] - y[d]), x = g + D * e, k = o(x, f, h);
      return k >= 1e-3 ? i(M, x, f, h) : k === 0 ? x : s(M, g, g + e, f, h);
    }
    return function(M) {
      return f === l && h === w || M === 0 || M === 1 ? M : u(b(M), l, w);
    };
  }
  return p;
})(), xr = (function() {
  var r = { linear: function() {
    return function(a) {
      return a;
    };
  } }, e = {
    Sine: function() {
      return function(a) {
        return 1 - Math.cos(a * Math.PI / 2);
      };
    },
    Expo: function() {
      return function(a) {
        return a ? Math.pow(2, 10 * a - 10) : 0;
      };
    },
    Circ: function() {
      return function(a) {
        return 1 - Math.sqrt(1 - a * a);
      };
    },
    Back: function() {
      return function(a) {
        return a * a * (3 * a - 2);
      };
    },
    Bounce: function() {
      return function(a) {
        for (var t, u = 4; a < ((t = Math.pow(2, --u)) - 1) / 11; )
          ;
        return 1 / Math.pow(4, 3 - u) - 7.5625 * Math.pow((t * 3 - 2) / 22 - a, 2);
      };
    },
    Elastic: function(a, t) {
      a === void 0 && (a = 1), t === void 0 && (t = 0.5);
      var u = E(a, 1, 10), o = E(t, 0.1, 2);
      return function(s) {
        return s === 0 || s === 1 ? s : -u * Math.pow(2, 10 * (s - 1)) * Math.sin((s - 1 - o / (Math.PI * 2) * Math.asin(1 / u)) * (Math.PI * 2) / o);
      };
    }
  }, n = ["Quad", "Cubic", "Quart", "Quint"];
  return n.forEach(function(a, t) {
    e[a] = function() {
      return function(u) {
        return Math.pow(u, t + 2);
      };
    };
  }), Object.keys(e).forEach(function(a) {
    var t = e[a];
    r["easeIn" + a] = t, r["easeOut" + a] = function(u, o) {
      return function(s) {
        return 1 - t(u, o)(1 - s);
      };
    }, r["easeInOut" + a] = function(u, o) {
      return function(s) {
        return s < 0.5 ? t(u, o)(s * 2) / 2 : 1 - t(u, o)(s * -2 + 2) / 2;
      };
    }, r["easeOutIn" + a] = function(u, o) {
      return function(s) {
        return s < 0.5 ? (1 - t(u, o)(1 - s * 2)) / 2 : (t(u, o)(s * 2 - 1) + 1) / 2;
      };
    };
  }), r;
})();
function X(r, e) {
  if (c.fnc(r))
    return r;
  var n = r.split("(")[0], a = xr[n], t = mr(r);
  switch (n) {
    case "spring":
      return br(r, e);
    case "cubicBezier":
      return Y(zr, t);
    case "steps":
      return Y(Nr, t);
    default:
      return Y(a, t);
  }
}
function Mr(r) {
  try {
    var e = document.querySelectorAll(r);
    return e;
  } catch (n) {
    return;
  }
}
function U(r, e) {
  for (var n = r.length, a = arguments.length >= 2 ? arguments[1] : void 0, t = [], u = 0; u < n; u++)
    if (u in r) {
      var o = r[u];
      e.call(a, o, u, r) && t.push(o);
    }
  return t;
}
function $(r) {
  return r.reduce(function(e, n) {
    return e.concat(c.arr(n) ? $(n) : n);
  }, []);
}
function vr(r) {
  return c.arr(r) ? r : (c.str(r) && (r = Mr(r) || r), r instanceof NodeList || r instanceof HTMLCollection ? [].slice.call(r) : [r]);
}
function rr(r, e) {
  return r.some(function(n) {
    return n === e;
  });
}
function er(r) {
  var e = {};
  for (var n in r)
    e[n] = r[n];
  return e;
}
function K(r, e) {
  var n = er(r);
  for (var a in r)
    n[a] = e.hasOwnProperty(a) ? e[a] : r[a];
  return n;
}
function W(r, e) {
  var n = er(r);
  for (var a in e)
    n[a] = c.und(r[a]) ? e[a] : r[a];
  return n;
}
function Rr(r) {
  var e = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(r);
  return e ? "rgba(" + e[1] + ",1)" : r;
}
function Hr(r) {
  var e = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, n = r.replace(e, function(s, i, p, f) {
    return i + i + p + p + f + f;
  }), a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n), t = parseInt(a[1], 16), u = parseInt(a[2], 16), o = parseInt(a[3], 16);
  return "rgba(" + t + "," + u + "," + o + ",1)";
}
function Ur(r) {
  var e = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(r) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(r), n = parseInt(e[1], 10) / 360, a = parseInt(e[2], 10) / 100, t = parseInt(e[3], 10) / 100, u = e[4] || 1;
  function o(h, w, y) {
    return y < 0 && (y += 1), y > 1 && (y -= 1), y < 1 / 6 ? h + (w - h) * 6 * y : y < 1 / 2 ? w : y < 2 / 3 ? h + (w - h) * (2 / 3 - y) * 6 : h;
  }
  var s, i, p;
  if (a == 0)
    s = i = p = t;
  else {
    var f = t < 0.5 ? t * (1 + a) : t + a - t * a, l = 2 * t - f;
    s = o(l, f, n + 1 / 3), i = o(l, f, n), p = o(l, f, n - 1 / 3);
  }
  return "rgba(" + s * 255 + "," + i * 255 + "," + p * 255 + "," + u + ")";
}
function $r(r) {
  if (c.rgb(r))
    return Rr(r);
  if (c.hex(r))
    return Hr(r);
  if (c.hsl(r))
    return Ur(r);
}
function S(r) {
  var e = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(r);
  if (e)
    return e[1];
}
function Wr(r) {
  if (z(r, "translate") || r === "perspective")
    return "px";
  if (z(r, "rotate") || z(r, "skew"))
    return "deg";
}
function J(r, e) {
  return c.fnc(r) ? r(e.target, e.id, e.total) : r;
}
function O(r, e) {
  return r.getAttribute(e);
}
function nr(r, e, n) {
  var a = S(e);
  if (rr([n, "deg", "rad", "turn"], a))
    return e;
  var t = H.CSS[e + n];
  if (!c.und(t))
    return t;
  var u = 100, o = document.createElement(r.tagName), s = r.parentNode && r.parentNode !== document ? r.parentNode : document.body;
  s.appendChild(o), o.style.position = "absolute", o.style.width = u + n;
  var i = u / o.offsetWidth;
  s.removeChild(o);
  var p = i * parseFloat(e);
  return H.CSS[e + n] = p, p;
}
function Tr(r, e, n) {
  if (e in r.style) {
    var a = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), t = r.style[e] || getComputedStyle(r).getPropertyValue(a) || "0";
    return n ? nr(r, t, n) : t;
  }
}
function tr(r, e) {
  if (c.dom(r) && !c.inp(r) && (!c.nil(O(r, e)) || c.svg(r) && r[e]))
    return "attribute";
  if (c.dom(r) && rr(jr, e))
    return "transform";
  if (c.dom(r) && e !== "transform" && Tr(r, e))
    return "css";
  if (r[e] != null)
    return "object";
}
function wr(r) {
  if (c.dom(r)) {
    for (var e = r.style.transform || "", n = /(\w+)\(([^)]*)\)/g, a = /* @__PURE__ */ new Map(), t; t = n.exec(e); )
      a.set(t[1], t[2]);
    return a;
  }
}
function _r(r, e, n, a) {
  var t = z(e, "scale") ? 1 : 0 + Wr(e), u = wr(r).get(e) || t;
  return n && (n.transforms.list.set(e, u), n.transforms.last = e), a ? nr(r, u, a) : u;
}
function ar(r, e, n, a) {
  switch (tr(r, e)) {
    case "transform":
      return _r(r, e, a, n);
    case "css":
      return Tr(r, e, n);
    case "attribute":
      return O(r, e);
    default:
      return r[e] || 0;
  }
}
function ir(r, e) {
  var n = /^(\*=|\+=|-=)/.exec(r);
  if (!n)
    return r;
  var a = S(r) || 0, t = parseFloat(e), u = parseFloat(r.replace(n[0], ""));
  switch (n[0][0]) {
    case "+":
      return t + u + a;
    case "-":
      return t - u + a;
    case "*":
      return t * u + a;
  }
}
function Ir(r, e) {
  if (c.col(r))
    return $r(r);
  if (/\s/g.test(r))
    return r;
  var n = S(r), a = n ? r.substr(0, r.length - n.length) : r;
  return e ? a + e : a;
}
function ur(r, e) {
  return Math.sqrt(Math.pow(e.x - r.x, 2) + Math.pow(e.y - r.y, 2));
}
function qr(r) {
  return Math.PI * 2 * O(r, "r");
}
function Qr(r) {
  return O(r, "width") * 2 + O(r, "height") * 2;
}
function Yr(r) {
  return ur(
    { x: O(r, "x1"), y: O(r, "y1") },
    { x: O(r, "x2"), y: O(r, "y2") }
  );
}
function Pr(r) {
  for (var e = r.points, n = 0, a, t = 0; t < e.numberOfItems; t++) {
    var u = e.getItem(t);
    t > 0 && (n += ur(a, u)), a = u;
  }
  return n;
}
function Zr(r) {
  var e = r.points;
  return Pr(r) + ur(e.getItem(e.numberOfItems - 1), e.getItem(0));
}
function Cr(r) {
  if (r.getTotalLength)
    return r.getTotalLength();
  switch (r.tagName.toLowerCase()) {
    case "circle":
      return qr(r);
    case "rect":
      return Qr(r);
    case "line":
      return Yr(r);
    case "polyline":
      return Pr(r);
    case "polygon":
      return Zr(r);
  }
}
function Kr(r) {
  var e = Cr(r);
  return r.setAttribute("stroke-dasharray", e), e;
}
function Jr(r) {
  for (var e = r.parentNode; c.svg(e) && c.svg(e.parentNode); )
    e = e.parentNode;
  return e;
}
function Er(r, e) {
  var n = e || {}, a = n.el || Jr(r), t = a.getBoundingClientRect(), u = O(a, "viewBox"), o = t.width, s = t.height, i = n.viewBox || (u ? u.split(" ") : [0, 0, o, s]);
  return {
    el: a,
    viewBox: i,
    x: i[0] / 1,
    y: i[1] / 1,
    w: o,
    h: s,
    vW: i[2],
    vH: i[3]
  };
}
function Gr(r, e) {
  var n = c.str(r) ? Mr(r)[0] : r, a = e || 100;
  return function(t) {
    return {
      property: t,
      el: n,
      svg: Er(n),
      totalLength: Cr(n) * (a / 100)
    };
  };
}
function Xr(r, e, n) {
  function a(f) {
    f === void 0 && (f = 0);
    var l = e + f >= 1 ? e + f : 0;
    return r.el.getPointAtLength(l);
  }
  var t = Er(r.el, r.svg), u = a(), o = a(-1), s = a(1), i = n ? 1 : t.w / t.vW, p = n ? 1 : t.h / t.vH;
  switch (r.property) {
    case "x":
      return (u.x - t.x) * i;
    case "y":
      return (u.y - t.y) * p;
    case "angle":
      return Math.atan2(s.y - o.y, s.x - o.x) * 180 / Math.PI;
  }
}
function dr(r, e) {
  var n = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, a = Ir(c.pth(r) ? r.totalLength : r, e) + "";
  return {
    original: a,
    numbers: a.match(n) ? a.match(n).map(Number) : [0],
    strings: c.str(r) || e ? a.split(n) : []
  };
}
function or(r) {
  var e = r ? $(c.arr(r) ? r.map(vr) : vr(r)) : [];
  return U(e, function(n, a, t) {
    return t.indexOf(n) === a;
  });
}
function Or(r) {
  var e = or(r);
  return e.map(function(n, a) {
    return { target: n, id: a, total: e.length, transforms: { list: wr(n) } };
  });
}
function re(r, e) {
  var n = er(e);
  if (/^spring/.test(n.easing) && (n.duration = br(n.easing)), c.arr(r)) {
    var a = r.length, t = a === 2 && !c.obj(r[0]);
    t ? r = { value: r } : c.fnc(e.duration) || (n.duration = e.duration / a);
  }
  var u = c.arr(r) ? r : [r];
  return u.map(function(o, s) {
    var i = c.obj(o) && !c.pth(o) ? o : { value: o };
    return c.und(i.delay) && (i.delay = s ? 0 : e.delay), c.und(i.endDelay) && (i.endDelay = s === u.length - 1 ? e.endDelay : 0), i;
  }).map(function(o) {
    return W(o, n);
  });
}
function ee(r) {
  for (var e = U($(r.map(function(u) {
    return Object.keys(u);
  })), function(u) {
    return c.key(u);
  }).reduce(function(u, o) {
    return u.indexOf(o) < 0 && u.push(o), u;
  }, []), n = {}, a = function(u) {
    var o = e[u];
    n[o] = r.map(function(s) {
      var i = {};
      for (var p in s)
        c.key(p) ? p == o && (i.value = s[p]) : i[p] = s[p];
      return i;
    });
  }, t = 0; t < e.length; t++) a(t);
  return n;
}
function ne(r, e) {
  var n = [], a = e.keyframes;
  a && (e = W(ee(a), e));
  for (var t in e)
    c.key(t) && n.push({
      name: t,
      tweens: re(e[t], r)
    });
  return n;
}
function te(r, e) {
  var n = {};
  for (var a in r) {
    var t = J(r[a], e);
    c.arr(t) && (t = t.map(function(u) {
      return J(u, e);
    }), t.length === 1 && (t = t[0])), n[a] = t;
  }
  return n.duration = parseFloat(n.duration), n.delay = parseFloat(n.delay), n;
}
function ae(r, e) {
  var n;
  return r.tweens.map(function(a) {
    var t = te(a, e), u = t.value, o = c.arr(u) ? u[1] : u, s = S(o), i = ar(e.target, r.name, s, e), p = n ? n.to.original : i, f = c.arr(u) ? u[0] : p, l = S(f) || S(i), h = s || l;
    return c.und(o) && (o = p), t.from = dr(f, h), t.to = dr(ir(o, f), h), t.start = n ? n.end : 0, t.end = t.start + t.delay + t.duration + t.endDelay, t.easing = X(t.easing, t.duration), t.isPath = c.pth(u), t.isPathTargetInsideSVG = t.isPath && c.svg(e.target), t.isColor = c.col(t.from.original), t.isColor && (t.round = 1), n = t, t;
  });
}
var Sr = {
  css: function(r, e, n) {
    return r.style[e] = n;
  },
  attribute: function(r, e, n) {
    return r.setAttribute(e, n);
  },
  object: function(r, e, n) {
    return r[e] = n;
  },
  transform: function(r, e, n, a, t) {
    if (a.list.set(e, n), e === a.last || t) {
      var u = "";
      a.list.forEach(function(o, s) {
        u += s + "(" + o + ") ";
      }), r.style.transform = u;
    }
  }
};
function Dr(r, e) {
  var n = Or(r);
  n.forEach(function(a) {
    for (var t in e) {
      var u = J(e[t], a), o = a.target, s = S(u), i = ar(o, t, s, a), p = s || S(i), f = ir(Ir(u, p), i), l = tr(o, t);
      Sr[l](o, t, f, a.transforms, !0);
    }
  });
}
function ie(r, e) {
  var n = tr(r.target, e.name);
  if (n) {
    var a = ae(e, r), t = a[a.length - 1];
    return {
      type: n,
      property: e.name,
      animatable: r,
      tweens: a,
      duration: t.end,
      delay: a[0].delay,
      endDelay: t.endDelay
    };
  }
}
function ue(r, e) {
  return U($(r.map(function(n) {
    return e.map(function(a) {
      return ie(n, a);
    });
  })), function(n) {
    return !c.und(n);
  });
}
function kr(r, e) {
  var n = r.length, a = function(u) {
    return u.timelineOffset ? u.timelineOffset : 0;
  }, t = {};
  return t.duration = n ? Math.max.apply(Math, r.map(function(u) {
    return a(u) + u.duration;
  })) : e.duration, t.delay = n ? Math.min.apply(Math, r.map(function(u) {
    return a(u) + u.delay;
  })) : e.delay, t.endDelay = n ? t.duration - Math.max.apply(Math, r.map(function(u) {
    return a(u) + u.duration - u.endDelay;
  })) : e.endDelay, t;
}
var gr = 0;
function oe(r) {
  var e = K(yr, r), n = K(G, r), a = ne(n, r), t = Or(r.targets), u = ue(t, a), o = kr(u, n), s = gr;
  return gr++, W(e, {
    id: s,
    children: [],
    animatables: t,
    animations: u,
    duration: o.duration,
    delay: o.delay,
    endDelay: o.endDelay
  });
}
var C = [], Fr = (function() {
  var r;
  function e() {
    !r && (!hr() || !m.suspendWhenDocumentHidden) && C.length > 0 && (r = requestAnimationFrame(n));
  }
  function n(t) {
    for (var u = C.length, o = 0; o < u; ) {
      var s = C[o];
      s.paused ? (C.splice(o, 1), u--) : (s.tick(t), o++);
    }
    r = o > 0 ? requestAnimationFrame(n) : void 0;
  }
  function a() {
    m.suspendWhenDocumentHidden && (hr() ? r = cancelAnimationFrame(r) : (C.forEach(
      function(t) {
        return t._onDocumentVisibility();
      }
    ), Fr()));
  }
  return typeof document != "undefined" && document.addEventListener("visibilitychange", a), e;
})();
function hr() {
  return !!document && document.hidden;
}
function m(r) {
  r === void 0 && (r = {});
  var e = 0, n = 0, a = 0, t, u = 0, o = null;
  function s(g) {
    var d = window.Promise && new Promise(function(I) {
      return o = I;
    });
    return g.finished = d, d;
  }
  var i = oe(r);
  s(i);
  function p() {
    var g = i.direction;
    g !== "alternate" && (i.direction = g !== "normal" ? "normal" : "reverse"), i.reversed = !i.reversed, t.forEach(function(d) {
      return d.reversed = i.reversed;
    });
  }
  function f(g) {
    return i.reversed ? i.duration - g : g;
  }
  function l() {
    e = 0, n = f(i.currentTime) * (1 / m.speed);
  }
  function h(g, d) {
    d && d.seek(g - d.timelineOffset);
  }
  function w(g) {
    if (i.reversePlayback)
      for (var I = u; I--; )
        h(g, t[I]);
    else
      for (var d = 0; d < u; d++)
        h(g, t[d]);
  }
  function y(g) {
    for (var d = 0, I = i.animations, D = I.length; d < D; ) {
      var x = I[d], k = x.animatable, B = x.tweens, F = B.length - 1, T = B[F];
      F && (T = U(B, function(Vr) {
        return g < Vr.end;
      })[0] || T);
      for (var A = E(g - T.start - T.delay, 0, T.duration) / T.duration, R = isNaN(A) ? 1 : T.easing(A), P = T.to.strings, _ = T.round, q = [], Br = T.to.numbers.length, L = void 0, V = 0; V < Br; V++) {
        var j = void 0, sr = T.to.numbers[V], fr = T.from.numbers[V] || 0;
        T.isPath ? j = Xr(T.value, R * sr, T.isPathTargetInsideSVG) : j = fr + R * (sr - fr), _ && (T.isColor && V > 2 || (j = Math.round(j * _) / _)), q.push(j);
      }
      var cr = P.length;
      if (!cr)
        L = q[0];
      else {
        L = P[0];
        for (var N = 0; N < cr; N++) {
          P[N];
          var lr = P[N + 1], Q = q[N];
          isNaN(Q) || (lr ? L += Q + lr : L += Q + " ");
        }
      }
      Sr[x.type](k.target, x.property, L, k.transforms), x.currentValue = L, d++;
    }
  }
  function v(g) {
    i[g] && !i.passThrough && i[g](i);
  }
  function b() {
    i.remaining && i.remaining !== !0 && i.remaining--;
  }
  function M(g) {
    var d = i.duration, I = i.delay, D = d - i.endDelay, x = f(g);
    i.progress = E(x / d * 100, 0, 100), i.reversePlayback = x < i.currentTime, t && w(x), !i.began && i.currentTime > 0 && (i.began = !0, v("begin")), !i.loopBegan && i.currentTime > 0 && (i.loopBegan = !0, v("loopBegin")), x <= I && i.currentTime !== 0 && y(0), (x >= D && i.currentTime !== d || !d) && y(d), x > I && x < D ? (i.changeBegan || (i.changeBegan = !0, i.changeCompleted = !1, v("changeBegin")), v("change"), y(x)) : i.changeBegan && (i.changeCompleted = !0, i.changeBegan = !1, v("changeComplete")), i.currentTime = E(x, 0, d), i.began && v("update"), g >= d && (n = 0, b(), i.remaining ? (e = a, v("loopComplete"), i.loopBegan = !1, i.direction === "alternate" && p()) : (i.paused = !0, i.completed || (i.completed = !0, v("loopComplete"), v("complete"), !i.passThrough && "Promise" in window && (o(), s(i)))));
  }
  return i.reset = function() {
    var g = i.direction;
    i.passThrough = !1, i.currentTime = 0, i.progress = 0, i.paused = !0, i.began = !1, i.loopBegan = !1, i.changeBegan = !1, i.completed = !1, i.changeCompleted = !1, i.reversePlayback = !1, i.reversed = g === "reverse", i.remaining = i.loop, t = i.children, u = t.length;
    for (var d = u; d--; )
      i.children[d].reset();
    (i.reversed && i.loop !== !0 || g === "alternate" && i.loop === 1) && i.remaining++, y(i.reversed ? i.duration : 0);
  }, i._onDocumentVisibility = l, i.set = function(g, d) {
    return Dr(g, d), i;
  }, i.tick = function(g) {
    a = g, e || (e = a), M((a + (n - e)) * m.speed);
  }, i.seek = function(g) {
    M(f(g));
  }, i.pause = function() {
    i.paused = !0, l();
  }, i.play = function() {
    i.paused && (i.completed && i.reset(), i.paused = !1, C.push(i), l(), Fr());
  }, i.reverse = function() {
    p(), i.completed = !i.reversed, l();
  }, i.restart = function() {
    i.reset(), i.play();
  }, i.remove = function(g) {
    var d = or(g);
    Ar(d, i);
  }, i.reset(), i.autoplay && i.play(), i;
}
function pr(r, e) {
  for (var n = e.length; n--; )
    rr(r, e[n].animatable.target) && e.splice(n, 1);
}
function Ar(r, e) {
  var n = e.animations, a = e.children;
  pr(r, n);
  for (var t = a.length; t--; ) {
    var u = a[t], o = u.animations;
    pr(r, o), !o.length && !u.children.length && a.splice(t, 1);
  }
  !n.length && !a.length && e.pause();
}
function se(r) {
  for (var e = or(r), n = C.length; n--; ) {
    var a = C[n];
    Ar(e, a);
  }
}
function fe(r, e) {
  e === void 0 && (e = {});
  var n = e.direction || "normal", a = e.easing ? X(e.easing) : null, t = e.grid, u = e.axis, o = e.from || 0, s = o === "first", i = o === "center", p = o === "last", f = c.arr(r), l = parseFloat(f ? r[0] : r), h = f ? parseFloat(r[1]) : 0, w = S(f ? r[1] : r) || 0, y = e.start || 0 + (f ? l : 0), v = [], b = 0;
  return function(M, g, d) {
    if (s && (o = 0), i && (o = (d - 1) / 2), p && (o = d - 1), !v.length) {
      for (var I = 0; I < d; I++) {
        if (!t)
          v.push(Math.abs(o - I));
        else {
          var D = i ? (t[0] - 1) / 2 : o % t[0], x = i ? (t[1] - 1) / 2 : Math.floor(o / t[0]), k = I % t[0], B = Math.floor(I / t[0]), F = D - k, T = x - B, A = Math.sqrt(F * F + T * T);
          u === "x" && (A = -F), u === "y" && (A = -T), v.push(A);
        }
        b = Math.max.apply(Math, v);
      }
      a && (v = v.map(function(P) {
        return a(P / b) * b;
      })), n === "reverse" && (v = v.map(function(P) {
        return u ? P < 0 ? P * -1 : -P : Math.abs(b - P);
      }));
    }
    var R = f ? (h - l) / b : l;
    return y + R * (Math.round(v[g] * 100) / 100) + w;
  };
}
function ce(r) {
  r === void 0 && (r = {});
  var e = m(r);
  return e.duration = 0, e.add = function(n, a) {
    var t = C.indexOf(e), u = e.children;
    t > -1 && C.splice(t, 1);
    function o(h) {
      h.passThrough = !0;
    }
    for (var s = 0; s < u.length; s++)
      o(u[s]);
    var i = W(n, K(G, r));
    i.targets = i.targets || r.targets;
    var p = e.duration;
    i.autoplay = !1, i.direction = e.direction, i.timelineOffset = c.und(a) ? p : ir(a, p), o(e), e.seek(i.timelineOffset);
    var f = m(i);
    o(f), u.push(f);
    var l = kr(u, r);
    return e.delay = l.delay, e.endDelay = l.endDelay, e.duration = l.duration, e.seek(0), e.reset(), e.autoplay && e.play(), e;
  }, e;
}
m.version = "3.2.1";
m.speed = 1;
m.suspendWhenDocumentHidden = !0;
m.running = C;
m.remove = se;
m.get = ar;
m.set = Dr;
m.convertPx = nr;
m.path = Gr;
m.setDashoffset = Kr;
m.stagger = fe;
m.timeline = ce;
m.easing = X;
m.penner = xr;
m.random = function(r, e) {
  return Math.floor(Math.random() * (e - r + 1)) + r;
};
function le(r, e, n) {
  if (typeof IntersectionObserver != "function")
    return e({ isIntersecting: !0, target: r }), () => {
    };
  let a = !1;
  const t = new IntersectionObserver((u) => {
    for (const o of u)
      if (o.target === r) {
        if (!o.isIntersecting) {
          a = !1;
          continue;
        }
        a || (a = !0, e(o), n.replay || t.unobserve(r));
      }
  }, {
    threshold: n.threshold
  });
  return t.observe(r), () => {
    if (typeof t.disconnect == "function") {
      t.disconnect();
      return;
    }
    typeof t.unobserve == "function" && t.unobserve(r);
  };
}
const ve = {
  duration: 800,
  delay: 0,
  easing: "easeOutQuad",
  threshold: 0.2,
  replay: !0
};
function Z(r) {
  return Number.parseFloat(String(r).replaceAll("_", "."));
}
function de(r, e, n) {
  return Math.min(Math.max(r, e), n);
}
function ge(r = []) {
  const e = { ...ve };
  for (let n = 0; n < r.length; n += 1) {
    const a = r[n];
    if (a === "duration") {
      const t = Z(r[n + 1]);
      Number.isFinite(t) && (e.duration = t);
      continue;
    }
    if (a === "delay") {
      const t = Z(r[n + 1]);
      Number.isFinite(t) && (e.delay = t);
      continue;
    }
    if (a === "threshold") {
      const t = Z(r[n + 1]);
      Number.isFinite(t) && (e.threshold = de(t, 0, 1));
      continue;
    }
    if (a === "once") {
      e.replay = !1;
      continue;
    }
    a === "repeat" && (e.replay = !0);
  }
  return e;
}
const Lr = {
  "fade-right": { translateX: [-100, 0], opacity: [0, 1] },
  "fade-left": { translateX: [100, 0], opacity: [0, 1] },
  "fade-up": { translateY: [50, 0], opacity: [0, 1] },
  "fade-down": { translateY: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] }
}, he = Object.keys(Lr);
function pe(r) {
  return Lr[r];
}
function ye(r, e) {
  e.opacity && (r.style.opacity = String(e.opacity[0]));
  const n = [];
  e.translateX && n.push(`translateX(${e.translateX[0]}px)`), e.translateY && n.push(`translateY(${e.translateY[0]}px)`), e.scale && n.push(`scale(${e.scale[0]})`), n.length > 0 && (r.style.transform = n.join(" "));
}
function me(r, { modifiers: e = [] }, { cleanup: n } = {}) {
  const a = e.filter((s) => he.includes(s));
  if (a.length !== 1)
    return;
  const t = pe(a[0]);
  if (!t)
    return;
  const u = ge(e);
  ye(r, t);
  const o = le(r, () => {
    m({
      targets: r,
      ...t,
      duration: u.duration,
      delay: u.delay,
      easing: u.easing
    });
  }, u);
  typeof n == "function" && n(o);
}
function be(r) {
  r.directive("anime", me);
}
export {
  be as default
};
