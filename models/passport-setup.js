const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const GoogleUser = require("./googleUser");

passport.serializeUser((user,done) => {
    done(null, user.id);
});
passport.deserializeUser((id,done) => {
    GoogleUser.findById(id).then((user) => {
        done(null, user.id);
    });   
});

passport.use(
    new GoogleStrategy({
        callbackURL:'/auth/google/reqtask',
        clientID: "210187313481-k2gdfh7gdh2p9bfgi4ggk0dkvb3k4ush.apps.googleusercontent.com",
        clientSecret: "vVzERL0oHCLrr8xpY6PxEawx"
    }, (accessToken, refreshToken, profile, done) => {
        GoogleUser.findOne({googleId: profile.id}).then((currentUser)=> {
            if(currentUser){
                console.log('user is: '+ currentUser);
                done(null, currentUser);
            } else {
                new GoogleUser({
                    username: profile.displayName,
                    googleId: profile.id
                }).save().then((newUser)=>
                console.log('new user created: '+newUser));
                done(null, newUser);
            }
        })
        
    })
)
