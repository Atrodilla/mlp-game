// An AI is basically a brain. It has knowledge and can make decisions.
MLPGame.AI.Default = function ( entity ) {

	this.entity = entity;

}

MLPGame.AI.Default.prototype = {

	act: function () {

		// Do nothing if I'm dead.
		if ( this.entity.dead ) return;

		// Chance of just standing in place.
		if ( Math.random() < 0.75 ) return;

		// If I'm on the edge of the map, die.
		if (
			      this.entity.pos.x === 0
		     || this.entity.pos.y === 0
		     || this.entity.pos.x === this.entity.board.size.x - 1
		     || this.entity.pos.y === this.entity.board.size.y - 1
		)
		{
			this.entity.die();
			return;
		}

		// Try to find a tile next to me to move to.
		var new_pos = this.entity.board.rand_vacant_tile_near( this.entity.pos, 1, 1 );

		// If there are no vacant tiles around me, do nothing.
		if ( new_pos === null ) return;

		// Move the pony.
		this.entity.board.move_entity( this.entity, new_pos );

	}

}