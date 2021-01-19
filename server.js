const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
// const querystring = require('querystring');
// const url = require('url');

let app = express();

// Body parser middleware add a query key to the request object and
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const forex_rates_api_url = `https://api.exchangeratesapi.io/latest`;

// Function to handle the root path
app.get('/', async (req, res) => {
    return res.json({
        message: 'Welcome to Enye FX Rates',
        status: true,
    });
});

// Function to handle the root path
app.get('/api/rates', async (req, res) => {
    try {
        const queryParams = req.query;
        console.log({params: req.params, queryParams});
        const result = await axios.get(forex_rates_api_url, {
                params: {
                    base: queryParams.base,
                    symbols: queryParams.currency
                }
            })
            .then(function (response) {
                return {
                    status: true, data: response.data
                };
            })
            .catch(function (error) {
                const errorObj = error.response.data;
                console.log({errorObj});
                return {
                    status: false, error_message: errorObj.error
                }
            });
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