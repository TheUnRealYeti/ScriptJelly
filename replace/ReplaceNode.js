
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
 * Replaces one or more Node objects, representing either currently attached or 
 * unattached DOM elements, with one or more Node objects or strings containing 
 * source HTML code for Nodes, which may or may not also exist in the DOM 
 * structure. Meant to be a polyfill function with near-universal JavaScript 
 * support in both modern and legacy browsers. Modern JavaScript methods for 
 * replacing Nodes are prioritized over legacy ones, but legacy ones are called 
 * if modern methods are not supported. Includes various options for modifying 
 * the replacement behavior. 
 * 
 * Replacement behavior varies depending on the Node type passed to the 
 * function:
 * 
 * - Document nodes passed to the "original" parameter will have all of their 
 *   children removed and replaced by those from a matching Document node 
 *   passed to the "replacement" parameter. A string, passed to the 
 *   "replacement" parameter, to replace a Document node, passed to the 
 *   "original" parameter, must contain a "DOCTYPE html" node and an "html" 
 *   root element, which may or may not have "head" or "body" elements. 
 *   Document nodes CANNOT be replaced by non-Document nodes, as these would 
 *   result in an instable DOM structure for the original node. 
 * 
 * - Similarly, DocumentFragment nodes passed to the "original" parameter will 
 *   have all of their children removed. If a matching DocumentFragment node is 
 *   found in the value passed to the "replacement" parameter, all of its 
 *   children will be inserted into the DocumentFragment node in the "original" 
 *   parameter. If any other type of Node is found in the "replacement" 
 *   parameter, it will be appended as a child to the DocumentFragment in the 
 *   "original" parameter's value. The DOM Nodes represented in an HTML string 
 *   will also be inserted into the DocumentFragment. 
 * 
 * - The behavior for Nodes which are neither DocumentFragment nor Document 
 *   objects and which are passed to the "original" parameter depends on 
 *   whether are attached as children to any parent Nodes: 
 * 
 * - Other Node types, which have parent Nodes, will be replaced as children, 
 *   in the same position, by one or more Node objects in the order specified 
 *   from the "replacement" parameter. 
 * 
 * - If they are entries in an Array, other Node types, which do not have 
 *   parent Nodes and which are passed to the "original" parameter, will have 
 *   each of their references overwritten with either one to a Node or one to a 
 *   collection of multiple replacement Nodes from the "replacement" parameter. 
 *  
 * - Otherwise, all of the children of these other Nodes types, passed to the 
 *   "original" parameter, will be removed. If any associated Nodes passed to 
 *   the "replacement" parameter have any children, these children will either 
 *   be appended or copied to the Node from the "original" parameter to become 
 *   its children. If any associated Nodes passed to the "replacement" 
 *   parameter do not have children, they will each be appended or copied to 
 *   the Node from the "original" parameter as a child. 
 * 
 * @param {Node | Array<Node> | HTMLCollection<Node> | 
 * NodeList<Node>} original - Required. 
 * 
 * Either contains a single Node object or a non-empty list data structure of 
 * Node objects to be replaced. Such list types include: Arrays, live 
 * HTMLCollections, and static or live NodeLists. Note that while a list data 
 * structure passed to this parameter does not does not strictly have to 
 * contain Node entries, any entries which are not Node objects are ignored. 
 * 
 * @param {Node | string | Array<Node|string> | HTMLCollection<Node> | 
 * NodeList<Node>} replacement - Required. 
 * 
 * Either contains a single Node object, a string with HTML markup data for DOM 
 * elements, or a non-empty list data structure with either Node objects or 
 * strings with HTML markup for DOM elements. Such list object types include: 
 * Arrays with Node or string entries, live HTMLCollections of Element object 
 * entries, or static or live NodeLists with Node, especially Element, object 
 * entries. 
 * 
 * @param {object} options - Optional. 
 * 
 * An object containing 1-3 Boolean-value properties that modify the 
 * replacement behavior of this function. Note that the values of the 
 * properties may be other data types than Boolean, as long as they are truthy 
 * or falsy, to achieve the same effect. By default, if unmodified, all 
 * properties are set to Boolean false. The supported "options" properties are: 
 * 
 * "copyNodes": 
 * - If true, instructs the function to make deep copies of each Node 
 *   object passed to the "replacement" parameter before replacing any Node 
 *   objects passed to the "original" parameter. Also instructs the function to 
 *   make deep copies of children from a Node object in the "replacement 
 *   parameter" which are replacing all of the children of a Node in the 
 *   "original" parameter. This is useful for preserving the original copies of 
 *   Node objects passed to the "replacement" parameter, especially if they 
 *   represent DOM elements in a page that should be left at their current 
 *   positions or if a programmer wants to reuse the original copies of 
 *   unattached, parentless Node objects later. 
 * 
 * - If false, the same copies of each Node object passed to the "replacement" 
 *   parameter will be used for replacing Node objects passed to the "original" 
 *   parameter, with no copying involved. Thus, Node objects passed to the 
 *   "replacement" parameter, with or without any Node parent, will have their 
 *   Node parent reset to that of the associated Node passed to the "original" 
 *   parameter. Similarly, child Nodes a from "replacement" parameter Node will 
 *   removed from that Node and will be added as the new child Nodes of a Node 
 *   from the "replacement" parameter. 
 * 
 * "getNewList": 
 * If true, instructs the function to return an Array of the resulting Node 
 * objects from the replacement process. Possible entries include: 
 *   - Node objects passed to the "original" parameter that were not 
 *     replaced; 
 *   - Single Node objects from the "replacement" parameter, either passed as 
 *     Node objects originally or parsed from an HTML markup string, that 
 *     replaced a single Node object from the "original" parameter;  
 *   - A sub-Array of multiple Node objects passed to the "replacement" 
 *     parameter, either originally passed as a Node object or parsed from a 
 *     string with HTML markup, that replaced a single Node object from the 
 *     "original" parameter; 
 *   - If a Node object passed to the "replacement" parameter is a Document or 
 *     DocumentFragment, then either a single child Node reference or a 
 *     sub-Array of two or more children moved from the Document or 
 *     DocumentFragment to become children of the Node object passed to the 
 *     "original" parameter will be returned. 
 *   - If a Node object passed to the "replacement" parameter is a type other 
 *     than a Document or DocumentFragment, then a single child Node reference, 
 *     a sub-Array of two or more children, or the Node from the "replacement" 
 *     parameter itself, if it has no child Nodes, that was appended as one or 
 *     more child Nodes of the Node object from the "original" parameter, will 
 *     be returned. 
 * If false, the function will return its default value of an integer 
 * containing the number of Node objects passed to the "original" parameter 
 * that were successfully replaced by one or more Node object entries from the 
 * "replacement" parameter. 
 * 
 * "replaceOnce": 
 * - If true, instructs the function to only replace entries with the same 
 *   corresponding numerical index as each other in the values passed to the 
 *   "original" and "replacement" parameters. In other words, single Node 
 *   object values passed the two parameters will replace each other, while 
 *   list data structures will only replace entries at index 0 in the 
 *   "original" parameter with one or more entries at index 0 in the 
 *   "replacement" parameter, entries at index 1 with those at index 1, entries 
 *   at index 2 with those at index 2, and so on. If one of the parameters has 
 *   a longer list than the other, the function will only replace parameters up 
 *   to the end of the shorter list, at which point the other entries in the 
 *   longer list will be left unaffected. 
 * 
 * - If false, instructs the function to replace each Node object passed to the 
 *   "original" parameter with ALL of the Node objects either directly passed 
 *   to or parsed from HTML markup strings passed to the "replacement" 
 *   parameter, each time. If a list data structure is passed to the "original" 
 *   parameter, each Node object, and all its children, directly passed to the 
 *   "replacement" parameter will be deep copied, and each string with HTML 
 *   markup passed to the "replacement" parameter will be reparsed to extract 
 *   new Node objects separately, for each Node passed to the "original" 
 *   parameter that is to be replaced. Behavior for each Node object passed to 
 *   the "replacement" parameter has the same effect as a "cloneNode" optional 
 *   property value of true. Otherwise, if a single Node object is passed to 
 *   the "original" parameter, the Node objects in the "replacement" parameter 
 *   will only be deep copied if the "cloneNodes" property passed to the 
 *   "options" parameter is set to true. Every Node from the "replacement" 
 *   parameter will be returned in a sub-Array for each entry in a return array 
 *   if the "getNewList" property is set to "true." 
 * 
 * Note that any deep copies made from applying an option DO NOT preserve any 
 * event listeners attached to a Node object from the "replacement" parameter 
 * beforehand. 
 * 
 * @returns {number | Array<Node>} - 
 * - By default, if the "getNewList" property of the "options" object parameter 
 *   is falsy, returns an integer representing the number of Node objects 
 *   passed to the "original" parameter which were replaced by Node objects 
 *   either directly passed to or parsed from an HTML markup string passed to 
 *   the "replacement" parameter. 
 * 
 * - If the "getNewList" property of the "options" object parameter is truthy, 
 *   returns an Array containing any Node objects passed to the "original" 
 *   parameter which were not replaced, a single Node object passed to the 
 *   "replacement" parameter which replaced a single Node entry passed to the 
 *   "original" parameter, or a sub-Array containing multiple Node objects 
 *   passed to the "replacement" parameter which replaced a single Node object 
 *   passed to the "original" parameter. 
 */
