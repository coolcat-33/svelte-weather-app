import { S as SvelteComponent, i as init, s as safe_not_equal, T as TabBar, F as binding_callbacks, G as bind, H as Textfield, w as create_component, k as space, e as element, l as empty, x as claim_component, m as claim_space, c as claim_element, a as children, d as detach, y as mount_component, g as insert_hydration, I as add_flush_callback, o as transition_out, p as check_outros, q as transition_in, B as destroy_component, n as group_outros, J as Tab, K as HelperText, L as Label, t as text, h as claim_text, j as set_data } from "../chunks/vendor-7769e93b.js";
import Current from "./current.svelte-91a16f9c.js";
import Forecast from "./forecast.svelte-7400071a.js";
import { u as update_store } from "../chunks/weather-c1e54da2.js";
function create_default_slot_3(ctx) {
  let t_value = ctx[5] + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    l(nodes) {
      t = claim_text(nodes, t_value);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t_value !== (t_value = ctx2[5] + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_2(ctx) {
  let label;
  let current;
  label = new Label({
    props: {
      $$slots: { default: [create_default_slot_3] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(label.$$.fragment);
    },
    l(nodes) {
      claim_component(label.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(label, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const label_changes = {};
      if (dirty & 96) {
        label_changes.$$scope = { dirty, ctx: ctx2 };
      }
      label.$set(label_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(label.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(label.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(label, detaching);
    }
  };
}
function create_default_slot_1(ctx) {
  let tab;
  let current;
  tab = new Tab({
    props: {
      tab: ctx[5],
      $$slots: { default: [create_default_slot_2] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(tab.$$.fragment);
    },
    l(nodes) {
      claim_component(tab.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(tab, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const tab_changes = {};
      if (dirty & 32)
        tab_changes.tab = ctx2[5];
      if (dirty & 96) {
        tab_changes.$$scope = { dirty, ctx: ctx2 };
      }
      tab.$set(tab_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(tab.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tab.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(tab, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let t;
  return {
    c() {
      t = text("Ex: Irving,TX,USA");
    },
    l(nodes) {
      t = claim_text(nodes, "Ex: Irving,TX,USA");
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_helper_slot(ctx) {
  let helpertext;
  let current;
  helpertext = new HelperText({
    props: {
      slot: "helper",
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(helpertext.$$.fragment);
    },
    l(nodes) {
      claim_component(helpertext.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(helpertext, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const helpertext_changes = {};
      if (dirty & 64) {
        helpertext_changes.$$scope = { dirty, ctx: ctx2 };
      }
      helpertext.$set(helpertext_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(helpertext.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(helpertext.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(helpertext, detaching);
    }
  };
}
function create_else_block(ctx) {
  let forecast;
  let current;
  forecast = new Forecast({});
  return {
    c() {
      create_component(forecast.$$.fragment);
    },
    l(nodes) {
      claim_component(forecast.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(forecast, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(forecast.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(forecast.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(forecast, detaching);
    }
  };
}
function create_if_block(ctx) {
  let current;
  let current$1;
  current = new Current({});
  return {
    c() {
      create_component(current.$$.fragment);
    },
    l(nodes) {
      claim_component(current.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(current, target, anchor);
      current$1 = true;
    },
    i(local) {
      if (current$1)
        return;
      transition_in(current.$$.fragment, local);
      current$1 = true;
    },
    o(local) {
      transition_out(current.$$.fragment, local);
      current$1 = false;
    },
    d(detaching) {
      destroy_component(current, detaching);
    }
  };
}
function create_fragment(ctx) {
  let tabbar;
  let updating_active;
  let t0;
  let div;
  let textfield;
  let updating_value;
  let t1;
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  function tabbar_active_binding(value) {
    ctx[3](value);
  }
  let tabbar_props = {
    tabs: ["Current", "Forecast"],
    $$slots: {
      default: [
        create_default_slot_1,
        ({ tab }) => ({ 5: tab }),
        ({ tab }) => tab ? 32 : 0
      ]
    },
    $$scope: { ctx }
  };
  if (ctx[0] !== void 0) {
    tabbar_props.active = ctx[0];
  }
  tabbar = new TabBar({ props: tabbar_props });
  binding_callbacks.push(() => bind(tabbar, "active", tabbar_active_binding));
  function textfield_value_binding(value) {
    ctx[4](value);
  }
  let textfield_props = {
    label: "Location",
    $$slots: { helper: [create_helper_slot] },
    $$scope: { ctx }
  };
  if (ctx[1] !== void 0) {
    textfield_props.value = ctx[1];
  }
  textfield = new Textfield({ props: textfield_props });
  binding_callbacks.push(() => bind(textfield, "value", textfield_value_binding));
  textfield.$on("keypress", ctx[2]);
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[0] == "Current")
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      create_component(tabbar.$$.fragment);
      t0 = space();
      div = element("div");
      create_component(textfield.$$.fragment);
      t1 = space();
      if_block.c();
      if_block_anchor = empty();
    },
    l(nodes) {
      claim_component(tabbar.$$.fragment, nodes);
      t0 = claim_space(nodes);
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      claim_component(textfield.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      t1 = claim_space(nodes);
      if_block.l(nodes);
      if_block_anchor = empty();
    },
    m(target, anchor) {
      mount_component(tabbar, target, anchor);
      insert_hydration(target, t0, anchor);
      insert_hydration(target, div, anchor);
      mount_component(textfield, div, null);
      insert_hydration(target, t1, anchor);
      if_blocks[current_block_type_index].m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const tabbar_changes = {};
      if (dirty & 96) {
        tabbar_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_active && dirty & 1) {
        updating_active = true;
        tabbar_changes.active = ctx2[0];
        add_flush_callback(() => updating_active = false);
      }
      tabbar.$set(tabbar_changes);
      const textfield_changes = {};
      if (dirty & 64) {
        textfield_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_value && dirty & 2) {
        updating_value = true;
        textfield_changes.value = ctx2[1];
        add_flush_callback(() => updating_value = false);
      }
      textfield.$set(textfield_changes);
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index !== previous_block_index) {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(tabbar.$$.fragment, local);
      transition_in(textfield.$$.fragment, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(tabbar.$$.fragment, local);
      transition_out(textfield.$$.fragment, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      destroy_component(tabbar, detaching);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(div);
      destroy_component(textfield);
      if (detaching)
        detach(t1);
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let active = "Forecast";
  let loc = "Irving,TX,USA";
  const onKeyPress = (e) => {
    if (e.charCode === 13) {
      update_store(loc.trim());
    }
  };
  function tabbar_active_binding(value) {
    active = value;
    $$invalidate(0, active);
  }
  function textfield_value_binding(value) {
    loc = value;
    $$invalidate(1, loc);
  }
  return [active, loc, onKeyPress, tabbar_active_binding, textfield_value_binding];
}
class _layout extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export { _layout as default };
