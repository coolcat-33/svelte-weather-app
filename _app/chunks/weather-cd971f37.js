import{D as e}from"./vendor-ec34ed73.js";const n=e({list:[]}),p=e({}),r=e({});async function c(o){let t=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${o}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`),a=await t.json();console.log(a),n.set(a),t=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${o}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`),a=await t.json(),p.set(a),console.log(a);let s=a.coord.lat,i=a.coord.lon;t=await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${s}&lon=${i}&appid=d36b7ad4bedaeb47cb38553a4123c082&units=imperial`),a=await t.json(),console.log(a),r.set(a)}c("Irving,TX,US");export{r as c,p as f,c as u,n as w};
