<script>

  import { current_data, forecast_data } from '../stores/weather.js'
  import CircularProgress from '@smui/circular-progress';
  import Paper from '@smui/paper';
  import Hour from "../components/hour.svelte"
import Card from '@smui/card';
  import Tooltip, { Wrapper, Title, Content} from '@smui/tooltip'
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import Button, { Label } from '@smui/button';


    let alert_event
    let alert_start
    let alert_end
    let alert_description
    let wind_dir;
    let months = {0: 'January', 1:'February', 2:'March', 3:'April', 4:'May', 5: 'June', 6:'July', 7:'August', 8:'September', 9:'October', 10:'November', 11: 'December'}

    if ($current_data['alerts'] != undefined) {
      alert_event = $current_data['alerts'][0]['event']
      alert_start = new Date($current_data['alerts'][0]['start']*1000).toLocaleTimeString() + ' ' + months[new Date($current_data['alerts'][0]['start']*1000).getMonth()] +' '+ new Date($current_data['alerts'][0]['start']*1000).getDate()
      alert_end = new Date($current_data['alerts'][0]['end']*1000).toLocaleTimeString() + ' ' + months[new Date($current_data['alerts'][0]['start']*1000).getMonth()] +' '+ new Date($current_data['alerts'][0]['start']*1000).getDate()
      alert_description = $current_data['alerts'][0]['description']
  };

  if ($forecast_data['wind']['deg'] <= 360 && $forecast_data['wind']['deg'] > 315) {
		wind_dir = 'North';
	} else if ($forecast_data['wind']['deg'] <= 315 && $forecast_data['wind']['deg'] > 270) {
		wind_dir = 'Northwest';
	} else if ($forecast_data['wind']['deg'] <= 270 && $forecast_data['wind']['deg'] > 225) {
		wind_dir = 'West';
	} else if ($forecast_data['wind']['deg'] <= 225 && $forecast_data['wind']['deg'] > 180) {
		wind_dir = 'Southwest';
	} else if ($forecast_data['wind']['deg'] <= 180 && $forecast_data['wind']['deg'] > 135) {
		wind_dir = 'South';
	} else if ($forecast_data['wind']['deg'] <= 135 && $forecast_data['wind']['deg'] > 90) {
		wind_dir = 'Southeast';
	} else if ($forecast_data['wind']['deg'] <= 90 && $forecast_data['wind']['deg'] > 45) {
		wind_dir = 'East';
	} else if ($forecast_data['wind']['deg'] <= 45 && $forecast_data['wind']['deg'] > 0) {
		wind_dir = 'Northeast';
	}

</script>

<LayoutGrid>
	<Cell span={3}>
		<Card
			padded
		>
			<img alt=''
				src={`https://openweathermap.org/img/wn/${$forecast_data['weather'][0]['icon']}@2x.png`}
				width="100px"
				height="100px"
			/>
			Description: {$forecast_data['weather'][0]['description']}
		</Card>
	</Cell>

<Cell span={3}>
  <div class="card-container">
    <Card padded
      >Current Temp: {$forecast_data['main']['temp']}ºF<br /><br /> Feels like: {$forecast_data[
        'main'
      ]['feels_like']}ºF<br /><br />Hourly High Temp: {$forecast_data['main']['temp_max']}ºF<br
      /><br />Hourly Low Temp: {$forecast_data['main']['temp_min']}ºF</Card
    >
  </div>
</Cell>

	

	<Cell span={3}>
		<div class="card-container">
			<Card padded>
				Wind: {$forecast_data['wind']['speed']} mph {wind_dir}<br /><br />Pressure: {$forecast_data[
					'main'
				]['pressure']} mb
			</Card>
		</div>
	</Cell>
	<Cell span={3}>
		<div class="card-container">
			<Card padded
        >Sunrise: {(new Date($forecast_data['sys']['sunrise']*1000)).toLocaleTimeString()}<br /><br /> Sunset: {(new Date($forecast_data['sys']['sunset'])).toLocaleTimeString()}</Card
			>
		</div>
	</Cell>
</LayoutGrid>
{#if $current_data['hourly']!==undefined}
<div class="container">
    

    {#each Array(12) as _, i}
	{#if i % 4 == 0}
	<div class="break"></div>
	{/if}
      <Hour data={$current_data["hourly"][i]}/>

    {/each}

</div>
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

{#if $current_data["alerts"] !== undefined}
<div>
  <Paper  color="primary" variant="outlined" class="mdc-theme--primary">
		<Title>{alert_event}</Title>
		<Content>
      {alert_start} - {alert_end}
      <br/>
      {alert_description}
		</Content>
	</Paper>
</div>
{/if}
