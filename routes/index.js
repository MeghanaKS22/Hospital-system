const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Diagnosis = require('../models/Diagnosis');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        user: req.user.username,
        id: req.user.id
    }));

router.get('/addpatient', ensureAuthenticated, (req, res) =>
    res.render('add_patient', { user: req.user.username, id: req.user.id }));

router.post('/addpatient', (req, res) => {
    const { firstname, lastname, sex, phoneNumber, status, bg, genotype, nationality } = req.body;
    let errors = [];

    if (!firstname || !lastname || !sex || !phoneNumber || !status || !bg || !genotype || !nationality) {
        errors.push({ msg: "Please fill in all fields." });
    }

    if (errors.length > 0) {
        res.render('add_patient', {
            user: req.user.username,
            id: req.user.id,
            errors,
            firstname,
            lastname,
            sex,
            phoneNumber,
            status,
            bg,
            genotype,
            nationality
        });
    } else {
        const newPatient = new Patient({
            firstname,
            lastname,
            sex,
            phoneNumber,
            maritalStatus: status,
            bloodGroup: bg,
            genotype,
            nationality,
            username: req.user.username
        });

        newPatient.save()
            .then(patient => {
                req.flash('success_msg', "Patient added successfully.");
                res.redirect('/addpatient');
            })
            .catch(err => {
                console.error(err);
                req.flash('error_msg', "Failed to add patient.");
                res.redirect('/addpatient');
            });
    }
});

router.get('/viewpatient', ensureAuthenticated, (req, res) =>
    Patient.find({ username: req.user.username })
        .then(result => {
            res.render('view_patient', {
                user: req.user.username,
                id: req.user.id,
                result: result
            });
        })
        .catch(err => {
            console.error(err);
            req.flash('error_msg', "Failed to fetch patients.");
            res.redirect('/dashboard');
        }));

router.get('/adddiagnosis', ensureAuthenticated, (req, res) =>
    res.render('add_diagnosis', { user: req.user.username, id: req.user.id }));

router.post('/adddiagnosis', (req, res) => {
    const { patientid, complaint, recommendation } = req.body;

    const newDiagnosis = new Diagnosis({
        patientid,
        username: req.user.username,
        complaint,
        recommendation
    });

    newDiagnosis.save()
        .then(diagnosis => {
            req.flash('success_msg', "Diagnosis added successfully.");
            res.redirect('/adddiagnosis');
        })
        .catch(err => {
            console.error(err);
            req.flash('error_msg', "Failed to add diagnosis.");
            res.redirect('/adddiagnosis');
        });
});

router.get('/viewdiagnosis/:patientid', ensureAuthenticated, (req, res) =>
    Diagnosis.find({ patientid: req.params.patientid })
        .then(result => {
            res.render('view_diagnosis', {
                user: req.user.username,
                id: req.user.id,
                result: result
            });
        })
        .catch(err => {
            console.error(err);
            req.flash('error_msg', "Failed to fetch diagnosis.");
            res.redirect('/dashboard');
        }));

module.exports = router;
