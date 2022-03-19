var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
function noop() {
}
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props)
    if (k[0] !== "$")
      result[k] = props[k];
  return result;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
function compute_slots(slots) {
  const result = {};
  for (const key in slots) {
    result[key] = true;
  }
  return result;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
let is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function upper_bound(low, high, key, value) {
  while (low < high) {
    const mid = low + (high - low >> 1);
    if (key(mid) <= value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}
function init_hydrate(target) {
  if (target.hydrate_init)
    return;
  target.hydrate_init = true;
  let children2 = target.childNodes;
  if (target.nodeName === "HEAD") {
    const myChildren = [];
    for (let i = 0; i < children2.length; i++) {
      const node = children2[i];
      if (node.claim_order !== void 0) {
        myChildren.push(node);
      }
    }
    children2 = myChildren;
  }
  const m = new Int32Array(children2.length + 1);
  const p = new Int32Array(children2.length);
  m[0] = -1;
  let longest = 0;
  for (let i = 0; i < children2.length; i++) {
    const current = children2[i].claim_order;
    const seqLen = (longest > 0 && children2[m[longest]].claim_order <= current ? longest + 1 : upper_bound(1, longest, (idx) => children2[m[idx]].claim_order, current)) - 1;
    p[i] = m[seqLen] + 1;
    const newLen = seqLen + 1;
    m[newLen] = i;
    longest = Math.max(newLen, longest);
  }
  const lis = [];
  const toMove = [];
  let last = children2.length - 1;
  for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
    lis.push(children2[cur - 1]);
    for (; last >= cur; last--) {
      toMove.push(children2[last]);
    }
    last--;
  }
  for (; last >= 0; last--) {
    toMove.push(children2[last]);
  }
  lis.reverse();
  toMove.sort((a, b) => a.claim_order - b.claim_order);
  for (let i = 0, j = 0; i < toMove.length; i++) {
    while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
      j++;
    }
    const anchor = j < lis.length ? lis[j] : null;
    target.insertBefore(toMove[i], anchor);
  }
}
function append_hydration(target, node) {
  if (is_hydrating) {
    init_hydrate(target);
    if (target.actual_end_child === void 0 || target.actual_end_child !== null && target.actual_end_child.parentElement !== target) {
      target.actual_end_child = target.firstChild;
    }
    while (target.actual_end_child !== null && target.actual_end_child.claim_order === void 0) {
      target.actual_end_child = target.actual_end_child.nextSibling;
    }
    if (node !== target.actual_end_child) {
      if (node.claim_order !== void 0 || node.parentNode !== target) {
        target.insertBefore(node, target.actual_end_child);
      }
    } else {
      target.actual_end_child = node.nextSibling;
    }
  } else if (node.parentNode !== target || node.nextSibling !== null) {
    target.appendChild(node);
  }
}
function insert_hydration(target, node, anchor) {
  if (is_hydrating && !anchor) {
    append_hydration(target, node);
  } else if (node.parentNode !== target || node.nextSibling != anchor) {
    target.insertBefore(node, anchor || null);
  }
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
  const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
  for (const key in attributes) {
    if (attributes[key] == null) {
      node.removeAttribute(key);
    } else if (key === "style") {
      node.style.cssText = attributes[key];
    } else if (key === "__value") {
      node.value = node[key] = attributes[key];
    } else if (descriptors[key] && descriptors[key].set) {
      node[key] = attributes[key];
    } else {
      attr(node, key, attributes[key]);
    }
  }
}
function set_svg_attributes(node, attributes) {
  for (const key in attributes) {
    attr(node, key, attributes[key]);
  }
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function init_claim_info(nodes) {
  if (nodes.claim_info === void 0) {
    nodes.claim_info = { last_index: 0, total_claimed: 0 };
  }
}
function claim_node(nodes, predicate, processNode, createNode, dontUpdateLastIndex = false) {
  init_claim_info(nodes);
  const resultNode = (() => {
    for (let i = nodes.claim_info.last_index; i < nodes.length; i++) {
      const node = nodes[i];
      if (predicate(node)) {
        const replacement = processNode(node);
        if (replacement === void 0) {
          nodes.splice(i, 1);
        } else {
          nodes[i] = replacement;
        }
        if (!dontUpdateLastIndex) {
          nodes.claim_info.last_index = i;
        }
        return node;
      }
    }
    for (let i = nodes.claim_info.last_index - 1; i >= 0; i--) {
      const node = nodes[i];
      if (predicate(node)) {
        const replacement = processNode(node);
        if (replacement === void 0) {
          nodes.splice(i, 1);
        } else {
          nodes[i] = replacement;
        }
        if (!dontUpdateLastIndex) {
          nodes.claim_info.last_index = i;
        } else if (replacement === void 0) {
          nodes.claim_info.last_index--;
        }
        return node;
      }
    }
    return createNode();
  })();
  resultNode.claim_order = nodes.claim_info.total_claimed;
  nodes.claim_info.total_claimed += 1;
  return resultNode;
}
function claim_element_base(nodes, name, attributes, create_element) {
  return claim_node(nodes, (node) => node.nodeName === name, (node) => {
    const remove = [];
    for (let j = 0; j < node.attributes.length; j++) {
      const attribute = node.attributes[j];
      if (!attributes[attribute.name]) {
        remove.push(attribute.name);
      }
    }
    remove.forEach((v) => node.removeAttribute(v));
    return void 0;
  }, () => create_element(name));
}
function claim_element(nodes, name, attributes) {
  return claim_element_base(nodes, name, attributes, element);
}
function claim_svg_element(nodes, name, attributes) {
  return claim_element_base(nodes, name, attributes, svg_element);
}
function claim_text(nodes, data) {
  return claim_node(nodes, (node) => node.nodeType === 3, (node) => {
    const dataStr = "" + data;
    if (node.data.startsWith(dataStr)) {
      if (node.data.length !== dataStr.length) {
        return node.splitText(dataStr.length);
      }
    } else {
      node.data = dataStr;
    }
  }, () => text(data), true);
}
function claim_space(nodes) {
  return claim_text(nodes, " ");
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
function outro_and_destroy_block(block, lookup) {
  transition_out(block, 1, 1, () => {
    lookup.delete(block.key);
  });
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else if (dynamic) {
      block.p(child_ctx, dirty);
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert(new_blocks[n - 1]);
  return new_blocks;
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2))
      update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function claim_component(block, parent_nodes) {
  block && block.l(parent_nodes);
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2)
      if (Object.prototype.hasOwnProperty.call(b2, p))
        d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
}
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFoundation = function() {
  function MDCFoundation2(adapter) {
    if (adapter === void 0) {
      adapter = {};
    }
    this.adapter = adapter;
  }
  Object.defineProperty(MDCFoundation2, "cssClasses", {
    get: function() {
      return {};
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCFoundation2, "strings", {
    get: function() {
      return {};
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCFoundation2, "numbers", {
    get: function() {
      return {};
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCFoundation2, "defaultAdapter", {
    get: function() {
      return {};
    },
    enumerable: false,
    configurable: true
  });
  MDCFoundation2.prototype.init = function() {
  };
  MDCFoundation2.prototype.destroy = function() {
  };
  return MDCFoundation2;
}();
/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function applyPassive$1(globalObj) {
  if (globalObj === void 0) {
    globalObj = window;
  }
  return supportsPassiveOption(globalObj) ? { passive: true } : false;
}
function supportsPassiveOption(globalObj) {
  if (globalObj === void 0) {
    globalObj = window;
  }
  var passiveSupported = false;
  try {
    var options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    var handler = function() {
    };
    globalObj.document.addEventListener("test", handler, options);
    globalObj.document.removeEventListener("test", handler, options);
  } catch (err) {
    passiveSupported = false;
  }
  return passiveSupported;
}
var events = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyPassive: applyPassive$1
}, Symbol.toStringTag, { value: "Module" }));
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function closest(element2, selector) {
  if (element2.closest) {
    return element2.closest(selector);
  }
  var el = element2;
  while (el) {
    if (matches$1(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
function matches$1(element2, selector) {
  var nativeMatches = element2.matches || element2.webkitMatchesSelector || element2.msMatchesSelector;
  return nativeMatches.call(element2, selector);
}
function estimateScrollWidth(element2) {
  var htmlEl = element2;
  if (htmlEl.offsetParent !== null) {
    return htmlEl.scrollWidth;
  }
  var clone = htmlEl.cloneNode(true);
  clone.style.setProperty("position", "absolute");
  clone.style.setProperty("transform", "translate(-9999px, -9999px)");
  document.documentElement.appendChild(clone);
  var scrollWidth = clone.scrollWidth;
  document.documentElement.removeChild(clone);
  return scrollWidth;
}
var ponyfill = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  closest,
  matches: matches$1,
  estimateScrollWidth
}, Symbol.toStringTag, { value: "Module" }));
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$9 = {
  ANIMATING: "mdc-tab-scroller--animating",
  SCROLL_AREA_SCROLL: "mdc-tab-scroller__scroll-area--scroll",
  SCROLL_TEST: "mdc-tab-scroller__test"
};
var strings$8 = {
  AREA_SELECTOR: ".mdc-tab-scroller__scroll-area",
  CONTENT_SELECTOR: ".mdc-tab-scroller__scroll-content"
};
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTabScrollerRTL = function() {
  function MDCTabScrollerRTL2(adapter) {
    this.adapter = adapter;
  }
  return MDCTabScrollerRTL2;
}();
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTabScrollerRTLDefault = function(_super) {
  __extends(MDCTabScrollerRTLDefault2, _super);
  function MDCTabScrollerRTLDefault2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  MDCTabScrollerRTLDefault2.prototype.getScrollPositionRTL = function() {
    var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    var right = this.calculateScrollEdges().right;
    return Math.round(right - currentScrollLeft);
  };
  MDCTabScrollerRTLDefault2.prototype.scrollToRTL = function(scrollX) {
    var edges = this.calculateScrollEdges();
    var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    var clampedScrollLeft = this.clampScrollValue(edges.right - scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: clampedScrollLeft - currentScrollLeft
    };
  };
  MDCTabScrollerRTLDefault2.prototype.incrementScrollRTL = function(scrollX) {
    var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    var clampedScrollLeft = this.clampScrollValue(currentScrollLeft - scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: clampedScrollLeft - currentScrollLeft
    };
  };
  MDCTabScrollerRTLDefault2.prototype.getAnimatingScrollPosition = function(scrollX) {
    return scrollX;
  };
  MDCTabScrollerRTLDefault2.prototype.calculateScrollEdges = function() {
    var contentWidth = this.adapter.getScrollContentOffsetWidth();
    var rootWidth = this.adapter.getScrollAreaOffsetWidth();
    return {
      left: 0,
      right: contentWidth - rootWidth
    };
  };
  MDCTabScrollerRTLDefault2.prototype.clampScrollValue = function(scrollX) {
    var edges = this.calculateScrollEdges();
    return Math.min(Math.max(edges.left, scrollX), edges.right);
  };
  return MDCTabScrollerRTLDefault2;
}(MDCTabScrollerRTL);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTabScrollerRTLNegative = function(_super) {
  __extends(MDCTabScrollerRTLNegative2, _super);
  function MDCTabScrollerRTLNegative2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  MDCTabScrollerRTLNegative2.prototype.getScrollPositionRTL = function(translateX) {
    var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    return Math.round(translateX - currentScrollLeft);
  };
  MDCTabScrollerRTLNegative2.prototype.scrollToRTL = function(scrollX) {
    var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    var clampedScrollLeft = this.clampScrollValue(-scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: clampedScrollLeft - currentScrollLeft
    };
  };
  MDCTabScrollerRTLNegative2.prototype.incrementScrollRTL = function(scrollX) {
    var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    var clampedScrollLeft = this.clampScrollValue(currentScrollLeft - scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: clampedScrollLeft - currentScrollLeft
    };
  };
  MDCTabScrollerRTLNegative2.prototype.getAnimatingScrollPosition = function(scrollX, translateX) {
    return scrollX - translateX;
  };
  MDCTabScrollerRTLNegative2.prototype.calculateScrollEdges = function() {
    var contentWidth = this.adapter.getScrollContentOffsetWidth();
    var rootWidth = this.adapter.getScrollAreaOffsetWidth();
    return {
      left: rootWidth - contentWidth,
      right: 0
    };
  };
  MDCTabScrollerRTLNegative2.prototype.clampScrollValue = function(scrollX) {
    var edges = this.calculateScrollEdges();
    return Math.max(Math.min(edges.right, scrollX), edges.left);
  };
  return MDCTabScrollerRTLNegative2;
}(MDCTabScrollerRTL);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTabScrollerRTLReverse = function(_super) {
  __extends(MDCTabScrollerRTLReverse2, _super);
  function MDCTabScrollerRTLReverse2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  MDCTabScrollerRTLReverse2.prototype.getScrollPositionRTL = function(translateX) {
    var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    return Math.round(currentScrollLeft - translateX);
  };
  MDCTabScrollerRTLReverse2.prototype.scrollToRTL = function(scrollX) {
    var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    var clampedScrollLeft = this.clampScrollValue(scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: currentScrollLeft - clampedScrollLeft
    };
  };
  MDCTabScrollerRTLReverse2.prototype.incrementScrollRTL = function(scrollX) {
    var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    var clampedScrollLeft = this.clampScrollValue(currentScrollLeft + scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: currentScrollLeft - clampedScrollLeft
    };
  };
  MDCTabScrollerRTLReverse2.prototype.getAnimatingScrollPosition = function(scrollX, translateX) {
    return scrollX + translateX;
  };
  MDCTabScrollerRTLReverse2.prototype.calculateScrollEdges = function() {
    var contentWidth = this.adapter.getScrollContentOffsetWidth();
    var rootWidth = this.adapter.getScrollAreaOffsetWidth();
    return {
      left: contentWidth - rootWidth,
      right: 0
    };
  };
  MDCTabScrollerRTLReverse2.prototype.clampScrollValue = function(scrollX) {
    var edges = this.calculateScrollEdges();
    return Math.min(Math.max(edges.right, scrollX), edges.left);
  };
  return MDCTabScrollerRTLReverse2;
}(MDCTabScrollerRTL);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTabScrollerFoundation = function(_super) {
  __extends(MDCTabScrollerFoundation2, _super);
  function MDCTabScrollerFoundation2(adapter) {
    var _this = _super.call(this, __assign(__assign({}, MDCTabScrollerFoundation2.defaultAdapter), adapter)) || this;
    _this.isAnimating = false;
    return _this;
  }
  Object.defineProperty(MDCTabScrollerFoundation2, "cssClasses", {
    get: function() {
      return cssClasses$9;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTabScrollerFoundation2, "strings", {
    get: function() {
      return strings$8;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTabScrollerFoundation2, "defaultAdapter", {
    get: function() {
      return {
        eventTargetMatchesSelector: function() {
          return false;
        },
        addClass: function() {
          return void 0;
        },
        removeClass: function() {
          return void 0;
        },
        addScrollAreaClass: function() {
          return void 0;
        },
        setScrollAreaStyleProperty: function() {
          return void 0;
        },
        setScrollContentStyleProperty: function() {
          return void 0;
        },
        getScrollContentStyleValue: function() {
          return "";
        },
        setScrollAreaScrollLeft: function() {
          return void 0;
        },
        getScrollAreaScrollLeft: function() {
          return 0;
        },
        getScrollContentOffsetWidth: function() {
          return 0;
        },
        getScrollAreaOffsetWidth: function() {
          return 0;
        },
        computeScrollAreaClientRect: function() {
          return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
        },
        computeScrollContentClientRect: function() {
          return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
        },
        computeHorizontalScrollbarHeight: function() {
          return 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCTabScrollerFoundation2.prototype.init = function() {
    var horizontalScrollbarHeight = this.adapter.computeHorizontalScrollbarHeight();
    this.adapter.setScrollAreaStyleProperty("margin-bottom", -horizontalScrollbarHeight + "px");
    this.adapter.addScrollAreaClass(MDCTabScrollerFoundation2.cssClasses.SCROLL_AREA_SCROLL);
  };
  MDCTabScrollerFoundation2.prototype.getScrollPosition = function() {
    if (this.isRTL()) {
      return this.computeCurrentScrollPositionRTL();
    }
    var currentTranslateX = this.calculateCurrentTranslateX();
    var scrollLeft = this.adapter.getScrollAreaScrollLeft();
    return scrollLeft - currentTranslateX;
  };
  MDCTabScrollerFoundation2.prototype.handleInteraction = function() {
    if (!this.isAnimating) {
      return;
    }
    this.stopScrollAnimation();
  };
  MDCTabScrollerFoundation2.prototype.handleTransitionEnd = function(evt) {
    var evtTarget = evt.target;
    if (!this.isAnimating || !this.adapter.eventTargetMatchesSelector(evtTarget, MDCTabScrollerFoundation2.strings.CONTENT_SELECTOR)) {
      return;
    }
    this.isAnimating = false;
    this.adapter.removeClass(MDCTabScrollerFoundation2.cssClasses.ANIMATING);
  };
  MDCTabScrollerFoundation2.prototype.incrementScroll = function(scrollXIncrement) {
    if (scrollXIncrement === 0) {
      return;
    }
    this.animate(this.getIncrementScrollOperation(scrollXIncrement));
  };
  MDCTabScrollerFoundation2.prototype.incrementScrollImmediate = function(scrollXIncrement) {
    if (scrollXIncrement === 0) {
      return;
    }
    var operation = this.getIncrementScrollOperation(scrollXIncrement);
    if (operation.scrollDelta === 0) {
      return;
    }
    this.stopScrollAnimation();
    this.adapter.setScrollAreaScrollLeft(operation.finalScrollPosition);
  };
  MDCTabScrollerFoundation2.prototype.scrollTo = function(scrollX) {
    if (this.isRTL()) {
      this.scrollToImplRTL(scrollX);
      return;
    }
    this.scrollToImpl(scrollX);
  };
  MDCTabScrollerFoundation2.prototype.getRTLScroller = function() {
    if (!this.rtlScrollerInstance) {
      this.rtlScrollerInstance = this.rtlScrollerFactory();
    }
    return this.rtlScrollerInstance;
  };
  MDCTabScrollerFoundation2.prototype.calculateCurrentTranslateX = function() {
    var transformValue = this.adapter.getScrollContentStyleValue("transform");
    if (transformValue === "none") {
      return 0;
    }
    var match = /\((.+?)\)/.exec(transformValue);
    if (!match) {
      return 0;
    }
    var matrixParams = match[1];
    var _a = __read(matrixParams.split(","), 6);
    _a[0];
    _a[1];
    _a[2];
    _a[3];
    var tx = _a[4];
    _a[5];
    return parseFloat(tx);
  };
  MDCTabScrollerFoundation2.prototype.clampScrollValue = function(scrollX) {
    var edges = this.calculateScrollEdges();
    return Math.min(Math.max(edges.left, scrollX), edges.right);
  };
  MDCTabScrollerFoundation2.prototype.computeCurrentScrollPositionRTL = function() {
    var translateX = this.calculateCurrentTranslateX();
    return this.getRTLScroller().getScrollPositionRTL(translateX);
  };
  MDCTabScrollerFoundation2.prototype.calculateScrollEdges = function() {
    var contentWidth = this.adapter.getScrollContentOffsetWidth();
    var rootWidth = this.adapter.getScrollAreaOffsetWidth();
    return {
      left: 0,
      right: contentWidth - rootWidth
    };
  };
  MDCTabScrollerFoundation2.prototype.scrollToImpl = function(scrollX) {
    var currentScrollX = this.getScrollPosition();
    var safeScrollX = this.clampScrollValue(scrollX);
    var scrollDelta = safeScrollX - currentScrollX;
    this.animate({
      finalScrollPosition: safeScrollX,
      scrollDelta
    });
  };
  MDCTabScrollerFoundation2.prototype.scrollToImplRTL = function(scrollX) {
    var animation = this.getRTLScroller().scrollToRTL(scrollX);
    this.animate(animation);
  };
  MDCTabScrollerFoundation2.prototype.getIncrementScrollOperation = function(scrollX) {
    if (this.isRTL()) {
      return this.getRTLScroller().incrementScrollRTL(scrollX);
    }
    var currentScrollX = this.getScrollPosition();
    var targetScrollX = scrollX + currentScrollX;
    var safeScrollX = this.clampScrollValue(targetScrollX);
    var scrollDelta = safeScrollX - currentScrollX;
    return {
      finalScrollPosition: safeScrollX,
      scrollDelta
    };
  };
  MDCTabScrollerFoundation2.prototype.animate = function(animation) {
    var _this = this;
    if (animation.scrollDelta === 0) {
      return;
    }
    this.stopScrollAnimation();
    this.adapter.setScrollAreaScrollLeft(animation.finalScrollPosition);
    this.adapter.setScrollContentStyleProperty("transform", "translateX(" + animation.scrollDelta + "px)");
    this.adapter.computeScrollAreaClientRect();
    requestAnimationFrame(function() {
      _this.adapter.addClass(MDCTabScrollerFoundation2.cssClasses.ANIMATING);
      _this.adapter.setScrollContentStyleProperty("transform", "none");
    });
    this.isAnimating = true;
  };
  MDCTabScrollerFoundation2.prototype.stopScrollAnimation = function() {
    this.isAnimating = false;
    var currentScrollPosition = this.getAnimatingScrollPosition();
    this.adapter.removeClass(MDCTabScrollerFoundation2.cssClasses.ANIMATING);
    this.adapter.setScrollContentStyleProperty("transform", "translateX(0px)");
    this.adapter.setScrollAreaScrollLeft(currentScrollPosition);
  };
  MDCTabScrollerFoundation2.prototype.getAnimatingScrollPosition = function() {
    var currentTranslateX = this.calculateCurrentTranslateX();
    var scrollLeft = this.adapter.getScrollAreaScrollLeft();
    if (this.isRTL()) {
      return this.getRTLScroller().getAnimatingScrollPosition(scrollLeft, currentTranslateX);
    }
    return scrollLeft - currentTranslateX;
  };
  MDCTabScrollerFoundation2.prototype.rtlScrollerFactory = function() {
    var initialScrollLeft = this.adapter.getScrollAreaScrollLeft();
    this.adapter.setScrollAreaScrollLeft(initialScrollLeft - 1);
    var newScrollLeft = this.adapter.getScrollAreaScrollLeft();
    if (newScrollLeft < 0) {
      this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
      return new MDCTabScrollerRTLNegative(this.adapter);
    }
    var rootClientRect = this.adapter.computeScrollAreaClientRect();
    var contentClientRect = this.adapter.computeScrollContentClientRect();
    var rightEdgeDelta = Math.round(contentClientRect.right - rootClientRect.right);
    this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
    if (rightEdgeDelta === newScrollLeft) {
      return new MDCTabScrollerRTLReverse(this.adapter);
    }
    return new MDCTabScrollerRTLDefault(this.adapter);
  };
  MDCTabScrollerFoundation2.prototype.isRTL = function() {
    return this.adapter.getScrollContentStyleValue("direction") === "rtl";
  };
  return MDCTabScrollerFoundation2;
}(MDCFoundation);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var horizontalScrollbarHeight_;
function computeHorizontalScrollbarHeight(documentObj, shouldCacheResult) {
  if (shouldCacheResult === void 0) {
    shouldCacheResult = true;
  }
  if (shouldCacheResult && typeof horizontalScrollbarHeight_ !== "undefined") {
    return horizontalScrollbarHeight_;
  }
  var el = documentObj.createElement("div");
  el.classList.add(cssClasses$9.SCROLL_TEST);
  documentObj.body.appendChild(el);
  var horizontalScrollbarHeight = el.offsetHeight - el.clientHeight;
  documentObj.body.removeChild(el);
  if (shouldCacheResult) {
    horizontalScrollbarHeight_ = horizontalScrollbarHeight;
  }
  return horizontalScrollbarHeight;
}
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$8 = {
  BG_FOCUSED: "mdc-ripple-upgraded--background-focused",
  FG_ACTIVATION: "mdc-ripple-upgraded--foreground-activation",
  FG_DEACTIVATION: "mdc-ripple-upgraded--foreground-deactivation",
  ROOT: "mdc-ripple-upgraded",
  UNBOUNDED: "mdc-ripple-upgraded--unbounded"
};
var strings$7 = {
  VAR_FG_SCALE: "--mdc-ripple-fg-scale",
  VAR_FG_SIZE: "--mdc-ripple-fg-size",
  VAR_FG_TRANSLATE_END: "--mdc-ripple-fg-translate-end",
  VAR_FG_TRANSLATE_START: "--mdc-ripple-fg-translate-start",
  VAR_LEFT: "--mdc-ripple-left",
  VAR_TOP: "--mdc-ripple-top"
};
var numbers$3 = {
  DEACTIVATION_TIMEOUT_MS: 225,
  FG_DEACTIVATION_MS: 150,
  INITIAL_ORIGIN_SCALE: 0.6,
  PADDING: 10,
  TAP_DELAY_MS: 300
};
var supportsCssVariables_;
function supportsCssVariables(windowObj, forceRefresh) {
  if (forceRefresh === void 0) {
    forceRefresh = false;
  }
  var CSS = windowObj.CSS;
  var supportsCssVars = supportsCssVariables_;
  if (typeof supportsCssVariables_ === "boolean" && !forceRefresh) {
    return supportsCssVariables_;
  }
  var supportsFunctionPresent = CSS && typeof CSS.supports === "function";
  if (!supportsFunctionPresent) {
    return false;
  }
  var explicitlySupportsCssVars = CSS.supports("--css-vars", "yes");
  var weAreFeatureDetectingSafari10plus = CSS.supports("(--css-vars: yes)") && CSS.supports("color", "#00000000");
  supportsCssVars = explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
  if (!forceRefresh) {
    supportsCssVariables_ = supportsCssVars;
  }
  return supportsCssVars;
}
function getNormalizedEventCoords(evt, pageOffset, clientRect) {
  if (!evt) {
    return { x: 0, y: 0 };
  }
  var x = pageOffset.x, y = pageOffset.y;
  var documentX = x + clientRect.left;
  var documentY = y + clientRect.top;
  var normalizedX;
  var normalizedY;
  if (evt.type === "touchstart") {
    var touchEvent = evt;
    normalizedX = touchEvent.changedTouches[0].pageX - documentX;
    normalizedY = touchEvent.changedTouches[0].pageY - documentY;
  } else {
    var mouseEvent = evt;
    normalizedX = mouseEvent.pageX - documentX;
    normalizedY = mouseEvent.pageY - documentY;
  }
  return { x: normalizedX, y: normalizedY };
}
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var ACTIVATION_EVENT_TYPES = [
  "touchstart",
  "pointerdown",
  "mousedown",
  "keydown"
];
var POINTER_DEACTIVATION_EVENT_TYPES = [
  "touchend",
  "pointerup",
  "mouseup",
  "contextmenu"
];
var activatedTargets = [];
var MDCRippleFoundation = function(_super) {
  __extends(MDCRippleFoundation2, _super);
  function MDCRippleFoundation2(adapter) {
    var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation2.defaultAdapter), adapter)) || this;
    _this.activationAnimationHasEnded = false;
    _this.activationTimer = 0;
    _this.fgDeactivationRemovalTimer = 0;
    _this.fgScale = "0";
    _this.frame = { width: 0, height: 0 };
    _this.initialSize = 0;
    _this.layoutFrame = 0;
    _this.maxRadius = 0;
    _this.unboundedCoords = { left: 0, top: 0 };
    _this.activationState = _this.defaultActivationState();
    _this.activationTimerCallback = function() {
      _this.activationAnimationHasEnded = true;
      _this.runDeactivationUXLogicIfReady();
    };
    _this.activateHandler = function(e) {
      _this.activateImpl(e);
    };
    _this.deactivateHandler = function() {
      _this.deactivateImpl();
    };
    _this.focusHandler = function() {
      _this.handleFocus();
    };
    _this.blurHandler = function() {
      _this.handleBlur();
    };
    _this.resizeHandler = function() {
      _this.layout();
    };
    return _this;
  }
  Object.defineProperty(MDCRippleFoundation2, "cssClasses", {
    get: function() {
      return cssClasses$8;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCRippleFoundation2, "strings", {
    get: function() {
      return strings$7;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCRippleFoundation2, "numbers", {
    get: function() {
      return numbers$3;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCRippleFoundation2, "defaultAdapter", {
    get: function() {
      return {
        addClass: function() {
          return void 0;
        },
        browserSupportsCssVars: function() {
          return true;
        },
        computeBoundingRect: function() {
          return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
        },
        containsEventTarget: function() {
          return true;
        },
        deregisterDocumentInteractionHandler: function() {
          return void 0;
        },
        deregisterInteractionHandler: function() {
          return void 0;
        },
        deregisterResizeHandler: function() {
          return void 0;
        },
        getWindowPageOffset: function() {
          return { x: 0, y: 0 };
        },
        isSurfaceActive: function() {
          return true;
        },
        isSurfaceDisabled: function() {
          return true;
        },
        isUnbounded: function() {
          return true;
        },
        registerDocumentInteractionHandler: function() {
          return void 0;
        },
        registerInteractionHandler: function() {
          return void 0;
        },
        registerResizeHandler: function() {
          return void 0;
        },
        removeClass: function() {
          return void 0;
        },
        updateCssVariable: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCRippleFoundation2.prototype.init = function() {
    var _this = this;
    var supportsPressRipple = this.supportsPressRipple();
    this.registerRootHandlers(supportsPressRipple);
    if (supportsPressRipple) {
      var _a = MDCRippleFoundation2.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
      requestAnimationFrame(function() {
        _this.adapter.addClass(ROOT_1);
        if (_this.adapter.isUnbounded()) {
          _this.adapter.addClass(UNBOUNDED_1);
          _this.layoutInternal();
        }
      });
    }
  };
  MDCRippleFoundation2.prototype.destroy = function() {
    var _this = this;
    if (this.supportsPressRipple()) {
      if (this.activationTimer) {
        clearTimeout(this.activationTimer);
        this.activationTimer = 0;
        this.adapter.removeClass(MDCRippleFoundation2.cssClasses.FG_ACTIVATION);
      }
      if (this.fgDeactivationRemovalTimer) {
        clearTimeout(this.fgDeactivationRemovalTimer);
        this.fgDeactivationRemovalTimer = 0;
        this.adapter.removeClass(MDCRippleFoundation2.cssClasses.FG_DEACTIVATION);
      }
      var _a = MDCRippleFoundation2.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
      requestAnimationFrame(function() {
        _this.adapter.removeClass(ROOT_2);
        _this.adapter.removeClass(UNBOUNDED_2);
        _this.removeCssVars();
      });
    }
    this.deregisterRootHandlers();
    this.deregisterDeactivationHandlers();
  };
  MDCRippleFoundation2.prototype.activate = function(evt) {
    this.activateImpl(evt);
  };
  MDCRippleFoundation2.prototype.deactivate = function() {
    this.deactivateImpl();
  };
  MDCRippleFoundation2.prototype.layout = function() {
    var _this = this;
    if (this.layoutFrame) {
      cancelAnimationFrame(this.layoutFrame);
    }
    this.layoutFrame = requestAnimationFrame(function() {
      _this.layoutInternal();
      _this.layoutFrame = 0;
    });
  };
  MDCRippleFoundation2.prototype.setUnbounded = function(unbounded) {
    var UNBOUNDED = MDCRippleFoundation2.cssClasses.UNBOUNDED;
    if (unbounded) {
      this.adapter.addClass(UNBOUNDED);
    } else {
      this.adapter.removeClass(UNBOUNDED);
    }
  };
  MDCRippleFoundation2.prototype.handleFocus = function() {
    var _this = this;
    requestAnimationFrame(function() {
      return _this.adapter.addClass(MDCRippleFoundation2.cssClasses.BG_FOCUSED);
    });
  };
  MDCRippleFoundation2.prototype.handleBlur = function() {
    var _this = this;
    requestAnimationFrame(function() {
      return _this.adapter.removeClass(MDCRippleFoundation2.cssClasses.BG_FOCUSED);
    });
  };
  MDCRippleFoundation2.prototype.supportsPressRipple = function() {
    return this.adapter.browserSupportsCssVars();
  };
  MDCRippleFoundation2.prototype.defaultActivationState = function() {
    return {
      activationEvent: void 0,
      hasDeactivationUXRun: false,
      isActivated: false,
      isProgrammatic: false,
      wasActivatedByPointer: false,
      wasElementMadeActive: false
    };
  };
  MDCRippleFoundation2.prototype.registerRootHandlers = function(supportsPressRipple) {
    var e_1, _a;
    if (supportsPressRipple) {
      try {
        for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
          var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
          this.adapter.registerInteractionHandler(evtType, this.activateHandler);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return))
            _a.call(ACTIVATION_EVENT_TYPES_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      if (this.adapter.isUnbounded()) {
        this.adapter.registerResizeHandler(this.resizeHandler);
      }
    }
    this.adapter.registerInteractionHandler("focus", this.focusHandler);
    this.adapter.registerInteractionHandler("blur", this.blurHandler);
  };
  MDCRippleFoundation2.prototype.registerDeactivationHandlers = function(evt) {
    var e_2, _a;
    if (evt.type === "keydown") {
      this.adapter.registerInteractionHandler("keyup", this.deactivateHandler);
    } else {
      try {
        for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
          var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
          this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
        }
      } catch (e_2_1) {
        e_2 = { error: e_2_1 };
      } finally {
        try {
          if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return))
            _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
        } finally {
          if (e_2)
            throw e_2.error;
        }
      }
    }
  };
  MDCRippleFoundation2.prototype.deregisterRootHandlers = function() {
    var e_3, _a;
    try {
      for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
        var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
        this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return))
          _a.call(ACTIVATION_EVENT_TYPES_2);
      } finally {
        if (e_3)
          throw e_3.error;
      }
    }
    this.adapter.deregisterInteractionHandler("focus", this.focusHandler);
    this.adapter.deregisterInteractionHandler("blur", this.blurHandler);
    if (this.adapter.isUnbounded()) {
      this.adapter.deregisterResizeHandler(this.resizeHandler);
    }
  };
  MDCRippleFoundation2.prototype.deregisterDeactivationHandlers = function() {
    var e_4, _a;
    this.adapter.deregisterInteractionHandler("keyup", this.deactivateHandler);
    try {
      for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
        var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
        this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
      }
    } catch (e_4_1) {
      e_4 = { error: e_4_1 };
    } finally {
      try {
        if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return))
          _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
      } finally {
        if (e_4)
          throw e_4.error;
      }
    }
  };
  MDCRippleFoundation2.prototype.removeCssVars = function() {
    var _this = this;
    var rippleStrings = MDCRippleFoundation2.strings;
    var keys = Object.keys(rippleStrings);
    keys.forEach(function(key) {
      if (key.indexOf("VAR_") === 0) {
        _this.adapter.updateCssVariable(rippleStrings[key], null);
      }
    });
  };
  MDCRippleFoundation2.prototype.activateImpl = function(evt) {
    var _this = this;
    if (this.adapter.isSurfaceDisabled()) {
      return;
    }
    var activationState = this.activationState;
    if (activationState.isActivated) {
      return;
    }
    var previousActivationEvent = this.previousActivationEvent;
    var isSameInteraction = previousActivationEvent && evt !== void 0 && previousActivationEvent.type !== evt.type;
    if (isSameInteraction) {
      return;
    }
    activationState.isActivated = true;
    activationState.isProgrammatic = evt === void 0;
    activationState.activationEvent = evt;
    activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== void 0 && (evt.type === "mousedown" || evt.type === "touchstart" || evt.type === "pointerdown");
    var hasActivatedChild = evt !== void 0 && activatedTargets.length > 0 && activatedTargets.some(function(target) {
      return _this.adapter.containsEventTarget(target);
    });
    if (hasActivatedChild) {
      this.resetActivationState();
      return;
    }
    if (evt !== void 0) {
      activatedTargets.push(evt.target);
      this.registerDeactivationHandlers(evt);
    }
    activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
    if (activationState.wasElementMadeActive) {
      this.animateActivation();
    }
    requestAnimationFrame(function() {
      activatedTargets = [];
      if (!activationState.wasElementMadeActive && evt !== void 0 && (evt.key === " " || evt.keyCode === 32)) {
        activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
        if (activationState.wasElementMadeActive) {
          _this.animateActivation();
        }
      }
      if (!activationState.wasElementMadeActive) {
        _this.activationState = _this.defaultActivationState();
      }
    });
  };
  MDCRippleFoundation2.prototype.checkElementMadeActive = function(evt) {
    return evt !== void 0 && evt.type === "keydown" ? this.adapter.isSurfaceActive() : true;
  };
  MDCRippleFoundation2.prototype.animateActivation = function() {
    var _this = this;
    var _a = MDCRippleFoundation2.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
    var _b = MDCRippleFoundation2.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
    var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation2.numbers.DEACTIVATION_TIMEOUT_MS;
    this.layoutInternal();
    var translateStart = "";
    var translateEnd = "";
    if (!this.adapter.isUnbounded()) {
      var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
      translateStart = startPoint.x + "px, " + startPoint.y + "px";
      translateEnd = endPoint.x + "px, " + endPoint.y + "px";
    }
    this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
    this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
    clearTimeout(this.activationTimer);
    clearTimeout(this.fgDeactivationRemovalTimer);
    this.rmBoundedActivationClasses();
    this.adapter.removeClass(FG_DEACTIVATION);
    this.adapter.computeBoundingRect();
    this.adapter.addClass(FG_ACTIVATION);
    this.activationTimer = setTimeout(function() {
      _this.activationTimerCallback();
    }, DEACTIVATION_TIMEOUT_MS);
  };
  MDCRippleFoundation2.prototype.getFgTranslationCoordinates = function() {
    var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
    var startPoint;
    if (wasActivatedByPointer) {
      startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
    } else {
      startPoint = {
        x: this.frame.width / 2,
        y: this.frame.height / 2
      };
    }
    startPoint = {
      x: startPoint.x - this.initialSize / 2,
      y: startPoint.y - this.initialSize / 2
    };
    var endPoint = {
      x: this.frame.width / 2 - this.initialSize / 2,
      y: this.frame.height / 2 - this.initialSize / 2
    };
    return { startPoint, endPoint };
  };
  MDCRippleFoundation2.prototype.runDeactivationUXLogicIfReady = function() {
    var _this = this;
    var FG_DEACTIVATION = MDCRippleFoundation2.cssClasses.FG_DEACTIVATION;
    var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
    var activationHasEnded = hasDeactivationUXRun || !isActivated;
    if (activationHasEnded && this.activationAnimationHasEnded) {
      this.rmBoundedActivationClasses();
      this.adapter.addClass(FG_DEACTIVATION);
      this.fgDeactivationRemovalTimer = setTimeout(function() {
        _this.adapter.removeClass(FG_DEACTIVATION);
      }, numbers$3.FG_DEACTIVATION_MS);
    }
  };
  MDCRippleFoundation2.prototype.rmBoundedActivationClasses = function() {
    var FG_ACTIVATION = MDCRippleFoundation2.cssClasses.FG_ACTIVATION;
    this.adapter.removeClass(FG_ACTIVATION);
    this.activationAnimationHasEnded = false;
    this.adapter.computeBoundingRect();
  };
  MDCRippleFoundation2.prototype.resetActivationState = function() {
    var _this = this;
    this.previousActivationEvent = this.activationState.activationEvent;
    this.activationState = this.defaultActivationState();
    setTimeout(function() {
      return _this.previousActivationEvent = void 0;
    }, MDCRippleFoundation2.numbers.TAP_DELAY_MS);
  };
  MDCRippleFoundation2.prototype.deactivateImpl = function() {
    var _this = this;
    var activationState = this.activationState;
    if (!activationState.isActivated) {
      return;
    }
    var state = __assign({}, activationState);
    if (activationState.isProgrammatic) {
      requestAnimationFrame(function() {
        _this.animateDeactivation(state);
      });
      this.resetActivationState();
    } else {
      this.deregisterDeactivationHandlers();
      requestAnimationFrame(function() {
        _this.activationState.hasDeactivationUXRun = true;
        _this.animateDeactivation(state);
        _this.resetActivationState();
      });
    }
  };
  MDCRippleFoundation2.prototype.animateDeactivation = function(_a) {
    var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
    if (wasActivatedByPointer || wasElementMadeActive) {
      this.runDeactivationUXLogicIfReady();
    }
  };
  MDCRippleFoundation2.prototype.layoutInternal = function() {
    var _this = this;
    this.frame = this.adapter.computeBoundingRect();
    var maxDim = Math.max(this.frame.height, this.frame.width);
    var getBoundedRadius = function() {
      var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
      return hypotenuse + MDCRippleFoundation2.numbers.PADDING;
    };
    this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
    var initialSize = Math.floor(maxDim * MDCRippleFoundation2.numbers.INITIAL_ORIGIN_SCALE);
    if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
      this.initialSize = initialSize - 1;
    } else {
      this.initialSize = initialSize;
    }
    this.fgScale = "" + this.maxRadius / this.initialSize;
    this.updateLayoutCssVars();
  };
  MDCRippleFoundation2.prototype.updateLayoutCssVars = function() {
    var _a = MDCRippleFoundation2.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
    this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
    this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
    if (this.adapter.isUnbounded()) {
      this.unboundedCoords = {
        left: Math.round(this.frame.width / 2 - this.initialSize / 2),
        top: Math.round(this.frame.height / 2 - this.initialSize / 2)
      };
      this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
      this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
    }
  };
  return MDCRippleFoundation2;
}(MDCFoundation);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$7 = {
  ACTIVE: "mdc-tab-indicator--active",
  FADE: "mdc-tab-indicator--fade",
  NO_TRANSITION: "mdc-tab-indicator--no-transition"
};
var strings$6 = {
  CONTENT_SELECTOR: ".mdc-tab-indicator__content"
};
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTabIndicatorFoundation = function(_super) {
  __extends(MDCTabIndicatorFoundation2, _super);
  function MDCTabIndicatorFoundation2(adapter) {
    return _super.call(this, __assign(__assign({}, MDCTabIndicatorFoundation2.defaultAdapter), adapter)) || this;
  }
  Object.defineProperty(MDCTabIndicatorFoundation2, "cssClasses", {
    get: function() {
      return cssClasses$7;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTabIndicatorFoundation2, "strings", {
    get: function() {
      return strings$6;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTabIndicatorFoundation2, "defaultAdapter", {
    get: function() {
      return {
        addClass: function() {
          return void 0;
        },
        removeClass: function() {
          return void 0;
        },
        computeContentClientRect: function() {
          return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
        },
        setContentStyleProperty: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCTabIndicatorFoundation2.prototype.computeContentClientRect = function() {
    return this.adapter.computeContentClientRect();
  };
  return MDCTabIndicatorFoundation2;
}(MDCFoundation);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFadingTabIndicatorFoundation = function(_super) {
  __extends(MDCFadingTabIndicatorFoundation2, _super);
  function MDCFadingTabIndicatorFoundation2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  MDCFadingTabIndicatorFoundation2.prototype.activate = function() {
    this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  };
  MDCFadingTabIndicatorFoundation2.prototype.deactivate = function() {
    this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  };
  return MDCFadingTabIndicatorFoundation2;
}(MDCTabIndicatorFoundation);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCSlidingTabIndicatorFoundation = function(_super) {
  __extends(MDCSlidingTabIndicatorFoundation2, _super);
  function MDCSlidingTabIndicatorFoundation2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  MDCSlidingTabIndicatorFoundation2.prototype.activate = function(previousIndicatorClientRect) {
    if (!previousIndicatorClientRect) {
      this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
      return;
    }
    var currentClientRect = this.computeContentClientRect();
    var widthDelta = previousIndicatorClientRect.width / currentClientRect.width;
    var xPosition = previousIndicatorClientRect.left - currentClientRect.left;
    this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
    this.adapter.setContentStyleProperty("transform", "translateX(" + xPosition + "px) scaleX(" + widthDelta + ")");
    this.computeContentClientRect();
    this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
    this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
    this.adapter.setContentStyleProperty("transform", "");
  };
  MDCSlidingTabIndicatorFoundation2.prototype.deactivate = function() {
    this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  };
  return MDCSlidingTabIndicatorFoundation2;
}(MDCTabIndicatorFoundation);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$6 = {
  ACTIVE: "mdc-tab--active"
};
var strings$5 = {
  ARIA_SELECTED: "aria-selected",
  CONTENT_SELECTOR: ".mdc-tab__content",
  INTERACTED_EVENT: "MDCTab:interacted",
  RIPPLE_SELECTOR: ".mdc-tab__ripple",
  TABINDEX: "tabIndex",
  TAB_INDICATOR_SELECTOR: ".mdc-tab-indicator"
};
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTabFoundation = function(_super) {
  __extends(MDCTabFoundation2, _super);
  function MDCTabFoundation2(adapter) {
    var _this = _super.call(this, __assign(__assign({}, MDCTabFoundation2.defaultAdapter), adapter)) || this;
    _this.focusOnActivate = true;
    return _this;
  }
  Object.defineProperty(MDCTabFoundation2, "cssClasses", {
    get: function() {
      return cssClasses$6;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTabFoundation2, "strings", {
    get: function() {
      return strings$5;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTabFoundation2, "defaultAdapter", {
    get: function() {
      return {
        addClass: function() {
          return void 0;
        },
        removeClass: function() {
          return void 0;
        },
        hasClass: function() {
          return false;
        },
        setAttr: function() {
          return void 0;
        },
        activateIndicator: function() {
          return void 0;
        },
        deactivateIndicator: function() {
          return void 0;
        },
        notifyInteracted: function() {
          return void 0;
        },
        getOffsetLeft: function() {
          return 0;
        },
        getOffsetWidth: function() {
          return 0;
        },
        getContentOffsetLeft: function() {
          return 0;
        },
        getContentOffsetWidth: function() {
          return 0;
        },
        focus: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCTabFoundation2.prototype.handleClick = function() {
    this.adapter.notifyInteracted();
  };
  MDCTabFoundation2.prototype.isActive = function() {
    return this.adapter.hasClass(cssClasses$6.ACTIVE);
  };
  MDCTabFoundation2.prototype.setFocusOnActivate = function(focusOnActivate) {
    this.focusOnActivate = focusOnActivate;
  };
  MDCTabFoundation2.prototype.activate = function(previousIndicatorClientRect) {
    this.adapter.addClass(cssClasses$6.ACTIVE);
    this.adapter.setAttr(strings$5.ARIA_SELECTED, "true");
    this.adapter.setAttr(strings$5.TABINDEX, "0");
    this.adapter.activateIndicator(previousIndicatorClientRect);
    if (this.focusOnActivate) {
      this.adapter.focus();
    }
  };
  MDCTabFoundation2.prototype.deactivate = function() {
    if (!this.isActive()) {
      return;
    }
    this.adapter.removeClass(cssClasses$6.ACTIVE);
    this.adapter.setAttr(strings$5.ARIA_SELECTED, "false");
    this.adapter.setAttr(strings$5.TABINDEX, "-1");
    this.adapter.deactivateIndicator();
  };
  MDCTabFoundation2.prototype.computeDimensions = function() {
    var rootWidth = this.adapter.getOffsetWidth();
    var rootLeft = this.adapter.getOffsetLeft();
    var contentWidth = this.adapter.getContentOffsetWidth();
    var contentLeft = this.adapter.getContentOffsetLeft();
    return {
      contentLeft: rootLeft + contentLeft,
      contentRight: rootLeft + contentLeft + contentWidth,
      rootLeft,
      rootRight: rootLeft + rootWidth
    };
  };
  return MDCTabFoundation2;
}(MDCFoundation);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$4 = {
  ARROW_LEFT_KEY: "ArrowLeft",
  ARROW_RIGHT_KEY: "ArrowRight",
  END_KEY: "End",
  ENTER_KEY: "Enter",
  HOME_KEY: "Home",
  SPACE_KEY: "Space",
  TAB_ACTIVATED_EVENT: "MDCTabBar:activated",
  TAB_SCROLLER_SELECTOR: ".mdc-tab-scroller",
  TAB_SELECTOR: ".mdc-tab"
};
var numbers$2 = {
  ARROW_LEFT_KEYCODE: 37,
  ARROW_RIGHT_KEYCODE: 39,
  END_KEYCODE: 35,
  ENTER_KEYCODE: 13,
  EXTRA_SCROLL_AMOUNT: 20,
  HOME_KEYCODE: 36,
  SPACE_KEYCODE: 32
};
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var ACCEPTABLE_KEYS = /* @__PURE__ */ new Set();
ACCEPTABLE_KEYS.add(strings$4.ARROW_LEFT_KEY);
ACCEPTABLE_KEYS.add(strings$4.ARROW_RIGHT_KEY);
ACCEPTABLE_KEYS.add(strings$4.END_KEY);
ACCEPTABLE_KEYS.add(strings$4.HOME_KEY);
ACCEPTABLE_KEYS.add(strings$4.ENTER_KEY);
ACCEPTABLE_KEYS.add(strings$4.SPACE_KEY);
var KEYCODE_MAP = /* @__PURE__ */ new Map();
KEYCODE_MAP.set(numbers$2.ARROW_LEFT_KEYCODE, strings$4.ARROW_LEFT_KEY);
KEYCODE_MAP.set(numbers$2.ARROW_RIGHT_KEYCODE, strings$4.ARROW_RIGHT_KEY);
KEYCODE_MAP.set(numbers$2.END_KEYCODE, strings$4.END_KEY);
KEYCODE_MAP.set(numbers$2.HOME_KEYCODE, strings$4.HOME_KEY);
KEYCODE_MAP.set(numbers$2.ENTER_KEYCODE, strings$4.ENTER_KEY);
KEYCODE_MAP.set(numbers$2.SPACE_KEYCODE, strings$4.SPACE_KEY);
var MDCTabBarFoundation = function(_super) {
  __extends(MDCTabBarFoundation2, _super);
  function MDCTabBarFoundation2(adapter) {
    var _this = _super.call(this, __assign(__assign({}, MDCTabBarFoundation2.defaultAdapter), adapter)) || this;
    _this.useAutomaticActivation = false;
    return _this;
  }
  Object.defineProperty(MDCTabBarFoundation2, "strings", {
    get: function() {
      return strings$4;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTabBarFoundation2, "numbers", {
    get: function() {
      return numbers$2;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTabBarFoundation2, "defaultAdapter", {
    get: function() {
      return {
        scrollTo: function() {
          return void 0;
        },
        incrementScroll: function() {
          return void 0;
        },
        getScrollPosition: function() {
          return 0;
        },
        getScrollContentWidth: function() {
          return 0;
        },
        getOffsetWidth: function() {
          return 0;
        },
        isRTL: function() {
          return false;
        },
        setActiveTab: function() {
          return void 0;
        },
        activateTabAtIndex: function() {
          return void 0;
        },
        deactivateTabAtIndex: function() {
          return void 0;
        },
        focusTabAtIndex: function() {
          return void 0;
        },
        getTabIndicatorClientRectAtIndex: function() {
          return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
        },
        getTabDimensionsAtIndex: function() {
          return { rootLeft: 0, rootRight: 0, contentLeft: 0, contentRight: 0 };
        },
        getPreviousActiveTabIndex: function() {
          return -1;
        },
        getFocusedTabIndex: function() {
          return -1;
        },
        getIndexOfTabById: function() {
          return -1;
        },
        getTabListLength: function() {
          return 0;
        },
        notifyTabActivated: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCTabBarFoundation2.prototype.setUseAutomaticActivation = function(useAutomaticActivation) {
    this.useAutomaticActivation = useAutomaticActivation;
  };
  MDCTabBarFoundation2.prototype.activateTab = function(index) {
    var previousActiveIndex = this.adapter.getPreviousActiveTabIndex();
    if (!this.indexIsInRange(index) || index === previousActiveIndex) {
      return;
    }
    var previousClientRect;
    if (previousActiveIndex !== -1) {
      this.adapter.deactivateTabAtIndex(previousActiveIndex);
      previousClientRect = this.adapter.getTabIndicatorClientRectAtIndex(previousActiveIndex);
    }
    this.adapter.activateTabAtIndex(index, previousClientRect);
    this.scrollIntoView(index);
    this.adapter.notifyTabActivated(index);
  };
  MDCTabBarFoundation2.prototype.handleKeyDown = function(evt) {
    var key = this.getKeyFromEvent(evt);
    if (key === void 0) {
      return;
    }
    if (!this.isActivationKey(key)) {
      evt.preventDefault();
    }
    if (this.useAutomaticActivation) {
      if (this.isActivationKey(key)) {
        return;
      }
      var index = this.determineTargetFromKey(this.adapter.getPreviousActiveTabIndex(), key);
      this.adapter.setActiveTab(index);
      this.scrollIntoView(index);
    } else {
      var focusedTabIndex = this.adapter.getFocusedTabIndex();
      if (this.isActivationKey(key)) {
        this.adapter.setActiveTab(focusedTabIndex);
      } else {
        var index = this.determineTargetFromKey(focusedTabIndex, key);
        this.adapter.focusTabAtIndex(index);
        this.scrollIntoView(index);
      }
    }
  };
  MDCTabBarFoundation2.prototype.handleTabInteraction = function(evt) {
    this.adapter.setActiveTab(this.adapter.getIndexOfTabById(evt.detail.tabId));
  };
  MDCTabBarFoundation2.prototype.scrollIntoView = function(index) {
    if (!this.indexIsInRange(index)) {
      return;
    }
    if (index === 0) {
      this.adapter.scrollTo(0);
      return;
    }
    if (index === this.adapter.getTabListLength() - 1) {
      this.adapter.scrollTo(this.adapter.getScrollContentWidth());
      return;
    }
    if (this.isRTL()) {
      this.scrollIntoViewImplRTL(index);
      return;
    }
    this.scrollIntoViewImpl(index);
  };
  MDCTabBarFoundation2.prototype.determineTargetFromKey = function(origin, key) {
    var isRTL = this.isRTL();
    var maxIndex = this.adapter.getTabListLength() - 1;
    var shouldGoToEnd = key === strings$4.END_KEY;
    var shouldDecrement = key === strings$4.ARROW_LEFT_KEY && !isRTL || key === strings$4.ARROW_RIGHT_KEY && isRTL;
    var shouldIncrement = key === strings$4.ARROW_RIGHT_KEY && !isRTL || key === strings$4.ARROW_LEFT_KEY && isRTL;
    var index = origin;
    if (shouldGoToEnd) {
      index = maxIndex;
    } else if (shouldDecrement) {
      index -= 1;
    } else if (shouldIncrement) {
      index += 1;
    } else {
      index = 0;
    }
    if (index < 0) {
      index = maxIndex;
    } else if (index > maxIndex) {
      index = 0;
    }
    return index;
  };
  MDCTabBarFoundation2.prototype.calculateScrollIncrement = function(index, nextIndex, scrollPosition, barWidth) {
    var nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
    var relativeContentLeft = nextTabDimensions.contentLeft - scrollPosition - barWidth;
    var relativeContentRight = nextTabDimensions.contentRight - scrollPosition;
    var leftIncrement = relativeContentRight - numbers$2.EXTRA_SCROLL_AMOUNT;
    var rightIncrement = relativeContentLeft + numbers$2.EXTRA_SCROLL_AMOUNT;
    if (nextIndex < index) {
      return Math.min(leftIncrement, 0);
    }
    return Math.max(rightIncrement, 0);
  };
  MDCTabBarFoundation2.prototype.calculateScrollIncrementRTL = function(index, nextIndex, scrollPosition, barWidth, scrollContentWidth) {
    var nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
    var relativeContentLeft = scrollContentWidth - nextTabDimensions.contentLeft - scrollPosition;
    var relativeContentRight = scrollContentWidth - nextTabDimensions.contentRight - scrollPosition - barWidth;
    var leftIncrement = relativeContentRight + numbers$2.EXTRA_SCROLL_AMOUNT;
    var rightIncrement = relativeContentLeft - numbers$2.EXTRA_SCROLL_AMOUNT;
    if (nextIndex > index) {
      return Math.max(leftIncrement, 0);
    }
    return Math.min(rightIncrement, 0);
  };
  MDCTabBarFoundation2.prototype.findAdjacentTabIndexClosestToEdge = function(index, tabDimensions, scrollPosition, barWidth) {
    var relativeRootLeft = tabDimensions.rootLeft - scrollPosition;
    var relativeRootRight = tabDimensions.rootRight - scrollPosition - barWidth;
    var relativeRootDelta = relativeRootLeft + relativeRootRight;
    var leftEdgeIsCloser = relativeRootLeft < 0 || relativeRootDelta < 0;
    var rightEdgeIsCloser = relativeRootRight > 0 || relativeRootDelta > 0;
    if (leftEdgeIsCloser) {
      return index - 1;
    }
    if (rightEdgeIsCloser) {
      return index + 1;
    }
    return -1;
  };
  MDCTabBarFoundation2.prototype.findAdjacentTabIndexClosestToEdgeRTL = function(index, tabDimensions, scrollPosition, barWidth, scrollContentWidth) {
    var rootLeft = scrollContentWidth - tabDimensions.rootLeft - barWidth - scrollPosition;
    var rootRight = scrollContentWidth - tabDimensions.rootRight - scrollPosition;
    var rootDelta = rootLeft + rootRight;
    var leftEdgeIsCloser = rootLeft > 0 || rootDelta > 0;
    var rightEdgeIsCloser = rootRight < 0 || rootDelta < 0;
    if (leftEdgeIsCloser) {
      return index + 1;
    }
    if (rightEdgeIsCloser) {
      return index - 1;
    }
    return -1;
  };
  MDCTabBarFoundation2.prototype.getKeyFromEvent = function(evt) {
    if (ACCEPTABLE_KEYS.has(evt.key)) {
      return evt.key;
    }
    return KEYCODE_MAP.get(evt.keyCode);
  };
  MDCTabBarFoundation2.prototype.isActivationKey = function(key) {
    return key === strings$4.SPACE_KEY || key === strings$4.ENTER_KEY;
  };
  MDCTabBarFoundation2.prototype.indexIsInRange = function(index) {
    return index >= 0 && index < this.adapter.getTabListLength();
  };
  MDCTabBarFoundation2.prototype.isRTL = function() {
    return this.adapter.isRTL();
  };
  MDCTabBarFoundation2.prototype.scrollIntoViewImpl = function(index) {
    var scrollPosition = this.adapter.getScrollPosition();
    var barWidth = this.adapter.getOffsetWidth();
    var tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
    var nextIndex = this.findAdjacentTabIndexClosestToEdge(index, tabDimensions, scrollPosition, barWidth);
    if (!this.indexIsInRange(nextIndex)) {
      return;
    }
    var scrollIncrement = this.calculateScrollIncrement(index, nextIndex, scrollPosition, barWidth);
    this.adapter.incrementScroll(scrollIncrement);
  };
  MDCTabBarFoundation2.prototype.scrollIntoViewImplRTL = function(index) {
    var scrollPosition = this.adapter.getScrollPosition();
    var barWidth = this.adapter.getOffsetWidth();
    var tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
    var scrollWidth = this.adapter.getScrollContentWidth();
    var nextIndex = this.findAdjacentTabIndexClosestToEdgeRTL(index, tabDimensions, scrollPosition, barWidth, scrollWidth);
    if (!this.indexIsInRange(nextIndex)) {
      return;
    }
    var scrollIncrement = this.calculateScrollIncrementRTL(index, nextIndex, scrollPosition, barWidth, scrollWidth);
    this.adapter.incrementScroll(scrollIncrement);
  };
  return MDCTabBarFoundation2;
}(MDCFoundation);
function classMap(classObj) {
  return Object.entries(classObj).filter(([name, value]) => name !== "" && value).map(([name]) => name).join(" ");
}
function dispatch(element2, eventType, detail, eventInit = { bubbles: true }, duplicateEventForMDC = false) {
  if (typeof Event !== "undefined" && element2) {
    const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
    element2 === null || element2 === void 0 ? void 0 : element2.dispatchEvent(event);
    if (duplicateEventForMDC && eventType.startsWith("SMUI")) {
      const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => "MDC"), Object.assign(Object.assign({}, eventInit), { detail }));
      element2 === null || element2 === void 0 ? void 0 : element2.dispatchEvent(duplicateEvent);
      if (duplicateEvent.defaultPrevented) {
        event.preventDefault();
      }
    }
    return event;
  }
}
function exclude(obj, keys) {
  let names = Object.getOwnPropertyNames(obj);
  const newObj = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const cashIndex = name.indexOf("$");
    if (cashIndex !== -1 && keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
      continue;
    }
    if (keys.indexOf(name) !== -1) {
      continue;
    }
    newObj[name] = obj[name];
  }
  return newObj;
}
const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
function forwardEventsBuilder(component) {
  let $on;
  let events2 = [];
  component.$on = (fullEventType, callback) => {
    let eventType = fullEventType;
    let destructor = () => {
    };
    if ($on) {
      destructor = $on(eventType, callback);
    } else {
      events2.push([eventType, callback]);
    }
    const oldModifierMatch = eventType.match(oldModifierRegex);
    if (oldModifierMatch && console) {
      console.warn('Event modifiers in SMUI now use "$" instead of ":", so that all events can be bound with modifiers. Please update your event binding: ', eventType);
    }
    return () => {
      destructor();
    };
  };
  function forward(e) {
    bubble(component, e);
  }
  return (node) => {
    const destructors = [];
    const forwardDestructors = {};
    $on = (fullEventType, callback) => {
      let eventType = fullEventType;
      let handler = callback;
      let options = false;
      const oldModifierMatch = eventType.match(oldModifierRegex);
      const newModifierMatch = eventType.match(newModifierRegex);
      const modifierMatch = oldModifierMatch || newModifierMatch;
      if (eventType.match(/^SMUI:\w+:/)) {
        const newEventTypeParts = eventType.split(":");
        let newEventType = "";
        for (let i = 0; i < newEventTypeParts.length; i++) {
          newEventType += i === newEventTypeParts.length - 1 ? ":" + newEventTypeParts[i] : newEventTypeParts[i].split("-").map((value) => value.slice(0, 1).toUpperCase() + value.slice(1)).join("");
        }
        console.warn(`The event ${eventType.split("$")[0]} has been renamed to ${newEventType.split("$")[0]}.`);
        eventType = newEventType;
      }
      if (modifierMatch) {
        const parts = eventType.split(oldModifierMatch ? ":" : "$");
        eventType = parts[0];
        const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
        if (eventOptions.passive) {
          options = options || {};
          options.passive = true;
        }
        if (eventOptions.nonpassive) {
          options = options || {};
          options.passive = false;
        }
        if (eventOptions.capture) {
          options = options || {};
          options.capture = true;
        }
        if (eventOptions.once) {
          options = options || {};
          options.once = true;
        }
        if (eventOptions.preventDefault) {
          handler = prevent_default(handler);
        }
        if (eventOptions.stopPropagation) {
          handler = stop_propagation(handler);
        }
      }
      const off = listen(node, eventType, handler, options);
      const destructor = () => {
        off();
        const idx = destructors.indexOf(destructor);
        if (idx > -1) {
          destructors.splice(idx, 1);
        }
      };
      destructors.push(destructor);
      if (!(eventType in forwardDestructors)) {
        forwardDestructors[eventType] = listen(node, eventType, forward);
      }
      return destructor;
    };
    for (let i = 0; i < events2.length; i++) {
      $on(events2[i][0], events2[i][1]);
    }
    return {
      destroy: () => {
        for (let i = 0; i < destructors.length; i++) {
          destructors[i]();
        }
        for (let entry of Object.entries(forwardDestructors)) {
          entry[1]();
        }
      }
    };
  };
}
function prefixFilter(obj, prefix) {
  let names = Object.getOwnPropertyNames(obj);
  const newObj = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (name.substring(0, prefix.length) === prefix) {
      newObj[name.substring(prefix.length)] = obj[name];
    }
  }
  return newObj;
}
function useActions(node, actions) {
  let actionReturns = [];
  if (actions) {
    for (let i = 0; i < actions.length; i++) {
      const actionEntry = actions[i];
      const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
      if (Array.isArray(actionEntry) && actionEntry.length > 1) {
        actionReturns.push(action(node, actionEntry[1]));
      } else {
        actionReturns.push(action(node));
      }
    }
  }
  return {
    update(actions2) {
      if ((actions2 && actions2.length || 0) != actionReturns.length) {
        throw new Error("You must not change the length of an actions array.");
      }
      if (actions2) {
        for (let i = 0; i < actions2.length; i++) {
          const returnEntry = actionReturns[i];
          if (returnEntry && returnEntry.update) {
            const actionEntry = actions2[i];
            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
              returnEntry.update(actionEntry[1]);
            } else {
              returnEntry.update();
            }
          }
        }
      }
    },
    destroy() {
      for (let i = 0; i < actionReturns.length; i++) {
        const returnEntry = actionReturns[i];
        if (returnEntry && returnEntry.destroy) {
          returnEntry.destroy();
        }
      }
    }
  };
}
function create_fragment$q(ctx) {
  let div2;
  let div1;
  let div0;
  let div0_class_value;
  let div0_style_value;
  let useActions_action;
  let div1_class_value;
  let div1_style_value;
  let useActions_action_1;
  let div2_class_value;
  let useActions_action_2;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[23].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[22], null);
  let div0_levels = [
    {
      class: div0_class_value = classMap({
        [ctx[6]]: true,
        "mdc-tab-scroller__scroll-content": true
      })
    },
    {
      style: div0_style_value = Object.entries(ctx[14]).map(func$7).join(" ")
    },
    prefixFilter(ctx[16], "scrollContent$")
  ];
  let div0_data = {};
  for (let i = 0; i < div0_levels.length; i += 1) {
    div0_data = assign(div0_data, div0_levels[i]);
  }
  let div1_levels = [
    {
      class: div1_class_value = classMap(__spreadValues({
        [ctx[4]]: true,
        "mdc-tab-scroller__scroll-area": true
      }, ctx[12]))
    },
    {
      style: div1_style_value = Object.entries(ctx[13]).map(func_1$2).join(" ")
    },
    prefixFilter(ctx[16], "scrollArea$")
  ];
  let div1_data = {};
  for (let i = 0; i < div1_levels.length; i += 1) {
    div1_data = assign(div1_data, div1_levels[i]);
  }
  let div2_levels = [
    {
      class: div2_class_value = classMap(__spreadValues({
        [ctx[1]]: true,
        "mdc-tab-scroller": true,
        "mdc-tab-scroller--align-start": ctx[2] === "start",
        "mdc-tab-scroller--align-end": ctx[2] === "end",
        "mdc-tab-scroller--align-center": ctx[2] === "center"
      }, ctx[11]))
    },
    exclude(ctx[16], ["scrollArea$", "scrollContent$"])
  ];
  let div2_data = {};
  for (let i = 0; i < div2_levels.length; i += 1) {
    div2_data = assign(div2_data, div2_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div1 = claim_element(div2_nodes, "DIV", { class: true, style: true });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", { class: true, style: true });
      var div0_nodes = children(div0);
      if (default_slot)
        default_slot.l(div0_nodes);
      div0_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div0, div0_data);
      set_attributes(div1, div1_data);
      set_attributes(div2, div2_data);
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div1);
      append_hydration(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      ctx[24](div0);
      ctx[26](div1);
      ctx[32](div2);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div0, ctx[5])),
          listen(div0, "transitionend", ctx[25]),
          action_destroyer(useActions_action_1 = useActions.call(null, div1, ctx[3])),
          listen(div1, "wheel", ctx[27], { passive: true }),
          listen(div1, "touchstart", ctx[28], { passive: true }),
          listen(div1, "pointerdown", ctx[29]),
          listen(div1, "mousedown", ctx[30]),
          listen(div1, "keydown", ctx[31]),
          action_destroyer(useActions_action_2 = useActions.call(null, div2, ctx[0])),
          action_destroyer(ctx[15].call(null, div2))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[0] & 4194304)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[22], !current ? get_all_dirty_from_scope(ctx2[22]) : get_slot_changes(default_slot_template, ctx2[22], dirty, null), null);
        }
      }
      set_attributes(div0, div0_data = get_spread_update(div0_levels, [
        (!current || dirty[0] & 64 && div0_class_value !== (div0_class_value = classMap({
          [ctx2[6]]: true,
          "mdc-tab-scroller__scroll-content": true
        }))) && { class: div0_class_value },
        (!current || dirty[0] & 16384 && div0_style_value !== (div0_style_value = Object.entries(ctx2[14]).map(func$7).join(" "))) && { style: div0_style_value },
        dirty[0] & 65536 && prefixFilter(ctx2[16], "scrollContent$")
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty[0] & 32)
        useActions_action.update.call(null, ctx2[5]);
      set_attributes(div1, div1_data = get_spread_update(div1_levels, [
        (!current || dirty[0] & 4112 && div1_class_value !== (div1_class_value = classMap(__spreadValues({
          [ctx2[4]]: true,
          "mdc-tab-scroller__scroll-area": true
        }, ctx2[12])))) && { class: div1_class_value },
        (!current || dirty[0] & 8192 && div1_style_value !== (div1_style_value = Object.entries(ctx2[13]).map(func_1$2).join(" "))) && { style: div1_style_value },
        dirty[0] & 65536 && prefixFilter(ctx2[16], "scrollArea$")
      ]));
      if (useActions_action_1 && is_function(useActions_action_1.update) && dirty[0] & 8)
        useActions_action_1.update.call(null, ctx2[3]);
      set_attributes(div2, div2_data = get_spread_update(div2_levels, [
        (!current || dirty[0] & 2054 && div2_class_value !== (div2_class_value = classMap(__spreadValues({
          [ctx2[1]]: true,
          "mdc-tab-scroller": true,
          "mdc-tab-scroller--align-start": ctx2[2] === "start",
          "mdc-tab-scroller--align-end": ctx2[2] === "end",
          "mdc-tab-scroller--align-center": ctx2[2] === "center"
        }, ctx2[11])))) && { class: div2_class_value },
        dirty[0] & 65536 && exclude(ctx2[16], ["scrollArea$", "scrollContent$"])
      ]));
      if (useActions_action_2 && is_function(useActions_action_2.update) && dirty[0] & 1)
        useActions_action_2.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if (default_slot)
        default_slot.d(detaching);
      ctx[24](null);
      ctx[26](null);
      ctx[32](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
const func$7 = ([name, value]) => `${name}: ${value};`;
const func_1$2 = ([name, value]) => `${name}: ${value};`;
function instance_1$9($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "use",
    "class",
    "align",
    "scrollArea$use",
    "scrollArea$class",
    "scrollContent$use",
    "scrollContent$class",
    "getScrollPosition",
    "getScrollContentWidth",
    "incrementScroll",
    "scrollTo",
    "getElement"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const { matches: matches2 } = ponyfill;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { align = void 0 } = $$props;
  let { scrollArea$use = [] } = $$props;
  let { scrollArea$class = "" } = $$props;
  let { scrollContent$use = [] } = $$props;
  let { scrollContent$class = "" } = $$props;
  let element2;
  let instance2;
  let scrollArea;
  let scrollContent;
  let internalClasses = {};
  let scrollAreaClasses = {};
  let scrollAreaStyles = {};
  let scrollContentStyles = {};
  onMount(() => {
    $$invalidate(8, instance2 = new MDCTabScrollerFoundation({
      eventTargetMatchesSelector: (evtTarget, selector) => matches2(evtTarget, selector),
      addClass,
      removeClass,
      addScrollAreaClass,
      setScrollAreaStyleProperty: addScrollAreaStyle,
      setScrollContentStyleProperty: addScrollContentStyle,
      getScrollContentStyleValue: getScrollContentStyle,
      setScrollAreaScrollLeft: (scrollX) => $$invalidate(9, scrollArea.scrollLeft = scrollX, scrollArea),
      getScrollAreaScrollLeft: () => scrollArea.scrollLeft,
      getScrollContentOffsetWidth: () => scrollContent.offsetWidth,
      getScrollAreaOffsetWidth: () => scrollArea.offsetWidth,
      computeScrollAreaClientRect: () => scrollArea.getBoundingClientRect(),
      computeScrollContentClientRect: () => scrollContent.getBoundingClientRect(),
      computeHorizontalScrollbarHeight: () => computeHorizontalScrollbarHeight(document)
    }));
    instance2.init();
    return () => {
      instance2.destroy();
    };
  });
  function addClass(className2) {
    if (!internalClasses[className2]) {
      $$invalidate(11, internalClasses[className2] = true, internalClasses);
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      $$invalidate(11, internalClasses[className2] = false, internalClasses);
    }
  }
  function addScrollAreaClass(className2) {
    if (!scrollAreaClasses[className2]) {
      $$invalidate(12, scrollAreaClasses[className2] = true, scrollAreaClasses);
    }
  }
  function addScrollAreaStyle(name, value) {
    if (scrollAreaStyles[name] != value) {
      if (value === "" || value == null) {
        delete scrollAreaStyles[name];
        $$invalidate(13, scrollAreaStyles);
      } else {
        $$invalidate(13, scrollAreaStyles[name] = value, scrollAreaStyles);
      }
    }
  }
  function addScrollContentStyle(name, value) {
    if (scrollContentStyles[name] != value) {
      if (value === "" || value == null) {
        delete scrollContentStyles[name];
        $$invalidate(14, scrollContentStyles);
      } else {
        $$invalidate(14, scrollContentStyles[name] = value, scrollContentStyles);
      }
    }
  }
  function getScrollContentStyle(name) {
    return name in scrollContentStyles ? scrollContentStyles[name] : getComputedStyle(scrollContent).getPropertyValue(name);
  }
  function getScrollPosition() {
    return instance2.getScrollPosition();
  }
  function getScrollContentWidth() {
    return scrollContent.offsetWidth;
  }
  function incrementScroll(scrollXIncrement) {
    instance2.incrementScroll(scrollXIncrement);
  }
  function scrollTo(scrollX) {
    instance2.scrollTo(scrollX);
  }
  function getElement() {
    return element2;
  }
  function div0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      scrollContent = $$value;
      $$invalidate(10, scrollContent);
    });
  }
  const transitionend_handler = (event) => instance2 && instance2.handleTransitionEnd(event);
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      scrollArea = $$value;
      $$invalidate(9, scrollArea);
    });
  }
  const wheel_handler = () => instance2 && instance2.handleInteraction();
  const touchstart_handler = () => instance2 && instance2.handleInteraction();
  const pointerdown_handler = () => instance2 && instance2.handleInteraction();
  const mousedown_handler = () => instance2 && instance2.handleInteraction();
  const keydown_handler = () => instance2 && instance2.handleInteraction();
  function div2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(7, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("align" in $$new_props)
      $$invalidate(2, align = $$new_props.align);
    if ("scrollArea$use" in $$new_props)
      $$invalidate(3, scrollArea$use = $$new_props.scrollArea$use);
    if ("scrollArea$class" in $$new_props)
      $$invalidate(4, scrollArea$class = $$new_props.scrollArea$class);
    if ("scrollContent$use" in $$new_props)
      $$invalidate(5, scrollContent$use = $$new_props.scrollContent$use);
    if ("scrollContent$class" in $$new_props)
      $$invalidate(6, scrollContent$class = $$new_props.scrollContent$class);
    if ("$$scope" in $$new_props)
      $$invalidate(22, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    className,
    align,
    scrollArea$use,
    scrollArea$class,
    scrollContent$use,
    scrollContent$class,
    element2,
    instance2,
    scrollArea,
    scrollContent,
    internalClasses,
    scrollAreaClasses,
    scrollAreaStyles,
    scrollContentStyles,
    forwardEvents,
    $$restProps,
    getScrollPosition,
    getScrollContentWidth,
    incrementScroll,
    scrollTo,
    getElement,
    $$scope,
    slots,
    div0_binding,
    transitionend_handler,
    div1_binding,
    wheel_handler,
    touchstart_handler,
    pointerdown_handler,
    mousedown_handler,
    keydown_handler,
    div2_binding
  ];
}
class TabScroller extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1$9, create_fragment$q, safe_not_equal, {
      use: 0,
      class: 1,
      align: 2,
      scrollArea$use: 3,
      scrollArea$class: 4,
      scrollContent$use: 5,
      scrollContent$class: 6,
      getScrollPosition: 17,
      getScrollContentWidth: 18,
      incrementScroll: 19,
      scrollTo: 20,
      getElement: 21
    }, null, [-1, -1]);
  }
  get getScrollPosition() {
    return this.$$.ctx[17];
  }
  get getScrollContentWidth() {
    return this.$$.ctx[18];
  }
  get incrementScroll() {
    return this.$$.ctx[19];
  }
  get scrollTo() {
    return this.$$.ctx[20];
  }
  get getElement() {
    return this.$$.ctx[21];
  }
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[30] = list[i];
  return child_ctx;
}
const get_default_slot_changes = (dirty) => ({ tab: dirty[0] & 4 });
const get_default_slot_context = (ctx) => ({ tab: ctx[30] });
function create_each_block$1(key_2, ctx) {
  let first;
  let current;
  const default_slot_template = ctx[20].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[25], get_default_slot_context);
  return {
    key: key_2,
    first: null,
    c() {
      first = empty();
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      first = empty();
      if (default_slot)
        default_slot.l(nodes);
      this.h();
    },
    h() {
      this.first = first;
    },
    m(target, anchor) {
      insert_hydration(target, first, anchor);
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (default_slot) {
        if (default_slot.p && (!current || dirty[0] & 33554436)) {
          update_slot_base(default_slot, default_slot_template, ctx, ctx[25], !current ? get_all_dirty_from_scope(ctx[25]) : get_slot_changes(default_slot_template, ctx[25], dirty, get_default_slot_changes), get_default_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(first);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_default_slot$5(ctx) {
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_1_anchor;
  let current;
  let each_value = ctx[2];
  const get_key = (ctx2) => ctx2[3](ctx2[30]);
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$1(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    l(nodes) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(nodes);
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert_hydration(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & 33554444) {
        each_value = ctx2[2];
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d(detaching);
      }
      if (detaching)
        detach(each_1_anchor);
    }
  };
}
function create_fragment$p(ctx) {
  let div;
  let tabscroller;
  let div_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const tabscroller_spread_levels = [prefixFilter(ctx[10], "tabScroller$")];
  let tabscroller_props = {
    $$slots: { default: [create_default_slot$5] },
    $$scope: { ctx }
  };
  for (let i = 0; i < tabscroller_spread_levels.length; i += 1) {
    tabscroller_props = assign(tabscroller_props, tabscroller_spread_levels[i]);
  }
  tabscroller = new TabScroller({ props: tabscroller_props });
  ctx[21](tabscroller);
  let div_levels = [
    {
      class: div_class_value = classMap({
        [ctx[1]]: true,
        "mdc-tab-bar": true
      })
    },
    { role: "tablist" },
    exclude(ctx[10], ["tabScroller$"])
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      create_component(tabscroller.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, role: true });
      var div_nodes = children(div);
      claim_component(tabscroller.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(tabscroller, div, null);
      ctx[22](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div, ctx[0])),
          action_destroyer(ctx[7].call(null, div)),
          listen(div, "SMUITab:mount", ctx[8]),
          listen(div, "SMUITab:unmount", ctx[9]),
          listen(div, "SMUITab:interacted", ctx[23]),
          listen(div, "keydown", ctx[24])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const tabscroller_changes = dirty[0] & 1024 ? get_spread_update(tabscroller_spread_levels, [get_spread_object(prefixFilter(ctx2[10], "tabScroller$"))]) : {};
      if (dirty[0] & 33554436) {
        tabscroller_changes.$$scope = { dirty, ctx: ctx2 };
      }
      tabscroller.$set(tabscroller_changes);
      set_attributes(div, div_data = get_spread_update(div_levels, [
        (!current || dirty[0] & 2 && div_class_value !== (div_class_value = classMap({
          [ctx2[1]]: true,
          "mdc-tab-bar": true
        }))) && { class: div_class_value },
        { role: "tablist" },
        dirty[0] & 1024 && exclude(ctx2[10], ["tabScroller$"])
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty[0] & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(tabscroller.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tabscroller.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      ctx[21](null);
      destroy_component(tabscroller);
      ctx[22](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance_1$8($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "use",
    "class",
    "tabs",
    "key",
    "focusOnActivate",
    "focusOnProgrammatic",
    "useAutomaticActivation",
    "active",
    "scrollIntoView",
    "getElement"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { tabs = [] } = $$props;
  let { key = (tab) => tab } = $$props;
  let { focusOnActivate = true } = $$props;
  let { focusOnProgrammatic = false } = $$props;
  let { useAutomaticActivation = true } = $$props;
  let { active = void 0 } = $$props;
  let element2;
  let instance2;
  let tabScroller;
  let activeIndex = tabs.indexOf(active);
  let tabAccessorMap = {};
  let tabAccessorWeakMap = /* @__PURE__ */ new WeakMap();
  let skipFocus = false;
  setContext("SMUI:tab:focusOnActivate", focusOnActivate);
  setContext("SMUI:tab:initialActive", active);
  onMount(() => {
    $$invalidate(4, instance2 = new MDCTabBarFoundation({
      scrollTo: (scrollX) => tabScroller.scrollTo(scrollX),
      incrementScroll: (scrollXIncrement) => tabScroller.incrementScroll(scrollXIncrement),
      getScrollPosition: () => tabScroller.getScrollPosition(),
      getScrollContentWidth: () => tabScroller.getScrollContentWidth(),
      getOffsetWidth: () => getElement().offsetWidth,
      isRTL: () => getComputedStyle(getElement()).getPropertyValue("direction") === "rtl",
      setActiveTab: (index) => {
        $$invalidate(11, active = tabs[index]);
        $$invalidate(17, activeIndex = index);
        instance2.activateTab(index);
      },
      activateTabAtIndex: (index, clientRect) => {
        var _a;
        return (_a = getAccessor(tabs[index])) === null || _a === void 0 ? void 0 : _a.activate(clientRect, skipFocus);
      },
      deactivateTabAtIndex: (index) => {
        var _a;
        return (_a = getAccessor(tabs[index])) === null || _a === void 0 ? void 0 : _a.deactivate();
      },
      focusTabAtIndex: (index) => {
        var _a;
        return (_a = getAccessor(tabs[index])) === null || _a === void 0 ? void 0 : _a.focus();
      },
      getTabIndicatorClientRectAtIndex: (index) => {
        var _a, _b;
        return (_b = (_a = getAccessor(tabs[index])) === null || _a === void 0 ? void 0 : _a.computeIndicatorClientRect()) !== null && _b !== void 0 ? _b : new DOMRect();
      },
      getTabDimensionsAtIndex: (index) => {
        var _a, _b;
        return (_b = (_a = getAccessor(tabs[index])) === null || _a === void 0 ? void 0 : _a.computeDimensions()) !== null && _b !== void 0 ? _b : {
          rootLeft: 0,
          rootRight: 0,
          contentLeft: 0,
          contentRight: 0
        };
      },
      getPreviousActiveTabIndex: () => {
        var _a;
        for (let i = 0; i < tabs.length; i++) {
          if ((_a = getAccessor(tabs[i])) === null || _a === void 0 ? void 0 : _a.active) {
            return i;
          }
        }
        return -1;
      },
      getFocusedTabIndex: () => {
        const tabElements = tabs.map((tab) => {
          var _a;
          return (_a = getAccessor(tab)) === null || _a === void 0 ? void 0 : _a.element;
        });
        const activeElement = document.activeElement;
        return tabElements.indexOf(activeElement);
      },
      getIndexOfTabById: (id) => tabs.indexOf(id),
      getTabListLength: () => tabs.length,
      notifyTabActivated: (index) => dispatch(getElement(), "SMUITabBar:activated", { index }, void 0, true)
    }));
    instance2.init();
    return () => {
      instance2.destroy();
    };
  });
  function handleTabMount(event) {
    const accessor = event.detail;
    addAccessor(accessor.tabId, accessor);
  }
  function handleTabUnmount(event) {
    const accessor = event.detail;
    removeAccessor(accessor.tabId);
  }
  function getAccessor(tabId) {
    return tabId instanceof Object ? tabAccessorWeakMap.get(tabId) : tabAccessorMap[tabId];
  }
  function addAccessor(tabId, accessor) {
    if (tabId instanceof Object) {
      tabAccessorWeakMap.set(tabId, accessor);
      $$invalidate(19, tabAccessorWeakMap);
    } else {
      $$invalidate(18, tabAccessorMap[tabId] = accessor, tabAccessorMap);
      $$invalidate(18, tabAccessorMap);
    }
  }
  function removeAccessor(tabId) {
    if (tabId instanceof Object) {
      tabAccessorWeakMap.delete(tabId);
      $$invalidate(19, tabAccessorWeakMap);
    } else {
      delete tabAccessorMap[tabId];
      $$invalidate(18, tabAccessorMap);
    }
  }
  function scrollIntoView(index) {
    instance2.scrollIntoView(index);
  }
  function getElement() {
    return element2;
  }
  function tabscroller_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      tabScroller = $$value;
      $$invalidate(6, tabScroller);
    });
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(5, element2);
    });
  }
  const SMUITab_interacted_handler = (event) => instance2 && instance2.handleTabInteraction(event);
  const keydown_handler = (event) => instance2 && instance2.handleKeyDown(event);
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("tabs" in $$new_props)
      $$invalidate(2, tabs = $$new_props.tabs);
    if ("key" in $$new_props)
      $$invalidate(3, key = $$new_props.key);
    if ("focusOnActivate" in $$new_props)
      $$invalidate(12, focusOnActivate = $$new_props.focusOnActivate);
    if ("focusOnProgrammatic" in $$new_props)
      $$invalidate(13, focusOnProgrammatic = $$new_props.focusOnProgrammatic);
    if ("useAutomaticActivation" in $$new_props)
      $$invalidate(14, useAutomaticActivation = $$new_props.useAutomaticActivation);
    if ("active" in $$new_props)
      $$invalidate(11, active = $$new_props.active);
    if ("$$scope" in $$new_props)
      $$invalidate(25, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 141332) {
      if (active !== tabs[activeIndex]) {
        $$invalidate(17, activeIndex = tabs.indexOf(active));
        if (instance2) {
          skipFocus = !focusOnProgrammatic;
          instance2.activateTab(activeIndex);
          skipFocus = false;
        }
      }
    }
    if ($$self.$$.dirty[0] & 917508) {
      if (tabs.length) {
        const accessor = tabs[0] instanceof Object ? tabAccessorWeakMap.get(tabs[0]) : tabAccessorMap[tabs[0]];
        if (accessor) {
          accessor.forceAccessible(activeIndex === -1);
        }
      }
    }
    if ($$self.$$.dirty[0] & 16400) {
      if (instance2) {
        instance2.setUseAutomaticActivation(useAutomaticActivation);
      }
    }
  };
  return [
    use,
    className,
    tabs,
    key,
    instance2,
    element2,
    tabScroller,
    forwardEvents,
    handleTabMount,
    handleTabUnmount,
    $$restProps,
    active,
    focusOnActivate,
    focusOnProgrammatic,
    useAutomaticActivation,
    scrollIntoView,
    getElement,
    activeIndex,
    tabAccessorMap,
    tabAccessorWeakMap,
    slots,
    tabscroller_binding,
    div_binding,
    SMUITab_interacted_handler,
    keydown_handler,
    $$scope
  ];
}
class TabBar extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1$8, create_fragment$p, safe_not_equal, {
      use: 0,
      class: 1,
      tabs: 2,
      key: 3,
      focusOnActivate: 12,
      focusOnProgrammatic: 13,
      useAutomaticActivation: 14,
      active: 11,
      scrollIntoView: 15,
      getElement: 16
    }, null, [-1, -1]);
  }
  get scrollIntoView() {
    return this.$$.ctx[15];
  }
  get getElement() {
    return this.$$.ctx[16];
  }
}
const { applyPassive } = events;
const { matches } = ponyfill;
function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve() } = {}) {
  let instance2;
  let addLayoutListener = getContext("SMUI:addLayoutListener");
  let removeLayoutListener;
  let oldActive = active;
  let oldEventTarget = eventTarget;
  let oldActiveTarget = activeTarget;
  function handleProps() {
    if (surface) {
      addClass("mdc-ripple-surface");
      if (color === "primary") {
        addClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      } else if (color === "secondary") {
        removeClass("smui-ripple-surface--primary");
        addClass("smui-ripple-surface--secondary");
      } else {
        removeClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      }
    } else {
      removeClass("mdc-ripple-surface");
      removeClass("smui-ripple-surface--primary");
      removeClass("smui-ripple-surface--secondary");
    }
    if (instance2 && oldActive !== active) {
      oldActive = active;
      if (active) {
        instance2.activate();
      } else if (active === false) {
        instance2.deactivate();
      }
    }
    if (ripple && !instance2) {
      instance2 = new MDCRippleFoundation({
        addClass,
        browserSupportsCssVars: () => supportsCssVariables(window),
        computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
        containsEventTarget: (target) => node.contains(target),
        deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
        deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
        deregisterResizeHandler: (handler) => window.removeEventListener("resize", handler),
        getWindowPageOffset: () => ({
          x: window.pageXOffset,
          y: window.pageYOffset
        }),
        isSurfaceActive: () => active == null ? matches(activeTarget || node, ":active") : active,
        isSurfaceDisabled: () => !!disabled,
        isUnbounded: () => !!unbounded,
        registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
        registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
        registerResizeHandler: (handler) => window.addEventListener("resize", handler),
        removeClass,
        updateCssVariable: addStyle
      });
      initPromise.then(() => {
        if (instance2) {
          instance2.init();
          instance2.setUnbounded(unbounded);
        }
      });
    } else if (instance2 && !ripple) {
      initPromise.then(() => {
        if (instance2) {
          instance2.destroy();
          instance2 = void 0;
        }
      });
    }
    if (instance2 && (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
      oldEventTarget = eventTarget;
      oldActiveTarget = activeTarget;
      instance2.destroy();
      requestAnimationFrame(() => {
        if (instance2) {
          instance2.init();
          instance2.setUnbounded(unbounded);
        }
      });
    }
    if (!ripple && unbounded) {
      addClass("mdc-ripple-upgraded--unbounded");
    }
  }
  handleProps();
  if (addLayoutListener) {
    removeLayoutListener = addLayoutListener(layout);
  }
  function layout() {
    if (instance2) {
      instance2.layout();
    }
  }
  return {
    update(props) {
      ({
        ripple,
        surface,
        unbounded,
        disabled,
        color,
        active,
        rippleElement,
        eventTarget,
        activeTarget,
        addClass,
        removeClass,
        addStyle,
        initPromise
      } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: void 0, active: void 0, rippleElement: void 0, eventTarget: void 0, activeTarget: void 0, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
      handleProps();
    },
    destroy() {
      if (instance2) {
        instance2.destroy();
        instance2 = void 0;
        removeClass("mdc-ripple-surface");
        removeClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      }
      if (removeLayoutListener) {
        removeLayoutListener();
      }
    }
  };
}
function create_fragment$o(ctx) {
  let a;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[7].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[6], null);
  let a_levels = [{ href: ctx[1] }, ctx[4]];
  let a_data = {};
  for (let i = 0; i < a_levels.length; i += 1) {
    a_data = assign(a_data, a_levels[i]);
  }
  return {
    c() {
      a = element("a");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      a = claim_element(nodes, "A", { href: true });
      var a_nodes = children(a);
      if (default_slot)
        default_slot.l(a_nodes);
      a_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(a, a_data);
    },
    m(target, anchor) {
      insert_hydration(target, a, anchor);
      if (default_slot) {
        default_slot.m(a, null);
      }
      ctx[8](a);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, a, ctx[0])),
          action_destroyer(ctx[3].call(null, a))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 64)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[6], !current ? get_all_dirty_from_scope(ctx2[6]) : get_slot_changes(default_slot_template, ctx2[6], dirty, null), null);
        }
      }
      set_attributes(a, a_data = get_spread_update(a_levels, [
        (!current || dirty & 2) && { href: ctx2[1] },
        dirty & 16 && ctx2[4]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if (default_slot)
        default_slot.d(detaching);
      ctx[8](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$g($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "href", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [] } = $$props;
  let { href = "javascript:void(0);" } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let element2;
  function getElement() {
    return element2;
  }
  function a_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(2, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("href" in $$new_props)
      $$invalidate(1, href = $$new_props.href);
    if ("$$scope" in $$new_props)
      $$invalidate(6, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    href,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    a_binding
  ];
}
class A$1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$g, create_fragment$o, safe_not_equal, { use: 0, href: 1, getElement: 5 });
  }
  get getElement() {
    return this.$$.ctx[5];
  }
}
function create_fragment$n(ctx) {
  let button;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  let button_levels = [ctx[3]];
  let button_data = {};
  for (let i = 0; i < button_levels.length; i += 1) {
    button_data = assign(button_data, button_levels[i]);
  }
  return {
    c() {
      button = element("button");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      button = claim_element(nodes, "BUTTON", {});
      var button_nodes = children(button);
      if (default_slot)
        default_slot.l(button_nodes);
      button_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(button, button_data);
    },
    m(target, anchor) {
      insert_hydration(target, button, anchor);
      if (default_slot) {
        default_slot.m(button, null);
      }
      if (button.autofocus)
        button.focus();
      ctx[7](button);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, button, ctx[0])),
          action_destroyer(ctx[2].call(null, button))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      set_attributes(button, button_data = get_spread_update(button_levels, [dirty & 8 && ctx2[3]]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(button);
      if (default_slot)
        default_slot.d(detaching);
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$f($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [] } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let element2;
  function getElement() {
    return element2;
  }
  function button_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(1, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("$$scope" in $$new_props)
      $$invalidate(5, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    button_binding
  ];
}
class Button$1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$f, create_fragment$n, safe_not_equal, { use: 0, getElement: 4 });
  }
  get getElement() {
    return this.$$.ctx[4];
  }
}
function create_fragment$m(ctx) {
  let div;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  let div_levels = [ctx[3]];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[7](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div, ctx[0])),
          action_destroyer(ctx[2].call(null, div))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [dirty & 8 && ctx2[3]]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$e($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [] } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let element2;
  function getElement() {
    return element2;
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(1, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("$$scope" in $$new_props)
      $$invalidate(5, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    div_binding
  ];
}
class Div$1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$e, create_fragment$m, safe_not_equal, { use: 0, getElement: 4 });
  }
  get getElement() {
    return this.$$.ctx[4];
  }
}
function create_fragment$l(ctx) {
  let h2;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  let h2_levels = [ctx[3]];
  let h2_data = {};
  for (let i = 0; i < h2_levels.length; i += 1) {
    h2_data = assign(h2_data, h2_levels[i]);
  }
  return {
    c() {
      h2 = element("h2");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      h2 = claim_element(nodes, "H2", {});
      var h2_nodes = children(h2);
      if (default_slot)
        default_slot.l(h2_nodes);
      h2_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(h2, h2_data);
    },
    m(target, anchor) {
      insert_hydration(target, h2, anchor);
      if (default_slot) {
        default_slot.m(h2, null);
      }
      ctx[7](h2);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, h2, ctx[0])),
          action_destroyer(ctx[2].call(null, h2))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      set_attributes(h2, h2_data = get_spread_update(h2_levels, [dirty & 8 && ctx2[3]]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(h2);
      if (default_slot)
        default_slot.d(detaching);
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$d($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [] } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let element2;
  function getElement() {
    return element2;
  }
  function h2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(1, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("$$scope" in $$new_props)
      $$invalidate(5, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    h2_binding
  ];
}
class H2$1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$d, create_fragment$l, safe_not_equal, { use: 0, getElement: 4 });
  }
  get getElement() {
    return this.$$.ctx[4];
  }
}
function create_fragment$k(ctx) {
  let h5;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  let h5_levels = [ctx[3]];
  let h5_data = {};
  for (let i = 0; i < h5_levels.length; i += 1) {
    h5_data = assign(h5_data, h5_levels[i]);
  }
  return {
    c() {
      h5 = element("h5");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      h5 = claim_element(nodes, "H5", {});
      var h5_nodes = children(h5);
      if (default_slot)
        default_slot.l(h5_nodes);
      h5_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(h5, h5_data);
    },
    m(target, anchor) {
      insert_hydration(target, h5, anchor);
      if (default_slot) {
        default_slot.m(h5, null);
      }
      ctx[7](h5);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, h5, ctx[0])),
          action_destroyer(ctx[2].call(null, h5))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      set_attributes(h5, h5_data = get_spread_update(h5_levels, [dirty & 8 && ctx2[3]]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(h5);
      if (default_slot)
        default_slot.d(detaching);
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [] } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let element2;
  function getElement() {
    return element2;
  }
  function h5_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(1, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("$$scope" in $$new_props)
      $$invalidate(5, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    h5_binding
  ];
}
class H5$1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$k, safe_not_equal, { use: 0, getElement: 4 });
  }
  get getElement() {
    return this.$$.ctx[4];
  }
}
function create_fragment$j(ctx) {
  let h6;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  let h6_levels = [ctx[3]];
  let h6_data = {};
  for (let i = 0; i < h6_levels.length; i += 1) {
    h6_data = assign(h6_data, h6_levels[i]);
  }
  return {
    c() {
      h6 = element("h6");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      h6 = claim_element(nodes, "H6", {});
      var h6_nodes = children(h6);
      if (default_slot)
        default_slot.l(h6_nodes);
      h6_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(h6, h6_data);
    },
    m(target, anchor) {
      insert_hydration(target, h6, anchor);
      if (default_slot) {
        default_slot.m(h6, null);
      }
      ctx[7](h6);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, h6, ctx[0])),
          action_destroyer(ctx[2].call(null, h6))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      set_attributes(h6, h6_data = get_spread_update(h6_levels, [dirty & 8 && ctx2[3]]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(h6);
      if (default_slot)
        default_slot.d(detaching);
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$b($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [] } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let element2;
  function getElement() {
    return element2;
  }
  function h6_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(1, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("$$scope" in $$new_props)
      $$invalidate(5, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    h6_binding
  ];
}
class H6$1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$j, safe_not_equal, { use: 0, getElement: 4 });
  }
  get getElement() {
    return this.$$.ctx[4];
  }
}
function create_fragment$i(ctx) {
  let span;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  let span_levels = [ctx[3]];
  let span_data = {};
  for (let i = 0; i < span_levels.length; i += 1) {
    span_data = assign(span_data, span_levels[i]);
  }
  return {
    c() {
      span = element("span");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      span = claim_element(nodes, "SPAN", {});
      var span_nodes = children(span);
      if (default_slot)
        default_slot.l(span_nodes);
      span_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(span, span_data);
    },
    m(target, anchor) {
      insert_hydration(target, span, anchor);
      if (default_slot) {
        default_slot.m(span, null);
      }
      ctx[7](span);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, span, ctx[0])),
          action_destroyer(ctx[2].call(null, span))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      set_attributes(span, span_data = get_spread_update(span_levels, [dirty & 8 && ctx2[3]]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(span);
      if (default_slot)
        default_slot.d(detaching);
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$a($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [] } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let element2;
  function getElement() {
    return element2;
  }
  function span_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(1, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("$$scope" in $$new_props)
      $$invalidate(5, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    span_binding
  ];
}
class Span$1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$i, safe_not_equal, { use: 0, getElement: 4 });
  }
  get getElement() {
    return this.$$.ctx[4];
  }
}
const A = A$1;
const Button = Button$1;
const Div = Div$1;
const H2 = H2$1;
const H5 = H5$1;
const H6 = H6$1;
const Span = Span$1;
function create_fragment$h(ctx) {
  let span1;
  let span0;
  let span0_class_value;
  let span0_style_value;
  let span0_aria_hidden_value;
  let useActions_action;
  let span1_class_value;
  let useActions_action_1;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[21].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[20], null);
  let span0_levels = [
    {
      class: span0_class_value = classMap({
        [ctx[6]]: true,
        "mdc-tab-indicator__content": true,
        "mdc-tab-indicator__content--underline": ctx[3] === "underline",
        "mdc-tab-indicator__content--icon": ctx[3] === "icon"
      })
    },
    {
      style: span0_style_value = Object.entries(ctx[10]).map(func$6).join(" ")
    },
    {
      "aria-hidden": span0_aria_hidden_value = ctx[3] === "icon" ? "true" : void 0
    },
    prefixFilter(ctx[12], "content$")
  ];
  let span0_data = {};
  for (let i = 0; i < span0_levels.length; i += 1) {
    span0_data = assign(span0_data, span0_levels[i]);
  }
  let span1_levels = [
    {
      class: span1_class_value = classMap(__spreadValues({
        [ctx[2]]: true,
        "mdc-tab-indicator": true,
        "mdc-tab-indicator--active": ctx[0],
        "mdc-tab-indicator--fade": ctx[4] === "fade"
      }, ctx[9]))
    },
    exclude(ctx[12], ["content$"])
  ];
  let span1_data = {};
  for (let i = 0; i < span1_levels.length; i += 1) {
    span1_data = assign(span1_data, span1_levels[i]);
  }
  return {
    c() {
      span1 = element("span");
      span0 = element("span");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      span1 = claim_element(nodes, "SPAN", { class: true });
      var span1_nodes = children(span1);
      span0 = claim_element(span1_nodes, "SPAN", {
        class: true,
        style: true,
        "aria-hidden": true
      });
      var span0_nodes = children(span0);
      if (default_slot)
        default_slot.l(span0_nodes);
      span0_nodes.forEach(detach);
      span1_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(span0, span0_data);
      set_attributes(span1, span1_data);
    },
    m(target, anchor) {
      insert_hydration(target, span1, anchor);
      append_hydration(span1, span0);
      if (default_slot) {
        default_slot.m(span0, null);
      }
      ctx[22](span0);
      ctx[23](span1);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, span0, ctx[5])),
          action_destroyer(useActions_action_1 = useActions.call(null, span1, ctx[1])),
          action_destroyer(ctx[11].call(null, span1))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 1048576)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[20], !current ? get_all_dirty_from_scope(ctx2[20]) : get_slot_changes(default_slot_template, ctx2[20], dirty, null), null);
        }
      }
      set_attributes(span0, span0_data = get_spread_update(span0_levels, [
        (!current || dirty & 72 && span0_class_value !== (span0_class_value = classMap({
          [ctx2[6]]: true,
          "mdc-tab-indicator__content": true,
          "mdc-tab-indicator__content--underline": ctx2[3] === "underline",
          "mdc-tab-indicator__content--icon": ctx2[3] === "icon"
        }))) && { class: span0_class_value },
        (!current || dirty & 1024 && span0_style_value !== (span0_style_value = Object.entries(ctx2[10]).map(func$6).join(" "))) && { style: span0_style_value },
        (!current || dirty & 8 && span0_aria_hidden_value !== (span0_aria_hidden_value = ctx2[3] === "icon" ? "true" : void 0)) && { "aria-hidden": span0_aria_hidden_value },
        dirty & 4096 && prefixFilter(ctx2[12], "content$")
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 32)
        useActions_action.update.call(null, ctx2[5]);
      set_attributes(span1, span1_data = get_spread_update(span1_levels, [
        (!current || dirty & 533 && span1_class_value !== (span1_class_value = classMap(__spreadValues({
          [ctx2[2]]: true,
          "mdc-tab-indicator": true,
          "mdc-tab-indicator--active": ctx2[0],
          "mdc-tab-indicator--fade": ctx2[4] === "fade"
        }, ctx2[9])))) && { class: span1_class_value },
        dirty & 4096 && exclude(ctx2[12], ["content$"])
      ]));
      if (useActions_action_1 && is_function(useActions_action_1.update) && dirty & 2)
        useActions_action_1.update.call(null, ctx2[1]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(span1);
      if (default_slot)
        default_slot.d(detaching);
      ctx[22](null);
      ctx[23](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
const func$6 = ([name, value]) => `${name}: ${value};`;
function instance_1$7($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "use",
    "class",
    "active",
    "type",
    "transition",
    "content$use",
    "content$class",
    "activate",
    "deactivate",
    "computeContentClientRect",
    "getElement"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { type = "underline" } = $$props;
  let { transition = "slide" } = $$props;
  let { content$use = [] } = $$props;
  let { content$class = "" } = $$props;
  let element2;
  let instance2;
  let content;
  let internalClasses = {};
  let contentStyles = {};
  let changeSets = [];
  let oldTransition = transition;
  onMount(() => {
    $$invalidate(17, instance2 = getInstance());
    instance2.init();
    return () => {
      instance2.destroy();
    };
  });
  function getInstance() {
    const Foundation = {
      fade: MDCFadingTabIndicatorFoundation,
      slide: MDCSlidingTabIndicatorFoundation
    }[transition] || MDCSlidingTabIndicatorFoundation;
    return new Foundation({
      addClass: (...props) => doChange(() => addClass(...props)),
      removeClass: (...props) => doChange(() => removeClass(...props)),
      computeContentClientRect,
      setContentStyleProperty: (...props) => doChange(() => addContentStyle(...props))
    });
  }
  function doChange(fn) {
    if (changeSets.length) {
      changeSets[changeSets.length - 1].push(fn);
    } else {
      fn();
    }
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      $$invalidate(9, internalClasses[className2] = true, internalClasses);
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      $$invalidate(9, internalClasses[className2] = false, internalClasses);
    }
  }
  function addContentStyle(name, value) {
    if (contentStyles[name] != value) {
      if (value === "" || value == null) {
        delete contentStyles[name];
        $$invalidate(10, contentStyles), $$invalidate(19, oldTransition), $$invalidate(4, transition), $$invalidate(17, instance2);
      } else {
        $$invalidate(10, contentStyles[name] = value, contentStyles);
      }
    }
  }
  function activate(previousIndicatorClientRect) {
    $$invalidate(0, active = true);
    instance2.activate(previousIndicatorClientRect);
  }
  function deactivate() {
    $$invalidate(0, active = false);
    instance2.deactivate();
  }
  function computeContentClientRect() {
    changeSets.push([]);
    $$invalidate(18, changeSets);
    return content.getBoundingClientRect();
  }
  function getElement() {
    return element2;
  }
  function span0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      content = $$value;
      $$invalidate(8, content);
    });
  }
  function span1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(7, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("active" in $$new_props)
      $$invalidate(0, active = $$new_props.active);
    if ("type" in $$new_props)
      $$invalidate(3, type = $$new_props.type);
    if ("transition" in $$new_props)
      $$invalidate(4, transition = $$new_props.transition);
    if ("content$use" in $$new_props)
      $$invalidate(5, content$use = $$new_props.content$use);
    if ("content$class" in $$new_props)
      $$invalidate(6, content$class = $$new_props.content$class);
    if ("$$scope" in $$new_props)
      $$invalidate(20, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 655376) {
      if (oldTransition !== transition) {
        $$invalidate(19, oldTransition = transition);
        instance2 && instance2.destroy();
        $$invalidate(9, internalClasses = {});
        $$invalidate(10, contentStyles = {});
        $$invalidate(17, instance2 = getInstance());
        instance2.init();
      }
    }
    if ($$self.$$.dirty & 262144) {
      if (changeSets.length) {
        requestAnimationFrame(() => {
          var _a;
          const changeSet = (_a = changeSets.shift()) !== null && _a !== void 0 ? _a : [];
          $$invalidate(18, changeSets);
          for (const fn of changeSet) {
            fn();
          }
        });
      }
    }
  };
  return [
    active,
    use,
    className,
    type,
    transition,
    content$use,
    content$class,
    element2,
    content,
    internalClasses,
    contentStyles,
    forwardEvents,
    $$restProps,
    activate,
    deactivate,
    computeContentClientRect,
    getElement,
    instance2,
    changeSets,
    oldTransition,
    $$scope,
    slots,
    span0_binding,
    span1_binding
  ];
}
class TabIndicator extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1$7, create_fragment$h, safe_not_equal, {
      use: 1,
      class: 2,
      active: 0,
      type: 3,
      transition: 4,
      content$use: 5,
      content$class: 6,
      activate: 13,
      deactivate: 14,
      computeContentClientRect: 15,
      getElement: 16
    });
  }
  get activate() {
    return this.$$.ctx[13];
  }
  get deactivate() {
    return this.$$.ctx[14];
  }
  get computeContentClientRect() {
    return this.$$.ctx[15];
  }
  get getElement() {
    return this.$$.ctx[16];
  }
}
const get_tab_indicator_slot_changes_1 = (dirty) => ({});
const get_tab_indicator_slot_context_1 = (ctx) => ({});
const get_tab_indicator_slot_changes = (dirty) => ({});
const get_tab_indicator_slot_context = (ctx) => ({});
function create_if_block_1$1(ctx) {
  let tabindicator;
  let current;
  const tabindicator_spread_levels = [
    { active: ctx[18] },
    prefixFilter(ctx[24], "tabIndicator$")
  ];
  let tabindicator_props = {
    $$slots: { default: [create_default_slot_2$1] },
    $$scope: { ctx }
  };
  for (let i = 0; i < tabindicator_spread_levels.length; i += 1) {
    tabindicator_props = assign(tabindicator_props, tabindicator_spread_levels[i]);
  }
  tabindicator = new TabIndicator({ props: tabindicator_props });
  ctx[31](tabindicator);
  return {
    c() {
      create_component(tabindicator.$$.fragment);
    },
    l(nodes) {
      claim_component(tabindicator.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(tabindicator, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const tabindicator_changes = dirty[0] & 17039360 ? get_spread_update(tabindicator_spread_levels, [
        dirty[0] & 262144 && { active: ctx2[18] },
        dirty[0] & 16777216 && get_spread_object(prefixFilter(ctx2[24], "tabIndicator$"))
      ]) : {};
      if (dirty[1] & 32) {
        tabindicator_changes.$$scope = { dirty, ctx: ctx2 };
      }
      tabindicator.$set(tabindicator_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(tabindicator.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tabindicator.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[31](null);
      destroy_component(tabindicator, detaching);
    }
  };
}
function create_default_slot_2$1(ctx) {
  let current;
  const tab_indicator_slot_template = ctx[30]["tab-indicator"];
  const tab_indicator_slot = create_slot(tab_indicator_slot_template, ctx, ctx[36], get_tab_indicator_slot_context);
  return {
    c() {
      if (tab_indicator_slot)
        tab_indicator_slot.c();
    },
    l(nodes) {
      if (tab_indicator_slot)
        tab_indicator_slot.l(nodes);
    },
    m(target, anchor) {
      if (tab_indicator_slot) {
        tab_indicator_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (tab_indicator_slot) {
        if (tab_indicator_slot.p && (!current || dirty[1] & 32)) {
          update_slot_base(tab_indicator_slot, tab_indicator_slot_template, ctx2, ctx2[36], !current ? get_all_dirty_from_scope(ctx2[36]) : get_slot_changes(tab_indicator_slot_template, ctx2[36], dirty, get_tab_indicator_slot_changes), get_tab_indicator_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(tab_indicator_slot, local);
      current = true;
    },
    o(local) {
      transition_out(tab_indicator_slot, local);
      current = false;
    },
    d(detaching) {
      if (tab_indicator_slot)
        tab_indicator_slot.d(detaching);
    }
  };
}
function create_if_block$4(ctx) {
  let tabindicator;
  let current;
  const tabindicator_spread_levels = [
    { active: ctx[18] },
    prefixFilter(ctx[24], "tabIndicator$")
  ];
  let tabindicator_props = {
    $$slots: { default: [create_default_slot_1$1] },
    $$scope: { ctx }
  };
  for (let i = 0; i < tabindicator_spread_levels.length; i += 1) {
    tabindicator_props = assign(tabindicator_props, tabindicator_spread_levels[i]);
  }
  tabindicator = new TabIndicator({ props: tabindicator_props });
  ctx[33](tabindicator);
  return {
    c() {
      create_component(tabindicator.$$.fragment);
    },
    l(nodes) {
      claim_component(tabindicator.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(tabindicator, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const tabindicator_changes = dirty[0] & 17039360 ? get_spread_update(tabindicator_spread_levels, [
        dirty[0] & 262144 && { active: ctx2[18] },
        dirty[0] & 16777216 && get_spread_object(prefixFilter(ctx2[24], "tabIndicator$"))
      ]) : {};
      if (dirty[1] & 32) {
        tabindicator_changes.$$scope = { dirty, ctx: ctx2 };
      }
      tabindicator.$set(tabindicator_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(tabindicator.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tabindicator.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[33](null);
      destroy_component(tabindicator, detaching);
    }
  };
}
function create_default_slot_1$1(ctx) {
  let current;
  const tab_indicator_slot_template = ctx[30]["tab-indicator"];
  const tab_indicator_slot = create_slot(tab_indicator_slot_template, ctx, ctx[36], get_tab_indicator_slot_context_1);
  return {
    c() {
      if (tab_indicator_slot)
        tab_indicator_slot.c();
    },
    l(nodes) {
      if (tab_indicator_slot)
        tab_indicator_slot.l(nodes);
    },
    m(target, anchor) {
      if (tab_indicator_slot) {
        tab_indicator_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (tab_indicator_slot) {
        if (tab_indicator_slot.p && (!current || dirty[1] & 32)) {
          update_slot_base(tab_indicator_slot, tab_indicator_slot_template, ctx2, ctx2[36], !current ? get_all_dirty_from_scope(ctx2[36]) : get_slot_changes(tab_indicator_slot_template, ctx2[36], dirty, get_tab_indicator_slot_changes_1), get_tab_indicator_slot_context_1);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(tab_indicator_slot, local);
      current = true;
    },
    o(local) {
      transition_out(tab_indicator_slot, local);
      current = false;
    },
    d(detaching) {
      if (tab_indicator_slot)
        tab_indicator_slot.d(detaching);
    }
  };
}
function create_default_slot$4(ctx) {
  let span0;
  let t0;
  let span0_class_value;
  let useActions_action;
  let t1;
  let t2;
  let span1;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[30].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[36], null);
  let if_block0 = ctx[6] && create_if_block_1$1(ctx);
  let span0_levels = [
    {
      class: span0_class_value = classMap({
        [ctx[9]]: true,
        "mdc-tab__content": true
      })
    },
    prefixFilter(ctx[24], "content$")
  ];
  let span0_data = {};
  for (let i = 0; i < span0_levels.length; i += 1) {
    span0_data = assign(span0_data, span0_levels[i]);
  }
  let if_block1 = !ctx[6] && create_if_block$4(ctx);
  return {
    c() {
      span0 = element("span");
      if (default_slot)
        default_slot.c();
      t0 = space();
      if (if_block0)
        if_block0.c();
      t1 = space();
      if (if_block1)
        if_block1.c();
      t2 = space();
      span1 = element("span");
      this.h();
    },
    l(nodes) {
      span0 = claim_element(nodes, "SPAN", { class: true });
      var span0_nodes = children(span0);
      if (default_slot)
        default_slot.l(span0_nodes);
      t0 = claim_space(span0_nodes);
      if (if_block0)
        if_block0.l(span0_nodes);
      span0_nodes.forEach(detach);
      t1 = claim_space(nodes);
      if (if_block1)
        if_block1.l(nodes);
      t2 = claim_space(nodes);
      span1 = claim_element(nodes, "SPAN", { class: true });
      children(span1).forEach(detach);
      this.h();
    },
    h() {
      set_attributes(span0, span0_data);
      attr(span1, "class", "mdc-tab__ripple");
    },
    m(target, anchor) {
      insert_hydration(target, span0, anchor);
      if (default_slot) {
        default_slot.m(span0, null);
      }
      append_hydration(span0, t0);
      if (if_block0)
        if_block0.m(span0, null);
      ctx[32](span0);
      insert_hydration(target, t1, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert_hydration(target, t2, anchor);
      insert_hydration(target, span1, anchor);
      current = true;
      if (!mounted) {
        dispose = action_destroyer(useActions_action = useActions.call(null, span0, ctx[8]));
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[36], !current ? get_all_dirty_from_scope(ctx2[36]) : get_slot_changes(default_slot_template, ctx2[36], dirty, null), null);
        }
      }
      if (ctx2[6]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & 64) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(span0, null);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      set_attributes(span0, span0_data = get_spread_update(span0_levels, [
        (!current || dirty[0] & 512 && span0_class_value !== (span0_class_value = classMap({
          [ctx2[9]]: true,
          "mdc-tab__content": true
        }))) && { class: span0_class_value },
        dirty[0] & 16777216 && prefixFilter(ctx2[24], "content$")
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty[0] & 256)
        useActions_action.update.call(null, ctx2[8]);
      if (!ctx2[6]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & 64) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$4(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(t2.parentNode, t2);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(span0);
      if (default_slot)
        default_slot.d(detaching);
      if (if_block0)
        if_block0.d();
      ctx[32](null);
      if (detaching)
        detach(t1);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(span1);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$g(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    {
      use: [
        [
          Ripple,
          {
            ripple: ctx[3],
            unbounded: false,
            addClass: ctx[21],
            removeClass: ctx[22],
            addStyle: ctx[23]
          }
        ],
        ctx[20],
        ...ctx[0]
      ]
    },
    {
      class: classMap(__spreadValues({
        [ctx[1]]: true,
        "mdc-tab": true,
        "mdc-tab--active": ctx[18],
        "mdc-tab--stacked": ctx[4],
        "mdc-tab--min-width": ctx[5]
      }, ctx[15]))
    },
    {
      style: Object.entries(ctx[16]).map(func$5).concat([ctx[2]]).join(" ")
    },
    { role: "tab" },
    {
      "aria-selected": ctx[18] ? "true" : "false"
    },
    {
      tabindex: ctx[18] || ctx[19] ? "0" : "-1"
    },
    { href: ctx[7] },
    ctx[17],
    exclude(ctx[24], ["content$", "tabIndicator$"])
  ];
  var switch_value = ctx[10];
  function switch_props(ctx2) {
    let switch_instance_props = {
      $$slots: { default: [create_default_slot$4] },
      $$scope: { ctx: ctx2 }
    };
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props(ctx));
    ctx[34](switch_instance);
    switch_instance.$on("click", ctx[35]);
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l(nodes) {
      if (switch_instance)
        claim_component(switch_instance.$$.fragment, nodes);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }
      insert_hydration(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const switch_instance_changes = dirty[0] & 33521855 ? get_spread_update(switch_instance_spread_levels, [
        dirty[0] & 15728649 && {
          use: [
            [
              Ripple,
              {
                ripple: ctx2[3],
                unbounded: false,
                addClass: ctx2[21],
                removeClass: ctx2[22],
                addStyle: ctx2[23]
              }
            ],
            ctx2[20],
            ...ctx2[0]
          ]
        },
        dirty[0] & 294962 && {
          class: classMap(__spreadValues({
            [ctx2[1]]: true,
            "mdc-tab": true,
            "mdc-tab--active": ctx2[18],
            "mdc-tab--stacked": ctx2[4],
            "mdc-tab--min-width": ctx2[5]
          }, ctx2[15]))
        },
        dirty[0] & 65540 && {
          style: Object.entries(ctx2[16]).map(func$5).concat([ctx2[2]]).join(" ")
        },
        switch_instance_spread_levels[3],
        dirty[0] & 262144 && {
          "aria-selected": ctx2[18] ? "true" : "false"
        },
        dirty[0] & 786432 && {
          tabindex: ctx2[18] || ctx2[19] ? "0" : "-1"
        },
        dirty[0] & 128 && { href: ctx2[7] },
        dirty[0] & 131072 && get_spread_object(ctx2[17]),
        dirty[0] & 16777216 && get_spread_object(exclude(ctx2[24], ["content$", "tabIndicator$"]))
      ]) : {};
      if (dirty[0] & 17064768 | dirty[1] & 32) {
        switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (switch_value !== (switch_value = ctx2[10])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = new switch_value(switch_props(ctx2));
          ctx2[34](switch_instance);
          switch_instance.$on("click", ctx2[35]);
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[34](null);
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
const func$5 = ([name, value]) => `${name}: ${value};`;
function instance_1$6($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "use",
    "class",
    "style",
    "tab",
    "ripple",
    "stacked",
    "minWidth",
    "indicatorSpanOnlyContent",
    "href",
    "content$use",
    "content$class",
    "component",
    "activate",
    "deactivate",
    "focus",
    "getElement"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { tab: tabId } = $$props;
  let { ripple = true } = $$props;
  let { stacked = false } = $$props;
  let { minWidth = false } = $$props;
  let { indicatorSpanOnlyContent = false } = $$props;
  let { href = void 0 } = $$props;
  let { content$use = [] } = $$props;
  let { content$class = "" } = $$props;
  let element2;
  let instance2;
  let content;
  let tabIndicator;
  let internalClasses = {};
  let internalStyles = {};
  let internalAttrs = {};
  let focusOnActivate = getContext("SMUI:tab:focusOnActivate");
  let active = tabId === getContext("SMUI:tab:initialActive");
  let forceAccessible = false;
  let { component = href == null ? Button : A } = $$props;
  setContext("SMUI:label:context", "tab");
  setContext("SMUI:icon:context", "tab");
  if (!tabId) {
    throw new Error("The tab property is required! It should be passed down from the TabBar to the Tab.");
  }
  onMount(() => {
    $$invalidate(11, instance2 = new MDCTabFoundation({
      setAttr: addAttr,
      addClass,
      removeClass,
      hasClass,
      activateIndicator: (previousIndicatorClientRect) => tabIndicator.activate(previousIndicatorClientRect),
      deactivateIndicator: () => tabIndicator.deactivate(),
      notifyInteracted: () => dispatch(getElement(), "SMUITab:interacted", { tabId }, void 0, true),
      getOffsetLeft: () => getElement().offsetLeft,
      getOffsetWidth: () => getElement().offsetWidth,
      getContentOffsetLeft: () => content.offsetLeft,
      getContentOffsetWidth: () => content.offsetWidth,
      focus
    }));
    const accessor = {
      tabId,
      get element() {
        return getElement();
      },
      get active() {
        return active;
      },
      forceAccessible(accessible) {
        $$invalidate(19, forceAccessible = accessible);
      },
      computeIndicatorClientRect: () => tabIndicator.computeContentClientRect(),
      computeDimensions: () => instance2.computeDimensions(),
      focus,
      activate,
      deactivate
    };
    dispatch(getElement(), "SMUITab:mount", accessor);
    instance2.init();
    return () => {
      dispatch(getElement(), "SMUITab:unmount", accessor);
      instance2.destroy();
    };
  });
  function hasClass(className2) {
    return className2 in internalClasses ? internalClasses[className2] : getElement().classList.contains(className2);
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      $$invalidate(15, internalClasses[className2] = true, internalClasses);
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      $$invalidate(15, internalClasses[className2] = false, internalClasses);
    }
  }
  function addStyle(name, value) {
    if (internalStyles[name] != value) {
      if (value === "" || value == null) {
        delete internalStyles[name];
        $$invalidate(16, internalStyles);
      } else {
        $$invalidate(16, internalStyles[name] = value, internalStyles);
      }
    }
  }
  function addAttr(name, value) {
    if (internalAttrs[name] !== value) {
      $$invalidate(17, internalAttrs[name] = value, internalAttrs);
    }
  }
  function activate(previousIndicatorClientRect, skipFocus) {
    $$invalidate(18, active = true);
    if (skipFocus) {
      instance2.setFocusOnActivate(false);
    }
    instance2.activate(previousIndicatorClientRect);
    if (skipFocus) {
      instance2.setFocusOnActivate(focusOnActivate);
    }
  }
  function deactivate() {
    $$invalidate(18, active = false);
    instance2.deactivate();
  }
  function focus() {
    getElement().focus();
  }
  function getElement() {
    return element2.getElement();
  }
  function tabindicator_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      tabIndicator = $$value;
      $$invalidate(14, tabIndicator);
    });
  }
  function span0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      content = $$value;
      $$invalidate(13, content);
    });
  }
  function tabindicator_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      tabIndicator = $$value;
      $$invalidate(14, tabIndicator);
    });
  }
  function switch_instance_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(12, element2);
    });
  }
  const click_handler = () => instance2 && instance2.handleClick();
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(24, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("style" in $$new_props)
      $$invalidate(2, style = $$new_props.style);
    if ("tab" in $$new_props)
      $$invalidate(25, tabId = $$new_props.tab);
    if ("ripple" in $$new_props)
      $$invalidate(3, ripple = $$new_props.ripple);
    if ("stacked" in $$new_props)
      $$invalidate(4, stacked = $$new_props.stacked);
    if ("minWidth" in $$new_props)
      $$invalidate(5, minWidth = $$new_props.minWidth);
    if ("indicatorSpanOnlyContent" in $$new_props)
      $$invalidate(6, indicatorSpanOnlyContent = $$new_props.indicatorSpanOnlyContent);
    if ("href" in $$new_props)
      $$invalidate(7, href = $$new_props.href);
    if ("content$use" in $$new_props)
      $$invalidate(8, content$use = $$new_props.content$use);
    if ("content$class" in $$new_props)
      $$invalidate(9, content$class = $$new_props.content$class);
    if ("component" in $$new_props)
      $$invalidate(10, component = $$new_props.component);
    if ("$$scope" in $$new_props)
      $$invalidate(36, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 2048) {
      if (instance2) {
        instance2.setFocusOnActivate(focusOnActivate);
      }
    }
  };
  return [
    use,
    className,
    style,
    ripple,
    stacked,
    minWidth,
    indicatorSpanOnlyContent,
    href,
    content$use,
    content$class,
    component,
    instance2,
    element2,
    content,
    tabIndicator,
    internalClasses,
    internalStyles,
    internalAttrs,
    active,
    forceAccessible,
    forwardEvents,
    addClass,
    removeClass,
    addStyle,
    $$restProps,
    tabId,
    activate,
    deactivate,
    focus,
    getElement,
    slots,
    tabindicator_binding,
    span0_binding,
    tabindicator_binding_1,
    switch_instance_binding,
    click_handler,
    $$scope
  ];
}
class Tab extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1$6, create_fragment$g, safe_not_equal, {
      use: 0,
      class: 1,
      style: 2,
      tab: 25,
      ripple: 3,
      stacked: 4,
      minWidth: 5,
      indicatorSpanOnlyContent: 6,
      href: 7,
      content$use: 8,
      content$class: 9,
      component: 10,
      activate: 26,
      deactivate: 27,
      focus: 28,
      getElement: 29
    }, null, [-1, -1]);
  }
  get activate() {
    return this.$$.ctx[26];
  }
  get deactivate() {
    return this.$$.ctx[27];
  }
  get focus() {
    return this.$$.ctx[28];
  }
  get getElement() {
    return this.$$.ctx[29];
  }
}
function create_default_slot$3(ctx) {
  let current;
  const default_slot_template = ctx[9].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[11], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2048)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(default_slot_template, ctx2[11], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$f(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    {
      use: [ctx[4], ...ctx[0]]
    },
    {
      class: classMap({
        [ctx[1]]: true,
        "mdc-button__label": ctx[5] === "button",
        "mdc-fab__label": ctx[5] === "fab",
        "mdc-tab__text-label": ctx[5] === "tab",
        "mdc-image-list__label": ctx[5] === "image-list",
        "mdc-snackbar__label": ctx[5] === "snackbar",
        "mdc-banner__text": ctx[5] === "banner",
        "mdc-segmented-button__label": ctx[5] === "segmented-button",
        "mdc-data-table__pagination-rows-per-page-label": ctx[5] === "data-table:pagination",
        "mdc-data-table__header-cell-label": ctx[5] === "data-table:sortable-header-cell"
      })
    },
    ctx[5] === "snackbar" ? { "aria-atomic": "false" } : {},
    { tabindex: ctx[6] },
    ctx[7]
  ];
  var switch_value = ctx[2];
  function switch_props(ctx2) {
    let switch_instance_props = {
      $$slots: { default: [create_default_slot$3] },
      $$scope: { ctx: ctx2 }
    };
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props(ctx));
    ctx[10](switch_instance);
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l(nodes) {
      if (switch_instance)
        claim_component(switch_instance.$$.fragment, nodes);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }
      insert_hydration(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const switch_instance_changes = dirty & 243 ? get_spread_update(switch_instance_spread_levels, [
        dirty & 17 && {
          use: [ctx2[4], ...ctx2[0]]
        },
        dirty & 34 && {
          class: classMap({
            [ctx2[1]]: true,
            "mdc-button__label": ctx2[5] === "button",
            "mdc-fab__label": ctx2[5] === "fab",
            "mdc-tab__text-label": ctx2[5] === "tab",
            "mdc-image-list__label": ctx2[5] === "image-list",
            "mdc-snackbar__label": ctx2[5] === "snackbar",
            "mdc-banner__text": ctx2[5] === "banner",
            "mdc-segmented-button__label": ctx2[5] === "segmented-button",
            "mdc-data-table__pagination-rows-per-page-label": ctx2[5] === "data-table:pagination",
            "mdc-data-table__header-cell-label": ctx2[5] === "data-table:sortable-header-cell"
          })
        },
        dirty & 32 && get_spread_object(ctx2[5] === "snackbar" ? { "aria-atomic": "false" } : {}),
        dirty & 64 && { tabindex: ctx2[6] },
        dirty & 128 && get_spread_object(ctx2[7])
      ]) : {};
      if (dirty & 2048) {
        switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (switch_value !== (switch_value = ctx2[2])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = new switch_value(switch_props(ctx2));
          ctx2[10](switch_instance);
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[10](null);
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "class", "component", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let element2;
  let { component = Span$1 } = $$props;
  const context = getContext("SMUI:label:context");
  const tabindex = getContext("SMUI:label:tabindex");
  function getElement() {
    return element2.getElement();
  }
  function switch_instance_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(3, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("component" in $$new_props)
      $$invalidate(2, component = $$new_props.component);
    if ("$$scope" in $$new_props)
      $$invalidate(11, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    className,
    component,
    element2,
    forwardEvents,
    context,
    tabindex,
    $$restProps,
    getElement,
    slots,
    switch_instance_binding,
    $$scope
  ];
}
class CommonLabel extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$f, safe_not_equal, {
      use: 0,
      class: 1,
      component: 2,
      getElement: 8
    });
  }
  get getElement() {
    return this.$$.ctx[8];
  }
}
function create_fragment$e(ctx) {
  let current;
  const default_slot_template = ctx[4].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[3], !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let $storeValue;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { key } = $$props;
  let { value } = $$props;
  const storeValue = writable(value);
  component_subscribe($$self, storeValue, (value2) => $$invalidate(5, $storeValue = value2));
  setContext(key, storeValue);
  onDestroy(() => {
    storeValue.set(void 0);
  });
  $$self.$$set = ($$props2) => {
    if ("key" in $$props2)
      $$invalidate(1, key = $$props2.key);
    if ("value" in $$props2)
      $$invalidate(2, value = $$props2.value);
    if ("$$scope" in $$props2)
      $$invalidate(3, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 4) {
      set_store_value(storeValue, $storeValue = value, $storeValue);
    }
  };
  return [storeValue, key, value, $$scope, slots];
}
class ContextFragment extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$e, safe_not_equal, { key: 1, value: 2 });
  }
}
const Label = CommonLabel;
/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$5 = {
  INDETERMINATE_CLASS: "mdc-circular-progress--indeterminate",
  CLOSED_CLASS: "mdc-circular-progress--closed"
};
var strings$3 = {
  ARIA_HIDDEN: "aria-hidden",
  ARIA_VALUENOW: "aria-valuenow",
  DETERMINATE_CIRCLE_SELECTOR: ".mdc-circular-progress__determinate-circle",
  RADIUS: "r",
  STROKE_DASHOFFSET: "stroke-dashoffset"
};
/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCCircularProgressFoundation = function(_super) {
  __extends(MDCCircularProgressFoundation2, _super);
  function MDCCircularProgressFoundation2(adapter) {
    return _super.call(this, __assign(__assign({}, MDCCircularProgressFoundation2.defaultAdapter), adapter)) || this;
  }
  Object.defineProperty(MDCCircularProgressFoundation2, "cssClasses", {
    get: function() {
      return cssClasses$5;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCCircularProgressFoundation2, "strings", {
    get: function() {
      return strings$3;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCCircularProgressFoundation2, "defaultAdapter", {
    get: function() {
      return {
        addClass: function() {
          return void 0;
        },
        getDeterminateCircleAttribute: function() {
          return null;
        },
        hasClass: function() {
          return false;
        },
        removeClass: function() {
          return void 0;
        },
        removeAttribute: function() {
          return void 0;
        },
        setAttribute: function() {
          return void 0;
        },
        setDeterminateCircleAttribute: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCCircularProgressFoundation2.prototype.init = function() {
    this.closed = this.adapter.hasClass(cssClasses$5.CLOSED_CLASS);
    this.determinate = !this.adapter.hasClass(cssClasses$5.INDETERMINATE_CLASS);
    this.progress = 0;
    if (this.determinate) {
      this.adapter.setAttribute(strings$3.ARIA_VALUENOW, this.progress.toString());
    }
    this.radius = Number(this.adapter.getDeterminateCircleAttribute(strings$3.RADIUS));
  };
  MDCCircularProgressFoundation2.prototype.setDeterminate = function(determinate) {
    this.determinate = determinate;
    if (this.determinate) {
      this.adapter.removeClass(cssClasses$5.INDETERMINATE_CLASS);
      this.setProgress(this.progress);
    } else {
      this.adapter.addClass(cssClasses$5.INDETERMINATE_CLASS);
      this.adapter.removeAttribute(strings$3.ARIA_VALUENOW);
    }
  };
  MDCCircularProgressFoundation2.prototype.isDeterminate = function() {
    return this.determinate;
  };
  MDCCircularProgressFoundation2.prototype.setProgress = function(value) {
    this.progress = value;
    if (this.determinate) {
      var unfilledArcLength = (1 - this.progress) * (2 * Math.PI * this.radius);
      this.adapter.setDeterminateCircleAttribute(strings$3.STROKE_DASHOFFSET, "" + unfilledArcLength);
      this.adapter.setAttribute(strings$3.ARIA_VALUENOW, this.progress.toString());
    }
  };
  MDCCircularProgressFoundation2.prototype.getProgress = function() {
    return this.progress;
  };
  MDCCircularProgressFoundation2.prototype.open = function() {
    this.closed = false;
    this.adapter.removeClass(cssClasses$5.CLOSED_CLASS);
    this.adapter.removeAttribute(strings$3.ARIA_HIDDEN);
  };
  MDCCircularProgressFoundation2.prototype.close = function() {
    this.closed = true;
    this.adapter.addClass(cssClasses$5.CLOSED_CLASS);
    this.adapter.setAttribute(strings$3.ARIA_HIDDEN, "true");
  };
  MDCCircularProgressFoundation2.prototype.isClosed = function() {
    return this.closed;
  };
  return MDCCircularProgressFoundation2;
}(MDCFoundation);
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[24] = list[i];
  return child_ctx;
}
function create_each_block(ctx) {
  let div3;
  let div0;
  let svg0;
  let circle0;
  let t0;
  let div1;
  let svg1;
  let circle1;
  let t1;
  let div2;
  let svg2;
  let circle2;
  let t2;
  let div3_class_value;
  return {
    c() {
      div3 = element("div");
      div0 = element("div");
      svg0 = svg_element("svg");
      circle0 = svg_element("circle");
      t0 = space();
      div1 = element("div");
      svg1 = svg_element("svg");
      circle1 = svg_element("circle");
      t1 = space();
      div2 = element("div");
      svg2 = svg_element("svg");
      circle2 = svg_element("circle");
      t2 = space();
      this.h();
    },
    l(nodes) {
      div3 = claim_element(nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      div0 = claim_element(div3_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      svg0 = claim_svg_element(div0_nodes, "svg", { class: true, viewBox: true, xmlns: true });
      var svg0_nodes = children(svg0);
      circle0 = claim_svg_element(svg0_nodes, "circle", {
        cx: true,
        cy: true,
        r: true,
        "stroke-dasharray": true,
        "stroke-dashoffset": true,
        "stroke-width": true
      });
      children(circle0).forEach(detach);
      svg0_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      t0 = claim_space(div3_nodes);
      div1 = claim_element(div3_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      svg1 = claim_svg_element(div1_nodes, "svg", { class: true, viewBox: true, xmlns: true });
      var svg1_nodes = children(svg1);
      circle1 = claim_svg_element(svg1_nodes, "circle", {
        cx: true,
        cy: true,
        r: true,
        "stroke-dasharray": true,
        "stroke-dashoffset": true,
        "stroke-width": true
      });
      children(circle1).forEach(detach);
      svg1_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      t1 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      svg2 = claim_svg_element(div2_nodes, "svg", { class: true, viewBox: true, xmlns: true });
      var svg2_nodes = children(svg2);
      circle2 = claim_svg_element(svg2_nodes, "circle", {
        cx: true,
        cy: true,
        r: true,
        "stroke-dasharray": true,
        "stroke-dashoffset": true,
        "stroke-width": true
      });
      children(circle2).forEach(detach);
      svg2_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      t2 = claim_space(div3_nodes);
      div3_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(circle0, "cx", "24");
      attr(circle0, "cy", "24");
      attr(circle0, "r", "18");
      attr(circle0, "stroke-dasharray", "113.097");
      attr(circle0, "stroke-dashoffset", "56.549");
      attr(circle0, "stroke-width", "4");
      attr(svg0, "class", "mdc-circular-progress__indeterminate-circle-graphic");
      attr(svg0, "viewBox", "0 0 48 48");
      attr(svg0, "xmlns", "http://www.w3.org/2000/svg");
      attr(div0, "class", "mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left");
      attr(circle1, "cx", "24");
      attr(circle1, "cy", "24");
      attr(circle1, "r", "18");
      attr(circle1, "stroke-dasharray", "113.097");
      attr(circle1, "stroke-dashoffset", "56.549");
      attr(circle1, "stroke-width", "3.2");
      attr(svg1, "class", "mdc-circular-progress__indeterminate-circle-graphic");
      attr(svg1, "viewBox", "0 0 48 48");
      attr(svg1, "xmlns", "http://www.w3.org/2000/svg");
      attr(div1, "class", "mdc-circular-progress__gap-patch");
      attr(circle2, "cx", "24");
      attr(circle2, "cy", "24");
      attr(circle2, "r", "18");
      attr(circle2, "stroke-dasharray", "113.097");
      attr(circle2, "stroke-dashoffset", "56.549");
      attr(circle2, "stroke-width", "4");
      attr(svg2, "class", "mdc-circular-progress__indeterminate-circle-graphic");
      attr(svg2, "viewBox", "0 0 48 48");
      attr(svg2, "xmlns", "http://www.w3.org/2000/svg");
      attr(div2, "class", "mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right");
      attr(div3, "class", div3_class_value = classMap({
        [ctx[1]]: true,
        "mdc-circular-progress__spinner-layer": true,
        ["mdc-circular-progress__color-" + ctx[24]]: ctx[5]
      }));
    },
    m(target, anchor) {
      insert_hydration(target, div3, anchor);
      append_hydration(div3, div0);
      append_hydration(div0, svg0);
      append_hydration(svg0, circle0);
      append_hydration(div3, t0);
      append_hydration(div3, div1);
      append_hydration(div1, svg1);
      append_hydration(svg1, circle1);
      append_hydration(div3, t1);
      append_hydration(div3, div2);
      append_hydration(div2, svg2);
      append_hydration(svg2, circle2);
      append_hydration(div3, t2);
    },
    p(ctx2, dirty) {
      if (dirty & 34 && div3_class_value !== (div3_class_value = classMap({
        [ctx2[1]]: true,
        "mdc-circular-progress__spinner-layer": true,
        ["mdc-circular-progress__color-" + ctx2[24]]: ctx2[5]
      }))) {
        attr(div3, "class", div3_class_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div3);
    }
  };
}
function create_fragment$d(ctx) {
  let div2;
  let div0;
  let svg;
  let circle0;
  let circle1;
  let t;
  let div1;
  let div2_class_value;
  let div2_aria_valuemin_value;
  let div2_aria_valuemax_value;
  let div2_aria_valuenow_value;
  let useActions_action;
  let mounted;
  let dispose;
  let circle1_levels = [
    {
      class: "mdc-circular-progress__determinate-circle"
    },
    { cx: "24" },
    { cy: "24" },
    { r: "18" },
    { "stroke-dasharray": "113.097" },
    { "stroke-dashoffset": "113.097" },
    { "stroke-width": "4" },
    ctx[9]
  ];
  let circle1_data = {};
  for (let i = 0; i < circle1_levels.length; i += 1) {
    circle1_data = assign(circle1_data, circle1_levels[i]);
  }
  let each_value = ctx[5] ? [1, 2, 3, 4] : [1];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  let div2_levels = [
    {
      class: div2_class_value = classMap(__spreadValues({
        [ctx[1]]: true,
        "mdc-circular-progress": true,
        "mdc-circular-progress--indeterminate": ctx[2],
        "mdc-circular-progress--closed": ctx[3]
      }, ctx[7]))
    },
    { role: "progressbar" },
    {
      "aria-valuemin": div2_aria_valuemin_value = 0
    },
    {
      "aria-valuemax": div2_aria_valuemax_value = 1
    },
    {
      "aria-valuenow": div2_aria_valuenow_value = ctx[2] ? void 0 : ctx[4]
    },
    ctx[8],
    ctx[12]
  ];
  let div2_data = {};
  for (let i = 0; i < div2_levels.length; i += 1) {
    div2_data = assign(div2_data, div2_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      svg = svg_element("svg");
      circle0 = svg_element("circle");
      circle1 = svg_element("circle");
      t = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", {
        class: true,
        role: true,
        "aria-valuemin": true,
        "aria-valuemax": true,
        "aria-valuenow": true
      });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      svg = claim_svg_element(div0_nodes, "svg", { class: true, viewBox: true, xmlns: true });
      var svg_nodes = children(svg);
      circle0 = claim_svg_element(svg_nodes, "circle", {
        class: true,
        cx: true,
        cy: true,
        r: true,
        "stroke-width": true
      });
      children(circle0).forEach(detach);
      circle1 = claim_svg_element(svg_nodes, "circle", {
        class: true,
        cx: true,
        cy: true,
        r: true,
        "stroke-dasharray": true,
        "stroke-dashoffset": true,
        "stroke-width": true
      });
      children(circle1).forEach(detach);
      svg_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      t = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div1_nodes);
      }
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(circle0, "class", "mdc-circular-progress__determinate-track");
      attr(circle0, "cx", "24");
      attr(circle0, "cy", "24");
      attr(circle0, "r", "18");
      attr(circle0, "stroke-width", "4");
      set_svg_attributes(circle1, circle1_data);
      attr(svg, "class", "mdc-circular-progress__determinate-circle-graphic");
      attr(svg, "viewBox", "0 0 48 48");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(div0, "class", "mdc-circular-progress__determinate-container");
      attr(div1, "class", "mdc-circular-progress__indeterminate-container");
      set_attributes(div2, div2_data);
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div0, svg);
      append_hydration(svg, circle0);
      append_hydration(svg, circle1);
      ctx[15](circle1);
      append_hydration(div2, t);
      append_hydration(div2, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div1, null);
      }
      ctx[16](div2);
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div2, ctx[0])),
          action_destroyer(ctx[11].call(null, div2))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      set_svg_attributes(circle1, circle1_data = get_spread_update(circle1_levels, [
        {
          class: "mdc-circular-progress__determinate-circle"
        },
        { cx: "24" },
        { cy: "24" },
        { r: "18" },
        { "stroke-dasharray": "113.097" },
        { "stroke-dashoffset": "113.097" },
        { "stroke-width": "4" },
        dirty & 512 && ctx2[9]
      ]));
      if (dirty & 34) {
        each_value = ctx2[5] ? [1, 2, 3, 4] : [1];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div1, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      set_attributes(div2, div2_data = get_spread_update(div2_levels, [
        dirty & 142 && div2_class_value !== (div2_class_value = classMap(__spreadValues({
          [ctx2[1]]: true,
          "mdc-circular-progress": true,
          "mdc-circular-progress--indeterminate": ctx2[2],
          "mdc-circular-progress--closed": ctx2[3]
        }, ctx2[7]))) && { class: div2_class_value },
        { role: "progressbar" },
        {
          "aria-valuemin": div2_aria_valuemin_value
        },
        {
          "aria-valuemax": div2_aria_valuemax_value
        },
        dirty & 20 && div2_aria_valuenow_value !== (div2_aria_valuenow_value = ctx2[2] ? void 0 : ctx2[4]) && {
          "aria-valuenow": div2_aria_valuenow_value
        },
        dirty & 256 && ctx2[8],
        dirty & 4096 && ctx2[12]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div2);
      ctx[15](null);
      destroy_each(each_blocks, detaching);
      ctx[16](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance_1$5($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "class", "indeterminate", "closed", "progress", "fourColor", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { indeterminate = false } = $$props;
  let { closed = false } = $$props;
  let { progress = 0 } = $$props;
  let { fourColor = false } = $$props;
  let element2;
  let instance2;
  let internalClasses = {};
  let internalAttrs = {};
  let determinateCircleAttrs = {};
  let determinateCircle;
  onMount(() => {
    $$invalidate(14, instance2 = new MDCCircularProgressFoundation({
      addClass,
      getDeterminateCircleAttribute: getDeterminateCircleAttr,
      hasClass,
      removeClass,
      removeAttribute: removeAttr,
      setAttribute: addAttr,
      setDeterminateCircleAttribute: addDeterminateCircleAttr
    }));
    instance2.init();
    return () => {
      instance2.destroy();
    };
  });
  function hasClass(className2) {
    return className2 in internalClasses ? internalClasses[className2] : getElement().classList.contains(className2);
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      $$invalidate(7, internalClasses[className2] = true, internalClasses);
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      $$invalidate(7, internalClasses[className2] = false, internalClasses);
    }
  }
  function addAttr(name, value) {
    if (internalAttrs[name] !== value) {
      $$invalidate(8, internalAttrs[name] = value, internalAttrs);
    }
  }
  function removeAttr(name) {
    if (!(name in internalAttrs) || internalAttrs[name] != null) {
      $$invalidate(8, internalAttrs[name] = void 0, internalAttrs);
    }
  }
  function getDeterminateCircleAttr(name) {
    var _a;
    return name in determinateCircleAttrs ? (_a = determinateCircleAttrs[name]) !== null && _a !== void 0 ? _a : null : determinateCircle.getAttribute(name);
  }
  function addDeterminateCircleAttr(name, value) {
    if (determinateCircleAttrs[name] !== value) {
      $$invalidate(9, determinateCircleAttrs[name] = value, determinateCircleAttrs);
    }
  }
  function getElement() {
    return element2;
  }
  function circle1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      determinateCircle = $$value;
      $$invalidate(10, determinateCircle);
    });
  }
  function div2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(6, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("indeterminate" in $$new_props)
      $$invalidate(2, indeterminate = $$new_props.indeterminate);
    if ("closed" in $$new_props)
      $$invalidate(3, closed = $$new_props.closed);
    if ("progress" in $$new_props)
      $$invalidate(4, progress = $$new_props.progress);
    if ("fourColor" in $$new_props)
      $$invalidate(5, fourColor = $$new_props.fourColor);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 16388) {
      if (instance2 && instance2.isDeterminate() !== !indeterminate) {
        instance2.setDeterminate(!indeterminate);
      }
    }
    if ($$self.$$.dirty & 16400) {
      if (instance2 && instance2.getProgress() !== progress) {
        instance2.setProgress(progress);
      }
    }
    if ($$self.$$.dirty & 16392) {
      if (instance2) {
        if (closed) {
          instance2.close();
        } else {
          instance2.open();
        }
      }
    }
  };
  return [
    use,
    className,
    indeterminate,
    closed,
    progress,
    fourColor,
    element2,
    internalClasses,
    internalAttrs,
    determinateCircleAttrs,
    determinateCircle,
    forwardEvents,
    $$restProps,
    getElement,
    instance2,
    circle1_binding,
    div2_binding
  ];
}
class CircularProgress extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1$5, create_fragment$d, safe_not_equal, {
      use: 0,
      class: 1,
      indeterminate: 2,
      closed: 3,
      progress: 4,
      fourColor: 5,
      getElement: 13
    });
  }
  get getElement() {
    return this.$$.ctx[13];
  }
}
function create_fragment$c(ctx) {
  let div;
  let div_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[12].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[11], null);
  let div_levels = [
    {
      class: div_class_value = classMap({
        [ctx[1]]: true,
        "smui-paper": true,
        "smui-paper--raised": ctx[2] === "raised",
        "smui-paper--unelevated": ctx[2] === "unelevated",
        "smui-paper--outlined": ctx[2] === "outlined",
        ["smui-paper--elevation-z" + ctx[5]]: ctx[5] !== 0 && ctx[2] === "raised",
        "smui-paper--rounded": !ctx[3],
        ["smui-paper--color-" + ctx[4]]: ctx[4] !== "default",
        "smui-paper-transition": ctx[6]
      })
    },
    ctx[9]
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[13](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div, ctx[0])),
          action_destroyer(ctx[8].call(null, div))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2048)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(default_slot_template, ctx2[11], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        (!current || dirty & 126 && div_class_value !== (div_class_value = classMap({
          [ctx2[1]]: true,
          "smui-paper": true,
          "smui-paper--raised": ctx2[2] === "raised",
          "smui-paper--unelevated": ctx2[2] === "unelevated",
          "smui-paper--outlined": ctx2[2] === "outlined",
          ["smui-paper--elevation-z" + ctx2[5]]: ctx2[5] !== 0 && ctx2[2] === "raised",
          "smui-paper--rounded": !ctx2[3],
          ["smui-paper--color-" + ctx2[4]]: ctx2[4] !== "default",
          "smui-paper-transition": ctx2[6]
        }))) && { class: div_class_value },
        dirty & 512 && ctx2[9]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
      ctx[13](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "class", "variant", "square", "color", "elevation", "transition", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { variant = "raised" } = $$props;
  let { square = false } = $$props;
  let { color = "default" } = $$props;
  let { elevation = 1 } = $$props;
  let { transition = false } = $$props;
  let element2;
  function getElement() {
    return element2;
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(7, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("variant" in $$new_props)
      $$invalidate(2, variant = $$new_props.variant);
    if ("square" in $$new_props)
      $$invalidate(3, square = $$new_props.square);
    if ("color" in $$new_props)
      $$invalidate(4, color = $$new_props.color);
    if ("elevation" in $$new_props)
      $$invalidate(5, elevation = $$new_props.elevation);
    if ("transition" in $$new_props)
      $$invalidate(6, transition = $$new_props.transition);
    if ("$$scope" in $$new_props)
      $$invalidate(11, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    className,
    variant,
    square,
    color,
    elevation,
    transition,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    div_binding
  ];
}
class Paper extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$c, safe_not_equal, {
      use: 0,
      class: 1,
      variant: 2,
      square: 3,
      color: 4,
      elevation: 5,
      transition: 6,
      getElement: 10
    });
  }
  get getElement() {
    return this.$$.ctx[10];
  }
}
function create_default_slot$2(ctx) {
  let current;
  const default_slot_template = ctx[10].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[12], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 4096)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[12], !current ? get_all_dirty_from_scope(ctx2[12]) : get_slot_changes(default_slot_template, ctx2[12], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$b(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    {
      use: [ctx[7], ...ctx[0]]
    },
    {
      class: classMap(__spreadValues({
        [ctx[1]]: true,
        [ctx[5]]: true
      }, ctx[4]))
    },
    ctx[6],
    ctx[8]
  ];
  var switch_value = ctx[2];
  function switch_props(ctx2) {
    let switch_instance_props = {
      $$slots: { default: [create_default_slot$2] },
      $$scope: { ctx: ctx2 }
    };
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props(ctx));
    ctx[11](switch_instance);
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l(nodes) {
      if (switch_instance)
        claim_component(switch_instance.$$.fragment, nodes);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }
      insert_hydration(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const switch_instance_changes = dirty & 499 ? get_spread_update(switch_instance_spread_levels, [
        dirty & 129 && {
          use: [ctx2[7], ...ctx2[0]]
        },
        dirty & 50 && {
          class: classMap(__spreadValues({
            [ctx2[1]]: true,
            [ctx2[5]]: true
          }, ctx2[4]))
        },
        dirty & 64 && get_spread_object(ctx2[6]),
        dirty & 256 && get_spread_object(ctx2[8])
      ]) : {};
      if (dirty & 4096) {
        switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (switch_value !== (switch_value = ctx2[2])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = new switch_value(switch_props(ctx2));
          ctx2[11](switch_instance);
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[11](null);
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
const internals = {
  component: Div$1,
  class: "",
  classMap: {},
  contexts: {},
  props: {}
};
function instance$6($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "class", "component", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let element2;
  const smuiClass = internals.class;
  const smuiClassMap = {};
  const smuiClassUnsubscribes = [];
  const contexts = internals.contexts;
  const props = internals.props;
  let { component = internals.component } = $$props;
  Object.entries(internals.classMap).forEach(([name, context]) => {
    const store = getContext(context);
    if (store && "subscribe" in store) {
      smuiClassUnsubscribes.push(store.subscribe((value) => {
        $$invalidate(4, smuiClassMap[name] = value, smuiClassMap);
      }));
    }
  });
  const forwardEvents = forwardEventsBuilder(get_current_component());
  for (let context in contexts) {
    if (contexts.hasOwnProperty(context)) {
      setContext(context, contexts[context]);
    }
  }
  onDestroy(() => {
    for (const unsubscribe of smuiClassUnsubscribes) {
      unsubscribe();
    }
  });
  function getElement() {
    return element2.getElement();
  }
  function switch_instance_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(3, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("component" in $$new_props)
      $$invalidate(2, component = $$new_props.component);
    if ("$$scope" in $$new_props)
      $$invalidate(12, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    className,
    component,
    element2,
    smuiClassMap,
    smuiClass,
    props,
    forwardEvents,
    $$restProps,
    getElement,
    slots,
    switch_instance_binding,
    $$scope
  ];
}
class ClassAdder extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$b, safe_not_equal, {
      use: 0,
      class: 1,
      component: 2,
      getElement: 9
    });
  }
  get getElement() {
    return this.$$.ctx[9];
  }
}
const defaults = Object.assign({}, internals);
function classAdderBuilder(props) {
  return new Proxy(ClassAdder, {
    construct: function(target, args) {
      Object.assign(internals, defaults, props);
      return new target(...args);
    },
    get: function(target, prop) {
      Object.assign(internals, defaults, props);
      return target[prop];
    }
  });
}
var Content$1 = classAdderBuilder({
  class: "smui-paper__content",
  component: Div
});
var Title$1 = classAdderBuilder({
  class: "smui-paper__title",
  component: H5
});
classAdderBuilder({
  class: "smui-paper__subtitle",
  component: H6
});
function create_fragment$a(ctx) {
  let div;
  let div_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[9].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[8], null);
  let div_levels = [
    {
      class: div_class_value = classMap({
        [ctx[1]]: true,
        "mdc-card": true,
        "mdc-card--outlined": ctx[2] === "outlined",
        "smui-card--padded": ctx[3]
      })
    },
    ctx[6]
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[10](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div, ctx[0])),
          action_destroyer(ctx[5].call(null, div))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 256)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[8], !current ? get_all_dirty_from_scope(ctx2[8]) : get_slot_changes(default_slot_template, ctx2[8], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        (!current || dirty & 14 && div_class_value !== (div_class_value = classMap({
          [ctx2[1]]: true,
          "mdc-card": true,
          "mdc-card--outlined": ctx2[2] === "outlined",
          "smui-card--padded": ctx2[3]
        }))) && { class: div_class_value },
        dirty & 64 && ctx2[6]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
      ctx[10](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "class", "variant", "padded", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { variant = "raised" } = $$props;
  let { padded = false } = $$props;
  let element2;
  function getElement() {
    return element2;
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(4, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("variant" in $$new_props)
      $$invalidate(2, variant = $$new_props.variant);
    if ("padded" in $$new_props)
      $$invalidate(3, padded = $$new_props.padded);
    if ("$$scope" in $$new_props)
      $$invalidate(8, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    className,
    variant,
    padded,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    div_binding
  ];
}
class Card extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$a, safe_not_equal, {
      use: 0,
      class: 1,
      variant: 2,
      padded: 3,
      getElement: 7
    });
  }
  get getElement() {
    return this.$$.ctx[7];
  }
}
classAdderBuilder({
  class: "smui-card__content",
  component: Div
});
classAdderBuilder({
  class: "mdc-card__media-content",
  component: Div
});
classAdderBuilder({
  class: "mdc-card__action-buttons",
  component: Div
});
classAdderBuilder({
  class: "mdc-card__action-icons",
  component: Div
});
var Title = classAdderBuilder({
  class: "mdc-tooltip__title",
  component: H2
});
var Content = classAdderBuilder({
  class: "mdc-tooltip__content",
  component: Div
});
classAdderBuilder({
  class: "mdc-tooltip__content-link",
  component: A
});
classAdderBuilder({
  class: "mdc-tooltip--rich-actions",
  component: Div,
  contexts: {
    "SMUI:button:context": "tooltip:rich-actions"
  }
});
function create_fragment$9(ctx) {
  let div;
  let div_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", div_class_value = classMap({
        [ctx[1]]: true,
        "mdc-layout-grid__inner": true
      }));
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[7](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div, ctx[0])),
          action_destroyer(ctx[3].call(null, div))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      if (!current || dirty & 2 && div_class_value !== (div_class_value = classMap({
        [ctx2[1]]: true,
        "mdc-layout-grid__inner": true
      }))) {
        attr(div, "class", div_class_value);
      }
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let element2;
  function getElement() {
    return element2;
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(2, element2);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("use" in $$props2)
      $$invalidate(0, use = $$props2.use);
    if ("class" in $$props2)
      $$invalidate(1, className = $$props2.class);
    if ("$$scope" in $$props2)
      $$invalidate(5, $$scope = $$props2.$$scope);
  };
  return [
    use,
    className,
    element2,
    forwardEvents,
    getElement,
    $$scope,
    slots,
    div_binding
  ];
}
class InnerGrid extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$9, safe_not_equal, { use: 0, class: 1, getElement: 4 });
  }
  get getElement() {
    return this.$$.ctx[4];
  }
}
function create_default_slot$1(ctx) {
  let current;
  const default_slot_template = ctx[8].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[10], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 1024)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[10], !current ? get_all_dirty_from_scope(ctx2[10]) : get_slot_changes(default_slot_template, ctx2[10], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$8(ctx) {
  let div;
  let innergrid;
  let div_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const innergrid_spread_levels = [prefixFilter(ctx[6], "innerGrid$")];
  let innergrid_props = {
    $$slots: { default: [create_default_slot$1] },
    $$scope: { ctx }
  };
  for (let i = 0; i < innergrid_spread_levels.length; i += 1) {
    innergrid_props = assign(innergrid_props, innergrid_spread_levels[i]);
  }
  innergrid = new InnerGrid({ props: innergrid_props });
  let div_levels = [
    {
      class: div_class_value = classMap({
        [ctx[1]]: true,
        "mdc-layout-grid": true,
        "mdc-layout-grid--fixed-column-width": ctx[2],
        ["mdc-layout-grid--align-" + ctx[3]]: ctx[3] != null
      })
    },
    exclude(ctx[6], ["innerGrid$"])
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      create_component(innergrid.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(innergrid.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(innergrid, div, null);
      ctx[9](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div, ctx[0])),
          action_destroyer(ctx[5].call(null, div))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const innergrid_changes = dirty & 64 ? get_spread_update(innergrid_spread_levels, [get_spread_object(prefixFilter(ctx2[6], "innerGrid$"))]) : {};
      if (dirty & 1024) {
        innergrid_changes.$$scope = { dirty, ctx: ctx2 };
      }
      innergrid.$set(innergrid_changes);
      set_attributes(div, div_data = get_spread_update(div_levels, [
        (!current || dirty & 14 && div_class_value !== (div_class_value = classMap({
          [ctx2[1]]: true,
          "mdc-layout-grid": true,
          "mdc-layout-grid--fixed-column-width": ctx2[2],
          ["mdc-layout-grid--align-" + ctx2[3]]: ctx2[3] != null
        }))) && { class: div_class_value },
        dirty & 64 && exclude(ctx2[6], ["innerGrid$"])
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(innergrid.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(innergrid.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(innergrid);
      ctx[9](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "class", "fixedColumnWidth", "align", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { fixedColumnWidth = false } = $$props;
  let { align = void 0 } = $$props;
  let element2;
  function getElement() {
    return element2;
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(4, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("fixedColumnWidth" in $$new_props)
      $$invalidate(2, fixedColumnWidth = $$new_props.fixedColumnWidth);
    if ("align" in $$new_props)
      $$invalidate(3, align = $$new_props.align);
    if ("$$scope" in $$new_props)
      $$invalidate(10, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    className,
    fixedColumnWidth,
    align,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    slots,
    div_binding,
    $$scope
  ];
}
class LayoutGrid extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$8, safe_not_equal, {
      use: 0,
      class: 1,
      fixedColumnWidth: 2,
      align: 3,
      getElement: 7
    });
  }
  get getElement() {
    return this.$$.ctx[7];
  }
}
function create_fragment$7(ctx) {
  let div;
  let div_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[11].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[10], null);
  let div_levels = [
    {
      class: div_class_value = classMap(__spreadValues({
        [ctx[1]]: true,
        "mdc-layout-grid__cell": true,
        ["mdc-layout-grid__cell--align-" + ctx[2]]: ctx[2] != null,
        ["mdc-layout-grid__cell--order-" + ctx[3]]: ctx[3] != null,
        ["mdc-layout-grid__cell--span-" + ctx[4]]: ctx[4] != null
      }, Object.fromEntries(Object.entries(ctx[5]).map(func$4))))
    },
    ctx[8]
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[12](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div, ctx[0])),
          action_destroyer(ctx[7].call(null, div))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 1024)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[10], !current ? get_all_dirty_from_scope(ctx2[10]) : get_slot_changes(default_slot_template, ctx2[10], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        (!current || dirty & 62 && div_class_value !== (div_class_value = classMap(__spreadValues({
          [ctx2[1]]: true,
          "mdc-layout-grid__cell": true,
          ["mdc-layout-grid__cell--align-" + ctx2[2]]: ctx2[2] != null,
          ["mdc-layout-grid__cell--order-" + ctx2[3]]: ctx2[3] != null,
          ["mdc-layout-grid__cell--span-" + ctx2[4]]: ctx2[4] != null
        }, Object.fromEntries(Object.entries(ctx2[5]).map(func$4)))))) && { class: div_class_value },
        dirty & 256 && ctx2[8]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
      ctx[12](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
const func$4 = ([device, span]) => [`mdc-layout-grid__cell--span-${span}-${device}`, true];
function instance$2($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "class", "align", "order", "span", "spanDevices", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { align = void 0 } = $$props;
  let { order = void 0 } = $$props;
  let { span = void 0 } = $$props;
  let { spanDevices = {} } = $$props;
  let element2;
  function getElement() {
    return element2;
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(6, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("align" in $$new_props)
      $$invalidate(2, align = $$new_props.align);
    if ("order" in $$new_props)
      $$invalidate(3, order = $$new_props.order);
    if ("span" in $$new_props)
      $$invalidate(4, span = $$new_props.span);
    if ("spanDevices" in $$new_props)
      $$invalidate(5, spanDevices = $$new_props.spanDevices);
    if ("$$scope" in $$new_props)
      $$invalidate(10, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    className,
    align,
    order,
    span,
    spanDevices,
    element2,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    div_binding
  ];
}
class Cell$1 extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$7, safe_not_equal, {
      use: 0,
      class: 1,
      align: 2,
      order: 3,
      span: 4,
      spanDevices: 5,
      getElement: 9
    });
  }
  get getElement() {
    return this.$$.ctx[9];
  }
}
const Cell = Cell$1;
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$4 = {
  LABEL_FLOAT_ABOVE: "mdc-floating-label--float-above",
  LABEL_REQUIRED: "mdc-floating-label--required",
  LABEL_SHAKE: "mdc-floating-label--shake",
  ROOT: "mdc-floating-label"
};
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFloatingLabelFoundation = function(_super) {
  __extends(MDCFloatingLabelFoundation2, _super);
  function MDCFloatingLabelFoundation2(adapter) {
    var _this = _super.call(this, __assign(__assign({}, MDCFloatingLabelFoundation2.defaultAdapter), adapter)) || this;
    _this.shakeAnimationEndHandler = function() {
      _this.handleShakeAnimationEnd();
    };
    return _this;
  }
  Object.defineProperty(MDCFloatingLabelFoundation2, "cssClasses", {
    get: function() {
      return cssClasses$4;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCFloatingLabelFoundation2, "defaultAdapter", {
    get: function() {
      return {
        addClass: function() {
          return void 0;
        },
        removeClass: function() {
          return void 0;
        },
        getWidth: function() {
          return 0;
        },
        registerInteractionHandler: function() {
          return void 0;
        },
        deregisterInteractionHandler: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCFloatingLabelFoundation2.prototype.init = function() {
    this.adapter.registerInteractionHandler("animationend", this.shakeAnimationEndHandler);
  };
  MDCFloatingLabelFoundation2.prototype.destroy = function() {
    this.adapter.deregisterInteractionHandler("animationend", this.shakeAnimationEndHandler);
  };
  MDCFloatingLabelFoundation2.prototype.getWidth = function() {
    return this.adapter.getWidth();
  };
  MDCFloatingLabelFoundation2.prototype.shake = function(shouldShake) {
    var LABEL_SHAKE = MDCFloatingLabelFoundation2.cssClasses.LABEL_SHAKE;
    if (shouldShake) {
      this.adapter.addClass(LABEL_SHAKE);
    } else {
      this.adapter.removeClass(LABEL_SHAKE);
    }
  };
  MDCFloatingLabelFoundation2.prototype.float = function(shouldFloat) {
    var _a = MDCFloatingLabelFoundation2.cssClasses, LABEL_FLOAT_ABOVE = _a.LABEL_FLOAT_ABOVE, LABEL_SHAKE = _a.LABEL_SHAKE;
    if (shouldFloat) {
      this.adapter.addClass(LABEL_FLOAT_ABOVE);
    } else {
      this.adapter.removeClass(LABEL_FLOAT_ABOVE);
      this.adapter.removeClass(LABEL_SHAKE);
    }
  };
  MDCFloatingLabelFoundation2.prototype.setRequired = function(isRequired) {
    var LABEL_REQUIRED = MDCFloatingLabelFoundation2.cssClasses.LABEL_REQUIRED;
    if (isRequired) {
      this.adapter.addClass(LABEL_REQUIRED);
    } else {
      this.adapter.removeClass(LABEL_REQUIRED);
    }
  };
  MDCFloatingLabelFoundation2.prototype.handleShakeAnimationEnd = function() {
    var LABEL_SHAKE = MDCFloatingLabelFoundation2.cssClasses.LABEL_SHAKE;
    this.adapter.removeClass(LABEL_SHAKE);
  };
  return MDCFloatingLabelFoundation2;
}(MDCFoundation);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$3 = {
  LINE_RIPPLE_ACTIVE: "mdc-line-ripple--active",
  LINE_RIPPLE_DEACTIVATING: "mdc-line-ripple--deactivating"
};
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCLineRippleFoundation = function(_super) {
  __extends(MDCLineRippleFoundation2, _super);
  function MDCLineRippleFoundation2(adapter) {
    var _this = _super.call(this, __assign(__assign({}, MDCLineRippleFoundation2.defaultAdapter), adapter)) || this;
    _this.transitionEndHandler = function(evt) {
      _this.handleTransitionEnd(evt);
    };
    return _this;
  }
  Object.defineProperty(MDCLineRippleFoundation2, "cssClasses", {
    get: function() {
      return cssClasses$3;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCLineRippleFoundation2, "defaultAdapter", {
    get: function() {
      return {
        addClass: function() {
          return void 0;
        },
        removeClass: function() {
          return void 0;
        },
        hasClass: function() {
          return false;
        },
        setStyle: function() {
          return void 0;
        },
        registerEventHandler: function() {
          return void 0;
        },
        deregisterEventHandler: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCLineRippleFoundation2.prototype.init = function() {
    this.adapter.registerEventHandler("transitionend", this.transitionEndHandler);
  };
  MDCLineRippleFoundation2.prototype.destroy = function() {
    this.adapter.deregisterEventHandler("transitionend", this.transitionEndHandler);
  };
  MDCLineRippleFoundation2.prototype.activate = function() {
    this.adapter.removeClass(cssClasses$3.LINE_RIPPLE_DEACTIVATING);
    this.adapter.addClass(cssClasses$3.LINE_RIPPLE_ACTIVE);
  };
  MDCLineRippleFoundation2.prototype.setRippleCenter = function(xCoordinate) {
    this.adapter.setStyle("transform-origin", xCoordinate + "px center");
  };
  MDCLineRippleFoundation2.prototype.deactivate = function() {
    this.adapter.addClass(cssClasses$3.LINE_RIPPLE_DEACTIVATING);
  };
  MDCLineRippleFoundation2.prototype.handleTransitionEnd = function(evt) {
    var isDeactivating = this.adapter.hasClass(cssClasses$3.LINE_RIPPLE_DEACTIVATING);
    if (evt.propertyName === "opacity") {
      if (isDeactivating) {
        this.adapter.removeClass(cssClasses$3.LINE_RIPPLE_ACTIVE);
        this.adapter.removeClass(cssClasses$3.LINE_RIPPLE_DEACTIVATING);
      }
    }
  };
  return MDCLineRippleFoundation2;
}(MDCFoundation);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$2 = {
  NOTCH_ELEMENT_SELECTOR: ".mdc-notched-outline__notch"
};
var numbers$1 = {
  NOTCH_ELEMENT_PADDING: 8
};
var cssClasses$2 = {
  NO_LABEL: "mdc-notched-outline--no-label",
  OUTLINE_NOTCHED: "mdc-notched-outline--notched",
  OUTLINE_UPGRADED: "mdc-notched-outline--upgraded"
};
/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCNotchedOutlineFoundation = function(_super) {
  __extends(MDCNotchedOutlineFoundation2, _super);
  function MDCNotchedOutlineFoundation2(adapter) {
    return _super.call(this, __assign(__assign({}, MDCNotchedOutlineFoundation2.defaultAdapter), adapter)) || this;
  }
  Object.defineProperty(MDCNotchedOutlineFoundation2, "strings", {
    get: function() {
      return strings$2;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCNotchedOutlineFoundation2, "cssClasses", {
    get: function() {
      return cssClasses$2;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCNotchedOutlineFoundation2, "numbers", {
    get: function() {
      return numbers$1;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCNotchedOutlineFoundation2, "defaultAdapter", {
    get: function() {
      return {
        addClass: function() {
          return void 0;
        },
        removeClass: function() {
          return void 0;
        },
        setNotchWidthProperty: function() {
          return void 0;
        },
        removeNotchWidthProperty: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCNotchedOutlineFoundation2.prototype.notch = function(notchWidth) {
    var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation2.cssClasses.OUTLINE_NOTCHED;
    if (notchWidth > 0) {
      notchWidth += numbers$1.NOTCH_ELEMENT_PADDING;
    }
    this.adapter.setNotchWidthProperty(notchWidth);
    this.adapter.addClass(OUTLINE_NOTCHED);
  };
  MDCNotchedOutlineFoundation2.prototype.closeNotch = function() {
    var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation2.cssClasses.OUTLINE_NOTCHED;
    this.adapter.removeClass(OUTLINE_NOTCHED);
    this.adapter.removeNotchWidthProperty();
  };
  return MDCNotchedOutlineFoundation2;
}(MDCFoundation);
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$1 = {
  ARIA_CONTROLS: "aria-controls",
  ARIA_DESCRIBEDBY: "aria-describedby",
  INPUT_SELECTOR: ".mdc-text-field__input",
  LABEL_SELECTOR: ".mdc-floating-label",
  LEADING_ICON_SELECTOR: ".mdc-text-field__icon--leading",
  LINE_RIPPLE_SELECTOR: ".mdc-line-ripple",
  OUTLINE_SELECTOR: ".mdc-notched-outline",
  PREFIX_SELECTOR: ".mdc-text-field__affix--prefix",
  SUFFIX_SELECTOR: ".mdc-text-field__affix--suffix",
  TRAILING_ICON_SELECTOR: ".mdc-text-field__icon--trailing"
};
var cssClasses$1 = {
  DISABLED: "mdc-text-field--disabled",
  FOCUSED: "mdc-text-field--focused",
  HELPER_LINE: "mdc-text-field-helper-line",
  INVALID: "mdc-text-field--invalid",
  LABEL_FLOATING: "mdc-text-field--label-floating",
  NO_LABEL: "mdc-text-field--no-label",
  OUTLINED: "mdc-text-field--outlined",
  ROOT: "mdc-text-field",
  TEXTAREA: "mdc-text-field--textarea",
  WITH_LEADING_ICON: "mdc-text-field--with-leading-icon",
  WITH_TRAILING_ICON: "mdc-text-field--with-trailing-icon",
  WITH_INTERNAL_COUNTER: "mdc-text-field--with-internal-counter"
};
var numbers = {
  LABEL_SCALE: 0.75
};
var VALIDATION_ATTR_WHITELIST = [
  "pattern",
  "min",
  "max",
  "required",
  "step",
  "minlength",
  "maxlength"
];
var ALWAYS_FLOAT_TYPES = [
  "color",
  "date",
  "datetime-local",
  "month",
  "range",
  "time",
  "week"
];
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var POINTERDOWN_EVENTS = ["mousedown", "touchstart"];
var INTERACTION_EVENTS = ["click", "keydown"];
var MDCTextFieldFoundation = function(_super) {
  __extends(MDCTextFieldFoundation2, _super);
  function MDCTextFieldFoundation2(adapter, foundationMap) {
    if (foundationMap === void 0) {
      foundationMap = {};
    }
    var _this = _super.call(this, __assign(__assign({}, MDCTextFieldFoundation2.defaultAdapter), adapter)) || this;
    _this.isFocused = false;
    _this.receivedUserInput = false;
    _this.valid = true;
    _this.useNativeValidation = true;
    _this.validateOnValueChange = true;
    _this.helperText = foundationMap.helperText;
    _this.characterCounter = foundationMap.characterCounter;
    _this.leadingIcon = foundationMap.leadingIcon;
    _this.trailingIcon = foundationMap.trailingIcon;
    _this.inputFocusHandler = function() {
      _this.activateFocus();
    };
    _this.inputBlurHandler = function() {
      _this.deactivateFocus();
    };
    _this.inputInputHandler = function() {
      _this.handleInput();
    };
    _this.setPointerXOffset = function(evt) {
      _this.setTransformOrigin(evt);
    };
    _this.textFieldInteractionHandler = function() {
      _this.handleTextFieldInteraction();
    };
    _this.validationAttributeChangeHandler = function(attributesList) {
      _this.handleValidationAttributeChange(attributesList);
    };
    return _this;
  }
  Object.defineProperty(MDCTextFieldFoundation2, "cssClasses", {
    get: function() {
      return cssClasses$1;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTextFieldFoundation2, "strings", {
    get: function() {
      return strings$1;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTextFieldFoundation2, "numbers", {
    get: function() {
      return numbers;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTextFieldFoundation2.prototype, "shouldAlwaysFloat", {
    get: function() {
      var type = this.getNativeInput().type;
      return ALWAYS_FLOAT_TYPES.indexOf(type) >= 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTextFieldFoundation2.prototype, "shouldFloat", {
    get: function() {
      return this.shouldAlwaysFloat || this.isFocused || !!this.getValue() || this.isBadInput();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTextFieldFoundation2.prototype, "shouldShake", {
    get: function() {
      return !this.isFocused && !this.isValid() && !!this.getValue();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTextFieldFoundation2, "defaultAdapter", {
    get: function() {
      return {
        addClass: function() {
          return void 0;
        },
        removeClass: function() {
          return void 0;
        },
        hasClass: function() {
          return true;
        },
        setInputAttr: function() {
          return void 0;
        },
        removeInputAttr: function() {
          return void 0;
        },
        registerTextFieldInteractionHandler: function() {
          return void 0;
        },
        deregisterTextFieldInteractionHandler: function() {
          return void 0;
        },
        registerInputInteractionHandler: function() {
          return void 0;
        },
        deregisterInputInteractionHandler: function() {
          return void 0;
        },
        registerValidationAttributeChangeHandler: function() {
          return new MutationObserver(function() {
            return void 0;
          });
        },
        deregisterValidationAttributeChangeHandler: function() {
          return void 0;
        },
        getNativeInput: function() {
          return null;
        },
        isFocused: function() {
          return false;
        },
        activateLineRipple: function() {
          return void 0;
        },
        deactivateLineRipple: function() {
          return void 0;
        },
        setLineRippleTransformOrigin: function() {
          return void 0;
        },
        shakeLabel: function() {
          return void 0;
        },
        floatLabel: function() {
          return void 0;
        },
        setLabelRequired: function() {
          return void 0;
        },
        hasLabel: function() {
          return false;
        },
        getLabelWidth: function() {
          return 0;
        },
        hasOutline: function() {
          return false;
        },
        notchOutline: function() {
          return void 0;
        },
        closeOutline: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCTextFieldFoundation2.prototype.init = function() {
    var e_1, _a, e_2, _b;
    if (this.adapter.hasLabel() && this.getNativeInput().required) {
      this.adapter.setLabelRequired(true);
    }
    if (this.adapter.isFocused()) {
      this.inputFocusHandler();
    } else if (this.adapter.hasLabel() && this.shouldFloat) {
      this.notchOutline(true);
      this.adapter.floatLabel(true);
      this.styleFloating(true);
    }
    this.adapter.registerInputInteractionHandler("focus", this.inputFocusHandler);
    this.adapter.registerInputInteractionHandler("blur", this.inputBlurHandler);
    this.adapter.registerInputInteractionHandler("input", this.inputInputHandler);
    try {
      for (var POINTERDOWN_EVENTS_1 = __values(POINTERDOWN_EVENTS), POINTERDOWN_EVENTS_1_1 = POINTERDOWN_EVENTS_1.next(); !POINTERDOWN_EVENTS_1_1.done; POINTERDOWN_EVENTS_1_1 = POINTERDOWN_EVENTS_1.next()) {
        var evtType = POINTERDOWN_EVENTS_1_1.value;
        this.adapter.registerInputInteractionHandler(evtType, this.setPointerXOffset);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (POINTERDOWN_EVENTS_1_1 && !POINTERDOWN_EVENTS_1_1.done && (_a = POINTERDOWN_EVENTS_1.return))
          _a.call(POINTERDOWN_EVENTS_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    try {
      for (var INTERACTION_EVENTS_1 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next(); !INTERACTION_EVENTS_1_1.done; INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next()) {
        var evtType = INTERACTION_EVENTS_1_1.value;
        this.adapter.registerTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (INTERACTION_EVENTS_1_1 && !INTERACTION_EVENTS_1_1.done && (_b = INTERACTION_EVENTS_1.return))
          _b.call(INTERACTION_EVENTS_1);
      } finally {
        if (e_2)
          throw e_2.error;
      }
    }
    this.validationObserver = this.adapter.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler);
    this.setcharacterCounter(this.getValue().length);
  };
  MDCTextFieldFoundation2.prototype.destroy = function() {
    var e_3, _a, e_4, _b;
    this.adapter.deregisterInputInteractionHandler("focus", this.inputFocusHandler);
    this.adapter.deregisterInputInteractionHandler("blur", this.inputBlurHandler);
    this.adapter.deregisterInputInteractionHandler("input", this.inputInputHandler);
    try {
      for (var POINTERDOWN_EVENTS_2 = __values(POINTERDOWN_EVENTS), POINTERDOWN_EVENTS_2_1 = POINTERDOWN_EVENTS_2.next(); !POINTERDOWN_EVENTS_2_1.done; POINTERDOWN_EVENTS_2_1 = POINTERDOWN_EVENTS_2.next()) {
        var evtType = POINTERDOWN_EVENTS_2_1.value;
        this.adapter.deregisterInputInteractionHandler(evtType, this.setPointerXOffset);
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (POINTERDOWN_EVENTS_2_1 && !POINTERDOWN_EVENTS_2_1.done && (_a = POINTERDOWN_EVENTS_2.return))
          _a.call(POINTERDOWN_EVENTS_2);
      } finally {
        if (e_3)
          throw e_3.error;
      }
    }
    try {
      for (var INTERACTION_EVENTS_2 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next(); !INTERACTION_EVENTS_2_1.done; INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next()) {
        var evtType = INTERACTION_EVENTS_2_1.value;
        this.adapter.deregisterTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler);
      }
    } catch (e_4_1) {
      e_4 = { error: e_4_1 };
    } finally {
      try {
        if (INTERACTION_EVENTS_2_1 && !INTERACTION_EVENTS_2_1.done && (_b = INTERACTION_EVENTS_2.return))
          _b.call(INTERACTION_EVENTS_2);
      } finally {
        if (e_4)
          throw e_4.error;
      }
    }
    this.adapter.deregisterValidationAttributeChangeHandler(this.validationObserver);
  };
  MDCTextFieldFoundation2.prototype.handleTextFieldInteraction = function() {
    var nativeInput = this.adapter.getNativeInput();
    if (nativeInput && nativeInput.disabled) {
      return;
    }
    this.receivedUserInput = true;
  };
  MDCTextFieldFoundation2.prototype.handleValidationAttributeChange = function(attributesList) {
    var _this = this;
    attributesList.some(function(attributeName) {
      if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
        _this.styleValidity(true);
        _this.adapter.setLabelRequired(_this.getNativeInput().required);
        return true;
      }
      return false;
    });
    if (attributesList.indexOf("maxlength") > -1) {
      this.setcharacterCounter(this.getValue().length);
    }
  };
  MDCTextFieldFoundation2.prototype.notchOutline = function(openNotch) {
    if (!this.adapter.hasOutline() || !this.adapter.hasLabel()) {
      return;
    }
    if (openNotch) {
      var labelWidth = this.adapter.getLabelWidth() * numbers.LABEL_SCALE;
      this.adapter.notchOutline(labelWidth);
    } else {
      this.adapter.closeOutline();
    }
  };
  MDCTextFieldFoundation2.prototype.activateFocus = function() {
    this.isFocused = true;
    this.styleFocused(this.isFocused);
    this.adapter.activateLineRipple();
    if (this.adapter.hasLabel()) {
      this.notchOutline(this.shouldFloat);
      this.adapter.floatLabel(this.shouldFloat);
      this.styleFloating(this.shouldFloat);
      this.adapter.shakeLabel(this.shouldShake);
    }
    if (this.helperText && (this.helperText.isPersistent() || !this.helperText.isValidation() || !this.valid)) {
      this.helperText.showToScreenReader();
    }
  };
  MDCTextFieldFoundation2.prototype.setTransformOrigin = function(evt) {
    if (this.isDisabled() || this.adapter.hasOutline()) {
      return;
    }
    var touches = evt.touches;
    var targetEvent = touches ? touches[0] : evt;
    var targetClientRect = targetEvent.target.getBoundingClientRect();
    var normalizedX = targetEvent.clientX - targetClientRect.left;
    this.adapter.setLineRippleTransformOrigin(normalizedX);
  };
  MDCTextFieldFoundation2.prototype.handleInput = function() {
    this.autoCompleteFocus();
    this.setcharacterCounter(this.getValue().length);
  };
  MDCTextFieldFoundation2.prototype.autoCompleteFocus = function() {
    if (!this.receivedUserInput) {
      this.activateFocus();
    }
  };
  MDCTextFieldFoundation2.prototype.deactivateFocus = function() {
    this.isFocused = false;
    this.adapter.deactivateLineRipple();
    var isValid = this.isValid();
    this.styleValidity(isValid);
    this.styleFocused(this.isFocused);
    if (this.adapter.hasLabel()) {
      this.notchOutline(this.shouldFloat);
      this.adapter.floatLabel(this.shouldFloat);
      this.styleFloating(this.shouldFloat);
      this.adapter.shakeLabel(this.shouldShake);
    }
    if (!this.shouldFloat) {
      this.receivedUserInput = false;
    }
  };
  MDCTextFieldFoundation2.prototype.getValue = function() {
    return this.getNativeInput().value;
  };
  MDCTextFieldFoundation2.prototype.setValue = function(value) {
    if (this.getValue() !== value) {
      this.getNativeInput().value = value;
    }
    this.setcharacterCounter(value.length);
    if (this.validateOnValueChange) {
      var isValid = this.isValid();
      this.styleValidity(isValid);
    }
    if (this.adapter.hasLabel()) {
      this.notchOutline(this.shouldFloat);
      this.adapter.floatLabel(this.shouldFloat);
      this.styleFloating(this.shouldFloat);
      if (this.validateOnValueChange) {
        this.adapter.shakeLabel(this.shouldShake);
      }
    }
  };
  MDCTextFieldFoundation2.prototype.isValid = function() {
    return this.useNativeValidation ? this.isNativeInputValid() : this.valid;
  };
  MDCTextFieldFoundation2.prototype.setValid = function(isValid) {
    this.valid = isValid;
    this.styleValidity(isValid);
    var shouldShake = !isValid && !this.isFocused && !!this.getValue();
    if (this.adapter.hasLabel()) {
      this.adapter.shakeLabel(shouldShake);
    }
  };
  MDCTextFieldFoundation2.prototype.setValidateOnValueChange = function(shouldValidate) {
    this.validateOnValueChange = shouldValidate;
  };
  MDCTextFieldFoundation2.prototype.getValidateOnValueChange = function() {
    return this.validateOnValueChange;
  };
  MDCTextFieldFoundation2.prototype.setUseNativeValidation = function(useNativeValidation) {
    this.useNativeValidation = useNativeValidation;
  };
  MDCTextFieldFoundation2.prototype.isDisabled = function() {
    return this.getNativeInput().disabled;
  };
  MDCTextFieldFoundation2.prototype.setDisabled = function(disabled) {
    this.getNativeInput().disabled = disabled;
    this.styleDisabled(disabled);
  };
  MDCTextFieldFoundation2.prototype.setHelperTextContent = function(content) {
    if (this.helperText) {
      this.helperText.setContent(content);
    }
  };
  MDCTextFieldFoundation2.prototype.setLeadingIconAriaLabel = function(label) {
    if (this.leadingIcon) {
      this.leadingIcon.setAriaLabel(label);
    }
  };
  MDCTextFieldFoundation2.prototype.setLeadingIconContent = function(content) {
    if (this.leadingIcon) {
      this.leadingIcon.setContent(content);
    }
  };
  MDCTextFieldFoundation2.prototype.setTrailingIconAriaLabel = function(label) {
    if (this.trailingIcon) {
      this.trailingIcon.setAriaLabel(label);
    }
  };
  MDCTextFieldFoundation2.prototype.setTrailingIconContent = function(content) {
    if (this.trailingIcon) {
      this.trailingIcon.setContent(content);
    }
  };
  MDCTextFieldFoundation2.prototype.setcharacterCounter = function(currentLength) {
    if (!this.characterCounter) {
      return;
    }
    var maxLength = this.getNativeInput().maxLength;
    if (maxLength === -1) {
      throw new Error("MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.");
    }
    this.characterCounter.setCounterValue(currentLength, maxLength);
  };
  MDCTextFieldFoundation2.prototype.isBadInput = function() {
    return this.getNativeInput().validity.badInput || false;
  };
  MDCTextFieldFoundation2.prototype.isNativeInputValid = function() {
    return this.getNativeInput().validity.valid;
  };
  MDCTextFieldFoundation2.prototype.styleValidity = function(isValid) {
    var INVALID = MDCTextFieldFoundation2.cssClasses.INVALID;
    if (isValid) {
      this.adapter.removeClass(INVALID);
    } else {
      this.adapter.addClass(INVALID);
    }
    if (this.helperText) {
      this.helperText.setValidity(isValid);
      var helperTextValidation = this.helperText.isValidation();
      if (!helperTextValidation) {
        return;
      }
      var helperTextVisible = this.helperText.isVisible();
      var helperTextId = this.helperText.getId();
      if (helperTextVisible && helperTextId) {
        this.adapter.setInputAttr(strings$1.ARIA_DESCRIBEDBY, helperTextId);
      } else {
        this.adapter.removeInputAttr(strings$1.ARIA_DESCRIBEDBY);
      }
    }
  };
  MDCTextFieldFoundation2.prototype.styleFocused = function(isFocused) {
    var FOCUSED = MDCTextFieldFoundation2.cssClasses.FOCUSED;
    if (isFocused) {
      this.adapter.addClass(FOCUSED);
    } else {
      this.adapter.removeClass(FOCUSED);
    }
  };
  MDCTextFieldFoundation2.prototype.styleDisabled = function(isDisabled) {
    var _a = MDCTextFieldFoundation2.cssClasses, DISABLED = _a.DISABLED, INVALID = _a.INVALID;
    if (isDisabled) {
      this.adapter.addClass(DISABLED);
      this.adapter.removeClass(INVALID);
    } else {
      this.adapter.removeClass(DISABLED);
    }
    if (this.leadingIcon) {
      this.leadingIcon.setDisabled(isDisabled);
    }
    if (this.trailingIcon) {
      this.trailingIcon.setDisabled(isDisabled);
    }
  };
  MDCTextFieldFoundation2.prototype.styleFloating = function(isFloating) {
    var LABEL_FLOATING = MDCTextFieldFoundation2.cssClasses.LABEL_FLOATING;
    if (isFloating) {
      this.adapter.addClass(LABEL_FLOATING);
    } else {
      this.adapter.removeClass(LABEL_FLOATING);
    }
  };
  MDCTextFieldFoundation2.prototype.getNativeInput = function() {
    var nativeInput = this.adapter ? this.adapter.getNativeInput() : null;
    return nativeInput || {
      disabled: false,
      maxLength: -1,
      required: false,
      type: "input",
      validity: {
        badInput: false,
        valid: true
      },
      value: ""
    };
  };
  return MDCTextFieldFoundation2;
}(MDCFoundation);
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses = {
  HELPER_TEXT_PERSISTENT: "mdc-text-field-helper-text--persistent",
  HELPER_TEXT_VALIDATION_MSG: "mdc-text-field-helper-text--validation-msg",
  ROOT: "mdc-text-field-helper-text"
};
var strings = {
  ARIA_HIDDEN: "aria-hidden",
  ROLE: "role",
  ROOT_SELECTOR: "." + cssClasses.ROOT
};
/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCTextFieldHelperTextFoundation = function(_super) {
  __extends(MDCTextFieldHelperTextFoundation2, _super);
  function MDCTextFieldHelperTextFoundation2(adapter) {
    return _super.call(this, __assign(__assign({}, MDCTextFieldHelperTextFoundation2.defaultAdapter), adapter)) || this;
  }
  Object.defineProperty(MDCTextFieldHelperTextFoundation2, "cssClasses", {
    get: function() {
      return cssClasses;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTextFieldHelperTextFoundation2, "strings", {
    get: function() {
      return strings;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(MDCTextFieldHelperTextFoundation2, "defaultAdapter", {
    get: function() {
      return {
        addClass: function() {
          return void 0;
        },
        removeClass: function() {
          return void 0;
        },
        hasClass: function() {
          return false;
        },
        getAttr: function() {
          return null;
        },
        setAttr: function() {
          return void 0;
        },
        removeAttr: function() {
          return void 0;
        },
        setContent: function() {
          return void 0;
        }
      };
    },
    enumerable: false,
    configurable: true
  });
  MDCTextFieldHelperTextFoundation2.prototype.getId = function() {
    return this.adapter.getAttr("id");
  };
  MDCTextFieldHelperTextFoundation2.prototype.isVisible = function() {
    return this.adapter.getAttr(strings.ARIA_HIDDEN) !== "true";
  };
  MDCTextFieldHelperTextFoundation2.prototype.setContent = function(content) {
    this.adapter.setContent(content);
  };
  MDCTextFieldHelperTextFoundation2.prototype.isPersistent = function() {
    return this.adapter.hasClass(cssClasses.HELPER_TEXT_PERSISTENT);
  };
  MDCTextFieldHelperTextFoundation2.prototype.setPersistent = function(isPersistent) {
    if (isPersistent) {
      this.adapter.addClass(cssClasses.HELPER_TEXT_PERSISTENT);
    } else {
      this.adapter.removeClass(cssClasses.HELPER_TEXT_PERSISTENT);
    }
  };
  MDCTextFieldHelperTextFoundation2.prototype.isValidation = function() {
    return this.adapter.hasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
  };
  MDCTextFieldHelperTextFoundation2.prototype.setValidation = function(isValidation) {
    if (isValidation) {
      this.adapter.addClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    } else {
      this.adapter.removeClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    }
  };
  MDCTextFieldHelperTextFoundation2.prototype.showToScreenReader = function() {
    this.adapter.removeAttr(strings.ARIA_HIDDEN);
  };
  MDCTextFieldHelperTextFoundation2.prototype.setValidity = function(inputIsValid) {
    var helperTextIsPersistent = this.adapter.hasClass(cssClasses.HELPER_TEXT_PERSISTENT);
    var helperTextIsValidationMsg = this.adapter.hasClass(cssClasses.HELPER_TEXT_VALIDATION_MSG);
    var validationMsgNeedsDisplay = helperTextIsValidationMsg && !inputIsValid;
    if (validationMsgNeedsDisplay) {
      this.showToScreenReader();
      if (this.adapter.getAttr(strings.ROLE) === "alert") {
        this.refreshAlertRole();
      } else {
        this.adapter.setAttr(strings.ROLE, "alert");
      }
    } else {
      this.adapter.removeAttr(strings.ROLE);
    }
    if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {
      this.hide();
    }
  };
  MDCTextFieldHelperTextFoundation2.prototype.hide = function() {
    this.adapter.setAttr(strings.ARIA_HIDDEN, "true");
  };
  MDCTextFieldHelperTextFoundation2.prototype.refreshAlertRole = function() {
    var _this = this;
    this.adapter.removeAttr(strings.ROLE);
    requestAnimationFrame(function() {
      _this.adapter.setAttr(strings.ROLE, "alert");
    });
  };
  return MDCTextFieldHelperTextFoundation2;
}(MDCFoundation);
function create_else_block$2(ctx) {
  let label;
  let label_class_value;
  let label_style_value;
  let label_for_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[22].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[21], null);
  let label_levels = [
    {
      class: label_class_value = classMap(__spreadValues({
        [ctx[3]]: true,
        "mdc-floating-label": true,
        "mdc-floating-label--float-above": ctx[0],
        "mdc-floating-label--required": ctx[1]
      }, ctx[8]))
    },
    {
      style: label_style_value = Object.entries(ctx[9]).map(func_1$1).concat([ctx[4]]).join(" ")
    },
    {
      for: label_for_value = ctx[5] || (ctx[11] ? ctx[11].id : void 0)
    },
    ctx[12]
  ];
  let label_data = {};
  for (let i = 0; i < label_levels.length; i += 1) {
    label_data = assign(label_data, label_levels[i]);
  }
  return {
    c() {
      label = element("label");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      label = claim_element(nodes, "LABEL", { class: true, style: true, for: true });
      var label_nodes = children(label);
      if (default_slot)
        default_slot.l(label_nodes);
      label_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(label, label_data);
    },
    m(target, anchor) {
      insert_hydration(target, label, anchor);
      if (default_slot) {
        default_slot.m(label, null);
      }
      ctx[24](label);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, label, ctx[2])),
          action_destroyer(ctx[10].call(null, label))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2097152)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[21], !current ? get_all_dirty_from_scope(ctx2[21]) : get_slot_changes(default_slot_template, ctx2[21], dirty, null), null);
        }
      }
      set_attributes(label, label_data = get_spread_update(label_levels, [
        (!current || dirty & 267 && label_class_value !== (label_class_value = classMap(__spreadValues({
          [ctx2[3]]: true,
          "mdc-floating-label": true,
          "mdc-floating-label--float-above": ctx2[0],
          "mdc-floating-label--required": ctx2[1]
        }, ctx2[8])))) && { class: label_class_value },
        (!current || dirty & 528 && label_style_value !== (label_style_value = Object.entries(ctx2[9]).map(func_1$1).concat([ctx2[4]]).join(" "))) && { style: label_style_value },
        (!current || dirty & 32 && label_for_value !== (label_for_value = ctx2[5] || (ctx2[11] ? ctx2[11].id : void 0))) && { for: label_for_value },
        dirty & 4096 && ctx2[12]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 4)
        useActions_action.update.call(null, ctx2[2]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(label);
      if (default_slot)
        default_slot.d(detaching);
      ctx[24](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$3(ctx) {
  let span;
  let span_class_value;
  let span_style_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[22].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[21], null);
  let span_levels = [
    {
      class: span_class_value = classMap(__spreadValues({
        [ctx[3]]: true,
        "mdc-floating-label": true,
        "mdc-floating-label--float-above": ctx[0],
        "mdc-floating-label--required": ctx[1]
      }, ctx[8]))
    },
    {
      style: span_style_value = Object.entries(ctx[9]).map(func$3).concat([ctx[4]]).join(" ")
    },
    ctx[12]
  ];
  let span_data = {};
  for (let i = 0; i < span_levels.length; i += 1) {
    span_data = assign(span_data, span_levels[i]);
  }
  return {
    c() {
      span = element("span");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      span = claim_element(nodes, "SPAN", { class: true, style: true });
      var span_nodes = children(span);
      if (default_slot)
        default_slot.l(span_nodes);
      span_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(span, span_data);
    },
    m(target, anchor) {
      insert_hydration(target, span, anchor);
      if (default_slot) {
        default_slot.m(span, null);
      }
      ctx[23](span);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, span, ctx[2])),
          action_destroyer(ctx[10].call(null, span))
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2097152)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[21], !current ? get_all_dirty_from_scope(ctx2[21]) : get_slot_changes(default_slot_template, ctx2[21], dirty, null), null);
        }
      }
      set_attributes(span, span_data = get_spread_update(span_levels, [
        (!current || dirty & 267 && span_class_value !== (span_class_value = classMap(__spreadValues({
          [ctx2[3]]: true,
          "mdc-floating-label": true,
          "mdc-floating-label--float-above": ctx2[0],
          "mdc-floating-label--required": ctx2[1]
        }, ctx2[8])))) && { class: span_class_value },
        (!current || dirty & 528 && span_style_value !== (span_style_value = Object.entries(ctx2[9]).map(func$3).concat([ctx2[4]]).join(" "))) && { style: span_style_value },
        dirty & 4096 && ctx2[12]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 4)
        useActions_action.update.call(null, ctx2[2]);
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(span);
      if (default_slot)
        default_slot.d(detaching);
      ctx[23](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$6(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$3, create_else_block$2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[6])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    l(nodes) {
      if_block.l(nodes);
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
const func$3 = ([name, value]) => `${name}: ${value};`;
const func_1$1 = ([name, value]) => `${name}: ${value};`;
function instance_1$4($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "use",
    "class",
    "style",
    "for",
    "floatAbove",
    "required",
    "wrapped",
    "shake",
    "float",
    "setRequired",
    "getWidth",
    "getElement"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  var _a;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { for: forId = void 0 } = $$props;
  let { floatAbove = false } = $$props;
  let { required = false } = $$props;
  let { wrapped = false } = $$props;
  let element2;
  let instance2;
  let internalClasses = {};
  let internalStyles = {};
  let inputProps = (_a = getContext("SMUI:generic:input:props")) !== null && _a !== void 0 ? _a : {};
  let previousFloatAbove = floatAbove;
  let previousRequired = required;
  onMount(() => {
    $$invalidate(18, instance2 = new MDCFloatingLabelFoundation({
      addClass,
      removeClass,
      getWidth: () => {
        var _a2, _b;
        const el = getElement();
        const clone = el.cloneNode(true);
        (_a2 = el.parentNode) === null || _a2 === void 0 ? void 0 : _a2.appendChild(clone);
        clone.classList.add("smui-floating-label--remove-transition");
        clone.classList.add("smui-floating-label--force-size");
        clone.classList.remove("mdc-floating-label--float-above");
        const scrollWidth = clone.scrollWidth;
        (_b = el.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(clone);
        return scrollWidth;
      },
      registerInteractionHandler: (evtType, handler) => getElement().addEventListener(evtType, handler),
      deregisterInteractionHandler: (evtType, handler) => getElement().removeEventListener(evtType, handler)
    }));
    const accessor = {
      get element() {
        return getElement();
      },
      addStyle,
      removeStyle
    };
    dispatch(element2, "SMUIFloatingLabel:mount", accessor);
    instance2.init();
    return () => {
      dispatch(element2, "SMUIFloatingLabel:unmount", accessor);
      instance2.destroy();
    };
  });
  function addClass(className2) {
    if (!internalClasses[className2]) {
      $$invalidate(8, internalClasses[className2] = true, internalClasses);
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      $$invalidate(8, internalClasses[className2] = false, internalClasses);
    }
  }
  function addStyle(name, value) {
    if (internalStyles[name] != value) {
      if (value === "" || value == null) {
        delete internalStyles[name];
        $$invalidate(9, internalStyles);
      } else {
        $$invalidate(9, internalStyles[name] = value, internalStyles);
      }
    }
  }
  function removeStyle(name) {
    if (name in internalStyles) {
      delete internalStyles[name];
      $$invalidate(9, internalStyles);
    }
  }
  function shake(shouldShake) {
    instance2.shake(shouldShake);
  }
  function float(shouldFloat) {
    $$invalidate(0, floatAbove = shouldFloat);
  }
  function setRequired(isRequired) {
    $$invalidate(1, required = isRequired);
  }
  function getWidth() {
    return instance2.getWidth();
  }
  function getElement() {
    return element2;
  }
  function span_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(7, element2);
    });
  }
  function label_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(7, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(2, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("style" in $$new_props)
      $$invalidate(4, style = $$new_props.style);
    if ("for" in $$new_props)
      $$invalidate(5, forId = $$new_props.for);
    if ("floatAbove" in $$new_props)
      $$invalidate(0, floatAbove = $$new_props.floatAbove);
    if ("required" in $$new_props)
      $$invalidate(1, required = $$new_props.required);
    if ("wrapped" in $$new_props)
      $$invalidate(6, wrapped = $$new_props.wrapped);
    if ("$$scope" in $$new_props)
      $$invalidate(21, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 786433) {
      if (instance2 && previousFloatAbove !== floatAbove) {
        $$invalidate(19, previousFloatAbove = floatAbove);
        instance2.float(floatAbove);
      }
    }
    if ($$self.$$.dirty & 1310722) {
      if (instance2 && previousRequired !== required) {
        $$invalidate(20, previousRequired = required);
        instance2.setRequired(required);
      }
    }
  };
  return [
    floatAbove,
    required,
    use,
    className,
    style,
    forId,
    wrapped,
    element2,
    internalClasses,
    internalStyles,
    forwardEvents,
    inputProps,
    $$restProps,
    shake,
    float,
    setRequired,
    getWidth,
    getElement,
    instance2,
    previousFloatAbove,
    previousRequired,
    $$scope,
    slots,
    span_binding,
    label_binding
  ];
}
class FloatingLabel extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1$4, create_fragment$6, safe_not_equal, {
      use: 2,
      class: 3,
      style: 4,
      for: 5,
      floatAbove: 0,
      required: 1,
      wrapped: 6,
      shake: 13,
      float: 14,
      setRequired: 15,
      getWidth: 16,
      getElement: 17
    });
  }
  get shake() {
    return this.$$.ctx[13];
  }
  get float() {
    return this.$$.ctx[14];
  }
  get setRequired() {
    return this.$$.ctx[15];
  }
  get getWidth() {
    return this.$$.ctx[16];
  }
  get getElement() {
    return this.$$.ctx[17];
  }
}
function create_fragment$5(ctx) {
  let div;
  let div_class_value;
  let div_style_value;
  let useActions_action;
  let mounted;
  let dispose;
  let div_levels = [
    {
      class: div_class_value = classMap(__spreadValues({
        [ctx[1]]: true,
        "mdc-line-ripple": true,
        "mdc-line-ripple--active": ctx[3]
      }, ctx[5]))
    },
    {
      style: div_style_value = Object.entries(ctx[6]).map(func$2).concat([ctx[2]]).join(" ")
    },
    ctx[8]
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      children(div).forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      ctx[13](div);
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div, ctx[0])),
          action_destroyer(ctx[7].call(null, div))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty & 42 && div_class_value !== (div_class_value = classMap(__spreadValues({
          [ctx2[1]]: true,
          "mdc-line-ripple": true,
          "mdc-line-ripple--active": ctx2[3]
        }, ctx2[5]))) && { class: div_class_value },
        dirty & 68 && div_style_value !== (div_style_value = Object.entries(ctx2[6]).map(func$2).concat([ctx2[2]]).join(" ")) && { style: div_style_value },
        dirty & 256 && ctx2[8]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      ctx[13](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
const func$2 = ([name, value]) => `${name}: ${value};`;
function instance_1$3($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "use",
    "class",
    "style",
    "active",
    "activate",
    "deactivate",
    "setRippleCenter",
    "getElement"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { active = false } = $$props;
  let element2;
  let instance2;
  let internalClasses = {};
  let internalStyles = {};
  onMount(() => {
    instance2 = new MDCLineRippleFoundation({
      addClass,
      removeClass,
      hasClass,
      setStyle: addStyle,
      registerEventHandler: (evtType, handler) => getElement().addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) => getElement().removeEventListener(evtType, handler)
    });
    instance2.init();
    return () => {
      instance2.destroy();
    };
  });
  function hasClass(className2) {
    return className2 in internalClasses ? internalClasses[className2] : getElement().classList.contains(className2);
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      $$invalidate(5, internalClasses[className2] = true, internalClasses);
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      $$invalidate(5, internalClasses[className2] = false, internalClasses);
    }
  }
  function addStyle(name, value) {
    if (internalStyles[name] != value) {
      if (value === "" || value == null) {
        delete internalStyles[name];
        $$invalidate(6, internalStyles);
      } else {
        $$invalidate(6, internalStyles[name] = value, internalStyles);
      }
    }
  }
  function activate() {
    instance2.activate();
  }
  function deactivate() {
    instance2.deactivate();
  }
  function setRippleCenter(xCoordinate) {
    instance2.setRippleCenter(xCoordinate);
  }
  function getElement() {
    return element2;
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(4, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("style" in $$new_props)
      $$invalidate(2, style = $$new_props.style);
    if ("active" in $$new_props)
      $$invalidate(3, active = $$new_props.active);
  };
  return [
    use,
    className,
    style,
    active,
    element2,
    internalClasses,
    internalStyles,
    forwardEvents,
    $$restProps,
    activate,
    deactivate,
    setRippleCenter,
    getElement,
    div_binding
  ];
}
class LineRipple extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1$3, create_fragment$5, safe_not_equal, {
      use: 0,
      class: 1,
      style: 2,
      active: 3,
      activate: 9,
      deactivate: 10,
      setRippleCenter: 11,
      getElement: 12
    });
  }
  get activate() {
    return this.$$.ctx[9];
  }
  get deactivate() {
    return this.$$.ctx[10];
  }
  get setRippleCenter() {
    return this.$$.ctx[11];
  }
  get getElement() {
    return this.$$.ctx[12];
  }
}
function create_if_block$2(ctx) {
  let div;
  let div_style_value;
  let current;
  const default_slot_template = ctx[14].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[13], null);
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      if (default_slot)
        default_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "mdc-notched-outline__notch");
      attr(div, "style", div_style_value = Object.entries(ctx[7]).map(func$1).join(" "));
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8192)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[13], !current ? get_all_dirty_from_scope(ctx2[13]) : get_slot_changes(default_slot_template, ctx2[13], dirty, null), null);
        }
      }
      if (!current || dirty & 128 && div_style_value !== (div_style_value = Object.entries(ctx2[7]).map(func$1).join(" "))) {
        attr(div, "style", div_style_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$4(ctx) {
  let div2;
  let div0;
  let t0;
  let t1;
  let div1;
  let div2_class_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  let if_block = !ctx[3] && create_if_block$2(ctx);
  let div2_levels = [
    {
      class: div2_class_value = classMap(__spreadValues({
        [ctx[1]]: true,
        "mdc-notched-outline": true,
        "mdc-notched-outline--notched": ctx[2],
        "mdc-notched-outline--no-label": ctx[3]
      }, ctx[6]))
    },
    ctx[9]
  ];
  let div2_data = {};
  for (let i = 0; i < div2_levels.length; i += 1) {
    div2_data = assign(div2_data, div2_levels[i]);
  }
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = space();
      if (if_block)
        if_block.c();
      t1 = space();
      div1 = element("div");
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      children(div0).forEach(detach);
      t0 = claim_space(div2_nodes);
      if (if_block)
        if_block.l(div2_nodes);
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      children(div1).forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "mdc-notched-outline__leading");
      attr(div1, "class", "mdc-notched-outline__trailing");
      set_attributes(div2, div2_data);
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      append_hydration(div2, t0);
      if (if_block)
        if_block.m(div2, null);
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      ctx[15](div2);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div2, ctx[0])),
          action_destroyer(ctx[8].call(null, div2)),
          listen(div2, "SMUIFloatingLabel:mount", ctx[16]),
          listen(div2, "SMUIFloatingLabel:unmount", ctx[17])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (!ctx2[3]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div2, t1);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      set_attributes(div2, div2_data = get_spread_update(div2_levels, [
        (!current || dirty & 78 && div2_class_value !== (div2_class_value = classMap(__spreadValues({
          [ctx2[1]]: true,
          "mdc-notched-outline": true,
          "mdc-notched-outline--notched": ctx2[2],
          "mdc-notched-outline--no-label": ctx2[3]
        }, ctx2[6])))) && { class: div2_class_value },
        dirty & 512 && ctx2[9]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if (if_block)
        if_block.d();
      ctx[15](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
const func$1 = ([name, value]) => `${name}: ${value};`;
function instance_1$2($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "class", "notched", "noLabel", "notch", "closeNotch", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { notched = false } = $$props;
  let { noLabel = false } = $$props;
  let element2;
  let instance2;
  let floatingLabel;
  let internalClasses = {};
  let notchStyles = {};
  onMount(() => {
    instance2 = new MDCNotchedOutlineFoundation({
      addClass,
      removeClass,
      setNotchWidthProperty: (width) => addNotchStyle("width", width + "px"),
      removeNotchWidthProperty: () => removeNotchStyle("width")
    });
    instance2.init();
    return () => {
      instance2.destroy();
    };
  });
  function addClass(className2) {
    if (!internalClasses[className2]) {
      $$invalidate(6, internalClasses[className2] = true, internalClasses);
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      $$invalidate(6, internalClasses[className2] = false, internalClasses);
    }
  }
  function addNotchStyle(name, value) {
    if (notchStyles[name] != value) {
      if (value === "" || value == null) {
        delete notchStyles[name];
        $$invalidate(7, notchStyles);
      } else {
        $$invalidate(7, notchStyles[name] = value, notchStyles);
      }
    }
  }
  function removeNotchStyle(name) {
    if (name in notchStyles) {
      delete notchStyles[name];
      $$invalidate(7, notchStyles);
    }
  }
  function notch(notchWidth) {
    instance2.notch(notchWidth);
  }
  function closeNotch() {
    instance2.closeNotch();
  }
  function getElement() {
    return element2;
  }
  function div2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(5, element2);
    });
  }
  const SMUIFloatingLabel_mount_handler = (event) => $$invalidate(4, floatingLabel = event.detail);
  const SMUIFloatingLabel_unmount_handler = () => $$invalidate(4, floatingLabel = void 0);
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("notched" in $$new_props)
      $$invalidate(2, notched = $$new_props.notched);
    if ("noLabel" in $$new_props)
      $$invalidate(3, noLabel = $$new_props.noLabel);
    if ("$$scope" in $$new_props)
      $$invalidate(13, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 16) {
      if (floatingLabel) {
        floatingLabel.addStyle("transition-duration", "0s");
        addClass("mdc-notched-outline--upgraded");
        requestAnimationFrame(() => {
          if (floatingLabel) {
            floatingLabel.removeStyle("transition-duration");
          }
        });
      } else {
        removeClass("mdc-notched-outline--upgraded");
      }
    }
  };
  return [
    use,
    className,
    notched,
    noLabel,
    floatingLabel,
    element2,
    internalClasses,
    notchStyles,
    forwardEvents,
    $$restProps,
    notch,
    closeNotch,
    getElement,
    $$scope,
    slots,
    div2_binding,
    SMUIFloatingLabel_mount_handler,
    SMUIFloatingLabel_unmount_handler
  ];
}
class NotchedOutline extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1$2, create_fragment$4, safe_not_equal, {
      use: 0,
      class: 1,
      notched: 2,
      noLabel: 3,
      notch: 10,
      closeNotch: 11,
      getElement: 12
    });
  }
  get notch() {
    return this.$$.ctx[10];
  }
  get closeNotch() {
    return this.$$.ctx[11];
  }
  get getElement() {
    return this.$$.ctx[12];
  }
}
var HelperLine = classAdderBuilder({
  class: "mdc-text-field-helper-line",
  component: Div
});
var Prefix = classAdderBuilder({
  class: "mdc-text-field__affix mdc-text-field__affix--prefix",
  component: Span
});
var Suffix = classAdderBuilder({
  class: "mdc-text-field__affix mdc-text-field__affix--suffix",
  component: Span
});
function create_fragment$3(ctx) {
  let input;
  let input_class_value;
  let useActions_action;
  let mounted;
  let dispose;
  let input_levels = [
    {
      class: input_class_value = classMap({
        [ctx[1]]: true,
        "mdc-text-field__input": true
      })
    },
    { type: ctx[2] },
    { placeholder: ctx[3] },
    ctx[4],
    ctx[6],
    ctx[10]
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      this.h();
    },
    l(nodes) {
      input = claim_element(nodes, "INPUT", {
        class: true,
        type: true,
        placeholder: true
      });
      this.h();
    },
    h() {
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert_hydration(target, input, anchor);
      if (input.autofocus)
        input.focus();
      ctx[26](input);
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, input, ctx[0])),
          action_destroyer(ctx[7].call(null, input)),
          listen(input, "input", ctx[27]),
          listen(input, "change", ctx[9]),
          listen(input, "blur", ctx[24]),
          listen(input, "focus", ctx[25])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty & 2 && input_class_value !== (input_class_value = classMap({
          [ctx2[1]]: true,
          "mdc-text-field__input": true
        })) && { class: input_class_value },
        dirty & 4 && { type: ctx2[2] },
        dirty & 8 && { placeholder: ctx2[3] },
        dirty & 16 && ctx2[4],
        dirty & 64 && ctx2[6],
        dirty & 1024 && ctx2[10]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[26](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function toNumber(value) {
  if (value === "") {
    const nan = new Number(Number.NaN);
    nan.length = 0;
    return nan;
  }
  return +value;
}
function instance$1($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "use",
    "class",
    "type",
    "placeholder",
    "value",
    "files",
    "dirty",
    "invalid",
    "updateInvalid",
    "emptyValueNull",
    "emptyValueUndefined",
    "getAttr",
    "addAttr",
    "removeAttr",
    "focus",
    "blur",
    "getElement"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let uninitializedValue = () => {
  };
  function isUninitializedValue(value2) {
    return value2 === uninitializedValue;
  }
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { type = "text" } = $$props;
  let { placeholder = " " } = $$props;
  let { value = uninitializedValue } = $$props;
  const valueUninitialized = isUninitializedValue(value);
  if (valueUninitialized) {
    value = "";
  }
  let { files = null } = $$props;
  let { dirty = false } = $$props;
  let { invalid = false } = $$props;
  let { updateInvalid = true } = $$props;
  let { emptyValueNull = value === null } = $$props;
  if (valueUninitialized && emptyValueNull) {
    value = null;
  }
  let { emptyValueUndefined = value === void 0 } = $$props;
  if (valueUninitialized && emptyValueUndefined) {
    value = void 0;
  }
  let element2;
  let internalAttrs = {};
  let valueProp = {};
  onMount(() => {
    if (updateInvalid) {
      $$invalidate(14, invalid = element2.matches(":invalid"));
    }
  });
  function valueUpdater(e) {
    if (type === "file") {
      $$invalidate(12, files = e.currentTarget.files);
      return;
    }
    if (e.currentTarget.value === "" && emptyValueNull) {
      $$invalidate(11, value = null);
      return;
    }
    if (e.currentTarget.value === "" && emptyValueUndefined) {
      $$invalidate(11, value = void 0);
      return;
    }
    switch (type) {
      case "number":
      case "range":
        $$invalidate(11, value = toNumber(e.currentTarget.value));
        break;
      default:
        $$invalidate(11, value = e.currentTarget.value);
        break;
    }
  }
  function changeHandler(e) {
    if (type === "file" || type === "range") {
      valueUpdater(e);
    }
    $$invalidate(13, dirty = true);
    if (updateInvalid) {
      $$invalidate(14, invalid = element2.matches(":invalid"));
    }
  }
  function getAttr(name) {
    var _a;
    return name in internalAttrs ? (_a = internalAttrs[name]) !== null && _a !== void 0 ? _a : null : getElement().getAttribute(name);
  }
  function addAttr(name, value2) {
    if (internalAttrs[name] !== value2) {
      $$invalidate(6, internalAttrs[name] = value2, internalAttrs);
    }
  }
  function removeAttr(name) {
    if (!(name in internalAttrs) || internalAttrs[name] != null) {
      $$invalidate(6, internalAttrs[name] = void 0, internalAttrs);
    }
  }
  function focus() {
    getElement().focus();
  }
  function blur() {
    getElement().blur();
  }
  function getElement() {
    return element2;
  }
  function blur_handler(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler(event) {
    bubble.call(this, $$self, event);
  }
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(5, element2);
    });
  }
  const input_handler = (e) => type !== "file" && valueUpdater(e);
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("type" in $$new_props)
      $$invalidate(2, type = $$new_props.type);
    if ("placeholder" in $$new_props)
      $$invalidate(3, placeholder = $$new_props.placeholder);
    if ("value" in $$new_props)
      $$invalidate(11, value = $$new_props.value);
    if ("files" in $$new_props)
      $$invalidate(12, files = $$new_props.files);
    if ("dirty" in $$new_props)
      $$invalidate(13, dirty = $$new_props.dirty);
    if ("invalid" in $$new_props)
      $$invalidate(14, invalid = $$new_props.invalid);
    if ("updateInvalid" in $$new_props)
      $$invalidate(15, updateInvalid = $$new_props.updateInvalid);
    if ("emptyValueNull" in $$new_props)
      $$invalidate(16, emptyValueNull = $$new_props.emptyValueNull);
    if ("emptyValueUndefined" in $$new_props)
      $$invalidate(17, emptyValueUndefined = $$new_props.emptyValueUndefined);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 2068) {
      if (type === "file") {
        delete valueProp.value;
        $$invalidate(4, valueProp), $$invalidate(2, type), $$invalidate(11, value);
      } else {
        $$invalidate(4, valueProp.value = value == null ? "" : value, valueProp);
      }
    }
  };
  return [
    use,
    className,
    type,
    placeholder,
    valueProp,
    element2,
    internalAttrs,
    forwardEvents,
    valueUpdater,
    changeHandler,
    $$restProps,
    value,
    files,
    dirty,
    invalid,
    updateInvalid,
    emptyValueNull,
    emptyValueUndefined,
    getAttr,
    addAttr,
    removeAttr,
    focus,
    blur,
    getElement,
    blur_handler,
    focus_handler,
    input_binding,
    input_handler
  ];
}
class Input extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$3, safe_not_equal, {
      use: 0,
      class: 1,
      type: 2,
      placeholder: 3,
      value: 11,
      files: 12,
      dirty: 13,
      invalid: 14,
      updateInvalid: 15,
      emptyValueNull: 16,
      emptyValueUndefined: 17,
      getAttr: 18,
      addAttr: 19,
      removeAttr: 20,
      focus: 21,
      blur: 22,
      getElement: 23
    });
  }
  get getAttr() {
    return this.$$.ctx[18];
  }
  get addAttr() {
    return this.$$.ctx[19];
  }
  get removeAttr() {
    return this.$$.ctx[20];
  }
  get focus() {
    return this.$$.ctx[21];
  }
  get blur() {
    return this.$$.ctx[22];
  }
  get getElement() {
    return this.$$.ctx[23];
  }
}
function create_fragment$2(ctx) {
  let textarea;
  let textarea_class_value;
  let textarea_style_value;
  let useActions_action;
  let mounted;
  let dispose;
  let textarea_levels = [
    {
      class: textarea_class_value = classMap({
        [ctx[2]]: true,
        "mdc-text-field__input": true
      })
    },
    {
      style: textarea_style_value = `${ctx[4] ? "" : "resize: none; "}${ctx[3]}`
    },
    ctx[6],
    ctx[9]
  ];
  let textarea_data = {};
  for (let i = 0; i < textarea_levels.length; i += 1) {
    textarea_data = assign(textarea_data, textarea_levels[i]);
  }
  return {
    c() {
      textarea = element("textarea");
      this.h();
    },
    l(nodes) {
      textarea = claim_element(nodes, "TEXTAREA", { class: true, style: true });
      children(textarea).forEach(detach);
      this.h();
    },
    h() {
      set_attributes(textarea, textarea_data);
    },
    m(target, anchor) {
      insert_hydration(target, textarea, anchor);
      if (textarea.autofocus)
        textarea.focus();
      ctx[21](textarea);
      set_input_value(textarea, ctx[0]);
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, textarea, ctx[1])),
          action_destroyer(ctx[7].call(null, textarea)),
          listen(textarea, "change", ctx[8]),
          listen(textarea, "blur", ctx[19]),
          listen(textarea, "focus", ctx[20]),
          listen(textarea, "input", ctx[22])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
        dirty & 4 && textarea_class_value !== (textarea_class_value = classMap({
          [ctx2[2]]: true,
          "mdc-text-field__input": true
        })) && { class: textarea_class_value },
        dirty & 24 && textarea_style_value !== (textarea_style_value = `${ctx2[4] ? "" : "resize: none; "}${ctx2[3]}`) && { style: textarea_style_value },
        dirty & 64 && ctx2[6],
        dirty & 512 && ctx2[9]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 2)
        useActions_action.update.call(null, ctx2[1]);
      if (dirty & 1) {
        set_input_value(textarea, ctx2[0]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(textarea);
      ctx[21](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "use",
    "class",
    "style",
    "value",
    "dirty",
    "invalid",
    "updateInvalid",
    "resizable",
    "getAttr",
    "addAttr",
    "removeAttr",
    "focus",
    "blur",
    "getElement"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { value = "" } = $$props;
  let { dirty = false } = $$props;
  let { invalid = false } = $$props;
  let { updateInvalid = true } = $$props;
  let { resizable = true } = $$props;
  let element2;
  let internalAttrs = {};
  onMount(() => {
    if (updateInvalid) {
      $$invalidate(11, invalid = element2.matches(":invalid"));
    }
  });
  function changeHandler() {
    $$invalidate(10, dirty = true);
    if (updateInvalid) {
      $$invalidate(11, invalid = element2.matches(":invalid"));
    }
  }
  function getAttr(name) {
    var _a;
    return name in internalAttrs ? (_a = internalAttrs[name]) !== null && _a !== void 0 ? _a : null : getElement().getAttribute(name);
  }
  function addAttr(name, value2) {
    if (internalAttrs[name] !== value2) {
      $$invalidate(6, internalAttrs[name] = value2, internalAttrs);
    }
  }
  function removeAttr(name) {
    if (!(name in internalAttrs) || internalAttrs[name] != null) {
      $$invalidate(6, internalAttrs[name] = void 0, internalAttrs);
    }
  }
  function focus() {
    getElement().focus();
  }
  function blur() {
    getElement().blur();
  }
  function getElement() {
    return element2;
  }
  function blur_handler(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler(event) {
    bubble.call(this, $$self, event);
  }
  function textarea_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(5, element2);
    });
  }
  function textarea_input_handler() {
    value = this.value;
    $$invalidate(0, value);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(1, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("style" in $$new_props)
      $$invalidate(3, style = $$new_props.style);
    if ("value" in $$new_props)
      $$invalidate(0, value = $$new_props.value);
    if ("dirty" in $$new_props)
      $$invalidate(10, dirty = $$new_props.dirty);
    if ("invalid" in $$new_props)
      $$invalidate(11, invalid = $$new_props.invalid);
    if ("updateInvalid" in $$new_props)
      $$invalidate(12, updateInvalid = $$new_props.updateInvalid);
    if ("resizable" in $$new_props)
      $$invalidate(4, resizable = $$new_props.resizable);
  };
  return [
    value,
    use,
    className,
    style,
    resizable,
    element2,
    internalAttrs,
    forwardEvents,
    changeHandler,
    $$restProps,
    dirty,
    invalid,
    updateInvalid,
    getAttr,
    addAttr,
    removeAttr,
    focus,
    blur,
    getElement,
    blur_handler,
    focus_handler,
    textarea_binding,
    textarea_input_handler
  ];
}
class Textarea extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment$2, safe_not_equal, {
      use: 1,
      class: 2,
      style: 3,
      value: 0,
      dirty: 10,
      invalid: 11,
      updateInvalid: 12,
      resizable: 4,
      getAttr: 13,
      addAttr: 14,
      removeAttr: 15,
      focus: 16,
      blur: 17,
      getElement: 18
    });
  }
  get getAttr() {
    return this.$$.ctx[13];
  }
  get addAttr() {
    return this.$$.ctx[14];
  }
  get removeAttr() {
    return this.$$.ctx[15];
  }
  get focus() {
    return this.$$.ctx[16];
  }
  get blur() {
    return this.$$.ctx[17];
  }
  get getElement() {
    return this.$$.ctx[18];
  }
}
const get_helper_slot_changes = (dirty) => ({});
const get_helper_slot_context = (ctx) => ({});
const get_ripple_slot_changes = (dirty) => ({});
const get_ripple_slot_context = (ctx) => ({});
const get_trailingIcon_slot_changes_1 = (dirty) => ({});
const get_trailingIcon_slot_context_1 = (ctx) => ({});
const get_leadingIcon_slot_changes_1 = (dirty) => ({});
const get_leadingIcon_slot_context_1 = (ctx) => ({});
const get_label_slot_changes_2 = (dirty) => ({});
const get_label_slot_context_2 = (ctx) => ({});
const get_trailingIcon_slot_changes = (dirty) => ({});
const get_trailingIcon_slot_context = (ctx) => ({});
const get_suffix_slot_changes = (dirty) => ({});
const get_suffix_slot_context = (ctx) => ({});
const get_prefix_slot_changes = (dirty) => ({});
const get_prefix_slot_context = (ctx) => ({});
const get_internalCounter_slot_changes = (dirty) => ({});
const get_internalCounter_slot_context = (ctx) => ({});
const get_leadingIcon_slot_changes = (dirty) => ({});
const get_leadingIcon_slot_context = (ctx) => ({});
const get_label_slot_changes_1 = (dirty) => ({});
const get_label_slot_context_1 = (ctx) => ({});
const get_label_slot_changes = (dirty) => ({});
const get_label_slot_context = (ctx) => ({});
function create_else_block_1(ctx) {
  let div;
  let t0;
  let contextfragment0;
  let t1;
  let t2;
  let contextfragment1;
  let t3;
  let div_class_value;
  let div_style_value;
  let Ripple_action;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const label_slot_template = ctx[51].label;
  const label_slot = create_slot(label_slot_template, ctx, ctx[90], get_label_slot_context_2);
  contextfragment0 = new ContextFragment({
    props: {
      key: "SMUI:textfield:icon:leading",
      value: true,
      $$slots: { default: [create_default_slot_9] },
      $$scope: { ctx }
    }
  });
  const default_slot_template = ctx[51].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[90], null);
  contextfragment1 = new ContextFragment({
    props: {
      key: "SMUI:textfield:icon:leading",
      value: false,
      $$slots: { default: [create_default_slot_8] },
      $$scope: { ctx }
    }
  });
  const ripple_slot_template = ctx[51].ripple;
  const ripple_slot = create_slot(ripple_slot_template, ctx, ctx[90], get_ripple_slot_context);
  let div_levels = [
    {
      class: div_class_value = classMap(__spreadValues({
        [ctx[9]]: true,
        "mdc-text-field": true,
        "mdc-text-field--disabled": ctx[12],
        "mdc-text-field--textarea": ctx[14],
        "mdc-text-field--filled": ctx[15] === "filled",
        "mdc-text-field--outlined": ctx[15] === "outlined",
        "smui-text-field--standard": ctx[15] === "standard" && !ctx[14],
        "mdc-text-field--no-label": ctx[16] || !ctx[42].label,
        "mdc-text-field--with-leading-icon": ctx[42].leadingIcon,
        "mdc-text-field--with-trailing-icon": ctx[42].trailingIcon,
        "mdc-text-field--invalid": ctx[1]
      }, ctx[25]))
    },
    {
      style: div_style_value = Object.entries(ctx[26]).map(func_1).concat([ctx[10]]).join(" ")
    },
    exclude(ctx[41], ["input$", "label$", "ripple$", "outline$", "helperLine$"])
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (label_slot)
        label_slot.c();
      t0 = space();
      create_component(contextfragment0.$$.fragment);
      t1 = space();
      if (default_slot)
        default_slot.c();
      t2 = space();
      create_component(contextfragment1.$$.fragment);
      t3 = space();
      if (ripple_slot)
        ripple_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      if (label_slot)
        label_slot.l(div_nodes);
      t0 = claim_space(div_nodes);
      claim_component(contextfragment0.$$.fragment, div_nodes);
      t1 = claim_space(div_nodes);
      if (default_slot)
        default_slot.l(div_nodes);
      t2 = claim_space(div_nodes);
      claim_component(contextfragment1.$$.fragment, div_nodes);
      t3 = claim_space(div_nodes);
      if (ripple_slot)
        ripple_slot.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (label_slot) {
        label_slot.m(div, null);
      }
      append_hydration(div, t0);
      mount_component(contextfragment0, div, null);
      append_hydration(div, t1);
      if (default_slot) {
        default_slot.m(div, null);
      }
      append_hydration(div, t2);
      mount_component(contextfragment1, div, null);
      append_hydration(div, t3);
      if (ripple_slot) {
        ripple_slot.m(div, null);
      }
      ctx[80](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(Ripple_action = Ripple.call(null, div, {
            ripple: ctx[11],
            unbounded: false,
            addClass: ctx[38],
            removeClass: ctx[39],
            addStyle: ctx[40]
          })),
          action_destroyer(useActions_action = useActions.call(null, div, ctx[8])),
          action_destroyer(ctx[34].call(null, div)),
          listen(div, "SMUITextfieldLeadingIcon:mount", ctx[81]),
          listen(div, "SMUITextfieldLeadingIcon:unmount", ctx[82]),
          listen(div, "SMUITextfieldTrailingIcon:mount", ctx[83]),
          listen(div, "SMUITextfieldTrailingIcon:unmount", ctx[84])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (label_slot) {
        if (label_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(label_slot, label_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(label_slot_template, ctx2[90], dirty, get_label_slot_changes_2), get_label_slot_context_2);
        }
      }
      const contextfragment0_changes = {};
      if (dirty[2] & 268435456) {
        contextfragment0_changes.$$scope = { dirty, ctx: ctx2 };
      }
      contextfragment0.$set(contextfragment0_changes);
      if (default_slot) {
        if (default_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(default_slot_template, ctx2[90], dirty, null), null);
        }
      }
      const contextfragment1_changes = {};
      if (dirty[2] & 268435456) {
        contextfragment1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      contextfragment1.$set(contextfragment1_changes);
      if (ripple_slot) {
        if (ripple_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(ripple_slot, ripple_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(ripple_slot_template, ctx2[90], dirty, get_ripple_slot_changes), get_ripple_slot_context);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        (!current || dirty[0] & 33673730 | dirty[1] & 2048 && div_class_value !== (div_class_value = classMap(__spreadValues({
          [ctx2[9]]: true,
          "mdc-text-field": true,
          "mdc-text-field--disabled": ctx2[12],
          "mdc-text-field--textarea": ctx2[14],
          "mdc-text-field--filled": ctx2[15] === "filled",
          "mdc-text-field--outlined": ctx2[15] === "outlined",
          "smui-text-field--standard": ctx2[15] === "standard" && !ctx2[14],
          "mdc-text-field--no-label": ctx2[16] || !ctx2[42].label,
          "mdc-text-field--with-leading-icon": ctx2[42].leadingIcon,
          "mdc-text-field--with-trailing-icon": ctx2[42].trailingIcon,
          "mdc-text-field--invalid": ctx2[1]
        }, ctx2[25])))) && { class: div_class_value },
        (!current || dirty[0] & 67109888 && div_style_value !== (div_style_value = Object.entries(ctx2[26]).map(func_1).concat([ctx2[10]]).join(" "))) && { style: div_style_value },
        dirty[1] & 1024 && exclude(ctx2[41], ["input$", "label$", "ripple$", "outline$", "helperLine$"])
      ]));
      if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & 2048)
        Ripple_action.update.call(null, {
          ripple: ctx2[11],
          unbounded: false,
          addClass: ctx2[38],
          removeClass: ctx2[39],
          addStyle: ctx2[40]
        });
      if (useActions_action && is_function(useActions_action.update) && dirty[0] & 256)
        useActions_action.update.call(null, ctx2[8]);
    },
    i(local) {
      if (current)
        return;
      transition_in(label_slot, local);
      transition_in(contextfragment0.$$.fragment, local);
      transition_in(default_slot, local);
      transition_in(contextfragment1.$$.fragment, local);
      transition_in(ripple_slot, local);
      current = true;
    },
    o(local) {
      transition_out(label_slot, local);
      transition_out(contextfragment0.$$.fragment, local);
      transition_out(default_slot, local);
      transition_out(contextfragment1.$$.fragment, local);
      transition_out(ripple_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (label_slot)
        label_slot.d(detaching);
      destroy_component(contextfragment0);
      if (default_slot)
        default_slot.d(detaching);
      destroy_component(contextfragment1);
      if (ripple_slot)
        ripple_slot.d(detaching);
      ctx[80](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1(ctx) {
  let label_1;
  let t0;
  let t1;
  let contextfragment0;
  let t2;
  let t3;
  let current_block_type_index;
  let if_block2;
  let t4;
  let contextfragment1;
  let t5;
  let label_1_class_value;
  let label_1_style_value;
  let Ripple_action;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  let if_block0 = !ctx[14] && ctx[15] !== "outlined" && create_if_block_8(ctx);
  let if_block1 = (ctx[14] || ctx[15] === "outlined") && create_if_block_6(ctx);
  contextfragment0 = new ContextFragment({
    props: {
      key: "SMUI:textfield:icon:leading",
      value: true,
      $$slots: { default: [create_default_slot_4] },
      $$scope: { ctx }
    }
  });
  const default_slot_template = ctx[51].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[90], null);
  const if_block_creators = [create_if_block_3, create_else_block$1];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[14] && typeof ctx2[0] === "string")
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_1(ctx);
  if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  contextfragment1 = new ContextFragment({
    props: {
      key: "SMUI:textfield:icon:leading",
      value: false,
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  let if_block3 = !ctx[14] && ctx[15] !== "outlined" && ctx[11] && create_if_block_2(ctx);
  let label_1_levels = [
    {
      class: label_1_class_value = classMap(__spreadValues({
        [ctx[9]]: true,
        "mdc-text-field": true,
        "mdc-text-field--disabled": ctx[12],
        "mdc-text-field--textarea": ctx[14],
        "mdc-text-field--filled": ctx[15] === "filled",
        "mdc-text-field--outlined": ctx[15] === "outlined",
        "smui-text-field--standard": ctx[15] === "standard" && !ctx[14],
        "mdc-text-field--no-label": ctx[16] || ctx[17] == null && !ctx[42].label,
        "mdc-text-field--label-floating": ctx[28] || ctx[0] != null && ctx[0] !== "",
        "mdc-text-field--with-leading-icon": ctx[35](ctx[22]) ? ctx[42].leadingIcon : ctx[22],
        "mdc-text-field--with-trailing-icon": ctx[35](ctx[23]) ? ctx[42].trailingIcon : ctx[23],
        "mdc-text-field--with-internal-counter": ctx[14] && ctx[42].internalCounter,
        "mdc-text-field--invalid": ctx[1]
      }, ctx[25]))
    },
    {
      style: label_1_style_value = Object.entries(ctx[26]).map(func).concat([ctx[10]]).join(" ")
    },
    {
      for: void 0
    },
    exclude(ctx[41], ["input$", "label$", "ripple$", "outline$", "helperLine$"])
  ];
  let label_1_data = {};
  for (let i = 0; i < label_1_levels.length; i += 1) {
    label_1_data = assign(label_1_data, label_1_levels[i]);
  }
  return {
    c() {
      label_1 = element("label");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      create_component(contextfragment0.$$.fragment);
      t2 = space();
      if (default_slot)
        default_slot.c();
      t3 = space();
      if_block2.c();
      t4 = space();
      create_component(contextfragment1.$$.fragment);
      t5 = space();
      if (if_block3)
        if_block3.c();
      this.h();
    },
    l(nodes) {
      label_1 = claim_element(nodes, "LABEL", { class: true, style: true, for: true });
      var label_1_nodes = children(label_1);
      if (if_block0)
        if_block0.l(label_1_nodes);
      t0 = claim_space(label_1_nodes);
      if (if_block1)
        if_block1.l(label_1_nodes);
      t1 = claim_space(label_1_nodes);
      claim_component(contextfragment0.$$.fragment, label_1_nodes);
      t2 = claim_space(label_1_nodes);
      if (default_slot)
        default_slot.l(label_1_nodes);
      t3 = claim_space(label_1_nodes);
      if_block2.l(label_1_nodes);
      t4 = claim_space(label_1_nodes);
      claim_component(contextfragment1.$$.fragment, label_1_nodes);
      t5 = claim_space(label_1_nodes);
      if (if_block3)
        if_block3.l(label_1_nodes);
      label_1_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(label_1, label_1_data);
    },
    m(target, anchor) {
      insert_hydration(target, label_1, anchor);
      if (if_block0)
        if_block0.m(label_1, null);
      append_hydration(label_1, t0);
      if (if_block1)
        if_block1.m(label_1, null);
      append_hydration(label_1, t1);
      mount_component(contextfragment0, label_1, null);
      append_hydration(label_1, t2);
      if (default_slot) {
        default_slot.m(label_1, null);
      }
      append_hydration(label_1, t3);
      if_blocks[current_block_type_index].m(label_1, null);
      append_hydration(label_1, t4);
      mount_component(contextfragment1, label_1, null);
      append_hydration(label_1, t5);
      if (if_block3)
        if_block3.m(label_1, null);
      ctx[73](label_1);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(Ripple_action = Ripple.call(null, label_1, {
            ripple: !ctx[14] && ctx[15] === "filled",
            unbounded: false,
            addClass: ctx[38],
            removeClass: ctx[39],
            addStyle: ctx[40],
            eventTarget: ctx[33],
            activeTarget: ctx[33],
            initPromise: ctx[37]
          })),
          action_destroyer(useActions_action = useActions.call(null, label_1, ctx[8])),
          action_destroyer(ctx[34].call(null, label_1)),
          listen(label_1, "SMUITextfieldLeadingIcon:mount", ctx[74]),
          listen(label_1, "SMUITextfieldLeadingIcon:unmount", ctx[75]),
          listen(label_1, "SMUITextfieldTrailingIcon:mount", ctx[76]),
          listen(label_1, "SMUITextfieldTrailingIcon:unmount", ctx[77]),
          listen(label_1, "SMUITextfieldCharacterCounter:mount", ctx[78]),
          listen(label_1, "SMUITextfieldCharacterCounter:unmount", ctx[79])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (!ctx2[14] && ctx2[15] !== "outlined") {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & 49152) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_8(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(label_1, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (ctx2[14] || ctx2[15] === "outlined") {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & 49152) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_6(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(label_1, t1);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      const contextfragment0_changes = {};
      if (dirty[2] & 268435456) {
        contextfragment0_changes.$$scope = { dirty, ctx: ctx2 };
      }
      contextfragment0.$set(contextfragment0_changes);
      if (default_slot) {
        if (default_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(default_slot_template, ctx2[90], dirty, null), null);
        }
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block2 = if_blocks[current_block_type_index];
        if (!if_block2) {
          if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block2.c();
        } else {
          if_block2.p(ctx2, dirty);
        }
        transition_in(if_block2, 1);
        if_block2.m(label_1, t4);
      }
      const contextfragment1_changes = {};
      if (dirty[2] & 268435456) {
        contextfragment1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      contextfragment1.$set(contextfragment1_changes);
      if (!ctx2[14] && ctx2[15] !== "outlined" && ctx2[11]) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
          if (dirty[0] & 51200) {
            transition_in(if_block3, 1);
          }
        } else {
          if_block3 = create_if_block_2(ctx2);
          if_block3.c();
          transition_in(if_block3, 1);
          if_block3.m(label_1, null);
        }
      } else if (if_block3) {
        group_outros();
        transition_out(if_block3, 1, 1, () => {
          if_block3 = null;
        });
        check_outros();
      }
      set_attributes(label_1, label_1_data = get_spread_update(label_1_levels, [
        (!current || dirty[0] & 314823171 | dirty[1] & 2048 && label_1_class_value !== (label_1_class_value = classMap(__spreadValues({
          [ctx2[9]]: true,
          "mdc-text-field": true,
          "mdc-text-field--disabled": ctx2[12],
          "mdc-text-field--textarea": ctx2[14],
          "mdc-text-field--filled": ctx2[15] === "filled",
          "mdc-text-field--outlined": ctx2[15] === "outlined",
          "smui-text-field--standard": ctx2[15] === "standard" && !ctx2[14],
          "mdc-text-field--no-label": ctx2[16] || ctx2[17] == null && !ctx2[42].label,
          "mdc-text-field--label-floating": ctx2[28] || ctx2[0] != null && ctx2[0] !== "",
          "mdc-text-field--with-leading-icon": ctx2[35](ctx2[22]) ? ctx2[42].leadingIcon : ctx2[22],
          "mdc-text-field--with-trailing-icon": ctx2[35](ctx2[23]) ? ctx2[42].trailingIcon : ctx2[23],
          "mdc-text-field--with-internal-counter": ctx2[14] && ctx2[42].internalCounter,
          "mdc-text-field--invalid": ctx2[1]
        }, ctx2[25])))) && { class: label_1_class_value },
        (!current || dirty[0] & 67109888 && label_1_style_value !== (label_1_style_value = Object.entries(ctx2[26]).map(func).concat([ctx2[10]]).join(" "))) && { style: label_1_style_value },
        {
          for: void 0
        },
        dirty[1] & 1024 && exclude(ctx2[41], ["input$", "label$", "ripple$", "outline$", "helperLine$"])
      ]));
      if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & 49152 | dirty[1] & 4)
        Ripple_action.update.call(null, {
          ripple: !ctx2[14] && ctx2[15] === "filled",
          unbounded: false,
          addClass: ctx2[38],
          removeClass: ctx2[39],
          addStyle: ctx2[40],
          eventTarget: ctx2[33],
          activeTarget: ctx2[33],
          initPromise: ctx2[37]
        });
      if (useActions_action && is_function(useActions_action.update) && dirty[0] & 256)
        useActions_action.update.call(null, ctx2[8]);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(contextfragment0.$$.fragment, local);
      transition_in(default_slot, local);
      transition_in(if_block2);
      transition_in(contextfragment1.$$.fragment, local);
      transition_in(if_block3);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(contextfragment0.$$.fragment, local);
      transition_out(default_slot, local);
      transition_out(if_block2);
      transition_out(contextfragment1.$$.fragment, local);
      transition_out(if_block3);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(label_1);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      destroy_component(contextfragment0);
      if (default_slot)
        default_slot.d(detaching);
      if_blocks[current_block_type_index].d();
      destroy_component(contextfragment1);
      if (if_block3)
        if_block3.d();
      ctx[73](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_default_slot_9(ctx) {
  let current;
  const leadingIcon_slot_template = ctx[51].leadingIcon;
  const leadingIcon_slot = create_slot(leadingIcon_slot_template, ctx, ctx[90], get_leadingIcon_slot_context_1);
  return {
    c() {
      if (leadingIcon_slot)
        leadingIcon_slot.c();
    },
    l(nodes) {
      if (leadingIcon_slot)
        leadingIcon_slot.l(nodes);
    },
    m(target, anchor) {
      if (leadingIcon_slot) {
        leadingIcon_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (leadingIcon_slot) {
        if (leadingIcon_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(leadingIcon_slot, leadingIcon_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(leadingIcon_slot_template, ctx2[90], dirty, get_leadingIcon_slot_changes_1), get_leadingIcon_slot_context_1);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(leadingIcon_slot, local);
      current = true;
    },
    o(local) {
      transition_out(leadingIcon_slot, local);
      current = false;
    },
    d(detaching) {
      if (leadingIcon_slot)
        leadingIcon_slot.d(detaching);
    }
  };
}
function create_default_slot_8(ctx) {
  let current;
  const trailingIcon_slot_template = ctx[51].trailingIcon;
  const trailingIcon_slot = create_slot(trailingIcon_slot_template, ctx, ctx[90], get_trailingIcon_slot_context_1);
  return {
    c() {
      if (trailingIcon_slot)
        trailingIcon_slot.c();
    },
    l(nodes) {
      if (trailingIcon_slot)
        trailingIcon_slot.l(nodes);
    },
    m(target, anchor) {
      if (trailingIcon_slot) {
        trailingIcon_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (trailingIcon_slot) {
        if (trailingIcon_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(trailingIcon_slot, trailingIcon_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(trailingIcon_slot_template, ctx2[90], dirty, get_trailingIcon_slot_changes_1), get_trailingIcon_slot_context_1);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(trailingIcon_slot, local);
      current = true;
    },
    o(local) {
      transition_out(trailingIcon_slot, local);
      current = false;
    },
    d(detaching) {
      if (trailingIcon_slot)
        trailingIcon_slot.d(detaching);
    }
  };
}
function create_if_block_8(ctx) {
  let t;
  let if_block1_anchor;
  let current;
  let if_block0 = ctx[15] === "filled" && create_if_block_10();
  let if_block1 = !ctx[16] && (ctx[17] != null || ctx[42].label) && create_if_block_9(ctx);
  return {
    c() {
      if (if_block0)
        if_block0.c();
      t = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
    },
    l(nodes) {
      if (if_block0)
        if_block0.l(nodes);
      t = claim_space(nodes);
      if (if_block1)
        if_block1.l(nodes);
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      if (if_block0)
        if_block0.m(target, anchor);
      insert_hydration(target, t, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert_hydration(target, if_block1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (ctx2[15] === "filled") {
        if (if_block0)
          ;
        else {
          if_block0 = create_if_block_10();
          if_block0.c();
          if_block0.m(t.parentNode, t);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (!ctx2[16] && (ctx2[17] != null || ctx2[42].label)) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & 196608 | dirty[1] & 2048) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_9(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (if_block0)
        if_block0.d(detaching);
      if (detaching)
        detach(t);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
function create_if_block_10(ctx) {
  let span;
  return {
    c() {
      span = element("span");
      this.h();
    },
    l(nodes) {
      span = claim_element(nodes, "SPAN", { class: true });
      children(span).forEach(detach);
      this.h();
    },
    h() {
      attr(span, "class", "mdc-text-field__ripple");
    },
    m(target, anchor) {
      insert_hydration(target, span, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(span);
    }
  };
}
function create_if_block_9(ctx) {
  let floatinglabel;
  let current;
  const floatinglabel_spread_levels = [
    {
      floatAbove: ctx[28] || ctx[0] != null && ctx[0] !== ""
    },
    { required: ctx[13] },
    { wrapped: true },
    prefixFilter(ctx[41], "label$")
  ];
  let floatinglabel_props = {
    $$slots: { default: [create_default_slot_7] },
    $$scope: { ctx }
  };
  for (let i = 0; i < floatinglabel_spread_levels.length; i += 1) {
    floatinglabel_props = assign(floatinglabel_props, floatinglabel_spread_levels[i]);
  }
  floatinglabel = new FloatingLabel({ props: floatinglabel_props });
  ctx[52](floatinglabel);
  return {
    c() {
      create_component(floatinglabel.$$.fragment);
    },
    l(nodes) {
      claim_component(floatinglabel.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(floatinglabel, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const floatinglabel_changes = dirty[0] & 268443649 | dirty[1] & 1024 ? get_spread_update(floatinglabel_spread_levels, [
        dirty[0] & 268435457 && {
          floatAbove: ctx2[28] || ctx2[0] != null && ctx2[0] !== ""
        },
        dirty[0] & 8192 && { required: ctx2[13] },
        floatinglabel_spread_levels[2],
        dirty[1] & 1024 && get_spread_object(prefixFilter(ctx2[41], "label$"))
      ]) : {};
      if (dirty[0] & 131072 | dirty[2] & 268435456) {
        floatinglabel_changes.$$scope = { dirty, ctx: ctx2 };
      }
      floatinglabel.$set(floatinglabel_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(floatinglabel.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(floatinglabel.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[52](null);
      destroy_component(floatinglabel, detaching);
    }
  };
}
function create_default_slot_7(ctx) {
  let t_value = (ctx[17] == null ? "" : ctx[17]) + "";
  let t;
  let current;
  const label_slot_template = ctx[51].label;
  const label_slot = create_slot(label_slot_template, ctx, ctx[90], get_label_slot_context);
  return {
    c() {
      t = text(t_value);
      if (label_slot)
        label_slot.c();
    },
    l(nodes) {
      t = claim_text(nodes, t_value);
      if (label_slot)
        label_slot.l(nodes);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
      if (label_slot) {
        label_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if ((!current || dirty[0] & 131072) && t_value !== (t_value = (ctx2[17] == null ? "" : ctx2[17]) + ""))
        set_data(t, t_value);
      if (label_slot) {
        if (label_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(label_slot, label_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(label_slot_template, ctx2[90], dirty, get_label_slot_changes), get_label_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(label_slot, local);
      current = true;
    },
    o(local) {
      transition_out(label_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(t);
      if (label_slot)
        label_slot.d(detaching);
    }
  };
}
function create_if_block_6(ctx) {
  let notchedoutline;
  let current;
  const notchedoutline_spread_levels = [
    {
      noLabel: ctx[16] || ctx[17] == null && !ctx[42].label
    },
    prefixFilter(ctx[41], "outline$")
  ];
  let notchedoutline_props = {
    $$slots: { default: [create_default_slot_5] },
    $$scope: { ctx }
  };
  for (let i = 0; i < notchedoutline_spread_levels.length; i += 1) {
    notchedoutline_props = assign(notchedoutline_props, notchedoutline_spread_levels[i]);
  }
  notchedoutline = new NotchedOutline({ props: notchedoutline_props });
  ctx[54](notchedoutline);
  return {
    c() {
      create_component(notchedoutline.$$.fragment);
    },
    l(nodes) {
      claim_component(notchedoutline.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(notchedoutline, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const notchedoutline_changes = dirty[0] & 196608 | dirty[1] & 3072 ? get_spread_update(notchedoutline_spread_levels, [
        dirty[0] & 196608 | dirty[1] & 2048 && {
          noLabel: ctx2[16] || ctx2[17] == null && !ctx2[42].label
        },
        dirty[1] & 1024 && get_spread_object(prefixFilter(ctx2[41], "outline$"))
      ]) : {};
      if (dirty[0] & 268640289 | dirty[1] & 3072 | dirty[2] & 268435456) {
        notchedoutline_changes.$$scope = { dirty, ctx: ctx2 };
      }
      notchedoutline.$set(notchedoutline_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(notchedoutline.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(notchedoutline.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[54](null);
      destroy_component(notchedoutline, detaching);
    }
  };
}
function create_if_block_7(ctx) {
  let floatinglabel;
  let current;
  const floatinglabel_spread_levels = [
    {
      floatAbove: ctx[28] || ctx[0] != null && ctx[0] !== ""
    },
    { required: ctx[13] },
    { wrapped: true },
    prefixFilter(ctx[41], "label$")
  ];
  let floatinglabel_props = {
    $$slots: { default: [create_default_slot_6] },
    $$scope: { ctx }
  };
  for (let i = 0; i < floatinglabel_spread_levels.length; i += 1) {
    floatinglabel_props = assign(floatinglabel_props, floatinglabel_spread_levels[i]);
  }
  floatinglabel = new FloatingLabel({ props: floatinglabel_props });
  ctx[53](floatinglabel);
  return {
    c() {
      create_component(floatinglabel.$$.fragment);
    },
    l(nodes) {
      claim_component(floatinglabel.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(floatinglabel, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const floatinglabel_changes = dirty[0] & 268443649 | dirty[1] & 1024 ? get_spread_update(floatinglabel_spread_levels, [
        dirty[0] & 268435457 && {
          floatAbove: ctx2[28] || ctx2[0] != null && ctx2[0] !== ""
        },
        dirty[0] & 8192 && { required: ctx2[13] },
        floatinglabel_spread_levels[2],
        dirty[1] & 1024 && get_spread_object(prefixFilter(ctx2[41], "label$"))
      ]) : {};
      if (dirty[0] & 131072 | dirty[2] & 268435456) {
        floatinglabel_changes.$$scope = { dirty, ctx: ctx2 };
      }
      floatinglabel.$set(floatinglabel_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(floatinglabel.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(floatinglabel.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[53](null);
      destroy_component(floatinglabel, detaching);
    }
  };
}
function create_default_slot_6(ctx) {
  let t_value = (ctx[17] == null ? "" : ctx[17]) + "";
  let t;
  let current;
  const label_slot_template = ctx[51].label;
  const label_slot = create_slot(label_slot_template, ctx, ctx[90], get_label_slot_context_1);
  return {
    c() {
      t = text(t_value);
      if (label_slot)
        label_slot.c();
    },
    l(nodes) {
      t = claim_text(nodes, t_value);
      if (label_slot)
        label_slot.l(nodes);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
      if (label_slot) {
        label_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if ((!current || dirty[0] & 131072) && t_value !== (t_value = (ctx2[17] == null ? "" : ctx2[17]) + ""))
        set_data(t, t_value);
      if (label_slot) {
        if (label_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(label_slot, label_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(label_slot_template, ctx2[90], dirty, get_label_slot_changes_1), get_label_slot_context_1);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(label_slot, local);
      current = true;
    },
    o(local) {
      transition_out(label_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(t);
      if (label_slot)
        label_slot.d(detaching);
    }
  };
}
function create_default_slot_5(ctx) {
  let if_block_anchor;
  let current;
  let if_block = !ctx[16] && (ctx[17] != null || ctx[42].label) && create_if_block_7(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    l(nodes) {
      if (if_block)
        if_block.l(nodes);
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (!ctx2[16] && (ctx2[17] != null || ctx2[42].label)) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & 196608 | dirty[1] & 2048) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_7(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_default_slot_4(ctx) {
  let current;
  const leadingIcon_slot_template = ctx[51].leadingIcon;
  const leadingIcon_slot = create_slot(leadingIcon_slot_template, ctx, ctx[90], get_leadingIcon_slot_context);
  return {
    c() {
      if (leadingIcon_slot)
        leadingIcon_slot.c();
    },
    l(nodes) {
      if (leadingIcon_slot)
        leadingIcon_slot.l(nodes);
    },
    m(target, anchor) {
      if (leadingIcon_slot) {
        leadingIcon_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (leadingIcon_slot) {
        if (leadingIcon_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(leadingIcon_slot, leadingIcon_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(leadingIcon_slot_template, ctx2[90], dirty, get_leadingIcon_slot_changes), get_leadingIcon_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(leadingIcon_slot, local);
      current = true;
    },
    o(local) {
      transition_out(leadingIcon_slot, local);
      current = false;
    },
    d(detaching) {
      if (leadingIcon_slot)
        leadingIcon_slot.d(detaching);
    }
  };
}
function create_else_block$1(ctx) {
  let t0;
  let t1;
  let input_1;
  let updating_value;
  let updating_files;
  let updating_dirty;
  let updating_invalid;
  let t2;
  let t3;
  let current;
  const prefix_slot_template = ctx[51].prefix;
  const prefix_slot = create_slot(prefix_slot_template, ctx, ctx[90], get_prefix_slot_context);
  let if_block0 = ctx[20] != null && create_if_block_5(ctx);
  const input_1_spread_levels = [
    { type: ctx[18] },
    { disabled: ctx[12] },
    { required: ctx[13] },
    { updateInvalid: ctx[19] },
    { "aria-controls": ctx[27] },
    { "aria-describedby": ctx[27] },
    ctx[16] && ctx[17] != null ? { placeholder: ctx[17] } : {},
    prefixFilter(ctx[41], "input$")
  ];
  function input_1_value_binding(value) {
    ctx[64](value);
  }
  function input_1_files_binding(value) {
    ctx[65](value);
  }
  function input_1_dirty_binding(value) {
    ctx[66](value);
  }
  function input_1_invalid_binding(value) {
    ctx[67](value);
  }
  let input_1_props = {};
  for (let i = 0; i < input_1_spread_levels.length; i += 1) {
    input_1_props = assign(input_1_props, input_1_spread_levels[i]);
  }
  if (ctx[0] !== void 0) {
    input_1_props.value = ctx[0];
  }
  if (ctx[3] !== void 0) {
    input_1_props.files = ctx[3];
  }
  if (ctx[4] !== void 0) {
    input_1_props.dirty = ctx[4];
  }
  if (ctx[1] !== void 0) {
    input_1_props.invalid = ctx[1];
  }
  input_1 = new Input({ props: input_1_props });
  ctx[63](input_1);
  binding_callbacks.push(() => bind(input_1, "value", input_1_value_binding));
  binding_callbacks.push(() => bind(input_1, "files", input_1_files_binding));
  binding_callbacks.push(() => bind(input_1, "dirty", input_1_dirty_binding));
  binding_callbacks.push(() => bind(input_1, "invalid", input_1_invalid_binding));
  input_1.$on("blur", ctx[68]);
  input_1.$on("focus", ctx[69]);
  input_1.$on("blur", ctx[70]);
  input_1.$on("focus", ctx[71]);
  let if_block1 = ctx[21] != null && create_if_block_4(ctx);
  const suffix_slot_template = ctx[51].suffix;
  const suffix_slot = create_slot(suffix_slot_template, ctx, ctx[90], get_suffix_slot_context);
  return {
    c() {
      if (prefix_slot)
        prefix_slot.c();
      t0 = space();
      if (if_block0)
        if_block0.c();
      t1 = space();
      create_component(input_1.$$.fragment);
      t2 = space();
      if (if_block1)
        if_block1.c();
      t3 = space();
      if (suffix_slot)
        suffix_slot.c();
    },
    l(nodes) {
      if (prefix_slot)
        prefix_slot.l(nodes);
      t0 = claim_space(nodes);
      if (if_block0)
        if_block0.l(nodes);
      t1 = claim_space(nodes);
      claim_component(input_1.$$.fragment, nodes);
      t2 = claim_space(nodes);
      if (if_block1)
        if_block1.l(nodes);
      t3 = claim_space(nodes);
      if (suffix_slot)
        suffix_slot.l(nodes);
    },
    m(target, anchor) {
      if (prefix_slot) {
        prefix_slot.m(target, anchor);
      }
      insert_hydration(target, t0, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert_hydration(target, t1, anchor);
      mount_component(input_1, target, anchor);
      insert_hydration(target, t2, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert_hydration(target, t3, anchor);
      if (suffix_slot) {
        suffix_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (prefix_slot) {
        if (prefix_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(prefix_slot, prefix_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(prefix_slot_template, ctx2[90], dirty, get_prefix_slot_changes), get_prefix_slot_context);
        }
      }
      if (ctx2[20] != null) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & 1048576) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_5(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(t1.parentNode, t1);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      const input_1_changes = dirty[0] & 135213056 | dirty[1] & 1024 ? get_spread_update(input_1_spread_levels, [
        dirty[0] & 262144 && { type: ctx2[18] },
        dirty[0] & 4096 && { disabled: ctx2[12] },
        dirty[0] & 8192 && { required: ctx2[13] },
        dirty[0] & 524288 && { updateInvalid: ctx2[19] },
        dirty[0] & 134217728 && { "aria-controls": ctx2[27] },
        dirty[0] & 134217728 && { "aria-describedby": ctx2[27] },
        dirty[0] & 196608 && get_spread_object(ctx2[16] && ctx2[17] != null ? { placeholder: ctx2[17] } : {}),
        dirty[1] & 1024 && get_spread_object(prefixFilter(ctx2[41], "input$"))
      ]) : {};
      if (!updating_value && dirty[0] & 1) {
        updating_value = true;
        input_1_changes.value = ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      if (!updating_files && dirty[0] & 8) {
        updating_files = true;
        input_1_changes.files = ctx2[3];
        add_flush_callback(() => updating_files = false);
      }
      if (!updating_dirty && dirty[0] & 16) {
        updating_dirty = true;
        input_1_changes.dirty = ctx2[4];
        add_flush_callback(() => updating_dirty = false);
      }
      if (!updating_invalid && dirty[0] & 2) {
        updating_invalid = true;
        input_1_changes.invalid = ctx2[1];
        add_flush_callback(() => updating_invalid = false);
      }
      input_1.$set(input_1_changes);
      if (ctx2[21] != null) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & 2097152) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_4(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(t3.parentNode, t3);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (suffix_slot) {
        if (suffix_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(suffix_slot, suffix_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(suffix_slot_template, ctx2[90], dirty, get_suffix_slot_changes), get_suffix_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(prefix_slot, local);
      transition_in(if_block0);
      transition_in(input_1.$$.fragment, local);
      transition_in(if_block1);
      transition_in(suffix_slot, local);
      current = true;
    },
    o(local) {
      transition_out(prefix_slot, local);
      transition_out(if_block0);
      transition_out(input_1.$$.fragment, local);
      transition_out(if_block1);
      transition_out(suffix_slot, local);
      current = false;
    },
    d(detaching) {
      if (prefix_slot)
        prefix_slot.d(detaching);
      if (detaching)
        detach(t0);
      if (if_block0)
        if_block0.d(detaching);
      if (detaching)
        detach(t1);
      ctx[63](null);
      destroy_component(input_1, detaching);
      if (detaching)
        detach(t2);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(t3);
      if (suffix_slot)
        suffix_slot.d(detaching);
    }
  };
}
function create_if_block_3(ctx) {
  let span;
  let textarea_1;
  let updating_value;
  let updating_dirty;
  let updating_invalid;
  let t;
  let span_class_value;
  let current;
  const textarea_1_spread_levels = [
    { disabled: ctx[12] },
    { required: ctx[13] },
    { updateInvalid: ctx[19] },
    { "aria-controls": ctx[27] },
    { "aria-describedby": ctx[27] },
    prefixFilter(ctx[41], "input$")
  ];
  function textarea_1_value_binding(value) {
    ctx[56](value);
  }
  function textarea_1_dirty_binding(value) {
    ctx[57](value);
  }
  function textarea_1_invalid_binding(value) {
    ctx[58](value);
  }
  let textarea_1_props = {};
  for (let i = 0; i < textarea_1_spread_levels.length; i += 1) {
    textarea_1_props = assign(textarea_1_props, textarea_1_spread_levels[i]);
  }
  if (ctx[0] !== void 0) {
    textarea_1_props.value = ctx[0];
  }
  if (ctx[4] !== void 0) {
    textarea_1_props.dirty = ctx[4];
  }
  if (ctx[1] !== void 0) {
    textarea_1_props.invalid = ctx[1];
  }
  textarea_1 = new Textarea({ props: textarea_1_props });
  ctx[55](textarea_1);
  binding_callbacks.push(() => bind(textarea_1, "value", textarea_1_value_binding));
  binding_callbacks.push(() => bind(textarea_1, "dirty", textarea_1_dirty_binding));
  binding_callbacks.push(() => bind(textarea_1, "invalid", textarea_1_invalid_binding));
  textarea_1.$on("blur", ctx[59]);
  textarea_1.$on("focus", ctx[60]);
  textarea_1.$on("blur", ctx[61]);
  textarea_1.$on("focus", ctx[62]);
  const internalCounter_slot_template = ctx[51].internalCounter;
  const internalCounter_slot = create_slot(internalCounter_slot_template, ctx, ctx[90], get_internalCounter_slot_context);
  return {
    c() {
      span = element("span");
      create_component(textarea_1.$$.fragment);
      t = space();
      if (internalCounter_slot)
        internalCounter_slot.c();
      this.h();
    },
    l(nodes) {
      span = claim_element(nodes, "SPAN", { class: true });
      var span_nodes = children(span);
      claim_component(textarea_1.$$.fragment, span_nodes);
      t = claim_space(span_nodes);
      if (internalCounter_slot)
        internalCounter_slot.l(span_nodes);
      span_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(span, "class", span_class_value = classMap({
        "mdc-text-field__resizer": !("input$resizable" in ctx[41]) || ctx[41].input$resizable
      }));
    },
    m(target, anchor) {
      insert_hydration(target, span, anchor);
      mount_component(textarea_1, span, null);
      append_hydration(span, t);
      if (internalCounter_slot) {
        internalCounter_slot.m(span, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      const textarea_1_changes = dirty[0] & 134754304 | dirty[1] & 1024 ? get_spread_update(textarea_1_spread_levels, [
        dirty[0] & 4096 && { disabled: ctx2[12] },
        dirty[0] & 8192 && { required: ctx2[13] },
        dirty[0] & 524288 && { updateInvalid: ctx2[19] },
        dirty[0] & 134217728 && { "aria-controls": ctx2[27] },
        dirty[0] & 134217728 && { "aria-describedby": ctx2[27] },
        dirty[1] & 1024 && get_spread_object(prefixFilter(ctx2[41], "input$"))
      ]) : {};
      if (!updating_value && dirty[0] & 1) {
        updating_value = true;
        textarea_1_changes.value = ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      if (!updating_dirty && dirty[0] & 16) {
        updating_dirty = true;
        textarea_1_changes.dirty = ctx2[4];
        add_flush_callback(() => updating_dirty = false);
      }
      if (!updating_invalid && dirty[0] & 2) {
        updating_invalid = true;
        textarea_1_changes.invalid = ctx2[1];
        add_flush_callback(() => updating_invalid = false);
      }
      textarea_1.$set(textarea_1_changes);
      if (internalCounter_slot) {
        if (internalCounter_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(internalCounter_slot, internalCounter_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(internalCounter_slot_template, ctx2[90], dirty, get_internalCounter_slot_changes), get_internalCounter_slot_context);
        }
      }
      if (!current || dirty[1] & 1024 && span_class_value !== (span_class_value = classMap({
        "mdc-text-field__resizer": !("input$resizable" in ctx2[41]) || ctx2[41].input$resizable
      }))) {
        attr(span, "class", span_class_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(textarea_1.$$.fragment, local);
      transition_in(internalCounter_slot, local);
      current = true;
    },
    o(local) {
      transition_out(textarea_1.$$.fragment, local);
      transition_out(internalCounter_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(span);
      ctx[55](null);
      destroy_component(textarea_1);
      if (internalCounter_slot)
        internalCounter_slot.d(detaching);
    }
  };
}
function create_if_block_5(ctx) {
  let prefix_1;
  let current;
  prefix_1 = new Prefix({
    props: {
      $$slots: { default: [create_default_slot_3] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(prefix_1.$$.fragment);
    },
    l(nodes) {
      claim_component(prefix_1.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(prefix_1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const prefix_1_changes = {};
      if (dirty[0] & 1048576 | dirty[2] & 268435456) {
        prefix_1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      prefix_1.$set(prefix_1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(prefix_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(prefix_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(prefix_1, detaching);
    }
  };
}
function create_default_slot_3(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[20]);
    },
    l(nodes) {
      t = claim_text(nodes, ctx[20]);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 1048576)
        set_data(t, ctx2[20]);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_if_block_4(ctx) {
  let suffix_1;
  let current;
  suffix_1 = new Suffix({
    props: {
      $$slots: { default: [create_default_slot_2] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(suffix_1.$$.fragment);
    },
    l(nodes) {
      claim_component(suffix_1.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(suffix_1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const suffix_1_changes = {};
      if (dirty[0] & 2097152 | dirty[2] & 268435456) {
        suffix_1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      suffix_1.$set(suffix_1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(suffix_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(suffix_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(suffix_1, detaching);
    }
  };
}
function create_default_slot_2(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[21]);
    },
    l(nodes) {
      t = claim_text(nodes, ctx[21]);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 2097152)
        set_data(t, ctx2[21]);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_1(ctx) {
  let current;
  const trailingIcon_slot_template = ctx[51].trailingIcon;
  const trailingIcon_slot = create_slot(trailingIcon_slot_template, ctx, ctx[90], get_trailingIcon_slot_context);
  return {
    c() {
      if (trailingIcon_slot)
        trailingIcon_slot.c();
    },
    l(nodes) {
      if (trailingIcon_slot)
        trailingIcon_slot.l(nodes);
    },
    m(target, anchor) {
      if (trailingIcon_slot) {
        trailingIcon_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (trailingIcon_slot) {
        if (trailingIcon_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(trailingIcon_slot, trailingIcon_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(trailingIcon_slot_template, ctx2[90], dirty, get_trailingIcon_slot_changes), get_trailingIcon_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(trailingIcon_slot, local);
      current = true;
    },
    o(local) {
      transition_out(trailingIcon_slot, local);
      current = false;
    },
    d(detaching) {
      if (trailingIcon_slot)
        trailingIcon_slot.d(detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let lineripple;
  let current;
  const lineripple_spread_levels = [prefixFilter(ctx[41], "ripple$")];
  let lineripple_props = {};
  for (let i = 0; i < lineripple_spread_levels.length; i += 1) {
    lineripple_props = assign(lineripple_props, lineripple_spread_levels[i]);
  }
  lineripple = new LineRipple({ props: lineripple_props });
  ctx[72](lineripple);
  return {
    c() {
      create_component(lineripple.$$.fragment);
    },
    l(nodes) {
      claim_component(lineripple.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(lineripple, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const lineripple_changes = dirty[1] & 1024 ? get_spread_update(lineripple_spread_levels, [get_spread_object(prefixFilter(ctx2[41], "ripple$"))]) : {};
      lineripple.$set(lineripple_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(lineripple.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(lineripple.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      ctx[72](null);
      destroy_component(lineripple, detaching);
    }
  };
}
function create_if_block$1(ctx) {
  let helperline;
  let current;
  const helperline_spread_levels = [prefixFilter(ctx[41], "helperLine$")];
  let helperline_props = {
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx }
  };
  for (let i = 0; i < helperline_spread_levels.length; i += 1) {
    helperline_props = assign(helperline_props, helperline_spread_levels[i]);
  }
  helperline = new HelperLine({ props: helperline_props });
  helperline.$on("SMUITextfieldHelperText:id", ctx[85]);
  helperline.$on("SMUITextfieldHelperText:mount", ctx[86]);
  helperline.$on("SMUITextfieldHelperText:unmount", ctx[87]);
  helperline.$on("SMUITextfieldCharacterCounter:mount", ctx[88]);
  helperline.$on("SMUITextfieldCharacterCounter:unmount", ctx[89]);
  return {
    c() {
      create_component(helperline.$$.fragment);
    },
    l(nodes) {
      claim_component(helperline.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(helperline, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const helperline_changes = dirty[1] & 1024 ? get_spread_update(helperline_spread_levels, [get_spread_object(prefixFilter(ctx2[41], "helperLine$"))]) : {};
      if (dirty[2] & 268435456) {
        helperline_changes.$$scope = { dirty, ctx: ctx2 };
      }
      helperline.$set(helperline_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(helperline.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(helperline.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(helperline, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let current;
  const helper_slot_template = ctx[51].helper;
  const helper_slot = create_slot(helper_slot_template, ctx, ctx[90], get_helper_slot_context);
  return {
    c() {
      if (helper_slot)
        helper_slot.c();
    },
    l(nodes) {
      if (helper_slot)
        helper_slot.l(nodes);
    },
    m(target, anchor) {
      if (helper_slot) {
        helper_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (helper_slot) {
        if (helper_slot.p && (!current || dirty[2] & 268435456)) {
          update_slot_base(helper_slot, helper_slot_template, ctx2, ctx2[90], !current ? get_all_dirty_from_scope(ctx2[90]) : get_slot_changes(helper_slot_template, ctx2[90], dirty, get_helper_slot_changes), get_helper_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(helper_slot, local);
      current = true;
    },
    o(local) {
      transition_out(helper_slot, local);
      current = false;
    },
    d(detaching) {
      if (helper_slot)
        helper_slot.d(detaching);
    }
  };
}
function create_fragment$1(ctx) {
  let current_block_type_index;
  let if_block0;
  let t;
  let if_block1_anchor;
  let current;
  const if_block_creators = [create_if_block_1, create_else_block_1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[36])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let if_block1 = ctx[42].helper && create_if_block$1(ctx);
  return {
    c() {
      if_block0.c();
      t = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
    },
    l(nodes) {
      if_block0.l(nodes);
      t = claim_space(nodes);
      if (if_block1)
        if_block1.l(nodes);
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_hydration(target, t, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert_hydration(target, if_block1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if_block0.p(ctx2, dirty);
      if (ctx2[42].helper) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[1] & 2048) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$1(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(t);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
const func = ([name, value]) => `${name}: ${value};`;
const func_1 = ([name, value]) => `${name}: ${value};`;
function instance_1$1($$self, $$props, $$invalidate) {
  let inputElement;
  const omit_props_names = [
    "use",
    "class",
    "style",
    "ripple",
    "disabled",
    "required",
    "textarea",
    "variant",
    "noLabel",
    "label",
    "type",
    "value",
    "files",
    "invalid",
    "updateInvalid",
    "dirty",
    "prefix",
    "suffix",
    "validateOnValueChange",
    "useNativeValidation",
    "withLeadingIcon",
    "withTrailingIcon",
    "input",
    "floatingLabel",
    "lineRipple",
    "notchedOutline",
    "focus",
    "blur",
    "layout",
    "getElement"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const $$slots = compute_slots(slots);
  const { applyPassive: applyPassive2 } = events;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let uninitializedValue = () => {
  };
  function isUninitializedValue(value2) {
    return value2 === uninitializedValue;
  }
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { ripple = true } = $$props;
  let { disabled = false } = $$props;
  let { required = false } = $$props;
  let { textarea = false } = $$props;
  let { variant = textarea ? "outlined" : "standard" } = $$props;
  let { noLabel = false } = $$props;
  let { label = void 0 } = $$props;
  let { type = "text" } = $$props;
  let { value = $$restProps.input$emptyValueUndefined ? void 0 : uninitializedValue } = $$props;
  let { files = uninitializedValue } = $$props;
  const valued = !isUninitializedValue(value) || !isUninitializedValue(files);
  if (isUninitializedValue(value)) {
    value = void 0;
  }
  if (isUninitializedValue(files)) {
    files = null;
  }
  let { invalid = uninitializedValue } = $$props;
  let { updateInvalid = isUninitializedValue(invalid) } = $$props;
  if (isUninitializedValue(invalid)) {
    invalid = false;
  }
  let { dirty = false } = $$props;
  let { prefix = void 0 } = $$props;
  let { suffix = void 0 } = $$props;
  let { validateOnValueChange = updateInvalid } = $$props;
  let { useNativeValidation = updateInvalid } = $$props;
  let { withLeadingIcon = uninitializedValue } = $$props;
  let { withTrailingIcon = uninitializedValue } = $$props;
  let { input = void 0 } = $$props;
  let { floatingLabel = void 0 } = $$props;
  let { lineRipple = void 0 } = $$props;
  let { notchedOutline = void 0 } = $$props;
  let element2;
  let instance2;
  let internalClasses = {};
  let internalStyles = {};
  let helperId = void 0;
  let focused = false;
  let addLayoutListener = getContext("SMUI:addLayoutListener");
  let removeLayoutListener;
  let initPromiseResolve;
  let initPromise = new Promise((resolve) => initPromiseResolve = resolve);
  let leadingIcon = void 0;
  let trailingIcon = void 0;
  let helperText = void 0;
  let characterCounter = void 0;
  let previousValue = value;
  if (addLayoutListener) {
    removeLayoutListener = addLayoutListener(layout);
  }
  onMount(() => {
    $$invalidate(49, instance2 = new MDCTextFieldFoundation({
      addClass,
      removeClass,
      hasClass,
      registerTextFieldInteractionHandler: (evtType, handler) => getElement().addEventListener(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType, handler) => getElement().removeEventListener(evtType, handler),
      registerValidationAttributeChangeHandler: (handler) => {
        const getAttributesList = (mutationsList) => {
          return mutationsList.map((mutation) => mutation.attributeName).filter((attributeName) => attributeName);
        };
        const observer = new MutationObserver((mutationsList) => {
          if (useNativeValidation) {
            handler(getAttributesList(mutationsList));
          }
        });
        const config = { attributes: true };
        if (input) {
          observer.observe(input.getElement(), config);
        }
        return observer;
      },
      deregisterValidationAttributeChangeHandler: (observer) => {
        observer.disconnect();
      },
      getNativeInput: () => {
        var _a;
        return (_a = input === null || input === void 0 ? void 0 : input.getElement()) !== null && _a !== void 0 ? _a : null;
      },
      setInputAttr: (name, value2) => {
        input === null || input === void 0 ? void 0 : input.addAttr(name, value2);
      },
      removeInputAttr: (name) => {
        input === null || input === void 0 ? void 0 : input.removeAttr(name);
      },
      isFocused: () => document.activeElement === (input === null || input === void 0 ? void 0 : input.getElement()),
      registerInputInteractionHandler: (evtType, handler) => {
        input === null || input === void 0 ? void 0 : input.getElement().addEventListener(evtType, handler, applyPassive2());
      },
      deregisterInputInteractionHandler: (evtType, handler) => {
        input === null || input === void 0 ? void 0 : input.getElement().removeEventListener(evtType, handler, applyPassive2());
      },
      floatLabel: (shouldFloat) => floatingLabel && floatingLabel.float(shouldFloat),
      getLabelWidth: () => floatingLabel ? floatingLabel.getWidth() : 0,
      hasLabel: () => !!floatingLabel,
      shakeLabel: (shouldShake) => floatingLabel && floatingLabel.shake(shouldShake),
      setLabelRequired: (isRequired) => floatingLabel && floatingLabel.setRequired(isRequired),
      activateLineRipple: () => lineRipple && lineRipple.activate(),
      deactivateLineRipple: () => lineRipple && lineRipple.deactivate(),
      setLineRippleTransformOrigin: (normalizedX) => lineRipple && lineRipple.setRippleCenter(normalizedX),
      closeOutline: () => notchedOutline && notchedOutline.closeNotch(),
      hasOutline: () => !!notchedOutline,
      notchOutline: (labelWidth) => notchedOutline && notchedOutline.notch(labelWidth)
    }, {
      get helperText() {
        return helperText;
      },
      get characterCounter() {
        return characterCounter;
      },
      get leadingIcon() {
        return leadingIcon;
      },
      get trailingIcon() {
        return trailingIcon;
      }
    }));
    if (valued) {
      if (input == null) {
        throw new Error("SMUI Textfield initialized without Input component.");
      }
      instance2.init();
    } else {
      tick().then(() => {
        if (input == null) {
          throw new Error("SMUI Textfield initialized without Input component.");
        }
        instance2.init();
      });
    }
    initPromiseResolve();
    return () => {
      instance2.destroy();
    };
  });
  onDestroy(() => {
    if (removeLayoutListener) {
      removeLayoutListener();
    }
  });
  function hasClass(className2) {
    var _a;
    return className2 in internalClasses ? (_a = internalClasses[className2]) !== null && _a !== void 0 ? _a : null : getElement().classList.contains(className2);
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      $$invalidate(25, internalClasses[className2] = true, internalClasses);
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      $$invalidate(25, internalClasses[className2] = false, internalClasses);
    }
  }
  function addStyle(name, value2) {
    if (internalStyles[name] != value2) {
      if (value2 === "" || value2 == null) {
        delete internalStyles[name];
        $$invalidate(26, internalStyles);
      } else {
        $$invalidate(26, internalStyles[name] = value2, internalStyles);
      }
    }
  }
  function focus() {
    input === null || input === void 0 ? void 0 : input.focus();
  }
  function blur() {
    input === null || input === void 0 ? void 0 : input.blur();
  }
  function layout() {
    if (instance2) {
      const openNotch = instance2.shouldFloat;
      instance2.notchOutline(openNotch);
    }
  }
  function getElement() {
    return element2;
  }
  function floatinglabel_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      floatingLabel = $$value;
      $$invalidate(5, floatingLabel);
    });
  }
  function floatinglabel_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      floatingLabel = $$value;
      $$invalidate(5, floatingLabel);
    });
  }
  function notchedoutline_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      notchedOutline = $$value;
      $$invalidate(7, notchedOutline);
    });
  }
  function textarea_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      input = $$value;
      $$invalidate(2, input);
    });
  }
  function textarea_1_value_binding(value$1) {
    value = value$1;
    $$invalidate(0, value);
  }
  function textarea_1_dirty_binding(value2) {
    dirty = value2;
    $$invalidate(4, dirty);
  }
  function textarea_1_invalid_binding(value2) {
    invalid = value2;
    $$invalidate(1, invalid), $$invalidate(49, instance2), $$invalidate(19, updateInvalid);
  }
  const blur_handler = () => $$invalidate(28, focused = false);
  const focus_handler = () => $$invalidate(28, focused = true);
  const blur_handler_1 = (event) => dispatch(element2, "blur", event);
  const focus_handler_1 = (event) => dispatch(element2, "focus", event);
  function input_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      input = $$value;
      $$invalidate(2, input);
    });
  }
  function input_1_value_binding(value$1) {
    value = value$1;
    $$invalidate(0, value);
  }
  function input_1_files_binding(value2) {
    files = value2;
    $$invalidate(3, files);
  }
  function input_1_dirty_binding(value2) {
    dirty = value2;
    $$invalidate(4, dirty);
  }
  function input_1_invalid_binding(value2) {
    invalid = value2;
    $$invalidate(1, invalid), $$invalidate(49, instance2), $$invalidate(19, updateInvalid);
  }
  const blur_handler_2 = () => $$invalidate(28, focused = false);
  const focus_handler_2 = () => $$invalidate(28, focused = true);
  const blur_handler_3 = (event) => dispatch(element2, "blur", event);
  const focus_handler_3 = (event) => dispatch(element2, "focus", event);
  function lineripple_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      lineRipple = $$value;
      $$invalidate(6, lineRipple);
    });
  }
  function label_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(24, element2);
    });
  }
  const SMUITextfieldLeadingIcon_mount_handler = (event) => $$invalidate(29, leadingIcon = event.detail);
  const SMUITextfieldLeadingIcon_unmount_handler = () => $$invalidate(29, leadingIcon = void 0);
  const SMUITextfieldTrailingIcon_mount_handler = (event) => $$invalidate(30, trailingIcon = event.detail);
  const SMUITextfieldTrailingIcon_unmount_handler = () => $$invalidate(30, trailingIcon = void 0);
  const SMUITextfieldCharacterCounter_mount_handler = (event) => $$invalidate(32, characterCounter = event.detail);
  const SMUITextfieldCharacterCounter_unmount_handler = () => $$invalidate(32, characterCounter = void 0);
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(24, element2);
    });
  }
  const SMUITextfieldLeadingIcon_mount_handler_1 = (event) => $$invalidate(29, leadingIcon = event.detail);
  const SMUITextfieldLeadingIcon_unmount_handler_1 = () => $$invalidate(29, leadingIcon = void 0);
  const SMUITextfieldTrailingIcon_mount_handler_1 = (event) => $$invalidate(30, trailingIcon = event.detail);
  const SMUITextfieldTrailingIcon_unmount_handler_1 = () => $$invalidate(30, trailingIcon = void 0);
  const SMUITextfieldHelperText_id_handler = (event) => $$invalidate(27, helperId = event.detail);
  const SMUITextfieldHelperText_mount_handler = (event) => $$invalidate(31, helperText = event.detail);
  const SMUITextfieldHelperText_unmount_handler = () => {
    $$invalidate(27, helperId = void 0);
    $$invalidate(31, helperText = void 0);
  };
  const SMUITextfieldCharacterCounter_mount_handler_1 = (event) => $$invalidate(32, characterCounter = event.detail);
  const SMUITextfieldCharacterCounter_unmount_handler_1 = () => $$invalidate(32, characterCounter = void 0);
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(41, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(8, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(9, className = $$new_props.class);
    if ("style" in $$new_props)
      $$invalidate(10, style = $$new_props.style);
    if ("ripple" in $$new_props)
      $$invalidate(11, ripple = $$new_props.ripple);
    if ("disabled" in $$new_props)
      $$invalidate(12, disabled = $$new_props.disabled);
    if ("required" in $$new_props)
      $$invalidate(13, required = $$new_props.required);
    if ("textarea" in $$new_props)
      $$invalidate(14, textarea = $$new_props.textarea);
    if ("variant" in $$new_props)
      $$invalidate(15, variant = $$new_props.variant);
    if ("noLabel" in $$new_props)
      $$invalidate(16, noLabel = $$new_props.noLabel);
    if ("label" in $$new_props)
      $$invalidate(17, label = $$new_props.label);
    if ("type" in $$new_props)
      $$invalidate(18, type = $$new_props.type);
    if ("value" in $$new_props)
      $$invalidate(0, value = $$new_props.value);
    if ("files" in $$new_props)
      $$invalidate(3, files = $$new_props.files);
    if ("invalid" in $$new_props)
      $$invalidate(1, invalid = $$new_props.invalid);
    if ("updateInvalid" in $$new_props)
      $$invalidate(19, updateInvalid = $$new_props.updateInvalid);
    if ("dirty" in $$new_props)
      $$invalidate(4, dirty = $$new_props.dirty);
    if ("prefix" in $$new_props)
      $$invalidate(20, prefix = $$new_props.prefix);
    if ("suffix" in $$new_props)
      $$invalidate(21, suffix = $$new_props.suffix);
    if ("validateOnValueChange" in $$new_props)
      $$invalidate(43, validateOnValueChange = $$new_props.validateOnValueChange);
    if ("useNativeValidation" in $$new_props)
      $$invalidate(44, useNativeValidation = $$new_props.useNativeValidation);
    if ("withLeadingIcon" in $$new_props)
      $$invalidate(22, withLeadingIcon = $$new_props.withLeadingIcon);
    if ("withTrailingIcon" in $$new_props)
      $$invalidate(23, withTrailingIcon = $$new_props.withTrailingIcon);
    if ("input" in $$new_props)
      $$invalidate(2, input = $$new_props.input);
    if ("floatingLabel" in $$new_props)
      $$invalidate(5, floatingLabel = $$new_props.floatingLabel);
    if ("lineRipple" in $$new_props)
      $$invalidate(6, lineRipple = $$new_props.lineRipple);
    if ("notchedOutline" in $$new_props)
      $$invalidate(7, notchedOutline = $$new_props.notchedOutline);
    if ("$$scope" in $$new_props)
      $$invalidate(90, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 4) {
      $$invalidate(33, inputElement = input && input.getElement());
    }
    if ($$self.$$.dirty[0] & 524290 | $$self.$$.dirty[1] & 262144) {
      if (instance2 && instance2.isValid() !== !invalid) {
        if (updateInvalid) {
          $$invalidate(1, invalid = !instance2.isValid());
        } else {
          instance2.setValid(!invalid);
        }
      }
    }
    if ($$self.$$.dirty[1] & 266240) {
      if (instance2 && instance2.getValidateOnValueChange() !== validateOnValueChange) {
        instance2.setValidateOnValueChange(isUninitializedValue(validateOnValueChange) ? false : validateOnValueChange);
      }
    }
    if ($$self.$$.dirty[1] & 270336) {
      if (instance2) {
        instance2.setUseNativeValidation(isUninitializedValue(useNativeValidation) ? true : useNativeValidation);
      }
    }
    if ($$self.$$.dirty[0] & 4096 | $$self.$$.dirty[1] & 262144) {
      if (instance2) {
        instance2.setDisabled(disabled);
      }
    }
    if ($$self.$$.dirty[0] & 1 | $$self.$$.dirty[1] & 786432) {
      if (instance2 && valued && previousValue !== value) {
        $$invalidate(50, previousValue = value);
        const stringValue = `${value}`;
        if (instance2.getValue() !== stringValue) {
          instance2.setValue(stringValue);
        }
      }
    }
  };
  return [
    value,
    invalid,
    input,
    files,
    dirty,
    floatingLabel,
    lineRipple,
    notchedOutline,
    use,
    className,
    style,
    ripple,
    disabled,
    required,
    textarea,
    variant,
    noLabel,
    label,
    type,
    updateInvalid,
    prefix,
    suffix,
    withLeadingIcon,
    withTrailingIcon,
    element2,
    internalClasses,
    internalStyles,
    helperId,
    focused,
    leadingIcon,
    trailingIcon,
    helperText,
    characterCounter,
    inputElement,
    forwardEvents,
    isUninitializedValue,
    valued,
    initPromise,
    addClass,
    removeClass,
    addStyle,
    $$restProps,
    $$slots,
    validateOnValueChange,
    useNativeValidation,
    focus,
    blur,
    layout,
    getElement,
    instance2,
    previousValue,
    slots,
    floatinglabel_binding,
    floatinglabel_binding_1,
    notchedoutline_binding,
    textarea_1_binding,
    textarea_1_value_binding,
    textarea_1_dirty_binding,
    textarea_1_invalid_binding,
    blur_handler,
    focus_handler,
    blur_handler_1,
    focus_handler_1,
    input_1_binding,
    input_1_value_binding,
    input_1_files_binding,
    input_1_dirty_binding,
    input_1_invalid_binding,
    blur_handler_2,
    focus_handler_2,
    blur_handler_3,
    focus_handler_3,
    lineripple_binding,
    label_1_binding,
    SMUITextfieldLeadingIcon_mount_handler,
    SMUITextfieldLeadingIcon_unmount_handler,
    SMUITextfieldTrailingIcon_mount_handler,
    SMUITextfieldTrailingIcon_unmount_handler,
    SMUITextfieldCharacterCounter_mount_handler,
    SMUITextfieldCharacterCounter_unmount_handler,
    div_binding,
    SMUITextfieldLeadingIcon_mount_handler_1,
    SMUITextfieldLeadingIcon_unmount_handler_1,
    SMUITextfieldTrailingIcon_mount_handler_1,
    SMUITextfieldTrailingIcon_unmount_handler_1,
    SMUITextfieldHelperText_id_handler,
    SMUITextfieldHelperText_mount_handler,
    SMUITextfieldHelperText_unmount_handler,
    SMUITextfieldCharacterCounter_mount_handler_1,
    SMUITextfieldCharacterCounter_unmount_handler_1,
    $$scope
  ];
}
class Textfield extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1$1, create_fragment$1, safe_not_equal, {
      use: 8,
      class: 9,
      style: 10,
      ripple: 11,
      disabled: 12,
      required: 13,
      textarea: 14,
      variant: 15,
      noLabel: 16,
      label: 17,
      type: 18,
      value: 0,
      files: 3,
      invalid: 1,
      updateInvalid: 19,
      dirty: 4,
      prefix: 20,
      suffix: 21,
      validateOnValueChange: 43,
      useNativeValidation: 44,
      withLeadingIcon: 22,
      withTrailingIcon: 23,
      input: 2,
      floatingLabel: 5,
      lineRipple: 6,
      notchedOutline: 7,
      focus: 45,
      blur: 46,
      layout: 47,
      getElement: 48
    }, null, [-1, -1, -1, -1]);
  }
  get focus() {
    return this.$$.ctx[45];
  }
  get blur() {
    return this.$$.ctx[46];
  }
  get layout() {
    return this.$$.ctx[47];
  }
  get getElement() {
    return this.$$.ctx[48];
  }
}
function create_else_block(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[8]);
    },
    l(nodes) {
      t = claim_text(nodes, ctx[8]);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 256)
        set_data(t, ctx2[8]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_if_block(ctx) {
  let current;
  const default_slot_template = ctx[13].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[12], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 4096)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[12], !current ? get_all_dirty_from_scope(ctx2[12]) : get_slot_changes(default_slot_template, ctx2[12], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment(ctx) {
  let div;
  let current_block_type_index;
  let if_block;
  let div_class_value;
  let div_aria_hidden_value;
  let useActions_action;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[8] == null)
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let div_levels = [
    {
      class: div_class_value = classMap(__spreadValues({
        [ctx[1]]: true,
        "mdc-text-field-helper-text": true,
        "mdc-text-field-helper-text--persistent": ctx[3],
        "mdc-text-field-helper-text--validation-msg": ctx[4]
      }, ctx[6]))
    },
    {
      "aria-hidden": div_aria_hidden_value = ctx[3] ? void 0 : "true"
    },
    { id: ctx[2] },
    ctx[7],
    ctx[10]
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if_block.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true,
        "aria-hidden": true,
        id: true
      });
      var div_nodes = children(div);
      if_block.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      ctx[14](div);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(useActions_action = useActions.call(null, div, ctx[0])),
          action_destroyer(ctx[9].call(null, div))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div, null);
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        (!current || dirty & 90 && div_class_value !== (div_class_value = classMap(__spreadValues({
          [ctx2[1]]: true,
          "mdc-text-field-helper-text": true,
          "mdc-text-field-helper-text--persistent": ctx2[3],
          "mdc-text-field-helper-text--validation-msg": ctx2[4]
        }, ctx2[6])))) && { class: div_class_value },
        (!current || dirty & 8 && div_aria_hidden_value !== (div_aria_hidden_value = ctx2[3] ? void 0 : "true")) && { "aria-hidden": div_aria_hidden_value },
        (!current || dirty & 4) && { id: ctx2[2] },
        dirty & 128 && ctx2[7],
        dirty & 1024 && ctx2[10]
      ]));
      if (useActions_action && is_function(useActions_action.update) && dirty & 1)
        useActions_action.update.call(null, ctx2[0]);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if_blocks[current_block_type_index].d();
      ctx[14](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
let counter = 0;
function instance_1($$self, $$props, $$invalidate) {
  const omit_props_names = ["use", "class", "id", "persistent", "validationMsg", "getElement"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { id = "SMUI-textfield-helper-text-" + counter++ } = $$props;
  let { persistent = false } = $$props;
  let { validationMsg = false } = $$props;
  let element2;
  let instance2;
  let internalClasses = {};
  let internalAttrs = {};
  let content = void 0;
  onMount(() => {
    instance2 = new MDCTextFieldHelperTextFoundation({
      addClass,
      removeClass,
      hasClass,
      getAttr,
      setAttr: addAttr,
      removeAttr,
      setContent: (value) => {
        $$invalidate(8, content = value);
      }
    });
    if (id.startsWith("SMUI-textfield-helper-text-")) {
      dispatch(getElement(), "SMUITextfieldHelperText:id", id);
    }
    dispatch(getElement(), "SMUITextfieldHelperText:mount", instance2);
    instance2.init();
    return () => {
      dispatch(getElement(), "SMUITextfieldHelperText:unmount", instance2);
      instance2.destroy();
    };
  });
  function hasClass(className2) {
    return className2 in internalClasses ? internalClasses[className2] : getElement().classList.contains(className2);
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      $$invalidate(6, internalClasses[className2] = true, internalClasses);
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      $$invalidate(6, internalClasses[className2] = false, internalClasses);
    }
  }
  function getAttr(name) {
    var _a;
    return name in internalAttrs ? (_a = internalAttrs[name]) !== null && _a !== void 0 ? _a : null : getElement().getAttribute(name);
  }
  function addAttr(name, value) {
    if (internalAttrs[name] !== value) {
      $$invalidate(7, internalAttrs[name] = value, internalAttrs);
    }
  }
  function removeAttr(name) {
    if (!(name in internalAttrs) || internalAttrs[name] != null) {
      $$invalidate(7, internalAttrs[name] = void 0, internalAttrs);
    }
  }
  function getElement() {
    return element2;
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      element2 = $$value;
      $$invalidate(5, element2);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("use" in $$new_props)
      $$invalidate(0, use = $$new_props.use);
    if ("class" in $$new_props)
      $$invalidate(1, className = $$new_props.class);
    if ("id" in $$new_props)
      $$invalidate(2, id = $$new_props.id);
    if ("persistent" in $$new_props)
      $$invalidate(3, persistent = $$new_props.persistent);
    if ("validationMsg" in $$new_props)
      $$invalidate(4, validationMsg = $$new_props.validationMsg);
    if ("$$scope" in $$new_props)
      $$invalidate(12, $$scope = $$new_props.$$scope);
  };
  return [
    use,
    className,
    id,
    persistent,
    validationMsg,
    element2,
    internalClasses,
    internalAttrs,
    content,
    forwardEvents,
    $$restProps,
    getElement,
    $$scope,
    slots,
    div_binding
  ];
}
class HelperText extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance_1, create_fragment, safe_not_equal, {
      use: 0,
      class: 1,
      id: 2,
      persistent: 3,
      validationMsg: 4,
      getElement: 11
    });
  }
  get getElement() {
    return this.$$.ctx[11];
  }
}
export { append_hydration as $, get_spread_object as A, destroy_component as B, assign as C, writable as D, tick as E, binding_callbacks as F, bind as G, Textfield as H, add_flush_callback as I, Tab as J, HelperText as K, Label as L, component_subscribe as M, Title$1 as N, Content$1 as O, Paper as P, noop as Q, LayoutGrid as R, SvelteComponent as S, TabBar as T, Cell as U, Title as V, Content as W, Card as X, CircularProgress as Y, destroy_each as Z, src_url_equal as _, children as a, attr as b, claim_element as c, detach as d, element as e, set_style as f, insert_hydration as g, claim_text as h, init as i, set_data as j, space as k, empty as l, claim_space as m, group_outros as n, transition_out as o, check_outros as p, transition_in as q, setContext as r, safe_not_equal as s, text as t, afterUpdate as u, onMount as v, create_component as w, claim_component as x, mount_component as y, get_spread_update as z };
