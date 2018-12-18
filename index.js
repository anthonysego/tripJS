var express = require('express');
var app = express();

var exphbs = require('express-handlebars'); 
app.engine('handlebars', exphbs({defaultLayout: 'main'})); 
app.set('view engine', 'handlebars');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))  // serve static file

var Trip = require('./modules/Trip.js');


app.get('/', function(req, res) {   // default route, displays showAll
     res.redirect('/showAll'); 
});

app.get('/showAll', function(req, res) {   // Retrieve all, GET req from link in nav bar
                                             
    Trip.find( function(err, allTrips) {  
		if (err) {
		    res.render('resultPage', {result : err});
		}
		else {
		    if (allTrips.length == 0) {  
				res.render('resultPage', {result : "No trip found."});   
		    }
		    else {
			   res.render('showAll', { trips: allTrips });
		    }
		}
	});
})

app.get('/addTripForm', function(req, res) { 
		res.render('addTripForm');

});

app.post('/addTripForm', function(req, res) {

		var newTrip = new Trip ({             
			date: req.body.date,   // create trip instance, date should be unique
			city: req.body.city,
			miles: req.body.miles,
			gallons: req.body.gallons
		});

		newTrip.save( function(err) {    // save trip instance
			if (err) {
				res.render('resultPage', {result : err});
			}
			else {
				var msg = "New trip added to the db";
			    res.render('resultPage', {result : msg});   // display result
				}
		}); 
});

app.get('/editTripForm', function(req, res) {

	var date = req.query.date;

	Trip.findOne({date: date}, function(err, aTrip) {
		if (err) {
				res.render('resultpage', {result : err});   
		}
		else if (!aTrip) {
				res.render('resultpage', {result : 'No Trip on that date.'});   
		}
		else {		
		    console.log(aTrip)
			res.render('editTripForm', {tripData: aTrip});
		} 

	});
 });

app.post('/editTripForm', function(req, res) {

	var dateFind = req.body.date;
    var updateMiles = req.body.newMiles;
    var updateGallons = req.body.newGallons;
    
    Trip.findOne({date: dateFind}, function(err, trip){
    if (err) {
    	res.render('resultpage', {result : err});
    }
    else if (!trip) {
    	console.log(date + updateMiles + updateGallons);
    	res.render('resultpage', {result : 'No trip on that date.'});
    }
    else {
			if(updateMiles) trip.miles = updateMiles;
			if(updateGallons) trip.gallons = updateGallons;

			trip.save(function (err) {
		        if(err) {
		        	console.log('Updated Trip Saved in Database')
		            res.render('resultPage', {result : err});
		        }
		    });

			var msg = "Trip has been updated";

		    res.render('resultPage', { result : msg });
    	
	    }
	});      
});

app.use('/getCityForm', function(req, res) {  
	if(req.method == "GET") {
		res.render('getCityForm');
	}
	else if(req.method == "POST"){

		var findCity = req.body.city;
		console.log(findCity);

		Trip.find({city: findCity}, function(err, allByCity) {
			if (err) {
		    	res.render('resultPage', {result : err});
			}
			else {
				if (allByCity.length == 0) {
					red.render('resultpage', {result : 'No trips found in that city'});
				}
				else {
					res.render('showAll', { trips: allByCity });
				}
			}	
		});
	}

});        



app.listen(3000,  function() {
	console.log('Listening on port 3000, ctrl-c to quit');
    });
