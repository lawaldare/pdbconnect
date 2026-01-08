namespace AjaxSolr {
    "use strict";

    /**
     * Consider replacing this function by ES6 Object.assign
     * @see https://github.com/documentcloud/underscore/blob/7342e289aa9d91c5aacfb3662ea56e7a6d081200/underscore.js#L789
    */
    export function extend(child: any, param1: Object, param2: any) {
        // From _.extend
        var obj = Array.prototype.slice.call(arguments, 1);

        // From _.extend
        var iterator = function(source: any) {
            if (source) {
            for (var prop in source) {
                child[prop] = source[prop];
            }
            }
        };

        // From _.each
        if (obj == null) return;
        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(iterator);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
            iterator.call(undefined, obj[i], i, obj);
            }
        } else {
            for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                iterator.call(undefined, obj[key], key, obj);
            }
            }
        }

        return child;
    };

    /**
     * @param value A value.
     * @param array An array.
     * @returns {Boolean} Whether value exists in the array.
     */
    export function inArray(value: any, array: any[]): number {
        if (array) {
            for (var i = 0, l = array.length; i < l; i++) {
                if (equals(array[i], value)) {
                    return i;
                }
            }
        }
        return -1;
    };

    /**
     * @static
     * @param foo A value.
     * @param bar A value.
     * @returns {Boolean} Whether the two given values are equal.
     */
    export function equals(foo: any, bar: any) {
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
    };

    /**
     * Can't use toString.call(obj) === "[object Array]", as it may return
     * "[xpconnect wrapped native prototype]", which is undesirable.
     *
     * @static
     * @see http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
     * @see http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.3/prototype.js
     */
    export function isArray (obj: any) {
        return obj != null && typeof obj == 'object' && 'splice' in obj && 'join' in obj;
    };

    /**
     * @param obj Any object.
     * @returns {Boolean} Whether the object is a RegExp object.
     */
    export function isRegExp (obj: any) {
        return obj != null && (typeof obj == 'object' || typeof obj == 'function') && 'ignoreCase' in obj;
    };

    /**
     * @param obj Any object.
     * @returns {Boolean} Whether the object is a String object.
     */
    export function isString (obj: any) {
        return obj != null && typeof obj == 'string';
    };

    export interface managerConfigBase {
        managerDetails: AjaxSolr.ManagerArguments,
        managerParams: any
    }

    /**
     * @param obj Any object.
     * @returns {Boolean} Whether the object is a String object.
     */
    export function createManagerStore (managerJsonArr: managerConfigBase[]) {
        let store: any = {};
        for(let i:number=0, len:number = managerJsonArr.length; i < len; i++ ){
            let managerConfigData = managerJsonArr[i];
            //create manager instance
            store[managerConfigData.managerDetails.name] = new Manager(managerConfigData.managerDetails);

            //add params to the store
            for (let paramName in managerConfigData.managerParams) {
                store[managerConfigData.managerDetails.name].store.addByValue(paramName, managerConfigData.managerParams[paramName]);
            }

        }

        return store;
    };

}