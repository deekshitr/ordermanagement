module.exports = function(app,passport) {

 // process the login form
  var isAuthenticated = function (req,res,next) {
 
                      if (req.isAuthenticated()) {
                        console.log("Authenticated");
                         next();
                      }
                      else{
                      console.log("Not Authenticated");
                      res.redirect('/');
                    }
                    }  

    app.post('/',
            passport.authenticate('local',{
            successRedirect : '/users',
            failureRedirect : '/'
        }));    

		app.post('/api/logout', function(req, res) {
			console.log('logout');
			
			try{
				req.logout();
				res.clearCookie('connect.sid');
				req.session.destroy();
				res.redirect('/');
			}
			catch(error){
				console.log("Error",error);
			}
			});


    
	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', isAuthenticated,function(req, res) {
		res.sendfile('./public/index.html');
	});

};
