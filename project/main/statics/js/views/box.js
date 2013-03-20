
/*** BOX VIEW ***/

var app = app || {};

(function() {
	
	'use strict';
	
	app.BoxView = Backbone.View.extend({
		
		className: 'box',
		
		template: _.template( $('#box-template').html() ),

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
		
	});

}());