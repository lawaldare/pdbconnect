import t, {
  withCanvas as e,
  withManager as n,
  withZoom as i,
  withResizable as r,
  withMargin as s,
  withPosition as o,
  withDimensions as a,
  withHighlight as h,
  Refresher as l,
  BinarySearch as u,
  createEvent as c,
  customElementOnce as f,
} from '@nightingale-elements/nightingale-new-core-adam';
function p(t, e, n, i) {
  var r,
    s = arguments.length,
    o = s < 3 ? e : null === i ? (i = Object.getOwnPropertyDescriptor(e, n)) : i;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) o = Reflect.decorate(t, e, n, i);
  else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (o = (s < 3 ? r(o) : s > 3 ? r(e, n, o) : r(e, n)) || o);
  return s > 3 && o && Object.defineProperty(e, n, o), o;
}
'function' == typeof SuppressedError && SuppressedError;
var d = { value: () => {} };
function g() {
  for (var t, e = 0, n = arguments.length, i = {}; e < n; ++e) {
    if (!(t = arguments[e] + '') || t in i || /[\s.]/.test(t)) throw new Error('illegal type: ' + t);
    i[t] = [];
  }
  return new _(i);
}
function _(t) {
  this._ = t;
}
function v(t, e) {
  for (var n, i = 0, r = t.length; i < r; ++i) if ((n = t[i]).name === e) return n.value;
}
function m(t, e, n) {
  for (var i = 0, r = t.length; i < r; ++i)
    if (t[i].name === e) {
      (t[i] = d), (t = t.slice(0, i).concat(t.slice(i + 1)));
      break;
    }
  return null != n && t.push({ name: e, value: n }), t;
}
_.prototype = g.prototype = {
  constructor: _,
  on: function (t, e) {
    var n,
      i,
      r = this._,
      s =
        ((i = r),
        (t + '')
          .trim()
          .split(/^|\s+/)
          .map(function (t) {
            var e = '',
              n = t.indexOf('.');
            if ((n >= 0 && ((e = t.slice(n + 1)), (t = t.slice(0, n))), t && !i.hasOwnProperty(t))) throw new Error('unknown type: ' + t);
            return { type: t, name: e };
          })),
      o = -1,
      a = s.length;
    if (!(arguments.length < 2)) {
      if (null != e && 'function' != typeof e) throw new Error('invalid callback: ' + e);
      for (; ++o < a; )
        if ((n = (t = s[o]).type)) r[n] = m(r[n], t.name, e);
        else if (null == e) for (n in r) r[n] = m(r[n], t.name, null);
      return this;
    }
    for (; ++o < a; ) if ((n = (t = s[o]).type) && (n = v(r[n], t.name))) return n;
  },
  copy: function () {
    var t = {},
      e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new _(t);
  },
  call: function (t, e) {
    if ((n = arguments.length - 2) > 0) for (var n, i, r = new Array(n), s = 0; s < n; ++s) r[s] = arguments[s + 2];
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (s = 0, n = (i = this._[t]).length; s < n; ++s) i[s].value.apply(e, r);
  },
  apply: function (t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (var i = this._[t], r = 0, s = i.length; r < s; ++r) i[r].value.apply(e, n);
  },
};
var y = 'http://www.w3.org/1999/xhtml',
  $ = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: y,
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
  };
