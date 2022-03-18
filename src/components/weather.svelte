<script>
	import Card from '@smui/card';
	
	import { forecast_data, update_store } from '../stores/weather.js';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';

	export let weather_img;

	export let today_temp;
	export let wind_speed;
	export let precip;
	export let pressure;

	
	let loc='';

	

	const onKeyPress = (e) => {
		if (e.charCode === 13) {
			update_store(loc.trim())
			loc=''
		}
	};
</script>



<style>
	.card-container {
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
		height: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
