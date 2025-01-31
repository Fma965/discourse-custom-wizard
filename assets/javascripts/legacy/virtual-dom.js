// discourse-skip-module

!(function(e){if("object"===typeof exports&&"undefined"!==typeof module){module.exports=e();}else if("function"===typeof define&&define.amd){define([],e);}else{let f;"undefined"!==typeof window?f=window:"undefined"!==typeof global?f=global:"undefined"!==typeof self&&(f=self),f.virtualDom=e();}})(function(){let define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){let a=typeof require==="function"&&require;if(!u&&a){return a(o,!0);}if(i){return i(o,!0);}let f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}let l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){let n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require==="function"&&require;for(let o=0;o<r.length;o++){s(r[o]);}return s;})({1:[function(require,module,exports){
let createElement = require("./vdom/create-element.js");

module.exports = createElement;

},{"./vdom/create-element.js":15}],2:[function(require,module,exports){
let diff = require("./vtree/diff.js");

module.exports = diff;

},{"./vtree/diff.js":35}],3:[function(require,module,exports){
let h = require("./virtual-hyperscript/index.js");

module.exports = h;

},{"./virtual-hyperscript/index.js":22}],4:[function(require,module,exports){
let diff = require("./diff.js");
let patch = require("./patch.js");
let h = require("./h.js");
let create = require("./create-element.js");
let VNode = require('./vnode/vnode.js');
let VText = require('./vnode/vtext.js');

module.exports = {
    diff,
    patch,
    h,
    create,
    VNode,
    VText
};

},{"./create-element.js":1,"./diff.js":2,"./h.js":3,"./patch.js":13,"./vnode/vnode.js":31,"./vnode/vtext.js":33}],5:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  let nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (let i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
'use strict';

let OneVersionConstraint = require('individual/one-version');

let MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

let hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    let hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":9}],8:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

let root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
},{}],9:[function(require,module,exports){
'use strict';

let Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    let key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    let enforceKey = key + '_ENFORCE_SINGLETON';

    let versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":8}],10:[function(require,module,exports){
(function (global){
let topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {};
let minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    let doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
},{"min-document":6}],11:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],12:[function(require,module,exports){
let nativeIsArray = Array.isArray;
let toString = Object.prototype.toString;

module.exports = nativeIsArray || isArray;

function isArray(obj) {
    return toString.call(obj) === "[object Array]";
}

},{}],13:[function(require,module,exports){
let patch = require("./vdom/patch.js");

module.exports = patch;

},{"./vdom/patch.js":18}],14:[function(require,module,exports){
let isObject = require("is-object");
let isHook = require("../vnode/is-vhook.js");

module.exports = applyProperties;

function applyProperties(node, props, previous) {
    for (let propName in props) {
        let propValue = props[propName];

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous);
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined);
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue;
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        let previousValue = previous[propName];

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (let attrName in previousValue) {
                    node.removeAttribute(attrName);
                }
            } else if (propName === "style") {
                for (let i in previousValue) {
                    node.style[i] = "";
                }
            } else if (typeof previousValue === "string") {
                node[propName] = "";
            } else {
                node[propName] = null;
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue);
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    let previousValue = previous ? previous[propName] : undefined;

    // Set attributes
    if (propName === "attributes") {
        for (let attrName in propValue) {
            let attrValue = propValue[attrName];

            if (attrValue === undefined) {
                node.removeAttribute(attrName);
            } else {
                node.setAttribute(attrName, attrValue);
            }
        }

        return;
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue;
        return;
    }

    if (!isObject(node[propName])) {
        node[propName] = {};
    }

    let replacer = propName === "style" ? "" : undefined;

    for (let k in propValue) {
        let value = propValue[k];
        node[propName][k] = (value === undefined) ? replacer : value;
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value);
    } else if (value.__proto__) {
        return value.__proto__;
    } else if (value.constructor) {
        return value.constructor.prototype;
    }
}

},{"../vnode/is-vhook.js":26,"is-object":11}],15:[function(require,module,exports){
let document = require("global/document");

let applyProperties = require("./apply-properties");

let isVNode = require("../vnode/is-vnode.js");
let isVText = require("../vnode/is-vtext.js");
let isWidget = require("../vnode/is-widget.js");
let handleThunk = require("../vnode/handle-thunk.js");

module.exports = createElement;

function createElement(vnode, opts) {
    let doc = opts ? opts.document || document : document;
    let warn = opts ? opts.warn : null;

    vnode = handleThunk(vnode).a;

    if (isWidget(vnode)) {
        return vnode.init();
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text);
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode);
        }
        return null;
    }

    let node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName);

    let props = vnode.properties;
    applyProperties(node, props);

    let children = vnode.children;

    for (let i = 0; i < children.length; i++) {
        let childNode = createElement(children[i], opts);
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node;
}

},{"../vnode/handle-thunk.js":24,"../vnode/is-vnode.js":27,"../vnode/is-vtext.js":28,"../vnode/is-widget.js":29,"./apply-properties":14,"global/document":10}],16:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

