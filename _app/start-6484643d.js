var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, c as claim_element, a as children, d as detach, b as attr, f as set_style, g as insert_hydration, t as text, h as claim_text, j as set_data, k as space, l as empty, m as claim_space, n as group_outros, o as transition_out, p as check_outros, q as transition_in, r as setContext, u as afterUpdate, v as onMount, w as create_component, x as claim_component, y as mount_component, z as get_spread_update, A as get_spread_object, B as destroy_component, C as assign, D as writable, E as tick } from "./chunks/vendor-ec34ed73.js";
let base$1 = "";
let assets = "";
function set_paths(paths) {
  base$1 = paths.base;
  assets = paths.assets || base$1;
}
function create_else_block_1(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [ctx[1] || {}];
  var switch_value = ctx[0][0];
  function switch_props(ctx2) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props());
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
      const switch_instance_changes = dirty & 2 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(ctx2[1] || {})]) : {};
      if (switch_value !== (switch_value = ctx2[0][0])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = new switch_value(switch_props());
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
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [ctx[1] || {}];
  var switch_value = ctx[0][0];
  function switch_props(ctx2) {
    let switch_instance_props = {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx: ctx2 }
    };
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props(ctx));
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
      const switch_instance_changes = dirty & 2 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(ctx2[1] || {})]) : {};
      if (dirty & 525) {
        switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (switch_value !== (switch_value = ctx2[0][0])) {
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
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_else_block(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [ctx[2] || {}];
  var switch_value = ctx[0][1];
  function switch_props(ctx2) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props());
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
      const switch_instance_changes = dirty & 4 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(ctx2[2] || {})]) : {};
      if (switch_value !== (switch_value = ctx2[0][1])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = new switch_value(switch_props());
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
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_if_block_3(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [ctx[2] || {}];
  var switch_value = ctx[0][1];
  function switch_props(ctx2) {
    let switch_instance_props = {
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx: ctx2 }
    };
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props(ctx));
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
      const switch_instance_changes = dirty & 4 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(ctx2[2] || {})]) : {};
      if (dirty & 521) {
        switch_instance_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (switch_value !== (switch_value = ctx2[0][1])) {
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
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_default_slot_1(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [ctx[3] || {}];
  var switch_value = ctx[0][2];
  function switch_props(ctx2) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = new switch_value(switch_props());
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
      const switch_instance_changes = dirty & 8 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(ctx2[3] || {})]) : {};
      if (switch_value !== (switch_value = ctx2[0][2])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = new switch_value(switch_props());
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
      if (detaching)
        detach(switch_instance_anchor);
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_3, create_else_block];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[0][2])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_1(ctx);
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
    p(ctx2, dirty) {
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
function create_if_block(ctx) {
  let div;
  let if_block = ctx[5] && create_if_block_1(ctx);
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", {
        id: true,
        "aria-live": true,
        "aria-atomic": true,
        style: true
      });
      var div_nodes = children(div);
      if (if_block)
        if_block.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "id", "svelte-announcer");
      attr(div, "aria-live", "assertive");
      attr(div, "aria-atomic", "true");
      set_style(div, "position", "absolute");
      set_style(div, "left", "0");
      set_style(div, "top", "0");
      set_style(div, "clip", "rect(0 0 0 0)");
      set_style(div, "clip-path", "inset(50%)");
      set_style(div, "overflow", "hidden");
      set_style(div, "white-space", "nowrap");
      set_style(div, "width", "1px");
      set_style(div, "height", "1px");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (if_block)
        if_block.m(div, null);
    },
    p(ctx2, dirty) {
      if (ctx2[5]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_1(ctx2);
          if_block.c();
          if_block.m(div, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
    }
  };
}
function create_if_block_1(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[6]);
    },
    l(nodes) {
      t = claim_text(nodes, ctx[6]);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 64)
        set_data(t, ctx2[6]);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_fragment(ctx) {
  let current_block_type_index;
  let if_block0;
  let t;
  let if_block1_anchor;
  let current;
  const if_block_creators = [create_if_block_2, create_else_block_1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[0][1])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let if_block1 = ctx[4] && create_if_block(ctx);
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
        if_block0 = if_blocks[current_block_type_index];
        if (!if_block0) {
          if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block0.c();
        } else {
          if_block0.p(ctx2, dirty);
        }
        transition_in(if_block0, 1);
        if_block0.m(t.parentNode, t);
      }
      if (ctx2[4]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block(ctx2);
          if_block1.c();
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
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
function instance($$self, $$props, $$invalidate) {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        $$invalidate(5, navigated = true);
        $$invalidate(6, title = document.title || "untitled page");
      }
    });
    $$invalidate(4, mounted = true);
    return unsubscribe;
  });
  $$self.$$set = ($$props2) => {
    if ("stores" in $$props2)
      $$invalidate(7, stores = $$props2.stores);
    if ("page" in $$props2)
      $$invalidate(8, page = $$props2.page);
    if ("components" in $$props2)
      $$invalidate(0, components = $$props2.components);
    if ("props_0" in $$props2)
      $$invalidate(1, props_0 = $$props2.props_0);
    if ("props_1" in $$props2)
      $$invalidate(2, props_1 = $$props2.props_1);
    if ("props_2" in $$props2)
      $$invalidate(3, props_2 = $$props2.props_2);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 384) {
      stores.page.set(page);
    }
  };
  return [components, props_0, props_1, props_2, mounted, navigated, title, stores, page];
}
class Root extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {
      stores: 7,
      page: 8,
      components: 0,
      props_0: 1,
      props_1: 2,
      props_2: 3
    });
  }
}
const scriptRel = "modulepreload";
const seen = {};
const base = "/svelte-weather-app/_app/";
const __vitePreload = function preload(baseModule, deps) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = `${base}${dep}`;
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
const c = [
  () => __vitePreload(() => import("./pages/__layout.svelte-d7adc798.js"), true ? ["pages/__layout.svelte-d7adc798.js","chunks/vendor-ec34ed73.js","pages/current.svelte-5ad3a2bf.js","chunks/weather-7c57c533.js","pages/forecast.svelte-978f51f4.js"] : void 0),
  () => __vitePreload(() => import("./error.svelte-4e0f4371.js"), true ? ["error.svelte-4e0f4371.js","chunks/vendor-ec34ed73.js"] : void 0),
  () => __vitePreload(() => import("./pages/index.svelte-c364d9d5.js"), true ? ["pages/index.svelte-c364d9d5.js","chunks/vendor-ec34ed73.js"] : void 0),
  () => __vitePreload(() => import("./pages/forecast.svelte-978f51f4.js"), true ? ["pages/forecast.svelte-978f51f4.js","chunks/vendor-ec34ed73.js","chunks/weather-7c57c533.js"] : void 0),
  () => __vitePreload(() => import("./pages/current.svelte-5ad3a2bf.js"), true ? ["pages/current.svelte-5ad3a2bf.js","chunks/vendor-ec34ed73.js","chunks/weather-7c57c533.js"] : void 0)
];
const routes = [
  [/^\/$/, [c[0], c[2]], [c[1]]],
  [/^\/forecast\/?$/, [c[0], c[3]], [c[1]]],
  [/^\/current\/?$/, [c[0], c[4]], [c[1]]]
];
const fallback = [c[0](), c[1]()];
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error };
    }
    return { status, error };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && /\/[^./]+$/.test(path)) {
    return path + "/";
  }
  return path;
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
function get_base_uri(doc) {
  let baseURI = doc.baseURI;
  if (!baseURI) {
    const baseTags = doc.getElementsByTagName("base");
    baseURI = baseTags.length ? baseTags[0].href : doc.URL;
  }
  return baseURI;
}
function scroll_state() {
  return {
    x: pageXOffset,
    y: pageYOffset
  };
}
function find_anchor(event) {
  const node = event.composedPath().find((e) => e instanceof Node && e.nodeName.toUpperCase() === "A");
  return node;
}
function get_href(node) {
  return node instanceof SVGAElement ? new URL(node.href.baseVal, document.baseURI) : new URL(node.href);
}
function notifiable_store(value) {
  const store = writable(value);
  let ready = true;
  function notify() {
    ready = true;
    store.update((val) => val);
  }
  function set(new_value) {
    ready = false;
    store.set(new_value);
  }
  function subscribe(run) {
    let old_value;
    return store.subscribe((new_value) => {
      if (old_value === void 0 || ready && new_value !== old_value) {
        run(old_value = new_value);
      }
    });
  }
  return { notify, set, subscribe };
}
function create_updated_store() {
  const { set, subscribe } = writable(false);
  const initial = "1647661018281";
  let timeout;
  async function check() {
    clearTimeout(timeout);
    const file = "_app/version.json";
    const res = await fetch(`${assets}/${file}`, {
      headers: {
        pragma: "no-cache",
        "cache-control": "no-cache"
      }
    });
    if (res.ok) {
      const { version } = await res.json();
      const updated = version !== initial;
      if (updated) {
        set(true);
        clearTimeout(timeout);
      }
      return updated;
    } else {
      throw new Error(`Version check failed: ${res.status}`);
    }
  }
  return {
    subscribe,
    check
  };
}
function initial_fetch(resource, opts) {
  const url = JSON.stringify(typeof resource === "string" ? resource : resource.url);
  let selector = `script[sveltekit\\:data-type="data"][sveltekit\\:data-url=${url}]`;
  if (opts && typeof opts.body === "string") {
    selector += `[sveltekit\\:data-body="${hash(opts.body)}"]`;
  }
  const script = document.querySelector(selector);
  if (script && script.textContent) {
    const _a = JSON.parse(script.textContent), { body } = _a, init2 = __objRest(_a, ["body"]);
    return Promise.resolve(new Response(body, init2));
  }
  return fetch(resource, opts);
}
const SCROLL_KEY = "sveltekit:scroll";
const INDEX_KEY = "sveltekit:index";
let scroll_positions = {};
try {
  scroll_positions = JSON.parse(sessionStorage[SCROLL_KEY]);
} catch {
}
function update_scroll_positions(index) {
  scroll_positions[index] = scroll_state();
}
function create_client({ target, session, base: base2, trailing_slash }) {
  var _a, _b;
  const cache = /* @__PURE__ */ new Map();
  const invalidated = /* @__PURE__ */ new Set();
  const stores = {
    url: notifiable_store({}),
    page: notifiable_store({}),
    navigating: writable(null),
    session: writable(session),
    updated: create_updated_store()
  };
  const load_cache = {
    id: null,
    promise: null
  };
  const callbacks = {
    before_navigate: [],
    after_navigate: []
  };
  let current = {
    url: null,
    session_id: 0,
    branch: []
  };
  let started = false;
  let autoscroll = true;
  let updating = false;
  let session_id = 1;
  let invalidating = null;
  let root;
  let $session;
  let ready = false;
  stores.session.subscribe(async (value) => {
    $session = value;
    if (!ready)
      return;
    session_id += 1;
    const intent = get_navigation_intent(new URL(location.href));
    update(intent, [], true);
  });
  ready = true;
  let navigating = 0;
  let router_enabled = true;
  let current_history_index = (_b = (_a = history.state) == null ? void 0 : _a[INDEX_KEY]) != null ? _b : 0;
  if (current_history_index === 0) {
    history.replaceState(__spreadProps(__spreadValues({}, history.state), { [INDEX_KEY]: 0 }), "", location.href);
  }
  const scroll = scroll_positions[current_history_index];
  if (scroll)
    scrollTo(scroll.x, scroll.y);
  let hash_navigating = false;
  let page;
  let token;
  let navigating_token;
  async function goto(href, { noscroll = false, replaceState = false, keepfocus = false, state = {} }, redirect_chain) {
    const url = new URL(href, get_base_uri(document));
    if (router_enabled) {
      return navigate({
        url,
        scroll: noscroll ? scroll_state() : null,
        keepfocus,
        redirect_chain,
        details: {
          state,
          replaceState
        },
        accepted: () => {
        },
        blocked: () => {
        }
      });
    }
    await native_navigation(url);
  }
  async function prefetch(url) {
    if (!owns(url)) {
      throw new Error("Attempted to prefetch a URL that does not belong to this app");
    }
    const intent = get_navigation_intent(url);
    load_cache.promise = get_navigation_result(intent, false);
    load_cache.id = intent.id;
    return load_cache.promise;
  }
  async function update(intent, redirect_chain, no_cache, opts) {
    var _a2, _b2, _c;
    const current_token = token = {};
    let navigation_result = await get_navigation_result(intent, no_cache);
    if (!navigation_result && intent.url.pathname === location.pathname) {
      navigation_result = await load_root_error_page({
        status: 404,
        error: new Error(`Not found: ${intent.url.pathname}`),
        url: intent.url
      });
    }
    if (!navigation_result) {
      await native_navigation(intent.url);
      return;
    }
    if (token !== current_token)
      return;
    invalidated.clear();
    if (navigation_result.redirect) {
      if (redirect_chain.length > 10 || redirect_chain.includes(intent.url.pathname)) {
        navigation_result = await load_root_error_page({
          status: 500,
          error: new Error("Redirect loop"),
          url: intent.url
        });
      } else {
        if (router_enabled) {
          goto(new URL(navigation_result.redirect, intent.url).href, {}, [
            ...redirect_chain,
            intent.url.pathname
          ]);
        } else {
          await native_navigation(new URL(navigation_result.redirect, location.href));
        }
        return;
      }
    } else if (((_b2 = (_a2 = navigation_result.props) == null ? void 0 : _a2.page) == null ? void 0 : _b2.status) >= 400) {
      const updated = await stores.updated.check();
      if (updated) {
        await native_navigation(intent.url);
      }
    }
    updating = true;
    if (opts && opts.details) {
      const { details } = opts;
      const change = details.replaceState ? 0 : 1;
      details.state[INDEX_KEY] = current_history_index += change;
      history[details.replaceState ? "replaceState" : "pushState"](details.state, "", intent.url);
    }
    if (started) {
      current = navigation_result.state;
      root.$set(navigation_result.props);
    } else {
      initialize(navigation_result);
    }
    if (opts) {
      const { scroll: scroll2, keepfocus } = opts;
      if (!keepfocus) {
        const root2 = document.body;
        const tabindex = root2.getAttribute("tabindex");
        (_c = getSelection()) == null ? void 0 : _c.removeAllRanges();
        root2.tabIndex = -1;
        root2.focus();
        if (tabindex !== null) {
          root2.setAttribute("tabindex", tabindex);
        } else {
          root2.removeAttribute("tabindex");
        }
      }
      await tick();
      if (autoscroll) {
        const deep_linked = intent.url.hash && document.getElementById(intent.url.hash.slice(1));
        if (scroll2) {
          scrollTo(scroll2.x, scroll2.y);
        } else if (deep_linked) {
          deep_linked.scrollIntoView();
        } else {
          scrollTo(0, 0);
        }
      }
    } else {
      await tick();
    }
    load_cache.promise = null;
    load_cache.id = null;
    autoscroll = true;
    updating = false;
    if (navigation_result.props.page) {
      page = navigation_result.props.page;
    }
    const leaf_node = navigation_result.state.branch[navigation_result.state.branch.length - 1];
    router_enabled = (leaf_node == null ? void 0 : leaf_node.module.router) !== false;
  }
  function initialize(result) {
    current = result.state;
    const style = document.querySelector("style[data-svelte]");
    if (style)
      style.remove();
    page = result.props.page;
    root = new Root({
      target,
      props: __spreadProps(__spreadValues({}, result.props), { stores }),
      hydrate: true
    });
    started = true;
    if (router_enabled) {
      const navigation = { from: null, to: new URL(location.href) };
      callbacks.after_navigate.forEach((fn) => fn(navigation));
    }
  }
  async function get_navigation_result(intent, no_cache) {
    if (load_cache.id === intent.id && load_cache.promise) {
      return load_cache.promise;
    }
    for (let i = 0; i < intent.routes.length; i += 1) {
      const route = intent.routes[i];
      let j = i + 1;
      while (j < intent.routes.length) {
        const next = intent.routes[j];
        if (next[0].toString() === route[0].toString()) {
          next[1].forEach((loader) => loader());
          j += 1;
        } else {
          break;
        }
      }
      const result = await load_route(route, intent, no_cache);
      if (result)
        return result;
    }
  }
  async function get_navigation_result_from_branch({ url, params, stuff, branch, status, error }) {
    var _a2;
    const filtered = branch.filter(Boolean);
    const redirect = filtered.find((f) => {
      var _a3;
      return (_a3 = f.loaded) == null ? void 0 : _a3.redirect;
    });
    const result = {
      redirect: (_a2 = redirect == null ? void 0 : redirect.loaded) == null ? void 0 : _a2.redirect,
      state: {
        url,
        params,
        branch,
        session_id
      },
      props: {
        components: filtered.map((node) => node.module.default)
      }
    };
    for (let i = 0; i < filtered.length; i += 1) {
      const loaded = filtered[i].loaded;
      result.props[`props_${i}`] = loaded ? await loaded.props : null;
    }
    if (!current.url || url.href !== current.url.href) {
      result.props.page = { url, params, status, error, stuff };
      const print_error = (property, replacement) => {
        Object.defineProperty(result.props.page, property, {
          get: () => {
            throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
          }
        });
      };
      print_error("origin", "origin");
      print_error("path", "pathname");
      print_error("query", "searchParams");
    }
    const leaf = filtered[filtered.length - 1];
    const maxage = leaf.loaded && leaf.loaded.maxage;
    if (maxage) {
      const key = url.pathname + url.search;
      let ready2 = false;
      const clear = () => {
        if (cache.get(key) === result) {
          cache.delete(key);
        }
        unsubscribe();
        clearTimeout(timeout);
      };
      const timeout = setTimeout(clear, maxage * 1e3);
      const unsubscribe = stores.session.subscribe(() => {
        if (ready2)
          clear();
      });
      ready2 = true;
      cache.set(key, result);
    }
    return result;
  }
  async function load_node({ status, error, module, url, params, stuff, props }) {
    const node = {
      module,
      uses: {
        params: /* @__PURE__ */ new Set(),
        url: false,
        session: false,
        stuff: false,
        dependencies: /* @__PURE__ */ new Set()
      },
      loaded: null,
      stuff
    };
    if (props) {
      node.uses.dependencies.add(url.href);
    }
    const uses_params = {};
    for (const key in params) {
      Object.defineProperty(uses_params, key, {
        get() {
          node.uses.params.add(key);
          return params[key];
        },
        enumerable: true
      });
    }
    const session2 = $session;
    if (module.load) {
      const load_input = {
        params: uses_params,
        props: props || {},
        get url() {
          node.uses.url = true;
          return url;
        },
        get session() {
          node.uses.session = true;
          return session2;
        },
        get stuff() {
          node.uses.stuff = true;
          return __spreadValues({}, stuff);
        },
        fetch(resource, info) {
          const requested = typeof resource === "string" ? resource : resource.url;
          const { href } = new URL(requested, url);
          node.uses.dependencies.add(href);
          return started ? fetch(resource, info) : initial_fetch(resource, info);
        }
      };
      if (error) {
        load_input.status = status;
        load_input.error = error;
      }
      const loaded = await module.load.call(null, load_input);
      if (!loaded) {
        throw new Error("load function must return a value");
      }
      node.loaded = normalize(loaded);
      if (node.loaded.stuff)
        node.stuff = node.loaded.stuff;
    } else if (props) {
      node.loaded = normalize({ props });
    }
    return node;
  }
  async function load_route(route, { id, url, path, routes: routes2 }, no_cache) {
    var _a2, _b2, _c;
    if (!no_cache) {
      const cached = cache.get(id);
      if (cached)
        return cached;
    }
    const [pattern, a, b, get_params, shadow_key] = route;
    const params = get_params ? get_params(pattern.exec(path)) : {};
    const changed = current.url && {
      url: id !== current.url.pathname + current.url.search,
      params: Object.keys(params).filter((key) => current.params[key] !== params[key]),
      session: session_id !== current.session_id
    };
    let branch = [];
    let stuff = {};
    let stuff_changed = false;
    let status = 200;
    let error;
    a.forEach((loader) => loader());
    load:
      for (let i = 0; i < a.length; i += 1) {
        let node;
        try {
          if (!a[i])
            continue;
          const module = await a[i]();
          const previous = current.branch[i];
          const changed_since_last_render = !previous || module !== previous.module || changed.url && previous.uses.url || changed.params.some((param) => previous.uses.params.has(param)) || changed.session && previous.uses.session || Array.from(previous.uses.dependencies).some((dep) => invalidated.has(dep)) || stuff_changed && previous.uses.stuff;
          if (changed_since_last_render) {
            let props = {};
            const is_shadow_page = shadow_key !== void 0 && i === a.length - 1;
            if (is_shadow_page) {
              const res = await fetch(`${url.pathname}${url.pathname.endsWith("/") ? "" : "/"}__data.json${url.search}`, {
                headers: {
                  "x-sveltekit-load": shadow_key
                }
              });
              if (res.ok) {
                const redirect = res.headers.get("x-sveltekit-location");
                if (redirect) {
                  return {
                    redirect,
                    props: {},
                    state: current
                  };
                }
                if (res.status === 204) {
                  if (route !== routes2[routes2.length - 1]) {
                    return;
                  }
                  props = {};
                } else {
                  props = await res.json();
                }
              } else {
                status = res.status;
                error = new Error("Failed to load data");
              }
            }
            if (!error) {
              node = await load_node({
                module,
                url,
                params,
                props,
                stuff
              });
            }
            if (node) {
              if (is_shadow_page) {
                node.uses.url = true;
              }
              if (node.loaded) {
                if (node.loaded.fallthrough) {
                  return;
                }
                if (node.loaded.error) {
                  status = node.loaded.status;
                  error = node.loaded.error;
                }
                if (node.loaded.redirect) {
                  return {
                    redirect: node.loaded.redirect,
                    props: {},
                    state: current
                  };
                }
                if (node.loaded.stuff) {
                  stuff_changed = true;
                }
              }
            }
          } else {
            node = previous;
          }
        } catch (e) {
          status = 500;
          error = coalesce_to_error(e);
        }
        if (error) {
          while (i--) {
            if (b[i]) {
              let error_loaded;
              let node_loaded;
              let j = i;
              while (!(node_loaded = branch[j])) {
                j -= 1;
              }
              try {
                error_loaded = await load_node({
                  status,
                  error,
                  module: await b[i](),
                  url,
                  params,
                  stuff: node_loaded.stuff
                });
                if ((_a2 = error_loaded == null ? void 0 : error_loaded.loaded) == null ? void 0 : _a2.error) {
                  continue;
                }
                if ((_b2 = error_loaded == null ? void 0 : error_loaded.loaded) == null ? void 0 : _b2.stuff) {
                  stuff = __spreadValues(__spreadValues({}, stuff), error_loaded.loaded.stuff);
                }
                branch = branch.slice(0, j + 1).concat(error_loaded);
                break load;
              } catch (e) {
                continue;
              }
            }
          }
          return await load_root_error_page({
            status,
            error,
            url
          });
        } else {
          if ((_c = node == null ? void 0 : node.loaded) == null ? void 0 : _c.stuff) {
            stuff = __spreadValues(__spreadValues({}, stuff), node.loaded.stuff);
          }
          branch.push(node);
        }
      }
    return await get_navigation_result_from_branch({
      url,
      params,
      stuff,
      branch,
      status,
      error
    });
  }
  async function load_root_error_page({ status, error, url }) {
    var _a2, _b2;
    const params = {};
    const root_layout = await load_node({
      module: await fallback[0],
      url,
      params,
      stuff: {}
    });
    const root_error = await load_node({
      status,
      error,
      module: await fallback[1],
      url,
      params,
      stuff: root_layout && root_layout.loaded && root_layout.loaded.stuff || {}
    });
    return await get_navigation_result_from_branch({
      url,
      params,
      stuff: __spreadValues(__spreadValues({}, (_a2 = root_layout == null ? void 0 : root_layout.loaded) == null ? void 0 : _a2.stuff), (_b2 = root_error == null ? void 0 : root_error.loaded) == null ? void 0 : _b2.stuff),
      branch: [root_layout, root_error],
      status,
      error
    });
  }
  function owns(url) {
    return url.origin === location.origin && url.pathname.startsWith(base2);
  }
  function get_navigation_intent(url) {
    const path = decodeURI(url.pathname.slice(base2.length) || "/");
    const intent = {
      id: url.pathname + url.search,
      routes: routes.filter(([pattern]) => pattern.test(path)),
      url,
      path
    };
    return intent;
  }
  async function navigate({ url, scroll: scroll2, keepfocus, redirect_chain, details, accepted, blocked }) {
    const from = current.url;
    let should_block = false;
    const navigation = {
      from,
      to: url,
      cancel: () => should_block = true
    };
    callbacks.before_navigate.forEach((fn) => fn(navigation));
    if (should_block) {
      blocked();
      return;
    }
    if (!owns(url)) {
      await native_navigation(url);
    }
    const pathname = normalize_path(url.pathname, trailing_slash);
    url = new URL(url.origin + pathname + url.search + url.hash);
    const intent = get_navigation_intent(url);
    update_scroll_positions(current_history_index);
    accepted();
    navigating++;
    const current_navigating_token = navigating_token = {};
    if (started) {
      stores.navigating.set({
        from: current.url,
        to: intent.url
      });
    }
    await update(intent, redirect_chain, false, {
      scroll: scroll2,
      keepfocus,
      details
    });
    navigating--;
    if (navigating_token !== current_navigating_token)
      return;
    if (!navigating) {
      const navigation2 = { from, to: url };
      callbacks.after_navigate.forEach((fn) => fn(navigation2));
      stores.navigating.set(null);
    }
  }
  function native_navigation(url) {
    location.href = url.href;
    return new Promise(() => {
    });
  }
  return {
    after_navigate: (fn) => {
      onMount(() => {
        callbacks.after_navigate.push(fn);
        return () => {
          const i = callbacks.after_navigate.indexOf(fn);
          callbacks.after_navigate.splice(i, 1);
        };
      });
    },
    before_navigate: (fn) => {
      onMount(() => {
        callbacks.before_navigate.push(fn);
        return () => {
          const i = callbacks.before_navigate.indexOf(fn);
          callbacks.before_navigate.splice(i, 1);
        };
      });
    },
    disable_scroll_handling: () => {
      if (updating || !started) {
        autoscroll = false;
      }
    },
    goto: (href, opts = {}) => goto(href, opts, []),
    invalidate: (resource) => {
      const { href } = new URL(resource, location.href);
      invalidated.add(href);
      if (!invalidating) {
        invalidating = Promise.resolve().then(async () => {
          const intent = get_navigation_intent(new URL(location.href));
          await update(intent, [], true);
          invalidating = null;
        });
      }
      return invalidating;
    },
    prefetch: async (href) => {
      const url = new URL(href, get_base_uri(document));
      await prefetch(url);
    },
    prefetch_routes: async (pathnames) => {
      const matching = pathnames ? routes.filter((route) => pathnames.some((pathname) => route[0].test(pathname))) : routes;
      const promises = matching.map((r) => Promise.all(r[1].map((load) => load())));
      await Promise.all(promises);
    },
    _start_router: () => {
      history.scrollRestoration = "manual";
      addEventListener("beforeunload", (e) => {
        let should_block = false;
        const navigation = {
          from: current.url,
          to: null,
          cancel: () => should_block = true
        };
        callbacks.before_navigate.forEach((fn) => fn(navigation));
        if (should_block) {
          e.preventDefault();
          e.returnValue = "";
        } else {
          history.scrollRestoration = "auto";
        }
      });
      addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          update_scroll_positions(current_history_index);
          try {
            sessionStorage[SCROLL_KEY] = JSON.stringify(scroll_positions);
          } catch {
          }
        }
      });
      const trigger_prefetch = (event) => {
        const a = find_anchor(event);
        if (a && a.href && a.hasAttribute("sveltekit:prefetch")) {
          prefetch(get_href(a));
        }
      };
      let mousemove_timeout;
      const handle_mousemove = (event) => {
        clearTimeout(mousemove_timeout);
        mousemove_timeout = setTimeout(() => {
          var _a2;
          (_a2 = event.target) == null ? void 0 : _a2.dispatchEvent(new CustomEvent("sveltekit:trigger_prefetch", { bubbles: true }));
        }, 20);
      };
      addEventListener("touchstart", trigger_prefetch);
      addEventListener("mousemove", handle_mousemove);
      addEventListener("sveltekit:trigger_prefetch", trigger_prefetch);
      addEventListener("click", (event) => {
        if (!router_enabled)
          return;
        if (event.button || event.which !== 1)
          return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        if (event.defaultPrevented)
          return;
        const a = find_anchor(event);
        if (!a)
          return;
        if (!a.href)
          return;
        const is_svg_a_element = a instanceof SVGAElement;
        const url = get_href(a);
        if (!is_svg_a_element && url.origin === "null")
          return;
        const rel = (a.getAttribute("rel") || "").split(/\s+/);
        if (a.hasAttribute("download") || rel.includes("external")) {
          return;
        }
        if (is_svg_a_element ? a.target.baseVal : a.target)
          return;
        if (url.href === location.href) {
          if (!location.hash)
            event.preventDefault();
          return;
        }
        const [base3, hash2] = url.href.split("#");
        if (hash2 !== void 0 && base3 === location.href.split("#")[0]) {
          hash_navigating = true;
          update_scroll_positions(current_history_index);
          stores.page.set(__spreadProps(__spreadValues({}, page), { url }));
          stores.page.notify();
          return;
        }
        navigate({
          url,
          scroll: a.hasAttribute("sveltekit:noscroll") ? scroll_state() : null,
          keepfocus: false,
          redirect_chain: [],
          details: {
            state: {},
            replaceState: false
          },
          accepted: () => event.preventDefault(),
          blocked: () => event.preventDefault()
        });
      });
      addEventListener("popstate", (event) => {
        if (event.state && router_enabled) {
          if (event.state[INDEX_KEY] === current_history_index)
            return;
          navigate({
            url: new URL(location.href),
            scroll: scroll_positions[event.state[INDEX_KEY]],
            keepfocus: false,
            redirect_chain: [],
            details: null,
            accepted: () => {
              current_history_index = event.state[INDEX_KEY];
            },
            blocked: () => {
              const delta = current_history_index - event.state[INDEX_KEY];
              history.go(delta);
            }
          });
        }
      });
      addEventListener("hashchange", () => {
        if (hash_navigating) {
          hash_navigating = false;
          history.replaceState(__spreadProps(__spreadValues({}, history.state), { [INDEX_KEY]: ++current_history_index }), "", location.href);
        }
      });
    },
    _hydrate: async ({ status, error, nodes, params }) => {
      const url = new URL(location.href);
      const branch = [];
      let stuff = {};
      let result;
      let error_args;
      try {
        for (let i = 0; i < nodes.length; i += 1) {
          const is_leaf = i === nodes.length - 1;
          let props;
          if (is_leaf) {
            const serialized = document.querySelector('script[sveltekit\\:data-type="props"]');
            if (serialized) {
              props = JSON.parse(serialized.textContent);
            }
          }
          const node = await load_node({
            module: await nodes[i],
            url,
            params,
            stuff,
            status: is_leaf ? status : void 0,
            error: is_leaf ? error : void 0,
            props
          });
          if (props) {
            node.uses.dependencies.add(url.href);
            node.uses.url = true;
          }
          branch.push(node);
          if (node && node.loaded) {
            if (node.loaded.error) {
              if (error)
                throw node.loaded.error;
              error_args = {
                status: node.loaded.status,
                error: node.loaded.error,
                url
              };
            } else if (node.loaded.stuff) {
              stuff = __spreadValues(__spreadValues({}, stuff), node.loaded.stuff);
            }
          }
        }
        result = error_args ? await load_root_error_page(error_args) : await get_navigation_result_from_branch({
          url,
          params,
          stuff,
          branch,
          status,
          error
        });
      } catch (e) {
        if (error)
          throw e;
        result = await load_root_error_page({
          status: 500,
          error: coalesce_to_error(e),
          url
        });
      }
      if (result.redirect) {
        await native_navigation(new URL(result.redirect, location.href));
      }
      initialize(result);
    }
  };
}
async function start({ paths, target, session, route, spa, trailing_slash, hydrate }) {
  const client = create_client({
    target,
    session,
    base: paths.base,
    trailing_slash
  });
  set_paths(paths);
  if (hydrate) {
    await client._hydrate(hydrate);
  }
  if (route) {
    if (spa)
      client.goto(location.href, { replaceState: true });
    client._start_router();
  }
  dispatchEvent(new CustomEvent("sveltekit:start"));
}
export { start };
