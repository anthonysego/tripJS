var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/adminlist');  // db name is adminlist

var adminSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	role: {type: String, required: true}
});

module.exports = mongoose.model('Admin', adminSchema);

