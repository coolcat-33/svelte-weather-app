<script>
    import { update_store } from '../stores/weather.js'
    import { onMount } from 'svelte';
    let loc = ''

    async function getPosition(position) {
      console.log(position)
      let res = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=d36b7ad4bedaeb47cb38553a4123c082`)
      let data = await res.json()
      loc = data["name"]+"," + data["country"]
      console.log(data)
      update_store(loc.trim())
    }

    onMount( async ()=> {
        console.log("mounted")
      navigator.geolocation.getCurrentPosition(async (position)=> {
        await getPosition(position)
      });
    })
</script>
