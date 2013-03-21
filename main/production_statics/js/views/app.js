
/*** APP VIEW ***/

var app = app || {};
var SCROLL_DIST = 30;
var TOTAL = 150;
var PER_CALL = 30;
var CATEGORIES = 3;
var CALLS_PER_CAT = TOTAL / PER_CALL;
var CALLS = CALLS_PER_CAT * CATEGORIES;
var PER_PAGE = 9;

(function() {
	
	'use strict';
	
	app.AppView = Backbone.View.extend({
		
		el: 'body',
		
		initialize: function() {
			
			_.bindAll(this); // So drawGrid's `this` is the view, not the window.

			this.category = 'popular'; // Showing the popular shots at first.
			this.page = 0; 		   // Starting on first page.

			var callback = _.once(this.drawGrid);  // Draw after first page of `popular` is retrieved (but not again).
			this.getData('popular', app.Popular, callback);
			this.getData('debuts', app.Debuts);
			this.getData('everyone', app.Everyone);

			var that = this;
			$('.category').click(function() {

				$('#grid').html('');		// Clear the grid.
				$(document).scrollTop(0);	// Scroll back to the top.

				$('.category').css('color', 'black');	// Make all categories black.
				$(this).css('color', 'red');		// Make selected category red.

				that.category = $(this).text();	// Save category as view variable.
				that.page = 0;			// Save page number as view variable.
				
				that.drawGrid();

			});

			$(window).scroll(function() {

				var bottom = $(document).height() - $(window).height();

				if (bottom - $(document).scrollTop() < SCROLL_DIST) {

					that.page++;
					that.drawGrid();  // Add more pictures to the page.

				}
			});
			
		},
		
		// Using jsonp to avoid cross-domain issues.  In a full
		// app would probably make this call on the server-side.
		getData: function(string, coll, callback) {
			
			var that = this;

			for (var i = 0; i < CALLS_PER_CAT; i++) {

				$.ajax({
					type: "GET",
					url: "http://api.dribbble.com/shots/" + string + "?callback=?",
					data: { page: i, 'per_page': PER_CALL },
					dataType: "jsonp",

					success: function(data) {

						that.saveModels(data, coll);
						if (callback) callback(that.category, 0);

					}
				});

			}

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

		drawGrid: function() {
			
			var category = this.category, page = this.page;
			var coll;

			if (category === 'popular') {
				coll = app.Popular;
			} else if (category === 'debuts') {
				coll = app.Debuts;
			} else if (category === 'everyone') {
				coll = app.Everyone;
			}
			
			// Get the chunk of the collection that corresponds to the page to be drawn.
			coll = coll.toArray().slice(PER_PAGE * page, PER_PAGE * (page + 1));
			
			_.each(coll, function(model) {

				var view = new app.BoxView({ model: model });
				$('#grid').append(view.render().$el);	// Pictures are appended, regardless of
									// whether some pics are already there.

			});

		},
		
	});
	
}());