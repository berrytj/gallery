
/*** BOX VIEW ***/

var app = app || {};

(function() {
	
	'use strict';
	
	app.BoxView = Backbone.View.extend({
		
		className: 'box',
		
		template: _.template( $('#box-template').html() ),
		
		events: {
			'click': 'respondToClick',	
		},
		
		initialize: function(options) {
			this.shot = options.shot;
		},

		render: function() {
			this.$el.html(this.template(this.shot.toJSON()));
		},

		respondToClick: function() {

		},
		
	});

}());