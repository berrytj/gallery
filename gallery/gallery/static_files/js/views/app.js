
/*** APP VIEW ***/

var app = app || {};
var PER_ROW = 3;

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
			
		},
		
		getData: function(string, coll, callback) {
			
			var that = this;

			$.ajax({
				type: "GET",
				url: "http://api.dribbble.com/shots/" + string + "?callback=?",
				dataType: "jsonp",
				success: function(data) {
					that.saveModels(data, coll);
					callback(that, 'Popular');
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

		drawGrid: function(that, category) {
			
			var coll;

			if (category === 'Popular') {
				coll = app.Popular;
			} else if (category === 'Debuts') {
				coll = app.Debuts;
			} else if (category === 'Everyone') {
				coll = app.Everyone;
			}

			coll = _.toArray(coll);

			for (var i = 0; i < coll.length / PER_ROW; i++) {
				that.drawRow(coll.slice(i, i + PER_ROW));
			}

		},

		drawRow: function(models) {
			
			for (var i = 0; i < models.length; i++) {
				var view = new app.BoxView({ model: models[i] });
				this.$el.append(view.render().$el);
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