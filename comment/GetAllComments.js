
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
 * Gets either all Comment Nodes or only those Comment Nodes containing a 
 * search phrase inside of a given containing Node object's DOM structure. 
 * Intended to have near-universal Internet browser support. 
 * 
 * @param {object} options - 
 * Optional object with key-value pair properties for modifying function 
 * behavior. Possible values are: 
 * 
 * - "container": Specifies a Node object which will have Comment Nodes inside 
 *   of its DOM structure retrieved. Possible Node types include Document, 
 *   Element, and DocumentFragment. If undefined, the current page's Document 
 *   object will be used. 
 * 
 * - "search": A string search phrase which Comment Nodes must contain inside 
 *   of their text contents. 
 * 
 * - "caseSensitive": Boolean or truthy/falsy value. If the "search" property 
 *   is specified, case sensitively searches for the string phrase inside of 
 *   the text contents of Comment Nodes. In other words, parts of a Comment 
 *   node's text content must have the exact same sequence of uppercase and 
 *   lowercase letters as the string search phrase in order to be a match; e.g. 
 *   "TEST" is not the same as "test". If undefined, the phrase search will be 
 *   case insensitive, e.g. "tEsT" is the same as "test". 
 * 
 * - "wholeWord": Boolean or truthy/falsy value. If the "search" property is 
 *   specified, only searches for whole-word matches for the string phrase 
 *   inside of the text contents of Comment Nodes. For example, the search 
 *   phrase "whole" is not matched if it is part of the phrase "wholeWord" in a 
 *   Comment node, but it is matched if it is separated from other words in the 
 *   Comment node by spacing or punctuation characters. 
 * 
 * @returns { Array<Comment> } - 
 * An Array containing all of the matching Comment Nodes inside of the 
 * containing Node object's DOM hierarchical structure. 
 */
