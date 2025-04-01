function t(t, e, n, i) {
  var r,
    o = arguments.length,
    s = o < 3 ? e : null === i ? (i = Object.getOwnPropertyDescriptor(e, n)) : i;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
  else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(e, n, s) : r(e, n)) || s);
  return o > 3 && s && Object.defineProperty(e, n, s), s;
}
function e(t, e, n, i) {
  if ('a' === n && !i) throw new TypeError('Private accessor was defined without a getter');
  if ('function' == typeof e ? t !== e || !i : !e.has(t)) throw new TypeError('Cannot read private member from an object whose class did not declare it');
  return 'm' === n ? i : 'a' === n ? i.call(t) : i ? i.value : e.get(t);
}
function n(t, e, n, i, r) {
  if ('m' === i) throw new TypeError('Private method is not writable');
  if ('a' === i && !r) throw new TypeError('Private accessor was defined without a setter');
  if ('function' == typeof e ? t !== e || !r : !e.has(t)) throw new TypeError('Cannot write private member to an object whose class did not declare it');
  return 'a' === i ? r.call(t, n) : r ? (r.value = n) : e.set(t, n), n;
}
'function' == typeof SuppressedError && SuppressedError;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i = (t) => (e, n) => {
    void 0 !== n
      ? n.addInitializer(() => {
          customElements.define(t, e);
        })
      : customElements.define(t, e);
  },
  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ r = globalThis,
  o = r.ShadowRoot && (void 0 === r.ShadyCSS || r.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype,
  s = Symbol(),
  a = new WeakMap();
let h = class {
  constructor(t, e, n) {
    if (((this._$cssResult$ = !0), n !== s)) throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    (this.cssText = t), (this.t = e);
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (o && void 0 === t) {
      const n = void 0 !== e && 1 === e.length;
      n && (t = a.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && a.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const l = o
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return ((t) => new h('string' == typeof t ? t : t + '', void 0, s))(e);
            })(t)
          : t,
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ { is: u, defineProperty: c, getOwnPropertyDescriptor: f, getOwnPropertyNames: p, getOwnPropertySymbols: d, getPrototypeOf: g } = Object,
  m = globalThis,
  v = m.trustedTypes,
  y = v ? v.emptyScript : '',
  _ = m.reactiveElementPolyfillSupport,
  w = (t, e) => t,
  $ = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? y : null;
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
  b = (t, e) => !u(t, e),
  A = { attribute: !0, type: String, converter: $, reflect: !1, hasChanged: b };
(Symbol.metadata ??= Symbol('metadata')), (m.litPropertyMetadata ??= new WeakMap());
let x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = A) {
    if ((e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor)) {
      const n = Symbol(),
        i = this.getPropertyDescriptor(t, n, e);
      void 0 !== i && c(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: i, set: r } = f(this.prototype, t) ?? {
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
        const o = i?.call(this);
        r.call(this, e), this.requestUpdate(t, o, n);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? A;
  }
  static _$Ei() {
    if (this.hasOwnProperty(w('elementProperties'))) return;
    const t = g(this);
    t.finalize(), void 0 !== t.l && (this.l = [...t.l]), (this.elementProperties = new Map(t.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(w('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(w('properties')))) {
      const t = this.properties,
        e = [...p(t), ...d(t)];
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
      for (const t of n) e.unshift(l(t));
    } else void 0 !== t && e.push(l(t));
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
        if (o) t.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
        else
          for (const n of e) {
            const e = document.createElement('style'),
              i = r.litNonce;
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
      const r = (void 0 !== n.converter?.toAttribute ? n.converter : $).toAttribute(e, n.type);
      (this._$Em = t), null == r ? this.removeAttribute(i) : this.setAttribute(i, r), (this._$Em = null);
    }
  }
  _$AK(t, e) {
    const n = this.constructor,
      i = n._$Eh.get(t);
    if (void 0 !== i && this._$Em !== i) {
      const t = n.getPropertyOptions(i),
        r = 'function' == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : $;
      (this._$Em = i), (this[i] = r.fromAttribute(e, t.type)), (this._$Em = null);
    }
  }
  requestUpdate(t, e, n) {
    if (void 0 !== t) {
      if (((n ??= this.constructor.getPropertyOptions(t)), !(n.hasChanged ?? b)(this[t], e))) return;
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
(x.elementStyles = []),
  (x.shadowRootOptions = { mode: 'open' }),
  (x[w('elementProperties')] = new Map()),
  (x[w('finalized')] = new Map()),
  _?.({ ReactiveElement: x }),
  (m.reactiveElementVersions ??= []).push('2.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = { attribute: !0, type: String, converter: $, reflect: !1, hasChanged: b },
  E = (t = S, e, n) => {
    const { kind: i, metadata: r } = n;
    let o = globalThis.litPropertyMetadata.get(r);
    if ((void 0 === o && globalThis.litPropertyMetadata.set(r, (o = new Map())), o.set(n.name, t), 'accessor' === i)) {
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
function M(t) {
  return (e, n) =>
    'object' == typeof n
      ? E(t, e, n)
      : ((t, e, n) => {
          const i = e.hasOwnProperty(n);
          return e.constructor.createProperty(n, i ? { ...t, wrapped: !0 } : t), i ? Object.getOwnPropertyDescriptor(e, n) : void 0;
        })(t, e, n);
}
const C = (e, n) => {
  class i extends e {
    constructor() {
      super(...arguments), (this.width = null == n ? void 0 : n.width), (this.height = null == n ? void 0 : n.height);
    }
  }
  return t([M({ type: Number })], i.prototype, 'width', void 0), t([M({ type: Number, reflect: !0 })], i.prototype, 'height', void 0), i;
};
function N(t, e) {
  return null == t || null == e ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function k(t, e) {
  return null == t || null == e ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function P(t) {
  let e, n, i;
  function r(t, i, r = 0, o = t.length) {
    if (r < o) {
      if (0 !== e(i, i)) return o;
      do {
        const e = (r + o) >>> 1;
        n(t[e], i) < 0 ? (r = e + 1) : (o = e);
      } while (r < o);
    }
    return r;
  }
  return (
    2 !== t.length ? ((e = N), (n = (e, n) => N(t(e), n)), (i = (e, n) => t(e) - n)) : ((e = t === N || t === k ? t : T), (n = t), (i = t)),
    {
      left: r,
      center: function (t, e, n = 0, o = t.length) {
        const s = r(t, e, n, o - 1);
        return s > n && i(t[s - 1], e) > -i(t[s], e) ? s - 1 : s;
      },
      right: function (t, i, r = 0, o = t.length) {
        if (r < o) {
          if (0 !== e(i, i)) return o;
          do {
            const e = (r + o) >>> 1;
            n(t[e], i) <= 0 ? (r = e + 1) : (o = e);
          } while (r < o);
        }
        return r;
      },
    }
  );
}
function T() {
  return 0;
}
const z = P(N).right;
P(function (t) {
  return null === t ? NaN : +t;
}).center;
const U = Math.sqrt(50),
  O = Math.sqrt(10),
  H = Math.sqrt(2);
function R(t, e, n) {
  const i = (e - t) / Math.max(0, n),
    r = Math.floor(Math.log10(i)),
    o = i / Math.pow(10, r),
    s = o >= U ? 10 : o >= O ? 5 : o >= H ? 2 : 1;
  let a, h, l;
  return (
    r < 0
      ? ((l = Math.pow(10, -r) / s), (a = Math.round(t * l)), (h = Math.round(e * l)), a / l < t && ++a, h / l > e && --h, (l = -l))
      : ((l = Math.pow(10, r) * s), (a = Math.round(t / l)), (h = Math.round(e / l)), a * l < t && ++a, h * l > e && --h),
    h < a && 0.5 <= n && n < 2 ? R(t, e, 2 * n) : [a, h, l]
  );
}
function D(t, e, n) {
  return R((t = +t), (e = +e), (n = +n))[2];
}
var j = { value: () => {} };
function X() {
  for (var t, e = 0, n = arguments.length, i = {}; e < n; ++e) {
    if (!(t = arguments[e] + '') || t in i || /[\s.]/.test(t)) throw new Error('illegal type: ' + t);
    i[t] = [];
  }
  return new q(i);
}
function q(t) {
  this._ = t;
}
function B(t, e) {
  for (var n, i = 0, r = t.length; i < r; ++i) if ((n = t[i]).name === e) return n.value;
}
function L(t, e, n) {
  for (var i = 0, r = t.length; i < r; ++i)
    if (t[i].name === e) {
      (t[i] = j), (t = t.slice(0, i).concat(t.slice(i + 1)));
      break;
    }
  return null != n && t.push({ name: e, value: n }), t;
}
q.prototype = X.prototype = {
  constructor: q,
  on: function (t, e) {
    var n,
      i,
      r = this._,
      o =
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
      s = -1,
      a = o.length;
    if (!(arguments.length < 2)) {
      if (null != e && 'function' != typeof e) throw new Error('invalid callback: ' + e);
      for (; ++s < a; )
        if ((n = (t = o[s]).type)) r[n] = L(r[n], t.name, e);
        else if (null == e) for (n in r) r[n] = L(r[n], t.name, null);
      return this;
    }
    for (; ++s < a; ) if ((n = (t = o[s]).type) && (n = B(r[n], t.name))) return n;
  },
  copy: function () {
    var t = {},
      e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new q(t);
  },
  call: function (t, e) {
    if ((n = arguments.length - 2) > 0) for (var n, i, r = new Array(n), o = 0; o < n; ++o) r[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (o = 0, n = (i = this._[t]).length; o < n; ++o) i[o].value.apply(e, r);
  },
  apply: function (t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (var i = this._[t], r = 0, o = i.length; r < o; ++r) i[r].value.apply(e, n);
  },
};
var I = 'http://www.w3.org/1999/xhtml',
  W = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: I,
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
  };
function V(t) {
  var e = (t += ''),
    n = e.indexOf(':');
  return n >= 0 && 'xmlns' !== (e = t.slice(0, n)) && (t = t.slice(n + 1)), W.hasOwnProperty(e) ? { space: W[e], local: t } : t;
}
function Y(t) {
  return function () {
    var e = this.ownerDocument,
      n = this.namespaceURI;
    return n === I && e.documentElement.namespaceURI === I ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function F(t) {
  return function () {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Z(t) {
  var e = V(t);
  return (e.local ? F : Y)(e);
}
function K() {}
function G(t) {
  return null == t
    ? K
    : function () {
        return this.querySelector(t);
      };
}
function J() {
  return [];
}
function Q(t) {
  return null == t
    ? J
    : function () {
        return this.querySelectorAll(t);
      };
}
function tt(t) {
  return function () {
    return null == (e = t.apply(this, arguments)) ? [] : Array.isArray(e) ? e : Array.from(e);
    var e;
  };
}
function et(t) {
  return function () {
    return this.matches(t);
  };
}
function nt(t) {
  return function (e) {
    return e.matches(t);
  };
}
var it = Array.prototype.find;
function rt() {
  return this.firstElementChild;
}
var ot = Array.prototype.filter;
function st() {
  return Array.from(this.children);
}
function at(t) {
  return new Array(t.length);
}
function ht(t, e) {
  (this.ownerDocument = t.ownerDocument), (this.namespaceURI = t.namespaceURI), (this._next = null), (this._parent = t), (this.__data__ = e);
}
function lt(t, e, n, i, r, o) {
  for (var s, a = 0, h = e.length, l = o.length; a < l; ++a) (s = e[a]) ? ((s.__data__ = o[a]), (i[a] = s)) : (n[a] = new ht(t, o[a]));
  for (; a < h; ++a) (s = e[a]) && (r[a] = s);
}
function ut(t, e, n, i, r, o, s) {
  var a,
    h,
    l,
    u = new Map(),
    c = e.length,
    f = o.length,
    p = new Array(c);
  for (a = 0; a < c; ++a) (h = e[a]) && ((p[a] = l = s.call(h, h.__data__, a, e) + ''), u.has(l) ? (r[a] = h) : u.set(l, h));
  for (a = 0; a < f; ++a) (l = s.call(t, o[a], a, o) + ''), (h = u.get(l)) ? ((i[a] = h), (h.__data__ = o[a]), u.delete(l)) : (n[a] = new ht(t, o[a]));
  for (a = 0; a < c; ++a) (h = e[a]) && u.get(p[a]) === h && (r[a] = h);
}
function ct(t) {
  return t.__data__;
}
function ft(t) {
  return 'object' == typeof t && 'length' in t ? t : Array.from(t);
}
function pt(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function dt(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function gt(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function mt(t, e) {
  return function () {
    this.setAttribute(t, e);
  };
}
function vt(t, e) {
  return function () {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function yt(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function _t(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function wt(t) {
  return (t.ownerDocument && t.ownerDocument.defaultView) || (t.document && t) || t.defaultView;
}
function $t(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
function bt(t, e, n) {
  return function () {
    this.style.setProperty(t, e, n);
  };
}
function At(t, e, n) {
  return function () {
    var i = e.apply(this, arguments);
    null == i ? this.style.removeProperty(t) : this.style.setProperty(t, i, n);
  };
}
function xt(t, e) {
  return t.style.getPropertyValue(e) || wt(t).getComputedStyle(t, null).getPropertyValue(e);
}
function St(t) {
  return function () {
    delete this[t];
  };
}
function Et(t, e) {
  return function () {
    this[t] = e;
  };
}
function Mt(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? delete this[t] : (this[t] = n);
  };
}
function Ct(t) {
  return t.trim().split(/^|\s+/);
}
function Nt(t) {
  return t.classList || new kt(t);
}
function kt(t) {
  (this._node = t), (this._names = Ct(t.getAttribute('class') || ''));
}
function Pt(t, e) {
  for (var n = Nt(t), i = -1, r = e.length; ++i < r; ) n.add(e[i]);
}
function Tt(t, e) {
  for (var n = Nt(t), i = -1, r = e.length; ++i < r; ) n.remove(e[i]);
}
function zt(t) {
  return function () {
    Pt(this, t);
  };
}
function Ut(t) {
  return function () {
    Tt(this, t);
  };
}
function Ot(t, e) {
  return function () {
    (e.apply(this, arguments) ? Pt : Tt)(this, t);
  };
}
function Ht() {
  this.textContent = '';
}
function Rt(t) {
  return function () {
    this.textContent = t;
  };
}
function Dt(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.textContent = e ?? '';
  };
}
function jt() {
  this.innerHTML = '';
}
function Xt(t) {
  return function () {
    this.innerHTML = t;
  };
}
function qt(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? '';
  };
}
function Bt() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Lt() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function It() {
  return null;
}
function Wt() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Vt() {
  var t = this.cloneNode(!1),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Yt() {
  var t = this.cloneNode(!0),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Ft(t) {
  return function () {
    var e = this.__on;
    if (e) {
      for (var n, i = 0, r = -1, o = e.length; i < o; ++i)
        (n = e[i]), (t.type && n.type !== t.type) || n.name !== t.name ? (e[++r] = n) : this.removeEventListener(n.type, n.listener, n.options);
      ++r ? (e.length = r) : delete this.__on;
    }
  };
}
function Zt(t, e, n) {
  return function () {
    var i,
      r = this.__on,
      o = (function (t) {
        return function (e) {
          t.call(this, e, this.__data__);
        };
      })(e);
    if (r)
      for (var s = 0, a = r.length; s < a; ++s)
        if ((i = r[s]).type === t.type && i.name === t.name)
          return this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, (i.listener = o), (i.options = n)), void (i.value = e);
    this.addEventListener(t.type, o, n), (i = { type: t.type, name: t.name, value: e, listener: o, options: n }), r ? r.push(i) : (this.__on = [i]);
  };
}
function Kt(t, e, n) {
  var i = wt(t),
    r = i.CustomEvent;
  'function' == typeof r
    ? (r = new r(e, n))
    : ((r = i.document.createEvent('Event')), n ? (r.initEvent(e, n.bubbles, n.cancelable), (r.detail = n.detail)) : r.initEvent(e, !1, !1)),
    t.dispatchEvent(r);
}
function Gt(t, e) {
  return function () {
    return Kt(this, t, e);
  };
}
function Jt(t, e) {
  return function () {
    return Kt(this, t, e.apply(this, arguments));
  };
}
(ht.prototype = {
  constructor: ht,
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
  (kt.prototype = {
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
var Qt = [null];
function te(t, e) {
  (this._groups = t), (this._parents = e);
}
function ee() {
  return new te([[document.documentElement]], Qt);
}
function ne(t) {
  return 'string' == typeof t ? new te([[document.querySelector(t)]], [document.documentElement]) : new te([[t]], Qt);
}
function ie(t, e) {
  if (
    ((t = (function (t) {
      let e;
      for (; (e = t.sourceEvent); ) t = e;
      return t;
    })(t)),
    void 0 === e && (e = t.currentTarget),
    e)
  ) {
    var n = e.ownerSVGElement || e;
    if (n.createSVGPoint) {
      var i = n.createSVGPoint();
      return (i.x = t.clientX), (i.y = t.clientY), [(i = i.matrixTransform(e.getScreenCTM().inverse())).x, i.y];
    }
    if (e.getBoundingClientRect) {
      var r = e.getBoundingClientRect();
      return [t.clientX - r.left - e.clientLeft, t.clientY - r.top - e.clientTop];
    }
  }
  return [t.pageX, t.pageY];
}
te.prototype = ee.prototype = {
  constructor: te,
  select: function (t) {
    'function' != typeof t && (t = G(t));
    for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
      for (var o, s, a = e[r], h = a.length, l = (i[r] = new Array(h)), u = 0; u < h; ++u)
        (o = a[u]) && (s = t.call(o, o.__data__, u, a)) && ('__data__' in o && (s.__data__ = o.__data__), (l[u] = s));
    return new te(i, this._parents);
  },
  selectAll: function (t) {
    t = 'function' == typeof t ? tt(t) : Q(t);
    for (var e = this._groups, n = e.length, i = [], r = [], o = 0; o < n; ++o)
      for (var s, a = e[o], h = a.length, l = 0; l < h; ++l) (s = a[l]) && (i.push(t.call(s, s.__data__, l, a)), r.push(s));
    return new te(i, r);
  },
  selectChild: function (t) {
    return this.select(
      null == t
        ? rt
        : (function (t) {
            return function () {
              return it.call(this.children, t);
            };
          })('function' == typeof t ? t : nt(t))
    );
  },
  selectChildren: function (t) {
    return this.selectAll(
      null == t
        ? st
        : (function (t) {
            return function () {
              return ot.call(this.children, t);
            };
          })('function' == typeof t ? t : nt(t))
    );
  },
  filter: function (t) {
    'function' != typeof t && (t = et(t));
    for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
      for (var o, s = e[r], a = s.length, h = (i[r] = []), l = 0; l < a; ++l) (o = s[l]) && t.call(o, o.__data__, l, s) && h.push(o);
    return new te(i, this._parents);
  },
  data: function (t, e) {
    if (!arguments.length) return Array.from(this, ct);
    var n,
      i = e ? ut : lt,
      r = this._parents,
      o = this._groups;
    'function' != typeof t &&
      ((n = t),
      (t = function () {
        return n;
      }));
    for (var s = o.length, a = new Array(s), h = new Array(s), l = new Array(s), u = 0; u < s; ++u) {
      var c = r[u],
        f = o[u],
        p = f.length,
        d = ft(t.call(c, c && c.__data__, u, r)),
        g = d.length,
        m = (h[u] = new Array(g)),
        v = (a[u] = new Array(g));
      i(c, f, m, v, (l[u] = new Array(p)), d, e);
      for (var y, _, w = 0, $ = 0; w < g; ++w)
        if ((y = m[w])) {
          for (w >= $ && ($ = w + 1); !(_ = v[$]) && ++$ < g; );
          y._next = _ || null;
        }
    }
    return ((a = new te(a, r))._enter = h), (a._exit = l), a;
  },
  enter: function () {
    return new te(this._enter || this._groups.map(at), this._parents);
  },
  exit: function () {
    return new te(this._exit || this._groups.map(at), this._parents);
  },
  join: function (t, e, n) {
    var i = this.enter(),
      r = this,
      o = this.exit();
    return (
      'function' == typeof t ? (i = t(i)) && (i = i.selection()) : (i = i.append(t + '')),
      null != e && (r = e(r)) && (r = r.selection()),
      null == n ? o.remove() : n(o),
      i && r ? i.merge(r).order() : r
    );
  },
  merge: function (t) {
    for (
      var e = t.selection ? t.selection() : t, n = this._groups, i = e._groups, r = n.length, o = i.length, s = Math.min(r, o), a = new Array(r), h = 0;
      h < s;
      ++h
    )
      for (var l, u = n[h], c = i[h], f = u.length, p = (a[h] = new Array(f)), d = 0; d < f; ++d) (l = u[d] || c[d]) && (p[d] = l);
    for (; h < r; ++h) a[h] = n[h];
    return new te(a, this._parents);
  },
  selection: function () {
    return this;
  },
  order: function () {
    for (var t = this._groups, e = -1, n = t.length; ++e < n; )
      for (var i, r = t[e], o = r.length - 1, s = r[o]; --o >= 0; ) (i = r[o]) && (s && 4 ^ i.compareDocumentPosition(s) && s.parentNode.insertBefore(i, s), (s = i));
    return this;
  },
  sort: function (t) {
    function e(e, n) {
      return e && n ? t(e.__data__, n.__data__) : !e - !n;
    }
    t || (t = pt);
    for (var n = this._groups, i = n.length, r = new Array(i), o = 0; o < i; ++o) {
      for (var s, a = n[o], h = a.length, l = (r[o] = new Array(h)), u = 0; u < h; ++u) (s = a[u]) && (l[u] = s);
      l.sort(e);
    }
    return new te(r, this._parents).order();
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
      for (var i = t[e], r = 0, o = i.length; r < o; ++r) {
        var s = i[r];
        if (s) return s;
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
    for (var e = this._groups, n = 0, i = e.length; n < i; ++n) for (var r, o = e[n], s = 0, a = o.length; s < a; ++s) (r = o[s]) && t.call(r, r.__data__, s, o);
    return this;
  },
  attr: function (t, e) {
    var n = V(t);
    if (arguments.length < 2) {
      var i = this.node();
      return n.local ? i.getAttributeNS(n.space, n.local) : i.getAttribute(n);
    }
    return this.each((null == e ? (n.local ? gt : dt) : 'function' == typeof e ? (n.local ? _t : yt) : n.local ? vt : mt)(n, e));
  },
  style: function (t, e, n) {
    return arguments.length > 1 ? this.each((null == e ? $t : 'function' == typeof e ? At : bt)(t, e, n ?? '')) : xt(this.node(), t);
  },
  property: function (t, e) {
    return arguments.length > 1 ? this.each((null == e ? St : 'function' == typeof e ? Mt : Et)(t, e)) : this.node()[t];
  },
  classed: function (t, e) {
    var n = Ct(t + '');
    if (arguments.length < 2) {
      for (var i = Nt(this.node()), r = -1, o = n.length; ++r < o; ) if (!i.contains(n[r])) return !1;
      return !0;
    }
    return this.each(('function' == typeof e ? Ot : e ? zt : Ut)(n, e));
  },
  text: function (t) {
    return arguments.length ? this.each(null == t ? Ht : ('function' == typeof t ? Dt : Rt)(t)) : this.node().textContent;
  },
  html: function (t) {
    return arguments.length ? this.each(null == t ? jt : ('function' == typeof t ? qt : Xt)(t)) : this.node().innerHTML;
  },
  raise: function () {
    return this.each(Bt);
  },
  lower: function () {
    return this.each(Lt);
  },
  append: function (t) {
    var e = 'function' == typeof t ? t : Z(t);
    return this.select(function () {
      return this.appendChild(e.apply(this, arguments));
    });
  },
  insert: function (t, e) {
    var n = 'function' == typeof t ? t : Z(t),
      i = null == e ? It : 'function' == typeof e ? e : G(e);
    return this.select(function () {
      return this.insertBefore(n.apply(this, arguments), i.apply(this, arguments) || null);
    });
  },
  remove: function () {
    return this.each(Wt);
  },
  clone: function (t) {
    return this.select(t ? Yt : Vt);
  },
  datum: function (t) {
    return arguments.length ? this.property('__data__', t) : this.node().__data__;
  },
  on: function (t, e, n) {
    var i,
      r,
      o = (function (t) {
        return t
          .trim()
          .split(/^|\s+/)
          .map(function (t) {
            var e = '',
              n = t.indexOf('.');
            return n >= 0 && ((e = t.slice(n + 1)), (t = t.slice(0, n))), { type: t, name: e };
          });
      })(t + ''),
      s = o.length;
    if (!(arguments.length < 2)) {
      for (a = e ? Zt : Ft, i = 0; i < s; ++i) this.each(a(o[i], e, n));
      return this;
    }
    var a = this.node().__on;
    if (a) for (var h, l = 0, u = a.length; l < u; ++l) for (i = 0, h = a[l]; i < s; ++i) if ((r = o[i]).type === h.type && r.name === h.name) return h.value;
  },
  dispatch: function (t, e) {
    return this.each(('function' == typeof e ? Jt : Gt)(t, e));
  },
  [Symbol.iterator]: function* () {
    for (var t = this._groups, e = 0, n = t.length; e < n; ++e) for (var i, r = t[e], o = 0, s = r.length; o < s; ++o) (i = r[o]) && (yield i);
  },
};
const re = { capture: !0, passive: !1 };
function oe(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function se(t, e, n) {
  (t.prototype = e.prototype = n), (n.constructor = t);
}
function ae(t, e) {
  var n = Object.create(t.prototype);
  for (var i in e) n[i] = e[i];
  return n;
}
function he() {}
var le = 0.7,
  ue = 1 / le,
  ce = '\\s*([+-]?\\d+)\\s*',
  fe = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*',
  pe = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
  de = /^#([0-9a-f]{3,8})$/,
  ge = new RegExp(`^rgb\\(${ce},${ce},${ce}\\)$`),
  me = new RegExp(`^rgb\\(${pe},${pe},${pe}\\)$`),
  ve = new RegExp(`^rgba\\(${ce},${ce},${ce},${fe}\\)$`),
  ye = new RegExp(`^rgba\\(${pe},${pe},${pe},${fe}\\)$`),
  _e = new RegExp(`^hsl\\(${fe},${pe},${pe}\\)$`),
  we = new RegExp(`^hsla\\(${fe},${pe},${pe},${fe}\\)$`),
  $e = {
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
function be() {
  return this.rgb().formatHex();
}
function Ae() {
  return this.rgb().formatRgb();
}
function xe(t) {
  var e, n;
  return (
    (t = (t + '').trim().toLowerCase()),
    (e = de.exec(t))
      ? ((n = e[1].length),
        (e = parseInt(e[1], 16)),
        6 === n
          ? Se(e)
          : 3 === n
            ? new Ce(((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), ((15 & e) << 4) | (15 & e), 1)
            : 8 === n
              ? Ee((e >> 24) & 255, (e >> 16) & 255, (e >> 8) & 255, (255 & e) / 255)
              : 4 === n
                ? Ee(((e >> 12) & 15) | ((e >> 8) & 240), ((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), (((15 & e) << 4) | (15 & e)) / 255)
                : null)
      : (e = ge.exec(t))
        ? new Ce(e[1], e[2], e[3], 1)
        : (e = me.exec(t))
          ? new Ce((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, 1)
          : (e = ve.exec(t))
            ? Ee(e[1], e[2], e[3], e[4])
            : (e = ye.exec(t))
              ? Ee((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, e[4])
              : (e = _e.exec(t))
                ? Ue(e[1], e[2] / 100, e[3] / 100, 1)
                : (e = we.exec(t))
                  ? Ue(e[1], e[2] / 100, e[3] / 100, e[4])
                  : $e.hasOwnProperty(t)
                    ? Se($e[t])
                    : 'transparent' === t
                      ? new Ce(NaN, NaN, NaN, 0)
                      : null
  );
}
function Se(t) {
  return new Ce((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1);
}
function Ee(t, e, n, i) {
  return i <= 0 && (t = e = n = NaN), new Ce(t, e, n, i);
}
function Me(t, e, n, i) {
  return 1 === arguments.length
    ? (function (t) {
        return t instanceof he || (t = xe(t)), t ? new Ce((t = t.rgb()).r, t.g, t.b, t.opacity) : new Ce();
      })(t)
    : new Ce(t, e, n, i ?? 1);
}
function Ce(t, e, n, i) {
  (this.r = +t), (this.g = +e), (this.b = +n), (this.opacity = +i);
}
function Ne() {
  return `#${ze(this.r)}${ze(this.g)}${ze(this.b)}`;
}
function ke() {
  const t = Pe(this.opacity);
  return `${1 === t ? 'rgb(' : 'rgba('}${Te(this.r)}, ${Te(this.g)}, ${Te(this.b)}${1 === t ? ')' : `, ${t})`}`;
}
function Pe(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Te(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function ze(t) {
  return ((t = Te(t)) < 16 ? '0' : '') + t.toString(16);
}
function Ue(t, e, n, i) {
  return i <= 0 ? (t = e = n = NaN) : n <= 0 || n >= 1 ? (t = e = NaN) : e <= 0 && (t = NaN), new He(t, e, n, i);
}
function Oe(t) {
  if (t instanceof He) return new He(t.h, t.s, t.l, t.opacity);
  if ((t instanceof he || (t = xe(t)), !t)) return new He();
  if (t instanceof He) return t;
  var e = (t = t.rgb()).r / 255,
    n = t.g / 255,
    i = t.b / 255,
    r = Math.min(e, n, i),
    o = Math.max(e, n, i),
    s = NaN,
    a = o - r,
    h = (o + r) / 2;
  return (
    a
      ? ((s = e === o ? (n - i) / a + 6 * (n < i) : n === o ? (i - e) / a + 2 : (e - n) / a + 4), (a /= h < 0.5 ? o + r : 2 - o - r), (s *= 60))
      : (a = h > 0 && h < 1 ? 0 : s),
    new He(s, a, h, t.opacity)
  );
}
function He(t, e, n, i) {
  (this.h = +t), (this.s = +e), (this.l = +n), (this.opacity = +i);
}
function Re(t) {
  return (t = (t || 0) % 360) < 0 ? t + 360 : t;
}
function De(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function je(t, e, n) {
  return 255 * (t < 60 ? e + ((n - e) * t) / 60 : t < 180 ? n : t < 240 ? e + ((n - e) * (240 - t)) / 60 : e);
}
se(he, xe, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: be,
  formatHex: be,
  formatHex8: function () {
    return this.rgb().formatHex8();
  },
  formatHsl: function () {
    return Oe(this).formatHsl();
  },
  formatRgb: Ae,
  toString: Ae,
}),
  se(
    Ce,
    Me,
    ae(he, {
      brighter(t) {
        return (t = null == t ? ue : Math.pow(ue, t)), new Ce(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? le : Math.pow(le, t)), new Ce(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Ce(Te(this.r), Te(this.g), Te(this.b), Pe(this.opacity));
      },
      displayable() {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
      },
      hex: Ne,
      formatHex: Ne,
      formatHex8: function () {
        return `#${ze(this.r)}${ze(this.g)}${ze(this.b)}${ze(255 * (isNaN(this.opacity) ? 1 : this.opacity))}`;
      },
      formatRgb: ke,
      toString: ke,
    })
  ),
  se(
    He,
    function (t, e, n, i) {
      return 1 === arguments.length ? Oe(t) : new He(t, e, n, i ?? 1);
    },
    ae(he, {
      brighter(t) {
        return (t = null == t ? ue : Math.pow(ue, t)), new He(this.h, this.s, this.l * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? le : Math.pow(le, t)), new He(this.h, this.s, this.l * t, this.opacity);
      },
      rgb() {
        var t = (this.h % 360) + 360 * (this.h < 0),
          e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
          n = this.l,
          i = n + (n < 0.5 ? n : 1 - n) * e,
          r = 2 * n - i;
        return new Ce(je(t >= 240 ? t - 240 : t + 120, r, i), je(t, r, i), je(t < 120 ? t + 240 : t - 120, r, i), this.opacity);
      },
      clamp() {
        return new He(Re(this.h), De(this.s), De(this.l), Pe(this.opacity));
      },
      displayable() {
        return ((0 <= this.s && this.s <= 1) || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
      },
      formatHsl() {
        const t = Pe(this.opacity);
        return `${1 === t ? 'hsl(' : 'hsla('}${Re(this.h)}, ${100 * De(this.s)}%, ${100 * De(this.l)}%${1 === t ? ')' : `, ${t})`}`;
      },
    })
  );
var Xe = (t) => () => t;
function qe(t) {
  return 1 == (t = +t)
    ? Be
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
          : Xe(isNaN(e) ? n : e);
      };
}
function Be(t, e) {
  var n = e - t;
  return n
    ? (function (t, e) {
        return function (n) {
          return t + n * e;
        };
      })(t, n)
    : Xe(isNaN(t) ? e : t);
}
var Le = (function t(e) {
  var n = qe(e);
  function i(t, e) {
    var i = n((t = Me(t)).r, (e = Me(e)).r),
      r = n(t.g, e.g),
      o = n(t.b, e.b),
      s = Be(t.opacity, e.opacity);
    return function (e) {
      return (t.r = i(e)), (t.g = r(e)), (t.b = o(e)), (t.opacity = s(e)), t + '';
    };
  }
  return (i.gamma = t), i;
})(1);
function Ie(t, e) {
  e || (e = []);
  var n,
    i = t ? Math.min(e.length, t.length) : 0,
    r = e.slice();
  return function (o) {
    for (n = 0; n < i; ++n) r[n] = t[n] * (1 - o) + e[n] * o;
    return r;
  };
}
function We(t, e) {
  var n,
    i = e ? e.length : 0,
    r = t ? Math.min(i, t.length) : 0,
    o = new Array(r),
    s = new Array(i);
  for (n = 0; n < r; ++n) o[n] = Je(t[n], e[n]);
  for (; n < i; ++n) s[n] = e[n];
  return function (t) {
    for (n = 0; n < r; ++n) s[n] = o[n](t);
    return s;
  };
}
function Ve(t, e) {
  var n = new Date();
  return (
    (t = +t),
    (e = +e),
    function (i) {
      return n.setTime(t * (1 - i) + e * i), n;
    }
  );
}
function Ye(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return t * (1 - n) + e * n;
    }
  );
}
function Fe(t, e) {
  var n,
    i = {},
    r = {};
  for (n in ((null !== t && 'object' == typeof t) || (t = {}), (null !== e && 'object' == typeof e) || (e = {}), e)) n in t ? (i[n] = Je(t[n], e[n])) : (r[n] = e[n]);
  return function (t) {
    for (n in i) r[n] = i[n](t);
    return r;
  };
}
var Ze = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  Ke = new RegExp(Ze.source, 'g');
function Ge(t, e) {
  var n,
    i,
    r,
    o = (Ze.lastIndex = Ke.lastIndex = 0),
    s = -1,
    a = [],
    h = [];
  for (t += '', e += ''; (n = Ze.exec(t)) && (i = Ke.exec(e)); )
    (r = i.index) > o && ((r = e.slice(o, r)), a[s] ? (a[s] += r) : (a[++s] = r)),
      (n = n[0]) === (i = i[0]) ? (a[s] ? (a[s] += i) : (a[++s] = i)) : ((a[++s] = null), h.push({ i: s, x: Ye(n, i) })),
      (o = Ke.lastIndex);
  return (
    o < e.length && ((r = e.slice(o)), a[s] ? (a[s] += r) : (a[++s] = r)),
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
function Je(t, e) {
  var n,
    i,
    r = typeof e;
  return null == e || 'boolean' === r
    ? Xe(e)
    : ('number' === r
        ? Ye
        : 'string' === r
          ? (n = xe(e))
            ? ((e = n), Le)
            : Ge
          : e instanceof xe
            ? Le
            : e instanceof Date
              ? Ve
              : ((i = e),
                !ArrayBuffer.isView(i) || i instanceof DataView
                  ? Array.isArray(e)
                    ? We
                    : ('function' != typeof e.valueOf && 'function' != typeof e.toString) || isNaN(e)
                      ? Fe
                      : Ye
                  : Ie))(t, e);
}
function Qe(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return Math.round(t * (1 - n) + e * n);
    }
  );
}
var tn,
  en = 180 / Math.PI,
  nn = { translateX: 0, translateY: 0, rotate: 0, skewX: 0, scaleX: 1, scaleY: 1 };
function rn(t, e, n, i, r, o) {
  var s, a, h;
  return (
    (s = Math.sqrt(t * t + e * e)) && ((t /= s), (e /= s)),
    (h = t * n + e * i) && ((n -= t * h), (i -= e * h)),
    (a = Math.sqrt(n * n + i * i)) && ((n /= a), (i /= a), (h /= a)),
    t * i < e * n && ((t = -t), (e = -e), (h = -h), (s = -s)),
    { translateX: r, translateY: o, rotate: Math.atan2(e, t) * en, skewX: Math.atan(h) * en, scaleX: s, scaleY: a }
  );
}
function on(t, e, n, i) {
  function r(t) {
    return t.length ? t.pop() + ' ' : '';
  }
  return function (o, s) {
    var a = [],
      h = [];
    return (
      (o = t(o)),
      (s = t(s)),
      (function (t, i, r, o, s, a) {
        if (t !== r || i !== o) {
          var h = s.push('translate(', null, e, null, n);
          a.push({ i: h - 4, x: Ye(t, r) }, { i: h - 2, x: Ye(i, o) });
        } else (r || o) && s.push('translate(' + r + e + o + n);
      })(o.translateX, o.translateY, s.translateX, s.translateY, a, h),
      (function (t, e, n, o) {
        t !== e
          ? (t - e > 180 ? (e += 360) : e - t > 180 && (t += 360), o.push({ i: n.push(r(n) + 'rotate(', null, i) - 2, x: Ye(t, e) }))
          : e && n.push(r(n) + 'rotate(' + e + i);
      })(o.rotate, s.rotate, a, h),
      (function (t, e, n, o) {
        t !== e ? o.push({ i: n.push(r(n) + 'skewX(', null, i) - 2, x: Ye(t, e) }) : e && n.push(r(n) + 'skewX(' + e + i);
      })(o.skewX, s.skewX, a, h),
      (function (t, e, n, i, o, s) {
        if (t !== n || e !== i) {
          var a = o.push(r(o) + 'scale(', null, ',', null, ')');
          s.push({ i: a - 4, x: Ye(t, n) }, { i: a - 2, x: Ye(e, i) });
        } else (1 === n && 1 === i) || o.push(r(o) + 'scale(' + n + ',' + i + ')');
      })(o.scaleX, o.scaleY, s.scaleX, s.scaleY, a, h),
      (o = s = null),
      function (t) {
        for (var e, n = -1, i = h.length; ++n < i; ) a[(e = h[n]).i] = e.x(t);
        return a.join('');
      }
    );
  };
}
var sn = on(
    function (t) {
      const e = new ('function' == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(t + '');
      return e.isIdentity ? nn : rn(e.a, e.b, e.c, e.d, e.e, e.f);
    },
    'px, ',
    'px)',
    'deg)'
  ),
  an = on(
    function (t) {
      return null == t
        ? nn
        : (tn || (tn = document.createElementNS('http://www.w3.org/2000/svg', 'g')),
          tn.setAttribute('transform', t),
          (t = tn.transform.baseVal.consolidate()) ? rn((t = t.matrix).a, t.b, t.c, t.d, t.e, t.f) : nn);
    },
    ', ',
    ')',
    ')'
  );
function hn(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
var ln,
  un,
  cn = (function t(e, n, i) {
    function r(t, r) {
      var o,
        s,
        a = t[0],
        h = t[1],
        l = t[2],
        u = r[0],
        c = r[1],
        f = r[2],
        p = u - a,
        d = c - h,
        g = p * p + d * d;
      if (g < 1e-12)
        (s = Math.log(f / l) / e),
          (o = function (t) {
            return [a + t * p, h + t * d, l * Math.exp(e * t * s)];
          });
      else {
        var m = Math.sqrt(g),
          v = (f * f - l * l + i * g) / (2 * l * n * m),
          y = (f * f - l * l - i * g) / (2 * f * n * m),
          _ = Math.log(Math.sqrt(v * v + 1) - v),
          w = Math.log(Math.sqrt(y * y + 1) - y);
        (s = (w - _) / e),
          (o = function (t) {
            var i,
              r = t * s,
              o = hn(_),
              u =
                (l / (n * m)) *
                (o * ((i = e * r + _), ((i = Math.exp(2 * i)) - 1) / (i + 1)) -
                  (function (t) {
                    return ((t = Math.exp(t)) - 1 / t) / 2;
                  })(_));
            return [a + u * p, h + u * d, (l * o) / hn(e * r + _)];
          });
      }
      return (o.duration = (1e3 * s * e) / Math.SQRT2), o;
    }
    return (
      (r.rho = function (e) {
        var n = Math.max(0.001, +e),
          i = n * n;
        return t(n, i, i * i);
      }),
      r
    );
  })(Math.SQRT2, 2, 4),
  fn = 0,
  pn = 0,
  dn = 0,
  gn = 0,
  mn = 0,
  vn = 0,
  yn = 'object' == typeof performance && performance.now ? performance : Date,
  _n =
    'object' == typeof window && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : function (t) {
          setTimeout(t, 17);
        };
function wn() {
  return mn || (_n($n), (mn = yn.now() + vn));
}
function $n() {
  mn = 0;
}
function bn() {
  this._call = this._time = this._next = null;
}
function An(t, e, n) {
  var i = new bn();
  return i.restart(t, e, n), i;
}
function xn() {
  (mn = (gn = yn.now()) + vn), (fn = pn = 0);
  try {
    !(function () {
      wn(), ++fn;
      for (var t, e = ln; e; ) (t = mn - e._time) >= 0 && e._call.call(void 0, t), (e = e._next);
      --fn;
    })();
  } finally {
    (fn = 0),
      (function () {
        var t,
          e,
          n = ln,
          i = 1 / 0;
        for (; n; ) n._call ? (i > n._time && (i = n._time), (t = n), (n = n._next)) : ((e = n._next), (n._next = null), (n = t ? (t._next = e) : (ln = e)));
        (un = t), En(i);
      })(),
      (mn = 0);
  }
}
function Sn() {
  var t = yn.now(),
    e = t - gn;
  e > 1e3 && ((vn -= e), (gn = t));
}
function En(t) {
  fn ||
    (pn && (pn = clearTimeout(pn)),
    t - mn > 24
      ? (t < 1 / 0 && (pn = setTimeout(xn, t - yn.now() - vn)), dn && (dn = clearInterval(dn)))
      : (dn || ((gn = yn.now()), (dn = setInterval(Sn, 1e3))), (fn = 1), _n(xn)));
}
function Mn(t, e, n) {
  var i = new bn();
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
bn.prototype = An.prototype = {
  constructor: bn,
  restart: function (t, e, n) {
    if ('function' != typeof t) throw new TypeError('callback is not a function');
    (n = (null == n ? wn() : +n) + (null == e ? 0 : +e)),
      this._next || un === this || (un ? (un._next = this) : (ln = this), (un = this)),
      (this._call = t),
      (this._time = n),
      En();
  },
  stop: function () {
    this._call && ((this._call = null), (this._time = 1 / 0), En());
  },
};
var Cn = X('start', 'end', 'cancel', 'interrupt'),
  Nn = [];
function kn(t, e, n, i, r, o) {
  var s = t.__transition;
  if (s) {
    if (n in s) return;
  } else t.__transition = {};
  !(function (t, e, n) {
    var i,
      r = t.__transition;
    function o(t) {
      (n.state = 1), n.timer.restart(s, n.delay, n.time), n.delay <= t && s(t - n.delay);
    }
    function s(o) {
      var l, u, c, f;
      if (1 !== n.state) return h();
      for (l in r)
        if ((f = r[l]).name === n.name) {
          if (3 === f.state) return Mn(s);
          4 === f.state
            ? ((f.state = 6), f.timer.stop(), f.on.call('interrupt', t, t.__data__, f.index, f.group), delete r[l])
            : +l < e && ((f.state = 6), f.timer.stop(), f.on.call('cancel', t, t.__data__, f.index, f.group), delete r[l]);
        }
      if (
        (Mn(function () {
          3 === n.state && ((n.state = 4), n.timer.restart(a, n.delay, n.time), a(o));
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
      for (var r = e < n.duration ? n.ease.call(null, e / n.duration) : (n.timer.restart(h), (n.state = 5), 1), o = -1, s = i.length; ++o < s; ) i[o].call(t, r);
      5 === n.state && (n.on.call('end', t, t.__data__, n.index, n.group), h());
    }
    function h() {
      for (var i in ((n.state = 6), n.timer.stop(), delete r[e], r)) return;
      delete t.__transition;
    }
    (r[e] = n), (n.timer = An(o, 0, n.time));
  })(t, n, { name: e, index: i, group: r, on: Cn, tween: Nn, time: o.time, delay: o.delay, duration: o.duration, ease: o.ease, timer: null, state: 0 });
}
function Pn(t, e) {
  var n = zn(t, e);
  if (n.state > 0) throw new Error('too late; already scheduled');
  return n;
}
function Tn(t, e) {
  var n = zn(t, e);
  if (n.state > 3) throw new Error('too late; already running');
  return n;
}
function zn(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error('transition not found');
  return n;
}
function Un(t, e) {
  var n,
    i,
    r,
    o = t.__transition,
    s = !0;
  if (o) {
    for (r in ((e = null == e ? null : e + ''), o))
      (n = o[r]).name === e
        ? ((i = n.state > 2 && n.state < 5), (n.state = 6), n.timer.stop(), n.on.call(i ? 'interrupt' : 'cancel', t, t.__data__, n.index, n.group), delete o[r])
        : (s = !1);
    s && delete t.__transition;
  }
}
function On(t, e) {
  var n, i;
  return function () {
    var r = Tn(this, t),
      o = r.tween;
    if (o !== n)
      for (var s = 0, a = (i = n = o).length; s < a; ++s)
        if (i[s].name === e) {
          (i = i.slice()).splice(s, 1);
          break;
        }
    r.tween = i;
  };
}
function Hn(t, e, n) {
  var i, r;
  if ('function' != typeof n) throw new Error();
  return function () {
    var o = Tn(this, t),
      s = o.tween;
    if (s !== i) {
      r = (i = s).slice();
      for (var a = { name: e, value: n }, h = 0, l = r.length; h < l; ++h)
        if (r[h].name === e) {
          r[h] = a;
          break;
        }
      h === l && r.push(a);
    }
    o.tween = r;
  };
}
function Rn(t, e, n) {
  var i = t._id;
  return (
    t.each(function () {
      var t = Tn(this, i);
      (t.value || (t.value = {}))[e] = n.apply(this, arguments);
    }),
    function (t) {
      return zn(t, i).value[e];
    }
  );
}
function Dn(t, e) {
  var n;
  return ('number' == typeof e ? Ye : e instanceof xe ? Le : (n = xe(e)) ? ((e = n), Le) : Ge)(t, e);
}
function jn(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function Xn(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function qn(t, e, n) {
  var i,
    r,
    o = n + '';
  return function () {
    var s = this.getAttribute(t);
    return s === o ? null : s === i ? r : (r = e((i = s), n));
  };
}
function Bn(t, e, n) {
  var i,
    r,
    o = n + '';
  return function () {
    var s = this.getAttributeNS(t.space, t.local);
    return s === o ? null : s === i ? r : (r = e((i = s), n));
  };
}
function Ln(t, e, n) {
  var i, r, o;
  return function () {
    var s,
      a,
      h = n(this);
    if (null != h) return (s = this.getAttribute(t)) === (a = h + '') ? null : s === i && a === r ? o : ((r = a), (o = e((i = s), h)));
    this.removeAttribute(t);
  };
}
function In(t, e, n) {
  var i, r, o;
  return function () {
    var s,
      a,
      h = n(this);
    if (null != h) return (s = this.getAttributeNS(t.space, t.local)) === (a = h + '') ? null : s === i && a === r ? o : ((r = a), (o = e((i = s), h)));
    this.removeAttributeNS(t.space, t.local);
  };
}
function Wn(t, e) {
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
function Vn(t, e) {
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
function Yn(t, e) {
  return function () {
    Pn(this, t).delay = +e.apply(this, arguments);
  };
}
function Fn(t, e) {
  return (
    (e = +e),
    function () {
      Pn(this, t).delay = e;
    }
  );
}
function Zn(t, e) {
  return function () {
    Tn(this, t).duration = +e.apply(this, arguments);
  };
}
function Kn(t, e) {
  return (
    (e = +e),
    function () {
      Tn(this, t).duration = e;
    }
  );
}
var Gn = ee.prototype.constructor;
function Jn(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
var Qn = 0;
function ti(t, e, n, i) {
  (this._groups = t), (this._parents = e), (this._name = n), (this._id = i);
}
function ei() {
  return ++Qn;
}
var ni = ee.prototype;
ti.prototype = {
  constructor: ti,
  select: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = G(t));
    for (var i = this._groups, r = i.length, o = new Array(r), s = 0; s < r; ++s)
      for (var a, h, l = i[s], u = l.length, c = (o[s] = new Array(u)), f = 0; f < u; ++f)
        (a = l[f]) && (h = t.call(a, a.__data__, f, l)) && ('__data__' in a && (h.__data__ = a.__data__), (c[f] = h), kn(c[f], e, n, f, c, zn(a, n)));
    return new ti(o, this._parents, e, n);
  },
  selectAll: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = Q(t));
    for (var i = this._groups, r = i.length, o = [], s = [], a = 0; a < r; ++a)
      for (var h, l = i[a], u = l.length, c = 0; c < u; ++c)
        if ((h = l[c])) {
          for (var f, p = t.call(h, h.__data__, c, l), d = zn(h, n), g = 0, m = p.length; g < m; ++g) (f = p[g]) && kn(f, e, n, g, p, d);
          o.push(p), s.push(h);
        }
    return new ti(o, s, e, n);
  },
  selectChild: ni.selectChild,
  selectChildren: ni.selectChildren,
  filter: function (t) {
    'function' != typeof t && (t = et(t));
    for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
      for (var o, s = e[r], a = s.length, h = (i[r] = []), l = 0; l < a; ++l) (o = s[l]) && t.call(o, o.__data__, l, s) && h.push(o);
    return new ti(i, this._parents, this._name, this._id);
  },
  merge: function (t) {
    if (t._id !== this._id) throw new Error();
    for (var e = this._groups, n = t._groups, i = e.length, r = n.length, o = Math.min(i, r), s = new Array(i), a = 0; a < o; ++a)
      for (var h, l = e[a], u = n[a], c = l.length, f = (s[a] = new Array(c)), p = 0; p < c; ++p) (h = l[p] || u[p]) && (f[p] = h);
    for (; a < i; ++a) s[a] = e[a];
    return new ti(s, this._parents, this._name, this._id);
  },
  selection: function () {
    return new Gn(this._groups, this._parents);
  },
  transition: function () {
    for (var t = this._name, e = this._id, n = ei(), i = this._groups, r = i.length, o = 0; o < r; ++o)
      for (var s, a = i[o], h = a.length, l = 0; l < h; ++l)
        if ((s = a[l])) {
          var u = zn(s, e);
          kn(s, t, n, l, a, { time: u.time + u.delay + u.duration, delay: 0, duration: u.duration, ease: u.ease });
        }
    return new ti(i, this._parents, t, n);
  },
  call: ni.call,
  nodes: ni.nodes,
  node: ni.node,
  size: ni.size,
  empty: ni.empty,
  each: ni.each,
  on: function (t, e) {
    var n = this._id;
    return arguments.length < 2
      ? zn(this.node(), n).on.on(t)
      : this.each(
          (function (t, e, n) {
            var i,
              r,
              o = (function (t) {
                return (t + '')
                  .trim()
                  .split(/^|\s+/)
                  .every(function (t) {
                    var e = t.indexOf('.');
                    return e >= 0 && (t = t.slice(0, e)), !t || 'start' === t;
                  });
              })(e)
                ? Pn
                : Tn;
            return function () {
              var s = o(this, t),
                a = s.on;
              a !== i && (r = (i = a).copy()).on(e, n), (s.on = r);
            };
          })(n, t, e)
        );
  },
  attr: function (t, e) {
    var n = V(t),
      i = 'transform' === n ? an : Dn;
    return this.attrTween(
      t,
      'function' == typeof e ? (n.local ? In : Ln)(n, i, Rn(this, 'attr.' + t, e)) : null == e ? (n.local ? Xn : jn)(n) : (n.local ? Bn : qn)(n, i, e)
    );
  },
  attrTween: function (t, e) {
    var n = 'attr.' + t;
    if (arguments.length < 2) return (n = this.tween(n)) && n._value;
    if (null == e) return this.tween(n, null);
    if ('function' != typeof e) throw new Error();
    var i = V(t);
    return this.tween(n, (i.local ? Wn : Vn)(i, e));
  },
  style: function (t, e, n) {
    var i = 'transform' == (t += '') ? sn : Dn;
    return null == e
      ? this.styleTween(
          t,
          (function (t, e) {
            var n, i, r;
            return function () {
              var o = xt(this, t),
                s = (this.style.removeProperty(t), xt(this, t));
              return o === s ? null : o === n && s === i ? r : (r = e((n = o), (i = s)));
            };
          })(t, i)
        ).on('end.style.' + t, Jn(t))
      : 'function' == typeof e
        ? this.styleTween(
            t,
            (function (t, e, n) {
              var i, r, o;
              return function () {
                var s = xt(this, t),
                  a = n(this),
                  h = a + '';
                return null == a && (this.style.removeProperty(t), (h = a = xt(this, t))), s === h ? null : s === i && h === r ? o : ((r = h), (o = e((i = s), a)));
              };
            })(t, i, Rn(this, 'style.' + t, e))
          ).each(
            (function (t, e) {
              var n,
                i,
                r,
                o,
                s = 'style.' + e,
                a = 'end.' + s;
              return function () {
                var h = Tn(this, t),
                  l = h.on,
                  u = null == h.value[s] ? o || (o = Jn(e)) : void 0;
                (l === n && r === u) || (i = (n = l).copy()).on(a, (r = u)), (h.on = i);
              };
            })(this._id, t)
          )
        : this.styleTween(
            t,
            (function (t, e, n) {
              var i,
                r,
                o = n + '';
              return function () {
                var s = xt(this, t);
                return s === o ? null : s === i ? r : (r = e((i = s), n));
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
        function o() {
          var o = e.apply(this, arguments);
          return (
            o !== r &&
              (i =
                (r = o) &&
                (function (t, e, n) {
                  return function (i) {
                    this.style.setProperty(t, e.call(this, i), n);
                  };
                })(t, o, n)),
            i
          );
        }
        return (o._value = e), o;
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
          })(Rn(this, 'text', t))
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
      for (var i, r = zn(this.node(), n).tween, o = 0, s = r.length; o < s; ++o) if ((i = r[o]).name === t) return i.value;
      return null;
    }
    return this.each((null == e ? On : Hn)(n, t, e));
  },
  delay: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? Yn : Fn)(e, t)) : zn(this.node(), e).delay;
  },
  duration: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? Zn : Kn)(e, t)) : zn(this.node(), e).duration;
  },
  ease: function (t) {
    var e = this._id;
    return arguments.length
      ? this.each(
          (function (t, e) {
            if ('function' != typeof e) throw new Error();
            return function () {
              Tn(this, t).ease = e;
            };
          })(e, t)
        )
      : zn(this.node(), e).ease;
  },
  easeVarying: function (t) {
    if ('function' != typeof t) throw new Error();
    return this.each(
      (function (t, e) {
        return function () {
          var n = e.apply(this, arguments);
          if ('function' != typeof n) throw new Error();
          Tn(this, t).ease = n;
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
    return new Promise(function (o, s) {
      var a = { value: s },
        h = {
          value: function () {
            0 == --r && o();
          },
        };
      n.each(function () {
        var n = Tn(this, i),
          r = n.on;
        r !== t && ((e = (t = r).copy())._.cancel.push(a), e._.interrupt.push(a), e._.end.push(h)), (n.on = e);
      }),
        0 === r && o();
    });
  },
  [Symbol.iterator]: ni[Symbol.iterator],
};
var ii = {
  time: null,
  delay: 0,
  duration: 250,
  ease: function (t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  },
};
function ri(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); ) if (!(t = t.parentNode)) throw new Error(`transition ${e} not found`);
  return n;
}
function oi(t, e) {
  if ((n = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf('e')) < 0) return null;
  var n,
    i = t.slice(0, n);
  return [i.length > 1 ? i[0] + i.slice(2) : i, +t.slice(n + 1)];
}
function si(t) {
  return (t = oi(Math.abs(t))) ? t[1] : NaN;
}
(ee.prototype.interrupt = function (t) {
  return this.each(function () {
    Un(this, t);
  });
}),
  (ee.prototype.transition = function (t) {
    var e, n;
    t instanceof ti ? ((e = t._id), (t = t._name)) : ((e = ei()), ((n = ii).time = wn()), (t = null == t ? null : t + ''));
    for (var i = this._groups, r = i.length, o = 0; o < r; ++o) for (var s, a = i[o], h = a.length, l = 0; l < h; ++l) (s = a[l]) && kn(s, t, e, l, a, n || ri(s, e));
    return new ti(i, this._parents, t, e);
  });
var ai,
  hi = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function li(t) {
  if (!(e = hi.exec(t))) throw new Error('invalid format: ' + t);
  var e;
  return new ui({
    fill: e[1],
    align: e[2],
    sign: e[3],
    symbol: e[4],
    zero: e[5],
    width: e[6],
    comma: e[7],
    precision: e[8] && e[8].slice(1),
    trim: e[9],
    type: e[10],
  });
}
function ui(t) {
  (this.fill = void 0 === t.fill ? ' ' : t.fill + ''),
    (this.align = void 0 === t.align ? '>' : t.align + ''),
    (this.sign = void 0 === t.sign ? '-' : t.sign + ''),
    (this.symbol = void 0 === t.symbol ? '' : t.symbol + ''),
    (this.zero = !!t.zero),
    (this.width = void 0 === t.width ? void 0 : +t.width),
    (this.comma = !!t.comma),
    (this.precision = void 0 === t.precision ? void 0 : +t.precision),
    (this.trim = !!t.trim),
    (this.type = void 0 === t.type ? '' : t.type + '');
}
function ci(t, e) {
  var n = oi(t, e);
  if (!n) return t + '';
  var i = n[0],
    r = n[1];
  return r < 0 ? '0.' + new Array(-r).join('0') + i : i.length > r + 1 ? i.slice(0, r + 1) + '.' + i.slice(r + 1) : i + new Array(r - i.length + 2).join('0');
}
(li.prototype = ui.prototype),
  (ui.prototype.toString = function () {
    return (
      this.fill +
      this.align +
      this.sign +
      this.symbol +
      (this.zero ? '0' : '') +
      (void 0 === this.width ? '' : Math.max(1, 0 | this.width)) +
      (this.comma ? ',' : '') +
      (void 0 === this.precision ? '' : '.' + Math.max(0, 0 | this.precision)) +
      (this.trim ? '~' : '') +
      this.type
    );
  });
var fi = {
  '%': (t, e) => (100 * t).toFixed(e),
  b: (t) => Math.round(t).toString(2),
  c: (t) => t + '',
  d: function (t) {
    return Math.abs((t = Math.round(t))) >= 1e21 ? t.toLocaleString('en').replace(/,/g, '') : t.toString(10);
  },
  e: (t, e) => t.toExponential(e),
  f: (t, e) => t.toFixed(e),
  g: (t, e) => t.toPrecision(e),
  o: (t) => Math.round(t).toString(8),
  p: (t, e) => ci(100 * t, e),
  r: ci,
  s: function (t, e) {
    var n = oi(t, e);
    if (!n) return t + '';
    var i = n[0],
      r = n[1],
      o = r - (ai = 3 * Math.max(-8, Math.min(8, Math.floor(r / 3)))) + 1,
      s = i.length;
    return o === s
      ? i
      : o > s
        ? i + new Array(o - s + 1).join('0')
        : o > 0
          ? i.slice(0, o) + '.' + i.slice(o)
          : '0.' + new Array(1 - o).join('0') + oi(t, Math.max(0, e + o - 1))[0];
  },
  X: (t) => Math.round(t).toString(16).toUpperCase(),
  x: (t) => Math.round(t).toString(16),
};
function pi(t) {
  return t;
}
var di,
  gi,
  mi,
  vi = Array.prototype.map,
  yi = ['y', 'z', 'a', 'f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
function _i(t) {
  var e,
    n,
    i =
      void 0 === t.grouping || void 0 === t.thousands
        ? pi
        : ((e = vi.call(t.grouping, Number)),
          (n = t.thousands + ''),
          function (t, i) {
            for (
              var r = t.length, o = [], s = 0, a = e[0], h = 0;
              r > 0 && a > 0 && (h + a + 1 > i && (a = Math.max(1, i - h)), o.push(t.substring((r -= a), r + a)), !((h += a + 1) > i));

            )
              a = e[(s = (s + 1) % e.length)];
            return o.reverse().join(n);
          }),
    r = void 0 === t.currency ? '' : t.currency[0] + '',
    o = void 0 === t.currency ? '' : t.currency[1] + '',
    s = void 0 === t.decimal ? '.' : t.decimal + '',
    a =
      void 0 === t.numerals
        ? pi
        : (function (t) {
            return function (e) {
              return e.replace(/[0-9]/g, function (e) {
                return t[+e];
              });
            };
          })(vi.call(t.numerals, String)),
    h = void 0 === t.percent ? '%' : t.percent + '',
    l = void 0 === t.minus ? '−' : t.minus + '',
    u = void 0 === t.nan ? 'NaN' : t.nan + '';
  function c(t) {
    var e = (t = li(t)).fill,
      n = t.align,
      c = t.sign,
      f = t.symbol,
      p = t.zero,
      d = t.width,
      g = t.comma,
      m = t.precision,
      v = t.trim,
      y = t.type;
    'n' === y ? ((g = !0), (y = 'g')) : fi[y] || (void 0 === m && (m = 12), (v = !0), (y = 'g')), (p || ('0' === e && '=' === n)) && ((p = !0), (e = '0'), (n = '='));
    var _ = '$' === f ? r : '#' === f && /[boxX]/.test(y) ? '0' + y.toLowerCase() : '',
      w = '$' === f ? o : /[%p]/.test(y) ? h : '',
      $ = fi[y],
      b = /[defgprs%]/.test(y);
    function A(t) {
      var r,
        o,
        h,
        f = _,
        A = w;
      if ('c' === y) (A = $(t) + A), (t = '');
      else {
        var x = (t = +t) < 0 || 1 / t < 0;
        if (
          ((t = isNaN(t) ? u : $(Math.abs(t), m)),
          v &&
            (t = (function (t) {
              t: for (var e, n = t.length, i = 1, r = -1; i < n; ++i)
                switch (t[i]) {
                  case '.':
                    r = e = i;
                    break;
                  case '0':
                    0 === r && (r = i), (e = i);
                    break;
                  default:
                    if (!+t[i]) break t;
                    r > 0 && (r = 0);
                }
              return r > 0 ? t.slice(0, r) + t.slice(e + 1) : t;
            })(t)),
          x && 0 == +t && '+' !== c && (x = !1),
          (f = (x ? ('(' === c ? c : l) : '-' === c || '(' === c ? '' : c) + f),
          (A = ('s' === y ? yi[8 + ai / 3] : '') + A + (x && '(' === c ? ')' : '')),
          b)
        )
          for (r = -1, o = t.length; ++r < o; )
            if (48 > (h = t.charCodeAt(r)) || h > 57) {
              (A = (46 === h ? s + t.slice(r + 1) : t.slice(r)) + A), (t = t.slice(0, r));
              break;
            }
      }
      g && !p && (t = i(t, 1 / 0));
      var S = f.length + t.length + A.length,
        E = S < d ? new Array(d - S + 1).join(e) : '';
      switch ((g && p && ((t = i(E + t, E.length ? d - A.length : 1 / 0)), (E = '')), n)) {
        case '<':
          t = f + t + A + E;
          break;
        case '=':
          t = f + E + t + A;
          break;
        case '^':
          t = E.slice(0, (S = E.length >> 1)) + f + t + A + E.slice(S);
          break;
        default:
          t = E + f + t + A;
      }
      return a(t);
    }
    return (
      (m = void 0 === m ? 6 : /[gprs]/.test(y) ? Math.max(1, Math.min(21, m)) : Math.max(0, Math.min(20, m))),
      (A.toString = function () {
        return t + '';
      }),
      A
    );
  }
  return {
    format: c,
    formatPrefix: function (t, e) {
      var n = c((((t = li(t)).type = 'f'), t)),
        i = 3 * Math.max(-8, Math.min(8, Math.floor(si(e) / 3))),
        r = Math.pow(10, -i),
        o = yi[8 + i / 3];
      return function (t) {
        return n(r * t) + o;
      };
    },
  };
}
function wi(t, e) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(t);
      break;
    default:
      this.range(e).domain(t);
  }
  return this;
}
function $i(t) {
  return +t;
}
(di = _i({ thousands: ',', grouping: [3], currency: ['$', ''] })), (gi = di.format), (mi = di.formatPrefix);
var bi = [0, 1];
function Ai(t) {
  return t;
}
function xi(t, e) {
  return (e -= t = +t)
    ? function (n) {
        return (n - t) / e;
      }
    : ((n = isNaN(e) ? NaN : 0.5),
      function () {
        return n;
      });
  var n;
}
function Si(t, e, n) {
  var i = t[0],
    r = t[1],
    o = e[0],
    s = e[1];
  return (
    r < i ? ((i = xi(r, i)), (o = n(s, o))) : ((i = xi(i, r)), (o = n(o, s))),
    function (t) {
      return o(i(t));
    }
  );
}
function Ei(t, e, n) {
  var i = Math.min(t.length, e.length) - 1,
    r = new Array(i),
    o = new Array(i),
    s = -1;
  for (t[i] < t[0] && ((t = t.slice().reverse()), (e = e.slice().reverse())); ++s < i; ) (r[s] = xi(t[s], t[s + 1])), (o[s] = n(e[s], e[s + 1]));
  return function (e) {
    var n = z(t, e, 1, i) - 1;
    return o[n](r[n](e));
  };
}
function Mi() {
  var t,
    e,
    n,
    i,
    r,
    o,
    s = bi,
    a = bi,
    h = Je,
    l = Ai;
  function u() {
    var t = Math.min(s.length, a.length);
    return (
      l !== Ai &&
        (l = (function (t, e) {
          var n;
          return (
            t > e && ((n = t), (t = e), (e = n)),
            function (n) {
              return Math.max(t, Math.min(e, n));
            }
          );
        })(s[0], s[t - 1])),
      (i = t > 2 ? Ei : Si),
      (r = o = null),
      c
    );
  }
  function c(e) {
    return null == e || isNaN((e = +e)) ? n : (r || (r = i(s.map(t), a, h)))(t(l(e)));
  }
  return (
    (c.invert = function (n) {
      return l(e((o || (o = i(a, s.map(t), Ye)))(n)));
    }),
    (c.domain = function (t) {
      return arguments.length ? ((s = Array.from(t, $i)), u()) : s.slice();
    }),
    (c.range = function (t) {
      return arguments.length ? ((a = Array.from(t)), u()) : a.slice();
    }),
    (c.rangeRound = function (t) {
      return (a = Array.from(t)), (h = Qe), u();
    }),
    (c.clamp = function (t) {
      return arguments.length ? ((l = !!t || Ai), u()) : l !== Ai;
    }),
    (c.interpolate = function (t) {
      return arguments.length ? ((h = t), u()) : h;
    }),
    (c.unknown = function (t) {
      return arguments.length ? ((n = t), c) : n;
    }),
    function (n, i) {
      return (t = n), (e = i), u();
    }
  );
}
function Ci(t, e, n, i) {
  var r,
    o = (function (t, e, n) {
      n = +n;
      const i = (e = +e) < (t = +t),
        r = i ? D(e, t, n) : D(t, e, n);
      return (i ? -1 : 1) * (r < 0 ? 1 / -r : r);
    })(t, e, n);
  switch ((i = li(i ?? ',f')).type) {
    case 's':
      var s = Math.max(Math.abs(t), Math.abs(e));
      return (
        null != i.precision ||
          isNaN(
            (r = (function (t, e) {
              return Math.max(0, 3 * Math.max(-8, Math.min(8, Math.floor(si(e) / 3))) - si(Math.abs(t)));
            })(o, s))
          ) ||
          (i.precision = r),
        mi(i, s)
      );
    case '':
    case 'e':
    case 'g':
    case 'p':
    case 'r':
      null != i.precision ||
        isNaN(
          (r = (function (t, e) {
            return (t = Math.abs(t)), (e = Math.abs(e) - t), Math.max(0, si(e) - si(t)) + 1;
          })(o, Math.max(Math.abs(t), Math.abs(e))))
        ) ||
        (i.precision = r - ('e' === i.type));
      break;
    case 'f':
    case '%':
      null != i.precision ||
        isNaN(
          (r = (function (t) {
            return Math.max(0, -si(Math.abs(t)));
          })(o))
        ) ||
        (i.precision = r - 2 * ('%' === i.type));
  }
  return gi(i);
}
function Ni(t) {
  var e = t.domain;
  return (
    (t.ticks = function (t) {
      var n = e();
      return (function (t, e, n) {
        if (!((n = +n) > 0)) return [];
        if ((t = +t) == (e = +e)) return [t];
        const i = e < t,
          [r, o, s] = i ? R(e, t, n) : R(t, e, n);
        if (!(o >= r)) return [];
        const a = o - r + 1,
          h = new Array(a);
        if (i)
          if (s < 0) for (let t = 0; t < a; ++t) h[t] = (o - t) / -s;
          else for (let t = 0; t < a; ++t) h[t] = (o - t) * s;
        else if (s < 0) for (let t = 0; t < a; ++t) h[t] = (r + t) / -s;
        else for (let t = 0; t < a; ++t) h[t] = (r + t) * s;
        return h;
      })(n[0], n[n.length - 1], t ?? 10);
    }),
    (t.tickFormat = function (t, n) {
      var i = e();
      return Ci(i[0], i[i.length - 1], t ?? 10, n);
    }),
    (t.nice = function (n) {
      null == n && (n = 10);
      var i,
        r,
        o = e(),
        s = 0,
        a = o.length - 1,
        h = o[s],
        l = o[a],
        u = 10;
      for (l < h && ((r = h), (h = l), (l = r), (r = s), (s = a), (a = r)); u-- > 0; ) {
        if ((r = D(h, l, n)) === i) return (o[s] = h), (o[a] = l), e(o);
        if (r > 0) (h = Math.floor(h / r) * r), (l = Math.ceil(l / r) * r);
        else {
          if (!(r < 0)) break;
          (h = Math.ceil(h * r) / r), (l = Math.floor(l * r) / r);
        }
        i = r;
      }
      return t;
    }),
    t
  );
}
function ki() {
  var t = Mi()(Ai, Ai);
  return (
    (t.copy = function () {
      return (e = t), ki().domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
      var e;
    }),
    wi.apply(t, arguments),
    Ni(t)
  );
}
var Pi = (t) => () => t;
function Ti(t, { sourceEvent: e, target: n, transform: i, dispatch: r }) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: i, enumerable: !0, configurable: !0 },
    _: { value: r },
  });
}
function zi(t, e, n) {
  (this.k = t), (this.x = e), (this.y = n);
}
zi.prototype = {
  constructor: zi,
  scale: function (t) {
    return 1 === t ? this : new zi(this.k * t, this.x, this.y);
  },
  translate: function (t, e) {
    return (0 === t) & (0 === e) ? this : new zi(this.k, this.x + this.k * t, this.y + this.k * e);
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
};
var Ui = new zi(1, 0, 0);
function Oi(t) {
  t.stopImmediatePropagation();
}
function Hi(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Ri(t) {
  return !((t.ctrlKey && 'wheel' !== t.type) || t.button);
}
function Di() {
  var t = this;
  return t instanceof SVGElement
    ? (t = t.ownerSVGElement || t).hasAttribute('viewBox')
      ? [
          [(t = t.viewBox.baseVal).x, t.y],
          [t.x + t.width, t.y + t.height],
        ]
      : [
          [0, 0],
          [t.width.baseVal.value, t.height.baseVal.value],
        ]
    : [
        [0, 0],
        [t.clientWidth, t.clientHeight],
      ];
}
function ji() {
  return this.__zoom || Ui;
}
function Xi(t) {
  return -t.deltaY * (1 === t.deltaMode ? 0.05 : t.deltaMode ? 1 : 0.002) * (t.ctrlKey ? 10 : 1);
}
function qi() {
  return navigator.maxTouchPoints || 'ontouchstart' in this;
}
function Bi(t, e, n) {
  var i = t.invertX(e[0][0]) - n[0][0],
    r = t.invertX(e[1][0]) - n[1][0],
    o = t.invertY(e[0][1]) - n[0][1],
    s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(r > i ? (i + r) / 2 : Math.min(0, i) || Math.max(0, r), s > o ? (o + s) / 2 : Math.min(0, o) || Math.max(0, s));
}
function Li() {
  var t,
    e,
    n,
    i = Ri,
    r = Di,
    o = Bi,
    s = Xi,
    a = qi,
    h = [0, 1 / 0],
    l = [
      [-1 / 0, -1 / 0],
      [1 / 0, 1 / 0],
    ],
    u = 250,
    c = cn,
    f = X('start', 'zoom', 'end'),
    p = 0,
    d = 10;
  function g(t) {
    t.property('__zoom', ji)
      .on('wheel.zoom', b, { passive: !1 })
      .on('mousedown.zoom', A)
      .on('dblclick.zoom', x)
      .filter(a)
      .on('touchstart.zoom', S)
      .on('touchmove.zoom', E)
      .on('touchend.zoom touchcancel.zoom', M)
      .style('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
  }
  function m(t, e) {
    return (e = Math.max(h[0], Math.min(h[1], e))) === t.k ? t : new zi(e, t.x, t.y);
  }
  function v(t, e, n) {
    var i = e[0] - n[0] * t.k,
      r = e[1] - n[1] * t.k;
    return i === t.x && r === t.y ? t : new zi(t.k, i, r);
  }
  function y(t) {
    return [(+t[0][0] + +t[1][0]) / 2, (+t[0][1] + +t[1][1]) / 2];
  }
  function _(t, e, n, i) {
    t.on('start.zoom', function () {
      w(this, arguments).event(i).start();
    })
      .on('interrupt.zoom end.zoom', function () {
        w(this, arguments).event(i).end();
      })
      .tween('zoom', function () {
        var t = this,
          o = arguments,
          s = w(t, o).event(i),
          a = r.apply(t, o),
          h = null == n ? y(a) : 'function' == typeof n ? n.apply(t, o) : n,
          l = Math.max(a[1][0] - a[0][0], a[1][1] - a[0][1]),
          u = t.__zoom,
          f = 'function' == typeof e ? e.apply(t, o) : e,
          p = c(u.invert(h).concat(l / u.k), f.invert(h).concat(l / f.k));
        return function (t) {
          if (1 === t) t = f;
          else {
            var e = p(t),
              n = l / e[2];
            t = new zi(n, h[0] - e[0] * n, h[1] - e[1] * n);
          }
          s.zoom(null, t);
        };
      });
  }
  function w(t, e, n) {
    return (!n && t.__zooming) || new $(t, e);
  }
  function $(t, e) {
    (this.that = t), (this.args = e), (this.active = 0), (this.sourceEvent = null), (this.extent = r.apply(t, e)), (this.taps = 0);
  }
  function b(t, ...e) {
    if (i.apply(this, arguments)) {
      var n = w(this, e).event(t),
        r = this.__zoom,
        a = Math.max(h[0], Math.min(h[1], r.k * Math.pow(2, s.apply(this, arguments)))),
        u = ie(t);
      if (n.wheel) (n.mouse[0][0] === u[0] && n.mouse[0][1] === u[1]) || (n.mouse[1] = r.invert((n.mouse[0] = u))), clearTimeout(n.wheel);
      else {
        if (r.k === a) return;
        (n.mouse = [u, r.invert(u)]), Un(this), n.start();
      }
      Hi(t),
        (n.wheel = setTimeout(function () {
          (n.wheel = null), n.end();
        }, 150)),
        n.zoom('mouse', o(v(m(r, a), n.mouse[0], n.mouse[1]), n.extent, l));
    }
  }
  function A(t, ...e) {
    if (!n && i.apply(this, arguments)) {
      var r = t.currentTarget,
        s = w(this, e, !0).event(t),
        a = ne(t.view)
          .on(
            'mousemove.zoom',
            function (t) {
              if ((Hi(t), !s.moved)) {
                var e = t.clientX - u,
                  n = t.clientY - c;
                s.moved = e * e + n * n > p;
              }
              s.event(t).zoom('mouse', o(v(s.that.__zoom, (s.mouse[0] = ie(t, r)), s.mouse[1]), s.extent, l));
            },
            !0
          )
          .on(
            'mouseup.zoom',
            function (t) {
              a.on('mousemove.zoom mouseup.zoom', null),
                (function (t, e) {
                  var n = t.document.documentElement,
                    i = ne(t).on('dragstart.drag', null);
                  e &&
                    (i.on('click.drag', oe, re),
                    setTimeout(function () {
                      i.on('click.drag', null);
                    }, 0)),
                    'onselectstart' in n ? i.on('selectstart.drag', null) : ((n.style.MozUserSelect = n.__noselect), delete n.__noselect);
                })(t.view, s.moved),
                Hi(t),
                s.event(t).end();
            },
            !0
          ),
        h = ie(t, r),
        u = t.clientX,
        c = t.clientY;
      !(function (t) {
        var e = t.document.documentElement,
          n = ne(t).on('dragstart.drag', oe, re);
        'onselectstart' in e ? n.on('selectstart.drag', oe, re) : ((e.__noselect = e.style.MozUserSelect), (e.style.MozUserSelect = 'none'));
      })(t.view),
        Oi(t),
        (s.mouse = [h, this.__zoom.invert(h)]),
        Un(this),
        s.start();
    }
  }
  function x(t, ...e) {
    if (i.apply(this, arguments)) {
      var n = this.__zoom,
        s = ie(t.changedTouches ? t.changedTouches[0] : t, this),
        a = n.invert(s),
        h = n.k * (t.shiftKey ? 0.5 : 2),
        c = o(v(m(n, h), s, a), r.apply(this, e), l);
      Hi(t), u > 0 ? ne(this).transition().duration(u).call(_, c, s, t) : ne(this).call(g.transform, c, s, t);
    }
  }
  function S(n, ...r) {
    if (i.apply(this, arguments)) {
      var o,
        s,
        a,
        h,
        l = n.touches,
        u = l.length,
        c = w(this, r, n.changedTouches.length === u).event(n);
      for (Oi(n), s = 0; s < u; ++s)
        (h = [(h = ie((a = l[s]), this)), this.__zoom.invert(h), a.identifier]),
          c.touch0 ? c.touch1 || c.touch0[2] === h[2] || ((c.touch1 = h), (c.taps = 0)) : ((c.touch0 = h), (o = !0), (c.taps = 1 + !!t));
      t && (t = clearTimeout(t)),
        o &&
          (c.taps < 2 &&
            ((e = h[0]),
            (t = setTimeout(function () {
              t = null;
            }, 500))),
          Un(this),
          c.start());
    }
  }
  function E(t, ...e) {
    if (this.__zooming) {
      var n,
        i,
        r,
        s,
        a = w(this, e).event(t),
        h = t.changedTouches,
        u = h.length;
      for (Hi(t), n = 0; n < u; ++n)
        (r = ie((i = h[n]), this)), a.touch0 && a.touch0[2] === i.identifier ? (a.touch0[0] = r) : a.touch1 && a.touch1[2] === i.identifier && (a.touch1[0] = r);
      if (((i = a.that.__zoom), a.touch1)) {
        var c = a.touch0[0],
          f = a.touch0[1],
          p = a.touch1[0],
          d = a.touch1[1],
          g = (g = p[0] - c[0]) * g + (g = p[1] - c[1]) * g,
          y = (y = d[0] - f[0]) * y + (y = d[1] - f[1]) * y;
        (i = m(i, Math.sqrt(g / y))), (r = [(c[0] + p[0]) / 2, (c[1] + p[1]) / 2]), (s = [(f[0] + d[0]) / 2, (f[1] + d[1]) / 2]);
      } else {
        if (!a.touch0) return;
        (r = a.touch0[0]), (s = a.touch0[1]);
      }
      a.zoom('touch', o(v(i, r, s), a.extent, l));
    }
  }
  function M(t, ...i) {
    if (this.__zooming) {
      var r,
        o,
        s = w(this, i).event(t),
        a = t.changedTouches,
        h = a.length;
      for (
        Oi(t),
          n && clearTimeout(n),
          n = setTimeout(function () {
            n = null;
          }, 500),
          r = 0;
        r < h;
        ++r
      )
        (o = a[r]), s.touch0 && s.touch0[2] === o.identifier ? delete s.touch0 : s.touch1 && s.touch1[2] === o.identifier && delete s.touch1;
      if ((s.touch1 && !s.touch0 && ((s.touch0 = s.touch1), delete s.touch1), s.touch0)) s.touch0[1] = this.__zoom.invert(s.touch0[0]);
      else if ((s.end(), 2 === s.taps && ((o = ie(o, this)), Math.hypot(e[0] - o[0], e[1] - o[1]) < d))) {
        var l = ne(this).on('dblclick.zoom');
        l && l.apply(this, arguments);
      }
    }
  }
  return (
    (g.transform = function (t, e, n, i) {
      var r = t.selection ? t.selection() : t;
      r.property('__zoom', ji),
        t !== r
          ? _(t, e, n, i)
          : r.interrupt().each(function () {
              w(this, arguments)
                .event(i)
                .start()
                .zoom(null, 'function' == typeof e ? e.apply(this, arguments) : e)
                .end();
            });
    }),
    (g.scaleBy = function (t, e, n, i) {
      g.scaleTo(
        t,
        function () {
          return this.__zoom.k * ('function' == typeof e ? e.apply(this, arguments) : e);
        },
        n,
        i
      );
    }),
    (g.scaleTo = function (t, e, n, i) {
      g.transform(
        t,
        function () {
          var t = r.apply(this, arguments),
            i = this.__zoom,
            s = null == n ? y(t) : 'function' == typeof n ? n.apply(this, arguments) : n,
            a = i.invert(s),
            h = 'function' == typeof e ? e.apply(this, arguments) : e;
          return o(v(m(i, h), s, a), t, l);
        },
        n,
        i
      );
    }),
    (g.translateBy = function (t, e, n, i) {
      g.transform(
        t,
        function () {
          return o(
            this.__zoom.translate('function' == typeof e ? e.apply(this, arguments) : e, 'function' == typeof n ? n.apply(this, arguments) : n),
            r.apply(this, arguments),
            l
          );
        },
        null,
        i
      );
    }),
    (g.translateTo = function (t, e, n, i, s) {
      g.transform(
        t,
        function () {
          var t = r.apply(this, arguments),
            s = this.__zoom,
            a = null == i ? y(t) : 'function' == typeof i ? i.apply(this, arguments) : i;
          return o(
            Ui.translate(a[0], a[1])
              .scale(s.k)
              .translate('function' == typeof e ? -e.apply(this, arguments) : -e, 'function' == typeof n ? -n.apply(this, arguments) : -n),
            t,
            l
          );
        },
        i,
        s
      );
    }),
    ($.prototype = {
      event: function (t) {
        return t && (this.sourceEvent = t), this;
      },
      start: function () {
        return 1 == ++this.active && ((this.that.__zooming = this), this.emit('start')), this;
      },
      zoom: function (t, e) {
        return (
          this.mouse && 'mouse' !== t && (this.mouse[1] = e.invert(this.mouse[0])),
          this.touch0 && 'touch' !== t && (this.touch0[1] = e.invert(this.touch0[0])),
          this.touch1 && 'touch' !== t && (this.touch1[1] = e.invert(this.touch1[0])),
          (this.that.__zoom = e),
          this.emit('zoom'),
          this
        );
      },
      end: function () {
        return 0 == --this.active && (delete this.that.__zooming, this.emit('end')), this;
      },
      emit: function (t) {
        var e = ne(this.that).datum();
        f.call(t, this.that, new Ti(t, { sourceEvent: this.sourceEvent, target: g, type: t, transform: this.that.__zoom, dispatch: f }), e);
      },
    }),
    (g.wheelDelta = function (t) {
      return arguments.length ? ((s = 'function' == typeof t ? t : Pi(+t)), g) : s;
    }),
    (g.filter = function (t) {
      return arguments.length ? ((i = 'function' == typeof t ? t : Pi(!!t)), g) : i;
    }),
    (g.touchable = function (t) {
      return arguments.length ? ((a = 'function' == typeof t ? t : Pi(!!t)), g) : a;
    }),
    (g.extent = function (t) {
      return arguments.length
        ? ((r =
            'function' == typeof t
              ? t
              : Pi([
                  [+t[0][0], +t[0][1]],
                  [+t[1][0], +t[1][1]],
                ])),
          g)
        : r;
    }),
    (g.scaleExtent = function (t) {
      return arguments.length ? ((h[0] = +t[0]), (h[1] = +t[1]), g) : [h[0], h[1]];
    }),
    (g.translateExtent = function (t) {
      return arguments.length
        ? ((l[0][0] = +t[0][0]), (l[1][0] = +t[1][0]), (l[0][1] = +t[0][1]), (l[1][1] = +t[1][1]), g)
        : [
            [l[0][0], l[0][1]],
            [l[1][0], l[1][1]],
          ];
    }),
    (g.constrain = function (t) {
      return arguments.length ? ((o = t), g) : o;
    }),
    (g.duration = function (t) {
      return arguments.length ? ((u = +t), g) : u;
    }),
    (g.interpolate = function (t) {
      return arguments.length ? ((c = t), g) : c;
    }),
    (g.on = function () {
      var t = f.on.apply(f, arguments);
      return t === f ? g : t;
    }),
    (g.clickDistance = function (t) {
      return arguments.length ? ((p = (t = +t) * t), g) : Math.sqrt(p);
    }),
    (g.tapDistance = function (t) {
      return arguments.length ? ((d = +t), g) : d;
    }),
    g
  );
}
zi.prototype;
const Ii = (t) =>
  class extends t {
    constructor() {
      super(...arguments), (this.canvasFoo = 'canvasFoo1'), (this.canvasScale = 1);
    }
    connectedCallback() {
      super.connectedCallback(), ne(window).on(`resize.WithCanvas-${this.id}`, () => this.updateCanvasScale());
    }
    disconnectedCallback() {
      ne(window).on(`resize.WithCanvas-${this.id}`, null), super.disconnectedCallback();
    }
    firstUpdated(t) {
      var e, n;
      super.firstUpdated(t),
        (this.canvas = ne(this).selectAll('canvas')),
        this.canvas.empty() && console.error('Failed to initialize canvas context. This element contains no <canvas> node.', this),
        (this.canvasCtx = null !== (n = null === (e = this.canvas.node()) || void 0 === e ? void 0 : e.getContext('2d')) && void 0 !== n ? n : void 0),
        this.onDimensionsChange();
    }
    onDimensionsChange() {
      super.onDimensionsChange(),
        this.canvas &&
          !this.canvas.empty() &&
          (this.canvas.style('width', `${this.width}px`), this.canvas.style('height', `${this.height}px`), this.updateCanvasScale());
    }
    onCanvasScaleChange() {}
    adjustCanvasCtxLogicalSize() {
      if (!this.canvasCtx) return;
      const t = Math.floor(this.width * this.canvasScale),
        e = Math.floor(this.height * this.canvasScale);
      this.canvasCtx.canvas.width !== t && (this.canvasCtx.canvas.width = t), this.canvasCtx.canvas.height !== e && (this.canvasCtx.canvas.height = e);
    }
    updateCanvasScale() {
      const t = null !== (e = null === window || void 0 === window ? void 0 : window.devicePixelRatio) && void 0 !== e ? e : 1;
      var e;
      t !== this.canvasScale && ((this.canvasScale = t), this.onCanvasScaleChange());
    }
  };
const Wi = { 'display-start': 1, 'display-end': -1, length: 0 },
  Vi = (i, r = {}) => {
    var o, s;
    class a extends i {
      constructor() {
        super(...arguments),
          o.set(this, { ...Wi, ...r }),
          s.set(this, e(this, o, 'f').length),
          (this['display-start'] = e(this, o, 'f')['display-start']),
          (this['display-end'] = e(this, o, 'f')['display-end']);
      }
      get length() {
        return e(this, s, 'f');
      }
      set length(t) {
        n(this, s, t, 'f'), (this['display-end'] || 0) > e(this, s, 'f') && (this['display-end'] = this.length);
      }
    }
    return (
      (o = new WeakMap()),
      (s = new WeakMap()),
      t([M({ type: Number, reflect: !0 })], a.prototype, 'length', null),
      t([M({ type: Number, reflect: !0 })], a.prototype, 'display-start', void 0),
      t([M({ type: Number, reflect: !0 })], a.prototype, 'display-end', void 0),
      a
    );
  },
  Yi = '#FFFFFFDD',
  Fi = { 'margin-top': 0, 'margin-bottom': 0, 'margin-left': 10, 'margin-right': 10, 'margin-color': Yi },
  Zi = (n, i = {}) => {
    var r;
    class o extends C(n) {
      constructor() {
        var t;
        super(...arguments),
          r.set(this, { ...Fi, ...i }),
          (this['margin-top'] = e(this, r, 'f')['margin-top']),
          (this['margin-bottom'] = e(this, r, 'f')['margin-bottom']),
          (this['margin-left'] = e(this, r, 'f')['margin-left']),
          (this['margin-right'] = e(this, r, 'f')['margin-right']),
          (this['margin-color'] = null !== (t = e(this, r, 'f')['margin-color']) && void 0 !== t ? t : Yi);
      }
      getWidthWithMargins() {
        return this.width ? this.width - this['margin-left'] - this['margin-right'] : 0;
      }
      getHeightWithMargins() {
        return this.height ? this.height - this['margin-top'] - this['margin-bottom'] : 0;
      }
      renderMarginOnGroup(t) {
        t &&
          (t.select('rect').empty() &&
            (t.append('rect').style('pointer-events', 'none').attr('class', 'margin-left'),
            t.append('rect').style('pointer-events', 'none').attr('class', 'margin-right'),
            t.append('rect').style('pointer-events', 'none').attr('class', 'margin-top'),
            t.append('rect').style('pointer-events', 'none').attr('class', 'margin-bottom')),
          t.select('rect.margin-left').attr('fill', this['margin-color']).attr('x', 0).attr('y', 0).attr('width', this['margin-left']).attr('height', this.height),
          t
            .select('rect.margin-right')
            .attr('fill', this['margin-color'])
            .attr('x', this.width - this['margin-right'])
            .attr('y', 0)
            .attr('width', this['margin-right'])
            .attr('height', this.height),
          t
            .select('rect.margin-top')
            .attr('fill', this['margin-color'])
            .attr('x', this['margin-left'])
            .attr('y', 0)
            .attr('width', this.width - this['margin-left'] - this['margin-right'])
            .attr('height', this['margin-top']),
          t
            .select('rect.margin-bottom')
            .attr('fill', this['margin-color'])
            .attr('x', this['margin-left'])
            .attr('y', this.height - this['margin-bottom'])
            .attr('width', this.width - this['margin-left'] - this['margin-right'])
            .attr('height', this['margin-bottom']));
      }
    }
    return (
      (r = new WeakMap()),
      t([M({ type: Number })], o.prototype, 'margin-top', void 0),
      t([M({ type: Number })], o.prototype, 'margin-bottom', void 0),
      t([M({ type: Number })], o.prototype, 'margin-left', void 0),
      t([M({ type: Number })], o.prototype, 'margin-right', void 0),
      t([M({ type: String })], o.prototype, 'margin-color', void 0),
      o
    );
  },
  Ki = { 'min-width': 10, 'min-height': 10 },
  Gi = (n, i = {}) => {
    var r;
    class o extends C(n) {
      constructor() {
        super(...arguments), r.set(this, { ...Ki, ...i }), (this['min-width'] = e(this, r, 'f')['min-width']), (this['min-height'] = e(this, r, 'f')['min-height']);
      }
      onDimensionsChange() {}
      connectedCallback() {
        var t, e;
        super.connectedCallback(),
          (null !== (t = this.width) && void 0 !== t) || (this.width = this['min-width']),
          (null !== (e = this.height) && void 0 !== e) || (this.height = this['min-height']),
          null === this.getAttribute('width') && (this.style.width = '100%'),
          null === this.getAttribute('height') && (this.style.height = '100%'),
          Ji.observe(this);
      }
      disconnectedCallback() {
        Ji.unobserve(this), super.disconnectedCallback();
      }
    }
    return (
      (r = new WeakMap()),
      t([M({ type: Number, reflect: !0 })], o.prototype, 'min-width', void 0),
      t([M({ type: Number, reflect: !0 })], o.prototype, 'min-height', void 0),
      o
    );
  },
  Ji = new ResizeObserver((t) => {
    window.requestAnimationFrame(() => {
      var e, n;
      for (const i of t) {
        const t = null === (e = i.contentBoxSize) || void 0 === e ? void 0 : e[0].inlineSize,
          r = null === (n = i.contentBoxSize) || void 0 === n ? void 0 : n[0].blockSize;
        void 0 !== t && void 0 !== r && Qi(i.target, t, r);
      }
    });
  });
function Qi(t, e, n) {
  (e = Math.max(e, t['min-width'])), (n = Math.max(n, t['min-height']));
  let i = !1;
  e !== t.width && null === t.getAttribute('width') && ((t.width = e), (i = !0)),
    n !== t.height && null === t.getAttribute('height') && ((t.height = n), (i = !0)),
    i && t.onDimensionsChange();
}
const tr = (t) =>
  class extends t {
    connectedCallback() {
      this.closest('nightingale-manager') &&
        customElements.whenDefined('nightingale-manager').then(() => {
          (this.manager = this.closest('nightingale-manager')), this.manager && this.manager.register(this);
        }),
        super.connectedCallback();
    }
    disconnectedCallback() {
      this.manager && this.manager.unregister(this), super.disconnectedCallback();
    }
  };
class er {
  constructor({ min: t = -1 / 0, max: e = 1 / 0 } = {}) {
    (this.segments = []), (this.max = e), (this.min = t), (this.regionString = null);
  }
  encode(t = !1) {
    return this.segments
      .map(({ start: e, end: n }) => {
        if (t) return `${e}:${n}`;
        return `${e === this.min ? '' : e}:${n === this.max ? '' : n}`;
      })
      .join(',');
  }
  decode(t) {
    void 0 !== t && (this.regionString = t),
      this.regionString
        ? (this.segments = this.regionString.split(',').map((t) => {
            const [e, n, i] = t.split(':');
            if (void 0 !== i) throw new Error(`there should be at most 1 ':' per region. Region: ${t}`);
            let r = e ? Number(e) : this.min,
              o = n ? Number(n) : this.max;
            if ((r > o && ([r, o] = [o, r]), r < this.min && (r = this.min), o > this.max && (o = this.max), Number.isNaN(r)))
              throw new Error(`The parsed value of ${e} is NaN. Region: ${t}`);
            if (Number.isNaN(o)) throw new Error(`The parsed value of ${n} is NaN. Region: ${t}`);
            return { start: r, end: o };
          }))
        : (this.segments = []);
  }
}
const nr = (t, e) => (t ? (e ? `${t},${e}` : t) : e),
  ir = { highlight: null, 'highlight-color': '#FFEB3B66' },
  rr = (i, r = {}) => {
    var o, s;
    class a extends i {
      constructor(...t) {
        super(...t),
          o.set(this, { ...ir, ...r }),
          (this.highlight = e(this, o, 'f').highlight),
          (this['highlight-color'] = e(this, o, 'f')['highlight-color']),
          s.set(this, void 0),
          (this.highlightedRegion = new er({ min: 1 })),
          n(this, s, null, 'f');
      }
      set fixedHighlight(t) {
        n(this, s, t, 'f'), this.highlightedRegion.decode(nr(this.highlight || '', e(this, s, 'f') || '')), this.updateHighlight();
      }
      attributeChangedCallback(t, n, i) {
        super.attributeChangedCallback(t, n, i),
          'null' === i && (i = null),
          n !== i &&
            ('length' === t && (this.highlightedRegion.max = Number(i)), 'highlight' === t && this.highlightedRegion.decode(nr(i || '', e(this, s, 'f') || '')));
      }
      updateHighlight() {}
    }
    return (
      (o = new WeakMap()),
      (s = new WeakMap()),
      t([M({ type: String, reflect: !0 })], a.prototype, 'highlight', void 0),
      t([M({ type: String, reflect: !0 })], a.prototype, 'highlight-color', void 0),
      a
    );
  },
  or = ['length', 'width', 'height'],
  sr = (e) => {
    class n extends Zi(Vi(Gi(C(e)))) {
      constructor(...t) {
        super(...t),
          (this['use-ctrl-to-zoom'] = !1),
          (this.updateScaleDomain = this.updateScaleDomain.bind(this)),
          (this._initZoom = this._initZoom.bind(this)),
          (this.zoomed = this.zoomed.bind(this)),
          (this._applyZoomTranslation = this.applyZoomTranslation.bind(this));
        let e = !1;
        this.applyZoomTranslation = () => {
          e ||
            ((e = !0),
            requestAnimationFrame(() => {
              (e = !1), this._applyZoomTranslation();
            }));
        };
      }
      connectedCallback() {
        this.updateScaleDomain(), this._initZoom(), super.connectedCallback(), this.onDimensionsChange();
      }
      disconnectedCallback() {
        super.disconnectedCallback();
      }
      get zoom() {
        return this._zoom;
      }
      set svg(t) {
        t && this._zoom && ((this._svg = t), t.call(this._zoom).on('dblclick.zoom', null), this.applyZoomTranslation());
      }
      get svg() {
        return this._svg;
      }
      updateScaleDomain() {
        var t, e;
        (this.originXScale = ki()
          .domain([1, (this.length || 0) + 1])
          .range([0, this.getWidthWithMargins()])),
          (this.tmpXScale = this.originXScale.copy()),
          (null !== (t = this.xScale) && void 0 !== t) || (this.xScale = this.originXScale.copy()),
          null === (e = this.zoom) ||
            void 0 === e ||
            e.translateExtent([
              [0, 0],
              [this.getWidthWithMargins(), 0],
            ]);
      }
      _initZoom() {
        this._zoom = Li()
          .scaleExtent([1, 1 / 0])
          .translateExtent([
            [0, 0],
            [this.getWidthWithMargins(), 0],
          ])
          .extent([
            [0, 0],
            [this.getWidthWithMargins(), 0],
          ])
          .filter((t) => 'wheel' !== (null == t ? void 0 : t.type) || !this['use-ctrl-to-zoom'] || t.ctrlKey)
          .on('zoom', this.zoomed);
      }
      attributeChangedCallback(t, e, n) {
        super.attributeChangedCallback(t, e, n);
        e !== ('null' === n ? null : n) && (or.includes(t) && this.updateScaleDomain(), this.applyZoomTranslation());
      }
      zoomed(t) {
        var e;
        this.originXScale && (this.tmpXScale = t.transform.rescaleX(this.originXScale));
        const [n, i] = (null === (e = null == this ? void 0 : this.tmpXScale) || void 0 === e ? void 0 : e.domain()) || [0, 0];
        this.tmpXScale &&
          (this.dontDispatch
            ? (this.xScale = this.tmpXScale)
            : this.dispatchEvent(
                new CustomEvent('change', {
                  detail: { 'display-start': Math.max(1, n), 'display-end': Math.min(this.length || 0, Math.max(i - 1, n + 1)) },
                  bubbles: !0,
                  cancelable: !0,
                })
              ));
      }
      applyZoomTranslation() {
        if (!this.svg || !this.originXScale) return;
        const t = Math.max(1, (this.length || 0) / (1 + (this['display-end'] || 0) - (this['display-start'] || 0))),
          e = -this.originXScale(this['display-start'] || 0);
        (this.dontDispatch = !0), this.zoom && this.svg.call(this.zoom.transform, Ui.scale(t).translate(e, 0)), (this.dontDispatch = !1), this.zoomRefreshed();
      }
      zoomRefreshed() {
        super.render();
      }
      render() {
        return this.applyZoomTranslation(), super.render();
      }
      onDimensionsChange() {
        var t, e;
        super.onDimensionsChange(),
          null === (t = this.svg) || void 0 === t || t.attr('width', this.width),
          null === (e = this.svg) || void 0 === e || e.attr('height', this.height),
          this.updateScaleDomain(),
          this.applyZoomTranslation();
      }
      getXFromSeqPosition(t) {
        return this.xScale ? this['margin-left'] + this.xScale(t) : -1;
      }
      getSingleBaseWidth() {
        return this.xScale ? this.xScale(2) - this.xScale(1) : -1;
      }
    }
    return t([M({ type: Boolean })], n.prototype, 'use-ctrl-to-zoom', void 0), n;
  },
  ar = (t) => {
    class e extends sr(rr(t)) {
      createHighlightGroup() {
        const t = ne(this).selectAll('svg');
        this.highlighted = t.append('g').attr('class', 'highlighted');
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
    }
    return e;
  },
  hr = 'highlight-event';
function lr(t, e = null, n = !1, i = !1, r, o, s, a, h) {
  e && (e = (null == e ? void 0 : e.feature) || e);
  const l = { eventType: t, feature: e, target: s, parentEvent: a, coords: a && 'pageX' in a && 'pageY' in a ? [a.pageX, a.pageY] : null };
  return (
    n &&
      ((null == e ? void 0 : e.fragments)
        ? (l.highlight = ((null == e ? void 0 : e.fragments) || []).map((t) => `${t.start}:${t.end}`).join(','))
        : (null == a ? void 0 : a.shiftKey) && (null == h ? void 0 : h.highlight)
          ? (l.highlight = `${h.highlight},${r}:${o}`)
          : (l.highlight = r && o ? `${r}:${o}` : void 0)),
    i && (l.selectedId = null == e ? void 0 : e.accession),
    new CustomEvent('change', { detail: l, bubbles: !0, cancelable: !0 })
  );
}
function ur(t, e) {
  t.on('mouseover', function (t, n) {
    var i, r;
    e.dispatchEvent(
      lr(
        'mouseover',
        n,
        'onmouseover' === e.getAttribute(hr),
        !1,
        null !== (i = n.start) && void 0 !== i ? i : n.position,
        null !== (r = n.end) && void 0 !== r ? r : n.position,
        this,
        t
      )
    );
  })
    .on('mouseout', () => {
      e.dispatchEvent(lr('mouseout', null, 'onmouseover' === e.getAttribute(hr)));
    })
    .on('click', function (t, n) {
      var i, r;
      e.dispatchEvent(
        lr(
          'click',
          n,
          'onclick' === e.getAttribute(hr),
          !0,
          null !== (i = n.start) && void 0 !== i ? i : n.position,
          null !== (r = n.end) && void 0 !== r ? r : n.position,
          this,
          t,
          e
        )
      );
    });
}
function cr(t) {
  return t
    ? (function (t) {
        return 0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2];
      })(t) >= 165
      ? 'black'
      : 'white'
    : 'black';
}
function fr(t, e) {
  var n;
  const i = getComputedStyle(t),
    r = null == i ? void 0 : i[e];
  return (null === (n = null == r ? void 0 : r.match(/[.\d]+/g)) || void 0 === n ? void 0 : n.map(Number)) || null;
}
function pr(t, e, n) {
  return (function (t, e, n, i, r) {
    if (n === i) return n;
    for (; i - n > 4; ) {
      const o = (n + i) >> 1;
      r(t[o]) >= e ? (i = o) : (n = o + 1);
    }
    for (let o = n; o < i; o++) if (r(t[o]) >= e) return o;
    return i;
  })(t, e, 0, t.length, n);
}
var dr = Object.freeze({
  __proto__: null,
  firstEqIndex: function (t, e, n) {
    const i = pr(t, e, n);
    return i < t.length && n(t[i]) === e ? i : void 0;
  },
  firstGteqIndex: pr,
});
function gr(t) {
  let e = !1,
    n = !1;
  return {
    requestRefresh: function () {
      (e = !0),
        n ||
          (async function () {
            for (; e; ) {
              (e = !1), (n = !0), await mr(0);
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
function mr(t) {
  return new Promise((e) =>
    setTimeout(() => {
      e();
    }, t)
  );
}
const vr = (t) => (e, n) => {
    window.customElements.get(t) || (n ? i(t)(e, n) : i(t)(e));
  },
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ yr = globalThis,
  _r = yr.trustedTypes,
  wr = _r ? _r.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  $r = '$lit$',
  br = `lit$${Math.random().toFixed(9).slice(2)}$`,
  Ar = '?' + br,
  xr = `<${Ar}>`,
  Sr = document,
  Er = () => Sr.createComment(''),
  Mr = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
  Cr = Array.isArray,
  Nr = '[ \t\n\f\r]',
  kr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Pr = /-->/g,
  Tr = />/g,
  zr = RegExp(`>|${Nr}(?:([^\\s"'>=/]+)(${Nr}*=${Nr}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  Ur = /'/g,
  Or = /"/g,
  Hr = /^(?:script|style|textarea|title)$/i,
  Rr = Symbol.for('lit-noChange'),
  Dr = Symbol.for('lit-nothing'),
  jr = new WeakMap(),
  Xr = Sr.createTreeWalker(Sr, 129);
function qr(t, e) {
  if (!Cr(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return void 0 !== wr ? wr.createHTML(e) : e;
}
let Br = class t {
  constructor({ strings: e, _$litType$: n }, i) {
    let r;
    this.parts = [];
    let o = 0,
      s = 0;
    const a = e.length - 1,
      h = this.parts,
      [l, u] = ((t, e) => {
        const n = t.length - 1,
          i = [];
        let r,
          o = 2 === e ? '<svg>' : 3 === e ? '<math>' : '',
          s = kr;
        for (let e = 0; e < n; e++) {
          const n = t[e];
          let a,
            h,
            l = -1,
            u = 0;
          for (; u < n.length && ((s.lastIndex = u), (h = s.exec(n)), null !== h); )
            (u = s.lastIndex),
              s === kr
                ? '!--' === h[1]
                  ? (s = Pr)
                  : void 0 !== h[1]
                    ? (s = Tr)
                    : void 0 !== h[2]
                      ? (Hr.test(h[2]) && (r = RegExp('</' + h[2], 'g')), (s = zr))
                      : void 0 !== h[3] && (s = zr)
                : s === zr
                  ? '>' === h[0]
                    ? ((s = r ?? kr), (l = -1))
                    : void 0 === h[1]
                      ? (l = -2)
                      : ((l = s.lastIndex - h[2].length), (a = h[1]), (s = void 0 === h[3] ? zr : '"' === h[3] ? Or : Ur))
                  : s === Or || s === Ur
                    ? (s = zr)
                    : s === Pr || s === Tr
                      ? (s = kr)
                      : ((s = zr), (r = void 0));
          const c = s === zr && t[e + 1].startsWith('/>') ? ' ' : '';
          o += s === kr ? n + xr : l >= 0 ? (i.push(a), n.slice(0, l) + $r + n.slice(l) + br + c) : n + br + (-2 === l ? e : c);
        }
        return [qr(t, o + (t[n] || '<?>') + (2 === e ? '</svg>' : 3 === e ? '</math>' : '')), i];
      })(e, n);
    if (((this.el = t.createElement(l, i)), (Xr.currentNode = this.el.content), 2 === n || 3 === n)) {
      const t = this.el.content.firstChild;
      t.replaceWith(...t.childNodes);
    }
    for (; null !== (r = Xr.nextNode()) && h.length < a; ) {
      if (1 === r.nodeType) {
        if (r.hasAttributes())
          for (const t of r.getAttributeNames())
            if (t.endsWith($r)) {
              const e = u[s++],
                n = r.getAttribute(t).split(br),
                i = /([.?@])?(.*)/.exec(e);
              h.push({ type: 1, index: o, name: i[2], strings: n, ctor: '.' === i[1] ? Yr : '?' === i[1] ? Fr : '@' === i[1] ? Zr : Vr }), r.removeAttribute(t);
            } else t.startsWith(br) && (h.push({ type: 6, index: o }), r.removeAttribute(t));
        if (Hr.test(r.tagName)) {
          const t = r.textContent.split(br),
            e = t.length - 1;
          if (e > 0) {
            r.textContent = _r ? _r.emptyScript : '';
            for (let n = 0; n < e; n++) r.append(t[n], Er()), Xr.nextNode(), h.push({ type: 2, index: ++o });
            r.append(t[e], Er());
          }
        }
      } else if (8 === r.nodeType)
        if (r.data === Ar) h.push({ type: 2, index: o });
        else {
          let t = -1;
          for (; -1 !== (t = r.data.indexOf(br, t + 1)); ) h.push({ type: 7, index: o }), (t += br.length - 1);
        }
      o++;
    }
  }
  static createElement(t, e) {
    const n = Sr.createElement('template');
    return (n.innerHTML = t), n;
  }
};
function Lr(t, e, n = t, i) {
  if (e === Rr) return e;
  let r = void 0 !== i ? n._$Co?.[i] : n._$Cl;
  const o = Mr(e) ? void 0 : e._$litDirective$;
  return (
    r?.constructor !== o && (r?._$AO?.(!1), void 0 === o ? (r = void 0) : ((r = new o(t)), r._$AT(t, n, i)), void 0 !== i ? ((n._$Co ??= [])[i] = r) : (n._$Cl = r)),
    void 0 !== r && (e = Lr(t, r._$AS(t, e.values), r, i)),
    e
  );
}
let Ir = class {
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
        i = (t?.creationScope ?? Sr).importNode(e, !0);
      Xr.currentNode = i;
      let r = Xr.nextNode(),
        o = 0,
        s = 0,
        a = n[0];
      for (; void 0 !== a; ) {
        if (o === a.index) {
          let e;
          2 === a.type
            ? (e = new Wr(r, r.nextSibling, this, t))
            : 1 === a.type
              ? (e = new a.ctor(r, a.name, a.strings, this, t))
              : 6 === a.type && (e = new Kr(r, this, t)),
            this._$AV.push(e),
            (a = n[++s]);
        }
        o !== a?.index && ((r = Xr.nextNode()), o++);
      }
      return (Xr.currentNode = Sr), i;
    }
    p(t) {
      let e = 0;
      for (const n of this._$AV) void 0 !== n && (void 0 !== n.strings ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++;
    }
  },
  Wr = class t {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, n, i) {
      (this.type = 2),
        (this._$AH = Dr),
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
      (t = Lr(this, t, e)),
        Mr(t)
          ? t === Dr || null == t || '' === t
            ? (this._$AH !== Dr && this._$AR(), (this._$AH = Dr))
            : t !== this._$AH && t !== Rr && this._(t)
          : void 0 !== t._$litType$
            ? this.$(t)
            : void 0 !== t.nodeType
              ? this.T(t)
              : ((t) => Cr(t) || 'function' == typeof t?.[Symbol.iterator])(t)
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
      this._$AH !== Dr && Mr(this._$AH) ? (this._$AA.nextSibling.data = t) : this.T(Sr.createTextNode(t)), (this._$AH = t);
    }
    $(t) {
      const { values: e, _$litType$: n } = t,
        i = 'number' == typeof n ? this._$AC(t) : (void 0 === n.el && (n.el = Br.createElement(qr(n.h, n.h[0]), this.options)), n);
      if (this._$AH?._$AD === i) this._$AH.p(e);
      else {
        const t = new Ir(i, this),
          n = t.u(this.options);
        t.p(e), this.T(n), (this._$AH = t);
      }
    }
    _$AC(t) {
      let e = jr.get(t.strings);
      return void 0 === e && jr.set(t.strings, (e = new Br(t))), e;
    }
    k(e) {
      Cr(this._$AH) || ((this._$AH = []), this._$AR());
      const n = this._$AH;
      let i,
        r = 0;
      for (const o of e) r === n.length ? n.push((i = new t(this.O(Er()), this.O(Er()), this, this.options))) : (i = n[r]), i._$AI(o), r++;
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
  Vr = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, n, i, r) {
      (this.type = 1),
        (this._$AH = Dr),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = i),
        (this.options = r),
        n.length > 2 || '' !== n[0] || '' !== n[1] ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n)) : (this._$AH = Dr);
    }
    _$AI(t, e = this, n, i) {
      const r = this.strings;
      let o = !1;
      if (void 0 === r) (t = Lr(this, t, e, 0)), (o = !Mr(t) || (t !== this._$AH && t !== Rr)), o && (this._$AH = t);
      else {
        const i = t;
        let s, a;
        for (t = r[0], s = 0; s < r.length - 1; s++)
          (a = Lr(this, i[n + s], e, s)),
            a === Rr && (a = this._$AH[s]),
            (o ||= !Mr(a) || a !== this._$AH[s]),
            a === Dr ? (t = Dr) : t !== Dr && (t += (a ?? '') + r[s + 1]),
            (this._$AH[s] = a);
      }
      o && !i && this.j(t);
    }
    j(t) {
      t === Dr ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? '');
    }
  },
  Yr = class extends Vr {
    constructor() {
      super(...arguments), (this.type = 3);
    }
    j(t) {
      this.element[this.name] = t === Dr ? void 0 : t;
    }
  },
  Fr = class extends Vr {
    constructor() {
      super(...arguments), (this.type = 4);
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== Dr);
    }
  },
  Zr = class extends Vr {
    constructor(t, e, n, i, r) {
      super(t, e, n, i, r), (this.type = 5);
    }
    _$AI(t, e = this) {
      if ((t = Lr(this, t, e, 0) ?? Dr) === Rr) return;
      const n = this._$AH,
        i = (t === Dr && n !== Dr) || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive,
        r = t !== Dr && (n === Dr || i);
      i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), (this._$AH = t);
    }
    handleEvent(t) {
      'function' == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  },
  Kr = class {
    constructor(t, e, n) {
      (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n);
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      Lr(this, t);
    }
  };
const Gr = yr.litHtmlPolyfillSupport;
Gr?.(Br, Wr), (yr.litHtmlVersions ??= []).push('3.2.1');
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jr = globalThis,
  Qr = Jr.ShadowRoot && (void 0 === Jr.ShadyCSS || Jr.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype,
  to = Symbol(),
  eo = new WeakMap();
let no = class {
  constructor(t, e, n) {
    if (((this._$cssResult$ = !0), n !== to)) throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    (this.cssText = t), (this.t = e);
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Qr && void 0 === t) {
      const n = void 0 !== e && 1 === e.length;
      n && (t = eo.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && eo.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const io = Qr
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return ((t) => new no('string' == typeof t ? t : t + '', void 0, to))(e);
            })(t)
          : t,
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ { is: ro, defineProperty: oo, getOwnPropertyDescriptor: so, getOwnPropertyNames: ao, getOwnPropertySymbols: ho, getPrototypeOf: lo } = Object,
  uo = globalThis,
  co = uo.trustedTypes,
  fo = co ? co.emptyScript : '',
  po = uo.reactiveElementPolyfillSupport,
  go = (t, e) => t,
  mo = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? fo : null;
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
  vo = (t, e) => !ro(t, e),
  yo = { attribute: !0, type: String, converter: mo, reflect: !1, hasChanged: vo };
(Symbol.metadata ??= Symbol('metadata')), (uo.litPropertyMetadata ??= new WeakMap());
class _o extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = yo) {
    if ((e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor)) {
      const n = Symbol(),
        i = this.getPropertyDescriptor(t, n, e);
      void 0 !== i && oo(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: i, set: r } = so(this.prototype, t) ?? {
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
        const o = i?.call(this);
        r.call(this, e), this.requestUpdate(t, o, n);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? yo;
  }
  static _$Ei() {
    if (this.hasOwnProperty(go('elementProperties'))) return;
    const t = lo(this);
    t.finalize(), void 0 !== t.l && (this.l = [...t.l]), (this.elementProperties = new Map(t.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(go('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(go('properties')))) {
      const t = this.properties,
        e = [...ao(t), ...ho(t)];
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
      for (const t of n) e.unshift(io(t));
    } else void 0 !== t && e.push(io(t));
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
        if (Qr) t.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
        else
          for (const n of e) {
            const e = document.createElement('style'),
              i = Jr.litNonce;
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
      const r = (void 0 !== n.converter?.toAttribute ? n.converter : mo).toAttribute(e, n.type);
      (this._$Em = t), null == r ? this.removeAttribute(i) : this.setAttribute(i, r), (this._$Em = null);
    }
  }
  _$AK(t, e) {
    const n = this.constructor,
      i = n._$Eh.get(t);
    if (void 0 !== i && this._$Em !== i) {
      const t = n.getPropertyOptions(i),
        r = 'function' == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : mo;
      (this._$Em = i), (this[i] = r.fromAttribute(e, t.type)), (this._$Em = null);
    }
  }
  requestUpdate(t, e, n) {
    if (void 0 !== t) {
      if (((n ??= this.constructor.getPropertyOptions(t)), !(n.hasChanged ?? vo)(this[t], e))) return;
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
(_o.elementStyles = []),
  (_o.shadowRootOptions = { mode: 'open' }),
  (_o[go('elementProperties')] = new Map()),
  (_o[go('finalized')] = new Map()),
  po?.({ ReactiveElement: _o }),
  (uo.reactiveElementVersions ??= []).push('2.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wo = globalThis,
  $o = wo.trustedTypes,
  bo = $o ? $o.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  Ao = '$lit$',
  xo = `lit$${Math.random().toFixed(9).slice(2)}$`,
  So = '?' + xo,
  Eo = `<${So}>`,
  Mo = document,
  Co = () => Mo.createComment(''),
  No = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
  ko = Array.isArray,
  Po = '[ \t\n\f\r]',
  To = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  zo = /-->/g,
  Uo = />/g,
  Oo = RegExp(`>|${Po}(?:([^\\s"'>=/]+)(${Po}*=${Po}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  Ho = /'/g,
  Ro = /"/g,
  Do = /^(?:script|style|textarea|title)$/i,
  jo = Symbol.for('lit-noChange'),
  Xo = Symbol.for('lit-nothing'),
  qo = new WeakMap(),
  Bo = Mo.createTreeWalker(Mo, 129);
function Lo(t, e) {
  if (!ko(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return void 0 !== bo ? bo.createHTML(e) : e;
}
const Io = (t, e) => {
  const n = t.length - 1,
    i = [];
  let r,
    o = 2 === e ? '<svg>' : 3 === e ? '<math>' : '',
    s = To;
  for (let e = 0; e < n; e++) {
    const n = t[e];
    let a,
      h,
      l = -1,
      u = 0;
    for (; u < n.length && ((s.lastIndex = u), (h = s.exec(n)), null !== h); )
      (u = s.lastIndex),
        s === To
          ? '!--' === h[1]
            ? (s = zo)
            : void 0 !== h[1]
              ? (s = Uo)
              : void 0 !== h[2]
                ? (Do.test(h[2]) && (r = RegExp('</' + h[2], 'g')), (s = Oo))
                : void 0 !== h[3] && (s = Oo)
          : s === Oo
            ? '>' === h[0]
              ? ((s = r ?? To), (l = -1))
              : void 0 === h[1]
                ? (l = -2)
                : ((l = s.lastIndex - h[2].length), (a = h[1]), (s = void 0 === h[3] ? Oo : '"' === h[3] ? Ro : Ho))
            : s === Ro || s === Ho
              ? (s = Oo)
              : s === zo || s === Uo
                ? (s = To)
                : ((s = Oo), (r = void 0));
    const c = s === Oo && t[e + 1].startsWith('/>') ? ' ' : '';
    o += s === To ? n + Eo : l >= 0 ? (i.push(a), n.slice(0, l) + Ao + n.slice(l) + xo + c) : n + xo + (-2 === l ? e : c);
  }
  return [Lo(t, o + (t[n] || '<?>') + (2 === e ? '</svg>' : 3 === e ? '</math>' : '')), i];
};
class Wo {
  constructor({ strings: t, _$litType$: e }, n) {
    let i;
    this.parts = [];
    let r = 0,
      o = 0;
    const s = t.length - 1,
      a = this.parts,
      [h, l] = Io(t, e);
    if (((this.el = Wo.createElement(h, n)), (Bo.currentNode = this.el.content), 2 === e || 3 === e)) {
      const t = this.el.content.firstChild;
      t.replaceWith(...t.childNodes);
    }
    for (; null !== (i = Bo.nextNode()) && a.length < s; ) {
      if (1 === i.nodeType) {
        if (i.hasAttributes())
          for (const t of i.getAttributeNames())
            if (t.endsWith(Ao)) {
              const e = l[o++],
                n = i.getAttribute(t).split(xo),
                s = /([.?@])?(.*)/.exec(e);
              a.push({ type: 1, index: r, name: s[2], strings: n, ctor: '.' === s[1] ? Ko : '?' === s[1] ? Go : '@' === s[1] ? Jo : Zo }), i.removeAttribute(t);
            } else t.startsWith(xo) && (a.push({ type: 6, index: r }), i.removeAttribute(t));
        if (Do.test(i.tagName)) {
          const t = i.textContent.split(xo),
            e = t.length - 1;
          if (e > 0) {
            i.textContent = $o ? $o.emptyScript : '';
            for (let n = 0; n < e; n++) i.append(t[n], Co()), Bo.nextNode(), a.push({ type: 2, index: ++r });
            i.append(t[e], Co());
          }
        }
      } else if (8 === i.nodeType)
        if (i.data === So) a.push({ type: 2, index: r });
        else {
          let t = -1;
          for (; -1 !== (t = i.data.indexOf(xo, t + 1)); ) a.push({ type: 7, index: r }), (t += xo.length - 1);
        }
      r++;
    }
  }
  static createElement(t, e) {
    const n = Mo.createElement('template');
    return (n.innerHTML = t), n;
  }
}
function Vo(t, e, n = t, i) {
  if (e === jo) return e;
  let r = void 0 !== i ? n._$Co?.[i] : n._$Cl;
  const o = No(e) ? void 0 : e._$litDirective$;
  return (
    r?.constructor !== o && (r?._$AO?.(!1), void 0 === o ? (r = void 0) : ((r = new o(t)), r._$AT(t, n, i)), void 0 !== i ? ((n._$Co ??= [])[i] = r) : (n._$Cl = r)),
    void 0 !== r && (e = Vo(t, r._$AS(t, e.values), r, i)),
    e
  );
}
class Yo {
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
      i = (t?.creationScope ?? Mo).importNode(e, !0);
    Bo.currentNode = i;
    let r = Bo.nextNode(),
      o = 0,
      s = 0,
      a = n[0];
    for (; void 0 !== a; ) {
      if (o === a.index) {
        let e;
        2 === a.type
          ? (e = new Fo(r, r.nextSibling, this, t))
          : 1 === a.type
            ? (e = new a.ctor(r, a.name, a.strings, this, t))
            : 6 === a.type && (e = new Qo(r, this, t)),
          this._$AV.push(e),
          (a = n[++s]);
      }
      o !== a?.index && ((r = Bo.nextNode()), o++);
    }
    return (Bo.currentNode = Mo), i;
  }
  p(t) {
    let e = 0;
    for (const n of this._$AV) void 0 !== n && (void 0 !== n.strings ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++;
  }
}
class Fo {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, n, i) {
    (this.type = 2),
      (this._$AH = Xo),
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
    (t = Vo(this, t, e)),
      No(t)
        ? t === Xo || null == t || '' === t
          ? (this._$AH !== Xo && this._$AR(), (this._$AH = Xo))
          : t !== this._$AH && t !== jo && this._(t)
        : void 0 !== t._$litType$
          ? this.$(t)
          : void 0 !== t.nodeType
            ? this.T(t)
            : ((t) => ko(t) || 'function' == typeof t?.[Symbol.iterator])(t)
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
    this._$AH !== Xo && No(this._$AH) ? (this._$AA.nextSibling.data = t) : this.T(Mo.createTextNode(t)), (this._$AH = t);
  }
  $(t) {
    const { values: e, _$litType$: n } = t,
      i = 'number' == typeof n ? this._$AC(t) : (void 0 === n.el && (n.el = Wo.createElement(Lo(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const t = new Yo(i, this),
        n = t.u(this.options);
      t.p(e), this.T(n), (this._$AH = t);
    }
  }
  _$AC(t) {
    let e = qo.get(t.strings);
    return void 0 === e && qo.set(t.strings, (e = new Wo(t))), e;
  }
  k(t) {
    ko(this._$AH) || ((this._$AH = []), this._$AR());
    const e = this._$AH;
    let n,
      i = 0;
    for (const r of t) i === e.length ? e.push((n = new Fo(this.O(Co()), this.O(Co()), this, this.options))) : (n = e[i]), n._$AI(r), i++;
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
class Zo {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, n, i, r) {
    (this.type = 1),
      (this._$AH = Xo),
      (this._$AN = void 0),
      (this.element = t),
      (this.name = e),
      (this._$AM = i),
      (this.options = r),
      n.length > 2 || '' !== n[0] || '' !== n[1] ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n)) : (this._$AH = Xo);
  }
  _$AI(t, e = this, n, i) {
    const r = this.strings;
    let o = !1;
    if (void 0 === r) (t = Vo(this, t, e, 0)), (o = !No(t) || (t !== this._$AH && t !== jo)), o && (this._$AH = t);
    else {
      const i = t;
      let s, a;
      for (t = r[0], s = 0; s < r.length - 1; s++)
        (a = Vo(this, i[n + s], e, s)),
          a === jo && (a = this._$AH[s]),
          (o ||= !No(a) || a !== this._$AH[s]),
          a === Xo ? (t = Xo) : t !== Xo && (t += (a ?? '') + r[s + 1]),
          (this._$AH[s] = a);
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === Xo ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? '');
  }
}
class Ko extends Zo {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(t) {
    this.element[this.name] = t === Xo ? void 0 : t;
  }
}
class Go extends Zo {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== Xo);
  }
}
class Jo extends Zo {
  constructor(t, e, n, i, r) {
    super(t, e, n, i, r), (this.type = 5);
  }
  _$AI(t, e = this) {
    if ((t = Vo(this, t, e, 0) ?? Xo) === jo) return;
    const n = this._$AH,
      i = (t === Xo && n !== Xo) || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive,
      r = t !== Xo && (n === Xo || i);
    i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), (this._$AH = t);
  }
  handleEvent(t) {
    'function' == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Qo {
  constructor(t, e, n) {
    (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Vo(this, t);
  }
}
const ts = wo.litHtmlPolyfillSupport;
ts?.(Wo, Fo), (wo.litHtmlVersions ??= []).push('3.2.1');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class es extends _o {
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
          i._$litPart$ = r = new Fo(e.insertBefore(Co(), t), t, void 0, n ?? {});
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
    return jo;
  }
}
(es._$litElement$ = !0), (es.finalized = !0), globalThis.litElementHydrateSupport?.({ LitElement: es });
const ns = globalThis.litElementPolyfillSupport;
ns?.({ LitElement: es }), (globalThis.litElementVersions ??= []).push('4.1.1');
class is extends es {
  connectedCallback() {
    super.connectedCallback(), (this.style.display = 'inline-block'), (this.style.lineHeight = '0');
  }
  createRenderRoot() {
    return this;
  }
}
export {
  dr as BinarySearch,
  gr as Refresher,
  er as Region,
  ur as bindEvents,
  cr as contrastingColor,
  lr as createEvent,
  vr as customElementOnce,
  is as default,
  fr as getColor,
  Ii as withCanvas,
  C as withDimensions,
  rr as withHighlight,
  tr as withManager,
  Zi as withMargin,
  Vi as withPosition,
  Gi as withResizable,
  ar as withSVGHighlight,
  sr as withZoom,
};
//# sourceMappingURL=index.js.map
