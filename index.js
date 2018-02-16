const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const server = express();

server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-quote', function (req, res) {
    console.log("inside get movie details");
       
    let reqUrl= encodeURI('http://api.forismatic.com/api/1.0/json?method=getQuote&lang=en&format=json');
    console.log("reqUrl=>"+reqUrl);
    http.get(reqUrl, (responseFromAPI) => {
        var body="";
        responseFromAPI.on('data', function (chunk) {
            body += chunk;
            console.log("body=>"+body);                   
        });
        responseFromAPI.on('end', function() {
            body = body.replace(/\\/g,'');
            var quote = JSON.parse(body);
            let dataToSend = quote.quoteText + ' by '+ quote.quoteAuthor;
            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-quote'
            });
          });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-quote'
        });
    });
});

server.listen((process.env.PORT || 8081), function () {
    console.log("Server is up and running...");
});