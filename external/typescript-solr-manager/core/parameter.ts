namespace AjaxSolr {

    export interface ParameterAttributes {
        name?: string | null,
        value?: string|number|string[]|number[]|null,
        locals?: any
    }

     export const defaultParameterArgs: ParameterAttributes = {
        name: null,
        value: null,
        locals: {}
     }

    /**
     * Represents a Solr parameter.
     *
     * @param properties A map of fields to set. Refer to the list of public fields.
     * @class Parameter
     */
    export class Parameter {

        /**
         * @param {Object} attributes
         * @param {String} attributes.name The parameter's name.
         * @param {String} [attributes.value] The parameter's value.
         * @param {Object} [attributes.local] The parameter's local parameters.
         */

        //properties
        name: string;
        value: string|number|string[]|number[];
        locals: any;

        constructor (attributes?: ParameterAttributes) {
            extend(this, this, attributes);
        }

        /**
         * Returns the value. If called with an argument, sets the value.
         *
         * @param {String|Number|String[]|Number[]} [value] The value to set.
         * @returns The value.
         */
        val (value?: string|number|string[]|number[]): any  {
            if (value === undefined) {
                return this.value;
            }
            else {
                this.value = value;
            }
        }

        /**
         * Returns the value of a local parameter. If called with a second argument,
         * sets the value of a local parameter.
         *
         * @param {String} name The name of the local parameter.
         * @param {String|Number|String[]|Number[]} [value] The value to set.
         * @returns The value.
         */
        local (name: string, value?: string|number|string[]|number[]): any {
            if (value === undefined) {
                return this.locals[name];
            }
            else {
                this.locals[name] = value;
            }
        }

        /**
         * Deletes a local parameter.
         *
         * @param {String} name The name of the local parameter.
         */
        remove (name: string): void {
            delete this.locals[name];
        }

        /**
         * Returns the Solr parameter as a query string key-value pair.
         *
         * <p>IE6 calls the default toString() if you write <tt>store.toString()
         * </tt>. So, we need to choose another name for toString().</p>
         */
        string (): string {
            var pairs = [];

            for (var name in this.locals) {
                if (this.locals[name]) {
                    pairs.push(name + '=' + encodeURIComponent(this.locals[name]));
                }
            }

            var prefix = pairs.length ? '{!' + pairs.join('%20') + '}' : '';

            if (this.value || this.value == 0) { //handling 0 value for rows
                return this.name + '=' + prefix + this.valueString(this.value);
            }
            // For dismax request handlers, if the q parameter has local params, the
            // q parameter must be set to a non-empty value. In case the q parameter
            // has local params but is empty, use the q.alt parameter, which accepts
            // wildcards.
            else if (this.name == 'q' && prefix) {
                return 'q.alt=' + prefix + encodeURIComponent('*:*');
            }
            else {
                return '';
            }
        }

        /**
         * Parses a string formed by calling string().
         *
         * @param {String} str The string to parse.
         */
        parseString(str: string) {
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
        }

        /**
         * Returns the value as a URL-encoded string.
         *
         * @private
         * @param {String|Number|String[]|Number[]} value The value.
         * @returns {String} The URL-encoded string.
         */
        valueString (value: string|number|string[]|number[]) {
            value = isArray(value) ? (<string[]|number[]>value).join(',') : value;
            return encodeURIComponent(<string>value);
        }

        /**
         * Parses a URL-encoded string to return the value.
         *
         * @private
         * @param {String} str The URL-encoded string.
         * @returns {Array} The value.
         */
        parseValueString (str: string) {
            str = decodeURIComponent(str);
            return str.indexOf(',') == -1 ? str : str.split(',');
        }

    }
}