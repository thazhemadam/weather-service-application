const request = require('request')

const forecast = ({latitude, longitude, location} = {},callback) => {

    const url = 'https://api.darksky.net/forecast/'+ process.env.DARKSKY_API +'/' + latitude + ',' + longitude + '?units=si&lang=en'

    request({url:url, json:true}, (error, {body} = {}) => {
        
        //In case the request didn't go through, mostly because of DarkSky API deprecation.
        if(error){

            const url = 'http://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid='+process.env.OWM_API

            request({url:url, json:true}, (error, response) => {
                if(error){
                    callback('Network issues',undefined)
                }

                //Invalid Openweathermap API Token
                else if(response.body.cod === 401){ 
                    callback('Weather data unavailable.', undefined)
                }
                //Successful request to OpenWeatherMap API
                else{                    
                    let forecastMessage = 'The weather currently in '+ location+' is ' + response.body.weather[0].description.toLowerCase() +', with a temperature of '+ response.body.main.temp + ' Kelvin, and a humidity of '+ response.body.main.humidity
                    // console.log(forecastMessage)                       
                    callback(undefined, {
                                            forecast: forecastMessage,
                                            location: location
                                        })
                }
            })
        
        }       

        //Invalid Dark Sky API Token
        else if(body.error){
            callback('Weather data unavailable.', undefined)
        }
        
        //Successful request to DarkSky API
        else{                        
            let forecastMessage = 'The weather currently in '+ location+' is ' + body.currently.summary.toLowerCase() +', with a temperature of '+ body.currently.temperature + '°C, and a '+ body.currently.precipProbability+ '% chance of rain.'
            callback(undefined, {
                                    forecast: forecastMessage,
                                    summary:body.currently.summary.toLowerCase(),
                                    temperature: body.currently.temperature,
                                    rainChance: body.currently.precipProbability,
                                    coordinates: {
                                                    latitude: body.latitude,
                                                    longitude: body.longitude, 
                                                },
                                    location: location,
                                    timezone: body.timezone,
                                })
        }
    })
    
}

module.exports = {forecast: forecast}
