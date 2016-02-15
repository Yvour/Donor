var express = require('express');

/*
 * var ip = require('ip');
 * 
 * var os = require('os');
 * 
 * var interfaces = os.networkInterfaces(); var addresses = []; for ( var k in
 * interfaces) { for ( var k2 in interfaces[k]) { var address =
 * interfaces[k][k2]; if (address.family === 'IPv4' && !address.internal) {
 * addresses.push(address.address); } } }
 * 
 * console.log(addresses);
 * 
 * console.dir(ip.address());
 * 
 */
var app = express();
app.set('view engine', 'ejs');
app
		.use('/scripts', express.static(__dirname
				+ '/node_modules/bootstrap/dist/'));
app.use('', express.static(__dirname + '/node_modules/angular-google-maps/'));
app.use('/app', express.static(__dirname + '/app', app));

var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
	extended : false
})

app.use(bodyParser.urlencoded({
	extended : true
}));

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/donor');
mongoose.connect( process.env.MONGOLAB_URI);


var db = mongoose.conection;
var Donor = mongoose.model('Donor', {
	firstname : String,
	lastname : String,
	email : String,
	phonenumber : String,
	bloodgroup : String,
	ip : String,
	geo_lng : String,
	geo_lat : String,
	address : String
}

)

app.get('/', function(req, res) {

	res.render('pages/index')
});

app.post('/donors/create', jsonParser, function(req, res) {
	/*
	 * console.log("the ip is " + req.header['x-forwarded-for']);
	 * console.log("the ip is " + req.connection.remoteAddress);
	 * console.log("the ip is " + req.ip);
	 * console.log(req.headers['x-forwarded-for'] ||
	 * req.connection.remoteAddress || req.socket.remoteAddress ||
	 * req.connection.socket.remoteAddress);
	 */
	var a = req.body;
	// a.ip = req.ip;
	var donor = new Donor({
		firstname : a.firstname,
		lastname : a.lastname,
		email : a.email,
		phonenumber : a.phonenumber,
		bloodgroup : a.bloodgroup,
		ip : a.ip,
		geo_lng : a.geo_lng,
		geo_lat : a.geo_lat,
		address : a.address
	});
	if (!req.body)
		return res.sendStatus(400);
	else
		donor.save(function(err) {
			if (err)
				console.log('error on saving' + err);
		})
	console.log(a);
	for (key in a)
		console.log("value of  " + key + " is ");// + req.body.data);

	res.end('{"success" : "Updated Successfully", "status" : 200}');
})

app.get('/donors/', function(req, res) {
	console.log('donors list')
	a = Donor.find({}).exec(function(err, result) {
		if (err != null) {
			// handle result
			// console.log('err');
			// / console.log(err);
			// console.log(result);
			res.sendStatus(400);
		} else {
			// error handling
			// console.log('result ' + result.length);
			// console.log(JSON.stringify(result));
			cleaned = [];
			for (i = 0; i < result.length; i++) {
				// console.log('email' + result[i].email);
				if (result[i].email)
					cleaned.push(result[i]);
			}
			res.send(cleaned);
		}
		;
	});

})

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

app.locals.renderScriptsTags = function() {
	// console.log(express.static(__dirname +
	// '/node_modules/bootstrap/dist/')());
	// return '<script src="/angular-google-maps.min.js"></script>';
	return ''
			+ [
			/*
			 * '//maps.googleapis.com/maps/api/js?sensor=false',
			 */
			'node_modules/lodash/lodash.js',
					'node_modules/angular/angular.min.js',
					'node_modules/angular-simple-logger/dist/angular-simple-logger.js'/*
																						 * ,
																						 * 'dist/angular-google-maps.min.js'
																						 */
			].reduce(function(prev, item) {
				return prev + '<script src="' + item + '" defer></script>\n';
			}, '')
}
