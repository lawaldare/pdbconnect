var confAppEnv, AjaxSolr, PDBe;
!(function (e) {
  'use strict';
  function t(e, t) {
    if (a(e) && a(t)) {
      if (e.length !== t.length) return !1;
      for (var n = 0, i = e.length; n < i; n++) if (e[n] !== t[n]) return !1;
      return !0;
    }
    return o(e) && r(t) ? t.match(e) : o(t) && r(e) ? e.match(t) : e === t;
  }
  function a(e) {
    return null != e && 'object' == typeof e && 'splice' in e && 'join' in e;
  }
  function o(e) {
    return null != e && ('object' == typeof e || 'function' == typeof e) && 'ignoreCase' in e;
  }
  function r(e) {
    return null != e && 'string' == typeof e;
  }
  (e.extend = function (e, t, a) {
    var o = Array.prototype.slice.call(arguments, 1),
      r = function (t) {
        if (t) for (var a in t) e[a] = t[a];
      };
    if (null != o) {
      if (Array.prototype.forEach && o.forEach === Array.prototype.forEach) o.forEach(r);
      else if (o.length === +o.length) for (var n = 0, i = o.length; n < i; n++) r.call(void 0, o[n], n, o);
      else for (var s in o) Object.prototype.hasOwnProperty.call(o, s) && r.call(void 0, o[s], s, o);
      return e;
    }
  }),
    (e.inArray = function (e, a) {
      if (a) for (var o = 0, r = a.length; o < r; o++) if (t(a[o], e)) return o;
      return -1;
    }),
    (e.equals = t),
    (e.isArray = a),
    (e.isRegExp = o),
    (e.isString = r),
    (e.createManagerStore = function (t) {
      for (var a = {}, o = 0, r = t.length; o < r; o++) {
        var n = t[o];
        for (var i in ((a[n.managerDetails.name] = new e.Manager(n.managerDetails)), n.managerParams))
          a[n.managerDetails.name].store.addByValue(i, n.managerParams[i]);
      }
      return a;
    });
})(AjaxSolr || (AjaxSolr = {})),
  (function (e) {
    e.defaultParameterArgs = { name: null, value: null, locals: {} };
    var t = (function () {
      function t(t) {
        e.extend(this, this, t);
      }
      return (
        (t.prototype.val = function (e) {
          if (void 0 === e) return this.value;
          this.value = e;
        }),
        (t.prototype.local = function (e, t) {
          if (void 0 === t) return this.locals[e];
          this.locals[e] = t;
        }),
        (t.prototype.remove = function (e) {
          delete this.locals[e];
        }),
        (t.prototype.string = function () {
          var e = [];
          for (var t in this.locals) this.locals[t] && e.push(t + '=' + encodeURIComponent(this.locals[t]));
          var a = e.length ? '{!' + e.join('%20') + '}' : '';
          return this.value || 0 == this.value
            ? this.name + '=' + a + this.valueString(this.value)
            : 'q' == this.name && a
              ? 'q.alt=' + a + encodeURIComponent('*:*')
              : '';
        }),
        (t.prototype.parseString = function (e) {
          var t = e.match(/^([^=]+)=(?:\{!([^\}]*)\})?(.*)$/);
          if (t) {
            for (var a; (a = /([^\s=]+)=(\S*)/g.exec(decodeURIComponent(t[2]))); ) (this.locals[a[1]] = decodeURIComponent(a[2])), (t[2] = t[2].replace(a[0], ''));
            'q.alt' == t[1] ? (this.name = 'q') : ((this.name = t[1]), (this.value = this.parseValueString(t[3])));
          }
        }),
        (t.prototype.valueString = function (t) {
          return (t = e.isArray(t) ? t.join(',') : t), encodeURIComponent(t);
        }),
        (t.prototype.parseValueString = function (e) {
          return -1 == (e = decodeURIComponent(e)).indexOf(',') ? e : e.split(',');
        }),
        t
      );
    })();
    e.Parameter = t;
  })(AjaxSolr || (AjaxSolr = {})),
  (function (e) {
    'use strict';
    var t = (function () {
      function t(t) {
        (this.params = {}), e.extend(this, this, t);
      }
      return (
        (t.prototype.isMultiple = function (e) {
          return e.match(
            /^(?:bf|bq|facet\.date|facet\.date\.other|facet\.date\.include|facet\.field|facet\.pivot|facet\.range|facet\.range\.other|facet\.range\.include|facet\.query|fq|group\.field|group\.func|group\.query|pf|qf)$/
          );
        }),
        (t.prototype.get = function (t) {
          if (void 0 === this.params[t]) {
            var a = new e.Parameter({ name: t });
            this.params[t] = this.isMultiple(t) ? [a] : a;
          }
          return this.params[t];
        }),
        (t.prototype.values = function (e) {
          if (void 0 !== this.params[e]) {
            if (this.isMultiple(e)) {
              for (var t = [], a = 0, o = this.params[e].length; a < o; a++) t.push(this.params[e][a].val());
              return t;
            }
            return [this.params[e].val()];
          }
          return [];
        }),
        (t.prototype.add = function (t, a) {
          if ((void 0 === a && (a = new e.Parameter({ name: t })), this.isMultiple(t)))
            if (void 0 === this.params[t]) this.params[t] = [a];
            else {
              if (-1 != e.inArray(a.val(), this.values(t))) return !1;
              this.params[t].push(a);
            }
          else this.params[t] = a;
          return a;
        }),
        (t.prototype.remove = function (e, t) {
          void 0 === t ? delete this.params[e] : (this.params[e].splice(t, 1), 0 == this.params[e].length && delete this.params[e]);
        }),
        (t.prototype.find = function (t, a) {
          if (void 0 !== this.params[t]) {
            if (this.isMultiple(t)) {
              for (var o = [], r = 0, n = this.params[t].length; r < n; r++) e.equals(this.params[t][r].val(), a) && o.push(r);
              return !!o.length && o;
            }
            if (e.equals(this.params[t].val(), a)) return t;
          }
          return !1;
        }),
        (t.prototype.addByValue = function (t, a, o) {
          if ((void 0 === o && (o = {}), this.isMultiple(t) && e.isArray(a))) {
            for (var r = [], n = 0, i = a.length; n < i; n++) r.push(this.add(t, new e.Parameter({ name: t, value: a[n], locals: o })));
            return r;
          }
          return this.add(t, new e.Parameter({ name: t, value: a, locals: o }));
        }),
        (t.prototype.removeByValue = function (t, a) {
          var o = this.find(t, a);
          if (o)
            if (e.isArray(o)) for (var r = o.length - 1; r >= 0; r--) this.remove(t, o[r]);
            else this.remove(o);
          return o;
        }),
        (t.prototype.string = function () {
          var e,
            t = [];
          for (var a in this.params)
            if (this.isMultiple(a)) for (var o = 0, r = this.params[a].length; o < r; o++) (e = this.params[a][o].string()) && t.push(e);
            else (e = this.params[a].string()) && t.push(e);
          return t.join('&');
        }),
        (t.prototype.parseString = function (t) {
          for (var a = t.split('&'), o = 0, r = a.length; o < r; o++)
            if (a[o]) {
              var n = new e.Parameter();
              n.parseString(a[o]), this.add(n.name, n);
            }
        }),
        (t.prototype.exposedString = function () {
          for (var e, t = [], a = 0, o = this.exposed.length; a < o; a++)
            if (void 0 !== this.params[this.exposed[a]])
              if (this.isMultiple(this.exposed[a]))
                for (var r = 0, n = this.params[this.exposed[a]].length; r < n; r++) (e = this.params[this.exposed[a]][r].string()) && t.push(e);
              else (e = this.params[this.exposed[a]].string()) && t.push(e);
          return t.join('&');
        }),
        (t.prototype.exposedReset = function () {
          for (var e = 0, t = this.exposed.length; e < t; e++) this.remove(this.exposed[e]);
        }),
        (t.prototype.load = function (e) {
          void 0 === e && (e = !0), e && this.exposedReset(), this.parseString(this.storedString());
        }),
        (t.prototype.storedString = function () {
          return '';
        }),
        t
      );
    })();
    e.ParameterStore = t;
  })(AjaxSolr || (AjaxSolr = {})),
  (function (e) {
    'use strict';
    var t = (function () {
      function t(t) {
        (this.name = 'solrManager'),
          (this.solrUrl = { normal: 'http://localhost:8983/solr/', latest: 'http://localhost:8983/solr/' }),
          (this.servlet = 'select'),
          e.extend(this, this, t),
          this.setStore(this.store);
      }
      return (
        (t.prototype.setStore = function (t) {
          this.store = t || new e.ParameterStore();
        }),
        (t.prototype.doRequest = function (e, t) {
          void 0 !== e && this.store.get('start').val(e), void 0 === t && (t = this.servlet), this.executeRequest(t);
        }),
        (t.prototype.executeRequest = function (e, t) {
          (t = t || this.store.string()), console.log(this.solrUrl + e + '?' + t + '&wt=json');
        }),
        (t.prototype.handleResponse = function (e) {
          this.response = e;
        }),
        (t.prototype.handleError = function (e) {
          window.console && console.log && console.log(e);
        }),
        t
      );
    })();
    e.Manager = t;
  })(AjaxSolr || (AjaxSolr = {})),
  'undefined' == typeof confAppEnv &&
    (confAppEnv = new RegExp('wwwdev').test(window.location.href) ? 'dev' : new RegExp('wwwint').test(window.location.href) ? 'int' : ''),
  (function (e) {
    (e.SolrApp || (e.SolrApp = {})).managerConfig = [
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'cofactorClassFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['cofactor_class'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'latestPdbEntriesFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['latest_pdb_entry_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'newUnpFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['new_unp'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'newLigandsFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['new_ligand'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'revisedLigandsFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['revised_ligand'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'expMethodFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['experimental_method'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'entryAuthorFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['entry_authors'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'allAuthorFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['all_authors'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'pfamFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['pfam_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'superkingdomFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['superkingdom'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'genusFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['genus'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'orgNameFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['organism_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'orgSciNameFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['organism_scientific_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'citationYearFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['citation_year'],
          'f.citation_year.facet.range.start': '1970',
          'f.citation_year.facet.range.end': '2050',
          'f.citation_year.facet.range.gap': '5',
          'f.citation_year.facet.range.other': 'between',
          'f.citation_year.facet.range.include': 'upper',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'spacegroupFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['spacegroup'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'biologicalProcessFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['biological_process'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'biologicalFunctionFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['biological_function'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'bioCellComponentFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['biological_cell_component'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'bioCellComponentFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['biological_cell_component'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'journalFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['journal'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'assemblyCompositionFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['assembly_composition'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'assemblyFormFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['assembly_form'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'assemblyTypeFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['assembly_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'refSoftFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['refinement_software'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'detectorFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['detector'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'detectorTypeFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['detector_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'diffProtocolFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['diffraction_protocol'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'moleNameFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['all_molecule_names'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'statusFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['status'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'ecNumberFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['enzyme_num_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'cathClassFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['cath_class'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'cathTopologyFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['cath_topology'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'geneNameFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['gene_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'interproNameFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['interpro_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'scopClassFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['scop_class'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'scopFamilyFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['scop_family'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'scopFoldFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['scop_fold'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'citAuthorsFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['citation_authors'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'interactingMolFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['interacting_molecules'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'interactingLigandsFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['interacting_ligands'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'molTypeFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['molecule_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'beamSrcNameFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['beam_source_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'diffSourceFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['diffraction_source_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'emMicroscopeModelFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['em_microscope_model'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'emDetectorNameFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['em_electron_detection'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'pfamFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['pfam'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'rfamFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['rfam'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'synchrotronSiteFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['synchrotron_site'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'depYearFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['deposition_year'],
          'f.deposition_year.facet.range.start': '1970',
          'f.deposition_year.facet.range.end': '2050',
          'f.deposition_year.facet.range.gap': '5',
          'f.deposition_year.facet.range.other': 'between',
          'f.deposition_year.facet.range.include': 'upper',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'relYearFacetsManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['release_year'],
          'f.release_year.facet.range.start': '1970',
          'f.release_year.facet.range.end': '2050',
          'f.release_year.facet.range.gap': '5',
          'f.release_year.facet.range.other': 'between',
          'f.release_year.facet.range.include': 'all',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'resolutionFacetsManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['resolution'],
          'f.resolution.facet.range.start': '0.0',
          'f.resolution.facet.range.end': '100',
          'f.resolution.facet.range.gap': '0.5',
          'f.resolution.facet.range.other': 'between',
          'f.resolution.facet.range.include': 'upper',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'nmrSoftwareFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['nmr_software_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'nmrFieldStrengthFacetManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['nmr_field_strength'],
          'f.nmr_field_strength.facet.range.start': '0',
          'f.nmr_field_strength.facet.range.end': '1500',
          'f.nmr_field_strength.facet.range.gap': '100',
          'f.nmr_field_strength.facet.range.other': 'between',
          'f.nmr_field_strength.facet.range.include': 'all',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'entriesManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          rows: 100,
          'json.nl': 'map',
          fl: [
            'pdb_id',
            'citation_title',
            'citation_authors',
            'title',
            'experimental_method',
            'entry_authors',
            'pubmed_id',
            'citation_year',
            'journal',
            'organism_scientific_name',
            'assembly_composition',
            'interacting_ligands',
            'tax_id',
            'resolution',
            'status',
            'release_date',
            'prefered_assembly_id',
            'entry_author_list',
            'entry_organism_scientific_name',
            'data_quality',
            'model_quality',
            'experiment_data_available',
            'deposition_date',
            'release_year',
            'molecule_type',
            'pfam_name',
            'uniprot_coverage',
            'compound_id',
            'bound_compound_id',
            'modified_compound_id',
            'uniprot_accession_best',
            'carb_compound_id_entity',
            'entry_uniprot_accession',
            'preferred_complex_id',
            'preferred_complex_name',
          ],
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'macroMoleculesManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'facet.pivot': 'molecule_name,inv_overall_quality,entry_entity',
          'facet.pivot.mincount': 1,
          'facet.sort': 'overall_quality+asc',
          'facet.field': 'molecule_name',
          facet: !0,
          'f.molecule_name.facet.limit': 100,
          'f.molecule_name.facet.offset': 0,
          rows: 0,
          'facet.limit': 2e4,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'macroMoleculesTotalManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'facet.field': 'molecule_name',
          facet: !0,
          rows: 0,
          'facet.limit': 1e5,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
          'group.facet': !0,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'pivotEntriesManager' },
        managerParams: {
          group: !0,
          'group.facet': !0,
          'group.ngroups': !0,
          'group.field': ['entry_entity'],
          fl: [
            'pdb_id',
            'citation_title',
            'citation_authors',
            'title',
            'experimental_method',
            'entry_authors',
            'pubmed_id',
            'citation_year',
            'journal',
            'organism_scientific_name',
            'assembly_composition',
            'interacting_ligands',
            'tax_id',
            'resolution',
            'status',
            'release_date',
            'prefered_assembly_id',
            'entry_author_list',
            'entry_organism_scientific_name',
            'pfam_accession',
            'data_quality',
            'model_quality',
            'experiment_data_available',
            'deposition_date',
            'release_year',
            'molecule_type',
            'pfam_name',
            'uniprot_coverage',
            'compound_id',
            'bound_compound_id',
            'modified_compound_id',
            'uniprot_accession_best',
            'carb_compound_id_entity',
            'entry_uniprot_accession',
            'preferred_complex_id',
            'preferred_complex_name',
          ],
          rows: 1e4,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'compoundsManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'facet.pivot': 'interacting_ligands,molecule_name,inv_overall_quality,entry_entity',
          'facet.pivot.mincount': 1,
          'facet.sort': 'overall_quality+asc',
          'facet.field': 'interacting_ligands',
          facet: !0,
          'f.interacting_ligands.facet.limit': 100,
          'f.interacting_ligands.facet.offset': 0,
          rows: 0,
          'facet.limit': 2e4,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'compoundsTotalManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'facet.field': 'interacting_ligands',
          facet: !0,
          rows: 0,
          'facet.limit': 1e5,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
          'group.facet': !0,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'compoundsForLatestChemManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'facet.pivot': 'new_revised_ligand,molecule_name,inv_overall_quality,entry_entity',
          'facet.pivot.mincount': 1,
          'facet.sort': 'overall_quality+asc',
          'facet.field': 'new_revised_ligand',
          facet: !0,
          'f.new_revised_ligand.facet.limit': 100,
          'f.new_revised_ligand.facet.offset': 0,
          rows: 0,
          'facet.limit': 2e4,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'compoundsForLatestChemTotalManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'facet.field': 'new_revised_ligand',
          facet: !0,
          rows: 0,
          'facet.limit': 1e5,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
          'group.facet': !0,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'proteinFamiliesManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'facet.pivot': 'pfam_name,molecule_name,inv_overall_quality,entry_entity',
          'facet.pivot.mincount': 1,
          'facet.sort': 'overall_quality+asc',
          'facet.field': 'pfam_name',
          facet: !0,
          'f.pfam_name.facet.limit': 100,
          'f.pfam_name.facet.offset': 0,
          rows: 0,
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'proteinFamiliesTotalManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'facet.field': 'pfam_name',
          facet: !0,
          rows: 0,
          'facet.limit': 1e5,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
          'group.facet': !0,
        },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'validationAndPrintsManager' },
        managerParams: { group: !0, 'group.field': ['pdb_id'], 'group.ngroups': !0, fl: ['pdb_id', 'data_quality', 'model_quality', 'experiment_data_available'] },
      },
      {
        managerDetails: { solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/', name: 'facetsManager' },
        managerParams: {
          q: '*:*',
          group: !0,
          'group.field': ['pdb_id'],
          'group.ngroups': !0,
          'group.facet': !0,
          facet: !0,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': [
            'experimental_method',
            'entry_authors',
            'pfam_name',
            'superkingdom',
            'genus',
            'organism_scientific_name',
            'spacegroup',
            'biological_process',
            'biological_function',
            'biological_cell_component',
            'journal',
            'assembly_composition',
            'assembly_form',
            'assembly_type',
            'refinement_software',
            'detector',
            'detector_type',
            'diffraction_protocol',
            'all_molecule_names',
            'status',
            'ec_number',
            'cath_class',
            'cath_topology',
            'gene_name',
            'interpro_name',
            'scop_class',
            'scop_family',
            'scop_fold',
            'citation_authors',
            'interacting_molecules',
            'interacting_ligands',
            'molecule_type',
            'beam_source_name',
            'synchrotron_site',
          ],
          'facet.range': ['deposition_year', 'release_year', 'resolution'],
          'f.deposition_year.facet.range.start': '1970',
          'f.deposition_year.facet.range.end': '2050',
          'f.deposition_year.facet.range.gap': '5',
          'f.release_year.facet.range.start': '1970',
          'f.release_year.facet.range.end': '2050',
          'f.release_year.facet.range.gap': '5',
          'f.resolution.facet.range.start': '0.0',
          'f.resolution.facet.range.end': '100',
          'f.resolution.facet.range.gap': '0.5',
          'f.deposition_year.facet.range.other': 'between',
          'f.deposition_year.facet.range.include': 'upper',
          'f.release_year.facet.range.other': 'between',
          'f.release_year.facet.range.include': 'upper',
          'f.resolution.facet.range.other': 'between',
          'f.resolution.facet.range.include': 'upper',
          'facet.threads': -1,
        },
      },
    ];
  })(PDBe || (PDBe = {})),
  (function (e) {
    !(function (e) {
      (e.fieldGroups = [
        'Text',
        'Latest',
        'Sequence search',
        'Entry Information',
        'Experimental Information',
        'Author Names',
        'Citation',
        'Macromolecules',
        'Enzyme Information',
        'Assembly Information',
        'Source Organism',
        'Expression host',
        'Compound',
        'Diffraction Experiment Details',
        'Diffraction radiation source',
        'Diffraction Detector',
        'EM Experimental information',
        'EM image processing and reconstruction',
        'EM microscope',
        'EM Detector',
        'EM grid',
        'Diffraction Software',
        'NMR',
        'Biological Classification (Gene Ontology)',
        'Sequence classification',
        'Structure classification',
        'Nucleic acid conf features',
        'Crystallographic cell parameters',
        'Crystallisation pH / reservoir',
        'Representative Structures',
        'IDs',
      ]),
        (e.searchFields = {
          text: { label: 'Text', type: 'string', groupingIndex: 0 },
          q_title: {
            label: 'Title',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 0,
            exampleText: 'NMR solution structure of oxytocin',
            descText: 'Title of the PDB entry',
          },
          q_latest_pdb_entry_type: { label: 'Entries released this week', type: 'string', value: ['revised', 'new'], groupingIndex: 1 },
          q_fasta_sequence: {
            label: 'FASTA sequence search',
            queryField: 'xjoin_fasta=true&bf=fasta(percentIdentity)&xjoin_fasta.external.expupperlim=0.1&xjoin_fasta.external.sequence',
            type: 'largeString',
            valueType: 'fastaSequence',
            fqValue: '{!xjoin}xjoin_fasta',
            appendValueToParams: !0,
            appendValueToFq: !1,
            groupingIndex: 2,
          },
          q_phmmer_sequence: {
            label: 'Phmmer sequence search',
            queryField: 'xjoin_phmmer.fl=*&xjoin_phmmer=true&xjoin_phmmer.external.sequence',
            type: 'largeString',
            valueType: 'phmmerSequence',
            fqValue: '{!xjoin}xjoin_phmmer',
            appendValueToParams: !0,
            appendValueToFq: !1,
            groupingIndex: 2,
            exampleText: 'ADKSDLGYTGLTDEQAQELHSVYMSGLWLFSAVAIVAHLAVYIWRPWF',
          },
          q_experimental_method: {
            label: 'Experimental method',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 3,
            exampleText: 'Solution NMR',
            descText: 'The experimental method used to determine the structure',
          },
          q_status: {
            label: 'Entry status',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 3,
            relation: 'Equal to',
            exampleText: 'HPUB / REL / WDRN',
            descText: 'Status of a PDB entry',
          },
          q_release_date: {
            label: 'Release date',
            type: 'date',
            format: 'YYYY-MM-DDThh:mm:ssZ',
            groupingIndex: 3,
            exampleText: '4/20/2013',
            descText: 'The release date of the entry',
          },
          q_deposition_date: {
            label: 'Deposition date',
            type: 'date',
            format: 'YYYY-MM-DDThh:mm:ssZ',
            groupingIndex: 3,
            exampleText: '4/20/2012',
            descText: 'The date of initial deposition',
          },
          q_model_quality: {
            label: 'Model quality',
            type: 'float',
            groupingIndex: 3,
            exampleText: '70',
            descText: 'Percentile quality score for model geometry, relative to the whole PDB archive. From 0-100 with 100 being the best',
          },
          q_data_quality: {
            label: 'Data quality',
            type: 'float',
            groupingIndex: 3,
            exampleText: '70',
            descText: 'Percentile quality score for fit of the model to data, relative to the whole PDB archive. From 0-100 with 100 being the best',
          },
          q_experiment_data_available: {
            label: 'Experiment data available',
            type: 'string',
            value: ['y', 'n'],
            groupingIndex: 3,
            valueType: 'yn',
            exampleText: 'y',
            descText: 'Indicates whether experimental data has been deposited to support the model',
          },
          q_resolution: {
            label: 'Resolution',
            alias: ['em_resolution'],
            type: 'float',
            groupingIndex: 4,
            exampleText: '1.4',
            descText: 'The stated resolution of the data (in \xc5ngstr\xf6ms)',
          },
          q_all_authors: {
            label: 'All authors',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 5,
            exampleText: 'smith jb',
            descText: 'Name of an author of the PDB entry or the citation',
          },
          q_entry_authors: {
            label: 'Entry authors',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 5,
            exampleText: 'smith jb',
            descText: 'Name of an author of the PDB entry',
          },
          q_citation_authors: {
            label: 'Citation authors',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 5,
            exampleText: 'smith jb',
            descText: 'Name of an author of the citation',
          },
          q_journal: {
            label: 'Journal',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 6,
            exampleText: 'j. biol. chem.',
            descText: 'Abbreviated name of the cited journal',
          },
          q_citation_title: {
            label: 'Citation title',
            type: 'string',
            groupingIndex: 6,
            exampleText: 'Exploring hydrophobic sites in proteins',
            descText: 'The title of the citation',
          },
          q_citation_year: { label: 'Citation year', type: 'int', groupingIndex: 6, exampleText: '2014', descText: 'The year of the citation' },
          q_pubmed_id: {
            label: 'PubMed ID',
            type: 'string',
            groupingIndex: 6,
            exampleText: '14096470',
            descText: 'Ascession number used by PubMed to identify the citation',
          },
          q_citation_doi: {
            label: 'Citation DOI',
            type: 'string',
            groupingIndex: 6,
            exampleText: '10.1093/nar/gkv1501',
            descText: 'Digital Object Identifier for the citation',
          },
          q_all_molecule_names: {
            label: 'Molecule name',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 7,
            exampleText: 'Carbonic anhydrase 2',
            descText: 'Name of a macromolecule',
          },
          q_molecule_type: {
            label: 'Molecule type',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 7,
            exampleText: 'Protein / RNA',
            descText: 'The polymer type of the macromolecule',
          },
          q_interacting_molecules: { label: 'Interacting Molecules', type: 'string', autocomplete: !0, groupingIndex: 7 },
          q_sample_preparation_method: {
            label: 'Molecule expression method',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 7,
            exampleText: 'engineered / natural / synthetic',
            descText: 'The method by which the macromolecule was produced',
          },
          q_gene_name: {
            label: 'Gene name',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 7,
            exampleText: 'PhoQ',
            descText: 'Name of the gene encoding the macromolecule',
          },
          q_entity_weight: {
            label: 'Macromolecule molecular weight',
            type: 'float',
            groupingIndex: 7,
            exampleText: '43397',
            descText: 'Molecular mass of the macromolecule (in Daltons)',
          },
          q_chimera: {
            label: 'Chimera',
            type: 'string',
            value: ['y', 'n'],
            groupingIndex: 7,
            valueType: 'yn',
            exampleText: 'y',
            descText: 'Does an entity contain multiple macromolecules engineered into a single chain?',
          },
          q_microheterogeneity: {
            label: 'Microheterogeneity',
            type: 'string',
            value: ['y', 'n'],
            groupingIndex: 7,
            valueType: 'yn',
            exampleText: 'y',
            descText: 'Cases where two different residues are observed at the same position in a polymer chain',
          },
          q_mutation_type: {
            label: 'Mutation type',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 7,
            exampleText: 'engineered mutation',
            descText: 'Description of a discrepancy between the protein sequence and reference database',
          },
          q_interacting_ligands: {
            label: 'Interacting ligands',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 7,
            exampleText: 'HEM',
            descText: 'Ligands that interact with the macromolecule in the search',
          },
          q_all_enzyme_names: {
            label: 'Enzyme name',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 8,
            exampleText: 'alcohol dehydrogenase',
            descText: 'Name of an enzyme',
          },
          q_enzyme_num_name: { label: 'EC number / name', type: 'string', autocomplete: !0, groupingIndex: 8, descText: 'Enzyme Commission (EC) number or name' },
          q_assembly_composition: {
            label: 'Assembly composition',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 9,
            exampleText: 'DNA/protein complex',
            descText: 'Macromolecule types that form an assembly',
          },
          q_assembly_form: {
            label: 'Assembly form',
            type: 'string',
            value: ['homo', 'hetero'],
            groupingIndex: 9,
            exampleText: 'homo / hetero',
            descText: 'Defines whether an assembly is formed from one identical macromolecule, or from different macromolecules',
          },
          q_assembly_type: {
            label: 'Assembly polymer count',
            label2: '-mer',
            type: 'int',
            submitFilter: 'processAssemblyType',
            groupingIndex: 9,
            exampleText: '6',
            descText: 'Number of polymeric chains present in a given assembly',
          },
          q_complex_name: { label: 'Complex name', type: 'string', autocomplete: !0, groupingIndex: 9, exampleText: 'HipBA toxin-antitoxin complex' },
          q_complex_id: { label: 'PDBe Complex ID', type: 'string', groupingIndex: 9, exampleText: 'PDB-CPX-100487' },
          q_assembly_mol_wt: {
            label: 'Molecular weight (Preferred Assembly)',
            type: 'float',
            groupingIndex: 9,
            exampleText: '65.688',
            descText: 'Molecular weight (Preferred Assembly) in kDA',
          },
          q_all_assembly_mol_wt: {
            label: 'Molecular weight (All Assemblies)',
            type: 'float',
            groupingIndex: 9,
            exampleText: '65.688',
            descText: 'Molecular weight (All Assemblies) in kDA',
          },
          q_organism_name: {
            label: 'Organism name',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 10,
            exampleText: 'Homo sapiens',
            descText: 'Species name of the source organism for the macromolecule',
          },
          q_genus: {
            label: 'Organism genus',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 10,
            exampleText: 'Bacillus',
            descText: 'Genus of the organism in which the macromolecule was expressed',
          },
          q_superkingdom: {
            label: 'Organism superkingdom',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 10,
            exampleText: 'eukaryota',
            descText: 'Superkingdom of the organism in which the macromolecule was expressed',
          },
          q_expression_organism_name: {
            label: 'Expression host name',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 11,
            exampleText: 'Trichoplusia ni',
            descText: 'Species name of the organism in which the macromolecule was expressed',
          },
          q_expression_host_superkingdom: {
            label: 'Expression host superkingdom',
            type: 'string',
            groupingIndex: 11,
            exampleText: 'eukaryota',
            descText: 'Superkingdom of the organism in which the macromolecule was expressed',
          },
          q_compound_id: {
            label: 'Compound three letter code',
            type: 'string',
            groupingIndex: 12,
            exampleText: 'GOL',
            descText: 'Code identifier of a chemical compound',
          },
          q_all_compound_names: {
            label: 'Compound name',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 12,
            exampleText: 'Glycerol',
            descText: 'Chemical or common name of a chemical compound',
          },
          q_compound_weight: {
            label: 'Compound molecular weight',
            type: 'float',
            groupingIndex: 12,
            exampleText: '427',
            descText: 'Molecular mass of the compound (in Daltons)',
          },
          q_cofactor_class: {
            label: 'Compound cofactor class',
            type: 'string',
            groupingIndex: 12,
            value: [
              'adenosylcobalamin',
              'ascorbic acid',
              'biotin',
              'biopterin',
              'coenzyme a',
              'coenzyme b',
              'coenzyme m',
              'flavin adenine dinucleotide',
              'flavin mononucleotide',
              'factor f430',
              'glutathione',
              'heme',
              'lipoic acid',
              'molybdopterin',
              'nicotinamide-adenine dinucleotide',
              "pyridoxal 5'-phosphate",
              'pyrroloquinoline quinone',
              's-adenosylmethionine',
              'tetrahydrofolic acid',
              'thiamine diphosphate',
              'ubiquinone',
            ],
            exampleText: 'Thiamine diphosphate',
            descText: 'The cofactor class that a bound compound belongs to',
          },
          q_structure_determination_method: {
            label: 'Phasing method',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 13,
            exampleText: 'Molecular replacement ',
            descText: 'Method(s) used to determine the phases for a diffraction experiment',
          },
          q_diffraction_protocol: {
            label: 'Diffraction protocol',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 13,
            exampleText: 'Single wavelength',
            descText: 'Protocol for a diffraction experiment',
          },
          q_diffraction_wavelengths: { label: 'Diffraction wavelength', type: 'float', groupingIndex: 15, exampleText: '1.5418', descText: 'Diffraction wavelength' },
          q_beam_source_name: {
            label: 'Diffraction radiation source type',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 14,
            exampleText: 'synchrotron',
            descText: 'Type of radiation source used in the diffraction experiment',
          },
          q_diffraction_source_type: {
            label: 'Diffraction source',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 14,
            exampleText: 'ESRF beamline MASSIF-1',
            descText: 'The name of the radiation source',
          },
          q_synchrotron_site: {
            label: 'Synchrotron site',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 14,
            exampleText: 'Diamond',
            descText: 'Name of the synchrotron at which the data were collected',
          },
          q_detector: {
            label: 'Diffraction  Detector type',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 15,
            exampleText: 'Image plate',
            descText: 'The general type of radiation detector',
          },
          q_detector_type: {
            label: 'Detector name',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 15,
            exampleText: 'PSI PILATUS 6M',
            descText: 'The make, model or name of the detector device used',
          },
          q_em_imaging_cryogen: {
            label: 'EM imaging cryogen',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 16,
            exampleText: 'Nitrogen',
            descText: 'Cryogen type used to maintain the specimen stage temperature during imaging in the microscope',
          },
          q_em_resolution: {
            label: 'EM resolution',
            type: 'float',
            groupingIndex: 17,
            exampleText: '6.8',
            descText: 'The stated resolution of the 3D reconstruction (in \xc5ngstr\xf6ms)',
          },
          q_em_resolution_method: {
            label: 'EM resolution method',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 17,
            exampleText: 'FSC 0.143 cut-off',
            descText: 'The method used to determine the resolution of the 3D reconstruction',
          },
          q_em_reconstruction_method: {
            label: 'EM reconstruction method',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 17,
            exampleText: 'Single particle',
            descText: 'The reconstruction method used in the EM experiment',
          },
          q_em_symmetry_type: {
            label: 'EM symmetry type',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 17,
            exampleText: 'point',
            descText: 'The single particle symmetry type',
          },
          q_em_nominal_pixel_size: {
            label: 'EM nominal pixel size',
            type: 'float',
            groupingIndex: 17,
            exampleText: '1.54',
            descText: 'The nominal pixel size, in \xc5ngstr\xf6m, of the projection set of images',
          },
          q_em_actual_pixel_size: {
            label: 'EM actual pixel size',
            type: 'float',
            groupingIndex: 17,
            exampleText: '1.57',
            descText: 'The actual pixel size, in \xc5ngstr\xf6m, of projection set of images',
          },
          q_em_num_particles_picked: {
            label: 'EM number particles picked',
            type: 'int',
            groupingIndex: 17,
            exampleText: '124864',
            descText: 'The number of particles (2D projections) or 3D subtomograms used in the 3D reconstruction',
          },
          q_em_model_refinement_software: {
            label: 'EM model refinement software',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 17,
            exampleText: 'REFMAC',
            descText: 'The name of the software package used for model refinement',
          },
          q_em_classification_software: {
            label: 'EM classification software',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 17,
            exampleText: 'RELION',
            descText: 'The name of the software package used for classification',
          },
          q_em_reconstruction_software: {
            label: 'EM reconstruction software',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 17,
            exampleText: 'SPIDER',
            descText: 'The name of the software package used for reconstruction',
          },
          q_em_microscope_model: {
            label: 'EM microscope model',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 18,
            exampleText: 'FEI Titan Krios',
            descText: 'The make or model of the microscope',
          },
          q_em_electron_source: {
            label: 'EM electron source',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 18,
            exampleText: 'Field emission gun',
            descText: 'The source of electrons (the electron gun)',
          },
          q_em_accelerating_voltage: {
            label: 'EM accelerating voltage',
            type: 'int',
            groupingIndex: 18,
            exampleText: '300',
            descText: 'A value of accelerating voltage used for imaging (in kV)',
          },
          q_em_illumination_mode: {
            label: 'EM illumination mode',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 18,
            exampleText: 'Flood beam',
            descText: 'The mode of illumination',
          },
          q_em_c2_aperture_diameter: {
            label: 'EM C2 aperture diameter',
            type: 'float',
            groupingIndex: 18,
            exampleText: '70',
            descText: 'C2 lens aperture diameter, in mm',
          },
          q_em_imaging_date: {
            label: 'EM imaging date',
            type: 'date',
            format: 'YYYY-MM-DDThh:mm:ssZ',
            groupingIndex: 18,
            exampleText: '4/20/2016',
            descText: 'Date of imaging experiment or the date at which a series of experiments began',
          },
          q_em_electron_detection: {
            label: 'EM detector name',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 19,
            exampleText: 'GATAN K2 Quantum (4k x 4k)',
            descText: 'The detector type used for recording images',
          },
          q_em_detector_mode: {
            label: 'EM detector mode',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 19,
            exampleText: 'Counting',
            descText: 'The detector mode used during image recording',
          },
          q_em_imaging_mode: {
            label: 'EM imaging mode',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 19,
            exampleText: 'BRIGHT FIELD',
            descText: 'The mode of imaging',
          },
          q_em_energyfilter_name: {
            label: 'EM energy filter',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 19,
            exampleText: 'GIF Quantum LS',
            descText: 'The type of energy filter spectrometer',
          },
          q_em_grid_material: {
            label: 'EM grid material',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 20,
            exampleText: 'Copper',
            descText: 'The name of the material from which the grid is made',
          },
          em_grid_mesh_size: {
            label: 'EM grid size',
            type: 'int',
            groupingIndex: 20,
            exampleText: '300',
            descText: 'The value of the mesh size of the em grid (in divisions per inch)',
          },
          q_em_grid_type: {
            label: 'EM grid type',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 20,
            exampleText: 'Quantifoil R1.2/1.3',
            descText: 'A description of the grid type',
          },
          q_em_sample_support_details: {
            label: 'EM sample support details',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 20,
            exampleText: 'Coated with gold',
            descText: 'Any additional details concerning the sample support',
          },
          q_data_reduction_software: {
            label: 'Reduction software',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 21,
            exampleText: 'XDS',
            descText: 'Software used to reduce the data',
          },
          q_data_scaling_software: {
            label: 'Scaling software',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 21,
            exampleText: 'Scalepack',
            descText: 'Software used to scale the data',
          },
          q_refinement_software: {
            label: 'Refinement software',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 21,
            exampleText: 'Phenix',
            descText: 'Software used to refine the model',
          },
          q_structure_solution_software: {
            label: 'Structure solution software',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 21,
            exampleText: 'Phaser',
            descText: 'Software used for phasing',
          },
          q_nmr_spectrometer_manufacturer: { label: 'NMR Spectrometer Manufacturer', type: 'string', autocomplete: !0, groupingIndex: 22, exampleText: 'Bruker' },
          q_nmr_spectrometer_model: { label: 'NMR Spectrometer Model', type: 'string', autocomplete: !0, groupingIndex: 22, exampleText: 'AVANCE III' },
          q_nmr_field_strength: { label: 'NMR Field Strength', type: 'int', groupingIndex: 22, exampleText: '800' },
          q_nmr_software_name: { label: 'NMR software packages', type: 'string', autocomplete: !0, groupingIndex: 22 },
          q_nmr_tot_conformers_calc: { label: 'Total Calculated Conformers', type: 'int', groupingIndex: 22, exampleText: '100' },
          q_nmr_tot_conformers_deposited: { label: 'Total Deposited Conformers', type: 'int', groupingIndex: 22, exampleText: '20' },
          q_biological_cell_component: {
            label: 'Biological cell component',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 23,
            exampleText: 'Cytoplasm',
            descText: 'Location occupied by a macromolecular machine when it carries out a molecular function, as assigned by Gene Ontology (GO)',
          },
          q_biological_function: {
            label: 'Biological function',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 23,
            exampleText: 'transporter activity',
            descText: 'Describes activities that occur at the molecular level as assigned by Gene Ontology (GO)',
          },
          q_biological_process: {
            label: 'Biological process',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 23,
            exampleText: 'tricarboxylic acid cycle',
            descText:
              'A biological process term describes a series of events accomplished by one or more organized assemblies of molecular functions, as assigned by Gene Ontology (GO)',
          },
          q_all_sequence_family: {
            label: 'Sequence family',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 24,
            descText: 'The unique identifier for any of Rfam, Pfam or Interpro databases',
          },
          q_interpro_accession: {
            label: 'Interpro accession',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 24,
            exampleText: 'ipr013783 / immunoglobulin-like fold',
            descText: 'The unique identifier of protein families in the Interpro database',
          },
          q_pfam: {
            label: 'Pfam accession / name',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 24,
            exampleText: 'PF00089 / trypsin',
            descText: 'The unique identifier of protein families in the Pfam database',
          },
          q_rfam: {
            label: 'Rfam accession / id',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 24,
            exampleText: 'RF00005 / tRNA',
            descText: 'The unique identifier of RNA families in the Rfam database',
          },
          q_uniprot: {
            label: 'Uniprot accession / id',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 24,
            exampleText: 'P01308 / ins_human',
            descText: 'The unique identifier of a protein sequence in the UniProt database',
          },
          q_uniprot_features: {
            label: 'Uniprot features',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 24,
            exampleText: 'kinase activation loop',
            descText: 'Sequence annotations describing regions or sites of interest in the protein sequence in the UniProt database',
          },
          q_scop_fold: {
            label: 'SCOP fold',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 25,
            exampleText: 'sh3-like barrel',
            descText: 'The different shapes of domains within a class',
          },
          q_scop_family: { label: 'SCOP family', type: 'string', autocomplete: !0, groupingIndex: 25, exampleText: 'sh3-domain' },
          q_scop_superfamily: { label: 'SCOP superfamily', type: 'string', autocomplete: !0, groupingIndex: 25, exampleText: 'sh3-domain' },
          q_cath_architecture: {
            label: 'CATH architecture',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 25,
            exampleText: 'alpha horseshoe',
            descText: 'General arrangement of the secondary structures assigned by the CATH database',
          },
          q_cath_class: {
            label: 'CATH class',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 25,
            exampleText: 'mainly beta',
            descText: 'The overall secondary-structure content of the domain assigned by the CATH database',
          },
          q_cath_code: {
            label: 'CATH code',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 25,
            exampleText: '1.10.510.10',
            descText: 'Code assigned by the CATH database to a protein fold',
          },
          q_cath_homologous_superfamily: {
            label: 'CATH Homologous superfamily',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 25,
            exampleText: 'sh3 domains',
            descText: 'Domains that are believed to be related by a common ancestor assigned by the CATH database',
          },
          q_cath_topology: {
            label: 'CATH topology',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 25,
            exampleText: 'sh3 type barrels',
            descText: 'Overall fold assigned by the CATH database',
          },
          q_na_conf_features: {
            label: 'Nucleic acid conf features',
            type: 'string',
            value: [
              'b-form double helix',
              'quadruple helix',
              'double helix',
              'bulge loop',
              'parallel strands',
              'z-form double helix',
              'a-form double helix',
              'mismatched base pair',
              'hairpin loop',
              'internal loop',
              'tetraloop',
              'triple helix',
              'three-way junction',
              'four-way junction',
            ],
            groupingIndex: 26,
            exampleText: 'hairpin loop',
            descText: 'Nucleic acid secondary structure feature',
          },
          q_spacegroup: {
            label: 'Spacegroup',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 27,
            exampleText: 'P 21 21 21',
            descText: 'Hermann-Mauguin space-group symbol',
          },
          q_cell_a: { label: 'Cell a', type: 'float', groupingIndex: 27, exampleText: '99.691', descText: 'Unit-cell length a in \xc5ngstr\xf6m' },
          q_cell_b: { label: 'Cell b', type: 'float', groupingIndex: 27, exampleText: '', descText: 'Unit-cell length a in \xc5ngstr\xf6m' },
          q_cell_c: { label: 'Cell c', type: 'float', groupingIndex: 27, exampleText: '99.691', descText: 'Unit-cell length a in \xc5ngstr\xf6m' },
          q_cell_alpha: { label: 'Cell alpha', type: 'float', groupingIndex: 27, exampleText: '90', descText: 'Unit-cell angle alpha in degrees' },
          q_cell_beta: { label: 'Cell beta', type: 'float', groupingIndex: 27, exampleText: '90', descText: 'Unit-cell angle alpha in degrees' },
          q_cell_gamma: { label: 'Cell gamma', type: 'float', groupingIndex: 27, exampleText: '90', descText: 'Unit-cell angle alpha in degrees' },
          q_crystallisation_ph: {
            label: 'Crystallisation pH',
            type: 'float',
            groupingIndex: 28,
            exampleText: '7.6',
            descText: 'The pH at which the crystal was grown',
          },
          q_crystallisation_cond: { label: 'Crystallisation Reservoir solution', type: 'string', autocomplete: !0, groupingIndex: 28 },
          q_crystallisation_method: {
            label: 'Crystallisation growth method',
            type: 'string',
            autocomplete: !0,
            groupingIndex: 28,
            descText: 'The method used to grow the crystals',
          },
          q_crystallisation_temperature: {
            label: 'Crystallisation temperature',
            type: 'int',
            groupingIndex: 28,
            exampleText: '277',
            descText: 'The temperature in kelvins at which the crystal was grown',
          },
          q_seq_100_cluster_number: {
            label: 'Representative Structures',
            type: 'string',
            value: ['100%', '95%', '90%', '70%', '50%', '40%', '30%'],
            groupingIndex: 29,
          },
          q_pdb_id: { label: 'PDB ID', type: 'string', groupingIndex: 30, exampleText: '1cbs' },
          q_bmrb_id: { label: 'BMRB ID', type: 'string', groupingIndex: 30 },
          q_emdb_id: { label: 'EMDB ID', type: 'string', groupingIndex: 30, exampleText: 'emd-1234' },
          q_go_id: { label: 'GO ID', type: 'string', groupingIndex: 30 },
          q_go_mapping: { label: 'GO Mapping', type: 'string', autocomplete: !0, groupingIndex: 30 },
          q_psi_id: { label: 'PSI ID', type: 'string', groupingIndex: 30 },
        });
    })(e.SolrApp || (e.SolrApp = {}));
  })(PDBe || (PDBe = {})),
  (function (e) {
    'use strict';
    function t(e, t) {
      if (a(e) && a(t)) {
        if (e.length !== t.length) return !1;
        for (var n = 0, i = e.length; n < i; n++) if (e[n] !== t[n]) return !1;
        return !0;
      }
      return o(e) && r(t) ? t.match(e) : o(t) && r(e) ? e.match(t) : e === t;
    }
    function a(e) {
      return null != e && 'object' == typeof e && 'splice' in e && 'join' in e;
    }
    function o(e) {
      return null != e && ('object' == typeof e || 'function' == typeof e) && 'ignoreCase' in e;
    }
    function r(e) {
      return null != e && 'string' == typeof e;
    }
    (e.extend = function (e, t, a) {
      var o = Array.prototype.slice.call(arguments, 1),
        r = function (t) {
          if (t) for (var a in t) e[a] = t[a];
        };
      if (null != o) {
        if (Array.prototype.forEach && o.forEach === Array.prototype.forEach) o.forEach(r);
        else if (o.length === +o.length) for (var n = 0, i = o.length; n < i; n++) r.call(void 0, o[n], n, o);
        else for (var s in o) Object.prototype.hasOwnProperty.call(o, s) && r.call(void 0, o[s], s, o);
        return e;
      }
    }),
      (e.inArray = function (e, a) {
        if (a) for (var o = 0, r = a.length; o < r; o++) if (t(a[o], e)) return o;
        return -1;
      }),
      (e.equals = t),
      (e.isArray = a),
      (e.isRegExp = o),
      (e.isString = r),
      (e.createManagerStore = function (t) {
        for (var a = {}, o = 0, r = t.length; o < r; o++) {
          var n = t[o];
          for (var i in ((a[n.managerDetails.name] = new e.Manager(n.managerDetails)), n.managerParams))
            a[n.managerDetails.name].store.addByValue(i, n.managerParams[i]);
        }
        return a;
      });
  })(AjaxSolr || (AjaxSolr = {})),
  (function (e) {
    'use strict';
    var t = (function () {
      function t(t) {
        (this.name = 'solrManager'),
          (this.solrUrl = { normal: 'http://localhost:8983/solr/', latest: 'http://localhost:8983/solr/' }),
          (this.servlet = 'select'),
          e.extend(this, this, t),
          this.setStore(this.store);
      }
      return (
        (t.prototype.setStore = function (t) {
          this.store = t || new e.ParameterStore();
        }),
        (t.prototype.doRequest = function (e, t) {
          void 0 !== e && this.store.get('start').val(e), void 0 === t && (t = this.servlet), this.executeRequest(t);
        }),
        (t.prototype.executeRequest = function (e, t) {
          (t = t || this.store.string()), console.log(this.solrUrl + e + '?' + t + '&wt=json');
        }),
        (t.prototype.handleResponse = function (e) {
          this.response = e;
        }),
        (t.prototype.handleError = function (e) {
          window.console && console.log && console.log(e);
        }),
        t
      );
    })();
    e.Manager = t;
  })(AjaxSolr || (AjaxSolr = {})),
  (function (e) {
    'use strict';
    var t = (function () {
      function t(t) {
        (this.params = {}), e.extend(this, this, t);
      }
      return (
        (t.prototype.isMultiple = function (e) {
          return e.match(
            /^(?:bf|bq|facet\.date|facet\.date\.other|facet\.date\.include|facet\.field|facet\.pivot|facet\.range|facet\.range\.other|facet\.range\.include|facet\.query|fq|group\.field|group\.func|group\.query|pf|qf)$/
          );
        }),
        (t.prototype.get = function (t) {
          if (void 0 === this.params[t]) {
            var a = new e.Parameter({ name: t });
            this.params[t] = this.isMultiple(t) ? [a] : a;
          }
          return this.params[t];
        }),
        (t.prototype.values = function (e) {
          if (void 0 !== this.params[e]) {
            if (this.isMultiple(e)) {
              for (var t = [], a = 0, o = this.params[e].length; a < o; a++) t.push(this.params[e][a].val());
              return t;
            }
            return [this.params[e].val()];
          }
          return [];
        }),
        (t.prototype.add = function (t, a) {
          if ((void 0 === a && (a = new e.Parameter({ name: t })), this.isMultiple(t)))
            if (void 0 === this.params[t]) this.params[t] = [a];
            else {
              if (-1 != e.inArray(a.val(), this.values(t))) return !1;
              this.params[t].push(a);
            }
          else this.params[t] = a;
          return a;
        }),
        (t.prototype.remove = function (e, t) {
          void 0 === t ? delete this.params[e] : (this.params[e].splice(t, 1), 0 == this.params[e].length && delete this.params[e]);
        }),
        (t.prototype.find = function (t, a) {
          if (void 0 !== this.params[t]) {
            if (this.isMultiple(t)) {
              for (var o = [], r = 0, n = this.params[t].length; r < n; r++) e.equals(this.params[t][r].val(), a) && o.push(r);
              return !!o.length && o;
            }
            if (e.equals(this.params[t].val(), a)) return t;
          }
          return !1;
        }),
        (t.prototype.addByValue = function (t, a, o) {
          if ((void 0 === o && (o = {}), this.isMultiple(t) && e.isArray(a))) {
            for (var r = [], n = 0, i = a.length; n < i; n++) r.push(this.add(t, new e.Parameter({ name: t, value: a[n], locals: o })));
            return r;
          }
          return this.add(t, new e.Parameter({ name: t, value: a, locals: o }));
        }),
        (t.prototype.removeByValue = function (t, a) {
          var o = this.find(t, a);
          if (o)
            if (e.isArray(o)) for (var r = o.length - 1; r >= 0; r--) this.remove(t, o[r]);
            else this.remove(o);
          return o;
        }),
        (t.prototype.string = function () {
          var e,
            t = [];
          for (var a in this.params)
            if (this.isMultiple(a)) for (var o = 0, r = this.params[a].length; o < r; o++) (e = this.params[a][o].string()) && t.push(e);
            else (e = this.params[a].string()) && t.push(e);
          return t.join('&');
        }),
        (t.prototype.parseString = function (t) {
          for (var a = t.split('&'), o = 0, r = a.length; o < r; o++)
            if (a[o]) {
              var n = new e.Parameter();
              n.parseString(a[o]), this.add(n.name, n);
            }
        }),
        (t.prototype.exposedString = function () {
          for (var e, t = [], a = 0, o = this.exposed.length; a < o; a++)
            if (void 0 !== this.params[this.exposed[a]])
              if (this.isMultiple(this.exposed[a]))
                for (var r = 0, n = this.params[this.exposed[a]].length; r < n; r++) (e = this.params[this.exposed[a]][r].string()) && t.push(e);
              else (e = this.params[this.exposed[a]].string()) && t.push(e);
          return t.join('&');
        }),
        (t.prototype.exposedReset = function () {
          for (var e = 0, t = this.exposed.length; e < t; e++) this.remove(this.exposed[e]);
        }),
        (t.prototype.load = function (e) {
          void 0 === e && (e = !0), e && this.exposedReset(), this.parseString(this.storedString());
        }),
        (t.prototype.storedString = function () {
          return '';
        }),
        t
      );
    })();
    e.ParameterStore = t;
  })(AjaxSolr || (AjaxSolr = {})),
  (function (e) {
    e.defaultParameterArgs = { name: null, value: null, locals: {} };
    var t = (function () {
      function t(t) {
        e.extend(this, this, t);
      }
      return (
        (t.prototype.val = function (e) {
          if (void 0 === e) return this.value;
          this.value = e;
        }),
        (t.prototype.local = function (e, t) {
          if (void 0 === t) return this.locals[e];
          this.locals[e] = t;
        }),
        (t.prototype.remove = function (e) {
          delete this.locals[e];
        }),
        (t.prototype.string = function () {
          var e = [];
          for (var t in this.locals) this.locals[t] && e.push(t + '=' + encodeURIComponent(this.locals[t]));
          var a = e.length ? '{!' + e.join('%20') + '}' : '';
          return this.value || 0 == this.value
            ? this.name + '=' + a + this.valueString(this.value)
            : 'q' == this.name && a
              ? 'q.alt=' + a + encodeURIComponent('*:*')
              : '';
        }),
        (t.prototype.parseString = function (e) {
          var t = e.match(/^([^=]+)=(?:\{!([^\}]*)\})?(.*)$/);
          if (t) {
            for (var a; (a = /([^\s=]+)=(\S*)/g.exec(decodeURIComponent(t[2]))); ) (this.locals[a[1]] = decodeURIComponent(a[2])), (t[2] = t[2].replace(a[0], ''));
            'q.alt' == t[1] ? (this.name = 'q') : ((this.name = t[1]), (this.value = this.parseValueString(t[3])));
          }
        }),
        (t.prototype.valueString = function (t) {
          return (t = e.isArray(t) ? t.join(',') : t), encodeURIComponent(t);
        }),
        (t.prototype.parseValueString = function (e) {
          return -1 == (e = decodeURIComponent(e)).indexOf(',') ? e : e.split(',');
        }),
        t
      );
    })();
    e.Parameter = t;
  })(AjaxSolr || (AjaxSolr = {})),
  (function (e) {
    var t;
    ((t = e.SolrApp || (e.SolrApp = {})).escapeValue = function (e) {
      if (window.location.href.indexOf('text:') < 0) {
        if (e.match(/[ :\/"]/) && !e.match(/[\[\{]\S+ TO \S+[\]\}]/) && !e.match(/^["\(].*["\)]$/)) return '"' + e.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
      } else if (e.match(/[:\/"]/) && !e.match(/[\[\{]\S+ TO \S+[\]\}]/) && !e.match(/^["\(].*["\)]$/))
        return '"' + e.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
      return e;
    }),
      (t.appManagers = AjaxSolr.createManagerStore(e.SolrApp.managerConfig));
  })(PDBe || (PDBe = {}));
