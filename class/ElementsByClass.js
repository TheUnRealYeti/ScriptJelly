
/**
 * Copyright 2021 TheUnRealYeti. Source at: 
 * https://github.com/TheUnRealYeti/ScriptJelly
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at 
 * http://www.apache.org/licenses/LICENSE-2.0 
 *
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License. 
 */


/**
 * Returns a list of Element objects, containing one or more target CSS class 
 * names, that are children of either the current page's "document" object or a 
 * specified container Element object. Intended to be a polyfill function with 
 * near-universal Internet browser support. 
 * 
 * @param {string} className - Required. A string containing one or more 
 * space-separated CSS class names. 
 * @param {Element | Document} container - Optional. The Element or Document 
 * object which will have its children searched for Element objects with 
 * the target CSS class name(s). If unspecified, this value is set to the 
 * current page's "document" object. 
 * @param {boolean} getLive - Optional. A Boolean value specifying:
 * - If true, the returned list will be live, meaning it dynamically updates 
 *   when Elements are either added or removed or existing Elements have 
 *   matching CSS class names added or removed from the "container" parameter's 
 *   Element or Document object. 
 * - If false, the returned list will be static, meaning it will contain 
 *   references to Element objects which had matching CSS classes at the time 
 *   of retrieval. The list will not be updated when new Elements containing 
 *   the matching CSS classes appear as children of the "container" parameter, 
 *   or Elements in the list have their matching CSS class names removed or are 
 *   removed themselves from under the "container" parameter. 
 * - By default, getLive is not set, and the function may return either a live 
 *   or static Element list, depending on the functions that the current 
 *   Internet browser supports. 
 * 
 * @throws - 
 * Reference individual member method documentation for what types of 
 * and when each Error (exception object) is thrown. 
 * 
 * @returns {HTMLCollection<Element> | NodeList<Element> | Array<Element> | 
 * null} - 
 * - A data structure list of Element objects which have matching CSS class 
 *   name(s). Possible list types include: HTMLCollection, NodeList, or Array. 
 *   HTMLCollections are live, while NodeLists (non-live return value methods 
 *   invoked) and Arrays are static. 
 * - null if no JavaScript methods to retrieve Elements with matching CSS class 
 *   name(s) are supported. 
 */
