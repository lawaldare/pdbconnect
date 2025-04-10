import t from '@nightingale-elements/nightingale-track';
export * from '@nightingale-elements/nightingale-track';
import { customElementOnce as e, createEvent as n } from '@nightingale-elements/nightingale-new-core';
'function' == typeof SuppressedError && SuppressedError;
var i = { value: () => {} };
function r() {
  for (var t, e = 0, n = arguments.length, i = {}; e < n; ++e) {
    if (!(t = arguments[e] + '') || t in i || /[\s.]/.test(t)) throw new Error('illegal type: ' + t);
    i[t] = [];
  }
  return new s(i);
}
function s(t) {
  this._ = t;
}
function o(t, e) {
  for (var n, i = 0, r = t.length; i < r; ++i) if ((n = t[i]).name === e) return n.value;
}
function a(t, e, n) {
  for (var r = 0, s = t.length; r < s; ++r)
    if (t[r].name === e) {
      (t[r] = i), (t = t.slice(0, r).concat(t.slice(r + 1)));
      break;
    }
  return null != n && t.push({ name: e, value: n }), t;
}
s.prototype = r.prototype = {
  constructor: s,
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
      h = -1,
      l = s.length;
    if (!(arguments.length < 2)) {
      if (null != e && 'function' != typeof e) throw new Error('invalid callback: ' + e);
      for (; ++h < l; )
        if ((n = (t = s[h]).type)) r[n] = a(r[n], t.name, e);
        else if (null == e) for (n in r) r[n] = a(r[n], t.name, null);
      return this;
    }
    for (; ++h < l; ) if ((n = (t = s[h]).type) && (n = o(r[n], t.name))) return n;
  },
  copy: function () {
    var t = {},
      e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new s(t);
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
var h = 'http://www.w3.org/1999/xhtml',
  l = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: h,
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
  };
