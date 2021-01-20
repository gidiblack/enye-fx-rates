const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const favicon = require('express-favicon');

let app = new express();
// eslint-disable-next-line no-undef
app.use(favicon(__dirname +'/public/favicon.ico'));
// app.use(express.static(__dirname +'/public/favicon.ico'));

// Body parser middleware adds a query key to the request object and
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const forex_rates_api_url = `https://api.exchangeratesapi.io/latest`;

// Function to handle the root path
app.get('/', (req, res) => {
    return res.json({
        message: 'Welcome to Enye FX Rates',
        status: true,
    });
});

// Function to handle get request
app.get('/api/rates', async (req, res) => {
  // wrap process in a try-catch block to handle unexpected errors
    try {
        const queryParams = req.query;
        console.log({params: req.params, queryParams});
        // make request to external API
        const result = await axios.get(forex_rates_api_url, {
                params: {
                    base: queryParams.base,
                    symbols: queryParams.currency
                }
            })
            // then return true if response is successful
            .then(function (response) {
                return {
                    status: true, data: response.data
                };
            })
            // if not, catch the unsuccessful response
            .catch(function (error) {
                const errorObj = error.response.data;
                console.log({errorObj});
                return {
                    status: false, error_message: errorObj.error
                }
            });
          // if result status is true, return res.json object
        if (result.status) {
            const responseData = result.data;
            return res.json({
                results: {
                    base: responseData.base,
                    date: responseData.date,
                    rates: responseData.rates
                }
            });
        }
        // else return error with error message
        return res.status(400).json({
            message: result.error_message,
            status: false,
        });
    } catch (e) {
        console.error({
            message: e.message,
            trace: e
        });
        return res.status(500).json({
            message: 'Something went wrong!',
            status: false,
        });
    }
});
const PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log(`Application is runnig at http://localhost:${PORT}`);
});