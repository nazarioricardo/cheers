var cheerio = require('cheerio');
var request = require('request');

exports.helloWorld = (req, res) => res.send("Cheerio, World!");

exports.hello = function (req, res) {

	url = 'http://www.weatherlink.com/user/cokikite/index.php?view=main&headers=0'
    request(url, function(error, response, html){
		
		if(!error){ 
			// log something
			var $ = cheerio.load(html);
			var dir_speed = $("td.glamor_datatemp:contains('KT')").text().split(/\s/); 
			var dir = dir_speed[0];
			var speed = dir_speed[1]
			var temp = $("td.glamor_temp").text().match(/\d+/); 			
			var gust = $("td.glamor_detailtemp:contains('KT')").text().match(/\d+/);

			res.send(dir + '\n' + speed + '\n' + gust + '\n'  + temp);	

		} else {
			console.log(error);
			res.send("error")
		}
	})

}
