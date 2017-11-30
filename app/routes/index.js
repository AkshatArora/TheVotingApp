'use strict';
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({extended:false})
var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var User = require(path + '/app/models/users.js')
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	
	app.route('/')
		.get(isLoggedIn, function (req, res) {
			
						User.find({},'pollClicks',function(err,data){
				if(err)
				throw err;
			res.render('index.ejs',{data:data});
			
			
		});});

	app.route('/login')
		.get(function (req, res) {
				User.find({},function(err,data){
				if(err)
				throw err;
				console.log(data)
			res.render('login.ejs',{data:data});
			

	})	});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
	app.route('/mypolls')
		.get(isLoggedIn, function (req, res) {
		
			User.find({'github.id':req.user.github.id},'pollClicks',function(err,data){
				if(err)
				throw err;
			res.render('mypolls.ejs',{data:data});
				console.log(data);
			})
			
			
		});
	app.route('/newpoll')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/newpoll.html');
		});
	
		app.post('/seepoll',urlencodedParser,function (req, res) {
			console.log(req.body)
			var data = (req.body);
			var count = JSON.parse(req.body.count);
			console.log(count);
	       	console.log(typeof(data));
	       	var options;
	       	User.find({_id:data.id},'pollClicks',function(err,dat){
				if(err)
				throw err;
				console.log(dat)
			options=dat[0].pollClicks.options;
			console.log(options)
			var dat =[{title:data.title,options:options,count:count,id:data.id}]
			console.log(dat)
			res.render('poll_gen.ejs',{data:dat});
			})
	       

			

		});

	app.post('/newpoll',urlencodedParser, function (req, res){
				var data=[req.body];
				console.log(req.body)
			var len = req.body.options.split('\n').length;
		var count=[];
		for(var i=0;i<len;i++)
		{count.push(1);
		}
		
		req.body['count']=count;

	
		res.render('poll_gen.ejs',{data:data});
		//console.log(data);
		});
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});
	app.route('/auth/github')
		.get(passport.authenticate('github'));
		
	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
