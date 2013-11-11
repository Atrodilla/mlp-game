MLPGame.UI.Bar = function ( sprite ) {

	this.sprite   = sprite;
	this.object   = null;
	this.property = null;
	this.min      = null;
	this.max      = null;

}

MLPGame.UI.Bar.prototype = {

	track: function ( object, property, min, max ) {

		this.object = object;
		this.property = property;
		this.min = min;
		this.max = max;

	},



	update: function () {

		var val = MLPGame.this.object[ this.property ];


	}

}