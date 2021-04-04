
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
 * Polyfills the String trim() method in case a user's Internet browser does 
 * not support it. The String trim() method is essential for the addCSSClass() 
 * function. 
 */
if (!String.prototype.trim) {

    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

/**
 * Adds one or more CSS class names to one or more DOM elements, if those DOM 
 * elements do not already contain each CSS class name. Intended to be a 
 * client-side, cross-browser polyfill with near universal JavaScript support 
 * in Internet browsers. This function prioritizes newer, faster JavaScript 
 * APIs, properties, and methods to search for and add CSS class names over 
 * legacy ones and older standards. However, if newer functionality is not 
 * supported, it will fall back to using legacy methods. 
 * 
 * @param {Element | HTMLCollection<Element> | NodeList<Element> | 
 * Array<Element>} elementTarget - Required. 
 * 
 * An Element object which will have its "class" value searched for each CSS 
 * class name, contained in the "newClass" parameter's value. A CSS class name 
 * entry will be added to the Element object's "class" attribute if it does not 
 * already contain it. 
 * 
 * Also can be a list data structure with consecutive, integer indices and a 
 * "length" property containing one or more such Element objects. Such object 
 * types include: HTMLCollections, NodeLists, and Arrays. Note that such a 
 * collection does not have to strictly contain Element objects, but 
 * non-Element entries will not be affected by this function. 
 * 
 * @param {string} newClass - Required. 
 * 
 * A non-empty String, which also does not only contain whitespace characters. 
 * Contains one or more CSS class names, which must be separated from each 
 * other by whitespace characters, that the function will try to find inside 
 * and potentially added to the "elementTarget" parameter's value. Leading and 
 * trailing whitespace is trimmed from a String entry, and CSS class name 
 * entries are split apart by whitespace characters into an Array of CSS class 
 * name entries for the search process. 
 * 
 * Also can be an Array of non-empty String entries containing one CSS class 
 * name each. Leading and trailing whitespace will be trimmed from each Array 
 * entry. Entries that contain more than one whitespace-separated, whole-word 
 * CSS class name entries will be split into additional Array entries that will 
 * inserted into the consecutively following Array indices. Additionally, CSS 
 * class name entries that are duplicates of an original will also be removed. 
 * Only one copy of each CSS class name is necessary for an Element object to 
 * inherit a CSS class's styling properties, so only one copy of each CSS class 
 * name needs to be found in and added to an Element object. 
 * 
 * @throws - 
 * Refer to specific member method documentation to see what type of and when 
 * each Error is raised as an exception. 
 * 
 * @returns {number} - 
 * An integer containing the number of Element objects from the "elementTarget" 
 * parameter which had at least one of the CSS class name entries listed in the 
 * "newClass" parameter added to the "class" attribute. 
 */
function addCSSClass(elementTarget, newClass) {

    /**
     * Creates a dummy div-type HTML element for testing whether certain 
     * features are supported by a user's Internet browser. 
     */
    this.testElement = document.createElement("div");

    /**
     * Boolean value. Tells whether or not the argument value to the 
     * "elementTarget" parameter is a list object with a "length" number-type 
     * property. Storing the result of a one-time test makes performance 
     * quicker. 
     */
    this.hasElementList;
    
    /** 
     * Boolean value. Indicates whether or not a user's Internet browser 
     * supports CSS3 standard features and syntax. 
     */
    this.css3;

    /**
     * Checks whether the arguments passed to the parameters are: 
     * - of the proper type, meaning an expected primitive data type or 
     *   inheriting from an expected object class or interface;
     * - in the expected range of values for their respective types. 
     * 
     * @throws A TypeError exception if the "elementTarget" parameter's 
     * argument is neither an Element object nor a list data structure 
     * containing an Element object as each entry. 
     */
    this.checkParameters = function() {

        if (!this.checkElementList() && !this.isElement(elementTarget)) {

            var error = new TypeError("Parameter 1, \"elementTarget\", must " 
                + "either be an Element object or an array-like list data " 
                + "structure full of Element object entries.");
            error.message += this.logArgError(error, elementTarget);
            throw error;
        }

        this.css3 = this.supportsCSS3();
        newClass = this.checkClassParameter(newClass, 2, "newClass", true);
    }

    /**
     * Checks whether a value is a DOM element, particularly an HTML element. 
     * If the current Internet browser supports the Element API, this method 
     * checks whether the value inherits from the Element class. Otherwise, 
     * this methods checks: 
     * - whether the value is a non-null object;
     * - whether the nodeType property is present with an integer value of 1, 
     *   indicating that the object is an Element (HTML) node; 
     * - whether the object has the inline "style" property of the Element 
     *   or equivalent class. 
     * 
     * @param {any} obj - The value to be checked. 
     * 
     * @returns {boolean} - 
     * Boolean true or false
     */
    this.isElement = function(obj) {

        if (typeof Element !== "undefined") {

            return obj instanceof Element;
        }
        
        return !!(obj && obj.nodeType === 1 && obj.style);
    }

    /**
     * Checks whether the argument value passed to the "elementTarget" 
     * parameter of the parent function is a list data structure that can must 
     * or can contain Element object entries, such as an HTMLCollection, 
     * NodeList, or Array object. 
     * 
     * @throws 
     * - RangeError exception if the "elemenTarget" parameter is empty. 
     * 
     * @returns {boolean} - 
     * - Boolean true if the "elementTarget" parameter's value is a non-empty 
     *   list data structure. 
     * - Boolean false if the "elementTarget" parameter's value is not a list 
     *   object with a "length" property, but it is rather an Element object. 
     */
    this.checkElementList = function() {

        var error;
        this.hasElementList = typeof elementTarget === "object" 
            && typeof elementTarget.length === "number";

        if (!this.hasElementList) {

            return false;
        }

        if (!elementTarget.length) {

            error = new RangeError("Parameter 1, \"elementTarget\", must not " 
                + "be an empty array or list data structure.");
            error.message += this.logArgError(error, elementTarget);
            throw error;
        }

        return true;
    }

    /**
     * Checks whether or not the current Internet browser supports CSS version 
     * 3 or a version before it by testing whether an Element object's inline 
     * "style" property supports the "background-size" CSS property, which was 
     * added to most Internet browser versions which first supported CSS3. 
     * 
     * @returns {boolean} - 
     * Boolean true or false depending on whether the test detects support for 
     * a CSS3 feature. 
     */
    this.supportsCSS3 = function() {

        return typeof this.testElement.style.backgroundSize === "string";
    }

    /**
     * Checks whether an argument value passed to the "newClass" parameter of 
     * the parent function is either a non-empty string or an array of strings, 
     * representing CSS class names. 
     * 
     * @param {string | Array<string>} argValue - the argument value to be 
     * checked 
     * @param {number} paramNum - The number of the parameter to which 
     * "argValue" was passed in the order of the parent function definition. 
     * Used for exception message printouts, e.g. "Parameter 1." 
     * @param {string} paramName - The name of the parameter to which 
     * "argValue" was passed in the parent function definition. Used for 
     * exception message printouts. 
     * @param {boolean} emptyCheck - A Boolean value indicating whether 
     * "argValue" cannot be an empty or whitespace-only class string argument 
     * or whether "argValue" cannot contain empty class string entries as an 
     * array. If true, an exception will be raised if an empty string is found. 
     * 
     * @throws - 
     * - A RangeError exception if "argValue" is an empty string and 
     *   "emptyCheck" is set to true. 
     * - A RangeError exception if "argValue" is an empty array. 
     * - A TypeError exception if "argValue" is neither a string nor an Array. 
     * 
     * @returns {Array<string>} - 
     * An Array split apart by whitespace if "argValue" is a string, or the 
     * Array value passed to "argValue." Each entry of the Array will be a 
     * string that will have any leading or trailing whitespace removed. Since 
     * only one copy of each CSS class name is necessary for an Element object 
     * to inherit the class's styling properties, the first instance of any CSS 
     * class name encountered will be kept, and any of the class's duplicate 
     * entries from the original Array will be removed. 
     */
    this.checkClassParameter = function(argValue, paramNum, paramName, 
        emptyCheck) {

        if (typeof argValue === "string") {

            argValue = argValue.trim();
    
            if (emptyCheck && !argValue) {
        
                throw new RangeError("Parameter " + paramNum + ", " 
                    + paramName + ", is an empty string value.");
            }

            return this.checkClassArray(argValue.split(/[\s\uFEFF\xA0]+/), 
                paramNum, paramName, emptyCheck);
        }
        
        if (argValue instanceof Array) {

            if (!argValue.length) {

                throw new RangeError("Parameter " + paramNum + ", " + paramName 
                    + ", must not be an empty array and must contain string " 
                    + "entries.");
            }

            return this.checkClassArray(argValue, paramNum, paramName, 
                emptyCheck);
        }

        var error = new TypeError("Parameter " + paramNum + ", \"" + paramName 
            + "\", must either be a string or an array of string entries.");
        error.message += this.logArgError(error, oldClass);
        throw error;
    }

    /**
     * Checks whether all of the entries in an array are non-empty string 
     * values that obey the syntax for a CSS class name for a browser's 
     * respective CSS version. If any non-empty duplicate CSS class name string 
     * values are present in the argument array, they will be removed, since 
     * Element objects only need one copy of each CSS class name to inherit its 
     * properties. 
     * 
     * @param {Array<string>} argArray - The array of strings to be checked.  
     * @param {number} paramNum - The integer value of the parameter to which 
     * "argValue" was passed indicating its order in the parent function 
     * definition. Used for exception message printouts, e.g. "Parameter 1." 
     * @param {string} paramName - The name of the parameter to which 
     * "argValue" was passed in the parent function definition. Used for 
     * exception message printouts.
     * @param {boolean} emptyCheck - A Boolean value indicating whether 
     * "argValue" cannot be an empty or whitespace-only class string argument 
     * or whether "argValue" cannot contain empty class string entries as an 
     * array. If true, an exception will be raised if an empty string is found. 
     * 
     * @throws - 
     * - A TypeError exception if an entry in the array is not a string. 
     * - A RangeError exception if the an entry in the array is an empty string 
     *   and "emptyCheck" has a value of true.
     * - A RangeError exception if the browser only supports a CSS version 
     *   before 3 and a CSS class name entry violates the syntax rules for a 
     *   CSS 1/2/2.1 class name. 
     * 
     * @returns {Array<string>} - 
     * An Array of non-empty, whole-word, whitespace-trimmed String entries 
     * that each indicate a CSS class name to be found in the "elementTarget" 
     * parameter's Element object's "class" attribute. Intended to replace the 
     * original value of the "newClass" parameter. 
     */
    this.checkClassArray = function(argArray, paramNum, paramName, emptyCheck) {

        var index, entry, error, checked = {}, numDup = 0;

        for (index = 0; index < argArray.length; index++) {

            entry = argArray[index];

            /* Original entries can only be strings. */
            if (typeof entry !== "string") {

                error = new TypeError("Entry at index " + index 
                    + " of the argument array to parameter " + paramNum 
                    + ", \"" + paramName + "\", is not a string.");
                error.message += this.logArgError(error, entry);
                throw error;
            }

            /* Entries with only whitespace count as empty strings. */
            entry = entry.trim();

            if (!entry && emptyCheck) {

                throw new RangeError("Entry at index " + index 
                    + " of the argument array to the parameter " + paramNum 
                    + ", \"" + paramName + "\", is an empty string.");
            }

            /* If the current entry has spaces in it, split it apart into new 
             * entries. */
            if (/[\s\uFEFF\xA0]/.test(entry)) {

                entry = this.splitClassEntry(argArray, entry, index);
            }

            /* Check whether the entry matches the syntax or grammar rules for 
             * a CSS class name according to the CSS version (3 or below) that 
             * the user's browser supports. */
            if (this.css3) {

                entry = entry.replace(/\0/g, '');
            }
            else if (!/^\-?[a-zA-Z_]{1}[\w\-]*$/.test(entry)) {

                error = new RangeError("Entry at index " + index 
                    + " of the argument array to the parameter " + paramNum 
                    + ", \"" + paramName + "\", must be a validly formatted " 
                    + "CSS1/CSS2 class name.");
                error.message += this.logArgError(error, entry);
                throw error;
            }

            /* If a CSS class string is not empty, only add it if an instance 
             * of it does not already exist in the argument array. An object 
             * with the names of each unique CSS class name as a name of a 
             * property is used for fast hash table look-ups to see whether 
             * the entry already exists in the array. If an entry is a 
             * duplicate, set it to null. */
            if (entry) {

                if (entry in checked) {

                    argArray[index] = null;
                    numDup++;
                }
                else {
    
                    argArray[index] = entry;
                    checked[entry] = true;
                }
            }
            else {

                argArray[index] = entry;
            }
        }

        /* If duplicate entries marked by null exist in the array, remove those 
         * entries and only keep the original string entries. */
        if (numDup > 0) {

            var newArray = [];

            for (index = 0; index < argArray.length; index++) {

                entry = argArray[index];

                if (entry !== null) {

                    newArray.push(entry);
                }
            }

            return newArray;
        }

        return argArray;
    }

    /**
     * If a CSS class string entry in an argument array provided for the 
     * "newClass" parameter has one or more whitespace characters separating 
     * non-whitespace characters from each other, splits the current entry into 
     * two or more strings, inserts the second and any subsequent CSS class 
     * name string sequences into the indices consecutively following the 
     * current entry, and returns the first sequence in the split entry to 
     * replace the original entry. 
     * 
     * @param {Array<string>} argArray - The array either passed as an argument 
     * to the "newClass" parameter, or an array resulting from splitting a 
     * string argument passed to the "newClass" parameter by whitespace 
     * characters into separate CSS class name entries. 
     * @param {string} entry - The current string entry in the "argArray" array 
     * argument 
     * @param {number} index - The number of the index at which the current 
     * string argument "entry" occurs in the "argArray" argument array. 
     * 
     * @returns {string} The first string CSS class name sequence resulting 
     * from the split "entry" argument. Meant to replace the original entry. 
     */
    this.splitClassEntry = function(argArray, entry, index) {

        var addEntr = entry.split(/[\s\uFEFF\xA0]+/);

        for (var addIndex = 1; addIndex < addEntr.length; addIndex++) {

            argArray.splice(index + addIndex, 0, addEntr[addIndex]);
        }

        return addEntr[0];
    }

    /**
     * Logs information containing the type, value, and/or any data members 
     * of an argument value passed to a parameter in this function which was 
     * not of the expected data or object type. Also logs the JavaScript call 
     * stack trace for the current point of execution at which an exception 
     * calling this function occurred, as not all Internet browsers do this 
     * by default. Intended for output to an Internet browser's console inside 
     * of an exception or error message. 
     * 
     * @param {Error} error - The exception that will be thrown with these 
     * logged details inside of its message.
     * 
     * @param {any} argValue - The value of the argument passed to a function 
     * parameter which is not of the expected data or object type. 
     * 
     * @returns A string containing the call stack trace for the current point 
     * of execution, if methods to report this are supported. A blank string 
     * if the invalid argument value is a non-null object whose data members 
     * are logged as an error message to the console. Otherwise, returns a 
     * string containing the primitive data type and value of the invalid 
     * argument value. 
     */
    this.logArgError = function(error, argValue) {

        if (argValue && typeof argValue === "object" && console.error) {

            console.error(argValue);

            if (error && error.stack) {

                return "\r\n\r\n" + error.stack;
            }
            
            if (console.trace) {

                console.trace();
            }

            return "";
        }

        var errorStr = "\r\nType: " + typeof argValue;
        errorStr += "\r\nValue: " + argValue;

        if (error && error.stack) {

            errorStr += "\r\n\r\n" + error.stack;
        }
        else if (console.trace) {

            console.trace();
        }
        
        return errorStr;
    }

    /**
     * Tries using the methods of the parent function to add new CSS class 
     * entries, which are contained in the argument to the "newClass" 
     * parameter, to the "class" attribute for each of the Element objects in 
     * the "elementTarget" parameter's value. Methods using the latest and 
     * fastest JavaScript APIs for adding new CSS class entries to an Element 
     * object are called first, and then backup, legacy JavaScript methods will 
     * be called if a newer JavaScript API, property, or method on an Element 
     * object is not supported. Excess whitespace cleanup functions for an 
     * Element object's "class" attribute are also passed as an argument to 
     * each adding method. 
     * 
     * @throws - 
     * - A ReferenceError exception if no JavaScript functions coded into the 
     *   methods for adding CSS class name entries to an Element object's 
     *   "class" attribute are supported. 
     * 
     * @returns {number} - 
     * An integer representing the number of Element objects, contained in the 
     * "elementTarget" parameter's value, that had at least one of the new CSS 
     * class name entries added to their "class" attributes. 
     */
    this.tryMethods = function() {

        var result = this.byMethod(this.supportsClassList, this.byClassListAdd, 
            this.getCleanupFn());

        if (result !== undefined) {

            return result;
        }

        result = this.byMethod(this.supportsClassName, this.byClassNameAdd, 
            this.byClassNameCleanup);

        if (result !== undefined) {

            return result;
        }

        result = this.byMethod(this.supportsAttrMethods, this.byAttributeAdd, 
            this.byAttributeCleanup);

        if (result !== undefined) {

            return result;
        }

        throw new ReferenceError("No JavaScript functionality for adding new " 
            + "CSS class name entries to an Element object's \"class\" " 
            + "attribute found.");
    }

    /**
     * Tries using a method of the parent function to add new CSS class 
     * entries, contained in the parent function's "newClass" parameter, to the 
     * "class" attribute for each of the Element objects in the "elementTarget" 
     * parameter's value. 
     * 
     * @param {Function} supportTestFn - A method of the parent function 
     * checking whether the JavaScript APIs, properties, or methods for adding 
     * a new CSS class name entry to an Element object is supported by the 
     * function argument to the "addFn" parameter. Returns Boolean true or 
     * false for indicating support. 
     * 
     * @param {Function} addFn - The method of the parent function which 
     * implements logic to add a new CSS class name entry to an Element object 
     * using specific JavaScript APIs, properties, or functions. Returns 
     * Boolean true if the new CSS class name entry was added, and Boolean 
     * false if the Element object already contained the CSS class name entry. 
     * 
     * @param {Function} cleanupFn - The method of the parent function which 
     * implements logic to remove leading and trailing whitespace and to 
     * convert sequences of one or more whitespace characters to a single ASCII 
     * space character in the "class" attribute of an Element object. 
     * 
     * @returns {number | undefined} - 
     * - An integer containing the number of Element objects from the 
     *   "elementTarget" parameter's value which had at least one new CSS class 
     *   name entry added to the "class" attribute. 
     * - undefined if the "supportFn" parameter's function returns Boolean 
     *   false, indicating that the JavaScript APIs, properties, or methods 
     *   relied on by the "addFn" parameter's function value are not supported 
     *   by a user's Internet browser. 
     */
    this.byMethod = function(supportTestFn, addFn, cleanupFn) {

        if (!supportTestFn()) {

            return undefined;
        }

        if (this.hasElementList) {

            return this.listByMethod(addFn, cleanupFn);
        }

        return this.addEachClass(elementTarget, addFn, cleanupFn) ? 1 : 0;
    }

    /**
     * Tries calling a method from the parent function for adding each new CSS 
     * class name entry, contained in the "newClass" parameter of the parent 
     * function, to the "class" attribute of each Element object entry, 
     * contained in a list data structure from the parent function's 
     * "elementTarget" parameter value. If an entry inside the list data 
     * structure is not an Element object, it will be skipped. 
     * 
     * @param {Function} addFn - Required. 
     * 
     * The method from the parent function that implements logic to add one new 
     * CSS class name entry to an Element object's "class" attribute, if it 
     * does not already contain the CSS class name entry. Relies on specific 
     * JavaScript APIs, properties, or methods to perform this, which must be 
     * supported by a user's Internet browser. Must return Boolean true if the 
     * new CSS class name entry was successfully added to an Element object, 
     * and Boolean false if the "class" attribute already contains the CSS 
     * class name entry. 
     * 
     * @param {Function} cleanupFn - Optional. 
     * 
     * The method of the parent function which implements logic to remove 
     * leading and trailing whitespace characters and to convert sequences of 
     * one or more whitespace characters to a single ASCII space character in 
     * the "class" attribute of an Element object list entry. 
     * 
     * @returns {number} - 
     * An integer containing the number of Element objects from the list data 
     * structure in the parent function's "elementTarget" parameter which had 
     * at least one new CSS class name successfully added to them. 
     */
    this.listByMethod = function(addFn, cleanupFn) {

        var index, entry, numEdited = 0;

        for (index = 0; index < elementTarget.length; index++) {

            entry = elementTarget[index];

            if (this.isElement(entry) 
                && this.addEachClass(entry, addFn, cleanupFn)) {

                numEdited++;
            }
        }

        return numEdited;
    }

    /**
     * Using a method of the parent function, checks whether an Element 
     * object's "class" attribute contains each CSS class name entry, contained 
     * in the parent function's "newClass" parameter's value; if not, the CSS 
     * class name entry will be added to the Element object's "class" 
     * attribute. 
     * 
     * @param {Element} elementEntry - Required. 
     * The Element object which will have its "class" attribute checked and 
     * potentially changed. 
     * @param {Function} addFn - Required. 
     * The method of the parent function that implements logic to search for 
     * and potentially add a CSS class name entry to an Element object's 
     * "class" attribute. 
     * @param {Function} cleanupFn - Optional. 
     * The method of the parent function which will remove any trailing or 
     * leading whitespace characters and replace any sequences of one or more 
     * whitespace characters between CSS class name entries with a single ASCII 
     * space character within the "elementEntry" parameter value's "class" 
     * attribute. 
     * 
     * @returns {number} - 
     * An integer containing the number of CSS class name entries, from the 
     * "newClass" parameter's value, which were added to the Element object, 
     * contained in the "elementEntry" parameter's value. 
     */
    this.addEachClass = function(elementEntry, addFn, cleanupFn) {

        var index, cssClass, numAdded = 0;

        for (index = 0; index < newClass.length; index++) {

            cssClass = newClass[index];

            if (addFn(elementEntry, cssClass)) {

                numAdded++;
            }
        }

        if (cleanupFn) {

            cleanupFn(elementEntry);
        }

        return numAdded;
    }

    /**
     * Checks whether a user's Internet browser supports the Element API's 
     * "classList" property. 
     * 
     * @returns {boolean} - 
     * Boolean true or false 
     */
    this.supportsClassList = function() {

        return !!this.testElement.classList;
    }

    /**
     * Relies on methods of the Element class's DOMTokenList-type "classList" 
     * property. Uses the contains() method to check whether an Element object 
     * currently contains a CSS class name entry in its "class" attribute. If 
     * it does not, adds a new CSS class name entry to the Element object's 
     * "class" attribute. 
     * 
     * @param {Element} elementEntry - The Element object which will have its 
     * "class" attribute checked and potentially changed. 
     * @param {string} cssClass - A whole-word CSS class name, without any 
     * whitespace characters in it, which will be searched and potentially 
     * added to the "elementEntry" parameter's "class" attribute. 
     * 
     * @returns {boolean} - 
     * - Boolean true if the "elementEntry" parameter's Element object does not 
     *   already contain the "cssClass" parameter's CSS class name value and 
     *   had it successfully added to the "class" attribute. 
     * - Boolean false if the "elementEntry" parameter's Element object already 
     *   contains the "cssClass" parameter's CSS class name value and thus 
     *   could not have it successfully added to the "class" attribute. 
     */
    this.byClassListAdd = function(elementEntry, cssClass) {

        if (elementEntry.classList.contains(cssClass)) {

            return false;
        }

        elementEntry.classList.add(cssClass);
        return true;
    }

    /**
     * Determines whether a user's Internet browser supports either the Element 
     * class's "className" string property or the getAttribute() and 
     * setAttribute() methods. These can be used in a parent function's 
     * clean-up function to:
     * - remove leading or trailing whitespace characters and 
     * - convert sequences of one or more whitespace characters between CSS 
     *   class name entries into a single ASCII space character 
     * for the "class" attribute of an Element object, making it more condensed 
     * and neater. 
     * 
     * @returns {Function | undefined} - 
     * - The byClassNameCleanup() method of the parent function, if the Element 
     *   class's "className" string-type property is supported. 
     * - The byAttributeCleanup() method of the parent function, if the Element 
     *   class's getAttribute() and setAttribute() methods are supported. 
     * - undefined if neither the Element class's "className" string-type 
     *   property or getAttribute() and setAttribute() methods are supported. 
     */
    this.getCleanupFn = function() {

        if (typeof this.testElement.className === "string") {

            return this.byClassNameCleanup;
        }

        if (this.testElement.getAttribute 
            && this.testElement.setAttribute) {

            return this.byAttributeCleanup;
        }

        return undefined;
    }

    /**
     * Checks whether a user's Internet browser supports the Element API's 
     * "className" string-type property. 
     * 
     * @returns {boolean} Boolean true or false
     */
    this.supportsClassName = function() {

        return typeof this.testElement.className === "string";
    }

    /**
     * Relies on methods of the Element class's string-type "className" 
     * property, which reflects the value of a DOM element's "class" attribute. 
     * Creates a new RegExp (regular expression) API object for a whole-word 
     * CSS class name entry with no whitespace, then uses the test() method of 
     * this RegExp object to check whether an Element object's "className" 
     * property  contains the CSS class name entry. If not, the CSS class name 
     * entry is added to the Element object's "className" property, separated 
     * by whitespace from any previous CSS class name entries. 
     * 
     * @param {Element} elementEntry - The Element object which will have its 
     * "class" attribute checked and potentially changed. 
     * @param {string} cssClass - A whole-word CSS class name, without any 
     * whitespace characters in it, which will be searched and potentially 
     * added to the "elementEntry" parameter's "class" attribute. 
     * 
     * @returns {boolean} - 
     * - Boolean true if the "elementEntry" parameter's Element object does not 
     *   already contain the "cssClass" parameter's CSS class name value and 
     *   had it successfully added to the "class" attribute. 
     * - Boolean false if the "elementEntry" parameter's Element object already 
     *   contains the "cssClass" parameter's CSS class name value and thus 
     *   could not have it successfully added to the "class" attribute. 
     */
    this.byClassNameAdd = function(elementEntry, cssClass) {

        var searchRegex = new RegExp("\\b" + cssClass + "\\b");

        if (searchRegex.test(elementEntry.className)) {

            return false;
        }

        /[\s\uFEFF\xA0]$/.test(elementEntry.className) 
            ? elementEntry.className += cssClass 
            : elementEntry.className += " " + cssClass;

        return true;
    }

    /**
     * Removes any leading or trailing whitespace using the String trim() 
     * function and converts any consecutive sequence of two or more whitespace 
     * characters to a single whitespace using the String regex replace() 
     * method for an Element argument object on its "className" String 
     * property. Only one space character is necessary between each CSS 
     * class entry name to separate them from each other for an Element 
     * object's "class" attribute. Thus, this method cleans up unnecessary 
     * whitespace for the Element object's "class" attribute that is contained 
     * in it, either before or after any string manipulation was completed by 
     * the methods of this parent function. This makes the "class" attribute 
     * more compact, neater, and saves some on memory. 
     * 
     * @param {Element} elementEntry - The Element object which will have its 
     * "className" property's and "class" attribute's excess whitespace 
     * cleaned up.
     */
    this.byClassNameCleanup = function(elementEntry) {

        elementEntry.className = elementEntry.className.trim()
            .replace(/[\s\uFEFF\xA0]{2,}/, " ");
    }

    /**
     * Checks whether a user's Internet browser supports the Element API's 
     * getAttribute() method for retrieving an attribute's value and 
     * setAttribute() method for setting an attribute's value. 
     * 
     * @returns {boolean} Boolean true or false 
     */
    this.supportsAttrMethods = function() {

        return !!(this.testElement.getAttribute 
            && this.testElement.setAttribute);
    }

    /**
     * Uses the Element class's getAttribute() method to retrieve the value of 
     * an Element object's "class" attribute. If the Element object either has 
     * an empty or no "class" attribute value, sets the "class" value to be a 
     * new CSS class entry. If the Element object has a "class" attribute 
     * value, creates a new RegExp (regular expression) API object using a 
     * whole-word CSS class name entry with no whitespace characters. Uses this 
     * RegExp object's test() method on the Element object's "class" attribute 
     * value to test whether or not it contains the CSS class name. If it does 
     * not, adds the new CSS class name to the "class" value, separated from 
     * previous entries by whitespace. Sets the new "class" attribute value 
     * using the Element class's setAttribute() method. 
     * 
     * @param {Element} elementEntry - The Element object which will have its 
     * "class" attribute value retrieved, searched, and potentially changed. 
     * @param {string} cssClass - A non-empty string value containing a 
     * whole-word CSS class name, without any whitespace characters. 
     * 
     * @returns {boolean} - 
     * - Boolean true if the "elementEntry" parameter's Element object does not 
     *   already contain the "cssClass" parameter's CSS class name value and 
     *   had it successfully added to the "class" attribute. 
     * - Boolean false if the "elementEntry" parameter's Element object already 
     *   contains the "cssClass" parameter's CSS class name value and thus 
     *   could not have it successfully added to the "class" attribute. 
     */
    this.byAttributeAdd = function(elementEntry, cssClass) {

        var classValue = elementEntry.getAttribute("class");

        if (!classValue) {

            elementEntry.setAttribute("class", cssClass);
            return true;
        }

        var searchRegex = new RegExp("\\b" + cssClass + "\\b");

        if (searchRegex.test(classValue)) {

            return false;
        }

        /[\s\uFEFF\xA0]$/.test(classValue) 
            ? classValue += cssClass 
            : classValue += " " + cssClass;

        elementEntry.setAttribute("class", classValue);
        return true;
    }

    /**
     * Removes any leading or trailing whitespace using the String trim() 
     * function and converts any consecutive sequence of two or more whitespace 
     * characters to a single whitespace using the String regex replace() 
     * method for an Element argument object's "class" attribute. The Element 
     * argument object's "class" attribute value is retrieved using its 
     * getAttribute() method. Any changes are applied to the "class" attribute 
     * using the Element API's setAttribute() method. Note that this method is 
     * intended for use as a backup in legacy browsers to the one which cleans 
     * up the Element API's "className" property, as this approach is slower. 
     * 
     * Only one space character is necessary between each CSS class entry name 
     * to separate them from each other for an Element object's "class" 
     * attribute. Thus, this method cleans up unnecessary whitespace for the 
     * Element object's "class" attribute that is contained in it, either 
     * before or after any string manipulation was completed by the methods of 
     * this parent function. This makes the "class" attribute more compact, 
     * neater, and saves some on memory. 
     * 
     * @param {Element} elementEntry - The Element object which will have its 
     * "class" attribute's excess whitespace cleaned up.
     */
    this.byAttributeCleanup = function(elementEntry) {

        var classValue = elementEntry.getAttribute("class");

        if (classValue) {

            classValue = classValue.trim().replace(/[\s\uFEFF\xA0]{2,}/, " ");
            elementEntry.setAttribute("class", classValue);
        }
    }
    
    /* Main method calling and execution area */
    this.checkParameters();
    return this.tryMethods();
}