let noChild = {};

module.exports = domIndex;

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {};
    } else {
        indices.sort(ascending);
        return recurse(rootNode, tree, indices, nodes, 0);
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {};


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode;
        }

        let vChildren = tree.children;

        if (vChildren) {

            let childNodes = rootNode.childNodes;

            for (let i = 0; i < tree.children.length; i++) {
                rootIndex += 1;

                let vChild = vChildren[i] || noChild;
                let nextIndex = rootIndex + (vChild.count || 0);

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex);
                }

                rootIndex = nextIndex;
            }
        }
    }

    return nodes;
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false;
    }

    let minIndex = 0;
    let maxIndex = indices.length - 1;
    let currentIndex;
    let currentItem;

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0;
        currentItem = indices[currentIndex];

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right;
        } else if (currentItem < left) {
            minIndex = currentIndex + 1;
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1;
        } else {
            return true;
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1;
}

},{}],17:[function(require,module,exports){
let applyProperties = require("./apply-properties");

let isWidget = require("../vnode/is-widget.js");
let VPatch = require("../vnode/vpatch.js");

let updateWidget = require("./update-widget");

module.exports = applyPatch;

function applyPatch(vpatch, domNode, renderOptions) {
    let type = vpatch.type;
    let vNode = vpatch.vNode;
    let patch = vpatch.patch;

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode);
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions);
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions);
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions);
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions);
        case VPatch.ORDER:
            reorderChildren(domNode, patch);
            return domNode;
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties);
            return domNode;
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions));
        default:
            return domNode;
    }
}

function removeNode(domNode, vNode) {
    let parentNode = domNode.parentNode;

    if (parentNode) {
        parentNode.removeChild(domNode);
    }

    destroyWidget(domNode, vNode);

    return null;
}

function insertNode(parentNode, vNode, renderOptions) {
    let newNode = renderOptions.render(vNode, renderOptions);

    if (parentNode) {
        parentNode.appendChild(newNode);
    }

    return parentNode;
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    let newNode;

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text);
        newNode = domNode;
    } else {
        let parentNode = domNode.parentNode;
        newNode = renderOptions.render(vText, renderOptions);

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode);
        }
    }

    return newNode;
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    let updating = updateWidget(leftVNode, widget);
    let newNode;

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode;
    } else {
        newNode = renderOptions.render(widget, renderOptions);
    }

    let parentNode = domNode.parentNode;

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode);
    }

    return newNode;
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    let parentNode = domNode.parentNode;
    let newNode = renderOptions.render(vNode, renderOptions);

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
    }

    return newNode;
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode);
    }
}

function reorderChildren(domNode, moves) {
    let childNodes = domNode.childNodes;
    let keyMap = {};
    let node;
    let remove;
    let insert;

    for (let i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i];
        node = childNodes[remove.from];
        if (remove.key) {
            keyMap[remove.key] = node;
        }
        domNode.removeChild(node);
    }

    let length = childNodes.length;
    for (let j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j];
        node = keyMap[insert.key];
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot);
    }

    return newRoot;
}

},{"../vnode/is-widget.js":29,"../vnode/vpatch.js":32,"./apply-properties":14,"./update-widget":19}],18:[function(require,module,exports){
let document = require("global/document");
let isArray = require("x-is-array");

let render = require("./create-element");
let domIndex = require("./dom-index");
let patchOp = require("./patch-op");
module.exports = patch;

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {};
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive;
    renderOptions.render = renderOptions.render || render;

    return renderOptions.patch(rootNode, patches, renderOptions);
}

function patchRecursive(rootNode, patches, renderOptions) {
    let indices = patchIndices(patches);

    if (indices.length === 0) {
        return rootNode;
    }

    let index = domIndex(rootNode, patches.a, indices);
    let ownerDocument = rootNode.ownerDocument;

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument;
    }

    for (let i = 0; i < indices.length; i++) {
        let nodeIndex = indices[i];
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions);
    }

    return rootNode;
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode;
    }

    let newNode;

    if (isArray(patchList)) {
        for (let i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions);

            if (domNode === rootNode) {
                rootNode = newNode;
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions);

        if (domNode === rootNode) {
            rootNode = newNode;
        }
    }

    return rootNode;
}

