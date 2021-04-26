
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
 * Removes all of the child Nodes of a Node object, depending on the specified 
 * options. Intended to be a cross-browser polyfill function with 
 * near-universal JavaScript support for both modern and legacy Internet 
 * browsers. Prioritizes newer or more currently optimized JavaScript APIs, 
 * methods, and properties and faster algorithms for removing child Nodes over 
 * legacy, slower, highly compatible ones. However, will default to legacy 
 * functionality if more modern functionality is not supported by a user's 
 * Internet browser. 
 * 
 * - Either only Element child Nodes of the specified parent Node object can be 
 *   removed, or all of the child Nodes, regardless of their type, can be 
 *   removed. 
 * 
 * - Child Nodes of the specified parent Node object can either be removed in 
 *   an ascending, "forwards" direction or order, meaning first to last, or in 
 *   a descending, "backwards" direction or order, meaning last to first. By 
 *   default, the best-performing ordering for removal will be used, or child 
 *   Nodes will be removed all at once without any direction preference. The 
 *   direction of removal can be used to create collapsing effects, or can be 
 *   used to make the removal of content less jarring for a user, depending on 
 *   where on the page their browser's viewport is located.  
 * 
 * @param {Node} node - Required. The Node object which will have its child 
 * Nodes removed. 
 * 
 * @param {boolean} removeElements - Optional. 
 * 
 * - If true, only Element child Nodes of the "node" parameter's value will be 
 *   removed, while other types of child Nodes will be preserved. 
 * 
 * - If false, all child Nodes, regardless of type, will be removed from the 
 *   "node" parameter's value. 
 * 
 * - If unspecified, the default value is false. 
 * 
 * - Note that this value does not strictly have to be a Boolean-type value, 
 *   and it can be any other data type that has truthy or falsy values. 
 * 
 * @param {boolean} forwards - Optional. Specifies the direction or ordering in 
 * which child Nodes will be removed. Child Nodes will be removed from the 
 * "node" parameter's value: 
 * 
 * - When true, starting at the first child Node and proceeding towards the 
 *   last, which may be useful for creating an upwards collapsing effect; 
 * 
 * - When false, starting at the last child Node and proceeding towards the 
 *   first, which may be useful for creating a downwards collapsing effect. 
 * 
 * - If unspecified or undefined, either no removal direction is used, or the 
 *   direction of removal which gives the best performance results is favored, 
 *   in many cases from last to first. This is the default behavior. 
 * 
 * - Note that this value does not strictly have to be a Boolean-type value, 
 *   and it can be any other data type that has truthy or falsy values. 
 * 
 * @throws - 
 * - TypeError exception when the value passed to the "node" parameter is not a 
 *   Node object. 
 * 
 * @returns {boolean} - 
 * - Boolean true if JavaScript functionality for child Node removal is 
 *   supported and the specified types of child Nodes were successfully removed 
 *   from the "node" parameter's parent Node object. 
 * - Boolean false if no JavaScript functionality for removing the specified 
 *   types of child Nodes is supported. Rarely is the case, except in very old, 
 *   pre-ES3 JavaScript Internet browsers. 
 */
