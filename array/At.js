
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
 * A polyfill function that implements backwards-compatibility for the Array 
 * class's at() method for Internet browsers that do not support it. 
 * 
 * The Array's at() method is considered experimental, and it is a relatively 
 * new specification at the time this function was authored. The nature of or 
 * uses cases for this function may thus be subject to change in the future. 
 * Though accurate to the behavior of the Array's at() method at the time of 
 * authorship, this function's implementation may become outdated or 
 * inconsistent if the official specification for it changes, potentially 
 * opening the need for future updates to this polyfill function. 
 * 
 * Note: MDN = Mozilla Developer Network
 * 
 * From the primary description of the MDN page on the Array at() method: 
 * "The at() method takes an integer value and returns the item at that index, 
 * allowing for positive and negative integers. Negative integers count back 
 * from the last item in the array."
 * 
 * Reference the MDN page for the latest documentation on and instructions for 
 * using the Array class's at() method: 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
 * 
 * @param { Array | object } targetObj - Required parameter. An Array or 
 * Array-like object which will have an entry at one of its indices retrieved. 
 * An object passed to this parameter must have a consecutively indexed range 
 * of entries and a "length" property indicating the number of entries in the 
 * range. A valid argument must not be undefined or null. Usually, when the 
 * at() polyfill parent method is called, this value will be the "this" 
 * property from the parent function. 
 * 
 * @param { number } parentArgLen - Required parameter. Contains the integer 
 * number of arguments passed to the parent polyfill calling method. This is 
 * used for telling whether an argument was passed to the optional "index" 
 * parameter of this function. 
 * 
 * @param { number } index - Optional parameter. From MDN: 
 * "The index (position) of the array element to be returned. Supports relative 
 * indexing from the end of the array when passed a negative index; i.e. if a 
 * negative number is used, the element returned will be found by counting back 
 * from the end of the array." 
 * 
 * @throws - 
 * A TypeError exception if the argument to the "targetObj" parameter is 
 * undefined or null. 
 * 
 * @returns { any | undefined } - 
 * From MDN: 
 * "The element in the array matching the given index. Returns undefined if the 
 * given index can not be found." 
 * If both the "targetObj" argument and "index" value are valid, returns the 
 * element at the index in the Array or Array-like object. Else, return 
 * undefined to signify that the "targetObj" argument is not a valid list, or 
 * the "index" value does not reference any existing element in the range of 
 * entries in the list. 
 */
function arrayAtPolyfill(targetObj, parentArgLen, index) {

    /**
     * Checks whether the argument passed to the "targetObj" parameter is not 
     * undefined or null, which indicate empty "this" or target object values, 
     * and whether it has a "length" number data-type property. The "length" 
     * property must be included to indicate the number of entries as an 
     * integer in a consecutively-indexed range in the object. 
     * 
     * @throws - 
     * A TypeError exception if the argument to the "targetObj" parameter is 
     * undefined or null. 
     * 
     * @returns { boolean } - 
     * Boolean true or false depending on whether the value
     */
    function checkTargetObj() {

        if (typeof targetObj === "undefined" || targetObj === null) {

            throw new TypeError("Parameter \"targetObj\" must not be null " 
                + "or undefined.");
        }
    
        return typeof targetObj.length === "number";
    }
    
    /**
     * Checks whether an argument was passed to the optional "index" parameter. 
     * If no index argument was specified or an index value is not a valid 
     * Number (NaN), defaults to an index value of 0 if the "targetObj" 
     * argument has entries. 
     * 
     * If it was, checks whether it represents a valid numerical index inside 
     * the range of values for the "targetObj" argument. An existing "index" 
     * argument is converted to a Number and has any decimal portion truncated 
     * to only include its integer portion. Negative integer values are 
     * subtracted from the end of the list, or "length" property, of the 
     * "targetObj" argument to try to determine a positive index inside of its 
     * entries range. 
     * 
     * @returns { boolean } - 
     * Boolean true if the index: 
     * - was not specified or is not a Number, and the "targetObj" argument has 
     *   entries. This allows it to default to 0, or the first entry in the 
     *   list. 
     * - is zero or positive and is in the range of entries in the "targetObj" 
     *   argument, or less than the "length" property. 
     * - is negative and does not has an absolute value greater than the 
     *   "length" property of "targetObj", allowing it to reference a valid 
     *   positively or zero-indexed entry in the list. 
     * 
     * Boolean false if the index: 
     * - was not specified or is not a Number, and the "targetObj" argument has 
     *   no entries. Thus, a default value of 0 does not reference an existing 
     *   entry in the list. 
     * - is zero or positive and is greater than or equal to the "length" 
     *   property of the "targetObj" argument of the list. The index value thus 
     *   does not reference any entries in the range of the list. 
     * - is negative and has an absolute value greater than the "length" 
     *   property of the "targetObj" parameter. The index value reaches before 
     *   the start of the list, and thus does not reference any valid entries 
     *   in its range. 
     */
    function checkIndex() {

        index = Number(index);

        if ( !parentArgLen || isNaN(index) ) {

            if (targetObj.length) {
                
                index = 0;
                return true;
            }
            
            return false;
        }

        if (index >= 0) {

            if (index < targetObj.length) {

                index = Math.floor(index);
                return true;
            }
            
            return false;
        }

        index = targetObj.length + Math.ceil(index);
        return index >= 0;
    }

    /* Main function execution area */
    return checkTargetObj() && checkIndex() ? targetObj[index] : undefined;
}

/* If the Array class's at() method is not supported by the current Internet 
 browser, override the property in its prototype with a call to the polyfill 
 function defined above. Note that the native implementation should always be 
 prioritized over the polyfilled one, since it may perform more quickly or may 
 be more standard-compliant in the future. */
if (!Array.prototype.at) {

    Array.prototype.at = function(index) {

        return arrayAtPolyfill(this, arguments.length, index);
    }
}
