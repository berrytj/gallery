
/*** BOX VIEW ***/

(function() {
	
	'use strict';
	
	app.MarkView = app.ObjectView.extend({
		
		className: 'box',
		
		template: _.template( $('#box-template').html() ),
		
		events: {
			'click': 'respondToClick',	
		},
		
		initialize: function() {
			
		},
		
	});

});