var cheerio = require('cheerio');
var request = require('request');

exports.helloWorld = (req, res) => res.send("Hello, World!");

exports.get = function get (req, res) {

	url = 'http://www.weatherlink.com/user/cokikite/index.php?view=main&headers=0'
    request(url, function(error, response, html){
		
		if(!error){ 
            // uncomment next line and it kills Functions emulator 
			var $ = cheerio.load(html);
			
			var speed, direction;
			var json = { speed : "", direction : ""};
			
		    $('.header').filter(function(){

		             // Let's store the data we filter into a variable so we can easily see what's going on.

		                  var data = $(this);

		             // In examining the DOM we notice that the title rests within the first child element of the header tag. 
		             // Utilizing jQuery we can easily navigate and get the text by writing the following code:

		                  title = data.children().first().text();

		             // Once we have our title, we'll store it to the our json object.

		                  json.title = title;
						  
		       })
		}
	})

  const key = getKeyFromRequestData(req.body);

  return datastore.get(key)
    .then(([entity]) => {
      // The get operation will not fail for a non-existent entity, it just
      // returns null.
      if (!entity) {
        throw new Error(`No entity found for key ${key.path.join('/')}.`);
      }

      res.status(200).send(entity);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
      return Promise.reject(err);
    });
};