function removeChildren(node, removeElements, forwards) {

    /**
     * Checks whether the value passed to the "node" parameter of the parent 
     * function is a Node object. 
     * 
     * @throws - 
     * TypeError exception if the value passed to the "node" parameter is not a 
     * Node object. 
     */
    this.checkParameter = function() {

        if (!this.isNode(node)) {

            throw new TypeError("The value passed to the \"node\" parameter " 
                + "is not a Node object.");
        }
    }

    /**
     * Checks whether a value is a Node object. Either checks whether the 
     * value: 
     * 
     * - implements the Node interface's properties and methods in its 
     *   prototype using the "instanceof" operator; or 
     * 
     * - is a non-null object with a "nodeType" property value of 1, indicating 
     *   that it is an Element object. 
     * 
     * @param {any} obj - The value to be checked whether it is a Node object. 
     * 
     * @returns {boolean} - 
     * Boolean true or false depending on whether the value passed to the 
     * "obj" parameter is a Node object. 
     */
    this.isNode = function(obj) {

        return Node ? obj instanceof Node : !!(obj && obj.removeChild);
    }

    /**
     * Checks whether a value is a Node object. Either checks whether the 
     * value: 
     * 
     * - inherits the Element class's prototype using the "instanceof" 
     *   operator; or 
     * 
     * - is a non-null object with a "nodeType" property value of 1, indicating 
     *   that it is an Element object. 
     * 
     * @param {any} obj - The value to be checked whether or not it is a Node 
     * object. 
     * 
     * @returns {boolean} - 
     * Boolean true or false depending on whether the value passed to the 
     * "obj" parameter is an Element object. 
     */
    this.isElement = function(obj) {

        return Element ? obj instanceof Element : !!(obj && obj.nodeType === 9);
    }

    /**
     * Tries the various methods for removing child Nodes available to the 
     * parent function, depending on the options that were specified. 
     * 
     * @returns {boolean} - 
     * Boolean true or false depending on whether the method succeeded in 
     * removing the child Nodes from the "node" parameter's Node object value. 
     */
    this.tryMethods = function() {

        /* Default removal behavior. Uses any direction which gives best 
         performance. */
        if (typeof forwards === "undefined") {

            /* Chooses to remove only Elements or all Nodes. */
            return removeElements ? this.removeElements() : this.removeAll();
        }

        /* Forward direction removal behavior */
        if (forwards) {

            /* Chooses to remove only Elements or all Nodes. */
            return removeElements ? this.removeElForwards() 
                : this.removeAllForwards();
        }

        /* Backward removal direction. Chooses to remove only Elements or all 
         Nodes. */
        return removeElements ? this.removeElBackwards() 
            : this.removeAllBackwards();
    }

    /**
     * Removes all of the child Nodes from the parent Node object value, passed 
     * to the "node" parameter. Preference is given to faster and more modern 
     * JavaScript approaches over legacy ones. 
     * 
     * @returns {boolean} - 
     * - Boolean true if a method or property for removing child Nodes is 
     *   supported and successfully removed all of the child Nodes. 
     * 
     * - Boolean false if no JavaScript functionality for removing child Nodes 
     *   is supported and none of the child Nodes could be removed as a result. 
     */
    this.removeAll = function() {

        /* Note that while using cloneNode() to make a shallow copy of the 
         parent Node is technically the fastest modern approach for removing 
         child Nodes, it also removes any event listeners associated with the 
         parent Node, which may be undesired behavior. For that reason, that 
         approach is omitted. */

        /* Most modern, ES6 approach. Either the same or similar performance to 
         other approaches. */
        if ("replaceChildren" in node) {

            node.replaceChildren();
            return true;
        }

        /* Generally faster than innerHTML due to not having to call HTML 
         parsers in older browsers. */
         if ("textContent" in node) {

            node.textContent = '';
            return true;
        }
        
        /* Usually the second or third fastest modern and the fastest Internet 
         Explorer approach. Has traditionally been slower than the other 
         approaches in most other Internet browsers due to invoking an HTML 
         parser to clean up any children. */
        if ("innerHTML" in node) {

            node.innerHTML = '';
            return true;
        }

        /* Used to be the fastest approach available, and is still the fastest  
         in some specific cases and browsers. However, has been surpassed in 
         most practical cases by the innerHTML and textContent approaches for 
         clearing child Nodes in most modern Internet browsers and in all 
         legacy Microsoft browsers. */
        if ("firstChild" in node && "lastChild" in node) {

            while (node.firstChild) {

                node.removeChild(node.lastChild);
            }

            return true;
        }

        /* Worst performance. Only used as a last-case scenario. Removes the 
         last child Node entry repeatedly from the "childNodes" lively-updated 
         NodeList property of the Node interface. */
        if ("childNodes" in node) {

            var childNodes = node.childNodes;

            while (childNodes.length) {

                node.removeChild(childNodes[childNodes.length - 1]);
            }

            return true;
        }

        return false;
    }

    /**
     * Removes all of the child Nodes from the "node" parameter's parent Node 
     * object value in an ascending, "forward" direction or ordering, starting 
     * with the first Node and proceeding to the last. 
     * 
     * @returns {boolean} - 
     * - Boolean true if any properties required for removing child Nodes are 
     *   supported and successfully removed all of the child Nodes in a 
     *   "forward", ascending order. 
     * 
     * - Boolean false if no JavaScript functionality for removing child Nodes 
     *   is supported and none of the child Nodes could be removed in a 
     *   "forward", ascending direction as a result. 
     */
    this.removeAllForwards = function() {

        /* Fastest performance */
        if ("firstChild" in node && "lastChild" in node) {

            while (node.lastChild) {

                node.removeChild(node.firstChild);
            }

            return true;
        }
        
        /* Worst performance. Multiple times slower than the previous approach 
         in nearly all Internet browsers. Only used as a last-case scenario. */
        if ("childNodes" in node) {

            var childNodes = node.childNodes;

            while (childNodes.length) {

                node.removeChild(childNodes[0]);
            }

            return true;
        }

        return false;
    }

    /**
     * Removes all of the child Nodes from the "node" parameter's parent Node 
     * object value in a descending, "backward" direction or ordering, starting 
     * with the last Node and proceeding to the first. Sometimes, is faster 
     * than starting child Node removal at the first node and proceeding to the 
     * last Node due to underlying browser child Node tree implementation 
     * reasons. 
     * 
     * @returns {boolean} - 
     * - Boolean true if any properties required for removing child Nodes are 
     *   supported and successfully removed all of the child Nodes in a 
     *   "backward", descending order. 
     * 
     * - Boolean false if no JavaScript functionality for removing child Nodes 
     *   is supported and none of the child Nodes could be removed in a 
     *   "backward", descending direction as a result. 
     */
    this.removeAllBackwards = function() {

        /* Fastest performance */
        if ("firstChild" in node && "lastChild" in node) {

            while (node.firstChild) {

                node.removeChild(node.lastChild);
            }

            return true;
        }
        
        /* Worst performance. Multiple times slower than the previous approach 
         in nearly all Internet browsers. Only used as a last-case scenario. */
        if ("childNodes" in node) {

            var childNodes = node.childNodes;

            while (childNodes.length) {

                node.removeChild(childNodes[childNodes.length - 1]);
            }

            return true;
        }

        return false;
    }

    /**
     * Calls methods from the parent function until one is found that has 
     * supported JavaScript methods or properties which can be used for 
     * removing all of the Element object child Nodes from the parent 
     * function's "node" parameter's parent Node object value. Either 
     * ascending, "forward" or descending, "backward" directions or orderings 
     * for removal may be used, depending on which gives the best performance 
     * results for a particular JavaScript API or against other approaches. 
     * 
     * @returns {boolean} - 
     * - Boolean true if any properties required for removing Element object 
     *   child Nodes are supported and successfully removed all of the Element 
     *   object child Nodes. 
     * 
     * - Boolean false if no JavaScript functionality for removing Element 
     *   object child Nodes is supported and none of the Element object child 
     *   Nodes could be removed as a result. 
     */
    this.removeElements = function() {

        return this.elBackBySibl() || this.elForBySibl() 
            || this.elBackByChildNodes() || false;
    }

    /**
     * Calls methods from the parent function until one is found that has 
     * supported JavaScript methods or properties which can be used for 
     * removing all of the Element object child Nodes from the parent 
     * function's "node" parameter's parent Node object value. Removes them in 
     * an ascending, "forward" direction or ordering, starting at the first 
     * child Node and proceeding to the last. 
     * 
     * @returns {boolean} - 
     * - Boolean true if any properties required for removing Element object 
     *   child Nodes are supported and successfully removed all of the Element 
     *   object child Nodes in an ascending, "forward" direction. 
     * 
     * - Boolean false if no JavaScript functionality for removing Element 
     *   object child Nodes is supported and none of the Element object child 
     *   Nodes could be removed in an ascending, "forward" direction as a 
     *   result. 
     */
    this.removeElForwards = function() {

        return this.elForBySibl() || this.elForByChildNodes() || false;
    }

    /**
     * Calls methods from the parent function until one is found that has 
     * supported JavaScript methods or properties which can be used for 
     * removing all of the Element object child Nodes from the parent 
     * function's "node" parameter's parent Node object value. Removes them in 
     * an descending, "backward" direction or ordering, starting at the last 
     * child Node and proceeding to the first. 
     * 
     * @returns {boolean} - 
     * - Boolean true if any properties required for removing Element object 
     *   child Nodes are supported and if all of the Element object child Nodes 
     *   are successfully removed in a descending, "backward" direction. 
     * 
     * - Boolean false if no JavaScript functionality for removing Element 
     *   object child Nodes is supported and none of the Element object child 
     *   Nodes could be removed in a descending, "backward" direction as a 
     *   result. 
     */
    this.removeElBackwards = function() {

        return this.elBackBySibl() || this.elBackByChildNodes() || false;
    }

    /**
     * Starting from the "firstChild" property Node and proceeding to the last 
     * using each child Node's "nextSibling" property in an ascending, 
     * "forward" direction or ordering, traverses the child Nodes of the 
     * parent function's "node" parameter's parent Node object, removes each 
     * child Node that is an Element object, and preserves child Nodes which 
     * are not Element objects. This is generally the second fastest approach 
     * for traversing and removing Element-type child Nodes in most Internet 
     * browsers. 
     * 
     * @returns {boolean} - 
     * - Boolean true if the parent Node either does not contain any 
     *   Element-type child Nodes, or if the child Nodes were traversed in an 
     *   ascending, "forward" direction and all of the Element-type child Nodes 
     *   were successfully removed. 
     * 
     * - Boolean false if the parent Node does not support the "firstChild" 
     *   and/or "nextSibling" properties necessary for traversing the child 
     *   Nodes to check and remove any if they are Element objects. 
     */
    this.elForBySibl = function() {

        if (!this.hasChildElements(node)) {

            return true;
        }

        if ("firstChild" in node && "nextSibling" in node) {

            var current = node.firstChild, next;

            /* The next node will be null after the last node is reached. */
            while (current) {

                if (this.isElement(current)) {

                    /* Nodes which are removed will have their "nextSibling" 
                     reference set to null, as they are not attached to any 
                     parent Node structure. The next Node reference must be 
                     saved to not be lost before removing it, assuming that it 
                     is another child Node and not null. */
                    next = current.nextSibling;
                    node.removeChild(current);
                    current = next;
                }
                else {

                    current = current.nextSibling;
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Starting from the "lastChild" property Node and proceeding to the first 
     * using each child Node's "previousSibling" property in a descending, 
     * "backward" direction or ordering, traverses the child Nodes of the 
     * parent function's "node" parameter's parent Node object, removes each 
     * child Node that is an Element object, and preserves child Nodes which 
     * are not Element objects. 
     * 
     * This is generally the fastest approach for traversing and removing 
     * Element-type child Nodes in most Internet browsers. This is mostly 
     * likely due to underlying implementation reasons in the child Node tree 
     * structure of Internet browsers that make accessing and removing child 
     * Nodes further in the list faster than removing those earlier in the 
     * list. This way, less consecutive child Nodes probably need to be 
     * "reindexed" or the structure's order re-referenced after removal when 
     * accessed later in the list than earlier. 
     * 
     * @returns {boolean} - 
     * - Boolean true if the parent Node either does not contain any 
     *   Element-type child Nodes, or if the child Nodes were traversed in an 
     *   descending, "backward" order and all of the Element-type child Nodes 
     *   were successfully removed. 
     * 
     * - Boolean false if the parent Node does not support the "lastChild" 
     *   and/or "previousSibling" properties necessary for traversing the child 
     *   Nodes in a descending, "backward" order to check and remove any if 
     *   they are Element objects. 
     */
    this.elBackBySibl = function() {

        if (!this.hasChildElements(node)) {

            return true;
        }

        if ("lastChild" in node && "previousSibling" in node) {

            var current = node.lastChild, prev;

            /* The previous node will be null after the first node is 
             reached. */
            while (current) {

                if (this.isElement(current)) {

                    /* Nodes which are removed will have their 
                     "previousSibling" reference set to null, as they are not 
                     attached to any parent Node structure. The previous Node 
                     reference must be saved to not be lost before removing 
                     it, assuming that it is another child Node and not null. */
                    prev = current.previousSibling;
                    node.removeChild(current);
                    current = prev;
                }
                else {

                    current = current.previousSibling;
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Checks whether or not a parent Node has any child Nodes which are 
     * Element objects. 
     * 
     * - If the "childElementCount" property of the Element, Document, or 
     *   DocumentFragment API is supported, then the number of Element object 
     *   child Nodes is converted to a Boolean and returned. 0 is Boolean 
     *   false, while any positive number is true. 
     * 
     * - If the "children" property of the Element, Document, or 
     *   DocumentFragment API is supported, then use the "length" property, 
     *   which indicates the number of entries, contained in the "children" 
     *   property, which is a lively-updated HTMLCollection list of all Element 
     *   object child Nodes. The integer returned is converted to a Boolean 
     *   value: 0 Element entries are false, while any positive number of 
     *   Element entries is true. This check is included since the "children" 
     *   property has had a long history of support on the Element API in many 
     *   Internet browsers. 
     * 
     * @param {any} obj - The Node object which will be checked for whether or 
     * not it has Element object child Nodes. 
     * 
     * @returns {boolean} - 
     * - Boolean true if the Node object passed to the "obj" parameter has any 
     *   Element children indicated by a supported property, or if none of the 
     *   target properties, which tell whether there are any Element child 
     *   Nodes, are supported, and any methods relying on this one need to 
     *   traverse the parent Node's child Nodes to see whether any Element 
     *   child Nodes are present. 
     * 
     * - Boolean false if one of the target properties is 0, indicating that  
     *   the "node" parameter's parent Node value does not have any 
     *   Element-type child Nodes. 
     */
    this.hasChildElements = function(obj) {

        if ("childElementCount" in obj) {

            return !!obj.childElementCount;
        }
        else if ("children" in obj) {

            return !!obj.children.length;
        }

        return true;
    }

    /**
     * Starting at the first child Node and proceeding to the last one in an 
     * ascending, "forward" direction or ordering, this method checks whether 
     * each child Node of the parent function's "node" parameter's parent Node 
     * value is an Element object. If one is, the child Node is removed, and if 
     * it is not, the child Node is preserved. Iterates through the Node 
     * interface's "childNodes" property, which is a lively-updated NodeList of 
     * all of the child Nodes attached to a parent Node. 
     * 
     * This method is mainly intended as a last-scenario fallback for legacy 
     * browsers, as the "childNodes" property has been supported throughout 
     * much of the history of most Internet browsers. It is generally the 
     * slowest of any of the approaches for removing Element-type child Nodes. 
     * Reasons might include: 
     * 
     * - For larger "childNodes" lists, when an Element-type child Node is 
     *   removed towards the beginning, most of the child Nodes after need to 
     *   be reindexed one position downwards, which is a long and 
     *   computationally expensive process. 
     * 
     * - Individual child Nodes must be accessed as entries at a numerically 
     *   indexed offset in the NodeList's Array-like object property structure, 
     *   requiring more time to search for and fetch the value than if it was 
     *   reached by a direct memory reference like with the children properties 
     *   of previous approaches. 
     * 
     * @returns {boolean} - 
     * - Boolean true if the Node interface's "childNodes" property is 
     *   supported and any Element-object child Nodes are successfully removed 
     *   from the "childNodes" list and the parent Node in an ascending, 
     *   "forward" ordering. 
     * 
     * - Boolean false if the Node interface's "childNodes" property is not 
     *   supported, and any Element-object child Nodes could not be removed 
     *   from the "childNodes" property list and the parent Node in an 
     *   ascending, "forward" ordering as a result. 
     */
    this.elForByChildNodes = function() {

        if ("childNodes" in node) {

            var childNodes = node.childNodes, index = 0, child;

            while (index < childNodes.length) {

                child = node.childNodes[index];
                this.isElement(child) ? node.removeChild(child) : index++;
            }

            return true;
        }

        return false;
    }

    /**
     * Starting at the last child Node and proceeding to the first one in an 
     * descending, "forward" direction or ordering, this method checks whether 
     * each child Node of the parent function's "node" parameter's parent Node 
     * value is an Element object. If one is, the child Node is removed, and if 
     * it is not, the child Node is preserved. Iterates through the Node 
     * interface's "childNodes" property, which is a lively-updated NodeList of 
     * all of the child Nodes attached to a parent Node. 
     * 
     * This method is mainly intended as a last-scenario fallback for legacy 
     * browsers, as the "childNodes" property has been supported throughout 
     * much of the history of most Internet browsers. It is generally the 
     * second slowest of any of the approaches for removing Element-type child 
     * Nodes, and the slowest for removing them in reverse order. Reasons might 
     * include: 
     * 
     * - For larger "childNodes" lists, when an Element-type child Node is 
     *   removed, any child Nodes after it need to be reindexed one position 
     *   downwards, which may be a long and computationally expensive process 
     *   if there are lots of child Nodes which are not Element objects. 
     *   However, performance is optimized more than the "forward" direction by 
     *   starting with later entries in the "childNodes" lists, eliminating 
     *   more potential Element entries later in the list that would otherwise 
     *   require extra reindexing. 
     * 
     * - Individual child Nodes must be accessed as entries at a numerically 
     *   indexed offset in the NodeList's Array-like object property structure, 
     *   requiring more time to search for and fetch the value than if it was 
     *   reached by a direct memory reference like with the children properties 
     *   of previous approaches. 
     * 
     * @returns {boolean} - 
     * - Boolean true if the Node interface's "childNodes" property is 
     *   supported and any Element-object child Nodes are successfully removed 
     *   from the "childNodes" list and the parent Node in a descending, 
     *   "backward" ordering. 
     * 
     * - Boolean false if the Node interface's "childNodes" property is not 
     *   supported and any Element-object child Nodes could not be removed from 
     *   the "childNodes" property list and the parent Node in a descending, 
     *   "backward" ordering as a result. 
     */
    this.elBackByChildNodes = function() {

        if ("childNodes" in node) {

            var childNodes = node.childNodes, index = childNodes.length - 1;
            var child;

            while (index >= 0) {

                child = childNodes[index];

                if (this.isElement(child)) {

                    node.removeChild(child);
                }

                index--;
            }

            return true;
        }

        return false;
    }

    /* Main function calling and execution area */
    this.checkParameter();
    return this.tryMethods();
}
