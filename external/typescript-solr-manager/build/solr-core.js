var AjaxSolr;
(function (AjaxSolr) {
    "use strict";
    /**
     * Consider replacing this function by ES6 Object.assign
     * @see https://github.com/documentcloud/underscore/blob/7342e289aa9d91c5aacfb3662ea56e7a6d081200/underscore.js#L789
    */
    function extend(child, param1, param2) {
        // From _.extend
        var obj = Array.prototype.slice.call(arguments, 1);
        // From _.extend
        var iterator = function (source) {
            if (source) {
                for (var prop in source) {
                    child[prop] = source[prop];
                }
            }
        };
        // From _.each
        if (obj == null)
            return;
        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(iterator);
        }
        else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                iterator.call(undefined, obj[i], i, obj);
            }
        }
        else {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    iterator.call(undefined, obj[key], key, obj);
                }
            }
        }
        return child;
    }
    AjaxSolr.extend = extend;
    ;
    /**
     * @param value A value.
     * @param array An array.
     * @returns {Boolean} Whether value exists in the array.
     */
    function inArray(value, array) {
        if (array) {
            for (var i = 0, l = array.length; i < l; i++) {
                if (equals(array[i], value)) {
                    return i;
                }
            }
        }
        return -1;
    }
    AjaxSolr.inArray = inArray;
    ;
    /**
     * @static
     * @param foo A value.
     * @param bar A value.
     * @returns {Boolean} Whether the two given values are equal.
     */
    function equals(foo, bar) {
        if (isArray(foo) && isArray(bar)) {
            if (foo.length !== bar.length) {
                return false;
            }
            for (var i = 0, l = foo.length; i < l; i++) {
                if (foo[i] !== bar[i]) {
                    return false;
                }
            }
            return true;
        }
        else if (isRegExp(foo) && isString(bar)) {
            return bar.match(foo);
        }
        else if (isRegExp(bar) && isString(foo)) {
            return foo.match(bar);
        }
        else {
            return foo === bar;
        }
    }
    AjaxSolr.equals = equals;
    ;
    /**
     * Can't use toString.call(obj) === "[object Array]", as it may return
     * "[xpconnect wrapped native prototype]", which is undesirable.
     *
     * @static
     * @see http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
     * @see http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.3/prototype.js
     */
    function isArray(obj) {
        return obj != null && typeof obj == 'object' && 'splice' in obj && 'join' in obj;
    }
    AjaxSolr.isArray = isArray;
    ;
    /**
     * @param obj Any object.
     * @returns {Boolean} Whether the object is a RegExp object.
     */
    function isRegExp(obj) {
        return obj != null && (typeof obj == 'object' || typeof obj == 'function') && 'ignoreCase' in obj;
    }
    AjaxSolr.isRegExp = isRegExp;
    ;
    /**
     * @param obj Any object.
     * @returns {Boolean} Whether the object is a String object.
     */
    function isString(obj) {
        return obj != null && typeof obj == 'string';
    }
    AjaxSolr.isString = isString;
    ;
    /**
     * @param obj Any object.
     * @returns {Boolean} Whether the object is a String object.
     */
    function createManagerStore(managerJsonArr) {
        var store = {};
        for (var i = 0, len = managerJsonArr.length; i < len; i++) {
            var managerConfigData = managerJsonArr[i];
            //create manager instance
            store[managerConfigData.managerDetails.name] = new AjaxSolr.Manager(managerConfigData.managerDetails);
            //add params to the store
            for (var paramName in managerConfigData.managerParams) {
                store[managerConfigData.managerDetails.name].store.addByValue(paramName, managerConfigData.managerParams[paramName]);
            }
        }
        return store;
    }
    AjaxSolr.createManagerStore = createManagerStore;
    ;
})(AjaxSolr || (AjaxSolr = {}));
var AjaxSolr;
(function (AjaxSolr) {
    AjaxSolr.defaultParameterArgs = {
        name: null,
        value: null,
        locals: {}
    };
    /**
     * Represents a Solr parameter.
     *
     * @param properties A map of fields to set. Refer to the list of public fields.
     * @class Parameter
     */
    var Parameter = (function () {
        function Parameter(attributes) {
            AjaxSolr.extend(this, this, attributes);
        }
        /**
         * Returns the value. If called with an argument, sets the value.
         *
         * @param {String|Number|String[]|Number[]} [value] The value to set.
         * @returns The value.
         */
        Parameter.prototype.val = function (value) {
            if (value === undefined) {
                return this.value;
            }
            else {
                this.value = value;
            }
        };
        /**
         * Returns the value of a local parameter. If called with a second argument,
         * sets the value of a local parameter.
         *
         * @param {String} name The name of the local parameter.
         * @param {String|Number|String[]|Number[]} [value] The value to set.
         * @returns The value.
         */
        Parameter.prototype.local = function (name, value) {
            if (value === undefined) {
                return this.locals[name];
            }
            else {
                this.locals[name] = value;
            }
        };
        /**
         * Deletes a local parameter.
         *
         * @param {String} name The name of the local parameter.
         */
        Parameter.prototype.remove = function (name) {
            delete this.locals[name];
        };
        /**
         * Returns the Solr parameter as a query string key-value pair.
         *
         * <p>IE6 calls the default toString() if you write <tt>store.toString()
         * </tt>. So, we need to choose another name for toString().</p>
         */
        Parameter.prototype.string = function () {
            var pairs = [];
            for (var name in this.locals) {
                if (this.locals[name]) {
                    pairs.push(name + '=' + encodeURIComponent(this.locals[name]));
                }
            }
            var prefix = pairs.length ? '{!' + pairs.join('%20') + '}' : '';
            if (this.value || this.value == 0) {
                return this.name + '=' + prefix + this.valueString(this.value);
            }
            else if (this.name == 'q' && prefix) {
                return 'q.alt=' + prefix + encodeURIComponent('*:*');
            }
            else {
                return '';
            }
        };
        /**
         * Parses a string formed by calling string().
         *
         * @param {String} str The string to parse.
         */
        Parameter.prototype.parseString = function (str) {
            var param = str.match(/^([^=]+)=(?:\{!([^\}]*)\})?(.*)$/);
            if (param) {
                var matches;
                while (matches = /([^\s=]+)=(\S*)/g.exec(decodeURIComponent(param[2]))) {
                    this.locals[matches[1]] = decodeURIComponent(matches[2]);
                    param[2] = param[2].replace(matches[0], ''); // Safari's exec seems not to do this on its own
                }
                if (param[1] == 'q.alt') {
                    this.name = 'q';
                    // if q.alt is present, assume it is because q was empty, as above
                }
                else {
                    this.name = param[1];
                    this.value = this.parseValueString(param[3]);
                }
            }
        };
        /**
         * Returns the value as a URL-encoded string.
         *
         * @private
         * @param {String|Number|String[]|Number[]} value The value.
         * @returns {String} The URL-encoded string.
         */
        Parameter.prototype.valueString = function (value) {
            value = AjaxSolr.isArray(value) ? value.join(',') : value;
            return encodeURIComponent(value);
        };
        /**
         * Parses a URL-encoded string to return the value.
         *
         * @private
         * @param {String} str The URL-encoded string.
         * @returns {Array} The value.
         */
        Parameter.prototype.parseValueString = function (str) {
            str = decodeURIComponent(str);
            return str.indexOf(',') == -1 ? str : str.split(',');
        };
        return Parameter;
    }());
    AjaxSolr.Parameter = Parameter;
})(AjaxSolr || (AjaxSolr = {}));
var AjaxSolr;
(function (AjaxSolr) {
    "use strict";
    // export const defaultParameterStoreArgs: ParameterStoreAttributes = {
    //     exposed: [],
    //     params: {}
    // }
    /**
     * The ParameterStore, as its name suggests, stores Solr parameters. Widgets
     * expose some of these parameters to the user. Whenever the user changes the
     * values of these parameters, the state of the application changes. In order to
     * allow the user to move back and forth between these states with the browser's
     * Back and Forward buttons, and to bookmark these states, each state needs to
     * be stored. The easiest method is to store the exposed parameters in the URL
     * hash (see the <tt>ParameterHashStore</tt> class). However, you may implement
     * your own storage method by extending this class.
     *
     * <p>For a list of possible parameters, please consult the links below.</p>
     *
     * @see http://wiki.apache.org/solr/CoreQueryParameters
     * @see http://wiki.apache.org/solr/CommonQueryParameters
     * @see http://wiki.apache.org/solr/SimpleFacetParameters
     * @see http://wiki.apache.org/solr/HighlightingParameters
     * @see http://wiki.apache.org/solr/MoreLikeThis
     * @see http://wiki.apache.org/solr/SpellCheckComponent
     * @see http://wiki.apache.org/solr/StatsComponent
     * @see http://wiki.apache.org/solr/TermsComponent
     * @see http://wiki.apache.org/solr/TermVectorComponent
     * @see http://wiki.apache.org/solr/LocalParams
     *
     * @param properties A map of fields to set. Refer to the list of public fields.
     * @class ParameterStore
     */
    var ParameterStore = (function () {
        function ParameterStore(attributes) {
            this.params = {};
            AjaxSolr.extend(this, this, attributes);
        }
        /**
         * Some Solr parameters may be specified multiple times. It is easiest to
         * hard-code a list of such parameters. You may change the list by passing
         * <code>{ multiple: /pattern/ }</code> as an argument to the constructor of
         * this class or one of its children, e.g.:
         *
         * <p><code>new ParameterStore({ multiple: /pattern/ })</code>
         *
         * @param {String} name The name of the parameter.
         * @returns {Boolean} Whether the parameter may be specified multiple times.
         * @see http://lucene.apache.org/solr/api/org/apache/solr/handler/DisMaxRequestHandler.html
         */
        ParameterStore.prototype.isMultiple = function (name) {
            return name.match(/^(?:bf|bq|facet\.date|facet\.date\.other|facet\.date\.include|facet\.field|facet\.pivot|facet\.range|facet\.range\.other|facet\.range\.include|facet\.query|fq|group\.field|group\.func|group\.query|pf|qf)$/);
        };
        /**
         * Returns a parameter. If the parameter doesn't exist, creates it.
         *
         * @param {String} name The name of the parameter.
         * @returns {AjaxSolr.Parameter|AjaxSolr.Parameter[]} The parameter.
         */
        ParameterStore.prototype.get = function (name) {
            if (this.params[name] === undefined) {
                var param = new AjaxSolr.Parameter({ name: name });
                if (this.isMultiple(name)) {
                    this.params[name] = [param];
                }
                else {
                    this.params[name] = param;
                }
            }
            return this.params[name];
        };
        /**
         * If the parameter may be specified multiple times, returns the values of
         * all identically-named parameters. If the parameter may be specified only
         * once, returns the value of that parameter.
         *
         * @param {String} name The name of the parameter.
         * @returns {String[]|Number[]} The value(s) of the parameter.
         */
        ParameterStore.prototype.values = function (name) {
            if (this.params[name] !== undefined) {
                if (this.isMultiple(name)) {
                    var values = [];
                    for (var i = 0, l = this.params[name].length; i < l; i++) {
                        values.push(this.params[name][i].val());
                    }
                    return values;
                }
                else {
                    return [this.params[name].val()];
                }
            }
            return [];
        };
        /**
         * If the parameter may be specified multiple times, adds the given parameter
         * to the list of identically-named parameters, unless one already exists with
         * the same value. If it may be specified only once, replaces the parameter.
         *
         * @param {String} name The name of the parameter.
         * @param {AjaxSolr.Parameter} [param] The parameter.
         * @returns {AjaxSolr.Parameter|Boolean} The parameter, or false.
         */
        ParameterStore.prototype.add = function (name, param) {
            if (param === undefined) {
                param = new AjaxSolr.Parameter({ name: name });
            }
            if (this.isMultiple(name)) {
                if (this.params[name] === undefined) {
                    this.params[name] = [param];
                }
                else {
                    if (AjaxSolr.inArray(param.val(), this.values(name)) == -1) {
                        this.params[name].push(param);
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                this.params[name] = param;
            }
            return param;
        };
        /**
         * Deletes a parameter.
         *
         * @param {String} name The name of the parameter.
         * @param {Number} [index] The index of the parameter.
         */
        ParameterStore.prototype.remove = function (name, index) {
            if (index === undefined) {
                delete this.params[name];
            }
            else {
                this.params[name].splice(index, 1);
                if (this.params[name].length == 0) {
                    delete this.params[name];
                }
            }
        };
        /**
         * Finds all parameters with matching values.
         *
         * @param {String} name The name of the parameter.
         * @param {String|Number|String[]|Number[]|RegExp} value The value.
         * @returns {String|Number[]} The indices of the parameters found.
         */
        ParameterStore.prototype.find = function (name, value) {
            if (this.params[name] !== undefined) {
                if (this.isMultiple(name)) {
                    var indices = [];
                    for (var i = 0, l = this.params[name].length; i < l; i++) {
                        if (AjaxSolr.equals(this.params[name][i].val(), value)) {
                            indices.push(i);
                        }
                    }
                    return indices.length ? indices : false;
                }
                else {
                    if (AjaxSolr.equals(this.params[name].val(), value)) {
                        return name;
                    }
                }
            }
            return false;
        };
        /**
         * If the parameter may be specified multiple times, creates a parameter using
         * the given name and value, and adds it to the list of identically-named
         * parameters, unless one already exists with the same value. If it may be
         * specified only once, replaces the parameter.
         *
         * @param {String} name The name of the parameter.
         * @param {String|Number|String[]|Number[]} value The value.
         * @param {Object} [locals] The parameter's local parameters.
         * @returns {AjaxSolr.Parameter|Boolean} The parameter, or false.
         */
        ParameterStore.prototype.addByValue = function (name, value, locals) {
            if (locals === undefined) {
                locals = {};
            }
            if (this.isMultiple(name) && AjaxSolr.isArray(value)) {
                var ret = [];
                for (var i = 0, l = value.length; i < l; i++) {
                    ret.push(this.add(name, new AjaxSolr.Parameter({ name: name, value: value[i], locals: locals })));
                }
                return ret;
            }
            else {
                return this.add(name, new AjaxSolr.Parameter({ name: name, value: value, locals: locals }));
            }
        };
        /**
         * Deletes any parameter with a matching value.
         *
         * @param {String} name The name of the parameter.
         * @param {String|Number|String[]|Number[]|RegExp} value The value.
         * @returns {String|Number[]} The indices deleted.
         */
        ParameterStore.prototype.removeByValue = function (name, value) {
            var indices = this.find(name, value);
            if (indices) {
                if (AjaxSolr.isArray(indices)) {
                    for (var i = indices.length - 1; i >= 0; i--) {
                        this.remove(name, indices[i]);
                    }
                }
                else {
                    this.remove(indices);
                }
            }
            return indices;
        };
        /**
         * Returns the Solr parameters as a query string.
         *
         * <p>IE6 calls the default toString() if you write <tt>store.toString()
         * </tt>. So, we need to choose another name for toString().</p>
         */
        ParameterStore.prototype.string = function () {
            var params = [], string;
            for (var name in this.params) {
                if (this.isMultiple(name)) {
                    for (var i = 0, l = this.params[name].length; i < l; i++) {
                        string = this.params[name][i].string();
                        if (string) {
                            params.push(string);
                        }
                    }
                }
                else {
                    string = this.params[name].string();
                    if (string) {
                        params.push(string);
                    }
                }
            }
            return params.join('&');
        };
        /**
         * Parses a query string into Solr parameters.
         *
         * @param {String} str The string to parse.
         */
        ParameterStore.prototype.parseString = function (str) {
            var pairs = str.split('&');
            for (var i = 0, l = pairs.length; i < l; i++) {
                if (pairs[i]) {
                    var param = new AjaxSolr.Parameter();
                    param.parseString(pairs[i]);
                    this.add(param.name, param);
                }
            }
        };
        /**
         * Returns the exposed parameters as a query string.
         *
         * @returns {String} A string representation of the exposed parameters.
         */
        ParameterStore.prototype.exposedString = function () {
            var params = [], string;
            for (var i = 0, l = this.exposed.length; i < l; i++) {
                if (this.params[this.exposed[i]] !== undefined) {
                    if (this.isMultiple(this.exposed[i])) {
                        for (var j = 0, m = this.params[this.exposed[i]].length; j < m; j++) {
                            string = this.params[this.exposed[i]][j].string();
                            if (string) {
                                params.push(string);
                            }
                        }
                    }
                    else {
                        string = this.params[this.exposed[i]].string();
                        if (string) {
                            params.push(string);
                        }
                    }
                }
            }
            return params.join('&');
        };
        /**
         * Resets the values of the exposed parameters.
         */
        ParameterStore.prototype.exposedReset = function () {
            for (var i = 0, l = this.exposed.length; i < l; i++) {
                this.remove(this.exposed[i]);
            }
        };
        /**
         * Loads the values of exposed parameters from persistent storage. It is
         * necessary, in most cases, to reset the values of exposed parameters before
         * setting the parameters to the values in storage. This is to ensure that a
         * parameter whose name is not present in storage is properly reset.
         *
         * @param {Boolean} [reset=true] Whether to reset the exposed parameters.
         *   before loading new values from persistent storage. Default: true.
         */
        ParameterStore.prototype.load = function (reset) {
            if (reset === undefined) {
                reset = true;
            }
            if (reset) {
                this.exposedReset();
            }
            this.parseString(this.storedString());
        };
        /**
         * An abstract hook for child implementations.
         *
         * <p>Returns the string to parse from persistent storage.</p>
         *
         * @returns {String} The string from persistent storage.
         */
        ParameterStore.prototype.storedString = function () {
            return '';
        };
        return ParameterStore;
    }());
    AjaxSolr.ParameterStore = ParameterStore;
})(AjaxSolr || (AjaxSolr = {}));
var AjaxSolr;
(function (AjaxSolr) {
    "use strict";
    /**
     * The Manager acts as the controller in a Model-View-Controller framework. All
     * public calls should be performed on the manager object.
     *
     * @param properties A map of fields to set. Refer to the list of public fields.
     * @class Manager
     */
    var Manager = (function () {
        /**
         * @param {Object} [attributes]
         * @param {String} [attributes.solrUrl] The fully-qualified URL of the Solr
         *   application. You must include the trailing slash. Do not include the path
         *   to any Solr servlet. Defaults to "http://localhost:8983/solr/"
         * @param {String} [attributes.proxyUrl] If we want to proxy queries through a
         *   script, rather than send queries to Solr directly, set this field to the
         *   fully-qualified URL of the script.
         * @param {String} [attributes.servlet] The default Solr servlet. You may
         *   prepend the servlet with a core if using multiple cores. Defaults to
         *   "servlet".
         */
        function Manager(attributes) {
            this.name = 'solrManager';
            this.solrUrl = { 'normal': 'http://localhost:8983/solr/', 'latest': 'http://localhost:8983/solr/' };
            this.servlet = 'select';
            //extend arguments
            AjaxSolr.extend(this, this, attributes);
            //Set Parameter Store
            this.setStore(this.store);
        }
        /**
         * Set the manager's parameter store.
         *
         * @param {AjaxSolr.ParameterStore} store
         */
        Manager.prototype.setStore = function (store) {
            this.store = store ? store : new AjaxSolr.ParameterStore();
        };
        /**
         * Stores the Solr parameters to be sent to Solr and sends a request to Solr.
         *
         * @param {Boolean} [start] The Solr start offset parameter.
         * @param {String} [servlet] The Solr servlet to send the request to.
         */
        Manager.prototype.doRequest = function (start, servlet) {
            // Allow non-pagination widgets to reset the offset parameter.
            if (start !== undefined) {
                this.store.get('start').val(start);
            }
            if (servlet === undefined) {
                servlet = this.servlet;
            }
            //this.store.save(); //save the state 
            this.executeRequest(servlet);
        };
        /**
         * An abstract hook for child implementations.
         *
         * <p>Sends the request to Solr, i.e. to <code>this.solrUrl</code> or <code>
         * this.proxyUrl</code>, and receives Solr's response. It should pass Solr's
         * response to <code>handleResponse()</code> for handling.</p>
         *
         * <p>See <tt>managers/Manager.jquery.js</tt> for a jQuery implementation.</p>
         *
         * @param {String} servlet The Solr servlet to send the request to.
         * @param {String} string The query string of the request. If not set, it
         *   should default to <code>this.store.string()</code>
         * @throws If not defined in child implementation.
         */
        Manager.prototype.executeRequest = function (servlet, qstring) {
            //throw 'Abstract method executeRequest must be overridden in a subclass.';
            qstring = qstring || this.store.string();
            console.log(this.solrUrl + servlet + '?' + qstring + '&wt=json');
        };
        /**
         * This method is executed after the Solr response data arrives. Allows each
         * widget to handle Solr's response separately.
         *
         * @param {Object} data The Solr response.
         */
        Manager.prototype.handleResponse = function (data) {
            this.response = data;
        };
        /**
         * This method is executed if Solr encounters an error.
         *
         * @param {String} message An error message.
         */
        Manager.prototype.handleError = function (message) {
            window.console && console.log && console.log(message);
        };
        return Manager;
    }());
    AjaxSolr.Manager = Manager;
})(AjaxSolr || (AjaxSolr = {}));
