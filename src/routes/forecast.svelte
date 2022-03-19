<script>
	import Day from '../components/day.svelte';
	import Weather from '../components/weather.svelte';
	import {weather_data, forecast_data} from '../stores/weather'
	import CircularProgress from '@smui/circular-progress';


	let img 
	let temp
	let pressure 
	let wind_speed 
	let precip 


	
	
</script>

{#if $forecast_data["wind"] }
<Weather weather_img={img} today_temp={temp} {pressure} {wind_speed} {precip} />
{:else}
<div style="display: flex; justify-content: center">
    <CircularProgress
      class="my-four-colors"
      style="height: 32px; width: 32px;"
      indeterminate
      fourColor
    />
  </div>
{/if}

<br/>
	<div class="container">
	{#each $weather_data['list'] as data, i}
	{#if i % 8 == 0}
	<div class="break"></div>
	{/if}
		<Day  timestamp={data.dt} img={data.weather[0]['icon']} temp={data.main.temp} />

	{/each}
</div>