function patchIndices(patches) {
    let indices = [];

    for (let key in patches) {
        if (key !== "a") {
            indices.push(Number(key));
        }
    }

    return indices;
}

},{"./create-element":15,"./dom-index":16,"./patch-op":17,"global/document":10,"x-is-array":12}],19:[function(require,module,exports){
let isWidget = require("../vnode/is-widget.js");

module.exports = updateWidget;

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id;
        } else {
            return a.init === b.init;
        }
    }

    return false;
}

},{"../vnode/is-widget.js":29}],20:[function(require,module,exports){
'use strict';

let EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    let es = EvStore(node);
    let propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    let es = EvStore(node);
    let propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":7}],21:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],22:[function(require,module,exports){
'use strict';

let isArray = require('x-is-array');

let VNode = require('../vnode/vnode.js');
let VText = require('../vnode/vtext.js');
let isVNode = require('../vnode/is-vnode');
let isVText = require('../vnode/is-vtext');
let isWidget = require('../vnode/is-widget');
let isHook = require('../vnode/is-vhook');
let isVThunk = require('../vnode/is-thunk');

let parseTag = require('./parse-tag.js');
let softSetHook = require('./hooks/soft-set-hook.js');
let evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    let childNodes = [];
    let tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (let i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (let propName in props) {
        if (props.hasOwnProperty(propName)) {
            let value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    let err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode);
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":25,"../vnode/is-vhook":26,"../vnode/is-vnode":27,"../vnode/is-vtext":28,"../vnode/is-widget":29,"../vnode/vnode.js":31,"../vnode/vtext.js":33,"./hooks/ev-hook.js":20,"./hooks/soft-set-hook.js":21,"./parse-tag.js":23,"x-is-array":12}],23:[function(require,module,exports){
'use strict';

let split = require('browser-split');

let classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
let notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    let noId = !(props.hasOwnProperty('id'));

    let tagParts = split(tag, classIdSplit);
    let tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    let classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":5}],24:[function(require,module,exports){
let isVNode = require("./is-vnode");
let isVText = require("./is-vtext");
let isWidget = require("./is-widget");
let isThunk = require("./is-thunk");

module.exports = handleThunk;

function handleThunk(a, b) {
    let renderedA = a;
    let renderedB = b;

    if (isThunk(b)) {
        renderedB = renderThunk(b, a);
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null);
    }

    return {
        a: renderedA,
        b: renderedB
    };
}

function renderThunk(thunk, previous) {
    let renderedThunk = thunk.vnode;

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous);
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk;
}

},{"./is-thunk":25,"./is-vnode":27,"./is-vtext":28,"./is-widget":29}],25:[function(require,module,exports){
module.exports = isThunk;

function isThunk(t) {
    return t && t.type === "Thunk";
}

},{}],26:[function(require,module,exports){
module.exports = isHook;

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"));
}

},{}],27:[function(require,module,exports){
let version = require("./version");

module.exports = isVirtualNode;

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version;
}

},{"./version":30}],28:[function(require,module,exports){
let version = require("./version");

module.exports = isVirtualText;

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version;
}

},{"./version":30}],29:[function(require,module,exports){
module.exports = isWidget;

function isWidget(w) {
    return w && w.type === "Widget";
}

},{}],30:[function(require,module,exports){
module.exports = "2";

},{}],31:[function(require,module,exports){
let version = require("./version");
let isVNode = require("./is-vnode");
let isWidget = require("./is-widget");
let isThunk = require("./is-thunk");
let isVHook = require("./is-vhook");

module.exports = VirtualNode;

let noProperties = {};
let noChildren = [];

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName;
    this.properties = properties || noProperties;
    this.children = children || noChildren;
    this.key = key != null ? String(key) : undefined;
    this.namespace = (typeof namespace === "string") ? namespace : null;

    let count = (children && children.length) || 0;
    let descendants = 0;
    let hasWidgets = false;
    let hasThunks = false;
    let descendantHooks = false;
    let hooks;

    for (let propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            let property = properties[propName];
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {};
                }

                hooks[propName] = property;
            }
        }
    }

    for (let i = 0; i < count; i++) {
        let child = children[i];
        if (isVNode(child)) {
            descendants += child.count || 0;

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true;
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true;
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true;
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true;
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants;
    this.hasWidgets = hasWidgets;
    this.hasThunks = hasThunks;
    this.hooks = hooks;
    this.descendantHooks = descendantHooks;
}

VirtualNode.prototype.version = version;
VirtualNode.prototype.type = "VirtualNode";

},{"./is-thunk":25,"./is-vhook":26,"./is-vnode":27,"./is-widget":29,"./version":30}],32:[function(require,module,exports){
let version = require("./version");

VirtualPatch.NONE = 0;
VirtualPatch.VTEXT = 1;
VirtualPatch.VNODE = 2;
VirtualPatch.WIDGET = 3;
VirtualPatch.PROPS = 4;
VirtualPatch.ORDER = 5;
VirtualPatch.INSERT = 6;
VirtualPatch.REMOVE = 7;
VirtualPatch.THUNK = 8;

module.exports = VirtualPatch;

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type);
    this.vNode = vNode;
    this.patch = patch;
}

