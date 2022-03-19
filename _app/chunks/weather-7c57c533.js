import { D as writable } from "./vendor-ec34ed73.js";
const weather_data = writable({ "list": [] });
const forecast_data = writable({});
const current_data = writable({});
async function update_store(loc) {
  let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`);
  let data = await res.json();
  console.log(data);
  weather_data.set(data);
  res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`);
  data = await res.json();
  forecast_data.set(data);
  console.log(data);
  let lat = data["coord"]["lat"];
  let lon = data["coord"]["lon"];
  res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`);
  data = await res.json();
  console.log(data);
  current_data.set(data);
}
update_store("Irving,TX,US");
export { current_data as c, forecast_data as f, update_store as u, weather_data as w };
