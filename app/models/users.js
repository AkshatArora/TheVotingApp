'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Users = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
      publicRepos: Number
	},
   pollClicks: {
      title: String,
      options : String,
      count : Array(Number)
   }
});

module.exports = mongoose.model('User', Users);
