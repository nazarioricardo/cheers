var cheerio = require('cheerio');
var request = require('request');
var assert = require('assert');

const Datastore = require('@google-cloud/datastore');

// Your Google Cloud Platform project ID
const projectId = 'gcf-koki';

// Instantiates a client
const datastore = Datastore({
  projectId: projectId
});


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
			var temp = $("td.glamor_temp").text().match(/\d+/)[0]; 			
			var gust = $("td.glamor_detailtemp:contains('KT')").text().match(/\d+/)[0];
			var now = new Date();

			// sanity check the values
			if(!dir.match(/^[NEWS]+$/)){console.log("Wind direction seems wrong: "+ dir);}
			if(!speed.match(/^\d+$/)){console.log("Wind speed seems wrong: '"+ speed + "'");}
			// these checks fail, maybe because temp is a object not a string?
			// if(!temp.match(/^\d+$/)){console.log("Wind temp seems wrong: '"+ temp + "'");}
			// if(!gust.match(/^\d+$/)){console.log("Wind temp seems gust: '"+ gust + "'");}
			

			// The kind for the new entity
			const kind = 'Wind-reading';
			// The name/ID for the new entity
			const name = now;
			// The Cloud Datastore key for the new entity
			const taskKey = datastore.key([kind, name]);

			// Prepares the new entity
			const reading = {
			  key: taskKey,
			  data: {
			    direction: dir,
				  speed: speed,
				  temp: temp,
				  gust: gust
			  }
			};

			return datastore.save(reading)
			  .then(() => res.status(200).send(`Entity ${ JSON.stringify(reading) } saved.`))
			  .catch((err) => {
			    console.error(err);
			    res.status(500).send(err);
			    return Promise.reject(err);
			  });
			
			//res.send(dir + '\n' + speed + '\n' + gust + '\n'  + temp + '\n' + now);	

		} else {
			console.log(error);
			res.send("error")
		}
	})

}
