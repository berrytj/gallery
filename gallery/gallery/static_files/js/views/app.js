
/*** APP VIEW ***/

var app = app || {};

(function() {
	
	'use strict';
	
	app.AppView = Backbone.View.extend({
		
		el: 'body',
		
		// Delegated events. Switch from mousedown to click for showing input?
		events: {
			//'click': 'toggleInput',
		},
		
		initialize: function() {

			this.getData('popular', app.Popular);
			this.getData('debut', app.Debut);
			this.getData('everyone', app.Everyone);
			this.drawGrid('Popular');
			
		},
		
		getData: function(string, coll) {
			
			var that = this;

			$.ajax({
				type: "GET",
				url: "http://api.dribbble.com/shots/" + string + "?callback=?",
				dataType: "jsonp",
				success: function(data) {
					that.saveModels(data, coll);
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

			var coll;

			if (category === 'Popular') {
				coll = app.Popular;
			} else if (category === 'Debut') {
				coll = app.Debut;
			} else if (category === 'Everyone') {
				coll = app.Everyone;
			}

			var num_rows = coll.length / 3;
			for (var i = 0; i < num_rows; i++) {
				this.drawRow(shots.slice(i, i + 3));
			}


		},

		drawRow: function(shots) {

			for (var i = 0; i < shots.length; i++) {
				model = this.createModel(shots[i]);
				var view = new app.BoxView({ shot: shots[i] });
				view.render();
			}

		},
		
		listen: function() {
			
			this.listenToCollection(app.Marks);
			var d = app.dispatcher = _.extend({}, Backbone.Events);
			d.on('zoom', this.zoom, this);

		},
		
		listenToCollection: function(coll) {
			
			var that = this;

			coll.on('add', function(model) {
				if (!model.get('silent')) that.createViewForModel(model);
			});
			
			coll.on('reset', this.renderCollection, this);
		},

		createViewForModel: function(model) {

			var Constructor = (model.type === 'mark') ? app.MarkView : app.WaypointView;
			var view = new Constructor({ model: model });
			return view.render();

		},
		
		renderCollection: function(coll) {
			coll.each(this.createViewForModel, this);
		},

		createModel: function(coll, text, pos) {

			var attributes = {
				wall: WALL_URL,
				text: text,
				x: Math.round(pos.left / app.factor),
				y: Math.round(pos.top  / app.factor)
			};

			coll.create(attributes, { success: this.createEmptyUndo });
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