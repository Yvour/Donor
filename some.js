/**
 * 
 */

 var mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost/donor');
 var Donor = mongoose.model('Donor',{
	 firstname: String,
	 lastname :String,
	 email: String,
	 phonenumber: String,
	 bloodgroup: String
 }
 
 )