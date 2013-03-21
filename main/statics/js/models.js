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
	
	app.Popular  = new BoxSet();
	app.Debuts   = new BoxSet();
	app.Everyone = new BoxSet();

}());