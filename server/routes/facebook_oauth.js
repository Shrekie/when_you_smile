const express = require('express');
const router = express.Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const bodyParser = require('body-parser');

const User = require('./../models/user');

// passportjs initialization and strategy call.
router.use(bodyParser.json());
router.use(passport.initialize());
router.use(passport.session());

passport.use(new FacebookStrategy({
	clientID: process.env.clientID,
	clientSecret: process.env.clientSecret,
	callbackURL: "/auth/facebook/callback"
},
	function(accessToken, refreshToken, profile, done) {
		
	    var searchQuery = {
	    	profileID: profile.id
	    };

	    var updates = {
			name: profile.displayName,
            profileID: profile.id,
            accessToken: accessToken
	    };

	    var options = {
	    	upsert: true,
	    	new: true
	    };

	    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
			if(err) {
				return done(null, err);
			} else {
				return done(null, user);
			}
	    });
		  
	}
));

// Authentication routes
router.get('/auth/facebook', 
    passport.authenticate('facebook',
    { scope: ['publish_actions'] }));

router.get('/auth/facebook/callback', 
passport.authenticate('facebook', { 
	failureRedirect: '/error',
	successRedirect: '/userLogin'
}));

// Serialize user information <->
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = router;