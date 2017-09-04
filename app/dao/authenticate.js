module.exports = function(passport,db) {
    
    var LocalStrategy   = require('passport-local').Strategy;
    var usertab=db.model('User'); 
    
      // serialize users into and deserialize users out of the session. Typically,
            passport.serializeUser(function (user, done) {
           
            done(null, user._id);
            });
            // deserializeUser is passed a function that will return the user the
            passport.deserializeUser(function (id, done) {
            usertab.findOne({_id: id}).populate('role').exec(function(err, doc) {
                    
                  usertab.populate(doc, {
                    path: 'role.access',
                    model: 'View'
                     }, function (err, user) {
          
            done(err, user);
            });
            });
});
   
    // LOCAL LOGIN =============================================================
    passport.use('local',new LocalStrategy(

        function(username, password, done) { // callback with username and password from our form
        console.log("authenticating for " + username +' ' + password);
        
    
        usertab.findOne({ 'username' :  username }, function(err,user) {
            
            console.log('found user', user);
            if (err)
                return done(err,null);

            if (!user)
                return done(null, false); 
            
            if (user.password!=password)
                return done(null, false);

           console.log("user with matching password found", user);
            return done(null, user);
        });
       

    }));

};


