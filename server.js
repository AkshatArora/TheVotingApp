'use strict';
var path = process.cwd()
var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var app = express();
app.set('view engine','ejs');
var User = require(path +'/app/models/users.js');
var serv = require('http').Server(app);
var io = require('socket.io')(serv);
var user_id=0;


io.on('connection',function(socket){
	console.log('socket connection');
	socket.on ('user_details',function(data) {
	    user_id = data.id;
	 //   console.log("your github is:"+user_id);
	})
	socket.on('join',function(data){
	console.log("the data is:"+data.opt)
var newUser =new User();
			newUser.github.displayName = data.name;
			newUser.github.id = data.id;
		newUser.github.username= data.username;
      newUser.github.publicRepos= data.publicRepos;
		newUser.pollClicks.title = data.tit;
		newUser.pollClicks.options = data.opt;
		var len = data.opt.split('\n').length;
		console.log("the length is:"+len)
		var count=[];
		for(var i=0;i<len;i++)
		{count.push(1);
		}
		newUser.pollClicks.count=count;
		console.log(newUser);
		newUser.save(function(err){
			if(err)
				throw err;
		});

	});
	
	socket.on('update',function(data){
	
User.findById(data.id, function(err, p) {
  if (!p)
    console.log('Could not load Document');
  else {
    // do your updates here
    p.pollClicks.count= data.count;

    p.save(function(err) {
      if (err)
        console.log('error')
      else
        console.log('success')
    });
  }
});

			


	
		});})

require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
serv.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
