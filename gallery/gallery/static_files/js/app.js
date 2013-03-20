
/*** APP VIEW ***/

var app = app || {};

(function() {
	
	'use strict';
	
	app.AppView = Backbone.View.extend({
		
		el: 'body',
		
		// Delegated events. Switch from mousedown to click for showing input?
		events: {
			'click': 'toggleInput',
		},
		
		initialize: function() {

			this.setViewVariables();
			this.setAppVariables();
			this.listen();
			this.getData();
			
		},
		
		getData: function() {
			

			
		},
		
		listen: function() {
			
			this.listenToCollection(app.Marks);
			this.listenToCollection(app.Waypoints);
			
			this.listenToUndoKeys();
			this.listenForCopyPaste();
			
			var d = app.dispatcher = _.extend({}, Backbone.Events);  // Use extend to clone other objects?
			
			d.on('zoom',           this.zoom,             this);
			d.on('undo',           this.undo,             this);
			d.on('list',           this.list,             this);
			d.on('paste',          this.pasteFromColl,    this);
			d.on('clear:redos',    this.clearRedos,       this);
			d.on('clear:selected', this.clearSelected,    this);
			d.on('undoMarker',     this.undoMarker,       this);
			d.on('close:inputs',   this.hideInputs,       this);
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