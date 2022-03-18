<script>

	import { current_data } from '../stores/weather.js';
	import Paper, { Title, Content } from '@smui/paper';
    export let data

	let hour = new Date(data['dt']*1000).toLocaleTimeString()
    let temp = String(data['temp']) + ' ºF'
    let feels_like = String(data['feels_like']) + ' ºF'
    let humidity = data['humidity']
    let wind_dir
    let uvi = data['uvi']
    // let pressure = data['pressure']
    let wind_speed = data['wind_speed']
	let date = new Date(data['dt']*1000).getDate()
	let months = {0: 'January', 1:'February', 2:'March', 3:'April', 4:'May', 5: 'June', 6:'July', 7:'August', 8:'September', 9:'October', 10:'November', 11: 'December'}
	let month = months[new Date(data['dt']*1000).getMonth()]
	let day = month + ' ' + date
	


	if (
		$current_data['hourly'][0]['wind_deg'] <= 360 &&
		$current_data['hourly'][0]['wind_deg'] > 315
	) {
		wind_dir = 'North';
	} else if (
		$current_data['hourly'][0]['wind_deg'] <= 315 &&
		$current_data['hourly'][0]['wind_deg'] > 270
	) {
		wind_dir = 'Northwest';
	} else if (
		$current_data['hourly'][0]['wind_deg'] <= 270 &&
		$current_data['hourly'][0]['wind_deg'] > 225
	) {
		wind_dir = 'West';
	} else if (
		$current_data['hourly'][0]['wind_deg'] <= 225 &&
		$current_data['hourly'][0]['wind_deg'] > 180
	) {
		wind_dir = 'Southwest';
	} else if (
		$current_data['hourly'][0]['wind_deg'] <= 180 &&
		$current_data['hourly'][0]['wind_deg'] > 135
	) {
		wind_dir = 'South';
	} else if (
		$current_data['hourly'][0]['wind_deg'] <= 135 &&
		$current_data['hourly'][0]['wind_deg'] > 90
	) {
		wind_dir = 'Southeast';
	} else if (
		$current_data['hourly'][0]['wind_deg'] <= 90 &&
		$current_data['hourly'][0]['wind_deg'] > 45
	) {
		wind_dir = 'East';
	} else if (
		$current_data['hourly'][0]['wind_deg'] <= 45 &&
		$current_data['hourly'][0]['wind_deg'] > 0
	) {
		wind_dir = 'Northeast';
	}
</script>

<!-- <Card padded
	>{hour}  {date}<br><br/>Temp: {temp} <br /><br />Feels like: {feels_like} <br /><br /> Humidity: {humidity}
	<br /><br /> UV Index: {uvi} <br /><br /> Pressure: {pressure} mb <br /><br />Wind Speed: {wind_speed}
	mph {wind_dir}</Card>  -->
<div class='container'>
	<Paper color="primary" variant="outlined" class="mdc-theme--primary">
		<Title>{hour} {day}</Title>
		<Content>
			Temp: {temp}<br />Feels like: {feels_like}<br /> Humidity: {humidity}
		<br /> UV Index: {uvi}<br /> Wind Speed: {wind_speed}
		mph {wind_dir}
		</Content>
	</Paper>

</div>


