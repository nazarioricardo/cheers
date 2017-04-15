var cheerio = require('cheerio');
var request = require('request');
var assert = require('assert');

const Datastore = require('@google-cloud/datastore');

// Your Google Cloud Platform project ID
const projectId = 'cheers-164215';

// Instantiates a client
const datastore = Datastore({
  projectId: projectId
})

const storage = require('@google-cloud/storage')({
  projectId: 'cheers-164215',
  keyFilename: '/path/to/keyfile.json'
})

const bucket = storage('coki-boket')

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
		
		if(!error) {

			// log something
			var $ = cheerio.load(html);
			var dir_speed = $("td.glamor_datatemp:contains('KT')").text().split(/\s/); 
			var dir = dir_speed[0]
			// Sometimes weatherlink shows wind speed is 'Calm' in this case old code returned undefined
			var speed = ''
			if (dir_speed[1] !== undefined) {
				speed = dir_speed[1]
			} 
			var temp = $("td.glamor_temp").text().match(/\d+/)[0]; 			
			var gust = $("td.glamor_detailtemp:contains('KT')").text().match(/\d+/)[0];
			var now = new Date()
			var date = now.toDateString()
			var time = now.toLocaleTimeString()

			/*
			
			TODO: Get date and time values from Weatherlink with REGEX in order to have accurate time for Ocean Park

			var date = $("td.glamor_timestamp>div").text().slice(39, 38)
			var time = $("td.glamor_timestamp>div").text().slice(31, 38)
			
			*/

			// sanity check the values
			// if(!dir.match(/^[NEWS]+$/)) { console.log("Wind direction seems wrong: " + dir) }
			// if(!speed.match(/^\d+$/)) { console.log("Wind speed seems wrong: " + speed) }
			// these checks fail, maybe because temp is a object not a string?
			// if(!temp.match(/^\d+$/)) { console.log("Wind temp seems wrong: '"+ temp + "'") }
			// if(!gust.match(/^\d+$/)) { console.log("Wind temp seems gust: '"+ gust + "'") }
			

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
				  gust: gust,
				  date: date,
				  time: time
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

exports.getReadings = function (req, res) {

	const date = new Date()
	const kind = 'Wind-reading'
	
	let todayString = date.toDateString()
	let windReadings = []

	const query = datastore.createQuery(kind)
		.filter('date', '=', todayString)
	
	return datastore.runQuery(query)
		.then((results) => {
			const readings = results[0]
				.sort(function(a,b) {
					return a.time < b.time ? 1 : ((b.last_nom < a.last_nom) ? -1 : 0)
				})

			console.log('Wind Readings: ')
			readings.forEach((reading) => {
				const readingKey = reading[datastore.KEY]
				windReadings.push(reading)
				console.log(readingKey.id, reading)
			})
			console.log("readings " + windReadings)

			return res.status(200).send(bucket.file('index.html'), windReadings)
		})
}