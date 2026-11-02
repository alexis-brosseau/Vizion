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
  function invalid_snippet() {
    if (dev_fallback_default) {
      const error = new Error(`invalid_snippet
Could not \`{@render}\` snippet due to the expression being \`null\` or \`undefined\`. Consider using optional chaining \`{@render snippet?.()}\`
https://svelte.dev/e/invalid_snippet`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/invalid_snippet`);
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
        for (const root29 of this.#resolve()) {
          try {
            this.#traverse(root29, effects, render_effects);
          } catch (e) {
            reset_all(root29);
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
    #traverse(root29, effects, render_effects) {
      root29.f ^= CLEAN;
      var effect2 = root29.first;
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
            for (var root29 of batch.#resolve()) {
              batch.#traverse(root29, [], []);
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
  function schedule_possible_effect_self_invalidation(signal, effect2, root29 = true) {
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
        if (root29) {
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
  function deep_read_state(value) {
    if (typeof value !== "object" || !value || value instanceof EventTarget) {
      return;
    }
    if (STATE_SYMBOL in value) {
      deep_read(value);
    } else if (!Array.isArray(value)) {
      for (let key2 in value) {
        const prop2 = value[key2];
        if (typeof prop2 === "object" && prop2 && STATE_SYMBOL in prop2) {
          deep_read(prop2);
        }
      }
    }
  }
  function deep_read(value, visited = /* @__PURE__ */ new Set()) {
    if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
    !(value instanceof EventTarget) && !visited.has(value)) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key2 in value) {
        try {
          deep_read(value[key2], visited);
        } catch (e) {
        }
      }
      const proto = get_prototype_of(value);
      if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
        const descriptors = get_descriptors(proto);
        for (let key2 in descriptors) {
          const get3 = descriptors[key2].get;
          if (get3) {
            try {
              get3.call(value);
            } catch (e) {
            }
          }
        }
      }
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
        var root29 = (
          /** @type {Element} */
          get_first_child(fragment)
        );
        if (is_fragment) {
          node = document.createDocumentFragment();
          while (get_first_child(root29)) {
            node.appendChild(
              /** @type {TemplateNode} */
              get_first_child(root29)
            );
          }
        } else {
          node = /** @type {Element} */
          get_first_child(root29);
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

  // node_modules/svelte/src/internal/client/dom/blocks/snippet.js
  function snippet(node, get_snippet, ...args) {
    var branches = new BranchManager(node);
    block(() => {
      const snippet2 = get_snippet() ?? null;
      if (dev_fallback_default && snippet2 == null) {
        invalid_snippet();
      }
      branches.ensure(snippet2, snippet2 && ((anchor) => snippet2(anchor, ...args)));
    }, EFFECT_TRANSPARENT);
  }

  // node_modules/svelte/src/internal/client/dom/elements/actions.js
  function action(dom, action2, get_value) {
    effect(() => {
      var payload = untrack(() => action2(dom, get_value?.()) || {});
      if (get_value && payload?.update) {
        var inited = false;
        var prev = (
          /** @type {any} */
          {}
        );
        render_effect(() => {
          var value = get_value();
          deep_read_state(value);
          if (inited && safe_not_equal(prev, value)) {
            prev = value;
            payload.update(value);
          }
        });
        inited = true;
      }
      if (payload?.destroy) {
        return () => (
          /** @type {Function} */
          payload.destroy()
        );
      }
    });
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

  // src/webview/ui/menu/ContextMenu.svelte
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
      var node_1 = first_child(fragment);
      each(node_1, 17, items, index, ($$anchor3, item, idx) => {
        const itemPath = user_derived(() => parentPath() ? `${parentPath()}.${idx}` : `${idx}`);
        var fragment_1 = root_5();
        var node_2 = first_child(fragment_1);
        {
          var consequent = ($$anchor4) => {
            var div = root();
            append($$anchor4, div);
          };
          if_block(node_2, ($$render) => {
            if (get(item).dividerBefore) $$render(consequent);
          });
        }
        var node_3 = sibling(node_2, 2);
        {
          var consequent_2 = ($$anchor4) => {
            var div_1 = root_2();
            var button = child(div_1);
            var span = child(button);
            var text2 = only_child(span, true);
            next(2);
            reset(button);
            var node_4 = sibling(button, 2);
            {
              var consequent_1 = ($$anchor5) => {
                var div_2 = root_1();
                var node_5 = child(div_2);
                menuList(node_5, () => get(item).submenu, () => get(itemPath));
                reset(div_2);
                action(div_2, ($$node) => keepSubmenuInView?.($$node));
                append($$anchor5, div_2);
              };
              var d = user_derived(() => isPathOpen(get(itemPath)));
              if_block(node_4, ($$render) => {
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
            var node_6 = sibling(span_1, 2);
            {
              var consequent_3 = ($$anchor5) => {
                var kbd = root_3();
                var text_2 = only_child(kbd, true);
                template_effect(() => set_text(text_2, get(item).shortcut));
                append($$anchor5, kbd);
              };
              if_block(node_6, ($$render) => {
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
          if_block(node_3, ($$render) => {
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
    function keepMenuInView(node) {
      const rect = node.getBoundingClientRect();
      let adjustedX = rect.left;
      let adjustedY = rect.top;
      if (rect.right > window.innerWidth - 8) {
        adjustedX = Math.max(8, window.innerWidth - rect.width - 8);
      }
      if (rect.left < 8) {
        adjustedX = 8;
      }
      if (rect.bottom > window.innerHeight - 8) {
        adjustedY = Math.max(8, window.innerHeight - rect.height - 8);
      }
      if (rect.top < 8) {
        adjustedY = 8;
      }
      node.style.left = `${adjustedX}px`;
      node.style.top = `${adjustedY}px`;
    }
    function keepSubmenuInView(node) {
      const rect = node.getBoundingClientRect();
      if (rect.right > window.innerWidth - 8) {
        node.style.left = "auto";
        node.style.right = "100%";
        node.style.marginLeft = "0px";
        node.style.marginRight = "2px";
      }
      const updatedRect = node.getBoundingClientRect();
      if (updatedRect.left < 8) {
        node.style.left = "8px";
        node.style.right = "auto";
        node.style.margin = "0px";
      }
      if (updatedRect.bottom > window.innerHeight - 8) {
        const overflowY = updatedRect.bottom - (window.innerHeight - 8);
        node.style.top = `${-4 - overflowY}px`;
      }
      const finalRect = node.getBoundingClientRect();
      if (finalRect.top < 8) {
        const curTop = parseInt(node.style.top || "-4", 10);
        node.style.top = `${curTop + (8 - finalRect.top)}px`;
      }
    }
    var fragment_2 = comment();
    var node_7 = first_child(fragment_2);
    {
      var consequent_5 = ($$anchor2) => {
        var div_3 = root_7();
        var div_4 = child(div_3);
        var node_8 = child(div_4);
        {
          var consequent_4 = ($$anchor3) => {
            var div_5 = root_6();
            var text_3 = only_child(div_5, true);
            template_effect(() => set_text(text_3, $$props.store.contextMenu.title));
            append($$anchor3, div_5);
          };
          if_block(node_8, ($$render) => {
            if ($$props.store.contextMenu.title) $$render(consequent_4);
          });
        }
        var node_9 = sibling(node_8, 2);
        menuList(node_9, () => $$props.store.contextMenu.items, () => "");
        reset(div_4);
        action(div_4, ($$node) => keepMenuInView?.($$node));
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
      if_block(node_7, ($$render) => {
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

  // src/shared/geometry/vector.ts
  var GRID_SIZE = 20;
  function snapToGrid(value, gridSize = GRID_SIZE) {
    return Math.round(value / gridSize) * gridSize;
  }
  function screenToWorld(xOrPoint, yOrViewport, maybeViewport) {
    let screenX;
    let screenY;
    let viewport;
    if (typeof xOrPoint === "object" && xOrPoint !== null) {
      screenX = xOrPoint.x;
      screenY = xOrPoint.y;
      viewport = yOrViewport;
    } else {
      screenX = xOrPoint;
      screenY = yOrViewport;
      viewport = maybeViewport;
    }
    const zoom = Number.isFinite(viewport?.zoom) && viewport.zoom > 0 ? viewport.zoom : 1;
    const panX = Number.isFinite(viewport?.panX) ? viewport.panX : 0;
    const panY = Number.isFinite(viewport?.panY) ? viewport.panY : 0;
    return {
      x: (screenX - panX) / zoom,
      y: (screenY - panY) / zoom
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
  function rectContainsRect(outer, inner) {
    return inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;
  }

  // src/shared/geometry/intersections.ts
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
  function computeShapeBoundaryIntersection(rect, externalPoint, shape) {
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const dx = externalPoint.x - cx;
    const dy = externalPoint.y - cy;
    if (Math.abs(dx) < 1e-3 && Math.abs(dy) < 1e-3) {
      return {
        point: { x: rect.x + rect.width, y: cy },
        normal: { x: 1, y: 0 }
      };
    }
    if (!shape || shape === "rectangle") {
      return computeRectBoundaryIntersection(rect, externalPoint);
    }
    const pad = 2;
    const x0 = rect.x + pad;
    const y0 = rect.y + pad;
    const x1 = rect.x + Math.max(pad + 10, rect.width - pad);
    const y1 = rect.y + Math.max(pad + 10, rect.height - pad);
    if (shape === "ellipse") {
      const rx = Math.max(5, (x1 - x0) / 2);
      const ry = Math.max(5, (y1 - y0) / 2);
      const denom = Math.hypot(dx / rx, dy / ry);
      const t = denom > 1e-4 ? 1 / denom : 1;
      const px = cx + t * dx;
      const py = cy + t * dy;
      const gX = (px - cx) / (rx * rx);
      const gY = (py - cy) / (ry * ry);
      const gLen = Math.hypot(gX, gY) || 1;
      return {
        point: { x: px, y: py },
        normal: { x: gX / gLen, y: gY / gLen }
      };
    }
    let vertices = [];
    if (shape === "rhombus") {
      vertices = [
        { x: cx, y: y0 },
        { x: x1, y: cy },
        { x: cx, y: y1 },
        { x: x0, y: cy }
      ];
    } else if (shape === "trapezoid") {
      const inset = Math.min(36, (x1 - x0) * 0.2);
      vertices = [
        { x: x0 + inset, y: y0 },
        { x: x1 - inset, y: y0 },
        { x: x1, y: y1 },
        { x: x0, y: y1 }
      ];
    } else if (shape === "parallelogram") {
      const skew = Math.min(32, (x1 - x0) * 0.18);
      vertices = [
        { x: x0 + skew, y: y0 },
        { x: x1, y: y0 },
        { x: x1 - skew, y: y1 },
        { x: x0, y: y1 }
      ];
    }
    let bestT = Infinity;
    let bestPt = { x: rect.x + rect.width, y: cy };
    let bestNorm = { x: 1, y: 0 };
    for (let i = 0; i < vertices.length; i++) {
      const A = vertices[i];
      const B = vertices[(i + 1) % vertices.length];
      const vx = B.x - A.x;
      const vy = B.y - A.y;
      const det = dy * vx - dx * vy;
      if (Math.abs(det) < 1e-9) continue;
      const diffX = A.x - cx;
      const diffY = A.y - cy;
      const t = (diffY * vx - diffX * vy) / det;
      const u = (dx * diffY - dy * diffX) / det;
      if (t > 0 && u >= -1e-3 && u <= 1.001 && t < bestT) {
        bestT = t;
        bestPt = { x: cx + t * dx, y: cy + t * dy };
        const midX = (A.x + B.x) / 2;
        const midY = (A.y + B.y) / 2;
        let nx = -vy;
        let ny = vx;
        if (nx * (midX - cx) + ny * (midY - cy) < 0) {
          nx = -nx;
          ny = -ny;
        }
        const nLen = Math.hypot(nx, ny) || 1;
        bestNorm = { x: nx / nLen, y: ny / nLen };
      }
    }
    if (bestT < Infinity) {
      if (shape === "rhombus") {
        const corners = [
          { pt: { x: cx, y: y0 }, norm: { x: 0, y: -1 } },
          // top corner acts like top flat border
          { pt: { x: x1, y: cy }, norm: { x: 1, y: 0 } },
          // right corner acts like right flat border
          { pt: { x: cx, y: y1 }, norm: { x: 0, y: 1 } },
          // bottom corner acts like bottom flat border
          { pt: { x: x0, y: cy }, norm: { x: -1, y: 0 } }
          // left corner acts like left flat border
        ];
        const sideLen = Math.hypot(x1 - cx, cy - y0);
        const cornerThreshold = Math.min(22, Math.max(14, sideLen * 0.35));
        let nearestIdx = -1;
        let minD = Infinity;
        for (let i = 0; i < corners.length; i++) {
          const d = Math.hypot(bestPt.x - corners[i].pt.x, bestPt.y - corners[i].pt.y);
          if (d < minD) {
            minD = d;
            nearestIdx = i;
          }
        }
        if (nearestIdx >= 0 && minD <= cornerThreshold) {
          bestPt = { ...corners[nearestIdx].pt };
          bestNorm = { ...corners[nearestIdx].norm };
        }
      }
      return { point: bestPt, normal: bestNorm };
    }
    return computeRectBoundaryIntersection(rect, externalPoint);
  }

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
    if (kind === "none") {
      return relationPresetRegistry.get("other");
    }
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
    defaultWidth: 240,
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
  registerUmlNodeKind({
    kind: "frame",
    label: "Frame",
    description: "Container frame with label that automatically encloses contained elements",
    defaultWidth: 260,
    defaultHeight: 180,
    hasCompartments: false
  });
  registerUmlRelationPreset({
    kind: "association",
    label: "Association",
    description: "Structural link between classes (solid line, no endpoint markers by default)",
    line: "solid",
    routing: "default",
    start: { shape: "none", size: 10 },
    end: { shape: "none", size: 10 }
  });
  registerUmlRelationPreset({
    kind: "dependency",
    label: "Dependency",
    description: "Uses/depends-on relationship (dashed line, open arrow at target)",
    line: "dashed",
    routing: "default",
    start: { shape: "none", size: 10 },
    end: { shape: "open-arrow", size: 11 }
  });
  registerUmlRelationPreset({
    kind: "generalization",
    label: "Generalization (Inheritance)",
    description: "Subclasses a general classifier (solid line, hollow triangle at target)",
    line: "solid",
    routing: "default",
    start: { shape: "none", size: 10 },
    end: { shape: "triangle", fill: "hollow", size: 12 }
  });
  registerUmlRelationPreset({
    kind: "realization",
    label: "Realization (Implements)",
    description: "Implements a specification contract (dashed line, hollow triangle at target)",
    line: "dashed",
    routing: "default",
    start: { shape: "none", size: 10 },
    end: { shape: "triangle", fill: "hollow", size: 12 }
  });
  registerUmlRelationPreset({
    kind: "aggregation",
    label: "Aggregation",
    description: "Whole-part weak ownership (solid line, hollow diamond at source)",
    line: "solid",
    routing: "default",
    start: { shape: "diamond", fill: "hollow", size: 13 },
    end: { shape: "none", size: 10 }
  });
  registerUmlRelationPreset({
    kind: "composition",
    label: "Composition",
    description: "Whole-part strong lifecycle ownership (solid line, filled diamond at source)",
    line: "solid",
    routing: "default",
    start: { shape: "diamond", fill: "filled", size: 13 },
    end: { shape: "none", size: 10 }
  });
  registerUmlRelationPreset({
    kind: "other",
    label: "Other",
    description: "Generic relation without semantic UML decoration",
    line: "dashed",
    routing: "default",
    start: { shape: "none", size: 10 },
    end: { shape: "none", size: 10 }
  });

  // src/shared/geometry/routing.ts
  function getMultiplicityLabelPoint(tip, angleDeg, multiplicityText) {
    const text2 = (multiplicityText ?? "").trim();
    const boxWidth = text2.length > 0 ? text2.length * 7.6 + 12 : 20;
    const halfW = boxWidth / 2;
    const halfH = 8.5;
    const rad = angleDeg * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const pX = sin;
    const pY = -cos;
    const perpExtent = Math.abs(pX) * halfW + Math.abs(pY) * halfH;
    const sideGap = 5;
    const perpDist = perpExtent + sideGap;
    const alongExtent = Math.abs(cos) * halfW + Math.abs(sin) * halfH;
    const inwardDist = Math.max(22, alongExtent + 4);
    const dx = -cos * inwardDist + pX * perpDist;
    const dy = -sin * inwardDist + pY * perpDist;
    return {
      x: tip.x + dx,
      y: tip.y + dy
    };
  }
  function computeStraightRoute(startTip, endTip, startTrim = 0, endTrim = 0) {
    const rawDx = endTip.x - startTip.x;
    const rawDy = endTip.y - startTip.y;
    const rawLen = Math.hypot(rawDx, rawDy) || 1;
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
    const hitPathD = `M ${startTip.x} ${startTip.y} L ${endTip.x} ${endTip.y}`;
    const endAngleDeg = Math.atan2(unitY, unitX) * 180 / Math.PI;
    const startAngleDeg = Math.atan2(-unitY, -unitX) * 180 / Math.PI;
    return {
      pathD,
      hitPathD,
      startTip,
      endTip,
      startAngleDeg,
      endAngleDeg,
      labelPoint: {
        x: (startTip.x + endTip.x) / 2,
        y: (startTip.y + endTip.y) / 2
      }
    };
  }
  function computeBezierRoute(startTip, endTip, srcNormal, tgtNormal, startTrim = 0, endTrim = 0) {
    const rawDx = endTip.x - startTip.x;
    const rawDy = endTip.y - startTip.y;
    const rawLen = Math.hypot(rawDx, rawDy) || 1;
    const dist = Math.min(140, Math.max(40, rawLen * 0.38));
    const c1 = {
      x: startTip.x + srcNormal.x * dist,
      y: startTip.y + srcNormal.y * dist
    };
    const c2 = {
      x: endTip.x + tgtNormal.x * dist,
      y: endTip.y + tgtNormal.y * dist
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
    const trimmedStart = {
      x: startTip.x - startUnitX * Math.min(startTrim, rawLen * 0.4),
      y: startTip.y - startUnitY * Math.min(startTrim, rawLen * 0.4)
    };
    const trimmedEnd = {
      x: endTip.x - endUnitX * Math.min(endTrim, rawLen * 0.4),
      y: endTip.y - endUnitY * Math.min(endTrim, rawLen * 0.4)
    };
    const pathD = `M ${trimmedStart.x} ${trimmedStart.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${trimmedEnd.x} ${trimmedEnd.y}`;
    const hitPathD = `M ${startTip.x} ${startTip.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${endTip.x} ${endTip.y}`;
    const labelPoint = {
      x: 0.125 * startTip.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * endTip.x,
      y: 0.125 * startTip.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * endTip.y
    };
    return {
      pathD,
      hitPathD,
      startTip,
      endTip,
      startAngleDeg: Math.atan2(startUnitY, startUnitX) * 180 / Math.PI,
      endAngleDeg: Math.atan2(endUnitY, endUnitX) * 180 / Math.PI,
      labelPoint
    };
  }
  function clampToRange(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function snapAnchorToRect(point, rect) {
    const right = rect.x + rect.width;
    const bottom = rect.y + rect.height;
    const onVerticalEdge = Math.min(Math.abs(point.x - rect.x), Math.abs(point.x - right)) <= Math.min(Math.abs(point.y - rect.y), Math.abs(point.y - bottom));
    if (onVerticalEdge) {
      return {
        x: point.x,
        y: clampToRange(snapToGrid(point.y, GRID_SIZE), rect.y, bottom)
      };
    }
    return {
      x: clampToRange(snapToGrid(point.x, GRID_SIZE), rect.x, right),
      y: point.y
    };
  }
  function shapeVertices(rect, shape) {
    const pad = 2;
    const x0 = rect.x + pad;
    const y0 = rect.y + pad;
    const x1 = rect.x + Math.max(pad + 10, rect.width - pad);
    const y1 = rect.y + Math.max(pad + 10, rect.height - pad);
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    if (shape === "rhombus") {
      return [
        { x: cx, y: y0 },
        { x: x1, y: cy },
        { x: cx, y: y1 },
        { x: x0, y: cy }
      ];
    }
    if (shape === "trapezoid") {
      const inset = Math.min(36, (x1 - x0) * 0.2);
      return [
        { x: x0 + inset, y: y0 },
        { x: x1 - inset, y: y0 },
        { x: x1, y: y1 },
        { x: x0, y: y1 }
      ];
    }
    const skew = Math.min(32, (x1 - x0) * 0.18);
    return [
      { x: x0 + skew, y: y0 },
      { x: x1, y: y0 },
      { x: x1 - skew, y: y1 },
      { x: x0, y: y1 }
    ];
  }
  function polygonBoundaryAtY(vertices, y, side) {
    const candidates = [];
    for (let index2 = 0; index2 < vertices.length; index2++) {
      const a = vertices[index2];
      const b = vertices[(index2 + 1) % vertices.length];
      if (a.y === b.y) continue;
      if (y < Math.min(a.y, b.y) || y > Math.max(a.y, b.y)) continue;
      const t = (y - a.y) / (b.y - a.y);
      candidates.push(a.x + t * (b.x - a.x));
    }
    if (candidates.length === 0) return null;
    return side === "min" ? Math.min(...candidates) : Math.max(...candidates);
  }
  function polygonBoundaryAtX(vertices, x, side) {
    const candidates = [];
    for (let index2 = 0; index2 < vertices.length; index2++) {
      const a = vertices[index2];
      const b = vertices[(index2 + 1) % vertices.length];
      if (a.x === b.x) continue;
      if (x < Math.min(a.x, b.x) || x > Math.max(a.x, b.x)) continue;
      const t = (x - a.x) / (b.x - a.x);
      candidates.push(a.y + t * (b.y - a.y));
    }
    if (candidates.length === 0) return null;
    return side === "min" ? Math.min(...candidates) : Math.max(...candidates);
  }
  function shapeBoundaryAtSnappedAnchor(point, rect, shape, normal2) {
    if (shape === "rectangle") return snapAnchorToRect(point, rect);
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    if (normal2.x !== 0) {
      const y = snapToGrid(cy, GRID_SIZE);
      if (shape === "ellipse") {
        const rx = Math.max(5, (rect.width - 4) / 2);
        const ry = Math.max(5, (rect.height - 4) / 2);
        const normalizedY = clampToRange(y, cy - ry + 0.5, cy + ry - 0.5);
        const offset = (normalizedY - cy) / ry;
        const halfWidth = rx * Math.sqrt(Math.max(0, 1 - offset * offset));
        return { x: cx + (normal2.x > 0 ? halfWidth : -halfWidth), y: normalizedY };
      }
      if (shape === "rhombus") {
        const rx = Math.max(5, (rect.width - 4) / 2);
        const ry = Math.max(5, (rect.height - 4) / 2);
        const normalizedY = clampToRange(y, cy - ry + 0.5, cy + ry - 0.5);
        const halfWidth = rx * Math.max(0, 1 - Math.abs(normalizedY - cy) / ry);
        return { x: cx + (normal2.x > 0 ? halfWidth : -halfWidth), y: normalizedY };
      }
      const boundaryX = polygonBoundaryAtY(
        shapeVertices(rect, shape),
        y,
        normal2.x > 0 ? "max" : "min"
      );
      return { x: boundaryX ?? (normal2.x > 0 ? rect.x + rect.width : rect.x), y };
    }
    const x = snapToGrid(cx, GRID_SIZE);
    if (shape === "ellipse") {
      const rx = Math.max(5, (rect.width - 4) / 2);
      const ry = Math.max(5, (rect.height - 4) / 2);
      const normalizedX = clampToRange(x, cx - rx + 0.5, cx + rx - 0.5);
      const offset = (normalizedX - cx) / rx;
      const halfHeight = ry * Math.sqrt(Math.max(0, 1 - offset * offset));
      return { x: normalizedX, y: cy + (normal2.y > 0 ? halfHeight : -halfHeight) };
    }
    if (shape === "rhombus") {
      const rx = Math.max(5, (rect.width - 4) / 2);
      const ry = Math.max(5, (rect.height - 4) / 2);
      const normalizedX = clampToRange(x, cx - rx + 0.5, cx + rx - 0.5);
      const halfHeight = ry * Math.max(0, 1 - Math.abs(normalizedX - cx) / rx);
      return { x: normalizedX, y: cy + (normal2.y > 0 ? halfHeight : -halfHeight) };
    }
    const boundaryY = polygonBoundaryAtX(
      shapeVertices(rect, shape),
      x,
      normal2.y > 0 ? "max" : "min"
    );
    return { x, y: boundaryY ?? (normal2.y > 0 ? rect.y + rect.height : rect.y) };
  }
  function gridifyOrthogonalRoute(points, sourceRect, targetRect, sourceShape, targetShape, sourceNormal, targetNormal) {
    if (points.length === 0) return points;
    const snapped = [];
    snapped.push(
      sourceShape ? shapeBoundaryAtSnappedAnchor(points[0], sourceRect, sourceShape, sourceNormal) : snapAnchorToRect(points[0], sourceRect)
    );
    for (let index2 = 1; index2 < points.length - 1; index2++) {
      snapped.push({
        x: snapToGrid(points[index2].x, GRID_SIZE),
        y: snapToGrid(points[index2].y, GRID_SIZE)
      });
    }
    snapped.push(
      targetShape ? shapeBoundaryAtSnappedAnchor(
        points[points.length - 1],
        targetRect,
        targetShape,
        targetNormal
      ) : snapAnchorToRect(points[points.length - 1], targetRect)
    );
    const orthogonal = [snapped[0]];
    for (let index2 = 1; index2 < snapped.length; index2++) {
      const previous = orthogonal[orthogonal.length - 1];
      const current = snapped[index2];
      if (previous.x !== current.x && previous.y !== current.y) {
        orthogonal.push({ x: current.x, y: previous.y });
      }
      if (previous.x === current.x && previous.y === current.y) continue;
      orthogonal.push(current);
    }
    return orthogonal;
  }
  function computeOrthogonalRoute(sourceRect, targetRect, srcHit, tgtHit, startTrim = 0, endTrim = 0, parallelOffset = 0, sourceAnchorOverride, targetAnchorOverride, sourceShape, targetShape, labelText) {
    const sourceCenter = {
      x: sourceRect.x + sourceRect.width / 2,
      y: sourceRect.y + sourceRect.height / 2
    };
    const targetCenter = {
      x: targetRect.x + targetRect.width / 2,
      y: targetRect.y + targetRect.height / 2
    };
    const sRight = sourceRect.x + sourceRect.width;
    const sLeft = sourceRect.x;
    const sBottom = sourceRect.y + sourceRect.height;
    const sTop = sourceRect.y;
    const tRight = targetRect.x + targetRect.width;
    const tLeft = targetRect.x;
    const tBottom = targetRect.y + targetRect.height;
    const tTop = targetRect.y;
    const gapRight = tLeft - sRight;
    const gapLeft = sLeft - tRight;
    const gapBottom = tTop - sBottom;
    const gapTop = sTop - tBottom;
    let startPt = srcHit.point;
    let startNorm = srcHit.normal;
    let endPt = tgtHit.point;
    let endNorm = tgtHit.normal;
    if (!sourceAnchorOverride && !targetAnchorOverride) {
      if (gapRight >= 0 && gapRight >= gapBottom && gapRight >= gapTop) {
        startPt = { x: sRight, y: sourceCenter.y };
        startNorm = { x: 1, y: 0 };
        endPt = { x: tLeft, y: targetCenter.y };
        endNorm = { x: -1, y: 0 };
      } else if (gapLeft >= 0 && gapLeft >= gapBottom && gapLeft >= gapTop) {
        startPt = { x: sLeft, y: sourceCenter.y };
        startNorm = { x: -1, y: 0 };
        endPt = { x: tRight, y: targetCenter.y };
        endNorm = { x: 1, y: 0 };
      } else if (gapBottom >= 0) {
        startPt = { x: sourceCenter.x, y: sBottom };
        startNorm = { x: 0, y: 1 };
        endPt = { x: targetCenter.x, y: tTop };
        endNorm = { x: 0, y: -1 };
      } else if (gapTop >= 0) {
        startPt = { x: sourceCenter.x, y: sTop };
        startNorm = { x: 0, y: -1 };
        endPt = { x: targetCenter.x, y: tBottom };
        endNorm = { x: 0, y: 1 };
      }
    }
    if (sourceShape && !sourceAnchorOverride) {
      const hit = computeShapeBoundaryIntersection(
        sourceRect,
        { x: sourceCenter.x + startNorm.x * 1e4, y: sourceCenter.y + startNorm.y * 1e4 },
        sourceShape
      );
      startPt = hit.point;
    }
    if (targetShape && !targetAnchorOverride) {
      const hit = computeShapeBoundaryIntersection(
        targetRect,
        { x: targetCenter.x + endNorm.x * 1e4, y: targetCenter.y + endNorm.y * 1e4 },
        targetShape
      );
      endPt = hit.point;
    }
    const pts = [startPt];
    if (startNorm.x !== 0) {
      if (endNorm.x !== 0) {
        if (startNorm.x !== endNorm.x && (endPt.x - startPt.x) * startNorm.x > 0) {
          if (Math.abs(startPt.y - endPt.y) < 1 && parallelOffset !== 0) {
            const jogY = startPt.y + parallelOffset;
            const midX = (startPt.x + endPt.x) / 2;
            const halfSpan = Math.min(20, Math.abs(endPt.x - startPt.x) / 4);
            const dirX = endPt.x >= startPt.x ? 1 : -1;
            const midX1 = midX - dirX * halfSpan;
            const midX2 = midX + dirX * halfSpan;
            pts.push({ x: midX1, y: startPt.y });
            pts.push({ x: midX1, y: jogY });
            pts.push({ x: midX2, y: jogY });
            pts.push({ x: midX2, y: endPt.y });
          } else {
            const midX = (startPt.x + endPt.x) / 2 + parallelOffset;
            pts.push({ x: midX, y: startPt.y });
            pts.push({ x: midX, y: endPt.y });
          }
        } else {
          const cX1 = startPt.x + startNorm.x * 24;
          const cX2 = endPt.x + endNorm.x * 24;
          const midY = (startPt.y + endPt.y) / 2 + parallelOffset;
          pts.push({ x: cX1, y: startPt.y });
          pts.push({ x: cX1, y: midY });
          pts.push({ x: cX2, y: midY });
          pts.push({ x: cX2, y: endPt.y });
        }
      } else {
        if (startNorm.x * (endPt.x - startPt.x) > 0 && endNorm.y * (startPt.y - endPt.y) > 0) {
          pts.push({ x: endPt.x, y: startPt.y });
        } else {
          const cX = startPt.x + startNorm.x * 24;
          const cY = endPt.y + endNorm.y * 24;
          pts.push({ x: cX, y: startPt.y });
          pts.push({ x: cX, y: cY });
          pts.push({ x: endPt.x, y: cY });
        }
      }
    } else {
      if (endNorm.y !== 0) {
        if (startNorm.y !== endNorm.y && (endPt.y - startPt.y) * startNorm.y > 0) {
          if (Math.abs(startPt.x - endPt.x) < 1 && parallelOffset !== 0) {
            const jogX = startPt.x + parallelOffset;
            const midY = (startPt.y + endPt.y) / 2;
            const halfSpan = Math.min(20, Math.abs(endPt.y - startPt.y) / 4);
            const dirY = endPt.y >= startPt.y ? 1 : -1;
            const midY1 = midY - dirY * halfSpan;
            const midY2 = midY + dirY * halfSpan;
            pts.push({ x: startPt.x, y: midY1 });
            pts.push({ x: jogX, y: midY1 });
            pts.push({ x: jogX, y: midY2 });
            pts.push({ x: endPt.x, y: midY2 });
          } else {
            const midY = (startPt.y + endPt.y) / 2 + parallelOffset;
            pts.push({ x: startPt.x, y: midY });
            pts.push({ x: endPt.x, y: midY });
          }
        } else {
          const cY1 = startPt.y + startNorm.y * 24;
          const cY2 = endPt.y + endNorm.y * 24;
          const midX = (startPt.x + endPt.x) / 2 + parallelOffset;
          pts.push({ x: startPt.x, y: cY1 });
          pts.push({ x: midX, y: cY1 });
          pts.push({ x: midX, y: cY2 });
          pts.push({ x: endPt.x, y: cY2 });
        }
      } else {
        if (startNorm.y * (endPt.y - startPt.y) > 0 && endNorm.x * (startPt.x - endPt.x) > 0) {
          pts.push({ x: startPt.x, y: endPt.y });
        } else {
          const cY = startPt.y + startNorm.y * 24;
          const cX = endPt.x + endNorm.x * 24;
          pts.push({ x: startPt.x, y: cY });
          pts.push({ x: cX, y: cY });
          pts.push({ x: cX, y: endPt.y });
        }
      }
    }
    pts.push(endPt);
    const routedPts = gridifyOrthogonalRoute(
      pts,
      sourceRect,
      targetRect,
      sourceShape,
      targetShape,
      startNorm,
      endNorm
    );
    const cleanPts = [routedPts[0]];
    for (let i = 1; i < routedPts.length; i++) {
      const prev = cleanPts[cleanPts.length - 1];
      const curr = routedPts[i];
      if (Math.abs(prev.x - curr.x) < 0.5 && Math.abs(prev.y - curr.y) < 0.5) {
        continue;
      }
      if (cleanPts.length >= 2) {
        const before = cleanPts[cleanPts.length - 2];
        if (Math.abs(before.x - prev.x) < 0.5 && Math.abs(prev.x - curr.x) < 0.5 || Math.abs(before.y - prev.y) < 0.5 && Math.abs(prev.y - curr.y) < 0.5) {
          cleanPts[cleanPts.length - 1] = curr;
          continue;
        }
      }
      cleanPts.push(curr);
    }
    const firstP = cleanPts[0];
    const secondP = cleanPts[1] ?? firstP;
    const seg0Dx = secondP.x - firstP.x;
    const seg0Dy = secondP.y - firstP.y;
    const seg0Len = Math.hypot(seg0Dx, seg0Dy) || 1;
    const startUnitX = seg0Dx / seg0Len;
    const startUnitY = seg0Dy / seg0Len;
    const effectiveStartTrim = Math.min(startTrim, seg0Len * 0.45);
    const trimmedStart = {
      x: firstP.x + startUnitX * effectiveStartTrim,
      y: firstP.y + startUnitY * effectiveStartTrim
    };
    const startAngleDeg = Math.atan2(-startUnitY, -startUnitX) * 180 / Math.PI;
    const lastP = cleanPts[cleanPts.length - 1];
    const secondLastP = cleanPts[cleanPts.length - 2] ?? lastP;
    const segNDx = lastP.x - secondLastP.x;
    const segNDy = lastP.y - secondLastP.y;
    const segNLen = Math.hypot(segNDx, segNDy) || 1;
    const endUnitX = segNDx / segNLen;
    const endUnitY = segNDy / segNLen;
    const effectiveEndTrim = Math.min(endTrim, segNLen * 0.45);
    const trimmedEnd = {
      x: lastP.x - endUnitX * effectiveEndTrim,
      y: lastP.y - endUnitY * effectiveEndTrim
    };
    const endAngleDeg = Math.atan2(endUnitY, endUnitX) * 180 / Math.PI;
    const hitPathD = `M ${cleanPts[0].x} ${cleanPts[0].y} ` + cleanPts.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
    const pathD = `M ${trimmedStart.x} ${trimmedStart.y} ` + cleanPts.slice(1, -1).map((p) => `L ${p.x} ${p.y}`).join(" ") + (cleanPts.length > 1 ? ` L ${trimmedEnd.x} ${trimmedEnd.y}` : "");
    let maxSegLen = -1;
    let maxSegIdx = 0;
    for (let i = 0; i < cleanPts.length - 1; i++) {
      const len = Math.hypot(cleanPts[i + 1].x - cleanPts[i].x, cleanPts[i + 1].y - cleanPts[i].y);
      if (len > maxSegLen) {
        maxSegLen = len;
        maxSegIdx = i;
      }
    }
    const numSegments = cleanPts.length - 1;
    let selectedSegIdx = maxSegIdx;
    if (numSegments >= 3) {
      const midSegIdx = Math.floor(numSegments / 2);
      const pMidA = cleanPts[midSegIdx];
      const pMidB = cleanPts[midSegIdx + 1];
      const midLen = Math.hypot(pMidB.x - pMidA.x, pMidB.y - pMidA.y);
      const isMidHoriz = Math.abs(pMidA.y - pMidB.y) < 1;
      const text2 = (labelText ?? "").trim();
      const labelWidth = text2.length > 0 ? text2.length * 7.6 + 16 : 48;
      const labelHeight = 20;
      const padding = 8;
      const requiredSpace = isMidHoriz ? labelWidth + padding : labelHeight + padding;
      if (midLen >= requiredSpace) {
        selectedSegIdx = midSegIdx;
      }
    }
    const pA = cleanPts[selectedSegIdx];
    const pB = cleanPts[selectedSegIdx + 1] ?? pA;
    const mX = (pA.x + pB.x) / 2;
    const mY = (pA.y + pB.y) / 2;
    const labelPoint = { x: mX, y: mY };
    return {
      pathD,
      hitPathD,
      startTip: firstP,
      endTip: lastP,
      startAngleDeg,
      endAngleDeg,
      labelPoint
    };
  }
  function computeUmlEdgeGeometry(sourceRect, targetRect, routing = "orthogonal", startDec, endDec, parallelOffset = 0, sourceAnchorOverride, targetAnchorOverride, sourceShape, targetShape, labelText) {
    const effectiveRouting = routing === "default" ? "orthogonal" : routing;
    if (!sourceAnchorOverride && !targetAnchorOverride && sourceRect.x === targetRect.x && sourceRect.y === targetRect.y && sourceRect.width === targetRect.width && sourceRect.height === targetRect.height) {
      const startShape2 = getEndpointShape(startDec?.shape ?? "none");
      const endShape2 = getEndpointShape(endDec?.shape ?? "none");
      const startSize2 = startDec?.size ?? startShape2?.defaultSize ?? 10;
      const endSize2 = endDec?.size ?? endShape2?.defaultSize ?? 11;
      const startTrim2 = (startShape2?.trimMultiplier ?? 0) * startSize2;
      const endTrim2 = (endShape2?.trimMultiplier ?? 0) * endSize2;
      if (effectiveRouting === "orthogonal") {
        const startTip3 = { x: sourceRect.x + sourceRect.width * 0.75, y: sourceRect.y };
        const endTip3 = { x: sourceRect.x + sourceRect.width, y: sourceRect.y + sourceRect.height * 0.35 };
        const p1 = { x: startTip3.x, y: sourceRect.y - 30 };
        const p2 = { x: sourceRect.x + sourceRect.width + 30, y: sourceRect.y - 30 };
        const p3 = { x: sourceRect.x + sourceRect.width + 30, y: endTip3.y };
        const trimmedStart = { x: startTip3.x, y: startTip3.y - startTrim2 };
        const trimmedEnd = { x: endTip3.x + endTrim2, y: endTip3.y };
        const pathD2 = `M ${trimmedStart.x} ${trimmedStart.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${trimmedEnd.x} ${trimmedEnd.y}`;
        const hitPathD = `M ${startTip3.x} ${startTip3.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${endTip3.x} ${endTip3.y}`;
        return {
          pathD: pathD2,
          hitPathD,
          startTip: startTip3,
          endTip: endTip3,
          startAngleDeg: 90,
          endAngleDeg: 180,
          labelPoint: { x: (p1.x + p2.x) / 2, y: p1.y }
        };
      }
      const startTip2 = { x: sourceRect.x + sourceRect.width * 0.75, y: sourceRect.y };
      const endTip2 = { x: sourceRect.x + sourceRect.width, y: sourceRect.y + sourceRect.height * 0.35 };
      const c1 = { x: startTip2.x, y: startTip2.y - 55 };
      const c2 = { x: endTip2.x + 60, y: endTip2.y - 55 };
      const pathD = `M ${startTip2.x} ${startTip2.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${endTip2.x} ${endTip2.y}`;
      return {
        pathD,
        hitPathD: pathD,
        startTip: startTip2,
        endTip: endTip2,
        startAngleDeg: 90,
        endAngleDeg: 180,
        labelPoint: {
          x: 0.125 * startTip2.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * endTip2.x,
          y: 0.125 * startTip2.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * endTip2.y
        }
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
    const srcHit = sourceAnchorOverride ?? computeShapeBoundaryIntersection(sourceRect, targetCenter, sourceShape);
    const tgtHit = targetAnchorOverride ?? computeShapeBoundaryIntersection(targetRect, sourceCenter, targetShape);
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
    if (effectiveRouting === "bezier") {
      return computeBezierRoute(startTip, endTip, srcHit.normal, tgtHit.normal, startTrim, endTrim);
    }
    if (effectiveRouting === "orthogonal") {
      return computeOrthogonalRoute(
        sourceRect,
        targetRect,
        srcHit,
        tgtHit,
        startTrim,
        endTrim,
        parallelOffset,
        sourceAnchorOverride,
        targetAnchorOverride,
        sourceShape,
        targetShape,
        labelText
      );
    }
    return computeStraightRoute(startTip, endTip, startTrim, endTrim);
  }

  // src/shared/geometry/shapes.ts
  function buildShapeSvgPath(shape, width, height) {
    const pad = 2;
    const x0 = pad;
    const y0 = pad;
    const x1 = Math.max(pad + 10, width - pad);
    const y1 = Math.max(pad + 10, height - pad);
    const centerX = width / 2;
    const centerY = height / 2;
    switch (shape ?? "rectangle") {
      case "ellipse": {
        const rx = (x1 - x0) / 2;
        const ry = (y1 - y0) / 2;
        return `M ${centerX - rx} ${centerY} A ${rx} ${ry} 0 1 0 ${centerX + rx} ${centerY} A ${rx} ${ry} 0 1 0 ${centerX - rx} ${centerY} Z`;
      }
      case "rhombus":
        return `M ${centerX} ${y0} L ${x1} ${centerY} L ${centerX} ${y1} L ${x0} ${centerY} Z`;
      case "trapezoid": {
        const inset = Math.min(36, (x1 - x0) * 0.2);
        return `M ${x0 + inset} ${y0} L ${x1 - inset} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
      }
      case "parallelogram": {
        const skew = Math.min(32, (x1 - x0) * 0.18);
        return `M ${x0 + skew} ${y0} L ${x1} ${y0} L ${x1 - skew} ${y1} L ${x0} ${y1} Z`;
      }
      case "rectangle":
      default:
        return `M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
    }
  }

  // src/webview/state/clipboard.svelte.ts
  var ClipboardController = class {
    #state;
    get state() {
      return get(this.#state);
    }
    set state(value) {
      set(this.#state, value, true);
    }
    constructor() {
      this.#state = state(null);
    }
    copy(doc, selectedIds) {
      if (!doc || selectedIds.length === 0) return;
      const nodeIds = doc.nodes.filter((node) => selectedIds.includes(node.id)).map((node) => node.id);
      const edgeIds = doc.edges.filter((edge) => selectedIds.includes(edge.id)).map((edge) => edge.id);
      if (nodeIds.length === 0 && edgeIds.length === 0) return;
      this.state = { kind: "uml", nodeIds, edgeIds, pasteCount: 0 };
    }
    nextPasteOffset() {
      if (!this.state) return 0;
      this.state.pasteCount += 1;
      return this.state.pasteCount * 20;
    }
    reset() {
      this.state = null;
    }
  };

  // src/webview/state/gesture-machine.svelte.ts
  var GestureStateMachine = class {
    #gesture;
    get gesture() {
      return get(this.#gesture);
    }
    set gesture(value) {
      set(this.#gesture, value, true);
    }
    constructor() {
      this.#gesture = state(proxy({ mode: "idle" }));
    }
    get mode() {
      return this.gesture.mode;
    }
    get isIdle() {
      return this.gesture.mode === "idle";
    }
    startPan(screenX, screenY, panX, panY) {
      this.gesture = {
        mode: "panning",
        startScreenX: screenX,
        startScreenY: screenY,
        initialPanX: panX,
        initialPanY: panY
      };
    }
    startMarquee(startWorld) {
      this.gesture = { mode: "marquee", startWorld, currentWorld: startWorld };
    }
    startMove(startWorld, initialLayouts, clickedNodeId, isShift = false) {
      this.gesture = {
        mode: "moving_nodes",
        startWorld,
        currentWorld: startWorld,
        initialLayouts,
        clickedNodeId,
        isShift
      };
    }
    startResize(nodeId, handle, startWorld, initialBox, minWidth, minHeight, childBounds) {
      this.gesture = {
        mode: "resizing_node",
        nodeId,
        handle,
        startWorld,
        currentWorld: startWorld,
        initialBox,
        minWidth,
        minHeight,
        childBounds
      };
    }
    startConnect(sourceNodeId, startPoint, currentWorld) {
      this.gesture = {
        mode: "connecting_edge",
        sourceNodeId,
        startPoint,
        currentWorld
      };
    }
    updatePoint(point) {
      const current = this.gesture;
      if (current.mode === "idle" || current.mode === "panning") return;
      this.gesture = { ...current, currentWorld: point };
    }
    setShift(isShift) {
      if (this.gesture.mode !== "moving_nodes") return;
      this.gesture = { ...this.gesture, isShift };
    }
    updatePan(screenX, screenY) {
      if (this.gesture.mode !== "panning") return null;
      return {
        panX: this.gesture.initialPanX + (screenX - this.gesture.startScreenX),
        panY: this.gesture.initialPanY + (screenY - this.gesture.startScreenY)
      };
    }
    end() {
      const current = this.gesture;
      if (current.mode === "idle") return null;
      this.gesture = { mode: "idle" };
      return current;
    }
    cancel() {
      this.gesture = { mode: "idle" };
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

  // package.json
  var package_default = {
    name: "vizion",
    displayName: "Vizion",
    description: "Custom UML editor for .viz JSON documents with embedded AI guidance.",
    version: "0.3.0",
    publisher: "Vizionary",
    license: "MIT",
    engines: {
      vscode: "^1.90.0"
    },
    categories: [
      "Visualization",
      "Custom Editors",
      "Other"
    ],
    activationEvents: [
      "onCustomEditor:vizion.uml",
      "onCommand:vizion.newUmlDiagram",
      "onCommand:vizion.initializeCurrentDocument",
      "onCommand:vizion.addNode",
      "onCommand:vizion.addRelation",
      "onCommand:vizion.renameEntity"
    ],
    main: "./dist/extension.cjs",
    contributes: {
      languages: [
        {
          id: "json",
          filenamePatterns: [
            "*.viz"
          ]
        }
      ],
      jsonValidation: [
        {
          fileMatch: "*.viz",
          url: "./schemas/uml.schema.json"
        }
      ],
      customEditors: [
        {
          viewType: "vizion.uml",
          displayName: "UML Editor",
          priority: "default",
          selector: [
            {
              filenamePattern: "*.viz"
            }
          ]
        }
      ],
      commands: [
        {
          command: "vizion.newUmlDiagram",
          title: "New UML Diagram",
          category: "Vizion",
          icon: "$(type-hierarchy-sub)"
        },
        {
          command: "vizion.initializeCurrentDocument",
          title: "Initialize Current Empty Vizion Document",
          category: "Vizion",
          icon: "$(sparkle)"
        },
        {
          command: "vizion.openCurrentAsText",
          title: "Open Current Vizion Document as JSON Text",
          category: "Vizion",
          icon: "$(code)"
        },
        {
          command: "vizion.fitCanvasToContent",
          title: "Fit Canvas to Content",
          category: "Vizion",
          icon: "$(screen-full)"
        },
        {
          command: "vizion.resetCanvasZoom",
          title: "Reset Canvas Zoom (100%)",
          category: "Vizion",
          icon: "$(zoom-in)"
        },
        {
          command: "vizion.addNode",
          title: "Add UML Node",
          category: "Vizion",
          icon: "$(add)"
        },
        {
          command: "vizion.addRelation",
          title: "Add UML Relation",
          category: "Vizion",
          icon: "$(git-commit)"
        },
        {
          command: "vizion.renameEntity",
          title: "Rename UML Entity",
          category: "Vizion",
          icon: "$(edit)"
        }
      ],
      menus: {
        "editor/title": [
          {
            command: "vizion.openCurrentAsText",
            when: "activeCustomEditorId == 'vizion.uml'",
            group: "navigation@1"
          },
          {
            command: "vizion.fitCanvasToContent",
            when: "activeCustomEditorId == 'vizion.uml'",
            group: "navigation@2"
          }
        ]
      }
    },
    scripts: {
      build: "node scripts/build.mjs",
      watch: "node scripts/build.mjs --watch",
      typecheck: "tsc --noEmit",
      check: "svelte-check --tsconfig ./tsconfig.json",
      test: "vitest run",
      package: "vsce package --no-dependencies --allow-missing-repository"
    },
    dependencies: {
      "jsonc-parser": "^3.3.1"
    },
    devDependencies: {
      "@types/node": "^22.0.0",
      "@types/vscode": "^1.90.0",
      "@vscode/vsce": "^3.2.0",
      esbuild: "^0.24.0",
      "esbuild-svelte": "^0.8.2",
      svelte: "^5.15.0",
      "svelte-check": "^4.1.0",
      typescript: "^5.7.0",
      vitest: "^2.1.0"
    }
  };

  // src/shared/documents/version.ts
  var EXTENSION_VERSION = package_default.version;

  // src/shared/documents/templates.ts
  function createDefaultUmlDocument(title = "Domain", version = EXTENSION_VERSION) {
    return {
      format: "vizion",
      version,
      kind: "uml",
      title: title || "Domain",
      description: "Describe classes, notes, shapes, frames, and explicitly typed relationships.",
      ai: {
        interpretation: [
          'Document Structure: JSON document with schema version tracking. Root fields are: "format" ("vizion"), "version" (matching extension version), "kind" ("uml"), "title" (string), "description" (optional/recommended string describing diagram context), "defaultRouting" ("orthogonal" | "straight" | "bezier"), "ai" (guidance object with "interpretation", "editingRules"), "nodes" (array), "edges" (array), and "layout" (object with "nodes" and "edges").',
          'Node Types & Properties ("nodes[]"): Each node must have "id" (unique string) and "kind" ("class" | "shape" | "note" | "frame"). Optional common fields: "name" (display label string), "stereotype" (architectural role string, e.g. "entity", "service", "value", "aggregate", "controller"). For "note" nodes, prose is stored in "text" (markdown/plain text).',
          'Frame Containers ("kind": "frame"): Visual container grouping enclosed elements with semi-transparent background. The label floats above the top-left corner. Contained element node IDs are listed in "children". Contained elements move together with the frame. An element is added to a frame when dragged into it with the cursor over the frame, which auto-resizes the frame to fit it. Dragging an element already inside the frame does not auto-resize the frame unless Shift is held (allowing elements to be dragged out of the frame). If the cursor is not over the frame, the element can overlap without being inside. Relations can enter and leave frames and are rendered on top of the frame. Frames cannot have relations of their own.',
          'Geometric Shapes ("kind": "shape"): Must specify "shape" geometry as one of: "ellipse" | "rectangle" | "rhombus" | "trapezoid" | "parallelogram". The node "name" is rendered as the centered label.',
          'Class Members & Compartments ("kind": "class"): Supports "attributes" array and "operations" array. Section visibility can be toggled via boolean flags "showAttributes" and "showOperations" (default true).',
          'Attributes Format: Each attribute object requires "id" (unique string), "visibility" (one of: "+" [public], "-" [private], "#" [protected], "~" [package/internal]), "name" (string), and "type" (type string e.g. "string", "number", "Date").',
          'Operations Format: Each operation object requires "id" (unique string), "visibility" ("+" | "-" | "#" | "~"), "name" (method name string), "returnType" (return type string, e.g. "void", "Promise<T>", "boolean"), "signature" (e.g. "(id: string, count: number)"), and "parameters" array of argument objects ({ "id": string, "name": string, "type": string }).',
          'Relationships ("edges[]"): Defines connections between nodes. Required fields: "id" (unique string), "kind" (relationship semantic type: "association" | "dependency" | "generalization" | "realization" | "aggregation" | "composition"), "source" ({ "nodeId": string, "multiplicity"?: string }), and "target" ({ "nodeId": string, "multiplicity"?: string }). Optional "label" (string rendered at midpoint). Frames cannot be endpoints for edges.',
          'Endpoint Multiplicities: Expressed as cardinality strings on endpoints: "source.multiplicity" and "target.multiplicity" (e.g. "1", "*", "0..1", "1..*", "0..n", or omit/empty if none).',
          'Visual Presentation ("edge.visual"): Optional visual options: "line" ("solid" | "dashed"), "routing" ("straight" | "bezier" | "orthogonal"), and endpoint decorations "start" / "end" ({ "shape": "none" | "circle" | "diamond" | "square" | "triangle" | "open-arrow", "fill"?: "hollow" | "filled", "size"?: number }). Only closed shapes support "fill". Standard semantic defaults: generalization = hollow triangle end; realization = dashed with hollow triangle end; aggregation = hollow diamond start; composition = filled diamond start; dependency = dashed with open-arrow end; association = solid line with none ends.',
          'Canvas Layout ("layout.nodes"): Bounding box for every node keyed by nodeId: { "x": number, "y": number, "width": number, "height": number }. Coordinates snap to a 20px grid (multiples of 20). Width >= 100, height >= 60 for classes; width >= 80, height >= 50 for shapes; width >= 120, height >= 60 for notes; width >= 160, height >= 100 for frames.',
          "Architectural Model Scope: This diagram is a selective architectural view. Absence of elements or relationships does not imply absence in the underlying implementation code."
        ],
        editingRules: [
          "Strict JSON Conformity: Output strictly valid standard JSON with 2-space indentation. Never use JavaScript comments, trailing commas, single quotes, or unquoted identifiers.",
          'Document Versioning: The root "version" field must match the Vizion extension version. Do NOT output alternate version fields like "schemaVersion", "formatVersion", or "instructionsVersion".',
          'Referential Integrity: Every "source.nodeId" and "target.nodeId" in "edges[]" MUST exactly match an existing node "id" in "nodes[]", and cannot reference a "frame" node. When removing a node from "nodes[]", you must atomically delete all edges referencing its ID.',
          `Frame Containment & Integrity: Frame nodes cannot have edges of their own. Every node listed in a frame's "children" MUST exist in "nodes[]". Elements can overlap a frame without being in its children; a node is only contained in a frame if listed in its "children", which happens when an element is dragged into the frame with the cursor hovering over it.`,
          'Layout Synchronization: Every node added to "nodes[]" MUST have a corresponding bounding box in "layout.nodes[nodeId]" ({ "x": number, "y": number, "width": number, "height": number }) aligned to a 20px grid. When deleting a node, delete its layout entry.',
          "Node Spacing: Node elements MUST be separated by at least 10 grid cells (200px) edge-to-edge. Never place nodes closer than 10 grid cells horizontally or vertically. Overlapping or tightly packed nodes make the diagram unreadable; leave generous whitespace between unrelated nodes and between frames.",
          'Preserve Existing Identifiers: Never alter existing "id" strings when updating nodes, edges, attributes, operations, or parameters. When creating new entities, generate clean, unique kebab-case IDs (e.g., "node-order-service", "edge-order-payment-1", "order-attr-status", "order-op-cancel", "cancel-arg-reason").',
          'Allowed Enums & Data Values: Strictly use only documented enum values \u2014 node kinds: "class"|"shape"|"note"|"frame"; shapes: "ellipse"|"rectangle"|"rhombus"|"trapezoid"|"parallelogram"; edge kinds: "association"|"dependency"|"generalization"|"realization"|"aggregation"|"composition"; visibilities: "+"|"-"|"#"|"~"; endpoint shapes: "none"|"circle"|"diamond"|"square"|"triangle"|"open-arrow"; fills: "hollow"|"filled".',
          'Preserve Unknown & Custom Fields: Preserve all unrecognized top-level and nested properties, annotations, extension keys, and this "ai" section intact across edits.',
          "Non-Interference with Source Code: Do not modify repository application source code when asked to edit this architecture diagram, unless the user explicitly requests code changes."
        ]
      },
      defaultRouting: "orthogonal",
      nodes: [],
      edges: [],
      layout: {
        nodes: {},
        edges: {}
      }
    };
  }

  // src/shared/documents/migrations.ts
  var DOCUMENT_MIGRATIONS = [
    {
      id: "migrate-purpose-to-description",
      name: "Move Purpose to Root Description",
      description: 'Moves legacy "ai.purpose" to root "description" property under title.',
      shouldApply: (doc) => {
        const ai = doc.ai;
        return Boolean(ai && typeof ai.purpose === "string");
      },
      apply: (doc) => {
        const ai = doc.ai;
        if (ai && typeof ai.purpose === "string") {
          if (!doc.description) {
            doc.description = ai.purpose;
          }
          delete ai.purpose;
        }
      }
    },
    {
      id: "refresh-ai-guidance",
      name: "Update AI Guidance Rules",
      description: "Updates embedded interpretation and editing rules to the latest version.",
      shouldApply: (doc) => {
        const template = createDefaultUmlDocument(doc.title);
        const currentInterp = JSON.stringify(doc.ai?.interpretation ?? []);
        const templateInterp = JSON.stringify(template.ai.interpretation);
        const currentRules = JSON.stringify(doc.ai?.editingRules ?? []);
        const templateRules = JSON.stringify(template.ai.editingRules);
        return currentInterp !== templateInterp || currentRules !== templateRules;
      },
      apply: (doc) => {
        const template = createDefaultUmlDocument(doc.title);
        doc.ai.interpretation = [...template.ai.interpretation];
        doc.ai.editingRules = [...template.ai.editingRules];
      }
    },
    {
      id: "sync-version",
      name: "Sync Document Version",
      description: `Updates document version to current extension version (${EXTENSION_VERSION}).`,
      shouldApply: (doc) => doc.version !== EXTENSION_VERSION,
      apply: (doc) => {
        doc.version = EXTENSION_VERSION;
      }
    }
  ];
  function compareSemver(v1, v2) {
    const parse2 = (v) => {
      const clean = v.replace(/^[v^~]/, "").split("-")[0];
      return clean.split(".").map((p) => {
        const n = parseInt(p, 10);
        return isNaN(n) ? 0 : n;
      });
    };
    const parts1 = parse2(v1);
    const parts2 = parse2(v2);
    const maxLen = Math.max(parts1.length, parts2.length);
    for (let i = 0; i < maxLen; i++) {
      const n1 = parts1[i] ?? 0;
      const n2 = parts2[i] ?? 0;
      if (n1 > n2) return 1;
      if (n1 < n2) return -1;
    }
    return 0;
  }
  function isNewerVersionDocument(doc) {
    if (!doc?.version) return false;
    return compareSemver(doc.version, EXTENSION_VERSION) > 0;
  }
  function isMigrationNeeded(doc) {
    if (!doc) return false;
    if (isNewerVersionDocument(doc)) return false;
    if (doc.version !== EXTENSION_VERSION) return true;
    return DOCUMENT_MIGRATIONS.some((step) => step.shouldApply(doc));
  }

  // src/shared/operations/text-parsers.ts
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
  function formatAttributesToText(attributes) {
    return (attributes ?? []).map((attr2) => {
      const vis = attr2.visibility ?? "+";
      const typeStr = attr2.type ? `: ${attr2.type}` : "";
      return `${vis} ${attr2.name}${typeStr}`;
    }).join("\n");
  }
  function parseAttributesFromText(text2, nodeId, existingAttrs = []) {
    const lines = text2.split(/\r?\n/);
    const result = [];
    const ATTR_REGEX = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)(?:\s*:\s*(.+?))?\s*$/;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const match = line.match(ATTR_REGEX);
      if (!match) continue;
      let rawVis = match[1];
      let vis = "+";
      if (rawVis === "-" || rawVis === "\uFF0D") vis = "-";
      else if (rawVis === "#") vis = "#";
      else if (rawVis === "~") vis = "~";
      else vis = "+";
      const name = match[2].trim();
      const type = match[3] ? match[3].trim() : void 0;
      const existing = existingAttrs[result.length];
      const id = existing?.id ?? `${nodeId}-attr-${Date.now().toString(36)}-${result.length + 1}`;
      result.push({
        id,
        visibility: vis,
        name,
        ...type ? { type } : {}
      });
    }
    return result;
  }
  function formatOperationsToText(operations) {
    return (operations ?? []).map((op) => {
      const vis = op.visibility ?? "+";
      const sig = op.parameters && op.parameters.length > 0 ? buildOperationSignature(op.parameters) : op.signature ?? "()";
      const retStr = op.returnType ? `: ${op.returnType}` : "";
      return `${vis} ${op.name}${sig}${retStr}`;
    }).join("\n");
  }
  function parseOperationsFromText(text2, nodeId, existingOps = []) {
    const lines = text2.split(/\r?\n/);
    const result = [];
    const OP_REGEX = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)\s*(?:\((.*?)\))?(?:\s*:\s*(.+?))?\s*$/;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const match = line.match(OP_REGEX);
      if (!match) continue;
      let rawVis = match[1];
      let vis = "+";
      if (rawVis === "-" || rawVis === "\uFF0D") vis = "-";
      else if (rawVis === "#") vis = "#";
      else if (rawVis === "~") vis = "~";
      else vis = "+";
      const name = match[2].trim();
      const rawParams = match[3];
      const returnType = match[4] ? match[4].trim() : void 0;
      const existing = existingOps[result.length];
      const id = existing?.id ?? `${nodeId}-op-${Date.now().toString(36)}-${result.length + 1}`;
      const parameters = [];
      if (rawParams !== void 0 && rawParams.trim().length > 0) {
        const parts = rawParams.split(",");
        for (let pIdx = 0; pIdx < parts.length; pIdx++) {
          const pTrimmed = parts[pIdx].trim();
          if (!pTrimmed) continue;
          const colonIdx = pTrimmed.indexOf(":");
          let pName = pTrimmed;
          let pType = "";
          if (colonIdx !== -1) {
            pName = pTrimmed.slice(0, colonIdx).trim();
            pType = pTrimmed.slice(colonIdx + 1).trim();
          }
          if (pName.length > 0) {
            parameters.push({
              id: `${id}-param-${pIdx + 1}`,
              name: pName,
              ...pType ? { type: pType } : {}
            });
          }
        }
      }
      const signature = rawParams !== void 0 ? `(${parameters.map((p) => p.type ? `${p.name}: ${p.type}` : p.name).join(", ")})` : "()";
      result.push({
        id,
        visibility: vis,
        name,
        signature,
        ...returnType ? { returnType } : {},
        parameters
      });
    }
    return result;
  }

  // src/webview/state/inline-edit.svelte.ts
  var InlineEditController = class {
    #state;
    get state() {
      return get(this.#state);
    }
    set state(value) {
      set(this.#state, value, true);
    }
    constructor(host) {
      this.host = host;
      this.#state = state(proxy({ mode: "none" }));
    }
    get editingNodeId() {
      return this.state.mode === "node" ? this.state.nodeId : null;
    }
    get editingEdgeId() {
      return this.state.mode === "edgeLabel" ? this.state.edgeId : null;
    }
    get hasActiveEdit() {
      return this.state.mode !== "none";
    }
    cancelAll() {
      this.state = { mode: "none" };
    }
    beginNode(node) {
      if (this.state.mode === "node" && this.state.nodeId !== node.id) this.commitNode();
      if (this.state.mode === "edgeLabel") this.commitEdgeLabel();
      if (this.state.mode === "multiplicity") this.commitMultiplicity();
      this.state = {
        mode: "node",
        nodeId: node.id,
        name: node.name ?? "",
        stereotype: node.kind === "note" || node.kind === "shape" || node.kind === "frame" ? "" : node.stereotype ?? "",
        text: node.text ?? "",
        attributes: formatAttributesToText(node.attributes ?? []),
        operations: formatOperationsToText(node.operations ?? [])
      };
    }
    updateNodeDraft(patch) {
      if (this.state.mode !== "node") return;
      this.state = { ...this.state, ...patch };
    }
    flushNodeHeader(node) {
      if (this.state.mode !== "node") return;
      const nodeId = this.state.nodeId;
      const targetNode = node ?? this.host.umlDoc?.nodes.find((candidate) => candidate.id === nodeId);
      if (!targetNode) return;
      const nextName = this.state.name.trim();
      const nextStereo = this.state.stereotype.replace(/^[«<]+|[»>]+$/g, "").trim();
      const updates = {};
      if (nextName !== targetNode.name) updates.name = nextName;
      if (targetNode.kind !== "note" && targetNode.kind !== "shape" && targetNode.kind !== "frame" && nextStereo !== (targetNode.stereotype ?? "")) {
        updates.stereotype = nextStereo;
      }
      if (Object.keys(updates).length > 0) {
        this.host.dispatchOperation({ type: "uml.updateNode", nodeId: targetNode.id, ...updates });
      }
    }
    flushNodeMembers(node) {
      if (this.state.mode !== "node") return;
      const nodeId = this.state.nodeId;
      const targetNode = node ?? this.host.umlDoc?.nodes.find((candidate) => candidate.id === nodeId);
      if (!targetNode || targetNode.kind === "note" || targetNode.kind === "shape" || targetNode.kind === "frame") {
        return;
      }
      const nextAttrs = parseAttributesFromText(this.state.attributes, targetNode.id, targetNode.attributes ?? []);
      const nextOps = parseOperationsFromText(this.state.operations, targetNode.id, targetNode.operations ?? []);
      const updates = {};
      const currentAttrs = targetNode.attributes ?? [];
      const attrsChanged = nextAttrs.length !== currentAttrs.length || nextAttrs.some((attr2, index2) => {
        const current = currentAttrs[index2];
        return !current || attr2.name !== current.name || (attr2.type ?? "") !== (current.type ?? "") || (attr2.visibility ?? "+") !== (current.visibility ?? "+");
      });
      if (attrsChanged) updates.attributes = nextAttrs;
      const currentOps = targetNode.operations ?? [];
      const opsChanged = nextOps.length !== currentOps.length || nextOps.some((op, index2) => {
        const current = currentOps[index2];
        return !current || op.name !== current.name || (op.returnType ?? "") !== (current.returnType ?? "") || (op.visibility ?? "+") !== (current.visibility ?? "+") || (op.signature ?? "()") !== (current.signature ?? "()");
      });
      if (opsChanged) updates.operations = nextOps;
      if (Object.keys(updates).length > 0) {
        this.host.dispatchOperation({ type: "uml.updateNode", nodeId: targetNode.id, ...updates });
      }
    }
    flushNodeText(node) {
      if (this.state.mode !== "node") return;
      const nodeId = this.state.nodeId;
      const targetNode = node ?? this.host.umlDoc?.nodes.find((candidate) => candidate.id === nodeId);
      if (!targetNode || targetNode.kind !== "note") return;
      if (this.state.text !== (targetNode.text ?? "")) {
        this.host.dispatchOperation({
          type: "uml.updateNode",
          nodeId: targetNode.id,
          text: this.state.text
        });
      }
    }
    commitNode(node) {
      this.flushNodeHeader(node);
      this.flushNodeMembers(node);
      this.flushNodeText(node);
      this.state = { mode: "none" };
    }
    beginEdgeLabel(edge) {
      if (this.state.mode === "node") this.commitNode();
      if (this.state.mode === "multiplicity") this.commitMultiplicity();
      this.state = { mode: "edgeLabel", edgeId: edge.id, label: edge.label ?? "" };
    }
    commitEdgeLabel(edge) {
      if (this.state.mode !== "edgeLabel") return;
      const edgeId = this.state.edgeId;
      const nextLabel = this.state.label.trim();
      const targetEdge = edge ?? this.host.umlDoc?.edges.find((candidate) => candidate.id === edgeId);
      this.state = { mode: "none" };
      if (!targetEdge) return;
      if (nextLabel !== (targetEdge.label ?? "")) {
        this.host.dispatchOperation({
          type: "uml.updateEdge",
          edgeId: targetEdge.id,
          label: nextLabel
        });
      }
    }
    beginMultiplicity(edge, end) {
      if (this.state.mode === "node") this.commitNode();
      if (this.state.mode === "edgeLabel") this.commitEdgeLabel();
      this.state = {
        mode: "multiplicity",
        edgeId: edge.id,
        end,
        draft: end === "start" ? edge.source.multiplicity ?? "" : edge.target.multiplicity ?? ""
      };
    }
    commitMultiplicity(edge) {
      if (this.state.mode !== "multiplicity") return;
      const { edgeId, end, draft } = this.state;
      const targetEdge = edge ?? this.host.umlDoc?.edges.find((candidate) => candidate.id === edgeId);
      this.state = { mode: "none" };
      if (!targetEdge) return;
      const cleaned = draft.trim();
      const previous = end === "start" ? targetEdge.source.multiplicity ?? "" : targetEdge.target.multiplicity ?? "";
      if (cleaned !== previous) {
        this.host.dispatchOperation({
          type: "uml.updateEdge",
          edgeId: targetEdge.id,
          ...end === "start" ? { sourceMultiplicity: cleaned } : { targetMultiplicity: cleaned }
        });
      }
    }
    beginEndpointPopup(x, y, edge, end, current) {
      this.closeEndpointPopup();
      this.state = {
        mode: "endpointPopup",
        x: Math.max(12, Math.min(x, (globalThis.innerWidth ?? 1024) - 260)),
        y: Math.max(12, Math.min(y, (globalThis.innerHeight ?? 768) - 360)),
        edgeId: edge.id,
        end,
        current,
        multiplicityDraft: end === "start" ? edge.source.multiplicity ?? "" : edge.target.multiplicity ?? ""
      };
    }
    commitEndpointMultiplicity() {
      if (this.state.mode !== "endpointPopup") return;
      const { edgeId, end, multiplicityDraft } = this.state;
      const targetEdge = this.host.umlDoc?.edges.find((candidate) => candidate.id === edgeId);
      if (!targetEdge) return;
      const cleaned = multiplicityDraft.trim();
      const previous = end === "start" ? targetEdge.source.multiplicity ?? "" : targetEdge.target.multiplicity ?? "";
      if (cleaned !== previous) {
        this.host.dispatchOperation({
          type: "uml.updateEdge",
          edgeId: targetEdge.id,
          ...end === "start" ? { sourceMultiplicity: cleaned } : { targetMultiplicity: cleaned }
        });
      }
    }
    closeEndpointPopup() {
      if (this.state.mode !== "endpointPopup") return;
      this.commitEndpointMultiplicity();
      this.state = { mode: "none" };
    }
    clearEndpointPopup() {
      if (this.state.mode === "endpointPopup") this.state = { mode: "none" };
    }
  };

  // src/webview/state/selection-logic.ts
  function syncSelectionEdges(doc, baseIds, prevIds) {
    if (!doc) return baseIds;
    const selectedSet = new Set(baseIds);
    const prevNodeIds = new Set(
      doc.nodes.filter((node) => prevIds.includes(node.id)).map((node) => node.id)
    );
    const nextNodeIds = new Set(
      doc.nodes.filter((node) => selectedSet.has(node.id)).map((node) => node.id)
    );
    const deselectedNodes = new Set([...prevNodeIds].filter((id) => !nextNodeIds.has(id)));
    for (const deselectedId of deselectedNodes) {
      for (const edge of doc.edges) {
        if (edge.source.nodeId === deselectedId || edge.target.nodeId === deselectedId) {
          selectedSet.delete(edge.id);
        }
      }
    }
    if (nextNodeIds.size >= 2) {
      for (const edge of doc.edges) {
        if (nextNodeIds.has(edge.source.nodeId) && nextNodeIds.has(edge.target.nodeId)) {
          selectedSet.add(edge.id);
        } else if (edge.source.nodeId && edge.target.nodeId && (!nextNodeIds.has(edge.source.nodeId) || !nextNodeIds.has(edge.target.nodeId))) {
          selectedSet.delete(edge.id);
        }
      }
    } else {
      for (const edge of doc.edges) {
        if (selectedSet.has(edge.id) && (nextNodeIds.has(edge.source.nodeId) || nextNodeIds.has(edge.target.nodeId))) {
          selectedSet.delete(edge.id);
        }
      }
    }
    return Array.from(selectedSet);
  }
  function selectEntity(doc, currentIds, id, additive) {
    const isEdge = doc?.edges.some((edge) => edge.id === id) ?? false;
    if (isEdge) {
      if (!additive) return [id];
      return currentIds.includes(id) ? currentIds.filter((existing) => existing !== id) : [...currentIds, id];
    }
    const next2 = additive ? currentIds.includes(id) ? currentIds.filter((existing) => existing !== id) : [...currentIds, id] : [id];
    return syncSelectionEdges(doc, next2, currentIds);
  }

  // src/webview/state/selection.svelte.ts
  var SelectionController = class {
    #selectedIds;
    get selectedIds() {
      return get(this.#selectedIds);
    }
    set selectedIds(value) {
      set(this.#selectedIds, value, true);
    }
    constructor() {
      this.#selectedIds = state(proxy([]));
    }
    isSelected(id) {
      return this.selectedIds.includes(id);
    }
    setSelectedIds(doc, ids) {
      this.selectedIds = this.syncSelectionEdges(doc, ids, this.selectedIds);
    }
    selectSingle(doc, id, additive = false) {
      this.selectedIds = selectEntity(doc, this.selectedIds, id, additive);
    }
    clear() {
      this.selectedIds = [];
    }
    /**
     * Drops ids that no longer exist in the authoritative document.
     */
    prune(doc) {
      if (!doc) return;
      const validIds = /* @__PURE__ */ new Set([
        ...doc.nodes.map((node) => node.id),
        ...doc.edges.map((edge) => edge.id)
      ]);
      const filtered = this.selectedIds.filter((id) => validIds.has(id));
      if (filtered.length !== this.selectedIds.length) {
        this.selectedIds = this.syncSelectionEdges(doc, filtered, this.selectedIds);
      }
    }
    syncSelectionEdges(doc, baseIds, prevIds = this.selectedIds) {
      return syncSelectionEdges(doc, baseIds, prevIds);
    }
  };

  // src/webview/state/viewport.svelte.ts
  var MIN_ZOOM = 0.2;
  var MAX_ZOOM = 3;
  var DEFAULT_VIEWPORT = { panX: 40, panY: 40, zoom: 1 };
  var ViewportController = class {
    #panX;
    get panX() {
      return get(this.#panX);
    }
    set panX(value) {
      set(this.#panX, value, true);
    }
    #panY;
    get panY() {
      return get(this.#panY);
    }
    set panY(value) {
      set(this.#panY, value, true);
    }
    #zoom;
    get zoom() {
      return get(this.#zoom);
    }
    set zoom(value) {
      set(this.#zoom, value, true);
    }
    constructor() {
      this.#panX = state(proxy(DEFAULT_VIEWPORT.panX));
      this.#panY = state(proxy(DEFAULT_VIEWPORT.panY));
      this.#zoom = state(proxy(DEFAULT_VIEWPORT.zoom));
    }
    get transform() {
      return { panX: this.panX, panY: this.panY, zoom: this.zoom };
    }
    setViewport(next2) {
      const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next2.zoom));
      this.panX = Math.round(next2.panX * 10) / 10;
      this.panY = Math.round(next2.panY * 10) / 10;
      this.zoom = Math.round(clampedZoom * 1e3) / 1e3;
    }
    resetZoom() {
      this.setViewport(DEFAULT_VIEWPORT);
    }
    panBy(dx, dy) {
      this.setViewport({ panX: this.panX + dx, panY: this.panY + dy, zoom: this.zoom });
    }
    /**
     * Zooms around a cursor position expressed in viewport-local pixels.
     * Keeps the world point under the cursor stationary.
     */
    zoomAt(cursorX, cursorY, factor) {
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom * factor));
      const scaleChange = nextZoom / this.zoom;
      this.setViewport({
        zoom: nextZoom,
        panX: cursorX - (cursorX - this.panX) * scaleChange,
        panY: cursorY - (cursorY - this.panY) * scaleChange
      });
    }
    /**
     * Fits the supplied world-space content bounds into the viewport.
     * Measurement of the viewport element is the caller's responsibility and
     * should happen only on explicit fit commands, never during a gesture.
     */
    fitContent(bounds, viewportWidth, viewportHeight, padding = 60) {
      const contentWidth = Math.max(200, bounds.width + padding * 2);
      const contentHeight = Math.max(200, bounds.height + padding * 2);
      const viewWidth = Math.max(300, viewportWidth);
      const viewHeight = Math.max(300, viewportHeight);
      const zoom = Math.min(1.5, Math.max(MIN_ZOOM, Math.min(viewWidth / contentWidth, viewHeight / contentHeight)));
      this.setViewport({
        zoom,
        panX: (viewWidth - bounds.width * zoom) / 2 - bounds.x * zoom,
        panY: (viewHeight - bounds.height * zoom) / 2 - bounds.y * zoom
      });
    }
  };

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
      this.viewportController = new ViewportController();
      this.selectionController = new SelectionController();
      this.clipboardController = new ClipboardController();
      this.gestureMachine = new GestureStateMachine();
      this.inlineEdit = new InlineEditController(this);
      this.#outlineSearchQuery = state("");
      this.#sidebarWidth = state(290);
      this.#elementsPaneRatio = state(0.4);
      this.#statusMessage = state(null);
      this.#staleNotice = state(null);
      this.#contextMenu = state(null);
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
    get viewport() {
      return this.viewportController.transform;
    }
    get selectedIds() {
      return this.selectionController.selectedIds;
    }
    get clipboard() {
      return this.clipboardController.state;
    }
    get umlDoc() {
      return this.document?.kind === "uml" ? this.document : void 0;
    }
    registerCanvasCallbacks(callbacks) {
      this.onFitContentCallback = callbacks.onFitContent;
      this.onResetZoomCallback = callbacks.onResetZoom;
      this.onRestoreFocusCallback = callbacks.onRestoreFocus;
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
        this.selectionController.prune(msg.document);
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
              this.selectionController.setSelectedIds(this.umlDoc, msg.createdIds);
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
          }
          break;
        }
      }
    }
    dispatchOperation(operation) {
      const requestId = `req-${++this.requestCounter}-${Date.now()}`;
      if (operation.type === "uml.updateNode" && this.umlDoc) {
        const node = this.umlDoc.nodes.find((n) => n.id === operation.nodeId);
        if (node) {
          if (operation.name !== void 0) node.name = operation.name;
          if (operation.stereotype !== void 0) {
            if (operation.stereotype) node.stereotype = operation.stereotype;
            else delete node.stereotype;
          }
          if (operation.text !== void 0) node.text = operation.text;
          if (operation.shape !== void 0) node.shape = operation.shape;
          if (operation.children !== void 0) node.children = [...operation.children];
          if (operation.line !== void 0) node.line = operation.line;
          if (operation.attributes !== void 0) node.attributes = operation.attributes;
          if (operation.operations !== void 0) node.operations = operation.operations;
          if (operation.showAttributes !== void 0) node.showAttributes = operation.showAttributes;
          if (operation.showOperations !== void 0) node.showOperations = operation.showOperations;
        }
      } else if (operation.type === "uml.moveResizeNodes" && this.umlDoc) {
        if (operation.frameChildrenUpdates) {
          for (const [frameId, children] of Object.entries(operation.frameChildrenUpdates)) {
            const frameNode = this.umlDoc.nodes.find((n) => n.id === frameId);
            if (frameNode) {
              frameNode.children = [...children];
            }
          }
        }
      } else if (operation.type === "uml.updateEdge" && this.umlDoc) {
        const edge = this.umlDoc.edges.find((e) => e.id === operation.edgeId);
        if (edge) {
          if (operation.label !== void 0) edge.label = operation.label;
          if (operation.sourceMultiplicity !== void 0) {
            edge.source.multiplicity = operation.sourceMultiplicity;
          }
          if (operation.targetMultiplicity !== void 0) {
            edge.target.multiplicity = operation.targetMultiplicity;
          }
          if (operation.kind !== void 0) edge.kind = operation.kind;
        }
      } else if (operation.type === "uml.updateEndpoint" && this.umlDoc) {
        const edge = this.umlDoc.edges.find((e) => e.id === operation.edgeId);
        if (edge) {
          if (!edge.visual) edge.visual = {};
          edge.visual[operation.end] = { ...operation.decoration };
        }
      }
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
    checkForExtensionUpdate() {
      postToHost({ type: "webview.checkForExtensionUpdate" });
    }
    setStatusMessage(message) {
      this.statusMessage = message;
    }
    setStaleNotice(message) {
      this.staleNotice = message;
    }
    copySelection() {
      this.clipboardController.copy(this.umlDoc, this.selectedIds);
    }
    pasteClipboard(stripCustomData = false) {
      const clipboard = this.clipboardController.state;
      if (this.isReadOnly || !clipboard) return;
      const step = this.clipboardController.nextPasteOffset();
      if (clipboard.kind === "uml" && this.umlDoc) {
        this.dispatchOperation({
          type: "uml.duplicateSelection",
          nodeIds: clipboard.nodeIds,
          edgeIds: clipboard.edgeIds,
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
        shape: `${shapeLabel} ${existingCount}`,
        frame: `Frame ${existingCount}`
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
      return this.selectionController.syncSelectionEdges(this.umlDoc, baseIds, prevIds);
    }
    setSelectedIds(ids) {
      this.selectionController.setSelectedIds(this.umlDoc, ids);
    }
    selectSingle(id, additive = false) {
      this.selectionController.selectSingle(this.umlDoc, id, additive);
    }
    clearSelection() {
      this.selectionController.clear();
    }
    setViewport(next2) {
      this.viewportController.setViewport(next2);
    }
    setSidebarWidth(width) {
      this.sidebarWidth = Math.max(210, Math.min(560, Math.round(width)));
    }
    setElementsPaneRatio(ratio) {
      this.elementsPaneRatio = Math.max(0.12, Math.min(0.92, Math.round(ratio * 1e3) / 1e3));
    }
  };

  // src/webview/services/layout-engine.ts
  var FRAME_PAD_LEFT = 20;
  var FRAME_PAD_RIGHT = 20;
  var FRAME_PAD_TOP = 28;
  var FRAME_PAD_BOTTOM = 20;
  function estimateNoteLineCount(text2, width) {
    const usableWidth = Math.max(24, width - 22);
    const charsPerLine = Math.max(6, Math.floor(usableWidth / 6.4 * 0.85));
    let lines = 0;
    for (const rawLine of (text2 || "").split("\n")) {
      lines += Math.max(1, Math.ceil(rawLine.length / charsPerLine));
    }
    return Math.max(1, lines);
  }
  function computeNodeMinSize(node, isEditing = false, width = 220, draft) {
    if (node.kind === "shape") return { minWidth: 80, minHeight: 60 };
    if (node.kind === "frame") return { minWidth: 160, minHeight: 120 };
    let contentHeight;
    if (isEditing) {
      if (node.kind === "note") {
        const editedText = draft?.text ?? node.text ?? node.name ?? "";
        const editedName = draft?.name ?? node.name ?? "";
        const lineCount = Math.max(1, estimateNoteLineCount(editedText, width));
        const nameLines = estimateNoteLineCount(editedName, width);
        contentHeight = 52 + Math.max(0, nameLines - 1) * 16 + 20 + lineCount * 18 + 6;
      } else {
        const draftAttrsRows = draft?.attributes?.split("\n").length;
        const draftOpsRows = draft?.operations?.split("\n").length;
        const editAttrsRows = Math.max(1, draftAttrsRows ?? (node.attributes ?? []).length + 1);
        const editOpsRows = Math.max(1, draftOpsRows ?? (node.operations ?? []).length + 1);
        const headerHeight = 100;
        const attrsHeight = node.showAttributes !== false ? 30 + editAttrsRows * 20 : 30;
        const opsHeight = node.showOperations !== false ? 30 + editOpsRows * 20 : 30;
        contentHeight = headerHeight + attrsHeight + opsHeight + 10;
      }
    } else if (node.kind === "note") {
      const lineCount = estimateNoteLineCount(node.text || node.name || "", width);
      const nameLines = estimateNoteLineCount(node.name || "", width);
      contentHeight = 30 + Math.max(0, nameLines - 1) * 16 + 16 + lineCount * 18 + 2;
    } else {
      const headerHeight = (node.stereotype ? 18 : 0) + 36;
      const attrsCount = node.showAttributes !== false ? (node.attributes ?? []).length : 0;
      const opsCount = node.showOperations !== false ? (node.operations ?? []).length : 0;
      const attrsHeight = attrsCount > 0 ? 12 + attrsCount * 19 : 0;
      const opsHeight = opsCount > 0 ? 12 + opsCount * 19 : 0;
      contentHeight = headerHeight + attrsHeight + opsHeight + 4;
    }
    return {
      minWidth: isEditing ? node.kind === "note" ? 200 : 240 : node.kind === "note" ? 100 : 120,
      minHeight: Math.max(60, Math.ceil(contentHeight / GRID_SIZE) * GRID_SIZE)
    };
  }
  function defaultLayoutFor(node, index2) {
    return {
      x: 80 + index2 % 3 * 260,
      y: 80 + Math.floor(index2 / 3) * 190,
      width: node.kind === "frame" ? 260 : 220,
      height: node.kind === "frame" ? 180 : 140
    };
  }
  function computeEffectiveLayouts(doc, optimisticLayouts, gesture, editingNodeId, editingDraft) {
    if (!doc) return {};
    const base = {};
    doc.nodes.forEach((node, index2) => {
      const persisted = doc.layout.nodes[node.id] ?? defaultLayoutFor(node, index2);
      const raw = optimisticLayouts[node.id] ?? persisted;
      const minSize = computeNodeMinSize(
        node,
        editingNodeId === node.id,
        raw.width,
        editingNodeId === node.id ? editingDraft : void 0
      );
      base[node.id] = {
        ...raw,
        width: Math.max(minSize.minWidth, snapToGrid(raw.width, GRID_SIZE)),
        height: Math.max(minSize.minHeight, snapToGrid(raw.height, GRID_SIZE))
      };
    });
    if (gesture.mode === "moving_nodes") {
      const rawDx = gesture.currentWorld.x - gesture.startWorld.x;
      const rawDy = gesture.currentWorld.y - gesture.startWorld.y;
      const snappedDx = snapToGrid(rawDx, GRID_SIZE);
      const snappedDy = snapToGrid(rawDy, GRID_SIZE);
      for (const [id, initial] of Object.entries(gesture.initialLayouts)) {
        base[id] = {
          ...initial,
          x: snapToGrid(initial.x + snappedDx, GRID_SIZE),
          y: snapToGrid(initial.y + snappedDy, GRID_SIZE)
        };
      }
      if (gesture.isShift) {
        for (const node of doc.nodes) {
          if (node.kind !== "frame" || !node.children || node.children.length === 0) continue;
          const movingChildBoxes = node.children.filter((childId) => childId in gesture.initialLayouts).map((childId) => base[childId]).filter((box) => Boolean(box));
          if (movingChildBoxes.length === 0) continue;
          const currentBox = base[node.id];
          if (!currentBox) continue;
          const minX = Math.min(...movingChildBoxes.map((box) => box.x));
          const minY = Math.min(...movingChildBoxes.map((box) => box.y));
          const maxX = Math.max(...movingChildBoxes.map((box) => box.x + box.width));
          const maxY = Math.max(...movingChildBoxes.map((box) => box.y + box.height));
          const frameX = Math.min(currentBox.x, snapToGrid(minX - FRAME_PAD_LEFT, GRID_SIZE));
          const frameY = Math.min(currentBox.y, snapToGrid(minY - FRAME_PAD_TOP, GRID_SIZE));
          const frameRight = Math.max(
            currentBox.x + currentBox.width,
            snapToGrid(maxX + FRAME_PAD_RIGHT, GRID_SIZE)
          );
          const frameBottom = Math.max(
            currentBox.y + currentBox.height,
            snapToGrid(maxY + FRAME_PAD_BOTTOM, GRID_SIZE)
          );
          base[node.id] = {
            x: frameX,
            y: frameY,
            width: Math.max(160, frameRight - frameX),
            height: Math.max(120, frameBottom - frameY)
          };
        }
      }
    } else if (gesture.mode === "resizing_node") {
      const rawDx = gesture.currentWorld.x - gesture.startWorld.x;
      const rawDy = gesture.currentWorld.y - gesture.startWorld.y;
      const minWidth = gesture.minWidth;
      let minHeight = gesture.minHeight;
      const initial = gesture.initialBox;
      const direction = gesture.handle;
      const childBounds = gesture.childBounds;
      const resizingNode = doc.nodes.find((candidate) => candidate.id === gesture.nodeId);
      if (resizingNode?.kind === "note") {
        const widthGuess = direction === "e" || direction === "ne" || direction === "se" ? initial.width + rawDx : direction === "w" || direction === "nw" || direction === "sw" ? initial.width - rawDx : initial.width;
        minHeight = Math.max(
          minHeight,
          computeNodeMinSize(resizingNode, false, Math.max(40, widthGuess)).minHeight
        );
      }
      base[gesture.nodeId] = resolveResizeBox(
        initial,
        direction,
        rawDx,
        rawDy,
        minWidth,
        minHeight,
        childBounds
      );
    }
    if (editingNodeId) {
      for (const node of doc.nodes) {
        if (node.kind !== "frame" || !node.children || !node.children.includes(editingNodeId)) continue;
        const editedBox = base[editingNodeId];
        const currentBox = base[node.id];
        if (!editedBox || !currentBox) continue;
        const right = Math.max(
          currentBox.x + currentBox.width,
          snapToGrid(editedBox.x + editedBox.width + FRAME_PAD_RIGHT, GRID_SIZE)
        );
        const bottom = Math.max(
          currentBox.y + currentBox.height,
          snapToGrid(editedBox.y + editedBox.height + FRAME_PAD_BOTTOM, GRID_SIZE)
        );
        if (right > currentBox.x + currentBox.width || bottom > currentBox.y + currentBox.height) {
          base[node.id] = {
            ...currentBox,
            width: Math.max(currentBox.width, right - currentBox.x),
            height: Math.max(currentBox.height, bottom - currentBox.y)
          };
        }
      }
    }
    return base;
  }
  function resolveResizeBox(initial, direction, rawDx, rawDy, minWidth, minHeight, childBounds) {
    let newX = initial.x;
    let newY = initial.y;
    let newWidth = initial.width;
    let newHeight = initial.height;
    if (direction === "e" || direction === "ne" || direction === "se") {
      const minRight = childBounds ? snapToGrid(childBounds.maxX + FRAME_PAD_RIGHT, GRID_SIZE) : initial.x + minWidth;
      const targetWidth = initial.width + rawDx;
      newWidth = Math.max(minWidth, minRight - initial.x, snapToGrid(targetWidth, GRID_SIZE));
    } else if (direction === "w" || direction === "nw" || direction === "sw") {
      const rightEdge = initial.x + initial.width;
      const maxLeft = childBounds ? snapToGrid(childBounds.minX - FRAME_PAD_LEFT, GRID_SIZE) : rightEdge - minWidth;
      const targetX = initial.x + rawDx;
      newX = Math.min(rightEdge - minWidth, maxLeft, snapToGrid(targetX, GRID_SIZE));
      newWidth = rightEdge - newX;
    }
    if (direction === "s" || direction === "sw" || direction === "se") {
      const minBottom = childBounds ? snapToGrid(childBounds.maxY + FRAME_PAD_BOTTOM, GRID_SIZE) : initial.y + minHeight;
      const targetHeight = initial.height + rawDy;
      newHeight = Math.max(minHeight, minBottom - initial.y, snapToGrid(targetHeight, GRID_SIZE));
    } else if (direction === "n" || direction === "nw" || direction === "ne") {
      const bottomEdge = initial.y + initial.height;
      const maxTop = childBounds ? snapToGrid(childBounds.minY - FRAME_PAD_TOP, GRID_SIZE) : bottomEdge - minHeight;
      const targetY = initial.y + rawDy;
      newY = Math.min(bottomEdge - minHeight, maxTop, snapToGrid(targetY, GRID_SIZE));
      newHeight = bottomEdge - newY;
    }
    return {
      x: newX,
      y: newY,
      width: Math.max(minWidth, newWidth),
      height: Math.max(minHeight, newHeight)
    };
  }
  function computeParallelEdgeOffsets(edges) {
    const pairGroups = /* @__PURE__ */ new Map();
    for (const edge of edges) {
      const pairKey = [edge.source.nodeId, edge.target.nodeId].sort().join("::");
      const group = pairGroups.get(pairKey) ?? [];
      group.push(edge.id);
      pairGroups.set(pairKey, group);
    }
    const offsets = {};
    for (const group of pairGroups.values()) {
      if (group.length <= 1) {
        offsets[group[0]] = 0;
      } else {
        const mid = (group.length - 1) / 2;
        group.forEach((id, index2) => {
          offsets[id] = (index2 - mid) * 22;
        });
      }
    }
    return offsets;
  }
  function computeContentBounds(layouts) {
    const boxes = Object.values(layouts);
    if (boxes.length === 0) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const box of boxes) {
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  // src/webview/services/frame-containment.ts
  var EMPTY_RESULT = { layoutUpdates: {}, childrenUpdates: {} };
  function findFrameAtPoint(doc, layouts, dropPoint) {
    if (!doc) return void 0;
    for (let index2 = doc.nodes.length - 1; index2 >= 0; index2--) {
      const node = doc.nodes[index2];
      if (node.kind !== "frame") continue;
      const box = layouts[node.id];
      if (!box) continue;
      const labelWidth = (node.name || "Frame").length * 7.6 + 16;
      const overLabel = dropPoint.x >= box.x + 16 && dropPoint.x <= box.x + 16 + labelWidth && dropPoint.y >= box.y - 10 && dropPoint.y <= box.y + 10;
      const overBody = dropPoint.x >= box.x && dropPoint.x <= box.x + box.width && dropPoint.y >= box.y && dropPoint.y <= box.y + box.height;
      if (overLabel || overBody) return node;
    }
    return void 0;
  }
  function computeFrameDragDropUpdates(doc, layouts, clickedNodeId, updates, initialLayouts, dropPoint, isShift) {
    if (!doc) return EMPTY_RESULT;
    const frames = doc.nodes.filter((node) => node.kind === "frame");
    if (frames.length === 0) return EMPTY_RESULT;
    const clickedNode = doc.nodes.find((node) => node.id === clickedNodeId);
    const movedFrames = Object.keys(updates).filter(
      (id) => doc.nodes.find((node) => node.id === id && node.kind === "frame")
    );
    if (clickedNode?.kind === "frame" || movedFrames.length > 0) return EMPTY_RESULT;
    const movedNonFrameIds = Object.keys(updates).filter(
      (id) => doc.nodes.find((node) => node.id === id && node.kind !== "frame")
    );
    if (movedNonFrameIds.length === 0) return EMPTY_RESULT;
    const hoveredFrame = findFrameAtPoint(doc, layouts, dropPoint);
    const frameChildrenMap = /* @__PURE__ */ new Map();
    for (const frame of frames) {
      frameChildrenMap.set(frame.id, [...frame.children ?? []]);
    }
    const frameLayoutUpdates = {};
    if (hoveredFrame) {
      const originalChildren = new Set(hoveredFrame.children ?? []);
      const hoveredChildren = frameChildrenMap.get(hoveredFrame.id);
      let anyNewElementAdded = false;
      let anyShiftExistingResized = false;
      for (const nodeId of movedNonFrameIds) {
        const initialBox = initialLayouts[nodeId];
        const frameInitialBox = initialLayouts[hoveredFrame.id] ?? layouts[hoveredFrame.id];
        const wasSpatiallyInside = initialBox && frameInitialBox ? initialBox.x >= frameInitialBox.x && initialBox.y >= frameInitialBox.y && initialBox.x + initialBox.width <= frameInitialBox.x + frameInitialBox.width && initialBox.y + initialBox.height <= frameInitialBox.y + frameInitialBox.height : false;
        const wasAlreadyInside = originalChildren.has(nodeId) || wasSpatiallyInside;
        if (!hoveredChildren.includes(nodeId)) hoveredChildren.push(nodeId);
        if (!wasAlreadyInside) {
          anyNewElementAdded = true;
        } else if (isShift) {
          anyShiftExistingResized = true;
        }
        for (const frame of frames) {
          if (frame.id === hoveredFrame.id) continue;
          const otherChildren = frameChildrenMap.get(frame.id);
          if (!otherChildren) continue;
          const childIndex = otherChildren.indexOf(nodeId);
          if (childIndex !== -1) otherChildren.splice(childIndex, 1);
        }
      }
      if (anyNewElementAdded || anyShiftExistingResized) {
        const persistedFrameBox = doc.layout.nodes[hoveredFrame.id];
        let frameBox = {
          ...initialLayouts[hoveredFrame.id] ?? persistedFrameBox ?? { x: 0, y: 0, width: 260, height: 180 }
        };
        for (const childId of hoveredChildren) {
          const childBox = updates[childId] ?? layouts[childId];
          if (!childBox) continue;
          const frameX = Math.min(frameBox.x, snapToGrid(childBox.x - FRAME_PAD_LEFT, GRID_SIZE));
          const frameY = Math.min(frameBox.y, snapToGrid(childBox.y - FRAME_PAD_TOP, GRID_SIZE));
          const frameRight = Math.max(
            frameBox.x + frameBox.width,
            snapToGrid(childBox.x + childBox.width + FRAME_PAD_RIGHT, GRID_SIZE)
          );
          const frameBottom = Math.max(
            frameBox.y + frameBox.height,
            snapToGrid(childBox.y + childBox.height + FRAME_PAD_BOTTOM, GRID_SIZE)
          );
          const width = Math.max(160, frameRight - frameX);
          const height = Math.max(120, frameBottom - frameY);
          if (frameX !== frameBox.x || frameY !== frameBox.y || width !== frameBox.width || height !== frameBox.height) {
            frameBox = { x: frameX, y: frameY, width, height };
          }
        }
        const documentBox = doc.layout.nodes[hoveredFrame.id];
        if (!documentBox || frameBox.x !== documentBox.x || frameBox.y !== documentBox.y || frameBox.width !== documentBox.width || frameBox.height !== documentBox.height) {
          frameLayoutUpdates[hoveredFrame.id] = frameBox;
        }
      }
    } else {
      for (const nodeId of movedNonFrameIds) {
        for (const frame of frames) {
          const children = frameChildrenMap.get(frame.id);
          if (!children) continue;
          const childIndex = children.indexOf(nodeId);
          if (childIndex !== -1) children.splice(childIndex, 1);
        }
      }
    }
    const changedChildren = {};
    for (const [frameId, children] of frameChildrenMap.entries()) {
      const frame = doc.nodes.find((node) => node.id === frameId);
      if (frame && JSON.stringify(frame.children ?? []) !== JSON.stringify(children)) {
        changedChildren[frameId] = children;
      }
    }
    return { layoutUpdates: frameLayoutUpdates, childrenUpdates: changedChildren };
  }

  // src/webview/services/diagram-exporter.ts
  var FALLBACK_THEME = {
    widgetBg: "#252526",
    editorFg: "#cccccc",
    panelBorder: "rgba(128, 128, 128, 0.35)",
    descriptionFg: "#999999",
    noteBg: "#252526",
    editorBg: "#1e1e1e",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    monoFamily: 'Consolas, "Courier New", monospace',
    nodeBorder: "rgba(128, 128, 128, 0.35)"
  };
  function readTheme(viewportElement) {
    if (typeof window === "undefined") return FALLBACK_THEME;
    const viewportStyles = viewportElement ? window.getComputedStyle(viewportElement) : null;
    const bodyStyles = window.getComputedStyle(document.body);
    const read = (name, fallback2) => viewportStyles?.getPropertyValue(name)?.trim() || bodyStyles.getPropertyValue(name)?.trim() || fallback2;
    const widgetBg = read("--vscode-editorWidget-background", FALLBACK_THEME.widgetBg);
    const panelBorder = read("--vscode-panel-border", FALLBACK_THEME.panelBorder);
    return {
      widgetBg,
      panelBorder,
      editorFg: read("--vscode-editor-foreground", FALLBACK_THEME.editorFg),
      descriptionFg: read("--vscode-descriptionForeground", FALLBACK_THEME.descriptionFg),
      noteBg: read("--vscode-textBlockQuote-background", widgetBg),
      editorBg: read("--vscode-editor-background", FALLBACK_THEME.editorBg),
      fontFamily: read("--vscode-font-family", FALLBACK_THEME.fontFamily),
      monoFamily: read("--vscode-editor-font-family", FALLBACK_THEME.monoFamily),
      nodeBorder: panelBorder
    };
  }
  function resolveRouting(edge, defaultRouting) {
    const routing = edge.visual?.routing;
    if (!routing || routing === "default") return defaultRouting ?? "orthogonal";
    return routing;
  }
  function renderEndpointPath(decoration) {
    const shape = getEndpointShape(decoration?.shape ?? "none");
    if (!shape || shape.kind === "none") return { d: "", fill: "none" };
    const size = decoration?.size ?? shape.defaultSize;
    const d = shape.buildLocalPath(size);
    if (!shape.supportsFill) return { d, fill: "none" };
    return {
      d,
      fill: (decoration?.fill ?? shape.defaultFill ?? "hollow") === "filled" ? "filled" : "hollow"
    };
  }
  function renderDiagramToCanvas(options) {
    const { doc, layouts } = options;
    if (!doc || doc.nodes.length === 0) return null;
    if (typeof document === "undefined") return null;
    const boxes = Object.values(layouts);
    if (boxes.length === 0) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const box of boxes) {
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    }
    const theme = { ...readTheme(options.viewportElement), ...options.theme };
    const parallelOffsets = options.parallelOffsets ?? {};
    const edgeItems = [];
    for (const edge of doc.edges) {
      const sourceBox = layouts[edge.source.nodeId];
      const targetBox = layouts[edge.target.nodeId];
      if (!sourceBox || !targetBox) continue;
      const sourceNode = doc.nodes.find((node) => node.id === edge.source.nodeId);
      const targetNode = doc.nodes.find((node) => node.id === edge.target.nodeId);
      const touchesNote = sourceNode?.kind === "note" || targetNode?.kind === "note";
      const isDashed = (edge.visual?.line ?? (touchesNote ? "dashed" : "solid")) === "dashed";
      const startDecoration = edge.visual?.start ?? { shape: "none", size: 10 };
      const endDecoration = edge.visual?.end ?? { shape: "none", size: 10 };
      const geometry = computeUmlEdgeGeometry(
        sourceBox,
        targetBox,
        resolveRouting(edge, options.defaultRouting),
        startDecoration,
        endDecoration,
        parallelOffsets[edge.id] ?? 0,
        void 0,
        void 0,
        sourceNode?.kind === "shape" ? sourceNode.shape : void 0,
        targetNode?.kind === "shape" ? targetNode.shape : void 0,
        edge.label
      );
      const startMarker = renderEndpointPath(startDecoration);
      const endMarker = renderEndpointPath(endDecoration);
      const startMultiplicityPoint = getMultiplicityLabelPoint(
        geometry.startTip,
        geometry.startAngleDeg,
        edge.source.multiplicity
      );
      const endMultiplicityPoint = getMultiplicityLabelPoint(
        geometry.endTip,
        geometry.endAngleDeg,
        edge.target.multiplicity
      );
      edgeItems.push({
        edge,
        geometry,
        startDecoration,
        endDecoration,
        isDashed,
        startMarker,
        endMarker,
        startMultiplicityPoint,
        endMultiplicityPoint
      });
      if (edge.label) {
        minX = Math.min(minX, geometry.labelPoint.x - 50);
        minY = Math.min(minY, geometry.labelPoint.y - 20);
        maxX = Math.max(maxX, geometry.labelPoint.x + 50);
        maxY = Math.max(maxY, geometry.labelPoint.y + 20);
      }
      if (edge.source.multiplicity) {
        minX = Math.min(minX, startMultiplicityPoint.x - 30);
        minY = Math.min(minY, startMultiplicityPoint.y - 15);
        maxX = Math.max(maxX, startMultiplicityPoint.x + 30);
        maxY = Math.max(maxY, startMultiplicityPoint.y + 15);
      }
      if (edge.target.multiplicity) {
        minX = Math.min(minX, endMultiplicityPoint.x - 30);
        minY = Math.min(minY, endMultiplicityPoint.y - 15);
        maxX = Math.max(maxX, endMultiplicityPoint.x + 30);
        maxY = Math.max(maxY, endMultiplicityPoint.y + 15);
      }
    }
    const padding = 40;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    const width = Math.max(200, Math.ceil(maxX - minX));
    const height = Math.max(200, Math.ceil(maxY - minY));
    const scale = options.scale ?? 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.scale(scale, scale);
    ctx.translate(-minX, -minY);
    const drawRoundRect = (x, y, w, h, radius) => {
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, w, h, radius);
      } else {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.arcTo(x + w, y, x + w, y + radius, radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
        ctx.lineTo(x + radius, y + h);
        ctx.arcTo(x, y + h, x, y + h - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
      }
    };
    for (const node of doc.nodes) {
      if (node.kind !== "frame") continue;
      const box = layouts[node.id];
      if (!box) continue;
      ctx.save();
      ctx.translate(box.x, box.y);
      drawRoundRect(0, 0, box.width, box.height, 6);
      ctx.strokeStyle = theme.nodeBorder;
      ctx.lineWidth = 3;
      ctx.setLineDash(node.line === "dashed" ? [8, 6] : []);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = `11px ${theme.fontFamily}`;
      const label = node.name || "Frame";
      const metrics = ctx.measureText(label);
      const badgeWidth = Math.max(label.length * 7.6 + 16, metrics.width + 16);
      drawRoundRect(16, -10, badgeWidth, 20, 4);
      ctx.fillStyle = theme.widgetBg;
      ctx.fill();
      ctx.strokeStyle = theme.panelBorder;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = theme.editorFg;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 16 + badgeWidth / 2, 0);
      ctx.restore();
    }
    for (const item of edgeItems) {
      const { edge, geometry, isDashed, startMarker, endMarker, startDecoration, endDecoration } = item;
      ctx.save();
      ctx.strokeStyle = theme.editorFg;
      ctx.lineWidth = 1.75;
      ctx.setLineDash(isDashed ? [6, 4] : []);
      ctx.stroke(new Path2D(geometry.pathD));
      ctx.restore();
      const drawMarker = (marker, tip, angle, decoration) => {
        if (!marker.d) return;
        ctx.save();
        ctx.translate(tip.x, tip.y);
        ctx.rotate(angle * Math.PI / 180);
        const path = new Path2D(marker.d);
        if (marker.fill !== "none") {
          ctx.fillStyle = decoration.fill === "filled" ? theme.editorFg : theme.editorBg;
          ctx.fill(path);
        }
        ctx.strokeStyle = theme.editorFg;
        ctx.lineWidth = 1.75;
        ctx.lineJoin = "round";
        ctx.stroke(path);
        ctx.restore();
      };
      drawMarker(startMarker, geometry.startTip, geometry.startAngleDeg, startDecoration);
      drawMarker(endMarker, geometry.endTip, geometry.endAngleDeg, endDecoration);
      const drawMultiplicity = (point, text2) => {
        ctx.save();
        ctx.font = `600 10.5px ${theme.monoFamily}`;
        const metrics = ctx.measureText(text2);
        const widthBadge = Math.max(text2.length * 7.6 + 12, metrics.width + 12);
        const left = point.x - widthBadge / 2;
        const top = point.y - 9;
        drawRoundRect(left, top, widthBadge, 17, 3);
        ctx.fillStyle = theme.editorBg;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = theme.panelBorder;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = theme.editorFg;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text2, point.x, point.y - 0.5);
        ctx.restore();
      };
      if (edge.source.multiplicity) drawMultiplicity(item.startMultiplicityPoint, edge.source.multiplicity);
      if (edge.target.multiplicity) drawMultiplicity(item.endMultiplicityPoint, edge.target.multiplicity);
      if (edge.label) {
        ctx.save();
        ctx.font = `11px ${theme.fontFamily}`;
        const metrics = ctx.measureText(edge.label);
        const widthBadge = Math.max(edge.label.length * 7.6 + 16, metrics.width + 16);
        drawRoundRect(geometry.labelPoint.x - widthBadge / 2, geometry.labelPoint.y - 10, widthBadge, 20, 4);
        ctx.fillStyle = theme.widgetBg;
        ctx.fill();
        ctx.strokeStyle = theme.panelBorder;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = theme.editorFg;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(edge.label, geometry.labelPoint.x, geometry.labelPoint.y);
        ctx.restore();
      }
    }
    for (const node of doc.nodes) {
      if (node.kind === "frame") continue;
      const box = layouts[node.id];
      if (!box) continue;
      if (node.kind === "shape") {
        ctx.save();
        ctx.translate(box.x, box.y);
        const path = new Path2D(buildShapeSvgPath(node.shape, box.width, box.height));
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = theme.widgetBg;
        ctx.fill(path);
        ctx.restore();
        ctx.strokeStyle = theme.nodeBorder;
        ctx.lineWidth = 1.75;
        ctx.lineJoin = "round";
        ctx.stroke(path);
        ctx.fillStyle = theme.editorFg;
        ctx.font = `600 13px ${theme.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.name || "", box.width / 2, box.height / 2);
        ctx.restore();
        continue;
      }
      const kindDescriptor = getUmlNodeKind(node.kind);
      const stereotype = node.stereotype || kindDescriptor?.defaultStereotype || (!kindDescriptor ? `unsupported: ${node.kind}` : "");
      const headerHeight = node.kind === "note" ? 30 : stereotype ? 42 : 30;
      ctx.save();
      ctx.translate(box.x, box.y);
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.16)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      drawRoundRect(0, 0, box.width, box.height, 5);
      ctx.fillStyle = node.kind === "note" ? theme.noteBg : theme.widgetBg;
      ctx.fill();
      ctx.restore();
      drawRoundRect(0, 0, box.width, box.height, 5);
      ctx.strokeStyle = theme.nodeBorder;
      ctx.lineWidth = 1.5;
      if (node.kind === "note") ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.save();
      drawRoundRect(0, 0, box.width, box.height, 5);
      ctx.clip();
      if (stereotype) {
        ctx.fillStyle = theme.descriptionFg;
        ctx.font = `11px ${theme.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(`\xAB${stereotype}\xBB`, box.width / 2, 7);
      }
      ctx.fillStyle = theme.editorFg;
      ctx.font = `600 13px ${theme.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(node.name || "", box.width / 2, stereotype ? 22 : (headerHeight - 16) / 2);
      ctx.strokeStyle = theme.panelBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, headerHeight);
      ctx.lineTo(box.width, headerHeight);
      ctx.stroke();
      let currentY = headerHeight;
      if (node.kind === "note") {
        const content = node.text || "";
        const contentFont = `12px ${theme.fontFamily}`;
        ctx.font = contentFont;
        ctx.fillStyle = theme.editorFg;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        const padX = 10;
        const lineHeight = 16.8;
        let lineY = headerHeight + 8;
        const maxWidth = box.width - padX * 2;
        for (const rawLine of content.split("\n")) {
          if (lineY + lineHeight > box.height) break;
          if (!rawLine) {
            lineY += lineHeight;
            continue;
          }
          let currentLine = "";
          for (const word of rawLine.split(" ")) {
            const candidate = currentLine ? `${currentLine} ${word}` : word;
            if (ctx.measureText(candidate).width > maxWidth && currentLine) {
              ctx.fillText(currentLine, padX, lineY);
              lineY += lineHeight;
              if (lineY + lineHeight > box.height) break;
              currentLine = word;
            } else {
              currentLine = candidate;
            }
          }
          if (currentLine && lineY + lineHeight <= box.height + 4) {
            ctx.fillText(currentLine, padX, lineY);
            lineY += lineHeight;
          }
        }
      } else {
        const memberLineHeight = 16.7;
        const memberPadX = 8;
        const attributes = node.showAttributes !== false ? node.attributes ?? [] : [];
        if (attributes.length > 0) {
          let lineY = currentY + 5;
          for (const attribute of attributes) {
            ctx.font = `bold 11.5px ${theme.monoFamily}`;
            ctx.fillStyle = theme.editorFg;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(formatVisibilitySign(attribute.visibility), memberPadX, lineY);
            const nameX = memberPadX + 16;
            ctx.font = `11.5px ${theme.monoFamily}`;
            ctx.fillText(attribute.name || "", nameX, lineY);
            if (attribute.type) {
              const nameWidth = ctx.measureText(attribute.name || "").width;
              ctx.fillStyle = theme.descriptionFg;
              ctx.fillText(`: ${attribute.type}`, nameX + nameWidth, lineY);
            }
            lineY += memberLineHeight;
          }
          currentY = lineY + 5;
          ctx.strokeStyle = theme.panelBorder;
          ctx.beginPath();
          ctx.moveTo(0, currentY);
          ctx.lineTo(box.width, currentY);
          ctx.stroke();
        }
        const operations = node.showOperations !== false ? node.operations ?? [] : [];
        if (operations.length > 0) {
          let lineY = currentY + 5;
          for (const operation of operations) {
            ctx.font = `bold 11.5px ${theme.monoFamily}`;
            ctx.fillStyle = theme.editorFg;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(formatVisibilitySign(operation.visibility), memberPadX, lineY);
            const nameX = memberPadX + 16;
            ctx.font = `11.5px ${theme.monoFamily}`;
            const parameters = extractOperationParameters(operation).map((parameter) => parameter.name + (parameter.type ? `: ${parameter.type}` : "")).join(", ");
            const signature = `${operation.name || ""}(${parameters})`;
            ctx.fillText(signature, nameX, lineY);
            if (operation.returnType) {
              const signatureWidth = ctx.measureText(signature).width;
              ctx.fillStyle = theme.descriptionFg;
              ctx.fillText(`: ${operation.returnType}`, nameX + signatureWidth, lineY);
            }
            lineY += memberLineHeight;
          }
        }
      }
      ctx.restore();
      ctx.restore();
    }
    return { canvas, width, height };
  }
  function canvasToPngBase64(canvas) {
    return canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
  }
  function canvasToPngBlob(canvas) {
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
  }

  // src/webview/canvas/nodes/parts/NodeCompartment.svelte
  var root3 = from_html(`<textarea class="vz-inline-textarea"></textarea>`);
  var root_13 = from_html(`<div class="vz-inline-sec-hdr"><span> </span> <button type="button"> </button></div> <!>`, 1);
  var root_23 = from_html(`<span class="vz-type"> </span>`);
  var root_33 = from_html(`<div class="vz-uml-member"><span class="vz-vis"> </span> <span> </span> <!></div>`);
  var root_43 = from_html(`<span>,</span>`);
  var root_52 = from_html(`<!> <span> </span> <!>`, 1);
  var root_62 = from_html(`<div class="vz-uml-member"><span class="vz-vis"> </span> <span> </span> <!> <span>)</span> <!></div>`);
  var root_72 = from_html(`<div><!></div>`);
  function NodeCompartment($$anchor, $$props) {
    push($$props, true);
    let visible = prop($$props, "visible", 3, true), editing = prop($$props, "editing", 3, false), draft = prop($$props, "draft", 3, ""), readOnly = prop($$props, "readOnly", 3, false), last = prop($$props, "last", 3, false);
    const title = user_derived(() => $$props.kind === "attributes" ? "Attributes" : "Operations");
    const placeholder = user_derived(() => $$props.kind === "attributes" ? "+ name: type\n- privateField: string" : "+ method(): returnType\n+ execute(arg: type)");
    const memberCount = user_derived(() => $$props.kind === "attributes" ? ($$props.node.attributes ?? []).length : ($$props.node.operations ?? []).length);
    function handleBlur(event2) {
      const next2 = event2.relatedTarget;
      if (next2?.closest(`[data-node-id="${$$props.node.id}"]`)) return;
      $$props.onCommit?.();
    }
    var fragment = comment();
    var node_1 = first_child(fragment);
    {
      var consequent_7 = ($$anchor2) => {
        var div = root_72();
        let classes;
        var node_2 = child(div);
        {
          var consequent_1 = ($$anchor3) => {
            var fragment_1 = root_13();
            var div_1 = first_child(fragment_1);
            var span = child(div_1);
            var text2 = only_child(span, true);
            var button = sibling(span, 2);
            let classes_1;
            var text_1 = only_child(button, true);
            reset(div_1);
            var node_3 = sibling(div_1, 2);
            {
              var consequent = ($$anchor4) => {
                var textarea = root3();
                remove_textarea_child(textarea);
                template_effect(
                  ($0) => {
                    set_attribute2(textarea, "rows", $0);
                    set_attribute2(textarea, "placeholder", get(placeholder));
                    set_value(textarea, draft());
                    set_attribute2(textarea, "aria-label", get(title));
                  },
                  [() => Math.max(1, draft().split("\n").length)]
                );
                delegated("input", textarea, (event2) => $$props.onDraftChange?.(event2.currentTarget.value));
                event("blur", textarea, handleBlur);
                delegated("keydown", textarea, (event2) => {
                  if (event2.key === "Escape") $$props.onCancel?.();
                });
                append($$anchor4, textarea);
              };
              if_block(node_3, ($$render) => {
                if (visible()) $$render(consequent);
              });
            }
            template_effect(() => {
              set_text(text2, get(title));
              classes_1 = set_class(button, 1, "vz-eye-toggle-btn", null, classes_1, { off: !visible() });
              set_attribute2(button, "title", visible() ? `Hide ${get(title)}` : `Show ${get(title)}`);
              set_attribute2(button, "aria-label", visible() ? `Hide ${get(title)}` : `Show ${get(title)}`);
              button.disabled = readOnly();
              set_text(text_1, visible() ? "\u25C9" : "\u25CB");
            });
            delegated("click", button, (event2) => {
              event2.stopPropagation();
              $$props.onToggle?.();
            });
            append($$anchor3, fragment_1);
          };
          var consequent_3 = ($$anchor3) => {
            var fragment_2 = comment();
            var node_4 = first_child(fragment_2);
            each(node_4, 17, () => $$props.node.attributes ?? [], (attribute) => attribute.id, ($$anchor4, attribute) => {
              var div_2 = root_33();
              var span_1 = child(div_2);
              var text_2 = only_child(span_1, true);
              var span_2 = sibling(span_1, 2);
              var text_3 = only_child(span_2, true);
              var node_5 = sibling(span_2, 2);
              {
                var consequent_2 = ($$anchor5) => {
                  var span_3 = root_23();
                  var text_4 = only_child(span_3);
                  template_effect(() => set_text(text_4, `: ${get(attribute).type ?? ""}`));
                  append($$anchor5, span_3);
                };
                if_block(node_5, ($$render) => {
                  if (get(attribute).type) $$render(consequent_2);
                });
              }
              reset(div_2);
              template_effect(
                ($0) => {
                  set_text(text_2, $0);
                  set_text(text_3, get(attribute).name);
                },
                [() => formatVisibilitySign(get(attribute).visibility)]
              );
              append($$anchor4, div_2);
            });
            append($$anchor3, fragment_2);
          };
          var alternate = ($$anchor3) => {
            var fragment_3 = comment();
            var node_6 = first_child(fragment_3);
            each(node_6, 17, () => $$props.node.operations ?? [], (operation) => operation.id, ($$anchor4, operation) => {
              const parameters = user_derived(() => extractOperationParameters(get(operation)));
              var div_3 = root_62();
              var span_4 = child(div_3);
              var text_5 = only_child(span_4, true);
              var span_5 = sibling(span_4, 2);
              var text_6 = only_child(span_5);
              var node_7 = sibling(span_5, 2);
              each(node_7, 19, () => get(parameters), (parameter, index2) => parameter.id ?? index2, ($$anchor5, parameter, index2) => {
                var fragment_4 = root_52();
                var node_8 = first_child(fragment_4);
                {
                  var consequent_4 = ($$anchor6) => {
                    var span_6 = root_43();
                    append($$anchor6, span_6);
                  };
                  if_block(node_8, ($$render) => {
                    if (get(index2) > 0) $$render(consequent_4);
                  });
                }
                var span_7 = sibling(node_8, 2);
                var text_7 = only_child(span_7, true);
                var node_9 = sibling(span_7, 2);
                {
                  var consequent_5 = ($$anchor6) => {
                    var span_8 = root_23();
                    var text_8 = only_child(span_8);
                    template_effect(() => set_text(text_8, `: ${get(parameter).type ?? ""}`));
                    append($$anchor6, span_8);
                  };
                  if_block(node_9, ($$render) => {
                    if (get(parameter).type) $$render(consequent_5);
                  });
                }
                template_effect(() => set_text(text_7, get(parameter).name));
                append($$anchor5, fragment_4);
              });
              var node_10 = sibling(node_7, 4);
              {
                var consequent_6 = ($$anchor5) => {
                  var span_9 = root_23();
                  var text_9 = only_child(span_9);
                  template_effect(() => set_text(text_9, `: ${get(operation).returnType ?? ""}`));
                  append($$anchor5, span_9);
                };
                if_block(node_10, ($$render) => {
                  if (get(operation).returnType) $$render(consequent_6);
                });
              }
              reset(div_3);
              template_effect(
                ($0) => {
                  set_text(text_5, $0);
                  set_text(text_6, `${get(operation).name ?? ""}(`);
                },
                [() => formatVisibilitySign(get(operation).visibility)]
              );
              append($$anchor4, div_3);
            });
            append($$anchor3, fragment_3);
          };
          if_block(node_2, ($$render) => {
            if (editing()) $$render(consequent_1);
            else if ($$props.kind === "attributes") $$render(consequent_3, 1);
            else $$render(alternate, -1);
          });
        }
        reset(div);
        template_effect(() => classes = set_class(div, 1, "vz-uml-compartment", null, classes, { "is-last": last() }));
        append($$anchor2, div);
      };
      if_block(node_1, ($$render) => {
        if (editing() || visible() && get(memberCount) > 0) $$render(consequent_7);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click", "input", "keydown"]);

  // src/webview/canvas/nodes/parts/NodeHeader.svelte
  var root4 = from_html(`<div class="vz-inline-field"><div class="vz-inline-sec-hdr"><span>Name</span></div> <input type="text" class="vz-inline-input" aria-label="Note name"/></div>`);
  var root_14 = from_html(`<div class="vz-inline-field"><div class="vz-inline-sec-hdr"><span>Stereotype</span></div> <input type="text" class="vz-inline-input" placeholder="e.g. entity, service" aria-label="Stereotype"/></div>`);
  var root_24 = from_html(`<div class="vz-inline-fields"><div class="vz-inline-field"><div class="vz-inline-sec-hdr"><span>Name</span></div> <input type="text" class="vz-inline-input" placeholder="Name" aria-label="Node name"/></div> <!></div>`);
  var root_34 = from_html(`<div class="vz-uml-stereotype"> </div>`);
  var root_44 = from_html(`<!> <div class="vz-uml-node-title"> </div>`, 1);
  var root_53 = from_html(`<div><!></div>`);
  function NodeHeader($$anchor, $$props) {
    push($$props, true);
    let editing = prop($$props, "editing", 3, false), name = prop($$props, "name", 3, ""), stereotype = prop($$props, "stereotype", 3, ""), readOnly = prop($$props, "readOnly", 3, false);
    const kindDescriptor = user_derived(() => getUmlNodeKind($$props.node.kind));
    const displayStereotype = user_derived(() => $$props.node.stereotype || get(kindDescriptor)?.defaultStereotype || "");
    function handleKeyDown(event2) {
      if (event2.key === "Enter") {
        event2.preventDefault();
        $$props.onCommit?.();
      } else if (event2.key === "Escape") {
        event2.preventDefault();
        $$props.onCancel?.();
      }
    }
    function handleBlur(event2) {
      const next2 = event2.relatedTarget;
      if (next2?.closest(`[data-node-id="${$$props.node.id}"]`)) return;
      $$props.onCommit?.();
    }
    var div = root_53();
    let classes;
    var node_1 = child(div);
    {
      var consequent_2 = ($$anchor2) => {
        var fragment = comment();
        var node_2 = first_child(fragment);
        {
          var consequent = ($$anchor3) => {
            var div_1 = root4();
            var input = sibling(child(div_1), 2);
            remove_input_defaults(input);
            reset(div_1);
            template_effect(() => set_value(input, name()));
            delegated("input", input, (event2) => $$props.onDraftChange?.({ name: event2.currentTarget.value }));
            event("blur", input, handleBlur);
            delegated("keydown", input, handleKeyDown);
            append($$anchor3, div_1);
          };
          var alternate = ($$anchor3) => {
            var div_2 = root_24();
            var div_3 = child(div_2);
            var input_1 = sibling(child(div_3), 2);
            remove_input_defaults(input_1);
            reset(div_3);
            var node_3 = sibling(div_3, 2);
            {
              var consequent_1 = ($$anchor4) => {
                var div_4 = root_14();
                var input_2 = sibling(child(div_4), 2);
                remove_input_defaults(input_2);
                reset(div_4);
                template_effect(() => set_value(input_2, stereotype()));
                delegated("input", input_2, (event2) => $$props.onDraftChange?.({ stereotype: event2.currentTarget.value }));
                event("blur", input_2, handleBlur);
                delegated("keydown", input_2, handleKeyDown);
                append($$anchor4, div_4);
              };
              if_block(node_3, ($$render) => {
                if ($$props.node.kind !== "note") $$render(consequent_1);
              });
            }
            reset(div_2);
            template_effect(() => set_value(input_1, name()));
            delegated("input", input_1, (event2) => $$props.onDraftChange?.({ name: event2.currentTarget.value }));
            event("blur", input_1, handleBlur);
            delegated("keydown", input_1, handleKeyDown);
            append($$anchor3, div_2);
          };
          if_block(node_2, ($$render) => {
            if ($$props.node.kind === "note") $$render(consequent);
            else $$render(alternate, -1);
          });
        }
        append($$anchor2, fragment);
      };
      var alternate_1 = ($$anchor2) => {
        var fragment_1 = root_44();
        var node_4 = first_child(fragment_1);
        {
          var consequent_3 = ($$anchor3) => {
            var div_5 = root_34();
            var text2 = only_child(div_5);
            template_effect(() => set_text(text2, `\xAB${get(displayStereotype) ?? ""}\xBB`));
            append($$anchor3, div_5);
          };
          var consequent_4 = ($$anchor3) => {
            var div_6 = root_34();
            var text_1 = only_child(div_6);
            template_effect(() => set_text(text_1, `\xABunsupported: ${$$props.node.kind ?? ""}\xBB`));
            append($$anchor3, div_6);
          };
          if_block(node_4, ($$render) => {
            if ($$props.node.kind !== "note" && get(displayStereotype)) $$render(consequent_3);
            else if (!get(kindDescriptor)) $$render(consequent_4, 1);
          });
        }
        var div_7 = sibling(node_4, 2);
        var text_2 = only_child(div_7, true);
        template_effect(() => set_text(text_2, $$props.node.name));
        append($$anchor2, fragment_1);
      };
      if_block(node_1, ($$render) => {
        if (editing()) $$render(consequent_2);
        else $$render(alternate_1, -1);
      });
    }
    reset(div);
    template_effect(() => classes = set_class(div, 1, "vz-uml-node-header", null, classes, { editing: editing() }));
    append($$anchor, div);
    pop();
  }
  delegate(["input", "keydown"]);

  // src/webview/canvas/nodes/parts/ResizeHandles.svelte
  var root5 = from_html(`<div class="vz-resize-handle vz-resize-corner" title="Drag to resize (snaps to 20px grid)" role="presentation"></div>`);
  var root_15 = from_html(`<div class="vz-resize-handle" title="Drag to resize (snaps to 20px grid)" role="presentation"></div> <!>`, 1);
  function ResizeHandles($$anchor, $$props) {
    push($$props, true);
    let selected = prop($$props, "selected", 3, false), visible = prop($$props, "visible", 3, false), showCorner = prop($$props, "showCorner", 3, true);
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_1 = ($$anchor2) => {
        var fragment_1 = root_15();
        var div = first_child(fragment_1);
        var node_1 = sibling(div, 2);
        {
          var consequent = ($$anchor3) => {
            var div_1 = root5();
            delegated("pointerdown", div_1, (event2) => $$props.onresize?.(event2, "se"));
            append($$anchor3, div_1);
          };
          if_block(node_1, ($$render) => {
            if (selected() && showCorner()) $$render(consequent);
          });
        }
        delegated("pointerdown", div, (event2) => $$props.onresize?.(event2, "se"));
        append($$anchor2, fragment_1);
      };
      if_block(node, ($$render) => {
        if (visible()) $$render(consequent_1);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["pointerdown"]);

  // src/webview/canvas/nodes/parts/ConnectPorts.svelte
  var root6 = from_html(`<div class="vz-connect-port" title="Drag to another node to connect relation" role="presentation"></div>`);
  function ConnectPorts($$anchor, $$props) {
    push($$props, true);
    let visible = prop($$props, "visible", 3, false);
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root6();
        delegated("pointerdown", div, (event2) => $$props.onconnect?.(event2));
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (visible()) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["pointerdown"]);

  // src/webview/canvas/nodes/ClassNode.svelte
  var root7 = from_html(`<div role="button"><!> <!> <!> <!> <!></div>`);
  function ClassNode($$anchor, $$props) {
    push($$props, true);
    let selected = prop($$props, "selected", 3, false);
    const editingState = user_derived(() => $$props.store.inlineEdit.state.mode === "node" && $$props.store.inlineEdit.state.nodeId === $$props.node.id ? $$props.store.inlineEdit.state : null);
    const isEditing = user_derived(() => Boolean(get(editingState)));
    const readOnly = user_derived(() => $$props.store.isReadOnly);
    const showAttributes = user_derived(() => $$props.node.showAttributes !== false);
    const showOperations = user_derived(() => $$props.node.showOperations !== false);
    function toggleCompartment(kind) {
      if (get(readOnly)) return;
      $$props.store.dispatchOperation({
        type: "uml.updateNode",
        nodeId: $$props.node.id,
        ...kind === "attributes" ? { showAttributes: $$props.node.showAttributes === false } : { showOperations: $$props.node.showOperations === false }
      });
    }
    var div = root7();
    let classes;
    var node_1 = child(div);
    {
      let $0 = user_derived(() => get(editingState)?.name ?? "");
      let $1 = user_derived(() => get(editingState)?.stereotype ?? "");
      NodeHeader(node_1, {
        get node() {
          return $$props.node;
        },
        get editing() {
          return get(isEditing);
        },
        get name() {
          return get($0);
        },
        get stereotype() {
          return get($1);
        },
        get readOnly() {
          return get(readOnly);
        },
        onDraftChange: (patch) => $$props.store.inlineEdit.updateNodeDraft(patch),
        onCommit: () => $$props.store.inlineEdit.commitNode($$props.node)
      });
    }
    var node_2 = sibling(node_1, 2);
    {
      let $0 = user_derived(() => get(editingState)?.attributes ?? "");
      NodeCompartment(node_2, {
        get node() {
          return $$props.node;
        },
        kind: "attributes",
        get visible() {
          return get(showAttributes);
        },
        get editing() {
          return get(isEditing);
        },
        get draft() {
          return get($0);
        },
        get readOnly() {
          return get(readOnly);
        },
        onToggle: () => toggleCompartment("attributes"),
        onDraftChange: (value) => $$props.store.inlineEdit.updateNodeDraft({ attributes: value }),
        onCommit: () => $$props.store.inlineEdit.commitNode($$props.node)
      });
    }
    var node_3 = sibling(node_2, 2);
    {
      let $0 = user_derived(() => get(editingState)?.operations ?? "");
      NodeCompartment(node_3, {
        get node() {
          return $$props.node;
        },
        kind: "operations",
        get visible() {
          return get(showOperations);
        },
        get editing() {
          return get(isEditing);
        },
        get draft() {
          return get($0);
        },
        get readOnly() {
          return get(readOnly);
        },
        last: true,
        onToggle: () => toggleCompartment("operations"),
        onDraftChange: (value) => $$props.store.inlineEdit.updateNodeDraft({ operations: value }),
        onCommit: () => $$props.store.inlineEdit.commitNode($$props.node)
      });
    }
    var node_4 = sibling(node_3, 2);
    {
      let $0 = user_derived(() => selected() && !get(readOnly));
      ResizeHandles(node_4, {
        get selected() {
          return selected();
        },
        get visible() {
          return get($0);
        },
        onresize: (event2, handle) => $$props.onresizestart?.(event2, $$props.node, handle)
      });
    }
    var node_5 = sibling(node_4, 2);
    {
      let $0 = user_derived(() => selected() && !get(readOnly) && !get(isEditing));
      ConnectPorts(node_5, {
        get visible() {
          return get($0);
        },
        onconnect: (event2) => $$props.onconnectstart?.(event2, $$props.node)
      });
    }
    reset(div);
    template_effect(() => {
      classes = set_class(div, 1, "vz-uml-node kind-class", null, classes, { selected: selected(), "inline-editing": get(isEditing) });
      set_attribute2(div, "data-node-id", $$props.node.id);
      set_style(div, `left: ${$$props.box.x ?? ""}px; top: ${$$props.box.y ?? ""}px; width: ${$$props.box.width ?? ""}px; height: ${$$props.box.height ?? ""}px;`);
      set_attribute2(div, "tabindex", get(readOnly) ? -1 : 0);
      set_attribute2(div, "aria-label", `${$$props.node.kind ?? ""}: ${$$props.node.name ?? ""}`);
      set_attribute2(div, "aria-pressed", selected());
    });
    delegated("pointerdown", div, (event2) => $$props.onpointerdown?.(event2, $$props.node));
    delegated("contextmenu", div, (event2) => $$props.oncontextmenu?.(event2, $$props.node));
    delegated("dblclick", div, (event2) => $$props.ondblclick?.(event2, $$props.node));
    append($$anchor, div);
    pop();
  }
  delegate(["pointerdown", "contextmenu", "dblclick"]);

  // src/webview/canvas/nodes/FrameNode.svelte
  var root8 = from_html(`<div role="presentation"></div>`);
  var root_16 = from_html(`<div class="vz-resize-handle" title="Drag to resize frame (snaps to 20px grid)" role="presentation"></div>`);
  var root_25 = from_html(`<div role="button"><!> <!></div>`);
  function FrameNode($$anchor, $$props) {
    push($$props, true);
    let selected = prop($$props, "selected", 3, false);
    const readOnly = user_derived(() => $$props.store.isReadOnly);
    const handles = [
      {
        direction: "n",
        className: "top",
        label: "Drag to resize top side"
      },
      {
        direction: "s",
        className: "bottom",
        label: "Drag to resize bottom side"
      },
      {
        direction: "w",
        className: "left",
        label: "Drag to resize left side"
      },
      {
        direction: "e",
        className: "right",
        label: "Drag to resize right side"
      }
    ];
    var div = root_25();
    let classes;
    var node_1 = child(div);
    {
      var consequent = ($$anchor2) => {
        var fragment = comment();
        var node_2 = first_child(fragment);
        each(node_2, 17, () => handles, (handle) => handle.direction, ($$anchor3, handle) => {
          var div_1 = root8();
          template_effect(() => {
            set_class(div_1, 1, `vz-frame-edge-hit ${get(handle).className ?? ""}`);
            set_attribute2(div_1, "title", get(handle).label);
          });
          delegated("pointerdown", div_1, (event2) => $$props.onresizestart?.(event2, $$props.node, get(handle).direction));
          append($$anchor3, div_1);
        });
        append($$anchor2, fragment);
      };
      if_block(node_1, ($$render) => {
        if (!get(readOnly)) $$render(consequent);
      });
    }
    var node_3 = sibling(node_1, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var div_2 = root_16();
        delegated("pointerdown", div_2, (event2) => $$props.onresizestart?.(event2, $$props.node, "se"));
        append($$anchor2, div_2);
      };
      if_block(node_3, ($$render) => {
        if (selected() && !get(readOnly)) $$render(consequent_1);
      });
    }
    reset(div);
    template_effect(() => {
      classes = set_class(div, 1, "vz-uml-node kind-frame", null, classes, { selected: selected(), dashed: $$props.node.line === "dashed" });
      set_attribute2(div, "data-node-id", $$props.node.id);
      set_style(div, `left: ${$$props.box.x ?? ""}px; top: ${$$props.box.y ?? ""}px; width: ${$$props.box.width ?? ""}px; height: ${$$props.box.height ?? ""}px;`);
      set_attribute2(div, "tabindex", get(readOnly) ? -1 : 0);
      set_attribute2(div, "aria-label", `UML frame ${$$props.node.name ?? ""}`);
      set_attribute2(div, "aria-pressed", selected());
    });
    delegated("pointerdown", div, (event2) => $$props.onpointerdown?.(event2, $$props.node));
    delegated("contextmenu", div, (event2) => $$props.oncontextmenu?.(event2, $$props.node));
    delegated("dblclick", div, (event2) => $$props.ondblclick?.(event2, $$props.node));
    append($$anchor, div);
    pop();
  }
  delegate(["pointerdown", "contextmenu", "dblclick"]);

  // src/webview/canvas/nodes/NoteNode.svelte
  var root9 = from_html(`<div class="vz-note-body editing"><textarea class="vz-inline-textarea vz-note-textarea" placeholder="Write architecture notes, constraints, or implementation guidance\u2026" aria-label="Note text"></textarea></div>`);
  var root_17 = from_html(`<div class="vz-note-text"> </div>`);
  var root_26 = from_html(`<div class="vz-note-placeholder">Double-click to add note text</div>`);
  var root_35 = from_html(`<div class="vz-note-body"><!></div>`);
  var root_45 = from_html(`<div role="button"><!> <!> <!> <!></div>`);
  function NoteNode($$anchor, $$props) {
    push($$props, true);
    let selected = prop($$props, "selected", 3, false);
    const editingState = user_derived(() => $$props.store.inlineEdit.state.mode === "node" && $$props.store.inlineEdit.state.nodeId === $$props.node.id ? $$props.store.inlineEdit.state : null);
    const readOnly = user_derived(() => $$props.store.isReadOnly);
    var div = root_45();
    let classes;
    var node_1 = child(div);
    {
      let $0 = user_derived(() => Boolean(get(editingState)));
      let $1 = user_derived(() => get(editingState)?.name ?? "");
      NodeHeader(node_1, {
        get node() {
          return $$props.node;
        },
        get editing() {
          return get($0);
        },
        get name() {
          return get($1);
        },
        get readOnly() {
          return get(readOnly);
        },
        onDraftChange: (patch) => $$props.store.inlineEdit.updateNodeDraft(patch),
        onCommit: () => $$props.store.inlineEdit.commitNode($$props.node)
      });
    }
    var node_2 = sibling(node_1, 2);
    {
      var consequent = ($$anchor2) => {
        var div_1 = root9();
        var textarea = child(div_1);
        remove_textarea_child(textarea);
        reset(div_1);
        template_effect(() => set_value(textarea, get(editingState).text));
        delegated("input", textarea, (event2) => $$props.store.inlineEdit.updateNodeDraft({ text: event2.currentTarget.value }));
        event("blur", textarea, () => $$props.store.inlineEdit.commitNode($$props.node));
        delegated("keydown", textarea, (event2) => {
          if (event2.key === "Escape") $$props.store.inlineEdit.cancelAll();
        });
        append($$anchor2, div_1);
      };
      var alternate_1 = ($$anchor2) => {
        var div_2 = root_35();
        var node_3 = child(div_2);
        {
          var consequent_1 = ($$anchor3) => {
            var div_3 = root_17();
            var text2 = only_child(div_3, true);
            template_effect(() => set_text(text2, $$props.node.text));
            append($$anchor3, div_3);
          };
          var alternate = ($$anchor3) => {
            var div_4 = root_26();
            append($$anchor3, div_4);
          };
          if_block(node_3, ($$render) => {
            if ($$props.node.text) $$render(consequent_1);
            else $$render(alternate, -1);
          });
        }
        reset(div_2);
        append($$anchor2, div_2);
      };
      if_block(node_2, ($$render) => {
        if (get(editingState)) $$render(consequent);
        else $$render(alternate_1, -1);
      });
    }
    var node_4 = sibling(node_2, 2);
    {
      let $0 = user_derived(() => selected() && !get(readOnly));
      ResizeHandles(node_4, {
        get selected() {
          return selected();
        },
        get visible() {
          return get($0);
        },
        onresize: (event2, handle) => $$props.onresizestart?.(event2, $$props.node, handle)
      });
    }
    var node_5 = sibling(node_4, 2);
    {
      let $0 = user_derived(() => selected() && !get(readOnly) && !get(editingState));
      ConnectPorts(node_5, {
        get visible() {
          return get($0);
        },
        onconnect: (event2) => $$props.onconnectstart?.(event2, $$props.node)
      });
    }
    reset(div);
    template_effect(
      ($0) => {
        classes = set_class(div, 1, "vz-uml-node kind-note", null, classes, { selected: selected(), "inline-editing": $0 });
        set_attribute2(div, "data-node-id", $$props.node.id);
        set_style(div, `left: ${$$props.box.x ?? ""}px; top: ${$$props.box.y ?? ""}px; width: ${$$props.box.width ?? ""}px; height: ${$$props.box.height ?? ""}px;`);
        set_attribute2(div, "tabindex", get(readOnly) ? -1 : 0);
        set_attribute2(div, "aria-label", `Note: ${$$props.node.name ?? ""}`);
        set_attribute2(div, "aria-pressed", selected());
      },
      [() => Boolean(get(editingState))]
    );
    delegated("pointerdown", div, (event2) => $$props.onpointerdown?.(event2, $$props.node));
    delegated("contextmenu", div, (event2) => $$props.oncontextmenu?.(event2, $$props.node));
    delegated("dblclick", div, (event2) => $$props.ondblclick?.(event2, $$props.node));
    append($$anchor, div);
    pop();
  }
  delegate(["pointerdown", "contextmenu", "dblclick", "input", "keydown"]);

  // src/webview/canvas/nodes/ShapeNode.svelte
  var root10 = from_svg(`<rect class="vz-shape-selection-box" x="1" y="1" rx="4"></rect>`);
  var root_18 = from_html(`<div class="vz-shape-label editing"><input type="text" class="vz-shape-inline-input" aria-label="Shape label"/></div>`);
  var root_27 = from_html(`<div role="presentation"><!></div>`);
  var root_36 = from_html(`<div role="button"><svg class="vz-shape-svg" aria-hidden="true"><path class="vz-shape-outline"></path><!></svg> <!> <!> <!></div>`);
  function ShapeNode($$anchor, $$props) {
    push($$props, true);
    let selected = prop($$props, "selected", 3, false);
    const editingState = user_derived(() => $$props.store.inlineEdit.state.mode === "node" && $$props.store.inlineEdit.state.nodeId === $$props.node.id ? $$props.store.inlineEdit.state : null);
    const readOnly = user_derived(() => $$props.store.isReadOnly);
    const isEditing = user_derived(() => Boolean(get(editingState)));
    const shapePath = user_derived(() => buildShapeSvgPath($$props.node.shape, $$props.box.width, $$props.box.height));
    let inputEl = state(void 0);
    user_effect(() => {
      if (!get(isEditing)) return;
      const input = get(inputEl);
      if (!input) return;
      requestAnimationFrame(() => {
        if (!input.isConnected) return;
        input.focus();
        input.select();
      });
    });
    var div = root_36();
    let classes;
    var svg = child(div);
    var path = child(svg);
    var node_1 = sibling(path);
    {
      var consequent = ($$anchor2) => {
        var rect = root10();
        template_effect(
          ($0, $1) => {
            set_attribute2(rect, "width", $0);
            set_attribute2(rect, "height", $1);
          },
          [
            () => Math.max(0, $$props.box.width - 2),
            () => Math.max(0, $$props.box.height - 2)
          ]
        );
        append($$anchor2, rect);
      };
      if_block(node_1, ($$render) => {
        if (selected()) $$render(consequent);
      });
    }
    reset(svg);
    var node_2 = sibling(svg, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var div_1 = root_18();
        var input_1 = child(div_1);
        remove_input_defaults(input_1);
        bind_this(input_1, ($$value) => set(inputEl, $$value), () => get(inputEl));
        reset(div_1);
        template_effect(() => set_value(input_1, get(editingState).name));
        delegated("input", input_1, (event2) => $$props.store.inlineEdit.updateNodeDraft({ name: event2.currentTarget.value }));
        event("blur", input_1, () => $$props.store.inlineEdit.commitNode($$props.node));
        delegated("keydown", input_1, (event2) => {
          if (event2.key === "Enter") $$props.store.inlineEdit.commitNode($$props.node);
          else if (event2.key === "Escape") $$props.store.inlineEdit.cancelAll();
        });
        append($$anchor2, div_1);
      };
      var alternate = ($$anchor2) => {
        var div_2 = root_27();
        let classes_1;
        var node_3 = child(div_2);
        NodeHeader(node_3, {
          get node() {
            return $$props.node;
          }
        });
        reset(div_2);
        template_effect(() => classes_1 = set_class(div_2, 1, "vz-shape-label", null, classes_1, { selected: selected() }));
        delegated("click", div_2, (event2) => {
          if (!selected() || get(readOnly)) return;
          event2.stopPropagation();
          $$props.oneditlabel?.($$props.node);
        });
        append($$anchor2, div_2);
      };
      if_block(node_2, ($$render) => {
        if (get(editingState)) $$render(consequent_1);
        else $$render(alternate, -1);
      });
    }
    var node_4 = sibling(node_2, 2);
    {
      let $0 = user_derived(() => selected() && !get(readOnly));
      ResizeHandles(node_4, {
        get selected() {
          return selected();
        },
        get visible() {
          return get($0);
        },
        onresize: (event2, handle) => $$props.onresizestart?.(event2, $$props.node, handle)
      });
    }
    var node_5 = sibling(node_4, 2);
    {
      let $0 = user_derived(() => selected() && !get(readOnly) && !get(editingState));
      ConnectPorts(node_5, {
        get visible() {
          return get($0);
        },
        onconnect: (event2) => $$props.onconnectstart?.(event2, $$props.node)
      });
    }
    reset(div);
    template_effect(() => {
      classes = set_class(div, 1, "vz-uml-node kind-shape", null, classes, { selected: selected(), "inline-editing": get(isEditing) });
      set_attribute2(div, "data-node-id", $$props.node.id);
      set_style(div, `left: ${$$props.box.x ?? ""}px; top: ${$$props.box.y ?? ""}px; width: ${$$props.box.width ?? ""}px; height: ${$$props.box.height ?? ""}px;`);
      set_attribute2(div, "tabindex", get(readOnly) ? -1 : 0);
      set_attribute2(div, "aria-label", `Shape: ${$$props.node.name ?? ""}`);
      set_attribute2(div, "aria-pressed", selected());
      set_attribute2(svg, "width", $$props.box.width);
      set_attribute2(svg, "height", $$props.box.height);
      set_attribute2(path, "d", get(shapePath));
    });
    delegated("pointerdown", div, (event2) => $$props.onpointerdown?.(event2, $$props.node));
    delegated("contextmenu", div, (event2) => $$props.oncontextmenu?.(event2, $$props.node));
    delegated("dblclick", div, (event2) => $$props.ondblclick?.(event2, $$props.node));
    append($$anchor, div);
    pop();
  }
  delegate([
    "pointerdown",
    "contextmenu",
    "dblclick",
    "input",
    "keydown",
    "click"
  ]);

  // src/webview/canvas/edges/EdgeMarker.svelte
  var root11 = from_svg(`<g><g><path stroke-linejoin="round"></path></g></g>`);
  function EdgeMarker($$anchor, $$props) {
    push($$props, true);
    let selected = prop($$props, "selected", 3, false);
    const descriptor = user_derived(() => getEndpointShape($$props.decoration.shape));
    const pathD = user_derived(() => get(descriptor)?.buildLocalPath($$props.decoration.size ?? get(descriptor).defaultSize) ?? "");
    const stroke = user_derived(() => selected() ? "var(--vz-accent)" : "var(--vscode-editor-foreground)");
    const fill = user_derived(() => {
      if (!get(descriptor)?.supportsFill) return "none";
      if (($$props.decoration.fill ?? get(descriptor).defaultFill ?? "hollow") !== "filled") {
        return "var(--vscode-editor-background)";
      }
      return selected() ? "var(--vz-accent)" : "var(--vscode-editor-foreground)";
    });
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var g = root11();
        let classes;
        var g_1 = child(g);
        var path = only_child(g_1);
        reset(g);
        template_effect(() => {
          classes = set_class(g, 0, "vz-edge-marker", null, classes, { selected: selected() });
          set_attribute2(g_1, "transform", `translate(${$$props.tip.x ?? ""}, ${$$props.tip.y ?? ""}) rotate(${$$props.angleDeg ?? ""})`);
          set_attribute2(path, "d", get(pathD));
          set_attribute2(path, "fill", get(fill));
          set_attribute2(path, "stroke", get(stroke));
          set_attribute2(path, "stroke-width", selected() ? 2.2 : 1.6);
        });
        append($$anchor2, g);
      };
      if_block(node, ($$render) => {
        if (get(pathD)) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }

  // src/webview/canvas/edges/EdgePath.svelte
  var root12 = from_svg(`<path></path><path class="vz-edge-hit-path"></path>`, 1);
  var root_19 = from_svg(`<path></path>`);
  function EdgePath($$anchor, $$props) {
    push($$props, true);
    let isDashed = prop($$props, "isDashed", 3, false), selected = prop($$props, "selected", 3, false), interactive = prop($$props, "interactive", 3, true);
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var fragment_1 = root12();
        var path = first_child(fragment_1);
        let classes;
        var path_1 = sibling(path);
        template_effect(() => {
          classes = set_class(path, 0, "vz-edge-line", null, classes, { dashed: isDashed(), selected: selected() });
          set_attribute2(path, "d", $$props.pathD);
          set_attribute2(path_1, "d", $$props.pathD);
        });
        delegated("pointerdown", path, (event2) => $$props.onselect?.(event2));
        delegated("dblclick", path, (event2) => $$props.ondblclick?.(event2));
        delegated("contextmenu", path, (event2) => $$props.oncontextmenu?.(event2));
        delegated("pointerdown", path_1, (event2) => $$props.onselect?.(event2));
        delegated("dblclick", path_1, (event2) => $$props.ondblclick?.(event2));
        delegated("contextmenu", path_1, (event2) => $$props.oncontextmenu?.(event2));
        append($$anchor2, fragment_1);
      };
      var alternate = ($$anchor2) => {
        var path_2 = root_19();
        let classes_1;
        template_effect(() => {
          classes_1 = set_class(path_2, 0, "vz-edge-line", null, classes_1, { dashed: isDashed() });
          set_attribute2(path_2, "d", $$props.pathD);
        });
        append($$anchor2, path_2);
      };
      if_block(node, ($$render) => {
        if (interactive()) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["pointerdown", "dblclick", "contextmenu"]);

  // src/webview/canvas/edges/UmlEdgeRenderer.svelte
  var root13 = from_svg(`<g><!><!><!></g>`);
  function UmlEdgeRenderer($$anchor, $$props) {
    push($$props, true);
    let selected = prop($$props, "selected", 3, false);
    var g = root13();
    let classes;
    var node = child(g);
    EdgePath(node, {
      get pathD() {
        return $$props.data.geometry.pathD;
      },
      get isDashed() {
        return $$props.data.isDashed;
      },
      get selected() {
        return selected();
      },
      onselect: (event2) => $$props.onselect?.(event2, $$props.data.edge),
      ondblclick: (event2) => $$props.ondblclick?.(event2, $$props.data.edge),
      oncontextmenu: (event2) => $$props.oncontextmenu?.(event2, $$props.data.edge)
    });
    var node_1 = sibling(node);
    EdgeMarker(node_1, {
      get decoration() {
        return $$props.data.startDecoration;
      },
      get tip() {
        return $$props.data.geometry.startTip;
      },
      get angleDeg() {
        return $$props.data.geometry.startAngleDeg;
      },
      get selected() {
        return selected();
      }
    });
    var node_2 = sibling(node_1);
    EdgeMarker(node_2, {
      get decoration() {
        return $$props.data.endDecoration;
      },
      get tip() {
        return $$props.data.geometry.endTip;
      },
      get angleDeg() {
        return $$props.data.geometry.endAngleDeg;
      },
      get selected() {
        return selected();
      }
    });
    reset(g);
    template_effect(() => {
      classes = set_class(g, 0, "vz-edge-renderer", null, classes, { selected: selected() });
      set_attribute2(g, "data-edge-id", $$props.data.edge.id);
    });
    append($$anchor, g);
    pop();
  }

  // src/webview/canvas/edges/EdgeLabel.svelte
  var root14 = from_html(`<div class="vz-edge-inline-editor"><input type="text" class="vz-edge-label-input" aria-label="Relation label"/></div>`);
  var root_110 = from_html(`<div role="button" tabindex="-1"><span> </span></div>`);
  function EdgeLabel($$anchor, $$props) {
    push($$props, true);
    let selected = prop($$props, "selected", 3, false), editing = prop($$props, "editing", 3, false), draft = prop($$props, "draft", 3, ""), maxWidth = prop($$props, "maxWidth", 3, 220), align = prop($$props, "align", 3, "center"), frameLabel = prop($$props, "frameLabel", 3, false);
    const width = user_derived(() => editing() ? Math.min(maxWidth(), Math.max(70, draft().length * 7.6 + 24)) : Math.min(maxWidth(), Math.max(28, ($$props.label?.length ?? 0) * 7.6 + 20)));
    const transform = user_derived(() => align() === "above-left" ? "translateY(-50%)" : "translate(-50%, -50%)");
    let inputEl = state(void 0);
    user_effect(() => {
      if (!editing()) return;
      const input = get(inputEl);
      if (!input) return;
      requestAnimationFrame(() => {
        if (!input.isConnected) return;
        input.focus();
        input.select();
      });
    });
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root14();
        var input_1 = child(div);
        remove_input_defaults(input_1);
        bind_this(input_1, ($$value) => set(inputEl, $$value), () => get(inputEl));
        reset(div);
        template_effect(() => {
          set_style(div, `left: ${$$props.point.x ?? ""}px; top: ${$$props.point.y ?? ""}px; width: ${get(width) ?? ""}px; transform: ${get(transform) ?? ""};`);
          set_value(input_1, draft());
        });
        delegated("pointerdown", div, (event2) => event2.stopPropagation());
        delegated("input", input_1, (event2) => $$props.onDraftChange?.(event2.currentTarget.value));
        event("blur", input_1, () => $$props.onCommit?.());
        delegated("keydown", input_1, (event2) => {
          if (event2.key === "Enter") $$props.onCommit?.();
          else if (event2.key === "Escape") $$props.onCancel?.();
        });
        append($$anchor2, div);
      };
      var consequent_1 = ($$anchor2) => {
        var div_1 = root_110();
        let classes;
        var span = child(div_1);
        var text2 = only_child(span, true);
        reset(div_1);
        template_effect(() => {
          classes = set_class(div_1, 1, "vz-edge-label-group", null, classes, { selected: selected(), frame: frameLabel() });
          set_style(div_1, `left: ${$$props.point.x ?? ""}px; top: ${$$props.point.y ?? ""}px; width: ${get(width) ?? ""}px; transform: ${get(transform) ?? ""};`);
          set_text(text2, $$props.label);
        });
        delegated("click", div_1, (event2) => $$props.onselect?.(event2));
        delegated("dblclick", div_1, (event2) => $$props.ondblclick?.(event2));
        append($$anchor2, div_1);
      };
      if_block(node, ($$render) => {
        if (editing()) $$render(consequent);
        else if ($$props.label) $$render(consequent_1, 1);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["pointerdown", "input", "keydown", "click", "dblclick"]);

  // src/webview/canvas/edges/MultiplicityTag.svelte
  var root15 = from_html(`<div class="vz-edge-inline-editor vz-mult-inline-editor"><input type="text" class="vz-edge-label-input" aria-label="Multiplicity" placeholder="1, *, 0..1"/></div>`);
  var root_111 = from_html(`<div role="button" tabindex="-1"> </div>`);
  function MultiplicityTag($$anchor, $$props) {
    push($$props, true);
    let selected = prop($$props, "selected", 3, false), editing = prop($$props, "editing", 3, false), draft = prop($$props, "draft", 3, "");
    const width = user_derived(() => Math.max(38, (draft().length || $$props.text?.length || 0) * 8 + 14));
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root15();
        var input = child(div);
        remove_input_defaults(input);
        reset(div);
        template_effect(() => {
          set_style(div, `left: ${$$props.point.x ?? ""}px; top: ${$$props.point.y ?? ""}px; width: ${get(width) ?? ""}px; transform: translate(-50%, -50%);`);
          set_value(input, draft());
        });
        delegated("pointerdown", div, (event2) => event2.stopPropagation());
        delegated("input", input, (event2) => $$props.onDraftChange?.(event2.currentTarget.value));
        event("blur", input, () => $$props.onCommit?.());
        delegated("keydown", input, (event2) => {
          if (event2.key === "Enter") $$props.onCommit?.();
          else if (event2.key === "Escape") $$props.onCancel?.();
        });
        append($$anchor2, div);
      };
      var consequent_1 = ($$anchor2) => {
        var div_1 = root_111();
        let classes;
        var text_1 = only_child(div_1, true);
        template_effect(() => {
          classes = set_class(div_1, 1, "vz-mult-badge", null, classes, { selected: selected() });
          set_style(div_1, `left: ${$$props.point.x ?? ""}px; top: ${$$props.point.y ?? ""}px; transform: translate(-50%, -50%);`);
          set_text(text_1, $$props.text);
        });
        delegated("click", div_1, (event2) => $$props.onclick?.(event2));
        delegated("keydown", div_1, (event2) => {
          if (event2.key === "Enter" || event2.key === " ") {
            event2.preventDefault();
            $$props.onclick?.(event2);
          }
        });
        delegated("dblclick", div_1, (event2) => $$props.ondblclick?.(event2));
        append($$anchor2, div_1);
      };
      if_block(node, ($$render) => {
        if (editing()) $$render(consequent);
        else if ($$props.text) $$render(consequent_1, 1);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["pointerdown", "input", "keydown", "click", "dblclick"]);

  // src/webview/canvas/edges/edge-geometry.ts
  function endpointMarkerPath(decoration) {
    const descriptor = getEndpointShape(decoration?.shape ?? "none");
    if (!descriptor || descriptor.kind === "none") return { d: "", fill: "none" };
    const d = descriptor.buildLocalPath(decoration?.size ?? descriptor.defaultSize);
    if (!descriptor.supportsFill) return { d, fill: "none" };
    return { d, fill: decoration?.fill ?? descriptor.defaultFill ?? "hollow" };
  }
  function endpointVisualCenter(tip, angleDeg, decoration) {
    const descriptor = getEndpointShape(decoration?.shape ?? "none");
    if (!descriptor || descriptor.kind === "none") return tip;
    const size = decoration?.size ?? descriptor.defaultSize;
    const radians = angleDeg * Math.PI / 180;
    return {
      x: tip.x - Math.cos(radians) * (size / 2),
      y: tip.y - Math.sin(radians) * (size / 2)
    };
  }
  function resolveEdgeRouting(edge, defaultRouting) {
    const routing = edge.visual?.routing;
    if (!routing || routing === "default") return defaultRouting ?? "orthogonal";
    return routing;
  }
  function computeEdgeRenderData(edge, sourceBox, targetBox, sourceNode, targetNode, defaultRouting, parallelOffset = 0) {
    const touchesNote = sourceNode?.kind === "note" || targetNode?.kind === "note";
    const isDashed = (edge.visual?.line ?? (touchesNote ? "dashed" : "solid")) === "dashed";
    const startDecoration = edge.visual?.start ?? { shape: "none", size: 10 };
    const endDecoration = edge.visual?.end ?? { shape: "none", size: 10 };
    const geometry = computeUmlEdgeGeometry(
      sourceBox,
      targetBox,
      resolveEdgeRouting(edge, defaultRouting),
      startDecoration,
      endDecoration,
      parallelOffset,
      void 0,
      void 0,
      sourceNode?.kind === "shape" ? sourceNode.shape : void 0,
      targetNode?.kind === "shape" ? targetNode.shape : void 0,
      edge.label
    );
    const startMarker = endpointMarkerPath(startDecoration);
    const endMarker = endpointMarkerPath(endDecoration);
    return {
      edge,
      geometry,
      startDecoration,
      endDecoration,
      isDashed,
      startMarkerPath: startMarker.d,
      endMarkerPath: endMarker.d,
      startMarkerFill: startMarker.fill,
      endMarkerFill: endMarker.fill,
      startCenter: endpointVisualCenter(geometry.startTip, geometry.startAngleDeg, startDecoration),
      endCenter: endpointVisualCenter(geometry.endTip, geometry.endAngleDeg, endDecoration),
      startMultiplicityPoint: getMultiplicityLabelPoint(
        geometry.startTip,
        geometry.startAngleDeg,
        edge.source.multiplicity
      ),
      endMultiplicityPoint: getMultiplicityLabelPoint(
        geometry.endTip,
        geometry.endAngleDeg,
        edge.target.multiplicity
      )
    };
  }

  // src/webview/canvas/CanvasViewport.svelte
  var root16 = from_svg(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`);
  var root_112 = from_svg(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`);
  var root_28 = from_svg(`<line class="vz-gesture-line"></line>`);
  var root_37 = from_svg(`<circle class="vz-endpoint-handle" r="9" role="presentation"></circle><circle class="vz-endpoint-handle" r="9" role="presentation"></circle>`, 1);
  var root_46 = from_html(`<!> <!> <!>`, 1);
  var root_54 = from_svg(`<rect class="vz-marquee-box"></rect>`);
  var root_63 = from_svg(`<path stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>`);
  var root_73 = from_html(`<button type="button"><svg width="34" height="18" viewBox="-24 -9 26 18" class="vz-endpoint-preview-svg" aria-hidden="true"><line x1="-22" y1="0" y2="0" stroke="currentColor" stroke-width="1.8"></line><!></svg> <span> </span></button>`);
  var root_8 = from_html(`<div class="vz-endpoint-popup"><div class="vz-endpoint-mult-row"><span class="vz-field-label">Multiplicity</span> <input type="text" class="vz-input-mini" placeholder="e.g. 1, *, 1..5, 2..*"/></div> <div class="vz-endpoint-icon-grid"></div></div>`);
  var root_9 = from_html(`<div class="vz-html-frames"></div> <svg class="vz-svg-layer vz-svg-relations vz-svg-overlay" aria-label="UML Relationships"><g></g></svg> <div class="vz-html-world"></div> <svg class="vz-svg-layer vz-svg-foreground" aria-label="UML Canvas Interactions"><g><!><!></g></svg> <div class="vz-html-frames vz-html-edge-labels"><!> <!></div> <svg class="vz-svg-layer vz-svg-marquee" aria-label="Marquee Selection"><g><!></g></svg> <!>`, 1);
  var root_10 = from_html(`<div tabindex="0" role="application" aria-label="Vizion UML Canvas"><div class="vz-floating-zoom"><button type="button" class="vz-zoom-pill-btn" title="Zoom Out">\uFF0D</button> <button type="button" class="vz-zoom-pill-label" title="Scroll wheel here to adjust by \xB11%, or click to Fit Content"> </button> <button type="button" class="vz-zoom-pill-btn" title="Zoom In">\uFF0B</button></div> <!></div>`);
  function CanvasViewport($$anchor, $$props) {
    push($$props, true);
    let store = prop($$props, "store", 7);
    let viewportEl = state(void 0);
    let gesture = state(proxy({ mode: "idle" }));
    let spacePressed = state(false);
    let inlineEditingNodeId = state(null);
    let inlineEditingEdgeId = state(null);
    let inlineEdgeLabelDraft = state("");
    let lastPointerWorldPos = state(null);
    user_effect(() => {
      if (get(inlineEditingNodeId) && get(doc) && !get(doc).nodes.some((node) => node.id === get(inlineEditingNodeId))) {
        store().inlineEdit.cancelAll();
        set(inlineEditingNodeId, null);
      }
    });
    function focusInput(el) {
      requestAnimationFrame(() => {
        el.focus();
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          el.select();
        }
      });
    }
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
    const nodeElements = /* @__PURE__ */ new Map();
    function registerNodeElement(el, id) {
      nodeElements.set(id, el);
      return {
        update(newId) {
          if (newId !== id) {
            nodeElements.delete(id);
            id = newId;
            nodeElements.set(id, el);
          }
        },
        destroy() {
          nodeElements.delete(id);
        }
      };
    }
    const FRAME_PAD_LEFT2 = 20;
    const FRAME_PAD_RIGHT2 = 20;
    const FRAME_PAD_TOP2 = 28;
    const FRAME_PAD_BOTTOM2 = 20;
    function getNodeMinContentSize(nodeId) {
      const node = get(doc)?.nodes.find((candidate) => candidate.id === nodeId);
      if (!node) return { minWidth: 100, minHeight: 60 };
      const box = get(effectiveNodeLayouts)[nodeId];
      return computeNodeMinSize(node, get(inlineEditingNodeId) === nodeId, box?.width, get(inlineDraft));
    }
    const inlineDraft = user_derived(() => {
      const state2 = store().inlineEdit.state;
      if (state2.mode !== "node") return void 0;
      return {
        name: state2.name,
        text: state2.text,
        attributes: state2.attributes,
        operations: state2.operations
      };
    });
    const effectiveNodeLayouts = user_derived(() => {
      if (!get(doc)) return {};
      const current = get(gesture);
      let adapted;
      if (current.mode === "moving") {
        adapted = {
          mode: "moving_nodes",
          startWorld: current.startWorld,
          currentWorld: current.currentWorld,
          initialLayouts: current.initialLayouts,
          clickedNodeId: current.clickedNodeId,
          isShift: Boolean(current.isShift)
        };
      } else if (current.mode === "resizing") {
        adapted = {
          mode: "resizing_node",
          nodeId: current.nodeId,
          handle: current.handleDirection ?? "se",
          startWorld: current.startWorld,
          currentWorld: current.currentWorld,
          initialBox: current.initialBox,
          minWidth: current.minWidth ?? 120,
          minHeight: current.minHeight ?? 60,
          childBounds: current.childBounds
        };
      } else if (current.mode === "marquee") {
        adapted = current;
      } else {
        adapted = { mode: "idle" };
      }
      return computeEffectiveLayouts(get(doc), store().optimisticUmlLayouts, adapted, get(inlineEditingNodeId), get(inlineDraft));
    });
    const edgeParallelOffsets = user_derived(() => {
      if (!get(doc)) return {};
      return computeParallelEdgeOffsets(get(doc).edges);
    });
    const marqueeRect = user_derived(() => get(gesture).mode === "marquee" ? normalizeDragRect(get(gesture).startWorld, get(gesture).currentWorld) : null);
    const resizeCursor = user_derived(() => {
      if (get(gesture).mode !== "resizing") return null;
      switch (get(gesture).handleDirection ?? "se") {
        case "n":
        case "s":
          return "ns-resize";
        case "e":
        case "w":
          return "ew-resize";
        case "nw":
        case "se":
          return "nwse-resize";
        default:
          return "nesw-resize";
      }
    });
    user_effect(() => {
      store().registerCanvasCallbacks({
        onFitContent: fitContent,
        onResetZoom: () => store().setViewport({ panX: 40, panY: 40, zoom: 1 }),
        onRestoreFocus: () => get(viewportEl)?.focus()
      });
    });
    user_effect(() => {
      if (get(inlineEditingNodeId) && !store().selectedIds.includes(get(inlineEditingNodeId))) {
        commitInlineNodeEdit();
      }
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
      const bounds = computeContentBounds(get(effectiveNodeLayouts));
      if (!bounds) {
        store().setViewport({ panX: 40, panY: 40, zoom: 1 });
        return;
      }
      store().viewportController.fitContent(bounds, get(viewportEl).clientWidth, get(viewportEl).clientHeight);
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
      closeEndpointPickerPopup();
      get(viewportEl)?.focus();
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
        try {
          get(viewportEl)?.setPointerCapture(e.pointerId);
        } catch {
        }
        return;
      }
      if (e.target !== get(viewportEl) && !e.target?.classList.contains("vz-canvas-bg")) {
        return;
      }
      if (e.button === 0) {
        const additive = e.shiftKey;
        if (!additive) {
          store().clearSelection();
        }
        const pt = getRelativeWorldPoint(e);
        set(gesture, { mode: "marquee", startWorld: pt, currentWorld: pt, additive }, true);
        try {
          get(viewportEl)?.setPointerCapture(e.pointerId);
        } catch {
        }
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
      closeEndpointPickerPopup();
      e.stopPropagation();
      get(viewportEl)?.focus();
      const additive = e.metaKey || e.ctrlKey;
      if (!store().selectedIds.includes(node.id)) {
        store().selectSingle(node.id, additive || e.shiftKey);
      } else if (additive) {
        store().selectSingle(node.id, true);
        return;
      }
      if (store().isReadOnly) return;
      const pt = getRelativeWorldPoint(e);
      const initialLayouts = {};
      const nodesToMove = new Set(store().selectedIds);
      for (const id of store().selectedIds) {
        const n = get(doc)?.nodes.find((item) => item.id === id);
        if (n?.kind === "frame") {
          for (const cid of n.children ?? []) {
            nodesToMove.add(cid);
          }
        }
      }
      for (const id of nodesToMove) {
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
          clickedNodeId: node.id,
          isShift: e.shiftKey
        },
        true
      );
    }
    function handleResizeHandlePointerDown(e, node, dir = "se") {
      if (e.button === 2) return;
      e.stopPropagation();
      if (store().isReadOnly) return;
      if (!store().selectedIds.includes(node.id)) {
        store().selectSingle(node.id, e.shiftKey || e.metaKey || e.ctrlKey);
      }
      const pt = getRelativeWorldPoint(e);
      const box = get(effectiveNodeLayouts)[node.id];
      if (!box) return;
      const minSize = getNodeMinContentSize(node.id);
      let minW = minSize.minWidth;
      let minH = minSize.minHeight;
      let childBounds;
      if (node.kind === "frame" && node.children && node.children.length > 0) {
        const childBoxes = node.children.map((cid) => get(effectiveNodeLayouts)[cid]).filter((b) => Boolean(b));
        if (childBoxes.length > 0) {
          childBounds = {
            minX: Math.min(...childBoxes.map((b) => b.x)),
            minY: Math.min(...childBoxes.map((b) => b.y)),
            maxX: Math.max(...childBoxes.map((b) => b.x + b.width)),
            maxY: Math.max(...childBoxes.map((b) => b.y + b.height))
          };
          minW = Math.max(160, snapToGrid(childBounds.maxX + FRAME_PAD_RIGHT2 - box.x, GRID_SIZE));
          minH = Math.max(120, snapToGrid(childBounds.maxY + FRAME_PAD_BOTTOM2 - box.y, GRID_SIZE));
        }
      }
      const localX = pt.x - box.x;
      const localY = pt.y - box.y;
      const offset = dir === "n" || dir === "s" ? localX : localY;
      set(
        gesture,
        {
          mode: "resizing",
          nodeId: node.id,
          handleDirection: dir,
          handleOffset: offset,
          startWorld: pt,
          currentWorld: pt,
          initialBox: {
            ...box,
            width: Math.max(minW, snapToGrid(box.width, GRID_SIZE)),
            height: Math.max(minH, snapToGrid(box.height, GRID_SIZE))
          },
          minWidth: minW,
          minHeight: minH,
          childBounds
        },
        true
      );
      try {
        get(viewportEl)?.setPointerCapture(e.pointerId);
      } catch {
      }
    }
    function handleConnectPortPointerDown(e, node) {
      if (e.button === 2) return;
      e.stopPropagation();
      if (store().isReadOnly) return;
      const pt = getRelativeWorldPoint(e);
      const box = get(effectiveNodeLayouts)[node.id];
      let startPoint = {
        x: (box?.x ?? pt.x) + (box?.width ?? 0),
        y: (box?.y ?? pt.y) + (box?.height ?? 0) / 2
      };
      if (box && node.kind === "shape" && node.shape) {
        const hit = computeShapeBoundaryIntersection(box, { x: box.x + box.width + 1e3, y: box.y + box.height / 2 }, node.shape);
        startPoint = hit.point;
      }
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
      set(lastPointerWorldPos, getRelativeWorldPoint(e), true);
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
        set(
          gesture,
          {
            ...get(gesture),
            currentWorld: pt,
            ...get(gesture).mode === "moving" ? { isShift: Boolean(e.shiftKey) } : {}
          },
          true
        );
      }
    }
    function findHoveredTargetAt(worldPt) {
      if (!get(doc)) return void 0;
      for (let i = get(doc).nodes.length - 1; i >= 0; i--) {
        const n = get(doc).nodes[i];
        if (n.kind === "frame") continue;
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
            if (nBox && rectContainsRect(box, nBox)) {
              hitIds.push(n.id);
            }
          }
          if (!current.additive) {
            store().setSelectedIds(hitIds);
          } else if (hitIds.length > 0) {
            store().setSelectedIds(Array.from(/* @__PURE__ */ new Set([...store().selectedIds, ...hitIds])));
          }
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
        const isShift = Boolean(current.isShift || e.shiftKey);
        const dropPt = getRelativeWorldPoint(e);
        const { layoutUpdates, childrenUpdates } = getFrameDragDropUpdates(current.clickedNodeId, updates, current.initialLayouts, dropPt, isShift);
        const allUpdates = { ...updates, ...layoutUpdates };
        store().optimisticUmlLayouts = { ...store().optimisticUmlLayouts, ...allUpdates };
        set(gesture, { mode: "idle" }, true);
        store().dispatchOperation({
          type: "uml.moveResizeNodes",
          updates: allUpdates,
          frameChildrenUpdates: Object.keys(childrenUpdates).length > 0 ? childrenUpdates : void 0
        });
        return;
      }
      if (current.mode === "resizing") {
        const rawDx = current.currentWorld.x - current.startWorld.x;
        const rawDy = current.currentWorld.y - current.startWorld.y;
        const minW = current.minWidth ?? 120;
        const minH = current.minHeight ?? 60;
        const init2 = current.initialBox;
        const dir = current.handleDirection ?? "se";
        const cb = current.childBounds;
        let newX = init2.x;
        let newY = init2.y;
        let newW = init2.width;
        let newH = init2.height;
        if (dir === "e" || dir === "ne" || dir === "se") {
          const minRight = cb ? snapToGrid(cb.maxX + FRAME_PAD_RIGHT2, GRID_SIZE) : init2.x + minW;
          const targetW = init2.width + rawDx;
          newW = Math.max(minW, minRight - init2.x, snapToGrid(targetW, GRID_SIZE));
        } else if (dir === "w" || dir === "nw" || dir === "sw") {
          const rightEdge = init2.x + init2.width;
          const maxLeft = cb ? snapToGrid(cb.minX - FRAME_PAD_LEFT2, GRID_SIZE) : rightEdge - minW;
          const targetX = init2.x + rawDx;
          newX = Math.min(rightEdge - minW, maxLeft, snapToGrid(targetX, GRID_SIZE));
          newW = rightEdge - newX;
        }
        if (dir === "s" || dir === "sw" || dir === "se") {
          const minBottom = cb ? snapToGrid(cb.maxY + FRAME_PAD_BOTTOM2, GRID_SIZE) : init2.y + minH;
          const targetH = init2.height + rawDy;
          newH = Math.max(minH, minBottom - init2.y, snapToGrid(targetH, GRID_SIZE));
        } else if (dir === "n" || dir === "nw" || dir === "ne") {
          const bottomEdge = init2.y + init2.height;
          const maxTop = cb ? snapToGrid(cb.minY - FRAME_PAD_TOP2, GRID_SIZE) : bottomEdge - minH;
          const targetY = init2.y + rawDy;
          newY = Math.min(bottomEdge - minH, maxTop, snapToGrid(targetY, GRID_SIZE));
          newH = bottomEdge - newY;
        }
        if (newX === init2.x && newY === init2.y && newW === init2.width && newH === init2.height) {
          set(gesture, { mode: "idle" }, true);
          return;
        }
        const nextBox = { x: newX, y: newY, width: newW, height: newH };
        const initialUpdates = { [current.nodeId]: nextBox };
        store().optimisticUmlLayouts = { ...store().optimisticUmlLayouts, ...initialUpdates };
        set(gesture, { mode: "idle" }, true);
        store().dispatchOperation({ type: "uml.moveResizeNodes", updates: initialUpdates });
        return;
      }
      if (current.mode === "connecting") {
        set(gesture, { mode: "idle" }, true);
        const pt = getRelativeWorldPoint(e);
        const targetNode = findHoveredTargetAt(pt);
        if (targetNode && targetNode.id !== current.sourceNodeId) {
          const sourceNode = get(doc)?.nodes.find((n) => n.id === current.sourceNodeId);
          const touchesNote = sourceNode?.kind === "note" || targetNode.kind === "note";
          const defaultKind = touchesNote ? "other" : "association";
          const edgeId = `edge-${current.sourceNodeId}-${targetNode.id}-${Date.now().toString(36).slice(-4)}`;
          store().dispatchOperation({
            type: "uml.addEdge",
            id: edgeId,
            kind: defaultKind,
            sourceNodeId: current.sourceNodeId,
            targetNodeId: targetNode.id
          });
        }
        return;
      }
      set(gesture, { mode: "idle" }, true);
    }
    function getFrameDragDropUpdates(clickedNodeId, updates, initialLayouts, dropPt, isShift) {
      return computeFrameDragDropUpdates(get(doc), get(effectiveNodeLayouts), clickedNodeId, updates, initialLayouts, dropPt, isShift);
    }
    function deleteSelected() {
      if (store().isReadOnly || !get(doc) || store().selectedIds.length === 0) return;
      if (get(inlineEditingNodeId) && store().selectedIds.includes(get(inlineEditingNodeId))) {
        set(inlineEditingNodeId, null);
      }
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
      const isMod = e.ctrlKey || e.metaKey;
      const keyLower = e.key.toLowerCase();
      const activeTag = document.activeElement?.tagName;
      const isEditingText = activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT" || get(inlineEditingNodeId) !== null || get(inlineEditingEdgeId) !== null || get(inlineEditingMultiplicity) !== null;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") {
        if (e.key === "Escape") {
          document.activeElement.blur();
          return;
        }
        if (isMod && (keyLower === "z" || keyLower === "y")) {
          e.stopPropagation();
          return;
        }
        return;
      }
      if (isEditingText && isMod && (keyLower === "z" || keyLower === "y")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === "Shift" && get(gesture).mode === "moving") {
        set(gesture, { ...get(gesture), isShift: true }, true);
      }
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
        const spawnX = get(lastPointerWorldPos) ? snapToGrid(get(lastPointerWorldPos).x, GRID_SIZE) : void 0;
        const spawnY = get(lastPointerWorldPos) ? snapToGrid(get(lastPointerWorldPos).y, GRID_SIZE) : void 0;
        if (keyLower === "c") {
          e.preventDefault();
          store().createQuickUmlNode("class", spawnX, spawnY);
          return;
        }
        if (keyLower === "n") {
          e.preventDefault();
          store().createQuickUmlNode("note", spawnX, spawnY);
          return;
        }
        if (keyLower === "s") {
          e.preventDefault();
          store().createQuickUmlNode("shape", spawnX, spawnY, "rectangle");
          return;
        }
        if (keyLower === "f") {
          e.preventDefault();
          store().createQuickUmlNode("frame", spawnX, spawnY);
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
      if (e.key === "Shift" && get(gesture).mode === "moving") {
        set(gesture, { ...get(gesture), isShift: false }, true);
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
                label: "Frame",
                shortcut: "Alt+F",
                action: () => store().createQuickUmlNode("frame", worldPt.x, worldPt.y)
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
          },
          {
            label: "Export",
            dividerBefore: true,
            submenu: [
              { label: "to Clipboard", action: () => exportToClipboard() },
              { label: "as PNG", action: () => exportAsPng() }
            ]
          }
        ],
        "Canvas"
      );
    }
    function addNodeAttributeInline(node) {
      const existing = node.attributes ?? [];
      const newAttr = {
        id: `${node.id}-attr-${Date.now().toString(36).slice(-4)}`,
        visibility: "+",
        name: `field${existing.length + 1}`,
        type: "string"
      };
      store().dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        showAttributes: true,
        attributes: [...existing, newAttr]
      });
      if (get(inlineEditingNodeId) === node.id) {
        store().inlineEdit.updateNodeDraft({ attributes: formatAttributesToText([...existing, newAttr]) });
      }
    }
    function addNodeOperationInline(node) {
      const existing = node.operations ?? [];
      const newOp = {
        id: `${node.id}-op-${Date.now().toString(36).slice(-4)}`,
        visibility: "+",
        name: `method${existing.length + 1}`,
        signature: "()",
        returnType: "void",
        parameters: []
      };
      store().dispatchOperation({
        type: "uml.updateNode",
        nodeId: node.id,
        showOperations: true,
        operations: [...existing, newOp]
      });
      if (get(inlineEditingNodeId) === node.id) {
        store().inlineEdit.updateNodeDraft({ operations: formatOperationsToText([...existing, newOp]) });
      }
    }
    function handleNodeContextMenu(e, node) {
      const target2 = e.target;
      if (target2?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (!store().selectedIds.includes(node.id)) {
        store().selectSingle(node.id, false);
      }
      const kindDesc = getUmlNodeKind(node.kind);
      const editMenuLabel = node.kind === "frame" || node.kind === "shape" ? "Edit Label" : "Edit";
      const items = [
        {
          label: editMenuLabel,
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
      if (get(inlineEditingEdgeId)) commitInlineEdgeLabel();
      if (get(inlineEditingMultiplicity)) commitInlineMultiplicity();
      if (!store().selectedIds.includes(node.id)) {
        store().selectSingle(node.id, false);
      }
      store().inlineEdit.beginNode(node);
      set(inlineEditingNodeId, node.id, true);
    }
    function commitInlineNodeEdit(node) {
      if (store().inlineEdit.state.mode === "node") {
        store().inlineEdit.commitNode(node);
      }
      set(inlineEditingNodeId, null);
    }
    user_effect(() => {
      if (get(inlineEditingNodeId) && store().inlineEdit.state.mode !== "node") {
        set(inlineEditingNodeId, null);
      }
    });
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
    function commitEndpointMultiplicity() {
      if (!get(endpointPickerPopup)) return;
      const { edgeId, end, multiplicityDraft } = get(endpointPickerPopup);
      const targetEdge = get(doc)?.edges.find((e) => e.id === edgeId);
      if (targetEdge) {
        const cleaned = (multiplicityDraft ?? "").trim();
        const prev = end === "start" ? targetEdge.source.multiplicity ?? "" : targetEdge.target.multiplicity ?? "";
        if (cleaned !== prev) {
          store().dispatchOperation({
            type: "uml.updateEdge",
            edgeId: targetEdge.id,
            ...end === "start" ? { sourceMultiplicity: cleaned } : { targetMultiplicity: cleaned }
          });
        }
      }
    }
    function closeEndpointPickerPopup() {
      if (!get(endpointPickerPopup)) return;
      commitEndpointMultiplicity();
      set(endpointPickerPopup, null);
    }
    function openEndpointPickerPopup(clientX, clientY, edge, end, current) {
      store().closeContextMenu();
      if (get(endpointPickerPopup)) closeEndpointPickerPopup();
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
            label: "Edit Label",
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
            label: "Routing",
            dividerBefore: true,
            submenu: [
              {
                label: `${(edge.visual?.routing ?? "default") === "default" ? "\u2713 " : ""}Default`,
                action: () => store().dispatchOperation({ type: "uml.updateEdge", edgeId: edge.id, routing: "default" })
              },
              {
                label: `${edge.visual?.routing === "orthogonal" ? "\u2713 " : ""}Orthogonal`,
                action: () => store().dispatchOperation({
                  type: "uml.updateEdge",
                  edgeId: edge.id,
                  routing: "orthogonal"
                })
              },
              {
                label: `${edge.visual?.routing === "straight" ? "\u2713 " : ""}Straight`,
                action: () => store().dispatchOperation({ type: "uml.updateEdge", edgeId: edge.id, routing: "straight" })
              },
              {
                label: `${edge.visual?.routing === "bezier" ? "\u2713 " : ""}Smooth`,
                action: () => store().dispatchOperation({ type: "uml.updateEdge", edgeId: edge.id, routing: "bezier" })
              }
            ]
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
    function getEdgeRouting(edge) {
      const r = edge.visual?.routing;
      if (!r || r === "default") {
        return get(doc)?.defaultRouting ?? "orthogonal";
      }
      return r;
    }
    function renderEndpointPath2(dec) {
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
    function isSameEndpointChoice(a, b) {
      if (a.shape !== b.shape) return false;
      const desc = getEndpointShape(a.shape);
      if (!desc?.supportsFill) return true;
      return (a.fill ?? desc.defaultFill ?? "hollow") === (b.fill ?? desc.defaultFill ?? "hollow");
    }
    function renderCurrentDiagram() {
      if (!get(doc)) return null;
      return renderDiagramToCanvas({
        doc: get(doc),
        layouts: get(effectiveNodeLayouts),
        parallelOffsets: get(edgeParallelOffsets),
        defaultRouting: get(doc).defaultRouting,
        viewportElement: get(viewportEl)
      });
    }
    async function exportToClipboard() {
      try {
        const render = renderCurrentDiagram();
        if (!render) {
          store().setStatusMessage("No diagram content to export.");
          return;
        }
        const { canvas } = render;
        const blob = await canvasToPngBlob(canvas);
        if (!blob) throw new Error("Canvas snapshot generation failed");
        const base64 = canvasToPngBase64(canvas);
        let copied = false;
        if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            copied = true;
            store().setStatusMessage("Diagram image snapshot copied to clipboard.");
          } catch (clipErr) {
            console.warn("Direct webview clipboard.write failed, falling back to host clipboard:", clipErr);
          }
        }
        if (!copied) {
          postToHost({ type: "webview.copyImageToClipboard", base64Data: base64 });
          store().setStatusMessage("Diagram image snapshot copied to clipboard.");
        }
      } catch (err) {
        console.error("Failed to copy diagram image to clipboard", err);
        store().setStatusMessage("Failed to copy diagram snapshot to clipboard.");
      }
    }
    async function exportAsPng() {
      try {
        const render = renderCurrentDiagram();
        if (!render) {
          store().setStatusMessage("No diagram content to export.");
          return;
        }
        const { canvas } = render;
        const base64 = canvasToPngBase64(canvas);
        postToHost({
          type: "webview.exportFile",
          format: "png",
          base64Data: base64
        });
      } catch (err) {
        console.error("Failed to export as PNG", err);
        store().setStatusMessage("Failed to export as PNG.");
      }
    }
    var div = root_10();
    event("pointermove", $window, handleWindowPointerMove);
    event("pointerup", $window, handleWindowPointerUp);
    event("pointercancel", $window, cancelGesture);
    event("keydown", $window, handleKeyDown);
    event("keyup", $window, handleKeyUp);
    let classes;
    var div_1 = child(div);
    var button = child(div_1);
    var button_1 = sibling(button, 2);
    var text2 = only_child(button_1);
    var button_2 = sibling(button_1, 2);
    reset(div_1);
    var node_2 = sibling(div_1, 2);
    {
      var consequent_13 = ($$anchor2) => {
        var fragment_1 = root_9();
        var div_2 = first_child(fragment_1);
        each(div_2, 21, () => get(doc).nodes.filter((n) => n.kind === "frame"), (node) => node.id, ($$anchor3, node) => {
          const box = user_derived(() => get(effectiveNodeLayouts)[get(node).id]);
          var fragment_2 = comment();
          var node_3 = first_child(fragment_2);
          {
            var consequent_1 = ($$anchor4) => {
              {
                let $0 = user_derived(() => store().selectedIds.includes(get(node).id));
                FrameNode($$anchor4, {
                  get store() {
                    return store();
                  },
                  get node() {
                    return get(node);
                  },
                  get box() {
                    return get(box);
                  },
                  get selected() {
                    return get($0);
                  },
                  onpointerdown: handleNodePointerDown,
                  oncontextmenu: handleNodeContextMenu,
                  ondblclick: (e, n) => {
                    e.stopPropagation();
                    if (store().isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                    startInlineNodeEdit(n);
                  },
                  onresizestart: handleResizeHandlePointerDown
                });
              }
            };
            if_block(node_3, ($$render) => {
              if (get(box)) $$render(consequent_1);
            });
          }
          append($$anchor3, fragment_2);
        });
        reset(div_2);
        var svg_2 = sibling(div_2, 2);
        var g = child(svg_2);
        each(g, 21, () => get(doc).edges, (edge) => edge.id, ($$anchor3, edge) => {
          const srcBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).source.nodeId]);
          const tgtBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).target.nodeId]);
          const srcNode = user_derived(() => get(doc).nodes.find((n) => n.id === get(edge).source.nodeId));
          const tgtNode = user_derived(() => get(doc).nodes.find((n) => n.id === get(edge).target.nodeId));
          var fragment_4 = comment();
          var node_4 = first_child(fragment_4);
          {
            var consequent_2 = ($$anchor4) => {
              const edgeData = user_derived(() => computeEdgeRenderData(get(edge), get(srcBox), get(tgtBox), get(srcNode), get(tgtNode), get(doc).defaultRouting, get(edgeParallelOffsets)[get(edge).id] ?? 0));
              const isEdgeSelected = user_derived(() => store().selectedIds.includes(get(edge).id) || store().selectedIds.includes(get(edge).source.nodeId) && store().selectedIds.includes(get(edge).target.nodeId));
              UmlEdgeRenderer($$anchor4, {
                get data() {
                  return get(edgeData);
                },
                get selected() {
                  return get(isEdgeSelected);
                },
                onselect: (e) => {
                  e.stopPropagation();
                  store().selectSingle(get(edge).id, e.shiftKey || e.metaKey || e.ctrlKey);
                },
                oncontextmenu: (e) => handleEdgeContextMenu(e, get(edge)),
                ondblclick: (e) => {
                  e.stopPropagation();
                  if (store().isReadOnly) return;
                  startInlineEdgeLabelEdit(get(edge));
                }
              });
            };
            if_block(node_4, ($$render) => {
              if (get(srcBox) && get(tgtBox)) $$render(consequent_2);
            });
          }
          append($$anchor3, fragment_4);
        });
        reset(g);
        reset(svg_2);
        var div_3 = sibling(svg_2, 2);
        each(div_3, 21, () => get(doc).nodes.filter((n) => n.kind !== "frame"), (node) => node.id, ($$anchor3, node) => {
          const box = user_derived(() => get(effectiveNodeLayouts)[get(node).id]);
          var fragment_6 = comment();
          var node_5 = first_child(fragment_6);
          {
            var consequent_5 = ($$anchor4) => {
              var fragment_7 = comment();
              var node_6 = first_child(fragment_7);
              {
                var consequent_3 = ($$anchor5) => {
                  {
                    let $0 = user_derived(() => store().selectedIds.includes(get(node).id));
                    NoteNode($$anchor5, {
                      get store() {
                        return store();
                      },
                      get node() {
                        return get(node);
                      },
                      get box() {
                        return get(box);
                      },
                      get selected() {
                        return get($0);
                      },
                      onpointerdown: handleNodePointerDown,
                      oncontextmenu: handleNodeContextMenu,
                      ondblclick: (e, n) => {
                        e.stopPropagation();
                        if (store().isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                        startInlineNodeEdit(n);
                      },
                      onresizestart: handleResizeHandlePointerDown,
                      onconnectstart: handleConnectPortPointerDown
                    });
                  }
                };
                var consequent_4 = ($$anchor5) => {
                  {
                    let $0 = user_derived(() => store().selectedIds.includes(get(node).id));
                    ShapeNode($$anchor5, {
                      get store() {
                        return store();
                      },
                      get node() {
                        return get(node);
                      },
                      get box() {
                        return get(box);
                      },
                      get selected() {
                        return get($0);
                      },
                      onpointerdown: handleNodePointerDown,
                      oncontextmenu: handleNodeContextMenu,
                      ondblclick: (e, n) => {
                        e.stopPropagation();
                        if (store().isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                        startInlineNodeEdit(n);
                      },
                      onresizestart: handleResizeHandlePointerDown,
                      onconnectstart: handleConnectPortPointerDown,
                      oneditlabel: startInlineNodeEdit
                    });
                  }
                };
                var alternate_1 = ($$anchor5) => {
                  {
                    let $0 = user_derived(() => store().selectedIds.includes(get(node).id));
                    ClassNode($$anchor5, {
                      get store() {
                        return store();
                      },
                      get node() {
                        return get(node);
                      },
                      get box() {
                        return get(box);
                      },
                      get selected() {
                        return get($0);
                      },
                      onpointerdown: handleNodePointerDown,
                      oncontextmenu: handleNodeContextMenu,
                      ondblclick: (e, n) => {
                        e.stopPropagation();
                        if (store().isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                        startInlineNodeEdit(n);
                      },
                      onresizestart: handleResizeHandlePointerDown,
                      onconnectstart: handleConnectPortPointerDown
                    });
                  }
                };
                if_block(node_6, ($$render) => {
                  if (get(node).kind === "note") $$render(consequent_3);
                  else if (get(node).kind === "shape") $$render(consequent_4, 1);
                  else $$render(alternate_1, -1);
                });
              }
              append($$anchor4, fragment_7);
            };
            if_block(node_5, ($$render) => {
              if (get(box)) $$render(consequent_5);
            });
          }
          append($$anchor3, fragment_6);
        });
        reset(div_3);
        var svg_3 = sibling(div_3, 2);
        var g_1 = child(svg_3);
        var node_7 = child(g_1);
        {
          var consequent_6 = ($$anchor3) => {
            var line = root_28();
            template_effect(() => {
              set_attribute2(line, "x1", get(gesture).startPoint.x);
              set_attribute2(line, "y1", get(gesture).startPoint.y);
              set_attribute2(line, "x2", get(gesture).currentWorld.x);
              set_attribute2(line, "y2", get(gesture).currentWorld.y);
            });
            append($$anchor3, line);
          };
          if_block(node_7, ($$render) => {
            if (get(gesture).mode === "connecting") $$render(consequent_6);
          });
        }
        var node_8 = sibling(node_7);
        each(node_8, 17, () => get(doc).edges, (edge) => edge.id, ($$anchor3, edge) => {
          const isEdgeSelected = user_derived(() => store().selectedIds.includes(get(edge).id) || store().selectedIds.includes(get(edge).source.nodeId) && store().selectedIds.includes(get(edge).target.nodeId));
          const srcBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).source.nodeId]);
          const tgtBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).target.nodeId]);
          var fragment_11 = comment();
          var node_9 = first_child(fragment_11);
          {
            var consequent_7 = ($$anchor4) => {
              const handleData = user_derived(() => computeEdgeRenderData(get(edge), get(srcBox), get(tgtBox), get(doc).nodes.find((n) => n.id === get(edge).source.nodeId), get(doc).nodes.find((n) => n.id === get(edge).target.nodeId), get(doc).defaultRouting, get(edgeParallelOffsets)[get(edge).id] ?? 0));
              var fragment_12 = root_37();
              var circle = first_child(fragment_12);
              var circle_1 = sibling(circle);
              template_effect(() => {
                set_attribute2(circle, "cx", get(handleData).startCenter.x);
                set_attribute2(circle, "cy", get(handleData).startCenter.y);
                set_attribute2(circle_1, "cx", get(handleData).endCenter.x);
                set_attribute2(circle_1, "cy", get(handleData).endCenter.y);
              });
              delegated("pointerdown", circle, (event2) => event2.stopPropagation());
              delegated("click", circle, (event2) => {
                event2.stopPropagation();
                openEndpointPickerPopup(event2.clientX, event2.clientY, get(edge), "start", get(handleData).startDecoration);
              });
              delegated("pointerdown", circle_1, (event2) => event2.stopPropagation());
              delegated("click", circle_1, (event2) => {
                event2.stopPropagation();
                openEndpointPickerPopup(event2.clientX, event2.clientY, get(edge), "end", get(handleData).endDecoration);
              });
              append($$anchor4, fragment_12);
            };
            if_block(node_9, ($$render) => {
              if (get(isEdgeSelected) && get(srcBox) && get(tgtBox) && !store().isReadOnly) $$render(consequent_7);
            });
          }
          append($$anchor3, fragment_11);
        });
        reset(g_1);
        reset(svg_3);
        var div_4 = sibling(svg_3, 2);
        var node_10 = child(div_4);
        each(node_10, 17, () => get(doc).nodes.filter((n) => n.kind === "frame"), (frame) => frame.id, ($$anchor3, frame) => {
          const frameBox = user_derived(() => get(effectiveNodeLayouts)[get(frame).id]);
          var fragment_13 = comment();
          var node_11 = first_child(fragment_13);
          {
            var consequent_8 = ($$anchor4) => {
              const frameEditing = user_derived(() => store().inlineEdit.state.mode === "node" && store().inlineEdit.state.nodeId === get(frame).id ? store().inlineEdit.state : null);
              {
                let $0 = user_derived(() => ({ x: get(frameBox).x + 16, y: get(frameBox).y + 1.5 }));
                let $1 = user_derived(() => get(frame).name || "Frame");
                let $2 = user_derived(() => store().selectedIds.includes(get(frame).id));
                let $3 = user_derived(() => Boolean(get(frameEditing)));
                let $4 = user_derived(() => get(frameEditing)?.name ?? "");
                EdgeLabel($$anchor4, {
                  get point() {
                    return get($0);
                  },
                  get label() {
                    return get($1);
                  },
                  get selected() {
                    return get($2);
                  },
                  get editing() {
                    return get($3);
                  },
                  get draft() {
                    return get($4);
                  },
                  align: "above-left",
                  frameLabel: true,
                  onselect: () => {
                    if (store().isReadOnly) return;
                    if (store().selectedIds.includes(get(frame).id)) startInlineNodeEdit(get(frame));
                    else store().selectSingle(get(frame).id, false);
                  },
                  ondblclick: (event2) => {
                    event2.stopPropagation();
                    if (!store().isReadOnly) startInlineNodeEdit(get(frame));
                  },
                  onDraftChange: (value) => {
                    if (get(frameEditing)) store().inlineEdit.updateNodeDraft({ name: value });
                  },
                  onCommit: () => store().inlineEdit.commitNode(get(frame)),
                  onCancel: () => store().inlineEdit.cancelAll()
                });
              }
            };
            if_block(node_11, ($$render) => {
              if (get(frameBox)) $$render(consequent_8);
            });
          }
          append($$anchor3, fragment_13);
        });
        var node_12 = sibling(node_10, 2);
        each(node_12, 17, () => get(doc).edges, (edge) => edge.id, ($$anchor3, edge) => {
          const srcBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).source.nodeId]);
          const tgtBox = user_derived(() => get(effectiveNodeLayouts)[get(edge).target.nodeId]);
          var fragment_15 = comment();
          var node_13 = first_child(fragment_15);
          {
            var consequent_9 = ($$anchor4) => {
              const srcNode = user_derived(() => get(doc).nodes.find((n) => n.id === get(edge).source.nodeId));
              const tgtNode = user_derived(() => get(doc).nodes.find((n) => n.id === get(edge).target.nodeId));
              const isEdgeSelected = user_derived(() => store().selectedIds.includes(get(edge).id) || store().selectedIds.includes(get(edge).source.nodeId) && store().selectedIds.includes(get(edge).target.nodeId));
              const labelData = user_derived(() => computeEdgeRenderData(get(edge), get(srcBox), get(tgtBox), get(srcNode), get(tgtNode), get(doc).defaultRouting, get(edgeParallelOffsets)[get(edge).id] ?? 0));
              var fragment_16 = root_46();
              var node_14 = first_child(fragment_16);
              {
                let $0 = user_derived(() => get(inlineEditingEdgeId) === get(edge).id);
                EdgeLabel(node_14, {
                  get point() {
                    return get(labelData).geometry.labelPoint;
                  },
                  get label() {
                    return get(edge).label;
                  },
                  get selected() {
                    return get(isEdgeSelected);
                  },
                  get editing() {
                    return get($0);
                  },
                  get draft() {
                    return get(inlineEdgeLabelDraft);
                  },
                  onselect: (event2) => {
                    if (store().isReadOnly) return;
                    if (get(isEdgeSelected)) startInlineEdgeLabelEdit(get(edge));
                    else store().selectSingle(get(edge).id, event2.shiftKey || event2.metaKey || event2.ctrlKey);
                  },
                  ondblclick: (event2) => {
                    event2.stopPropagation();
                    if (!store().isReadOnly) startInlineEdgeLabelEdit(get(edge));
                  },
                  onDraftChange: (value) => set(inlineEdgeLabelDraft, value, true),
                  onCommit: () => commitInlineEdgeLabel(get(edge)),
                  onCancel: () => set(inlineEditingEdgeId, null)
                });
              }
              var node_15 = sibling(node_14, 2);
              {
                let $0 = user_derived(() => get(inlineEditingMultiplicity)?.edgeId === get(edge).id && get(inlineEditingMultiplicity).end === "start");
                let $1 = user_derived(() => get(inlineEditingMultiplicity)?.draft ?? "");
                MultiplicityTag(node_15, {
                  get point() {
                    return get(labelData).startMultiplicityPoint;
                  },
                  get text() {
                    return get(edge).source.multiplicity;
                  },
                  get selected() {
                    return get(isEdgeSelected);
                  },
                  get editing() {
                    return get($0);
                  },
                  get draft() {
                    return get($1);
                  },
                  onclick: (event2) => {
                    event2.stopPropagation();
                    if (store().isReadOnly) return;
                    if (get(isEdgeSelected)) startInlineMultiplicityEdit(get(edge), "start");
                    else store().selectSingle(get(edge).id, event2.shiftKey || event2.metaKey || event2.ctrlKey);
                  },
                  ondblclick: (event2) => {
                    event2.stopPropagation();
                    if (!store().isReadOnly) startInlineMultiplicityEdit(get(edge), "start");
                  },
                  onDraftChange: (value) => {
                    if (get(inlineEditingMultiplicity)) get(inlineEditingMultiplicity).draft = value;
                  },
                  onCommit: () => commitInlineMultiplicity(get(edge)),
                  onCancel: () => set(inlineEditingMultiplicity, null)
                });
              }
              var node_16 = sibling(node_15, 2);
              {
                let $0 = user_derived(() => get(inlineEditingMultiplicity)?.edgeId === get(edge).id && get(inlineEditingMultiplicity).end === "end");
                let $1 = user_derived(() => get(inlineEditingMultiplicity)?.draft ?? "");
                MultiplicityTag(node_16, {
                  get point() {
                    return get(labelData).endMultiplicityPoint;
                  },
                  get text() {
                    return get(edge).target.multiplicity;
                  },
                  get selected() {
                    return get(isEdgeSelected);
                  },
                  get editing() {
                    return get($0);
                  },
                  get draft() {
                    return get($1);
                  },
                  onclick: (event2) => {
                    event2.stopPropagation();
                    if (store().isReadOnly) return;
                    if (get(isEdgeSelected)) startInlineMultiplicityEdit(get(edge), "end");
                    else store().selectSingle(get(edge).id, event2.shiftKey || event2.metaKey || event2.ctrlKey);
                  },
                  ondblclick: (event2) => {
                    event2.stopPropagation();
                    if (!store().isReadOnly) startInlineMultiplicityEdit(get(edge), "end");
                  },
                  onDraftChange: (value) => {
                    if (get(inlineEditingMultiplicity)) get(inlineEditingMultiplicity).draft = value;
                  },
                  onCommit: () => commitInlineMultiplicity(get(edge)),
                  onCancel: () => set(inlineEditingMultiplicity, null)
                });
              }
              append($$anchor4, fragment_16);
            };
            if_block(node_13, ($$render) => {
              if (get(srcBox) && get(tgtBox)) $$render(consequent_9);
            });
          }
          append($$anchor3, fragment_15);
        });
        reset(div_4);
        var svg_4 = sibling(div_4, 2);
        var g_2 = child(svg_4);
        var node_17 = child(g_2);
        {
          var consequent_10 = ($$anchor3) => {
            var rect_1 = root_54();
            template_effect(() => {
              set_attribute2(rect_1, "x", get(marqueeRect).x);
              set_attribute2(rect_1, "y", get(marqueeRect).y);
              set_attribute2(rect_1, "width", get(marqueeRect).width);
              set_attribute2(rect_1, "height", get(marqueeRect).height);
            });
            append($$anchor3, rect_1);
          };
          if_block(node_17, ($$render) => {
            if (get(marqueeRect)) $$render(consequent_10);
          });
        }
        reset(g_2);
        reset(svg_4);
        var node_18 = sibling(svg_4, 2);
        {
          var consequent_12 = ($$anchor3) => {
            const popup = user_derived(() => get(endpointPickerPopup));
            var div_5 = root_8();
            var div_6 = child(div_5);
            var input = sibling(child(div_6), 2);
            remove_input_defaults(input);
            reset(div_6);
            var div_7 = sibling(div_6, 2);
            each(div_7, 21, () => endpointIconChoices, index, ($$anchor4, choice) => {
              const preview = user_derived(() => renderEndpointPath2(get(choice).decoration));
              const isActive = user_derived(() => isSameEndpointChoice(get(popup).current, get(choice).decoration));
              var button_3 = root_73();
              let classes_1;
              var svg_5 = child(button_3);
              var line_1 = child(svg_5);
              var node_19 = sibling(line_1);
              {
                var consequent_11 = ($$anchor5) => {
                  var path = root_63();
                  template_effect(() => {
                    set_attribute2(path, "d", get(preview).d);
                    set_attribute2(path, "fill", get(choice).decoration.fill === "filled" ? "currentColor" : "var(--vscode-editor-background)");
                  });
                  append($$anchor5, path);
                };
                if_block(node_19, ($$render) => {
                  if (get(preview).d) $$render(consequent_11);
                });
              }
              reset(svg_5);
              var span = sibling(svg_5, 2);
              var text_1 = only_child(span, true);
              reset(button_3);
              template_effect(
                ($0) => {
                  classes_1 = set_class(button_3, 1, "vz-endpoint-icon-btn", null, classes_1, { active: get(isActive) });
                  set_attribute2(button_3, "title", get(choice).label);
                  set_attribute2(line_1, "x2", $0);
                  set_text(text_1, get(choice).label);
                },
                [
                  () => get(choice).decoration.shape === "none" || get(choice).decoration.shape === "open-arrow" ? "0" : String(-(get(choice).decoration.size ?? 11))
                ]
              );
              delegated("click", button_3, () => {
                commitEndpointMultiplicity();
                store().dispatchOperation({
                  type: "uml.updateEndpoint",
                  edgeId: get(popup).edgeId,
                  end: get(popup).end,
                  decoration: get(choice).decoration
                });
                set(endpointPickerPopup, null);
              });
              append($$anchor4, button_3);
            });
            reset(div_7);
            reset(div_5);
            template_effect(() => {
              set_style(div_5, `left: ${get(popup).x ?? ""}px; top: ${get(popup).y ?? ""}px;`);
              set_value(input, get(popup).multiplicityDraft);
            });
            delegated("pointerdown", div_5, (e) => e.stopPropagation());
            delegated("input", input, (ev) => {
              if (get(endpointPickerPopup)) {
                get(endpointPickerPopup).multiplicityDraft = ev.currentTarget.value;
              }
            });
            delegated("change", input, () => {
              commitEndpointMultiplicity();
            });
            delegated("keydown", input, (ke) => {
              if (ke.key === "Enter") {
                closeEndpointPickerPopup();
              } else if (ke.key === "Escape") {
                set(endpointPickerPopup, null);
              }
            });
            append($$anchor3, div_5);
          };
          if_block(node_18, ($$render) => {
            if (get(endpointPickerPopup)) $$render(consequent_12);
          });
        }
        template_effect(() => {
          set_style(div_2, `transform: translate(${store().viewport.panX ?? ""}px, ${store().viewport.panY ?? ""}px) scale(${store().viewport.zoom ?? ""});`);
          set_attribute2(g, "transform", `translate(${store().viewport.panX ?? ""}, ${store().viewport.panY ?? ""}) scale(${store().viewport.zoom ?? ""})`);
          set_style(div_3, `transform: translate(${store().viewport.panX ?? ""}px, ${store().viewport.panY ?? ""}px) scale(${store().viewport.zoom ?? ""});`);
          set_attribute2(g_1, "transform", `translate(${store().viewport.panX ?? ""}, ${store().viewport.panY ?? ""}) scale(${store().viewport.zoom ?? ""})`);
          set_style(div_4, `transform: translate(${store().viewport.panX ?? ""}px, ${store().viewport.panY ?? ""}px) scale(${store().viewport.zoom ?? ""});`);
          set_attribute2(g_2, "transform", `translate(${store().viewport.panX ?? ""}, ${store().viewport.panY ?? ""}) scale(${store().viewport.zoom ?? ""})`);
        });
        append($$anchor2, fragment_1);
      };
      if_block(node_2, ($$render) => {
        if (get(doc)) $$render(consequent_13);
      });
    }
    reset(div);
    bind_this(div, ($$value) => set(viewportEl, $$value), () => get(viewportEl));
    template_effect(
      ($0) => {
        classes = set_class(div, 1, "vz-viewport vz-canvas-bg", null, classes, {
          "space-grab": get(spacePressed),
          "space-grabbing": get(gesture).mode === "panning" || get(gesture).mode === "moving",
          "is-resizing": get(gesture).mode === "resizing"
        });
        set_style(div, `background-size: ${get(gridSpacing) ?? ""}px ${get(gridSpacing) ?? ""}px; background-position: ${get(gridPosX) ?? ""}px ${get(gridPosY) ?? ""}px; background-image: radial-gradient(rgba(128, 128, 128, ${get(gridOpacity) ?? ""}) ${get(gridDotRadius) ?? ""}px, transparent ${get(gridDotRadius) ?? ""}px); --vz-resize-cursor: ${get(resizeCursor) ?? "default" ?? ""};`);
        set_text(text2, `${$0 ?? ""}%`);
      },
      [() => Math.round(store().viewport.zoom * 100)]
    );
    event("wheel", div, handleWheel);
    delegated("pointermove", div, (e) => {
      set(lastPointerWorldPos, getRelativeWorldPoint(e), true);
    });
    delegated("pointerdown", div, handleCanvasPointerDown);
    delegated("contextmenu", div, handleCanvasContextMenu);
    event("wheel", div_1, handleZoomPillWheel);
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
    "pointermove",
    "pointerdown",
    "contextmenu",
    "click",
    "input",
    "change",
    "keydown"
  ]);

  // src/webview/ui/layout/Splitter.svelte
  var root17 = from_html(`<div role="separator" tabindex="0"></div>`);
  function Splitter($$anchor, $$props) {
    push($$props, true);
    let orientation = prop($$props, "orientation", 3, "vertical"), label = prop($$props, "label", 3, "Resize panel");
    let dragging = state(false);
    let lastPosition = 0;
    function handlePointerDown(event2) {
      event2.preventDefault();
      event2.stopPropagation();
      set(dragging, true);
      lastPosition = orientation() === "vertical" ? event2.clientX : event2.clientY;
      event2.currentTarget.setPointerCapture?.(event2.pointerId);
    }
    function handlePointerMove(event2) {
      if (!get(dragging)) return;
      const current = orientation() === "vertical" ? event2.clientX : event2.clientY;
      const delta = current - lastPosition;
      if (delta === 0) return;
      lastPosition = current;
      $$props.onresize?.(delta);
    }
    function handlePointerUp() {
      set(dragging, false);
    }
    function handleKeyDown(event2) {
      const step = event2.shiftKey ? 40 : 10;
      if (orientation() === "vertical") {
        if (event2.key === "ArrowLeft") {
          event2.preventDefault();
          $$props.onresize?.(-step);
        } else if (event2.key === "ArrowRight") {
          event2.preventDefault();
          $$props.onresize?.(step);
        }
      } else if (event2.key === "ArrowUp") {
        event2.preventDefault();
        $$props.onresize?.(-step);
      } else if (event2.key === "ArrowDown") {
        event2.preventDefault();
        $$props.onresize?.(step);
      }
    }
    var div = root17();
    let classes;
    template_effect(() => {
      classes = set_class(div, 1, `vz-ui-splitter ${orientation() ?? ""}`, "svelte-1ongngy", classes, { dragging: get(dragging) });
      set_attribute2(div, "aria-orientation", orientation() === "vertical" ? "vertical" : "horizontal");
      set_attribute2(div, "aria-label", label());
    });
    delegated("pointerdown", div, handlePointerDown);
    delegated("pointermove", div, handlePointerMove);
    delegated("pointerup", div, handlePointerUp);
    event("pointercancel", div, handlePointerUp);
    delegated("keydown", div, handleKeyDown);
    append($$anchor, div);
    pop();
  }
  delegate(["pointerdown", "pointermove", "pointerup", "keydown"]);

  // src/webview/sidebar/outline/ElementsOutline.svelte
  var itemIcon = ($$anchor, item = noop) => {
    var svg = root_20();
    var node_1 = child(svg);
    {
      var consequent_10 = ($$anchor2) => {
        const v = user_derived(() => item().edgeVisual);
        const hasLeftShape = user_derived(() => get(v).startShape === "diamond" || get(v).startShape === "circle" || get(v).startShape === "square" || get(v).startShape === "triangle");
        const hasRightShape = user_derived(() => get(v).endShape === "diamond" || get(v).endShape === "circle" || get(v).endShape === "square" || get(v).endShape === "triangle");
        const startX = user_derived(() => get(hasLeftShape) ? 6 : 1.5);
        const endX = user_derived(() => get(hasRightShape) ? 10 : 14.5);
        var fragment = root_102();
        var line_1 = first_child(fragment);
        var node_2 = sibling(line_1);
        {
          var consequent = ($$anchor3) => {
            var polygon = root18();
            template_effect(() => set_attribute2(polygon, "fill", get(v).startFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, polygon);
          };
          var consequent_1 = ($$anchor3) => {
            var circle = root_113();
            template_effect(() => set_attribute2(circle, "fill", get(v).startFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, circle);
          };
          var consequent_2 = ($$anchor3) => {
            var rect_1 = root_29();
            template_effect(() => set_attribute2(rect_1, "fill", get(v).startFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, rect_1);
          };
          var consequent_3 = ($$anchor3) => {
            var polygon_1 = root_38();
            template_effect(() => set_attribute2(polygon_1, "fill", get(v).startFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, polygon_1);
          };
          var consequent_4 = ($$anchor3) => {
            var path = root_47();
            append($$anchor3, path);
          };
          if_block(node_2, ($$render) => {
            if (get(v).startShape === "diamond") $$render(consequent);
            else if (get(v).startShape === "circle") $$render(consequent_1, 1);
            else if (get(v).startShape === "square") $$render(consequent_2, 2);
            else if (get(v).startShape === "triangle") $$render(consequent_3, 3);
            else if (get(v).startShape === "open-arrow") $$render(consequent_4, 4);
          });
        }
        var node_3 = sibling(node_2);
        {
          var consequent_5 = ($$anchor3) => {
            var polygon_2 = root_55();
            template_effect(() => set_attribute2(polygon_2, "fill", get(v).endFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, polygon_2);
          };
          var consequent_6 = ($$anchor3) => {
            var circle_1 = root_64();
            template_effect(() => set_attribute2(circle_1, "fill", get(v).endFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, circle_1);
          };
          var consequent_7 = ($$anchor3) => {
            var rect_2 = root_74();
            template_effect(() => set_attribute2(rect_2, "fill", get(v).endFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, rect_2);
          };
          var consequent_8 = ($$anchor3) => {
            var polygon_3 = root_82();
            template_effect(() => set_attribute2(polygon_3, "fill", get(v).endFill === "filled" ? "currentColor" : "var(--vscode-editor-background, #1e1e1e)"));
            append($$anchor3, polygon_3);
          };
          var consequent_9 = ($$anchor3) => {
            var path_1 = root_92();
            append($$anchor3, path_1);
          };
          if_block(node_3, ($$render) => {
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
        next();
        append($$anchor2, fragment_2);
      };
      var consequent_13 = ($$anchor2) => {
        var fragment_3 = root_132();
        next(3);
        append($$anchor2, fragment_3);
      };
      var consequent_14 = ($$anchor2) => {
        var rect_3 = root_142();
        append($$anchor2, rect_3);
      };
      var consequent_15 = ($$anchor2) => {
        var ellipse = root_152();
        append($$anchor2, ellipse);
      };
      var consequent_16 = ($$anchor2) => {
        var polygon_4 = root_162();
        append($$anchor2, polygon_4);
      };
      var consequent_17 = ($$anchor2) => {
        var polygon_5 = root_172();
        append($$anchor2, polygon_5);
      };
      var consequent_18 = ($$anchor2) => {
        var polygon_6 = root_182();
        append($$anchor2, polygon_6);
      };
      var alternate = ($$anchor2) => {
        var rect_4 = root_192();
        append($$anchor2, rect_4);
      };
      if_block(node_1, ($$render) => {
        if (item().isEdge && item().edgeVisual) $$render(consequent_10);
        else if (item().iconKey === "class") $$render(consequent_11, 1);
        else if (item().iconKey === "frame") $$render(consequent_12, 2);
        else if (item().iconKey === "note") $$render(consequent_13, 3);
        else if (item().iconKey === "rectangle") $$render(consequent_14, 4);
        else if (item().iconKey === "ellipse") $$render(consequent_15, 5);
        else if (item().iconKey === "rhombus") $$render(consequent_16, 6);
        else if (item().iconKey === "trapezoid") $$render(consequent_17, 7);
        else if (item().iconKey === "parallelogram") $$render(consequent_18, 8);
        else $$render(alternate, -1);
      });
    }
    reset(svg);
    append($$anchor, svg);
  };
  var root18 = from_svg(`<polygon points="1,8 3.5,5.5 6,8 3.5,10.5" stroke-width="1.2"></polygon>`);
  var root_113 = from_svg(`<circle cx="3.5" cy="8" r="2.5" stroke-width="1.2"></circle>`);
  var root_29 = from_svg(`<rect x="1" y="5.5" width="5" height="5" stroke-width="1.2"></rect>`);
  var root_38 = from_svg(`<polygon points="6,5 1,8 6,11" stroke-width="1.2"></polygon>`);
  var root_47 = from_svg(`<path d="M5 5.5 L1.5 8 L5 10.5" stroke-width="1.3"></path>`);
  var root_55 = from_svg(`<polygon points="10,8 12.5,5.5 15,8 12.5,10.5" stroke-width="1.2"></polygon>`);
  var root_64 = from_svg(`<circle cx="12.5" cy="8" r="2.5" stroke-width="1.2"></circle>`);
  var root_74 = from_svg(`<rect x="10" y="5.5" width="5" height="5" stroke-width="1.2"></rect>`);
  var root_82 = from_svg(`<polygon points="10,5 15,8 10,11" stroke-width="1.2"></polygon>`);
  var root_92 = from_svg(`<path d="M11 5.5 L14.5 8 L11 10.5" stroke-width="1.3"></path>`);
  var root_102 = from_svg(`<line y1="8" y2="8" stroke-width="1.3"></line><!><!>`, 1);
  var root_11 = from_svg(`<rect x="2" y="2" width="12" height="12" rx="1.5" stroke-width="1.3"></rect><line x1="2" y1="6" x2="14" y2="6" stroke-width="1.1"></line><line x1="2" y1="10" x2="14" y2="10" stroke-width="1.1"></line>`, 1);
  var root_122 = from_svg(`<rect x="2" y="2" width="12" height="12" rx="1.5" stroke-width="1.3"></rect><path d="M2 6 h5 v-4" stroke-width="1.1"></path>`, 1);
  var root_132 = from_svg(`<path d="M3 2 h7 l3 3 v8 a1 1 0 0 1 -1 1 h-9 a1 1 0 0 1 -1 -1 v-10 a1 1 0 0 1 1 -1 z" stroke-width="1.3"></path><path d="M10 2 v3 h3" stroke-width="1.1"></path><line x1="5" y1="8" x2="11" y2="8" stroke-width="1"></line><line x1="5" y1="11" x2="9" y2="11" stroke-width="1"></line>`, 1);
  var root_142 = from_svg(`<rect x="2" y="3.5" width="12" height="9" rx="1" stroke-width="1.3"></rect>`);
  var root_152 = from_svg(`<ellipse cx="8" cy="8" rx="6" ry="4.5" stroke-width="1.3"></ellipse>`);
  var root_162 = from_svg(`<polygon points="8,2 14,8 8,14 2,8" stroke-width="1.3"></polygon>`);
  var root_172 = from_svg(`<polygon points="4.5,4 11.5,4 13.5,12 2.5,12" stroke-width="1.3"></polygon>`);
  var root_182 = from_svg(`<polygon points="4.5,4 13.5,4 11.5,12 2.5,12" stroke-width="1.3"></polygon>`);
  var root_192 = from_svg(`<rect x="2" y="2" width="12" height="12" rx="2" stroke-width="1.3"></rect>`);
  var root_20 = from_svg(`<svg class="vz-outline-icon-svg" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><!></svg>`);
  var root_21 = from_html(`<span></span> <span class="vz-outline-edge-label"> </span> <span></span>`, 1);
  var root_222 = from_html(`<span></span>`);
  var root_232 = from_html(`<div class="vz-outline-edge-row"><span class="vz-outline-endpoint"> </span> <span class="vz-outline-connector" aria-hidden="true"><!></span> <span class="vz-outline-endpoint"> </span></div>`);
  var root_242 = from_html(`<span class="vz-outline-stereotype"> </span>`);
  var root_252 = from_html(`<span class="vz-outline-label"> </span> <!>`, 1);
  var root_262 = from_html(`<button type="button"><span class="vz-outline-icon" aria-hidden="true"><!></span> <!></button>`);
  var root_272 = from_html(`<button type="button" class="vz-add-dropdown-item" role="menuitem"><span> </span> <kbd class="vz-kbd"> </kbd></button>`);
  var root_282 = from_html(`<button type="button" class="vz-add-dropdown-item" role="menuitem"><span> </span></button>`);
  var root_292 = from_html(`<div class="vz-add-dropdown" role="menu"><!> <div class="vz-context-divider"></div> <div class="vz-dropdown-section-label">Shapes</div> <!></div>`);
  var root_30 = from_html(`<div class="vz-add-dropdown-wrap"><button type="button" class="vz-plus-btn" title="Add New UML Element" aria-label="Add New UML Element">\uFF0B</button> <!></div>`);
  var root_31 = from_html(`No elements yet. Click <strong>\uFF0B</strong> or right-click here to add one.`, 1);
  var root_322 = from_html(`<div class="vz-empty-hint"><!></div>`);
  var root_332 = from_html(`<li role="option"><!></li>`);
  var root_342 = from_html(`<ul class="vz-outline-list" role="listbox" aria-label="Diagram elements"></ul>`);
  var root_352 = from_html(`<section class="vz-outline-section" aria-label="Elements List"><div class="vz-outline-header"><span class="vz-sidebar-title"> </span> <!></div> <div class="vz-outline-search-row"><input type="search" class="vz-input" placeholder="Search" aria-label="Search elements"/></div> <!></section>  <div class="vz-section-splitter" role="separator" aria-orientation="horizontal" aria-label="Resize Elements and Inspector sections" tabindex="0"></div>`, 1);
  function ElementsOutline($$anchor, $$props) {
    push($$props, true);
    const outlineItemButton = ($$anchor2, item = noop) => {
      const isSelected = user_derived(() => store().selectedIds.includes(item().id));
      var button = root_262();
      let classes;
      var span = child(button);
      var node_4 = child(span);
      itemIcon(node_4, item);
      reset(span);
      var node_5 = sibling(span, 2);
      {
        var consequent_20 = ($$anchor3) => {
          var div = root_232();
          var span_1 = child(div);
          var text2 = only_child(span_1, true);
          var span_2 = sibling(span_1, 2);
          var node_6 = child(span_2);
          {
            var consequent_19 = ($$anchor4) => {
              var fragment_4 = root_21();
              var span_3 = first_child(fragment_4);
              let classes_1;
              var span_4 = sibling(span_3, 2);
              var text_1 = only_child(span_4, true);
              var span_5 = sibling(span_4, 2);
              let classes_2;
              template_effect(() => {
                classes_1 = set_class(span_3, 1, "vz-outline-connector-line", null, classes_1, { dashed: item().isDashed });
                set_attribute2(span_4, "title", item().edgeLabel);
                set_text(text_1, item().edgeLabel);
                classes_2 = set_class(span_5, 1, "vz-outline-connector-line", null, classes_2, { dashed: item().isDashed });
              });
              append($$anchor4, fragment_4);
            };
            var alternate_1 = ($$anchor4) => {
              var span_6 = root_222();
              let classes_3;
              template_effect(() => classes_3 = set_class(span_6, 1, "vz-outline-connector-line", null, classes_3, { dashed: item().isDashed }));
              append($$anchor4, span_6);
            };
            if_block(node_6, ($$render) => {
              if (item().edgeLabel) $$render(consequent_19);
              else $$render(alternate_1, -1);
            });
          }
          reset(span_2);
          var span_7 = sibling(span_2, 2);
          var text_2 = only_child(span_7, true);
          reset(div);
          template_effect(() => {
            set_attribute2(span_1, "title", item().sourceName);
            set_text(text2, item().sourceName);
            set_attribute2(span_7, "title", item().targetName);
            set_text(text_2, item().targetName);
          });
          append($$anchor3, div);
        };
        var alternate_2 = ($$anchor3) => {
          var fragment_5 = root_252();
          var span_8 = first_child(fragment_5);
          var text_3 = only_child(span_8, true);
          var node_7 = sibling(span_8, 2);
          {
            var consequent_21 = ($$anchor4) => {
              var span_9 = root_242();
              var text_4 = only_child(span_9);
              template_effect(() => set_text(text_4, `\xAB${item().stereotype ?? ""}\xBB`));
              append($$anchor4, span_9);
            };
            if_block(node_7, ($$render) => {
              if (item().stereotype) $$render(consequent_21);
            });
          }
          template_effect(() => set_text(text_3, item().label));
          append($$anchor3, fragment_5);
        };
        if_block(node_5, ($$render) => {
          if (item().isEdge) $$render(consequent_20);
          else $$render(alternate_2, -1);
        });
      }
      reset(button);
      template_effect(() => {
        classes = set_class(button, 1, "vz-outline-item", null, classes, { selected: get(isSelected) });
        set_attribute2(button, "title", item().tooltip);
        set_attribute2(span, "title", item().iconTitle);
      });
      delegated("click", button, (e) => store().selectSingle(item().id, e.shiftKey || e.metaKey || e.ctrlKey));
      delegated("contextmenu", button, (e) => openItemContextMenu(e, item().id, item().contextLabel));
      append($$anchor2, button);
    };
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
    function keepDropdownInView(node) {
      const rect = node.getBoundingClientRect();
      if (rect.left < 8) {
        node.style.left = "8px";
        node.style.right = "auto";
      }
      if (rect.bottom > window.innerHeight - 8) {
        const overflowY = rect.bottom - (window.innerHeight - 8);
        node.style.top = `${26 - overflowY}px`;
      }
    }
    const umlCreationOptions = [
      { kind: "class", label: "Class", shortcut: "Alt+C" },
      { kind: "note", label: "Note", shortcut: "Alt+N" },
      { kind: "frame", label: "Frame", shortcut: "Alt+F" }
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
            sourceNodeId: e.source.nodeId,
            targetNodeId: e.target.nodeId,
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
    function matchesItemQuery(item, q) {
      if (!q) return true;
      if (item.isEdge) {
        return (item.sourceName || "").toLowerCase().includes(q) || (item.targetName || "").toLowerCase().includes(q) || (item.edgeLabel || "").toLowerCase().includes(q) || (item.edgeKind || "").toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
      }
      return (item.label || "").toLowerCase().includes(q) || (item.stereotype || "").toLowerCase().includes(q) || `\xAB${(item.stereotype || "").toLowerCase()}\xBB`.includes(q) || (item.iconKey || "").toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    }
    const filteredItems = user_derived(() => {
      const q = store().outlineSearchQuery.trim().toLowerCase();
      if (!q) return get(allItems);
      return get(allItems).filter((item) => matchesItemQuery(item, q));
    });
    function handleExplorerContextMenu(e) {
      const target2 = e.target;
      if (target2?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    }
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
    var fragment_6 = root_352();
    event("pointerdown", $window, handleWindowPointerDown);
    event("pointermove", $window, handleWindowPointerMove);
    event("pointerup", $window, handleWindowPointerUp);
    event("keydown", $window, handleWindowKeyDown);
    var section = first_child(fragment_6);
    var div_1 = child(section);
    var span_10 = child(div_1);
    var text_5 = only_child(span_10);
    var node_8 = sibling(span_10, 2);
    {
      var consequent_23 = ($$anchor2) => {
        var div_2 = root_30();
        var button_1 = child(div_2);
        var node_9 = sibling(button_1, 2);
        {
          var consequent_22 = ($$anchor3) => {
            var div_3 = root_292();
            var node_10 = child(div_3);
            each(node_10, 17, () => umlCreationOptions, (opt) => opt.kind, ($$anchor4, opt) => {
              var button_2 = root_272();
              var span_11 = child(button_2);
              var text_6 = only_child(span_11, true);
              var kbd = sibling(span_11, 2);
              var text_7 = only_child(kbd, true);
              reset(button_2);
              template_effect(() => {
                set_text(text_6, get(opt).label);
                set_text(text_7, get(opt).shortcut);
              });
              delegated("click", button_2, () => {
                set(showAddMenu, false);
                store().createQuickUmlNode(get(opt).kind);
              });
              append($$anchor4, button_2);
            });
            var node_11 = sibling(node_10, 6);
            each(node_11, 17, () => UML_SHAPE_GEOMETRIES, (sh) => sh.kind, ($$anchor4, sh) => {
              var button_3 = root_282();
              var span_12 = child(button_3);
              var text_8 = only_child(span_12, true);
              reset(button_3);
              template_effect(() => set_text(text_8, get(sh).label));
              delegated("click", button_3, () => {
                set(showAddMenu, false);
                store().createQuickUmlNode("shape", void 0, void 0, get(sh).kind);
              });
              append($$anchor4, button_3);
            });
            reset(div_3);
            action(div_3, ($$node) => keepDropdownInView?.($$node));
            append($$anchor3, div_3);
          };
          if_block(node_9, ($$render) => {
            if (get(showAddMenu)) $$render(consequent_22);
          });
        }
        reset(div_2);
        bind_this(div_2, ($$value) => set(addDropdownWrapEl, $$value), () => get(addDropdownWrapEl));
        template_effect(() => set_attribute2(button_1, "aria-expanded", get(showAddMenu)));
        delegated("click", button_1, () => {
          set(showAddMenu, !get(showAddMenu));
        });
        append($$anchor2, div_2);
      };
      if_block(node_8, ($$render) => {
        if (store().expectedKind === "uml" && !store().isReadOnly) $$render(consequent_23);
      });
    }
    reset(div_1);
    var div_4 = sibling(div_1, 2);
    var input = child(div_4);
    remove_input_defaults(input);
    reset(div_4);
    var node_12 = sibling(div_4, 2);
    {
      var consequent_25 = ($$anchor2) => {
        var div_5 = root_322();
        var node_13 = child(div_5);
        {
          var consequent_24 = ($$anchor3) => {
            var text_9 = text();
            template_effect(() => set_text(text_9, `No matching elements for "${store().outlineSearchQuery ?? ""}".`));
            append($$anchor3, text_9);
          };
          var d = user_derived(() => store().outlineSearchQuery.trim());
          var alternate_3 = ($$anchor3) => {
            var fragment_8 = root_31();
            next(2);
            append($$anchor3, fragment_8);
          };
          if_block(node_13, ($$render) => {
            if (get(d)) $$render(consequent_24);
            else $$render(alternate_3, -1);
          });
        }
        reset(div_5);
        append($$anchor2, div_5);
      };
      var alternate_4 = ($$anchor2) => {
        var ul = root_342();
        each(ul, 21, () => get(filteredItems), (item) => item.id, ($$anchor3, item) => {
          var li = root_332();
          var node_14 = child(li);
          outlineItemButton(node_14, () => get(item));
          reset(li);
          template_effect(($0) => set_attribute2(li, "aria-selected", $0), [() => store().selectedIds.includes(get(item).id)]);
          append($$anchor3, li);
        });
        reset(ul);
        append($$anchor2, ul);
      };
      if_block(node_12, ($$render) => {
        if (get(filteredItems).length === 0) $$render(consequent_25);
        else $$render(alternate_4, -1);
      });
    }
    reset(section);
    bind_this(section, ($$value) => set(outlineSectionEl, $$value), () => get(outlineSectionEl));
    var div_6 = sibling(section, 2);
    template_effect(() => {
      set_style(section, `height: ${store().elementsPaneRatio * 100}%;`);
      set_text(text_5, `Elements (${get(filteredItems).length ?? ""})`);
    });
    delegated("contextmenu", section, handleExplorerContextMenu);
    bind_value(input, () => store().outlineSearchQuery, ($$value) => store().outlineSearchQuery = $$value);
    delegated("pointerdown", div_6, handleSplitterPointerDown);
    append($$anchor, fragment_6);
    pop();
  }
  delegate(["click", "contextmenu", "pointerdown"]);

  // src/webview/ui/input/Select.svelte
  var root19 = from_html(`<span class="vz-ui-select-check svelte-1ajz7f5" aria-hidden="true">\u2713</span>`);
  var root_114 = from_html(`<button type="button" role="option"><span> </span> <!></button>`);
  var root_210 = from_html(`<div class="vz-ui-select-backdrop svelte-1ajz7f5"></div> <div class="vz-ui-select-menu svelte-1ajz7f5" role="listbox"></div>`, 1);
  var root_39 = from_html(`<div class="vz-ui-select svelte-1ajz7f5" data-vz-select=""><button type="button" aria-haspopup="listbox"><span> </span> <span class="vz-ui-select-chevron svelte-1ajz7f5" aria-hidden="true">\u25BE</span></button> <!></div>`);
  function Select($$anchor, $$props) {
    push($$props, true);
    let placeholder = prop($$props, "placeholder", 3, "Select\u2026"), disabled = prop($$props, "disabled", 3, false);
    let open = state(false);
    let activeIndex = state(-1);
    let triggerEl = state(void 0);
    let menuEl = state(void 0);
    let menuStyle = state("");
    const selectedIndex = user_derived(() => $$props.options.findIndex((option) => option.value === $$props.value));
    const selectedOption = user_derived(() => get(selectedIndex) >= 0 ? $$props.options[get(selectedIndex)] : void 0);
    function updateMenuPosition() {
      if (!get(open) || !get(triggerEl)) return;
      const rect = get(triggerEl).getBoundingClientRect();
      const width = Math.max(rect.width, 140);
      const height = get(menuEl)?.offsetHeight ?? 0;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openAbove = height > 0 && spaceBelow < height + 8 && rect.top > spaceBelow;
      const top = openAbove ? rect.top - height - 3 : rect.bottom + 3;
      const left = Math.min(rect.left, window.innerWidth - width - 8);
      set(menuStyle, `left: ${Math.max(8, left)}px; top: ${Math.max(8, top)}px; width: ${width}px;`);
    }
    user_effect(() => {
      if (!get(open)) return;
      updateMenuPosition();
      const frame = requestAnimationFrame(updateMenuPosition);
      const handleViewportChange = () => updateMenuPosition();
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
      };
    });
    function firstEnabledIndex() {
      const index2 = $$props.options.findIndex((option) => !option.disabled);
      return index2 >= 0 ? index2 : 0;
    }
    function openMenu() {
      if (disabled() || $$props.options.length === 0) return;
      set(open, true);
      set(activeIndex, get(selectedIndex) >= 0 ? get(selectedIndex) : firstEnabledIndex(), true);
    }
    function closeMenu() {
      set(open, false);
    }
    function moveActive(delta) {
      if ($$props.options.length === 0) return;
      let next2 = get(activeIndex);
      for (let step = 0; step < $$props.options.length; step += 1) {
        next2 = (next2 + delta + $$props.options.length) % $$props.options.length;
        if (!$$props.options[next2].disabled) {
          set(activeIndex, next2, true);
          return;
        }
      }
    }
    function selectOption(option) {
      if (!option || option.disabled) return;
      closeMenu();
      if (option.value !== $$props.value) $$props.onchange?.(option.value);
      requestAnimationFrame(() => get(triggerEl)?.focus());
    }
    function handleTriggerKeydown(event2) {
      if (disabled()) return;
      if (!get(open)) {
        if (event2.key === "ArrowDown" || event2.key === "ArrowUp" || event2.key === "Enter" || event2.key === " ") {
          event2.preventDefault();
          openMenu();
        }
        return;
      }
      switch (event2.key) {
        case "ArrowDown":
          event2.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          event2.preventDefault();
          moveActive(-1);
          break;
        case "Home":
          event2.preventDefault();
          set(activeIndex, firstEnabledIndex(), true);
          break;
        case "End":
          event2.preventDefault();
          set(activeIndex, $$props.options.length - 1);
          break;
        case "Enter":
        case " ":
          event2.preventDefault();
          selectOption($$props.options[get(activeIndex)]);
          break;
        case "Escape":
          event2.preventDefault();
          closeMenu();
          break;
        case "Tab":
          closeMenu();
          break;
      }
    }
    var div = root_39();
    var button = child(div);
    let classes;
    var span = child(button);
    let classes_1;
    var text2 = only_child(span, true);
    next(2);
    reset(button);
    bind_this(button, ($$value) => set(triggerEl, $$value), () => get(triggerEl));
    var node = sibling(button, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var fragment = root_210();
        var div_1 = first_child(fragment);
        var div_2 = sibling(div_1, 2);
        each(div_2, 23, () => $$props.options, (option) => option.value, ($$anchor3, option, index2) => {
          var button_1 = root_114();
          let classes_2;
          var span_1 = child(button_1);
          var text_1 = only_child(span_1, true);
          var node_1 = sibling(span_1, 2);
          {
            var consequent = ($$anchor4) => {
              var span_2 = root19();
              append($$anchor4, span_2);
            };
            if_block(node_1, ($$render) => {
              if (get(option).value === $$props.value) $$render(consequent);
            });
          }
          reset(button_1);
          template_effect(() => {
            classes_2 = set_class(button_1, 1, "vz-ui-select-option svelte-1ajz7f5", null, classes_2, {
              highlighted: get(index2) === get(activeIndex),
              active: get(option).value === $$props.value
            });
            set_attribute2(button_1, "aria-selected", get(option).value === $$props.value);
            button_1.disabled = get(option).disabled;
            set_text(text_1, get(option).label);
          });
          event("pointerenter", button_1, () => set(activeIndex, get(index2), true));
          delegated("click", button_1, () => selectOption(get(option)));
          append($$anchor3, button_1);
        });
        reset(div_2);
        bind_this(div_2, ($$value) => set(menuEl, $$value), () => get(menuEl));
        template_effect(() => {
          set_style(div_2, get(menuStyle));
          set_attribute2(div_2, "aria-label", $$props.ariaLabel ?? placeholder());
        });
        delegated("pointerdown", div_1, (event2) => {
          event2.preventDefault();
          closeMenu();
          get(triggerEl)?.focus();
        });
        append($$anchor2, fragment);
      };
      if_block(node, ($$render) => {
        if (get(open)) $$render(consequent_1);
      });
    }
    reset(div);
    template_effect(() => {
      classes = set_class(button, 1, "vz-ui-select-trigger svelte-1ajz7f5", null, classes, { open: get(open) });
      set_attribute2(button, "aria-expanded", get(open));
      set_attribute2(button, "aria-label", $$props.ariaLabel ?? placeholder());
      button.disabled = disabled();
      classes_1 = set_class(span, 1, "svelte-1ajz7f5", null, classes_1, { placeholder: !get(selectedOption) });
      set_text(text2, get(selectedOption)?.label ?? placeholder());
    });
    delegated("click", button, () => get(open) ? closeMenu() : openMenu());
    delegated("keydown", button, handleTriggerKeydown);
    append($$anchor, div);
    pop();
  }
  delegate(["click", "keydown", "pointerdown"]);

  // src/webview/sidebar/inspector/DocumentInspector.svelte
  var root20 = from_html(`<div class="vz-migration-banner vz-compatibility-banner"><div class="vz-migration-header"><span class="vz-migration-title">Compatibility Warning</span></div> <p class="vz-migration-text"> </p> <button type="button" class="vz-btn vz-btn-primary vz-migration-btn">Update</button></div>`);
  var root_115 = from_html(`<div class="vz-migration-banner"><div class="vz-migration-header"><span class="vz-migration-title">Update Available</span></div> <p class="vz-migration-text"> </p> <button type="button" class="vz-btn vz-btn-primary vz-migration-btn">Migrate Document</button></div>`);
  var root_211 = from_html(`<label class="vz-field"><span class="vz-field-label">Title</span> <input type="text" class="vz-input"/></label> <label class="vz-field"><span class="vz-field-label">Description</span> <textarea class="vz-textarea" rows="4" placeholder="Describe the purpose of this architecture model\u2026"></textarea></label> <div class="vz-field"><span class="vz-field-label">Default Routing</span> <!></div>`, 1);
  var root_310 = from_html(`<div class="vz-sidebar-header"><span class="vz-sidebar-title">UML Document</span></div> <div class="vz-inspector-body"><!> <!></div>`, 1);
  function DocumentInspector($$anchor, $$props) {
    push($$props, true);
    const doc = user_derived(() => $$props.store.umlDoc);
    var fragment = root_310();
    var div = sibling(first_child(fragment), 2);
    var node = child(div);
    {
      var consequent = ($$anchor2) => {
        var div_1 = root20();
        var p = sibling(child(div_1), 2);
        var text2 = only_child(p);
        var button = sibling(p, 2);
        reset(div_1);
        template_effect(() => set_text(text2, `This document was created with a newer version of Vizion (${get(doc).version ?? "future" ?? ""}). Please update the extension to ensure full compatibility.`));
        delegated("click", button, () => $$props.store.checkForExtensionUpdate());
        append($$anchor2, div_1);
      };
      var d = user_derived(() => get(doc) && isNewerVersionDocument(get(doc)));
      var consequent_1 = ($$anchor2) => {
        var div_2 = root_115();
        var p_1 = sibling(child(div_2), 2);
        var text_1 = only_child(p_1);
        var button_1 = sibling(p_1, 2);
        reset(div_2);
        template_effect(() => {
          set_text(text_1, `Document version (${get(doc).version ?? "legacy" ?? ""}) does not match the latest rules (${EXTENSION_VERSION ?? ""}).`);
          button_1.disabled = $$props.store.isReadOnly;
        });
        delegated("click", button_1, () => $$props.store.dispatchOperation({ type: "uml.migrateDocument" }));
        append($$anchor2, div_2);
      };
      var d_1 = user_derived(() => get(doc) && isMigrationNeeded(get(doc)));
      if_block(node, ($$render) => {
        if (get(d)) $$render(consequent);
        else if (get(d_1)) $$render(consequent_1, 1);
      });
    }
    var node_1 = sibling(node, 2);
    {
      var consequent_2 = ($$anchor2) => {
        var fragment_1 = root_211();
        var label = first_child(fragment_1);
        var input = sibling(child(label), 2);
        remove_input_defaults(input);
        reset(label);
        var label_1 = sibling(label, 2);
        var textarea = sibling(child(label_1), 2);
        remove_textarea_child(textarea);
        reset(label_1);
        var div_3 = sibling(label_1, 2);
        var node_2 = sibling(child(div_3), 2);
        {
          let $0 = user_derived(() => get(doc).defaultRouting ?? "orthogonal");
          Select(node_2, {
            ariaLabel: "Default Routing",
            get value() {
              return get($0);
            },
            options: [
              { value: "orthogonal", label: "Orthogonal" },
              { value: "straight", label: "Straight" },
              { value: "bezier", label: "Smooth" }
            ],
            get disabled() {
              return $$props.store.isReadOnly;
            },
            onchange: (value) => $$props.store.dispatchOperation({ type: "uml.updateMetadata", defaultRouting: value })
          });
        }
        reset(div_3);
        template_effect(() => {
          set_value(input, get(doc).title);
          input.disabled = $$props.store.isReadOnly;
          set_value(textarea, get(doc).description ?? get(doc).ai?.purpose ?? "");
          textarea.disabled = $$props.store.isReadOnly;
        });
        delegated("change", input, (event2) => $$props.store.dispatchOperation({ type: "uml.updateMetadata", title: event2.currentTarget.value }));
        delegated("change", textarea, (event2) => $$props.store.dispatchOperation({
          type: "uml.updateMetadata",
          description: event2.currentTarget.value
        }));
        append($$anchor2, fragment_1);
      };
      if_block(node_1, ($$render) => {
        if (get(doc)) $$render(consequent_2);
      });
    }
    reset(div);
    append($$anchor, fragment);
    pop();
  }
  delegate(["click", "change"]);

  // src/webview/sidebar/inspector/EdgeInspector.svelte
  var root21 = from_html(`<div class="vz-field"><span class="vz-field-label">Fill</span> <!></div>`);
  var root_116 = from_html(`<div class="vz-inspector-section"><div class="vz-section-divider"></div> <div class="vz-section-header"><span class="vz-field-label"> </span></div> <label class="vz-field"><span class="vz-field-label">Multiplicity (optional)</span> <input type="text" class="vz-input" placeholder="e.g. 1, *, 1..5, 2..*"/></label> <div class="vz-field-grid"><div class="vz-field"><span class="vz-field-label">Shape</span> <!></div> <!></div></div>`);
  var root_212 = from_html(`<div class="vz-sidebar-header"><span class="vz-sidebar-title"> </span></div> <div class="vz-inspector-body"><div class="vz-field"><span class="vz-field-label">Semantic Relation</span> <!></div> <label class="vz-field"><span class="vz-field-label">Label</span> <input type="text" class="vz-input" placeholder="e.g. belongs to, uses"/></label> <button type="button" class="vz-btn">\u21C4 Switch Direction</button> <div class="vz-field-grid"><div class="vz-field"><span class="vz-field-label">Line Style</span> <!></div> <div class="vz-field"><span class="vz-field-label">Routing</span> <!></div></div> <!></div>`, 1);
  function EdgeInspector($$anchor, $$props) {
    push($$props, true);
    let touchesNote = prop($$props, "touchesNote", 3, false);
    const relationPresets = listUmlRelationPresets();
    const endpointShapes = listEndpointShapes();
    const relationOptions = relationPresets.map((preset) => ({ value: preset.kind, label: preset.label }));
    const endpointShapeOptions = endpointShapes.map((shape) => ({ value: shape.kind, label: shape.label }));
    const lineOptions = [
      { value: "solid", label: "Solid" },
      { value: "dashed", label: "Dashed" }
    ];
    const routingOptions = [
      { value: "default", label: "Default" },
      { value: "orthogonal", label: "Orthogonal" },
      { value: "straight", label: "Straight" },
      { value: "bezier", label: "Smooth" }
    ];
    const fillOptions = [
      { value: "hollow", label: "Hollow" },
      { value: "filled", label: "Filled" }
    ];
    var fragment = root_212();
    var div = first_child(fragment);
    var span = child(div);
    var text2 = only_child(span);
    reset(div);
    var div_1 = sibling(div, 2);
    var div_2 = child(div_1);
    var node = sibling(child(div_2), 2);
    Select(node, {
      ariaLabel: "Relation kind",
      get value() {
        return $$props.selectedEdge.kind;
      },
      get options() {
        return relationOptions;
      },
      get disabled() {
        return $$props.store.isReadOnly;
      },
      onchange: (value) => $$props.store.dispatchOperation({
        type: "uml.updateEdge",
        edgeId: $$props.selectedEdge.id,
        kind: value
      })
    });
    reset(div_2);
    var label = sibling(div_2, 2);
    var input = sibling(child(label), 2);
    remove_input_defaults(input);
    reset(label);
    var button = sibling(label, 2);
    var div_3 = sibling(button, 2);
    var div_4 = child(div_3);
    var node_1 = sibling(child(div_4), 2);
    {
      let $0 = user_derived(() => $$props.selectedEdge.visual?.line ?? (touchesNote() ? "dashed" : "solid"));
      Select(node_1, {
        get value() {
          return get($0);
        },
        get options() {
          return lineOptions;
        },
        get disabled() {
          return $$props.store.isReadOnly;
        },
        onchange: (value) => $$props.store.dispatchOperation({
          type: "uml.updateEdge",
          edgeId: $$props.selectedEdge.id,
          line: value
        })
      });
    }
    reset(div_4);
    var div_5 = sibling(div_4, 2);
    var node_2 = sibling(child(div_5), 2);
    {
      let $0 = user_derived(() => $$props.selectedEdge.visual?.routing ?? "default");
      Select(node_2, {
        get value() {
          return get($0);
        },
        get options() {
          return routingOptions;
        },
        get disabled() {
          return $$props.store.isReadOnly;
        },
        onchange: (value) => $$props.store.dispatchOperation({
          type: "uml.updateEdge",
          edgeId: $$props.selectedEdge.id,
          routing: value
        })
      });
    }
    reset(div_5);
    reset(div_3);
    var node_3 = sibling(div_3, 2);
    each(node_3, 16, () => ["start", "end"], index, ($$anchor2, endKey) => {
      const currentDecoration = user_derived(() => $$props.selectedEdge.visual?.[endKey] ?? { shape: "none" });
      const shapeDescriptor = user_derived(() => endpointShapes.find((shape) => shape.kind === get(currentDecoration).shape));
      const currentMultiplicity = user_derived(() => endKey === "start" ? $$props.selectedEdge.source.multiplicity ?? "" : $$props.selectedEdge.target.multiplicity ?? "");
      var div_6 = root_116();
      var div_7 = sibling(child(div_6), 2);
      var span_1 = child(div_7);
      var text_1 = only_child(span_1, true);
      reset(div_7);
      var label_1 = sibling(div_7, 2);
      var input_1 = sibling(child(label_1), 2);
      remove_input_defaults(input_1);
      reset(label_1);
      var div_8 = sibling(label_1, 2);
      var div_9 = child(div_8);
      var node_4 = sibling(child(div_9), 2);
      Select(node_4, {
        get ariaLabel() {
          return `${endKey ?? ""} endpoint shape`;
        },
        get value() {
          return get(currentDecoration).shape;
        },
        get options() {
          return endpointShapeOptions;
        },
        get disabled() {
          return $$props.store.isReadOnly;
        },
        onchange: (value) => $$props.store.dispatchOperation({
          type: "uml.updateEndpoint",
          edgeId: $$props.selectedEdge.id,
          end: endKey,
          decoration: { ...get(currentDecoration), shape: value }
        })
      });
      reset(div_9);
      var node_5 = sibling(div_9, 2);
      {
        var consequent = ($$anchor3) => {
          var div_10 = root21();
          var node_6 = sibling(child(div_10), 2);
          {
            let $0 = user_derived(() => get(currentDecoration).fill ?? get(shapeDescriptor).defaultFill ?? "hollow");
            Select(node_6, {
              get ariaLabel() {
                return `${endKey ?? ""} endpoint fill`;
              },
              get value() {
                return get($0);
              },
              get options() {
                return fillOptions;
              },
              get disabled() {
                return $$props.store.isReadOnly;
              },
              onchange: (value) => $$props.store.dispatchOperation({
                type: "uml.updateEndpoint",
                edgeId: $$props.selectedEdge.id,
                end: endKey,
                decoration: { ...get(currentDecoration), fill: value }
              })
            });
          }
          reset(div_10);
          append($$anchor3, div_10);
        };
        if_block(node_5, ($$render) => {
          if (get(shapeDescriptor)?.supportsFill) $$render(consequent);
        });
      }
      reset(div_8);
      reset(div_6);
      template_effect(() => {
        set_text(text_1, endKey === "start" ? `Start Side (${$$props.selectedEdge.source.nodeId})` : `End Side (${$$props.selectedEdge.target.nodeId})`);
        set_value(input_1, get(currentMultiplicity));
        input_1.disabled = $$props.store.isReadOnly;
      });
      delegated("change", input_1, (event2) => $$props.store.dispatchOperation({
        type: "uml.updateEdge",
        edgeId: $$props.selectedEdge.id,
        ...endKey === "start" ? { sourceMultiplicity: event2.currentTarget.value.trim() } : { targetMultiplicity: event2.currentTarget.value.trim() }
      }));
      append($$anchor2, div_6);
    });
    reset(div_1);
    template_effect(() => {
      set_text(text2, `Relation: ${$$props.selectedEdge.id ?? ""}`);
      set_value(input, $$props.selectedEdge.label ?? "");
      input.disabled = $$props.store.isReadOnly;
      button.disabled = $$props.store.isReadOnly;
      set_attribute2(button, "title", `Switch Direction (${$$props.selectedEdge.target.nodeId} \u2192 ${$$props.selectedEdge.source.nodeId})`);
    });
    delegated("change", input, (event2) => $$props.store.dispatchOperation({
      type: "uml.updateEdge",
      edgeId: $$props.selectedEdge.id,
      label: event2.currentTarget.value
    }));
    delegated("click", button, () => $$props.store.dispatchOperation({
      type: "uml.updateEdge",
      edgeId: $$props.selectedEdge.id,
      reverseDirection: true
    }));
    append($$anchor, fragment);
    pop();
  }
  delegate(["change", "click"]);

  // src/webview/sidebar/inspector/NodeInspector.svelte
  var eyeIcon = ($$anchor, visible = noop) => {
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var svg = root22();
        append($$anchor2, svg);
      };
      var alternate = ($$anchor2) => {
        var svg_1 = root_117();
        append($$anchor2, svg_1);
      };
      if_block(node, ($$render) => {
        if (visible()) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    append($$anchor, fragment);
  };
  var root22 = from_svg(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`);
  var root_117 = from_svg(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`);
  var root_213 = from_html(`<div class="vz-warning-box">Unsupported node kind <code> </code>. Shown in non-destructive read-only fallback mode.</div>`);
  var root_311 = from_html(`<div class="vz-inspector-section"><div class="vz-section-divider"></div> <div class="vz-section-header"><span class="vz-field-label">Note Text</span></div> <textarea class="vz-textarea" rows="6" placeholder="Write architecture notes, constraints, or implementation guidance\u2026"></textarea></div>`);
  var root_48 = from_html(`<div class="vz-field"><span class="vz-field-label">Shape Geometry</span> <!></div>`);
  var root_56 = from_html(`<div class="vz-field"><span class="vz-field-label">Frame Border</span> <!></div>`);
  var root_65 = from_html(`<textarea class="vz-textarea vz-inspector-members-textarea" data-field="inspector-attributes" aria-label="Attributes" placeholder="+ name: type\\n- secret: number"></textarea>`);
  var root_75 = from_html(`<textarea class="vz-textarea vz-inspector-members-textarea" data-field="inspector-operations" aria-label="Operations" placeholder="+ method(a: string): void\\n- helper(): boolean"></textarea>`);
  var root_83 = from_html(`<label class="vz-field"><span class="vz-field-label">Stereotype</span> <input type="text" class="vz-input" placeholder="e.g. entity, service, aggregate"/></label> <div class="vz-inspector-section"><div class="vz-section-divider"></div> <div class="vz-section-header"><span class="vz-field-label">Attributes</span> <button type="button"><!></button></div> <!></div> <div class="vz-inspector-section"><div class="vz-section-divider"></div> <div class="vz-section-header"><span class="vz-field-label">Operations</span> <button type="button"><!></button></div> <!></div>`, 1);
  var root_93 = from_html(`<label class="vz-field"><span class="vz-field-label">Name</span> <input type="text" class="vz-input"/></label> <!>`, 1);
  var root_103 = from_html(`<div class="vz-sidebar-header"><span class="vz-sidebar-title"> </span></div> <div class="vz-inspector-body"><!></div>`, 1);
  function NodeInspector($$anchor, $$props) {
    push($$props, true);
    const nodeDesc = user_derived(() => getUmlNodeKind($$props.selectedNode.kind));
    const shapeOptions = UML_SHAPE_GEOMETRIES.map((shape) => ({ value: shape.kind, label: shape.label }));
    const frameBorderOptions = [
      { value: "solid", label: "Solid" },
      { value: "dashed", label: "Dashed" }
    ];
    const attrsVisible = user_derived(() => $$props.selectedNode.showAttributes !== false);
    const opsVisible = user_derived(() => $$props.selectedNode.showOperations !== false);
    let inspectorAttributesDraft = state("");
    let inspectorOperationsDraft = state("");
    user_effect(() => {
      const activeEl = typeof document !== "undefined" ? document.activeElement : null;
      const isEditingAttrs = activeEl?.getAttribute("data-field") === "inspector-attributes";
      const isEditingOps = activeEl?.getAttribute("data-field") === "inspector-operations";
      if (!isEditingAttrs) set(inspectorAttributesDraft, formatAttributesToText($$props.selectedNode.attributes ?? []), true);
      if (!isEditingOps) set(inspectorOperationsDraft, formatOperationsToText($$props.selectedNode.operations ?? []), true);
    });
    function flushInspectorAttributes() {
      if ($$props.selectedNode.kind === "note" || $$props.selectedNode.kind === "shape" || $$props.selectedNode.kind === "frame") return;
      const nextAttrs = parseAttributesFromText(get(inspectorAttributesDraft), $$props.selectedNode.id, $$props.selectedNode.attributes ?? []);
      const currentAttrs = $$props.selectedNode.attributes ?? [];
      const changed = nextAttrs.length !== currentAttrs.length || nextAttrs.some((attribute, index2) => {
        const current = currentAttrs[index2];
        return !current || attribute.name !== current.name || (attribute.type ?? "") !== (current.type ?? "") || (attribute.visibility ?? "+") !== (current.visibility ?? "+");
      });
      if (changed) {
        $$props.store.dispatchOperation({
          type: "uml.updateNode",
          nodeId: $$props.selectedNode.id,
          attributes: nextAttrs
        });
      }
    }
    function flushInspectorOperations() {
      if ($$props.selectedNode.kind === "note" || $$props.selectedNode.kind === "shape" || $$props.selectedNode.kind === "frame") return;
      const nextOps = parseOperationsFromText(get(inspectorOperationsDraft), $$props.selectedNode.id, $$props.selectedNode.operations ?? []);
      const currentOps = $$props.selectedNode.operations ?? [];
      const changed = nextOps.length !== currentOps.length || nextOps.some((operation, index2) => {
        const current = currentOps[index2];
        return !current || operation.name !== current.name || (operation.returnType ?? "") !== (current.returnType ?? "") || (operation.visibility ?? "+") !== (current.visibility ?? "+") || (operation.signature ?? "()") !== (current.signature ?? "()");
      });
      if (changed) {
        $$props.store.dispatchOperation({
          type: "uml.updateNode",
          nodeId: $$props.selectedNode.id,
          operations: nextOps
        });
      }
    }
    var fragment_1 = root_103();
    var div = first_child(fragment_1);
    var span = child(div);
    var text2 = only_child(span);
    reset(div);
    var div_1 = sibling(div, 2);
    var node_1 = child(div_1);
    {
      var consequent_1 = ($$anchor2) => {
        var div_2 = root_213();
        var code = sibling(child(div_2));
        var text_1 = only_child(code, true);
        next();
        reset(div_2);
        template_effect(() => set_text(text_1, $$props.selectedNode.kind));
        append($$anchor2, div_2);
      };
      var alternate_2 = ($$anchor2) => {
        var fragment_2 = root_93();
        var label = first_child(fragment_2);
        var input = sibling(child(label), 2);
        remove_input_defaults(input);
        reset(label);
        var node_2 = sibling(label, 2);
        {
          var consequent_2 = ($$anchor3) => {
            var div_3 = root_311();
            var textarea = sibling(child(div_3), 4);
            remove_textarea_child(textarea);
            reset(div_3);
            template_effect(() => {
              set_value(textarea, $$props.selectedNode.text ?? "");
              textarea.disabled = $$props.store.isReadOnly;
            });
            delegated("change", textarea, (event2) => $$props.store.dispatchOperation({
              type: "uml.updateNode",
              nodeId: $$props.selectedNode.id,
              text: event2.currentTarget.value
            }));
            append($$anchor3, div_3);
          };
          var consequent_3 = ($$anchor3) => {
            var div_4 = root_48();
            var node_3 = sibling(child(div_4), 2);
            {
              let $0 = user_derived(() => $$props.selectedNode.shape ?? "rectangle");
              Select(node_3, {
                get value() {
                  return get($0);
                },
                get options() {
                  return shapeOptions;
                },
                get disabled() {
                  return $$props.store.isReadOnly;
                },
                onchange: (value) => $$props.store.dispatchOperation({
                  type: "uml.updateNode",
                  nodeId: $$props.selectedNode.id,
                  shape: value
                })
              });
            }
            reset(div_4);
            append($$anchor3, div_4);
          };
          var consequent_4 = ($$anchor3) => {
            var div_5 = root_56();
            var node_4 = sibling(child(div_5), 2);
            {
              let $0 = user_derived(() => $$props.selectedNode.line ?? "solid");
              Select(node_4, {
                get value() {
                  return get($0);
                },
                get options() {
                  return frameBorderOptions;
                },
                get disabled() {
                  return $$props.store.isReadOnly;
                },
                onchange: (value) => $$props.store.dispatchOperation({
                  type: "uml.updateNode",
                  nodeId: $$props.selectedNode.id,
                  line: value
                })
              });
            }
            reset(div_5);
            append($$anchor3, div_5);
          };
          var alternate_1 = ($$anchor3) => {
            var fragment_3 = root_83();
            var label_1 = first_child(fragment_3);
            var input_1 = sibling(child(label_1), 2);
            remove_input_defaults(input_1);
            reset(label_1);
            var div_6 = sibling(label_1, 2);
            var div_7 = sibling(child(div_6), 2);
            var button = sibling(child(div_7), 2);
            let classes;
            var node_5 = child(button);
            eyeIcon(node_5, () => get(attrsVisible));
            reset(button);
            reset(div_7);
            var node_6 = sibling(div_7, 2);
            {
              var consequent_5 = ($$anchor4) => {
                var textarea_1 = root_65();
                remove_textarea_child(textarea_1);
                template_effect(
                  ($0) => {
                    set_attribute2(textarea_1, "rows", $0);
                    textarea_1.disabled = $$props.store.isReadOnly;
                  },
                  [
                    () => Math.max(4, get(inspectorAttributesDraft).split("\n").length || 1)
                  ]
                );
                event("blur", textarea_1, flushInspectorAttributes);
                delegated("change", textarea_1, flushInspectorAttributes);
                bind_value(textarea_1, () => get(inspectorAttributesDraft), ($$value) => set(inspectorAttributesDraft, $$value));
                append($$anchor4, textarea_1);
              };
              if_block(node_6, ($$render) => {
                if (get(attrsVisible)) $$render(consequent_5);
              });
            }
            reset(div_6);
            var div_8 = sibling(div_6, 2);
            var div_9 = sibling(child(div_8), 2);
            var button_1 = sibling(child(div_9), 2);
            let classes_1;
            var node_7 = child(button_1);
            eyeIcon(node_7, () => get(opsVisible));
            reset(button_1);
            reset(div_9);
            var node_8 = sibling(div_9, 2);
            {
              var consequent_6 = ($$anchor4) => {
                var textarea_2 = root_75();
                remove_textarea_child(textarea_2);
                template_effect(
                  ($0) => {
                    set_attribute2(textarea_2, "rows", $0);
                    textarea_2.disabled = $$props.store.isReadOnly;
                  },
                  [
                    () => Math.max(4, get(inspectorOperationsDraft).split("\n").length || 1)
                  ]
                );
                event("blur", textarea_2, flushInspectorOperations);
                delegated("change", textarea_2, flushInspectorOperations);
                bind_value(textarea_2, () => get(inspectorOperationsDraft), ($$value) => set(inspectorOperationsDraft, $$value));
                append($$anchor4, textarea_2);
              };
              if_block(node_8, ($$render) => {
                if (get(opsVisible)) $$render(consequent_6);
              });
            }
            reset(div_8);
            template_effect(() => {
              set_value(input_1, $$props.selectedNode.stereotype ?? "");
              input_1.disabled = $$props.store.isReadOnly;
              classes = set_class(button, 1, "vz-eye-toggle-btn compact", null, classes, { off: !get(attrsVisible) });
              set_attribute2(button, "title", get(attrsVisible) ? "Hide Attributes section on node" : "Show Attributes section on node");
              set_attribute2(button, "aria-label", get(attrsVisible) ? "Hide Attributes section" : "Show Attributes section");
              button.disabled = $$props.store.isReadOnly;
              classes_1 = set_class(button_1, 1, "vz-eye-toggle-btn compact", null, classes_1, { off: !get(opsVisible) });
              set_attribute2(button_1, "title", get(opsVisible) ? "Hide Operations section on node" : "Show Operations section on node");
              set_attribute2(button_1, "aria-label", get(opsVisible) ? "Hide Operations section" : "Show Operations section");
              button_1.disabled = $$props.store.isReadOnly;
            });
            delegated("change", input_1, (event2) => $$props.store.dispatchOperation({
              type: "uml.updateNode",
              nodeId: $$props.selectedNode.id,
              stereotype: event2.currentTarget.value
            }));
            delegated("click", button, () => $$props.store.dispatchOperation({
              type: "uml.updateNode",
              nodeId: $$props.selectedNode.id,
              showAttributes: !get(attrsVisible)
            }));
            delegated("click", button_1, () => $$props.store.dispatchOperation({
              type: "uml.updateNode",
              nodeId: $$props.selectedNode.id,
              showOperations: !get(opsVisible)
            }));
            append($$anchor3, fragment_3);
          };
          if_block(node_2, ($$render) => {
            if ($$props.selectedNode.kind === "note") $$render(consequent_2);
            else if ($$props.selectedNode.kind === "shape") $$render(consequent_3, 1);
            else if ($$props.selectedNode.kind === "frame") $$render(consequent_4, 2);
            else $$render(alternate_1, -1);
          });
        }
        template_effect(() => {
          set_value(input, $$props.selectedNode.name);
          input.disabled = $$props.store.isReadOnly;
        });
        delegated("change", input, (event2) => $$props.store.dispatchOperation({
          type: "uml.updateNode",
          nodeId: $$props.selectedNode.id,
          name: event2.currentTarget.value
        }));
        append($$anchor2, fragment_2);
      };
      if_block(node_1, ($$render) => {
        if (!get(nodeDesc)) $$render(consequent_1);
        else $$render(alternate_2, -1);
      });
    }
    reset(div_1);
    template_effect(() => set_text(text2, `${get(nodeDesc)?.label ?? $$props.selectedNode.kind ?? ""}: ${$$props.selectedNode.name ?? ""}`));
    append($$anchor, fragment_1);
    pop();
  }
  delegate(["change", "click"]);

  // src/webview/sidebar/inspector/InspectorPane.svelte
  var root23 = from_html(`<div class="vz-inspector-pane"><!></div>`);
  function InspectorPane($$anchor, $$props) {
    push($$props, true);
    const selectedNode = user_derived(() => $$props.store.umlDoc?.nodes.find((node) => $$props.store.selectedIds.includes(node.id)));
    const selectedEdge = user_derived(() => $$props.store.umlDoc?.edges.find((edge) => $$props.store.selectedIds.includes(edge.id)));
    const selectedEdgeTouchesNote = user_derived(() => {
      if (!get(selectedEdge) || !$$props.store.umlDoc) return false;
      const source2 = $$props.store.umlDoc.nodes.find((node) => node.id === get(selectedEdge).source.nodeId);
      const target2 = $$props.store.umlDoc.nodes.find((node) => node.id === get(selectedEdge).target.nodeId);
      return source2?.kind === "note" || target2?.kind === "note";
    });
    var div = root23();
    var node_1 = child(div);
    {
      var consequent = ($$anchor2) => {
        NodeInspector($$anchor2, {
          get store() {
            return $$props.store;
          },
          get selectedNode() {
            return get(selectedNode);
          }
        });
      };
      var consequent_1 = ($$anchor2) => {
        EdgeInspector($$anchor2, {
          get store() {
            return $$props.store;
          },
          get selectedEdge() {
            return get(selectedEdge);
          },
          get touchesNote() {
            return get(selectedEdgeTouchesNote);
          }
        });
      };
      var alternate = ($$anchor2) => {
        DocumentInspector($$anchor2, {
          get store() {
            return $$props.store;
          }
        });
      };
      if_block(node_1, ($$render) => {
        if (get(selectedNode)) $$render(consequent);
        else if (get(selectedEdge)) $$render(consequent_1, 1);
        else $$render(alternate, -1);
      });
    }
    reset(div);
    delegated("contextmenu", div, (event2) => {
      const target2 = event2.target;
      if (target2?.closest('input, textarea, select, [contenteditable="true"], [data-vz-select]')) return;
      event2.preventDefault();
      event2.stopPropagation();
    });
    append($$anchor, div);
    pop();
  }
  delegate(["contextmenu"]);

  // src/webview/sidebar/SidebarContainer.svelte
  var root24 = from_html(`<!> <aside class="vz-sidebar vz-inspector" aria-label="UML Property Inspector"><!> <!></aside>`, 1);
  function SidebarContainer($$anchor, $$props) {
    push($$props, true);
    var fragment = root24();
    var node = first_child(fragment);
    Splitter(node, {
      orientation: "vertical",
      label: "Resize sidebar width",
      onresize: (delta) => $$props.store.setSidebarWidth($$props.store.sidebarWidth - delta)
    });
    var aside = sibling(node, 2);
    var node_1 = child(aside);
    ElementsOutline(node_1, {
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
    var node_2 = sibling(node_1, 2);
    InspectorPane(node_2, {
      get store() {
        return $$props.store;
      }
    });
    reset(aside);
    template_effect(() => set_style(aside, `width: ${$$props.store.sidebarWidth ?? ""}px;`));
    append($$anchor, fragment);
    pop();
  }

  // src/webview/services/selection-actions.ts
  function deleteSelection(store) {
    if (store.isReadOnly || store.selectedIds.length === 0) return;
    const doc = store.umlDoc;
    if (!doc) return;
    const nodeIds = doc.nodes.filter((node) => store.selectedIds.includes(node.id)).map((node) => node.id);
    const edgeIds = doc.edges.filter((edge) => store.selectedIds.includes(edge.id)).map((edge) => edge.id);
    if (nodeIds.length === 0 && edgeIds.length === 0) return;
    store.dispatchOperation({ type: "uml.deleteEntities", nodeIds, edgeIds });
    store.clearSelection();
  }
  function duplicateSelection(store) {
    if (store.isReadOnly || store.selectedIds.length === 0) return;
    const doc = store.umlDoc;
    if (!doc) return;
    const nodeIds = doc.nodes.filter((node) => store.selectedIds.includes(node.id)).map((node) => node.id);
    const edgeIds = doc.edges.filter((edge) => store.selectedIds.includes(edge.id)).map((edge) => edge.id);
    if (nodeIds.length === 0 && edgeIds.length === 0) return;
    store.dispatchOperation({
      type: "uml.duplicateSelection",
      nodeIds,
      edgeIds,
      offsetX: 20,
      offsetY: 20
    });
  }

  // src/webview/ui/button/IconButton.svelte
  var root25 = from_html(`<button type="button"><!></button>`);
  function IconButton($$anchor, $$props) {
    push($$props, true);
    let disabled = prop($$props, "disabled", 3, false), active = prop($$props, "active", 3, false), danger = prop($$props, "danger", 3, false);
    var button = root25();
    let classes;
    var node = child(button);
    snippet(node, () => $$props.children ?? noop);
    reset(button);
    template_effect(() => {
      classes = set_class(button, 1, "vz-ui-icon-button svelte-1tg8wim", null, classes, { active: active(), danger: danger() });
      set_attribute2(button, "title", $$props.title);
      set_attribute2(button, "aria-label", $$props.ariaLabel ?? $$props.title);
      set_attribute2(button, "aria-pressed", active());
      button.disabled = disabled();
    });
    delegated("click", button, (event2) => $$props.onclick?.(event2));
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);

  // src/webview/ui/layout/Banner.svelte
  var root26 = from_html(`<div aria-live="polite"><span class="message svelte-ywv8i3"><!></span> <!></div>`);
  function Banner($$anchor, $$props) {
    push($$props, true);
    let severity = prop($$props, "severity", 3, "info"), dismissible = prop($$props, "dismissible", 3, true);
    var div = root26();
    var span = child(div);
    var node = child(span);
    {
      var consequent = ($$anchor2) => {
        var fragment = comment();
        var node_1 = first_child(fragment);
        snippet(node_1, () => $$props.children);
        append($$anchor2, fragment);
      };
      var alternate = ($$anchor2) => {
        var text2 = text();
        template_effect(() => set_text(text2, $$props.message));
        append($$anchor2, text2);
      };
      if_block(node, ($$render) => {
        if ($$props.children) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    reset(span);
    var node_2 = sibling(span, 2);
    {
      var consequent_1 = ($$anchor2) => {
        IconButton($$anchor2, {
          title: "Dismiss notification",
          onclick: () => $$props.ondismiss?.(),
          children: ($$anchor3, $$slotProps) => {
            next();
            var text_1 = text("\xD7");
            append($$anchor3, text_1);
          },
          $$slots: { default: true }
        });
      };
      if_block(node_2, ($$render) => {
        if (dismissible()) $$render(consequent_1);
      });
    }
    reset(div);
    template_effect(() => {
      set_class(div, 1, `vz-ui-banner ${severity() ?? ""}`, "svelte-ywv8i3");
      set_attribute2(div, "role", severity() === "error" ? "alert" : "status");
    });
    append($$anchor, div);
    pop();
  }

  // src/webview/ui/layout/ReadonlyBar.svelte
  var root27 = from_html(`<div class="vz-ui-readonly svelte-x7cjs" role="note"><span aria-hidden="true">\u{1F512}</span> <span> </span></div>`);
  function ReadonlyBar($$anchor, $$props) {
    let message = prop($$props, "message", 3, "Read-Only Mode (Non-file URI or untrusted document)");
    var div = root27();
    var span = sibling(child(div), 2);
    var text2 = only_child(span, true);
    reset(div);
    template_effect(() => set_text(text2, message()));
    append($$anchor, div);
  }

  // src/webview/App.svelte
  var root28 = from_html(`<div class="vz-main-split"><!> <!></div>`);
  var root_118 = from_html(`<main class="vz-root" aria-label="Vizion Visual Architecture Editor"><!> <!> <!> <!> <!></main>`);
  function App($$anchor, $$props) {
    push($$props, true);
    let initialKind2 = prop($$props, "initialKind", 3, "uml");
    const store = new VizionWebviewStore(initialKind2());
    var main = root_118();
    var node = child(main);
    {
      var consequent = ($$anchor2) => {
        Banner($$anchor2, {
          severity: "warning",
          get message() {
            return store.staleNotice;
          },
          ondismiss: () => store.setStaleNotice(null)
        });
      };
      if_block(node, ($$render) => {
        if (store.staleNotice) $$render(consequent);
      });
    }
    var node_1 = sibling(node, 2);
    {
      var consequent_1 = ($$anchor2) => {
        Banner($$anchor2, {
          get message() {
            return store.statusMessage;
          },
          ondismiss: () => store.setStatusMessage(null)
        });
      };
      if_block(node_1, ($$render) => {
        if (store.statusMessage) $$render(consequent_1);
      });
    }
    var node_2 = sibling(node_1, 2);
    {
      var consequent_2 = ($$anchor2) => {
        ReadonlyBar($$anchor2, {});
      };
      if_block(node_2, ($$render) => {
        if (store.isReadOnly) $$render(consequent_2);
      });
    }
    var node_3 = sibling(node_2, 2);
    {
      var consequent_3 = ($$anchor2) => {
        ErrorView($$anchor2, {
          get store() {
            return store;
          }
        });
      };
      var alternate = ($$anchor2) => {
        var div = root28();
        var node_4 = child(div);
        CanvasViewport(node_4, {
          get store() {
            return store;
          }
        });
        var node_5 = sibling(node_4, 2);
        SidebarContainer(node_5, {
          get store() {
            return store;
          },
          onDeleteSelected: () => deleteSelection(store),
          onDuplicateSelected: () => duplicateSelection(store)
        });
        reset(div);
        append($$anchor2, div);
      };
      if_block(node_3, ($$render) => {
        if (!store.valid) $$render(consequent_3);
        else $$render(alternate, -1);
      });
    }
    var node_6 = sibling(node_3, 2);
    ContextMenu(node_6, {
      get store() {
        return store;
      }
    });
    reset(main);
    append($$anchor, main);
    pop();
  }

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
