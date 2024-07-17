
	const mongoose = require('mongoose');

	const diagnosisSchema = new mongoose.Schema({
		patientid: {
			type:String,
			required: true
		},

		username: {
			type:String,
			required: true
		},

		complaint: {
			type:String,
			required: true
		},
		recommendation: {
			type:String,
			required:true
		},

		date: {
			type:Date,
			default: Date.now
		},
	});

	const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

	module.exports = Diagnosis;