const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
require('dotenv').config();

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3000/login/twitter/callback'
        : 'https://octas.herokuapp.com/login/callback',
  },
  function(token, tokenSecret, profile, done) {
    //passport.session.id = profile.id;

    // tokenとtoken_secretをセット
    //profile.twitter_token = token;
    //profile.twitter_token_secret = tokenSecret;

    process.nextTick(function () {
        return done(null, profile);
    });
  }
));

exports.passport = passport;