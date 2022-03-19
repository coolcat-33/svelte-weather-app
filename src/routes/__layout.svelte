<script>
    import TabBar  from '@smui/tab-bar'
    import Tab, { Label } from '@smui/tab'
    import Current from './current.svelte'
    import Forecast from './forecast.svelte'
    import Textfield from '@smui/textfield'
    import HelperText from '@smui/textfield/helper-text';
    import { update_store, location } from '../stores/weather.js'
  

    let active="Forecast"
    $: loc=$location;
  
    const onKeyPress = (e) => {
    if (e.charCode === 13) {
      update_store(loc.trim())
    }

}

</script>


<TabBar tabs={['Current', 'Forecast']} let:tab bind:active>
    <!-- Note: the `tab` property is required! -->
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
</TabBar>

<div>
	<Textfield bind:value={loc} label="Location" on:keypress={onKeyPress} >
		<HelperText slot="helper">Ex: Irving,TX,USA</HelperText>
	</Textfield>
</div>


{#if active =="Current"}
<Current/>

{:else}
    <Forecast />
{/if}