function getAllComments(options) {

    /** 
     * Contains a reference to the current function's scope for functions with 
     * a different "this" reference value. 
     */
    var self = this;

    /**
     * Contains a reference to the Node object optionally specified in the 
     * "options" parameter which will have its DOM structure searched for 
     * matching Comment Nodes. Otheriwse, this will be set to the calling web 
     * page's default "document" node reference. 
     */
    var container;
    
    /**
     * If given in the "options" parameter's "search" property, contains a 
     * string phrase which must be found inside of Comment Nodes. Otherwise, it 
     * is undefined. 
     */
    var search;

    /**
     * Sets global Window references to standard JavaScript interfaces and 
     * classes required for type-checking in the function in case they are not 
     * already defined. A reference to any interface or class not supported by 
     * a user's Internet browser will have a value of undefined. 
     */
    this.setApiRef = function() {

        Document = window.Document;
        Element = window.Element;
        DocumentFragment = window.DocumentFragment;
        Comment = window.Comment;
    }

    /**
     * Checks whether the "options" parameter is a non-null object, and checks 
     * the types and values of function behavior-modifying key-value pairs 
     * inside of it. Sets "container" to the web page's current "document" 
     * reference object by default. 
     * 
     * @throws - 
     * - TypeError exception if the value passed to the "options" parameter is 
     *   neither undefined nor an object or if it is null. 
     */
    this.checkOptions = function() {

        if (typeof options === "undefined") {

            container = document;
            return;
        }

        if (typeof options !== "object" || !options) {

            throw new TypeError("The value passed to the \"options\" " 
                + "parameter must be a non-null object with optional " 
                + "key-value properties.");
        }

        this.checkContOption();
        this.checkSearchOption();
    }

    /**
     * Checks whether the "options" parameter's "container" property is defined 
     * and if it is, checks whether it is a Document, Element, or 
     * DocumentFragment object. Sets "container" to the web page's current 
     * "document" reference object by default if the property is undefined. 
     */
    this.checkContOption = function() {

        if (typeof options.container === "undefined") {

            container = document;
            return;
        }

        container = options.container;

        if (!this.isDocument(container) && !this.isElement(container) 
            && !this.isDocumentFragment(container)) {

            throw new TypeError("The value passed to the \"options." 
                + "container\" parameter must either be a Document, " 
                + "Element, or DocumentFragment object.");
        }
    }

    /**
     * Checks whether the "options" parameter's "search" property is defined, 
     * and if it is, checks whether it is a string. 
     * 
     * If the "options" parameter's "wholeWord" property is defined, the RegExp 
     * (regular expression) object generated from the search phrase string will 
     * be preceded and followed by "\b" boundary delimeters, telling it to only 
     * find whole-word matches for the search phrase. 
     * 
     * If the "options" parameter's "caseSensitive" property is truthy, does 
     * not append any flags to the RegExp (regular expression) object made from 
     * the search phrase string in "search"; otherwise, the case insensitive 
     * "i" search flag is appended. 
     */
    this.checkSearchOption = function() {

        if (typeof options.search === "undefined") {

            return;
        }

        search = options.search;

        if (typeof search !== "string") {

            throw new TypeError("The value passed to the \"search\" " 
                + "parameter must be a string.");
        }

        if (search) {

            if (options.wholeWord) {

                search = "\\b" + search + "\\b";
            }

            search = options.caseSensitive ? new RegExp(search) 
                : new RegExp(search, "i");
        }
    }

    /**
     * Checks whether or not a value is an Element object. 
     * 
     * @param {any} obj - The value to be checked 
     * @returns {boolean} - Boolean true or false 
     */
    this.isElement = function(obj) {

        return Element ? obj instanceof Element 
            : !!(obj && obj.nodeType === 1);
    }

    /**
     * Checks whether or not a value is a Document object. 
     * 
     * @param {any} obj - The value to be checked 
     * @returns {boolean} - 
     * Boolean true or false
     */
    this.isDocument = function(obj) {

        return Document ? obj instanceof Document 
            : !!(obj && obj.nodeType === 9); 
    }

    /**
     * Checks whether or not a value is a DocumentFragment object. 
     * 
     * @param {any} obj - The value to be checked 
     * @returns {boolean} - 
     * Boolean true or false
     */
    this.isDocumentFragment = function(obj) {

        return DocumentFragment ? obj instanceof DocumentFragment 
            : !!(obj && obj.nodeType === 11); 
    }

    /**
     * Checks whether or not a value is a Comment node that contains the string 
     * phrase specified in the "options" parameter's "search" property in its 
     * text content. 
     * 
     * @param {Node | any} node - The Node or value to be checked. 
     * @returns {boolean} - Boolean true or false 
     */
    this.commentMatch = function(node) {

        return this.isComment(node) 
            && search.test( this.getCommentText(node) );
    }

    /**
     * Checks whether or not a value is a Comment node. 
     * 
     * @param {Node | any} obj - The Node or value to be checked 
     * @returns {boolean} - 
     * Boolean true or false 
     */
    this.isComment = function(obj) {

        return Comment ? obj instanceof Comment 
            : !!(obj && obj.nodeType === 8);
    }

    /**
     * Polyfill function to get the text contents of a Comment node. 
     * 
     * @param {Comment} comment - The Comment node which will have its text 
     * contents returned. 
     * 
     * @throws -
     * A ReferenceError exception when no JavaScript properties for getting the 
     * text contents of a Node object are supported. 
     * 
     * @returns {string} - 
     * The string text contents of the Comment node 
     */
    this.getCommentText = function(comment) {

        /* Most browsers support this, and it is the most standard approach. 
         However, some old Safari version do not support it. */
        if ("nodeValue" in comment) {

            return comment.nodeValue;
        }

        /* Most browsers support this, and it is also a common approach. 
         However, some old Internet Explorer versions do not support it. */
        if ("textContent" in comment) {

            return comment.textContent;
        }

        /* Non-standard Node interface property in old WebKit (Chromium/Safari) 
         browsers. This property has since been moved and is implemented 
         instead on the Element class in modern browsers. */
        if ("innerHTML" in comment) {

            return comment.innerHTML;
        }
        
        throw new ReferenceError("No JavaScript functionality supported for " 
            + "getting the text inside of a Comment node.");
    }

    /**
     * Tries the various methods implemented in the parent function for finding 
     * matching Comment Nodes inside of the containing Node object's DOM 
     * structure. 
     * 
     * @throws - 
     * A ReferenceError exception if no JavaScript APIs, properties, or methods 
     * are supported that can be used to find matching Comment Nodes in a DOM 
     * structure. 
     * 
     * @returns { Array<Comment> } - 
     * An Array of Comment Nodes
     */
    this.tryMethods = function() {

        var result = this.byTreeWalker();

        if (result !== null) {

            return result;
        }

        result = this.bySibling();

        if (result !== null) {

            return result;
        }

        result = this.byChildNodes();
        
        if (result !== null) {

            return result;
        }

        throw new ReferenceError("No JavaScript functionality found for " 
            + "getting Comment Nodes.");
    }

    /**
     * Uses a TreeWalker object to traverse the containing Node object's DOM 
     * tree structure and find matching Comment Nodes. 
     * 
     * @returns { Array<Comment> | null } - 
     * Depending on whether the TreeWalker API is supported by a user's 
     * Internet browser: 
     * - If so, returns an Array of matching Comment Nodes.
     * - If not, returns null. 
     */
    this.byTreeWalker = function() {

        var walker = this.newTreeWalker();

        if (walker) {

            var result = [];

            while ( walker.nextNode() ) {

                result.push( walker.currentNode );
            }

            return result;
        }

        return null;
    }

    /**
     * Helper method for byTreeWalker(). Creates a new TreeWalker object that 
     * only filters Comment Nodes and that has a filter function that depends 
     * on whether a string search value was supplied. 
     * 
     * @returns {TreeWalker} - 
     * A TreeWalker object for traversing the containing Node's DOM for 
     * matching Comment Nodes. 
     */
    this.newTreeWalker = function() {

        if (!document.createTreeWalker) {

            return null;
        }

        var filter;

        if (search) {

            /* Accepts or rejects Comment Nodes based on a search using the 
             test() method of the RegExp (regular expression) object, based on 
             the search string phrase, on the Comment Node's text contents returned using the getCommentText() polyfill method. */
            filter = function(node) {
                return search.test( self.getCommentText(node) ) 
                    ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            };

            /* 
             Makes the filter function an "acceptNode" property of itself for 
             both Internet Explorer and modern Internet browser compatibility. 
            */
            filter.acceptNode = filter;

            return document.createTreeWalker(
                container, NodeFilter.SHOW_COMMENT, filter, false
            );
        }

        try {

            /* Modern browsers support this shorthand syntax. */
            return document.createTreeWalker(
                container, NodeFilter.SHOW_COMMENT
            );
        }
        /* Older browsers require this deprecated syntax and will throw an 
         exception if the last two parameters are missing. */
        catch (e) {

            /* Accepts any Comment Nodes. */
            filter = function() {
                return NodeFilter.FILTER_ACCEPT;
            };

            /* 
             Makes the filter function an "acceptNode" property of itself for 
             both Internet Explorer and modern Internet browser compatibility. 
            */
            filter.acceptNode = filter;

            return document.createTreeWalker(
                container, NodeFilter.SHOW_COMMENT, filter, false
            );
        }
    }

    /**
     * Traverses the containing Node object's DOM structure for matching 
     * Comment Nodes using the "firstChild" property of the containing Node and 
     * its descendant parent Nodes and the "nextSibling" property of its child 
     * Nodes and their descendants. Main calling function that checks for 
     * support for both the Node interface's "firstChild" and "nextSibling" 
     * properties. Backup method with support on most Internet browsers, except 
     * for some old versions of Safari. Much slower than the TreeWalker-based 
     * approach. 
     * 
     * @returns { Array<Comment> | null } - 
     * Depending on whether a user's Internet browser supports the Node 
     * interface's "firstChild" and "nextSibling" properties: 
     * - If so, returns an Array of matching Comment Nodes found during the 
     *   traversal. 
     * - If not, returns null. 
     */
    this.bySibling = function() {

        if ("firstChild" in container && "nextSibling" in container) {

            /* Recursive traversal function call. Uses either of two different 
             functions for determining whether a Node is a valid Comment Node 
             depending on whether a string search phrase was specified in the 
             "option.search" parameter. */
            return search ? this.bySiblingTraversal(container, function(node) {
                return self.isComment(node) 
                    && search.test( self.getCommentText(node) );
            }) : this.bySiblingTraversal(container, function(node) {
                return self.isComment(node);
            });
        }
        
        return null;
    }

    /**
     * Helper function for the bySibling() method. Recursively traverses a DOM 
     * tree descendant structure of a parent or root Node to search for 
     * matching Comment Nodes, with Comment validity determined by the 
     * "validFn" parameter function. Starts at the first child Node, contained 
     * in the "firstChild" property of the parent node, and proceeds to the 
     * last using the "nextSibling" of property of a child Node. If any child 
     * Node has one or more further child Nodes, calls this method to further 
     * traverse and check or search those Nodes. 
     * 
     * @param {Node} nodeParent - The current root or parent Node which will 
     * any child Nodes and their descendants recursively checked or searched. 
     * 
     * @param {Function} validFn - The function which will be ran to check 
     * whether a Node is a valid Comment Node. The function either checks 
     * whether a Node is simply a Comment Node, or it checks whether the Node 
     * is a Comment Node with a match for the "search" string phrase inside of 
     * its text contents. 
     * 
     * @returns { Array<Comment> } - An Array with any matching Comment Nodes 
     * found during the traversal. 
     */
    this.bySiblingTraversal = function(nodeParent, validFn) {

        var current = nodeParent.firstChild, result = [];

        while (current) {

            if ( validFn(current) ) {

                result.push(current);
            }
            else if (current.firstChild) {

                result = result.concat( this.bySiblingTraversal(current, 
                    validFn) );
            }

            current = current.nextSibling;
        }

        return result;
    }

    /**
     * Traverses the main containing Node object's DOM tree descendant 
     * structure while searching and checking for any valid Comment Nodes. 
     * Checks whether the Node interface's "childNodes", a NodeList or similar 
     * type property which contains a live list of all of a Node object's child 
     * Nodes, is supported. If it is, calls the childNodesTraversal() method, 
     * which it relies upon for iteratively searching the child Nodes of a 
     * parent Node, for a recursive Node search at each level of the DOM tree. 
     * 
     * If a string "search" phrase was specified, only accepts Comment Nodes 
     * which contain it. Otherwise, fetches all Comment Nodes in the descendant 
     * structure. Also, if the Node interface's hasChildNodes() method is 
     * supported, executes it to check whether a Node has any child Nodes. 
     * Otherwise, checks whether the "childNodes" property's "length" property 
     * is not 0 to see whether the list is empty, which is a slower procedure. 
     * 
     * @returns { Array<Comment> | null } - 
     * Depending on whether the "childNodes" property is supported by a user's 
     * Internet browser: 
     * - If so, returns an Array of matching Comment Nodes. 
     * - If not, returns null. 
     */
    this.byChildNodes = function() {

        if (container.childNodes) {

            var validFn = search ? this.commentMatch : this.isComment;

            var hasChildFn = container.hasChildNodes ? function(node) {
                return node.hasChildNodes();
            } : function(node) {
                return !!node.childNodes.length;
            };

            return this.childNodesTraversal(container, validFn, hasChildFn);
        }

        return null;
    }

    /**
     * Helper method for the byChildNodes() method. Recursively traverses a 
     * root or parent Node object's DOM tree descendant structure, checking or 
     * searching for valid Comment Nodes using the "validFn" parameter. 
     * Iteratively loops through the "childNodes" property list of all of the 
     * child Nodes of the current parent Node. If a child Node has its own 
     * further child Nodes, calls this method again on that Node to find any 
     * matching Comment Nodes at lower levels of the DOM tree substructure.  
     * 
     * This is the most backwards-compatible of all the approaches, and has 
     * wide legacy and near universal Internet browser support. This method is 
     * much slower than the TreeWalker approach and notably slower than the 
     * recursive Node sibling traversal approach, most likely due to the 
     * property entry accesses in the "childNodes" object and the overhead of 
     * an iterative loop. Only use this as a last-case compatibility scenario 
     * for getting Comment Nodes when the others are not supported. 
     * 
     * @param {Node} nodeParent - The parent Node which will have its immediate 
     * child Nodes checked or searched for whether there are any valid Comment 
     * Nodes. Any child Nodes further down its descendant structure will be 
     * recursively checked.  
     * 
     * @param {Function} validFn - The function that, when ran, determines 
     * whether or not a Node is a valid Comment Node. The function either only 
     * checks whether a Node is a Comment Node, or it checks whether the Node 
     * is a Comment Node and whether it contains the string "search" phrase in 
     * its text content, if specified. 
     * 
     * @param {Function} hasChildFn - The function that, when ran, determines 
     * whether or not a Node has any further child Nodes. It either runs the 
     * hasChildNodes() method, if supported, or it checks whether the 
     * "childNodes" property does not have a length of 0, indicating it is 
     * empty. The former approach is faster than the latter. 
     * 
     * @returns { Array<Comment> } - 
     * An Array of matching Comment Nodes from the traversal 
     */
    this.childNodesTraversal = function(nodeParent, validFn, hasChildFn) {

        var childNodes = nodeParent.childNodes, result = [];
        var index, current;

        for (index = 0; index < childNodes.length; index++) {

            current = childNodes[index];

            if ( validFn(current) ) {

                result.push(current);
            }
            else if ( hasChildFn(current) ) {

                result = result.concat( this.childNodesTraversal(current, 
                    validFn, hasChildFn) );
            }
        }

        return result;
    }

    /* Main function calling and execution area */
    this.setApiRef();
    this.checkOptions();
    return this.tryMethods();
}