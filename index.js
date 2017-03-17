var cheerio = require('cheerio');
var request = require('request');

exports.helloWorld = (req, res) => res.send("Cheerio, World!");

exports.get = function get (req, res) {

	url = 'http://www.weatherlink.com/user/cokikite/index.php?view=main&headers=0'
    request(url, function(error, response, html){
		
		if(!error){ 
			// log something
			console.log(html);
		}
	})
	res.send("yo get got");	

}
