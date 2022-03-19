import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, t as text, c as claim_element, a as children, h as claim_text, d as detach, g as insert_hydration, $ as append_hydration, Q as noop } from "../chunks/vendor-ec34ed73.js";
function create_fragment(ctx) {
  let h1;
  let t;
  return {
    c() {
      h1 = element("h1");
      t = text("This page was not prerendered");
    },
    l(nodes) {
      h1 = claim_element(nodes, "H1", {});
      var h1_nodes = children(h1);
      t = claim_text(h1_nodes, "This page was not prerendered");
      h1_nodes.forEach(detach);
    },
    m(target, anchor) {
      insert_hydration(target, h1, anchor);
      append_hydration(h1, t);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(h1);
    }
  };
}
class Routes extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment, safe_not_equal, {});
  }
}
export { Routes as default };
