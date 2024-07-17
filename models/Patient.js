
	const mongoose = require('mongoose');

	const patientSchema = new mongoose.Schema({
		firstname:{
			type:String,
			required: true
		},

		lastname:{
			type:String,
			required: true
		},

		sex:{
			type:String,
			required: true
		},

		phoneNumber:{
			type:String,
			required: true
		},

		maritalStatus:{
			type:String,
			required: true
		},

		bloodGroup:{
			type:String,
			required: true
		},

		genotype:{
			type:String,
			required: true
		},

		nationality:{
			type:String,
			required: true
		},
		username: {
			type:String,
			required:true
		},

		date_registered:{
			type:Date,
			default:Date.now
		}
	});

	const Patient = mongoose.model('Patient', patientSchema);

	module.exports = Patient;