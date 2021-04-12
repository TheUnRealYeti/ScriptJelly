
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
 * Returns the topmost ancestor Node, known as the root Node, of a Node object. 
 * Intended to be a cross-browser polyfill for the Node interface's 
 * getRootNode() method, either directly calling this method or implementing 
 * equivalent functionality for it, for either modern or legacy Internet 
 * browsers. This method is inserted under the Node interface's prototype as 
 * the getRootNode() method if that method is not supported, though it could 
 * also equivalently override an existing getRootNode() method implementation. 
 * If the Node interface's getRootNode() method does not already exist, this 
 * function traverses up the DOM tree Node hierarchy until a Node without any 
 * further ancestors is found. 
 * 
 * For more information on associated JavaScript APIs, methods, and properties, 
 * reference authoritative documentation for: 
 * 
 * The Node interface: 
 * https://developer.mozilla.org/en-US/docs/Web/API/Node 
 * 
 * The Node interface's getRootNode() method: 
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode 
 * 
 * The HTMLDocument interface: 
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLDocument 
 * 
 * The ShadowRoot API: 
 * https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot 
 * 
 * The Node interface's "parentNode" property: 
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode 
 * 
 * @param {Node} node - Required. The target Node object which will have its 
 * root Node found. 
 * 
 * @param {object} options - Optional. A non-null object containing a property 
 * of name "composed" and a Boolean value. If the "composed" property is: 
 * - false, the nearest ShadowRoot node, the one associated with the "node" 
 *   parameter's target Node, will be returned, if present. 
 * - true, the topmost root Node beyond any intermediate ancestral ShadowRoot  
 *   nodes will be returned. 
 * By default, if no value is passed to the "options" parameter and it remains 
 * undefined, options.composed is set to false. 
 * 
 * @param {boolean} overriden - A Boolean value indicating whether or not this 
 * function was used for functionalty adding support for or replacing an 
 * existing implementation of the default Node interface's getRootNode() method 
 * through overriding it in the Node class's prototype. Should be true when a 
 * prototype override is performed, and false in every other case. The same 
 * functionality will still be achieved if this function is directly called 
 * with this value set to "false", but performance may be worse than calling an 
 * Internet browser's native implementation of the getRootNode() method, if it 
 * is supported. This value does not strictly have to be a Boolean; it can 
 * accomplish the same functionality while being undefined, truthy, or falsy. 
 * 
 * @throws - 
 * TypeError exception if:
 * - The value passed to the "node" parameter is not a Node object; or 
 * - The value passed to the "options" parameter is defined and is not a 
 *   non-null object. 
 * ReferenceError exception if: 
 * - A property of name "composed" with a Boolean value is not found in a 
 *   non-null object passed to the "options" parameter. 
 * 
 * @returns {HTMLDocument | ShadowRoot | Node} - 
 * If ShadowRoot Nodes are supported by a user's Internet browser, and the 
 * target Node is descended from one, this function can either return the 
 * first ShadowRoot encountered in the ancestral hierarchy, or proceed beyond 
 * any ShadowRoot ancestors until the true topmost root Node is found. For 
 * target Nodes which are not associated with any ShadowRoot nodes, those 
 * attached to a web page's DOM tree structure will have the base HTMLDocument 
 * object as their root node, and those which are dynamically created with 
 * JavaScript and are not inserted into a web page yet will have the topmost 
 * dynamically created Node as a root. 
 */
