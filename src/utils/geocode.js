const request = require('request')

const geoCode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +'.json?access_token='+process.env.MAPBOX_API+'&limit=1'

    request({url: url, json: true}, (error,{body} = {}) => {

            if(error){
                callback('Uh Oh! We seem to be unable to connect to Location Services. \nKindly check your network settings and try again.',undefined)
            }
            else if(body.message === "Not Authorized - Invalid Token"){
                callback('Uh Oh! Unfortunately, our services seem to be down at the moment. \nPlease hold on until they are back up and running again.\nAny inconvenience caused is regretted.', undefined)
            }
            
            else if(body.features.length === 0){
                callback("Uh Oh! We weren't able to narrow any location that could match what you meant. \nPlease try again with a more accurate location.", undefined)
            }
            else{
                callback(undefined, {
                    longitude: body.features[0].center[0],
                    latitude: body.features[0].center[1],
                    location: body.features[0].place_name 
                })
            }
    })
}

module.exports = {geoCode: geoCode}