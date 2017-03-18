var cheerio = require('cheerio');
var request = require('request');

exports.helloWorld = (req, res) => res.send("Cheerio, World!");

exports.hello = function (req, res) {

	url = 'http://www.weatherlink.com/user/cokikite/index.php?view=main&headers=0'
    request(url, function(error, response, html){
		
		if(!error){ 
			// log something
			var $ = cheerio.load(html);
			var speed = $("td.glamor_datatemp:contains('KT')").text(); 
			var temp = $("td.glamor_temp").text().match(/\d+/); 			
			var gust = $("td.glamor_detailtemp:contains('KT')").text().match(/\d+/);

			res.send(speed.substring(0,speed.length-3) + '\n' + gust + '\n'  + temp);	

		} else {
			console.log(error);
			res.send("error")
		}
	})

}
