var app = app || {};

(function() {
	
	'use strict';
	
	app.Box = Backbone.Model.extend({
		sync: function() {},
	});

	var BoxSet = Backbone.Collection.extend({
		model: app.Box,
		url: '/',
	});
	
	app.colls = {};
	app.colls['popular']  = new BoxSet();
	app.colls['debuts']   = new BoxSet();
	app.colls['everyone'] = new BoxSet();

}());