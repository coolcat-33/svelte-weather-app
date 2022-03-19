<script>
	import Card from '@smui/card';
	
	import { forecast_data, update_store } from '../stores/weather.js';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';


	
	let loc='';

	

	const onKeyPress = (e) => {
		if (e.charCode === 13) {
			update_store(loc.trim())
			loc=''
		}
	};
</script>
