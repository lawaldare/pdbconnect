/*! For license information please see pdb-rna-viewer-plugin-0.3.1.js.LICENSE.txt */
(() => {
  'use strict';
  var t,
    e,
    n,
    i,
    r,
    o,
    s = {
      175: (t, e, n) => {
        Object.defineProperty(e, '__esModule', { value: !0 }), (e.CustomEvents = void 0);
        var i,
          r = n(655);
        ((i = e.CustomEvents || (e.CustomEvents = {})).create = function (t) {
          for (var e = {}, n = 0, i = t.length; n < i; n++) {
            var r = t[n],
              o = void 0;
            'function' == typeof MouseEvent
              ? (o = new MouseEvent(r, { view: window, bubbles: !0, cancelable: !0 }))
              : 'function' == typeof document.createEvent && (o = document.createEvent('MouseEvents')).initEvent(r, !0, !0),
              (e[r] = o);
          }
          return e;
        }),
          (i.dispatchCustomEvent = function (t, e, n) {
            (t.eventData = e), n.dispatchEvent(t);
          }),
          (i.subscribeToComponentEvents = function (t) {
            document.addEventListener('protvista-click', function (e) {
              return (0, r.__awaiter)(this, void 0, void 0, function () {
                var n, i;
                return (0, r.__generator)(this, function (r) {
                  switch (r.label) {
                    case 0:
                      return void 0 === e.detail
                        ? [3, 2]
                        : ((n = parseInt(e.detail.start)), (i = parseInt(e.detail.end)), [4, t.selectResidueRange(n, i, void 0, !0)]);
                    case 1:
                      r.sent(), (r.label = 2);
                    case 2:
                      return [2];
                  }
                });
              });
            }),
              document.addEventListener('protvista-mouseover', function (e) {
                return (0, r.__awaiter)(this, void 0, void 0, function () {
                  var n, i;
                  return (0, r.__generator)(this, function (r) {
                    return void 0 !== e.detail && ((n = parseInt(e.detail.start)), (i = parseInt(e.detail.end)), t.highlightResidueRange(n, i, void 0, !0)), [2];
                  });
                });
              }),
              document.addEventListener('protvista-mouseout', function (e) {
                t.clearHighlight(!0);
              }),
              document.addEventListener('PDB.molstar.click', function (e) {
                return (0, r.__awaiter)(this, void 0, void 0, function () {
                  return (0, r.__generator)(this, function (n) {
                    switch (n.label) {
                      case 0:
                        return void 0 === e.eventData || void 0 === e.eventData.residueNumber || e.eventData.auth_asym_id !== t.options.chainId
                          ? [3, 2]
                          : [4, t.toggleResidue(e.eventData.residueNumber, void 0, !0)];
                      case 1:
                        n.sent(), (n.label = 2);
                      case 2:
                        return [2];
                    }
                  });
                });
              }),
              document.addEventListener('PDB.molstar.mouseover', function (e) {
                void 0 !== e.eventData &&
                  void 0 !== e.eventData.residueNumber &&
                  e.eventData.auth_asym_id === t.options.chainId &&
                  t.highlightResidue(e.eventData.residueNumber, void 0, !0);
              }),
              document.addEventListener('PDB.molstar.mouseout', function () {
                t.clearHighlight(!0);
              }),
              document.addEventListener('PDBe.deselect', function (e) {
                return (0, r.__awaiter)(this, void 0, void 0, function () {
                  return (0, r.__generator)(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, t.clearSelection(void 0, !0)];
                      case 1:
                        return e.sent(), [2];
                    }
                  });
                });
              });
          });
      },
      345: (t, e, n) => {
        Object.defineProperty(e, '__esModule', { value: !0 }), (e.DataService = void 0);
        var i = n(655),
          r = (function () {
            function t() {}
            return (
              (t.prototype.getApiData = function (t, e, n) {
                return (0, i.__awaiter)(this, void 0, void 0, function () {
                  var r, o;
                  return (0, i.__generator)(this, function (i) {
                    switch (i.label) {
                      case 0:
                        return (
                          i.trys.push([0, 3, , 4]),
                          (r = 'https://www.ebi.ac.uk/pdbe/static/entry/' + n.toLowerCase() + '_' + t + '_' + e.toUpperCase() + '.json'),
                          [4, fetch(r)]
                        );
                      case 1:
                        return [4, i.sent().json()];
                      case 2:
                        return [2, i.sent()];
                      case 3:
                        return (o = i.sent()), this.handleError(o), [2, void 0];
                      case 4:
                        return [2];
                    }
                  });
                });
              }),
              (t.prototype.getFR3DData = function (t, e) {
                return (0, i.__awaiter)(this, void 0, void 0, function () {
                  var n, r;
                  return (0, i.__generator)(this, function (i) {
                    switch (i.label) {
                      case 0:
                        return (
                          i.trys.push([0, 3, , 4]),
                          (n = 'https://www.ebi.ac.uk/pdbe/static/entry/' + t.toLowerCase() + '_' + e.toUpperCase() + '_basepair.json'),
                          [4, fetch(n)]
                        );
                      case 1:
                        return [4, i.sent().json()];
                      case 2:
                        return [2, i.sent()];
                      case 3:
                        return (r = i.sent()), this.handleFR3DError(r), [2, void 0];
                      case 4:
                        return [2];
                    }
                  });
                });
              }),
              (t.prototype.handleError = function (t) {
                console.log('RNA topology data not available!', t);
              }),
              (t.prototype.handleFR3DError = function (t) {
                console.log('FR3D mapping data not available!', t);
              }),
              t
            );
          })();
        e.DataService = r;
      },
      621: (t, e, n) => {
        Object.defineProperty(e, '__esModule', { value: !0 }), (e.UiActionsService = void 0);
        var i = n(655),
          r = n(175),
          o = n(811),
          s = n(819);
        n(751);
        var a = (function () {
          function t(t) {
            this.pdbId = t;
          }
          return (
            (t.prototype.applyButtonActions = function () {
              var e = this,
                n = (0, o.select)('.rnaTopoSvg'),
                i = (0, s.zoom)().on('zoom', function (t) {
                  (0, o.select)('.rnaTopoSvg_' + e.pdbId).attr('transform', t.transform.toString()),
                    (0, o.select)('.rnaTopoSvgHighlight_' + e.pdbId).attr('transform', t.transform.toString()),
                    (0, o.select)('.rnaTopoSvgSelection_' + e.pdbId).attr('transform', t.transform.toString());
                });
              (t.zoomBehavior = i),
                (0, o.select)('.rnaTopoSvg').call(i).on('dblclick.zoom', null).on('wheel.zoom', null).on('mousewheel.zoom', null),
                (0, o.select)('#rnaTopologyZoomIn-' + this.pdbId).on('click', function (t) {
                  t.stopPropagation(), i.scaleBy(n.transition().duration(300), 1.2);
                }),
                (0, o.select)('#rnaTopologyZoomOut-' + this.pdbId).on('click', function (t) {
                  var r;
                  t.stopPropagation();
                  var a = null === (r = (0, o.select)('.rnaTopoSvg_' + e.pdbId).node()) || void 0 === r ? void 0 : r.getAttribute('transform');
                  if (a && '' !== a) {
                    var u = +a.match(/.+scale\((.*)\)/)[1];
                    if (u <= 1 || u - 0.3 <= 1) return void n.transition().duration(300).call(i.transform, s.zoomIdentity);
                  }
                  i.scaleBy((0, o.select)('.rnaTopoSvg').transition().duration(300), 0.8);
                }),
                (0, o.select)('#rnaTopologyReset-' + this.pdbId).on('click', function (t) {
                  t.stopPropagation(), n.transition().duration(300).call(i.transform, s.zoomIdentity);
                }),
                (0, o.select)('.pdb-rna-view-container-' + this.pdbId).on('click', function (n) {
                  n.stopPropagation(), t.clearHighlight(), t.clearSelection(e.pdbId);
                  var i = document.getElementById(e.pdbId + '-rnaTopologyTooltip');
                  i && (i.style.display = 'none');
                  var r = document.getElementById(e.pdbId + '-rnaTopologyTooltipHighlight');
                  r && (r.style.display = 'none');
                });
            }),
            (t.unSelectNucleotide = function (e, n, o, s, a, u, l, c, h) {
              return (0, i.__awaiter)(this, void 0, void 0, function () {
                var c, p;
                return (0, i.__generator)(this, function (i) {
                  switch (i.label) {
                    case 0:
                      return null == l || l.stopImmediatePropagation(), t.clearSelection(e), 'click' !== a ? [3, 2] : [4, t.zoomReset()];
                    case 1:
                      i.sent(), (i.label = 2);
                    case 2:
                      return (
                        (document.getElementById(e + '-rnaTopologyTooltip').style.display = 'none'),
                        u ||
                          h ||
                          ((c = { pdbId: e, auth_asym_id: o, label_seq_id: s, entityId: n }),
                          (p = s ? document.querySelector('.rnaview_' + e + '_' + s) : document.querySelector('.rnaTopoSvg_' + e)),
                          r.CustomEvents.dispatchCustomEvent(t.pdbevents['PDB.RNA.viewer.deselect'], c, p)),
                        [2]
                      );
                  }
                });
              });
            }),
            (t.showCheckboxes = function () {
              var t = document.getElementById('checkboxes');
              this.expanded ? ((t.style.display = 'none'), (this.expanded = !1)) : ((t.style.display = 'block'), (this.expanded = !0));
            }),
            (t.clearHighlight = function () {
              document.querySelectorAll('.rnaTopo-hover').forEach(function (t) {
                null == t || t.classList.remove('rnaTopo-hover');
              });
            }),
            (t.clearSelection = function (t, e) {
              document.querySelector('.rnaTopoSvgSelection_' + t).innerHTML = '';
              var n = document.querySelectorAll('.rnaTopo-selected'),
                i = [];
              if (void 0 !== e) {
                var r = Array.isArray(e) ? e : [e];
                i = r.map(function (e) {
                  return '.rnaview_' + t + '_' + e;
                });
              }
              n.forEach(function (t) {
                i.some(function (e) {
                  return t.matches(e);
                }) ||
                  null == t ||
                  t.classList.remove('rnaTopo-selected');
              });
            }),
            (t.showTooltip = function (e, n, i, o, s, a, u, l, c, h) {
              var p = document.getElementById('tooltip');
              (p.id = 'tooltip'),
                (p.innerHTML = a),
                (p.style.display = 'block'),
                (p.style.left = s.layerX + 'px'),
                (p.style.top = s.layerY + 'px'),
                (this.tooltipSelectedColor = l),
                (this.tooltipSelectedWidth = parseFloat(h)),
                (this.fillColor = c),
                document
                  .querySelector('svg.rnaTopoSvg')
                  .getElementsByClassName(u)[0]
                  .setAttribute('stroke-width', 2.5 * parseFloat(h)),
                document.querySelector('svg.rnaTopoSvg').getElementsByClassName(u)[0].setAttribute('stroke', 'orange'),
                document.querySelector('svg.rnaTopoSvg').getElementsByClassName(u)[0].setAttribute('fill', 'orange');
              var d = {
                  pdbId: e,
                  label_seq_ids: o.split(' - ').map(function (t) {
                    return parseInt(t);
                  }),
                  entityId: n,
                },
                f = document.querySelector('.rnaTopoSvg_' + e);
              r.CustomEvents.dispatchCustomEvent(t.pdbevents['PDB.RNA.viewer.click'], d, f);
            }),
            (t.hideTooltip = function (e, n, i, o, s) {
              (document.getElementById('tooltip').style.display = 'none'),
                document.querySelector('svg.rnaTopoSvg').getElementsByClassName(s)[0].setAttribute('stroke-width', this.tooltipSelectedWidth),
                document
                  .querySelector('svg.rnaTopoSvg')
                  .getElementsByClassName(s)[0]
                  .setAttribute('stroke', '' + this.tooltipSelectedColor),
                document
                  .querySelector('svg.rnaTopoSvg')
                  .getElementsByClassName(s)[0]
                  .setAttribute('fill', '' + this.fillColor);
              var a = {
                  pdbId: e,
                  auth_asym_id: i,
                  label_seq_ids: o.split(' - ').map(function (t) {
                    return parseInt(t);
                  }),
                  entityId: n,
                },
                u = document.querySelector('.rnaTopoSvg_' + e);
              r.CustomEvents.dispatchCustomEvent(t.pdbevents['PDB.RNA.viewer.deselect'], a, u);
            }),
            (t.transitionEnd = function (t) {
              return (0, i.__awaiter)(this, void 0, void 0, function () {
                return (0, i.__generator)(this, function (e) {
                  return [
                    2,
                    new Promise(function (e) {
                      t.on('end', function () {
                        return e();
                      });
                    }),
                  ];
                });
              });
            }),
            (t.zoomToNucleotides = function (e, n) {
              return (0, i.__awaiter)(this, void 0, void 0, function () {
                var r,
                  a,
                  u,
                  l,
                  c = this;
                return (0, i.__generator)(this, function (h) {
                  switch (h.label) {
                    case 0:
                      return (
                        (r = (0, o.select)('.rnaTopoSvg')),
                        (a = r.node()) && document.querySelector('.rnaTopoSvg_' + e)
                          ? ((u = function () {
                              return (0, i.__awaiter)(c, void 0, void 0, function () {
                                var o, u, l, c, h, p, d, f, v, g, y, m, _, b, w, S, x, E, I, k, M, A;
                                return (0, i.__generator)(this, function (i) {
                                  switch (i.label) {
                                    case 0:
                                      for (
                                        o = void 0, u = void 0, l = void 0, c = void 0, h = 0, p = 0, d = 0, f = a.viewBox.baseVal, v = 0, g = n;
                                        v < g.length;
                                        v++
                                      )
                                        (y = g[v]),
                                          (m = document.querySelector('.rnaview_' + e + '_' + y)) &&
                                            ((_ = m.getBBox()),
                                            (b = m.getBoundingClientRect()),
                                            void 0 === o && 'text' === m.nodeName && ((o = b.height), (S = a.clientHeight), (c = (0.05 * S) / o)),
                                            void 0 === u &&
                                              void 0 === l &&
                                              'path' === m.nodeName &&
                                              ((u = b.height), (l = b.width), (w = Math.max(u, l)), (S = a.clientHeight), (c = (0.05 * S) / w)),
                                            (h += _.x + _.width / 2),
                                            (p += _.y + _.height / 2),
                                            (d += 1));
                                      return (
                                        (x = h / d),
                                        (E = p / d),
                                        (I = f.width / 2 - c * x),
                                        (k = f.height / 2 - c * E),
                                        (M = s.zoomIdentity.translate(I, k).scale(c)),
                                        (A = r.transition().duration(500).call(t.zoomBehavior.transform, M)),
                                        [4, t.transitionEnd(A)]
                                      );
                                    case 1:
                                      return i.sent(), (t.zoomed = !0), [2];
                                  }
                                });
                              });
                            }),
                            t.zoomed ? ((l = r.transition().duration(500).call(t.zoomBehavior.transform, s.zoomIdentity)), [4, t.transitionEnd(l)]) : [3, 3])
                          : [2]
                      );
                    case 1:
                      return h.sent(), [4, u()];
                    case 2:
                      return h.sent(), [3, 5];
                    case 3:
                      return [4, u()];
                    case 4:
                      h.sent(), (h.label = 5);
                    case 5:
                      return [2];
                  }
                });
              });
            }),
            (t.zoomReset = function () {
              return (0, i.__awaiter)(this, void 0, void 0, function () {
                var e, n;
                return (0, i.__generator)(this, function (i) {
                  switch (i.label) {
                    case 0:
                      return (
                        (e = (0, o.select)('.rnaTopoSvg')), (n = e.transition().duration(500).call(t.zoomBehavior.transform, s.zoomIdentity)), [4, t.transitionEnd(n)]
                      );
                    case 1:
                      return i.sent(), (t.zoomed = !1), [2];
                  }
                });
              });
            }),
            (t.buildResidueLabel = function (t, e) {
              if (0 === t.length) return '';
              var n = Array.from(new Set(t)).sort(function (t, e) {
                return t - e;
              });
              if (1 === n.length) return 'Residue ' + (e ? e + ' ' : '') + n[0];
              for (var i = [], r = n[0], o = n[0], s = 1; s < n.length; s++)
                n[s] === o + 1 || (r === o ? i.push('' + r) : i.push(r + ' - ' + o), (r = n[s])), (o = n[s]);
              return r === o ? i.push('' + r) : i.push(r + ' - ' + o), 'Residues ' + i.join(', ');
            }),
            (t.pdbevents = r.CustomEvents.create(['PDB.RNA.viewer.click', 'PDB.RNA.viewer.mouseover', 'PDB.RNA.viewer.mouseout', 'PDB.RNA.viewer.deselect'])),
            (t.tooltipSelectedColor = ''),
            (t.tooltipSelectedWidth = 0),
            (t.fillColor = ''),
            (t.expanded = !1),
            (t.zoomed = !1),
            (t.highlightNucleotide = function (e, n, i, o, s, a, u, l, c) {
              null == u || u.stopImmediatePropagation();
              var h = Array.isArray(o) ? o : [o];
              t.clearHighlight();
              for (var p = 0, d = h; p < d.length; p++) {
                var f = d[p],
                  v = document.querySelector('.rnaview_' + e + '_' + f);
                null == v || v.classList.add('rnaTopo-hover');
              }
              var g = document.getElementById(e + '-rnaTopologyTooltipHighlight');
              g.style.display = 'inline';
              var y = t.buildResidueLabel(h, a);
              if (((g.innerHTML = '<strong>' + (s ? 'Unobserved ' : '') + y + '</strong>'), !s && !c)) {
                var m = { pdbId: e, auth_asym_id: i, label_seq_ids: h, entityId: n },
                  _ = document.querySelector('.rnaTopoSvg_' + e);
                r.CustomEvents.dispatchCustomEvent(t.pdbevents['PDB.RNA.viewer.mouseover'], m, _);
              }
            }),
            (t.unHighlightNucleotide = function (e, n, i, o, s, a, u) {
              if (
                (null == a || a.stopImmediatePropagation(),
                t.clearHighlight(),
                (document.getElementById(e + '-rnaTopologyTooltipHighlight').style.display = 'none'),
                !s && !u)
              ) {
                var l = { pdbId: e, auth_asym_id: i, label_seq_id: o, entityId: n },
                  c = o ? document.querySelector('.rnaview_' + e + '_' + o) : document.querySelector('.rnaTopoSvg_' + e);
                r.CustomEvents.dispatchCustomEvent(t.pdbevents['PDB.RNA.viewer.mouseout'], l, c);
              }
            }),
            (t.toggleNucleotide = function (e, n, r, o, s, a, u, l, c, h, p) {
              return (0, i.__awaiter)(this, void 0, void 0, function () {
                var d, f, v, g, y, m;
                return (0, i.__generator)(this, function (i) {
                  switch (i.label) {
                    case 0:
                      (d = Array.isArray(o) ? o : [o]), (f = 0), (v = d), (i.label = 1);
                    case 1:
                      return f < v.length
                        ? ((g = v[f]),
                          (null == (y = document.querySelector('.rnaview_' + e + '_' + g)) ? void 0 : y.classList.contains('rnaTopo-selected'))
                            ? ((m = 'mouseover' === s ? 'mouseout' : 'click'), [4, t.unSelectNucleotide(e, n, r, g, m, a, l, c)])
                            : [3, 3])
                        : [3, 6];
                    case 2:
                      return i.sent(), [3, 5];
                    case 3:
                      return [4, t.selectNucleotide(e, n, r, g, s, a, u, l, c, h, p)];
                    case 4:
                      i.sent(), (i.label = 5);
                    case 5:
                      return f++, [3, 1];
                    case 6:
                      return [2];
                  }
                });
              });
            }),
            (t.selectNucleotide = function (e, n, o, s, a, u, l, c, h, p, d) {
              return (0, i.__awaiter)(this, void 0, void 0, function () {
                var f, v, g, y, m, _, b, w, S, x, E;
                return (0, i.__generator)(this, function (i) {
                  switch (i.label) {
                    case 0:
                      return (
                        null == c || c.stopImmediatePropagation(),
                        (f = Array.isArray(s) ? s : [s]),
                        (v = f.every(function (t) {
                          var n = document.querySelector('.rnaview_' + e + '_' + t);
                          return null == n ? void 0 : n.classList.contains('rnaTopo-selected');
                        })),
                        v ? ((g = 'mouseover' === a ? 'mouseout' : 'click'), [4, t.unSelectNucleotide(e, n, o, s, g, u, c, h)]) : [3, 2]
                      );
                    case 1:
                      return i.sent(), [2];
                    case 2:
                      for (p || 'click' !== a || (t.clearSelection(e), t.clearHighlight()), y = 0, m = f; y < m.length; y++)
                        (_ = m[y]), null == (b = document.querySelector('.rnaview_' + e + '_' + _)) || b.classList.add('rnaTopo-selected');
                      return 'click' !== a ? [3, 4] : [4, t.zoomToNucleotides(e, f)];
                    case 3:
                      i.sent(), (i.label = 4);
                    case 4:
                      return (
                        ((w = document.getElementById(e + '-rnaTopologyTooltip')).style.display = 'inline'),
                        (S = t.buildResidueLabel(f, l)),
                        (w.innerHTML = '<strong>' + (u ? 'Unobserved ' : '') + 'Selected ' + S + '</strong>'),
                        u ||
                          d ||
                          ((x = { pdbId: e, auth_asym_id: o, label_seq_ids: f, entityId: n }),
                          (E = document.querySelector('.rnaTopoSvg_' + e)),
                          r.CustomEvents.dispatchCustomEvent(t.pdbevents['PDB.RNA.viewer.click'], x, E)),
                        [2]
                      );
                  }
                });
              });
            }),
            t
          );
        })();
        (e.UiActionsService = a), (window.UiActionsService = a);
      },
      102: (t, e, n) => {
        Object.defineProperty(e, '__esModule', { value: !0 }), (e.UiTemplateService = void 0);
        var i = n(621),
          r = (function () {
            function t(t, e, n) {
              (this.locations = new Map()),
                (this.pathStrs = []),
                (this.nucleotideStrs = []),
                (this.bpLabels = []),
                (this.baseStrs = new Map()),
                (this.nestedBaseStrs = new Map()),
                (this.checkboxesExpanded = !1),
                (this.helpIconTooltips = {
                  bpFilterBtnHelp:
                    '\n            Displays checkboxes that list the 12 \n            <a href=\'https://nakb.org/basics/basepairs.html#LW\' target="_blank">Leontis–Westhof</a> \n            base-pairing families. These families classify RNA base pairs by the edges involved \n            (W = Watson–Crick, H = Hoogsteen, S = Sugar) and by the relative orientation of the \n            glycosidic bonds (c = cis orientation, t = trans orientation).  \n            Selecting a checkbox highlights that family of base pairs in the 2D viewer, while \n            <strong>All</strong> shows every family at once.\n        ',
                }),
                (this.containerElement = t),
                (this.pluginOptions = e),
                (this.uiActionsService = new i.UiActionsService(this.pluginOptions.pdbId));
            }
            return (
              (t.prototype.render = function (t, e, n) {
                (this.containerElement.innerHTML =
                  '<div class="pdb-rna-view-container pdb-rna-view-container-' +
                  this.pluginOptions.pdbId +
                  '">\n            ' +
                  this.svgTemplate(t, e, n) +
                  '\n            ' +
                  this.title() +
                  '\n            ' +
                  this.tooltip() +
                  '\n            ' +
                  this.bpListBtnDialog() +
                  '\n            ' +
                  this.actionButtons() +
                  '\n        </div>\n        ' +
                  this.mainMenu() +
                  '\n        '),
                  this.createModeDropdown(),
                  this.createBPDropdown(),
                  this.bindBpListDialog(),
                  this.bindBpFilterBtn(),
                  this.bindHelpIcons(),
                  this.uiActionsService.applyButtonActions();
              }),
              (t.prototype.changeBP = function (t) {
                var e = this;
                (this.displayBaseStrs = ''), (this.displayNestedBaseStrs = '');
                var n = this.containerElement.querySelector('#Checkbox_All').checked;
                'All' == t
                  ? this.baseStrs.forEach(function (t, i) {
                      e.baseStrs.set(i, [n, t[1]]),
                        e.nestedBaseStrs.set(i, [n, e.nestedBaseStrs.get(i)[1]]),
                        (document.getElementById('Checkbox_' + i).checked = n),
                        n && ((e.displayBaseStrs += t[1].join('')), (e.displayNestedBaseStrs += e.nestedBaseStrs.get(i)[1].join('')));
                    })
                  : (this.baseStrs.get(t)[0]
                      ? (this.baseStrs.set(t, [!1, this.baseStrs.get(t)[1]]), this.nestedBaseStrs.set(t, [!1, this.nestedBaseStrs.get(t)[1]]))
                      : (this.baseStrs.set(t, [!0, this.baseStrs.get(t)[1]]), this.nestedBaseStrs.set(t, [!0, this.nestedBaseStrs.get(t)[1]])),
                    this.baseStrs.forEach(function (t, n) {
                      t[0] && ((e.displayBaseStrs += t[1].join('')), (e.displayNestedBaseStrs += e.nestedBaseStrs.get(n)[1].join('')));
                    })),
                  this.pathOrNucleotide();
              }),
              (t.prototype.createBPDropdown = function () {
                var t,
                  e = this;
                if (this.baseStrs.size > 0) {
                  var n = '<table><tr><td><label for = "Checkbox_All"><input type="checkbox" id="Checkbox_All" /> All</label></td>',
                    i = 1;
                  this.baseStrs.forEach(function (t, e) {
                    i % 2 == 0 && (n += '<tr>'),
                      (n =
                        'cWW' == e
                          ? n + '<td><label for = "Checkbox_' + e + '"><input type="checkbox" id="Checkbox_' + e + '" checked = true/> ' + e + '</label></td>'
                          : n + '<td><label for = "Checkbox_' + e + '"><input type="checkbox" id="Checkbox_' + e + '"/> ' + e + '</label></td>'),
                      i % 2 == 1 && (n += '</tr>'),
                      (i += 1);
                  }),
                    (n += '</table>'),
                    (document.getElementById('checkboxes').innerHTML = n),
                    null === (t = document.getElementById('Checkbox_All')) || void 0 === t || t.addEventListener('change', this.changeBP.bind(this, 'All')),
                    this.baseStrs.forEach(function (t, n) {
                      var i;
                      null === (i = document.getElementById('Checkbox_' + n)) || void 0 === i || i.addEventListener('change', e.changeBP.bind(e, n));
                    });
                }
              }),
              (t.prototype.createModeDropdown = function () {
                var t = this.containerElement.querySelector('.menuSelectbox');
                (t.innerHTML = '<option value="0">View as Nucleotides</option><option value="1">View as Path</option></option>'),
                  t.addEventListener('change', this.pathOrNucleotide.bind(this)),
                  this.containerElement.querySelector('#nestedBP').addEventListener('change', this.pathOrNucleotide.bind(this));
              }),
              (t.prototype.bindBpFilterBtn = function () {
                var t,
                  e = this;
                null === (t = document.getElementById('bpFilterBtn')) ||
                  void 0 === t ||
                  t.addEventListener('click', function () {
                    var t, n;
                    null === (t = document.querySelector('.menu-dropdown')) || void 0 === t || t.classList.toggle('show'),
                      null === (n = document.getElementById('bpFilterBtnIcon')) || void 0 === n || n.classList.toggle('active');
                    var i = document.getElementById('checkboxes');
                    e.checkboxesExpanded ? ((i.style.display = 'none'), (e.checkboxesExpanded = !1)) : ((i.style.display = 'block'), (e.checkboxesExpanded = !0));
                  });
              }),
              (t.prototype.bindHelpIcons = function () {
                var t = this;
                Object.keys(this.helpIconTooltips).forEach(function (e) {
                  var n = document.getElementById(e);
                  if (n) {
                    var i = document.createElement('div');
                    (i.className = 'help-tooltip'), (i.innerHTML = t.helpIconTooltips[e]), (i.style.display = 'none'), document.body.appendChild(i);
                    var r = function () {
                      i.style.display = 'none';
                    };
                    n.addEventListener('mouseenter', function () {
                      var t = n.getBoundingClientRect();
                      (i.style.display = 'block'),
                        (i.style.position = 'absolute'),
                        (i.style.left = t.right + 8 + window.scrollX + 'px'),
                        (i.style.top = t.top + window.scrollY + 'px');
                    }),
                      n.addEventListener('mouseleave', function () {
                        setTimeout(function () {
                          i.matches(':hover') || n.matches(':hover') || r();
                        }, 150);
                      }),
                      i.addEventListener('mouseleave', function () {
                        setTimeout(function () {
                          i.matches(':hover') || n.matches(':hover') || r();
                        }, 150);
                      });
                  }
                });
              }),
              (t.prototype.bindBpListDialog = function () {
                var t = this,
                  e = this.containerElement.querySelector('#rnaTopologyBPList-' + this.pluginOptions.pdbId),
                  n = this.containerElement.querySelector('#bpListDialog-' + this.pluginOptions.pdbId),
                  i = this.containerElement.querySelector('#nestedBP');
                e &&
                  n &&
                  i &&
                  e.addEventListener('click', function () {
                    t.renderBpListDialog(!0);
                  });
              }),
              (t.prototype.renderBpListDialog = function (t) {
                var e = this,
                  n = this.containerElement.querySelector('#bpListDialog-' + this.pluginOptions.pdbId),
                  i = this.containerElement.querySelector('#nestedBP');
                if (n && i) {
                  t && (n.style.display = 'none' === n.style.display ? 'block' : 'none'), (n.innerHTML = '');
                  var r = i.checked,
                    o = this.bpLabels.filter(function (t) {
                      return (r ? e.displayNestedBaseStrs : e.displayBaseStrs).includes(t.pathID);
                    }),
                    s = document.createElement('ul');
                  (s.style.maxHeight = '200px'),
                    (s.style.overflowY = 'auto'),
                    (s.style.padding = '8px'),
                    (s.style.listStyle = 'none'),
                    o.forEach(function (t) {
                      var e = t.label,
                        n = t.pathID,
                        i = document.createElement('li');
                      (i.textContent = e),
                        (i.style.cursor = 'pointer'),
                        i.addEventListener('mouseenter', function () {
                          var t = document.querySelector('.' + n.replace(/\s+/g, '.'));
                          null == t || t.dispatchEvent(new Event('mouseover', { bubbles: !0 }));
                          var e = document.getElementById('tooltip');
                          e && (e.style.display = 'none');
                        }),
                        i.addEventListener('mouseleave', function () {
                          var t = document.querySelector('.' + n.replace(/\s+/g, '.'));
                          null == t || t.dispatchEvent(new Event('mouseout', { bubbles: !0 }));
                        }),
                        i.addEventListener('click', function () {
                          var t = document.querySelector('.' + n.replace(/\s+/g, '.'));
                          null == t || t.dispatchEvent(new Event('click', { bubbles: !0 }));
                        }),
                        s.appendChild(i);
                    }),
                    n.appendChild(s);
                }
              }),
              (t.prototype.calculateFontSize = function (t) {
                var e = [],
                  n = [],
                  i = [],
                  r = t.svg_paths.length - 1;
                t.svg_paths.forEach(function (t, o) {
                  if (0 !== o && o !== r) {
                    var s = t.split('M').join(',').split(',');
                    if (((e[o] = (Number(s[1]) + Number(s[3])) / 2), (n[o] = (Number(s[2]) + Number(s[4])) / 2), o > 1)) {
                      var a = e[o] - e[o - 1],
                        u = n[o] - n[o - 1];
                      i[o] = Math.pow(Math.pow(u, 2) + Math.pow(a, 2), 0.5);
                    }
                  }
                });
                var o = i.sort(function (t, e) {
                  return t - e;
                });
                return 0.9 * o[Math.floor(0.05 * o.length)];
              }),
              (t.linearlyInterpolate = function (t, e, n) {
                return (1 - n) * t + n * e;
              }),
              (t.prototype.pathOrNucleotide = function () {
                var t = this.containerElement.querySelector('.menuSelectbox'),
                  e = parseInt(t.value);
                if (this.containerElement.querySelector('#nestedBP').checked) var n = this.displayNestedBaseStrs;
                else n = this.displayBaseStrs;
                0 == e
                  ? (document.querySelector('svg.rnaTopoSvg').getElementsByClassName('rnaTopoSvg_' + this.pluginOptions.pdbId)[0].innerHTML =
                      this.nucleotideStrs.join('') + n)
                  : 1 == e &&
                    (document.querySelector('svg.rnaTopoSvg').getElementsByClassName('rnaTopoSvg_' + this.pluginOptions.pdbId)[0].innerHTML =
                      this.pathStrs.join('') + n),
                  this.renderBpListDialog(!1);
              }),
              (t.prototype.calcBaseStrs = function (e, n, i) {
                var r = +e.seq_id1,
                  o = +e.seq_id2;
                if (e && r && o) {
                  var s = e.bp,
                    a = 'rnaviewBP rnaviewBP_' + this.pluginOptions.pdbId + '_' + this.pluginOptions.chainId + ' ' + s + '_' + r + '_' + o,
                    u = e.nt1,
                    l = e.nt2,
                    c = '' + u + r + ' - ' + l + o + '; ' + s;
                  if (
                    (this.bpLabels.some(function (t) {
                      return t.pathID === a;
                    }) || this.bpLabels.push({ label: c, pathID: a }),
                    'cSH' == s || 'tSH' == s || 'cSW' == s || 'tSW' == s || 'cHW' == s || 'tHW' == s)
                  ) {
                    var h = o;
                    (o = r), (r = h);
                    var p = u;
                    (u = l), (l = p), (s = s.charAt(0) + s.slice(-2).split('').reverse().join(''));
                  }
                  var d = this.locations.get(r)[0] + i / 2.5,
                    f = this.locations.get(o)[0] + i / 2.5,
                    v = this.locations.get(r)[1] - i / 2.5,
                    g = this.locations.get(o)[1] - i / 2.5,
                    y = Math.pow(Math.pow(d - f, 2) + Math.pow(v - g, 2), 0.5),
                    m = t.linearlyInterpolate(d, f, i / y),
                    _ = t.linearlyInterpolate(v, g, i / y),
                    b = t.linearlyInterpolate(d, f, 1 - i / y),
                    w = t.linearlyInterpolate(v, g, 1 - i / y);
                  if ('t' == s.charAt(0)) var S = 'none';
                  else S = '#ccc';
                  var x = (m + b) / 2,
                    E = (_ + w) / 2,
                    I = y - 2 * i,
                    k = i / 1.5,
                    M =
                      '<path class="' +
                      a +
                      '" onmouseover="UiActionsService.showTooltip(\'' +
                      this.pluginOptions.pdbId +
                      "', '" +
                      this.pluginOptions.entityId +
                      "', '" +
                      this.pluginOptions.chainId +
                      "', '" +
                      r +
                      ' - ' +
                      o +
                      "', evt, '" +
                      u +
                      r +
                      ' - ' +
                      l +
                      o +
                      '; ' +
                      s +
                      "', '" +
                      a +
                      "', '#ccc', '" +
                      S +
                      "', '" +
                      i / 6 +
                      '\');" onmouseout="UiActionsService.hideTooltip(\'' +
                      this.pluginOptions.pdbId +
                      "', '" +
                      this.pluginOptions.entityId +
                      "', '" +
                      this.pluginOptions.chainId +
                      "', '" +
                      r +
                      ' - ' +
                      o +
                      "', '" +
                      a +
                      '\');"',
                    A = 270 + (180 * Math.atan2(v - g, d - f)) / Math.PI;
                  if ('cWW' == s)
                    ('G' == u && 'U' == l) || ('U' == u && 'G' == l)
                      ? n
                          .get(s)[1]
                          .push(
                            '<path class="' +
                              a +
                              '" onmouseover="UiActionsService.showTooltip(\'' +
                              this.pluginOptions.pdbId +
                              "', '" +
                              this.pluginOptions.entityId +
                              "', '" +
                              this.pluginOptions.chainId +
                              "', '" +
                              r +
                              ' - ' +
                              o +
                              "', evt, '" +
                              u +
                              r +
                              ' - ' +
                              l +
                              o +
                              '; ' +
                              s +
                              "', '" +
                              a +
                              "', '#000', '#000', '" +
                              i / 6 +
                              '\');"\n                    onmouseout="UiActionsService.hideTooltip(\'' +
                              this.pluginOptions.pdbId +
                              "', '" +
                              this.pluginOptions.entityId +
                              "', '" +
                              this.pluginOptions.chainId +
                              "', '" +
                              r +
                              ' - ' +
                              o +
                              "', '" +
                              a +
                              '\');"\n                    d="\n                    M ' +
                              ((m + b) / 2 - i / 4) +
                              ', ' +
                              (_ + w) / 2 +
                              '\n                    a ' +
                              i / 4 +
                              ',' +
                              i / 4 +
                              ' 0 1,0 ' +
                              i / 2 +
                              ',0\n                    a ' +
                              i / 4 +
                              ',' +
                              i / 4 +
                              ' 0 1,0 ' +
                              (-1 * i) / 2 +
                              ',0\n                    "\n                    stroke="#000" stroke-width="' +
                              i / 6 +
                              ' fill="' +
                              S +
                              '"\n                />'
                          )
                      : n
                          .get(s)[1]
                          .push(
                            '<path class="' +
                              a +
                              '" onmouseover="UiActionsService.showTooltip(\'' +
                              this.pluginOptions.pdbId +
                              "', '" +
                              this.pluginOptions.entityId +
                              "', '" +
                              this.pluginOptions.chainId +
                              "', '" +
                              r +
                              ' - ' +
                              o +
                              "', evt,  '" +
                              u +
                              r +
                              ' - ' +
                              l +
                              o +
                              '; ' +
                              s +
                              "', '" +
                              a +
                              "', '#000', '#000', '" +
                              i / 6 +
                              '\');" onmouseout="UiActionsService.hideTooltip(\'' +
                              this.pluginOptions.pdbId +
                              "', '" +
                              this.pluginOptions.entityId +
                              "', '" +
                              this.pluginOptions.chainId +
                              "', '" +
                              r +
                              ' - ' +
                              o +
                              "', '" +
                              a +
                              '\');" stroke-width="' +
                              i / 6 +
                              '" data-stroke-color="#000" stroke="#000" d="M' +
                              m +
                              ' ' +
                              _ +
                              ' ' +
                              b +
                              ' ' +
                              w +
                              '"></path>'
                          );
                  else if ('tWW' == s) {
                    var T = t.linearlyInterpolate(m, x, 1 - i / 3 / (y / 2)),
                      B = t.linearlyInterpolate(_, E, 1 - i / 3 / (y / 2)),
                      O = t.linearlyInterpolate(x, b, i / 3 / (y / 2)),
                      N = t.linearlyInterpolate(E, w, i / 3 / (y / 2));
                    n.get(s)[1].push(
                      M +
                        'd="\n                    M ' +
                        m +
                        ' ' +
                        _ +
                        ' ' +
                        T +
                        ' ' +
                        B +
                        '\n                    M ' +
                        (x - i / 3) +
                        ' ' +
                        E +
                        '\n                    a ' +
                        i / 3 +
                        ',' +
                        i / 3 +
                        ' 0 1,0 ' +
                        i / 1.5 +
                        ',0\n                    a ' +
                        i / 3 +
                        ',' +
                        i / 3 +
                        ' 0 1,0 ' +
                        (-1 * i) / 1.5 +
                        ',0\n                    M ' +
                        O +
                        ' ' +
                        N +
                        ' ' +
                        b +
                        ' ' +
                        w +
                        '"\n                    stroke="#ccc" stroke-width="' +
                        i / 6 +
                        '" fill = "' +
                        S +
                        '"/>'
                    );
                  } else
                    'cSS' == s || 'tSS' == s
                      ? n
                          .get(s)[1]
                          .push(
                            M +
                              '\n                d="\n                M ' +
                              x +
                              ' ' +
                              (E + I / 2) +
                              ' ' +
                              x +
                              ' ' +
                              (E + k / 2) +
                              ' \n                l ' +
                              k / 2 +
                              ' 0\n                l -' +
                              k / 2 +
                              ' -' +
                              k +
                              ' \n                l -' +
                              k / 2 +
                              ' ' +
                              k +
                              '\n                l ' +
                              k / 2 +
                              ' 0\n                M ' +
                              x +
                              ' ' +
                              (E - k / 2) +
                              ' ' +
                              x +
                              ' ' +
                              (E - I / 2) +
                              '\n                "stroke="#ccc" stroke-width="' +
                              i / 6 +
                              '" fill = "' +
                              S +
                              '" transform = "rotate(' +
                              A +
                              ' ' +
                              x +
                              ' ' +
                              E +
                              ')"/>'
                          )
                      : 'tHS' == s || 'cHS' == s
                        ? n
                            .get(s)[1]
                            .push(
                              M +
                                '\n                d="\n                M ' +
                                x +
                                ' ' +
                                (E + I / 2) +
                                ' ' +
                                x +
                                ' ' +
                                (E + k + k / 4) +
                                ' \n                h -' +
                                k / 2 +
                                '\n                v -' +
                                k +
                                '\n                h ' +
                                k +
                                '\n                v ' +
                                k +
                                '\n                h -' +
                                k / 2 +
                                '\n                M ' +
                                x +
                                ' ' +
                                (E + k / 4) +
                                ' ' +
                                x +
                                ' ' +
                                (E - k / 4) +
                                '\n                l ' +
                                k / 2 +
                                ' 0\n                l -' +
                                k / 2 +
                                ' -' +
                                k +
                                ' \n                l -' +
                                k / 2 +
                                ' ' +
                                k +
                                '\n                l ' +
                                k / 2 +
                                ' 0\n                M ' +
                                x +
                                ' ' +
                                (E - k - k / 4) +
                                ' ' +
                                x +
                                ' ' +
                                (E - I / 2) +
                                '\n                "stroke="#ccc" stroke-width="' +
                                i / 6 +
                                '" fill = "' +
                                S +
                                '" transform = "rotate(' +
                                A +
                                ' ' +
                                x +
                                ' ' +
                                E +
                                ')"/>'
                            )
                        : 'tWS' == s || 'cWS' == s
                          ? n
                              .get(s)[1]
                              .push(
                                M +
                                  '\n                d="\n                M ' +
                                  x +
                                  ' ' +
                                  (E + I / 2) +
                                  ' ' +
                                  x +
                                  ' ' +
                                  (E + k + k / 4) +
                                  ' \n                M ' +
                                  (x - k / 2) +
                                  ' ' +
                                  (E + (3 * k) / 4) +
                                  ' \n                a ' +
                                  k / 2 +
                                  ',' +
                                  k / 2 +
                                  ' 0 1,0 ' +
                                  k +
                                  ',0\n                a ' +
                                  k / 2 +
                                  ',' +
                                  k / 2 +
                                  ' 0 1,0 ' +
                                  -1 * k +
                                  ',0\n                M ' +
                                  x +
                                  ' ' +
                                  (E + k / 4) +
                                  ' ' +
                                  x +
                                  ' ' +
                                  (E - k / 4) +
                                  '\n                l ' +
                                  k / 2 +
                                  ' 0\n                l -' +
                                  k / 2 +
                                  ' -' +
                                  k +
                                  ' \n                l -' +
                                  k / 2 +
                                  ' ' +
                                  k +
                                  '\n                l ' +
                                  k / 2 +
                                  ' 0\n                M ' +
                                  x +
                                  ' ' +
                                  (E - k - k / 4) +
                                  ' ' +
                                  x +
                                  ' ' +
                                  (E - I / 2) +
                                  '\n                "stroke="#ccc" stroke-width="' +
                                  i / 6 +
                                  '" fill = "' +
                                  S +
                                  '" transform = "rotate(' +
                                  A +
                                  ' ' +
                                  x +
                                  ' ' +
                                  E +
                                  ')"/>'
                              )
                          : 'tWH' == s || 'cWH' == s
                            ? n
                                .get(s)[1]
                                .push(
                                  M +
                                    '\n                d="\n                M ' +
                                    x +
                                    ' ' +
                                    (E + I / 2) +
                                    ' ' +
                                    x +
                                    ' ' +
                                    (E + k + k / 4) +
                                    ' \n                M ' +
                                    (x - k / 2) +
                                    ' ' +
                                    (E + (3 * k) / 4) +
                                    ' \n                a ' +
                                    k / 2 +
                                    ',' +
                                    k / 2 +
                                    ' 0 1,0 ' +
                                    k +
                                    ',0\n                a ' +
                                    k / 2 +
                                    ',' +
                                    k / 2 +
                                    ' 0 1,0 ' +
                                    -1 * k +
                                    ',0\n                M ' +
                                    x +
                                    ' ' +
                                    (E + k / 4) +
                                    ' ' +
                                    x +
                                    ' ' +
                                    (E - k / 4) +
                                    '\n                h -' +
                                    k / 2 +
                                    '\n                v -' +
                                    k +
                                    '\n                h ' +
                                    k +
                                    '\n                v ' +
                                    k +
                                    '\n                h -' +
                                    k / 2 +
                                    '\n                M ' +
                                    x +
                                    ' ' +
                                    (E - k - k / 4) +
                                    ' ' +
                                    x +
                                    ' ' +
                                    (E - I / 2) +
                                    '\n                "stroke="#ccc" stroke-width="' +
                                    i / 6 +
                                    '" fill = "' +
                                    S +
                                    '" transform = "rotate(' +
                                    A +
                                    ' ' +
                                    x +
                                    ' ' +
                                    E +
                                    ')"/>'
                                )
                            : ('tHH' != s && 'cHH' != s) ||
                              n
                                .get(s)[1]
                                .push(
                                  M +
                                    '\n                d="\n                M ' +
                                    x +
                                    ' ' +
                                    (E + I / 2) +
                                    ' ' +
                                    x +
                                    ' ' +
                                    (E + k / 2) +
                                    ' \n                h -' +
                                    k / 2 +
                                    '\n                v -' +
                                    k +
                                    '\n                h ' +
                                    k +
                                    '\n                v ' +
                                    k +
                                    '\n                h -' +
                                    k / 2 +
                                    '\n                M ' +
                                    x +
                                    ' ' +
                                    (E - k / 2) +
                                    ' ' +
                                    x +
                                    ' ' +
                                    (E - I / 2) +
                                    '\n                "stroke="#ccc" stroke-width="' +
                                    i / 6 +
                                    '" fill = "' +
                                    S +
                                    '" transform = "rotate(' +
                                    A +
                                    ' ' +
                                    x +
                                    ' ' +
                                    E +
                                    ')"/>'
                                );
                }
              }),
              (t.prototype.svgTemplate = function (t, e, n) {
                var i = this,
                  r = this.calculateFontSize(t),
                  o = t.svg_paths.length - 1,
                  s = new Map();
                t.svg_paths.forEach(function (e, n) {
                  if (0 !== n && 1 !== n && n !== o + 1) {
                    var r = e.split('M').join(',').split(','),
                      a = Number(r[1]),
                      u = Number(r[2]),
                      l = Number(r[3]),
                      c = Number(r[4]),
                      h = (l + a) / 2,
                      p = (c + u) / 2;
                    s.set(t.label_seq_ids[n - 1], [h, p]), i.locations.set(t.label_seq_ids[n - 1], [l, c]);
                  }
                }),
                  t.svg_paths.forEach(function (e, n) {
                    var a, u, l, c, h, p, d;
                    if (0 !== n && 1 !== n && n !== o + 1) {
                      var f = 'rnaviewEle rnaviewEle_' + i.pluginOptions.pdbId + ' rnaview_' + i.pluginOptions.pdbId + '_' + t.label_seq_ids[n - 1],
                        v = (null === (a = i.pluginOptions.theme) || void 0 === a ? void 0 : a.color) || '#323232',
                        g = (null === (u = i.pluginOptions.theme) || void 0 === u ? void 0 : u.strokeWidth) || '2',
                        y = !1;
                      t.unobserved_label_seq_ids &&
                        t.unobserved_label_seq_ids.indexOf(t.label_seq_ids[n - 1]) > -1 &&
                        ((v = (null === (l = i.pluginOptions.theme) || void 0 === l ? void 0 : l.unobservedColor) || '#ccc'), (y = !0));
                      var m,
                        _ = e.split('M').join(',').split(','),
                        b = Number(_[3]),
                        w = Number(_[4]),
                        S = r / 2,
                        x = r / 2;
                      if (n < o) {
                        var E = s.get(t.label_seq_ids[n - 1])[0],
                          I = s.get(t.label_seq_ids[n])[0];
                        m = 'M' + (E + S) + ',' + ((k = s.get(t.label_seq_ids[n - 1])[1]) - x) + ',' + (I + S) + ',' + (s.get(t.label_seq_ids[n])[1] - x);
                      } else {
                        var k;
                        m =
                          'M' +
                          ((E = s.get(t.label_seq_ids[n - 1])[0]) + S) +
                          ',' +
                          ((k = s.get(t.label_seq_ids[n - 1])[1]) - x) +
                          ',' +
                          ((I = 2 * b - E) + S) +
                          ',' +
                          (2 * w - k - x);
                      }
                      (e = m),
                        i.pathStrs.push(
                          '<path \n                    class="' +
                            f +
                            '" style="cursor: pointer;" stroke-width="' +
                            g +
                            '" stroke="' +
                            v +
                            '" d="' +
                            e +
                            '" \n                    data-stroke-color="' +
                            v +
                            '" \n                    onclick="UiActionsService.toggleNucleotide(\'' +
                            i.pluginOptions.pdbId +
                            "', '" +
                            i.pluginOptions.entityId +
                            "', '" +
                            i.pluginOptions.chainId +
                            "', " +
                            t.label_seq_ids[n - 1] +
                            ", 'click', " +
                            y +
                            ", '" +
                            t.sequence[n - 2] +
                            "', event, " +
                            ((null === (c = i.pluginOptions.theme) || void 0 === c ? void 0 : c.highlightColor)
                              ? "'" + i.pluginOptions.theme.highlightColor + "'"
                              : void 0) +
                            ')" \n                    onmouseover="UiActionsService.highlightNucleotide(\'' +
                            i.pluginOptions.pdbId +
                            "', '" +
                            i.pluginOptions.entityId +
                            "', '" +
                            i.pluginOptions.chainId +
                            "', " +
                            t.label_seq_ids[n - 1] +
                            ', ' +
                            y +
                            ", '" +
                            t.sequence[n - 2] +
                            "', event, " +
                            ((null === (h = i.pluginOptions.theme) || void 0 === h ? void 0 : h.highlightColor)
                              ? "'" + i.pluginOptions.theme.highlightColor + "'"
                              : void 0) +
                            ')" \n                    onmouseout="UiActionsService.unHighlightNucleotide(\'' +
                            i.pluginOptions.pdbId +
                            "', '" +
                            i.pluginOptions.entityId +
                            "', '" +
                            i.pluginOptions.chainId +
                            "', " +
                            t.label_seq_ids[n - 1] +
                            ', ' +
                            y +
                            ', event)">\n                </path>'
                        ),
                        i.nucleotideStrs.push(
                          '<text\n                    href="#' +
                            f +
                            '" class="' +
                            f +
                            '" style="cursor: pointer;" x="' +
                            b +
                            '" y="' +
                            w +
                            '" font-size = "' +
                            r +
                            'px"\n                    onclick="UiActionsService.toggleNucleotide(\'' +
                            i.pluginOptions.pdbId +
                            "', '" +
                            i.pluginOptions.entityId +
                            "', '" +
                            i.pluginOptions.chainId +
                            "', " +
                            t.label_seq_ids[n - 1] +
                            ", 'click', " +
                            y +
                            ", '" +
                            t.sequence[n - 2] +
                            "', event, " +
                            ((null === (p = i.pluginOptions.theme) || void 0 === p ? void 0 : p.highlightColor)
                              ? "'" + i.pluginOptions.theme.highlightColor + "'"
                              : void 0) +
                            ')" \n                    onmouseover="UiActionsService.highlightNucleotide(\'' +
                            i.pluginOptions.pdbId +
                            "', '" +
                            i.pluginOptions.entityId +
                            "', '" +
                            i.pluginOptions.chainId +
                            "', " +
                            t.label_seq_ids[n - 1] +
                            ', ' +
                            y +
                            ", '" +
                            t.sequence[n - 2] +
                            "', event, " +
                            ((null === (d = i.pluginOptions.theme) || void 0 === d ? void 0 : d.highlightColor)
                              ? "'" + i.pluginOptions.theme.highlightColor + "'"
                              : void 0) +
                            ')" \n                    onmouseout="UiActionsService.unHighlightNucleotide(\'' +
                            i.pluginOptions.pdbId +
                            "', '" +
                            i.pluginOptions.entityId +
                            "', '" +
                            i.pluginOptions.chainId +
                            "', " +
                            t.label_seq_ids[n - 1] +
                            ', ' +
                            y +
                            ', event)">\n                 ' +
                            t.sequence[n - 2] +
                            '\n                </text>'
                        );
                    }
                  });
                var a = e.annotations,
                  u = n.annotations;
                return (
                  this.baseStrs.set('cWW', [!0, []]),
                  this.baseStrs.set('tWW', [!1, []]),
                  this.baseStrs.set('cWH', [!1, []]),
                  this.baseStrs.set('tWH', [!1, []]),
                  this.baseStrs.set('cWS', [!1, []]),
                  this.baseStrs.set('tWS', [!1, []]),
                  this.baseStrs.set('cHH', [!1, []]),
                  this.baseStrs.set('tHH', [!1, []]),
                  this.baseStrs.set('cHS', [!1, []]),
                  this.baseStrs.set('tHS', [!1, []]),
                  this.baseStrs.set('cSS', [!1, []]),
                  this.baseStrs.set('tSS', [!1, []]),
                  this.nestedBaseStrs.set('cWW', [!0, []]),
                  this.nestedBaseStrs.set('tWW', [!1, []]),
                  this.nestedBaseStrs.set('cWH', [!1, []]),
                  this.nestedBaseStrs.set('tWH', [!1, []]),
                  this.nestedBaseStrs.set('cWS', [!1, []]),
                  this.nestedBaseStrs.set('tWS', [!1, []]),
                  this.nestedBaseStrs.set('cHH', [!1, []]),
                  this.nestedBaseStrs.set('tHH', [!1, []]),
                  this.nestedBaseStrs.set('cHS', [!1, []]),
                  this.nestedBaseStrs.set('tHS', [!1, []]),
                  this.nestedBaseStrs.set('cSS', [!1, []]),
                  this.nestedBaseStrs.set('tSS', [!1, []]),
                  (this.bpLabels = []),
                  u.forEach(function (t) {
                    i.calcBaseStrs(t, i.nestedBaseStrs, r);
                  }),
                  a.forEach(function (t) {
                    i.calcBaseStrs(t, i.baseStrs, r);
                  }),
                  this.baseStrs.forEach(function (t, e) {
                    t[0] && (i.displayBaseStrs += t[1].join('')), i.nestedBaseStrs.get(e)[0] && (i.displayNestedBaseStrs += i.nestedBaseStrs.get(e)[1].join(''));
                  }),
                  '\n        <div style="width:100%;height:100%;z-index:0;position:absolute;">\n            <svg preserveAspectRatio="xMidYMid meet" \n            viewBox="0 0 ' +
                    t.dimensions.width +
                    ' ' +
                    t.dimensions.height +
                    '" \n            style="width:100%;height:100%;position:relative;">\n                <g class="rnaTopoSvgSelection rnaTopoSvgSelection_' +
                    this.pluginOptions.pdbId +
                    '"></g>\n            </svg>\n        </div>\n        <div style="width:100%;height:100%;z-index:1;position:absolute;">\n            <svg preserveAspectRatio="xMidYMid meet"\n            viewBox="0 0 ' +
                    t.dimensions.width +
                    ' ' +
                    t.dimensions.height +
                    '" \n            style="width:100%;height:100%;position:relative;">\n                <g class="rnaTopoSvgHighlight rnaTopoSvgHighlight_' +
                    this.pluginOptions.pdbId +
                    '"></g>\n            </svg>\n        </div>\n        <div id="tooltip" display="none" style="position:absolute; display: none;"></div> \n            <div style="width:100%;height:100%;z-index:2;position:absolute;">\n                <svg class="rnaTopoSvg" preserveAspectRatio="xMidYMid meet"\n                    viewBox="0 0 ' +
                    t.dimensions.width +
                    ' ' +
                    t.dimensions.height +
                    '" \n                    style="width:100%;height:100%">\n                        <g class="rnaTopoSvg_' +
                    this.pluginOptions.pdbId +
                    '">' +
                    this.nucleotideStrs.join('') +
                    this.displayBaseStrs +
                    '</g>\n                </svg>\n            </div>'
                );
              }),
              (t.prototype.title = function () {
                return '<span class="pdb-rna-view-title">' + this.pluginOptions.pdbId.toUpperCase() + ' Chain ' + this.pluginOptions.chainId + '</span>';
              }),
              (t.prototype.tooltip = function () {
                return (
                  '<span class="pdb-rna-view-tooltip" id="' +
                  this.pluginOptions.pdbId +
                  '-rnaTopologyTooltip"></span>\n        <span class="pdb-rna-view-tooltip-highlight" id="' +
                  this.pluginOptions.pdbId +
                  '-rnaTopologyTooltipHighlight"></span>'
                );
              }),
              (t.prototype.actionButtons = function () {
                return (
                  '<div class="pdb-rna-view-btn-group">\n            <span class="pdb-rna-view-btn" title="Zoom-in" id="rnaTopologyZoomIn-' +
                  this.pluginOptions.pdbId +
                  '">\n                <svg style="width:24px;height:24px" viewBox="0 0 24 24">\n                    <path fill="currentColor" d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z" />\n                </svg>\n            </span>\n            \n            <span class="pdb-rna-view-btn" title="Zoom-out" id="rnaTopologyZoomOut-' +
                  this.pluginOptions.pdbId +
                  '">\n                <svg style="width:24px;height:24px" viewBox="0 0 24 24">\n                    <path fill="currentColor" d="M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z" />\n                </svg>\n            </span>\n\n            <span class="pdb-rna-view-btn" title="Reset" id="rnaTopologyReset-' +
                  this.pluginOptions.pdbId +
                  '">\n                <svg style="width:24px;height:24px" viewBox="0 0 24 24">\n                    <path fill="currentColor" d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z" />\n                </svg>\n            </span>\n        </div>'
                );
              }),
              (t.prototype.bpListBtnDialog = function () {
                return (
                  '\n        <div class="pdb-rna-view-btn-group left">\n            <button type="button" class="bp-list-btn" id="rnaTopologyBPList-' +
                  this.pluginOptions.pdbId +
                  '">Base Pairings (BPs) List</button>\n        </div>\n        <div id="bpListDialog-' +
                  this.pluginOptions.pdbId +
                  '" class="bp-list-dialog" style="display:none"></div>\n        '
                );
              }),
              (t.prototype.mainMenu = function () {
                return (
                  '\n        <div id="mainMenu">\n            <div class="menuOptions">\n            <form>\n                <select class="menuSelectbox">\n                <option value="">Nucleotides</option>\n                </select>\n\n                <div class="menu-dropdown">\n                <button type="button" id="bpFilterBtn">' +
                  this.helpIconSvg('bpFilterBtnHelp') +
                  ' Filter BPs <span id="bpFilterBtnIcon">▾</span></button>\n                <div id="checkboxes" class="menu-dropdown-content"></div>\n                </div>\n\n                <div class="menu-nested">\n                    <input type="checkbox" id="nestedBP" name="nestedBP" />\n                    <label for="nestedBP"><span>Only nested BPs</span></label>\n                </div>\n            </form>\n            </div>\n        </div>'
                );
              }),
              (t.prototype.helpIconSvg = function (t) {
                return (
                  '<svg class="help-icon" id="' +
                  t +
                  '" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">\n            <g id="help_outline_24px">\n            <path id="ic_help_outline_24px" fill-rule="evenodd" clip-rule="evenodd" d="M1.5 9C1.5 4.86 4.86 1.5 9 1.5C13.14 1.5 16.5 4.86 16.5 9C16.5 13.14 13.14 16.5 9 16.5C4.86 16.5 1.5 13.14 1.5 9ZM9.75 12V13.5H8.25V12H9.75ZM9 15C5.6925 15 3 12.3075 3 9C3 5.6925 5.6925 3 9 3C12.3075 3 15 5.6925 15 9C15 12.3075 12.3075 15 9 15ZM6 7.5C6 5.8425 7.3425 4.5 9 4.5C10.6575 4.5 12 5.8425 12 7.5C12 8.46219 11.4075 8.97999 10.8306 9.48415C10.2833 9.96245 9.75 10.4285 9.75 11.25H8.25C8.25 9.88404 8.95659 9.34244 9.57783 8.86626C10.0652 8.49271 10.5 8.15941 10.5 7.5C10.5 6.675 9.825 6 9 6C8.175 6 7.5 6.675 7.5 7.5H6Z" fill="#1A1C1A"/>\n            </g>\n        </svg>'
                );
              }),
              (t.prototype.renderError = function (t) {
                var e = '<div class="pdb-rna-view-error">Error! Something went wrong!</div>';
                'apiError' === t &&
                  (e =
                    '<div class="pdb-rna-view-error">\n                RNA topology data for ' +
                    this.pluginOptions.pdbId.toUpperCase() +
                    ' | ' +
                    this.pluginOptions.entityId +
                    ' | ' +
                    this.pluginOptions.chainId.toUpperCase() +
                    ' is not available!\n            </div>'),
                  (this.containerElement.innerHTML = '<div class="pdb-rna-view-container">' + e + '</div>');
              }),
              t
            );
          })();
        e.UiTemplateService = r;
      },
      626: (t, e, n) => {
        n.d(e, { Z: () => l });
        var i = { value: () => {} };
        function r() {
          for (var t, e = 0, n = arguments.length, i = {}; e < n; ++e) {
            if (!(t = arguments[e] + '') || t in i || /[\s.]/.test(t)) throw new Error('illegal type: ' + t);
            i[t] = [];
          }
          return new o(i);
        }
        function o(t) {
          this._ = t;
        }
        function s(t, e) {
          return t
            .trim()
            .split(/^|\s+/)
            .map(function (t) {
              var n = '',
                i = t.indexOf('.');
              if ((i >= 0 && ((n = t.slice(i + 1)), (t = t.slice(0, i))), t && !e.hasOwnProperty(t))) throw new Error('unknown type: ' + t);
              return { type: t, name: n };
            });
        }
        function a(t, e) {
          for (var n, i = 0, r = t.length; i < r; ++i) if ((n = t[i]).name === e) return n.value;
        }
        function u(t, e, n) {
          for (var r = 0, o = t.length; r < o; ++r)
            if (t[r].name === e) {
              (t[r] = i), (t = t.slice(0, r).concat(t.slice(r + 1)));
              break;
            }
          return null != n && t.push({ name: e, value: n }), t;
        }
        o.prototype = r.prototype = {
          constructor: o,
          on: function (t, e) {
            var n,
              i = this._,
              r = s(t + '', i),
              o = -1,
              l = r.length;
            if (!(arguments.length < 2)) {
              if (null != e && 'function' != typeof e) throw new Error('invalid callback: ' + e);
              for (; ++o < l; )
                if ((n = (t = r[o]).type)) i[n] = u(i[n], t.name, e);
                else if (null == e) for (n in i) i[n] = u(i[n], t.name, null);
              return this;
            }
            for (; ++o < l; ) if ((n = (t = r[o]).type) && (n = a(i[n], t.name))) return n;
          },
          copy: function () {
            var t = {},
              e = this._;
            for (var n in e) t[n] = e[n].slice();
            return new o(t);
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
        const l = r;
      },
      313: (t, e, n) => {
        function i(t) {
          return 'object' == typeof t && 'length' in t ? t : Array.from(t);
        }
        n.d(e, { Z: () => i });
      },
      789: (t, e, n) => {
        n.d(e, { Z: () => a });
        var i = n(888),
          r = n(986);
        function o(t) {
          return function () {
            var e = this.ownerDocument,
              n = this.namespaceURI;
            return n === r.P && e.documentElement.namespaceURI === r.P ? e.createElement(t) : e.createElementNS(n, t);
          };
        }
        function s(t) {
          return function () {
            return this.ownerDocument.createElementNS(t.space, t.local);
          };
        }
        function a(t) {
          var e = (0, i.Z)(t);
          return (e.local ? s : o)(e);
        }
      },
      811: (t, e, n) => {
        n.r(e),
          n.d(e, {
            create: () => o,
            creator: () => i.Z,
            local: () => a,
            matcher: () => l.Z,
            namespace: () => c.Z,
            namespaces: () => h.Z,
            pointer: () => p.Z,
            pointers: () => f,
            select: () => r.Z,
            selectAll: () => y,
            selection: () => g.ZP,
            selector: () => m.Z,
            selectorAll: () => _.Z,
            style: () => b.S,
            window: () => w.Z,
          });
        var i = n(789),
          r = n(17);
        function o(t) {
          return (0, r.Z)((0, i.Z)(t).call(document.documentElement));
        }
        var s = 0;
        function a() {
          return new u();
        }
        function u() {
          this._ = '@' + (++s).toString(36);
        }
        u.prototype = a.prototype = {
          constructor: u,
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
        var l = n(83),
          c = n(888),
          h = n(986),
          p = n(172),
          d = n(553);
        function f(t, e) {
          return t.target && ((t = (0, d.Z)(t)), void 0 === e && (e = t.currentTarget), (t = t.touches || [t])), Array.from(t, (t) => (0, p.Z)(t, e));
        }
        var v = n(313),
          g = n(434);
        function y(t) {
          return 'string' == typeof t ? new g.Y1([document.querySelectorAll(t)], [document.documentElement]) : new g.Y1([null == t ? [] : (0, v.Z)(t)], g.Jz);
        }
        var m = n(634),
          _ = n(545),
          b = n(339),
          w = n(21);
      },
      83: (t, e, n) => {
        function i(t) {
          return function () {
            return this.matches(t);
          };
        }
        function r(t) {
          return function (e) {
            return e.matches(t);
          };
        }
        n.d(e, { Z: () => i, P: () => r });
      },
      888: (t, e, n) => {
        n.d(e, { Z: () => r });
        var i = n(986);
        function r(t) {
          var e = (t += ''),
            n = e.indexOf(':');
          return n >= 0 && 'xmlns' !== (e = t.slice(0, n)) && (t = t.slice(n + 1)), i.Z.hasOwnProperty(e) ? { space: i.Z[e], local: t } : t;
        }
      },
      986: (t, e, n) => {
        n.d(e, { P: () => i, Z: () => r });
        var i = 'http://www.w3.org/1999/xhtml';
        const r = {
          svg: 'http://www.w3.org/2000/svg',
          xhtml: i,
          xlink: 'http://www.w3.org/1999/xlink',
          xml: 'http://www.w3.org/XML/1998/namespace',
          xmlns: 'http://www.w3.org/2000/xmlns/',
        };
      },
      172: (t, e, n) => {
        n.d(e, { Z: () => r });
        var i = n(553);
        function r(t, e) {
          if (((t = (0, i.Z)(t)), void 0 === e && (e = t.currentTarget), e)) {
            var n = e.ownerSVGElement || e;
            if (n.createSVGPoint) {
              var r = n.createSVGPoint();
              return (r.x = t.clientX), (r.y = t.clientY), [(r = r.matrixTransform(e.getScreenCTM().inverse())).x, r.y];
            }
            if (e.getBoundingClientRect) {
              var o = e.getBoundingClientRect();
              return [t.clientX - o.left - e.clientLeft, t.clientY - o.top - e.clientTop];
            }
          }
          return [t.pageX, t.pageY];
        }
      },
      17: (t, e, n) => {
        n.d(e, { Z: () => r });
        var i = n(434);
        function r(t) {
          return 'string' == typeof t ? new i.Y1([[document.querySelector(t)]], [document.documentElement]) : new i.Y1([[t]], i.Jz);
        }
      },
      434: (t, e, n) => {
        n.d(e, { Y1: () => rt, ZP: () => st, Jz: () => it });
        var i = n(634),
          r = n(313),
          o = n(545),
          s = n(83),
          a = Array.prototype.find;
        function u() {
          return this.firstElementChild;
        }
        var l = Array.prototype.filter;
        function c() {
          return this.children;
        }
        function h(t) {
          return new Array(t.length);
        }
        function p(t, e) {
          (this.ownerDocument = t.ownerDocument), (this.namespaceURI = t.namespaceURI), (this._next = null), (this._parent = t), (this.__data__ = e);
        }
        function d(t) {
          return function () {
            return t;
          };
        }
        function f(t, e, n, i, r, o) {
          for (var s, a = 0, u = e.length, l = o.length; a < l; ++a) (s = e[a]) ? ((s.__data__ = o[a]), (i[a] = s)) : (n[a] = new p(t, o[a]));
          for (; a < u; ++a) (s = e[a]) && (r[a] = s);
        }
        function v(t, e, n, i, r, o, s) {
          var a,
            u,
            l,
            c = new Map(),
            h = e.length,
            d = o.length,
            f = new Array(h);
          for (a = 0; a < h; ++a) (u = e[a]) && ((f[a] = l = s.call(u, u.__data__, a, e) + ''), c.has(l) ? (r[a] = u) : c.set(l, u));
          for (a = 0; a < d; ++a) (l = s.call(t, o[a], a, o) + ''), (u = c.get(l)) ? ((i[a] = u), (u.__data__ = o[a]), c.delete(l)) : (n[a] = new p(t, o[a]));
          for (a = 0; a < h; ++a) (u = e[a]) && c.get(f[a]) === u && (r[a] = u);
        }
        function g(t) {
          return t.__data__;
        }
        function y(t, e) {
          return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
        }
        p.prototype = {
          constructor: p,
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
        };
        var m = n(888);
        function _(t) {
          return function () {
            this.removeAttribute(t);
          };
        }
        function b(t) {
          return function () {
            this.removeAttributeNS(t.space, t.local);
          };
        }
        function w(t, e) {
          return function () {
            this.setAttribute(t, e);
          };
        }
        function S(t, e) {
          return function () {
            this.setAttributeNS(t.space, t.local, e);
          };
        }
        function x(t, e) {
          return function () {
            var n = e.apply(this, arguments);
            null == n ? this.removeAttribute(t) : this.setAttribute(t, n);
          };
        }
        function E(t, e) {
          return function () {
            var n = e.apply(this, arguments);
            null == n ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
          };
        }
        var I = n(339);
        function k(t) {
          return function () {
            delete this[t];
          };
        }
        function M(t, e) {
          return function () {
            this[t] = e;
          };
        }
        function A(t, e) {
          return function () {
            var n = e.apply(this, arguments);
            null == n ? delete this[t] : (this[t] = n);
          };
        }
        function T(t) {
          return t.trim().split(/^|\s+/);
        }
        function B(t) {
          return t.classList || new O(t);
        }
        function O(t) {
          (this._node = t), (this._names = T(t.getAttribute('class') || ''));
        }
        function N(t, e) {
          for (var n = B(t), i = -1, r = e.length; ++i < r; ) n.add(e[i]);
        }
        function C(t, e) {
          for (var n = B(t), i = -1, r = e.length; ++i < r; ) n.remove(e[i]);
        }
        function P(t) {
          return function () {
            N(this, t);
          };
        }
        function q(t) {
          return function () {
            C(this, t);
          };
        }
        function D(t, e) {
          return function () {
            (e.apply(this, arguments) ? N : C)(this, t);
          };
        }
        function H() {
          this.textContent = '';
        }
        function L(t) {
          return function () {
            this.textContent = t;
          };
        }
        function z(t) {
          return function () {
            var e = t.apply(this, arguments);
            this.textContent = null == e ? '' : e;
          };
        }
        function Z() {
          this.innerHTML = '';
        }
        function R(t) {
          return function () {
            this.innerHTML = t;
          };
        }
        function j(t) {
          return function () {
            var e = t.apply(this, arguments);
            this.innerHTML = null == e ? '' : e;
          };
        }
        function U() {
          this.nextSibling && this.parentNode.appendChild(this);
        }
        function W() {
          this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
        }
        O.prototype = {
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
        };
        var V = n(789);
        function Y() {
          return null;
        }
        function F() {
          var t = this.parentNode;
          t && t.removeChild(this);
        }
        function X() {
          var t = this.cloneNode(!1),
            e = this.parentNode;
          return e ? e.insertBefore(t, this.nextSibling) : t;
        }
        function G() {
          var t = this.cloneNode(!0),
            e = this.parentNode;
          return e ? e.insertBefore(t, this.nextSibling) : t;
        }
        function $(t) {
          return t
            .trim()
            .split(/^|\s+/)
            .map(function (t) {
              var e = '',
                n = t.indexOf('.');
              return n >= 0 && ((e = t.slice(n + 1)), (t = t.slice(0, n))), { type: t, name: e };
            });
        }
        function K(t) {
          return function () {
            var e = this.__on;
            if (e) {
              for (var n, i = 0, r = -1, o = e.length; i < o; ++i)
                (n = e[i]), (t.type && n.type !== t.type) || n.name !== t.name ? (e[++r] = n) : this.removeEventListener(n.type, n.listener, n.options);
              ++r ? (e.length = r) : delete this.__on;
            }
          };
        }
        function J(t, e, n) {
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
                  return (
                    this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, (i.listener = o), (i.options = n)), void (i.value = e)
                  );
            this.addEventListener(t.type, o, n), (i = { type: t.type, name: t.name, value: e, listener: o, options: n }), r ? r.push(i) : (this.__on = [i]);
          };
        }
        var Q = n(21);
        function tt(t, e, n) {
          var i = (0, Q.Z)(t),
            r = i.CustomEvent;
          'function' == typeof r
            ? (r = new r(e, n))
            : ((r = i.document.createEvent('Event')), n ? (r.initEvent(e, n.bubbles, n.cancelable), (r.detail = n.detail)) : r.initEvent(e, !1, !1)),
            t.dispatchEvent(r);
        }
        function et(t, e) {
          return function () {
            return tt(this, t, e);
          };
        }
        function nt(t, e) {
          return function () {
            return tt(this, t, e.apply(this, arguments));
          };
        }
        var it = [null];
        function rt(t, e) {
          (this._groups = t), (this._parents = e);
        }
        function ot() {
          return new rt([[document.documentElement]], it);
        }
        rt.prototype = ot.prototype = {
          constructor: rt,
          select: function (t) {
            'function' != typeof t && (t = (0, i.Z)(t));
            for (var e = this._groups, n = e.length, r = new Array(n), o = 0; o < n; ++o)
              for (var s, a, u = e[o], l = u.length, c = (r[o] = new Array(l)), h = 0; h < l; ++h)
                (s = u[h]) && (a = t.call(s, s.__data__, h, u)) && ('__data__' in s && (a.__data__ = s.__data__), (c[h] = a));
            return new rt(r, this._parents);
          },
          selectAll: function (t) {
            t =
              'function' == typeof t
                ? (function (t) {
                    return function () {
                      var e = t.apply(this, arguments);
                      return null == e ? [] : (0, r.Z)(e);
                    };
                  })(t)
                : (0, o.Z)(t);
            for (var e = this._groups, n = e.length, i = [], s = [], a = 0; a < n; ++a)
              for (var u, l = e[a], c = l.length, h = 0; h < c; ++h) (u = l[h]) && (i.push(t.call(u, u.__data__, h, l)), s.push(u));
            return new rt(i, s);
          },
          selectChild: function (t) {
            return this.select(
              null == t
                ? u
                : (function (t) {
                    return function () {
                      return a.call(this.children, t);
                    };
                  })('function' == typeof t ? t : (0, s.P)(t))
            );
          },
          selectChildren: function (t) {
            return this.selectAll(
              null == t
                ? c
                : (function (t) {
                    return function () {
                      return l.call(this.children, t);
                    };
                  })('function' == typeof t ? t : (0, s.P)(t))
            );
          },
          filter: function (t) {
            'function' != typeof t && (t = (0, s.Z)(t));
            for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
              for (var o, a = e[r], u = a.length, l = (i[r] = []), c = 0; c < u; ++c) (o = a[c]) && t.call(o, o.__data__, c, a) && l.push(o);
            return new rt(i, this._parents);
          },
          data: function (t, e) {
            if (!arguments.length) return Array.from(this, g);
            var n = e ? v : f,
              i = this._parents,
              o = this._groups;
            'function' != typeof t && (t = d(t));
            for (var s = o.length, a = new Array(s), u = new Array(s), l = new Array(s), c = 0; c < s; ++c) {
              var h = i[c],
                p = o[c],
                y = p.length,
                m = (0, r.Z)(t.call(h, h && h.__data__, c, i)),
                _ = m.length,
                b = (u[c] = new Array(_)),
                w = (a[c] = new Array(_)),
                S = (l[c] = new Array(y));
              n(h, p, b, w, S, m, e);
              for (var x, E, I = 0, k = 0; I < _; ++I)
                if ((x = b[I])) {
                  for (I >= k && (k = I + 1); !(E = w[k]) && ++k < _; );
                  x._next = E || null;
                }
            }
            return ((a = new rt(a, i))._enter = u), (a._exit = l), a;
          },
          enter: function () {
            return new rt(this._enter || this._groups.map(h), this._parents);
          },
          exit: function () {
            return new rt(this._exit || this._groups.map(h), this._parents);
          },
          join: function (t, e, n) {
            var i = this.enter(),
              r = this,
              o = this.exit();
            return (i = 'function' == typeof t ? t(i) : i.append(t + '')), null != e && (r = e(r)), null == n ? o.remove() : n(o), i && r ? i.merge(r).order() : r;
          },
          merge: function (t) {
            if (!(t instanceof rt)) throw new Error('invalid merge');
            for (var e = this._groups, n = t._groups, i = e.length, r = n.length, o = Math.min(i, r), s = new Array(i), a = 0; a < o; ++a)
              for (var u, l = e[a], c = n[a], h = l.length, p = (s[a] = new Array(h)), d = 0; d < h; ++d) (u = l[d] || c[d]) && (p[d] = u);
            for (; a < i; ++a) s[a] = e[a];
            return new rt(s, this._parents);
          },
          selection: function () {
            return this;
          },
          order: function () {
            for (var t = this._groups, e = -1, n = t.length; ++e < n; )
              for (var i, r = t[e], o = r.length - 1, s = r[o]; --o >= 0; )
                (i = r[o]) && (s && 4 ^ i.compareDocumentPosition(s) && s.parentNode.insertBefore(i, s), (s = i));
            return this;
          },
          sort: function (t) {
            function e(e, n) {
              return e && n ? t(e.__data__, n.__data__) : !e - !n;
            }
            t || (t = y);
            for (var n = this._groups, i = n.length, r = new Array(i), o = 0; o < i; ++o) {
              for (var s, a = n[o], u = a.length, l = (r[o] = new Array(u)), c = 0; c < u; ++c) (s = a[c]) && (l[c] = s);
              l.sort(e);
            }
            return new rt(r, this._parents).order();
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
            for (var e = this._groups, n = 0, i = e.length; n < i; ++n)
              for (var r, o = e[n], s = 0, a = o.length; s < a; ++s) (r = o[s]) && t.call(r, r.__data__, s, o);
            return this;
          },
          attr: function (t, e) {
            var n = (0, m.Z)(t);
            if (arguments.length < 2) {
              var i = this.node();
              return n.local ? i.getAttributeNS(n.space, n.local) : i.getAttribute(n);
            }
            return this.each((null == e ? (n.local ? b : _) : 'function' == typeof e ? (n.local ? E : x) : n.local ? S : w)(n, e));
          },
          style: I.Z,
          property: function (t, e) {
            return arguments.length > 1 ? this.each((null == e ? k : 'function' == typeof e ? A : M)(t, e)) : this.node()[t];
          },
          classed: function (t, e) {
            var n = T(t + '');
            if (arguments.length < 2) {
              for (var i = B(this.node()), r = -1, o = n.length; ++r < o; ) if (!i.contains(n[r])) return !1;
              return !0;
            }
            return this.each(('function' == typeof e ? D : e ? P : q)(n, e));
          },
          text: function (t) {
            return arguments.length ? this.each(null == t ? H : ('function' == typeof t ? z : L)(t)) : this.node().textContent;
          },
          html: function (t) {
            return arguments.length ? this.each(null == t ? Z : ('function' == typeof t ? j : R)(t)) : this.node().innerHTML;
          },
          raise: function () {
            return this.each(U);
          },
          lower: function () {
            return this.each(W);
          },
          append: function (t) {
            var e = 'function' == typeof t ? t : (0, V.Z)(t);
            return this.select(function () {
              return this.appendChild(e.apply(this, arguments));
            });
          },
          insert: function (t, e) {
            var n = 'function' == typeof t ? t : (0, V.Z)(t),
              r = null == e ? Y : 'function' == typeof e ? e : (0, i.Z)(e);
            return this.select(function () {
              return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
            });
          },
          remove: function () {
            return this.each(F);
          },
          clone: function (t) {
            return this.select(t ? G : X);
          },
          datum: function (t) {
            return arguments.length ? this.property('__data__', t) : this.node().__data__;
          },
          on: function (t, e, n) {
            var i,
              r,
              o = $(t + ''),
              s = o.length;
            if (!(arguments.length < 2)) {
              for (a = e ? J : K, i = 0; i < s; ++i) this.each(a(o[i], e, n));
              return this;
            }
            var a = this.node().__on;
            if (a) for (var u, l = 0, c = a.length; l < c; ++l) for (i = 0, u = a[l]; i < s; ++i) if ((r = o[i]).type === u.type && r.name === u.name) return u.value;
          },
          dispatch: function (t, e) {
            return this.each(('function' == typeof e ? nt : et)(t, e));
          },
          [Symbol.iterator]: function* () {
            for (var t = this._groups, e = 0, n = t.length; e < n; ++e) for (var i, r = t[e], o = 0, s = r.length; o < s; ++o) (i = r[o]) && (yield i);
          },
        };
        const st = ot;
      },
      339: (t, e, n) => {
        n.d(e, { Z: () => a, S: () => u });
        var i = n(21);
        function r(t) {
          return function () {
            this.style.removeProperty(t);
          };
        }
        function o(t, e, n) {
          return function () {
            this.style.setProperty(t, e, n);
          };
        }
        function s(t, e, n) {
          return function () {
            var i = e.apply(this, arguments);
            null == i ? this.style.removeProperty(t) : this.style.setProperty(t, i, n);
          };
        }
        function a(t, e, n) {
          return arguments.length > 1 ? this.each((null == e ? r : 'function' == typeof e ? s : o)(t, e, null == n ? '' : n)) : u(this.node(), t);
        }
        function u(t, e) {
          return t.style.getPropertyValue(e) || (0, i.Z)(t).getComputedStyle(t, null).getPropertyValue(e);
        }
      },
      634: (t, e, n) => {
        function i() {}
        function r(t) {
          return null == t
            ? i
            : function () {
                return this.querySelector(t);
              };
        }
        n.d(e, { Z: () => r });
      },
      545: (t, e, n) => {
        function i() {
          return [];
        }
        function r(t) {
          return null == t
            ? i
            : function () {
                return this.querySelectorAll(t);
              };
        }
        n.d(e, { Z: () => r });
      },
      553: (t, e, n) => {
        function i(t) {
          let e;
          for (; (e = t.sourceEvent); ) t = e;
          return t;
        }
        n.d(e, { Z: () => i });
      },
      21: (t, e, n) => {
        function i(t) {
          return (t.ownerDocument && t.ownerDocument.defaultView) || (t.document && t) || t.defaultView;
        }
        n.d(e, { Z: () => i });
      },
      751: (t, e, n) => {
        n.r(e), n.d(e, { active: () => ue, interrupt: () => T, transition: () => ne });
        var i,
          r,
          o = n(434),
          s = n(626),
          a = 0,
          u = 0,
          l = 0,
          c = 0,
          h = 0,
          p = 0,
          d = 'object' == typeof performance && performance.now ? performance : Date,
          f =
            'object' == typeof window && window.requestAnimationFrame
              ? window.requestAnimationFrame.bind(window)
              : function (t) {
                  setTimeout(t, 17);
                };
        function v() {
          return h || (f(g), (h = d.now() + p));
        }
        function g() {
          h = 0;
        }
        function y() {
          this._call = this._time = this._next = null;
        }
        function m(t, e, n) {
          var i = new y();
          return i.restart(t, e, n), i;
        }
        function _() {
          (h = (c = d.now()) + p), (a = u = 0);
          try {
            !(function () {
              v(), ++a;
              for (var t, e = i; e; ) (t = h - e._time) >= 0 && e._call.call(null, t), (e = e._next);
              --a;
            })();
          } finally {
            (a = 0),
              (function () {
                for (var t, e, n = i, o = 1 / 0; n; )
                  n._call ? (o > n._time && (o = n._time), (t = n), (n = n._next)) : ((e = n._next), (n._next = null), (n = t ? (t._next = e) : (i = e)));
                (r = t), w(o);
              })(),
              (h = 0);
          }
        }
        function b() {
          var t = d.now(),
            e = t - c;
          e > 1e3 && ((p -= e), (c = t));
        }
        function w(t) {
          a ||
            (u && (u = clearTimeout(u)),
            t - h > 24
              ? (t < 1 / 0 && (u = setTimeout(_, t - d.now() - p)), l && (l = clearInterval(l)))
              : (l || ((c = d.now()), (l = setInterval(b, 1e3))), (a = 1), f(_)));
        }
        function S(t, e, n) {
          var i = new y();
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
        y.prototype = m.prototype = {
          constructor: y,
          restart: function (t, e, n) {
            if ('function' != typeof t) throw new TypeError('callback is not a function');
            (n = (null == n ? v() : +n) + (null == e ? 0 : +e)),
              this._next || r === this || (r ? (r._next = this) : (i = this), (r = this)),
              (this._call = t),
              (this._time = n),
              w();
          },
          stop: function () {
            this._call && ((this._call = null), (this._time = 1 / 0), w());
          },
        };
        var x = (0, s.Z)('start', 'end', 'cancel', 'interrupt'),
          E = [];
        function I(t, e, n, i, r, o) {
          var s = t.__transition;
          if (s) {
            if (n in s) return;
          } else t.__transition = {};
          !(function (t, e, n) {
            var i,
              r = t.__transition;
            function o(u) {
              var l, c, h, p;
              if (1 !== n.state) return a();
              for (l in r)
                if ((p = r[l]).name === n.name) {
                  if (3 === p.state) return S(o);
                  4 === p.state
                    ? ((p.state = 6), p.timer.stop(), p.on.call('interrupt', t, t.__data__, p.index, p.group), delete r[l])
                    : +l < e && ((p.state = 6), p.timer.stop(), p.on.call('cancel', t, t.__data__, p.index, p.group), delete r[l]);
                }
              if (
                (S(function () {
                  3 === n.state && ((n.state = 4), n.timer.restart(s, n.delay, n.time), s(u));
                }),
                (n.state = 2),
                n.on.call('start', t, t.__data__, n.index, n.group),
                2 === n.state)
              ) {
                for (n.state = 3, i = new Array((h = n.tween.length)), l = 0, c = -1; l < h; ++l)
                  (p = n.tween[l].value.call(t, t.__data__, n.index, n.group)) && (i[++c] = p);
                i.length = c + 1;
              }
            }
            function s(e) {
              for (var r = e < n.duration ? n.ease.call(null, e / n.duration) : (n.timer.restart(a), (n.state = 5), 1), o = -1, s = i.length; ++o < s; )
                i[o].call(t, r);
              5 === n.state && (n.on.call('end', t, t.__data__, n.index, n.group), a());
            }
            function a() {
              for (var i in ((n.state = 6), n.timer.stop(), delete r[e], r)) return;
              delete t.__transition;
            }
            (r[e] = n),
              (n.timer = m(
                function (t) {
                  (n.state = 1), n.timer.restart(o, n.delay, n.time), n.delay <= t && o(t - n.delay);
                },
                0,
                n.time
              ));
          })(t, n, { name: e, index: i, group: r, on: x, tween: E, time: o.time, delay: o.delay, duration: o.duration, ease: o.ease, timer: null, state: 0 });
        }
        function k(t, e) {
          var n = A(t, e);
          if (n.state > 0) throw new Error('too late; already scheduled');
          return n;
        }
        function M(t, e) {
          var n = A(t, e);
          if (n.state > 3) throw new Error('too late; already running');
          return n;
        }
        function A(t, e) {
          var n = t.__transition;
          if (!n || !(n = n[e])) throw new Error('transition not found');
          return n;
        }
        function T(t, e) {
          var n,
            i,
            r,
            o = t.__transition,
            s = !0;
          if (o) {
            for (r in ((e = null == e ? null : e + ''), o))
              (n = o[r]).name === e
                ? ((i = n.state > 2 && n.state < 5),
                  (n.state = 6),
                  n.timer.stop(),
                  n.on.call(i ? 'interrupt' : 'cancel', t, t.__data__, n.index, n.group),
                  delete o[r])
                : (s = !1);
            s && delete t.__transition;
          }
        }
        function B(t, e) {
          return (
            (t = +t),
            (e = +e),
            function (n) {
              return t * (1 - n) + e * n;
            }
          );
        }
        var O,
          N = 180 / Math.PI,
          C = { translateX: 0, translateY: 0, rotate: 0, skewX: 0, scaleX: 1, scaleY: 1 };
        function P(t, e, n, i, r, o) {
          var s, a, u;
          return (
            (s = Math.sqrt(t * t + e * e)) && ((t /= s), (e /= s)),
            (u = t * n + e * i) && ((n -= t * u), (i -= e * u)),
            (a = Math.sqrt(n * n + i * i)) && ((n /= a), (i /= a), (u /= a)),
            t * i < e * n && ((t = -t), (e = -e), (u = -u), (s = -s)),
            { translateX: r, translateY: o, rotate: Math.atan2(e, t) * N, skewX: Math.atan(u) * N, scaleX: s, scaleY: a }
          );
        }
        function q(t, e, n, i) {
          function r(t) {
            return t.length ? t.pop() + ' ' : '';
          }
          return function (o, s) {
            var a = [],
              u = [];
            return (
              (o = t(o)),
              (s = t(s)),
              (function (t, i, r, o, s, a) {
                if (t !== r || i !== o) {
                  var u = s.push('translate(', null, e, null, n);
                  a.push({ i: u - 4, x: B(t, r) }, { i: u - 2, x: B(i, o) });
                } else (r || o) && s.push('translate(' + r + e + o + n);
              })(o.translateX, o.translateY, s.translateX, s.translateY, a, u),
              (function (t, e, n, o) {
                t !== e
                  ? (t - e > 180 ? (e += 360) : e - t > 180 && (t += 360), o.push({ i: n.push(r(n) + 'rotate(', null, i) - 2, x: B(t, e) }))
                  : e && n.push(r(n) + 'rotate(' + e + i);
              })(o.rotate, s.rotate, a, u),
              (function (t, e, n, o) {
                t !== e ? o.push({ i: n.push(r(n) + 'skewX(', null, i) - 2, x: B(t, e) }) : e && n.push(r(n) + 'skewX(' + e + i);
              })(o.skewX, s.skewX, a, u),
              (function (t, e, n, i, o, s) {
                if (t !== n || e !== i) {
                  var a = o.push(r(o) + 'scale(', null, ',', null, ')');
                  s.push({ i: a - 4, x: B(t, n) }, { i: a - 2, x: B(e, i) });
                } else (1 === n && 1 === i) || o.push(r(o) + 'scale(' + n + ',' + i + ')');
              })(o.scaleX, o.scaleY, s.scaleX, s.scaleY, a, u),
              (o = s = null),
              function (t) {
                for (var e, n = -1, i = u.length; ++n < i; ) a[(e = u[n]).i] = e.x(t);
                return a.join('');
              }
            );
          };
        }
        var D = q(
            function (t) {
              const e = new ('function' == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(t + '');
              return e.isIdentity ? C : P(e.a, e.b, e.c, e.d, e.e, e.f);
            },
            'px, ',
            'px)',
            'deg)'
          ),
          H = q(
            function (t) {
              return null == t
                ? C
                : (O || (O = document.createElementNS('http://www.w3.org/2000/svg', 'g')),
                  O.setAttribute('transform', t),
                  (t = O.transform.baseVal.consolidate()) ? P((t = t.matrix).a, t.b, t.c, t.d, t.e, t.f) : C);
            },
            ', ',
            ')',
            ')'
          ),
          L = n(888);
        function z(t, e) {
          var n, i;
          return function () {
            var r = M(this, t),
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
        function Z(t, e, n) {
          var i, r;
          if ('function' != typeof n) throw new Error();
          return function () {
            var o = M(this, t),
              s = o.tween;
            if (s !== i) {
              r = (i = s).slice();
              for (var a = { name: e, value: n }, u = 0, l = r.length; u < l; ++u)
                if (r[u].name === e) {
                  r[u] = a;
                  break;
                }
              u === l && r.push(a);
            }
            o.tween = r;
          };
        }
        function R(t, e, n) {
          var i = t._id;
          return (
            t.each(function () {
              var t = M(this, i);
              (t.value || (t.value = {}))[e] = n.apply(this, arguments);
            }),
            function (t) {
              return A(t, i).value[e];
            }
          );
        }
        function j(t, e, n) {
          (t.prototype = e.prototype = n), (n.constructor = t);
        }
        function U(t, e) {
          var n = Object.create(t.prototype);
          for (var i in e) n[i] = e[i];
          return n;
        }
        function W() {}
        var V = 0.7,
          Y = 1 / V,
          F = '\\s*([+-]?\\d+)\\s*',
          X = '\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*',
          G = '\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
          $ = /^#([0-9a-f]{3,8})$/,
          K = new RegExp('^rgb\\(' + [F, F, F] + '\\)$'),
          J = new RegExp('^rgb\\(' + [G, G, G] + '\\)$'),
          Q = new RegExp('^rgba\\(' + [F, F, F, X] + '\\)$'),
          tt = new RegExp('^rgba\\(' + [G, G, G, X] + '\\)$'),
          et = new RegExp('^hsl\\(' + [X, G, G] + '\\)$'),
          nt = new RegExp('^hsla\\(' + [X, G, G, X] + '\\)$'),
          it = {
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
        function rt() {
          return this.rgb().formatHex();
        }
        function ot() {
          return this.rgb().formatRgb();
        }
        function st(t) {
          var e, n;
          return (
            (t = (t + '').trim().toLowerCase()),
            (e = $.exec(t))
              ? ((n = e[1].length),
                (e = parseInt(e[1], 16)),
                6 === n
                  ? at(e)
                  : 3 === n
                    ? new ht(((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), ((15 & e) << 4) | (15 & e), 1)
                    : 8 === n
                      ? ut((e >> 24) & 255, (e >> 16) & 255, (e >> 8) & 255, (255 & e) / 255)
                      : 4 === n
                        ? ut(((e >> 12) & 15) | ((e >> 8) & 240), ((e >> 8) & 15) | ((e >> 4) & 240), ((e >> 4) & 15) | (240 & e), (((15 & e) << 4) | (15 & e)) / 255)
                        : null)
              : (e = K.exec(t))
                ? new ht(e[1], e[2], e[3], 1)
                : (e = J.exec(t))
                  ? new ht((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, 1)
                  : (e = Q.exec(t))
                    ? ut(e[1], e[2], e[3], e[4])
                    : (e = tt.exec(t))
                      ? ut((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, e[4])
                      : (e = et.exec(t))
                        ? vt(e[1], e[2] / 100, e[3] / 100, 1)
                        : (e = nt.exec(t))
                          ? vt(e[1], e[2] / 100, e[3] / 100, e[4])
                          : it.hasOwnProperty(t)
                            ? at(it[t])
                            : 'transparent' === t
                              ? new ht(NaN, NaN, NaN, 0)
                              : null
          );
        }
        function at(t) {
          return new ht((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1);
        }
        function ut(t, e, n, i) {
          return i <= 0 && (t = e = n = NaN), new ht(t, e, n, i);
        }
        function lt(t) {
          return t instanceof W || (t = st(t)), t ? new ht((t = t.rgb()).r, t.g, t.b, t.opacity) : new ht();
        }
        function ct(t, e, n, i) {
          return 1 === arguments.length ? lt(t) : new ht(t, e, n, null == i ? 1 : i);
        }
        function ht(t, e, n, i) {
          (this.r = +t), (this.g = +e), (this.b = +n), (this.opacity = +i);
        }
        function pt() {
          return '#' + ft(this.r) + ft(this.g) + ft(this.b);
        }
        function dt() {
          var t = this.opacity;
          return (
            (1 === (t = isNaN(t) ? 1 : Math.max(0, Math.min(1, t))) ? 'rgb(' : 'rgba(') +
            Math.max(0, Math.min(255, Math.round(this.r) || 0)) +
            ', ' +
            Math.max(0, Math.min(255, Math.round(this.g) || 0)) +
            ', ' +
            Math.max(0, Math.min(255, Math.round(this.b) || 0)) +
            (1 === t ? ')' : ', ' + t + ')')
          );
        }
        function ft(t) {
          return ((t = Math.max(0, Math.min(255, Math.round(t) || 0))) < 16 ? '0' : '') + t.toString(16);
        }
        function vt(t, e, n, i) {
          return i <= 0 ? (t = e = n = NaN) : n <= 0 || n >= 1 ? (t = e = NaN) : e <= 0 && (t = NaN), new yt(t, e, n, i);
        }
        function gt(t) {
          if (t instanceof yt) return new yt(t.h, t.s, t.l, t.opacity);
          if ((t instanceof W || (t = st(t)), !t)) return new yt();
          if (t instanceof yt) return t;
          var e = (t = t.rgb()).r / 255,
            n = t.g / 255,
            i = t.b / 255,
            r = Math.min(e, n, i),
            o = Math.max(e, n, i),
            s = NaN,
            a = o - r,
            u = (o + r) / 2;
          return (
            a
              ? ((s = e === o ? (n - i) / a + 6 * (n < i) : n === o ? (i - e) / a + 2 : (e - n) / a + 4), (a /= u < 0.5 ? o + r : 2 - o - r), (s *= 60))
              : (a = u > 0 && u < 1 ? 0 : s),
            new yt(s, a, u, t.opacity)
          );
        }
        function yt(t, e, n, i) {
          (this.h = +t), (this.s = +e), (this.l = +n), (this.opacity = +i);
        }
        function mt(t, e, n) {
          return 255 * (t < 60 ? e + ((n - e) * t) / 60 : t < 180 ? n : t < 240 ? e + ((n - e) * (240 - t)) / 60 : e);
        }
        function _t(t, e, n, i, r) {
          var o = t * t,
            s = o * t;
          return ((1 - 3 * t + 3 * o - s) * e + (4 - 6 * o + 3 * s) * n + (1 + 3 * t + 3 * o - 3 * s) * i + s * r) / 6;
        }
        j(W, st, {
          copy: function (t) {
            return Object.assign(new this.constructor(), this, t);
          },
          displayable: function () {
            return this.rgb().displayable();
          },
          hex: rt,
          formatHex: rt,
          formatHsl: function () {
            return gt(this).formatHsl();
          },
          formatRgb: ot,
          toString: ot,
        }),
          j(
            ht,
            ct,
            U(W, {
              brighter: function (t) {
                return (t = null == t ? Y : Math.pow(Y, t)), new ht(this.r * t, this.g * t, this.b * t, this.opacity);
              },
              darker: function (t) {
                return (t = null == t ? V : Math.pow(V, t)), new ht(this.r * t, this.g * t, this.b * t, this.opacity);
              },
              rgb: function () {
                return this;
              },
              displayable: function () {
                return (
                  -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1
                );
              },
              hex: pt,
              formatHex: pt,
              formatRgb: dt,
              toString: dt,
            })
          ),
          j(
            yt,
            function (t, e, n, i) {
              return 1 === arguments.length ? gt(t) : new yt(t, e, n, null == i ? 1 : i);
            },
            U(W, {
              brighter: function (t) {
                return (t = null == t ? Y : Math.pow(Y, t)), new yt(this.h, this.s, this.l * t, this.opacity);
              },
              darker: function (t) {
                return (t = null == t ? V : Math.pow(V, t)), new yt(this.h, this.s, this.l * t, this.opacity);
              },
              rgb: function () {
                var t = (this.h % 360) + 360 * (this.h < 0),
                  e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
                  n = this.l,
                  i = n + (n < 0.5 ? n : 1 - n) * e,
                  r = 2 * n - i;
                return new ht(mt(t >= 240 ? t - 240 : t + 120, r, i), mt(t, r, i), mt(t < 120 ? t + 240 : t - 120, r, i), this.opacity);
              },
              displayable: function () {
                return ((0 <= this.s && this.s <= 1) || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
              },
              formatHsl: function () {
                var t = this.opacity;
                return (
                  (1 === (t = isNaN(t) ? 1 : Math.max(0, Math.min(1, t))) ? 'hsl(' : 'hsla(') +
                  (this.h || 0) +
                  ', ' +
                  100 * (this.s || 0) +
                  '%, ' +
                  100 * (this.l || 0) +
                  '%' +
                  (1 === t ? ')' : ', ' + t + ')')
                );
              },
            })
          );
        const bt = (t) => () => t;
        function wt(t, e) {
          var n = e - t;
          return n
            ? (function (t, e) {
                return function (n) {
                  return t + n * e;
                };
              })(t, n)
            : bt(isNaN(t) ? e : t);
        }
        const St = (function t(e) {
          var n = (function (t) {
            return 1 == (t = +t)
              ? wt
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
                    : bt(isNaN(e) ? n : e);
                };
          })(e);
          function i(t, e) {
            var i = n((t = ct(t)).r, (e = ct(e)).r),
              r = n(t.g, e.g),
              o = n(t.b, e.b),
              s = wt(t.opacity, e.opacity);
            return function (e) {
              return (t.r = i(e)), (t.g = r(e)), (t.b = o(e)), (t.opacity = s(e)), t + '';
            };
          }
          return (i.gamma = t), i;
        })(1);
        function xt(t) {
          return function (e) {
            var n,
              i,
              r = e.length,
              o = new Array(r),
              s = new Array(r),
              a = new Array(r);
            for (n = 0; n < r; ++n) (i = ct(e[n])), (o[n] = i.r || 0), (s[n] = i.g || 0), (a[n] = i.b || 0);
            return (
              (o = t(o)),
              (s = t(s)),
              (a = t(a)),
              (i.opacity = 1),
              function (t) {
                return (i.r = o(t)), (i.g = s(t)), (i.b = a(t)), i + '';
              }
            );
          };
        }
        xt(function (t) {
          var e = t.length - 1;
          return function (n) {
            var i = n <= 0 ? (n = 0) : n >= 1 ? ((n = 1), e - 1) : Math.floor(n * e),
              r = t[i],
              o = t[i + 1],
              s = i > 0 ? t[i - 1] : 2 * r - o,
              a = i < e - 1 ? t[i + 2] : 2 * o - r;
            return _t((n - i / e) * e, s, r, o, a);
          };
        }),
          xt(function (t) {
            var e = t.length;
            return function (n) {
              var i = Math.floor(((n %= 1) < 0 ? ++n : n) * e),
                r = t[(i + e - 1) % e],
                o = t[i % e],
                s = t[(i + 1) % e],
                a = t[(i + 2) % e];
              return _t((n - i / e) * e, r, o, s, a);
            };
          });
        var Et = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
          It = new RegExp(Et.source, 'g');
        function kt(t, e) {
          var n,
            i,
            r,
            o = (Et.lastIndex = It.lastIndex = 0),
            s = -1,
            a = [],
            u = [];
          for (t += '', e += ''; (n = Et.exec(t)) && (i = It.exec(e)); )
            (r = i.index) > o && ((r = e.slice(o, r)), a[s] ? (a[s] += r) : (a[++s] = r)),
              (n = n[0]) === (i = i[0]) ? (a[s] ? (a[s] += i) : (a[++s] = i)) : ((a[++s] = null), u.push({ i: s, x: B(n, i) })),
              (o = It.lastIndex);
          return (
            o < e.length && ((r = e.slice(o)), a[s] ? (a[s] += r) : (a[++s] = r)),
            a.length < 2
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
                  for (var n, i = 0; i < e; ++i) a[(n = u[i]).i] = n.x(t);
                  return a.join('');
                })
          );
        }
        function Mt(t, e) {
          var n;
          return ('number' == typeof e ? B : e instanceof st ? St : (n = st(e)) ? ((e = n), St) : kt)(t, e);
        }
        function At(t) {
          return function () {
            this.removeAttribute(t);
          };
        }
        function Tt(t) {
          return function () {
            this.removeAttributeNS(t.space, t.local);
          };
        }
        function Bt(t, e, n) {
          var i,
            r,
            o = n + '';
          return function () {
            var s = this.getAttribute(t);
            return s === o ? null : s === i ? r : (r = e((i = s), n));
          };
        }
        function Ot(t, e, n) {
          var i,
            r,
            o = n + '';
          return function () {
            var s = this.getAttributeNS(t.space, t.local);
            return s === o ? null : s === i ? r : (r = e((i = s), n));
          };
        }
        function Nt(t, e, n) {
          var i, r, o;
          return function () {
            var s,
              a,
              u = n(this);
            if (null != u) return (s = this.getAttribute(t)) === (a = u + '') ? null : s === i && a === r ? o : ((r = a), (o = e((i = s), u)));
            this.removeAttribute(t);
          };
        }
        function Ct(t, e, n) {
          var i, r, o;
          return function () {
            var s,
              a,
              u = n(this);
            if (null != u) return (s = this.getAttributeNS(t.space, t.local)) === (a = u + '') ? null : s === i && a === r ? o : ((r = a), (o = e((i = s), u)));
            this.removeAttributeNS(t.space, t.local);
          };
        }
        function Pt(t, e) {
          return function (n) {
            this.setAttribute(t, e.call(this, n));
          };
        }
        function qt(t, e) {
          return function (n) {
            this.setAttributeNS(t.space, t.local, e.call(this, n));
          };
        }
        function Dt(t, e) {
          var n, i;
          function r() {
            var r = e.apply(this, arguments);
            return r !== i && (n = (i = r) && qt(t, r)), n;
          }
          return (r._value = e), r;
        }
        function Ht(t, e) {
          var n, i;
          function r() {
            var r = e.apply(this, arguments);
            return r !== i && (n = (i = r) && Pt(t, r)), n;
          }
          return (r._value = e), r;
        }
        function Lt(t, e) {
          return function () {
            k(this, t).delay = +e.apply(this, arguments);
          };
        }
        function zt(t, e) {
          return (
            (e = +e),
            function () {
              k(this, t).delay = e;
            }
          );
        }
        function Zt(t, e) {
          return function () {
            M(this, t).duration = +e.apply(this, arguments);
          };
        }
        function Rt(t, e) {
          return (
            (e = +e),
            function () {
              M(this, t).duration = e;
            }
          );
        }
        function jt(t, e) {
          if ('function' != typeof e) throw new Error();
          return function () {
            M(this, t).ease = e;
          };
        }
        var Ut = n(83);
        function Wt(t, e, n) {
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
              ? k
              : M;
          return function () {
            var s = o(this, t),
              a = s.on;
            a !== i && (r = (i = a).copy()).on(e, n), (s.on = r);
          };
        }
        var Vt = n(634),
          Yt = n(545),
          Ft = o.ZP.prototype.constructor,
          Xt = n(339);
        function Gt(t) {
          return function () {
            this.style.removeProperty(t);
          };
        }
        function $t(t, e, n) {
          return function (i) {
            this.style.setProperty(t, e.call(this, i), n);
          };
        }
        function Kt(t, e, n) {
          var i, r;
          function o() {
            var o = e.apply(this, arguments);
            return o !== r && (i = (r = o) && $t(t, o, n)), i;
          }
          return (o._value = e), o;
        }
        function Jt(t) {
          return function (e) {
            this.textContent = t.call(this, e);
          };
        }
        function Qt(t) {
          var e, n;
          function i() {
            var i = t.apply(this, arguments);
            return i !== n && (e = (n = i) && Jt(i)), e;
          }
          return (i._value = t), i;
        }
        var te = 0;
        function ee(t, e, n, i) {
          (this._groups = t), (this._parents = e), (this._name = n), (this._id = i);
        }
        function ne(t) {
          return (0, o.ZP)().transition(t);
        }
        function ie() {
          return ++te;
        }
        var re = o.ZP.prototype;
        ee.prototype = ne.prototype = {
          constructor: ee,
          select: function (t) {
            var e = this._name,
              n = this._id;
            'function' != typeof t && (t = (0, Vt.Z)(t));
            for (var i = this._groups, r = i.length, o = new Array(r), s = 0; s < r; ++s)
              for (var a, u, l = i[s], c = l.length, h = (o[s] = new Array(c)), p = 0; p < c; ++p)
                (a = l[p]) && (u = t.call(a, a.__data__, p, l)) && ('__data__' in a && (u.__data__ = a.__data__), (h[p] = u), I(h[p], e, n, p, h, A(a, n)));
            return new ee(o, this._parents, e, n);
          },
          selectAll: function (t) {
            var e = this._name,
              n = this._id;
            'function' != typeof t && (t = (0, Yt.Z)(t));
            for (var i = this._groups, r = i.length, o = [], s = [], a = 0; a < r; ++a)
              for (var u, l = i[a], c = l.length, h = 0; h < c; ++h)
                if ((u = l[h])) {
                  for (var p, d = t.call(u, u.__data__, h, l), f = A(u, n), v = 0, g = d.length; v < g; ++v) (p = d[v]) && I(p, e, n, v, d, f);
                  o.push(d), s.push(u);
                }
            return new ee(o, s, e, n);
          },
          filter: function (t) {
            'function' != typeof t && (t = (0, Ut.Z)(t));
            for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
              for (var o, s = e[r], a = s.length, u = (i[r] = []), l = 0; l < a; ++l) (o = s[l]) && t.call(o, o.__data__, l, s) && u.push(o);
            return new ee(i, this._parents, this._name, this._id);
          },
          merge: function (t) {
            if (t._id !== this._id) throw new Error();
            for (var e = this._groups, n = t._groups, i = e.length, r = n.length, o = Math.min(i, r), s = new Array(i), a = 0; a < o; ++a)
              for (var u, l = e[a], c = n[a], h = l.length, p = (s[a] = new Array(h)), d = 0; d < h; ++d) (u = l[d] || c[d]) && (p[d] = u);
            for (; a < i; ++a) s[a] = e[a];
            return new ee(s, this._parents, this._name, this._id);
          },
          selection: function () {
            return new Ft(this._groups, this._parents);
          },
          transition: function () {
            for (var t = this._name, e = this._id, n = ie(), i = this._groups, r = i.length, o = 0; o < r; ++o)
              for (var s, a = i[o], u = a.length, l = 0; l < u; ++l)
                if ((s = a[l])) {
                  var c = A(s, e);
                  I(s, t, n, l, a, { time: c.time + c.delay + c.duration, delay: 0, duration: c.duration, ease: c.ease });
                }
            return new ee(i, this._parents, t, n);
          },
          call: re.call,
          nodes: re.nodes,
          node: re.node,
          size: re.size,
          empty: re.empty,
          each: re.each,
          on: function (t, e) {
            var n = this._id;
            return arguments.length < 2 ? A(this.node(), n).on.on(t) : this.each(Wt(n, t, e));
          },
          attr: function (t, e) {
            var n = (0, L.Z)(t),
              i = 'transform' === n ? H : Mt;
            return this.attrTween(
              t,
              'function' == typeof e ? (n.local ? Ct : Nt)(n, i, R(this, 'attr.' + t, e)) : null == e ? (n.local ? Tt : At)(n) : (n.local ? Ot : Bt)(n, i, e)
            );
          },
          attrTween: function (t, e) {
            var n = 'attr.' + t;
            if (arguments.length < 2) return (n = this.tween(n)) && n._value;
            if (null == e) return this.tween(n, null);
            if ('function' != typeof e) throw new Error();
            var i = (0, L.Z)(t);
            return this.tween(n, (i.local ? Dt : Ht)(i, e));
          },
          style: function (t, e, n) {
            var i = 'transform' == (t += '') ? D : Mt;
            return null == e
              ? this.styleTween(
                  t,
                  (function (t, e) {
                    var n, i, r;
                    return function () {
                      var o = (0, Xt.S)(this, t),
                        s = (this.style.removeProperty(t), (0, Xt.S)(this, t));
                      return o === s ? null : o === n && s === i ? r : (r = e((n = o), (i = s)));
                    };
                  })(t, i)
                ).on('end.style.' + t, Gt(t))
              : 'function' == typeof e
                ? this.styleTween(
                    t,
                    (function (t, e, n) {
                      var i, r, o;
                      return function () {
                        var s = (0, Xt.S)(this, t),
                          a = n(this),
                          u = a + '';
                        return (
                          null == a && (this.style.removeProperty(t), (u = a = (0, Xt.S)(this, t))),
                          s === u ? null : s === i && u === r ? o : ((r = u), (o = e((i = s), a)))
                        );
                      };
                    })(t, i, R(this, 'style.' + t, e))
                  ).each(
                    (function (t, e) {
                      var n,
                        i,
                        r,
                        o,
                        s = 'style.' + e,
                        a = 'end.' + s;
                      return function () {
                        var u = M(this, t),
                          l = u.on,
                          c = null == u.value[s] ? o || (o = Gt(e)) : void 0;
                        (l === n && r === c) || (i = (n = l).copy()).on(a, (r = c)), (u.on = i);
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
                        var s = (0, Xt.S)(this, t);
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
            return this.tween(i, Kt(t, e, null == n ? '' : n));
          },
          text: function (t) {
            return this.tween(
              'text',
              'function' == typeof t
                ? (function (t) {
                    return function () {
                      var e = t(this);
                      this.textContent = null == e ? '' : e;
                    };
                  })(R(this, 'text', t))
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
            return this.tween(e, Qt(t));
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
              for (var i, r = A(this.node(), n).tween, o = 0, s = r.length; o < s; ++o) if ((i = r[o]).name === t) return i.value;
              return null;
            }
            return this.each((null == e ? z : Z)(n, t, e));
          },
          delay: function (t) {
            var e = this._id;
            return arguments.length ? this.each(('function' == typeof t ? Lt : zt)(e, t)) : A(this.node(), e).delay;
          },
          duration: function (t) {
            var e = this._id;
            return arguments.length ? this.each(('function' == typeof t ? Zt : Rt)(e, t)) : A(this.node(), e).duration;
          },
          ease: function (t) {
            var e = this._id;
            return arguments.length ? this.each(jt(e, t)) : A(this.node(), e).ease;
          },
          easeVarying: function (t) {
            if ('function' != typeof t) throw new Error();
            return this.each(
              (function (t, e) {
                return function () {
                  var n = e.apply(this, arguments);
                  if ('function' != typeof n) throw new Error();
                  M(this, t).ease = n;
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
                u = {
                  value: function () {
                    0 == --r && o();
                  },
                };
              n.each(function () {
                var n = M(this, i),
                  r = n.on;
                r !== t && ((e = (t = r).copy())._.cancel.push(a), e._.interrupt.push(a), e._.end.push(u)), (n.on = e);
              }),
                0 === r && o();
            });
          },
          [Symbol.iterator]: re[Symbol.iterator],
        };
        var oe = {
          time: null,
          delay: 0,
          duration: 250,
          ease: function (t) {
            return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
          },
        };
        function se(t, e) {
          for (var n; !(n = t.__transition) || !(n = n[e]); ) if (!(t = t.parentNode)) throw new Error(`transition ${e} not found`);
          return n;
        }
        (o.ZP.prototype.interrupt = function (t) {
          return this.each(function () {
            T(this, t);
          });
        }),
          (o.ZP.prototype.transition = function (t) {
            var e, n;
            t instanceof ee ? ((e = t._id), (t = t._name)) : ((e = ie()), ((n = oe).time = v()), (t = null == t ? null : t + ''));
            for (var i = this._groups, r = i.length, o = 0; o < r; ++o)
              for (var s, a = i[o], u = a.length, l = 0; l < u; ++l) (s = a[l]) && I(s, t, e, l, a, n || se(s, e));
            return new ee(i, this._parents, t, e);
          });
        var ae = [null];
        function ue(t, e) {
          var n,
            i,
            r = t.__transition;
          if (r) for (i in ((e = null == e ? null : e + ''), r)) if ((n = r[i]).state > 1 && n.name === e) return new ee([[t]], ae, e, +i);
          return null;
        }
      },
      819: (t, e, n) => {
        n.r(e), n.d(e, { zoom: () => I, zoomIdentity: () => v, zoomTransform: () => g });
        var i = n(626),
          r = n(17);
        function o(t) {
          t.preventDefault(), t.stopImmediatePropagation();
        }
        function s(t) {
          var e = t.document.documentElement,
            n = (0, r.Z)(t).on('dragstart.drag', o, !0);
          'onselectstart' in e ? n.on('selectstart.drag', o, !0) : ((e.__noselect = e.style.MozUserSelect), (e.style.MozUserSelect = 'none'));
        }
        function a(t, e) {
          var n = t.document.documentElement,
            i = (0, r.Z)(t).on('dragstart.drag', null);
          e &&
            (i.on('click.drag', o, !0),
            setTimeout(function () {
              i.on('click.drag', null);
            }, 0)),
            'onselectstart' in n ? i.on('selectstart.drag', null) : ((n.style.MozUserSelect = n.__noselect), delete n.__noselect);
        }
        function u(t) {
          return ((t = Math.exp(t)) + 1 / t) / 2;
        }
        const l = (function t(e, n, i) {
          function r(t, r) {
            var o,
              s,
              a = t[0],
              l = t[1],
              c = t[2],
              h = r[0],
              p = r[1],
              d = r[2],
              f = h - a,
              v = p - l,
              g = f * f + v * v;
            if (g < 1e-12)
              (s = Math.log(d / c) / e),
                (o = function (t) {
                  return [a + t * f, l + t * v, c * Math.exp(e * t * s)];
                });
            else {
              var y = Math.sqrt(g),
                m = (d * d - c * c + i * g) / (2 * c * n * y),
                _ = (d * d - c * c - i * g) / (2 * d * n * y),
                b = Math.log(Math.sqrt(m * m + 1) - m),
                w = Math.log(Math.sqrt(_ * _ + 1) - _);
              (s = (w - b) / e),
                (o = function (t) {
                  var i,
                    r = t * s,
                    o = u(b),
                    h =
                      (c / (n * y)) *
                      (o * ((i = e * r + b), ((i = Math.exp(2 * i)) - 1) / (i + 1)) -
                        (function (t) {
                          return ((t = Math.exp(t)) - 1 / t) / 2;
                        })(b));
                  return [a + h * f, l + h * v, (c * o) / u(e * r + b)];
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
        })(Math.SQRT2, 2, 4);
        var c = n(172),
          h = n(751);
        const p = (t) => () => t;
        function d(t, { sourceEvent: e, target: n, transform: i, dispatch: r }) {
          Object.defineProperties(this, {
            type: { value: t, enumerable: !0, configurable: !0 },
            sourceEvent: { value: e, enumerable: !0, configurable: !0 },
            target: { value: n, enumerable: !0, configurable: !0 },
            transform: { value: i, enumerable: !0, configurable: !0 },
            _: { value: r },
          });
        }
        function f(t, e, n) {
          (this.k = t), (this.x = e), (this.y = n);
        }
        f.prototype = {
          constructor: f,
          scale: function (t) {
            return 1 === t ? this : new f(this.k * t, this.x, this.y);
          },
          translate: function (t, e) {
            return (0 === t) & (0 === e) ? this : new f(this.k, this.x + this.k * t, this.y + this.k * e);
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
        var v = new f(1, 0, 0);
        function g(t) {
          for (; !t.__zoom; ) if (!(t = t.parentNode)) return v;
          return t.__zoom;
        }
        function y(t) {
          t.stopImmediatePropagation();
        }
        function m(t) {
          t.preventDefault(), t.stopImmediatePropagation();
        }
        function _(t) {
          return !((t.ctrlKey && 'wheel' !== t.type) || t.button);
        }
        function b() {
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
        function w() {
          return this.__zoom || v;
        }
        function S(t) {
          return -t.deltaY * (1 === t.deltaMode ? 0.05 : t.deltaMode ? 1 : 0.002) * (t.ctrlKey ? 10 : 1);
        }
        function x() {
          return navigator.maxTouchPoints || 'ontouchstart' in this;
        }
        function E(t, e, n) {
          var i = t.invertX(e[0][0]) - n[0][0],
            r = t.invertX(e[1][0]) - n[1][0],
            o = t.invertY(e[0][1]) - n[0][1],
            s = t.invertY(e[1][1]) - n[1][1];
          return t.translate(r > i ? (i + r) / 2 : Math.min(0, i) || Math.max(0, r), s > o ? (o + s) / 2 : Math.min(0, o) || Math.max(0, s));
        }
        function I() {
          var t,
            e,
            n,
            o = _,
            u = b,
            g = E,
            I = S,
            k = x,
            M = [0, 1 / 0],
            A = [
              [-1 / 0, -1 / 0],
              [1 / 0, 1 / 0],
            ],
            T = 250,
            B = l,
            O = (0, i.Z)('start', 'zoom', 'end'),
            N = 500,
            C = 0,
            P = 10;
          function q(t) {
            t.property('__zoom', w)
              .on('wheel.zoom', j)
              .on('mousedown.zoom', U)
              .on('dblclick.zoom', W)
              .filter(k)
              .on('touchstart.zoom', V)
              .on('touchmove.zoom', Y)
              .on('touchend.zoom touchcancel.zoom', F)
              .style('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');
          }
          function D(t, e) {
            return (e = Math.max(M[0], Math.min(M[1], e))) === t.k ? t : new f(e, t.x, t.y);
          }
          function H(t, e, n) {
            var i = e[0] - n[0] * t.k,
              r = e[1] - n[1] * t.k;
            return i === t.x && r === t.y ? t : new f(t.k, i, r);
          }
          function L(t) {
            return [(+t[0][0] + +t[1][0]) / 2, (+t[0][1] + +t[1][1]) / 2];
          }
          function z(t, e, n, i) {
            t.on('start.zoom', function () {
              Z(this, arguments).event(i).start();
            })
              .on('interrupt.zoom end.zoom', function () {
                Z(this, arguments).event(i).end();
              })
              .tween('zoom', function () {
                var t = this,
                  r = arguments,
                  o = Z(t, r).event(i),
                  s = u.apply(t, r),
                  a = null == n ? L(s) : 'function' == typeof n ? n.apply(t, r) : n,
                  l = Math.max(s[1][0] - s[0][0], s[1][1] - s[0][1]),
                  c = t.__zoom,
                  h = 'function' == typeof e ? e.apply(t, r) : e,
                  p = B(c.invert(a).concat(l / c.k), h.invert(a).concat(l / h.k));
                return function (t) {
                  if (1 === t) t = h;
                  else {
                    var e = p(t),
                      n = l / e[2];
                    t = new f(n, a[0] - e[0] * n, a[1] - e[1] * n);
                  }
                  o.zoom(null, t);
                };
              });
          }
          function Z(t, e, n) {
            return (!n && t.__zooming) || new R(t, e);
          }
          function R(t, e) {
            (this.that = t), (this.args = e), (this.active = 0), (this.sourceEvent = null), (this.extent = u.apply(t, e)), (this.taps = 0);
          }
          function j(t, ...e) {
            if (o.apply(this, arguments)) {
              var n = Z(this, e).event(t),
                i = this.__zoom,
                r = Math.max(M[0], Math.min(M[1], i.k * Math.pow(2, I.apply(this, arguments)))),
                s = (0, c.Z)(t);
              if (n.wheel) (n.mouse[0][0] === s[0] && n.mouse[0][1] === s[1]) || (n.mouse[1] = i.invert((n.mouse[0] = s))), clearTimeout(n.wheel);
              else {
                if (i.k === r) return;
                (n.mouse = [s, i.invert(s)]), (0, h.interrupt)(this), n.start();
              }
              m(t), (n.wheel = setTimeout(a, 150)), n.zoom('mouse', g(H(D(i, r), n.mouse[0], n.mouse[1]), n.extent, A));
            }
            function a() {
              (n.wheel = null), n.end();
            }
          }
          function U(t, ...e) {
            if (!n && o.apply(this, arguments)) {
              var i = Z(this, e, !0).event(t),
                u = (0, r.Z)(t.view).on('mousemove.zoom', v, !0).on('mouseup.zoom', _, !0),
                l = (0, c.Z)(t, p),
                p = t.currentTarget,
                d = t.clientX,
                f = t.clientY;
              s(t.view), y(t), (i.mouse = [l, this.__zoom.invert(l)]), (0, h.interrupt)(this), i.start();
            }
            function v(t) {
              if ((m(t), !i.moved)) {
                var e = t.clientX - d,
                  n = t.clientY - f;
                i.moved = e * e + n * n > C;
              }
              i.event(t).zoom('mouse', g(H(i.that.__zoom, (i.mouse[0] = (0, c.Z)(t, p)), i.mouse[1]), i.extent, A));
            }
            function _(t) {
              u.on('mousemove.zoom mouseup.zoom', null), a(t.view, i.moved), m(t), i.event(t).end();
            }
          }
          function W(t, ...e) {
            if (o.apply(this, arguments)) {
              var n = this.__zoom,
                i = (0, c.Z)(t.changedTouches ? t.changedTouches[0] : t, this),
                s = n.invert(i),
                a = n.k * (t.shiftKey ? 0.5 : 2),
                l = g(H(D(n, a), i, s), u.apply(this, e), A);
              m(t), T > 0 ? (0, r.Z)(this).transition().duration(T).call(z, l, i, t) : (0, r.Z)(this).call(q.transform, l, i, t);
            }
          }
          function V(n, ...i) {
            if (o.apply(this, arguments)) {
              var r,
                s,
                a,
                u,
                l = n.touches,
                p = l.length,
                d = Z(this, i, n.changedTouches.length === p).event(n);
              for (y(n), s = 0; s < p; ++s)
                (a = l[s]),
                  (u = [(u = (0, c.Z)(a, this)), this.__zoom.invert(u), a.identifier]),
                  d.touch0 ? d.touch1 || d.touch0[2] === u[2] || ((d.touch1 = u), (d.taps = 0)) : ((d.touch0 = u), (r = !0), (d.taps = 1 + !!t));
              t && (t = clearTimeout(t)),
                r &&
                  (d.taps < 2 &&
                    ((e = u[0]),
                    (t = setTimeout(function () {
                      t = null;
                    }, N))),
                  (0, h.interrupt)(this),
                  d.start());
            }
          }
          function Y(t, ...e) {
            if (this.__zooming) {
              var n,
                i,
                r,
                o,
                s = Z(this, e).event(t),
                a = t.changedTouches,
                u = a.length;
              for (m(t), n = 0; n < u; ++n)
                (i = a[n]),
                  (r = (0, c.Z)(i, this)),
                  s.touch0 && s.touch0[2] === i.identifier ? (s.touch0[0] = r) : s.touch1 && s.touch1[2] === i.identifier && (s.touch1[0] = r);
              if (((i = s.that.__zoom), s.touch1)) {
                var l = s.touch0[0],
                  h = s.touch0[1],
                  p = s.touch1[0],
                  d = s.touch1[1],
                  f = (f = p[0] - l[0]) * f + (f = p[1] - l[1]) * f,
                  v = (v = d[0] - h[0]) * v + (v = d[1] - h[1]) * v;
                (i = D(i, Math.sqrt(f / v))), (r = [(l[0] + p[0]) / 2, (l[1] + p[1]) / 2]), (o = [(h[0] + d[0]) / 2, (h[1] + d[1]) / 2]);
              } else {
                if (!s.touch0) return;
                (r = s.touch0[0]), (o = s.touch0[1]);
              }
              s.zoom('touch', g(H(i, r, o), s.extent, A));
            }
          }
          function F(t, ...i) {
            if (this.__zooming) {
              var o,
                s,
                a = Z(this, i).event(t),
                u = t.changedTouches,
                l = u.length;
              for (
                y(t),
                  n && clearTimeout(n),
                  n = setTimeout(function () {
                    n = null;
                  }, N),
                  o = 0;
                o < l;
                ++o
              )
                (s = u[o]), a.touch0 && a.touch0[2] === s.identifier ? delete a.touch0 : a.touch1 && a.touch1[2] === s.identifier && delete a.touch1;
              if ((a.touch1 && !a.touch0 && ((a.touch0 = a.touch1), delete a.touch1), a.touch0)) a.touch0[1] = this.__zoom.invert(a.touch0[0]);
              else if ((a.end(), 2 === a.taps && ((s = (0, c.Z)(s, this)), Math.hypot(e[0] - s[0], e[1] - s[1]) < P))) {
                var h = (0, r.Z)(this).on('dblclick.zoom');
                h && h.apply(this, arguments);
              }
            }
          }
          return (
            (q.transform = function (t, e, n, i) {
              var r = t.selection ? t.selection() : t;
              r.property('__zoom', w),
                t !== r
                  ? z(t, e, n, i)
                  : r.interrupt().each(function () {
                      Z(this, arguments)
                        .event(i)
                        .start()
                        .zoom(null, 'function' == typeof e ? e.apply(this, arguments) : e)
                        .end();
                    });
            }),
            (q.scaleBy = function (t, e, n, i) {
              q.scaleTo(
                t,
                function () {
                  var t = this.__zoom.k,
                    n = 'function' == typeof e ? e.apply(this, arguments) : e;
                  return t * n;
                },
                n,
                i
              );
            }),
            (q.scaleTo = function (t, e, n, i) {
              q.transform(
                t,
                function () {
                  var t = u.apply(this, arguments),
                    i = this.__zoom,
                    r = null == n ? L(t) : 'function' == typeof n ? n.apply(this, arguments) : n,
                    o = i.invert(r),
                    s = 'function' == typeof e ? e.apply(this, arguments) : e;
                  return g(H(D(i, s), r, o), t, A);
                },
                n,
                i
              );
            }),
            (q.translateBy = function (t, e, n, i) {
              q.transform(
                t,
                function () {
                  return g(
                    this.__zoom.translate('function' == typeof e ? e.apply(this, arguments) : e, 'function' == typeof n ? n.apply(this, arguments) : n),
                    u.apply(this, arguments),
                    A
                  );
                },
                null,
                i
              );
            }),
            (q.translateTo = function (t, e, n, i, r) {
              q.transform(
                t,
                function () {
                  var t = u.apply(this, arguments),
                    r = this.__zoom,
                    o = null == i ? L(t) : 'function' == typeof i ? i.apply(this, arguments) : i;
                  return g(
                    v
                      .translate(o[0], o[1])
                      .scale(r.k)
                      .translate('function' == typeof e ? -e.apply(this, arguments) : -e, 'function' == typeof n ? -n.apply(this, arguments) : -n),
                    t,
                    A
                  );
                },
                i,
                r
              );
            }),
            (R.prototype = {
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
                var e = (0, r.Z)(this.that).datum();
                O.call(t, this.that, new d(t, { sourceEvent: this.sourceEvent, target: q, type: t, transform: this.that.__zoom, dispatch: O }), e);
              },
            }),
            (q.wheelDelta = function (t) {
              return arguments.length ? ((I = 'function' == typeof t ? t : p(+t)), q) : I;
            }),
            (q.filter = function (t) {
              return arguments.length ? ((o = 'function' == typeof t ? t : p(!!t)), q) : o;
            }),
            (q.touchable = function (t) {
              return arguments.length ? ((k = 'function' == typeof t ? t : p(!!t)), q) : k;
            }),
            (q.extent = function (t) {
              return arguments.length
                ? ((u =
                    'function' == typeof t
                      ? t
                      : p([
                          [+t[0][0], +t[0][1]],
                          [+t[1][0], +t[1][1]],
                        ])),
                  q)
                : u;
            }),
            (q.scaleExtent = function (t) {
              return arguments.length ? ((M[0] = +t[0]), (M[1] = +t[1]), q) : [M[0], M[1]];
            }),
            (q.translateExtent = function (t) {
              return arguments.length
                ? ((A[0][0] = +t[0][0]), (A[1][0] = +t[1][0]), (A[0][1] = +t[0][1]), (A[1][1] = +t[1][1]), q)
                : [
                    [A[0][0], A[0][1]],
                    [A[1][0], A[1][1]],
                  ];
            }),
            (q.constrain = function (t) {
              return arguments.length ? ((g = t), q) : g;
            }),
            (q.duration = function (t) {
              return arguments.length ? ((T = +t), q) : T;
            }),
            (q.interpolate = function (t) {
              return arguments.length ? ((B = t), q) : B;
            }),
            (q.on = function () {
              var t = O.on.apply(O, arguments);
              return t === O ? q : t;
            }),
            (q.clickDistance = function (t) {
              return arguments.length ? ((C = (t = +t) * t), q) : Math.sqrt(C);
            }),
            (q.tapDistance = function (t) {
              return arguments.length ? ((P = +t), q) : P;
            }),
            q
          );
        }
        g.prototype = f.prototype;
      },
      655: (t, e, n) => {
        n.r(e),
          n.d(e, {
            __extends: () => r,
            __assign: () => o,
            __rest: () => s,
            __decorate: () => a,
            __param: () => u,
            __metadata: () => l,
            __awaiter: () => c,
            __generator: () => h,
            __createBinding: () => p,
            __exportStar: () => d,
            __values: () => f,
            __read: () => v,
            __spread: () => g,
            __spreadArrays: () => y,
            __spreadArray: () => m,
            __await: () => _,
            __asyncGenerator: () => b,
            __asyncDelegator: () => w,
            __asyncValues: () => S,
            __makeTemplateObject: () => x,
            __importStar: () => I,
            __importDefault: () => k,
            __classPrivateFieldGet: () => M,
            __classPrivateFieldSet: () => A,
          });
        var i = function (t, e) {
          return (
            (i =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
              }),
            i(t, e)
          );
        };
        function r(t, e) {
          if ('function' != typeof e && null !== e) throw new TypeError('Class extends value ' + String(e) + ' is not a constructor or null');
          function n() {
            this.constructor = t;
          }
          i(t, e), (t.prototype = null === e ? Object.create(e) : ((n.prototype = e.prototype), new n()));
        }
        var o = function () {
          return (
            (o =
              Object.assign ||
              function (t) {
                for (var e, n = 1, i = arguments.length; n < i; n++) for (var r in (e = arguments[n])) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
                return t;
              }),
            o.apply(this, arguments)
          );
        };
        function s(t, e) {
          var n = {};
          for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && e.indexOf(i) < 0 && (n[i] = t[i]);
          if (null != t && 'function' == typeof Object.getOwnPropertySymbols) {
            var r = 0;
            for (i = Object.getOwnPropertySymbols(t); r < i.length; r++)
              e.indexOf(i[r]) < 0 && Object.prototype.propertyIsEnumerable.call(t, i[r]) && (n[i[r]] = t[i[r]]);
          }
          return n;
        }
        function a(t, e, n, i) {
          var r,
            o = arguments.length,
            s = o < 3 ? e : null === i ? (i = Object.getOwnPropertyDescriptor(e, n)) : i;
          if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i);
          else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(e, n, s) : r(e, n)) || s);
          return o > 3 && s && Object.defineProperty(e, n, s), s;
        }
        function u(t, e) {
          return function (n, i) {
            e(n, i, t);
          };
        }
        function l(t, e) {
          if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata) return Reflect.metadata(t, e);
        }
        function c(t, e, n, i) {
          return new (n || (n = Promise))(function (r, o) {
            function s(t) {
              try {
                u(i.next(t));
              } catch (t) {
                o(t);
              }
            }
            function a(t) {
              try {
                u(i.throw(t));
              } catch (t) {
                o(t);
              }
            }
            function u(t) {
              var e;
              t.done
                ? r(t.value)
                : ((e = t.value),
                  e instanceof n
                    ? e
                    : new n(function (t) {
                        t(e);
                      })).then(s, a);
            }
            u((i = i.apply(t, e || [])).next());
          });
        }
        function h(t, e) {
          var n,
            i,
            r,
            o,
            s = {
              label: 0,
              sent: function () {
                if (1 & r[0]) throw r[1];
                return r[1];
              },
              trys: [],
              ops: [],
            };
          return (
            (o = { next: a(0), throw: a(1), return: a(2) }),
            'function' == typeof Symbol &&
              (o[Symbol.iterator] = function () {
                return this;
              }),
            o
          );
          function a(o) {
            return function (a) {
              return (function (o) {
                if (n) throw new TypeError('Generator is already executing.');
                for (; s; )
                  try {
                    if (((n = 1), i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i), 0) : i.next) && !(r = r.call(i, o[1])).done))
                      return r;
                    switch (((i = 0), r && (o = [2 & o[0], r.value]), o[0])) {
                      case 0:
                      case 1:
                        r = o;
                        break;
                      case 4:
                        return s.label++, { value: o[1], done: !1 };
                      case 5:
                        s.label++, (i = o[1]), (o = [0]);
                        continue;
                      case 7:
                        (o = s.ops.pop()), s.trys.pop();
                        continue;
                      default:
                        if (!((r = (r = s.trys).length > 0 && r[r.length - 1]) || (6 !== o[0] && 2 !== o[0]))) {
                          s = 0;
                          continue;
                        }
                        if (3 === o[0] && (!r || (o[1] > r[0] && o[1] < r[3]))) {
                          s.label = o[1];
                          break;
                        }
                        if (6 === o[0] && s.label < r[1]) {
                          (s.label = r[1]), (r = o);
                          break;
                        }
                        if (r && s.label < r[2]) {
                          (s.label = r[2]), s.ops.push(o);
                          break;
                        }
                        r[2] && s.ops.pop(), s.trys.pop();
                        continue;
                    }
                    o = e.call(t, s);
                  } catch (t) {
                    (o = [6, t]), (i = 0);
                  } finally {
                    n = r = 0;
                  }
                if (5 & o[0]) throw o[1];
                return { value: o[0] ? o[1] : void 0, done: !0 };
              })([o, a]);
            };
          }
        }
        var p = Object.create
          ? function (t, e, n, i) {
              void 0 === i && (i = n),
                Object.defineProperty(t, i, {
                  enumerable: !0,
                  get: function () {
                    return e[n];
                  },
                });
            }
          : function (t, e, n, i) {
              void 0 === i && (i = n), (t[i] = e[n]);
            };
        function d(t, e) {
          for (var n in t) 'default' === n || Object.prototype.hasOwnProperty.call(e, n) || p(e, t, n);
        }
        function f(t) {
          var e = 'function' == typeof Symbol && Symbol.iterator,
            n = e && t[e],
            i = 0;
          if (n) return n.call(t);
          if (t && 'number' == typeof t.length)
            return {
              next: function () {
                return t && i >= t.length && (t = void 0), { value: t && t[i++], done: !t };
              },
            };
          throw new TypeError(e ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
        }
        function v(t, e) {
          var n = 'function' == typeof Symbol && t[Symbol.iterator];
          if (!n) return t;
          var i,
            r,
            o = n.call(t),
            s = [];
          try {
            for (; (void 0 === e || e-- > 0) && !(i = o.next()).done; ) s.push(i.value);
          } catch (t) {
            r = { error: t };
          } finally {
            try {
              i && !i.done && (n = o.return) && n.call(o);
            } finally {
              if (r) throw r.error;
            }
          }
          return s;
        }
        function g() {
          for (var t = [], e = 0; e < arguments.length; e++) t = t.concat(v(arguments[e]));
          return t;
        }
        function y() {
          for (var t = 0, e = 0, n = arguments.length; e < n; e++) t += arguments[e].length;
          var i = Array(t),
            r = 0;
          for (e = 0; e < n; e++) for (var o = arguments[e], s = 0, a = o.length; s < a; s++, r++) i[r] = o[s];
          return i;
        }
        function m(t, e, n) {
          if (n || 2 === arguments.length)
            for (var i, r = 0, o = e.length; r < o; r++) (!i && r in e) || (i || (i = Array.prototype.slice.call(e, 0, r)), (i[r] = e[r]));
          return t.concat(i || Array.prototype.slice.call(e));
        }
        function _(t) {
          return this instanceof _ ? ((this.v = t), this) : new _(t);
        }
        function b(t, e, n) {
          if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
          var i,
            r = n.apply(t, e || []),
            o = [];
          return (
            (i = {}),
            s('next'),
            s('throw'),
            s('return'),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i
          );
          function s(t) {
            r[t] &&
              (i[t] = function (e) {
                return new Promise(function (n, i) {
                  o.push([t, e, n, i]) > 1 || a(t, e);
                });
              });
          }
          function a(t, e) {
            try {
              (n = r[t](e)).value instanceof _ ? Promise.resolve(n.value.v).then(u, l) : c(o[0][2], n);
            } catch (t) {
              c(o[0][3], t);
            }
            var n;
          }
          function u(t) {
            a('next', t);
          }
          function l(t) {
            a('throw', t);
          }
          function c(t, e) {
            t(e), o.shift(), o.length && a(o[0][0], o[0][1]);
          }
        }
        function w(t) {
          var e, n;
          return (
            (e = {}),
            i('next'),
            i('throw', function (t) {
              throw t;
            }),
            i('return'),
            (e[Symbol.iterator] = function () {
              return this;
            }),
            e
          );
          function i(i, r) {
            e[i] = t[i]
              ? function (e) {
                  return (n = !n) ? { value: _(t[i](e)), done: 'return' === i } : r ? r(e) : e;
                }
              : r;
          }
        }
        function S(t) {
          if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
          var e,
            n = t[Symbol.asyncIterator];
          return n
            ? n.call(t)
            : ((t = f(t)),
              (e = {}),
              i('next'),
              i('throw'),
              i('return'),
              (e[Symbol.asyncIterator] = function () {
                return this;
              }),
              e);
          function i(n) {
            e[n] =
              t[n] &&
              function (e) {
                return new Promise(function (i, r) {
                  !(function (t, e, n, i) {
                    Promise.resolve(i).then(function (e) {
                      t({ value: e, done: n });
                    }, e);
                  })(i, r, (e = t[n](e)).done, e.value);
                });
              };
          }
        }
        function x(t, e) {
          return Object.defineProperty ? Object.defineProperty(t, 'raw', { value: e }) : (t.raw = e), t;
        }
        var E = Object.create
          ? function (t, e) {
              Object.defineProperty(t, 'default', { enumerable: !0, value: e });
            }
          : function (t, e) {
              t.default = e;
            };
        function I(t) {
          if (t && t.__esModule) return t;
          var e = {};
          if (null != t) for (var n in t) 'default' !== n && Object.prototype.hasOwnProperty.call(t, n) && p(e, t, n);
          return E(e, t), e;
        }
        function k(t) {
          return t && t.__esModule ? t : { default: t };
        }
        function M(t, e, n, i) {
          if ('a' === n && !i) throw new TypeError('Private accessor was defined without a getter');
          if ('function' == typeof e ? t !== e || !i : !e.has(t)) throw new TypeError('Cannot read private member from an object whose class did not declare it');
          return 'm' === n ? i : 'a' === n ? i.call(t) : i ? i.value : e.get(t);
        }
        function A(t, e, n, i, r) {
          if ('m' === i) throw new TypeError('Private method is not writable');
          if ('a' === i && !r) throw new TypeError('Private accessor was defined without a setter');
          if ('function' == typeof e ? t !== e || !r : !e.has(t)) throw new TypeError('Cannot write private member to an object whose class did not declare it');
          return 'a' === i ? r.call(t, n) : r ? (r.value = n) : e.set(t, n), n;
        }
      },
    },
    a = {};
  function u(t) {
    var e = a[t];
    if (void 0 !== e) return e.exports;
    var n = (a[t] = { exports: {} });
    return s[t](n, n.exports, u), n.exports;
  }
  (u.d = (t, e) => {
    for (var n in e) u.o(e, n) && !u.o(t, n) && Object.defineProperty(t, n, { enumerable: !0, get: e[n] });
  }),
    (u.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (u.r = (t) => {
      'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(t, '__esModule', { value: !0 });
    }),
    (t = u(655)),
    (e = u(345)),
    (n = u(102)),
    (i = u(621)),
    (r = u(175)),
    (o = (function () {
      function o() {
        this.dataService = new e.DataService();
      }
      return (
        (o.prototype.render = function (e, i) {
          var o, s;
          return (0, t.__awaiter)(this, void 0, void 0, function () {
            var a, u, l, c;
            return (0, t.__generator)(this, function (t) {
              switch (t.label) {
                case 0:
                  return e && i.pdbId && i.chainId && i.entityId
                    ? ((this.options = i), (a = this), null === (o = i.apiData) || void 0 === o ? [3, 1] : ((u = o), [3, 3]))
                    : (console.log('Invalid plugin input!'), [2]);
                case 1:
                  return [4, this.dataService.getApiData(this.options.entityId, this.options.chainId, this.options.pdbId)];
                case 2:
                  (u = t.sent()), (t.label = 3);
                case 3:
                  return (a.apiData = u), (l = this), null === (s = i.FR3DData) || void 0 === s ? [3, 4] : ((c = s), [3, 6]);
                case 4:
                  return [4, this.dataService.getFR3DData(this.options.pdbId, this.options.chainId)];
                case 5:
                  (c = t.sent()), (t.label = 6);
                case 6:
                  return (
                    (l.FR3DData = c),
                    (this.targetEle = e),
                    (this.uiTemplateService = new n.UiTemplateService(this.targetEle, this.options, this.apiData)),
                    this.apiData && this.FR3DData
                      ? ((this.FR3DNestedData = this.filterNestedData(this.FR3DData)),
                        this.uiTemplateService.render(this.apiData, this.FR3DData, this.FR3DNestedData),
                        this.options.subscribeEvents && r.CustomEvents.subscribeToComponentEvents(this))
                      : this.uiTemplateService.renderError('apiError'),
                    [2]
                  );
              }
            });
          });
        }),
        (o.prototype.filterNestedData = function (t) {
          var e = Object.assign({}, t);
          return (
            (e.annotations = t.annotations.filter(function (t) {
              return '0' === t.crossing;
            })),
            e
          );
        }),
        (o.prototype.toggleResidue = function (e, n, r) {
          return (0, t.__awaiter)(this, void 0, void 0, function () {
            return (0, t.__generator)(this, function (t) {
              switch (t.label) {
                case 0:
                  return (
                    i.UiActionsService.clearSelection(this.options.pdbId, e),
                    [
                      4,
                      i.UiActionsService.toggleNucleotide(this.options.pdbId, this.options.entityId, this.options.chainId, e, 'click', !1, void 0, void 0, n, !1, r),
                    ]
                  );
                case 1:
                  return t.sent(), [2];
              }
            });
          });
        }),
        (o.prototype.selectResidue = function (e, n, r) {
          return (0, t.__awaiter)(this, void 0, void 0, function () {
            return (0, t.__generator)(this, function (t) {
              switch (t.label) {
                case 0:
                  return [
                    4,
                    i.UiActionsService.selectNucleotide(this.options.pdbId, this.options.entityId, this.options.chainId, e, 'click', !1, void 0, void 0, n, !1, r),
                  ];
                case 1:
                  return t.sent(), [2];
              }
            });
          });
        }),
        (o.prototype.selectResidueRange = function (e, n, r, o) {
          return (0, t.__awaiter)(this, void 0, void 0, function () {
            var s, a;
            return (0, t.__generator)(this, function (t) {
              switch (t.label) {
                case 0:
                  for (s = [], a = e; a <= n; a++) s.push(a);
                  return [4, i.UiActionsService.clearSelection(this.options.pdbId)];
                case 1:
                  return (
                    t.sent(),
                    [
                      4,
                      i.UiActionsService.selectNucleotide(this.options.pdbId, this.options.entityId, this.options.chainId, s, 'click', !1, r, void 0, void 0, !0, o),
                    ]
                  );
                case 2:
                  return t.sent(), [2];
              }
            });
          });
        }),
        (o.prototype.clearSelection = function (e, n) {
          return (0, t.__awaiter)(this, void 0, void 0, function () {
            return (0, t.__generator)(this, function (t) {
              switch (t.label) {
                case 0:
                  return [
                    4,
                    i.UiActionsService.unSelectNucleotide(this.options.pdbId, this.options.entityId, this.options.chainId, e, 'click', !1, void 0, void 0, n),
                  ];
                case 1:
                  return t.sent(), [2];
              }
            });
          });
        }),
        (o.prototype.highlightResidue = function (t, e, n) {
          i.UiActionsService.highlightNucleotide(this.options.pdbId, this.options.entityId, this.options.chainId, t, !1, void 0, void 0, e, n);
        }),
        (o.prototype.highlightResidueRange = function (t, e, n, r) {
          for (var o = [], s = t; s <= e; s++) o.push(s);
          i.UiActionsService.highlightNucleotide(this.options.pdbId, this.options.entityId, this.options.chainId, o, !1, void 0, void 0, n, r);
        }),
        (o.prototype.clearHighlight = function (t) {
          i.UiActionsService.unHighlightNucleotide(this.options.pdbId, this.options.entityId, this.options.chainId, void 0, !1, void 0, t);
        }),
        o
      );
    })()),
    (window.PdbRnaViewerPlugin = o);
})();
