
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
 * not support it. The String trim() method is essential for the 
 * containsCSSClass() function.
 */
if (!String.prototype.trim) {

    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

/**
 * Checks whether a DOM element contains one or more CSS class name entries. 
 * Intended to be a client-side, cross-browser polyfill with near universal 
 * JavaScript support in Internet browsers. This function prioritizes newer, 
 * faster JavaScript APIs, properties, and methods to search for CSS class 
 * names over legacy ones and older standards. However, if newer functionality 
 * is not supported, it will fall back to using legacy methods. Unless 
 * otherwise specified, by default, the function must find ALL of the target 
 * CSS class name entries inside of the DOM element. 
 * 
 * @param {Element} elementTarget - Required. 
 * 
 * The Element object which will have its "class" attribute value checked for 
 * whether its contains the CSS class entries listed in the "searchClass" 
 * parameter. 
 * 
 * @param {string | Array<string>} searchClass - Required. 
 * 
 * A non-empty String, which also does not only contain whitespace characters. 
 * Contains one or more CSS class names, which must be separated from each 
 * other by whitespace characters, that the function will try to find inside of 
 * the "elementTarget" parameter's value. Leading and trailing whitespace is 
 * trimmed from a String entry, and CSS class name entries are split apart by 
 * whitespace characters into an Array of CSS class name entries for the search 
 * process. 
 * 
 * Also can be an Array of non-empty String entries containing one CSS class 
 * name each. Leading and trailing whitespace will be trimmed from each Array 
 * entry. Entries that contain more than one whitespace-separated, whole-word 
 * CSS class name entries will be split into additional Array entries that will 
 * inserted into the consecutively following Array indices. Additionally, CSS 
 * class name entries that are duplicates of an original will also be removed. 
 * Only one copy of each CSS class name is necessary for an Element object to 
 * inherit a CSS class's styling properties, so only one copy of each CSS class 
 * name needs to be found to verify that the target Element object has it. 
 * 
 * The order in which CSS class name entries occur in this parameter does not 
 * have to be the same as the order in which the classes occur in the 
 * "elementTarget" parameter value's "class" attribute. 
 * 
 * @param {boolean} singleMatch - Optional. 
 * 
 * Indicates what number of CSS class name entries from the "searchClass" 
 * parameter's value must be found inside of the "elementTarget" parameter 
 * value in order for a search to succeed. 
 * 
 * - If truthy, indicates that only ONE CSS class name entry must be found. 
 * - If falsy, indicates that ALL of the CSS class name entries must be found. 
 * 
 * By default, the value of this parameter is Boolean false, meaning that ALL 
 * of the CSS class name entries from the "searchClass" parameter must be found 
 * inside of the "elementTarget" parameter's value. 
 * 
 * This parameter functions like a Boolean; however, it can practically be any 
 * other data type. 
 * 
 * @throws - 
 * Refer to specific member method documentation to see what type of and when 
 * each Error is raised as an exception. 
 * 
 * @returns {boolean} - 
 * Boolean true or false if the search succeeds under the argument conditions. 
 */
function containsCSSClass(elementTarget, searchClass, singleMatch) {

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
     * @throws - 
     * A TypeError exception if the "elementTarget" parameter's argument is 
     * not an Element object. 
     */
    this.checkParameters = function() {

        if (!this.isElement(elementTarget)) {

            var error = new TypeError("Parameter 1, \"elementTarget\", must " 
                + "either be an Element object.");
            error.message += this.logArgError(error, elementTarget);
            throw error;
        }

        this.css3 = this.supportsCSS3();
        searchClass = this.checkClassParameter(searchClass, 2, "searchClass", 
            true);

        if (typeof singleMatch !== "undefined") {

            singleMatch = false;
        }
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
     * @param {any} obj - Required. The value to be checked. 
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

        return elementTarget.style.backgroundSize === "string";
    }

    /**
     * Checks whether an argument value passed to the "searchClass" parameter 
     * of the parent function is either a non-empty string or an array of 
     * strings, representing CSS class names. 
     * 
     * @param {string | Array<string>} argValue - The argument value to be 
     * checked. 
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

            argValue = argValue.split(/[\s\uFEFF\xA0]+/);

            if (!argValue.length) {

                throw new RangeError("Parameter " + paramNum + ", " + paramName 
                    + ", must not be an empty array and must contain string " 
                    + "entries.");
            }

            return this.checkClassArray(argValue, paramNum, paramName, 
                emptyCheck);
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
     * original value of the "searchClass" parameter. 
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

                entry = this.addClassEntries(argArray, entry, index);
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
     * "searchClass" parameter has one or more whitespace characters separating 
     * non-whitespace characters from each other, splits the current entry into 
     * two or more strings, inserts the second and any subsequent CSS class 
     * name string sequences into the indices consecutively following the 
     * current entry, and returns the first sequence in the split entry to 
     * replace the original entry. 
     * 
     * @param {Array<string>} argArray - The array either passed as an argument 
     * to the "searchClass" parameter, or an array resulting from splitting a 
     * string argument passed to the "searchClass" parameter by whitespace 
     * characters into separate CSS class name entries. 
     * @param {string} entry - The current string entry in the "argArray" array 
     * argument 
     * @param {number} index - The number of the index at which the current 
     * string argument "entry" occurs in the "argArray" argument array. 
     * 
     * @returns {string} The first string CSS class name sequence resulting 
     * from the split "entry" argument. Meant to replace the original entry. 
     */
    this.addClassEntries = function(argArray, entry, index) {

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
     * Tries using the methods of the parent function to search for CSS class 
     * name entries, which are contained in the argument to the "searchClass" 
     * parameter, inside of the Element object passed to the "elementTarget" 
     * parameter. Methods using the latest and fastest JavaScript APIs for 
     * searching CSS class entries on an Element object are called first, and 
     * then backup, legacy JavaScript methods will be called if a newer 
     * JavaScript API, property, or method on an Element object is not 
     * supported. 
     * 
     * @returns {boolean} - 
     * Boolean true or false. If the "singleMatch" parameter's value is: 
     * - Truthy, the "elementTarget" parameter's Element object must contain at 
     *   least one of the "searchClass" CSS class name entries. 
     * - Falsy, the "elementTarget" parameter's Element object must contain all 
     *   of the "searchClass" CSS class name entries. 
     */
    this.tryMethods = function() {

        var result = this.byClassList();
        
        if (result !== undefined) {

            return result;
        }

        result = this.byClassName();
        
        if (result !== undefined) {

            return result;
        }

        result = this.byAttribute();
        
        if (result !== undefined) {

            return result;
        }
        
        throw new ReferenceError("No JavaScript functions found for searching " 
            + "for CSS class names in an Element object.");
    }
    
    /**
     * Checks whether a user's Internet browser supports the JavaScript Element 
     * class's DOMTokenList-type classList property API. If it does, calls the 
     * checkClassEntries() function with the byClSearch() method as an 
     * argument. This approach relies on the ClassList API's contains() method 
     * to check whether the "elementTarget" parameter's Element object value's  
     * "class" attribute contains any CSS class name entries listed in the 
     * "searchClass" parameter's value, one entry at a time. 
     * 
     * If the "singleMatch" parameter value is: 
     * - truthy, only ONE of the target CSS class names must be found; 
     * - falsy, ALL of the target CSS class names must be found. 
     * 
     * @returns {boolean | undefined} - 
     * - Boolean true or false depending on whether the "elementTarget" 
     *   parameter's Element object value's "class" attribute contains one or 
     *   all of the CSS class name entries in the "searchClass" parameter. 
     * - undefined if the Element API's classList property or ClassList API's 
     *   contains() method is not supported by a user's current Internet 
     *   browser. 
     */
    this.byClassList = function() {

        if (elementTarget.classList && elementTarget.classList.contains) {
            
            return this.checkClassEntries(this.byClSearch);
        }
    
        return undefined;
    }

    /**
     * Calls the Element API's classList property's contains() method to check  
     * whether the "elementTarget" parameter's Element object value has a 
     * single, target CSS class entry in its "class" attribute. 
     * 
     * @param {string} cssClass - A non-empty String, with no whitespace, 
     * containing the value of the CSS class name entry to be found in the 
     * "elementTarget" parameter's Element object value. 
     * 
     * @returns {boolean} - 
     * Boolean true or false depending on whether the "elementTarget" 
     * parameter's Element object value contains the CSS class name entry 
     * inside the argument to the "cssClass" parameter of this method. 
     */
    this.byClSearch = function(cssClass) {

        return elementTarget.classList.contains(cssClass);
    }

    /**
     * Checks whether a user's Internet browser supports the Element API's 
     * String-type "className" property, which contains the value of the 
     * "class" attribute in a DOM element. If it does, calls the 
     * checkClassEntries() function with the byCnSearch() method as an 
     * argument. This approach relies on the RegExp (regular expression) API's 
     * test() method to check whether the "className" property contains any CSS 
     * class name entries, listed in the "searchClass" parameter's value, one 
     * entry at a time. 
     * 
     * If the "singleMatch" parameter value is: 
     * - truthy, only ONE of the target CSS class names must be found; 
     * - falsy, ALL of the target CSS class names must be found. 
     * 
     * @returns {boolean | undefined} - 
     * - Boolean true or false depending on whether the "elementTarget" 
     *   parameter's Element value's "class" attribute contains one or all of 
     *   the target CSS class entries from the "searchClass" parameter's value. 
     * - undefined if the Element API's "className" property does not have the 
     *   primitive datatype of "string", meaning that it is not supported by a 
     *   user's Internet browser. 
     */
    this.byClassName = function() {

        if (typeof elementTarget.className === "string") {

            return this.checkClassEntries(this.checkWithRegex, 
                elementTarget.className);
        }
        
        return undefined;
    }

    /**
     * Checks whether a user's Internet browser supports the Element API's 
     * getAttribute() method, which is used to retrieve the value of the 
     * "class" attribute as it appears in a DOM element. If it does, calls the 
     * checkClassEntries() function with the byAttrSearch() method as an 
     * argument. This approach relies on the RegExp (regular expression) API's 
     * test() method to check whether the "class" attribute value returned by 
     * the getAttribute() method contains any CSS class name entries, listed in 
     * the "searchClass" parameter's value, one entry at a time. 
     * 
     * If the "singleMatch" parameter value is: 
     * - truthy, only ONE of the target CSS class names must be found; 
     * - falsy, ALL of the target CSS class names must be found. 
     * 
     * @returns {boolean | undefined} - 
     * - Boolean true or false depending on whether the "elementTarget" 
     *   parameter's Element value's "class" attribute contains one or all of 
     *   the target CSS class entries from the "searchClass" parameter's value. 
     * - undefined if the Element API's getAttribute() method is not supported 
     *   by a user's Internet browser. 
     */
    this.byAttribute = function() {

        if (!elementTarget.getAttribute) {
            
            return undefined;
        }

        var classValue = elementTarget.getAttribute("class");

        if (!classValue) {

            return false;
        }

        classValue = classValue.trim();

        if (!classValue) {

            return false;
        }

        return this.checkClassEntries(this.checkWithRegex, classValue);
    }

    /**
     * Checks whether an Element object's "class" attribute value contains a 
     * whole word entry for a CSS class name. Creates a new RegExp (regular 
     * expression API) object with the CSS class name entry and uses the RegExp 
     * object's test() method on the Element object's "class" attribute string 
     * value. Intended as a backup to other methods of the parent function that 
     * use the ClassList API's methods, as those methods are faster. 
     * 
     * @param {string} elementClass - A string value containing the Element 
     * object's "class" attribute value to be searched. 
     * @param {string} classEntry - A non-empty string value containing the CSS 
     * class name entry, which must be a whole word and contain no whitespace, 
     * to be found in the "elementClass" parameter's value. 
     * 
     * @returns {boolean} - 
     * Boolean true or false
     */
    this.checkWithRegex = function(elementClass, classEntry) {

        var searchRegex = new RegExp("\\b" + classEntry + "\\b");
        return searchRegex.test(elementClass);
    }

    /**
     * Checks whether the "elementTarget" parameter's Element object's "class" 
     * attribute value contains one or all of the CSS class name entries, which 
     * are listed in the "searchClass" parameter's value, using a search 
     * function for each CSS class name entry. 
     * 
     * If the "singleMatch" parameter value is: 
     * - truthy, only ONE of the target CSS class names must be found, and 
     *   either the singleMatchClassString() or singleMatchOneParam() method of 
     *   the parent function is called; 
     * - falsy, ALL of the target CSS class names must be found, and either the 
     *   allMatchClassString() or allMatchOneParam() method is called. 
     * 
     * @param {Function} searchFn - Required. Must be a method from the parent 
     * function. Relies on one or more specific JavaScript APIs, properties, or 
     * methods to find a single CSS class name entry, which is contained in the 
     * "searchClass" parameter's value, inside of the "elementTarget" 
     * parameter's Element object's "class" attribute value. 
     * @param {string} elementClass - Optional. Contains the "elementTarget" 
     * parameter's "class" attribute value that was retrieved using the Element 
     * API's "className" property or getAttribute() method. 
     * 
     * @returns {boolean} - 
     * Boolean true or false 
     */
    this.checkClassEntries = function(searchFn, elementClass) {

        if (singleMatch) {

            if (elementClass) {

                return this.singleMatchClassString(searchFn, elementClass);
            }

            return this.singleMatchOneParam(searchFn);
        }

        if (elementClass) {

            return this.allMatchClassString(searchFn, elementClass);
        }

        return this.allMatchOneParam(searchFn);
    }

    /**
     * When the "elementTarget" parameter's Element object's "class" attribute 
     * must be provided as an argument for a search function, checks whether it 
     * contains one of the CSS class name entries listed in the "searchClass" 
     * parameter. Used when the "singleMatch" parameter of the parent function 
     * is truthy. This function is mainly designed to call the byCnSearch() and 
     * byAttrSearch() methods of the parent function from an argument. 
     * 
     * @param {Function} searchFn - Required. Must be a method from the parent 
     * function. Relies on one or more specific JavaScript APIs, properties, or 
     * methods to find a single CSS class name entry, which is contained in the 
     * "searchClass" parameter's value, inside of the "elementTarget" 
     * parameter's Element object's "class" attribute value. 
     * @param {string} elementClass - Required. Contains the "elementTarget" 
     * parameter's "class" attribute value that was retrieved using the Element 
     * API's "className" property or getAttribute() method. 
     * 
     * @returns {boolean} - 
     * Boolean true or false 
     */
    this.singleMatchClassString = function(searchFn, elementClass) {

        var index, classEntry;

        for (index = 0; index < searchClass.length; index++) {

            classEntry = searchClass[index];

            if (searchFn(elementClass, classEntry)) {

                return true;
            }
        }

        return false;
    }

    /**
     * Taking a single search function argument, checks whether the 
     * "elementTarget" parameter's Element object's "class" attribute contains 
     * one of the CSS class name entries listed in the "searchClass" parameter. 
     * Used when the "singleMatch" parameter of the parent function is truthy. 
     * This function is mainly designed to call the byClSearch() method of the 
     * parent function from an argument. 
     * 
     * @param {Function} searchFn - Required. Must be a method from the parent 
     * function. Relies on one or more specific JavaScript APIs, properties, or 
     * methods to find a single CSS class name entry, which is contained in the 
     * "searchClass" parameter's value, inside of the "elementTarget" 
     * parameter's Element object's "class" attribute value. 
     * 
     * @returns {boolean} - 
     * Boolean true or false 
     */
    this.singleMatchOneParam = function(searchFn) {

        var index, classEntry;

        for (index = 0; index < searchClass.length; index++) {

            classEntry = searchClass[index];

            if (searchFn(classEntry)) {

                return true;
            }
        }

        return false;
    }

    /**
     * When the "elementTarget" parameter's Element object's "class" attribute 
     * must be provided as an argument for a search function, checks whether it 
     * contains all of the CSS class name entries listed in the "searchClass" 
     * parameter. Used when the "singleMatch" parameter of the parent function 
     * is falsy. This function is mainly designed to call the byCnSearch() and 
     * byAttrSearch() methods of the parent function from an argument. 
     * 
     * @param {Function} searchFn - Required. Must be a method from the parent 
     * function. Relies on one or more specific JavaScript APIs, properties, or 
     * methods to find a single CSS class name entry, which is contained in the 
     * "searchClass" parameter's value, inside of the "elementTarget" 
     * parameter's Element object's "class" attribute value. 
     * @param {string} elementClass - Required. Contains the "elementTarget" 
     * parameter's "class" attribute value that was retrieved using the Element 
     * API's "className" property or getAttribute() method. 
     * 
     * @returns {boolean} - 
     * Boolean true or false 
     */
    this.allMatchClassString = function(searchFn, elementClass) {

        var index, classEntry;

        for (index = 0; index < searchClass.length; index++) {

            classEntry = searchClass[index];

            if (!searchFn(elementClass, classEntry)) {

                return false;
            }
        }

        return true;
    }

    /**
     * Taking a single search function argument, checks whether the 
     * "elementTarget" parameter's Element object's "class" attribute contains 
     * all of the CSS class name entries listed in the "searchClass" parameter. 
     * Used when the "singleMatch" parameter of the parent function is falsy. 
     * This function is mainly designed to call the byClSearch() method of the 
     * parent function from an argument. 
     * 
     * @param {Function} searchFn - Required. Must be a method from the parent 
     * function. Relies on one or more specific JavaScript APIs, properties, or 
     * methods to find a single CSS class name entry, which is contained in the 
     * "searchClass" parameter's value, inside of the "elementTarget" 
     * parameter's Element object's "class" attribute value. 
     * 
     * @returns {boolean} - 
     * Boolean true or false 
     */
    this.allMatchOneParam = function(searchFn) {

        var index, classEntry;

        for (index = 0; index < searchClass.length; index++) {

            classEntry = searchClass[index];

            if (!searchFn(classEntry)) {

                return false;
            }
        }

        return true;
    }

    /* Main method calling and execution area */
    this.checkParameters();
    return this.tryMethods();
}
