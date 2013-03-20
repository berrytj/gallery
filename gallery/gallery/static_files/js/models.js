var app = app || {};

(function() {
	
	'use strict';
	
	app.Box = Backbone.Model.extend({});

	var BoxSet = Backbone.Collection.extend({
		model: app.Box,
	});
	
	app.Popular  = new BoxSet();
	app.Debut    = new BoxSet();
	app.Everyone = new BoxSet();

}());