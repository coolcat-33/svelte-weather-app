import {writable} from 'svelte/store';
import { browser } from '$app/env';
export const weather_data = writable({"list":[]})
export const forecast_data = writable({})
export const current_data = writable({})
export const location = writable("")
export async function update_store(loc) {
    location.set(loc)
    let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`,
    );
    let data = await res.json()
    console.log(data)
    weather_data.set(data)
    res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`);
    data = await res.json()
    forecast_data.set(data)
    console.log(data)
    let lat = data['coord']['lat']
    let lon = data['coord']['lon']
    res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`);
    data = await res.json()
    console.log(data)
    current_data.set(data)
}


async function getPosition(position) {
    console.log(position)

    let res = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=d36b7ad4bedaeb47cb38553a4123c082`)
    let data = await res.json()
    console.log(data)
    update_store(data[0]["name"]+"," + data[0]["state"] + "," + data[0]["country"])
}
if (browser) {
    navigator.geolocation.getCurrentPosition(getPosition);
} else {
    update_store('Irving,TX,US')
}






