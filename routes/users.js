const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Doctor = require('../models/Doctors');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Registration Handle
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, gender, phoneNumber, qualification, specialization, nationality, registrationNumber, hospitalName, username, password, password1 } = req.body;

        let errors = [];
        // Check Required Fields
        if (!firstname || !lastname || !gender || !phoneNumber || !qualification || !specialization || !nationality || !registrationNumber || !hospitalName || !username || !password || !password1) {
            errors.push({ msg: "All fields are required" });
        }

        if (password !== password1) errors.push({ msg: "Passwords do not match" });

        if (password.length < 6) {
            errors.push({ msg: "Password should be at least 6 characters" });
        }

        if (errors.length > 0) {
            return res.render('register', {
                errors,
                firstname,
                lastname,
                gender,
                phoneNumber,
                qualification,
                specialization,
                nationality,
                registrationNumber,
                hospitalName,
                username,
                password,
                password1
            });
        } else {
            let doctor = await Doctor.findOne({ username });
            if (doctor) {
                errors.push({ msg: "Username is already taken" });
                return res.render('register', {
                    errors,
                    firstname,
                    lastname,
                    gender,
                    phoneNumber,
                    qualification,
                    specialization,
                    nationality,
                    registrationNumber,
                    hospitalName,
                    username,
                    password,
                    password1
                });
            }

            const newDoctor = new Doctor({
                firstname,
                lastname,
                gender,
                phoneNumber,
                qualification,
                specialization,
                nationality,
                registrationNumber,
                hospitalName,
                username,
                password
            });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newDoctor.password, salt);
            newDoctor.password = hashedPassword;

            await newDoctor.save();
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true // Enable flash messages for failures
    })(req, res, next);
});


// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/login');
});

module.exports = router;
