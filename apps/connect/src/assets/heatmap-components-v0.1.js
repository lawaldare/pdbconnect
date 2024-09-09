var t = function (e, n) {
  return (
    (t =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (t, e) {
          t.__proto__ = e;
        }) ||
      function (t, e) {
        for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
      }),
    t(e, n)
  );
};
function e(e, n) {
  if ('function' != typeof n && null !== n) throw new TypeError('Class extends value ' + String(n) + ' is not a constructor or null');
  function r() {
    this.constructor = e;
  }
  t(e, n), (e.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()));
}
var n = function () {
  return (
    (n =
      Object.assign ||
      function (t) {
        for (var e, n = 1, r = arguments.length; n < r; n++) for (var i in (e = arguments[n])) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
        return t;
      }),
    n.apply(this, arguments)
  );
};
function r(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (null != t && 'function' == typeof Object.getOwnPropertySymbols) {
    var i = 0;
    for (r = Object.getOwnPropertySymbols(t); i < r.length; i++) e.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[i]) && (n[r[i]] = t[r[i]]);
  }
  return n;
}
function i(t, e, n, r) {
  var i,
    o = arguments.length,
    a = o < 3 ? e : null === r ? (r = Object.getOwnPropertyDescriptor(e, n)) : r;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, r);
  else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (a = (o < 3 ? i(a) : o > 3 ? i(e, n, a) : i(e, n)) || a);
  return o > 3 && a && Object.defineProperty(e, n, a), a;
}
function o(t, e) {
  return function (n, r) {
    e(n, r, t);
  };
}
function a(t, e) {
  if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata) return Reflect.metadata(t, e);
}
function s(t, e, n, r) {
  return new (n || (n = Promise))(function (i, o) {
    function a(t) {
      try {
        u(r.next(t));
      } catch (t) {
        o(t);
      }
    }
    function s(t) {
      try {
        u(r.throw(t));
      } catch (t) {
        o(t);
      }
    }
    function u(t) {
      var e;
      t.done
        ? i(t.value)
        : ((e = t.value),
          e instanceof n
            ? e
            : new n(function (t) {
                t(e);
              })).then(a, s);
    }
    u((r = r.apply(t, e || [])).next());
  });
}
function u(t, e) {
  var n,
    r,
    i,
    o,
    a = {
      label: 0,
      sent: function () {
        if (1 & i[0]) throw i[1];
        return i[1];
      },
      trys: [],
      ops: [],
    };
  return (
    (o = { next: s(0), throw: s(1), return: s(2) }),
    'function' == typeof Symbol &&
      (o[Symbol.iterator] = function () {
        return this;
      }),
    o
  );
  function s(s) {
    return function (u) {
      return (function (s) {
        if (n) throw new TypeError('Generator is already executing.');
        for (; o && ((o = 0), s[0] && (a = 0)), a; )
          try {
            if (((n = 1), r && (i = 2 & s[0] ? r.return : s[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, s[1])).done)) return i;
            switch (((r = 0), i && (s = [2 & s[0], i.value]), s[0])) {
              case 0:
              case 1:
                i = s;
                break;
              case 4:
                return a.label++, { value: s[1], done: !1 };
              case 5:
                a.label++, (r = s[1]), (s = [0]);
                continue;
              case 7:
                (s = a.ops.pop()), a.trys.pop();
                continue;
              default:
                if (!((i = a.trys), (i = i.length > 0 && i[i.length - 1]) || (6 !== s[0] && 2 !== s[0]))) {
                  a = 0;
                  continue;
                }
                if (3 === s[0] && (!i || (s[1] > i[0] && s[1] < i[3]))) {
                  a.label = s[1];
                  break;
                }
                if (6 === s[0] && a.label < i[1]) {
                  (a.label = i[1]), (i = s);
                  break;
                }
                if (i && a.label < i[2]) {
                  (a.label = i[2]), a.ops.push(s);
                  break;
                }
                i[2] && a.ops.pop(), a.trys.pop();
                continue;
            }
            s = e.call(t, a);
          } catch (t) {
            (s = [6, t]), (r = 0);
          } finally {
            n = i = 0;
          }
        if (5 & s[0]) throw s[1];
        return { value: s[0] ? s[1] : void 0, done: !0 };
      })([s, u]);
    };
  }
}
var c = Object.create
  ? function (t, e, n, r) {
      void 0 === r && (r = n);
      var i = Object.getOwnPropertyDescriptor(e, n);
      (i && !('get' in i ? !e.__esModule : i.writable || i.configurable)) ||
        (i = {
          enumerable: !0,
          get: function () {
            return e[n];
          },
        }),
        Object.defineProperty(t, r, i);
    }
  : function (t, e, n, r) {
      void 0 === r && (r = n), (t[r] = e[n]);
    };
function l(t, e) {
  for (var n in t) 'default' === n || Object.prototype.hasOwnProperty.call(e, n) || c(e, t, n);
}
function f(t) {
  var e = 'function' == typeof Symbol && Symbol.iterator,
    n = e && t[e],
    r = 0;
  if (n) return n.call(t);
  if (t && 'number' == typeof t.length)
    return {
      next: function () {
        return t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t };
      },
    };
  throw new TypeError(e ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function h(t, e) {
  var n = 'function' == typeof Symbol && t[Symbol.iterator];
  if (!n) return t;
  var r,
    i,
    o = n.call(t),
    a = [];
  try {
    for (; (void 0 === e || e-- > 0) && !(r = o.next()).done; ) a.push(r.value);
  } catch (t) {
    i = { error: t };
  } finally {
    try {
      r && !r.done && (n = o.return) && n.call(o);
    } finally {
      if (i) throw i.error;
    }
  }
  return a;
}
function d() {
  for (var t = [], e = 0; e < arguments.length; e++) t = t.concat(h(arguments[e]));
  return t;
}
function p() {
  for (var t = 0, e = 0, n = arguments.length; e < n; e++) t += arguments[e].length;
  var r = Array(t),
    i = 0;
  for (e = 0; e < n; e++) for (var o = arguments[e], a = 0, s = o.length; a < s; a++, i++) r[i] = o[a];
  return r;
}
function v(t, e, n) {
  if (n || 2 === arguments.length) for (var r, i = 0, o = e.length; i < o; i++) (!r && i in e) || (r || (r = Array.prototype.slice.call(e, 0, i)), (r[i] = e[i]));
  return t.concat(r || Array.prototype.slice.call(e));
}
function m(t) {
  return this instanceof m ? ((this.v = t), this) : new m(t);
}
function g(t, e, n) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var r,
    i = n.apply(t, e || []),
    o = [];
  return (
    (r = {}),
    a('next'),
    a('throw'),
    a('return'),
    (r[Symbol.asyncIterator] = function () {
      return this;
    }),
    r
  );
  function a(t) {
    i[t] &&
      (r[t] = function (e) {
        return new Promise(function (n, r) {
          o.push([t, e, n, r]) > 1 || s(t, e);
        });
      });
  }
  function s(t, e) {
    try {
      !(function (t) {
        t.value instanceof m ? Promise.resolve(t.value.v).then(u, c) : l(o[0][2], t);
      })(i[t](e));
    } catch (t) {
      l(o[0][3], t);
    }
  }
  function u(t) {
    s('next', t);
  }
  function c(t) {
    s('throw', t);
  }
  function l(t, e) {
    t(e), o.shift(), o.length && s(o[0][0], o[0][1]);
  }
}
function y(t) {
  var e, n;
  return (
    (e = {}),
    r('next'),
    r('throw', function (t) {
      throw t;
    }),
    r('return'),
    (e[Symbol.iterator] = function () {
      return this;
    }),
    e
  );
  function r(r, i) {
    e[r] = t[r]
      ? function (e) {
          return (n = !n) ? { value: m(t[r](e)), done: !1 } : i ? i(e) : e;
        }
      : i;
  }
}
function b(t) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var e,
    n = t[Symbol.asyncIterator];
  return n
    ? n.call(t)
    : ((t = f(t)),
      (e = {}),
      r('next'),
      r('throw'),
      r('return'),
      (e[Symbol.asyncIterator] = function () {
        return this;
      }),
      e);
  function r(n) {
    e[n] =
      t[n] &&
      function (e) {
        return new Promise(function (r, i) {
          (function (t, e, n, r) {
            Promise.resolve(r).then(function (e) {
              t({ value: e, done: n });
            }, e);
          })(r, i, (e = t[n](e)).done, e.value);
        });
      };
  }
}
function _(t, e) {
  return Object.defineProperty ? Object.defineProperty(t, 'raw', { value: e }) : (t.raw = e), t;
}
var w = Object.create
  ? function (t, e) {
      Object.defineProperty(t, 'default', { enumerable: !0, value: e });
    }
  : function (t, e) {
      t.default = e;
    };
function x(t) {
  if (t && t.__esModule) return t;
  var e = {};
  if (null != t) for (var n in t) 'default' !== n && Object.prototype.hasOwnProperty.call(t, n) && c(e, t, n);
  return w(e, t), e;
}
function A(t) {
  return t && t.__esModule ? t : { default: t };
}
function M(t, e, n, r) {
  if ('a' === n && !r) throw new TypeError('Private accessor was defined without a getter');
  if ('function' == typeof e ? t !== e || !r : !e.has(t)) throw new TypeError('Cannot read private member from an object whose class did not declare it');
  return 'm' === n ? r : 'a' === n ? r.call(t) : r ? r.value : e.get(t);
}
function $(t, e, n, r, i) {
  if ('m' === r) throw new TypeError('Private method is not writable');
  if ('a' === r && !i) throw new TypeError('Private accessor was defined without a setter');
  if ('function' == typeof e ? t !== e || !i : !e.has(t)) throw new TypeError('Cannot write private member to an object whose class did not declare it');
  return 'a' === r ? i.call(t, n) : i ? (i.value = n) : e.set(t, n), n;
}
function E(t, e) {
  if (null === e || ('object' != typeof e && 'function' != typeof e)) throw new TypeError("Cannot use 'in' operator on non-object");
  return 'function' == typeof t ? e === t : t.has(e);
}
function S(t, e, n) {
  if (null != e) {
    if ('object' != typeof e && 'function' != typeof e) throw new TypeError('Object expected.');
    var r;
    if (n) {
      if (!Symbol.asyncDispose) throw new TypeError('Symbol.asyncDispose is not defined.');
      r = e[Symbol.asyncDispose];
    }
    if (void 0 === r) {
      if (!Symbol.dispose) throw new TypeError('Symbol.dispose is not defined.');
      r = e[Symbol.dispose];
    }
    if ('function' != typeof r) throw new TypeError('Object not disposable.');
    t.stack.push({ value: e, dispose: r, async: n });
  } else n && t.stack.push({ async: !0 });
  return e;
}
var C =
  'function' == typeof SuppressedError
    ? SuppressedError
    : function (t, e, n) {
        var r = new Error(n);
        return (r.name = 'SuppressedError'), (r.error = t), (r.suppressed = e), r;
      };
function k(t) {
  function e(e) {
    (t.error = t.hasError ? new C(e, t.error, 'An error was suppressed during disposal.') : e), (t.hasError = !0);
  }
  return (function n() {
    for (; t.stack.length; ) {
      var r = t.stack.pop();
      try {
        var i = r.dispose && r.dispose.call(r.value);
        if (r.async)
          return Promise.resolve(i).then(n, function (t) {
            return e(t), n();
          });
      } catch (t) {
        e(t);
      }
    }
    if (t.hasError) throw t.error;
  })();
}
var T = {
    __extends: e,
    __assign: n,
    __rest: r,
    __decorate: i,
    __param: o,
    __metadata: a,
    __awaiter: s,
    __generator: u,
    __createBinding: c,
    __exportStar: l,
    __values: f,
    __read: h,
    __spread: d,
    __spreadArrays: p,
    __spreadArray: v,
    __await: m,
    __asyncGenerator: g,
    __asyncDelegator: y,
    __asyncValues: b,
    __makeTemplateObject: _,
    __importStar: x,
    __importDefault: A,
    __classPrivateFieldGet: M,
    __classPrivateFieldSet: $,
    __classPrivateFieldIn: E,
    __addDisposableResource: S,
    __disposeResources: k,
  },
  N = Object.freeze({
    __proto__: null,
    __addDisposableResource: S,
    get __assign() {
      return n;
    },
    __asyncDelegator: y,
    __asyncGenerator: g,
    __asyncValues: b,
    __await: m,
    __awaiter: s,
    __classPrivateFieldGet: M,
    __classPrivateFieldIn: E,
    __classPrivateFieldSet: $,
    __createBinding: c,
    __decorate: i,
    __disposeResources: k,
    __esDecorate: function (t, e, n, r, i, o) {
      function a(t) {
        if (void 0 !== t && 'function' != typeof t) throw new TypeError('Function expected');
        return t;
      }
      for (
        var s,
          u = r.kind,
          c = 'getter' === u ? 'get' : 'setter' === u ? 'set' : 'value',
          l = !e && t ? (r.static ? t : t.prototype) : null,
          f = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}),
          h = !1,
          d = n.length - 1;
        d >= 0;
        d--
      ) {
        var p = {};
        for (var v in r) p[v] = 'access' === v ? {} : r[v];
        for (var v in r.access) p.access[v] = r.access[v];
        p.addInitializer = function (t) {
          if (h) throw new TypeError('Cannot add initializers after decoration has completed');
          o.push(a(t || null));
        };
        var m = (0, n[d])('accessor' === u ? { get: f.get, set: f.set } : f[c], p);
        if ('accessor' === u) {
          if (void 0 === m) continue;
          if (null === m || 'object' != typeof m) throw new TypeError('Object expected');
          (s = a(m.get)) && (f.get = s), (s = a(m.set)) && (f.set = s), (s = a(m.init)) && i.unshift(s);
        } else (s = a(m)) && ('field' === u ? i.unshift(s) : (f[c] = s));
      }
      l && Object.defineProperty(l, r.name, f), (h = !0);
    },
    __exportStar: l,
    __extends: e,
    __generator: u,
    __importDefault: A,
    __importStar: x,
    __makeTemplateObject: _,
    __metadata: a,
    __param: o,
    __propKey: function (t) {
      return 'symbol' == typeof t ? t : ''.concat(t);
    },
    __read: h,
    __rest: r,
    __runInitializers: function (t, e, n) {
      for (var r = arguments.length > 2, i = 0; i < e.length; i++) n = r ? e[i].call(t, n) : e[i].call(t);
      return r ? n : void 0;
    },
    __setFunctionName: function (t, e, n) {
      return (
        'symbol' == typeof e && (e = e.description ? '['.concat(e.description, ']') : ''),
        Object.defineProperty(t, 'name', { configurable: !0, value: n ? ''.concat(n, ' ', e) : e })
      );
    },
    __spread: d,
    __spreadArray: v,
    __spreadArrays: p,
    __values: f,
    default: T,
  });
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis,
  D = P.ShadowRoot && (void 0 === P.ShadyCSS || P.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype,
  O = Symbol(),
  z = new WeakMap();
let R = class {
  constructor(t, e, n) {
    if (((this._$cssResult$ = !0), n !== O)) throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    (this.cssText = t), (this.t = e);
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (D && void 0 === t) {
      const n = void 0 !== e && 1 === e.length;
      n && (t = z.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && z.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const I = D
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return ((t) => new R('string' == typeof t ? t : t + '', void 0, O))(e);
            })(t)
          : t,
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ { is: j, defineProperty: U, getOwnPropertyDescriptor: B, getOwnPropertyNames: H, getOwnPropertySymbols: q, getPrototypeOf: W } = Object,
  L = globalThis,
  F = L.trustedTypes,
  V = F ? F.emptyScript : '',
  Y = L.reactiveElementPolyfillSupport,
  X = (t, e) => t,
  Z = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? V : null;
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
  G = (t, e) => !j(t, e),
  K = { attribute: !0, type: String, converter: Z, reflect: !1, hasChanged: G };
(Symbol.metadata ??= Symbol('metadata')), (L.litPropertyMetadata ??= new WeakMap());
let J = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = K) {
    if ((e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor)) {
      const n = Symbol(),
        r = this.getPropertyDescriptor(t, n, e);
      void 0 !== r && U(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: r, set: i } = B(this.prototype, t) ?? {
      get() {
        return this[e];
      },
      set(t) {
        this[e] = t;
      },
    };
    return {
      get() {
        return r?.call(this);
      },
      set(e) {
        const o = r?.call(this);
        i.call(this, e), this.requestUpdate(t, o, n);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? K;
  }
  static _$Ei() {
    if (this.hasOwnProperty(X('elementProperties'))) return;
    const t = W(this);
    t.finalize(), void 0 !== t.l && (this.l = [...t.l]), (this.elementProperties = new Map(t.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(X('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(X('properties')))) {
      const t = this.properties,
        e = [...H(t), ...q(t)];
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
      for (const t of n) e.unshift(I(t));
    } else void 0 !== t && e.push(I(t));
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
        if (D) t.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
        else
          for (const n of e) {
            const e = document.createElement('style'),
              r = P.litNonce;
            void 0 !== r && e.setAttribute('nonce', r), (e.textContent = n.cssText), t.appendChild(e);
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
      r = this.constructor._$Eu(t, n);
    if (void 0 !== r && !0 === n.reflect) {
      const i = (void 0 !== n.converter?.toAttribute ? n.converter : Z).toAttribute(e, n.type);
      (this._$Em = t), null == i ? this.removeAttribute(r) : this.setAttribute(r, i), (this._$Em = null);
    }
  }
  _$AK(t, e) {
    const n = this.constructor,
      r = n._$Eh.get(t);
    if (void 0 !== r && this._$Em !== r) {
      const t = n.getPropertyOptions(r),
        i = 'function' == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : Z;
      (this._$Em = r), (this[r] = i.fromAttribute(e, t.type)), (this._$Em = null);
    }
  }
  requestUpdate(t, e, n) {
    if (void 0 !== t) {
      if (((n ??= this.constructor.getPropertyOptions(t)), !(n.hasChanged ?? G)(this[t], e))) return;
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
(J.elementStyles = []),
  (J.shadowRootOptions = { mode: 'open' }),
  (J[X('elementProperties')] = new Map()),
  (J[X('finalized')] = new Map()),
  Y?.({ ReactiveElement: J }),
  (L.reactiveElementVersions ??= []).push('2.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis,
  tt = Q.trustedTypes,
  et = tt ? tt.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  nt = '$lit$',
  rt = `lit$${(Math.random() + '').slice(9)}$`,
  it = '?' + rt,
  ot = `<${it}>`,
  at = document,
  st = () => at.createComment(''),
  ut = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
  ct = Array.isArray,
  lt = '[ \t\n\f\r]',
  ft = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  ht = /-->/g,
  dt = />/g,
  pt = RegExp(`>|${lt}(?:([^\\s"'>=/]+)(${lt}*=${lt}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  vt = /'/g,
  mt = /"/g,
  gt = /^(?:script|style|textarea|title)$/i,
  yt = (
    (t) =>
    (e, ...n) => ({ _$litType$: t, strings: e, values: n })
  )(1),
  bt = Symbol.for('lit-noChange'),
  _t = Symbol.for('lit-nothing'),
  wt = new WeakMap(),
  xt = at.createTreeWalker(at, 129);
function At(t, e) {
  if (!Array.isArray(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return void 0 !== et ? et.createHTML(e) : e;
}
let Mt = class t {
  constructor({ strings: e, _$litType$: n }, r) {
    let i;
    this.parts = [];
    let o = 0,
      a = 0;
    const s = e.length - 1,
      u = this.parts,
      [c, l] = ((t, e) => {
        const n = t.length - 1,
          r = [];
        let i,
          o = 2 === e ? '<svg>' : '',
          a = ft;
        for (let e = 0; e < n; e++) {
          const n = t[e];
          let s,
            u,
            c = -1,
            l = 0;
          for (; l < n.length && ((a.lastIndex = l), (u = a.exec(n)), null !== u); )
            (l = a.lastIndex),
              a === ft
                ? '!--' === u[1]
                  ? (a = ht)
                  : void 0 !== u[1]
                  ? (a = dt)
                  : void 0 !== u[2]
                  ? (gt.test(u[2]) && (i = RegExp('</' + u[2], 'g')), (a = pt))
                  : void 0 !== u[3] && (a = pt)
                : a === pt
                ? '>' === u[0]
                  ? ((a = i ?? ft), (c = -1))
                  : void 0 === u[1]
                  ? (c = -2)
                  : ((c = a.lastIndex - u[2].length), (s = u[1]), (a = void 0 === u[3] ? pt : '"' === u[3] ? mt : vt))
                : a === mt || a === vt
                ? (a = pt)
                : a === ht || a === dt
                ? (a = ft)
                : ((a = pt), (i = void 0));
          const f = a === pt && t[e + 1].startsWith('/>') ? ' ' : '';
          o += a === ft ? n + ot : c >= 0 ? (r.push(s), n.slice(0, c) + nt + n.slice(c) + rt + f) : n + rt + (-2 === c ? e : f);
        }
        return [At(t, o + (t[n] || '<?>') + (2 === e ? '</svg>' : '')), r];
      })(e, n);
    if (((this.el = t.createElement(c, r)), (xt.currentNode = this.el.content), 2 === n)) {
      const t = this.el.content.firstChild;
      t.replaceWith(...t.childNodes);
    }
    for (; null !== (i = xt.nextNode()) && u.length < s; ) {
      if (1 === i.nodeType) {
        if (i.hasAttributes())
          for (const t of i.getAttributeNames())
            if (t.endsWith(nt)) {
              const e = l[a++],
                n = i.getAttribute(t).split(rt),
                r = /([.?@])?(.*)/.exec(e);
              u.push({ type: 1, index: o, name: r[2], strings: n, ctor: '.' === r[1] ? kt : '?' === r[1] ? Tt : '@' === r[1] ? Nt : Ct }), i.removeAttribute(t);
            } else t.startsWith(rt) && (u.push({ type: 6, index: o }), i.removeAttribute(t));
        if (gt.test(i.tagName)) {
          const t = i.textContent.split(rt),
            e = t.length - 1;
          if (e > 0) {
            i.textContent = tt ? tt.emptyScript : '';
            for (let n = 0; n < e; n++) i.append(t[n], st()), xt.nextNode(), u.push({ type: 2, index: ++o });
            i.append(t[e], st());
          }
        }
      } else if (8 === i.nodeType)
        if (i.data === it) u.push({ type: 2, index: o });
        else {
          let t = -1;
          for (; -1 !== (t = i.data.indexOf(rt, t + 1)); ) u.push({ type: 7, index: o }), (t += rt.length - 1);
        }
      o++;
    }
  }
  static createElement(t, e) {
    const n = at.createElement('template');
    return (n.innerHTML = t), n;
  }
};
function $t(t, e, n = t, r) {
  if (e === bt) return e;
  let i = void 0 !== r ? n._$Co?.[r] : n._$Cl;
  const o = ut(e) ? void 0 : e._$litDirective$;
  return (
    i?.constructor !== o && (i?._$AO?.(!1), void 0 === o ? (i = void 0) : ((i = new o(t)), i._$AT(t, n, r)), void 0 !== r ? ((n._$Co ??= [])[r] = i) : (n._$Cl = i)),
    void 0 !== i && (e = $t(t, i._$AS(t, e.values), i, r)),
    e
  );
}
let Et = class {
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
        r = (t?.creationScope ?? at).importNode(e, !0);
      xt.currentNode = r;
      let i = xt.nextNode(),
        o = 0,
        a = 0,
        s = n[0];
      for (; void 0 !== s; ) {
        if (o === s.index) {
          let e;
          2 === s.type
            ? (e = new St(i, i.nextSibling, this, t))
            : 1 === s.type
            ? (e = new s.ctor(i, s.name, s.strings, this, t))
            : 6 === s.type && (e = new Pt(i, this, t)),
            this._$AV.push(e),
            (s = n[++a]);
        }
        o !== s?.index && ((i = xt.nextNode()), o++);
      }
      return (xt.currentNode = at), r;
    }
    p(t) {
      let e = 0;
      for (const n of this._$AV) void 0 !== n && (void 0 !== n.strings ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++;
    }
  },
  St = class t {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, n, r) {
      (this.type = 2),
        (this._$AH = _t),
        (this._$AN = void 0),
        (this._$AA = t),
        (this._$AB = e),
        (this._$AM = n),
        (this.options = r),
        (this._$Cv = r?.isConnected ?? !0);
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
      (t = $t(this, t, e)),
        ut(t)
          ? t === _t || null == t || '' === t
            ? (this._$AH !== _t && this._$AR(), (this._$AH = _t))
            : t !== this._$AH && t !== bt && this._(t)
          : void 0 !== t._$litType$
          ? this.$(t)
          : void 0 !== t.nodeType
          ? this.T(t)
          : ((t) => ct(t) || 'function' == typeof t?.[Symbol.iterator])(t)
          ? this.k(t)
          : this._(t);
    }
    S(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), (this._$AH = this.S(t)));
    }
    _(t) {
      this._$AH !== _t && ut(this._$AH) ? (this._$AA.nextSibling.data = t) : this.T(at.createTextNode(t)), (this._$AH = t);
    }
    $(t) {
      const { values: e, _$litType$: n } = t,
        r = 'number' == typeof n ? this._$AC(t) : (void 0 === n.el && (n.el = Mt.createElement(At(n.h, n.h[0]), this.options)), n);
      if (this._$AH?._$AD === r) this._$AH.p(e);
      else {
        const t = new Et(r, this),
          n = t.u(this.options);
        t.p(e), this.T(n), (this._$AH = t);
      }
    }
    _$AC(t) {
      let e = wt.get(t.strings);
      return void 0 === e && wt.set(t.strings, (e = new Mt(t))), e;
    }
    k(e) {
      ct(this._$AH) || ((this._$AH = []), this._$AR());
      const n = this._$AH;
      let r,
        i = 0;
      for (const o of e) i === n.length ? n.push((r = new t(this.S(st()), this.S(st()), this, this.options))) : (r = n[i]), r._$AI(o), i++;
      i < n.length && (this._$AR(r && r._$AB.nextSibling, i), (n.length = i));
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
  Ct = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, n, r, i) {
      (this.type = 1),
        (this._$AH = _t),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = r),
        (this.options = i),
        n.length > 2 || '' !== n[0] || '' !== n[1] ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n)) : (this._$AH = _t);
    }
    _$AI(t, e = this, n, r) {
      const i = this.strings;
      let o = !1;
      if (void 0 === i) (t = $t(this, t, e, 0)), (o = !ut(t) || (t !== this._$AH && t !== bt)), o && (this._$AH = t);
      else {
        const r = t;
        let a, s;
        for (t = i[0], a = 0; a < i.length - 1; a++)
          (s = $t(this, r[n + a], e, a)),
            s === bt && (s = this._$AH[a]),
            (o ||= !ut(s) || s !== this._$AH[a]),
            s === _t ? (t = _t) : t !== _t && (t += (s ?? '') + i[a + 1]),
            (this._$AH[a] = s);
      }
      o && !r && this.j(t);
    }
    j(t) {
      t === _t ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? '');
    }
  },
  kt = class extends Ct {
    constructor() {
      super(...arguments), (this.type = 3);
    }
    j(t) {
      this.element[this.name] = t === _t ? void 0 : t;
    }
  },
  Tt = class extends Ct {
    constructor() {
      super(...arguments), (this.type = 4);
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== _t);
    }
  },
  Nt = class extends Ct {
    constructor(t, e, n, r, i) {
      super(t, e, n, r, i), (this.type = 5);
    }
    _$AI(t, e = this) {
      if ((t = $t(this, t, e, 0) ?? _t) === bt) return;
      const n = this._$AH,
        r = (t === _t && n !== _t) || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive,
        i = t !== _t && (n === _t || r);
      r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, t), (this._$AH = t);
    }
    handleEvent(t) {
      'function' == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  },
  Pt = class {
    constructor(t, e, n) {
      (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n);
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      $t(this, t);
    }
  };
const Dt = Q.litHtmlPolyfillSupport;
Dt?.(Mt, St), (Q.litHtmlVersions ??= []).push('3.1.2');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Ot = class extends J {
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
        const r = n?.renderBefore ?? e;
        let i = r._$litPart$;
        if (void 0 === i) {
          const t = n?.renderBefore ?? null;
          r._$litPart$ = i = new St(e.insertBefore(st(), t), t, void 0, n ?? {});
        }
        return i._$AI(t), i;
      })(e, this.renderRoot, this.renderOptions));
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return bt;
  }
};
(Ot._$litElement$ = !0), (Ot.finalized = !0), globalThis.litElementHydrateSupport?.({ LitElement: Ot });
const zt = globalThis.litElementPolyfillSupport;
zt?.({ LitElement: Ot }), (globalThis.litElementVersions ??= []).push('4.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Rt = { attribute: !0, type: String, converter: Z, reflect: !1, hasChanged: G },
  It = (t = Rt, e, n) => {
    const { kind: r, metadata: i } = n;
    let o = globalThis.litPropertyMetadata.get(i);
    if ((void 0 === o && globalThis.litPropertyMetadata.set(i, (o = new Map())), o.set(n.name, t), 'accessor' === r)) {
      const { name: r } = n;
      return {
        set(n) {
          const i = e.get.call(this);
          e.set.call(this, n), this.requestUpdate(r, i, t);
        },
        init(e) {
          return void 0 !== e && this.P(r, void 0, t), e;
        },
      };
    }
    if ('setter' === r) {
      const { name: r } = n;
      return function (n) {
        const i = this[r];
        e.call(this, n), this.requestUpdate(r, i, t);
      };
    }
    throw Error('Unsupported decorator location: ' + r);
  };
function jt(t) {
  return (e, n) =>
    'object' == typeof n
      ? It(t, e, n)
      : ((t, e, n) => {
          const r = e.hasOwnProperty(n);
          return e.constructor.createProperty(n, r ? { ...t, wrapped: !0 } : t), r ? Object.getOwnPropertyDescriptor(e, n) : void 0;
        })(t, e, n);
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
}
const Ut = 1;
let Bt = class {
  constructor(t) {}
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, n) {
    (this._$Ct = t), (this._$AM = e), (this._$Ci = n);
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Ht = 'important',
  qt = ' !' + Ht,
  Wt = (
    (t) =>
    (...e) => ({ _$litDirective$: t, values: e })
  )(
    class extends Bt {
      constructor(t) {
        if ((super(t), t.type !== Ut || 'style' !== t.name || t.strings?.length > 2))
          throw Error('The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.');
      }
      render(t) {
        return Object.keys(t).reduce((e, n) => {
          const r = t[n];
          return null == r ? e : e + `${(n = n.includes('-') ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, '-$&').toLowerCase())}:${r};`;
        }, '');
      }
      update(t, [e]) {
        const { style: n } = t.element;
        if (void 0 === this.ft) return (this.ft = new Set(Object.keys(e))), this.render(e);
        for (const t of this.ft) null == e[t] && (this.ft.delete(t), t.includes('-') ? n.removeProperty(t) : (n[t] = null));
        for (const t in e) {
          const r = e[t];
          if (null != r) {
            this.ft.add(t);
            const e = 'string' == typeof r && r.endsWith(qt);
            t.includes('-') || e ? n.setProperty(t, e ? r.slice(0, -11) : r, e ? Ht : '') : (n[t] = r);
          }
        }
        return bt;
      }
    }
  );
function Lt(t, e, n, r) {
  var i,
    o = arguments.length,
    a = o < 3 ? e : null === r ? (r = Object.getOwnPropertyDescriptor(e, n)) : r;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, r);
  else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (a = (o < 3 ? i(a) : o > 3 ? i(e, n, a) : i(e, n)) || a);
  return o > 3 && a && Object.defineProperty(e, n, a), a;
}
function Ft(t, e, n, r) {
  if ('a' === n && !r) throw new TypeError('Private accessor was defined without a getter');
  if ('function' == typeof e ? t !== e || !r : !e.has(t)) throw new TypeError('Cannot read private member from an object whose class did not declare it');
  return 'm' === n ? r : 'a' === n ? r.call(t) : r ? r.value : e.get(t);
}
function Vt(t, e, n, r, i) {
  if ('m' === r) throw new TypeError('Private method is not writable');
  if ('a' === r && !i) throw new TypeError('Private accessor was defined without a setter');
  if ('function' == typeof e ? t !== e || !i : !e.has(t)) throw new TypeError('Cannot write private member to an object whose class did not declare it');
  return 'a' === r ? i.call(t, n) : i ? (i.value = n) : e.set(t, n), n;
}
'function' == typeof SuppressedError && SuppressedError;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yt = (t, e) =>
  'method' === e.kind && e.descriptor && !('value' in e.descriptor)
    ? {
        ...e,
        finisher(n) {
          n.createProperty(e.key, t);
        },
      }
    : {
        kind: 'field',
        key: Symbol(),
        placement: 'own',
        descriptor: {},
        originalKey: e.key,
        initializer() {
          'function' == typeof e.initializer && (this[e.key] = e.initializer.call(this));
        },
        finisher(n) {
          n.createProperty(e.key, t);
        },
      };
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function Xt(t) {
  return (e, n) =>
    void 0 !== n
      ? ((t, e, n) => {
          e.constructor.createProperty(n, t);
        })(t, e, n)
      : Yt(t, e);
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
}
var Zt;
null === (Zt = window.HTMLSlotElement) || void 0 === Zt || Zt.prototype.assignedElements;
const Gt = (t, e) => {
    class n extends t {
      constructor() {
        super(...arguments), (this.width = null == e ? void 0 : e.width), (this.height = null == e ? void 0 : e.height);
      }
    }
    return Lt([Xt({ type: Number })], n.prototype, 'width', void 0), Lt([Xt({ type: Number })], n.prototype, 'height', void 0), n;
  },
  Kt = { 'display-start': 1, 'display-end': -1, length: 0 },
  Jt = (t, e = {}) => {
    var n, r;
    class i extends t {
      constructor() {
        super(...arguments),
          n.set(this, { ...Kt, ...e }),
          r.set(this, Ft(this, n, 'f').length),
          (this['display-start'] = Ft(this, n, 'f')['display-start']),
          (this['display-end'] = Ft(this, n, 'f')['display-end']);
      }
      get length() {
        return Ft(this, r, 'f');
      }
      set length(t) {
        Vt(this, r, t, 'f'), (this['display-end'] || 0) > Ft(this, r, 'f') && (this['display-end'] = this.length);
      }
    }
    return (
      (n = new WeakMap()),
      (r = new WeakMap()),
      Lt([Xt({ type: Number, reflect: !0 })], i.prototype, 'length', null),
      Lt([Xt({ type: Number, reflect: !0 })], i.prototype, 'display-start', void 0),
      Lt([Xt({ type: Number, reflect: !0 })], i.prototype, 'display-end', void 0),
      i
    );
  },
  Qt = '#FFFFFFDD',
  te = { 'margin-top': 0, 'margin-bottom': 0, 'margin-left': 10, 'margin-right': 10, 'margin-color': Qt },
  ee = (t, e = {}) => {
    var n, r;
    class i extends Gt(t) {
      constructor() {
        super(...arguments),
          n.set(this, { ...te, ...e }),
          (this['margin-top'] = Ft(this, n, 'f')['margin-top']),
          (this['margin-bottom'] = Ft(this, n, 'f')['margin-bottom']),
          (this['margin-left'] = Ft(this, n, 'f')['margin-left']),
          (this['margin-right'] = Ft(this, n, 'f')['margin-right']),
          (this['margin-color'] = Ft(this, n, 'f')['margin-color']),
          r.set(this, !1);
      }
      getWidthWithMargins() {
        return this.width ? this.width - this['margin-left'] - this['margin-right'] : 0;
      }
      getHeightWithMargins() {
        return this.height ? this.height - this['margin-top'] - this['margin-bottom'] : 0;
      }
      renderMarginOnGroup(t) {
        t &&
          ((Ft(this, r, 'f') && !t.select('rect').empty()) ||
            (t.append('rect').style('pointer-events', 'none').attr('class', 'margin-left').attr('x', 0),
            t.append('rect').style('pointer-events', 'none').attr('class', 'margin-right'),
            t.append('rect').style('pointer-events', 'none').attr('class', 'margin-top').attr('width', this.width).attr('x', 0).attr('y', 0),
            t.append('rect').style('pointer-events', 'none').attr('class', 'margin-bottom').attr('width', this.width).attr('x', 0),
            Vt(this, r, !0, 'f')),
          t
            .select('rect.margin-left')
            .attr('fill', this['margin-color'] || Qt)
            .attr('height', this.height)
            .attr('width', this['margin-left']),
          t
            .select('rect.margin-right')
            .attr('fill', this['margin-color'] || Qt)
            .attr('height', this.height)
            .attr('x', this.width - this['margin-right'])
            .attr('width', this['margin-right']),
          t
            .select('rect.margin-top')
            .attr('fill', this['margin-color'] || Qt)
            .attr('height', this['margin-top']),
          t
            .select('rect.margin-bottom')
            .attr('fill', this['margin-color'] || Qt)
            .attr('y', this.height - this['margin-bottom'])
            .attr('height', this['margin-bottom']));
      }
    }
    return (
      (n = new WeakMap()),
      (r = new WeakMap()),
      Lt([Xt({ type: Number })], i.prototype, 'margin-top', void 0),
      Lt([Xt({ type: Number })], i.prototype, 'margin-bottom', void 0),
      Lt([Xt({ type: Number })], i.prototype, 'margin-left', void 0),
      Lt([Xt({ type: Number })], i.prototype, 'margin-right', void 0),
      Lt([Xt({ type: String })], i.prototype, 'margin-color', void 0),
      i
    );
  },
  ne = { 'min-width': 10, 'min-height': 10 },
  re = (t, e = {}) => {
    var n, r;
    class i extends Gt(t) {
      constructor(...t) {
        super(...t),
          n.set(this, { ...ne, ...e }),
          r.set(this, void 0),
          (this['min-width'] = Ft(this, n, 'f')['min-width']),
          (this['min-height'] = Ft(this, n, 'f')['min-height']),
          (this.onResize = this.onResize.bind(this)),
          (this.listenForResize = this.listenForResize.bind(this));
      }
      useAvailableWidth() {
        null === this.getAttribute('width') && ((this.style.width = '100%'), (this.width = Math.max(this.offsetWidth, this['min-width'])));
      }
      useAvailableHeight() {
        null === this.getAttribute('height') && ((this.style.height = '100%'), (this.height = Math.max(this.offsetHeight, this['min-height'])));
      }
      onDimensionsChange() {}
      connectedCallback() {
        this.useAvailableWidth(), this.useAvailableHeight(), this.listenForResize(), super.connectedCallback();
      }
      disconnectedCallback() {
        Ft(this, r, 'f') && Ft(this, r, 'f').unobserve(this), super.disconnectedCallback();
      }
      onResize() {
        const t = this.width,
          e = this.height;
        this.useAvailableWidth(), this.useAvailableHeight(), (t === this.width && e === this.height) || this.onDimensionsChange();
      }
      listenForResize() {
        Vt(this, r, new ResizeObserver(this.onResize), 'f'), Ft(this, r, 'f').observe(this);
      }
    }
    return (
      (n = new WeakMap()),
      (r = new WeakMap()),
      Lt([Xt({ type: Number, reflect: !0 })], i.prototype, 'min-width', void 0),
      Lt([Xt({ type: Number, reflect: !0 })], i.prototype, 'min-height', void 0),
      i
    );
  },
  ie = (t) =>
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
let oe = class {
  constructor({ min: t = -1 / 0, max: e = 1 / 0 } = {}) {
    (this.segments = []), (this.max = e), (this.min = t), (this.regionString = null);
  }
  encode(t = !1) {
    return this.segments.map(({ start: e, end: n }) => (t ? `${e}:${n}` : `${e === this.min ? '' : e}:${n === this.max ? '' : n}`)).join(',');
  }
  decode(t) {
    void 0 !== t && (this.regionString = t),
      this.regionString
        ? (this.segments = this.regionString.split(',').map((t) => {
            const [e, n, r] = t.split(':');
            if (void 0 !== r) throw new Error(`there should be at most 1 ':' per region. Region: ${t}`);
            let i = e ? Number(e) : this.min,
              o = n ? Number(n) : this.max;
            if ((i > o && ([i, o] = [o, i]), i < this.min && (i = this.min), o > this.max && (o = this.max), Number.isNaN(i)))
              throw new Error(`The parsed value of ${e} is NaN. Region: ${t}`);
            if (Number.isNaN(o)) throw new Error(`The parsed value of ${n} is NaN. Region: ${t}`);
            return { start: i, end: o };
          }))
        : (this.segments = []);
  }
};
const ae = (t, e) => (t ? (e ? `${t},${e}` : t) : e),
  se = { highlight: null, 'highlight-color': '#FFEB3B66' },
  ue = (t, e = {}) => {
    var n, r;
    class i extends t {
      constructor(...t) {
        super(...t),
          n.set(this, { ...se, ...e }),
          (this.highlight = Ft(this, n, 'f').highlight),
          (this['highlight-color'] = Ft(this, n, 'f')['highlight-color']),
          r.set(this, void 0),
          (this.highlightedRegion = new oe({ min: 1 })),
          Vt(this, r, null, 'f');
      }
      set fixedHighlight(t) {
        Vt(this, r, t, 'f'), this.highlightedRegion.decode(ae(this.highlight || '', Ft(this, r, 'f') || '')), this.updateHighlight();
      }
      attributeChangedCallback(t, e, n) {
        super.attributeChangedCallback(t, e, n),
          'null' === n && (n = null),
          e !== n &&
            ('length' === t && (this.highlightedRegion.max = Number(n)), 'highlight' === t && this.highlightedRegion.decode(ae(n || '', Ft(this, r, 'f') || '')));
      }
      updateHighlight() {}
    }
    return (
      (n = new WeakMap()),
      (r = new WeakMap()),
      Lt([Xt({ type: String, reflect: !0 })], i.prototype, 'highlight', void 0),
      Lt([Xt({ type: String, reflect: !0 })], i.prototype, 'highlight-color', void 0),
      i
    );
  };
function ce(t, e) {
  return null == t || null == e ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function le(t, e) {
  return null == t || null == e ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function fe(t) {
  let e, n, r;
  function i(t, r, i = 0, o = t.length) {
    if (i < o) {
      if (0 !== e(r, r)) return o;
      do {
        const e = (i + o) >>> 1;
        n(t[e], r) < 0 ? (i = e + 1) : (o = e);
      } while (i < o);
    }
    return i;
  }
  return (
    2 !== t.length ? ((e = ce), (n = (e, n) => ce(t(e), n)), (r = (e, n) => t(e) - n)) : ((e = t === ce || t === le ? t : he), (n = t), (r = t)),
    {
      left: i,
      center: function (t, e, n = 0, o = t.length) {
        const a = i(t, e, n, o - 1);
        return a > n && r(t[a - 1], e) > -r(t[a], e) ? a - 1 : a;
      },
      right: function (t, r, i = 0, o = t.length) {
        if (i < o) {
          if (0 !== e(r, r)) return o;
          do {
            const e = (i + o) >>> 1;
            n(t[e], r) <= 0 ? (i = e + 1) : (o = e);
          } while (i < o);
        }
        return i;
      },
    }
  );
}
function he() {
  return 0;
}
const de = fe(ce).right;
fe(function (t) {
  return null === t ? NaN : +t;
}).center;
var pe = de;
const ve = Math.sqrt(50),
  me = Math.sqrt(10),
  ge = Math.sqrt(2);
function ye(t, e, n) {
  const r = (e - t) / Math.max(0, n),
    i = Math.floor(Math.log10(r)),
    o = r / Math.pow(10, i),
    a = o >= ve ? 10 : o >= me ? 5 : o >= ge ? 2 : 1;
  let s, u, c;
  return (
    i < 0
      ? ((c = Math.pow(10, -i) / a), (s = Math.round(t * c)), (u = Math.round(e * c)), s / c < t && ++s, u / c > e && --u, (c = -c))
      : ((c = Math.pow(10, i) * a), (s = Math.round(t / c)), (u = Math.round(e / c)), s * c < t && ++s, u * c > e && --u),
    u < s && 0.5 <= n && n < 2 ? ye(t, e, 2 * n) : [s, u, c]
  );
}
function be(t, e, n) {
  return ye((t = +t), (e = +e), (n = +n))[2];
}
var _e = { value: () => {} };
function we() {
  for (var t, e = 0, n = arguments.length, r = {}; e < n; ++e) {
    if (!(t = arguments[e] + '') || t in r || /[\s.]/.test(t)) throw new Error('illegal type: ' + t);
    r[t] = [];
  }
  return new xe(r);
}
function xe(t) {
  this._ = t;
}
function Ae(t, e) {
  for (var n, r = 0, i = t.length; r < i; ++r) if ((n = t[r]).name === e) return n.value;
}
function Me(t, e, n) {
  for (var r = 0, i = t.length; r < i; ++r)
    if (t[r].name === e) {
      (t[r] = _e), (t = t.slice(0, r).concat(t.slice(r + 1)));
      break;
    }
  return null != n && t.push({ name: e, value: n }), t;
}
xe.prototype = we.prototype = {
  constructor: xe,
  on: function (t, e) {
    var n,
      r,
      i = this._,
      o =
        ((r = i),
        (t + '')
          .trim()
          .split(/^|\s+/)
          .map(function (t) {
            var e = '',
              n = t.indexOf('.');
            if ((n >= 0 && ((e = t.slice(n + 1)), (t = t.slice(0, n))), t && !r.hasOwnProperty(t))) throw new Error('unknown type: ' + t);
            return { type: t, name: e };
          })),
      a = -1,
      s = o.length;
    if (!(arguments.length < 2)) {
      if (null != e && 'function' != typeof e) throw new Error('invalid callback: ' + e);
      for (; ++a < s; )
        if ((n = (t = o[a]).type)) i[n] = Me(i[n], t.name, e);
        else if (null == e) for (n in i) i[n] = Me(i[n], t.name, null);
      return this;
    }
    for (; ++a < s; ) if ((n = (t = o[a]).type) && (n = Ae(i[n], t.name))) return n;
  },
  copy: function () {
    var t = {},
      e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new xe(t);
  },
  call: function (t, e) {
    if ((n = arguments.length - 2) > 0) for (var n, r, i = new Array(n), o = 0; o < n; ++o) i[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (o = 0, n = (r = this._[t]).length; o < n; ++o) r[o].value.apply(e, i);
  },
  apply: function (t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (var r = this._[t], i = 0, o = r.length; i < o; ++i) r[i].value.apply(e, n);
  },
};
var $e = 'http://www.w3.org/1999/xhtml',
  Ee = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: $e,
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
  };
function Se(t) {
  var e = (t += ''),
    n = e.indexOf(':');
  return n >= 0 && 'xmlns' !== (e = t.slice(0, n)) && (t = t.slice(n + 1)), Ee.hasOwnProperty(e) ? { space: Ee[e], local: t } : t;
}
function Ce(t) {
  return function () {
    var e = this.ownerDocument,
      n = this.namespaceURI;
    return n === $e && e.documentElement.namespaceURI === $e ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function ke(t) {
  return function () {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Te(t) {
  var e = Se(t);
  return (e.local ? ke : Ce)(e);
}
function Ne() {}
function Pe(t) {
  return null == t
    ? Ne
    : function () {
        return this.querySelector(t);
      };
}
function De() {
  return [];
}
function Oe(t) {
  return null == t
    ? De
    : function () {
        return this.querySelectorAll(t);
      };
}
function ze(t) {
  return function () {
    return this.matches(t);
  };
}
function Re(t) {
  return function (e) {
    return e.matches(t);
  };
}
var Ie = Array.prototype.find;
function je() {
  return this.firstElementChild;
}
var Ue = Array.prototype.filter;
function Be() {
  return Array.from(this.children);
}
function He(t) {
  return new Array(t.length);
}
function qe(t, e) {
  (this.ownerDocument = t.ownerDocument), (this.namespaceURI = t.namespaceURI), (this._next = null), (this._parent = t), (this.__data__ = e);
}
function We(t, e, n, r, i, o) {
  for (var a, s = 0, u = e.length, c = o.length; s < c; ++s) (a = e[s]) ? ((a.__data__ = o[s]), (r[s] = a)) : (n[s] = new qe(t, o[s]));
  for (; s < u; ++s) (a = e[s]) && (i[s] = a);
}
function Le(t, e, n, r, i, o, a) {
  var s,
    u,
    c,
    l = new Map(),
    f = e.length,
    h = o.length,
    d = new Array(f);
  for (s = 0; s < f; ++s) (u = e[s]) && ((d[s] = c = a.call(u, u.__data__, s, e) + ''), l.has(c) ? (i[s] = u) : l.set(c, u));
  for (s = 0; s < h; ++s) (c = a.call(t, o[s], s, o) + ''), (u = l.get(c)) ? ((r[s] = u), (u.__data__ = o[s]), l.delete(c)) : (n[s] = new qe(t, o[s]));
  for (s = 0; s < f; ++s) (u = e[s]) && l.get(d[s]) === u && (i[s] = u);
}
function Fe(t) {
  return t.__data__;
}
function Ve(t) {
  return 'object' == typeof t && 'length' in t ? t : Array.from(t);
}
function Ye(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Xe(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function Ze(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Ge(t, e) {
  return function () {
    this.setAttribute(t, e);
  };
}
function Ke(t, e) {
  return function () {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function Je(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function Qe(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function tn(t) {
  return (t.ownerDocument && t.ownerDocument.defaultView) || (t.document && t) || t.defaultView;
}
function en(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
function nn(t, e, n) {
  return function () {
    this.style.setProperty(t, e, n);
  };
}
function rn(t, e, n) {
  return function () {
    var r = e.apply(this, arguments);
    null == r ? this.style.removeProperty(t) : this.style.setProperty(t, r, n);
  };
}
function on(t, e) {
  return t.style.getPropertyValue(e) || tn(t).getComputedStyle(t, null).getPropertyValue(e);
}
function an(t) {
  return function () {
    delete this[t];
  };
}
function sn(t, e) {
  return function () {
    this[t] = e;
  };
}
function un(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? delete this[t] : (this[t] = n);
  };
}
function cn(t) {
  return t.trim().split(/^|\s+/);
}
function ln(t) {
  return t.classList || new fn(t);
}
function fn(t) {
  (this._node = t), (this._names = cn(t.getAttribute('class') || ''));
}
function hn(t, e) {
  for (var n = ln(t), r = -1, i = e.length; ++r < i; ) n.add(e[r]);
}
function dn(t, e) {
  for (var n = ln(t), r = -1, i = e.length; ++r < i; ) n.remove(e[r]);
}
function pn(t) {
  return function () {
    hn(this, t);
  };
}
function vn(t) {
  return function () {
    dn(this, t);
  };
}
function mn(t, e) {
  return function () {
    (e.apply(this, arguments) ? hn : dn)(this, t);
  };
}
function gn() {
  this.textContent = '';
}
function yn(t) {
  return function () {
    this.textContent = t;
  };
}
function bn(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.textContent = e ?? '';
  };
}
function _n() {
  this.innerHTML = '';
}
function wn(t) {
  return function () {
    this.innerHTML = t;
  };
}
function xn(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? '';
  };
}
function An() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Mn() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function $n() {
  return null;
}
function En() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Sn() {
  var t = this.cloneNode(!1),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Cn() {
  var t = this.cloneNode(!0),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function kn(t) {
  return function () {
    var e = this.__on;
    if (e) {
      for (var n, r = 0, i = -1, o = e.length; r < o; ++r)
        (n = e[r]), (t.type && n.type !== t.type) || n.name !== t.name ? (e[++i] = n) : this.removeEventListener(n.type, n.listener, n.options);
      ++i ? (e.length = i) : delete this.__on;
    }
  };
}
function Tn(t, e, n) {
  return function () {
    var r,
      i = this.__on,
      o = (function (t) {
        return function (e) {
          t.call(this, e, this.__data__);
        };
      })(e);
    if (i)
      for (var a = 0, s = i.length; a < s; ++a)
        if ((r = i[a]).type === t.type && r.name === t.name)
          return this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, (r.listener = o), (r.options = n)), void (r.value = e);
    this.addEventListener(t.type, o, n), (r = { type: t.type, name: t.name, value: e, listener: o, options: n }), i ? i.push(r) : (this.__on = [r]);
  };
}
function Nn(t, e, n) {
  var r = tn(t),
    i = r.CustomEvent;
  'function' == typeof i
    ? (i = new i(e, n))
    : ((i = r.document.createEvent('Event')), n ? (i.initEvent(e, n.bubbles, n.cancelable), (i.detail = n.detail)) : i.initEvent(e, !1, !1)),
    t.dispatchEvent(i);
}
function Pn(t, e) {
  return function () {
    return Nn(this, t, e);
  };
}
function Dn(t, e) {
  return function () {
    return Nn(this, t, e.apply(this, arguments));
  };
}
(qe.prototype = {
  constructor: qe,
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
  (fn.prototype = {
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
var On = [null];
function zn(t, e) {
  (this._groups = t), (this._parents = e);
}
function Rn() {
  return new zn([[document.documentElement]], On);
}
function In(t) {
  return 'string' == typeof t ? new zn([[document.querySelector(t)]], [document.documentElement]) : new zn([[t]], On);
}
function jn(t, e) {
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
      var r = n.createSVGPoint();
      return (r.x = t.clientX), (r.y = t.clientY), [(r = r.matrixTransform(e.getScreenCTM().inverse())).x, r.y];
    }
    if (e.getBoundingClientRect) {
      var i = e.getBoundingClientRect();
      return [t.clientX - i.left - e.clientLeft, t.clientY - i.top - e.clientTop];
    }
  }
  return [t.pageX, t.pageY];
}
zn.prototype = Rn.prototype = {
  constructor: zn,
  select: function (t) {
    'function' != typeof t && (t = Pe(t));
    for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
      for (var o, a, s = e[i], u = s.length, c = (r[i] = new Array(u)), l = 0; l < u; ++l)
        (o = s[l]) && (a = t.call(o, o.__data__, l, s)) && ('__data__' in o && (a.__data__ = o.__data__), (c[l] = a));
    return new zn(r, this._parents);
  },
  selectAll: function (t) {
    t =
      'function' == typeof t
        ? (function (t) {
            return function () {
              return null == (e = t.apply(this, arguments)) ? [] : Array.isArray(e) ? e : Array.from(e);
              var e;
            };
          })(t)
        : Oe(t);
    for (var e = this._groups, n = e.length, r = [], i = [], o = 0; o < n; ++o)
      for (var a, s = e[o], u = s.length, c = 0; c < u; ++c) (a = s[c]) && (r.push(t.call(a, a.__data__, c, s)), i.push(a));
    return new zn(r, i);
  },
  selectChild: function (t) {
    return this.select(
      null == t
        ? je
        : (function (t) {
            return function () {
              return Ie.call(this.children, t);
            };
          })('function' == typeof t ? t : Re(t))
    );
  },
  selectChildren: function (t) {
    return this.selectAll(
      null == t
        ? Be
        : (function (t) {
            return function () {
              return Ue.call(this.children, t);
            };
          })('function' == typeof t ? t : Re(t))
    );
  },
  filter: function (t) {
    'function' != typeof t && (t = ze(t));
    for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
      for (var o, a = e[i], s = a.length, u = (r[i] = []), c = 0; c < s; ++c) (o = a[c]) && t.call(o, o.__data__, c, a) && u.push(o);
    return new zn(r, this._parents);
  },
  data: function (t, e) {
    if (!arguments.length) return Array.from(this, Fe);
    var n,
      r = e ? Le : We,
      i = this._parents,
      o = this._groups;
    'function' != typeof t &&
      ((n = t),
      (t = function () {
        return n;
      }));
    for (var a = o.length, s = new Array(a), u = new Array(a), c = new Array(a), l = 0; l < a; ++l) {
      var f = i[l],
        h = o[l],
        d = h.length,
        p = Ve(t.call(f, f && f.__data__, l, i)),
        v = p.length,
        m = (u[l] = new Array(v)),
        g = (s[l] = new Array(v));
      r(f, h, m, g, (c[l] = new Array(d)), p, e);
      for (var y, b, _ = 0, w = 0; _ < v; ++_)
        if ((y = m[_])) {
          for (_ >= w && (w = _ + 1); !(b = g[w]) && ++w < v; );
          y._next = b || null;
        }
    }
    return ((s = new zn(s, i))._enter = u), (s._exit = c), s;
  },
  enter: function () {
    return new zn(this._enter || this._groups.map(He), this._parents);
  },
  exit: function () {
    return new zn(this._exit || this._groups.map(He), this._parents);
  },
  join: function (t, e, n) {
    var r = this.enter(),
      i = this,
      o = this.exit();
    return (
      'function' == typeof t ? (r = t(r)) && (r = r.selection()) : (r = r.append(t + '')),
      null != e && (i = e(i)) && (i = i.selection()),
      null == n ? o.remove() : n(o),
      r && i ? r.merge(i).order() : i
    );
  },
  merge: function (t) {
    for (
      var e = t.selection ? t.selection() : t, n = this._groups, r = e._groups, i = n.length, o = r.length, a = Math.min(i, o), s = new Array(i), u = 0;
      u < a;
      ++u
    )
      for (var c, l = n[u], f = r[u], h = l.length, d = (s[u] = new Array(h)), p = 0; p < h; ++p) (c = l[p] || f[p]) && (d[p] = c);
    for (; u < i; ++u) s[u] = n[u];
    return new zn(s, this._parents);
  },
  selection: function () {
    return this;
  },
  order: function () {
    for (var t = this._groups, e = -1, n = t.length; ++e < n; )
      for (var r, i = t[e], o = i.length - 1, a = i[o]; --o >= 0; ) (r = i[o]) && (a && 4 ^ r.compareDocumentPosition(a) && a.parentNode.insertBefore(r, a), (a = r));
    return this;
  },
  sort: function (t) {
    function e(e, n) {
      return e && n ? t(e.__data__, n.__data__) : !e - !n;
    }
    t || (t = Ye);
    for (var n = this._groups, r = n.length, i = new Array(r), o = 0; o < r; ++o) {
      for (var a, s = n[o], u = s.length, c = (i[o] = new Array(u)), l = 0; l < u; ++l) (a = s[l]) && (c[l] = a);
      c.sort(e);
    }
    return new zn(i, this._parents).order();
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
      for (var r = t[e], i = 0, o = r.length; i < o; ++i) {
        var a = r[i];
        if (a) return a;
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
    for (var e = this._groups, n = 0, r = e.length; n < r; ++n) for (var i, o = e[n], a = 0, s = o.length; a < s; ++a) (i = o[a]) && t.call(i, i.__data__, a, o);
    return this;
  },
  attr: function (t, e) {
    var n = Se(t);
    if (arguments.length < 2) {
      var r = this.node();
      return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
    }
    return this.each((null == e ? (n.local ? Ze : Xe) : 'function' == typeof e ? (n.local ? Qe : Je) : n.local ? Ke : Ge)(n, e));
  },
  style: function (t, e, n) {
    return arguments.length > 1 ? this.each((null == e ? en : 'function' == typeof e ? rn : nn)(t, e, n ?? '')) : on(this.node(), t);
  },
  property: function (t, e) {
    return arguments.length > 1 ? this.each((null == e ? an : 'function' == typeof e ? un : sn)(t, e)) : this.node()[t];
  },
  classed: function (t, e) {
    var n = cn(t + '');
    if (arguments.length < 2) {
      for (var r = ln(this.node()), i = -1, o = n.length; ++i < o; ) if (!r.contains(n[i])) return !1;
      return !0;
    }
    return this.each(('function' == typeof e ? mn : e ? pn : vn)(n, e));
  },
  text: function (t) {
    return arguments.length ? this.each(null == t ? gn : ('function' == typeof t ? bn : yn)(t)) : this.node().textContent;
  },
  html: function (t) {
    return arguments.length ? this.each(null == t ? _n : ('function' == typeof t ? xn : wn)(t)) : this.node().innerHTML;
  },
  raise: function () {
    return this.each(An);
  },
  lower: function () {
    return this.each(Mn);
  },
  append: function (t) {
    var e = 'function' == typeof t ? t : Te(t);
    return this.select(function () {
      return this.appendChild(e.apply(this, arguments));
    });
  },
  insert: function (t, e) {
    var n = 'function' == typeof t ? t : Te(t),
      r = null == e ? $n : 'function' == typeof e ? e : Pe(e);
    return this.select(function () {
      return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
    });
  },
  remove: function () {
    return this.each(En);
  },
  clone: function (t) {
    return this.select(t ? Cn : Sn);
  },
  datum: function (t) {
    return arguments.length ? this.property('__data__', t) : this.node().__data__;
  },
  on: function (t, e, n) {
    var r,
      i,
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
      a = o.length;
    if (!(arguments.length < 2)) {
      for (s = e ? Tn : kn, r = 0; r < a; ++r) this.each(s(o[r], e, n));
      return this;
    }
    var s = this.node().__on;
    if (s) for (var u, c = 0, l = s.length; c < l; ++c) for (r = 0, u = s[c]; r < a; ++r) if ((i = o[r]).type === u.type && i.name === u.name) return u.value;
  },
  dispatch: function (t, e) {
    return this.each(('function' == typeof e ? Dn : Pn)(t, e));
  },
  [Symbol.iterator]: function* () {
    for (var t = this._groups, e = 0, n = t.length; e < n; ++e) for (var r, i = t[e], o = 0, a = i.length; o < a; ++o) (r = i[o]) && (yield r);
  },
};
const Un = { capture: !0, passive: !1 };
function Bn(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Hn(t, e, n) {
  (t.prototype = e.prototype = n), (n.constructor = t);
}
function qn(t, e) {
  var n = Object.create(t.prototype);
  for (var r in e) n[r] = e[r];
  return n;
}
function Wn() {}
var Ln = 0.7,
  Fn = 1 / Ln,
  Vn = '\\s*([+-]?\\d+)\\s*',
  Yn = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*',
  Xn = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
  Zn = /^#([0-9a-f]{3,8})$/,
  Gn = new RegExp(`^rgb\\(${Vn},${Vn},${Vn}\\)$`),
  Kn = new RegExp(`^rgb\\(${Xn},${Xn},${Xn}\\)$`),
  Jn = new RegExp(`^rgba\\(${Vn},${Vn},${Vn},${Yn}\\)$`),
  Qn = new RegExp(`^rgba\\(${Xn},${Xn},${Xn},${Yn}\\)$`),
  tr = new RegExp(`^hsl\\(${Yn},${Xn},${Xn}\\)$`),
  er = new RegExp(`^hsla\\(${Yn},${Xn},${Xn},${Yn}\\)$`),
  nr = {
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
function rr() {
  return this.rgb().formatHex();
}
function ir() {
  return this.rgb().formatRgb();
}
function or(t) {
  var e, n;
  return (
    (t = (t + '').trim().toLowerCase()),
    (e = Zn.exec(t))
      ? ((n = e[1].length),
        (e = parseInt(e[1], 16)),
        6 === n
          ? ar(e)
          : 3 === n
          ? new cr(((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), ((15 & e) << 4) | (15 & e), 1)
          : 8 === n
          ? sr((e >> 24) & 255, (e >> 16) & 255, (e >> 8) & 255, (255 & e) / 255)
          : 4 === n
          ? sr(((e >> 12) & 15) | ((e >> 8) & 240), ((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), (((15 & e) << 4) | (15 & e)) / 255)
          : null)
      : (e = Gn.exec(t))
      ? new cr(e[1], e[2], e[3], 1)
      : (e = Kn.exec(t))
      ? new cr((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, 1)
      : (e = Jn.exec(t))
      ? sr(e[1], e[2], e[3], e[4])
      : (e = Qn.exec(t))
      ? sr((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, e[4])
      : (e = tr.exec(t))
      ? vr(e[1], e[2] / 100, e[3] / 100, 1)
      : (e = er.exec(t))
      ? vr(e[1], e[2] / 100, e[3] / 100, e[4])
      : nr.hasOwnProperty(t)
      ? ar(nr[t])
      : 'transparent' === t
      ? new cr(NaN, NaN, NaN, 0)
      : null
  );
}
function ar(t) {
  return new cr((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1);
}
function sr(t, e, n, r) {
  return r <= 0 && (t = e = n = NaN), new cr(t, e, n, r);
}
function ur(t, e, n, r) {
  return 1 === arguments.length
    ? (function (t) {
        return t instanceof Wn || (t = or(t)), t ? new cr((t = t.rgb()).r, t.g, t.b, t.opacity) : new cr();
      })(t)
    : new cr(t, e, n, r ?? 1);
}
function cr(t, e, n, r) {
  (this.r = +t), (this.g = +e), (this.b = +n), (this.opacity = +r);
}
function lr() {
  return `#${pr(this.r)}${pr(this.g)}${pr(this.b)}`;
}
function fr() {
  const t = hr(this.opacity);
  return `${1 === t ? 'rgb(' : 'rgba('}${dr(this.r)}, ${dr(this.g)}, ${dr(this.b)}${1 === t ? ')' : `, ${t})`}`;
}
function hr(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function dr(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function pr(t) {
  return ((t = dr(t)) < 16 ? '0' : '') + t.toString(16);
}
function vr(t, e, n, r) {
  return r <= 0 ? (t = e = n = NaN) : n <= 0 || n >= 1 ? (t = e = NaN) : e <= 0 && (t = NaN), new gr(t, e, n, r);
}
function mr(t) {
  if (t instanceof gr) return new gr(t.h, t.s, t.l, t.opacity);
  if ((t instanceof Wn || (t = or(t)), !t)) return new gr();
  if (t instanceof gr) return t;
  var e = (t = t.rgb()).r / 255,
    n = t.g / 255,
    r = t.b / 255,
    i = Math.min(e, n, r),
    o = Math.max(e, n, r),
    a = NaN,
    s = o - i,
    u = (o + i) / 2;
  return (
    s
      ? ((a = e === o ? (n - r) / s + 6 * (n < r) : n === o ? (r - e) / s + 2 : (e - n) / s + 4), (s /= u < 0.5 ? o + i : 2 - o - i), (a *= 60))
      : (s = u > 0 && u < 1 ? 0 : a),
    new gr(a, s, u, t.opacity)
  );
}
function gr(t, e, n, r) {
  (this.h = +t), (this.s = +e), (this.l = +n), (this.opacity = +r);
}
function yr(t) {
  return (t = (t || 0) % 360) < 0 ? t + 360 : t;
}
function br(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function _r(t, e, n) {
  return 255 * (t < 60 ? e + ((n - e) * t) / 60 : t < 180 ? n : t < 240 ? e + ((n - e) * (240 - t)) / 60 : e);
}
Hn(Wn, or, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: rr,
  formatHex: rr,
  formatHex8: function () {
    return this.rgb().formatHex8();
  },
  formatHsl: function () {
    return mr(this).formatHsl();
  },
  formatRgb: ir,
  toString: ir,
}),
  Hn(
    cr,
    ur,
    qn(Wn, {
      brighter(t) {
        return (t = null == t ? Fn : Math.pow(Fn, t)), new cr(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? Ln : Math.pow(Ln, t)), new cr(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new cr(dr(this.r), dr(this.g), dr(this.b), hr(this.opacity));
      },
      displayable() {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
      },
      hex: lr,
      formatHex: lr,
      formatHex8: function () {
        return `#${pr(this.r)}${pr(this.g)}${pr(this.b)}${pr(255 * (isNaN(this.opacity) ? 1 : this.opacity))}`;
      },
      formatRgb: fr,
      toString: fr,
    })
  ),
  Hn(
    gr,
    function (t, e, n, r) {
      return 1 === arguments.length ? mr(t) : new gr(t, e, n, r ?? 1);
    },
    qn(Wn, {
      brighter(t) {
        return (t = null == t ? Fn : Math.pow(Fn, t)), new gr(this.h, this.s, this.l * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? Ln : Math.pow(Ln, t)), new gr(this.h, this.s, this.l * t, this.opacity);
      },
      rgb() {
        var t = (this.h % 360) + 360 * (this.h < 0),
          e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
          n = this.l,
          r = n + (n < 0.5 ? n : 1 - n) * e,
          i = 2 * n - r;
        return new cr(_r(t >= 240 ? t - 240 : t + 120, i, r), _r(t, i, r), _r(t < 120 ? t + 240 : t - 120, i, r), this.opacity);
      },
      clamp() {
        return new gr(yr(this.h), br(this.s), br(this.l), hr(this.opacity));
      },
      displayable() {
        return ((0 <= this.s && this.s <= 1) || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
      },
      formatHsl() {
        const t = hr(this.opacity);
        return `${1 === t ? 'hsl(' : 'hsla('}${yr(this.h)}, ${100 * br(this.s)}%, ${100 * br(this.l)}%${1 === t ? ')' : `, ${t})`}`;
      },
    })
  );
var wr = (t) => () => t;
function xr(t, e) {
  var n = e - t;
  return n
    ? (function (t, e) {
        return function (n) {
          return t + n * e;
        };
      })(t, n)
    : wr(isNaN(t) ? e : t);
}
var Ar = (function t(e) {
  var n = (function (t) {
    return 1 == (t = +t)
      ? xr
      : function (e, n) {
          return n - e
            ? (function (t, e, n) {
                return (
                  (t = Math.pow(t, n)),
                  (e = Math.pow(e, n) - t),
                  (n = 1 / n),
                  function (r) {
                    return Math.pow(t + r * e, n);
                  }
                );
              })(e, n, t)
            : wr(isNaN(e) ? n : e);
        };
  })(e);
  function r(t, e) {
    var r = n((t = ur(t)).r, (e = ur(e)).r),
      i = n(t.g, e.g),
      o = n(t.b, e.b),
      a = xr(t.opacity, e.opacity);
    return function (e) {
      return (t.r = r(e)), (t.g = i(e)), (t.b = o(e)), (t.opacity = a(e)), t + '';
    };
  }
  return (r.gamma = t), r;
})(1);
function Mr(t, e) {
  e || (e = []);
  var n,
    r = t ? Math.min(e.length, t.length) : 0,
    i = e.slice();
  return function (o) {
    for (n = 0; n < r; ++n) i[n] = t[n] * (1 - o) + e[n] * o;
    return i;
  };
}
function $r(t, e) {
  var n,
    r = e ? e.length : 0,
    i = t ? Math.min(r, t.length) : 0,
    o = new Array(i),
    a = new Array(r);
  for (n = 0; n < i; ++n) o[n] = Pr(t[n], e[n]);
  for (; n < r; ++n) a[n] = e[n];
  return function (t) {
    for (n = 0; n < i; ++n) a[n] = o[n](t);
    return a;
  };
}
function Er(t, e) {
  var n = new Date();
  return (
    (t = +t),
    (e = +e),
    function (r) {
      return n.setTime(t * (1 - r) + e * r), n;
    }
  );
}
function Sr(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return t * (1 - n) + e * n;
    }
  );
}
function Cr(t, e) {
  var n,
    r = {},
    i = {};
  for (n in ((null !== t && 'object' == typeof t) || (t = {}), (null !== e && 'object' == typeof e) || (e = {}), e)) n in t ? (r[n] = Pr(t[n], e[n])) : (i[n] = e[n]);
  return function (t) {
    for (n in r) i[n] = r[n](t);
    return i;
  };
}
var kr = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  Tr = new RegExp(kr.source, 'g');
function Nr(t, e) {
  var n,
    r,
    i,
    o = (kr.lastIndex = Tr.lastIndex = 0),
    a = -1,
    s = [],
    u = [];
  for (t += '', e += ''; (n = kr.exec(t)) && (r = Tr.exec(e)); )
    (i = r.index) > o && ((i = e.slice(o, i)), s[a] ? (s[a] += i) : (s[++a] = i)),
      (n = n[0]) === (r = r[0]) ? (s[a] ? (s[a] += r) : (s[++a] = r)) : ((s[++a] = null), u.push({ i: a, x: Sr(n, r) })),
      (o = Tr.lastIndex);
  return (
    o < e.length && ((i = e.slice(o)), s[a] ? (s[a] += i) : (s[++a] = i)),
    s.length < 2
      ? u[0]
        ? (function (t) {
            return function (e) {
              return t(e) + '';
            };
          })(u[0].x)
        : (function (t) {
            return function () {
              return t;
            };
          })(e)
      : ((e = u.length),
        function (t) {
          for (var n, r = 0; r < e; ++r) s[(n = u[r]).i] = n.x(t);
          return s.join('');
        })
  );
}
function Pr(t, e) {
  var n,
    r,
    i = typeof e;
  return null == e || 'boolean' === i
    ? wr(e)
    : ('number' === i
        ? Sr
        : 'string' === i
        ? (n = or(e))
          ? ((e = n), Ar)
          : Nr
        : e instanceof or
        ? Ar
        : e instanceof Date
        ? Er
        : ((r = e),
          !ArrayBuffer.isView(r) || r instanceof DataView
            ? Array.isArray(e)
              ? $r
              : ('function' != typeof e.valueOf && 'function' != typeof e.toString) || isNaN(e)
              ? Cr
              : Sr
            : Mr))(t, e);
}
function Dr(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return Math.round(t * (1 - n) + e * n);
    }
  );
}
var Or,
  zr = 180 / Math.PI,
  Rr = { translateX: 0, translateY: 0, rotate: 0, skewX: 0, scaleX: 1, scaleY: 1 };
function Ir(t, e, n, r, i, o) {
  var a, s, u;
  return (
    (a = Math.sqrt(t * t + e * e)) && ((t /= a), (e /= a)),
    (u = t * n + e * r) && ((n -= t * u), (r -= e * u)),
    (s = Math.sqrt(n * n + r * r)) && ((n /= s), (r /= s), (u /= s)),
    t * r < e * n && ((t = -t), (e = -e), (u = -u), (a = -a)),
    { translateX: i, translateY: o, rotate: Math.atan2(e, t) * zr, skewX: Math.atan(u) * zr, scaleX: a, scaleY: s }
  );
}
function jr(t, e, n, r) {
  function i(t) {
    return t.length ? t.pop() + ' ' : '';
  }
  return function (o, a) {
    var s = [],
      u = [];
    return (
      (o = t(o)),
      (a = t(a)),
      (function (t, r, i, o, a, s) {
        if (t !== i || r !== o) {
          var u = a.push('translate(', null, e, null, n);
          s.push({ i: u - 4, x: Sr(t, i) }, { i: u - 2, x: Sr(r, o) });
        } else (i || o) && a.push('translate(' + i + e + o + n);
      })(o.translateX, o.translateY, a.translateX, a.translateY, s, u),
      (function (t, e, n, o) {
        t !== e
          ? (t - e > 180 ? (e += 360) : e - t > 180 && (t += 360), o.push({ i: n.push(i(n) + 'rotate(', null, r) - 2, x: Sr(t, e) }))
          : e && n.push(i(n) + 'rotate(' + e + r);
      })(o.rotate, a.rotate, s, u),
      (function (t, e, n, o) {
        t !== e ? o.push({ i: n.push(i(n) + 'skewX(', null, r) - 2, x: Sr(t, e) }) : e && n.push(i(n) + 'skewX(' + e + r);
      })(o.skewX, a.skewX, s, u),
      (function (t, e, n, r, o, a) {
        if (t !== n || e !== r) {
          var s = o.push(i(o) + 'scale(', null, ',', null, ')');
          a.push({ i: s - 4, x: Sr(t, n) }, { i: s - 2, x: Sr(e, r) });
        } else (1 === n && 1 === r) || o.push(i(o) + 'scale(' + n + ',' + r + ')');
      })(o.scaleX, o.scaleY, a.scaleX, a.scaleY, s, u),
      (o = a = null),
      function (t) {
        for (var e, n = -1, r = u.length; ++n < r; ) s[(e = u[n]).i] = e.x(t);
        return s.join('');
      }
    );
  };
}
var Ur = jr(
    function (t) {
      const e = new ('function' == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(t + '');
      return e.isIdentity ? Rr : Ir(e.a, e.b, e.c, e.d, e.e, e.f);
    },
    'px, ',
    'px)',
    'deg)'
  ),
  Br = jr(
    function (t) {
      return null == t
        ? Rr
        : (Or || (Or = document.createElementNS('http://www.w3.org/2000/svg', 'g')),
          Or.setAttribute('transform', t),
          (t = Or.transform.baseVal.consolidate()) ? Ir((t = t.matrix).a, t.b, t.c, t.d, t.e, t.f) : Rr);
    },
    ', ',
    ')',
    ')'
  );
function Hr(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
var qr,
  Wr,
  Lr = (function t(e, n, r) {
    function i(t, i) {
      var o,
        a,
        s = t[0],
        u = t[1],
        c = t[2],
        l = i[0],
        f = i[1],
        h = i[2],
        d = l - s,
        p = f - u,
        v = d * d + p * p;
      if (v < 1e-12)
        (a = Math.log(h / c) / e),
          (o = function (t) {
            return [s + t * d, u + t * p, c * Math.exp(e * t * a)];
          });
      else {
        var m = Math.sqrt(v),
          g = (h * h - c * c + r * v) / (2 * c * n * m),
          y = (h * h - c * c - r * v) / (2 * h * n * m),
          b = Math.log(Math.sqrt(g * g + 1) - g),
          _ = Math.log(Math.sqrt(y * y + 1) - y);
        (a = (_ - b) / e),
          (o = function (t) {
            var r,
              i = t * a,
              o = Hr(b),
              l =
                (c / (n * m)) *
                (o * ((r = e * i + b), ((r = Math.exp(2 * r)) - 1) / (r + 1)) -
                  (function (t) {
                    return ((t = Math.exp(t)) - 1 / t) / 2;
                  })(b));
            return [s + l * d, u + l * p, (c * o) / Hr(e * i + b)];
          });
      }
      return (o.duration = (1e3 * a * e) / Math.SQRT2), o;
    }
    return (
      (i.rho = function (e) {
        var n = Math.max(0.001, +e),
          r = n * n;
        return t(n, r, r * r);
      }),
      i
    );
  })(Math.SQRT2, 2, 4),
  Fr = 0,
  Vr = 0,
  Yr = 0,
  Xr = 1e3,
  Zr = 0,
  Gr = 0,
  Kr = 0,
  Jr = 'object' == typeof performance && performance.now ? performance : Date,
  Qr =
    'object' == typeof window && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : function (t) {
          setTimeout(t, 17);
        };
function ti() {
  return Gr || (Qr(ei), (Gr = Jr.now() + Kr));
}
function ei() {
  Gr = 0;
}
function ni() {
  this._call = this._time = this._next = null;
}
function ri(t, e, n) {
  var r = new ni();
  return r.restart(t, e, n), r;
}
function ii() {
  (Gr = (Zr = Jr.now()) + Kr), (Fr = Vr = 0);
  try {
    !(function () {
      ti(), ++Fr;
      for (var t, e = qr; e; ) (t = Gr - e._time) >= 0 && e._call.call(void 0, t), (e = e._next);
      --Fr;
    })();
  } finally {
    (Fr = 0),
      (function () {
        for (var t, e, n = qr, r = 1 / 0; n; )
          n._call ? (r > n._time && (r = n._time), (t = n), (n = n._next)) : ((e = n._next), (n._next = null), (n = t ? (t._next = e) : (qr = e)));
        (Wr = t), ai(r);
      })(),
      (Gr = 0);
  }
}
function oi() {
  var t = Jr.now(),
    e = t - Zr;
  e > Xr && ((Kr -= e), (Zr = t));
}
function ai(t) {
  Fr ||
    (Vr && (Vr = clearTimeout(Vr)),
    t - Gr > 24
      ? (t < 1 / 0 && (Vr = setTimeout(ii, t - Jr.now() - Kr)), Yr && (Yr = clearInterval(Yr)))
      : (Yr || ((Zr = Jr.now()), (Yr = setInterval(oi, Xr))), (Fr = 1), Qr(ii)));
}
function si(t, e, n) {
  var r = new ni();
  return (
    (e = null == e ? 0 : +e),
    r.restart(
      (n) => {
        r.stop(), t(n + e);
      },
      e,
      n
    ),
    r
  );
}
ni.prototype = ri.prototype = {
  constructor: ni,
  restart: function (t, e, n) {
    if ('function' != typeof t) throw new TypeError('callback is not a function');
    (n = (null == n ? ti() : +n) + (null == e ? 0 : +e)),
      this._next || Wr === this || (Wr ? (Wr._next = this) : (qr = this), (Wr = this)),
      (this._call = t),
      (this._time = n),
      ai();
  },
  stop: function () {
    this._call && ((this._call = null), (this._time = 1 / 0), ai());
  },
};
var ui = we('start', 'end', 'cancel', 'interrupt'),
  ci = [],
  li = 0,
  fi = 2,
  hi = 3,
  di = 5,
  pi = 6;
function vi(t, e, n, r, i, o) {
  var a = t.__transition;
  if (a) {
    if (n in a) return;
  } else t.__transition = {};
  !(function (t, e, n) {
    var r,
      i = t.__transition;
    function o(u) {
      var c, l, f, h;
      if (1 !== n.state) return s();
      for (c in i)
        if ((h = i[c]).name === n.name) {
          if (h.state === hi) return si(o);
          4 === h.state
            ? ((h.state = pi), h.timer.stop(), h.on.call('interrupt', t, t.__data__, h.index, h.group), delete i[c])
            : +c < e && ((h.state = pi), h.timer.stop(), h.on.call('cancel', t, t.__data__, h.index, h.group), delete i[c]);
        }
      if (
        (si(function () {
          n.state === hi && ((n.state = 4), n.timer.restart(a, n.delay, n.time), a(u));
        }),
        (n.state = fi),
        n.on.call('start', t, t.__data__, n.index, n.group),
        n.state === fi)
      ) {
        for (n.state = hi, r = new Array((f = n.tween.length)), c = 0, l = -1; c < f; ++c)
          (h = n.tween[c].value.call(t, t.__data__, n.index, n.group)) && (r[++l] = h);
        r.length = l + 1;
      }
    }
    function a(e) {
      for (var i = e < n.duration ? n.ease.call(null, e / n.duration) : (n.timer.restart(s), (n.state = di), 1), o = -1, a = r.length; ++o < a; ) r[o].call(t, i);
      n.state === di && (n.on.call('end', t, t.__data__, n.index, n.group), s());
    }
    function s() {
      for (var r in ((n.state = pi), n.timer.stop(), delete i[e], i)) return;
      delete t.__transition;
    }
    (i[e] = n),
      (n.timer = ri(
        function (t) {
          (n.state = 1), n.timer.restart(o, n.delay, n.time), n.delay <= t && o(t - n.delay);
        },
        0,
        n.time
      ));
  })(t, n, { name: e, index: r, group: i, on: ui, tween: ci, time: o.time, delay: o.delay, duration: o.duration, ease: o.ease, timer: null, state: li });
}
function mi(t, e) {
  var n = yi(t, e);
  if (n.state > li) throw new Error('too late; already scheduled');
  return n;
}
function gi(t, e) {
  var n = yi(t, e);
  if (n.state > hi) throw new Error('too late; already running');
  return n;
}
function yi(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error('transition not found');
  return n;
}
function bi(t, e) {
  var n,
    r,
    i,
    o = t.__transition,
    a = !0;
  if (o) {
    for (i in ((e = null == e ? null : e + ''), o))
      (n = o[i]).name === e
        ? ((r = n.state > fi && n.state < di), (n.state = pi), n.timer.stop(), n.on.call(r ? 'interrupt' : 'cancel', t, t.__data__, n.index, n.group), delete o[i])
        : (a = !1);
    a && delete t.__transition;
  }
}
function _i(t, e) {
  var n, r;
  return function () {
    var i = gi(this, t),
      o = i.tween;
    if (o !== n)
      for (var a = 0, s = (r = n = o).length; a < s; ++a)
        if (r[a].name === e) {
          (r = r.slice()).splice(a, 1);
          break;
        }
    i.tween = r;
  };
}
function wi(t, e, n) {
  var r, i;
  if ('function' != typeof n) throw new Error();
  return function () {
    var o = gi(this, t),
      a = o.tween;
    if (a !== r) {
      i = (r = a).slice();
      for (var s = { name: e, value: n }, u = 0, c = i.length; u < c; ++u)
        if (i[u].name === e) {
          i[u] = s;
          break;
        }
      u === c && i.push(s);
    }
    o.tween = i;
  };
}
function xi(t, e, n) {
  var r = t._id;
  return (
    t.each(function () {
      var t = gi(this, r);
      (t.value || (t.value = {}))[e] = n.apply(this, arguments);
    }),
    function (t) {
      return yi(t, r).value[e];
    }
  );
}
function Ai(t, e) {
  var n;
  return ('number' == typeof e ? Sr : e instanceof or ? Ar : (n = or(e)) ? ((e = n), Ar) : Nr)(t, e);
}
function Mi(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function $i(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Ei(t, e, n) {
  var r,
    i,
    o = n + '';
  return function () {
    var a = this.getAttribute(t);
    return a === o ? null : a === r ? i : (i = e((r = a), n));
  };
}
function Si(t, e, n) {
  var r,
    i,
    o = n + '';
  return function () {
    var a = this.getAttributeNS(t.space, t.local);
    return a === o ? null : a === r ? i : (i = e((r = a), n));
  };
}
function Ci(t, e, n) {
  var r, i, o;
  return function () {
    var a,
      s,
      u = n(this);
    if (null != u) return (a = this.getAttribute(t)) === (s = u + '') ? null : a === r && s === i ? o : ((i = s), (o = e((r = a), u)));
    this.removeAttribute(t);
  };
}
function ki(t, e, n) {
  var r, i, o;
  return function () {
    var a,
      s,
      u = n(this);
    if (null != u) return (a = this.getAttributeNS(t.space, t.local)) === (s = u + '') ? null : a === r && s === i ? o : ((i = s), (o = e((r = a), u)));
    this.removeAttributeNS(t.space, t.local);
  };
}
function Ti(t, e) {
  var n, r;
  function i() {
    var i = e.apply(this, arguments);
    return (
      i !== r &&
        (n =
          (r = i) &&
          (function (t, e) {
            return function (n) {
              this.setAttributeNS(t.space, t.local, e.call(this, n));
            };
          })(t, i)),
      n
    );
  }
  return (i._value = e), i;
}
function Ni(t, e) {
  var n, r;
  function i() {
    var i = e.apply(this, arguments);
    return (
      i !== r &&
        (n =
          (r = i) &&
          (function (t, e) {
            return function (n) {
              this.setAttribute(t, e.call(this, n));
            };
          })(t, i)),
      n
    );
  }
  return (i._value = e), i;
}
function Pi(t, e) {
  return function () {
    mi(this, t).delay = +e.apply(this, arguments);
  };
}
function Di(t, e) {
  return (
    (e = +e),
    function () {
      mi(this, t).delay = e;
    }
  );
}
function Oi(t, e) {
  return function () {
    gi(this, t).duration = +e.apply(this, arguments);
  };
}
function zi(t, e) {
  return (
    (e = +e),
    function () {
      gi(this, t).duration = e;
    }
  );
}
var Ri = Rn.prototype.constructor;
function Ii(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
var ji = 0;
function Ui(t, e, n, r) {
  (this._groups = t), (this._parents = e), (this._name = n), (this._id = r);
}
function Bi() {
  return ++ji;
}
var Hi = Rn.prototype;
Ui.prototype = {
  constructor: Ui,
  select: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = Pe(t));
    for (var r = this._groups, i = r.length, o = new Array(i), a = 0; a < i; ++a)
      for (var s, u, c = r[a], l = c.length, f = (o[a] = new Array(l)), h = 0; h < l; ++h)
        (s = c[h]) && (u = t.call(s, s.__data__, h, c)) && ('__data__' in s && (u.__data__ = s.__data__), (f[h] = u), vi(f[h], e, n, h, f, yi(s, n)));
    return new Ui(o, this._parents, e, n);
  },
  selectAll: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = Oe(t));
    for (var r = this._groups, i = r.length, o = [], a = [], s = 0; s < i; ++s)
      for (var u, c = r[s], l = c.length, f = 0; f < l; ++f)
        if ((u = c[f])) {
          for (var h, d = t.call(u, u.__data__, f, c), p = yi(u, n), v = 0, m = d.length; v < m; ++v) (h = d[v]) && vi(h, e, n, v, d, p);
          o.push(d), a.push(u);
        }
    return new Ui(o, a, e, n);
  },
  selectChild: Hi.selectChild,
  selectChildren: Hi.selectChildren,
  filter: function (t) {
    'function' != typeof t && (t = ze(t));
    for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
      for (var o, a = e[i], s = a.length, u = (r[i] = []), c = 0; c < s; ++c) (o = a[c]) && t.call(o, o.__data__, c, a) && u.push(o);
    return new Ui(r, this._parents, this._name, this._id);
  },
  merge: function (t) {
    if (t._id !== this._id) throw new Error();
    for (var e = this._groups, n = t._groups, r = e.length, i = n.length, o = Math.min(r, i), a = new Array(r), s = 0; s < o; ++s)
      for (var u, c = e[s], l = n[s], f = c.length, h = (a[s] = new Array(f)), d = 0; d < f; ++d) (u = c[d] || l[d]) && (h[d] = u);
    for (; s < r; ++s) a[s] = e[s];
    return new Ui(a, this._parents, this._name, this._id);
  },
  selection: function () {
    return new Ri(this._groups, this._parents);
  },
  transition: function () {
    for (var t = this._name, e = this._id, n = Bi(), r = this._groups, i = r.length, o = 0; o < i; ++o)
      for (var a, s = r[o], u = s.length, c = 0; c < u; ++c)
        if ((a = s[c])) {
          var l = yi(a, e);
          vi(a, t, n, c, s, { time: l.time + l.delay + l.duration, delay: 0, duration: l.duration, ease: l.ease });
        }
    return new Ui(r, this._parents, t, n);
  },
  call: Hi.call,
  nodes: Hi.nodes,
  node: Hi.node,
  size: Hi.size,
  empty: Hi.empty,
  each: Hi.each,
  on: function (t, e) {
    var n = this._id;
    return arguments.length < 2
      ? yi(this.node(), n).on.on(t)
      : this.each(
          (function (t, e, n) {
            var r,
              i,
              o = (function (t) {
                return (t + '')
                  .trim()
                  .split(/^|\s+/)
                  .every(function (t) {
                    var e = t.indexOf('.');
                    return e >= 0 && (t = t.slice(0, e)), !t || 'start' === t;
                  });
              })(e)
                ? mi
                : gi;
            return function () {
              var a = o(this, t),
                s = a.on;
              s !== r && (i = (r = s).copy()).on(e, n), (a.on = i);
            };
          })(n, t, e)
        );
  },
  attr: function (t, e) {
    var n = Se(t),
      r = 'transform' === n ? Br : Ai;
    return this.attrTween(
      t,
      'function' == typeof e ? (n.local ? ki : Ci)(n, r, xi(this, 'attr.' + t, e)) : null == e ? (n.local ? $i : Mi)(n) : (n.local ? Si : Ei)(n, r, e)
    );
  },
  attrTween: function (t, e) {
    var n = 'attr.' + t;
    if (arguments.length < 2) return (n = this.tween(n)) && n._value;
    if (null == e) return this.tween(n, null);
    if ('function' != typeof e) throw new Error();
    var r = Se(t);
    return this.tween(n, (r.local ? Ti : Ni)(r, e));
  },
  style: function (t, e, n) {
    var r = 'transform' == (t += '') ? Ur : Ai;
    return null == e
      ? this.styleTween(
          t,
          (function (t, e) {
            var n, r, i;
            return function () {
              var o = on(this, t),
                a = (this.style.removeProperty(t), on(this, t));
              return o === a ? null : o === n && a === r ? i : (i = e((n = o), (r = a)));
            };
          })(t, r)
        ).on('end.style.' + t, Ii(t))
      : 'function' == typeof e
      ? this.styleTween(
          t,
          (function (t, e, n) {
            var r, i, o;
            return function () {
              var a = on(this, t),
                s = n(this),
                u = s + '';
              return null == s && (this.style.removeProperty(t), (u = s = on(this, t))), a === u ? null : a === r && u === i ? o : ((i = u), (o = e((r = a), s)));
            };
          })(t, r, xi(this, 'style.' + t, e))
        ).each(
          (function (t, e) {
            var n,
              r,
              i,
              o,
              a = 'style.' + e,
              s = 'end.' + a;
            return function () {
              var u = gi(this, t),
                c = u.on,
                l = null == u.value[a] ? o || (o = Ii(e)) : void 0;
              (c === n && i === l) || (r = (n = c).copy()).on(s, (i = l)), (u.on = r);
            };
          })(this._id, t)
        )
      : this.styleTween(
          t,
          (function (t, e, n) {
            var r,
              i,
              o = n + '';
            return function () {
              var a = on(this, t);
              return a === o ? null : a === r ? i : (i = e((r = a), n));
            };
          })(t, r, e),
          n
        ).on('end.style.' + t, null);
  },
  styleTween: function (t, e, n) {
    var r = 'style.' + (t += '');
    if (arguments.length < 2) return (r = this.tween(r)) && r._value;
    if (null == e) return this.tween(r, null);
    if ('function' != typeof e) throw new Error();
    return this.tween(
      r,
      (function (t, e, n) {
        var r, i;
        function o() {
          var o = e.apply(this, arguments);
          return (
            o !== i &&
              (r =
                (i = o) &&
                (function (t, e, n) {
                  return function (r) {
                    this.style.setProperty(t, e.call(this, r), n);
                  };
                })(t, o, n)),
            r
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
          })(xi(this, 'text', t))
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
        function r() {
          var r = t.apply(this, arguments);
          return (
            r !== n &&
              (e =
                (n = r) &&
                (function (t) {
                  return function (e) {
                    this.textContent = t.call(this, e);
                  };
                })(r)),
            e
          );
        }
        return (r._value = t), r;
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
      for (var r, i = yi(this.node(), n).tween, o = 0, a = i.length; o < a; ++o) if ((r = i[o]).name === t) return r.value;
      return null;
    }
    return this.each((null == e ? _i : wi)(n, t, e));
  },
  delay: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? Pi : Di)(e, t)) : yi(this.node(), e).delay;
  },
  duration: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? Oi : zi)(e, t)) : yi(this.node(), e).duration;
  },
  ease: function (t) {
    var e = this._id;
    return arguments.length
      ? this.each(
          (function (t, e) {
            if ('function' != typeof e) throw new Error();
            return function () {
              gi(this, t).ease = e;
            };
          })(e, t)
        )
      : yi(this.node(), e).ease;
  },
  easeVarying: function (t) {
    if ('function' != typeof t) throw new Error();
    return this.each(
      (function (t, e) {
        return function () {
          var n = e.apply(this, arguments);
          if ('function' != typeof n) throw new Error();
          gi(this, t).ease = n;
        };
      })(this._id, t)
    );
  },
  end: function () {
    var t,
      e,
      n = this,
      r = n._id,
      i = n.size();
    return new Promise(function (o, a) {
      var s = { value: a },
        u = {
          value: function () {
            0 == --i && o();
          },
        };
      n.each(function () {
        var n = gi(this, r),
          i = n.on;
        i !== t && ((e = (t = i).copy())._.cancel.push(s), e._.interrupt.push(s), e._.end.push(u)), (n.on = e);
      }),
        0 === i && o();
    });
  },
  [Symbol.iterator]: Hi[Symbol.iterator],
};
var qi = {
  time: null,
  delay: 0,
  duration: 250,
  ease: function (t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  },
};
function Wi(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); ) if (!(t = t.parentNode)) throw new Error(`transition ${e} not found`);
  return n;
}
function Li(t, e) {
  if ((n = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf('e')) < 0) return null;
  var n,
    r = t.slice(0, n);
  return [r.length > 1 ? r[0] + r.slice(2) : r, +t.slice(n + 1)];
}
function Fi(t) {
  return (t = Li(Math.abs(t))) ? t[1] : NaN;
}
(Rn.prototype.interrupt = function (t) {
  return this.each(function () {
    bi(this, t);
  });
}),
  (Rn.prototype.transition = function (t) {
    var e, n;
    t instanceof Ui ? ((e = t._id), (t = t._name)) : ((e = Bi()), ((n = qi).time = ti()), (t = null == t ? null : t + ''));
    for (var r = this._groups, i = r.length, o = 0; o < i; ++o) for (var a, s = r[o], u = s.length, c = 0; c < u; ++c) (a = s[c]) && vi(a, t, e, c, s, n || Wi(a, e));
    return new Ui(r, this._parents, t, e);
  });
var Vi,
  Yi = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Xi(t) {
  if (!(e = Yi.exec(t))) throw new Error('invalid format: ' + t);
  var e;
  return new Zi({
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
function Zi(t) {
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
function Gi(t, e) {
  var n = Li(t, e);
  if (!n) return t + '';
  var r = n[0],
    i = n[1];
  return i < 0 ? '0.' + new Array(-i).join('0') + r : r.length > i + 1 ? r.slice(0, i + 1) + '.' + r.slice(i + 1) : r + new Array(i - r.length + 2).join('0');
}
(Xi.prototype = Zi.prototype),
  (Zi.prototype.toString = function () {
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
var Ki = {
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
  p: (t, e) => Gi(100 * t, e),
  r: Gi,
  s: function (t, e) {
    var n = Li(t, e);
    if (!n) return t + '';
    var r = n[0],
      i = n[1],
      o = i - (Vi = 3 * Math.max(-8, Math.min(8, Math.floor(i / 3)))) + 1,
      a = r.length;
    return o === a
      ? r
      : o > a
      ? r + new Array(o - a + 1).join('0')
      : o > 0
      ? r.slice(0, o) + '.' + r.slice(o)
      : '0.' + new Array(1 - o).join('0') + Li(t, Math.max(0, e + o - 1))[0];
  },
  X: (t) => Math.round(t).toString(16).toUpperCase(),
  x: (t) => Math.round(t).toString(16),
};
function Ji(t) {
  return t;
}
var Qi,
  to,
  eo,
  no = Array.prototype.map,
  ro = ['y', 'z', 'a', 'f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
function io(t, e) {
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
function oo(t) {
  return +t;
}
(Qi = (function (t) {
  var e,
    n,
    r =
      void 0 === t.grouping || void 0 === t.thousands
        ? Ji
        : ((e = no.call(t.grouping, Number)),
          (n = t.thousands + ''),
          function (t, r) {
            for (
              var i = t.length, o = [], a = 0, s = e[0], u = 0;
              i > 0 && s > 0 && (u + s + 1 > r && (s = Math.max(1, r - u)), o.push(t.substring((i -= s), i + s)), !((u += s + 1) > r));

            )
              s = e[(a = (a + 1) % e.length)];
            return o.reverse().join(n);
          }),
    i = void 0 === t.currency ? '' : t.currency[0] + '',
    o = void 0 === t.currency ? '' : t.currency[1] + '',
    a = void 0 === t.decimal ? '.' : t.decimal + '',
    s =
      void 0 === t.numerals
        ? Ji
        : (function (t) {
            return function (e) {
              return e.replace(/[0-9]/g, function (e) {
                return t[+e];
              });
            };
          })(no.call(t.numerals, String)),
    u = void 0 === t.percent ? '%' : t.percent + '',
    c = void 0 === t.minus ? '−' : t.minus + '',
    l = void 0 === t.nan ? 'NaN' : t.nan + '';
  function f(t) {
    var e = (t = Xi(t)).fill,
      n = t.align,
      f = t.sign,
      h = t.symbol,
      d = t.zero,
      p = t.width,
      v = t.comma,
      m = t.precision,
      g = t.trim,
      y = t.type;
    'n' === y ? ((v = !0), (y = 'g')) : Ki[y] || (void 0 === m && (m = 12), (g = !0), (y = 'g')), (d || ('0' === e && '=' === n)) && ((d = !0), (e = '0'), (n = '='));
    var b = '$' === h ? i : '#' === h && /[boxX]/.test(y) ? '0' + y.toLowerCase() : '',
      _ = '$' === h ? o : /[%p]/.test(y) ? u : '',
      w = Ki[y],
      x = /[defgprs%]/.test(y);
    function A(t) {
      var i,
        o,
        u,
        h = b,
        A = _;
      if ('c' === y) (A = w(t) + A), (t = '');
      else {
        var M = (t = +t) < 0 || 1 / t < 0;
        if (
          ((t = isNaN(t) ? l : w(Math.abs(t), m)),
          g &&
            (t = (function (t) {
              t: for (var e, n = t.length, r = 1, i = -1; r < n; ++r)
                switch (t[r]) {
                  case '.':
                    i = e = r;
                    break;
                  case '0':
                    0 === i && (i = r), (e = r);
                    break;
                  default:
                    if (!+t[r]) break t;
                    i > 0 && (i = 0);
                }
              return i > 0 ? t.slice(0, i) + t.slice(e + 1) : t;
            })(t)),
          M && 0 == +t && '+' !== f && (M = !1),
          (h = (M ? ('(' === f ? f : c) : '-' === f || '(' === f ? '' : f) + h),
          (A = ('s' === y ? ro[8 + Vi / 3] : '') + A + (M && '(' === f ? ')' : '')),
          x)
        )
          for (i = -1, o = t.length; ++i < o; )
            if (48 > (u = t.charCodeAt(i)) || u > 57) {
              (A = (46 === u ? a + t.slice(i + 1) : t.slice(i)) + A), (t = t.slice(0, i));
              break;
            }
      }
      v && !d && (t = r(t, 1 / 0));
      var $ = h.length + t.length + A.length,
        E = $ < p ? new Array(p - $ + 1).join(e) : '';
      switch ((v && d && ((t = r(E + t, E.length ? p - A.length : 1 / 0)), (E = '')), n)) {
        case '<':
          t = h + t + A + E;
          break;
        case '=':
          t = h + E + t + A;
          break;
        case '^':
          t = E.slice(0, ($ = E.length >> 1)) + h + t + A + E.slice($);
          break;
        default:
          t = E + h + t + A;
      }
      return s(t);
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
    format: f,
    formatPrefix: function (t, e) {
      var n = f((((t = Xi(t)).type = 'f'), t)),
        r = 3 * Math.max(-8, Math.min(8, Math.floor(Fi(e) / 3))),
        i = Math.pow(10, -r),
        o = ro[8 + r / 3];
      return function (t) {
        return n(i * t) + o;
      };
    },
  };
})({ thousands: ',', grouping: [3], currency: ['$', ''] })),
  (to = Qi.format),
  (eo = Qi.formatPrefix);
var ao = [0, 1];
function so(t) {
  return t;
}
function uo(t, e) {
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
function co(t, e, n) {
  var r = t[0],
    i = t[1],
    o = e[0],
    a = e[1];
  return (
    i < r ? ((r = uo(i, r)), (o = n(a, o))) : ((r = uo(r, i)), (o = n(o, a))),
    function (t) {
      return o(r(t));
    }
  );
}
function lo(t, e, n) {
  var r = Math.min(t.length, e.length) - 1,
    i = new Array(r),
    o = new Array(r),
    a = -1;
  for (t[r] < t[0] && ((t = t.slice().reverse()), (e = e.slice().reverse())); ++a < r; ) (i[a] = uo(t[a], t[a + 1])), (o[a] = n(e[a], e[a + 1]));
  return function (e) {
    var n = pe(t, e, 1, r) - 1;
    return o[n](i[n](e));
  };
}
function fo(t) {
  var e = t.domain;
  return (
    (t.ticks = function (t) {
      var n = e();
      return (function (t, e, n) {
        if (!((n = +n) > 0)) return [];
        if ((t = +t) == (e = +e)) return [t];
        const r = e < t,
          [i, o, a] = r ? ye(e, t, n) : ye(t, e, n);
        if (!(o >= i)) return [];
        const s = o - i + 1,
          u = new Array(s);
        if (r)
          if (a < 0) for (let t = 0; t < s; ++t) u[t] = (o - t) / -a;
          else for (let t = 0; t < s; ++t) u[t] = (o - t) * a;
        else if (a < 0) for (let t = 0; t < s; ++t) u[t] = (i + t) / -a;
        else for (let t = 0; t < s; ++t) u[t] = (i + t) * a;
        return u;
      })(n[0], n[n.length - 1], t ?? 10);
    }),
    (t.tickFormat = function (t, n) {
      var r = e();
      return (function (t, e, n, r) {
        var i,
          o = (function (t, e, n) {
            n = +n;
            const r = (e = +e) < (t = +t),
              i = r ? be(e, t, n) : be(t, e, n);
            return (r ? -1 : 1) * (i < 0 ? 1 / -i : i);
          })(t, e, n);
        switch ((r = Xi(r ?? ',f')).type) {
          case 's':
            var a = Math.max(Math.abs(t), Math.abs(e));
            return (
              null != r.precision ||
                isNaN(
                  (i = (function (t, e) {
                    return Math.max(0, 3 * Math.max(-8, Math.min(8, Math.floor(Fi(e) / 3))) - Fi(Math.abs(t)));
                  })(o, a))
                ) ||
                (r.precision = i),
              eo(r, a)
            );
          case '':
          case 'e':
          case 'g':
          case 'p':
          case 'r':
            null != r.precision ||
              isNaN(
                (i = (function (t, e) {
                  return (t = Math.abs(t)), (e = Math.abs(e) - t), Math.max(0, Fi(e) - Fi(t)) + 1;
                })(o, Math.max(Math.abs(t), Math.abs(e))))
              ) ||
              (r.precision = i - ('e' === r.type));
            break;
          case 'f':
          case '%':
            null != r.precision ||
              isNaN(
                (i = (function (t) {
                  return Math.max(0, -Fi(Math.abs(t)));
                })(o))
              ) ||
              (r.precision = i - 2 * ('%' === r.type));
        }
        return to(r);
      })(r[0], r[r.length - 1], t ?? 10, n);
    }),
    (t.nice = function (n) {
      null == n && (n = 10);
      var r,
        i,
        o = e(),
        a = 0,
        s = o.length - 1,
        u = o[a],
        c = o[s],
        l = 10;
      for (c < u && ((i = u), (u = c), (c = i), (i = a), (a = s), (s = i)); l-- > 0; ) {
        if ((i = be(u, c, n)) === r) return (o[a] = u), (o[s] = c), e(o);
        if (i > 0) (u = Math.floor(u / i) * i), (c = Math.ceil(c / i) * i);
        else {
          if (!(i < 0)) break;
          (u = Math.ceil(u * i) / i), (c = Math.floor(c * i) / i);
        }
        r = i;
      }
      return t;
    }),
    t
  );
}
function ho() {
  var t = (function () {
    var t,
      e,
      n,
      r,
      i,
      o,
      a = ao,
      s = ao,
      u = Pr,
      c = so;
    function l() {
      var t = Math.min(a.length, s.length);
      return (
        c !== so &&
          (c = (function (t, e) {
            var n;
            return (
              t > e && ((n = t), (t = e), (e = n)),
              function (n) {
                return Math.max(t, Math.min(e, n));
              }
            );
          })(a[0], a[t - 1])),
        (r = t > 2 ? lo : co),
        (i = o = null),
        f
      );
    }
    function f(e) {
      return null == e || isNaN((e = +e)) ? n : (i || (i = r(a.map(t), s, u)))(t(c(e)));
    }
    return (
      (f.invert = function (n) {
        return c(e((o || (o = r(s, a.map(t), Sr)))(n)));
      }),
      (f.domain = function (t) {
        return arguments.length ? ((a = Array.from(t, oo)), l()) : a.slice();
      }),
      (f.range = function (t) {
        return arguments.length ? ((s = Array.from(t)), l()) : s.slice();
      }),
      (f.rangeRound = function (t) {
        return (s = Array.from(t)), (u = Dr), l();
      }),
      (f.clamp = function (t) {
        return arguments.length ? ((c = !!t || so), l()) : c !== so;
      }),
      (f.interpolate = function (t) {
        return arguments.length ? ((u = t), l()) : u;
      }),
      (f.unknown = function (t) {
        return arguments.length ? ((n = t), f) : n;
      }),
      function (n, r) {
        return (t = n), (e = r), l();
      }
    );
  })()(so, so);
  return (
    (t.copy = function () {
      return (e = t), ho().domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
      var e;
    }),
    io.apply(t, arguments),
    fo(t)
  );
}
var po = (t) => () => t;
function vo(t, { sourceEvent: e, target: n, transform: r, dispatch: i }) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: r, enumerable: !0, configurable: !0 },
    _: { value: i },
  });
}
function mo(t, e, n) {
  (this.k = t), (this.x = e), (this.y = n);
}
mo.prototype = {
  constructor: mo,
  scale: function (t) {
    return 1 === t ? this : new mo(this.k * t, this.x, this.y);
  },
  translate: function (t, e) {
    return (0 === t) & (0 === e) ? this : new mo(this.k, this.x + this.k * t, this.y + this.k * e);
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
var go = new mo(1, 0, 0);
function yo(t) {
  t.stopImmediatePropagation();
}
function bo(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function _o(t) {
  return !((t.ctrlKey && 'wheel' !== t.type) || t.button);
}
function wo() {
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
function xo() {
  return this.__zoom || go;
}
function Ao(t) {
  return -t.deltaY * (1 === t.deltaMode ? 0.05 : t.deltaMode ? 1 : 0.002) * (t.ctrlKey ? 10 : 1);
}
function Mo() {
  return navigator.maxTouchPoints || 'ontouchstart' in this;
}
function $o(t, e, n) {
  var r = t.invertX(e[0][0]) - n[0][0],
    i = t.invertX(e[1][0]) - n[1][0],
    o = t.invertY(e[0][1]) - n[0][1],
    a = t.invertY(e[1][1]) - n[1][1];
  return t.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), a > o ? (o + a) / 2 : Math.min(0, o) || Math.max(0, a));
}
mo.prototype;
const Eo = ['length', 'width', 'height'],
  So = (t) => {
    class e extends ee(Jt(re(Gt(t)))) {
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
        var t, e, n;
        (this.xScale = ho()
          .domain([1, (this.length || 0) + 1])
          .range([0, this.getWidthWithMargins()])),
          (this.originXScale = null === (t = this.xScale) || void 0 === t ? void 0 : t.copy()),
          (this.tmpXScale = null === (e = this.xScale) || void 0 === e ? void 0 : e.copy()),
          null === (n = this.zoom) ||
            void 0 === n ||
            n.translateExtent([
              [0, 0],
              [this.getWidthWithMargins(), 0],
            ]);
      }
      _initZoom() {
        this._zoom = (function () {
          var t,
            e,
            n,
            r = _o,
            i = wo,
            o = $o,
            a = Ao,
            s = Mo,
            u = [0, 1 / 0],
            c = [
              [-1 / 0, -1 / 0],
              [1 / 0, 1 / 0],
            ],
            l = 250,
            f = Lr,
            h = we('start', 'zoom', 'end'),
            d = 500,
            p = 150,
            v = 0,
            m = 10;
          function g(t) {
            t.property('__zoom', xo)
              .on('wheel.zoom', M, { passive: !1 })
              .on('mousedown.zoom', $)
              .on('dblclick.zoom', E)
              .filter(s)
              .on('touchstart.zoom', S)
              .on('touchmove.zoom', C)
              .on('touchend.zoom touchcancel.zoom', k)
              .style('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
          }
          function y(t, e) {
            return (e = Math.max(u[0], Math.min(u[1], e))) === t.k ? t : new mo(e, t.x, t.y);
          }
          function b(t, e, n) {
            var r = e[0] - n[0] * t.k,
              i = e[1] - n[1] * t.k;
            return r === t.x && i === t.y ? t : new mo(t.k, r, i);
          }
          function _(t) {
            return [(+t[0][0] + +t[1][0]) / 2, (+t[0][1] + +t[1][1]) / 2];
          }
          function w(t, e, n, r) {
            t.on('start.zoom', function () {
              x(this, arguments).event(r).start();
            })
              .on('interrupt.zoom end.zoom', function () {
                x(this, arguments).event(r).end();
              })
              .tween('zoom', function () {
                var t = this,
                  o = arguments,
                  a = x(t, o).event(r),
                  s = i.apply(t, o),
                  u = null == n ? _(s) : 'function' == typeof n ? n.apply(t, o) : n,
                  c = Math.max(s[1][0] - s[0][0], s[1][1] - s[0][1]),
                  l = t.__zoom,
                  h = 'function' == typeof e ? e.apply(t, o) : e,
                  d = f(l.invert(u).concat(c / l.k), h.invert(u).concat(c / h.k));
                return function (t) {
                  if (1 === t) t = h;
                  else {
                    var e = d(t),
                      n = c / e[2];
                    t = new mo(n, u[0] - e[0] * n, u[1] - e[1] * n);
                  }
                  a.zoom(null, t);
                };
              });
          }
          function x(t, e, n) {
            return (!n && t.__zooming) || new A(t, e);
          }
          function A(t, e) {
            (this.that = t), (this.args = e), (this.active = 0), (this.sourceEvent = null), (this.extent = i.apply(t, e)), (this.taps = 0);
          }
          function M(t, ...e) {
            if (r.apply(this, arguments)) {
              var n = x(this, e).event(t),
                i = this.__zoom,
                s = Math.max(u[0], Math.min(u[1], i.k * Math.pow(2, a.apply(this, arguments)))),
                l = jn(t);
              if (n.wheel) (n.mouse[0][0] === l[0] && n.mouse[0][1] === l[1]) || (n.mouse[1] = i.invert((n.mouse[0] = l))), clearTimeout(n.wheel);
              else {
                if (i.k === s) return;
                (n.mouse = [l, i.invert(l)]), bi(this), n.start();
              }
              bo(t),
                (n.wheel = setTimeout(function () {
                  (n.wheel = null), n.end();
                }, p)),
                n.zoom('mouse', o(b(y(i, s), n.mouse[0], n.mouse[1]), n.extent, c));
            }
          }
          function $(t, ...e) {
            if (!n && r.apply(this, arguments)) {
              var i = t.currentTarget,
                a = x(this, e, !0).event(t),
                s = In(t.view)
                  .on(
                    'mousemove.zoom',
                    function (t) {
                      if ((bo(t), !a.moved)) {
                        var e = t.clientX - l,
                          n = t.clientY - f;
                        a.moved = e * e + n * n > v;
                      }
                      a.event(t).zoom('mouse', o(b(a.that.__zoom, (a.mouse[0] = jn(t, i)), a.mouse[1]), a.extent, c));
                    },
                    !0
                  )
                  .on(
                    'mouseup.zoom',
                    function (t) {
                      s.on('mousemove.zoom mouseup.zoom', null),
                        (function (t, e) {
                          var n = t.document.documentElement,
                            r = In(t).on('dragstart.drag', null);
                          e &&
                            (r.on('click.drag', Bn, Un),
                            setTimeout(function () {
                              r.on('click.drag', null);
                            }, 0)),
                            'onselectstart' in n ? r.on('selectstart.drag', null) : ((n.style.MozUserSelect = n.__noselect), delete n.__noselect);
                        })(t.view, a.moved),
                        bo(t),
                        a.event(t).end();
                    },
                    !0
                  ),
                u = jn(t, i),
                l = t.clientX,
                f = t.clientY;
              !(function (t) {
                var e = t.document.documentElement,
                  n = In(t).on('dragstart.drag', Bn, Un);
                'onselectstart' in e ? n.on('selectstart.drag', Bn, Un) : ((e.__noselect = e.style.MozUserSelect), (e.style.MozUserSelect = 'none'));
              })(t.view),
                yo(t),
                (a.mouse = [u, this.__zoom.invert(u)]),
                bi(this),
                a.start();
            }
          }
          function E(t, ...e) {
            if (r.apply(this, arguments)) {
              var n = this.__zoom,
                a = jn(t.changedTouches ? t.changedTouches[0] : t, this),
                s = n.invert(a),
                u = n.k * (t.shiftKey ? 0.5 : 2),
                f = o(b(y(n, u), a, s), i.apply(this, e), c);
              bo(t), l > 0 ? In(this).transition().duration(l).call(w, f, a, t) : In(this).call(g.transform, f, a, t);
            }
          }
          function S(n, ...i) {
            if (r.apply(this, arguments)) {
              var o,
                a,
                s,
                u,
                c = n.touches,
                l = c.length,
                f = x(this, i, n.changedTouches.length === l).event(n);
              for (yo(n), a = 0; a < l; ++a)
                (u = [(u = jn((s = c[a]), this)), this.__zoom.invert(u), s.identifier]),
                  f.touch0 ? f.touch1 || f.touch0[2] === u[2] || ((f.touch1 = u), (f.taps = 0)) : ((f.touch0 = u), (o = !0), (f.taps = 1 + !!t));
              t && (t = clearTimeout(t)),
                o &&
                  (f.taps < 2 &&
                    ((e = u[0]),
                    (t = setTimeout(function () {
                      t = null;
                    }, d))),
                  bi(this),
                  f.start());
            }
          }
          function C(t, ...e) {
            if (this.__zooming) {
              var n,
                r,
                i,
                a,
                s = x(this, e).event(t),
                u = t.changedTouches,
                l = u.length;
              for (bo(t), n = 0; n < l; ++n)
                (i = jn((r = u[n]), this)),
                  s.touch0 && s.touch0[2] === r.identifier ? (s.touch0[0] = i) : s.touch1 && s.touch1[2] === r.identifier && (s.touch1[0] = i);
              if (((r = s.that.__zoom), s.touch1)) {
                var f = s.touch0[0],
                  h = s.touch0[1],
                  d = s.touch1[0],
                  p = s.touch1[1],
                  v = (v = d[0] - f[0]) * v + (v = d[1] - f[1]) * v,
                  m = (m = p[0] - h[0]) * m + (m = p[1] - h[1]) * m;
                (r = y(r, Math.sqrt(v / m))), (i = [(f[0] + d[0]) / 2, (f[1] + d[1]) / 2]), (a = [(h[0] + p[0]) / 2, (h[1] + p[1]) / 2]);
              } else {
                if (!s.touch0) return;
                (i = s.touch0[0]), (a = s.touch0[1]);
              }
              s.zoom('touch', o(b(r, i, a), s.extent, c));
            }
          }
          function k(t, ...r) {
            if (this.__zooming) {
              var i,
                o,
                a = x(this, r).event(t),
                s = t.changedTouches,
                u = s.length;
              for (
                yo(t),
                  n && clearTimeout(n),
                  n = setTimeout(function () {
                    n = null;
                  }, d),
                  i = 0;
                i < u;
                ++i
              )
                (o = s[i]), a.touch0 && a.touch0[2] === o.identifier ? delete a.touch0 : a.touch1 && a.touch1[2] === o.identifier && delete a.touch1;
              if ((a.touch1 && !a.touch0 && ((a.touch0 = a.touch1), delete a.touch1), a.touch0)) a.touch0[1] = this.__zoom.invert(a.touch0[0]);
              else if ((a.end(), 2 === a.taps && ((o = jn(o, this)), Math.hypot(e[0] - o[0], e[1] - o[1]) < m))) {
                var c = In(this).on('dblclick.zoom');
                c && c.apply(this, arguments);
              }
            }
          }
          return (
            (g.transform = function (t, e, n, r) {
              var i = t.selection ? t.selection() : t;
              i.property('__zoom', xo),
                t !== i
                  ? w(t, e, n, r)
                  : i.interrupt().each(function () {
                      x(this, arguments)
                        .event(r)
                        .start()
                        .zoom(null, 'function' == typeof e ? e.apply(this, arguments) : e)
                        .end();
                    });
            }),
            (g.scaleBy = function (t, e, n, r) {
              g.scaleTo(
                t,
                function () {
                  return this.__zoom.k * ('function' == typeof e ? e.apply(this, arguments) : e);
                },
                n,
                r
              );
            }),
            (g.scaleTo = function (t, e, n, r) {
              g.transform(
                t,
                function () {
                  var t = i.apply(this, arguments),
                    r = this.__zoom,
                    a = null == n ? _(t) : 'function' == typeof n ? n.apply(this, arguments) : n,
                    s = r.invert(a),
                    u = 'function' == typeof e ? e.apply(this, arguments) : e;
                  return o(b(y(r, u), a, s), t, c);
                },
                n,
                r
              );
            }),
            (g.translateBy = function (t, e, n, r) {
              g.transform(
                t,
                function () {
                  return o(
                    this.__zoom.translate('function' == typeof e ? e.apply(this, arguments) : e, 'function' == typeof n ? n.apply(this, arguments) : n),
                    i.apply(this, arguments),
                    c
                  );
                },
                null,
                r
              );
            }),
            (g.translateTo = function (t, e, n, r, a) {
              g.transform(
                t,
                function () {
                  var t = i.apply(this, arguments),
                    a = this.__zoom,
                    s = null == r ? _(t) : 'function' == typeof r ? r.apply(this, arguments) : r;
                  return o(
                    go
                      .translate(s[0], s[1])
                      .scale(a.k)
                      .translate('function' == typeof e ? -e.apply(this, arguments) : -e, 'function' == typeof n ? -n.apply(this, arguments) : -n),
                    t,
                    c
                  );
                },
                r,
                a
              );
            }),
            (A.prototype = {
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
                var e = In(this.that).datum();
                h.call(t, this.that, new vo(t, { sourceEvent: this.sourceEvent, target: g, type: t, transform: this.that.__zoom, dispatch: h }), e);
              },
            }),
            (g.wheelDelta = function (t) {
              return arguments.length ? ((a = 'function' == typeof t ? t : po(+t)), g) : a;
            }),
            (g.filter = function (t) {
              return arguments.length ? ((r = 'function' == typeof t ? t : po(!!t)), g) : r;
            }),
            (g.touchable = function (t) {
              return arguments.length ? ((s = 'function' == typeof t ? t : po(!!t)), g) : s;
            }),
            (g.extent = function (t) {
              return arguments.length
                ? ((i =
                    'function' == typeof t
                      ? t
                      : po([
                          [+t[0][0], +t[0][1]],
                          [+t[1][0], +t[1][1]],
                        ])),
                  g)
                : i;
            }),
            (g.scaleExtent = function (t) {
              return arguments.length ? ((u[0] = +t[0]), (u[1] = +t[1]), g) : [u[0], u[1]];
            }),
            (g.translateExtent = function (t) {
              return arguments.length
                ? ((c[0][0] = +t[0][0]), (c[1][0] = +t[1][0]), (c[0][1] = +t[0][1]), (c[1][1] = +t[1][1]), g)
                : [
                    [c[0][0], c[0][1]],
                    [c[1][0], c[1][1]],
                  ];
            }),
            (g.constrain = function (t) {
              return arguments.length ? ((o = t), g) : o;
            }),
            (g.duration = function (t) {
              return arguments.length ? ((l = +t), g) : l;
            }),
            (g.interpolate = function (t) {
              return arguments.length ? ((f = t), g) : f;
            }),
            (g.on = function () {
              var t = h.on.apply(h, arguments);
              return t === h ? g : t;
            }),
            (g.clickDistance = function (t) {
              return arguments.length ? ((v = (t = +t) * t), g) : Math.sqrt(v);
            }),
            (g.tapDistance = function (t) {
              return arguments.length ? ((m = +t), g) : m;
            }),
            g
          );
        })()
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
        super.attributeChangedCallback(t, e, n), e !== ('null' === n ? null : n) && (Eo.includes(t) && this.updateScaleDomain(), this.applyZoomTranslation());
      }
      zoomed(t) {
        var e;
        this.originXScale && (this.tmpXScale = t.transform.rescaleX(this.originXScale));
        const [n, r] = (null === (e = null == this ? void 0 : this.tmpXScale) || void 0 === e ? void 0 : e.domain()) || [0, 0];
        this.tmpXScale &&
          (this.dontDispatch
            ? (this.xScale = this.tmpXScale)
            : this.dispatchEvent(
                new CustomEvent('change', {
                  detail: { 'display-start': Math.max(1, n), 'display-end': Math.min(this.length || 0, Math.max(r - 1, n + 1)) },
                  bubbles: !0,
                  cancelable: !0,
                })
              ));
      }
      applyZoomTranslation() {
        if (!this.svg || !this.originXScale) return;
        const t = Math.max(1, (this.length || 0) / (1 + (this['display-end'] || 0) - (this['display-start'] || 0))),
          e = -this.originXScale(this['display-start'] || 0);
        (this.dontDispatch = !0), this.zoom && this.svg.call(this.zoom.transform, go.scale(t).translate(e, 0)), (this.dontDispatch = !1), this.zoomRefreshed();
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
    return Lt([Xt({ type: Boolean })], e.prototype, 'use-ctrl-to-zoom', void 0), e;
  },
  Co = 'highlight-event';
function ko(t, e = null, n = !1, r = !1, i, o, a, s, u) {
  e && (e = (null == e ? void 0 : e.feature) || e);
  const c = { eventType: t, feature: e, target: a, parentEvent: s };
  return (
    n &&
      ((null == e ? void 0 : e.fragments)
        ? (c.highlight = ((null == e ? void 0 : e.fragments) || []).map((t) => `${t.start}:${t.end}`).join(','))
        : (null == s ? void 0 : s.shiftKey) && (null == u ? void 0 : u.highlight)
        ? (c.highlight = `${u.highlight},${i}:${o}`)
        : (c.highlight = i && o ? `${i}:${o}` : void 0)),
    r && (c.selectedId = null == e ? void 0 : e.protvistaFeatureId),
    new CustomEvent('change', { detail: c, bubbles: !0, cancelable: !0 })
  );
}
function To(t, e) {
  t.on('mouseover', function (t, n) {
    var r, i;
    e.dispatchEvent(
      ko(
        'mouseover',
        n,
        'onmouseover' === e.getAttribute(Co),
        !1,
        null !== (r = n.start) && void 0 !== r ? r : n.position,
        null !== (i = n.end) && void 0 !== i ? i : n.position,
        this,
        t
      )
    );
  })
    .on('mouseout', () => {
      e.dispatchEvent(ko('mouseout', null, 'onmouseover' === e.getAttribute(Co)));
    })
    .on('click', function (t, n) {
      var r, i;
      e.dispatchEvent(
        ko(
          'click',
          n,
          'onclick' === e.getAttribute(Co),
          !0,
          null !== (r = n.start) && void 0 !== r ? r : n.position,
          null !== (i = n.end) && void 0 !== i ? i : n.position,
          this,
          t,
          e
        )
      );
    });
}
const No = (t) => (e) => {
    window.customElements.get(t) ||
      (
        (t) => (e) =>
          'function' == typeof e
            ? ((t, e) => (customElements.define(t, e), e))(t, e)
            : ((t, e) => {
                const { kind: n, elements: r } = e;
                return {
                  kind: n,
                  elements: r,
                  finisher(e) {
                    customElements.define(t, e);
                  },
                };
              })(t, e)
      )(t)(e);
  },
  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ Po = window,
  Do = Po.ShadowRoot && (void 0 === Po.ShadyCSS || Po.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype,
  Oo = Symbol(),
  zo = new WeakMap(),
  Ro = (t) =>
    new (class {
      constructor(t, e, n) {
        if (((this._$cssResult$ = !0), n !== Oo)) throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        (this.cssText = t), (this.t = e);
      }
      get styleSheet() {
        let t = this.o;
        const e = this.t;
        if (Do && void 0 === t) {
          const n = void 0 !== e && 1 === e.length;
          n && (t = zo.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && zo.set(e, t));
        }
        return t;
      }
      toString() {
        return this.cssText;
      }
    })('string' == typeof t ? t : t + '', void 0, Oo),
  Io = Do
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return Ro(e);
            })(t)
          : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var jo;
const Uo = window,
  Bo = Uo.trustedTypes,
  Ho = Bo ? Bo.emptyScript : '',
  qo = Uo.reactiveElementPolyfillSupport,
  Wo = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? Ho : null;
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
  Lo = (t, e) => e !== t && (e == e || t == t),
  Fo = { attribute: !0, type: String, converter: Wo, reflect: !1, hasChanged: Lo };
let Vo = class extends HTMLElement {
  constructor() {
    super(), (this._$Ei = new Map()), (this.isUpdatePending = !1), (this.hasUpdated = !1), (this._$El = null), this.u();
  }
  static addInitializer(t) {
    var e;
    this.finalize(), (null !== (e = this.h) && void 0 !== e ? e : (this.h = [])).push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return (
      this.elementProperties.forEach((e, n) => {
        const r = this._$Ep(n, e);
        void 0 !== r && (this._$Ev.set(r, n), t.push(r));
      }),
      t
    );
  }
  static createProperty(t, e = Fo) {
    if ((e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t))) {
      const n = 'symbol' == typeof t ? Symbol() : '__' + t,
        r = this.getPropertyDescriptor(t, n, e);
      void 0 !== r && Object.defineProperty(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    return {
      get() {
        return this[e];
      },
      set(r) {
        const i = this[t];
        (this[e] = r), this.requestUpdate(t, i, n);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || Fo;
  }
  static finalize() {
    if (this.hasOwnProperty('finalized')) return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);
    if (
      (t.finalize(),
      void 0 !== t.h && (this.h = [...t.h]),
      (this.elementProperties = new Map(t.elementProperties)),
      (this._$Ev = new Map()),
      this.hasOwnProperty('properties'))
    ) {
      const t = this.properties,
        e = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
      for (const n of e) this.createProperty(n, t[n]);
    }
    return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const t of n) e.unshift(Io(t));
    } else void 0 !== t && e.push(Io(t));
    return e;
  }
  static _$Ep(t, e) {
    const n = e.attribute;
    return !1 === n ? void 0 : 'string' == typeof n ? n : 'string' == typeof t ? t.toLowerCase() : void 0;
  }
  u() {
    var t;
    (this._$E_ = new Promise((t) => (this.enableUpdating = t))),
      (this._$AL = new Map()),
      this._$Eg(),
      this.requestUpdate(),
      null === (t = this.constructor.h) || void 0 === t || t.forEach((t) => t(this));
  }
  addController(t) {
    var e, n;
    (null !== (e = this._$ES) && void 0 !== e ? e : (this._$ES = [])).push(t),
      void 0 !== this.renderRoot && this.isConnected && (null === (n = t.hostConnected) || void 0 === n || n.call(t));
  }
  removeController(t) {
    var e;
    null === (e = this._$ES) || void 0 === e || e.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t, e) => {
      this.hasOwnProperty(e) && (this._$Ei.set(e, this[e]), delete this[e]);
    });
  }
  createRenderRoot() {
    var t;
    const e = null !== (t = this.shadowRoot) && void 0 !== t ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return (
      ((t, e) => {
        Do
          ? (t.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet)))
          : e.forEach((e) => {
              const n = document.createElement('style'),
                r = Po.litNonce;
              void 0 !== r && n.setAttribute('nonce', r), (n.textContent = e.cssText), t.appendChild(n);
            });
      })(e, this.constructor.elementStyles),
      e
    );
  }
  connectedCallback() {
    var t;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      null === (t = this._$ES) ||
        void 0 === t ||
        t.forEach((t) => {
          var e;
          return null === (e = t.hostConnected) || void 0 === e ? void 0 : e.call(t);
        });
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    var t;
    null === (t = this._$ES) ||
      void 0 === t ||
      t.forEach((t) => {
        var e;
        return null === (e = t.hostDisconnected) || void 0 === e ? void 0 : e.call(t);
      });
  }
  attributeChangedCallback(t, e, n) {
    this._$AK(t, n);
  }
  _$EO(t, e, n = Fo) {
    var r;
    const i = this.constructor._$Ep(t, n);
    if (void 0 !== i && !0 === n.reflect) {
      const o = (void 0 !== (null === (r = n.converter) || void 0 === r ? void 0 : r.toAttribute) ? n.converter : Wo).toAttribute(e, n.type);
      (this._$El = t), null == o ? this.removeAttribute(i) : this.setAttribute(i, o), (this._$El = null);
    }
  }
  _$AK(t, e) {
    var n;
    const r = this.constructor,
      i = r._$Ev.get(t);
    if (void 0 !== i && this._$El !== i) {
      const t = r.getPropertyOptions(i),
        o =
          'function' == typeof t.converter
            ? { fromAttribute: t.converter }
            : void 0 !== (null === (n = t.converter) || void 0 === n ? void 0 : n.fromAttribute)
            ? t.converter
            : Wo;
      (this._$El = i), (this[i] = o.fromAttribute(e, t.type)), (this._$El = null);
    }
  }
  requestUpdate(t, e, n) {
    let r = !0;
    void 0 !== t &&
      (((n = n || this.constructor.getPropertyOptions(t)).hasChanged || Lo)(this[t], e)
        ? (this._$AL.has(t) || this._$AL.set(t, e), !0 === n.reflect && this._$El !== t && (void 0 === this._$EC && (this._$EC = new Map()), this._$EC.set(t, n)))
        : (r = !1)),
      !this.isUpdatePending && r && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
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
    var t;
    if (!this.isUpdatePending) return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t, e) => (this[e] = t)), (this._$Ei = void 0));
    let e = !1;
    const n = this._$AL;
    try {
      (e = this.shouldUpdate(n)),
        e
          ? (this.willUpdate(n),
            null === (t = this._$ES) ||
              void 0 === t ||
              t.forEach((t) => {
                var e;
                return null === (e = t.hostUpdate) || void 0 === e ? void 0 : e.call(t);
              }),
            this.update(n))
          : this._$Ek();
    } catch (t) {
      throw ((e = !1), this._$Ek(), t);
    }
    e && this._$AE(n);
  }
  willUpdate(t) {}
  _$AE(t) {
    var e;
    null === (e = this._$ES) ||
      void 0 === e ||
      e.forEach((t) => {
        var e;
        return null === (e = t.hostUpdated) || void 0 === e ? void 0 : e.call(t);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
      this.updated(t);
  }
  _$Ek() {
    (this._$AL = new Map()), (this.isUpdatePending = !1);
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    void 0 !== this._$EC && (this._$EC.forEach((t, e) => this._$EO(e, this[e], t)), (this._$EC = void 0)), this._$Ek();
  }
  updated(t) {}
  firstUpdated(t) {}
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var Yo;
(Vo.finalized = !0),
  (Vo.elementProperties = new Map()),
  (Vo.elementStyles = []),
  (Vo.shadowRootOptions = { mode: 'open' }),
  null == qo || qo({ ReactiveElement: Vo }),
  (null !== (jo = Uo.reactiveElementVersions) && void 0 !== jo ? jo : (Uo.reactiveElementVersions = [])).push('1.6.1');
const Xo = window,
  Zo = Xo.trustedTypes,
  Go = Zo ? Zo.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  Ko = '$lit$',
  Jo = `lit$${(Math.random() + '').slice(9)}$`,
  Qo = '?' + Jo,
  ta = `<${Qo}>`,
  ea = document,
  na = () => ea.createComment(''),
  ra = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
  ia = Array.isArray,
  oa = '[ \t\n\f\r]',
  aa = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  sa = /-->/g,
  ua = />/g,
  ca = RegExp(`>|${oa}(?:([^\\s"'>=/]+)(${oa}*=${oa}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  la = /'/g,
  fa = /"/g,
  ha = /^(?:script|style|textarea|title)$/i,
  da = Symbol.for('lit-noChange'),
  pa = Symbol.for('lit-nothing'),
  va = new WeakMap(),
  ma = ea.createTreeWalker(ea, 129, null, !1);
class ga {
  constructor({ strings: t, _$litType$: e }, n) {
    let r;
    this.parts = [];
    let i = 0,
      o = 0;
    const a = t.length - 1,
      s = this.parts,
      [u, c] = ((t, e) => {
        const n = t.length - 1,
          r = [];
        let i,
          o = 2 === e ? '<svg>' : '',
          a = aa;
        for (let e = 0; e < n; e++) {
          const n = t[e];
          let s,
            u,
            c = -1,
            l = 0;
          for (; l < n.length && ((a.lastIndex = l), (u = a.exec(n)), null !== u); )
            (l = a.lastIndex),
              a === aa
                ? '!--' === u[1]
                  ? (a = sa)
                  : void 0 !== u[1]
                  ? (a = ua)
                  : void 0 !== u[2]
                  ? (ha.test(u[2]) && (i = RegExp('</' + u[2], 'g')), (a = ca))
                  : void 0 !== u[3] && (a = ca)
                : a === ca
                ? '>' === u[0]
                  ? ((a = null != i ? i : aa), (c = -1))
                  : void 0 === u[1]
                  ? (c = -2)
                  : ((c = a.lastIndex - u[2].length), (s = u[1]), (a = void 0 === u[3] ? ca : '"' === u[3] ? fa : la))
                : a === fa || a === la
                ? (a = ca)
                : a === sa || a === ua
                ? (a = aa)
                : ((a = ca), (i = void 0));
          const f = a === ca && t[e + 1].startsWith('/>') ? ' ' : '';
          o += a === aa ? n + ta : c >= 0 ? (r.push(s), n.slice(0, c) + Ko + n.slice(c) + Jo + f) : n + Jo + (-2 === c ? (r.push(void 0), e) : f);
        }
        const s = o + (t[n] || '<?>') + (2 === e ? '</svg>' : '');
        if (!Array.isArray(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
        return [void 0 !== Go ? Go.createHTML(s) : s, r];
      })(t, e);
    if (((this.el = ga.createElement(u, n)), (ma.currentNode = this.el.content), 2 === e)) {
      const t = this.el.content,
        e = t.firstChild;
      e.remove(), t.append(...e.childNodes);
    }
    for (; null !== (r = ma.nextNode()) && s.length < a; ) {
      if (1 === r.nodeType) {
        if (r.hasAttributes()) {
          const t = [];
          for (const e of r.getAttributeNames())
            if (e.endsWith(Ko) || e.startsWith(Jo)) {
              const n = c[o++];
              if ((t.push(e), void 0 !== n)) {
                const t = r.getAttribute(n.toLowerCase() + Ko).split(Jo),
                  e = /([.?@])?(.*)/.exec(n);
                s.push({ type: 1, index: i, name: e[2], strings: t, ctor: '.' === e[1] ? xa : '?' === e[1] ? Ma : '@' === e[1] ? $a : wa });
              } else s.push({ type: 6, index: i });
            }
          for (const e of t) r.removeAttribute(e);
        }
        if (ha.test(r.tagName)) {
          const t = r.textContent.split(Jo),
            e = t.length - 1;
          if (e > 0) {
            r.textContent = Zo ? Zo.emptyScript : '';
            for (let n = 0; n < e; n++) r.append(t[n], na()), ma.nextNode(), s.push({ type: 2, index: ++i });
            r.append(t[e], na());
          }
        }
      } else if (8 === r.nodeType)
        if (r.data === Qo) s.push({ type: 2, index: i });
        else {
          let t = -1;
          for (; -1 !== (t = r.data.indexOf(Jo, t + 1)); ) s.push({ type: 7, index: i }), (t += Jo.length - 1);
        }
      i++;
    }
  }
  static createElement(t, e) {
    const n = ea.createElement('template');
    return (n.innerHTML = t), n;
  }
}
function ya(t, e, n = t, r) {
  var i, o, a, s;
  if (e === da) return e;
  let u = void 0 !== r ? (null === (i = n._$Co) || void 0 === i ? void 0 : i[r]) : n._$Cl;
  const c = ra(e) ? void 0 : e._$litDirective$;
  return (
    (null == u ? void 0 : u.constructor) !== c &&
      (null === (o = null == u ? void 0 : u._$AO) || void 0 === o || o.call(u, !1),
      void 0 === c ? (u = void 0) : ((u = new c(t)), u._$AT(t, n, r)),
      void 0 !== r ? ((null !== (a = (s = n)._$Co) && void 0 !== a ? a : (s._$Co = []))[r] = u) : (n._$Cl = u)),
    void 0 !== u && (e = ya(t, u._$AS(t, e.values), u, r)),
    e
  );
}
class ba {
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
    var e;
    const {
        el: { content: n },
        parts: r,
      } = this._$AD,
      i = (null !== (e = null == t ? void 0 : t.creationScope) && void 0 !== e ? e : ea).importNode(n, !0);
    ma.currentNode = i;
    let o = ma.nextNode(),
      a = 0,
      s = 0,
      u = r[0];
    for (; void 0 !== u; ) {
      if (a === u.index) {
        let e;
        2 === u.type
          ? (e = new _a(o, o.nextSibling, this, t))
          : 1 === u.type
          ? (e = new u.ctor(o, u.name, u.strings, this, t))
          : 6 === u.type && (e = new Ea(o, this, t)),
          this._$AV.push(e),
          (u = r[++s]);
      }
      a !== (null == u ? void 0 : u.index) && ((o = ma.nextNode()), a++);
    }
    return i;
  }
  v(t) {
    let e = 0;
    for (const n of this._$AV) void 0 !== n && (void 0 !== n.strings ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++;
  }
}
class _a {
  constructor(t, e, n, r) {
    var i;
    (this.type = 2),
      (this._$AH = pa),
      (this._$AN = void 0),
      (this._$AA = t),
      (this._$AB = e),
      (this._$AM = n),
      (this.options = r),
      (this._$Cp = null === (i = null == r ? void 0 : r.isConnected) || void 0 === i || i);
  }
  get _$AU() {
    var t, e;
    return null !== (e = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) && void 0 !== e ? e : this._$Cp;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return void 0 !== e && 11 === (null == t ? void 0 : t.nodeType) && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    (t = ya(this, t, e)),
      ra(t)
        ? t === pa || null == t || '' === t
          ? (this._$AH !== pa && this._$AR(), (this._$AH = pa))
          : t !== this._$AH && t !== da && this._(t)
        : void 0 !== t._$litType$
        ? this.g(t)
        : void 0 !== t.nodeType
        ? this.$(t)
        : ((t) => ia(t) || 'function' == typeof (null == t ? void 0 : t[Symbol.iterator]))(t)
        ? this.T(t)
        : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), (this._$AH = this.k(t)));
  }
  _(t) {
    this._$AH !== pa && ra(this._$AH) ? (this._$AA.nextSibling.data = t) : this.$(ea.createTextNode(t)), (this._$AH = t);
  }
  g(t) {
    var e;
    const { values: n, _$litType$: r } = t,
      i = 'number' == typeof r ? this._$AC(t) : (void 0 === r.el && (r.el = ga.createElement(r.h, this.options)), r);
    if ((null === (e = this._$AH) || void 0 === e ? void 0 : e._$AD) === i) this._$AH.v(n);
    else {
      const t = new ba(i, this),
        e = t.u(this.options);
      t.v(n), this.$(e), (this._$AH = t);
    }
  }
  _$AC(t) {
    let e = va.get(t.strings);
    return void 0 === e && va.set(t.strings, (e = new ga(t))), e;
  }
  T(t) {
    ia(this._$AH) || ((this._$AH = []), this._$AR());
    const e = this._$AH;
    let n,
      r = 0;
    for (const i of t) r === e.length ? e.push((n = new _a(this.k(na()), this.k(na()), this, this.options))) : (n = e[r]), n._$AI(i), r++;
    r < e.length && (this._$AR(n && n._$AB.nextSibling, r), (e.length = r));
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var n;
    for (null === (n = this._$AP) || void 0 === n || n.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const e = t.nextSibling;
      t.remove(), (t = e);
    }
  }
  setConnected(t) {
    var e;
    void 0 === this._$AM && ((this._$Cp = t), null === (e = this._$AP) || void 0 === e || e.call(this, t));
  }
}
class wa {
  constructor(t, e, n, r, i) {
    (this.type = 1),
      (this._$AH = pa),
      (this._$AN = void 0),
      (this.element = t),
      (this.name = e),
      (this._$AM = r),
      (this.options = i),
      n.length > 2 || '' !== n[0] || '' !== n[1] ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n)) : (this._$AH = pa);
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, e = this, n, r) {
    const i = this.strings;
    let o = !1;
    if (void 0 === i) (t = ya(this, t, e, 0)), (o = !ra(t) || (t !== this._$AH && t !== da)), o && (this._$AH = t);
    else {
      const r = t;
      let a, s;
      for (t = i[0], a = 0; a < i.length - 1; a++)
        (s = ya(this, r[n + a], e, a)),
          s === da && (s = this._$AH[a]),
          o || (o = !ra(s) || s !== this._$AH[a]),
          s === pa ? (t = pa) : t !== pa && (t += (null != s ? s : '') + i[a + 1]),
          (this._$AH[a] = s);
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === pa ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t ? t : '');
  }
}
class xa extends wa {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(t) {
    this.element[this.name] = t === pa ? void 0 : t;
  }
}
const Aa = Zo ? Zo.emptyScript : '';
class Ma extends wa {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(t) {
    t && t !== pa ? this.element.setAttribute(this.name, Aa) : this.element.removeAttribute(this.name);
  }
}
class $a extends wa {
  constructor(t, e, n, r, i) {
    super(t, e, n, r, i), (this.type = 5);
  }
  _$AI(t, e = this) {
    var n;
    if ((t = null !== (n = ya(this, t, e, 0)) && void 0 !== n ? n : pa) === da) return;
    const r = this._$AH,
      i = (t === pa && r !== pa) || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive,
      o = t !== pa && (r === pa || i);
    i && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), (this._$AH = t);
  }
  handleEvent(t) {
    var e, n;
    'function' == typeof this._$AH
      ? this._$AH.call(null !== (n = null === (e = this.options) || void 0 === e ? void 0 : e.host) && void 0 !== n ? n : this.element, t)
      : this._$AH.handleEvent(t);
  }
}
class Ea {
  constructor(t, e, n) {
    (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    ya(this, t);
  }
}
const Sa = Xo.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Ca, ka;
null == Sa || Sa(ga, _a), (null !== (Yo = Xo.litHtmlVersions) && void 0 !== Yo ? Yo : (Xo.litHtmlVersions = [])).push('2.7.2');
class Ta extends Vo {
  constructor() {
    super(...arguments), (this.renderOptions = { host: this }), (this._$Do = void 0);
  }
  createRenderRoot() {
    var t, e;
    const n = super.createRenderRoot();
    return (null !== (t = (e = this.renderOptions).renderBefore) && void 0 !== t) || (e.renderBefore = n.firstChild), n;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(t),
      (this._$Do = ((t, e, n) => {
        var r, i;
        const o = null !== (r = null == n ? void 0 : n.renderBefore) && void 0 !== r ? r : e;
        let a = o._$litPart$;
        if (void 0 === a) {
          const t = null !== (i = null == n ? void 0 : n.renderBefore) && void 0 !== i ? i : null;
          o._$litPart$ = a = new _a(e.insertBefore(na(), t), t, void 0, null != n ? n : {});
        }
        return a._$AI(t), a;
      })(e, this.renderRoot, this.renderOptions));
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), null === (t = this._$Do) || void 0 === t || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), null === (t = this._$Do) || void 0 === t || t.setConnected(!1);
  }
  render() {
    return da;
  }
}
(Ta.finalized = !0), (Ta._$litElement$ = !0), null === (Ca = globalThis.litElementHydrateSupport) || void 0 === Ca || Ca.call(globalThis, { LitElement: Ta });
const Na = globalThis.litElementPolyfillSupport;
null == Na || Na({ LitElement: Ta }), (null !== (ka = globalThis.litElementVersions) && void 0 !== ka ? ka : (globalThis.litElementVersions = [])).push('3.3.1');
class Pa extends Ta {
  connectedCallback() {
    super.connectedCallback(), (this.style.display = 'inline-block'), (this.style.lineHeight = '0');
  }
  createRenderRoot() {
    return this;
  }
}
var Da =
  'undefined' != typeof globalThis
    ? globalThis
    : 'undefined' != typeof window
    ? window
    : 'undefined' != typeof global
    ? global
    : 'undefined' != typeof self
    ? self
    : {};
function Oa(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if ('function' == typeof e) {
    var n = function t() {
      return this instanceof t ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return (
    Object.defineProperty(n, '__esModule', { value: !0 }),
    Object.keys(t).forEach(function (e) {
      var r = Object.getOwnPropertyDescriptor(t, e);
      Object.defineProperty(
        n,
        e,
        r.get
          ? r
          : {
              enumerable: !0,
              get: function () {
                return t[e];
              },
            }
      );
    }),
    n
  );
}
var za = {},
  Ra = Oa(N),
  Ia = {},
  ja = {};
function Ua(t, e, n) {
  (t.prototype = e.prototype = n), (n.constructor = t);
}
function Ba(t, e) {
  var n = Object.create(t.prototype);
  for (var r in e) n[r] = e[r];
  return n;
}
function Ha() {}
var qa = 0.7,
  Wa = 1 / qa,
  La = '\\s*([+-]?\\d+)\\s*',
  Fa = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*',
  Va = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
  Ya = /^#([0-9a-f]{3,8})$/,
  Xa = new RegExp(`^rgb\\(${La},${La},${La}\\)$`),
  Za = new RegExp(`^rgb\\(${Va},${Va},${Va}\\)$`),
  Ga = new RegExp(`^rgba\\(${La},${La},${La},${Fa}\\)$`),
  Ka = new RegExp(`^rgba\\(${Va},${Va},${Va},${Fa}\\)$`),
  Ja = new RegExp(`^hsl\\(${Fa},${Va},${Va}\\)$`),
  Qa = new RegExp(`^hsla\\(${Fa},${Va},${Va},${Fa}\\)$`),
  ts = {
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
function es() {
  return this.rgb().formatHex();
}
function ns() {
  return this.rgb().formatRgb();
}
function rs(t) {
  var e, n;
  return (
    (t = (t + '').trim().toLowerCase()),
    (e = Ya.exec(t))
      ? ((n = e[1].length),
        (e = parseInt(e[1], 16)),
        6 === n
          ? is(e)
          : 3 === n
          ? new us(((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), ((15 & e) << 4) | (15 & e), 1)
          : 8 === n
          ? os((e >> 24) & 255, (e >> 16) & 255, (e >> 8) & 255, (255 & e) / 255)
          : 4 === n
          ? os(((e >> 12) & 15) | ((e >> 8) & 240), ((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), (((15 & e) << 4) | (15 & e)) / 255)
          : null)
      : (e = Xa.exec(t))
      ? new us(e[1], e[2], e[3], 1)
      : (e = Za.exec(t))
      ? new us((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, 1)
      : (e = Ga.exec(t))
      ? os(e[1], e[2], e[3], e[4])
      : (e = Ka.exec(t))
      ? os((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, e[4])
      : (e = Ja.exec(t))
      ? ps(e[1], e[2] / 100, e[3] / 100, 1)
      : (e = Qa.exec(t))
      ? ps(e[1], e[2] / 100, e[3] / 100, e[4])
      : ts.hasOwnProperty(t)
      ? is(ts[t])
      : 'transparent' === t
      ? new us(NaN, NaN, NaN, 0)
      : null
  );
}
function is(t) {
  return new us((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1);
}
function os(t, e, n, r) {
  return r <= 0 && (t = e = n = NaN), new us(t, e, n, r);
}
function as(t) {
  return t instanceof Ha || (t = rs(t)), t ? new us((t = t.rgb()).r, t.g, t.b, t.opacity) : new us();
}
function ss(t, e, n, r) {
  return 1 === arguments.length ? as(t) : new us(t, e, n, r ?? 1);
}
function us(t, e, n, r) {
  (this.r = +t), (this.g = +e), (this.b = +n), (this.opacity = +r);
}
function cs() {
  return `#${ds(this.r)}${ds(this.g)}${ds(this.b)}`;
}
function ls() {
  const t = fs(this.opacity);
  return `${1 === t ? 'rgb(' : 'rgba('}${hs(this.r)}, ${hs(this.g)}, ${hs(this.b)}${1 === t ? ')' : `, ${t})`}`;
}
function fs(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function hs(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function ds(t) {
  return ((t = hs(t)) < 16 ? '0' : '') + t.toString(16);
}
function ps(t, e, n, r) {
  return r <= 0 ? (t = e = n = NaN) : n <= 0 || n >= 1 ? (t = e = NaN) : e <= 0 && (t = NaN), new gs(t, e, n, r);
}
function vs(t) {
  if (t instanceof gs) return new gs(t.h, t.s, t.l, t.opacity);
  if ((t instanceof Ha || (t = rs(t)), !t)) return new gs();
  if (t instanceof gs) return t;
  var e = (t = t.rgb()).r / 255,
    n = t.g / 255,
    r = t.b / 255,
    i = Math.min(e, n, r),
    o = Math.max(e, n, r),
    a = NaN,
    s = o - i,
    u = (o + i) / 2;
  return (
    s
      ? ((a = e === o ? (n - r) / s + 6 * (n < r) : n === o ? (r - e) / s + 2 : (e - n) / s + 4), (s /= u < 0.5 ? o + i : 2 - o - i), (a *= 60))
      : (s = u > 0 && u < 1 ? 0 : a),
    new gs(a, s, u, t.opacity)
  );
}
function ms(t, e, n, r) {
  return 1 === arguments.length ? vs(t) : new gs(t, e, n, r ?? 1);
}
function gs(t, e, n, r) {
  (this.h = +t), (this.s = +e), (this.l = +n), (this.opacity = +r);
}
function ys(t) {
  return (t = (t || 0) % 360) < 0 ? t + 360 : t;
}
function bs(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function _s(t, e, n) {
  return 255 * (t < 60 ? e + ((n - e) * t) / 60 : t < 180 ? n : t < 240 ? e + ((n - e) * (240 - t)) / 60 : e);
}
Ua(Ha, rs, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: es,
  formatHex: es,
  formatHex8: function () {
    return this.rgb().formatHex8();
  },
  formatHsl: function () {
    return vs(this).formatHsl();
  },
  formatRgb: ns,
  toString: ns,
}),
  Ua(
    us,
    ss,
    Ba(Ha, {
      brighter(t) {
        return (t = null == t ? Wa : Math.pow(Wa, t)), new us(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? qa : Math.pow(qa, t)), new us(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new us(hs(this.r), hs(this.g), hs(this.b), fs(this.opacity));
      },
      displayable() {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
      },
      hex: cs,
      formatHex: cs,
      formatHex8: function () {
        return `#${ds(this.r)}${ds(this.g)}${ds(this.b)}${ds(255 * (isNaN(this.opacity) ? 1 : this.opacity))}`;
      },
      formatRgb: ls,
      toString: ls,
    })
  ),
  Ua(
    gs,
    ms,
    Ba(Ha, {
      brighter(t) {
        return (t = null == t ? Wa : Math.pow(Wa, t)), new gs(this.h, this.s, this.l * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? qa : Math.pow(qa, t)), new gs(this.h, this.s, this.l * t, this.opacity);
      },
      rgb() {
        var t = (this.h % 360) + 360 * (this.h < 0),
          e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
          n = this.l,
          r = n + (n < 0.5 ? n : 1 - n) * e,
          i = 2 * n - r;
        return new us(_s(t >= 240 ? t - 240 : t + 120, i, r), _s(t, i, r), _s(t < 120 ? t + 240 : t - 120, i, r), this.opacity);
      },
      clamp() {
        return new gs(ys(this.h), bs(this.s), bs(this.l), fs(this.opacity));
      },
      displayable() {
        return ((0 <= this.s && this.s <= 1) || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
      },
      formatHsl() {
        const t = fs(this.opacity);
        return `${1 === t ? 'hsl(' : 'hsla('}${ys(this.h)}, ${100 * bs(this.s)}%, ${100 * bs(this.l)}%${1 === t ? ')' : `, ${t})`}`;
      },
    })
  );
const ws = Math.PI / 180,
  xs = 180 / Math.PI,
  As = 0.96422,
  Ms = 1,
  $s = 0.82521,
  Es = 4 / 29,
  Ss = 6 / 29,
  Cs = 3 * Ss * Ss,
  ks = Ss * Ss * Ss;
function Ts(t) {
  if (t instanceof Ps) return new Ps(t.l, t.a, t.b, t.opacity);
  if (t instanceof Us) return Bs(t);
  t instanceof us || (t = as(t));
  var e,
    n,
    r = Rs(t.r),
    i = Rs(t.g),
    o = Rs(t.b),
    a = Ds((0.2225045 * r + 0.7168786 * i + 0.0606169 * o) / Ms);
  return (
    r === i && i === o
      ? (e = n = a)
      : ((e = Ds((0.4360747 * r + 0.3850649 * i + 0.1430804 * o) / As)), (n = Ds((0.0139322 * r + 0.0971045 * i + 0.7141733 * o) / $s))),
    new Ps(116 * a - 16, 500 * (e - a), 200 * (a - n), t.opacity)
  );
}
function Ns(t, e, n, r) {
  return 1 === arguments.length ? Ts(t) : new Ps(t, e, n, r ?? 1);
}
function Ps(t, e, n, r) {
  (this.l = +t), (this.a = +e), (this.b = +n), (this.opacity = +r);
}
function Ds(t) {
  return t > ks ? Math.pow(t, 1 / 3) : t / Cs + Es;
}
function Os(t) {
  return t > Ss ? t * t * t : Cs * (t - Es);
}
function zs(t) {
  return 255 * (t <= 0.0031308 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055);
}
function Rs(t) {
  return (t /= 255) <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
}
function Is(t) {
  if (t instanceof Us) return new Us(t.h, t.c, t.l, t.opacity);
  if ((t instanceof Ps || (t = Ts(t)), 0 === t.a && 0 === t.b)) return new Us(NaN, 0 < t.l && t.l < 100 ? 0 : NaN, t.l, t.opacity);
  var e = Math.atan2(t.b, t.a) * xs;
  return new Us(e < 0 ? e + 360 : e, Math.sqrt(t.a * t.a + t.b * t.b), t.l, t.opacity);
}
function js(t, e, n, r) {
  return 1 === arguments.length ? Is(t) : new Us(t, e, n, r ?? 1);
}
function Us(t, e, n, r) {
  (this.h = +t), (this.c = +e), (this.l = +n), (this.opacity = +r);
}
function Bs(t) {
  if (isNaN(t.h)) return new Ps(t.l, 0, 0, t.opacity);
  var e = t.h * ws;
  return new Ps(t.l, Math.cos(e) * t.c, Math.sin(e) * t.c, t.opacity);
}
Ua(
  Ps,
  Ns,
  Ba(Ha, {
    brighter(t) {
      return new Ps(this.l + 18 * (t ?? 1), this.a, this.b, this.opacity);
    },
    darker(t) {
      return new Ps(this.l - 18 * (t ?? 1), this.a, this.b, this.opacity);
    },
    rgb() {
      var t = (this.l + 16) / 116,
        e = isNaN(this.a) ? t : t + this.a / 500,
        n = isNaN(this.b) ? t : t - this.b / 200;
      return new us(
        zs(3.1338561 * (e = As * Os(e)) - 1.6168667 * (t = Ms * Os(t)) - 0.4906146 * (n = $s * Os(n))),
        zs(-0.9787684 * e + 1.9161415 * t + 0.033454 * n),
        zs(0.0719453 * e - 0.2289914 * t + 1.4052427 * n),
        this.opacity
      );
    },
  })
),
  Ua(
    Us,
    js,
    Ba(Ha, {
      brighter(t) {
        return new Us(this.h, this.c, this.l + 18 * (t ?? 1), this.opacity);
      },
      darker(t) {
        return new Us(this.h, this.c, this.l - 18 * (t ?? 1), this.opacity);
      },
      rgb() {
        return Bs(this).rgb();
      },
    })
  );
var Hs = -0.14861,
  qs = 1.78277,
  Ws = -0.29227,
  Ls = -0.90649,
  Fs = 1.97294,
  Vs = Fs * Ls,
  Ys = Fs * qs,
  Xs = qs * Ws - Ls * Hs;
function Zs(t, e, n, r) {
  return 1 === arguments.length
    ? (function (t) {
        if (t instanceof Gs) return new Gs(t.h, t.s, t.l, t.opacity);
        t instanceof us || (t = as(t));
        var e = t.r / 255,
          n = t.g / 255,
          r = t.b / 255,
          i = (Xs * r + Vs * e - Ys * n) / (Xs + Vs - Ys),
          o = r - i,
          a = (Fs * (n - i) - Ws * o) / Ls,
          s = Math.sqrt(a * a + o * o) / (Fs * i * (1 - i)),
          u = s ? Math.atan2(a, o) * xs - 120 : NaN;
        return new Gs(u < 0 ? u + 360 : u, s, i, t.opacity);
      })(t)
    : new Gs(t, e, n, r ?? 1);
}
function Gs(t, e, n, r) {
  (this.h = +t), (this.s = +e), (this.l = +n), (this.opacity = +r);
}
Ua(
  Gs,
  Zs,
  Ba(Ha, {
    brighter(t) {
      return (t = null == t ? Wa : Math.pow(Wa, t)), new Gs(this.h, this.s, this.l * t, this.opacity);
    },
    darker(t) {
      return (t = null == t ? qa : Math.pow(qa, t)), new Gs(this.h, this.s, this.l * t, this.opacity);
    },
    rgb() {
      var t = isNaN(this.h) ? 0 : (this.h + 120) * ws,
        e = +this.l,
        n = isNaN(this.s) ? 0 : this.s * e * (1 - e),
        r = Math.cos(t),
        i = Math.sin(t);
      return new us(255 * (e + n * (Hs * r + qs * i)), 255 * (e + n * (Ws * r + Ls * i)), 255 * (e + n * (Fs * r)), this.opacity);
    },
  })
);
var Ks = Object.freeze({
    __proto__: null,
    color: rs,
    cubehelix: Zs,
    gray: function (t, e) {
      return new Ps(t, 0, 0, e ?? 1);
    },
    hcl: js,
    hsl: ms,
    lab: Ns,
    lch: function (t, e, n, r) {
      return 1 === arguments.length ? Is(t) : new Us(n, e, t, r ?? 1);
    },
    rgb: ss,
  }),
  Js = Oa(Ks);
function Qs(t, e) {
  return null == t || null == e ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function tu(t, e) {
  return null == t || null == e ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function eu(t) {
  let e, n, r;
  function i(t, r, i = 0, o = t.length) {
    if (i < o) {
      if (0 !== e(r, r)) return o;
      do {
        const e = (i + o) >>> 1;
        n(t[e], r) < 0 ? (i = e + 1) : (o = e);
      } while (i < o);
    }
    return i;
  }
  return (
    2 !== t.length ? ((e = Qs), (n = (e, n) => Qs(t(e), n)), (r = (e, n) => t(e) - n)) : ((e = t === Qs || t === tu ? t : nu), (n = t), (r = t)),
    {
      left: i,
      center: function (t, e, n = 0, o = t.length) {
        const a = i(t, e, n, o - 1);
        return a > n && r(t[a - 1], e) > -r(t[a], e) ? a - 1 : a;
      },
      right: function (t, r, i = 0, o = t.length) {
        if (i < o) {
          if (0 !== e(r, r)) return o;
          do {
            const e = (i + o) >>> 1;
            n(t[e], r) <= 0 ? (i = e + 1) : (o = e);
          } while (i < o);
        }
        return i;
      },
    }
  );
}
function nu() {
  return 0;
}
function ru(t) {
  return null === t ? NaN : +t;
}
const iu = eu(Qs).right;
eu(ru).center;
class ou extends Map {
  constructor(t, e = su) {
    if ((super(), Object.defineProperties(this, { _intern: { value: new Map() }, _key: { value: e } }), null != t)) for (const [e, n] of t) this.set(e, n);
  }
  get(t) {
    return super.get(au(this, t));
  }
  has(t) {
    return super.has(au(this, t));
  }
  set(t, e) {
    return super.set(
      (function ({ _intern: t, _key: e }, n) {
        const r = e(n);
        return t.has(r) ? t.get(r) : (t.set(r, n), n);
      })(this, t),
      e
    );
  }
  delete(t) {
    return super.delete(
      (function ({ _intern: t, _key: e }, n) {
        const r = e(n);
        t.has(r) && ((n = t.get(r)), t.delete(r));
        return n;
      })(this, t)
    );
  }
}
function au({ _intern: t, _key: e }, n) {
  const r = e(n);
  return t.has(r) ? t.get(r) : n;
}
function su(t) {
  return null !== t && 'object' == typeof t ? t.valueOf() : t;
}
function uu(t, e) {
  return (null == t || !(t >= t)) - (null == e || !(e >= e)) || (t < e ? -1 : t > e ? 1 : 0);
}
const cu = Math.sqrt(50),
  lu = Math.sqrt(10),
  fu = Math.sqrt(2);
function hu(t, e, n) {
  const r = (e - t) / Math.max(0, n),
    i = Math.floor(Math.log10(r)),
    o = r / Math.pow(10, i),
    a = o >= cu ? 10 : o >= lu ? 5 : o >= fu ? 2 : 1;
  let s, u, c;
  return (
    i < 0
      ? ((c = Math.pow(10, -i) / a), (s = Math.round(t * c)), (u = Math.round(e * c)), s / c < t && ++s, u / c > e && --u, (c = -c))
      : ((c = Math.pow(10, i) * a), (s = Math.round(t / c)), (u = Math.round(e / c)), s * c < t && ++s, u * c > e && --u),
    u < s && 0.5 <= n && n < 2 ? hu(t, e, 2 * n) : [s, u, c]
  );
}
function du(t, e, n) {
  if (!((n = +n) > 0)) return [];
  if ((t = +t) === (e = +e)) return [t];
  const r = e < t,
    [i, o, a] = r ? hu(e, t, n) : hu(t, e, n);
  if (!(o >= i)) return [];
  const s = o - i + 1,
    u = new Array(s);
  if (r)
    if (a < 0) for (let t = 0; t < s; ++t) u[t] = (o - t) / -a;
    else for (let t = 0; t < s; ++t) u[t] = (o - t) * a;
  else if (a < 0) for (let t = 0; t < s; ++t) u[t] = (i + t) / -a;
  else for (let t = 0; t < s; ++t) u[t] = (i + t) * a;
  return u;
}
function pu(t, e, n) {
  return hu((t = +t), (e = +e), (n = +n))[2];
}
function vu(t, e, n) {
  n = +n;
  const r = (e = +e) < (t = +t),
    i = r ? pu(e, t, n) : pu(t, e, n);
  return (r ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
function mu(t, e) {
  let n;
  if (void 0 === e) for (const e of t) null != e && (n < e || (void 0 === n && e >= e)) && (n = e);
  else {
    let r = -1;
    for (let i of t) null != (i = e(i, ++r, t)) && (n < i || (void 0 === n && i >= i)) && (n = i);
  }
  return n;
}
function gu(t, e) {
  let n;
  if (void 0 === e) for (const e of t) null != e && (n > e || (void 0 === n && e >= e)) && (n = e);
  else {
    let r = -1;
    for (let i of t) null != (i = e(i, ++r, t)) && (n > i || (void 0 === n && i >= i)) && (n = i);
  }
  return n;
}
function yu(t, e, n = 0, r = 1 / 0, i) {
  if (((e = Math.floor(e)), (n = Math.floor(Math.max(0, n))), (r = Math.floor(Math.min(t.length - 1, r))), !(n <= e && e <= r))) return t;
  for (
    i =
      void 0 === i
        ? uu
        : (function (t = Qs) {
            if (t === Qs) return uu;
            if ('function' != typeof t) throw new TypeError('compare is not a function');
            return (e, n) => {
              const r = t(e, n);
              return r || 0 === r ? r : (0 === t(n, n)) - (0 === t(e, e));
            };
          })(i);
    r > n;

  ) {
    if (r - n > 600) {
      const o = r - n + 1,
        a = e - n + 1,
        s = Math.log(o),
        u = 0.5 * Math.exp((2 * s) / 3),
        c = 0.5 * Math.sqrt((s * u * (o - u)) / o) * (a - o / 2 < 0 ? -1 : 1);
      yu(t, e, Math.max(n, Math.floor(e - (a * u) / o + c)), Math.min(r, Math.floor(e + ((o - a) * u) / o + c)), i);
    }
    const o = t[e];
    let a = n,
      s = r;
    for (bu(t, n, e), i(t[r], o) > 0 && bu(t, n, r); a < s; ) {
      for (bu(t, a, s), ++a, --s; i(t[a], o) < 0; ) ++a;
      for (; i(t[s], o) > 0; ) --s;
    }
    0 === i(t[n], o) ? bu(t, n, s) : (++s, bu(t, s, r)), s <= e && (n = s + 1), e <= s && (r = s - 1);
  }
  return t;
}
function bu(t, e, n) {
  const r = t[e];
  (t[e] = t[n]), (t[n] = r);
}
function _u(t, e, n = ru) {
  if ((r = t.length) && !isNaN((e = +e))) {
    if (e <= 0 || r < 2) return +n(t[0], 0, t);
    if (e >= 1) return +n(t[r - 1], r - 1, t);
    var r,
      i = (r - 1) * e,
      o = Math.floor(i),
      a = +n(t[o], o, t);
    return a + (+n(t[o + 1], o + 1, t) - a) * (i - o);
  }
}
function wu(t, e) {
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
function xu(t, e) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      'function' == typeof t ? this.interpolator(t) : this.range(t);
      break;
    default:
      this.domain(t), 'function' == typeof e ? this.interpolator(e) : this.range(e);
  }
  return this;
}
const Au = Symbol('implicit');
function Mu() {
  var t = new ou(),
    e = [],
    n = [],
    r = Au;
  function i(i) {
    let o = t.get(i);
    if (void 0 === o) {
      if (r !== Au) return r;
      t.set(i, (o = e.push(i) - 1));
    }
    return n[o % n.length];
  }
  return (
    (i.domain = function (n) {
      if (!arguments.length) return e.slice();
      (e = []), (t = new ou());
      for (const r of n) t.has(r) || t.set(r, e.push(r) - 1);
      return i;
    }),
    (i.range = function (t) {
      return arguments.length ? ((n = Array.from(t)), i) : n.slice();
    }),
    (i.unknown = function (t) {
      return arguments.length ? ((r = t), i) : r;
    }),
    (i.copy = function () {
      return Mu(e, n).unknown(r);
    }),
    wu.apply(i, arguments),
    i
  );
}
function $u() {
  var t,
    e,
    n = Mu().unknown(void 0),
    r = n.domain,
    i = n.range,
    o = 0,
    a = 1,
    s = !1,
    u = 0,
    c = 0,
    l = 0.5;
  function f() {
    var n = r().length,
      f = a < o,
      h = f ? a : o,
      d = f ? o : a;
    (t = (d - h) / Math.max(1, n - u + 2 * c)),
      s && (t = Math.floor(t)),
      (h += (d - h - t * (n - u)) * l),
      (e = t * (1 - u)),
      s && ((h = Math.round(h)), (e = Math.round(e)));
    var p = (function (t, e, n) {
      (t = +t), (e = +e), (n = (i = arguments.length) < 2 ? ((e = t), (t = 0), 1) : i < 3 ? 1 : +n);
      for (var r = -1, i = 0 | Math.max(0, Math.ceil((e - t) / n)), o = new Array(i); ++r < i; ) o[r] = t + r * n;
      return o;
    })(n).map(function (e) {
      return h + t * e;
    });
    return i(f ? p.reverse() : p);
  }
  return (
    delete n.unknown,
    (n.domain = function (t) {
      return arguments.length ? (r(t), f()) : r();
    }),
    (n.range = function (t) {
      return arguments.length ? (([o, a] = t), (o = +o), (a = +a), f()) : [o, a];
    }),
    (n.rangeRound = function (t) {
      return ([o, a] = t), (o = +o), (a = +a), (s = !0), f();
    }),
    (n.bandwidth = function () {
      return e;
    }),
    (n.step = function () {
      return t;
    }),
    (n.round = function (t) {
      return arguments.length ? ((s = !!t), f()) : s;
    }),
    (n.padding = function (t) {
      return arguments.length ? ((u = Math.min(1, (c = +t))), f()) : u;
    }),
    (n.paddingInner = function (t) {
      return arguments.length ? ((u = Math.min(1, t)), f()) : u;
    }),
    (n.paddingOuter = function (t) {
      return arguments.length ? ((c = +t), f()) : c;
    }),
    (n.align = function (t) {
      return arguments.length ? ((l = Math.max(0, Math.min(1, t))), f()) : l;
    }),
    (n.copy = function () {
      return $u(r(), [o, a]).round(s).paddingInner(u).paddingOuter(c).align(l);
    }),
    wu.apply(f(), arguments)
  );
}
function Eu(t) {
  var e = t.copy;
  return (
    (t.padding = t.paddingOuter),
    delete t.paddingInner,
    delete t.paddingOuter,
    (t.copy = function () {
      return Eu(e());
    }),
    t
  );
}
var Su = (t) => () => t;
function Cu(t, e) {
  return function (n) {
    return t + n * e;
  };
}
function ku(t) {
  return 1 == (t = +t)
    ? Tu
    : function (e, n) {
        return n - e
          ? (function (t, e, n) {
              return (
                (t = Math.pow(t, n)),
                (e = Math.pow(e, n) - t),
                (n = 1 / n),
                function (r) {
                  return Math.pow(t + r * e, n);
                }
              );
            })(e, n, t)
          : Su(isNaN(e) ? n : e);
      };
}
function Tu(t, e) {
  var n = e - t;
  return n ? Cu(t, n) : Su(isNaN(t) ? e : t);
}
var Nu = (function t(e) {
  var n = ku(e);
  function r(t, e) {
    var r = n((t = ss(t)).r, (e = ss(e)).r),
      i = n(t.g, e.g),
      o = n(t.b, e.b),
      a = Tu(t.opacity, e.opacity);
    return function (e) {
      return (t.r = r(e)), (t.g = i(e)), (t.b = o(e)), (t.opacity = a(e)), t + '';
    };
  }
  return (r.gamma = t), r;
})(1);
var Pu,
  Du =
    ((Pu = function (t) {
      var e = t.length - 1;
      return function (n) {
        var r = n <= 0 ? (n = 0) : n >= 1 ? ((n = 1), e - 1) : Math.floor(n * e),
          i = t[r],
          o = t[r + 1],
          a = r > 0 ? t[r - 1] : 2 * i - o,
          s = r < e - 1 ? t[r + 2] : 2 * o - i;
        return (function (t, e, n, r, i) {
          var o = t * t,
            a = o * t;
          return ((1 - 3 * t + 3 * o - a) * e + (4 - 6 * o + 3 * a) * n + (1 + 3 * t + 3 * o - 3 * a) * r + a * i) / 6;
        })((n - r / e) * e, a, i, o, s);
      };
    }),
    function (t) {
      var e,
        n,
        r = t.length,
        i = new Array(r),
        o = new Array(r),
        a = new Array(r);
      for (e = 0; e < r; ++e) (n = ss(t[e])), (i[e] = n.r || 0), (o[e] = n.g || 0), (a[e] = n.b || 0);
      return (
        (i = Pu(i)),
        (o = Pu(o)),
        (a = Pu(a)),
        (n.opacity = 1),
        function (t) {
          return (n.r = i(t)), (n.g = o(t)), (n.b = a(t)), n + '';
        }
      );
    });
function Ou(t, e) {
  e || (e = []);
  var n,
    r = t ? Math.min(e.length, t.length) : 0,
    i = e.slice();
  return function (o) {
    for (n = 0; n < r; ++n) i[n] = t[n] * (1 - o) + e[n] * o;
    return i;
  };
}
function zu(t, e) {
  var n,
    r = e ? e.length : 0,
    i = t ? Math.min(r, t.length) : 0,
    o = new Array(i),
    a = new Array(r);
  for (n = 0; n < i; ++n) o[n] = qu(t[n], e[n]);
  for (; n < r; ++n) a[n] = e[n];
  return function (t) {
    for (n = 0; n < i; ++n) a[n] = o[n](t);
    return a;
  };
}
function Ru(t, e) {
  var n = new Date();
  return (
    (t = +t),
    (e = +e),
    function (r) {
      return n.setTime(t * (1 - r) + e * r), n;
    }
  );
}
function Iu(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return t * (1 - n) + e * n;
    }
  );
}
function ju(t, e) {
  var n,
    r = {},
    i = {};
  for (n in ((null !== t && 'object' == typeof t) || (t = {}), (null !== e && 'object' == typeof e) || (e = {}), e)) n in t ? (r[n] = qu(t[n], e[n])) : (i[n] = e[n]);
  return function (t) {
    for (n in r) i[n] = r[n](t);
    return i;
  };
}
var Uu = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  Bu = new RegExp(Uu.source, 'g');
function Hu(t, e) {
  var n,
    r,
    i,
    o = (Uu.lastIndex = Bu.lastIndex = 0),
    a = -1,
    s = [],
    u = [];
  for (t += '', e += ''; (n = Uu.exec(t)) && (r = Bu.exec(e)); )
    (i = r.index) > o && ((i = e.slice(o, i)), s[a] ? (s[a] += i) : (s[++a] = i)),
      (n = n[0]) === (r = r[0]) ? (s[a] ? (s[a] += r) : (s[++a] = r)) : ((s[++a] = null), u.push({ i: a, x: Iu(n, r) })),
      (o = Bu.lastIndex);
  return (
    o < e.length && ((i = e.slice(o)), s[a] ? (s[a] += i) : (s[++a] = i)),
    s.length < 2
      ? u[0]
        ? (function (t) {
            return function (e) {
              return t(e) + '';
            };
          })(u[0].x)
        : (function (t) {
            return function () {
              return t;
            };
          })(e)
      : ((e = u.length),
        function (t) {
          for (var n, r = 0; r < e; ++r) s[(n = u[r]).i] = n.x(t);
          return s.join('');
        })
  );
}
function qu(t, e) {
  var n,
    r = typeof e;
  return null == e || 'boolean' === r
    ? Su(e)
    : ('number' === r
        ? Iu
        : 'string' === r
        ? (n = rs(e))
          ? ((e = n), Nu)
          : Hu
        : e instanceof rs
        ? Nu
        : e instanceof Date
        ? Ru
        : (function (t) {
            return ArrayBuffer.isView(t) && !(t instanceof DataView);
          })(e)
        ? Ou
        : Array.isArray(e)
        ? zu
        : ('function' != typeof e.valueOf && 'function' != typeof e.toString) || isNaN(e)
        ? ju
        : Iu)(t, e);
}
function Wu(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return Math.round(t * (1 - n) + e * n);
    }
  );
}
var Lu,
  Fu = 180 / Math.PI,
  Vu = { translateX: 0, translateY: 0, rotate: 0, skewX: 0, scaleX: 1, scaleY: 1 };
function Yu(t, e, n, r, i, o) {
  var a, s, u;
  return (
    (a = Math.sqrt(t * t + e * e)) && ((t /= a), (e /= a)),
    (u = t * n + e * r) && ((n -= t * u), (r -= e * u)),
    (s = Math.sqrt(n * n + r * r)) && ((n /= s), (r /= s), (u /= s)),
    t * r < e * n && ((t = -t), (e = -e), (u = -u), (a = -a)),
    { translateX: i, translateY: o, rotate: Math.atan2(e, t) * Fu, skewX: Math.atan(u) * Fu, scaleX: a, scaleY: s }
  );
}
function Xu(t, e, n, r) {
  function i(t) {
    return t.length ? t.pop() + ' ' : '';
  }
  return function (o, a) {
    var s = [],
      u = [];
    return (
      (o = t(o)),
      (a = t(a)),
      (function (t, r, i, o, a, s) {
        if (t !== i || r !== o) {
          var u = a.push('translate(', null, e, null, n);
          s.push({ i: u - 4, x: Iu(t, i) }, { i: u - 2, x: Iu(r, o) });
        } else (i || o) && a.push('translate(' + i + e + o + n);
      })(o.translateX, o.translateY, a.translateX, a.translateY, s, u),
      (function (t, e, n, o) {
        t !== e
          ? (t - e > 180 ? (e += 360) : e - t > 180 && (t += 360), o.push({ i: n.push(i(n) + 'rotate(', null, r) - 2, x: Iu(t, e) }))
          : e && n.push(i(n) + 'rotate(' + e + r);
      })(o.rotate, a.rotate, s, u),
      (function (t, e, n, o) {
        t !== e ? o.push({ i: n.push(i(n) + 'skewX(', null, r) - 2, x: Iu(t, e) }) : e && n.push(i(n) + 'skewX(' + e + r);
      })(o.skewX, a.skewX, s, u),
      (function (t, e, n, r, o, a) {
        if (t !== n || e !== r) {
          var s = o.push(i(o) + 'scale(', null, ',', null, ')');
          a.push({ i: s - 4, x: Iu(t, n) }, { i: s - 2, x: Iu(e, r) });
        } else (1 === n && 1 === r) || o.push(i(o) + 'scale(' + n + ',' + r + ')');
      })(o.scaleX, o.scaleY, a.scaleX, a.scaleY, s, u),
      (o = a = null),
      function (t) {
        for (var e, n = -1, r = u.length; ++n < r; ) s[(e = u[n]).i] = e.x(t);
        return s.join('');
      }
    );
  };
}
var Zu = Xu(
    function (t) {
      const e = new ('function' == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(t + '');
      return e.isIdentity ? Vu : Yu(e.a, e.b, e.c, e.d, e.e, e.f);
    },
    'px, ',
    'px)',
    'deg)'
  ),
  Gu = Xu(
    function (t) {
      return null == t
        ? Vu
        : (Lu || (Lu = document.createElementNS('http://www.w3.org/2000/svg', 'g')),
          Lu.setAttribute('transform', t),
          (t = Lu.transform.baseVal.consolidate()) ? Yu((t = t.matrix).a, t.b, t.c, t.d, t.e, t.f) : Vu);
    },
    ', ',
    ')',
    ')'
  );
function Ku(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
var Ju = (function t(e, n, r) {
  function i(t, i) {
    var o,
      a,
      s = t[0],
      u = t[1],
      c = t[2],
      l = i[0],
      f = i[1],
      h = i[2],
      d = l - s,
      p = f - u,
      v = d * d + p * p;
    if (v < 1e-12)
      (a = Math.log(h / c) / e),
        (o = function (t) {
          return [s + t * d, u + t * p, c * Math.exp(e * t * a)];
        });
    else {
      var m = Math.sqrt(v),
        g = (h * h - c * c + r * v) / (2 * c * n * m),
        y = (h * h - c * c - r * v) / (2 * h * n * m),
        b = Math.log(Math.sqrt(g * g + 1) - g),
        _ = Math.log(Math.sqrt(y * y + 1) - y);
      (a = (_ - b) / e),
        (o = function (t) {
          var r = t * a,
            i = Ku(b),
            o =
              (c / (n * m)) *
              (i *
                (function (t) {
                  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
                })(e * r + b) -
                (function (t) {
                  return ((t = Math.exp(t)) - 1 / t) / 2;
                })(b));
          return [s + o * d, u + o * p, (c * i) / Ku(e * r + b)];
        });
    }
    return (o.duration = (1e3 * a * e) / Math.SQRT2), o;
  }
  return (
    (i.rho = function (e) {
      var n = Math.max(0.001, +e),
        r = n * n;
      return t(n, r, r * r);
    }),
    i
  );
})(Math.SQRT2, 2, 4);
function Qu(t) {
  return (function e(n) {
    function r(e, r) {
      var i = t((e = Zs(e)).h, (r = Zs(r)).h),
        o = Tu(e.s, r.s),
        a = Tu(e.l, r.l),
        s = Tu(e.opacity, r.opacity);
      return function (t) {
        return (e.h = i(t)), (e.s = o(t)), (e.l = a(Math.pow(t, n))), (e.opacity = s(t)), e + '';
      };
    }
    return (n = +n), (r.gamma = e), r;
  })(1);
}
Qu(function (t, e) {
  var n = e - t;
  return n ? Cu(t, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : Su(isNaN(t) ? e : t);
});
var tc = Qu(Tu);
function ec(t) {
  return +t;
}
var nc = [0, 1];
function rc(t) {
  return t;
}
function ic(t, e) {
  return (e -= t = +t)
    ? function (n) {
        return (n - t) / e;
      }
    : (function (t) {
        return function () {
          return t;
        };
      })(isNaN(e) ? NaN : 0.5);
}
function oc(t, e, n) {
  var r = t[0],
    i = t[1],
    o = e[0],
    a = e[1];
  return (
    i < r ? ((r = ic(i, r)), (o = n(a, o))) : ((r = ic(r, i)), (o = n(o, a))),
    function (t) {
      return o(r(t));
    }
  );
}
function ac(t, e, n) {
  var r = Math.min(t.length, e.length) - 1,
    i = new Array(r),
    o = new Array(r),
    a = -1;
  for (t[r] < t[0] && ((t = t.slice().reverse()), (e = e.slice().reverse())); ++a < r; ) (i[a] = ic(t[a], t[a + 1])), (o[a] = n(e[a], e[a + 1]));
  return function (e) {
    var n = iu(t, e, 1, r) - 1;
    return o[n](i[n](e));
  };
}
function sc(t, e) {
  return e.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp()).unknown(t.unknown());
}
function uc() {
  var t,
    e,
    n,
    r,
    i,
    o,
    a = nc,
    s = nc,
    u = qu,
    c = rc;
  function l() {
    var t = Math.min(a.length, s.length);
    return (
      c !== rc &&
        (c = (function (t, e) {
          var n;
          return (
            t > e && ((n = t), (t = e), (e = n)),
            function (n) {
              return Math.max(t, Math.min(e, n));
            }
          );
        })(a[0], a[t - 1])),
      (r = t > 2 ? ac : oc),
      (i = o = null),
      f
    );
  }
  function f(e) {
    return null == e || isNaN((e = +e)) ? n : (i || (i = r(a.map(t), s, u)))(t(c(e)));
  }
  return (
    (f.invert = function (n) {
      return c(e((o || (o = r(s, a.map(t), Iu)))(n)));
    }),
    (f.domain = function (t) {
      return arguments.length ? ((a = Array.from(t, ec)), l()) : a.slice();
    }),
    (f.range = function (t) {
      return arguments.length ? ((s = Array.from(t)), l()) : s.slice();
    }),
    (f.rangeRound = function (t) {
      return (s = Array.from(t)), (u = Wu), l();
    }),
    (f.clamp = function (t) {
      return arguments.length ? ((c = !!t || rc), l()) : c !== rc;
    }),
    (f.interpolate = function (t) {
      return arguments.length ? ((u = t), l()) : u;
    }),
    (f.unknown = function (t) {
      return arguments.length ? ((n = t), f) : n;
    }),
    function (n, r) {
      return (t = n), (e = r), l();
    }
  );
}
function cc() {
  return uc()(rc, rc);
}
function lc(t, e) {
  if ((n = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf('e')) < 0) return null;
  var n,
    r = t.slice(0, n);
  return [r.length > 1 ? r[0] + r.slice(2) : r, +t.slice(n + 1)];
}
function fc(t) {
  return (t = lc(Math.abs(t))) ? t[1] : NaN;
}
var hc,
  dc = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function pc(t) {
  if (!(e = dc.exec(t))) throw new Error('invalid format: ' + t);
  var e;
  return new vc({
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
function vc(t) {
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
function mc(t, e) {
  var n = lc(t, e);
  if (!n) return t + '';
  var r = n[0],
    i = n[1];
  return i < 0 ? '0.' + new Array(-i).join('0') + r : r.length > i + 1 ? r.slice(0, i + 1) + '.' + r.slice(i + 1) : r + new Array(i - r.length + 2).join('0');
}
(pc.prototype = vc.prototype),
  (vc.prototype.toString = function () {
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
var gc = {
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
  p: (t, e) => mc(100 * t, e),
  r: mc,
  s: function (t, e) {
    var n = lc(t, e);
    if (!n) return t + '';
    var r = n[0],
      i = n[1],
      o = i - (hc = 3 * Math.max(-8, Math.min(8, Math.floor(i / 3)))) + 1,
      a = r.length;
    return o === a
      ? r
      : o > a
      ? r + new Array(o - a + 1).join('0')
      : o > 0
      ? r.slice(0, o) + '.' + r.slice(o)
      : '0.' + new Array(1 - o).join('0') + lc(t, Math.max(0, e + o - 1))[0];
  },
  X: (t) => Math.round(t).toString(16).toUpperCase(),
  x: (t) => Math.round(t).toString(16),
};
function yc(t) {
  return t;
}
var bc,
  _c,
  wc,
  xc = Array.prototype.map,
  Ac = ['y', 'z', 'a', 'f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
function Mc(t) {
  var e,
    n,
    r =
      void 0 === t.grouping || void 0 === t.thousands
        ? yc
        : ((e = xc.call(t.grouping, Number)),
          (n = t.thousands + ''),
          function (t, r) {
            for (
              var i = t.length, o = [], a = 0, s = e[0], u = 0;
              i > 0 && s > 0 && (u + s + 1 > r && (s = Math.max(1, r - u)), o.push(t.substring((i -= s), i + s)), !((u += s + 1) > r));

            )
              s = e[(a = (a + 1) % e.length)];
            return o.reverse().join(n);
          }),
    i = void 0 === t.currency ? '' : t.currency[0] + '',
    o = void 0 === t.currency ? '' : t.currency[1] + '',
    a = void 0 === t.decimal ? '.' : t.decimal + '',
    s =
      void 0 === t.numerals
        ? yc
        : (function (t) {
            return function (e) {
              return e.replace(/[0-9]/g, function (e) {
                return t[+e];
              });
            };
          })(xc.call(t.numerals, String)),
    u = void 0 === t.percent ? '%' : t.percent + '',
    c = void 0 === t.minus ? '−' : t.minus + '',
    l = void 0 === t.nan ? 'NaN' : t.nan + '';
  function f(t) {
    var e = (t = pc(t)).fill,
      n = t.align,
      f = t.sign,
      h = t.symbol,
      d = t.zero,
      p = t.width,
      v = t.comma,
      m = t.precision,
      g = t.trim,
      y = t.type;
    'n' === y ? ((v = !0), (y = 'g')) : gc[y] || (void 0 === m && (m = 12), (g = !0), (y = 'g')), (d || ('0' === e && '=' === n)) && ((d = !0), (e = '0'), (n = '='));
    var b = '$' === h ? i : '#' === h && /[boxX]/.test(y) ? '0' + y.toLowerCase() : '',
      _ = '$' === h ? o : /[%p]/.test(y) ? u : '',
      w = gc[y],
      x = /[defgprs%]/.test(y);
    function A(t) {
      var i,
        o,
        u,
        h = b,
        A = _;
      if ('c' === y) (A = w(t) + A), (t = '');
      else {
        var M = (t = +t) < 0 || 1 / t < 0;
        if (
          ((t = isNaN(t) ? l : w(Math.abs(t), m)),
          g &&
            (t = (function (t) {
              t: for (var e, n = t.length, r = 1, i = -1; r < n; ++r)
                switch (t[r]) {
                  case '.':
                    i = e = r;
                    break;
                  case '0':
                    0 === i && (i = r), (e = r);
                    break;
                  default:
                    if (!+t[r]) break t;
                    i > 0 && (i = 0);
                }
              return i > 0 ? t.slice(0, i) + t.slice(e + 1) : t;
            })(t)),
          M && 0 == +t && '+' !== f && (M = !1),
          (h = (M ? ('(' === f ? f : c) : '-' === f || '(' === f ? '' : f) + h),
          (A = ('s' === y ? Ac[8 + hc / 3] : '') + A + (M && '(' === f ? ')' : '')),
          x)
        )
          for (i = -1, o = t.length; ++i < o; )
            if (48 > (u = t.charCodeAt(i)) || u > 57) {
              (A = (46 === u ? a + t.slice(i + 1) : t.slice(i)) + A), (t = t.slice(0, i));
              break;
            }
      }
      v && !d && (t = r(t, 1 / 0));
      var $ = h.length + t.length + A.length,
        E = $ < p ? new Array(p - $ + 1).join(e) : '';
      switch ((v && d && ((t = r(E + t, E.length ? p - A.length : 1 / 0)), (E = '')), n)) {
        case '<':
          t = h + t + A + E;
          break;
        case '=':
          t = h + E + t + A;
          break;
        case '^':
          t = E.slice(0, ($ = E.length >> 1)) + h + t + A + E.slice($);
          break;
        default:
          t = E + h + t + A;
      }
      return s(t);
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
    format: f,
    formatPrefix: function (t, e) {
      var n = f((((t = pc(t)).type = 'f'), t)),
        r = 3 * Math.max(-8, Math.min(8, Math.floor(fc(e) / 3))),
        i = Math.pow(10, -r),
        o = Ac[8 + r / 3];
      return function (t) {
        return n(i * t) + o;
      };
    },
  };
}
function $c(t, e, n, r) {
  var i,
    o = vu(t, e, n);
  switch ((r = pc(r ?? ',f')).type) {
    case 's':
      var a = Math.max(Math.abs(t), Math.abs(e));
      return (
        null != r.precision ||
          isNaN(
            (i = (function (t, e) {
              return Math.max(0, 3 * Math.max(-8, Math.min(8, Math.floor(fc(e) / 3))) - fc(Math.abs(t)));
            })(o, a))
          ) ||
          (r.precision = i),
        wc(r, a)
      );
    case '':
    case 'e':
    case 'g':
    case 'p':
    case 'r':
      null != r.precision ||
        isNaN(
          (i = (function (t, e) {
            return (t = Math.abs(t)), (e = Math.abs(e) - t), Math.max(0, fc(e) - fc(t)) + 1;
          })(o, Math.max(Math.abs(t), Math.abs(e))))
        ) ||
        (r.precision = i - ('e' === r.type));
      break;
    case 'f':
    case '%':
      null != r.precision ||
        isNaN(
          (i = (function (t) {
            return Math.max(0, -fc(Math.abs(t)));
          })(o))
        ) ||
        (r.precision = i - 2 * ('%' === r.type));
  }
  return _c(r);
}
function Ec(t) {
  var e = t.domain;
  return (
    (t.ticks = function (t) {
      var n = e();
      return du(n[0], n[n.length - 1], t ?? 10);
    }),
    (t.tickFormat = function (t, n) {
      var r = e();
      return $c(r[0], r[r.length - 1], t ?? 10, n);
    }),
    (t.nice = function (n) {
      null == n && (n = 10);
      var r,
        i,
        o = e(),
        a = 0,
        s = o.length - 1,
        u = o[a],
        c = o[s],
        l = 10;
      for (c < u && ((i = u), (u = c), (c = i), (i = a), (a = s), (s = i)); l-- > 0; ) {
        if ((i = pu(u, c, n)) === r) return (o[a] = u), (o[s] = c), e(o);
        if (i > 0) (u = Math.floor(u / i) * i), (c = Math.ceil(c / i) * i);
        else {
          if (!(i < 0)) break;
          (u = Math.ceil(u * i) / i), (c = Math.floor(c * i) / i);
        }
        r = i;
      }
      return t;
    }),
    t
  );
}
function Sc(t, e) {
  var n,
    r = 0,
    i = (t = t.slice()).length - 1,
    o = t[r],
    a = t[i];
  return a < o && ((n = r), (r = i), (i = n), (n = o), (o = a), (a = n)), (t[r] = e.floor(o)), (t[i] = e.ceil(a)), t;
}
function Cc(t) {
  return Math.log(t);
}
function kc(t) {
  return Math.exp(t);
}
function Tc(t) {
  return -Math.log(-t);
}
function Nc(t) {
  return -Math.exp(-t);
}
function Pc(t) {
  return isFinite(t) ? +('1e' + t) : t < 0 ? 0 : t;
}
function Dc(t) {
  return (e, n) => -t(-e, n);
}
function Oc(t) {
  const e = t(Cc, kc),
    n = e.domain;
  let r,
    i,
    o = 10;
  function a() {
    return (
      (r = (function (t) {
        return t === Math.E ? Math.log : (10 === t && Math.log10) || (2 === t && Math.log2) || ((t = Math.log(t)), (e) => Math.log(e) / t);
      })(o)),
      (i = (function (t) {
        return 10 === t ? Pc : t === Math.E ? Math.exp : (e) => Math.pow(t, e);
      })(o)),
      n()[0] < 0 ? ((r = Dc(r)), (i = Dc(i)), t(Tc, Nc)) : t(Cc, kc),
      e
    );
  }
  return (
    (e.base = function (t) {
      return arguments.length ? ((o = +t), a()) : o;
    }),
    (e.domain = function (t) {
      return arguments.length ? (n(t), a()) : n();
    }),
    (e.ticks = (t) => {
      const e = n();
      let a = e[0],
        s = e[e.length - 1];
      const u = s < a;
      u && ([a, s] = [s, a]);
      let c,
        l,
        f = r(a),
        h = r(s);
      const d = null == t ? 10 : +t;
      let p = [];
      if (!(o % 1) && h - f < d) {
        if (((f = Math.floor(f)), (h = Math.ceil(h)), a > 0)) {
          for (; f <= h; ++f)
            for (c = 1; c < o; ++c)
              if (((l = f < 0 ? c / i(-f) : c * i(f)), !(l < a))) {
                if (l > s) break;
                p.push(l);
              }
        } else
          for (; f <= h; ++f)
            for (c = o - 1; c >= 1; --c)
              if (((l = f > 0 ? c / i(-f) : c * i(f)), !(l < a))) {
                if (l > s) break;
                p.push(l);
              }
        2 * p.length < d && (p = du(a, s, d));
      } else p = du(f, h, Math.min(h - f, d)).map(i);
      return u ? p.reverse() : p;
    }),
    (e.tickFormat = (t, n) => {
      if (
        (null == t && (t = 10),
        null == n && (n = 10 === o ? 's' : ','),
        'function' != typeof n && (o % 1 || null != (n = pc(n)).precision || (n.trim = !0), (n = _c(n))),
        t === 1 / 0)
      )
        return n;
      const a = Math.max(1, (o * t) / e.ticks().length);
      return (t) => {
        let e = t / i(Math.round(r(t)));
        return e * o < o - 0.5 && (e *= o), e <= a ? n(t) : '';
      };
    }),
    (e.nice = () => n(Sc(n(), { floor: (t) => i(Math.floor(r(t))), ceil: (t) => i(Math.ceil(r(t))) }))),
    e
  );
}
function zc(t) {
  return function (e) {
    return Math.sign(e) * Math.log1p(Math.abs(e / t));
  };
}
function Rc(t) {
  return function (e) {
    return Math.sign(e) * Math.expm1(Math.abs(e)) * t;
  };
}
function Ic(t) {
  var e = 1,
    n = t(zc(e), Rc(e));
  return (
    (n.constant = function (n) {
      return arguments.length ? t(zc((e = +n)), Rc(e)) : e;
    }),
    Ec(n)
  );
}
function jc(t) {
  return function (e) {
    return e < 0 ? -Math.pow(-e, t) : Math.pow(e, t);
  };
}
function Uc(t) {
  return t < 0 ? -Math.sqrt(-t) : Math.sqrt(t);
}
function Bc(t) {
  return t < 0 ? -t * t : t * t;
}
function Hc(t) {
  var e = t(rc, rc),
    n = 1;
  return (
    (e.exponent = function (e) {
      return arguments.length ? (1 === (n = +e) ? t(rc, rc) : 0.5 === n ? t(Uc, Bc) : t(jc(n), jc(1 / n))) : n;
    }),
    Ec(e)
  );
}
function qc() {
  var t = Hc(uc());
  return (
    (t.copy = function () {
      return sc(t, qc()).exponent(t.exponent());
    }),
    wu.apply(t, arguments),
    t
  );
}
function Wc(t) {
  return Math.sign(t) * t * t;
}
(bc = Mc({ thousands: ',', grouping: [3], currency: ['$', ''] })), (_c = bc.format), (wc = bc.formatPrefix);
const Lc = new Date(),
  Fc = new Date();
function Vc(t, e, n, r) {
  function i(e) {
    return t((e = 0 === arguments.length ? new Date() : new Date(+e))), e;
  }
  return (
    (i.floor = (e) => (t((e = new Date(+e))), e)),
    (i.ceil = (n) => (t((n = new Date(n - 1))), e(n, 1), t(n), n)),
    (i.round = (t) => {
      const e = i(t),
        n = i.ceil(t);
      return t - e < n - t ? e : n;
    }),
    (i.offset = (t, n) => (e((t = new Date(+t)), null == n ? 1 : Math.floor(n)), t)),
    (i.range = (n, r, o) => {
      const a = [];
      if (((n = i.ceil(n)), (o = null == o ? 1 : Math.floor(o)), !(n < r && o > 0))) return a;
      let s;
      do {
        a.push((s = new Date(+n))), e(n, o), t(n);
      } while (s < n && n < r);
      return a;
    }),
    (i.filter = (n) =>
      Vc(
        (e) => {
          if (e >= e) for (; t(e), !n(e); ) e.setTime(e - 1);
        },
        (t, r) => {
          if (t >= t)
            if (r < 0) for (; ++r <= 0; ) for (; e(t, -1), !n(t); );
            else for (; --r >= 0; ) for (; e(t, 1), !n(t); );
        }
      )),
    n &&
      ((i.count = (e, r) => (Lc.setTime(+e), Fc.setTime(+r), t(Lc), t(Fc), Math.floor(n(Lc, Fc)))),
      (i.every = (t) => ((t = Math.floor(t)), isFinite(t) && t > 0 ? (t > 1 ? i.filter(r ? (e) => r(e) % t == 0 : (e) => i.count(0, e) % t == 0) : i) : null))),
    i
  );
}
const Yc = Vc(
  () => {},
  (t, e) => {
    t.setTime(+t + e);
  },
  (t, e) => e - t
);
(Yc.every = (t) => (
  (t = Math.floor(t)),
  isFinite(t) && t > 0
    ? t > 1
      ? Vc(
          (e) => {
            e.setTime(Math.floor(e / t) * t);
          },
          (e, n) => {
            e.setTime(+e + n * t);
          },
          (e, n) => (n - e) / t
        )
      : Yc
    : null
)),
  Yc.range;
const Xc = 1e3,
  Zc = 6e4,
  Gc = 36e5,
  Kc = 864e5,
  Jc = 6048e5,
  Qc = 2592e6,
  tl = 31536e6,
  el = Vc(
    (t) => {
      t.setTime(t - t.getMilliseconds());
    },
    (t, e) => {
      t.setTime(+t + e * Xc);
    },
    (t, e) => (e - t) / Xc,
    (t) => t.getUTCSeconds()
  );
el.range;
const nl = Vc(
  (t) => {
    t.setTime(t - t.getMilliseconds() - t.getSeconds() * Xc);
  },
  (t, e) => {
    t.setTime(+t + e * Zc);
  },
  (t, e) => (e - t) / Zc,
  (t) => t.getMinutes()
);
nl.range;
const rl = Vc(
  (t) => {
    t.setUTCSeconds(0, 0);
  },
  (t, e) => {
    t.setTime(+t + e * Zc);
  },
  (t, e) => (e - t) / Zc,
  (t) => t.getUTCMinutes()
);
rl.range;
const il = Vc(
  (t) => {
    t.setTime(t - t.getMilliseconds() - t.getSeconds() * Xc - t.getMinutes() * Zc);
  },
  (t, e) => {
    t.setTime(+t + e * Gc);
  },
  (t, e) => (e - t) / Gc,
  (t) => t.getHours()
);
il.range;
const ol = Vc(
  (t) => {
    t.setUTCMinutes(0, 0, 0);
  },
  (t, e) => {
    t.setTime(+t + e * Gc);
  },
  (t, e) => (e - t) / Gc,
  (t) => t.getUTCHours()
);
ol.range;
const al = Vc(
  (t) => t.setHours(0, 0, 0, 0),
  (t, e) => t.setDate(t.getDate() + e),
  (t, e) => (e - t - (e.getTimezoneOffset() - t.getTimezoneOffset()) * Zc) / Kc,
  (t) => t.getDate() - 1
);
al.range;
const sl = Vc(
  (t) => {
    t.setUTCHours(0, 0, 0, 0);
  },
  (t, e) => {
    t.setUTCDate(t.getUTCDate() + e);
  },
  (t, e) => (e - t) / Kc,
  (t) => t.getUTCDate() - 1
);
sl.range;
const ul = Vc(
  (t) => {
    t.setUTCHours(0, 0, 0, 0);
  },
  (t, e) => {
    t.setUTCDate(t.getUTCDate() + e);
  },
  (t, e) => (e - t) / Kc,
  (t) => Math.floor(t / Kc)
);
function cl(t) {
  return Vc(
    (e) => {
      e.setDate(e.getDate() - ((e.getDay() + 7 - t) % 7)), e.setHours(0, 0, 0, 0);
    },
    (t, e) => {
      t.setDate(t.getDate() + 7 * e);
    },
    (t, e) => (e - t - (e.getTimezoneOffset() - t.getTimezoneOffset()) * Zc) / Jc
  );
}
ul.range;
const ll = cl(0),
  fl = cl(1),
  hl = cl(2),
  dl = cl(3),
  pl = cl(4),
  vl = cl(5),
  ml = cl(6);
function gl(t) {
  return Vc(
    (e) => {
      e.setUTCDate(e.getUTCDate() - ((e.getUTCDay() + 7 - t) % 7)), e.setUTCHours(0, 0, 0, 0);
    },
    (t, e) => {
      t.setUTCDate(t.getUTCDate() + 7 * e);
    },
    (t, e) => (e - t) / Jc
  );
}
ll.range, fl.range, hl.range, dl.range, pl.range, vl.range, ml.range;
const yl = gl(0),
  bl = gl(1),
  _l = gl(2),
  wl = gl(3),
  xl = gl(4),
  Al = gl(5),
  Ml = gl(6);
yl.range, bl.range, _l.range, wl.range, xl.range, Al.range, Ml.range;
const $l = Vc(
  (t) => {
    t.setDate(1), t.setHours(0, 0, 0, 0);
  },
  (t, e) => {
    t.setMonth(t.getMonth() + e);
  },
  (t, e) => e.getMonth() - t.getMonth() + 12 * (e.getFullYear() - t.getFullYear()),
  (t) => t.getMonth()
);
$l.range;
const El = Vc(
  (t) => {
    t.setUTCDate(1), t.setUTCHours(0, 0, 0, 0);
  },
  (t, e) => {
    t.setUTCMonth(t.getUTCMonth() + e);
  },
  (t, e) => e.getUTCMonth() - t.getUTCMonth() + 12 * (e.getUTCFullYear() - t.getUTCFullYear()),
  (t) => t.getUTCMonth()
);
El.range;
const Sl = Vc(
  (t) => {
    t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
  },
  (t, e) => {
    t.setFullYear(t.getFullYear() + e);
  },
  (t, e) => e.getFullYear() - t.getFullYear(),
  (t) => t.getFullYear()
);
(Sl.every = (t) =>
  isFinite((t = Math.floor(t))) && t > 0
    ? Vc(
        (e) => {
          e.setFullYear(Math.floor(e.getFullYear() / t) * t), e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
        },
        (e, n) => {
          e.setFullYear(e.getFullYear() + n * t);
        }
      )
    : null),
  Sl.range;
const Cl = Vc(
  (t) => {
    t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
  },
  (t, e) => {
    t.setUTCFullYear(t.getUTCFullYear() + e);
  },
  (t, e) => e.getUTCFullYear() - t.getUTCFullYear(),
  (t) => t.getUTCFullYear()
);
function kl(t, e, n, r, i, o) {
  const a = [
    [el, 1, Xc],
    [el, 5, 5e3],
    [el, 15, 15e3],
    [el, 30, 3e4],
    [o, 1, Zc],
    [o, 5, 3e5],
    [o, 15, 9e5],
    [o, 30, 18e5],
    [i, 1, Gc],
    [i, 3, 108e5],
    [i, 6, 216e5],
    [i, 12, 432e5],
    [r, 1, Kc],
    [r, 2, 1728e5],
    [n, 1, Jc],
    [e, 1, Qc],
    [e, 3, 7776e6],
    [t, 1, tl],
  ];
  function s(e, n, r) {
    const i = Math.abs(n - e) / r,
      o = eu(([, , t]) => t).right(a, i);
    if (o === a.length) return t.every(vu(e / tl, n / tl, r));
    if (0 === o) return Yc.every(Math.max(vu(e, n, r), 1));
    const [s, u] = a[i / a[o - 1][2] < a[o][2] / i ? o - 1 : o];
    return s.every(u);
  }
  return [
    function (t, e, n) {
      const r = e < t;
      r && ([t, e] = [e, t]);
      const i = n && 'function' == typeof n.range ? n : s(t, e, n),
        o = i ? i.range(t, +e + 1) : [];
      return r ? o.reverse() : o;
    },
    s,
  ];
}
(Cl.every = (t) =>
  isFinite((t = Math.floor(t))) && t > 0
    ? Vc(
        (e) => {
          e.setUTCFullYear(Math.floor(e.getUTCFullYear() / t) * t), e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
        },
        (e, n) => {
          e.setUTCFullYear(e.getUTCFullYear() + n * t);
        }
      )
    : null),
  Cl.range;
const [Tl, Nl] = kl(Cl, El, yl, ul, ol, rl),
  [Pl, Dl] = kl(Sl, $l, ll, al, il, nl);
function Ol(t) {
  if (0 <= t.y && t.y < 100) {
    var e = new Date(-1, t.m, t.d, t.H, t.M, t.S, t.L);
    return e.setFullYear(t.y), e;
  }
  return new Date(t.y, t.m, t.d, t.H, t.M, t.S, t.L);
}
function zl(t) {
  if (0 <= t.y && t.y < 100) {
    var e = new Date(Date.UTC(-1, t.m, t.d, t.H, t.M, t.S, t.L));
    return e.setUTCFullYear(t.y), e;
  }
  return new Date(Date.UTC(t.y, t.m, t.d, t.H, t.M, t.S, t.L));
}
function Rl(t, e, n) {
  return { y: t, m: e, d: n, H: 0, M: 0, S: 0, L: 0 };
}
var Il,
  jl,
  Ul,
  Bl = { '-': '', _: ' ', 0: '0' },
  Hl = /^\s*\d+/,
  ql = /^%/,
  Wl = /[\\^$*+?|[\]().{}]/g;
function Ll(t, e, n) {
  var r = t < 0 ? '-' : '',
    i = (r ? -t : t) + '',
    o = i.length;
  return r + (o < n ? new Array(n - o + 1).join(e) + i : i);
}
function Fl(t) {
  return t.replace(Wl, '\\$&');
}
function Vl(t) {
  return new RegExp('^(?:' + t.map(Fl).join('|') + ')', 'i');
}
function Yl(t) {
  return new Map(t.map((t, e) => [t.toLowerCase(), e]));
}
function Xl(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 1));
  return r ? ((t.w = +r[0]), n + r[0].length) : -1;
}
function Zl(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 1));
  return r ? ((t.u = +r[0]), n + r[0].length) : -1;
}
function Gl(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 2));
  return r ? ((t.U = +r[0]), n + r[0].length) : -1;
}
function Kl(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 2));
  return r ? ((t.V = +r[0]), n + r[0].length) : -1;
}
function Jl(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 2));
  return r ? ((t.W = +r[0]), n + r[0].length) : -1;
}
function Ql(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 4));
  return r ? ((t.y = +r[0]), n + r[0].length) : -1;
}
function tf(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 2));
  return r ? ((t.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3)), n + r[0].length) : -1;
}
function ef(t, e, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(n, n + 6));
  return r ? ((t.Z = r[1] ? 0 : -(r[2] + (r[3] || '00'))), n + r[0].length) : -1;
}
function nf(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 1));
  return r ? ((t.q = 3 * r[0] - 3), n + r[0].length) : -1;
}
function rf(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 2));
  return r ? ((t.m = r[0] - 1), n + r[0].length) : -1;
}
function of(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 2));
  return r ? ((t.d = +r[0]), n + r[0].length) : -1;
}
function af(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 3));
  return r ? ((t.m = 0), (t.d = +r[0]), n + r[0].length) : -1;
}
function sf(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 2));
  return r ? ((t.H = +r[0]), n + r[0].length) : -1;
}
function uf(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 2));
  return r ? ((t.M = +r[0]), n + r[0].length) : -1;
}
function cf(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 2));
  return r ? ((t.S = +r[0]), n + r[0].length) : -1;
}
function lf(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 3));
  return r ? ((t.L = +r[0]), n + r[0].length) : -1;
}
function ff(t, e, n) {
  var r = Hl.exec(e.slice(n, n + 6));
  return r ? ((t.L = Math.floor(r[0] / 1e3)), n + r[0].length) : -1;
}
function hf(t, e, n) {
  var r = ql.exec(e.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function df(t, e, n) {
  var r = Hl.exec(e.slice(n));
  return r ? ((t.Q = +r[0]), n + r[0].length) : -1;
}
function pf(t, e, n) {
  var r = Hl.exec(e.slice(n));
  return r ? ((t.s = +r[0]), n + r[0].length) : -1;
}
function vf(t, e) {
  return Ll(t.getDate(), e, 2);
}
function mf(t, e) {
  return Ll(t.getHours(), e, 2);
}
function gf(t, e) {
  return Ll(t.getHours() % 12 || 12, e, 2);
}
function yf(t, e) {
  return Ll(1 + al.count(Sl(t), t), e, 3);
}
function bf(t, e) {
  return Ll(t.getMilliseconds(), e, 3);
}
function _f(t, e) {
  return bf(t, e) + '000';
}
function wf(t, e) {
  return Ll(t.getMonth() + 1, e, 2);
}
function xf(t, e) {
  return Ll(t.getMinutes(), e, 2);
}
function Af(t, e) {
  return Ll(t.getSeconds(), e, 2);
}
function Mf(t) {
  var e = t.getDay();
  return 0 === e ? 7 : e;
}
function $f(t, e) {
  return Ll(ll.count(Sl(t) - 1, t), e, 2);
}
function Ef(t) {
  var e = t.getDay();
  return e >= 4 || 0 === e ? pl(t) : pl.ceil(t);
}
function Sf(t, e) {
  return (t = Ef(t)), Ll(pl.count(Sl(t), t) + (4 === Sl(t).getDay()), e, 2);
}
function Cf(t) {
  return t.getDay();
}
function kf(t, e) {
  return Ll(fl.count(Sl(t) - 1, t), e, 2);
}
function Tf(t, e) {
  return Ll(t.getFullYear() % 100, e, 2);
}
function Nf(t, e) {
  return Ll((t = Ef(t)).getFullYear() % 100, e, 2);
}
function Pf(t, e) {
  return Ll(t.getFullYear() % 1e4, e, 4);
}
function Df(t, e) {
  var n = t.getDay();
  return Ll((t = n >= 4 || 0 === n ? pl(t) : pl.ceil(t)).getFullYear() % 1e4, e, 4);
}
function Of(t) {
  var e = t.getTimezoneOffset();
  return (e > 0 ? '-' : ((e *= -1), '+')) + Ll((e / 60) | 0, '0', 2) + Ll(e % 60, '0', 2);
}
function zf(t, e) {
  return Ll(t.getUTCDate(), e, 2);
}
function Rf(t, e) {
  return Ll(t.getUTCHours(), e, 2);
}
function If(t, e) {
  return Ll(t.getUTCHours() % 12 || 12, e, 2);
}
function jf(t, e) {
  return Ll(1 + sl.count(Cl(t), t), e, 3);
}
function Uf(t, e) {
  return Ll(t.getUTCMilliseconds(), e, 3);
}
function Bf(t, e) {
  return Uf(t, e) + '000';
}
function Hf(t, e) {
  return Ll(t.getUTCMonth() + 1, e, 2);
}
function qf(t, e) {
  return Ll(t.getUTCMinutes(), e, 2);
}
function Wf(t, e) {
  return Ll(t.getUTCSeconds(), e, 2);
}
function Lf(t) {
  var e = t.getUTCDay();
  return 0 === e ? 7 : e;
}
function Ff(t, e) {
  return Ll(yl.count(Cl(t) - 1, t), e, 2);
}
function Vf(t) {
  var e = t.getUTCDay();
  return e >= 4 || 0 === e ? xl(t) : xl.ceil(t);
}
function Yf(t, e) {
  return (t = Vf(t)), Ll(xl.count(Cl(t), t) + (4 === Cl(t).getUTCDay()), e, 2);
}
function Xf(t) {
  return t.getUTCDay();
}
function Zf(t, e) {
  return Ll(bl.count(Cl(t) - 1, t), e, 2);
}
function Gf(t, e) {
  return Ll(t.getUTCFullYear() % 100, e, 2);
}
function Kf(t, e) {
  return Ll((t = Vf(t)).getUTCFullYear() % 100, e, 2);
}
function Jf(t, e) {
  return Ll(t.getUTCFullYear() % 1e4, e, 4);
}
function Qf(t, e) {
  var n = t.getUTCDay();
  return Ll((t = n >= 4 || 0 === n ? xl(t) : xl.ceil(t)).getUTCFullYear() % 1e4, e, 4);
}
function th() {
  return '+0000';
}
function eh() {
  return '%';
}
function nh(t) {
  return +t;
}
function rh(t) {
  return Math.floor(+t / 1e3);
}
function ih(t) {
  return new Date(t);
}
function oh(t) {
  return t instanceof Date ? +t : +new Date(+t);
}
function ah(t, e, n, r, i, o, a, s, u, c) {
  var l = cc(),
    f = l.invert,
    h = l.domain,
    d = c('.%L'),
    p = c(':%S'),
    v = c('%I:%M'),
    m = c('%I %p'),
    g = c('%a %d'),
    y = c('%b %d'),
    b = c('%B'),
    _ = c('%Y');
  function w(t) {
    return (u(t) < t ? d : s(t) < t ? p : a(t) < t ? v : o(t) < t ? m : r(t) < t ? (i(t) < t ? g : y) : n(t) < t ? b : _)(t);
  }
  return (
    (l.invert = function (t) {
      return new Date(f(t));
    }),
    (l.domain = function (t) {
      return arguments.length ? h(Array.from(t, oh)) : h().map(ih);
    }),
    (l.ticks = function (e) {
      var n = h();
      return t(n[0], n[n.length - 1], e ?? 10);
    }),
    (l.tickFormat = function (t, e) {
      return null == e ? w : c(e);
    }),
    (l.nice = function (t) {
      var n = h();
      return (t && 'function' == typeof t.range) || (t = e(n[0], n[n.length - 1], t ?? 10)), t ? h(Sc(n, t)) : l;
    }),
    (l.copy = function () {
      return sc(l, ah(t, e, n, r, i, o, a, s, u, c));
    }),
    l
  );
}
function sh() {
  var t,
    e,
    n,
    r,
    i,
    o = 0,
    a = 1,
    s = rc,
    u = !1;
  function c(e) {
    return null == e || isNaN((e = +e)) ? i : s(0 === n ? 0.5 : ((e = (r(e) - t) * n), u ? Math.max(0, Math.min(1, e)) : e));
  }
  function l(t) {
    return function (e) {
      var n, r;
      return arguments.length ? (([n, r] = e), (s = t(n, r)), c) : [s(0), s(1)];
    };
  }
  return (
    (c.domain = function (i) {
      return arguments.length ? (([o, a] = i), (t = r((o = +o))), (e = r((a = +a))), (n = t === e ? 0 : 1 / (e - t)), c) : [o, a];
    }),
    (c.clamp = function (t) {
      return arguments.length ? ((u = !!t), c) : u;
    }),
    (c.interpolator = function (t) {
      return arguments.length ? ((s = t), c) : s;
    }),
    (c.range = l(qu)),
    (c.rangeRound = l(Wu)),
    (c.unknown = function (t) {
      return arguments.length ? ((i = t), c) : i;
    }),
    function (i) {
      return (r = i), (t = i(o)), (e = i(a)), (n = t === e ? 0 : 1 / (e - t)), c;
    }
  );
}
function uh(t, e) {
  return e.domain(t.domain()).interpolator(t.interpolator()).clamp(t.clamp()).unknown(t.unknown());
}
function ch() {
  var t = Ec(sh()(rc));
  return (
    (t.copy = function () {
      return uh(t, ch());
    }),
    xu.apply(t, arguments)
  );
}
function lh() {
  var t = Hc(sh());
  return (
    (t.copy = function () {
      return uh(t, lh()).exponent(t.exponent());
    }),
    xu.apply(t, arguments)
  );
}
function fh() {
  var t,
    e,
    n,
    r,
    i,
    o,
    a,
    s = 0,
    u = 0.5,
    c = 1,
    l = 1,
    f = rc,
    h = !1;
  function d(t) {
    return isNaN((t = +t)) ? a : ((t = 0.5 + ((t = +o(t)) - e) * (l * t < l * e ? r : i)), f(h ? Math.max(0, Math.min(1, t)) : t));
  }
  function p(t) {
    return function (e) {
      var n, r, i;
      return arguments.length
        ? (([n, r, i] = e),
          (f = (function (t, e) {
            void 0 === e && ((e = t), (t = qu));
            for (var n = 0, r = e.length - 1, i = e[0], o = new Array(r < 0 ? 0 : r); n < r; ) o[n] = t(i, (i = e[++n]));
            return function (t) {
              var e = Math.max(0, Math.min(r - 1, Math.floor((t *= r))));
              return o[e](t - e);
            };
          })(t, [n, r, i])),
          d)
        : [f(0), f(0.5), f(1)];
    };
  }
  return (
    (d.domain = function (a) {
      return arguments.length
        ? (([s, u, c] = a),
          (t = o((s = +s))),
          (e = o((u = +u))),
          (n = o((c = +c))),
          (r = t === e ? 0 : 0.5 / (e - t)),
          (i = e === n ? 0 : 0.5 / (n - e)),
          (l = e < t ? -1 : 1),
          d)
        : [s, u, c];
    }),
    (d.clamp = function (t) {
      return arguments.length ? ((h = !!t), d) : h;
    }),
    (d.interpolator = function (t) {
      return arguments.length ? ((f = t), d) : f;
    }),
    (d.range = p(qu)),
    (d.rangeRound = p(Wu)),
    (d.unknown = function (t) {
      return arguments.length ? ((a = t), d) : a;
    }),
    function (a) {
      return (o = a), (t = a(s)), (e = a(u)), (n = a(c)), (r = t === e ? 0 : 0.5 / (e - t)), (i = e === n ? 0 : 0.5 / (n - e)), (l = e < t ? -1 : 1), d;
    }
  );
}
function hh() {
  var t = Hc(fh());
  return (
    (t.copy = function () {
      return uh(t, hh()).exponent(t.exponent());
    }),
    xu.apply(t, arguments)
  );
}
!(function (t) {
  (Il = (function (t) {
    var e = t.dateTime,
      n = t.date,
      r = t.time,
      i = t.periods,
      o = t.days,
      a = t.shortDays,
      s = t.months,
      u = t.shortMonths,
      c = Vl(i),
      l = Yl(i),
      f = Vl(o),
      h = Yl(o),
      d = Vl(a),
      p = Yl(a),
      v = Vl(s),
      m = Yl(s),
      g = Vl(u),
      y = Yl(u),
      b = {
        a: function (t) {
          return a[t.getDay()];
        },
        A: function (t) {
          return o[t.getDay()];
        },
        b: function (t) {
          return u[t.getMonth()];
        },
        B: function (t) {
          return s[t.getMonth()];
        },
        c: null,
        d: vf,
        e: vf,
        f: _f,
        g: Nf,
        G: Df,
        H: mf,
        I: gf,
        j: yf,
        L: bf,
        m: wf,
        M: xf,
        p: function (t) {
          return i[+(t.getHours() >= 12)];
        },
        q: function (t) {
          return 1 + ~~(t.getMonth() / 3);
        },
        Q: nh,
        s: rh,
        S: Af,
        u: Mf,
        U: $f,
        V: Sf,
        w: Cf,
        W: kf,
        x: null,
        X: null,
        y: Tf,
        Y: Pf,
        Z: Of,
        '%': eh,
      },
      _ = {
        a: function (t) {
          return a[t.getUTCDay()];
        },
        A: function (t) {
          return o[t.getUTCDay()];
        },
        b: function (t) {
          return u[t.getUTCMonth()];
        },
        B: function (t) {
          return s[t.getUTCMonth()];
        },
        c: null,
        d: zf,
        e: zf,
        f: Bf,
        g: Kf,
        G: Qf,
        H: Rf,
        I: If,
        j: jf,
        L: Uf,
        m: Hf,
        M: qf,
        p: function (t) {
          return i[+(t.getUTCHours() >= 12)];
        },
        q: function (t) {
          return 1 + ~~(t.getUTCMonth() / 3);
        },
        Q: nh,
        s: rh,
        S: Wf,
        u: Lf,
        U: Ff,
        V: Yf,
        w: Xf,
        W: Zf,
        x: null,
        X: null,
        y: Gf,
        Y: Jf,
        Z: th,
        '%': eh,
      },
      w = {
        a: function (t, e, n) {
          var r = d.exec(e.slice(n));
          return r ? ((t.w = p.get(r[0].toLowerCase())), n + r[0].length) : -1;
        },
        A: function (t, e, n) {
          var r = f.exec(e.slice(n));
          return r ? ((t.w = h.get(r[0].toLowerCase())), n + r[0].length) : -1;
        },
        b: function (t, e, n) {
          var r = g.exec(e.slice(n));
          return r ? ((t.m = y.get(r[0].toLowerCase())), n + r[0].length) : -1;
        },
        B: function (t, e, n) {
          var r = v.exec(e.slice(n));
          return r ? ((t.m = m.get(r[0].toLowerCase())), n + r[0].length) : -1;
        },
        c: function (t, n, r) {
          return M(t, e, n, r);
        },
        d: of,
        e: of,
        f: ff,
        g: tf,
        G: Ql,
        H: sf,
        I: sf,
        j: af,
        L: lf,
        m: rf,
        M: uf,
        p: function (t, e, n) {
          var r = c.exec(e.slice(n));
          return r ? ((t.p = l.get(r[0].toLowerCase())), n + r[0].length) : -1;
        },
        q: nf,
        Q: df,
        s: pf,
        S: cf,
        u: Zl,
        U: Gl,
        V: Kl,
        w: Xl,
        W: Jl,
        x: function (t, e, r) {
          return M(t, n, e, r);
        },
        X: function (t, e, n) {
          return M(t, r, e, n);
        },
        y: tf,
        Y: Ql,
        Z: ef,
        '%': hf,
      };
    function x(t, e) {
      return function (n) {
        var r,
          i,
          o,
          a = [],
          s = -1,
          u = 0,
          c = t.length;
        for (n instanceof Date || (n = new Date(+n)); ++s < c; )
          37 === t.charCodeAt(s) &&
            (a.push(t.slice(u, s)),
            null != (i = Bl[(r = t.charAt(++s))]) ? (r = t.charAt(++s)) : (i = 'e' === r ? ' ' : '0'),
            (o = e[r]) && (r = o(n, i)),
            a.push(r),
            (u = s + 1));
        return a.push(t.slice(u, s)), a.join('');
      };
    }
    function A(t, e) {
      return function (n) {
        var r,
          i,
          o = Rl(1900, void 0, 1);
        if (M(o, t, (n += ''), 0) != n.length) return null;
        if ('Q' in o) return new Date(o.Q);
        if ('s' in o) return new Date(1e3 * o.s + ('L' in o ? o.L : 0));
        if ((e && !('Z' in o) && (o.Z = 0), 'p' in o && (o.H = (o.H % 12) + 12 * o.p), void 0 === o.m && (o.m = 'q' in o ? o.q : 0), 'V' in o)) {
          if (o.V < 1 || o.V > 53) return null;
          'w' in o || (o.w = 1),
            'Z' in o
              ? ((i = (r = zl(Rl(o.y, 0, 1))).getUTCDay()),
                (r = i > 4 || 0 === i ? bl.ceil(r) : bl(r)),
                (r = sl.offset(r, 7 * (o.V - 1))),
                (o.y = r.getUTCFullYear()),
                (o.m = r.getUTCMonth()),
                (o.d = r.getUTCDate() + ((o.w + 6) % 7)))
              : ((i = (r = Ol(Rl(o.y, 0, 1))).getDay()),
                (r = i > 4 || 0 === i ? fl.ceil(r) : fl(r)),
                (r = al.offset(r, 7 * (o.V - 1))),
                (o.y = r.getFullYear()),
                (o.m = r.getMonth()),
                (o.d = r.getDate() + ((o.w + 6) % 7)));
        } else
          ('W' in o || 'U' in o) &&
            ('w' in o || (o.w = 'u' in o ? o.u % 7 : 'W' in o ? 1 : 0),
            (i = 'Z' in o ? zl(Rl(o.y, 0, 1)).getUTCDay() : Ol(Rl(o.y, 0, 1)).getDay()),
            (o.m = 0),
            (o.d = 'W' in o ? ((o.w + 6) % 7) + 7 * o.W - ((i + 5) % 7) : o.w + 7 * o.U - ((i + 6) % 7)));
        return 'Z' in o ? ((o.H += (o.Z / 100) | 0), (o.M += o.Z % 100), zl(o)) : Ol(o);
      };
    }
    function M(t, e, n, r) {
      for (var i, o, a = 0, s = e.length, u = n.length; a < s; ) {
        if (r >= u) return -1;
        if (37 === (i = e.charCodeAt(a++))) {
          if (((i = e.charAt(a++)), !(o = w[i in Bl ? e.charAt(a++) : i]) || (r = o(t, n, r)) < 0)) return -1;
        } else if (i != n.charCodeAt(r++)) return -1;
      }
      return r;
    }
    return (
      (b.x = x(n, b)),
      (b.X = x(r, b)),
      (b.c = x(e, b)),
      (_.x = x(n, _)),
      (_.X = x(r, _)),
      (_.c = x(e, _)),
      {
        format: function (t) {
          var e = x((t += ''), b);
          return (
            (e.toString = function () {
              return t;
            }),
            e
          );
        },
        parse: function (t) {
          var e = A((t += ''), !1);
          return (
            (e.toString = function () {
              return t;
            }),
            e
          );
        },
        utcFormat: function (t) {
          var e = x((t += ''), _);
          return (
            (e.toString = function () {
              return t;
            }),
            e
          );
        },
        utcParse: function (t) {
          var e = A((t += ''), !0);
          return (
            (e.toString = function () {
              return t;
            }),
            e
          );
        },
      }
    );
  })(t)),
    (jl = Il.format),
    Il.parse,
    (Ul = Il.utcFormat),
    Il.utcParse;
})({
  dateTime: '%x, %X',
  date: '%-m/%-d/%Y',
  time: '%-I:%M:%S %p',
  periods: ['AM', 'PM'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
});
var dh = Object.freeze({
    __proto__: null,
    scaleBand: $u,
    scaleDiverging: function t() {
      var e = Ec(fh()(rc));
      return (
        (e.copy = function () {
          return uh(e, t());
        }),
        xu.apply(e, arguments)
      );
    },
    scaleDivergingLog: function t() {
      var e = Oc(fh()).domain([0.1, 1, 10]);
      return (
        (e.copy = function () {
          return uh(e, t()).base(e.base());
        }),
        xu.apply(e, arguments)
      );
    },
    scaleDivergingPow: hh,
    scaleDivergingSqrt: function () {
      return hh.apply(null, arguments).exponent(0.5);
    },
    scaleDivergingSymlog: function t() {
      var e = Ic(fh());
      return (
        (e.copy = function () {
          return uh(e, t()).constant(e.constant());
        }),
        xu.apply(e, arguments)
      );
    },
    scaleIdentity: function t(e) {
      var n;
      function r(t) {
        return null == t || isNaN((t = +t)) ? n : t;
      }
      return (
        (r.invert = r),
        (r.domain = r.range =
          function (t) {
            return arguments.length ? ((e = Array.from(t, ec)), r) : e.slice();
          }),
        (r.unknown = function (t) {
          return arguments.length ? ((n = t), r) : n;
        }),
        (r.copy = function () {
          return t(e).unknown(n);
        }),
        (e = arguments.length ? Array.from(e, ec) : [0, 1]),
        Ec(r)
      );
    },
    scaleImplicit: Au,
    scaleLinear: function t() {
      var e = cc();
      return (
        (e.copy = function () {
          return sc(e, t());
        }),
        wu.apply(e, arguments),
        Ec(e)
      );
    },
    scaleLog: function t() {
      const e = Oc(uc()).domain([1, 10]);
      return (e.copy = () => sc(e, t()).base(e.base())), wu.apply(e, arguments), e;
    },
    scaleOrdinal: Mu,
    scalePoint: function () {
      return Eu($u.apply(null, arguments).paddingInner(1));
    },
    scalePow: qc,
    scaleQuantile: function t() {
      var e,
        n = [],
        r = [],
        i = [];
      function o() {
        var t = 0,
          e = Math.max(1, r.length);
        for (i = new Array(e - 1); ++t < e; ) i[t - 1] = _u(n, t / e);
        return a;
      }
      function a(t) {
        return null == t || isNaN((t = +t)) ? e : r[iu(i, t)];
      }
      return (
        (a.invertExtent = function (t) {
          var e = r.indexOf(t);
          return e < 0 ? [NaN, NaN] : [e > 0 ? i[e - 1] : n[0], e < i.length ? i[e] : n[n.length - 1]];
        }),
        (a.domain = function (t) {
          if (!arguments.length) return n.slice();
          n = [];
          for (let e of t) null == e || isNaN((e = +e)) || n.push(e);
          return n.sort(Qs), o();
        }),
        (a.range = function (t) {
          return arguments.length ? ((r = Array.from(t)), o()) : r.slice();
        }),
        (a.unknown = function (t) {
          return arguments.length ? ((e = t), a) : e;
        }),
        (a.quantiles = function () {
          return i.slice();
        }),
        (a.copy = function () {
          return t().domain(n).range(r).unknown(e);
        }),
        wu.apply(a, arguments)
      );
    },
    scaleQuantize: function t() {
      var e,
        n = 0,
        r = 1,
        i = 1,
        o = [0.5],
        a = [0, 1];
      function s(t) {
        return null != t && t <= t ? a[iu(o, t, 0, i)] : e;
      }
      function u() {
        var t = -1;
        for (o = new Array(i); ++t < i; ) o[t] = ((t + 1) * r - (t - i) * n) / (i + 1);
        return s;
      }
      return (
        (s.domain = function (t) {
          return arguments.length ? (([n, r] = t), (n = +n), (r = +r), u()) : [n, r];
        }),
        (s.range = function (t) {
          return arguments.length ? ((i = (a = Array.from(t)).length - 1), u()) : a.slice();
        }),
        (s.invertExtent = function (t) {
          var e = a.indexOf(t);
          return e < 0 ? [NaN, NaN] : e < 1 ? [n, o[0]] : e >= i ? [o[i - 1], r] : [o[e - 1], o[e]];
        }),
        (s.unknown = function (t) {
          return arguments.length ? ((e = t), s) : s;
        }),
        (s.thresholds = function () {
          return o.slice();
        }),
        (s.copy = function () {
          return t().domain([n, r]).range(a).unknown(e);
        }),
        wu.apply(Ec(s), arguments)
      );
    },
    scaleRadial: function t() {
      var e,
        n = cc(),
        r = [0, 1],
        i = !1;
      function o(t) {
        var r = (function (t) {
          return Math.sign(t) * Math.sqrt(Math.abs(t));
        })(n(t));
        return isNaN(r) ? e : i ? Math.round(r) : r;
      }
      return (
        (o.invert = function (t) {
          return n.invert(Wc(t));
        }),
        (o.domain = function (t) {
          return arguments.length ? (n.domain(t), o) : n.domain();
        }),
        (o.range = function (t) {
          return arguments.length ? (n.range((r = Array.from(t, ec)).map(Wc)), o) : r.slice();
        }),
        (o.rangeRound = function (t) {
          return o.range(t).round(!0);
        }),
        (o.round = function (t) {
          return arguments.length ? ((i = !!t), o) : i;
        }),
        (o.clamp = function (t) {
          return arguments.length ? (n.clamp(t), o) : n.clamp();
        }),
        (o.unknown = function (t) {
          return arguments.length ? ((e = t), o) : e;
        }),
        (o.copy = function () {
          return t(n.domain(), r).round(i).clamp(n.clamp()).unknown(e);
        }),
        wu.apply(o, arguments),
        Ec(o)
      );
    },
    scaleSequential: ch,
    scaleSequentialLog: function t() {
      var e = Oc(sh()).domain([1, 10]);
      return (
        (e.copy = function () {
          return uh(e, t()).base(e.base());
        }),
        xu.apply(e, arguments)
      );
    },
    scaleSequentialPow: lh,
    scaleSequentialQuantile: function t() {
      var e = [],
        n = rc;
      function r(t) {
        if (null != t && !isNaN((t = +t))) return n((iu(e, t, 1) - 1) / (e.length - 1));
      }
      return (
        (r.domain = function (t) {
          if (!arguments.length) return e.slice();
          e = [];
          for (let n of t) null == n || isNaN((n = +n)) || e.push(n);
          return e.sort(Qs), r;
        }),
        (r.interpolator = function (t) {
          return arguments.length ? ((n = t), r) : n;
        }),
        (r.range = function () {
          return e.map((t, r) => n(r / (e.length - 1)));
        }),
        (r.quantiles = function (t) {
          return Array.from({ length: t + 1 }, (n, r) =>
            (function (t, e, n) {
              if (
                ((t = Float64Array.from(
                  (function* (t, e) {
                    if (void 0 === e) for (let e of t) null != e && (e = +e) >= e && (yield e);
                    else {
                      let n = -1;
                      for (let r of t) null != (r = e(r, ++n, t)) && (r = +r) >= r && (yield r);
                    }
                  })(t, n)
                )),
                (r = t.length) && !isNaN((e = +e)))
              ) {
                if (e <= 0 || r < 2) return gu(t);
                if (e >= 1) return mu(t);
                var r,
                  i = (r - 1) * e,
                  o = Math.floor(i),
                  a = mu(yu(t, o).subarray(0, o + 1));
                return a + (gu(t.subarray(o + 1)) - a) * (i - o);
              }
            })(e, r / t)
          );
        }),
        (r.copy = function () {
          return t(n).domain(e);
        }),
        xu.apply(r, arguments)
      );
    },
    scaleSequentialSqrt: function () {
      return lh.apply(null, arguments).exponent(0.5);
    },
    scaleSequentialSymlog: function t() {
      var e = Ic(sh());
      return (
        (e.copy = function () {
          return uh(e, t()).constant(e.constant());
        }),
        xu.apply(e, arguments)
      );
    },
    scaleSqrt: function () {
      return qc.apply(null, arguments).exponent(0.5);
    },
    scaleSymlog: function t() {
      var e = Ic(uc());
      return (
        (e.copy = function () {
          return sc(e, t()).constant(e.constant());
        }),
        wu.apply(e, arguments)
      );
    },
    scaleThreshold: function t() {
      var e,
        n = [0.5],
        r = [0, 1],
        i = 1;
      function o(t) {
        return null != t && t <= t ? r[iu(n, t, 0, i)] : e;
      }
      return (
        (o.domain = function (t) {
          return arguments.length ? ((n = Array.from(t)), (i = Math.min(n.length, r.length - 1)), o) : n.slice();
        }),
        (o.range = function (t) {
          return arguments.length ? ((r = Array.from(t)), (i = Math.min(n.length, r.length - 1)), o) : r.slice();
        }),
        (o.invertExtent = function (t) {
          var e = r.indexOf(t);
          return [n[e - 1], n[e]];
        }),
        (o.unknown = function (t) {
          return arguments.length ? ((e = t), o) : e;
        }),
        (o.copy = function () {
          return t().domain(n).range(r).unknown(e);
        }),
        wu.apply(o, arguments)
      );
    },
    scaleTime: function () {
      return wu.apply(ah(Pl, Dl, Sl, $l, ll, al, il, nl, el, jl).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
    },
    scaleUtc: function () {
      return wu.apply(ah(Tl, Nl, Cl, El, yl, sl, ol, rl, el, Ul).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
    },
    tickFormat: $c,
  }),
  ph = Oa(dh);
function vh(t) {
  for (var e = (t.length / 6) | 0, n = new Array(e), r = 0; r < e; ) n[r] = '#' + t.slice(6 * r, 6 * ++r);
  return n;
}
var mh = vh('1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf'),
  gh = vh('7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666'),
  yh = vh('1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666'),
  bh = vh('a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928'),
  _h = vh('fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2'),
  wh = vh('b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc'),
  xh = vh('e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999'),
  Ah = vh('66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3'),
  Mh = vh('8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f'),
  $h = vh('4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab'),
  Eh = (t) => Du(t[t.length - 1]),
  Sh = new Array(3)
    .concat(
      'd8b365f5f5f55ab4ac',
      'a6611adfc27d80cdc1018571',
      'a6611adfc27df5f5f580cdc1018571',
      '8c510ad8b365f6e8c3c7eae55ab4ac01665e',
      '8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e',
      '8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e',
      '8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e',
      '5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30',
      '5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30'
    )
    .map(vh),
  Ch = Eh(Sh),
  kh = new Array(3)
    .concat(
      'af8dc3f7f7f77fbf7b',
      '7b3294c2a5cfa6dba0008837',
      '7b3294c2a5cff7f7f7a6dba0008837',
      '762a83af8dc3e7d4e8d9f0d37fbf7b1b7837',
      '762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837',
      '762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837',
      '762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837',
      '40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b',
      '40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b'
    )
    .map(vh),
  Th = Eh(kh),
  Nh = new Array(3)
    .concat(
      'e9a3c9f7f7f7a1d76a',
      'd01c8bf1b6dab8e1864dac26',
      'd01c8bf1b6daf7f7f7b8e1864dac26',
      'c51b7de9a3c9fde0efe6f5d0a1d76a4d9221',
      'c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221',
      'c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221',
      'c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221',
      '8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419',
      '8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419'
    )
    .map(vh),
  Ph = Eh(Nh),
  Dh = new Array(3)
    .concat(
      '998ec3f7f7f7f1a340',
      '5e3c99b2abd2fdb863e66101',
      '5e3c99b2abd2f7f7f7fdb863e66101',
      '542788998ec3d8daebfee0b6f1a340b35806',
      '542788998ec3d8daebf7f7f7fee0b6f1a340b35806',
      '5427888073acb2abd2d8daebfee0b6fdb863e08214b35806',
      '5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806',
      '2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08',
      '2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08'
    )
    .map(vh),
  Oh = Eh(Dh),
  zh = new Array(3)
    .concat(
      'ef8a62f7f7f767a9cf',
      'ca0020f4a58292c5de0571b0',
      'ca0020f4a582f7f7f792c5de0571b0',
      'b2182bef8a62fddbc7d1e5f067a9cf2166ac',
      'b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac',
      'b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac',
      'b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac',
      '67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061',
      '67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061'
    )
    .map(vh),
  Rh = Eh(zh),
  Ih = new Array(3)
    .concat(
      'ef8a62ffffff999999',
      'ca0020f4a582bababa404040',
      'ca0020f4a582ffffffbababa404040',
      'b2182bef8a62fddbc7e0e0e09999994d4d4d',
      'b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d',
      'b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d',
      'b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d',
      '67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a',
      '67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a'
    )
    .map(vh),
  jh = Eh(Ih),
  Uh = new Array(3)
    .concat(
      'fc8d59ffffbf91bfdb',
      'd7191cfdae61abd9e92c7bb6',
      'd7191cfdae61ffffbfabd9e92c7bb6',
      'd73027fc8d59fee090e0f3f891bfdb4575b4',
      'd73027fc8d59fee090ffffbfe0f3f891bfdb4575b4',
      'd73027f46d43fdae61fee090e0f3f8abd9e974add14575b4',
      'd73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4',
      'a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695',
      'a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695'
    )
    .map(vh),
  Bh = Eh(Uh),
  Hh = new Array(3)
    .concat(
      'fc8d59ffffbf91cf60',
      'd7191cfdae61a6d96a1a9641',
      'd7191cfdae61ffffbfa6d96a1a9641',
      'd73027fc8d59fee08bd9ef8b91cf601a9850',
      'd73027fc8d59fee08bffffbfd9ef8b91cf601a9850',
      'd73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850',
      'd73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850',
      'a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837',
      'a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837'
    )
    .map(vh),
  qh = Eh(Hh),
  Wh = new Array(3)
    .concat(
      'fc8d59ffffbf99d594',
      'd7191cfdae61abdda42b83ba',
      'd7191cfdae61ffffbfabdda42b83ba',
      'd53e4ffc8d59fee08be6f59899d5943288bd',
      'd53e4ffc8d59fee08bffffbfe6f59899d5943288bd',
      'd53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd',
      'd53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd',
      '9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2',
      '9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2'
    )
    .map(vh),
  Lh = Eh(Wh),
  Fh = new Array(3)
    .concat(
      'e5f5f999d8c92ca25f',
      'edf8fbb2e2e266c2a4238b45',
      'edf8fbb2e2e266c2a42ca25f006d2c',
      'edf8fbccece699d8c966c2a42ca25f006d2c',
      'edf8fbccece699d8c966c2a441ae76238b45005824',
      'f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824',
      'f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b'
    )
    .map(vh),
  Vh = Eh(Fh),
  Yh = new Array(3)
    .concat(
      'e0ecf49ebcda8856a7',
      'edf8fbb3cde38c96c688419d',
      'edf8fbb3cde38c96c68856a7810f7c',
      'edf8fbbfd3e69ebcda8c96c68856a7810f7c',
      'edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b',
      'f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b',
      'f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b'
    )
    .map(vh),
  Xh = Eh(Yh),
  Zh = new Array(3)
    .concat(
      'e0f3dba8ddb543a2ca',
      'f0f9e8bae4bc7bccc42b8cbe',
      'f0f9e8bae4bc7bccc443a2ca0868ac',
      'f0f9e8ccebc5a8ddb57bccc443a2ca0868ac',
      'f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e',
      'f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e',
      'f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081'
    )
    .map(vh),
  Gh = Eh(Zh),
  Kh = new Array(3)
    .concat(
      'fee8c8fdbb84e34a33',
      'fef0d9fdcc8afc8d59d7301f',
      'fef0d9fdcc8afc8d59e34a33b30000',
      'fef0d9fdd49efdbb84fc8d59e34a33b30000',
      'fef0d9fdd49efdbb84fc8d59ef6548d7301f990000',
      'fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000',
      'fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000'
    )
    .map(vh),
  Jh = Eh(Kh),
  Qh = new Array(3)
    .concat(
      'ece2f0a6bddb1c9099',
      'f6eff7bdc9e167a9cf02818a',
      'f6eff7bdc9e167a9cf1c9099016c59',
      'f6eff7d0d1e6a6bddb67a9cf1c9099016c59',
      'f6eff7d0d1e6a6bddb67a9cf3690c002818a016450',
      'fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450',
      'fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636'
    )
    .map(vh),
  td = Eh(Qh),
  ed = new Array(3)
    .concat(
      'ece7f2a6bddb2b8cbe',
      'f1eef6bdc9e174a9cf0570b0',
      'f1eef6bdc9e174a9cf2b8cbe045a8d',
      'f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d',
      'f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b',
      'fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b',
      'fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858'
    )
    .map(vh),
  nd = Eh(ed),
  rd = new Array(3)
    .concat(
      'e7e1efc994c7dd1c77',
      'f1eef6d7b5d8df65b0ce1256',
      'f1eef6d7b5d8df65b0dd1c77980043',
      'f1eef6d4b9dac994c7df65b0dd1c77980043',
      'f1eef6d4b9dac994c7df65b0e7298ace125691003f',
      'f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f',
      'f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f'
    )
    .map(vh),
  id = Eh(rd),
  od = new Array(3)
    .concat(
      'fde0ddfa9fb5c51b8a',
      'feebe2fbb4b9f768a1ae017e',
      'feebe2fbb4b9f768a1c51b8a7a0177',
      'feebe2fcc5c0fa9fb5f768a1c51b8a7a0177',
      'feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177',
      'fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177',
      'fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a'
    )
    .map(vh),
  ad = Eh(od),
  sd = new Array(3)
    .concat(
      'edf8b17fcdbb2c7fb8',
      'ffffcca1dab441b6c4225ea8',
      'ffffcca1dab441b6c42c7fb8253494',
      'ffffccc7e9b47fcdbb41b6c42c7fb8253494',
      'ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84',
      'ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84',
      'ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58'
    )
    .map(vh),
  ud = Eh(sd),
  cd = new Array(3)
    .concat(
      'f7fcb9addd8e31a354',
      'ffffccc2e69978c679238443',
      'ffffccc2e69978c67931a354006837',
      'ffffccd9f0a3addd8e78c67931a354006837',
      'ffffccd9f0a3addd8e78c67941ab5d238443005a32',
      'ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32',
      'ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529'
    )
    .map(vh),
  ld = Eh(cd),
  fd = new Array(3)
    .concat(
      'fff7bcfec44fd95f0e',
      'ffffd4fed98efe9929cc4c02',
      'ffffd4fed98efe9929d95f0e993404',
      'ffffd4fee391fec44ffe9929d95f0e993404',
      'ffffd4fee391fec44ffe9929ec7014cc4c028c2d04',
      'ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04',
      'ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506'
    )
    .map(vh),
  hd = Eh(fd),
  dd = new Array(3)
    .concat(
      'ffeda0feb24cf03b20',
      'ffffb2fecc5cfd8d3ce31a1c',
      'ffffb2fecc5cfd8d3cf03b20bd0026',
      'ffffb2fed976feb24cfd8d3cf03b20bd0026',
      'ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026',
      'ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026',
      'ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026'
    )
    .map(vh),
  pd = Eh(dd),
  vd = new Array(3)
    .concat(
      'deebf79ecae13182bd',
      'eff3ffbdd7e76baed62171b5',
      'eff3ffbdd7e76baed63182bd08519c',
      'eff3ffc6dbef9ecae16baed63182bd08519c',
      'eff3ffc6dbef9ecae16baed64292c62171b5084594',
      'f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594',
      'f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b'
    )
    .map(vh),
  md = Eh(vd),
  gd = new Array(3)
    .concat(
      'e5f5e0a1d99b31a354',
      'edf8e9bae4b374c476238b45',
      'edf8e9bae4b374c47631a354006d2c',
      'edf8e9c7e9c0a1d99b74c47631a354006d2c',
      'edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32',
      'f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32',
      'f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b'
    )
    .map(vh),
  yd = Eh(gd),
  bd = new Array(3)
    .concat(
      'f0f0f0bdbdbd636363',
      'f7f7f7cccccc969696525252',
      'f7f7f7cccccc969696636363252525',
      'f7f7f7d9d9d9bdbdbd969696636363252525',
      'f7f7f7d9d9d9bdbdbd969696737373525252252525',
      'fffffff0f0f0d9d9d9bdbdbd969696737373525252252525',
      'fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000'
    )
    .map(vh),
  _d = Eh(bd),
  wd = new Array(3)
    .concat(
      'efedf5bcbddc756bb1',
      'f2f0f7cbc9e29e9ac86a51a3',
      'f2f0f7cbc9e29e9ac8756bb154278f',
      'f2f0f7dadaebbcbddc9e9ac8756bb154278f',
      'f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486',
      'fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486',
      'fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d'
    )
    .map(vh),
  xd = Eh(wd),
  Ad = new Array(3)
    .concat(
      'fee0d2fc9272de2d26',
      'fee5d9fcae91fb6a4acb181d',
      'fee5d9fcae91fb6a4ade2d26a50f15',
      'fee5d9fcbba1fc9272fb6a4ade2d26a50f15',
      'fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d',
      'fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d',
      'fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d'
    )
    .map(vh),
  Md = Eh(Ad),
  $d = new Array(3)
    .concat(
      'fee6cefdae6be6550d',
      'feeddefdbe85fd8d3cd94701',
      'feeddefdbe85fd8d3ce6550da63603',
      'feeddefdd0a2fdae6bfd8d3ce6550da63603',
      'feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04',
      'fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04',
      'fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704'
    )
    .map(vh),
  Ed = Eh($d);
var Sd = tc(Zs(300, 0.5, 0), Zs(-240, 0.5, 1)),
  Cd = tc(Zs(-100, 0.75, 0.35), Zs(80, 1.5, 0.8)),
  kd = tc(Zs(260, 0.75, 0.35), Zs(80, 1.5, 0.8)),
  Td = Zs();
var Nd = ss(),
  Pd = Math.PI / 3,
  Dd = (2 * Math.PI) / 3;
function Od(t) {
  var e = t.length;
  return function (n) {
    return t[Math.max(0, Math.min(e - 1, Math.floor(n * e)))];
  };
}
var zd = Od(
    vh(
      '44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725'
    )
  ),
  Rd = Od(
    vh(
      '00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf'
    )
  ),
  Id = Od(
    vh(
      '00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4'
    )
  ),
  jd = Od(
    vh(
      '0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921'
    )
  ),
  Ud = Object.freeze({
    __proto__: null,
    interpolateBlues: md,
    interpolateBrBG: Ch,
    interpolateBuGn: Vh,
    interpolateBuPu: Xh,
    interpolateCividis: function (t) {
      return (
        (t = Math.max(0, Math.min(1, t))),
        'rgb(' +
          Math.max(0, Math.min(255, Math.round(-4.54 - t * (35.34 - t * (2381.73 - t * (6402.7 - t * (7024.72 - 2710.57 * t))))))) +
          ', ' +
          Math.max(0, Math.min(255, Math.round(32.49 + t * (170.73 + t * (52.82 - t * (131.46 - t * (176.58 - 67.37 * t))))))) +
          ', ' +
          Math.max(0, Math.min(255, Math.round(81.24 + t * (442.36 - t * (2482.43 - t * (6167.24 - t * (6614.94 - 2475.67 * t))))))) +
          ')'
      );
    },
    interpolateCool: kd,
    interpolateCubehelixDefault: Sd,
    interpolateGnBu: Gh,
    interpolateGreens: yd,
    interpolateGreys: _d,
    interpolateInferno: Id,
    interpolateMagma: Rd,
    interpolateOrRd: Jh,
    interpolateOranges: Ed,
    interpolatePRGn: Th,
    interpolatePiYG: Ph,
    interpolatePlasma: jd,
    interpolatePuBu: nd,
    interpolatePuBuGn: td,
    interpolatePuOr: Oh,
    interpolatePuRd: id,
    interpolatePurples: xd,
    interpolateRainbow: function (t) {
      (t < 0 || t > 1) && (t -= Math.floor(t));
      var e = Math.abs(t - 0.5);
      return (Td.h = 360 * t - 100), (Td.s = 1.5 - 1.5 * e), (Td.l = 0.8 - 0.9 * e), Td + '';
    },
    interpolateRdBu: Rh,
    interpolateRdGy: jh,
    interpolateRdPu: ad,
    interpolateRdYlBu: Bh,
    interpolateRdYlGn: qh,
    interpolateReds: Md,
    interpolateSinebow: function (t) {
      var e;
      return (
        (t = (0.5 - t) * Math.PI), (Nd.r = 255 * (e = Math.sin(t)) * e), (Nd.g = 255 * (e = Math.sin(t + Pd)) * e), (Nd.b = 255 * (e = Math.sin(t + Dd)) * e), Nd + ''
      );
    },
    interpolateSpectral: Lh,
    interpolateTurbo: function (t) {
      return (
        (t = Math.max(0, Math.min(1, t))),
        'rgb(' +
          Math.max(0, Math.min(255, Math.round(34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - 14825.05 * t))))))) +
          ', ' +
          Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + 707.56 * t))))))) +
          ', ' +
          Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - 6838.66 * t))))))) +
          ')'
      );
    },
    interpolateViridis: zd,
    interpolateWarm: Cd,
    interpolateYlGn: ld,
    interpolateYlGnBu: ud,
    interpolateYlOrBr: hd,
    interpolateYlOrRd: pd,
    schemeAccent: gh,
    schemeBlues: vd,
    schemeBrBG: Sh,
    schemeBuGn: Fh,
    schemeBuPu: Yh,
    schemeCategory10: mh,
    schemeDark2: yh,
    schemeGnBu: Zh,
    schemeGreens: gd,
    schemeGreys: bd,
    schemeOrRd: Kh,
    schemeOranges: $d,
    schemePRGn: kh,
    schemePaired: bh,
    schemePastel1: _h,
    schemePastel2: wh,
    schemePiYG: Nh,
    schemePuBu: ed,
    schemePuBuGn: Qh,
    schemePuOr: Dh,
    schemePuRd: rd,
    schemePurples: wd,
    schemeRdBu: zh,
    schemeRdGy: Ih,
    schemeRdPu: od,
    schemeRdYlBu: Uh,
    schemeRdYlGn: Hh,
    schemeReds: Ad,
    schemeSet1: xh,
    schemeSet2: Ah,
    schemeSet3: Mh,
    schemeSpectral: Wh,
    schemeTableau10: $h,
    schemeYlGn: cd,
    schemeYlGnBu: sd,
    schemeYlOrBr: fd,
    schemeYlOrRd: dd,
  }),
  Bd = Oa(Ud),
  Hd = 'http://www.w3.org/1999/xhtml',
  qd = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: Hd,
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
  };
function Wd(t) {
  var e = (t += ''),
    n = e.indexOf(':');
  return n >= 0 && 'xmlns' !== (e = t.slice(0, n)) && (t = t.slice(n + 1)), qd.hasOwnProperty(e) ? { space: qd[e], local: t } : t;
}
function Ld(t) {
  return function () {
    var e = this.ownerDocument,
      n = this.namespaceURI;
    return n === Hd && e.documentElement.namespaceURI === Hd ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Fd(t) {
  return function () {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Vd(t) {
  var e = Wd(t);
  return (e.local ? Fd : Ld)(e);
}
function Yd() {}
function Xd(t) {
  return null == t
    ? Yd
    : function () {
        return this.querySelector(t);
      };
}
function Zd(t) {
  return null == t ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Gd() {
  return [];
}
function Kd(t) {
  return null == t
    ? Gd
    : function () {
        return this.querySelectorAll(t);
      };
}
function Jd(t) {
  return function () {
    return this.matches(t);
  };
}
function Qd(t) {
  return function (e) {
    return e.matches(t);
  };
}
var tp = Array.prototype.find;
function ep() {
  return this.firstElementChild;
}
var np = Array.prototype.filter;
function rp() {
  return Array.from(this.children);
}
function ip(t) {
  return new Array(t.length);
}
function op(t, e) {
  (this.ownerDocument = t.ownerDocument), (this.namespaceURI = t.namespaceURI), (this._next = null), (this._parent = t), (this.__data__ = e);
}
function ap(t, e, n, r, i, o) {
  for (var a, s = 0, u = e.length, c = o.length; s < c; ++s) (a = e[s]) ? ((a.__data__ = o[s]), (r[s] = a)) : (n[s] = new op(t, o[s]));
  for (; s < u; ++s) (a = e[s]) && (i[s] = a);
}
function sp(t, e, n, r, i, o, a) {
  var s,
    u,
    c,
    l = new Map(),
    f = e.length,
    h = o.length,
    d = new Array(f);
  for (s = 0; s < f; ++s) (u = e[s]) && ((d[s] = c = a.call(u, u.__data__, s, e) + ''), l.has(c) ? (i[s] = u) : l.set(c, u));
  for (s = 0; s < h; ++s) (c = a.call(t, o[s], s, o) + ''), (u = l.get(c)) ? ((r[s] = u), (u.__data__ = o[s]), l.delete(c)) : (n[s] = new op(t, o[s]));
  for (s = 0; s < f; ++s) (u = e[s]) && l.get(d[s]) === u && (i[s] = u);
}
function up(t) {
  return t.__data__;
}
function cp(t) {
  return 'object' == typeof t && 'length' in t ? t : Array.from(t);
}
function lp(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function fp(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function hp(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function dp(t, e) {
  return function () {
    this.setAttribute(t, e);
  };
}
function pp(t, e) {
  return function () {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function vp(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function mp(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function gp(t) {
  return (t.ownerDocument && t.ownerDocument.defaultView) || (t.document && t) || t.defaultView;
}
function yp(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
function bp(t, e, n) {
  return function () {
    this.style.setProperty(t, e, n);
  };
}
function _p(t, e, n) {
  return function () {
    var r = e.apply(this, arguments);
    null == r ? this.style.removeProperty(t) : this.style.setProperty(t, r, n);
  };
}
function wp(t, e) {
  return t.style.getPropertyValue(e) || gp(t).getComputedStyle(t, null).getPropertyValue(e);
}
function xp(t) {
  return function () {
    delete this[t];
  };
}
function Ap(t, e) {
  return function () {
    this[t] = e;
  };
}
function Mp(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? delete this[t] : (this[t] = n);
  };
}
function $p(t) {
  return t.trim().split(/^|\s+/);
}
function Ep(t) {
  return t.classList || new Sp(t);
}
function Sp(t) {
  (this._node = t), (this._names = $p(t.getAttribute('class') || ''));
}
function Cp(t, e) {
  for (var n = Ep(t), r = -1, i = e.length; ++r < i; ) n.add(e[r]);
}
function kp(t, e) {
  for (var n = Ep(t), r = -1, i = e.length; ++r < i; ) n.remove(e[r]);
}
function Tp(t) {
  return function () {
    Cp(this, t);
  };
}
function Np(t) {
  return function () {
    kp(this, t);
  };
}
function Pp(t, e) {
  return function () {
    (e.apply(this, arguments) ? Cp : kp)(this, t);
  };
}
function Dp() {
  this.textContent = '';
}
function Op(t) {
  return function () {
    this.textContent = t;
  };
}
function zp(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.textContent = e ?? '';
  };
}
function Rp() {
  this.innerHTML = '';
}
function Ip(t) {
  return function () {
    this.innerHTML = t;
  };
}
function jp(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? '';
  };
}
function Up() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Bp() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Hp() {
  return null;
}
function qp() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Wp() {
  var t = this.cloneNode(!1),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Lp() {
  var t = this.cloneNode(!0),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Fp(t) {
  return function () {
    var e = this.__on;
    if (e) {
      for (var n, r = 0, i = -1, o = e.length; r < o; ++r)
        (n = e[r]), (t.type && n.type !== t.type) || n.name !== t.name ? (e[++i] = n) : this.removeEventListener(n.type, n.listener, n.options);
      ++i ? (e.length = i) : delete this.__on;
    }
  };
}
function Vp(t, e, n) {
  return function () {
    var r,
      i = this.__on,
      o = (function (t) {
        return function (e) {
          t.call(this, e, this.__data__);
        };
      })(e);
    if (i)
      for (var a = 0, s = i.length; a < s; ++a)
        if ((r = i[a]).type === t.type && r.name === t.name)
          return this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, (r.listener = o), (r.options = n)), void (r.value = e);
    this.addEventListener(t.type, o, n), (r = { type: t.type, name: t.name, value: e, listener: o, options: n }), i ? i.push(r) : (this.__on = [r]);
  };
}
function Yp(t, e, n) {
  var r = gp(t),
    i = r.CustomEvent;
  'function' == typeof i
    ? (i = new i(e, n))
    : ((i = r.document.createEvent('Event')), n ? (i.initEvent(e, n.bubbles, n.cancelable), (i.detail = n.detail)) : i.initEvent(e, !1, !1)),
    t.dispatchEvent(i);
}
function Xp(t, e) {
  return function () {
    return Yp(this, t, e);
  };
}
function Zp(t, e) {
  return function () {
    return Yp(this, t, e.apply(this, arguments));
  };
}
(op.prototype = {
  constructor: op,
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
  (Sp.prototype = {
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
var Gp = [null];
function Kp(t, e) {
  (this._groups = t), (this._parents = e);
}
function Jp() {
  return new Kp([[document.documentElement]], Gp);
}
function Qp(t) {
  return 'string' == typeof t ? new Kp([[document.querySelector(t)]], [document.documentElement]) : new Kp([[t]], Gp);
}
Kp.prototype = Jp.prototype = {
  constructor: Kp,
  select: function (t) {
    'function' != typeof t && (t = Xd(t));
    for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
      for (var o, a, s = e[i], u = s.length, c = (r[i] = new Array(u)), l = 0; l < u; ++l)
        (o = s[l]) && (a = t.call(o, o.__data__, l, s)) && ('__data__' in o && (a.__data__ = o.__data__), (c[l] = a));
    return new Kp(r, this._parents);
  },
  selectAll: function (t) {
    t =
      'function' == typeof t
        ? (function (t) {
            return function () {
              return Zd(t.apply(this, arguments));
            };
          })(t)
        : Kd(t);
    for (var e = this._groups, n = e.length, r = [], i = [], o = 0; o < n; ++o)
      for (var a, s = e[o], u = s.length, c = 0; c < u; ++c) (a = s[c]) && (r.push(t.call(a, a.__data__, c, s)), i.push(a));
    return new Kp(r, i);
  },
  selectChild: function (t) {
    return this.select(
      null == t
        ? ep
        : (function (t) {
            return function () {
              return tp.call(this.children, t);
            };
          })('function' == typeof t ? t : Qd(t))
    );
  },
  selectChildren: function (t) {
    return this.selectAll(
      null == t
        ? rp
        : (function (t) {
            return function () {
              return np.call(this.children, t);
            };
          })('function' == typeof t ? t : Qd(t))
    );
  },
  filter: function (t) {
    'function' != typeof t && (t = Jd(t));
    for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
      for (var o, a = e[i], s = a.length, u = (r[i] = []), c = 0; c < s; ++c) (o = a[c]) && t.call(o, o.__data__, c, a) && u.push(o);
    return new Kp(r, this._parents);
  },
  data: function (t, e) {
    if (!arguments.length) return Array.from(this, up);
    var n = e ? sp : ap,
      r = this._parents,
      i = this._groups;
    'function' != typeof t &&
      (t = (function (t) {
        return function () {
          return t;
        };
      })(t));
    for (var o = i.length, a = new Array(o), s = new Array(o), u = new Array(o), c = 0; c < o; ++c) {
      var l = r[c],
        f = i[c],
        h = f.length,
        d = cp(t.call(l, l && l.__data__, c, r)),
        p = d.length,
        v = (s[c] = new Array(p)),
        m = (a[c] = new Array(p));
      n(l, f, v, m, (u[c] = new Array(h)), d, e);
      for (var g, y, b = 0, _ = 0; b < p; ++b)
        if ((g = v[b])) {
          for (b >= _ && (_ = b + 1); !(y = m[_]) && ++_ < p; );
          g._next = y || null;
        }
    }
    return ((a = new Kp(a, r))._enter = s), (a._exit = u), a;
  },
  enter: function () {
    return new Kp(this._enter || this._groups.map(ip), this._parents);
  },
  exit: function () {
    return new Kp(this._exit || this._groups.map(ip), this._parents);
  },
  join: function (t, e, n) {
    var r = this.enter(),
      i = this,
      o = this.exit();
    return (
      'function' == typeof t ? (r = t(r)) && (r = r.selection()) : (r = r.append(t + '')),
      null != e && (i = e(i)) && (i = i.selection()),
      null == n ? o.remove() : n(o),
      r && i ? r.merge(i).order() : i
    );
  },
  merge: function (t) {
    for (
      var e = t.selection ? t.selection() : t, n = this._groups, r = e._groups, i = n.length, o = r.length, a = Math.min(i, o), s = new Array(i), u = 0;
      u < a;
      ++u
    )
      for (var c, l = n[u], f = r[u], h = l.length, d = (s[u] = new Array(h)), p = 0; p < h; ++p) (c = l[p] || f[p]) && (d[p] = c);
    for (; u < i; ++u) s[u] = n[u];
    return new Kp(s, this._parents);
  },
  selection: function () {
    return this;
  },
  order: function () {
    for (var t = this._groups, e = -1, n = t.length; ++e < n; )
      for (var r, i = t[e], o = i.length - 1, a = i[o]; --o >= 0; ) (r = i[o]) && (a && 4 ^ r.compareDocumentPosition(a) && a.parentNode.insertBefore(r, a), (a = r));
    return this;
  },
  sort: function (t) {
    function e(e, n) {
      return e && n ? t(e.__data__, n.__data__) : !e - !n;
    }
    t || (t = lp);
    for (var n = this._groups, r = n.length, i = new Array(r), o = 0; o < r; ++o) {
      for (var a, s = n[o], u = s.length, c = (i[o] = new Array(u)), l = 0; l < u; ++l) (a = s[l]) && (c[l] = a);
      c.sort(e);
    }
    return new Kp(i, this._parents).order();
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
      for (var r = t[e], i = 0, o = r.length; i < o; ++i) {
        var a = r[i];
        if (a) return a;
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
    for (var e = this._groups, n = 0, r = e.length; n < r; ++n) for (var i, o = e[n], a = 0, s = o.length; a < s; ++a) (i = o[a]) && t.call(i, i.__data__, a, o);
    return this;
  },
  attr: function (t, e) {
    var n = Wd(t);
    if (arguments.length < 2) {
      var r = this.node();
      return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
    }
    return this.each((null == e ? (n.local ? hp : fp) : 'function' == typeof e ? (n.local ? mp : vp) : n.local ? pp : dp)(n, e));
  },
  style: function (t, e, n) {
    return arguments.length > 1 ? this.each((null == e ? yp : 'function' == typeof e ? _p : bp)(t, e, n ?? '')) : wp(this.node(), t);
  },
  property: function (t, e) {
    return arguments.length > 1 ? this.each((null == e ? xp : 'function' == typeof e ? Mp : Ap)(t, e)) : this.node()[t];
  },
  classed: function (t, e) {
    var n = $p(t + '');
    if (arguments.length < 2) {
      for (var r = Ep(this.node()), i = -1, o = n.length; ++i < o; ) if (!r.contains(n[i])) return !1;
      return !0;
    }
    return this.each(('function' == typeof e ? Pp : e ? Tp : Np)(n, e));
  },
  text: function (t) {
    return arguments.length ? this.each(null == t ? Dp : ('function' == typeof t ? zp : Op)(t)) : this.node().textContent;
  },
  html: function (t) {
    return arguments.length ? this.each(null == t ? Rp : ('function' == typeof t ? jp : Ip)(t)) : this.node().innerHTML;
  },
  raise: function () {
    return this.each(Up);
  },
  lower: function () {
    return this.each(Bp);
  },
  append: function (t) {
    var e = 'function' == typeof t ? t : Vd(t);
    return this.select(function () {
      return this.appendChild(e.apply(this, arguments));
    });
  },
  insert: function (t, e) {
    var n = 'function' == typeof t ? t : Vd(t),
      r = null == e ? Hp : 'function' == typeof e ? e : Xd(e);
    return this.select(function () {
      return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
    });
  },
  remove: function () {
    return this.each(qp);
  },
  clone: function (t) {
    return this.select(t ? Lp : Wp);
  },
  datum: function (t) {
    return arguments.length ? this.property('__data__', t) : this.node().__data__;
  },
  on: function (t, e, n) {
    var r,
      i,
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
      a = o.length;
    if (!(arguments.length < 2)) {
      for (s = e ? Vp : Fp, r = 0; r < a; ++r) this.each(s(o[r], e, n));
      return this;
    }
    var s = this.node().__on;
    if (s) for (var u, c = 0, l = s.length; c < l; ++c) for (r = 0, u = s[c]; r < a; ++r) if ((i = o[r]).type === u.type && i.name === u.name) return u.value;
  },
  dispatch: function (t, e) {
    return this.each(('function' == typeof e ? Zp : Xp)(t, e));
  },
  [Symbol.iterator]: function* () {
    for (var t = this._groups, e = 0, n = t.length; e < n; ++e) for (var r, i = t[e], o = 0, a = i.length; o < a; ++o) (r = i[o]) && (yield r);
  },
};
var tv = 0;
function ev() {
  return new nv();
}
function nv() {
  this._ = '@' + (++tv).toString(36);
}
function rv(t) {
  let e;
  for (; (e = t.sourceEvent); ) t = e;
  return t;
}
function iv(t, e) {
  if (((t = rv(t)), void 0 === e && (e = t.currentTarget), e)) {
    var n = e.ownerSVGElement || e;
    if (n.createSVGPoint) {
      var r = n.createSVGPoint();
      return (r.x = t.clientX), (r.y = t.clientY), [(r = r.matrixTransform(e.getScreenCTM().inverse())).x, r.y];
    }
    if (e.getBoundingClientRect) {
      var i = e.getBoundingClientRect();
      return [t.clientX - i.left - e.clientLeft, t.clientY - i.top - e.clientTop];
    }
  }
  return [t.pageX, t.pageY];
}
nv.prototype = ev.prototype = {
  constructor: nv,
  get: function (t) {
    for (var e = this._; !(e in t); ) if (!(t = t.parentNode)) return;
    return t[e];
  },
  set: function (t, e) {
    return (t[this._] = e);
  },
  remove: function (t) {
    return this._ in t && delete t[this._];
  },
  toString: function () {
    return this._;
  },
};
var ov = Oa(
    Object.freeze({
      __proto__: null,
      create: function (t) {
        return Qp(Vd(t).call(document.documentElement));
      },
      creator: Vd,
      local: ev,
      matcher: Jd,
      namespace: Wd,
      namespaces: qd,
      pointer: iv,
      pointers: function (t, e) {
        return t.target && ((t = rv(t)), void 0 === e && (e = t.currentTarget), (t = t.touches || [t])), Array.from(t, (t) => iv(t, e));
      },
      select: Qp,
      selectAll: function (t) {
        return 'string' == typeof t ? new Kp([document.querySelectorAll(t)], [document.documentElement]) : new Kp([Zd(t)], Gp);
      },
      selection: Jp,
      selector: Xd,
      selectorAll: Kd,
      style: wp,
      window: gp,
    })
  ),
  av = { value: () => {} };
function sv() {
  for (var t, e = 0, n = arguments.length, r = {}; e < n; ++e) {
    if (!(t = arguments[e] + '') || t in r || /[\s.]/.test(t)) throw new Error('illegal type: ' + t);
    r[t] = [];
  }
  return new uv(r);
}
function uv(t) {
  this._ = t;
}
function cv(t, e) {
  for (var n, r = 0, i = t.length; r < i; ++r) if ((n = t[r]).name === e) return n.value;
}
function lv(t, e, n) {
  for (var r = 0, i = t.length; r < i; ++r)
    if (t[r].name === e) {
      (t[r] = av), (t = t.slice(0, r).concat(t.slice(r + 1)));
      break;
    }
  return null != n && t.push({ name: e, value: n }), t;
}
uv.prototype = sv.prototype = {
  constructor: uv,
  on: function (t, e) {
    var n,
      r,
      i = this._,
      o =
        ((r = i),
        (t + '')
          .trim()
          .split(/^|\s+/)
          .map(function (t) {
            var e = '',
              n = t.indexOf('.');
            if ((n >= 0 && ((e = t.slice(n + 1)), (t = t.slice(0, n))), t && !r.hasOwnProperty(t))) throw new Error('unknown type: ' + t);
            return { type: t, name: e };
          })),
      a = -1,
      s = o.length;
    if (!(arguments.length < 2)) {
      if (null != e && 'function' != typeof e) throw new Error('invalid callback: ' + e);
      for (; ++a < s; )
        if ((n = (t = o[a]).type)) i[n] = lv(i[n], t.name, e);
        else if (null == e) for (n in i) i[n] = lv(i[n], t.name, null);
      return this;
    }
    for (; ++a < s; ) if ((n = (t = o[a]).type) && (n = cv(i[n], t.name))) return n;
  },
  copy: function () {
    var t = {},
      e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new uv(t);
  },
  call: function (t, e) {
    if ((n = arguments.length - 2) > 0) for (var n, r, i = new Array(n), o = 0; o < n; ++o) i[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (o = 0, n = (r = this._[t]).length; o < n; ++o) r[o].value.apply(e, i);
  },
  apply: function (t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (var r = this._[t], i = 0, o = r.length; i < o; ++i) r[i].value.apply(e, n);
  },
};
const fv = { capture: !0, passive: !1 };
function hv(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
var dv,
  pv,
  vv = 0,
  mv = 0,
  gv = 0,
  yv = 1e3,
  bv = 0,
  _v = 0,
  wv = 0,
  xv = 'object' == typeof performance && performance.now ? performance : Date,
  Av =
    'object' == typeof window && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : function (t) {
          setTimeout(t, 17);
        };
function Mv() {
  return _v || (Av($v), (_v = xv.now() + wv));
}
function $v() {
  _v = 0;
}
function Ev() {
  this._call = this._time = this._next = null;
}
function Sv(t, e, n) {
  var r = new Ev();
  return r.restart(t, e, n), r;
}
function Cv() {
  (_v = (bv = xv.now()) + wv), (vv = mv = 0);
  try {
    !(function () {
      Mv(), ++vv;
      for (var t, e = dv; e; ) (t = _v - e._time) >= 0 && e._call.call(void 0, t), (e = e._next);
      --vv;
    })();
  } finally {
    (vv = 0),
      (function () {
        var t,
          e,
          n = dv,
          r = 1 / 0;
        for (; n; ) n._call ? (r > n._time && (r = n._time), (t = n), (n = n._next)) : ((e = n._next), (n._next = null), (n = t ? (t._next = e) : (dv = e)));
        (pv = t), Tv(r);
      })(),
      (_v = 0);
  }
}
function kv() {
  var t = xv.now(),
    e = t - bv;
  e > yv && ((wv -= e), (bv = t));
}
function Tv(t) {
  vv ||
    (mv && (mv = clearTimeout(mv)),
    t - _v > 24
      ? (t < 1 / 0 && (mv = setTimeout(Cv, t - xv.now() - wv)), gv && (gv = clearInterval(gv)))
      : (gv || ((bv = xv.now()), (gv = setInterval(kv, yv))), (vv = 1), Av(Cv)));
}
function Nv(t, e, n) {
  var r = new Ev();
  return (
    (e = null == e ? 0 : +e),
    r.restart(
      (n) => {
        r.stop(), t(n + e);
      },
      e,
      n
    ),
    r
  );
}
Ev.prototype = Sv.prototype = {
  constructor: Ev,
  restart: function (t, e, n) {
    if ('function' != typeof t) throw new TypeError('callback is not a function');
    (n = (null == n ? Mv() : +n) + (null == e ? 0 : +e)),
      this._next || pv === this || (pv ? (pv._next = this) : (dv = this), (pv = this)),
      (this._call = t),
      (this._time = n),
      Tv();
  },
  stop: function () {
    this._call && ((this._call = null), (this._time = 1 / 0), Tv());
  },
};
var Pv = sv('start', 'end', 'cancel', 'interrupt'),
  Dv = [],
  Ov = 0,
  zv = 1,
  Rv = 2,
  Iv = 3,
  jv = 4,
  Uv = 5,
  Bv = 6;
function Hv(t, e, n, r, i, o) {
  var a = t.__transition;
  if (a) {
    if (n in a) return;
  } else t.__transition = {};
  !(function (t, e, n) {
    var r,
      i = t.__transition;
    function o(t) {
      (n.state = zv), n.timer.restart(a, n.delay, n.time), n.delay <= t && a(t - n.delay);
    }
    function a(o) {
      var c, l, f, h;
      if (n.state !== zv) return u();
      for (c in i)
        if ((h = i[c]).name === n.name) {
          if (h.state === Iv) return Nv(a);
          h.state === jv
            ? ((h.state = Bv), h.timer.stop(), h.on.call('interrupt', t, t.__data__, h.index, h.group), delete i[c])
            : +c < e && ((h.state = Bv), h.timer.stop(), h.on.call('cancel', t, t.__data__, h.index, h.group), delete i[c]);
        }
      if (
        (Nv(function () {
          n.state === Iv && ((n.state = jv), n.timer.restart(s, n.delay, n.time), s(o));
        }),
        (n.state = Rv),
        n.on.call('start', t, t.__data__, n.index, n.group),
        n.state === Rv)
      ) {
        for (n.state = Iv, r = new Array((f = n.tween.length)), c = 0, l = -1; c < f; ++c)
          (h = n.tween[c].value.call(t, t.__data__, n.index, n.group)) && (r[++l] = h);
        r.length = l + 1;
      }
    }
    function s(e) {
      for (var i = e < n.duration ? n.ease.call(null, e / n.duration) : (n.timer.restart(u), (n.state = Uv), 1), o = -1, a = r.length; ++o < a; ) r[o].call(t, i);
      n.state === Uv && (n.on.call('end', t, t.__data__, n.index, n.group), u());
    }
    function u() {
      for (var r in ((n.state = Bv), n.timer.stop(), delete i[e], i)) return;
      delete t.__transition;
    }
    (i[e] = n), (n.timer = Sv(o, 0, n.time));
  })(t, n, { name: e, index: r, group: i, on: Pv, tween: Dv, time: o.time, delay: o.delay, duration: o.duration, ease: o.ease, timer: null, state: Ov });
}
function qv(t, e) {
  var n = Lv(t, e);
  if (n.state > Ov) throw new Error('too late; already scheduled');
  return n;
}
function Wv(t, e) {
  var n = Lv(t, e);
  if (n.state > Iv) throw new Error('too late; already running');
  return n;
}
function Lv(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error('transition not found');
  return n;
}
function Fv(t, e) {
  var n,
    r,
    i,
    o = t.__transition,
    a = !0;
  if (o) {
    for (i in ((e = null == e ? null : e + ''), o))
      (n = o[i]).name === e
        ? ((r = n.state > Rv && n.state < Uv), (n.state = Bv), n.timer.stop(), n.on.call(r ? 'interrupt' : 'cancel', t, t.__data__, n.index, n.group), delete o[i])
        : (a = !1);
    a && delete t.__transition;
  }
}
function Vv(t, e) {
  var n, r;
  return function () {
    var i = Wv(this, t),
      o = i.tween;
    if (o !== n)
      for (var a = 0, s = (r = n = o).length; a < s; ++a)
        if (r[a].name === e) {
          (r = r.slice()).splice(a, 1);
          break;
        }
    i.tween = r;
  };
}
function Yv(t, e, n) {
  var r, i;
  if ('function' != typeof n) throw new Error();
  return function () {
    var o = Wv(this, t),
      a = o.tween;
    if (a !== r) {
      i = (r = a).slice();
      for (var s = { name: e, value: n }, u = 0, c = i.length; u < c; ++u)
        if (i[u].name === e) {
          i[u] = s;
          break;
        }
      u === c && i.push(s);
    }
    o.tween = i;
  };
}
function Xv(t, e, n) {
  var r = t._id;
  return (
    t.each(function () {
      var t = Wv(this, r);
      (t.value || (t.value = {}))[e] = n.apply(this, arguments);
    }),
    function (t) {
      return Lv(t, r).value[e];
    }
  );
}
function Zv(t, e) {
  var n;
  return ('number' == typeof e ? Iu : e instanceof rs ? Nu : (n = rs(e)) ? ((e = n), Nu) : Hu)(t, e);
}
function Gv(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function Kv(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Jv(t, e, n) {
  var r,
    i,
    o = n + '';
  return function () {
    var a = this.getAttribute(t);
    return a === o ? null : a === r ? i : (i = e((r = a), n));
  };
}
function Qv(t, e, n) {
  var r,
    i,
    o = n + '';
  return function () {
    var a = this.getAttributeNS(t.space, t.local);
    return a === o ? null : a === r ? i : (i = e((r = a), n));
  };
}
function tm(t, e, n) {
  var r, i, o;
  return function () {
    var a,
      s,
      u = n(this);
    if (null != u) return (a = this.getAttribute(t)) === (s = u + '') ? null : a === r && s === i ? o : ((i = s), (o = e((r = a), u)));
    this.removeAttribute(t);
  };
}
function em(t, e, n) {
  var r, i, o;
  return function () {
    var a,
      s,
      u = n(this);
    if (null != u) return (a = this.getAttributeNS(t.space, t.local)) === (s = u + '') ? null : a === r && s === i ? o : ((i = s), (o = e((r = a), u)));
    this.removeAttributeNS(t.space, t.local);
  };
}
function nm(t, e) {
  var n, r;
  function i() {
    var i = e.apply(this, arguments);
    return (
      i !== r &&
        (n =
          (r = i) &&
          (function (t, e) {
            return function (n) {
              this.setAttributeNS(t.space, t.local, e.call(this, n));
            };
          })(t, i)),
      n
    );
  }
  return (i._value = e), i;
}
function rm(t, e) {
  var n, r;
  function i() {
    var i = e.apply(this, arguments);
    return (
      i !== r &&
        (n =
          (r = i) &&
          (function (t, e) {
            return function (n) {
              this.setAttribute(t, e.call(this, n));
            };
          })(t, i)),
      n
    );
  }
  return (i._value = e), i;
}
function im(t, e) {
  return function () {
    qv(this, t).delay = +e.apply(this, arguments);
  };
}
function om(t, e) {
  return (
    (e = +e),
    function () {
      qv(this, t).delay = e;
    }
  );
}
function am(t, e) {
  return function () {
    Wv(this, t).duration = +e.apply(this, arguments);
  };
}
function sm(t, e) {
  return (
    (e = +e),
    function () {
      Wv(this, t).duration = e;
    }
  );
}
var um = Jp.prototype.constructor;
function cm(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
var lm = 0;
function fm(t, e, n, r) {
  (this._groups = t), (this._parents = e), (this._name = n), (this._id = r);
}
function hm() {
  return ++lm;
}
var dm = Jp.prototype;
fm.prototype = {
  constructor: fm,
  select: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = Xd(t));
    for (var r = this._groups, i = r.length, o = new Array(i), a = 0; a < i; ++a)
      for (var s, u, c = r[a], l = c.length, f = (o[a] = new Array(l)), h = 0; h < l; ++h)
        (s = c[h]) && (u = t.call(s, s.__data__, h, c)) && ('__data__' in s && (u.__data__ = s.__data__), (f[h] = u), Hv(f[h], e, n, h, f, Lv(s, n)));
    return new fm(o, this._parents, e, n);
  },
  selectAll: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = Kd(t));
    for (var r = this._groups, i = r.length, o = [], a = [], s = 0; s < i; ++s)
      for (var u, c = r[s], l = c.length, f = 0; f < l; ++f)
        if ((u = c[f])) {
          for (var h, d = t.call(u, u.__data__, f, c), p = Lv(u, n), v = 0, m = d.length; v < m; ++v) (h = d[v]) && Hv(h, e, n, v, d, p);
          o.push(d), a.push(u);
        }
    return new fm(o, a, e, n);
  },
  selectChild: dm.selectChild,
  selectChildren: dm.selectChildren,
  filter: function (t) {
    'function' != typeof t && (t = Jd(t));
    for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
      for (var o, a = e[i], s = a.length, u = (r[i] = []), c = 0; c < s; ++c) (o = a[c]) && t.call(o, o.__data__, c, a) && u.push(o);
    return new fm(r, this._parents, this._name, this._id);
  },
  merge: function (t) {
    if (t._id !== this._id) throw new Error();
    for (var e = this._groups, n = t._groups, r = e.length, i = n.length, o = Math.min(r, i), a = new Array(r), s = 0; s < o; ++s)
      for (var u, c = e[s], l = n[s], f = c.length, h = (a[s] = new Array(f)), d = 0; d < f; ++d) (u = c[d] || l[d]) && (h[d] = u);
    for (; s < r; ++s) a[s] = e[s];
    return new fm(a, this._parents, this._name, this._id);
  },
  selection: function () {
    return new um(this._groups, this._parents);
  },
  transition: function () {
    for (var t = this._name, e = this._id, n = hm(), r = this._groups, i = r.length, o = 0; o < i; ++o)
      for (var a, s = r[o], u = s.length, c = 0; c < u; ++c)
        if ((a = s[c])) {
          var l = Lv(a, e);
          Hv(a, t, n, c, s, { time: l.time + l.delay + l.duration, delay: 0, duration: l.duration, ease: l.ease });
        }
    return new fm(r, this._parents, t, n);
  },
  call: dm.call,
  nodes: dm.nodes,
  node: dm.node,
  size: dm.size,
  empty: dm.empty,
  each: dm.each,
  on: function (t, e) {
    var n = this._id;
    return arguments.length < 2
      ? Lv(this.node(), n).on.on(t)
      : this.each(
          (function (t, e, n) {
            var r,
              i,
              o = (function (t) {
                return (t + '')
                  .trim()
                  .split(/^|\s+/)
                  .every(function (t) {
                    var e = t.indexOf('.');
                    return e >= 0 && (t = t.slice(0, e)), !t || 'start' === t;
                  });
              })(e)
                ? qv
                : Wv;
            return function () {
              var a = o(this, t),
                s = a.on;
              s !== r && (i = (r = s).copy()).on(e, n), (a.on = i);
            };
          })(n, t, e)
        );
  },
  attr: function (t, e) {
    var n = Wd(t),
      r = 'transform' === n ? Gu : Zv;
    return this.attrTween(
      t,
      'function' == typeof e ? (n.local ? em : tm)(n, r, Xv(this, 'attr.' + t, e)) : null == e ? (n.local ? Kv : Gv)(n) : (n.local ? Qv : Jv)(n, r, e)
    );
  },
  attrTween: function (t, e) {
    var n = 'attr.' + t;
    if (arguments.length < 2) return (n = this.tween(n)) && n._value;
    if (null == e) return this.tween(n, null);
    if ('function' != typeof e) throw new Error();
    var r = Wd(t);
    return this.tween(n, (r.local ? nm : rm)(r, e));
  },
  style: function (t, e, n) {
    var r = 'transform' == (t += '') ? Zu : Zv;
    return null == e
      ? this.styleTween(
          t,
          (function (t, e) {
            var n, r, i;
            return function () {
              var o = wp(this, t),
                a = (this.style.removeProperty(t), wp(this, t));
              return o === a ? null : o === n && a === r ? i : (i = e((n = o), (r = a)));
            };
          })(t, r)
        ).on('end.style.' + t, cm(t))
      : 'function' == typeof e
      ? this.styleTween(
          t,
          (function (t, e, n) {
            var r, i, o;
            return function () {
              var a = wp(this, t),
                s = n(this),
                u = s + '';
              return null == s && (this.style.removeProperty(t), (u = s = wp(this, t))), a === u ? null : a === r && u === i ? o : ((i = u), (o = e((r = a), s)));
            };
          })(t, r, Xv(this, 'style.' + t, e))
        ).each(
          (function (t, e) {
            var n,
              r,
              i,
              o,
              a = 'style.' + e,
              s = 'end.' + a;
            return function () {
              var u = Wv(this, t),
                c = u.on,
                l = null == u.value[a] ? o || (o = cm(e)) : void 0;
              (c === n && i === l) || (r = (n = c).copy()).on(s, (i = l)), (u.on = r);
            };
          })(this._id, t)
        )
      : this.styleTween(
          t,
          (function (t, e, n) {
            var r,
              i,
              o = n + '';
            return function () {
              var a = wp(this, t);
              return a === o ? null : a === r ? i : (i = e((r = a), n));
            };
          })(t, r, e),
          n
        ).on('end.style.' + t, null);
  },
  styleTween: function (t, e, n) {
    var r = 'style.' + (t += '');
    if (arguments.length < 2) return (r = this.tween(r)) && r._value;
    if (null == e) return this.tween(r, null);
    if ('function' != typeof e) throw new Error();
    return this.tween(
      r,
      (function (t, e, n) {
        var r, i;
        function o() {
          var o = e.apply(this, arguments);
          return (
            o !== i &&
              (r =
                (i = o) &&
                (function (t, e, n) {
                  return function (r) {
                    this.style.setProperty(t, e.call(this, r), n);
                  };
                })(t, o, n)),
            r
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
          })(Xv(this, 'text', t))
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
        function r() {
          var r = t.apply(this, arguments);
          return (
            r !== n &&
              (e =
                (n = r) &&
                (function (t) {
                  return function (e) {
                    this.textContent = t.call(this, e);
                  };
                })(r)),
            e
          );
        }
        return (r._value = t), r;
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
      for (var r, i = Lv(this.node(), n).tween, o = 0, a = i.length; o < a; ++o) if ((r = i[o]).name === t) return r.value;
      return null;
    }
    return this.each((null == e ? Vv : Yv)(n, t, e));
  },
  delay: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? im : om)(e, t)) : Lv(this.node(), e).delay;
  },
  duration: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? am : sm)(e, t)) : Lv(this.node(), e).duration;
  },
  ease: function (t) {
    var e = this._id;
    return arguments.length
      ? this.each(
          (function (t, e) {
            if ('function' != typeof e) throw new Error();
            return function () {
              Wv(this, t).ease = e;
            };
          })(e, t)
        )
      : Lv(this.node(), e).ease;
  },
  easeVarying: function (t) {
    if ('function' != typeof t) throw new Error();
    return this.each(
      (function (t, e) {
        return function () {
          var n = e.apply(this, arguments);
          if ('function' != typeof n) throw new Error();
          Wv(this, t).ease = n;
        };
      })(this._id, t)
    );
  },
  end: function () {
    var t,
      e,
      n = this,
      r = n._id,
      i = n.size();
    return new Promise(function (o, a) {
      var s = { value: a },
        u = {
          value: function () {
            0 == --i && o();
          },
        };
      n.each(function () {
        var n = Wv(this, r),
          i = n.on;
        i !== t && ((e = (t = i).copy())._.cancel.push(s), e._.interrupt.push(s), e._.end.push(u)), (n.on = e);
      }),
        0 === i && o();
    });
  },
  [Symbol.iterator]: dm[Symbol.iterator],
};
var pm = {
  time: null,
  delay: 0,
  duration: 250,
  ease: function (t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  },
};
function vm(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); ) if (!(t = t.parentNode)) throw new Error(`transition ${e} not found`);
  return n;
}
(Jp.prototype.interrupt = function (t) {
  return this.each(function () {
    Fv(this, t);
  });
}),
  (Jp.prototype.transition = function (t) {
    var e, n;
    t instanceof fm ? ((e = t._id), (t = t._name)) : ((e = hm()), ((n = pm).time = Mv()), (t = null == t ? null : t + ''));
    for (var r = this._groups, i = r.length, o = 0; o < i; ++o) for (var a, s = r[o], u = s.length, c = 0; c < u; ++c) (a = s[c]) && Hv(a, t, e, c, s, n || vm(a, e));
    return new fm(r, this._parents, t, e);
  });
var mm = (t) => () => t;
function gm(t, { sourceEvent: e, target: n, transform: r, dispatch: i }) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: r, enumerable: !0, configurable: !0 },
    _: { value: i },
  });
}
function ym(t, e, n) {
  (this.k = t), (this.x = e), (this.y = n);
}
ym.prototype = {
  constructor: ym,
  scale: function (t) {
    return 1 === t ? this : new ym(this.k * t, this.x, this.y);
  },
  translate: function (t, e) {
    return (0 === t) & (0 === e) ? this : new ym(this.k, this.x + this.k * t, this.y + this.k * e);
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
var bm = new ym(1, 0, 0);
function _m(t) {
  for (; !t.__zoom; ) if (!(t = t.parentNode)) return bm;
  return t.__zoom;
}
function wm(t) {
  t.stopImmediatePropagation();
}
function xm(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Am(t) {
  return !((t.ctrlKey && 'wheel' !== t.type) || t.button);
}
function Mm() {
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
function $m() {
  return this.__zoom || bm;
}
function Em(t) {
  return -t.deltaY * (1 === t.deltaMode ? 0.05 : t.deltaMode ? 1 : 0.002) * (t.ctrlKey ? 10 : 1);
}
function Sm() {
  return navigator.maxTouchPoints || 'ontouchstart' in this;
}
function Cm(t, e, n) {
  var r = t.invertX(e[0][0]) - n[0][0],
    i = t.invertX(e[1][0]) - n[1][0],
    o = t.invertY(e[0][1]) - n[0][1],
    a = t.invertY(e[1][1]) - n[1][1];
  return t.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), a > o ? (o + a) / 2 : Math.min(0, o) || Math.max(0, a));
}
_m.prototype = ym.prototype;
var km,
  Tm = Object.freeze({
    __proto__: null,
    ZoomTransform: ym,
    zoom: function () {
      var t,
        e,
        n,
        r = Am,
        i = Mm,
        o = Cm,
        a = Em,
        s = Sm,
        u = [0, 1 / 0],
        c = [
          [-1 / 0, -1 / 0],
          [1 / 0, 1 / 0],
        ],
        l = 250,
        f = Ju,
        h = sv('start', 'zoom', 'end'),
        d = 500,
        p = 150,
        v = 0,
        m = 10;
      function g(t) {
        t.property('__zoom', $m)
          .on('wheel.zoom', M, { passive: !1 })
          .on('mousedown.zoom', $)
          .on('dblclick.zoom', E)
          .filter(s)
          .on('touchstart.zoom', S)
          .on('touchmove.zoom', C)
          .on('touchend.zoom touchcancel.zoom', k)
          .style('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
      }
      function y(t, e) {
        return (e = Math.max(u[0], Math.min(u[1], e))) === t.k ? t : new ym(e, t.x, t.y);
      }
      function b(t, e, n) {
        var r = e[0] - n[0] * t.k,
          i = e[1] - n[1] * t.k;
        return r === t.x && i === t.y ? t : new ym(t.k, r, i);
      }
      function _(t) {
        return [(+t[0][0] + +t[1][0]) / 2, (+t[0][1] + +t[1][1]) / 2];
      }
      function w(t, e, n, r) {
        t.on('start.zoom', function () {
          x(this, arguments).event(r).start();
        })
          .on('interrupt.zoom end.zoom', function () {
            x(this, arguments).event(r).end();
          })
          .tween('zoom', function () {
            var t = this,
              o = arguments,
              a = x(t, o).event(r),
              s = i.apply(t, o),
              u = null == n ? _(s) : 'function' == typeof n ? n.apply(t, o) : n,
              c = Math.max(s[1][0] - s[0][0], s[1][1] - s[0][1]),
              l = t.__zoom,
              h = 'function' == typeof e ? e.apply(t, o) : e,
              d = f(l.invert(u).concat(c / l.k), h.invert(u).concat(c / h.k));
            return function (t) {
              if (1 === t) t = h;
              else {
                var e = d(t),
                  n = c / e[2];
                t = new ym(n, u[0] - e[0] * n, u[1] - e[1] * n);
              }
              a.zoom(null, t);
            };
          });
      }
      function x(t, e, n) {
        return (!n && t.__zooming) || new A(t, e);
      }
      function A(t, e) {
        (this.that = t), (this.args = e), (this.active = 0), (this.sourceEvent = null), (this.extent = i.apply(t, e)), (this.taps = 0);
      }
      function M(t, ...e) {
        if (r.apply(this, arguments)) {
          var n = x(this, e).event(t),
            i = this.__zoom,
            s = Math.max(u[0], Math.min(u[1], i.k * Math.pow(2, a.apply(this, arguments)))),
            l = iv(t);
          if (n.wheel) (n.mouse[0][0] === l[0] && n.mouse[0][1] === l[1]) || (n.mouse[1] = i.invert((n.mouse[0] = l))), clearTimeout(n.wheel);
          else {
            if (i.k === s) return;
            (n.mouse = [l, i.invert(l)]), Fv(this), n.start();
          }
          xm(t),
            (n.wheel = setTimeout(function () {
              (n.wheel = null), n.end();
            }, p)),
            n.zoom('mouse', o(b(y(i, s), n.mouse[0], n.mouse[1]), n.extent, c));
        }
      }
      function $(t, ...e) {
        if (!n && r.apply(this, arguments)) {
          var i = t.currentTarget,
            a = x(this, e, !0).event(t),
            s = Qp(t.view)
              .on(
                'mousemove.zoom',
                function (t) {
                  if ((xm(t), !a.moved)) {
                    var e = t.clientX - l,
                      n = t.clientY - f;
                    a.moved = e * e + n * n > v;
                  }
                  a.event(t).zoom('mouse', o(b(a.that.__zoom, (a.mouse[0] = iv(t, i)), a.mouse[1]), a.extent, c));
                },
                !0
              )
              .on(
                'mouseup.zoom',
                function (t) {
                  s.on('mousemove.zoom mouseup.zoom', null),
                    (function (t, e) {
                      var n = t.document.documentElement,
                        r = Qp(t).on('dragstart.drag', null);
                      e &&
                        (r.on('click.drag', hv, fv),
                        setTimeout(function () {
                          r.on('click.drag', null);
                        }, 0)),
                        'onselectstart' in n ? r.on('selectstart.drag', null) : ((n.style.MozUserSelect = n.__noselect), delete n.__noselect);
                    })(t.view, a.moved),
                    xm(t),
                    a.event(t).end();
                },
                !0
              ),
            u = iv(t, i),
            l = t.clientX,
            f = t.clientY;
          !(function (t) {
            var e = t.document.documentElement,
              n = Qp(t).on('dragstart.drag', hv, fv);
            'onselectstart' in e ? n.on('selectstart.drag', hv, fv) : ((e.__noselect = e.style.MozUserSelect), (e.style.MozUserSelect = 'none'));
          })(t.view),
            wm(t),
            (a.mouse = [u, this.__zoom.invert(u)]),
            Fv(this),
            a.start();
        }
      }
      function E(t, ...e) {
        if (r.apply(this, arguments)) {
          var n = this.__zoom,
            a = iv(t.changedTouches ? t.changedTouches[0] : t, this),
            s = n.invert(a),
            u = n.k * (t.shiftKey ? 0.5 : 2),
            f = o(b(y(n, u), a, s), i.apply(this, e), c);
          xm(t), l > 0 ? Qp(this).transition().duration(l).call(w, f, a, t) : Qp(this).call(g.transform, f, a, t);
        }
      }
      function S(n, ...i) {
        if (r.apply(this, arguments)) {
          var o,
            a,
            s,
            u,
            c = n.touches,
            l = c.length,
            f = x(this, i, n.changedTouches.length === l).event(n);
          for (wm(n), a = 0; a < l; ++a)
            (u = [(u = iv((s = c[a]), this)), this.__zoom.invert(u), s.identifier]),
              f.touch0 ? f.touch1 || f.touch0[2] === u[2] || ((f.touch1 = u), (f.taps = 0)) : ((f.touch0 = u), (o = !0), (f.taps = 1 + !!t));
          t && (t = clearTimeout(t)),
            o &&
              (f.taps < 2 &&
                ((e = u[0]),
                (t = setTimeout(function () {
                  t = null;
                }, d))),
              Fv(this),
              f.start());
        }
      }
      function C(t, ...e) {
        if (this.__zooming) {
          var n,
            r,
            i,
            a,
            s = x(this, e).event(t),
            u = t.changedTouches,
            l = u.length;
          for (xm(t), n = 0; n < l; ++n)
            (i = iv((r = u[n]), this)), s.touch0 && s.touch0[2] === r.identifier ? (s.touch0[0] = i) : s.touch1 && s.touch1[2] === r.identifier && (s.touch1[0] = i);
          if (((r = s.that.__zoom), s.touch1)) {
            var f = s.touch0[0],
              h = s.touch0[1],
              d = s.touch1[0],
              p = s.touch1[1],
              v = (v = d[0] - f[0]) * v + (v = d[1] - f[1]) * v,
              m = (m = p[0] - h[0]) * m + (m = p[1] - h[1]) * m;
            (r = y(r, Math.sqrt(v / m))), (i = [(f[0] + d[0]) / 2, (f[1] + d[1]) / 2]), (a = [(h[0] + p[0]) / 2, (h[1] + p[1]) / 2]);
          } else {
            if (!s.touch0) return;
            (i = s.touch0[0]), (a = s.touch0[1]);
          }
          s.zoom('touch', o(b(r, i, a), s.extent, c));
        }
      }
      function k(t, ...r) {
        if (this.__zooming) {
          var i,
            o,
            a = x(this, r).event(t),
            s = t.changedTouches,
            u = s.length;
          for (
            wm(t),
              n && clearTimeout(n),
              n = setTimeout(function () {
                n = null;
              }, d),
              i = 0;
            i < u;
            ++i
          )
            (o = s[i]), a.touch0 && a.touch0[2] === o.identifier ? delete a.touch0 : a.touch1 && a.touch1[2] === o.identifier && delete a.touch1;
          if ((a.touch1 && !a.touch0 && ((a.touch0 = a.touch1), delete a.touch1), a.touch0)) a.touch0[1] = this.__zoom.invert(a.touch0[0]);
          else if ((a.end(), 2 === a.taps && ((o = iv(o, this)), Math.hypot(e[0] - o[0], e[1] - o[1]) < m))) {
            var c = Qp(this).on('dblclick.zoom');
            c && c.apply(this, arguments);
          }
        }
      }
      return (
        (g.transform = function (t, e, n, r) {
          var i = t.selection ? t.selection() : t;
          i.property('__zoom', $m),
            t !== i
              ? w(t, e, n, r)
              : i.interrupt().each(function () {
                  x(this, arguments)
                    .event(r)
                    .start()
                    .zoom(null, 'function' == typeof e ? e.apply(this, arguments) : e)
                    .end();
                });
        }),
        (g.scaleBy = function (t, e, n, r) {
          g.scaleTo(
            t,
            function () {
              return this.__zoom.k * ('function' == typeof e ? e.apply(this, arguments) : e);
            },
            n,
            r
          );
        }),
        (g.scaleTo = function (t, e, n, r) {
          g.transform(
            t,
            function () {
              var t = i.apply(this, arguments),
                r = this.__zoom,
                a = null == n ? _(t) : 'function' == typeof n ? n.apply(this, arguments) : n,
                s = r.invert(a),
                u = 'function' == typeof e ? e.apply(this, arguments) : e;
              return o(b(y(r, u), a, s), t, c);
            },
            n,
            r
          );
        }),
        (g.translateBy = function (t, e, n, r) {
          g.transform(
            t,
            function () {
              return o(
                this.__zoom.translate('function' == typeof e ? e.apply(this, arguments) : e, 'function' == typeof n ? n.apply(this, arguments) : n),
                i.apply(this, arguments),
                c
              );
            },
            null,
            r
          );
        }),
        (g.translateTo = function (t, e, n, r, a) {
          g.transform(
            t,
            function () {
              var t = i.apply(this, arguments),
                a = this.__zoom,
                s = null == r ? _(t) : 'function' == typeof r ? r.apply(this, arguments) : r;
              return o(
                bm
                  .translate(s[0], s[1])
                  .scale(a.k)
                  .translate('function' == typeof e ? -e.apply(this, arguments) : -e, 'function' == typeof n ? -n.apply(this, arguments) : -n),
                t,
                c
              );
            },
            r,
            a
          );
        }),
        (A.prototype = {
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
            var e = Qp(this.that).datum();
            h.call(t, this.that, new gm(t, { sourceEvent: this.sourceEvent, target: g, type: t, transform: this.that.__zoom, dispatch: h }), e);
          },
        }),
        (g.wheelDelta = function (t) {
          return arguments.length ? ((a = 'function' == typeof t ? t : mm(+t)), g) : a;
        }),
        (g.filter = function (t) {
          return arguments.length ? ((r = 'function' == typeof t ? t : mm(!!t)), g) : r;
        }),
        (g.touchable = function (t) {
          return arguments.length ? ((s = 'function' == typeof t ? t : mm(!!t)), g) : s;
        }),
        (g.extent = function (t) {
          return arguments.length
            ? ((i =
                'function' == typeof t
                  ? t
                  : mm([
                      [+t[0][0], +t[0][1]],
                      [+t[1][0], +t[1][1]],
                    ])),
              g)
            : i;
        }),
        (g.scaleExtent = function (t) {
          return arguments.length ? ((u[0] = +t[0]), (u[1] = +t[1]), g) : [u[0], u[1]];
        }),
        (g.translateExtent = function (t) {
          return arguments.length
            ? ((c[0][0] = +t[0][0]), (c[1][0] = +t[1][0]), (c[0][1] = +t[0][1]), (c[1][1] = +t[1][1]), g)
            : [
                [c[0][0], c[0][1]],
                [c[1][0], c[1][1]],
              ];
        }),
        (g.constrain = function (t) {
          return arguments.length ? ((o = t), g) : o;
        }),
        (g.duration = function (t) {
          return arguments.length ? ((l = +t), g) : l;
        }),
        (g.interpolate = function (t) {
          return arguments.length ? ((f = t), g) : f;
        }),
        (g.on = function () {
          var t = h.on.apply(h, arguments);
          return t === h ? g : t;
        }),
        (g.clickDistance = function (t) {
          return arguments.length ? ((v = (t = +t) * t), g) : Math.sqrt(v);
        }),
        (g.tapDistance = function (t) {
          return arguments.length ? ((m = +t), g) : m;
        }),
        g
      );
    },
    zoomIdentity: bm,
    zoomTransform: _m,
  }),
  Nm = Oa(Tm);
function Pm() {
  return (
    km ||
      ((km = 1),
      (function (t) {
        Object.defineProperty(t, '__esModule', { value: !0 });
        var e = Ra;
        e.__exportStar(Js, t), e.__exportStar(ph, t), e.__exportStar(Bd, t), e.__exportStar(ov, t), e.__exportStar(Nm, t);
      })(ja)),
    ja
  );
}
!(function (t) {
  Object.defineProperty(t, '__esModule', { value: !0 }),
    (t.ColorNames = t.Color = void 0),
    (t.benchmarkColor = function (n, r, i) {
      void 0 === i && (i = 3);
      var o = t.Color.fromString(n),
        a = e.rgb(n);
      console.log(n, o, t.Color.toString(o), a, a.formatHex8());
      for (var s = 0; s < i; s++) {
        console.time('fromString');
        for (var u = 0; u < r; u++) t.Color.fromString(n);
        console.timeEnd('fromString');
      }
      for (s = 0; s < i; s++) {
        console.time('d3 from string');
        for (u = 0; u < r; u++) e.rgb(n);
        console.timeEnd('d3 from string');
      }
      for (s = 0; s < i; s++) {
        var c = [0, 0, 0, 0];
        console.time('toArray');
        for (u = 0; u < r; u++) t.Color.toRgbaArray(o, c, 0);
        console.timeEnd('toArray');
      }
      for (s = 0; s < i; s++) {
        var l = a.r,
          f = a.g,
          h = a.b,
          d = a.opacity;
        console.time('fromRgba');
        for (u = 0; u < r; u++) t.Color.fromRgba(l, f, h, d);
        console.timeEnd('fromRgba');
      }
      for (s = 0; s < i; s++) {
        console.time('toString');
        for (u = 0; u < r; u++) t.Color.toString(o);
        console.timeEnd('toString');
      }
    });
  var e = Ra.__importStar(Pm()),
    n = 255,
    r = 1 / n;
  function i(t) {
    return t < 65 ? t - 48 : t < 97 ? t - 55 : t - 87;
  }
  function o(t) {
    return t <= 9 ? 48 + t : 87 + t;
  }
  t.Color = {
    fromNumber: function (t) {
      return t;
    },
    fromRgba: function (t, e, r, i) {
      return ((n * i) << 24) | (t << 16) | (e << 8) | r;
    },
    fromRgb: function (t, e, n) {
      return -16777216 | (t << 16) | (e << 8) | n;
    },
    fromString: function (n) {
      var r = t.ColorNames[n];
      if (r) return r;
      if ('#' === n[0]) {
        if (7 === n.length)
          return (
            a |
            (i(n.charCodeAt(1)) << 20) |
            (i(n.charCodeAt(2)) << 16) |
            (i(n.charCodeAt(3)) << 12) |
            (i(n.charCodeAt(4)) << 8) |
            (i(n.charCodeAt(5)) << 4) |
            i(n.charCodeAt(6))
          );
        if (9 === n.length)
          return (
            (((i(n.charCodeAt(7)) << 4) | i(n.charCodeAt(8))) << 24) |
            (i(n.charCodeAt(1)) << 20) |
            (i(n.charCodeAt(2)) << 16) |
            (i(n.charCodeAt(3)) << 12) |
            (i(n.charCodeAt(4)) << 8) |
            (i(n.charCodeAt(5)) << 4) |
            i(n.charCodeAt(6))
          );
        if (4 === n.length) return a | ((17 * i(n.charCodeAt(1))) << 16) | ((17 * i(n.charCodeAt(2))) << 8) | (17 * i(n.charCodeAt(3)));
        if (5 === n.length)
          return ((17 * i(n.charCodeAt(4))) << 24) | ((17 * i(n.charCodeAt(1))) << 16) | ((17 * i(n.charCodeAt(2))) << 8) | (17 * i(n.charCodeAt(3)));
      }
      var o = e.rgb(n),
        s = o.r,
        u = o.g,
        c = o.b,
        l = o.opacity;
      return isNaN(s) || isNaN(u) || isNaN(c) || isNaN(l) ? t.Color.fromRgba(0, 0, 0, 0) : t.Color.fromRgba(s, u, c, l);
    },
    toString: function (t) {
      var e = (t >>> 24) & 255;
      return e === n
        ? String.fromCharCode(35, o((t >>> 20) & 15), o((t >>> 16) & 15), o((t >>> 12) & 15), o((t >>> 8) & 15), o((t >>> 4) & 15), o(15 & t))
        : String.fromCharCode(
            35,
            o((t >>> 20) & 15),
            o((t >>> 16) & 15),
            o((t >>> 12) & 15),
            o((t >>> 8) & 15),
            o((t >>> 4) & 15),
            o(15 & t),
            o((e >>> 4) & 15),
            o(15 & e)
          );
    },
    toRgba: function (t) {
      return { r: (t >>> 16) & 255, g: (t >>> 8) & 255, b: 255 & t, opacity: r * ((t >>> 24) & 255) };
    },
    toRgbaArray: function (t, e, n) {
      var r = (t >>> 24) & 255,
        i = (t >>> 16) & 255,
        o = (t >>> 8) & 255,
        a = 255 & t;
      (e[n] = i), (e[n + 1] = o), (e[n + 2] = a), (e[n + 3] = r);
    },
    toRgbArray: function (t, e, n) {
      var r = (t >>> 16) & 255,
        i = (t >>> 8) & 255,
        o = 255 & t;
      (e[n] = r), (e[n + 1] = i), (e[n + 2] = o);
    },
    toAragabaArray: function (t, e, n) {
      var i = (t >>> 24) & 255,
        o = r * i,
        a = (t >>> 16) & 255,
        s = (t >>> 8) & 255,
        u = 255 & t;
      (e[n] = i), (e[n + 1] = a * o), (e[n + 2] = s * o), (e[n + 3] = u * o);
    },
    addToAragabaArray: function (t, e, n) {
      var i = (t >>> 24) & 255,
        o = r * i,
        a = (t >>> 16) & 255,
        s = (t >>> 8) & 255,
        u = 255 & t;
      (e[n] += i), (e[n + 1] += a * o), (e[n + 2] += s * o), (e[n + 3] += u * o);
    },
    fromAragabaArray: function (t, e) {
      var r = t[e],
        i = r > 0 ? n / r : 0;
      return (r << 24) | ((i * t[e + 1]) << 16) | ((i * t[e + 2]) << 8) | (i * t[e + 3]);
    },
    mix: function (t, e, n) {
      return (
        (((1 - n) * ((t >>> 24) & 255) + n * ((e >>> 24) & 255)) << 24) |
        (((1 - n) * ((t >>> 16) & 255) + n * ((e >>> 16) & 255)) << 16) |
        (((1 - n) * ((t >>> 8) & 255) + n * ((e >>> 8) & 255)) << 8) |
        ((1 - n) * (255 & t) + n * (255 & e))
      );
    },
    scaleAlpha: function (t, e) {
      return ((e * ((t >>> 24) & 255)) << 24) | (t & s);
    },
  };
  var a = -16777216,
    s = 16777215;
  t.ColorNames = {
    aliceblue: 15792383 | a,
    antiquewhite: 16444375 | a,
    aqua: 65535 | a,
    aquamarine: 8388564 | a,
    azure: 15794175 | a,
    beige: 16119260 | a,
    bisque: 16770244 | a,
    black: 0 | a,
    blanchedalmond: 16772045 | a,
    blue: 255 | a,
    blueviolet: 9055202 | a,
    brown: 10824234 | a,
    burlywood: 14596231 | a,
    cadetblue: 6266528 | a,
    chartreuse: 8388352 | a,
    chocolate: 13789470 | a,
    coral: 16744272 | a,
    cornflower: 6591981 | a,
    cornflowerblue: 6591981 | a,
    cornsilk: 16775388 | a,
    crimson: 14423100 | a,
    cyan: 65535 | a,
    darkblue: 139 | a,
    darkcyan: 35723 | a,
    darkgoldenrod: 12092939 | a,
    darkgray: 11119017 | a,
    darkgreen: 25600 | a,
    darkgrey: 11119017 | a,
    darkkhaki: 12433259 | a,
    darkmagenta: 9109643 | a,
    darkolivegreen: 5597999 | a,
    darkorange: 16747520 | a,
    darkorchid: 10040012 | a,
    darkred: 9109504 | a,
    darksalmon: 15308410 | a,
    darkseagreen: 9419919 | a,
    darkslateblue: 4734347 | a,
    darkslategray: 3100495 | a,
    darkslategrey: 3100495 | a,
    darkturquoise: 52945 | a,
    darkviolet: 9699539 | a,
    deeppink: 16716947 | a,
    deepskyblue: 49151 | a,
    dimgray: 6908265 | a,
    dimgrey: 6908265 | a,
    dodgerblue: 2003199 | a,
    firebrick: 11674146 | a,
    floralwhite: 16775920 | a,
    forestgreen: 2263842 | a,
    fuchsia: 16711935 | a,
    gainsboro: 14474460 | a,
    ghostwhite: 16316671 | a,
    gold: 16766720 | a,
    goldenrod: 14329120 | a,
    gray: 8421504 | a,
    green: 32768 | a,
    greenyellow: 11403055 | a,
    grey: 8421504 | a,
    honeydew: 15794160 | a,
    hotpink: 16738740 | a,
    indianred: 13458524 | a,
    indigo: 4915330 | a,
    ivory: 16777200 | a,
    khaki: 15787660 | a,
    laserlemon: 16777044 | a,
    lavender: 15132410 | a,
    lavenderblush: 16773365 | a,
    lawngreen: 8190976 | a,
    lemonchiffon: 16775885 | a,
    lightblue: 11393254 | a,
    lightcoral: 15761536 | a,
    lightcyan: 14745599 | a,
    lightgoldenrod: 16448210 | a,
    lightgoldenrodyellow: 16448210 | a,
    lightgray: 13882323 | a,
    lightgreen: 9498256 | a,
    lightgrey: 13882323 | a,
    lightpink: 16758465 | a,
    lightsalmon: 16752762 | a,
    lightseagreen: 2142890 | a,
    lightskyblue: 8900346 | a,
    lightslategray: 7833753 | a,
    lightslategrey: 7833753 | a,
    lightsteelblue: 11584734 | a,
    lightyellow: 16777184 | a,
    lime: 65280 | a,
    limegreen: 3329330 | a,
    linen: 16445670 | a,
    magenta: 16711935 | a,
    maroon: 8388608 | a,
    maroon2: 8323072 | a,
    maroon3: 11546720 | a,
    mediumaquamarine: 6737322 | a,
    mediumblue: 205 | a,
    mediumorchid: 12211667 | a,
    mediumpurple: 9662683 | a,
    mediumseagreen: 3978097 | a,
    mediumslateblue: 8087790 | a,
    mediumspringgreen: 64154 | a,
    mediumturquoise: 4772300 | a,
    mediumvioletred: 13047173 | a,
    midnightblue: 1644912 | a,
    mintcream: 16121850 | a,
    mistyrose: 16770273 | a,
    moccasin: 16770229 | a,
    navajowhite: 16768685 | a,
    navy: 128 | a,
    oldlace: 16643558 | a,
    olive: 8421376 | a,
    olivedrab: 7048739 | a,
    orange: 16753920 | a,
    orangered: 16729344 | a,
    orchid: 14315734 | a,
    palegoldenrod: 15657130 | a,
    palegreen: 10025880 | a,
    paleturquoise: 11529966 | a,
    palevioletred: 14381203 | a,
    papayawhip: 16773077 | a,
    peachpuff: 16767673 | a,
    peru: 13468991 | a,
    pink: 16761035 | a,
    plum: 14524637 | a,
    powderblue: 11591910 | a,
    purple: 8388736 | a,
    purple2: 8323199 | a,
    purple3: 10494192 | a,
    rebeccapurple: 6697881 | a,
    red: 16711680 | a,
    rosybrown: 12357519 | a,
    royalblue: 4286945 | a,
    saddlebrown: 9127187 | a,
    salmon: 16416882 | a,
    sandybrown: 16032864 | a,
    seagreen: 3050327 | a,
    seashell: 16774638 | a,
    sienna: 10506797 | a,
    silver: 12632256 | a,
    skyblue: 8900331 | a,
    slateblue: 6970061 | a,
    slategray: 7372944 | a,
    slategrey: 7372944 | a,
    snow: 16775930 | a,
    springgreen: 65407 | a,
    steelblue: 4620980 | a,
    tan: 13808780 | a,
    teal: 32896 | a,
    thistle: 14204888 | a,
    tomato: 16737095 | a,
    turquoise: 4251856 | a,
    violet: 15631086 | a,
    wheat: 16113331 | a,
    white: 16777215 | a,
    whitesmoke: 16119285 | a,
    yellow: 16776960 | a,
    yellowgreen: 10145074 | a,
  };
})(Ia);
var Dm,
  Om,
  zm = {},
  Rm = { exports: {} };
(Dm = Rm),
  (Om = Rm.exports),
  function () {
    var t,
      e = 'Expected a function',
      n = '__lodash_hash_undefined__',
      r = '__lodash_placeholder__',
      i = 16,
      o = 32,
      a = 64,
      s = 128,
      u = 256,
      c = 1 / 0,
      l = 9007199254740991,
      f = NaN,
      h = 4294967295,
      d = [
        ['ary', s],
        ['bind', 1],
        ['bindKey', 2],
        ['curry', 8],
        ['curryRight', i],
        ['flip', 512],
        ['partial', o],
        ['partialRight', a],
        ['rearg', u],
      ],
      p = '[object Arguments]',
      v = '[object Array]',
      m = '[object Boolean]',
      g = '[object Date]',
      y = '[object Error]',
      b = '[object Function]',
      _ = '[object GeneratorFunction]',
      w = '[object Map]',
      x = '[object Number]',
      A = '[object Object]',
      M = '[object Promise]',
      $ = '[object RegExp]',
      E = '[object Set]',
      S = '[object String]',
      C = '[object Symbol]',
      k = '[object WeakMap]',
      T = '[object ArrayBuffer]',
      N = '[object DataView]',
      P = '[object Float32Array]',
      D = '[object Float64Array]',
      O = '[object Int8Array]',
      z = '[object Int16Array]',
      R = '[object Int32Array]',
      I = '[object Uint8Array]',
      j = '[object Uint8ClampedArray]',
      U = '[object Uint16Array]',
      B = '[object Uint32Array]',
      H = /\b__p \+= '';/g,
      q = /\b(__p \+=) '' \+/g,
      W = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
      L = /&(?:amp|lt|gt|quot|#39);/g,
      F = /[&<>"']/g,
      V = RegExp(L.source),
      Y = RegExp(F.source),
      X = /<%-([\s\S]+?)%>/g,
      Z = /<%([\s\S]+?)%>/g,
      G = /<%=([\s\S]+?)%>/g,
      K = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      J = /^\w*$/,
      Q = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      tt = /[\\^$.*+?()[\]{}|]/g,
      et = RegExp(tt.source),
      nt = /^\s+/,
      rt = /\s/,
      it = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      ot = /\{\n\/\* \[wrapped with (.+)\] \*/,
      at = /,? & /,
      st = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
      ut = /[()=,{}\[\]\/\s]/,
      ct = /\\(\\)?/g,
      lt = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
      ft = /\w*$/,
      ht = /^[-+]0x[0-9a-f]+$/i,
      dt = /^0b[01]+$/i,
      pt = /^\[object .+?Constructor\]$/,
      vt = /^0o[0-7]+$/i,
      mt = /^(?:0|[1-9]\d*)$/,
      gt = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
      yt = /($^)/,
      bt = /['\n\r\u2028\u2029\\]/g,
      _t = '\\ud800-\\udfff',
      wt = '\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff',
      xt = '\\u2700-\\u27bf',
      At = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      Mt = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      $t = '\\ufe0e\\ufe0f',
      Et =
        '\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      St = "['’]",
      Ct = '[' + _t + ']',
      kt = '[' + Et + ']',
      Tt = '[' + wt + ']',
      Nt = '\\d+',
      Pt = '[' + xt + ']',
      Dt = '[' + At + ']',
      Ot = '[^' + _t + Et + Nt + xt + At + Mt + ']',
      zt = '\\ud83c[\\udffb-\\udfff]',
      Rt = '[^' + _t + ']',
      It = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      jt = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      Ut = '[' + Mt + ']',
      Bt = '\\u200d',
      Ht = '(?:' + Dt + '|' + Ot + ')',
      qt = '(?:' + Ut + '|' + Ot + ')',
      Wt = "(?:['’](?:d|ll|m|re|s|t|ve))?",
      Lt = "(?:['’](?:D|LL|M|RE|S|T|VE))?",
      Ft = '(?:' + Tt + '|' + zt + ')?',
      Vt = '[' + $t + ']?',
      Yt = Vt + Ft + '(?:' + Bt + '(?:' + [Rt, It, jt].join('|') + ')' + Vt + Ft + ')*',
      Xt = '(?:' + [Pt, It, jt].join('|') + ')' + Yt,
      Zt = '(?:' + [Rt + Tt + '?', Tt, It, jt, Ct].join('|') + ')',
      Gt = RegExp(St, 'g'),
      Kt = RegExp(Tt, 'g'),
      Jt = RegExp(zt + '(?=' + zt + ')|' + Zt + Yt, 'g'),
      Qt = RegExp(
        [
          Ut + '?' + Dt + '+' + Wt + '(?=' + [kt, Ut, '$'].join('|') + ')',
          qt + '+' + Lt + '(?=' + [kt, Ut + Ht, '$'].join('|') + ')',
          Ut + '?' + Ht + '+' + Wt,
          Ut + '+' + Lt,
          '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
          '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
          Nt,
          Xt,
        ].join('|'),
        'g'
      ),
      te = RegExp('[' + Bt + _t + wt + $t + ']'),
      ee = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
      ne = [
        'Array',
        'Buffer',
        'DataView',
        'Date',
        'Error',
        'Float32Array',
        'Float64Array',
        'Function',
        'Int8Array',
        'Int16Array',
        'Int32Array',
        'Map',
        'Math',
        'Object',
        'Promise',
        'RegExp',
        'Set',
        'String',
        'Symbol',
        'TypeError',
        'Uint8Array',
        'Uint8ClampedArray',
        'Uint16Array',
        'Uint32Array',
        'WeakMap',
        '_',
        'clearTimeout',
        'isFinite',
        'parseInt',
        'setTimeout',
      ],
      re = -1,
      ie = {};
    (ie[P] = ie[D] = ie[O] = ie[z] = ie[R] = ie[I] = ie[j] = ie[U] = ie[B] = !0),
      (ie[p] = ie[v] = ie[T] = ie[m] = ie[N] = ie[g] = ie[y] = ie[b] = ie[w] = ie[x] = ie[A] = ie[$] = ie[E] = ie[S] = ie[k] = !1);
    var oe = {};
    (oe[p] =
      oe[v] =
      oe[T] =
      oe[N] =
      oe[m] =
      oe[g] =
      oe[P] =
      oe[D] =
      oe[O] =
      oe[z] =
      oe[R] =
      oe[w] =
      oe[x] =
      oe[A] =
      oe[$] =
      oe[E] =
      oe[S] =
      oe[C] =
      oe[I] =
      oe[j] =
      oe[U] =
      oe[B] =
        !0),
      (oe[y] = oe[b] = oe[k] = !1);
    var ae = { '\\': '\\', "'": "'", '\n': 'n', '\r': 'r', '\u2028': 'u2028', '\u2029': 'u2029' },
      se = parseFloat,
      ue = parseInt,
      ce = 'object' == typeof Da && Da && Da.Object === Object && Da,
      le = 'object' == typeof self && self && self.Object === Object && self,
      fe = ce || le || Function('return this')(),
      he = Om && !Om.nodeType && Om,
      de = he && Dm && !Dm.nodeType && Dm,
      pe = de && de.exports === he,
      ve = pe && ce.process,
      me = (function () {
        try {
          var t = de && de.require && de.require('util').types;
          return t || (ve && ve.binding && ve.binding('util'));
        } catch (t) {}
      })(),
      ge = me && me.isArrayBuffer,
      ye = me && me.isDate,
      be = me && me.isMap,
      _e = me && me.isRegExp,
      we = me && me.isSet,
      xe = me && me.isTypedArray;
    function Ae(t, e, n) {
      switch (n.length) {
        case 0:
          return t.call(e);
        case 1:
          return t.call(e, n[0]);
        case 2:
          return t.call(e, n[0], n[1]);
        case 3:
          return t.call(e, n[0], n[1], n[2]);
      }
      return t.apply(e, n);
    }
    function Me(t, e, n, r) {
      for (var i = -1, o = null == t ? 0 : t.length; ++i < o; ) {
        var a = t[i];
        e(r, a, n(a), t);
      }
      return r;
    }
    function $e(t, e) {
      for (var n = -1, r = null == t ? 0 : t.length; ++n < r && !1 !== e(t[n], n, t); );
      return t;
    }
    function Ee(t, e) {
      for (var n = null == t ? 0 : t.length; n-- && !1 !== e(t[n], n, t); );
      return t;
    }
    function Se(t, e) {
      for (var n = -1, r = null == t ? 0 : t.length; ++n < r; ) if (!e(t[n], n, t)) return !1;
      return !0;
    }
    function Ce(t, e) {
      for (var n = -1, r = null == t ? 0 : t.length, i = 0, o = []; ++n < r; ) {
        var a = t[n];
        e(a, n, t) && (o[i++] = a);
      }
      return o;
    }
    function ke(t, e) {
      return !(null == t || !t.length) && Ue(t, e, 0) > -1;
    }
    function Te(t, e, n) {
      for (var r = -1, i = null == t ? 0 : t.length; ++r < i; ) if (n(e, t[r])) return !0;
      return !1;
    }
    function Ne(t, e) {
      for (var n = -1, r = null == t ? 0 : t.length, i = Array(r); ++n < r; ) i[n] = e(t[n], n, t);
      return i;
    }
    function Pe(t, e) {
      for (var n = -1, r = e.length, i = t.length; ++n < r; ) t[i + n] = e[n];
      return t;
    }
    function De(t, e, n, r) {
      var i = -1,
        o = null == t ? 0 : t.length;
      for (r && o && (n = t[++i]); ++i < o; ) n = e(n, t[i], i, t);
      return n;
    }
    function Oe(t, e, n, r) {
      var i = null == t ? 0 : t.length;
      for (r && i && (n = t[--i]); i--; ) n = e(n, t[i], i, t);
      return n;
    }
    function ze(t, e) {
      for (var n = -1, r = null == t ? 0 : t.length; ++n < r; ) if (e(t[n], n, t)) return !0;
      return !1;
    }
    var Re = We('length');
    function Ie(t, e, n) {
      var r;
      return (
        n(t, function (t, n, i) {
          if (e(t, n, i)) return (r = n), !1;
        }),
        r
      );
    }
    function je(t, e, n, r) {
      for (var i = t.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i; ) if (e(t[o], o, t)) return o;
      return -1;
    }
    function Ue(t, e, n) {
      return e == e
        ? (function (t, e, n) {
            for (var r = n - 1, i = t.length; ++r < i; ) if (t[r] === e) return r;
            return -1;
          })(t, e, n)
        : je(t, He, n);
    }
    function Be(t, e, n, r) {
      for (var i = n - 1, o = t.length; ++i < o; ) if (r(t[i], e)) return i;
      return -1;
    }
    function He(t) {
      return t != t;
    }
    function qe(t, e) {
      var n = null == t ? 0 : t.length;
      return n ? Ve(t, e) / n : f;
    }
    function We(e) {
      return function (n) {
        return null == n ? t : n[e];
      };
    }
    function Le(e) {
      return function (n) {
        return null == e ? t : e[n];
      };
    }
    function Fe(t, e, n, r, i) {
      return (
        i(t, function (t, i, o) {
          n = r ? ((r = !1), t) : e(n, t, i, o);
        }),
        n
      );
    }
    function Ve(e, n) {
      for (var r, i = -1, o = e.length; ++i < o; ) {
        var a = n(e[i]);
        a !== t && (r = r === t ? a : r + a);
      }
      return r;
    }
    function Ye(t, e) {
      for (var n = -1, r = Array(t); ++n < t; ) r[n] = e(n);
      return r;
    }
    function Xe(t) {
      return t ? t.slice(0, hn(t) + 1).replace(nt, '') : t;
    }
    function Ze(t) {
      return function (e) {
        return t(e);
      };
    }
    function Ge(t, e) {
      return Ne(e, function (e) {
        return t[e];
      });
    }
    function Ke(t, e) {
      return t.has(e);
    }
    function Je(t, e) {
      for (var n = -1, r = t.length; ++n < r && Ue(e, t[n], 0) > -1; );
      return n;
    }
    function Qe(t, e) {
      for (var n = t.length; n-- && Ue(e, t[n], 0) > -1; );
      return n;
    }
    var tn = Le({
        À: 'A',
        Á: 'A',
        Â: 'A',
        Ã: 'A',
        Ä: 'A',
        Å: 'A',
        à: 'a',
        á: 'a',
        â: 'a',
        ã: 'a',
        ä: 'a',
        å: 'a',
        Ç: 'C',
        ç: 'c',
        Ð: 'D',
        ð: 'd',
        È: 'E',
        É: 'E',
        Ê: 'E',
        Ë: 'E',
        è: 'e',
        é: 'e',
        ê: 'e',
        ë: 'e',
        Ì: 'I',
        Í: 'I',
        Î: 'I',
        Ï: 'I',
        ì: 'i',
        í: 'i',
        î: 'i',
        ï: 'i',
        Ñ: 'N',
        ñ: 'n',
        Ò: 'O',
        Ó: 'O',
        Ô: 'O',
        Õ: 'O',
        Ö: 'O',
        Ø: 'O',
        ò: 'o',
        ó: 'o',
        ô: 'o',
        õ: 'o',
        ö: 'o',
        ø: 'o',
        Ù: 'U',
        Ú: 'U',
        Û: 'U',
        Ü: 'U',
        ù: 'u',
        ú: 'u',
        û: 'u',
        ü: 'u',
        Ý: 'Y',
        ý: 'y',
        ÿ: 'y',
        Æ: 'Ae',
        æ: 'ae',
        Þ: 'Th',
        þ: 'th',
        ß: 'ss',
        Ā: 'A',
        Ă: 'A',
        Ą: 'A',
        ā: 'a',
        ă: 'a',
        ą: 'a',
        Ć: 'C',
        Ĉ: 'C',
        Ċ: 'C',
        Č: 'C',
        ć: 'c',
        ĉ: 'c',
        ċ: 'c',
        č: 'c',
        Ď: 'D',
        Đ: 'D',
        ď: 'd',
        đ: 'd',
        Ē: 'E',
        Ĕ: 'E',
        Ė: 'E',
        Ę: 'E',
        Ě: 'E',
        ē: 'e',
        ĕ: 'e',
        ė: 'e',
        ę: 'e',
        ě: 'e',
        Ĝ: 'G',
        Ğ: 'G',
        Ġ: 'G',
        Ģ: 'G',
        ĝ: 'g',
        ğ: 'g',
        ġ: 'g',
        ģ: 'g',
        Ĥ: 'H',
        Ħ: 'H',
        ĥ: 'h',
        ħ: 'h',
        Ĩ: 'I',
        Ī: 'I',
        Ĭ: 'I',
        Į: 'I',
        İ: 'I',
        ĩ: 'i',
        ī: 'i',
        ĭ: 'i',
        į: 'i',
        ı: 'i',
        Ĵ: 'J',
        ĵ: 'j',
        Ķ: 'K',
        ķ: 'k',
        ĸ: 'k',
        Ĺ: 'L',
        Ļ: 'L',
        Ľ: 'L',
        Ŀ: 'L',
        Ł: 'L',
        ĺ: 'l',
        ļ: 'l',
        ľ: 'l',
        ŀ: 'l',
        ł: 'l',
        Ń: 'N',
        Ņ: 'N',
        Ň: 'N',
        Ŋ: 'N',
        ń: 'n',
        ņ: 'n',
        ň: 'n',
        ŋ: 'n',
        Ō: 'O',
        Ŏ: 'O',
        Ő: 'O',
        ō: 'o',
        ŏ: 'o',
        ő: 'o',
        Ŕ: 'R',
        Ŗ: 'R',
        Ř: 'R',
        ŕ: 'r',
        ŗ: 'r',
        ř: 'r',
        Ś: 'S',
        Ŝ: 'S',
        Ş: 'S',
        Š: 'S',
        ś: 's',
        ŝ: 's',
        ş: 's',
        š: 's',
        Ţ: 'T',
        Ť: 'T',
        Ŧ: 'T',
        ţ: 't',
        ť: 't',
        ŧ: 't',
        Ũ: 'U',
        Ū: 'U',
        Ŭ: 'U',
        Ů: 'U',
        Ű: 'U',
        Ų: 'U',
        ũ: 'u',
        ū: 'u',
        ŭ: 'u',
        ů: 'u',
        ű: 'u',
        ų: 'u',
        Ŵ: 'W',
        ŵ: 'w',
        Ŷ: 'Y',
        ŷ: 'y',
        Ÿ: 'Y',
        Ź: 'Z',
        Ż: 'Z',
        Ž: 'Z',
        ź: 'z',
        ż: 'z',
        ž: 'z',
        Ĳ: 'IJ',
        ĳ: 'ij',
        Œ: 'Oe',
        œ: 'oe',
        ŉ: "'n",
        ſ: 's',
      }),
      en = Le({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' });
    function nn(t) {
      return '\\' + ae[t];
    }
    function rn(t) {
      return te.test(t);
    }
    function on(t) {
      var e = -1,
        n = Array(t.size);
      return (
        t.forEach(function (t, r) {
          n[++e] = [r, t];
        }),
        n
      );
    }
    function an(t, e) {
      return function (n) {
        return t(e(n));
      };
    }
    function sn(t, e) {
      for (var n = -1, i = t.length, o = 0, a = []; ++n < i; ) {
        var s = t[n];
        (s !== e && s !== r) || ((t[n] = r), (a[o++] = n));
      }
      return a;
    }
    function un(t) {
      var e = -1,
        n = Array(t.size);
      return (
        t.forEach(function (t) {
          n[++e] = t;
        }),
        n
      );
    }
    function cn(t) {
      var e = -1,
        n = Array(t.size);
      return (
        t.forEach(function (t) {
          n[++e] = [t, t];
        }),
        n
      );
    }
    function ln(t) {
      return rn(t)
        ? (function (t) {
            for (var e = (Jt.lastIndex = 0); Jt.test(t); ) ++e;
            return e;
          })(t)
        : Re(t);
    }
    function fn(t) {
      return rn(t)
        ? (function (t) {
            return t.match(Jt) || [];
          })(t)
        : (function (t) {
            return t.split('');
          })(t);
    }
    function hn(t) {
      for (var e = t.length; e-- && rt.test(t.charAt(e)); );
      return e;
    }
    var dn = Le({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }),
      pn = (function rt(_t) {
        var wt,
          xt = (_t = null == _t ? fe : pn.defaults(fe.Object(), _t, pn.pick(fe, ne))).Array,
          At = _t.Date,
          Mt = _t.Error,
          $t = _t.Function,
          Et = _t.Math,
          St = _t.Object,
          Ct = _t.RegExp,
          kt = _t.String,
          Tt = _t.TypeError,
          Nt = xt.prototype,
          Pt = $t.prototype,
          Dt = St.prototype,
          Ot = _t['__core-js_shared__'],
          zt = Pt.toString,
          Rt = Dt.hasOwnProperty,
          It = 0,
          jt = (wt = /[^.]+$/.exec((Ot && Ot.keys && Ot.keys.IE_PROTO) || '')) ? 'Symbol(src)_1.' + wt : '',
          Ut = Dt.toString,
          Bt = zt.call(St),
          Ht = fe._,
          qt = Ct(
            '^' +
              zt
                .call(Rt)
                .replace(tt, '\\$&')
                .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
              '$'
          ),
          Wt = pe ? _t.Buffer : t,
          Lt = _t.Symbol,
          Ft = _t.Uint8Array,
          Vt = Wt ? Wt.allocUnsafe : t,
          Yt = an(St.getPrototypeOf, St),
          Xt = St.create,
          Zt = Dt.propertyIsEnumerable,
          Jt = Nt.splice,
          te = Lt ? Lt.isConcatSpreadable : t,
          ae = Lt ? Lt.iterator : t,
          ce = Lt ? Lt.toStringTag : t,
          le = (function () {
            try {
              var t = ho(St, 'defineProperty');
              return t({}, '', {}), t;
            } catch (t) {}
          })(),
          he = _t.clearTimeout !== fe.clearTimeout && _t.clearTimeout,
          de = At && At.now !== fe.Date.now && At.now,
          ve = _t.setTimeout !== fe.setTimeout && _t.setTimeout,
          me = Et.ceil,
          Re = Et.floor,
          Le = St.getOwnPropertySymbols,
          vn = Wt ? Wt.isBuffer : t,
          mn = _t.isFinite,
          gn = Nt.join,
          yn = an(St.keys, St),
          bn = Et.max,
          _n = Et.min,
          wn = At.now,
          xn = _t.parseInt,
          An = Et.random,
          Mn = Nt.reverse,
          $n = ho(_t, 'DataView'),
          En = ho(_t, 'Map'),
          Sn = ho(_t, 'Promise'),
          Cn = ho(_t, 'Set'),
          kn = ho(_t, 'WeakMap'),
          Tn = ho(St, 'create'),
          Nn = kn && new kn(),
          Pn = {},
          Dn = Uo($n),
          On = Uo(En),
          zn = Uo(Sn),
          Rn = Uo(Cn),
          In = Uo(kn),
          jn = Lt ? Lt.prototype : t,
          Un = jn ? jn.valueOf : t,
          Bn = jn ? jn.toString : t;
        function Hn(t) {
          if (ns(t) && !Fa(t) && !(t instanceof Fn)) {
            if (t instanceof Ln) return t;
            if (Rt.call(t, '__wrapped__')) return Bo(t);
          }
          return new Ln(t);
        }
        var qn = (function () {
          function e() {}
          return function (n) {
            if (!es(n)) return {};
            if (Xt) return Xt(n);
            e.prototype = n;
            var r = new e();
            return (e.prototype = t), r;
          };
        })();
        function Wn() {}
        function Ln(e, n) {
          (this.__wrapped__ = e), (this.__actions__ = []), (this.__chain__ = !!n), (this.__index__ = 0), (this.__values__ = t);
        }
        function Fn(t) {
          (this.__wrapped__ = t),
            (this.__actions__ = []),
            (this.__dir__ = 1),
            (this.__filtered__ = !1),
            (this.__iteratees__ = []),
            (this.__takeCount__ = h),
            (this.__views__ = []);
        }
        function Vn(t) {
          var e = -1,
            n = null == t ? 0 : t.length;
          for (this.clear(); ++e < n; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function Yn(t) {
          var e = -1,
            n = null == t ? 0 : t.length;
          for (this.clear(); ++e < n; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function Xn(t) {
          var e = -1,
            n = null == t ? 0 : t.length;
          for (this.clear(); ++e < n; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function Zn(t) {
          var e = -1,
            n = null == t ? 0 : t.length;
          for (this.__data__ = new Xn(); ++e < n; ) this.add(t[e]);
        }
        function Gn(t) {
          var e = (this.__data__ = new Yn(t));
          this.size = e.size;
        }
        function Kn(t, e) {
          var n = Fa(t),
            r = !n && La(t),
            i = !n && !r && Za(t),
            o = !n && !r && !i && ls(t),
            a = n || r || i || o,
            s = a ? Ye(t.length, kt) : [],
            u = s.length;
          for (var c in t)
            (!e && !Rt.call(t, c)) ||
              (a && ('length' == c || (i && ('offset' == c || 'parent' == c)) || (o && ('buffer' == c || 'byteLength' == c || 'byteOffset' == c)) || _o(c, u))) ||
              s.push(c);
          return s;
        }
        function Jn(e) {
          var n = e.length;
          return n ? e[Zr(0, n - 1)] : t;
        }
        function Qn(t, e) {
          return Ro(Ti(t), ur(e, 0, t.length));
        }
        function tr(t) {
          return Ro(Ti(t));
        }
        function er(e, n, r) {
          ((r !== t && !Ha(e[n], r)) || (r === t && !(n in e))) && ar(e, n, r);
        }
        function nr(e, n, r) {
          var i = e[n];
          (Rt.call(e, n) && Ha(i, r) && (r !== t || n in e)) || ar(e, n, r);
        }
        function rr(t, e) {
          for (var n = t.length; n--; ) if (Ha(t[n][0], e)) return n;
          return -1;
        }
        function ir(t, e, n, r) {
          return (
            dr(t, function (t, i, o) {
              e(r, t, n(t), o);
            }),
            r
          );
        }
        function or(t, e) {
          return t && Ni(e, Ps(e), t);
        }
        function ar(t, e, n) {
          '__proto__' == e && le ? le(t, e, { configurable: !0, enumerable: !0, value: n, writable: !0 }) : (t[e] = n);
        }
        function sr(e, n) {
          for (var r = -1, i = n.length, o = xt(i), a = null == e; ++r < i; ) o[r] = a ? t : Ss(e, n[r]);
          return o;
        }
        function ur(e, n, r) {
          return e == e && (r !== t && (e = e <= r ? e : r), n !== t && (e = e >= n ? e : n)), e;
        }
        function cr(e, n, r, i, o, a) {
          var s,
            u = 1 & n,
            c = 2 & n,
            l = 4 & n;
          if ((r && (s = o ? r(e, i, o, a) : r(e)), s !== t)) return s;
          if (!es(e)) return e;
          var f = Fa(e);
          if (f) {
            if (
              ((s = (function (t) {
                var e = t.length,
                  n = new t.constructor(e);
                return e && 'string' == typeof t[0] && Rt.call(t, 'index') && ((n.index = t.index), (n.input = t.input)), n;
              })(e)),
              !u)
            )
              return Ti(e, s);
          } else {
            var h = mo(e),
              d = h == b || h == _;
            if (Za(e)) return Mi(e, u);
            if (h == A || h == p || (d && !o)) {
              if (((s = c || d ? {} : yo(e)), !u))
                return c
                  ? (function (t, e) {
                      return Ni(t, vo(t), e);
                    })(
                      e,
                      (function (t, e) {
                        return t && Ni(e, Ds(e), t);
                      })(s, e)
                    )
                  : (function (t, e) {
                      return Ni(t, po(t), e);
                    })(e, or(s, e));
            } else {
              if (!oe[h]) return o ? e : {};
              s = (function (t, e, n) {
                var r,
                  i = t.constructor;
                switch (e) {
                  case T:
                    return $i(t);
                  case m:
                  case g:
                    return new i(+t);
                  case N:
                    return (function (t, e) {
                      var n = e ? $i(t.buffer) : t.buffer;
                      return new t.constructor(n, t.byteOffset, t.byteLength);
                    })(t, n);
                  case P:
                  case D:
                  case O:
                  case z:
                  case R:
                  case I:
                  case j:
                  case U:
                  case B:
                    return Ei(t, n);
                  case w:
                    return new i();
                  case x:
                  case S:
                    return new i(t);
                  case $:
                    return (function (t) {
                      var e = new t.constructor(t.source, ft.exec(t));
                      return (e.lastIndex = t.lastIndex), e;
                    })(t);
                  case E:
                    return new i();
                  case C:
                    return (r = t), Un ? St(Un.call(r)) : {};
                }
              })(e, h, u);
            }
          }
          a || (a = new Gn());
          var v = a.get(e);
          if (v) return v;
          a.set(e, s),
            ss(e)
              ? e.forEach(function (t) {
                  s.add(cr(t, n, r, t, e, a));
                })
              : rs(e) &&
                e.forEach(function (t, i) {
                  s.set(i, cr(t, n, r, i, e, a));
                });
          var y = f ? t : (l ? (c ? oo : io) : c ? Ds : Ps)(e);
          return (
            $e(y || e, function (t, i) {
              y && (t = e[(i = t)]), nr(s, i, cr(t, n, r, i, e, a));
            }),
            s
          );
        }
        function lr(e, n, r) {
          var i = r.length;
          if (null == e) return !i;
          for (e = St(e); i--; ) {
            var o = r[i],
              a = n[o],
              s = e[o];
            if ((s === t && !(o in e)) || !a(s)) return !1;
          }
          return !0;
        }
        function fr(n, r, i) {
          if ('function' != typeof n) throw new Tt(e);
          return Po(function () {
            n.apply(t, i);
          }, r);
        }
        function hr(t, e, n, r) {
          var i = -1,
            o = ke,
            a = !0,
            s = t.length,
            u = [],
            c = e.length;
          if (!s) return u;
          n && (e = Ne(e, Ze(n))), r ? ((o = Te), (a = !1)) : e.length >= 200 && ((o = Ke), (a = !1), (e = new Zn(e)));
          t: for (; ++i < s; ) {
            var l = t[i],
              f = null == n ? l : n(l);
            if (((l = r || 0 !== l ? l : 0), a && f == f)) {
              for (var h = c; h--; ) if (e[h] === f) continue t;
              u.push(l);
            } else o(e, f, r) || u.push(l);
          }
          return u;
        }
        (Hn.templateSettings = { escape: X, evaluate: Z, interpolate: G, variable: '', imports: { _: Hn } }),
          (Hn.prototype = Wn.prototype),
          (Hn.prototype.constructor = Hn),
          (Ln.prototype = qn(Wn.prototype)),
          (Ln.prototype.constructor = Ln),
          (Fn.prototype = qn(Wn.prototype)),
          (Fn.prototype.constructor = Fn),
          (Vn.prototype.clear = function () {
            (this.__data__ = Tn ? Tn(null) : {}), (this.size = 0);
          }),
          (Vn.prototype.delete = function (t) {
            var e = this.has(t) && delete this.__data__[t];
            return (this.size -= e ? 1 : 0), e;
          }),
          (Vn.prototype.get = function (e) {
            var r = this.__data__;
            if (Tn) {
              var i = r[e];
              return i === n ? t : i;
            }
            return Rt.call(r, e) ? r[e] : t;
          }),
          (Vn.prototype.has = function (e) {
            var n = this.__data__;
            return Tn ? n[e] !== t : Rt.call(n, e);
          }),
          (Vn.prototype.set = function (e, r) {
            var i = this.__data__;
            return (this.size += this.has(e) ? 0 : 1), (i[e] = Tn && r === t ? n : r), this;
          }),
          (Yn.prototype.clear = function () {
            (this.__data__ = []), (this.size = 0);
          }),
          (Yn.prototype.delete = function (t) {
            var e = this.__data__,
              n = rr(e, t);
            return !(n < 0 || (n == e.length - 1 ? e.pop() : Jt.call(e, n, 1), --this.size, 0));
          }),
          (Yn.prototype.get = function (e) {
            var n = this.__data__,
              r = rr(n, e);
            return r < 0 ? t : n[r][1];
          }),
          (Yn.prototype.has = function (t) {
            return rr(this.__data__, t) > -1;
          }),
          (Yn.prototype.set = function (t, e) {
            var n = this.__data__,
              r = rr(n, t);
            return r < 0 ? (++this.size, n.push([t, e])) : (n[r][1] = e), this;
          }),
          (Xn.prototype.clear = function () {
            (this.size = 0), (this.__data__ = { hash: new Vn(), map: new (En || Yn)(), string: new Vn() });
          }),
          (Xn.prototype.delete = function (t) {
            var e = lo(this, t).delete(t);
            return (this.size -= e ? 1 : 0), e;
          }),
          (Xn.prototype.get = function (t) {
            return lo(this, t).get(t);
          }),
          (Xn.prototype.has = function (t) {
            return lo(this, t).has(t);
          }),
          (Xn.prototype.set = function (t, e) {
            var n = lo(this, t),
              r = n.size;
            return n.set(t, e), (this.size += n.size == r ? 0 : 1), this;
          }),
          (Zn.prototype.add = Zn.prototype.push =
            function (t) {
              return this.__data__.set(t, n), this;
            }),
          (Zn.prototype.has = function (t) {
            return this.__data__.has(t);
          }),
          (Gn.prototype.clear = function () {
            (this.__data__ = new Yn()), (this.size = 0);
          }),
          (Gn.prototype.delete = function (t) {
            var e = this.__data__,
              n = e.delete(t);
            return (this.size = e.size), n;
          }),
          (Gn.prototype.get = function (t) {
            return this.__data__.get(t);
          }),
          (Gn.prototype.has = function (t) {
            return this.__data__.has(t);
          }),
          (Gn.prototype.set = function (t, e) {
            var n = this.__data__;
            if (n instanceof Yn) {
              var r = n.__data__;
              if (!En || r.length < 199) return r.push([t, e]), (this.size = ++n.size), this;
              n = this.__data__ = new Xn(r);
            }
            return n.set(t, e), (this.size = n.size), this;
          });
        var dr = Oi(wr),
          pr = Oi(xr, !0);
        function vr(t, e) {
          var n = !0;
          return (
            dr(t, function (t, r, i) {
              return (n = !!e(t, r, i));
            }),
            n
          );
        }
        function mr(e, n, r) {
          for (var i = -1, o = e.length; ++i < o; ) {
            var a = e[i],
              s = n(a);
            if (null != s && (u === t ? s == s && !cs(s) : r(s, u)))
              var u = s,
                c = a;
          }
          return c;
        }
        function gr(t, e) {
          var n = [];
          return (
            dr(t, function (t, r, i) {
              e(t, r, i) && n.push(t);
            }),
            n
          );
        }
        function yr(t, e, n, r, i) {
          var o = -1,
            a = t.length;
          for (n || (n = bo), i || (i = []); ++o < a; ) {
            var s = t[o];
            e > 0 && n(s) ? (e > 1 ? yr(s, e - 1, n, r, i) : Pe(i, s)) : r || (i[i.length] = s);
          }
          return i;
        }
        var br = zi(),
          _r = zi(!0);
        function wr(t, e) {
          return t && br(t, e, Ps);
        }
        function xr(t, e) {
          return t && _r(t, e, Ps);
        }
        function Ar(t, e) {
          return Ce(e, function (e) {
            return Ja(t[e]);
          });
        }
        function Mr(e, n) {
          for (var r = 0, i = (n = _i(n, e)).length; null != e && r < i; ) e = e[jo(n[r++])];
          return r && r == i ? e : t;
        }
        function $r(t, e, n) {
          var r = e(t);
          return Fa(t) ? r : Pe(r, n(t));
        }
        function Er(e) {
          return null == e
            ? e === t
              ? '[object Undefined]'
              : '[object Null]'
            : ce && ce in St(e)
            ? (function (e) {
                var n = Rt.call(e, ce),
                  r = e[ce];
                try {
                  e[ce] = t;
                  var i = !0;
                } catch (t) {}
                var o = Ut.call(e);
                return i && (n ? (e[ce] = r) : delete e[ce]), o;
              })(e)
            : (function (t) {
                return Ut.call(t);
              })(e);
        }
        function Sr(t, e) {
          return t > e;
        }
        function Cr(t, e) {
          return null != t && Rt.call(t, e);
        }
        function kr(t, e) {
          return null != t && e in St(t);
        }
        function Tr(e, n, r) {
          for (var i = r ? Te : ke, o = e[0].length, a = e.length, s = a, u = xt(a), c = 1 / 0, l = []; s--; ) {
            var f = e[s];
            s && n && (f = Ne(f, Ze(n))), (c = _n(f.length, c)), (u[s] = !r && (n || (o >= 120 && f.length >= 120)) ? new Zn(s && f) : t);
          }
          f = e[0];
          var h = -1,
            d = u[0];
          t: for (; ++h < o && l.length < c; ) {
            var p = f[h],
              v = n ? n(p) : p;
            if (((p = r || 0 !== p ? p : 0), !(d ? Ke(d, v) : i(l, v, r)))) {
              for (s = a; --s; ) {
                var m = u[s];
                if (!(m ? Ke(m, v) : i(e[s], v, r))) continue t;
              }
              d && d.push(v), l.push(p);
            }
          }
          return l;
        }
        function Nr(e, n, r) {
          var i = null == (e = ko(e, (n = _i(n, e)))) ? e : e[jo(Ko(n))];
          return null == i ? t : Ae(i, e, r);
        }
        function Pr(t) {
          return ns(t) && Er(t) == p;
        }
        function Dr(e, n, r, i, o) {
          return (
            e === n ||
            (null == e || null == n || (!ns(e) && !ns(n))
              ? e != e && n != n
              : (function (e, n, r, i, o, a) {
                  var s = Fa(e),
                    u = Fa(n),
                    c = s ? v : mo(e),
                    l = u ? v : mo(n),
                    f = (c = c == p ? A : c) == A,
                    h = (l = l == p ? A : l) == A,
                    d = c == l;
                  if (d && Za(e)) {
                    if (!Za(n)) return !1;
                    (s = !0), (f = !1);
                  }
                  if (d && !f)
                    return (
                      a || (a = new Gn()),
                      s || ls(e)
                        ? no(e, n, r, i, o, a)
                        : (function (t, e, n, r, i, o, a) {
                            switch (n) {
                              case N:
                                if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) return !1;
                                (t = t.buffer), (e = e.buffer);
                              case T:
                                return !(t.byteLength != e.byteLength || !o(new Ft(t), new Ft(e)));
                              case m:
                              case g:
                              case x:
                                return Ha(+t, +e);
                              case y:
                                return t.name == e.name && t.message == e.message;
                              case $:
                              case S:
                                return t == e + '';
                              case w:
                                var s = on;
                              case E:
                                var u = 1 & r;
                                if ((s || (s = un), t.size != e.size && !u)) return !1;
                                var c = a.get(t);
                                if (c) return c == e;
                                (r |= 2), a.set(t, e);
                                var l = no(s(t), s(e), r, i, o, a);
                                return a.delete(t), l;
                              case C:
                                if (Un) return Un.call(t) == Un.call(e);
                            }
                            return !1;
                          })(e, n, c, r, i, o, a)
                    );
                  if (!(1 & r)) {
                    var b = f && Rt.call(e, '__wrapped__'),
                      _ = h && Rt.call(n, '__wrapped__');
                    if (b || _) {
                      var M = b ? e.value() : e,
                        k = _ ? n.value() : n;
                      return a || (a = new Gn()), o(M, k, r, i, a);
                    }
                  }
                  return (
                    !!d &&
                    (a || (a = new Gn()),
                    (function (e, n, r, i, o, a) {
                      var s = 1 & r,
                        u = io(e),
                        c = u.length,
                        l = io(n),
                        f = l.length;
                      if (c != f && !s) return !1;
                      for (var h = c; h--; ) {
                        var d = u[h];
                        if (!(s ? d in n : Rt.call(n, d))) return !1;
                      }
                      var p = a.get(e),
                        v = a.get(n);
                      if (p && v) return p == n && v == e;
                      var m = !0;
                      a.set(e, n), a.set(n, e);
                      for (var g = s; ++h < c; ) {
                        var y = e[(d = u[h])],
                          b = n[d];
                        if (i) var _ = s ? i(b, y, d, n, e, a) : i(y, b, d, e, n, a);
                        if (!(_ === t ? y === b || o(y, b, r, i, a) : _)) {
                          m = !1;
                          break;
                        }
                        g || (g = 'constructor' == d);
                      }
                      if (m && !g) {
                        var w = e.constructor,
                          x = n.constructor;
                        w == x ||
                          !('constructor' in e) ||
                          !('constructor' in n) ||
                          ('function' == typeof w && w instanceof w && 'function' == typeof x && x instanceof x) ||
                          (m = !1);
                      }
                      return a.delete(e), a.delete(n), m;
                    })(e, n, r, i, o, a))
                  );
                })(e, n, r, i, Dr, o))
          );
        }
        function Or(e, n, r, i) {
          var o = r.length,
            a = o,
            s = !i;
          if (null == e) return !a;
          for (e = St(e); o--; ) {
            var u = r[o];
            if (s && u[2] ? u[1] !== e[u[0]] : !(u[0] in e)) return !1;
          }
          for (; ++o < a; ) {
            var c = (u = r[o])[0],
              l = e[c],
              f = u[1];
            if (s && u[2]) {
              if (l === t && !(c in e)) return !1;
            } else {
              var h = new Gn();
              if (i) var d = i(l, f, c, e, n, h);
              if (!(d === t ? Dr(f, l, 3, i, h) : d)) return !1;
            }
          }
          return !0;
        }
        function zr(t) {
          return !(!es(t) || ((e = t), jt && jt in e)) && (Ja(t) ? qt : pt).test(Uo(t));
          var e;
        }
        function Rr(t) {
          return 'function' == typeof t ? t : null == t ? iu : 'object' == typeof t ? (Fa(t) ? qr(t[0], t[1]) : Hr(t)) : du(t);
        }
        function Ir(t) {
          if (!$o(t)) return yn(t);
          var e = [];
          for (var n in St(t)) Rt.call(t, n) && 'constructor' != n && e.push(n);
          return e;
        }
        function jr(t) {
          if (!es(t))
            return (function (t) {
              var e = [];
              if (null != t) for (var n in St(t)) e.push(n);
              return e;
            })(t);
          var e = $o(t),
            n = [];
          for (var r in t) ('constructor' != r || (!e && Rt.call(t, r))) && n.push(r);
          return n;
        }
        function Ur(t, e) {
          return t < e;
        }
        function Br(t, e) {
          var n = -1,
            r = Ya(t) ? xt(t.length) : [];
          return (
            dr(t, function (t, i, o) {
              r[++n] = e(t, i, o);
            }),
            r
          );
        }
        function Hr(t) {
          var e = fo(t);
          return 1 == e.length && e[0][2]
            ? So(e[0][0], e[0][1])
            : function (n) {
                return n === t || Or(n, t, e);
              };
        }
        function qr(e, n) {
          return xo(e) && Eo(n)
            ? So(jo(e), n)
            : function (r) {
                var i = Ss(r, e);
                return i === t && i === n ? Cs(r, e) : Dr(n, i, 3);
              };
        }
        function Wr(e, n, r, i, o) {
          e !== n &&
            br(
              n,
              function (a, s) {
                if ((o || (o = new Gn()), es(a)))
                  !(function (e, n, r, i, o, a, s) {
                    var u = To(e, r),
                      c = To(n, r),
                      l = s.get(c);
                    if (l) er(e, r, l);
                    else {
                      var f = a ? a(u, c, r + '', e, n, s) : t,
                        h = f === t;
                      if (h) {
                        var d = Fa(c),
                          p = !d && Za(c),
                          v = !d && !p && ls(c);
                        (f = c),
                          d || p || v
                            ? Fa(u)
                              ? (f = u)
                              : Xa(u)
                              ? (f = Ti(u))
                              : p
                              ? ((h = !1), (f = Mi(c, !0)))
                              : v
                              ? ((h = !1), (f = Ei(c, !0)))
                              : (f = [])
                            : os(c) || La(c)
                            ? ((f = u), La(u) ? (f = ys(u)) : (es(u) && !Ja(u)) || (f = yo(c)))
                            : (h = !1);
                      }
                      h && (s.set(c, f), o(f, c, i, a, s), s.delete(c)), er(e, r, f);
                    }
                  })(e, n, s, r, Wr, i, o);
                else {
                  var u = i ? i(To(e, s), a, s + '', e, n, o) : t;
                  u === t && (u = a), er(e, s, u);
                }
              },
              Ds
            );
        }
        function Lr(e, n) {
          var r = e.length;
          if (r) return _o((n += n < 0 ? r : 0), r) ? e[n] : t;
        }
        function Fr(t, e, n) {
          e = e.length
            ? Ne(e, function (t) {
                return Fa(t)
                  ? function (e) {
                      return Mr(e, 1 === t.length ? t[0] : t);
                    }
                  : t;
              })
            : [iu];
          var r = -1;
          e = Ne(e, Ze(co()));
          var i = Br(t, function (t, n, i) {
            var o = Ne(e, function (e) {
              return e(t);
            });
            return { criteria: o, index: ++r, value: t };
          });
          return (function (t, e) {
            var n = t.length;
            for (t.sort(e); n--; ) t[n] = t[n].value;
            return t;
          })(i, function (t, e) {
            return (function (t, e, n) {
              for (var r = -1, i = t.criteria, o = e.criteria, a = i.length, s = n.length; ++r < a; ) {
                var u = Si(i[r], o[r]);
                if (u) return r >= s ? u : u * ('desc' == n[r] ? -1 : 1);
              }
              return t.index - e.index;
            })(t, e, n);
          });
        }
        function Vr(t, e, n) {
          for (var r = -1, i = e.length, o = {}; ++r < i; ) {
            var a = e[r],
              s = Mr(t, a);
            n(s, a) && ti(o, _i(a, t), s);
          }
          return o;
        }
        function Yr(t, e, n, r) {
          var i = r ? Be : Ue,
            o = -1,
            a = e.length,
            s = t;
          for (t === e && (e = Ti(e)), n && (s = Ne(t, Ze(n))); ++o < a; )
            for (var u = 0, c = e[o], l = n ? n(c) : c; (u = i(s, l, u, r)) > -1; ) s !== t && Jt.call(s, u, 1), Jt.call(t, u, 1);
          return t;
        }
        function Xr(t, e) {
          for (var n = t ? e.length : 0, r = n - 1; n--; ) {
            var i = e[n];
            if (n == r || i !== o) {
              var o = i;
              _o(i) ? Jt.call(t, i, 1) : hi(t, i);
            }
          }
          return t;
        }
        function Zr(t, e) {
          return t + Re(An() * (e - t + 1));
        }
        function Gr(t, e) {
          var n = '';
          if (!t || e < 1 || e > l) return n;
          do {
            e % 2 && (n += t), (e = Re(e / 2)) && (t += t);
          } while (e);
          return n;
        }
        function Kr(t, e) {
          return Do(Co(t, e, iu), t + '');
        }
        function Jr(t) {
          return Jn(Hs(t));
        }
        function Qr(t, e) {
          var n = Hs(t);
          return Ro(n, ur(e, 0, n.length));
        }
        function ti(e, n, r, i) {
          if (!es(e)) return e;
          for (var o = -1, a = (n = _i(n, e)).length, s = a - 1, u = e; null != u && ++o < a; ) {
            var c = jo(n[o]),
              l = r;
            if ('__proto__' === c || 'constructor' === c || 'prototype' === c) return e;
            if (o != s) {
              var f = u[c];
              (l = i ? i(f, c, u) : t) === t && (l = es(f) ? f : _o(n[o + 1]) ? [] : {});
            }
            nr(u, c, l), (u = u[c]);
          }
          return e;
        }
        var ei = Nn
            ? function (t, e) {
                return Nn.set(t, e), t;
              }
            : iu,
          ni = le
            ? function (t, e) {
                return le(t, 'toString', { configurable: !0, enumerable: !1, value: eu(e), writable: !0 });
              }
            : iu;
        function ri(t) {
          return Ro(Hs(t));
        }
        function ii(t, e, n) {
          var r = -1,
            i = t.length;
          e < 0 && (e = -e > i ? 0 : i + e), (n = n > i ? i : n) < 0 && (n += i), (i = e > n ? 0 : (n - e) >>> 0), (e >>>= 0);
          for (var o = xt(i); ++r < i; ) o[r] = t[r + e];
          return o;
        }
        function oi(t, e) {
          var n;
          return (
            dr(t, function (t, r, i) {
              return !(n = e(t, r, i));
            }),
            !!n
          );
        }
        function ai(t, e, n) {
          var r = 0,
            i = null == t ? r : t.length;
          if ('number' == typeof e && e == e && i <= 2147483647) {
            for (; r < i; ) {
              var o = (r + i) >>> 1,
                a = t[o];
              null !== a && !cs(a) && (n ? a <= e : a < e) ? (r = o + 1) : (i = o);
            }
            return i;
          }
          return si(t, e, iu, n);
        }
        function si(e, n, r, i) {
          var o = 0,
            a = null == e ? 0 : e.length;
          if (0 === a) return 0;
          for (var s = (n = r(n)) != n, u = null === n, c = cs(n), l = n === t; o < a; ) {
            var f = Re((o + a) / 2),
              h = r(e[f]),
              d = h !== t,
              p = null === h,
              v = h == h,
              m = cs(h);
            if (s) var g = i || v;
            else g = l ? v && (i || d) : u ? v && d && (i || !p) : c ? v && d && !p && (i || !m) : !p && !m && (i ? h <= n : h < n);
            g ? (o = f + 1) : (a = f);
          }
          return _n(a, 4294967294);
        }
        function ui(t, e) {
          for (var n = -1, r = t.length, i = 0, o = []; ++n < r; ) {
            var a = t[n],
              s = e ? e(a) : a;
            if (!n || !Ha(s, u)) {
              var u = s;
              o[i++] = 0 === a ? 0 : a;
            }
          }
          return o;
        }
        function ci(t) {
          return 'number' == typeof t ? t : cs(t) ? f : +t;
        }
        function li(t) {
          if ('string' == typeof t) return t;
          if (Fa(t)) return Ne(t, li) + '';
          if (cs(t)) return Bn ? Bn.call(t) : '';
          var e = t + '';
          return '0' == e && 1 / t == -1 / 0 ? '-0' : e;
        }
        function fi(t, e, n) {
          var r = -1,
            i = ke,
            o = t.length,
            a = !0,
            s = [],
            u = s;
          if (n) (a = !1), (i = Te);
          else if (o >= 200) {
            var c = e ? null : Gi(t);
            if (c) return un(c);
            (a = !1), (i = Ke), (u = new Zn());
          } else u = e ? [] : s;
          t: for (; ++r < o; ) {
            var l = t[r],
              f = e ? e(l) : l;
            if (((l = n || 0 !== l ? l : 0), a && f == f)) {
              for (var h = u.length; h--; ) if (u[h] === f) continue t;
              e && u.push(f), s.push(l);
            } else i(u, f, n) || (u !== s && u.push(f), s.push(l));
          }
          return s;
        }
        function hi(t, e) {
          return null == (t = ko(t, (e = _i(e, t)))) || delete t[jo(Ko(e))];
        }
        function di(t, e, n, r) {
          return ti(t, e, n(Mr(t, e)), r);
        }
        function pi(t, e, n, r) {
          for (var i = t.length, o = r ? i : -1; (r ? o-- : ++o < i) && e(t[o], o, t); );
          return n ? ii(t, r ? 0 : o, r ? o + 1 : i) : ii(t, r ? o + 1 : 0, r ? i : o);
        }
        function vi(t, e) {
          var n = t;
          return (
            n instanceof Fn && (n = n.value()),
            De(
              e,
              function (t, e) {
                return e.func.apply(e.thisArg, Pe([t], e.args));
              },
              n
            )
          );
        }
        function mi(t, e, n) {
          var r = t.length;
          if (r < 2) return r ? fi(t[0]) : [];
          for (var i = -1, o = xt(r); ++i < r; ) for (var a = t[i], s = -1; ++s < r; ) s != i && (o[i] = hr(o[i] || a, t[s], e, n));
          return fi(yr(o, 1), e, n);
        }
        function gi(e, n, r) {
          for (var i = -1, o = e.length, a = n.length, s = {}; ++i < o; ) {
            var u = i < a ? n[i] : t;
            r(s, e[i], u);
          }
          return s;
        }
        function yi(t) {
          return Xa(t) ? t : [];
        }
        function bi(t) {
          return 'function' == typeof t ? t : iu;
        }
        function _i(t, e) {
          return Fa(t) ? t : xo(t, e) ? [t] : Io(bs(t));
        }
        var wi = Kr;
        function xi(e, n, r) {
          var i = e.length;
          return (r = r === t ? i : r), !n && r >= i ? e : ii(e, n, r);
        }
        var Ai =
          he ||
          function (t) {
            return fe.clearTimeout(t);
          };
        function Mi(t, e) {
          if (e) return t.slice();
          var n = t.length,
            r = Vt ? Vt(n) : new t.constructor(n);
          return t.copy(r), r;
        }
        function $i(t) {
          var e = new t.constructor(t.byteLength);
          return new Ft(e).set(new Ft(t)), e;
        }
        function Ei(t, e) {
          var n = e ? $i(t.buffer) : t.buffer;
          return new t.constructor(n, t.byteOffset, t.length);
        }
        function Si(e, n) {
          if (e !== n) {
            var r = e !== t,
              i = null === e,
              o = e == e,
              a = cs(e),
              s = n !== t,
              u = null === n,
              c = n == n,
              l = cs(n);
            if ((!u && !l && !a && e > n) || (a && s && c && !u && !l) || (i && s && c) || (!r && c) || !o) return 1;
            if ((!i && !a && !l && e < n) || (l && r && o && !i && !a) || (u && r && o) || (!s && o) || !c) return -1;
          }
          return 0;
        }
        function Ci(t, e, n, r) {
          for (var i = -1, o = t.length, a = n.length, s = -1, u = e.length, c = bn(o - a, 0), l = xt(u + c), f = !r; ++s < u; ) l[s] = e[s];
          for (; ++i < a; ) (f || i < o) && (l[n[i]] = t[i]);
          for (; c--; ) l[s++] = t[i++];
          return l;
        }
        function ki(t, e, n, r) {
          for (var i = -1, o = t.length, a = -1, s = n.length, u = -1, c = e.length, l = bn(o - s, 0), f = xt(l + c), h = !r; ++i < l; ) f[i] = t[i];
          for (var d = i; ++u < c; ) f[d + u] = e[u];
          for (; ++a < s; ) (h || i < o) && (f[d + n[a]] = t[i++]);
          return f;
        }
        function Ti(t, e) {
          var n = -1,
            r = t.length;
          for (e || (e = xt(r)); ++n < r; ) e[n] = t[n];
          return e;
        }
        function Ni(e, n, r, i) {
          var o = !r;
          r || (r = {});
          for (var a = -1, s = n.length; ++a < s; ) {
            var u = n[a],
              c = i ? i(r[u], e[u], u, r, e) : t;
            c === t && (c = e[u]), o ? ar(r, u, c) : nr(r, u, c);
          }
          return r;
        }
        function Pi(t, e) {
          return function (n, r) {
            var i = Fa(n) ? Me : ir,
              o = e ? e() : {};
            return i(n, t, co(r, 2), o);
          };
        }
        function Di(e) {
          return Kr(function (n, r) {
            var i = -1,
              o = r.length,
              a = o > 1 ? r[o - 1] : t,
              s = o > 2 ? r[2] : t;
            for (a = e.length > 3 && 'function' == typeof a ? (o--, a) : t, s && wo(r[0], r[1], s) && ((a = o < 3 ? t : a), (o = 1)), n = St(n); ++i < o; ) {
              var u = r[i];
              u && e(n, u, i, a);
            }
            return n;
          });
        }
        function Oi(t, e) {
          return function (n, r) {
            if (null == n) return n;
            if (!Ya(n)) return t(n, r);
            for (var i = n.length, o = e ? i : -1, a = St(n); (e ? o-- : ++o < i) && !1 !== r(a[o], o, a); );
            return n;
          };
        }
        function zi(t) {
          return function (e, n, r) {
            for (var i = -1, o = St(e), a = r(e), s = a.length; s--; ) {
              var u = a[t ? s : ++i];
              if (!1 === n(o[u], u, o)) break;
            }
            return e;
          };
        }
        function Ri(e) {
          return function (n) {
            var r = rn((n = bs(n))) ? fn(n) : t,
              i = r ? r[0] : n.charAt(0),
              o = r ? xi(r, 1).join('') : n.slice(1);
            return i[e]() + o;
          };
        }
        function Ii(t) {
          return function (e) {
            return De(Js(Ls(e).replace(Gt, '')), t, '');
          };
        }
        function ji(t) {
          return function () {
            var e = arguments;
            switch (e.length) {
              case 0:
                return new t();
              case 1:
                return new t(e[0]);
              case 2:
                return new t(e[0], e[1]);
              case 3:
                return new t(e[0], e[1], e[2]);
              case 4:
                return new t(e[0], e[1], e[2], e[3]);
              case 5:
                return new t(e[0], e[1], e[2], e[3], e[4]);
              case 6:
                return new t(e[0], e[1], e[2], e[3], e[4], e[5]);
              case 7:
                return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6]);
            }
            var n = qn(t.prototype),
              r = t.apply(n, e);
            return es(r) ? r : n;
          };
        }
        function Ui(e) {
          return function (n, r, i) {
            var o = St(n);
            if (!Ya(n)) {
              var a = co(r, 3);
              (n = Ps(n)),
                (r = function (t) {
                  return a(o[t], t, o);
                });
            }
            var s = e(n, r, i);
            return s > -1 ? o[a ? n[s] : s] : t;
          };
        }
        function Bi(n) {
          return ro(function (r) {
            var i = r.length,
              o = i,
              a = Ln.prototype.thru;
            for (n && r.reverse(); o--; ) {
              var s = r[o];
              if ('function' != typeof s) throw new Tt(e);
              if (a && !u && 'wrapper' == so(s)) var u = new Ln([], !0);
            }
            for (o = u ? o : i; ++o < i; ) {
              var c = so((s = r[o])),
                l = 'wrapper' == c ? ao(s) : t;
              u = l && Ao(l[0]) && 424 == l[1] && !l[4].length && 1 == l[9] ? u[so(l[0])].apply(u, l[3]) : 1 == s.length && Ao(s) ? u[c]() : u.thru(s);
            }
            return function () {
              var t = arguments,
                e = t[0];
              if (u && 1 == t.length && Fa(e)) return u.plant(e).value();
              for (var n = 0, o = i ? r[n].apply(this, t) : e; ++n < i; ) o = r[n].call(this, o);
              return o;
            };
          });
        }
        function Hi(e, n, r, i, o, a, u, c, l, f) {
          var h = n & s,
            d = 1 & n,
            p = 2 & n,
            v = 24 & n,
            m = 512 & n,
            g = p ? t : ji(e);
          return function s() {
            for (var y = arguments.length, b = xt(y), _ = y; _--; ) b[_] = arguments[_];
            if (v)
              var w = uo(s),
                x = (function (t, e) {
                  for (var n = t.length, r = 0; n--; ) t[n] === e && ++r;
                  return r;
                })(b, w);
            if ((i && (b = Ci(b, i, o, v)), a && (b = ki(b, a, u, v)), (y -= x), v && y < f)) {
              var A = sn(b, w);
              return Xi(e, n, Hi, s.placeholder, r, b, A, c, l, f - y);
            }
            var M = d ? r : this,
              $ = p ? M[e] : e;
            return (
              (y = b.length),
              c
                ? (b = (function (e, n) {
                    for (var r = e.length, i = _n(n.length, r), o = Ti(e); i--; ) {
                      var a = n[i];
                      e[i] = _o(a, r) ? o[a] : t;
                    }
                    return e;
                  })(b, c))
                : m && y > 1 && b.reverse(),
              h && l < y && (b.length = l),
              this && this !== fe && this instanceof s && ($ = g || ji($)),
              $.apply(M, b)
            );
          };
        }
        function qi(t, e) {
          return function (n, r) {
            return (function (t, e, n, r) {
              return (
                wr(t, function (t, i, o) {
                  e(r, n(t), i, o);
                }),
                r
              );
            })(n, t, e(r), {});
          };
        }
        function Wi(e, n) {
          return function (r, i) {
            var o;
            if (r === t && i === t) return n;
            if ((r !== t && (o = r), i !== t)) {
              if (o === t) return i;
              'string' == typeof r || 'string' == typeof i ? ((r = li(r)), (i = li(i))) : ((r = ci(r)), (i = ci(i))), (o = e(r, i));
            }
            return o;
          };
        }
        function Li(t) {
          return ro(function (e) {
            return (
              (e = Ne(e, Ze(co()))),
              Kr(function (n) {
                var r = this;
                return t(e, function (t) {
                  return Ae(t, r, n);
                });
              })
            );
          });
        }
        function Fi(e, n) {
          var r = (n = n === t ? ' ' : li(n)).length;
          if (r < 2) return r ? Gr(n, e) : n;
          var i = Gr(n, me(e / ln(n)));
          return rn(n) ? xi(fn(i), 0, e).join('') : i.slice(0, e);
        }
        function Vi(e) {
          return function (n, r, i) {
            return (
              i && 'number' != typeof i && wo(n, r, i) && (r = i = t),
              (n = ps(n)),
              r === t ? ((r = n), (n = 0)) : (r = ps(r)),
              (function (t, e, n, r) {
                for (var i = -1, o = bn(me((e - t) / (n || 1)), 0), a = xt(o); o--; ) (a[r ? o : ++i] = t), (t += n);
                return a;
              })(n, r, (i = i === t ? (n < r ? 1 : -1) : ps(i)), e)
            );
          };
        }
        function Yi(t) {
          return function (e, n) {
            return ('string' == typeof e && 'string' == typeof n) || ((e = gs(e)), (n = gs(n))), t(e, n);
          };
        }
        function Xi(e, n, r, i, s, u, c, l, f, h) {
          var d = 8 & n;
          (n |= d ? o : a), 4 & (n &= ~(d ? a : o)) || (n &= -4);
          var p = [e, n, s, d ? u : t, d ? c : t, d ? t : u, d ? t : c, l, f, h],
            v = r.apply(t, p);
          return Ao(e) && No(v, p), (v.placeholder = i), Oo(v, e, n);
        }
        function Zi(t) {
          var e = Et[t];
          return function (t, n) {
            if (((t = gs(t)), (n = null == n ? 0 : _n(vs(n), 292)) && mn(t))) {
              var r = (bs(t) + 'e').split('e');
              return +((r = (bs(e(r[0] + 'e' + (+r[1] + n))) + 'e').split('e'))[0] + 'e' + (+r[1] - n));
            }
            return e(t);
          };
        }
        var Gi =
          Cn && 1 / un(new Cn([, -0]))[1] == c
            ? function (t) {
                return new Cn(t);
              }
            : cu;
        function Ki(t) {
          return function (e) {
            var n = mo(e);
            return n == w
              ? on(e)
              : n == E
              ? cn(e)
              : (function (t, e) {
                  return Ne(e, function (e) {
                    return [e, t[e]];
                  });
                })(e, t(e));
          };
        }
        function Ji(n, c, l, f, h, d, p, v) {
          var m = 2 & c;
          if (!m && 'function' != typeof n) throw new Tt(e);
          var g = f ? f.length : 0;
          if ((g || ((c &= -97), (f = h = t)), (p = p === t ? p : bn(vs(p), 0)), (v = v === t ? v : vs(v)), (g -= h ? h.length : 0), c & a)) {
            var y = f,
              b = h;
            f = h = t;
          }
          var _ = m ? t : ao(n),
            w = [n, c, l, f, h, y, b, d, p, v];
          if (
            (_ &&
              (function (t, e) {
                var n = t[1],
                  i = e[1],
                  o = n | i,
                  a = o < 131,
                  c = (i == s && 8 == n) || (i == s && n == u && t[7].length <= e[8]) || (384 == i && e[7].length <= e[8] && 8 == n);
                if (!a && !c) return t;
                1 & i && ((t[2] = e[2]), (o |= 1 & n ? 0 : 4));
                var l = e[3];
                if (l) {
                  var f = t[3];
                  (t[3] = f ? Ci(f, l, e[4]) : l), (t[4] = f ? sn(t[3], r) : e[4]);
                }
                (l = e[5]) && ((f = t[5]), (t[5] = f ? ki(f, l, e[6]) : l), (t[6] = f ? sn(t[5], r) : e[6])),
                  (l = e[7]) && (t[7] = l),
                  i & s && (t[8] = null == t[8] ? e[8] : _n(t[8], e[8])),
                  null == t[9] && (t[9] = e[9]),
                  (t[0] = e[0]),
                  (t[1] = o);
              })(w, _),
            (n = w[0]),
            (c = w[1]),
            (l = w[2]),
            (f = w[3]),
            (h = w[4]),
            !(v = w[9] = w[9] === t ? (m ? 0 : n.length) : bn(w[9] - g, 0)) && 24 & c && (c &= -25),
            c && 1 != c)
          )
            x =
              8 == c || c == i
                ? (function (e, n, r) {
                    var i = ji(e);
                    return function o() {
                      for (var a = arguments.length, s = xt(a), u = a, c = uo(o); u--; ) s[u] = arguments[u];
                      var l = a < 3 && s[0] !== c && s[a - 1] !== c ? [] : sn(s, c);
                      return (a -= l.length) < r ? Xi(e, n, Hi, o.placeholder, t, s, l, t, t, r - a) : Ae(this && this !== fe && this instanceof o ? i : e, this, s);
                    };
                  })(n, c, v)
                : (c != o && 33 != c) || h.length
                ? Hi.apply(t, w)
                : (function (t, e, n, r) {
                    var i = 1 & e,
                      o = ji(t);
                    return function e() {
                      for (var a = -1, s = arguments.length, u = -1, c = r.length, l = xt(c + s), f = this && this !== fe && this instanceof e ? o : t; ++u < c; )
                        l[u] = r[u];
                      for (; s--; ) l[u++] = arguments[++a];
                      return Ae(f, i ? n : this, l);
                    };
                  })(n, c, l, f);
          else
            var x = (function (t, e, n) {
              var r = 1 & e,
                i = ji(t);
              return function e() {
                return (this && this !== fe && this instanceof e ? i : t).apply(r ? n : this, arguments);
              };
            })(n, c, l);
          return Oo((_ ? ei : No)(x, w), n, c);
        }
        function Qi(e, n, r, i) {
          return e === t || (Ha(e, Dt[r]) && !Rt.call(i, r)) ? n : e;
        }
        function to(e, n, r, i, o, a) {
          return es(e) && es(n) && (a.set(n, e), Wr(e, n, t, to, a), a.delete(n)), e;
        }
        function eo(e) {
          return os(e) ? t : e;
        }
        function no(e, n, r, i, o, a) {
          var s = 1 & r,
            u = e.length,
            c = n.length;
          if (u != c && !(s && c > u)) return !1;
          var l = a.get(e),
            f = a.get(n);
          if (l && f) return l == n && f == e;
          var h = -1,
            d = !0,
            p = 2 & r ? new Zn() : t;
          for (a.set(e, n), a.set(n, e); ++h < u; ) {
            var v = e[h],
              m = n[h];
            if (i) var g = s ? i(m, v, h, n, e, a) : i(v, m, h, e, n, a);
            if (g !== t) {
              if (g) continue;
              d = !1;
              break;
            }
            if (p) {
              if (
                !ze(n, function (t, e) {
                  if (!Ke(p, e) && (v === t || o(v, t, r, i, a))) return p.push(e);
                })
              ) {
                d = !1;
                break;
              }
            } else if (v !== m && !o(v, m, r, i, a)) {
              d = !1;
              break;
            }
          }
          return a.delete(e), a.delete(n), d;
        }
        function ro(e) {
          return Do(Co(e, t, Vo), e + '');
        }
        function io(t) {
          return $r(t, Ps, po);
        }
        function oo(t) {
          return $r(t, Ds, vo);
        }
        var ao = Nn
          ? function (t) {
              return Nn.get(t);
            }
          : cu;
        function so(t) {
          for (var e = t.name + '', n = Pn[e], r = Rt.call(Pn, e) ? n.length : 0; r--; ) {
            var i = n[r],
              o = i.func;
            if (null == o || o == t) return i.name;
          }
          return e;
        }
        function uo(t) {
          return (Rt.call(Hn, 'placeholder') ? Hn : t).placeholder;
        }
        function co() {
          var t = Hn.iteratee || ou;
          return (t = t === ou ? Rr : t), arguments.length ? t(arguments[0], arguments[1]) : t;
        }
        function lo(t, e) {
          var n,
            r,
            i = t.__data__;
          return ('string' == (r = typeof (n = e)) || 'number' == r || 'symbol' == r || 'boolean' == r ? '__proto__' !== n : null === n)
            ? i['string' == typeof e ? 'string' : 'hash']
            : i.map;
        }
        function fo(t) {
          for (var e = Ps(t), n = e.length; n--; ) {
            var r = e[n],
              i = t[r];
            e[n] = [r, i, Eo(i)];
          }
          return e;
        }
        function ho(e, n) {
          var r = (function (e, n) {
            return null == e ? t : e[n];
          })(e, n);
          return zr(r) ? r : t;
        }
        var po = Le
            ? function (t) {
                return null == t
                  ? []
                  : ((t = St(t)),
                    Ce(Le(t), function (e) {
                      return Zt.call(t, e);
                    }));
              }
            : mu,
          vo = Le
            ? function (t) {
                for (var e = []; t; ) Pe(e, po(t)), (t = Yt(t));
                return e;
              }
            : mu,
          mo = Er;
        function go(t, e, n) {
          for (var r = -1, i = (e = _i(e, t)).length, o = !1; ++r < i; ) {
            var a = jo(e[r]);
            if (!(o = null != t && n(t, a))) break;
            t = t[a];
          }
          return o || ++r != i ? o : !!(i = null == t ? 0 : t.length) && ts(i) && _o(a, i) && (Fa(t) || La(t));
        }
        function yo(t) {
          return 'function' != typeof t.constructor || $o(t) ? {} : qn(Yt(t));
        }
        function bo(t) {
          return Fa(t) || La(t) || !!(te && t && t[te]);
        }
        function _o(t, e) {
          var n = typeof t;
          return !!(e = e ?? l) && ('number' == n || ('symbol' != n && mt.test(t))) && t > -1 && t % 1 == 0 && t < e;
        }
        function wo(t, e, n) {
          if (!es(n)) return !1;
          var r = typeof e;
          return !!('number' == r ? Ya(n) && _o(e, n.length) : 'string' == r && e in n) && Ha(n[e], t);
        }
        function xo(t, e) {
          if (Fa(t)) return !1;
          var n = typeof t;
          return !('number' != n && 'symbol' != n && 'boolean' != n && null != t && !cs(t)) || J.test(t) || !K.test(t) || (null != e && t in St(e));
        }
        function Ao(t) {
          var e = so(t),
            n = Hn[e];
          if ('function' != typeof n || !(e in Fn.prototype)) return !1;
          if (t === n) return !0;
          var r = ao(n);
          return !!r && t === r[0];
        }
        (($n && mo(new $n(new ArrayBuffer(1))) != N) ||
          (En && mo(new En()) != w) ||
          (Sn && mo(Sn.resolve()) != M) ||
          (Cn && mo(new Cn()) != E) ||
          (kn && mo(new kn()) != k)) &&
          (mo = function (e) {
            var n = Er(e),
              r = n == A ? e.constructor : t,
              i = r ? Uo(r) : '';
            if (i)
              switch (i) {
                case Dn:
                  return N;
                case On:
                  return w;
                case zn:
                  return M;
                case Rn:
                  return E;
                case In:
                  return k;
              }
            return n;
          });
        var Mo = Ot ? Ja : gu;
        function $o(t) {
          var e = t && t.constructor;
          return t === (('function' == typeof e && e.prototype) || Dt);
        }
        function Eo(t) {
          return t == t && !es(t);
        }
        function So(e, n) {
          return function (r) {
            return null != r && r[e] === n && (n !== t || e in St(r));
          };
        }
        function Co(e, n, r) {
          return (
            (n = bn(n === t ? e.length - 1 : n, 0)),
            function () {
              for (var t = arguments, i = -1, o = bn(t.length - n, 0), a = xt(o); ++i < o; ) a[i] = t[n + i];
              i = -1;
              for (var s = xt(n + 1); ++i < n; ) s[i] = t[i];
              return (s[n] = r(a)), Ae(e, this, s);
            }
          );
        }
        function ko(t, e) {
          return e.length < 2 ? t : Mr(t, ii(e, 0, -1));
        }
        function To(t, e) {
          if (('constructor' !== e || 'function' != typeof t[e]) && '__proto__' != e) return t[e];
        }
        var No = zo(ei),
          Po =
            ve ||
            function (t, e) {
              return fe.setTimeout(t, e);
            },
          Do = zo(ni);
        function Oo(t, e, n) {
          var r = e + '';
          return Do(
            t,
            (function (t, e) {
              var n = e.length;
              if (!n) return t;
              var r = n - 1;
              return (e[r] = (n > 1 ? '& ' : '') + e[r]), (e = e.join(n > 2 ? ', ' : ' ')), t.replace(it, '{\n/* [wrapped with ' + e + '] */\n');
            })(
              r,
              (function (t, e) {
                return (
                  $e(d, function (n) {
                    var r = '_.' + n[0];
                    e & n[1] && !ke(t, r) && t.push(r);
                  }),
                  t.sort()
                );
              })(
                (function (t) {
                  var e = t.match(ot);
                  return e ? e[1].split(at) : [];
                })(r),
                n
              )
            )
          );
        }
        function zo(e) {
          var n = 0,
            r = 0;
          return function () {
            var i = wn(),
              o = 16 - (i - r);
            if (((r = i), o > 0)) {
              if (++n >= 800) return arguments[0];
            } else n = 0;
            return e.apply(t, arguments);
          };
        }
        function Ro(e, n) {
          var r = -1,
            i = e.length,
            o = i - 1;
          for (n = n === t ? i : n; ++r < n; ) {
            var a = Zr(r, o),
              s = e[a];
            (e[a] = e[r]), (e[r] = s);
          }
          return (e.length = n), e;
        }
        var Io = (function (t) {
          var e = za(t, function (t) {
              return 500 === n.size && n.clear(), t;
            }),
            n = e.cache;
          return e;
        })(function (t) {
          var e = [];
          return (
            46 === t.charCodeAt(0) && e.push(''),
            t.replace(Q, function (t, n, r, i) {
              e.push(r ? i.replace(ct, '$1') : n || t);
            }),
            e
          );
        });
        function jo(t) {
          if ('string' == typeof t || cs(t)) return t;
          var e = t + '';
          return '0' == e && 1 / t == -1 / 0 ? '-0' : e;
        }
        function Uo(t) {
          if (null != t) {
            try {
              return zt.call(t);
            } catch (t) {}
            try {
              return t + '';
            } catch (t) {}
          }
          return '';
        }
        function Bo(t) {
          if (t instanceof Fn) return t.clone();
          var e = new Ln(t.__wrapped__, t.__chain__);
          return (e.__actions__ = Ti(t.__actions__)), (e.__index__ = t.__index__), (e.__values__ = t.__values__), e;
        }
        var Ho = Kr(function (t, e) {
            return Xa(t) ? hr(t, yr(e, 1, Xa, !0)) : [];
          }),
          qo = Kr(function (e, n) {
            var r = Ko(n);
            return Xa(r) && (r = t), Xa(e) ? hr(e, yr(n, 1, Xa, !0), co(r, 2)) : [];
          }),
          Wo = Kr(function (e, n) {
            var r = Ko(n);
            return Xa(r) && (r = t), Xa(e) ? hr(e, yr(n, 1, Xa, !0), t, r) : [];
          });
        function Lo(t, e, n) {
          var r = null == t ? 0 : t.length;
          if (!r) return -1;
          var i = null == n ? 0 : vs(n);
          return i < 0 && (i = bn(r + i, 0)), je(t, co(e, 3), i);
        }
        function Fo(e, n, r) {
          var i = null == e ? 0 : e.length;
          if (!i) return -1;
          var o = i - 1;
          return r !== t && ((o = vs(r)), (o = r < 0 ? bn(i + o, 0) : _n(o, i - 1))), je(e, co(n, 3), o, !0);
        }
        function Vo(t) {
          return null != t && t.length ? yr(t, 1) : [];
        }
        function Yo(e) {
          return e && e.length ? e[0] : t;
        }
        var Xo = Kr(function (t) {
            var e = Ne(t, yi);
            return e.length && e[0] === t[0] ? Tr(e) : [];
          }),
          Zo = Kr(function (e) {
            var n = Ko(e),
              r = Ne(e, yi);
            return n === Ko(r) ? (n = t) : r.pop(), r.length && r[0] === e[0] ? Tr(r, co(n, 2)) : [];
          }),
          Go = Kr(function (e) {
            var n = Ko(e),
              r = Ne(e, yi);
            return (n = 'function' == typeof n ? n : t) && r.pop(), r.length && r[0] === e[0] ? Tr(r, t, n) : [];
          });
        function Ko(e) {
          var n = null == e ? 0 : e.length;
          return n ? e[n - 1] : t;
        }
        var Jo = Kr(Qo);
        function Qo(t, e) {
          return t && t.length && e && e.length ? Yr(t, e) : t;
        }
        var ta = ro(function (t, e) {
          var n = null == t ? 0 : t.length,
            r = sr(t, e);
          return (
            Xr(
              t,
              Ne(e, function (t) {
                return _o(t, n) ? +t : t;
              }).sort(Si)
            ),
            r
          );
        });
        function ea(t) {
          return null == t ? t : Mn.call(t);
        }
        var na = Kr(function (t) {
            return fi(yr(t, 1, Xa, !0));
          }),
          ra = Kr(function (e) {
            var n = Ko(e);
            return Xa(n) && (n = t), fi(yr(e, 1, Xa, !0), co(n, 2));
          }),
          ia = Kr(function (e) {
            var n = Ko(e);
            return (n = 'function' == typeof n ? n : t), fi(yr(e, 1, Xa, !0), t, n);
          });
        function oa(t) {
          if (!t || !t.length) return [];
          var e = 0;
          return (
            (t = Ce(t, function (t) {
              if (Xa(t)) return (e = bn(t.length, e)), !0;
            })),
            Ye(e, function (e) {
              return Ne(t, We(e));
            })
          );
        }
        function aa(e, n) {
          if (!e || !e.length) return [];
          var r = oa(e);
          return null == n
            ? r
            : Ne(r, function (e) {
                return Ae(n, t, e);
              });
        }
        var sa = Kr(function (t, e) {
            return Xa(t) ? hr(t, e) : [];
          }),
          ua = Kr(function (t) {
            return mi(Ce(t, Xa));
          }),
          ca = Kr(function (e) {
            var n = Ko(e);
            return Xa(n) && (n = t), mi(Ce(e, Xa), co(n, 2));
          }),
          la = Kr(function (e) {
            var n = Ko(e);
            return (n = 'function' == typeof n ? n : t), mi(Ce(e, Xa), t, n);
          }),
          fa = Kr(oa),
          ha = Kr(function (e) {
            var n = e.length,
              r = n > 1 ? e[n - 1] : t;
            return (r = 'function' == typeof r ? (e.pop(), r) : t), aa(e, r);
          });
        function da(t) {
          var e = Hn(t);
          return (e.__chain__ = !0), e;
        }
        function pa(t, e) {
          return e(t);
        }
        var va = ro(function (e) {
            var n = e.length,
              r = n ? e[0] : 0,
              i = this.__wrapped__,
              o = function (t) {
                return sr(t, e);
              };
            return !(n > 1 || this.__actions__.length) && i instanceof Fn && _o(r)
              ? ((i = i.slice(r, +r + (n ? 1 : 0))).__actions__.push({ func: pa, args: [o], thisArg: t }),
                new Ln(i, this.__chain__).thru(function (e) {
                  return n && !e.length && e.push(t), e;
                }))
              : this.thru(o);
          }),
          ma = Pi(function (t, e, n) {
            Rt.call(t, n) ? ++t[n] : ar(t, n, 1);
          }),
          ga = Ui(Lo),
          ya = Ui(Fo);
        function ba(t, e) {
          return (Fa(t) ? $e : dr)(t, co(e, 3));
        }
        function _a(t, e) {
          return (Fa(t) ? Ee : pr)(t, co(e, 3));
        }
        var wa = Pi(function (t, e, n) {
            Rt.call(t, n) ? t[n].push(e) : ar(t, n, [e]);
          }),
          xa = Kr(function (t, e, n) {
            var r = -1,
              i = 'function' == typeof e,
              o = Ya(t) ? xt(t.length) : [];
            return (
              dr(t, function (t) {
                o[++r] = i ? Ae(e, t, n) : Nr(t, e, n);
              }),
              o
            );
          }),
          Aa = Pi(function (t, e, n) {
            ar(t, n, e);
          });
        function Ma(t, e) {
          return (Fa(t) ? Ne : Br)(t, co(e, 3));
        }
        var $a = Pi(
            function (t, e, n) {
              t[n ? 0 : 1].push(e);
            },
            function () {
              return [[], []];
            }
          ),
          Ea = Kr(function (t, e) {
            if (null == t) return [];
            var n = e.length;
            return n > 1 && wo(t, e[0], e[1]) ? (e = []) : n > 2 && wo(e[0], e[1], e[2]) && (e = [e[0]]), Fr(t, yr(e, 1), []);
          }),
          Sa =
            de ||
            function () {
              return fe.Date.now();
            };
        function Ca(e, n, r) {
          return (n = r ? t : n), (n = e && null == n ? e.length : n), Ji(e, s, t, t, t, t, n);
        }
        function ka(n, r) {
          var i;
          if ('function' != typeof r) throw new Tt(e);
          return (
            (n = vs(n)),
            function () {
              return --n > 0 && (i = r.apply(this, arguments)), n <= 1 && (r = t), i;
            }
          );
        }
        var Ta = Kr(function (t, e, n) {
            var r = 1;
            if (n.length) {
              var i = sn(n, uo(Ta));
              r |= o;
            }
            return Ji(t, r, e, n, i);
          }),
          Na = Kr(function (t, e, n) {
            var r = 3;
            if (n.length) {
              var i = sn(n, uo(Na));
              r |= o;
            }
            return Ji(e, r, t, n, i);
          });
        function Pa(n, r, i) {
          var o,
            a,
            s,
            u,
            c,
            l,
            f = 0,
            h = !1,
            d = !1,
            p = !0;
          if ('function' != typeof n) throw new Tt(e);
          function v(e) {
            var r = o,
              i = a;
            return (o = a = t), (f = e), (u = n.apply(i, r));
          }
          function m(e) {
            var n = e - l;
            return l === t || n >= r || n < 0 || (d && e - f >= s);
          }
          function g() {
            var t = Sa();
            if (m(t)) return y(t);
            c = Po(
              g,
              (function (t) {
                var e = r - (t - l);
                return d ? _n(e, s - (t - f)) : e;
              })(t)
            );
          }
          function y(e) {
            return (c = t), p && o ? v(e) : ((o = a = t), u);
          }
          function b() {
            var e = Sa(),
              n = m(e);
            if (((o = arguments), (a = this), (l = e), n)) {
              if (c === t)
                return (function (t) {
                  return (f = t), (c = Po(g, r)), h ? v(t) : u;
                })(l);
              if (d) return Ai(c), (c = Po(g, r)), v(l);
            }
            return c === t && (c = Po(g, r)), u;
          }
          return (
            (r = gs(r) || 0),
            es(i) && ((h = !!i.leading), (s = (d = 'maxWait' in i) ? bn(gs(i.maxWait) || 0, r) : s), (p = 'trailing' in i ? !!i.trailing : p)),
            (b.cancel = function () {
              c !== t && Ai(c), (f = 0), (o = l = a = c = t);
            }),
            (b.flush = function () {
              return c === t ? u : y(Sa());
            }),
            b
          );
        }
        var Da = Kr(function (t, e) {
            return fr(t, 1, e);
          }),
          Oa = Kr(function (t, e, n) {
            return fr(t, gs(e) || 0, n);
          });
        function za(t, n) {
          if ('function' != typeof t || (null != n && 'function' != typeof n)) throw new Tt(e);
          var r = function () {
            var e = arguments,
              i = n ? n.apply(this, e) : e[0],
              o = r.cache;
            if (o.has(i)) return o.get(i);
            var a = t.apply(this, e);
            return (r.cache = o.set(i, a) || o), a;
          };
          return (r.cache = new (za.Cache || Xn)()), r;
        }
        function Ra(t) {
          if ('function' != typeof t) throw new Tt(e);
          return function () {
            var e = arguments;
            switch (e.length) {
              case 0:
                return !t.call(this);
              case 1:
                return !t.call(this, e[0]);
              case 2:
                return !t.call(this, e[0], e[1]);
              case 3:
                return !t.call(this, e[0], e[1], e[2]);
            }
            return !t.apply(this, e);
          };
        }
        za.Cache = Xn;
        var Ia = wi(function (t, e) {
            var n = (e = 1 == e.length && Fa(e[0]) ? Ne(e[0], Ze(co())) : Ne(yr(e, 1), Ze(co()))).length;
            return Kr(function (r) {
              for (var i = -1, o = _n(r.length, n); ++i < o; ) r[i] = e[i].call(this, r[i]);
              return Ae(t, this, r);
            });
          }),
          ja = Kr(function (e, n) {
            var r = sn(n, uo(ja));
            return Ji(e, o, t, n, r);
          }),
          Ua = Kr(function (e, n) {
            var r = sn(n, uo(Ua));
            return Ji(e, a, t, n, r);
          }),
          Ba = ro(function (e, n) {
            return Ji(e, u, t, t, t, n);
          });
        function Ha(t, e) {
          return t === e || (t != t && e != e);
        }
        var qa = Yi(Sr),
          Wa = Yi(function (t, e) {
            return t >= e;
          }),
          La = Pr(
            (function () {
              return arguments;
            })()
          )
            ? Pr
            : function (t) {
                return ns(t) && Rt.call(t, 'callee') && !Zt.call(t, 'callee');
              },
          Fa = xt.isArray,
          Va = ge
            ? Ze(ge)
            : function (t) {
                return ns(t) && Er(t) == T;
              };
        function Ya(t) {
          return null != t && ts(t.length) && !Ja(t);
        }
        function Xa(t) {
          return ns(t) && Ya(t);
        }
        var Za = vn || gu,
          Ga = ye
            ? Ze(ye)
            : function (t) {
                return ns(t) && Er(t) == g;
              };
        function Ka(t) {
          if (!ns(t)) return !1;
          var e = Er(t);
          return e == y || '[object DOMException]' == e || ('string' == typeof t.message && 'string' == typeof t.name && !os(t));
        }
        function Ja(t) {
          if (!es(t)) return !1;
          var e = Er(t);
          return e == b || e == _ || '[object AsyncFunction]' == e || '[object Proxy]' == e;
        }
        function Qa(t) {
          return 'number' == typeof t && t == vs(t);
        }
        function ts(t) {
          return 'number' == typeof t && t > -1 && t % 1 == 0 && t <= l;
        }
        function es(t) {
          var e = typeof t;
          return null != t && ('object' == e || 'function' == e);
        }
        function ns(t) {
          return null != t && 'object' == typeof t;
        }
        var rs = be
          ? Ze(be)
          : function (t) {
              return ns(t) && mo(t) == w;
            };
        function is(t) {
          return 'number' == typeof t || (ns(t) && Er(t) == x);
        }
        function os(t) {
          if (!ns(t) || Er(t) != A) return !1;
          var e = Yt(t);
          if (null === e) return !0;
          var n = Rt.call(e, 'constructor') && e.constructor;
          return 'function' == typeof n && n instanceof n && zt.call(n) == Bt;
        }
        var as = _e
            ? Ze(_e)
            : function (t) {
                return ns(t) && Er(t) == $;
              },
          ss = we
            ? Ze(we)
            : function (t) {
                return ns(t) && mo(t) == E;
              };
        function us(t) {
          return 'string' == typeof t || (!Fa(t) && ns(t) && Er(t) == S);
        }
        function cs(t) {
          return 'symbol' == typeof t || (ns(t) && Er(t) == C);
        }
        var ls = xe
            ? Ze(xe)
            : function (t) {
                return ns(t) && ts(t.length) && !!ie[Er(t)];
              },
          fs = Yi(Ur),
          hs = Yi(function (t, e) {
            return t <= e;
          });
        function ds(t) {
          if (!t) return [];
          if (Ya(t)) return us(t) ? fn(t) : Ti(t);
          if (ae && t[ae])
            return (function (t) {
              for (var e, n = []; !(e = t.next()).done; ) n.push(e.value);
              return n;
            })(t[ae]());
          var e = mo(t);
          return (e == w ? on : e == E ? un : Hs)(t);
        }
        function ps(t) {
          return t ? ((t = gs(t)) === c || t === -1 / 0 ? 17976931348623157e292 * (t < 0 ? -1 : 1) : t == t ? t : 0) : 0 === t ? t : 0;
        }
        function vs(t) {
          var e = ps(t),
            n = e % 1;
          return e == e ? (n ? e - n : e) : 0;
        }
        function ms(t) {
          return t ? ur(vs(t), 0, h) : 0;
        }
        function gs(t) {
          if ('number' == typeof t) return t;
          if (cs(t)) return f;
          if (es(t)) {
            var e = 'function' == typeof t.valueOf ? t.valueOf() : t;
            t = es(e) ? e + '' : e;
          }
          if ('string' != typeof t) return 0 === t ? t : +t;
          t = Xe(t);
          var n = dt.test(t);
          return n || vt.test(t) ? ue(t.slice(2), n ? 2 : 8) : ht.test(t) ? f : +t;
        }
        function ys(t) {
          return Ni(t, Ds(t));
        }
        function bs(t) {
          return null == t ? '' : li(t);
        }
        var _s = Di(function (t, e) {
            if ($o(e) || Ya(e)) Ni(e, Ps(e), t);
            else for (var n in e) Rt.call(e, n) && nr(t, n, e[n]);
          }),
          ws = Di(function (t, e) {
            Ni(e, Ds(e), t);
          }),
          xs = Di(function (t, e, n, r) {
            Ni(e, Ds(e), t, r);
          }),
          As = Di(function (t, e, n, r) {
            Ni(e, Ps(e), t, r);
          }),
          Ms = ro(sr),
          $s = Kr(function (e, n) {
            e = St(e);
            var r = -1,
              i = n.length,
              o = i > 2 ? n[2] : t;
            for (o && wo(n[0], n[1], o) && (i = 1); ++r < i; )
              for (var a = n[r], s = Ds(a), u = -1, c = s.length; ++u < c; ) {
                var l = s[u],
                  f = e[l];
                (f === t || (Ha(f, Dt[l]) && !Rt.call(e, l))) && (e[l] = a[l]);
              }
            return e;
          }),
          Es = Kr(function (e) {
            return e.push(t, to), Ae(zs, t, e);
          });
        function Ss(e, n, r) {
          var i = null == e ? t : Mr(e, n);
          return i === t ? r : i;
        }
        function Cs(t, e) {
          return null != t && go(t, e, kr);
        }
        var ks = qi(function (t, e, n) {
            null != e && 'function' != typeof e.toString && (e = Ut.call(e)), (t[e] = n);
          }, eu(iu)),
          Ts = qi(function (t, e, n) {
            null != e && 'function' != typeof e.toString && (e = Ut.call(e)), Rt.call(t, e) ? t[e].push(n) : (t[e] = [n]);
          }, co),
          Ns = Kr(Nr);
        function Ps(t) {
          return Ya(t) ? Kn(t) : Ir(t);
        }
        function Ds(t) {
          return Ya(t) ? Kn(t, !0) : jr(t);
        }
        var Os = Di(function (t, e, n) {
            Wr(t, e, n);
          }),
          zs = Di(function (t, e, n, r) {
            Wr(t, e, n, r);
          }),
          Rs = ro(function (t, e) {
            var n = {};
            if (null == t) return n;
            var r = !1;
            (e = Ne(e, function (e) {
              return (e = _i(e, t)), r || (r = e.length > 1), e;
            })),
              Ni(t, oo(t), n),
              r && (n = cr(n, 7, eo));
            for (var i = e.length; i--; ) hi(n, e[i]);
            return n;
          }),
          Is = ro(function (t, e) {
            return null == t
              ? {}
              : (function (t, e) {
                  return Vr(t, e, function (e, n) {
                    return Cs(t, n);
                  });
                })(t, e);
          });
        function js(t, e) {
          if (null == t) return {};
          var n = Ne(oo(t), function (t) {
            return [t];
          });
          return (
            (e = co(e)),
            Vr(t, n, function (t, n) {
              return e(t, n[0]);
            })
          );
        }
        var Us = Ki(Ps),
          Bs = Ki(Ds);
        function Hs(t) {
          return null == t ? [] : Ge(t, Ps(t));
        }
        var qs = Ii(function (t, e, n) {
          return (e = e.toLowerCase()), t + (n ? Ws(e) : e);
        });
        function Ws(t) {
          return Ks(bs(t).toLowerCase());
        }
        function Ls(t) {
          return (t = bs(t)) && t.replace(gt, tn).replace(Kt, '');
        }
        var Fs = Ii(function (t, e, n) {
            return t + (n ? '-' : '') + e.toLowerCase();
          }),
          Vs = Ii(function (t, e, n) {
            return t + (n ? ' ' : '') + e.toLowerCase();
          }),
          Ys = Ri('toLowerCase'),
          Xs = Ii(function (t, e, n) {
            return t + (n ? '_' : '') + e.toLowerCase();
          }),
          Zs = Ii(function (t, e, n) {
            return t + (n ? ' ' : '') + Ks(e);
          }),
          Gs = Ii(function (t, e, n) {
            return t + (n ? ' ' : '') + e.toUpperCase();
          }),
          Ks = Ri('toUpperCase');
        function Js(e, n, r) {
          return (
            (e = bs(e)),
            (n = r ? t : n) === t
              ? (function (t) {
                  return ee.test(t);
                })(e)
                ? (function (t) {
                    return t.match(Qt) || [];
                  })(e)
                : (function (t) {
                    return t.match(st) || [];
                  })(e)
              : e.match(n) || []
          );
        }
        var Qs = Kr(function (e, n) {
            try {
              return Ae(e, t, n);
            } catch (t) {
              return Ka(t) ? t : new Mt(t);
            }
          }),
          tu = ro(function (t, e) {
            return (
              $e(e, function (e) {
                (e = jo(e)), ar(t, e, Ta(t[e], t));
              }),
              t
            );
          });
        function eu(t) {
          return function () {
            return t;
          };
        }
        var nu = Bi(),
          ru = Bi(!0);
        function iu(t) {
          return t;
        }
        function ou(t) {
          return Rr('function' == typeof t ? t : cr(t, 1));
        }
        var au = Kr(function (t, e) {
            return function (n) {
              return Nr(n, t, e);
            };
          }),
          su = Kr(function (t, e) {
            return function (n) {
              return Nr(t, n, e);
            };
          });
        function uu(t, e, n) {
          var r = Ps(e),
            i = Ar(e, r);
          null != n || (es(e) && (i.length || !r.length)) || ((n = e), (e = t), (t = this), (i = Ar(e, Ps(e))));
          var o = !(es(n) && 'chain' in n && !n.chain),
            a = Ja(t);
          return (
            $e(i, function (n) {
              var r = e[n];
              (t[n] = r),
                a &&
                  (t.prototype[n] = function () {
                    var e = this.__chain__;
                    if (o || e) {
                      var n = t(this.__wrapped__);
                      return (n.__actions__ = Ti(this.__actions__)).push({ func: r, args: arguments, thisArg: t }), (n.__chain__ = e), n;
                    }
                    return r.apply(t, Pe([this.value()], arguments));
                  });
            }),
            t
          );
        }
        function cu() {}
        var lu = Li(Ne),
          fu = Li(Se),
          hu = Li(ze);
        function du(t) {
          return xo(t)
            ? We(jo(t))
            : (function (t) {
                return function (e) {
                  return Mr(e, t);
                };
              })(t);
        }
        var pu = Vi(),
          vu = Vi(!0);
        function mu() {
          return [];
        }
        function gu() {
          return !1;
        }
        var yu,
          bu = Wi(function (t, e) {
            return t + e;
          }, 0),
          _u = Zi('ceil'),
          wu = Wi(function (t, e) {
            return t / e;
          }, 1),
          xu = Zi('floor'),
          Au = Wi(function (t, e) {
            return t * e;
          }, 1),
          Mu = Zi('round'),
          $u = Wi(function (t, e) {
            return t - e;
          }, 0);
        return (
          (Hn.after = function (t, n) {
            if ('function' != typeof n) throw new Tt(e);
            return (
              (t = vs(t)),
              function () {
                if (--t < 1) return n.apply(this, arguments);
              }
            );
          }),
          (Hn.ary = Ca),
          (Hn.assign = _s),
          (Hn.assignIn = ws),
          (Hn.assignInWith = xs),
          (Hn.assignWith = As),
          (Hn.at = Ms),
          (Hn.before = ka),
          (Hn.bind = Ta),
          (Hn.bindAll = tu),
          (Hn.bindKey = Na),
          (Hn.castArray = function () {
            if (!arguments.length) return [];
            var t = arguments[0];
            return Fa(t) ? t : [t];
          }),
          (Hn.chain = da),
          (Hn.chunk = function (e, n, r) {
            n = (r ? wo(e, n, r) : n === t) ? 1 : bn(vs(n), 0);
            var i = null == e ? 0 : e.length;
            if (!i || n < 1) return [];
            for (var o = 0, a = 0, s = xt(me(i / n)); o < i; ) s[a++] = ii(e, o, (o += n));
            return s;
          }),
          (Hn.compact = function (t) {
            for (var e = -1, n = null == t ? 0 : t.length, r = 0, i = []; ++e < n; ) {
              var o = t[e];
              o && (i[r++] = o);
            }
            return i;
          }),
          (Hn.concat = function () {
            var t = arguments.length;
            if (!t) return [];
            for (var e = xt(t - 1), n = arguments[0], r = t; r--; ) e[r - 1] = arguments[r];
            return Pe(Fa(n) ? Ti(n) : [n], yr(e, 1));
          }),
          (Hn.cond = function (t) {
            var n = null == t ? 0 : t.length,
              r = co();
            return (
              (t = n
                ? Ne(t, function (t) {
                    if ('function' != typeof t[1]) throw new Tt(e);
                    return [r(t[0]), t[1]];
                  })
                : []),
              Kr(function (e) {
                for (var r = -1; ++r < n; ) {
                  var i = t[r];
                  if (Ae(i[0], this, e)) return Ae(i[1], this, e);
                }
              })
            );
          }),
          (Hn.conforms = function (t) {
            return (function (t) {
              var e = Ps(t);
              return function (n) {
                return lr(n, t, e);
              };
            })(cr(t, 1));
          }),
          (Hn.constant = eu),
          (Hn.countBy = ma),
          (Hn.create = function (t, e) {
            var n = qn(t);
            return null == e ? n : or(n, e);
          }),
          (Hn.curry = function e(n, r, i) {
            var o = Ji(n, 8, t, t, t, t, t, (r = i ? t : r));
            return (o.placeholder = e.placeholder), o;
          }),
          (Hn.curryRight = function e(n, r, o) {
            var a = Ji(n, i, t, t, t, t, t, (r = o ? t : r));
            return (a.placeholder = e.placeholder), a;
          }),
          (Hn.debounce = Pa),
          (Hn.defaults = $s),
          (Hn.defaultsDeep = Es),
          (Hn.defer = Da),
          (Hn.delay = Oa),
          (Hn.difference = Ho),
          (Hn.differenceBy = qo),
          (Hn.differenceWith = Wo),
          (Hn.drop = function (e, n, r) {
            var i = null == e ? 0 : e.length;
            return i ? ii(e, (n = r || n === t ? 1 : vs(n)) < 0 ? 0 : n, i) : [];
          }),
          (Hn.dropRight = function (e, n, r) {
            var i = null == e ? 0 : e.length;
            return i ? ii(e, 0, (n = i - (n = r || n === t ? 1 : vs(n))) < 0 ? 0 : n) : [];
          }),
          (Hn.dropRightWhile = function (t, e) {
            return t && t.length ? pi(t, co(e, 3), !0, !0) : [];
          }),
          (Hn.dropWhile = function (t, e) {
            return t && t.length ? pi(t, co(e, 3), !0) : [];
          }),
          (Hn.fill = function (e, n, r, i) {
            var o = null == e ? 0 : e.length;
            return o
              ? (r && 'number' != typeof r && wo(e, n, r) && ((r = 0), (i = o)),
                (function (e, n, r, i) {
                  var o = e.length;
                  for ((r = vs(r)) < 0 && (r = -r > o ? 0 : o + r), (i = i === t || i > o ? o : vs(i)) < 0 && (i += o), i = r > i ? 0 : ms(i); r < i; ) e[r++] = n;
                  return e;
                })(e, n, r, i))
              : [];
          }),
          (Hn.filter = function (t, e) {
            return (Fa(t) ? Ce : gr)(t, co(e, 3));
          }),
          (Hn.flatMap = function (t, e) {
            return yr(Ma(t, e), 1);
          }),
          (Hn.flatMapDeep = function (t, e) {
            return yr(Ma(t, e), c);
          }),
          (Hn.flatMapDepth = function (e, n, r) {
            return (r = r === t ? 1 : vs(r)), yr(Ma(e, n), r);
          }),
          (Hn.flatten = Vo),
          (Hn.flattenDeep = function (t) {
            return null != t && t.length ? yr(t, c) : [];
          }),
          (Hn.flattenDepth = function (e, n) {
            return null != e && e.length ? yr(e, (n = n === t ? 1 : vs(n))) : [];
          }),
          (Hn.flip = function (t) {
            return Ji(t, 512);
          }),
          (Hn.flow = nu),
          (Hn.flowRight = ru),
          (Hn.fromPairs = function (t) {
            for (var e = -1, n = null == t ? 0 : t.length, r = {}; ++e < n; ) {
              var i = t[e];
              r[i[0]] = i[1];
            }
            return r;
          }),
          (Hn.functions = function (t) {
            return null == t ? [] : Ar(t, Ps(t));
          }),
          (Hn.functionsIn = function (t) {
            return null == t ? [] : Ar(t, Ds(t));
          }),
          (Hn.groupBy = wa),
          (Hn.initial = function (t) {
            return null != t && t.length ? ii(t, 0, -1) : [];
          }),
          (Hn.intersection = Xo),
          (Hn.intersectionBy = Zo),
          (Hn.intersectionWith = Go),
          (Hn.invert = ks),
          (Hn.invertBy = Ts),
          (Hn.invokeMap = xa),
          (Hn.iteratee = ou),
          (Hn.keyBy = Aa),
          (Hn.keys = Ps),
          (Hn.keysIn = Ds),
          (Hn.map = Ma),
          (Hn.mapKeys = function (t, e) {
            var n = {};
            return (
              (e = co(e, 3)),
              wr(t, function (t, r, i) {
                ar(n, e(t, r, i), t);
              }),
              n
            );
          }),
          (Hn.mapValues = function (t, e) {
            var n = {};
            return (
              (e = co(e, 3)),
              wr(t, function (t, r, i) {
                ar(n, r, e(t, r, i));
              }),
              n
            );
          }),
          (Hn.matches = function (t) {
            return Hr(cr(t, 1));
          }),
          (Hn.matchesProperty = function (t, e) {
            return qr(t, cr(e, 1));
          }),
          (Hn.memoize = za),
          (Hn.merge = Os),
          (Hn.mergeWith = zs),
          (Hn.method = au),
          (Hn.methodOf = su),
          (Hn.mixin = uu),
          (Hn.negate = Ra),
          (Hn.nthArg = function (t) {
            return (
              (t = vs(t)),
              Kr(function (e) {
                return Lr(e, t);
              })
            );
          }),
          (Hn.omit = Rs),
          (Hn.omitBy = function (t, e) {
            return js(t, Ra(co(e)));
          }),
          (Hn.once = function (t) {
            return ka(2, t);
          }),
          (Hn.orderBy = function (e, n, r, i) {
            return null == e ? [] : (Fa(n) || (n = null == n ? [] : [n]), Fa((r = i ? t : r)) || (r = null == r ? [] : [r]), Fr(e, n, r));
          }),
          (Hn.over = lu),
          (Hn.overArgs = Ia),
          (Hn.overEvery = fu),
          (Hn.overSome = hu),
          (Hn.partial = ja),
          (Hn.partialRight = Ua),
          (Hn.partition = $a),
          (Hn.pick = Is),
          (Hn.pickBy = js),
          (Hn.property = du),
          (Hn.propertyOf = function (e) {
            return function (n) {
              return null == e ? t : Mr(e, n);
            };
          }),
          (Hn.pull = Jo),
          (Hn.pullAll = Qo),
          (Hn.pullAllBy = function (t, e, n) {
            return t && t.length && e && e.length ? Yr(t, e, co(n, 2)) : t;
          }),
          (Hn.pullAllWith = function (e, n, r) {
            return e && e.length && n && n.length ? Yr(e, n, t, r) : e;
          }),
          (Hn.pullAt = ta),
          (Hn.range = pu),
          (Hn.rangeRight = vu),
          (Hn.rearg = Ba),
          (Hn.reject = function (t, e) {
            return (Fa(t) ? Ce : gr)(t, Ra(co(e, 3)));
          }),
          (Hn.remove = function (t, e) {
            var n = [];
            if (!t || !t.length) return n;
            var r = -1,
              i = [],
              o = t.length;
            for (e = co(e, 3); ++r < o; ) {
              var a = t[r];
              e(a, r, t) && (n.push(a), i.push(r));
            }
            return Xr(t, i), n;
          }),
          (Hn.rest = function (n, r) {
            if ('function' != typeof n) throw new Tt(e);
            return Kr(n, (r = r === t ? r : vs(r)));
          }),
          (Hn.reverse = ea),
          (Hn.sampleSize = function (e, n, r) {
            return (n = (r ? wo(e, n, r) : n === t) ? 1 : vs(n)), (Fa(e) ? Qn : Qr)(e, n);
          }),
          (Hn.set = function (t, e, n) {
            return null == t ? t : ti(t, e, n);
          }),
          (Hn.setWith = function (e, n, r, i) {
            return (i = 'function' == typeof i ? i : t), null == e ? e : ti(e, n, r, i);
          }),
          (Hn.shuffle = function (t) {
            return (Fa(t) ? tr : ri)(t);
          }),
          (Hn.slice = function (e, n, r) {
            var i = null == e ? 0 : e.length;
            return i ? (r && 'number' != typeof r && wo(e, n, r) ? ((n = 0), (r = i)) : ((n = null == n ? 0 : vs(n)), (r = r === t ? i : vs(r))), ii(e, n, r)) : [];
          }),
          (Hn.sortBy = Ea),
          (Hn.sortedUniq = function (t) {
            return t && t.length ? ui(t) : [];
          }),
          (Hn.sortedUniqBy = function (t, e) {
            return t && t.length ? ui(t, co(e, 2)) : [];
          }),
          (Hn.split = function (e, n, r) {
            return (
              r && 'number' != typeof r && wo(e, n, r) && (n = r = t),
              (r = r === t ? h : r >>> 0)
                ? (e = bs(e)) && ('string' == typeof n || (null != n && !as(n))) && !(n = li(n)) && rn(e)
                  ? xi(fn(e), 0, r)
                  : e.split(n, r)
                : []
            );
          }),
          (Hn.spread = function (t, n) {
            if ('function' != typeof t) throw new Tt(e);
            return (
              (n = null == n ? 0 : bn(vs(n), 0)),
              Kr(function (e) {
                var r = e[n],
                  i = xi(e, 0, n);
                return r && Pe(i, r), Ae(t, this, i);
              })
            );
          }),
          (Hn.tail = function (t) {
            var e = null == t ? 0 : t.length;
            return e ? ii(t, 1, e) : [];
          }),
          (Hn.take = function (e, n, r) {
            return e && e.length ? ii(e, 0, (n = r || n === t ? 1 : vs(n)) < 0 ? 0 : n) : [];
          }),
          (Hn.takeRight = function (e, n, r) {
            var i = null == e ? 0 : e.length;
            return i ? ii(e, (n = i - (n = r || n === t ? 1 : vs(n))) < 0 ? 0 : n, i) : [];
          }),
          (Hn.takeRightWhile = function (t, e) {
            return t && t.length ? pi(t, co(e, 3), !1, !0) : [];
          }),
          (Hn.takeWhile = function (t, e) {
            return t && t.length ? pi(t, co(e, 3)) : [];
          }),
          (Hn.tap = function (t, e) {
            return e(t), t;
          }),
          (Hn.throttle = function (t, n, r) {
            var i = !0,
              o = !0;
            if ('function' != typeof t) throw new Tt(e);
            return es(r) && ((i = 'leading' in r ? !!r.leading : i), (o = 'trailing' in r ? !!r.trailing : o)), Pa(t, n, { leading: i, maxWait: n, trailing: o });
          }),
          (Hn.thru = pa),
          (Hn.toArray = ds),
          (Hn.toPairs = Us),
          (Hn.toPairsIn = Bs),
          (Hn.toPath = function (t) {
            return Fa(t) ? Ne(t, jo) : cs(t) ? [t] : Ti(Io(bs(t)));
          }),
          (Hn.toPlainObject = ys),
          (Hn.transform = function (t, e, n) {
            var r = Fa(t),
              i = r || Za(t) || ls(t);
            if (((e = co(e, 4)), null == n)) {
              var o = t && t.constructor;
              n = i ? (r ? new o() : []) : es(t) && Ja(o) ? qn(Yt(t)) : {};
            }
            return (
              (i ? $e : wr)(t, function (t, r, i) {
                return e(n, t, r, i);
              }),
              n
            );
          }),
          (Hn.unary = function (t) {
            return Ca(t, 1);
          }),
          (Hn.union = na),
          (Hn.unionBy = ra),
          (Hn.unionWith = ia),
          (Hn.uniq = function (t) {
            return t && t.length ? fi(t) : [];
          }),
          (Hn.uniqBy = function (t, e) {
            return t && t.length ? fi(t, co(e, 2)) : [];
          }),
          (Hn.uniqWith = function (e, n) {
            return (n = 'function' == typeof n ? n : t), e && e.length ? fi(e, t, n) : [];
          }),
          (Hn.unset = function (t, e) {
            return null == t || hi(t, e);
          }),
          (Hn.unzip = oa),
          (Hn.unzipWith = aa),
          (Hn.update = function (t, e, n) {
            return null == t ? t : di(t, e, bi(n));
          }),
          (Hn.updateWith = function (e, n, r, i) {
            return (i = 'function' == typeof i ? i : t), null == e ? e : di(e, n, bi(r), i);
          }),
          (Hn.values = Hs),
          (Hn.valuesIn = function (t) {
            return null == t ? [] : Ge(t, Ds(t));
          }),
          (Hn.without = sa),
          (Hn.words = Js),
          (Hn.wrap = function (t, e) {
            return ja(bi(e), t);
          }),
          (Hn.xor = ua),
          (Hn.xorBy = ca),
          (Hn.xorWith = la),
          (Hn.zip = fa),
          (Hn.zipObject = function (t, e) {
            return gi(t || [], e || [], nr);
          }),
          (Hn.zipObjectDeep = function (t, e) {
            return gi(t || [], e || [], ti);
          }),
          (Hn.zipWith = ha),
          (Hn.entries = Us),
          (Hn.entriesIn = Bs),
          (Hn.extend = ws),
          (Hn.extendWith = xs),
          uu(Hn, Hn),
          (Hn.add = bu),
          (Hn.attempt = Qs),
          (Hn.camelCase = qs),
          (Hn.capitalize = Ws),
          (Hn.ceil = _u),
          (Hn.clamp = function (e, n, r) {
            return r === t && ((r = n), (n = t)), r !== t && (r = (r = gs(r)) == r ? r : 0), n !== t && (n = (n = gs(n)) == n ? n : 0), ur(gs(e), n, r);
          }),
          (Hn.clone = function (t) {
            return cr(t, 4);
          }),
          (Hn.cloneDeep = function (t) {
            return cr(t, 5);
          }),
          (Hn.cloneDeepWith = function (e, n) {
            return cr(e, 5, (n = 'function' == typeof n ? n : t));
          }),
          (Hn.cloneWith = function (e, n) {
            return cr(e, 4, (n = 'function' == typeof n ? n : t));
          }),
          (Hn.conformsTo = function (t, e) {
            return null == e || lr(t, e, Ps(e));
          }),
          (Hn.deburr = Ls),
          (Hn.defaultTo = function (t, e) {
            return null == t || t != t ? e : t;
          }),
          (Hn.divide = wu),
          (Hn.endsWith = function (e, n, r) {
            (e = bs(e)), (n = li(n));
            var i = e.length,
              o = (r = r === t ? i : ur(vs(r), 0, i));
            return (r -= n.length) >= 0 && e.slice(r, o) == n;
          }),
          (Hn.eq = Ha),
          (Hn.escape = function (t) {
            return (t = bs(t)) && Y.test(t) ? t.replace(F, en) : t;
          }),
          (Hn.escapeRegExp = function (t) {
            return (t = bs(t)) && et.test(t) ? t.replace(tt, '\\$&') : t;
          }),
          (Hn.every = function (e, n, r) {
            var i = Fa(e) ? Se : vr;
            return r && wo(e, n, r) && (n = t), i(e, co(n, 3));
          }),
          (Hn.find = ga),
          (Hn.findIndex = Lo),
          (Hn.findKey = function (t, e) {
            return Ie(t, co(e, 3), wr);
          }),
          (Hn.findLast = ya),
          (Hn.findLastIndex = Fo),
          (Hn.findLastKey = function (t, e) {
            return Ie(t, co(e, 3), xr);
          }),
          (Hn.floor = xu),
          (Hn.forEach = ba),
          (Hn.forEachRight = _a),
          (Hn.forIn = function (t, e) {
            return null == t ? t : br(t, co(e, 3), Ds);
          }),
          (Hn.forInRight = function (t, e) {
            return null == t ? t : _r(t, co(e, 3), Ds);
          }),
          (Hn.forOwn = function (t, e) {
            return t && wr(t, co(e, 3));
          }),
          (Hn.forOwnRight = function (t, e) {
            return t && xr(t, co(e, 3));
          }),
          (Hn.get = Ss),
          (Hn.gt = qa),
          (Hn.gte = Wa),
          (Hn.has = function (t, e) {
            return null != t && go(t, e, Cr);
          }),
          (Hn.hasIn = Cs),
          (Hn.head = Yo),
          (Hn.identity = iu),
          (Hn.includes = function (t, e, n, r) {
            (t = Ya(t) ? t : Hs(t)), (n = n && !r ? vs(n) : 0);
            var i = t.length;
            return n < 0 && (n = bn(i + n, 0)), us(t) ? n <= i && t.indexOf(e, n) > -1 : !!i && Ue(t, e, n) > -1;
          }),
          (Hn.indexOf = function (t, e, n) {
            var r = null == t ? 0 : t.length;
            if (!r) return -1;
            var i = null == n ? 0 : vs(n);
            return i < 0 && (i = bn(r + i, 0)), Ue(t, e, i);
          }),
          (Hn.inRange = function (e, n, r) {
            return (
              (n = ps(n)),
              r === t ? ((r = n), (n = 0)) : (r = ps(r)),
              (function (t, e, n) {
                return t >= _n(e, n) && t < bn(e, n);
              })((e = gs(e)), n, r)
            );
          }),
          (Hn.invoke = Ns),
          (Hn.isArguments = La),
          (Hn.isArray = Fa),
          (Hn.isArrayBuffer = Va),
          (Hn.isArrayLike = Ya),
          (Hn.isArrayLikeObject = Xa),
          (Hn.isBoolean = function (t) {
            return !0 === t || !1 === t || (ns(t) && Er(t) == m);
          }),
          (Hn.isBuffer = Za),
          (Hn.isDate = Ga),
          (Hn.isElement = function (t) {
            return ns(t) && 1 === t.nodeType && !os(t);
          }),
          (Hn.isEmpty = function (t) {
            if (null == t) return !0;
            if (Ya(t) && (Fa(t) || 'string' == typeof t || 'function' == typeof t.splice || Za(t) || ls(t) || La(t))) return !t.length;
            var e = mo(t);
            if (e == w || e == E) return !t.size;
            if ($o(t)) return !Ir(t).length;
            for (var n in t) if (Rt.call(t, n)) return !1;
            return !0;
          }),
          (Hn.isEqual = function (t, e) {
            return Dr(t, e);
          }),
          (Hn.isEqualWith = function (e, n, r) {
            var i = (r = 'function' == typeof r ? r : t) ? r(e, n) : t;
            return i === t ? Dr(e, n, t, r) : !!i;
          }),
          (Hn.isError = Ka),
          (Hn.isFinite = function (t) {
            return 'number' == typeof t && mn(t);
          }),
          (Hn.isFunction = Ja),
          (Hn.isInteger = Qa),
          (Hn.isLength = ts),
          (Hn.isMap = rs),
          (Hn.isMatch = function (t, e) {
            return t === e || Or(t, e, fo(e));
          }),
          (Hn.isMatchWith = function (e, n, r) {
            return (r = 'function' == typeof r ? r : t), Or(e, n, fo(n), r);
          }),
          (Hn.isNaN = function (t) {
            return is(t) && t != +t;
          }),
          (Hn.isNative = function (t) {
            if (Mo(t)) throw new Mt('Unsupported core-js use. Try https://npms.io/search?q=ponyfill.');
            return zr(t);
          }),
          (Hn.isNil = function (t) {
            return null == t;
          }),
          (Hn.isNull = function (t) {
            return null === t;
          }),
          (Hn.isNumber = is),
          (Hn.isObject = es),
          (Hn.isObjectLike = ns),
          (Hn.isPlainObject = os),
          (Hn.isRegExp = as),
          (Hn.isSafeInteger = function (t) {
            return Qa(t) && t >= -9007199254740991 && t <= l;
          }),
          (Hn.isSet = ss),
          (Hn.isString = us),
          (Hn.isSymbol = cs),
          (Hn.isTypedArray = ls),
          (Hn.isUndefined = function (e) {
            return e === t;
          }),
          (Hn.isWeakMap = function (t) {
            return ns(t) && mo(t) == k;
          }),
          (Hn.isWeakSet = function (t) {
            return ns(t) && '[object WeakSet]' == Er(t);
          }),
          (Hn.join = function (t, e) {
            return null == t ? '' : gn.call(t, e);
          }),
          (Hn.kebabCase = Fs),
          (Hn.last = Ko),
          (Hn.lastIndexOf = function (e, n, r) {
            var i = null == e ? 0 : e.length;
            if (!i) return -1;
            var o = i;
            return (
              r !== t && (o = (o = vs(r)) < 0 ? bn(i + o, 0) : _n(o, i - 1)),
              n == n
                ? (function (t, e, n) {
                    for (var r = n + 1; r--; ) if (t[r] === e) return r;
                    return r;
                  })(e, n, o)
                : je(e, He, o, !0)
            );
          }),
          (Hn.lowerCase = Vs),
          (Hn.lowerFirst = Ys),
          (Hn.lt = fs),
          (Hn.lte = hs),
          (Hn.max = function (e) {
            return e && e.length ? mr(e, iu, Sr) : t;
          }),
          (Hn.maxBy = function (e, n) {
            return e && e.length ? mr(e, co(n, 2), Sr) : t;
          }),
          (Hn.mean = function (t) {
            return qe(t, iu);
          }),
          (Hn.meanBy = function (t, e) {
            return qe(t, co(e, 2));
          }),
          (Hn.min = function (e) {
            return e && e.length ? mr(e, iu, Ur) : t;
          }),
          (Hn.minBy = function (e, n) {
            return e && e.length ? mr(e, co(n, 2), Ur) : t;
          }),
          (Hn.stubArray = mu),
          (Hn.stubFalse = gu),
          (Hn.stubObject = function () {
            return {};
          }),
          (Hn.stubString = function () {
            return '';
          }),
          (Hn.stubTrue = function () {
            return !0;
          }),
          (Hn.multiply = Au),
          (Hn.nth = function (e, n) {
            return e && e.length ? Lr(e, vs(n)) : t;
          }),
          (Hn.noConflict = function () {
            return fe._ === this && (fe._ = Ht), this;
          }),
          (Hn.noop = cu),
          (Hn.now = Sa),
          (Hn.pad = function (t, e, n) {
            t = bs(t);
            var r = (e = vs(e)) ? ln(t) : 0;
            if (!e || r >= e) return t;
            var i = (e - r) / 2;
            return Fi(Re(i), n) + t + Fi(me(i), n);
          }),
          (Hn.padEnd = function (t, e, n) {
            t = bs(t);
            var r = (e = vs(e)) ? ln(t) : 0;
            return e && r < e ? t + Fi(e - r, n) : t;
          }),
          (Hn.padStart = function (t, e, n) {
            t = bs(t);
            var r = (e = vs(e)) ? ln(t) : 0;
            return e && r < e ? Fi(e - r, n) + t : t;
          }),
          (Hn.parseInt = function (t, e, n) {
            return n || null == e ? (e = 0) : e && (e = +e), xn(bs(t).replace(nt, ''), e || 0);
          }),
          (Hn.random = function (e, n, r) {
            if (
              (r && 'boolean' != typeof r && wo(e, n, r) && (n = r = t),
              r === t && ('boolean' == typeof n ? ((r = n), (n = t)) : 'boolean' == typeof e && ((r = e), (e = t))),
              e === t && n === t ? ((e = 0), (n = 1)) : ((e = ps(e)), n === t ? ((n = e), (e = 0)) : (n = ps(n))),
              e > n)
            ) {
              var i = e;
              (e = n), (n = i);
            }
            if (r || e % 1 || n % 1) {
              var o = An();
              return _n(e + o * (n - e + se('1e-' + ((o + '').length - 1))), n);
            }
            return Zr(e, n);
          }),
          (Hn.reduce = function (t, e, n) {
            var r = Fa(t) ? De : Fe,
              i = arguments.length < 3;
            return r(t, co(e, 4), n, i, dr);
          }),
          (Hn.reduceRight = function (t, e, n) {
            var r = Fa(t) ? Oe : Fe,
              i = arguments.length < 3;
            return r(t, co(e, 4), n, i, pr);
          }),
          (Hn.repeat = function (e, n, r) {
            return (n = (r ? wo(e, n, r) : n === t) ? 1 : vs(n)), Gr(bs(e), n);
          }),
          (Hn.replace = function () {
            var t = arguments,
              e = bs(t[0]);
            return t.length < 3 ? e : e.replace(t[1], t[2]);
          }),
          (Hn.result = function (e, n, r) {
            var i = -1,
              o = (n = _i(n, e)).length;
            for (o || ((o = 1), (e = t)); ++i < o; ) {
              var a = null == e ? t : e[jo(n[i])];
              a === t && ((i = o), (a = r)), (e = Ja(a) ? a.call(e) : a);
            }
            return e;
          }),
          (Hn.round = Mu),
          (Hn.runInContext = rt),
          (Hn.sample = function (t) {
            return (Fa(t) ? Jn : Jr)(t);
          }),
          (Hn.size = function (t) {
            if (null == t) return 0;
            if (Ya(t)) return us(t) ? ln(t) : t.length;
            var e = mo(t);
            return e == w || e == E ? t.size : Ir(t).length;
          }),
          (Hn.snakeCase = Xs),
          (Hn.some = function (e, n, r) {
            var i = Fa(e) ? ze : oi;
            return r && wo(e, n, r) && (n = t), i(e, co(n, 3));
          }),
          (Hn.sortedIndex = function (t, e) {
            return ai(t, e);
          }),
          (Hn.sortedIndexBy = function (t, e, n) {
            return si(t, e, co(n, 2));
          }),
          (Hn.sortedIndexOf = function (t, e) {
            var n = null == t ? 0 : t.length;
            if (n) {
              var r = ai(t, e);
              if (r < n && Ha(t[r], e)) return r;
            }
            return -1;
          }),
          (Hn.sortedLastIndex = function (t, e) {
            return ai(t, e, !0);
          }),
          (Hn.sortedLastIndexBy = function (t, e, n) {
            return si(t, e, co(n, 2), !0);
          }),
          (Hn.sortedLastIndexOf = function (t, e) {
            if (null != t && t.length) {
              var n = ai(t, e, !0) - 1;
              if (Ha(t[n], e)) return n;
            }
            return -1;
          }),
          (Hn.startCase = Zs),
          (Hn.startsWith = function (t, e, n) {
            return (t = bs(t)), (n = null == n ? 0 : ur(vs(n), 0, t.length)), (e = li(e)), t.slice(n, n + e.length) == e;
          }),
          (Hn.subtract = $u),
          (Hn.sum = function (t) {
            return t && t.length ? Ve(t, iu) : 0;
          }),
          (Hn.sumBy = function (t, e) {
            return t && t.length ? Ve(t, co(e, 2)) : 0;
          }),
          (Hn.template = function (e, n, r) {
            var i = Hn.templateSettings;
            r && wo(e, n, r) && (n = t), (e = bs(e)), (n = xs({}, n, i, Qi));
            var o,
              a,
              s = xs({}, n.imports, i.imports, Qi),
              u = Ps(s),
              c = Ge(s, u),
              l = 0,
              f = n.interpolate || yt,
              h = "__p += '",
              d = Ct((n.escape || yt).source + '|' + f.source + '|' + (f === G ? lt : yt).source + '|' + (n.evaluate || yt).source + '|$', 'g'),
              p = '//# sourceURL=' + (Rt.call(n, 'sourceURL') ? (n.sourceURL + '').replace(/\s/g, ' ') : 'lodash.templateSources[' + ++re + ']') + '\n';
            e.replace(d, function (t, n, r, i, s, u) {
              return (
                r || (r = i),
                (h += e.slice(l, u).replace(bt, nn)),
                n && ((o = !0), (h += "' +\n__e(" + n + ") +\n'")),
                s && ((a = !0), (h += "';\n" + s + ";\n__p += '")),
                r && (h += "' +\n((__t = (" + r + ")) == null ? '' : __t) +\n'"),
                (l = u + t.length),
                t
              );
            }),
              (h += "';\n");
            var v = Rt.call(n, 'variable') && n.variable;
            if (v) {
              if (ut.test(v)) throw new Mt('Invalid `variable` option passed into `_.template`');
            } else h = 'with (obj) {\n' + h + '\n}\n';
            (h = (a ? h.replace(H, '') : h).replace(q, '$1').replace(W, '$1;')),
              (h =
                'function(' +
                (v || 'obj') +
                ') {\n' +
                (v ? '' : 'obj || (obj = {});\n') +
                "var __t, __p = ''" +
                (o ? ', __e = _.escape' : '') +
                (a ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ';\n') +
                h +
                'return __p\n}');
            var m = Qs(function () {
              return $t(u, p + 'return ' + h).apply(t, c);
            });
            if (((m.source = h), Ka(m))) throw m;
            return m;
          }),
          (Hn.times = function (t, e) {
            if ((t = vs(t)) < 1 || t > l) return [];
            var n = h,
              r = _n(t, h);
            (e = co(e)), (t -= h);
            for (var i = Ye(r, e); ++n < t; ) e(n);
            return i;
          }),
          (Hn.toFinite = ps),
          (Hn.toInteger = vs),
          (Hn.toLength = ms),
          (Hn.toLower = function (t) {
            return bs(t).toLowerCase();
          }),
          (Hn.toNumber = gs),
          (Hn.toSafeInteger = function (t) {
            return t ? ur(vs(t), -9007199254740991, l) : 0 === t ? t : 0;
          }),
          (Hn.toString = bs),
          (Hn.toUpper = function (t) {
            return bs(t).toUpperCase();
          }),
          (Hn.trim = function (e, n, r) {
            if ((e = bs(e)) && (r || n === t)) return Xe(e);
            if (!e || !(n = li(n))) return e;
            var i = fn(e),
              o = fn(n);
            return xi(i, Je(i, o), Qe(i, o) + 1).join('');
          }),
          (Hn.trimEnd = function (e, n, r) {
            if ((e = bs(e)) && (r || n === t)) return e.slice(0, hn(e) + 1);
            if (!e || !(n = li(n))) return e;
            var i = fn(e);
            return xi(i, 0, Qe(i, fn(n)) + 1).join('');
          }),
          (Hn.trimStart = function (e, n, r) {
            if ((e = bs(e)) && (r || n === t)) return e.replace(nt, '');
            if (!e || !(n = li(n))) return e;
            var i = fn(e);
            return xi(i, Je(i, fn(n))).join('');
          }),
          (Hn.truncate = function (e, n) {
            var r = 30,
              i = '...';
            if (es(n)) {
              var o = 'separator' in n ? n.separator : o;
              (r = 'length' in n ? vs(n.length) : r), (i = 'omission' in n ? li(n.omission) : i);
            }
            var a = (e = bs(e)).length;
            if (rn(e)) {
              var s = fn(e);
              a = s.length;
            }
            if (r >= a) return e;
            var u = r - ln(i);
            if (u < 1) return i;
            var c = s ? xi(s, 0, u).join('') : e.slice(0, u);
            if (o === t) return c + i;
            if ((s && (u += c.length - u), as(o))) {
              if (e.slice(u).search(o)) {
                var l,
                  f = c;
                for (o.global || (o = Ct(o.source, bs(ft.exec(o)) + 'g')), o.lastIndex = 0; (l = o.exec(f)); ) var h = l.index;
                c = c.slice(0, h === t ? u : h);
              }
            } else if (e.indexOf(li(o), u) != u) {
              var d = c.lastIndexOf(o);
              d > -1 && (c = c.slice(0, d));
            }
            return c + i;
          }),
          (Hn.unescape = function (t) {
            return (t = bs(t)) && V.test(t) ? t.replace(L, dn) : t;
          }),
          (Hn.uniqueId = function (t) {
            var e = ++It;
            return bs(t) + e;
          }),
          (Hn.upperCase = Gs),
          (Hn.upperFirst = Ks),
          (Hn.each = ba),
          (Hn.eachRight = _a),
          (Hn.first = Yo),
          uu(
            Hn,
            ((yu = {}),
            wr(Hn, function (t, e) {
              Rt.call(Hn.prototype, e) || (yu[e] = t);
            }),
            yu),
            { chain: !1 }
          ),
          (Hn.VERSION = '4.17.21'),
          $e(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function (t) {
            Hn[t].placeholder = Hn;
          }),
          $e(['drop', 'take'], function (e, n) {
            (Fn.prototype[e] = function (r) {
              r = r === t ? 1 : bn(vs(r), 0);
              var i = this.__filtered__ && !n ? new Fn(this) : this.clone();
              return i.__filtered__ ? (i.__takeCount__ = _n(r, i.__takeCount__)) : i.__views__.push({ size: _n(r, h), type: e + (i.__dir__ < 0 ? 'Right' : '') }), i;
            }),
              (Fn.prototype[e + 'Right'] = function (t) {
                return this.reverse()[e](t).reverse();
              });
          }),
          $e(['filter', 'map', 'takeWhile'], function (t, e) {
            var n = e + 1,
              r = 1 == n || 3 == n;
            Fn.prototype[t] = function (t) {
              var e = this.clone();
              return e.__iteratees__.push({ iteratee: co(t, 3), type: n }), (e.__filtered__ = e.__filtered__ || r), e;
            };
          }),
          $e(['head', 'last'], function (t, e) {
            var n = 'take' + (e ? 'Right' : '');
            Fn.prototype[t] = function () {
              return this[n](1).value()[0];
            };
          }),
          $e(['initial', 'tail'], function (t, e) {
            var n = 'drop' + (e ? '' : 'Right');
            Fn.prototype[t] = function () {
              return this.__filtered__ ? new Fn(this) : this[n](1);
            };
          }),
          (Fn.prototype.compact = function () {
            return this.filter(iu);
          }),
          (Fn.prototype.find = function (t) {
            return this.filter(t).head();
          }),
          (Fn.prototype.findLast = function (t) {
            return this.reverse().find(t);
          }),
          (Fn.prototype.invokeMap = Kr(function (t, e) {
            return 'function' == typeof t
              ? new Fn(this)
              : this.map(function (n) {
                  return Nr(n, t, e);
                });
          })),
          (Fn.prototype.reject = function (t) {
            return this.filter(Ra(co(t)));
          }),
          (Fn.prototype.slice = function (e, n) {
            e = vs(e);
            var r = this;
            return r.__filtered__ && (e > 0 || n < 0)
              ? new Fn(r)
              : (e < 0 ? (r = r.takeRight(-e)) : e && (r = r.drop(e)), n !== t && (r = (n = vs(n)) < 0 ? r.dropRight(-n) : r.take(n - e)), r);
          }),
          (Fn.prototype.takeRightWhile = function (t) {
            return this.reverse().takeWhile(t).reverse();
          }),
          (Fn.prototype.toArray = function () {
            return this.take(h);
          }),
          wr(Fn.prototype, function (e, n) {
            var r = /^(?:filter|find|map|reject)|While$/.test(n),
              i = /^(?:head|last)$/.test(n),
              o = Hn[i ? 'take' + ('last' == n ? 'Right' : '') : n],
              a = i || /^find/.test(n);
            o &&
              (Hn.prototype[n] = function () {
                var n = this.__wrapped__,
                  s = i ? [1] : arguments,
                  u = n instanceof Fn,
                  c = s[0],
                  l = u || Fa(n),
                  f = function (t) {
                    var e = o.apply(Hn, Pe([t], s));
                    return i && h ? e[0] : e;
                  };
                l && r && 'function' == typeof c && 1 != c.length && (u = l = !1);
                var h = this.__chain__,
                  d = !!this.__actions__.length,
                  p = a && !h,
                  v = u && !d;
                if (!a && l) {
                  n = v ? n : new Fn(this);
                  var m = e.apply(n, s);
                  return m.__actions__.push({ func: pa, args: [f], thisArg: t }), new Ln(m, h);
                }
                return p && v ? e.apply(this, s) : ((m = this.thru(f)), p ? (i ? m.value()[0] : m.value()) : m);
              });
          }),
          $e(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function (t) {
            var e = Nt[t],
              n = /^(?:push|sort|unshift)$/.test(t) ? 'tap' : 'thru',
              r = /^(?:pop|shift)$/.test(t);
            Hn.prototype[t] = function () {
              var t = arguments;
              if (r && !this.__chain__) {
                var i = this.value();
                return e.apply(Fa(i) ? i : [], t);
              }
              return this[n](function (n) {
                return e.apply(Fa(n) ? n : [], t);
              });
            };
          }),
          wr(Fn.prototype, function (t, e) {
            var n = Hn[e];
            if (n) {
              var r = n.name + '';
              Rt.call(Pn, r) || (Pn[r] = []), Pn[r].push({ name: e, func: n });
            }
          }),
          (Pn[Hi(t, 2).name] = [{ name: 'wrapper', func: t }]),
          (Fn.prototype.clone = function () {
            var t = new Fn(this.__wrapped__);
            return (
              (t.__actions__ = Ti(this.__actions__)),
              (t.__dir__ = this.__dir__),
              (t.__filtered__ = this.__filtered__),
              (t.__iteratees__ = Ti(this.__iteratees__)),
              (t.__takeCount__ = this.__takeCount__),
              (t.__views__ = Ti(this.__views__)),
              t
            );
          }),
          (Fn.prototype.reverse = function () {
            if (this.__filtered__) {
              var t = new Fn(this);
              (t.__dir__ = -1), (t.__filtered__ = !0);
            } else (t = this.clone()).__dir__ *= -1;
            return t;
          }),
          (Fn.prototype.value = function () {
            var t = this.__wrapped__.value(),
              e = this.__dir__,
              n = Fa(t),
              r = e < 0,
              i = n ? t.length : 0,
              o = (function (t, e, n) {
                for (var r = -1, i = n.length; ++r < i; ) {
                  var o = n[r],
                    a = o.size;
                  switch (o.type) {
                    case 'drop':
                      t += a;
                      break;
                    case 'dropRight':
                      e -= a;
                      break;
                    case 'take':
                      e = _n(e, t + a);
                      break;
                    case 'takeRight':
                      t = bn(t, e - a);
                  }
                }
                return { start: t, end: e };
              })(0, i, this.__views__),
              a = o.start,
              s = o.end,
              u = s - a,
              c = r ? s : a - 1,
              l = this.__iteratees__,
              f = l.length,
              h = 0,
              d = _n(u, this.__takeCount__);
            if (!n || (!r && i == u && d == u)) return vi(t, this.__actions__);
            var p = [];
            t: for (; u-- && h < d; ) {
              for (var v = -1, m = t[(c += e)]; ++v < f; ) {
                var g = l[v],
                  y = g.iteratee,
                  b = g.type,
                  _ = y(m);
                if (2 == b) m = _;
                else if (!_) {
                  if (1 == b) continue t;
                  break t;
                }
              }
              p[h++] = m;
            }
            return p;
          }),
          (Hn.prototype.at = va),
          (Hn.prototype.chain = function () {
            return da(this);
          }),
          (Hn.prototype.commit = function () {
            return new Ln(this.value(), this.__chain__);
          }),
          (Hn.prototype.next = function () {
            this.__values__ === t && (this.__values__ = ds(this.value()));
            var e = this.__index__ >= this.__values__.length;
            return { done: e, value: e ? t : this.__values__[this.__index__++] };
          }),
          (Hn.prototype.plant = function (e) {
            for (var n, r = this; r instanceof Wn; ) {
              var i = Bo(r);
              (i.__index__ = 0), (i.__values__ = t), n ? (o.__wrapped__ = i) : (n = i);
              var o = i;
              r = r.__wrapped__;
            }
            return (o.__wrapped__ = e), n;
          }),
          (Hn.prototype.reverse = function () {
            var e = this.__wrapped__;
            if (e instanceof Fn) {
              var n = e;
              return (
                this.__actions__.length && (n = new Fn(this)), (n = n.reverse()).__actions__.push({ func: pa, args: [ea], thisArg: t }), new Ln(n, this.__chain__)
              );
            }
            return this.thru(ea);
          }),
          (Hn.prototype.toJSON =
            Hn.prototype.valueOf =
            Hn.prototype.value =
              function () {
                return vi(this.__wrapped__, this.__actions__);
              }),
          (Hn.prototype.first = Hn.prototype.head),
          ae &&
            (Hn.prototype[ae] = function () {
              return this;
            }),
          Hn
        );
      })();
    de ? (((de.exports = pn)._ = pn), (he._ = pn)) : (fe._ = pn);
  }.call(Da);
var Im,
  jm,
  Um = Rm.exports,
  Bm = {},
  Hm = {};
function qm() {
  if (Im) return Hm;
  (Im = 1),
    Object.defineProperty(Hm, '__esModule', { value: !0 }),
    (Hm.isNumericArray = function (t) {
      for (var e = 0, n = t.length; e < n; e++) if ('number' != typeof t[e]) return !1;
      return !0;
    }),
    (Hm.sleep = n),
    (Hm.getSize = function (t) {
      var e = t.node().getBoundingClientRect(),
        n = e.width,
        r = e.height;
      return { width: n, height: r };
    }),
    (Hm.attrd = function (t, e) {
      for (var n in e) 'style' !== n && t.attr(r(n), e[n]);
      for (var i in e.style) t.style(r(i), e.style[i]);
      return t;
    }),
    (Hm.kebabCase = r),
    (Hm.minimum = function () {
      for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
      var r = t.filter(function (t) {
        return !(0, e.isNil)(t);
      });
      return r.length > 0 ? Math.min.apply(Math, r) : void 0;
    }),
    (Hm.sortDirection = function (t) {
      var e = t.length;
      if (e < 2) return 'none';
      var n = t[0] < t[1] ? 'asc' : 'desc';
      if ('asc' === n) {
        for (var r = 1; r < e; r++) if (t[r - 1] >= t[r]) return 'none';
        return 'asc';
      }
      for (r = 1; r < e; r++) if (t[r - 1] <= t[r]) return 'none';
      return 'desc';
    }),
    (Hm.Refresher = function (e) {
      var r = !1,
        i = !1;
      return {
        requestRefresh: function () {
          (r = !0),
            i ||
              (function () {
                t.__awaiter(this, void 0, void 0, function () {
                  return t.__generator(this, function (t) {
                    switch (t.label) {
                      case 0:
                        return r ? ((r = !1), (i = !0), [4, n(0)]) : [3, 2];
                      case 1:
                        t.sent();
                        try {
                          e();
                        } catch (t) {
                          console.error(t);
                        }
                        return (i = !1), [3, 0];
                      case 2:
                        return [2];
                    }
                  });
                });
              })();
        },
      };
    }),
    (Hm.removeElement = function (t, e) {
      var n = t.indexOf(e);
      n >= 0 && t.splice(n);
    }),
    (Hm.shallowMerge = function (e, n) {
      var r = t.__assign({}, e);
      for (var i in n) {
        var o = n[i];
        void 0 !== o && (r[i] = o);
      }
      return r;
    });
  var t = Ra,
    e = Um;
  function n(e) {
    return t.__awaiter(this, void 0, void 0, function () {
      return t.__generator(this, function (t) {
        switch (t.label) {
          case 0:
            return [
              4,
              new Promise(function (t) {
                return setTimeout(t, e);
              }),
            ];
          case 1:
            return t.sent(), [2];
        }
      });
    });
  }
  function r(t) {
    return t.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
  return Hm;
}
function Wm() {
  if (jm) return Bm;
  (jm = 1), Object.defineProperty(Bm, '__esModule', { value: !0 }), (Bm.Domain = void 0);
  var t = Um,
    e = qm();
  function n(t) {
    for (var e = new Map(), n = t.length, r = 0; r < n; r++) e.set(t[r], r);
    return e;
  }
  return (
    (Bm.Domain = {
      create: function (t) {
        var r = (0, e.isNumericArray)(t);
        return { values: t, isNumeric: r, sortDirection: r ? (0, e.sortDirection)(t) : 'none', index: n(t) };
      },
      interpolateValue: function (e, n) {
        if (e.isNumeric) {
          var r = e.values,
            i = (0, t.clamp)(Math.floor(n), 0, r.length - 2),
            o = i + 1,
            a = r[i];
          return (n - i) * (r[o] - a) + a;
        }
      },
      interpolateIndex: function (e, n) {
        if (e.isNumeric)
          if ('number' == typeof n) {
            var r = e,
              i = r.sortDirection,
              o = r.values;
            if ('none' !== i) {
              var a =
                  'asc' === i
                    ? (0, t.sortedIndex)(o, n)
                    : (0, t.sortedIndexBy)(o, n, function (t) {
                        return -t;
                      }),
                s = (a = (0, t.clamp)(a, 1, o.length - 1)) - 1,
                u = o[s];
              return (n - u) / (o[a] - u) + s;
            }
            console.warn('Cannot interpolate index because the domain is not sorted');
          } else console.warn('Cannot interpolate index because the value is not numeric');
        else console.warn('Cannot interpolate index because the domain is not numeric');
      },
    }),
    Bm
  );
}
!(function (t) {
  Object.defineProperty(t, '__esModule', { value: !0 }), (t.ColorScale = void 0);
  var e = Ra,
    n = Um,
    r = e.__importStar(Pm()),
    i = Ia,
    o = Wm(),
    a = Object.keys(r)
      .filter(function (t) {
        return 0 === t.indexOf('interpolate');
      })
      .map(function (t) {
        return t.replace(/^interpolate/, '');
      }),
    s = Object.keys(r)
      .filter(function (t) {
        return 0 === t.indexOf('scheme') && d(r[t]);
      })
      .map(function (t) {
        return t.replace(/^scheme/, '');
      }),
    u = (0, n.uniq)(e.__spreadArray(e.__spreadArray([], a, !0), s, !0)).sort();
  function c(t, e) {
    if (t.length !== e.length) throw new Error('`values` and `colors` must have the same length');
    var r = t.length,
      a = o.Domain.create(t),
      s = e.map(function (t) {
        return 'string' == typeof t ? i.Color.fromString(t) : t;
      });
    if (!a.isNumeric || 'none' === a.sortDirection) throw new Error('Provided list of `values` is not numeric and monotonous');
    return function (t) {
      var e = (0, n.clamp)(o.Domain.interpolateIndex(a, t), 0, r - 1),
        u = Math.floor(e);
      return u === r ? s[r] : i.Color.mix(s[u], s[u + 1], e - u);
    };
  }
  function l(t, e, n) {
    if ((void 0 === n && (n = '#888888'), t.length !== e.length)) throw new Error('`values` and `colors` must have the same length');
    for (var r = t.length, o = new Map(), a = 0; a < r; a++) {
      var s = e[a];
      o.set(t[a], 'string' == typeof s ? i.Color.fromString(s) : s);
    }
    var u = 'string' == typeof n ? i.Color.fromString(n) : n;
    return function (t) {
      var e;
      return null !== (e = o.get(t)) && void 0 !== e ? e : u;
    };
  }
  function f(t, e) {
    var i = r.scaleLinear([0, e - 1], t);
    return (0, n.range)(e).map(function (t) {
      return i(t);
    });
  }
  function h(t, e, n) {
    return f(e, n).map(function (e) {
      return i.Color.fromString(t(e));
    });
  }
  function d(t) {
    return (0, n.isArray)(t) && t.length > 0 && 'string' == typeof t[0];
  }
  t.ColorScale = {
    ContinuousSchemes: a,
    DiscreteSchemes: u,
    continuous: function (e, n, i) {
      return 'string' == typeof e
        ? (function (e, n, i) {
            void 0 === n && (n = [0, 1]), void 0 === i && (i = [0, 1]);
            var o = r['interpolate'.concat(e)];
            if (void 0 !== o) return c(f(n, 101), h(o, i, 101));
            throw new Error('Invalid color scheme name: "'.concat(e, '".\n(Available schemes: ').concat(t.ColorScale.ContinuousSchemes, ')'));
          })(e, n, i)
        : c(e, n);
    },
    discrete: function (e, n, o) {
      return 'string' == typeof e
        ? (function (e, n, o) {
            var a = r['scheme'.concat(e)];
            if (d(a)) {
              var s = a.map(function (t) {
                return i.Color.fromString(t);
              });
              return l(
                n,
                (function (t, e) {
                  for (var n = []; n.length < e; ) n.push.apply(n, t);
                  return (n.length = e), n;
                })(s, n.length),
                o
              );
            }
            var u = r['interpolate'.concat(e)];
            if (void 0 !== u) return l(n, h(u, [0, 1], n.length), o);
            throw new Error('Invalid color scheme name: "'.concat(e, '".\n(Available schemes: ').concat(t.ColorScale.DiscreteSchemes, ')'));
          })(e, n, o)
        : l(e, n, o);
    },
  };
})(zm);
var Lm,
  Fm,
  Vm,
  Ym = {},
  Xm = {},
  Zm = {};
function Gm() {
  if (Lm) return Zm;
  (Lm = 1), Object.defineProperty(Zm, '__esModule', { value: !0 }), (Zm.Array2D = void 0);
  var t = qm();
  return (
    (Zm.Array2D = {
      get: function (t, e, n) {
        if (!(e < 0 || e >= t.nColumns || n < 0 || n >= t.nRows)) return t.values[t.nColumns * n + e];
      },
      empty: function () {
        return { nColumns: 0, nRows: 0, values: [], isNumeric: !0 };
      },
      create: function (e, n, r) {
        if (r.length !== e * n) throw new Error('ValueError: length of `values` must be nColumns * nRows');
        return { nColumns: e, nRows: n, values: r, isNumeric: (0, t.isNumericArray)(r) };
      },
      createRandom: function (t, e) {
        for (var n = t * e, r = new Float32Array(n), i = 0; i < n; i++) r[i] = Math.random();
        return { nColumns: t, nRows: e, values: r, isNumeric: !0 };
      },
      createDummy: function (t, e) {
        for (var n = t * e, r = new Float32Array(n), i = 0; i < n; i++) {
          var o = i % t,
            a = Math.floor(i / t),
            s = 0 === o || a === e - 1 ? 0 : o === t - 1 || 0 === a ? 1 : Math.random();
          r[i] = 0.5 * s + ((i % t) / t) * 0.5;
        }
        return { nColumns: t, nRows: e, values: r, isNumeric: !0 };
      },
      getRange: function (t) {
        for (var e = t.values, n = e.length, r = 1 / 0, i = -1 / 0, o = 0; o < n; o++) {
          var a = e[o];
          a < r && (r = a), a > i && (i = a);
        }
        return { min: r, max: i };
      },
      validateLength: function (t) {
        if (t.values.length !== t.nColumns * t.nRows) throw new Error('ValueError: length of data.values must be data.nColumns * data.nRows');
      },
    }),
    Zm
  );
}
function Km() {
  if (Fm) return Xm;
  (Fm = 1), Object.defineProperty(Xm, '__esModule', { value: !0 }), (Xm.DataDescription = void 0);
  var t = Um,
    e = Gm(),
    n = Wm();
  return (
    (Xm.DataDescription = {
      empty: function () {
        return {
          data: [],
          xDomain: [null],
          yDomain: [null],
          x: function () {
            return null;
          },
          y: function () {
            return null;
          },
        };
      },
      toArray2D: function (t) {
        for (
          var r = t.data,
            i = t.x,
            o = t.y,
            a = t.filter,
            s = n.Domain.create(t.xDomain),
            u = n.Domain.create(t.yDomain),
            c = s.values.length,
            l = u.values.length,
            f = new Array(c * l).fill(void 0),
            h =
              'function' == typeof i
                ? i
                : function (t, e) {
                    return i[e];
                  },
            d =
              'function' == typeof o
                ? o
                : function (t, e) {
                    return o[e];
                  },
            p = !1,
            v = !1,
            m = 0;
          m < r.length;
          m++
        ) {
          var g = r[m],
            y = h(g, m),
            b = d(g, m),
            _ = s.index.get(y),
            w = u.index.get(b);
          void 0 === _
            ? p || (console.warn('Some data items map to X values out of the X domain:', g, 'maps to X', y), (p = !0))
            : void 0 === w
            ? v || (console.warn('Some data items map to Y values out of the Y domain:', g, 'maps to Y', b), (v = !0))
            : (void 0 === a || a(g, y, b, _, w)) && (f[c * w + _] = g);
        }
        return { array2d: e.Array2D.create(c, l, f), xDomain: s, yDomain: u };
      },
      createRandom: function (n, r) {
        return {
          data: e.Array2D.createRandom(n, r).values,
          x: function (t, e) {
            return e % n;
          },
          y: function (t, e) {
            return Math.floor(e / n);
          },
          xDomain: (0, t.range)(n),
          yDomain: (0, t.range)(r),
        };
      },
      createDummy: function (n, r) {
        return {
          data: e.Array2D.createDummy(n, r).values,
          x: function (t, e) {
            return e % n;
          },
          y: function (t, e) {
            return Math.floor(e / n);
          },
          xDomain: (0, t.range)(n),
          yDomain: (0, t.range)(r),
        };
      },
    }),
    Xm
  );
}
var Jm,
  Qm,
  tg = {},
  eg = {},
  ng = {},
  rg = {};
function ig() {
  return (
    Jm ||
      ((Jm = 1),
      (function (t) {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.Image = void 0);
        var e = Ia;
        t.Image = {
          create: function (t, e) {
            return { nColumns: t, nRows: e, values: new Uint8ClampedArray(t * e * 4) };
          },
          clear: function (t) {
            t.values.fill(0);
          },
          getColor: function (t, n, r) {
            return e.Color.fromAragabaArray(t.values, 4 * (r * t.nColumns + n));
          },
          setColor: function (t, n, r, i) {
            return e.Color.toAragabaArray(i, t.values, 4 * (r * t.nColumns + n));
          },
          addColor: function (t, n, r, i) {
            return e.Color.addToAragabaArray(i, t.values, 4 * (r * t.nColumns + n));
          },
          addRect: function (n, r, i, o, a, s) {
            (r = Math.min(Math.max(r, 0), n.nColumns)),
              (o = Math.min(Math.max(o, 0), n.nColumns)),
              (i = Math.min(Math.max(i, 0), n.nRows)),
              (a = Math.min(Math.max(a, 0), n.nRows));
            for (var u = Math.floor(r), c = Math.floor(i), l = Math.ceil(o), f = Math.ceil(a), h = c; h < f; h++)
              for (var d = Math.min(h + 1, a) - Math.max(h, i), p = u; p < l; p++) {
                var v = Math.min(p + 1, o) - Math.max(p, r),
                  m = e.Color.scaleAlpha(s, v * d);
                t.Image.addColor(n, p, h, m);
              }
          },
          toImageData: function (t, n) {
            for (var r = 0, i = t.values.length; r < i; r += 4) {
              var o = e.Color.fromAragabaArray(t.values, r);
              e.Color.toRgbaArray(o, n.data, r);
            }
            return n;
          },
          validateLength: function (t) {
            if (t.values.length !== 4 * t.nColumns * t.nRows) throw new Error('ValueError: length of image.values must be 4 * image.nColumns * image.nRows');
          },
        };
      })(rg)),
    rg
  );
}
function og() {
  if (Qm) return ng;
  (Qm = 1), Object.defineProperty(ng, '__esModule', { value: !0 }), (ng.Downsampler = void 0);
  var t = Gm(),
    e = ig();
  function n(t) {
    return ''.concat(t.x, 'x').concat(t.y);
  }
  function r(t, e) {
    for (var n = 1; n < e && n < t; ) n = Math.min(2 * n, t);
    return n;
  }
  function i(t, e) {
    return t.downsampled[n(e)];
  }
  function o(t, e, r) {
    t.downsampled[n(e)] = r;
  }
  function a(n, r) {
    var u = i(n, r);
    if (u) return u;
    var c = (function (t, e) {
      if (t.x > e.x || t.y > e.y) throw new Error('ArgumentError: Cannot downsample to higher resolution than original');
      if (t.x === e.x && t.y === e.y) return;
      return t.x === e.x || (t.y !== e.y && t.x > t.y) ? { x: t.x, y: Math.min(2 * t.y, e.y) } : { x: Math.min(2 * t.x, e.x), y: t.y };
    })(r, { x: n.nColumns, y: n.nRows });
    if (!c || c.x > n.nColumns || c.y > n.nRows) throw new Error('AssertionError');
    var l,
      f,
      h,
      d = a(n, c),
      p =
        ((l = n.mode),
        (f = d),
        (h = r),
        'image' === l
          ? (function (t, n) {
              return t.nColumns === 2 * n.x && t.nRows === n.y
                ? (function (t) {
                    var n = 4,
                      r = t.nColumns,
                      i = t.nRows,
                      o = Math.floor(r / 2),
                      a = i;
                    e.Image.validateLength(t);
                    for (var s = new Uint8ClampedArray(a * o * n), u = 0; u < a; u++)
                      for (var c = 0; c < o; c++) {
                        var l = (u * r + 2 * c) * n,
                          f = (u * r + 2 * c + 1) * n,
                          h = (u * o + c) * n;
                        (s[h] = 0.5 * (t.values[l] + t.values[f])),
                          (s[h + 1] = 0.5 * (t.values[l + 1] + t.values[f + 1])),
                          (s[h + 2] = 0.5 * (t.values[l + 2] + t.values[f + 2])),
                          (s[h + 3] = 0.5 * (t.values[l + 3] + t.values[f + 3]));
                      }
                    var d = { nColumns: o, nRows: a, values: s };
                    return d;
                  })(t)
                : t.nColumns === n.x && t.nRows === 2 * n.y
                ? (function (t) {
                    var n = 4,
                      r = t.nColumns,
                      i = t.nRows,
                      o = r,
                      a = Math.floor(i / 2);
                    e.Image.validateLength(t);
                    for (var s = new Uint8ClampedArray(a * o * n), u = 0; u < a; u++)
                      for (var c = 0; c < o; c++) {
                        var l = (2 * u * r + c) * n,
                          f = ((2 * u + 1) * r + c) * n,
                          h = (u * o + c) * n;
                        (s[h] = 0.5 * (t.values[l] + t.values[f])),
                          (s[h + 1] = 0.5 * (t.values[l + 1] + t.values[f + 1])),
                          (s[h + 2] = 0.5 * (t.values[l + 2] + t.values[f + 2])),
                          (s[h + 3] = 0.5 * (t.values[l + 3] + t.values[f + 3]));
                      }
                    var d = { nColumns: o, nRows: a, values: s };
                    return d;
                  })(t)
                : (function (t, n) {
                    var r = 4,
                      i = t.nColumns,
                      o = t.nRows,
                      a = n.x,
                      u = n.y;
                    e.Image.validateLength(t);
                    for (var c = s(i, a), l = s(o, u), f = new Uint8ClampedArray(u * a * r), h = 0; h < l.from.length; h++)
                      for (var d = 0; d < c.from.length; d++) {
                        var p = (l.from[h] * i + c.from[d]) * r,
                          v = (l.to[h] * a + c.to[d]) * r,
                          m = l.weight[h] * c.weight[d],
                          g = t.values[p],
                          y = t.values[p + 1],
                          b = t.values[p + 2],
                          _ = t.values[p + 3];
                        (f[v] += g * m), (f[v + 1] += y * m), (f[v + 2] += b * m), (f[v + 3] += _ * m);
                      }
                    var w = { nColumns: a, nRows: u, values: f };
                    return w;
                  })(t, n);
            })(f, h)
          : (function (e, n) {
              return e.nColumns === 2 * n.x && e.nRows === n.y
                ? (function (e) {
                    var n = e.nColumns,
                      r = e.nRows,
                      i = Math.floor(n / 2),
                      o = r;
                    t.Array2D.validateLength(e);
                    for (var a = new Float32Array(i * o), s = 0; s < o; s++)
                      for (var u = 0; u < i; u++) {
                        var c = e.values[s * n + 2 * u],
                          l = e.values[s * n + 2 * u + 1];
                        if (void 0 === c || void 0 === l) throw new Error('NotImplementedError: undefined values in data');
                        var f = 0.5 * (c + l);
                        a[s * i + u] = f;
                      }
                    var h = { nColumns: i, nRows: o, values: a, isNumeric: !0 };
                    return h;
                  })(e)
                : e.nColumns === n.x && e.nRows === 2 * n.y
                ? (function (e) {
                    var n = e.nColumns,
                      r = e.nRows,
                      i = n,
                      o = Math.floor(r / 2);
                    t.Array2D.validateLength(e);
                    for (var a = new Float32Array(i * o), s = 0; s < o; s++)
                      for (var u = 0; u < i; u++) {
                        var c = e.values[2 * s * n + u],
                          l = e.values[(2 * s + 1) * n + u];
                        if (void 0 === c || void 0 === l) throw new Error('NotImplementedError: undefined values in data');
                        var f = 0.5 * (c + l);
                        a[s * i + u] = f;
                      }
                    var h = { nColumns: i, nRows: o, values: a, isNumeric: !0 };
                    return h;
                  })(e)
                : (function (e, n) {
                    var r = e.nColumns,
                      i = e.nRows,
                      o = n.x,
                      a = n.y;
                    t.Array2D.validateLength(e);
                    for (var u = s(r, o), c = s(i, a), l = new Float32Array(a * o), f = 0; f < c.from.length; f++)
                      for (var h = c.from[f] * r, d = c.to[f] * o, p = c.weight[f], v = 0; v < u.from.length; v++) {
                        var m = e.values[h + u.from[v]];
                        if (void 0 === m) throw new Error('NotImplementedError: undefined values in data');
                        l[d + u.to[v]] += m * p * u.weight[v];
                      }
                    var g = { nColumns: o, nRows: a, values: l, isNumeric: !0 };
                    return g;
                  })(e, n);
            })(f, h));
    return o(n, r, p), p;
  }
  function s(t, e) {
    for (var n = e / t, r = 0, i = 0, o = 0, a = [], s = [], u = []; o < e; ) {
      var c = n * (r + 1),
        l = i + 1;
      c <= l ? (a.push(r), s.push(i), u.push(c - o), (o = c), (r += 1), c === l && (i += 1)) : (a.push(r), s.push(i), u.push(l - o), (o = l), (i += 1));
    }
    return { from: a, to: s, weight: u };
  }
  return (
    (ng.Downsampler = {
      fromNumbers: function (t) {
        var e = { mode: 'number', nColumns: t.nColumns, nRows: t.nRows, downsampled: {} };
        return o(e, { x: t.nColumns, y: t.nRows }, t), e;
      },
      fromImage: function (t) {
        var e = { mode: 'image', nColumns: t.nColumns, nRows: t.nRows, downsampled: {} };
        return o(e, { x: t.nColumns, y: t.nRows }, t), e;
      },
      getOriginal: function (t) {
        return i(t, { x: t.nColumns, y: t.nRows });
      },
      getDownsampled: function (t, e) {
        return a(t, { x: r(t.nColumns, e.x), y: r(t.nRows, e.y) });
      },
    }),
    ng
  );
}
var ag,
  sg = {};
function ug() {
  if (ag) return sg;
  (ag = 1), Object.defineProperty(sg, '__esModule', { value: !0 }), (sg.Extension = sg.BehaviorBase = void 0);
  var t = qm(),
    e = (function () {
      function e(t, e) {
        (this.state = t), (this.params = e), (this.subscriptions = []);
      }
      return (
        (e.prototype.register = function () {}),
        (e.prototype.update = function (e) {
          this.params = (0, t.shallowMerge)(this.params, e);
        }),
        (e.prototype.unregister = function () {
          this.unsubscribeAll();
        }),
        (e.prototype.subscribe = function (e, n) {
          var r = this,
            i = e.subscribe(n);
          this.subscriptions.push(i);
          return {
            unsubscribe: function () {
              (0, t.removeElement)(r.subscriptions, i), i.unsubscribe();
            },
          };
        }),
        (e.prototype.unsubscribeAll = function () {
          for (var t = 0, e = this.subscriptions; t < e.length; t++) {
            e[t].unsubscribe();
          }
          this.subscriptions.length = 0;
        }),
        e
      );
    })();
  return (
    (sg.BehaviorBase = e),
    (sg.Extension = {
      fromBehaviorClass: function (e) {
        return {
          name: e.name,
          defaultParams: e.defaultParams,
          create: function (n, r) {
            return new e.behavior(n, (0, t.shallowMerge)(e.defaultParams, r));
          },
        };
      },
    }),
    sg
  );
}
var cg = {};
Object.defineProperty(cg, '__esModule', { value: !0 });
var lg = (cg.Box = void 0);
cg.Scales = function (t) {
  return { worldToCanvas: { x: mg(t.visWorld, t.canvas), y: gg(t.visWorld, t.canvas) }, canvasToWorld: { x: mg(t.canvas, t.visWorld), y: gg(t.canvas, t.visWorld) } };
};
var fg,
  hg = (cg.scaleDistance = function (t, e) {
    if (t.clamp()) throw new Error('NotImplementedError: this function is not implemented for clamping scales');
    return t(e) - t(0);
  }),
  dg = Um,
  pg = Ra.__importStar(Pm());
function vg(t, e, n) {
  void 0 === n && (n = 0);
  var r = t[0],
    i = t[1],
    o = e[0],
    a = e[1];
  if (i - r >= n) return [r, i];
  var s = 0.5 * (r + i);
  return s < o + 0.5 * n ? [o, Math.min(o + n, a)] : s > a - 0.5 * n ? [Math.max(a - n, o), a] : [s - 0.5 * n, s + 0.5 * n];
}
function mg(t, e) {
  return pg.scaleLinear([t.xmin, t.xmax], [e.xmin, e.xmax]).clamp(!1);
}
function gg(t, e) {
  return pg.scaleLinear([t.ymin, t.ymax], [e.ymin, e.ymax]).clamp(!1);
}
lg = cg.Box = {
  create: function (t, e, n, r) {
    return { xmin: t, ymin: e, xmax: n, ymax: r };
  },
  width: function (t) {
    return t.xmax - t.xmin;
  },
  height: function (t) {
    return t.ymax - t.ymin;
  },
  containsPoint: function (t, e) {
    return e.x >= t.xmin && e.x <= t.xmax && e.y >= t.ymin && e.y <= t.ymax;
  },
  clamp: function (t, e, n) {
    var r = {
      xmin: isNaN(t.xmin) ? e.xmin : (0, dg.clamp)(t.xmin, e.xmin, e.xmax),
      xmax: isNaN(t.xmax) ? e.xmax : (0, dg.clamp)(t.xmax, e.xmin, e.xmax),
      ymin: isNaN(t.ymin) ? e.ymin : (0, dg.clamp)(t.ymin, e.ymin, e.ymax),
      ymax: isNaN(t.ymax) ? e.ymax : (0, dg.clamp)(t.ymax, e.ymin, e.ymax),
    };
    return void 0 === n
      ? r
      : (function (t, e, n) {
          var r = vg([t.xmin, t.xmax], [e.xmin, e.xmax], n.width),
            i = r[0],
            o = r[1],
            a = vg([t.ymin, t.ymax], [e.ymin, e.ymax], n.height),
            s = a[0],
            u = a[1];
          return { xmin: i, xmax: o, ymin: s, ymax: u };
        })(r, e, n);
  },
};
var yg = {},
  bg = {};
Object.defineProperty(bg, '__esModule', { value: !0 });
var _g,
  wg = (bg.Class = void 0);
wg = bg.Class = {
  MainDiv: 'heatmap-main-div',
  CanvasDiv: 'heatmap-canvas-div',
  Canvas: 'heatmap-canvas',
  Svg: 'heatmap-svg',
  Marker: 'heatmap-marker',
  MarkerX: 'heatmap-marker-x',
  MarkerY: 'heatmap-marker-y',
  TooltipBox: 'heatmap-tooltip-box',
  TooltipContent: 'heatmap-tooltip-content',
  PinnedTooltipBox: 'heatmap-pinned-tooltip-box',
  PinnedTooltipContent: 'heatmap-pinned-tooltip-content',
  PinnedTooltipPin: 'heatmap-pinned-tooltip-pin',
  PinnedTooltipClose: 'heatmap-pinned-tooltip-close',
  Overlay: 'heatmap-overlay',
  OverlayShade: 'heatmap-overlay-shade',
  OverlayMessage: 'heatmap-overlay-message',
};
var xg,
  Ag = {};
var Mg = {},
  $g = {};
function Eg(t) {
  return 'function' == typeof t;
}
function Sg(t) {
  var e = t(function (t) {
    Error.call(t), (t.stack = new Error().stack);
  });
  return (e.prototype = Object.create(Error.prototype)), (e.prototype.constructor = e), e;
}
var Cg = Sg(function (t) {
  return function (e) {
    t(this),
      (this.message = e
        ? e.length +
          ' errors occurred during unsubscription:\n' +
          e
            .map(function (t, e) {
              return e + 1 + ') ' + t.toString();
            })
            .join('\n  ')
        : ''),
      (this.name = 'UnsubscriptionError'),
      (this.errors = e);
  };
});
function kg(t, e) {
  if (t) {
    var n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var Tg = (function () {
    function t(t) {
      (this.initialTeardown = t), (this.closed = !1), (this._parentage = null), (this._finalizers = null);
    }
    return (
      (t.prototype.unsubscribe = function () {
        var t, e, n, r, i;
        if (!this.closed) {
          this.closed = !0;
          var o = this._parentage;
          if (o)
            if (((this._parentage = null), Array.isArray(o)))
              try {
                for (var a = f(o), s = a.next(); !s.done; s = a.next()) {
                  s.value.remove(this);
                }
              } catch (e) {
                t = { error: e };
              } finally {
                try {
                  s && !s.done && (e = a.return) && e.call(a);
                } finally {
                  if (t) throw t.error;
                }
              }
            else o.remove(this);
          var u = this.initialTeardown;
          if (Eg(u))
            try {
              u();
            } catch (t) {
              i = t instanceof Cg ? t.errors : [t];
            }
          var c = this._finalizers;
          if (c) {
            this._finalizers = null;
            try {
              for (var l = f(c), d = l.next(); !d.done; d = l.next()) {
                var p = d.value;
                try {
                  Dg(p);
                } catch (t) {
                  (i = null != i ? i : []), t instanceof Cg ? (i = v(v([], h(i)), h(t.errors))) : i.push(t);
                }
              }
            } catch (t) {
              n = { error: t };
            } finally {
              try {
                d && !d.done && (r = l.return) && r.call(l);
              } finally {
                if (n) throw n.error;
              }
            }
          }
          if (i) throw new Cg(i);
        }
      }),
      (t.prototype.add = function (e) {
        var n;
        if (e && e !== this)
          if (this.closed) Dg(e);
          else {
            if (e instanceof t) {
              if (e.closed || e._hasParent(this)) return;
              e._addParent(this);
            }
            (this._finalizers = null !== (n = this._finalizers) && void 0 !== n ? n : []).push(e);
          }
      }),
      (t.prototype._hasParent = function (t) {
        var e = this._parentage;
        return e === t || (Array.isArray(e) && e.includes(t));
      }),
      (t.prototype._addParent = function (t) {
        var e = this._parentage;
        this._parentage = Array.isArray(e) ? (e.push(t), e) : e ? [e, t] : t;
      }),
      (t.prototype._removeParent = function (t) {
        var e = this._parentage;
        e === t ? (this._parentage = null) : Array.isArray(e) && kg(e, t);
      }),
      (t.prototype.remove = function (e) {
        var n = this._finalizers;
        n && kg(n, e), e instanceof t && e._removeParent(this);
      }),
      (t.EMPTY = (function () {
        var e = new t();
        return (e.closed = !0), e;
      })()),
      t
    );
  })(),
  Ng = Tg.EMPTY;
function Pg(t) {
  return t instanceof Tg || (t && 'closed' in t && Eg(t.remove) && Eg(t.add) && Eg(t.unsubscribe));
}
function Dg(t) {
  Eg(t) ? t() : t.unsubscribe();
}
var Og = { onUnhandledError: null, onStoppedNotification: null, Promise: void 0, useDeprecatedSynchronousErrorHandling: !1, useDeprecatedNextContext: !1 },
  zg = {
    setTimeout: function (t, e) {
      for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
      return setTimeout.apply(void 0, v([t, e], h(n)));
    },
    clearTimeout: function (t) {
      var e = zg.delegate;
      return ((null == e ? void 0 : e.clearTimeout) || clearTimeout)(t);
    },
    delegate: void 0,
  };
function Rg(t) {
  zg.setTimeout(function () {
    var e = Og.onUnhandledError;
    if (!e) throw t;
    e(t);
  });
}
function Ig() {}
var jg = Ug('C', void 0, void 0);
function Ug(t, e, n) {
  return { kind: t, value: e, error: n };
}
var Bg = null;
function Hg(t) {
  if (Og.useDeprecatedSynchronousErrorHandling) {
    var e = !Bg;
    if ((e && (Bg = { errorThrown: !1, error: null }), t(), e)) {
      var n = Bg,
        r = n.errorThrown,
        i = n.error;
      if (((Bg = null), r)) throw i;
    }
  } else t();
}
var qg = (function (t) {
    function n(e) {
      var n = t.call(this) || this;
      return (n.isStopped = !1), e ? ((n.destination = e), Pg(e) && e.add(n)) : (n.destination = Zg), n;
    }
    return (
      e(n, t),
      (n.create = function (t, e, n) {
        return new Vg(t, e, n);
      }),
      (n.prototype.next = function (t) {
        this.isStopped
          ? Xg(
              (function (t) {
                return Ug('N', t, void 0);
              })(t),
              this
            )
          : this._next(t);
      }),
      (n.prototype.error = function (t) {
        this.isStopped ? Xg(Ug('E', void 0, t), this) : ((this.isStopped = !0), this._error(t));
      }),
      (n.prototype.complete = function () {
        this.isStopped ? Xg(jg, this) : ((this.isStopped = !0), this._complete());
      }),
      (n.prototype.unsubscribe = function () {
        this.closed || ((this.isStopped = !0), t.prototype.unsubscribe.call(this), (this.destination = null));
      }),
      (n.prototype._next = function (t) {
        this.destination.next(t);
      }),
      (n.prototype._error = function (t) {
        try {
          this.destination.error(t);
        } finally {
          this.unsubscribe();
        }
      }),
      (n.prototype._complete = function () {
        try {
          this.destination.complete();
        } finally {
          this.unsubscribe();
        }
      }),
      n
    );
  })(Tg),
  Wg = Function.prototype.bind;
function Lg(t, e) {
  return Wg.call(t, e);
}
var Fg = (function () {
    function t(t) {
      this.partialObserver = t;
    }
    return (
      (t.prototype.next = function (t) {
        var e = this.partialObserver;
        if (e.next)
          try {
            e.next(t);
          } catch (t) {
            Yg(t);
          }
      }),
      (t.prototype.error = function (t) {
        var e = this.partialObserver;
        if (e.error)
          try {
            e.error(t);
          } catch (t) {
            Yg(t);
          }
        else Yg(t);
      }),
      (t.prototype.complete = function () {
        var t = this.partialObserver;
        if (t.complete)
          try {
            t.complete();
          } catch (t) {
            Yg(t);
          }
      }),
      t
    );
  })(),
  Vg = (function (t) {
    function n(e, n, r) {
      var i,
        o,
        a = t.call(this) || this;
      Eg(e) || !e
        ? (i = { next: null != e ? e : void 0, error: null != n ? n : void 0, complete: null != r ? r : void 0 })
        : a && Og.useDeprecatedNextContext
        ? (((o = Object.create(e)).unsubscribe = function () {
            return a.unsubscribe();
          }),
          (i = { next: e.next && Lg(e.next, o), error: e.error && Lg(e.error, o), complete: e.complete && Lg(e.complete, o) }))
        : (i = e);
      return (a.destination = new Fg(i)), a;
    }
    return e(n, t), n;
  })(qg);
function Yg(t) {
  var e;
  Og.useDeprecatedSynchronousErrorHandling ? ((e = t), Og.useDeprecatedSynchronousErrorHandling && Bg && ((Bg.errorThrown = !0), (Bg.error = e))) : Rg(t);
}
function Xg(t, e) {
  var n = Og.onStoppedNotification;
  n &&
    zg.setTimeout(function () {
      return n(t, e);
    });
}
var Zg = {
    closed: !0,
    next: Ig,
    error: function (t) {
      throw t;
    },
    complete: Ig,
  },
  Gg = ('function' == typeof Symbol && Symbol.observable) || '@@observable';
function Kg(t) {
  return t;
}
function Jg() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  return Qg(t);
}
function Qg(t) {
  return 0 === t.length
    ? Kg
    : 1 === t.length
    ? t[0]
    : function (e) {
        return t.reduce(function (t, e) {
          return e(t);
        }, e);
      };
}
var ty = (function () {
  function t(t) {
    t && (this._subscribe = t);
  }
  return (
    (t.prototype.lift = function (e) {
      var n = new t();
      return (n.source = this), (n.operator = e), n;
    }),
    (t.prototype.subscribe = function (t, e, n) {
      var r,
        i = this,
        o =
          ((r = t) && r instanceof qg) ||
          ((function (t) {
            return t && Eg(t.next) && Eg(t.error) && Eg(t.complete);
          })(r) &&
            Pg(r))
            ? t
            : new Vg(t, e, n);
      return (
        Hg(function () {
          var t = i,
            e = t.operator,
            n = t.source;
          o.add(e ? e.call(o, n) : n ? i._subscribe(o) : i._trySubscribe(o));
        }),
        o
      );
    }),
    (t.prototype._trySubscribe = function (t) {
      try {
        return this._subscribe(t);
      } catch (e) {
        t.error(e);
      }
    }),
    (t.prototype.forEach = function (t, e) {
      var n = this;
      return new (e = ey(e))(function (e, r) {
        var i = new Vg({
          next: function (e) {
            try {
              t(e);
            } catch (t) {
              r(t), i.unsubscribe();
            }
          },
          error: r,
          complete: e,
        });
        n.subscribe(i);
      });
    }),
    (t.prototype._subscribe = function (t) {
      var e;
      return null === (e = this.source) || void 0 === e ? void 0 : e.subscribe(t);
    }),
    (t.prototype[Gg] = function () {
      return this;
    }),
    (t.prototype.pipe = function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return Qg(t)(this);
    }),
    (t.prototype.toPromise = function (t) {
      var e = this;
      return new (t = ey(t))(function (t, n) {
        var r;
        e.subscribe(
          function (t) {
            return (r = t);
          },
          function (t) {
            return n(t);
          },
          function () {
            return t(r);
          }
        );
      });
    }),
    (t.create = function (e) {
      return new t(e);
    }),
    t
  );
})();
function ey(t) {
  var e;
  return null !== (e = null != t ? t : Og.Promise) && void 0 !== e ? e : Promise;
}
function ny(t) {
  return Eg(null == t ? void 0 : t.lift);
}
function ry(t) {
  return function (e) {
    if (ny(e))
      return e.lift(function (e) {
        try {
          return t(e, this);
        } catch (t) {
          this.error(t);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function iy(t, e, n, r, i) {
  return new oy(t, e, n, r, i);
}
var oy = (function (t) {
  function n(e, n, r, i, o, a) {
    var s = t.call(this, e) || this;
    return (
      (s.onFinalize = o),
      (s.shouldUnsubscribe = a),
      (s._next = n
        ? function (t) {
            try {
              n(t);
            } catch (t) {
              e.error(t);
            }
          }
        : t.prototype._next),
      (s._error = i
        ? function (t) {
            try {
              i(t);
            } catch (t) {
              e.error(t);
            } finally {
              this.unsubscribe();
            }
          }
        : t.prototype._error),
      (s._complete = r
        ? function () {
            try {
              r();
            } catch (t) {
              e.error(t);
            } finally {
              this.unsubscribe();
            }
          }
        : t.prototype._complete),
      s
    );
  }
  return (
    e(n, t),
    (n.prototype.unsubscribe = function () {
      var e;
      if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        var n = this.closed;
        t.prototype.unsubscribe.call(this), !n && (null === (e = this.onFinalize) || void 0 === e || e.call(this));
      }
    }),
    n
  );
})(qg);
function ay() {
  return ry(function (t, e) {
    var n = null;
    t._refCount++;
    var r = iy(e, void 0, void 0, void 0, function () {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) n = null;
      else {
        var r = t._connection,
          i = n;
        (n = null), !r || (i && r !== i) || r.unsubscribe(), e.unsubscribe();
      }
    });
    t.subscribe(r), r.closed || (n = t.connect());
  });
}
var sy = (function (t) {
    function n(e, n) {
      var r = t.call(this) || this;
      return (r.source = e), (r.subjectFactory = n), (r._subject = null), (r._refCount = 0), (r._connection = null), ny(e) && (r.lift = e.lift), r;
    }
    return (
      e(n, t),
      (n.prototype._subscribe = function (t) {
        return this.getSubject().subscribe(t);
      }),
      (n.prototype.getSubject = function () {
        var t = this._subject;
        return (t && !t.isStopped) || (this._subject = this.subjectFactory()), this._subject;
      }),
      (n.prototype._teardown = function () {
        this._refCount = 0;
        var t = this._connection;
        (this._subject = this._connection = null), null == t || t.unsubscribe();
      }),
      (n.prototype.connect = function () {
        var t = this,
          e = this._connection;
        if (!e) {
          e = this._connection = new Tg();
          var n = this.getSubject();
          e.add(
            this.source.subscribe(
              iy(
                n,
                void 0,
                function () {
                  t._teardown(), n.complete();
                },
                function (e) {
                  t._teardown(), n.error(e);
                },
                function () {
                  return t._teardown();
                }
              )
            )
          ),
            e.closed && ((this._connection = null), (e = Tg.EMPTY));
        }
        return e;
      }),
      (n.prototype.refCount = function () {
        return ay()(this);
      }),
      n
    );
  })(ty),
  uy = {
    now: function () {
      return (uy.delegate || performance).now();
    },
    delegate: void 0,
  },
  cy = {
    schedule: function (t) {
      var e = requestAnimationFrame,
        n = cancelAnimationFrame,
        r = cy.delegate;
      r && ((e = r.requestAnimationFrame), (n = r.cancelAnimationFrame));
      var i = e(function (e) {
        (n = void 0), t(e);
      });
      return new Tg(function () {
        return null == n ? void 0 : n(i);
      });
    },
    requestAnimationFrame: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return requestAnimationFrame.apply(void 0, v([], h(t)));
    },
    cancelAnimationFrame: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      var n = cy.delegate;
      return ((null == n ? void 0 : n.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, v([], h(t)));
    },
    delegate: void 0,
  };
function ly(t) {
  return new ty(function (e) {
    var n = t || uy,
      r = n.now(),
      i = 0,
      o = function () {
        e.closed ||
          (i = cy.requestAnimationFrame(function (a) {
            i = 0;
            var s = n.now();
            e.next({ timestamp: t ? s : a, elapsed: s - r }), o();
          }));
      };
    return (
      o(),
      function () {
        i && cy.cancelAnimationFrame(i);
      }
    );
  });
}
var fy,
  hy = ly(),
  dy = Sg(function (t) {
    return function () {
      t(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed');
    };
  }),
  py = (function (t) {
    function n() {
      var e = t.call(this) || this;
      return (e.closed = !1), (e.currentObservers = null), (e.observers = []), (e.isStopped = !1), (e.hasError = !1), (e.thrownError = null), e;
    }
    return (
      e(n, t),
      (n.prototype.lift = function (t) {
        var e = new vy(this, this);
        return (e.operator = t), e;
      }),
      (n.prototype._throwIfClosed = function () {
        if (this.closed) throw new dy();
      }),
      (n.prototype.next = function (t) {
        var e = this;
        Hg(function () {
          var n, r;
          if ((e._throwIfClosed(), !e.isStopped)) {
            e.currentObservers || (e.currentObservers = Array.from(e.observers));
            try {
              for (var i = f(e.currentObservers), o = i.next(); !o.done; o = i.next()) {
                o.value.next(t);
              }
            } catch (t) {
              n = { error: t };
            } finally {
              try {
                o && !o.done && (r = i.return) && r.call(i);
              } finally {
                if (n) throw n.error;
              }
            }
          }
        });
      }),
      (n.prototype.error = function (t) {
        var e = this;
        Hg(function () {
          if ((e._throwIfClosed(), !e.isStopped)) {
            (e.hasError = e.isStopped = !0), (e.thrownError = t);
            for (var n = e.observers; n.length; ) n.shift().error(t);
          }
        });
      }),
      (n.prototype.complete = function () {
        var t = this;
        Hg(function () {
          if ((t._throwIfClosed(), !t.isStopped)) {
            t.isStopped = !0;
            for (var e = t.observers; e.length; ) e.shift().complete();
          }
        });
      }),
      (n.prototype.unsubscribe = function () {
        (this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
      }),
      Object.defineProperty(n.prototype, 'observed', {
        get: function () {
          var t;
          return (null === (t = this.observers) || void 0 === t ? void 0 : t.length) > 0;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (n.prototype._trySubscribe = function (e) {
        return this._throwIfClosed(), t.prototype._trySubscribe.call(this, e);
      }),
      (n.prototype._subscribe = function (t) {
        return this._throwIfClosed(), this._checkFinalizedStatuses(t), this._innerSubscribe(t);
      }),
      (n.prototype._innerSubscribe = function (t) {
        var e = this,
          n = this,
          r = n.hasError,
          i = n.isStopped,
          o = n.observers;
        return r || i
          ? Ng
          : ((this.currentObservers = null),
            o.push(t),
            new Tg(function () {
              (e.currentObservers = null), kg(o, t);
            }));
      }),
      (n.prototype._checkFinalizedStatuses = function (t) {
        var e = this,
          n = e.hasError,
          r = e.thrownError,
          i = e.isStopped;
        n ? t.error(r) : i && t.complete();
      }),
      (n.prototype.asObservable = function () {
        var t = new ty();
        return (t.source = this), t;
      }),
      (n.create = function (t, e) {
        return new vy(t, e);
      }),
      n
    );
  })(ty),
  vy = (function (t) {
    function n(e, n) {
      var r = t.call(this) || this;
      return (r.destination = e), (r.source = n), r;
    }
    return (
      e(n, t),
      (n.prototype.next = function (t) {
        var e, n;
        null === (n = null === (e = this.destination) || void 0 === e ? void 0 : e.next) || void 0 === n || n.call(e, t);
      }),
      (n.prototype.error = function (t) {
        var e, n;
        null === (n = null === (e = this.destination) || void 0 === e ? void 0 : e.error) || void 0 === n || n.call(e, t);
      }),
      (n.prototype.complete = function () {
        var t, e;
        null === (e = null === (t = this.destination) || void 0 === t ? void 0 : t.complete) || void 0 === e || e.call(t);
      }),
      (n.prototype._subscribe = function (t) {
        var e, n;
        return null !== (n = null === (e = this.source) || void 0 === e ? void 0 : e.subscribe(t)) && void 0 !== n ? n : Ng;
      }),
      n
    );
  })(py),
  my = (function (t) {
    function n(e) {
      var n = t.call(this) || this;
      return (n._value = e), n;
    }
    return (
      e(n, t),
      Object.defineProperty(n.prototype, 'value', {
        get: function () {
          return this.getValue();
        },
        enumerable: !1,
        configurable: !0,
      }),
      (n.prototype._subscribe = function (e) {
        var n = t.prototype._subscribe.call(this, e);
        return !n.closed && e.next(this._value), n;
      }),
      (n.prototype.getValue = function () {
        var t = this,
          e = t.hasError,
          n = t.thrownError,
          r = t._value;
        if (e) throw n;
        return this._throwIfClosed(), r;
      }),
      (n.prototype.next = function (e) {
        t.prototype.next.call(this, (this._value = e));
      }),
      n
    );
  })(py),
  gy = {
    now: function () {
      return (gy.delegate || Date).now();
    },
    delegate: void 0,
  },
  yy = (function (t) {
    function n(e, n, r) {
      void 0 === e && (e = 1 / 0), void 0 === n && (n = 1 / 0), void 0 === r && (r = gy);
      var i = t.call(this) || this;
      return (
        (i._bufferSize = e),
        (i._windowTime = n),
        (i._timestampProvider = r),
        (i._buffer = []),
        (i._infiniteTimeWindow = !0),
        (i._infiniteTimeWindow = n === 1 / 0),
        (i._bufferSize = Math.max(1, e)),
        (i._windowTime = Math.max(1, n)),
        i
      );
    }
    return (
      e(n, t),
      (n.prototype.next = function (e) {
        var n = this,
          r = n.isStopped,
          i = n._buffer,
          o = n._infiniteTimeWindow,
          a = n._timestampProvider,
          s = n._windowTime;
        r || (i.push(e), !o && i.push(a.now() + s)), this._trimBuffer(), t.prototype.next.call(this, e);
      }),
      (n.prototype._subscribe = function (t) {
        this._throwIfClosed(), this._trimBuffer();
        for (var e = this._innerSubscribe(t), n = this._infiniteTimeWindow, r = this._buffer.slice(), i = 0; i < r.length && !t.closed; i += n ? 1 : 2) t.next(r[i]);
        return this._checkFinalizedStatuses(t), e;
      }),
      (n.prototype._trimBuffer = function () {
        var t = this,
          e = t._bufferSize,
          n = t._timestampProvider,
          r = t._buffer,
          i = t._infiniteTimeWindow,
          o = (i ? 1 : 2) * e;
        if ((e < 1 / 0 && o < r.length && r.splice(0, r.length - o), !i)) {
          for (var a = n.now(), s = 0, u = 1; u < r.length && r[u] <= a; u += 2) s = u;
          s && r.splice(0, s + 1);
        }
      }),
      n
    );
  })(py),
  by = (function (t) {
    function n() {
      var e = (null !== t && t.apply(this, arguments)) || this;
      return (e._value = null), (e._hasValue = !1), (e._isComplete = !1), e;
    }
    return (
      e(n, t),
      (n.prototype._checkFinalizedStatuses = function (t) {
        var e = this,
          n = e.hasError,
          r = e._hasValue,
          i = e._value,
          o = e.thrownError,
          a = e.isStopped,
          s = e._isComplete;
        n ? t.error(o) : (a || s) && (r && t.next(i), t.complete());
      }),
      (n.prototype.next = function (t) {
        this.isStopped || ((this._value = t), (this._hasValue = !0));
      }),
      (n.prototype.complete = function () {
        var e = this,
          n = e._hasValue,
          r = e._value;
        e._isComplete || ((this._isComplete = !0), n && t.prototype.next.call(this, r), t.prototype.complete.call(this));
      }),
      n
    );
  })(py),
  _y = (function (t) {
    function n(e, n) {
      return t.call(this) || this;
    }
    return (
      e(n, t),
      (n.prototype.schedule = function (t, e) {
        return this;
      }),
      n
    );
  })(Tg),
  wy = {
    setInterval: function (t, e) {
      for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
      return setInterval.apply(void 0, v([t, e], h(n)));
    },
    clearInterval: function (t) {
      var e = wy.delegate;
      return ((null == e ? void 0 : e.clearInterval) || clearInterval)(t);
    },
    delegate: void 0,
  },
  xy = (function (t) {
    function n(e, n) {
      var r = t.call(this, e, n) || this;
      return (r.scheduler = e), (r.work = n), (r.pending = !1), r;
    }
    return (
      e(n, t),
      (n.prototype.schedule = function (t, e) {
        var n;
        if ((void 0 === e && (e = 0), this.closed)) return this;
        this.state = t;
        var r = this.id,
          i = this.scheduler;
        return (
          null != r && (this.id = this.recycleAsyncId(i, r, e)),
          (this.pending = !0),
          (this.delay = e),
          (this.id = null !== (n = this.id) && void 0 !== n ? n : this.requestAsyncId(i, this.id, e)),
          this
        );
      }),
      (n.prototype.requestAsyncId = function (t, e, n) {
        return void 0 === n && (n = 0), wy.setInterval(t.flush.bind(t, this), n);
      }),
      (n.prototype.recycleAsyncId = function (t, e, n) {
        if ((void 0 === n && (n = 0), null != n && this.delay === n && !1 === this.pending)) return e;
        null != e && wy.clearInterval(e);
      }),
      (n.prototype.execute = function (t, e) {
        if (this.closed) return new Error('executing a cancelled action');
        this.pending = !1;
        var n = this._execute(t, e);
        if (n) return n;
        !1 === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
      }),
      (n.prototype._execute = function (t, e) {
        var n,
          r = !1;
        try {
          this.work(t);
        } catch (t) {
          (r = !0), (n = t || new Error('Scheduled action threw falsy error'));
        }
        if (r) return this.unsubscribe(), n;
      }),
      (n.prototype.unsubscribe = function () {
        if (!this.closed) {
          var e = this.id,
            n = this.scheduler,
            r = n.actions;
          (this.work = this.state = this.scheduler = null),
            (this.pending = !1),
            kg(r, this),
            null != e && (this.id = this.recycleAsyncId(n, e, null)),
            (this.delay = null),
            t.prototype.unsubscribe.call(this);
        }
      }),
      n
    );
  })(_y),
  Ay = 1,
  My = {};
function $y(t) {
  return t in My && (delete My[t], !0);
}
var Ey = function (t) {
    var e = Ay++;
    return (
      (My[e] = !0),
      fy || (fy = Promise.resolve()),
      fy.then(function () {
        return $y(e) && t();
      }),
      e
    );
  },
  Sy = function (t) {
    $y(t);
  },
  Cy = {
    setImmediate: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return Ey.apply(void 0, v([], h(t)));
    },
    clearImmediate: function (t) {
      var e = Cy.delegate;
      return ((null == e ? void 0 : e.clearImmediate) || Sy)(t);
    },
    delegate: void 0,
  },
  ky = (function (t) {
    function n(e, n) {
      var r = t.call(this, e, n) || this;
      return (r.scheduler = e), (r.work = n), r;
    }
    return (
      e(n, t),
      (n.prototype.requestAsyncId = function (e, n, r) {
        return (
          void 0 === r && (r = 0),
          null !== r && r > 0
            ? t.prototype.requestAsyncId.call(this, e, n, r)
            : (e.actions.push(this), e._scheduled || (e._scheduled = Cy.setImmediate(e.flush.bind(e, void 0))))
        );
      }),
      (n.prototype.recycleAsyncId = function (e, n, r) {
        var i;
        if ((void 0 === r && (r = 0), null != r ? r > 0 : this.delay > 0)) return t.prototype.recycleAsyncId.call(this, e, n, r);
        var o = e.actions;
        null != n && (null === (i = o[o.length - 1]) || void 0 === i ? void 0 : i.id) !== n && (Cy.clearImmediate(n), e._scheduled === n && (e._scheduled = void 0));
      }),
      n
    );
  })(xy),
  Ty = (function () {
    function t(e, n) {
      void 0 === n && (n = t.now), (this.schedulerActionCtor = e), (this.now = n);
    }
    return (
      (t.prototype.schedule = function (t, e, n) {
        return void 0 === e && (e = 0), new this.schedulerActionCtor(this, t).schedule(n, e);
      }),
      (t.now = gy.now),
      t
    );
  })(),
  Ny = (function (t) {
    function n(e, n) {
      void 0 === n && (n = Ty.now);
      var r = t.call(this, e, n) || this;
      return (r.actions = []), (r._active = !1), r;
    }
    return (
      e(n, t),
      (n.prototype.flush = function (t) {
        var e = this.actions;
        if (this._active) e.push(t);
        else {
          var n;
          this._active = !0;
          do {
            if ((n = t.execute(t.state, t.delay))) break;
          } while ((t = e.shift()));
          if (((this._active = !1), n)) {
            for (; (t = e.shift()); ) t.unsubscribe();
            throw n;
          }
        }
      }),
      n
    );
  })(Ty),
  Py = new ((function (t) {
    function n() {
      return (null !== t && t.apply(this, arguments)) || this;
    }
    return (
      e(n, t),
      (n.prototype.flush = function (t) {
        this._active = !0;
        var e = this._scheduled;
        this._scheduled = void 0;
        var n,
          r = this.actions;
        t = t || r.shift();
        do {
          if ((n = t.execute(t.state, t.delay))) break;
        } while ((t = r[0]) && t.id === e && r.shift());
        if (((this._active = !1), n)) {
          for (; (t = r[0]) && t.id === e && r.shift(); ) t.unsubscribe();
          throw n;
        }
      }),
      n
    );
  })(Ny))(ky),
  Dy = Py,
  Oy = new Ny(xy),
  zy = Oy,
  Ry = (function (t) {
    function n(e, n) {
      var r = t.call(this, e, n) || this;
      return (r.scheduler = e), (r.work = n), r;
    }
    return (
      e(n, t),
      (n.prototype.schedule = function (e, n) {
        return void 0 === n && (n = 0), n > 0 ? t.prototype.schedule.call(this, e, n) : ((this.delay = n), (this.state = e), this.scheduler.flush(this), this);
      }),
      (n.prototype.execute = function (e, n) {
        return n > 0 || this.closed ? t.prototype.execute.call(this, e, n) : this._execute(e, n);
      }),
      (n.prototype.requestAsyncId = function (e, n, r) {
        return void 0 === r && (r = 0), (null != r && r > 0) || (null == r && this.delay > 0) ? t.prototype.requestAsyncId.call(this, e, n, r) : (e.flush(this), 0);
      }),
      n
    );
  })(xy),
  Iy = new ((function (t) {
    function n() {
      return (null !== t && t.apply(this, arguments)) || this;
    }
    return e(n, t), n;
  })(Ny))(Ry),
  jy = Iy,
  Uy = (function (t) {
    function n(e, n) {
      var r = t.call(this, e, n) || this;
      return (r.scheduler = e), (r.work = n), r;
    }
    return (
      e(n, t),
      (n.prototype.requestAsyncId = function (e, n, r) {
        return (
          void 0 === r && (r = 0),
          null !== r && r > 0
            ? t.prototype.requestAsyncId.call(this, e, n, r)
            : (e.actions.push(this),
              e._scheduled ||
                (e._scheduled = cy.requestAnimationFrame(function () {
                  return e.flush(void 0);
                })))
        );
      }),
      (n.prototype.recycleAsyncId = function (e, n, r) {
        var i;
        if ((void 0 === r && (r = 0), null != r ? r > 0 : this.delay > 0)) return t.prototype.recycleAsyncId.call(this, e, n, r);
        var o = e.actions;
        null != n && (null === (i = o[o.length - 1]) || void 0 === i ? void 0 : i.id) !== n && (cy.cancelAnimationFrame(n), (e._scheduled = void 0));
      }),
      n
    );
  })(xy),
  By = new ((function (t) {
    function n() {
      return (null !== t && t.apply(this, arguments)) || this;
    }
    return (
      e(n, t),
      (n.prototype.flush = function (t) {
        this._active = !0;
        var e = this._scheduled;
        this._scheduled = void 0;
        var n,
          r = this.actions;
        t = t || r.shift();
        do {
          if ((n = t.execute(t.state, t.delay))) break;
        } while ((t = r[0]) && t.id === e && r.shift());
        if (((this._active = !1), n)) {
          for (; (t = r[0]) && t.id === e && r.shift(); ) t.unsubscribe();
          throw n;
        }
      }),
      n
    );
  })(Ny))(Uy),
  Hy = By,
  qy = (function (t) {
    function n(e, n) {
      void 0 === e && (e = Wy), void 0 === n && (n = 1 / 0);
      var r =
        t.call(this, e, function () {
          return r.frame;
        }) || this;
      return (r.maxFrames = n), (r.frame = 0), (r.index = -1), r;
    }
    return (
      e(n, t),
      (n.prototype.flush = function () {
        for (var t, e, n = this.actions, r = this.maxFrames; (e = n[0]) && e.delay <= r && (n.shift(), (this.frame = e.delay), !(t = e.execute(e.state, e.delay))); );
        if (t) {
          for (; (e = n.shift()); ) e.unsubscribe();
          throw t;
        }
      }),
      (n.frameTimeFactor = 10),
      n
    );
  })(Ny),
  Wy = (function (t) {
    function n(e, n, r) {
      void 0 === r && (r = e.index += 1);
      var i = t.call(this, e, n) || this;
      return (i.scheduler = e), (i.work = n), (i.index = r), (i.active = !0), (i.index = e.index = r), i;
    }
    return (
      e(n, t),
      (n.prototype.schedule = function (e, r) {
        if ((void 0 === r && (r = 0), Number.isFinite(r))) {
          if (!this.id) return t.prototype.schedule.call(this, e, r);
          this.active = !1;
          var i = new n(this.scheduler, this.work);
          return this.add(i), i.schedule(e, r);
        }
        return Tg.EMPTY;
      }),
      (n.prototype.requestAsyncId = function (t, e, r) {
        void 0 === r && (r = 0), (this.delay = t.frame + r);
        var i = t.actions;
        return i.push(this), i.sort(n.sortActions), 1;
      }),
      (n.prototype.recycleAsyncId = function (t, e, n) {}),
      (n.prototype._execute = function (e, n) {
        if (!0 === this.active) return t.prototype._execute.call(this, e, n);
      }),
      (n.sortActions = function (t, e) {
        return t.delay === e.delay ? (t.index === e.index ? 0 : t.index > e.index ? 1 : -1) : t.delay > e.delay ? 1 : -1;
      }),
      n
    );
  })(xy),
  Ly = new ty(function (t) {
    return t.complete();
  });
function Fy(t) {
  return t && Eg(t.schedule);
}
function Vy(t) {
  return t[t.length - 1];
}
function Yy(t) {
  return Eg(Vy(t)) ? t.pop() : void 0;
}
function Xy(t) {
  return Fy(Vy(t)) ? t.pop() : void 0;
}
function Zy(t, e) {
  return 'number' == typeof Vy(t) ? t.pop() : e;
}
var Gy = function (t) {
  return t && 'number' == typeof t.length && 'function' != typeof t;
};
function Ky(t) {
  return Eg(null == t ? void 0 : t.then);
}
function Jy(t) {
  return Eg(t[Gg]);
}
function Qy(t) {
  return Symbol.asyncIterator && Eg(null == t ? void 0 : t[Symbol.asyncIterator]);
}
function tb(t) {
  return new TypeError(
    'You provided ' +
      (null !== t && 'object' == typeof t ? 'an invalid object' : "'" + t + "'") +
      ' where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.'
  );
}
var eb,
  nb = 'function' == typeof Symbol && Symbol.iterator ? Symbol.iterator : '@@iterator';
function rb(t) {
  return Eg(null == t ? void 0 : t[nb]);
}
function ib(t) {
  return g(this, arguments, function () {
    var e, n, r;
    return u(this, function (i) {
      switch (i.label) {
        case 0:
          (e = t.getReader()), (i.label = 1);
        case 1:
          i.trys.push([1, , 9, 10]), (i.label = 2);
        case 2:
          return [4, m(e.read())];
        case 3:
          return (n = i.sent()), (r = n.value), n.done ? [4, m(void 0)] : [3, 5];
        case 4:
          return [2, i.sent()];
        case 5:
          return [4, m(r)];
        case 6:
          return [4, i.sent()];
        case 7:
          return i.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return e.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function ob(t) {
  return Eg(null == t ? void 0 : t.getReader);
}
function ab(t) {
  if (t instanceof ty) return t;
  if (null != t) {
    if (Jy(t))
      return (
        (r = t),
        new ty(function (t) {
          var e = r[Gg]();
          if (Eg(e.subscribe)) return e.subscribe(t);
          throw new TypeError('Provided object does not correctly implement Symbol.observable');
        })
      );
    if (Gy(t))
      return (function (t) {
        return new ty(function (e) {
          for (var n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
          e.complete();
        });
      })(t);
    if (Ky(t))
      return (
        (n = t),
        new ty(function (t) {
          n.then(
            function (e) {
              t.closed || (t.next(e), t.complete());
            },
            function (e) {
              return t.error(e);
            }
          ).then(null, Rg);
        })
      );
    if (Qy(t)) return sb(t);
    if (rb(t))
      return (
        (e = t),
        new ty(function (t) {
          var n, r;
          try {
            for (var i = f(e), o = i.next(); !o.done; o = i.next()) {
              var a = o.value;
              if ((t.next(a), t.closed)) return;
            }
          } catch (t) {
            n = { error: t };
          } finally {
            try {
              o && !o.done && (r = i.return) && r.call(i);
            } finally {
              if (n) throw n.error;
            }
          }
          t.complete();
        })
      );
    if (ob(t)) return sb(ib(t));
  }
  var e, n, r;
  throw tb(t);
}
function sb(t) {
  return new ty(function (e) {
    (function (t, e) {
      var n, r, i, o;
      return s(this, void 0, void 0, function () {
        var a, s;
        return u(this, function (u) {
          switch (u.label) {
            case 0:
              u.trys.push([0, 5, 6, 11]), (n = b(t)), (u.label = 1);
            case 1:
              return [4, n.next()];
            case 2:
              if ((r = u.sent()).done) return [3, 4];
              if (((a = r.value), e.next(a), e.closed)) return [2];
              u.label = 3;
            case 3:
              return [3, 1];
            case 4:
              return [3, 11];
            case 5:
              return (s = u.sent()), (i = { error: s }), [3, 11];
            case 6:
              return u.trys.push([6, , 9, 10]), r && !r.done && (o = n.return) ? [4, o.call(n)] : [3, 8];
            case 7:
              u.sent(), (u.label = 8);
            case 8:
              return [3, 10];
            case 9:
              if (i) throw i.error;
              return [7];
            case 10:
              return [7];
            case 11:
              return e.complete(), [2];
          }
        });
      });
    })(t, e).catch(function (t) {
      return e.error(t);
    });
  });
}
function ub(t, e, n, r, i) {
  void 0 === r && (r = 0), void 0 === i && (i = !1);
  var o = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((t.add(o), !i)) return o;
}
function cb(t, e) {
  return (
    void 0 === e && (e = 0),
    ry(function (n, r) {
      n.subscribe(
        iy(
          r,
          function (n) {
            return ub(
              r,
              t,
              function () {
                return r.next(n);
              },
              e
            );
          },
          function () {
            return ub(
              r,
              t,
              function () {
                return r.complete();
              },
              e
            );
          },
          function (n) {
            return ub(
              r,
              t,
              function () {
                return r.error(n);
              },
              e
            );
          }
        )
      );
    })
  );
}
function lb(t, e) {
  return (
    void 0 === e && (e = 0),
    ry(function (n, r) {
      r.add(
        t.schedule(function () {
          return n.subscribe(r);
        }, e)
      );
    })
  );
}
function fb(t, e) {
  return new ty(function (n) {
    var r;
    return (
      ub(n, e, function () {
        (r = t[nb]()),
          ub(
            n,
            e,
            function () {
              var t, e, i;
              try {
                (e = (t = r.next()).value), (i = t.done);
              } catch (t) {
                return void n.error(t);
              }
              i ? n.complete() : n.next(e);
            },
            0,
            !0
          );
      }),
      function () {
        return Eg(null == r ? void 0 : r.return) && r.return();
      }
    );
  });
}
function hb(t, e) {
  if (!t) throw new Error('Iterable cannot be null');
  return new ty(function (n) {
    ub(n, e, function () {
      var r = t[Symbol.asyncIterator]();
      ub(
        n,
        e,
        function () {
          r.next().then(function (t) {
            t.done ? n.complete() : n.next(t.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function db(t, e) {
  if (null != t) {
    if (Jy(t))
      return (function (t, e) {
        return ab(t).pipe(lb(e), cb(e));
      })(t, e);
    if (Gy(t))
      return (function (t, e) {
        return new ty(function (n) {
          var r = 0;
          return e.schedule(function () {
            r === t.length ? n.complete() : (n.next(t[r++]), n.closed || this.schedule());
          });
        });
      })(t, e);
    if (Ky(t))
      return (function (t, e) {
        return ab(t).pipe(lb(e), cb(e));
      })(t, e);
    if (Qy(t)) return hb(t, e);
    if (rb(t)) return fb(t, e);
    if (ob(t))
      return (function (t, e) {
        return hb(ib(t), e);
      })(t, e);
  }
  throw tb(t);
}
function pb(t, e) {
  return e ? db(t, e) : ab(t);
}
function vb() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  return pb(t, Xy(t));
}
function mb(t, e) {
  var n = Eg(t)
      ? t
      : function () {
          return t;
        },
    r = function (t) {
      return t.error(n());
    };
  return new ty(
    e
      ? function (t) {
          return e.schedule(r, 0, t);
        }
      : r
  );
}
!(function (t) {
  (t.NEXT = 'N'), (t.ERROR = 'E'), (t.COMPLETE = 'C');
})(eb || (eb = {}));
var gb = (function () {
  function t(t, e, n) {
    (this.kind = t), (this.value = e), (this.error = n), (this.hasValue = 'N' === t);
  }
  return (
    (t.prototype.observe = function (t) {
      return yb(this, t);
    }),
    (t.prototype.do = function (t, e, n) {
      var r = this,
        i = r.kind,
        o = r.value,
        a = r.error;
      return 'N' === i ? (null == t ? void 0 : t(o)) : 'E' === i ? (null == e ? void 0 : e(a)) : null == n ? void 0 : n();
    }),
    (t.prototype.accept = function (t, e, n) {
      var r;
      return Eg(null === (r = t) || void 0 === r ? void 0 : r.next) ? this.observe(t) : this.do(t, e, n);
    }),
    (t.prototype.toObservable = function () {
      var t = this,
        e = t.kind,
        n = t.value,
        r = t.error,
        i =
          'N' === e
            ? vb(n)
            : 'E' === e
            ? mb(function () {
                return r;
              })
            : 'C' === e
            ? Ly
            : 0;
      if (!i) throw new TypeError('Unexpected notification kind ' + e);
      return i;
    }),
    (t.createNext = function (e) {
      return new t('N', e);
    }),
    (t.createError = function (e) {
      return new t('E', void 0, e);
    }),
    (t.createComplete = function () {
      return t.completeNotification;
    }),
    (t.completeNotification = new t('C')),
    t
  );
})();
function yb(t, e) {
  var n,
    r,
    i,
    o = t,
    a = o.kind,
    s = o.value,
    u = o.error;
  if ('string' != typeof a) throw new TypeError('Invalid notification, missing "kind"');
  'N' === a
    ? null === (n = e.next) || void 0 === n || n.call(e, s)
    : 'E' === a
    ? null === (r = e.error) || void 0 === r || r.call(e, u)
    : null === (i = e.complete) || void 0 === i || i.call(e);
}
var bb = Sg(function (t) {
  return function () {
    t(this), (this.name = 'EmptyError'), (this.message = 'no elements in sequence');
  };
});
var _b = Sg(function (t) {
    return function () {
      t(this), (this.name = 'ArgumentOutOfRangeError'), (this.message = 'argument out of range');
    };
  }),
  wb = Sg(function (t) {
    return function (e) {
      t(this), (this.name = 'NotFoundError'), (this.message = e);
    };
  }),
  xb = Sg(function (t) {
    return function (e) {
      t(this), (this.name = 'SequenceError'), (this.message = e);
    };
  });
function Ab(t) {
  return t instanceof Date && !isNaN(t);
}
var Mb = Sg(function (t) {
  return function (e) {
    void 0 === e && (e = null), t(this), (this.message = 'Timeout has occurred'), (this.name = 'TimeoutError'), (this.info = e);
  };
});
function $b(t, e) {
  var n = Ab(t) ? { first: t } : 'number' == typeof t ? { each: t } : t,
    r = n.first,
    i = n.each,
    o = n.with,
    a = void 0 === o ? Eb : o,
    s = n.scheduler,
    u = void 0 === s ? (null != e ? e : Oy) : s,
    c = n.meta,
    l = void 0 === c ? null : c;
  if (null == r && null == i) throw new TypeError('No timeout provided.');
  return ry(function (t, e) {
    var n,
      o,
      s = null,
      c = 0,
      f = function (t) {
        o = ub(
          e,
          u,
          function () {
            try {
              n.unsubscribe(), ab(a({ meta: l, lastValue: s, seen: c })).subscribe(e);
            } catch (t) {
              e.error(t);
            }
          },
          t
        );
      };
    (n = t.subscribe(
      iy(
        e,
        function (t) {
          null == o || o.unsubscribe(), c++, e.next((s = t)), i > 0 && f(i);
        },
        void 0,
        void 0,
        function () {
          (null == o ? void 0 : o.closed) || null == o || o.unsubscribe(), (s = null);
        }
      )
    )),
      !c && f(null != r ? ('number' == typeof r ? r : +r - u.now()) : i);
  });
}
function Eb(t) {
  throw new Mb(t);
}
function Sb(t, e) {
  return ry(function (n, r) {
    var i = 0;
    n.subscribe(
      iy(r, function (n) {
        r.next(t.call(e, n, i++));
      })
    );
  });
}
var Cb = Array.isArray;
function kb(t) {
  return Sb(function (e) {
    return (function (t, e) {
      return Cb(e) ? t.apply(void 0, v([], h(e))) : t(e);
    })(t, e);
  });
}
function Tb(t, e, n, r) {
  if (n) {
    if (!Fy(n))
      return function () {
        for (var i = [], o = 0; o < arguments.length; o++) i[o] = arguments[o];
        return Tb(t, e, r).apply(this, i).pipe(kb(n));
      };
    r = n;
  }
  return r
    ? function () {
        for (var n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
        return Tb(t, e).apply(this, n).pipe(lb(r), cb(r));
      }
    : function () {
        for (var n = this, r = [], i = 0; i < arguments.length; i++) r[i] = arguments[i];
        var o = new by(),
          a = !0;
        return new ty(function (i) {
          var s = o.subscribe(i);
          if (a) {
            a = !1;
            var u = !1,
              c = !1;
            e.apply(
              n,
              v(v([], h(r)), [
                function () {
                  for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
                  if (t) {
                    var r = e.shift();
                    if (null != r) return void o.error(r);
                  }
                  o.next(1 < e.length ? e : e[0]), (c = !0), u && o.complete();
                },
              ])
            ),
              c && o.complete(),
              (u = !0);
          }
          return s;
        });
      };
}
var Nb = Array.isArray,
  Pb = Object.getPrototypeOf,
  Db = Object.prototype,
  Ob = Object.keys;
function zb(t) {
  if (1 === t.length) {
    var e = t[0];
    if (Nb(e)) return { args: e, keys: null };
    if ((r = e) && 'object' == typeof r && Pb(r) === Db) {
      var n = Ob(e);
      return {
        args: n.map(function (t) {
          return e[t];
        }),
        keys: n,
      };
    }
  }
  var r;
  return { args: t, keys: null };
}
function Rb(t, e) {
  return t.reduce(function (t, n, r) {
    return (t[n] = e[r]), t;
  }, {});
}
function Ib() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  var n = Xy(t),
    r = Yy(t),
    i = zb(t),
    o = i.args,
    a = i.keys;
  if (0 === o.length) return pb([], n);
  var s = new ty(
    jb(
      o,
      n,
      a
        ? function (t) {
            return Rb(a, t);
          }
        : Kg
    )
  );
  return r ? s.pipe(kb(r)) : s;
}
function jb(t, e, n) {
  return (
    void 0 === n && (n = Kg),
    function (r) {
      Ub(
        e,
        function () {
          for (
            var i = t.length,
              o = new Array(i),
              a = i,
              s = i,
              u = function (i) {
                Ub(
                  e,
                  function () {
                    var u = pb(t[i], e),
                      c = !1;
                    u.subscribe(
                      iy(
                        r,
                        function (t) {
                          (o[i] = t), c || ((c = !0), s--), s || r.next(n(o.slice()));
                        },
                        function () {
                          --a || r.complete();
                        }
                      )
                    );
                  },
                  r
                );
              },
              c = 0;
            c < i;
            c++
          )
            u(c);
        },
        r
      );
    }
  );
}
function Ub(t, e, n) {
  t ? ub(n, t, e) : e();
}
function Bb(t, e, n, r, i, o, a, s) {
  var u = [],
    c = 0,
    l = 0,
    f = !1,
    h = function () {
      !f || u.length || c || e.complete();
    },
    d = function (t) {
      return c < r ? p(t) : u.push(t);
    },
    p = function (t) {
      o && e.next(t), c++;
      var s = !1;
      ab(n(t, l++)).subscribe(
        iy(
          e,
          function (t) {
            null == i || i(t), o ? d(t) : e.next(t);
          },
          function () {
            s = !0;
          },
          void 0,
          function () {
            if (s)
              try {
                c--;
                for (
                  var t = function () {
                    var t = u.shift();
                    a
                      ? ub(e, a, function () {
                          return p(t);
                        })
                      : p(t);
                  };
                  u.length && c < r;

                )
                  t();
                h();
              } catch (t) {
                e.error(t);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      iy(e, d, function () {
        (f = !0), h();
      })
    ),
    function () {
      null == s || s();
    }
  );
}
function Hb(t, e, n) {
  return (
    void 0 === n && (n = 1 / 0),
    Eg(e)
      ? Hb(function (n, r) {
          return Sb(function (t, i) {
            return e(n, t, r, i);
          })(ab(t(n, r)));
        }, n)
      : ('number' == typeof e && (n = e),
        ry(function (e, r) {
          return Bb(e, r, t, n);
        }))
  );
}
function qb(t) {
  return void 0 === t && (t = 1 / 0), Hb(Kg, t);
}
function Wb() {
  return qb(1);
}
function Lb() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  return Wb()(pb(t, Xy(t)));
}
function Fb(t) {
  return new ty(function (e) {
    ab(t()).subscribe(e);
  });
}
var Vb = {
  connector: function () {
    return new py();
  },
  resetOnDisconnect: !0,
};
var Yb = ['addListener', 'removeListener'],
  Xb = ['addEventListener', 'removeEventListener'],
  Zb = ['on', 'off'];
function Gb(t, e) {
  return function (n) {
    return function (r) {
      return t[n](e, r);
    };
  };
}
function Kb(t, e, n) {
  void 0 === t && (t = 0), void 0 === n && (n = zy);
  var r = -1;
  return (
    null != e && (Fy(e) ? (n = e) : (r = e)),
    new ty(function (e) {
      var i = Ab(t) ? +t - n.now() : t;
      i < 0 && (i = 0);
      var o = 0;
      return n.schedule(function () {
        e.closed || (e.next(o++), 0 <= r ? this.schedule(void 0, r) : e.complete());
      }, i);
    })
  );
}
function Jb(t, e) {
  return void 0 === t && (t = 0), void 0 === e && (e = Oy), t < 0 && (t = 0), Kb(t, t, e);
}
var Qb = new ty(Ig);
var t_ = Array.isArray;
function e_(t) {
  return 1 === t.length && t_(t[0]) ? t[0] : t;
}
function n_() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  var n = e_(t);
  return new ty(function (t) {
    var e = 0,
      r = function () {
        if (e < n.length) {
          var i = void 0;
          try {
            i = ab(n[e++]);
          } catch (t) {
            return void r();
          }
          var o = new oy(t, void 0, Ig, Ig);
          i.subscribe(o), o.add(r);
        } else t.complete();
      };
    r();
  });
}
function r_(t, e) {
  return function (n, r) {
    return !t.call(e, n, r);
  };
}
function i_(t, e) {
  return ry(function (n, r) {
    var i = 0;
    n.subscribe(
      iy(r, function (n) {
        return t.call(e, n, i++) && r.next(n);
      })
    );
  });
}
function o_(t) {
  return function (e) {
    for (
      var n = [],
        r = function (r) {
          n.push(
            ab(t[r]).subscribe(
              iy(e, function (t) {
                if (n) {
                  for (var i = 0; i < n.length; i++) i !== r && n[i].unsubscribe();
                  n = null;
                }
                e.next(t);
              })
            )
          );
        },
        i = 0;
      n && !e.closed && i < t.length;
      i++
    )
      r(i);
  };
}
function a_() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  var n = Yy(t),
    r = e_(t);
  return r.length
    ? new ty(function (t) {
        var e = r.map(function () {
            return [];
          }),
          i = r.map(function () {
            return !1;
          });
        t.add(function () {
          e = i = null;
        });
        for (
          var o = function (o) {
              ab(r[o]).subscribe(
                iy(
                  t,
                  function (r) {
                    if (
                      (e[o].push(r),
                      e.every(function (t) {
                        return t.length;
                      }))
                    ) {
                      var a = e.map(function (t) {
                        return t.shift();
                      });
                      t.next(n ? n.apply(void 0, v([], h(a))) : a),
                        e.some(function (t, e) {
                          return !t.length && i[e];
                        }) && t.complete();
                    }
                  },
                  function () {
                    (i[o] = !0), !e[o].length && t.complete();
                  }
                )
              );
            },
            a = 0;
          !t.closed && a < r.length;
          a++
        )
          o(a);
        return function () {
          e = i = null;
        };
      })
    : Ly;
}
function s_(t) {
  return ry(function (e, n) {
    var r = !1,
      i = null,
      o = null,
      a = !1,
      s = function () {
        if ((null == o || o.unsubscribe(), (o = null), r)) {
          r = !1;
          var t = i;
          (i = null), n.next(t);
        }
        a && n.complete();
      },
      u = function () {
        (o = null), a && n.complete();
      };
    e.subscribe(
      iy(
        n,
        function (e) {
          (r = !0), (i = e), o || ab(t(e)).subscribe((o = iy(n, s, u)));
        },
        function () {
          (a = !0), (!r || !o || o.closed) && n.complete();
        }
      )
    );
  });
}
function u_(t, e, n, r, i) {
  return function (o, a) {
    var s = n,
      u = e,
      c = 0;
    o.subscribe(
      iy(
        a,
        function (e) {
          var n = c++;
          (u = s ? t(u, e, n) : ((s = !0), e)), r && a.next(u);
        },
        i &&
          function () {
            s && a.next(u), a.complete();
          }
      )
    );
  };
}
function c_(t, e) {
  return ry(u_(t, e, arguments.length >= 2, !1, !0));
}
var l_ = function (t, e) {
  return t.push(e), t;
};
function f_() {
  return ry(function (t, e) {
    c_(l_, [])(t).subscribe(e);
  });
}
function h_(t, e) {
  return Jg(
    f_(),
    Hb(function (e) {
      return t(e);
    }),
    e ? kb(e) : Kg
  );
}
function d_(t) {
  return h_(Ib, t);
}
var p_ = d_;
function v_() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  var n = Yy(t);
  return n
    ? Jg(v_.apply(void 0, v([], h(t))), kb(n))
    : ry(function (e, n) {
        jb(v([e], h(e_(t))))(n);
      });
}
function m_(t, e) {
  return Eg(e) ? Hb(t, e, 1) : Hb(t, 1);
}
function g_() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  var n = Xy(t);
  return ry(function (e, r) {
    Wb()(pb(v([e], h(t)), n)).subscribe(r);
  });
}
var y_ = {
  connector: function () {
    return new py();
  },
};
function b_(t, e) {
  void 0 === e && (e = y_);
  var n = e.connector;
  return ry(function (e, r) {
    var i,
      o = n();
    ab(
      t(
        ((i = o),
        new ty(function (t) {
          return i.subscribe(t);
        }))
      )
    ).subscribe(r),
      r.add(e.subscribe(o));
  });
}
function __(t) {
  return ry(function (e, n) {
    var r = !1;
    e.subscribe(
      iy(
        n,
        function (t) {
          (r = !0), n.next(t);
        },
        function () {
          r || n.next(t), n.complete();
        }
      )
    );
  });
}
function w_(t) {
  return t <= 0
    ? function () {
        return Ly;
      }
    : ry(function (e, n) {
        var r = 0;
        e.subscribe(
          iy(n, function (e) {
            ++r <= t && (n.next(e), t <= r && n.complete());
          })
        );
      });
}
function x_() {
  return ry(function (t, e) {
    t.subscribe(iy(e, Ig));
  });
}
function A_(t) {
  return Sb(function () {
    return t;
  });
}
function M_(t, e) {
  return e
    ? function (n) {
        return Lb(e.pipe(w_(1), x_()), n.pipe(M_(t)));
      }
    : Hb(function (e, n) {
        return ab(t(e, n)).pipe(w_(1), A_(e));
      });
}
function $_(t, e) {
  return (
    void 0 === e && (e = Kg),
    (t = null != t ? t : E_),
    ry(function (n, r) {
      var i,
        o = !0;
      n.subscribe(
        iy(r, function (n) {
          var a = e(n);
          (!o && t(i, a)) || ((o = !1), (i = a), r.next(n));
        })
      );
    })
  );
}
function E_(t, e) {
  return t === e;
}
function S_(t) {
  return (
    void 0 === t && (t = C_),
    ry(function (e, n) {
      var r = !1;
      e.subscribe(
        iy(
          n,
          function (t) {
            (r = !0), n.next(t);
          },
          function () {
            return r ? n.complete() : n.error(t());
          }
        )
      );
    })
  );
}
function C_() {
  return new bb();
}
function k_(t, e) {
  return e
    ? function (n) {
        return n.pipe(
          k_(function (n, r) {
            return ab(t(n, r)).pipe(
              Sb(function (t, i) {
                return e(n, t, r, i);
              })
            );
          })
        );
      }
    : ry(function (e, n) {
        var r = 0,
          i = null,
          o = !1;
        e.subscribe(
          iy(
            n,
            function (e) {
              i ||
                ((i = iy(n, void 0, function () {
                  (i = null), o && n.complete();
                })),
                ab(t(e, r++)).subscribe(i));
            },
            function () {
              (o = !0), !i && n.complete();
            }
          )
        );
      });
}
function T_() {
  return k_(Kg);
}
var N_ = T_;
function P_(t, e, n) {
  var r = 'index' === n;
  return function (n, i) {
    var o = 0;
    n.subscribe(
      iy(
        i,
        function (a) {
          var s = o++;
          t.call(e, a, s, n) && (i.next(r ? s : a), i.complete());
        },
        function () {
          i.next(r ? -1 : void 0), i.complete();
        }
      )
    );
  };
}
function D_(t) {
  return t <= 0
    ? function () {
        return Ly;
      }
    : ry(function (e, n) {
        var r = [];
        e.subscribe(
          iy(
            n,
            function (e) {
              r.push(e), t < r.length && r.shift();
            },
            function () {
              var t, e;
              try {
                for (var i = f(r), o = i.next(); !o.done; o = i.next()) {
                  var a = o.value;
                  n.next(a);
                }
              } catch (e) {
                t = { error: e };
              } finally {
                try {
                  o && !o.done && (e = i.return) && e.call(i);
                } finally {
                  if (t) throw t.error;
                }
              }
              n.complete();
            },
            void 0,
            function () {
              r = null;
            }
          )
        );
      });
}
var O_ = Hb;
function z_() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  var n = Xy(t),
    r = Zy(t, 1 / 0);
  return (
    (t = e_(t)),
    ry(function (e, i) {
      qb(r)(pb(v([e], h(t)), n)).subscribe(i);
    })
  );
}
function R_(t, e) {
  var n = Eg(t)
    ? t
    : function () {
        return t;
      };
  return Eg(e)
    ? b_(e, { connector: n })
    : function (t) {
        return new sy(t, n);
      };
}
function I_(t) {
  return ry(function (e, n) {
    var r = !1,
      i = null;
    e.subscribe(
      iy(n, function (t) {
        (r = !0), (i = t);
      })
    ),
      ab(t).subscribe(
        iy(
          n,
          function () {
            if (r) {
              r = !1;
              var t = i;
              (i = null), n.next(t);
            }
          },
          Ig
        )
      );
  });
}
function j_(t) {
  void 0 === t && (t = {});
  var e = t.connector,
    n =
      void 0 === e
        ? function () {
            return new py();
          }
        : e,
    r = t.resetOnError,
    i = void 0 === r || r,
    o = t.resetOnComplete,
    a = void 0 === o || o,
    s = t.resetOnRefCountZero,
    u = void 0 === s || s;
  return function (t) {
    var e,
      r,
      o,
      s = 0,
      c = !1,
      l = !1,
      f = function () {
        null == r || r.unsubscribe(), (r = void 0);
      },
      h = function () {
        f(), (e = o = void 0), (c = l = !1);
      },
      d = function () {
        var t = e;
        h(), null == t || t.unsubscribe();
      };
    return ry(function (t, p) {
      s++, l || c || f();
      var v = (o = null != o ? o : n());
      p.add(function () {
        0 !== --s || l || c || (r = U_(d, u));
      }),
        v.subscribe(p),
        !e &&
          s > 0 &&
          ((e = new Vg({
            next: function (t) {
              return v.next(t);
            },
            error: function (t) {
              (l = !0), f(), (r = U_(h, i, t)), v.error(t);
            },
            complete: function () {
              (c = !0), f(), (r = U_(h, a)), v.complete();
            },
          })),
          ab(t).subscribe(e));
    })(t);
  };
}
function U_(t, e) {
  for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
  if (!0 !== e) {
    if (!1 !== e) {
      var i = new Vg({
        next: function () {
          i.unsubscribe(), t();
        },
      });
      return ab(e.apply(void 0, v([], h(n)))).subscribe(i);
    }
  } else t();
}
function B_(t, e) {
  return ry(function (n, r) {
    var i = null,
      o = 0,
      a = !1,
      s = function () {
        return a && !i && r.complete();
      };
    n.subscribe(
      iy(
        r,
        function (n) {
          null == i || i.unsubscribe();
          var a = 0,
            u = o++;
          ab(t(n, u)).subscribe(
            (i = iy(
              r,
              function (t) {
                return r.next(e ? e(n, t, u, a++) : t);
              },
              function () {
                (i = null), s();
              }
            ))
          );
        },
        function () {
          (a = !0), s();
        }
      )
    );
  });
}
function H_(t, e) {
  return ry(function (n, r) {
    var i = null != e ? e : {},
      o = i.leading,
      a = void 0 === o || o,
      s = i.trailing,
      u = void 0 !== s && s,
      c = !1,
      l = null,
      f = null,
      h = !1,
      d = function () {
        null == f || f.unsubscribe(), (f = null), u && (m(), h && r.complete());
      },
      p = function () {
        (f = null), h && r.complete();
      },
      v = function (e) {
        return (f = ab(t(e)).subscribe(iy(r, d, p)));
      },
      m = function () {
        if (c) {
          c = !1;
          var t = l;
          (l = null), r.next(t), !h && v(t);
        }
      };
    n.subscribe(
      iy(
        r,
        function (t) {
          (c = !0), (l = t), (!f || f.closed) && (a ? m() : v(t));
        },
        function () {
          (h = !0), (!(u && c && f) || f.closed) && r.complete();
        }
      )
    );
  });
}
var q_ = function (t, e) {
  (this.value = t), (this.interval = e);
};
function W_() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  return ry(function (e, n) {
    a_.apply(void 0, v([e], h(t))).subscribe(n);
  });
}
var L_,
  F_,
  V_ = Object.freeze({
    __proto__: null,
    ArgumentOutOfRangeError: _b,
    AsyncSubject: by,
    BehaviorSubject: my,
    ConnectableObservable: sy,
    EMPTY: Ly,
    EmptyError: bb,
    NEVER: Qb,
    NotFoundError: wb,
    Notification: gb,
    get NotificationKind() {
      return eb;
    },
    ObjectUnsubscribedError: dy,
    Observable: ty,
    ReplaySubject: yy,
    Scheduler: Ty,
    SequenceError: xb,
    Subject: py,
    Subscriber: qg,
    Subscription: Tg,
    TimeoutError: Mb,
    UnsubscriptionError: Cg,
    VirtualAction: Wy,
    VirtualTimeScheduler: qy,
    animationFrame: Hy,
    animationFrameScheduler: By,
    animationFrames: function (t) {
      return t ? ly(t) : hy;
    },
    asap: Dy,
    asapScheduler: Py,
    async: zy,
    asyncScheduler: Oy,
    audit: s_,
    auditTime: function (t, e) {
      return (
        void 0 === e && (e = Oy),
        s_(function () {
          return Kb(t, e);
        })
      );
    },
    bindCallback: function (t, e, n) {
      return Tb(!1, t, e, n);
    },
    bindNodeCallback: function (t, e, n) {
      return Tb(!0, t, e, n);
    },
    buffer: function (t) {
      return ry(function (e, n) {
        var r = [];
        return (
          e.subscribe(
            iy(
              n,
              function (t) {
                return r.push(t);
              },
              function () {
                n.next(r), n.complete();
              }
            )
          ),
          ab(t).subscribe(
            iy(
              n,
              function () {
                var t = r;
                (r = []), n.next(t);
              },
              Ig
            )
          ),
          function () {
            r = null;
          }
        );
      });
    },
    bufferCount: function (t, e) {
      return (
        void 0 === e && (e = null),
        (e = null != e ? e : t),
        ry(function (n, r) {
          var i = [],
            o = 0;
          n.subscribe(
            iy(
              r,
              function (n) {
                var a,
                  s,
                  u,
                  c,
                  l = null;
                o++ % e == 0 && i.push([]);
                try {
                  for (var h = f(i), d = h.next(); !d.done; d = h.next()) {
                    (m = d.value).push(n), t <= m.length && (l = null != l ? l : []).push(m);
                  }
                } catch (t) {
                  a = { error: t };
                } finally {
                  try {
                    d && !d.done && (s = h.return) && s.call(h);
                  } finally {
                    if (a) throw a.error;
                  }
                }
                if (l)
                  try {
                    for (var p = f(l), v = p.next(); !v.done; v = p.next()) {
                      var m = v.value;
                      kg(i, m), r.next(m);
                    }
                  } catch (t) {
                    u = { error: t };
                  } finally {
                    try {
                      v && !v.done && (c = p.return) && c.call(p);
                    } finally {
                      if (u) throw u.error;
                    }
                  }
              },
              function () {
                var t, e;
                try {
                  for (var n = f(i), o = n.next(); !o.done; o = n.next()) {
                    var a = o.value;
                    r.next(a);
                  }
                } catch (e) {
                  t = { error: e };
                } finally {
                  try {
                    o && !o.done && (e = n.return) && e.call(n);
                  } finally {
                    if (t) throw t.error;
                  }
                }
                r.complete();
              },
              void 0,
              function () {
                i = null;
              }
            )
          );
        })
      );
    },
    bufferTime: function (t) {
      for (var e, n, r = [], i = 1; i < arguments.length; i++) r[i - 1] = arguments[i];
      var o = null !== (e = Xy(r)) && void 0 !== e ? e : Oy,
        a = null !== (n = r[0]) && void 0 !== n ? n : null,
        s = r[1] || 1 / 0;
      return ry(function (e, n) {
        var r = [],
          i = !1,
          u = function (t) {
            var e = t.buffer;
            t.subs.unsubscribe(), kg(r, t), n.next(e), i && c();
          },
          c = function () {
            if (r) {
              var e = new Tg();
              n.add(e);
              var i = { buffer: [], subs: e };
              r.push(i),
                ub(
                  e,
                  o,
                  function () {
                    return u(i);
                  },
                  t
                );
            }
          };
        null !== a && a >= 0 ? ub(n, o, c, a, !0) : (i = !0), c();
        var l = iy(
          n,
          function (t) {
            var e,
              n,
              i = r.slice();
            try {
              for (var o = f(i), a = o.next(); !a.done; a = o.next()) {
                var c = a.value,
                  l = c.buffer;
                l.push(t), s <= l.length && u(c);
              }
            } catch (t) {
              e = { error: t };
            } finally {
              try {
                a && !a.done && (n = o.return) && n.call(o);
              } finally {
                if (e) throw e.error;
              }
            }
          },
          function () {
            for (; null == r ? void 0 : r.length; ) n.next(r.shift().buffer);
            null == l || l.unsubscribe(), n.complete(), n.unsubscribe();
          },
          void 0,
          function () {
            return (r = null);
          }
        );
        e.subscribe(l);
      });
    },
    bufferToggle: function (t, e) {
      return ry(function (n, r) {
        var i = [];
        ab(t).subscribe(
          iy(
            r,
            function (t) {
              var n = [];
              i.push(n);
              var o = new Tg();
              o.add(
                ab(e(t)).subscribe(
                  iy(
                    r,
                    function () {
                      kg(i, n), r.next(n), o.unsubscribe();
                    },
                    Ig
                  )
                )
              );
            },
            Ig
          )
        ),
          n.subscribe(
            iy(
              r,
              function (t) {
                var e, n;
                try {
                  for (var r = f(i), o = r.next(); !o.done; o = r.next()) {
                    o.value.push(t);
                  }
                } catch (t) {
                  e = { error: t };
                } finally {
                  try {
                    o && !o.done && (n = r.return) && n.call(r);
                  } finally {
                    if (e) throw e.error;
                  }
                }
              },
              function () {
                for (; i.length > 0; ) r.next(i.shift());
                r.complete();
              }
            )
          );
      });
    },
    bufferWhen: function (t) {
      return ry(function (e, n) {
        var r = null,
          i = null,
          o = function () {
            null == i || i.unsubscribe();
            var e = r;
            (r = []), e && n.next(e), ab(t()).subscribe((i = iy(n, o, Ig)));
          };
        o(),
          e.subscribe(
            iy(
              n,
              function (t) {
                return null == r ? void 0 : r.push(t);
              },
              function () {
                r && n.next(r), n.complete();
              },
              void 0,
              function () {
                return (r = i = null);
              }
            )
          );
      });
    },
    catchError: function t(e) {
      return ry(function (n, r) {
        var i,
          o = null,
          a = !1;
        (o = n.subscribe(
          iy(r, void 0, void 0, function (s) {
            (i = ab(e(s, t(e)(n)))), o ? (o.unsubscribe(), (o = null), i.subscribe(r)) : (a = !0);
          })
        )),
          a && (o.unsubscribe(), (o = null), i.subscribe(r));
      });
    },
    combineAll: p_,
    combineLatest: Ib,
    combineLatestAll: d_,
    combineLatestWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return v_.apply(void 0, v([], h(t)));
    },
    concat: Lb,
    concatAll: Wb,
    concatMap: m_,
    concatMapTo: function (t, e) {
      return Eg(e)
        ? m_(function () {
            return t;
          }, e)
        : m_(function () {
            return t;
          });
    },
    concatWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return g_.apply(void 0, v([], h(t)));
    },
    config: Og,
    connect: b_,
    connectable: function (t, e) {
      void 0 === e && (e = Vb);
      var n = null,
        r = e.connector,
        i = e.resetOnDisconnect,
        o = void 0 === i || i,
        a = r(),
        s = new ty(function (t) {
          return a.subscribe(t);
        });
      return (
        (s.connect = function () {
          return (
            (n && !n.closed) ||
              ((n = Fb(function () {
                return t;
              }).subscribe(a)),
              o &&
                n.add(function () {
                  return (a = r());
                })),
            n
          );
        }),
        s
      );
    },
    count: function (t) {
      return c_(function (e, n, r) {
        return !t || t(n, r) ? e + 1 : e;
      }, 0);
    },
    debounce: function (t) {
      return ry(function (e, n) {
        var r = !1,
          i = null,
          o = null,
          a = function () {
            if ((null == o || o.unsubscribe(), (o = null), r)) {
              r = !1;
              var t = i;
              (i = null), n.next(t);
            }
          };
        e.subscribe(
          iy(
            n,
            function (e) {
              null == o || o.unsubscribe(), (r = !0), (i = e), (o = iy(n, a, Ig)), ab(t(e)).subscribe(o);
            },
            function () {
              a(), n.complete();
            },
            void 0,
            function () {
              i = o = null;
            }
          )
        );
      });
    },
    debounceTime: function (t, e) {
      return (
        void 0 === e && (e = Oy),
        ry(function (n, r) {
          var i = null,
            o = null,
            a = null,
            s = function () {
              if (i) {
                i.unsubscribe(), (i = null);
                var t = o;
                (o = null), r.next(t);
              }
            };
          function u() {
            var n = a + t,
              o = e.now();
            if (o < n) return (i = this.schedule(void 0, n - o)), void r.add(i);
            s();
          }
          n.subscribe(
            iy(
              r,
              function (n) {
                (o = n), (a = e.now()), i || ((i = e.schedule(u, t)), r.add(i));
              },
              function () {
                s(), r.complete();
              },
              void 0,
              function () {
                o = i = null;
              }
            )
          );
        })
      );
    },
    defaultIfEmpty: __,
    defer: Fb,
    delay: function (t, e) {
      void 0 === e && (e = Oy);
      var n = Kb(t, e);
      return M_(function () {
        return n;
      });
    },
    delayWhen: M_,
    dematerialize: function () {
      return ry(function (t, e) {
        t.subscribe(
          iy(e, function (t) {
            return yb(t, e);
          })
        );
      });
    },
    distinct: function (t, e) {
      return ry(function (n, r) {
        var i = new Set();
        n.subscribe(
          iy(r, function (e) {
            var n = t ? t(e) : e;
            i.has(n) || (i.add(n), r.next(e));
          })
        ),
          e &&
            ab(e).subscribe(
              iy(
                r,
                function () {
                  return i.clear();
                },
                Ig
              )
            );
      });
    },
    distinctUntilChanged: $_,
    distinctUntilKeyChanged: function (t, e) {
      return $_(function (n, r) {
        return e ? e(n[t], r[t]) : n[t] === r[t];
      });
    },
    elementAt: function (t, e) {
      if (t < 0) throw new _b();
      var n = arguments.length >= 2;
      return function (r) {
        return r.pipe(
          i_(function (e, n) {
            return n === t;
          }),
          w_(1),
          n
            ? __(e)
            : S_(function () {
                return new _b();
              })
        );
      };
    },
    empty: function (t) {
      return t
        ? (function (t) {
            return new ty(function (e) {
              return t.schedule(function () {
                return e.complete();
              });
            });
          })(t)
        : Ly;
    },
    endWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return function (e) {
        return Lb(e, vb.apply(void 0, v([], h(t))));
      };
    },
    every: function (t, e) {
      return ry(function (n, r) {
        var i = 0;
        n.subscribe(
          iy(
            r,
            function (o) {
              t.call(e, o, i++, n) || (r.next(!1), r.complete());
            },
            function () {
              r.next(!0), r.complete();
            }
          )
        );
      });
    },
    exhaust: N_,
    exhaustAll: T_,
    exhaustMap: k_,
    expand: function (t, e, n) {
      return (
        void 0 === e && (e = 1 / 0),
        (e = (e || 0) < 1 ? 1 / 0 : e),
        ry(function (r, i) {
          return Bb(r, i, t, e, void 0, !0, n);
        })
      );
    },
    filter: i_,
    finalize: function (t) {
      return ry(function (e, n) {
        try {
          e.subscribe(n);
        } finally {
          n.add(t);
        }
      });
    },
    find: function (t, e) {
      return ry(P_(t, e, 'value'));
    },
    findIndex: function (t, e) {
      return ry(P_(t, e, 'index'));
    },
    first: function (t, e) {
      var n = arguments.length >= 2;
      return function (r) {
        return r.pipe(
          t
            ? i_(function (e, n) {
                return t(e, n, r);
              })
            : Kg,
          w_(1),
          n
            ? __(e)
            : S_(function () {
                return new bb();
              })
        );
      };
    },
    firstValueFrom: function (t, e) {
      var n = 'object' == typeof e;
      return new Promise(function (r, i) {
        var o = new Vg({
          next: function (t) {
            r(t), o.unsubscribe();
          },
          error: i,
          complete: function () {
            n ? r(e.defaultValue) : i(new bb());
          },
        });
        t.subscribe(o);
      });
    },
    flatMap: O_,
    forkJoin: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      var n = Yy(t),
        r = zb(t),
        i = r.args,
        o = r.keys,
        a = new ty(function (t) {
          var e = i.length;
          if (e)
            for (
              var n = new Array(e),
                r = e,
                a = e,
                s = function (e) {
                  var s = !1;
                  ab(i[e]).subscribe(
                    iy(
                      t,
                      function (t) {
                        s || ((s = !0), a--), (n[e] = t);
                      },
                      function () {
                        return r--;
                      },
                      void 0,
                      function () {
                        (r && s) || (a || t.next(o ? Rb(o, n) : n), t.complete());
                      }
                    )
                  );
                },
                u = 0;
              u < e;
              u++
            )
              s(u);
          else t.complete();
        });
      return n ? a.pipe(kb(n)) : a;
    },
    from: pb,
    fromEvent: function t(e, n, r, i) {
      if ((Eg(r) && ((i = r), (r = void 0)), i)) return t(e, n, r).pipe(kb(i));
      var o = h(
          (function (t) {
            return Eg(t.addEventListener) && Eg(t.removeEventListener);
          })(e)
            ? Xb.map(function (t) {
                return function (i) {
                  return e[t](n, i, r);
                };
              })
            : (function (t) {
                return Eg(t.addListener) && Eg(t.removeListener);
              })(e)
            ? Yb.map(Gb(e, n))
            : (function (t) {
                return Eg(t.on) && Eg(t.off);
              })(e)
            ? Zb.map(Gb(e, n))
            : [],
          2
        ),
        a = o[0],
        s = o[1];
      if (!a && Gy(e))
        return Hb(function (e) {
          return t(e, n, r);
        })(ab(e));
      if (!a) throw new TypeError('Invalid event target');
      return new ty(function (t) {
        var e = function () {
          for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
          return t.next(1 < e.length ? e : e[0]);
        };
        return (
          a(e),
          function () {
            return s(e);
          }
        );
      });
    },
    fromEventPattern: function t(e, n, r) {
      return r
        ? t(e, n).pipe(kb(r))
        : new ty(function (t) {
            var r = function () {
                for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
                return t.next(1 === e.length ? e[0] : e);
              },
              i = e(r);
            return Eg(n)
              ? function () {
                  return n(r, i);
                }
              : void 0;
          });
    },
    generate: function (t, e, n, r, i) {
      var o, a, s, c;
      function l() {
        var t;
        return u(this, function (r) {
          switch (r.label) {
            case 0:
              (t = c), (r.label = 1);
            case 1:
              return e && !e(t) ? [3, 4] : [4, s(t)];
            case 2:
              r.sent(), (r.label = 3);
            case 3:
              return (t = n(t)), [3, 1];
            case 4:
              return [2];
          }
        });
      }
      return (
        1 === arguments.length
          ? ((c = (o = t).initialState), (e = o.condition), (n = o.iterate), (a = o.resultSelector), (s = void 0 === a ? Kg : a), (i = o.scheduler))
          : ((c = t), !r || Fy(r) ? ((s = Kg), (i = r)) : (s = r)),
        Fb(
          i
            ? function () {
                return fb(l(), i);
              }
            : l
        )
      );
    },
    groupBy: function (t, e, n, r) {
      return ry(function (i, o) {
        var a;
        e && 'function' != typeof e ? ((n = e.duration), (a = e.element), (r = e.connector)) : (a = e);
        var s = new Map(),
          u = function (t) {
            s.forEach(t), t(o);
          },
          c = function (t) {
            return u(function (e) {
              return e.error(t);
            });
          },
          l = 0,
          f = !1,
          h = new oy(
            o,
            function (e) {
              try {
                var i = t(e),
                  u = s.get(i);
                if (!u) {
                  s.set(i, (u = r ? r() : new py()));
                  var d =
                    ((v = i),
                    (m = u),
                    ((g = new ty(function (t) {
                      l++;
                      var e = m.subscribe(t);
                      return function () {
                        e.unsubscribe(), 0 == --l && f && h.unsubscribe();
                      };
                    })).key = v),
                    g);
                  if ((o.next(d), n)) {
                    var p = iy(
                      u,
                      function () {
                        u.complete(), null == p || p.unsubscribe();
                      },
                      void 0,
                      void 0,
                      function () {
                        return s.delete(i);
                      }
                    );
                    h.add(ab(n(d)).subscribe(p));
                  }
                }
                u.next(a ? a(e) : e);
              } catch (t) {
                c(t);
              }
              var v, m, g;
            },
            function () {
              return u(function (t) {
                return t.complete();
              });
            },
            c,
            function () {
              return s.clear();
            },
            function () {
              return (f = !0), 0 === l;
            }
          );
        i.subscribe(h);
      });
    },
    identity: Kg,
    ignoreElements: x_,
    iif: function (t, e, n) {
      return Fb(function () {
        return t() ? e : n;
      });
    },
    interval: Jb,
    isEmpty: function () {
      return ry(function (t, e) {
        t.subscribe(
          iy(
            e,
            function () {
              e.next(!1), e.complete();
            },
            function () {
              e.next(!0), e.complete();
            }
          )
        );
      });
    },
    isObservable: function (t) {
      return !!t && (t instanceof ty || (Eg(t.lift) && Eg(t.subscribe)));
    },
    last: function (t, e) {
      var n = arguments.length >= 2;
      return function (r) {
        return r.pipe(
          t
            ? i_(function (e, n) {
                return t(e, n, r);
              })
            : Kg,
          D_(1),
          n
            ? __(e)
            : S_(function () {
                return new bb();
              })
        );
      };
    },
    lastValueFrom: function (t, e) {
      var n = 'object' == typeof e;
      return new Promise(function (r, i) {
        var o,
          a = !1;
        t.subscribe({
          next: function (t) {
            (o = t), (a = !0);
          },
          error: i,
          complete: function () {
            a ? r(o) : n ? r(e.defaultValue) : i(new bb());
          },
        });
      });
    },
    map: Sb,
    mapTo: A_,
    materialize: function () {
      return ry(function (t, e) {
        t.subscribe(
          iy(
            e,
            function (t) {
              e.next(gb.createNext(t));
            },
            function () {
              e.next(gb.createComplete()), e.complete();
            },
            function (t) {
              e.next(gb.createError(t)), e.complete();
            }
          )
        );
      });
    },
    max: function (t) {
      return c_(
        Eg(t)
          ? function (e, n) {
              return t(e, n) > 0 ? e : n;
            }
          : function (t, e) {
              return t > e ? t : e;
            }
      );
    },
    merge: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      var n = Xy(t),
        r = Zy(t, 1 / 0),
        i = t;
      return i.length ? (1 === i.length ? ab(i[0]) : qb(r)(pb(i, n))) : Ly;
    },
    mergeAll: qb,
    mergeMap: Hb,
    mergeMapTo: function (t, e, n) {
      return (
        void 0 === n && (n = 1 / 0),
        Eg(e)
          ? Hb(
              function () {
                return t;
              },
              e,
              n
            )
          : ('number' == typeof e && (n = e),
            Hb(function () {
              return t;
            }, n))
      );
    },
    mergeScan: function (t, e, n) {
      return (
        void 0 === n && (n = 1 / 0),
        ry(function (r, i) {
          var o = e;
          return Bb(
            r,
            i,
            function (e, n) {
              return t(o, e, n);
            },
            n,
            function (t) {
              o = t;
            },
            !1,
            void 0,
            function () {
              return (o = null);
            }
          );
        })
      );
    },
    mergeWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return z_.apply(void 0, v([], h(t)));
    },
    min: function (t) {
      return c_(
        Eg(t)
          ? function (e, n) {
              return t(e, n) < 0 ? e : n;
            }
          : function (t, e) {
              return t < e ? t : e;
            }
      );
    },
    multicast: R_,
    never: function () {
      return Qb;
    },
    noop: Ig,
    observable: Gg,
    observeOn: cb,
    of: vb,
    onErrorResumeNext: n_,
    onErrorResumeNextWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      var n = e_(t);
      return function (t) {
        return n_.apply(void 0, v([t], h(n)));
      };
    },
    pairs: function (t, e) {
      return pb(Object.entries(t), e);
    },
    pairwise: function () {
      return ry(function (t, e) {
        var n,
          r = !1;
        t.subscribe(
          iy(e, function (t) {
            var i = n;
            (n = t), r && e.next([i, t]), (r = !0);
          })
        );
      });
    },
    partition: function (t, e, n) {
      return [i_(e, n)(ab(t)), i_(r_(e, n))(ab(t))];
    },
    pipe: Jg,
    pluck: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      var n = t.length;
      if (0 === n) throw new Error('list of properties cannot be empty.');
      return Sb(function (e) {
        for (var r = e, i = 0; i < n; i++) {
          var o = null == r ? void 0 : r[t[i]];
          if (void 0 === o) return;
          r = o;
        }
        return r;
      });
    },
    publish: function (t) {
      return t
        ? function (e) {
            return b_(t)(e);
          }
        : function (t) {
            return R_(new py())(t);
          };
    },
    publishBehavior: function (t) {
      return function (e) {
        var n = new my(t);
        return new sy(e, function () {
          return n;
        });
      };
    },
    publishLast: function () {
      return function (t) {
        var e = new by();
        return new sy(t, function () {
          return e;
        });
      };
    },
    publishReplay: function (t, e, n, r) {
      n && !Eg(n) && (r = n);
      var i = Eg(n) ? n : void 0;
      return function (n) {
        return R_(new yy(t, e, r), i)(n);
      };
    },
    queue: jy,
    queueScheduler: Iy,
    race: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return 1 === (t = e_(t)).length ? ab(t[0]) : new ty(o_(t));
    },
    raceWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return t.length
        ? ry(function (e, n) {
            o_(v([e], h(t)))(n);
          })
        : Kg;
    },
    range: function (t, e, n) {
      if ((null == e && ((e = t), (t = 0)), e <= 0)) return Ly;
      var r = e + t;
      return new ty(
        n
          ? function (e) {
              var i = t;
              return n.schedule(function () {
                i < r ? (e.next(i++), this.schedule()) : e.complete();
              });
            }
          : function (e) {
              for (var n = t; n < r && !e.closed; ) e.next(n++);
              e.complete();
            }
      );
    },
    reduce: c_,
    refCount: ay,
    repeat: function (t) {
      var e,
        n,
        r = 1 / 0;
      return (
        null != t && ('object' == typeof t ? ((e = t.count), (r = void 0 === e ? 1 / 0 : e), (n = t.delay)) : (r = t)),
        r <= 0
          ? function () {
              return Ly;
            }
          : ry(function (t, e) {
              var i,
                o = 0,
                a = function () {
                  if ((null == i || i.unsubscribe(), (i = null), null != n)) {
                    var t = 'number' == typeof n ? Kb(n) : ab(n(o)),
                      r = iy(e, function () {
                        r.unsubscribe(), s();
                      });
                    t.subscribe(r);
                  } else s();
                },
                s = function () {
                  var n = !1;
                  (i = t.subscribe(
                    iy(e, void 0, function () {
                      ++o < r ? (i ? a() : (n = !0)) : e.complete();
                    })
                  )),
                    n && a();
                };
              s();
            })
      );
    },
    repeatWhen: function (t) {
      return ry(function (e, n) {
        var r,
          i,
          o = !1,
          a = !1,
          s = !1,
          u = function () {
            return s && a && (n.complete(), !0);
          },
          c = function () {
            (s = !1),
              (r = e.subscribe(
                iy(n, void 0, function () {
                  (s = !0),
                    !u() &&
                      (i ||
                        ((i = new py()),
                        ab(t(i)).subscribe(
                          iy(
                            n,
                            function () {
                              r ? c() : (o = !0);
                            },
                            function () {
                              (a = !0), u();
                            }
                          )
                        )),
                      i).next();
                })
              )),
              o && (r.unsubscribe(), (r = null), (o = !1), c());
          };
        c();
      });
    },
    retry: function (t) {
      var e;
      void 0 === t && (t = 1 / 0);
      var n = (e = t && 'object' == typeof t ? t : { count: t }).count,
        r = void 0 === n ? 1 / 0 : n,
        i = e.delay,
        o = e.resetOnSuccess,
        a = void 0 !== o && o;
      return r <= 0
        ? Kg
        : ry(function (t, e) {
            var n,
              o = 0,
              s = function () {
                var u = !1;
                (n = t.subscribe(
                  iy(
                    e,
                    function (t) {
                      a && (o = 0), e.next(t);
                    },
                    void 0,
                    function (t) {
                      if (o++ < r) {
                        var a = function () {
                          n ? (n.unsubscribe(), (n = null), s()) : (u = !0);
                        };
                        if (null != i) {
                          var c = 'number' == typeof i ? Kb(i) : ab(i(t, o)),
                            l = iy(
                              e,
                              function () {
                                l.unsubscribe(), a();
                              },
                              function () {
                                e.complete();
                              }
                            );
                          c.subscribe(l);
                        } else a();
                      } else e.error(t);
                    }
                  )
                )),
                  u && (n.unsubscribe(), (n = null), s());
              };
            s();
          });
    },
    retryWhen: function (t) {
      return ry(function (e, n) {
        var r,
          i,
          o = !1,
          a = function () {
            (r = e.subscribe(
              iy(n, void 0, void 0, function (e) {
                i ||
                  ((i = new py()),
                  ab(t(i)).subscribe(
                    iy(n, function () {
                      return r ? a() : (o = !0);
                    })
                  )),
                  i && i.next(e);
              })
            )),
              o && (r.unsubscribe(), (r = null), (o = !1), a());
          };
        a();
      });
    },
    sample: I_,
    sampleTime: function (t, e) {
      return void 0 === e && (e = Oy), I_(Jb(t, e));
    },
    scan: function (t, e) {
      return ry(u_(t, e, arguments.length >= 2, !0));
    },
    scheduled: db,
    sequenceEqual: function (t, e) {
      return (
        void 0 === e &&
          (e = function (t, e) {
            return t === e;
          }),
        ry(function (n, r) {
          var i = { buffer: [], complete: !1 },
            o = { buffer: [], complete: !1 },
            a = function (t) {
              r.next(t), r.complete();
            },
            s = function (t, n) {
              var i = iy(
                r,
                function (r) {
                  var i = n.buffer,
                    o = n.complete;
                  0 === i.length ? (o ? a(!1) : t.buffer.push(r)) : !e(r, i.shift()) && a(!1);
                },
                function () {
                  t.complete = !0;
                  var e = n.complete,
                    r = n.buffer;
                  e && a(0 === r.length), null == i || i.unsubscribe();
                }
              );
              return i;
            };
          n.subscribe(s(i, o)), ab(t).subscribe(s(o, i));
        })
      );
    },
    share: j_,
    shareReplay: function (t, e, n) {
      var r,
        i,
        o,
        a,
        s = !1;
      return (
        t && 'object' == typeof t
          ? ((r = t.bufferSize),
            (a = void 0 === r ? 1 / 0 : r),
            (i = t.windowTime),
            (e = void 0 === i ? 1 / 0 : i),
            (s = void 0 !== (o = t.refCount) && o),
            (n = t.scheduler))
          : (a = null != t ? t : 1 / 0),
        j_({
          connector: function () {
            return new yy(a, e, n);
          },
          resetOnError: !0,
          resetOnComplete: !1,
          resetOnRefCountZero: s,
        })
      );
    },
    single: function (t) {
      return ry(function (e, n) {
        var r,
          i = !1,
          o = !1,
          a = 0;
        e.subscribe(
          iy(
            n,
            function (s) {
              (o = !0), (t && !t(s, a++, e)) || (i && n.error(new xb('Too many matching values')), (i = !0), (r = s));
            },
            function () {
              i ? (n.next(r), n.complete()) : n.error(o ? new wb('No matching values') : new bb());
            }
          )
        );
      });
    },
    skip: function (t) {
      return i_(function (e, n) {
        return t <= n;
      });
    },
    skipLast: function (t) {
      return t <= 0
        ? Kg
        : ry(function (e, n) {
            var r = new Array(t),
              i = 0;
            return (
              e.subscribe(
                iy(n, function (e) {
                  var o = i++;
                  if (o < t) r[o] = e;
                  else {
                    var a = o % t,
                      s = r[a];
                    (r[a] = e), n.next(s);
                  }
                })
              ),
              function () {
                r = null;
              }
            );
          });
    },
    skipUntil: function (t) {
      return ry(function (e, n) {
        var r = !1,
          i = iy(
            n,
            function () {
              null == i || i.unsubscribe(), (r = !0);
            },
            Ig
          );
        ab(t).subscribe(i),
          e.subscribe(
            iy(n, function (t) {
              return r && n.next(t);
            })
          );
      });
    },
    skipWhile: function (t) {
      return ry(function (e, n) {
        var r = !1,
          i = 0;
        e.subscribe(
          iy(n, function (e) {
            return (r || (r = !t(e, i++))) && n.next(e);
          })
        );
      });
    },
    startWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      var n = Xy(t);
      return ry(function (e, r) {
        (n ? Lb(t, e, n) : Lb(t, e)).subscribe(r);
      });
    },
    subscribeOn: lb,
    switchAll: function () {
      return B_(Kg);
    },
    switchMap: B_,
    switchMapTo: function (t, e) {
      return Eg(e)
        ? B_(function () {
            return t;
          }, e)
        : B_(function () {
            return t;
          });
    },
    switchScan: function (t, e) {
      return ry(function (n, r) {
        var i = e;
        return (
          B_(
            function (e, n) {
              return t(i, e, n);
            },
            function (t, e) {
              return (i = e), e;
            }
          )(n).subscribe(r),
          function () {
            i = null;
          }
        );
      });
    },
    take: w_,
    takeLast: D_,
    takeUntil: function (t) {
      return ry(function (e, n) {
        ab(t).subscribe(
          iy(
            n,
            function () {
              return n.complete();
            },
            Ig
          )
        ),
          !n.closed && e.subscribe(n);
      });
    },
    takeWhile: function (t, e) {
      return (
        void 0 === e && (e = !1),
        ry(function (n, r) {
          var i = 0;
          n.subscribe(
            iy(r, function (n) {
              var o = t(n, i++);
              (o || e) && r.next(n), !o && r.complete();
            })
          );
        })
      );
    },
    tap: function (t, e, n) {
      var r = Eg(t) || e || n ? { next: t, error: e, complete: n } : t;
      return r
        ? ry(function (t, e) {
            var n;
            null === (n = r.subscribe) || void 0 === n || n.call(r);
            var i = !0;
            t.subscribe(
              iy(
                e,
                function (t) {
                  var n;
                  null === (n = r.next) || void 0 === n || n.call(r, t), e.next(t);
                },
                function () {
                  var t;
                  (i = !1), null === (t = r.complete) || void 0 === t || t.call(r), e.complete();
                },
                function (t) {
                  var n;
                  (i = !1), null === (n = r.error) || void 0 === n || n.call(r, t), e.error(t);
                },
                function () {
                  var t, e;
                  i && (null === (t = r.unsubscribe) || void 0 === t || t.call(r)), null === (e = r.finalize) || void 0 === e || e.call(r);
                }
              )
            );
          })
        : Kg;
    },
    throttle: H_,
    throttleTime: function (t, e, n) {
      void 0 === e && (e = Oy);
      var r = Kb(t, e);
      return H_(function () {
        return r;
      }, n);
    },
    throwError: mb,
    throwIfEmpty: S_,
    timeInterval: function (t) {
      return (
        void 0 === t && (t = Oy),
        ry(function (e, n) {
          var r = t.now();
          e.subscribe(
            iy(n, function (e) {
              var i = t.now(),
                o = i - r;
              (r = i), n.next(new q_(e, o));
            })
          );
        })
      );
    },
    timeout: $b,
    timeoutWith: function (t, e, n) {
      var r, i, o;
      if (((n = null != n ? n : zy), Ab(t) ? (r = t) : 'number' == typeof t && (i = t), !e)) throw new TypeError('No observable provided to switch to');
      if (
        ((o = function () {
          return e;
        }),
        null == r && null == i)
      )
        throw new TypeError('No timeout provided.');
      return $b({ first: r, each: i, scheduler: n, with: o });
    },
    timer: Kb,
    timestamp: function (t) {
      return (
        void 0 === t && (t = gy),
        Sb(function (e) {
          return { value: e, timestamp: t.now() };
        })
      );
    },
    toArray: f_,
    using: function (t, e) {
      return new ty(function (n) {
        var r = t(),
          i = e(r);
        return (
          (i ? ab(i) : Ly).subscribe(n),
          function () {
            r && r.unsubscribe();
          }
        );
      });
    },
    window: function (t) {
      return ry(function (e, n) {
        var r = new py();
        n.next(r.asObservable());
        var i = function (t) {
          r.error(t), n.error(t);
        };
        return (
          e.subscribe(
            iy(
              n,
              function (t) {
                return null == r ? void 0 : r.next(t);
              },
              function () {
                r.complete(), n.complete();
              },
              i
            )
          ),
          ab(t).subscribe(
            iy(
              n,
              function () {
                r.complete(), n.next((r = new py()));
              },
              Ig,
              i
            )
          ),
          function () {
            null == r || r.unsubscribe(), (r = null);
          }
        );
      });
    },
    windowCount: function (t, e) {
      void 0 === e && (e = 0);
      var n = e > 0 ? e : t;
      return ry(function (e, r) {
        var i = [new py()],
          o = 0;
        r.next(i[0].asObservable()),
          e.subscribe(
            iy(
              r,
              function (e) {
                var a, s;
                try {
                  for (var u = f(i), c = u.next(); !c.done; c = u.next()) {
                    c.value.next(e);
                  }
                } catch (t) {
                  a = { error: t };
                } finally {
                  try {
                    c && !c.done && (s = u.return) && s.call(u);
                  } finally {
                    if (a) throw a.error;
                  }
                }
                var l = o - t + 1;
                if ((l >= 0 && l % n == 0 && i.shift().complete(), ++o % n == 0)) {
                  var h = new py();
                  i.push(h), r.next(h.asObservable());
                }
              },
              function () {
                for (; i.length > 0; ) i.shift().complete();
                r.complete();
              },
              function (t) {
                for (; i.length > 0; ) i.shift().error(t);
                r.error(t);
              },
              function () {
                null, (i = null);
              }
            )
          );
      });
    },
    windowTime: function (t) {
      for (var e, n, r = [], i = 1; i < arguments.length; i++) r[i - 1] = arguments[i];
      var o = null !== (e = Xy(r)) && void 0 !== e ? e : Oy,
        a = null !== (n = r[0]) && void 0 !== n ? n : null,
        s = r[1] || 1 / 0;
      return ry(function (e, n) {
        var r = [],
          i = !1,
          u = function (t) {
            var e = t.window,
              n = t.subs;
            e.complete(), n.unsubscribe(), kg(r, t), i && c();
          },
          c = function () {
            if (r) {
              var e = new Tg();
              n.add(e);
              var i = new py(),
                a = { window: i, subs: e, seen: 0 };
              r.push(a),
                n.next(i.asObservable()),
                ub(
                  e,
                  o,
                  function () {
                    return u(a);
                  },
                  t
                );
            }
          };
        null !== a && a >= 0 ? ub(n, o, c, a, !0) : (i = !0), c();
        var l = function (t) {
            return r.slice().forEach(t);
          },
          f = function (t) {
            l(function (e) {
              var n = e.window;
              return t(n);
            }),
              t(n),
              n.unsubscribe();
          };
        return (
          e.subscribe(
            iy(
              n,
              function (t) {
                l(function (e) {
                  e.window.next(t), s <= ++e.seen && u(e);
                });
              },
              function () {
                return f(function (t) {
                  return t.complete();
                });
              },
              function (t) {
                return f(function (e) {
                  return e.error(t);
                });
              }
            )
          ),
          function () {
            r = null;
          }
        );
      });
    },
    windowToggle: function (t, e) {
      return ry(function (n, r) {
        var i = [],
          o = function (t) {
            for (; 0 < i.length; ) i.shift().error(t);
            r.error(t);
          };
        ab(t).subscribe(
          iy(
            r,
            function (t) {
              var n = new py();
              i.push(n);
              var a,
                s = new Tg();
              try {
                a = ab(e(t));
              } catch (t) {
                return void o(t);
              }
              r.next(n.asObservable()),
                s.add(
                  a.subscribe(
                    iy(
                      r,
                      function () {
                        kg(i, n), n.complete(), s.unsubscribe();
                      },
                      Ig,
                      o
                    )
                  )
                );
            },
            Ig
          )
        ),
          n.subscribe(
            iy(
              r,
              function (t) {
                var e,
                  n,
                  r = i.slice();
                try {
                  for (var o = f(r), a = o.next(); !a.done; a = o.next()) {
                    a.value.next(t);
                  }
                } catch (t) {
                  e = { error: t };
                } finally {
                  try {
                    a && !a.done && (n = o.return) && n.call(o);
                  } finally {
                    if (e) throw e.error;
                  }
                }
              },
              function () {
                for (; 0 < i.length; ) i.shift().complete();
                r.complete();
              },
              o,
              function () {
                for (; 0 < i.length; ) i.shift().unsubscribe();
              }
            )
          );
      });
    },
    windowWhen: function (t) {
      return ry(function (e, n) {
        var r,
          i,
          o = function (t) {
            r.error(t), n.error(t);
          },
          a = function () {
            var e;
            null == i || i.unsubscribe(), null == r || r.complete(), (r = new py()), n.next(r.asObservable());
            try {
              e = ab(t());
            } catch (t) {
              return void o(t);
            }
            e.subscribe((i = iy(n, a, a, o)));
          };
        a(),
          e.subscribe(
            iy(
              n,
              function (t) {
                return r.next(t);
              },
              function () {
                r.complete(), n.complete();
              },
              o,
              function () {
                null == i || i.unsubscribe(), (r = null);
              }
            )
          );
      });
    },
    withLatestFrom: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      var n = Yy(t);
      return ry(function (e, r) {
        for (
          var i = t.length,
            o = new Array(i),
            a = t.map(function () {
              return !1;
            }),
            s = !1,
            u = function (e) {
              ab(t[e]).subscribe(
                iy(
                  r,
                  function (t) {
                    (o[e] = t), s || a[e] || ((a[e] = !0), (s = a.every(Kg)) && (a = null));
                  },
                  Ig
                )
              );
            },
            c = 0;
          c < i;
          c++
        )
          u(c);
        e.subscribe(
          iy(r, function (t) {
            if (s) {
              var e = v([t], h(o));
              r.next(n ? n.apply(void 0, v([], h(e))) : e);
            }
          })
        );
      });
    },
    zip: a_,
    zipAll: function (t) {
      return h_(a_, t);
    },
    zipWith: function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      return W_.apply(void 0, v([], h(t)));
    },
  }),
  Y_ = Oa(V_);
function X_() {
  return (
    L_ ||
      ((L_ = 1),
      (function (t) {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.State = t.MIN_ZOOMED_DATAPOINTS_HARD = void 0);
        var e = Um,
          n = Y_,
          r = Gm(),
          i = Km(),
          o = Wm(),
          a = cg,
          s = qm();
        t.MIN_ZOOMED_DATAPOINTS_HARD = 1;
        var u = (function () {
          function u(t) {
            (this.originalData = i.DataDescription.empty()),
              (this.dataArray = r.Array2D.empty()),
              (this.xDomain = o.Domain.create([])),
              (this.yDomain = o.Domain.create([])),
              (this._xAlignment = 'left'),
              (this._yAlignment = 'top'),
              (this.boxes = { wholeWorld: a.Box.create(0, 0, 1, 1), visWorld: a.Box.create(0, 0, 1, 1), canvas: a.Box.create(0, 0, 1, 1) }),
              (this.scales = (0, a.Scales)(this.boxes)),
              (this.events = {
                hover: new n.BehaviorSubject({ cell: void 0, sourceEvent: void 0 }),
                select: new n.BehaviorSubject({ cell: void 0, sourceEvent: void 0 }),
                zoom: new n.BehaviorSubject(void 0),
                resize: new n.BehaviorSubject(void 0),
                data: new n.BehaviorSubject(void 0),
                render: new n.BehaviorSubject(void 0),
              }),
              this.setData(t);
          }
          return (
            Object.defineProperty(u.prototype, 'xAlignment', {
              get: function () {
                return this._xAlignment;
              },
              enumerable: !1,
              configurable: !0,
            }),
            Object.defineProperty(u.prototype, 'yAlignment', {
              get: function () {
                return this._yAlignment;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (u.prototype.setData = function (t) {
              var e = i.DataDescription.toArray2D(t),
                n = e.array2d,
                r = e.xDomain,
                o = e.yDomain,
                a = this;
              return (a.originalData = t), (a.xDomain = r), (a.yDomain = o), a.setDataArray(n), a;
            }),
            (u.prototype.setDataArray = function (e) {
              this.dataArray = e;
              var n = a.Box.create(0, 0, e.nColumns, e.nRows),
                r = a.Box.width(n) / a.Box.width(this.boxes.wholeWorld),
                i = a.Box.height(n) / a.Box.height(this.boxes.wholeWorld);
              (this.boxes.wholeWorld = n),
                (this.boxes.visWorld = a.Box.clamp(
                  { xmin: this.boxes.visWorld.xmin * r, xmax: this.boxes.visWorld.xmax * r, ymin: this.boxes.visWorld.ymin * i, ymax: this.boxes.visWorld.ymax * i },
                  n,
                  { width: t.MIN_ZOOMED_DATAPOINTS_HARD, height: t.MIN_ZOOMED_DATAPOINTS_HARD }
                )),
                (this.scales = (0, a.Scales)(this.boxes)),
                this.events.data.next(void 0),
                this.emitZoom('setDataArray');
            }),
            (u.prototype.getPointedCell = function (t) {
              if (t) {
                var e = Math.floor(this.scales.canvasToWorld.x(t.offsetX)),
                  n = Math.floor(this.scales.canvasToWorld.y(t.offsetY));
                return { datum: r.Array2D.get(this.dataArray, e, n), x: this.xDomain.values[e], y: this.yDomain.values[n], xIndex: e, yIndex: n };
              }
            }),
            (u.prototype.emitResize = function () {
              if (this.dom) {
                var t = (0, s.getSize)(this.dom.canvas);
                this.events.resize.next(t);
              }
            }),
            (u.prototype.emitZoom = function (t) {
              var n = this.getZoomEventValue(t);
              (0, e.isEqual)(n, this.events.zoom.value) || this.events.zoom.next(n);
            }),
            (u.prototype.setAlignment = function (t, e) {
              t && (this._xAlignment = t), e && (this._yAlignment = e), this.emitZoom('setAlignment');
            }),
            (u.prototype.getZoomEventValue = function (t) {
              var n = this.boxes.visWorld;
              if (n) {
                var r = (0, e.round)(n.xmin, 9),
                  i = (0, e.round)(n.xmax, 9),
                  a = (0, e.clamp)(Math.floor(r), 0, this.dataArray.nColumns - 1),
                  s = (0, e.clamp)(Math.ceil(i) - 1, 0, this.dataArray.nColumns - 1),
                  u = (0, e.round)(n.ymin, 9),
                  l = (0, e.round)(n.ymax, 9),
                  f = (0, e.clamp)(Math.floor(u), 0, this.dataArray.nRows - 1),
                  h = (0, e.clamp)(Math.ceil(l) - 1, 0, this.dataArray.nRows - 1),
                  d = c(this.xAlignment),
                  p = c(this.yAlignment);
                return {
                  xMinIndex: r + d,
                  xMaxIndex: i + d,
                  xMin: o.Domain.interpolateValue(this.xDomain, r + d),
                  xMax: o.Domain.interpolateValue(this.xDomain, i + d),
                  xFirstVisibleIndex: a,
                  xLastVisibleIndex: s,
                  xFirstVisible: this.xDomain.values[a],
                  xLastVisible: this.xDomain.values[s],
                  yMinIndex: u + p,
                  yMaxIndex: l + p,
                  yMin: o.Domain.interpolateValue(this.yDomain, u + p),
                  yMax: o.Domain.interpolateValue(this.yDomain, l + p),
                  yFirstVisibleIndex: f,
                  yLastVisibleIndex: h,
                  yFirstVisible: this.yDomain.values[f],
                  yLastVisible: this.yDomain.values[h],
                  origin: t,
                };
              }
            }),
            (u.prototype.getIndexFromZoomRequest = function (t, n, r) {
              if (!(0, e.isNil)(r)) {
                var i = 'Min' === n ? 'First' : 'Last',
                  a = r[''.concat(t).concat(n, 'Index')],
                  s = r[''.concat(t).concat(n)],
                  u = r[''.concat(t).concat(i, 'VisibleIndex')],
                  l = r[''.concat(t).concat(i, 'Visible')],
                  f = this[''.concat(t, 'Domain')],
                  h = this[''.concat(t, 'Alignment')];
                if (
                  ([a, s, u, l].filter(function (t) {
                    return !(0, e.isNil)(t);
                  }).length > 1 &&
                    console.warn(
                      'You called zoom function with more that one of these conflicting options: '
                        .concat(t)
                        .concat(n, 'Index, ')
                        .concat(t)
                        .concat(n, ', ')
                        .concat(t)
                        .concat(i, 'VisibleIndex, ')
                        .concat(t)
                        .concat(i, 'Visible. Only the first one (in this order of precedence) will be considered.')
                    ),
                  !(0, e.isNil)(a))
                )
                  return a - c(h);
                if (!(0, e.isNil)(s)) {
                  var d = o.Domain.interpolateIndex(f, s);
                  if ((0, e.isNil)(d))
                    throw new Error(
                      ''
                        .concat(t)
                        .concat(n, ' option is not applicable for zoom function, because the ')
                        .concat(t.toUpperCase(), ' domain is not numeric or not sorted. Use one of these options instead: ')
                        .concat(t)
                        .concat(n, 'Index, ')
                        .concat(t)
                        .concat(i, 'VisibleIndex, ')
                        .concat(t)
                        .concat(i, 'Visible.')
                    );
                  return d - c(h);
                }
                if (!(0, e.isNil)(u)) {
                  if (Math.floor(u) !== u) throw new Error(''.concat(t).concat(i, 'VisibleIndex must be an integer, not ').concat(u));
                  return 'First' === i ? u : u + 1;
                }
                if (!(0, e.isNil)(l)) {
                  var p = f.index.get(l);
                  return (0, e.isNil)(p)
                    ? void console.warn('The provided value of '.concat(t).concat(i, 'Visible (').concat(l, ') is not in the ').concat(t.toUpperCase(), ' domain.'))
                    : 'First' === i
                    ? p
                    : p + 1;
                }
              }
            }),
            (u.prototype.zoom = function (e) {
              var n,
                r,
                i,
                o,
                s = a.Box.clamp(
                  {
                    xmin: null !== (n = this.getIndexFromZoomRequest('x', 'Min', e)) && void 0 !== n ? n : this.boxes.wholeWorld.xmin,
                    xmax: null !== (r = this.getIndexFromZoomRequest('x', 'Max', e)) && void 0 !== r ? r : this.boxes.wholeWorld.xmax,
                    ymin: null !== (i = this.getIndexFromZoomRequest('y', 'Min', e)) && void 0 !== i ? i : this.boxes.wholeWorld.ymin,
                    ymax: null !== (o = this.getIndexFromZoomRequest('y', 'Max', e)) && void 0 !== o ? o : this.boxes.wholeWorld.ymax,
                  },
                  this.boxes.wholeWorld,
                  { width: t.MIN_ZOOMED_DATAPOINTS_HARD, height: t.MIN_ZOOMED_DATAPOINTS_HARD }
                );
              return this.zoomVisWorldBox(s, null == e ? void 0 : e.origin), this.getZoomEventValue(null == e ? void 0 : e.origin);
            }),
            (u.prototype.zoomVisWorldBox = function (t, e, n) {
              void 0 === n && (n = !0), (this.boxes.visWorld = t), (this.scales = (0, a.Scales)(this.boxes)), n && this.emitZoom(e);
            }),
            (u.prototype.getZoom = function () {
              return this.getZoomEventValue(void 0);
            }),
            u
          );
        })();
        function c(t) {
          return 'left' === t || 'top' === t ? 0 : 'center' === t ? -0.5 : -1;
        }
        t.State = u;
      })($g)),
    $g
  );
}
var Z_,
  G_,
  K_,
  J_ = {};
function Q_() {
  if (G_) return tg;
  (G_ = 1), Object.defineProperty(tg, '__esModule', { value: !0 }), (tg.Heatmap = void 0);
  var t = Ra,
    e = Km(),
    n =
      (fg ||
        ((fg = 1),
        (function (t) {
          Object.defineProperty(t, '__esModule', { value: !0 }), (t.DrawExtension = t.DrawBehavior = t.DefaultDrawExtensionParams = void 0);
          var e = Ra,
            n = Um,
            r = Gm(),
            i = Ia,
            o = og(),
            a = ig(),
            s = ug(),
            u = cg,
            c = qm(),
            l = i.Color.fromString('#888888');
          t.DefaultDrawExtensionParams = {
            colorProvider: function () {
              return l;
            },
            xGapPixels: 2,
            xGapRelative: 0.1,
            yGapPixels: 2,
            yGapRelative: 0.1,
            minRectSizeForGaps: 2,
          };
          var f = (function (t) {
            function s() {
              var e = (null !== t && t.apply(this, arguments)) || this;
              return (
                (e.downsamplingPixelsPerRect = 1),
                (e._drawer = (0, c.Refresher)(function () {
                  return e._draw();
                })),
                e
              );
            }
            return (
              e.__extends(s, t),
              (s.prototype.register = function () {
                var e = this;
                t.prototype.register.call(this),
                  this.subscribe(this.state.events.render, function () {
                    var t;
                    if (e.state.dom) {
                      var n = null === (t = e.state.dom.canvas.node()) || void 0 === t ? void 0 : t.getContext('2d');
                      if (!n) throw new Error('Failed to initialize canvas');
                      (e.ctx = n),
                        e.state.dom.svg.on('mouseenter.DrawExtension', function () {
                          return e.requestDraw();
                        });
                    }
                  }),
                  this.subscribe(this.state.events.zoom, function () {
                    e.requestDraw();
                  }),
                  this.subscribe(this.state.events.data, function () {
                    (e.downsampler = void 0), e.requestDraw();
                  });
              }),
              (s.prototype.update = function (e) {
                e.colorProvider !== this.params.colorProvider && (this.downsampler = void 0), t.prototype.update.call(this, e), this.requestDraw();
              }),
              (s.prototype.unregister = function () {
                this.state.dom && this.state.dom.svg.on('mouseenter.DrawExtension', null), t.prototype.unregister.call(this);
              }),
              (s.prototype.computeFullImage = function () {
                for (var t = a.Image.create(this.state.dataArray.nColumns, this.state.dataArray.nRows), e = 0; e < this.state.dataArray.nRows; e++)
                  for (var n = 0; n < this.state.dataArray.nColumns; n++) {
                    var o = r.Array2D.get(this.state.dataArray, n, e);
                    if (void 0 !== o) {
                      var s = this.params.colorProvider(o, this.state.xDomain.values[n], this.state.yDomain.values[e], n, e),
                        u = 'string' == typeof s ? i.Color.fromString(s) : s;
                      a.Image.setColor(t, n, e, u);
                    }
                  }
                return t;
              }),
              (s.prototype._draw = function () {
                var t;
                if (this.state.dom) {
                  var e = u.Box.width(this.state.boxes.canvas) / this.downsamplingPixelsPerRect,
                    n = u.Box.height(this.state.boxes.canvas) / this.downsamplingPixelsPerRect;
                  (null !== (t = this.downsampler) && void 0 !== t) || (this.downsampler = o.Downsampler.fromImage(this.computeFullImage()));
                  var r = o.Downsampler.getDownsampled(this.downsampler, {
                    x: (e * u.Box.width(this.state.boxes.wholeWorld)) / u.Box.width(this.state.boxes.visWorld),
                    y: (n * u.Box.height(this.state.boxes.wholeWorld)) / u.Box.height(this.state.boxes.visWorld),
                  });
                  return this.drawThisImage(r, this.state.dataArray.nColumns / r.nColumns, this.state.dataArray.nRows / r.nRows);
                }
              }),
              (s.prototype.requestDraw = function () {
                this._drawer.requestRefresh();
              }),
              (s.prototype.getCleanCanvasImage = function () {
                if (!this.ctx) throw new Error('`getCanvasImage` should only be called after canvas is initialized');
                var t = Math.floor(this.ctx.canvas.width),
                  e = Math.floor(this.ctx.canvas.height);
                return (
                  this._canvasImage && this._canvasImage.nColumns === t && this._canvasImage.nRows === e
                    ? a.Image.clear(this._canvasImage)
                    : (this._canvasImage = a.Image.create(t, e)),
                  this._canvasImage
                );
              }),
              (s.prototype.getCanvasImageData = function () {
                if (!this.ctx) throw new Error('`getCanvasImageData` should only be called after canvas is initialized');
                var t = Math.floor(this.ctx.canvas.width),
                  e = Math.floor(this.ctx.canvas.height);
                return (
                  (this._canvasImageData && this._canvasImageData.width === t && this._canvasImageData.height === e) || (this._canvasImageData = new ImageData(t, e)),
                  this._canvasImageData
                );
              }),
              (s.prototype.drawThisImage = function (t, e, r) {
                if (this.state.dom && this.ctx) {
                  this.resizeCanvas();
                  var i = (0, u.scaleDistance)(this.state.scales.worldToCanvas.x, 1) * e,
                    o = (0, u.scaleDistance)(this.state.scales.worldToCanvas.y, 1) * r,
                    s = u.Box.width(this.state.boxes.canvas) > this.params.minRectSizeForGaps * u.Box.width(this.state.boxes.visWorld),
                    c = u.Box.height(this.state.boxes.canvas) > this.params.minRectSizeForGaps * u.Box.height(this.state.boxes.visWorld),
                    l = s ? 0.5 * this.getXGap(i) : 0,
                    f = c ? 0.5 * this.getYGap(o) : 0,
                    h = (s ? 1 : 1 - this.getXGap(i) / i) * (c ? 1 : 1 - this.getYGap(o) / o);
                  this.state.dom.canvas.style('opacity', h);
                  for (
                    var d = (0, n.clamp)(Math.floor(this.state.boxes.visWorld.xmin / e), 0, t.nColumns),
                      p = (0, n.clamp)(Math.ceil(this.state.boxes.visWorld.xmax / e), 0, t.nColumns),
                      v = (0, n.clamp)(Math.floor(this.state.boxes.visWorld.ymin / r), 0, t.nRows),
                      m = (0, n.clamp)(Math.ceil(this.state.boxes.visWorld.ymax / r), 0, t.nRows),
                      g = this.getCleanCanvasImage(),
                      y = v;
                    y < m;
                    y++
                  )
                    for (var b = this.state.scales.worldToCanvas.y(y * r), _ = b + f, w = b + o - f, x = d; x < p; x++) {
                      var A = this.state.scales.worldToCanvas.x(x * e),
                        M = A + l,
                        $ = A + i - l,
                        E = a.Image.getColor(t, x, y);
                      a.Image.addRect(g, M, _, $, w, E);
                    }
                  var S = a.Image.toImageData(g, this.getCanvasImageData());
                  this.ctx.clearRect(0, 0, u.Box.width(this.state.boxes.canvas), u.Box.height(this.state.boxes.canvas)), this.ctx.putImageData(S, 0, 0);
                }
              }),
              (s.prototype.resizeCanvas = function () {
                if (this.ctx) {
                  var t = Math.floor(u.Box.width(this.state.boxes.canvas)),
                    e = Math.floor(u.Box.height(this.state.boxes.canvas));
                  this.ctx.canvas.width !== t && (this.ctx.canvas.width = t), this.ctx.canvas.height !== e && (this.ctx.canvas.height = e);
                }
              }),
              (s.prototype.getXGap = function (t) {
                var e,
                  r = (0, n.isNil)(this.params.xGapPixels) ? void 0 : this.params.xGapPixels,
                  i = (0, n.isNil)(this.params.xGapRelative) ? void 0 : this.params.xGapRelative * t;
                return (0, n.clamp)(null !== (e = (0, c.minimum)(r, i)) && void 0 !== e ? e : 0, 0, t);
              }),
              (s.prototype.getYGap = function (t) {
                var e,
                  r = (0, n.isNil)(this.params.yGapPixels) ? void 0 : this.params.yGapPixels,
                  i = (0, n.isNil)(this.params.yGapRelative) ? void 0 : this.params.yGapRelative * t;
                return (0, n.clamp)(null !== (e = (0, c.minimum)(r, i)) && void 0 !== e ? e : 0, 0, t);
              }),
              s
            );
          })(s.BehaviorBase);
          (t.DrawBehavior = f), (t.DrawExtension = s.Extension.fromBehaviorClass({ name: 'builtin.draw', defaultParams: t.DefaultDrawExtensionParams, behavior: f }));
        })(eg)),
      eg),
    r =
      (_g ||
        ((_g = 1),
        (function (t) {
          Object.defineProperty(t, '__esModule', { value: !0 }), (t.MarkerExtension = t.MarkerBehavior = t.DefaultMarkerExtensionParams = void 0);
          var e = Ra,
            n = bg,
            r = ug(),
            i = cg,
            o = qm();
          t.DefaultMarkerExtensionParams = { markerCornerRadius: 1, freeze: !1 };
          var a = (function (t) {
            function r() {
              var e = (null !== t && t.apply(this, arguments)) || this;
              return (e.currentlyMarked = { xIndex: void 0, yIndex: void 0 }), e;
            }
            return (
              e.__extends(r, t),
              (r.prototype.register = function () {
                var e = this;
                t.prototype.register.call(this),
                  this.subscribe(this.state.events.hover, function (t) {
                    var n;
                    if (!e.params.freeze) {
                      var r = void 0 !== (null === (n = t.cell) || void 0 === n ? void 0 : n.datum);
                      e.drawMarkers(r ? t.cell : void 0);
                    }
                  }),
                  this.subscribe(this.state.events.resize, function () {
                    e.drawMarkers(e.currentlyMarked);
                  }),
                  this.subscribe(this.state.events.zoom, function () {
                    e.drawMarkers(e.currentlyMarked);
                  });
              }),
              (r.prototype.drawMarkers = function (t) {
                if (this.state.dom) {
                  var e = void 0 !== (null == t ? void 0 : t.xIndex) ? t.xIndex : this.state.xDomain.index.get(null == t ? void 0 : t.x),
                    r = void 0 !== (null == t ? void 0 : t.yIndex) ? t.yIndex : this.state.yDomain.index.get(null == t ? void 0 : t.y);
                  (this.currentlyMarked.xIndex = e), (this.currentlyMarked.yIndex = r);
                  var o = void 0 !== e ? this.state.scales.worldToCanvas.x(e) : void 0,
                    a = void 0 !== r ? this.state.scales.worldToCanvas.y(r) : void 0,
                    s = (0, i.scaleDistance)(this.state.scales.worldToCanvas.x, 1),
                    u = (0, i.scaleDistance)(this.state.scales.worldToCanvas.y, 1),
                    c = { rx: this.params.markerCornerRadius, ry: this.params.markerCornerRadius };
                  void 0 !== o
                    ? this.addOrUpdateMarker(n.Class.MarkerX, c, { x: o, y: this.state.boxes.canvas.ymin, width: s, height: i.Box.height(this.state.boxes.canvas) })
                    : this.removeMarker(n.Class.MarkerX),
                    void 0 !== a
                      ? this.addOrUpdateMarker(n.Class.MarkerY, c, { x: this.state.boxes.canvas.xmin, y: a, width: i.Box.width(this.state.boxes.canvas), height: u })
                      : this.removeMarker(n.Class.MarkerY),
                    void 0 !== o && void 0 !== a ? this.addOrUpdateMarker(n.Class.Marker, c, { x: o, y: a, width: s, height: u }) : this.removeMarker(n.Class.Marker);
                }
              }),
              (r.prototype.addOrUpdateMarker = function (t, n, r) {
                if (this.state.dom) {
                  var i = this.state.dom.svg.selectAll('.' + t).data([1]);
                  (0, o.attrd)(i.enter().append('rect'), e.__assign(e.__assign({ class: t }, n), r)), (0, o.attrd)(i, r);
                }
              }),
              (r.prototype.removeMarker = function (t) {
                this.state.dom && this.state.dom.svg.selectAll('.' + t).remove();
              }),
              r
            );
          })(r.BehaviorBase);
          (t.MarkerBehavior = a),
            (t.MarkerExtension = r.Extension.fromBehaviorClass({ name: 'builtin.marker', defaultParams: t.DefaultMarkerExtensionParams, behavior: a }));
        })(yg)),
      yg),
    i =
      (xg ||
        ((xg = 1),
        (function (t) {
          Object.defineProperty(t, '__esModule', { value: !0 }), (t.TooltipExtension = t.TooltipBehavior = t.DefaultTooltipExtensionParams = void 0);
          var e = Ra,
            n = bg,
            r = ug(),
            i = cg,
            o = qm();
          t.DefaultTooltipExtensionParams = {
            tooltipProvider: function (t, e, n, r, i) {
              return 'x: '
                .concat(JSON.stringify(e), ' (index ')
                .concat(r, ') <br> y: ')
                .concat(JSON.stringify(n), ' (index ')
                .concat(i, ') <br> datum: ')
                .concat(JSON.stringify(t));
            },
            pinnable: !0,
          };
          var a = (function (t) {
            function r() {
              var e = (null !== t && t.apply(this, arguments)) || this;
              return (e.pinnedTooltip = void 0), e;
            }
            return (
              e.__extends(r, t),
              (r.prototype.register = function () {
                var e = this;
                t.prototype.register.call(this),
                  this.subscribe(this.state.events.hover, function (t) {
                    return e.drawTooltip(t);
                  }),
                  this.subscribe(this.state.events.select, function (t) {
                    return e.drawPinnedTooltip(t);
                  }),
                  this.subscribe(this.state.events.zoom, function () {
                    return e.updatePinnedTooltipPosition();
                  }),
                  this.subscribe(this.state.events.resize, function () {
                    return e.updatePinnedTooltipPosition();
                  });
              }),
              (r.prototype.drawTooltip = function (t) {
                var r;
                if (this.state.dom) {
                  var i = t.cell && this.pinnedTooltip && t.cell.xIndex === Math.floor(this.pinnedTooltip.x) && t.cell.yIndex === Math.floor(this.pinnedTooltip.y);
                  if (void 0 !== (null === (r = t.cell) || void 0 === r ? void 0 : r.datum) && !i && this.params.tooltipProvider && t.sourceEvent) {
                    var a = this.getTooltipPosition(t.sourceEvent),
                      s = this.params.tooltipProvider(t.cell.datum, t.cell.x, t.cell.y, t.cell.xIndex, t.cell.yIndex),
                      u = this.state.dom.canvasDiv.selectAll('.' + n.Class.TooltipBox);
                    u.empty()
                      ? ((u = (0, o.attrd)(this.state.dom.canvasDiv.append('div'), { class: n.Class.TooltipBox, style: e.__assign({ position: 'absolute' }, a) })),
                        (0, o.attrd)(u.append('div'), { class: n.Class.TooltipContent }).html(s))
                      : (0, o.attrd)(u, { style: a })
                          .select('.' + n.Class.TooltipContent)
                          .html(s);
                  } else this.state.dom.canvasDiv.selectAll('.' + n.Class.TooltipBox).remove();
                }
              }),
              (r.prototype.drawPinnedTooltip = function (t) {
                var r,
                  i = this;
                if (this.state.dom)
                  if (
                    (this.state.dom.canvasDiv.selectAll('.' + n.Class.PinnedTooltipBox).remove(),
                    void 0 !== (null === (r = t.cell) || void 0 === r ? void 0 : r.datum) && this.params.tooltipProvider && this.params.pinnable && t.sourceEvent)
                  ) {
                    this.pinnedTooltip = { x: this.state.scales.canvasToWorld.x(t.sourceEvent.offsetX), y: this.state.scales.canvasToWorld.y(t.sourceEvent.offsetY) };
                    var a = this.getTooltipPosition(t.sourceEvent),
                      s = this.params.tooltipProvider(t.cell.datum, t.cell.x, t.cell.y, t.cell.xIndex, t.cell.yIndex),
                      u = (0, o.attrd)(this.state.dom.canvasDiv.append('div'), { class: n.Class.PinnedTooltipBox, style: e.__assign({ position: 'absolute' }, a) });
                    (0, o.attrd)(u.append('div'), { class: n.Class.PinnedTooltipContent }).html(s),
                      (0, o.attrd)(u.append('div'), { class: n.Class.PinnedTooltipClose })
                        .on('click.TooltipExtension', function (t) {
                          return i.state.events.select.next({ cell: void 0, sourceEvent: t });
                        })
                        .append('svg')
                        .attr('viewBox', '0 0 24 24')
                        .attr('preserveAspectRatio', 'none')
                        .append('path')
                        .attr('d', 'M19,6.41 L17.59,5 L12,10.59 L6.41,5 L5,6.41 L10.59,12 L5,17.59 L6.41,19 L12,13.41 L17.59,19 L19,17.59 L13.41,12 L19,6.41 Z'),
                      (0, o.attrd)(u.append('svg'), { class: n.Class.PinnedTooltipPin })
                        .attr('viewBox', '0 0 100 100')
                        .attr('preserveAspectRatio', 'none')
                        .append('path')
                        .attr('d', 'M0,100 L100,40 L60,0 Z'),
                      this.drawTooltip({ cell: void 0, sourceEvent: t.sourceEvent });
                  } else this.pinnedTooltip = void 0;
              }),
              (r.prototype.updatePinnedTooltipPosition = function () {
                if (this.state.dom && this.pinnedTooltip) {
                  var t = { offsetX: this.state.scales.worldToCanvas.x(this.pinnedTooltip.x), offsetY: this.state.scales.worldToCanvas.y(this.pinnedTooltip.y) };
                  (0, o.attrd)(this.state.dom.canvasDiv.selectAll('.' + n.Class.PinnedTooltipBox), { style: this.getTooltipPosition(t) });
                }
              }),
              (r.prototype.getTooltipPosition = function (t) {
                var e, n;
                return {
                  left: ''.concat(null !== (e = t.offsetX) && void 0 !== e ? e : 0, 'px'),
                  bottom: ''.concat(i.Box.height(this.state.boxes.canvas) - (null !== (n = t.offsetY) && void 0 !== n ? n : 0), 'px'),
                  display: i.Box.containsPoint(this.state.boxes.canvas, { x: t.offsetX, y: t.offsetY }) ? 'unset' : 'none',
                };
              }),
              r
            );
          })(r.BehaviorBase);
          (t.TooltipBehavior = a),
            (t.TooltipExtension = r.Extension.fromBehaviorClass({ name: 'builtin.tooltip', defaultParams: t.DefaultTooltipExtensionParams, behavior: a }));
        })(Ag)),
      Ag),
    o =
      (F_ ||
        ((F_ = 1),
        (function (t) {
          Object.defineProperty(t, '__esModule', { value: !0 }), (t.ZoomExtension = t.ZoomBehavior = t.DefaultZoomExtensionParams = void 0);
          var e = Ra,
            n = bg,
            r = e.__importStar(Pm()),
            i = ug(),
            o = cg,
            a = X_(),
            s = qm();
          t.DefaultZoomExtensionParams = { axis: 'none', scrollRequireCtrl: !1, zoomSensitivity: 1, panSensitivity: 0.6, minZoomedDatapoints: 1 };
          var u = (function (i) {
            function u() {
              var t = (null !== i && i.apply(this, arguments)) || this;
              return (t.currentWheelGesture = { lastTimestamp: 0, lastAbsDelta: 0, ctrlKey: !1, shiftKey: !1, altKey: !1, metaKey: !1 }), (t.suppressEmit = !1), t;
            }
            return (
              e.__extends(u, i),
              Object.defineProperty(u.prototype, 'targetElement', {
                get: function () {
                  var t;
                  return null === (t = this.state.dom) || void 0 === t ? void 0 : t.svg;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (u.prototype.register = function () {
                var e = this;
                i.prototype.register.call(this),
                  this.subscribe(this.state.events.render, function () {
                    return e.addZoomBehavior();
                  }),
                  this.subscribe(this.state.events.data, function () {
                    e.adjustZoomExtent(), e.adjustZoom();
                  }),
                  this.subscribe(this.state.events.resize, function () {
                    e.adjustZoomExtent(), e.adjustZoom();
                  }),
                  this.subscribe(this.state.events.zoom, function (n) {
                    (null == n ? void 0 : n.origin) !== t.ZoomExtension.name && e.adjustZoom();
                  });
              }),
              (u.prototype.update = function (t) {
                var e = void 0 !== t.axis && t.axis !== this.params.axis;
                i.prototype.update.call(this, t), e && this.addZoomBehavior(), this.adjustZoomExtent(), this.adjustZoom();
              }),
              (u.prototype.addZoomBehavior = function () {
                var t = this;
                this.targetElement &&
                  (this.zoomBehavior &&
                    (this.zoomBehavior.on('zoom', null),
                    this.targetElement.on('.zoom', null),
                    this.targetElement.on('.customzoom', null),
                    (this.zoomBehavior = void 0)),
                  'none' !== this.params.axis &&
                    ((this.zoomBehavior = r.zoom()),
                    this.zoomBehavior.filter(function (e) {
                      return !(e instanceof WheelEvent) || 'zoom' === t.wheelAction(e).kind;
                    }),
                    this.zoomBehavior.wheelDelta(function (e) {
                      var n = t.wheelAction(e);
                      return 'zoom' === n.kind ? t.params.zoomSensitivity * n.delta : 0;
                    }),
                    this.zoomBehavior.on('zoom', function (e) {
                      return t.handleZoom(e);
                    }),
                    this.targetElement.call(this.zoomBehavior),
                    this.targetElement.on('wheel.customzoom', function (e) {
                      return t.handleWheel(e);
                    })));
              }),
              (u.prototype.handleZoom = function (e) {
                var n = this.zoomTransformToVisWorld(e.transform);
                this.state.zoomVisWorldBox(n, t.ZoomExtension.name, !this.suppressEmit),
                  e.sourceEvent && this.state.events.hover.next({ cell: this.state.getPointedCell(e.sourceEvent), sourceEvent: e.sourceEvent });
              }),
              (u.prototype.handleWheel = function (t) {
                if (this.targetElement) {
                  if ((t.preventDefault(), this.updateCurrentWheelGesture(t), this.zoomBehavior)) {
                    var e = this.wheelAction(t);
                    if ('pan' === e.kind) {
                      var n = this.params.panSensitivity * (0, o.scaleDistance)(this.state.scales.canvasToWorld.x, e.deltaX);
                      this.zoomBehavior.duration(1e3).translateBy(this.targetElement, n, 0);
                    }
                    'showHelp' === e.kind && this.showScrollingMessage();
                  }
                  this.state.events.hover.next({ cell: this.state.getPointedCell(t), sourceEvent: t });
                }
              }),
              (u.prototype.updateCurrentWheelGesture = function (t) {
                var e = Date.now(),
                  n = Math.max(Math.abs(t.deltaX), Math.abs(t.deltaY));
                (e > this.currentWheelGesture.lastTimestamp + 150 || n > this.currentWheelGesture.lastAbsDelta + 1) &&
                  ((this.currentWheelGesture.ctrlKey = t.ctrlKey),
                  (this.currentWheelGesture.shiftKey = t.shiftKey),
                  (this.currentWheelGesture.altKey = t.altKey),
                  (this.currentWheelGesture.metaKey = t.metaKey)),
                  (this.currentWheelGesture.lastTimestamp = e),
                  (this.currentWheelGesture.lastAbsDelta = n);
              }),
              (u.prototype.adjustZoomExtent = function () {
                if (this.state.dom && this.zoomBehavior) {
                  this.zoomBehavior.translateExtent([
                    [this.state.boxes.wholeWorld.xmin, -1 / 0],
                    [this.state.boxes.wholeWorld.xmax, 1 / 0],
                  ]);
                  var t = o.Box.width(this.state.boxes.canvas),
                    e = t / o.Box.width(this.state.boxes.wholeWorld),
                    n = Math.max(this.params.minZoomedDatapoints, a.MIN_ZOOMED_DATAPOINTS_HARD),
                    r = Math.max(t / n, e);
                  this.zoomBehavior.scaleExtent([e, r]),
                    this.zoomBehavior.extent([
                      [this.state.boxes.canvas.xmin, this.state.boxes.canvas.ymin],
                      [this.state.boxes.canvas.xmax, this.state.boxes.canvas.ymax],
                    ]);
                }
              }),
              (u.prototype.adjustZoom = function () {
                if (this.targetElement && this.zoomBehavior) {
                  var t = this.visWorldToZoomTransform(this.state.boxes.visWorld);
                  (this.suppressEmit = !0), this.zoomBehavior.transform(this.targetElement, t), (this.suppressEmit = !1);
                }
              }),
              (u.prototype.zoomTransformToVisWorld = function (t) {
                return e.__assign(e.__assign({}, this.state.boxes.visWorld), {
                  xmin: (this.state.boxes.canvas.xmin - t.x) / t.k,
                  xmax: (this.state.boxes.canvas.xmax - t.x) / t.k,
                });
              }),
              (u.prototype.visWorldToZoomTransform = function (t) {
                var e = (this.state.boxes.canvas.xmax - this.state.boxes.canvas.xmin) / (t.xmax - t.xmin),
                  n = this.state.boxes.canvas.xmin - e * t.xmin;
                return new r.ZoomTransform(e, n, 0);
              }),
              (u.prototype.showScrollingMessage = function () {
                if (this.state.dom && this.state.dom.mainDiv.selectAll('.'.concat(n.Class.Overlay)).empty()) {
                  var t = (0, s.attrd)(this.state.dom.mainDiv.append('div'), { class: n.Class.Overlay });
                  (0, s.attrd)(t.append('div'), { class: n.Class.OverlayShade }),
                    (0, s.attrd)(t.append('div'), { class: n.Class.OverlayMessage }).text('Press Ctrl and scroll to apply zoom'),
                    setTimeout(function () {
                      return t.remove();
                    }, 750);
                }
              }),
              (u.prototype.wheelAction = function (t) {
                var e = Math.abs(t.deltaX) > Math.abs(t.deltaY),
                  n = Math.abs(t.deltaX) < Math.abs(t.deltaY),
                  r = 1 === t.deltaMode ? 25 : t.deltaMode ? 500 : 1,
                  i = this.params.scrollRequireCtrl ? 1 : this.currentWheelGesture.ctrlKey || this.currentWheelGesture.metaKey ? 10 : 1;
                return e
                  ? { kind: 'pan', deltaX: -t.deltaX * r * i, deltaY: 0 }
                  : n
                  ? this.currentWheelGesture.shiftKey
                    ? { kind: 'pan', deltaX: -t.deltaY * r * i, deltaY: 0 }
                    : !this.params.scrollRequireCtrl || this.currentWheelGesture.ctrlKey || this.currentWheelGesture.metaKey
                    ? { kind: 'zoom', delta: 0.002 * -t.deltaY * r * i }
                    : Math.abs(t.deltaY) * r >= 5
                    ? { kind: 'showHelp' }
                    : { kind: 'ignore' }
                  : { kind: 'ignore' };
              }),
              u
            );
          })(i.BehaviorBase);
          (t.ZoomBehavior = u), (t.ZoomExtension = i.Extension.fromBehaviorClass({ name: 'builtin.zoom', defaultParams: t.DefaultZoomExtensionParams, behavior: u }));
        })(Mg)),
      Mg),
    a = (function () {
      if (Z_) return J_;
      (Z_ = 1), Object.defineProperty(J_, '__esModule', { value: !0 }), (J_.HeatmapCore = void 0);
      var t = bg,
        e = Ra.__importStar(Pm()),
        n = cg,
        r = X_(),
        i = qm(),
        o = (function () {
          function o(t) {
            var e = this;
            (this.state = new r.State(t)),
              this.state.events.resize.subscribe(function (t) {
                if (t) {
                  var r = n.Box.create(0, 0, t.width, t.height);
                  (e.state.boxes.canvas = r), (e.state.scales = (0, n.Scales)(e.state.boxes));
                }
              });
          }
          return (
            (o.prototype.registerExtension = function (t, e) {
              var n = t.create(this.state, e);
              return n.register(), n;
            }),
            (o.prototype.render = function (n) {
              var r = this;
              if (this.state.dom)
                throw (
                  (console.error('This '.concat(this.constructor.name, ' has already been rendered in element'), this.state.dom.rootDiv.node()),
                  new Error('This '.concat(this.constructor.name, ' has already been rendered. Cannot render again.')))
                );
              var o = 'string' == typeof n ? e.select('#'.concat(n)) : e.select(n);
              if (o.empty()) throw new Error('Failed to initialize, wrong div ID?');
              this.remove();
              var a = (0, i.attrd)(o.append('div'), { class: t.Class.MainDiv, style: { position: 'relative', width: '100%', height: '100%' } }),
                s = (0, i.attrd)(a.append('div'), { class: t.Class.CanvasDiv, style: { position: 'absolute', width: '100%', height: '100%' } }),
                u = (0, i.attrd)(s.append('canvas'), {
                  class: t.Class.Canvas,
                  width: 100,
                  height: 100,
                  style: { position: 'absolute', width: '100%', height: '100%' },
                }),
                c = (0, i.attrd)(s.append('svg'), { class: t.Class.Svg, style: { position: 'absolute', width: '100%', height: '100%' } });
              return (
                (this.state.dom = { rootDiv: o, mainDiv: a, canvasDiv: s, canvas: u, svg: c }),
                c.on('mousemove.heatmapcore', function (t) {
                  return r.state.events.hover.next({ cell: r.state.getPointedCell(t), sourceEvent: t });
                }),
                c.on('mouseleave.heatmapcore', function (t) {
                  return r.state.events.hover.next({ cell: void 0, sourceEvent: t });
                }),
                c.on('click.heatmapcore', function (t) {
                  return r.state.events.select.next({ cell: r.state.getPointedCell(t), sourceEvent: t });
                }),
                this.state.events.render.next(void 0),
                this.state.emitResize(),
                e.select(window).on('resize.resizeheatmapcanvas', function () {
                  return r.state.emitResize();
                }),
                this
              );
            }),
            (o.prototype.remove = function () {
              this.state.dom && this.state.dom.rootDiv.select('*').remove();
            }),
            o
          );
        })();
      return (J_.HeatmapCore = o), J_;
    })(),
    s = (function (a) {
      function s() {
        var t = (null !== a && a.apply(this, arguments)) || this;
        return (t.extensions = {}), t;
      }
      return (
        t.__extends(s, a),
        Object.defineProperty(s.prototype, 'events', {
          get: function () {
            return this.state.events;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (s.create = function (t) {
          void 0 === t && (t = e.DataDescription.empty());
          var a = new this(t);
          return (
            (a.extensions.marker = a.registerExtension(r.MarkerExtension)),
            (a.extensions.tooltip = a.registerExtension(i.TooltipExtension)),
            (a.extensions.draw = a.registerExtension(n.DrawExtension)),
            (a.extensions.zoom = a.registerExtension(o.ZoomExtension)),
            a
          );
        }),
        (s.prototype.setData = function (t) {
          return this.state.setData(t), this;
        }),
        (s.prototype.setDomains = function (e, n) {
          return (
            this.setData(
              t.__assign(t.__assign({}, this.state.originalData), {
                xDomain: null != e ? e : this.state.originalData.xDomain,
                yDomain: null != n ? n : this.state.originalData.yDomain,
              })
            ),
            this
          );
        }),
        (s.prototype.setFilter = function (e) {
          return this.setData(t.__assign(t.__assign({}, this.state.originalData), { filter: e })), this;
        }),
        (s.prototype.setColor = function (t) {
          var e;
          return null === (e = this.extensions.draw) || void 0 === e || e.update({ colorProvider: t }), this;
        }),
        (s.prototype.setTooltip = function (t) {
          var e;
          return (
            null === (e = this.extensions.tooltip) ||
              void 0 === e ||
              e.update({ tooltipProvider: 'default' === t ? i.DefaultTooltipExtensionParams.tooltipProvider : t }),
            this
          );
        }),
        (s.prototype.setVisualParams = function (t) {
          var e, n;
          return (
            null === (e = this.extensions.draw) ||
              void 0 === e ||
              e.update({
                xGapPixels: t.xGapPixels,
                xGapRelative: t.xGapRelative,
                yGapPixels: t.yGapPixels,
                yGapRelative: t.yGapRelative,
                minRectSizeForGaps: t.minRectSizeForGaps,
              }),
            null === (n = this.extensions.marker) || void 0 === n || n.update({ markerCornerRadius: t.markerCornerRadius }),
            this
          );
        }),
        (s.prototype.setZooming = function (t) {
          var e;
          return null === (e = this.extensions.zoom) || void 0 === e || e.update(t), this;
        }),
        (s.prototype.setAlignment = function (t, e) {
          return this.state.setAlignment(t, e), this;
        }),
        (s.prototype.zoom = function (t) {
          return this.state.zoom(t);
        }),
        (s.prototype.getZoom = function () {
          return this.state.getZoom();
        }),
        s
      );
    })(a.HeatmapCore);
  return (tg.Heatmap = s), tg;
}
function tw() {
  return (
    K_ ||
      ((K_ = 1),
      (function (t) {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.Heatmap = t.demos = t.ColorScale = t.Color = void 0);
        var e = Ra,
          n = Ia;
        Object.defineProperty(t, 'Color', {
          enumerable: !0,
          get: function () {
            return n.Color;
          },
        });
        var r = zm;
        Object.defineProperty(t, 'ColorScale', {
          enumerable: !0,
          get: function () {
            return r.ColorScale;
          },
        }),
          (t.demos = e.__importStar(
            (function () {
              if (Vm) return Ym;
              (Vm = 1),
                Object.defineProperty(Ym, '__esModule', { value: !0 }),
                (Ym.demo1 = function (e) {
                  var r = t.Heatmap.create({
                      xDomain: [1, 2, 3, 4],
                      yDomain: ['A', 'B', 'C'],
                      data: [
                        { col: 1, row: 'A', score: 0 },
                        { col: 1, row: 'B', score: 0.2 },
                        { col: 1, row: 'C', score: 0.4 },
                        { col: 2, row: 'A', score: 0.6 },
                        { col: 2, row: 'B', score: 0.8 },
                        { col: 2, row: 'C', score: 1 },
                        { col: 3, row: 'A', score: 0.3 },
                        { col: 3, row: 'C', score: 0.7 },
                        { col: 4, row: 'B', score: 0.5 },
                      ],
                      x: function (t) {
                        return t.col;
                      },
                      y: function (t) {
                        return t.row;
                      },
                      filter: function (t, e, n, r, i) {
                        return t.score > 0;
                      },
                    }),
                    i = t.ColorScale.continuous([0, 0.5, 1], ['#eeeeee', 'gold', 'red']);
                  r.setColor(function (t) {
                    return i(t.score);
                  }),
                    r.setTooltip(function (t, e, n, r, i) {
                      return '<div style="font-weight: bold; margin-bottom: 0.5em;">Score: '
                        .concat(t.score, '</div>Column ')
                        .concat(e, ', Row ')
                        .concat(n, '<br>Indices [')
                        .concat(r, ',')
                        .concat(i, ']');
                    }),
                    setTimeout(function () {
                      return r.setFilter(void 0);
                    }, 2e3),
                    r.setVisualParams({ xGapPixels: 0, yGapPixels: 0 }),
                    r.events.select.subscribe(function (t) {
                      t.cell
                        ? console.log('selecting', t.cell.datum, t.cell.x, t.cell.y, t.cell.xIndex, t.cell.yIndex, t.sourceEvent)
                        : console.log('selecting nothing');
                    }),
                    r.events.zoom.subscribe(function (t) {
                      t && (n('#xminindex', t.xMinIndex), n('#xmaxindex', t.xMaxIndex), n('#xmin', t.xMin), n('#xmax', t.xMax));
                    }),
                    r.setZooming({ axis: 'x' }),
                    r.render(e),
                    (window.heatmap = r);
                }),
                (Ym.demo2 = function (n) {
                  var r = e.DataDescription.createDummy(2e5, 20),
                    i = t.Heatmap.create(r);
                  i.setVisualParams({ xGapRelative: 0, yGapRelative: 0 }),
                    i.setColor(t.ColorScale.continuous('Magma', [0, 1])),
                    i.render(n),
                    i.setZooming({ axis: 'x' }),
                    (window.heatmap = i);
                }),
                (Ym.demo3 = function (e) {
                  var n = t.Heatmap.create({
                      xDomain: [1, 2, 3],
                      yDomain: ['A', 'B', 'C'],
                      data: [
                        { col: 1, row: 'A', score: 0.6 },
                        { col: 1, row: 'B', score: 0.4 },
                        { col: 1, row: 'C', score: -1 },
                        { col: 2, row: 'B', score: 0.6 },
                        { col: 3, row: 'A', score: 0.6 },
                        { col: 3, row: 'B', score: 0.8 },
                        { col: 3, row: 'C', score: 1 },
                      ],
                      x: function (t) {
                        return t.col;
                      },
                      y: function (t) {
                        return t.row;
                      },
                    }),
                    r = t.ColorScale.continuous([-1, 0, 1], ['#E13D3D', 'white', '#2C8C11']);
                  n.setColor(function (t) {
                    return r(t.score);
                  }),
                    n.setVisualParams({ xGapRelative: 0.1, yGapRelative: 0.1, xGapPixels: null, yGapPixels: null }),
                    n.render(e),
                    (window.heatmap = n);
                });
              var t = tw(),
                e = Km();
              function n(t, e, n) {
                void 0 === n && (n = 4);
                var r = document.querySelectorAll(t);
                'number' == typeof e && n >= 0 && (e = e.toFixed(n)),
                  r.forEach(function (t) {
                    return (t.textContent = ''.concat(e));
                  });
              }
              return Ym;
            })()
          ));
        var i = Q_();
        Object.defineProperty(t, 'Heatmap', {
          enumerable: !0,
          get: function () {
            return i.Heatmap;
          },
        });
      })(za)),
    za
  );
}
var ew = tw();
function nw(t) {
  return t;
}
var rw = 1,
  iw = 2,
  ow = 3,
  aw = 4,
  sw = 1e-6;
function uw(t) {
  return 'translate(' + t + ',0)';
}
function cw(t) {
  return 'translate(0,' + t + ')';
}
function lw(t) {
  return (e) => +t(e);
}
function fw(t, e) {
  return (e = Math.max(0, t.bandwidth() - 2 * e) / 2), t.round() && (e = Math.round(e)), (n) => +t(n) + e;
}
function hw() {
  return !this.__axis;
}
function dw(t, e) {
  var n = [],
    r = null,
    i = null,
    o = 6,
    a = 6,
    s = 3,
    u = 'undefined' != typeof window && window.devicePixelRatio > 1 ? 0 : 0.5,
    c = t === rw || t === aw ? -1 : 1,
    l = t === aw || t === iw ? 'x' : 'y',
    f = t === rw || t === ow ? uw : cw;
  function h(h) {
    var d = r ?? (e.ticks ? e.ticks.apply(e, n) : e.domain()),
      p = i ?? (e.tickFormat ? e.tickFormat.apply(e, n) : nw),
      v = Math.max(o, 0) + s,
      m = e.range(),
      g = +m[0] + u,
      y = +m[m.length - 1] + u,
      b = (e.bandwidth ? fw : lw)(e.copy(), u),
      _ = h.selection ? h.selection() : h,
      w = _.selectAll('.domain').data([null]),
      x = _.selectAll('.tick').data(d, e).order(),
      A = x.exit(),
      M = x.enter().append('g').attr('class', 'tick'),
      $ = x.select('line'),
      E = x.select('text');
    (w = w.merge(w.enter().insert('path', '.tick').attr('class', 'domain').attr('stroke', 'currentColor'))),
      (x = x.merge(M)),
      ($ = $.merge(
        M.append('line')
          .attr('stroke', 'currentColor')
          .attr(l + '2', c * o)
      )),
      (E = E.merge(
        M.append('text')
          .attr('fill', 'currentColor')
          .attr(l, c * v)
          .attr('dy', t === rw ? '0em' : t === ow ? '0.71em' : '0.32em')
      )),
      h !== _ &&
        ((w = w.transition(h)),
        (x = x.transition(h)),
        ($ = $.transition(h)),
        (E = E.transition(h)),
        (A = A.transition(h)
          .attr('opacity', sw)
          .attr('transform', function (t) {
            return isFinite((t = b(t))) ? f(t + u) : this.getAttribute('transform');
          })),
        M.attr('opacity', sw).attr('transform', function (t) {
          var e = this.parentNode.__axis;
          return f((e && isFinite((e = e(t))) ? e : b(t)) + u);
        })),
      A.remove(),
      w.attr(
        'd',
        t === aw || t === iw
          ? a
            ? 'M' + c * a + ',' + g + 'H' + u + 'V' + y + 'H' + c * a
            : 'M' + u + ',' + g + 'V' + y
          : a
          ? 'M' + g + ',' + c * a + 'V' + u + 'H' + y + 'V' + c * a
          : 'M' + g + ',' + u + 'H' + y
      ),
      x.attr('opacity', 1).attr('transform', function (t) {
        return f(b(t) + u);
      }),
      $.attr(l + '2', c * o),
      E.attr(l, c * v).text(p),
      _.filter(hw)
        .attr('fill', 'none')
        .attr('font-size', 10)
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', t === iw ? 'start' : t === aw ? 'end' : 'middle'),
      _.each(function () {
        this.__axis = b;
      });
  }
  return (
    (h.scale = function (t) {
      return arguments.length ? ((e = t), h) : e;
    }),
    (h.ticks = function () {
      return (n = Array.from(arguments)), h;
    }),
    (h.tickArguments = function (t) {
      return arguments.length ? ((n = null == t ? [] : Array.from(t)), h) : n.slice();
    }),
    (h.tickValues = function (t) {
      return arguments.length ? ((r = null == t ? null : Array.from(t)), h) : r && r.slice();
    }),
    (h.tickFormat = function (t) {
      return arguments.length ? ((i = t), h) : i;
    }),
    (h.tickSize = function (t) {
      return arguments.length ? ((o = a = +t), h) : o;
    }),
    (h.tickSizeInner = function (t) {
      return arguments.length ? ((o = +t), h) : o;
    }),
    (h.tickSizeOuter = function (t) {
      return arguments.length ? ((a = +t), h) : a;
    }),
    (h.tickPadding = function (t) {
      return arguments.length ? ((s = +t), h) : s;
    }),
    (h.offset = function (t) {
      return arguments.length ? ((u = +t), h) : u;
    }),
    h
  );
}
const pw = (t) => parseInt(t, 16);
let vw = class extends ie(So(re(ee(Jt(Gt(ue(Pa))))))) {
  constructor() {
    super(...arguments), (this['hm-highlight-width'] = 0), (this['highlight-fill'] = 0), (this.firstZoom = !1);
  }
  connectedCallback() {
    super.connectedCallback();
  }
  applyZoomTranslation() {
    this.zoomRefreshed();
  }
  zoomRefreshed() {
    this.triggerHeatmapZoom(), this.updateHighlight();
  }
  updateHighlight() {
    this.triggerHeatmapHighlight();
  }
  render() {
    const t = {
        width: this.width + 'px',
        paddingLeft: this['margin-left'] + 'px',
        paddingRight: this['margin-right'] + 'px',
        paddingTop: this['margin-top'] + 'px',
        paddingBottom: this['margin-bottom'] + 'px',
      },
      e = { width: this.width - this['margin-left'] - this['margin-right'] + 'px', height: this.height + 'px', zIndex: 1 },
      n = { width: this.width - 20 + 'px', textAlign: 'center' };
    let r = this['highlight-color'],
      i = this['highlight-fill'];
    const o = this['hm-highlight-width'],
      a = ((t) => {
        let e = null;
        return (
          7 === t.length && (e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t)),
          9 === t.length && (e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t)),
          e ? { r: pw(e[1]), g: pw(e[2]), b: pw(e[3]), a: 9 === t.length ? pw(e[4]) : void 0 } : null
        );
      })(this['highlight-color']);
    return (
      a && (r = `rgb(${a.r}, ${a.g}, ${a.b})`),
      this.heatmapData
        ? yt`
        <style>
          #${this['heatmap-id']} {
            /** Position of bottom-left corner of tooltip box relative to the mouse position */
            --tooltip-offset-x: 5px;
            /** Position of bottom-left corner of tooltip box relative to the mouse position */
            --tooltip-offset-y: 8px;
          }
          .heatmap-marker-x {
            fill: ${r} !important;
            fill-opacity: ${i} !important;
            stroke-width: ${o} !important;
          }
          .heatmap-marker-y {
            fill: ${r} !important;
            fill-opacity: ${i} !important;
            stroke-width: ${o} !important;
          }
          ${'\n.heatmap-main-div {\n    font-family: sans-serif;\n}\n\n.heatmap-canvas-div {\n    /* Set background-color here to change the background of the heatmap */\n    background-color: none;\n}\n\n.heatmap-tooltip-box,\n.heatmap-pinned-tooltip-box {\n    z-index: 0;\n    /* Avoid tooltip flickering */\n    pointer-events: none;\n}\n\n.heatmap-tooltip-content,\n.heatmap-pinned-tooltip-content {\n    margin-left: var(--tooltip-offset-x);\n    margin-bottom: var(--tooltip-offset-y);\n    border: solid black 1px;\n    padding-block: 0.35em;\n    padding-inline: 0.7em;\n    background-color: white;\n    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.75);\n    pointer-events: initial;\n    width: max-content;\n    line-height: 1;\n}\n\n.heatmap-pinned-tooltip-close {\n    position: absolute;\n    top: -8px;\n    right: -8px;\n    width: 16px;\n    height: 16px;\n    border-radius: 1000px;\n    background-color: black;\n    border: solid black 1px;\n    pointer-events: initial;\n    cursor: pointer;\n}\n\n.heatmap-pinned-tooltip-close svg {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    fill: white;\n    stroke: white;\n}\n\n.heatmap-pinned-tooltip-pin {\n    position: absolute;\n    left: 0px;\n    bottom: 0px;\n    width: calc(var(--tooltip-offset-x) / 0.6);\n    height: calc(var(--tooltip-offset-y) / 0.6);\n    z-index: -1;\n}\n\n.heatmap-pinned-tooltip-pin svg {\n    fill: black;\n}\n\n.heatmap-overlay {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    pointer-events: none;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    z-index: 0;\n}\n\n.heatmap-overlay-shade {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background-color: black;\n    opacity: 0.4;\n    z-index: -1;\n}\n\n.heatmap-overlay-message {\n    margin: 5px;\n    padding-block: 1em;\n    padding-inline: 1.6em;\n    text-align: center;\n    font-size: 150%;\n    font-weight: bold;\n    background-color: white;\n    border: solid black 1px;\n    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.75);\n}\n\n.heatmap-marker {\n    stroke: black;\n    stroke-width: 4;\n    fill: none;\n}\n\n.heatmap-marker-x,\n.heatmap-marker-y {\n    stroke: black;\n    stroke-width: 2;\n    fill: none;\n}'}
        </style>

        <div class="container" style=${Wt(t)}">
          <div id="${this['heatmap-id']}" style=${Wt(e)}"></div>
        </div>`
        : yt`
        <div id="${this['heatmap-id']}_loading" style=${Wt(n)}">
          <svg width="200px" height="200px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;">
            <circle cx="75" cy="50" fill="#363a3c" r="6.39718">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.875s"></animate>
            </circle>
            <circle cx="67.678" cy="67.678" fill="#363a3c" r="4.8">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.75s"></animate>
            </circle>
            <circle cx="50" cy="75" fill="#363a3c" r="4.8">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.625s"></animate>
            </circle>
            <circle cx="32.322" cy="67.678" fill="#363a3c" r="4.8">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.5s"></animate>
            </circle>
            <circle cx="25" cy="50" fill="#363a3c" r="4.8">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.375s"></animate>
            </circle>
            <circle cx="32.322" cy="32.322" fill="#363a3c" r="4.80282">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.25s"></animate>
            </circle>
            <circle cx="50" cy="25" fill="#363a3c" r="6.40282">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="-0.125s"></animate>
            </circle>
            <circle cx="67.678" cy="32.322" fill="#363a3c" r="7.99718">
                <animate attributeName="r" values="4.8;4.8;8;4.8;4.8" times="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="0s"></animate>
            </circle>
          </svg>
        </div>`
    );
  }
  updated(t) {
    this.heatmapData && !this.heatmapInstance && (this.renderHeatmap(), this.bindHeatmapEvents()), this.applyZoomTranslation();
  }
  setHeatmapData(t, e, n) {
    (this.heatmapDomainX = t),
      (this.heatmapDomainY = e),
      this.heatmapData
        ? ((this.heatmapData = n), this.heatmapInstance.setData({ xDomain: t, yDomain: e, data: n, x: (t) => t.xValue, y: (t) => (t.yValue ? t.yValue : 'none') }))
        : (this.heatmapData = n),
      this.requestUpdate();
  }
  createRandomFromLength() {
    const t = [...Array(this.length).keys()].map((t) => t + 1),
      e = ['A', 'B', 'C'],
      n = [];
    for (const r of t)
      for (const t of e) {
        const e = Math.random();
        n.push({ xValue: r, yValue: t, score: e });
      }
    this.setHeatmapData(t, e, n);
  }
  renderHeatmap() {
    const t = ew.Heatmap.create({
        xDomain: this.heatmapDomainX,
        yDomain: this.heatmapDomainY,
        data: this.heatmapData,
        x: (t) => t.xValue,
        y: (t) => (t.yValue ? t.yValue : 'none'),
      }),
      e = Math.min(...this.heatmapData.map((t) => t.score)),
      n = Math.max(...this.heatmapData.map((t) => t.score)),
      r = ch([e, n], pd);
    t.setColor((t) => r(t.score)),
      t.setTooltip((t, e, n, r, i) => {
        var o;
        return `\n        <b>You are at</b> <br />\n\n        x,y: <b>${t.xValue},${t.yValue}</b><br />\n        score: <b>${
          ((o = t.score), 'number' == typeof o ? o.toFixed(3) : JSON.stringify(o))
        }</b>`;
      }),
      t.setZooming({ axis: 'x' }),
      t.setVisualParams({ xGapPixels: 0, yGapPixels: 0 }),
      (this.heatmapInstance = t),
      this.heatmapInstance.render(this['heatmap-id']),
      this.heatmapInstance.events.render.subscribe((t) => {
        this.requestUpdate();
      });
  }
  bindHeatmapEvents() {
    this.heatmapInstance &&
      (this.heatmapInstance.events.zoom.subscribe((t) => {
        if (!t) return;
        let e = t.xMin;
        !this.firstZoom && this['display-start'] && (e = this['display-start']),
          e !== this['display-start'] && this.dispatchEvent(new CustomEvent('change', { detail: { value: e, type: 'display-start' }, bubbles: !0, cancelable: !0 }));
        let n = t.xMax - 1;
        !this.firstZoom && this['display-end'] && (n = this['display-end']),
          n !== this['display-end'] && this.dispatchEvent(new CustomEvent('change', { detail: { value: n, type: 'display-end' }, bubbles: !0, cancelable: !0 })),
          this.firstZoom || (this.firstZoom = !0);
      }),
      this.heatmapInstance.events.hover.subscribe((t) => {
        let e = null;
        null != t && null !== t.cell && void 0 !== t.cell && null !== t.cell.xIndex && void 0 !== t.cell.xIndex && (e = `${t.cell.xIndex + 1}:${t.cell.xIndex + 1}`),
          this.dispatchEvent(new CustomEvent('change', { detail: { value: e, type: 'highlight' }, bubbles: !0, cancelable: !0 }));
      }));
  }
  triggerHeatmapZoom() {
    const t = this['display-start'],
      e = this['display-end'] + 1;
    this.heatmapInstance && this.heatmapInstance.zoom({ xMin: t, xMax: e });
  }
  triggerHeatmapHighlight() {
    if (!this.heatmapInstance) return;
    const t = this.heatmapInstance.extensions.marker,
      e = wg.MarkerY;
    t.state.dom.svg
      .selectAll('.' + e)
      .data(this.highlightedRegion.segments)
      .join(
        (n) =>
          n
            .append('rect')
            .attr('class', e)
            .attr('rx', t.params.markerCornerRadius)
            .attr('ry', t.params.markerCornerRadius)
            .attr('x', (e) => t.state.scales.worldToCanvas.x(e.start - 1))
            .attr('y', t.state.boxes.canvas.ymin)
            .attr('width', (e) => hg(t.state.scales.worldToCanvas.x, Math.max(e.end - e.start + 1, 1)))
            .attr('height', lg.height(t.state.boxes.canvas)),
        (e) =>
          e.attr('x', (e) => t.state.scales.worldToCanvas.x(e.start - 1)).attr('width', (e) => hg(t.state.scales.worldToCanvas.x, Math.max(e.end - e.start + 1, 1))),
        (t) => t.remove()
      );
  }
};
i([jt({ type: String })], vw.prototype, 'heatmap-id', void 0),
  i([jt({ type: Number })], vw.prototype, 'hm-highlight-width', void 0),
  i([jt({ type: Number })], vw.prototype, 'highlight-fill', void 0),
  (vw = i([No('nightingale-sequence-heatmap-new')], vw));
var mw = vw;
function gw(t, e, n, r) {
  var i,
    o = arguments.length,
    a = o < 3 ? e : null === r ? (r = Object.getOwnPropertyDescriptor(e, n)) : r;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, r);
  else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (a = (o < 3 ? i(a) : o > 3 ? i(e, n, a) : i(e, n)) || a);
  return o > 3 && a && Object.defineProperty(e, n, a), a;
}
function yw(t, e, n, r) {
  if ('a' === n && !r) throw new TypeError('Private accessor was defined without a getter');
  if ('function' == typeof e ? t !== e || !r : !e.has(t)) throw new TypeError('Cannot read private member from an object whose class did not declare it');
  return 'm' === n ? r : 'a' === n ? r.call(t) : r ? r.value : e.get(t);
}
function bw(t, e, n, r, i) {
  if ('m' === r) throw new TypeError('Private method is not writable');
  if ('a' === r && !i) throw new TypeError('Private accessor was defined without a setter');
  if ('function' == typeof e ? t !== e || !i : !e.has(t)) throw new TypeError('Cannot write private member to an object whose class did not declare it');
  return 'a' === r ? i.call(t, n) : i ? (i.value = n) : e.set(t, n), n;
}
'function' == typeof SuppressedError && SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _w = window,
  ww = _w.ShadowRoot && (void 0 === _w.ShadyCSS || _w.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype,
  xw = Symbol(),
  Aw = new WeakMap(),
  Mw = (t) =>
    new (class {
      constructor(t, e, n) {
        if (((this._$cssResult$ = !0), n !== xw)) throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        (this.cssText = t), (this.t = e);
      }
      get styleSheet() {
        let t = this.o;
        const e = this.t;
        if (ww && void 0 === t) {
          const n = void 0 !== e && 1 === e.length;
          n && (t = Aw.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && Aw.set(e, t));
        }
        return t;
      }
      toString() {
        return this.cssText;
      }
    })('string' == typeof t ? t : t + '', void 0, xw),
  $w = ww
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return Mw(e);
            })(t)
          : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var Ew;
const Sw = window,
  Cw = Sw.trustedTypes,
  kw = Cw ? Cw.emptyScript : '',
  Tw = Sw.reactiveElementPolyfillSupport,
  Nw = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? kw : null;
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
  Pw = (t, e) => e !== t && (e == e || t == t),
  Dw = { attribute: !0, type: String, converter: Nw, reflect: !1, hasChanged: Pw };
let Ow = class extends HTMLElement {
  constructor() {
    super(), (this._$Ei = new Map()), (this.isUpdatePending = !1), (this.hasUpdated = !1), (this._$El = null), this.u();
  }
  static addInitializer(t) {
    var e;
    this.finalize(), (null !== (e = this.h) && void 0 !== e ? e : (this.h = [])).push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return (
      this.elementProperties.forEach((e, n) => {
        const r = this._$Ep(n, e);
        void 0 !== r && (this._$Ev.set(r, n), t.push(r));
      }),
      t
    );
  }
  static createProperty(t, e = Dw) {
    if ((e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t))) {
      const n = 'symbol' == typeof t ? Symbol() : '__' + t,
        r = this.getPropertyDescriptor(t, n, e);
      void 0 !== r && Object.defineProperty(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    return {
      get() {
        return this[e];
      },
      set(r) {
        const i = this[t];
        (this[e] = r), this.requestUpdate(t, i, n);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || Dw;
  }
  static finalize() {
    if (this.hasOwnProperty('finalized')) return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);
    if (
      (t.finalize(),
      void 0 !== t.h && (this.h = [...t.h]),
      (this.elementProperties = new Map(t.elementProperties)),
      (this._$Ev = new Map()),
      this.hasOwnProperty('properties'))
    ) {
      const t = this.properties,
        e = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
      for (const n of e) this.createProperty(n, t[n]);
    }
    return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const t of n) e.unshift($w(t));
    } else void 0 !== t && e.push($w(t));
    return e;
  }
  static _$Ep(t, e) {
    const n = e.attribute;
    return !1 === n ? void 0 : 'string' == typeof n ? n : 'string' == typeof t ? t.toLowerCase() : void 0;
  }
  u() {
    var t;
    (this._$E_ = new Promise((t) => (this.enableUpdating = t))),
      (this._$AL = new Map()),
      this._$Eg(),
      this.requestUpdate(),
      null === (t = this.constructor.h) || void 0 === t || t.forEach((t) => t(this));
  }
  addController(t) {
    var e, n;
    (null !== (e = this._$ES) && void 0 !== e ? e : (this._$ES = [])).push(t),
      void 0 !== this.renderRoot && this.isConnected && (null === (n = t.hostConnected) || void 0 === n || n.call(t));
  }
  removeController(t) {
    var e;
    null === (e = this._$ES) || void 0 === e || e.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t, e) => {
      this.hasOwnProperty(e) && (this._$Ei.set(e, this[e]), delete this[e]);
    });
  }
  createRenderRoot() {
    var t;
    const e = null !== (t = this.shadowRoot) && void 0 !== t ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return (
      ((t, e) => {
        ww
          ? (t.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet)))
          : e.forEach((e) => {
              const n = document.createElement('style'),
                r = _w.litNonce;
              void 0 !== r && n.setAttribute('nonce', r), (n.textContent = e.cssText), t.appendChild(n);
            });
      })(e, this.constructor.elementStyles),
      e
    );
  }
  connectedCallback() {
    var t;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      null === (t = this._$ES) ||
        void 0 === t ||
        t.forEach((t) => {
          var e;
          return null === (e = t.hostConnected) || void 0 === e ? void 0 : e.call(t);
        });
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    var t;
    null === (t = this._$ES) ||
      void 0 === t ||
      t.forEach((t) => {
        var e;
        return null === (e = t.hostDisconnected) || void 0 === e ? void 0 : e.call(t);
      });
  }
  attributeChangedCallback(t, e, n) {
    this._$AK(t, n);
  }
  _$EO(t, e, n = Dw) {
    var r;
    const i = this.constructor._$Ep(t, n);
    if (void 0 !== i && !0 === n.reflect) {
      const o = (void 0 !== (null === (r = n.converter) || void 0 === r ? void 0 : r.toAttribute) ? n.converter : Nw).toAttribute(e, n.type);
      (this._$El = t), null == o ? this.removeAttribute(i) : this.setAttribute(i, o), (this._$El = null);
    }
  }
  _$AK(t, e) {
    var n;
    const r = this.constructor,
      i = r._$Ev.get(t);
    if (void 0 !== i && this._$El !== i) {
      const t = r.getPropertyOptions(i),
        o =
          'function' == typeof t.converter
            ? { fromAttribute: t.converter }
            : void 0 !== (null === (n = t.converter) || void 0 === n ? void 0 : n.fromAttribute)
            ? t.converter
            : Nw;
      (this._$El = i), (this[i] = o.fromAttribute(e, t.type)), (this._$El = null);
    }
  }
  requestUpdate(t, e, n) {
    let r = !0;
    void 0 !== t &&
      (((n = n || this.constructor.getPropertyOptions(t)).hasChanged || Pw)(this[t], e)
        ? (this._$AL.has(t) || this._$AL.set(t, e), !0 === n.reflect && this._$El !== t && (void 0 === this._$EC && (this._$EC = new Map()), this._$EC.set(t, n)))
        : (r = !1)),
      !this.isUpdatePending && r && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
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
    var t;
    if (!this.isUpdatePending) return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t, e) => (this[e] = t)), (this._$Ei = void 0));
    let e = !1;
    const n = this._$AL;
    try {
      (e = this.shouldUpdate(n)),
        e
          ? (this.willUpdate(n),
            null === (t = this._$ES) ||
              void 0 === t ||
              t.forEach((t) => {
                var e;
                return null === (e = t.hostUpdate) || void 0 === e ? void 0 : e.call(t);
              }),
            this.update(n))
          : this._$Ek();
    } catch (t) {
      throw ((e = !1), this._$Ek(), t);
    }
    e && this._$AE(n);
  }
  willUpdate(t) {}
  _$AE(t) {
    var e;
    null === (e = this._$ES) ||
      void 0 === e ||
      e.forEach((t) => {
        var e;
        return null === (e = t.hostUpdated) || void 0 === e ? void 0 : e.call(t);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
      this.updated(t);
  }
  _$Ek() {
    (this._$AL = new Map()), (this.isUpdatePending = !1);
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    void 0 !== this._$EC && (this._$EC.forEach((t, e) => this._$EO(e, this[e], t)), (this._$EC = void 0)), this._$Ek();
  }
  updated(t) {}
  firstUpdated(t) {}
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var zw;
(Ow.finalized = !0),
  (Ow.elementProperties = new Map()),
  (Ow.elementStyles = []),
  (Ow.shadowRootOptions = { mode: 'open' }),
  null == Tw || Tw({ ReactiveElement: Ow }),
  (null !== (Ew = Sw.reactiveElementVersions) && void 0 !== Ew ? Ew : (Sw.reactiveElementVersions = [])).push('1.6.1');
const Rw = window,
  Iw = Rw.trustedTypes,
  jw = Iw ? Iw.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  Uw = '$lit$',
  Bw = `lit$${(Math.random() + '').slice(9)}$`,
  Hw = '?' + Bw,
  qw = `<${Hw}>`,
  Ww = document,
  Lw = () => Ww.createComment(''),
  Fw = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
  Vw = Array.isArray,
  Yw = '[ \t\n\f\r]',
  Xw = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Zw = /-->/g,
  Gw = />/g,
  Kw = RegExp(`>|${Yw}(?:([^\\s"'>=/]+)(${Yw}*=${Yw}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  Jw = /'/g,
  Qw = /"/g,
  tx = /^(?:script|style|textarea|title)$/i,
  ex = (t, ...e) => ({ _$litType$: 1, strings: t, values: e }),
  nx = Symbol.for('lit-noChange'),
  rx = Symbol.for('lit-nothing'),
  ix = new WeakMap(),
  ox = Ww.createTreeWalker(Ww, 129, null, !1);
class ax {
  constructor({ strings: t, _$litType$: e }, n) {
    let r;
    this.parts = [];
    let i = 0,
      o = 0;
    const a = t.length - 1,
      s = this.parts,
      [u, c] = ((t, e) => {
        const n = t.length - 1,
          r = [];
        let i,
          o = 2 === e ? '<svg>' : '',
          a = Xw;
        for (let e = 0; e < n; e++) {
          const n = t[e];
          let s,
            u,
            c = -1,
            l = 0;
          for (; l < n.length && ((a.lastIndex = l), (u = a.exec(n)), null !== u); )
            (l = a.lastIndex),
              a === Xw
                ? '!--' === u[1]
                  ? (a = Zw)
                  : void 0 !== u[1]
                  ? (a = Gw)
                  : void 0 !== u[2]
                  ? (tx.test(u[2]) && (i = RegExp('</' + u[2], 'g')), (a = Kw))
                  : void 0 !== u[3] && (a = Kw)
                : a === Kw
                ? '>' === u[0]
                  ? ((a = null != i ? i : Xw), (c = -1))
                  : void 0 === u[1]
                  ? (c = -2)
                  : ((c = a.lastIndex - u[2].length), (s = u[1]), (a = void 0 === u[3] ? Kw : '"' === u[3] ? Qw : Jw))
                : a === Qw || a === Jw
                ? (a = Kw)
                : a === Zw || a === Gw
                ? (a = Xw)
                : ((a = Kw), (i = void 0));
          const f = a === Kw && t[e + 1].startsWith('/>') ? ' ' : '';
          o += a === Xw ? n + qw : c >= 0 ? (r.push(s), n.slice(0, c) + Uw + n.slice(c) + Bw + f) : n + Bw + (-2 === c ? (r.push(void 0), e) : f);
        }
        const s = o + (t[n] || '<?>') + (2 === e ? '</svg>' : '');
        if (!Array.isArray(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
        return [void 0 !== jw ? jw.createHTML(s) : s, r];
      })(t, e);
    if (((this.el = ax.createElement(u, n)), (ox.currentNode = this.el.content), 2 === e)) {
      const t = this.el.content,
        e = t.firstChild;
      e.remove(), t.append(...e.childNodes);
    }
    for (; null !== (r = ox.nextNode()) && s.length < a; ) {
      if (1 === r.nodeType) {
        if (r.hasAttributes()) {
          const t = [];
          for (const e of r.getAttributeNames())
            if (e.endsWith(Uw) || e.startsWith(Bw)) {
              const n = c[o++];
              if ((t.push(e), void 0 !== n)) {
                const t = r.getAttribute(n.toLowerCase() + Uw).split(Bw),
                  e = /([.?@])?(.*)/.exec(n);
                s.push({ type: 1, index: i, name: e[2], strings: t, ctor: '.' === e[1] ? fx : '?' === e[1] ? dx : '@' === e[1] ? px : lx });
              } else s.push({ type: 6, index: i });
            }
          for (const e of t) r.removeAttribute(e);
        }
        if (tx.test(r.tagName)) {
          const t = r.textContent.split(Bw),
            e = t.length - 1;
          if (e > 0) {
            r.textContent = Iw ? Iw.emptyScript : '';
            for (let n = 0; n < e; n++) r.append(t[n], Lw()), ox.nextNode(), s.push({ type: 2, index: ++i });
            r.append(t[e], Lw());
          }
        }
      } else if (8 === r.nodeType)
        if (r.data === Hw) s.push({ type: 2, index: i });
        else {
          let t = -1;
          for (; -1 !== (t = r.data.indexOf(Bw, t + 1)); ) s.push({ type: 7, index: i }), (t += Bw.length - 1);
        }
      i++;
    }
  }
  static createElement(t, e) {
    const n = Ww.createElement('template');
    return (n.innerHTML = t), n;
  }
}
function sx(t, e, n = t, r) {
  var i, o, a, s;
  if (e === nx) return e;
  let u = void 0 !== r ? (null === (i = n._$Co) || void 0 === i ? void 0 : i[r]) : n._$Cl;
  const c = Fw(e) ? void 0 : e._$litDirective$;
  return (
    (null == u ? void 0 : u.constructor) !== c &&
      (null === (o = null == u ? void 0 : u._$AO) || void 0 === o || o.call(u, !1),
      void 0 === c ? (u = void 0) : ((u = new c(t)), u._$AT(t, n, r)),
      void 0 !== r ? ((null !== (a = (s = n)._$Co) && void 0 !== a ? a : (s._$Co = []))[r] = u) : (n._$Cl = u)),
    void 0 !== u && (e = sx(t, u._$AS(t, e.values), u, r)),
    e
  );
}
class ux {
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
    var e;
    const {
        el: { content: n },
        parts: r,
      } = this._$AD,
      i = (null !== (e = null == t ? void 0 : t.creationScope) && void 0 !== e ? e : Ww).importNode(n, !0);
    ox.currentNode = i;
    let o = ox.nextNode(),
      a = 0,
      s = 0,
      u = r[0];
    for (; void 0 !== u; ) {
      if (a === u.index) {
        let e;
        2 === u.type
          ? (e = new cx(o, o.nextSibling, this, t))
          : 1 === u.type
          ? (e = new u.ctor(o, u.name, u.strings, this, t))
          : 6 === u.type && (e = new vx(o, this, t)),
          this._$AV.push(e),
          (u = r[++s]);
      }
      a !== (null == u ? void 0 : u.index) && ((o = ox.nextNode()), a++);
    }
    return i;
  }
  v(t) {
    let e = 0;
    for (const n of this._$AV) void 0 !== n && (void 0 !== n.strings ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++;
  }
}
class cx {
  constructor(t, e, n, r) {
    var i;
    (this.type = 2),
      (this._$AH = rx),
      (this._$AN = void 0),
      (this._$AA = t),
      (this._$AB = e),
      (this._$AM = n),
      (this.options = r),
      (this._$Cp = null === (i = null == r ? void 0 : r.isConnected) || void 0 === i || i);
  }
  get _$AU() {
    var t, e;
    return null !== (e = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) && void 0 !== e ? e : this._$Cp;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return void 0 !== e && 11 === (null == t ? void 0 : t.nodeType) && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    (t = sx(this, t, e)),
      Fw(t)
        ? t === rx || null == t || '' === t
          ? (this._$AH !== rx && this._$AR(), (this._$AH = rx))
          : t !== this._$AH && t !== nx && this._(t)
        : void 0 !== t._$litType$
        ? this.g(t)
        : void 0 !== t.nodeType
        ? this.$(t)
        : ((t) => Vw(t) || 'function' == typeof (null == t ? void 0 : t[Symbol.iterator]))(t)
        ? this.T(t)
        : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), (this._$AH = this.k(t)));
  }
  _(t) {
    this._$AH !== rx && Fw(this._$AH) ? (this._$AA.nextSibling.data = t) : this.$(Ww.createTextNode(t)), (this._$AH = t);
  }
  g(t) {
    var e;
    const { values: n, _$litType$: r } = t,
      i = 'number' == typeof r ? this._$AC(t) : (void 0 === r.el && (r.el = ax.createElement(r.h, this.options)), r);
    if ((null === (e = this._$AH) || void 0 === e ? void 0 : e._$AD) === i) this._$AH.v(n);
    else {
      const t = new ux(i, this),
        e = t.u(this.options);
      t.v(n), this.$(e), (this._$AH = t);
    }
  }
  _$AC(t) {
    let e = ix.get(t.strings);
    return void 0 === e && ix.set(t.strings, (e = new ax(t))), e;
  }
  T(t) {
    Vw(this._$AH) || ((this._$AH = []), this._$AR());
    const e = this._$AH;
    let n,
      r = 0;
    for (const i of t) r === e.length ? e.push((n = new cx(this.k(Lw()), this.k(Lw()), this, this.options))) : (n = e[r]), n._$AI(i), r++;
    r < e.length && (this._$AR(n && n._$AB.nextSibling, r), (e.length = r));
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var n;
    for (null === (n = this._$AP) || void 0 === n || n.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const e = t.nextSibling;
      t.remove(), (t = e);
    }
  }
  setConnected(t) {
    var e;
    void 0 === this._$AM && ((this._$Cp = t), null === (e = this._$AP) || void 0 === e || e.call(this, t));
  }
}
class lx {
  constructor(t, e, n, r, i) {
    (this.type = 1),
      (this._$AH = rx),
      (this._$AN = void 0),
      (this.element = t),
      (this.name = e),
      (this._$AM = r),
      (this.options = i),
      n.length > 2 || '' !== n[0] || '' !== n[1] ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n)) : (this._$AH = rx);
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, e = this, n, r) {
    const i = this.strings;
    let o = !1;
    if (void 0 === i) (t = sx(this, t, e, 0)), (o = !Fw(t) || (t !== this._$AH && t !== nx)), o && (this._$AH = t);
    else {
      const r = t;
      let a, s;
      for (t = i[0], a = 0; a < i.length - 1; a++)
        (s = sx(this, r[n + a], e, a)),
          s === nx && (s = this._$AH[a]),
          o || (o = !Fw(s) || s !== this._$AH[a]),
          s === rx ? (t = rx) : t !== rx && (t += (null != s ? s : '') + i[a + 1]),
          (this._$AH[a] = s);
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === rx ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t ? t : '');
  }
}
class fx extends lx {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(t) {
    this.element[this.name] = t === rx ? void 0 : t;
  }
}
const hx = Iw ? Iw.emptyScript : '';
class dx extends lx {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(t) {
    t && t !== rx ? this.element.setAttribute(this.name, hx) : this.element.removeAttribute(this.name);
  }
}
class px extends lx {
  constructor(t, e, n, r, i) {
    super(t, e, n, r, i), (this.type = 5);
  }
  _$AI(t, e = this) {
    var n;
    if ((t = null !== (n = sx(this, t, e, 0)) && void 0 !== n ? n : rx) === nx) return;
    const r = this._$AH,
      i = (t === rx && r !== rx) || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive,
      o = t !== rx && (r === rx || i);
    i && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), (this._$AH = t);
  }
  handleEvent(t) {
    var e, n;
    'function' == typeof this._$AH
      ? this._$AH.call(null !== (n = null === (e = this.options) || void 0 === e ? void 0 : e.host) && void 0 !== n ? n : this.element, t)
      : this._$AH.handleEvent(t);
  }
}
class vx {
  constructor(t, e, n) {
    (this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    sx(this, t);
  }
}
const mx = Rw.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var gx, yx;
null == mx || mx(ax, cx), (null !== (zw = Rw.litHtmlVersions) && void 0 !== zw ? zw : (Rw.litHtmlVersions = [])).push('2.7.2');
class bx extends Ow {
  constructor() {
    super(...arguments), (this.renderOptions = { host: this }), (this._$Do = void 0);
  }
  createRenderRoot() {
    var t, e;
    const n = super.createRenderRoot();
    return (null !== (t = (e = this.renderOptions).renderBefore) && void 0 !== t) || (e.renderBefore = n.firstChild), n;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(t),
      (this._$Do = ((t, e, n) => {
        var r, i;
        const o = null !== (r = null == n ? void 0 : n.renderBefore) && void 0 !== r ? r : e;
        let a = o._$litPart$;
        if (void 0 === a) {
          const t = null !== (i = null == n ? void 0 : n.renderBefore) && void 0 !== i ? i : null;
          o._$litPart$ = a = new cx(e.insertBefore(Lw(), t), t, void 0, null != n ? n : {});
        }
        return a._$AI(t), a;
      })(e, this.renderRoot, this.renderOptions));
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), null === (t = this._$Do) || void 0 === t || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), null === (t = this._$Do) || void 0 === t || t.setConnected(!1);
  }
  render() {
    return nx;
  }
}
(bx.finalized = !0), (bx._$litElement$ = !0), null === (gx = globalThis.litElementHydrateSupport) || void 0 === gx || gx.call(globalThis, { LitElement: bx });
const _x = globalThis.litElementPolyfillSupport;
null == _x || _x({ LitElement: bx }), (null !== (yx = globalThis.litElementVersions) && void 0 !== yx ? yx : (globalThis.litElementVersions = [])).push('3.3.1');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wx = (t, e) =>
  'method' === e.kind && e.descriptor && !('value' in e.descriptor)
    ? {
        ...e,
        finisher(n) {
          n.createProperty(e.key, t);
        },
      }
    : {
        kind: 'field',
        key: Symbol(),
        placement: 'own',
        descriptor: {},
        originalKey: e.key,
        initializer() {
          'function' == typeof e.initializer && (this[e.key] = e.initializer.call(this));
        },
        finisher(n) {
          n.createProperty(e.key, t);
        },
      };
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var xx;
function Ax(t) {
  return t;
}
null === (xx = window.HTMLSlotElement) || void 0 === xx || xx.prototype.assignedElements;
var Mx = 1e-6;
function $x(t) {
  return 'translate(' + t + ',0)';
}
function Ex(t) {
  return 'translate(0,' + t + ')';
}
function Sx(t) {
  return (e) => +t(e);
}
function Cx(t, e) {
  return (e = Math.max(0, t.bandwidth() - 2 * e) / 2), t.round() && (e = Math.round(e)), (n) => +t(n) + e;
}
function kx() {
  return !this.__axis;
}
function Tx(t, e) {
  var n = [],
    r = null,
    i = null,
    o = 6,
    a = 6,
    s = 3,
    u = 'undefined' != typeof window && window.devicePixelRatio > 1 ? 0 : 0.5,
    c = 1 === t || 4 === t ? -1 : 1,
    l = 4 === t || 2 === t ? 'x' : 'y',
    f = 1 === t || 3 === t ? $x : Ex;
  function h(h) {
    var d = r ?? (e.ticks ? e.ticks.apply(e, n) : e.domain()),
      p = i ?? (e.tickFormat ? e.tickFormat.apply(e, n) : Ax),
      v = Math.max(o, 0) + s,
      m = e.range(),
      g = +m[0] + u,
      y = +m[m.length - 1] + u,
      b = (e.bandwidth ? Cx : Sx)(e.copy(), u),
      _ = h.selection ? h.selection() : h,
      w = _.selectAll('.domain').data([null]),
      x = _.selectAll('.tick').data(d, e).order(),
      A = x.exit(),
      M = x.enter().append('g').attr('class', 'tick'),
      $ = x.select('line'),
      E = x.select('text');
    (w = w.merge(w.enter().insert('path', '.tick').attr('class', 'domain').attr('stroke', 'currentColor'))),
      (x = x.merge(M)),
      ($ = $.merge(
        M.append('line')
          .attr('stroke', 'currentColor')
          .attr(l + '2', c * o)
      )),
      (E = E.merge(
        M.append('text')
          .attr('fill', 'currentColor')
          .attr(l, c * v)
          .attr('dy', 1 === t ? '0em' : 3 === t ? '0.71em' : '0.32em')
      )),
      h !== _ &&
        ((w = w.transition(h)),
        (x = x.transition(h)),
        ($ = $.transition(h)),
        (E = E.transition(h)),
        (A = A.transition(h)
          .attr('opacity', Mx)
          .attr('transform', function (t) {
            return isFinite((t = b(t))) ? f(t + u) : this.getAttribute('transform');
          })),
        M.attr('opacity', Mx).attr('transform', function (t) {
          var e = this.parentNode.__axis;
          return f((e && isFinite((e = e(t))) ? e : b(t)) + u);
        })),
      A.remove(),
      w.attr(
        'd',
        4 === t || 2 === t
          ? a
            ? 'M' + c * a + ',' + g + 'H' + u + 'V' + y + 'H' + c * a
            : 'M' + u + ',' + g + 'V' + y
          : a
          ? 'M' + g + ',' + c * a + 'V' + u + 'H' + y + 'V' + c * a
          : 'M' + g + ',' + u + 'H' + y
      ),
      x.attr('opacity', 1).attr('transform', function (t) {
        return f(b(t) + u);
      }),
      $.attr(l + '2', c * o),
      E.attr(l, c * v).text(p),
      _.filter(kx)
        .attr('fill', 'none')
        .attr('font-size', 10)
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 2 === t ? 'start' : 4 === t ? 'end' : 'middle'),
      _.each(function () {
        this.__axis = b;
      });
  }
  return (
    (h.scale = function (t) {
      return arguments.length ? ((e = t), h) : e;
    }),
    (h.ticks = function () {
      return (n = Array.from(arguments)), h;
    }),
    (h.tickArguments = function (t) {
      return arguments.length ? ((n = null == t ? [] : Array.from(t)), h) : n.slice();
    }),
    (h.tickValues = function (t) {
      return arguments.length ? ((r = null == t ? null : Array.from(t)), h) : r && r.slice();
    }),
    (h.tickFormat = function (t) {
      return arguments.length ? ((i = t), h) : i;
    }),
    (h.tickSize = function (t) {
      return arguments.length ? ((o = a = +t), h) : o;
    }),
    (h.tickSizeInner = function (t) {
      return arguments.length ? ((o = +t), h) : o;
    }),
    (h.tickSizeOuter = function (t) {
      return arguments.length ? ((a = +t), h) : a;
    }),
    (h.tickPadding = function (t) {
      return arguments.length ? ((s = +t), h) : s;
    }),
    (h.offset = function (t) {
      return arguments.length ? ((u = +t), h) : u;
    }),
    h
  );
}
var Nx = { value: () => {} };
function Px() {
  for (var t, e = 0, n = arguments.length, r = {}; e < n; ++e) {
    if (!(t = arguments[e] + '') || t in r || /[\s.]/.test(t)) throw new Error('illegal type: ' + t);
    r[t] = [];
  }
  return new Dx(r);
}
function Dx(t) {
  this._ = t;
}
function Ox(t, e) {
  for (var n, r = 0, i = t.length; r < i; ++r) if ((n = t[r]).name === e) return n.value;
}
function zx(t, e, n) {
  for (var r = 0, i = t.length; r < i; ++r)
    if (t[r].name === e) {
      (t[r] = Nx), (t = t.slice(0, r).concat(t.slice(r + 1)));
      break;
    }
  return null != n && t.push({ name: e, value: n }), t;
}
Dx.prototype = Px.prototype = {
  constructor: Dx,
  on: function (t, e) {
    var n,
      r,
      i = this._,
      o =
        ((r = i),
        (t + '')
          .trim()
          .split(/^|\s+/)
          .map(function (t) {
            var e = '',
              n = t.indexOf('.');
            if ((n >= 0 && ((e = t.slice(n + 1)), (t = t.slice(0, n))), t && !r.hasOwnProperty(t))) throw new Error('unknown type: ' + t);
            return { type: t, name: e };
          })),
      a = -1,
      s = o.length;
    if (!(arguments.length < 2)) {
      if (null != e && 'function' != typeof e) throw new Error('invalid callback: ' + e);
      for (; ++a < s; )
        if ((n = (t = o[a]).type)) i[n] = zx(i[n], t.name, e);
        else if (null == e) for (n in i) i[n] = zx(i[n], t.name, null);
      return this;
    }
    for (; ++a < s; ) if ((n = (t = o[a]).type) && (n = Ox(i[n], t.name))) return n;
  },
  copy: function () {
    var t = {},
      e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new Dx(t);
  },
  call: function (t, e) {
    if ((n = arguments.length - 2) > 0) for (var n, r, i = new Array(n), o = 0; o < n; ++o) i[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (o = 0, n = (r = this._[t]).length; o < n; ++o) r[o].value.apply(e, i);
  },
  apply: function (t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error('unknown type: ' + t);
    for (var r = this._[t], i = 0, o = r.length; i < o; ++i) r[i].value.apply(e, n);
  },
};
var Rx = 'http://www.w3.org/1999/xhtml',
  Ix = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: Rx,
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
  };
function jx(t) {
  var e = (t += ''),
    n = e.indexOf(':');
  return n >= 0 && 'xmlns' !== (e = t.slice(0, n)) && (t = t.slice(n + 1)), Ix.hasOwnProperty(e) ? { space: Ix[e], local: t } : t;
}
function Ux(t) {
  return function () {
    var e = this.ownerDocument,
      n = this.namespaceURI;
    return n === Rx && e.documentElement.namespaceURI === Rx ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Bx(t) {
  return function () {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Hx(t) {
  var e = jx(t);
  return (e.local ? Bx : Ux)(e);
}
function qx() {}
function Wx(t) {
  return null == t
    ? qx
    : function () {
        return this.querySelector(t);
      };
}
function Lx() {
  return [];
}
function Fx(t) {
  return null == t
    ? Lx
    : function () {
        return this.querySelectorAll(t);
      };
}
function Vx(t) {
  return function () {
    return this.matches(t);
  };
}
function Yx(t) {
  return function (e) {
    return e.matches(t);
  };
}
var Xx = Array.prototype.find;
function Zx() {
  return this.firstElementChild;
}
var Gx = Array.prototype.filter;
function Kx() {
  return Array.from(this.children);
}
function Jx(t) {
  return new Array(t.length);
}
function Qx(t, e) {
  (this.ownerDocument = t.ownerDocument), (this.namespaceURI = t.namespaceURI), (this._next = null), (this._parent = t), (this.__data__ = e);
}
function tA(t, e, n, r, i, o) {
  for (var a, s = 0, u = e.length, c = o.length; s < c; ++s) (a = e[s]) ? ((a.__data__ = o[s]), (r[s] = a)) : (n[s] = new Qx(t, o[s]));
  for (; s < u; ++s) (a = e[s]) && (i[s] = a);
}
function eA(t, e, n, r, i, o, a) {
  var s,
    u,
    c,
    l = new Map(),
    f = e.length,
    h = o.length,
    d = new Array(f);
  for (s = 0; s < f; ++s) (u = e[s]) && ((d[s] = c = a.call(u, u.__data__, s, e) + ''), l.has(c) ? (i[s] = u) : l.set(c, u));
  for (s = 0; s < h; ++s) (c = a.call(t, o[s], s, o) + ''), (u = l.get(c)) ? ((r[s] = u), (u.__data__ = o[s]), l.delete(c)) : (n[s] = new Qx(t, o[s]));
  for (s = 0; s < f; ++s) (u = e[s]) && l.get(d[s]) === u && (i[s] = u);
}
function nA(t) {
  return t.__data__;
}
function rA(t) {
  return 'object' == typeof t && 'length' in t ? t : Array.from(t);
}
function iA(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function oA(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function aA(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function sA(t, e) {
  return function () {
    this.setAttribute(t, e);
  };
}
function uA(t, e) {
  return function () {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function cA(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function lA(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function fA(t) {
  return (t.ownerDocument && t.ownerDocument.defaultView) || (t.document && t) || t.defaultView;
}
function hA(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
function dA(t, e, n) {
  return function () {
    this.style.setProperty(t, e, n);
  };
}
function pA(t, e, n) {
  return function () {
    var r = e.apply(this, arguments);
    null == r ? this.style.removeProperty(t) : this.style.setProperty(t, r, n);
  };
}
function vA(t, e) {
  return t.style.getPropertyValue(e) || fA(t).getComputedStyle(t, null).getPropertyValue(e);
}
function mA(t) {
  return function () {
    delete this[t];
  };
}
function gA(t, e) {
  return function () {
    this[t] = e;
  };
}
function yA(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? delete this[t] : (this[t] = n);
  };
}
function bA(t) {
  return t.trim().split(/^|\s+/);
}
function _A(t) {
  return t.classList || new wA(t);
}
function wA(t) {
  (this._node = t), (this._names = bA(t.getAttribute('class') || ''));
}
function xA(t, e) {
  for (var n = _A(t), r = -1, i = e.length; ++r < i; ) n.add(e[r]);
}
function AA(t, e) {
  for (var n = _A(t), r = -1, i = e.length; ++r < i; ) n.remove(e[r]);
}
function MA(t) {
  return function () {
    xA(this, t);
  };
}
function $A(t) {
  return function () {
    AA(this, t);
  };
}
function EA(t, e) {
  return function () {
    (e.apply(this, arguments) ? xA : AA)(this, t);
  };
}
function SA() {
  this.textContent = '';
}
function CA(t) {
  return function () {
    this.textContent = t;
  };
}
function kA(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.textContent = e ?? '';
  };
}
function TA() {
  this.innerHTML = '';
}
function NA(t) {
  return function () {
    this.innerHTML = t;
  };
}
function PA(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? '';
  };
}
function DA() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function OA() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function zA() {
  return null;
}
function RA() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function IA() {
  var t = this.cloneNode(!1),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function jA() {
  var t = this.cloneNode(!0),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function UA(t) {
  return function () {
    var e = this.__on;
    if (e) {
      for (var n, r = 0, i = -1, o = e.length; r < o; ++r)
        (n = e[r]), (t.type && n.type !== t.type) || n.name !== t.name ? (e[++i] = n) : this.removeEventListener(n.type, n.listener, n.options);
      ++i ? (e.length = i) : delete this.__on;
    }
  };
}
function BA(t, e, n) {
  return function () {
    var r,
      i = this.__on,
      o = (function (t) {
        return function (e) {
          t.call(this, e, this.__data__);
        };
      })(e);
    if (i)
      for (var a = 0, s = i.length; a < s; ++a)
        if ((r = i[a]).type === t.type && r.name === t.name)
          return this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, (r.listener = o), (r.options = n)), void (r.value = e);
    this.addEventListener(t.type, o, n), (r = { type: t.type, name: t.name, value: e, listener: o, options: n }), i ? i.push(r) : (this.__on = [r]);
  };
}
function HA(t, e, n) {
  var r = fA(t),
    i = r.CustomEvent;
  'function' == typeof i
    ? (i = new i(e, n))
    : ((i = r.document.createEvent('Event')), n ? (i.initEvent(e, n.bubbles, n.cancelable), (i.detail = n.detail)) : i.initEvent(e, !1, !1)),
    t.dispatchEvent(i);
}
function qA(t, e) {
  return function () {
    return HA(this, t, e);
  };
}
function WA(t, e) {
  return function () {
    return HA(this, t, e.apply(this, arguments));
  };
}
(Qx.prototype = {
  constructor: Qx,
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
  (wA.prototype = {
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
var LA = [null];
function FA(t, e) {
  (this._groups = t), (this._parents = e);
}
function VA() {
  return new FA([[document.documentElement]], LA);
}
function YA(t, e, n) {
  (t.prototype = e.prototype = n), (n.constructor = t);
}
function XA(t, e) {
  var n = Object.create(t.prototype);
  for (var r in e) n[r] = e[r];
  return n;
}
function ZA() {}
FA.prototype = VA.prototype = {
  constructor: FA,
  select: function (t) {
    'function' != typeof t && (t = Wx(t));
    for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
      for (var o, a, s = e[i], u = s.length, c = (r[i] = new Array(u)), l = 0; l < u; ++l)
        (o = s[l]) && (a = t.call(o, o.__data__, l, s)) && ('__data__' in o && (a.__data__ = o.__data__), (c[l] = a));
    return new FA(r, this._parents);
  },
  selectAll: function (t) {
    t =
      'function' == typeof t
        ? (function (t) {
            return function () {
              return (function (t) {
                return null == t ? [] : Array.isArray(t) ? t : Array.from(t);
              })(t.apply(this, arguments));
            };
          })(t)
        : Fx(t);
    for (var e = this._groups, n = e.length, r = [], i = [], o = 0; o < n; ++o)
      for (var a, s = e[o], u = s.length, c = 0; c < u; ++c) (a = s[c]) && (r.push(t.call(a, a.__data__, c, s)), i.push(a));
    return new FA(r, i);
  },
  selectChild: function (t) {
    return this.select(
      null == t
        ? Zx
        : (function (t) {
            return function () {
              return Xx.call(this.children, t);
            };
          })('function' == typeof t ? t : Yx(t))
    );
  },
  selectChildren: function (t) {
    return this.selectAll(
      null == t
        ? Kx
        : (function (t) {
            return function () {
              return Gx.call(this.children, t);
            };
          })('function' == typeof t ? t : Yx(t))
    );
  },
  filter: function (t) {
    'function' != typeof t && (t = Vx(t));
    for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
      for (var o, a = e[i], s = a.length, u = (r[i] = []), c = 0; c < s; ++c) (o = a[c]) && t.call(o, o.__data__, c, a) && u.push(o);
    return new FA(r, this._parents);
  },
  data: function (t, e) {
    if (!arguments.length) return Array.from(this, nA);
    var n = e ? eA : tA,
      r = this._parents,
      i = this._groups;
    'function' != typeof t &&
      (t = (function (t) {
        return function () {
          return t;
        };
      })(t));
    for (var o = i.length, a = new Array(o), s = new Array(o), u = new Array(o), c = 0; c < o; ++c) {
      var l = r[c],
        f = i[c],
        h = f.length,
        d = rA(t.call(l, l && l.__data__, c, r)),
        p = d.length,
        v = (s[c] = new Array(p)),
        m = (a[c] = new Array(p));
      n(l, f, v, m, (u[c] = new Array(h)), d, e);
      for (var g, y, b = 0, _ = 0; b < p; ++b)
        if ((g = v[b])) {
          for (b >= _ && (_ = b + 1); !(y = m[_]) && ++_ < p; );
          g._next = y || null;
        }
    }
    return ((a = new FA(a, r))._enter = s), (a._exit = u), a;
  },
  enter: function () {
    return new FA(this._enter || this._groups.map(Jx), this._parents);
  },
  exit: function () {
    return new FA(this._exit || this._groups.map(Jx), this._parents);
  },
  join: function (t, e, n) {
    var r = this.enter(),
      i = this,
      o = this.exit();
    return (
      'function' == typeof t ? (r = t(r)) && (r = r.selection()) : (r = r.append(t + '')),
      null != e && (i = e(i)) && (i = i.selection()),
      null == n ? o.remove() : n(o),
      r && i ? r.merge(i).order() : i
    );
  },
  merge: function (t) {
    for (
      var e = t.selection ? t.selection() : t, n = this._groups, r = e._groups, i = n.length, o = r.length, a = Math.min(i, o), s = new Array(i), u = 0;
      u < a;
      ++u
    )
      for (var c, l = n[u], f = r[u], h = l.length, d = (s[u] = new Array(h)), p = 0; p < h; ++p) (c = l[p] || f[p]) && (d[p] = c);
    for (; u < i; ++u) s[u] = n[u];
    return new FA(s, this._parents);
  },
  selection: function () {
    return this;
  },
  order: function () {
    for (var t = this._groups, e = -1, n = t.length; ++e < n; )
      for (var r, i = t[e], o = i.length - 1, a = i[o]; --o >= 0; ) (r = i[o]) && (a && 4 ^ r.compareDocumentPosition(a) && a.parentNode.insertBefore(r, a), (a = r));
    return this;
  },
  sort: function (t) {
    function e(e, n) {
      return e && n ? t(e.__data__, n.__data__) : !e - !n;
    }
    t || (t = iA);
    for (var n = this._groups, r = n.length, i = new Array(r), o = 0; o < r; ++o) {
      for (var a, s = n[o], u = s.length, c = (i[o] = new Array(u)), l = 0; l < u; ++l) (a = s[l]) && (c[l] = a);
      c.sort(e);
    }
    return new FA(i, this._parents).order();
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
      for (var r = t[e], i = 0, o = r.length; i < o; ++i) {
        var a = r[i];
        if (a) return a;
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
    for (var e = this._groups, n = 0, r = e.length; n < r; ++n) for (var i, o = e[n], a = 0, s = o.length; a < s; ++a) (i = o[a]) && t.call(i, i.__data__, a, o);
    return this;
  },
  attr: function (t, e) {
    var n = jx(t);
    if (arguments.length < 2) {
      var r = this.node();
      return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
    }
    return this.each((null == e ? (n.local ? aA : oA) : 'function' == typeof e ? (n.local ? lA : cA) : n.local ? uA : sA)(n, e));
  },
  style: function (t, e, n) {
    return arguments.length > 1 ? this.each((null == e ? hA : 'function' == typeof e ? pA : dA)(t, e, n ?? '')) : vA(this.node(), t);
  },
  property: function (t, e) {
    return arguments.length > 1 ? this.each((null == e ? mA : 'function' == typeof e ? yA : gA)(t, e)) : this.node()[t];
  },
  classed: function (t, e) {
    var n = bA(t + '');
    if (arguments.length < 2) {
      for (var r = _A(this.node()), i = -1, o = n.length; ++i < o; ) if (!r.contains(n[i])) return !1;
      return !0;
    }
    return this.each(('function' == typeof e ? EA : e ? MA : $A)(n, e));
  },
  text: function (t) {
    return arguments.length ? this.each(null == t ? SA : ('function' == typeof t ? kA : CA)(t)) : this.node().textContent;
  },
  html: function (t) {
    return arguments.length ? this.each(null == t ? TA : ('function' == typeof t ? PA : NA)(t)) : this.node().innerHTML;
  },
  raise: function () {
    return this.each(DA);
  },
  lower: function () {
    return this.each(OA);
  },
  append: function (t) {
    var e = 'function' == typeof t ? t : Hx(t);
    return this.select(function () {
      return this.appendChild(e.apply(this, arguments));
    });
  },
  insert: function (t, e) {
    var n = 'function' == typeof t ? t : Hx(t),
      r = null == e ? zA : 'function' == typeof e ? e : Wx(e);
    return this.select(function () {
      return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
    });
  },
  remove: function () {
    return this.each(RA);
  },
  clone: function (t) {
    return this.select(t ? jA : IA);
  },
  datum: function (t) {
    return arguments.length ? this.property('__data__', t) : this.node().__data__;
  },
  on: function (t, e, n) {
    var r,
      i,
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
      a = o.length;
    if (!(arguments.length < 2)) {
      for (s = e ? BA : UA, r = 0; r < a; ++r) this.each(s(o[r], e, n));
      return this;
    }
    var s = this.node().__on;
    if (s) for (var u, c = 0, l = s.length; c < l; ++c) for (r = 0, u = s[c]; r < a; ++r) if ((i = o[r]).type === u.type && i.name === u.name) return u.value;
  },
  dispatch: function (t, e) {
    return this.each(('function' == typeof e ? WA : qA)(t, e));
  },
  [Symbol.iterator]: function* () {
    for (var t = this._groups, e = 0, n = t.length; e < n; ++e) for (var r, i = t[e], o = 0, a = i.length; o < a; ++o) (r = i[o]) && (yield r);
  },
};
var GA = 0.7,
  KA = 1 / GA,
  JA = '\\s*([+-]?\\d+)\\s*',
  QA = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*',
  tM = '\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
  eM = /^#([0-9a-f]{3,8})$/,
  nM = new RegExp(`^rgb\\(${JA},${JA},${JA}\\)$`),
  rM = new RegExp(`^rgb\\(${tM},${tM},${tM}\\)$`),
  iM = new RegExp(`^rgba\\(${JA},${JA},${JA},${QA}\\)$`),
  oM = new RegExp(`^rgba\\(${tM},${tM},${tM},${QA}\\)$`),
  aM = new RegExp(`^hsl\\(${QA},${tM},${tM}\\)$`),
  sM = new RegExp(`^hsla\\(${QA},${tM},${tM},${QA}\\)$`),
  uM = {
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
function cM() {
  return this.rgb().formatHex();
}
function lM() {
  return this.rgb().formatRgb();
}
function fM(t) {
  var e, n;
  return (
    (t = (t + '').trim().toLowerCase()),
    (e = eM.exec(t))
      ? ((n = e[1].length),
        (e = parseInt(e[1], 16)),
        6 === n
          ? hM(e)
          : 3 === n
          ? new vM(((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), ((15 & e) << 4) | (15 & e), 1)
          : 8 === n
          ? dM((e >> 24) & 255, (e >> 16) & 255, (e >> 8) & 255, (255 & e) / 255)
          : 4 === n
          ? dM(((e >> 12) & 15) | ((e >> 8) & 240), ((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), (((15 & e) << 4) | (15 & e)) / 255)
          : null)
      : (e = nM.exec(t))
      ? new vM(e[1], e[2], e[3], 1)
      : (e = rM.exec(t))
      ? new vM((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, 1)
      : (e = iM.exec(t))
      ? dM(e[1], e[2], e[3], e[4])
      : (e = oM.exec(t))
      ? dM((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, e[4])
      : (e = aM.exec(t))
      ? wM(e[1], e[2] / 100, e[3] / 100, 1)
      : (e = sM.exec(t))
      ? wM(e[1], e[2] / 100, e[3] / 100, e[4])
      : uM.hasOwnProperty(t)
      ? hM(uM[t])
      : 'transparent' === t
      ? new vM(NaN, NaN, NaN, 0)
      : null
  );
}
function hM(t) {
  return new vM((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1);
}
function dM(t, e, n, r) {
  return r <= 0 && (t = e = n = NaN), new vM(t, e, n, r);
}
function pM(t, e, n, r) {
  return 1 === arguments.length
    ? (function (t) {
        return t instanceof ZA || (t = fM(t)), t ? new vM((t = t.rgb()).r, t.g, t.b, t.opacity) : new vM();
      })(t)
    : new vM(t, e, n, r ?? 1);
}
function vM(t, e, n, r) {
  (this.r = +t), (this.g = +e), (this.b = +n), (this.opacity = +r);
}
function mM() {
  return `#${_M(this.r)}${_M(this.g)}${_M(this.b)}`;
}
function gM() {
  const t = yM(this.opacity);
  return `${1 === t ? 'rgb(' : 'rgba('}${bM(this.r)}, ${bM(this.g)}, ${bM(this.b)}${1 === t ? ')' : `, ${t})`}`;
}
function yM(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function bM(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function _M(t) {
  return ((t = bM(t)) < 16 ? '0' : '') + t.toString(16);
}
function wM(t, e, n, r) {
  return r <= 0 ? (t = e = n = NaN) : n <= 0 || n >= 1 ? (t = e = NaN) : e <= 0 && (t = NaN), new AM(t, e, n, r);
}
function xM(t) {
  if (t instanceof AM) return new AM(t.h, t.s, t.l, t.opacity);
  if ((t instanceof ZA || (t = fM(t)), !t)) return new AM();
  if (t instanceof AM) return t;
  var e = (t = t.rgb()).r / 255,
    n = t.g / 255,
    r = t.b / 255,
    i = Math.min(e, n, r),
    o = Math.max(e, n, r),
    a = NaN,
    s = o - i,
    u = (o + i) / 2;
  return (
    s
      ? ((a = e === o ? (n - r) / s + 6 * (n < r) : n === o ? (r - e) / s + 2 : (e - n) / s + 4), (s /= u < 0.5 ? o + i : 2 - o - i), (a *= 60))
      : (s = u > 0 && u < 1 ? 0 : a),
    new AM(a, s, u, t.opacity)
  );
}
function AM(t, e, n, r) {
  (this.h = +t), (this.s = +e), (this.l = +n), (this.opacity = +r);
}
function MM(t) {
  return (t = (t || 0) % 360) < 0 ? t + 360 : t;
}
function $M(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function EM(t, e, n) {
  return 255 * (t < 60 ? e + ((n - e) * t) / 60 : t < 180 ? n : t < 240 ? e + ((n - e) * (240 - t)) / 60 : e);
}
YA(ZA, fM, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: cM,
  formatHex: cM,
  formatHex8: function () {
    return this.rgb().formatHex8();
  },
  formatHsl: function () {
    return xM(this).formatHsl();
  },
  formatRgb: lM,
  toString: lM,
}),
  YA(
    vM,
    pM,
    XA(ZA, {
      brighter(t) {
        return (t = null == t ? KA : Math.pow(KA, t)), new vM(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? GA : Math.pow(GA, t)), new vM(this.r * t, this.g * t, this.b * t, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new vM(bM(this.r), bM(this.g), bM(this.b), yM(this.opacity));
      },
      displayable() {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
      },
      hex: mM,
      formatHex: mM,
      formatHex8: function () {
        return `#${_M(this.r)}${_M(this.g)}${_M(this.b)}${_M(255 * (isNaN(this.opacity) ? 1 : this.opacity))}`;
      },
      formatRgb: gM,
      toString: gM,
    })
  ),
  YA(
    AM,
    function (t, e, n, r) {
      return 1 === arguments.length ? xM(t) : new AM(t, e, n, r ?? 1);
    },
    XA(ZA, {
      brighter(t) {
        return (t = null == t ? KA : Math.pow(KA, t)), new AM(this.h, this.s, this.l * t, this.opacity);
      },
      darker(t) {
        return (t = null == t ? GA : Math.pow(GA, t)), new AM(this.h, this.s, this.l * t, this.opacity);
      },
      rgb() {
        var t = (this.h % 360) + 360 * (this.h < 0),
          e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
          n = this.l,
          r = n + (n < 0.5 ? n : 1 - n) * e,
          i = 2 * n - r;
        return new vM(EM(t >= 240 ? t - 240 : t + 120, i, r), EM(t, i, r), EM(t < 120 ? t + 240 : t - 120, i, r), this.opacity);
      },
      clamp() {
        return new AM(MM(this.h), $M(this.s), $M(this.l), yM(this.opacity));
      },
      displayable() {
        return ((0 <= this.s && this.s <= 1) || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
      },
      formatHsl() {
        const t = yM(this.opacity);
        return `${1 === t ? 'hsl(' : 'hsla('}${MM(this.h)}, ${100 * $M(this.s)}%, ${100 * $M(this.l)}%${1 === t ? ')' : `, ${t})`}`;
      },
    })
  );
var SM = (t) => () => t;
function CM(t, e) {
  var n = e - t;
  return n
    ? (function (t, e) {
        return function (n) {
          return t + n * e;
        };
      })(t, n)
    : SM(isNaN(t) ? e : t);
}
var kM = (function t(e) {
  var n = (function (t) {
    return 1 == (t = +t)
      ? CM
      : function (e, n) {
          return n - e
            ? (function (t, e, n) {
                return (
                  (t = Math.pow(t, n)),
                  (e = Math.pow(e, n) - t),
                  (n = 1 / n),
                  function (r) {
                    return Math.pow(t + r * e, n);
                  }
                );
              })(e, n, t)
            : SM(isNaN(e) ? n : e);
        };
  })(e);
  function r(t, e) {
    var r = n((t = pM(t)).r, (e = pM(e)).r),
      i = n(t.g, e.g),
      o = n(t.b, e.b),
      a = CM(t.opacity, e.opacity);
    return function (e) {
      return (t.r = r(e)), (t.g = i(e)), (t.b = o(e)), (t.opacity = a(e)), t + '';
    };
  }
  return (r.gamma = t), r;
})(1);
function TM(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return t * (1 - n) + e * n;
    }
  );
}
var NM = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  PM = new RegExp(NM.source, 'g');
function DM(t, e) {
  var n,
    r,
    i,
    o = (NM.lastIndex = PM.lastIndex = 0),
    a = -1,
    s = [],
    u = [];
  for (t += '', e += ''; (n = NM.exec(t)) && (r = PM.exec(e)); )
    (i = r.index) > o && ((i = e.slice(o, i)), s[a] ? (s[a] += i) : (s[++a] = i)),
      (n = n[0]) === (r = r[0]) ? (s[a] ? (s[a] += r) : (s[++a] = r)) : ((s[++a] = null), u.push({ i: a, x: TM(n, r) })),
      (o = PM.lastIndex);
  return (
    o < e.length && ((i = e.slice(o)), s[a] ? (s[a] += i) : (s[++a] = i)),
    s.length < 2
      ? u[0]
        ? (function (t) {
            return function (e) {
              return t(e) + '';
            };
          })(u[0].x)
        : (function (t) {
            return function () {
              return t;
            };
          })(e)
      : ((e = u.length),
        function (t) {
          for (var n, r = 0; r < e; ++r) s[(n = u[r]).i] = n.x(t);
          return s.join('');
        })
  );
}
var OM,
  zM = 180 / Math.PI,
  RM = { translateX: 0, translateY: 0, rotate: 0, skewX: 0, scaleX: 1, scaleY: 1 };
function IM(t, e, n, r, i, o) {
  var a, s, u;
  return (
    (a = Math.sqrt(t * t + e * e)) && ((t /= a), (e /= a)),
    (u = t * n + e * r) && ((n -= t * u), (r -= e * u)),
    (s = Math.sqrt(n * n + r * r)) && ((n /= s), (r /= s), (u /= s)),
    t * r < e * n && ((t = -t), (e = -e), (u = -u), (a = -a)),
    { translateX: i, translateY: o, rotate: Math.atan2(e, t) * zM, skewX: Math.atan(u) * zM, scaleX: a, scaleY: s }
  );
}
function jM(t, e, n, r) {
  function i(t) {
    return t.length ? t.pop() + ' ' : '';
  }
  return function (o, a) {
    var s = [],
      u = [];
    return (
      (o = t(o)),
      (a = t(a)),
      (function (t, r, i, o, a, s) {
        if (t !== i || r !== o) {
          var u = a.push('translate(', null, e, null, n);
          s.push({ i: u - 4, x: TM(t, i) }, { i: u - 2, x: TM(r, o) });
        } else (i || o) && a.push('translate(' + i + e + o + n);
      })(o.translateX, o.translateY, a.translateX, a.translateY, s, u),
      (function (t, e, n, o) {
        t !== e
          ? (t - e > 180 ? (e += 360) : e - t > 180 && (t += 360), o.push({ i: n.push(i(n) + 'rotate(', null, r) - 2, x: TM(t, e) }))
          : e && n.push(i(n) + 'rotate(' + e + r);
      })(o.rotate, a.rotate, s, u),
      (function (t, e, n, o) {
        t !== e ? o.push({ i: n.push(i(n) + 'skewX(', null, r) - 2, x: TM(t, e) }) : e && n.push(i(n) + 'skewX(' + e + r);
      })(o.skewX, a.skewX, s, u),
      (function (t, e, n, r, o, a) {
        if (t !== n || e !== r) {
          var s = o.push(i(o) + 'scale(', null, ',', null, ')');
          a.push({ i: s - 4, x: TM(t, n) }, { i: s - 2, x: TM(e, r) });
        } else (1 === n && 1 === r) || o.push(i(o) + 'scale(' + n + ',' + r + ')');
      })(o.scaleX, o.scaleY, a.scaleX, a.scaleY, s, u),
      (o = a = null),
      function (t) {
        for (var e, n = -1, r = u.length; ++n < r; ) s[(e = u[n]).i] = e.x(t);
        return s.join('');
      }
    );
  };
}
var UM,
  BM,
  HM = jM(
    function (t) {
      const e = new ('function' == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(t + '');
      return e.isIdentity ? RM : IM(e.a, e.b, e.c, e.d, e.e, e.f);
    },
    'px, ',
    'px)',
    'deg)'
  ),
  qM = jM(
    function (t) {
      return null == t
        ? RM
        : (OM || (OM = document.createElementNS('http://www.w3.org/2000/svg', 'g')),
          OM.setAttribute('transform', t),
          (t = OM.transform.baseVal.consolidate()) ? IM((t = t.matrix).a, t.b, t.c, t.d, t.e, t.f) : RM);
    },
    ', ',
    ')',
    ')'
  ),
  WM = 0,
  LM = 0,
  FM = 0,
  VM = 1e3,
  YM = 0,
  XM = 0,
  ZM = 0,
  GM = 'object' == typeof performance && performance.now ? performance : Date,
  KM =
    'object' == typeof window && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : function (t) {
          setTimeout(t, 17);
        };
function JM() {
  return XM || (KM(QM), (XM = GM.now() + ZM));
}
function QM() {
  XM = 0;
}
function t$() {
  this._call = this._time = this._next = null;
}
function e$(t, e, n) {
  var r = new t$();
  return r.restart(t, e, n), r;
}
function n$() {
  (XM = (YM = GM.now()) + ZM), (WM = LM = 0);
  try {
    !(function () {
      JM(), ++WM;
      for (var t, e = UM; e; ) (t = XM - e._time) >= 0 && e._call.call(void 0, t), (e = e._next);
      --WM;
    })();
  } finally {
    (WM = 0),
      (function () {
        for (var t, e, n = UM, r = 1 / 0; n; )
          n._call ? (r > n._time && (r = n._time), (t = n), (n = n._next)) : ((e = n._next), (n._next = null), (n = t ? (t._next = e) : (UM = e)));
        (BM = t), i$(r);
      })(),
      (XM = 0);
  }
}
function r$() {
  var t = GM.now(),
    e = t - YM;
  e > VM && ((ZM -= e), (YM = t));
}
function i$(t) {
  WM ||
    (LM && (LM = clearTimeout(LM)),
    t - XM > 24
      ? (t < 1 / 0 && (LM = setTimeout(n$, t - GM.now() - ZM)), FM && (FM = clearInterval(FM)))
      : (FM || ((YM = GM.now()), (FM = setInterval(r$, VM))), (WM = 1), KM(n$)));
}
function o$(t, e, n) {
  var r = new t$();
  return (
    (e = null == e ? 0 : +e),
    r.restart(
      (n) => {
        r.stop(), t(n + e);
      },
      e,
      n
    ),
    r
  );
}
t$.prototype = e$.prototype = {
  constructor: t$,
  restart: function (t, e, n) {
    if ('function' != typeof t) throw new TypeError('callback is not a function');
    (n = (null == n ? JM() : +n) + (null == e ? 0 : +e)),
      this._next || BM === this || (BM ? (BM._next = this) : (UM = this), (BM = this)),
      (this._call = t),
      (this._time = n),
      i$();
  },
  stop: function () {
    this._call && ((this._call = null), (this._time = 1 / 0), i$());
  },
};
var a$ = Px('start', 'end', 'cancel', 'interrupt'),
  s$ = [],
  u$ = 0,
  c$ = 3;
function l$(t, e, n, r, i, o) {
  var a = t.__transition;
  if (a) {
    if (n in a) return;
  } else t.__transition = {};
  !(function (t, e, n) {
    var r,
      i = t.__transition;
    function o(u) {
      var c, l, f, h;
      if (1 !== n.state) return s();
      for (c in i)
        if ((h = i[c]).name === n.name) {
          if (h.state === c$) return o$(o);
          4 === h.state
            ? ((h.state = 6), h.timer.stop(), h.on.call('interrupt', t, t.__data__, h.index, h.group), delete i[c])
            : +c < e && ((h.state = 6), h.timer.stop(), h.on.call('cancel', t, t.__data__, h.index, h.group), delete i[c]);
        }
      if (
        (o$(function () {
          n.state === c$ && ((n.state = 4), n.timer.restart(a, n.delay, n.time), a(u));
        }),
        (n.state = 2),
        n.on.call('start', t, t.__data__, n.index, n.group),
        2 === n.state)
      ) {
        for (n.state = c$, r = new Array((f = n.tween.length)), c = 0, l = -1; c < f; ++c)
          (h = n.tween[c].value.call(t, t.__data__, n.index, n.group)) && (r[++l] = h);
        r.length = l + 1;
      }
    }
    function a(e) {
      for (var i = e < n.duration ? n.ease.call(null, e / n.duration) : (n.timer.restart(s), (n.state = 5), 1), o = -1, a = r.length; ++o < a; ) r[o].call(t, i);
      5 === n.state && (n.on.call('end', t, t.__data__, n.index, n.group), s());
    }
    function s() {
      for (var r in ((n.state = 6), n.timer.stop(), delete i[e], i)) return;
      delete t.__transition;
    }
    (i[e] = n),
      (n.timer = e$(
        function (t) {
          (n.state = 1), n.timer.restart(o, n.delay, n.time), n.delay <= t && o(t - n.delay);
        },
        0,
        n.time
      ));
  })(t, n, { name: e, index: r, group: i, on: a$, tween: s$, time: o.time, delay: o.delay, duration: o.duration, ease: o.ease, timer: null, state: u$ });
}
function f$(t, e) {
  var n = d$(t, e);
  if (n.state > u$) throw new Error('too late; already scheduled');
  return n;
}
function h$(t, e) {
  var n = d$(t, e);
  if (n.state > c$) throw new Error('too late; already running');
  return n;
}
function d$(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error('transition not found');
  return n;
}
function p$(t, e) {
  var n, r;
  return function () {
    var i = h$(this, t),
      o = i.tween;
    if (o !== n)
      for (var a = 0, s = (r = n = o).length; a < s; ++a)
        if (r[a].name === e) {
          (r = r.slice()).splice(a, 1);
          break;
        }
    i.tween = r;
  };
}
function v$(t, e, n) {
  var r, i;
  if ('function' != typeof n) throw new Error();
  return function () {
    var o = h$(this, t),
      a = o.tween;
    if (a !== r) {
      i = (r = a).slice();
      for (var s = { name: e, value: n }, u = 0, c = i.length; u < c; ++u)
        if (i[u].name === e) {
          i[u] = s;
          break;
        }
      u === c && i.push(s);
    }
    o.tween = i;
  };
}
function m$(t, e, n) {
  var r = t._id;
  return (
    t.each(function () {
      var t = h$(this, r);
      (t.value || (t.value = {}))[e] = n.apply(this, arguments);
    }),
    function (t) {
      return d$(t, r).value[e];
    }
  );
}
function g$(t, e) {
  var n;
  return ('number' == typeof e ? TM : e instanceof fM ? kM : (n = fM(e)) ? ((e = n), kM) : DM)(t, e);
}
function y$(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function b$(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function _$(t, e, n) {
  var r,
    i,
    o = n + '';
  return function () {
    var a = this.getAttribute(t);
    return a === o ? null : a === r ? i : (i = e((r = a), n));
  };
}
function w$(t, e, n) {
  var r,
    i,
    o = n + '';
  return function () {
    var a = this.getAttributeNS(t.space, t.local);
    return a === o ? null : a === r ? i : (i = e((r = a), n));
  };
}
function x$(t, e, n) {
  var r, i, o;
  return function () {
    var a,
      s,
      u = n(this);
    if (null != u) return (a = this.getAttribute(t)) === (s = u + '') ? null : a === r && s === i ? o : ((i = s), (o = e((r = a), u)));
    this.removeAttribute(t);
  };
}
function A$(t, e, n) {
  var r, i, o;
  return function () {
    var a,
      s,
      u = n(this);
    if (null != u) return (a = this.getAttributeNS(t.space, t.local)) === (s = u + '') ? null : a === r && s === i ? o : ((i = s), (o = e((r = a), u)));
    this.removeAttributeNS(t.space, t.local);
  };
}
function M$(t, e) {
  var n, r;
  function i() {
    var i = e.apply(this, arguments);
    return (
      i !== r &&
        (n =
          (r = i) &&
          (function (t, e) {
            return function (n) {
              this.setAttributeNS(t.space, t.local, e.call(this, n));
            };
          })(t, i)),
      n
    );
  }
  return (i._value = e), i;
}
function $$(t, e) {
  var n, r;
  function i() {
    var i = e.apply(this, arguments);
    return (
      i !== r &&
        (n =
          (r = i) &&
          (function (t, e) {
            return function (n) {
              this.setAttribute(t, e.call(this, n));
            };
          })(t, i)),
      n
    );
  }
  return (i._value = e), i;
}
function E$(t, e) {
  return function () {
    f$(this, t).delay = +e.apply(this, arguments);
  };
}
function S$(t, e) {
  return (
    (e = +e),
    function () {
      f$(this, t).delay = e;
    }
  );
}
function C$(t, e) {
  return function () {
    h$(this, t).duration = +e.apply(this, arguments);
  };
}
function k$(t, e) {
  return (
    (e = +e),
    function () {
      h$(this, t).duration = e;
    }
  );
}
var T$ = VA.prototype.constructor;
function N$(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
var P$ = 0;
function D$(t, e, n, r) {
  (this._groups = t), (this._parents = e), (this._name = n), (this._id = r);
}
function O$() {
  return ++P$;
}
var z$ = VA.prototype;
D$.prototype = {
  constructor: D$,
  select: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = Wx(t));
    for (var r = this._groups, i = r.length, o = new Array(i), a = 0; a < i; ++a)
      for (var s, u, c = r[a], l = c.length, f = (o[a] = new Array(l)), h = 0; h < l; ++h)
        (s = c[h]) && (u = t.call(s, s.__data__, h, c)) && ('__data__' in s && (u.__data__ = s.__data__), (f[h] = u), l$(f[h], e, n, h, f, d$(s, n)));
    return new D$(o, this._parents, e, n);
  },
  selectAll: function (t) {
    var e = this._name,
      n = this._id;
    'function' != typeof t && (t = Fx(t));
    for (var r = this._groups, i = r.length, o = [], a = [], s = 0; s < i; ++s)
      for (var u, c = r[s], l = c.length, f = 0; f < l; ++f)
        if ((u = c[f])) {
          for (var h, d = t.call(u, u.__data__, f, c), p = d$(u, n), v = 0, m = d.length; v < m; ++v) (h = d[v]) && l$(h, e, n, v, d, p);
          o.push(d), a.push(u);
        }
    return new D$(o, a, e, n);
  },
  selectChild: z$.selectChild,
  selectChildren: z$.selectChildren,
  filter: function (t) {
    'function' != typeof t && (t = Vx(t));
    for (var e = this._groups, n = e.length, r = new Array(n), i = 0; i < n; ++i)
      for (var o, a = e[i], s = a.length, u = (r[i] = []), c = 0; c < s; ++c) (o = a[c]) && t.call(o, o.__data__, c, a) && u.push(o);
    return new D$(r, this._parents, this._name, this._id);
  },
  merge: function (t) {
    if (t._id !== this._id) throw new Error();
    for (var e = this._groups, n = t._groups, r = e.length, i = n.length, o = Math.min(r, i), a = new Array(r), s = 0; s < o; ++s)
      for (var u, c = e[s], l = n[s], f = c.length, h = (a[s] = new Array(f)), d = 0; d < f; ++d) (u = c[d] || l[d]) && (h[d] = u);
    for (; s < r; ++s) a[s] = e[s];
    return new D$(a, this._parents, this._name, this._id);
  },
  selection: function () {
    return new T$(this._groups, this._parents);
  },
  transition: function () {
    for (var t = this._name, e = this._id, n = O$(), r = this._groups, i = r.length, o = 0; o < i; ++o)
      for (var a, s = r[o], u = s.length, c = 0; c < u; ++c)
        if ((a = s[c])) {
          var l = d$(a, e);
          l$(a, t, n, c, s, { time: l.time + l.delay + l.duration, delay: 0, duration: l.duration, ease: l.ease });
        }
    return new D$(r, this._parents, t, n);
  },
  call: z$.call,
  nodes: z$.nodes,
  node: z$.node,
  size: z$.size,
  empty: z$.empty,
  each: z$.each,
  on: function (t, e) {
    var n = this._id;
    return arguments.length < 2
      ? d$(this.node(), n).on.on(t)
      : this.each(
          (function (t, e, n) {
            var r,
              i,
              o = (function (t) {
                return (t + '')
                  .trim()
                  .split(/^|\s+/)
                  .every(function (t) {
                    var e = t.indexOf('.');
                    return e >= 0 && (t = t.slice(0, e)), !t || 'start' === t;
                  });
              })(e)
                ? f$
                : h$;
            return function () {
              var a = o(this, t),
                s = a.on;
              s !== r && (i = (r = s).copy()).on(e, n), (a.on = i);
            };
          })(n, t, e)
        );
  },
  attr: function (t, e) {
    var n = jx(t),
      r = 'transform' === n ? qM : g$;
    return this.attrTween(
      t,
      'function' == typeof e ? (n.local ? A$ : x$)(n, r, m$(this, 'attr.' + t, e)) : null == e ? (n.local ? b$ : y$)(n) : (n.local ? w$ : _$)(n, r, e)
    );
  },
  attrTween: function (t, e) {
    var n = 'attr.' + t;
    if (arguments.length < 2) return (n = this.tween(n)) && n._value;
    if (null == e) return this.tween(n, null);
    if ('function' != typeof e) throw new Error();
    var r = jx(t);
    return this.tween(n, (r.local ? M$ : $$)(r, e));
  },
  style: function (t, e, n) {
    var r = 'transform' == (t += '') ? HM : g$;
    return null == e
      ? this.styleTween(
          t,
          (function (t, e) {
            var n, r, i;
            return function () {
              var o = vA(this, t),
                a = (this.style.removeProperty(t), vA(this, t));
              return o === a ? null : o === n && a === r ? i : (i = e((n = o), (r = a)));
            };
          })(t, r)
        ).on('end.style.' + t, N$(t))
      : 'function' == typeof e
      ? this.styleTween(
          t,
          (function (t, e, n) {
            var r, i, o;
            return function () {
              var a = vA(this, t),
                s = n(this),
                u = s + '';
              return null == s && (this.style.removeProperty(t), (u = s = vA(this, t))), a === u ? null : a === r && u === i ? o : ((i = u), (o = e((r = a), s)));
            };
          })(t, r, m$(this, 'style.' + t, e))
        ).each(
          (function (t, e) {
            var n,
              r,
              i,
              o,
              a = 'style.' + e,
              s = 'end.' + a;
            return function () {
              var u = h$(this, t),
                c = u.on,
                l = null == u.value[a] ? o || (o = N$(e)) : void 0;
              (c === n && i === l) || (r = (n = c).copy()).on(s, (i = l)), (u.on = r);
            };
          })(this._id, t)
        )
      : this.styleTween(
          t,
          (function (t, e, n) {
            var r,
              i,
              o = n + '';
            return function () {
              var a = vA(this, t);
              return a === o ? null : a === r ? i : (i = e((r = a), n));
            };
          })(t, r, e),
          n
        ).on('end.style.' + t, null);
  },
  styleTween: function (t, e, n) {
    var r = 'style.' + (t += '');
    if (arguments.length < 2) return (r = this.tween(r)) && r._value;
    if (null == e) return this.tween(r, null);
    if ('function' != typeof e) throw new Error();
    return this.tween(
      r,
      (function (t, e, n) {
        var r, i;
        function o() {
          var o = e.apply(this, arguments);
          return (
            o !== i &&
              (r =
                (i = o) &&
                (function (t, e, n) {
                  return function (r) {
                    this.style.setProperty(t, e.call(this, r), n);
                  };
                })(t, o, n)),
            r
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
          })(m$(this, 'text', t))
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
        function r() {
          var r = t.apply(this, arguments);
          return (
            r !== n &&
              (e =
                (n = r) &&
                (function (t) {
                  return function (e) {
                    this.textContent = t.call(this, e);
                  };
                })(r)),
            e
          );
        }
        return (r._value = t), r;
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
      for (var r, i = d$(this.node(), n).tween, o = 0, a = i.length; o < a; ++o) if ((r = i[o]).name === t) return r.value;
      return null;
    }
    return this.each((null == e ? p$ : v$)(n, t, e));
  },
  delay: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? E$ : S$)(e, t)) : d$(this.node(), e).delay;
  },
  duration: function (t) {
    var e = this._id;
    return arguments.length ? this.each(('function' == typeof t ? C$ : k$)(e, t)) : d$(this.node(), e).duration;
  },
  ease: function (t) {
    var e = this._id;
    return arguments.length
      ? this.each(
          (function (t, e) {
            if ('function' != typeof e) throw new Error();
            return function () {
              h$(this, t).ease = e;
            };
          })(e, t)
        )
      : d$(this.node(), e).ease;
  },
  easeVarying: function (t) {
    if ('function' != typeof t) throw new Error();
    return this.each(
      (function (t, e) {
        return function () {
          var n = e.apply(this, arguments);
          if ('function' != typeof n) throw new Error();
          h$(this, t).ease = n;
        };
      })(this._id, t)
    );
  },
  end: function () {
    var t,
      e,
      n = this,
      r = n._id,
      i = n.size();
    return new Promise(function (o, a) {
      var s = { value: a },
        u = {
          value: function () {
            0 == --i && o();
          },
        };
      n.each(function () {
        var n = h$(this, r),
          i = n.on;
        i !== t && ((e = (t = i).copy())._.cancel.push(s), e._.interrupt.push(s), e._.end.push(u)), (n.on = e);
      }),
        0 === i && o();
    });
  },
  [Symbol.iterator]: z$[Symbol.iterator],
};
var R$,
  I$,
  j$,
  U$ = {
    time: null,
    delay: 0,
    duration: 250,
    ease: function (t) {
      return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
    },
  };
function B$(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); ) if (!(t = t.parentNode)) throw new Error(`transition ${e} not found`);
  return n;
}
function H$(t, e, n) {
  (this.k = t), (this.x = e), (this.y = n);
}
(VA.prototype.interrupt = function (t) {
  return this.each(function () {
    !(function (t, e) {
      var n,
        r,
        i,
        o = t.__transition,
        a = !0;
      if (o) {
        for (i in ((e = null == e ? null : e + ''), o))
          (n = o[i]).name === e
            ? ((r = n.state > 2 && n.state < 5), (n.state = 6), n.timer.stop(), n.on.call(r ? 'interrupt' : 'cancel', t, t.__data__, n.index, n.group), delete o[i])
            : (a = !1);
        a && delete t.__transition;
      }
    })(this, t);
  });
}),
  (VA.prototype.transition = function (t) {
    var e, n;
    t instanceof D$ ? ((e = t._id), (t = t._name)) : ((e = O$()), ((n = U$).time = JM()), (t = null == t ? null : t + ''));
    for (var r = this._groups, i = r.length, o = 0; o < i; ++o) for (var a, s = r[o], u = s.length, c = 0; c < u; ++c) (a = s[c]) && l$(a, t, e, c, s, n || B$(a, e));
    return new D$(r, this._parents, t, e);
  }),
  (H$.prototype = {
    constructor: H$,
    scale: function (t) {
      return 1 === t ? this : new H$(this.k * t, this.x, this.y);
    },
    translate: function (t, e) {
      return (0 === t) & (0 === e) ? this : new H$(this.k, this.x + this.k * t, this.y + this.k * e);
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
  H$.prototype;
let q$ = class extends ie(So(re(ee(Jt(Gt(ue(Pa))))))) {
  constructor() {
    super(...arguments), R$.set(this, void 0), I$.set(this, void 0), j$.set(this, void 0);
  }
  connectedCallback() {
    super.connectedCallback();
    const t = parseInt(this.getAttribute('numberofticks') || '', 10);
    (this.numberOfTicks = Number.isInteger(t) ? t : 3),
      this.addEventListener('load', (t) => {
        this.data = t.detail.payload;
      });
  }
  get data() {
    return this.sequence || '';
  }
  set data(t) {
    'string' == typeof t ? (this.sequence = t) : 'string' == typeof (null == t ? void 0 : t.sequence) && (this.sequence = t.sequence),
      this.svg && (this.updateScaleDomain(), this.applyZoomTranslation());
  }
  getCharSize() {
    var t, e;
    if (!this.seq_g) return;
    const n = this.seq_g.select('text.base').node();
    if (n) (this.chWidth = 0.8 * n.getBBox().width), (this.chHeight = 1.6 * n.getBBox().height);
    else {
      const n = this.seq_g.append('text').attr('class', 'base').text('T');
      (this.chWidth = 0.8 * ((null === (t = n.node()) || void 0 === t ? void 0 : t.getBBox().width) || 0)),
        (this.chHeight = 1.6 * ((null === (e = n.node()) || void 0 === e ? void 0 : e.getBBox().height) || 0)),
        n.remove();
    }
  }
  createSequence() {
    var t, e, n;
    (this.svg = (function (t) {
      return 'string' == typeof t ? new FA([[document.querySelector(t)]], [document.documentElement]) : new FA([[t]], LA);
    })(this)
      .selectAll('svg')
      .attr('id', '')
      .attr('width', this.width)
      .attr('height', this.height)),
      bw(this, R$, null === (t = this.svg) || void 0 === t ? void 0 : t.append('g').attr('class', 'background'), 'f'),
      bw(this, I$, null === (e = this.svg) || void 0 === e ? void 0 : e.append('g').attr('class', 'x axis'), 'f'),
      (this.seq_g =
        null === (n = this.svg) || void 0 === n
          ? void 0
          : n
              .append('g')
              .attr('class', 'sequence')
              .attr('transform', `translate(0,${this['margin-top'] + 0.75 * this.getHeightWithMargins()})`)),
      (this.highlighted = this.svg.append('g').attr('class', 'highlighted')),
      (this.margins = this.svg.append('g').attr('class', 'margin')),
      this.sequence && (this.updateScaleDomain(), this.applyZoomTranslation());
  }
  firstUpdated() {
    this.createSequence();
  }
  zoomRefreshed() {
    this.renderD3();
  }
  renderD3() {
    var t, e, n, r;
    if ((this.getCharSize(), null === (t = this.svg) || void 0 === t || t.attr('width', this.width).attr('height', this.height), yw(this, I$, 'f'))) {
      const t = this.getSingleBaseWidth(),
        i = t - (this.chWidth || 0),
        o = t / 2,
        a = Math.floor(Math.max(0, this.getStart() - 1)),
        s = Math.ceil(Math.min((null === (e = this.sequence) || void 0 === e ? void 0 : e.length) || 0, this.getEnd())),
        u =
          i < 0
            ? []
            : (null === (n = this.sequence) || void 0 === n
                ? void 0
                : n
                    .slice(a, s)
                    .split('')
                    .map((t, e) => ({ position: 1 + a + e, aa: t }))) || [];
      if (this.height > (this.chWidth || 0) && this.xScale) {
        const t = ((r = this.xScale), Tx(3, r)).tickFormat((t) => `${Number.isInteger(t) ? t : ''}`).ticks(this.numberOfTicks, 's');
        yw(this, I$, 'f').call(t);
      }
      yw(this, I$, 'f').attr('transform', `translate(${this['margin-left'] + o},${this['margin-top']})`),
        yw(this, I$, 'f').select('.domain').remove(),
        yw(this, I$, 'f').selectAll('.tick line').remove(),
        yw(this, I$, 'f').selectAll('.tick text').attr('y', 2);
      const c = Math.max(10, this.chWidth || 10, Math.min(this['margin-top'] + 0.25 * this.getHeightWithMargins(), t - 2));
      if ((yw(this, I$, 'f').selectAll('.tick text').attr('font-size', c), this.seq_g)) {
        this.seq_g.attr('transform', `translate(0,${this['margin-top'] + 0.75 * this.getHeightWithMargins()})`), bw(this, j$, this.seq_g.selectAll('text.base'), 'f');
        const e = yw(this, j$, 'f').data(u, (t) => t.position);
        if (
          (e
            .enter()
            .append('text')
            .attr('class', 'base')
            .attr('text-anchor', 'middle')
            .attr('x', (t) => this.getXFromSeqPosition(t.position) + o)
            .text((t) => t.aa)
            .attr('font-size', c)
            .style('pointer-events', 'none')
            .style('font-family', 'monospace'),
          e.exit().remove(),
          e.attr('font-size', c).attr('x', (t) => this.getXFromSeqPosition(t.position) + o),
          yw(this, R$, 'f'))
        ) {
          const e = yw(this, R$, 'f')
            .selectAll('rect.base_bg')
            .data(u, (t) => t.position);
          e
            .enter()
            .append('rect')
            .attr('class', 'base_bg feature')
            .attr('height', this.getHeightWithMargins())
            .attr('width', t)
            .attr('fill', (t) => (Math.round(t.position) % 2 ? '#ccc' : '#eee'))
            .attr('x', (t) => this.getXFromSeqPosition(t.position))
            .attr('y', this['margin-top'])
            .style('opacity', Math.min(1, i))
            .call(To, this),
            e
              .attr('width', t)
              .attr('fill', (t) => (Math.round(t.position) % 2 ? '#ccc' : '#eee'))
              .attr('height', this.getHeightWithMargins())
              .attr('x', (t) => this.getXFromSeqPosition(t.position))
              .attr('y', this['margin-top']),
            e.exit().remove(),
            this.seq_g.style('opacity', Math.min(1, i)),
            e.style('opacity', Math.min(1, i));
        }
      }
      this.updateHighlight(), this.renderMarginOnGroup(this.margins);
    }
  }
  getStart() {
    return this['display-start'] || 1;
  }
  getEnd() {
    return ((this['display-end'] || 0) > 0 ? this['display-end'] : this.length) || 0;
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
  render() {
    return ex`<svg class="container"></svg>`;
  }
};
(R$ = new WeakMap()),
  (I$ = new WeakMap()),
  (j$ = new WeakMap()),
  gw(
    [
      (function (t) {
        return (e, n) =>
          void 0 !== n
            ? ((t, e, n) => {
                e.constructor.createProperty(n, t);
              })(t, e, n)
            : wx(t, e);
      })({ type: String }),
    ],
    q$.prototype,
    'sequence',
    void 0
  ),
  (q$ = gw([No('nightingale-sequence')], q$));
var W$,
  L$,
  F$,
  V$ = q$;
let Y$ = class extends V$ {
  constructor() {
    super(...arguments), W$.set(this, void 0), L$.set(this, void 0), F$.set(this, void 0);
  }
  connectedCallback() {
    super.connectedCallback();
    const t = parseInt(this.getAttribute('numberofticks') || '', 10);
    (this.numberOfTicks = Number.isInteger(t) ? t : 3),
      this.addEventListener('load', (t) => {
        this.data = t.detail.payload;
      }),
      (this.style.display = 'block'),
      (this.style.lineHeight = '0'),
      (this.style.width = `${this.width}px`);
  }
  get data() {
    return this.sequence || '';
  }
  set data(t) {
    'string' == typeof t
      ? ((this.sequence = t), (this.sequenceData = t.split(',')))
      : 'string' == typeof (null == t ? void 0 : t.sequence) && ((this.sequence = t.sequence), (this.sequenceData = t.sequence.split(','))),
      this.svg && (this.updateScaleDomain(), this.applyZoomTranslation());
  }
  checkSeqData() {
    !this.sequenceData && this.sequence && (this.sequenceData = this.sequence.split(','));
  }
  getCharSize() {
    var t, e;
    if (!this.seq_g) return;
    const n = this.seq_g.append('text').attr('class', 'base').text('T');
    (this.chWidth = 0.8 * ((null === (t = n.node()) || void 0 === t ? void 0 : t.getBBox().width) || 0)),
      (this.chHeight = 1.6 * ((null === (e = n.node()) || void 0 === e ? void 0 : e.getBBox().height) || 0)),
      n.remove(),
      (this.chWidth = 3 * this.chWidth);
  }
  createSequence() {
    var t, e, n;
    (this.svg = Qp(this).selectAll('svg').attr('id', '').attr('width', this.width).attr('height', this.height)),
      $(this, W$, null === (t = this.svg) || void 0 === t ? void 0 : t.append('g').attr('class', 'background'), 'f'),
      $(this, L$, null === (e = this.svg) || void 0 === e ? void 0 : e.append('g').attr('class', 'x axis'), 'f'),
      (this.seq_g =
        null === (n = this.svg) || void 0 === n
          ? void 0
          : n
              .append('g')
              .attr('class', 'sequence')
              .attr('transform', `translate(0,${this['margin-top'] + 0.75 * this.getHeightWithMargins()})`)),
      (this.highlighted = this.svg.append('g').attr('class', 'highlighted')),
      (this.margins = this.svg.append('g').attr('class', 'margin')),
      this.checkSeqData(),
      this.sequence && (this.updateScaleDomain(), this.applyZoomTranslation());
  }
  firstUpdated() {
    this.checkSeqData(), this.createSequence();
  }
  zoomRefreshed() {
    this.checkSeqData(), this.renderD3();
  }
  renderD3() {
    var t, e, n, r, i;
    if ((this.getCharSize(), null === (t = this.svg) || void 0 === t || t.attr('width', this.width).attr('height', this.height), M(this, L$, 'f'))) {
      const t = this.getSingleBaseWidth(),
        o = t - (this.chWidth || 0),
        a = t / 2,
        s = Math.floor(Math.max(0, this.getStart() - 1)),
        u = Math.ceil(Math.min((null === (e = this.sequenceData) || void 0 === e ? void 0 : e.length) || 0, this.getEnd())),
        c =
          o < 0
            ? []
            : (null === (r = null === (n = this.sequenceData) || void 0 === n ? void 0 : n.slice(s, u)) || void 0 === r
                ? void 0
                : r.map((t, e) => ({ position: 1 + s + e, atomName: t.substring(0) }))) || [];
      if (this.height > (this.chWidth || 0) && this.xScale) {
        const t = ((i = this.xScale), dw(ow, i)).tickFormat((t) => `${Number.isInteger(t) ? t : ''}`).ticks(this.numberOfTicks, 's');
        M(this, L$, 'f').call(t);
      }
      M(this, L$, 'f').attr('transform', `translate(${this['margin-left'] + a},${this['margin-top']})`),
        M(this, L$, 'f').select('.domain').remove(),
        M(this, L$, 'f').selectAll('.tick line').remove(),
        M(this, L$, 'f').selectAll('.tick text').attr('y', 2);
      const l = '10px';
      if ((M(this, L$, 'f').selectAll('.tick text').attr('font-size', l), this.seq_g)) {
        this.seq_g.attr('transform', `translate(0,${this['margin-top'] + 0.75 * this.getHeightWithMargins()})`), $(this, F$, this.seq_g.selectAll('text.base'), 'f');
        const e = M(this, F$, 'f').data(c, (t) => t.position);
        if (
          (e
            .enter()
            .append('text')
            .attr('class', 'base')
            .attr('text-anchor', 'middle')
            .attr('x', (t, e) => this.getXFromSeqPosition(t.position) + a)
            .text((t) => t.atomName)
            .attr('font-size', l)
            .style('pointer-events', 'none')
            .style('font-family', 'monospace'),
          e.exit().remove(),
          e.attr('font-size', l).attr('x', (t, e) => this.getXFromSeqPosition(t.position) + a),
          M(this, W$, 'f'))
        ) {
          const e = M(this, W$, 'f')
            .selectAll('rect.base_bg')
            .data(c, (t) => t.position);
          e
            .enter()
            .append('rect')
            .attr('class', 'base_bg feature')
            .attr('height', this.getHeightWithMargins())
            .attr('width', t)
            .attr('fill', (t) => (Math.round(t.position) % 2 ? '#ccc' : '#eee'))
            .attr('x', (t) => this.getXFromSeqPosition(t.position))
            .attr('y', this['margin-top'])
            .style('opacity', Math.min(1, o))
            .call(To, this),
            e
              .attr('width', t)
              .attr('fill', (t) => (Math.round(t.position) % 2 ? '#ccc' : '#eee'))
              .attr('height', this.getHeightWithMargins())
              .attr('x', (t) => this.getXFromSeqPosition(t.position))
              .attr('y', this['margin-top']),
            e.exit().remove(),
            this.seq_g.style('opacity', Math.min(1, o)),
            e.style('opacity', Math.min(1, o));
        }
      }
      this.updateHighlight(), this.renderMarginOnGroup(this.margins);
    }
  }
  render() {
    return yt`<svg class="container"></svg>`;
  }
};
(W$ = new WeakMap()), (L$ = new WeakMap()), (F$ = new WeakMap()), (Y$ = i([No('pdb-ligand-interactions-sequence')], Y$));
var X$ = Y$;
const Z$ = function (t, e) {
    customElements.get(t) || customElements.define(t, e);
  },
  G$ = function () {
    Z$('nightingale-sequence-heatmap-new', mw), Z$('pdb-ligand-interactions-sequence', X$);
  };
window.customElements
  ? G$()
  : document.addEventListener('WebComponentsReady', function () {
      G$();
    });
//# sourceMappingURL=heatmap-components-v0.1.js.map