function getRootNodePolyfill(node, options, overridden) {
    
    /**
     * Checks whether the parameters passed to the parent function are of the 
     * correct primitive data types, whether they implement the proper 
     * interfaces, or whether they inherit from the proper classes. 
     * - The value passed to the "node" parameter must be a Node object. 
     * - The value passed to the "options" parameter must be a non-null object 
     *   containing a Boolean-type property of name "composed". 
     */
    function checkParams() {

        checkNodeParam();
        checkOptionsParam();
    }

    /**
     * Checks whether a value is a Node object: 
     * 
     * - If the Node interface is supported by a user's Internet browser, 
     *   checks whether the value implements it. 
     * 
     * - Otherwise, checks whether the value is a non-null object, and whether 
     *   it supports the ubiquitous appendChild() method of the Node interface. 
     * 
     * @param {any} obj - The value to be checked. 
     * 
     * @returns {boolean} - 
     * Boolean true or false
     */
    function isNode(obj) {

        if (typeof Node !== "undefined") {

            return obj instanceof Node;
        }

        return !!(obj && obj.appendChild);
    }

    /**
     * Checks whether the value passed to the "node" parameter of the parent 
     * function is a Node object. Uses the isNode() method of the same parent 
     * function to determine this. 
     * 
     * @throws A TypeError exception if the value is not a Node object. 
     */
    function checkNodeParam() {

        if (!isNode(node)) {

            throw new TypeError("The value passed to the \"node\" parameter " 
                + "must be a Node object.");
        }
    }

    /**
     * Checks whether the value passed to the "options" parameter of the parent 
     * function is a non-null object with a Boolean-type property named 
     * "composed". If the "options" parameter is undefined, meaning no value 
     * was passed to it, it will be assigned an object with the "composed" 
     * property defaulting to Boolean false. 
     * 
     * @throws - 
     * - A TypeError exception if a value is passed to the "options" parameter 
     *   and it is falsey, not an object, or null. 
     * - A ReferenceError exception if no Boolean-type property named 
     *   "composed" was found in a non-null object passed to the "options" 
     *   parameter. 
     */
    function checkOptionsParam() {

        if (typeof options === "undefined") {

            options = { composed: false };
            return;
        }

        if (options && typeof options === "object") {

            if (typeof options.composed === "boolean") {

                return;
            }

            throw new ReferenceError("The object passed to the \"options\" " 
                + "parameter must contain the Boolean-value property named " 
                + "\"composed\".");
        }

        throw new TypeError("Value passed to \"options\" parameter must be " 
            + "an object with a Boolean-value property named \"composed\".");
    }

    /**
     * Tries the various methods available to the parent function for finding 
     * the root Node of the target Node object. 
     * 
     * - If the getRootNode() method has been added or replaced by overridding 
     *   it in the Node interface's prototype using this function, then the 
     *   upwardsTraversal() method of the parent function will be called to 
     *   travel up any ancestral DOM tree hierarchy from the target Node until 
     *   the topmost Node with no ancestors is reached. 
     * 
     * - If the Node interface's getRootNode() method hasn't been overridden 
     *   and another implementation of it is already supported, then it will be 
     *   called, as a native Internet browser implementation may be faster than 
     *   the backup custom DOM tree traversal approach. 
     * 
     * - Otherwise, if the Node interface does not support a getRootNode() 
     *   method in a user's Internet browser, then the upwardsTraversal() 
     *   backup functionality will be called by default. 
     */
    function tryMethods() {

        if (overridden) {

            return upwardsTraversal(node);
        }

        if (node.getRootNode) {

            return node.getRootNode(options);
        }
        
        return upwardsTraversal(node);
    }

    /**
     * Traverses up the ancestral DOM tree hierarchy from the target Node until 
     * a Node with no more ancestors, indicated by a "parentNode" property 
     * value of null, is reached. Further behavior depends on whether the 
     * ShadowRoot API is supported by a user's Internet browser and on the 
     * value of the object parameter's "composed" property passed to the 
     * "options" parameter of the parent function. Reference the parameter and 
     * return value documentation in this function for further details. 
     * 
     * @param {Node} startNode - Required. The Node object from which the 
     * traversal up an ancestral parent Node hierarchy will begin. Initially, 
     * this is the same as the target Node object passed to the "node" 
     * parameter of the parent function. Otherwise, if this method is being 
     * recursively called, then it is the host of a ShadowRoot node resulting 
     * from a previous traversal. 
     * 
     * @returns {HTMLDocument | ShadowRoot | Node} - 
     * - If a user's Internet browser does not support the ShadowRoot API, the 
     *   first result of the traversal is returned: 
     * 
     * - If the target Node is attached to a web page, and the traversal result 
     *   is not a ShadowRoot instance, then the HTMLDocument object 
     *   representing the base of the DOM tree structure will be returned. 
     * 
     * - Otherwise, if the target Node and its ancestors are not children of a 
     *   web page's DOM tree structure, especially if they are generated by 
     *   JavaScript DOM node building methods, then the topmost Node in the 
     *   unattached ancestral hierarchy is returned. 
     * 
     * - If the ShadowRoot API is supported by the user's Internet browser, and 
     *   the current traversal result is a ShadowRoot instance, return behavior 
     *   depends on the value of the parent function's "options" parameter's 
     *   "composed" property: 
     * 
     * - If options.composed is set to true, and the current traversal 
     *   ShadowRoot result has another ancestor hosting it, as referenced by 
     *   the "host" property, then this method will recursively call itself to 
     *   traverse further up the ancestral DOM tree hierarchy until the true 
     *   topmost Node of the hierarchy is reached. 
     * 
     * - If options.composed is set to true, and if the traversal result is a 
     *   ShadowRoot node which does not have an ancestral host referenced in 
     *   its "host" property, then this resulting ShadowRoot node will be 
     *   returned. 
     * 
     * - If options.composed is set to false, the first associated ancestral 
     *   ShadowRoot instance to the target Node will be returned. This behavior 
     *   is default. 
     */
    function upwardsTraversal(startNode) {

        var currentNode = startNode;

        while (currentNode.parentNode) {

            currentNode = currentNode.parentNode;
        }

        if (typeof ShadowRoot !== "undefined" 
            && currentNode instanceof ShadowRoot 
            && options.composed && currentNode.host) {

            return upwardsTraversal(currentNode.host);
        }

        return currentNode;
    }

    /* Main function calling and execution area */
    checkParams();
    return tryMethods();
}

/* If a direct reference to the Node interface is not defined in a user's 
Internet browser, then try to assign one by accessing it as a property of 
the browser's current Window object. */
if (!Node) {

    Node = window.Node;
}

/* If the Node interface is supported and the Node interface's getRootNode() 
method is not supported by the current Internet browser, then override the 
getRootNode() method in the prototype by setting it to a function that calls 
and returns a value from the getRootNodePolyfill() function. This call 
passes a "this" reference to the current Node object to the "node" parameter 
and a Boolean true value to the "overridden" parameter of the 
getRootNodePolyfill() function. */
if (Node && !Node.prototype.getRootNode) {

    Node.prototype.getRootNode = function(options) {

        return getRootNodePolyfill(this, options, true);
    }
}
