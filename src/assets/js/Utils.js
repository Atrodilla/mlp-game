MLPGame.Utils = {

	clamp: function ( number, min, max ) {

		return Math.max( Math.min( number, max ), min );

	},



	manhattan_distance: function ( a, b ) {

		return Math.abs( a.x - b.x ) + Math.abs( a.y - b.y );

	},



	flip_coin: function () {

		return Math.random() > 0.5;

	},



	roll_dice: function ( sides ) {

		return Math.floor( Math.random() * sides );

	}

}