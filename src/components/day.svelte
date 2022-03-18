<script>
    import Card from '@smui/card'
    export let timestamp
    export let img
    export let temp

    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    let date = days[new Date(timestamp*1000).getDay()]
    let hour = String(new Date(timestamp*1000).getHours())
    if (parseInt(hour) > 12) {
        hour = `${parseInt(hour) - 12}` + ':00 PM'
    } else if (parseInt(hour) == 12) {
        hour = hour + ":00 PM"
    } else {
        hour = hour + ':00 AM'
    }

</script>

<Card padded>
    <div class="day">
        {date} <br/> 
        {hour}
        <br/>
        <img src={`http://openweathermap.org/img/wn/${img}@2x.png`} width=100 height=100px/> <br/> 
        {temp}ºF
    </div>   
</Card>

<style>
    .day {
        text-align: center;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        margin: 10px 53px;
    }
</style>