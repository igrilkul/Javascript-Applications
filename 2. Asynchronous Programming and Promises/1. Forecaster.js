function attachEvents() {
    let locat=$('#location');
    $('#submit').on('click',function getLocations(){
        if(locat.val().length>0)
        {

            $.ajax({
                url:'https://judgetests.firebaseio.com/locations.json',
                method:'GET',
                success:displayForecasts,
                error: ()=>{
                    console.log('error')
                }
            });
        }
    });




    function displayForecasts(locations)
    {
        let code;
        for (let i = 0; i < locations.length; i++) {
            if(locations[i].name===locat.val())
            {
                code=locations[i].code;
            }
        }


            $.ajax({
                url:`https://judgetests.firebaseio.com/forecast/today/${code}.json`,
                method:'GET',
                success:currentConditions,
                error: ()=>{
                    console.log('error')
                }
            });



            $.ajax({
                url:`https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`,
                method:'GET',
                success:upcoming,
                error: ()=>{
                    console.log('error')
                }
            });

    }

    function currentConditions(obj)
    {
        let condition = obj.forecast.condition;
        let weatherSymbol;
        let degreesSymbol='\u00B0';
        let temperature = obj.forecast.low + degreesSymbol + '/' + obj.forecast.high + degreesSymbol;
        switch (condition)
        {
            case 'Sunny': weatherSymbol='\u2600'; break;
            case 'Partly sunny': weatherSymbol='\u26C5'; break;
            case 'Overcast': weatherSymbol='\u2601'; break;
            case 'Rain': weatherSymbol='\u2614'; break;
        }
        console.log(weatherSymbol);
        let current = $('#current');
        current
            .append($('<span class="condition symbol">)').text(weatherSymbol))
            .append($('<span class="condition">')
                .append($('<span class="forecast-data">').text(obj.name))
                .append($('<span class="forecast-data">').text(temperature))
                .append($('<span class="forecast-data">').text(obj.forecast.condition))
            );
        $('#forecast').css('display','block');
    }

    function upcoming(obj)
    {
        console.log(obj);
        let threeDaysGrace=$('#upcoming');
        let weatherSymbol;
        let degreesSymbol='\u00B0';
        for(let j=0;j<obj.forecast.length;j++)
        {
            console.log('h');
            let condition = obj.forecast[j].condition;
            let temperature = obj.forecast[j].low + degreesSymbol + '/' + obj.forecast[j].high + degreesSymbol;
            switch (condition)
            {
                case 'Sunny': weatherSymbol='\u2600'; break;
                case 'Partly sunny': weatherSymbol='⛅'; break;
                case 'Overcast': weatherSymbol='\u2601'; break;
                case 'Rain': weatherSymbol='\u2614'; break;
            }


            threeDaysGrace
                .append($('<span class="upcoming">')
                    .append($('<span class="symbol">)').text(weatherSymbol))
                    .append($('<span class="forecast-data">').text(temperature))
                    .append($('<span class="forecast-data">').text(condition))

                );
        }
        }
}