VirtualPatch.prototype.version = version;
VirtualPatch.prototype.type = "VirtualPatch";

},{"./version":30}],33:[function(require,module,exports){
let version = require("./version");

module.exports = VirtualText;

function VirtualText(text) {
    this.text = String(text);
}

VirtualText.prototype.version = version;
VirtualText.prototype.type = "VirtualText";

},{"./version":30}],34:[function(require,module,exports){
let isObject = require("is-object");
let isHook = require("../vnode/is-vhook");

module.exports = diffProps;

function diffProps(a, b) {
    let diff;

    for (let aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {};
            diff[aKey] = undefined;
        }

        let aValue = a[aKey];
        let bValue = b[aKey];

        if (aValue === bValue) {
            continue;
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {};
                diff[aKey] = bValue;
            } else if (isHook(bValue)) {
                 diff = diff || {};
                 diff[aKey] = bValue;
            } else {
                let objectDiff = diffProps(aValue, bValue);
                if (objectDiff) {
                    diff = diff || {};
                    diff[aKey] = objectDiff;
                }
            }
        } else {
            diff = diff || {};
            diff[aKey] = bValue;
        }
    }

    for (let bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {};
            diff[bKey] = b[bKey];
        }
    }

    return diff;
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value);
  } else if (value.__proto__) {
    return value.__proto__;
  } else if (value.constructor) {
    return value.constructor.prototype;
  }
}

},{"../vnode/is-vhook":26,"is-object":11}],35:[function(require,module,exports){
let isArray = require("x-is-array");

let VPatch = require("../vnode/vpatch");
let isVNode = require("../vnode/is-vnode");
let isVText = require("../vnode/is-vtext");
let isWidget = require("../vnode/is-widget");
let isThunk = require("../vnode/is-thunk");
let handleThunk = require("../vnode/handle-thunk");

let diffProps = require("./diff-props");

module.exports = diff;

function diff(a, b) {
    let patch = { a };
    walk(a, b, patch, 0);
    return patch;
}

function walk(a, b, patch, index) {
    if (a === b) {
        return;
    }

    let apply = patch[index];
    let applyClear = false;

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index);
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index);
            apply = patch[index];
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b));
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                let propsPatch = diffProps(a.properties, b.properties);
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch));
                }
                apply = diffChildren(a, b, patch, apply, index);
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
                applyClear = true;
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
            applyClear = true;
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
            applyClear = true;
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true;
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b));
    }

    if (apply) {
        patch[index] = apply;
    }

    if (applyClear) {
        clearState(a, patch, index);
    }
}