function elementsByClass(className, container, getLive) {

    /**
     * - Checks whether the argument values passed to the parameters of the 
     *   parent function are of the expected primitive data types, inherit from 
     *   the proper Object classes, or implement the proper interfaces. 
     * 
     * - Checks if the "className" parameter's argument value is a string. If 
     *   so, trims any leading or trailing whitespace characters and replaces 
     *   any null characters in it. 
     * 
     * - Checks whether the "container" parameter had a value passed to it. If 
     *   so, checks whether it is an Element or Document object container. If 
     *   not, sets the "container" parameter's value to the current page's 
     *   "document" object. 
     * 
     * @throws - 
     * A TypeError exception when: 
     * - The "className" parameter is not a string. 
     * - The "container" parameter is not an Element or Document object. 
     * A RangeError exception when: 
     * - The "className" parameter is an empty string. 
     */
    this.checkParameter = function() {

        if (typeof className !== "string") {

            throw new TypeError("Parameter \"className\" is not a string.");
        }
    
        if (className.trim) {
    
            className = className.trim();
        }
    
        if (!className) {
    
            throw new RangeError("Parameter \"className\" is an empty string.");
        }

        className = className.replace(/\0/g, '');

        if (container) {

            if (!this.isContainerElement(container)) {

                throw new TypeError("Parameter \"container\" is not an " 
                    + "Element or HTMLDocument object.");
            }
        }
        else {

            container = document;
        }
    }

    /**
     * Checks whether a value is an Element or Document (HTMLDocument) object. 
     * If neither the Element class nor HTMLDocument interface is supported, 
     * checks whether the value: 
     * - is a non-null object; 
     * - has a nodeType "number" value of 1, indicating that it is an Element 
     *   node, or 9, indicating that it is a Document node; 
     * - has the inline "style" property, indicating that it is an Element 
     *   object; or 
     * - has the "documentElement" property, which references the "html" root 
     *   element of the page's DOM "document" object. 
     * 
     * @param {any} obj - The value to be checked. 
     * 
     * @returns {boolean} - 
     * Boolean true or false depending on whether the "obj" parameter value is 
     * either an Element or a Document (HTMLDocument) object. 
     */
    this.isContainerElement = function(obj) {

        if (typeof Element !== "undefined" 
            && typeof HTMLDocument !== "undefined") {

            return obj instanceof Element || obj instanceof HTMLDocument;
        }
        
        if (!obj) {
            
            return false;
        }
        
        if (obj.nodeType === 1 && obj.style) {

            return true;
        }

        return !!(obj.nodeType === 9 && obj.documentElement);
    }

    /**
     * Checks whether a value is an Element object. If the Element is not 
     * supported, checks whether the value: 
     * - is a non-empty object; 
     * - has a nodeType "number" value of 1, indicating that it is an Element 
     *   node; and 
     * - has the inline "style" property. 
     * 
     * @param {any} obj - The value to be checked. 
     * 
     * @returns {boolean} - 
     * Boolean true or false depending on whether the "obj" parameter value is 
     * an Element object. 
     */
    this.isElement = function(obj) {

        if (typeof Element !== "undefined") {

            return obj instanceof Element;
        }

        return !!(obj && obj.nodeType === 1 && obj.style);
    }

    /**
     * Using the getElementsByClassName() method, tries to fetch a list of 
     * Element objects containing the target CSS class name(s) from within the 
     * child hierarchy of the "container" parameter Document or Element object. 
     * This functionality is the most modern and computionally the fastest out 
     * of all the list-retrieval methods in the parent function. 
     * 
     * @returns {HTMLCollection<Element> | undefined} - 
     * - If the getElementsByClassName() method is supported by the Element 
     * class or Document interface, returns a lively-updated HTMLCollection 
     * containing every Element object with the target CSS class name(s) under 
     * the "container" parameter value. 
     * - Returns undefined if the getElementsByClassName() method is not 
     * supported by the Element class or Document interface. 
     */
    this.byClassName = function() {

        if (container.getElementsByClassName) {

            return container.getElementsByClassName(className);
        }

        return undefined;
    }

    /**
     * Using the querySelectorAll() method, tries to fetch a list of Element 
     * objects containing the target CSS class name(s) from within the child 
     * hierarchy of the "container" parameter Document or Element object. To be 
     * a valid CSS class selector, this method must escape any special, 
     * reserved CSS characters in the parent function's "className" parameter 
     * string argument with backslashes (\\), and any sequences of one or more 
     * whitespace characters separating CSS class names from one another must 
     * be replaced with a period (.) character. 
     * 
     * @returns {HTMLCollection<Element> | undefined} - 
     * - If the getElementsByClassName() method is supported by the Element 
     * class or Document interface, returns a lively-updated HTMLCollection 
     * containing every Element object containing the target CSS class name(s) 
     * under the "container" parameter value. 
     * - Returns undefined if the getElementsByClassName() method is not 
     * supported by the Element class or Document interface. 
     */
    this.byQuerySelector = function() {

        if (!container.querySelectorAll) {

            return undefined;
        }

        className = className.replace(
            /([_!\"#\$%&\'\(\)\*\+-\.\/\\:;<=>\?@\[\,\]\^`\{\|\}~])/g, 
            function(match, specialChar) {
                return '\\' + specialChar;
            }
        );

        className = "." + className.replace(/[\s\uFEFF\xA0]+/g, ".");
        return container.querySelectorAll(className);
    }

    /**
     * Gets all of the Element objects from under the "container" parameter 
     * value's child hierarchy using the getElementsByTagName() method and adds 
     * the ones which contains the target CSS class name(s) to an Array. 
     * 
     * @throws - 
     * A ReferenceError exception if the containsCSSClass() function, which is 
     * used to check whether an Element contains the target CSS class names, is 
     * not currently loaded. 
     * 
     * @returns {Array<Element> | undefined} - 
     * - An Array containing any Element objects with the target CSS class 
     *   name(s). 
     * - undefined if the getElementsByTagName() method is not supported by 
     *   the Element class or the Document interface for the "container" 
     *   parameter argument object. 
     */
    this.byTagNameBackup = function() {

        if (!container.getElementsByTagName) {

            return undefined;
        }
    
        if (typeof containsCSSClass !== "function") {
    
            throw new ReferenceError("containsCSSClass() function " 
                + "must be loaded in order to use the elementsByClass() " 
                + "function.");
        }
    
        var elementList = container.getElementsByTagName("*");
        var results = [], index, element;
    
        for (index = 0; index < elementList.length; index++) {
    
            element = elementList[index];
    
            if (this.isElement(element) 
                && containsCSSClass(element, className)) {
    
                results.push(element);
            }
        }
    
        return results;
    }

    /**
     * Tries the various methods defined in the parent function for getting a 
     * list of Element objects with the target CSS class name(s) from the child 
     * hierarchy of the "container" parameter's argument object. 
     * 
     * @returns {HTMLCollection<Element> | NodeList<Element> | Array<Element> | 
     * null} - 
     * If the "getLive" parameter has a Boolean value passed to it, this method 
     * will try to return: 
     * - a lively-updated HTMLCollection of Element objects, if true; or 
     * - a static NodeList or Array of Element objects, if false. 
     * 
     * Returns null if none of the JavaScript methods used for retrieving a 
     * list of the target Element objects and relied on by the called methods 
     * are supported. 
     */
    this.tryMethods = function() {

        if (typeof getLive === "boolean") {

            return getLive ? this.liveMethods() : this.staticMethods();
        }

        return this.defaultMethods();
    }

    /** 
     * Tries any methods defined in the parent function for getting a 
     * lively-updated list of Element objects which contain the target CSS 
     * class name(s). Currently, this method only supports the Element class's 
     * and Document interface's getElementsByClassName() method for returning 
     * an Element HTMLCollection, which is always live. Implementing additional 
     * logic for fetching and updating a live list using JavaScript native 
     * methods can be very complex and computationally expensive. 
     * 
     * @returns {HTMLCollection<Element> | null} - 
     * - A lively-updated HTMLCollection containing Elements with the target 
     *   CSS class name(s). 
     * - null if no additional JavaScript methods for returning a 
     *   lively-updated list data structure of Element objects with the target 
     *   CSS class names are supported. 
     */
    this.liveMethods = function() {

        var result = this.byClassName();
        return result === undefined ? null : result;
    }

    /**
     * Tries any methods defined in the parent function for retrieving a static 
     * list of Element objects with the target CSS class name(s). Currently, 
     * this method relies on the Element class's and Document interface's: 
     * - querySelectorAll() method for returning a static NodeList; or 
     * - getElementsByTagName() method for getting all child Elements of the 
     *   "container" parameter's argument object, searching through, and 
     *   returning an Array of the target Element objects. 
     * 
     * @returns {NodeList<Element> | Array<Element> | null} - 
     * - A static NodeList or Array of the Element objects with the target CSS 
     *   class name(s) in the child hierarchy of the "container" parameter's 
     *   Element or Document argument object. 
     * - null if no JavaScript methods are supported for finding a static list 
     *   of any target Element objects. 
     */
    this.staticMethods = function() {

        var result = this.byQuerySelector();

        if (result !== undefined) {

            return result;
        }

        result = this.byTagNameBackup();
        return result === undefined ? null : result;
    }

    /**
     * Executes the methods of the parent function for retrieving a list data 
     * structure of Element objects with the target CSS class names in the 
     * child hierarchy of the "container" parameter's Element or Document 
     * value. Methods are executed in order of how modern the JavaScript 
     * functions which they use are and how quickly they perform. Either a 
     * lively-updated or a static NodeList of matching Element objects may be 
     * returned by this method. 
     * 
     * @returns {HTMLCollection<Element> | NodeList<Element> | Array<Element> | 
     * null} - 
     * A list data structure of one of the following types, containing any 
     * Element objects with the target CSS class name(s) from the child 
     * hierarchy of the "container" parameter's Element or Document value: 
     * - A lively-updated HTMLCollection if the Element class's or Document 
     *   interface's getElementsByClassName() is supported. 
     * - A static NodeList if the Element class's or Document interface's 
     *   querySelectorAll() method is supported. 
     * - An Array if the Element class's or Document interface's 
     *   getElementsByTagName() method is supported and the containsCSSClass() 
     *   external polyfill function is loaded. 
     * - null if none of the above methods are supported. 
     */
    this.defaultMethods = function() {

        var result = this.byClassName();

        if (result !== undefined) {

            return result;
        }

        result = this.byQuerySelector();

        if (result !== undefined) {

            return result;
        }

        result = this.byTagNameBackup();

        if (result !== undefined) {

            return result;
        }

        return null;
    }

    /* Main area for method calling and execution */
    this.checkParameter();
    return this.tryMethods();
}
