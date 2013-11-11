MLPGame.WorldObject = function( tx, ty ) {

	this.position  = new Phaser.Point( tx, ty );
	this.senses    = null;
	this.mobility  = null;
	this.sentience = null;

}

MLPGame.WorldObject.prototype = {

	// Can this WorldObject see?
	can_sense

	// Can this WorldObject see
	can_see: function ( space ) {

		return false;

	},
	
}