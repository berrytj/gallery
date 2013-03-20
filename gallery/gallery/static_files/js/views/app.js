
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
			
			this.category = 'popular';
			this.page = 0;

			var callback = _.after(CALLS, this.drawGrid);
			this.getData('popular', app.Popular, callback);
			this.getData('debuts', app.Debuts, callback);
			this.getData('everyone', app.Everyone, callback);

			var that = this;
			$('.category').click(function() {

				$('#grid').html('');

				var cat = $(this).text();
				that.category = cat;
				that.drawGrid(cat, 0);

			});

			$(window).scroll(function() {

				var bottom = $(document).height() - $(window).height();

				if (bottom - $(document).scrollTop() < SCROLL_DIST) {

					that.page++;
					that.drawGrid(that.category, that.page);

				}
			});
			
		},
		
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
						callback(that.category, 0);

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

		drawGrid: function(category, page) {

			var coll;

			if (category === 'popular') {
				coll = app.Popular;
			} else if (category === 'debuts') {
				coll = app.Debuts;
			} else if (category === 'everyone') {
				coll = app.Everyone;
			}
			
			coll = coll.toArray().slice(PER_PAGE * page, PER_PAGE * (page + 1));
			
			_.each(coll, function(model) {

				var view = new app.BoxView({ model: model });
				$('#grid').append(view.render().$el);

			});

		},
		
	});
	
}());