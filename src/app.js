const path = require('path')
require('dotenv').config({path:path.resolve(__dirname,"../config/dev.env")})
const express = require('express')
const hbs = require('hbs')
const targetLocation = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT 

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Anant Thazhemadam'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us',
        name: 'R2D2.',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        helpText: 'This application can be used for procuring the weather forecast for any place required.',
        name: 'Anant Thazhemadam'
    })
})

app.get('/weather', (req, res) => {
    
    if(!req.query.address){
        return res.send({
                        error: 'Please enter an address.'})
        // return res.render('invalid_location',{
        //     title: 'Error!',
        //     error_message: 'Please enter an address.',
        //     name: 'Anant Thazhemadam'
        //     })
    }

    targetLocation.geoCode((req.query.address), (error,weather)=> {
    
        if(error){
            return res.send({error: error})
        }
        
        //FORECAST CODE
        forecast.forecast(weather, (error, response) => {
            if(error){
                return res.send({
                    error: error})
            }
            
            res.send(response)
        })
})

    
})

//Error Handling : 404 Pages.
app.get('/help/*', (req,res)=>{
    res.render('404',{
        title: 'Error 404.',
        error_message: 'Help Article is yet to be updated.',
        name: 'Anant Thazhemadam'
    })
})

app.get('*', (req,res)=>{
    res.render('404',{
        title: 'Error 404!',
        error_message: 'Page not found.',
        name: 'Anant Thazhemadam'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})