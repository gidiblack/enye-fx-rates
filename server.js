const express = require('express');
const bodyParser = require('body-parser');
// const querystring = require('querystring');
// const url = require('url');

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const api_url = `https://api.exchangeratesapi.io/latest`;

// Function to handle the root path
app.get('/', async (req, res) => {
  res = await fetch(api_url);
  const json = await res.json();
  console.log(json);
});

app.listen(8000, function() {
  console.log('Server is listening on port 8000');
});