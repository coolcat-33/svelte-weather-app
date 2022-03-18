import {writable} from 'svelte/store';

export const weather_data = writable({"list":[]})
export const forecast_data = writable({})
export const current_data = writable({})

export async function update_store(loc) {
    let res = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`);
    let data = await res.json()
    console.log(data)
    weather_data.set(data)
    res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`);
    data = await res.json()
    forecast_data.set(data)
    console.log(data)
    let lat = data['coord']['lat']
    let lon = data['coord']['lon']
    res = await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`);
    data = await res.json()
    console.log(data)
    current_data.set(data)
}

export async function update_store_1(lat,lon) {

    // console.log(data)
}

update_store('Irving,TX,US')






