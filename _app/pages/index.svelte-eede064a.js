import { S as SvelteComponent, i as init, s as safe_not_equal, v as onMount } from "../chunks/vendor-952a8a66.js";
import { u as update_store } from "../chunks/weather-833a9176.js";
function instance($$self) {
  let loc = "";
  async function getPosition(position) {
    console.log(position);
    let res = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=d36b7ad4bedaeb47cb38553a4123c082`);
    let data = await res.json();
    loc = data["name"] + "," + data["country"];
    console.log(data);
    update_store(loc.trim());
  }
  onMount(async () => {
    console.log("mounted");
    navigator.geolocation.getCurrentPosition(async (position) => {
      await getPosition(position);
    });
  });
  return [];
}
class Routes extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, null, safe_not_equal, {});
  }
}
export { Routes as default };