function replaceNode(original, replacement, options) {

    this.isOrigList, this.replNode, this.replStaticList, this.hasTwoParam;
    this.copyNodes, this.getNewList, this.replaceOnce;

    this.checkOptions = function() {

        if (typeof options === "undefined") {

            return;
        }

        if (options && typeof options === "object") {

            this.copyNodes = !!options.copyNodes;
            this.getNewList = !!options.getNewList;
            this.replaceOnce = !!options.replaceOnce;
            return;
        }
        
        throw new TypeError("Value passed to \"options\" parameter must be a " 
            + "non-null object with option entries.");
    }

    this.checkParamList = function(paramVal, paramName) {

        if (typeof paramVal !== "object" 
            || typeof paramVal.length !== "number") {

            return false;
        }

        if (paramVal.length) {

            return true;
        }

        throw new RangeError("The value passed to parameter \"" + paramName 
            + "\" must not be an empty list data structure.");
    }

    this.tryMethods = function() {

        this.checkOptions();
        this.isOrigList = this.checkParamList(original, "original");

        if (this.getNewList) {

            this.replNode = [];
        }

        if (this.isNode(replacement)) {

            return this.tryReplacingOrig(this.byDirectReplace);
        }

        if (typeof replacement === "string") {

            return this.tryReplacingOrig(function(origNode, index) {
                return this.byStringReplace(origNode, replacement, true, 
                    this.replNode, index);
            });
        }

        if (this.checkParamList(replacement, "replacement")) {

            if (this.isOrigList) {

                return this.replaceOnce ? this.listReplaceOnce() 
                    : this.tryReplacingOrig(this.listReplaceEach);
            }

            return this.tryReplacingOrig(this.listReplaceEach);
        }

        throw new TypeError("The value passed to parameter \"replacement\" " 
            + "must be a Node object, a string, or a list data structure " 
            + "containing Node objects.");
    }

    this.tryReplacingOrig = function(replaceFn) {

        if (this.isNode(original)) {

            if (replaceFn(original)) {

                return this.getNewList ? this.replNode[0] : 1;
            }
            
            return 0;
        }

        if (this.isOrigList) {
            
            return this.replaceOrigList(replaceFn);
        }

        throw new TypeError("Parameter \"original\" needs to be a Node object " 
            + "or a list data structure of Node objects.");
    }

    this.replaceOrigList = function(replaceFn) {
        
        var index, entry, numRepl = 0, prevLen;

        for (index = original.length - 1; index >= 0; index--) {

            entry = original[index];

            if (this.getNewList) {

                prevLen = this.replNode.length;
            }

            if (this.isNode(entry)) {
                
                if (replaceFn(entry, index)) {

                    if (this.getNewList) {
                    
                        if (this.replNode.length === prevLen) {
    
                            this.replNode.push(entry);
                        }
                    }
                    else {
    
                        numRepl++;
                    }
                }
            }
        }

        return this.getNewList ? this.replNode : numRepl;
    }

    this.byDirectReplace = function(origNode, index) {

        if (this.isDocument(replacement)) {

            if (this.isDocument(origNode)) {

                this.removeChildren(origNode);
                this.copyToTarget(replacement, origNode, this.copyNodes);
                return true;
            }

            throw new TypeError("The value passed to the \"origNode\" " 
                + "parameter must be a Document node if its \"head\" and " 
                + "\"body\" sections are to be replaced by those from the " 
                + "Document node passed to the \"replacement\" parameter.");
        }

        var src;
        this.copyNodes ? src = replacement.cloneNode(true) : src = replacement;

        if (this.isDocumentFragment(origNode)) {

            this.removeChildren(origNode);
            origNode.appendChild(src);
            return true;
        }
        else if (origNode.parentNode) {
            
            var result = this.directReplaceMethods(origNode, src);

            if (result && this.getNewList && !this.isDocumentFragment(src)) {

                this.replNode.push(src);
            }
            
            return result;
        }

        if (typeof index === "number" && original instanceof Array) {

            original[index] = origNode = replacement;
            return true;
        }

        this.removeChildren(origNode);

        replacement.firstChild 
            ? this.copyToTarget(src, origNode, this.copyNodes)
            : origNode.appendChild(replacement);

        if (this.getNewList) {

            this.replNode.push(origNode);
        }

        return true;
    }

    this.directReplaceMethods = function(oldNode, newNode) {

        var result = this.tryReplaceWith(oldNode, newNode);

        if (result !== null) {

            return result;
        }

        result = this.tryReplaceChild(oldNode, newNode);

        if (result !== null) {

            return result;
        }

        result = this.tryOuterHTML(oldNode, newNode);

        if (result !== null) {

            return result;
        }

        return false;
    }

    this.tryReplaceWith = function(oldNode, newNode) {

        if (oldNode.replaceWith) {

            oldNode.replaceWith(newNode);
            return true;
        }
        
        return null;
    }

    this.tryReplaceChild = function(oldNode, newNode) {

        var nodeParent = oldNode.parentNode;

        if (nodeParent && nodeParent.replaceChild) {

            nodeParent.replaceChild(newNode, oldNode);
            return true;
        }

        return null;
    }

    this.tryOuterHTML = function(destEl, srcEl) {

        if (typeof destEl.outerHTML === "string" 
            && typeof destEl.outerHTML === "string") {

            destEl.outerHTML = srcEl.outerHTML;
            return true;
        }

        return null;
    }

    this.byStringReplace = function(origNode, replaceStr, removeOrig, 
        resultArray, index) {

        return this.replaceByAdjHTML(origNode, replaceStr, removeOrig, 
                resultArray) 
            || this.replaceWithTempCont(origNode, replaceStr, removeOrig, 
                resultArray, index);
    }

    this.replaceByAdjHTML = function(origNode, replaceStr, removeOrig, 
        resultArray) {

        if (resultArray || !origNode.insertAdjacentHTML 
            || !origNode.parentNode || this.getTagName(origNode) === "html") {

            return false;
        }

        var ownerDoc = this.getOwnerDocument(origNode);

        if (!ownerDoc) {

            return false;
        }

        var docHead = this.getFirstByTag(ownerDoc, "head");

        if (docHead && /<\/?head(\s[\s\S]*)?>/i.test(replaceStr)) {

            return false;
        }

        var docBody = this.getFirstByTag(ownerDoc, "body");

        if (docBody && /<\/?body(\s[\s\S]*)?>/i.test(replaceStr)) {

            return false;
        }

        try {

            origNode.insertAdjacentHTML("beforebegin", replaceStr); 
        }
        catch (e) { 

            return false; 
        }

        if (removeOrig) {

            origNode.parentNode.removeChild(origNode);
        }
        
        return true;
    }

    this.replaceWithTempCont = function(origNode, replaceStr, removeOrig, 
        resultArray, index) {

        if (!origNode.insertBefore && !origNode.replaceChild) {

            return false;
        }
        
        var tempCont = this.createTempCont(origNode, replaceStr);

        if (resultArray) {

            this.copyChildren(tempCont, resultArray, false);
        }

        var nodeParent = origNode.parentNode;

        if (nodeParent) {

            if (this.getTagName(origNode) === "html") {

                this.removeChildren(nodeParent);
                this.copyToTarget(tempCont, nodeParent, false);
                return true;
            }

            nodeParent.insertBefore 
                ? this.stringInsertBefore(origNode, nodeParent, tempCont, 
                    removeOrig) 
                : this.stringReplaceChild(origNode, nodeParent, tempCont, 
                    removeOrig);
            
            return true;
        }
        
        if (this.isDocument(origNode) 
            || this.isDocumentFragment(origNode)) {

            this.removeChildren(origNode);
        }
        else if (typeof index === "number" && original instanceof Array) {

            original[index] = origNode = document.createDocumentFragment();
        }
        else {

            this.removeChildren(origNode);
        }
        
        this.copyToTarget(tempCont, origNode, false);
        return true;
    }

    this.createTempCont = function(origNode, replaceStr) {
        
        /* Matches any html-tag root Element for a DOM, optionally preceded by 
         whitespace and/or HTML comment nodes, at the beginning of the source 
         string. Inserts a "DOCTYPE html" node before it to specify that the 
         source string represents the DOM child structure of a Document 
         object. Creates a new HTML document with DOM structure nodes parsed 
         from the source string. */
        if (/^([\s]*(<!--(.)*-->)?[\s]*)<html(\s[\s\S]*)?/i.test(replaceStr)) {
            
            replaceStr = "<!DOCTYPE html>" + replaceStr;
            return this.createNewHTMLDoc(replaceStr);
        }

        /* Matches any "DOCTYPE html" node, optionally preceded by whitespace 
         characters and/or HTML comment nodes, at the beginning of the source 
         string. A "DOCTYPE html" node indicates to an Internet browser that 
         the document type is HTML. Creates a new HTML document with DOM 
         structure nodes parsed from the source string.*/
        if (/^([\s]*(<!--(.)*-->)?[\s]*)<!doctype[\s]+html/i.test(replaceStr)) {
            
            return this.createNewHTMLDoc(replaceStr);
        }
        /* Throws an exception if the original Node object is a Document object 
         or html-tag root Element and the source string does not contain a 
         "DOCTYPE html" node or html-tag root Element, which are necessary for 
         creating an HTMLDocument object. */
        else if (this.isDocument(origNode) 
            || this.getTagName(origNode) === "html") {

            throw new RangeError("The string passed to the \"replaceStr\" " 
                + "parameter must contain \"DOCTYPE html\" and \"html\" tag " 
                + "root nodes at its start.");
        }

        /* Creates a new html-tag root Element for a Document object if the 
         source string contains either a head or body Element. Returns the html 
         Element if both a head and body tag were present in the source string. 
         Otherwise, returns either the head or the body element is only one was 
         present in the source string. */
        var hasHead = /<\/?head(\s[\s\S]*)?>/i.test(replaceStr);
        var hasBody = /<\/?body(\s[\s\S]*)?>/i.test(replaceStr);
        var tempCont;
        
        if (hasHead || hasBody) {

            tempCont = document.createElement("html");
            tempCont.innerHTML = replaceStr;

            if (hasHead && hasBody) {

                return tempCont;
            }
            
            if (hasHead) {

                return this.getFirstByTag(tempCont, "head");
            }

            return this.getFirstByTag(tempCont, "body");
        }

        /* If the Range API and its createContextualFragment() method are 
         supported, creates a new DocumentFragment node containing Nodes 
         parsed from the source string. Only used when doctype, html, head, and 
         body nodes are not present, as this parser will eliminate them. */
        if (document.createRange) {

            var range = document.createRange();

            if (range.createContextualFragment) {

                return range.createContextualFragment(replaceStr);
            }
        }

        /* If the source string does not contain doctype, html, head, or body 
         nodes in its structure, return a div Element with any DOM nodes from 
         the string parsed as its children. */
        tempCont = document.createElement("div");
        tempCont.innerHTML = replaceStr;
        return tempCont;
    }

    this.createNewHTMLDoc = function(srcStr) {

        if (typeof DOMParser !== "undefined") {

            return (new DOMParser).parseFromString(srcStr, "text/html");
        }
        
        var newDoc;

        if (document.implementation.createHTMLDocument) {

            newDoc = document.implementation.createHTMLDocument("");
        }
        else if (typeof ActiveXObject !== "undefined") {

            newDoc = new ActiveXObject("htmlfile");
        }
        else {

            return null;
        }

        newDoc.documentElement.innerHTML = srcStr;
        return newDoc;
    }

    this.stringInsertBefore = function(origNode, nodeParent, tempCont, 
        removeOrig) {
        
        if (this.isDocumentFragment(tempCont)) {

            nodeParent.insertBefore(tempCont, origNode);
        }
        else {

            while (tempCont.firstChild) {

                nodeParent.insertBefore(tempCont.firstChild, origNode);
            }
        }

        if (removeOrig) {

            nodeParent.removeChild(origNode);
        }
    }

    this.stringReplaceChild = function(origNode, nodeParent, tempCont, 
        removeOrig) {
        
        if (!removeOrig) {

            throw new RangeError("stringReplaceChild() method cannot be used " 
                + "without replacing the original node.");
        }

        if (this.isDocumentFragment(tempCont)) {

            nodeParent.replaceChild(tempCont, origNode);
            return;
        }

        var copyCont = document.createDocumentFragment();
        this.copyToTarget(tempCont, copyCont, false);
        nodeParent.replaceChild(copyCont, origNode);
    }

    this.listReplaceOnce = function() {

        if (!this.replStaticList) {

            replacement instanceof Array 
                ? this.replStaticList = replacement 
                : this.replStaticList = this.copyToStaticList(replacement);
        }

        var index = 0, targetLength, origEntry, replEntry;
        var numRepl = 0, strResult;

        original.length <= replacement.length 
            ? targetLength = original.length  
            : targetLength = replacement.length;

        for (index = targetLength - 1; index >= 0; index--) {

            origEntry = original[index];

            if (!this.isNode(origEntry)) {

                continue;
            }

            replEntry = this.replStaticList[index];

            if (this.isDocument(origEntry)) {
                
                if (typeof replEntry === "string") {

                    if (!/^([\s]*(<!--(.)*-->)?[\s]*)<!doctype[\s]+html/i.
                            test(replEntry) 
                        && !/^([\s]*(<!--(.)*-->)?[\s]*)<html(\s[\s\S]*)?/i.
                            test(replEntry)) {

                        throw new RangeError("The string entry at index " 
                            + index + " of the list passed to the " 
                            + "\"replacement\" parameter must contain a " 
                            + "\"DOCTYPE html\" node and an \"html\" tag root " 
                            + "Element in order to replace the Document node " 
                            + "entry at index " + index + " of the list " 
                            + "passed to the \"original\" parameter.");
                    }
                }
                else if (!this.isDocument(replEntry)) {

                    throw new TypeError("The entry at index " + index 
                        + " of the list passed to the \"replacement\" " 
                        + "parameter must be a Document node in order to " 
                        + "replace the Document node entry at index " 
                        + index + " of the list passed to the " 
                        + "\"original\" parameter.");
                }
            }
            
            if (this.isNode(replEntry)) {

                if (this.copyNodes) {

                    replEntry = replEntry.cloneNode(true);
                }

                if (this.isDocument(replEntry)) {

                    if (!this.isDocument(origEntry)) {

                        throw new TypeError("The entry at index " + index 
                            + " of the list passed to the \"original\" " 
                            + "parameter must be a Document node in order to " 
                            + "be replaced by the Document node entry at " 
                            + "index " + index + " of the list passed to the " 
                            + "\"original\" parameter.");
                    }

                    this.getNewList 
                        ? this.replNode = this.copyChildren(replEntry, 
                            this.replNode, true) 
                        : numRepl++;

                    this.removeChildren(origEntry);
                    this.copyToTarget(replEntry, origEntry, this.copyNodes);
                }
                else if (this.isDocumentFragment(origEntry)) {

                    this.removeChildren(origEntry);

                    if (this.isDocumentFragment(replEntry)) {

                        this.getNewList 
                            ? this.replNode = this.copyChildren(replEntry, 
                                this.replNode, true) 
                            : numRepl++;

                        this.copyToTarget(replEntry, origEntry, 
                            this.copyNodes);
                    }
                    else {

                        this.getNewList ? this.replNode.push(replEntry) 
                            : numRepl++;

                        origEntry.appendChild(replEntry);
                    }
                }
                else if (origEntry.parentNode) {

                    if (this.getNewList) {

                        this.isDocumentFragment(replEntry) 
                            ? this.replNode = this.copyChildren(replEntry, 
                                this.replNode, true) 
                            : this.replNode = [replEntry].concat(this.replNode);
                    }
                    else {

                        numRepl++;
                    }

                    this.directReplaceMethods(origEntry, replEntry);
                }
                else {

                    this.removeChildren(origEntry);

                    if (replEntry.firstChild) {

                        this.copyToTarget(replEntry, origEntry, this.copyNodes);
                    }
                    else {

                        origEntry.appendChild(replChild);
                    }

                    this.getNewList 
                        ? this.replNode = [replEntry].concat(this.replNode) 
                        : numRepl++;
                }
            }
            else if (typeof replEntry === "string") {

                if (this.getNewList) {

                    strResult = [];
                }

                if (this.byStringReplace(origEntry, replEntry, true, 
                        strResult)) {

                    if (this.getNewList) {
                        
                        this.replNode = [strResult[0]].concat(this.replNode);
                    } 
                    else {

                        numRepl++;
                    }
                }
            }
            else {

                throw new TypeError("The entry at index " + index 
                    + " of the value passed to the \"replacement\" parameter " 
                    + "must either be a Node object or a string.");
            }
        }

        return this.getNewList ? this.replNode : numRepl;
    }

    this.listReplaceEach = function(origNode, index) {

        if (!this.replStaticList) {

            replacement instanceof Array ? this.replStaticList = replacement 
                : this.replStaticList = this.copyToStaticList(replacement);
        }

        var nodeParent = origNode.parentNode;

        if (nodeParent) {

            return this.replaceEachMethods(origNode, nodeParent, origNode);
        }

        if (!this.isDocument(origNode) && !this.isDocumentFragment(origNode) 
            && typeof index === "number" && original instanceof Array) {

            original[index] = origNode = document.createDocumentFragment();
        }

        this.appendEach(origNode);
        return true;
    }

    this.replaceEachMethods = function(origNode, nodeParent, posNode) {

        var result = this.insertEachBefore(origNode, nodeParent, posNode);

        if (result !== null) {

            return result;
        }

        result = this.replaceChildWithEach(origNode, nodeParent, posNode);

        if (result !== null) {

            return result;
        }

        return false;
    }

    this.insertEachBefore = function(origNode, nodeParent, posNode) {

        if (!nodeParent.insertBefore) {

            return null;
        }

        var isOrigDoc = this.isDocument(origNode);
        var index, entry, replLen = this.replStaticList.length;
        var listCopies, makeCopy;
        this.isOrigList ? makeCopy = true : makeCopy = this.cloneNodes;
        
        if (this.getNewList) {

            listCopies = [];
        }

        for (index = 0; index < replLen; index++) {

            entry = this.replStaticList[index];

            if (this.isNode(entry)) {

                if (makeCopy) {

                    entry = entry.cloneNode(true);
                }

                if (this.isDocument(entry)) {

                    if (!isOrigDoc) {
    
                        throw new TypeError("\"origNode\" parameter must " 
                            + "be a Document node to be replaced by the " 
                            + "Document node at index " + index + " of the " 
                            + "\"replacement\" parameter's list.");
                    }
                }
                else {

                    if (this.getNewList) {

                        this.isDocumentFragment(entry) 
                            ? this.copyChildren(entry, listCopies, false) 
                            : listCopies.push(entry);
                    }

                    nodeParent.insertBefore(entry, posNode);
                }
            }
            else if (typeof entry === "string") {

                this.byStringReplace(posNode, entry, false, listCopies);
            }
            else {

                throw new TypeError("The entry at index " + index 
                    + " of the \"replacement\" parameter's value must either " 
                    + "be a Node object or string.");
            }
        }

        this.copyListNodes(listCopies);
        nodeParent.removeChild(posNode);
        return true;
    }

    this.replaceChildWithEach = function(origNode, nodeParent, posNode) {

        if (!nodeParent.replaceChild) {

            return null;
        }

        var isOrigDoc = this.isDocument(origNode);
        var docFrag = document.createDocumentFragment();
        var index = 0, replLen = this.replStaticList.length;
        var entry, listCopies;
        this.isOrigList ? makeCopy = true : makeCopy = this.cloneNodes;

        if (this.getNewList) {

            listCopies = [];
        }

        for (index = 0; index < replLen; index++) {

            entry = this.replStaticList[index];

            if (this.isNode(entry)) {

                if (makeCopy) {

                    entry = entry.cloneNode(true);
                }

                if (this.isDocument(entry)) {

                    if (!isOrigDoc) {

                        throw new TypeError("\"origNode\" parameter must " 
                            + "be a Document node to be replaced by the " 
                            + "Document node at index " + index + " of the " 
                            + "\"replacement\" parameter's list.");
                    }
                }
                else {

                    if (this.getNewList) {

                        this.isDocumentFragment(entry) 
                            ? this.copyChildren(entry, listCopies, false) 
                            : listCopies.push(entry);
                    }

                    docFrag.appendChild(entry);
                }
            }
            else if (typeof entry === "string") {

                this.copyStringNodes(docFrag, entry, origNode, listCopies);
            }
            else {

                throw new TypeError("The entry at index " + index 
                    + " of the \"replacement\" parameter's value must either " 
                    + "be a Node object or a string.");
            }
        }

        this.copyListNodes(listCopies);
        nodeParent.replaceChild(docFrag, posNode);
        return true;
    }

    this.copyStringNodes = function(docFrag, srcStr, origNode, resultArray) {
        
        var tempCont = this.createTempCont(origNode, srcStr);

        if (resultArray) {

            this.copyChildren(tempCont, resultArray, false);
        }

        this.copyToTarget(tempCont, docFrag, false);
        return true;
    }

    this.appendEach = function(origNode) {

        var isOrigDoc = this.isDocument(origNode);
        var replLen = this.replStaticList.length, lastIndex = replLen - 1;
        var index, entry, makeCopy;
        this.isOrigList ? makeCopy = true : makeCopy = this.cloneNodes;

        for (index = 0; index < replLen; index++) {

            entry = this.replStaticList[index];

            if (this.isNode(entry)) {

                this.removeChildren(origNode);

                if (makeCopy) {

                    entry = entry.cloneNode(true);
                }

                if (this.isDocument(entry)) {

                    if (!isOrigDoc) {
    
                        throw new TypeError("\"origNode\" parameter must " 
                            + "be a Document node to be replaced by the " 
                            + "Document node at index " + index + " of the " 
                            + "\"replacement\" parameter's list.");
                    }

                    if (index === lastIndex && this.getNewList) {

                        this.copyChildren(entry, this.replNode, false);
                    }
    
                    this.copyToTarget(entry, origNode, !makeCopy);
                }
                else if (this.isDocumentFragment(entry)) {

                    if (index === lastIndex && this.getNewList) {

                        this.copyChildren(entry, this.replNode, false);
                    }

                    origNode.appendChild(entry);
                }
                else if (entry.firstChild) {

                    if (index === lastIndex && this.getNewList) {

                        this.copyChildren(entry, this.replNode, false);
                    }
    
                    this.copyToTarget(entry, origNode, !makeCopy);
                }
                else {

                    if (index === lastIndex && this.getNewList) {

                        this.replNode.push(entry);
                    }

                    origNode.appendChild(entry);
                }
            }
            else if (typeof entry === "string") {

                this.removeChildren(origNode);

                index === lastIndex
                    ? this.byStringReplace(origNode, entry, false, 
                        this.replNode) 
                    : this.byStringReplace(origNode, entry, false);
            }
            else {

                throw new TypeError("The entry at index " + index 
                    + " of the \"replacement\" parameter's value must either " 
                    + "be a Node object or string.");
            }
        }
    }

    this.copyListNodes = function(listCopies) {

        if (!listCopies || !listCopies.length) {

            return false;
        }

        var newNodes = [], outerIndex, outerEntry, innerIndex, innerEntry;

        for (outerIndex = 0; outerIndex < listCopies.length; outerIndex++) {

            outerEntry = listCopies[outerIndex];

            if (outerEntry instanceof Array) {

                for (innerIndex = 0; innerIndex < listCopies.length; 
                    innerIndex++) {
                    
                    innerEntry = outerEntry[innerIndex];
                    newNodes.push(innerEntry);
                }
            }
            else {

                newNodes.push(outerEntry);
            }
        }

        this.replNode.push(newNodes);
        return true;
    }

    /* SECTION FOR COMMON DEPENDENCY METHODS IN MAIN METHOD BODY */

    this.isNode = function(obj) {

        if (typeof Node !== "undefined") {

            return obj instanceof Node;
        }

        return !!(obj && obj.appendChild);
    }

    this.isDocument = function(obj) {

        if (typeof HTMLDocument !== "undefined") {

            return obj instanceof HTMLDocument;
        }

        return !!(obj && obj.nodeType === 9);
    }

    this.getOwnerDocument = function(node) {

        if (this.isDocument(node)) {

            return node;
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

    this.getTagName = function(node) {

        var tagName = node.nodeName || node.tagName;
        return tagName ? tagName.toLowerCase() : "";
    }

    this.getFirstByTag = function(contObj, tagName) {

        if (contObj.querySelector) {

            return contObj.querySelector(tagName);
        }

        if (contObj.getElementsByTagName) {

            var result = contObj.getElementsByTagName(tagName);
            return result ? result[0] : null;
        }

        return null;
    }

    this.isDocumentFragment = function(obj) {

        if (typeof DocumentFragment !== "undefined") {

            return obj instanceof DocumentFragment;
        }

        return !!(obj && obj.nodeType === 11);
    }

    this.copyToTarget = function(src, dest, copy) {

        if (copy && typeof replacement !== "string") {

            var srcNode = src.firstChild;

            while (srcNode) {

                dest.appendChild(srcNode.cloneNode(true));
                srcNode = srcNode.nextSibling;
            }

            return;
        }

        while (src.firstChild) {

            dest.appendChild(src.firstChild);
        }
    }

    this.copyToStaticList = function(list) {

        var index, entry, newList = [];

        for (index = 0; index < list.length; index++) {

            entry = list[index];
            newList.push(entry);
        }

        return newList;
    }

    this.copyChildren = function(srcCont, resultArray, atStart) {

        var child, childNodes = srcCont.childNodes;

        if (childNodes.length === 1) {

            child = childNodes[0];

            if (atStart) {
            
                return [child].concat(resultArray);
            }
    
            resultArray.push(child);
            return;
        }

        var tempNodes = [];

        for (var index = 0; index < childNodes.length; index++) {

            child = childNodes[index];
            tempNodes.push(child);
        }
        
        if (atStart) {
            
            return [tempNodes].concat(resultArray);
        }

        resultArray.push(tempNodes);
    }

    this.removeChildren = function(clearNode) {

        while (clearNode.lastChild) {

            clearNode.removeChild(clearNode.lastChild);
        }
    }

    return this.tryMethods();
}
