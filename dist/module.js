var br = {
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
}, Nr = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d"], R = {
  CSS: {},
  springs: {}
};
function C(r, e, n) {
  return Math.min(Math.max(r, e), n);
}
function N(r, e) {
  return r.indexOf(e) > -1;
}
function Q(r, e) {
  return r.apply(null, e);
}
var l = {
  arr: function(r) {
    return Array.isArray(r);
  },
  obj: function(r) {
    return N(Object.prototype.toString.call(r), "Object");
  },
  pth: function(r) {
    return l.obj(r) && r.hasOwnProperty("totalLength");
  },
  svg: function(r) {
    return r instanceof SVGElement;
  },
  inp: function(r) {
    return r instanceof HTMLInputElement;
  },
  dom: function(r) {
    return r.nodeType || l.svg(r);
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
    return l.und(r) || r === null;
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
    return l.hex(r) || l.rgb(r) || l.hsl(r);
  },
  key: function(r) {
    return !br.hasOwnProperty(r) && !G.hasOwnProperty(r) && r !== "targets" && r !== "keyframes";
  }
};
function Mr(r) {
  var e = /\(([^)]+)\)/.exec(r);
  return e ? e[1].split(",").map(function(n) {
    return parseFloat(n);
  }) : [];
}
function xr(r, e) {
  var n = Mr(r), a = C(l.und(n[0]) ? 1 : n[0], 0.1, 100), t = C(l.und(n[1]) ? 100 : n[1], 0.1, 100), u = C(l.und(n[2]) ? 10 : n[2], 0.1, 100), o = C(l.und(n[3]) ? 0 : n[3], 0.1, 100), s = Math.sqrt(t / a), i = u / (2 * Math.sqrt(t * a)), d = i < 1 ? s * Math.sqrt(1 - i * i) : 0, f = 1, c = i < 1 ? (i * s + -o) / d : -o + s;
  function v(y) {
    var g = e ? e * y / 1e3 : y;
    return i < 1 ? g = Math.exp(-g * i * s) * (f * Math.cos(d * g) + c * Math.sin(d * g)) : g = (f + c * g) * Math.exp(-g * s), y === 0 || y === 1 ? y : 1 - g;
  }
  function w() {
    var y = R.springs[r];
    if (y)
      return y;
    for (var g = 1 / 6, b = 0, x = 0; ; )
      if (b += g, v(b) === 1) {
        if (x++, x >= 16)
          break;
      } else
        x = 0;
    var p = b * g * 1e3;
    return R.springs[r] = p, p;
  }
  return e ? v : w;
}
function zr(r) {
  return r === void 0 && (r = 10), function(e) {
    return Math.ceil(C(e, 1e-6, 1) * r) * (1 / r);
  };
}
var Rr = (function() {
  var r = 11, e = 1 / (r - 1);
  function n(f, c) {
    return 1 - 3 * c + 3 * f;
  }
  function a(f, c) {
    return 3 * c - 6 * f;
  }
  function t(f) {
    return 3 * f;
  }
  function u(f, c, v) {
    return ((n(c, v) * f + a(c, v)) * f + t(c)) * f;
  }
  function o(f, c, v) {
    return 3 * n(c, v) * f * f + 2 * a(c, v) * f + t(c);
  }
  function s(f, c, v, w, y) {
    var g, b, x = 0;
    do
      b = c + (v - c) / 2, g = u(b, w, y) - f, g > 0 ? v = b : c = b;
    while (Math.abs(g) > 1e-7 && ++x < 10);
    return b;
  }
  function i(f, c, v, w) {
    for (var y = 0; y < 4; ++y) {
      var g = o(c, v, w);
      if (g === 0)
        return c;
      var b = u(c, v, w) - f;
      c -= b / g;
    }
    return c;
  }
  function d(f, c, v, w) {
    if (!(0 <= f && f <= 1 && 0 <= v && v <= 1))
      return;
    var y = new Float32Array(r);
    if (f !== c || v !== w)
      for (var g = 0; g < r; ++g)
        y[g] = u(g * e, f, v);
    function b(x) {
      for (var p = 0, h = 1, I = r - 1; h !== I && y[h] <= x; ++h)
        p += e;
      --h;
      var D = (x - y[h]) / (y[h + 1] - y[h]), M = p + D * e, F = o(M, f, v);
      return F >= 1e-3 ? i(x, M, f, v) : F === 0 ? M : s(x, p, p + e, f, v);
    }
    return function(x) {
      return f === c && v === w || x === 0 || x === 1 ? x : u(b(x), c, w);
    };
  }
  return d;
})(), Tr = (function() {
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
      var u = C(a, 1, 10), o = C(t, 0.1, 2);
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
  if (l.fnc(r))
    return r;
  var n = r.split("(")[0], a = Tr[n], t = Mr(r);
  switch (n) {
    case "spring":
      return xr(r, e);
    case "cubicBezier":
      return Q(Rr, t);
    case "steps":
      return Q(zr, t);
    default:
      return Q(a, t);
  }
}
function wr(r) {
  try {
    var e = document.querySelectorAll(r);
    return e;
  } catch (n) {
    return;
  }
}
function H(r, e) {
  for (var n = r.length, a = arguments.length >= 2 ? arguments[1] : void 0, t = [], u = 0; u < n; u++)
    if (u in r) {
      var o = r[u];
      e.call(a, o, u, r) && t.push(o);
    }
  return t;
}
function U(r) {
  return r.reduce(function(e, n) {
    return e.concat(l.arr(n) ? U(n) : n);
  }, []);
}
function vr(r) {
  return l.arr(r) ? r : (l.str(r) && (r = wr(r) || r), r instanceof NodeList || r instanceof HTMLCollection ? [].slice.call(r) : [r]);
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
function Y(r, e) {
  var n = er(r);
  for (var a in e)
    n[a] = l.und(r[a]) ? e[a] : r[a];
  return n;
}
function Hr(r) {
  var e = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(r);
  return e ? "rgba(" + e[1] + ",1)" : r;
}
function Ur(r) {
  var e = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, n = r.replace(e, function(s, i, d, f) {
    return i + i + d + d + f + f;
  }), a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n), t = parseInt(a[1], 16), u = parseInt(a[2], 16), o = parseInt(a[3], 16);
  return "rgba(" + t + "," + u + "," + o + ",1)";
}
function Yr(r) {
  var e = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(r) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(r), n = parseInt(e[1], 10) / 360, a = parseInt(e[2], 10) / 100, t = parseInt(e[3], 10) / 100, u = e[4] || 1;
  function o(v, w, y) {
    return y < 0 && (y += 1), y > 1 && (y -= 1), y < 1 / 6 ? v + (w - v) * 6 * y : y < 1 / 2 ? w : y < 2 / 3 ? v + (w - v) * (2 / 3 - y) * 6 : v;
  }
  var s, i, d;
  if (a == 0)
    s = i = d = t;
  else {
    var f = t < 0.5 ? t * (1 + a) : t + a - t * a, c = 2 * t - f;
    s = o(c, f, n + 1 / 3), i = o(c, f, n), d = o(c, f, n - 1 / 3);
  }
  return "rgba(" + s * 255 + "," + i * 255 + "," + d * 255 + "," + u + ")";
}
function Wr(r) {
  if (l.rgb(r))
    return Hr(r);
  if (l.hex(r))
    return Ur(r);
  if (l.hsl(r))
    return Yr(r);
}
function O(r) {
  var e = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(r);
  if (e)
    return e[1];
}
function _r(r) {
  if (N(r, "translate") || r === "perspective")
    return "px";
  if (N(r, "rotate") || N(r, "skew"))
    return "deg";
}
function J(r, e) {
  return l.fnc(r) ? r(e.target, e.id, e.total) : r;
}
function E(r, e) {
  return r.getAttribute(e);
}
function nr(r, e, n) {
  var a = O(e);
  if (rr([n, "deg", "rad", "turn"], a))
    return e;
  var t = R.CSS[e + n];
  if (!l.und(t))
    return t;
  var u = 100, o = document.createElement(r.tagName), s = r.parentNode && r.parentNode !== document ? r.parentNode : document.body;
  s.appendChild(o), o.style.position = "absolute", o.style.width = u + n;
  var i = u / o.offsetWidth;
  s.removeChild(o);
  var d = i * parseFloat(e);
  return R.CSS[e + n] = d, d;
}
function Ir(r, e, n) {
  if (e in r.style) {
    var a = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), t = r.style[e] || getComputedStyle(r).getPropertyValue(a) || "0";
    return n ? nr(r, t, n) : t;
  }
}
function tr(r, e) {
  if (l.dom(r) && !l.inp(r) && (!l.nil(E(r, e)) || l.svg(r) && r[e]))
    return "attribute";
  if (l.dom(r) && rr(Nr, e))
    return "transform";
  if (l.dom(r) && e !== "transform" && Ir(r, e))
    return "css";
  if (r[e] != null)
    return "object";
}
function Pr(r) {
  if (l.dom(r)) {
    for (var e = r.style.transform || "", n = /(\w+)\(([^)]*)\)/g, a = /* @__PURE__ */ new Map(), t; t = n.exec(e); )
      a.set(t[1], t[2]);
    return a;
  }
}
function qr(r, e, n, a) {
  var t = N(e, "scale") ? 1 : 0 + _r(e), u = Pr(r).get(e) || t;
  return n && (n.transforms.list.set(e, u), n.transforms.last = e), a ? nr(r, u, a) : u;
}
function ar(r, e, n, a) {
  switch (tr(r, e)) {
    case "transform":
      return qr(r, e, a, n);
    case "css":
      return Ir(r, e, n);
    case "attribute":
      return E(r, e);
    default:
      return r[e] || 0;
  }
}
function ir(r, e) {
  var n = /^(\*=|\+=|-=)/.exec(r);
  if (!n)
    return r;
  var a = O(r) || 0, t = parseFloat(e), u = parseFloat(r.replace(n[0], ""));
  switch (n[0][0]) {
    case "+":
      return t + u + a;
    case "-":
      return t - u + a;
    case "*":
      return t * u + a;
  }
}
function Sr(r, e) {
  if (l.col(r))
    return Wr(r);
  if (/\s/g.test(r))
    return r;
  var n = O(r), a = n ? r.substr(0, r.length - n.length) : r;
  return e ? a + e : a;
}
function ur(r, e) {
  return Math.sqrt(Math.pow(e.x - r.x, 2) + Math.pow(e.y - r.y, 2));
}
function Qr(r) {
  return Math.PI * 2 * E(r, "r");
}
function Zr(r) {
  return E(r, "width") * 2 + E(r, "height") * 2;
}
function Kr(r) {
  return ur(
    { x: E(r, "x1"), y: E(r, "y1") },
    { x: E(r, "x2"), y: E(r, "y2") }
  );
}
function Cr(r) {
  for (var e = r.points, n = 0, a, t = 0; t < e.numberOfItems; t++) {
    var u = e.getItem(t);
    t > 0 && (n += ur(a, u)), a = u;
  }
  return n;
}
function Jr(r) {
  var e = r.points;
  return Cr(r) + ur(e.getItem(e.numberOfItems - 1), e.getItem(0));
}
function Er(r) {
  if (r.getTotalLength)
    return r.getTotalLength();
  switch (r.tagName.toLowerCase()) {
    case "circle":
      return Qr(r);
    case "rect":
      return Zr(r);
    case "line":
      return Kr(r);
    case "polyline":
      return Cr(r);
    case "polygon":
      return Jr(r);
  }
}
function Gr(r) {
  var e = Er(r);
  return r.setAttribute("stroke-dasharray", e), e;
}
function Xr(r) {
  for (var e = r.parentNode; l.svg(e) && l.svg(e.parentNode); )
    e = e.parentNode;
  return e;
}
function Or(r, e) {
  var n = e || {}, a = n.el || Xr(r), t = a.getBoundingClientRect(), u = E(a, "viewBox"), o = t.width, s = t.height, i = n.viewBox || (u ? u.split(" ") : [0, 0, o, s]);
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
function re(r, e) {
  var n = l.str(r) ? wr(r)[0] : r, a = e || 100;
  return function(t) {
    return {
      property: t,
      el: n,
      svg: Or(n),
      totalLength: Er(n) * (a / 100)
    };
  };
}
function ee(r, e, n) {
  function a(f) {
    f === void 0 && (f = 0);
    var c = e + f >= 1 ? e + f : 0;
    return r.el.getPointAtLength(c);
  }
  var t = Or(r.el, r.svg), u = a(), o = a(-1), s = a(1), i = n ? 1 : t.w / t.vW, d = n ? 1 : t.h / t.vH;
  switch (r.property) {
    case "x":
      return (u.x - t.x) * i;
    case "y":
      return (u.y - t.y) * d;
    case "angle":
      return Math.atan2(s.y - o.y, s.x - o.x) * 180 / Math.PI;
  }
}
function dr(r, e) {
  var n = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, a = Sr(l.pth(r) ? r.totalLength : r, e) + "";
  return {
    original: a,
    numbers: a.match(n) ? a.match(n).map(Number) : [0],
    strings: l.str(r) || e ? a.split(n) : []
  };
}
function or(r) {
  var e = r ? U(l.arr(r) ? r.map(vr) : vr(r)) : [];
  return H(e, function(n, a, t) {
    return t.indexOf(n) === a;
  });
}
function Dr(r) {
  var e = or(r);
  return e.map(function(n, a) {
    return { target: n, id: a, total: e.length, transforms: { list: Pr(n) } };
  });
}
function ne(r, e) {
  var n = er(e);
  if (/^spring/.test(n.easing) && (n.duration = xr(n.easing)), l.arr(r)) {
    var a = r.length, t = a === 2 && !l.obj(r[0]);
    t ? r = { value: r } : l.fnc(e.duration) || (n.duration = e.duration / a);
  }
  var u = l.arr(r) ? r : [r];
  return u.map(function(o, s) {
    var i = l.obj(o) && !l.pth(o) ? o : { value: o };
    return l.und(i.delay) && (i.delay = s ? 0 : e.delay), l.und(i.endDelay) && (i.endDelay = s === u.length - 1 ? e.endDelay : 0), i;
  }).map(function(o) {
    return Y(o, n);
  });
}
function te(r) {
  for (var e = H(U(r.map(function(u) {
    return Object.keys(u);
  })), function(u) {
    return l.key(u);
  }).reduce(function(u, o) {
    return u.indexOf(o) < 0 && u.push(o), u;
  }, []), n = {}, a = function(u) {
    var o = e[u];
    n[o] = r.map(function(s) {
      var i = {};
      for (var d in s)
        l.key(d) ? d == o && (i.value = s[d]) : i[d] = s[d];
      return i;
    });
  }, t = 0; t < e.length; t++) a(t);
  return n;
}
function ae(r, e) {
  var n = [], a = e.keyframes;
  a && (e = Y(te(a), e));
  for (var t in e)
    l.key(t) && n.push({
      name: t,
      tweens: ne(e[t], r)
    });
  return n;
}
function ie(r, e) {
  var n = {};
  for (var a in r) {
    var t = J(r[a], e);
    l.arr(t) && (t = t.map(function(u) {
      return J(u, e);
    }), t.length === 1 && (t = t[0])), n[a] = t;
  }
  return n.duration = parseFloat(n.duration), n.delay = parseFloat(n.delay), n;
}
function ue(r, e) {
  var n;
  return r.tweens.map(function(a) {
    var t = ie(a, e), u = t.value, o = l.arr(u) ? u[1] : u, s = O(o), i = ar(e.target, r.name, s, e), d = n ? n.to.original : i, f = l.arr(u) ? u[0] : d, c = O(f) || O(i), v = s || c;
    return l.und(o) && (o = d), t.from = dr(f, v), t.to = dr(ir(o, f), v), t.start = n ? n.end : 0, t.end = t.start + t.delay + t.duration + t.endDelay, t.easing = X(t.easing, t.duration), t.isPath = l.pth(u), t.isPathTargetInsideSVG = t.isPath && l.svg(e.target), t.isColor = l.col(t.from.original), t.isColor && (t.round = 1), n = t, t;
  });
}
var Fr = {
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
function kr(r, e) {
  var n = Dr(r);
  n.forEach(function(a) {
    for (var t in e) {
      var u = J(e[t], a), o = a.target, s = O(u), i = ar(o, t, s, a), d = s || O(i), f = ir(Sr(u, d), i), c = tr(o, t);
      Fr[c](o, t, f, a.transforms, !0);
    }
  });
}
function oe(r, e) {
  var n = tr(r.target, e.name);
  if (n) {
    var a = ue(e, r), t = a[a.length - 1];
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
function se(r, e) {
  return H(U(r.map(function(n) {
    return e.map(function(a) {
      return oe(n, a);
    });
  })), function(n) {
    return !l.und(n);
  });
}
function Ar(r, e) {
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
function fe(r) {
  var e = K(br, r), n = K(G, r), a = ae(n, r), t = Dr(r.targets), u = se(t, a), o = Ar(u, n), s = gr;
  return gr++, Y(e, {
    id: s,
    children: [],
    animatables: t,
    animations: u,
    duration: o.duration,
    delay: o.delay,
    endDelay: o.endDelay
  });
}
var S = [], Lr = (function() {
  var r;
  function e() {
    !r && (!hr() || !m.suspendWhenDocumentHidden) && S.length > 0 && (r = requestAnimationFrame(n));
  }
  function n(t) {
    for (var u = S.length, o = 0; o < u; ) {
      var s = S[o];
      s.paused ? (S.splice(o, 1), u--) : (s.tick(t), o++);
    }
    r = o > 0 ? requestAnimationFrame(n) : void 0;
  }
  function a() {
    m.suspendWhenDocumentHidden && (hr() ? r = cancelAnimationFrame(r) : (S.forEach(
      function(t) {
        return t._onDocumentVisibility();
      }
    ), Lr()));
  }
  return typeof document != "undefined" && document.addEventListener("visibilitychange", a), e;
})();
function hr() {
  return !!document && document.hidden;
}
function m(r) {
  r === void 0 && (r = {});
  var e = 0, n = 0, a = 0, t, u = 0, o = null;
  function s(p) {
    var h = window.Promise && new Promise(function(I) {
      return o = I;
    });
    return p.finished = h, h;
  }
  var i = fe(r);
  s(i);
  function d() {
    var p = i.direction;
    p !== "alternate" && (i.direction = p !== "normal" ? "normal" : "reverse"), i.reversed = !i.reversed, t.forEach(function(h) {
      return h.reversed = i.reversed;
    });
  }
  function f(p) {
    return i.reversed ? i.duration - p : p;
  }
  function c() {
    e = 0, n = f(i.currentTime) * (1 / m.speed);
  }
  function v(p, h) {
    h && h.seek(p - h.timelineOffset);
  }
  function w(p) {
    if (i.reversePlayback)
      for (var I = u; I--; )
        v(p, t[I]);
    else
      for (var h = 0; h < u; h++)
        v(p, t[h]);
  }
  function y(p) {
    for (var h = 0, I = i.animations, D = I.length; h < D; ) {
      var M = I[h], F = M.animatable, B = M.tweens, k = B.length - 1, T = B[k];
      k && (T = H(B, function($r) {
        return p < $r.end;
      })[0] || T);
      for (var A = C(p - T.start - T.delay, 0, T.duration) / T.duration, z = isNaN(A) ? 1 : T.easing(A), P = T.to.strings, W = T.round, _ = [], jr = T.to.numbers.length, L = void 0, V = 0; V < jr; V++) {
        var j = void 0, sr = T.to.numbers[V], fr = T.from.numbers[V] || 0;
        T.isPath ? j = ee(T.value, z * sr, T.isPathTargetInsideSVG) : j = fr + z * (sr - fr), W && (T.isColor && V > 2 || (j = Math.round(j * W) / W)), _.push(j);
      }
      var cr = P.length;
      if (!cr)
        L = _[0];
      else {
        L = P[0];
        for (var $ = 0; $ < cr; $++) {
          P[$];
          var lr = P[$ + 1], q = _[$];
          isNaN(q) || (lr ? L += q + lr : L += q + " ");
        }
      }
      Fr[M.type](F.target, M.property, L, F.transforms), M.currentValue = L, h++;
    }
  }
  function g(p) {
    i[p] && !i.passThrough && i[p](i);
  }
  function b() {
    i.remaining && i.remaining !== !0 && i.remaining--;
  }
  function x(p) {
    var h = i.duration, I = i.delay, D = h - i.endDelay, M = f(p);
    i.progress = C(M / h * 100, 0, 100), i.reversePlayback = M < i.currentTime, t && w(M), !i.began && i.currentTime > 0 && (i.began = !0, g("begin")), !i.loopBegan && i.currentTime > 0 && (i.loopBegan = !0, g("loopBegin")), M <= I && i.currentTime !== 0 && y(0), (M >= D && i.currentTime !== h || !h) && y(h), M > I && M < D ? (i.changeBegan || (i.changeBegan = !0, i.changeCompleted = !1, g("changeBegin")), g("change"), y(M)) : i.changeBegan && (i.changeCompleted = !0, i.changeBegan = !1, g("changeComplete")), i.currentTime = C(M, 0, h), i.began && g("update"), p >= h && (n = 0, b(), i.remaining ? (e = a, g("loopComplete"), i.loopBegan = !1, i.direction === "alternate" && d()) : (i.paused = !0, i.completed || (i.completed = !0, g("loopComplete"), g("complete"), !i.passThrough && "Promise" in window && (o(), s(i)))));
  }
  return i.reset = function() {
    var p = i.direction;
    i.passThrough = !1, i.currentTime = 0, i.progress = 0, i.paused = !0, i.began = !1, i.loopBegan = !1, i.changeBegan = !1, i.completed = !1, i.changeCompleted = !1, i.reversePlayback = !1, i.reversed = p === "reverse", i.remaining = i.loop, t = i.children, u = t.length;
    for (var h = u; h--; )
      i.children[h].reset();
    (i.reversed && i.loop !== !0 || p === "alternate" && i.loop === 1) && i.remaining++, y(i.reversed ? i.duration : 0);
  }, i._onDocumentVisibility = c, i.set = function(p, h) {
    return kr(p, h), i;
  }, i.tick = function(p) {
    a = p, e || (e = a), x((a + (n - e)) * m.speed);
  }, i.seek = function(p) {
    x(f(p));
  }, i.pause = function() {
    i.paused = !0, c();
  }, i.play = function() {
    i.paused && (i.completed && i.reset(), i.paused = !1, S.push(i), c(), Lr());
  }, i.reverse = function() {
    d(), i.completed = !i.reversed, c();
  }, i.restart = function() {
    i.reset(), i.play();
  }, i.remove = function(p) {
    var h = or(p);
    Br(h, i);
  }, i.reset(), i.autoplay && i.play(), i;
}
function pr(r, e) {
  for (var n = e.length; n--; )
    rr(r, e[n].animatable.target) && e.splice(n, 1);
}
function Br(r, e) {
  var n = e.animations, a = e.children;
  pr(r, n);
  for (var t = a.length; t--; ) {
    var u = a[t], o = u.animations;
    pr(r, o), !o.length && !u.children.length && a.splice(t, 1);
  }
  !n.length && !a.length && e.pause();
}
function ce(r) {
  for (var e = or(r), n = S.length; n--; ) {
    var a = S[n];
    Br(e, a);
  }
}
function le(r, e) {
  e === void 0 && (e = {});
  var n = e.direction || "normal", a = e.easing ? X(e.easing) : null, t = e.grid, u = e.axis, o = e.from || 0, s = o === "first", i = o === "center", d = o === "last", f = l.arr(r), c = parseFloat(f ? r[0] : r), v = f ? parseFloat(r[1]) : 0, w = O(f ? r[1] : r) || 0, y = e.start || 0 + (f ? c : 0), g = [], b = 0;
  return function(x, p, h) {
    if (s && (o = 0), i && (o = (h - 1) / 2), d && (o = h - 1), !g.length) {
      for (var I = 0; I < h; I++) {
        if (!t)
          g.push(Math.abs(o - I));
        else {
          var D = i ? (t[0] - 1) / 2 : o % t[0], M = i ? (t[1] - 1) / 2 : Math.floor(o / t[0]), F = I % t[0], B = Math.floor(I / t[0]), k = D - F, T = M - B, A = Math.sqrt(k * k + T * T);
          u === "x" && (A = -k), u === "y" && (A = -T), g.push(A);
        }
        b = Math.max.apply(Math, g);
      }
      a && (g = g.map(function(P) {
        return a(P / b) * b;
      })), n === "reverse" && (g = g.map(function(P) {
        return u ? P < 0 ? P * -1 : -P : Math.abs(b - P);
      }));
    }
    var z = f ? (v - c) / b : c;
    return y + z * (Math.round(g[p] * 100) / 100) + w;
  };
}
function ve(r) {
  r === void 0 && (r = {});
  var e = m(r);
  return e.duration = 0, e.add = function(n, a) {
    var t = S.indexOf(e), u = e.children;
    t > -1 && S.splice(t, 1);
    function o(v) {
      v.passThrough = !0;
    }
    for (var s = 0; s < u.length; s++)
      o(u[s]);
    var i = Y(n, K(G, r));
    i.targets = i.targets || r.targets;
    var d = e.duration;
    i.autoplay = !1, i.direction = e.direction, i.timelineOffset = l.und(a) ? d : ir(a, d), o(e), e.seek(i.timelineOffset);
    var f = m(i);
    o(f), u.push(f);
    var c = Ar(u, r);
    return e.delay = c.delay, e.endDelay = c.endDelay, e.duration = c.duration, e.seek(0), e.reset(), e.autoplay && e.play(), e;
  }, e;
}
m.version = "3.2.1";
m.speed = 1;
m.suspendWhenDocumentHidden = !0;
m.running = S;
m.remove = ce;
m.get = ar;
m.set = kr;
m.convertPx = nr;
m.path = re;
m.setDashoffset = Gr;
m.stagger = le;
m.timeline = ve;
m.easing = X;
m.penner = Tr;
m.random = function(r, e) {
  return Math.floor(Math.random() * (e - r + 1)) + r;
};
function de(r) {
  return typeof r == "function" ? {
    enter: r,
    leave: void 0
  } : {
    enter: r == null ? void 0 : r.enter,
    leave: r == null ? void 0 : r.leave
  };
}
function yr(r, e, n) {
  var d, f;
  const { enter: a, leave: t } = de(e), u = (d = n == null ? void 0 : n.enterMargin) != null ? d : "0px", o = (f = n == null ? void 0 : n.leaveMargin) != null ? f : "0px";
  if (typeof IntersectionObserver != "function")
    return typeof a == "function" && a({ isIntersecting: !0, target: r }), () => {
    };
  let s = !1;
  const i = new IntersectionObserver((c) => {
    for (const v of c)
      if (v.target === r) {
        if (!v.isIntersecting) {
          s && typeof t == "function" && t(v), s = !1;
          continue;
        }
        s || (s = !0, typeof a == "function" && a(v), n.replay || i.unobserve(r));
      }
  }, {
    threshold: n.threshold,
    rootMargin: `${o} 0px ${u} 0px`
  });
  return i.observe(r), () => {
    if (typeof i.disconnect == "function") {
      i.disconnect();
      return;
    }
    typeof i.unobserve == "function" && i.unobserve(r);
  };
}
const ge = {
  duration: 800,
  delay: 0,
  easing: "easeOutQuad",
  threshold: 0.2,
  replay: !0,
  enterMargin: "0px",
  leaveMargin: "0px"
};
function Z(r) {
  return Number.parseFloat(String(r).replaceAll("_", "."));
}
function he(r, e, n) {
  return Math.min(Math.max(r, e), n);
}
function mr(r) {
  const e = String(r).trim().replaceAll("_", ".");
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
function pe(r = []) {
  const e = { ...ge };
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
      Number.isFinite(t) && (e.threshold = he(t, 0, 1));
      continue;
    }
    if (a === "once") {
      e.replay = !1;
      continue;
    }
    if (a === "repeat") {
      e.replay = !0;
      continue;
    }
    if (a === "enter" || a === "start") {
      const t = mr(r[n + 1]);
      t !== null && (e.enterMargin = t);
      continue;
    }
    if (a === "leave" || a === "end") {
      const t = mr(r[n + 1]);
      t !== null && (e.leaveMargin = t);
    }
  }
  return e;
}
const Vr = {
  fade: { opacity: [0, 1] },
  "fade-in-out": { opacity: [0, 1] },
  "fade-right": { translateX: [-100, 0], opacity: [0, 1] },
  "fade-left": { translateX: [100, 0], opacity: [0, 1] },
  "fade-up": { translateY: [50, 0], opacity: [0, 1] },
  "fade-down": { translateY: [-50, 0], opacity: [0, 1] },
  "scale-in": { scale: [0.9, 1], opacity: [0, 1] }
}, ye = Object.keys(Vr);
function me(r) {
  return Vr[r];
}
function be(r, e) {
  e.opacity && (r.style.opacity = String(e.opacity[0]));
  const n = [];
  e.translateX && n.push(`translateX(${e.translateX[0]}px)`), e.translateY && n.push(`translateY(${e.translateY[0]}px)`), e.scale && n.push(`scale(${e.scale[0]})`), n.length > 0 && (r.style.transform = n.join(" "));
}
function Me(r, e) {
  e.opacity && (r.style.opacity = String(e.opacity[e.opacity.length - 1]));
  const n = [];
  e.translateX && n.push(`translateX(${e.translateX[e.translateX.length - 1]}px)`), e.translateY && n.push(`translateY(${e.translateY[e.translateY.length - 1]}px)`), e.scale && n.push(`scale(${e.scale[e.scale.length - 1]})`), r.style.transform = n.join(" ");
}
function xe() {
  return typeof globalThis.matchMedia != "function" ? !1 : globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Te(r, { modifiers: e = [] }, { cleanup: n } = {}) {
  const a = e.filter((d) => ye.includes(d));
  if (a.length !== 1)
    return;
  const t = me(a[0]);
  if (!t)
    return;
  const u = pe(e);
  if (xe()) {
    Me(r, t);
    return;
  }
  be(r, t);
  let o;
  const s = (d) => {
    var f, c, v;
    o && typeof o.cancel == "function" && o.cancel(), o = m({
      targets: r,
      ...d,
      duration: (f = d.duration) != null ? f : u.duration,
      delay: (c = d.delay) != null ? c : u.delay,
      easing: (v = d.easing) != null ? v : u.easing
    });
  }, i = a[0] === "fade-in-out" ? yr(r, {
    enter: () => s({ opacity: [0, 1] }),
    leave: () => s({ opacity: [1, 0], delay: 0 })
  }, u) : yr(r, () => {
    s(t);
  }, u);
  typeof n == "function" && n(() => {
    o && typeof o.cancel == "function" && o.cancel(), i();
  });
}
function we(r) {
  r.directive("anime", Te);
}
export {
  we as default
};
