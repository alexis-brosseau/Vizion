"use strict";
(() => {
  // node_modules/esm-env/dev-fallback.js
  var node_env = globalThis.process?.env?.NODE_ENV;
  var dev_fallback_default = node_env && !node_env.toLowerCase().startsWith("prod");

  // node_modules/svelte/src/internal/shared/utils.js
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var includes = Array.prototype.includes;
  var array_from = Array.from;
  var object_keys = Object.keys;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  var noop = () => {
  };
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
  function deferred() {
    var resolve;
    var reject;
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }

  // node_modules/svelte/src/internal/client/constants.js
  var DERIVED = 1 << 1;
  var EFFECT = 1 << 2;
  var RENDER_EFFECT = 1 << 3;
  var MANAGED_EFFECT = 1 << 24;
  var BLOCK_EFFECT = 1 << 4;
  var BRANCH_EFFECT = 1 << 5;
  var ROOT_EFFECT = 1 << 6;
  var BOUNDARY_EFFECT = 1 << 7;
  var PAUSED = 1 << 8;
  var CONNECTED = 1 << 9;
  var CLEAN = 1 << 10;
  var DIRTY = 1 << 11;
  var MAYBE_DIRTY = 1 << 12;
  var INERT = 1 << 13;
  var DESTROYED = 1 << 14;
  var REACTION_RAN = 1 << 15;
  var DESTROYING = 1 << 25;
  var EFFECT_TRANSPARENT = 1 << 16;
  var EAGER_EFFECT = 1 << 17;
  var HEAD_EFFECT = 1 << 18;
  var EFFECT_PRESERVED = 1 << 19;
  var USER_EFFECT = 1 << 20;
  var EFFECT_OFFSCREEN = 1 << 25;
  var REACTION_IS_UPDATING = 1 << 21;
  var ASYNC = 1 << 22;
  var ERROR_VALUE = 1 << 23;
  var STATE_SYMBOL = Symbol("$state");
  var COMPONENT_SYMBOL = Symbol("component");
  var LEGACY_PROPS = Symbol("legacy props");
  var LOADING_ATTR_SYMBOL = Symbol("");
  var PROXY_PATH_SYMBOL = Symbol("proxy path");
  var ATTRIBUTES_CACHE = Symbol("attributes");
  var CLASS_CACHE = Symbol("class");
  var STYLE_CACHE = Symbol("style");
  var TEXT_CACHE = Symbol("text");
  var FORM_RESET_HANDLER = Symbol("form reset");
  var HMR_ANCHOR = Symbol("hmr anchor");
  var STALE_REACTION = new class StaleReactionError extends Error {
    name = "StaleReactionError";
    message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
  }();
  var IS_XHTML = (
    // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
    !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
  );
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;

  // node_modules/svelte/src/constants.js
  var EACH_ITEM_REACTIVE = 1;
  var EACH_INDEX_REACTIVE = 1 << 1;
  var EACH_IS_CONTROLLED = 1 << 2;
  var EACH_IS_ANIMATED = 1 << 3;
  var EACH_ITEM_IMMUTABLE = 1 << 4;
  var PROPS_IS_IMMUTABLE = 1;
  var PROPS_IS_RUNES = 1 << 1;
  var PROPS_IS_UPDATED = 1 << 2;
  var PROPS_IS_BINDABLE = 1 << 3;
  var PROPS_IS_LAZY_INITIAL = 1 << 4;
  var TRANSITION_OUT = 1 << 1;
  var TRANSITION_GLOBAL = 1 << 2;
  var TEMPLATE_FRAGMENT = 1;
  var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  var TEMPLATE_USE_SVG = 1 << 2;
  var TEMPLATE_USE_MATHML = 1 << 3;
  var HYDRATION_START = "[";
  var HYDRATION_START_ELSE = "[!";
  var HYDRATION_START_FAILED = "[?";
  var HYDRATION_END = "]";
  var HYDRATION_ERROR = {};
  var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
  var ELEMENT_IS_INPUT = 1 << 2;
  var UNINITIALIZED = Symbol("uninitialized");
  var FILENAME = Symbol("filename");
  var HMR = Symbol("hmr");
  var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";

  // node_modules/svelte/src/internal/client/warnings.js
  var bold = "font-weight: bold";
  var normal = "font-weight: normal";
  function await_reactivity_loss(name) {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${name}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/await_reactivity_loss`);
    }
  }
  function await_waterfall(name, location) {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${name}\` (${location}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/await_waterfall`);
    }
  }
  function derived_inert() {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/derived_inert`);
    }
  }
  function hydration_attribute_changed(attribute, html2, value) {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${attribute}\` attribute on \`${html2}\` changed its value between server and client renders. The client value, \`${value}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/hydration_attribute_changed`);
    }
  }
  function hydration_mismatch(location) {
    if (dev_fallback_default) {
      console.warn(
        `%c[svelte] hydration_mismatch
%c${location ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,
        bold,
        normal
      );
    } else {
      console.warn(`https://svelte.dev/e/hydration_mismatch`);
    }
  }
  function lifecycle_double_unmount() {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/lifecycle_double_unmount`);
    }
  }
  function select_multiple_invalid_value() {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] select_multiple_invalid_value
%cThe \`value\` property of a \`<select multiple>\` element should be an array, but it received a non-array value. The selection will be kept as is.
https://svelte.dev/e/select_multiple_invalid_value`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
    }
  }
  function state_proxy_equality_mismatch(operator) {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
    }
  }
  function svelte_boundary_reset_noop() {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] svelte_boundary_reset_noop
%cA \`<svelte:boundary>\` \`reset\` function only resets the boundary the first time it is called
https://svelte.dev/e/svelte_boundary_reset_noop`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
    }
  }

  // node_modules/svelte/src/internal/client/dom/hydration.js
  var hydrating = false;
  function set_hydrating(value) {
    hydrating = value;
  }
  var hydrate_node;
  function set_hydrate_node(node) {
    if (node === null) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    return hydrate_node = node;
  }
  function hydrate_next() {
    return set_hydrate_node(get_next_sibling(hydrate_node));
  }
  function reset(node) {
    if (!hydrating) return;
    if (get_next_sibling(hydrate_node) !== null) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    hydrate_node = node;
  }
  function next(count = 1) {
    if (hydrating) {
      var i = count;
      var node = hydrate_node;
      while (i--) {
        node = /** @type {TemplateNode} */
        get_next_sibling(node);
      }
      hydrate_node = node;
    }
  }
  function skip_nodes(remove = true) {
    var depth = 0;
    var node = hydrate_node;
    while (true) {
      if (node.nodeType === COMMENT_NODE) {
        var data = (
          /** @type {Comment} */
          node.data
        );
        if (data === HYDRATION_END) {
          if (depth === 0) return node;
          depth -= 1;
        } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE || // "[1", "[2", etc. for if blocks
        data[0] === "[" && !isNaN(Number(data.slice(1)))) {
          depth += 1;
        }
      }
      var next2 = (
        /** @type {TemplateNode} */
        get_next_sibling(node)
      );
      if (remove) node.remove();
      node = next2;
    }
  }
  function read_hydration_instruction(node) {
    if (!node || node.nodeType !== COMMENT_NODE) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    return (
      /** @type {Comment} */
      node.data
    );
  }

  // node_modules/svelte/src/internal/client/reactivity/equality.js
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }

  // node_modules/svelte/src/internal/shared/errors.js
  function invariant_violation(message) {
    if (dev_fallback_default) {
      const error = new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${message}"
https://svelte.dev/e/invariant_violation`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/invariant_violation`);
    }
  }

  // node_modules/svelte/src/internal/client/errors.js
  function async_derived_orphan() {
    if (dev_fallback_default) {
      const error = new Error(`async_derived_orphan
Cannot create a \`$derived(...)\` with an \`await\` expression outside of an effect tree
https://svelte.dev/e/async_derived_orphan`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/async_derived_orphan`);
    }
  }
  function bind_invalid_checkbox_value() {
    if (dev_fallback_default) {
      const error = new Error(`bind_invalid_checkbox_value
Using \`bind:value\` together with a checkbox input is not allowed. Use \`bind:checked\` instead
https://svelte.dev/e/bind_invalid_checkbox_value`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/bind_invalid_checkbox_value`);
    }
  }
  function derived_references_self() {
    if (dev_fallback_default) {
      const error = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/derived_references_self`);
    }
  }
  function each_key_duplicate(a, b, value) {
    if (dev_fallback_default) {
      const error = new Error(`each_key_duplicate
${value ? `Keyed each block has duplicate key \`${value}\` at indexes ${a} and ${b}` : `Keyed each block has duplicate key at indexes ${a} and ${b}`}
https://svelte.dev/e/each_key_duplicate`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/each_key_duplicate`);
    }
  }
  function each_key_volatile(index2, a, b) {
    if (dev_fallback_default) {
      const error = new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${index2} was \`${a}\` but is now \`${b}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/each_key_volatile`);
    }
  }
  function effect_in_teardown(rune) {
    if (dev_fallback_default) {
      const error = new Error(`effect_in_teardown
\`${rune}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    if (dev_fallback_default) {
      const error = new Error(`effect_in_unowned_derived
Effect cannot be created inside a \`$derived\` value that was not itself created inside an effect
https://svelte.dev/e/effect_in_unowned_derived`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    if (dev_fallback_default) {
      const error = new Error(`effect_orphan
\`${rune}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    if (dev_fallback_default) {
      const error = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function hydration_failed() {
    if (dev_fallback_default) {
      const error = new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/hydration_failed`);
    }
  }
  function props_invalid_value(key2) {
    if (dev_fallback_default) {
      const error = new Error(`props_invalid_value
Cannot do \`bind:${key2}={undefined}\` when \`${key2}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/props_invalid_value`);
    }
  }
  function rune_outside_svelte(rune) {
    if (dev_fallback_default) {
      const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
    }
  }
  function state_descriptors_fixed() {
    if (dev_fallback_default) {
      const error = new Error(`state_descriptors_fixed
Property descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.
https://svelte.dev/e/state_descriptors_fixed`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    if (dev_fallback_default) {
      const error = new Error(`state_prototype_fixed
Cannot set prototype of \`$state\` object
https://svelte.dev/e/state_prototype_fixed`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    if (dev_fallback_default) {
      const error = new Error(`state_unsafe_mutation
Updating state inside \`$derived(...)\`, \`$inspect(...)\` or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`
https://svelte.dev/e/state_unsafe_mutation`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  function svelte_boundary_reset_onerror() {
    if (dev_fallback_default) {
      const error = new Error(`svelte_boundary_reset_onerror
A \`<svelte:boundary>\` \`reset\` function cannot be called while an error is still being handled
https://svelte.dev/e/svelte_boundary_reset_onerror`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
    }
  }

  // node_modules/svelte/src/internal/flags/index.js
  var async_mode_flag = false;
  var legacy_mode_flag = false;
  var tracing_mode_flag = false;

  // node_modules/svelte/src/internal/client/dev/tracing.js
  var tracing_expressions = null;
  function tag(source2, label) {
    source2.label = label;
    tag_proxy(source2.v, label);
    return source2;
  }
  function tag_proxy(value, label) {
    value?.[PROXY_PATH_SYMBOL]?.(label);
    return value;
  }

  // node_modules/svelte/src/internal/shared/dev.js
  function get_error(label) {
    const error = new Error();
    const stack2 = get_stack();
    if (stack2.length === 0) {
      return null;
    }
    stack2.unshift("\n");
    define_property(error, "stack", {
      value: stack2.join("\n")
    });
    define_property(error, "name", {
      value: label
    });
    return (
      /** @type {Error & { stack: string }} */
      error
    );
  }
  function get_stack() {
    const limit = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    const stack2 = new Error().stack;
    Error.stackTraceLimit = limit;
    if (!stack2) return [];
    const lines = stack2.split("\n");
    const new_lines = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const posixified = line.replaceAll("\\", "/");
      if (line.trim() === "Error") {
        continue;
      }
      if (line.includes("validate_each_keys")) {
        return [];
      }
      if (posixified.includes("svelte/src/internal") || posixified.includes("node_modules/.vite")) {
        continue;
      }
      new_lines.push(line);
    }
    return new_lines;
  }
  function invariant(condition, message) {
    if (!dev_fallback_default) {
      throw new Error("invariant(...) was not guarded by if (DEV)");
    }
    if (!condition) invariant_violation(message);
  }

  // node_modules/svelte/src/internal/client/context.js
  var component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  var dev_stack = null;
  function set_dev_stack(stack2) {
    dev_stack = stack2;
  }
  var dev_current_component_function = null;
  function set_dev_current_component_function(fn) {
    dev_current_component_function = fn;
  }
  function push(props, runes = false, fn) {
    component_context = {
      p: component_context,
      i: false,
      c: null,
      e: null,
      s: props,
      x: null,
      r: (
        /** @type {Effect} */
        active_effect
      ),
      l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
    };
    if (dev_fallback_default) {
      component_context.function = fn;
      dev_current_component_function = fn;
    }
  }
  function pop(component2) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    var effects = context.e;
    if (effects !== null) {
      context.e = null;
      for (var fn of effects) {
        create_user_effect(fn);
      }
    }
    if (component2 !== void 0) {
      context.x = component2;
    }
    context.i = true;
    component_context = context.p;
    if (dev_fallback_default) {
      dev_current_component_function = component_context?.function ?? null;
    }
    return mark_as_component(component2);
  }
  function mark_as_component(component2 = {}) {
    define_property(component2, COMPONENT_SYMBOL, { value: true });
    return component2;
  }
  function is_runes() {
    return !legacy_mode_flag || component_context !== null && component_context.l === null;
  }

  // node_modules/svelte/src/internal/client/dom/task.js
  var micro_tasks = [];
  function run_micro_tasks() {
    var tasks = micro_tasks;
    micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0 && !is_flushing_sync) {
      var tasks = micro_tasks;
      queueMicrotask(() => {
        if (tasks === micro_tasks) run_micro_tasks();
      });
    }
    micro_tasks.push(fn);
  }
  function flush_tasks() {
    while (micro_tasks.length > 0) {
      run_micro_tasks();
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/status.js
  var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function update_derived_status(derived2) {
    if ((derived2.f & CONNECTED) !== 0 || derived2.deps === null) {
      set_signal_status(derived2, CLEAN);
    } else {
      set_signal_status(derived2, MAYBE_DIRTY);
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/utils.js
  function defer_effect(effect2, dirty_reactions) {
    if ((effect2.f & DIRTY) !== 0) {
      dirty_reactions.set(effect2, DIRTY);
    } else if ((effect2.f & MAYBE_DIRTY) !== 0 && dirty_reactions.get(effect2) !== DIRTY) {
      dirty_reactions.set(effect2, MAYBE_DIRTY);
    }
    set_signal_status(effect2, CLEAN);
  }

  // node_modules/svelte/src/internal/client/dev/debug.js
  function stringify_derived(fn) {
    return `{${fn.toString().replace(/^async \(\) => /, "").replace(/^\(/, "").replace(/\$\.get\((.+?)\)/g, (_, name) => name).replace(/\$\.track_reactivity_loss\((.+?)\)\(\)/g, (_, name) => name).replace(/\)$/, "")}}`;
  }

  // node_modules/svelte/src/internal/client/dom/elements/misc.js
  function autofocus(dom, value) {
    if (value) {
      const body = document.body;
      dom.autofocus = true;
      queue_micro_task(() => {
        if (document.activeElement === body) {
          dom.focus();
        }
      });
    }
  }
  function remove_textarea_child(dom) {
    if (hydrating && get_first_child(dom) !== null) {
      clear_text_content(dom);
    }
  }
  var listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            if (!evt.defaultPrevented) {
              for (
                const e of
                /**@type {HTMLFormElement} */
                evt.target.elements
              ) {
                e[FORM_RESET_HANDLER]?.();
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
        { capture: true }
      );
    }
  }

  // node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function listen_to_event_and_reset_event(element2, event2, handler, on_reset = handler) {
    element2.addEventListener(event2, () => without_reactive_context(handler));
    const prev = (
      /** @type {any} */
      element2[FORM_RESET_HANDLER]
    );
    if (prev) {
      element2[FORM_RESET_HANDLER] = () => {
        prev();
        on_reset(true);
      };
    } else {
      element2[FORM_RESET_HANDLER] = () => on_reset(true);
    }
    add_form_reset_listener();
  }

  // node_modules/svelte/src/internal/client/reactivity/async.js
  function flatten(blockers, sync, async2, fn) {
    const d = is_runes() ? derived : derived_safe_equal;
    var pending2 = blockers.filter((b) => !b.settled);
    var deriveds = sync.map(d);
    if (dev_fallback_default) {
      deriveds.forEach((d2, i) => {
        d2.label = sync[i].toString().replace("() => ", "").replaceAll("$.eager(() => ", "$state.eager(").replace(/\$\.get\((.+?)\)/g, (_, id) => id);
      });
    }
    if (async2.length === 0 && pending2.length === 0) {
      fn(deriveds);
      return;
    }
    var parent = (
      /** @type {Effect} */
      active_effect
    );
    var restore = capture();
    var blocker_promise = pending2.length === 1 ? pending2[0].promise : pending2.length > 1 ? Promise.all(pending2.map((b) => b.promise)) : null;
    function finish(async3) {
      if ((parent.f & DESTROYED) !== 0) {
        return;
      }
      restore();
      try {
        fn([...deriveds, ...async3]);
      } catch (error) {
        invoke_error_boundary(error, parent);
      }
      unset_context();
    }
    var decrement_pending = increment_pending();
    if (async2.length === 0) {
      blocker_promise.then(() => finish([])).finally(decrement_pending);
      return;
    }
    function run3() {
      Promise.all(async2.map((expression) => async_derived(expression))).then(finish).catch((error) => invoke_error_boundary(error, parent)).finally(decrement_pending);
    }
    if (blocker_promise) {
      blocker_promise.then(() => {
        if ((parent.f & DESTROYED) !== 0) {
          decrement_pending();
          return;
        }
        restore();
        run3();
        unset_context();
      });
    } else {
      run3();
    }
  }
  function capture() {
    var previous_effect = (
      /** @type {Effect} */
      active_effect
    );
    var previous_reaction = active_reaction;
    var previous_component_context = component_context;
    var previous_batch2 = (
      /** @type {Batch} */
      current_batch
    );
    if (dev_fallback_default) {
      var previous_dev_stack = dev_stack;
    }
    return function restore(activate_batch = true) {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_component_context);
      if (activate_batch && (previous_effect.f & DESTROYED) === 0) {
        previous_batch2?.activate();
        previous_batch2?.apply();
      }
      if (dev_fallback_default) {
        set_reactivity_loss_tracker(null);
        set_dev_stack(previous_dev_stack);
      }
    };
  }
  var restored = false;
  function unset_context(deactivate_batch = true) {
    restored = false;
    set_active_effect(null);
    set_active_reaction(null);
    set_component_context(null);
    if (deactivate_batch) current_batch?.deactivate();
    if (dev_fallback_default) {
      set_reactivity_loss_tracker(null);
      set_dev_stack(null);
    }
  }
  function increment_pending() {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    var boundary2 = effect2.b;
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var blocking = !!boundary2?.is_rendered();
    boundary2?.update_pending_count(1, batch);
    batch.increment(blocking, effect2);
    return () => {
      boundary2?.update_pending_count(-1, batch);
      batch.decrement(blocking, effect2);
    };
  }

  // node_modules/svelte/src/internal/client/reactivity/deriveds.js
  var reactivity_loss_tracker = null;
  function set_reactivity_loss_tracker(v) {
    reactivity_loss_tracker = v;
  }
  var recent_async_deriveds = /* @__PURE__ */ new Set();
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags2 = DERIVED | DIRTY;
    if (active_effect !== null) {
      active_effect.f |= EFFECT_PRESERVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags2,
      fn,
      reactions: null,
      rv: 0,
      v: (
        /** @type {V} */
        UNINITIALIZED
      ),
      wv: 0,
      parent: active_effect,
      ac: null
    };
    if (dev_fallback_default && tracing_mode_flag) {
      signal.created = get_error("created at");
    }
    return signal;
  }
  var OBSOLETE = Symbol("obsolete");
  // @__NO_SIDE_EFFECTS__
  function async_derived(fn, label, location) {
    let parent = (
      /** @type {Effect | null} */
      active_effect
    );
    if (parent === null) {
      async_derived_orphan();
    }
    var promise = (
      /** @type {Promise<V>} */
      /** @type {unknown} */
      void 0
    );
    var signal = source(
      /** @type {V} */
      UNINITIALIZED
    );
    if (dev_fallback_default) signal.label = label ?? stringify_derived(fn);
    var should_suspend = !active_reaction;
    var deferreds = /* @__PURE__ */ new Set();
    async_effect(() => {
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      if (dev_fallback_default) {
        reactivity_loss_tracker = { effect: effect2, effect_deps: /* @__PURE__ */ new Set(), warned: false };
      }
      var d = deferred();
      promise = d.promise;
      try {
        Promise.resolve(fn()).then(d.resolve, (e) => {
          if (e !== STALE_REACTION) d.reject(e);
        }).finally(unset_context);
      } catch (error) {
        d.reject(error);
        unset_context();
      }
      if (dev_fallback_default) {
        if (reactivity_loss_tracker) {
          if (effect2.deps !== null) {
            for (let i = 0; i < skipped_deps; i += 1) {
              reactivity_loss_tracker.effect_deps.add(effect2.deps[i]);
            }
          }
          if (new_deps !== null) {
            for (let i = 0; i < new_deps.length; i += 1) {
              reactivity_loss_tracker.effect_deps.add(new_deps[i]);
            }
          }
        }
        reactivity_loss_tracker = null;
      }
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      if (should_suspend) {
        if ((effect2.f & REACTION_RAN) !== 0) {
          var decrement_pending = increment_pending();
        }
        if (
          // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
          parent.b?.is_rendered()
        ) {
          batch.async_deriveds.get(effect2)?.reject(OBSOLETE);
        } else {
          for (const d2 of deferreds.values()) {
            d2.reject(OBSOLETE);
          }
        }
        deferreds.add(d);
        batch.async_deriveds.set(effect2, d);
      }
      const handler = (value, error = void 0) => {
        if (dev_fallback_default) {
          reactivity_loss_tracker = null;
        }
        decrement_pending?.();
        deferreds.delete(d);
        if (error === OBSOLETE) return;
        batch.activate();
        if (error) {
          signal.f |= ERROR_VALUE;
          internal_set(signal, error);
        } else {
          if ((signal.f & ERROR_VALUE) !== 0) {
            signal.f ^= ERROR_VALUE;
          }
          if (dev_fallback_default && location !== void 0 && !signal.equals(value)) {
            recent_async_deriveds.add(signal);
            setTimeout(() => {
              if (recent_async_deriveds.has(signal) && (effect2.f & DESTROYED) === 0) {
                await_waterfall(
                  /** @type {string} */
                  signal.label,
                  location
                );
                recent_async_deriveds.delete(signal);
              }
            });
          }
          internal_set(signal, value);
        }
        batch.deactivate();
      };
      d.promise.then(handler, (e) => handler(null, e || "unknown"));
    });
    teardown(() => {
      for (const d of deferreds) {
        d.reject(OBSOLETE);
      }
    });
    if (dev_fallback_default) {
      signal.f |= ASYNC;
    }
    return new Promise((fulfil) => {
      function next2(p) {
        function go() {
          if (p === promise) {
            fulfil(signal);
          } else {
            next2(promise);
          }
        }
        p.then(go, go);
      }
      next2(promise);
    });
  }
  // @__NO_SIDE_EFFECTS__
  function user_derived(fn) {
    const d = /* @__PURE__ */ derived(fn);
    if (!async_mode_flag) push_reaction_value(d);
    return d;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived2) {
    var effects = derived2.effects;
    if (effects !== null) {
      derived2.effects = null;
      for (var i = 0; i < effects.length; i += 1) {
        destroy_effect(
          /** @type {Effect} */
          effects[i]
        );
      }
    }
  }
  var stack = [];
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    var parent = derived2.parent;
    if (!is_destroying_effect && parent !== null && derived2.v !== UNINITIALIZED && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
    (parent.f & (DESTROYED | INERT)) !== 0) {
      derived_inert();
      return derived2.v;
    }
    set_active_effect(parent);
    if (dev_fallback_default) {
      let prev_eager_effects = eager_effects;
      set_eager_effects(/* @__PURE__ */ new Set());
      try {
        if (includes.call(stack, derived2)) {
          derived_references_self();
        }
        stack.push(derived2);
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
        set_eager_effects(prev_eager_effects);
        stack.pop();
      }
    } else {
      try {
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    if (!derived2.equals(value)) {
      derived2.wv = increment_write_version();
      if (!current_batch?.is_fork || derived2.deps === null) {
        if (current_batch !== null) {
          current_batch.capture(derived2, value, true);
          previous_batch?.capture(derived2, value, true);
        } else {
          derived2.v = value;
        }
        if (derived2.deps === null) {
          set_signal_status(derived2, CLEAN);
          return;
        }
      }
    }
    if (is_destroying_effect) {
      return;
    }
    if (batch_values !== null) {
      if (effect_tracking() || current_batch?.is_fork) {
        batch_values.set(derived2, value);
      }
    } else {
      update_derived_status(derived2);
    }
  }
  function freeze_derived_effects(derived2) {
    if (derived2.effects === null) return;
    for (const e of derived2.effects) {
      if (e.teardown || e.ac) {
        e.teardown?.();
        if (e.ac !== null) {
          without_reactive_context(() => {
            e.ac.abort(STALE_REACTION);
            e.ac = null;
          });
        }
        if (e.fn !== null) e.teardown = noop;
        remove_reactions(e, 0);
        destroy_effect_children(e);
      }
    }
  }
  function unfreeze_derived_effects(derived2) {
    if (derived2.effects === null) return;
    for (const e of derived2.effects) {
      if (e.teardown && e.fn !== null) {
        update_effect(e);
      }
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/batch.js
  var first_batch = null;
  var last_batch = null;
  var current_batch = null;
  var previous_batch = null;
  var batch_values = null;
  var last_scheduled_effect = null;
  var is_flushing_sync = false;
  var is_processing = false;
  var collected_effects = null;
  var legacy_updates = null;
  var flush_count = 0;
  var source_stacks = /* @__PURE__ */ new Set();
  var uid = 1;
  var Batch = class _Batch {
    id = uid++;
    /** True as soon as `#process` was called */
    started = false;
    linked = true;
    /** @type {Batch | null} */
    prev = null;
    /** @type {Batch | null} */
    next = null;
    /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
    async_deriveds = /* @__PURE__ */ new Map();
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * The keys of this map are identical to `this.previous`
     * @type {Map<Value, [any, boolean]>}
     */
    current = /* @__PURE__ */ new Map();
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * The keys of this map are identical to `this.current`
     * @type {Map<Value, any>}
     */
    previous = /* @__PURE__ */ new Map();
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    #commit_callbacks = /* @__PURE__ */ new Set();
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    #discard_callbacks = /* @__PURE__ */ new Set();
    /**
     * The number of async effects that are currently in flight
     */
    #pending = 0;
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    #blocking_pending = /* @__PURE__ */ new Map();
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    #deferred = null;
    /**
     * Effects that were scheduled in this batch but not yet 'resolved' into the
     * root effects that need to be flushed. Resolving — the upwards traversal that
     * marks the path to each effect on the shared effect tree (see #resolve) — is
     * deferred until the batch is processed, so that the markers are created and
     * consumed within a single traversal. Scheduling into other batches (which can
     * happen concurrently, e.g. while a batch is committed) can therefore never
     * observe (and be confused by) this batch's markers.
     * May contain duplicates — deduplication happens during resolving
     * @type {Effect[]}
     */
    #scheduled = [];
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    #new_effects = [];
    /**
     * Deferred effects (which run after async work has completed) and their status (DIRTY or MAYBE_DIRTY)
     * @type {Map<Effect, number>}
     */
    #dirty_reactions = /* @__PURE__ */ new Map();
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    #skipped_branches = /* @__PURE__ */ new Map();
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    #unskipped_branches = /* @__PURE__ */ new Set();
    is_fork = false;
    #decrement_queued = false;
    constructor() {
      if (last_batch === null) {
        first_batch = last_batch = this;
      } else {
        last_batch.next = this;
        this.prev = last_batch;
      }
      last_batch = this;
    }
    #is_deferred() {
      if (this.is_fork) return true;
      for (const effect2 of this.#blocking_pending.keys()) {
        if (!this.#is_skipped(effect2)) {
          return true;
        }
      }
      return false;
    }
    /**
     * Whether `effect` is inside a branch that this batch skips
     * @param {Effect} effect
     */
    #is_skipped(effect2) {
      for (var e = (
        /** @type {Effect | null} */
        effect2
      ); e !== null; e = e.parent) {
        if (this.#skipped_branches.has(e)) return true;
      }
      return false;
    }
    /**
     * Add an effect to the #skipped_branches map and reset its children
     * @param {Effect} effect
     */
    skip_effect(effect2) {
      if (!this.#skipped_branches.has(effect2)) {
        this.#skipped_branches.set(effect2, { d: [], m: [] });
      }
      this.#unskipped_branches.delete(effect2);
    }
    /**
     * Remove an effect from the #skipped_branches map and reschedule
     * any tracked dirty/maybe_dirty child effects
     * @param {Effect} effect
     * @param {(e: Effect) => void} callback
     */
    unskip_effect(effect2, callback = (e) => this.schedule(e)) {
      var tracked = this.#skipped_branches.get(effect2);
      if (tracked) {
        this.#skipped_branches.delete(effect2);
        for (var e of tracked.d) {
          set_signal_status(e, DIRTY);
          callback(e);
        }
        for (e of tracked.m) {
          set_signal_status(e, MAYBE_DIRTY);
          callback(e);
        }
      }
      this.#unskipped_branches.add(effect2);
    }
    /**
     * Convert the effects that were scheduled in this batch into the root effects
     * that need to be traversed, marking the path to each effect (by clearing the
     * `CLEAN` flag on ancestor branches) so that the traversal can find them.
     * This happens right before traversal rather than at scheduling time, so that
     * the markers left on the (shared) effect tree are created and consumed within
     * a single traversal — scheduling into other batches can never observe them
     * @returns {Effect[]}
     */
    #resolve() {
      var roots = [];
      for (const effect2 of this.#scheduled) {
        if ((effect2.f & DESTROYED) !== 0 || (effect2.f & (DIRTY | MAYBE_DIRTY)) === 0) continue;
        var e = effect2;
        var covered = false;
        while (e.parent !== null) {
          e = e.parent;
          var flags2 = e.f;
          if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
            if ((flags2 & CLEAN) === 0) {
              covered = true;
              break;
            }
            e.f ^= CLEAN;
          }
        }
        if (!covered) {
          roots.push(e);
        }
      }
      this.#scheduled = [];
      return roots;
    }
    #process() {
      this.started = true;
      if (dev_fallback_default) {
        for (const value of this.current.keys()) {
          source_stacks.add(value);
        }
      }
      for (const [e, status] of this.#dirty_reactions) {
        set_signal_status(e, status);
        this.schedule(e);
      }
      this.apply();
      var effects = collected_effects = [];
      var render_effects = [];
      var updates = legacy_updates = [];
      while (this.#scheduled.length > 0) {
        if (flush_count++ > 1e3) {
          this.#unlink();
          infinite_loop_guard();
        }
        for (const root8 of this.#resolve()) {
          try {
            this.#traverse(root8, effects, render_effects);
          } catch (e) {
            reset_all(root8);
            if (!this.#is_deferred()) this.discard();
            throw e;
          }
        }
      }
      current_batch = null;
      if (updates.length > 0) {
        var batch = _Batch.ensure();
        for (const e of updates) {
          batch.schedule(e);
        }
      }
      collected_effects = null;
      legacy_updates = null;
      if (this.#is_deferred()) {
        this.#defer_effects(render_effects);
        this.#defer_effects(effects);
        for (const [e, t] of this.#skipped_branches) {
          reset_branch(e, t);
        }
        if (updates.length > 0) {
          /** @type {unknown} */
          current_batch.#process();
        }
        return;
      }
      const earlier_batch = this.#find_earlier_batch();
      if (earlier_batch) {
        this.#defer_effects(render_effects);
        this.#defer_effects(effects);
        earlier_batch.#merge(this);
        return;
      }
      this.#dirty_reactions.clear();
      for (const fn of this.#commit_callbacks) fn(this);
      this.#commit_callbacks.clear();
      previous_batch = this;
      flush_queued_effects(render_effects);
      flush_queued_effects(effects);
      previous_batch = null;
      this.#deferred?.resolve();
      var next_batch = (
        /** @type {Batch | null} */
        /** @type {unknown} */
        current_batch
      );
      if (this.#pending === 0 && (this.#scheduled.length === 0 || next_batch !== null)) {
        this.#unlink();
        if (async_mode_flag) {
          this.#commit();
          current_batch = next_batch;
        }
      }
      if (next_batch !== null) {
        old_values.clear();
        next_batch.#process();
      }
    }
    /**
     * Traverse the effect tree, executing effects or stashing
     * them for later execution as appropriate
     * @param {Effect} root
     * @param {Effect[]} effects
     * @param {Effect[]} render_effects
     */
    #traverse(root8, effects, render_effects) {
      root8.f ^= CLEAN;
      var effect2 = root8.first;
      while (effect2 !== null) {
        var flags2 = effect2.f;
        var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
        var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
        var skip = is_skippable_branch || (flags2 & INERT) !== 0 || this.#skipped_branches.has(effect2);
        if (!skip && effect2.fn !== null) {
          if (is_branch) {
            effect2.f ^= CLEAN;
          } else if ((flags2 & EFFECT) !== 0) {
            effects.push(effect2);
          } else if (async_mode_flag && (flags2 & (RENDER_EFFECT | MANAGED_EFFECT)) !== 0) {
            render_effects.push(effect2);
          } else if (is_dirty(effect2)) {
            if ((flags2 & BLOCK_EFFECT) !== 0) this.add_dirty_reaction(effect2, MAYBE_DIRTY);
            update_effect(effect2);
          }
          var child2 = effect2.first;
          if (child2 !== null) {
            effect2 = child2;
            continue;
          }
        }
        while (effect2 !== null) {
          var next2 = effect2.next;
          if (next2 !== null) {
            effect2 = next2;
            break;
          }
          effect2 = effect2.parent;
        }
      }
    }
    #find_earlier_batch() {
      for (var batch = this.prev; batch !== null; batch = batch.prev) {
        if (!batch.is_fork && this.#intersects(batch)) return batch;
      }
      return null;
    }
    /** @param {Batch} batch */
    #intersects(batch) {
      for (const [source2, [, is_derived]] of this.current) {
        if (is_derived) continue;
        if (batch.current.has(source2)) return true;
      }
      return false;
    }
    /**
     * @param {Batch} batch
     */
    #merge(batch) {
      for (const [source2, value] of batch.current) {
        if (!this.previous.has(source2) && batch.previous.has(source2)) {
          this.previous.set(source2, batch.previous.get(source2));
        }
        this.current.set(source2, value);
      }
      for (const [effect2, deferred2] of batch.async_deriveds) {
        const d = this.async_deriveds.get(effect2);
        if (d) deferred2.promise.then(d.resolve).catch(d.reject);
      }
      batch.async_deriveds.clear();
      this.transfer_reactions(batch.#dirty_reactions);
      const mark = (value) => {
        var reactions = value.reactions;
        if (reactions === null) return;
        if ((value.f & DERIVED) !== 0 && (value.f & (DIRTY | MAYBE_DIRTY)) === 0) {
          return;
        }
        for (const reaction of reactions) {
          var flags2 = reaction.f;
          if ((flags2 & DERIVED) !== 0) {
            mark(
              /** @type {Derived} */
              reaction
            );
          } else {
            var effect2 = (
              /** @type {Effect} */
              reaction
            );
            if (flags2 & (ASYNC | BLOCK_EFFECT) && !this.async_deriveds.has(effect2)) {
              this.#dirty_reactions.delete(effect2);
              set_signal_status(effect2, DIRTY);
              this.schedule(effect2);
            }
          }
        }
      };
      for (const source2 of this.current.keys()) {
        mark(source2);
      }
      this.oncommit(() => batch.discard());
      batch.#unlink();
      current_batch = this;
      this.#process();
    }
    /**
     * @param {Effect[]} effects
     */
    #defer_effects(effects) {
      for (var i = 0; i < effects.length; i += 1) {
        defer_effect(effects[i], this.#dirty_reactions);
      }
    }
    /**
     * Associate a change to a given source with the current
     * batch, noting its previous and current values
     * @param {Value} source
     * @param {any} value
     * @param {boolean} [is_derived]
     */
    capture(source2, value, is_derived = false) {
      if (source2.v !== UNINITIALIZED && !this.previous.has(source2)) {
        this.previous.set(source2, source2.v);
      }
      if ((source2.f & ERROR_VALUE) === 0) {
        this.current.set(source2, [value, is_derived]);
        batch_values?.set(source2, value);
      }
      if (!this.is_fork) {
        source2.v = value;
      }
    }
    activate() {
      current_batch = this;
    }
    deactivate() {
      current_batch = null;
      batch_values = null;
    }
    flush() {
      try {
        if (dev_fallback_default) {
          source_stacks.clear();
        }
        is_processing = true;
        current_batch = this;
        this.#process();
      } finally {
        flush_count = 0;
        last_scheduled_effect = null;
        collected_effects = null;
        legacy_updates = null;
        is_processing = false;
        current_batch = null;
        batch_values = null;
        old_values.clear();
        if (dev_fallback_default) {
          for (const source2 of source_stacks) {
            source2.updated = null;
          }
        }
      }
    }
    discard() {
      for (const fn of this.#discard_callbacks) fn(this);
      this.#discard_callbacks.clear();
      for (const deferred2 of this.async_deriveds.values()) {
        deferred2.reject(OBSOLETE);
      }
      this.#unlink();
      this.#deferred?.resolve();
    }
    /**
     * @param {Effect} effect
     */
    register_created_effect(effect2) {
      this.#new_effects.push(effect2);
    }
    #commit() {
      for (let batch = first_batch; batch !== null; batch = batch.next) {
        var is_earlier = batch.id < this.id;
        var sources = [];
        for (const [source3, [value, is_derived]] of this.current) {
          if (batch.current.has(source3)) {
            var batch_value = (
              /** @type {[any, boolean]} */
              batch.current.get(source3)[0]
            );
            if (is_earlier && value !== batch_value) {
              batch.current.set(source3, [value, is_derived]);
            } else {
              continue;
            }
          }
          sources.push(source3);
        }
        if (is_earlier) {
          for (const [effect2, deferred2] of this.async_deriveds) {
            const d = batch.async_deriveds.get(effect2);
            if (d) deferred2.promise.then(d.resolve).catch(d.reject);
          }
        }
        var current = [...batch.current.keys()].filter(
          (source3) => !/** @type {[any, boolean]} */
          batch.current.get(source3)[1]
        );
        if (!batch.started || current.length === 0) continue;
        var others = current.filter((source3) => !this.current.has(source3));
        if (others.length === 0) {
          if (is_earlier) {
            batch.discard();
          }
        } else if (sources.length > 0) {
          if (dev_fallback_default && !batch.#decrement_queued) {
            invariant(batch.#scheduled.length === 0, "Batch has scheduled effects");
          }
          if (is_earlier) {
            for (const unskipped of this.#unskipped_branches) {
              batch.unskip_effect(unskipped, (e) => {
                if ((e.f & (BLOCK_EFFECT | ASYNC)) !== 0) {
                  batch.schedule(e);
                } else {
                  batch.#defer_effects([e]);
                }
              });
            }
          }
          batch.activate();
          var marked = /* @__PURE__ */ new Set();
          var checked = /* @__PURE__ */ new Map();
          for (var source2 of sources) {
            mark_effects(source2, others, marked, checked);
          }
          checked = /* @__PURE__ */ new Map();
          var current_unequal = [...batch.current].filter(([c, v1]) => {
            const v2 = this.current.get(c);
            if (!v2) return true;
            return v2[0] !== v1[0] || v2[1] !== v1[1];
          }).map(([c]) => c);
          if (current_unequal.length > 0) {
            for (const effect2 of this.#new_effects) {
              if ((effect2.f & (DESTROYED | INERT | EAGER_EFFECT)) === 0 && depends_on(effect2, current_unequal, checked)) {
                if ((effect2.f & (ASYNC | BLOCK_EFFECT)) !== 0) {
                  set_signal_status(effect2, DIRTY);
                  batch.schedule(effect2);
                } else {
                  batch.add_dirty_reaction(effect2, DIRTY);
                }
              }
            }
          }
          if (batch.#scheduled.length > 0 && !batch.#decrement_queued) {
            batch.apply();
            for (var root8 of batch.#resolve()) {
              batch.#traverse(root8, [], []);
            }
          }
          batch.deactivate();
        }
      }
    }
    /**
     * @param {boolean} blocking
     * @param {Effect} effect
     */
    increment(blocking, effect2) {
      this.#pending += 1;
      if (blocking) {
        let blocking_pending_count = this.#blocking_pending.get(effect2) ?? 0;
        this.#blocking_pending.set(effect2, blocking_pending_count + 1);
      }
    }
    /**
     * @param {boolean} blocking
     * @param {Effect} effect
     */
    decrement(blocking, effect2) {
      this.#pending -= 1;
      if (blocking) {
        let blocking_pending_count = this.#blocking_pending.get(effect2) ?? 0;
        if (blocking_pending_count === 1) {
          this.#blocking_pending.delete(effect2);
        } else {
          this.#blocking_pending.set(effect2, blocking_pending_count - 1);
        }
      }
      if (this.#decrement_queued) return;
      this.#decrement_queued = true;
      queue_micro_task(() => {
        this.#decrement_queued = false;
        if (this.linked) {
          this.flush();
        }
      });
    }
    /**
     * @param {Map<Effect, number>} dirty_reactions
     */
    transfer_reactions(dirty_reactions) {
      for (const [effect2, status] of dirty_reactions) {
        this.add_dirty_reaction(effect2, status);
      }
      dirty_reactions.clear();
    }
    /**
     * @param {Effect} effect
     * @param {number} status
     */
    add_dirty_reaction(effect2, status) {
      if (status === DIRTY || this.#dirty_reactions.get(effect2) !== DIRTY) {
        this.#dirty_reactions.set(effect2, status);
      }
    }
    /** @param {(batch: Batch) => void} fn */
    oncommit(fn) {
      this.#commit_callbacks.add(fn);
    }
    /** @param {(batch: Batch) => void} fn */
    ondiscard(fn) {
      this.#discard_callbacks.add(fn);
    }
    settled() {
      return (this.#deferred ??= deferred()).promise;
    }
    static ensure() {
      if (current_batch === null) {
        const batch = current_batch = new _Batch();
        if (!is_processing && !is_flushing_sync) {
          queue_micro_task(() => {
            if (!batch.started) {
              batch.flush();
            }
          });
        }
      }
      return current_batch;
    }
    apply() {
      if (!async_mode_flag || !this.is_fork && this.prev === null && this.next === null) {
        batch_values = null;
        return;
      }
      batch_values = /* @__PURE__ */ new Map();
      for (const [source2, [value]] of this.current) {
        batch_values.set(source2, value);
      }
      for (let batch = first_batch; batch !== null; batch = batch.next) {
        if (batch === this || batch.is_fork) continue;
        if (batch.id >= this.id || !batch.#intersects(this)) {
          for (const [source2, previous] of batch.previous) {
            if (!batch_values.has(source2)) {
              batch_values.set(source2, previous);
            }
          }
        }
      }
    }
    /**
     *
     * @param {Effect} effect
     */
    schedule(effect2) {
      last_scheduled_effect = effect2;
      if (effect2.b?.is_pending && (effect2.f & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0 && (effect2.f & REACTION_RAN) === 0) {
        effect2.b.defer_effect(effect2);
        return;
      }
      this.#scheduled.push(effect2);
    }
    #unlink() {
      if (!this.linked) return;
      var prev = this.prev;
      var next2 = this.next;
      if (prev === null) {
        first_batch = next2;
      } else {
        prev.next = next2;
      }
      if (next2 === null) {
        last_batch = prev;
      } else {
        next2.prev = prev;
      }
      this.linked = false;
    }
  };
  function flushSync(fn) {
    var was_flushing_sync = is_flushing_sync;
    var prev_previous_batch = previous_batch;
    previous_batch = null;
    is_flushing_sync = true;
    try {
      var result;
      if (fn) {
        flushSync();
        result = fn();
      }
      while (true) {
        flush_tasks();
        if (current_batch === null) {
          return (
            /** @type {T} */
            result
          );
        }
        current_batch.flush();
      }
    } finally {
      is_flushing_sync = was_flushing_sync;
      previous_batch = prev_previous_batch;
    }
  }
  function infinite_loop_guard() {
    if (dev_fallback_default) {
      var updates = /* @__PURE__ */ new Map();
      for (
        const source2 of
        /** @type {Batch} */
        current_batch.current.keys()
      ) {
        for (const [stack2, update2] of source2.updated ?? []) {
          var entry = updates.get(stack2);
          if (!entry) {
            entry = { error: update2.error, count: 0 };
            updates.set(stack2, entry);
          }
          entry.count += update2.count;
        }
      }
      for (const update2 of updates.values()) {
        if (update2.error) {
          console.error(update2.error);
        }
      }
    }
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      if (dev_fallback_default) {
        define_property(error, "stack", { value: "" });
      }
      invoke_error_boundary(error, last_scheduled_effect);
    }
  }
  var eager_block_effects = null;
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    var i = 0;
    while (i < length) {
      var effect2 = effects[i++];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
        eager_block_effects = /* @__PURE__ */ new Set();
        update_effect(effect2);
        if (effect2.deps === null && effect2.first === null && effect2.nodes === null && effect2.teardown === null && effect2.ac === null) {
          unlink_effect(effect2);
        }
        if (eager_block_effects?.size > 0) {
          old_values.clear();
          for (const e of eager_block_effects) {
            if ((e.f & (DESTROYED | INERT)) !== 0) continue;
            const ordered_effects = [e];
            let ancestor = e.parent;
            while (ancestor !== null) {
              if (eager_block_effects.has(ancestor)) {
                eager_block_effects.delete(ancestor);
                ordered_effects.push(ancestor);
              }
              ancestor = ancestor.parent;
            }
            for (let j = ordered_effects.length - 1; j >= 0; j--) {
              const e2 = ordered_effects[j];
              if ((e2.f & (DESTROYED | INERT)) !== 0) continue;
              update_effect(e2);
            }
          }
          eager_block_effects.clear();
        }
      }
    }
    eager_block_effects = null;
  }
  function mark_effects(value, sources, marked, checked) {
    if (marked.has(value)) return;
    marked.add(value);
    if (value.reactions !== null) {
      for (const reaction of value.reactions) {
        const flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark_effects(
            /** @type {Derived} */
            reaction,
            sources,
            marked,
            checked
          );
        } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
          set_signal_status(reaction, DIRTY);
          schedule_effect(
            /** @type {Effect} */
            reaction
          );
        }
      }
    }
  }
  function depends_on(reaction, sources, checked) {
    const depends = checked.get(reaction);
    if (depends !== void 0) return depends;
    if (reaction.deps !== null) {
      for (const dep of reaction.deps) {
        if (includes.call(sources, dep)) {
          return true;
        }
        if ((dep.f & DERIVED) !== 0 && depends_on(
          /** @type {Derived} */
          dep,
          sources,
          checked
        )) {
          checked.set(
            /** @type {Derived} */
            dep,
            true
          );
          return true;
        }
      }
    }
    checked.set(reaction, false);
    return false;
  }
  function schedule_effect(effect2) {
    current_batch.schedule(effect2);
  }
  function reset_branch(effect2, tracked) {
    if ((effect2.f & BRANCH_EFFECT) !== 0 && (effect2.f & CLEAN) !== 0) {
      return;
    }
    if ((effect2.f & DIRTY) !== 0) {
      tracked.d.push(effect2);
    } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
      tracked.m.push(effect2);
    }
    set_signal_status(effect2, CLEAN);
    var e = effect2.first;
    while (e !== null) {
      reset_branch(e, tracked);
      e = e.next;
    }
  }
  function reset_all(effect2) {
    set_signal_status(effect2, CLEAN);
    var e = effect2.first;
    while (e !== null) {
      reset_all(e);
      e = e.next;
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/sources.js
  var eager_effects = /* @__PURE__ */ new Set();
  var old_values = /* @__PURE__ */ new Map();
  function set_eager_effects(v) {
    eager_effects = v;
  }
  var eager_effects_deferred = false;
  function set_eager_effects_deferred() {
    eager_effects_deferred = true;
  }
  function source(v, stack2) {
    var signal = {
      f: 0,
      v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    if (dev_fallback_default && tracing_mode_flag) {
      signal.created = stack2 ?? get_error("created at");
      signal.updated = null;
      signal.set_during_effect = false;
      signal.trace = null;
    }
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v, stack2) {
    const s = source(v, stack2);
    push_reaction_value(s);
    return s;
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false, trackable = true) {
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
      (component_context.l.s ??= []).push(s);
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
    // to ensure we error if state is set inside an inspect effect
    (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !current_sources.has(source2))) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    if (dev_fallback_default) {
      tag_proxy(
        new_value,
        /** @type {string} */
        source2.label
      );
    }
    return internal_set(source2, new_value, legacy_updates);
  }
  var seen = null;
  var count_deps = 0;
  function internal_set(source2, value, updated_during_traversal = null) {
    if (!source2.equals(value)) {
      if (is_destroying_effect) {
        old_values.set(source2, value);
      } else if (!old_values.has(source2)) {
        old_values.set(source2, source2.v);
      }
      var batch = Batch.ensure();
      batch.capture(source2, value);
      if (dev_fallback_default) {
        if (tracing_mode_flag || active_effect !== null) {
          source2.updated ??= /* @__PURE__ */ new Map();
          const count = (source2.updated.get("")?.count ?? 0) + 1;
          source2.updated.set("", { error: (
            /** @type {any} */
            null
          ), count });
          if (tracing_mode_flag || count > 5) {
            const error = get_error("updated at");
            if (error !== null) {
              let entry = source2.updated.get(error.stack);
              if (!entry) {
                entry = { error, count: 0 };
                source2.updated.set(error.stack, entry);
              }
              entry.count++;
            }
          }
        }
        if (active_effect !== null) {
          source2.set_during_effect = true;
        }
      }
      if ((source2.f & DERIVED) !== 0) {
        const derived2 = (
          /** @type {Derived} */
          source2
        );
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(derived2);
        }
        if (batch_values === null) {
          update_derived_status(derived2);
        }
      }
      source2.wv = increment_write_version();
      seen = null;
      count_deps = 0;
      mark_reactions(source2, DIRTY, updated_during_traversal);
      seen = null;
      if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
      if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
        flush_eager_effects();
      }
    }
    return value;
  }
  function flush_eager_effects() {
    eager_effects_deferred = false;
    for (const effect2 of eager_effects) {
      if ((effect2.f & CLEAN) !== 0) {
        set_signal_status(effect2, MAYBE_DIRTY);
      }
      let dirty;
      try {
        dirty = is_dirty(effect2);
      } catch {
        dirty = true;
      }
      if (dirty) {
        update_effect(effect2);
      }
    }
    eager_effects.clear();
  }
  function increment(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status, updated_during_traversal) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    count_deps += length;
    if (count_deps > 1e5 && seen === null) seen = /* @__PURE__ */ new Set();
    if (seen !== null) {
      if (seen.has(signal)) return;
      seen.add(signal);
    }
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags2 = reaction.f;
      if (!runes && reaction === active_effect) continue;
      var not_dirty = (flags2 & DIRTY) === 0;
      if (not_dirty) {
        set_signal_status(reaction, status);
      }
      if ((flags2 & EAGER_EFFECT) !== 0) {
        eager_effects.add(
          /** @type {Effect} */
          reaction
        );
      } else if ((flags2 & DERIVED) !== 0) {
        var derived2 = (
          /** @type {Derived} */
          reaction
        );
        batch_values?.delete(derived2);
        mark_reactions(derived2, MAYBE_DIRTY, updated_during_traversal);
      } else if (not_dirty) {
        var effect2 = (
          /** @type {Effect} */
          reaction
        );
        if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
          eager_block_effects.add(effect2);
        }
        if (updated_during_traversal !== null) {
          updated_during_traversal.push(effect2);
        } else {
          schedule_effect(effect2);
        }
      }
    }
  }

  // node_modules/svelte/src/internal/client/proxy.js
  var regex_is_valid_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value || COMPONENT_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = state(0);
    var stack2 = dev_fallback_default && tracing_mode_flag ? get_error("created at") : null;
    var parent_version = update_version;
    var with_parent = (fn) => {
      if (update_version === parent_version) {
        return fn();
      }
      var reaction = active_reaction;
      var version2 = update_version;
      set_active_reaction(null);
      set_update_version(parent_version);
      var result = fn();
      set_active_reaction(reaction);
      set_update_version(version2);
      return result;
    };
    if (is_proxied_array) {
      sources.set("length", state(
        /** @type {any[]} */
        value.length,
        stack2
      ));
      if (dev_fallback_default) {
        value = /** @type {any} */
        inspectable_array(
          /** @type {any[]} */
          value
        );
      }
    }
    var path = "";
    let updating = false;
    function update_path(new_path) {
      if (updating) return;
      updating = true;
      path = new_path;
      tag(version, `${path} version`);
      for (const [prop2, source2] of sources) {
        tag(source2, get_label(path, prop2));
      }
      updating = false;
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop2, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop2);
          if (s === void 0) {
            with_parent(() => {
              var s2 = state(descriptor.value, stack2);
              sources.set(prop2, s2);
              if (dev_fallback_default && typeof prop2 === "string") {
                tag(s2, get_label(path, prop2));
              }
              return s2;
            });
          } else {
            set(s, descriptor.value, true);
          }
          return true;
        },
        deleteProperty(target2, prop2) {
          var s = sources.get(prop2);
          if (s === void 0) {
            if (prop2 in target2) {
              const s2 = with_parent(() => state(UNINITIALIZED, stack2));
              sources.set(prop2, s2);
              increment(version);
              if (dev_fallback_default) {
                tag(s2, get_label(path, prop2));
              }
            }
          } else {
            set(s, UNINITIALIZED);
            increment(version);
          }
          return true;
        },
        get(target2, prop2, receiver) {
          if (prop2 === STATE_SYMBOL) {
            return value;
          }
          if (dev_fallback_default && prop2 === PROXY_PATH_SYMBOL) {
            return update_path;
          }
          var s = sources.get(prop2);
          var exists = prop2 in target2;
          if (s === void 0 && (!exists || get_descriptor(target2, prop2)?.writable)) {
            s = with_parent(() => {
              var p = proxy(exists ? target2[prop2] : UNINITIALIZED);
              var s2 = state(p, stack2);
              if (dev_fallback_default) {
                tag(s2, get_label(path, prop2));
              }
              return s2;
            });
            sources.set(prop2, s);
          }
          if (s !== void 0) {
            var v = get(s);
            return v === UNINITIALIZED ? void 0 : v;
          }
          return Reflect.get(target2, prop2, receiver);
        },
        getOwnPropertyDescriptor(target2, prop2) {
          this.has?.(target2, prop2);
          var descriptor = Reflect.getOwnPropertyDescriptor(target2, prop2);
          var s = sources.get(prop2);
          if (s !== void 0) {
            var value2 = get(s);
            if (value2 === UNINITIALIZED) {
              return void 0;
            }
            if (descriptor && "value" in descriptor) {
              descriptor.value = value2;
            } else {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target2, prop2) {
          if (prop2 === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop2);
          var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target2, prop2);
          if (s !== void 0 || (active_effect !== null || active_reaction !== null) && (!has || get_descriptor(target2, prop2)?.writable)) {
            if (s === void 0) {
              s = with_parent(() => {
                var p = has ? proxy(target2[prop2]) : UNINITIALIZED;
                var s2 = state(p, stack2);
                if (dev_fallback_default) {
                  tag(s2, get_label(path, prop2));
                }
                return s2;
              });
              sources.set(prop2, s);
            }
            var value2 = get(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target2, prop2, value2, receiver) {
          var s = sources.get(prop2);
          var has = prop2 in target2;
          if (is_proxied_array && prop2 === "length") {
            for (var i = value2; i < /** @type {Source<number>} */
            s.v; i += 1) {
              var other_s = sources.get(i + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target2) {
                other_s = with_parent(() => state(UNINITIALIZED, stack2));
                sources.set(i + "", other_s);
                if (dev_fallback_default) {
                  tag(other_s, get_label(path, i));
                }
              }
            }
          }
          if (s === void 0) {
            if (!has || get_descriptor(target2, prop2)?.writable) {
              s = with_parent(() => state(void 0, stack2));
              if (dev_fallback_default) {
                tag(s, get_label(path, prop2));
              }
              set(s, proxy(value2));
              sources.set(prop2, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            var p = with_parent(() => proxy(value2));
            set(s, p);
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target2, prop2);
          if (descriptor?.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n = Number(prop2);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
              }
            }
            increment(version);
          }
          return true;
        },
        ownKeys(target2) {
          get(version);
          var own_keys = Reflect.ownKeys(target2).filter((key3) => {
            var source3 = sources.get(key3);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key2, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key2 in target2)) {
              own_keys.push(key2);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  function get_label(path, prop2) {
    if (typeof prop2 === "symbol") return `${path}[Symbol(${prop2.description ?? ""})]`;
    if (regex_is_valid_identifier.test(prop2)) return `${path}.${prop2}`;
    return /^\d+$/.test(prop2) ? `${path}[${prop2}]` : `${path}['${prop2}']`;
  }
  function get_proxied_value(value) {
    try {
      if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
        return value[STATE_SYMBOL];
      }
    } catch {
    }
    return value;
  }
  function is(a, b) {
    return Object.is(get_proxied_value(a), get_proxied_value(b));
  }
  var ARRAY_MUTATING_METHODS = /* @__PURE__ */ new Set([
    "copyWithin",
    "fill",
    "pop",
    "push",
    "reverse",
    "shift",
    "sort",
    "splice",
    "unshift"
  ]);
  function inspectable_array(array) {
    return new Proxy(array, {
      get(target2, prop2, receiver) {
        var value = Reflect.get(target2, prop2, receiver);
        if (!ARRAY_MUTATING_METHODS.has(
          /** @type {string} */
          prop2
        )) {
          return value;
        }
        return function(...args) {
          set_eager_effects_deferred();
          var result = value.apply(this, args);
          flush_eager_effects();
          return result;
        };
      }
    });
  }

  // node_modules/svelte/src/internal/client/dev/equality.js
  function init_array_prototype_warnings() {
    const array_prototype2 = Array.prototype;
    const cleanup = Array.__svelte_cleanup;
    if (cleanup) {
      cleanup();
    }
    const { indexOf, lastIndexOf, includes: includes2 } = array_prototype2;
    array_prototype2.indexOf = function(item, from_index) {
      const index2 = indexOf.call(this, item, from_index);
      if (index2 === -1) {
        for (let i = from_index ?? 0; i < this.length; i += 1) {
          if (get_proxied_value(this[i]) === item) {
            state_proxy_equality_mismatch("array.indexOf(...)");
            break;
          }
        }
      }
      return index2;
    };
    array_prototype2.lastIndexOf = function(item, from_index) {
      const index2 = lastIndexOf.call(this, item, from_index ?? this.length - 1);
      if (index2 === -1) {
        for (let i = 0; i <= (from_index ?? this.length - 1); i += 1) {
          if (get_proxied_value(this[i]) === item) {
            state_proxy_equality_mismatch("array.lastIndexOf(...)");
            break;
          }
        }
      }
      return index2;
    };
    array_prototype2.includes = function(item, from_index) {
      const has = includes2.call(this, item, from_index);
      if (!has) {
        for (let i = 0; i < this.length; i += 1) {
          if (get_proxied_value(this[i]) === item) {
            state_proxy_equality_mismatch("array.includes(...)");
            break;
          }
        }
      }
      return has;
    };
    Array.__svelte_cleanup = () => {
      array_prototype2.indexOf = indexOf;
      array_prototype2.lastIndexOf = lastIndexOf;
      array_prototype2.includes = includes2;
    };
  }

  // node_modules/svelte/src/internal/client/dom/operations.js
  var $window;
  var $document;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    $document = document;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    if (is_extensible(element_prototype)) {
      element_prototype[CLASS_CACHE] = void 0;
      element_prototype[ATTRIBUTES_CACHE] = null;
      element_prototype[STYLE_CACHE] = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype[TEXT_CACHE] = void 0;
    }
    if (dev_fallback_default) {
      element_prototype.__svelte_meta = null;
      init_array_prototype_warnings();
    }
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return (
      /** @type {TemplateNode | null} */
      first_child_getter.call(node)
    );
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return (
      /** @type {TemplateNode | null} */
      next_sibling_getter.call(node)
    );
  }
  function child(node, is_text) {
    if (!hydrating) {
      return /* @__PURE__ */ get_first_child(node);
    }
    var child2 = /* @__PURE__ */ get_first_child(hydrate_node);
    if (child2 === null) {
      child2 = hydrate_node.appendChild(create_text());
    } else if (is_text && child2.nodeType !== TEXT_NODE) {
      var text2 = create_text();
      child2?.before(text2);
      set_hydrate_node(text2);
      return text2;
    }
    if (is_text) {
      merge_text_nodes(
        /** @type {Text} */
        child2
      );
    }
    set_hydrate_node(child2);
    return child2;
  }
  function first_child(node, is_text = false) {
    if (!hydrating) {
      var first = /* @__PURE__ */ get_first_child(node);
      if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
    if (is_text) {
      if (hydrate_node?.nodeType !== TEXT_NODE) {
        var text2 = create_text();
        hydrate_node?.before(text2);
        set_hydrate_node(text2);
        return text2;
      }
      merge_text_nodes(
        /** @type {Text} */
        hydrate_node
      );
    }
    return hydrate_node;
  }
  function only_child(node, is_text = false) {
    if (!hydrating) {
      return /* @__PURE__ */ get_first_child(node);
    }
    var first = child(node, is_text);
    reset(node);
    return first;
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = hydrating ? hydrate_node : node;
    var last_sibling;
    while (count--) {
      last_sibling = next_sibling;
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    if (!hydrating) {
      return next_sibling;
    }
    if (is_text) {
      if (next_sibling?.nodeType !== TEXT_NODE) {
        var text2 = create_text();
        if (next_sibling === null) {
          last_sibling?.after(text2);
        } else {
          next_sibling.before(text2);
        }
        set_hydrate_node(text2);
        return text2;
      }
      merge_text_nodes(
        /** @type {Text} */
        next_sibling
      );
    }
    set_hydrate_node(next_sibling);
    return next_sibling;
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function should_defer_append() {
    if (!async_mode_flag) return false;
    if (eager_block_effects !== null) return false;
    var flags2 = (
      /** @type {Effect} */
      active_effect.f
    );
    return (flags2 & REACTION_RAN) !== 0;
  }
  function create_element(tag2, namespace, is2) {
    if (namespace == null || namespace === NAMESPACE_HTML) {
      return (
        /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
        is2 ? document.createElement(tag2, { is: is2 }) : document.createElement(tag2)
      );
    }
    return (
      /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
      is2 ? document.createElementNS(namespace, tag2, { is: is2 }) : document.createElementNS(namespace, tag2)
    );
  }
  function merge_text_nodes(text2) {
    if (
      /** @type {string} */
      text2.nodeValue.length < 65536
    ) {
      return;
    }
    let next2 = text2.nextSibling;
    while (next2 !== null && next2.nodeType === TEXT_NODE) {
      next2.remove();
      text2.nodeValue += /** @type {string} */
      next2.nodeValue;
      next2 = text2.nextSibling;
    }
  }

  // node_modules/svelte/src/internal/client/error-handling.js
  var adjustments = /* @__PURE__ */ new WeakMap();
  function handle_error(error) {
    var effect2 = active_effect;
    if (effect2 === null) {
      active_reaction.f |= ERROR_VALUE;
      return error;
    }
    if (dev_fallback_default && error instanceof Error && !adjustments.has(error)) {
      adjustments.set(error, get_adjustments(error, effect2));
    }
    if ((effect2.f & REACTION_RAN) === 0 && (effect2.f & EFFECT) === 0) {
      if (dev_fallback_default && !effect2.parent && error instanceof Error) {
        apply_adjustments(error);
      }
      throw error;
    }
    invoke_error_boundary(error, effect2);
  }
  function invoke_error_boundary(error, effect2) {
    if (error === HYDRATION_ERROR) {
      throw error;
    }
    if (effect2 !== null && (effect2.f & DESTROYED) !== 0) {
      return;
    }
    while (effect2 !== null) {
      if ((effect2.f & BOUNDARY_EFFECT) !== 0 && (effect2.f & (DESTROYED | DESTROYING)) === 0) {
        if ((effect2.f & REACTION_RAN) === 0) {
          throw error;
        }
        try {
          effect2.b.error(error);
          return;
        } catch (e) {
          error = e;
        }
      }
      effect2 = effect2.parent;
    }
    if (dev_fallback_default && error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  function get_adjustments(error, effect2) {
    const message_descriptor = get_descriptor(error, "message");
    if (message_descriptor && !message_descriptor.configurable) return;
    var indent = is_firefox ? "  " : "	";
    var component_stack = `
${indent}in ${effect2.fn?.name || "<unknown>"}`;
    var context = effect2.ctx;
    while (context !== null) {
      component_stack += `
${indent}in ${context.function?.[FILENAME].split("/").pop()}`;
      context = context.p;
    }
    return {
      message: error.message + `
${component_stack}
`,
      stack: error.stack?.split("\n").filter((line) => !line.includes("svelte/src/internal")).join("\n")
    };
  }
  function apply_adjustments(error) {
    const adjusted = adjustments.get(error);
    if (adjusted) {
      define_property(error, "message", {
        value: adjusted.message
      });
      define_property(error, "stack", {
        value: adjusted.stack
      });
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/effects.js
  function validate_effect(rune) {
    if (active_effect === null) {
      if (active_reaction === null) {
        effect_orphan(rune);
      }
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown(rune);
    }
  }
  function push_effect(effect2, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect2;
    } else {
      parent_last.next = effect2;
      effect2.prev = parent_last;
      parent_effect.last = effect2;
    }
  }
  function create_effect(type, fn) {
    var parent = active_effect;
    if (dev_fallback_default) {
      while (parent !== null && (parent.f & EAGER_EFFECT) !== 0) {
        parent = parent.parent;
      }
    }
    if (parent !== null && (parent.f & INERT) !== 0) {
      type |= INERT;
    }
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes: null,
      f: type | DIRTY | CONNECTED,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      b: parent && parent.b,
      prev: null,
      teardown: null,
      wv: 0,
      ac: null
    };
    if (dev_fallback_default) {
      effect2.component_function = dev_current_component_function;
    }
    current_batch?.register_created_effect(effect2);
    var e = effect2;
    if ((type & EFFECT) !== 0) {
      if (collected_effects !== null) {
        collected_effects.push(effect2);
      } else {
        Batch.ensure().schedule(effect2);
      }
    } else if (fn !== null) {
      try {
        update_effect(effect2);
      } catch (e2) {
        destroy_effect(effect2);
        throw e2;
      }
      if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && // either `null`, or a singular child
      (e.f & EFFECT_PRESERVED) === 0) {
        e = e.first;
        if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
          e.f |= EFFECT_TRANSPARENT;
        }
      }
    }
    if (e !== null) {
      e.parent = parent;
      if (parent !== null) {
        push_effect(e, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.effects ??= []).push(e);
      }
    }
    return effect2;
  }
  function effect_tracking() {
    return active_reaction !== null && !untracking;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect("$effect");
    if (dev_fallback_default) {
      define_property(fn, "name", {
        value: "$effect"
      });
    }
    var flags2 = (
      /** @type {Effect} */
      active_effect.f
    );
    var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && component_context !== null && !component_context.i;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ??= []).push(fn);
    } else {
      return create_user_effect(fn);
    }
  }
  function create_user_effect(fn) {
    return create_effect(EFFECT | USER_EFFECT, fn);
  }
  function effect_root(fn) {
    Batch.ensure();
    const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
    return () => {
      destroy_effect(effect2);
    };
  }
  function component_root(fn) {
    Batch.ensure();
    const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect2, () => {
            destroy_effect(effect2);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect2);
          fulfil(void 0);
        }
      });
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn);
  }
  function async_effect(fn) {
    return create_effect(ASYNC | EFFECT_PRESERVED, fn);
  }
  function render_effect(fn, flags2 = 0) {
    return create_effect(RENDER_EFFECT | flags2, fn);
  }
  function template_effect(fn, sync = [], async2 = [], blockers = []) {
    flatten(blockers, sync, async2, (values) => {
      create_effect(RENDER_EFFECT, () => {
        fn(...values.map(get));
      });
    });
  }
  function block(fn, flags2 = 0) {
    var effect2 = create_effect(BLOCK_EFFECT | flags2, fn);
    if (dev_fallback_default) {
      effect2.dev_stack = dev_stack;
    }
    return effect2;
  }
  function branch(fn) {
    return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn);
  }
  function execute_effect_teardown(effect2) {
    var teardown2 = effect2.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown2.call(null);
      } catch (error) {
        invoke_error_boundary(error, effect2.parent);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      const controller = effect2.ac;
      if (controller !== null) {
        without_reactive_context(() => {
          controller.abort(STALE_REACTION);
        });
      }
      var next2 = effect2.next;
      if ((effect2.f & ROOT_EFFECT) !== 0) {
        effect2.parent = null;
      } else {
        destroy_effect(effect2, remove_dom);
      }
      effect2 = next2;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next2 = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next2;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
      remove_effect_dom(
        effect2.nodes.start,
        /** @type {TemplateNode} */
        effect2.nodes.end
      );
      removed = true;
    }
    effect2.f |= DESTROYING;
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    var transitions = effect2.nodes && effect2.nodes.t;
    if (transitions !== null) {
      for (const transition2 of transitions) {
        transition2.stop();
      }
    }
    execute_effect_teardown(effect2);
    effect2.f ^= DESTROYING;
    effect2.f |= DESTROYED;
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    if (dev_fallback_default) {
      effect2.component_function = null;
    }
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = effect2.b = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next2 = node === end ? null : get_next_sibling(node);
      node.remove();
      node = next2;
    }
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next2 = effect2.next;
    if (prev !== null) prev.next = next2;
    if (next2 !== null) next2.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next2;
      if (parent.last === effect2) parent.last = prev;
    }
  }
  function pause_effect(effect2, callback, destroy = true) {
    var transitions = [];
    effect2.f |= PAUSED;
    pause_children(effect2, transitions, true);
    var fn = () => {
      if (destroy) destroy_effect(effect2);
      if (callback) callback();
    };
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition2 of transitions) {
        transition2.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    var t = effect2.nodes && effect2.nodes.t;
    if (t !== null) {
      for (const transition2 of t) {
        if (transition2.is_global || local) {
          transitions.push(transition2);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      if ((child2.f & ROOT_EFFECT) === 0) {
        var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
        pause_children(child2, transitions, transparent ? local : false);
      }
      child2 = sibling2;
    }
  }
  function resume_effect(effect2) {
    effect2.f &= ~PAUSED;
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & PAUSED) !== 0) return;
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if ((effect2.f & CLEAN) === 0) {
      set_signal_status(effect2, DIRTY);
      Batch.ensure().schedule(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    var t = effect2.nodes && effect2.nodes.t;
    if (t !== null) {
      for (const transition2 of t) {
        if (transition2.is_global || local) {
          transition2.in();
        }
      }
    }
  }
  function move_effect(effect2, fragment) {
    if (!effect2.nodes) return;
    var node = effect2.nodes.start;
    var end = effect2.nodes.end;
    while (node !== null) {
      var next2 = node === end ? null : get_next_sibling(node);
      fragment.append(node);
      node = next2;
    }
  }

  // node_modules/svelte/src/internal/client/legacy.js
  var captured_signals = null;

  // node_modules/svelte/src/internal/client/runtime.js
  var is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  var active_reaction = null;
  var untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  var active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  var current_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && (!async_mode_flag && (active_reaction.f & REACTION_IS_UPDATING) !== 0 || (active_reaction.f & DERIVED) !== 0)) {
      (current_sources ??= /* @__PURE__ */ new Set()).add(value);
    }
  }
  var new_deps = null;
  var skipped_deps = 0;
  var untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  var write_version = 1;
  var read_version = 0;
  var update_version = read_version;
  function set_update_version(value) {
    update_version = value;
  }
  function increment_write_version() {
    return ++write_version;
  }
  function is_dirty(reaction) {
    var flags2 = reaction.f;
    if ((flags2 & DIRTY) !== 0) {
      return true;
    }
    if ((flags2 & MAYBE_DIRTY) !== 0) {
      var dependencies = (
        /** @type {Value[]} */
        reaction.deps
      );
      var length = dependencies.length;
      for (var i = 0; i < length; i++) {
        var dependency = dependencies[i];
        if (is_dirty(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (dependency.wv > reaction.wv) {
          return true;
        }
      }
      if ((flags2 & CONNECTED) !== 0 && // During time traveling we don't want to reset the status so that
      // traversal of the graph in the other batches still happens
      batch_values === null) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function schedule_possible_effect_self_invalidation(signal, effect2, root8 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    if (!async_mode_flag && current_sources !== null && current_sources.has(signal)) {
      return;
    }
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false
        );
      } else if (effect2 === reaction) {
        if (root8) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_sources = current_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var previous_update_version = update_version;
    var flags2 = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    current_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    update_version = ++read_version;
    if (reaction.ac !== null) {
      without_reactive_context(() => {
        reaction.ac.abort(STALE_REACTION);
      });
      reaction.ac = null;
    }
    try {
      reaction.f |= REACTION_IS_UPDATING;
      var fn = (
        /** @type {Function} */
        reaction.fn
      );
      var result = fn();
      reaction.f |= REACTION_RAN;
      var deps = update_dependencies(reaction);
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (var i = 0; i < /** @type {Source[]} */
        untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (previous_reaction.deps !== null) {
          for (let i2 = 0; i2 < previous_skipped_deps; i2 += 1) {
            previous_reaction.deps[i2].rv = read_version;
          }
        }
        if (previous_deps !== null) {
          for (const dep of previous_deps) {
            dep.rv = read_version;
          }
        }
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(.../** @type {Source[]} */
            untracked_writes);
          }
        }
      }
      if ((reaction.f & ERROR_VALUE) !== 0) {
        reaction.f ^= ERROR_VALUE;
      }
      return result;
    } catch (error) {
      update_dependencies(reaction);
      return handle_error(error);
    } finally {
      reaction.f ^= REACTION_IS_UPDATING;
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      current_sources = previous_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      update_version = previous_update_version;
    }
  }
  function update_dependencies(reaction) {
    var deps = reaction.deps;
    var is_fork = current_batch?.is_fork;
    if (new_deps !== null) {
      var i;
      if (!is_fork) {
        remove_reactions(reaction, skipped_deps);
      }
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
        for (i = skipped_deps; i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    return deps;
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index2 = index_of.call(reactions, signal);
      if (index2 !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index2] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !includes.call(new_deps, dependency))) {
      var derived2 = (
        /** @type {Derived} */
        dependency
      );
      if ((derived2.f & CONNECTED) !== 0) {
        derived2.f ^= CONNECTED;
      }
      if (derived2.v !== UNINITIALIZED) {
        update_derived_status(derived2);
      }
      if (derived2.ac !== null) {
        without_reactive_context(() => {
          derived2.ac.abort(STALE_REACTION);
          derived2.ac = null;
          set_signal_status(derived2, DIRTY);
        });
      }
      freeze_derived_effects(derived2);
      remove_reactions(derived2, 0);
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i = start_index; i < dependencies.length; i++) {
      remove_reaction(signal, dependencies[i]);
    }
  }
  function update_effect(effect2) {
    var flags2 = effect2.f;
    if ((flags2 & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    active_effect = effect2;
    if (dev_fallback_default) {
      var previous_component_fn = dev_current_component_function;
      set_dev_current_component_function(effect2.component_function);
      var previous_stack = (
        /** @type {any} */
        dev_stack
      );
      set_dev_stack(effect2.dev_stack ?? dev_stack);
    }
    try {
      if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect2.wv = write_version;
      if (dev_fallback_default && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) {
        for (var dep of effect2.deps) {
          if (dep.set_during_effect) {
            dep.wv = increment_write_version();
            dep.set_during_effect = false;
          }
        }
      }
    } finally {
      active_effect = previous_effect;
      if (dev_fallback_default) {
        set_dev_current_component_function(previous_component_fn);
        set_dev_stack(previous_stack);
      }
    }
  }
  async function tick() {
    if (async_mode_flag) {
      return new Promise((f) => {
        requestAnimationFrame(() => f());
        setTimeout(() => f());
      });
    }
    await Promise.resolve();
    flushSync();
  }
  function get(signal) {
    var flags2 = signal.f;
    var is_derived = (flags2 & DERIVED) !== 0;
    captured_signals?.add(signal);
    if (active_reaction !== null && !untracking) {
      var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
      if (!destroyed && (current_sources === null || !current_sources.has(signal))) {
        var deps = active_reaction.deps;
        if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
          if (signal.rv < read_version) {
            signal.rv = read_version;
            if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
              skipped_deps++;
            } else if (new_deps === null) {
              new_deps = [signal];
            } else {
              new_deps.push(signal);
            }
          }
        } else {
          active_reaction.deps ??= [];
          if (!includes.call(active_reaction.deps, signal)) {
            active_reaction.deps.push(signal);
          }
          var reactions = signal.reactions;
          if (reactions === null) {
            signal.reactions = [active_reaction];
          } else if (!includes.call(reactions, active_reaction)) {
            reactions.push(active_reaction);
          }
        }
      }
    }
    if (dev_fallback_default) {
      if (!untracking && reactivity_loss_tracker && // By checking that current/previous batch are null we filter out false positives.
      // reactivity_loss_tracker is only reset after a microtask, so if a flush happens
      // before that, we get warnings for things we shouldn't warn on.
      current_batch === null && previous_batch === null && !reactivity_loss_tracker.warned && (reactivity_loss_tracker.effect.f & REACTION_IS_UPDATING) === 0 && !reactivity_loss_tracker.effect_deps.has(signal)) {
        reactivity_loss_tracker.warned = true;
        await_reactivity_loss(
          /** @type {string} */
          signal.label
        );
        var trace2 = get_error("traced at");
        if (trace2) console.warn(trace2);
      }
      recent_async_deriveds.delete(signal);
      if (tracing_mode_flag && !untracking && tracing_expressions !== null && active_reaction !== null && tracing_expressions.reaction === active_reaction) {
        if (signal.trace) {
          signal.trace();
        } else {
          trace2 = get_error("traced at");
          if (trace2) {
            var entry = tracing_expressions.entries.get(signal);
            if (entry === void 0) {
              entry = { traces: [] };
              tracing_expressions.entries.set(signal, entry);
            }
            var last = entry.traces[entry.traces.length - 1];
            if (trace2.stack !== last?.stack) {
              entry.traces.push(trace2);
            }
          }
        }
      }
    }
    if (is_destroying_effect && old_values.has(signal)) {
      return old_values.get(signal);
    }
    if (is_derived) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      if (is_destroying_effect) {
        var value = derived2.v;
        if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
          value = execute_derived(derived2);
        }
        old_values.set(derived2, value);
        return value;
      }
      var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (active_reaction.f & CONNECTED) !== 0;
      var is_new = (derived2.f & REACTION_RAN) === 0;
      if (is_dirty(derived2)) {
        if (should_connect) {
          derived2.f |= CONNECTED;
        }
        update_derived(derived2);
      }
      if (should_connect && !is_new) {
        unfreeze_derived_effects(derived2);
        reconnect(derived2);
      }
    }
    if (batch_values?.has(signal)) {
      return batch_values.get(signal);
    }
    if ((signal.f & ERROR_VALUE) !== 0) {
      throw signal.v;
    }
    return signal.v;
  }
  function reconnect(derived2) {
    derived2.f |= CONNECTED;
    if (derived2.deps === null) return;
    for (const dep of derived2.deps) {
      var reactions = dep.reactions;
      if (reactions === null) {
        dep.reactions = [derived2];
      } else if (!includes.call(reactions, derived2)) {
        reactions.push(derived2);
      }
      if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
        unfreeze_derived_effects(
          /** @type {Derived} */
          dep
        );
        reconnect(
          /** @type {Derived} */
          dep
        );
      }
    }
  }
  function depends_on_old_values(derived2) {
    if (derived2.v === UNINITIALIZED) return true;
    if (derived2.deps === null) return false;
    for (const dep of derived2.deps) {
      if (old_values.has(dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
        /** @type {Derived} */
        dep
      )) {
        return true;
      }
    }
    return false;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }

  // node_modules/svelte/src/utils.js
  var DOM_BOOLEAN_ATTRIBUTES = [
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "disabled",
    "formnovalidate",
    "indeterminate",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "seamless",
    "selected",
    "webkitdirectory",
    "defer",
    "disablepictureinpicture",
    "disableremoteplayback"
  ];
  var DOM_PROPERTIES = [
    ...DOM_BOOLEAN_ATTRIBUTES,
    "formNoValidate",
    "isMap",
    "noModule",
    "playsInline",
    "readOnly",
    "value",
    "volume",
    "defaultValue",
    "defaultChecked",
    "srcObject",
    "noValidate",
    "allowFullscreen",
    "disablePictureInPicture",
    "disableRemotePlayback"
  ];
  var PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  var STATE_CREATION_RUNES = (
    /** @type {const} */
    [
      "$state",
      "$state.raw",
      "$derived",
      "$derived.by"
    ]
  );
  var RUNES = (
    /** @type {const} */
    [
      ...STATE_CREATION_RUNES,
      "$state.eager",
      "$state.snapshot",
      "$props",
      "$props.id",
      "$bindable",
      "$effect",
      "$effect.pre",
      "$effect.tracking",
      "$effect.root",
      "$effect.pending",
      "$inspect",
      "$inspect().with",
      "$inspect.trace",
      "$host"
    ]
  );

  // node_modules/svelte/src/internal/client/dom/elements/events.js
  var event_symbol = Symbol("events");
  var all_registered_events = /* @__PURE__ */ new Set();
  var root_event_handles = /* @__PURE__ */ new Set();
  function create_event(event_name, dom, handler, options = {}) {
    function target_handler(event2) {
      if (!options.capture) {
        handle_event_propagation.call(dom, event2);
      }
      if (!event2.cancelBubble) {
        return without_reactive_context(() => {
          return handler?.call(this, event2);
        });
      }
    }
    if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
      target_handler.__removed = false;
      queue_micro_task(() => {
        if (!target_handler.__removed) {
          dom.addEventListener(event_name, target_handler, options);
        }
      });
    } else {
      dom.addEventListener(event_name, target_handler, options);
    }
    return target_handler;
  }
  function event(event_name, dom, handler, capture2, passive2) {
    var options = { capture: capture2, passive: passive2 };
    var target_handler = create_event(event_name, dom, handler, options);
    if (dom === document.body || // @ts-ignore
    dom === window || // @ts-ignore
    dom === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
    dom instanceof HTMLMediaElement) {
      teardown(() => {
        target_handler.__removed = true;
        dom.removeEventListener(event_name, target_handler, options);
      });
    }
  }
  function delegated(event_name, element2, handler) {
    (element2[event_symbol] ??= {})[event_name] = handler;
  }
  function delegate(events) {
    for (var i = 0; i < events.length; i++) {
      all_registered_events.add(events[i]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  var last_propagated_event = null;
  var last_propagated_event_clear_scheduled = false;
  function handle_event_propagation(event2) {
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event2.type;
    var path = event2.composedPath?.() || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event2.target
    );
    last_propagated_event = event2;
    if (!last_propagated_event_clear_scheduled) {
      last_propagated_event_clear_scheduled = true;
      setTimeout(() => {
        last_propagated_event_clear_scheduled = false;
        last_propagated_event = null;
      });
    }
    var path_idx = 0;
    var handled_at = last_propagated_event === event2 && event2[event_symbol];
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event2[event_symbol] = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */
    path[path_idx] || event2.target;
    if (current_target === handler_element) return;
    define_property(event2, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        if (current_target === handler_element) break;
        try {
          var delegated2 = current_target[event_symbol]?.[event_name];
          if (delegated2 != null && (!/** @type {any} */
          current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          event2.target === current_target)) {
            delegated2.call(current_target, event2);
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event2.cancelBubble) break;
        path_idx++;
        current_target = path_idx < path.length ? (
          /** @type {Element} */
          path[path_idx]
        ) : null;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event2[event_symbol] = handler_element;
      delete event2.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }

  // node_modules/svelte/src/internal/client/dom/reconciler.js
  var policy = (
    // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
    globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
      /** @param {string} html */
      createHTML: (html2) => {
        return html2;
      }
    })
  );
  function create_trusted_html(html2) {
    return (
      /** @type {string} */
      policy?.createHTML(html2) ?? html2
    );
  }
  function create_fragment_from_html(html2) {
    var elem = create_element("template");
    elem.innerHTML = create_trusted_html(html2.replaceAll("<!>", "<!---->"));
    return elem.content;
  }

  // node_modules/svelte/src/internal/client/dom/template.js
  function assign_nodes(start, end) {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (effect2.nodes === null) {
      effect2.nodes = { start, end, a: null, t: null };
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags2) {
    var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (hydrating) {
        assign_nodes(hydrate_node, null);
        return hydrate_node;
      }
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node = /** @type {TemplateNode} */
        get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (
          /** @type {TemplateNode} */
          get_first_child(clone)
        );
        var end = (
          /** @type {TemplateNode} */
          clone.lastChild
        );
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_namespace(content, flags2, ns = "svg") {
    var has_start = !content.startsWith("<!>");
    var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
    var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
    var node;
    return () => {
      if (hydrating) {
        assign_nodes(hydrate_node, null);
        return hydrate_node;
      }
      if (!node) {
        var fragment = (
          /** @type {DocumentFragment} */
          create_fragment_from_html(wrapped)
        );
        var root8 = (
          /** @type {Element} */
          get_first_child(fragment)
        );
        if (is_fragment) {
          node = document.createDocumentFragment();
          while (get_first_child(root8)) {
            node.appendChild(
              /** @type {TemplateNode} */
              get_first_child(root8)
            );
          }
        } else {
          node = /** @type {Element} */
          get_first_child(root8);
        }
      }
      var clone = (
        /** @type {TemplateNode} */
        node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (
          /** @type {TemplateNode} */
          get_first_child(clone)
        );
        var end = (
          /** @type {TemplateNode} */
          clone.lastChild
        );
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_svg(content, flags2) {
    return /* @__PURE__ */ from_namespace(content, flags2, "svg");
  }
  function text(value = "") {
    if (!hydrating) {
      var t = create_text(value + "");
      assign_nodes(t, t);
      return t;
    }
    var node = hydrate_node;
    if (node.nodeType !== TEXT_NODE) {
      node.before(node = create_text());
      set_hydrate_node(node);
    } else {
      merge_text_nodes(
        /** @type {Text} */
        node
      );
    }
    assign_nodes(node, node);
    return node;
  }
  function comment() {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
    var anchor = create_text();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (hydrating) {
      var effect2 = (
        /** @type {Effect & { nodes: EffectNodes }} */
        active_effect
      );
      if ((effect2.f & REACTION_RAN) === 0 || effect2.nodes.end === null) {
        effect2.nodes.end = hydrate_node;
      }
      hydrate_next();
      return;
    }
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }

  // node_modules/svelte/src/reactivity/create-subscriber.js
  function createSubscriber(start) {
    let subscribers = 0;
    let version = source(0);
    let stop;
    if (dev_fallback_default) {
      tag(version, "createSubscriber version");
    }
    return () => {
      if (effect_tracking()) {
        get(version);
        render_effect(() => {
          if (subscribers === 0) {
            stop = untrack(() => start(() => increment(version)));
          }
          subscribers += 1;
          return () => {
            queue_micro_task(() => {
              subscribers -= 1;
              if (subscribers === 0) {
                stop?.();
                stop = void 0;
                increment(version);
              }
            });
          };
        });
      }
    };
  }

  // node_modules/svelte/src/internal/client/dom/blocks/boundary.js
  var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
  function boundary(node, props, children, transform_error) {
    new Boundary(node, props, children, transform_error);
  }
  var Boundary = class {
    /** @type {Boundary | null} */
    parent;
    is_pending = false;
    /**
     * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
     * Inherited from parent boundary, or defaults to identity.
     * @type {(error: unknown) => unknown}
     */
    transform_error;
    /** @type {TemplateNode} */
    #anchor;
    /** @type {TemplateNode | null} */
    #hydrate_open = hydrating ? hydrate_node : null;
    /** @type {BoundaryProps} */
    #props;
    /** @type {((anchor: Node) => void)} */
    #children;
    /** @type {Effect} */
    #effect;
    /** @type {Effect | null} */
    #main_effect = null;
    /** @type {Effect | null} */
    #pending_effect = null;
    /** @type {Effect | null} */
    #failed_effect = null;
    /** @type {DocumentFragment | null} */
    #offscreen_fragment = null;
    #local_pending_count = 0;
    #pending_count = 0;
    #pending_count_update_queued = false;
    /** @type {Map<Effect, number>} */
    #dirty_reactions = /* @__PURE__ */ new Map();
    /**
     * A source containing the number of pending async deriveds/expressions.
     * Only created if `$effect.pending()` is used inside the boundary,
     * otherwise updating the source results in needless `Batch.ensure()`
     * calls followed by no-op flushes
     * @type {Source<number> | null}
     */
    #effect_pending = null;
    #effect_pending_subscriber = createSubscriber(() => {
      this.#effect_pending = source(this.#local_pending_count);
      if (dev_fallback_default) {
        tag(this.#effect_pending, "$effect.pending()");
      }
      return () => {
        this.#effect_pending = null;
      };
    });
    /**
     * @param {TemplateNode} node
     * @param {BoundaryProps} props
     * @param {((anchor: Node) => void)} children
     * @param {((error: unknown) => unknown) | undefined} [transform_error]
     */
    constructor(node, props, children, transform_error) {
      this.#anchor = node;
      this.#props = props;
      this.#children = (anchor) => {
        var effect2 = (
          /** @type {Effect} */
          active_effect
        );
        effect2.b = this;
        effect2.f |= BOUNDARY_EFFECT;
        children(anchor);
      };
      this.parent = /** @type {Effect} */
      active_effect.b;
      this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
      this.#effect = block(() => {
        if (hydrating) {
          const comment_data = read_hydration_instruction(
            /** @type {TemplateNode} */
            this.#hydrate_open
          );
          hydrate_next();
          const server_rendered_pending = comment_data === HYDRATION_START_ELSE;
          const server_rendered_failed = comment_data.startsWith(HYDRATION_START_FAILED);
          if (server_rendered_failed) {
            const serialized_error = JSON.parse(comment_data.slice(HYDRATION_START_FAILED.length));
            this.#hydrate_failed_content(serialized_error);
          } else if (server_rendered_pending) {
            this.#hydrate_pending_content();
          } else {
            this.#hydrate_resolved_content();
          }
        } else {
          this.#render();
        }
      }, flags);
      if (hydrating) {
        this.#anchor = hydrate_node;
      }
    }
    #hydrate_resolved_content() {
      try {
        this.#main_effect = branch(() => this.#children(this.#anchor));
      } catch (error) {
        this.error(error);
      }
    }
    /**
     * @param {unknown} error The deserialized error from the server's hydration comment
     */
    #hydrate_failed_content(error) {
      const failed = this.#props.failed;
      const { reset: reset2, invoke_onerror } = this.#create_reset(error);
      queue_micro_task(invoke_onerror);
      if (!failed) return;
      this.#failed_effect = branch(() => {
        failed(
          this.#anchor,
          () => error,
          () => reset2
        );
      });
    }
    /**
     * Creates the `reset` function for a failed boundary, along with a function
     * that invokes `onerror` with it (if provided)
     * @param {unknown} error
     * @returns {{ reset: () => void, invoke_onerror: () => void }}
     */
    #create_reset(error) {
      var did_reset = false;
      var calling_on_error = false;
      const reset2 = () => {
        if (this.#is_destroyed()) return;
        if (did_reset) {
          svelte_boundary_reset_noop();
          return;
        }
        did_reset = true;
        if (calling_on_error) {
          svelte_boundary_reset_onerror();
        }
        if (this.#failed_effect !== null) {
          pause_effect(this.#failed_effect, () => {
            this.#failed_effect = null;
          });
        }
        this.#run(() => {
          this.#render();
        });
      };
      const invoke_onerror = () => {
        if (this.#is_destroyed()) return;
        try {
          calling_on_error = true;
          this.#props.onerror?.(error, reset2);
          calling_on_error = false;
        } catch (err) {
          invoke_error_boundary(err, this.#effect && this.#effect.parent);
        }
      };
      return { reset: reset2, invoke_onerror };
    }
    #is_destroyed() {
      return (this.#effect.f & (DESTROYED | DESTROYING)) !== 0;
    }
    #hydrate_pending_content() {
      const pending2 = this.#props.pending;
      if (!pending2) return;
      this.is_pending = true;
      this.#pending_effect = branch(() => pending2(this.#anchor));
      queue_micro_task(() => {
        if (this.#is_destroyed()) return;
        var fragment = this.#offscreen_fragment = document.createDocumentFragment();
        var anchor = create_text();
        var handled = false;
        fragment.append(anchor);
        this.#main_effect = this.#run(() => {
          try {
            return branch(() => this.#children(anchor));
          } catch (error) {
            try {
              this.error(error);
              handled = true;
            } catch (error2) {
              invoke_error_boundary(error2, this.#effect.parent);
            }
            return null;
          }
        });
        if (this.#main_effect === null) {
          this.#offscreen_fragment = null;
          if (handled) this.#resolve(
            /** @type {Batch} */
            current_batch
          );
          return;
        }
        if (this.#pending_count === 0) {
          this.#anchor.before(fragment);
          this.#offscreen_fragment = null;
          pause_effect(
            /** @type {Effect} */
            this.#pending_effect,
            () => {
              this.#pending_effect = null;
            }
          );
          this.#resolve(
            /** @type {Batch} */
            current_batch
          );
        }
      });
    }
    #render() {
      try {
        this.is_pending = this.has_pending_snippet();
        this.#pending_count = 0;
        this.#local_pending_count = 0;
        this.#main_effect = branch(() => {
          this.#children(this.#anchor);
        });
        if (this.#pending_count > 0) {
          var fragment = this.#offscreen_fragment = document.createDocumentFragment();
          move_effect(this.#main_effect, fragment);
          const pending2 = (
            /** @type {(anchor: Node) => void} */
            this.#props.pending
          );
          this.#pending_effect = branch(() => pending2(this.#anchor));
        } else {
          this.#resolve(
            /** @type {Batch} */
            current_batch
          );
        }
      } catch (error) {
        this.error(error);
      }
    }
    /**
     * @param {Batch} batch
     */
    #resolve(batch) {
      this.is_pending = false;
      batch.transfer_reactions(this.#dirty_reactions);
    }
    /**
     * Defer an effect inside a pending boundary until the boundary resolves
     * @param {Effect} effect
     */
    defer_effect(effect2) {
      defer_effect(effect2, this.#dirty_reactions);
    }
    /**
     * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
     * @returns {boolean}
     */
    is_rendered() {
      return !this.is_pending && (!this.parent || this.parent.is_rendered());
    }
    has_pending_snippet() {
      return !!this.#props.pending;
    }
    /**
     * @template T
     * @param {() => T} fn
     */
    #run(fn) {
      var previous_effect = active_effect;
      var previous_reaction = active_reaction;
      var previous_ctx = component_context;
      set_active_effect(this.#effect);
      set_active_reaction(this.#effect);
      set_component_context(this.#effect.ctx);
      try {
        Batch.ensure();
        return fn();
      } finally {
        set_active_effect(previous_effect);
        set_active_reaction(previous_reaction);
        set_component_context(previous_ctx);
      }
    }
    /**
     * Updates the pending count associated with the currently visible pending snippet,
     * if any, such that we can replace the snippet with content once work is done
     * @param {1 | -1} d
     * @param {Batch} batch
     */
    #update_pending_count(d, batch) {
      if (!this.has_pending_snippet()) {
        if (this.parent) {
          this.parent.#update_pending_count(d, batch);
        }
        return;
      }
      this.#pending_count += d;
      if (this.#pending_count === 0) {
        this.#resolve(batch);
        if (this.#pending_effect) {
          pause_effect(this.#pending_effect, () => {
            this.#pending_effect = null;
          });
        }
        if (this.#offscreen_fragment) {
          this.#anchor.before(this.#offscreen_fragment);
          this.#offscreen_fragment = null;
        }
      }
    }
    /**
     * Update the source that powers `$effect.pending()` inside this boundary,
     * and controls when the current `pending` snippet (if any) is removed.
     * Do not call from inside the class
     * @param {1 | -1} d
     * @param {Batch} batch
     */
    update_pending_count(d, batch) {
      this.#update_pending_count(d, batch);
      this.#local_pending_count += d;
      if (!this.#effect_pending || this.#pending_count_update_queued) return;
      this.#pending_count_update_queued = true;
      queue_micro_task(() => {
        this.#pending_count_update_queued = false;
        if (this.#effect_pending) {
          internal_set(this.#effect_pending, this.#local_pending_count);
        }
      });
    }
    get_effect_pending() {
      this.#effect_pending_subscriber();
      return get(
        /** @type {Source<number>} */
        this.#effect_pending
      );
    }
    /** @param {unknown} error */
    error(error) {
      if (error === HYDRATION_ERROR) {
        throw error;
      }
      if (!this.#props.onerror && !this.#props.failed) {
        throw error;
      }
      if (current_batch?.is_fork) {
        if (this.#main_effect) current_batch.skip_effect(this.#main_effect);
        if (this.#pending_effect) current_batch.skip_effect(this.#pending_effect);
        if (this.#failed_effect) current_batch.skip_effect(this.#failed_effect);
        current_batch.oncommit(() => {
          if (!this.#is_destroyed()) this.#handle_error(error);
        });
      } else {
        this.#handle_error(error);
      }
    }
    /**
     * @param {unknown} error
     */
    #handle_error(error) {
      if (this.#main_effect) {
        destroy_effect(this.#main_effect);
        this.#main_effect = null;
      }
      if (this.#pending_effect) {
        destroy_effect(this.#pending_effect);
        this.#pending_effect = null;
      }
      if (this.#failed_effect) {
        destroy_effect(this.#failed_effect);
        this.#failed_effect = null;
      }
      if (hydrating) {
        set_hydrate_node(
          /** @type {TemplateNode} */
          this.#hydrate_open
        );
        next();
        set_hydrate_node(skip_nodes());
      }
      let failed = this.#props.failed;
      const handle_error_result = (transformed_error) => {
        if (this.#is_destroyed()) return;
        const { reset: reset2, invoke_onerror } = this.#create_reset(transformed_error);
        invoke_onerror();
        if (failed && !this.#is_destroyed()) {
          this.#failed_effect = this.#run(() => {
            try {
              return branch(() => {
                var effect2 = (
                  /** @type {Effect} */
                  active_effect
                );
                effect2.b = this;
                effect2.f |= BOUNDARY_EFFECT;
                failed(
                  this.#anchor,
                  () => transformed_error,
                  () => reset2
                );
              });
            } catch (error2) {
              invoke_error_boundary(
                error2,
                /** @type {Effect} */
                this.#effect.parent
              );
              return null;
            }
          });
        }
      };
      queue_micro_task(() => {
        if (this.#is_destroyed()) return;
        var result;
        try {
          result = this.transform_error(error);
        } catch (e) {
          invoke_error_boundary(e, this.#effect && this.#effect.parent);
          return;
        }
        if (result !== null && typeof result === "object" && typeof /** @type {any} */
        result.then === "function") {
          result.then(
            handle_error_result,
            /** @param {unknown} e */
            (e) => invoke_error_boundary(e, this.#effect && this.#effect.parent)
          );
        } else {
          handle_error_result(result);
        }
      });
    }
  };

  // node_modules/svelte/src/internal/client/render.js
  var should_intro = true;
  function set_text(text2, value) {
    var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
    if (str !== /** @type {any} */
    (text2[TEXT_CACHE] ??= text2.nodeValue)) {
      text2[TEXT_CACHE] = str;
      text2.nodeValue = `${str}`;
    }
  }
  function mount(component2, options) {
    return _mount(component2, options);
  }
  function hydrate(component2, options) {
    init_operations();
    options.intro = options.intro ?? false;
    const target2 = options.target;
    const was_hydrating = hydrating;
    const previous_hydrate_node = hydrate_node;
    try {
      var anchor = get_first_child(target2);
      while (anchor && (anchor.nodeType !== COMMENT_NODE || /** @type {Comment} */
      anchor.data !== HYDRATION_START)) {
        anchor = get_next_sibling(anchor);
      }
      if (!anchor) {
        throw HYDRATION_ERROR;
      }
      set_hydrating(true);
      set_hydrate_node(
        /** @type {Comment} */
        anchor
      );
      const instance = _mount(component2, { ...options, anchor });
      set_hydrating(false);
      return (
        /**  @type {Exports} */
        instance
      );
    } catch (error) {
      if (error instanceof Error && error.message.split("\n").some((line) => line.startsWith("https://svelte.dev/e/"))) {
        throw error;
      }
      if (error !== HYDRATION_ERROR) {
        console.warn("Failed to hydrate: ", error);
      }
      if (options.recover === false) {
        hydration_failed();
      }
      init_operations();
      clear_text_content(target2);
      set_hydrating(false);
      return mount(component2, options);
    } finally {
      set_hydrating(was_hydrating);
      set_hydrate_node(previous_hydrate_node);
    }
  }
  var listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target: target2, anchor, props = {}, events, context, intro = true, transformError }) {
    init_operations();
    var component2 = void 0;
    var unmount2 = component_root(() => {
      var anchor_node = anchor ?? target2.appendChild(create_text());
      boundary(
        /** @type {TemplateNode} */
        anchor_node,
        {
          pending: () => {
          }
        },
        (anchor_node2) => {
          push({});
          var ctx = (
            /** @type {ComponentContext} */
            component_context
          );
          if (context) ctx.c = context;
          if (events) {
            props.$$events = events;
          }
          if (hydrating) {
            assign_nodes(
              /** @type {TemplateNode} */
              anchor_node2,
              null
            );
          }
          should_intro = intro;
          component2 = Component(anchor_node2, props) || mark_as_component();
          should_intro = true;
          if (hydrating) {
            active_effect.nodes.end = hydrate_node;
            if (hydrate_node === null || hydrate_node.nodeType !== COMMENT_NODE || /** @type {Comment} */
            hydrate_node.data !== HYDRATION_END) {
              hydration_mismatch();
              throw HYDRATION_ERROR;
            }
          }
          pop();
        },
        transformError
      );
      var registered_events = /* @__PURE__ */ new Set();
      var event_handle = (events2) => {
        for (var i = 0; i < events2.length; i++) {
          var event_name = events2[i];
          if (registered_events.has(event_name)) continue;
          registered_events.add(event_name);
          var passive2 = is_passive_event(event_name);
          for (const node of [target2, document]) {
            var counts = listeners.get(node);
            if (counts === void 0) {
              counts = /* @__PURE__ */ new Map();
              listeners.set(node, counts);
            }
            var count = counts.get(event_name);
            if (count === void 0) {
              node.addEventListener(event_name, handle_event_propagation, { passive: passive2 });
              counts.set(event_name, 1);
            } else {
              counts.set(event_name, count + 1);
            }
          }
        }
      };
      event_handle(array_from(all_registered_events));
      root_event_handles.add(event_handle);
      return () => {
        for (var event_name of registered_events) {
          for (const node of [target2, document]) {
            var counts = (
              /** @type {Map<string, number>} */
              listeners.get(node)
            );
            var count = (
              /** @type {number} */
              counts.get(event_name)
            );
            if (--count == 0) {
              node.removeEventListener(event_name, handle_event_propagation);
              counts.delete(event_name);
              if (counts.size === 0) {
                listeners.delete(node);
              }
            } else {
              counts.set(event_name, count);
            }
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          anchor_node.parentNode?.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component2, unmount2);
    return component2;
  }
  var mounted_components = /* @__PURE__ */ new WeakMap();
  function unmount(component2, options) {
    const fn = mounted_components.get(component2);
    if (fn) {
      mounted_components.delete(component2);
      return fn(options);
    }
    if (dev_fallback_default) {
      lifecycle_double_unmount();
    }
    return Promise.resolve();
  }

  // node_modules/svelte/src/internal/client/dom/blocks/branches.js
  var BranchManager = class {
    /** @type {TemplateNode} */
    anchor;
    /** @type {Map<Batch, Key>} */
    #batches = /* @__PURE__ */ new Map();
    /**
     * Map of keys to effects that are currently rendered in the DOM.
     * These effects are visible and actively part of the document tree.
     * Example:
     * ```
     * {#if condition}
     * 	foo
     * {:else}
     * 	bar
     * {/if}
     * ```
     * Can result in the entries `true->Effect` and `false->Effect`
     * @type {Map<Key, Effect>}
     */
    #onscreen = /* @__PURE__ */ new Map();
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    #offscreen = /* @__PURE__ */ new Map();
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    #outroing = /* @__PURE__ */ new Set();
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    #transition = true;
    /**
     * @param {TemplateNode} anchor
     * @param {boolean} transition
     */
    constructor(anchor, transition2 = true) {
      this.anchor = anchor;
      this.#transition = transition2;
    }
    /**
     * @param {Batch} batch
     */
    #commit = (batch) => {
      if (!this.#batches.has(batch)) return;
      var key2 = (
        /** @type {Key} */
        this.#batches.get(batch)
      );
      var onscreen = this.#onscreen.get(key2);
      if (onscreen) {
        resume_effect(onscreen);
        this.#outroing.delete(key2);
      } else {
        var offscreen = this.#offscreen.get(key2);
        if (offscreen) {
          resume_effect(offscreen.effect);
          this.#onscreen.set(key2, offscreen.effect);
          this.#offscreen.delete(key2);
          if (dev_fallback_default) {
            offscreen.fragment.lastChild[HMR_ANCHOR] = this.anchor;
          }
          offscreen.fragment.lastChild.remove();
          this.anchor.before(offscreen.fragment);
          onscreen = offscreen.effect;
        }
      }
      for (const [b, k] of this.#batches) {
        this.#batches.delete(b);
        if (b === batch) {
          break;
        }
        const offscreen2 = this.#offscreen.get(k);
        if (offscreen2) {
          destroy_effect(offscreen2.effect);
          this.#offscreen.delete(k);
        }
      }
      for (const [k, effect2] of this.#onscreen) {
        if (k === key2 || this.#outroing.has(k)) continue;
        const on_destroy = () => {
          const keys = Array.from(this.#batches.values());
          if (keys.includes(k)) {
            var fragment = document.createDocumentFragment();
            move_effect(effect2, fragment);
            fragment.append(create_text());
            this.#offscreen.set(k, { effect: effect2, fragment });
          } else {
            destroy_effect(effect2);
          }
          this.#outroing.delete(k);
          this.#onscreen.delete(k);
        };
        if (this.#transition || !onscreen) {
          this.#outroing.add(k);
          pause_effect(effect2, on_destroy, false);
        } else {
          on_destroy();
        }
      }
    };
    /**
     * @param {Batch} batch
     */
    #discard = (batch) => {
      this.#batches.delete(batch);
      const keys = Array.from(this.#batches.values());
      for (const [k, branch2] of this.#offscreen) {
        if (!keys.includes(k)) {
          destroy_effect(branch2.effect);
          this.#offscreen.delete(k);
        }
      }
    };
    /**
     *
     * @param {any} key
     * @param {null | ((target: TemplateNode) => void)} fn
     */
    ensure(key2, fn) {
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      var defer = should_defer_append();
      if (fn && !this.#onscreen.has(key2) && !this.#offscreen.has(key2)) {
        if (defer) {
          var fragment = document.createDocumentFragment();
          var target2 = create_text();
          fragment.append(target2);
          this.#offscreen.set(key2, {
            effect: branch(() => fn(target2)),
            fragment
          });
        } else {
          this.#onscreen.set(
            key2,
            branch(() => fn(this.anchor))
          );
        }
      }
      this.#batches.set(batch, key2);
      if (defer) {
        for (const [k, effect2] of this.#onscreen) {
          if (k === key2) {
            batch.unskip_effect(effect2);
          } else {
            batch.skip_effect(effect2);
          }
        }
        for (const [k, branch2] of this.#offscreen) {
          if (k === key2) {
            batch.unskip_effect(branch2.effect);
          } else {
            batch.skip_effect(branch2.effect);
          }
        }
        batch.oncommit(this.#commit);
        batch.ondiscard(this.#discard);
      } else {
        if (hydrating) {
          this.anchor = hydrate_node;
        }
        this.#commit(batch);
      }
    }
  };

  // node_modules/svelte/src/internal/client/dom/blocks/if.js
  function if_block(node, fn, elseif = false) {
    var marker;
    if (hydrating) {
      marker = hydrate_node;
      hydrate_next();
    }
    var branches = new BranchManager(node);
    var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
    function update_branch(key2, fn2) {
      if (hydrating) {
        var data = read_hydration_instruction(
          /** @type {TemplateNode} */
          marker
        );
        if (key2 !== parseInt(data.substring(1))) {
          var anchor = skip_nodes();
          set_hydrate_node(anchor);
          branches.anchor = anchor;
          set_hydrating(false);
          branches.ensure(key2, fn2);
          set_hydrating(true);
          return;
        }
      }
      branches.ensure(key2, fn2);
    }
    block(() => {
      var has_branch = false;
      fn((fn2, key2 = 0) => {
        has_branch = true;
        update_branch(key2, fn2);
      });
      if (!has_branch) {
        update_branch(-1, null);
      }
    }, flags2);
  }

  // node_modules/svelte/src/internal/client/dom/blocks/key.js
  var NAN = Symbol("NaN");

  // node_modules/svelte/src/internal/client/dom/blocks/each.js
  function index(_, i) {
    return i;
  }
  function pause_effects(state2, to_destroy, controlled_anchor) {
    var transitions = [];
    var length = to_destroy.length;
    var group;
    var remaining = to_destroy.length;
    for (var i = 0; i < length; i++) {
      let effect2 = to_destroy[i];
      pause_effect(
        effect2,
        () => {
          if (group) {
            group.pending.delete(effect2);
            group.done.add(effect2);
            if (group.pending.size === 0) {
              var groups = (
                /** @type {Set<EachOutroGroup>} */
                state2.outrogroups
              );
              destroy_effects(state2, array_from(group.done));
              groups.delete(group);
              if (groups.size === 0) {
                state2.outrogroups = null;
              }
            }
          } else {
            remaining -= 1;
          }
        },
        false
      );
    }
    if (remaining === 0) {
      var fast_path = transitions.length === 0 && controlled_anchor !== null && state2.pending.size === 0;
      if (fast_path) {
        var anchor = (
          /** @type {Element} */
          controlled_anchor
        );
        var parent_node = (
          /** @type {Element} */
          anchor.parentNode
        );
        clear_text_content(parent_node);
        parent_node.append(anchor);
        state2.items.clear();
      }
      destroy_effects(state2, to_destroy, !fast_path);
    } else {
      group = {
        pending: new Set(to_destroy),
        done: /* @__PURE__ */ new Set()
      };
      (state2.outrogroups ??= /* @__PURE__ */ new Set()).add(group);
    }
  }
  function destroy_effects(state2, to_destroy, remove_dom = true) {
    var preserved_effects;
    if (state2.pending.size > 0) {
      preserved_effects = /* @__PURE__ */ new Set();
      for (const keys of state2.pending.values()) {
        for (const key2 of keys) {
          preserved_effects.add(
            /** @type {EachItem} */
            state2.items.get(key2).e
          );
        }
      }
    }
    for (var i = 0; i < to_destroy.length; i++) {
      var e = to_destroy[i];
      if (preserved_effects?.has(e)) {
        e.f |= EFFECT_OFFSCREEN;
        const fragment = document.createDocumentFragment();
        move_effect(e, fragment);
      } else {
        destroy_effect(to_destroy[i], remove_dom);
      }
    }
  }
  var offscreen_anchor;
  function each(node, flags2, get_collection, get_key, render_fn, fallback_fn = null) {
    var anchor = node;
    var items = /* @__PURE__ */ new Map();
    var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = hydrating ? set_hydrate_node(get_first_child(parent_node)) : parent_node.appendChild(create_text());
    }
    if (hydrating) {
      hydrate_next();
    }
    var fallback2 = null;
    var each_array = derived_safe_equal(() => {
      var collection = get_collection();
      return (
        /** @type {V[]} */
        is_array(collection) ? collection : collection == null ? [] : array_from(collection)
      );
    });
    if (dev_fallback_default) {
      tag(each_array, "{#each ...}");
    }
    var pending2 = /* @__PURE__ */ new Map();
    var first_run = true;
    function commit(batch) {
      if ((state2.effect.f & DESTROYED) !== 0) {
        return;
      }
      state2.pending.delete(batch);
      var array = get(each_array);
      state2.fallback = fallback2;
      reconcile(state2, array, anchor, flags2, get_key);
      if (fallback2 !== null) {
        if (array.length === 0) {
          if ((fallback2.f & EFFECT_OFFSCREEN) === 0) {
            resume_effect(fallback2);
          } else {
            fallback2.f ^= EFFECT_OFFSCREEN;
            move(fallback2, null, anchor);
          }
        } else {
          pause_effect(fallback2, () => {
            fallback2 = null;
          });
        }
      }
    }
    function discard(batch) {
      state2.pending.delete(batch);
    }
    var effect2 = block(() => {
      var array = (
        /** @type {V[]} */
        get(each_array)
      );
      var length = array.length;
      let mismatch = false;
      if (hydrating) {
        var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;
        if (is_else !== (length === 0)) {
          anchor = skip_nodes();
          set_hydrate_node(anchor);
          set_hydrating(false);
          mismatch = true;
        }
      }
      var keys = /* @__PURE__ */ new Set();
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      var defer = should_defer_append();
      for (var index2 = 0; index2 < length; index2 += 1) {
        if (hydrating && hydrate_node.nodeType === COMMENT_NODE && /** @type {Comment} */
        hydrate_node.data === HYDRATION_END) {
          anchor = /** @type {Comment} */
          hydrate_node;
          mismatch = true;
          set_hydrating(false);
        }
        var value = array[index2];
        var key2 = get_key(value, index2);
        if (dev_fallback_default) {
          var key_again = get_key(value, index2);
          if (key2 !== key_again) {
            each_key_volatile(String(index2), String(key2), String(key_again));
          }
        }
        var item = first_run ? null : items.get(key2);
        if (item) {
          if (item.v) internal_set(item.v, value);
          if (item.i) internal_set(item.i, index2);
          if (defer) {
            batch.unskip_effect(item.e);
          }
        } else {
          item = create_item(
            items,
            first_run ? anchor : offscreen_anchor ??= create_text(),
            value,
            key2,
            index2,
            render_fn,
            flags2,
            get_collection
          );
          if (!first_run) {
            item.e.f |= EFFECT_OFFSCREEN;
          }
          items.set(key2, item);
        }
        keys.add(key2);
      }
      if (length === 0 && fallback_fn && !fallback2) {
        if (first_run) {
          fallback2 = branch(() => fallback_fn(anchor));
        } else {
          fallback2 = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
          fallback2.f |= EFFECT_OFFSCREEN;
        }
      }
      if (length > keys.size) {
        if (dev_fallback_default) {
          validate_each_keys(array, get_key);
        } else {
          each_key_duplicate("", "", "");
        }
      }
      if (hydrating && length > 0) {
        set_hydrate_node(skip_nodes());
      }
      if (!first_run) {
        pending2.set(batch, keys);
        if (defer) {
          for (const [key3, item2] of items) {
            if (!keys.has(key3)) {
              batch.skip_effect(item2.e);
            }
          }
          batch.oncommit(commit);
          batch.ondiscard(discard);
        } else {
          commit(batch);
        }
      }
      if (mismatch) {
        set_hydrating(true);
      }
      get(each_array);
    });
    var state2 = { effect: effect2, flags: flags2, items, pending: pending2, outrogroups: null, fallback: fallback2 };
    first_run = false;
    if (hydrating) {
      anchor = hydrate_node;
    }
  }
  function skip_to_branch(effect2) {
    while (effect2 !== null && (effect2.f & BRANCH_EFFECT) === 0) {
      effect2 = effect2.next;
    }
    return effect2;
  }
  function reconcile(state2, array, anchor, flags2, get_key) {
    var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
    var length = array.length;
    var items = state2.items;
    var current = skip_to_branch(state2.effect.first);
    var seen2;
    var prev = null;
    var to_animate;
    var matched = [];
    var stashed = [];
    var value;
    var key2;
    var effect2;
    var i;
    if (is_animated) {
      for (i = 0; i < length; i += 1) {
        value = array[i];
        key2 = get_key(value, i);
        effect2 = /** @type {EachItem} */
        items.get(key2).e;
        if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
          effect2.nodes?.a?.measure();
          (to_animate ??= /* @__PURE__ */ new Set()).add(effect2);
        }
      }
    }
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key2 = get_key(value, i);
      effect2 = /** @type {EachItem} */
      items.get(key2).e;
      if (state2.outrogroups !== null) {
        for (const group of state2.outrogroups) {
          group.pending.delete(effect2);
          group.done.delete(effect2);
        }
      }
      if ((effect2.f & INERT) !== 0) {
        resume_effect(effect2);
        if (is_animated) {
          effect2.nodes?.a?.unfix();
          (to_animate ??= /* @__PURE__ */ new Set()).delete(effect2);
        }
      }
      if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
        effect2.f ^= EFFECT_OFFSCREEN;
        if (effect2 === current) {
          move(effect2, null, anchor);
        } else {
          var next2 = prev ? prev.next : current;
          if (effect2 === state2.effect.last) {
            state2.effect.last = effect2.prev;
          }
          if (effect2.prev) effect2.prev.next = effect2.next;
          if (effect2.next) effect2.next.prev = effect2.prev;
          link(state2, prev, effect2);
          link(state2, effect2, next2);
          move(effect2, next2, anchor);
          prev = effect2;
          matched = [];
          stashed = [];
          current = skip_to_branch(prev.next);
          continue;
        }
      }
      if (effect2 !== current) {
        if (seen2 !== void 0 && seen2.has(effect2)) {
          if (matched.length < stashed.length) {
            var start = stashed[0];
            var j;
            prev = start.prev;
            var a = matched[0];
            var b = matched[matched.length - 1];
            for (j = 0; j < matched.length; j += 1) {
              move(matched[j], start, anchor);
            }
            for (j = 0; j < stashed.length; j += 1) {
              seen2.delete(stashed[j]);
            }
            link(state2, a.prev, b.next);
            link(state2, prev, a);
            link(state2, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen2.delete(effect2);
            move(effect2, current, anchor);
            link(state2, effect2.prev, effect2.next);
            link(state2, effect2, prev === null ? state2.effect.first : prev.next);
            link(state2, prev, effect2);
            prev = effect2;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current !== effect2) {
          (seen2 ??= /* @__PURE__ */ new Set()).add(current);
          stashed.push(current);
          current = skip_to_branch(current.next);
        }
        if (current === null) {
          continue;
        }
      }
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        matched.push(effect2);
      }
      prev = effect2;
      current = skip_to_branch(effect2.next);
    }
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        if (group.pending.size === 0) {
          destroy_effects(state2, array_from(group.done));
          state2.outrogroups?.delete(group);
        }
      }
      if (state2.outrogroups.size === 0) {
        state2.outrogroups = null;
      }
    }
    if (current !== null || seen2 !== void 0) {
      var to_destroy = [];
      if (seen2 !== void 0) {
        for (effect2 of seen2) {
          if ((effect2.f & INERT) === 0) {
            to_destroy.push(effect2);
          }
        }
      }
      while (current !== null) {
        if ((current.f & INERT) === 0 && current !== state2.fallback) {
          to_destroy.push(current);
        }
        current = skip_to_branch(current.next);
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
        if (is_animated) {
          for (i = 0; i < destroy_length; i += 1) {
            to_destroy[i].nodes?.a?.measure();
          }
          for (i = 0; i < destroy_length; i += 1) {
            to_destroy[i].nodes?.a?.fix();
          }
        }
        pause_effects(state2, to_destroy, controlled_anchor);
      }
    }
    if (is_animated) {
      queue_micro_task(() => {
        if (to_animate === void 0) return;
        for (effect2 of to_animate) {
          effect2.nodes?.a?.apply();
        }
      });
    }
  }
  function create_item(items, anchor, value, key2, index2, render_fn, flags2, get_collection) {
    var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? mutable_source(value, false, false) : source(value) : null;
    var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
    if (dev_fallback_default && v) {
      v.trace = () => {
        get_collection()[i?.v ?? index2];
      };
    }
    return {
      v,
      i,
      e: branch(() => {
        render_fn(anchor, v ?? value, i ?? index2, get_collection);
        return () => {
          items.delete(key2);
        };
      })
    };
  }
  function move(effect2, next2, anchor) {
    if (!effect2.nodes) return;
    var node = effect2.nodes.start;
    var end = effect2.nodes.end;
    var dest = next2 && (next2.f & EFFECT_OFFSCREEN) === 0 ? (
      /** @type {EffectNodes} */
      next2.nodes.start
    ) : anchor;
    while (node !== null) {
      var next_node = (
        /** @type {TemplateNode} */
        get_next_sibling(node)
      );
      dest.before(node);
      if (node === end) {
        return;
      }
      node = next_node;
    }
  }
  function link(state2, prev, next2) {
    if (prev === null) {
      state2.effect.first = next2;
    } else {
      prev.next = next2;
    }
    if (next2 === null) {
      state2.effect.last = prev;
    } else {
      next2.prev = prev;
    }
  }
  function validate_each_keys(array, key_fn) {
    const keys = /* @__PURE__ */ new Map();
    const length = array.length;
    for (let i = 0; i < length; i++) {
      const key2 = key_fn(array[i], i);
      if (keys.has(key2)) {
        const a = String(keys.get(key2));
        const b = String(i);
        let k = String(key2);
        if (k.startsWith("[object ")) k = null;
        each_key_duplicate(a, b, k);
      }
      keys.set(key2, i);
    }
  }

  // node_modules/svelte/src/internal/shared/attributes.js
  var whitespace = [..." 	\n\r\f\xA0\v\uFEFF"];
  function to_class(value, hash2, directives) {
    var classname = value == null ? "" : "" + value;
    if (hash2) {
      classname = classname ? classname + " " + hash2 : hash2;
    }
    if (directives) {
      for (var key2 of Object.keys(directives)) {
        if (directives[key2]) {
          classname = classname ? classname + " " + key2 : key2;
        } else if (classname.length) {
          var len = key2.length;
          var a = 0;
          while ((a = classname.indexOf(key2, a)) >= 0) {
            var b = a + len;
            if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
              classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
            } else {
              a = b;
            }
          }
        }
      }
    }
    return classname === "" ? null : classname;
  }
  function append_styles(styles, important = false) {
    var separator = important ? " !important;" : ";";
    var css = "";
    for (var key2 of Object.keys(styles)) {
      var value = styles[key2];
      if (value != null && value !== "") {
        css += " " + key2 + ": " + value + separator;
      }
    }
    return css;
  }
  function to_css_name(name) {
    if (name[0] !== "-" || name[1] !== "-") {
      return name.toLowerCase();
    }
    return name;
  }
  function to_style(value, styles) {
    if (styles) {
      var new_style = "";
      var normal_styles;
      var important_styles;
      if (Array.isArray(styles)) {
        normal_styles = styles[0];
        important_styles = styles[1];
      } else {
        normal_styles = styles;
      }
      if (value) {
        value = String(value).replaceAll(/\/\*.*?\*\//g, "").trim();
        var in_str = false;
        var in_apo = 0;
        var in_comment = false;
        var reserved_names = [];
        if (normal_styles) {
          reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
        }
        if (important_styles) {
          reserved_names.push(...Object.keys(important_styles).map(to_css_name));
        }
        var start_index = 0;
        var name_index = -1;
        const len = value.length;
        for (var i = 0; i < len; i++) {
          var c = value[i];
          if (in_comment) {
            if (c === "/" && value[i - 1] === "*") {
              in_comment = false;
            }
          } else if (in_str) {
            if (in_str === c) {
              in_str = false;
            }
          } else if (c === "/" && value[i + 1] === "*") {
            in_comment = true;
          } else if (c === '"' || c === "'") {
            in_str = c;
          } else if (c === "(") {
            in_apo++;
          } else if (c === ")") {
            in_apo--;
          }
          if (!in_comment && in_str === false && in_apo === 0) {
            if (c === ":" && name_index === -1) {
              name_index = i;
            } else if (c === ";" || i === len - 1) {
              if (name_index !== -1) {
                var name = to_css_name(value.substring(start_index, name_index).trim());
                if (!reserved_names.includes(name)) {
                  if (c !== ";") {
                    i++;
                  }
                  var property = value.substring(start_index, i).trim();
                  new_style += " " + property + ";";
                }
              }
              start_index = i + 1;
              name_index = -1;
            }
          }
        }
      }
      if (normal_styles) {
        new_style += append_styles(normal_styles);
      }
      if (important_styles) {
        new_style += append_styles(important_styles, true);
      }
      new_style = new_style.trim();
      return new_style === "" ? null : new_style;
    }
    return value == null ? null : String(value);
  }

  // node_modules/svelte/src/internal/client/dom/elements/class.js
  function set_class(dom, is_html, value, hash2, prev_classes, next_classes) {
    var prev = (
      /** @type {any} */
      dom[CLASS_CACHE]
    );
    if (hydrating || prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash2, next_classes);
      if (!hydrating || next_class_name !== dom.getAttribute("class")) {
        if (next_class_name == null) {
          dom.removeAttribute("class");
        } else if (is_html) {
          dom.className = next_class_name;
        } else {
          dom.setAttribute("class", next_class_name);
        }
      }
      dom[CLASS_CACHE] = value;
    } else if (next_classes && prev_classes !== next_classes) {
      for (var key2 in next_classes) {
        var is_present = !!next_classes[key2];
        if (prev_classes == null || is_present !== !!prev_classes[key2]) {
          dom.classList.toggle(key2, is_present);
        }
      }
    }
    return next_classes;
  }

  // node_modules/svelte/src/internal/client/dom/elements/style.js
  function update_styles(dom, prev = {}, next2, priority) {
    for (var key2 in next2) {
      var value = next2[key2];
      if (prev[key2] !== value) {
        if (next2[key2] == null) {
          dom.style.removeProperty(key2);
        } else {
          dom.style.setProperty(key2, value, priority);
        }
      }
    }
  }
  function set_style(dom, value, prev_styles, next_styles) {
    var prev = (
      /** @type {any} */
      dom[STYLE_CACHE]
    );
    if (hydrating || prev !== value) {
      var next_style_attr = to_style(value, next_styles);
      if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
        if (next_style_attr == null) {
          dom.removeAttribute("style");
        } else {
          dom.style.cssText = next_style_attr;
        }
      }
      dom[STYLE_CACHE] = value;
    } else if (next_styles) {
      if (Array.isArray(next_styles)) {
        update_styles(dom, prev_styles?.[0], next_styles[0]);
        update_styles(dom, prev_styles?.[1], next_styles[1], "important");
      } else {
        update_styles(dom, prev_styles, next_styles);
      }
    }
    return next_styles;
  }

  // node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
  function set_selected(option, selected) {
    if (selected) {
      if (!option.hasAttribute("selected")) option.setAttribute("selected", "");
    } else {
      option.removeAttribute("selected");
    }
  }
  function apply_default_select_value(select, preserve) {
    var value = select.__defaultValue;
    var multiple = select.multiple;
    var values = multiple ? value ?? [] : null;
    if (multiple && !is_array(values)) return;
    var index2 = select.selectedIndex;
    var selected = preserve && multiple ? new Set(select.selectedOptions) : null;
    for (var option of select.options) {
      var option_value = get_option_value(option);
      set_selected(
        option,
        multiple ? (
          /** @type {any[]} */
          values.includes(option_value)
        ) : is(option_value, value)
      );
    }
    if (!preserve) return;
    if (selected !== null) {
      for (option of select.options) {
        var was_selected = selected.has(option);
        if (option.selected !== was_selected) option.selected = was_selected;
      }
    } else if (select.selectedIndex !== index2) {
      select.selectedIndex = index2;
    }
  }
  function select_option(select, value, mounting = false) {
    if (select.multiple) {
      if (value == void 0) {
        return;
      }
      if (!is_array(value)) {
        return select_multiple_invalid_value();
      }
      for (var option of select.options) {
        option.selected = value.includes(get_option_value(option));
      }
      return;
    }
    for (option of select.options) {
      var option_value = get_option_value(option);
      if (is(option_value, value)) {
        option.selected = true;
        return;
      }
    }
    if (!mounting || value !== void 0) {
      select.selectedIndex = -1;
    }
  }
  function init_select(select) {
    var observer = new MutationObserver((entries) => {
      if (entries.every(is_selectedcontent_mutation)) return;
      if ("__defaultValue" in select) {
        apply_default_select_value(select, false);
      }
      if ("__value" in select) {
        select_option(select, select.__value);
      }
    });
    observer.observe(select, {
      // Listen to option element changes
      childList: true,
      subtree: true,
      // because of <optgroup>
      // Listen to option element value attribute changes
      // (doesn't get notified of select value changes,
      // because that property is not reflected as an attribute)
      attributes: true,
      attributeFilter: ["value"]
    });
    teardown(() => {
      observer.disconnect();
    });
  }
  function get_option_value(option) {
    if ("__value" in option) {
      return option.__value;
    } else {
      return option.value;
    }
  }
  function is_selectedcontent_mutation(entry) {
    if (
      /** @type {Element} */
      entry.target.closest("selectedcontent") !== null
    ) {
      return true;
    }
    if (entry.type === "childList") {
      var nodes = [...entry.addedNodes, ...entry.removedNodes];
      return nodes.length > 0 && nodes.every((node) => node.nodeName === "SELECTEDCONTENT");
    }
    return false;
  }

  // node_modules/svelte/src/internal/client/dom/elements/attributes.js
  var CLASS = Symbol("class");
  var STYLE = Symbol("style");
  var IS_CUSTOM_ELEMENT = Symbol("is custom element");
  var IS_HTML = Symbol("is html");
  var LINK_TAG = IS_XHTML ? "link" : "LINK";
  var PROGRESS_TAG = IS_XHTML ? "progress" : "PROGRESS";
  function remove_input_defaults(input) {
    if (!hydrating) return;
    var already_removed = false;
    var remove_defaults = () => {
      if (already_removed) return;
      already_removed = true;
      if (input.hasAttribute("value")) {
        var value = input.value;
        set_attribute2(input, "value", null);
        input.value = value;
      }
      if (input.hasAttribute("checked")) {
        var checked = input.checked;
        set_attribute2(input, "checked", null);
        input.checked = checked;
      }
    };
    input[FORM_RESET_HANDLER] = remove_defaults;
    queue_micro_task(remove_defaults);
    add_form_reset_listener();
  }
  function set_value(element2, value) {
    var attributes = get_attributes(element2);
    if (attributes.value === (attributes.value = // treat null and undefined the same for the initial value
    value ?? void 0) || // @ts-expect-error
    // `progress` elements always need their value set when it's `0`
    element2.value === value && (value !== 0 || element2.nodeName !== PROGRESS_TAG)) {
      return;
    }
    element2.value = value ?? "";
  }
  function set_attribute2(element2, attribute, value, skip_warning) {
    var attributes = get_attributes(element2);
    if (hydrating) {
      attributes[attribute] = element2.getAttribute(attribute);
      if (attribute === "src" || attribute === "srcset" || attribute === "href" && element2.nodeName === LINK_TAG) {
        if (!skip_warning) {
          check_src_in_dev_hydration(element2, attribute, value ?? "");
        }
        return;
      }
    }
    var previous = attributes[attribute];
    if (previous === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element2[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element2.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element2).has(attribute)) {
      element2[attribute] = value;
    } else if (
      // while hydrating, skip a number or boolean whose string the server already rendered
      !(hydrating && (typeof value === "number" || typeof value === "boolean") && previous === String(value))
    ) {
      element2.setAttribute(attribute, value);
    }
  }
  function get_attributes(element2) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      /** @type {any} */
      element2[ATTRIBUTES_CACHE] ??= {
        [IS_CUSTOM_ELEMENT]: element2.nodeName.includes("-"),
        [IS_HTML]: element2.namespaceURI === NAMESPACE_HTML
      }
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element2) {
    var cache_key = element2.getAttribute("is") || element2.nodeName;
    var setters = setters_cache.get(cache_key);
    if (setters) return setters;
    setters_cache.set(cache_key, setters = /* @__PURE__ */ new Set());
    var descriptors;
    var proto = element2;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key2 in descriptors) {
        if (descriptors[key2].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
        key2 !== "innerHTML" && key2 !== "textContent" && key2 !== "innerText") {
          setters.add(key2);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function check_src_in_dev_hydration(element2, attribute, value) {
    if (!dev_fallback_default) return;
    if (attribute === "srcset" && srcset_url_equal(element2, value)) return;
    if (src_url_equal(element2.getAttribute(attribute) ?? "", value)) return;
    hydration_attribute_changed(
      attribute,
      element2.outerHTML.replace(element2.innerHTML, element2.innerHTML && "..."),
      String(value)
    );
  }
  function src_url_equal(element_src, url) {
    if (element_src === url) return true;
    return new URL(element_src, document.baseURI).href === new URL(url, document.baseURI).href;
  }
  function split_srcset(srcset) {
    return srcset.split(",").map((src) => src.trim().split(" ").filter(Boolean));
  }
  function srcset_url_equal(element2, srcset) {
    var element_urls = split_srcset(element2.srcset);
    var urls = split_srcset(srcset);
    return urls.length === element_urls.length && urls.every(
      ([url, width], i) => width === element_urls[i][1] && // We need to test both ways because Vite will create an a full URL with
      // `new URL(asset, import.meta.url).href` for the client when `base: './'`, and the
      // relative URLs inside srcset are not automatically resolved to absolute URLs by
      // browsers (in contrast to img.src). This means both SSR and DOM code could
      // contain relative or absolute URLs.
      (src_url_equal(element_urls[i][0], url) || src_url_equal(url, element_urls[i][0]))
    );
  }

  // node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
  function bind_value(input, get3, set2 = get3) {
    var batches = /* @__PURE__ */ new WeakSet();
    listen_to_event_and_reset_event(input, "input", async (is_reset) => {
      if (dev_fallback_default && input.type === "checkbox") {
        bind_invalid_checkbox_value();
      }
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
      if (current_batch !== null) {
        batches.add(current_batch);
      }
      await tick();
      if (value !== (value = get3())) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        var length = input.value.length;
        input.value = value ?? "";
        if (end !== null) {
          var new_length = input.value.length;
          if (start === end && end === length && new_length > length) {
            input.selectionStart = new_length;
            input.selectionEnd = new_length;
          } else {
            input.selectionStart = start;
            input.selectionEnd = Math.min(end, new_length);
          }
        }
      }
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the updated value from the input instead.
      hydrating && input.defaultValue !== input.value || // If defaultValue is set, then value == defaultValue
      // TODO Svelte 6: remove input.value check and set to empty string?
      untrack(get3) == null && input.value
    ) {
      set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
      if (current_batch !== null) {
        batches.add(current_batch);
      }
    }
    render_effect(() => {
      if (dev_fallback_default && input.type === "checkbox") {
        bind_invalid_checkbox_value();
      }
      var value = get3();
      if (input === document.activeElement) {
        var batch = (
          /** @type {Batch} */
          async_mode_flag ? previous_batch : current_batch
        );
        if (batches.has(batch)) {
          return;
        }
      }
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      if (value !== input.value) {
        input.value = value ?? "";
      }
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }

  // node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
  function is_bound_this(bound_value, element_or_component) {
    return bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component;
  }
  function bind_this(element_or_component = mark_as_component(), update2, get_value, get_parts) {
    var component_effect = (
      /** @type {ComponentContext} */
      component_context.r
    );
    var parent = (
      /** @type {Effect} */
      active_effect
    );
    effect(() => {
      var old_parts;
      var parts;
      render_effect(() => {
        old_parts = parts;
        parts = get_parts?.() || [];
        untrack(() => {
          if (!is_bound_this(get_value(...parts), element_or_component)) {
            update2(element_or_component, ...parts);
            if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
              update2(null, ...old_parts);
            }
          }
        });
      });
      return () => {
        let p = parent;
        while (p !== component_effect && p.parent !== null && p.parent.f & DESTROYING) {
          p = p.parent;
        }
        const teardown2 = () => {
          if (parts && is_bound_this(get_value(...parts), element_or_component)) {
            update2(null, ...parts);
          }
        };
        const original_teardown = p.teardown;
        p.teardown = () => {
          teardown2();
          original_teardown?.();
        };
      };
    });
    return element_or_component;
  }

  // node_modules/svelte/src/internal/client/reactivity/store.js
  var is_store_binding = false;
  var IS_UNMOUNTED = Symbol("unmounted");
  function capture_store_binding(fn) {
    var previous_is_store_binding = is_store_binding;
    try {
      is_store_binding = false;
      return [fn(), is_store_binding];
    } finally {
      is_store_binding = previous_is_store_binding;
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/props.js
  function prop(props, key2, flags2, fallback2) {
    var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
    var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
    var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
    var fallback_value = (
      /** @type {V} */
      fallback2
    );
    var fallback_dirty = true;
    var fallback_signal = (
      /** @type {Derived<V> | undefined} */
      void 0
    );
    var get_fallback = () => {
      if (lazy && runes) {
        fallback_signal ??= derived(
          /** @type {() => V} */
          fallback2
        );
        return get(fallback_signal);
      }
      if (fallback_dirty) {
        fallback_dirty = false;
        fallback_value = lazy ? untrack(
          /** @type {() => V} */
          fallback2
        ) : (
          /** @type {V} */
          fallback2
        );
      }
      return fallback_value;
    };
    let setter;
    if (bindable) {
      var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
      setter = get_descriptor(props, key2)?.set ?? (is_entry_props && key2 in props ? (v) => props[key2] = v : void 0);
    }
    var initial_value;
    var is_store_sub = false;
    if (bindable) {
      [initial_value, is_store_sub] = capture_store_binding(() => (
        /** @type {V} */
        props[key2]
      ));
    } else {
      initial_value = /** @type {V} */
      props[key2];
    }
    if (initial_value === void 0 && fallback2 !== void 0) {
      initial_value = get_fallback();
      if (setter) {
        if (runes) props_invalid_value(key2);
        setter(initial_value);
      }
    }
    var getter;
    if (runes) {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key2]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        return value;
      };
    } else {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key2]
        );
        if (value !== void 0) {
          fallback_value = /** @type {V} */
          void 0;
        }
        return value === void 0 ? fallback_value : value;
      };
    }
    if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
      return getter;
    }
    if (setter) {
      var legacy_parent = props.$$legacy;
      return (
        /** @type {() => V} */
        function(value, mutation) {
          if (arguments.length > 0) {
            if (!runes || !mutation || legacy_parent || is_store_sub) {
              setter(mutation ? getter() : value);
            }
            return value;
          }
          return getter();
        }
      );
    }
    var overridden = false;
    var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
      overridden = false;
      return getter();
    });
    if (dev_fallback_default) {
      d.label = key2;
    }
    if (bindable) get(d);
    var parent_effect = (
      /** @type {Effect} */
      active_effect
    );
    return (
      /** @type {() => V} */
      function(value, mutation) {
        if (arguments.length > 0) {
          const new_value = mutation ? get(d) : runes && bindable ? proxy(value) : value;
          set(d, new_value);
          overridden = true;
          if (fallback_value !== void 0) {
            fallback_value = new_value;
          }
          return value;
        }
        if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
          return d.v;
        }
        return get(d);
      }
    );
  }

  // node_modules/svelte/src/legacy/legacy-client.js
  function createClassComponent(options) {
    return new Svelte4Component(options);
  }
  var Svelte4Component = class {
    /** @type {any} */
    #events;
    /** @type {Record<string, any>} */
    #instance;
    /**
     * @param {ComponentConstructorOptions & {
     *  component: any;
     * }} options
     */
    constructor(options) {
      var sources = /* @__PURE__ */ new Map();
      var add_source = (key2, value) => {
        var s = mutable_source(value, false, false);
        sources.set(key2, s);
        return s;
      };
      const props = new Proxy(
        { ...options.props || {}, $$events: {} },
        {
          get(target2, prop2) {
            return get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target2, prop2)));
          },
          has(target2, prop2) {
            if (prop2 === LEGACY_PROPS) return true;
            get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target2, prop2)));
            return Reflect.has(target2, prop2);
          },
          set(target2, prop2, value) {
            set(sources.get(prop2) ?? add_source(prop2, value), value);
            return Reflect.set(target2, prop2, value);
          }
        }
      );
      this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
        target: options.target,
        anchor: options.anchor,
        props,
        context: options.context,
        intro: options.intro ?? false,
        recover: options.recover,
        transformError: options.transformError
      });
      if (!async_mode_flag && (!options?.props?.$$host || options.sync === false)) {
        flushSync();
      }
      this.#events = props.$$events;
      for (const key2 of Object.keys(this.#instance)) {
        if (key2 === "$set" || key2 === "$destroy" || key2 === "$on") continue;
        define_property(this, key2, {
          get() {
            return this.#instance[key2];
          },
          /** @param {any} value */
          set(value) {
            this.#instance[key2] = value;
          },
          enumerable: true
        });
      }
      this.#instance.$set = /** @param {Record<string, any>} next */
      (next2) => {
        Object.assign(props, next2);
      };
      this.#instance.$destroy = () => {
        unmount(this.#instance);
      };
    }
    /** @param {Record<string, any>} props */
    $set(props) {
      this.#instance.$set(props);
    }
    /**
     * @param {string} event
     * @param {(...args: any[]) => any} callback
     * @returns {any}
     */
    $on(event2, callback) {
      this.#events[event2] = this.#events[event2] || [];
      const cb = (...args) => callback.call(this, ...args);
      this.#events[event2].push(cb);
      return () => {
        this.#events[event2] = this.#events[event2].filter(
          /** @param {any} fn */
          (fn) => fn !== cb
        );
      };
    }
    $destroy() {
      this.#instance.$destroy();
    }
  };

  // node_modules/svelte/src/internal/client/dom/elements/custom-element.js
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      /** The Svelte component constructor */
      $$ctor;
      /** Slots */
      $$s;
      /** @type {any} The Svelte component instance */
      $$c;
      /** Whether or not the custom element is connected */
      $$cn = false;
      /** @type {Record<string, any>} Component props data */
      $$d = {};
      /** `true` if currently in the process of reflecting component props back to attributes */
      $$r = false;
      /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
      $$p_d = {};
      /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
      $$l = {};
      /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
      $$l_u = /* @__PURE__ */ new Map();
      /** @type {any} The managed render effect for reflecting attributes */
      $$me;
      /** @type {ShadowRoot | null} The ShadowRoot of the custom element */
      $$shadowRoot = null;
      /**
       * @param {*} $$componentCtor
       * @param {*} $$slots
       * @param {ShadowRootInit | undefined} shadow_root_init
       */
      constructor($$componentCtor, $$slots, shadow_root_init) {
        super();
        this.$$ctor = $$componentCtor;
        this.$$s = $$slots;
        if (shadow_root_init) {
          this.$$shadowRoot = this.attachShadow(shadow_root_init);
        }
      }
      /**
       * @param {string} type
       * @param {EventListenerOrEventListenerObject} listener
       * @param {boolean | AddEventListenerOptions} [options]
       */
      addEventListener(type, listener, options) {
        this.$$l[type] = this.$$l[type] || [];
        this.$$l[type].push(listener);
        if (this.$$c) {
          const unsub = this.$$c.$on(type, listener);
          this.$$l_u.set(listener, unsub);
        }
        super.addEventListener(type, listener, options);
      }
      /**
       * @param {string} type
       * @param {EventListenerOrEventListenerObject} listener
       * @param {boolean | AddEventListenerOptions} [options]
       */
      removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
        if (this.$$c) {
          const unsub = this.$$l_u.get(listener);
          if (unsub) {
            unsub();
            this.$$l_u.delete(listener);
          }
        }
      }
      async connectedCallback() {
        this.$$cn = true;
        if (!this.$$c) {
          let create_slot = function(name) {
            return (anchor) => {
              const slot2 = create_element("slot");
              if (name !== "default") slot2.name = name;
              append(anchor, slot2);
            };
          };
          await Promise.resolve();
          if (!this.$$cn || this.$$c) {
            return;
          }
          const $$slots = {};
          const existing_slots = get_custom_elements_slots(this);
          for (const name of this.$$s) {
            if (name in existing_slots) {
              if (name === "default" && !this.$$d.children) {
                this.$$d.children = create_slot(name);
                $$slots.default = true;
              } else {
                $$slots[name] = create_slot(name);
              }
            }
          }
          for (const attribute of this.attributes) {
            const name = this.$$g_p(attribute.name);
            if (!(name in this.$$d)) {
              this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
            }
          }
          for (const key2 in this.$$p_d) {
            if (!(key2 in this.$$d) && this[key2] !== void 0) {
              this.$$d[key2] = this[key2];
              delete this[key2];
            }
          }
          this.$$c = createClassComponent({
            component: this.$$ctor,
            target: this.$$shadowRoot || this,
            props: {
              ...this.$$d,
              $$slots,
              $$host: this
            }
          });
          this.$$me = effect_root(() => {
            render_effect(() => {
              this.$$r = true;
              for (const key2 of object_keys(this.$$c)) {
                if (!this.$$p_d[key2]?.reflect) continue;
                this.$$d[key2] = this.$$c[key2];
                const attribute_value = get_custom_element_value(
                  key2,
                  this.$$d[key2],
                  this.$$p_d,
                  "toAttribute"
                );
                if (attribute_value == null) {
                  this.removeAttribute(this.$$p_d[key2].attribute || key2);
                } else {
                  this.setAttribute(this.$$p_d[key2].attribute || key2, attribute_value);
                }
              }
              this.$$r = false;
            });
          });
          for (const type in this.$$l) {
            for (const listener of this.$$l[type]) {
              const unsub = this.$$c.$on(type, listener);
              this.$$l_u.set(listener, unsub);
            }
          }
          this.$$l = {};
        }
      }
      // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
      // and setting attributes through setAttribute etc, this is helpful
      /**
       * @param {string} attr
       * @param {string} _oldValue
       * @param {string} newValue
       */
      attributeChangedCallback(attr2, _oldValue, newValue) {
        if (this.$$r) return;
        attr2 = this.$$g_p(attr2);
        this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
        this.$$c?.$set({ [attr2]: this.$$d[attr2] });
      }
      disconnectedCallback() {
        this.$$cn = false;
        Promise.resolve().then(() => {
          if (!this.$$cn && this.$$c) {
            this.$$c.$destroy();
            this.$$me();
            this.$$c = void 0;
          }
        });
      }
      /**
       * @param {string} attribute_name
       */
      $$g_p(attribute_name) {
        return object_keys(this.$$p_d).find(
          (key2) => this.$$p_d[key2].attribute === attribute_name || !this.$$p_d[key2].attribute && key2.toLowerCase() === attribute_name
        ) || attribute_name;
      }
    };
  }
  function get_custom_element_value(prop2, value, props_definition, transform) {
    const type = props_definition[prop2]?.type;
    value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
    if (!transform || !props_definition[prop2]) {
      return value;
    } else if (transform === "toAttribute") {
      switch (type) {
        case "Object":
        case "Array":
          return value == null ? null : JSON.stringify(value);
        case "Boolean":
          return value ? "" : null;
        case "Number":
          return value == null ? null : value;
        default:
          return value;
      }
    } else {
      switch (type) {
        case "Object":
        case "Array":
          return value && JSON.parse(value);
        case "Boolean":
          return value;
        // conversion already handled above
        case "Number":
          return value != null ? +value : value;
        default:
          return value;
      }
    }
  }
  function get_custom_elements_slots(element2) {
    const result = {};
    element2.childNodes.forEach((node) => {
      result[
        /** @type {Element} node */
        node.slot || "default"
      ] = true;
    });
    return result;
  }

  // node_modules/svelte/src/index-client.js
  if (dev_fallback_default) {
    let throw_rune_error = function(rune) {
      if (!(rune in globalThis)) {
        let value;
        Object.defineProperty(globalThis, rune, {
          configurable: true,
          // eslint-disable-next-line getter-return
          get: () => {
            if (value !== void 0) {
              return value;
            }
            rune_outside_svelte(rune);
          },
          set: (v) => {
            value = v;
          }
        });
      }
    };
    throw_rune_error("$state");
    throw_rune_error("$effect");
    throw_rune_error("$derived");
    throw_rune_error("$inspect");
    throw_rune_error("$props");
    throw_rune_error("$bindable");
  }

  // node_modules/svelte/src/version.js
  var PUBLIC_VERSION = "5";

  // node_modules/svelte/src/internal/disclose-version.js
  if (typeof window !== "undefined") {
    ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(PUBLIC_VERSION);
  }

  // src/webview/common/ContextMenu.svelte
  var root = from_html(`<div class="vz-context-divider"></div>`);
  var root_1 = from_html(`<div class="vz-context-submenu" role="menu" tabindex="-1"><!></div>`);
  var root_2 = from_html(`<div class="vz-context-submenu-wrap"><button type="button" class="vz-context-item" role="menuitem" aria-haspopup="true"><span> </span> <span class="vz-submenu-arrow">\u25B8</span></button> <!></div>`);
  var root_3 = from_html(`<kbd class="vz-kbd"> </kbd>`);
  var root_4 = from_html(`<button type="button" role="menuitem"><span> </span> <!></button>`);
  var root_5 = from_html(`<!> <!>`, 1);
  var root_6 = from_html(`<div class="vz-context-menu-title"> </div>`);
  var root_7 = from_html(`<div class="vz-context-backdrop"><div class="vz-context-menu" role="menu" tabindex="-1"><!> <!></div></div>`);
  function ContextMenu($$anchor, $$props) {
    push($$props, true);
    const menuList = ($$anchor2, items = noop, parentPath = noop) => {
      var fragment = comment();
      var node = first_child(fragment);
      each(node, 17, items, index, ($$anchor3, item, idx) => {
        const itemPath = user_derived(() => parentPath() ? `${parentPath()}.${idx}` : `${idx}`);
        var fragment_1 = root_5();
        var node_1 = first_child(fragment_1);
        {
          var consequent = ($$anchor4) => {
            var div = root();
            append($$anchor4, div);
          };
          if_block(node_1, ($$render) => {
            if (get(item).dividerBefore) $$render(consequent);
          });
        }
        var node_2 = sibling(node_1, 2);
        {
          var consequent_2 = ($$anchor4) => {
            var div_1 = root_2();
            var button = child(div_1);
            var span = child(button);
            var text2 = only_child(span, true);
            next(2);
            reset(button);
            var node_3 = sibling(button, 2);
            {
              var consequent_1 = ($$anchor5) => {
                var div_2 = root_1();
                var node_4 = child(div_2);
                menuList(node_4, () => get(item).submenu, () => get(itemPath));
                reset(div_2);
                append($$anchor5, div_2);
              };
              var d = user_derived(() => isPathOpen(get(itemPath)));
              if_block(node_3, ($$render) => {
                if (get(d)) $$render(consequent_1);
              });
            }
            reset(div_1);
            template_effect(
              ($0) => {
                set_attribute2(button, "aria-expanded", $0);
                set_text(text2, get(item).label);
              },
              [() => isPathOpen(get(itemPath))]
            );
            event("pointerenter", div_1, () => set(activePath, get(itemPath), true));
            delegated("click", button, (e) => {
              e.stopPropagation();
              set(activePath, isPathOpen(get(itemPath)) ? parentPath() : get(itemPath), true);
            });
            append($$anchor4, div_1);
          };
          var alternate = ($$anchor4) => {
            var button_1 = root_4();
            let classes;
            var span_1 = child(button_1);
            var text_1 = only_child(span_1, true);
            var node_5 = sibling(span_1, 2);
            {
              var consequent_3 = ($$anchor5) => {
                var kbd = root_3();
                var text_2 = only_child(kbd, true);
                template_effect(() => set_text(text_2, get(item).shortcut));
                append($$anchor5, kbd);
              };
              if_block(node_5, ($$render) => {
                if (get(item).shortcut) $$render(consequent_3);
              });
            }
            reset(button_1);
            template_effect(() => {
              classes = set_class(button_1, 1, "vz-context-item", null, classes, { danger: get(item).danger });
              set_text(text_1, get(item).label);
            });
            event("pointerenter", button_1, () => set(activePath, parentPath(), true));
            delegated("click", button_1, (e) => {
              e.stopPropagation();
              const fn = get(item).action;
              set(activePath, "");
              $$props.store.closeContextMenu();
              fn?.();
            });
            append($$anchor4, button_1);
          };
          if_block(node_2, ($$render) => {
            if (get(item).submenu && get(item).submenu.length > 0) $$render(consequent_2);
            else $$render(alternate, -1);
          });
        }
        append($$anchor3, fragment_1);
      });
      append($$anchor2, fragment);
    };
    let activePath = state("");
    function isPathOpen(pathKey) {
      return get(activePath) === pathKey || get(activePath).startsWith(`${pathKey}.`);
    }
    var fragment_2 = comment();
    var node_6 = first_child(fragment_2);
    {
      var consequent_5 = ($$anchor2) => {
        var div_3 = root_7();
        var div_4 = child(div_3);
        var node_7 = child(div_4);
        {
          var consequent_4 = ($$anchor3) => {
            var div_5 = root_6();
            var text_3 = only_child(div_5, true);
            template_effect(() => set_text(text_3, $$props.store.contextMenu.title));
            append($$anchor3, div_5);
          };
          if_block(node_7, ($$render) => {
            if ($$props.store.contextMenu.title) $$render(consequent_4);
          });
        }
        var node_8 = sibling(node_7, 2);
        menuList(node_8, () => $$props.store.contextMenu.items, () => "");
        reset(div_4);
        reset(div_3);
        template_effect(() => set_style(div_4, `left: ${$$props.store.contextMenu.x ?? ""}px; top: ${$$props.store.contextMenu.y ?? ""}px;`));
        delegated("pointerdown", div_3, () => {
          set(activePath, "");
          $$props.store.closeContextMenu();
        });
        delegated("contextmenu", div_3, (e) => {
          e.preventDefault();
          set(activePath, "");
          $$props.store.closeContextMenu();
        });
        delegated("pointerdown", div_4, (e) => e.stopPropagation());
        append($$anchor2, div_3);
      };
      if_block(node_6, ($$render) => {
        if ($$props.store.contextMenu) $$render(consequent_5);
      });
    }
    append($$anchor, fragment_2);
    pop();
  }
  delegate(["click", "pointerdown", "contextmenu"]);

  // src/webview/bridge.ts
  var vscodeApiInstance;
  function getVsCodeApi() {
    if (!vscodeApiInstance) {
      if (typeof acquireVsCodeApi === "function") {
        vscodeApiInstance = acquireVsCodeApi();
      } else {
        let memoryState;
        vscodeApiInstance = {
          postMessage: () => {
          },
          getState: () => memoryState,
          setState: (s) => {
            memoryState = s;
            return s;
          }
        };
      }
    }
    return vscodeApiInstance;
  }
  function postToHost(message) {
    const plainPayload = JSON.parse(JSON.stringify(message));
    getVsCodeApi().postMessage(plainPayload);
  }

  // src/webview/common/ErrorView.svelte
  var root2 = from_html(
    `<p class="vz-error-desc">This document is currently empty. Because it was cleared or undone during an active session,
        Vizion will not overwrite or regenerate it automatically unless you choose to initialize it.</p> <div class="vz-error-actions"><button type="button" class="vz-btn vz-btn-primary"> </button> <button type="button" class="vz-btn">Open as Text</button></div>`,
    1
  );
  var root_12 = from_html(`<li class="vz-issue-item"><code class="vz-issue-path"> </code> <div class="vz-issue-msg"> </div></li>`);
  var root_22 = from_html(
    `<p class="vz-error-desc">Your file content has been preserved untouched. Fix the validation issue(s) below in the text editor
        and this visual canvas will recover automatically.</p> <ul class="vz-issue-list" aria-label="Document validation errors"></ul> <div class="vz-error-actions"><button type="button" class="vz-btn vz-btn-primary">Open as Text</button> <button type="button" class="vz-btn">Show Problems</button> <button type="button" class="vz-btn">Recheck</button></div>`,
    1
  );
  var root_32 = from_html(`<div class="vz-stale-notice"><strong>Stale Read-Only Preview Available:</strong> The last valid state is retained in memory
        for reference only and will never overwrite your current text.</div>`);
  var root_42 = from_html(`<div class="vz-error-panel" role="alert" aria-labelledby="vz-error-heading"><div class="vz-error-card"><h2 id="vz-error-heading" class="vz-error-title"><!></h2> <!> <!></div></div>`);
  function ErrorView($$anchor, $$props) {
    push($$props, true);
    const errorIssues = user_derived(() => $$props.store.issues.filter((i) => i.severity === "error"));
    var div = root_42();
    var div_1 = child(div);
    var h2 = child(div_1);
    var node = child(h2);
    {
      var consequent = ($$anchor2) => {
        var text2 = text();
        template_effect(($0) => set_text(text2, `Empty ${$0 ?? ""} document`), [() => $$props.store.expectedKind.toUpperCase()]);
        append($$anchor2, text2);
      };
      var alternate = ($$anchor2) => {
        var text_1 = text();
        template_effect(($0) => set_text(text_1, `Cannot open ${$0 ?? ""} document`), [() => $$props.store.expectedKind.toUpperCase()]);
        append($$anchor2, text_1);
      };
      if_block(node, ($$render) => {
        if ($$props.store.isEmptyDocument) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    reset(h2);
    var node_1 = sibling(h2, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var fragment_2 = root2();
        var div_2 = sibling(first_child(fragment_2), 2);
        var button = child(div_2);
        var text_2 = only_child(button);
        var button_1 = sibling(button, 2);
        reset(div_2);
        template_effect(($0) => set_text(text_2, `Initialize ${$0 ?? ""} Template`), [() => $$props.store.expectedKind.toUpperCase()]);
        delegated("click", button, () => postToHost({ type: "webview.initializeEmpty" }));
        delegated("click", button_1, () => postToHost({ type: "webview.openAsText" }));
        append($$anchor2, fragment_2);
      };
      var alternate_1 = ($$anchor2) => {
        var fragment_3 = root_22();
        var ul = sibling(first_child(fragment_3), 2);
        each(ul, 21, () => get(errorIssues), index, ($$anchor3, issue) => {
          var li = root_12();
          var code = child(li);
          var text_3 = only_child(code);
          var div_3 = sibling(code, 2);
          var text_4 = only_child(div_3, true);
          reset(li);
          template_effect(() => {
            set_text(text_3, `${get(issue).path ?? ""}${get(issue).line ? ` (line ${get(issue).line}, col ${get(issue).column ?? 1})` : ""}`);
            set_text(text_4, get(issue).message);
          });
          append($$anchor3, li);
        });
        reset(ul);
        var div_4 = sibling(ul, 2);
        var button_2 = child(div_4);
        var button_3 = sibling(button_2, 2);
        var button_4 = sibling(button_3, 2);
        reset(div_4);
        delegated("click", button_2, () => postToHost({ type: "webview.openAsText" }));
        delegated("click", button_3, () => postToHost({ type: "webview.showProblems" }));
        delegated("click", button_4, () => postToHost({ type: "webview.recheck" }));
        append($$anchor2, fragment_3);
      };
      if_block(node_1, ($$render) => {
        if ($$props.store.isEmptyDocument && $$props.store.canExplicitlyInitialize) $$render(consequent_1);
        else $$render(alternate_1, -1);
      });
    }
    var node_2 = sibling(node_1, 2);
    {
      var consequent_2 = ($$anchor2) => {
        var div_5 = root_32();
        append($$anchor2, div_5);
      };
      if_block(node_2, ($$render) => {
        if ($$props.store.lastValidDocument) $$render(consequent_2);
      });
    }
    reset(div_1);
    reset(div);
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);

  // src/shared/registry/uml-registry.ts
  var UML_SHAPE_GEOMETRIES = [
    { kind: "ellipse", label: "Ellipse" },
    { kind: "rectangle", label: "Rectangle" },
    { kind: "rhombus", label: "Rhombus" },
    { kind: "trapezoid", label: "Trapezoid" },
    { kind: "parallelogram", label: "Parallelogram" }
  ];
  var endpointShapeRegistry = /* @__PURE__ */ new Map();
  var nodeKindRegistry = /* @__PURE__ */ new Map();
  var relationPresetRegistry = /* @__PURE__ */ new Map();
  function registerEndpointShape(descriptor) {
    endpointShapeRegistry.set(descriptor.kind, descriptor);
  }
  function getEndpointShape(kind) {
    return endpointShapeRegistry.get(kind);
  }
  function listEndpointShapes() {
    return Array.from(endpointShapeRegistry.values());
  }
  function registerUmlNodeKind(descriptor) {
    nodeKindRegistry.set(descriptor.kind, descriptor);
  }
  function getUmlNodeKind(kind) {
    return nodeKindRegistry.get(kind);
  }
  function registerUmlRelationPreset(preset) {
    relationPresetRegistry.set(preset.kind, preset);
  }
  function getUmlRelationPreset(kind) {
    return relationPresetRegistry.get(kind);
  }
  function listUmlRelationPresets() {
    return Array.from(relationPresetRegistry.values());
  }
  registerEndpointShape({
    kind: "none",
    label: "None",
    description: "Plain line termination with no marker",
    supportsFill: false,
    defaultSize: 10,
    trimMultiplier: 0,
    buildLocalPath: () => ""
  });
  registerEndpointShape({
    kind: "circle",
    label: "Circle",
    description: "Circular endpoint decoration (hollow or filled)",
    supportsFill: true,
    defaultFill: "hollow",
    defaultSize: 10,
    trimMultiplier: 1,
    buildLocalPath: (size) => {
      const r = size / 2;
      return `M 0 0 A ${r} ${r} 0 1 0 -${size} 0 A ${r} ${r} 0 1 0 0 0 Z`;
    }
  });
  registerEndpointShape({
    kind: "diamond",
    label: "Diamond",
    description: "Diamond endpoint decoration (hollow for aggregation, filled for composition)",
    supportsFill: true,
    defaultFill: "hollow",
    defaultSize: 13,
    trimMultiplier: 1,
    buildLocalPath: (size) => {
      const halfLen = size / 2;
      const halfWidth = size * 0.36;
      return `M 0 0 L -${halfLen} -${halfWidth} L -${size} 0 L -${halfLen} ${halfWidth} Z`;
    }
  });
  registerEndpointShape({
    kind: "square",
    label: "Square",
    description: "Square port/endpoint decoration (hollow or filled)",
    supportsFill: true,
    defaultFill: "hollow",
    defaultSize: 10,
    trimMultiplier: 1,
    buildLocalPath: (size) => {
      const half = size / 2;
      return `M 0 -${half} L -${size} -${half} L -${size} ${half} L 0 ${half} Z`;
    }
  });
  registerEndpointShape({
    kind: "triangle",
    label: "Triangle",
    description: "Closed triangular arrowhead (hollow for generalization/realization, or filled)",
    supportsFill: true,
    defaultFill: "hollow",
    defaultSize: 12,
    trimMultiplier: 1,
    buildLocalPath: (size) => {
      const halfWidth = size * 0.48;
      return `M 0 0 L -${size} -${halfWidth} L -${size} ${halfWidth} Z`;
    }
  });
  registerEndpointShape({
    kind: "open-arrow",
    label: "Open Arrow",
    description: "Open V-shaped navigable arrowhead (stroke only)",
    supportsFill: false,
    defaultSize: 11,
    trimMultiplier: 0.15,
    buildLocalPath: (size) => {
      const halfWidth = size * 0.45;
      return `M -${size} -${halfWidth} L 0 0 L -${size} ${halfWidth}`;
    }
  });
  registerUmlNodeKind({
    kind: "class",
    label: "Class",
    description: "Standard UML class with attributes and operations compartments",
    defaultWidth: 210,
    defaultHeight: 140,
    hasCompartments: true
  });
  registerUmlNodeKind({
    kind: "note",
    label: "Note",
    description: "Free-text UML annotation note with folded corner",
    defaultWidth: 185,
    defaultHeight: 100,
    hasCompartments: false
  });
  registerUmlNodeKind({
    kind: "shape",
    label: "Shape",
    description: "Geometric shape node with centered label (ellipse, rectangle, rhombus, trapezoid, parallelogram)",
    defaultWidth: 160,
    defaultHeight: 90,
    hasCompartments: false
  });
  registerUmlRelationPreset({
    kind: "association",
    label: "Association",
    description: "Structural link between classes (solid line, no endpoint markers by default)",
    line: "solid",
    routing: "bezier",
    start: { shape: "none", size: 10 },
    end: { shape: "none", size: 10 }
  });
  registerUmlRelationPreset({
    kind: "dependency",
    label: "Dependency",
    description: "Uses/depends-on relationship (dashed line, open arrow at target)",
    line: "dashed",
    routing: "bezier",
    start: { shape: "none", size: 10 },
    end: { shape: "open-arrow", size: 11 }
  });
  registerUmlRelationPreset({
    kind: "generalization",
    label: "Generalization (Inheritance)",
    description: "Subclasses a general classifier (solid line, hollow triangle at target)",
    line: "solid",
    routing: "bezier",
    start: { shape: "none", size: 10 },
    end: { shape: "triangle", fill: "hollow", size: 12 }
  });
  registerUmlRelationPreset({
    kind: "realization",
    label: "Realization (Implements)",
    description: "Implements a specification contract (dashed line, hollow triangle at target)",
    line: "dashed",
    routing: "bezier",
    start: { shape: "none", size: 10 },
    end: { shape: "triangle", fill: "hollow", size: 12 }
  });
  registerUmlRelationPreset({
    kind: "aggregation",
    label: "Aggregation",
    description: "Whole-part weak ownership (solid line, hollow diamond at source)",
    line: "solid",
    routing: "bezier",
    start: { shape: "diamond", fill: "hollow", size: 13 },
    end: { shape: "none", size: 10 }
  });
  registerUmlRelationPreset({
    kind: "composition",
    label: "Composition",
    description: "Whole-part strong lifecycle ownership (solid line, filled diamond at source)",
    line: "solid",
    routing: "bezier",
    start: { shape: "diamond", fill: "filled", size: 13 },
    end: { shape: "none", size: 10 }
  });

  // src/shared/geometry/index.ts
  var GRID_SIZE = 20;
  function snapToGrid(value, gridSize = GRID_SIZE) {
    return Math.round(value / gridSize) * gridSize;
  }
  function screenToWorld(screenX, screenY, viewport) {
    const z = Math.max(0.05, viewport.zoom);
    return {
      x: Math.round((screenX - viewport.panX) / z * 100) / 100,
      y: Math.round((screenY - viewport.panY) / z * 100) / 100
    };
  }
  function normalizeDragRect(p1, p2, minSize = 0) {
    const x = Math.min(p1.x, p2.x);
    const y = Math.min(p1.y, p2.y);
    const width = Math.max(minSize, Math.abs(p2.x - p1.x));
    const height = Math.max(minSize, Math.abs(p2.y - p1.y));
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      width: Math.round(width * 10) / 10,
      height: Math.round(height * 10) / 10
    };
  }
  function rectsIntersect(a, b) {
    return a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;
  }
  function computeRectBoundaryIntersection(rect, externalPoint) {
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const dx = externalPoint.x - cx;
    const dy = externalPoint.y - cy;
    const halfW = Math.max(10, rect.width / 2);
    const halfH = Math.max(10, rect.height / 2);
    if (Math.abs(dx) < 1e-3 && Math.abs(dy) < 1e-3) {
      return {
        point: { x: rect.x + rect.width, y: cy },
        normal: { x: 1, y: 0 }
      };
    }
    const scaleX = halfW / Math.max(1e-4, Math.abs(dx));
    const scaleY = halfH / Math.max(1e-4, Math.abs(dy));
    if (scaleX < scaleY) {
      const signX = dx >= 0 ? 1 : -1;
      return {
        point: {
          x: cx + signX * halfW,
          y: cy + dy * scaleX
        },
        normal: { x: signX, y: 0 }
      };
    } else {
      const signY = dy >= 0 ? 1 : -1;
      return {
        point: {
          x: cx + dx * scaleY,
          y: cy + signY * halfH
        },
        normal: { x: 0, y: signY }
      };
    }
  }
  function computeUmlEdgeGeometry(sourceRect, targetRect, routing = "straight", startDec, endDec, parallelOffset = 0, sourceAnchorOverride, targetAnchorOverride) {
    if (!sourceAnchorOverride && !targetAnchorOverride && sourceRect.x === targetRect.x && sourceRect.y === targetRect.y && sourceRect.width === targetRect.width && sourceRect.height === targetRect.height) {
      const startTip2 = { x: sourceRect.x + sourceRect.width * 0.75, y: sourceRect.y };
      const endTip2 = { x: sourceRect.x + sourceRect.width, y: sourceRect.y + sourceRect.height * 0.35 };
      const c1 = { x: startTip2.x, y: startTip2.y - 55 };
      const c2 = { x: endTip2.x + 60, y: endTip2.y - 55 };
      const pathD2 = `M ${startTip2.x} ${startTip2.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${endTip2.x} ${endTip2.y}`;
      return {
        pathD: pathD2,
        hitPathD: pathD2,
        startTip: startTip2,
        endTip: endTip2,
        startAngleDeg: 90,
        endAngleDeg: 180,
        labelPoint: { x: endTip2.x + 42, y: startTip2.y - 42 }
      };
    }
    const sourceCenter = {
      x: sourceRect.x + sourceRect.width / 2,
      y: sourceRect.y + sourceRect.height / 2
    };
    const targetCenter = {
      x: targetRect.x + targetRect.width / 2,
      y: targetRect.y + targetRect.height / 2
    };
    const srcHit = sourceAnchorOverride ?? computeRectBoundaryIntersection(sourceRect, targetCenter);
    const tgtHit = targetAnchorOverride ?? computeRectBoundaryIntersection(targetRect, sourceCenter);
    let startTip = srcHit.point;
    let endTip = tgtHit.point;
    const rawDx = endTip.x - startTip.x;
    const rawDy = endTip.y - startTip.y;
    const rawLen = Math.hypot(rawDx, rawDy) || 1;
    const perpX = -rawDy / rawLen;
    const perpY = rawDx / rawLen;
    if (parallelOffset !== 0) {
      startTip = {
        x: startTip.x + perpX * parallelOffset,
        y: startTip.y + perpY * parallelOffset
      };
      endTip = {
        x: endTip.x + perpX * parallelOffset,
        y: endTip.y + perpY * parallelOffset
      };
    }
    const startShape = getEndpointShape(startDec?.shape ?? "none");
    const endShape = getEndpointShape(endDec?.shape ?? "none");
    const startSize = startDec?.size ?? startShape?.defaultSize ?? 10;
    const endSize = endDec?.size ?? endShape?.defaultSize ?? 11;
    const startTrim = (startShape?.trimMultiplier ?? 0) * startSize;
    const endTrim = (endShape?.trimMultiplier ?? 0) * endSize;
    const fullHitPath = `M ${startTip.x} ${startTip.y} L ${endTip.x} ${endTip.y}`;
    if (routing === "bezier") {
      const dist = Math.min(140, Math.max(40, rawLen * 0.38));
      const c1 = {
        x: startTip.x + srcHit.normal.x * dist,
        y: startTip.y + srcHit.normal.y * dist
      };
      const c2 = {
        x: endTip.x + tgtHit.normal.x * dist,
        y: endTip.y + tgtHit.normal.y * dist
      };
      const startVecX = startTip.x - c1.x;
      const startVecY = startTip.y - c1.y;
      const startVecLen = Math.hypot(startVecX, startVecY) || 1;
      const startUnitX = startVecX / startVecLen;
      const startUnitY = startVecY / startVecLen;
      const endVecX = endTip.x - c2.x;
      const endVecY = endTip.y - c2.y;
      const endVecLen = Math.hypot(endVecX, endVecY) || 1;
      const endUnitX = endVecX / endVecLen;
      const endUnitY = endVecY / endVecLen;
      const trimmedStart2 = {
        x: startTip.x - startUnitX * Math.min(startTrim, rawLen * 0.4),
        y: startTip.y - startUnitY * Math.min(startTrim, rawLen * 0.4)
      };
      const trimmedEnd2 = {
        x: endTip.x - endUnitX * Math.min(endTrim, rawLen * 0.4),
        y: endTip.y - endUnitY * Math.min(endTrim, rawLen * 0.4)
      };
      const pathD2 = `M ${trimmedStart2.x} ${trimmedStart2.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${trimmedEnd2.x} ${trimmedEnd2.y}`;
      const hitPathD = `M ${startTip.x} ${startTip.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${endTip.x} ${endTip.y}`;
      const labelPoint = {
        x: 0.125 * startTip.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * endTip.x,
        y: 0.125 * startTip.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * endTip.y - 10
      };
      return {
        pathD: pathD2,
        hitPathD,
        startTip,
        endTip,
        startAngleDeg: Math.atan2(startUnitY, startUnitX) * 180 / Math.PI,
        endAngleDeg: Math.atan2(endUnitY, endUnitX) * 180 / Math.PI,
        labelPoint
      };
    }
    const unitX = rawDx / rawLen;
    const unitY = rawDy / rawLen;
    const trimmedStart = {
      x: startTip.x + unitX * Math.min(startTrim, rawLen * 0.45),
      y: startTip.y + unitY * Math.min(startTrim, rawLen * 0.45)
    };
    const trimmedEnd = {
      x: endTip.x - unitX * Math.min(endTrim, rawLen * 0.45),
      y: endTip.y - unitY * Math.min(endTrim, rawLen * 0.45)
    };
    const pathD = `M ${trimmedStart.x} ${trimmedStart.y} L ${trimmedEnd.x} ${trimmedEnd.y}`;
    const endAngleDeg = Math.atan2(unitY, unitX) * 180 / Math.PI;
    const startAngleDeg = Math.atan2(-unitY, -unitX) * 180 / Math.PI;
    return {
      pathD,
      hitPathD: fullHitPath,
      startTip,
      endTip,
      startAngleDeg,
      endAngleDeg,
      labelPoint: {
        x: (startTip.x + endTip.x) / 2,
        y: (startTip.y + endTip.y) / 2 - 10
      }
    };
  }

  // src/webview/state.svelte.ts
  var VizionWebviewStore = class {
    #expectedKind;
    get expectedKind() {
      return get(this.#expectedKind);
    }
    set expectedKind(value) {
      set(this.#expectedKind, value, true);
    }
    #documentVersion;
    get documentVersion() {
      return get(this.#documentVersion);
    }
    set documentVersion(value) {
      set(this.#documentVersion, value, true);
    }
    #isReadOnly;
    get isReadOnly() {
      return get(this.#isReadOnly);
    }
    set isReadOnly(value) {
      set(this.#isReadOnly, value, true);
    }
    #isEmptyDocument;
    get isEmptyDocument() {
      return get(this.#isEmptyDocument);
    }
    set isEmptyDocument(value) {
      set(this.#isEmptyDocument, value, true);
    }
    #canExplicitlyInitialize;
    get canExplicitlyInitialize() {
      return get(this.#canExplicitlyInitialize);
    }
    set canExplicitlyInitialize(value) {
      set(this.#canExplicitlyInitialize, value, true);
    }
    #valid;
    get valid() {
      return get(this.#valid);
    }
    set valid(value) {
      set(this.#valid, value, true);
    }
    #document;
    get document() {
      return get(this.#document);
    }
    set document(value) {
      set(this.#document, value, true);
    }
    #lastValidDocument;
    get lastValidDocument() {
      return get(this.#lastValidDocument);
    }
    set lastValidDocument(value) {
      set(this.#lastValidDocument, value, true);
    }
    #issues;
    get issues() {
      return get(this.#issues);
    }
    set issues(value) {
      set(this.#issues, value, true);
    }
    #hasUnsupportedConstructs;
    get hasUnsupportedConstructs() {
      return get(this.#hasUnsupportedConstructs);
    }
    set hasUnsupportedConstructs(value) {
      set(this.#hasUnsupportedConstructs, value, true);
    }
    #optimisticUmlLayouts;
    get optimisticUmlLayouts() {
      return get(this.#optimisticUmlLayouts);
    }
    set optimisticUmlLayouts(value) {
      set(this.#optimisticUmlLayouts, value, true);
    }
    #selectedIds;
    get selectedIds() {
      return get(this.#selectedIds);
    }
    set selectedIds(value) {
      set(this.#selectedIds, value, true);
    }
    #outlineSearchQuery;
    get outlineSearchQuery() {
      return get(this.#outlineSearchQuery);
    }
    set outlineSearchQuery(value) {
      set(this.#outlineSearchQuery, value, true);
    }
    #sidebarWidth;
    get sidebarWidth() {
      return get(this.#sidebarWidth);
    }
    set sidebarWidth(value) {
      set(this.#sidebarWidth, value, true);
    }
    #elementsPaneRatio;
    get elementsPaneRatio() {
      return get(this.#elementsPaneRatio);
    }
    set elementsPaneRatio(value) {
      set(this.#elementsPaneRatio, value, true);
    }
    #viewport;
    get viewport() {
      return get(this.#viewport);
    }
    set viewport(value) {
      set(this.#viewport, value, true);
    }
    #statusMessage;
    get statusMessage() {
      return get(this.#statusMessage);
    }
    set statusMessage(value) {
      set(this.#statusMessage, value, true);
    }
    #staleNotice;
    get staleNotice() {
      return get(this.#staleNotice);
    }
    set staleNotice(value) {
      set(this.#staleNotice, value, true);
    }
    #contextMenu;
    get contextMenu() {
      return get(this.#contextMenu);
    }
    set contextMenu(value) {
      set(this.#contextMenu, value, true);
    }
    #clipboard;
    get clipboard() {
      return get(this.#clipboard);
    }
    set clipboard(value) {
      set(this.#clipboard, value, true);
    }
    constructor(initialKind2) {
      this.#expectedKind = state("uml");
      this.#documentVersion = state(1);
      this.#isReadOnly = state(false);
      this.#isEmptyDocument = state(false);
      this.#canExplicitlyInitialize = state(false);
      this.#valid = state(true);
      this.#document = state(void 0);
      this.#lastValidDocument = state(void 0);
      this.#issues = state(proxy([]));
      this.#hasUnsupportedConstructs = state(false);
      this.#optimisticUmlLayouts = state(proxy({}));
      this.#selectedIds = state(proxy([]));
      this.#outlineSearchQuery = state("");
      this.#sidebarWidth = state(290);
      this.#elementsPaneRatio = state(0.4);
      this.#viewport = state(proxy({ panX: 40, panY: 40, zoom: 1 }));
      this.#statusMessage = state(null);
      this.#staleNotice = state(null);
      this.#contextMenu = state(null);
      this.#clipboard = state(null);
      this.requestCounter = 0;
      this.expectedKind = initialKind2;
      if (window.__VIZION_INITIAL_SNAPSHOT__) {
        this.applySnapshot(window.__VIZION_INITIAL_SNAPSHOT__);
      }
      window.addEventListener("message", (event2) => {
        this.handleHostMessage(event2.data);
      });
      postToHost({ type: "webview.ready" });
    }
    get umlDoc() {
      return this.document?.kind === "uml" ? this.document : void 0;
    }
    registerCanvasCallbacks(callbacks) {
      this.onFitContentCallback = callbacks.onFitContent;
      this.onResetZoomCallback = callbacks.onResetZoom;
      this.onRestoreFocusCallback = callbacks.onRestoreFocus;
      this.onExportSvgCallback = callbacks.onExportSvg;
    }
    applySnapshot(msg) {
      this.expectedKind = msg.expectedKind;
      this.documentVersion = msg.documentVersion;
      this.isReadOnly = msg.isReadOnly;
      this.isEmptyDocument = msg.isEmptyDocument;
      this.canExplicitlyInitialize = msg.canExplicitlyInitialize;
      this.valid = msg.valid;
      this.document = msg.document;
      this.lastValidDocument = msg.lastValidDocument;
      this.issues = msg.issues;
      this.hasUnsupportedConstructs = Boolean(msg.hasUnsupportedConstructs);
      this.optimisticUmlLayouts = {};
      if (msg.valid && msg.document) {
        const validIds = /* @__PURE__ */ new Set([
          ...msg.document.nodes.map((n) => n.id),
          ...msg.document.edges.map((e) => e.id)
        ]);
        const filtered = this.selectedIds.filter((id) => validIds.has(id));
        this.selectedIds = this.syncSelectionEdges(filtered);
      }
    }
    handleHostMessage(msg) {
      if (!msg || typeof msg !== "object") return;
      switch (msg.type) {
        case "host.snapshot": {
          this.applySnapshot(msg);
          break;
        }
        case "host.operationResult": {
          if (!msg.ok) {
            this.optimisticUmlLayouts = {};
            if (msg.staleRejected) {
              this.staleNotice = msg.error ?? "Document changed externally during gesture. View refreshed.";
            } else if (msg.error) {
              this.statusMessage = msg.error;
            }
          } else {
            this.staleNotice = null;
            if (msg.createdIds && msg.createdIds.length > 0) {
              this.selectedIds = this.syncSelectionEdges(msg.createdIds);
            }
          }
          break;
        }
        case "host.command": {
          if (msg.command === "fitContent") {
            this.onFitContentCallback?.();
          } else if (msg.command === "resetZoom") {
            this.onResetZoomCallback?.();
          } else if (msg.command === "restoreCanvasFocus") {
            this.onRestoreFocusCallback?.();
          } else if (msg.command === "requestSvgExport") {
            this.onExportSvgCallback?.();
          }
          break;
        }
      }
    }
    dispatchOperation(operation) {
      const requestId = `req-${++this.requestCounter}-${Date.now()}`;
      postToHost({
        type: "webview.operation",
        requestId,
        expectedDocumentVersion: this.documentVersion,
        operation
      });
      return requestId;
    }
    triggerUndo() {
      postToHost({ type: "webview.undo" });
    }
    triggerRedo() {
      postToHost({ type: "webview.redo" });
    }
    copySelection() {
      if (this.selectedIds.length === 0) return;
      if (this.umlDoc) {
        const nodeIds = this.umlDoc.nodes.filter((n) => this.selectedIds.includes(n.id)).map((n) => n.id);
        const edgeIds = this.umlDoc.edges.filter((e) => this.selectedIds.includes(e.id)).map((e) => e.id);
        if (nodeIds.length > 0 || edgeIds.length > 0) {
          this.clipboard = { kind: "uml", nodeIds, edgeIds, pasteCount: 0 };
        }
      }
    }
    pasteClipboard(stripCustomData = false) {
      if (this.isReadOnly || !this.clipboard) return;
      this.clipboard.pasteCount += 1;
      const step = this.clipboard.pasteCount * 20;
      if (this.clipboard.kind === "uml" && this.umlDoc) {
        this.dispatchOperation({
          type: "uml.duplicateSelection",
          nodeIds: this.clipboard.nodeIds,
          edgeIds: this.clipboard.edgeIds,
          offsetX: step,
          offsetY: step,
          stripCustomData
        });
      }
    }
    createQuickUmlNode(kind, worldX, worldY, shapeGeometry = "rectangle") {
      if (this.isReadOnly || !this.umlDoc) return;
      const existingCount = this.umlDoc.nodes.filter((n) => n.kind === kind).length + 1;
      const shapeLabel = UML_SHAPE_GEOMETRIES.find((g) => g.kind === shapeGeometry)?.label ?? "Shape";
      const defaultNameMap = {
        class: `Class${existingCount}`,
        note: `Note ${existingCount}`,
        shape: `${shapeLabel} ${existingCount}`
      };
      const name = defaultNameMap[kind];
      const id = `${kind}-${Date.now().toString(36).slice(-4)}-${existingCount}`;
      const rawX = worldX ?? Math.round((220 - this.viewport.panX) / this.viewport.zoom) + existingCount % 4 * 40;
      const rawY = worldY ?? Math.round((140 - this.viewport.panY) / this.viewport.zoom) + existingCount % 4 * 40;
      const x = snapToGrid(rawX, GRID_SIZE);
      const y = snapToGrid(rawY, GRID_SIZE);
      this.dispatchOperation({
        type: "uml.addNode",
        id,
        kind,
        name,
        x,
        y,
        text: kind === "note" ? "Design note..." : void 0,
        shape: kind === "shape" ? shapeGeometry : void 0
      });
    }
    openContextMenu(x, y, items, title) {
      const clampedX = Math.max(8, Math.min(x, window.innerWidth - 220));
      const clampedY = Math.max(8, Math.min(y, window.innerHeight - 260));
      this.contextMenu = { x: clampedX, y: clampedY, items, title };
    }
    closeContextMenu() {
      this.contextMenu = null;
    }
    syncSelectionEdges(baseIds, prevIds = this.selectedIds) {
      if (!this.umlDoc) return baseIds;
      const selectedSet = new Set(baseIds);
      const prevNodeIds = new Set(this.umlDoc.nodes.filter((n) => prevIds.includes(n.id)).map((n) => n.id));
      const nextNodeIds = new Set(this.umlDoc.nodes.filter((n) => selectedSet.has(n.id)).map((n) => n.id));
      const deselectedNodes = new Set([...prevNodeIds].filter((id) => !nextNodeIds.has(id)));
      for (const deselectedId of deselectedNodes) {
        for (const edge of this.umlDoc.edges) {
          if (edge.source.nodeId === deselectedId || edge.target.nodeId === deselectedId) {
            selectedSet.delete(edge.id);
          }
        }
      }
      if (nextNodeIds.size >= 2) {
        for (const edge of this.umlDoc.edges) {
          if (nextNodeIds.has(edge.source.nodeId) && nextNodeIds.has(edge.target.nodeId)) {
            selectedSet.add(edge.id);
          } else if (edge.source.nodeId && edge.target.nodeId && (!nextNodeIds.has(edge.source.nodeId) || !nextNodeIds.has(edge.target.nodeId))) {
            selectedSet.delete(edge.id);
          }
        }
      } else {
        for (const edge of this.umlDoc.edges) {
          if (selectedSet.has(edge.id) && (nextNodeIds.has(edge.source.nodeId) || nextNodeIds.has(edge.target.nodeId))) {
            selectedSet.delete(edge.id);
          }
        }
      }
      return Array.from(selectedSet);
    }
    setSelectedIds(ids) {
      this.selectedIds = this.syncSelectionEdges(ids, this.selectedIds);
    }
    selectSingle(id, additive = false) {
      let next2;
      if (additive) {
        if (this.selectedIds.includes(id)) {
          next2 = this.selectedIds.filter((x) => x !== id);
        } else {
          next2 = [...this.selectedIds, id];
        }
      } else {
        next2 = [id];
      }
      this.selectedIds = this.syncSelectionEdges(next2, this.selectedIds);
    }
    clearSelection() {
      this.selectedIds = [];
    }
    setViewport(next2) {
      const clampedZoom = Math.min(3, Math.max(0.2, next2.zoom));
      this.viewport = {
        panX: Math.round(next2.panX * 10) / 10,
        panY: Math.round(next2.panY * 10) / 10,
        zoom: Math.round(clampedZoom * 1e3) / 1e3
      };
    }
    setSidebarWidth(width) {
      this.sidebarWidth = Math.max(210, Math.min(560, Math.round(width)));
    }
    setElementsPaneRatio(ratio) {
      this.elementsPaneRatio = Math.max(0.12, Math.min(0.92, Math.round(ratio * 1e3) / 1e3));
    }
  };

  // node_modules/jsonc-parser/lib/esm/impl/scanner.js
  var CharacterCodes;
  (function(CharacterCodes2) {
    CharacterCodes2[CharacterCodes2["lineFeed"] = 10] = "lineFeed";
    CharacterCodes2[CharacterCodes2["carriageReturn"] = 13] = "carriageReturn";
    CharacterCodes2[CharacterCodes2["space"] = 32] = "space";
    CharacterCodes2[CharacterCodes2["_0"] = 48] = "_0";
    CharacterCodes2[CharacterCodes2["_1"] = 49] = "_1";
    CharacterCodes2[CharacterCodes2["_2"] = 50] = "_2";
    CharacterCodes2[CharacterCodes2["_3"] = 51] = "_3";
    CharacterCodes2[CharacterCodes2["_4"] = 52] = "_4";
    CharacterCodes2[CharacterCodes2["_5"] = 53] = "_5";
    CharacterCodes2[CharacterCodes2["_6"] = 54] = "_6";
    CharacterCodes2[CharacterCodes2["_7"] = 55] = "_7";
    CharacterCodes2[CharacterCodes2["_8"] = 56] = "_8";
    CharacterCodes2[CharacterCodes2["_9"] = 57] = "_9";
    CharacterCodes2[CharacterCodes2["a"] = 97] = "a";
    CharacterCodes2[CharacterCodes2["b"] = 98] = "b";
    CharacterCodes2[CharacterCodes2["c"] = 99] = "c";
    CharacterCodes2[CharacterCodes2["d"] = 100] = "d";
    CharacterCodes2[CharacterCodes2["e"] = 101] = "e";
    CharacterCodes2[CharacterCodes2["f"] = 102] = "f";
    CharacterCodes2[CharacterCodes2["g"] = 103] = "g";
    CharacterCodes2[CharacterCodes2["h"] = 104] = "h";
    CharacterCodes2[CharacterCodes2["i"] = 105] = "i";
    CharacterCodes2[CharacterCodes2["j"] = 106] = "j";
    CharacterCodes2[CharacterCodes2["k"] = 107] = "k";
    CharacterCodes2[CharacterCodes2["l"] = 108] = "l";
    CharacterCodes2[CharacterCodes2["m"] = 109] = "m";
    CharacterCodes2[CharacterCodes2["n"] = 110] = "n";
    CharacterCodes2[CharacterCodes2["o"] = 111] = "o";
    CharacterCodes2[CharacterCodes2["p"] = 112] = "p";
    CharacterCodes2[CharacterCodes2["q"] = 113] = "q";
    CharacterCodes2[CharacterCodes2["r"] = 114] = "r";
    CharacterCodes2[CharacterCodes2["s"] = 115] = "s";
    CharacterCodes2[CharacterCodes2["t"] = 116] = "t";
    CharacterCodes2[CharacterCodes2["u"] = 117] = "u";
    CharacterCodes2[CharacterCodes2["v"] = 118] = "v";
    CharacterCodes2[CharacterCodes2["w"] = 119] = "w";
    CharacterCodes2[CharacterCodes2["x"] = 120] = "x";
    CharacterCodes2[CharacterCodes2["y"] = 121] = "y";
    CharacterCodes2[CharacterCodes2["z"] = 122] = "z";
    CharacterCodes2[CharacterCodes2["A"] = 65] = "A";
    CharacterCodes2[CharacterCodes2["B"] = 66] = "B";
    CharacterCodes2[CharacterCodes2["C"] = 67] = "C";
    CharacterCodes2[CharacterCodes2["D"] = 68] = "D";
    CharacterCodes2[CharacterCodes2["E"] = 69] = "E";
    CharacterCodes2[CharacterCodes2["F"] = 70] = "F";
    CharacterCodes2[CharacterCodes2["G"] = 71] = "G";
    CharacterCodes2[CharacterCodes2["H"] = 72] = "H";
    CharacterCodes2[CharacterCodes2["I"] = 73] = "I";
    CharacterCodes2[CharacterCodes2["J"] = 74] = "J";
    CharacterCodes2[CharacterCodes2["K"] = 75] = "K";
    CharacterCodes2[CharacterCodes2["L"] = 76] = "L";
    CharacterCodes2[CharacterCodes2["M"] = 77] = "M";
    CharacterCodes2[CharacterCodes2["N"] = 78] = "N";
    CharacterCodes2[CharacterCodes2["O"] = 79] = "O";
    CharacterCodes2[CharacterCodes2["P"] = 80] = "P";
    CharacterCodes2[CharacterCodes2["Q"] = 81] = "Q";
    CharacterCodes2[CharacterCodes2["R"] = 82] = "R";
    CharacterCodes2[CharacterCodes2["S"] = 83] = "S";
    CharacterCodes2[CharacterCodes2["T"] = 84] = "T";
    CharacterCodes2[CharacterCodes2["U"] = 85] = "U";
    CharacterCodes2[CharacterCodes2["V"] = 86] = "V";
    CharacterCodes2[CharacterCodes2["W"] = 87] = "W";
    CharacterCodes2[CharacterCodes2["X"] = 88] = "X";
    CharacterCodes2[CharacterCodes2["Y"] = 89] = "Y";
    CharacterCodes2[CharacterCodes2["Z"] = 90] = "Z";
    CharacterCodes2[CharacterCodes2["asterisk"] = 42] = "asterisk";
    CharacterCodes2[CharacterCodes2["backslash"] = 92] = "backslash";
    CharacterCodes2[CharacterCodes2["closeBrace"] = 125] = "closeBrace";
    CharacterCodes2[CharacterCodes2["closeBracket"] = 93] = "closeBracket";
    CharacterCodes2[CharacterCodes2["colon"] = 58] = "colon";
    CharacterCodes2[CharacterCodes2["comma"] = 44] = "comma";
    CharacterCodes2[CharacterCodes2["dot"] = 46] = "dot";
    CharacterCodes2[CharacterCodes2["doubleQuote"] = 34] = "doubleQuote";
    CharacterCodes2[CharacterCodes2["minus"] = 45] = "minus";
    CharacterCodes2[CharacterCodes2["openBrace"] = 123] = "openBrace";
    CharacterCodes2[CharacterCodes2["openBracket"] = 91] = "openBracket";
    CharacterCodes2[CharacterCodes2["plus"] = 43] = "plus";
    CharacterCodes2[CharacterCodes2["slash"] = 47] = "slash";
    CharacterCodes2[CharacterCodes2["formFeed"] = 12] = "formFeed";
    CharacterCodes2[CharacterCodes2["tab"] = 9] = "tab";
  })(CharacterCodes || (CharacterCodes = {}));

  // node_modules/jsonc-parser/lib/esm/impl/string-intern.js
  var cachedSpaces = new Array(20).fill(0).map((_, index2) => {
    return " ".repeat(index2);
  });
  var maxCachedValues = 200;
  var cachedBreakLinesWithSpaces = {
    " ": {
      "\n": new Array(maxCachedValues).fill(0).map((_, index2) => {
        return "\n" + " ".repeat(index2);
      }),
      "\r": new Array(maxCachedValues).fill(0).map((_, index2) => {
        return "\r" + " ".repeat(index2);
      }),
      "\r\n": new Array(maxCachedValues).fill(0).map((_, index2) => {
        return "\r\n" + " ".repeat(index2);
      })
    },
    "	": {
      "\n": new Array(maxCachedValues).fill(0).map((_, index2) => {
        return "\n" + "	".repeat(index2);
      }),
      "\r": new Array(maxCachedValues).fill(0).map((_, index2) => {
        return "\r" + "	".repeat(index2);
      }),
      "\r\n": new Array(maxCachedValues).fill(0).map((_, index2) => {
        return "\r\n" + "	".repeat(index2);
      })
    }
  };

  // node_modules/jsonc-parser/lib/esm/impl/parser.js
  var ParseOptions;
  (function(ParseOptions2) {
    ParseOptions2.DEFAULT = {
      allowTrailingComma: false
    };
  })(ParseOptions || (ParseOptions = {}));

  // node_modules/jsonc-parser/lib/esm/main.js
  var ScanError;
  (function(ScanError2) {
    ScanError2[ScanError2["None"] = 0] = "None";
    ScanError2[ScanError2["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
    ScanError2[ScanError2["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
    ScanError2[ScanError2["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
    ScanError2[ScanError2["InvalidUnicode"] = 4] = "InvalidUnicode";
    ScanError2[ScanError2["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
    ScanError2[ScanError2["InvalidCharacter"] = 6] = "InvalidCharacter";
  })(ScanError || (ScanError = {}));
  var SyntaxKind;
  (function(SyntaxKind2) {
    SyntaxKind2[SyntaxKind2["OpenBraceToken"] = 1] = "OpenBraceToken";
    SyntaxKind2[SyntaxKind2["CloseBraceToken"] = 2] = "CloseBraceToken";
    SyntaxKind2[SyntaxKind2["OpenBracketToken"] = 3] = "OpenBracketToken";
    SyntaxKind2[SyntaxKind2["CloseBracketToken"] = 4] = "CloseBracketToken";
    SyntaxKind2[SyntaxKind2["CommaToken"] = 5] = "CommaToken";
    SyntaxKind2[SyntaxKind2["ColonToken"] = 6] = "ColonToken";
    SyntaxKind2[SyntaxKind2["NullKeyword"] = 7] = "NullKeyword";
    SyntaxKind2[SyntaxKind2["TrueKeyword"] = 8] = "TrueKeyword";
    SyntaxKind2[SyntaxKind2["FalseKeyword"] = 9] = "FalseKeyword";
    SyntaxKind2[SyntaxKind2["StringLiteral"] = 10] = "StringLiteral";
    SyntaxKind2[SyntaxKind2["NumericLiteral"] = 11] = "NumericLiteral";
    SyntaxKind2[SyntaxKind2["LineCommentTrivia"] = 12] = "LineCommentTrivia";
    SyntaxKind2[SyntaxKind2["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
    SyntaxKind2[SyntaxKind2["LineBreakTrivia"] = 14] = "LineBreakTrivia";
    SyntaxKind2[SyntaxKind2["Trivia"] = 15] = "Trivia";
    SyntaxKind2[SyntaxKind2["Unknown"] = 16] = "Unknown";
    SyntaxKind2[SyntaxKind2["EOF"] = 17] = "EOF";
  })(SyntaxKind || (SyntaxKind = {}));
  var ParseErrorCode;
  (function(ParseErrorCode2) {
    ParseErrorCode2[ParseErrorCode2["InvalidSymbol"] = 1] = "InvalidSymbol";
    ParseErrorCode2[ParseErrorCode2["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
    ParseErrorCode2[ParseErrorCode2["PropertyNameExpected"] = 3] = "PropertyNameExpected";
    ParseErrorCode2[ParseErrorCode2["ValueExpected"] = 4] = "ValueExpected";
    ParseErrorCode2[ParseErrorCode2["ColonExpected"] = 5] = "ColonExpected";
    ParseErrorCode2[ParseErrorCode2["CommaExpected"] = 6] = "CommaExpected";
    ParseErrorCode2[ParseErrorCode2["CloseBraceExpected"] = 7] = "CloseBraceExpected";
    ParseErrorCode2[ParseErrorCode2["CloseBracketExpected"] = 8] = "CloseBracketExpected";
    ParseErrorCode2[ParseErrorCode2["EndOfFileExpected"] = 9] = "EndOfFileExpected";
    ParseErrorCode2[ParseErrorCode2["InvalidCommentToken"] = 10] = "InvalidCommentToken";
    ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
    ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
    ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
    ParseErrorCode2[ParseErrorCode2["InvalidUnicode"] = 14] = "InvalidUnicode";
    ParseErrorCode2[ParseErrorCode2["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
    ParseErrorCode2[ParseErrorCode2["InvalidCharacter"] = 16] = "InvalidCharacter";
  })(ParseErrorCode || (ParseErrorCode = {}));

  // src/shared/operations/index.ts
  function formatVisibilitySign(vis) {
    switch (vis ?? "+") {
      case "+":
        return "\uFF0B";
      case "-":
        return "\uFF0D";
      case "#":
        return "#";
      case "~":
        return "~";
    }
  }
  function extractOperationParameters(op) {
    if (Array.isArray(op.parameters)) {
      return op.parameters;
    }
    const sig = (op.signature ?? "").trim();
    const inner = sig.replace(/^\(/, "").replace(/\)$/, "").trim();
    if (!inner) {
      return [];
    }
    return inner.split(",").map((part, idx) => {
      const trimmed = part.trim();
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx === -1) {
        return {
          id: `${op.id}-param-${idx + 1}`,
          name: trimmed,
          type: ""
        };
      }
      return {
        id: `${op.id}-param-${idx + 1}`,
        name: trimmed.slice(0, colonIdx).trim(),
        type: trimmed.slice(colonIdx + 1).trim()
      };
    }).filter((p) => p.name.length > 0);
  }
  function buildOperationSignature(params) {
    const formatted = params.filter((p) => p.name.trim().length > 0).map((p) => p.type && p.type.trim().length > 0 ? `${p.name.trim()}: ${p.type.trim()}` : p.name.trim());
    return `(${formatted.join(", ")})`;
  }

  // src/webview/common/VisibilityPicker.svelte
  var root3 = from_html(`<button type="button" role="menuitem"><span class="vz-vis-popup-sym"> </span> <span> </span></button>`);
  var root_13 = from_html(`<div class="vz-vis-backdrop"></div> <div class="vz-vis-popup" role="menu"></div>`, 1);
  var root_23 = from_html(`<div class="vz-vis-picker-wrap"><button type="button"><span class="vz-vis-symbol"> </span></button> <!></div>`);
  function VisibilityPicker($$anchor, $$props) {
    push($$props, true);
    let value = prop($$props, "value", 3, "+"), disabled = prop($$props, "disabled", 3, false), ariaLabel = prop($$props, "ariaLabel", 3, "Visibility"), compact = prop($$props, "compact", 3, false);
    let open = state(false);
    const options = [
      { symbol: "+", display: "\uFF0B", label: "Public" },
      { symbol: "-", display: "\uFF0D", label: "Private" },
      { symbol: "#", display: "#", label: "Protected" },
      { symbol: "~", display: "~", label: "Package" }
    ];
    var div = root_23();
    var button = child(div);
    let classes;
    var span = child(button);
    var text2 = only_child(span, true);
    reset(button);
    var node = sibling(button, 2);
    {
      var consequent = ($$anchor2) => {
        var fragment = root_13();
        var div_1 = first_child(fragment);
        var div_2 = sibling(div_1, 2);
        each(div_2, 21, () => options, (opt) => opt.symbol, ($$anchor3, opt) => {
          var button_1 = root3();
          let classes_1;
          var span_1 = child(button_1);
          var text_1 = only_child(span_1, true);
          var span_2 = sibling(span_1, 2);
          var text_2 = only_child(span_2, true);
          reset(button_1);
          template_effect(() => {
            classes_1 = set_class(button_1, 1, "vz-vis-popup-item", null, classes_1, { active: get(opt).symbol === value() });
            set_text(text_1, get(opt).display);
            set_text(text_2, get(opt).label);
          });
          delegated("click", button_1, (e) => {
            e.stopPropagation();
            set(open, false);
            $$props.onSelect(get(opt).symbol);
          });
          append($$anchor3, button_1);
        });
        reset(div_2);
        delegated("click", div_1, (e) => {
          e.stopPropagation();
          set(open, false);
        });
        append($$anchor2, fragment);
      };
      if_block(node, ($$render) => {
        if (get(open)) $$render(consequent);
      });
    }
    reset(div);
    template_effect(
      ($0) => {
        classes = set_class(button, 1, "vz-vis-picker-btn", null, classes, { compact: compact() });
        set_attribute2(button, "aria-label", ariaLabel());
        set_attribute2(button, "aria-expanded", get(open));
        button.disabled = disabled();
        set_text(text2, $0);
      },
      [() => formatVisibilitySign(value())]
    );
    delegated("click", button, (e) => {
      e.stopPropagation();
      if (!disabled()) set(open, !get(open));
    });
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);

  // src/webview/common/AccessibleOutline.svelte
  var itemIcon = ($$anchor, item = noop) => {
    var svg = root_19();
    var node = child(svg);
    {
      var consequent_10 = ($$anchor2) => {
        const v = user_derived(() => item().edgeVisual);
        const hasLeftShape = user_derived(() => get(v).startShape === "diamond" || get(v).startShape === "circle" || get(v).startShape === "square" || get(v).startShape === "triangle");
        const hasRightShape = user_derived(() => get(v).endShape === "diamond" || get(v).endShape === "circle" || get(v).endShape === "square" || get(v).endShape === "triangle");
        const startX = user_derived(() => get(hasLeftShape) ? 6 : 1.5);
        const endX = user_derived(() => get(hasRightShape) ? 10 : 14.5);
        var fragment = root_10();
        var line_1 = first_child(fragment);
        var node_1 = sibling(line_1);
        {
          var consequent = ($$anchor3) => {
            var polygon = root4();
            template_effect(() => set_attribute2(polygon, "fill", get(v).startFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, polygon);
          };
          var consequent_1 = ($$anchor3) => {
            var circle = root_14();
            template_effect(() => set_attribute2(circle, "fill", get(v).startFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, circle);
          };
          var consequent_2 = ($$anchor3) => {
            var rect = root_24();
            template_effect(() => set_attribute2(rect, "fill", get(v).startFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, rect);
          };
          var consequent_3 = ($$anchor3) => {
            var polygon_1 = root_33();
            template_effect(() => set_attribute2(polygon_1, "fill", get(v).startFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, polygon_1);
          };
          var consequent_4 = ($$anchor3) => {
            var path = root_43();
            append($$anchor3, path);
          };
          if_block(node_1, ($$render) => {
            if (get(v).startShape === "diamond") $$render(consequent);
            else if (get(v).startShape === "circle") $$render(consequent_1, 1);
            else if (get(v).startShape === "square") $$render(consequent_2, 2);
            else if (get(v).startShape === "triangle") $$render(consequent_3, 3);
            else if (get(v).startShape === "open-arrow") $$render(consequent_4, 4);
          });
        }
        var node_2 = sibling(node_1);
        {
          var consequent_5 = ($$anchor3) => {
            var polygon_2 = root_52();
            template_effect(() => set_attribute2(polygon_2, "fill", get(v).endFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, polygon_2);
          };
          var consequent_6 = ($$anchor3) => {
            var circle_1 = root_62();
            template_effect(() => set_attribute2(circle_1, "fill", get(v).endFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, circle_1);
          };
          var consequent_7 = ($$anchor3) => {
            var rect_1 = root_72();
            template_effect(() => set_attribute2(rect_1, "fill", get(v).endFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, rect_1);
          };
          var consequent_8 = ($$anchor3) => {
            var polygon_3 = root_8();
            template_effect(() => set_attribute2(polygon_3, "fill", get(v).endFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, polygon_3);
          };
          var consequent_9 = ($$anchor3) => {
            var path_1 = root_9();
            append($$anchor3, path_1);
          };
          if_block(node_2, ($$render) => {
            if (get(v).endShape === "diamond") $$render(consequent_5);
            else if (get(v).endShape === "circle") $$render(consequent_6, 1);
            else if (get(v).endShape === "square") $$render(consequent_7, 2);
            else if (get(v).endShape === "triangle") $$render(consequent_8, 3);
            else if (get(v).endShape === "open-arrow") $$render(consequent_9, 4);
          });
        }
        template_effect(() => {
          set_attribute2(line_1, "x1", get(startX));
          set_attribute2(line_1, "x2", get(endX));
          set_attribute2(line_1, "stroke-dasharray", get(v).line === "dashed" ? "2 1.5" : void 0);
        });
        append($$anchor2, fragment);
      };
      var consequent_11 = ($$anchor2) => {
        var fragment_1 = root_11();
        next(2);
        append($$anchor2, fragment_1);
      };
      var consequent_12 = ($$anchor2) => {
        var fragment_2 = root_122();
        next(3);
        append($$anchor2, fragment_2);
      };
      var consequent_13 = ($$anchor2) => {
        var rect_2 = root_132();
        append($$anchor2, rect_2);
      };
      var consequent_14 = ($$anchor2) => {
        var ellipse = root_142();
        append($$anchor2, ellipse);
      };
      var consequent_15 = ($$anchor2) => {
        var polygon_4 = root_15();
        append($$anchor2, polygon_4);
      };
      var consequent_16 = ($$anchor2) => {
        var polygon_5 = root_16();
        append($$anchor2, polygon_5);
      };
      var consequent_17 = ($$anchor2) => {
        var polygon_6 = root_17();
        append($$anchor2, polygon_6);
      };
      var alternate = ($$anchor2) => {
        var rect_3 = root_18();
        append($$anchor2, rect_3);
      };
      if_block(node, ($$render) => {
        if (item().isEdge && item().edgeVisual) $$render(consequent_10);
        else if (item().iconKey === "class") $$render(consequent_11, 1);
        else if (item().iconKey === "note") $$render(consequent_12, 2);
        else if (item().iconKey === "rectangle") $$render(consequent_13, 3);
        else if (item().iconKey === "ellipse") $$render(consequent_14, 4);
        else if (item().iconKey === "rhombus") $$render(consequent_15, 5);
        else if (item().iconKey === "trapezoid") $$render(consequent_16, 6);
        else if (item().iconKey === "parallelogram") $$render(consequent_17, 7);
        else $$render(alternate, -1);
      });
    }
    reset(svg);
    append($$anchor, svg);
  };
  var root4 = from_svg(`<polygon points="1,8 3.5,5.5 6,8 3.5,10.5" stroke-width="1.2"></polygon>`);
  var root_14 = from_svg(`<circle cx="3.5" cy="8" r="2.5" stroke-width="1.2"></circle>`);
  var root_24 = from_svg(`<rect x="1" y="5.5" width="5" height="5" stroke-width="1.2"></rect>`);
  var root_33 = from_svg(`<polygon points="6,5 1,8 6,11" stroke-width="1.2"></polygon>`);
  var root_43 = from_svg(`<path d="M5 5.5 L1.5 8 L5 10.5" stroke-width="1.3"></path>`);
  var root_52 = from_svg(`<polygon points="10,8 12.5,5.5 15,8 12.5,10.5" stroke-width="1.2"></polygon>`);
  var root_62 = from_svg(`<circle cx="12.5" cy="8" r="2.5" stroke-width="1.2"></circle>`);
  var root_72 = from_svg(`<rect x="10" y="5.5" width="5" height="5" stroke-width="1.2"></rect>`);
  var root_8 = from_svg(`<polygon points="10,5 15,8 10,11" stroke-width="1.2"></polygon>`);
  var root_9 = from_svg(`<path d="M11 5.5 L14.5 8 L11 10.5" stroke-width="1.3"></path>`);
  var root_10 = from_svg(`<line y1="8" y2="8" stroke-width="1.3"></line><!><!>`, 1);
  var root_11 = from_svg(`<rect x="2" y="2" width="12" height="12" rx="1.5" stroke-width="1.3"></rect><line x1="2" y1="6" x2="14" y2="6" stroke-width="1.1"></line><line x1="2" y1="10" x2="14" y2="10" stroke-width="1.1"></line>`, 1);
  var root_122 = from_svg(`<path d="M3 2 h7 l3 3 v8 a1 1 0 0 1 -1 1 h-9 a1 1 0 0 1 -1 -1 v-10 a1 1 0 0 1 1 -1 z" stroke-width="1.3"></path><path d="M10 2 v3 h3" stroke-width="1.1"></path><line x1="5" y1="8" x2="11" y2="8" stroke-width="1"></line><line x1="5" y1="11" x2="9" y2="11" stroke-width="1"></line>`, 1);
  var root_132 = from_svg(`<rect x="2" y="3.5" width="12" height="9" rx="1" stroke-width="1.3"></rect>`);
  var root_142 = from_svg(`<ellipse cx="8" cy="8" rx="6" ry="4.5" stroke-width="1.3"></ellipse>`);
  var root_15 = from_svg(`<polygon points="8,2 14,8 8,14 2,8" stroke-width="1.3"></polygon>`);
  var root_16 = from_svg(`<polygon points="4.5,4 11.5,4 13.5,12 2.5,12" stroke-width="1.3"></polygon>`);
  var root_17 = from_svg(`<polygon points="4.5,4 13.5,4 11.5,12 2.5,12" stroke-width="1.3"></polygon>`);
  var root_18 = from_svg(`<rect x="2" y="2" width="12" height="12" rx="2" stroke-width="1.3"></rect>`);
  var root_19 = from_svg(`<svg class="vz-outline-icon-svg" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><!></svg>`);
  var root_20 = from_html(`<button type="button" class="vz-add-dropdown-item" role="menuitem"><span> </span> <kbd class="vz-kbd"> </kbd></button>`);
  var root_21 = from_html(`<button type="button" class="vz-add-dropdown-item" role="menuitem"><span> </span></button>`);
  var root_222 = from_html(`<div class="vz-add-dropdown" role="menu"><!> <div class="vz-context-divider"></div> <div class="vz-dropdown-section-label">Shapes</div> <!></div>`);
  var root_232 = from_html(`<div class="vz-add-dropdown-wrap"><button type="button" class="vz-plus-btn" title="Add New UML Element" aria-label="Add New UML Element">\uFF0B</button> <!></div>`);
  var root_242 = from_html(`No elements yet. Click <strong>\uFF0B</strong> or right-click the canvas to add one.`, 1);
  var root_25 = from_html(`<div class="vz-empty-hint"><!></div>`);
  var root_26 = from_html(`<span></span> <span class="vz-outline-edge-label"> </span> <span></span>`, 1);
  var root_27 = from_html(`<span></span>`);
  var root_28 = from_html(`<div class="vz-outline-edge-row"><span class="vz-outline-endpoint"> </span> <span class="vz-outline-connector" aria-hidden="true"><!></span> <span class="vz-outline-endpoint"> </span></div>`);
  var root_29 = from_html(`<span class="vz-outline-stereotype"> </span>`);
  var root_30 = from_html(`<span class="vz-outline-label"> </span> <!>`, 1);
  var root_31 = from_html(`<li role="option"><button type="button"><span class="vz-outline-icon" aria-hidden="true"><!></span> <!></button></li>`);
  var root_322 = from_html(`<ul class="vz-outline-list" role="listbox" aria-label="Diagram elements"></ul>`);
  var root_332 = from_html(`<section class="vz-outline-section" aria-label="Elements List"><div class="vz-outline-header"><span class="vz-sidebar-title"> </span> <!></div> <div class="vz-outline-search-row"><input type="search" class="vz-input" placeholder="Search elements or \xABstereotypes\xBB\u2026" aria-label="Search elements"/></div> <!></section>  <div class="vz-section-splitter" role="separator" aria-orientation="horizontal" aria-label="Resize Elements and Inspector sections" tabindex="0"></div>`, 1);
  function AccessibleOutline($$anchor, $$props) {
    push($$props, true);
    let store = prop($$props, "store", 7);
    let outlineSectionEl = state(void 0);
    let showAddMenu = state(false);
    let addDropdownWrapEl = state(void 0);
    let resizingVertical = state(null);
    function handleWindowPointerDown(e) {
      if (!get(showAddMenu)) return;
      if (get(addDropdownWrapEl) && !get(addDropdownWrapEl).contains(e.target)) {
        set(showAddMenu, false);
      }
    }
    function handleWindowKeyDown(e) {
      if (e.key === "Escape" && get(showAddMenu)) {
        set(showAddMenu, false);
      }
    }
    const umlCreationOptions = [
      { kind: "class", label: "Class", shortcut: "Alt+C" },
      { kind: "note", label: "Note", shortcut: "Alt+N" }
    ];
    const allItems = user_derived(() => {
      if (store().umlDoc) {
        const nodeMap = new Map(store().umlDoc.nodes.map((n) => [n.id, n]));
        const nodeItems = store().umlDoc.nodes.map((n) => {
          const desc = getUmlNodeKind(n.kind);
          const stereotype = n.kind === "note" ? "" : n.stereotype || desc?.defaultStereotype || "";
          const iconKey = n.kind === "shape" && n.shape ? n.shape : n.kind;
          const label = n.name || n.id;
          return {
            id: n.id,
            isEdge: false,
            label,
            stereotype,
            iconKey,
            iconTitle: n.kind === "shape" ? `Shape: ${n.shape}` : `Node: ${n.kind}`,
            tooltip: stereotype ? `${label} \xAB${stereotype}\xBB` : label,
            contextLabel: label
          };
        });
        const edgeItems = store().umlDoc.edges.map((e) => {
          const sourceNode = nodeMap.get(e.source.nodeId);
          const targetNode = nodeMap.get(e.target.nodeId);
          const sourceName = sourceNode?.name || e.source.nodeId;
          const targetName = targetNode?.name || e.target.nodeId;
          const edgeLabel = e.label?.trim() || "";
          const preset = getUmlRelationPreset(e.kind);
          const touchesNote = sourceNode?.kind === "note" || targetNode?.kind === "note";
          const defaultLine = touchesNote ? "dashed" : preset?.line ?? "solid";
          const line = e.visual?.line ?? defaultLine;
          const isDashed = line === "dashed";
          const startShape = e.visual?.start?.shape ?? preset?.start?.shape ?? "none";
          const startFill = e.visual?.start?.fill ?? preset?.start?.fill ?? "hollow";
          const endShape = e.visual?.end?.shape ?? preset?.end?.shape ?? "none";
          const endFill = e.visual?.end?.fill ?? preset?.end?.fill ?? "hollow";
          const repr = edgeLabel ? `${sourceName} \u2500\u2500 ${edgeLabel} \u2500\u2500 ${targetName}` : `${sourceName} \u2500\u2500 ${targetName}`;
          return {
            id: e.id,
            isEdge: true,
            sourceName,
            targetName,
            edgeLabel,
            edgeKind: e.kind,
            isDashed,
            edgeVisual: { line, isDashed, startShape, startFill, endShape, endFill },
            label: repr,
            stereotype: "",
            iconKey: e.kind,
            iconTitle: `Relation: ${e.kind} (${line})`,
            tooltip: repr,
            contextLabel: repr
          };
        });
        return [...nodeItems, ...edgeItems];
      }
      return [];
    });
    const filteredItems = user_derived(() => {
      const q = store().outlineSearchQuery.trim().toLowerCase();
      if (!q) return get(allItems);
      return get(allItems).filter((item) => {
        if (item.isEdge) {
          return item.sourceName.toLowerCase().includes(q) || item.targetName.toLowerCase().includes(q) || item.edgeLabel.toLowerCase().includes(q) || item.edgeKind.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
        }
        return item.label.toLowerCase().includes(q) || item.stereotype.toLowerCase().includes(q) || `\xAB${item.stereotype.toLowerCase()}\xBB`.includes(q) || item.iconKey.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
      });
    });
    function openItemContextMenu(e, itemId, itemLabel) {
      e.preventDefault();
      e.stopPropagation();
      store().selectSingle(itemId, false);
      store().openContextMenu(
        e.clientX,
        e.clientY,
        [
          {
            label: "Copy",
            shortcut: "Ctrl+C",
            action: () => store().copySelection()
          },
          {
            label: "Duplicate",
            shortcut: "Ctrl+D",
            action: () => $$props.onDuplicateSelected()
          },
          {
            label: "Paste as new",
            shortcut: "Ctrl+Shift+V",
            action: () => {
              store().copySelection();
              store().pasteClipboard(true);
            }
          },
          {
            label: "Delete",
            shortcut: "Del",
            danger: true,
            dividerBefore: true,
            action: () => $$props.onDeleteSelected()
          }
        ],
        itemLabel
      );
    }
    function handleSplitterPointerDown(e) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget?.setPointerCapture?.(e.pointerId);
      const parentSidebar = get(outlineSectionEl)?.parentElement;
      const sidebarHeight = Math.max(200, parentSidebar?.clientHeight ?? 600);
      set(
        resizingVertical,
        {
          startY: e.clientY,
          initialRatio: store().elementsPaneRatio,
          sidebarHeight
        },
        true
      );
    }
    function handleWindowPointerMove(e) {
      if (!get(resizingVertical)) return;
      const dy = e.clientY - get(resizingVertical).startY;
      const deltaRatio = dy / get(resizingVertical).sidebarHeight;
      store().setElementsPaneRatio(get(resizingVertical).initialRatio + deltaRatio);
    }
    function handleWindowPointerUp() {
      if (get(resizingVertical)) {
        set(resizingVertical, null);
      }
    }
    var fragment_3 = root_332();
    event("pointerdown", $window, handleWindowPointerDown);
    event("pointermove", $window, handleWindowPointerMove);
    event("pointerup", $window, handleWindowPointerUp);
    event("keydown", $window, handleWindowKeyDown);
    var section = first_child(fragment_3);
    var div = child(section);
    var span = child(div);
    var text2 = only_child(span);
    var node_3 = sibling(span, 2);
    {
      var consequent_19 = ($$anchor2) => {
        var div_1 = root_232();
        var button = child(div_1);
        var node_4 = sibling(button, 2);
        {
          var consequent_18 = ($$anchor3) => {
            var div_2 = root_222();
            var node_5 = child(div_2);
            each(node_5, 17, () => umlCreationOptions, (opt) => opt.kind, ($$anchor4, opt) => {
              var button_1 = root_20();
              var span_1 = child(button_1);
              var text_1 = only_child(span_1, true);
              var kbd = sibling(span_1, 2);
              var text_2 = only_child(kbd, true);
              reset(button_1);
              template_effect(() => {
                set_text(text_1, get(opt).label);
                set_text(text_2, get(opt).shortcut);
              });
              delegated("click", button_1, () => {
                set(showAddMenu, false);
                store().createQuickUmlNode(get(opt).kind);
              });
              append($$anchor4, button_1);
            });
            var node_6 = sibling(node_5, 6);
            each(node_6, 17, () => UML_SHAPE_GEOMETRIES, (sh) => sh.kind, ($$anchor4, sh) => {
              var button_2 = root_21();
              var span_2 = child(button_2);
              var text_3 = only_child(span_2, true);
              reset(button_2);
              template_effect(() => set_text(text_3, get(sh).label));
              delegated("click", button_2, () => {
                set(showAddMenu, false);
                store().createQuickUmlNode("shape", void 0, void 0, get(sh).kind);
              });
              append($$anchor4, button_2);
            });
            reset(div_2);
            append($$anchor3, div_2);
          };
          if_block(node_4, ($$render) => {
            if (get(showAddMenu)) $$render(consequent_18);
          });
        }
        reset(div_1);
        bind_this(div_1, ($$value) => set(addDropdownWrapEl, $$value), () => get(addDropdownWrapEl));
        template_effect(() => set_attribute2(button, "aria-expanded", get(showAddMenu)));
        delegated("click", button, () => {
          set(showAddMenu, !get(showAddMenu));
        });
        append($$anchor2, div_1);
      };
      if_block(node_3, ($$render) => {
        if (store().expectedKind === "uml" && !store().isReadOnly) $$render(consequent_19);
      });
    }
    reset(div);
    var div_3 = sibling(div, 2);
    var input = child(div_3);
    remove_input_defaults(input);
    reset(div_3);
    var node_7 = sibling(div_3, 2);
    {
      var consequent_21 = ($$anchor2) => {
        var div_4 = root_25();
        var node_8 = child(div_4);
        {
          var consequent_20 = ($$anchor3) => {
            var text_4 = text();
            template_effect(() => set_text(text_4, `No matching elements for "${store().outlineSearchQuery ?? ""}".`));
            append($$anchor3, text_4);
          };
          var d = user_derived(() => store().outlineSearchQuery.trim());
          var alternate_1 = ($$anchor3) => {
            var fragment_5 = root_242();
            next(2);
            append($$anchor3, fragment_5);
          };
          if_block(node_8, ($$render) => {
            if (get(d)) $$render(consequent_20);
            else $$render(alternate_1, -1);
          });
        }
        reset(div_4);
        append($$anchor2, div_4);
      };
      var alternate_4 = ($$anchor2) => {
        var ul = root_322();
        each(ul, 21, () => get(filteredItems), (item) => item.id, ($$anchor3, item) => {
          const isSelected = user_derived(() => store().selectedIds.includes(get(item).id));
          var li = root_31();
          var button_3 = child(li);
          let classes;
          var span_3 = child(button_3);
          var node_9 = child(span_3);
          itemIcon(node_9, () => get(item));
          reset(span_3);
          var node_10 = sibling(span_3, 2);
          {
            var consequent_23 = ($$anchor4) => {
              var div_5 = root_28();
              var span_4 = child(div_5);
              var text_5 = only_child(span_4, true);
              var span_5 = sibling(span_4, 2);
              var node_11 = child(span_5);
              {
                var consequent_22 = ($$anchor5) => {
                  var fragment_6 = root_26();
                  var span_6 = first_child(fragment_6);
                  let classes_1;
                  var span_7 = sibling(span_6, 2);
                  var text_6 = only_child(span_7, true);
                  var span_8 = sibling(span_7, 2);
                  let classes_2;
                  template_effect(() => {
                    classes_1 = set_class(span_6, 1, "vz-outline-connector-line", null, classes_1, { dashed: get(item).isDashed });
                    set_attribute2(span_7, "title", get(item).edgeLabel);
                    set_text(text_6, get(item).edgeLabel);
                    classes_2 = set_class(span_8, 1, "vz-outline-connector-line", null, classes_2, { dashed: get(item).isDashed });
                  });
                  append($$anchor5, fragment_6);
                };
                var alternate_2 = ($$anchor5) => {
                  var span_9 = root_27();
                  let classes_3;
                  template_effect(() => classes_3 = set_class(span_9, 1, "vz-outline-connector-line", null, classes_3, { dashed: get(item).isDashed }));
                  append($$anchor5, span_9);
                };
                if_block(node_11, ($$render) => {
                  if (get(item).edgeLabel) $$render(consequent_22);
                  else $$render(alternate_2, -1);
                });
              }
              reset(span_5);
              var span_10 = sibling(span_5, 2);
              var text_7 = only_child(span_10, true);
              reset(div_5);
              template_effect(() => {
                set_attribute2(span_4, "title", get(item).sourceName);
                set_text(text_5, get(item).sourceName);
                set_attribute2(span_10, "title", get(item).targetName);
                set_text(text_7, get(item).targetName);
              });
              append($$anchor4, div_5);
            };
            var alternate_3 = ($$anchor4) => {
              var fragment_7 = root_30();
              var span_11 = first_child(fragment_7);
              var text_8 = only_child(span_11, true);
              var node_12 = sibling(span_11, 2);
              {
                var consequent_24 = ($$anchor5) => {
                  var span_12 = root_29();
                  var text_9 = only_child(span_12);
                  template_effect(() => set_text(text_9, `\xAB${get(item).stereotype ?? ""}\xBB`));
                  append($$anchor5, span_12);
                };
                if_block(node_12, ($$render) => {
                  if (get(item).stereotype) $$render(consequent_24);
                });
              }
              template_effect(() => set_text(text_8, get(item).label));
              append($$anchor4, fragment_7);
            };
            if_block(node_10, ($$render) => {
              if (get(item).isEdge) $$render(consequent_23);
              else $$render(alternate_3, -1);
            });
          }
          reset(button_3);
          reset(li);
          template_effect(() => {
            set_attribute2(li, "aria-selected", get(isSelected));
            classes = set_class(button_3, 1, "vz-outline-item", null, classes, { selected: get(isSelected) });
            set_attribute2(button_3, "title", get(item).tooltip);
            set_attribute2(span_3, "title", get(item).iconTitle);
          });
          delegated("click", button_3, (e) => store().selectSingle(get(item).id, e.shiftKey || e.metaKey || e.ctrlKey));
          delegated("contextmenu", button_3, (e) => openItemContextMenu(e, get(item).id, get(item).contextLabel));
          append($$anchor3, li);
        });
        reset(ul);
        append($$anchor2, ul);
      };
      if_block(node_7, ($$render) => {
        if (get(filteredItems).length === 0) $$render(consequent_21);
        else $$render(alternate_4, -1);
      });
    }
    reset(section);
    bind_this(section, ($$value) => set(outlineSectionEl, $$value), () => get(outlineSectionEl));
    var div_6 = sibling(section, 2);
    template_effect(() => {
      set_style(section, `height: ${store().elementsPaneRatio * 100}%;`);
      set_text(text2, `Elements (${get(filteredItems).length ?? ""})`);
    });
    bind_value(input, () => store().outlineSearchQuery, ($$value) => store().outlineSearchQuery = $$value);
    delegated("pointerdown", div_6, handleSplitterPointerDown);
    append($$anchor, fragment_3);
    pop();
  }
  delegate(["click", "contextmenu", "pointerdown"]);

  // src/webview/uml/UmlInspector.svelte
  var eyeIcon = ($$anchor, visible = noop) => {
    var fragment = comment();
    var node_1 = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var svg = root5();
        append($$anchor2, svg);
      };
      var alternate = ($$anchor2) => {
        var svg_1 = root_110();
        append($$anchor2, svg_1);
      };
      if_block(node_1, ($$render) => {
        if (visible()) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    append($$anchor, fragment);
  };
  var root5 = from_svg(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`);
  var root_110 = from_svg(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`);
  var root_210 = from_html(`<div class="vz-warning-box">Unsupported node kind <code> </code>. Shown in non-destructive read-only fallback mode.</div>`);
  var root_34 = from_html(`<label class="vz-field"><span class="vz-field-label">Note Content</span> <textarea class="vz-textarea" rows="4"></textarea></label>`);
  var root_44 = from_html(`<option> </option>`);
  var root_53 = from_html(`<label class="vz-field"><span class="vz-field-label">Stereotype (optional)</span> <input type="text" class="vz-input" placeholder="e.g. process, decision, actor"/></label> <label class="vz-field"><span class="vz-field-label">Shape Geometry</span> <select class="vz-select" aria-label="Shape geometry"></select></label>`, 1);
  var root_63 = from_html(`<div class="vz-member-row"><!> <input type="text" class="vz-input-mini" aria-label="Attribute name"/> <input type="text" class="vz-input-mini" aria-label="Attribute type" placeholder="type"/> <button type="button" class="vz-icon-btn vz-danger-btn vz-square-del-btn" aria-label="Remove attribute">\xD7</button></div>`);
  var root_73 = from_html(`<!> <button type="button" class="vz-inline-add-btn">\uFF0B Attribute</button>`, 1);
  var root_82 = from_html(`<div class="vz-param-row"><input type="text" class="vz-input-mini" aria-label="Argument name" placeholder="argName"/> <input type="text" class="vz-input-mini" aria-label="Argument type" placeholder="argType"/> <button type="button" class="vz-icon-btn vz-danger-btn vz-square-del-btn" aria-label="Remove argument">\xD7</button></div>`);
  var root_92 = from_html(`<div class="vz-operation-card"><div class="vz-member-row"><!> <input type="text" class="vz-input-mini" aria-label="Operation name"/> <input type="text" class="vz-input-mini" aria-label="Return type" placeholder="return"/> <button type="button" class="vz-icon-btn vz-danger-btn vz-square-del-btn" aria-label="Remove operation">\xD7</button></div> <div class="vz-op-params-section"><div class="vz-op-params-title"> </div> <!> <button type="button" class="vz-inline-add-btn vz-param-add-btn">\uFF0B Argument</button></div></div>`);
  var root_102 = from_html(`<!> <button type="button" class="vz-inline-add-btn">\uFF0B Operation</button>`, 1);
  var root_112 = from_html(`<label class="vz-field"><span class="vz-field-label">Stereotype (optional)</span> <input type="text" class="vz-input" placeholder="e.g. entity, service, aggregate"/></label> <div><div class="vz-compartment-header"><span> </span> <button type="button"><!></button></div> <!></div> <div><div class="vz-compartment-header"><span> </span> <button type="button"><!></button></div> <!></div>`, 1);
  var root_123 = from_html(`<label class="vz-field"><span class="vz-field-label">Name</span> <input type="text" class="vz-input"/></label> <!>`, 1);
  var root_133 = from_html(`<div class="vz-sidebar-header"><span class="vz-sidebar-title"> </span></div> <div class="vz-inspector-body"><!></div>`, 1);
  var root_143 = from_html(`<label class="vz-field"><span class="vz-field-label">Fill</span> <select class="vz-select"><option>Hollow</option><option>Filled</option></select></label>`);
  var root_152 = from_html(`<div class="vz-endpoint-box"><div class="vz-compartment-header"><span> </span></div> <label class="vz-field"><span class="vz-field-label">Multiplicity (optional)</span> <input type="text" class="vz-input" placeholder="e.g. 1, *, 1..5, 2..*"/></label> <div class="vz-field-grid"><label class="vz-field"><span class="vz-field-label">Shape</span> <select class="vz-select"></select></label> <!></div></div>`);
  var root_162 = from_html(`<div class="vz-sidebar-header"><span class="vz-sidebar-title"> </span></div> <div class="vz-inspector-body"><label class="vz-field"><span class="vz-field-label">Semantic Relation Kind</span> <select class="vz-select" aria-label="Relation kind"></select></label> <label class="vz-field"><span class="vz-field-label">Label</span> <input type="text" class="vz-input" placeholder="e.g. belongs to, uses"/></label> <button type="button" class="vz-btn">\u21C4 Switch Direction</button> <div class="vz-field-grid"><label class="vz-field"><span class="vz-field-label">Line Style</span> <select class="vz-select"><option>Solid</option><option>Dashed</option></select></label> <label class="vz-field"><span class="vz-field-label">Routing</span> <select class="vz-select"><option>Smooth B\xE9zier</option><option>Straight</option></select></label></div> <!></div>`, 1);
  var root_172 = from_html(`<div class="vz-sidebar-header"><span class="vz-sidebar-title">UML Document</span></div> <div class="vz-inspector-body"><label class="vz-field"><span class="vz-field-label">Diagram Title</span> <input type="text" class="vz-input"/></label> <label class="vz-field"><span class="vz-field-label">Purpose</span> <textarea class="vz-textarea" rows="4" placeholder="Describe the purpose of this architecture model\u2026"></textarea></label></div>`, 1);
  var root_182 = from_html(`<div class="vz-sidebar-resizer" role="separator" aria-orientation="vertical" aria-label="Resize Sidebar Width" tabindex="0"></div> <aside class="vz-sidebar vz-inspector" aria-label="UML Property Inspector"><!> <div class="vz-inspector-pane"><!></div></aside>`, 1);
  function UmlInspector($$anchor, $$props) {
    push($$props, true);
    let resizingSidebar = state(null);
    function handleSidebarResizeStart(e) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget?.setPointerCapture?.(e.pointerId);
      set(resizingSidebar, { startX: e.clientX, initialWidth: $$props.store.sidebarWidth }, true);
    }
    function handleWindowPointerMove(e) {
      if (!get(resizingSidebar)) return;
      const dx = get(resizingSidebar).startX - e.clientX;
      $$props.store.setSidebarWidth(get(resizingSidebar).initialWidth + dx);
    }
    function handleWindowPointerUp() {
      if (get(resizingSidebar)) {
        set(resizingSidebar, null);
      }
    }
    const selectedNode = user_derived(() => $$props.store.umlDoc?.nodes.find((n) => $$props.store.selectedIds.includes(n.id)));
    const selectedEdge = user_derived(() => $$props.store.umlDoc?.edges.find((e) => $$props.store.selectedIds.includes(e.id)));
    const selectedEdgeTouchesNote = user_derived(() => {
      if (!get(selectedEdge) || !$$props.store.umlDoc) return false;
      const s = $$props.store.umlDoc.nodes.find((n) => n.id === get(selectedEdge).source.nodeId);
      const t = $$props.store.umlDoc.nodes.find((n) => n.id === get(selectedEdge).target.nodeId);
      return s?.kind === "note" || t?.kind === "note";
    });
    const relationPresets = listUmlRelationPresets();
    const endpointShapes = listEndpointShapes();
    function addAttribute(node) {
      const existing = node.attributes ?? [];
      const nextAttr = {
        id: `${node.id}-attr-${Date.now().toString(36).slice(-4)}`,
        visibility: "+",
        name: `field${existing.length + 1}`,
        type: "string"
      };
      $$props.store.dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        attributes: [...existing, nextAttr]
      });
    }
    function updateAttribute(node, index2, partial) {
      const existing = [...node.attributes ?? []];
      existing[index2] = { ...existing[index2], ...partial };
      $$props.store.dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        attributes: existing
      });
    }
    function removeAttribute(node, index2) {
      const existing = (node.attributes ?? []).filter((_, idx) => idx !== index2);
      $$props.store.dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        attributes: existing
      });
    }
    function addOperation(node) {
      const existing = node.operations ?? [];
      const nextOp = {
        id: `${node.id}-op-${Date.now().toString(36).slice(-4)}`,
        visibility: "+",
        name: `method${existing.length + 1}`,
        signature: "()",
        returnType: "void",
        parameters: []
      };
      $$props.store.dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        operations: [...existing, nextOp]
      });
    }
    function updateOperation(node, index2, partial) {
      const existing = [...node.operations ?? []];
      existing[index2] = { ...existing[index2], ...partial };
      $$props.store.dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        operations: existing
      });
    }
    function removeOperation(node, index2) {
      const existing = (node.operations ?? []).filter((_, idx) => idx !== index2);
      $$props.store.dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        operations: existing
      });
    }
    function addOperationArgument(node, opIndex) {
      const ops = [...node.operations ?? []];
      const targetOp = ops[opIndex];
      if (!targetOp) return;
      const currentArgs = extractOperationParameters(targetOp);
      const nextArg = {
        id: `${targetOp.id}-arg-${Date.now().toString(36).slice(-4)}`,
        name: `arg${currentArgs.length + 1}`,
        type: "string"
      };
      const nextArgs = [...currentArgs, nextArg];
      ops[opIndex] = {
        ...targetOp,
        parameters: nextArgs,
        signature: buildOperationSignature(nextArgs)
      };
      $$props.store.dispatchOperation({ type: "uml.updateNode", nodeId: node.id, operations: ops });
    }
    function updateOperationArgument(node, opIndex, argIndex, partial) {
      const ops = [...node.operations ?? []];
      const targetOp = ops[opIndex];
      if (!targetOp) return;
      const nextArgs = [...extractOperationParameters(targetOp)];
      if (!nextArgs[argIndex]) return;
      nextArgs[argIndex] = { ...nextArgs[argIndex], ...partial };
      ops[opIndex] = {
        ...targetOp,
        parameters: nextArgs,
        signature: buildOperationSignature(nextArgs)
      };
      $$props.store.dispatchOperation({ type: "uml.updateNode", nodeId: node.id, operations: ops });
    }
    function removeOperationArgument(node, opIndex, argIndex) {
      const ops = [...node.operations ?? []];
      const targetOp = ops[opIndex];
      if (!targetOp) return;
      const nextArgs = extractOperationParameters(targetOp).filter((_, i) => i !== argIndex);
      ops[opIndex] = {
        ...targetOp,
        parameters: nextArgs,
        signature: buildOperationSignature(nextArgs)
      };
      $$props.store.dispatchOperation({ type: "uml.updateNode", nodeId: node.id, operations: ops });
    }
    var fragment_1 = comment();
    event("pointermove", $window, handleWindowPointerMove);
    event("pointerup", $window, handleWindowPointerUp);
    var node_2 = first_child(fragment_1);
    {
      var consequent_9 = ($$anchor2) => {
        var fragment_2 = root_182();
        var div = first_child(fragment_2);
        var aside = sibling(div, 2);
        var node_3 = child(aside);
        AccessibleOutline(node_3, {
          get store() {
            return $$props.store;
          },
          get onDeleteSelected() {
            return $$props.onDeleteSelected;
          },
          get onDuplicateSelected() {
            return $$props.onDuplicateSelected;
          }
        });
        var div_1 = sibling(node_3, 2);
        var node_4 = child(div_1);
        {
          var consequent_6 = ($$anchor3) => {
            const nodeDesc = user_derived(() => getUmlNodeKind(get(selectedNode).kind));
            const attrsVisible = user_derived(() => get(selectedNode).showAttributes !== false);
            const opsVisible = user_derived(() => get(selectedNode).showOperations !== false);
            var fragment_3 = root_133();
            var div_2 = first_child(fragment_3);
            var span = child(div_2);
            var text2 = only_child(span);
            reset(div_2);
            var div_3 = sibling(div_2, 2);
            var node_5 = child(div_3);
            {
              var consequent_1 = ($$anchor4) => {
                var div_4 = root_210();
                var code = sibling(child(div_4));
                var text_1 = only_child(code, true);
                next();
                reset(div_4);
                template_effect(() => set_text(text_1, get(selectedNode).kind));
                append($$anchor4, div_4);
              };
              var alternate_2 = ($$anchor4) => {
                var fragment_4 = root_123();
                var label = first_child(fragment_4);
                var input = sibling(child(label), 2);
                remove_input_defaults(input);
                reset(label);
                var node_6 = sibling(label, 2);
                {
                  var consequent_2 = ($$anchor5) => {
                    var label_1 = root_34();
                    var textarea = sibling(child(label_1), 2);
                    remove_textarea_child(textarea);
                    reset(label_1);
                    template_effect(() => {
                      set_value(textarea, get(selectedNode).text ?? "");
                      textarea.disabled = $$props.store.isReadOnly;
                    });
                    delegated("change", textarea, (e) => $$props.store.dispatchOperation({
                      type: "uml.updateNode",
                      nodeId: get(selectedNode).id,
                      text: e.currentTarget.value
                    }));
                    append($$anchor5, label_1);
                  };
                  var consequent_3 = ($$anchor5) => {
                    var fragment_5 = root_53();
                    var label_2 = first_child(fragment_5);
                    var input_1 = sibling(child(label_2), 2);
                    remove_input_defaults(input_1);
                    reset(label_2);
                    var label_3 = sibling(label_2, 2);
                    var select = sibling(child(label_3), 2);
                    each(select, 21, () => UML_SHAPE_GEOMETRIES, (sh) => sh.kind, ($$anchor6, sh) => {
                      var option = root_44();
                      var text_2 = only_child(option, true);
                      var option_value = {};
                      template_effect(() => {
                        set_text(text_2, get(sh).label);
                        if (option_value !== (option_value = get(sh).kind)) {
                          option.value = (option.__value = option_value) ?? "";
                        }
                      });
                      append($$anchor6, option);
                    });
                    reset(select);
                    var select_value;
                    init_select(select);
                    reset(label_3);
                    template_effect(() => {
                      set_value(input_1, get(selectedNode).stereotype ?? "");
                      input_1.disabled = $$props.store.isReadOnly;
                      select.disabled = $$props.store.isReadOnly;
                      if (select_value !== (select_value = get(selectedNode).shape ?? "rectangle")) {
                        select.value = (select.__value = select_value) ?? "", select_option(select, select_value);
                      }
                    });
                    delegated("change", input_1, (e) => $$props.store.dispatchOperation({
                      type: "uml.updateNode",
                      nodeId: get(selectedNode).id,
                      stereotype: e.currentTarget.value
                    }));
                    delegated("change", select, (e) => $$props.store.dispatchOperation({
                      type: "uml.updateNode",
                      nodeId: get(selectedNode).id,
                      shape: e.currentTarget.value
                    }));
                    append($$anchor5, fragment_5);
                  };
                  var alternate_1 = ($$anchor5) => {
                    var fragment_6 = root_112();
                    var label_4 = first_child(fragment_6);
                    var input_2 = sibling(child(label_4), 2);
                    remove_input_defaults(input_2);
                    reset(label_4);
                    var div_5 = sibling(label_4, 2);
                    let classes;
                    var div_6 = child(div_5);
                    var span_1 = child(div_6);
                    var text_3 = only_child(span_1);
                    var button = sibling(span_1, 2);
                    let classes_1;
                    var node_7 = child(button);
                    eyeIcon(node_7, () => get(attrsVisible));
                    reset(button);
                    reset(div_6);
                    var node_8 = sibling(div_6, 2);
                    {
                      var consequent_4 = ($$anchor6) => {
                        var fragment_7 = root_73();
                        var node_9 = first_child(fragment_7);
                        each(node_9, 19, () => get(selectedNode).attributes ?? [], (attr2) => attr2.id, ($$anchor7, attr2, idx) => {
                          var div_7 = root_63();
                          var node_10 = child(div_7);
                          {
                            let $0 = user_derived(() => get(attr2).visibility ?? "+");
                            VisibilityPicker(node_10, {
                              get value() {
                                return get($0);
                              },
                              get disabled() {
                                return $$props.store.isReadOnly;
                              },
                              ariaLabel: "Attribute visibility",
                              onSelect: (nextVis) => updateAttribute(get(selectedNode), get(idx), { visibility: nextVis })
                            });
                          }
                          var input_3 = sibling(node_10, 2);
                          remove_input_defaults(input_3);
                          var input_4 = sibling(input_3, 2);
                          remove_input_defaults(input_4);
                          var button_1 = sibling(input_4, 2);
                          reset(div_7);
                          template_effect(() => {
                            set_value(input_3, get(attr2).name);
                            input_3.disabled = $$props.store.isReadOnly;
                            set_value(input_4, get(attr2).type ?? "");
                            input_4.disabled = $$props.store.isReadOnly;
                            button_1.disabled = $$props.store.isReadOnly;
                          });
                          delegated("change", input_3, (e) => updateAttribute(get(selectedNode), get(idx), { name: e.currentTarget.value }));
                          delegated("change", input_4, (e) => updateAttribute(get(selectedNode), get(idx), { type: e.currentTarget.value }));
                          delegated("click", button_1, () => removeAttribute(get(selectedNode), get(idx)));
                          append($$anchor7, div_7);
                        });
                        var button_2 = sibling(node_9, 2);
                        template_effect(() => button_2.disabled = $$props.store.isReadOnly);
                        delegated("click", button_2, () => addAttribute(get(selectedNode)));
                        append($$anchor6, fragment_7);
                      };
                      if_block(node_8, ($$render) => {
                        if (get(attrsVisible)) $$render(consequent_4);
                      });
                    }
                    reset(div_5);
                    var div_8 = sibling(div_5, 2);
                    let classes_2;
                    var div_9 = child(div_8);
                    var span_2 = child(div_9);
                    var text_4 = only_child(span_2);
                    var button_3 = sibling(span_2, 2);
                    let classes_3;
                    var node_11 = child(button_3);
                    eyeIcon(node_11, () => get(opsVisible));
                    reset(button_3);
                    reset(div_9);
                    var node_12 = sibling(div_9, 2);
                    {
                      var consequent_5 = ($$anchor6) => {
                        var fragment_8 = root_102();
                        var node_13 = first_child(fragment_8);
                        each(node_13, 19, () => get(selectedNode).operations ?? [], (op) => op.id, ($$anchor7, op, idx) => {
                          const opArgs = user_derived(() => extractOperationParameters(get(op)));
                          var div_10 = root_92();
                          var div_11 = child(div_10);
                          var node_14 = child(div_11);
                          {
                            let $0 = user_derived(() => get(op).visibility ?? "+");
                            VisibilityPicker(node_14, {
                              get value() {
                                return get($0);
                              },
                              get disabled() {
                                return $$props.store.isReadOnly;
                              },
                              ariaLabel: "Operation visibility",
                              onSelect: (nextVis) => updateOperation(get(selectedNode), get(idx), { visibility: nextVis })
                            });
                          }
                          var input_5 = sibling(node_14, 2);
                          remove_input_defaults(input_5);
                          var input_6 = sibling(input_5, 2);
                          remove_input_defaults(input_6);
                          var button_4 = sibling(input_6, 2);
                          reset(div_11);
                          var div_12 = sibling(div_11, 2);
                          var div_13 = child(div_12);
                          var text_5 = only_child(div_13);
                          var node_15 = sibling(div_13, 2);
                          each(node_15, 19, () => get(opArgs), (argItem) => argItem.id, ($$anchor8, argItem, aIdx) => {
                            var div_14 = root_82();
                            var input_7 = child(div_14);
                            remove_input_defaults(input_7);
                            var input_8 = sibling(input_7, 2);
                            remove_input_defaults(input_8);
                            var button_5 = sibling(input_8, 2);
                            reset(div_14);
                            template_effect(() => {
                              set_value(input_7, get(argItem).name);
                              input_7.disabled = $$props.store.isReadOnly;
                              set_value(input_8, get(argItem).type ?? "");
                              input_8.disabled = $$props.store.isReadOnly;
                              button_5.disabled = $$props.store.isReadOnly;
                            });
                            delegated("change", input_7, (e) => updateOperationArgument(get(selectedNode), get(idx), get(aIdx), { name: e.currentTarget.value }));
                            delegated("change", input_8, (e) => updateOperationArgument(get(selectedNode), get(idx), get(aIdx), { type: e.currentTarget.value }));
                            delegated("click", button_5, () => removeOperationArgument(get(selectedNode), get(idx), get(aIdx)));
                            append($$anchor8, div_14);
                          });
                          var button_6 = sibling(node_15, 2);
                          reset(div_12);
                          reset(div_10);
                          template_effect(() => {
                            set_value(input_5, get(op).name);
                            input_5.disabled = $$props.store.isReadOnly;
                            set_value(input_6, get(op).returnType ?? "");
                            input_6.disabled = $$props.store.isReadOnly;
                            button_4.disabled = $$props.store.isReadOnly;
                            set_text(text_5, `Arguments (${get(opArgs).length ?? ""})`);
                            button_6.disabled = $$props.store.isReadOnly;
                          });
                          delegated("change", input_5, (e) => updateOperation(get(selectedNode), get(idx), { name: e.currentTarget.value }));
                          delegated("change", input_6, (e) => updateOperation(get(selectedNode), get(idx), { returnType: e.currentTarget.value }));
                          delegated("click", button_4, () => removeOperation(get(selectedNode), get(idx)));
                          delegated("click", button_6, () => addOperationArgument(get(selectedNode), get(idx)));
                          append($$anchor7, div_10);
                        });
                        var button_7 = sibling(node_13, 2);
                        template_effect(() => button_7.disabled = $$props.store.isReadOnly);
                        delegated("click", button_7, () => addOperation(get(selectedNode)));
                        append($$anchor6, fragment_8);
                      };
                      if_block(node_12, ($$render) => {
                        if (get(opsVisible)) $$render(consequent_5);
                      });
                    }
                    reset(div_8);
                    template_effect(() => {
                      set_value(input_2, get(selectedNode).stereotype ?? "");
                      input_2.disabled = $$props.store.isReadOnly;
                      classes = set_class(div_5, 1, "vz-compartment-section", null, classes, { "section-hidden": !get(attrsVisible) });
                      set_text(text_3, `Attributes (${(get(selectedNode).attributes ?? []).length ?? ""})`);
                      classes_1 = set_class(button, 1, "vz-eye-toggle-btn", null, classes_1, { off: !get(attrsVisible) });
                      set_attribute2(button, "title", get(attrsVisible) ? "Hide Attributes section on node" : "Show Attributes section on node");
                      set_attribute2(button, "aria-label", get(attrsVisible) ? "Hide Attributes section" : "Show Attributes section");
                      button.disabled = $$props.store.isReadOnly;
                      classes_2 = set_class(div_8, 1, "vz-compartment-section", null, classes_2, { "section-hidden": !get(opsVisible) });
                      set_text(text_4, `Operations (${(get(selectedNode).operations ?? []).length ?? ""})`);
                      classes_3 = set_class(button_3, 1, "vz-eye-toggle-btn", null, classes_3, { off: !get(opsVisible) });
                      set_attribute2(button_3, "title", get(opsVisible) ? "Hide Operations section on node" : "Show Operations section on node");
                      set_attribute2(button_3, "aria-label", get(opsVisible) ? "Hide Operations section" : "Show Operations section");
                      button_3.disabled = $$props.store.isReadOnly;
                    });
                    delegated("change", input_2, (e) => $$props.store.dispatchOperation({
                      type: "uml.updateNode",
                      nodeId: get(selectedNode).id,
                      stereotype: e.currentTarget.value
                    }));
                    delegated("click", button, () => $$props.store.dispatchOperation({
                      type: "uml.updateNode",
                      nodeId: get(selectedNode).id,
                      showAttributes: !get(attrsVisible)
                    }));
                    delegated("click", button_3, () => $$props.store.dispatchOperation({
                      type: "uml.updateNode",
                      nodeId: get(selectedNode).id,
                      showOperations: !get(opsVisible)
                    }));
                    append($$anchor5, fragment_6);
                  };
                  if_block(node_6, ($$render) => {
                    if (get(selectedNode).kind === "note") $$render(consequent_2);
                    else if (get(selectedNode).kind === "shape") $$render(consequent_3, 1);
                    else $$render(alternate_1, -1);
                  });
                }
                template_effect(() => {
                  set_value(input, get(selectedNode).name);
                  input.disabled = $$props.store.isReadOnly;
                });
                delegated("change", input, (e) => $$props.store.dispatchOperation({
                  type: "uml.updateNode",
                  nodeId: get(selectedNode).id,
                  name: e.currentTarget.value
                }));
                append($$anchor4, fragment_4);
              };
              if_block(node_5, ($$render) => {
                if (!get(nodeDesc)) $$render(consequent_1);
                else $$render(alternate_2, -1);
              });
            }
            reset(div_3);
            template_effect(() => set_text(text2, `${get(nodeDesc)?.label ?? get(selectedNode).kind ?? ""}: ${get(selectedNode).name ?? ""}`));
            append($$anchor3, fragment_3);
          };
          var consequent_8 = ($$anchor3) => {
            var fragment_9 = root_162();
            var div_15 = first_child(fragment_9);
            var span_3 = child(div_15);
            var text_6 = only_child(span_3);
            reset(div_15);
            var div_16 = sibling(div_15, 2);
            var label_5 = child(div_16);
            var select_1 = sibling(child(label_5), 2);
            each(select_1, 21, () => relationPresets, index, ($$anchor4, preset) => {
              var option_1 = root_44();
              var text_7 = only_child(option_1, true);
              var option_1_value = {};
              template_effect(() => {
                set_text(text_7, get(preset).label);
                if (option_1_value !== (option_1_value = get(preset).kind)) {
                  option_1.value = (option_1.__value = option_1_value) ?? "";
                }
              });
              append($$anchor4, option_1);
            });
            reset(select_1);
            var select_1_value;
            init_select(select_1);
            reset(label_5);
            var label_6 = sibling(label_5, 2);
            var input_9 = sibling(child(label_6), 2);
            remove_input_defaults(input_9);
            reset(label_6);
            var button_8 = sibling(label_6, 2);
            var div_17 = sibling(button_8, 2);
            var label_7 = child(div_17);
            var select_2 = sibling(child(label_7), 2);
            var option_2 = child(select_2);
            option_2.value = option_2.__value = "solid";
            var option_3 = sibling(option_2);
            option_3.value = option_3.__value = "dashed";
            reset(select_2);
            var select_2_value;
            init_select(select_2);
            reset(label_7);
            var label_8 = sibling(label_7, 2);
            var select_3 = sibling(child(label_8), 2);
            var option_4 = child(select_3);
            option_4.value = option_4.__value = "bezier";
            var option_5 = sibling(option_4);
            option_5.value = option_5.__value = "straight";
            reset(select_3);
            var select_3_value;
            init_select(select_3);
            reset(label_8);
            reset(div_17);
            var node_16 = sibling(div_17, 2);
            each(node_16, 16, () => ["start", "end"], index, ($$anchor4, endKey) => {
              const currentDec = user_derived(() => get(selectedEdge).visual?.[endKey] ?? { shape: "none" });
              const shapeObj = user_derived(() => endpointShapes.find((s) => s.kind === get(currentDec).shape));
              const currentMult = user_derived(() => endKey === "start" ? get(selectedEdge).source.multiplicity ?? "" : get(selectedEdge).target.multiplicity ?? "");
              var div_18 = root_152();
              var div_19 = child(div_18);
              var span_4 = child(div_19);
              var text_8 = only_child(span_4, true);
              reset(div_19);
              var label_9 = sibling(div_19, 2);
              var input_10 = sibling(child(label_9), 2);
              remove_input_defaults(input_10);
              reset(label_9);
              var div_20 = sibling(label_9, 2);
              var label_10 = child(div_20);
              var select_4 = sibling(child(label_10), 2);
              each(select_4, 21, () => endpointShapes, index, ($$anchor5, sh) => {
                var option_6 = root_44();
                var text_9 = only_child(option_6, true);
                var option_6_value = {};
                template_effect(() => {
                  set_text(text_9, get(sh).label);
                  if (option_6_value !== (option_6_value = get(sh).kind)) {
                    option_6.value = (option_6.__value = option_6_value) ?? "";
                  }
                });
                append($$anchor5, option_6);
              });
              reset(select_4);
              var select_4_value;
              init_select(select_4);
              reset(label_10);
              var node_17 = sibling(label_10, 2);
              {
                var consequent_7 = ($$anchor5) => {
                  var label_11 = root_143();
                  var select_5 = sibling(child(label_11), 2);
                  var option_7 = child(select_5);
                  option_7.value = option_7.__value = "hollow";
                  var option_8 = sibling(option_7);
                  option_8.value = option_8.__value = "filled";
                  reset(select_5);
                  var select_5_value;
                  init_select(select_5);
                  reset(label_11);
                  template_effect(() => {
                    set_attribute2(select_5, "aria-label", `${endKey ?? ""} endpoint fill`);
                    select_5.disabled = $$props.store.isReadOnly;
                    if (select_5_value !== (select_5_value = get(currentDec).fill ?? get(shapeObj).defaultFill ?? "hollow")) {
                      select_5.value = (select_5.__value = select_5_value) ?? "", select_option(select_5, select_5_value);
                    }
                  });
                  delegated("change", select_5, (e) => $$props.store.dispatchOperation({
                    type: "uml.updateEndpoint",
                    edgeId: get(selectedEdge).id,
                    end: endKey,
                    decoration: { ...get(currentDec), fill: e.currentTarget.value }
                  }));
                  append($$anchor5, label_11);
                };
                if_block(node_17, ($$render) => {
                  if (get(shapeObj)?.supportsFill) $$render(consequent_7);
                });
              }
              reset(div_20);
              reset(div_18);
              template_effect(() => {
                set_text(text_8, endKey === "start" ? `Start Side (${get(selectedEdge).source.nodeId})` : `End Side (${get(selectedEdge).target.nodeId})`);
                set_value(input_10, get(currentMult));
                input_10.disabled = $$props.store.isReadOnly;
                set_attribute2(select_4, "aria-label", `${endKey ?? ""} endpoint shape`);
                select_4.disabled = $$props.store.isReadOnly;
                if (select_4_value !== (select_4_value = get(currentDec).shape)) {
                  select_4.value = (select_4.__value = select_4_value) ?? "", select_option(select_4, select_4_value);
                }
              });
              delegated("change", input_10, (e) => $$props.store.dispatchOperation({
                type: "uml.updateEdge",
                edgeId: get(selectedEdge).id,
                ...endKey === "start" ? { sourceMultiplicity: e.currentTarget.value.trim() } : { targetMultiplicity: e.currentTarget.value.trim() }
              }));
              delegated("change", select_4, (e) => $$props.store.dispatchOperation({
                type: "uml.updateEndpoint",
                edgeId: get(selectedEdge).id,
                end: endKey,
                decoration: { ...get(currentDec), shape: e.currentTarget.value }
              }));
              append($$anchor4, div_18);
            });
            reset(div_16);
            template_effect(() => {
              set_text(text_6, `Relation: ${get(selectedEdge).id ?? ""}`);
              select_1.disabled = $$props.store.isReadOnly;
              if (select_1_value !== (select_1_value = get(selectedEdge).kind)) {
                select_1.value = (select_1.__value = select_1_value) ?? "", select_option(select_1, select_1_value);
              }
              set_value(input_9, get(selectedEdge).label ?? "");
              input_9.disabled = $$props.store.isReadOnly;
              button_8.disabled = $$props.store.isReadOnly;
              set_attribute2(button_8, "title", `Switch Direction (${get(selectedEdge).target.nodeId} \u2192 ${get(selectedEdge).source.nodeId})`);
              select_2.disabled = $$props.store.isReadOnly;
              if (select_2_value !== (select_2_value = get(selectedEdge).visual?.line ?? (get(selectedEdgeTouchesNote) ? "dashed" : "solid"))) {
                select_2.value = (select_2.__value = select_2_value) ?? "", select_option(select_2, select_2_value);
              }
              select_3.disabled = $$props.store.isReadOnly;
              if (select_3_value !== (select_3_value = get(selectedEdge).visual?.routing ?? "bezier")) {
                select_3.value = (select_3.__value = select_3_value) ?? "", select_option(select_3, select_3_value);
              }
            });
            delegated("change", select_1, (e) => $$props.store.dispatchOperation({
              type: "uml.updateEdge",
              edgeId: get(selectedEdge).id,
              kind: e.currentTarget.value
            }));
            delegated("change", input_9, (e) => $$props.store.dispatchOperation({
              type: "uml.updateEdge",
              edgeId: get(selectedEdge).id,
              label: e.currentTarget.value
            }));
            delegated("click", button_8, () => $$props.store.dispatchOperation({
              type: "uml.updateEdge",
              edgeId: get(selectedEdge).id,
              reverseDirection: true
            }));
            delegated("change", select_2, (e) => $$props.store.dispatchOperation({
              type: "uml.updateEdge",
              edgeId: get(selectedEdge).id,
              line: e.currentTarget.value
            }));
            delegated("change", select_3, (e) => $$props.store.dispatchOperation({
              type: "uml.updateEdge",
              edgeId: get(selectedEdge).id,
              routing: e.currentTarget.value
            }));
            append($$anchor3, fragment_9);
          };
          var alternate_3 = ($$anchor3) => {
            var fragment_10 = root_172();
            var div_21 = sibling(first_child(fragment_10), 2);
            var label_12 = child(div_21);
            var input_11 = sibling(child(label_12), 2);
            remove_input_defaults(input_11);
            reset(label_12);
            var label_13 = sibling(label_12, 2);
            var textarea_1 = sibling(child(label_13), 2);
            remove_textarea_child(textarea_1);
            reset(label_13);
            reset(div_21);
            template_effect(() => {
              set_value(input_11, $$props.store.umlDoc.title);
              input_11.disabled = $$props.store.isReadOnly;
              set_value(textarea_1, $$props.store.umlDoc.ai.purpose);
              textarea_1.disabled = $$props.store.isReadOnly;
            });
            delegated("change", input_11, (e) => $$props.store.dispatchOperation({ type: "uml.updateMetadata", title: e.currentTarget.value }));
            delegated("change", textarea_1, (e) => $$props.store.dispatchOperation({ type: "uml.updateMetadata", purpose: e.currentTarget.value }));
            append($$anchor3, fragment_10);
          };
          if_block(node_4, ($$render) => {
            if (get(selectedNode)) $$render(consequent_6);
            else if (get(selectedEdge)) $$render(consequent_8, 1);
            else $$render(alternate_3, -1);
          });
        }
        reset(div_1);
        reset(aside);
        template_effect(() => set_style(aside, `width: ${$$props.store.sidebarWidth ?? ""}px;`));
        delegated("pointerdown", div, handleSidebarResizeStart);
        append($$anchor2, fragment_2);
      };
      if_block(node_2, ($$render) => {
        if ($$props.store.umlDoc) $$render(consequent_9);
      });
    }
    append($$anchor, fragment_1);
    pop();
  }
  delegate(["pointerdown", "change", "click"]);

  // src/webview/uml/UmlCanvas.svelte
  var eyeIcon2 = ($$anchor, visible = noop) => {
    var fragment = comment();
    var node_1 = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var svg = root6();
        append($$anchor2, svg);
      };
      var alternate = ($$anchor2) => {
        var svg_1 = root_111();
        append($$anchor2, svg_1);
      };
      if_block(node_1, ($$render) => {
        if (visible()) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    append($$anchor, fragment);
  };
  var root6 = from_svg(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`);
  var root_111 = from_svg(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`);
  var root_211 = from_svg(`<path class="vz-endpoint-marker"></path>`);
  var root_35 = from_svg(`<g class="vz-edge-mult-group"><rect y="-9" height="17" rx="3" class="vz-edge-mult-bg"></rect><text text-anchor="middle" dy="3" class="vz-edge-mult-text"> </text></g>`);
  var root_45 = from_svg(`<g class="vz-edge-label-group"><rect y="-11" height="20" rx="4" class="vz-edge-label-bg"></rect><text text-anchor="middle" dy="3" class="vz-edge-label-text"> </text></g>`);
  var root_54 = from_svg(`<g><path class="vz-edge-hit"></path><path class="vz-edge-stroke"></path><!><!><!><!><!></g>`);
  var root_64 = from_html(`<input type="text" class="vz-inline-input vz-shape-inline-input"/> <input type="text" class="vz-inline-input vz-inline-stereotype-input" placeholder="\xABstereotype\xBB"/>`, 1);
  var root_74 = from_html(`<div class="vz-uml-stereotype"> </div>`);
  var root_83 = from_html(`<div class="vz-uml-node-title"> </div> <!>`, 1);
  var root_93 = from_html(`<svg class="vz-shape-node-svg" aria-hidden="true"><path class="vz-shape-node-path"></path></svg> <div class="vz-shape-node-content"><!></div>`, 1);
  var root_103 = from_html(`<input type="text" class="vz-inline-input vz-inline-stereotype-input" placeholder="\xABstereotype\xBB"/>`);
  var root_113 = from_html(`<input type="text" class="vz-inline-input"/> <!>`, 1);
  var root_124 = from_html(`<div class="vz-uml-note-body"><textarea class="vz-inline-textarea" rows="4" placeholder="Note content\u2026"></textarea></div>`);
  var root_134 = from_html(`<div class="vz-uml-note-body"> </div>`);
  var root_144 = from_html(`<div class="vz-inline-member-row"><!> <input type="text" class="vz-inline-cell-input" placeholder="name"/> <input type="text" class="vz-inline-cell-input" placeholder="type"/> <button type="button" class="vz-inline-del-btn" title="Remove attribute">\xD7</button></div>`);
  var root_153 = from_html(`<!> <button type="button" class="vz-inline-add-btn">\uFF0B Attribute</button>`, 1);
  var root_163 = from_html(`<div class="vz-inline-sec-hdr"><span>Attributes</span> <button type="button"><!></button></div> <!>`, 1);
  var root_173 = from_html(`<span class="vz-type"> </span>`);
  var root_183 = from_html(`<div class="vz-uml-member"><span class="vz-vis"> </span> <span> </span> <!></div>`);
  var root_192 = from_html(`<div class="vz-uml-compartment"><!></div>`);
  var root_202 = from_html(`<div class="vz-inline-param-row"><input type="text" class="vz-inline-cell-input" placeholder="argName"/> <input type="text" class="vz-inline-cell-input" placeholder="argType"/> <button type="button" class="vz-inline-del-btn" title="Remove argument">\xD7</button></div>`);
  var root_212 = from_html(`<div class="vz-inline-op-block"><div class="vz-inline-member-row"><!> <input type="text" class="vz-inline-cell-input" placeholder="method"/> <input type="text" class="vz-inline-cell-input" placeholder="return"/> <button type="button" class="vz-inline-del-btn" title="Remove operation">\xD7</button></div> <div class="vz-inline-params-wrap"><!> <button type="button" class="vz-inline-add-btn vz-param-add-btn">\uFF0B Argument</button></div></div>`);
  var root_223 = from_html(`<!> <button type="button" class="vz-inline-add-btn">\uFF0B Operation</button>`, 1);
  var root_233 = from_html(`<div class="vz-inline-sec-hdr"><span>Operations</span> <button type="button"><!></button></div> <!>`, 1);
  var root_243 = from_html(`<!> <!>`, 1);
  var root_252 = from_html(`<div class="vz-uml-node-header"><!></div> <!>`, 1);
  var root_262 = from_html(`<div class="vz-resize-handle" title="Drag to resize node (snaps to 20px grid)"></div>`);
  var root_272 = from_html(`<div class="vz-connect-port" title="Drag to another node to connect relation"></div> <!>`, 1);
  var root_282 = from_html(`<div role="button" tabindex="0"><!> <!></div>`);
  var root_292 = from_svg(`<circle class="vz-endpoint-picker-target"><title>Click to customize START endpoint shape & multiplicity</title></circle><circle class="vz-endpoint-picker-target"><title>Click to customize END endpoint shape & multiplicity</title></circle>`, 1);
  var root_302 = from_svg(`<line class="vz-gesture-line"></line>`);
  var root_312 = from_svg(`<rect class="vz-marquee-box"></rect>`);
  var root_323 = from_html(`<div class="vz-floating-edge-label-editor"><input type="text" class="vz-input" placeholder="Relation label\u2026"/></div>`);
  var root_333 = from_html(`<div class="vz-floating-edge-label-editor vz-floating-mult-editor"><input type="text" class="vz-input" placeholder="1, *"/></div>`);
  var root_342 = from_svg(`<path stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>`);
  var root_352 = from_html(`<button type="button"><svg width="34" height="18" viewBox="-24 -9 26 18" class="vz-endpoint-preview-svg" aria-hidden="true"><line x1="-22" y1="0" y2="0" stroke="currentColor" stroke-width="1.8"></line><!></svg> <span> </span></button>`);
  var root_36 = from_html(`<div class="vz-endpoint-popup"><div class="vz-endpoint-mult-row"><span class="vz-field-label">Multiplicity</span> <input type="text" class="vz-input-mini" placeholder="e.g. 1, *, 1..5, 2..*"/></div> <div class="vz-endpoint-icon-grid"></div></div>`);
  var root_37 = from_html(`<svg class="vz-svg-layer vz-svg-relations vz-svg-overlay" aria-label="UML Relationships"><g></g></svg> <div class="vz-html-world"></div> <svg class="vz-svg-layer vz-svg-foreground" aria-label="UML Canvas Interactions"><g><!><!><!></g></svg> <!> <!> <!>`, 1);
  var root_38 = from_html(`<div class="vz-workspace"><div class="vz-main-split"><div tabindex="0" role="application" aria-label="Vizion UML Canvas"><div class="vz-floating-zoom"><button type="button" class="vz-zoom-pill-btn" title="Zoom Out">\uFF0D</button> <button type="button" class="vz-zoom-pill-label" title="Scroll wheel here to adjust by \xB11%, or click to Fit Content"> </button> <button type="button" class="vz-zoom-pill-btn" title="Zoom In">\uFF0B</button></div> <!></div> <!></div></div>`);
  function UmlCanvas($$anchor, $$props) {
    push($$props, true);
    let store = prop($$props, "store", 7);
    let viewportEl = state(void 0);
    let gesture = state(proxy({ mode: "idle" }));
    let spacePressed = state(false);
    let inlineEditingNodeId = state(null);
    let inlineNodeNameDraft = state("");
    let inlineNodeStereotypeDraft = state("");
    let inlineEditingEdgeId = state(null);
    let inlineEdgeLabelDraft = state("");
    let inlineEditingMultiplicity = state(null);
    let endpointPickerPopup = state(null);
    const relationPresets = listUmlRelationPresets();
    const endpointIconChoices = [
      { label: "None", decoration: { shape: "none", size: 10 } },
      {
        label: "Open Arrow",
        decoration: { shape: "open-arrow", size: 11 }
      },
      {
        label: "Hollow Triangle",
        decoration: { shape: "triangle", fill: "hollow", size: 12 }
      },
      {
        label: "Filled Triangle",
        decoration: { shape: "triangle", fill: "filled", size: 12 }
      },
      {
        label: "Hollow Diamond",
        decoration: { shape: "diamond", fill: "hollow", size: 13 }
      },
      {
        label: "Filled Diamond",
        decoration: { shape: "diamond", fill: "filled", size: 13 }
      },
      {
        label: "Hollow Circle",
        decoration: { shape: "circle", fill: "hollow", size: 10 }
      },
      {
        label: "Filled Circle",
        decoration: { shape: "circle", fill: "filled", size: 10 }
      },
      {
        label: "Hollow Square",
        decoration: { shape: "square", fill: "hollow", size: 10 }
      },
      {
        label: "Filled Square",
        decoration: { shape: "square", fill: "filled", size: 10 }
      }
    ];
    const doc = user_derived(() => store().umlDoc);
    const gridSpacing = user_derived(() => GRID_SIZE * store().viewport.zoom);
    const gridDotRadius = user_derived(() => Math.max(0.8, Math.min(2.5, 1.2 * store().viewport.zoom)).toFixed(2));
    const gridOpacity = user_derived(() => (store().viewport.zoom < 0.45 ? Math.max(0.08, 0.24 * (store().viewport.zoom / 0.45)) : 0.24).toFixed(2));
    const gridPosX = user_derived(() => store().viewport.panX - get(gridSpacing) / 2);
    const gridPosY = user_derived(() => store().viewport.panY - get(gridSpacing) / 2);
    const effectiveNodeLayouts = user_derived(() => {
      if (!get(doc)) return {};
      const base = {};
      get(doc).nodes.forEach((n, idx) => {
        const persisted = get(doc).layout.nodes[n.id] ?? {
          x: 80 + idx % 3 * 260,
          y: 80 + Math.floor(idx / 3) * 190,
          width: 220,
          height: 140
        };
        base[n.id] = store().optimisticUmlLayouts[n.id] ?? persisted;
      });
      if (get(gesture).mode === "moving") {
        const rawDx = get(gesture).currentWorld.x - get(gesture).startWorld.x;
        const rawDy = get(gesture).currentWorld.y - get(gesture).startWorld.y;
        const snappedDx = snapToGrid(rawDx, GRID_SIZE);
        const snappedDy = snapToGrid(rawDy, GRID_SIZE);
        for (const [id, init2] of Object.entries(get(gesture).initialLayouts)) {
          base[id] = {
            ...init2,
            x: snapToGrid(init2.x + snappedDx, GRID_SIZE),
            y: snapToGrid(init2.y + snappedDy, GRID_SIZE)
          };
        }
      } else if (get(gesture).mode === "resizing") {
        const rawDx = get(gesture).currentWorld.x - get(gesture).startWorld.x;
        const rawDy = get(gesture).currentWorld.y - get(gesture).startWorld.y;
        base[get(gesture).nodeId] = {
          ...get(gesture).initialBox,
          width: Math.max(100, snapToGrid(get(gesture).initialBox.width + rawDx, GRID_SIZE)),
          height: Math.max(60, snapToGrid(get(gesture).initialBox.height + rawDy, GRID_SIZE))
        };
      }
      return base;
    });
    const edgeParallelOffsets = user_derived(() => {
      if (!get(doc)) return {};
      const pairGroups = /* @__PURE__ */ new Map();
      for (const edge of get(doc).edges) {
        const pairKey = [edge.source.nodeId, edge.target.nodeId].sort().join("::");
        const list = pairGroups.get(pairKey) ?? [];
        list.push(edge.id);
        pairGroups.set(pairKey, list);
      }
      const offsets = {};
      for (const group of pairGroups.values()) {
        if (group.length <= 1) {
          offsets[group[0]] = 0;
        } else {
          const mid = (group.length - 1) / 2;
          group.forEach((id, i) => {
            offsets[id] = (i - mid) * 22;
          });
        }
      }
      return offsets;
    });
    const marqueeRect = user_derived(() => get(gesture).mode === "marquee" ? normalizeDragRect(get(gesture).startWorld, get(gesture).currentWorld) : null);
    user_effect(() => {
      store().registerCanvasCallbacks({
        onFitContent: fitContent,
        onResetZoom: () => store().setViewport({ panX: 40, panY: 40, zoom: 1 }),
        onRestoreFocus: () => get(viewportEl)?.focus(),
        onExportSvg: exportDiagramToSvg
      });
    });
    function getRelativeWorldPoint(e) {
      const rect = get(viewportEl)?.getBoundingClientRect() ?? { left: 0, top: 0 };
      return screenToWorld(e.clientX - rect.left, e.clientY - rect.top, store().viewport);
    }
    function cancelGesture() {
      set(gesture, { mode: "idle" }, true);
    }
    function fitContent() {
      if (!get(doc) || get(doc).nodes.length === 0 || !get(viewportEl)) {
        store().setViewport({ panX: 40, panY: 40, zoom: 1 });
        return;
      }
      const layouts = Object.values(get(effectiveNodeLayouts));
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const box of layouts) {
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
      }
      const pad = 60;
      const contentW = Math.max(200, maxX - minX + pad * 2);
      const contentH = Math.max(200, maxY - minY + pad * 2);
      const viewW = Math.max(300, get(viewportEl).clientWidth);
      const viewH = Math.max(300, get(viewportEl).clientHeight);
      const zoom = Math.min(1.5, Math.max(0.25, Math.min(viewW / contentW, viewH / contentH)));
      const panX = (viewW - (maxX - minX) * zoom) / 2 - minX * zoom;
      const panY = (viewH - (maxY - minY) * zoom) / 2 - minY * zoom;
      store().setViewport({ panX, panY, zoom });
    }
    function handleWheel(e) {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        if (e.shiftKey) {
          const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
          store().setViewport({
            ...store().viewport,
            panX: store().viewport.panX - delta,
            panY: store().viewport.panY
          });
        } else {
          store().setViewport({
            ...store().viewport,
            panX: store().viewport.panX - e.deltaX,
            panY: store().viewport.panY - e.deltaY
          });
        }
      } else {
        if (e.deltaY === 0) return;
        const rect = get(viewportEl)?.getBoundingClientRect() ?? { left: 0, top: 0 };
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        const nextZoom = Math.min(3, Math.max(0.2, store().viewport.zoom * factor));
        const scaleChange = nextZoom / store().viewport.zoom;
        store().setViewport({
          zoom: nextZoom,
          panX: cursorX - (cursorX - store().viewport.panX) * scaleChange,
          panY: cursorY - (cursorY - store().viewport.panY) * scaleChange
        });
      }
    }
    function handleZoomPillWheel(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY === 0) return;
      const currentPercent = Math.round(store().viewport.zoom * 100);
      const step = e.deltaY < 0 ? 1 : -1;
      const nextZoom = Math.min(3, Math.max(0.2, (currentPercent + step) / 100));
      store().setViewport({ ...store().viewport, zoom: nextZoom });
    }
    function handleCanvasPointerDown(e) {
      if (e.button === 2) return;
      if (get(inlineEditingNodeId)) commitInlineNodeEdit();
      if (get(inlineEditingEdgeId)) commitInlineEdgeLabel();
      if (get(inlineEditingMultiplicity)) commitInlineMultiplicity();
      get(viewportEl)?.focus();
      set(endpointPickerPopup, null);
      if (e.button === 1 || e.button === 0 && (e.altKey || get(spacePressed))) {
        set(
          gesture,
          {
            mode: "panning",
            startScreenX: e.clientX,
            startScreenY: e.clientY,
            initialPanX: store().viewport.panX,
            initialPanY: store().viewport.panY
          },
          true
        );
        get(viewportEl)?.setPointerCapture(e.pointerId);
        return;
      }
      if (e.target !== get(viewportEl) && !e.target?.classList.contains("vz-canvas-bg")) {
        return;
      }
      if (e.button === 0) {
        if (!e.shiftKey) {
          store().clearSelection();
        }
        const pt = getRelativeWorldPoint(e);
        set(gesture, { mode: "marquee", startWorld: pt, currentWorld: pt }, true);
        get(viewportEl)?.setPointerCapture(e.pointerId);
      }
    }
    function handleNodePointerDown(e, node) {
      if (e.button === 2) return;
      if (get(spacePressed) || e.button === 1) {
        set(
          gesture,
          {
            mode: "panning",
            startScreenX: e.clientX,
            startScreenY: e.clientY,
            initialPanX: store().viewport.panX,
            initialPanY: store().viewport.panY
          },
          true
        );
        return;
      }
      const targetEl = e.target;
      const targetTag = targetEl?.tagName;
      if (get(inlineEditingNodeId) === node.id || targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT" || targetTag === "BUTTON" || targetEl?.closest(".vz-eye-toggle-btn")) {
        e.stopPropagation();
        return;
      }
      if (get(inlineEditingNodeId) && get(inlineEditingNodeId) !== node.id) commitInlineNodeEdit();
      if (get(inlineEditingEdgeId)) commitInlineEdgeLabel();
      if (get(inlineEditingMultiplicity)) commitInlineMultiplicity();
      set(endpointPickerPopup, null);
      e.stopPropagation();
      get(viewportEl)?.focus();
      const additive = e.shiftKey || e.metaKey || e.ctrlKey;
      if (!store().selectedIds.includes(node.id)) {
        store().selectSingle(node.id, additive);
      } else if (additive) {
        store().selectSingle(node.id, true);
        return;
      }
      if (store().isReadOnly) return;
      const pt = getRelativeWorldPoint(e);
      const initialLayouts = {};
      for (const id of store().selectedIds) {
        if (get(effectiveNodeLayouts)[id]) {
          initialLayouts[id] = { ...get(effectiveNodeLayouts)[id] };
        }
      }
      set(
        gesture,
        {
          mode: "moving",
          startWorld: pt,
          currentWorld: pt,
          initialLayouts,
          clickedNodeId: node.id
        },
        true
      );
    }
    function handleResizeHandlePointerDown(e, node) {
      if (e.button === 2) return;
      e.stopPropagation();
      if (store().isReadOnly) return;
      const pt = getRelativeWorldPoint(e);
      const box = get(effectiveNodeLayouts)[node.id];
      if (!box) return;
      set(
        gesture,
        {
          mode: "resizing",
          nodeId: node.id,
          startWorld: pt,
          currentWorld: pt,
          initialBox: { ...box }
        },
        true
      );
    }
    function handleConnectPortPointerDown(e, node) {
      if (e.button === 2) return;
      e.stopPropagation();
      if (store().isReadOnly) return;
      const pt = getRelativeWorldPoint(e);
      const box = get(effectiveNodeLayouts)[node.id];
      const startPoint = {
        x: (box?.x ?? pt.x) + (box?.width ?? 0),
        y: (box?.y ?? pt.y) + (box?.height ?? 0) / 2
      };
      set(
        gesture,
        {
          mode: "connecting",
          sourceNodeId: node.id,
          startPoint,
          currentWorld: pt
        },
        true
      );
    }
    function handleWindowPointerMove(e) {
      if (get(gesture).mode === "idle") return;
      if (get(gesture).mode === "panning") {
        const dx = e.clientX - get(gesture).startScreenX;
        const dy = e.clientY - get(gesture).startScreenY;
        store().setViewport({
          ...store().viewport,
          panX: get(gesture).initialPanX + dx,
          panY: get(gesture).initialPanY + dy
        });
        return;
      }
      const pt = getRelativeWorldPoint(e);
      if (get(gesture).mode === "marquee" || get(gesture).mode === "moving" || get(gesture).mode === "resizing" || get(gesture).mode === "connecting") {
        set(gesture, { ...get(gesture), currentWorld: pt }, true);
      }
    }
    function findHoveredTargetAt(worldPt) {
      if (!get(doc)) return void 0;
      for (let i = get(doc).nodes.length - 1; i >= 0; i--) {
        const n = get(doc).nodes[i];
        const box = get(effectiveNodeLayouts)[n.id];
        if (!box) continue;
        if (worldPt.x >= box.x && worldPt.x <= box.x + box.width && worldPt.y >= box.y && worldPt.y <= box.y + box.height) {
          return n;
        }
      }
      return void 0;
    }
    function handleWindowPointerUp(e) {
      if (get(gesture).mode === "idle") return;
      const current = get(gesture);
      if (current.mode === "marquee" && get(doc)) {
        set(gesture, { mode: "idle" }, true);
        const box = normalizeDragRect(current.startWorld, current.currentWorld);
        if (box.width > 4 || box.height > 4) {
          const hitIds = [];
          for (const n of get(doc).nodes) {
            const nBox = get(effectiveNodeLayouts)[n.id];
            if (nBox && rectsIntersect(box, nBox)) {
              hitIds.push(n.id);
            }
          }
          store().setSelectedIds(hitIds);
        }
        return;
      }
      if (current.mode === "moving") {
        const rawDx = current.currentWorld.x - current.startWorld.x;
        const rawDy = current.currentWorld.y - current.startWorld.y;
        const snappedDx = snapToGrid(rawDx, GRID_SIZE);
        const snappedDy = snapToGrid(rawDy, GRID_SIZE);
        if (snappedDx === 0 && snappedDy === 0) {
          set(gesture, { mode: "idle" }, true);
          if (!e.shiftKey && !e.metaKey && !e.ctrlKey && current.clickedNodeId && store().selectedIds.length > 1) {
            store().selectSingle(current.clickedNodeId, false);
          }
          return;
        }
        const updates = {};
        for (const [id, init2] of Object.entries(current.initialLayouts)) {
          updates[id] = {
            ...init2,
            x: snapToGrid(init2.x + snappedDx, GRID_SIZE),
            y: snapToGrid(init2.y + snappedDy, GRID_SIZE)
          };
        }
        store().optimisticUmlLayouts = { ...store().optimisticUmlLayouts, ...updates };
        set(gesture, { mode: "idle" }, true);
        store().dispatchOperation({ type: "uml.moveResizeNodes", updates });
        return;
      }
      if (current.mode === "resizing") {
        const rawDx = current.currentWorld.x - current.startWorld.x;
        const rawDy = current.currentWorld.y - current.startWorld.y;
        const nextWidth = Math.max(100, snapToGrid(current.initialBox.width + rawDx, GRID_SIZE));
        const nextHeight = Math.max(60, snapToGrid(current.initialBox.height + rawDy, GRID_SIZE));
        if (nextWidth === current.initialBox.width && nextHeight === current.initialBox.height) {
          set(gesture, { mode: "idle" }, true);
          return;
        }
        const nextBox = { ...current.initialBox, width: nextWidth, height: nextHeight };
        store().optimisticUmlLayouts = { ...store().optimisticUmlLayouts, [current.nodeId]: nextBox };
        set(gesture, { mode: "idle" }, true);
        store().dispatchOperation({
          type: "uml.moveResizeNodes",
          updates: { [current.nodeId]: nextBox }
        });
        return;
      }
      if (current.mode === "connecting") {
        set(gesture, { mode: "idle" }, true);
        const pt = getRelativeWorldPoint(e);
        const targetNode = findHoveredTargetAt(pt);
        if (targetNode && targetNode.id !== current.sourceNodeId) {
          const edgeId = `edge-${current.sourceNodeId}-${targetNode.id}-${Date.now().toString(36).slice(-4)}`;
          store().dispatchOperation({
            type: "uml.addEdge",
            id: edgeId,
            kind: "association",
            sourceNodeId: current.sourceNodeId,
            targetNodeId: targetNode.id
          });
        }
        return;
      }
      set(gesture, { mode: "idle" }, true);
    }
    function deleteSelected() {
      if (store().isReadOnly || !get(doc) || store().selectedIds.length === 0) return;
      const nodeIds = get(doc).nodes.filter((n) => store().selectedIds.includes(n.id)).map((n) => n.id);
      const edgeIds = get(doc).edges.filter((e) => store().selectedIds.includes(e.id)).map((e) => e.id);
      if (nodeIds.length === 0 && edgeIds.length === 0) return;
      store().dispatchOperation({ type: "uml.deleteEntities", nodeIds, edgeIds });
      store().clearSelection();
    }
    function duplicateSelected() {
      if (store().isReadOnly || !get(doc) || store().selectedIds.length === 0) return;
      const nodeIds = get(doc).nodes.filter((n) => store().selectedIds.includes(n.id)).map((n) => n.id);
      const edgeIds = get(doc).edges.filter((e) => store().selectedIds.includes(e.id)).map((e) => e.id);
      if (nodeIds.length === 0 && edgeIds.length === 0) return;
      store().dispatchOperation({ type: "uml.duplicateSelection", nodeIds, edgeIds });
    }
    function handleKeyDown(e) {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") {
        if (e.key === "Escape") {
          document.activeElement.blur();
        }
        return;
      }
      const isMod = e.ctrlKey || e.metaKey;
      const keyLower = e.key.toLowerCase();
      if (e.code === "Space" && !isMod && !e.altKey) {
        e.preventDefault();
        set(spacePressed, true);
        return;
      }
      if (e.key === "Escape") {
        store().closeContextMenu();
        set(inlineEditingNodeId, null);
        set(inlineEditingEdgeId, null);
        set(inlineEditingMultiplicity, null);
        set(endpointPickerPopup, null);
        if (get(gesture).mode !== "idle") {
          cancelGesture();
        } else {
          store().clearSelection();
        }
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
        return;
      }
      if (isMod && !e.shiftKey && keyLower === "z") {
        e.preventDefault();
        store().triggerUndo();
        return;
      }
      if (isMod && keyLower === "y" || isMod && e.shiftKey && keyLower === "z") {
        e.preventDefault();
        store().triggerRedo();
        return;
      }
      if (isMod && !e.shiftKey && keyLower === "c") {
        e.preventDefault();
        store().copySelection();
        return;
      }
      if (isMod && !e.shiftKey && keyLower === "v") {
        e.preventDefault();
        store().pasteClipboard(false);
        return;
      }
      if (isMod && e.shiftKey && keyLower === "v") {
        e.preventDefault();
        store().pasteClipboard(true);
        return;
      }
      if (isMod && keyLower === "d") {
        e.preventDefault();
        duplicateSelected();
        return;
      }
      if (e.altKey && !isMod) {
        if (keyLower === "c") {
          e.preventDefault();
          store().createQuickUmlNode("class");
          return;
        }
        if (keyLower === "n") {
          e.preventDefault();
          store().createQuickUmlNode("note");
          return;
        }
        if (keyLower === "s") {
          e.preventDefault();
          store().createQuickUmlNode("shape", void 0, void 0, "rectangle");
          return;
        }
      }
      if (e.key === "0" && isMod) {
        e.preventDefault();
        store().setViewport({ panX: 40, panY: 40, zoom: 1 });
      }
    }
    function handleKeyUp(e) {
      if (e.code === "Space") {
        set(spacePressed, false);
      }
    }
    function handleCanvasContextMenu(e) {
      e.preventDefault();
      const worldPt = getRelativeWorldPoint(e);
      store().openContextMenu(
        e.clientX,
        e.clientY,
        [
          {
            label: "Add New",
            submenu: [
              {
                label: "Class",
                shortcut: "Alt+C",
                action: () => store().createQuickUmlNode("class", worldPt.x, worldPt.y)
              },
              {
                label: "Note",
                shortcut: "Alt+N",
                action: () => store().createQuickUmlNode("note", worldPt.x, worldPt.y)
              },
              {
                label: "Shape",
                dividerBefore: true,
                submenu: UML_SHAPE_GEOMETRIES.map((sh) => ({
                  label: sh.label,
                  action: () => store().createQuickUmlNode("shape", worldPt.x, worldPt.y, sh.kind)
                }))
              }
            ]
          },
          {
            label: "Paste",
            shortcut: "Ctrl+V",
            dividerBefore: true,
            action: () => store().pasteClipboard(false)
          },
          {
            label: "Paste as new",
            shortcut: "Ctrl+Shift+V",
            action: () => store().pasteClipboard(true)
          },
          {
            label: "Undo",
            shortcut: "Ctrl+Z",
            dividerBefore: true,
            action: () => store().triggerUndo()
          },
          {
            label: "Redo",
            shortcut: "Ctrl+Y",
            action: () => store().triggerRedo()
          },
          {
            label: "Fit Content",
            dividerBefore: true,
            action: () => fitContent()
          }
        ],
        "Canvas"
      );
    }
    function addNodeAttributeInline(node) {
      const existing = node.attributes ?? [];
      store().dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        showAttributes: true,
        attributes: [
          ...existing,
          {
            id: `${node.id}-attr-${Date.now().toString(36).slice(-4)}`,
            visibility: "+",
            name: `field${existing.length + 1}`,
            type: "string"
          }
        ]
      });
    }
    function updateNodeAttributeInline(node, idx, partial) {
      const existing = [...node.attributes ?? []];
      existing[idx] = { ...existing[idx], ...partial };
      store().dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        attributes: existing
      });
    }
    function removeNodeAttributeInline(node, idx) {
      const existing = (node.attributes ?? []).filter((_, i) => i !== idx);
      store().dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        attributes: existing
      });
    }
    function addNodeOperationInline(node) {
      const existing = node.operations ?? [];
      store().dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        showOperations: true,
        operations: [
          ...existing,
          {
            id: `${node.id}-op-${Date.now().toString(36).slice(-4)}`,
            visibility: "+",
            name: `method${existing.length + 1}`,
            signature: "()",
            returnType: "void",
            parameters: []
          }
        ]
      });
    }
    function updateNodeOperationInline(node, idx, partial) {
      const existing = [...node.operations ?? []];
      existing[idx] = { ...existing[idx], ...partial };
      store().dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        operations: existing
      });
    }
    function removeNodeOperationInline(node, idx) {
      const existing = (node.operations ?? []).filter((_, i) => i !== idx);
      store().dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        operations: existing
      });
    }
    function addNodeOperationArgInline(node, opIdx) {
      const ops = [...node.operations ?? []];
      const targetOp = ops[opIdx];
      if (!targetOp) return;
      const currentArgs = extractOperationParameters(targetOp);
      const nextArgs = [
        ...currentArgs,
        {
          id: `${targetOp.id}-arg-${Date.now().toString(36).slice(-4)}`,
          name: `arg${currentArgs.length + 1}`,
          type: "string"
        }
      ];
      ops[opIdx] = {
        ...targetOp,
        parameters: nextArgs,
        signature: buildOperationSignature(nextArgs)
      };
      store().dispatchOperation({ type: "uml.updateNode", nodeId: node.id, operations: ops });
    }
    function updateNodeOperationArgInline(node, opIdx, argIdx, partial) {
      const ops = [...node.operations ?? []];
      const targetOp = ops[opIdx];
      if (!targetOp) return;
      const nextArgs = [...extractOperationParameters(targetOp)];
      if (!nextArgs[argIdx]) return;
      nextArgs[argIdx] = { ...nextArgs[argIdx], ...partial };
      ops[opIdx] = {
        ...targetOp,
        parameters: nextArgs,
        signature: buildOperationSignature(nextArgs)
      };
      store().dispatchOperation({ type: "uml.updateNode", nodeId: node.id, operations: ops });
    }
    function removeNodeOperationArgInline(node, opIdx, argIdx) {
      const ops = [...node.operations ?? []];
      const targetOp = ops[opIdx];
      if (!targetOp) return;
      const nextArgs = extractOperationParameters(targetOp).filter((_, i) => i !== argIdx);
      ops[opIdx] = {
        ...targetOp,
        parameters: nextArgs,
        signature: buildOperationSignature(nextArgs)
      };
      store().dispatchOperation({ type: "uml.updateNode", nodeId: node.id, operations: ops });
    }
    function handleNodeContextMenu(e, node) {
      e.preventDefault();
      e.stopPropagation();
      if (!store().selectedIds.includes(node.id)) {
        store().selectSingle(node.id, false);
      }
      const kindDesc = getUmlNodeKind(node.kind);
      const items = [
        {
          label: "Edit Inline",
          action: () => {
            startInlineNodeEdit(node);
          }
        },
        ...node.kind === "shape" ? [
          {
            label: "Change Shape",
            submenu: UML_SHAPE_GEOMETRIES.map((sh) => ({
              label: sh.label,
              action: () => store().dispatchOperation({ type: "uml.updateNode", nodeId: node.id, shape: sh.kind })
            }))
          }
        ] : [],
        ...kindDesc?.hasCompartments ? [
          {
            label: "Add Attribute",
            action: () => addNodeAttributeInline(node)
          },
          {
            label: "Add Operation",
            action: () => addNodeOperationInline(node)
          },
          {
            label: "Add Interface Endpoint",
            action: () => addNodeInterfaceInline(node)
          }
        ] : [],
        {
          label: "Copy",
          shortcut: "Ctrl+C",
          dividerBefore: true,
          action: () => store().copySelection()
        },
        {
          label: "Duplicate",
          shortcut: "Ctrl+D",
          action: () => duplicateSelected()
        },
        {
          label: "Paste as new",
          shortcut: "Ctrl+Shift+V",
          action: () => {
            store().copySelection();
            store().pasteClipboard(true);
          }
        },
        {
          label: "Delete Node",
          shortcut: "Del",
          danger: true,
          dividerBefore: true,
          action: () => deleteSelected()
        }
      ];
      store().openContextMenu(e.clientX, e.clientY, items, `${kindDesc?.label ?? node.kind}: ${node.name}`);
    }
    function startInlineNodeEdit(node) {
      if (get(inlineEditingNodeId) && get(inlineEditingNodeId) !== node.id) {
        commitInlineNodeEdit();
      }
      set(inlineEditingNodeId, node.id, true);
      set(inlineNodeNameDraft, node.name ?? "", true);
      set(inlineNodeStereotypeDraft, node.kind === "note" ? "" : node.stereotype ?? "", true);
    }
    function commitInlineNodeEdit(node) {
      const nodeId = get(inlineEditingNodeId);
      if (!nodeId) return;
      const targetNode = node ?? get(doc)?.nodes.find((n) => n.id === nodeId);
      set(inlineEditingNodeId, null);
      if (!targetNode) return;
      const nextName = get(inlineNodeNameDraft).trim();
      const nextStereo = get(inlineNodeStereotypeDraft).replace(/^[«<]+|[»>]+$/g, "").trim();
      const updates = {};
      if (nextName !== targetNode.name) {
        updates.name = nextName;
      }
      if (targetNode.kind !== "note" && nextStereo !== (targetNode.stereotype ?? "")) {
        updates.stereotype = nextStereo;
      }
      if (Object.keys(updates).length > 0) {
        store().dispatchOperation({ type: "uml.updateNode", nodeId: targetNode.id, ...updates });
      }
    }
    function startInlineEdgeLabelEdit(edge) {
      if (get(inlineEditingNodeId)) commitInlineNodeEdit();
      if (get(inlineEditingEdgeId) && get(inlineEditingEdgeId) !== edge.id) commitInlineEdgeLabel();
      if (get(inlineEditingMultiplicity)) commitInlineMultiplicity();
      set(inlineEditingEdgeId, edge.id, true);
      set(inlineEdgeLabelDraft, edge.label ?? "", true);
    }
    function commitInlineEdgeLabel(edge) {
      const edgeId = get(inlineEditingEdgeId);
      if (!edgeId) return;
      const targetEdge = edge ?? get(doc)?.edges.find((e) => e.id === edgeId);
      set(inlineEditingEdgeId, null);
      if (!targetEdge) return;
      const nextLabel = get(inlineEdgeLabelDraft).trim();
      if (nextLabel !== (targetEdge.label ?? "")) {
        store().dispatchOperation({
          type: "uml.updateEdge",
          edgeId: targetEdge.id,
          label: nextLabel
        });
      }
    }
    function startInlineMultiplicityEdit(edge, end) {
      if (get(inlineEditingNodeId)) commitInlineNodeEdit();
      if (get(inlineEditingEdgeId)) commitInlineEdgeLabel();
      if (get(inlineEditingMultiplicity)) commitInlineMultiplicity();
      set(
        inlineEditingMultiplicity,
        {
          edgeId: edge.id,
          end,
          draft: end === "start" ? edge.source.multiplicity ?? "" : edge.target.multiplicity ?? ""
        },
        true
      );
    }
    function commitInlineMultiplicity(edge) {
      if (!get(inlineEditingMultiplicity)) return;
      const { edgeId, end, draft } = get(inlineEditingMultiplicity);
      const targetEdge = edge ?? get(doc)?.edges.find((e) => e.id === edgeId);
      set(inlineEditingMultiplicity, null);
      if (!targetEdge) return;
      const cleaned = draft.trim();
      const prev = end === "start" ? targetEdge.source.multiplicity ?? "" : targetEdge.target.multiplicity ?? "";
      if (cleaned !== prev) {
        store().dispatchOperation({
          type: "uml.updateEdge",
          edgeId: targetEdge.id,
          ...end === "start" ? { sourceMultiplicity: cleaned } : { targetMultiplicity: cleaned }
        });
      }
    }
    function openEndpointPickerPopup(clientX, clientY, edge, end, current) {
      store().closeContextMenu();
      set(
        endpointPickerPopup,
        {
          x: Math.max(12, Math.min(clientX, window.innerWidth - 260)),
          y: Math.max(12, Math.min(clientY, window.innerHeight - 360)),
          edgeId: edge.id,
          end,
          current,
          multiplicityDraft: end === "start" ? edge.source.multiplicity ?? "" : edge.target.multiplicity ?? ""
        },
        true
      );
    }
    function handleEdgeContextMenu(e, edge) {
      e.preventDefault();
      e.stopPropagation();
      store().selectSingle(edge.id, false);
      const clickX = e.clientX;
      const clickY = e.clientY;
      store().openContextMenu(
        clickX,
        clickY,
        [
          {
            label: "Edit Relation Label",
            action: () => startInlineEdgeLabelEdit(edge)
          },
          {
            label: "Switch Direction",
            action: () => store().dispatchOperation({
              type: "uml.updateEdge",
              edgeId: edge.id,
              reverseDirection: true
            })
          },
          {
            label: "Change Relation Type",
            dividerBefore: true,
            submenu: relationPresets.map((preset) => ({
              label: preset.label,
              action: () => store().dispatchOperation({ type: "uml.updateEdge", edgeId: edge.id, kind: preset.kind })
            }))
          },
          {
            label: "Customize Start Endpoint\u2026",
            dividerBefore: true,
            action: () => openEndpointPickerPopup(clickX, clickY, edge, "start", edge.visual?.start ?? { shape: "none", size: 10 })
          },
          {
            label: "Customize End Endpoint\u2026",
            action: () => openEndpointPickerPopup(clickX, clickY, edge, "end", edge.visual?.end ?? { shape: "none", size: 10 })
          },
          {
            label: (edge.visual?.routing ?? "bezier") === "bezier" ? "Switch to Straight Routing" : "Switch to Smooth B\xE9zier Routing",
            dividerBefore: true,
            action: () => store().dispatchOperation({
              type: "uml.updateEdge",
              edgeId: edge.id,
              routing: (edge.visual?.routing ?? "bezier") === "bezier" ? "straight" : "bezier"
            })
          },
          {
            label: "Delete Relation",
            shortcut: "Del",
            danger: true,
            dividerBefore: true,
            action: () => deleteSelected()
          }
        ],
        `Relation: ${edge.source.nodeId} \u2192 ${edge.target.nodeId}`
      );
    }
    function renderEndpointPath(dec) {
      const shapeDesc = getEndpointShape(dec?.shape ?? "none");
      if (!shapeDesc || shapeDesc.kind === "none") {
        return { d: "", fill: "none" };
      }
      const size = dec?.size ?? shapeDesc.defaultSize;
      const d = shapeDesc.buildLocalPath(size);
      if (!shapeDesc.supportsFill) {
        return { d, fill: "none" };
      }
      const fillMode = dec?.fill ?? shapeDesc.defaultFill ?? "hollow";
      return {
        d,
        fill: fillMode === "filled" ? "var(--vscode-editor-foreground)" : "var(--vscode-editor-background)"
      };
    }
    function getEndpointVisualCenter(tip, angleDeg, dec) {
      const shapeDesc = getEndpointShape(dec?.shape ?? "none");
      if (!shapeDesc || shapeDesc.kind === "none") {
        return tip;
      }
      const size = dec?.size ?? shapeDesc.defaultSize;
      const rad = angleDeg * Math.PI / 180;
      return {
        x: tip.x - Math.cos(rad) * (size / 2),
        y: tip.y - Math.sin(rad) * (size / 2)
      };
    }
    function getMultiplicityLabelPoint(tip, angleDeg) {
      const rad = angleDeg * Math.PI / 180;
      const inwardDist = 22;
      const perpDist = -14;
      const dx = -Math.cos(rad) * inwardDist - Math.sin(rad) * perpDist;
      const dy = -Math.sin(rad) * inwardDist + Math.cos(rad) * perpDist;
      return { x: tip.x + dx, y: tip.y + dy };
    }
    function isSameEndpointChoice(a, b) {
      if (a.shape !== b.shape) return false;
      const desc = getEndpointShape(a.shape);
      if (!desc?.supportsFill) return true;
      return (a.fill ?? desc.defaultFill ?? "hollow") === (b.fill ?? desc.defaultFill ?? "hollow");
    }
    function buildShapeSvgPath(shape, w, h) {
      const pad = 2;
      const x0 = pad;
      const y0 = pad;
      const x1 = Math.max(pad + 10, w - pad);
      const y1 = Math.max(pad + 10, h - pad);
      const cx = w / 2;
      const cy = h / 2;
      switch (shape ?? "rectangle") {
        case "ellipse": {
          const rx = (x1 - x0) / 2;
          const ry = (y1 - y0) / 2;
          return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
        }
        case "rhombus": {
          return `M ${cx} ${y0} L ${x1} ${cy} L ${cx} ${y1} L ${x0} ${cy} Z`;
        }
        case "trapezoid": {
          const inset = Math.min(36, (x1 - x0) * 0.2);
          return `M ${x0 + inset} ${y0} L ${x1 - inset} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
        }
        case "parallelogram": {
          const skew = Math.min(32, (x1 - x0) * 0.18);
          return `M ${x0 + skew} ${y0} L ${x1} ${y0} L ${x1 - skew} ${y1} L ${x0} ${y1} Z`;
        }
        case "rectangle":
        default: {
          return `M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
        }
      }
    }
    function exportDiagramToSvg() {
      if (!get(doc)) return;
      const layouts = Object.values(get(effectiveNodeLayouts));
      let minX = 0;
      let minY = 0;
      let maxX = 800;
      let maxY = 600;
      if (layouts.length > 0) {
        minX = Math.min(...layouts.map((b) => b.x)) - 40;
        minY = Math.min(...layouts.map((b) => b.y)) - 40;
        maxX = Math.max(...layouts.map((b) => b.x + b.width)) + 40;
        maxY = Math.max(...layouts.map((b) => b.y + b.height)) + 40;
      }
      const w = Math.max(400, maxX - minX);
      const h = Math.max(300, maxY - minY);
      const escapeXml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      const nodeRectsSvg = get(doc).nodes.map((n) => {
        const b = get(effectiveNodeLayouts)[n.id];
        if (!b) return "";
        return `<g transform="translate(${b.x}, ${b.y})">
          <rect width="${b.width}" height="${b.height}" rx="6" fill="#1e1e1e" stroke="#569cd6" stroke-width="1.5"/>
          <text x="${b.width / 2}" y="24" text-anchor="middle" fill="#d4d4d4" font-family="sans-serif" font-weight="bold" font-size="13">${escapeXml(n.name)}</text>
        </g>`;
      }).join("\n");
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}" width="${w}" height="${h}">
  ${nodeRectsSvg}
</svg>`;
      postToHost({ type: "webview.exportSvgContent", svgContent });
    }
    var div = root_38();
    event("pointermove", $window, handleWindowPointerMove);
    event("pointerup", $window, handleWindowPointerUp);
    event("pointercancel", $window, cancelGesture);
    event("keydown", $window, handleKeyDown);
    event("keyup", $window, handleKeyUp);
    var div_1 = child(div);
    var div_2 = child(div_1);
    let classes;
    var div_3 = child(div_2);
    var button = child(div_3);
    var button_1 = sibling(button, 2);
    var text2 = only_child(button_1);
    var button_2 = sibling(button_1, 2);
    reset(div_3);
    var node_2 = sibling(div_3, 2);
    {
      var consequent_40 = ($$anchor2) => {
        var fragment_1 = root_37();
        var svg_2 = first_child(fragment_1);
        var g_1 = child(svg_2);
        each(g_1, 21, () => get(doc).edges, (edge) => edge.id, ($$anchor3, edge) => {
          const srcBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).source.nodeId]);
          const tgtBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).target.nodeId]);
          const srcNode = user_derived(() => get(doc).nodes.find((n) => n.id === get(edge).source.nodeId));
          const tgtNode = user_derived(() => get(doc).nodes.find((n) => n.id === get(edge).target.nodeId));
          var fragment_2 = comment();
          var node_3 = first_child(fragment_2);
          {
            var consequent_6 = ($$anchor4) => {
              const touchesNote = user_derived(() => get(srcNode)?.kind === "note" || get(tgtNode)?.kind === "note");
              const isDashed = user_derived(() => (get(edge).visual?.line ?? (get(touchesNote) ? "dashed" : "solid")) === "dashed");
              const startDec = user_derived(() => get(edge).visual?.start ?? { shape: "none", size: 10 });
              const endDec = user_derived(() => get(edge).visual?.end ?? { shape: "none", size: 10 });
              const geom = user_derived(() => computeUmlEdgeGeometry(get(srcBox), get(tgtBox), get(edge).visual?.routing ?? "bezier", get(startDec), get(endDec), get(edgeParallelOffsets)[get(edge).id] ?? 0));
              const startMarker = user_derived(() => renderEndpointPath(get(startDec)));
              const endMarker = user_derived(() => renderEndpointPath(get(endDec)));
              const startCenter = user_derived(() => getEndpointVisualCenter(get(geom).startTip, get(geom).startAngleDeg, get(startDec)));
              const endCenter = user_derived(() => getEndpointVisualCenter(get(geom).endTip, get(geom).endAngleDeg, get(endDec)));
              const startMultPt = user_derived(() => getMultiplicityLabelPoint(get(geom).startTip, get(geom).startAngleDeg));
              const endMultPt = user_derived(() => getMultiplicityLabelPoint(get(geom).endTip, get(geom).endAngleDeg));
              const isEdgeSelected = user_derived(() => store().selectedIds.includes(get(edge).id) || store().selectedIds.includes(get(edge).source.nodeId) && store().selectedIds.includes(get(edge).target.nodeId));
              var g_2 = root_54();
              let classes_1;
              var path = child(g_2);
              var path_1 = sibling(path);
              var node_4 = sibling(path_1);
              {
                var consequent_1 = ($$anchor5) => {
                  var path_2 = root_211();
                  template_effect(() => {
                    set_attribute2(path_2, "d", get(startMarker).d);
                    set_attribute2(path_2, "fill", get(startMarker).fill);
                    set_attribute2(path_2, "transform", `translate(${get(geom).startTip.x ?? ""}, ${get(geom).startTip.y ?? ""}) rotate(${get(geom).startAngleDeg ?? ""})`);
                  });
                  append($$anchor5, path_2);
                };
                if_block(node_4, ($$render) => {
                  if (get(startMarker).d) $$render(consequent_1);
                });
              }
              var node_5 = sibling(node_4);
              {
                var consequent_2 = ($$anchor5) => {
                  var path_3 = root_211();
                  template_effect(() => {
                    set_attribute2(path_3, "d", get(endMarker).d);
                    set_attribute2(path_3, "fill", get(endMarker).fill);
                    set_attribute2(path_3, "transform", `translate(${get(geom).endTip.x ?? ""}, ${get(geom).endTip.y ?? ""}) rotate(${get(geom).endAngleDeg ?? ""})`);
                  });
                  append($$anchor5, path_3);
                };
                if_block(node_5, ($$render) => {
                  if (get(endMarker).d) $$render(consequent_2);
                });
              }
              var node_6 = sibling(node_5);
              {
                var consequent_3 = ($$anchor5) => {
                  var g_3 = root_35();
                  var rect_1 = child(g_3);
                  var text_1 = sibling(rect_1);
                  var text_2 = only_child(text_1, true);
                  reset(g_3);
                  template_effect(() => {
                    set_attribute2(g_3, "transform", `translate(${get(startMultPt).x ?? ""}, ${get(startMultPt).y ?? ""})`);
                    set_attribute2(rect_1, "x", -(get(edge).source.multiplicity.length * 3.8 + 6));
                    set_attribute2(rect_1, "width", get(edge).source.multiplicity.length * 7.6 + 12);
                    set_text(text_2, get(edge).source.multiplicity);
                  });
                  delegated("click", g_3, (e) => {
                    e.stopPropagation();
                    store().selectSingle(get(edge).id, false);
                  });
                  delegated("dblclick", g_3, (e) => {
                    e.stopPropagation();
                    if (store().isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                    startInlineMultiplicityEdit(get(edge), "start");
                  });
                  append($$anchor5, g_3);
                };
                if_block(node_6, ($$render) => {
                  if (get(edge).source.multiplicity) $$render(consequent_3);
                });
              }
              var node_7 = sibling(node_6);
              {
                var consequent_4 = ($$anchor5) => {
                  var g_4 = root_35();
                  var rect_2 = child(g_4);
                  var text_3 = sibling(rect_2);
                  var text_4 = only_child(text_3, true);
                  reset(g_4);
                  template_effect(() => {
                    set_attribute2(g_4, "transform", `translate(${get(endMultPt).x ?? ""}, ${get(endMultPt).y ?? ""})`);
                    set_attribute2(rect_2, "x", -(get(edge).target.multiplicity.length * 3.8 + 6));
                    set_attribute2(rect_2, "width", get(edge).target.multiplicity.length * 7.6 + 12);
                    set_text(text_4, get(edge).target.multiplicity);
                  });
                  delegated("click", g_4, (e) => {
                    e.stopPropagation();
                    store().selectSingle(get(edge).id, false);
                  });
                  delegated("dblclick", g_4, (e) => {
                    e.stopPropagation();
                    if (store().isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                    startInlineMultiplicityEdit(get(edge), "end");
                  });
                  append($$anchor5, g_4);
                };
                if_block(node_7, ($$render) => {
                  if (get(edge).target.multiplicity) $$render(consequent_4);
                });
              }
              var node_8 = sibling(node_7);
              {
                var consequent_5 = ($$anchor5) => {
                  var g_5 = root_45();
                  var rect_3 = child(g_5);
                  var text_5 = sibling(rect_3);
                  var text_6 = only_child(text_5, true);
                  reset(g_5);
                  template_effect(() => {
                    set_attribute2(g_5, "transform", `translate(${get(geom).labelPoint.x ?? ""}, ${get(geom).labelPoint.y ?? ""})`);
                    set_attribute2(rect_3, "x", -(get(edge).label.length * 3.8 + 8));
                    set_attribute2(rect_3, "width", get(edge).label.length * 7.6 + 16);
                    set_text(text_6, get(edge).label);
                  });
                  delegated("click", g_5, (e) => {
                    e.stopPropagation();
                    store().selectSingle(get(edge).id, e.shiftKey || e.metaKey || e.ctrlKey);
                  });
                  delegated("dblclick", g_5, (e) => {
                    e.stopPropagation();
                    if (store().isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                    startInlineEdgeLabelEdit(get(edge));
                  });
                  append($$anchor5, g_5);
                };
                if_block(node_8, ($$render) => {
                  if (get(edge).label && get(inlineEditingEdgeId) !== get(edge).id) $$render(consequent_5);
                });
              }
              reset(g_2);
              template_effect(() => {
                classes_1 = set_class(g_2, 0, "vz-edge-group", null, classes_1, { selected: get(isEdgeSelected) });
                set_attribute2(path, "d", get(geom).hitPathD);
                set_attribute2(path_1, "d", get(geom).pathD);
                set_attribute2(path_1, "stroke-dasharray", get(isDashed) ? "6 4" : void 0);
              });
              delegated("contextmenu", g_2, (e) => handleEdgeContextMenu(e, get(edge)));
              delegated("click", path, (e) => {
                e.stopPropagation();
                store().selectSingle(get(edge).id, e.shiftKey || e.metaKey || e.ctrlKey);
              });
              delegated("dblclick", path, (e) => {
                e.stopPropagation();
                if (store().isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                startInlineEdgeLabelEdit(get(edge));
              });
              append($$anchor4, g_2);
            };
            if_block(node_3, ($$render) => {
              if (get(srcBox) && get(tgtBox)) $$render(consequent_6);
            });
          }
          append($$anchor3, fragment_2);
        });
        reset(g_1);
        reset(svg_2);
        var div_4 = sibling(svg_2, 2);
        each(div_4, 21, () => get(doc).nodes, (node) => node.id, ($$anchor3, node) => {
          const box = user_derived(() => get(effectiveNodeLayouts)[get(node).id]);
          const isSelected = user_derived(() => store().selectedIds.includes(get(node).id));
          const isInlineEditing = user_derived(() => get(inlineEditingNodeId) === get(node).id);
          const kindDesc = user_derived(() => getUmlNodeKind(get(node).kind));
          const attrsVisible = user_derived(() => get(node).showAttributes !== false);
          const opsVisible = user_derived(() => get(node).showOperations !== false);
          var fragment_3 = comment();
          var node_9 = first_child(fragment_3);
          {
            var consequent_26 = ($$anchor4) => {
              var div_5 = root_282();
              let classes_2;
              var node_10 = child(div_5);
              {
                var consequent_9 = ($$anchor5) => {
                  var fragment_4 = root_93();
                  var svg_3 = first_child(fragment_4);
                  var path_4 = only_child(svg_3);
                  var div_6 = sibling(svg_3, 2);
                  var node_11 = child(div_6);
                  {
                    var consequent_7 = ($$anchor6) => {
                      var fragment_5 = root_64();
                      var input = first_child(fragment_5);
                      remove_input_defaults(input);
                      autofocus(input, true);
                      var input_1 = sibling(input, 2);
                      remove_input_defaults(input_1);
                      event("blur", input, () => commitInlineNodeEdit(get(node)));
                      delegated("keydown", input, (ke) => {
                        if (ke.key === "Enter") {
                          commitInlineNodeEdit(get(node));
                        } else if (ke.key === "Escape") {
                          set(inlineEditingNodeId, null);
                        }
                      });
                      bind_value(input, () => get(inlineNodeNameDraft), ($$value) => set(inlineNodeNameDraft, $$value));
                      event("blur", input_1, () => commitInlineNodeEdit(get(node)));
                      delegated("keydown", input_1, (ke) => {
                        if (ke.key === "Enter") {
                          commitInlineNodeEdit(get(node));
                        } else if (ke.key === "Escape") {
                          set(inlineEditingNodeId, null);
                        }
                      });
                      bind_value(input_1, () => get(inlineNodeStereotypeDraft), ($$value) => set(inlineNodeStereotypeDraft, $$value));
                      append($$anchor6, fragment_5);
                    };
                    var alternate_1 = ($$anchor6) => {
                      var fragment_6 = root_83();
                      var div_7 = first_child(fragment_6);
                      var text_7 = only_child(div_7, true);
                      var node_12 = sibling(div_7, 2);
                      {
                        var consequent_8 = ($$anchor7) => {
                          var div_8 = root_74();
                          var text_8 = only_child(div_8);
                          template_effect(() => set_text(text_8, `\xAB${get(node).stereotype ?? ""}\xBB`));
                          append($$anchor7, div_8);
                        };
                        if_block(node_12, ($$render) => {
                          if (get(node).stereotype) $$render(consequent_8);
                        });
                      }
                      template_effect(() => set_text(text_7, get(node).name));
                      append($$anchor6, fragment_6);
                    };
                    if_block(node_11, ($$render) => {
                      if (get(isInlineEditing)) $$render(consequent_7);
                      else $$render(alternate_1, -1);
                    });
                  }
                  reset(div_6);
                  template_effect(
                    ($0) => {
                      set_attribute2(svg_3, "width", get(box).width);
                      set_attribute2(svg_3, "height", get(box).height);
                      set_attribute2(svg_3, "viewBox", `0 0 ${get(box).width ?? ""} ${get(box).height ?? ""}`);
                      set_attribute2(path_4, "d", $0);
                    },
                    [
                      () => buildShapeSvgPath(get(node).shape, get(box).width, get(box).height)
                    ]
                  );
                  append($$anchor5, fragment_4);
                };
                var alternate_7 = ($$anchor5) => {
                  var fragment_7 = root_252();
                  var div_9 = first_child(fragment_7);
                  var node_13 = child(div_9);
                  {
                    var consequent_11 = ($$anchor6) => {
                      var fragment_8 = root_113();
                      var input_2 = first_child(fragment_8);
                      remove_input_defaults(input_2);
                      autofocus(input_2, true);
                      var node_14 = sibling(input_2, 2);
                      {
                        var consequent_10 = ($$anchor7) => {
                          var input_3 = root_103();
                          remove_input_defaults(input_3);
                          event("blur", input_3, () => commitInlineNodeEdit(get(node)));
                          delegated("keydown", input_3, (ke) => {
                            if (ke.key === "Enter") {
                              commitInlineNodeEdit(get(node));
                            } else if (ke.key === "Escape") {
                              set(inlineEditingNodeId, null);
                            }
                          });
                          bind_value(input_3, () => get(inlineNodeStereotypeDraft), ($$value) => set(inlineNodeStereotypeDraft, $$value));
                          append($$anchor7, input_3);
                        };
                        if_block(node_14, ($$render) => {
                          if (get(node).kind !== "note") $$render(consequent_10);
                        });
                      }
                      event("blur", input_2, () => commitInlineNodeEdit(get(node)));
                      delegated("keydown", input_2, (ke) => {
                        if (ke.key === "Enter") {
                          commitInlineNodeEdit(get(node));
                        } else if (ke.key === "Escape") {
                          set(inlineEditingNodeId, null);
                        }
                      });
                      bind_value(input_2, () => get(inlineNodeNameDraft), ($$value) => set(inlineNodeNameDraft, $$value));
                      append($$anchor6, fragment_8);
                    };
                    var alternate_2 = ($$anchor6) => {
                      var fragment_9 = root_83();
                      var div_10 = first_child(fragment_9);
                      var text_9 = only_child(div_10, true);
                      var node_15 = sibling(div_10, 2);
                      {
                        var consequent_12 = ($$anchor7) => {
                          var div_11 = root_74();
                          var text_10 = only_child(div_11);
                          template_effect(() => set_text(text_10, `\xAB${(get(node).stereotype || get(kindDesc)?.defaultStereotype) ?? ""}\xBB`));
                          append($$anchor7, div_11);
                        };
                        var consequent_13 = ($$anchor7) => {
                          var div_12 = root_74();
                          var text_11 = only_child(div_12);
                          template_effect(() => set_text(text_11, `\xABunsupported: ${get(node).kind ?? ""}\xBB`));
                          append($$anchor7, div_12);
                        };
                        if_block(node_15, ($$render) => {
                          if (get(node).kind !== "note" && (get(node).stereotype || get(kindDesc)?.defaultStereotype)) $$render(consequent_12);
                          else if (!get(kindDesc)) $$render(consequent_13, 1);
                        });
                      }
                      template_effect(() => set_text(text_9, get(node).name));
                      append($$anchor6, fragment_9);
                    };
                    if_block(node_13, ($$render) => {
                      if (get(isInlineEditing)) $$render(consequent_11);
                      else $$render(alternate_2, -1);
                    });
                  }
                  reset(div_9);
                  var node_16 = sibling(div_9, 2);
                  {
                    var consequent_15 = ($$anchor6) => {
                      var fragment_10 = comment();
                      var node_17 = first_child(fragment_10);
                      {
                        var consequent_14 = ($$anchor7) => {
                          var div_13 = root_124();
                          var textarea = child(div_13);
                          remove_textarea_child(textarea);
                          reset(div_13);
                          template_effect(() => set_value(textarea, get(node).text ?? ""));
                          event("blur", textarea, (ev) => {
                            if (ev.currentTarget.value !== (get(node).text ?? "")) {
                              store().dispatchOperation({
                                type: "uml.updateNode",
                                nodeId: get(node).id,
                                text: ev.currentTarget.value
                              });
                            }
                          });
                          delegated("change", textarea, (ev) => store().dispatchOperation({
                            type: "uml.updateNode",
                            nodeId: get(node).id,
                            text: ev.currentTarget.value
                          }));
                          delegated("keydown", textarea, (ke) => {
                            if (ke.key === "Escape") set(inlineEditingNodeId, null);
                          });
                          append($$anchor7, div_13);
                        };
                        var alternate_3 = ($$anchor7) => {
                          var div_14 = root_134();
                          var text_12 = only_child(div_14, true);
                          template_effect(() => set_text(text_12, get(node).text || get(node).name));
                          append($$anchor7, div_14);
                        };
                        if_block(node_17, ($$render) => {
                          if (get(isInlineEditing)) $$render(consequent_14);
                          else $$render(alternate_3, -1);
                        });
                      }
                      append($$anchor6, fragment_10);
                    };
                    var alternate_6 = ($$anchor6) => {
                      var fragment_11 = root_243();
                      var node_18 = first_child(fragment_11);
                      {
                        var consequent_19 = ($$anchor7) => {
                          var div_15 = root_192();
                          var node_19 = child(div_15);
                          {
                            var consequent_17 = ($$anchor8) => {
                              var fragment_12 = root_163();
                              var div_16 = first_child(fragment_12);
                              var button_3 = sibling(child(div_16), 2);
                              let classes_3;
                              var node_20 = child(button_3);
                              eyeIcon2(node_20, () => get(attrsVisible));
                              reset(button_3);
                              reset(div_16);
                              var node_21 = sibling(div_16, 2);
                              {
                                var consequent_16 = ($$anchor9) => {
                                  var fragment_13 = root_153();
                                  var node_22 = first_child(fragment_13);
                                  each(node_22, 19, () => get(node).attributes ?? [], (attr2) => attr2.id, ($$anchor10, attr2, idx) => {
                                    var div_17 = root_144();
                                    var node_23 = child(div_17);
                                    {
                                      let $0 = user_derived(() => get(attr2).visibility ?? "+");
                                      VisibilityPicker(node_23, {
                                        compact: true,
                                        get value() {
                                          return get($0);
                                        },
                                        ariaLabel: "Attribute visibility",
                                        onSelect: (nextVis) => updateNodeAttributeInline(get(node), get(idx), { visibility: nextVis })
                                      });
                                    }
                                    var input_4 = sibling(node_23, 2);
                                    remove_input_defaults(input_4);
                                    var input_5 = sibling(input_4, 2);
                                    remove_input_defaults(input_5);
                                    var button_4 = sibling(input_5, 2);
                                    reset(div_17);
                                    template_effect(() => {
                                      set_value(input_4, get(attr2).name);
                                      set_value(input_5, get(attr2).type ?? "");
                                    });
                                    event("blur", input_4, (ev) => {
                                      if (ev.currentTarget.value !== get(attr2).name) {
                                        updateNodeAttributeInline(get(node), get(idx), { name: ev.currentTarget.value });
                                      }
                                    });
                                    delegated("change", input_4, (ev) => updateNodeAttributeInline(get(node), get(idx), { name: ev.currentTarget.value }));
                                    event("blur", input_5, (ev) => {
                                      if (ev.currentTarget.value !== (get(attr2).type ?? "")) {
                                        updateNodeAttributeInline(get(node), get(idx), { type: ev.currentTarget.value });
                                      }
                                    });
                                    delegated("change", input_5, (ev) => updateNodeAttributeInline(get(node), get(idx), { type: ev.currentTarget.value }));
                                    delegated("click", button_4, () => removeNodeAttributeInline(get(node), get(idx)));
                                    append($$anchor10, div_17);
                                  });
                                  var button_5 = sibling(node_22, 2);
                                  delegated("click", button_5, () => addNodeAttributeInline(get(node)));
                                  append($$anchor9, fragment_13);
                                };
                                if_block(node_21, ($$render) => {
                                  if (get(attrsVisible)) $$render(consequent_16);
                                });
                              }
                              template_effect(() => {
                                classes_3 = set_class(button_3, 1, "vz-eye-toggle-btn", null, classes_3, { off: !get(attrsVisible) });
                                set_attribute2(button_3, "title", get(attrsVisible) ? "Hide Attributes" : "Show Attributes");
                              });
                              delegated("click", button_3, (e) => {
                                e.stopPropagation();
                                store().dispatchOperation({
                                  type: "uml.updateNode",
                                  nodeId: get(node).id,
                                  showAttributes: !get(attrsVisible)
                                });
                              });
                              append($$anchor8, fragment_12);
                            };
                            var alternate_4 = ($$anchor8) => {
                              var fragment_14 = comment();
                              var node_24 = first_child(fragment_14);
                              each(node_24, 17, () => get(node).attributes ?? [], (attr2) => attr2.id, ($$anchor9, attr2) => {
                                var div_18 = root_183();
                                var span = child(div_18);
                                var text_13 = only_child(span, true);
                                var span_1 = sibling(span, 2);
                                var text_14 = only_child(span_1, true);
                                var node_25 = sibling(span_1, 2);
                                {
                                  var consequent_18 = ($$anchor10) => {
                                    var span_2 = root_173();
                                    var text_15 = only_child(span_2);
                                    template_effect(() => set_text(text_15, `: ${get(attr2).type ?? ""}`));
                                    append($$anchor10, span_2);
                                  };
                                  if_block(node_25, ($$render) => {
                                    if (get(attr2).type) $$render(consequent_18);
                                  });
                                }
                                reset(div_18);
                                template_effect(
                                  ($0) => {
                                    set_text(text_13, $0);
                                    set_text(text_14, get(attr2).name);
                                  },
                                  [() => formatVisibilitySign(get(attr2).visibility)]
                                );
                                append($$anchor9, div_18);
                              });
                              append($$anchor8, fragment_14);
                            };
                            if_block(node_19, ($$render) => {
                              if (get(isInlineEditing)) $$render(consequent_17);
                              else $$render(alternate_4, -1);
                            });
                          }
                          reset(div_15);
                          append($$anchor7, div_15);
                        };
                        if_block(node_18, ($$render) => {
                          if (get(attrsVisible) || get(isInlineEditing)) $$render(consequent_19);
                        });
                      }
                      var node_26 = sibling(node_18, 2);
                      {
                        var consequent_23 = ($$anchor7) => {
                          var div_19 = root_192();
                          var node_27 = child(div_19);
                          {
                            var consequent_21 = ($$anchor8) => {
                              var fragment_15 = root_233();
                              var div_20 = first_child(fragment_15);
                              var button_6 = sibling(child(div_20), 2);
                              let classes_4;
                              var node_28 = child(button_6);
                              eyeIcon2(node_28, () => get(opsVisible));
                              reset(button_6);
                              reset(div_20);
                              var node_29 = sibling(div_20, 2);
                              {
                                var consequent_20 = ($$anchor9) => {
                                  var fragment_16 = root_223();
                                  var node_30 = first_child(fragment_16);
                                  each(node_30, 19, () => get(node).operations ?? [], (op) => op.id, ($$anchor10, op, idx) => {
                                    const opArgs = user_derived(() => extractOperationParameters(get(op)));
                                    var div_21 = root_212();
                                    var div_22 = child(div_21);
                                    var node_31 = child(div_22);
                                    {
                                      let $0 = user_derived(() => get(op).visibility ?? "+");
                                      VisibilityPicker(node_31, {
                                        compact: true,
                                        get value() {
                                          return get($0);
                                        },
                                        ariaLabel: "Operation visibility",
                                        onSelect: (nextVis) => updateNodeOperationInline(get(node), get(idx), { visibility: nextVis })
                                      });
                                    }
                                    var input_6 = sibling(node_31, 2);
                                    remove_input_defaults(input_6);
                                    var input_7 = sibling(input_6, 2);
                                    remove_input_defaults(input_7);
                                    var button_7 = sibling(input_7, 2);
                                    reset(div_22);
                                    var div_23 = sibling(div_22, 2);
                                    var node_32 = child(div_23);
                                    each(node_32, 19, () => get(opArgs), (argItem) => argItem.id, ($$anchor11, argItem, aIdx) => {
                                      var div_24 = root_202();
                                      var input_8 = child(div_24);
                                      remove_input_defaults(input_8);
                                      var input_9 = sibling(input_8, 2);
                                      remove_input_defaults(input_9);
                                      var button_8 = sibling(input_9, 2);
                                      reset(div_24);
                                      template_effect(() => {
                                        set_value(input_8, get(argItem).name);
                                        set_value(input_9, get(argItem).type ?? "");
                                      });
                                      event("blur", input_8, (ev) => {
                                        if (ev.currentTarget.value !== get(argItem).name) {
                                          updateNodeOperationArgInline(get(node), get(idx), get(aIdx), { name: ev.currentTarget.value });
                                        }
                                      });
                                      delegated("change", input_8, (ev) => updateNodeOperationArgInline(get(node), get(idx), get(aIdx), { name: ev.currentTarget.value }));
                                      event("blur", input_9, (ev) => {
                                        if (ev.currentTarget.value !== (get(argItem).type ?? "")) {
                                          updateNodeOperationArgInline(get(node), get(idx), get(aIdx), { type: ev.currentTarget.value });
                                        }
                                      });
                                      delegated("change", input_9, (ev) => updateNodeOperationArgInline(get(node), get(idx), get(aIdx), { type: ev.currentTarget.value }));
                                      delegated("click", button_8, () => removeNodeOperationArgInline(get(node), get(idx), get(aIdx)));
                                      append($$anchor11, div_24);
                                    });
                                    var button_9 = sibling(node_32, 2);
                                    reset(div_23);
                                    reset(div_21);
                                    template_effect(() => {
                                      set_value(input_6, get(op).name);
                                      set_value(input_7, get(op).returnType ?? "");
                                    });
                                    event("blur", input_6, (ev) => {
                                      if (ev.currentTarget.value !== get(op).name) {
                                        updateNodeOperationInline(get(node), get(idx), { name: ev.currentTarget.value });
                                      }
                                    });
                                    delegated("change", input_6, (ev) => updateNodeOperationInline(get(node), get(idx), { name: ev.currentTarget.value }));
                                    event("blur", input_7, (ev) => {
                                      if (ev.currentTarget.value !== (get(op).returnType ?? "")) {
                                        updateNodeOperationInline(get(node), get(idx), { returnType: ev.currentTarget.value });
                                      }
                                    });
                                    delegated("change", input_7, (ev) => updateNodeOperationInline(get(node), get(idx), { returnType: ev.currentTarget.value }));
                                    delegated("click", button_7, () => removeNodeOperationInline(get(node), get(idx)));
                                    delegated("click", button_9, () => addNodeOperationArgInline(get(node), get(idx)));
                                    append($$anchor10, div_21);
                                  });
                                  var button_10 = sibling(node_30, 2);
                                  delegated("click", button_10, () => addNodeOperationInline(get(node)));
                                  append($$anchor9, fragment_16);
                                };
                                if_block(node_29, ($$render) => {
                                  if (get(opsVisible)) $$render(consequent_20);
                                });
                              }
                              template_effect(() => {
                                classes_4 = set_class(button_6, 1, "vz-eye-toggle-btn", null, classes_4, { off: !get(opsVisible) });
                                set_attribute2(button_6, "title", get(opsVisible) ? "Hide Operations" : "Show Operations");
                              });
                              delegated("click", button_6, (e) => {
                                e.stopPropagation();
                                store().dispatchOperation({
                                  type: "uml.updateNode",
                                  nodeId: get(node).id,
                                  showOperations: !get(opsVisible)
                                });
                              });
                              append($$anchor8, fragment_15);
                            };
                            var alternate_5 = ($$anchor8) => {
                              var fragment_17 = comment();
                              var node_33 = first_child(fragment_17);
                              each(node_33, 17, () => get(node).operations ?? [], (op) => op.id, ($$anchor9, op) => {
                                var div_25 = root_183();
                                var span_3 = child(div_25);
                                var text_16 = only_child(span_3, true);
                                var span_4 = sibling(span_3, 2);
                                var text_17 = only_child(span_4);
                                var node_34 = sibling(span_4, 2);
                                {
                                  var consequent_22 = ($$anchor10) => {
                                    var span_5 = root_173();
                                    var text_18 = only_child(span_5);
                                    template_effect(() => set_text(text_18, `: ${get(op).returnType ?? ""}`));
                                    append($$anchor10, span_5);
                                  };
                                  if_block(node_34, ($$render) => {
                                    if (get(op).returnType) $$render(consequent_22);
                                  });
                                }
                                reset(div_25);
                                template_effect(
                                  ($0) => {
                                    set_text(text_16, $0);
                                    set_text(text_17, `${get(op).name ?? ""}${get(op).signature ?? "()" ?? ""}`);
                                  },
                                  [() => formatVisibilitySign(get(op).visibility)]
                                );
                                append($$anchor9, div_25);
                              });
                              append($$anchor8, fragment_17);
                            };
                            if_block(node_27, ($$render) => {
                              if (get(isInlineEditing)) $$render(consequent_21);
                              else $$render(alternate_5, -1);
                            });
                          }
                          reset(div_19);
                          append($$anchor7, div_19);
                        };
                        if_block(node_26, ($$render) => {
                          if (get(opsVisible) || get(isInlineEditing)) $$render(consequent_23);
                        });
                      }
                      append($$anchor6, fragment_11);
                    };
                    if_block(node_16, ($$render) => {
                      if (get(node).kind === "note") $$render(consequent_15);
                      else $$render(alternate_6, -1);
                    });
                  }
                  append($$anchor5, fragment_7);
                };
                if_block(node_10, ($$render) => {
                  if (get(node).kind === "shape") $$render(consequent_9);
                  else $$render(alternate_7, -1);
                });
              }
              var node_35 = sibling(node_10, 2);
              {
                var consequent_25 = ($$anchor5) => {
                  var fragment_18 = root_272();
                  var div_26 = first_child(fragment_18);
                  var node_36 = sibling(div_26, 2);
                  {
                    var consequent_24 = ($$anchor6) => {
                      var div_27 = root_262();
                      delegated("pointerdown", div_27, (e) => handleResizeHandlePointerDown(e, get(node)));
                      append($$anchor6, div_27);
                    };
                    if_block(node_36, ($$render) => {
                      if (get(isSelected)) $$render(consequent_24);
                    });
                  }
                  delegated("pointerdown", div_26, (e) => handleConnectPortPointerDown(e, get(node)));
                  append($$anchor5, fragment_18);
                };
                if_block(node_35, ($$render) => {
                  if (!store().isReadOnly && get(kindDesc)) $$render(consequent_25);
                });
              }
              reset(div_5);
              template_effect(() => {
                classes_2 = set_class(div_5, 1, `vz-uml-node kind-${get(node).kind ?? ""}`, null, classes_2, {
                  selected: get(isSelected),
                  "inline-editing": get(isInlineEditing),
                  unsupported: !get(kindDesc)
                });
                set_style(div_5, `left: ${get(box).x ?? ""}px; top: ${get(box).y ?? ""}px; width: ${get(box).width ?? ""}px; min-height: ${get(box).height ?? ""}px; ${get(node).kind === "shape" ? `height: ${get(box).height}px;` : ""}`);
                set_attribute2(div_5, "aria-label", `UML ${get(node).kind ?? ""} ${get(node).name ?? ""}`);
              });
              delegated("pointerdown", div_5, (e) => handleNodePointerDown(e, get(node)));
              delegated("contextmenu", div_5, (e) => handleNodeContextMenu(e, get(node)));
              delegated("dblclick", div_5, (e) => {
                e.stopPropagation();
                if (store().isReadOnly || !get(kindDesc) || e.shiftKey || e.ctrlKey || e.metaKey) return;
                startInlineNodeEdit(get(node));
              });
              append($$anchor4, div_5);
            };
            if_block(node_9, ($$render) => {
              if (get(box)) $$render(consequent_26);
            });
          }
          append($$anchor3, fragment_3);
        });
        reset(div_4);
        var svg_4 = sibling(div_4, 2);
        var g_6 = child(svg_4);
        var node_37 = child(g_6);
        {
          var consequent_29 = ($$anchor3) => {
            var fragment_19 = comment();
            var node_38 = first_child(fragment_19);
            each(node_38, 17, () => get(doc).edges, (edge) => edge.id, ($$anchor4, edge) => {
              const isEdgeSelected = user_derived(() => store().selectedIds.includes(get(edge).id) || store().selectedIds.includes(get(edge).source.nodeId) && store().selectedIds.includes(get(edge).target.nodeId));
              var fragment_20 = comment();
              var node_39 = first_child(fragment_20);
              {
                var consequent_28 = ($$anchor5) => {
                  const srcBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).source.nodeId]);
                  const tgtBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).target.nodeId]);
                  var fragment_21 = comment();
                  var node_40 = first_child(fragment_21);
                  {
                    var consequent_27 = ($$anchor6) => {
                      const startDec = user_derived(() => get(edge).visual?.start ?? { shape: "none", size: 10 });
                      const endDec = user_derived(() => get(edge).visual?.end ?? { shape: "none", size: 10 });
                      const geom = user_derived(() => computeUmlEdgeGeometry(get(srcBox), get(tgtBox), get(edge).visual?.routing ?? "bezier", get(startDec), get(endDec), get(edgeParallelOffsets)[get(edge).id] ?? 0));
                      const startCenter = user_derived(() => getEndpointVisualCenter(get(geom).startTip, get(geom).startAngleDeg, get(startDec)));
                      const endCenter = user_derived(() => getEndpointVisualCenter(get(geom).endTip, get(geom).endAngleDeg, get(endDec)));
                      var fragment_22 = root_292();
                      var circle = first_child(fragment_22);
                      var circle_1 = sibling(circle);
                      template_effect(
                        ($0, $1) => {
                          set_attribute2(circle, "cx", get(startCenter).x);
                          set_attribute2(circle, "cy", get(startCenter).y);
                          set_attribute2(circle, "r", $0);
                          set_attribute2(circle_1, "cx", get(endCenter).x);
                          set_attribute2(circle_1, "cy", get(endCenter).y);
                          set_attribute2(circle_1, "r", $1);
                        },
                        [
                          () => Math.max(9, 10 / store().viewport.zoom),
                          () => Math.max(9, 10 / store().viewport.zoom)
                        ]
                      );
                      delegated("click", circle, (e) => {
                        e.stopPropagation();
                        openEndpointPickerPopup(e.clientX, e.clientY, get(edge), "start", get(startDec));
                      });
                      delegated("click", circle_1, (e) => {
                        e.stopPropagation();
                        openEndpointPickerPopup(e.clientX, e.clientY, get(edge), "end", get(endDec));
                      });
                      append($$anchor6, fragment_22);
                    };
                    if_block(node_40, ($$render) => {
                      if (get(srcBox) && get(tgtBox)) $$render(consequent_27);
                    });
                  }
                  append($$anchor5, fragment_21);
                };
                if_block(node_39, ($$render) => {
                  if (get(isEdgeSelected)) $$render(consequent_28);
                });
              }
              append($$anchor4, fragment_20);
            });
            append($$anchor3, fragment_19);
          };
          if_block(node_37, ($$render) => {
            if (!store().isReadOnly) $$render(consequent_29);
          });
        }
        var node_41 = sibling(node_37);
        {
          var consequent_30 = ($$anchor3) => {
            var line = root_302();
            template_effect(() => {
              set_attribute2(line, "x1", get(gesture).startPoint.x);
              set_attribute2(line, "y1", get(gesture).startPoint.y);
              set_attribute2(line, "x2", get(gesture).currentWorld.x);
              set_attribute2(line, "y2", get(gesture).currentWorld.y);
            });
            append($$anchor3, line);
          };
          if_block(node_41, ($$render) => {
            if (get(gesture).mode === "connecting") $$render(consequent_30);
          });
        }
        var node_42 = sibling(node_41);
        {
          var consequent_31 = ($$anchor3) => {
            var rect_4 = root_312();
            template_effect(() => {
              set_attribute2(rect_4, "x", get(marqueeRect).x);
              set_attribute2(rect_4, "y", get(marqueeRect).y);
              set_attribute2(rect_4, "width", get(marqueeRect).width);
              set_attribute2(rect_4, "height", get(marqueeRect).height);
            });
            append($$anchor3, rect_4);
          };
          if_block(node_42, ($$render) => {
            if (get(marqueeRect)) $$render(consequent_31);
          });
        }
        reset(g_6);
        reset(svg_4);
        var node_43 = sibling(svg_4, 2);
        {
          var consequent_34 = ($$anchor3) => {
            const editingEdge = user_derived(() => get(doc).edges.find((e) => e.id === get(inlineEditingEdgeId)));
            var fragment_23 = comment();
            var node_44 = first_child(fragment_23);
            {
              var consequent_33 = ($$anchor4) => {
                const srcB = user_derived(() => get(effectiveNodeLayouts)[get(editingEdge).source.nodeId]);
                const tgtB = user_derived(() => get(effectiveNodeLayouts)[get(editingEdge).target.nodeId]);
                var fragment_24 = comment();
                var node_45 = first_child(fragment_24);
                {
                  var consequent_32 = ($$anchor5) => {
                    const g = user_derived(() => computeUmlEdgeGeometry(get(srcB), get(tgtB), get(editingEdge).visual?.routing ?? "bezier", get(editingEdge).visual?.start, get(editingEdge).visual?.end, get(edgeParallelOffsets)[get(editingEdge).id] ?? 0));
                    var div_28 = root_323();
                    var input_10 = child(div_28);
                    remove_input_defaults(input_10);
                    autofocus(input_10, true);
                    reset(div_28);
                    template_effect(() => set_style(div_28, `left: ${get(g).labelPoint.x * store().viewport.zoom + store().viewport.panX}px; top: ${get(g).labelPoint.y * store().viewport.zoom + store().viewport.panY}px;`));
                    delegated("pointerdown", div_28, (e) => e.stopPropagation());
                    event("blur", input_10, () => commitInlineEdgeLabel(get(editingEdge)));
                    delegated("keydown", input_10, (ke) => {
                      if (ke.key === "Enter") commitInlineEdgeLabel(get(editingEdge));
                      if (ke.key === "Escape") set(inlineEditingEdgeId, null);
                    });
                    bind_value(input_10, () => get(inlineEdgeLabelDraft), ($$value) => set(inlineEdgeLabelDraft, $$value));
                    append($$anchor5, div_28);
                  };
                  if_block(node_45, ($$render) => {
                    if (get(srcB) && get(tgtB)) $$render(consequent_32);
                  });
                }
                append($$anchor4, fragment_24);
              };
              if_block(node_44, ($$render) => {
                if (get(editingEdge)) $$render(consequent_33);
              });
            }
            append($$anchor3, fragment_23);
          };
          if_block(node_43, ($$render) => {
            if (get(inlineEditingEdgeId)) $$render(consequent_34);
          });
        }
        var node_46 = sibling(node_43, 2);
        {
          var consequent_37 = ($$anchor3) => {
            const multEdit = user_derived(() => get(inlineEditingMultiplicity));
            const editingEdge = user_derived(() => get(doc).edges.find((e) => e.id === get(multEdit).edgeId));
            var fragment_25 = comment();
            var node_47 = first_child(fragment_25);
            {
              var consequent_36 = ($$anchor4) => {
                const srcB = user_derived(() => get(effectiveNodeLayouts)[get(editingEdge).source.nodeId]);
                const tgtB = user_derived(() => get(effectiveNodeLayouts)[get(editingEdge).target.nodeId]);
                var fragment_26 = comment();
                var node_48 = first_child(fragment_26);
                {
                  var consequent_35 = ($$anchor5) => {
                    const g = user_derived(() => computeUmlEdgeGeometry(get(srcB), get(tgtB), get(editingEdge).visual?.routing ?? "bezier", get(editingEdge).visual?.start, get(editingEdge).visual?.end, get(edgeParallelOffsets)[get(editingEdge).id] ?? 0));
                    const pt = user_derived(() => get(multEdit).end === "start" ? getMultiplicityLabelPoint(get(g).startTip, get(g).startAngleDeg) : getMultiplicityLabelPoint(get(g).endTip, get(g).endAngleDeg));
                    var div_29 = root_333();
                    var input_11 = child(div_29);
                    remove_input_defaults(input_11);
                    autofocus(input_11, true);
                    reset(div_29);
                    template_effect(() => set_style(div_29, `left: ${get(pt).x * store().viewport.zoom + store().viewport.panX}px; top: ${get(pt).y * store().viewport.zoom + store().viewport.panY}px;`));
                    delegated("pointerdown", div_29, (e) => e.stopPropagation());
                    event("blur", input_11, () => commitInlineMultiplicity(get(editingEdge)));
                    delegated("keydown", input_11, (ke) => {
                      if (ke.key === "Enter") commitInlineMultiplicity(get(editingEdge));
                      if (ke.key === "Escape") set(inlineEditingMultiplicity, null);
                    });
                    bind_value(input_11, () => get(inlineEditingMultiplicity).draft, ($$value) => get(inlineEditingMultiplicity).draft = $$value);
                    append($$anchor5, div_29);
                  };
                  if_block(node_48, ($$render) => {
                    if (get(srcB) && get(tgtB)) $$render(consequent_35);
                  });
                }
                append($$anchor4, fragment_26);
              };
              if_block(node_47, ($$render) => {
                if (get(editingEdge)) $$render(consequent_36);
              });
            }
            append($$anchor3, fragment_25);
          };
          if_block(node_46, ($$render) => {
            if (get(inlineEditingMultiplicity)) $$render(consequent_37);
          });
        }
        var node_49 = sibling(node_46, 2);
        {
          var consequent_39 = ($$anchor3) => {
            const popup = user_derived(() => get(endpointPickerPopup));
            var div_30 = root_36();
            var div_31 = child(div_30);
            var input_12 = sibling(child(div_31), 2);
            remove_input_defaults(input_12);
            reset(div_31);
            var div_32 = sibling(div_31, 2);
            each(div_32, 21, () => endpointIconChoices, index, ($$anchor4, choice) => {
              const preview = user_derived(() => renderEndpointPath(get(choice).decoration));
              const isActive = user_derived(() => isSameEndpointChoice(get(popup).current, get(choice).decoration));
              var button_11 = root_352();
              let classes_5;
              var svg_5 = child(button_11);
              var line_1 = child(svg_5);
              var node_50 = sibling(line_1);
              {
                var consequent_38 = ($$anchor5) => {
                  var path_5 = root_342();
                  template_effect(() => {
                    set_attribute2(path_5, "d", get(preview).d);
                    set_attribute2(path_5, "fill", get(choice).decoration.fill === "filled" ? "currentColor" : "var(--vscode-editor-background)");
                  });
                  append($$anchor5, path_5);
                };
                if_block(node_50, ($$render) => {
                  if (get(preview).d) $$render(consequent_38);
                });
              }
              reset(svg_5);
              var span_6 = sibling(svg_5, 2);
              var text_19 = only_child(span_6, true);
              reset(button_11);
              template_effect(
                ($0) => {
                  classes_5 = set_class(button_11, 1, "vz-endpoint-icon-btn", null, classes_5, { active: get(isActive) });
                  set_attribute2(button_11, "title", get(choice).label);
                  set_attribute2(line_1, "x2", $0);
                  set_text(text_19, get(choice).label);
                },
                [
                  () => get(choice).decoration.shape === "none" || get(choice).decoration.shape === "open-arrow" ? "0" : String(-(get(choice).decoration.size ?? 11))
                ]
              );
              delegated("click", button_11, () => {
                store().dispatchOperation({
                  type: "uml.updateEndpoint",
                  edgeId: get(popup).edgeId,
                  end: get(popup).end,
                  decoration: get(choice).decoration
                });
                set(endpointPickerPopup, null);
              });
              append($$anchor4, button_11);
            });
            reset(div_32);
            reset(div_30);
            template_effect(() => set_style(div_30, `left: ${get(popup).x ?? ""}px; top: ${get(popup).y ?? ""}px;`));
            delegated("pointerdown", div_30, (e) => e.stopPropagation());
            delegated("change", input_12, (ev) => {
              const val = ev.currentTarget.value.trim();
              store().dispatchOperation({
                type: "uml.updateEdge",
                edgeId: get(popup).edgeId,
                ...get(popup).end === "start" ? { sourceMultiplicity: val } : { targetMultiplicity: val }
              });
            });
            delegated("keydown", input_12, (ke) => {
              if (ke.key === "Enter") {
                const val = ke.currentTarget.value.trim();
                store().dispatchOperation({
                  type: "uml.updateEdge",
                  edgeId: get(popup).edgeId,
                  ...get(popup).end === "start" ? { sourceMultiplicity: val } : { targetMultiplicity: val }
                });
                set(endpointPickerPopup, null);
              }
            });
            bind_value(input_12, () => get(endpointPickerPopup).multiplicityDraft, ($$value) => get(endpointPickerPopup).multiplicityDraft = $$value);
            append($$anchor3, div_30);
          };
          if_block(node_49, ($$render) => {
            if (get(endpointPickerPopup)) $$render(consequent_39);
          });
        }
        template_effect(() => {
          set_attribute2(g_1, "transform", `translate(${store().viewport.panX ?? ""}, ${store().viewport.panY ?? ""}) scale(${store().viewport.zoom ?? ""})`);
          set_style(div_4, `transform: translate(${store().viewport.panX ?? ""}px, ${store().viewport.panY ?? ""}px) scale(${store().viewport.zoom ?? ""});`);
          set_attribute2(g_6, "transform", `translate(${store().viewport.panX ?? ""}, ${store().viewport.panY ?? ""}) scale(${store().viewport.zoom ?? ""})`);
        });
        append($$anchor2, fragment_1);
      };
      if_block(node_2, ($$render) => {
        if (get(doc)) $$render(consequent_40);
      });
    }
    reset(div_2);
    bind_this(div_2, ($$value) => set(viewportEl, $$value), () => get(viewportEl));
    var node_51 = sibling(div_2, 2);
    UmlInspector(node_51, {
      get store() {
        return store();
      },
      onDeleteSelected: deleteSelected,
      onDuplicateSelected: duplicateSelected
    });
    reset(div_1);
    reset(div);
    template_effect(
      ($0) => {
        classes = set_class(div_2, 1, "vz-viewport vz-canvas-bg", null, classes, {
          "space-grab": get(spacePressed),
          "space-grabbing": get(gesture).mode === "panning"
        });
        set_style(div_2, `background-size: ${get(gridSpacing) ?? ""}px ${get(gridSpacing) ?? ""}px; background-position: ${get(gridPosX) ?? ""}px ${get(gridPosY) ?? ""}px; background-image: radial-gradient(rgba(128, 128, 128, ${get(gridOpacity) ?? ""}) ${get(gridDotRadius) ?? ""}px, transparent ${get(gridDotRadius) ?? ""}px);`);
        set_text(text2, `${$0 ?? ""}%`);
      },
      [() => Math.round(store().viewport.zoom * 100)]
    );
    event("wheel", div_2, handleWheel);
    delegated("pointerdown", div_2, handleCanvasPointerDown);
    delegated("contextmenu", div_2, handleCanvasContextMenu);
    delegated("dblclick", div_2, (e) => {
      if (store().isReadOnly) return;
      if (e.target === get(viewportEl) || e.target?.classList.contains("vz-canvas-bg")) {
        const pt = getRelativeWorldPoint(e);
        store().createQuickUmlNode("class", pt.x, pt.y);
      }
    });
    event("wheel", div_3, handleZoomPillWheel);
    delegated("click", button, () => store().setViewport({
      ...store().viewport,
      zoom: (Math.round(store().viewport.zoom * 100) - 10) / 100
    }));
    delegated("click", button_1, fitContent);
    event("wheel", button_1, handleZoomPillWheel);
    delegated("click", button_2, () => store().setViewport({
      ...store().viewport,
      zoom: (Math.round(store().viewport.zoom * 100) + 10) / 100
    }));
    append($$anchor, div);
    pop();
  }
  delegate([
    "pointerdown",
    "contextmenu",
    "dblclick",
    "click",
    "keydown",
    "change"
  ]);

  // src/webview/App.svelte
  var root7 = from_html(`<div class="vz-status-banner" role="status" aria-live="polite"><span> </span> <button type="button" class="vz-banner-close" aria-label="Dismiss notification">\xD7</button></div>`);
  var root_114 = from_html(`<div class="vz-readonly-bar" role="note">Read-Only Mode (Non-file URI or untrusted document)</div>`);
  var root_213 = from_html(`<main class="vz-root" aria-label="Vizion Visual Architecture Editor"><!> <!> <!> <!></main>`);
  function App($$anchor, $$props) {
    push($$props, true);
    let initialKind2 = prop($$props, "initialKind", 3, "uml");
    const store = new VizionWebviewStore(initialKind2());
    var main = root_213();
    var node = child(main);
    {
      var consequent = ($$anchor2) => {
        var div = root7();
        var span = child(div);
        var text2 = only_child(span, true);
        var button = sibling(span, 2);
        reset(div);
        template_effect(() => set_text(text2, store.statusMessage));
        delegated("click", button, () => store.statusMessage = null);
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (store.statusMessage) $$render(consequent);
      });
    }
    var node_1 = sibling(node, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var div_1 = root_114();
        append($$anchor2, div_1);
      };
      if_block(node_1, ($$render) => {
        if (store.isReadOnly) $$render(consequent_1);
      });
    }
    var node_2 = sibling(node_1, 2);
    {
      var consequent_2 = ($$anchor2) => {
        ErrorView($$anchor2, {
          get store() {
            return store;
          }
        });
      };
      var alternate = ($$anchor2) => {
        UmlCanvas($$anchor2, {
          get store() {
            return store;
          }
        });
      };
      if_block(node_2, ($$render) => {
        if (!store.valid) $$render(consequent_2);
        else $$render(alternate, -1);
      });
    }
    var node_3 = sibling(node_2, 2);
    ContextMenu(node_3, {
      get store() {
        return store;
      }
    });
    reset(main);
    append($$anchor, main);
    pop();
  }
  delegate(["click"]);

  // src/webview/main.ts
  var initialKind = "uml";
  var target = document.getElementById("app");
  if (target) {
    target.innerHTML = "";
    mount(App, {
      target,
      props: { initialKind }
    });
  }
})();
//# sourceMappingURL=webview.js.map
