
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
			this.getData('popular', callback);
			this.getData('debuts');
			this.getData('everyone');

			this.categoryClick();
			this.infiniteScroll();

		},

		// When user selects a category, empty the page and
		// repopulate with shots from the category.
		categoryClick: function() {

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

		},

		// When user reaches the bottom of the page (within
		// SCROLL_DIST), append more shots to the document.
		infiniteScroll: function() {

			var that = this;

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
		getData: function(category, callback) {
			
			var that = this;

			for (var i = 0; i < CALLS_PER_CAT; i++) {

				$.ajax({
					type: "GET",
					url: "http://api.dribbble.com/shots/" + category + "?callback=?",
					data: { page: i, 'per_page': PER_CALL },
					dataType: "jsonp",

					success: function(data) {

						that.saveModels(data, app.colls[category]);
						if (callback) callback(that.category, 0);

					}
				});

			}

		},

		// Iterate through JSON data, saving shots to collection.
		saveModels: function(data, coll) {
			
			var shots = data.shots;

			for (var i = 0; i < shots.length; i++) {
				this.createModel(shots[i], coll);
			}

		},

		// Save appropriate data from a shot into a model
		// and add it to a collection.
		createModel: function(shot, coll) {
			
			var attributes = {
				likes:    shot['likes_count'],
				comments: shot['comments_count'],
				image:    shot['image_url'],
				title:    shot['title']
			};

			coll.create(attributes);
		},

		// Find the appropriate shots and append their views
		// to the document.
		drawGrid: function() {
			
			// Get the chunk of the collection that corresponds to the page to be drawn.
			var coll = app.colls[this.category]
				      .toArray()
				      .slice(PER_PAGE * this.page, PER_PAGE * (this.page + 1));
			
			_.each(coll, function(model) {

				var view = new app.BoxView({ model: model });
				$('#grid').append(view.render().$el);	// Pictures are appended, regardless of
									// whether some pics are already there.
			});

		},
		
	});
	
}());