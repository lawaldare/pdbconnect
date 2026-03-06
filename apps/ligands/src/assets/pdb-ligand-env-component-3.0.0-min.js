var __webpack_modules__ = {
    './node_modules/css-loader/dist/runtime/api.js': (e) => {
      e.exports = function (e) {
        var t = [];
        return (
          (t.toString = function () {
            return this.map(function (t) {
              var n = (function (e, t) {
                var n = e[1] || '',
                  o = e[3];
                if (!o) return n;
                if (t && 'function' == typeof btoa) {
                  var s =
                      ((i = o), '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(i)))) + ' */'),
                    r = o.sources.map(function (e) {
                      return '/*# sourceURL=' + o.sourceRoot + e + ' */';
                    });
                  return [n].concat(r).concat([s]).join('\n');
                }
                var i;
                return [n].join('\n');
              })(t, e);
              return t[2] ? '@media ' + t[2] + '{' + n + '}' : n;
            }).join('');
          }),
          (t.i = function (e, n) {
            'string' == typeof e && (e = [[null, e, '']]);
            for (var o = {}, s = 0; s < this.length; s++) {
              var r = this[s][0];
              null != r && (o[r] = !0);
            }
            for (s = 0; s < e.length; s++) {
              var i = e[s];
              (null != i[0] && o[i[0]]) || (n && !i[2] ? (i[2] = n) : n && (i[2] = '(' + i[2] + ') and (' + n + ')'), t.push(i));
            }
          }),
          t
        );
      };
    },
    './node_modules/d3-array/src/ascending.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
            },
        });
    },
    './node_modules/d3-array/src/bisect.js': (e, t, n) => {
      n.r(t), n.d(t, { bisectCenter: () => l, bisectLeft: () => a, bisectRight: () => d, default: () => c });
      var o = n('./node_modules/d3-array/src/ascending.js'),
        s = n('./node_modules/d3-array/src/bisector.js'),
        r = n('./node_modules/d3-array/src/number.js');
      const i = (0, s.default)(o.default),
        d = i.right,
        a = i.left,
        l = (0, s.default)(r.default).center,
        c = d;
    },
    './node_modules/d3-array/src/bisector.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              let t = e,
                n = e;
              1 === e.length &&
                ((t = (t, n) => e(t) - n),
                (n = (function (e) {
                  return (t, n) => (0, o.default)(e(t), n);
                })(e)));
              function s(e, t, o, s) {
                for (null == o && (o = 0), null == s && (s = e.length); o < s; ) {
                  const r = (o + s) >>> 1;
                  n(e[r], t) < 0 ? (o = r + 1) : (s = r);
                }
                return o;
              }
              return {
                left: s,
                center: function (e, n, o, r) {
                  null == o && (o = 0);
                  null == r && (r = e.length);
                  const i = s(e, n, o, r - 1);
                  return i > o && t(e[i - 1], n) > -t(e[i], n) ? i - 1 : i;
                },
                right: function (e, t, o, s) {
                  null == o && (o = 0);
                  null == s && (s = e.length);
                  for (; o < s; ) {
                    const r = (o + s) >>> 1;
                    n(e[r], t) > 0 ? (s = r) : (o = r + 1);
                  }
                  return o;
                },
              };
            },
        });
      var o = n('./node_modules/d3-array/src/ascending.js');
    },
    './node_modules/d3-array/src/max.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              let n;
              if (void 0 === t) for (const t of e) null != t && (n < t || (void 0 === n && t >= t)) && (n = t);
              else {
                let o = -1;
                for (let s of e) null != (s = t(s, ++o, e)) && (n < s || (void 0 === n && s >= s)) && (n = s);
              }
              return n;
            },
        });
    },
    './node_modules/d3-array/src/min.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              let n;
              if (void 0 === t) for (const t of e) null != t && (n > t || (void 0 === n && t >= t)) && (n = t);
              else {
                let o = -1;
                for (let s of e) null != (s = t(s, ++o, e)) && (n > s || (void 0 === n && s >= s)) && (n = s);
              }
              return n;
            },
        });
    },
    './node_modules/d3-array/src/number.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return null === e ? NaN : +e;
            },
          numbers: () =>
            function* (e, t) {
              if (void 0 === t) for (let t of e) null != t && (t = +t) >= t && (yield t);
              else {
                let n = -1;
                for (let o of e) null != (o = t(o, ++n, e)) && (o = +o) >= o && (yield o);
              }
            },
        });
    },
    './node_modules/d3-array/src/sum.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              let n = 0;
              if (void 0 === t) for (let t of e) (t = +t) && (n += t);
              else {
                let o = -1;
                for (let s of e) (s = +t(s, ++o, e)) && (n += s);
              }
              return n;
            },
        });
    },
    './node_modules/d3-array/src/ticks.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var o,
                s,
                r,
                d,
                a = -1;
              if (((n = +n), (e = +e) == (t = +t) && n > 0)) return [e];
              (o = t < e) && ((s = e), (e = t), (t = s));
              if (0 === (d = i(e, t, n)) || !isFinite(d)) return [];
              if (d > 0) {
                let n = Math.round(e / d),
                  o = Math.round(t / d);
                for (n * d < e && ++n, o * d > t && --o, r = new Array((s = o - n + 1)); ++a < s; ) r[a] = (n + a) * d;
              } else {
                d = -d;
                let n = Math.round(e * d),
                  o = Math.round(t * d);
                for (n / d < e && ++n, o / d > t && --o, r = new Array((s = o - n + 1)); ++a < s; ) r[a] = (n + a) / d;
              }
              o && r.reverse();
              return r;
            },
          tickIncrement: () => i,
          tickStep: () =>
            function (e, t, n) {
              var i = Math.abs(t - e) / Math.max(0, n),
                d = Math.pow(10, Math.floor(Math.log(i) / Math.LN10)),
                a = i / d;
              a >= o ? (d *= 10) : a >= s ? (d *= 5) : a >= r && (d *= 2);
              return t < e ? -d : d;
            },
        });
      var o = Math.sqrt(50),
        s = Math.sqrt(10),
        r = Math.sqrt(2);
      function i(e, t, n) {
        var i = (t - e) / Math.max(0, n),
          d = Math.floor(Math.log(i) / Math.LN10),
          a = i / Math.pow(10, d);
        return d >= 0 ? (a >= o ? 10 : a >= s ? 5 : a >= r ? 2 : 1) * Math.pow(10, d) : -Math.pow(10, -d) / (a >= o ? 10 : a >= s ? 5 : a >= r ? 2 : 1);
      }
    },
    './node_modules/d3-color/src/color.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          Color: () => s,
          Rgb: () => A,
          brighter: () => i,
          darker: () => r,
          default: () => y,
          hsl: () => P,
          hslConvert: () => z,
          rgb: () => S,
          rgbConvert: () => x,
        });
      var o = n('./node_modules/d3-color/src/define.js');
      function s() {}
      var r = 0.7,
        i = 1 / r,
        d = '\\s*([+-]?\\d+)\\s*',
        a = '\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*',
        l = '\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
        c = /^#([0-9a-f]{3,8})$/,
        u = new RegExp('^rgb\\(' + [d, d, d] + '\\)$'),
        f = new RegExp('^rgb\\(' + [l, l, l] + '\\)$'),
        h = new RegExp('^rgba\\(' + [d, d, d, a] + '\\)$'),
        m = new RegExp('^rgba\\(' + [l, l, l, a] + '\\)$'),
        p = new RegExp('^hsl\\(' + [a, l, l] + '\\)$'),
        _ = new RegExp('^hsla\\(' + [a, l, l, a] + '\\)$'),
        g = {
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
      function v() {
        return this.rgb().formatHex();
      }
      function b() {
        return this.rgb().formatRgb();
      }
      function y(e) {
        var t, n;
        return (
          (e = (e + '').trim().toLowerCase()),
          (t = c.exec(e))
            ? ((n = t[1].length),
              (t = parseInt(t[1], 16)),
              6 === n
                ? j(t)
                : 3 === n
                  ? new A(((t >> 8) & 15) | ((t >> 4) & 240), ((t >> 4) & 15) | (240 & t), ((15 & t) << 4) | (15 & t), 1)
                  : 8 === n
                    ? w((t >> 24) & 255, (t >> 16) & 255, (t >> 8) & 255, (255 & t) / 255)
                    : 4 === n
                      ? w(((t >> 12) & 15) | ((t >> 8) & 240), ((t >> 8) & 15) | ((t >> 4) & 240), ((t >> 4) & 15) | (240 & t), (((15 & t) << 4) | (15 & t)) / 255)
                      : null)
            : (t = u.exec(e))
              ? new A(t[1], t[2], t[3], 1)
              : (t = f.exec(e))
                ? new A((255 * t[1]) / 100, (255 * t[2]) / 100, (255 * t[3]) / 100, 1)
                : (t = h.exec(e))
                  ? w(t[1], t[2], t[3], t[4])
                  : (t = m.exec(e))
                    ? w((255 * t[1]) / 100, (255 * t[2]) / 100, (255 * t[3]) / 100, t[4])
                    : (t = p.exec(e))
                      ? k(t[1], t[2] / 100, t[3] / 100, 1)
                      : (t = _.exec(e))
                        ? k(t[1], t[2] / 100, t[3] / 100, t[4])
                        : g.hasOwnProperty(e)
                          ? j(g[e])
                          : 'transparent' === e
                            ? new A(NaN, NaN, NaN, 0)
                            : null
        );
      }
      function j(e) {
        return new A((e >> 16) & 255, (e >> 8) & 255, 255 & e, 1);
      }
      function w(e, t, n, o) {
        return o <= 0 && (e = t = n = NaN), new A(e, t, n, o);
      }
      function x(e) {
        return e instanceof s || (e = y(e)), e ? new A((e = e.rgb()).r, e.g, e.b, e.opacity) : new A();
      }
      function S(e, t, n, o) {
        return 1 === arguments.length ? x(e) : new A(e, t, n, null == o ? 1 : o);
      }
      function A(e, t, n, o) {
        (this.r = +e), (this.g = +t), (this.b = +n), (this.opacity = +o);
      }
      function E() {
        return '#' + N(this.r) + N(this.g) + N(this.b);
      }
      function M() {
        var e = this.opacity;
        return (
          (1 === (e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e))) ? 'rgb(' : 'rgba(') +
          Math.max(0, Math.min(255, Math.round(this.r) || 0)) +
          ', ' +
          Math.max(0, Math.min(255, Math.round(this.g) || 0)) +
          ', ' +
          Math.max(0, Math.min(255, Math.round(this.b) || 0)) +
          (1 === e ? ')' : ', ' + e + ')')
        );
      }
      function N(e) {
        return ((e = Math.max(0, Math.min(255, Math.round(e) || 0))) < 16 ? '0' : '') + e.toString(16);
      }
      function k(e, t, n, o) {
        return o <= 0 ? (e = t = n = NaN) : n <= 0 || n >= 1 ? (e = t = NaN) : t <= 0 && (e = NaN), new C(e, t, n, o);
      }
      function z(e) {
        if (e instanceof C) return new C(e.h, e.s, e.l, e.opacity);
        if ((e instanceof s || (e = y(e)), !e)) return new C();
        if (e instanceof C) return e;
        var t = (e = e.rgb()).r / 255,
          n = e.g / 255,
          o = e.b / 255,
          r = Math.min(t, n, o),
          i = Math.max(t, n, o),
          d = NaN,
          a = i - r,
          l = (i + r) / 2;
        return (
          a
            ? ((d = t === i ? (n - o) / a + 6 * (n < o) : n === i ? (o - t) / a + 2 : (t - n) / a + 4), (a /= l < 0.5 ? i + r : 2 - i - r), (d *= 60))
            : (a = l > 0 && l < 1 ? 0 : d),
          new C(d, a, l, e.opacity)
        );
      }
      function P(e, t, n, o) {
        return 1 === arguments.length ? z(e) : new C(e, t, n, null == o ? 1 : o);
      }
      function C(e, t, n, o) {
        (this.h = +e), (this.s = +t), (this.l = +n), (this.opacity = +o);
      }
      function T(e, t, n) {
        return 255 * (e < 60 ? t + ((n - t) * e) / 60 : e < 180 ? n : e < 240 ? t + ((n - t) * (240 - e)) / 60 : t);
      }
      (0, o.default)(s, y, {
        copy: function (e) {
          return Object.assign(new this.constructor(), this, e);
        },
        displayable: function () {
          return this.rgb().displayable();
        },
        hex: v,
        formatHex: v,
        formatHsl: function () {
          return z(this).formatHsl();
        },
        formatRgb: b,
        toString: b,
      }),
        (0, o.default)(
          A,
          S,
          (0, o.extend)(s, {
            brighter: function (e) {
              return (e = null == e ? i : Math.pow(i, e)), new A(this.r * e, this.g * e, this.b * e, this.opacity);
            },
            darker: function (e) {
              return (e = null == e ? r : Math.pow(r, e)), new A(this.r * e, this.g * e, this.b * e, this.opacity);
            },
            rgb: function () {
              return this;
            },
            displayable: function () {
              return (
                -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1
              );
            },
            hex: E,
            formatHex: E,
            formatRgb: M,
            toString: M,
          })
        ),
        (0, o.default)(
          C,
          P,
          (0, o.extend)(s, {
            brighter: function (e) {
              return (e = null == e ? i : Math.pow(i, e)), new C(this.h, this.s, this.l * e, this.opacity);
            },
            darker: function (e) {
              return (e = null == e ? r : Math.pow(r, e)), new C(this.h, this.s, this.l * e, this.opacity);
            },
            rgb: function () {
              var e = (this.h % 360) + 360 * (this.h < 0),
                t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
                n = this.l,
                o = n + (n < 0.5 ? n : 1 - n) * t,
                s = 2 * n - o;
              return new A(T(e >= 240 ? e - 240 : e + 120, s, o), T(e, s, o), T(e < 120 ? e + 240 : e - 120, s, o), this.opacity);
            },
            displayable: function () {
              return ((0 <= this.s && this.s <= 1) || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
            },
            formatHsl: function () {
              var e = this.opacity;
              return (
                (1 === (e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e))) ? 'hsl(' : 'hsla(') +
                (this.h || 0) +
                ', ' +
                100 * (this.s || 0) +
                '%, ' +
                100 * (this.l || 0) +
                '%' +
                (1 === e ? ')' : ', ' + e + ')')
              );
            },
          })
        );
    },
    './node_modules/d3-color/src/cubehelix.js': (e, t, n) => {
      n.r(t), n.d(t, { Cubehelix: () => p, default: () => m });
      var o = n('./node_modules/d3-color/src/define.js'),
        s = n('./node_modules/d3-color/src/color.js'),
        r = n('./node_modules/d3-color/src/math.js'),
        i = -0.14861,
        d = 1.78277,
        a = -0.29227,
        l = -0.90649,
        c = 1.97294,
        u = c * l,
        f = c * d,
        h = d * a - l * i;
      function m(e, t, n, o) {
        return 1 === arguments.length
          ? (function (e) {
              if (e instanceof p) return new p(e.h, e.s, e.l, e.opacity);
              e instanceof s.Rgb || (e = (0, s.rgbConvert)(e));
              var t = e.r / 255,
                n = e.g / 255,
                o = e.b / 255,
                i = (h * o + u * t - f * n) / (h + u - f),
                d = o - i,
                m = (c * (n - i) - a * d) / l,
                _ = Math.sqrt(m * m + d * d) / (c * i * (1 - i)),
                g = _ ? Math.atan2(m, d) * r.degrees - 120 : NaN;
              return new p(g < 0 ? g + 360 : g, _, i, e.opacity);
            })(e)
          : new p(e, t, n, null == o ? 1 : o);
      }
      function p(e, t, n, o) {
        (this.h = +e), (this.s = +t), (this.l = +n), (this.opacity = +o);
      }
      (0, o.default)(
        p,
        m,
        (0, o.extend)(s.Color, {
          brighter: function (e) {
            return (e = null == e ? s.brighter : Math.pow(s.brighter, e)), new p(this.h, this.s, this.l * e, this.opacity);
          },
          darker: function (e) {
            return (e = null == e ? s.darker : Math.pow(s.darker, e)), new p(this.h, this.s, this.l * e, this.opacity);
          },
          rgb: function () {
            var e = isNaN(this.h) ? 0 : (this.h + 120) * r.radians,
              t = +this.l,
              n = isNaN(this.s) ? 0 : this.s * t * (1 - t),
              o = Math.cos(e),
              u = Math.sin(e);
            return new s.Rgb(255 * (t + n * (i * o + d * u)), 255 * (t + n * (a * o + l * u)), 255 * (t + n * (c * o)), this.opacity);
          },
        })
      );
    },
    './node_modules/d3-color/src/define.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              (e.prototype = t.prototype = n), (n.constructor = e);
            },
          extend: () =>
            function (e, t) {
              var n = Object.create(e.prototype);
              for (var o in t) n[o] = t[o];
              return n;
            },
        });
    },
    './node_modules/d3-color/src/math.js': (e, t, n) => {
      n.r(t), n.d(t, { degrees: () => s, radians: () => o });
      const o = Math.PI / 180,
        s = 180 / Math.PI;
    },
    './node_modules/d3-dispatch/src/dispatch.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => a });
      var o = { value: function () {} };
      function s() {
        for (var e, t = 0, n = arguments.length, o = {}; t < n; ++t) {
          if (!(e = arguments[t] + '') || e in o) throw new Error('illegal type: ' + e);
          o[e] = [];
        }
        return new r(o);
      }
      function r(e) {
        this._ = e;
      }
      function i(e, t) {
        for (var n, o = 0, s = e.length; o < s; ++o) if ((n = e[o]).name === t) return n.value;
      }
      function d(e, t, n) {
        for (var s = 0, r = e.length; s < r; ++s)
          if (e[s].name === t) {
            (e[s] = o), (e = e.slice(0, s).concat(e.slice(s + 1)));
            break;
          }
        return null != n && e.push({ name: t, value: n }), e;
      }
      r.prototype = s.prototype = {
        constructor: r,
        on: function (e, t) {
          var n,
            o,
            s = this._,
            r =
              ((o = s),
              (e + '')
                .trim()
                .split(/^|\s+/)
                .map(function (e) {
                  var t = '',
                    n = e.indexOf('.');
                  if ((n >= 0 && ((t = e.slice(n + 1)), (e = e.slice(0, n))), e && !o.hasOwnProperty(e))) throw new Error('unknown type: ' + e);
                  return { type: e, name: t };
                })),
            a = -1,
            l = r.length;
          if (!(arguments.length < 2)) {
            if (null != t && 'function' != typeof t) throw new Error('invalid callback: ' + t);
            for (; ++a < l; )
              if ((n = (e = r[a]).type)) s[n] = d(s[n], e.name, t);
              else if (null == t) for (n in s) s[n] = d(s[n], e.name, null);
            return this;
          }
          for (; ++a < l; ) if ((n = (e = r[a]).type) && (n = i(s[n], e.name))) return n;
        },
        copy: function () {
          var e = {},
            t = this._;
          for (var n in t) e[n] = t[n].slice();
          return new r(e);
        },
        call: function (e, t) {
          if ((n = arguments.length - 2) > 0) for (var n, o, s = new Array(n), r = 0; r < n; ++r) s[r] = arguments[r + 2];
          if (!this._.hasOwnProperty(e)) throw new Error('unknown type: ' + e);
          for (r = 0, n = (o = this._[e]).length; r < n; ++r) o[r].value.apply(t, s);
        },
        apply: function (e, t, n) {
          if (!this._.hasOwnProperty(e)) throw new Error('unknown type: ' + e);
          for (var o = this._[e], s = 0, r = o.length; s < r; ++s) o[s].value.apply(t, n);
        },
      };
      const a = s;
    },
    './node_modules/d3-dispatch/src/index.js': (e, t, n) => {
      n.r(t), n.d(t, { dispatch: () => o.default });
      var o = n('./node_modules/d3-dispatch/src/dispatch.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/array.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return 'object' == typeof e && 'length' in e ? e : Array.from(e);
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/constant.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return function () {
                return e;
              };
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/creator.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = (0, o.default)(e);
              return (
                t.local
                  ? function (e) {
                      return function () {
                        return this.ownerDocument.createElementNS(e.space, e.local);
                      };
                    }
                  : function (e) {
                      return function () {
                        var t = this.ownerDocument,
                          n = this.namespaceURI;
                        return n === s.xhtml && t.documentElement.namespaceURI === s.xhtml ? t.createElement(e) : t.createElementNS(n, e);
                      };
                    }
              )(t);
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/namespace.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/namespaces.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/matcher.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          childMatcher: () =>
            function (e) {
              return function (t) {
                return t.matches(e);
              };
            },
          default: () =>
            function (e) {
              return function () {
                return this.matches(e);
              };
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/namespace.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = (e += ''),
                n = t.indexOf(':');
              n >= 0 && 'xmlns' !== (t = e.slice(0, n)) && (e = e.slice(n + 1));
              return o.default.hasOwnProperty(t) ? { space: o.default[t], local: e } : e;
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/namespaces.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/namespaces.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => s, xhtml: () => o });
      var o = 'http://www.w3.org/1999/xhtml';
      const s = {
        svg: 'http://www.w3.org/2000/svg',
        xhtml: o,
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/',
      };
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/pointer.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              (e = (0, o.default)(e)), void 0 === t && (t = e.currentTarget);
              if (t) {
                var n = t.ownerSVGElement || t;
                if (n.createSVGPoint) {
                  var s = n.createSVGPoint();
                  return (s.x = e.clientX), (s.y = e.clientY), [(s = s.matrixTransform(t.getScreenCTM().inverse())).x, s.y];
                }
                if (t.getBoundingClientRect) {
                  var r = t.getBoundingClientRect();
                  return [e.clientX - r.left - t.clientLeft, e.clientY - r.top - t.clientTop];
                }
              }
              return [e.pageX, e.pageY];
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/sourceEvent.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/select.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return 'string' == typeof e ? new o.Selection([[document.querySelector(e)]], [document.documentElement]) : new o.Selection([[e]], o.root);
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/append.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = 'function' == typeof e ? e : (0, o.default)(e);
              return this.select(function () {
                return this.appendChild(t.apply(this, arguments));
              });
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/creator.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/attr.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = (0, o.default)(e);
              if (arguments.length < 2) {
                var s = this.node();
                return n.local ? s.getAttributeNS(n.space, n.local) : s.getAttribute(n);
              }
              return this.each(
                (null == t
                  ? n.local
                    ? function (e) {
                        return function () {
                          this.removeAttributeNS(e.space, e.local);
                        };
                      }
                    : function (e) {
                        return function () {
                          this.removeAttribute(e);
                        };
                      }
                  : 'function' == typeof t
                    ? n.local
                      ? function (e, t) {
                          return function () {
                            var n = t.apply(this, arguments);
                            null == n ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
                          };
                        }
                      : function (e, t) {
                          return function () {
                            var n = t.apply(this, arguments);
                            null == n ? this.removeAttribute(e) : this.setAttribute(e, n);
                          };
                        }
                    : n.local
                      ? function (e, t) {
                          return function () {
                            this.setAttributeNS(e.space, e.local, t);
                          };
                        }
                      : function (e, t) {
                          return function () {
                            this.setAttribute(e, t);
                          };
                        })(n, t)
              );
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/namespace.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/call.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e = arguments[0];
              return (arguments[0] = this), e.apply(null, arguments), this;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/classed.js': (e, t, n) => {
      function o(e) {
        return e.trim().split(/^|\s+/);
      }
      function s(e) {
        return e.classList || new r(e);
      }
      function r(e) {
        (this._node = e), (this._names = o(e.getAttribute('class') || ''));
      }
      function i(e, t) {
        for (var n = s(e), o = -1, r = t.length; ++o < r; ) n.add(t[o]);
      }
      function d(e, t) {
        for (var n = s(e), o = -1, r = t.length; ++o < r; ) n.remove(t[o]);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = o(e + '');
              if (arguments.length < 2) {
                for (var r = s(this.node()), a = -1, l = n.length; ++a < l; ) if (!r.contains(n[a])) return !1;
                return !0;
              }
              return this.each(
                ('function' == typeof t
                  ? function (e, t) {
                      return function () {
                        (t.apply(this, arguments) ? i : d)(this, e);
                      };
                    }
                  : t
                    ? function (e) {
                        return function () {
                          i(this, e);
                        };
                      }
                    : function (e) {
                        return function () {
                          d(this, e);
                        };
                      })(n, t)
              );
            },
        }),
        (r.prototype = {
          add: function (e) {
            this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute('class', this._names.join(' ')));
          },
          remove: function (e) {
            var t = this._names.indexOf(e);
            t >= 0 && (this._names.splice(t, 1), this._node.setAttribute('class', this._names.join(' ')));
          },
          contains: function (e) {
            return this._names.indexOf(e) >= 0;
          },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/clone.js': (e, t, n) => {
      function o() {
        var e = this.cloneNode(!1),
          t = this.parentNode;
        return t ? t.insertBefore(e, this.nextSibling) : e;
      }
      function s() {
        var e = this.cloneNode(!0),
          t = this.parentNode;
        return t ? t.insertBefore(e, this.nextSibling) : e;
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.select(e ? s : o);
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/data.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              if (!arguments.length) return Array.from(this, l);
              var n = t ? a : d,
                s = this._parents,
                c = this._groups;
              'function' != typeof e && (e = (0, i.default)(e));
              for (var u = c.length, f = new Array(u), h = new Array(u), m = new Array(u), p = 0; p < u; ++p) {
                var _ = s[p],
                  g = c[p],
                  v = g.length,
                  b = (0, r.default)(e.call(_, _ && _.__data__, p, s)),
                  y = b.length,
                  j = (h[p] = new Array(y)),
                  w = (f[p] = new Array(y)),
                  x = (m[p] = new Array(v));
                n(_, g, j, w, x, b, t);
                for (var S, A, E = 0, M = 0; E < y; ++E)
                  if ((S = j[E])) {
                    for (E >= M && (M = E + 1); !(A = w[M]) && ++M < y; );
                    S._next = A || null;
                  }
              }
              return ((f = new o.Selection(f, s))._enter = h), (f._exit = m), f;
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/enter.js'),
        r = n('./node_modules/d3-drag/node_modules/d3-selection/src/array.js'),
        i = n('./node_modules/d3-drag/node_modules/d3-selection/src/constant.js');
      function d(e, t, n, o, r, i) {
        for (var d, a = 0, l = t.length, c = i.length; a < c; ++a) (d = t[a]) ? ((d.__data__ = i[a]), (o[a] = d)) : (n[a] = new s.EnterNode(e, i[a]));
        for (; a < l; ++a) (d = t[a]) && (r[a] = d);
      }
      function a(e, t, n, o, r, i, d) {
        var a,
          l,
          c,
          u = new Map(),
          f = t.length,
          h = i.length,
          m = new Array(f);
        for (a = 0; a < f; ++a) (l = t[a]) && ((m[a] = c = d.call(l, l.__data__, a, t) + ''), u.has(c) ? (r[a] = l) : u.set(c, l));
        for (a = 0; a < h; ++a) (c = d.call(e, i[a], a, i) + ''), (l = u.get(c)) ? ((o[a] = l), (l.__data__ = i[a]), u.delete(c)) : (n[a] = new s.EnterNode(e, i[a]));
        for (a = 0; a < f; ++a) (l = t[a]) && u.get(m[a]) === l && (r[a] = l);
      }
      function l(e) {
        return e.__data__;
      }
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/datum.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length ? this.property('__data__', e) : this.node().__data__;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/dispatch.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return this.each(
                ('function' == typeof t
                  ? function (e, t) {
                      return function () {
                        return s(this, e, t.apply(this, arguments));
                      };
                    }
                  : function (e, t) {
                      return function () {
                        return s(this, e, t);
                      };
                    })(e, t)
              );
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/window.js');
      function s(e, t, n) {
        var s = (0, o.default)(e),
          r = s.CustomEvent;
        'function' == typeof r
          ? (r = new r(t, n))
          : ((r = s.document.createEvent('Event')), n ? (r.initEvent(t, n.bubbles, n.cancelable), (r.detail = n.detail)) : r.initEvent(t, !1, !1)),
          e.dispatchEvent(r);
      }
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/each.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
                for (var s, r = t[n], i = 0, d = r.length; i < d; ++i) (s = r[i]) && e.call(s, s.__data__, i, r);
              return this;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/empty.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return !this.node();
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/enter.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          EnterNode: () => r,
          default: () =>
            function () {
              return new s.Selection(this._enter || this._groups.map(o.default), this._parents);
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/sparse.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js');
      function r(e, t) {
        (this.ownerDocument = e.ownerDocument), (this.namespaceURI = e.namespaceURI), (this._next = null), (this._parent = e), (this.__data__ = t);
      }
      r.prototype = {
        constructor: r,
        appendChild: function (e) {
          return this._parent.insertBefore(e, this._next);
        },
        insertBefore: function (e, t) {
          return this._parent.insertBefore(e, t);
        },
        querySelector: function (e) {
          return this._parent.querySelector(e);
        },
        querySelectorAll: function (e) {
          return this._parent.querySelectorAll(e);
        },
      };
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/exit.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return new s.Selection(this._exit || this._groups.map(o.default), this._parents);
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/sparse.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/filter.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              'function' != typeof e && (e = (0, s.default)(e));
              for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
                for (var d, a = t[i], l = a.length, c = (r[i] = []), u = 0; u < l; ++u) (d = a[u]) && e.call(d, d.__data__, u, a) && c.push(d);
              return new o.Selection(r, this._parents);
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/matcher.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/html.js': (e, t, n) => {
      function o() {
        this.innerHTML = '';
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length
                ? this.each(
                    null == e
                      ? o
                      : ('function' == typeof e
                          ? function (e) {
                              return function () {
                                var t = e.apply(this, arguments);
                                this.innerHTML = null == t ? '' : t;
                              };
                            }
                          : function (e) {
                              return function () {
                                this.innerHTML = e;
                              };
                            })(e)
                  )
                : this.node().innerHTML;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js': (e, t, n) => {
      n.r(t), n.d(t, { Selection: () => B, default: () => D, root: () => q });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/select.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/selectAll.js'),
        r = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/selectChild.js'),
        i = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/selectChildren.js'),
        d = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/filter.js'),
        a = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/data.js'),
        l = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/enter.js'),
        c = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/exit.js'),
        u = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/join.js'),
        f = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/merge.js'),
        h = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/order.js'),
        m = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/sort.js'),
        p = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/call.js'),
        _ = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/nodes.js'),
        g = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/node.js'),
        v = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/size.js'),
        b = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/empty.js'),
        y = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/each.js'),
        j = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/attr.js'),
        w = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/style.js'),
        x = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/property.js'),
        S = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/classed.js'),
        A = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/text.js'),
        E = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/html.js'),
        M = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/raise.js'),
        N = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/lower.js'),
        k = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/append.js'),
        z = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/insert.js'),
        P = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/remove.js'),
        C = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/clone.js'),
        T = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/datum.js'),
        I = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/on.js'),
        L = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/dispatch.js'),
        R = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/iterator.js'),
        q = [null];
      function B(e, t) {
        (this._groups = e), (this._parents = t);
      }
      function O() {
        return new B([[document.documentElement]], q);
      }
      B.prototype = O.prototype = {
        constructor: B,
        select: o.default,
        selectAll: s.default,
        selectChild: r.default,
        selectChildren: i.default,
        filter: d.default,
        data: a.default,
        enter: l.default,
        exit: c.default,
        join: u.default,
        merge: f.default,
        selection: function () {
          return this;
        },
        order: h.default,
        sort: m.default,
        call: p.default,
        nodes: _.default,
        node: g.default,
        size: v.default,
        empty: b.default,
        each: y.default,
        attr: j.default,
        style: w.default,
        property: x.default,
        classed: S.default,
        text: A.default,
        html: E.default,
        raise: M.default,
        lower: N.default,
        append: k.default,
        insert: z.default,
        remove: P.default,
        clone: C.default,
        datum: T.default,
        on: I.default,
        dispatch: L.default,
        [Symbol.iterator]: R.default,
      };
      const D = O;
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/insert.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = 'function' == typeof e ? e : (0, o.default)(e),
                i = null == t ? r : 'function' == typeof t ? t : (0, s.default)(t);
              return this.select(function () {
                return this.insertBefore(n.apply(this, arguments), i.apply(this, arguments) || null);
              });
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/creator.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/selector.js');
      function r() {
        return null;
      }
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/iterator.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function* () {
              for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var o, s = e[t], r = 0, i = s.length; r < i; ++r) (o = s[r]) && (yield o);
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/join.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var o = this.enter(),
                s = this,
                r = this.exit();
              (o = 'function' == typeof e ? e(o) : o.append(e + '')), null != t && (s = t(s));
              null == n ? r.remove() : n(r);
              return o && s ? o.merge(s).order() : s;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/lower.js': (e, t, n) => {
      function o() {
        this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.each(o);
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/merge.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              if (!(e instanceof o.Selection)) throw new Error('invalid merge');
              for (var t = this._groups, n = e._groups, s = t.length, r = n.length, i = Math.min(s, r), d = new Array(s), a = 0; a < i; ++a)
                for (var l, c = t[a], u = n[a], f = c.length, h = (d[a] = new Array(f)), m = 0; m < f; ++m) (l = c[m] || u[m]) && (h[m] = l);
              for (; a < s; ++a) d[a] = t[a];
              return new o.Selection(d, this._parents);
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/node.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
                for (var o = e[t], s = 0, r = o.length; s < r; ++s) {
                  var i = o[s];
                  if (i) return i;
                }
              return null;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/nodes.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return Array.from(this);
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/on.js': (e, t, n) => {
      function o(e) {
        return function () {
          var t = this.__on;
          if (t) {
            for (var n, o = 0, s = -1, r = t.length; o < r; ++o)
              (n = t[o]), (e.type && n.type !== e.type) || n.name !== e.name ? (t[++s] = n) : this.removeEventListener(n.type, n.listener, n.options);
            ++s ? (t.length = s) : delete this.__on;
          }
        };
      }
      function s(e, t, n) {
        return function () {
          var o,
            s = this.__on,
            r = (function (e) {
              return function (t) {
                e.call(this, t, this.__data__);
              };
            })(t);
          if (s)
            for (var i = 0, d = s.length; i < d; ++i)
              if ((o = s[i]).type === e.type && o.name === e.name)
                return this.removeEventListener(o.type, o.listener, o.options), this.addEventListener(o.type, (o.listener = r), (o.options = n)), void (o.value = t);
          this.addEventListener(e.type, r, n), (o = { type: e.type, name: e.name, value: t, listener: r, options: n }), s ? s.push(o) : (this.__on = [o]);
        };
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var r,
                i,
                d = (function (e) {
                  return e
                    .trim()
                    .split(/^|\s+/)
                    .map(function (e) {
                      var t = '',
                        n = e.indexOf('.');
                      return n >= 0 && ((t = e.slice(n + 1)), (e = e.slice(0, n))), { type: e, name: t };
                    });
                })(e + ''),
                a = d.length;
              if (arguments.length < 2) {
                var l = this.node().__on;
                if (l)
                  for (var c, u = 0, f = l.length; u < f; ++u) for (r = 0, c = l[u]; r < a; ++r) if ((i = d[r]).type === c.type && i.name === c.name) return c.value;
                return;
              }
              for (l = t ? s : o, r = 0; r < a; ++r) this.each(l(d[r], t, n));
              return this;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/order.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              for (var e = this._groups, t = -1, n = e.length; ++t < n; )
                for (var o, s = e[t], r = s.length - 1, i = s[r]; --r >= 0; )
                  (o = s[r]) && (i && 4 ^ o.compareDocumentPosition(i) && i.parentNode.insertBefore(o, i), (i = o));
              return this;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/property.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return arguments.length > 1
                ? this.each(
                    (null == t
                      ? function (e) {
                          return function () {
                            delete this[e];
                          };
                        }
                      : 'function' == typeof t
                        ? function (e, t) {
                            return function () {
                              var n = t.apply(this, arguments);
                              null == n ? delete this[e] : (this[e] = n);
                            };
                          }
                        : function (e, t) {
                            return function () {
                              this[e] = t;
                            };
                          })(e, t)
                  )
                : this.node()[e];
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/raise.js': (e, t, n) => {
      function o() {
        this.nextSibling && this.parentNode.appendChild(this);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.each(o);
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/remove.js': (e, t, n) => {
      function o() {
        var e = this.parentNode;
        e && e.removeChild(this);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.each(o);
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/select.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              'function' != typeof e && (e = (0, s.default)(e));
              for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
                for (var d, a, l = t[i], c = l.length, u = (r[i] = new Array(c)), f = 0; f < c; ++f)
                  (d = l[f]) && (a = e.call(d, d.__data__, f, l)) && ('__data__' in d && (a.__data__ = d.__data__), (u[f] = a));
              return new o.Selection(r, this._parents);
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/selector.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/selectAll.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              e =
                'function' == typeof e
                  ? (function (e) {
                      return function () {
                        var t = e.apply(this, arguments);
                        return null == t ? [] : (0, s.default)(t);
                      };
                    })(e)
                  : (0, r.default)(e);
              for (var t = this._groups, n = t.length, i = [], d = [], a = 0; a < n; ++a)
                for (var l, c = t[a], u = c.length, f = 0; f < u; ++f) (l = c[f]) && (i.push(e.call(l, l.__data__, f, c)), d.push(l));
              return new o.Selection(i, d);
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/array.js'),
        r = n('./node_modules/d3-drag/node_modules/d3-selection/src/selectorAll.js');
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/selectChild.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.select(
                null == e
                  ? r
                  : (function (e) {
                      return function () {
                        return s.call(this.children, e);
                      };
                    })('function' == typeof e ? e : (0, o.childMatcher)(e))
              );
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/matcher.js'),
        s = Array.prototype.find;
      function r() {
        return this.firstElementChild;
      }
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/selectChildren.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.selectAll(
                null == e
                  ? r
                  : (function (e) {
                      return function () {
                        return s.call(this.children, e);
                      };
                    })('function' == typeof e ? e : (0, o.childMatcher)(e))
              );
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/matcher.js'),
        s = Array.prototype.filter;
      function r() {
        return this.children;
      }
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/size.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              let e = 0;
              for (const t of this) ++e;
              return e;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/sort.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              e || (e = s);
              function t(t, n) {
                return t && n ? e(t.__data__, n.__data__) : !t - !n;
              }
              for (var n = this._groups, r = n.length, i = new Array(r), d = 0; d < r; ++d) {
                for (var a, l = n[d], c = l.length, u = (i[d] = new Array(c)), f = 0; f < c; ++f) (a = l[f]) && (u[f] = a);
                u.sort(t);
              }
              return new o.Selection(i, this._parents).order();
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/selection/index.js');
      function s(e, t) {
        return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
      }
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/sparse.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return new Array(e.length);
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/style.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              return arguments.length > 1
                ? this.each(
                    (null == t
                      ? function (e) {
                          return function () {
                            this.style.removeProperty(e);
                          };
                        }
                      : 'function' == typeof t
                        ? function (e, t, n) {
                            return function () {
                              var o = t.apply(this, arguments);
                              null == o ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
                            };
                          }
                        : function (e, t, n) {
                            return function () {
                              this.style.setProperty(e, t, n);
                            };
                          })(e, t, null == n ? '' : n)
                  )
                : s(this.node(), e);
            },
          styleValue: () => s,
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/window.js');
      function s(e, t) {
        return e.style.getPropertyValue(t) || (0, o.default)(e).getComputedStyle(e, null).getPropertyValue(t);
      }
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selection/text.js': (e, t, n) => {
      function o() {
        this.textContent = '';
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length
                ? this.each(
                    null == e
                      ? o
                      : ('function' == typeof e
                          ? function (e) {
                              return function () {
                                var t = e.apply(this, arguments);
                                this.textContent = null == t ? '' : t;
                              };
                            }
                          : function (e) {
                              return function () {
                                this.textContent = e;
                              };
                            })(e)
                  )
                : this.node().textContent;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selector.js': (e, t, n) => {
      function o() {}
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return null == e
                ? o
                : function () {
                    return this.querySelector(e);
                  };
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/selectorAll.js': (e, t, n) => {
      function o() {
        return [];
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return null == e
                ? o
                : function () {
                    return this.querySelectorAll(e);
                  };
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/sourceEvent.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              let t;
              for (; (t = e.sourceEvent); ) e = t;
              return e;
            },
        });
    },
    './node_modules/d3-drag/node_modules/d3-selection/src/window.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return (e.ownerDocument && e.ownerDocument.defaultView) || (e.document && e) || e.defaultView;
            },
        });
    },
    './node_modules/d3-drag/src/constant.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (e) => () => e;
    },
    './node_modules/d3-drag/src/drag.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e,
                t,
                n,
                m,
                p = c,
                _ = u,
                g = f,
                v = h,
                b = {},
                y = (0, o.dispatch)('start', 'drag', 'end'),
                j = 0,
                w = 0;
              function x(e) {
                e.on('mousedown.drag', S)
                  .filter(v)
                  .on('touchstart.drag', M)
                  .on('touchmove.drag', N)
                  .on('touchend.drag touchcancel.drag', k)
                  .style('touch-action', 'none')
                  .style('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
              }
              function S(o, r) {
                if (!m && p.call(this, o, r)) {
                  var a = z(this, _.call(this, o, r), o, r, 'mouse');
                  a &&
                    ((0, s.default)(o.view).on('mousemove.drag', A, !0).on('mouseup.drag', E, !0),
                    (0, i.default)(o.view),
                    (0, d.nopropagation)(o),
                    (n = !1),
                    (e = o.clientX),
                    (t = o.clientY),
                    a('start', o));
                }
              }
              function A(o) {
                if (((0, d.default)(o), !n)) {
                  var s = o.clientX - e,
                    r = o.clientY - t;
                  n = s * s + r * r > w;
                }
                b.mouse('drag', o);
              }
              function E(e) {
                (0, s.default)(e.view).on('mousemove.drag mouseup.drag', null), (0, i.yesdrag)(e.view, n), (0, d.default)(e), b.mouse('end', e);
              }
              function M(e, t) {
                if (p.call(this, e, t)) {
                  var n,
                    o,
                    s = e.changedTouches,
                    r = _.call(this, e, t),
                    i = s.length;
                  for (n = 0; n < i; ++n) (o = z(this, r, e, t, s[n].identifier, s[n])) && ((0, d.nopropagation)(e), o('start', e, s[n]));
                }
              }
              function N(e) {
                var t,
                  n,
                  o = e.changedTouches,
                  s = o.length;
                for (t = 0; t < s; ++t) (n = b[o[t].identifier]) && ((0, d.default)(e), n('drag', e, o[t]));
              }
              function k(e) {
                var t,
                  n,
                  o = e.changedTouches,
                  s = o.length;
                for (
                  m && clearTimeout(m),
                    m = setTimeout(function () {
                      m = null;
                    }, 500),
                    t = 0;
                  t < s;
                  ++t
                )
                  (n = b[o[t].identifier]) && ((0, d.nopropagation)(e), n('end', e, o[t]));
              }
              function z(e, t, n, o, s, i) {
                var d,
                  a,
                  c,
                  u = y.copy(),
                  f = (0, r.default)(i || n, t);
                if (
                  null !=
                  (c = g.call(
                    e,
                    new l.default('beforestart', { sourceEvent: n, target: x, identifier: s, active: j, x: f[0], y: f[1], dx: 0, dy: 0, dispatch: u }),
                    o
                  ))
                )
                  return (
                    (d = c.x - f[0] || 0),
                    (a = c.y - f[1] || 0),
                    function n(i, h, m) {
                      var p,
                        _ = f;
                      switch (i) {
                        case 'start':
                          (b[s] = n), (p = j++);
                          break;
                        case 'end':
                          delete b[s], --j;
                        case 'drag':
                          (f = (0, r.default)(m || h, t)), (p = j);
                      }
                      u.call(
                        i,
                        e,
                        new l.default(i, {
                          sourceEvent: h,
                          subject: c,
                          target: x,
                          identifier: s,
                          active: p,
                          x: f[0] + d,
                          y: f[1] + a,
                          dx: f[0] - _[0],
                          dy: f[1] - _[1],
                          dispatch: u,
                        }),
                        o
                      );
                    }
                  );
              }
              return (
                (x.filter = function (e) {
                  return arguments.length ? ((p = 'function' == typeof e ? e : (0, a.default)(!!e)), x) : p;
                }),
                (x.container = function (e) {
                  return arguments.length ? ((_ = 'function' == typeof e ? e : (0, a.default)(e)), x) : _;
                }),
                (x.subject = function (e) {
                  return arguments.length ? ((g = 'function' == typeof e ? e : (0, a.default)(e)), x) : g;
                }),
                (x.touchable = function (e) {
                  return arguments.length ? ((v = 'function' == typeof e ? e : (0, a.default)(!!e)), x) : v;
                }),
                (x.on = function () {
                  var e = y.on.apply(y, arguments);
                  return e === y ? x : e;
                }),
                (x.clickDistance = function (e) {
                  return arguments.length ? ((w = (e = +e) * e), x) : Math.sqrt(w);
                }),
                x
              );
            },
        });
      var o = n('./node_modules/d3-dispatch/src/index.js'),
        s = n('./node_modules/d3-drag/node_modules/d3-selection/src/select.js'),
        r = n('./node_modules/d3-drag/node_modules/d3-selection/src/pointer.js'),
        i = n('./node_modules/d3-drag/src/nodrag.js'),
        d = n('./node_modules/d3-drag/src/noevent.js'),
        a = n('./node_modules/d3-drag/src/constant.js'),
        l = n('./node_modules/d3-drag/src/event.js');
      function c(e) {
        return !e.ctrlKey && !e.button;
      }
      function u() {
        return this.parentNode;
      }
      function f(e, t) {
        return null == t ? { x: e.x, y: e.y } : t;
      }
      function h() {
        return navigator.maxTouchPoints || 'ontouchstart' in this;
      }
    },
    './node_modules/d3-drag/src/event.js': (e, t, n) => {
      function o(e, { sourceEvent: t, subject: n, target: o, identifier: s, active: r, x: i, y: d, dx: a, dy: l, dispatch: c }) {
        Object.defineProperties(this, {
          type: { value: e, enumerable: !0, configurable: !0 },
          sourceEvent: { value: t, enumerable: !0, configurable: !0 },
          subject: { value: n, enumerable: !0, configurable: !0 },
          target: { value: o, enumerable: !0, configurable: !0 },
          identifier: { value: s, enumerable: !0, configurable: !0 },
          active: { value: r, enumerable: !0, configurable: !0 },
          x: { value: i, enumerable: !0, configurable: !0 },
          y: { value: d, enumerable: !0, configurable: !0 },
          dx: { value: a, enumerable: !0, configurable: !0 },
          dy: { value: l, enumerable: !0, configurable: !0 },
          _: { value: c },
        });
      }
      n.r(t),
        n.d(t, { default: () => o }),
        (o.prototype.on = function () {
          var e = this._.on.apply(this._, arguments);
          return e === this._ ? this : e;
        });
    },
    './node_modules/d3-drag/src/nodrag.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = e.document.documentElement,
                n = (0, o.default)(e).on('dragstart.drag', s.default, !0);
              'onselectstart' in t ? n.on('selectstart.drag', s.default, !0) : ((t.__noselect = t.style.MozUserSelect), (t.style.MozUserSelect = 'none'));
            },
          yesdrag: () =>
            function (e, t) {
              var n = e.document.documentElement,
                r = (0, o.default)(e).on('dragstart.drag', null);
              t &&
                (r.on('click.drag', s.default, !0),
                setTimeout(function () {
                  r.on('click.drag', null);
                }, 0));
              'onselectstart' in n ? r.on('selectstart.drag', null) : ((n.style.MozUserSelect = n.__noselect), delete n.__noselect);
            },
        });
      var o = n('./node_modules/d3-drag/node_modules/d3-selection/src/select.js'),
        s = n('./node_modules/d3-drag/src/noevent.js');
    },
    './node_modules/d3-drag/src/noevent.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              e.preventDefault(), e.stopImmediatePropagation();
            },
          nopropagation: () =>
            function (e) {
              e.stopImmediatePropagation();
            },
        });
    },
    './node_modules/d3-ease/src/cubic.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          cubicIn: () =>
            function (e) {
              return e * e * e;
            },
          cubicInOut: () =>
            function (e) {
              return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
            },
          cubicOut: () =>
            function (e) {
              return --e * e * e + 1;
            },
        });
    },
    './node_modules/d3-fetch/src/json.js': (e, t, n) => {
      function o(e) {
        if (!e.ok) throw new Error(e.status + ' ' + e.statusText);
        if (204 !== e.status && 205 !== e.status) return e.json();
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return fetch(e, t).then(o);
            },
        });
    },
    './node_modules/d3-fetch/src/text.js': (e, t, n) => {
      function o(e) {
        if (!e.ok) throw new Error(e.status + ' ' + e.statusText);
        return e.text();
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return fetch(e, t).then(o);
            },
        });
    },
    './node_modules/d3-fetch/src/xml.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => r, html: () => i, svg: () => d });
      var o = n('./node_modules/d3-fetch/src/text.js');
      function s(e) {
        return (t, n) => (0, o.default)(t, n).then((t) => new DOMParser().parseFromString(t, e));
      }
      const r = s('application/xml');
      var i = s('text/html'),
        d = s('image/svg+xml');
    },
    './node_modules/d3-force/src/center.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n,
                o = 1;
              null == e && (e = 0);
              null == t && (t = 0);
              function s() {
                var s,
                  r,
                  i = n.length,
                  d = 0,
                  a = 0;
                for (s = 0; s < i; ++s) (r = n[s]), (d += r.x), (a += r.y);
                for (d = (d / i - e) * o, a = (a / i - t) * o, s = 0; s < i; ++s) ((r = n[s]).x -= d), (r.y -= a);
              }
              return (
                (s.initialize = function (e) {
                  n = e;
                }),
                (s.x = function (t) {
                  return arguments.length ? ((e = +t), s) : e;
                }),
                (s.y = function (e) {
                  return arguments.length ? ((t = +e), s) : t;
                }),
                (s.strength = function (e) {
                  return arguments.length ? ((o = +e), s) : o;
                }),
                s
              );
            },
        });
    },
    './node_modules/d3-force/src/collide.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t,
                n,
                a,
                l = 1,
                c = 1;
              'function' != typeof e && (e = (0, s.default)(null == e ? 1 : +e));
              function u() {
                for (var e, s, u, h, m, p, _, g = t.length, v = 0; v < c; ++v)
                  for (s = (0, o.default)(t, i, d).visitAfter(f), e = 0; e < g; ++e)
                    (u = t[e]), (p = n[u.index]), (_ = p * p), (h = u.x + u.vx), (m = u.y + u.vy), s.visit(b);
                function b(e, t, n, o, s) {
                  var i = e.data,
                    d = e.r,
                    c = p + d;
                  if (!i) return t > h + c || o < h - c || n > m + c || s < m - c;
                  if (i.index > u.index) {
                    var f = h - i.x - i.vx,
                      g = m - i.y - i.vy,
                      v = f * f + g * g;
                    v < c * c &&
                      (0 === f && ((f = (0, r.default)(a)), (v += f * f)),
                      0 === g && ((g = (0, r.default)(a)), (v += g * g)),
                      (v = ((c - (v = Math.sqrt(v))) / v) * l),
                      (u.vx += (f *= v) * (c = (d *= d) / (_ + d))),
                      (u.vy += (g *= v) * c),
                      (i.vx -= f * (c = 1 - c)),
                      (i.vy -= g * c));
                  }
                }
              }
              function f(e) {
                if (e.data) return (e.r = n[e.data.index]);
                for (var t = (e.r = 0); t < 4; ++t) e[t] && e[t].r > e.r && (e.r = e[t].r);
              }
              function h() {
                if (t) {
                  var o,
                    s,
                    r = t.length;
                  for (n = new Array(r), o = 0; o < r; ++o) (s = t[o]), (n[s.index] = +e(s, o, t));
                }
              }
              return (
                (u.initialize = function (e, n) {
                  (t = e), (a = n), h();
                }),
                (u.iterations = function (e) {
                  return arguments.length ? ((c = +e), u) : c;
                }),
                (u.strength = function (e) {
                  return arguments.length ? ((l = +e), u) : l;
                }),
                (u.radius = function (t) {
                  return arguments.length ? ((e = 'function' == typeof t ? t : (0, s.default)(+t)), h(), u) : e;
                }),
                u
              );
            },
        });
      var o = n('./node_modules/d3-quadtree/src/quadtree.js'),
        s = n('./node_modules/d3-force/src/constant.js'),
        r = n('./node_modules/d3-force/src/jiggle.js');
      function i(e) {
        return e.x + e.vx;
      }
      function d(e) {
        return e.y + e.vy;
      }
    },
    './node_modules/d3-force/src/constant.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return function () {
                return e;
              };
            },
        });
    },
    './node_modules/d3-force/src/jiggle.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return 1e-6 * (e() - 0.5);
            },
        });
    },
    './node_modules/d3-force/src/lcg.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              let e = 1;
              return () => (e = (o * e + s) % r) / r;
            },
        });
      const o = 1664525,
        s = 1013904223,
        r = 4294967296;
    },
    './node_modules/d3-force/src/link.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t,
                n,
                d,
                a,
                l,
                c,
                u = r,
                f = function (e) {
                  return 1 / Math.min(a[e.source.index], a[e.target.index]);
                },
                h = (0, o.default)(30),
                m = 1;
              null == e && (e = []);
              function p(o) {
                for (var r = 0, i = e.length; r < m; ++r)
                  for (var d, a, u, f, h, p, _, g = 0; g < i; ++g)
                    (d = e[g]),
                      (a = d.source),
                      (u = d.target),
                      (f = u.x + u.vx - a.x - a.vx || (0, s.default)(c)),
                      (h = u.y + u.vy - a.y - a.vy || (0, s.default)(c)),
                      (p = (((p = Math.sqrt(f * f + h * h)) - n[g]) / p) * o * t[g]),
                      (f *= p),
                      (h *= p),
                      (u.vx -= f * (_ = l[g])),
                      (u.vy -= h * _),
                      (a.vx += f * (_ = 1 - _)),
                      (a.vy += h * _);
              }
              function _() {
                if (d) {
                  var o,
                    s,
                    r = d.length,
                    c = e.length,
                    f = new Map(d.map((e, t) => [u(e, t, d), e]));
                  for (o = 0, a = new Array(r); o < c; ++o)
                    ((s = e[o]).index = o),
                      'object' != typeof s.source && (s.source = i(f, s.source)),
                      'object' != typeof s.target && (s.target = i(f, s.target)),
                      (a[s.source.index] = (a[s.source.index] || 0) + 1),
                      (a[s.target.index] = (a[s.target.index] || 0) + 1);
                  for (o = 0, l = new Array(c); o < c; ++o) (s = e[o]), (l[o] = a[s.source.index] / (a[s.source.index] + a[s.target.index]));
                  (t = new Array(c)), g(), (n = new Array(c)), v();
                }
              }
              function g() {
                if (d) for (var n = 0, o = e.length; n < o; ++n) t[n] = +f(e[n], n, e);
              }
              function v() {
                if (d) for (var t = 0, o = e.length; t < o; ++t) n[t] = +h(e[t], t, e);
              }
              return (
                (p.initialize = function (e, t) {
                  (d = e), (c = t), _();
                }),
                (p.links = function (t) {
                  return arguments.length ? ((e = t), _(), p) : e;
                }),
                (p.id = function (e) {
                  return arguments.length ? ((u = e), p) : u;
                }),
                (p.iterations = function (e) {
                  return arguments.length ? ((m = +e), p) : m;
                }),
                (p.strength = function (e) {
                  return arguments.length ? ((f = 'function' == typeof e ? e : (0, o.default)(+e)), g(), p) : f;
                }),
                (p.distance = function (e) {
                  return arguments.length ? ((h = 'function' == typeof e ? e : (0, o.default)(+e)), v(), p) : h;
                }),
                p
              );
            },
        });
      var o = n('./node_modules/d3-force/src/constant.js'),
        s = n('./node_modules/d3-force/src/jiggle.js');
      function r(e) {
        return e.index;
      }
      function i(e, t) {
        var n = e.get(t);
        if (!n) throw new Error('node not found: ' + t);
        return n;
      }
    },
    './node_modules/d3-force/src/manyBody.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e,
                t,
                n,
                d,
                a,
                l = (0, s.default)(-30),
                c = 1,
                u = 1 / 0,
                f = 0.81;
              function h(n) {
                var s,
                  r = e.length,
                  a = (0, o.default)(e, i.x, i.y).visitAfter(p);
                for (d = n, s = 0; s < r; ++s) (t = e[s]), a.visit(_);
              }
              function m() {
                if (e) {
                  var t,
                    n,
                    o = e.length;
                  for (a = new Array(o), t = 0; t < o; ++t) (n = e[t]), (a[n.index] = +l(n, t, e));
                }
              }
              function p(e) {
                var t,
                  n,
                  o,
                  s,
                  r,
                  i = 0,
                  d = 0;
                if (e.length) {
                  for (o = s = r = 0; r < 4; ++r) (t = e[r]) && (n = Math.abs(t.value)) && ((i += t.value), (d += n), (o += n * t.x), (s += n * t.y));
                  (e.x = o / d), (e.y = s / d);
                } else {
                  ((t = e).x = t.data.x), (t.y = t.data.y);
                  do {
                    i += a[t.data.index];
                  } while ((t = t.next));
                }
                e.value = i;
              }
              function _(e, o, s, i) {
                if (!e.value) return !0;
                var l = e.x - t.x,
                  h = e.y - t.y,
                  m = i - o,
                  p = l * l + h * h;
                if ((m * m) / f < p)
                  return (
                    p < u &&
                      (0 === l && ((l = (0, r.default)(n)), (p += l * l)),
                      0 === h && ((h = (0, r.default)(n)), (p += h * h)),
                      p < c && (p = Math.sqrt(c * p)),
                      (t.vx += (l * e.value * d) / p),
                      (t.vy += (h * e.value * d) / p)),
                    !0
                  );
                if (!(e.length || p >= u)) {
                  (e.data !== t || e.next) &&
                    (0 === l && ((l = (0, r.default)(n)), (p += l * l)), 0 === h && ((h = (0, r.default)(n)), (p += h * h)), p < c && (p = Math.sqrt(c * p)));
                  do {
                    e.data !== t && ((m = (a[e.data.index] * d) / p), (t.vx += l * m), (t.vy += h * m));
                  } while ((e = e.next));
                }
              }
              return (
                (h.initialize = function (t, o) {
                  (e = t), (n = o), m();
                }),
                (h.strength = function (e) {
                  return arguments.length ? ((l = 'function' == typeof e ? e : (0, s.default)(+e)), m(), h) : l;
                }),
                (h.distanceMin = function (e) {
                  return arguments.length ? ((c = e * e), h) : Math.sqrt(c);
                }),
                (h.distanceMax = function (e) {
                  return arguments.length ? ((u = e * e), h) : Math.sqrt(u);
                }),
                (h.theta = function (e) {
                  return arguments.length ? ((f = e * e), h) : Math.sqrt(f);
                }),
                h
              );
            },
        });
      var o = n('./node_modules/d3-quadtree/src/quadtree.js'),
        s = n('./node_modules/d3-force/src/constant.js'),
        r = n('./node_modules/d3-force/src/jiggle.js'),
        i = n('./node_modules/d3-force/src/simulation.js');
    },
    './node_modules/d3-force/src/simulation.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t,
                n = 1,
                a = 0.001,
                l = 1 - Math.pow(a, 1 / 300),
                c = 0,
                u = 0.6,
                f = new Map(),
                h = (0, s.timer)(_),
                m = (0, o.dispatch)('tick', 'end'),
                p = (0, r.default)();
              null == e && (e = []);
              function _() {
                g(), m.call('tick', t), n < a && (h.stop(), m.call('end', t));
              }
              function g(o) {
                var s,
                  r,
                  i = e.length;
                void 0 === o && (o = 1);
                for (var d = 0; d < o; ++d)
                  for (
                    n += (c - n) * l,
                      f.forEach(function (e) {
                        e(n);
                      }),
                      s = 0;
                    s < i;
                    ++s
                  )
                    null == (r = e[s]).fx ? (r.x += r.vx *= u) : ((r.x = r.fx), (r.vx = 0)), null == r.fy ? (r.y += r.vy *= u) : ((r.y = r.fy), (r.vy = 0));
                return t;
              }
              function v() {
                for (var t, n = 0, o = e.length; n < o; ++n) {
                  if ((((t = e[n]).index = n), null != t.fx && (t.x = t.fx), null != t.fy && (t.y = t.fy), isNaN(t.x) || isNaN(t.y))) {
                    var s = i * Math.sqrt(0.5 + n),
                      r = n * d;
                    (t.x = s * Math.cos(r)), (t.y = s * Math.sin(r));
                  }
                  (isNaN(t.vx) || isNaN(t.vy)) && (t.vx = t.vy = 0);
                }
              }
              function b(t) {
                return t.initialize && t.initialize(e, p), t;
              }
              return (
                v(),
                (t = {
                  tick: g,
                  restart: function () {
                    return h.restart(_), t;
                  },
                  stop: function () {
                    return h.stop(), t;
                  },
                  nodes: function (n) {
                    return arguments.length ? ((e = n), v(), f.forEach(b), t) : e;
                  },
                  alpha: function (e) {
                    return arguments.length ? ((n = +e), t) : n;
                  },
                  alphaMin: function (e) {
                    return arguments.length ? ((a = +e), t) : a;
                  },
                  alphaDecay: function (e) {
                    return arguments.length ? ((l = +e), t) : +l;
                  },
                  alphaTarget: function (e) {
                    return arguments.length ? ((c = +e), t) : c;
                  },
                  velocityDecay: function (e) {
                    return arguments.length ? ((u = 1 - e), t) : 1 - u;
                  },
                  randomSource: function (e) {
                    return arguments.length ? ((p = e), f.forEach(b), t) : p;
                  },
                  force: function (e, n) {
                    return arguments.length > 1 ? (null == n ? f.delete(e) : f.set(e, b(n)), t) : f.get(e);
                  },
                  find: function (t, n, o) {
                    var s,
                      r,
                      i,
                      d,
                      a,
                      l = 0,
                      c = e.length;
                    for (null == o ? (o = 1 / 0) : (o *= o), l = 0; l < c; ++l) (i = (s = t - (d = e[l]).x) * s + (r = n - d.y) * r) < o && ((a = d), (o = i));
                    return a;
                  },
                  on: function (e, n) {
                    return arguments.length > 1 ? (m.on(e, n), t) : m.on(e);
                  },
                })
              );
            },
          x: () =>
            function (e) {
              return e.x;
            },
          y: () =>
            function (e) {
              return e.y;
            },
        });
      var o = n('./node_modules/d3-dispatch/src/index.js'),
        s = n('./node_modules/d3-timer/src/timer.js'),
        r = n('./node_modules/d3-force/src/lcg.js');
      var i = 10,
        d = Math.PI * (3 - Math.sqrt(5));
    },
    './node_modules/d3-format/src/defaultLocale.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => d, format: () => s, formatPrefix: () => r });
      var o,
        s,
        r,
        i = n('./node_modules/d3-format/src/locale.js');
      function d(e) {
        return (o = (0, i.default)(e)), (s = o.format), (r = o.formatPrefix), o;
      }
      d({ thousands: ',', grouping: [3], currency: ['$', ''] });
    },
    './node_modules/d3-format/src/exponent.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return (e = (0, o.formatDecimalParts)(Math.abs(e))) ? e[1] : NaN;
            },
        });
      var o = n('./node_modules/d3-format/src/formatDecimal.js');
    },
    './node_modules/d3-format/src/formatDecimal.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return Math.abs((e = Math.round(e))) >= 1e21 ? e.toLocaleString('en').replace(/,/g, '') : e.toString(10);
            },
          formatDecimalParts: () =>
            function (e, t) {
              if ((n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf('e')) < 0) return null;
              var n,
                o = e.slice(0, n);
              return [o.length > 1 ? o[0] + o.slice(2) : o, +e.slice(n + 1)];
            },
        });
    },
    './node_modules/d3-format/src/formatGroup.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return function (n, o) {
                for (
                  var s = n.length, r = [], i = 0, d = e[0], a = 0;
                  s > 0 && d > 0 && (a + d + 1 > o && (d = Math.max(1, o - a)), r.push(n.substring((s -= d), s + d)), !((a += d + 1) > o));

                )
                  d = e[(i = (i + 1) % e.length)];
                return r.reverse().join(t);
              };
            },
        });
    },
    './node_modules/d3-format/src/formatNumerals.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return function (t) {
                return t.replace(/[0-9]/g, function (t) {
                  return e[+t];
                });
              };
            },
        });
    },
    './node_modules/d3-format/src/formatPrefixAuto.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = (0, s.formatDecimalParts)(e, t);
              if (!n) return e + '';
              var r = n[0],
                i = n[1],
                d = i - (o = 3 * Math.max(-8, Math.min(8, Math.floor(i / 3)))) + 1,
                a = r.length;
              return d === a
                ? r
                : d > a
                  ? r + new Array(d - a + 1).join('0')
                  : d > 0
                    ? r.slice(0, d) + '.' + r.slice(d)
                    : '0.' + new Array(1 - d).join('0') + (0, s.formatDecimalParts)(e, Math.max(0, t + d - 1))[0];
            },
          prefixExponent: () => o,
        });
      var o,
        s = n('./node_modules/d3-format/src/formatDecimal.js');
    },
    './node_modules/d3-format/src/formatRounded.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = (0, o.formatDecimalParts)(e, t);
              if (!n) return e + '';
              var s = n[0],
                r = n[1];
              return r < 0
                ? '0.' + new Array(-r).join('0') + s
                : s.length > r + 1
                  ? s.slice(0, r + 1) + '.' + s.slice(r + 1)
                  : s + new Array(r - s.length + 2).join('0');
            },
        });
      var o = n('./node_modules/d3-format/src/formatDecimal.js');
    },
    './node_modules/d3-format/src/formatSpecifier.js': (e, t, n) => {
      n.r(t), n.d(t, { FormatSpecifier: () => r, default: () => s });
      var o = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
      function s(e) {
        if (!(t = o.exec(e))) throw new Error('invalid format: ' + e);
        var t;
        return new r({
          fill: t[1],
          align: t[2],
          sign: t[3],
          symbol: t[4],
          zero: t[5],
          width: t[6],
          comma: t[7],
          precision: t[8] && t[8].slice(1),
          trim: t[9],
          type: t[10],
        });
      }
      function r(e) {
        (this.fill = void 0 === e.fill ? ' ' : e.fill + ''),
          (this.align = void 0 === e.align ? '>' : e.align + ''),
          (this.sign = void 0 === e.sign ? '-' : e.sign + ''),
          (this.symbol = void 0 === e.symbol ? '' : e.symbol + ''),
          (this.zero = !!e.zero),
          (this.width = void 0 === e.width ? void 0 : +e.width),
          (this.comma = !!e.comma),
          (this.precision = void 0 === e.precision ? void 0 : +e.precision),
          (this.trim = !!e.trim),
          (this.type = void 0 === e.type ? '' : e.type + '');
      }
      (s.prototype = r.prototype),
        (r.prototype.toString = function () {
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
    },
    './node_modules/d3-format/src/formatTrim.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              e: for (var t, n = e.length, o = 1, s = -1; o < n; ++o)
                switch (e[o]) {
                  case '.':
                    s = t = o;
                    break;
                  case '0':
                    0 === s && (s = o), (t = o);
                    break;
                  default:
                    if (!+e[o]) break e;
                    s > 0 && (s = 0);
                }
              return s > 0 ? e.slice(0, s) + e.slice(t + 1) : e;
            },
        });
    },
    './node_modules/d3-format/src/formatTypes.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i });
      var o = n('./node_modules/d3-format/src/formatDecimal.js'),
        s = n('./node_modules/d3-format/src/formatPrefixAuto.js'),
        r = n('./node_modules/d3-format/src/formatRounded.js');
      const i = {
        '%': (e, t) => (100 * e).toFixed(t),
        b: (e) => Math.round(e).toString(2),
        c: (e) => e + '',
        d: o.default,
        e: (e, t) => e.toExponential(t),
        f: (e, t) => e.toFixed(t),
        g: (e, t) => e.toPrecision(t),
        o: (e) => Math.round(e).toString(8),
        p: (e, t) => (0, r.default)(100 * e, t),
        r: r.default,
        s: s.default,
        X: (e) => Math.round(e).toString(16).toUpperCase(),
        x: (e) => Math.round(e).toString(16),
      };
    },
    './node_modules/d3-format/src/identity.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return e;
            },
        });
    },
    './node_modules/d3-format/src/locale.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = void 0 === e.grouping || void 0 === e.thousands ? c.default : (0, s.default)(u.call(e.grouping, Number), e.thousands + ''),
                n = void 0 === e.currency ? '' : e.currency[0] + '',
                h = void 0 === e.currency ? '' : e.currency[1] + '',
                m = void 0 === e.decimal ? '.' : e.decimal + '',
                p = void 0 === e.numerals ? c.default : (0, r.default)(u.call(e.numerals, String)),
                _ = void 0 === e.percent ? '%' : e.percent + '',
                g = void 0 === e.minus ? '−' : e.minus + '',
                v = void 0 === e.nan ? 'NaN' : e.nan + '';
              function b(e) {
                var o = (e = (0, i.default)(e)).fill,
                  s = e.align,
                  r = e.sign,
                  c = e.symbol,
                  u = e.zero,
                  b = e.width,
                  y = e.comma,
                  j = e.precision,
                  w = e.trim,
                  x = e.type;
                'n' === x ? ((y = !0), (x = 'g')) : a.default[x] || (void 0 === j && (j = 12), (w = !0), (x = 'g')),
                  (u || ('0' === o && '=' === s)) && ((u = !0), (o = '0'), (s = '='));
                var S = '$' === c ? n : '#' === c && /[boxX]/.test(x) ? '0' + x.toLowerCase() : '',
                  A = '$' === c ? h : /[%p]/.test(x) ? _ : '',
                  E = a.default[x],
                  M = /[defgprs%]/.test(x);
                function N(e) {
                  var n,
                    i,
                    a,
                    c = S,
                    h = A;
                  if ('c' === x) (h = E(e) + h), (e = '');
                  else {
                    var _ = (e = +e) < 0 || 1 / e < 0;
                    if (
                      ((e = isNaN(e) ? v : E(Math.abs(e), j)),
                      w && (e = (0, d.default)(e)),
                      _ && 0 == +e && '+' !== r && (_ = !1),
                      (c = (_ ? ('(' === r ? r : g) : '-' === r || '(' === r ? '' : r) + c),
                      (h = ('s' === x ? f[8 + l.prefixExponent / 3] : '') + h + (_ && '(' === r ? ')' : '')),
                      M)
                    )
                      for (n = -1, i = e.length; ++n < i; )
                        if (48 > (a = e.charCodeAt(n)) || a > 57) {
                          (h = (46 === a ? m + e.slice(n + 1) : e.slice(n)) + h), (e = e.slice(0, n));
                          break;
                        }
                  }
                  y && !u && (e = t(e, 1 / 0));
                  var N = c.length + e.length + h.length,
                    k = N < b ? new Array(b - N + 1).join(o) : '';
                  switch ((y && u && ((e = t(k + e, k.length ? b - h.length : 1 / 0)), (k = '')), s)) {
                    case '<':
                      e = c + e + h + k;
                      break;
                    case '=':
                      e = c + k + e + h;
                      break;
                    case '^':
                      e = k.slice(0, (N = k.length >> 1)) + c + e + h + k.slice(N);
                      break;
                    default:
                      e = k + c + e + h;
                  }
                  return p(e);
                }
                return (
                  (j = void 0 === j ? 6 : /[gprs]/.test(x) ? Math.max(1, Math.min(21, j)) : Math.max(0, Math.min(20, j))),
                  (N.toString = function () {
                    return e + '';
                  }),
                  N
                );
              }
              return {
                format: b,
                formatPrefix: function (e, t) {
                  var n = b((((e = (0, i.default)(e)).type = 'f'), e)),
                    s = 3 * Math.max(-8, Math.min(8, Math.floor((0, o.default)(t) / 3))),
                    r = Math.pow(10, -s),
                    d = f[8 + s / 3];
                  return function (e) {
                    return n(r * e) + d;
                  };
                },
              };
            },
        });
      var o = n('./node_modules/d3-format/src/exponent.js'),
        s = n('./node_modules/d3-format/src/formatGroup.js'),
        r = n('./node_modules/d3-format/src/formatNumerals.js'),
        i = n('./node_modules/d3-format/src/formatSpecifier.js'),
        d = n('./node_modules/d3-format/src/formatTrim.js'),
        a = n('./node_modules/d3-format/src/formatTypes.js'),
        l = n('./node_modules/d3-format/src/formatPrefixAuto.js'),
        c = n('./node_modules/d3-format/src/identity.js'),
        u = Array.prototype.map,
        f = ['y', 'z', 'a', 'f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    },
    './node_modules/d3-format/src/precisionFixed.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return Math.max(0, -(0, o.default)(Math.abs(e)));
            },
        });
      var o = n('./node_modules/d3-format/src/exponent.js');
    },
    './node_modules/d3-format/src/precisionPrefix.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return Math.max(0, 3 * Math.max(-8, Math.min(8, Math.floor((0, o.default)(t) / 3))) - (0, o.default)(Math.abs(e)));
            },
        });
      var o = n('./node_modules/d3-format/src/exponent.js');
    },
    './node_modules/d3-format/src/precisionRound.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return (e = Math.abs(e)), (t = Math.abs(t) - e), Math.max(0, (0, o.default)(t) - (0, o.default)(e)) + 1;
            },
        });
      var o = n('./node_modules/d3-format/src/exponent.js');
    },
    './node_modules/d3-interpolate/src/array.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return ((0, s.isNumberArray)(t) ? s.default : r)(e, t);
            },
          genericArray: () => r,
        });
      var o = n('./node_modules/d3-interpolate/src/value.js'),
        s = n('./node_modules/d3-interpolate/src/numberArray.js');
      function r(e, t) {
        var n,
          s = t ? t.length : 0,
          r = e ? Math.min(s, e.length) : 0,
          i = new Array(r),
          d = new Array(s);
        for (n = 0; n < r; ++n) i[n] = (0, o.default)(e[n], t[n]);
        for (; n < s; ++n) d[n] = t[n];
        return function (e) {
          for (n = 0; n < r; ++n) d[n] = i[n](e);
          return d;
        };
      }
    },
    './node_modules/d3-interpolate/src/basis.js': (e, t, n) => {
      function o(e, t, n, o, s) {
        var r = e * e,
          i = r * e;
        return ((1 - 3 * e + 3 * r - i) * t + (4 - 6 * r + 3 * i) * n + (1 + 3 * e + 3 * r - 3 * i) * o + i * s) / 6;
      }
      n.r(t),
        n.d(t, {
          basis: () => o,
          default: () =>
            function (e) {
              var t = e.length - 1;
              return function (n) {
                var s = n <= 0 ? (n = 0) : n >= 1 ? ((n = 1), t - 1) : Math.floor(n * t),
                  r = e[s],
                  i = e[s + 1],
                  d = s > 0 ? e[s - 1] : 2 * r - i,
                  a = s < t - 1 ? e[s + 2] : 2 * i - r;
                return o((n - s / t) * t, d, r, i, a);
              };
            },
        });
    },
    './node_modules/d3-interpolate/src/basisClosed.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = e.length;
              return function (n) {
                var s = Math.floor(((n %= 1) < 0 ? ++n : n) * t),
                  r = e[(s + t - 1) % t],
                  i = e[s % t],
                  d = e[(s + 1) % t],
                  a = e[(s + 2) % t];
                return (0, o.basis)((n - s / t) * t, r, i, d, a);
              };
            },
        });
      var o = n('./node_modules/d3-interpolate/src/basis.js');
    },
    './node_modules/d3-interpolate/src/color.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () => r,
          gamma: () =>
            function (e) {
              return 1 == (e = +e)
                ? r
                : function (t, n) {
                    return n - t
                      ? (function (e, t, n) {
                          return (
                            (e = Math.pow(e, n)),
                            (t = Math.pow(t, n) - e),
                            (n = 1 / n),
                            function (o) {
                              return Math.pow(e + o * t, n);
                            }
                          );
                        })(t, n, e)
                      : (0, o.default)(isNaN(t) ? n : t);
                  };
            },
          hue: () =>
            function (e, t) {
              var n = t - e;
              return n ? s(e, n > 180 || n < -180 ? n - 360 * Math.round(n / 360) : n) : (0, o.default)(isNaN(e) ? t : e);
            },
        });
      var o = n('./node_modules/d3-interpolate/src/constant.js');
      function s(e, t) {
        return function (n) {
          return e + n * t;
        };
      }
      function r(e, t) {
        var n = t - e;
        return n ? s(e, n) : (0, o.default)(isNaN(e) ? t : e);
      }
    },
    './node_modules/d3-interpolate/src/constant.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (e) => () => e;
    },
    './node_modules/d3-interpolate/src/cubehelix.js': (e, t, n) => {
      n.r(t), n.d(t, { cubehelixLong: () => d, default: () => i });
      var o = n('./node_modules/d3-color/src/cubehelix.js'),
        s = n('./node_modules/d3-interpolate/src/color.js');
      function r(e) {
        return (function t(n) {
          function r(t, r) {
            var i = e((t = (0, o.default)(t)).h, (r = (0, o.default)(r)).h),
              d = (0, s.default)(t.s, r.s),
              a = (0, s.default)(t.l, r.l),
              l = (0, s.default)(t.opacity, r.opacity);
            return function (e) {
              return (t.h = i(e)), (t.s = d(e)), (t.l = a(Math.pow(e, n))), (t.opacity = l(e)), t + '';
            };
          }
          return (n = +n), (r.gamma = t), r;
        })(1);
      }
      const i = r(s.hue);
      var d = r(s.default);
    },
    './node_modules/d3-interpolate/src/date.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = new Date();
              return (
                (e = +e),
                (t = +t),
                function (o) {
                  return n.setTime(e * (1 - o) + t * o), n;
                }
              );
            },
        });
    },
    './node_modules/d3-interpolate/src/number.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return (
                (e = +e),
                (t = +t),
                function (n) {
                  return e * (1 - n) + t * n;
                }
              );
            },
        });
    },
    './node_modules/d3-interpolate/src/numberArray.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              t || (t = []);
              var n,
                o = e ? Math.min(t.length, e.length) : 0,
                s = t.slice();
              return function (r) {
                for (n = 0; n < o; ++n) s[n] = e[n] * (1 - r) + t[n] * r;
                return s;
              };
            },
          isNumberArray: () =>
            function (e) {
              return ArrayBuffer.isView(e) && !(e instanceof DataView);
            },
        });
    },
    './node_modules/d3-interpolate/src/object.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n,
                s = {},
                r = {};
              (null !== e && 'object' == typeof e) || (e = {});
              (null !== t && 'object' == typeof t) || (t = {});
              for (n in t) n in e ? (s[n] = (0, o.default)(e[n], t[n])) : (r[n] = t[n]);
              return function (e) {
                for (n in s) r[n] = s[n](e);
                return r;
              };
            },
        });
      var o = n('./node_modules/d3-interpolate/src/value.js');
    },
    './node_modules/d3-interpolate/src/rgb.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => d, rgbBasis: () => l, rgbBasisClosed: () => c });
      var o = n('./node_modules/d3-color/src/color.js'),
        s = n('./node_modules/d3-interpolate/src/basis.js'),
        r = n('./node_modules/d3-interpolate/src/basisClosed.js'),
        i = n('./node_modules/d3-interpolate/src/color.js');
      const d = (function e(t) {
        var n = (0, i.gamma)(t);
        function s(e, t) {
          var s = n((e = (0, o.rgb)(e)).r, (t = (0, o.rgb)(t)).r),
            r = n(e.g, t.g),
            d = n(e.b, t.b),
            a = (0, i.default)(e.opacity, t.opacity);
          return function (t) {
            return (e.r = s(t)), (e.g = r(t)), (e.b = d(t)), (e.opacity = a(t)), e + '';
          };
        }
        return (s.gamma = e), s;
      })(1);
      function a(e) {
        return function (t) {
          var n,
            s,
            r = t.length,
            i = new Array(r),
            d = new Array(r),
            a = new Array(r);
          for (n = 0; n < r; ++n) (s = (0, o.rgb)(t[n])), (i[n] = s.r || 0), (d[n] = s.g || 0), (a[n] = s.b || 0);
          return (
            (i = e(i)),
            (d = e(d)),
            (a = e(a)),
            (s.opacity = 1),
            function (e) {
              return (s.r = i(e)), (s.g = d(e)), (s.b = a(e)), s + '';
            }
          );
        };
      }
      var l = a(s.default),
        c = a(r.default);
    },
    './node_modules/d3-interpolate/src/round.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return (
                (e = +e),
                (t = +t),
                function (n) {
                  return Math.round(e * (1 - n) + t * n);
                }
              );
            },
        });
    },
    './node_modules/d3-interpolate/src/string.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n,
                i,
                d,
                a = (s.lastIndex = r.lastIndex = 0),
                l = -1,
                c = [],
                u = [];
              (e += ''), (t += '');
              for (; (n = s.exec(e)) && (i = r.exec(t)); )
                (d = i.index) > a && ((d = t.slice(a, d)), c[l] ? (c[l] += d) : (c[++l] = d)),
                  (n = n[0]) === (i = i[0]) ? (c[l] ? (c[l] += i) : (c[++l] = i)) : ((c[++l] = null), u.push({ i: l, x: (0, o.default)(n, i) })),
                  (a = r.lastIndex);
              a < t.length && ((d = t.slice(a)), c[l] ? (c[l] += d) : (c[++l] = d));
              return c.length < 2
                ? u[0]
                  ? (function (e) {
                      return function (t) {
                        return e(t) + '';
                      };
                    })(u[0].x)
                  : (function (e) {
                      return function () {
                        return e;
                      };
                    })(t)
                : ((t = u.length),
                  function (e) {
                    for (var n, o = 0; o < t; ++o) c[(n = u[o]).i] = n.x(e);
                    return c.join('');
                  });
            },
        });
      var o = n('./node_modules/d3-interpolate/src/number.js'),
        s = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        r = new RegExp(s.source, 'g');
    },
    './node_modules/d3-interpolate/src/transform/decompose.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n, s, r, i) {
              var d, a, l;
              (d = Math.sqrt(e * e + t * t)) && ((e /= d), (t /= d));
              (l = e * n + t * s) && ((n -= e * l), (s -= t * l));
              (a = Math.sqrt(n * n + s * s)) && ((n /= a), (s /= a), (l /= a));
              e * s < t * n && ((e = -e), (t = -t), (l = -l), (d = -d));
              return { translateX: r, translateY: i, rotate: Math.atan2(t, e) * o, skewX: Math.atan(l) * o, scaleX: d, scaleY: a };
            },
          identity: () => s,
        });
      var o = 180 / Math.PI,
        s = { translateX: 0, translateY: 0, rotate: 0, skewX: 0, scaleX: 1, scaleY: 1 };
    },
    './node_modules/d3-interpolate/src/transform/index.js': (e, t, n) => {
      n.r(t), n.d(t, { interpolateTransformCss: () => i, interpolateTransformSvg: () => d });
      var o = n('./node_modules/d3-interpolate/src/number.js'),
        s = n('./node_modules/d3-interpolate/src/transform/parse.js');
      function r(e, t, n, s) {
        function r(e) {
          return e.length ? e.pop() + ' ' : '';
        }
        return function (i, d) {
          var a = [],
            l = [];
          return (
            (i = e(i)),
            (d = e(d)),
            (function (e, s, r, i, d, a) {
              if (e !== r || s !== i) {
                var l = d.push('translate(', null, t, null, n);
                a.push({ i: l - 4, x: (0, o.default)(e, r) }, { i: l - 2, x: (0, o.default)(s, i) });
              } else (r || i) && d.push('translate(' + r + t + i + n);
            })(i.translateX, i.translateY, d.translateX, d.translateY, a, l),
            (function (e, t, n, i) {
              e !== t
                ? (e - t > 180 ? (t += 360) : t - e > 180 && (e += 360), i.push({ i: n.push(r(n) + 'rotate(', null, s) - 2, x: (0, o.default)(e, t) }))
                : t && n.push(r(n) + 'rotate(' + t + s);
            })(i.rotate, d.rotate, a, l),
            (function (e, t, n, i) {
              e !== t ? i.push({ i: n.push(r(n) + 'skewX(', null, s) - 2, x: (0, o.default)(e, t) }) : t && n.push(r(n) + 'skewX(' + t + s);
            })(i.skewX, d.skewX, a, l),
            (function (e, t, n, s, i, d) {
              if (e !== n || t !== s) {
                var a = i.push(r(i) + 'scale(', null, ',', null, ')');
                d.push({ i: a - 4, x: (0, o.default)(e, n) }, { i: a - 2, x: (0, o.default)(t, s) });
              } else (1 === n && 1 === s) || i.push(r(i) + 'scale(' + n + ',' + s + ')');
            })(i.scaleX, i.scaleY, d.scaleX, d.scaleY, a, l),
            (i = d = null),
            function (e) {
              for (var t, n = -1, o = l.length; ++n < o; ) a[(t = l[n]).i] = t.x(e);
              return a.join('');
            }
          );
        };
      }
      var i = r(s.parseCss, 'px, ', 'px)', 'deg)'),
        d = r(s.parseSvg, ', ', ')', ')');
    },
    './node_modules/d3-interpolate/src/transform/parse.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          parseCss: () =>
            function (e) {
              const t = new ('function' == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(e + '');
              return t.isIdentity ? s.identity : (0, s.default)(t.a, t.b, t.c, t.d, t.e, t.f);
            },
          parseSvg: () =>
            function (e) {
              if (null == e) return s.identity;
              o || (o = document.createElementNS('http://www.w3.org/2000/svg', 'g'));
              return (
                o.setAttribute('transform', e), (e = o.transform.baseVal.consolidate()) ? ((e = e.matrix), (0, s.default)(e.a, e.b, e.c, e.d, e.e, e.f)) : s.identity
              );
            },
        });
      var o,
        s = n('./node_modules/d3-interpolate/src/transform/decompose.js');
    },
    './node_modules/d3-interpolate/src/value.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n,
                f = typeof t;
              return null == t || 'boolean' === f
                ? (0, c.default)(t)
                : ('number' === f
                    ? d.default
                    : 'string' === f
                      ? (n = (0, o.default)(t))
                        ? ((t = n), s.default)
                        : l.default
                      : t instanceof o.default
                        ? s.default
                        : t instanceof Date
                          ? i.default
                          : (0, u.isNumberArray)(t)
                            ? u.default
                            : Array.isArray(t)
                              ? r.genericArray
                              : ('function' != typeof t.valueOf && 'function' != typeof t.toString) || isNaN(t)
                                ? a.default
                                : d.default)(e, t);
            },
        });
      var o = n('./node_modules/d3-color/src/color.js'),
        s = n('./node_modules/d3-interpolate/src/rgb.js'),
        r = n('./node_modules/d3-interpolate/src/array.js'),
        i = n('./node_modules/d3-interpolate/src/date.js'),
        d = n('./node_modules/d3-interpolate/src/number.js'),
        a = n('./node_modules/d3-interpolate/src/object.js'),
        l = n('./node_modules/d3-interpolate/src/string.js'),
        c = n('./node_modules/d3-interpolate/src/constant.js'),
        u = n('./node_modules/d3-interpolate/src/numberArray.js');
    },
    './node_modules/d3-interpolate/src/zoom.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => r });
      var o = 1e-12;
      function s(e) {
        return ((e = Math.exp(e)) + 1 / e) / 2;
      }
      const r = (function e(t, n, r) {
        function i(e, i) {
          var d,
            a,
            l = e[0],
            c = e[1],
            u = e[2],
            f = i[0],
            h = i[1],
            m = i[2],
            p = f - l,
            _ = h - c,
            g = p * p + _ * _;
          if (g < o)
            (a = Math.log(m / u) / t),
              (d = function (e) {
                return [l + e * p, c + e * _, u * Math.exp(t * e * a)];
              });
          else {
            var v = Math.sqrt(g),
              b = (m * m - u * u + r * g) / (2 * u * n * v),
              y = (m * m - u * u - r * g) / (2 * m * n * v),
              j = Math.log(Math.sqrt(b * b + 1) - b),
              w = Math.log(Math.sqrt(y * y + 1) - y);
            (a = (w - j) / t),
              (d = function (e) {
                var o,
                  r = e * a,
                  i = s(j),
                  d =
                    (u / (n * v)) *
                    (i * ((o = t * r + j), ((o = Math.exp(2 * o)) - 1) / (o + 1)) -
                      (function (e) {
                        return ((e = Math.exp(e)) - 1 / e) / 2;
                      })(j));
                return [l + d * p, c + d * _, (u * i) / s(t * r + j)];
              });
          }
          return (d.duration = (1e3 * a * t) / Math.SQRT2), d;
        }
        return (
          (i.rho = function (t) {
            var n = Math.max(0.001, +t),
              o = n * n;
            return e(n, o, o * o);
          }),
          i
        );
      })(Math.SQRT2, 2, 4);
    },
    './node_modules/d3-quadtree/src/add.js': (e, t, n) => {
      function o(e, t, n, o) {
        if (isNaN(t) || isNaN(n)) return e;
        var s,
          r,
          i,
          d,
          a,
          l,
          c,
          u,
          f,
          h = e._root,
          m = { data: o },
          p = e._x0,
          _ = e._y0,
          g = e._x1,
          v = e._y1;
        if (!h) return (e._root = m), e;
        for (; h.length; )
          if (((l = t >= (r = (p + g) / 2)) ? (p = r) : (g = r), (c = n >= (i = (_ + v) / 2)) ? (_ = i) : (v = i), (s = h), !(h = h[(u = (c << 1) | l)])))
            return (s[u] = m), e;
        if (((d = +e._x.call(null, h.data)), (a = +e._y.call(null, h.data)), t === d && n === a)) return (m.next = h), s ? (s[u] = m) : (e._root = m), e;
        do {
          (s = s ? (s[u] = new Array(4)) : (e._root = new Array(4))),
            (l = t >= (r = (p + g) / 2)) ? (p = r) : (g = r),
            (c = n >= (i = (_ + v) / 2)) ? (_ = i) : (v = i);
        } while ((u = (c << 1) | l) == (f = ((a >= i) << 1) | (d >= r)));
        return (s[f] = h), (s[u] = m), e;
      }
      n.r(t),
        n.d(t, {
          addAll: () =>
            function (e) {
              var t,
                n,
                s,
                r,
                i = e.length,
                d = new Array(i),
                a = new Array(i),
                l = 1 / 0,
                c = 1 / 0,
                u = -1 / 0,
                f = -1 / 0;
              for (n = 0; n < i; ++n)
                isNaN((s = +this._x.call(null, (t = e[n])))) ||
                  isNaN((r = +this._y.call(null, t))) ||
                  ((d[n] = s), (a[n] = r), s < l && (l = s), s > u && (u = s), r < c && (c = r), r > f && (f = r));
              if (l > u || c > f) return this;
              for (this.cover(l, c).cover(u, f), n = 0; n < i; ++n) o(this, d[n], a[n], e[n]);
              return this;
            },
          default: () =>
            function (e) {
              const t = +this._x.call(null, e),
                n = +this._y.call(null, e);
              return o(this.cover(t, n), t, n, e);
            },
        });
    },
    './node_modules/d3-quadtree/src/cover.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              if (isNaN((e = +e)) || isNaN((t = +t))) return this;
              var n = this._x0,
                o = this._y0,
                s = this._x1,
                r = this._y1;
              if (isNaN(n)) (s = (n = Math.floor(e)) + 1), (r = (o = Math.floor(t)) + 1);
              else {
                for (var i, d, a = s - n || 1, l = this._root; n > e || e >= s || o > t || t >= r; )
                  switch (((d = ((t < o) << 1) | (e < n)), ((i = new Array(4))[d] = l), (l = i), (a *= 2), d)) {
                    case 0:
                      (s = n + a), (r = o + a);
                      break;
                    case 1:
                      (n = s - a), (r = o + a);
                      break;
                    case 2:
                      (s = n + a), (o = r - a);
                      break;
                    case 3:
                      (n = s - a), (o = r - a);
                  }
                this._root && this._root.length && (this._root = l);
              }
              return (this._x0 = n), (this._y0 = o), (this._x1 = s), (this._y1 = r), this;
            },
        });
    },
    './node_modules/d3-quadtree/src/data.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e = [];
              return (
                this.visit(function (t) {
                  if (!t.length)
                    do {
                      e.push(t.data);
                    } while ((t = t.next));
                }),
                e
              );
            },
        });
    },
    './node_modules/d3-quadtree/src/extent.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length
                ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1])
                : isNaN(this._x0)
                  ? void 0
                  : [
                      [this._x0, this._y0],
                      [this._x1, this._y1],
                    ];
            },
        });
    },
    './node_modules/d3-quadtree/src/find.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var s,
                r,
                i,
                d,
                a,
                l,
                c,
                u = this._x0,
                f = this._y0,
                h = this._x1,
                m = this._y1,
                p = [],
                _ = this._root;
              _ && p.push(new o.default(_, u, f, h, m));
              null == n ? (n = 1 / 0) : ((u = e - n), (f = t - n), (h = e + n), (m = t + n), (n *= n));
              for (; (l = p.pop()); )
                if (!(!(_ = l.node) || (r = l.x0) > h || (i = l.y0) > m || (d = l.x1) < u || (a = l.y1) < f))
                  if (_.length) {
                    var g = (r + d) / 2,
                      v = (i + a) / 2;
                    p.push(new o.default(_[3], g, v, d, a), new o.default(_[2], r, v, g, a), new o.default(_[1], g, i, d, v), new o.default(_[0], r, i, g, v)),
                      (c = ((t >= v) << 1) | (e >= g)) && ((l = p[p.length - 1]), (p[p.length - 1] = p[p.length - 1 - c]), (p[p.length - 1 - c] = l));
                  } else {
                    var b = e - +this._x.call(null, _.data),
                      y = t - +this._y.call(null, _.data),
                      j = b * b + y * y;
                    if (j < n) {
                      var w = Math.sqrt((n = j));
                      (u = e - w), (f = t - w), (h = e + w), (m = t + w), (s = _.data);
                    }
                  }
              return s;
            },
        });
      var o = n('./node_modules/d3-quadtree/src/quad.js');
    },
    './node_modules/d3-quadtree/src/quad.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n, o, s) {
              (this.node = e), (this.x0 = t), (this.y0 = n), (this.x1 = o), (this.y1 = s);
            },
        });
    },
    './node_modules/d3-quadtree/src/quadtree.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => p });
      var o = n('./node_modules/d3-quadtree/src/add.js'),
        s = n('./node_modules/d3-quadtree/src/cover.js'),
        r = n('./node_modules/d3-quadtree/src/data.js'),
        i = n('./node_modules/d3-quadtree/src/extent.js'),
        d = n('./node_modules/d3-quadtree/src/find.js'),
        a = n('./node_modules/d3-quadtree/src/remove.js'),
        l = n('./node_modules/d3-quadtree/src/root.js'),
        c = n('./node_modules/d3-quadtree/src/size.js'),
        u = n('./node_modules/d3-quadtree/src/visit.js'),
        f = n('./node_modules/d3-quadtree/src/visitAfter.js'),
        h = n('./node_modules/d3-quadtree/src/x.js'),
        m = n('./node_modules/d3-quadtree/src/y.js');
      function p(e, t, n) {
        var o = new _(null == t ? h.defaultX : t, null == n ? m.defaultY : n, NaN, NaN, NaN, NaN);
        return null == e ? o : o.addAll(e);
      }
      function _(e, t, n, o, s, r) {
        (this._x = e), (this._y = t), (this._x0 = n), (this._y0 = o), (this._x1 = s), (this._y1 = r), (this._root = void 0);
      }
      function g(e) {
        for (var t = { data: e.data }, n = t; (e = e.next); ) n = n.next = { data: e.data };
        return t;
      }
      var v = (p.prototype = _.prototype);
      (v.copy = function () {
        var e,
          t,
          n = new _(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
          o = this._root;
        if (!o) return n;
        if (!o.length) return (n._root = g(o)), n;
        for (e = [{ source: o, target: (n._root = new Array(4)) }]; (o = e.pop()); )
          for (var s = 0; s < 4; ++s) (t = o.source[s]) && (t.length ? e.push({ source: t, target: (o.target[s] = new Array(4)) }) : (o.target[s] = g(t)));
        return n;
      }),
        (v.add = o.default),
        (v.addAll = o.addAll),
        (v.cover = s.default),
        (v.data = r.default),
        (v.extent = i.default),
        (v.find = d.default),
        (v.remove = a.default),
        (v.removeAll = a.removeAll),
        (v.root = l.default),
        (v.size = c.default),
        (v.visit = u.default),
        (v.visitAfter = f.default),
        (v.x = h.default),
        (v.y = m.default);
    },
    './node_modules/d3-quadtree/src/remove.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              if (isNaN((r = +this._x.call(null, e))) || isNaN((i = +this._y.call(null, e)))) return this;
              var t,
                n,
                o,
                s,
                r,
                i,
                d,
                a,
                l,
                c,
                u,
                f,
                h = this._root,
                m = this._x0,
                p = this._y0,
                _ = this._x1,
                g = this._y1;
              if (!h) return this;
              if (h.length)
                for (;;) {
                  if (((l = r >= (d = (m + _) / 2)) ? (m = d) : (_ = d), (c = i >= (a = (p + g) / 2)) ? (p = a) : (g = a), (t = h), !(h = h[(u = (c << 1) | l)])))
                    return this;
                  if (!h.length) break;
                  (t[(u + 1) & 3] || t[(u + 2) & 3] || t[(u + 3) & 3]) && ((n = t), (f = u));
                }
              for (; h.data !== e; ) if (((o = h), !(h = h.next))) return this;
              (s = h.next) && delete h.next;
              if (o) return s ? (o.next = s) : delete o.next, this;
              if (!t) return (this._root = s), this;
              s ? (t[u] = s) : delete t[u],
                (h = t[0] || t[1] || t[2] || t[3]) && h === (t[3] || t[2] || t[1] || t[0]) && !h.length && (n ? (n[f] = h) : (this._root = h));
              return this;
            },
          removeAll: () =>
            function (e) {
              for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
              return this;
            },
        });
    },
    './node_modules/d3-quadtree/src/root.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this._root;
            },
        });
    },
    './node_modules/d3-quadtree/src/size.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e = 0;
              return (
                this.visit(function (t) {
                  if (!t.length)
                    do {
                      ++e;
                    } while ((t = t.next));
                }),
                e
              );
            },
        });
    },
    './node_modules/d3-quadtree/src/visit.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t,
                n,
                s,
                r,
                i,
                d,
                a = [],
                l = this._root;
              l && a.push(new o.default(l, this._x0, this._y0, this._x1, this._y1));
              for (; (t = a.pop()); )
                if (!e((l = t.node), (s = t.x0), (r = t.y0), (i = t.x1), (d = t.y1)) && l.length) {
                  var c = (s + i) / 2,
                    u = (r + d) / 2;
                  (n = l[3]) && a.push(new o.default(n, c, u, i, d)),
                    (n = l[2]) && a.push(new o.default(n, s, u, c, d)),
                    (n = l[1]) && a.push(new o.default(n, c, r, i, u)),
                    (n = l[0]) && a.push(new o.default(n, s, r, c, u));
                }
              return this;
            },
        });
      var o = n('./node_modules/d3-quadtree/src/quad.js');
    },
    './node_modules/d3-quadtree/src/visitAfter.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t,
                n = [],
                s = [];
              this._root && n.push(new o.default(this._root, this._x0, this._y0, this._x1, this._y1));
              for (; (t = n.pop()); ) {
                var r = t.node;
                if (r.length) {
                  var i,
                    d = t.x0,
                    a = t.y0,
                    l = t.x1,
                    c = t.y1,
                    u = (d + l) / 2,
                    f = (a + c) / 2;
                  (i = r[0]) && n.push(new o.default(i, d, a, u, f)),
                    (i = r[1]) && n.push(new o.default(i, u, a, l, f)),
                    (i = r[2]) && n.push(new o.default(i, d, f, u, c)),
                    (i = r[3]) && n.push(new o.default(i, u, f, l, c));
                }
                s.push(t);
              }
              for (; (t = s.pop()); ) e(t.node, t.x0, t.y0, t.x1, t.y1);
              return this;
            },
        });
      var o = n('./node_modules/d3-quadtree/src/quad.js');
    },
    './node_modules/d3-quadtree/src/x.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length ? ((this._x = e), this) : this._x;
            },
          defaultX: () =>
            function (e) {
              return e[0];
            },
        });
    },
    './node_modules/d3-quadtree/src/y.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length ? ((this._y = e), this) : this._y;
            },
          defaultY: () =>
            function (e) {
              return e[1];
            },
        });
    },
    './node_modules/d3-scale-chromatic/src/categorical/Accent.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666');
    },
    './node_modules/d3-scale-chromatic/src/categorical/Dark2.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666');
    },
    './node_modules/d3-scale-chromatic/src/categorical/Paired.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928');
    },
    './node_modules/d3-scale-chromatic/src/categorical/Pastel1.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2');
    },
    './node_modules/d3-scale-chromatic/src/categorical/Pastel2.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc');
    },
    './node_modules/d3-scale-chromatic/src/categorical/Set1.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999');
    },
    './node_modules/d3-scale-chromatic/src/categorical/Set2.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3');
    },
    './node_modules/d3-scale-chromatic/src/categorical/Set3.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f');
    },
    './node_modules/d3-scale-chromatic/src/categorical/Tableau10.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab');
    },
    './node_modules/d3-scale-chromatic/src/categorical/category10.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (0, n('./node_modules/d3-scale-chromatic/src/colors.js').default)('1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf');
    },
    './node_modules/d3-scale-chromatic/src/colors.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = (e.length / 6) | 0,
                n = new Array(t),
                o = 0;
              for (; o < t; ) n[o] = '#' + e.slice(6 * o, 6 * ++o);
              return n;
            },
        });
    },
    './node_modules/d3-scale-chromatic/src/diverging/BrBG.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
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
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/diverging/PRGn.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
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
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/diverging/PiYG.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
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
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/diverging/PuOr.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
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
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/diverging/RdBu.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
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
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/diverging/RdGy.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
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
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/diverging/RdYlBu.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
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
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/diverging/RdYlGn.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
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
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/diverging/Spectral.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
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
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/index.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          interpolateBlues: () => I.default,
          interpolateBrBG: () => h.default,
          interpolateBuGn: () => w.default,
          interpolateBuPu: () => x.default,
          interpolateCividis: () => D.default,
          interpolateCool: () => H.cool,
          interpolateCubehelixDefault: () => $.default,
          interpolateGnBu: () => S.default,
          interpolateGreens: () => L.default,
          interpolateGreys: () => R.default,
          interpolateInferno: () => U.inferno,
          interpolateMagma: () => U.magma,
          interpolateOrRd: () => A.default,
          interpolateOranges: () => O.default,
          interpolatePRGn: () => m.default,
          interpolatePiYG: () => p.default,
          interpolatePlasma: () => U.plasma,
          interpolatePuBu: () => M.default,
          interpolatePuBuGn: () => E.default,
          interpolatePuOr: () => _.default,
          interpolatePuRd: () => N.default,
          interpolatePurples: () => q.default,
          interpolateRainbow: () => H.default,
          interpolateRdBu: () => g.default,
          interpolateRdGy: () => v.default,
          interpolateRdPu: () => k.default,
          interpolateRdYlBu: () => b.default,
          interpolateRdYlGn: () => y.default,
          interpolateReds: () => B.default,
          interpolateSinebow: () => V.default,
          interpolateSpectral: () => j.default,
          interpolateTurbo: () => G.default,
          interpolateViridis: () => U.default,
          interpolateWarm: () => H.warm,
          interpolateYlGn: () => P.default,
          interpolateYlGnBu: () => z.default,
          interpolateYlOrBr: () => C.default,
          interpolateYlOrRd: () => T.default,
          schemeAccent: () => s.default,
          schemeBlues: () => I.scheme,
          schemeBrBG: () => h.scheme,
          schemeBuGn: () => w.scheme,
          schemeBuPu: () => x.scheme,
          schemeCategory10: () => o.default,
          schemeDark2: () => r.default,
          schemeGnBu: () => S.scheme,
          schemeGreens: () => L.scheme,
          schemeGreys: () => R.scheme,
          schemeOrRd: () => A.scheme,
          schemeOranges: () => O.scheme,
          schemePRGn: () => m.scheme,
          schemePaired: () => i.default,
          schemePastel1: () => d.default,
          schemePastel2: () => a.default,
          schemePiYG: () => p.scheme,
          schemePuBu: () => M.scheme,
          schemePuBuGn: () => E.scheme,
          schemePuOr: () => _.scheme,
          schemePuRd: () => N.scheme,
          schemePurples: () => q.scheme,
          schemeRdBu: () => g.scheme,
          schemeRdGy: () => v.scheme,
          schemeRdPu: () => k.scheme,
          schemeRdYlBu: () => b.scheme,
          schemeRdYlGn: () => y.scheme,
          schemeReds: () => B.scheme,
          schemeSet1: () => l.default,
          schemeSet2: () => c.default,
          schemeSet3: () => u.default,
          schemeSpectral: () => j.scheme,
          schemeTableau10: () => f.default,
          schemeYlGn: () => P.scheme,
          schemeYlGnBu: () => z.scheme,
          schemeYlOrBr: () => C.scheme,
          schemeYlOrRd: () => T.scheme,
        });
      var o = n('./node_modules/d3-scale-chromatic/src/categorical/category10.js'),
        s = n('./node_modules/d3-scale-chromatic/src/categorical/Accent.js'),
        r = n('./node_modules/d3-scale-chromatic/src/categorical/Dark2.js'),
        i = n('./node_modules/d3-scale-chromatic/src/categorical/Paired.js'),
        d = n('./node_modules/d3-scale-chromatic/src/categorical/Pastel1.js'),
        a = n('./node_modules/d3-scale-chromatic/src/categorical/Pastel2.js'),
        l = n('./node_modules/d3-scale-chromatic/src/categorical/Set1.js'),
        c = n('./node_modules/d3-scale-chromatic/src/categorical/Set2.js'),
        u = n('./node_modules/d3-scale-chromatic/src/categorical/Set3.js'),
        f = n('./node_modules/d3-scale-chromatic/src/categorical/Tableau10.js'),
        h = n('./node_modules/d3-scale-chromatic/src/diverging/BrBG.js'),
        m = n('./node_modules/d3-scale-chromatic/src/diverging/PRGn.js'),
        p = n('./node_modules/d3-scale-chromatic/src/diverging/PiYG.js'),
        _ = n('./node_modules/d3-scale-chromatic/src/diverging/PuOr.js'),
        g = n('./node_modules/d3-scale-chromatic/src/diverging/RdBu.js'),
        v = n('./node_modules/d3-scale-chromatic/src/diverging/RdGy.js'),
        b = n('./node_modules/d3-scale-chromatic/src/diverging/RdYlBu.js'),
        y = n('./node_modules/d3-scale-chromatic/src/diverging/RdYlGn.js'),
        j = n('./node_modules/d3-scale-chromatic/src/diverging/Spectral.js'),
        w = n('./node_modules/d3-scale-chromatic/src/sequential-multi/BuGn.js'),
        x = n('./node_modules/d3-scale-chromatic/src/sequential-multi/BuPu.js'),
        S = n('./node_modules/d3-scale-chromatic/src/sequential-multi/GnBu.js'),
        A = n('./node_modules/d3-scale-chromatic/src/sequential-multi/OrRd.js'),
        E = n('./node_modules/d3-scale-chromatic/src/sequential-multi/PuBuGn.js'),
        M = n('./node_modules/d3-scale-chromatic/src/sequential-multi/PuBu.js'),
        N = n('./node_modules/d3-scale-chromatic/src/sequential-multi/PuRd.js'),
        k = n('./node_modules/d3-scale-chromatic/src/sequential-multi/RdPu.js'),
        z = n('./node_modules/d3-scale-chromatic/src/sequential-multi/YlGnBu.js'),
        P = n('./node_modules/d3-scale-chromatic/src/sequential-multi/YlGn.js'),
        C = n('./node_modules/d3-scale-chromatic/src/sequential-multi/YlOrBr.js'),
        T = n('./node_modules/d3-scale-chromatic/src/sequential-multi/YlOrRd.js'),
        I = n('./node_modules/d3-scale-chromatic/src/sequential-single/Blues.js'),
        L = n('./node_modules/d3-scale-chromatic/src/sequential-single/Greens.js'),
        R = n('./node_modules/d3-scale-chromatic/src/sequential-single/Greys.js'),
        q = n('./node_modules/d3-scale-chromatic/src/sequential-single/Purples.js'),
        B = n('./node_modules/d3-scale-chromatic/src/sequential-single/Reds.js'),
        O = n('./node_modules/d3-scale-chromatic/src/sequential-single/Oranges.js'),
        D = n('./node_modules/d3-scale-chromatic/src/sequential-multi/cividis.js'),
        $ = n('./node_modules/d3-scale-chromatic/src/sequential-multi/cubehelix.js'),
        H = n('./node_modules/d3-scale-chromatic/src/sequential-multi/rainbow.js'),
        V = n('./node_modules/d3-scale-chromatic/src/sequential-multi/sinebow.js'),
        G = n('./node_modules/d3-scale-chromatic/src/sequential-multi/turbo.js'),
        U = n('./node_modules/d3-scale-chromatic/src/sequential-multi/viridis.js');
    },
    './node_modules/d3-scale-chromatic/src/ramp.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => s });
      var o = n('./node_modules/d3-interpolate/src/rgb.js');
      const s = (e) => (0, o.rgbBasis)(e[e.length - 1]);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/BuGn.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'e5f5f999d8c92ca25f',
            'edf8fbb2e2e266c2a4238b45',
            'edf8fbb2e2e266c2a42ca25f006d2c',
            'edf8fbccece699d8c966c2a42ca25f006d2c',
            'edf8fbccece699d8c966c2a441ae76238b45005824',
            'f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824',
            'f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/BuPu.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'e0ecf49ebcda8856a7',
            'edf8fbb3cde38c96c688419d',
            'edf8fbb3cde38c96c68856a7810f7c',
            'edf8fbbfd3e69ebcda8c96c68856a7810f7c',
            'edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b',
            'f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b',
            'f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/GnBu.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'e0f3dba8ddb543a2ca',
            'f0f9e8bae4bc7bccc42b8cbe',
            'f0f9e8bae4bc7bccc443a2ca0868ac',
            'f0f9e8ccebc5a8ddb57bccc443a2ca0868ac',
            'f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e',
            'f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e',
            'f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/OrRd.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'fee8c8fdbb84e34a33',
            'fef0d9fdcc8afc8d59d7301f',
            'fef0d9fdcc8afc8d59e34a33b30000',
            'fef0d9fdd49efdbb84fc8d59e34a33b30000',
            'fef0d9fdd49efdbb84fc8d59ef6548d7301f990000',
            'fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000',
            'fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/PuBu.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'ece7f2a6bddb2b8cbe',
            'f1eef6bdc9e174a9cf0570b0',
            'f1eef6bdc9e174a9cf2b8cbe045a8d',
            'f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d',
            'f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b',
            'fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b',
            'fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/PuBuGn.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'ece2f0a6bddb1c9099',
            'f6eff7bdc9e167a9cf02818a',
            'f6eff7bdc9e167a9cf1c9099016c59',
            'f6eff7d0d1e6a6bddb67a9cf1c9099016c59',
            'f6eff7d0d1e6a6bddb67a9cf3690c002818a016450',
            'fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450',
            'fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/PuRd.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'e7e1efc994c7dd1c77',
            'f1eef6d7b5d8df65b0ce1256',
            'f1eef6d7b5d8df65b0dd1c77980043',
            'f1eef6d4b9dac994c7df65b0dd1c77980043',
            'f1eef6d4b9dac994c7df65b0e7298ace125691003f',
            'f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f',
            'f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/RdPu.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'fde0ddfa9fb5c51b8a',
            'feebe2fbb4b9f768a1ae017e',
            'feebe2fbb4b9f768a1c51b8a7a0177',
            'feebe2fcc5c0fa9fb5f768a1c51b8a7a0177',
            'feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177',
            'fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177',
            'fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/YlGn.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'f7fcb9addd8e31a354',
            'ffffccc2e69978c679238443',
            'ffffccc2e69978c67931a354006837',
            'ffffccd9f0a3addd8e78c67931a354006837',
            'ffffccd9f0a3addd8e78c67941ab5d238443005a32',
            'ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32',
            'ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/YlGnBu.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'edf8b17fcdbb2c7fb8',
            'ffffcca1dab441b6c4225ea8',
            'ffffcca1dab441b6c42c7fb8253494',
            'ffffccc7e9b47fcdbb41b6c42c7fb8253494',
            'ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84',
            'ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84',
            'ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/YlOrBr.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'fff7bcfec44fd95f0e',
            'ffffd4fed98efe9929cc4c02',
            'ffffd4fed98efe9929d95f0e993404',
            'ffffd4fee391fec44ffe9929d95f0e993404',
            'ffffd4fee391fec44ffe9929ec7014cc4c028c2d04',
            'ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04',
            'ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/YlOrRd.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'ffeda0feb24cf03b20',
            'ffffb2fecc5cfd8d3ce31a1c',
            'ffffb2fecc5cfd8d3cf03b20bd0026',
            'ffffb2fed976feb24cfd8d3cf03b20bd0026',
            'ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026',
            'ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026',
            'ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/cividis.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return (
                (e = Math.max(0, Math.min(1, e))),
                'rgb(' +
                  Math.max(0, Math.min(255, Math.round(-4.54 - e * (35.34 - e * (2381.73 - e * (6402.7 - e * (7024.72 - 2710.57 * e))))))) +
                  ', ' +
                  Math.max(0, Math.min(255, Math.round(32.49 + e * (170.73 + e * (52.82 - e * (131.46 - e * (176.58 - 67.37 * e))))))) +
                  ', ' +
                  Math.max(0, Math.min(255, Math.round(81.24 + e * (442.36 - e * (2482.43 - e * (6167.24 - e * (6614.94 - 2475.67 * e))))))) +
                  ')'
              );
            },
        });
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/cubehelix.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => s });
      var o = n('./node_modules/d3-color/src/cubehelix.js');
      const s = (0, n('./node_modules/d3-interpolate/src/cubehelix.js').cubehelixLong)((0, o.default)(300, 0.5, 0), (0, o.default)(-240, 0.5, 1));
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/rainbow.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          cool: () => i,
          default: () =>
            function (e) {
              (e < 0 || e > 1) && (e -= Math.floor(e));
              var t = Math.abs(e - 0.5);
              return (d.h = 360 * e - 100), (d.s = 1.5 - 1.5 * t), (d.l = 0.8 - 0.9 * t), d + '';
            },
          warm: () => r,
        });
      var o = n('./node_modules/d3-color/src/cubehelix.js'),
        s = n('./node_modules/d3-interpolate/src/cubehelix.js'),
        r = (0, s.cubehelixLong)((0, o.default)(-100, 0.75, 0.35), (0, o.default)(80, 1.5, 0.8)),
        i = (0, s.cubehelixLong)((0, o.default)(260, 0.75, 0.35), (0, o.default)(80, 1.5, 0.8)),
        d = (0, o.default)();
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/sinebow.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t;
              return (
                (e = (0.5 - e) * Math.PI),
                (o.r = 255 * (t = Math.sin(e)) * t),
                (o.g = 255 * (t = Math.sin(e + s)) * t),
                (o.b = 255 * (t = Math.sin(e + r)) * t),
                o + ''
              );
            },
        });
      var o = (0, n('./node_modules/d3-color/src/color.js').rgb)(),
        s = Math.PI / 3,
        r = (2 * Math.PI) / 3;
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/turbo.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return (
                (e = Math.max(0, Math.min(1, e))),
                'rgb(' +
                  Math.max(0, Math.min(255, Math.round(34.61 + e * (1172.33 - e * (10793.56 - e * (33300.12 - e * (38394.49 - 14825.05 * e))))))) +
                  ', ' +
                  Math.max(0, Math.min(255, Math.round(23.31 + e * (557.33 + e * (1225.33 - e * (3574.96 - e * (1073.77 + 707.56 * e))))))) +
                  ', ' +
                  Math.max(0, Math.min(255, Math.round(27.2 + e * (3211.1 - e * (15327.97 - e * (27814 - e * (22569.18 - 6838.66 * e))))))) +
                  ')'
              );
            },
        });
    },
    './node_modules/d3-scale-chromatic/src/sequential-multi/viridis.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => r, inferno: () => d, magma: () => i, plasma: () => a });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js');
      function s(e) {
        var t = e.length;
        return function (n) {
          return e[Math.max(0, Math.min(t - 1, Math.floor(n * t)))];
        };
      }
      const r = s(
        (0, o.default)(
          '44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725'
        )
      );
      var i = s(
          (0, o.default)(
            '00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf'
          )
        ),
        d = s(
          (0, o.default)(
            '00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4'
          )
        ),
        a = s(
          (0, o.default)(
            '0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921'
          )
        );
    },
    './node_modules/d3-scale-chromatic/src/sequential-single/Blues.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'deebf79ecae13182bd',
            'eff3ffbdd7e76baed62171b5',
            'eff3ffbdd7e76baed63182bd08519c',
            'eff3ffc6dbef9ecae16baed63182bd08519c',
            'eff3ffc6dbef9ecae16baed64292c62171b5084594',
            'f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594',
            'f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-single/Greens.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'e5f5e0a1d99b31a354',
            'edf8e9bae4b374c476238b45',
            'edf8e9bae4b374c47631a354006d2c',
            'edf8e9c7e9c0a1d99b74c47631a354006d2c',
            'edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32',
            'f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32',
            'f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-single/Greys.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'f0f0f0bdbdbd636363',
            'f7f7f7cccccc969696525252',
            'f7f7f7cccccc969696636363252525',
            'f7f7f7d9d9d9bdbdbd969696636363252525',
            'f7f7f7d9d9d9bdbdbd969696737373525252252525',
            'fffffff0f0f0d9d9d9bdbdbd969696737373525252252525',
            'fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-single/Oranges.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'fee6cefdae6be6550d',
            'feeddefdbe85fd8d3cd94701',
            'feeddefdbe85fd8d3ce6550da63603',
            'feeddefdd0a2fdae6bfd8d3ce6550da63603',
            'feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04',
            'fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04',
            'fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-single/Purples.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'efedf5bcbddc756bb1',
            'f2f0f7cbc9e29e9ac86a51a3',
            'f2f0f7cbc9e29e9ac8756bb154278f',
            'f2f0f7dadaebbcbddc9e9ac8756bb154278f',
            'f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486',
            'fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486',
            'fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale-chromatic/src/sequential-single/Reds.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => i, scheme: () => r });
      var o = n('./node_modules/d3-scale-chromatic/src/colors.js'),
        s = n('./node_modules/d3-scale-chromatic/src/ramp.js'),
        r = new Array(3)
          .concat(
            'fee0d2fc9272de2d26',
            'fee5d9fcae91fb6a4acb181d',
            'fee5d9fcae91fb6a4ade2d26a50f15',
            'fee5d9fcbba1fc9272fb6a4ade2d26a50f15',
            'fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d',
            'fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d',
            'fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d'
          )
          .map(o.default);
      const i = (0, s.default)(r);
    },
    './node_modules/d3-scale/src/constant.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return function () {
                return e;
              };
            },
        });
    },
    './node_modules/d3-scale/src/continuous.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          copy: () =>
            function (e, t) {
              return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
            },
          default: () =>
            function () {
              return m()(c, c);
            },
          identity: () => c,
          transformer: () => m,
        });
      var o = n('./node_modules/d3-array/src/bisect.js'),
        s = n('./node_modules/d3-interpolate/src/value.js'),
        r = n('./node_modules/d3-interpolate/src/number.js'),
        i = n('./node_modules/d3-interpolate/src/round.js'),
        d = n('./node_modules/d3-scale/src/constant.js'),
        a = n('./node_modules/d3-scale/src/number.js'),
        l = [0, 1];
      function c(e) {
        return e;
      }
      function u(e, t) {
        return (t -= e = +e)
          ? function (n) {
              return (n - e) / t;
            }
          : (0, d.default)(isNaN(t) ? NaN : 0.5);
      }
      function f(e, t, n) {
        var o = e[0],
          s = e[1],
          r = t[0],
          i = t[1];
        return (
          s < o ? ((o = u(s, o)), (r = n(i, r))) : ((o = u(o, s)), (r = n(r, i))),
          function (e) {
            return r(o(e));
          }
        );
      }
      function h(e, t, n) {
        var s = Math.min(e.length, t.length) - 1,
          r = new Array(s),
          i = new Array(s),
          d = -1;
        for (e[s] < e[0] && ((e = e.slice().reverse()), (t = t.slice().reverse())); ++d < s; ) (r[d] = u(e[d], e[d + 1])), (i[d] = n(t[d], t[d + 1]));
        return function (t) {
          var n = (0, o.default)(e, t, 1, s) - 1;
          return i[n](r[n](t));
        };
      }
      function m() {
        var e,
          t,
          n,
          o,
          d,
          u,
          m = l,
          p = l,
          _ = s.default,
          g = c;
        function v() {
          var e,
            t,
            n,
            s = Math.min(m.length, p.length);
          return (
            g !== c &&
              ((e = m[0]),
              (t = m[s - 1]),
              e > t && ((n = e), (e = t), (t = n)),
              (g = function (n) {
                return Math.max(e, Math.min(t, n));
              })),
            (o = s > 2 ? h : f),
            (d = u = null),
            b
          );
        }
        function b(t) {
          return null == t || isNaN((t = +t)) ? n : (d || (d = o(m.map(e), p, _)))(e(g(t)));
        }
        return (
          (b.invert = function (n) {
            return g(t((u || (u = o(p, m.map(e), r.default)))(n)));
          }),
          (b.domain = function (e) {
            return arguments.length ? ((m = Array.from(e, a.default)), v()) : m.slice();
          }),
          (b.range = function (e) {
            return arguments.length ? ((p = Array.from(e)), v()) : p.slice();
          }),
          (b.rangeRound = function (e) {
            return (p = Array.from(e)), (_ = i.default), v();
          }),
          (b.clamp = function (e) {
            return arguments.length ? ((g = !!e || c), v()) : g !== c;
          }),
          (b.interpolate = function (e) {
            return arguments.length ? ((_ = e), v()) : _;
          }),
          (b.unknown = function (e) {
            return arguments.length ? ((n = e), b) : n;
          }),
          function (n, o) {
            return (e = n), (t = o), v();
          }
        );
      }
    },
    './node_modules/d3-scale/src/init.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          initInterpolator: () =>
            function (e, t) {
              switch (arguments.length) {
                case 0:
                  break;
                case 1:
                  'function' == typeof e ? this.interpolator(e) : this.range(e);
                  break;
                default:
                  this.domain(e), 'function' == typeof t ? this.interpolator(t) : this.range(t);
              }
              return this;
            },
          initRange: () =>
            function (e, t) {
              switch (arguments.length) {
                case 0:
                  break;
                case 1:
                  this.range(e);
                  break;
                default:
                  this.range(t).domain(e);
              }
              return this;
            },
        });
    },
    './node_modules/d3-scale/src/linear.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function e() {
              var t = (0, s.default)();
              t.copy = function () {
                return (0, s.copy)(t, e());
              };
              r.initRange.apply(t, arguments);
              return d(t);
            },
          linearish: () => d,
        });
      var o = n('./node_modules/d3-array/src/ticks.js'),
        s = n('./node_modules/d3-scale/src/continuous.js'),
        r = n('./node_modules/d3-scale/src/init.js'),
        i = n('./node_modules/d3-scale/src/tickFormat.js');
      function d(e) {
        var t = e.domain;
        return (
          (e.ticks = function (e) {
            var n = t();
            return (0, o.default)(n[0], n[n.length - 1], null == e ? 10 : e);
          }),
          (e.tickFormat = function (e, n) {
            var o = t();
            return (0, i.default)(o[0], o[o.length - 1], null == e ? 10 : e, n);
          }),
          (e.nice = function (n) {
            null == n && (n = 10);
            var s,
              r,
              i = t(),
              d = 0,
              a = i.length - 1,
              l = i[d],
              c = i[a],
              u = 10;
            for (c < l && ((r = l), (l = c), (c = r), (r = d), (d = a), (a = r)); u-- > 0; ) {
              if ((r = (0, o.tickIncrement)(l, c, n)) === s) return (i[d] = l), (i[a] = c), t(i);
              if (r > 0) (l = Math.floor(l / r) * r), (c = Math.ceil(c / r) * r);
              else {
                if (!(r < 0)) break;
                (l = Math.ceil(l * r) / r), (c = Math.floor(c * r) / r);
              }
              s = r;
            }
            return e;
          }),
          e
        );
      }
    },
    './node_modules/d3-scale/src/number.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return +e;
            },
        });
    },
    './node_modules/d3-scale/src/pow.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () => c,
          powish: () => l,
          sqrt: () =>
            function () {
              return c.apply(null, arguments).exponent(0.5);
            },
        });
      var o = n('./node_modules/d3-scale/src/linear.js'),
        s = n('./node_modules/d3-scale/src/continuous.js'),
        r = n('./node_modules/d3-scale/src/init.js');
      function i(e) {
        return function (t) {
          return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
        };
      }
      function d(e) {
        return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
      }
      function a(e) {
        return e < 0 ? -e * e : e * e;
      }
      function l(e) {
        var t = e(s.identity, s.identity),
          n = 1;
        return (
          (t.exponent = function (t) {
            return arguments.length ? (1 === (n = +t) ? e(s.identity, s.identity) : 0.5 === n ? e(d, a) : e(i(n), i(1 / n))) : n;
          }),
          (0, o.linearish)(t)
        );
      }
      function c() {
        var e = l((0, s.transformer)());
        return (
          (e.copy = function () {
            return (0, s.copy)(e, c()).exponent(e.exponent());
          }),
          r.initRange.apply(e, arguments),
          e
        );
      }
    },
    './node_modules/d3-scale/src/tickFormat.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n, l) {
              var c,
                u = (0, o.tickStep)(e, t, n);
              switch ((l = (0, s.default)(null == l ? ',f' : l)).type) {
                case 's':
                  var f = Math.max(Math.abs(e), Math.abs(t));
                  return null != l.precision || isNaN((c = (0, r.default)(u, f))) || (l.precision = c), (0, i.formatPrefix)(l, f);
                case '':
                case 'e':
                case 'g':
                case 'p':
                case 'r':
                  null != l.precision || isNaN((c = (0, d.default)(u, Math.max(Math.abs(e), Math.abs(t))))) || (l.precision = c - ('e' === l.type));
                  break;
                case 'f':
                case '%':
                  null != l.precision || isNaN((c = (0, a.default)(u))) || (l.precision = c - 2 * ('%' === l.type));
              }
              return (0, i.format)(l);
            },
        });
      var o = n('./node_modules/d3-array/src/ticks.js'),
        s = n('./node_modules/d3-format/src/formatSpecifier.js'),
        r = n('./node_modules/d3-format/src/precisionPrefix.js'),
        i = n('./node_modules/d3-format/src/defaultLocale.js'),
        d = n('./node_modules/d3-format/src/precisionRound.js'),
        a = n('./node_modules/d3-format/src/precisionFixed.js');
    },
    './node_modules/d3-timer/src/timeout.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var s = new o.Timer();
              return (
                (t = null == t ? 0 : +t),
                s.restart(
                  (n) => {
                    s.stop(), e(n + t);
                  },
                  t,
                  n
                ),
                s
              );
            },
        });
      var o = n('./node_modules/d3-timer/src/timer.js');
    },
    './node_modules/d3-timer/src/timer.js': (e, t, n) => {
      n.r(t), n.d(t, { Timer: () => _, now: () => m, timer: () => g, timerFlush: () => v });
      var o,
        s,
        r = 0,
        i = 0,
        d = 0,
        a = 1e3,
        l = 0,
        c = 0,
        u = 0,
        f = 'object' == typeof performance && performance.now ? performance : Date,
        h =
          'object' == typeof window && window.requestAnimationFrame
            ? window.requestAnimationFrame.bind(window)
            : function (e) {
                setTimeout(e, 17);
              };
      function m() {
        return c || (h(p), (c = f.now() + u));
      }
      function p() {
        c = 0;
      }
      function _() {
        this._call = this._time = this._next = null;
      }
      function g(e, t, n) {
        var o = new _();
        return o.restart(e, t, n), o;
      }
      function v() {
        m(), ++r;
        for (var e, t = o; t; ) (e = c - t._time) >= 0 && t._call.call(null, e), (t = t._next);
        --r;
      }
      function b() {
        (c = (l = f.now()) + u), (r = i = 0);
        try {
          v();
        } finally {
          (r = 0),
            (function () {
              var e,
                t,
                n = o,
                r = 1 / 0;
              for (; n; ) n._call ? (r > n._time && (r = n._time), (e = n), (n = n._next)) : ((t = n._next), (n._next = null), (n = e ? (e._next = t) : (o = t)));
              (s = e), j(r);
            })(),
            (c = 0);
        }
      }
      function y() {
        var e = f.now(),
          t = e - l;
        t > a && ((u -= t), (l = e));
      }
      function j(e) {
        r ||
          (i && (i = clearTimeout(i)),
          e - c > 24
            ? (e < 1 / 0 && (i = setTimeout(b, e - f.now() - u)), d && (d = clearInterval(d)))
            : (d || ((l = f.now()), (d = setInterval(y, a))), (r = 1), h(b)));
      }
      _.prototype = g.prototype = {
        constructor: _,
        restart: function (e, t, n) {
          if ('function' != typeof e) throw new TypeError('callback is not a function');
          (n = (null == n ? m() : +n) + (null == t ? 0 : +t)),
            this._next || s === this || (s ? (s._next = this) : (o = this), (s = this)),
            (this._call = e),
            (this._time = n),
            j();
        },
        stop: function () {
          this._call && ((this._call = null), (this._time = 1 / 0), j());
        },
      };
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/array.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return 'object' == typeof e && 'length' in e ? e : Array.from(e);
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/constant.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return function () {
                return e;
              };
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/creator.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = (0, o.default)(e);
              return (
                t.local
                  ? function (e) {
                      return function () {
                        return this.ownerDocument.createElementNS(e.space, e.local);
                      };
                    }
                  : function (e) {
                      return function () {
                        var t = this.ownerDocument,
                          n = this.namespaceURI;
                        return n === s.xhtml && t.documentElement.namespaceURI === s.xhtml ? t.createElement(e) : t.createElementNS(n, e);
                      };
                    }
              )(t);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/namespace.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/namespaces.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/matcher.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          childMatcher: () =>
            function (e) {
              return function (t) {
                return t.matches(e);
              };
            },
          default: () =>
            function (e) {
              return function () {
                return this.matches(e);
              };
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/namespace.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = (e += ''),
                n = t.indexOf(':');
              n >= 0 && 'xmlns' !== (t = e.slice(0, n)) && (e = e.slice(n + 1));
              return o.default.hasOwnProperty(t) ? { space: o.default[t], local: e } : e;
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/namespaces.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/namespaces.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => s, xhtml: () => o });
      var o = 'http://www.w3.org/1999/xhtml';
      const s = {
        svg: 'http://www.w3.org/2000/svg',
        xhtml: o,
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/',
      };
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/pointer.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              (e = (0, o.default)(e)), void 0 === t && (t = e.currentTarget);
              if (t) {
                var n = t.ownerSVGElement || t;
                if (n.createSVGPoint) {
                  var s = n.createSVGPoint();
                  return (s.x = e.clientX), (s.y = e.clientY), [(s = s.matrixTransform(t.getScreenCTM().inverse())).x, s.y];
                }
                if (t.getBoundingClientRect) {
                  var r = t.getBoundingClientRect();
                  return [e.clientX - r.left - t.clientLeft, e.clientY - r.top - t.clientTop];
                }
              }
              return [e.pageX, e.pageY];
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/sourceEvent.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/select.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return 'string' == typeof e ? new o.Selection([[document.querySelector(e)]], [document.documentElement]) : new o.Selection([[e]], o.root);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/append.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = 'function' == typeof e ? e : (0, o.default)(e);
              return this.select(function () {
                return this.appendChild(t.apply(this, arguments));
              });
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/creator.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/attr.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = (0, o.default)(e);
              if (arguments.length < 2) {
                var s = this.node();
                return n.local ? s.getAttributeNS(n.space, n.local) : s.getAttribute(n);
              }
              return this.each(
                (null == t
                  ? n.local
                    ? function (e) {
                        return function () {
                          this.removeAttributeNS(e.space, e.local);
                        };
                      }
                    : function (e) {
                        return function () {
                          this.removeAttribute(e);
                        };
                      }
                  : 'function' == typeof t
                    ? n.local
                      ? function (e, t) {
                          return function () {
                            var n = t.apply(this, arguments);
                            null == n ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
                          };
                        }
                      : function (e, t) {
                          return function () {
                            var n = t.apply(this, arguments);
                            null == n ? this.removeAttribute(e) : this.setAttribute(e, n);
                          };
                        }
                    : n.local
                      ? function (e, t) {
                          return function () {
                            this.setAttributeNS(e.space, e.local, t);
                          };
                        }
                      : function (e, t) {
                          return function () {
                            this.setAttribute(e, t);
                          };
                        })(n, t)
              );
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/namespace.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/call.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e = arguments[0];
              return (arguments[0] = this), e.apply(null, arguments), this;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/classed.js': (e, t, n) => {
      function o(e) {
        return e.trim().split(/^|\s+/);
      }
      function s(e) {
        return e.classList || new r(e);
      }
      function r(e) {
        (this._node = e), (this._names = o(e.getAttribute('class') || ''));
      }
      function i(e, t) {
        for (var n = s(e), o = -1, r = t.length; ++o < r; ) n.add(t[o]);
      }
      function d(e, t) {
        for (var n = s(e), o = -1, r = t.length; ++o < r; ) n.remove(t[o]);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = o(e + '');
              if (arguments.length < 2) {
                for (var r = s(this.node()), a = -1, l = n.length; ++a < l; ) if (!r.contains(n[a])) return !1;
                return !0;
              }
              return this.each(
                ('function' == typeof t
                  ? function (e, t) {
                      return function () {
                        (t.apply(this, arguments) ? i : d)(this, e);
                      };
                    }
                  : t
                    ? function (e) {
                        return function () {
                          i(this, e);
                        };
                      }
                    : function (e) {
                        return function () {
                          d(this, e);
                        };
                      })(n, t)
              );
            },
        }),
        (r.prototype = {
          add: function (e) {
            this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute('class', this._names.join(' ')));
          },
          remove: function (e) {
            var t = this._names.indexOf(e);
            t >= 0 && (this._names.splice(t, 1), this._node.setAttribute('class', this._names.join(' ')));
          },
          contains: function (e) {
            return this._names.indexOf(e) >= 0;
          },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/clone.js': (e, t, n) => {
      function o() {
        var e = this.cloneNode(!1),
          t = this.parentNode;
        return t ? t.insertBefore(e, this.nextSibling) : e;
      }
      function s() {
        var e = this.cloneNode(!0),
          t = this.parentNode;
        return t ? t.insertBefore(e, this.nextSibling) : e;
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.select(e ? s : o);
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/data.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              if (!arguments.length) return Array.from(this, l);
              var n = t ? a : d,
                s = this._parents,
                c = this._groups;
              'function' != typeof e && (e = (0, i.default)(e));
              for (var u = c.length, f = new Array(u), h = new Array(u), m = new Array(u), p = 0; p < u; ++p) {
                var _ = s[p],
                  g = c[p],
                  v = g.length,
                  b = (0, r.default)(e.call(_, _ && _.__data__, p, s)),
                  y = b.length,
                  j = (h[p] = new Array(y)),
                  w = (f[p] = new Array(y)),
                  x = (m[p] = new Array(v));
                n(_, g, j, w, x, b, t);
                for (var S, A, E = 0, M = 0; E < y; ++E)
                  if ((S = j[E])) {
                    for (E >= M && (M = E + 1); !(A = w[M]) && ++M < y; );
                    S._next = A || null;
                  }
              }
              return ((f = new o.Selection(f, s))._enter = h), (f._exit = m), f;
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/enter.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-selection/src/array.js'),
        i = n('./node_modules/d3-zoom/node_modules/d3-selection/src/constant.js');
      function d(e, t, n, o, r, i) {
        for (var d, a = 0, l = t.length, c = i.length; a < c; ++a) (d = t[a]) ? ((d.__data__ = i[a]), (o[a] = d)) : (n[a] = new s.EnterNode(e, i[a]));
        for (; a < l; ++a) (d = t[a]) && (r[a] = d);
      }
      function a(e, t, n, o, r, i, d) {
        var a,
          l,
          c,
          u = new Map(),
          f = t.length,
          h = i.length,
          m = new Array(f);
        for (a = 0; a < f; ++a) (l = t[a]) && ((m[a] = c = d.call(l, l.__data__, a, t) + ''), u.has(c) ? (r[a] = l) : u.set(c, l));
        for (a = 0; a < h; ++a) (c = d.call(e, i[a], a, i) + ''), (l = u.get(c)) ? ((o[a] = l), (l.__data__ = i[a]), u.delete(c)) : (n[a] = new s.EnterNode(e, i[a]));
        for (a = 0; a < f; ++a) (l = t[a]) && u.get(m[a]) === l && (r[a] = l);
      }
      function l(e) {
        return e.__data__;
      }
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/datum.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length ? this.property('__data__', e) : this.node().__data__;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/dispatch.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return this.each(
                ('function' == typeof t
                  ? function (e, t) {
                      return function () {
                        return s(this, e, t.apply(this, arguments));
                      };
                    }
                  : function (e, t) {
                      return function () {
                        return s(this, e, t);
                      };
                    })(e, t)
              );
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/window.js');
      function s(e, t, n) {
        var s = (0, o.default)(e),
          r = s.CustomEvent;
        'function' == typeof r
          ? (r = new r(t, n))
          : ((r = s.document.createEvent('Event')), n ? (r.initEvent(t, n.bubbles, n.cancelable), (r.detail = n.detail)) : r.initEvent(t, !1, !1)),
          e.dispatchEvent(r);
      }
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/each.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
                for (var s, r = t[n], i = 0, d = r.length; i < d; ++i) (s = r[i]) && e.call(s, s.__data__, i, r);
              return this;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/empty.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return !this.node();
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/enter.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          EnterNode: () => r,
          default: () =>
            function () {
              return new s.Selection(this._enter || this._groups.map(o.default), this._parents);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/sparse.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js');
      function r(e, t) {
        (this.ownerDocument = e.ownerDocument), (this.namespaceURI = e.namespaceURI), (this._next = null), (this._parent = e), (this.__data__ = t);
      }
      r.prototype = {
        constructor: r,
        appendChild: function (e) {
          return this._parent.insertBefore(e, this._next);
        },
        insertBefore: function (e, t) {
          return this._parent.insertBefore(e, t);
        },
        querySelector: function (e) {
          return this._parent.querySelector(e);
        },
        querySelectorAll: function (e) {
          return this._parent.querySelectorAll(e);
        },
      };
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/exit.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return new s.Selection(this._exit || this._groups.map(o.default), this._parents);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/sparse.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/filter.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              'function' != typeof e && (e = (0, s.default)(e));
              for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
                for (var d, a = t[i], l = a.length, c = (r[i] = []), u = 0; u < l; ++u) (d = a[u]) && e.call(d, d.__data__, u, a) && c.push(d);
              return new o.Selection(r, this._parents);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/matcher.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/html.js': (e, t, n) => {
      function o() {
        this.innerHTML = '';
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length
                ? this.each(
                    null == e
                      ? o
                      : ('function' == typeof e
                          ? function (e) {
                              return function () {
                                var t = e.apply(this, arguments);
                                this.innerHTML = null == t ? '' : t;
                              };
                            }
                          : function (e) {
                              return function () {
                                this.innerHTML = e;
                              };
                            })(e)
                  )
                : this.node().innerHTML;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js': (e, t, n) => {
      n.r(t), n.d(t, { Selection: () => B, default: () => D, root: () => q });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/select.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/selectAll.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/selectChild.js'),
        i = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/selectChildren.js'),
        d = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/filter.js'),
        a = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/data.js'),
        l = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/enter.js'),
        c = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/exit.js'),
        u = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/join.js'),
        f = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/merge.js'),
        h = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/order.js'),
        m = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/sort.js'),
        p = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/call.js'),
        _ = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/nodes.js'),
        g = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/node.js'),
        v = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/size.js'),
        b = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/empty.js'),
        y = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/each.js'),
        j = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/attr.js'),
        w = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/style.js'),
        x = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/property.js'),
        S = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/classed.js'),
        A = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/text.js'),
        E = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/html.js'),
        M = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/raise.js'),
        N = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/lower.js'),
        k = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/append.js'),
        z = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/insert.js'),
        P = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/remove.js'),
        C = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/clone.js'),
        T = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/datum.js'),
        I = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/on.js'),
        L = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/dispatch.js'),
        R = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/iterator.js'),
        q = [null];
      function B(e, t) {
        (this._groups = e), (this._parents = t);
      }
      function O() {
        return new B([[document.documentElement]], q);
      }
      B.prototype = O.prototype = {
        constructor: B,
        select: o.default,
        selectAll: s.default,
        selectChild: r.default,
        selectChildren: i.default,
        filter: d.default,
        data: a.default,
        enter: l.default,
        exit: c.default,
        join: u.default,
        merge: f.default,
        selection: function () {
          return this;
        },
        order: h.default,
        sort: m.default,
        call: p.default,
        nodes: _.default,
        node: g.default,
        size: v.default,
        empty: b.default,
        each: y.default,
        attr: j.default,
        style: w.default,
        property: x.default,
        classed: S.default,
        text: A.default,
        html: E.default,
        raise: M.default,
        lower: N.default,
        append: k.default,
        insert: z.default,
        remove: P.default,
        clone: C.default,
        datum: T.default,
        on: I.default,
        dispatch: L.default,
        [Symbol.iterator]: R.default,
      };
      const D = O;
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/insert.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = 'function' == typeof e ? e : (0, o.default)(e),
                i = null == t ? r : 'function' == typeof t ? t : (0, s.default)(t);
              return this.select(function () {
                return this.insertBefore(n.apply(this, arguments), i.apply(this, arguments) || null);
              });
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/creator.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selector.js');
      function r() {
        return null;
      }
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/iterator.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function* () {
              for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var o, s = e[t], r = 0, i = s.length; r < i; ++r) (o = s[r]) && (yield o);
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/join.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var o = this.enter(),
                s = this,
                r = this.exit();
              (o = 'function' == typeof e ? e(o) : o.append(e + '')), null != t && (s = t(s));
              null == n ? r.remove() : n(r);
              return o && s ? o.merge(s).order() : s;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/lower.js': (e, t, n) => {
      function o() {
        this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.each(o);
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/merge.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              if (!(e instanceof o.Selection)) throw new Error('invalid merge');
              for (var t = this._groups, n = e._groups, s = t.length, r = n.length, i = Math.min(s, r), d = new Array(s), a = 0; a < i; ++a)
                for (var l, c = t[a], u = n[a], f = c.length, h = (d[a] = new Array(f)), m = 0; m < f; ++m) (l = c[m] || u[m]) && (h[m] = l);
              for (; a < s; ++a) d[a] = t[a];
              return new o.Selection(d, this._parents);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/node.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
                for (var o = e[t], s = 0, r = o.length; s < r; ++s) {
                  var i = o[s];
                  if (i) return i;
                }
              return null;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/nodes.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return Array.from(this);
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/on.js': (e, t, n) => {
      function o(e) {
        return function () {
          var t = this.__on;
          if (t) {
            for (var n, o = 0, s = -1, r = t.length; o < r; ++o)
              (n = t[o]), (e.type && n.type !== e.type) || n.name !== e.name ? (t[++s] = n) : this.removeEventListener(n.type, n.listener, n.options);
            ++s ? (t.length = s) : delete this.__on;
          }
        };
      }
      function s(e, t, n) {
        return function () {
          var o,
            s = this.__on,
            r = (function (e) {
              return function (t) {
                e.call(this, t, this.__data__);
              };
            })(t);
          if (s)
            for (var i = 0, d = s.length; i < d; ++i)
              if ((o = s[i]).type === e.type && o.name === e.name)
                return this.removeEventListener(o.type, o.listener, o.options), this.addEventListener(o.type, (o.listener = r), (o.options = n)), void (o.value = t);
          this.addEventListener(e.type, r, n), (o = { type: e.type, name: e.name, value: t, listener: r, options: n }), s ? s.push(o) : (this.__on = [o]);
        };
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var r,
                i,
                d = (function (e) {
                  return e
                    .trim()
                    .split(/^|\s+/)
                    .map(function (e) {
                      var t = '',
                        n = e.indexOf('.');
                      return n >= 0 && ((t = e.slice(n + 1)), (e = e.slice(0, n))), { type: e, name: t };
                    });
                })(e + ''),
                a = d.length;
              if (arguments.length < 2) {
                var l = this.node().__on;
                if (l)
                  for (var c, u = 0, f = l.length; u < f; ++u) for (r = 0, c = l[u]; r < a; ++r) if ((i = d[r]).type === c.type && i.name === c.name) return c.value;
                return;
              }
              for (l = t ? s : o, r = 0; r < a; ++r) this.each(l(d[r], t, n));
              return this;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/order.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              for (var e = this._groups, t = -1, n = e.length; ++t < n; )
                for (var o, s = e[t], r = s.length - 1, i = s[r]; --r >= 0; )
                  (o = s[r]) && (i && 4 ^ o.compareDocumentPosition(i) && i.parentNode.insertBefore(o, i), (i = o));
              return this;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/property.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return arguments.length > 1
                ? this.each(
                    (null == t
                      ? function (e) {
                          return function () {
                            delete this[e];
                          };
                        }
                      : 'function' == typeof t
                        ? function (e, t) {
                            return function () {
                              var n = t.apply(this, arguments);
                              null == n ? delete this[e] : (this[e] = n);
                            };
                          }
                        : function (e, t) {
                            return function () {
                              this[e] = t;
                            };
                          })(e, t)
                  )
                : this.node()[e];
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/raise.js': (e, t, n) => {
      function o() {
        this.nextSibling && this.parentNode.appendChild(this);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.each(o);
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/remove.js': (e, t, n) => {
      function o() {
        var e = this.parentNode;
        e && e.removeChild(this);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.each(o);
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/select.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              'function' != typeof e && (e = (0, s.default)(e));
              for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
                for (var d, a, l = t[i], c = l.length, u = (r[i] = new Array(c)), f = 0; f < c; ++f)
                  (d = l[f]) && (a = e.call(d, d.__data__, f, l)) && ('__data__' in d && (a.__data__ = d.__data__), (u[f] = a));
              return new o.Selection(r, this._parents);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selector.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/selectAll.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              e =
                'function' == typeof e
                  ? (function (e) {
                      return function () {
                        var t = e.apply(this, arguments);
                        return null == t ? [] : (0, s.default)(t);
                      };
                    })(e)
                  : (0, r.default)(e);
              for (var t = this._groups, n = t.length, i = [], d = [], a = 0; a < n; ++a)
                for (var l, c = t[a], u = c.length, f = 0; f < u; ++f) (l = c[f]) && (i.push(e.call(l, l.__data__, f, c)), d.push(l));
              return new o.Selection(i, d);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/array.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selectorAll.js');
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/selectChild.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.select(
                null == e
                  ? r
                  : (function (e) {
                      return function () {
                        return s.call(this.children, e);
                      };
                    })('function' == typeof e ? e : (0, o.childMatcher)(e))
              );
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/matcher.js'),
        s = Array.prototype.find;
      function r() {
        return this.firstElementChild;
      }
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/selectChildren.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.selectAll(
                null == e
                  ? r
                  : (function (e) {
                      return function () {
                        return s.call(this.children, e);
                      };
                    })('function' == typeof e ? e : (0, o.childMatcher)(e))
              );
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/matcher.js'),
        s = Array.prototype.filter;
      function r() {
        return this.children;
      }
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/size.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              let e = 0;
              for (const t of this) ++e;
              return e;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/sort.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              e || (e = s);
              function t(t, n) {
                return t && n ? e(t.__data__, n.__data__) : !t - !n;
              }
              for (var n = this._groups, r = n.length, i = new Array(r), d = 0; d < r; ++d) {
                for (var a, l = n[d], c = l.length, u = (i[d] = new Array(c)), f = 0; f < c; ++f) (a = l[f]) && (u[f] = a);
                u.sort(t);
              }
              return new o.Selection(i, this._parents).order();
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js');
      function s(e, t) {
        return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
      }
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/sparse.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return new Array(e.length);
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/style.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              return arguments.length > 1
                ? this.each(
                    (null == t
                      ? function (e) {
                          return function () {
                            this.style.removeProperty(e);
                          };
                        }
                      : 'function' == typeof t
                        ? function (e, t, n) {
                            return function () {
                              var o = t.apply(this, arguments);
                              null == o ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
                            };
                          }
                        : function (e, t, n) {
                            return function () {
                              this.style.setProperty(e, t, n);
                            };
                          })(e, t, null == n ? '' : n)
                  )
                : s(this.node(), e);
            },
          styleValue: () => s,
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/window.js');
      function s(e, t) {
        return e.style.getPropertyValue(t) || (0, o.default)(e).getComputedStyle(e, null).getPropertyValue(t);
      }
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selection/text.js': (e, t, n) => {
      function o() {
        this.textContent = '';
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length
                ? this.each(
                    null == e
                      ? o
                      : ('function' == typeof e
                          ? function (e) {
                              return function () {
                                var t = e.apply(this, arguments);
                                this.textContent = null == t ? '' : t;
                              };
                            }
                          : function (e) {
                              return function () {
                                this.textContent = e;
                              };
                            })(e)
                  )
                : this.node().textContent;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selector.js': (e, t, n) => {
      function o() {}
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return null == e
                ? o
                : function () {
                    return this.querySelector(e);
                  };
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/selectorAll.js': (e, t, n) => {
      function o() {
        return [];
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return null == e
                ? o
                : function () {
                    return this.querySelectorAll(e);
                  };
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/sourceEvent.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              let t;
              for (; (t = e.sourceEvent); ) e = t;
              return e;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-selection/src/window.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return (e.ownerDocument && e.ownerDocument.defaultView) || (e.document && e) || e.defaultView;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/active.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n,
                i,
                d = e.__transition;
              if (d) for (i in ((t = null == t ? null : t + ''), d)) if ((n = d[i]).state > s.SCHEDULED && n.name === t) return new o.Transition([[e]], r, t, +i);
              return null;
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js'),
        r = [null];
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/index.js': (e, t, n) => {
      n.r(t), n.d(t, { active: () => s.default, interrupt: () => r.default, transition: () => o.default });
      n('./node_modules/d3-zoom/node_modules/d3-transition/src/selection/index.js');
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-transition/src/active.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-transition/src/interrupt.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/interrupt.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n,
                s,
                r,
                i = e.__transition,
                d = !0;
              if (!i) return;
              for (r in ((t = null == t ? null : t + ''), i))
                (n = i[r]).name === t
                  ? ((s = n.state > o.STARTING && n.state < o.ENDING),
                    (n.state = o.ENDED),
                    n.timer.stop(),
                    n.on.call(s ? 'interrupt' : 'cancel', e, e.__data__, n.index, n.group),
                    delete i[r])
                  : (d = !1);
              d && delete e.__transition;
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/selection/index.js': (e, t, n) => {
      n.r(t);
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-transition/src/selection/interrupt.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-transition/src/selection/transition.js');
      (o.default.prototype.interrupt = s.default), (o.default.prototype.transition = r.default);
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/selection/interrupt.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.each(function () {
                (0, o.default)(this, e);
              });
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/interrupt.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/selection/transition.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t, n;
              e instanceof o.Transition ? ((t = e._id), (e = e._name)) : ((t = (0, o.newId)()), ((n = d).time = (0, i.now)()), (e = null == e ? null : e + ''));
              for (var r = this._groups, l = r.length, c = 0; c < l; ++c)
                for (var u, f = r[c], h = f.length, m = 0; m < h; ++m) (u = f[m]) && (0, s.default)(u, e, t, m, f, n || a(u, t));
              return new o.Transition(r, this._parents, e, t);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js'),
        r = n('./node_modules/d3-ease/src/cubic.js'),
        i = n('./node_modules/d3-timer/src/timer.js'),
        d = { time: null, delay: 0, duration: 250, ease: r.cubicInOut };
      function a(e, t) {
        for (var n; !(n = e.__transition) || !(n = n[t]); ) if (!(e = e.parentNode)) throw new Error(`transition ${t} not found`);
        return n;
      }
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/attr.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = (0, s.default)(e),
                d = 'transform' === n ? o.interpolateTransformSvg : i.default;
              return this.attrTween(
                e,
                'function' == typeof t
                  ? (n.local
                      ? function (e, t, n) {
                          var o, s, r;
                          return function () {
                            var i,
                              d,
                              a = n(this);
                            if (null != a)
                              return (i = this.getAttributeNS(e.space, e.local)) === (d = a + '') ? null : i === o && d === s ? r : ((s = d), (r = t((o = i), a)));
                            this.removeAttributeNS(e.space, e.local);
                          };
                        }
                      : function (e, t, n) {
                          var o, s, r;
                          return function () {
                            var i,
                              d,
                              a = n(this);
                            if (null != a) return (i = this.getAttribute(e)) === (d = a + '') ? null : i === o && d === s ? r : ((s = d), (r = t((o = i), a)));
                            this.removeAttribute(e);
                          };
                        })(n, d, (0, r.tweenValue)(this, 'attr.' + e, t))
                  : null == t
                    ? (n.local
                        ? function (e) {
                            return function () {
                              this.removeAttributeNS(e.space, e.local);
                            };
                          }
                        : function (e) {
                            return function () {
                              this.removeAttribute(e);
                            };
                          })(n)
                    : (n.local
                        ? function (e, t, n) {
                            var o,
                              s,
                              r = n + '';
                            return function () {
                              var i = this.getAttributeNS(e.space, e.local);
                              return i === r ? null : i === o ? s : (s = t((o = i), n));
                            };
                          }
                        : function (e, t, n) {
                            var o,
                              s,
                              r = n + '';
                            return function () {
                              var i = this.getAttribute(e);
                              return i === r ? null : i === o ? s : (s = t((o = i), n));
                            };
                          })(n, d, t)
              );
            },
        });
      var o = n('./node_modules/d3-interpolate/src/transform/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/namespace.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/tween.js'),
        i = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/interpolate.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/attrTween.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = 'attr.' + e;
              if (arguments.length < 2) return (n = this.tween(n)) && n._value;
              if (null == t) return this.tween(n, null);
              if ('function' != typeof t) throw new Error();
              var s = (0, o.default)(e);
              return this.tween(
                n,
                (s.local
                  ? function (e, t) {
                      var n, o;
                      function s() {
                        var s = t.apply(this, arguments);
                        return (
                          s !== o &&
                            (n =
                              (o = s) &&
                              (function (e, t) {
                                return function (n) {
                                  this.setAttributeNS(e.space, e.local, t.call(this, n));
                                };
                              })(e, s)),
                          n
                        );
                      }
                      return (s._value = t), s;
                    }
                  : function (e, t) {
                      var n, o;
                      function s() {
                        var s = t.apply(this, arguments);
                        return (
                          s !== o &&
                            (n =
                              (o = s) &&
                              (function (e, t) {
                                return function (n) {
                                  this.setAttribute(e, t.call(this, n));
                                };
                              })(e, s)),
                          n
                        );
                      }
                      return (s._value = t), s;
                    })(s, t)
              );
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/namespace.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/delay.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._id;
              return arguments.length
                ? this.each(
                    ('function' == typeof e
                      ? function (e, t) {
                          return function () {
                            (0, o.init)(this, e).delay = +t.apply(this, arguments);
                          };
                        }
                      : function (e, t) {
                          return (
                            (t = +t),
                            function () {
                              (0, o.init)(this, e).delay = t;
                            }
                          );
                        })(t, e)
                  )
                : (0, o.get)(this.node(), t).delay;
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/duration.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._id;
              return arguments.length
                ? this.each(
                    ('function' == typeof e
                      ? function (e, t) {
                          return function () {
                            (0, o.set)(this, e).duration = +t.apply(this, arguments);
                          };
                        }
                      : function (e, t) {
                          return (
                            (t = +t),
                            function () {
                              (0, o.set)(this, e).duration = t;
                            }
                          );
                        })(t, e)
                  )
                : (0, o.get)(this.node(), t).duration;
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/ease.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._id;
              return arguments.length
                ? this.each(
                    (function (e, t) {
                      if ('function' != typeof t) throw new Error();
                      return function () {
                        (0, o.set)(this, e).ease = t;
                      };
                    })(t, e)
                  )
                : (0, o.get)(this.node(), t).ease;
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/easeVarying.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              if ('function' != typeof e) throw new Error();
              return this.each(
                (function (e, t) {
                  return function () {
                    var n = t.apply(this, arguments);
                    if ('function' != typeof n) throw new Error();
                    (0, o.set)(this, e).ease = n;
                  };
                })(this._id, e)
              );
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/end.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e,
                t,
                n = this,
                s = n._id,
                r = n.size();
              return new Promise(function (i, d) {
                var a = { value: d },
                  l = {
                    value: function () {
                      0 == --r && i();
                    },
                  };
                n.each(function () {
                  var n = (0, o.set)(this, s),
                    r = n.on;
                  r !== e && ((t = (e = r).copy())._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), (n.on = t);
                }),
                  0 === r && i();
              });
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/filter.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              'function' != typeof e && (e = (0, o.default)(e));
              for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
                for (var d, a = t[i], l = a.length, c = (r[i] = []), u = 0; u < l; ++u) (d = a[u]) && e.call(d, d.__data__, u, a) && c.push(d);
              return new s.Transition(r, this._parents, this._name, this._id);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/matcher.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/index.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/index.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          Transition: () => A,
          default: () => E,
          newId: () =>
            function () {
              return ++S;
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/attr.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/attrTween.js'),
        i = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/delay.js'),
        d = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/duration.js'),
        a = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/ease.js'),
        l = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/easeVarying.js'),
        c = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/filter.js'),
        u = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/merge.js'),
        f = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/on.js'),
        h = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/remove.js'),
        m = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/select.js'),
        p = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/selectAll.js'),
        _ = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/selection.js'),
        g = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/style.js'),
        v = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/styleTween.js'),
        b = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/text.js'),
        y = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/textTween.js'),
        j = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/transition.js'),
        w = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/tween.js'),
        x = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/end.js'),
        S = 0;
      function A(e, t, n, o) {
        (this._groups = e), (this._parents = t), (this._name = n), (this._id = o);
      }
      function E(e) {
        return (0, o.default)().transition(e);
      }
      var M = o.default.prototype;
      A.prototype = E.prototype = {
        constructor: A,
        select: m.default,
        selectAll: p.default,
        filter: c.default,
        merge: u.default,
        selection: _.default,
        transition: j.default,
        call: M.call,
        nodes: M.nodes,
        node: M.node,
        size: M.size,
        empty: M.empty,
        each: M.each,
        on: f.default,
        attr: s.default,
        attrTween: r.default,
        style: g.default,
        styleTween: v.default,
        text: b.default,
        textTween: y.default,
        remove: h.default,
        tween: w.default,
        delay: i.default,
        duration: d.default,
        ease: a.default,
        easeVarying: l.default,
        end: x.default,
        [Symbol.iterator]: M[Symbol.iterator],
      };
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/interpolate.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n;
              return ('number' == typeof t ? s.default : t instanceof o.default ? r.default : (n = (0, o.default)(t)) ? ((t = n), r.default) : i.default)(e, t);
            },
        });
      var o = n('./node_modules/d3-color/src/color.js'),
        s = n('./node_modules/d3-interpolate/src/number.js'),
        r = n('./node_modules/d3-interpolate/src/rgb.js'),
        i = n('./node_modules/d3-interpolate/src/string.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/merge.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              if (e._id !== this._id) throw new Error();
              for (var t = this._groups, n = e._groups, s = t.length, r = n.length, i = Math.min(s, r), d = new Array(s), a = 0; a < i; ++a)
                for (var l, c = t[a], u = n[a], f = c.length, h = (d[a] = new Array(f)), m = 0; m < f; ++m) (l = c[m] || u[m]) && (h[m] = l);
              for (; a < s; ++a) d[a] = t[a];
              return new o.Transition(d, this._parents, this._name, this._id);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/index.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/on.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = this._id;
              return arguments.length < 2
                ? (0, o.get)(this.node(), n).on.on(e)
                : this.each(
                    (function (e, t, n) {
                      var s,
                        r,
                        i = (function (e) {
                          return (e + '')
                            .trim()
                            .split(/^|\s+/)
                            .every(function (e) {
                              var t = e.indexOf('.');
                              return t >= 0 && (e = e.slice(0, t)), !e || 'start' === e;
                            });
                        })(t)
                          ? o.init
                          : o.set;
                      return function () {
                        var o = i(this, e),
                          d = o.on;
                        d !== s && (r = (s = d).copy()).on(t, n), (o.on = r);
                      };
                    })(n, e, t)
                  );
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/remove.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.on(
                'end.remove',
                ((e = this._id),
                function () {
                  var t = this.parentNode;
                  for (var n in this.__transition) if (+n !== e) return;
                  t && t.removeChild(this);
                })
              );
              var e;
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          CREATED: () => a,
          ENDED: () => m,
          ENDING: () => h,
          RUNNING: () => f,
          SCHEDULED: () => l,
          STARTED: () => u,
          STARTING: () => c,
          default: () =>
            function (e, t, n, o, p, _) {
              var g = e.__transition;
              if (g) {
                if (n in g) return;
              } else e.__transition = {};
              !(function (e, t, n) {
                var o,
                  i = e.__transition;
                function d(s) {
                  var h, _, g, v;
                  if (n.state !== l) return p();
                  for (h in i)
                    if ((v = i[h]).name === n.name) {
                      if (v.state === u) return (0, r.default)(d);
                      v.state === f
                        ? ((v.state = m), v.timer.stop(), v.on.call('interrupt', e, e.__data__, v.index, v.group), delete i[h])
                        : +h < t && ((v.state = m), v.timer.stop(), v.on.call('cancel', e, e.__data__, v.index, v.group), delete i[h]);
                    }
                  if (
                    ((0, r.default)(function () {
                      n.state === u && ((n.state = f), n.timer.restart(a, n.delay, n.time), a(s));
                    }),
                    (n.state = c),
                    n.on.call('start', e, e.__data__, n.index, n.group),
                    n.state === c)
                  ) {
                    for (n.state = u, o = new Array((g = n.tween.length)), h = 0, _ = -1; h < g; ++h)
                      (v = n.tween[h].value.call(e, e.__data__, n.index, n.group)) && (o[++_] = v);
                    o.length = _ + 1;
                  }
                }
                function a(t) {
                  for (var s = t < n.duration ? n.ease.call(null, t / n.duration) : (n.timer.restart(p), (n.state = h), 1), r = -1, i = o.length; ++r < i; )
                    o[r].call(e, s);
                  n.state === h && (n.on.call('end', e, e.__data__, n.index, n.group), p());
                }
                function p() {
                  for (var o in ((n.state = m), n.timer.stop(), delete i[t], i)) return;
                  delete e.__transition;
                }
                (i[t] = n),
                  (n.timer = (0, s.timer)(
                    function (e) {
                      (n.state = l), n.timer.restart(d, n.delay, n.time), n.delay <= e && d(e - n.delay);
                    },
                    0,
                    n.time
                  ));
              })(e, n, { name: t, index: o, group: p, on: i, tween: d, time: _.time, delay: _.delay, duration: _.duration, ease: _.ease, timer: null, state: a });
            },
          get: () => p,
          init: () =>
            function (e, t) {
              var n = p(e, t);
              if (n.state > a) throw new Error('too late; already scheduled');
              return n;
            },
          set: () =>
            function (e, t) {
              var n = p(e, t);
              if (n.state > u) throw new Error('too late; already running');
              return n;
            },
        });
      var o = n('./node_modules/d3-dispatch/src/index.js'),
        s = n('./node_modules/d3-timer/src/timer.js'),
        r = n('./node_modules/d3-timer/src/timeout.js'),
        i = (0, o.dispatch)('start', 'end', 'cancel', 'interrupt'),
        d = [],
        a = 0,
        l = 1,
        c = 2,
        u = 3,
        f = 4,
        h = 5,
        m = 6;
      function p(e, t) {
        var n = e.__transition;
        if (!n || !(n = n[t])) throw new Error('transition not found');
        return n;
      }
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/select.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._name,
                n = this._id;
              'function' != typeof e && (e = (0, o.default)(e));
              for (var i = this._groups, d = i.length, a = new Array(d), l = 0; l < d; ++l)
                for (var c, u, f = i[l], h = f.length, m = (a[l] = new Array(h)), p = 0; p < h; ++p)
                  (c = f[p]) &&
                    (u = e.call(c, c.__data__, p, f)) &&
                    ('__data__' in c && (u.__data__ = c.__data__), (m[p] = u), (0, r.default)(m[p], t, n, p, m, (0, r.get)(c, n)));
              return new s.Transition(a, this._parents, t, n);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selector.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/index.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/selectAll.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._name,
                n = this._id;
              'function' != typeof e && (e = (0, o.default)(e));
              for (var i = this._groups, d = i.length, a = [], l = [], c = 0; c < d; ++c)
                for (var u, f = i[c], h = f.length, m = 0; m < h; ++m)
                  if ((u = f[m])) {
                    for (var p, _ = e.call(u, u.__data__, m, f), g = (0, r.get)(u, n), v = 0, b = _.length; v < b; ++v)
                      (p = _[v]) && (0, r.default)(p, t, n, v, _, g);
                    a.push(_), l.push(u);
                  }
              return new s.Transition(a, l, t, n);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selectorAll.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/index.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/selection.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return new o(this._groups, this._parents);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/index.js').default.prototype.constructor;
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/style.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var l = 'transform' == (e += '') ? o.interpolateTransformCss : d.default;
              return null == t
                ? this.styleTween(
                    e,
                    (function (e, t) {
                      var n, o, r;
                      return function () {
                        var i = (0, s.styleValue)(this, e),
                          d = (this.style.removeProperty(e), (0, s.styleValue)(this, e));
                        return i === d ? null : i === n && d === o ? r : (r = t((n = i), (o = d)));
                      };
                    })(e, l)
                  ).on('end.style.' + e, a(e))
                : 'function' == typeof t
                  ? this.styleTween(
                      e,
                      (function (e, t, n) {
                        var o, r, i;
                        return function () {
                          var d = (0, s.styleValue)(this, e),
                            a = n(this),
                            l = a + '';
                          return (
                            null == a && (this.style.removeProperty(e), (l = a = (0, s.styleValue)(this, e))),
                            d === l ? null : d === o && l === r ? i : ((r = l), (i = t((o = d), a)))
                          );
                        };
                      })(e, l, (0, i.tweenValue)(this, 'style.' + e, t))
                    ).each(
                      (function (e, t) {
                        var n,
                          o,
                          s,
                          i,
                          d = 'style.' + t,
                          l = 'end.' + d;
                        return function () {
                          var c = (0, r.set)(this, e),
                            u = c.on,
                            f = null == c.value[d] ? i || (i = a(t)) : void 0;
                          (u === n && s === f) || (o = (n = u).copy()).on(l, (s = f)), (c.on = o);
                        };
                      })(this._id, e)
                    )
                  : this.styleTween(
                      e,
                      (function (e, t, n) {
                        var o,
                          r,
                          i = n + '';
                        return function () {
                          var d = (0, s.styleValue)(this, e);
                          return d === i ? null : d === o ? r : (r = t((o = d), n));
                        };
                      })(e, l, t),
                      n
                    ).on('end.style.' + e, null);
            },
        });
      var o = n('./node_modules/d3-interpolate/src/transform/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-selection/src/selection/style.js'),
        r = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js'),
        i = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/tween.js'),
        d = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/interpolate.js');
      function a(e) {
        return function () {
          this.style.removeProperty(e);
        };
      }
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/styleTween.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var o = 'style.' + (e += '');
              if (arguments.length < 2) return (o = this.tween(o)) && o._value;
              if (null == t) return this.tween(o, null);
              if ('function' != typeof t) throw new Error();
              return this.tween(
                o,
                (function (e, t, n) {
                  var o, s;
                  function r() {
                    var r = t.apply(this, arguments);
                    return (
                      r !== s &&
                        (o =
                          (s = r) &&
                          (function (e, t, n) {
                            return function (o) {
                              this.style.setProperty(e, t.call(this, o), n);
                            };
                          })(e, r, n)),
                      o
                    );
                  }
                  return (r._value = t), r;
                })(e, t, null == n ? '' : n)
              );
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/text.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.tween(
                'text',
                'function' == typeof e
                  ? (function (e) {
                      return function () {
                        var t = e(this);
                        this.textContent = null == t ? '' : t;
                      };
                    })((0, o.tweenValue)(this, 'text', e))
                  : (function (e) {
                      return function () {
                        this.textContent = e;
                      };
                    })(null == e ? '' : e + '')
              );
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/tween.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/textTween.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = 'text';
              if (arguments.length < 1) return (t = this.tween(t)) && t._value;
              if (null == e) return this.tween(t, null);
              if ('function' != typeof e) throw new Error();
              return this.tween(
                t,
                (function (e) {
                  var t, n;
                  function o() {
                    var o = e.apply(this, arguments);
                    return (
                      o !== n &&
                        (t =
                          (n = o) &&
                          (function (e) {
                            return function (t) {
                              this.textContent = e.call(this, t);
                            };
                          })(o)),
                      t
                    );
                  }
                  return (o._value = e), o;
                })(e)
              );
            },
        });
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/transition.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              for (var e = this._name, t = this._id, n = (0, o.newId)(), r = this._groups, i = r.length, d = 0; d < i; ++d)
                for (var a, l = r[d], c = l.length, u = 0; u < c; ++u)
                  if ((a = l[u])) {
                    var f = (0, s.get)(a, t);
                    (0, s.default)(a, e, n, u, l, { time: f.time + f.delay + f.duration, delay: 0, duration: f.duration, ease: f.ease });
                  }
              return new o.Transition(r, this._parents, e, n);
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/index.js'),
        s = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/node_modules/d3-transition/src/transition/tween.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = this._id;
              if (((e += ''), arguments.length < 2)) {
                for (var s, r = (0, o.get)(this.node(), n).tween, i = 0, d = r.length; i < d; ++i) if ((s = r[i]).name === e) return s.value;
                return null;
              }
              return this.each(
                (null == t
                  ? function (e, t) {
                      var n, s;
                      return function () {
                        var r = (0, o.set)(this, e),
                          i = r.tween;
                        if (i !== n) {
                          s = n = i;
                          for (var d = 0, a = s.length; d < a; ++d)
                            if (s[d].name === t) {
                              (s = s.slice()).splice(d, 1);
                              break;
                            }
                        }
                        r.tween = s;
                      };
                    }
                  : function (e, t, n) {
                      var s, r;
                      if ('function' != typeof n) throw new Error();
                      return function () {
                        var i = (0, o.set)(this, e),
                          d = i.tween;
                        if (d !== s) {
                          r = (s = d).slice();
                          for (var a = { name: t, value: n }, l = 0, c = r.length; l < c; ++l)
                            if (r[l].name === t) {
                              r[l] = a;
                              break;
                            }
                          l === c && r.push(a);
                        }
                        i.tween = r;
                      };
                    })(n, e, t)
              );
            },
          tweenValue: () =>
            function (e, t, n) {
              var s = e._id;
              return (
                e.each(function () {
                  var e = (0, o.set)(this, s);
                  (e.value || (e.value = {}))[t] = n.apply(this, arguments);
                }),
                function (e) {
                  return (0, o.get)(e, s).value[t];
                }
              );
            },
        });
      var o = n('./node_modules/d3-zoom/node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-zoom/src/constant.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => o });
      const o = (e) => () => e;
    },
    './node_modules/d3-zoom/src/event.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, { sourceEvent: t, target: n, transform: o, dispatch: s }) {
              Object.defineProperties(this, {
                type: { value: e, enumerable: !0, configurable: !0 },
                sourceEvent: { value: t, enumerable: !0, configurable: !0 },
                target: { value: n, enumerable: !0, configurable: !0 },
                transform: { value: o, enumerable: !0, configurable: !0 },
                _: { value: s },
              });
            },
        });
    },
    './node_modules/d3-zoom/src/index.js': (e, t, n) => {
      n.r(t), n.d(t, { zoom: () => o.default, zoomIdentity: () => s.identity, zoomTransform: () => s.default });
      var o = n('./node_modules/d3-zoom/src/zoom.js'),
        s = n('./node_modules/d3-zoom/src/transform.js');
    },
    './node_modules/d3-zoom/src/noevent.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              e.preventDefault(), e.stopImmediatePropagation();
            },
          nopropagation: () =>
            function (e) {
              e.stopImmediatePropagation();
            },
        });
    },
    './node_modules/d3-zoom/src/transform.js': (e, t, n) => {
      function o(e, t, n) {
        (this.k = e), (this.x = t), (this.y = n);
      }
      n.r(t),
        n.d(t, { Transform: () => o, default: () => r, identity: () => s }),
        (o.prototype = {
          constructor: o,
          scale: function (e) {
            return 1 === e ? this : new o(this.k * e, this.x, this.y);
          },
          translate: function (e, t) {
            return (0 === e) & (0 === t) ? this : new o(this.k, this.x + this.k * e, this.y + this.k * t);
          },
          apply: function (e) {
            return [e[0] * this.k + this.x, e[1] * this.k + this.y];
          },
          applyX: function (e) {
            return e * this.k + this.x;
          },
          applyY: function (e) {
            return e * this.k + this.y;
          },
          invert: function (e) {
            return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
          },
          invertX: function (e) {
            return (e - this.x) / this.k;
          },
          invertY: function (e) {
            return (e - this.y) / this.k;
          },
          rescaleX: function (e) {
            return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
          },
          rescaleY: function (e) {
            return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
          },
          toString: function () {
            return 'translate(' + this.x + ',' + this.y + ') scale(' + this.k + ')';
          },
        });
      var s = new o(1, 0, 0);
      function r(e) {
        for (; !e.__zoom; ) if (!(e = e.parentNode)) return s;
        return e.__zoom;
      }
      r.prototype = o.prototype;
    },
    './node_modules/d3-zoom/src/zoom.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e,
                t,
                n,
                b = h,
                y = m,
                j = v,
                w = _,
                x = g,
                S = [0, 1 / 0],
                A = [
                  [-1 / 0, -1 / 0],
                  [1 / 0, 1 / 0],
                ],
                E = 250,
                M = r.default,
                N = (0, o.dispatch)('start', 'zoom', 'end'),
                k = 500,
                z = 150,
                P = 0,
                C = 10;
              function T(e) {
                e.property('__zoom', p)
                  .on('wheel.zoom', D)
                  .on('mousedown.zoom', $)
                  .on('dblclick.zoom', H)
                  .filter(x)
                  .on('touchstart.zoom', V)
                  .on('touchmove.zoom', G)
                  .on('touchend.zoom touchcancel.zoom', U)
                  .style('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
              }
              function I(e, t) {
                return (t = Math.max(S[0], Math.min(S[1], t))) === e.k ? e : new u.Transform(t, e.x, e.y);
              }
              function L(e, t, n) {
                var o = t[0] - n[0] * e.k,
                  s = t[1] - n[1] * e.k;
                return o === e.x && s === e.y ? e : new u.Transform(e.k, o, s);
              }
              function R(e) {
                return [(+e[0][0] + +e[1][0]) / 2, (+e[0][1] + +e[1][1]) / 2];
              }
              function q(e, t, n, o) {
                e.on('start.zoom', function () {
                  B(this, arguments).event(o).start();
                })
                  .on('interrupt.zoom end.zoom', function () {
                    B(this, arguments).event(o).end();
                  })
                  .tween('zoom', function () {
                    var e = arguments,
                      s = B(this, e).event(o),
                      r = y.apply(this, e),
                      i = null == n ? R(r) : 'function' == typeof n ? n.apply(this, e) : n,
                      d = Math.max(r[1][0] - r[0][0], r[1][1] - r[0][1]),
                      a = this.__zoom,
                      l = 'function' == typeof t ? t.apply(this, e) : t,
                      c = M(a.invert(i).concat(d / a.k), l.invert(i).concat(d / l.k));
                    return function (e) {
                      if (1 === e) e = l;
                      else {
                        var t = c(e),
                          n = d / t[2];
                        e = new u.Transform(n, i[0] - t[0] * n, i[1] - t[1] * n);
                      }
                      s.zoom(null, e);
                    };
                  });
              }
              function B(e, t, n) {
                return (!n && e.__zooming) || new O(e, t);
              }
              function O(e, t) {
                (this.that = e), (this.args = t), (this.active = 0), (this.sourceEvent = null), (this.extent = y.apply(e, t)), (this.taps = 0);
              }
              function D(e, ...t) {
                if (b.apply(this, arguments)) {
                  var n = B(this, t).event(e),
                    o = this.__zoom,
                    s = Math.max(S[0], Math.min(S[1], o.k * Math.pow(2, w.apply(this, arguments)))),
                    r = (0, d.default)(e);
                  if (n.wheel) (n.mouse[0][0] === r[0] && n.mouse[0][1] === r[1]) || (n.mouse[1] = o.invert((n.mouse[0] = r))), clearTimeout(n.wheel);
                  else {
                    if (o.k === s) return;
                    (n.mouse = [r, o.invert(r)]), (0, a.interrupt)(this), n.start();
                  }
                  (0, f.default)(e),
                    (n.wheel = setTimeout(function () {
                      (n.wheel = null), n.end();
                    }, z)),
                    n.zoom('mouse', j(L(I(o, s), n.mouse[0], n.mouse[1]), n.extent, A));
                }
              }
              function $(e, ...t) {
                if (!n && b.apply(this, arguments)) {
                  var o = B(this, t, !0).event(e),
                    r = (0, i.default)(e.view)
                      .on(
                        'mousemove.zoom',
                        function (e) {
                          if (((0, f.default)(e), !o.moved)) {
                            var t = e.clientX - u,
                              n = e.clientY - h;
                            o.moved = t * t + n * n > P;
                          }
                          o.event(e).zoom('mouse', j(L(o.that.__zoom, (o.mouse[0] = (0, d.default)(e, c)), o.mouse[1]), o.extent, A));
                        },
                        !0
                      )
                      .on(
                        'mouseup.zoom',
                        function (e) {
                          r.on('mousemove.zoom mouseup.zoom', null), (0, s.yesdrag)(e.view, o.moved), (0, f.default)(e), o.event(e).end();
                        },
                        !0
                      ),
                    l = (0, d.default)(e, c),
                    c = e.currentTarget,
                    u = e.clientX,
                    h = e.clientY;
                  (0, s.default)(e.view), (0, f.nopropagation)(e), (o.mouse = [l, this.__zoom.invert(l)]), (0, a.interrupt)(this), o.start();
                }
              }
              function H(e, ...t) {
                if (b.apply(this, arguments)) {
                  var n = this.__zoom,
                    o = (0, d.default)(e.changedTouches ? e.changedTouches[0] : e, this),
                    s = n.invert(o),
                    r = n.k * (e.shiftKey ? 0.5 : 2),
                    a = j(L(I(n, r), o, s), y.apply(this, t), A);
                  (0, f.default)(e), E > 0 ? (0, i.default)(this).transition().duration(E).call(q, a, o, e) : (0, i.default)(this).call(T.transform, a, o, e);
                }
              }
              function V(n, ...o) {
                if (b.apply(this, arguments)) {
                  var s,
                    r,
                    i,
                    l,
                    c = n.touches,
                    u = c.length,
                    h = B(this, o, n.changedTouches.length === u).event(n);
                  for ((0, f.nopropagation)(n), r = 0; r < u; ++r)
                    (i = c[r]),
                      (l = [(l = (0, d.default)(i, this)), this.__zoom.invert(l), i.identifier]),
                      h.touch0 ? h.touch1 || h.touch0[2] === l[2] || ((h.touch1 = l), (h.taps = 0)) : ((h.touch0 = l), (s = !0), (h.taps = 1 + !!e));
                  e && (e = clearTimeout(e)),
                    s &&
                      (h.taps < 2 &&
                        ((t = l[0]),
                        (e = setTimeout(function () {
                          e = null;
                        }, k))),
                      (0, a.interrupt)(this),
                      h.start());
                }
              }
              function G(e, ...t) {
                if (this.__zooming) {
                  var n,
                    o,
                    s,
                    r,
                    i = B(this, t).event(e),
                    a = e.changedTouches,
                    l = a.length;
                  for ((0, f.default)(e), n = 0; n < l; ++n)
                    (o = a[n]),
                      (s = (0, d.default)(o, this)),
                      i.touch0 && i.touch0[2] === o.identifier ? (i.touch0[0] = s) : i.touch1 && i.touch1[2] === o.identifier && (i.touch1[0] = s);
                  if (((o = i.that.__zoom), i.touch1)) {
                    var c = i.touch0[0],
                      u = i.touch0[1],
                      h = i.touch1[0],
                      m = i.touch1[1],
                      p = (p = h[0] - c[0]) * p + (p = h[1] - c[1]) * p,
                      _ = (_ = m[0] - u[0]) * _ + (_ = m[1] - u[1]) * _;
                    (o = I(o, Math.sqrt(p / _))), (s = [(c[0] + h[0]) / 2, (c[1] + h[1]) / 2]), (r = [(u[0] + m[0]) / 2, (u[1] + m[1]) / 2]);
                  } else {
                    if (!i.touch0) return;
                    (s = i.touch0[0]), (r = i.touch0[1]);
                  }
                  i.zoom('touch', j(L(o, s, r), i.extent, A));
                }
              }
              function U(e, ...o) {
                if (this.__zooming) {
                  var s,
                    r,
                    a = B(this, o).event(e),
                    l = e.changedTouches,
                    c = l.length;
                  for (
                    (0, f.nopropagation)(e),
                      n && clearTimeout(n),
                      n = setTimeout(function () {
                        n = null;
                      }, k),
                      s = 0;
                    s < c;
                    ++s
                  )
                    (r = l[s]), a.touch0 && a.touch0[2] === r.identifier ? delete a.touch0 : a.touch1 && a.touch1[2] === r.identifier && delete a.touch1;
                  if ((a.touch1 && !a.touch0 && ((a.touch0 = a.touch1), delete a.touch1), a.touch0)) a.touch0[1] = this.__zoom.invert(a.touch0[0]);
                  else if ((a.end(), 2 === a.taps && ((r = (0, d.default)(r, this)), Math.hypot(t[0] - r[0], t[1] - r[1]) < C))) {
                    var u = (0, i.default)(this).on('dblclick.zoom');
                    u && u.apply(this, arguments);
                  }
                }
              }
              return (
                (T.transform = function (e, t, n, o) {
                  var s = e.selection ? e.selection() : e;
                  s.property('__zoom', p),
                    e !== s
                      ? q(e, t, n, o)
                      : s.interrupt().each(function () {
                          B(this, arguments)
                            .event(o)
                            .start()
                            .zoom(null, 'function' == typeof t ? t.apply(this, arguments) : t)
                            .end();
                        });
                }),
                (T.scaleBy = function (e, t, n, o) {
                  T.scaleTo(
                    e,
                    function () {
                      return this.__zoom.k * ('function' == typeof t ? t.apply(this, arguments) : t);
                    },
                    n,
                    o
                  );
                }),
                (T.scaleTo = function (e, t, n, o) {
                  T.transform(
                    e,
                    function () {
                      var e = y.apply(this, arguments),
                        o = this.__zoom,
                        s = null == n ? R(e) : 'function' == typeof n ? n.apply(this, arguments) : n,
                        r = o.invert(s),
                        i = 'function' == typeof t ? t.apply(this, arguments) : t;
                      return j(L(I(o, i), s, r), e, A);
                    },
                    n,
                    o
                  );
                }),
                (T.translateBy = function (e, t, n, o) {
                  T.transform(
                    e,
                    function () {
                      return j(
                        this.__zoom.translate('function' == typeof t ? t.apply(this, arguments) : t, 'function' == typeof n ? n.apply(this, arguments) : n),
                        y.apply(this, arguments),
                        A
                      );
                    },
                    null,
                    o
                  );
                }),
                (T.translateTo = function (e, t, n, o, s) {
                  T.transform(
                    e,
                    function () {
                      var e = y.apply(this, arguments),
                        s = this.__zoom,
                        r = null == o ? R(e) : 'function' == typeof o ? o.apply(this, arguments) : o;
                      return j(
                        u.identity
                          .translate(r[0], r[1])
                          .scale(s.k)
                          .translate('function' == typeof t ? -t.apply(this, arguments) : -t, 'function' == typeof n ? -n.apply(this, arguments) : -n),
                        e,
                        A
                      );
                    },
                    o,
                    s
                  );
                }),
                (O.prototype = {
                  event: function (e) {
                    return e && (this.sourceEvent = e), this;
                  },
                  start: function () {
                    return 1 == ++this.active && ((this.that.__zooming = this), this.emit('start')), this;
                  },
                  zoom: function (e, t) {
                    return (
                      this.mouse && 'mouse' !== e && (this.mouse[1] = t.invert(this.mouse[0])),
                      this.touch0 && 'touch' !== e && (this.touch0[1] = t.invert(this.touch0[0])),
                      this.touch1 && 'touch' !== e && (this.touch1[1] = t.invert(this.touch1[0])),
                      (this.that.__zoom = t),
                      this.emit('zoom'),
                      this
                    );
                  },
                  end: function () {
                    return 0 == --this.active && (delete this.that.__zooming, this.emit('end')), this;
                  },
                  emit: function (e) {
                    var t = (0, i.default)(this.that).datum();
                    N.call(e, this.that, new c.default(e, { sourceEvent: this.sourceEvent, target: T, type: e, transform: this.that.__zoom, dispatch: N }), t);
                  },
                }),
                (T.wheelDelta = function (e) {
                  return arguments.length ? ((w = 'function' == typeof e ? e : (0, l.default)(+e)), T) : w;
                }),
                (T.filter = function (e) {
                  return arguments.length ? ((b = 'function' == typeof e ? e : (0, l.default)(!!e)), T) : b;
                }),
                (T.touchable = function (e) {
                  return arguments.length ? ((x = 'function' == typeof e ? e : (0, l.default)(!!e)), T) : x;
                }),
                (T.extent = function (e) {
                  return arguments.length
                    ? ((y =
                        'function' == typeof e
                          ? e
                          : (0, l.default)([
                              [+e[0][0], +e[0][1]],
                              [+e[1][0], +e[1][1]],
                            ])),
                      T)
                    : y;
                }),
                (T.scaleExtent = function (e) {
                  return arguments.length ? ((S[0] = +e[0]), (S[1] = +e[1]), T) : [S[0], S[1]];
                }),
                (T.translateExtent = function (e) {
                  return arguments.length
                    ? ((A[0][0] = +e[0][0]), (A[1][0] = +e[1][0]), (A[0][1] = +e[0][1]), (A[1][1] = +e[1][1]), T)
                    : [
                        [A[0][0], A[0][1]],
                        [A[1][0], A[1][1]],
                      ];
                }),
                (T.constrain = function (e) {
                  return arguments.length ? ((j = e), T) : j;
                }),
                (T.duration = function (e) {
                  return arguments.length ? ((E = +e), T) : E;
                }),
                (T.interpolate = function (e) {
                  return arguments.length ? ((M = e), T) : M;
                }),
                (T.on = function () {
                  var e = N.on.apply(N, arguments);
                  return e === N ? T : e;
                }),
                (T.clickDistance = function (e) {
                  return arguments.length ? ((P = (e = +e) * e), T) : Math.sqrt(P);
                }),
                (T.tapDistance = function (e) {
                  return arguments.length ? ((C = +e), T) : C;
                }),
                T
              );
            },
        });
      var o = n('./node_modules/d3-dispatch/src/index.js'),
        s = n('./node_modules/d3-drag/src/nodrag.js'),
        r = n('./node_modules/d3-interpolate/src/zoom.js'),
        i = n('./node_modules/d3-zoom/node_modules/d3-selection/src/select.js'),
        d = n('./node_modules/d3-zoom/node_modules/d3-selection/src/pointer.js'),
        a = n('./node_modules/d3-zoom/node_modules/d3-transition/src/index.js'),
        l = n('./node_modules/d3-zoom/src/constant.js'),
        c = n('./node_modules/d3-zoom/src/event.js'),
        u = n('./node_modules/d3-zoom/src/transform.js'),
        f = n('./node_modules/d3-zoom/src/noevent.js');
      function h(e) {
        return !((e.ctrlKey && 'wheel' !== e.type) || e.button);
      }
      function m() {
        var e = this;
        return e instanceof SVGElement
          ? (e = e.ownerSVGElement || e).hasAttribute('viewBox')
            ? [
                [(e = e.viewBox.baseVal).x, e.y],
                [e.x + e.width, e.y + e.height],
              ]
            : [
                [0, 0],
                [e.width.baseVal.value, e.height.baseVal.value],
              ]
          : [
              [0, 0],
              [e.clientWidth, e.clientHeight],
            ];
      }
      function p() {
        return this.__zoom || u.identity;
      }
      function _(e) {
        return -e.deltaY * (1 === e.deltaMode ? 0.05 : e.deltaMode ? 1 : 0.002) * (e.ctrlKey ? 10 : 1);
      }
      function g() {
        return navigator.maxTouchPoints || 'ontouchstart' in this;
      }
      function v(e, t, n) {
        var o = e.invertX(t[0][0]) - n[0][0],
          s = e.invertX(t[1][0]) - n[1][0],
          r = e.invertY(t[0][1]) - n[0][1],
          i = e.invertY(t[1][1]) - n[1][1];
        return e.translate(s > o ? (o + s) / 2 : Math.min(0, o) || Math.max(0, s), i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i));
      }
    },
    './node_modules/style-loader/lib/urls.js': (e) => {
      e.exports = function (e) {
        var t = 'undefined' != typeof window && window.location;
        if (!t) throw new Error('fixUrls requires window.location');
        if (!e || 'string' != typeof e) return e;
        var n = t.protocol + '//' + t.host,
          o = n + t.pathname.replace(/\/[^\/]*$/, '/');
        return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (e, t) {
          var s,
            r = t
              .trim()
              .replace(/^"(.*)"$/, function (e, t) {
                return t;
              })
              .replace(/^'(.*)'$/, function (e, t) {
                return t;
              });
          return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(r)
            ? e
            : ((s = 0 === r.indexOf('//') ? r : 0 === r.indexOf('/') ? n + r : o + r.replace(/^\.\//, '')), 'url(' + JSON.stringify(s) + ')');
        });
      };
    },
    './node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./src/styles/pdb-ligand-env.css': (e, t, n) => {
      (e.exports = n('./node_modules/css-loader/dist/runtime/api.js')(!1)).push([
        e.id,
        'pdb-ligand-env {\n    display: block;\n    width: 100%;\n    height: 100%;\n}\n\n#pdb-lig-env-root {\n    cursor: default;\n    border-radius: 3px;\n    width: 100%;\n    height: 100%;\n}\n\n.pdb-lig-env-label {\n    position: absolute;\n    height: auto;\n    padding: 10px;\n    font: 12px sans-serif;\n    background: #e9e6e0;\n    overflow: auto;\n    opacity: 0.8;\n    word-wrap: normal;\n}\n\n#pdb-lig-env-tooltip {\n    margin: 10px 0 0 10px;\n    bottom: 10px;\n}\n\n#pdb-lig-env-tooltip>ul {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n\n#pdb-lig-env-tooltip>ul>li:first-of-type(span) {\n    text-align: left;\n    padding: 0px !important;\n    font-weight: 900;\n}\n\n.pdb-lig-env-menu-panel {\n    background: #e9e6e0;\n    opacity: 0.9;\n    float: right;\n    height: 30px;\n    line-height: 30px;\n    padding: 0 10px;\n\n    -webkit-transition-timing-function: ease-in;\n    transition-timing-function: ease-in;\n    -webkit-transition: .2s;\n    transition: .2s;\n}\n\n.pdb-lig-env-menu-panel>i {\n    margin-right: 15px;\n    cursor: pointer;\n    font: 12px sans-serif;\n}\n\n.pdb-lig-env-menu-panel>i:last-child {\n    margin-right: 0px;\n}\n\n.pdb-lig-env-menu-panel>i:hover {\n    color: #ae5d04;\n}\n\n.pdb-lig-env-toolbar-container {\n    top: 20px;\n    right: 20px;\n    position: absolute;\n    overflow: hidden;\n}\n\n#pdb-lig-env-help-container {\n    font-family: sans-serif;\n    background: #f6f5f3;\n    display: none;\n    opacity: 0;\n    position: absolute;\n    top: 50px;\n    right: 20px;\n    padding: 20px 10px 20px 10px;\n\n    min-width: 275px;\n    max-width: 275px;\n    font: 12px sans-serif;\n\n\n    border-radius: 5px;\n    transition: 1s;\n}\n\n#pdb-lig-env-help-container:first-child {\n    font-weight: bold;\n}\n\n#pdb-lig-env-residue-label {\n    margin: 0 0 10px 10px;\n    left: 10px;\n    top: 10px;\n}\n\n#pdb-lig-env-tooltip span:first-child {\n    text-align: left;\n    padding-left: 0px !important;\n    font-weight: 900;\n}\n\n#pdb-lig-env-tooltip span:last-child {\n    padding-left: 10px;\n}\n\n.pdb-lig-env-help-table {\n    border: none !important;\n    margin: 0 !important;\n    background-color: #f6f5f3 !important;\n}\n\n.pdb-lig-env-help-table td {\n    border: none !important;\n}\n\n.pdb-lig-env-help-table tr {\n    height: 25px;\n}\n\n.pdb-lig-env-help-table tr td:first-child {\n    width: 25px;\n    min-width: 25px;\n    max-width: 25px;\n}\n\n.pdb-lig-env-help-table tr td:nth-child(2) {\n    min-width: 100px;\n}\n\n.pdb-lig-env-help-table tr td:nth-child(3) {\n    width: 25px;\n    min-width: 25px;\n    max-width: 25px;\n}\n\n#pdb-lig-env-help-bonds {\n    display: none;\n}\n\n.pdb-lig-env-btn:hover {\n    color: #637ca0;\n}\n\n.pdb-lig-env-help-residue {\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    border: 1.2px solid #a9a9a9;\n}\n\n.pdb-lig-env-help-navbar {\n    height: 20px;\n    margin-bottom: 10px;\n}\n\n.pdb-lig-env-help-navbar a {\n    width: 49%;\n    padding-bottom: 5px;\n    border: none;\n    color: black;\n    text-align: center;\n    font-weight: bold;\n    display: inline-block;\n    cursor: pointer;\n}\n\n.pdb-lig-env-help-navbar a.active {\n    border-bottom: 2px solid #637ca0;\n    color: #637ca0;\n}',
        '',
      ]);
    },
    './src/styles/pdb-ligand-env.css': (e, t, n) => {
      var o = n('./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./src/styles/pdb-ligand-env.css');
      'string' == typeof o && (o = [[e.id, o, '']]);
      var s = { hmr: !0, transform: void 0, insertInto: void 0 };
      n('./node_modules/style-loader/lib/addStyles.js')(o, s);
      o.locals && (e.exports = o.locals);
    },
    './node_modules/style-loader/lib/addStyles.js': (e, t, n) => {
      var o = {},
        s = (function (e) {
          var t;
          return function () {
            return void 0 === t && (t = e.apply(this, arguments)), t;
          };
        })(function () {
          return window && document && document.all && !window.atob;
        }),
        r = (function (e) {
          var t = {};
          return function (e, n) {
            if ('function' == typeof e) return e();
            if (void 0 === t[e]) {
              var o = function (e, t) {
                return t ? t.querySelector(e) : document.querySelector(e);
              }.call(this, e, n);
              if (window.HTMLIFrameElement && o instanceof window.HTMLIFrameElement)
                try {
                  o = o.contentDocument.head;
                } catch (e) {
                  o = null;
                }
              t[e] = o;
            }
            return t[e];
          };
        })(),
        i = null,
        d = 0,
        a = [],
        l = n('./node_modules/style-loader/lib/urls.js');
      function c(e, t) {
        for (var n = 0; n < e.length; n++) {
          var s = e[n],
            r = o[s.id];
          if (r) {
            r.refs++;
            for (var i = 0; i < r.parts.length; i++) r.parts[i](s.parts[i]);
            for (; i < s.parts.length; i++) r.parts.push(_(s.parts[i], t));
          } else {
            var d = [];
            for (i = 0; i < s.parts.length; i++) d.push(_(s.parts[i], t));
            o[s.id] = { id: s.id, refs: 1, parts: d };
          }
        }
      }
      function u(e, t) {
        for (var n = [], o = {}, s = 0; s < e.length; s++) {
          var r = e[s],
            i = t.base ? r[0] + t.base : r[0],
            d = { css: r[1], media: r[2], sourceMap: r[3] };
          o[i] ? o[i].parts.push(d) : n.push((o[i] = { id: i, parts: [d] }));
        }
        return n;
      }
      function f(e, t) {
        var n = r(e.insertInto);
        if (!n) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        var o = a[a.length - 1];
        if ('top' === e.insertAt) o ? (o.nextSibling ? n.insertBefore(t, o.nextSibling) : n.appendChild(t)) : n.insertBefore(t, n.firstChild), a.push(t);
        else if ('bottom' === e.insertAt) n.appendChild(t);
        else {
          if ('object' != typeof e.insertAt || !e.insertAt.before)
            throw new Error(
              "[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n"
            );
          var s = r(e.insertAt.before, n);
          n.insertBefore(t, s);
        }
      }
      function h(e) {
        if (null === e.parentNode) return !1;
        e.parentNode.removeChild(e);
        var t = a.indexOf(e);
        t >= 0 && a.splice(t, 1);
      }
      function m(e) {
        var t = document.createElement('style');
        if ((void 0 === e.attrs.type && (e.attrs.type = 'text/css'), void 0 === e.attrs.nonce)) {
          var o = (function () {
            0;
            return n.nc;
          })();
          o && (e.attrs.nonce = o);
        }
        return p(t, e.attrs), f(e, t), t;
      }
      function p(e, t) {
        Object.keys(t).forEach(function (n) {
          e.setAttribute(n, t[n]);
        });
      }
      function _(e, t) {
        var n, o, s, r;
        if (t.transform && e.css) {
          if (!(r = 'function' == typeof t.transform ? t.transform(e.css) : t.transform.default(e.css))) return function () {};
          e.css = r;
        }
        if (t.singleton) {
          var a = d++;
          (n = i || (i = m(t))), (o = v.bind(null, n, a, !1)), (s = v.bind(null, n, a, !0));
        } else
          e.sourceMap &&
          'function' == typeof URL &&
          'function' == typeof URL.createObjectURL &&
          'function' == typeof URL.revokeObjectURL &&
          'function' == typeof Blob &&
          'function' == typeof btoa
            ? ((n = (function (e) {
                var t = document.createElement('link');
                return void 0 === e.attrs.type && (e.attrs.type = 'text/css'), (e.attrs.rel = 'stylesheet'), p(t, e.attrs), f(e, t), t;
              })(t)),
              (o = function (e, t, n) {
                var o = n.css,
                  s = n.sourceMap,
                  r = void 0 === t.convertToAbsoluteUrls && s;
                (t.convertToAbsoluteUrls || r) && (o = l(o));
                s && (o += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(s)))) + ' */');
                var i = new Blob([o], { type: 'text/css' }),
                  d = e.href;
                (e.href = URL.createObjectURL(i)), d && URL.revokeObjectURL(d);
              }.bind(null, n, t)),
              (s = function () {
                h(n), n.href && URL.revokeObjectURL(n.href);
              }))
            : ((n = m(t)),
              (o = function (e, t) {
                var n = t.css,
                  o = t.media;
                o && e.setAttribute('media', o);
                if (e.styleSheet) e.styleSheet.cssText = n;
                else {
                  for (; e.firstChild; ) e.removeChild(e.firstChild);
                  e.appendChild(document.createTextNode(n));
                }
              }.bind(null, n)),
              (s = function () {
                h(n);
              }));
        return (
          o(e),
          function (t) {
            if (t) {
              if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap) return;
              o((e = t));
            } else s();
          }
        );
      }
      e.exports = function (e, t) {
        if ('undefined' != typeof DEBUG && DEBUG && 'object' != typeof document) throw new Error('The style-loader cannot be used in a non-browser environment');
        ((t = t || {}).attrs = 'object' == typeof t.attrs ? t.attrs : {}),
          t.singleton || 'boolean' == typeof t.singleton || (t.singleton = s()),
          t.insertInto || (t.insertInto = 'head'),
          t.insertAt || (t.insertAt = 'bottom');
        var n = u(e, t);
        return (
          c(n, t),
          function (e) {
            for (var s = [], r = 0; r < n.length; r++) {
              var i = n[r];
              (d = o[i.id]).refs--, s.push(d);
            }
            e && c(u(e, t), t);
            for (r = 0; r < s.length; r++) {
              var d;
              if (0 === (d = s[r]).refs) {
                for (var a = 0; a < d.parts.length; a++) d.parts[a]();
                delete o[d.id];
              }
            }
          }
        );
      };
      var g = (function () {
        var e = [];
        return function (t, n) {
          return (e[t] = n), e.filter(Boolean).join('\n');
        };
      })();
      function v(e, t, n, o) {
        var s = n ? '' : o.css;
        if (e.styleSheet) e.styleSheet.cssText = g(t, s);
        else {
          var r = document.createTextNode(s),
            i = e.childNodes;
          i[t] && e.removeChild(i[t]), i.length ? e.insertBefore(r, i[t]) : e.appendChild(r);
        }
      }
    },
    './src/plugin/config.ts': (e, t, n) => {
      n.r(t),
        n.d(t, {
          LigandHideAtomEvent: () => c,
          LigandShowAtomEvent: () => l,
          UIParameters: () =>
            class {
              constructor(e) {
                (this.reinitialize = !0),
                  (this.zoom = !0),
                  (this.zoomControls = void 0 === e || e),
                  (this.disableScrollZoom = void 0),
                  (this.fullScreen = !0),
                  (this.downloadImage = !0),
                  (this.downloadData = !0),
                  (this.center = !0),
                  (this.help = !0),
                  (this.residueLabel = !0),
                  (this.tooltip = !0),
                  (this.menu = !0),
                  (this.names = !0);
              }
            },
          aaAbreviations: () => g,
          aaTypes: () => _,
          backboneAtoms: () => v,
          interactionClickEvent: () => s,
          interactionHideLabelEvent: () => a,
          interactionMouseoutEvent: () => i,
          interactionMouseoverEvent: () => r,
          interactionShowLabelEvent: () => d,
          interactionsClasses: () => b,
          ligandHeatmapMouseoutEvent: () => p,
          ligandHeatmapMouseoverEvent: () => m,
          molstarClickEvent: () => u,
          molstarMouseoutEvent: () => h,
          molstarMouseoverEvent: () => f,
          nodeSize: () => o,
        });
      const o = 30,
        s = 'PDB.interactions.click',
        r = 'PDB.interactions.mouseover',
        i = 'PDB.interactions.mouseout',
        d = 'PDB.interactions.showLabel',
        a = 'PDB.interactions.hideLabel',
        l = 'PDB.ligand.showAtom',
        c = 'PDB.ligand.hideAtom',
        u = 'PDB.molstar.click',
        f = 'PDB.molstar.mouseover',
        h = 'PDB.molstar.mouseout',
        m = 'PDB.ligHeatmap.mouseover',
        p = 'PDB.ligHeatmap.mouseout',
        _ = new Map([
          ['hydrophobic', new Array('A', 'I', 'L', 'M', 'F', 'W', 'V')],
          ['positive', Array('K', 'R', 'O')],
          ['negative', Array('E', 'D')],
          ['polar', Array('N', 'Q', 'S', 'T')],
          ['cystein', Array('C', 'U')],
          ['glycine', Array('G')],
          ['proline', Array('P')],
          ['aromatic', Array('H', 'Y')],
        ]),
        g = new Map([
          ['ALA', 'A'],
          ['ARG', 'R'],
          ['ASN', 'N'],
          ['ASP', 'D'],
          ['CYS', 'C'],
          ['GLU', 'E'],
          ['GLN', 'Q'],
          ['GLY', 'G'],
          ['HIS', 'H'],
          ['ILE', 'I'],
          ['LEU', 'L'],
          ['LYS', 'K'],
          ['MET', 'M'],
          ['PHE', 'F'],
          ['PRO', 'P'],
          ['SER', 'S'],
          ['THR', 'T'],
          ['TRP', 'W'],
          ['TYR', 'Y'],
          ['VAL', 'V'],
        ]),
        v = ['N', 'CA', 'C', 'O'],
        b = new Map([
          ['covalent', new Array('covalent')],
          ['electrostatic', new Array('ionic', 'hbond', 'weak_hbond', 'polar', 'weak_polar', 'xbond', 'carbonyl')],
          ['amide', new Array('AMIDEAMIDE', 'AMIDERING')],
          ['vdw', new Array('vdw')],
          ['hydrophobic', new Array('hydrophobic')],
          ['aromatic', new Array('aromatic', 'FF', 'OF', 'EE', 'FT', 'OT', 'ET', 'FE', 'OE', 'EF')],
          ['atom-pi', new Array('CARBONPI', 'CATIONPI', 'DONORPI', 'HALOGENPI', 'METSULPHURPI')],
          ['metal', new Array('metal_complex')],
          ['clashes', new Array('clash', 'vdw_clash')],
        ]);
    },
    './src/plugin/depiction.ts': (e, t, n) => {
      n.r(t),
        n.d(t, {
          Atom: () => u,
          Depiction: () =>
            class {
              constructor(e, t, n) {
                (this.root = t),
                  (this.parent = e),
                  (this.highlight = this.root.append('g').attr('id', 'highlight')),
                  (this.weight = this.root.append('g').attr('id', 'weight')),
                  (this.structure = this.root.append('g').attr('id', 'structure')),
                  (this.ccdId = n.ccd_id),
                  (this.resolution = new f(n.resolution.x, n.resolution.y)),
                  (this.atoms = n.atoms.map((e) => new u(e))),
                  (this.bonds = new Array());
                let o = new Set();
                n.bonds.forEach((e) => {
                  let t = this.atoms.find((t) => t.name == e.bgn),
                    n = this.atoms.find((t) => t.name == e.end),
                    s = new h(t, n, e.coords, e.style),
                    r = [t.name, n.name].sort().join('_');
                  o.has(r) || (o.add(r), t.connectivity++, n.connectivity++), this.bonds.push(s);
                });
              }
              getInitalNodePosition(e) {
                if (1 === this.atoms.length) return new f(this.atoms[0].position.x, this.atoms[0].position.y);
                let t = this.atoms.filter((t) => e.includes(t.name)).sort((e, t) => e.connectivity - t.connectivity),
                  n = t[0],
                  o = this.bonds.find((e) => e.containsAtom(n)),
                  s = o.getOtherAtom(n),
                  r = s.position.x - 2 * (s.position.x - n.position.x),
                  i = s.position.y - 2 * (s.position.y - n.position.y);
                return new f(r, i);
              }
              draw(e = !1) {
                this.structure.selectAll('*').remove(), this.appendBondVisuals(), e ? this.appendAtomNames() : this.appendLabels();
              }
              highlightSubgraph(e, t) {
                if (this.atoms && (this.highlight.selectAll('*').remove(), e)) {
                  t = t || '#FFFF00';
                  let n = this.atoms.filter((t) => e.includes(t.name));
                  this.highlight
                    .selectAll()
                    .data(n)
                    .enter()
                    .append('circle')
                    .attr('r', '16.12')
                    .attr('cx', (e) => e.position.x)
                    .attr('cy', (e) => e.position.y)
                    .attr('style', `fill:${t};fill-rule:evenodd;stroke:${t};stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1`);
                  let o = this.bonds.filter((t) => e.includes(t.bgn.name) && e.includes(t.end.name));
                  this.highlight
                    .selectAll()
                    .data(o)
                    .enter()
                    .append('path')
                    .attr('d', (e) => `M ${e.bgn.position.x},${e.bgn.position.y} ${e.end.position.x},${e.end.position.y}`)
                    .attr('style', `fill:none;fill-rule:evenodd;stroke:${t};stroke-width:22px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1`);
                }
              }
              addCircles(e) {
                this.atoms.forEach((t) => {
                  let n = e.filter((e) => e.atom == t.name).map((e) => e.value)[0];
                  void 0 === n && (n = 0), (t.value = n);
                });
                const t = this.atoms,
                  n = this.getScale();
                this.weight.selectAll('*').remove(),
                  this.weight
                    .selectAll()
                    .data(t)
                    .enter()
                    .append('circle')
                    .attr('class', (e) => `${e.name}_Circles`)
                    .attr('cx', (e) => e.position.x)
                    .attr('cy', (e) => e.position.y)
                    .attr('r', (e) => (e.value > 0 ? n.radiusScale(e.value) : 15))
                    .attr('fill', (e) => (e.value > 0 ? n.colorScale(e.value) : '#ffffff'))
                    .attr('fill-opacity', '1')
                    .on('mouseenter', (e, t) => {
                      this.atomMouseEnterEventHandler(t, e.currentTarget, !0);
                    })
                    .on('mouseleave', (e) => {
                      this.atomMouseLeaveEventHandler(!0);
                    });
              }
              getScale() {
                const e = this.atoms.map((e) => e.value).filter((e) => e > 0),
                  t = (0, r.default)(e),
                  n = (0, i.default)(e),
                  o = (0, a.sqrt)([n, t], [10, 30]),
                  s = (0, l.default)([0, 0.01, t], ['#f0fcf0', '#a0bb9e', '#505d50']);
                return { radiusScale: o, colorScale: s };
              }
              appendBondVisuals() {
                this.structure
                  .selectAll()
                  .data(this.bonds)
                  .enter()
                  .append('path')
                  .attr('style', (e) => e.style)
                  .attr('d', (e) => e.coords);
              }
              appendAtomNames() {
                this.structure
                  .selectAll()
                  .data(this.atoms)
                  .enter()
                  .append('text')
                  .attr('filter', 'url(#solid-background)')
                  .attr('style', 'font-size:21px;font-style:normal;font-weight:normal;fill-opacity:1;stroke:none;font-family:sans-serif;fill:#000000')
                  .attr('x', (e) => e.position.x)
                  .attr('y', (e) => e.position.y)
                  .attr('dominant-baseline', 'central')
                  .attr('text-anchor', 'middle')
                  .text((e) => e.name);
              }
              appendLabels() {
                let e = this.atoms.filter((e) => e.labels.length > 0);
                this.structure
                  .selectAll()
                  .data(e)
                  .enter()
                  .append('g')
                  .attr('class', 'structureLabels')
                  .attr('filter', 'labels')
                  .each(function (e) {
                    for (var t = 0; t < e.labels.length; t++)
                      (0, o.default)(this).append('path').attr('d', e.labels[t].d).style('background-color', 'white').attr('fill', e.labels[t].fill);
                  });
              }
              getCenter(e) {
                let t = new Array();
                e.forEach((e) => {
                  let n = this.atoms.find((t) => t.name === e).position;
                  t.push(n);
                });
                let n = (0, d.default)(t, (e) => e.x) / t.length,
                  o = (0, d.default)(t, (e) => e.y) / t.length;
                return new f(n, o);
              }
              sortMap(e) {
                let t = [...e.values()].sort(),
                  n = new Map();
                return (
                  t.forEach((t) => {
                    e.forEach((e, o) => {
                      t !== e || n.set(o, t);
                    });
                  }),
                  n
                );
              }
              highlightAtom(e) {
                this.removeHighlights();
                const t = this.getScale(),
                  n = (0, o.default)(e).classed('selectedCircle', !0).style('stroke', '#FBBD1D').style('stroke-width', 5);
                !(function e() {
                  n.classed('selectedCircle') &&
                    n
                      .transition()
                      .duration(500)
                      .style('stroke-width', 10)
                      .attr('r', () => {
                        const e = n.datum();
                        return e.value > 0 ? 1.5 * t.radiusScale(e.value) : 30;
                      })
                      .transition()
                      .duration(500)
                      .style('stroke-width', 5)
                      .attr('r', () => {
                        const e = n.datum();
                        return e.value > 0 ? t.radiusScale(e.value) : 15;
                      })
                      .on('end', e);
                })();
              }
              removeHighlights() {
                const e = this.getScale(),
                  t = (0, s.default)('.selectedCircle');
                t.classed('selectedCircle', !1)
                  .interrupt()
                  .attr('r', () => {
                    const n = t.datum();
                    return n.value > 0 ? e.radiusScale(n.value) : 15;
                  })
                  .style('stroke', null);
              }
              atomMouseEnterEventHandler(e, t, n) {
                this.highlightAtom(t), this.fireExternalAtomEvent(e, n, c.LigandShowAtomEvent);
              }
              atomMouseLeaveEventHandler(e) {
                this.removeHighlights(), this.fireExternalNullEvent(e, c.LigandHideAtomEvent);
              }
              fireExternalAtomEvent(e, t, n) {
                const o = new CustomEvent(n, { bubbles: !0, detail: { tooltip: e.toTooltip('%'), atomName: e.name, external: t } });
                this.parent.dispatchEvent(o);
              }
              fireExternalNullEvent(e, t) {
                const n = new CustomEvent(t, { bubbles: !0, detail: { external: e } });
                this.parent.dispatchEvent(n);
              }
            },
          Vector2D: () => f,
        });
      var o = n('./node_modules/d3-selection/src/select.js'),
        s = n('./node_modules/d3-selection/src/selectAll.js'),
        r = n('./node_modules/d3-array/src/max.js'),
        i = n('./node_modules/d3-array/src/min.js'),
        d = n('./node_modules/d3-array/src/sum.js'),
        a = n('./node_modules/d3-scale/src/pow.js'),
        l = n('./node_modules/d3-scale/src/linear.js'),
        c = n('./src/plugin/config.ts');
      n('./node_modules/d3-transition/src/index.js');
      class u {
        constructor(e) {
          (this.name = e.name), (this.labels = e.labels), (this.position = new f(e.x, e.y)), (this.connectivity = 0), (this.value = 0);
        }
        equals(e) {
          return e instanceof u && e.name === this.name;
        }
        toTooltip(e) {
          return `<span>${this.name}: ${this.value.toFixed(2)}${e}</span>`;
        }
      }
      class f {
        constructor(e, t) {
          (this.x = e), (this.y = t);
        }
        toString() {
          return `[${this.x}, ${this.y}]`;
        }
        equals(e) {
          return e instanceof f && this.x == e.x && this.y == e.y;
        }
        distanceTo(e) {
          return Math.sqrt(Math.pow(e.x - this.x, 2) + Math.pow(e.y - this.y, 2));
        }
        static composeVectors(e) {
          let t = (0, d.default)(e.map((e) => e.x)),
            n = (0, d.default)(e.map((e) => e.y));
          return new f(t, n);
        }
      }
      class h {
        constructor(e, t, n, o) {
          (this.bgn = e), (this.end = t), (this.coords = n), (this.style = o.replace('stroke-width:2px', 'stroke-width:4px'));
        }
        getOtherAtom(e) {
          if (!this.bgn.equals(e) && !this.end.equals(e)) throw new Error(`Atom ${e.name} is not a part of the bond.`);
          return this.bgn.equals(e) ? this.end : this.bgn;
        }
        containsAtom(e) {
          return this.bgn.equals(e) || this.end.equals(e);
        }
        hide() {
          this.style.replace('stroke-width:4px', 'stroke-width:0px');
        }
      }
    },
    './src/plugin/manager.ts': (e, t, n) => {
      n.r(t),
        n.d(t, {
          Visualization: () =>
            class {
              constructor(e, t, n = 'production', s = !1) {
                (this.dragHandler = (0, r.default)()
                  .filter((e) => !e.static)
                  .on('start', (e, t) => {
                    e.active || this.simulation.alphaTarget(0.3).restart(), (t.fx = t.x), (t.fy = t.y);
                  })
                  .on('drag', (e, t) => {
                    (this.nodeDragged = !0), (t.fx = e.x), (t.fy = e.y);
                  })
                  .on('end', (e, t) => {
                    (this.nodeDragged = !1), e.active || this.simulation.alphaTarget(0), (t.fx = e.x), (t.fy = e.y);
                  })),
                  (this.parent = e),
                  (this.environment = this.parseEnvironment(n)),
                  (this.parent.style.cssText += 'display: block; height: 100%; width: 100%; position: relative;'),
                  (this.svg = (0, o.default)(this.parent)
                    .append('div')
                    .attr('id', 'pdb-lig-env-root')
                    .append('svg')
                    .style('background-color', 'white')
                    .attr('xmlns', 'http://www.w3.org/2000/svg')
                    .attr('width', '100%')
                    .attr('height', '100%')),
                  !1 !== (null == t ? void 0 : t.zoom) &&
                    ((this.zoomHandler = this.getZoomHandler()),
                    this.svg.call(this.zoomHandler),
                    this.disableScrollControlsIfNeeded(t),
                    this.disableScrollZoomIfNeeded(t)),
                  this.addMarkers(),
                  (this.canvas = this.svg.append('g').attr('id', 'vis-root')),
                  (this.depictionRoot = this.canvas.append('g').attr('id', 'depiction')),
                  (0, o.default)(this.parent).on('resize', () => this.resize()),
                  s ||
                    ((this.visualsMapper = new g.VisualsMapper(this.environment)),
                    (this.rProvider = j.ResidueProvider.getInstance(this.environment)),
                    (this.bindingSites = new Array()),
                    (this.fullScreen = !1),
                    (this.nodeDragged = !1),
                    void 0 === t && (t = new y.UIParameters(!1)),
                    new v.UI(this.parent, this).register(t),
                    (this.linksRoot = this.canvas.append('g').attr('id', 'links')),
                    (this.nodesRoot = this.canvas.append('g').attr('id', 'nodes')),
                    t.zoom && (this.zoomHandler = this.getZoomHandler()),
                    document.addEventListener(y.ligandHeatmapMouseoverEvent, (e) => this.ligHeatmapMouseoverEventHandler(e)),
                    document.addEventListener(y.ligandHeatmapMouseoutEvent, (e) => this.ligHeatmapMouseoutEventHandler(e)),
                    document.addEventListener(y.molstarClickEvent, (e) => this.molstarClickEventHandler(e)),
                    document.addEventListener(y.molstarMouseoverEvent, (e) => this.molstarClickEventHandler(e)),
                    document.addEventListener(y.molstarMouseoutEvent, () => this.molstarMouseoutEventHandler())),
                  (this.uiParameters = t);
              }
              getZoomHandler() {
                return (0, s.zoom)()
                  .scaleExtent([0.1, 10])
                  .on('zoom', (e) => {
                    this.canvas.attr('transform', e.transform);
                  });
              }
              showRenderMessage(e) {
                if (e) {
                  if (!this.renderMessageEl) {
                    const e = document.createElement('div');
                    (e.textContent = 'Rendering interactions...'),
                      (e.style.position = 'absolute'),
                      (e.style.bottom = '8px'),
                      (e.style.left = '50%'),
                      (e.style.transform = 'translateX(-50%)'),
                      (e.style.fontSize = '16px'),
                      (e.style.fontFamily = 'sans-serif'),
                      (e.style.color = '#666'),
                      (e.style.background = 'rgba(255,255,255,0.8)'),
                      (e.style.padding = '2px 8px'),
                      (e.style.borderRadius = '4px'),
                      (e.style.pointerEvents = 'none'),
                      (e.style.zIndex = '10'),
                      this.parent.appendChild(e),
                      (this.renderMessageEl = e);
                  }
                } else this.renderMessageEl && (this.renderMessageEl.remove(), (this.renderMessageEl = void 0));
              }
              disableScrollControlsIfNeeded(e) {
                !1 === (null == e ? void 0 : e.zoomControls) && this.svg.on('.zoom', null);
              }
              disableScrollZoomIfNeeded(e) {
                !1 !== (null == e ? void 0 : e.disableScrollZoom) && this.svg.on('wheel.zoom', null).on('touchstart.zoom', null);
              }
              molstarClickEventHandler(e) {
                var t;
                if (this.fullScreen) return;
                let n = `${e.eventData.auth_asym_id}${e.eventData.auth_seq_id}${e.eventData.ins_code}`;
                null === (t = this.nodes) ||
                  void 0 === t ||
                  t.each((e, t, o) => {
                    if ((this.nodeDim(e, t, o), e.id === n)) return (this.selectedResidueHash = n), void this.nodeHighlight(e, t, o);
                  });
              }
              ligHeatmapMouseoverEventHandler(e) {
                if (void 0 === this.depiction) return;
                if (void 0 === this.ligandIntxData) return;
                const t = e.detail.name,
                  n = this.depiction.atoms.filter((e) => e.name === t),
                  s = (0, o.default)(`.${t}_Circles`),
                  r = s.nodes(),
                  i = r[r.length - 1];
                n.length > 0 && this.depiction.atomMouseEnterEventHandler(n[0], i, !0);
              }
              ligHeatmapMouseoutEventHandler(e) {
                void 0 !== this.depiction && this.depiction.atomMouseLeaveEventHandler(!0);
              }
              molstarMouseoutEventHandler() {
                var e, t, n;
                this.fullScreen ||
                  (null === (e = this.nodes) ||
                    void 0 === e ||
                    e.each((e, t, n) => {
                      e.id != this.selectedResidueHash || this.nodeDim(e, t, n);
                    }),
                  null === (t = this.links) || void 0 === t || t.attr('opacity', 1),
                  null === (n = this.nodes) || void 0 === n || n.attr('opacity', 1));
              }
              linkMouseOverEventHandler(e, t, n) {
                this.nodeDragged || (this.linkHighlight(e, t, n), this.fireExternalLinkEvent(e, y.interactionMouseoverEvent));
              }
              linkMouseOutEventHandler(e, t, n) {
                this.nodeDragged || (this.linkDim(e, t, n), this.fireExternalNullEvent(y.interactionMouseoutEvent));
              }
              nodeMouseoverEventHandler(e, t, n) {
                this.nodeDragged || (this.nodeHighlight(e, t, n), this.fireExternalNodeEvent(e, y.interactionMouseoverEvent));
              }
              nodeMouseoutEventHandler(e, t, n) {
                var o, s;
                this.nodeDragged || (this.nodeDim(e, t, n), this.fireExternalNullEvent(y.interactionMouseoutEvent)),
                  null === (o = this.links) || void 0 === o || o.attr('opacity', 1),
                  null === (s = this.nodes) || void 0 === s || s.attr('opacity', 1);
              }
              initBoundMoleculeInteractions(e, t) {
                this.pdbId = e;
                let n = b.boundMoleculeAPI(e, t, this.environment);
                (0, h.default)(n)
                  .catch((e) => this.processError(e, 'No interactions data are available.'))
                  .then(async (e) => await this.addBoundMoleculeInteractions(e, t))
                  .then(() => this.centerScene());
              }
              initCarbohydratePolymerInteractions(e, t, n) {
                this.pdbId = e;
                let o = b.carbohydratePolymerAPI(e, t, n, this.environment);
                (0, h.default)(o)
                  .catch((e) => this.processError(e, 'No interactions data are available.'))
                  .then(async (e) => await this.addBoundMoleculeInteractions(e, t))
                  .then(() => this.centerScene());
              }
              initLigandInteractions(e, t, n, o = !1) {
                this.pdbId = e;
                let s = b.ligandInteractionsAPI(e, n, t, this.environment);
                (0, h.default)(s)
                  .catch((e) => this.processError(e, 'No interactions data are available.'))
                  .then(async (e) => await this.addLigandInteractions(e, o))
                  .then(() => this.centerScene());
              }
              async initLigandDisplay(e, t = !1) {
                const n = b.ligandAnnotationAPI(e, this.environment);
                return (0, h.default)(n)
                  .catch((t) => this.processError(t, `Component ${e} was not found.`))
                  .then((e) => this.addDepiction(e, t))
                  .then(() => this.centerScene());
              }
              async initLigandWeights(e) {
                const t = b.interactionAPI(e, this.environment);
                return (0, h.default)(t).then((t) => (this.ligandIntxData = t[e]));
              }
              addDepiction(e, t) {
                (this.depiction = new p.Depiction(this.parent, this.depictionRoot, e)), this.depiction.draw(t);
              }
              showWeights(e) {
                if (void 0 === this.depiction || void 0 === this.ligandIntxData) return;
                const t = new _.LigandIntx(this.ligandIntxData, e).getAtomIntxPropensity();
                this.depiction.addCircles(t),
                  void 0 !== this.zoomHandler &&
                    (this.zoomHandler(this.svg, s.zoomIdentity),
                    this.disableScrollControlsIfNeeded(this.uiParameters),
                    this.disableScrollZoomIfNeeded(this.uiParameters));
              }
              toggleDepiction(e) {
                this.depiction && this.depiction.draw(e);
              }
              toggleZoom(e) {
                (this.zoomHandler = e ? this.getZoomHandler() : void 0),
                  this.zoomHandler &&
                    (this.zoomHandler(this.svg, s.zoomIdentity),
                    this.disableScrollControlsIfNeeded(this.uiParameters),
                    this.disableScrollZoomIfNeeded(this.uiParameters));
              }
              addLigandHighlight(e, t) {
                this.depiction && this.depiction.highlightSubgraph(e, t);
              }
              async addLigandInteractions(e, t = !1) {
                let n = Object.keys(e)[0],
                  o = e[n][0];
                (this.interactionsData = e),
                  void 0 === this.depiction || this.depiction.ccdId !== o.ligand.chem_comp_id
                    ? (await this.initLigandDisplay(o.ligand.chem_comp_id, t),
                      (this.presentBindingSite = new _.BindingSite().fromLigand(n, o, this.depiction)),
                      this.bindingSites.push(this.presentBindingSite),
                      await this.setupLigandScene())
                    : ((this.presentBindingSite = new _.BindingSite().fromLigand(n, o, this.depiction)),
                      this.bindingSites.push(this.presentBindingSite),
                      await this.setupLigandScene()),
                  await new Promise((e) => requestAnimationFrame(() => e()));
              }
              async addBoundMoleculeInteractions(e, t) {
                let n = Object.keys(e)[0];
                (this.interactionsData = e),
                  (this.presentBindingSite = new _.BindingSite().fromBoundMolecule(n, e[n][0])),
                  this.bindingSites.push(this.presentBindingSite),
                  (this.presentBindingSite.bmId = t);
                let o = this.presentBindingSite.residues.filter((e) => e.isLigand);
                1 === o.length ? await this.initLigandInteractions(this.pdbId, o[0].authorResidueNumber, o[0].chainId) : await this.setupScene(),
                  await new Promise((e) => requestAnimationFrame(() => e()));
              }
              saveSvg() {
                (0, m.default)(b.ligEnvCSSAPI(this.environment)).then((e) => {
                  let t = `\n                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color: white;">\n                ${this.svg.html()}\n                <style>\n                /* <![CDATA[ */ \n ${e} \n /* ]]> */\n                </style>\n                </svg>`,
                    n = new Blob([t], { type: 'image/svg;charset=utf-8' }),
                    o = URL.createObjectURL(n),
                    s = document.createElement('a');
                  (s.href = o), (s.download = this.getSVGName()), document.body.appendChild(s), s.click(), document.body.removeChild(s);
                });
              }
              downloadInteractionsData() {
                let e = document.createElement('a'),
                  t = new Blob([JSON.stringify(this.interactionsData, null, 4)], { type: 'application/json' });
                (e.href = URL.createObjectURL(t)),
                  (e.download = void 0 === this.interactionsData ? 'no_name.json' : `${this.pdbId}_${this.presentBindingSite.bmId}_interactions.json`),
                  document.body.appendChild(e),
                  e.click(),
                  document.body.removeChild(e);
              }
              reinitialize() {
                this.bindingSites.length > 1 && void 0 !== this.depiction
                  ? ((this.presentBindingSite = this.bindingSites[0]),
                    this.bindingSites.pop(),
                    this.depictionRoot.selectAll('*').remove(),
                    (this.depiction = void 0),
                    this.nullNodesPositions(),
                    this.setupScene().then(() => this.centerScene()))
                  : void 0 === this.depiction
                    ? (this.nullNodesPositions(), this.setupScene().then(() => this.centerScene()))
                    : (this.nullNodesPositions(), this.setupLigandScene().then(() => this.centerScene())),
                  this.fireExternalNullEvent(y.interactionHideLabelEvent);
              }
              centerScene() {
                if (this.canvas && this.canvas.node())
                  if (void 0 !== this.nodes) {
                    let e = (0, u.default)(this.nodes.data().map((e) => e.x)),
                      t = (0, u.default)(this.nodes.data().map((e) => e.y)),
                      n = (0, f.default)(this.nodes.data().map((e) => e.x)),
                      o = (0, f.default)(this.nodes.data().map((e) => e.y));
                    this.computeBoundingBox(e, n, t, o);
                  } else if (void 0 !== this.depiction) {
                    let e = (0, u.default)(this.depiction.atoms.map((e) => (0 == e.labels.length ? e.position.x : e.position.x - 50))),
                      t = (0, u.default)(this.depiction.atoms.map((e) => (0 == e.labels.length ? e.position.y : e.position.y - 50))),
                      n = (0, f.default)(this.depiction.atoms.map((e) => (0 == e.labels.length ? e.position.x : e.position.x + 50))),
                      o = (0, f.default)(this.depiction.atoms.map((e) => (0 == e.labels.length ? e.position.y : e.position.y + 50)));
                    this.computeBoundingBox(e, n, t, o);
                  }
              }
              computeBoundingBox(e, t, n, o) {
                var r;
                if (!this.zoomHandler) return;
                let i,
                  d = t - e,
                  a = o - n,
                  l = d / a,
                  c = this.parent.offsetWidth / this.parent.offsetHeight;
                i = l > c ? this.parent.offsetWidth / d : this.parent.offsetHeight / a;
                let u = d * (i *= 0.85),
                  f = a * i,
                  h = -e * i + (this.parent.offsetWidth - u) / 2,
                  m = -n * i + (this.parent.offsetHeight - f) / 2;
                this.canvas.attr('transform', `translate(${h}, ${m}) scale(${i})`);
                let p = s.zoomIdentity.translate(h, m).scale(i);
                try {
                  null === (r = this.zoomHandler) || void 0 === r || r.transform(this.svg, p);
                } catch (e) {
                  console.warn('Zoom not initialized yet:', e);
                }
              }
              resize() {
                this.svg.attr('width', this.parent.offsetWidth).attr('height', this.parent.offsetHeight),
                  void 0 === this.depiction
                    ? this.simulation.force('center', (0, i.default)(this.parent.offsetWidth / 2, this.parent.offsetHeight / 2)).restart()
                    : this.simulation.restart(),
                  void 0 !== this.zoomHandler && this.zoomHandler(this.svg);
              }
              getSVGName() {
                return void 0 !== this.presentBindingSite
                  ? `${this.presentBindingSite.bmId}.svg`
                  : void 0 !== this.depiction
                    ? `${this.depiction.ccdId}.svg`
                    : 'blank.svg';
              }
              nullNodesPositions() {
                this.presentBindingSite.interactionNodes.forEach((e) => {
                  e.static || ((e.fx = void 0), (e.fy = void 0));
                });
              }
              fireExternalLinkEvent(e, t) {
                let n = [],
                  o = [];
                if (e instanceof _.LigandResidueLink) {
                  let t = [].concat(...e.interaction.map((e) => e.sourceAtoms));
                  n = t.filter((e, t, n) => n.indexOf(e) === t);
                  let s = [].concat(...e.interaction.map((e) => e.targetAtoms));
                  o = s.filter((e, t, n) => n.indexOf(e) === t);
                }
                const s = new CustomEvent(t, {
                  bubbles: !0,
                  detail: {
                    interacting_nodes: [
                      {
                        pdb_res_id: this.pdbId,
                        auth_asym_id: e.source.residue.chainId,
                        auth_seq_id: e.source.residue.authorResidueNumber,
                        auth_ins_code_id: e.source.residue.authorInsertionCode,
                        atoms: n,
                      },
                      {
                        pdb_res_id: this.pdbId,
                        auth_asym_id: e.target.residue.chainId,
                        auth_seq_id: e.target.residue.authorResidueNumber,
                        auth_ins_code_id: e.target.residue.authorInsertionCode,
                        atoms: o,
                      },
                    ],
                    tooltip: e.toTooltip(),
                  },
                });
                this.parent.dispatchEvent(s);
              }
              fireExternalNodeEvent(e, t) {
                const n = new CustomEvent(t, {
                  bubbles: !0,
                  detail: {
                    selected_node: {
                      pdb_res_id: this.pdbId,
                      auth_asym_id: e.residue.chainId,
                      auth_seq_id: e.residue.authorResidueNumber,
                      auth_ins_code_id: e.residue.authorInsertionCode,
                    },
                    tooltip: e.toTooltip(),
                  },
                });
                this.parent.dispatchEvent(n);
              }
              fireExternalNullEvent(e) {
                const t = new CustomEvent(e, { bubbles: !0, detail: {} });
                this.parent.dispatchEvent(t);
              }
              wipeOutVisuals() {
                this.nodesRoot.selectAll('*').remove(), this.linksRoot.selectAll('*').remove();
              }
              getIndexAndGroup(e) {
                var t;
                const n = e.currentTarget,
                  o = null === (t = n.parentNode) || void 0 === t ? void 0 : t.childNodes,
                  s = Array.prototype.indexOf.call(o, n);
                return { index: s, group: o };
              }
              setupLinks() {
                (this.links = this.linksRoot.selectAll().data(this.presentBindingSite.links).enter().append('g')),
                  this.links
                    .append('line')
                    .classed('pdb-lig-env-svg-shadow-bond', (e) => 'hydrophobic' !== e.getLinkClass())
                    .on('mouseenter', (e, t) => {
                      const { index: n, group: o } = this.getIndexAndGroup(e);
                      this.linkMouseOverEventHandler(t, n, o);
                    })
                    .on('mouseleave', (e, t) => {
                      const { index: n, group: o } = this.getIndexAndGroup(e);
                      this.linkMouseOutEventHandler(t, n, o);
                    }),
                  this.links
                    .append('line')
                    .attr('class', (e) => `pdb-lig-env-svg-bond pdb-lig-env-svg-bond-${e.getLinkClass()}`)
                    .attr('marker-mid', (e) => (e.hasClash() ? 'url(#clash)' : ''))
                    .on('mouseenter', (e, t) => {
                      const { index: n, group: o } = this.getIndexAndGroup(e);
                      this.linkMouseOverEventHandler(t, n, o);
                    })
                    .on('mouseleave', (e, t) => {
                      const { index: n, group: o } = this.getIndexAndGroup(e);
                      this.linkMouseOutEventHandler(t, n, o);
                    });
              }
              addNodeLabels(e) {
                e.append('text')
                  .style('text-anchor', 'middle')
                  .style('dominant-baseline', 'central')
                  .each(function (e) {
                    let t = [e.residue.chemCompId, e.residue.authorResidueNumber];
                    for (let e = 0; e < t.length; e++)
                      (0, o.default)(this)
                        .append('tspan')
                        .attr('dy', 30 * e - 10)
                        .attr('x', 0)
                        .text(t[e]);
                  });
              }
              selectLigand(e, t, n) {
                this.fireExternalNodeEvent(e, y.interactionClickEvent),
                  e.residue.isLigand &&
                    (this.nodeDim(e, t, n),
                    this.nodeMouseoutEventHandler(e, t, n),
                    this.showLigandLabel(e),
                    this.initLigandInteractions(this.pdbId, e.residue.authorResidueNumber, e.residue.chainId));
              }
              processError(e, t) {
                throw (
                  (this.canvas
                    .append('text')
                    .classed('pdb-lig-env-svg-node', !0)
                    .attr('dominant-baseline', 'center')
                    .attr('text-anchor', 'middle')
                    .attr('x', this.parent.clientWidth / 2)
                    .attr('y', this.parent.clientHeight / 2)
                    .text(t),
                  e)
                );
              }
              async setupLigandScene() {
                this.wipeOutVisuals(),
                  this.setupLinks(),
                  this.presentBindingSite.interactionNodes
                    .filter((e) => !e.residue.isLigand)
                    .forEach((e) => {
                      let t = this.presentBindingSite.links.filter((t) => t.containsNode(e) && 'hydrophobic' !== t.getLinkClass()),
                        n = (t = 0 == t.length ? this.presentBindingSite.links.filter((t) => t.containsNode(e)) : t).map((e) =>
                          e.interaction.flatMap((e) => e.sourceAtoms)
                        ),
                        o = n.flat(),
                        s = this.depiction.getInitalNodePosition(o);
                      (e.x = s.x + 55 * Math.random()), (e.y = s.y + 55 * Math.random());
                    }),
                  this.presentBindingSite.interactionNodes.forEach((e) => this.rProvider.downloadAnnotation(e.residue)),
                  await Promise.all(this.rProvider.downloadPromises),
                  await Promise.all([this.visualsMapper.graphicsPromise, this.visualsMapper.mappingPromise]),
                  (this.nodes = this.nodesRoot.append('g').selectAll().data(this.presentBindingSite.interactionNodes).enter().append('g')),
                  this.nodes
                    .filter((e) => !e.residue.isLigand)
                    .attr('class', (e) => `pdb-lig-env-svg-node pdb-lig-env-svg-${e.residue.getResidueType()}-res`)
                    .on('mouseenter', (e, t) => {
                      const { index: n, group: o } = this.getIndexAndGroup(e);
                      this.nodeMouseoverEventHandler(t, n, o);
                    })
                    .on('mouseleave', (e, t) => {
                      const { index: n, group: o } = this.getIndexAndGroup(e);
                      this.nodeMouseoutEventHandler(t, n, o);
                    }),
                  this.nodes
                    .filter((e) => !e.residue.isLigand && this.visualsMapper.glycanMapping.has(e.residue.chemCompId))
                    .html((e) => this.visualsMapper.getGlycanImage(e.residue.chemCompId)),
                  this.nodes
                    .filter((e) => !this.visualsMapper.glycanMapping.has(e.residue.chemCompId))
                    .append('circle')
                    .attr('r', (e) => e.scale * y.nodeSize);
                let e = this.nodes.filter((e) => !e.residue.isLigand);
                this.addNodeLabels(e);
                let t = (0, d.default)()
                    .links(this.links.filter((e) => 'hydrophobic' !== e.getLinkClass()))
                    .distance(5),
                  n = (0, a.default)().strength(-80).distanceMin(10).distanceMax(20),
                  o = (0, l.default)(50).iterations(10).strength(0.5);
                return (
                  (this.simulation = (0, c.default)(this.presentBindingSite.interactionNodes)
                    .force('link', t)
                    .force('charge', n)
                    .force('collision', o)
                    .on('tick', () => this.simulationStep())),
                  this.dragHandler(this.nodes),
                  void 0 !== this.zoomHandler &&
                    (this.zoomHandler(this.svg, s.zoomIdentity),
                    this.disableScrollControlsIfNeeded(this.uiParameters),
                    this.disableScrollZoomIfNeeded(this.uiParameters)),
                  this.showRenderMessage(!0),
                  new Promise((e) => {
                    const t = () => {
                      var n, o, s, r;
                      this.simulation.alpha() < 0.5 && this.centerScene();
                      const i = this.simulation.alpha() < 0.05,
                        d = (null === (o = null === (n = this.nodes) || void 0 === n ? void 0 : n.size) || void 0 === o ? void 0 : o.call(n)) > 0,
                        a = (null === (r = null === (s = this.links) || void 0 === s ? void 0 : s.size) || void 0 === r ? void 0 : r.call(s)) > 0;
                      i && d && a ? (this.showRenderMessage(!1), e()) : requestAnimationFrame(t);
                    };
                    requestAnimationFrame(t);
                  })
                );
              }
              async setupScene() {
                this.wipeOutVisuals(),
                  this.setupLinks(),
                  this.presentBindingSite.interactionNodes.forEach((e) => this.rProvider.downloadAnnotation(e.residue)),
                  await Promise.all(this.rProvider.downloadPromises),
                  await Promise.all([this.visualsMapper.graphicsPromise, this.visualsMapper.mappingPromise]),
                  (this.nodes = this.nodesRoot
                    .selectAll()
                    .data(this.presentBindingSite.interactionNodes)
                    .enter()
                    .append('g')
                    .attr('class', (e) => `pdb-lig-env-svg-node pdb-lig-env-svg-${e.residue.getResidueType()}-res`)
                    .on('click', (e, t) => {
                      const { index: n, group: o } = this.getIndexAndGroup(e);
                      this.selectLigand(t, n, o);
                    })
                    .on('mouseenter', (e, t) => {
                      const { index: n, group: o } = this.getIndexAndGroup(e);
                      this.nodeMouseoverEventHandler(t, n, o);
                    })
                    .on('mouseleave', (e, t) => {
                      const { index: n, group: o } = this.getIndexAndGroup(e);
                      this.nodeMouseoutEventHandler(t, n, o);
                    })),
                  this.nodes
                    .filter((e) => this.visualsMapper.glycanMapping.has(e.residue.chemCompId))
                    .html((e) => this.visualsMapper.getGlycanImage(e.residue.chemCompId)),
                  this.nodes
                    .filter((e) => !this.visualsMapper.glycanMapping.has(e.residue.chemCompId))
                    .append('circle')
                    .attr('r', y.nodeSize),
                  this.addNodeLabels(this.nodes);
                let e = (0, d.default)()
                    .links(this.presentBindingSite.links)
                    .distance((e) => (e.source.residue.isLigand && e.target.residue.isLigand ? 55 : 150))
                    .strength(0.5),
                  t = (0, a.default)().strength(-1e3).distanceMin(55).distanceMax(250),
                  n = (0, l.default)(45),
                  o = (0, i.default)(this.parent.offsetWidth / 2, this.parent.offsetHeight / 2);
                return (
                  (this.simulation = (0, c.default)(this.presentBindingSite.interactionNodes)
                    .force('link', e)
                    .force('charge', t)
                    .force('collision', n)
                    .force('center', o)
                    .on('tick', () => this.simulationStep())),
                  this.dragHandler(this.nodes),
                  void 0 !== this.zoomHandler &&
                    (this.zoomHandler(this.svg, s.zoomIdentity),
                    this.disableScrollControlsIfNeeded(this.uiParameters),
                    this.disableScrollZoomIfNeeded(this.uiParameters)),
                  this.showRenderMessage(!0),
                  new Promise((e) => {
                    const t = () => {
                      var n, o, s, r;
                      this.simulation.alpha() < 0.5 && this.centerScene();
                      const i = this.simulation.alpha() < 0.05,
                        d = (null === (o = null === (n = this.nodes) || void 0 === n ? void 0 : n.size) || void 0 === o ? void 0 : o.call(n)) > 0,
                        a = (null === (r = null === (s = this.links) || void 0 === s ? void 0 : s.size) || void 0 === r ? void 0 : r.call(s)) > 0;
                      i && d && a ? (this.showRenderMessage(!1), e()) : requestAnimationFrame(t);
                    };
                    requestAnimationFrame(t);
                  })
                );
              }
              simulationStep() {
                this.nodes.attr('transform', (e) => `translate(${e.x},${e.y}) scale(${e.scale})`),
                  this.links
                    .selectAll('line')
                    .attr('x1', (e) => e.source.x)
                    .attr('y1', (e) => e.source.y)
                    .attr('x2', (e) => e.target.x)
                    .attr('y2', (e) => e.target.y);
              }
              nodeHighlight(e, t, n) {
                (e.scale = 1.5),
                  e.residue.isLigand && (0, o.default)(n[t]).style('cursor', 'pointer'),
                  (0, o.default)(n[t]).attr('transform', () => `translate(${e.x},${e.y}) scale(${e.scale})`);
                let s = [e];
                this.links
                  .filter((t) => t.containsNode(e))
                  .each((t) => {
                    let n = t.getOtherNode(e);
                    s.push(n);
                  }),
                  this.nodes.filter((e) => !s.includes(e)).attr('opacity', 0.4),
                  this.links.filter((t) => !t.containsNode(e)).attr('opacity', 0.4);
              }
              nodeDim(e, t, n) {
                e.static || (e.scale = 1),
                  e.residue.isLigand && (0, o.default)(n[t]).style('cursor', 'default'),
                  (0, o.default)(n[t]).attr('transform', `translate(${e.x},${e.y}) scale(${e.scale})`);
              }
              linkHighlight(e, t, n) {
                let s = (0, o.default)(n[t]).node().parentNode;
                (0, o.default)(s).classed('pdb-lig-env-svg-bond-highlighted', !0),
                  this.links.filter((t) => t !== e).attr('opacity', 0.4),
                  this.nodes.filter((t) => !(t === e.source || t === e.target)).attr('opacity', 0.4);
              }
              linkDim(e, t, n) {
                let s = (0, o.default)(n[t]).node().parentNode;
                (0, o.default)(s).classed('pdb-lig-env-svg-bond-highlighted', !1),
                  this.links.filter((t) => t !== e).attr('opacity', 1),
                  this.nodes.filter((t) => !(t === e.source || t === e.target)).attr('opacity', 1);
              }
              showLigandLabel(e) {
                const t = new CustomEvent(y.interactionShowLabelEvent, { bubbles: !0, detail: { label: e.toTooltip() } });
                this.parent.dispatchEvent(t);
              }
              addMarkers() {
                let e = this.svg.append('defs');
                e.append('style').text("@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@200&display=swap');");
                let t = e.append('filter').attr('x', 0).attr('y', 0).attr('width', 1).attr('height', 1).attr('id', 'solid-background');
                t.append('feFlood').attr('flood-color', 'white'),
                  t.append('feComposite').attr('in', 'SourceGraphic'),
                  e
                    .append('marker')
                    .attr('id', 'clash')
                    .attr('markerWidth', 15)
                    .attr('markerHeight', 15)
                    .attr('refX', 7)
                    .attr('refY', 3)
                    .attr('orient', 'auto')
                    .attr('markerUnits', 'strokeWidth')
                    .append('path')
                    .attr(
                      'd',
                      'M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z'
                    )
                    .attr('style', 'stroke:#FF5050;stroke-width:3px;');
              }
              parseEnvironment(e) {
                let t = void 0;
                if (void 0 === e) t = _.Environment.Production;
                else
                  switch ((e = e.toLowerCase())) {
                    case 'production':
                    case 'prod':
                      t = _.Environment.Production;
                      break;
                    case 'development':
                    case 'dev':
                      t = _.Environment.Development;
                      break;
                    case 'internal':
                    case 'int':
                      t = _.Environment.Internal;
                      break;
                    default:
                      console.log(`Unknown environment ${e}. Using production instead.`), (t = _.Environment.Production);
                  }
                return t;
              }
            },
        });
      var o = n('./node_modules/d3-selection/src/select.js'),
        s = n('./node_modules/d3-zoom/src/index.js'),
        r = n('./node_modules/d3-drag/src/drag.js'),
        i = n('./node_modules/d3-force/src/center.js'),
        d = n('./node_modules/d3-force/src/link.js'),
        a = n('./node_modules/d3-force/src/manyBody.js'),
        l = n('./node_modules/d3-force/src/collide.js'),
        c = n('./node_modules/d3-force/src/simulation.js'),
        u = n('./node_modules/d3-array/src/min.js'),
        f = n('./node_modules/d3-array/src/max.js'),
        h = n('./node_modules/d3-fetch/src/json.js'),
        m = n('./node_modules/d3-fetch/src/text.js'),
        p = n('./src/plugin/depiction.ts'),
        _ = n('./src/plugin/model.ts'),
        g = n('./src/plugin/visualsMapping.ts'),
        v = n('./src/plugin/ui.ts'),
        b = n('./src/plugin/resources.ts'),
        y = n('./src/plugin/config.ts'),
        j = n('./src/plugin/residuefactory.ts');
    },
    './src/plugin/model.ts': (e, t, n) => {
      n.r(t),
        n.d(t, {
          BindingSite: () =>
            class {
              constructor() {
                (this.residues = new Array()), (this.interactionNodes = new Array()), (this.links = new Array());
              }
              fromBoundMolecule(e, t) {
                (this.pdbId = e),
                  (this.bmId = t.bm_id),
                  (this.tmpResidueSet = new c.ObjectSet()),
                  (this.tmpNodesSet = new c.ObjectSet()),
                  t.composition.ligands.forEach((e) => this.tmpResidueSet.tryAdd(new h(e, !0))),
                  t.interactions.forEach((e) => {
                    let t = this.processResidueInteractionPartner(e.begin),
                      n = this.processResidueInteractionPartner(e.end),
                      o = new _(t, n, e.interactions);
                    this.links.push(o);
                  });
                let n = Array.from(this.tmpNodesSet);
                return (
                  t.composition.connections.forEach((e) => {
                    let t = n.find((t) => t.residue.id === e[0]),
                      o = n.find((t) => t.residue.id === e[1]),
                      s = this.links.find((e) => e.containsBothNodes(t, o));
                    if (void 0 === s) {
                      let e = new _(t, o, { atom_atom: ['covalent'] });
                      this.links.push(e);
                    }
                  }),
                  (this.residues = Array.from(this.tmpResidueSet)),
                  (this.interactionNodes = Array.from(this.tmpNodesSet)),
                  this
                );
              }
              processResidueInteractionPartner(e) {
                let t = new h(e, !1);
                t = this.tmpResidueSet.tryAdd(t);
                let n = new m(t, 1, t.id);
                return (n = this.tmpNodesSet.tryAdd(n));
              }
              processLigandInteractionPartner(e, t, n) {
                let o = 0;
                o = e.isLigand ? (n.length > 1 ? 0.5 : 0) : 1;
                let s = t.getCenter(n),
                  r = `${e.id}_${n.sort().reduce((e, t) => e + '_' + t)}`,
                  i = new m(e, o, r, s.x, s.y);
                return (i = this.tmpNodesSet.tryAdd(i));
              }
              fromLigand(e, t, n) {
                (this.pdbId = e),
                  (this.bmId = `${t.ligand.chem_comp_id}_${t.ligand.chain_id}_${t.ligand.author_residue_number}`),
                  (this.tmpResidueSet = new c.ObjectSet()),
                  (this.tmpNodesSet = new c.ObjectSet());
                let o = new Array(),
                  s = new h(t.ligand, !0);
                return (
                  this.tmpResidueSet.tryAdd(s),
                  n.atoms.forEach((e) => this.processLigandInteractionPartner(s, n, [e.name])),
                  t.interactions.forEach((e) => {
                    let t = this.processLigandInteractionPartner(s, n, e.ligand_atoms),
                      r = this.processResidueInteractionPartner(e.end);
                    if (t.residue.equals(r.residue)) return void this.tmpNodesSet.delete(r);
                    let i = o.find((e) => e.containsBothNodes(t, r));
                    if (void 0 !== i) i.addInteraction(e.ligand_atoms, e.end.atom_names, e.interaction_type, e.interaction_details, e.distance);
                    else {
                      let n = new g(t, r, e.ligand_atoms, e.end.atom_names, e.interaction_type, e.interaction_details, e.distance);
                      o.push(n);
                    }
                  }),
                  (this.interactionNodes = Array.from(this.tmpNodesSet)),
                  (this.links = this.filterOutAromaticAtomAtomInteractions(o)),
                  this
                );
              }
              filterOutAromaticAtomAtomInteractions(e) {
                let t = new Array();
                for (const n of e) {
                  let s = n.interaction.map((e) => e.interactionType).every((e) => e === o.AtomAtom);
                  if ('aromatic' === n.getLinkClass() && s) {
                    let t = n.interaction.map((e) => e.targetAtoms);
                    if (0 == t.length) continue;
                    const o = t.reduce((e, t) => e.concat(t), []);
                    let s = new Set(e.filter((e) => e.target.equals(n.target)));
                    s.delete(n);
                    let r = Array.from(s)
                      .map((e) => e.interaction)
                      .reduce((e, t) => e.concat(t), [])
                      .map((e) => e.targetAtoms)
                      .reduce((e, t) => e.concat(t), []);
                    if (r.includes(o[0])) continue;
                  }
                  t.push(n);
                }
                return t;
              }
            },
          Environment: () => s,
          Gradient: () =>
            class {
              constructor(e, t) {
                (this.weight = e), (this.colorScheme = t);
              }
              getScales() {
                var e, t;
                const n = `scheme${this.colorScheme}`,
                  o = null !== (t = null === (e = d[n]) || void 0 === e ? void 0 : e[9]) && void 0 !== t ? t : ['#ccc'],
                  s = Number((0, r.default)(this.weight)),
                  a = {
                    firstScale: new v((0, i.default)([0, s], [20, 30]), (0, i.default)([0, s], ['#FFFFFF', o[4]])),
                    secondScale: new v((0, i.default)([0, s], [10, 20]), (0, i.default)([0, s], [o[5], o[7]])),
                    thirdScale: new v((0, i.default)([0, s], [2, 10]), (0, i.default)([0, s], [o[8], o[9]])),
                  };
                return a;
              }
            },
          Interaction: () => f,
          InteractionNode: () => m,
          InteractionType: () => o,
          InteractionTypeUtil: () => u,
          LigandIntx: () =>
            class {
              constructor(e, t) {
                (this.data = e), (this.contactTypes = t), (this.filteredData = this.getFilteredData());
              }
              getFilteredData() {
                const e = new Array(),
                  t = Object.keys(this.data);
                if (this.contactTypes.includes('TOTAL')) for (const n of t) e.push(...this.data[n]);
                else for (const n of this.contactTypes) t.includes(n) && e.push(...this.data[n]);
                return e;
              }
              getAtomIntxPropensity() {
                const e = new Array();
                this.filteredData.reduce(function (t, n) {
                  return t[n.atom] || ((t[n.atom] = { atom: n.atom, count: 0 }), e.push(t[n.atom])), (t[n.atom].count += n.count), t;
                }, {});
                const t = e.reduce(function (e, t) {
                    return (e += t.count);
                  }, 0),
                  n = e.map((e) => ({ atom: e.atom, value: (e.count / t) * 100 }));
                return n;
              }
            },
          LigandResidueLink: () => g,
          Link: () => p,
          Residue: () => h,
          ResidueResidueLink: () => _,
          Scale: () => v,
        });
      var o,
        s,
        r = n('./node_modules/d3-array/src/max.js'),
        i = n('./node_modules/d3-scale/src/linear.js'),
        d = n('./node_modules/d3-scale-chromatic/src/index.js'),
        a = n('./src/plugin/residuefactory.ts'),
        l = n('./src/plugin/config.ts'),
        c = n('./src/plugin/objectSet.ts');
      !(function (e) {
        (e[(e.AtomAtom = 0)] = 'AtomAtom'),
          (e[(e.AtomPlane = 1)] = 'AtomPlane'),
          (e[(e.PlanePlane = 2)] = 'PlanePlane'),
          (e[(e.GroupPlane = 3)] = 'GroupPlane'),
          (e[(e.GroupGroup = 4)] = 'GroupGroup');
      })(o || (o = {})),
        (function (e) {
          (e[(e.Production = 0)] = 'Production'), (e[(e.Development = 1)] = 'Development'), (e[(e.Internal = 2)] = 'Internal');
        })(s || (s = {}));
      class u {
        static parse(e) {
          if ('atom_atom' === e) return o.AtomAtom;
          if ('atom_plane' === e) return o.AtomPlane;
          if ('plane_plane' === e) return o.PlanePlane;
          if ('group_plane' === e) return o.GroupPlane;
          if ('group_group' === e) return o.GroupGroup;
          throw `Interaction type ${e} does not exist`;
        }
      }
      class f {
        constructor(e, t, n, o, s) {
          (this.sourceAtoms = e), (this.targetAtoms = t), (this.interactionType = n), (this.interactionsClases = o), (this.distance = s);
        }
      }
      class h {
        constructor(e, t) {
          (this.chainId = e.chain_id),
            (this.authorResidueNumber = e.author_residue_number),
            (this.chemCompId = e.chem_comp_id),
            (this.authorInsertionCode = e.author_insertion_code),
            (this.id = `${this.chainId}${this.authorResidueNumber}${' ' === this.authorInsertionCode ? '' : this.authorInsertionCode}`),
            (this.isLigand = t);
        }
        getResidueType() {
          if (this.isLigand) return 'ligand';
          if ('HOH' === this.chemCompId) return 'water';
          let e = a.ResidueProvider.getInstance().getAminoAcidAbbreviation(this.chemCompId);
          if (e) for (let [t, n] of l.aaTypes) if (n.includes(e)) return t;
          return 'other';
        }
        equals(e) {
          return e instanceof h && this.id === e.id;
        }
        toString() {
          return this.id;
        }
      }
      class m {
        constructor(e, t, n, o, s) {
          (this.residue = e),
            (this.id = n),
            (this.static = Boolean(t < 1)),
            (this.scale = t),
            void 0 !== o && ((this.fx = o), (this.x = o)),
            void 0 !== s && ((this.fy = s), (this.y = s));
        }
        equals(e) {
          return e instanceof m && this.id === e.id && this.fx == e.fx && this.fy == e.fy;
        }
        toString() {
          let e = this.residue,
            t = e.chainId.split('_'),
            n = t[0],
            o = '';
          return t.length > 1 && (o = '1' !== t[1] ? `[${t[1]}]` : ''), `${e.chemCompId} | ${n}${o} | ${e.authorResidueNumber}${e.authorInsertionCode}`;
        }
        toTooltip() {
          return `<span>${this.toString()}</span>`;
        }
      }
      class p {
        constructor(e, t) {
          (this.source = e), (this.target = t);
        }
        containsBothNodes(e, t) {
          let n = this.source.equals(e) && this.target.equals(t),
            o = this.source.equals(t) && this.target.equals(e);
          return n || o;
        }
        containsNode(e) {
          return this.source.equals(e) || this.target.equals(e);
        }
        containsResidue(e) {
          return this.target.residue.equals(e) || this.source.residue.equals(e);
        }
        getOtherNode(e) {
          return this.source.equals(e) ? this.target : this.source;
        }
      }
      class _ extends p {
        constructor(e, t, n) {
          super(e, t),
            (this.interactions = new Map()),
            Object.keys(n).forEach((e) => {
              let t = u.parse(e);
              this.interactions.set(t, n[e]);
            });
        }
        hasClash() {
          return (
            this.interactions.forEach((e) => {
              if (e.includes('clash')) return !0;
            }),
            !1
          );
        }
        isBoundMoleculeLink() {
          var e;
          return (
            this.source.residue.isLigand &&
            this.target.residue.isLigand &&
            !0 === (null === (e = this.interactions.get(o.AtomAtom)) || void 0 === e ? void 0 : e.includes('covalent'))
          );
        }
        toTooltip() {
          let e = new Array();
          for (let t of this.interactions.values()) e = e.concat(t);
          return `<ul>${e.reduce((e, t) => `${e}, ${t}`)}</ul>`;
        }
        getLinkClass() {
          if (this.isBoundMoleculeLink()) return 'ligand';
          for (let [e, t] of l.interactionsClasses) for (let n of this.interactions.values()) if (n.filter((e) => -1 !== t.indexOf(e)).length > 0) return e;
          return 'other';
        }
      }
      class g extends p {
        constructor(e, t, n, o, s, r, i) {
          super(e, t), (this.interaction = new Array()), this.interaction.push(new f(n, o, u.parse(s.replace('-', '_')), r, i));
        }
        addInteraction(e, t, n, o, s) {
          this.interaction.push(new f(e, t, u.parse(n.replace('-', '_')), o, s));
        }
        getLinkClass() {
          let e = this.interaction.map((e) => e.interactionsClases).reduce((e, t) => e.concat(t));
          for (let [t, n] of l.interactionsClasses) if (e.filter((e) => -1 !== n.indexOf(e)).length > 0) return t;
          return 'other';
        }
        hasClash() {
          return (
            this.interaction.forEach((e) => {
              e.interactionsClases.forEach((e) => {
                if (e.includes('clash')) return !0;
              });
            }),
            !1
          );
        }
        toTooltip() {
          let e = new Set(),
            t = a.ResidueProvider.getInstance();
          return (
            this.interaction.forEach((n) => {
              let o = !this.target.residue.isLigand && n.targetAtoms.every((e) => l.backboneAtoms.includes(e)),
                s = t.getAminoAcidAbbreviation(this.target.residue.chemCompId);
              s || console.warn('undefined targetAbbreviation in toTooltip()');
              let r = Boolean('X' !== s),
                i = '';
              (i = o && r ? 'backbone' : !o && r ? 'side chain' : 'ligand'),
                e.add(`<li><span>${i}</span> interaction (<b>${n.targetAtoms}</b> | ${n.interactionsClases}): ${n.distance}Å</li>`);
            }),
            `<ul>${Array.from(e.values()).join('\n')}</ul>`
          );
        }
      }
      class v {
        constructor(e, t) {
          (this.radiusScale = e), (this.colorScale = t);
        }
      }
    },
    './src/plugin/objectSet.ts': (e, t, n) => {
      n.r(t), n.d(t, { ObjectSet: () => o });
      class o extends Set {
        tryAdd(e) {
          let t = void 0;
          return (
            this.forEach((n) => {
              n.equals(e) && (t = n);
            }),
            void 0 === t && ((t = e), super.add(e)),
            t
          );
        }
      }
    },
    './src/plugin/residuefactory.ts': (e, t, n) => {
      n.r(t), n.d(t, { ResidueProvider: () => d });
      var o = n('./node_modules/d3-fetch/src/json.js'),
        s = n('./src/plugin/model.ts'),
        r = n('./src/plugin/resources.ts'),
        i = n('./src/plugin/config.ts');
      class d {
        constructor(e) {
          (this.environment = e), (this.mapping = new Map(i.aaAbreviations)), (this.downloadPromises = new Array());
        }
        static getInstance(e = s.Environment.Production) {
          return d.instance || (d.instance = new d(e)), d.instance;
        }
        getAminoAcidAbbreviation(e) {
          return this.mapping.has(e) ? this.mapping.get(e) : void 0;
        }
        downloadAnnotation(e) {
          if (this.mapping.has(e.chemCompId) || e.isLigand) return;
          let t = r.residueTypeAPI(e.chemCompId, this.environment),
            n = (0, o.default)(t).then((t) => {
              let n = t[e.chemCompId][0].one_letter_code;
              return this.mapping.set(e.chemCompId, n), n;
            });
          this.downloadPromises.push(n);
        }
      }
    },
    './src/plugin/resources.ts': (e, t, n) => {
      n.r(t),
        n.d(t, {
          boundLigandURL: () => l,
          boundMoleculeAPI: () =>
            function (e, t, n) {
              let a = '';
              switch (n) {
                case o.Environment.Development:
                  a = `${r}/${d}/${e}/${t}`;
                  break;
                case o.Environment.Internal:
                  a = `${i}/${d}/${e}/${t}`;
                  break;
                default:
                  a = `${s}/${d}/${e}/${t}`;
              }
              return a;
            },
          boundMoleculeURL: () => d,
          carbohydratePolymerAPI: () =>
            function (e, t, n, d) {
              let l = '';
              switch (d) {
                case o.Environment.Development:
                  l = `${r}/${a}/${e}/${t}/${n}`;
                  break;
                case o.Environment.Internal:
                  l = `${i}/${a}/${e}/${t}/${n}`;
                  break;
                default:
                  l = `${s}/${a}/${e}/${t}/${n}`;
              }
              return l;
            },
          carbohydrateURL: () => a,
          componentLibraryURL: () => u,
          compoundSummaryURL: () => c,
          devAPI: () => r,
          glycanSymbolsAPI: () =>
            function (e) {
              let t = '';
              switch (e) {
                case o.Environment.Internal:
                case o.Environment.Development:
                  t = `${r}/${u}/pdb-snfg-visuals.xml`;
                  break;
                default:
                  t = `${s}/${u}/pdb-snfg-visuals.xml`;
              }
              return t;
            },
          hetMappingAPI: () =>
            function (e) {
              let t = '';
              switch (e) {
                case o.Environment.Internal:
                case o.Environment.Development:
                  t = `${r}/${u}/het_mapping.json`;
                  break;
                default:
                  t = `${s}/${u}/het_mapping.json`;
              }
              return t;
            },
          intAPI: () => i,
          interactionAPI: () =>
            function (e, t) {
              let n = '';
              switch (t) {
                case o.Environment.Development:
                  n = `${r}/${h}/${e}`;
                  break;
                case o.Environment.Internal:
                  n = `${i}/${h}/${e}`;
                  break;
                default:
                  n = `${s}/${h}/${e}`;
              }
              return n;
            },
          interactionURL: () => h,
          ligEnvCSSAPI: () =>
            function (e) {
              let t = '';
              switch (e) {
                case o.Environment.Internal:
                case o.Environment.Development:
                  t = `${r}/pdb-component-library/css/pdb-ligand-env-svg.css`;
                  break;
                default:
                  t = `${s}/pdb-component-library/css/pdb-ligand-env-svg.css`;
              }
              return t;
            },
          ligandAnnotationAPI: () =>
            function (e, t) {
              let n = '';
              switch (t) {
                case o.Environment.Production:
                  n = `${s}/${f}/${e}/annotation`;
                  break;
                case o.Environment.Development:
                case o.Environment.Internal:
                  n = `${r}/${f}/${e}/annotation`;
              }
              return n;
            },
          ligandInteractionsAPI: () =>
            function (e, t, n, d) {
              let a = '';
              switch (d) {
                case o.Environment.Development:
                  a = `${r}/${l}/${e}/${t}/${n}`;
                  break;
                case o.Environment.Internal:
                  a = `${i}/${l}/${e}/${t}/${n}`;
                  break;
                default:
                  a = `${s}/${l}/${e}/${t}/${n}`;
              }
              return a;
            },
          productionAPI: () => s,
          residueTypeAPI: () =>
            function (e, t) {
              let n = '';
              switch (t) {
                case o.Environment.Development:
                  n = `${r}/${c}/${e}`;
                  break;
                case o.Environment.Internal:
                  n = `${i}/${c}/${e}`;
                  break;
                default:
                  n = `${s}/${c}/${e}`;
              }
              return n;
            },
          staticFilesURL: () => f,
        });
      var o = n('./src/plugin/model.ts');
      const s = 'https://www.ebi.ac.uk/pdbe',
        r = 'https://wwwdev.ebi.ac.uk/pdbe',
        i = 'https://wwwint.ebi.ac.uk/pdbe',
        d = 'graph-api/pdb/bound_molecule_interactions',
        a = 'graph-api/pdb/carbohydrate_polymer_interactions',
        l = 'graph-api/pdb/bound_ligand_interactions',
        c = 'api/pdb/compound/summary',
        u = 'pdb-component-library/data/ligand-env',
        f = 'static/files/pdbechem_v2',
        h = 'aggregated-api/compound/interaction';
    },
    './src/plugin/ui.ts': (e, t, n) => {
      n.r(t),
        n.d(t, {
          UI: () =>
            class {
              constructor(e, t) {
                (this.parent = e), (this.display = t), (this.originalWidth = this.parent.offsetWidth), (this.originalHeight = this.parent.offsetHeight);
              }
              register(e) {
                let t = void 0,
                  n = void 0;
                if (e.menu) {
                  (t = (0, o.default)(this.parent)
                    .append('div')
                    .classed('pdb-lig-env-toolbar-container', !0)
                    .on('mouseover', () => this.displayToolbarPanel(!0))
                    .on('mouseout', () => this.displayToolbarPanel(!1)))
                    .append('div')
                    .classed('pdb-lig-env-menu-panel', !0)
                    .append('i')
                    .attr('title', 'Menu')
                    .attr('class', 'icon icon-common icon-bars'),
                    (n = t
                      .append('div')
                      .classed('pdb-lig-env-menu-panel', !0)
                      .attr('id', 'pdb-lig-env-menu-dynamic-panel')
                      .style('display', 'none')
                      .style('opacity', 0));
                  const s = (0, o.default)('body')
                    .append('div')
                    .attr('class', 'pdb-lig-env-quick-tooltip')
                    .style('width', '100px')
                    .style('position', 'absolute')
                    .style('pointer-events', 'none')
                    .style('background', 'rgba(0,0,0,0.75)')
                    .style('color', '#fff')
                    .style('padding', '4px 6px')
                    .style('border-radius', '4px')
                    .style('font-size', '14px')
                    .style('opacity', '0')
                    .style('transition', 'opacity 0.1s ease')
                    .style('z-index', '1');
                  if (e.help) {
                    n.append('i')
                      .attr('id', 'pdb-lig-env-help-btn')
                      .attr('about', 'Display legends')
                      .attr('class', 'icon icon-common icon-question-circle')
                      .on('click', () => this.showHelp());
                    let e = (0, o.default)(this.parent).append('div').attr('id', 'pdb-lig-env-help-container'),
                      t = e.append('div').classed('pdb-lig-env-help-navbar', !0);
                    t
                      .append('a')
                      .classed('active', !0)
                      .attr('id', 'pdb-lig-env-help-residues-btn')
                      .text('Ligands and residues')
                      .on('click', () => this.changeHelp(!0)),
                      t
                        .append('a')
                        .attr('id', 'pdb-lig-env-help-bonds-btn')
                        .text('Interactions')
                        .on('click', () => this.changeHelp(!1)),
                      e.append('div').attr('id', 'pdb-lig-env-help-ligands').html(r),
                      e.append('div').attr('id', 'pdb-lig-env-help-bonds').html(i);
                  }
                  e.downloadImage &&
                    n
                      .append('i')
                      .attr('id', 'pdb-lig-env-screenshot-btn')
                      .attr('about', 'Download image (svg)')
                      .attr('class', 'icon icon-common icon-camera')
                      .on('click', () => this.saveSVG()),
                    e.downloadData &&
                      n
                        .append('i')
                        .attr('id', 'pdb-lig-env-download-btn')
                        .attr('about', 'Download interactions (json)')
                        .attr('class', 'icon icon-common icon-download')
                        .on('click', () => this.download()),
                    e.center &&
                      n
                        .append('i')
                        .attr('id', 'pdb-lig-env-center-btn')
                        .attr('about', 'Center visualisation')
                        .attr('class', 'icon icon-common icon-crosshairs')
                        .on('click', () => this.center()),
                    e.fullScreen &&
                      n
                        .append('i')
                        .attr('id', 'pdb-lig-env-fullscreen-btn')
                        .attr('about', 'Toggle fullscreen mode')
                        .attr('class', 'icon icon-common icon-fullscreen')
                        .on('click', () => this.fullScreen()),
                    e.reinitialize &&
                      n
                        .append('i')
                        .attr('id', 'pdb-lig-env-home-btn')
                        .attr('about', 'Reinitialize visualisation')
                        .attr('class', 'icon icon-common icon-sync-alt')
                        .on('click', () => this.reinitialize()),
                    e.names &&
                      n
                        .append('i')
                        .attr('id', 'pdb-lig-env-names-btn')
                        .attr('about', 'Show/hide atom names')
                        .attr('class', 'icon icon-common icon-font')
                        .classed('active', !1)
                        .on('click', () => this.showNames()),
                    n
                      .selectAll('i')
                      .on('mouseenter', function (e) {
                        const t = (0, o.default)(this).attr('about');
                        t &&
                          s
                            .text(t)
                            .style('opacity', '1')
                            .style('left', e.pageX + 15 + 'px')
                            .style('top', e.pageY + 15 + 'px');
                      })
                      .on('mousemove', function (e) {
                        s.style('left', e.pageX + 15 + 'px').style('top', e.pageY + 15 + 'px');
                      })
                      .on('mouseleave', function () {
                        s.style('opacity', '0');
                      });
                }
                e.tooltip &&
                  (this.tooltip = (0, o.default)(this.parent).append('div').classed('pdb-lig-env-label', !0).attr('id', 'pdb-lig-env-tooltip').style('opacity', 0)),
                  e.residueLabel &&
                    (this.residueLabel = (0, o.default)(this.parent)
                      .append('div')
                      .classed('pdb-lig-env-label', !0)
                      .attr('id', 'pdb-lig-env-residue-label')
                      .style('opacity', 0)),
                  void 0 !== this.tooltip &&
                    (this.parent.addEventListener(s.interactionClickEvent, (e) => this.nodeMouseEnterEventHandler(e)),
                    this.parent.addEventListener(s.interactionMouseoverEvent, (e) => this.nodeMouseEnterEventHandler(e)),
                    this.parent.addEventListener(s.interactionMouseoutEvent, () => this.nodeMouseLeaveEventHandler()),
                    this.parent.addEventListener(s.LigandShowAtomEvent, (e) => this.nodeMouseEnterEventHandler(e)),
                    this.parent.addEventListener(s.LigandHideAtomEvent, () => this.nodeMouseLeaveEventHandler())),
                  void 0 !== this.residueLabel &&
                    (this.parent.addEventListener(s.interactionShowLabelEvent, (e) => this.showLigandLabel(e)),
                    this.parent.addEventListener(s.interactionHideLabelEvent, () => this.hideLigandLabel()));
              }
              saveSVG() {
                this.display.saveSvg();
              }
              reinitialize() {
                this.display.reinitialize();
              }
              download() {
                this.display.downloadInteractionsData();
              }
              center() {
                this.display.centerScene();
              }
              changeHelp(e) {
                let t = (0, o.default)(this.parent).select('#pdb-lig-env-help-residues-btn'),
                  n = (0, o.default)(this.parent).select('#pdb-lig-env-help-bonds-btn'),
                  s = (0, o.default)(this.parent).select('#pdb-lig-env-help-bonds'),
                  r = (0, o.default)(this.parent).select('#pdb-lig-env-help-ligands');
                e
                  ? (n.classed('active', !1), t.classed('active', !0), s.style('display', 'none'), r.style('display', 'block'))
                  : (t.classed('active', !1), n.classed('active', !0), s.style('display', 'block'), r.style('display', 'none'));
              }
              showNames() {
                let e = (0, o.default)(this.parent).select('#pdb-lig-env-names-btn'),
                  t = e.classed('active');
                t
                  ? (this.display.toggleDepiction(!1), e.style('color', '#637ca0'), e.classed('active', !1))
                  : (this.display.toggleDepiction(!0), e.style('color', ''), e.classed('active', !0));
              }
              showHelp() {
                let e = (0, o.default)(this.parent).select('#pdb-lig-env-help-container'),
                  t = (0, o.default)(this.parent).select('#pdb-lig-env-help-btn');
                'block' === e.style('display')
                  ? (e.style('display', 'none'), e.style('opacity', 0), t.style('color', ''))
                  : (e.style('display', 'block'), e.style('opacity', 1), t.style('color', '#637ca0'));
              }
              displayToolbarPanel(e) {
                let t = (0, o.default)(this.parent).select('#pdb-lig-env-menu-dynamic-panel'),
                  n = (0, o.default)(this.parent).select('#pdb-lig-env-help-container');
                (t || n) &&
                  (e || 'block' === n.style('display')
                    ? (t.style('display', 'block'), t.style('opacity', 0.9))
                    : (t.style('display', 'none'), t.style('opacity', 0)));
              }
              fullScreen() {
                let e = (0, o.default)(this.parent).select('#pdb-lig-env-fullscreen-btn');
                'icon icon-common icon-fullscreen' === e.attr('class')
                  ? ((this.display.fullScreen = !0),
                    (this.parent.parentElement.style.width = '100%'),
                    (this.parent.parentElement.style.height = '100%'),
                    (this.parent.parentElement.style.position = 'fixed'),
                    (this.parent.parentElement.style.top = '0'),
                    (this.parent.parentElement.style.left = '0'),
                    (this.parent.parentElement.style.zIndex = '10000000000000'),
                    e.classed('icon-fullscreen', !1),
                    e.classed('icon-fullscreen-collapse', !0),
                    this.display.centerScene())
                  : ((this.display.fullScreen = !0),
                    (this.parent.parentElement.style.width = `${this.originalWidth}px`),
                    (this.parent.parentElement.style.height = `${this.originalHeight}px`),
                    (this.parent.parentElement.style.position = 'relative'),
                    (this.parent.parentElement.style.zIndex = ''),
                    e.classed('icon-fullscreen', !0),
                    e.classed('icon-fullscreen-collapse', !1),
                    this.display.centerScene());
              }
              nodeMouseEnterEventHandler(e) {
                this.tooltip && (this.tooltip.transition().duration(200).style('opacity', 0.9), this.tooltip.html(e.detail.tooltip));
              }
              nodeMouseLeaveEventHandler() {
                this.tooltip && this.tooltip.transition().duration(200).style('opacity', 0);
              }
              showLigandLabel(e) {
                this.residueLabel && (this.residueLabel.transition().duration(200).style('opacity', 0.9), this.residueLabel.html(e.detail.label));
              }
              hideLigandLabel() {
                this.residueLabel && this.residueLabel.transition().duration(200).style('opacity', 0);
              }
            },
        });
      var o = n('./node_modules/d3-selection/src/select.js'),
        s = n('./src/plugin/config.ts');
      n('./node_modules/d3-transition/src/index.js');
      let r =
          '\n    <table class=\'pdb-lig-env-help-table\'>\n        <tr>\n            <td>\n                <div class="pdb-lig-env-help-residue" style="background: #80A0F0; "></div>\n            </td>\n            <td>hydrophobic</td>\n            <td>\n                <div class="pdb-lig-env-help-residue" style="background: #C048C0;"></div>\n            </td>\n            <td>negatively charged</td>\n        </tr>\n        <tr>\n            <td>\n                <div class="pdb-lig-env-help-residue" style="background: #15A4A4;"></div>\n            </td>\n            <td>aromatic</td>\n            <td>\n                <div class="pdb-lig-env-help-residue" style="background: #15C015;"></div>\n            </td>\n            <td>polar</td>\n            <td>\n        </tr>\n        <tr>\n            <td>\n                <div class="pdb-lig-env-help-residue" style="background: #F08080;"></div>\n            </td>\n            <td>cystein</td>\n            <td>\n                <div class="pdb-lig-env-help-residue" style="background: #00BFFF;"></div>\n            </td>\n            <td>water</td>\n        </tr>\n        <tr>\n            <td>\n                <div class="pdb-lig-env-help-residue" style="background: #F01505;"></div>\n            </td>\n            <td>positively charged</td>\n            <td>\n                <div class="pdb-lig-env-help-residue" style="background: #F2F2F2;"></div>\n            </td>\n            <td>other</td>\n        </tr>\n        <tr>\n            <td>\n                 <div class="pdb-lig-env-help-residue" style="background: #F09048;"></div>\n            </td>\n            <td>glycine</td>\n            <td>\n                <div class="pdb-lig-env-help-residue" style="background: white; border: 1.2px solid black;"></div>\n            </td>\n            <td>bound molecule</td>\n        </tr>\n        <tr>\n        <td></td>\n        <td><a href="https://www.ncbi.nlm.nih.gov/glycans/snfg.html" target="blank">glycans (SNFG)</a></td>\n        <td></td>\n        <td></td>\n        </tr>\n    </table>\n    ',
        i =
          '\n<table class=\'pdb-lig-env-help-table\' style="border-bottom: 0.5px solid black; padding-bottom: 10px;">\n<tr>\n    <td>\n        <hr style="border: 0 none; border-top: 5px dashed #AD4379; background: none; height: 0;" />\n    </td>\n    <td>aromatic</td>\n    <td>\n            <hr style="border: 0 none; border-top: 5px dashed #FF5050; background: none; height: 0;" />\n    </td>\n    <td>clashes</td>\n</tr>\n<tr>\n    <td>\n            <hr style="border: 0 none; border-top: 5px solid black; background: none; height: 0;" />\n    </td>\n    <td>covalent</td>\n    <td>\n            <hr style="border: 0 none; border-top: 5px dashed #3F26BF; background: none; height: 0;" />\n    </td>\n    <td>electrostatic</td>\n\n</tr>\n<tr>\n    <td>\n        <hr style="border: 0 none; border-top: 5px solid #008080; background: none; height: 0;" />\n    </td>\n    <td>metal</td>\n    <td></td>\n    <td>hydrophobic</td>\n</tr>\n\n<tr>\n    <td>\n        <hr style="border: 0 none; border-top: 5px dashed #9B7653; background: none; height: 0;" />\n    </td>\n    <td>vdw</td>\n</tr>\n</table>';
    },
    './src/plugin/visualsMapping.ts': (e, t, n) => {
      n.r(t),
        n.d(t, {
          VisualsMapper: () =>
            class {
              constructor(e) {
                (this.glycanMapping = new Map()), (this.glycanImages = new Map());
                let t = r.glycanSymbolsAPI(e),
                  n = r.hetMappingAPI(e);
                (this.graphicsPromise = this.parseSymbols(t)), (this.mappingPromise = this.parseGlycanMapping(n));
              }
              getGlycanImage(e) {
                var t;
                return null !== (t = this.glycanImages.get(this.glycanMapping.get(e))) && void 0 !== t
                  ? t
                  : document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              }
              async parseSymbols(e) {
                return (0, o.default)(e).then((e) => {
                  let t = e.documentElement.getElementsByTagName('glycans')[0].getElementsByTagName('g');
                  for (let e of t) this.glycanImages.set(e.getAttribute('name'), e.outerHTML);
                });
              }
              async parseGlycanMapping(e) {
                return (0, s.default)(e).then((e) => {
                  e.forEach((e) => e.het_codes.forEach((t) => this.glycanMapping.set(t, e.name)));
                });
              }
            },
        });
      var o = n('./node_modules/d3-fetch/src/xml.js'),
        s = n('./node_modules/d3-fetch/src/json.js'),
        r = n('./src/plugin/resources.ts');
    },
    './node_modules/d3-selection/src/array.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return null == e ? [] : Array.isArray(e) ? e : Array.from(e);
            },
        });
    },
    './node_modules/d3-selection/src/constant.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return function () {
                return e;
              };
            },
        });
    },
    './node_modules/d3-selection/src/creator.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = (0, o.default)(e);
              return (
                t.local
                  ? function (e) {
                      return function () {
                        return this.ownerDocument.createElementNS(e.space, e.local);
                      };
                    }
                  : function (e) {
                      return function () {
                        var t = this.ownerDocument,
                          n = this.namespaceURI;
                        return n === s.xhtml && t.documentElement.namespaceURI === s.xhtml ? t.createElement(e) : t.createElementNS(n, e);
                      };
                    }
              )(t);
            },
        });
      var o = n('./node_modules/d3-selection/src/namespace.js'),
        s = n('./node_modules/d3-selection/src/namespaces.js');
    },
    './node_modules/d3-selection/src/matcher.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          childMatcher: () =>
            function (e) {
              return function (t) {
                return t.matches(e);
              };
            },
          default: () =>
            function (e) {
              return function () {
                return this.matches(e);
              };
            },
        });
    },
    './node_modules/d3-selection/src/namespace.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = (e += ''),
                n = t.indexOf(':');
              n >= 0 && 'xmlns' !== (t = e.slice(0, n)) && (e = e.slice(n + 1));
              return o.default.hasOwnProperty(t) ? { space: o.default[t], local: e } : e;
            },
        });
      var o = n('./node_modules/d3-selection/src/namespaces.js');
    },
    './node_modules/d3-selection/src/namespaces.js': (e, t, n) => {
      n.r(t), n.d(t, { default: () => s, xhtml: () => o });
      var o = 'http://www.w3.org/1999/xhtml';
      const s = {
        svg: 'http://www.w3.org/2000/svg',
        xhtml: o,
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/',
      };
    },
    './node_modules/d3-selection/src/select.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return 'string' == typeof e ? new o.Selection([[document.querySelector(e)]], [document.documentElement]) : new o.Selection([[e]], o.root);
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-selection/src/selectAll.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return 'string' == typeof e
                ? new s.Selection([document.querySelectorAll(e)], [document.documentElement])
                : new s.Selection([(0, o.default)(e)], s.root);
            },
        });
      var o = n('./node_modules/d3-selection/src/array.js'),
        s = n('./node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-selection/src/selection/append.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = 'function' == typeof e ? e : (0, o.default)(e);
              return this.select(function () {
                return this.appendChild(t.apply(this, arguments));
              });
            },
        });
      var o = n('./node_modules/d3-selection/src/creator.js');
    },
    './node_modules/d3-selection/src/selection/attr.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = (0, o.default)(e);
              if (arguments.length < 2) {
                var s = this.node();
                return n.local ? s.getAttributeNS(n.space, n.local) : s.getAttribute(n);
              }
              return this.each(
                (null == t
                  ? n.local
                    ? function (e) {
                        return function () {
                          this.removeAttributeNS(e.space, e.local);
                        };
                      }
                    : function (e) {
                        return function () {
                          this.removeAttribute(e);
                        };
                      }
                  : 'function' == typeof t
                    ? n.local
                      ? function (e, t) {
                          return function () {
                            var n = t.apply(this, arguments);
                            null == n ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
                          };
                        }
                      : function (e, t) {
                          return function () {
                            var n = t.apply(this, arguments);
                            null == n ? this.removeAttribute(e) : this.setAttribute(e, n);
                          };
                        }
                    : n.local
                      ? function (e, t) {
                          return function () {
                            this.setAttributeNS(e.space, e.local, t);
                          };
                        }
                      : function (e, t) {
                          return function () {
                            this.setAttribute(e, t);
                          };
                        })(n, t)
              );
            },
        });
      var o = n('./node_modules/d3-selection/src/namespace.js');
    },
    './node_modules/d3-selection/src/selection/call.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e = arguments[0];
              return (arguments[0] = this), e.apply(null, arguments), this;
            },
        });
    },
    './node_modules/d3-selection/src/selection/classed.js': (e, t, n) => {
      function o(e) {
        return e.trim().split(/^|\s+/);
      }
      function s(e) {
        return e.classList || new r(e);
      }
      function r(e) {
        (this._node = e), (this._names = o(e.getAttribute('class') || ''));
      }
      function i(e, t) {
        for (var n = s(e), o = -1, r = t.length; ++o < r; ) n.add(t[o]);
      }
      function d(e, t) {
        for (var n = s(e), o = -1, r = t.length; ++o < r; ) n.remove(t[o]);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = o(e + '');
              if (arguments.length < 2) {
                for (var r = s(this.node()), a = -1, l = n.length; ++a < l; ) if (!r.contains(n[a])) return !1;
                return !0;
              }
              return this.each(
                ('function' == typeof t
                  ? function (e, t) {
                      return function () {
                        (t.apply(this, arguments) ? i : d)(this, e);
                      };
                    }
                  : t
                    ? function (e) {
                        return function () {
                          i(this, e);
                        };
                      }
                    : function (e) {
                        return function () {
                          d(this, e);
                        };
                      })(n, t)
              );
            },
        }),
        (r.prototype = {
          add: function (e) {
            this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute('class', this._names.join(' ')));
          },
          remove: function (e) {
            var t = this._names.indexOf(e);
            t >= 0 && (this._names.splice(t, 1), this._node.setAttribute('class', this._names.join(' ')));
          },
          contains: function (e) {
            return this._names.indexOf(e) >= 0;
          },
        });
    },
    './node_modules/d3-selection/src/selection/clone.js': (e, t, n) => {
      function o() {
        var e = this.cloneNode(!1),
          t = this.parentNode;
        return t ? t.insertBefore(e, this.nextSibling) : e;
      }
      function s() {
        var e = this.cloneNode(!0),
          t = this.parentNode;
        return t ? t.insertBefore(e, this.nextSibling) : e;
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.select(e ? s : o);
            },
        });
    },
    './node_modules/d3-selection/src/selection/data.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              if (!arguments.length) return Array.from(this, a);
              var n = t ? d : i,
                s = this._parents,
                c = this._groups;
              'function' != typeof e && (e = (0, r.default)(e));
              for (var u = c.length, f = new Array(u), h = new Array(u), m = new Array(u), p = 0; p < u; ++p) {
                var _ = s[p],
                  g = c[p],
                  v = g.length,
                  b = l(e.call(_, _ && _.__data__, p, s)),
                  y = b.length,
                  j = (h[p] = new Array(y)),
                  w = (f[p] = new Array(y)),
                  x = (m[p] = new Array(v));
                n(_, g, j, w, x, b, t);
                for (var S, A, E = 0, M = 0; E < y; ++E)
                  if ((S = j[E])) {
                    for (E >= M && (M = E + 1); !(A = w[M]) && ++M < y; );
                    S._next = A || null;
                  }
              }
              return ((f = new o.Selection(f, s))._enter = h), (f._exit = m), f;
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-selection/src/selection/enter.js'),
        r = n('./node_modules/d3-selection/src/constant.js');
      function i(e, t, n, o, r, i) {
        for (var d, a = 0, l = t.length, c = i.length; a < c; ++a) (d = t[a]) ? ((d.__data__ = i[a]), (o[a] = d)) : (n[a] = new s.EnterNode(e, i[a]));
        for (; a < l; ++a) (d = t[a]) && (r[a] = d);
      }
      function d(e, t, n, o, r, i, d) {
        var a,
          l,
          c,
          u = new Map(),
          f = t.length,
          h = i.length,
          m = new Array(f);
        for (a = 0; a < f; ++a) (l = t[a]) && ((m[a] = c = d.call(l, l.__data__, a, t) + ''), u.has(c) ? (r[a] = l) : u.set(c, l));
        for (a = 0; a < h; ++a) (c = d.call(e, i[a], a, i) + ''), (l = u.get(c)) ? ((o[a] = l), (l.__data__ = i[a]), u.delete(c)) : (n[a] = new s.EnterNode(e, i[a]));
        for (a = 0; a < f; ++a) (l = t[a]) && u.get(m[a]) === l && (r[a] = l);
      }
      function a(e) {
        return e.__data__;
      }
      function l(e) {
        return 'object' == typeof e && 'length' in e ? e : Array.from(e);
      }
    },
    './node_modules/d3-selection/src/selection/datum.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length ? this.property('__data__', e) : this.node().__data__;
            },
        });
    },
    './node_modules/d3-selection/src/selection/dispatch.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return this.each(
                ('function' == typeof t
                  ? function (e, t) {
                      return function () {
                        return s(this, e, t.apply(this, arguments));
                      };
                    }
                  : function (e, t) {
                      return function () {
                        return s(this, e, t);
                      };
                    })(e, t)
              );
            },
        });
      var o = n('./node_modules/d3-selection/src/window.js');
      function s(e, t, n) {
        var s = (0, o.default)(e),
          r = s.CustomEvent;
        'function' == typeof r
          ? (r = new r(t, n))
          : ((r = s.document.createEvent('Event')), n ? (r.initEvent(t, n.bubbles, n.cancelable), (r.detail = n.detail)) : r.initEvent(t, !1, !1)),
          e.dispatchEvent(r);
      }
    },
    './node_modules/d3-selection/src/selection/each.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
                for (var s, r = t[n], i = 0, d = r.length; i < d; ++i) (s = r[i]) && e.call(s, s.__data__, i, r);
              return this;
            },
        });
    },
    './node_modules/d3-selection/src/selection/empty.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return !this.node();
            },
        });
    },
    './node_modules/d3-selection/src/selection/enter.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          EnterNode: () => r,
          default: () =>
            function () {
              return new s.Selection(this._enter || this._groups.map(o.default), this._parents);
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/sparse.js'),
        s = n('./node_modules/d3-selection/src/selection/index.js');
      function r(e, t) {
        (this.ownerDocument = e.ownerDocument), (this.namespaceURI = e.namespaceURI), (this._next = null), (this._parent = e), (this.__data__ = t);
      }
      r.prototype = {
        constructor: r,
        appendChild: function (e) {
          return this._parent.insertBefore(e, this._next);
        },
        insertBefore: function (e, t) {
          return this._parent.insertBefore(e, t);
        },
        querySelector: function (e) {
          return this._parent.querySelector(e);
        },
        querySelectorAll: function (e) {
          return this._parent.querySelectorAll(e);
        },
      };
    },
    './node_modules/d3-selection/src/selection/exit.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return new s.Selection(this._exit || this._groups.map(o.default), this._parents);
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/sparse.js'),
        s = n('./node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-selection/src/selection/filter.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              'function' != typeof e && (e = (0, s.default)(e));
              for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
                for (var d, a = t[i], l = a.length, c = (r[i] = []), u = 0; u < l; ++u) (d = a[u]) && e.call(d, d.__data__, u, a) && c.push(d);
              return new o.Selection(r, this._parents);
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-selection/src/matcher.js');
    },
    './node_modules/d3-selection/src/selection/html.js': (e, t, n) => {
      function o() {
        this.innerHTML = '';
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length
                ? this.each(
                    null == e
                      ? o
                      : ('function' == typeof e
                          ? function (e) {
                              return function () {
                                var t = e.apply(this, arguments);
                                this.innerHTML = null == t ? '' : t;
                              };
                            }
                          : function (e) {
                              return function () {
                                this.innerHTML = e;
                              };
                            })(e)
                  )
                : this.node().innerHTML;
            },
        });
    },
    './node_modules/d3-selection/src/selection/index.js': (e, t, n) => {
      n.r(t), n.d(t, { Selection: () => B, default: () => D, root: () => q });
      var o = n('./node_modules/d3-selection/src/selection/select.js'),
        s = n('./node_modules/d3-selection/src/selection/selectAll.js'),
        r = n('./node_modules/d3-selection/src/selection/selectChild.js'),
        i = n('./node_modules/d3-selection/src/selection/selectChildren.js'),
        d = n('./node_modules/d3-selection/src/selection/filter.js'),
        a = n('./node_modules/d3-selection/src/selection/data.js'),
        l = n('./node_modules/d3-selection/src/selection/enter.js'),
        c = n('./node_modules/d3-selection/src/selection/exit.js'),
        u = n('./node_modules/d3-selection/src/selection/join.js'),
        f = n('./node_modules/d3-selection/src/selection/merge.js'),
        h = n('./node_modules/d3-selection/src/selection/order.js'),
        m = n('./node_modules/d3-selection/src/selection/sort.js'),
        p = n('./node_modules/d3-selection/src/selection/call.js'),
        _ = n('./node_modules/d3-selection/src/selection/nodes.js'),
        g = n('./node_modules/d3-selection/src/selection/node.js'),
        v = n('./node_modules/d3-selection/src/selection/size.js'),
        b = n('./node_modules/d3-selection/src/selection/empty.js'),
        y = n('./node_modules/d3-selection/src/selection/each.js'),
        j = n('./node_modules/d3-selection/src/selection/attr.js'),
        w = n('./node_modules/d3-selection/src/selection/style.js'),
        x = n('./node_modules/d3-selection/src/selection/property.js'),
        S = n('./node_modules/d3-selection/src/selection/classed.js'),
        A = n('./node_modules/d3-selection/src/selection/text.js'),
        E = n('./node_modules/d3-selection/src/selection/html.js'),
        M = n('./node_modules/d3-selection/src/selection/raise.js'),
        N = n('./node_modules/d3-selection/src/selection/lower.js'),
        k = n('./node_modules/d3-selection/src/selection/append.js'),
        z = n('./node_modules/d3-selection/src/selection/insert.js'),
        P = n('./node_modules/d3-selection/src/selection/remove.js'),
        C = n('./node_modules/d3-selection/src/selection/clone.js'),
        T = n('./node_modules/d3-selection/src/selection/datum.js'),
        I = n('./node_modules/d3-selection/src/selection/on.js'),
        L = n('./node_modules/d3-selection/src/selection/dispatch.js'),
        R = n('./node_modules/d3-selection/src/selection/iterator.js'),
        q = [null];
      function B(e, t) {
        (this._groups = e), (this._parents = t);
      }
      function O() {
        return new B([[document.documentElement]], q);
      }
      B.prototype = O.prototype = {
        constructor: B,
        select: o.default,
        selectAll: s.default,
        selectChild: r.default,
        selectChildren: i.default,
        filter: d.default,
        data: a.default,
        enter: l.default,
        exit: c.default,
        join: u.default,
        merge: f.default,
        selection: function () {
          return this;
        },
        order: h.default,
        sort: m.default,
        call: p.default,
        nodes: _.default,
        node: g.default,
        size: v.default,
        empty: b.default,
        each: y.default,
        attr: j.default,
        style: w.default,
        property: x.default,
        classed: S.default,
        text: A.default,
        html: E.default,
        raise: M.default,
        lower: N.default,
        append: k.default,
        insert: z.default,
        remove: P.default,
        clone: C.default,
        datum: T.default,
        on: I.default,
        dispatch: L.default,
        [Symbol.iterator]: R.default,
      };
      const D = O;
    },
    './node_modules/d3-selection/src/selection/insert.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = 'function' == typeof e ? e : (0, o.default)(e),
                i = null == t ? r : 'function' == typeof t ? t : (0, s.default)(t);
              return this.select(function () {
                return this.insertBefore(n.apply(this, arguments), i.apply(this, arguments) || null);
              });
            },
        });
      var o = n('./node_modules/d3-selection/src/creator.js'),
        s = n('./node_modules/d3-selection/src/selector.js');
      function r() {
        return null;
      }
    },
    './node_modules/d3-selection/src/selection/iterator.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function* () {
              for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var o, s = e[t], r = 0, i = s.length; r < i; ++r) (o = s[r]) && (yield o);
            },
        });
    },
    './node_modules/d3-selection/src/selection/join.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var o = this.enter(),
                s = this,
                r = this.exit();
              'function' == typeof e ? (o = e(o)) && (o = o.selection()) : (o = o.append(e + ''));
              null != t && (s = t(s)) && (s = s.selection());
              null == n ? r.remove() : n(r);
              return o && s ? o.merge(s).order() : s;
            },
        });
    },
    './node_modules/d3-selection/src/selection/lower.js': (e, t, n) => {
      function o() {
        this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.each(o);
            },
        });
    },
    './node_modules/d3-selection/src/selection/merge.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              for (
                var t = e.selection ? e.selection() : e, n = this._groups, s = t._groups, r = n.length, i = s.length, d = Math.min(r, i), a = new Array(r), l = 0;
                l < d;
                ++l
              )
                for (var c, u = n[l], f = s[l], h = u.length, m = (a[l] = new Array(h)), p = 0; p < h; ++p) (c = u[p] || f[p]) && (m[p] = c);
              for (; l < r; ++l) a[l] = n[l];
              return new o.Selection(a, this._parents);
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/index.js');
    },
    './node_modules/d3-selection/src/selection/node.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
                for (var o = e[t], s = 0, r = o.length; s < r; ++s) {
                  var i = o[s];
                  if (i) return i;
                }
              return null;
            },
        });
    },
    './node_modules/d3-selection/src/selection/nodes.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return Array.from(this);
            },
        });
    },
    './node_modules/d3-selection/src/selection/on.js': (e, t, n) => {
      function o(e) {
        return function () {
          var t = this.__on;
          if (t) {
            for (var n, o = 0, s = -1, r = t.length; o < r; ++o)
              (n = t[o]), (e.type && n.type !== e.type) || n.name !== e.name ? (t[++s] = n) : this.removeEventListener(n.type, n.listener, n.options);
            ++s ? (t.length = s) : delete this.__on;
          }
        };
      }
      function s(e, t, n) {
        return function () {
          var o,
            s = this.__on,
            r = (function (e) {
              return function (t) {
                e.call(this, t, this.__data__);
              };
            })(t);
          if (s)
            for (var i = 0, d = s.length; i < d; ++i)
              if ((o = s[i]).type === e.type && o.name === e.name)
                return this.removeEventListener(o.type, o.listener, o.options), this.addEventListener(o.type, (o.listener = r), (o.options = n)), void (o.value = t);
          this.addEventListener(e.type, r, n), (o = { type: e.type, name: e.name, value: t, listener: r, options: n }), s ? s.push(o) : (this.__on = [o]);
        };
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var r,
                i,
                d = (function (e) {
                  return e
                    .trim()
                    .split(/^|\s+/)
                    .map(function (e) {
                      var t = '',
                        n = e.indexOf('.');
                      return n >= 0 && ((t = e.slice(n + 1)), (e = e.slice(0, n))), { type: e, name: t };
                    });
                })(e + ''),
                a = d.length;
              if (arguments.length < 2) {
                var l = this.node().__on;
                if (l)
                  for (var c, u = 0, f = l.length; u < f; ++u) for (r = 0, c = l[u]; r < a; ++r) if ((i = d[r]).type === c.type && i.name === c.name) return c.value;
                return;
              }
              for (l = t ? s : o, r = 0; r < a; ++r) this.each(l(d[r], t, n));
              return this;
            },
        });
    },
    './node_modules/d3-selection/src/selection/order.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              for (var e = this._groups, t = -1, n = e.length; ++t < n; )
                for (var o, s = e[t], r = s.length - 1, i = s[r]; --r >= 0; )
                  (o = s[r]) && (i && 4 ^ o.compareDocumentPosition(i) && i.parentNode.insertBefore(o, i), (i = o));
              return this;
            },
        });
    },
    './node_modules/d3-selection/src/selection/property.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              return arguments.length > 1
                ? this.each(
                    (null == t
                      ? function (e) {
                          return function () {
                            delete this[e];
                          };
                        }
                      : 'function' == typeof t
                        ? function (e, t) {
                            return function () {
                              var n = t.apply(this, arguments);
                              null == n ? delete this[e] : (this[e] = n);
                            };
                          }
                        : function (e, t) {
                            return function () {
                              this[e] = t;
                            };
                          })(e, t)
                  )
                : this.node()[e];
            },
        });
    },
    './node_modules/d3-selection/src/selection/raise.js': (e, t, n) => {
      function o() {
        this.nextSibling && this.parentNode.appendChild(this);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.each(o);
            },
        });
    },
    './node_modules/d3-selection/src/selection/remove.js': (e, t, n) => {
      function o() {
        var e = this.parentNode;
        e && e.removeChild(this);
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.each(o);
            },
        });
    },
    './node_modules/d3-selection/src/selection/select.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              'function' != typeof e && (e = (0, s.default)(e));
              for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
                for (var d, a, l = t[i], c = l.length, u = (r[i] = new Array(c)), f = 0; f < c; ++f)
                  (d = l[f]) && (a = e.call(d, d.__data__, f, l)) && ('__data__' in d && (a.__data__ = d.__data__), (u[f] = a));
              return new o.Selection(r, this._parents);
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-selection/src/selector.js');
    },
    './node_modules/d3-selection/src/selection/selectAll.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              e =
                'function' == typeof e
                  ? (function (e) {
                      return function () {
                        return (0, s.default)(e.apply(this, arguments));
                      };
                    })(e)
                  : (0, r.default)(e);
              for (var t = this._groups, n = t.length, i = [], d = [], a = 0; a < n; ++a)
                for (var l, c = t[a], u = c.length, f = 0; f < u; ++f) (l = c[f]) && (i.push(e.call(l, l.__data__, f, c)), d.push(l));
              return new o.Selection(i, d);
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-selection/src/array.js'),
        r = n('./node_modules/d3-selection/src/selectorAll.js');
    },
    './node_modules/d3-selection/src/selection/selectChild.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.select(
                null == e
                  ? r
                  : (function (e) {
                      return function () {
                        return s.call(this.children, e);
                      };
                    })('function' == typeof e ? e : (0, o.childMatcher)(e))
              );
            },
        });
      var o = n('./node_modules/d3-selection/src/matcher.js'),
        s = Array.prototype.find;
      function r() {
        return this.firstElementChild;
      }
    },
    './node_modules/d3-selection/src/selection/selectChildren.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.selectAll(
                null == e
                  ? r
                  : (function (e) {
                      return function () {
                        return s.call(this.children, e);
                      };
                    })('function' == typeof e ? e : (0, o.childMatcher)(e))
              );
            },
        });
      var o = n('./node_modules/d3-selection/src/matcher.js'),
        s = Array.prototype.filter;
      function r() {
        return Array.from(this.children);
      }
    },
    './node_modules/d3-selection/src/selection/size.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              let e = 0;
              for (const t of this) ++e;
              return e;
            },
        });
    },
    './node_modules/d3-selection/src/selection/sort.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              e || (e = s);
              function t(t, n) {
                return t && n ? e(t.__data__, n.__data__) : !t - !n;
              }
              for (var n = this._groups, r = n.length, i = new Array(r), d = 0; d < r; ++d) {
                for (var a, l = n[d], c = l.length, u = (i[d] = new Array(c)), f = 0; f < c; ++f) (a = l[f]) && (u[f] = a);
                u.sort(t);
              }
              return new o.Selection(i, this._parents).order();
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/index.js');
      function s(e, t) {
        return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
      }
    },
    './node_modules/d3-selection/src/selection/sparse.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return new Array(e.length);
            },
        });
    },
    './node_modules/d3-selection/src/selection/style.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              return arguments.length > 1
                ? this.each(
                    (null == t
                      ? function (e) {
                          return function () {
                            this.style.removeProperty(e);
                          };
                        }
                      : 'function' == typeof t
                        ? function (e, t, n) {
                            return function () {
                              var o = t.apply(this, arguments);
                              null == o ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
                            };
                          }
                        : function (e, t, n) {
                            return function () {
                              this.style.setProperty(e, t, n);
                            };
                          })(e, t, null == n ? '' : n)
                  )
                : s(this.node(), e);
            },
          styleValue: () => s,
        });
      var o = n('./node_modules/d3-selection/src/window.js');
      function s(e, t) {
        return e.style.getPropertyValue(t) || (0, o.default)(e).getComputedStyle(e, null).getPropertyValue(t);
      }
    },
    './node_modules/d3-selection/src/selection/text.js': (e, t, n) => {
      function o() {
        this.textContent = '';
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return arguments.length
                ? this.each(
                    null == e
                      ? o
                      : ('function' == typeof e
                          ? function (e) {
                              return function () {
                                var t = e.apply(this, arguments);
                                this.textContent = null == t ? '' : t;
                              };
                            }
                          : function (e) {
                              return function () {
                                this.textContent = e;
                              };
                            })(e)
                  )
                : this.node().textContent;
            },
        });
    },
    './node_modules/d3-selection/src/selector.js': (e, t, n) => {
      function o() {}
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return null == e
                ? o
                : function () {
                    return this.querySelector(e);
                  };
            },
        });
    },
    './node_modules/d3-selection/src/selectorAll.js': (e, t, n) => {
      function o() {
        return [];
      }
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return null == e
                ? o
                : function () {
                    return this.querySelectorAll(e);
                  };
            },
        });
    },
    './node_modules/d3-selection/src/window.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return (e.ownerDocument && e.ownerDocument.defaultView) || (e.document && e) || e.defaultView;
            },
        });
    },
    './node_modules/d3-transition/src/active.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n,
                i,
                d = e.__transition;
              if (d) for (i in ((t = null == t ? null : t + ''), d)) if ((n = d[i]).state > s.SCHEDULED && n.name === t) return new o.Transition([[e]], r, t, +i);
              return null;
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/index.js'),
        s = n('./node_modules/d3-transition/src/transition/schedule.js'),
        r = [null];
    },
    './node_modules/d3-transition/src/index.js': (e, t, n) => {
      n.r(t), n.d(t, { active: () => s.default, interrupt: () => r.default, transition: () => o.default });
      n('./node_modules/d3-transition/src/selection/index.js');
      var o = n('./node_modules/d3-transition/src/transition/index.js'),
        s = n('./node_modules/d3-transition/src/active.js'),
        r = n('./node_modules/d3-transition/src/interrupt.js');
    },
    './node_modules/d3-transition/src/interrupt.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n,
                s,
                r,
                i = e.__transition,
                d = !0;
              if (!i) return;
              for (r in ((t = null == t ? null : t + ''), i))
                (n = i[r]).name === t
                  ? ((s = n.state > o.STARTING && n.state < o.ENDING),
                    (n.state = o.ENDED),
                    n.timer.stop(),
                    n.on.call(s ? 'interrupt' : 'cancel', e, e.__data__, n.index, n.group),
                    delete i[r])
                  : (d = !1);
              d && delete e.__transition;
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/selection/index.js': (e, t, n) => {
      n.r(t);
      var o = n('./node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-transition/src/selection/interrupt.js'),
        r = n('./node_modules/d3-transition/src/selection/transition.js');
      (o.default.prototype.interrupt = s.default), (o.default.prototype.transition = r.default);
    },
    './node_modules/d3-transition/src/selection/interrupt.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.each(function () {
                (0, o.default)(this, e);
              });
            },
        });
      var o = n('./node_modules/d3-transition/src/interrupt.js');
    },
    './node_modules/d3-transition/src/selection/transition.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t, n;
              e instanceof o.Transition ? ((t = e._id), (e = e._name)) : ((t = (0, o.newId)()), ((n = d).time = (0, i.now)()), (e = null == e ? null : e + ''));
              for (var r = this._groups, l = r.length, c = 0; c < l; ++c)
                for (var u, f = r[c], h = f.length, m = 0; m < h; ++m) (u = f[m]) && (0, s.default)(u, e, t, m, f, n || a(u, t));
              return new o.Transition(r, this._parents, e, t);
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/index.js'),
        s = n('./node_modules/d3-transition/src/transition/schedule.js'),
        r = n('./node_modules/d3-ease/src/cubic.js'),
        i = n('./node_modules/d3-timer/src/timer.js'),
        d = { time: null, delay: 0, duration: 250, ease: r.cubicInOut };
      function a(e, t) {
        for (var n; !(n = e.__transition) || !(n = n[t]); ) if (!(e = e.parentNode)) throw new Error(`transition ${t} not found`);
        return n;
      }
    },
    './node_modules/d3-transition/src/transition/attr.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = (0, s.default)(e),
                d = 'transform' === n ? o.interpolateTransformSvg : i.default;
              return this.attrTween(
                e,
                'function' == typeof t
                  ? (n.local
                      ? function (e, t, n) {
                          var o, s, r;
                          return function () {
                            var i,
                              d,
                              a = n(this);
                            if (null != a)
                              return (i = this.getAttributeNS(e.space, e.local)) === (d = a + '') ? null : i === o && d === s ? r : ((s = d), (r = t((o = i), a)));
                            this.removeAttributeNS(e.space, e.local);
                          };
                        }
                      : function (e, t, n) {
                          var o, s, r;
                          return function () {
                            var i,
                              d,
                              a = n(this);
                            if (null != a) return (i = this.getAttribute(e)) === (d = a + '') ? null : i === o && d === s ? r : ((s = d), (r = t((o = i), a)));
                            this.removeAttribute(e);
                          };
                        })(n, d, (0, r.tweenValue)(this, 'attr.' + e, t))
                  : null == t
                    ? (n.local
                        ? function (e) {
                            return function () {
                              this.removeAttributeNS(e.space, e.local);
                            };
                          }
                        : function (e) {
                            return function () {
                              this.removeAttribute(e);
                            };
                          })(n)
                    : (n.local
                        ? function (e, t, n) {
                            var o,
                              s,
                              r = n + '';
                            return function () {
                              var i = this.getAttributeNS(e.space, e.local);
                              return i === r ? null : i === o ? s : (s = t((o = i), n));
                            };
                          }
                        : function (e, t, n) {
                            var o,
                              s,
                              r = n + '';
                            return function () {
                              var i = this.getAttribute(e);
                              return i === r ? null : i === o ? s : (s = t((o = i), n));
                            };
                          })(n, d, t)
              );
            },
        });
      var o = n('./node_modules/d3-interpolate/src/transform/index.js'),
        s = n('./node_modules/d3-selection/src/namespace.js'),
        r = n('./node_modules/d3-transition/src/transition/tween.js'),
        i = n('./node_modules/d3-transition/src/transition/interpolate.js');
    },
    './node_modules/d3-transition/src/transition/attrTween.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = 'attr.' + e;
              if (arguments.length < 2) return (n = this.tween(n)) && n._value;
              if (null == t) return this.tween(n, null);
              if ('function' != typeof t) throw new Error();
              var s = (0, o.default)(e);
              return this.tween(
                n,
                (s.local
                  ? function (e, t) {
                      var n, o;
                      function s() {
                        var s = t.apply(this, arguments);
                        return (
                          s !== o &&
                            (n =
                              (o = s) &&
                              (function (e, t) {
                                return function (n) {
                                  this.setAttributeNS(e.space, e.local, t.call(this, n));
                                };
                              })(e, s)),
                          n
                        );
                      }
                      return (s._value = t), s;
                    }
                  : function (e, t) {
                      var n, o;
                      function s() {
                        var s = t.apply(this, arguments);
                        return (
                          s !== o &&
                            (n =
                              (o = s) &&
                              (function (e, t) {
                                return function (n) {
                                  this.setAttribute(e, t.call(this, n));
                                };
                              })(e, s)),
                          n
                        );
                      }
                      return (s._value = t), s;
                    })(s, t)
              );
            },
        });
      var o = n('./node_modules/d3-selection/src/namespace.js');
    },
    './node_modules/d3-transition/src/transition/delay.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._id;
              return arguments.length
                ? this.each(
                    ('function' == typeof e
                      ? function (e, t) {
                          return function () {
                            (0, o.init)(this, e).delay = +t.apply(this, arguments);
                          };
                        }
                      : function (e, t) {
                          return (
                            (t = +t),
                            function () {
                              (0, o.init)(this, e).delay = t;
                            }
                          );
                        })(t, e)
                  )
                : (0, o.get)(this.node(), t).delay;
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/transition/duration.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._id;
              return arguments.length
                ? this.each(
                    ('function' == typeof e
                      ? function (e, t) {
                          return function () {
                            (0, o.set)(this, e).duration = +t.apply(this, arguments);
                          };
                        }
                      : function (e, t) {
                          return (
                            (t = +t),
                            function () {
                              (0, o.set)(this, e).duration = t;
                            }
                          );
                        })(t, e)
                  )
                : (0, o.get)(this.node(), t).duration;
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/transition/ease.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._id;
              return arguments.length
                ? this.each(
                    (function (e, t) {
                      if ('function' != typeof t) throw new Error();
                      return function () {
                        (0, o.set)(this, e).ease = t;
                      };
                    })(t, e)
                  )
                : (0, o.get)(this.node(), t).ease;
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/transition/easeVarying.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              if ('function' != typeof e) throw new Error();
              return this.each(
                (function (e, t) {
                  return function () {
                    var n = t.apply(this, arguments);
                    if ('function' != typeof n) throw new Error();
                    (0, o.set)(this, e).ease = n;
                  };
                })(this._id, e)
              );
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/transition/end.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              var e,
                t,
                n = this,
                s = n._id,
                r = n.size();
              return new Promise(function (i, d) {
                var a = { value: d },
                  l = {
                    value: function () {
                      0 == --r && i();
                    },
                  };
                n.each(function () {
                  var n = (0, o.set)(this, s),
                    r = n.on;
                  r !== e && ((t = (e = r).copy())._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), (n.on = t);
                }),
                  0 === r && i();
              });
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/transition/filter.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              'function' != typeof e && (e = (0, o.default)(e));
              for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
                for (var d, a = t[i], l = a.length, c = (r[i] = []), u = 0; u < l; ++u) (d = a[u]) && e.call(d, d.__data__, u, a) && c.push(d);
              return new s.Transition(r, this._parents, this._name, this._id);
            },
        });
      var o = n('./node_modules/d3-selection/src/matcher.js'),
        s = n('./node_modules/d3-transition/src/transition/index.js');
    },
    './node_modules/d3-transition/src/transition/index.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          Transition: () => A,
          default: () => E,
          newId: () =>
            function () {
              return ++S;
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/index.js'),
        s = n('./node_modules/d3-transition/src/transition/attr.js'),
        r = n('./node_modules/d3-transition/src/transition/attrTween.js'),
        i = n('./node_modules/d3-transition/src/transition/delay.js'),
        d = n('./node_modules/d3-transition/src/transition/duration.js'),
        a = n('./node_modules/d3-transition/src/transition/ease.js'),
        l = n('./node_modules/d3-transition/src/transition/easeVarying.js'),
        c = n('./node_modules/d3-transition/src/transition/filter.js'),
        u = n('./node_modules/d3-transition/src/transition/merge.js'),
        f = n('./node_modules/d3-transition/src/transition/on.js'),
        h = n('./node_modules/d3-transition/src/transition/remove.js'),
        m = n('./node_modules/d3-transition/src/transition/select.js'),
        p = n('./node_modules/d3-transition/src/transition/selectAll.js'),
        _ = n('./node_modules/d3-transition/src/transition/selection.js'),
        g = n('./node_modules/d3-transition/src/transition/style.js'),
        v = n('./node_modules/d3-transition/src/transition/styleTween.js'),
        b = n('./node_modules/d3-transition/src/transition/text.js'),
        y = n('./node_modules/d3-transition/src/transition/textTween.js'),
        j = n('./node_modules/d3-transition/src/transition/transition.js'),
        w = n('./node_modules/d3-transition/src/transition/tween.js'),
        x = n('./node_modules/d3-transition/src/transition/end.js'),
        S = 0;
      function A(e, t, n, o) {
        (this._groups = e), (this._parents = t), (this._name = n), (this._id = o);
      }
      function E(e) {
        return (0, o.default)().transition(e);
      }
      var M = o.default.prototype;
      A.prototype = E.prototype = {
        constructor: A,
        select: m.default,
        selectAll: p.default,
        selectChild: M.selectChild,
        selectChildren: M.selectChildren,
        filter: c.default,
        merge: u.default,
        selection: _.default,
        transition: j.default,
        call: M.call,
        nodes: M.nodes,
        node: M.node,
        size: M.size,
        empty: M.empty,
        each: M.each,
        on: f.default,
        attr: s.default,
        attrTween: r.default,
        style: g.default,
        styleTween: v.default,
        text: b.default,
        textTween: y.default,
        remove: h.default,
        tween: w.default,
        delay: i.default,
        duration: d.default,
        ease: a.default,
        easeVarying: l.default,
        end: x.default,
        [Symbol.iterator]: M[Symbol.iterator],
      };
    },
    './node_modules/d3-transition/src/transition/interpolate.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n;
              return ('number' == typeof t ? s.default : t instanceof o.default ? r.default : (n = (0, o.default)(t)) ? ((t = n), r.default) : i.default)(e, t);
            },
        });
      var o = n('./node_modules/d3-color/src/color.js'),
        s = n('./node_modules/d3-interpolate/src/number.js'),
        r = n('./node_modules/d3-interpolate/src/rgb.js'),
        i = n('./node_modules/d3-interpolate/src/string.js');
    },
    './node_modules/d3-transition/src/transition/merge.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              if (e._id !== this._id) throw new Error();
              for (var t = this._groups, n = e._groups, s = t.length, r = n.length, i = Math.min(s, r), d = new Array(s), a = 0; a < i; ++a)
                for (var l, c = t[a], u = n[a], f = c.length, h = (d[a] = new Array(f)), m = 0; m < f; ++m) (l = c[m] || u[m]) && (h[m] = l);
              for (; a < s; ++a) d[a] = t[a];
              return new o.Transition(d, this._parents, this._name, this._id);
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/index.js');
    },
    './node_modules/d3-transition/src/transition/on.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = this._id;
              return arguments.length < 2
                ? (0, o.get)(this.node(), n).on.on(e)
                : this.each(
                    (function (e, t, n) {
                      var s,
                        r,
                        i = (function (e) {
                          return (e + '')
                            .trim()
                            .split(/^|\s+/)
                            .every(function (e) {
                              var t = e.indexOf('.');
                              return t >= 0 && (e = e.slice(0, t)), !e || 'start' === e;
                            });
                        })(t)
                          ? o.init
                          : o.set;
                      return function () {
                        var o = i(this, e),
                          d = o.on;
                        d !== s && (r = (s = d).copy()).on(t, n), (o.on = r);
                      };
                    })(n, e, t)
                  );
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/transition/remove.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return this.on(
                'end.remove',
                ((e = this._id),
                function () {
                  var t = this.parentNode;
                  for (var n in this.__transition) if (+n !== e) return;
                  t && t.removeChild(this);
                })
              );
              var e;
            },
        });
    },
    './node_modules/d3-transition/src/transition/schedule.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          CREATED: () => a,
          ENDED: () => m,
          ENDING: () => h,
          RUNNING: () => f,
          SCHEDULED: () => l,
          STARTED: () => u,
          STARTING: () => c,
          default: () =>
            function (e, t, n, o, p, _) {
              var g = e.__transition;
              if (g) {
                if (n in g) return;
              } else e.__transition = {};
              !(function (e, t, n) {
                var o,
                  i = e.__transition;
                function d(s) {
                  var h, _, g, v;
                  if (n.state !== l) return p();
                  for (h in i)
                    if ((v = i[h]).name === n.name) {
                      if (v.state === u) return (0, r.default)(d);
                      v.state === f
                        ? ((v.state = m), v.timer.stop(), v.on.call('interrupt', e, e.__data__, v.index, v.group), delete i[h])
                        : +h < t && ((v.state = m), v.timer.stop(), v.on.call('cancel', e, e.__data__, v.index, v.group), delete i[h]);
                    }
                  if (
                    ((0, r.default)(function () {
                      n.state === u && ((n.state = f), n.timer.restart(a, n.delay, n.time), a(s));
                    }),
                    (n.state = c),
                    n.on.call('start', e, e.__data__, n.index, n.group),
                    n.state === c)
                  ) {
                    for (n.state = u, o = new Array((g = n.tween.length)), h = 0, _ = -1; h < g; ++h)
                      (v = n.tween[h].value.call(e, e.__data__, n.index, n.group)) && (o[++_] = v);
                    o.length = _ + 1;
                  }
                }
                function a(t) {
                  for (var s = t < n.duration ? n.ease.call(null, t / n.duration) : (n.timer.restart(p), (n.state = h), 1), r = -1, i = o.length; ++r < i; )
                    o[r].call(e, s);
                  n.state === h && (n.on.call('end', e, e.__data__, n.index, n.group), p());
                }
                function p() {
                  for (var o in ((n.state = m), n.timer.stop(), delete i[t], i)) return;
                  delete e.__transition;
                }
                (i[t] = n),
                  (n.timer = (0, s.timer)(
                    function (e) {
                      (n.state = l), n.timer.restart(d, n.delay, n.time), n.delay <= e && d(e - n.delay);
                    },
                    0,
                    n.time
                  ));
              })(e, n, { name: t, index: o, group: p, on: i, tween: d, time: _.time, delay: _.delay, duration: _.duration, ease: _.ease, timer: null, state: a });
            },
          get: () => p,
          init: () =>
            function (e, t) {
              var n = p(e, t);
              if (n.state > a) throw new Error('too late; already scheduled');
              return n;
            },
          set: () =>
            function (e, t) {
              var n = p(e, t);
              if (n.state > u) throw new Error('too late; already running');
              return n;
            },
        });
      var o = n('./node_modules/d3-dispatch/src/index.js'),
        s = n('./node_modules/d3-timer/src/timer.js'),
        r = n('./node_modules/d3-timer/src/timeout.js'),
        i = (0, o.dispatch)('start', 'end', 'cancel', 'interrupt'),
        d = [],
        a = 0,
        l = 1,
        c = 2,
        u = 3,
        f = 4,
        h = 5,
        m = 6;
      function p(e, t) {
        var n = e.__transition;
        if (!n || !(n = n[t])) throw new Error('transition not found');
        return n;
      }
    },
    './node_modules/d3-transition/src/transition/select.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._name,
                n = this._id;
              'function' != typeof e && (e = (0, o.default)(e));
              for (var i = this._groups, d = i.length, a = new Array(d), l = 0; l < d; ++l)
                for (var c, u, f = i[l], h = f.length, m = (a[l] = new Array(h)), p = 0; p < h; ++p)
                  (c = f[p]) &&
                    (u = e.call(c, c.__data__, p, f)) &&
                    ('__data__' in c && (u.__data__ = c.__data__), (m[p] = u), (0, r.default)(m[p], t, n, p, m, (0, r.get)(c, n)));
              return new s.Transition(a, this._parents, t, n);
            },
        });
      var o = n('./node_modules/d3-selection/src/selector.js'),
        s = n('./node_modules/d3-transition/src/transition/index.js'),
        r = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/transition/selectAll.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = this._name,
                n = this._id;
              'function' != typeof e && (e = (0, o.default)(e));
              for (var i = this._groups, d = i.length, a = [], l = [], c = 0; c < d; ++c)
                for (var u, f = i[c], h = f.length, m = 0; m < h; ++m)
                  if ((u = f[m])) {
                    for (var p, _ = e.call(u, u.__data__, m, f), g = (0, r.get)(u, n), v = 0, b = _.length; v < b; ++v)
                      (p = _[v]) && (0, r.default)(p, t, n, v, _, g);
                    a.push(_), l.push(u);
                  }
              return new s.Transition(a, l, t, n);
            },
        });
      var o = n('./node_modules/d3-selection/src/selectorAll.js'),
        s = n('./node_modules/d3-transition/src/transition/index.js'),
        r = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/transition/selection.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              return new o(this._groups, this._parents);
            },
        });
      var o = n('./node_modules/d3-selection/src/selection/index.js').default.prototype.constructor;
    },
    './node_modules/d3-transition/src/transition/style.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var l = 'transform' == (e += '') ? o.interpolateTransformCss : d.default;
              return null == t
                ? this.styleTween(
                    e,
                    (function (e, t) {
                      var n, o, r;
                      return function () {
                        var i = (0, s.styleValue)(this, e),
                          d = (this.style.removeProperty(e), (0, s.styleValue)(this, e));
                        return i === d ? null : i === n && d === o ? r : (r = t((n = i), (o = d)));
                      };
                    })(e, l)
                  ).on('end.style.' + e, a(e))
                : 'function' == typeof t
                  ? this.styleTween(
                      e,
                      (function (e, t, n) {
                        var o, r, i;
                        return function () {
                          var d = (0, s.styleValue)(this, e),
                            a = n(this),
                            l = a + '';
                          return (
                            null == a && (this.style.removeProperty(e), (l = a = (0, s.styleValue)(this, e))),
                            d === l ? null : d === o && l === r ? i : ((r = l), (i = t((o = d), a)))
                          );
                        };
                      })(e, l, (0, i.tweenValue)(this, 'style.' + e, t))
                    ).each(
                      (function (e, t) {
                        var n,
                          o,
                          s,
                          i,
                          d = 'style.' + t,
                          l = 'end.' + d;
                        return function () {
                          var c = (0, r.set)(this, e),
                            u = c.on,
                            f = null == c.value[d] ? i || (i = a(t)) : void 0;
                          (u === n && s === f) || (o = (n = u).copy()).on(l, (s = f)), (c.on = o);
                        };
                      })(this._id, e)
                    )
                  : this.styleTween(
                      e,
                      (function (e, t, n) {
                        var o,
                          r,
                          i = n + '';
                        return function () {
                          var d = (0, s.styleValue)(this, e);
                          return d === i ? null : d === o ? r : (r = t((o = d), n));
                        };
                      })(e, l, t),
                      n
                    ).on('end.style.' + e, null);
            },
        });
      var o = n('./node_modules/d3-interpolate/src/transform/index.js'),
        s = n('./node_modules/d3-selection/src/selection/style.js'),
        r = n('./node_modules/d3-transition/src/transition/schedule.js'),
        i = n('./node_modules/d3-transition/src/transition/tween.js'),
        d = n('./node_modules/d3-transition/src/transition/interpolate.js');
      function a(e) {
        return function () {
          this.style.removeProperty(e);
        };
      }
    },
    './node_modules/d3-transition/src/transition/styleTween.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t, n) {
              var o = 'style.' + (e += '');
              if (arguments.length < 2) return (o = this.tween(o)) && o._value;
              if (null == t) return this.tween(o, null);
              if ('function' != typeof t) throw new Error();
              return this.tween(
                o,
                (function (e, t, n) {
                  var o, s;
                  function r() {
                    var r = t.apply(this, arguments);
                    return (
                      r !== s &&
                        (o =
                          (s = r) &&
                          (function (e, t, n) {
                            return function (o) {
                              this.style.setProperty(e, t.call(this, o), n);
                            };
                          })(e, r, n)),
                      o
                    );
                  }
                  return (r._value = t), r;
                })(e, t, null == n ? '' : n)
              );
            },
        });
    },
    './node_modules/d3-transition/src/transition/text.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              return this.tween(
                'text',
                'function' == typeof e
                  ? (function (e) {
                      return function () {
                        var t = e(this);
                        this.textContent = null == t ? '' : t;
                      };
                    })((0, o.tweenValue)(this, 'text', e))
                  : (function (e) {
                      return function () {
                        this.textContent = e;
                      };
                    })(null == e ? '' : e + '')
              );
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/tween.js');
    },
    './node_modules/d3-transition/src/transition/textTween.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e) {
              var t = 'text';
              if (arguments.length < 1) return (t = this.tween(t)) && t._value;
              if (null == e) return this.tween(t, null);
              if ('function' != typeof e) throw new Error();
              return this.tween(
                t,
                (function (e) {
                  var t, n;
                  function o() {
                    var o = e.apply(this, arguments);
                    return (
                      o !== n &&
                        (t =
                          (n = o) &&
                          (function (e) {
                            return function (t) {
                              this.textContent = e.call(this, t);
                            };
                          })(o)),
                      t
                    );
                  }
                  return (o._value = e), o;
                })(e)
              );
            },
        });
    },
    './node_modules/d3-transition/src/transition/transition.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function () {
              for (var e = this._name, t = this._id, n = (0, o.newId)(), r = this._groups, i = r.length, d = 0; d < i; ++d)
                for (var a, l = r[d], c = l.length, u = 0; u < c; ++u)
                  if ((a = l[u])) {
                    var f = (0, s.get)(a, t);
                    (0, s.default)(a, e, n, u, l, { time: f.time + f.delay + f.duration, delay: 0, duration: f.duration, ease: f.ease });
                  }
              return new o.Transition(r, this._parents, e, n);
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/index.js'),
        s = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/d3-transition/src/transition/tween.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          default: () =>
            function (e, t) {
              var n = this._id;
              if (((e += ''), arguments.length < 2)) {
                for (var s, r = (0, o.get)(this.node(), n).tween, i = 0, d = r.length; i < d; ++i) if ((s = r[i]).name === e) return s.value;
                return null;
              }
              return this.each(
                (null == t
                  ? function (e, t) {
                      var n, s;
                      return function () {
                        var r = (0, o.set)(this, e),
                          i = r.tween;
                        if (i !== n) {
                          s = n = i;
                          for (var d = 0, a = s.length; d < a; ++d)
                            if (s[d].name === t) {
                              (s = s.slice()).splice(d, 1);
                              break;
                            }
                        }
                        r.tween = s;
                      };
                    }
                  : function (e, t, n) {
                      var s, r;
                      if ('function' != typeof n) throw new Error();
                      return function () {
                        var i = (0, o.set)(this, e),
                          d = i.tween;
                        if (d !== s) {
                          r = (s = d).slice();
                          for (var a = { name: t, value: n }, l = 0, c = r.length; l < c; ++l)
                            if (r[l].name === t) {
                              r[l] = a;
                              break;
                            }
                          l === c && r.push(a);
                        }
                        i.tween = r;
                      };
                    })(n, e, t)
              );
            },
          tweenValue: () =>
            function (e, t, n) {
              var s = e._id;
              return (
                e.each(function () {
                  var e = (0, o.set)(this, s);
                  (e.value || (e.value = {}))[t] = n.apply(this, arguments);
                }),
                function (e) {
                  return (0, o.get)(e, s).value[t];
                }
              );
            },
        });
      var o = n('./node_modules/d3-transition/src/transition/schedule.js');
    },
    './node_modules/lit-element/lib/css-tag.js': (e, t, n) => {
      n.r(t), n.d(t, { CSSResult: () => r, css: () => d, supportsAdoptingStyleSheets: () => o, unsafeCSS: () => i });
      const o =
          window.ShadowRoot &&
          (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
          'adoptedStyleSheets' in Document.prototype &&
          'replace' in CSSStyleSheet.prototype,
        s = Symbol();
      class r {
        constructor(e, t) {
          if (t !== s) throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
          this.cssText = e;
        }
        get styleSheet() {
          return (
            void 0 === this._styleSheet && (o ? ((this._styleSheet = new CSSStyleSheet()), this._styleSheet.replaceSync(this.cssText)) : (this._styleSheet = null)),
            this._styleSheet
          );
        }
        toString() {
          return this.cssText;
        }
      }
      const i = (e) => new r(String(e), s),
        d = (e, ...t) => {
          const n = t.reduce(
            (t, n, o) =>
              t +
              ((e) => {
                if (e instanceof r) return e.cssText;
                if ('number' == typeof e) return e;
                throw new Error(
                  `Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`
                );
              })(n) +
              e[o + 1],
            e[0]
          );
          return new r(n, s);
        };
    },
    './node_modules/lit-element/lib/decorators.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          customElement: () => o,
          eventOptions: () =>
            function (e) {
              return (t, n) => (void 0 !== n ? c(e, t, n) : l(e, t));
            },
          internalProperty: () =>
            function (e) {
              return i({ attribute: !1, hasChanged: null == e ? void 0 : e.hasChanged });
            },
          property: () => i,
          query: () =>
            function (e, t) {
              return (n, o) => {
                const s = {
                  get() {
                    return this.renderRoot.querySelector(e);
                  },
                  enumerable: !0,
                  configurable: !0,
                };
                if (t) {
                  const t = 'symbol' == typeof o ? Symbol() : `__${o}`;
                  s.get = function () {
                    return void 0 === this[t] && (this[t] = this.renderRoot.querySelector(e)), this[t];
                  };
                }
                return void 0 !== o ? d(s, n, o) : a(s, n);
              };
            },
          queryAll: () =>
            function (e) {
              return (t, n) => {
                const o = {
                  get() {
                    return this.renderRoot.querySelectorAll(e);
                  },
                  enumerable: !0,
                  configurable: !0,
                };
                return void 0 !== n ? d(o, t, n) : a(o, t);
              };
            },
          queryAssignedNodes: () =>
            function (e = '', t = !1, n = '') {
              return (o, s) => {
                const r = {
                  get() {
                    const o = `slot${e ? `[name=${e}]` : ':not([name])'}`,
                      s = this.renderRoot.querySelector(o);
                    let r = s && s.assignedNodes({ flatten: t });
                    return r && n && (r = r.filter((e) => (e.nodeType === Node.ELEMENT_NODE && e.matches ? e.matches(n) : f.call(e, n)))), r;
                  },
                  enumerable: !0,
                  configurable: !0,
                };
                return void 0 !== s ? d(r, o, s) : a(r, o);
              };
            },
          queryAsync: () =>
            function (e) {
              return (t, n) => {
                const o = {
                  async get() {
                    return await this.updateComplete, this.renderRoot.querySelector(e);
                  },
                  enumerable: !0,
                  configurable: !0,
                };
                return void 0 !== n ? d(o, t, n) : a(o, t);
              };
            },
        });
      const o = (e) => (t) =>
          'function' == typeof t
            ? ((e, t) => (window.customElements.define(e, t), t))(e, t)
            : ((e, t) => {
                const { kind: n, elements: o } = t;
                return {
                  kind: n,
                  elements: o,
                  finisher(t) {
                    window.customElements.define(e, t);
                  },
                };
              })(e, t),
        s = (e, t) =>
          'method' !== t.kind || !t.descriptor || 'value' in t.descriptor
            ? {
                kind: 'field',
                key: Symbol(),
                placement: 'own',
                descriptor: {},
                initializer() {
                  'function' == typeof t.initializer && (this[t.key] = t.initializer.call(this));
                },
                finisher(n) {
                  n.createProperty(t.key, e);
                },
              }
            : Object.assign(Object.assign({}, t), {
                finisher(n) {
                  n.createProperty(t.key, e);
                },
              }),
        r = (e, t, n) => {
          t.constructor.createProperty(n, e);
        };
      function i(e) {
        return (t, n) => (void 0 !== n ? r(e, t, n) : s(e, t));
      }
      const d = (e, t, n) => {
          Object.defineProperty(t, n, e);
        },
        a = (e, t) => ({ kind: 'method', placement: 'prototype', key: t.key, descriptor: e }),
        l = (e, t) =>
          Object.assign(Object.assign({}, t), {
            finisher(n) {
              Object.assign(n.prototype[t.key], e);
            },
          }),
        c = (e, t, n) => {
          Object.assign(t[n], e);
        };
      const u = Element.prototype,
        f = u.msMatchesSelector || u.webkitMatchesSelector;
    },
    './node_modules/lit-element/lib/updating-element.js': (e, t, n) => {
      n.r(t), n.d(t, { UpdatingElement: () => u, defaultConverter: () => o, notEqual: () => s }), (window.JSCompiler_renameProperty = (e, t) => e);
      const o = {
          toAttribute(e, t) {
            switch (t) {
              case Boolean:
                return e ? '' : null;
              case Object:
              case Array:
                return null == e ? e : JSON.stringify(e);
            }
            return e;
          },
          fromAttribute(e, t) {
            switch (t) {
              case Boolean:
                return null !== e;
              case Number:
                return null === e ? null : Number(e);
              case Object:
              case Array:
                return JSON.parse(e);
            }
            return e;
          },
        },
        s = (e, t) => t !== e && (t == t || e == e),
        r = { attribute: !0, type: String, converter: o, reflect: !1, hasChanged: s },
        i = 1,
        d = 4,
        a = 8,
        l = 16,
        c = 'finalized';
      class u extends HTMLElement {
        constructor() {
          super(), this.initialize();
        }
        static get observedAttributes() {
          this.finalize();
          const e = [];
          return (
            this._classProperties.forEach((t, n) => {
              const o = this._attributeNameForProperty(n, t);
              void 0 !== o && (this._attributeToPropertyMap.set(o, n), e.push(o));
            }),
            e
          );
        }
        static _ensureClassProperties() {
          if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            const e = Object.getPrototypeOf(this)._classProperties;
            void 0 !== e && e.forEach((e, t) => this._classProperties.set(t, e));
          }
        }
        static createProperty(e, t = r) {
          if ((this._ensureClassProperties(), this._classProperties.set(e, t), t.noAccessor || this.prototype.hasOwnProperty(e))) return;
          const n = 'symbol' == typeof e ? Symbol() : `__${e}`,
            o = this.getPropertyDescriptor(e, n, t);
          void 0 !== o && Object.defineProperty(this.prototype, e, o);
        }
        static getPropertyDescriptor(e, t, n) {
          return {
            get() {
              return this[t];
            },
            set(o) {
              const s = this[e];
              (this[t] = o), this.requestUpdateInternal(e, s, n);
            },
            configurable: !0,
            enumerable: !0,
          };
        }
        static getPropertyOptions(e) {
          return (this._classProperties && this._classProperties.get(e)) || r;
        }
        static finalize() {
          const e = Object.getPrototypeOf(this);
          if (
            (e.hasOwnProperty(c) || e.finalize(),
            (this[c] = !0),
            this._ensureClassProperties(),
            (this._attributeToPropertyMap = new Map()),
            this.hasOwnProperty(JSCompiler_renameProperty('properties', this)))
          ) {
            const e = this.properties,
              t = [...Object.getOwnPropertyNames(e), ...('function' == typeof Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e) : [])];
            for (const n of t) this.createProperty(n, e[n]);
          }
        }
        static _attributeNameForProperty(e, t) {
          const n = t.attribute;
          return !1 === n ? void 0 : 'string' == typeof n ? n : 'string' == typeof e ? e.toLowerCase() : void 0;
        }
        static _valueHasChanged(e, t, n = s) {
          return n(e, t);
        }
        static _propertyValueFromAttribute(e, t) {
          const n = t.type,
            s = t.converter || o,
            r = 'function' == typeof s ? s : s.fromAttribute;
          return r ? r(e, n) : e;
        }
        static _propertyValueToAttribute(e, t) {
          if (void 0 === t.reflect) return;
          const n = t.type,
            s = t.converter;
          return ((s && s.toAttribute) || o.toAttribute)(e, n);
        }
        initialize() {
          (this._updateState = 0),
            (this._updatePromise = new Promise((e) => (this._enableUpdatingResolver = e))),
            (this._changedProperties = new Map()),
            this._saveInstanceProperties(),
            this.requestUpdateInternal();
        }
        _saveInstanceProperties() {
          this.constructor._classProperties.forEach((e, t) => {
            if (this.hasOwnProperty(t)) {
              const e = this[t];
              delete this[t], this._instanceProperties || (this._instanceProperties = new Map()), this._instanceProperties.set(t, e);
            }
          });
        }
        _applyInstanceProperties() {
          this._instanceProperties.forEach((e, t) => (this[t] = e)), (this._instanceProperties = void 0);
        }
        connectedCallback() {
          this.enableUpdating();
        }
        enableUpdating() {
          void 0 !== this._enableUpdatingResolver && (this._enableUpdatingResolver(), (this._enableUpdatingResolver = void 0));
        }
        disconnectedCallback() {}
        attributeChangedCallback(e, t, n) {
          t !== n && this._attributeToProperty(e, n);
        }
        _propertyToAttribute(e, t, n = r) {
          const o = this.constructor,
            s = o._attributeNameForProperty(e, n);
          if (void 0 !== s) {
            const e = o._propertyValueToAttribute(t, n);
            if (void 0 === e) return;
            (this._updateState = this._updateState | a), null == e ? this.removeAttribute(s) : this.setAttribute(s, e), (this._updateState = this._updateState & ~a);
          }
        }
        _attributeToProperty(e, t) {
          if (this._updateState & a) return;
          const n = this.constructor,
            o = n._attributeToPropertyMap.get(e);
          if (void 0 !== o) {
            const e = n.getPropertyOptions(o);
            (this._updateState = this._updateState | l), (this[o] = n._propertyValueFromAttribute(t, e)), (this._updateState = this._updateState & ~l);
          }
        }
        requestUpdateInternal(e, t, n) {
          let o = !0;
          if (void 0 !== e) {
            const s = this.constructor;
            (n = n || s.getPropertyOptions(e)),
              s._valueHasChanged(this[e], t, n.hasChanged)
                ? (this._changedProperties.has(e) || this._changedProperties.set(e, t),
                  !0 !== n.reflect ||
                    this._updateState & l ||
                    (void 0 === this._reflectingProperties && (this._reflectingProperties = new Map()), this._reflectingProperties.set(e, n)))
                : (o = !1);
          }
          !this._hasRequestedUpdate && o && (this._updatePromise = this._enqueueUpdate());
        }
        requestUpdate(e, t) {
          return this.requestUpdateInternal(e, t), this.updateComplete;
        }
        async _enqueueUpdate() {
          this._updateState = this._updateState | d;
          try {
            await this._updatePromise;
          } catch (e) {}
          const e = this.performUpdate();
          return null != e && (await e), !this._hasRequestedUpdate;
        }
        get _hasRequestedUpdate() {
          return this._updateState & d;
        }
        get hasUpdated() {
          return this._updateState & i;
        }
        performUpdate() {
          if (!this._hasRequestedUpdate) return;
          this._instanceProperties && this._applyInstanceProperties();
          let e = !1;
          const t = this._changedProperties;
          try {
            (e = this.shouldUpdate(t)) ? this.update(t) : this._markUpdated();
          } catch (t) {
            throw ((e = !1), this._markUpdated(), t);
          }
          e && (this._updateState & i || ((this._updateState = this._updateState | i), this.firstUpdated(t)), this.updated(t));
        }
        _markUpdated() {
          (this._changedProperties = new Map()), (this._updateState = this._updateState & ~d);
        }
        get updateComplete() {
          return this._getUpdateComplete();
        }
        _getUpdateComplete() {
          return this._updatePromise;
        }
        shouldUpdate(e) {
          return !0;
        }
        update(e) {
          void 0 !== this._reflectingProperties &&
            this._reflectingProperties.size > 0 &&
            (this._reflectingProperties.forEach((e, t) => this._propertyToAttribute(t, this[t], e)), (this._reflectingProperties = void 0)),
            this._markUpdated();
        }
        updated(e) {}
        firstUpdated(e) {}
      }
      u[c] = !0;
    },
    './node_modules/lit-element/lit-element.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          CSSResult: () => d.CSSResult,
          LitElement: () => l,
          SVGTemplateResult: () => i.SVGTemplateResult,
          TemplateResult: () => i.TemplateResult,
          UpdatingElement: () => s.UpdatingElement,
          css: () => d.css,
          customElement: () => r.customElement,
          defaultConverter: () => s.defaultConverter,
          eventOptions: () => r.eventOptions,
          html: () => i.html,
          internalProperty: () => r.internalProperty,
          notEqual: () => s.notEqual,
          property: () => r.property,
          query: () => r.query,
          queryAll: () => r.queryAll,
          queryAssignedNodes: () => r.queryAssignedNodes,
          queryAsync: () => r.queryAsync,
          supportsAdoptingStyleSheets: () => d.supportsAdoptingStyleSheets,
          svg: () => i.svg,
          unsafeCSS: () => d.unsafeCSS,
        });
      var o = n('./node_modules/lit-html/lib/shady-render.js'),
        s = n('./node_modules/lit-element/lib/updating-element.js'),
        r = n('./node_modules/lit-element/lib/decorators.js'),
        i = n('./node_modules/lit-html/lit-html.js'),
        d = n('./node_modules/lit-element/lib/css-tag.js');
      (window.litElementVersions || (window.litElementVersions = [])).push('2.4.0');
      const a = {};
      class l extends s.UpdatingElement {
        static getStyles() {
          return this.styles;
        }
        static _getUniqueStyles() {
          if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) return;
          const e = this.getStyles();
          if (Array.isArray(e)) {
            const t = (e, n) => e.reduceRight((e, n) => (Array.isArray(n) ? t(n, e) : (e.add(n), e)), n),
              n = t(e, new Set()),
              o = [];
            n.forEach((e) => o.unshift(e)), (this._styles = o);
          } else this._styles = void 0 === e ? [] : [e];
          this._styles = this._styles.map((e) => {
            if (e instanceof CSSStyleSheet && !d.supportsAdoptingStyleSheets) {
              const t = Array.prototype.slice.call(e.cssRules).reduce((e, t) => e + t.cssText, '');
              return (0, d.unsafeCSS)(t);
            }
            return e;
          });
        }
        initialize() {
          super.initialize(),
            this.constructor._getUniqueStyles(),
            (this.renderRoot = this.createRenderRoot()),
            window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot && this.adoptStyles();
        }
        createRenderRoot() {
          return this.attachShadow({ mode: 'open' });
        }
        adoptStyles() {
          const e = this.constructor._styles;
          0 !== e.length &&
            (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow
              ? d.supportsAdoptingStyleSheets
                ? (this.renderRoot.adoptedStyleSheets = e.map((e) => (e instanceof CSSStyleSheet ? e : e.styleSheet)))
                : (this._needsShimAdoptedStyleSheets = !0)
              : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
                  e.map((e) => e.cssText),
                  this.localName
                ));
        }
        connectedCallback() {
          super.connectedCallback(), this.hasUpdated && void 0 !== window.ShadyCSS && window.ShadyCSS.styleElement(this);
        }
        update(e) {
          const t = this.render();
          super.update(e),
            t !== a && this.constructor.render(t, this.renderRoot, { scopeName: this.localName, eventContext: this }),
            this._needsShimAdoptedStyleSheets &&
              ((this._needsShimAdoptedStyleSheets = !1),
              this.constructor._styles.forEach((e) => {
                const t = document.createElement('style');
                (t.textContent = e.cssText), this.renderRoot.appendChild(t);
              }));
        }
        render() {
          return a;
        }
      }
      (l.finalized = !0), (l.render = o.render);
    },
    './node_modules/lit-html/lib/default-template-processor.js': (e, t, n) => {
      n.r(t), n.d(t, { DefaultTemplateProcessor: () => s, defaultTemplateProcessor: () => r });
      var o = n('./node_modules/lit-html/lib/parts.js');
      class s {
        handleAttributeExpressions(e, t, n, s) {
          const r = t[0];
          if ('.' === r) {
            return new o.PropertyCommitter(e, t.slice(1), n).parts;
          }
          return '@' === r
            ? [new o.EventPart(e, t.slice(1), s.eventContext)]
            : '?' === r
              ? [new o.BooleanAttributePart(e, t.slice(1), n)]
              : new o.AttributeCommitter(e, t, n).parts;
        }
        handleTextExpression(e) {
          return new o.NodePart(e);
        }
      }
      const r = new s();
    },
    './node_modules/lit-html/lib/directive.js': (e, t, n) => {
      n.r(t), n.d(t, { directive: () => s, isDirective: () => r });
      const o = new WeakMap(),
        s =
          (e) =>
          (...t) => {
            const n = e(...t);
            return o.set(n, !0), n;
          },
        r = (e) => 'function' == typeof e && o.has(e);
    },
    './node_modules/lit-html/lib/dom.js': (e, t, n) => {
      n.r(t), n.d(t, { isCEPolyfill: () => o, removeNodes: () => r, reparentNodes: () => s });
      const o = 'undefined' != typeof window && null != window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
        s = (e, t, n = null, o = null) => {
          for (; t !== n; ) {
            const n = t.nextSibling;
            e.insertBefore(t, o), (t = n);
          }
        },
        r = (e, t, n = null) => {
          for (; t !== n; ) {
            const n = t.nextSibling;
            e.removeChild(t), (t = n);
          }
        };
    },
    './node_modules/lit-html/lib/modify-template.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          insertNodeIntoTemplate: () =>
            function (e, t, n = null) {
              const {
                element: { content: o },
                parts: d,
              } = e;
              if (null == n) return void o.appendChild(t);
              const a = document.createTreeWalker(o, s, null, !1);
              let l = i(d),
                c = 0,
                u = -1;
              for (; a.nextNode(); ) {
                u++;
                const e = a.currentNode;
                for (e === n && ((c = r(t)), n.parentNode.insertBefore(t, n)); -1 !== l && d[l].index === u; ) {
                  if (c > 0) {
                    for (; -1 !== l; ) (d[l].index += c), (l = i(d, l));
                    return;
                  }
                  l = i(d, l);
                }
              }
            },
          removeNodesFromTemplate: () =>
            function (e, t) {
              const {
                  element: { content: n },
                  parts: o,
                } = e,
                r = document.createTreeWalker(n, s, null, !1);
              let d = i(o),
                a = o[d],
                l = -1,
                c = 0;
              const u = [];
              let f = null;
              for (; r.nextNode(); ) {
                l++;
                const e = r.currentNode;
                for (e.previousSibling === f && (f = null), t.has(e) && (u.push(e), null === f && (f = e)), null !== f && c++; void 0 !== a && a.index === l; )
                  (a.index = null !== f ? -1 : a.index - c), (d = i(o, d)), (a = o[d]);
              }
              u.forEach((e) => e.parentNode.removeChild(e));
            },
        });
      var o = n('./node_modules/lit-html/lib/template.js');
      const s = 133;
      const r = (e) => {
          let t = 11 === e.nodeType ? 0 : 1;
          const n = document.createTreeWalker(e, s, null, !1);
          for (; n.nextNode(); ) t++;
          return t;
        },
        i = (e, t = -1) => {
          for (let n = t + 1; n < e.length; n++) {
            const t = e[n];
            if ((0, o.isTemplatePartActive)(t)) return n;
          }
          return -1;
        };
    },
    './node_modules/lit-html/lib/part.js': (e, t, n) => {
      n.r(t), n.d(t, { noChange: () => o, nothing: () => s });
      const o = {},
        s = {};
    },
    './node_modules/lit-html/lib/parts.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          AttributeCommitter: () => u,
          AttributePart: () => f,
          BooleanAttributePart: () =>
            class {
              constructor(e, t, n) {
                if (((this.value = void 0), (this.__pendingValue = void 0), 2 !== n.length || '' !== n[0] || '' !== n[1]))
                  throw new Error('Boolean attributes can only contain a single expression');
                (this.element = e), (this.name = t), (this.strings = n);
              }
              setValue(e) {
                this.__pendingValue = e;
              }
              commit() {
                for (; (0, o.isDirective)(this.__pendingValue); ) {
                  const e = this.__pendingValue;
                  (this.__pendingValue = r.noChange), e(this);
                }
                if (this.__pendingValue === r.noChange) return;
                const e = !!this.__pendingValue;
                this.value !== e && (e ? this.element.setAttribute(this.name, '') : this.element.removeAttribute(this.name), (this.value = e)),
                  (this.__pendingValue = r.noChange);
              }
            },
          EventPart: () =>
            class {
              constructor(e, t, n) {
                (this.value = void 0),
                  (this.__pendingValue = void 0),
                  (this.element = e),
                  (this.eventName = t),
                  (this.eventContext = n),
                  (this.__boundHandleEvent = (e) => this.handleEvent(e));
              }
              setValue(e) {
                this.__pendingValue = e;
              }
              commit() {
                for (; (0, o.isDirective)(this.__pendingValue); ) {
                  const e = this.__pendingValue;
                  (this.__pendingValue = r.noChange), e(this);
                }
                if (this.__pendingValue === r.noChange) return;
                const e = this.__pendingValue,
                  t = this.value,
                  n = null == e || (null != t && (e.capture !== t.capture || e.once !== t.once || e.passive !== t.passive)),
                  s = null != e && (null == t || n);
                n && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options),
                  s && ((this.__options = g(e)), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)),
                  (this.value = e),
                  (this.__pendingValue = r.noChange);
              }
              handleEvent(e) {
                'function' == typeof this.value ? this.value.call(this.eventContext || this.element, e) : this.value.handleEvent(e);
              }
            },
          NodePart: () => h,
          PropertyCommitter: () => m,
          PropertyPart: () => p,
          isIterable: () => c,
          isPrimitive: () => l,
        });
      var o = n('./node_modules/lit-html/lib/directive.js'),
        s = n('./node_modules/lit-html/lib/dom.js'),
        r = n('./node_modules/lit-html/lib/part.js'),
        i = n('./node_modules/lit-html/lib/template-instance.js'),
        d = n('./node_modules/lit-html/lib/template-result.js'),
        a = n('./node_modules/lit-html/lib/template.js');
      const l = (e) => null === e || !('object' == typeof e || 'function' == typeof e),
        c = (e) => Array.isArray(e) || !(!e || !e[Symbol.iterator]);
      class u {
        constructor(e, t, n) {
          (this.dirty = !0), (this.element = e), (this.name = t), (this.strings = n), (this.parts = []);
          for (let e = 0; e < n.length - 1; e++) this.parts[e] = this._createPart();
        }
        _createPart() {
          return new f(this);
        }
        _getValue() {
          const e = this.strings,
            t = e.length - 1,
            n = this.parts;
          if (1 === t && '' === e[0] && '' === e[1]) {
            const e = n[0].value;
            if ('symbol' == typeof e) return String(e);
            if ('string' == typeof e || !c(e)) return e;
          }
          let o = '';
          for (let s = 0; s < t; s++) {
            o += e[s];
            const t = n[s];
            if (void 0 !== t) {
              const e = t.value;
              if (l(e) || !c(e)) o += 'string' == typeof e ? e : String(e);
              else for (const t of e) o += 'string' == typeof t ? t : String(t);
            }
          }
          return (o += e[t]);
        }
        commit() {
          this.dirty && ((this.dirty = !1), this.element.setAttribute(this.name, this._getValue()));
        }
      }
      class f {
        constructor(e) {
          (this.value = void 0), (this.committer = e);
        }
        setValue(e) {
          e === r.noChange || (l(e) && e === this.value) || ((this.value = e), (0, o.isDirective)(e) || (this.committer.dirty = !0));
        }
        commit() {
          for (; (0, o.isDirective)(this.value); ) {
            const e = this.value;
            (this.value = r.noChange), e(this);
          }
          this.value !== r.noChange && this.committer.commit();
        }
      }
      class h {
        constructor(e) {
          (this.value = void 0), (this.__pendingValue = void 0), (this.options = e);
        }
        appendInto(e) {
          (this.startNode = e.appendChild((0, a.createMarker)())), (this.endNode = e.appendChild((0, a.createMarker)()));
        }
        insertAfterNode(e) {
          (this.startNode = e), (this.endNode = e.nextSibling);
        }
        appendIntoPart(e) {
          e.__insert((this.startNode = (0, a.createMarker)())), e.__insert((this.endNode = (0, a.createMarker)()));
        }
        insertAfterPart(e) {
          e.__insert((this.startNode = (0, a.createMarker)())), (this.endNode = e.endNode), (e.endNode = this.startNode);
        }
        setValue(e) {
          this.__pendingValue = e;
        }
        commit() {
          if (null === this.startNode.parentNode) return;
          for (; (0, o.isDirective)(this.__pendingValue); ) {
            const e = this.__pendingValue;
            (this.__pendingValue = r.noChange), e(this);
          }
          const e = this.__pendingValue;
          e !== r.noChange &&
            (l(e)
              ? e !== this.value && this.__commitText(e)
              : e instanceof d.TemplateResult
                ? this.__commitTemplateResult(e)
                : e instanceof Node
                  ? this.__commitNode(e)
                  : c(e)
                    ? this.__commitIterable(e)
                    : e === r.nothing
                      ? ((this.value = r.nothing), this.clear())
                      : this.__commitText(e));
        }
        __insert(e) {
          this.endNode.parentNode.insertBefore(e, this.endNode);
        }
        __commitNode(e) {
          this.value !== e && (this.clear(), this.__insert(e), (this.value = e));
        }
        __commitText(e) {
          const t = this.startNode.nextSibling,
            n = 'string' == typeof (e = null == e ? '' : e) ? e : String(e);
          t === this.endNode.previousSibling && 3 === t.nodeType ? (t.data = n) : this.__commitNode(document.createTextNode(n)), (this.value = e);
        }
        __commitTemplateResult(e) {
          const t = this.options.templateFactory(e);
          if (this.value instanceof i.TemplateInstance && this.value.template === t) this.value.update(e.values);
          else {
            const n = new i.TemplateInstance(t, e.processor, this.options),
              o = n._clone();
            n.update(e.values), this.__commitNode(o), (this.value = n);
          }
        }
        __commitIterable(e) {
          Array.isArray(this.value) || ((this.value = []), this.clear());
          const t = this.value;
          let n,
            o = 0;
          for (const s of e)
            void 0 === (n = t[o]) && ((n = new h(this.options)), t.push(n), 0 === o ? n.appendIntoPart(this) : n.insertAfterPart(t[o - 1])),
              n.setValue(s),
              n.commit(),
              o++;
          o < t.length && ((t.length = o), this.clear(n && n.endNode));
        }
        clear(e = this.startNode) {
          (0, s.removeNodes)(this.startNode.parentNode, e.nextSibling, this.endNode);
        }
      }
      class m extends u {
        constructor(e, t, n) {
          super(e, t, n), (this.single = 2 === n.length && '' === n[0] && '' === n[1]);
        }
        _createPart() {
          return new p(this);
        }
        _getValue() {
          return this.single ? this.parts[0].value : super._getValue();
        }
        commit() {
          this.dirty && ((this.dirty = !1), (this.element[this.name] = this._getValue()));
        }
      }
      class p extends f {}
      let _ = !1;
      (() => {
        try {
          const e = {
            get capture() {
              return (_ = !0), !1;
            },
          };
          window.addEventListener('test', e, e), window.removeEventListener('test', e, e);
        } catch (e) {}
      })();
      const g = (e) => e && (_ ? { capture: e.capture, passive: e.passive, once: e.once } : e.capture);
    },
    './node_modules/lit-html/lib/render.js': (e, t, n) => {
      n.r(t), n.d(t, { parts: () => i, render: () => d });
      var o = n('./node_modules/lit-html/lib/dom.js'),
        s = n('./node_modules/lit-html/lib/parts.js'),
        r = n('./node_modules/lit-html/lib/template-factory.js');
      const i = new WeakMap(),
        d = (e, t, n) => {
          let d = i.get(t);
          void 0 === d &&
            ((0, o.removeNodes)(t, t.firstChild), i.set(t, (d = new s.NodePart(Object.assign({ templateFactory: r.templateFactory }, n)))), d.appendInto(t)),
            d.setValue(e),
            d.commit();
        };
    },
    './node_modules/lit-html/lib/shady-render.js': (e, t, n) => {
      n.r(t), n.d(t, { TemplateResult: () => l.TemplateResult, html: () => l.html, render: () => _, shadyTemplateFactory: () => f, svg: () => l.svg });
      var o = n('./node_modules/lit-html/lib/dom.js'),
        s = n('./node_modules/lit-html/lib/modify-template.js'),
        r = n('./node_modules/lit-html/lib/render.js'),
        i = n('./node_modules/lit-html/lib/template-factory.js'),
        d = n('./node_modules/lit-html/lib/template-instance.js'),
        a = n('./node_modules/lit-html/lib/template.js'),
        l = n('./node_modules/lit-html/lit-html.js');
      const c = (e, t) => `${e}--${t}`;
      let u = !0;
      void 0 === window.ShadyCSS
        ? (u = !1)
        : void 0 === window.ShadyCSS.prepareTemplateDom &&
          (console.warn('Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1.'),
          (u = !1));
      const f = (e) => (t) => {
          const n = c(t.type, e);
          let o = i.templateCaches.get(n);
          void 0 === o && ((o = { stringsArray: new WeakMap(), keyString: new Map() }), i.templateCaches.set(n, o));
          let s = o.stringsArray.get(t.strings);
          if (void 0 !== s) return s;
          const r = t.strings.join(a.marker);
          if (void 0 === (s = o.keyString.get(r))) {
            const n = t.getTemplateElement();
            u && window.ShadyCSS.prepareTemplateDom(n, e), (s = new a.Template(t, n)), o.keyString.set(r, s);
          }
          return o.stringsArray.set(t.strings, s), s;
        },
        h = ['html', 'svg'],
        m = new Set(),
        p = (e, t, n) => {
          m.add(e);
          const o = n ? n.element : document.createElement('template'),
            r = t.querySelectorAll('style'),
            { length: d } = r;
          if (0 === d) return void window.ShadyCSS.prepareTemplateStyles(o, e);
          const a = document.createElement('style');
          for (let e = 0; e < d; e++) {
            const t = r[e];
            t.parentNode.removeChild(t), (a.textContent += t.textContent);
          }
          ((e) => {
            h.forEach((t) => {
              const n = i.templateCaches.get(c(t, e));
              void 0 !== n &&
                n.keyString.forEach((e) => {
                  const {
                      element: { content: t },
                    } = e,
                    n = new Set();
                  Array.from(t.querySelectorAll('style')).forEach((e) => {
                    n.add(e);
                  }),
                    (0, s.removeNodesFromTemplate)(e, n);
                });
            });
          })(e);
          const l = o.content;
          n ? (0, s.insertNodeIntoTemplate)(n, a, l.firstChild) : l.insertBefore(a, l.firstChild), window.ShadyCSS.prepareTemplateStyles(o, e);
          const u = l.querySelector('style');
          if (window.ShadyCSS.nativeShadow && null !== u) t.insertBefore(u.cloneNode(!0), t.firstChild);
          else if (n) {
            l.insertBefore(a, l.firstChild);
            const e = new Set();
            e.add(a), (0, s.removeNodesFromTemplate)(n, e);
          }
        },
        _ = (e, t, n) => {
          if (!n || 'object' != typeof n || !n.scopeName) throw new Error('The `scopeName` option is required.');
          const s = n.scopeName,
            i = r.parts.has(t),
            a = u && 11 === t.nodeType && !!t.host,
            l = a && !m.has(s),
            c = l ? document.createDocumentFragment() : t;
          if (((0, r.render)(e, c, Object.assign({ templateFactory: f(s) }, n)), l)) {
            const e = r.parts.get(c);
            r.parts.delete(c);
            const n = e.value instanceof d.TemplateInstance ? e.value.template : void 0;
            p(s, c, n), (0, o.removeNodes)(t, t.firstChild), t.appendChild(c), r.parts.set(t, e);
          }
          !i && a && window.ShadyCSS.styleElement(t.host);
        };
    },
    './node_modules/lit-html/lib/template-factory.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          templateCaches: () => s,
          templateFactory: () =>
            function (e) {
              let t = s.get(e.type);
              void 0 === t && ((t = { stringsArray: new WeakMap(), keyString: new Map() }), s.set(e.type, t));
              let n = t.stringsArray.get(e.strings);
              if (void 0 !== n) return n;
              const r = e.strings.join(o.marker);
              void 0 === (n = t.keyString.get(r)) && ((n = new o.Template(e, e.getTemplateElement())), t.keyString.set(r, n));
              return t.stringsArray.set(e.strings, n), n;
            },
        });
      var o = n('./node_modules/lit-html/lib/template.js');
      const s = new Map();
    },
    './node_modules/lit-html/lib/template-instance.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          TemplateInstance: () =>
            class {
              constructor(e, t, n) {
                (this.__parts = []), (this.template = e), (this.processor = t), (this.options = n);
              }
              update(e) {
                let t = 0;
                for (const n of this.__parts) void 0 !== n && n.setValue(e[t]), t++;
                for (const e of this.__parts) void 0 !== e && e.commit();
              }
              _clone() {
                const e = o.isCEPolyfill ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0),
                  t = [],
                  n = this.template.parts,
                  r = document.createTreeWalker(e, 133, null, !1);
                let i,
                  d = 0,
                  a = 0,
                  l = r.nextNode();
                for (; d < n.length; )
                  if (((i = n[d]), (0, s.isTemplatePartActive)(i))) {
                    for (; a < i.index; )
                      a++,
                        'TEMPLATE' === l.nodeName && (t.push(l), (r.currentNode = l.content)),
                        null === (l = r.nextNode()) && ((r.currentNode = t.pop()), (l = r.nextNode()));
                    if ('node' === i.type) {
                      const e = this.processor.handleTextExpression(this.options);
                      e.insertAfterNode(l.previousSibling), this.__parts.push(e);
                    } else this.__parts.push(...this.processor.handleAttributeExpressions(l, i.name, i.strings, this.options));
                    d++;
                  } else this.__parts.push(void 0), d++;
                return o.isCEPolyfill && (document.adoptNode(e), customElements.upgrade(e)), e;
              }
            },
        });
      var o = n('./node_modules/lit-html/lib/dom.js'),
        s = n('./node_modules/lit-html/lib/template.js');
    },
    './node_modules/lit-html/lib/template-result.js': (e, t, n) => {
      n.r(t), n.d(t, { SVGTemplateResult: () => a, TemplateResult: () => d });
      var o = n('./node_modules/lit-html/lib/dom.js'),
        s = n('./node_modules/lit-html/lib/template.js');
      const r = window.trustedTypes && trustedTypes.createPolicy('lit-html', { createHTML: (e) => e }),
        i = ` ${s.marker} `;
      class d {
        constructor(e, t, n, o) {
          (this.strings = e), (this.values = t), (this.type = n), (this.processor = o);
        }
        getHTML() {
          const e = this.strings.length - 1;
          let t = '',
            n = !1;
          for (let o = 0; o < e; o++) {
            const e = this.strings[o],
              r = e.lastIndexOf('\x3c!--');
            n = (r > -1 || n) && -1 === e.indexOf('--\x3e', r + 1);
            const d = s.lastAttributeNameRegex.exec(e);
            t += null === d ? e + (n ? i : s.nodeMarker) : e.substr(0, d.index) + d[1] + d[2] + s.boundAttributeSuffix + d[3] + s.marker;
          }
          return (t += this.strings[e]);
        }
        getTemplateElement() {
          const e = document.createElement('template');
          let t = this.getHTML();
          return void 0 !== r && (t = r.createHTML(t)), (e.innerHTML = t), e;
        }
      }
      class a extends d {
        getHTML() {
          return `<svg>${super.getHTML()}</svg>`;
        }
        getTemplateElement() {
          const e = super.getTemplateElement(),
            t = e.content,
            n = t.firstChild;
          return t.removeChild(n), (0, o.reparentNodes)(t, n.firstChild), e;
        }
      }
    },
    './node_modules/lit-html/lib/template.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          Template: () =>
            class {
              constructor(e, t) {
                (this.parts = []), (this.element = t);
                const n = [],
                  s = [],
                  a = document.createTreeWalker(t.content, 133, null, !1);
                let u = 0,
                  f = -1,
                  h = 0;
                const {
                  strings: m,
                  values: { length: p },
                } = e;
                for (; h < p; ) {
                  const e = a.nextNode();
                  if (null !== e) {
                    if ((f++, 1 === e.nodeType)) {
                      if (e.hasAttributes()) {
                        const t = e.attributes,
                          { length: n } = t;
                        let o = 0;
                        for (let e = 0; e < n; e++) d(t[e].name, i) && o++;
                        for (; o-- > 0; ) {
                          const t = m[h],
                            n = c.exec(t)[2],
                            o = n.toLowerCase() + i,
                            s = e.getAttribute(o);
                          e.removeAttribute(o);
                          const d = s.split(r);
                          this.parts.push({ type: 'attribute', index: f, name: n, strings: d }), (h += d.length - 1);
                        }
                      }
                      'TEMPLATE' === e.tagName && (s.push(e), (a.currentNode = e.content));
                    } else if (3 === e.nodeType) {
                      const t = e.data;
                      if (t.indexOf(o) >= 0) {
                        const o = e.parentNode,
                          s = t.split(r),
                          a = s.length - 1;
                        for (let t = 0; t < a; t++) {
                          let n,
                            r = s[t];
                          if ('' === r) n = l();
                          else {
                            const e = c.exec(r);
                            null !== e && d(e[2], i) && (r = r.slice(0, e.index) + e[1] + e[2].slice(0, -i.length) + e[3]), (n = document.createTextNode(r));
                          }
                          o.insertBefore(n, e), this.parts.push({ type: 'node', index: ++f });
                        }
                        '' === s[a] ? (o.insertBefore(l(), e), n.push(e)) : (e.data = s[a]), (h += a);
                      }
                    } else if (8 === e.nodeType)
                      if (e.data === o) {
                        const t = e.parentNode;
                        (null !== e.previousSibling && f !== u) || (f++, t.insertBefore(l(), e)),
                          (u = f),
                          this.parts.push({ type: 'node', index: f }),
                          null === e.nextSibling ? (e.data = '') : (n.push(e), f--),
                          h++;
                      } else {
                        let t = -1;
                        for (; -1 !== (t = e.data.indexOf(o, t + 1)); ) this.parts.push({ type: 'node', index: -1 }), h++;
                      }
                  } else a.currentNode = s.pop();
                }
                for (const e of n) e.parentNode.removeChild(e);
              }
            },
          boundAttributeSuffix: () => i,
          createMarker: () => l,
          isTemplatePartActive: () => a,
          lastAttributeNameRegex: () => c,
          marker: () => o,
          markerRegex: () => r,
          nodeMarker: () => s,
        });
      const o = `{{lit-${String(Math.random()).slice(2)}}}`,
        s = `\x3c!--${o}--\x3e`,
        r = new RegExp(`${o}|${s}`),
        i = '$lit$';
      const d = (e, t) => {
          const n = e.length - t.length;
          return n >= 0 && e.slice(n) === t;
        },
        a = (e) => -1 !== e.index,
        l = () => document.createComment(''),
        c = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
    },
    './node_modules/lit-html/lit-html.js': (e, t, n) => {
      n.r(t),
        n.d(t, {
          AttributeCommitter: () => a.AttributeCommitter,
          AttributePart: () => a.AttributePart,
          BooleanAttributePart: () => a.BooleanAttributePart,
          DefaultTemplateProcessor: () => o.DefaultTemplateProcessor,
          EventPart: () => a.EventPart,
          NodePart: () => a.NodePart,
          PropertyCommitter: () => a.PropertyCommitter,
          PropertyPart: () => a.PropertyPart,
          SVGTemplateResult: () => s.SVGTemplateResult,
          Template: () => f.Template,
          TemplateInstance: () => u.TemplateInstance,
          TemplateResult: () => s.TemplateResult,
          createMarker: () => f.createMarker,
          defaultTemplateProcessor: () => o.defaultTemplateProcessor,
          directive: () => r.directive,
          html: () => h,
          isDirective: () => r.isDirective,
          isIterable: () => a.isIterable,
          isPrimitive: () => a.isPrimitive,
          isTemplatePartActive: () => f.isTemplatePartActive,
          noChange: () => d.noChange,
          nothing: () => d.nothing,
          parts: () => l.parts,
          removeNodes: () => i.removeNodes,
          render: () => l.render,
          reparentNodes: () => i.reparentNodes,
          svg: () => m,
          templateCaches: () => c.templateCaches,
          templateFactory: () => c.templateFactory,
        });
      var o = n('./node_modules/lit-html/lib/default-template-processor.js'),
        s = n('./node_modules/lit-html/lib/template-result.js'),
        r = n('./node_modules/lit-html/lib/directive.js'),
        i = n('./node_modules/lit-html/lib/dom.js'),
        d = n('./node_modules/lit-html/lib/part.js'),
        a = n('./node_modules/lit-html/lib/parts.js'),
        l = n('./node_modules/lit-html/lib/render.js'),
        c = n('./node_modules/lit-html/lib/template-factory.js'),
        u = n('./node_modules/lit-html/lib/template-instance.js'),
        f = n('./node_modules/lit-html/lib/template.js');
      'undefined' != typeof window && (window.litHtmlVersions || (window.litHtmlVersions = [])).push('1.3.0');
      const h = (e, ...t) => new s.TemplateResult(e, t, 'html', o.defaultTemplateProcessor),
        m = (e, ...t) => new s.SVGTemplateResult(e, t, 'svg', o.defaultTemplateProcessor);
    },
  },
  __webpack_module_cache__ = {};
function __webpack_require__(e) {
  var t = __webpack_module_cache__[e];
  if (void 0 !== t) return t.exports;
  var n = (__webpack_module_cache__[e] = { id: e, exports: {} });
  return __webpack_modules__[e](n, n.exports, __webpack_require__), n.exports;
}
(__webpack_require__.n = (e) => {
  var t = e && e.__esModule ? () => e.default : () => e;
  return __webpack_require__.d(t, { a: t }), t;
}),
  (__webpack_require__.d = (e, t) => {
    for (var n in t) __webpack_require__.o(t, n) && !__webpack_require__.o(e, n) && Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
  }),
  (__webpack_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
  (__webpack_require__.r = (e) => {
    'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
      Object.defineProperty(e, '__esModule', { value: !0 });
  }),
  (__webpack_require__.nc = void 0);
var __webpack_exports__ = {};
(() => {
  __webpack_require__.r(__webpack_exports__);
  var e = __webpack_require__('./node_modules/lit-element/lit-element.js'),
    t = (__webpack_require__('./src/styles/pdb-ligand-env.css'), __webpack_require__('./src/plugin/manager.ts')),
    n = __webpack_require__('./src/plugin/config.ts');
  customElements.define(
    'pdb-ligand-env',
    class extends e.LitElement {
      static get properties() {
        return {
          pdbId: { type: String, attribute: 'pdb-id' },
          bmId: { type: String, attribute: 'bound-molecule-id' },
          entityId: { type: String, attribute: 'entity-id' },
          resName: { type: String, attribute: 'pdb-res-name' },
          resId: { type: Number, attribute: 'pdb-res-id' },
          contactType: { type: Array, attribute: 'contact-type', noAccessors: !0 },
          chainId: { type: String, attribute: 'pdb-chain-id' },
          substructureHighlight: { type: Array, attribute: 'substructure' },
          substructureColor: { type: String, attribute: 'color' },
          menuOn: { type: Boolean, attribute: 'menu-on' },
          menuOff: { type: Boolean, attribute: 'menu-off' },
          zoomControlsOn: { type: Boolean, attribute: 'zoom-on' },
          zoomControlsOff: { type: Boolean, attribute: 'zoom-off' },
          scrollZoomOn: { type: Boolean, attribute: 'scroll-zoom-on' },
          namesOn: { type: Boolean, attribute: 'names-on' },
          depictionOnly: { type: Boolean, attribute: 'depiction-only' },
          env: { type: String, attribute: 'environment' },
        };
      }
      set contactType(e) {
        let t = this._contactType + '';
        (this._contactType = e), t.length > 0 && this.display && this.display.showWeights(e);
      }
      get contactType() {
        return this._contactType;
      }
      constructor() {
        super();
      }
      async connectedCallback() {
        super.connectedCallback(), this.renderLigandEnv();
      }
      renderLigandEnv() {
        (this.innerHTML = ''), (this.highlightSubstructure = []);
        let e = new n.UIParameters();
        void 0 !== this.zoomControlsOn && (e.zoomControls = this.zoomControlsOn),
          void 0 !== this.zoomControlsOff && (e.zoomControls = !this.zoomControlsOff),
          (e.disableScrollZoom = void 0 !== this.scrollZoomOn && !this.scrollZoomOn),
          (e.menu = void 0 !== this.pdbId),
          void 0 !== this.menuOn && (e.menu = this.menuOn),
          void 0 !== this.menuOff && (e.menu = !this.menuOff);
        let o = void 0 === this.env ? 'production' : this.env,
          s = void 0 !== this.namesOn && this.namesOn;
        this.depictionOnly ? (this.display = new t.Visualization(this, e, o, !0)) : (this.display = new t.Visualization(this, e, o, !1)),
          this.pdbId
            ? this.entityId
              ? this.display.initCarbohydratePolymerInteractions(this.pdbId, this.bmId, this.entityId)
              : this.bmId
                ? this.display.initBoundMoleculeInteractions(this.pdbId, this.bmId)
                : this.display.initLigandInteractions(this.pdbId, this.resId, this.chainId)
            : this.resName &&
              this.display.initLigandDisplay(this.resName, s).then(() => {
                this.contactType &&
                  (void 0 === this.display.ligandIntxData
                    ? this.display.initLigandWeights(this.resName).then(() => {
                        this.display.showWeights(this.contactType);
                      })
                    : this.display.showWeights(this.contactType));
              });
      }
      set depiction(e) {
        e && (this.display.addDepiction(e, !1), this.display.centerScene());
      }
      set interaction(e) {
        e && this.display && (this.display.ligandIntxData = e);
      }
      set highlightSubstructure(e) {
        this.display && ((this.substructureHighlight = e), this.display.addLigandHighlight(this.substructureHighlight));
      }
      set highlightColor(e) {
        e &&
          this.display &&
          this.substructureHighlight &&
          ((this.highlightColor = e), this.display.addLigandHighlight(this.substructureHighlight, this.highlightColor));
      }
      set zoom(e) {
        this.display && this.display.toggleZoom(e);
      }
      set atomNames(e) {
        this.display.toggleDepiction(e);
      }
      createRenderRoot() {
        return this;
      }
    }
  );
})();
