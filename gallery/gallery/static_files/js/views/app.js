
/*** APP VIEW ***/

var app = app || {};
var PER_ROW = 3;
var SCROLL_DIST = 30;

(function() {
	
	'use strict';
	
	app.AppView = Backbone.View.extend({
		
		el: 'body',
		
		// Delegated events. Switch from mousedown to click for showing input?
		events: {
			//'click': 'toggleInput',
		},
		
		initialize: function() {

			var callback = _.after(3, this.drawGrid);
			this.getData('popular', app.Popular, callback);
			this.getData('debuts', app.Debuts, callback);
			this.getData('everyone', app.Everyone, callback);

			var that = this;
			$('.category').click(function() {
				that.drawGrid( $(this).text() );
			});

			$('body').scroll(function() {
				if ($(document).scrollTop() - $(document).height() < SCROLL_DIST)
			});
			
		},
		
		getData: function(string, coll, callback) {
			
			var that = this;

			$.ajax({
				type: "GET",
				url: "http://api.dribbble.com/shots/" + string + "?callback=?",
				dataType: "jsonp",
				success: function(data) {
					that.saveModels(data, coll);
					callback('popular');
				}
			});

		},

		saveModels: function(data, coll) {

			var shots = data.shots;

			for (var i = 0; i < shots.length; i++) {
				this.createModel(shots[i], coll);
			}

		},

		createModel: function(shot, coll) {
			
			var attributes = {
				likes:    shot['likes_count'],
				comments: shot['comments_count'],
				image:    shot['image_url'],
				title:    shot['title']
			};

			coll.create(attributes);
		},

		drawGrid: function(category) {
			
			$('#grid').html('');

			var coll;

			if (category === 'popular') {
				coll = app.Popular;
			} else if (category === 'debuts') {
				coll = app.Debuts;
			} else if (category === 'everyone') {
				coll = app.Everyone;
			}

			coll.each(function(model) {
				var view = new app.BoxView({ model: model });
				$('#grid').append(view.render().$el);
			});

		},
		
		scrollWhileSelecting: function() {

			$(window).mousemove(function(e) {

				var sens = 10, speed = 20, $d = $(document);

				if (e.pageY - $d.scrollTop() < sens) {

					$d.scrollTop($d.scrollTop() - speed);

				} else if ($(window).height() - (e.pageY - $d.scrollTop()) < sens) {

					$d.scrollTop($d.scrollTop() + speed);

				}

				if (e.pageX - $d.scrollLeft() < sens) {

					$d.scrollLeft($d.scrollLeft() - speed);

				} else if ($(window).width() - (e.pageX - $d.scrollLeft()) < sens) {

					$d.scrollLeft($d.scrollLeft() + speed);
					
				}

			});

		},
		
	});
	
}());