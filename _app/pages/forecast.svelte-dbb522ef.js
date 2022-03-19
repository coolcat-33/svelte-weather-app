import { S as SvelteComponent, i as init, s as safe_not_equal, N as Card, w as create_component, x as claim_component, y as mount_component, q as transition_in, o as transition_out, B as destroy_component, e as element, t as text, k as space, c as claim_element, a as children, h as claim_text, m as claim_space, d as detach, b as attr, _ as src_url_equal, g as insert_hydration, P as append_hydration, j as set_data, f as set_style, p as check_outros, Z as destroy_each, J as component_subscribe, X as CircularProgress, n as group_outros } from "../chunks/vendor-952a8a66.js";
import { f as forecast_data, w as weather_data } from "../chunks/weather-833a9176.js";
function create_default_slot(ctx) {
  let div;
  let t0;
  let t1;
  let br0;
  let t2;
  let t3;
  let t4;
  let br1;
  let t5;
  let img_1;
  let img_1_src_value;
  let t6;
  let br2;
  let t7;
  let t8;
  let t9;
  return {
    c() {
      div = element("div");
      t0 = text(ctx[3]);
      t1 = space();
      br0 = element("br");
      t2 = space();
      t3 = text(ctx[2]);
      t4 = space();
      br1 = element("br");
      t5 = space();
      img_1 = element("img");
      t6 = space();
      br2 = element("br");
      t7 = space();
      t8 = text(ctx[1]);
      t9 = text("\xBAF");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, ctx[3]);
      t1 = claim_space(div_nodes);
      br0 = claim_element(div_nodes, "BR", {});
      t2 = claim_space(div_nodes);
      t3 = claim_text(div_nodes, ctx[2]);
      t4 = claim_space(div_nodes);
      br1 = claim_element(div_nodes, "BR", {});
      t5 = claim_space(div_nodes);
      img_1 = claim_element(div_nodes, "IMG", {
        alt: true,
        src: true,
        width: true,
        height: true
      });
      t6 = claim_space(div_nodes);
      br2 = claim_element(div_nodes, "BR", {});
      t7 = claim_space(div_nodes);
      t8 = claim_text(div_nodes, ctx[1]);
      t9 = claim_text(div_nodes, "\xBAF");
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(img_1, "alt", "");
      if (!src_url_equal(img_1.src, img_1_src_value = `https://openweathermap.org/img/wn/${ctx[0]}@2x.png`))
        attr(img_1, "src", img_1_src_value);
      attr(img_1, "width", "100");
      attr(img_1, "height", "100px");
      attr(div, "class", "day");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, t0);
      append_hydration(div, t1);
      append_hydration(div, br0);
      append_hydration(div, t2);
      append_hydration(div, t3);
      append_hydration(div, t4);
      append_hydration(div, br1);
      append_hydration(div, t5);
      append_hydration(div, img_1);
      append_hydration(div, t6);
      append_hydration(div, br2);
      append_hydration(div, t7);
      append_hydration(div, t8);
      append_hydration(div, t9);
    },
    p(ctx2, dirty) {
      if (dirty & 4)
        set_data(t3, ctx2[2]);
      if (dirty & 1 && !src_url_equal(img_1.src, img_1_src_value = `https://openweathermap.org/img/wn/${ctx2[0]}@2x.png`)) {
        attr(img_1, "src", img_1_src_value);
      }
      if (dirty & 2)
        set_data(t8, ctx2[1]);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment$1(ctx) {
  let card;
  let current;
  card = new Card({
    props: {
      padded: true,
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(card.$$.fragment);
    },
    l(nodes) {
      claim_component(card.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const card_changes = {};
      if (dirty & 71) {
        card_changes.$$scope = { dirty, ctx: ctx2 };
      }
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { timestamp } = $$props;
  let { img } = $$props;
  let { temp } = $$props;
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let date = days[new Date(timestamp * 1e3).getDay()];
  let hour = String(new Date(timestamp * 1e3).getHours());
  if (parseInt(hour) > 12) {
    hour = `${parseInt(hour) - 12}:00 PM`;
  } else if (parseInt(hour) == 12) {
    hour = hour + ":00 PM";
  } else {
    hour = hour + ":00 AM";
  }
  $$self.$$set = ($$props2) => {
    if ("timestamp" in $$props2)
      $$invalidate(4, timestamp = $$props2.timestamp);
    if ("img" in $$props2)
      $$invalidate(0, img = $$props2.img);
    if ("temp" in $$props2)
      $$invalidate(1, temp = $$props2.temp);
  };
  return [img, temp, hour, date, timestamp];
}
class Day extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, { timestamp: 4, img: 0, temp: 1 });
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[2] = list[i];
  child_ctx[4] = i;
  return child_ctx;
}
function create_if_block_1(ctx) {
  let div;
  let circularprogress;
  let current;
  circularprogress = new CircularProgress({
    props: {
      class: "my-four-colors",
      style: "height: 32px; width: 32px;",
      indeterminate: true,
      fourColor: true
    }
  });
  return {
    c() {
      div = element("div");
      create_component(circularprogress.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { style: true });
      var div_nodes = children(div);
      claim_component(circularprogress.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_style(div, "display", "flex");
      set_style(div, "justify-content", "center");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(circularprogress, div, null);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(circularprogress.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(circularprogress.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(circularprogress);
    }
  };
}
function create_if_block(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      children(div).forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "break");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_each_block(ctx) {
  let t;
  let day;
  let current;
  let if_block = ctx[4] % 8 == 0 && create_if_block();
  day = new Day({
    props: {
      timestamp: ctx[2].dt,
      img: ctx[2].weather[0]["icon"],
      temp: ctx[2].main.temp
    }
  });
  return {
    c() {
      if (if_block)
        if_block.c();
      t = space();
      create_component(day.$$.fragment);
    },
    l(nodes) {
      if (if_block)
        if_block.l(nodes);
      t = claim_space(nodes);
      claim_component(day.$$.fragment, nodes);
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, t, anchor);
      mount_component(day, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const day_changes = {};
      if (dirty & 2)
        day_changes.timestamp = ctx2[2].dt;
      if (dirty & 2)
        day_changes.img = ctx2[2].weather[0]["icon"];
      if (dirty & 2)
        day_changes.temp = ctx2[2].main.temp;
      day.$set(day_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(day.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(day.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(t);
      destroy_component(day, detaching);
    }
  };
}
function create_fragment(ctx) {
  let t0;
  let br;
  let t1;
  let div;
  let current;
  let if_block = ctx[0]["wind"] === void 0 && create_if_block_1();
  let each_value = ctx[1]["list"];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      if (if_block)
        if_block.c();
      t0 = space();
      br = element("br");
      t1 = space();
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      if (if_block)
        if_block.l(nodes);
      t0 = claim_space(nodes);
      br = claim_element(nodes, "BR", {});
      t1 = claim_space(nodes);
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div_nodes);
      }
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "container");
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, t0, anchor);
      insert_hydration(target, br, anchor);
      insert_hydration(target, t1, anchor);
      insert_hydration(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[0]["wind"] === void 0) {
        if (if_block) {
          if (dirty & 1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1();
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(t0.parentNode, t0);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (dirty & 2) {
        each_value = ctx2[1]["list"];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      transition_out(if_block);
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(br);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $forecast_data;
  let $weather_data;
  component_subscribe($$self, forecast_data, ($$value) => $$invalidate(0, $forecast_data = $$value));
  component_subscribe($$self, weather_data, ($$value) => $$invalidate(1, $weather_data = $$value));
  return [$forecast_data, $weather_data];
}
class Forecast extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export { Forecast as default };
