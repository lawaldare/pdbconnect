namespace AjaxSolr {
  'use strict';

  export interface ManagerArguments {
    name: string;
    solrUrl: any;
    proxyUrl?: any;
    servlet?: string;
    response?: Object; // The most recent response from Solr.
    store?: any; // The parameter store for the manager and its widgets.
  }

  /**
   * The Manager acts as the controller in a Model-View-Controller framework. All
   * public calls should be performed on the manager object.
   *
   * @param properties A map of fields to set. Refer to the list of public fields.
   * @class Manager
   */
  export class Manager {
    name: string = 'solrManager';
    solrUrl: any = { normal: 'http://localhost:8983/solr/', latest: 'http://localhost:8983/solr/' };
    proxyUrl: any;
    servlet: string = 'select';
    response: {};
    store: any;

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

    constructor(attributes: ManagerArguments) {
      //extend arguments
      extend(this, this, attributes);

      //Set Parameter Store
      this.setStore(this.store);
    }

    /**
     * Set the manager's parameter store.
     *
     * @param {AjaxSolr.ParameterStore} store
     */
    setStore(store: ParameterStoreAttributes) {
      this.store = store ? store : new AjaxSolr.ParameterStore();
    }

    /**
     * Stores the Solr parameters to be sent to Solr and sends a request to Solr.
     *
     * @param {Boolean} [start] The Solr start offset parameter.
     * @param {String} [servlet] The Solr servlet to send the request to.
     */
    doRequest(start: boolean, servlet: string) {
      // Allow non-pagination widgets to reset the offset parameter.
      if (start !== undefined) {
        this.store.get('start').val(start);
      }
      if (servlet === undefined) {
        servlet = this.servlet;
      }

      //this.store.save(); //save the state

      this.executeRequest(servlet);
    }

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
    executeRequest(servlet: string, qstring?: string) {
      //throw 'Abstract method executeRequest must be overridden in a subclass.';

      qstring = qstring || this.store.string();

      console.log(this.solrUrl + servlet + '?' + qstring + '&wt=json');
    }

    /**
     * This method is executed after the Solr response data arrives. Allows each
     * widget to handle Solr's response separately.
     *
     * @param {Object} data The Solr response.
     */
    handleResponse(data: any) {
      this.response = data;
    }

    /**
     * This method is executed if Solr encounters an error.
     *
     * @param {String} message An error message.
     */
    handleError(message: string) {
      window.console && console.log && console.log(message);
    }
  }
}
