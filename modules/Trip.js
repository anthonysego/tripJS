var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/travel');  // db name is travel

var tripSchema = new mongoose.Schema({
	date: {type: String, required: true, unique: true},
	city: {type: String, required: true},
	miles: {type: String, required: true},
	gallons: {type: Number, required: true}
});

tripSchema.virtual('mpg').get(function() {  
	var mpg = (this.miles/this.gallons).toFixed(2);
    return mpg;
});

module.exports = mongoose.model('Trip', tripSchema);