function c(t) {
  var e = (t += ''),
    n = e.indexOf(':');
  return n >= 0 && 'xmlns' !== (e = t.slice(0, n)) && (t = t.slice(n + 1)), l.hasOwnProperty(e) ? { space: l[e], local: t } : t;
}
function u(t) {
  return function () {
    var e = this.ownerDocument,
      n = this.namespaceURI;
    return n === h && e.documentElement.namespaceURI === h ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function f(t) {
  return function () {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function p(t) {
  var e = c(t);
  return (e.local ? f : u)(e);
}
function d() {}
function g(t) {
  return null == t
    ? d
    : function () {
        return this.querySelector(t);
      };
}
function _() {
  return [];
}
function v(t) {
  return null == t
    ? _
    : function () {
        return this.querySelectorAll(t);
      };
}
function m(t) {
  return function () {
    return (function (t) {
      return null == t ? [] : Array.isArray(t) ? t : Array.from(t);
    })(t.apply(this, arguments));
  };
}
function y(t) {
  return function () {
    return this.matches(t);
  };
}
function $(t) {
  return function (e) {
    return e.matches(t);
  };
}
var w = Array.prototype.find;
function A() {
  return this.firstElementChild;
}
var b = Array.prototype.filter;
function S() {
  return Array.from(this.children);
}
function x(t) {
  return new Array(t.length);
}
function E(t, e) {
  (this.ownerDocument = t.ownerDocument), (this.namespaceURI = t.namespaceURI), (this._next = null), (this._parent = t), (this.__data__ = e);
}
function P(t, e, n, i, r, s) {
  for (var o, a = 0, h = e.length, l = s.length; a < l; ++a) (o = e[a]) ? ((o.__data__ = s[a]), (i[a] = o)) : (n[a] = new E(t, s[a]));
  for (; a < h; ++a) (o = e[a]) && (r[a] = o);
}
function T(t, e, n, i, r, s, o) {
  var a,
    h,
    l,
    c = new Map(),
    u = e.length,
    f = s.length,
    p = new Array(u);
  for (a = 0; a < u; ++a) (h = e[a]) && ((p[a] = l = o.call(h, h.__data__, a, e) + ''), c.has(l) ? (r[a] = h) : c.set(l, h));
  for (a = 0; a < f; ++a) (l = o.call(t, s[a], a, s) + ''), (h = c.get(l)) ? ((i[a] = h), (h.__data__ = s[a]), c.delete(l)) : (n[a] = new E(t, s[a]));
  for (a = 0; a < u; ++a) (h = e[a]) && c.get(p[a]) === h && (r[a] = h);
}
function C(t) {
  return t.__data__;
}
function k(t) {
  return 'object' == typeof t && 'length' in t ? t : Array.from(t);
}
function M(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function N(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function U(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function O(t, e) {
  return function () {
    this.setAttribute(t, e);
  };
}
function H(t, e) {
  return function () {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function R(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function I(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function j(t) {
  return (t.ownerDocument && t.ownerDocument.defaultView) || (t.document && t) || t.defaultView;
}
function L(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
function z(t, e, n) {
  return function () {
    this.style.setProperty(t, e, n);
  };
}
function q(t, e, n) {
  return function () {
    var i = e.apply(this, arguments);
    null == i ? this.style.removeProperty(t) : this.style.setProperty(t, i, n);
  };
}
function D(t, e) {
  return t.style.getPropertyValue(e) || j(t).getComputedStyle(t, null).getPropertyValue(e);
}
function B(t) {
  return function () {
    delete this[t];
  };
}
function X(t, e) {
  return function () {
    this[t] = e;
  };
}
function F(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? delete this[t] : (this[t] = n);
  };
}
function W(t) {
  return t.trim().split(/^|\s+/);
}
function V(t) {
  return t.classList || new Y(t);
}
function Y(t) {
  (this._node = t), (this._names = W(t.getAttribute('class') || ''));
}
function K(t, e) {
  for (var n = V(t), i = -1, r = e.length; ++i < r; ) n.add(e[i]);
}
function J(t, e) {
  for (var n = V(t), i = -1, r = e.length; ++i < r; ) n.remove(e[i]);
}
function Z(t) {
  return function () {
    K(this, t);
  };
}
function Q(t) {
  return function () {
    J(this, t);
  };
}
function G(t, e) {
  return function () {
    (e.apply(this, arguments) ? K : J)(this, t);
  };
}
function tt() {
  this.textContent = '';
}
function et(t) {
  return function () {
    this.textContent = t;
  };
}
function nt(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.textContent = e ?? '';
  };
}
function it() {
  this.innerHTML = '';
}
function rt(t) {
  return function () {
    this.innerHTML = t;
  };
}
function st(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? '';
  };
}
function ot() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function at() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ht() {
  return null;
}
function lt() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function ct() {
  var t = this.cloneNode(!1),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function ut() {
  var t = this.cloneNode(!0),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function ft(t) {
  return function () {
    var e = this.__on;
    if (e) {
      for (var n, i = 0, r = -1, s = e.length; i < s; ++i)
        (n = e[i]), (t.type && n.type !== t.type) || n.name !== t.name ? (e[++r] = n) : this.removeEventListener(n.type, n.listener, n.options);
      ++r ? (e.length = r) : delete this.__on;
    }
  };
}
function pt(t, e, n) {
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
function dt(t, e, n) {
  var i = j(t),
    r = i.CustomEvent;
  'function' == typeof r
    ? (r = new r(e, n))
    : ((r = i.document.createEvent('Event')), n ? (r.initEvent(e, n.bubbles, n.cancelable), (r.detail = n.detail)) : r.initEvent(e, !1, !1)),
    t.dispatchEvent(r);
}
function gt(t, e) {
  return function () {
    return dt(this, t, e);
  };
}
function _t(t, e) {
  return function () {
    return dt(this, t, e.apply(this, arguments));
  };
}
(E.prototype = {
  constructor: E,
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
  (Y.prototype = {
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
var vt = [null];
function mt(t, e) {
  (this._groups = t), (this._parents = e);
}
function yt() {
  return new mt([[document.documentElement]], vt);
}
function $t(t) {
  return 'string' == typeof t ? new mt([[document.querySelector(t)]], [document.documentElement]) : new mt([[t]], vt);
}
function wt(t, e, n) {
  (t.prototype = e.prototype = n), (n.constructor = t);
}
function At(t, e) {
  var n = Object.create(t.prototype);
  for (var i in e) n[i] = e[i];
  return n;
}
function bt() {}
mt.prototype = yt.prototype = {
  constructor: mt,
  select: function (t) {
    'function' != typeof t && (t = g(t));
    for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
      for (var s, o, a = e[r], h = a.length, l = (i[r] = new Array(h)), c = 0; c < h; ++c)
        (s = a[c]) && (o = t.call(s, s.__data__, c, a)) && ('__data__' in s && (o.__data__ = s.__data__), (l[c] = o));
    return new mt(i, this._parents);
  },
  selectAll: function (t) {
    t = 'function' == typeof t ? m(t) : v(t);
    for (var e = this._groups, n = e.length, i = [], r = [], s = 0; s < n; ++s)
      for (var o, a = e[s], h = a.length, l = 0; l < h; ++l) (o = a[l]) && (i.push(t.call(o, o.__data__, l, a)), r.push(o));
    return new mt(i, r);
  },
  selectChild: function (t) {
    return this.select(
      null == t
        ? A
        : (function (t) {
            return function () {
              return w.call(this.children, t);
            };
          })('function' == typeof t ? t : $(t))
    );
  },
  selectChildren: function (t) {
    return this.selectAll(
      null == t
        ? S
        : (function (t) {
            return function () {
              return b.call(this.children, t);
            };
          })('function' == typeof t ? t : $(t))
    );
  },
  filter: function (t) {
    'function' != typeof t && (t = y(t));
    for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
      for (var s, o = e[r], a = o.length, h = (i[r] = []), l = 0; l < a; ++l) (s = o[l]) && t.call(s, s.__data__, l, o) && h.push(s);
    return new mt(i, this._parents);
  },
  data: function (t, e) {
    if (!arguments.length) return Array.from(this, C);
    var n = e ? T : P,
      i = this._parents,
      r = this._groups;
    'function' != typeof t &&
      (t = (function (t) {
        return function () {
          return t;
        };
      })(t));
    for (var s = r.length, o = new Array(s), a = new Array(s), h = new Array(s), l = 0; l < s; ++l) {
      var c = i[l],
        u = r[l],
        f = u.length,
        p = k(t.call(c, c && c.__data__, l, i)),
        d = p.length,
        g = (a[l] = new Array(d)),
        _ = (o[l] = new Array(d));
      n(c, u, g, _, (h[l] = new Array(f)), p, e);
      for (var v, m, y = 0, $ = 0; y < d; ++y)
        if ((v = g[y])) {
          for (y >= $ && ($ = y + 1); !(m = _[$]) && ++$ < d; );
          v._next = m || null;
        }
    }
    return ((o = new mt(o, i))._enter = a), (o._exit = h), o;
  },
  enter: function () {
    return new mt(this._enter || this._groups.map(x), this._parents);
  },
  exit: function () {
    return new mt(this._exit || this._groups.map(x), this._parents);
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
      for (var l, c = n[h], u = i[h], f = c.length, p = (a[h] = new Array(f)), d = 0; d < f; ++d) (l = c[d] || u[d]) && (p[d] = l);
    for (; h < r; ++h) a[h] = n[h];
    return new mt(a, this._parents);
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
    t || (t = M);
    for (var n = this._groups, i = n.length, r = new Array(i), s = 0; s < i; ++s) {
      for (var o, a = n[s], h = a.length, l = (r[s] = new Array(h)), c = 0; c < h; ++c) (o = a[c]) && (l[c] = o);
      l.sort(e);
    }
    return new mt(r, this._parents).order();
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
    var n = c(t);
    if (arguments.length < 2) {
      var i = this.node();
      return n.local ? i.getAttributeNS(n.space, n.local) : i.getAttribute(n);
    }
    return this.each((null == e ? (n.local ? U : N) : 'function' == typeof e ? (n.local ? I : R) : n.local ? H : O)(n, e));
  },
  style: function (t, e, n) {
    return arguments.length > 1 ? this.each((null == e ? L : 'function' == typeof e ? q : z)(t, e, n ?? '')) : D(this.node(), t);
  },
  property: function (t, e) {
    return arguments.length > 1 ? this.each((null == e ? B : 'function' == typeof e ? F : X)(t, e)) : this.node()[t];
  },
  classed: function (t, e) {
    var n = W(t + '');
    if (arguments.length < 2) {
      for (var i = V(this.node()), r = -1, s = n.length; ++r < s; ) if (!i.contains(n[r])) return !1;
      return !0;
    }
    return this.each(('function' == typeof e ? G : e ? Z : Q)(n, e));
  },
  text: function (t) {
    return arguments.length ? this.each(null == t ? tt : ('function' == typeof t ? nt : et)(t)) : this.node().textContent;
  },
  html: function (t) {
    return arguments.length ? this.each(null == t ? it : ('function' == typeof t ? st : rt)(t)) : this.node().innerHTML;
  },
  raise: function () {
    return this.each(ot);
  },
  lower: function () {
    return this.each(at);
  },
  append: function (t) {
    var e = 'function' == typeof t ? t : p(t);
    return this.select(function () {
      return this.appendChild(e.apply(this, arguments));
    });
  },
  insert: function (t, e) {
    var n = 'function' == typeof t ? t : p(t),
      i = null == e ? ht : 'function' == typeof e ? e : g(e);
    return this.select(function () {
      return this.insertBefore(n.apply(this, arguments), i.apply(this, arguments) || null);
    });
  },
  remove: function () {
    return this.each(lt);
  },
  clone: function (t) {
    return this.select(t ? ut : ct);
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
      for (a = e ? pt : ft, i = 0; i < o; ++i) this.each(a(s[i], e, n));
      return this;
    }
    var a = this.node().__on;
    if (a) for (var h, l = 0, c = a.length; l < c; ++l) for (i = 0, h = a[l]; i < o; ++i) if ((r = s[i]).type === h.type && r.name === h.name) return h.value;
  },
  dispatch: function (t, e) {
    return this.each(('function' == typeof e ? _t : gt)(t, e));
  },
  [Symbol.iterator]: function* () {
    for (var t = this._groups, e = 0, n = t.length; e < n; ++e) for (var i, r = t[e], s = 0, o = r.length; s < o; ++s) (i = r[s]) && (yield i);
  },
};
var St = 0.7,
  xt = 1 / St,
  Et = '\\s*([+-]?\\d+)\\s*',
  Pt = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*',
  Tt = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
  Ct = /^#([0-9a-f]{3,8})$/,
  kt = new RegExp(`^rgb\\(${Et},${Et},${Et}\\)$`),
  Mt = new RegExp(`^rgb\\(${Tt},${Tt},${Tt}\\)$`),
  Nt = new RegExp(`^rgba\\(${Et},${Et},${Et},${Pt}\\)$`),
  Ut = new RegExp(`^rgba\\(${Tt},${Tt},${Tt},${Pt}\\)$`),
  Ot = new RegExp(`^hsl\\(${Pt},${Tt},${Tt}\\)$`),
  Ht = new RegExp(`^hsla\\(${Pt},${Tt},${Tt},${Pt}\\)$`),
  Rt = {
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
function It() {
  return this.rgb().formatHex();
}
function jt() {
  return this.rgb().formatRgb();
}
function Lt(t) {
  var e, n;
  return (
    (t = (t + '').trim().toLowerCase()),
    (e = Ct.exec(t))
      ? ((n = e[1].length),
        (e = parseInt(e[1], 16)),
        6 === n
          ? zt(e)
          : 3 === n
            ? new Bt(((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), ((15 & e) << 4) | (15 & e), 1)
            : 8 === n
              ? qt((e >> 24) & 255, (e >> 16) & 255, (e >> 8) & 255, (255 & e) / 255)
              : 4 === n
                ? qt(((e >> 12) & 15) | ((e >> 8) & 240), ((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), (((15 & e) << 4) | (15 & e)) / 255)
                : null)
      : (e = kt.exec(t))
        ? new Bt(e[1], e[2], e[3], 1)
        : (e = Mt.exec(t))
          ? new Bt((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, 1)
          : (e = Nt.exec(t))
            ? qt(e[1], e[2], e[3], e[4])
            : (e = Ut.exec(t))
              ? qt((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, e[4])
              : (e = Ot.exec(t))
                ? Kt(e[1], e[2] / 100, e[3] / 100, 1)
                : (e = Ht.exec(t))
                  ? Kt(e[1], e[2] / 100, e[3] / 100, e[4])
                  : Rt.hasOwnProperty(t)
                    ? zt(Rt[t])
                    : 'transparent' === t
                      ? new Bt(NaN, NaN, NaN, 0)
                      : null
  );
}
function zt(t) {
  return new Bt((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1);
}
function qt(t, e, n, i) {
  return i <= 0 && (t = e = n = NaN), new Bt(t, e, n, i);
}
function Dt(t, e, n, i) {
  return 1 === arguments.length
    ? (function (t) {
        return t instanceof bt || (t = Lt(t)), t ? new Bt((t = t.rgb()).r, t.g, t.b, t.opacity) : new Bt();
      })(t)
    : new Bt(t, e, n, i ?? 1);
}
function Bt(t, e, n, i) {
  (this.r = +t), (this.g = +e), (this.b = +n), (this.opacity = +i);
}
function Xt() {
  return `#${Yt(this.r)}${Yt(this.g)}${Yt(this.b)}`;
}
function Ft() {
  const t = Wt(this.opacity);
  return `${1 === t ? 'rgb(' : 'rgba('}${Vt(this.r)}, ${Vt(this.g)}, ${Vt(this.b)}${1 === t ? ')' : `, ${t})`}`;
}
function Wt(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Vt(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function Yt(t) {
  return ((t = Vt(t)) < 16 ? '0' : '') + t.toString(16);
}
function Kt(t, e, n, i) {
  return i <= 0 ? (t = e = n = NaN) : n <= 0 || n >= 1 ? (t = e = NaN) : e <= 0 && (t = NaN), new Zt(t, e, n, i);
}
function Jt(t) {
  if (t instanceof Zt) return new Zt(t.h, t.s, t.l, t.opacity);
  if ((t instanceof bt || (t = Lt(t)), !t)) return new Zt();
  if (t instanceof Zt) return t;
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
    new Zt(o, a, h, t.opacity)
  );
}
function Zt(t, e, n, i) {
  (this.h = +t), (this.s = +e), (this.l = +n), (this.opacity = +i);
}
function Qt(t) {
  return (t = (t || 0) % 360) < 0 ? t + 360 : t;
}
function Gt(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function te(t, e, n) {
  return 255 * (t < 60 ? e + ((n - e) * t) / 60 : t < 180 ? n : t < 240 ? e + ((n - e) * (240 - t)) / 60 : e);
}
wt(bt, Lt, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: It,
  formatHex: It,
  formatHex8: function () {
    return this.rgb().formatHex8();
  },
  formatHsl: function () {
    return Jt(this).formatHsl();
  },
  formatRgb: jt,
  toString: jt,
}),
  wt(
    Bt,
    Dt,
    At(bt, {
      brighter(t) {
        return (t = null == t ? xt : Math.pow(xt, t)), new Bt(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? St : Math.pow(St, t)), new Bt(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Bt(Vt(this.r), Vt(this.g), Vt(this.b), Wt(this.opacity));
      },
      displayable() {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
      },
      hex: Xt,
      formatHex: Xt,
      formatHex8: function () {
        return `#${Yt(this.r)}${Yt(this.g)}${Yt(this.b)}${Yt(255 * (isNaN(this.opacity) ? 1 : this.opacity))}`;
      },
      formatRgb: Ft,
      toString: Ft,
    })
  ),
  wt(
    Zt,
    function (t, e, n, i) {
      return 1 === arguments.length ? Jt(t) : new Zt(t, e, n, i ?? 1);
    },
    At(bt, {
      brighter(t) {
        return (t = null == t ? xt : Math.pow(xt, t)), new Zt(this.h, this.s, this.l * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? St : Math.pow(St, t)), new Zt(this.h, this.s, this.l * t, this.opacity);
      },
      rgb() {
        var t = (this.h % 360) + 360 * (this.h < 0),
          e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
          n = this.l,
          i = n + (n < 0.5 ? n : 1 - n) * e,
          r = 2 * n - i;
        return new Bt(te(t >= 240 ? t - 240 : t + 120, r, i), te(t, r, i), te(t < 120 ? t + 240 : t - 120, r, i), this.opacity);
      },
      clamp() {
        return new Zt(Qt(this.h), Gt(this.s), Gt(this.l), Wt(this.opacity));
      },
      displayable() {
        return ((0 <= this.s && this.s <= 1) || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
      },
      formatHsl() {
        const t = Wt(this.opacity);
        return `${1 === t ? 'hsl(' : 'hsla('}${Qt(this.h)}, ${100 * Gt(this.s)}%, ${100 * Gt(this.l)}%${1 === t ? ')' : `, ${t})`}`;
      },
    })
  );
var ee = (t) => () => t;
function ne(t) {
  return 1 == (t = +t)
    ? ie
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
          : ee(isNaN(e) ? n : e);
      };
}
function ie(t, e) {
  var n = e - t;
  return n
    ? (function (t, e) {
        return function (n) {
          return t + n * e;
        };
      })(t, n)
    : ee(isNaN(t) ? e : t);
}
var re = (function t(e) {
  var n = ne(e);
  function i(t, e) {
    var i = n((t = Dt(t)).r, (e = Dt(e)).r),
      r = n(t.g, e.g),
      s = n(t.b, e.b),
      o = ie(t.opacity, e.opacity);
    return function (e) {
      return (t.r = i(e)), (t.g = r(e)), (t.b = s(e)), (t.opacity = o(e)), t + '';
    };
  }
  return (i.gamma = t), i;
})(1);
function se(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return t * (1 - n) + e * n;
    }
  );
}
var oe = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  ae = new RegExp(oe.source, 'g');
function he(t, e) {
  var n,
    i,
    r,
    s = (oe.lastIndex = ae.lastIndex = 0),
    o = -1,
    a = [],
    h = [];
  for (t += '', e += ''; (n = oe.exec(t)) && (i = ae.exec(e)); )
    (r = i.index) > s && ((r = e.slice(s, r)), a[o] ? (a[o] += r) : (a[++o] = r)),
      (n = n[0]) === (i = i[0]) ? (a[o] ? (a[o] += i) : (a[++o] = i)) : ((a[++o] = null), h.push({ i: o, x: se(n, i) })),
      (s = ae.lastIndex);
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
var le,
  ce = 180 / Math.PI,
  ue = { translateX: 0, translateY: 0, rotate: 0, skewX: 0, scaleX: 1, scaleY: 1 };
function fe(t, e, n, i, r, s) {
  var o, a, h;
  return (
    (o = Math.sqrt(t * t + e * e)) && ((t /= o), (e /= o)),
    (h = t * n + e * i) && ((n -= t * h), (i -= e * h)),
    (a = Math.sqrt(n * n + i * i)) && ((n /= a), (i /= a), (h /= a)),
    t * i < e * n && ((t = -t), (e = -e), (h = -h), (o = -o)),
    { translateX: r, translateY: s, rotate: Math.atan2(e, t) * ce, skewX: Math.atan(h) * ce, scaleX: o, scaleY: a }
  );
}
function pe(t, e, n, i) {
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
          a.push({ i: h - 4, x: se(t, r) }, { i: h - 2, x: se(i, s) });
        } else (r || s) && o.push('translate(' + r + e + s + n);
      })(s.translateX, s.translateY, o.translateX, o.translateY, a, h),
      (function (t, e, n, s) {
        t !== e
          ? (t - e > 180 ? (e += 360) : e - t > 180 && (t += 360), s.push({ i: n.push(r(n) + 'rotate(', null, i) - 2, x: se(t, e) }))
          : e && n.push(r(n) + 'rotate(' + e + i);
      })(s.rotate, o.rotate, a, h),
      (function (t, e, n, s) {
        t !== e ? s.push({ i: n.push(r(n) + 'skewX(', null, i) - 2, x: se(t, e) }) : e && n.push(r(n) + 'skewX(' + e + i);
      })(s.skewX, o.skewX, a, h),
      (function (t, e, n, i, s, o) {
        if (t !== n || e !== i) {
          var a = s.push(r(s) + 'scale(', null, ',', null, ')');
          o.push({ i: a - 4, x: se(t, n) }, { i: a - 2, x: se(e, i) });
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
var de,
  ge,
  _e = pe(
    function (t) {
      const e = new ('function' == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(t + '');
      return e.isIdentity ? ue : fe(e.a, e.b, e.c, e.d, e.e, e.f);
    },
    'px, ',
    'px)',
    'deg)'
  ),
  ve = pe(
    function (t) {
      return null == t
        ? ue
        : (le || (le = document.createElementNS('http://www.w3.org/2000/svg', 'g')),
          le.setAttribute('transform', t),
          (t = le.transform.baseVal.consolidate()) ? fe((t = t.matrix).a, t.b, t.c, t.d, t.e, t.f) : ue);
    },
    ', ',
    ')',
    ')'
  ),
  me = 0,
  ye = 0,
  $e = 0,
  we = 0,
  Ae = 0,
  be = 0,
  Se = 'object' == typeof performance && performance.now ? performance : Date,
  xe =
    'object' == typeof window && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : function (t) {
          setTimeout(t, 17);
        };
function Ee() {
  return Ae || (xe(Pe), (Ae = Se.now() + be));
}
function Pe() {
  Ae = 0;
}
function Te() {
  this._call = this._time = this._next = null;
}
function Ce(t, e, n) {
  var i = new Te();
  return i.restart(t, e, n), i;
}
function ke() {
  (Ae = (we = Se.now()) + be), (me = ye = 0);
  try {
    !(function () {
      Ee(), ++me;
      for (var t, e = de; e; ) (t = Ae - e._time) >= 0 && e._call.call(void 0, t), (e = e._next);
      --me;
    })();
  } finally {
    (me = 0),
      (function () {
        var t,
          e,
          n = de,
          i = 1 / 0;
        for (; n; ) n._call ? (i > n._time && (i = n._time), (t = n), (n = n._next)) : ((e = n._next), (n._next = null), (n = t ? (t._next = e) : (de = e)));
        (ge = t), Ne(i);
      })(),
      (Ae = 0);
  }
}
function Me() {
  var t = Se.now(),
    e = t - we;
  e > 1e3 && ((be -= e), (we = t));
}
function Ne(t) {
  me ||
    (ye && (ye = clearTimeout(ye)),
    t - Ae > 24
      ? (t < 1 / 0 && (ye = setTimeout(ke, t - Se.now() - be)), $e && ($e = clearInterval($e)))
      : ($e || ((we = Se.now()), ($e = setInterval(Me, 1e3))), (me = 1), xe(ke)));
}
function Ue(t, e, n) {
  var i = new Te();
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
Te.prototype = Ce.prototype = {
  constructor: Te,
  restart: function (t, e, n) {
    if ('function' != typeof t) throw new TypeError('callback is not a function');
    (n = (null == n ? Ee() : +n) + (null == e ? 0 : +e)),
      this._next || ge === this || (ge ? (ge._next = this) : (de = this), (ge = this)),
      (this._call = t),
      (this._time = n),
      Ne();
  },
  stop: function () {
    this._call && ((this._call = null), (this._time = 1 / 0), Ne());
  },
};
var Oe = r('start', 'end', 'cancel', 'interrupt'),
  He = [];
function Re(t, e, n, i, r, s) {
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
      var l, c, u, f;
      if (1 !== n.state) return h();
      for (l in r)
        if ((f = r[l]).name === n.name) {
          if (3 === f.state) return Ue(o);
          4 === f.state
            ? ((f.state = 6), f.timer.stop(), f.on.call('interrupt', t, t.__data__, f.index, f.group), delete r[l])
            : +l < e && ((f.state = 6), f.timer.stop(), f.on.call('cancel', t, t.__data__, f.index, f.group), delete r[l]);
        }
      if (
        (Ue(function () {
          3 === n.state && ((n.state = 4), n.timer.restart(a, n.delay, n.time), a(s));
        }),
        (n.state = 2),
        n.on.call('start', t, t.__data__, n.index, n.group),
        2 === n.state)
      ) {
        for (n.state = 3, i = new Array((u = n.tween.length)), l = 0, c = -1; l < u; ++l)
          (f = n.tween[l].value.call(t, t.__data__, n.index, n.group)) && (i[++c] = f);
        i.length = c + 1;
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
    (r[e] = n), (n.timer = Ce(s, 0, n.time));
  })(t, n, { name: e, index: i, group: r, on: Oe, tween: He, time: s.time, delay: s.delay, duration: s.duration, ease: s.ease, timer: null, state: 0 });
}
function Ie(t, e) {
  var n = Le(t, e);
  if (n.state > 0) throw new Error('too late; already scheduled');
  return n;
}
function je(t, e) {
  var n = Le(t, e);
  if (n.state > 3) throw new Error('too late; already running');
  return n;
}
function Le(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error('transition not found');
  return n;
}
function ze(t, e) {
  var n, i;
  return function () {
    var r = je(this, t),
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
function qe(t, e, n) {
  var i, r;
  if ('function' != typeof n) throw new Error();
  return function () {
    var s = je(this, t),
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
function De(t, e, n) {
  var i = t._id;
  return (
    t.each(function () {
      var t = je(this, i);
      (t.value || (t.value = {}))[e] = n.apply(this, arguments);
    }),
    function (t) {
      return Le(t, i).value[e];
    }
  );
}
function Be(t, e) {
  var n;
  return ('number' == typeof e ? se : e instanceof Lt ? re : (n = Lt(e)) ? ((e = n), re) : he)(t, e);
}
function Xe(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function Fe(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function We(t, e, n) {
  var i,
    r,
    s = n + '';
  return function () {
    var o = this.getAttribute(t);
    return o === s ? null : o === i ? r : (r = e((i = o), n));
  };
}
function Ve(t, e, n) {
  var i,
    r,
    s = n + '';
  return function () {
    var o = this.getAttributeNS(t.space, t.local);
    return o === s ? null : o === i ? r : (r = e((i = o), n));
  };
}
function Ye(t, e, n) {
  var i, r, s;
  return function () {
    var o,
      a,
      h = n(this);
    if (null != h) return (o = this.getAttribute(t)) === (a = h + '') ? null : o === i && a === r ? s : ((r = a), (s = e((i = o), h)));
    this.removeAttribute(t);
  };
}
function Ke(t, e, n) {
  var i, r, s;
  return function () {
    var o,
      a,
      h = n(this);
    if (null != h) return (o = this.getAttributeNS(t.space, t.local)) === (a = h + '') ? null : o === i && a === r ? s : ((r = a), (s = e((i = o), h)));
    this.removeAttributeNS(t.space, t.local);
  };
}
function Je(t, e) {
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
function Ze(t, e) {
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
function Qe(t, e) {
  return function () {
    Ie(this, t).delay = +e.apply(this, arguments);
  };
}
function Ge(t, e) {
  return (
    (e = +e),
    function () {
      Ie(this, t).delay = e;
    }
  );
}
function tn(t, e) {
  return function () {
    je(this, t).duration = +e.apply(this, arguments);
  };
}
function en(t, e) {
  return (
    (e = +e),
    function () {
      je(this, t).duration = e;
    }
  );
}
var nn = yt.prototype.constructor;
function rn(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
var sn = 0;
function on(t, e, n, i) {
  (this._groups = t), (this._parents = e), (this._name = n), (this._id = i);
}
function an() {
  return ++sn;
}
var hn = yt.prototype;
on.prototype = {
  constructor: on,
  select: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = g(t));
    for (var i = this._groups, r = i.length, s = new Array(r), o = 0; o < r; ++o)
      for (var a, h, l = i[o], c = l.length, u = (s[o] = new Array(c)), f = 0; f < c; ++f)
        (a = l[f]) && (h = t.call(a, a.__data__, f, l)) && ('__data__' in a && (h.__data__ = a.__data__), (u[f] = h), Re(u[f], e, n, f, u, Le(a, n)));
    return new on(s, this._parents, e, n);
  },
  selectAll: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = v(t));
    for (var i = this._groups, r = i.length, s = [], o = [], a = 0; a < r; ++a)
      for (var h, l = i[a], c = l.length, u = 0; u < c; ++u)
        if ((h = l[u])) {
          for (var f, p = t.call(h, h.__data__, u, l), d = Le(h, n), g = 0, _ = p.length; g < _; ++g) (f = p[g]) && Re(f, e, n, g, p, d);
          s.push(p), o.push(h);
        }
    return new on(s, o, e, n);
  },
  selectChild: hn.selectChild,
  selectChildren: hn.selectChildren,
  filter: function (t) {
    'function' != typeof t && (t = y(t));
    for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
      for (var s, o = e[r], a = o.length, h = (i[r] = []), l = 0; l < a; ++l) (s = o[l]) && t.call(s, s.__data__, l, o) && h.push(s);
    return new on(i, this._parents, this._name, this._id);
  },
  merge: function (t) {
    if (t._id !== this._id) throw new Error();
    for (var e = this._groups, n = t._groups, i = e.length, r = n.length, s = Math.min(i, r), o = new Array(i), a = 0; a < s; ++a)
      for (var h, l = e[a], c = n[a], u = l.length, f = (o[a] = new Array(u)), p = 0; p < u; ++p) (h = l[p] || c[p]) && (f[p] = h);
    for (; a < i; ++a) o[a] = e[a];
    return new on(o, this._parents, this._name, this._id);
  },
  selection: function () {
    return new nn(this._groups, this._parents);
  },
  transition: function () {
    for (var t = this._name, e = this._id, n = an(), i = this._groups, r = i.length, s = 0; s < r; ++s)
      for (var o, a = i[s], h = a.length, l = 0; l < h; ++l)
        if ((o = a[l])) {
          var c = Le(o, e);
          Re(o, t, n, l, a, { time: c.time + c.delay + c.duration, delay: 0, duration: c.duration, ease: c.ease });
        }
    return new on(i, this._parents, t, n);
  },
  call: hn.call,
  nodes: hn.nodes,
  node: hn.node,
  size: hn.size,
  empty: hn.empty,
  each: hn.each,
  on: function (t, e) {
    var n = this._id;
    return arguments.length < 2
      ? Le(this.node(), n).on.on(t)
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
                ? Ie
                : je;
            return function () {
              var o = s(this, t),
                a = o.on;
              a !== i && (r = (i = a).copy()).on(e, n), (o.on = r);
            };
          })(n, t, e)
        );
  },
  attr: function (t, e) {
    var n = c(t),
      i = 'transform' === n ? ve : Be;
    return this.attrTween(
      t,
      'function' == typeof e ? (n.local ? Ke : Ye)(n, i, De(this, 'attr.' + t, e)) : null == e ? (n.local ? Fe : Xe)(n) : (n.local ? Ve : We)(n, i, e)
    );
  },
  attrTween: function (t, e) {
    var n = 'attr.' + t;
    if (arguments.length < 2) return (n = this.tween(n)) && n._value;
    if (null == e) return this.tween(n, null);
    if ('function' != typeof e) throw new Error();
    var i = c(t);
    return this.tween(n, (i.local ? Je : Ze)(i, e));
  },
  style: function (t, e, n) {
    var i = 'transform' == (t += '') ? _e : Be;
    return null == e
      ? this.styleTween(
          t,
          (function (t, e) {
            var n, i, r;
            return function () {
              var s = D(this, t),
                o = (this.style.removeProperty(t), D(this, t));
              return s === o ? null : s === n && o === i ? r : (r = e((n = s), (i = o)));
            };
          })(t, i)
        ).on('end.style.' + t, rn(t))
      : 'function' == typeof e
        ? this.styleTween(
            t,
            (function (t, e, n) {
              var i, r, s;
              return function () {
                var o = D(this, t),
                  a = n(this),
                  h = a + '';
                return null == a && (this.style.removeProperty(t), (h = a = D(this, t))), o === h ? null : o === i && h === r ? s : ((r = h), (s = e((i = o), a)));
              };
            })(t, i, De(this, 'style.' + t, e))
          ).each(
            (function (t, e) {
              var n,
                i,
                r,
                s,
                o = 'style.' + e,
                a = 'end.' + o;
              return function () {
                var h = je(this, t),
                  l = h.on,
                  c = null == h.value[o] ? s || (s = rn(e)) : void 0;
                (l === n && r === c) || (i = (n = l).copy()).on(a, (r = c)), (h.on = i);
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
                var o = D(this, t);
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
          })(De(this, 'text', t))
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
      for (var i, r = Le(this.node(), n).tween, s = 0, o = r.length; s < o; ++s) if ((i = r[s]).name === t) return i.value;
      return null;
    }
    return this.each((null == e ? ze : qe)(n, t, e));
  },
  delay: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? Qe : Ge)(e, t)) : Le(this.node(), e).delay;
  },
  duration: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? tn : en)(e, t)) : Le(this.node(), e).duration;
  },
  ease: function (t) {
    var e = this._id;
    return arguments.length
      ? this.each(
          (function (t, e) {
            if ('function' != typeof e) throw new Error();
            return function () {
              je(this, t).ease = e;
            };
          })(e, t)
        )
      : Le(this.node(), e).ease;
  },
  easeVarying: function (t) {
    if ('function' != typeof t) throw new Error();
    return this.each(
      (function (t, e) {
        return function () {
          var n = e.apply(this, arguments);
          if ('function' != typeof n) throw new Error();
          je(this, t).ease = n;
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
        var n = je(this, i),
          r = n.on;
        r !== t && ((e = (t = r).copy())._.cancel.push(a), e._.interrupt.push(a), e._.end.push(h)), (n.on = e);
      }),
        0 === r && s();
    });
  },
  [Symbol.iterator]: hn[Symbol.iterator],
};
var ln = {
  time: null,
  delay: 0,
  duration: 250,
  ease: function (t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  },
};
function cn(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); ) if (!(t = t.parentNode)) throw new Error(`transition ${e} not found`);
  return n;
}
function un(t, e, n) {
  (this.k = t), (this.x = e), (this.y = n);
}
(yt.prototype.interrupt = function (t) {
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
  (yt.prototype.transition = function (t) {
    var e, n;
    t instanceof on ? ((e = t._id), (t = t._name)) : ((e = an()), ((n = ln).time = Ee()), (t = null == t ? null : t + ''));
    for (var i = this._groups, r = i.length, s = 0; s < r; ++s) for (var o, a = i[s], h = a.length, l = 0; l < h; ++l) (o = a[l]) && Re(o, t, e, l, a, n || cn(o, e));
    return new on(i, this._parents, t, e);
  }),
  (un.prototype = {
    constructor: un,
    scale: function (t) {
      return 1 === t ? this : new un(this.k * t, this.x, this.y);
    },
    translate: function (t, e) {
      return (0 === t) & (0 === e) ? this : new un(this.k, this.x + this.k * t, this.y + this.k * e);
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
  un.prototype;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fn = globalThis,
  pn = fn.ShadowRoot && (void 0 === fn.ShadyCSS || fn.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype,
  dn = Symbol(),
  gn = new WeakMap();
let _n = class {
  constructor(t, e, n) {
    if (((this._$cssResult$ = !0), n !== dn)) throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    (this.cssText = t), (this.t = e);
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (pn && void 0 === t) {
      const n = void 0 !== e && 1 === e.length;
      n && (t = gn.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && gn.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const vn = pn
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return ((t) => new _n('string' == typeof t ? t : t + '', void 0, dn))(e);
            })(t)
          : t,
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ { is: mn, defineProperty: yn, getOwnPropertyDescriptor: $n, getOwnPropertyNames: wn, getOwnPropertySymbols: An, getPrototypeOf: bn } = Object,
  Sn = globalThis,
  xn = Sn.trustedTypes,
  En = xn ? xn.emptyScript : '',
  Pn = Sn.reactiveElementPolyfillSupport,
  Tn = (t, e) => t,
  Cn = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? En : null;
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
  kn = (t, e) => !mn(t, e),
  Mn = { attribute: !0, type: String, converter: Cn, reflect: !1, hasChanged: kn };
(Symbol.metadata ??= Symbol('metadata')), (Sn.litPropertyMetadata ??= new WeakMap());
let Nn = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Mn) {
    if ((e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor)) {
      const n = Symbol(),
        i = this.getPropertyDescriptor(t, n, e);
      void 0 !== i && yn(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: i, set: r } = $n(this.prototype, t) ?? {
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
    return this.elementProperties.get(t) ?? Mn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Tn('elementProperties'))) return;
    const t = bn(this);
    t.finalize(), void 0 !== t.l && (this.l = [...t.l]), (this.elementProperties = new Map(t.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(Tn('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(Tn('properties')))) {
      const t = this.properties,
        e = [...wn(t), ...An(t)];
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
      for (const t of n) e.unshift(vn(t));
    } else void 0 !== t && e.push(vn(t));
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
        if (pn) t.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
        else
          for (const n of e) {
            const e = document.createElement('style'),
              i = fn.litNonce;
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
      const r = (void 0 !== n.converter?.toAttribute ? n.converter : Cn).toAttribute(e, n.type);
      (this._$Em = t), null == r ? this.removeAttribute(i) : this.setAttribute(i, r), (this._$Em = null);
    }
  }
  _$AK(t, e) {
    const n = this.constructor,
      i = n._$Eh.get(t);
    if (void 0 !== i && this._$Em !== i) {
      const t = n.getPropertyOptions(i),
        r = 'function' == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : Cn;
      (this._$Em = i), (this[i] = r.fromAttribute(e, t.type)), (this._$Em = null);
    }
  }
  requestUpdate(t, e, n) {
    if (void 0 !== t) {
      if (((n ??= this.constructor.getPropertyOptions(t)), !(n.hasChanged ?? kn)(this[t], e))) return;
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
(Nn.elementStyles = []),
  (Nn.shadowRootOptions = { mode: 'open' }),
  (Nn[Tn('elementProperties')] = new Map()),
  (Nn[Tn('finalized')] = new Map()),
  Pn?.({ ReactiveElement: Nn }),
  (Sn.reactiveElementVersions ??= []).push('2.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Un = globalThis,
  On = Un.trustedTypes,
  Hn = On ? On.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  Rn = '$lit$',
  In = `lit$${Math.random().toFixed(9).slice(2)}$`,
  jn = '?' + In,
  Ln = `<${jn}>`,
  zn = document,
  qn = () => zn.createComment(''),
  Dn = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
  Bn = Array.isArray,
  Xn = '[ \t\n\f\r]',
  Fn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Wn = /-->/g,
  Vn = />/g,
  Yn = RegExp(`>|${Xn}(?:([^\\s"'>=/]+)(${Xn}*=${Xn}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  Kn = /'/g,
  Jn = /"/g,
  Zn = /^(?:script|style|textarea|title)$/i,
  Qn = Symbol.for('lit-noChange'),
  Gn = Symbol.for('lit-nothing'),
  ti = new WeakMap(),
  ei = zn.createTreeWalker(zn, 129);
function ni(t, e) {
  if (!Bn(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return void 0 !== Hn ? Hn.createHTML(e) : e;
}
let ii = class t {
  constructor({ strings: e, _$litType$: n }, i) {
    let r;
    this.parts = [];
    let s = 0,
      o = 0;
    const a = e.length - 1,
      h = this.parts,
      [l, c] = ((t, e) => {
        const n = t.length - 1,
          i = [];
        let r,
          s = 2 === e ? '<svg>' : 3 === e ? '<math>' : '',
          o = Fn;
        for (let e = 0; e < n; e++) {
          const n = t[e];
          let a,
            h,
            l = -1,
            c = 0;
          for (; c < n.length && ((o.lastIndex = c), (h = o.exec(n)), null !== h); )
            (c = o.lastIndex),
              o === Fn
                ? '!--' === h[1]
                  ? (o = Wn)
                  : void 0 !== h[1]
                    ? (o = Vn)
                    : void 0 !== h[2]
                      ? (Zn.test(h[2]) && (r = RegExp('</' + h[2], 'g')), (o = Yn))
                      : void 0 !== h[3] && (o = Yn)
                : o === Yn
                  ? '>' === h[0]
                    ? ((o = r ?? Fn), (l = -1))
                    : void 0 === h[1]
                      ? (l = -2)
                      : ((l = o.lastIndex - h[2].length), (a = h[1]), (o = void 0 === h[3] ? Yn : '"' === h[3] ? Jn : Kn))
                  : o === Jn || o === Kn
                    ? (o = Yn)
                    : o === Wn || o === Vn
                      ? (o = Fn)
                      : ((o = Yn), (r = void 0));
          const u = o === Yn && t[e + 1].startsWith('/>') ? ' ' : '';
          s += o === Fn ? n + Ln : l >= 0 ? (i.push(a), n.slice(0, l) + Rn + n.slice(l) + In + u) : n + In + (-2 === l ? e : u);
        }
        return [ni(t, s + (t[n] || '<?>') + (2 === e ? '</svg>' : 3 === e ? '</math>' : '')), i];
      })(e, n);
    if (((this.el = t.createElement(l, i)), (ei.currentNode = this.el.content), 2 === n || 3 === n)) {
      const t = this.el.content.firstChild;
      t.replaceWith(...t.childNodes);
    }
    for (; null !== (r = ei.nextNode()) && h.length < a; ) {
      if (1 === r.nodeType) {
        if (r.hasAttributes())
          for (const t of r.getAttributeNames())
            if (t.endsWith(Rn)) {
              const e = c[o++],
                n = r.getAttribute(t).split(In),
                i = /([.?@])?(.*)/.exec(e);
              h.push({ type: 1, index: s, name: i[2], strings: n, ctor: '.' === i[1] ? hi : '?' === i[1] ? li : '@' === i[1] ? ci : ai }), r.removeAttribute(t);
            } else t.startsWith(In) && (h.push({ type: 6, index: s }), r.removeAttribute(t));
        if (Zn.test(r.tagName)) {
          const t = r.textContent.split(In),
            e = t.length - 1;
          if (e > 0) {
            r.textContent = On ? On.emptyScript : '';
            for (let n = 0; n < e; n++) r.append(t[n], qn()), ei.nextNode(), h.push({ type: 2, index: ++s });
            r.append(t[e], qn());
          }
        }
      } else if (8 === r.nodeType)
        if (r.data === jn) h.push({ type: 2, index: s });
        else {
          let t = -1;
          for (; -1 !== (t = r.data.indexOf(In, t + 1)); ) h.push({ type: 7, index: s }), (t += In.length - 1);
        }
      s++;
    }
  }
  static createElement(t, e) {
    const n = zn.createElement('template');
    return (n.innerHTML = t), n;
  }
};
function ri(t, e, n = t, i) {
  if (e === Qn) return e;
  let r = void 0 !== i ? n._$Co?.[i] : n._$Cl;
  const s = Dn(e) ? void 0 : e._$litDirective$;
  return (
    r?.constructor !== s && (r?._$AO?.(!1), void 0 === s ? (r = void 0) : ((r = new s(t)), r._$AT(t, n, i)), void 0 !== i ? ((n._$Co ??= [])[i] = r) : (n._$Cl = r)),
    void 0 !== r && (e = ri(t, r._$AS(t, e.values), r, i)),
    e
  );
}
let si = class {
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
        i = (t?.creationScope ?? zn).importNode(e, !0);
      ei.currentNode = i;
      let r = ei.nextNode(),
        s = 0,
        o = 0,
        a = n[0];
      for (; void 0 !== a; ) {
        if (s === a.index) {
          let e;
          2 === a.type
            ? (e = new oi(r, r.nextSibling, this, t))
            : 1 === a.type
              ? (e = new a.ctor(r, a.name, a.strings, this, t))
              : 6 === a.type && (e = new ui(r, this, t)),
            this._$AV.push(e),
            (a = n[++o]);
        }
        s !== a?.index && ((r = ei.nextNode()), s++);
      }
      return (ei.currentNode = zn), i;
    }
    p(t) {
      let e = 0;
      for (const n of this._$AV) void 0 !== n && (void 0 !== n.strings ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++;
    }
  },
  oi = class t {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, n, i) {
      (this.type = 2),
        (this._$AH = Gn),
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
      (t = ri(this, t, e)),
        Dn(t)
          ? t === Gn || null == t || '' === t
            ? (this._$AH !== Gn && this._$AR(), (this._$AH = Gn))
            : t !== this._$AH && t !== Qn && this._(t)
          : void 0 !== t._$litType$
            ? this.$(t)
            : void 0 !== t.nodeType
              ? this.T(t)
              : ((t) => Bn(t) || 'function' == typeof t?.[Symbol.iterator])(t)
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
      this._$AH !== Gn && Dn(this._$AH) ? (this._$AA.nextSibling.data = t) : this.T(zn.createTextNode(t)), (this._$AH = t);
    }
    $(t) {
      const { values: e, _$litType$: n } = t,
        i = 'number' == typeof n ? this._$AC(t) : (void 0 === n.el && (n.el = ii.createElement(ni(n.h, n.h[0]), this.options)), n);
      if (this._$AH?._$AD === i) this._$AH.p(e);
      else {
        const t = new si(i, this),
          n = t.u(this.options);
        t.p(e), this.T(n), (this._$AH = t);
      }
    }
    _$AC(t) {
      let e = ti.get(t.strings);
      return void 0 === e && ti.set(t.strings, (e = new ii(t))), e;
    }
    k(e) {
      Bn(this._$AH) || ((this._$AH = []), this._$AR());
      const n = this._$AH;
      let i,
        r = 0;
      for (const s of e) r === n.length ? n.push((i = new t(this.O(qn()), this.O(qn()), this, this.options))) : (i = n[r]), i._$AI(s), r++;
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
  ai = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, n, i, r) {
      (this.type = 1),
        (this._$AH = Gn),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = i),
        (this.options = r),
        n.length > 2 || '' !== n[0] || '' !== n[1] ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n)) : (this._$AH = Gn);
    }
    _$AI(t, e = this, n, i) {
      const r = this.strings;
      let s = !1;
      if (void 0 === r) (t = ri(this, t, e, 0)), (s = !Dn(t) || (t !== this._$AH && t !== Qn)), s && (this._$AH = t);
      else {
        const i = t;
        let o, a;
        for (t = r[0], o = 0; o < r.length - 1; o++)
          (a = ri(this, i[n + o], e, o)),
            a === Qn && (a = this._$AH[o]),
            (s ||= !Dn(a) || a !== this._$AH[o]),
            a === Gn ? (t = Gn) : t !== Gn && (t += (a ?? '') + r[o + 1]),
            (this._$AH[o] = a);
      }
      s && !i && this.j(t);
    }
    j(t) {
      t === Gn ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? '');
    }
  },
  hi = class extends ai {
    constructor() {
      super(...arguments), (this.type = 3);
    }
    j(t) {
      this.element[this.name] = t === Gn ? void 0 : t;
    }
  },
  li = class extends ai {
    constructor() {
      super(...arguments), (this.type = 4);
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== Gn);
    }
  },
  ci = class extends ai {
    constructor(t, e, n, i, r) {
      super(t, e, n, i, r), (this.type = 5);
    }
    _$AI(t, e = this) {
      if ((t = ri(this, t, e, 0) ?? Gn) === Qn) return;
      const n = this._$AH,
        i = (t === Gn && n !== Gn) || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive,
        r = t !== Gn && (n === Gn || i);
      i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), (this._$AH = t);
    }
    handleEvent(t) {
      'function' == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  },
  ui = class {
    constructor(t, e, n) {
      (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n);
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      ri(this, t);
    }
  };
const fi = Un.litHtmlPolyfillSupport;
fi?.(ii, oi), (Un.litHtmlVersions ??= []).push('3.2.1');
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pi = globalThis,
  di = pi.ShadowRoot && (void 0 === pi.ShadyCSS || pi.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype,
  gi = Symbol(),
  _i = new WeakMap();
let vi = class {
  constructor(t, e, n) {
    if (((this._$cssResult$ = !0), n !== gi)) throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    (this.cssText = t), (this.t = e);
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (di && void 0 === t) {
      const n = void 0 !== e && 1 === e.length;
      n && (t = _i.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && _i.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const mi = di
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return ((t) => new vi('string' == typeof t ? t : t + '', void 0, gi))(e);
            })(t)
          : t,
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ { is: yi, defineProperty: $i, getOwnPropertyDescriptor: wi, getOwnPropertyNames: Ai, getOwnPropertySymbols: bi, getPrototypeOf: Si } = Object,
  xi = globalThis,
  Ei = xi.trustedTypes,
  Pi = Ei ? Ei.emptyScript : '',
  Ti = xi.reactiveElementPolyfillSupport,
  Ci = (t, e) => t,
  ki = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? Pi : null;
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
  Mi = (t, e) => !yi(t, e),
  Ni = { attribute: !0, type: String, converter: ki, reflect: !1, hasChanged: Mi };
(Symbol.metadata ??= Symbol('metadata')), (xi.litPropertyMetadata ??= new WeakMap());
class Ui extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Ni) {
    if ((e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor)) {
      const n = Symbol(),
        i = this.getPropertyDescriptor(t, n, e);
      void 0 !== i && $i(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: i, set: r } = wi(this.prototype, t) ?? {
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
    return this.elementProperties.get(t) ?? Ni;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ci('elementProperties'))) return;
    const t = Si(this);
    t.finalize(), void 0 !== t.l && (this.l = [...t.l]), (this.elementProperties = new Map(t.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(Ci('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(Ci('properties')))) {
      const t = this.properties,
        e = [...Ai(t), ...bi(t)];
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
      for (const t of n) e.unshift(mi(t));
    } else void 0 !== t && e.push(mi(t));
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
        if (di) t.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
        else
          for (const n of e) {
            const e = document.createElement('style'),
              i = pi.litNonce;
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
      const r = (void 0 !== n.converter?.toAttribute ? n.converter : ki).toAttribute(e, n.type);
      (this._$Em = t), null == r ? this.removeAttribute(i) : this.setAttribute(i, r), (this._$Em = null);
    }
  }
  _$AK(t, e) {
    const n = this.constructor,
      i = n._$Eh.get(t);
    if (void 0 !== i && this._$Em !== i) {
      const t = n.getPropertyOptions(i),
        r = 'function' == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : ki;
      (this._$Em = i), (this[i] = r.fromAttribute(e, t.type)), (this._$Em = null);
    }
  }
  requestUpdate(t, e, n) {
    if (void 0 !== t) {
      if (((n ??= this.constructor.getPropertyOptions(t)), !(n.hasChanged ?? Mi)(this[t], e))) return;
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
(Ui.elementStyles = []),
  (Ui.shadowRootOptions = { mode: 'open' }),
  (Ui[Ci('elementProperties')] = new Map()),
  (Ui[Ci('finalized')] = new Map()),
  Ti?.({ ReactiveElement: Ui }),
  (xi.reactiveElementVersions ??= []).push('2.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oi = globalThis,
  Hi = Oi.trustedTypes,
  Ri = Hi ? Hi.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  Ii = '$lit$',
  ji = `lit$${Math.random().toFixed(9).slice(2)}$`,
  Li = '?' + ji,
  zi = `<${Li}>`,
  qi = document,
  Di = () => qi.createComment(''),
  Bi = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
  Xi = Array.isArray,
  Fi = '[ \t\n\f\r]',
  Wi = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Vi = /-->/g,
  Yi = />/g,
  Ki = RegExp(`>|${Fi}(?:([^\\s"'>=/]+)(${Fi}*=${Fi}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  Ji = /'/g,
  Zi = /"/g,
  Qi = /^(?:script|style|textarea|title)$/i,
  Gi = (
    (t) =>
    (e, ...n) => ({ _$litType$: t, strings: e, values: n })
  )(1),
  tr = Symbol.for('lit-noChange'),
  er = Symbol.for('lit-nothing'),
  nr = new WeakMap(),
  ir = qi.createTreeWalker(qi, 129);
function rr(t, e) {
  if (!Xi(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return void 0 !== Ri ? Ri.createHTML(e) : e;
}
const sr = (t, e) => {
  const n = t.length - 1,
    i = [];
  let r,
    s = 2 === e ? '<svg>' : 3 === e ? '<math>' : '',
    o = Wi;
  for (let e = 0; e < n; e++) {
    const n = t[e];
    let a,
      h,
      l = -1,
      c = 0;
    for (; c < n.length && ((o.lastIndex = c), (h = o.exec(n)), null !== h); )
      (c = o.lastIndex),
        o === Wi
          ? '!--' === h[1]
            ? (o = Vi)
            : void 0 !== h[1]
              ? (o = Yi)
              : void 0 !== h[2]
                ? (Qi.test(h[2]) && (r = RegExp('</' + h[2], 'g')), (o = Ki))
                : void 0 !== h[3] && (o = Ki)
          : o === Ki
            ? '>' === h[0]
              ? ((o = r ?? Wi), (l = -1))
              : void 0 === h[1]
                ? (l = -2)
                : ((l = o.lastIndex - h[2].length), (a = h[1]), (o = void 0 === h[3] ? Ki : '"' === h[3] ? Zi : Ji))
            : o === Zi || o === Ji
              ? (o = Ki)
              : o === Vi || o === Yi
                ? (o = Wi)
                : ((o = Ki), (r = void 0));
    const u = o === Ki && t[e + 1].startsWith('/>') ? ' ' : '';
    s += o === Wi ? n + zi : l >= 0 ? (i.push(a), n.slice(0, l) + Ii + n.slice(l) + ji + u) : n + ji + (-2 === l ? e : u);
  }
  return [rr(t, s + (t[n] || '<?>') + (2 === e ? '</svg>' : 3 === e ? '</math>' : '')), i];
};
class or {
  constructor({ strings: t, _$litType$: e }, n) {
    let i;
    this.parts = [];
    let r = 0,
      s = 0;
    const o = t.length - 1,
      a = this.parts,
      [h, l] = sr(t, e);
    if (((this.el = or.createElement(h, n)), (ir.currentNode = this.el.content), 2 === e || 3 === e)) {
      const t = this.el.content.firstChild;
      t.replaceWith(...t.childNodes);
    }
    for (; null !== (i = ir.nextNode()) && a.length < o; ) {
      if (1 === i.nodeType) {
        if (i.hasAttributes())
          for (const t of i.getAttributeNames())
            if (t.endsWith(Ii)) {
              const e = l[s++],
                n = i.getAttribute(t).split(ji),
                o = /([.?@])?(.*)/.exec(e);
              a.push({ type: 1, index: r, name: o[2], strings: n, ctor: '.' === o[1] ? ur : '?' === o[1] ? fr : '@' === o[1] ? pr : cr }), i.removeAttribute(t);
            } else t.startsWith(ji) && (a.push({ type: 6, index: r }), i.removeAttribute(t));
        if (Qi.test(i.tagName)) {
          const t = i.textContent.split(ji),
            e = t.length - 1;
          if (e > 0) {
            i.textContent = Hi ? Hi.emptyScript : '';
            for (let n = 0; n < e; n++) i.append(t[n], Di()), ir.nextNode(), a.push({ type: 2, index: ++r });
            i.append(t[e], Di());
          }
        }
      } else if (8 === i.nodeType)
        if (i.data === Li) a.push({ type: 2, index: r });
        else {
          let t = -1;
          for (; -1 !== (t = i.data.indexOf(ji, t + 1)); ) a.push({ type: 7, index: r }), (t += ji.length - 1);
        }
      r++;
    }
  }
  static createElement(t, e) {
    const n = qi.createElement('template');
    return (n.innerHTML = t), n;
  }
}
function ar(t, e, n = t, i) {
  if (e === tr) return e;
  let r = void 0 !== i ? n._$Co?.[i] : n._$Cl;
  const s = Bi(e) ? void 0 : e._$litDirective$;
  return (
    r?.constructor !== s && (r?._$AO?.(!1), void 0 === s ? (r = void 0) : ((r = new s(t)), r._$AT(t, n, i)), void 0 !== i ? ((n._$Co ??= [])[i] = r) : (n._$Cl = r)),
    void 0 !== r && (e = ar(t, r._$AS(t, e.values), r, i)),
    e
  );
}
class hr {
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
      i = (t?.creationScope ?? qi).importNode(e, !0);
    ir.currentNode = i;
    let r = ir.nextNode(),
      s = 0,
      o = 0,
      a = n[0];
    for (; void 0 !== a; ) {
      if (s === a.index) {
        let e;
        2 === a.type
          ? (e = new lr(r, r.nextSibling, this, t))
          : 1 === a.type
            ? (e = new a.ctor(r, a.name, a.strings, this, t))
            : 6 === a.type && (e = new dr(r, this, t)),
          this._$AV.push(e),
          (a = n[++o]);
      }
      s !== a?.index && ((r = ir.nextNode()), s++);
    }
    return (ir.currentNode = qi), i;
  }
  p(t) {
    let e = 0;
    for (const n of this._$AV) void 0 !== n && (void 0 !== n.strings ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++;
  }
}
class lr {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, n, i) {
    (this.type = 2),
      (this._$AH = er),
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
    (t = ar(this, t, e)),
      Bi(t)
        ? t === er || null == t || '' === t
          ? (this._$AH !== er && this._$AR(), (this._$AH = er))
          : t !== this._$AH && t !== tr && this._(t)
        : void 0 !== t._$litType$
          ? this.$(t)
          : void 0 !== t.nodeType
            ? this.T(t)
            : ((t) => Xi(t) || 'function' == typeof t?.[Symbol.iterator])(t)
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
    this._$AH !== er && Bi(this._$AH) ? (this._$AA.nextSibling.data = t) : this.T(qi.createTextNode(t)), (this._$AH = t);
  }
  $(t) {
    const { values: e, _$litType$: n } = t,
      i = 'number' == typeof n ? this._$AC(t) : (void 0 === n.el && (n.el = or.createElement(rr(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const t = new hr(i, this),
        n = t.u(this.options);
      t.p(e), this.T(n), (this._$AH = t);
    }
  }
  _$AC(t) {
    let e = nr.get(t.strings);
    return void 0 === e && nr.set(t.strings, (e = new or(t))), e;
  }
  k(t) {
    Xi(this._$AH) || ((this._$AH = []), this._$AR());
    const e = this._$AH;
    let n,
      i = 0;
    for (const r of t) i === e.length ? e.push((n = new lr(this.O(Di()), this.O(Di()), this, this.options))) : (n = e[i]), n._$AI(r), i++;
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
class cr {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, n, i, r) {
    (this.type = 1),
      (this._$AH = er),
      (this._$AN = void 0),
      (this.element = t),
      (this.name = e),
      (this._$AM = i),
      (this.options = r),
      n.length > 2 || '' !== n[0] || '' !== n[1] ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n)) : (this._$AH = er);
  }
  _$AI(t, e = this, n, i) {
    const r = this.strings;
    let s = !1;
    if (void 0 === r) (t = ar(this, t, e, 0)), (s = !Bi(t) || (t !== this._$AH && t !== tr)), s && (this._$AH = t);
    else {
      const i = t;
      let o, a;
      for (t = r[0], o = 0; o < r.length - 1; o++)
        (a = ar(this, i[n + o], e, o)),
          a === tr && (a = this._$AH[o]),
          (s ||= !Bi(a) || a !== this._$AH[o]),
          a === er ? (t = er) : t !== er && (t += (a ?? '') + r[o + 1]),
          (this._$AH[o] = a);
    }
    s && !i && this.j(t);
  }
  j(t) {
    t === er ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? '');
  }
}
class ur extends cr {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(t) {
    this.element[this.name] = t === er ? void 0 : t;
  }
}
class fr extends cr {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== er);
  }
}
class pr extends cr {
  constructor(t, e, n, i, r) {
    super(t, e, n, i, r), (this.type = 5);
  }
  _$AI(t, e = this) {
    if ((t = ar(this, t, e, 0) ?? er) === tr) return;
    const n = this._$AH,
      i = (t === er && n !== er) || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive,
      r = t !== er && (n === er || i);
    i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), (this._$AH = t);
  }
  handleEvent(t) {
    'function' == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class dr {
  constructor(t, e, n) {
    (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    ar(this, t);
  }
}
const gr = Oi.litHtmlPolyfillSupport;
gr?.(or, lr), (Oi.litHtmlVersions ??= []).push('3.2.1');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class _r extends Ui {
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
          i._$litPart$ = r = new lr(e.insertBefore(Di(), t), t, void 0, n ?? {});
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
    return tr;
  }
}
(_r._$litElement$ = !0), (_r.finalized = !0), globalThis.litElementHydrateSupport?.({ LitElement: _r });
const vr = globalThis.litElementPolyfillSupport;
function mr(t, e, n, i) {
  t.beginPath(),
    t.arc(e, n - 0.5 * i, 0.2 * i, 0.25 * Math.PI, 1 * Math.PI, !0),
    t.arc(e - 0.35 * i, n - 0.5 * i, 0.15 * i, 0, 1 * Math.PI, !1),
    t.arc(e, n - 0.5 * i, 0.5 * i, 1 * Math.PI, 0.25 * Math.PI, !1),
    t.arc(e + 0.25 * i, n + 0.3 * i, 0.2 * i, 1.25 * Math.PI, 1 * Math.PI, !0),
    t.arc(e + 0.25 * i - 0.35 * i, n + 0.3 * i, 0.15 * i, 0, 1 * Math.PI, !1),
    t.arc(e + 0.25 * i, n + 0.3 * i, 0.5 * i, 1 * Math.PI, 1.25 * Math.PI, !1),
    t.closePath(),
    t.fill(),
    t.stroke(),
    t.beginPath(),
    t.arc(e + 0.25 * i - 0.35 * i, n + 0.85 * i, 0.15 * i, 0, 2 * Math.PI, !0),
    t.closePath(),
    t.fill(),
    t.stroke();
}
function yr(t, e, n, i, r) {
  const s = wr[e];
  return !!s && (s(t, n, i, r), !0);
}
function $r(t, e, n, i, r, s, o, a) {
  const h = Ar[e];
  return !!h && (h(t, n, i, r, s, o, a), !0);
}
vr?.({ LitElement: _r }), (globalThis.litElementVersions ??= []).push('4.1.1');
const wr = {
    circle(t, e, n, i) {
      t.beginPath(), t.arc(e, n, i, 0, 2 * Math.PI), t.fill(), t.stroke();
    },
    triangle(t, e, n, i) {
      t.beginPath(), t.moveTo(e, n - i), t.lineTo(e + i, n + i), t.lineTo(e - i, n + i), t.closePath(), t.fill(), t.stroke();
    },
    diamond(t, e, n, i) {
      t.beginPath(), t.moveTo(e, n - i), t.lineTo(e + i, n), t.lineTo(e, n + i), t.lineTo(e - i, n), t.closePath(), t.fill(), t.stroke();
    },
    pentagon: (t, e, n, i) => br(t, 5, e, n, i),
    hexagon: (t, e, n, i) => br(t, 6, e, n, i),
    chevron(t, e, n, i) {
      t.beginPath(),
        t.moveTo(e, n),
        t.lineTo(e + i, n - i),
        t.lineTo(e + i, n),
        t.lineTo(e, n + i),
        t.lineTo(e - i, n),
        t.lineTo(e - i, n - i),
        t.closePath(),
        t.fill(),
        t.stroke();
    },
    catFace(t, e, n, i) {
      const r = 0.2 * i,
        s = 0.4 * i,
        o = i;
      t.beginPath(),
        t.moveTo(e + s, n - r),
        t.lineTo(e + o, n - o),
        t.lineTo(e + o, n + r),
        t.lineTo(e + s, n + o),
        t.lineTo(e - s, n + o),
        t.lineTo(e - o, n + r),
        t.lineTo(e - o, n - o),
        t.lineTo(e - s, n - r),
        t.closePath(),
        t.fill(),
        t.stroke();
    },
    arrow(t, e, n, i) {
      const r = 0.1 * i,
        s = 0.4 * i,
        o = 0.8 * i,
        a = 1.2 * i;
      t.beginPath(),
        t.moveTo(e - r, n - a),
        t.lineTo(e - o, n - s),
        t.lineTo(e - r, n + a),
        t.lineTo(e + r, n + a),
        t.lineTo(e + o, n - s),
        t.lineTo(e + r, n - a),
        t.closePath(),
        t.fill(),
        t.stroke();
    },
    wave(t, e, n, i) {
      const r = 0.5 * i;
      t.beginPath(), t.ellipse(e - r, n, r, i, 0, Math.PI, 0, !1), t.ellipse(e + r, n, r, i, 0, Math.PI, 0, !0), t.closePath(), t.fill(), t.stroke();
    },
    doubleBar(t, e, n, i) {
      t.beginPath(), t.moveTo(e, n - i), t.lineTo(e + i, n - i), t.lineTo(e, n + i), t.lineTo(e - i, n + i), t.closePath(), t.fill(), t.stroke();
    },
  },
  Ar = {
    rectangle(t, e, n, i, r) {
      t.fillRect(e, n, i, r), t.strokeRect(e, n, i, r);
    },
    roundRectangle(t, e, n, i, r) {
      const s = 0.5 * r,
        o = Math.min(s, 0.5 * i);
      t.beginPath(),
        t.ellipse(e + o, n + s, o, s, 0, Math.PI, 1.5 * Math.PI, !1),
        t.ellipse(e + i - o, n + s, o, s, 0, 1.5 * Math.PI, 0, !1),
        t.ellipse(e + i - o, n + r - s, o, s, 0, 0, 0.5 * Math.PI, !1),
        t.ellipse(e + o, n + r - s, o, s, 0, 0.5 * Math.PI, Math.PI, !1),
        t.closePath(),
        t.fill(),
        t.stroke();
    },
    line(t, e, n, i, r, s) {
      const o = n + 0.5 * r;
      !(function (t, e, n, i, r) {
        t.beginPath(), t.moveTo(e, n), t.lineTo(i, r), t.stroke();
      })(t, e + s, o, e + i - s, o);
    },
    bridge(t, e, n, i, r, s, o) {
      if (((e += s), (i -= 2 * s), 1 === o))
        t.beginPath(),
          t.moveTo(e, n + 0.5 * r),
          t.lineTo(e + 0.5 * i, n + 0.5 * r),
          t.lineTo(e + 0.5 * i, n),
          t.lineTo(e + 0.5 * i, n + 0.5 * r),
          t.lineTo(e + i, n + 0.5 * r),
          t.lineTo(e + i, n + r),
          t.lineTo(e, n + r),
          t.closePath(),
          t.fill(),
          t.stroke();
      else {
        const s = 0.2 * r;
        t.beginPath(),
          t.moveTo(e, n),
          t.lineTo(e + i, n),
          t.lineTo(e + i, n + r),
          t.lineTo(e + i, n + s),
          t.lineTo(e, n + s),
          t.lineTo(e, n + r),
          t.closePath(),
          t.fill(),
          t.stroke();
      }
    },
    discontinuosStart(t, e, n, i, r) {
      const s = 0.2 * r,
        o = Math.min(s, 0.5 * i);
      t.beginPath(),
        t.moveTo(e, n),
        t.lineTo(e + o, n + s),
        t.lineTo(e, n + 2 * s),
        t.lineTo(e + o, n + 3 * s),
        t.lineTo(e, n + 4 * s),
        t.lineTo(e + o, n + r),
        t.lineTo(e + i, n + r),
        t.lineTo(e + i, n),
        t.closePath(),
        t.fill(),
        t.stroke();
    },
    discontinuosEnd(t, e, n, i, r) {
      const s = 0.2 * r,
        o = Math.min(s, 0.5 * i);
      t.beginPath(),
        t.moveTo(e, n),
        t.lineTo(e, n + r),
        t.lineTo(e + i, n + r),
        t.lineTo(e + i - o, n + 4 * s),
        t.lineTo(e + i, n + 3 * s),
        t.lineTo(e + i - o, n + 2 * s),
        t.lineTo(e + i, n + 1 * s),
        t.lineTo(e + i - o, n),
        t.closePath(),
        t.fill(),
        t.stroke();
    },
    discontinuos(t, e, n, i, r) {
      const s = 0.2 * r,
        o = Math.min(s, 0.5 * i);
      t.beginPath(),
        t.moveTo(e, n),
        t.lineTo(e + o, n + s),
        t.lineTo(e, n + 2 * s),
        t.lineTo(e + o, n + 3 * s),
        t.lineTo(e, n + 4 * s),
        t.lineTo(e + o, n + r),
        t.lineTo(e + i, n + r),
        t.lineTo(e + i - o, n + 4 * s),
        t.lineTo(e + i, n + 3 * s),
        t.lineTo(e + i - o, n + 2 * s),
        t.lineTo(e + i, n + 1 * s),
        t.lineTo(e + i - o, n),
        t.closePath(),
        t.fill(),
        t.stroke();
    },
    helix(t, e, n, i, r, s) {
      (e += s), (i -= 2 * s);
      const o = Math.min(0.4 * r, i),
        a = Math.floor(i / o),
        h = n + 0.05 * r,
        l = n + 0.95 * r;
      t.beginPath(), t.moveTo(e, l);
      for (let n = 0; n < a; n++) {
        const i = e + n * o;
        t.bezierCurveTo(i + 0.75 * o, l, i + 1.25 * o, h, i + 0.5 * o, h), t.bezierCurveTo(i, h, i + 0.5 * o, l, i + o, l);
      }
      t.lineTo(e + i, l), t.fill(), t.stroke();
    },
    strand(t, e, n, i, r, s) {
      (e += s), (i -= 2 * s);
      const o = 0.25 * r,
        a = Math.min(0.5 * r, 0.75 * i),
        h = 0.01 * a;
      t.beginPath(),
        t.moveTo(e, n + o),
        t.lineTo(e + i - a, n + o),
        t.lineTo(e + i - a, n),
        t.lineTo(e + i - a + h, n),
        t.lineTo(e + i, n + 0.5 * r),
        t.lineTo(e + i - a + h, n + r),
        t.lineTo(e + i - a, n + r),
        t.lineTo(e + i - a, n + r - o),
        t.lineTo(e, n + r - o),
        t.closePath(),
        t.fill(),
        t.stroke();
    },
  };
function br(t, e, n, i, r) {
  t.beginPath(), t.moveTo(n + r, i);
  for (let s = 1; s < e; s++) {
    const o = (2 * Math.PI * s) / e,
      a = n + r * Math.cos(o),
      h = i + r * Math.sin(o);
    t.lineTo(a, h);
  }
  t.closePath(), t.fill(), t.stroke();
}
function Sr(t) {
  let e = !1,
    n = !1;
  return {
    requestRefresh: function () {
      (e = !0),
        n ||
          (async function () {
            for (; e; ) {
              (e = !1), (n = !0), await xr(0);
              try {
                t();
              } catch (t) {
                console.error(t);
              }
              n = !1;
            }
          })();
    },
  };
}
function xr(t) {
  return new Promise((e) =>
    setTimeout(() => {
      e();
    }, t)
  );
}
function Er(t, e, n) {
  return (function (t, e, n, i, r) {
    if (n === i) return n;
    for (; i - n > 4; ) {
      const s = (n + i) >> 1;
      r(t[s]) >= e ? (i = s) : (n = s + 1);
    }
    for (let s = n; s < i; s++) if (r(t[s]) >= e) return s;
    return i;
  })(t, e, 0, t.length, n);
}
(Ar.discontinuousStart = Ar.discontinuosStart), (Ar.discontinuousEnd = Ar.discontinuosEnd), (Ar.discontinuous = Ar.discontinuos);
class Pr {
  constructor(t, e) {
    var n, i;
    (this.Q = 2), (this._tmpArrays = {}), (this.compareFn = (t, e) => this.starts[t] - this.starts[e] || this.stops[e] - this.stops[t]);
    const { start: r, stop: s } = e;
    (this.items = t), (this.starts = t.map(r)), (this.stops = t.map(s)), (this.bins = {});
    for (let e = 0; e < t.length; e++) {
      const t = this.stops[e] - this.starts[e];
      let r = 1;
      for (; r < t; ) r *= this.Q;
      (null !== (n = (i = this.bins)[r]) && void 0 !== n ? n : (i[r] = [])).push(e);
    }
    this.binSpans = (function (t) {
      return t.sort((t, e) => t - e);
    })(Object.keys(this.bins).map(Number));
    for (const t of this.binSpans) this.bins[t].sort(this.compareFn);
  }
  size() {
    return this.items.length;
  }
  overlappingItems(t, e) {
    return this.overlappingItemIndices(t, e).map((t) => this.items[t]);
  }
  overlappingItemIndices(t, e) {
    return (function (t, e) {
      const n = t.map((t, e) => e).filter((e) => t[e].length > 0);
      n.sort((n, i) => e(t[n][0], t[i][0]));
      const i = t.map(() => 0),
        r = [];
      for (; n.length > 0; ) {
        const s = n[0],
          o = t[s];
        if ((r.push(o[i[s]++]), i[s] === o.length)) n.shift();
        else {
          const r = o[i[s]];
          let a = 1;
          for (; a < n.length; a++) {
            const s = n[a],
              o = t[s][i[s]];
            if (!(e(o, r) < 0)) break;
            n[a - 1] = s;
          }
          n[a - 1] = s;
        }
      }
      return r;
    })(
      this.binSpans.map((n) => {
        var i, r;
        return this.overlappingItemIndicesInBin(n, t, e, null !== (i = (r = this._tmpArrays)[n]) && void 0 !== i ? i : (r[n] = []));
      }),
      this.compareFn
    );
  }
  overlappingItemIndicesInBin(t, e, n, i) {
    i.length = 0;
    const r = this.bins[t],
      s = Er(r, e - t, (t) => this.starts[t]),
      o = Er(r, n, (t) => this.starts[t]);
    for (let t = s; t < o; t++) {
      const n = r[t];
      this.stops[n] > e && i.push(n);
    }
    return i;
  }
  print() {
    for (const t of this.binSpans)
      console.log(`Bin ${t}:`, this.bins[t].map((t) => `${this.starts[t]}-${this.stops[t]}(${this.stops[t] - this.starts[t]})`).join('  '));
  }
}
let Tr = class extends t {
  constructor() {
    super(...arguments),
      (this.canvasScale = 1),
      (this._drawStamp = {}),
      (this.requestDraw = () => this._drawer.requestRefresh()),
      (this._drawer = Sr(() => this._draw())),
      (this._unknownShapeWarningPrinted = new Set());
  }
  connectedCallback() {
    console.log('nightingale-track-canvas connectedCallback'),
      super.connectedCallback(),
      $t(window).on(`resize.NightingaleTrackCanvas-${this.id}`, () => {
        const t = kr();
        t !== this.canvasScale && ((this.canvasScale = t), this.refresh());
      });
  }
  disconnectedCallback() {
    $t(window).on(`resize.NightingaleTrackCanvas-${this.id}`, null), super.disconnectedCallback();
  }
  onDimensionsChange() {
    super.onDimensionsChange(),
      this.canvas &&
        !this.canvas.empty() &&
        (this.canvas.style('width', `${this.width}px`), this.canvas.style('height', `${this.height}px`), (this.canvasScale = kr()));
  }
  createTrack() {
    var t, e, n;
    this.svg && (this.svg.selectAll('g').remove(), this.unbindEvents(this.svg)),
      this.data &&
        (null === (t = this.layoutObj) || void 0 === t || t.init(this.data),
        (this.svg = $t(this).selectAll('svg')),
        (this.canvas = $t(this).selectAll('canvas')),
        (this.canvasCtx = null !== (n = null === (e = this.canvas.node()) || void 0 === e ? void 0 : e.getContext('2d')) && void 0 !== n ? n : void 0),
        this.onDimensionsChange(),
        (this.fragmentCollection = (function (t) {
          const e = (function (t) {
            const e = [],
              n = t.length;
            for (let i = 0; i < n; i++) {
              const n = t[i];
              if (n.locations) for (const t of n.locations) for (const n of t.fragments) e.push({ ...n, featureIndex: i });
            }
            return e;
          })(t);
          return new Pr(e, {
            start: (t) => t.start,
            stop: (t) => {
              var e;
              return (null !== (e = t.end) && void 0 !== e ? e : t.start) + 1;
            },
          });
        })(this.data)),
        this.svg && (this.bindEvents(this.svg), (this.highlighted = this.svg.append('g').attr('class', 'highlighted'))));
  }
  refresh() {
    super.refresh(), this.requestDraw();
  }
  render() {
    return Gi`
      <div class="container">
        <div style="position: relative; z-index: 0;">
          <canvas style="position: absolute; left: 0; top: 0; z-index: -1;"></canvas>
          <svg></svg>
        </div>
      </div>
    `;
  }
  needsRedraw() {
    const t = {
      data: this.data,
      canvas: this.canvasCtx,
      extent: `${this.width}x${this.height}@${this.canvasScale}/${this.getSeqPositionFromX(0)}:${this.getSeqPositionFromX(this.width)}`,
    };
    return (t.data !== this._drawStamp.data || t.canvas !== this._drawStamp.canvas || t.extent !== this._drawStamp.extent) && ((this._drawStamp = t), !0);
  }
  _draw() {
    this.needsRedraw() && (this.adjustCanvasLogicalSize(), this.drawCanvasContent());
  }
  adjustCanvasLogicalSize() {
    if (!this.canvasCtx) return;
    const t = Math.floor(this.width * this.canvasScale),
      e = Math.floor(this.height * this.canvasScale);
    this.canvasCtx.canvas.width !== t && (this.canvasCtx.canvas.width = t), this.canvasCtx.canvas.height !== e && (this.canvasCtx.canvas.height = e);
  }
  drawCanvasContent() {
    var t, e, n, i, r, s, o, a, h, l;
    const c = this.canvasCtx;
    if (!c) return;
    const u = c.canvas.width,
      f = c.canvas.height;
    if ((c.clearRect(0, 0, u, f), !this.fragmentCollection)) return;
    const p = this.canvasScale;
    c.lineWidth = p * Nr;
    const d = p * this.getSingleBaseWidth(),
      g = p * Math.max(0, null !== (e = null === (t = this.layoutObj) || void 0 === t ? void 0 : t.getFeatureHeight()) && void 0 !== e ? e : 0),
      _ = Math.min(1.5 * p, 0.25 * d),
      v = null !== (n = this.getSeqPositionFromX(0 - Mr - 0.5 * Nr)) && void 0 !== n ? n : -1 / 0,
      m = null !== (i = this.getSeqPositionFromX(u / p + Mr + 0.5 * Nr)) && void 0 !== i ? i : 1 / 0,
      y = this.fragmentCollection.overlappingItems(v, m);
    for (const t of y) {
      const e = t.featureIndex,
        n = (null !== (r = t.end) && void 0 !== r ? r : t.start) + 1 - t.start,
        i = p * this.getXFromSeqPosition(t.start),
        u = n * d,
        f = p * (null !== (o = null === (s = this.layoutObj) || void 0 === s ? void 0 : s.getFeatureYPos(this.data[e])) && void 0 !== o ? o : 0),
        v = this.getShape(this.data[e]),
        m = null !== (a = t.color) && void 0 !== a ? a : this.getFeatureFillColor(this.data[e]),
        y = null !== (h = t.color) && void 0 !== h ? h : this.getFeatureColor(this.data[e]);
      (c.fillStyle = m), (c.strokeStyle = y), (c.globalAlpha = null !== (l = this.data[e].opacity) && void 0 !== l ? l : 0.9);
      if (!$r(c, v, i, f, u, g, _, n)) {
        const t = i + 0.5 * u,
          e = f + 0.5 * g,
          r = p * Mr;
        yr(c, v, t, e, r) || (this.printUnknownShapeWarning(v), mr(c, t, e, r)), n > 1 && $r(c, 'line', i, f, u, g, _, n);
      }
    }
    (c.globalAlpha = 1), (c.fillStyle = this['margin-color']);
    const $ = this['margin-left'] * p,
      w = this['margin-right'] * p,
      A = this['margin-top'] * p,
      b = this['margin-bottom'] * p;
    c.fillRect(0, 0, $, f), c.fillRect(u - w, 0, w, f), c.fillRect($, 0, u - $ - w, A), c.fillRect($, f - b, u - $ - w, b);
  }
  printUnknownShapeWarning(t) {
    this._unknownShapeWarningPrinted.has(t) ||
      (console.warn(`NightingaleTrackCanvas: Drawing shape "${t}" is not implemented. Will draw question marks instead ¯\\_(ツ)_/¯`),
      this._unknownShapeWarningPrinted.add(t));
  }
  getSeqPositionFromX(t) {
    var e;
    return null === (e = this.xScale) || void 0 === e ? void 0 : e.invert(t - this['margin-left']);
  }
  getFragmentAt(t, e) {
    var n, i;
    if (!this.fragmentCollection) return;
    const r = 0.5 * Nr,
      s = this.getSeqPositionFromX(t - Mr - r),
      o = this.getSeqPositionFromX(t + Mr + r);
    if (void 0 === s || void 0 === o) return;
    const a = this.fragmentCollection.overlappingItems(s, o),
      h = this.getSingleBaseWidth(),
      l = null !== (i = null === (n = this.layoutObj) || void 0 === n ? void 0 : n.getFeatureHeight()) && void 0 !== i ? i : 0;
    return (function (t, e) {
      if (!e) return t.length > 0 ? t[t.length - 1] : void 0;
      for (let n = t.length - 1; n >= 0; n--) {
        const i = t[n];
        if (e(i, n, t)) return i;
      }
    })(a, (n) => {
      var i, s, o;
      const a = this.data[n.featureIndex],
        c = null !== (s = null === (i = this.layoutObj) || void 0 === i ? void 0 : i.getFeatureYPos(a)) && void 0 !== s ? s : 0;
      if (!(c - r <= e && e <= c + l + r)) return !1;
      const u = (null !== (o = n.end) && void 0 !== o ? o : n.start) + 1 - n.start,
        f = this.getXFromSeqPosition(n.start);
      if (f - r <= t && t <= f + u * h + r) return !0;
      if ('range' != ((p = this.getShape(a)) in wr ? 'symbol' : p in Ar ? 'range' : 'unknown')) {
        const e = f + 0.5 * u * h;
        if (e - Mr - r <= t && t <= e + Mr + r) return !0;
      }
      var p;
      return !1;
    });
  }
  bindEvents(t) {
    t.on('click.NightingaleTrackCanvas', (t) => this.handleClick(t)),
      t.on('mousemove.NightingaleTrackCanvas', (t) => this.handleMousemove(t)),
      t.on('mouseout.NightingaleTrackCanvas', () => this.handleMouseout());
  }
  unbindEvents(t) {
    t.on('click.NightingaleTrackCanvas', null), t.on('mousemove.NightingaleTrackCanvas', null), t.on('mouseout.NightingaleTrackCanvas', null);
  }
  handleClick(t) {
    var e;
    const i = this.getFragmentAt(t.offsetX, t.offsetY);
    if (!i) return;
    const r = this.data[i.featureIndex],
      s = 'onclick' === this.getAttribute('highlight-event'),
      o = n('click', r, s, !0, i.start, null !== (e = i.end) && void 0 !== e ? e : i.start, t.target instanceof HTMLElement ? t.target : void 0, t, this);
    this.dispatchEvent(o);
  }
  handleMousemove(t) {
    var e;
    const i = this.getFragmentAt(t.offsetX, t.offsetY);
    if (!i) return this.handleMouseout();
    const r = this.data[i.featureIndex],
      s = 'onmouseover' === this.getAttribute('highlight-event'),
      o = n('mouseover', r, s, !1, i.start, null !== (e = i.end) && void 0 !== e ? e : i.start, t.target instanceof HTMLElement ? t.target : void 0, t, this);
    this.dispatchEvent(o);
  }
  handleMouseout() {
    const t = 'onmouseover' === this.getAttribute('highlight-event'),
      e = n('mouseout', null, t);
    this.dispatchEvent(e);
  }
};
Tr = (function (t, e, n, i) {
  var r,
    s = arguments.length,
    o = s < 3 ? e : null === i ? (i = Object.getOwnPropertyDescriptor(e, n)) : i;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) o = Reflect.decorate(t, e, n, i);
  else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (o = (s < 3 ? r(o) : s > 3 ? r(e, n, o) : r(e, n)) || o);
  return s > 3 && o && Object.defineProperty(e, n, o), o;
})([e('nightingale-track-canvas')], Tr);
var Cr = Tr;
function kr() {
  var t;
  return null !== (t = null === window || void 0 === window ? void 0 : window.devicePixelRatio) && void 0 !== t ? t : 1;
}
const Mr = 5,
  Nr = 1;
export { Cr as default };
//# sourceMappingURL=index.js.map