function w(t) {
  var e = (t += ''),
    n = e.indexOf(':');
  return n >= 0 && 'xmlns' !== (e = t.slice(0, n)) && (t = t.slice(n + 1)), $.hasOwnProperty(e) ? { space: $[e], local: t } : t;
}
function A(t) {
  return function () {
    var e = this.ownerDocument,
      n = this.namespaceURI;
    return n === y && e.documentElement.namespaceURI === y ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function b(t) {
  return function () {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function x(t) {
  var e = w(t);
  return (e.local ? b : A)(e);
}
function E() {}
function S(t) {
  return null == t
    ? E
    : function () {
        return this.querySelector(t);
      };
}
function C() {
  return [];
}
function P(t) {
  return null == t
    ? C
    : function () {
        return this.querySelectorAll(t);
      };
}
function N(t) {
  return function () {
    return (function (t) {
      return null == t ? [] : Array.isArray(t) ? t : Array.from(t);
    })(t.apply(this, arguments));
  };
}
function k(t) {
  return function () {
    return this.matches(t);
  };
}
function M(t) {
  return function (e) {
    return e.matches(t);
  };
}
var T = Array.prototype.find;
function U() {
  return this.firstElementChild;
}
var O = Array.prototype.filter;
function H() {
  return Array.from(this.children);
}
function R(t) {
  return new Array(t.length);
}
function z(t, e) {
  (this.ownerDocument = t.ownerDocument), (this.namespaceURI = t.namespaceURI), (this._next = null), (this._parent = t), (this.__data__ = e);
}
function j(t, e, n, i, r, s) {
  for (var o, a = 0, h = e.length, l = s.length; a < l; ++a) (o = e[a]) ? ((o.__data__ = s[a]), (i[a] = o)) : (n[a] = new z(t, s[a]));
  for (; a < h; ++a) (o = e[a]) && (r[a] = o);
}
function L(t, e, n, i, r, s, o) {
  var a,
    h,
    l,
    u = new Map(),
    c = e.length,
    f = s.length,
    p = new Array(c);
  for (a = 0; a < c; ++a) (h = e[a]) && ((p[a] = l = o.call(h, h.__data__, a, e) + ''), u.has(l) ? (r[a] = h) : u.set(l, h));
  for (a = 0; a < f; ++a) (l = o.call(t, s[a], a, s) + ''), (h = u.get(l)) ? ((i[a] = h), (h.__data__ = s[a]), u.delete(l)) : (n[a] = new z(t, s[a]));
  for (a = 0; a < c; ++a) (h = e[a]) && u.get(p[a]) === h && (r[a] = h);
}
function q(t) {
  return t.__data__;
}
function D(t) {
  return 'object' == typeof t && 'length' in t ? t : Array.from(t);
}
function I(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function B(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function X(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function W(t, e) {
  return function () {
    this.setAttribute(t, e);
  };
}
function F(t, e) {
  return function () {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function V(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function Y(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function K(t) {
  return (t.ownerDocument && t.ownerDocument.defaultView) || (t.document && t) || t.defaultView;
}
function G(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
function J(t, e, n) {
  return function () {
    this.style.setProperty(t, e, n);
  };
}
function Z(t, e, n) {
  return function () {
    var i = e.apply(this, arguments);
    null == i ? this.style.removeProperty(t) : this.style.setProperty(t, i, n);
  };
}
function Q(t, e) {
  return t.style.getPropertyValue(e) || K(t).getComputedStyle(t, null).getPropertyValue(e);
}
function tt(t) {
  return function () {
    delete this[t];
  };
}
function et(t, e) {
  return function () {
    this[t] = e;
  };
}
function nt(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? delete this[t] : (this[t] = n);
  };
}
function it(t) {
  return t.trim().split(/^|\s+/);
}
function rt(t) {
  return t.classList || new st(t);
}
function st(t) {
  (this._node = t), (this._names = it(t.getAttribute('class') || ''));
}
function ot(t, e) {
  for (var n = rt(t), i = -1, r = e.length; ++i < r; ) n.add(e[i]);
}
function at(t, e) {
  for (var n = rt(t), i = -1, r = e.length; ++i < r; ) n.remove(e[i]);
}
function ht(t) {
  return function () {
    ot(this, t);
  };
}
function lt(t) {
  return function () {
    at(this, t);
  };
}
function ut(t, e) {
  return function () {
    (e.apply(this, arguments) ? ot : at)(this, t);
  };
}
function ct() {
  this.textContent = '';
}
function ft(t) {
  return function () {
    this.textContent = t;
  };
}
function pt(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.textContent = e ?? '';
  };
}
function dt() {
  this.innerHTML = '';
}
function gt(t) {
  return function () {
    this.innerHTML = t;
  };
}
function _t(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? '';
  };
}
function vt() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function mt() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function yt() {
  return null;
}
function $t() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function wt() {
  var t = this.cloneNode(!1),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function At() {
  var t = this.cloneNode(!0),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function bt(t) {
  return function () {
    var e = this.__on;
    if (e) {
      for (var n, i = 0, r = -1, s = e.length; i < s; ++i)
        (n = e[i]), (t.type && n.type !== t.type) || n.name !== t.name ? (e[++r] = n) : this.removeEventListener(n.type, n.listener, n.options);
      ++r ? (e.length = r) : delete this.__on;
    }
  };
}
function xt(t, e, n) {
  return function () {
    var i,
      r = this.__on,
      s = (function (t) {
        return function (e) {
          t.call(this, e, this.__data__);
        };
      })(e);
    if (r)
      for (var o = 0, a = r.length; o < a; ++o)
        if ((i = r[o]).type === t.type && i.name === t.name)
          return this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, (i.listener = s), (i.options = n)), void (i.value = e);
    this.addEventListener(t.type, s, n), (i = { type: t.type, name: t.name, value: e, listener: s, options: n }), r ? r.push(i) : (this.__on = [i]);
  };
}
function Et(t, e, n) {
  var i = K(t),
    r = i.CustomEvent;
  'function' == typeof r
    ? (r = new r(e, n))
    : ((r = i.document.createEvent('Event')), n ? (r.initEvent(e, n.bubbles, n.cancelable), (r.detail = n.detail)) : r.initEvent(e, !1, !1)),
    t.dispatchEvent(r);
}
function St(t, e) {
  return function () {
    return Et(this, t, e);
  };
}
function Ct(t, e) {
  return function () {
    return Et(this, t, e.apply(this, arguments));
  };
}
(z.prototype = {
  constructor: z,
  appendChild: function (t) {
    return this._parent.insertBefore(t, this._next);
  },
  insertBefore: function (t, e) {
    return this._parent.insertBefore(t, e);
  },
  querySelector: function (t) {
    return this._parent.querySelector(t);
  },
  querySelectorAll: function (t) {
    return this._parent.querySelectorAll(t);
  },
}),
  (st.prototype = {
    add: function (t) {
      this._names.indexOf(t) < 0 && (this._names.push(t), this._node.setAttribute('class', this._names.join(' ')));
    },
    remove: function (t) {
      var e = this._names.indexOf(t);
      e >= 0 && (this._names.splice(e, 1), this._node.setAttribute('class', this._names.join(' ')));
    },
    contains: function (t) {
      return this._names.indexOf(t) >= 0;
    },
  });
var Pt = [null];
function Nt(t, e) {
  (this._groups = t), (this._parents = e);
}
function kt() {
  return new Nt([[document.documentElement]], Pt);
}
function Mt(t, e, n) {
  (t.prototype = e.prototype = n), (n.constructor = t);
}
function Tt(t, e) {
  var n = Object.create(t.prototype);
  for (var i in e) n[i] = e[i];
  return n;
}
function Ut() {}
Nt.prototype = kt.prototype = {
  constructor: Nt,
  select: function (t) {
    'function' != typeof t && (t = S(t));
    for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
      for (var s, o, a = e[r], h = a.length, l = (i[r] = new Array(h)), u = 0; u < h; ++u)
        (s = a[u]) && (o = t.call(s, s.__data__, u, a)) && ('__data__' in s && (o.__data__ = s.__data__), (l[u] = o));
    return new Nt(i, this._parents);
  },
  selectAll: function (t) {
    t = 'function' == typeof t ? N(t) : P(t);
    for (var e = this._groups, n = e.length, i = [], r = [], s = 0; s < n; ++s)
      for (var o, a = e[s], h = a.length, l = 0; l < h; ++l) (o = a[l]) && (i.push(t.call(o, o.__data__, l, a)), r.push(o));
    return new Nt(i, r);
  },
  selectChild: function (t) {
    return this.select(
      null == t
        ? U
        : (function (t) {
            return function () {
              return T.call(this.children, t);
            };
          })('function' == typeof t ? t : M(t))
    );
  },
  selectChildren: function (t) {
    return this.selectAll(
      null == t
        ? H
        : (function (t) {
            return function () {
              return O.call(this.children, t);
            };
          })('function' == typeof t ? t : M(t))
    );
  },
  filter: function (t) {
    'function' != typeof t && (t = k(t));
    for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
      for (var s, o = e[r], a = o.length, h = (i[r] = []), l = 0; l < a; ++l) (s = o[l]) && t.call(s, s.__data__, l, o) && h.push(s);
    return new Nt(i, this._parents);
  },
  data: function (t, e) {
    if (!arguments.length) return Array.from(this, q);
    var n = e ? L : j,
      i = this._parents,
      r = this._groups;
    'function' != typeof t &&
      (t = (function (t) {
        return function () {
          return t;
        };
      })(t));
    for (var s = r.length, o = new Array(s), a = new Array(s), h = new Array(s), l = 0; l < s; ++l) {
      var u = i[l],
        c = r[l],
        f = c.length,
        p = D(t.call(u, u && u.__data__, l, i)),
        d = p.length,
        g = (a[l] = new Array(d)),
        _ = (o[l] = new Array(d));
      n(u, c, g, _, (h[l] = new Array(f)), p, e);
      for (var v, m, y = 0, $ = 0; y < d; ++y)
        if ((v = g[y])) {
          for (y >= $ && ($ = y + 1); !(m = _[$]) && ++$ < d; );
          v._next = m || null;
        }
    }
    return ((o = new Nt(o, i))._enter = a), (o._exit = h), o;
  },
  enter: function () {
    return new Nt(this._enter || this._groups.map(R), this._parents);
  },
  exit: function () {
    return new Nt(this._exit || this._groups.map(R), this._parents);
  },
  join: function (t, e, n) {
    var i = this.enter(),
      r = this,
      s = this.exit();
    return (
      'function' == typeof t ? (i = t(i)) && (i = i.selection()) : (i = i.append(t + '')),
      null != e && (r = e(r)) && (r = r.selection()),
      null == n ? s.remove() : n(s),
      i && r ? i.merge(r).order() : r
    );
  },
  merge: function (t) {
    for (
      var e = t.selection ? t.selection() : t, n = this._groups, i = e._groups, r = n.length, s = i.length, o = Math.min(r, s), a = new Array(r), h = 0;
      h < o;
      ++h
    )
      for (var l, u = n[h], c = i[h], f = u.length, p = (a[h] = new Array(f)), d = 0; d < f; ++d) (l = u[d] || c[d]) && (p[d] = l);
    for (; h < r; ++h) a[h] = n[h];
    return new Nt(a, this._parents);
  },
  selection: function () {
    return this;
  },
  order: function () {
    for (var t = this._groups, e = -1, n = t.length; ++e < n; )
      for (var i, r = t[e], s = r.length - 1, o = r[s]; --s >= 0; ) (i = r[s]) && (o && 4 ^ i.compareDocumentPosition(o) && o.parentNode.insertBefore(i, o), (o = i));
    return this;
  },
  sort: function (t) {
    function e(e, n) {
      return e && n ? t(e.__data__, n.__data__) : !e - !n;
    }
    t || (t = I);
    for (var n = this._groups, i = n.length, r = new Array(i), s = 0; s < i; ++s) {
      for (var o, a = n[s], h = a.length, l = (r[s] = new Array(h)), u = 0; u < h; ++u) (o = a[u]) && (l[u] = o);
      l.sort(e);
    }
    return new Nt(r, this._parents).order();
  },
  call: function () {
    var t = arguments[0];
    return (arguments[0] = this), t.apply(null, arguments), this;
  },
  nodes: function () {
    return Array.from(this);
  },
  node: function () {
    for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
      for (var i = t[e], r = 0, s = i.length; r < s; ++r) {
        var o = i[r];
        if (o) return o;
      }
    return null;
  },
  size: function () {
    let t = 0;
    for (const e of this) ++t;
    return t;
  },
  empty: function () {
    return !this.node();
  },
  each: function (t) {
    for (var e = this._groups, n = 0, i = e.length; n < i; ++n) for (var r, s = e[n], o = 0, a = s.length; o < a; ++o) (r = s[o]) && t.call(r, r.__data__, o, s);
    return this;
  },
  attr: function (t, e) {
    var n = w(t);
    if (arguments.length < 2) {
      var i = this.node();
      return n.local ? i.getAttributeNS(n.space, n.local) : i.getAttribute(n);
    }
    return this.each((null == e ? (n.local ? X : B) : 'function' == typeof e ? (n.local ? Y : V) : n.local ? F : W)(n, e));
  },
  style: function (t, e, n) {
    return arguments.length > 1 ? this.each((null == e ? G : 'function' == typeof e ? Z : J)(t, e, n ?? '')) : Q(this.node(), t);
  },
  property: function (t, e) {
    return arguments.length > 1 ? this.each((null == e ? tt : 'function' == typeof e ? nt : et)(t, e)) : this.node()[t];
  },
  classed: function (t, e) {
    var n = it(t + '');
    if (arguments.length < 2) {
      for (var i = rt(this.node()), r = -1, s = n.length; ++r < s; ) if (!i.contains(n[r])) return !1;
      return !0;
    }
    return this.each(('function' == typeof e ? ut : e ? ht : lt)(n, e));
  },
  text: function (t) {
    return arguments.length ? this.each(null == t ? ct : ('function' == typeof t ? pt : ft)(t)) : this.node().textContent;
  },
  html: function (t) {
    return arguments.length ? this.each(null == t ? dt : ('function' == typeof t ? _t : gt)(t)) : this.node().innerHTML;
  },
  raise: function () {
    return this.each(vt);
  },
  lower: function () {
    return this.each(mt);
  },
  append: function (t) {
    var e = 'function' == typeof t ? t : x(t);
    return this.select(function () {
      return this.appendChild(e.apply(this, arguments));
    });
  },
  insert: function (t, e) {
    var n = 'function' == typeof t ? t : x(t),
      i = null == e ? yt : 'function' == typeof e ? e : S(e);
    return this.select(function () {
      return this.insertBefore(n.apply(this, arguments), i.apply(this, arguments) || null);
    });
  },
  remove: function () {
    return this.each($t);
  },
  clone: function (t) {
    return this.select(t ? At : wt);
  },
  datum: function (t) {
    return arguments.length ? this.property('__data__', t) : this.node().__data__;
  },
  on: function (t, e, n) {
    var i,
      r,
      s = (function (t) {
        return t
          .trim()
          .split(/^|\s+/)
          .map(function (t) {
            var e = '',
              n = t.indexOf('.');
            return n >= 0 && ((e = t.slice(n + 1)), (t = t.slice(0, n))), { type: t, name: e };
          });
      })(t + ''),
      o = s.length;
    if (!(arguments.length < 2)) {
      for (a = e ? xt : bt, i = 0; i < o; ++i) this.each(a(s[i], e, n));
      return this;
    }
    var a = this.node().__on;
    if (a) for (var h, l = 0, u = a.length; l < u; ++l) for (i = 0, h = a[l]; i < o; ++i) if ((r = s[i]).type === h.type && r.name === h.name) return h.value;
  },
  dispatch: function (t, e) {
    return this.each(('function' == typeof e ? Ct : St)(t, e));
  },
  [Symbol.iterator]: function* () {
    for (var t = this._groups, e = 0, n = t.length; e < n; ++e) for (var i, r = t[e], s = 0, o = r.length; s < o; ++s) (i = r[s]) && (yield i);
  },
};
var Ot = 0.7,
  Ht = 1 / Ot,
  Rt = '\\s*([+-]?\\d+)\\s*',
  zt = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*',
  jt = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
  Lt = /^#([0-9a-f]{3,8})$/,
  qt = new RegExp(`^rgb\\(${Rt},${Rt},${Rt}\\)$`),
  Dt = new RegExp(`^rgb\\(${jt},${jt},${jt}\\)$`),
  It = new RegExp(`^rgba\\(${Rt},${Rt},${Rt},${zt}\\)$`),
  Bt = new RegExp(`^rgba\\(${jt},${jt},${jt},${zt}\\)$`),
  Xt = new RegExp(`^hsl\\(${zt},${jt},${jt}\\)$`),
  Wt = new RegExp(`^hsla\\(${zt},${jt},${jt},${zt}\\)$`),
  Ft = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  };
function Vt() {
  return this.rgb().formatHex();
}
function Yt() {
  return this.rgb().formatRgb();
}
function Kt(t) {
  var e, n;
  return (
    (t = (t + '').trim().toLowerCase()),
    (e = Lt.exec(t))
      ? ((n = e[1].length),
        (e = parseInt(e[1], 16)),
        6 === n
          ? Gt(e)
          : 3 === n
            ? new Qt(((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), ((15 & e) << 4) | (15 & e), 1)
            : 8 === n
              ? Jt((e >> 24) & 255, (e >> 16) & 255, (e >> 8) & 255, (255 & e) / 255)
              : 4 === n
                ? Jt(((e >> 12) & 15) | ((e >> 8) & 240), ((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), (((15 & e) << 4) | (15 & e)) / 255)
                : null)
      : (e = qt.exec(t))
        ? new Qt(e[1], e[2], e[3], 1)
        : (e = Dt.exec(t))
          ? new Qt((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, 1)
          : (e = It.exec(t))
            ? Jt(e[1], e[2], e[3], e[4])
            : (e = Bt.exec(t))
              ? Jt((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, e[4])
              : (e = Xt.exec(t))
                ? se(e[1], e[2] / 100, e[3] / 100, 1)
                : (e = Wt.exec(t))
                  ? se(e[1], e[2] / 100, e[3] / 100, e[4])
                  : Ft.hasOwnProperty(t)
                    ? Gt(Ft[t])
                    : 'transparent' === t
                      ? new Qt(NaN, NaN, NaN, 0)
                      : null
  );
}
function Gt(t) {
  return new Qt((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1);
}
function Jt(t, e, n, i) {
  return i <= 0 && (t = e = n = NaN), new Qt(t, e, n, i);
}
function Zt(t, e, n, i) {
  return 1 === arguments.length
    ? (function (t) {
        return t instanceof Ut || (t = Kt(t)), t ? new Qt((t = t.rgb()).r, t.g, t.b, t.opacity) : new Qt();
      })(t)
    : new Qt(t, e, n, i ?? 1);
}
function Qt(t, e, n, i) {
  (this.r = +t), (this.g = +e), (this.b = +n), (this.opacity = +i);
}
function te() {
  return `#${re(this.r)}${re(this.g)}${re(this.b)}`;
}
function ee() {
  const t = ne(this.opacity);
  return `${1 === t ? 'rgb(' : 'rgba('}${ie(this.r)}, ${ie(this.g)}, ${ie(this.b)}${1 === t ? ')' : `, ${t})`}`;
}
function ne(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function ie(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function re(t) {
  return ((t = ie(t)) < 16 ? '0' : '') + t.toString(16);
}
function se(t, e, n, i) {
  return i <= 0 ? (t = e = n = NaN) : n <= 0 || n >= 1 ? (t = e = NaN) : e <= 0 && (t = NaN), new ae(t, e, n, i);
}
function oe(t) {
  if (t instanceof ae) return new ae(t.h, t.s, t.l, t.opacity);
  if ((t instanceof Ut || (t = Kt(t)), !t)) return new ae();
  if (t instanceof ae) return t;
  var e = (t = t.rgb()).r / 255,
    n = t.g / 255,
    i = t.b / 255,
    r = Math.min(e, n, i),
    s = Math.max(e, n, i),
    o = NaN,
    a = s - r,
    h = (s + r) / 2;
  return (
    a
      ? ((o = e === s ? (n - i) / a + 6 * (n < i) : n === s ? (i - e) / a + 2 : (e - n) / a + 4), (a /= h < 0.5 ? s + r : 2 - s - r), (o *= 60))
      : (a = h > 0 && h < 1 ? 0 : o),
    new ae(o, a, h, t.opacity)
  );
}
function ae(t, e, n, i) {
  (this.h = +t), (this.s = +e), (this.l = +n), (this.opacity = +i);
}
function he(t) {
  return (t = (t || 0) % 360) < 0 ? t + 360 : t;
}
function le(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function ue(t, e, n) {
  return 255 * (t < 60 ? e + ((n - e) * t) / 60 : t < 180 ? n : t < 240 ? e + ((n - e) * (240 - t)) / 60 : e);
}
Mt(Ut, Kt, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Vt,
  formatHex: Vt,
  formatHex8: function () {
    return this.rgb().formatHex8();
  },
  formatHsl: function () {
    return oe(this).formatHsl();
  },
  formatRgb: Yt,
  toString: Yt,
}),
  Mt(
    Qt,
    Zt,
    Tt(Ut, {
      brighter(t) {
        return (t = null == t ? Ht : Math.pow(Ht, t)), new Qt(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? Ot : Math.pow(Ot, t)), new Qt(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Qt(ie(this.r), ie(this.g), ie(this.b), ne(this.opacity));
      },
      displayable() {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
      },
      hex: te,
      formatHex: te,
      formatHex8: function () {
        return `#${re(this.r)}${re(this.g)}${re(this.b)}${re(255 * (isNaN(this.opacity) ? 1 : this.opacity))}`;
      },
      formatRgb: ee,
      toString: ee,
    })
  ),
  Mt(
    ae,
    function (t, e, n, i) {
      return 1 === arguments.length ? oe(t) : new ae(t, e, n, i ?? 1);
    },
    Tt(Ut, {
      brighter(t) {
        return (t = null == t ? Ht : Math.pow(Ht, t)), new ae(this.h, this.s, this.l * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? Ot : Math.pow(Ot, t)), new ae(this.h, this.s, this.l * t, this.opacity);
      },
      rgb() {
        var t = (this.h % 360) + 360 * (this.h < 0),
          e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
          n = this.l,
          i = n + (n < 0.5 ? n : 1 - n) * e,
          r = 2 * n - i;
        return new Qt(ue(t >= 240 ? t - 240 : t + 120, r, i), ue(t, r, i), ue(t < 120 ? t + 240 : t - 120, r, i), this.opacity);
      },
      clamp() {
        return new ae(he(this.h), le(this.s), le(this.l), ne(this.opacity));
      },
      displayable() {
        return ((0 <= this.s && this.s <= 1) || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
      },
      formatHsl() {
        const t = ne(this.opacity);
        return `${1 === t ? 'hsl(' : 'hsla('}${he(this.h)}, ${100 * le(this.s)}%, ${100 * le(this.l)}%${1 === t ? ')' : `, ${t})`}`;
      },
    })
  );
var ce = (t) => () => t;
function fe(t) {
  return 1 == (t = +t)
    ? pe
    : function (e, n) {
        return n - e
          ? (function (t, e, n) {
              return (
                (t = Math.pow(t, n)),
                (e = Math.pow(e, n) - t),
                (n = 1 / n),
                function (i) {
                  return Math.pow(t + i * e, n);
                }
              );
            })(e, n, t)
          : ce(isNaN(e) ? n : e);
      };
}
function pe(t, e) {
  var n = e - t;
  return n
    ? (function (t, e) {
        return function (n) {
          return t + n * e;
        };
      })(t, n)
    : ce(isNaN(t) ? e : t);
}
var de = (function t(e) {
  var n = fe(e);
  function i(t, e) {
    var i = n((t = Zt(t)).r, (e = Zt(e)).r),
      r = n(t.g, e.g),
      s = n(t.b, e.b),
      o = pe(t.opacity, e.opacity);
    return function (e) {
      return (t.r = i(e)), (t.g = r(e)), (t.b = s(e)), (t.opacity = o(e)), t + '';
    };
  }
  return (i.gamma = t), i;
})(1);
function ge(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return t * (1 - n) + e * n;
    }
  );
}
var _e = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  ve = new RegExp(_e.source, 'g');
function me(t, e) {
  var n,
    i,
    r,
    s = (_e.lastIndex = ve.lastIndex = 0),
    o = -1,
    a = [],
    h = [];
  for (t += '', e += ''; (n = _e.exec(t)) && (i = ve.exec(e)); )
    (r = i.index) > s && ((r = e.slice(s, r)), a[o] ? (a[o] += r) : (a[++o] = r)),
      (n = n[0]) === (i = i[0]) ? (a[o] ? (a[o] += i) : (a[++o] = i)) : ((a[++o] = null), h.push({ i: o, x: ge(n, i) })),
      (s = ve.lastIndex);
  return (
    s < e.length && ((r = e.slice(s)), a[o] ? (a[o] += r) : (a[++o] = r)),
    a.length < 2
      ? h[0]
        ? (function (t) {
            return function (e) {
              return t(e) + '';
            };
          })(h[0].x)
        : (function (t) {
            return function () {
              return t;
            };
          })(e)
      : ((e = h.length),
        function (t) {
          for (var n, i = 0; i < e; ++i) a[(n = h[i]).i] = n.x(t);
          return a.join('');
        })
  );
}
var ye,
  $e = 180 / Math.PI,
  we = { translateX: 0, translateY: 0, rotate: 0, skewX: 0, scaleX: 1, scaleY: 1 };
function Ae(t, e, n, i, r, s) {
  var o, a, h;
  return (
    (o = Math.sqrt(t * t + e * e)) && ((t /= o), (e /= o)),
    (h = t * n + e * i) && ((n -= t * h), (i -= e * h)),
    (a = Math.sqrt(n * n + i * i)) && ((n /= a), (i /= a), (h /= a)),
    t * i < e * n && ((t = -t), (e = -e), (h = -h), (o = -o)),
    { translateX: r, translateY: s, rotate: Math.atan2(e, t) * $e, skewX: Math.atan(h) * $e, scaleX: o, scaleY: a }
  );
}
function be(t, e, n, i) {
  function r(t) {
    return t.length ? t.pop() + ' ' : '';
  }
  return function (s, o) {
    var a = [],
      h = [];
    return (
      (s = t(s)),
      (o = t(o)),
      (function (t, i, r, s, o, a) {
        if (t !== r || i !== s) {
          var h = o.push('translate(', null, e, null, n);
          a.push({ i: h - 4, x: ge(t, r) }, { i: h - 2, x: ge(i, s) });
        } else (r || s) && o.push('translate(' + r + e + s + n);
      })(s.translateX, s.translateY, o.translateX, o.translateY, a, h),
      (function (t, e, n, s) {
        t !== e
          ? (t - e > 180 ? (e += 360) : e - t > 180 && (t += 360), s.push({ i: n.push(r(n) + 'rotate(', null, i) - 2, x: ge(t, e) }))
          : e && n.push(r(n) + 'rotate(' + e + i);
      })(s.rotate, o.rotate, a, h),
      (function (t, e, n, s) {
        t !== e ? s.push({ i: n.push(r(n) + 'skewX(', null, i) - 2, x: ge(t, e) }) : e && n.push(r(n) + 'skewX(' + e + i);
      })(s.skewX, o.skewX, a, h),
      (function (t, e, n, i, s, o) {
        if (t !== n || e !== i) {
          var a = s.push(r(s) + 'scale(', null, ',', null, ')');
          o.push({ i: a - 4, x: ge(t, n) }, { i: a - 2, x: ge(e, i) });
        } else (1 === n && 1 === i) || s.push(r(s) + 'scale(' + n + ',' + i + ')');
      })(s.scaleX, s.scaleY, o.scaleX, o.scaleY, a, h),
      (s = o = null),
      function (t) {
        for (var e, n = -1, i = h.length; ++n < i; ) a[(e = h[n]).i] = e.x(t);
        return a.join('');
      }
    );
  };
}
var xe,
  Ee,
  Se = be(
    function (t) {
      const e = new ('function' == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(t + '');
      return e.isIdentity ? we : Ae(e.a, e.b, e.c, e.d, e.e, e.f);
    },
    'px, ',
    'px)',
    'deg)'
  ),
  Ce = be(
    function (t) {
      return null == t
        ? we
        : (ye || (ye = document.createElementNS('http://www.w3.org/2000/svg', 'g')),
          ye.setAttribute('transform', t),
          (t = ye.transform.baseVal.consolidate()) ? Ae((t = t.matrix).a, t.b, t.c, t.d, t.e, t.f) : we);
    },
    ', ',
    ')',
    ')'
  ),
  Pe = 0,
  Ne = 0,
  ke = 0,
  Me = 0,
  Te = 0,
  Ue = 0,
  Oe = 'object' == typeof performance && performance.now ? performance : Date,
  He =
    'object' == typeof window && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : function (t) {
          setTimeout(t, 17);
        };
function Re() {
  return Te || (He(ze), (Te = Oe.now() + Ue));
}
function ze() {
  Te = 0;
}
function je() {
  this._call = this._time = this._next = null;
}
function Le(t, e, n) {
  var i = new je();
  return i.restart(t, e, n), i;
}
function qe() {
  (Te = (Me = Oe.now()) + Ue), (Pe = Ne = 0);
  try {
    !(function () {
      Re(), ++Pe;
      for (var t, e = xe; e; ) (t = Te - e._time) >= 0 && e._call.call(void 0, t), (e = e._next);
      --Pe;
    })();
  } finally {
    (Pe = 0),
      (function () {
        var t,
          e,
          n = xe,
          i = 1 / 0;
        for (; n; ) n._call ? (i > n._time && (i = n._time), (t = n), (n = n._next)) : ((e = n._next), (n._next = null), (n = t ? (t._next = e) : (xe = e)));
        (Ee = t), Ie(i);
      })(),
      (Te = 0);
  }
}
function De() {
  var t = Oe.now(),
    e = t - Me;
  e > 1e3 && ((Ue -= e), (Me = t));
}
function Ie(t) {
  Pe ||
    (Ne && (Ne = clearTimeout(Ne)),
    t - Te > 24
      ? (t < 1 / 0 && (Ne = setTimeout(qe, t - Oe.now() - Ue)), ke && (ke = clearInterval(ke)))
      : (ke || ((Me = Oe.now()), (ke = setInterval(De, 1e3))), (Pe = 1), He(qe)));
}
function Be(t, e, n) {
  var i = new je();
  return (
    (e = null == e ? 0 : +e),
    i.restart(
      (n) => {
        i.stop(), t(n + e);
      },
      e,
      n
    ),
    i
  );
}
je.prototype = Le.prototype = {
  constructor: je,
  restart: function (t, e, n) {
    if ('function' != typeof t) throw new TypeError('callback is not a function');
    (n = (null == n ? Re() : +n) + (null == e ? 0 : +e)),
      this._next || Ee === this || (Ee ? (Ee._next = this) : (xe = this), (Ee = this)),
      (this._call = t),
      (this._time = n),
      Ie();
  },
  stop: function () {
    this._call && ((this._call = null), (this._time = 1 / 0), Ie());
  },
};
var Xe = g('start', 'end', 'cancel', 'interrupt'),
  We = [];
function Fe(t, e, n, i, r, s) {
  var o = t.__transition;
  if (o) {
    if (n in o) return;
  } else t.__transition = {};
  !(function (t, e, n) {
    var i,
      r = t.__transition;
    function s(t) {
      (n.state = 1), n.timer.restart(o, n.delay, n.time), n.delay <= t && o(t - n.delay);
    }
    function o(s) {
      var l, u, c, f;
      if (1 !== n.state) return h();
      for (l in r)
        if ((f = r[l]).name === n.name) {
          if (3 === f.state) return Be(o);
          4 === f.state
            ? ((f.state = 6), f.timer.stop(), f.on.call('interrupt', t, t.__data__, f.index, f.group), delete r[l])
            : +l < e && ((f.state = 6), f.timer.stop(), f.on.call('cancel', t, t.__data__, f.index, f.group), delete r[l]);
        }
      if (
        (Be(function () {
          3 === n.state && ((n.state = 4), n.timer.restart(a, n.delay, n.time), a(s));
        }),
        (n.state = 2),
        n.on.call('start', t, t.__data__, n.index, n.group),
        2 === n.state)
      ) {
        for (n.state = 3, i = new Array((c = n.tween.length)), l = 0, u = -1; l < c; ++l)
          (f = n.tween[l].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = f);
        i.length = u + 1;
      }
    }
    function a(e) {
      for (var r = e < n.duration ? n.ease.call(null, e / n.duration) : (n.timer.restart(h), (n.state = 5), 1), s = -1, o = i.length; ++s < o; ) i[s].call(t, r);
      5 === n.state && (n.on.call('end', t, t.__data__, n.index, n.group), h());
    }
    function h() {
      for (var i in ((n.state = 6), n.timer.stop(), delete r[e], r)) return;
      delete t.__transition;
    }
    (r[e] = n), (n.timer = Le(s, 0, n.time));
  })(t, n, { name: e, index: i, group: r, on: Xe, tween: We, time: s.time, delay: s.delay, duration: s.duration, ease: s.ease, timer: null, state: 0 });
}
function Ve(t, e) {
  var n = Ke(t, e);
  if (n.state > 0) throw new Error('too late; already scheduled');
  return n;
}
function Ye(t, e) {
  var n = Ke(t, e);
  if (n.state > 3) throw new Error('too late; already running');
  return n;
}
function Ke(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error('transition not found');
  return n;
}
function Ge(t, e) {
  var n, i;
  return function () {
    var r = Ye(this, t),
      s = r.tween;
    if (s !== n)
      for (var o = 0, a = (i = n = s).length; o < a; ++o)
        if (i[o].name === e) {
          (i = i.slice()).splice(o, 1);
          break;
        }
    r.tween = i;
  };
}
function Je(t, e, n) {
  var i, r;
  if ('function' != typeof n) throw new Error();
  return function () {
    var s = Ye(this, t),
      o = s.tween;
    if (o !== i) {
      r = (i = o).slice();
      for (var a = { name: e, value: n }, h = 0, l = r.length; h < l; ++h)
        if (r[h].name === e) {
          r[h] = a;
          break;
        }
      h === l && r.push(a);
    }
    s.tween = r;
  };
}
function Ze(t, e, n) {
  var i = t._id;
  return (
    t.each(function () {
      var t = Ye(this, i);
      (t.value || (t.value = {}))[e] = n.apply(this, arguments);
    }),
    function (t) {
      return Ke(t, i).value[e];
    }
  );
}
function Qe(t, e) {
  var n;
  return ('number' == typeof e ? ge : e instanceof Kt ? de : (n = Kt(e)) ? ((e = n), de) : me)(t, e);
}
function tn(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function en(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function nn(t, e, n) {
  var i,
    r,
    s = n + '';
  return function () {
    var o = this.getAttribute(t);
    return o === s ? null : o === i ? r : (r = e((i = o), n));
  };
}
function rn(t, e, n) {
  var i,
    r,
    s = n + '';
  return function () {
    var o = this.getAttributeNS(t.space, t.local);
    return o === s ? null : o === i ? r : (r = e((i = o), n));
  };
}
function sn(t, e, n) {
  var i, r, s;
  return function () {
    var o,
      a,
      h = n(this);
    if (null != h) return (o = this.getAttribute(t)) === (a = h + '') ? null : o === i && a === r ? s : ((r = a), (s = e((i = o), h)));
    this.removeAttribute(t);
  };
}
function on(t, e, n) {
  var i, r, s;
  return function () {
    var o,
      a,
      h = n(this);
    if (null != h) return (o = this.getAttributeNS(t.space, t.local)) === (a = h + '') ? null : o === i && a === r ? s : ((r = a), (s = e((i = o), h)));
    this.removeAttributeNS(t.space, t.local);
  };
}
function an(t, e) {
  var n, i;
  function r() {
    var r = e.apply(this, arguments);
    return (
      r !== i &&
        (n =
          (i = r) &&
          (function (t, e) {
            return function (n) {
              this.setAttributeNS(t.space, t.local, e.call(this, n));
            };
          })(t, r)),
      n
    );
  }
  return (r._value = e), r;
}
function hn(t, e) {
  var n, i;
  function r() {
    var r = e.apply(this, arguments);
    return (
      r !== i &&
        (n =
          (i = r) &&
          (function (t, e) {
            return function (n) {
              this.setAttribute(t, e.call(this, n));
            };
          })(t, r)),
      n
    );
  }
  return (r._value = e), r;
}
function ln(t, e) {
  return function () {
    Ve(this, t).delay = +e.apply(this, arguments);
  };
}
function un(t, e) {
  return (
    (e = +e),
    function () {
      Ve(this, t).delay = e;
    }
  );
}
function cn(t, e) {
  return function () {
    Ye(this, t).duration = +e.apply(this, arguments);
  };
}
function fn(t, e) {
  return (
    (e = +e),
    function () {
      Ye(this, t).duration = e;
    }
  );
}
var pn = kt.prototype.constructor;
function dn(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
var gn = 0;
function _n(t, e, n, i) {
  (this._groups = t), (this._parents = e), (this._name = n), (this._id = i);
}
function vn() {
  return ++gn;
}
var mn = kt.prototype;
_n.prototype = {
  constructor: _n,
  select: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = S(t));
    for (var i = this._groups, r = i.length, s = new Array(r), o = 0; o < r; ++o)
      for (var a, h, l = i[o], u = l.length, c = (s[o] = new Array(u)), f = 0; f < u; ++f)
        (a = l[f]) && (h = t.call(a, a.__data__, f, l)) && ('__data__' in a && (h.__data__ = a.__data__), (c[f] = h), Fe(c[f], e, n, f, c, Ke(a, n)));
    return new _n(s, this._parents, e, n);
  },
  selectAll: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = P(t));
    for (var i = this._groups, r = i.length, s = [], o = [], a = 0; a < r; ++a)
      for (var h, l = i[a], u = l.length, c = 0; c < u; ++c)
        if ((h = l[c])) {
          for (var f, p = t.call(h, h.__data__, c, l), d = Ke(h, n), g = 0, _ = p.length; g < _; ++g) (f = p[g]) && Fe(f, e, n, g, p, d);
          s.push(p), o.push(h);
        }
    return new _n(s, o, e, n);
  },
  selectChild: mn.selectChild,
  selectChildren: mn.selectChildren,
  filter: function (t) {
    'function' != typeof t && (t = k(t));
    for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
      for (var s, o = e[r], a = o.length, h = (i[r] = []), l = 0; l < a; ++l) (s = o[l]) && t.call(s, s.__data__, l, o) && h.push(s);
    return new _n(i, this._parents, this._name, this._id);
  },
  merge: function (t) {
    if (t._id !== this._id) throw new Error();
    for (var e = this._groups, n = t._groups, i = e.length, r = n.length, s = Math.min(i, r), o = new Array(i), a = 0; a < s; ++a)
      for (var h, l = e[a], u = n[a], c = l.length, f = (o[a] = new Array(c)), p = 0; p < c; ++p) (h = l[p] || u[p]) && (f[p] = h);
    for (; a < i; ++a) o[a] = e[a];
    return new _n(o, this._parents, this._name, this._id);
  },
  selection: function () {
    return new pn(this._groups, this._parents);
  },
  transition: function () {
    for (var t = this._name, e = this._id, n = vn(), i = this._groups, r = i.length, s = 0; s < r; ++s)
      for (var o, a = i[s], h = a.length, l = 0; l < h; ++l)
        if ((o = a[l])) {
          var u = Ke(o, e);
          Fe(o, t, n, l, a, { time: u.time + u.delay + u.duration, delay: 0, duration: u.duration, ease: u.ease });
        }
    return new _n(i, this._parents, t, n);
  },
  call: mn.call,
  nodes: mn.nodes,
  node: mn.node,
  size: mn.size,
  empty: mn.empty,
  each: mn.each,
  on: function (t, e) {
    var n = this._id;
    return arguments.length < 2
      ? Ke(this.node(), n).on.on(t)
      : this.each(
          (function (t, e, n) {
            var i,
              r,
              s = (function (t) {
                return (t + '')
                  .trim()
                  .split(/^|\s+/)
                  .every(function (t) {
                    var e = t.indexOf('.');
                    return e >= 0 && (t = t.slice(0, e)), !t || 'start' === t;
                  });
              })(e)
                ? Ve
                : Ye;
            return function () {
              var o = s(this, t),
                a = o.on;
              a !== i && (r = (i = a).copy()).on(e, n), (o.on = r);
            };
          })(n, t, e)
        );
  },
  attr: function (t, e) {
    var n = w(t),
      i = 'transform' === n ? Ce : Qe;
    return this.attrTween(
      t,
      'function' == typeof e ? (n.local ? on : sn)(n, i, Ze(this, 'attr.' + t, e)) : null == e ? (n.local ? en : tn)(n) : (n.local ? rn : nn)(n, i, e)
    );
  },
  attrTween: function (t, e) {
    var n = 'attr.' + t;
    if (arguments.length < 2) return (n = this.tween(n)) && n._value;
    if (null == e) return this.tween(n, null);
    if ('function' != typeof e) throw new Error();
    var i = w(t);
    return this.tween(n, (i.local ? an : hn)(i, e));
  },
  style: function (t, e, n) {
    var i = 'transform' == (t += '') ? Se : Qe;
    return null == e
      ? this.styleTween(
          t,
          (function (t, e) {
            var n, i, r;
            return function () {
              var s = Q(this, t),
                o = (this.style.removeProperty(t), Q(this, t));
              return s === o ? null : s === n && o === i ? r : (r = e((n = s), (i = o)));
            };
          })(t, i)
        ).on('end.style.' + t, dn(t))
      : 'function' == typeof e
        ? this.styleTween(
            t,
            (function (t, e, n) {
              var i, r, s;
              return function () {
                var o = Q(this, t),
                  a = n(this),
                  h = a + '';
                return null == a && (this.style.removeProperty(t), (h = a = Q(this, t))), o === h ? null : o === i && h === r ? s : ((r = h), (s = e((i = o), a)));
              };
            })(t, i, Ze(this, 'style.' + t, e))
          ).each(
            (function (t, e) {
              var n,
                i,
                r,
                s,
                o = 'style.' + e,
                a = 'end.' + o;
              return function () {
                var h = Ye(this, t),
                  l = h.on,
                  u = null == h.value[o] ? s || (s = dn(e)) : void 0;
                (l === n && r === u) || (i = (n = l).copy()).on(a, (r = u)), (h.on = i);
              };
            })(this._id, t)
          )
        : this.styleTween(
            t,
            (function (t, e, n) {
              var i,
                r,
                s = n + '';
              return function () {
                var o = Q(this, t);
                return o === s ? null : o === i ? r : (r = e((i = o), n));
              };
            })(t, i, e),
            n
          ).on('end.style.' + t, null);
  },
  styleTween: function (t, e, n) {
    var i = 'style.' + (t += '');
    if (arguments.length < 2) return (i = this.tween(i)) && i._value;
    if (null == e) return this.tween(i, null);
    if ('function' != typeof e) throw new Error();
    return this.tween(
      i,
      (function (t, e, n) {
        var i, r;
        function s() {
          var s = e.apply(this, arguments);
          return (
            s !== r &&
              (i =
                (r = s) &&
                (function (t, e, n) {
                  return function (i) {
                    this.style.setProperty(t, e.call(this, i), n);
                  };
                })(t, s, n)),
            i
          );
        }
        return (s._value = e), s;
      })(t, e, n ?? '')
    );
  },
  text: function (t) {
    return this.tween(
      'text',
      'function' == typeof t
        ? (function (t) {
            return function () {
              var e = t(this);
              this.textContent = e ?? '';
            };
          })(Ze(this, 'text', t))
        : (function (t) {
            return function () {
              this.textContent = t;
            };
          })(null == t ? '' : t + '')
    );
  },
  textTween: function (t) {
    var e = 'text';
    if (arguments.length < 1) return (e = this.tween(e)) && e._value;
    if (null == t) return this.tween(e, null);
    if ('function' != typeof t) throw new Error();
    return this.tween(
      e,
      (function (t) {
        var e, n;
        function i() {
          var i = t.apply(this, arguments);
          return (
            i !== n &&
              (e =
                (n = i) &&
                (function (t) {
                  return function (e) {
                    this.textContent = t.call(this, e);
                  };
                })(i)),
            e
          );
        }
        return (i._value = t), i;
      })(t)
    );
  },
  remove: function () {
    return this.on(
      'end.remove',
      (function (t) {
        return function () {
          var e = this.parentNode;
          for (var n in this.__transition) if (+n !== t) return;
          e && e.removeChild(this);
        };
      })(this._id)
    );
  },
  tween: function (t, e) {
    var n = this._id;
    if (((t += ''), arguments.length < 2)) {
      for (var i, r = Ke(this.node(), n).tween, s = 0, o = r.length; s < o; ++s) if ((i = r[s]).name === t) return i.value;
      return null;
    }
    return this.each((null == e ? Ge : Je)(n, t, e));
  },
  delay: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? ln : un)(e, t)) : Ke(this.node(), e).delay;
  },
  duration: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? cn : fn)(e, t)) : Ke(this.node(), e).duration;
  },
  ease: function (t) {
    var e = this._id;
    return arguments.length
      ? this.each(
          (function (t, e) {
            if ('function' != typeof e) throw new Error();
            return function () {
              Ye(this, t).ease = e;
            };
          })(e, t)
        )
      : Ke(this.node(), e).ease;
  },
  easeVarying: function (t) {
    if ('function' != typeof t) throw new Error();
    return this.each(
      (function (t, e) {
        return function () {
          var n = e.apply(this, arguments);
          if ('function' != typeof n) throw new Error();
          Ye(this, t).ease = n;
        };
      })(this._id, t)
    );
  },
  end: function () {
    var t,
      e,
      n = this,
      i = n._id,
      r = n.size();
    return new Promise(function (s, o) {
      var a = { value: o },
        h = {
          value: function () {
            0 == --r && s();
          },
        };
      n.each(function () {
        var n = Ye(this, i),
          r = n.on;
        r !== t && ((e = (t = r).copy())._.cancel.push(a), e._.interrupt.push(a), e._.end.push(h)), (n.on = e);
      }),
        0 === r && s();
    });
  },
  [Symbol.iterator]: mn[Symbol.iterator],
};
var yn = {
  time: null,
  delay: 0,
  duration: 250,
  ease: function (t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  },
};
function $n(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); ) if (!(t = t.parentNode)) throw new Error(`transition ${e} not found`);
  return n;
}
function wn(t, e, n) {
  (this.k = t), (this.x = e), (this.y = n);
}
(kt.prototype.interrupt = function (t) {
  return this.each(function () {
    !(function (t, e) {
      var n,
        i,
        r,
        s = t.__transition,
        o = !0;
      if (s) {
        for (r in ((e = null == e ? null : e + ''), s))
          (n = s[r]).name === e
            ? ((i = n.state > 2 && n.state < 5), (n.state = 6), n.timer.stop(), n.on.call(i ? 'interrupt' : 'cancel', t, t.__data__, n.index, n.group), delete s[r])
            : (o = !1);
        o && delete t.__transition;
      }
    })(this, t);
  });
}),
  (kt.prototype.transition = function (t) {
    var e, n;
    t instanceof _n ? ((e = t._id), (t = t._name)) : ((e = vn()), ((n = yn).time = Re()), (t = null == t ? null : t + ''));
    for (var i = this._groups, r = i.length, s = 0; s < r; ++s) for (var o, a = i[s], h = a.length, l = 0; l < h; ++l) (o = a[l]) && Fe(o, t, e, l, a, n || $n(o, e));
    return new _n(i, this._parents, t, e);
  }),
  (wn.prototype = {
    constructor: wn,
    scale: function (t) {
      return 1 === t ? this : new wn(this.k * t, this.x, this.y);
    },
    translate: function (t, e) {
      return (0 === t) & (0 === e) ? this : new wn(this.k, this.x + this.k * t, this.y + this.k * e);
    },
    apply: function (t) {
      return [t[0] * this.k + this.x, t[1] * this.k + this.y];
    },
    applyX: function (t) {
      return t * this.k + this.x;
    },
    applyY: function (t) {
      return t * this.k + this.y;
    },
    invert: function (t) {
      return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k];
    },
    invertX: function (t) {
      return (t - this.x) / this.k;
    },
    invertY: function (t) {
      return (t - this.y) / this.k;
    },
    rescaleX: function (t) {
      return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t));
    },
    rescaleY: function (t) {
      return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t));
    },
    toString: function () {
      return 'translate(' + this.x + ',' + this.y + ') scale(' + this.k + ')';
    },
  }),
  wn.prototype;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const An = globalThis,
  bn = An.ShadowRoot && (void 0 === An.ShadyCSS || An.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype,
  xn = Symbol(),
  En = new WeakMap();
let Sn = class {
  constructor(t, e, n) {
    if (((this._$cssResult$ = !0), n !== xn)) throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    (this.cssText = t), (this.t = e);
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (bn && void 0 === t) {
      const n = void 0 !== e && 1 === e.length;
      n && (t = En.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && En.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Cn = bn
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return ((t) => new Sn('string' == typeof t ? t : t + '', void 0, xn))(e);
            })(t)
          : t,
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ { is: Pn, defineProperty: Nn, getOwnPropertyDescriptor: kn, getOwnPropertyNames: Mn, getOwnPropertySymbols: Tn, getPrototypeOf: Un } = Object,
  On = globalThis,
  Hn = On.trustedTypes,
  Rn = Hn ? Hn.emptyScript : '',
  zn = On.reactiveElementPolyfillSupport,
  jn = (t, e) => t,
  Ln = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? Rn : null;
          break;
        case Object:
        case Array:
          t = null == t ? t : JSON.stringify(t);
      }
      return t;
    },
    fromAttribute(t, e) {
      let n = t;
      switch (e) {
        case Boolean:
          n = null !== t;
          break;
        case Number:
          n = null === t ? null : Number(t);
          break;
        case Object:
        case Array:
          try {
            n = JSON.parse(t);
          } catch (t) {
            n = null;
          }
      }
      return n;
    },
  },
  qn = (t, e) => !Pn(t, e),
  Dn = { attribute: !0, type: String, converter: Ln, reflect: !1, hasChanged: qn };
(Symbol.metadata ??= Symbol('metadata')), (On.litPropertyMetadata ??= new WeakMap());
let In = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Dn) {
    if ((e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor)) {
      const n = Symbol(),
        i = this.getPropertyDescriptor(t, n, e);
      void 0 !== i && Nn(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: i, set: r } = kn(this.prototype, t) ?? {
      get() {
        return this[e];
      },
      set(t) {
        this[e] = t;
      },
    };
    return {
      get() {
        return i?.call(this);
      },
      set(e) {
        const s = i?.call(this);
        r.call(this, e), this.requestUpdate(t, s, n);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Dn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(jn('elementProperties'))) return;
    const t = Un(this);
    t.finalize(), void 0 !== t.l && (this.l = [...t.l]), (this.elementProperties = new Map(t.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(jn('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(jn('properties')))) {
      const t = this.properties,
        e = [...Mn(t), ...Tn(t)];
      for (const n of e) this.createProperty(n, t[n]);
    }
    const t = this[Symbol.metadata];
    if (null !== t) {
      const e = litPropertyMetadata.get(t);
      if (void 0 !== e) for (const [t, n] of e) this.elementProperties.set(t, n);
    }
    this._$Eh = new Map();
    for (const [t, e] of this.elementProperties) {
      const n = this._$Eu(t, e);
      void 0 !== n && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const t of n) e.unshift(Cn(t));
    } else void 0 !== t && e.push(Cn(t));
    return e;
  }
  static _$Eu(t, e) {
    const n = e.attribute;
    return !1 === n ? void 0 : 'string' == typeof n ? n : 'string' == typeof t ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), (this._$Ep = void 0), (this.isUpdatePending = !1), (this.hasUpdated = !1), (this._$Em = null), this._$Ev();
  }
  _$Ev() {
    (this._$ES = new Promise((t) => (this.enableUpdating = t))),
      (this._$AL = new Map()),
      this._$E_(),
      this.requestUpdate(),
      this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = new Map(),
      e = this.constructor.elementProperties;
    for (const n of e.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return (
      ((t, e) => {
        if (bn) t.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
        else
          for (const n of e) {
            const e = document.createElement('style'),
              i = An.litNonce;
            void 0 !== i && e.setAttribute('nonce', i), (e.textContent = n.cssText), t.appendChild(e);
          }
      })(t, this.constructor.elementStyles),
      t
    );
  }
  connectedCallback() {
    (this.renderRoot ??= this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, n) {
    this._$AK(t, n);
  }
  _$EC(t, e) {
    const n = this.constructor.elementProperties.get(t),
      i = this.constructor._$Eu(t, n);
    if (void 0 !== i && !0 === n.reflect) {
      const r = (void 0 !== n.converter?.toAttribute ? n.converter : Ln).toAttribute(e, n.type);
      (this._$Em = t), null == r ? this.removeAttribute(i) : this.setAttribute(i, r), (this._$Em = null);
    }
  }
  _$AK(t, e) {
    const n = this.constructor,
      i = n._$Eh.get(t);
    if (void 0 !== i && this._$Em !== i) {
      const t = n.getPropertyOptions(i),
        r = 'function' == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : Ln;
      (this._$Em = i), (this[i] = r.fromAttribute(e, t.type)), (this._$Em = null);
    }
  }
  requestUpdate(t, e, n) {
    if (void 0 !== t) {
      if (((n ??= this.constructor.getPropertyOptions(t)), !(n.hasChanged ?? qn)(this[t], e))) return;
      this.P(t, e, n);
    }
    !1 === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t, e, n) {
    this._$AL.has(t) || this._$AL.set(t, e), !0 === n.reflect && this._$Em !== t && (this._$Ej ??= new Set()).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const t = this.scheduleUpdate();
    return null != t && (await t), !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
        for (const [t, e] of this._$Ep) this[t] = e;
        this._$Ep = void 0;
      }
      const t = this.constructor.elementProperties;
      if (t.size > 0) for (const [e, n] of t) !0 !== n.wrapped || this._$AL.has(e) || void 0 === this[e] || this.P(e, this[e], n);
    }
    let t = !1;
    const e = this._$AL;
    try {
      (t = this.shouldUpdate(e)), t ? (this.willUpdate(e), this._$EO?.forEach((t) => t.hostUpdate?.()), this.update(e)) : this._$EU();
    } catch (e) {
      throw ((t = !1), this._$EU(), e);
    }
    t && this._$AE(e);
  }
  willUpdate(t) {}
  _$AE(t) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)), this.updated(t);
  }
  _$EU() {
    (this._$AL = new Map()), (this.isUpdatePending = !1);
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    (this._$Ej &&= this._$Ej.forEach((t) => this._$EC(t, this[t]))), this._$EU();
  }
  updated(t) {}
  firstUpdated(t) {}
};
(In.elementStyles = []),
  (In.shadowRootOptions = { mode: 'open' }),
  (In[jn('elementProperties')] = new Map()),
  (In[jn('finalized')] = new Map()),
  zn?.({ ReactiveElement: In }),
  (On.reactiveElementVersions ??= []).push('2.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bn = globalThis,
  Xn = Bn.trustedTypes,
  Wn = Xn ? Xn.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  Fn = '$lit$',
  Vn = `lit$${Math.random().toFixed(9).slice(2)}$`,
  Yn = '?' + Vn,
  Kn = `<${Yn}>`,
  Gn = document,
  Jn = () => Gn.createComment(''),
  Zn = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
  Qn = Array.isArray,
  ti = '[ \t\n\f\r]',
  ei = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  ni = /-->/g,
  ii = />/g,
  ri = RegExp(`>|${ti}(?:([^\\s"'>=/]+)(${ti}*=${ti}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  si = /'/g,
  oi = /"/g,
  ai = /^(?:script|style|textarea|title)$/i,
  hi = Symbol.for('lit-noChange'),
  li = Symbol.for('lit-nothing'),
  ui = new WeakMap(),
  ci = Gn.createTreeWalker(Gn, 129);
function fi(t, e) {
  if (!Qn(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return void 0 !== Wn ? Wn.createHTML(e) : e;
}
let pi = class t {
  constructor({ strings: e, _$litType$: n }, i) {
    let r;
    this.parts = [];
    let s = 0,
      o = 0;
    const a = e.length - 1,
      h = this.parts,
      [l, u] = ((t, e) => {
        const n = t.length - 1,
          i = [];
        let r,
          s = 2 === e ? '<svg>' : 3 === e ? '<math>' : '',
          o = ei;
        for (let e = 0; e < n; e++) {
          const n = t[e];
          let a,
            h,
            l = -1,
            u = 0;
          for (; u < n.length && ((o.lastIndex = u), (h = o.exec(n)), null !== h); )
            (u = o.lastIndex),
              o === ei
                ? '!--' === h[1]
                  ? (o = ni)
                  : void 0 !== h[1]
                    ? (o = ii)
                    : void 0 !== h[2]
                      ? (ai.test(h[2]) && (r = RegExp('</' + h[2], 'g')), (o = ri))
                      : void 0 !== h[3] && (o = ri)
                : o === ri
                  ? '>' === h[0]
                    ? ((o = r ?? ei), (l = -1))
                    : void 0 === h[1]
                      ? (l = -2)
                      : ((l = o.lastIndex - h[2].length), (a = h[1]), (o = void 0 === h[3] ? ri : '"' === h[3] ? oi : si))
                  : o === oi || o === si
                    ? (o = ri)
                    : o === ni || o === ii
                      ? (o = ei)
                      : ((o = ri), (r = void 0));
          const c = o === ri && t[e + 1].startsWith('/>') ? ' ' : '';
          s += o === ei ? n + Kn : l >= 0 ? (i.push(a), n.slice(0, l) + Fn + n.slice(l) + Vn + c) : n + Vn + (-2 === l ? e : c);
        }
        return [fi(t, s + (t[n] || '<?>') + (2 === e ? '</svg>' : 3 === e ? '</math>' : '')), i];
      })(e, n);
    if (((this.el = t.createElement(l, i)), (ci.currentNode = this.el.content), 2 === n || 3 === n)) {
      const t = this.el.content.firstChild;
      t.replaceWith(...t.childNodes);
    }
    for (; null !== (r = ci.nextNode()) && h.length < a; ) {
      if (1 === r.nodeType) {
        if (r.hasAttributes())
          for (const t of r.getAttributeNames())
            if (t.endsWith(Fn)) {
              const e = u[o++],
                n = r.getAttribute(t).split(Vn),
                i = /([.?@])?(.*)/.exec(e);
              h.push({ type: 1, index: s, name: i[2], strings: n, ctor: '.' === i[1] ? mi : '?' === i[1] ? yi : '@' === i[1] ? $i : vi }), r.removeAttribute(t);
            } else t.startsWith(Vn) && (h.push({ type: 6, index: s }), r.removeAttribute(t));
        if (ai.test(r.tagName)) {
          const t = r.textContent.split(Vn),
            e = t.length - 1;
          if (e > 0) {
            r.textContent = Xn ? Xn.emptyScript : '';
            for (let n = 0; n < e; n++) r.append(t[n], Jn()), ci.nextNode(), h.push({ type: 2, index: ++s });
            r.append(t[e], Jn());
          }
        }
      } else if (8 === r.nodeType)
        if (r.data === Yn) h.push({ type: 2, index: s });
        else {
          let t = -1;
          for (; -1 !== (t = r.data.indexOf(Vn, t + 1)); ) h.push({ type: 7, index: s }), (t += Vn.length - 1);
        }
      s++;
    }
  }
  static createElement(t, e) {
    const n = Gn.createElement('template');
    return (n.innerHTML = t), n;
  }
};
function di(t, e, n = t, i) {
  if (e === hi) return e;
  let r = void 0 !== i ? n._$Co?.[i] : n._$Cl;
  const s = Zn(e) ? void 0 : e._$litDirective$;
  return (
    r?.constructor !== s && (r?._$AO?.(!1), void 0 === s ? (r = void 0) : ((r = new s(t)), r._$AT(t, n, i)), void 0 !== i ? ((n._$Co ??= [])[i] = r) : (n._$Cl = r)),
    void 0 !== r && (e = di(t, r._$AS(t, e.values), r, i)),
    e
  );
}
let gi = class {
    constructor(t, e) {
      (this._$AV = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = e);
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t) {
      const {
          el: { content: e },
          parts: n,
        } = this._$AD,
        i = (t?.creationScope ?? Gn).importNode(e, !0);
      ci.currentNode = i;
      let r = ci.nextNode(),
        s = 0,
        o = 0,
        a = n[0];
      for (; void 0 !== a; ) {
        if (s === a.index) {
          let e;
          2 === a.type
            ? (e = new _i(r, r.nextSibling, this, t))
            : 1 === a.type
              ? (e = new a.ctor(r, a.name, a.strings, this, t))
              : 6 === a.type && (e = new wi(r, this, t)),
            this._$AV.push(e),
            (a = n[++o]);
        }
        s !== a?.index && ((r = ci.nextNode()), s++);
      }
      return (ci.currentNode = Gn), i;
    }
    p(t) {
      let e = 0;
      for (const n of this._$AV) void 0 !== n && (void 0 !== n.strings ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++;
    }
  },
  _i = class t {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, n, i) {
      (this.type = 2),
        (this._$AH = li),
        (this._$AN = void 0),
        (this._$AA = t),
        (this._$AB = e),
        (this._$AM = n),
        (this.options = i),
        (this._$Cv = i?.isConnected ?? !0);
    }
    get parentNode() {
      let t = this._$AA.parentNode;
      const e = this._$AM;
      return void 0 !== e && 11 === t?.nodeType && (t = e.parentNode), t;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t, e = this) {
      (t = di(this, t, e)),
        Zn(t)
          ? t === li || null == t || '' === t
            ? (this._$AH !== li && this._$AR(), (this._$AH = li))
            : t !== this._$AH && t !== hi && this._(t)
          : void 0 !== t._$litType$
            ? this.$(t)
            : void 0 !== t.nodeType
              ? this.T(t)
              : ((t) => Qn(t) || 'function' == typeof t?.[Symbol.iterator])(t)
                ? this.k(t)
                : this._(t);
    }
    O(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), (this._$AH = this.O(t)));
    }
    _(t) {
      this._$AH !== li && Zn(this._$AH) ? (this._$AA.nextSibling.data = t) : this.T(Gn.createTextNode(t)), (this._$AH = t);
    }
    $(t) {
      const { values: e, _$litType$: n } = t,
        i = 'number' == typeof n ? this._$AC(t) : (void 0 === n.el && (n.el = pi.createElement(fi(n.h, n.h[0]), this.options)), n);
      if (this._$AH?._$AD === i) this._$AH.p(e);
      else {
        const t = new gi(i, this),
          n = t.u(this.options);
        t.p(e), this.T(n), (this._$AH = t);
      }
    }
    _$AC(t) {
      let e = ui.get(t.strings);
      return void 0 === e && ui.set(t.strings, (e = new pi(t))), e;
    }
    k(e) {
      Qn(this._$AH) || ((this._$AH = []), this._$AR());
      const n = this._$AH;
      let i,
        r = 0;
      for (const s of e) r === n.length ? n.push((i = new t(this.O(Jn()), this.O(Jn()), this, this.options))) : (i = n[r]), i._$AI(s), r++;
      r < n.length && (this._$AR(i && i._$AB.nextSibling, r), (n.length = r));
    }
    _$AR(t = this._$AA.nextSibling, e) {
      for (this._$AP?.(!1, !0, e); t && t !== this._$AB; ) {
        const e = t.nextSibling;
        t.remove(), (t = e);
      }
    }
    setConnected(t) {
      void 0 === this._$AM && ((this._$Cv = t), this._$AP?.(t));
    }
  },
  vi = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, n, i, r) {
      (this.type = 1),
        (this._$AH = li),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = i),
        (this.options = r),
        n.length > 2 || '' !== n[0] || '' !== n[1] ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n)) : (this._$AH = li);
    }
    _$AI(t, e = this, n, i) {
      const r = this.strings;
      let s = !1;
      if (void 0 === r) (t = di(this, t, e, 0)), (s = !Zn(t) || (t !== this._$AH && t !== hi)), s && (this._$AH = t);
      else {
        const i = t;
        let o, a;
        for (t = r[0], o = 0; o < r.length - 1; o++)
          (a = di(this, i[n + o], e, o)),
            a === hi && (a = this._$AH[o]),
            (s ||= !Zn(a) || a !== this._$AH[o]),
            a === li ? (t = li) : t !== li && (t += (a ?? '') + r[o + 1]),
            (this._$AH[o] = a);
      }
      s && !i && this.j(t);
    }
    j(t) {
      t === li ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? '');
    }
  },
  mi = class extends vi {
    constructor() {
      super(...arguments), (this.type = 3);
    }
    j(t) {
      this.element[this.name] = t === li ? void 0 : t;
    }
  },
  yi = class extends vi {
    constructor() {
      super(...arguments), (this.type = 4);
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== li);
    }
  },
  $i = class extends vi {
    constructor(t, e, n, i, r) {
      super(t, e, n, i, r), (this.type = 5);
    }
    _$AI(t, e = this) {
      if ((t = di(this, t, e, 0) ?? li) === hi) return;
      const n = this._$AH,
        i = (t === li && n !== li) || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive,
        r = t !== li && (n === li || i);
      i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), (this._$AH = t);
    }
    handleEvent(t) {
      'function' == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  },
  wi = class {
    constructor(t, e, n) {
      (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n);
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      di(this, t);
    }
  };
const Ai = Bn.litHtmlPolyfillSupport;
Ai?.(pi, _i), (Bn.litHtmlVersions ??= []).push('3.2.1');
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bi = globalThis,
  xi = bi.ShadowRoot && (void 0 === bi.ShadyCSS || bi.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype,
  Ei = Symbol(),
  Si = new WeakMap();
let Ci = class {
  constructor(t, e, n) {
    if (((this._$cssResult$ = !0), n !== Ei)) throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    (this.cssText = t), (this.t = e);
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (xi && void 0 === t) {
      const n = void 0 !== e && 1 === e.length;
      n && (t = Si.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && Si.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Pi = xi
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return ((t) => new Ci('string' == typeof t ? t : t + '', void 0, Ei))(e);
            })(t)
          : t,
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ { is: Ni, defineProperty: ki, getOwnPropertyDescriptor: Mi, getOwnPropertyNames: Ti, getOwnPropertySymbols: Ui, getPrototypeOf: Oi } = Object,
  Hi = globalThis,
  Ri = Hi.trustedTypes,
  zi = Ri ? Ri.emptyScript : '',
  ji = Hi.reactiveElementPolyfillSupport,
  Li = (t, e) => t,
  qi = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? zi : null;
          break;
        case Object:
        case Array:
          t = null == t ? t : JSON.stringify(t);
      }
      return t;
    },
    fromAttribute(t, e) {
      let n = t;
      switch (e) {
        case Boolean:
          n = null !== t;
          break;
        case Number:
          n = null === t ? null : Number(t);
          break;
        case Object:
        case Array:
          try {
            n = JSON.parse(t);
          } catch (t) {
            n = null;
          }
      }
      return n;
    },
  },
  Di = (t, e) => !Ni(t, e),
  Ii = { attribute: !0, type: String, converter: qi, reflect: !1, hasChanged: Di };
(Symbol.metadata ??= Symbol('metadata')), (Hi.litPropertyMetadata ??= new WeakMap());
class Bi extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Ii) {
    if ((e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor)) {
      const n = Symbol(),
        i = this.getPropertyDescriptor(t, n, e);
      void 0 !== i && ki(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: i, set: r } = Mi(this.prototype, t) ?? {
      get() {
        return this[e];
      },
      set(t) {
        this[e] = t;
      },
    };
    return {
      get() {
        return i?.call(this);
      },
      set(e) {
        const s = i?.call(this);
        r.call(this, e), this.requestUpdate(t, s, n);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ii;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Li('elementProperties'))) return;
    const t = Oi(this);
    t.finalize(), void 0 !== t.l && (this.l = [...t.l]), (this.elementProperties = new Map(t.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(Li('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(Li('properties')))) {
      const t = this.properties,
        e = [...Ti(t), ...Ui(t)];
      for (const n of e) this.createProperty(n, t[n]);
    }
    const t = this[Symbol.metadata];
    if (null !== t) {
      const e = litPropertyMetadata.get(t);
      if (void 0 !== e) for (const [t, n] of e) this.elementProperties.set(t, n);
    }
    this._$Eh = new Map();
    for (const [t, e] of this.elementProperties) {
      const n = this._$Eu(t, e);
      void 0 !== n && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const t of n) e.unshift(Pi(t));
    } else void 0 !== t && e.push(Pi(t));
    return e;
  }
  static _$Eu(t, e) {
    const n = e.attribute;
    return !1 === n ? void 0 : 'string' == typeof n ? n : 'string' == typeof t ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), (this._$Ep = void 0), (this.isUpdatePending = !1), (this.hasUpdated = !1), (this._$Em = null), this._$Ev();
  }
  _$Ev() {
    (this._$ES = new Promise((t) => (this.enableUpdating = t))),
      (this._$AL = new Map()),
      this._$E_(),
      this.requestUpdate(),
      this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = new Map(),
      e = this.constructor.elementProperties;
    for (const n of e.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return (
      ((t, e) => {
        if (xi) t.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
        else
          for (const n of e) {
            const e = document.createElement('style'),
              i = bi.litNonce;
            void 0 !== i && e.setAttribute('nonce', i), (e.textContent = n.cssText), t.appendChild(e);
          }
      })(t, this.constructor.elementStyles),
      t
    );
  }
  connectedCallback() {
    (this.renderRoot ??= this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, n) {
    this._$AK(t, n);
  }
  _$EC(t, e) {
    const n = this.constructor.elementProperties.get(t),
      i = this.constructor._$Eu(t, n);
    if (void 0 !== i && !0 === n.reflect) {
      const r = (void 0 !== n.converter?.toAttribute ? n.converter : qi).toAttribute(e, n.type);
      (this._$Em = t), null == r ? this.removeAttribute(i) : this.setAttribute(i, r), (this._$Em = null);
    }
  }
  _$AK(t, e) {
    const n = this.constructor,
      i = n._$Eh.get(t);
    if (void 0 !== i && this._$Em !== i) {
      const t = n.getPropertyOptions(i),
        r = 'function' == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : qi;
      (this._$Em = i), (this[i] = r.fromAttribute(e, t.type)), (this._$Em = null);
    }
  }
  requestUpdate(t, e, n) {
    if (void 0 !== t) {
      if (((n ??= this.constructor.getPropertyOptions(t)), !(n.hasChanged ?? Di)(this[t], e))) return;
      this.P(t, e, n);
    }
    !1 === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t, e, n) {
    this._$AL.has(t) || this._$AL.set(t, e), !0 === n.reflect && this._$Em !== t && (this._$Ej ??= new Set()).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const t = this.scheduleUpdate();
    return null != t && (await t), !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
        for (const [t, e] of this._$Ep) this[t] = e;
        this._$Ep = void 0;
      }
      const t = this.constructor.elementProperties;
      if (t.size > 0) for (const [e, n] of t) !0 !== n.wrapped || this._$AL.has(e) || void 0 === this[e] || this.P(e, this[e], n);
    }
    let t = !1;
    const e = this._$AL;
    try {
      (t = this.shouldUpdate(e)), t ? (this.willUpdate(e), this._$EO?.forEach((t) => t.hostUpdate?.()), this.update(e)) : this._$EU();
    } catch (e) {
      throw ((t = !1), this._$EU(), e);
    }
    t && this._$AE(e);
  }
  willUpdate(t) {}
  _$AE(t) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)), this.updated(t);
  }
  _$EU() {
    (this._$AL = new Map()), (this.isUpdatePending = !1);
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    (this._$Ej &&= this._$Ej.forEach((t) => this._$EC(t, this[t]))), this._$EU();
  }
  updated(t) {}
  firstUpdated(t) {}
}
(Bi.elementStyles = []),
  (Bi.shadowRootOptions = { mode: 'open' }),
  (Bi[Li('elementProperties')] = new Map()),
  (Bi[Li('finalized')] = new Map()),
  ji?.({ ReactiveElement: Bi }),
  (Hi.reactiveElementVersions ??= []).push('2.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xi = globalThis,
  Wi = Xi.trustedTypes,
  Fi = Wi ? Wi.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  Vi = '$lit$',
  Yi = `lit$${Math.random().toFixed(9).slice(2)}$`,
  Ki = '?' + Yi,
  Gi = `<${Ki}>`,
  Ji = document,
  Zi = () => Ji.createComment(''),
  Qi = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
  tr = Array.isArray,
  er = '[ \t\n\f\r]',
  nr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  ir = /-->/g,
  rr = />/g,
  sr = RegExp(`>|${er}(?:([^\\s"'>=/]+)(${er}*=${er}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  or = /'/g,
  ar = /"/g,
  hr = /^(?:script|style|textarea|title)$/i,
  lr = (
    (t) =>
    (e, ...n) => ({ _$litType$: t, strings: e, values: n })
  )(1),
  ur = Symbol.for('lit-noChange'),
  cr = Symbol.for('lit-nothing'),
  fr = new WeakMap(),
  pr = Ji.createTreeWalker(Ji, 129);
function dr(t, e) {
  if (!tr(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return void 0 !== Fi ? Fi.createHTML(e) : e;
}
const gr = (t, e) => {
  const n = t.length - 1,
    i = [];
  let r,
    s = 2 === e ? '<svg>' : 3 === e ? '<math>' : '',
    o = nr;
  for (let e = 0; e < n; e++) {
    const n = t[e];
    let a,
      h,
      l = -1,
      u = 0;
    for (; u < n.length && ((o.lastIndex = u), (h = o.exec(n)), null !== h); )
      (u = o.lastIndex),
        o === nr
          ? '!--' === h[1]
            ? (o = ir)
            : void 0 !== h[1]
              ? (o = rr)
              : void 0 !== h[2]
                ? (hr.test(h[2]) && (r = RegExp('</' + h[2], 'g')), (o = sr))
                : void 0 !== h[3] && (o = sr)
          : o === sr
            ? '>' === h[0]
              ? ((o = r ?? nr), (l = -1))
              : void 0 === h[1]
                ? (l = -2)
                : ((l = o.lastIndex - h[2].length), (a = h[1]), (o = void 0 === h[3] ? sr : '"' === h[3] ? ar : or))
            : o === ar || o === or
              ? (o = sr)
              : o === ir || o === rr
                ? (o = nr)
                : ((o = sr), (r = void 0));
    const c = o === sr && t[e + 1].startsWith('/>') ? ' ' : '';
    s += o === nr ? n + Gi : l >= 0 ? (i.push(a), n.slice(0, l) + Vi + n.slice(l) + Yi + c) : n + Yi + (-2 === l ? e : c);
  }
  return [dr(t, s + (t[n] || '<?>') + (2 === e ? '</svg>' : 3 === e ? '</math>' : '')), i];
};
class _r {
  constructor({ strings: t, _$litType$: e }, n) {
    let i;
    this.parts = [];
    let r = 0,
      s = 0;
    const o = t.length - 1,
      a = this.parts,
      [h, l] = gr(t, e);
    if (((this.el = _r.createElement(h, n)), (pr.currentNode = this.el.content), 2 === e || 3 === e)) {
      const t = this.el.content.firstChild;
      t.replaceWith(...t.childNodes);
    }
    for (; null !== (i = pr.nextNode()) && a.length < o; ) {
      if (1 === i.nodeType) {
        if (i.hasAttributes())
          for (const t of i.getAttributeNames())
            if (t.endsWith(Vi)) {
              const e = l[s++],
                n = i.getAttribute(t).split(Yi),
                o = /([.?@])?(.*)/.exec(e);
              a.push({ type: 1, index: r, name: o[2], strings: n, ctor: '.' === o[1] ? wr : '?' === o[1] ? Ar : '@' === o[1] ? br : $r }), i.removeAttribute(t);
            } else t.startsWith(Yi) && (a.push({ type: 6, index: r }), i.removeAttribute(t));
        if (hr.test(i.tagName)) {
          const t = i.textContent.split(Yi),
            e = t.length - 1;
          if (e > 0) {
            i.textContent = Wi ? Wi.emptyScript : '';
            for (let n = 0; n < e; n++) i.append(t[n], Zi()), pr.nextNode(), a.push({ type: 2, index: ++r });
            i.append(t[e], Zi());
          }
        }
      } else if (8 === i.nodeType)
        if (i.data === Ki) a.push({ type: 2, index: r });
        else {
          let t = -1;
          for (; -1 !== (t = i.data.indexOf(Yi, t + 1)); ) a.push({ type: 7, index: r }), (t += Yi.length - 1);
        }
      r++;
    }
  }
  static createElement(t, e) {
    const n = Ji.createElement('template');
    return (n.innerHTML = t), n;
  }
}
function vr(t, e, n = t, i) {
  if (e === ur) return e;
  let r = void 0 !== i ? n._$Co?.[i] : n._$Cl;
  const s = Qi(e) ? void 0 : e._$litDirective$;
  return (
    r?.constructor !== s && (r?._$AO?.(!1), void 0 === s ? (r = void 0) : ((r = new s(t)), r._$AT(t, n, i)), void 0 !== i ? ((n._$Co ??= [])[i] = r) : (n._$Cl = r)),
    void 0 !== r && (e = vr(t, r._$AS(t, e.values), r, i)),
    e
  );
}
class mr {
  constructor(t, e) {
    (this._$AV = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = e);
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const {
        el: { content: e },
        parts: n,
      } = this._$AD,
      i = (t?.creationScope ?? Ji).importNode(e, !0);
    pr.currentNode = i;
    let r = pr.nextNode(),
      s = 0,
      o = 0,
      a = n[0];
    for (; void 0 !== a; ) {
      if (s === a.index) {
        let e;
        2 === a.type
          ? (e = new yr(r, r.nextSibling, this, t))
          : 1 === a.type
            ? (e = new a.ctor(r, a.name, a.strings, this, t))
            : 6 === a.type && (e = new xr(r, this, t)),
          this._$AV.push(e),
          (a = n[++o]);
      }
      s !== a?.index && ((r = pr.nextNode()), s++);
    }
    return (pr.currentNode = Ji), i;
  }
  p(t) {
    let e = 0;
    for (const n of this._$AV) void 0 !== n && (void 0 !== n.strings ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++;
  }
}
class yr {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, n, i) {
    (this.type = 2),
      (this._$AH = cr),
      (this._$AN = void 0),
      (this._$AA = t),
      (this._$AB = e),
      (this._$AM = n),
      (this.options = i),
      (this._$Cv = i?.isConnected ?? !0);
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return void 0 !== e && 11 === t?.nodeType && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    (t = vr(this, t, e)),
      Qi(t)
        ? t === cr || null == t || '' === t
          ? (this._$AH !== cr && this._$AR(), (this._$AH = cr))
          : t !== this._$AH && t !== ur && this._(t)
        : void 0 !== t._$litType$
          ? this.$(t)
          : void 0 !== t.nodeType
            ? this.T(t)
            : ((t) => tr(t) || 'function' == typeof t?.[Symbol.iterator])(t)
              ? this.k(t)
              : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), (this._$AH = this.O(t)));
  }
  _(t) {
    this._$AH !== cr && Qi(this._$AH) ? (this._$AA.nextSibling.data = t) : this.T(Ji.createTextNode(t)), (this._$AH = t);
  }
  $(t) {
    const { values: e, _$litType$: n } = t,
      i = 'number' == typeof n ? this._$AC(t) : (void 0 === n.el && (n.el = _r.createElement(dr(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const t = new mr(i, this),
        n = t.u(this.options);
      t.p(e), this.T(n), (this._$AH = t);
    }
  }
  _$AC(t) {
    let e = fr.get(t.strings);
    return void 0 === e && fr.set(t.strings, (e = new _r(t))), e;
  }
  k(t) {
    tr(this._$AH) || ((this._$AH = []), this._$AR());
    const e = this._$AH;
    let n,
      i = 0;
    for (const r of t) i === e.length ? e.push((n = new yr(this.O(Zi()), this.O(Zi()), this, this.options))) : (n = e[i]), n._$AI(r), i++;
    i < e.length && (this._$AR(n && n._$AB.nextSibling, i), (e.length = i));
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t && t !== this._$AB; ) {
      const e = t.nextSibling;
      t.remove(), (t = e);
    }
  }
  setConnected(t) {
    void 0 === this._$AM && ((this._$Cv = t), this._$AP?.(t));
  }
}
class $r {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, n, i, r) {
    (this.type = 1),
      (this._$AH = cr),
      (this._$AN = void 0),
      (this.element = t),
      (this.name = e),
      (this._$AM = i),
      (this.options = r),
      n.length > 2 || '' !== n[0] || '' !== n[1] ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n)) : (this._$AH = cr);
  }
  _$AI(t, e = this, n, i) {
    const r = this.strings;
    let s = !1;
    if (void 0 === r) (t = vr(this, t, e, 0)), (s = !Qi(t) || (t !== this._$AH && t !== ur)), s && (this._$AH = t);
    else {
      const i = t;
      let o, a;
      for (t = r[0], o = 0; o < r.length - 1; o++)
        (a = vr(this, i[n + o], e, o)),
          a === ur && (a = this._$AH[o]),
          (s ||= !Qi(a) || a !== this._$AH[o]),
          a === cr ? (t = cr) : t !== cr && (t += (a ?? '') + r[o + 1]),
          (this._$AH[o] = a);
    }
    s && !i && this.j(t);
  }
  j(t) {
    t === cr ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? '');
  }
}
class wr extends $r {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(t) {
    this.element[this.name] = t === cr ? void 0 : t;
  }
}
class Ar extends $r {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== cr);
  }
}
class br extends $r {
  constructor(t, e, n, i, r) {
    super(t, e, n, i, r), (this.type = 5);
  }
  _$AI(t, e = this) {
    if ((t = vr(this, t, e, 0) ?? cr) === ur) return;
    const n = this._$AH,
      i = (t === cr && n !== cr) || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive,
      r = t !== cr && (n === cr || i);
    i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), (this._$AH = t);
  }
  handleEvent(t) {
    'function' == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class xr {
  constructor(t, e, n) {
    (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    vr(this, t);
  }
}
const Er = Xi.litHtmlPolyfillSupport;
Er?.(_r, yr), (Xi.litHtmlVersions ??= []).push('3.2.1');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Sr = class extends Bi {
  constructor() {
    super(...arguments), (this.renderOptions = { host: this }), (this._$Do = void 0);
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return (this.renderOptions.renderBefore ??= t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(t),
      (this._$Do = ((t, e, n) => {
        const i = n?.renderBefore ?? e;
        let r = i._$litPart$;
        if (void 0 === r) {
          const t = n?.renderBefore ?? null;
          i._$litPart$ = r = new yr(e.insertBefore(Zi(), t), t, void 0, n ?? {});
        }
        return r._$AI(t), r;
      })(e, this.renderRoot, this.renderOptions));
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ur;
  }
};
(Sr._$litElement$ = !0), (Sr.finalized = !0), globalThis.litElementHydrateSupport?.({ LitElement: Sr });
const Cr = globalThis.litElementPolyfillSupport;
Cr?.({ LitElement: Sr }), (globalThis.litElementVersions ??= []).push('4.1.1');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pr = { attribute: !0, type: String, converter: Ln, reflect: !1, hasChanged: qn },
  Nr = (t = Pr, e, n) => {
    const { kind: i, metadata: r } = n;
    let s = globalThis.litPropertyMetadata.get(r);
    if ((void 0 === s && globalThis.litPropertyMetadata.set(r, (s = new Map())), s.set(n.name, t), 'accessor' === i)) {
      const { name: i } = n;
      return {
        set(n) {
          const r = e.get.call(this);
          e.set.call(this, n), this.requestUpdate(i, r, t);
        },
        init(e) {
          return void 0 !== e && this.P(i, void 0, t), e;
        },
      };
    }
    if ('setter' === i) {
      const { name: i } = n;
      return function (n) {
        const r = this[i];
        e.call(this, n), this.requestUpdate(i, r, t);
      };
    }
    throw Error('Unsupported decorator location: ' + i);
  };
function kr(t) {
  return (e, n) =>
    'object' == typeof n
      ? Nr(t, e, n)
      : ((t, e, n) => {
          const i = e.hasOwnProperty(n);
          return e.constructor.createProperty(n, i ? { ...t, wrapped: !0 } : t), i ? Object.getOwnPropertyDescriptor(e, n) : void 0;
        })(t, e, n);
}
var Mr;
const Tr = [
    'length',
    'width',
    'height',
    'margin-top',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'margin-color',
    'font-family',
    'min-font-size',
    'fade-font-size',
    'max-font-size',
  ],
  Ur = ['letter-order'],
  Or = Array.from('HYAVLIMFWSTQNKRDEPCG'),
  Hr = '#15A4A4',
  Rr = '#80A0F0',
  zr = '#15C015',
  jr = '#F01505',
  Lr = '#C048C0',
  qr = {
    H: Hr,
    Y: Hr,
    A: Rr,
    V: Rr,
    L: Rr,
    I: Rr,
    M: Rr,
    F: Rr,
    W: Rr,
    S: zr,
    T: zr,
    N: zr,
    Q: zr,
    K: jr,
    R: jr,
    D: Lr,
    E: Lr,
    P: '#C0C000',
    C: '#F08080',
    G: '#F09048',
  };
let Dr = class extends e(n(i(r(s(o(a(h(t)))))))) {
  constructor() {
    super(...arguments),
      (this['letter-order'] = 'default'),
      (this['font-family'] = 'Helvetica,sans-serif'),
      (this['min-font-size'] = 6),
      (this['fade-font-size'] = 12),
      (this['max-font-size'] = 24),
      Mr.set(this, void 0),
      (this._drawStamp = {}),
      (this.requestDraw = () => this._drawer.requestRefresh()),
      (this._drawer = l(() => this._draw()));
  }
  connectedCallback() {
    super.connectedCallback(), this.data && this.createTrack();
  }
  get data() {
    return (function (t, e, n, i) {
      if ('a' === n && !i) throw new TypeError('Private accessor was defined without a getter');
      if ('function' == typeof e ? t !== e || !i : !e.has(t)) throw new TypeError('Cannot read private member from an object whose class did not declare it');
      return 'm' === n ? i : 'a' === n ? i.call(t) : i ? i.value : e.get(t);
    })(this, Mr, 'f');
  }
  set data(t) {
    !(function (t, e, n, i, r) {
      if ('m' === i) throw new TypeError('Private method is not writable');
      if ('a' === i && !r) throw new TypeError('Private accessor was defined without a setter');
      if ('function' == typeof e ? t !== e || !r : !e.has(t)) throw new TypeError('Cannot write private member to an object whose class did not declare it');
      'a' === i ? r.call(t, n) : r ? (r.value = n) : e.set(t, n);
    })(this, Mr, t, 'f'),
      t
        ? 'probability' === this['letter-order']
          ? (this.yPositions = (function (t) {
              var e;
              const n = Object.keys(t),
                i = {},
                r = {};
              for (const t of n) (i[t] = []), (r[t] = []);
              const s = Math.max(0, ...n.map((e) => t[e].length));
              for (let o = 0; o < s; o++) {
                let s = 0;
                n.sort((e, n) => {
                  var i, r;
                  return (null !== (i = t[n][o]) && void 0 !== i ? i : 0) - (null !== (r = t[e][o]) && void 0 !== r ? r : 0);
                });
                for (const a of n) i[a].push(s), (s += null !== (e = t[a][o]) && void 0 !== e ? e : 0), r[a].push(s);
              }
              return { start: i, end: r };
            })(t.probabilities))
          : (this.yPositions = (function (t, e) {
              var n;
              const i = (function (t, e) {
                  const n = new Set(t),
                    i = new Set(e),
                    r = e.filter((t) => n.has(t)),
                    s = t.filter((t) => !i.has(t));
                  return r.concat(s);
                })(Object.keys(t), e),
                r = {},
                s = {};
              for (const t of i) (r[t] = []), (s[t] = []);
              const o = Math.max(0, ...i.map((e) => t[e].length));
              for (let e = 0; e < o; e++) {
                let o = 0;
                for (const a of i) r[a].push(o), (o += null !== (n = t[a][e]) && void 0 !== n ? n : 0), s[a].push(o);
              }
              return { start: r, end: s };
            })(t.probabilities, Or))
        : (this.yPositions = void 0),
      this.createTrack();
  }
  attributeChangedCallback(t, e, n) {
    super.attributeChangedCallback(t, e, n), Ur.includes(t) ? (this.data = this.data) : Tr.includes(t) && (this.onDimensionsChange(), this.createTrack());
  }
  createTrack() {
    this.svg && (this.svg.selectAll('g').remove(), this.unbindEvents(this.svg)),
      (this.svg = (function (t) {
        return 'string' == typeof t ? new Nt([[document.querySelector(t)]], [document.documentElement]) : new Nt([[t]], Pt);
      })(this)
        .selectAll('svg')
        .attr('width', this.width)
        .attr('height', this.height)),
      this.svg && (this.bindEvents(this.svg), (this.highlighted = this.svg.append('g').attr('class', 'highlighted')));
  }
  refresh() {
    this.requestDraw(), this.updateHighlight();
  }
  needsRedraw() {
    const t = {
      data: this.data,
      canvas: this.canvasCtx,
      extent: `${this.width}x${this.height}@${this.canvasScale}/${this.getSeqPositionFromX(0)}:${this.getSeqPositionFromX(this.width)}`,
    };
    for (const e of Ur) t[e] = this.getAttribute(e);
    for (const e of Tr) t[e] = this.getAttribute(e);
    return (
      !(function (t, e) {
        for (const n in t) if (t[n] !== e[n]) return !1;
        for (const n in e) if (t[n] !== e[n]) return !1;
        return !0;
      })(t, this._drawStamp) && ((this._drawStamp = t), !0)
    );
  }
  _draw() {
    this.needsRedraw() && (this.adjustCanvasCtxLogicalSize(), this.clearCanvas(), this.drawColumns(), this.drawMargins());
  }
  clearCanvas() {
    const t = this.canvasCtx;
    t && t.clearRect(0, 0, t.canvas.width, t.canvas.height);
  }
  drawColumns() {
    var t, e, n, i;
    const r = this.canvasCtx;
    if (!r) return;
    if (!this.data) return;
    const s = this.canvasScale,
      o = this.getSingleBaseWidth(),
      a = s * o,
      h = this.getFontOpacity(o),
      l = s * this['margin-top'],
      c = s * (this.height - this['margin-top'] - this['margin-bottom']);
    (r.lineWidth = s * Math.min(1, 0.2 * o)), (r.strokeStyle = '#D3D3D3'), (r.textAlign = 'center'), (r.textBaseline = 'middle');
    const f = null !== (t = this.getSeqPositionFromX(-0.5)) && void 0 !== t ? t : -1 / 0,
      p = null !== (e = this.getSeqPositionFromX(this.width + 0.5)) && void 0 !== e ? e : 1 / 0,
      d = Math.max(
        0,
        u.firstGteqIndex(this.data.index, f - 1, (t) => t)
      ),
      g = Math.min(
        this.data.index.length,
        u.firstGteqIndex(this.data.index, p, (t) => t)
      );
    for (let t = d; t < g; t++) {
      const e = s * this.getXFromSeqPosition(this.data.index[t]),
        o = e + 0.5 * a;
      for (const u in null === (n = this.yPositions) || void 0 === n ? void 0 : n.start) {
        const n = Math.min(this.yPositions.start[u][t], 1) * c + l,
          f = Math.min(this.yPositions.end[u][t], 1) * c + l - n;
        if (((r.globalAlpha = 1), (r.fillStyle = null !== (i = qr[u]) && void 0 !== i ? i : '#AAAAAA'), r.fillRect(e, n, a, f), r.strokeRect(e, n, a, f), 0 === h))
          continue;
        const p = Math.min(a, f, s * this['max-font-size']);
        if (p < s * this['min-font-size']) continue;
        const d = n + 0.5 * f;
        (r.globalAlpha = h), (r.fillStyle = 'black'), (r.font = `${p}px ${this['font-family']}`), r.fillText(u, o, d);
      }
    }
  }
  drawMargins() {
    const t = this.canvasCtx;
    if (!t) return;
    const e = t.canvas.width,
      n = t.canvas.height,
      i = this['margin-left'] * this.canvasScale,
      r = this['margin-right'] * this.canvasScale,
      s = this['margin-top'] * this.canvasScale,
      o = this['margin-bottom'] * this.canvasScale;
    (t.globalAlpha = 1),
      (t.fillStyle = this['margin-color']),
      t.fillRect(0, 0, i, n),
      t.fillRect(e - r, 0, r, n),
      t.fillRect(i, 0, e - i - r, s),
      t.fillRect(i, n - o, e - i - r, o);
  }
  getFontOpacity(t) {
    return t < this['min-font-size'] ? 0 : t < this['fade-font-size'] ? (t - this['min-font-size']) / (this['fade-font-size'] - this['min-font-size']) : 1;
  }
  getSeqPositionFromX(t) {
    var e;
    return null === (e = this.xScale) || void 0 === e ? void 0 : e.invert(t - this['margin-left']);
  }
  updateHighlight() {
    if (!this.highlighted) return;
    const t = this.highlighted.selectAll('rect').data(this.highlightedRegion.segments);
    t
      .enter()
      .append('rect')
      .style('pointer-events', 'none')
      .merge(t)
      .attr('fill', this['highlight-color'])
      .attr('height', this.height)
      .attr('x', (t) => this.getXFromSeqPosition(t.start))
      .attr('width', (t) => Math.max(0, this.getSingleBaseWidth() * (t.end - t.start + 1))),
      t.exit().remove();
  }
  zoomRefreshed() {
    this.getWidthWithMargins() > 0 && this.refresh();
  }
  firstUpdated(t) {
    super.firstUpdated(t), this.createTrack();
  }
  render() {
    return lr`
      <div class="container">
        <div style="position: relative; z-index: 0;">
          <canvas style="position: absolute; left: 0; top: 0; z-index: -1;"></canvas>
          <svg></svg>
        </div>
      </div>
    `;
  }
  onCanvasScaleChange() {
    super.onCanvasScaleChange(), this.refresh();
  }
  bindEvents(t) {
    t.on('click.NightingaleConservationTrack', (t) => this.handleClick(t)),
      t.on('mousemove.NightingaleConservationTrack', (t) => this.handleMousemove(t)),
      t.on('mouseout.NightingaleConservationTrack', (t) => this.handleMouseout(t));
  }
  unbindEvents(t) {
    t.on('click.NightingaleConservationTrack', null), t.on('mousemove.NightingaleConservationTrack', null), t.on('mouseout.NightingaleConservationTrack', null);
  }
  handleClick(t) {
    const e = this.getPointedAminoAcid(t.offsetX, t.offsetY);
    if (void 0 === e) return;
    const n = 'onclick' === this.getAttribute('highlight-event'),
      i = c('click', e, n, !0, e.position, e.position, t.target instanceof HTMLElement ? t.target : void 0, t, this);
    this.dispatchEvent(i);
  }
  handleMousemove(t) {
    const e = this.getPointedAminoAcid(t.offsetX, t.offsetY);
    if (void 0 === e) return this.handleMouseout(t);
    const n = 'onmouseover' === this.getAttribute('highlight-event'),
      i = c('mouseover', e, n, !1, e.position, e.position, t.target instanceof HTMLElement ? t.target : void 0, t, this);
    this.dispatchEvent(i);
  }
  handleMouseout(t) {
    const e = 'onmouseover' === this.getAttribute('highlight-event'),
      n = c('mouseout', null, e, void 0, void 0, void 0, t.target instanceof HTMLElement ? t.target : void 0, t, this);
    this.dispatchEvent(n);
  }
  getPointedAminoAcid(t, e) {
    var n;
    if (!this.data) return;
    if (!this.yPositions) return;
    const i = this.getSeqPositionFromX(t);
    if (void 0 === i) return;
    const r = Math.floor(i),
      s = u.firstEqIndex(this.data.index, r, (t) => t);
    if (void 0 === s) return;
    const o = (e - this['margin-top']) / (this.height - this['margin-top'] - this['margin-bottom']);
    for (const t in this.yPositions.start)
      if (o >= this.yPositions.start[t][s] && o < this.yPositions.end[t][s])
        return { position: r, aa: t, probability: null !== (n = this.data.probabilities[t][s]) && void 0 !== n ? n : 0 };
  }
};
(Mr = new WeakMap()),
  p([kr({ type: String })], Dr.prototype, 'letter-order', void 0),
  p([kr({ type: String })], Dr.prototype, 'font-family', void 0),
  p([kr({ type: Number })], Dr.prototype, 'min-font-size', void 0),
  p([kr({ type: Number })], Dr.prototype, 'fade-font-size', void 0),
  p([kr({ type: Number })], Dr.prototype, 'max-font-size', void 0),
  (Dr = p([f('nightingale-conservation-track')], Dr));
var Ir = Dr;
export { Ir as default };
//# sourceMappingURL=index.js.map
