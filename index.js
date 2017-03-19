var cheerio = require('cheerio');
var request = require('request');
var assert = require('assert');

exports.helloWorld = (req, res) => res.send("Cheerio, World!");

// set 
// function set(record) {
// const entity = {
//   key: key,
//   data: req.body.value
// };
//
//
//
// return datastore.save(entity)
//   .then(() => res.status(200).send(`Entity ${key.path.join('/')} saved.`))
//   .catch((err) => {
//     console.error(err);
//     res.status(500).send(err);
//     return Promise.reject(err);
//   });
//
// }

  
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
			var now = new Date();

			assert(dir.match(/[NEWS]+/),"direction has only NEWS characters");
			res.send(dir + '\n' + speed + '\n' + gust + '\n'  + temp + '\n' + now);	

		} else {
			console.log(error);
			res.send("error")
		}
	})

}
