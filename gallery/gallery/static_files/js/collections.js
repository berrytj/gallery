var app = app || {};

(function() {
    
    'use strict';
    
    window.TastypieCollection = Backbone.Collection.extend({
        
        parse: function(response) {
            this.recent_meta = response.meta || {};
            return response.objects || response;
        }
        
    });
    
    
    // Mark Collection
    // ---------------
    
	var MarkSet = window.TastypieCollection.extend({
	    
		model: app.Mark,
		url: API_NAME + "/mark",
		
	});
	
	// Create our global collection of **Marks**.
	app.Marks = new MarkSet();
	
	
	// Waypoint Collection
    // -------------------
    
	var WaypointSet = window.TastypieCollection.extend({
	    
		model: app.Waypoint,
		url: API_NAME + "/waypoint",
		
	});
	
	// Create our global collection of **Waypoints**.
	app.Waypoints = new WaypointSet();
	
	
	// Undo Collection
    // ---------------
	
	var UndoSet = window.TastypieCollection.extend({
	    
		model: app.Undo,
		url: API_NAME + "/undo",
		name: "undo",
		
	});
	
	// Create our global collection of **Undos**.
	app.Undos = new UndoSet();
	app.Undos.comparator = function(model) {
		return parseInt(model.get('id'));
	};
	
	
	// Redo Collection
    // ---------------
    
	var RedoSet = window.TastypieCollection.extend({
		
		model: app.Redo,
		url: API_NAME + "/redo",
		name: "redo",
		
	});
	
	// Create our global collection of **Redos**.
	app.Redos = new RedoSet();
	app.Redos.comparator = function(model) {
		return parseInt(model.get('id'));
	};
	
	
	// Clipboard
    // ---------
    
	var Clipboard = window.TastypieCollection.extend({});
	
	// Create our global `Clipboard`.
	app.Clipboard = new Clipboard();
	
	
}());