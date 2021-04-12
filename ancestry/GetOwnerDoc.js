
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
 * Gets the top-level, or owner, Document object for a Node object. Intended to 
 * be a polyfill function with near-universal JavaScript support for both 
 * modern and legacy Internet browsers. Especially useful for when browsers do 
 * not support the Node interface's "ownerDocument" property. 
 * 
 * For more information on associated JavaScript APIs and properties, reference 
 * authoritative documentation: 
 * 
 * The Node interface: 
 * https://developer.mozilla.org/en-US/docs/Web/API/Node 
 * 
 * The Node interface's "ownerDocument" property: 
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/ownerDocument 
 * 
 * The Document interface: 
 * https://developer.mozilla.org/en-US/docs/Web/API/Document
 * 
 * @param {Node} node - The Node object to have its have its owner Document 
 * found. 
 * 
 * @throws - 
 * A TypeError exception if the value passed to the "node" parameter is not a 
 * Node object. 
 * 
 * @returns {Document | null} - 
 * A Document object or null. 
 *  
 * If the Node interface's "ownerDocument" property is: 
 * - supported, then a returned Document object is the one from which the 
 *   Node was created. 
 * - not supported, then a returned Document object has the Node as a 
 *   descendant in its DOM structure. 
 * 
 * If null is returned, then: 
 * - the Node itself is a Document object, in keeping with the null value 
 *   of the "ownerDocument" property on a Document node; or 
 * - the Node has not been attached to a web page with a DOM tree structure 
 *   rooted on a Document object. 
 */
function getOwnerDocument(node) {

    /** 
     * Checks whether or not the value passed to the "node" parameter is a Node 
     * object. 
     * 
     * @throws - 
     * A TypeError exception if the value passed to the "node" parameter of the 
     * parent function is not a Node object. 
     */
    this.checkParameter = function() {

        if (!this.isNode(node)) {

            throw new TypeError("Value passed to parameter \"node\" must be a " 
                + "Node object.");
        }
    }

    /**
     * Helper method. Checks whether or not a value is a Node object. 
     * - If the Node interface is supported, checks whether the value 
     *   implements it. 
     * - Otherwise, checks if the value is a non-null object and if it has the  
     *   appendChild() method of the Node interface. 
     * 
     * @param {any} obj - The value to be checked. 
     * 
     * @returns {boolean} - 
     * Boolean true or false depending on whether the value passed to the "obj" 
     * parameter is a Node object. 
     */
    this.isNode = function(obj) {

        if (typeof Node !== "undefined") {

            return obj instanceof Node;
        }

        return !!(obj && obj.appendChild);
    }

    /**
     * Helper method. Checks whether or not a value is a Document object. 
     * - If the HTMLDocument interface is supported, checks whether the value 
     *   implements it. 
     * 
     * Otherwise, checks if the value: 
     * - is a non-null object; 
     * - has a "nodeType" property of 9, indicating that it is a Node object 
     *   and that it is a Document object. 
     * 
     * @param {any} obj - The value to be checked. 
     * 
     * @returns {boolean} Boolean true or false depending on whether the value 
     * passed to the "obj" parameter is a Document object. 
     */
    this.isDocument = function(obj) {

        if (typeof HTMLDocument !== "undefined") {

            return obj instanceof HTMLDocument;
        }

        return !!(obj && obj.nodeType === 9);
    }

    /**
     * Tries different JavaScript properties to get the top-level, or owner, 
     * Document object for the Node object passed to the "node" parameter of 
     * the parent function. 
     * - First, tries to return the value of the "ownerDocument" property on 
     *   the target Node, if it is supported. 
     * - Otherwise, traverses up the ancestral Node hierarchy or DOM tree 
     *   structure, starting at the target Node, by repeatedly calling the Node 
     *   interface's "parentNode" property until a value of null is returned. 
     * - Once a Node with no further ancestors, called the root Node, is found, 
     *   tests whether or not it is a Document object. If so, it is the owner 
     *   Document to the target Node in its DOM tree structure. 
     * 
     * @returns {Document | null} - 
     * A Document object or null. 
     * 
     * If the Node interface's "ownerDocument" property is: 
     * - supported, then a returned Document object is the one from which the 
     *   Node was created. 
     * - not supported, then a returned Document object has the Node as a 
     *   descendant in its DOM structure. 
     * 
     * If null is returned, then: 
     * - the Node itself is a Document object, in keeping with the null value 
     *   of the "ownerDocument" property on a Document node; or 
     * - the Node has not been attached to a web page with a DOM tree structure 
     *   rooted on a Document object. 
     */
    this.tryMethods = function() {

        if (this.isDocument(node)) {

            return null;
        }
    
        if (typeof node.ownerDocument !== "undefined") {
    
            return node.ownerDocument;
        }
    
        var owner = node;
    
        while (owner.parentNode) {
    
            owner = owner.parentNode;
        }

        return this.isDocument(owner) ? owner : null;
    }

    /* Main member method calling and execution area */
    this.checkParameter();
    return this.tryMethods();
}