function diffChildren(a, b, patch, apply, index) {
    let aChildren = a.children;
    let orderedSet = reorder(aChildren, b.children);
    let bChildren = orderedSet.children;

    let aLen = aChildren.length;
    let bLen = bChildren.length;
    let len = aLen > bLen ? aLen : bLen;

    for (let i = 0; i < len; i++) {
        let leftNode = aChildren[i];
        let rightNode = bChildren[i];
        index += 1;

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode));
            }
        } else {
            walk(leftNode, rightNode, patch, index);
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count;
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ));
    }

    return apply;
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index);
    destroyWidgets(vNode, patch, index);
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            );
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        let children = vNode.children;
        let len = children.length;
        for (let i = 0; i < len; i++) {
            let child = children[i];
            index += 1;

            destroyWidgets(child, patch, index);

            if (isVNode(child) && child.count) {
                index += child.count;
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index);
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    let nodes = handleThunk(a, b);
    let thunkPatch = diff(nodes.a, nodes.b);
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch);
    }
}

function hasPatches(patch) {
    for (let index in patch) {
        if (index !== "a") {
            return true;
        }
    }

    return false;
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            );
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            let children = vNode.children;
            let len = children.length;
            for (let i = 0; i < len; i++) {
                let child = children[i];
                index += 1;

                unhook(child, patch, index);

                if (isVNode(child) && child.count) {
                    index += child.count;
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index);
    }
}

function undefinedKeys(obj) {
    let result = {};

    for (let key in obj) {
        result[key] = undefined;
    }

    return result;
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    let bChildIndex = keyIndex(bChildren);
    let bKeys = bChildIndex.keys;
    let bFree = bChildIndex.free;

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        };
    }

    // O(N) time, O(N) memory
    let aChildIndex = keyIndex(aChildren);
    let aKeys = aChildIndex.keys;
    let aFree = aChildIndex.free;

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        };
    }

    // O(MAX(N, M)) memory
    let newChildren = [];

    let freeIndex = 0;
    let freeCount = bFree.length;
    let deletedItems = 0;

    // Iterate through a and match a node in b
    // O(N) time,
    for (let i = 0 ; i < aChildren.length; i++) {
        let aItem = aChildren[i];
        var itemIndex;

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key];
                newChildren.push(bChildren[itemIndex]);

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++;
                newChildren.push(null);
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++];
                newChildren.push(bChildren[itemIndex]);
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++;
                newChildren.push(null);
            }
        }
    }

    let lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex];

    // Iterate through b and append any new keys
    // O(M) time
    for (let j = 0; j < bChildren.length; j++) {
        let newItem = bChildren[j];

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem);
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem);
        }
    }

    let simulate = newChildren.slice();
    let simulateIndex = 0;
    let removes = [];
    let inserts = [];
    let simulateItem;

    for (let k = 0; k < bChildren.length;) {
        let wantedItem = bChildren[k];
        simulateItem = simulate[simulateIndex];

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null));
            simulateItem = simulate[simulateIndex];
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key));
                        simulateItem = simulate[simulateIndex];
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k});
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++;
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k});
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k});
                }
                k++;
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key));
            }
        }
        else {
            simulateIndex++;
            k++;
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex];
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key));
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        };
    }

    return {
        children: newChildren,
        moves: {
            removes,
            inserts
        }
    };
}

function remove(arr, index, key) {
    arr.splice(index, 1);

    return {
        from: index,
        key
    };
}

function keyIndex(children) {
    let keys = {};
    let free = [];
    let length = children.length;

    for (let i = 0; i < length; i++) {
        let child = children[i];

        if (child.key) {
            keys[child.key] = i;
        } else {
            free.push(i);
        }
    }

    return {
        keys,     // A hash of key name to index
        free      // An array of unkeyed item indices
    };
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch);
        } else {
            apply = [apply, patch];
        }

        return apply;
    } else {
        return patch;
    }
}

},{"../vnode/handle-thunk":24,"../vnode/is-thunk":25,"../vnode/is-vnode":27,"../vnode/is-vtext":28,"../vnode/is-widget":29,"../vnode/vpatch":32,"./diff-props":34,"x-is-array":12}]},{},[4])(4);
});
