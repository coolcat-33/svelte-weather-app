import { S as SvelteComponent, i as init, s as safe_not_equal, P as Paper, e as element, w as create_component, c as claim_element, a as children, x as claim_component, d as detach, b as attr, g as insert_hydration, y as mount_component, q as transition_in, o as transition_out, B as destroy_component, M as component_subscribe, N as Title, O as Content, k as space, m as claim_space, t as text, h as claim_text, Q as noop, j as set_data, R as LayoutGrid, l as empty, p as check_outros, U as Cell, V as Title$1, W as Content$1, n as group_outros, X as Card, Y as CircularProgress, f as set_style, Z as destroy_each, _ as src_url_equal } from "../chunks/vendor-ec34ed73.js";
import { c as current_data, f as forecast_data } from "../chunks/weather-7c57c533.js";
function create_default_slot_2$1(ctx) {
  let t0;
  let t1;
  let t2;
  return {
    c() {
      t0 = text(ctx[1]);
      t1 = space();
      t2 = text(ctx[7]);
    },
    l(nodes) {
      t0 = claim_text(nodes, ctx[1]);
      t1 = claim_space(nodes);
      t2 = claim_text(nodes, ctx[7]);
    },
    m(target, anchor) {
      insert_hydration(target, t0, anchor);
      insert_hydration(target, t1, anchor);
      insert_hydration(target, t2, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(t2);
    }
  };
}
function create_default_slot_1$1(ctx) {
  let t0;
  let t1;
  let br0;
  let t2;
  let t3;
  let br1;
  let t4;
  let t5;
  let t6;
  let br2;
  let t7;
  let t8;
  let br3;
  let t9;
  let t10;
  let t11;
  let t12;
  return {
    c() {
      t0 = text("Temp: ");
      t1 = text(ctx[2]);
      br0 = element("br");
      t2 = text("Feels like: ");
      t3 = text(ctx[3]);
      br1 = element("br");
      t4 = text(" Humidity: ");
      t5 = text(ctx[4]);
      t6 = space();
      br2 = element("br");
      t7 = text(" UV Index: ");
      t8 = text(ctx[5]);
      br3 = element("br");
      t9 = text(" Wind Speed: ");
      t10 = text(ctx[6]);
      t11 = text("\n		mph ");
      t12 = text(ctx[0]);
    },
    l(nodes) {
      t0 = claim_text(nodes, "Temp: ");
      t1 = claim_text(nodes, ctx[2]);
      br0 = claim_element(nodes, "BR", {});
      t2 = claim_text(nodes, "Feels like: ");
      t3 = claim_text(nodes, ctx[3]);
      br1 = claim_element(nodes, "BR", {});
      t4 = claim_text(nodes, " Humidity: ");
      t5 = claim_text(nodes, ctx[4]);
      t6 = claim_space(nodes);
      br2 = claim_element(nodes, "BR", {});
      t7 = claim_text(nodes, " UV Index: ");
      t8 = claim_text(nodes, ctx[5]);
      br3 = claim_element(nodes, "BR", {});
      t9 = claim_text(nodes, " Wind Speed: ");
      t10 = claim_text(nodes, ctx[6]);
      t11 = claim_text(nodes, "\n		mph ");
      t12 = claim_text(nodes, ctx[0]);
    },
    m(target, anchor) {
      insert_hydration(target, t0, anchor);
      insert_hydration(target, t1, anchor);
      insert_hydration(target, br0, anchor);
      insert_hydration(target, t2, anchor);
      insert_hydration(target, t3, anchor);
      insert_hydration(target, br1, anchor);
      insert_hydration(target, t4, anchor);
      insert_hydration(target, t5, anchor);
      insert_hydration(target, t6, anchor);
      insert_hydration(target, br2, anchor);
      insert_hydration(target, t7, anchor);
      insert_hydration(target, t8, anchor);
      insert_hydration(target, br3, anchor);
      insert_hydration(target, t9, anchor);
      insert_hydration(target, t10, anchor);
      insert_hydration(target, t11, anchor);
      insert_hydration(target, t12, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 1)
        set_data(t12, ctx2[0]);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(br0);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(t3);
      if (detaching)
        detach(br1);
      if (detaching)
        detach(t4);
      if (detaching)
        detach(t5);
      if (detaching)
        detach(t6);
      if (detaching)
        detach(br2);
      if (detaching)
        detach(t7);
      if (detaching)
        detach(t8);
      if (detaching)
        detach(br3);
      if (detaching)
        detach(t9);
      if (detaching)
        detach(t10);
      if (detaching)
        detach(t11);
      if (detaching)
        detach(t12);
    }
  };
}
function create_default_slot$1(ctx) {
  let title;
  let t;
  let content;
  let current;
  title = new Title({
    props: {
      $$slots: { default: [create_default_slot_2$1] },
      $$scope: { ctx }
    }
  });
  content = new Content({
    props: {
      $$slots: { default: [create_default_slot_1$1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(title.$$.fragment);
      t = space();
      create_component(content.$$.fragment);
    },
    l(nodes) {
      claim_component(title.$$.fragment, nodes);
      t = claim_space(nodes);
      claim_component(content.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(title, target, anchor);
      insert_hydration(target, t, anchor);
      mount_component(content, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const title_changes = {};
      if (dirty & 8192) {
        title_changes.$$scope = { dirty, ctx: ctx2 };
      }
      title.$set(title_changes);
      const content_changes = {};
      if (dirty & 8193) {
        content_changes.$$scope = { dirty, ctx: ctx2 };
      }
      content.$set(content_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(title.$$.fragment, local);
      transition_in(content.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(title.$$.fragment, local);
      transition_out(content.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(title, detaching);
      if (detaching)
        detach(t);
      destroy_component(content, detaching);
    }
  };
}
function create_fragment$1(ctx) {
  let div;
  let paper;
  let current;
  paper = new Paper({
    props: {
      color: "primary",
      variant: "outlined",
      class: "mdc-theme--primary",
      $$slots: { default: [create_default_slot$1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(paper.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(paper.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "container");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(paper, div, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      const paper_changes = {};
      if (dirty & 8193) {
        paper_changes.$$scope = { dirty, ctx: ctx2 };
      }
      paper.$set(paper_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(paper.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(paper.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(paper);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let $current_data;
  component_subscribe($$self, current_data, ($$value) => $$invalidate(9, $current_data = $$value));
  let { data } = $$props;
  let hour = new Date(data["dt"] * 1e3).toLocaleTimeString();
  let temp = String(data["temp"]) + " \xBAF";
  let feels_like = String(data["feels_like"]) + " \xBAF";
  let humidity = data["humidity"];
  let wind_dir;
  let uvi = data["uvi"];
  let wind_speed = data["wind_speed"];
  let date = new Date(data["dt"] * 1e3).getDate();
  let months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
  };
  let month = months[new Date(data["dt"] * 1e3).getMonth()];
  let day = month + " " + date;
  if ($current_data["hourly"][0]["wind_deg"] <= 360 && $current_data["hourly"][0]["wind_deg"] > 315) {
    wind_dir = "North";
  } else if ($current_data["hourly"][0]["wind_deg"] <= 315 && $current_data["hourly"][0]["wind_deg"] > 270) {
    wind_dir = "Northwest";
  } else if ($current_data["hourly"][0]["wind_deg"] <= 270 && $current_data["hourly"][0]["wind_deg"] > 225) {
    wind_dir = "West";
  } else if ($current_data["hourly"][0]["wind_deg"] <= 225 && $current_data["hourly"][0]["wind_deg"] > 180) {
    wind_dir = "Southwest";
  } else if ($current_data["hourly"][0]["wind_deg"] <= 180 && $current_data["hourly"][0]["wind_deg"] > 135) {
    wind_dir = "South";
  } else if ($current_data["hourly"][0]["wind_deg"] <= 135 && $current_data["hourly"][0]["wind_deg"] > 90) {
    wind_dir = "Southeast";
  } else if ($current_data["hourly"][0]["wind_deg"] <= 90 && $current_data["hourly"][0]["wind_deg"] > 45) {
    wind_dir = "East";
  } else if ($current_data["hourly"][0]["wind_deg"] <= 45 && $current_data["hourly"][0]["wind_deg"] > 0) {
    wind_dir = "Northeast";
  }
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2)
      $$invalidate(8, data = $$props2.data);
  };
  return [wind_dir, hour, temp, feels_like, humidity, uvi, wind_speed, day, data];
}
class Hour extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, { data: 8 });
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[8] = list[i];
  child_ctx[10] = i;
  return child_ctx;
}
function create_default_slot_11(ctx) {
  let img;
  let img_src_value;
  let t0;
  let t1_value = ctx[5]["weather"][0]["description"] + "";
  let t1;
  return {
    c() {
      img = element("img");
      t0 = text("\n			Description: ");
      t1 = text(t1_value);
      this.h();
    },
    l(nodes) {
      img = claim_element(nodes, "IMG", {
        alt: true,
        src: true,
        width: true,
        height: true
      });
      t0 = claim_text(nodes, "\n			Description: ");
      t1 = claim_text(nodes, t1_value);
      this.h();
    },
    h() {
      attr(img, "alt", "");
      if (!src_url_equal(img.src, img_src_value = `https://openweathermap.org/img/wn/${ctx[5]["weather"][0]["icon"]}@2x.png`))
        attr(img, "src", img_src_value);
      attr(img, "width", "100px");
      attr(img, "height", "100px");
    },
    m(target, anchor) {
      insert_hydration(target, img, anchor);
      insert_hydration(target, t0, anchor);
      insert_hydration(target, t1, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && !src_url_equal(img.src, img_src_value = `https://openweathermap.org/img/wn/${ctx2[5]["weather"][0]["icon"]}@2x.png`)) {
        attr(img, "src", img_src_value);
      }
      if (dirty & 32 && t1_value !== (t1_value = ctx2[5]["weather"][0]["description"] + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching)
        detach(img);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
    }
  };
}
function create_default_slot_10(ctx) {
  let card;
  let current;
  card = new Card({
    props: {
      padded: true,
      $$slots: { default: [create_default_slot_11] },
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
    p(ctx2, dirty) {
      const card_changes = {};
      if (dirty & 2080) {
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
function create_default_slot_9(ctx) {
  let t0;
  let t1_value = ctx[5]["main"]["temp"] + "";
  let t1;
  let t2;
  let br0;
  let br1;
  let t3;
  let t4_value = ctx[5]["main"]["feels_like"] + "";
  let t4;
  let t5;
  let br2;
  let br3;
  let t6;
  let t7_value = ctx[5]["main"]["temp_max"] + "";
  let t7;
  let t8;
  let br4;
  let br5;
  let t9;
  let t10_value = ctx[5]["main"]["temp_min"] + "";
  let t10;
  let t11;
  return {
    c() {
      t0 = text("Current Temp: ");
      t1 = text(t1_value);
      t2 = text("\xBAF");
      br0 = element("br");
      br1 = element("br");
      t3 = text(" Feels like: ");
      t4 = text(t4_value);
      t5 = text("\xBAF");
      br2 = element("br");
      br3 = element("br");
      t6 = text("Hourly High Temp: ");
      t7 = text(t7_value);
      t8 = text("\xBAF");
      br4 = element("br");
      br5 = element("br");
      t9 = text("Hourly Low Temp: ");
      t10 = text(t10_value);
      t11 = text("\xBAF");
    },
    l(nodes) {
      t0 = claim_text(nodes, "Current Temp: ");
      t1 = claim_text(nodes, t1_value);
      t2 = claim_text(nodes, "\xBAF");
      br0 = claim_element(nodes, "BR", {});
      br1 = claim_element(nodes, "BR", {});
      t3 = claim_text(nodes, " Feels like: ");
      t4 = claim_text(nodes, t4_value);
      t5 = claim_text(nodes, "\xBAF");
      br2 = claim_element(nodes, "BR", {});
      br3 = claim_element(nodes, "BR", {});
      t6 = claim_text(nodes, "Hourly High Temp: ");
      t7 = claim_text(nodes, t7_value);
      t8 = claim_text(nodes, "\xBAF");
      br4 = claim_element(nodes, "BR", {});
      br5 = claim_element(nodes, "BR", {});
      t9 = claim_text(nodes, "Hourly Low Temp: ");
      t10 = claim_text(nodes, t10_value);
      t11 = claim_text(nodes, "\xBAF");
    },
    m(target, anchor) {
      insert_hydration(target, t0, anchor);
      insert_hydration(target, t1, anchor);
      insert_hydration(target, t2, anchor);
      insert_hydration(target, br0, anchor);
      insert_hydration(target, br1, anchor);
      insert_hydration(target, t3, anchor);
      insert_hydration(target, t4, anchor);
      insert_hydration(target, t5, anchor);
      insert_hydration(target, br2, anchor);
      insert_hydration(target, br3, anchor);
      insert_hydration(target, t6, anchor);
      insert_hydration(target, t7, anchor);
      insert_hydration(target, t8, anchor);
      insert_hydration(target, br4, anchor);
      insert_hydration(target, br5, anchor);
      insert_hydration(target, t9, anchor);
      insert_hydration(target, t10, anchor);
      insert_hydration(target, t11, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t1_value !== (t1_value = ctx2[5]["main"]["temp"] + ""))
        set_data(t1, t1_value);
      if (dirty & 32 && t4_value !== (t4_value = ctx2[5]["main"]["feels_like"] + ""))
        set_data(t4, t4_value);
      if (dirty & 32 && t7_value !== (t7_value = ctx2[5]["main"]["temp_max"] + ""))
        set_data(t7, t7_value);
      if (dirty & 32 && t10_value !== (t10_value = ctx2[5]["main"]["temp_min"] + ""))
        set_data(t10, t10_value);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(br0);
      if (detaching)
        detach(br1);
      if (detaching)
        detach(t3);
      if (detaching)
        detach(t4);
      if (detaching)
        detach(t5);
      if (detaching)
        detach(br2);
      if (detaching)
        detach(br3);
      if (detaching)
        detach(t6);
      if (detaching)
        detach(t7);
      if (detaching)
        detach(t8);
      if (detaching)
        detach(br4);
      if (detaching)
        detach(br5);
      if (detaching)
        detach(t9);
      if (detaching)
        detach(t10);
      if (detaching)
        detach(t11);
    }
  };
}
function create_default_slot_8(ctx) {
  let div;
  let card;
  let current;
  card = new Card({
    props: {
      padded: true,
      $$slots: { default: [create_default_slot_9] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(card.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(card.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "card-container");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(card, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const card_changes = {};
      if (dirty & 2080) {
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
      if (detaching)
        detach(div);
      destroy_component(card);
    }
  };
}
function create_default_slot_7(ctx) {
  let t0;
  let t1_value = ctx[5]["wind"]["speed"] + "";
  let t1;
  let t2;
  let t3;
  let br0;
  let br1;
  let t4;
  let t5_value = ctx[5]["main"]["pressure"] + "";
  let t5;
  let t6;
  return {
    c() {
      t0 = text("Wind: ");
      t1 = text(t1_value);
      t2 = text(" mph ");
      t3 = text(ctx[4]);
      br0 = element("br");
      br1 = element("br");
      t4 = text("Pressure: ");
      t5 = text(t5_value);
      t6 = text(" mb");
    },
    l(nodes) {
      t0 = claim_text(nodes, "Wind: ");
      t1 = claim_text(nodes, t1_value);
      t2 = claim_text(nodes, " mph ");
      t3 = claim_text(nodes, ctx[4]);
      br0 = claim_element(nodes, "BR", {});
      br1 = claim_element(nodes, "BR", {});
      t4 = claim_text(nodes, "Pressure: ");
      t5 = claim_text(nodes, t5_value);
      t6 = claim_text(nodes, " mb");
    },
    m(target, anchor) {
      insert_hydration(target, t0, anchor);
      insert_hydration(target, t1, anchor);
      insert_hydration(target, t2, anchor);
      insert_hydration(target, t3, anchor);
      insert_hydration(target, br0, anchor);
      insert_hydration(target, br1, anchor);
      insert_hydration(target, t4, anchor);
      insert_hydration(target, t5, anchor);
      insert_hydration(target, t6, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t1_value !== (t1_value = ctx2[5]["wind"]["speed"] + ""))
        set_data(t1, t1_value);
      if (dirty & 16)
        set_data(t3, ctx2[4]);
      if (dirty & 32 && t5_value !== (t5_value = ctx2[5]["main"]["pressure"] + ""))
        set_data(t5, t5_value);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(t3);
      if (detaching)
        detach(br0);
      if (detaching)
        detach(br1);
      if (detaching)
        detach(t4);
      if (detaching)
        detach(t5);
      if (detaching)
        detach(t6);
    }
  };
}
function create_default_slot_6(ctx) {
  let div;
  let card;
  let current;
  card = new Card({
    props: {
      padded: true,
      $$slots: { default: [create_default_slot_7] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(card.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(card.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "card-container");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(card, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const card_changes = {};
      if (dirty & 2096) {
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
      if (detaching)
        detach(div);
      destroy_component(card);
    }
  };
}
function create_default_slot_5(ctx) {
  let t0;
  let t1_value = new Date(ctx[5]["sys"]["sunrise"] * 1e3).toLocaleTimeString() + "";
  let t1;
  let br0;
  let br1;
  let t2;
  let t3_value = new Date(ctx[5]["sys"]["sunset"]).toLocaleTimeString() + "";
  let t3;
  return {
    c() {
      t0 = text("Sunrise: ");
      t1 = text(t1_value);
      br0 = element("br");
      br1 = element("br");
      t2 = text(" Sunset: ");
      t3 = text(t3_value);
    },
    l(nodes) {
      t0 = claim_text(nodes, "Sunrise: ");
      t1 = claim_text(nodes, t1_value);
      br0 = claim_element(nodes, "BR", {});
      br1 = claim_element(nodes, "BR", {});
      t2 = claim_text(nodes, " Sunset: ");
      t3 = claim_text(nodes, t3_value);
    },
    m(target, anchor) {
      insert_hydration(target, t0, anchor);
      insert_hydration(target, t1, anchor);
      insert_hydration(target, br0, anchor);
      insert_hydration(target, br1, anchor);
      insert_hydration(target, t2, anchor);
      insert_hydration(target, t3, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t1_value !== (t1_value = new Date(ctx2[5]["sys"]["sunrise"] * 1e3).toLocaleTimeString() + ""))
        set_data(t1, t1_value);
      if (dirty & 32 && t3_value !== (t3_value = new Date(ctx2[5]["sys"]["sunset"]).toLocaleTimeString() + ""))
        set_data(t3, t3_value);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(br0);
      if (detaching)
        detach(br1);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(t3);
    }
  };
}
function create_default_slot_4(ctx) {
  let div;
  let card;
  let current;
  card = new Card({
    props: {
      padded: true,
      $$slots: { default: [create_default_slot_5] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(card.$$.fragment);
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      claim_component(card.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "card-container");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(card, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const card_changes = {};
      if (dirty & 2080) {
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
      if (detaching)
        detach(div);
      destroy_component(card);
    }
  };
}
function create_default_slot_3(ctx) {
  let cell0;
  let t0;
  let cell1;
  let t1;
  let cell2;
  let t2;
  let cell3;
  let current;
  cell0 = new Cell({
    props: {
      span: 3,
      $$slots: { default: [create_default_slot_10] },
      $$scope: { ctx }
    }
  });
  cell1 = new Cell({
    props: {
      span: 3,
      $$slots: { default: [create_default_slot_8] },
      $$scope: { ctx }
    }
  });
  cell2 = new Cell({
    props: {
      span: 3,
      $$slots: { default: [create_default_slot_6] },
      $$scope: { ctx }
    }
  });
  cell3 = new Cell({
    props: {
      span: 3,
      $$slots: { default: [create_default_slot_4] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(cell0.$$.fragment);
      t0 = space();
      create_component(cell1.$$.fragment);
      t1 = space();
      create_component(cell2.$$.fragment);
      t2 = space();
      create_component(cell3.$$.fragment);
    },
    l(nodes) {
      claim_component(cell0.$$.fragment, nodes);
      t0 = claim_space(nodes);
      claim_component(cell1.$$.fragment, nodes);
      t1 = claim_space(nodes);
      claim_component(cell2.$$.fragment, nodes);
      t2 = claim_space(nodes);
      claim_component(cell3.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(cell0, target, anchor);
      insert_hydration(target, t0, anchor);
      mount_component(cell1, target, anchor);
      insert_hydration(target, t1, anchor);
      mount_component(cell2, target, anchor);
      insert_hydration(target, t2, anchor);
      mount_component(cell3, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const cell0_changes = {};
      if (dirty & 2080) {
        cell0_changes.$$scope = { dirty, ctx: ctx2 };
      }
      cell0.$set(cell0_changes);
      const cell1_changes = {};
      if (dirty & 2080) {
        cell1_changes.$$scope = { dirty, ctx: ctx2 };
      }
      cell1.$set(cell1_changes);
      const cell2_changes = {};
      if (dirty & 2096) {
        cell2_changes.$$scope = { dirty, ctx: ctx2 };
      }
      cell2.$set(cell2_changes);
      const cell3_changes = {};
      if (dirty & 2080) {
        cell3_changes.$$scope = { dirty, ctx: ctx2 };
      }
      cell3.$set(cell3_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(cell0.$$.fragment, local);
      transition_in(cell1.$$.fragment, local);
      transition_in(cell2.$$.fragment, local);
      transition_in(cell3.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(cell0.$$.fragment, local);
      transition_out(cell1.$$.fragment, local);
      transition_out(cell2.$$.fragment, local);
      transition_out(cell3.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(cell0, detaching);
      if (detaching)
        detach(t0);
      destroy_component(cell1, detaching);
      if (detaching)
        detach(t1);
      destroy_component(cell2, detaching);
      if (detaching)
        detach(t2);
      destroy_component(cell3, detaching);
    }
  };
}
function create_else_block(ctx) {
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
    p: noop,
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
function create_if_block_1(ctx) {
  let div;
  let current;
  let each_value = Array(12);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true, span: true });
      var div_nodes = children(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(div_nodes);
      }
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "container");
      attr(div, "span", "1");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 64) {
        each_value = Array(12);
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
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block(ctx) {
  let hour;
  let t;
  let paper;
  let current;
  hour = new Hour({
    props: {
      data: ctx[6]["hourly"][ctx[10]]
    }
  });
  paper = new Paper({});
  return {
    c() {
      create_component(hour.$$.fragment);
      t = space();
      create_component(paper.$$.fragment);
    },
    l(nodes) {
      claim_component(hour.$$.fragment, nodes);
      t = claim_space(nodes);
      claim_component(paper.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(hour, target, anchor);
      insert_hydration(target, t, anchor);
      mount_component(paper, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const hour_changes = {};
      if (dirty & 64)
        hour_changes.data = ctx2[6]["hourly"][ctx2[10]];
      hour.$set(hour_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(hour.$$.fragment, local);
      transition_in(paper.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(hour.$$.fragment, local);
      transition_out(paper.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(hour, detaching);
      if (detaching)
        detach(t);
      destroy_component(paper, detaching);
    }
  };
}
function create_if_block(ctx) {
  let div;
  let paper;
  let current;
  paper = new Paper({
    props: {
      color: "primary",
      variant: "outlined",
      class: "mdc-theme--primary",
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      div = element("div");
      create_component(paper.$$.fragment);
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      claim_component(paper.$$.fragment, div_nodes);
      div_nodes.forEach(detach);
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      mount_component(paper, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const paper_changes = {};
      if (dirty & 2063) {
        paper_changes.$$scope = { dirty, ctx: ctx2 };
      }
      paper.$set(paper_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(paper.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(paper.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(paper);
    }
  };
}
function create_default_slot_2(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[0]);
    },
    l(nodes) {
      t = claim_text(nodes, ctx[0]);
    },
    m(target, anchor) {
      insert_hydration(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 1)
        set_data(t, ctx2[0]);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_1(ctx) {
  let t0;
  let t1;
  let t2;
  let t3;
  let br;
  let t4;
  let t5;
  return {
    c() {
      t0 = text(ctx[1]);
      t1 = text(" - ");
      t2 = text(ctx[2]);
      t3 = space();
      br = element("br");
      t4 = space();
      t5 = text(ctx[3]);
    },
    l(nodes) {
      t0 = claim_text(nodes, ctx[1]);
      t1 = claim_text(nodes, " - ");
      t2 = claim_text(nodes, ctx[2]);
      t3 = claim_space(nodes);
      br = claim_element(nodes, "BR", {});
      t4 = claim_space(nodes);
      t5 = claim_text(nodes, ctx[3]);
    },
    m(target, anchor) {
      insert_hydration(target, t0, anchor);
      insert_hydration(target, t1, anchor);
      insert_hydration(target, t2, anchor);
      insert_hydration(target, t3, anchor);
      insert_hydration(target, br, anchor);
      insert_hydration(target, t4, anchor);
      insert_hydration(target, t5, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 2)
        set_data(t0, ctx2[1]);
      if (dirty & 4)
        set_data(t2, ctx2[2]);
      if (dirty & 8)
        set_data(t5, ctx2[3]);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(t3);
      if (detaching)
        detach(br);
      if (detaching)
        detach(t4);
      if (detaching)
        detach(t5);
    }
  };
}
function create_default_slot(ctx) {
  let title;
  let t;
  let content;
  let current;
  title = new Title$1({
    props: {
      $$slots: { default: [create_default_slot_2] },
      $$scope: { ctx }
    }
  });
  content = new Content$1({
    props: {
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(title.$$.fragment);
      t = space();
      create_component(content.$$.fragment);
    },
    l(nodes) {
      claim_component(title.$$.fragment, nodes);
      t = claim_space(nodes);
      claim_component(content.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(title, target, anchor);
      insert_hydration(target, t, anchor);
      mount_component(content, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const title_changes = {};
      if (dirty & 2049) {
        title_changes.$$scope = { dirty, ctx: ctx2 };
      }
      title.$set(title_changes);
      const content_changes = {};
      if (dirty & 2062) {
        content_changes.$$scope = { dirty, ctx: ctx2 };
      }
      content.$set(content_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(title.$$.fragment, local);
      transition_in(content.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(title.$$.fragment, local);
      transition_out(content.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(title, detaching);
      if (detaching)
        detach(t);
      destroy_component(content, detaching);
    }
  };
}
function create_fragment(ctx) {
  let layoutgrid;
  let t0;
  let current_block_type_index;
  let if_block0;
  let t1;
  let paper0;
  let t2;
  let paper1;
  let t3;
  let if_block1_anchor;
  let current;
  layoutgrid = new LayoutGrid({
    props: {
      $$slots: { default: [create_default_slot_3] },
      $$scope: { ctx }
    }
  });
  const if_block_creators = [create_if_block_1, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[6]["hourly"] !== void 0)
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  paper0 = new Paper({});
  paper1 = new Paper({});
  let if_block1 = ctx[6]["alerts"] !== void 0 && create_if_block(ctx);
  return {
    c() {
      create_component(layoutgrid.$$.fragment);
      t0 = space();
      if_block0.c();
      t1 = space();
      create_component(paper0.$$.fragment);
      t2 = space();
      create_component(paper1.$$.fragment);
      t3 = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
    },
    l(nodes) {
      claim_component(layoutgrid.$$.fragment, nodes);
      t0 = claim_space(nodes);
      if_block0.l(nodes);
      t1 = claim_space(nodes);
      claim_component(paper0.$$.fragment, nodes);
      t2 = claim_space(nodes);
      claim_component(paper1.$$.fragment, nodes);
      t3 = claim_space(nodes);
      if (if_block1)
        if_block1.l(nodes);
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      mount_component(layoutgrid, target, anchor);
      insert_hydration(target, t0, anchor);
      if_blocks[current_block_type_index].m(target, anchor);
      insert_hydration(target, t1, anchor);
      mount_component(paper0, target, anchor);
      insert_hydration(target, t2, anchor);
      mount_component(paper1, target, anchor);
      insert_hydration(target, t3, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert_hydration(target, if_block1_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const layoutgrid_changes = {};
      if (dirty & 2096) {
        layoutgrid_changes.$$scope = { dirty, ctx: ctx2 };
      }
      layoutgrid.$set(layoutgrid_changes);
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
        if_block0.m(t1.parentNode, t1);
      }
      if (ctx2[6]["alerts"] !== void 0) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & 64) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block(ctx2);
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
      transition_in(layoutgrid.$$.fragment, local);
      transition_in(if_block0);
      transition_in(paper0.$$.fragment, local);
      transition_in(paper1.$$.fragment, local);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(layoutgrid.$$.fragment, local);
      transition_out(if_block0);
      transition_out(paper0.$$.fragment, local);
      transition_out(paper1.$$.fragment, local);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      destroy_component(layoutgrid, detaching);
      if (detaching)
        detach(t0);
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(t1);
      destroy_component(paper0, detaching);
      if (detaching)
        detach(t2);
      destroy_component(paper1, detaching);
      if (detaching)
        detach(t3);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $forecast_data;
  let $current_data;
  component_subscribe($$self, forecast_data, ($$value) => $$invalidate(5, $forecast_data = $$value));
  component_subscribe($$self, current_data, ($$value) => $$invalidate(6, $current_data = $$value));
  let alert_event;
  let alert_start;
  let alert_end;
  let alert_description;
  let wind_dir;
  let months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
  };
  if ($current_data["alerts"] != void 0) {
    alert_event = $current_data["alerts"][0]["event"];
    alert_start = new Date($current_data["alerts"][0]["start"] * 1e3).toLocaleTimeString() + " " + months[new Date($current_data["alerts"][0]["start"] * 1e3).getMonth()] + " " + new Date($current_data["alerts"][0]["start"] * 1e3).getDate();
    alert_end = new Date($current_data["alerts"][0]["end"] * 1e3).toLocaleTimeString() + " " + months[new Date($current_data["alerts"][0]["start"] * 1e3).getMonth()] + " " + new Date($current_data["alerts"][0]["start"] * 1e3).getDate();
    alert_description = $current_data["alerts"][0]["description"];
  }
  if ($forecast_data["wind"]["deg"] <= 360 && $forecast_data["wind"]["deg"] > 315) {
    wind_dir = "North";
  } else if ($forecast_data["wind"]["deg"] <= 315 && $forecast_data["wind"]["deg"] > 270) {
    wind_dir = "Northwest";
  } else if ($forecast_data["wind"]["deg"] <= 270 && $forecast_data["wind"]["deg"] > 225) {
    wind_dir = "West";
  } else if ($forecast_data["wind"]["deg"] <= 225 && $forecast_data["wind"]["deg"] > 180) {
    wind_dir = "Southwest";
  } else if ($forecast_data["wind"]["deg"] <= 180 && $forecast_data["wind"]["deg"] > 135) {
    wind_dir = "South";
  } else if ($forecast_data["wind"]["deg"] <= 135 && $forecast_data["wind"]["deg"] > 90) {
    wind_dir = "Southeast";
  } else if ($forecast_data["wind"]["deg"] <= 90 && $forecast_data["wind"]["deg"] > 45) {
    wind_dir = "East";
  } else if ($forecast_data["wind"]["deg"] <= 45 && $forecast_data["wind"]["deg"] > 0) {
    wind_dir = "Northeast";
  }
  return [
    alert_event,
    alert_start,
    alert_end,
    alert_description,
    wind_dir,
    $forecast_data,
    $current_data
  ];
}
class Current extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export { Current as default };
