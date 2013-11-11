// TODO remove all references to this.game
MLPGame.Board = function () {

	this.game     = MLPGame.game;

	// this.game.add.sprite( sprite_pos.x, sprite_pos.y, 'player' );

	// this.map = null;

	this.entities = [];
	this.npcs     = [];
	this.player   = null;

	this._load();

}

MLPGame.Board.prototype = (function () {

	var rand_dist = function ( min, max ) {

		if ( min === max )
		{
			if ( min === 0 ) return 0;
			var res = min;
			if ( MLPGame.Utils.flip_coin() ) res *= -1;

			return res;
		}

		if ( min === 0 )
		{
			if ( MLPGame.Utils.roll_dice( ( max * 2 ) + 1 ) === 0 )
			{
				return 0;
			}
			else
			{
				return this.rand_dist( min + 1, max );
			}
		}

		var res = Math.floor( min + MLPGame.Utils.roll_dice( ( max + 1 ) - min ) );
		if ( MLPGame.Utils.flip_coin() ) res *= -1;
		return res;

	}



	// dist arguments are number of tiles away from center
	var rand_tile_within_box = function ( center, min_dist, max_dist ) {

		if ( min_dist > max_dist ) return null;
		if ( max_dist < 1 )        return center_pos;

		// Square strategy
		return new Phaser.Point(
			center.x + rand_dist( min_dist, max_dist ),
			center.y + rand_dist( min_dist, max_dist )
		)

	}



	// var rand_tile_within_diamond = function ( center, min_dist, max_dist ) {

	// 	// Square strategy
	// 	return new Phaser.Point(
	// 		dx
	// 		rand_dist( min_dist, max_dist )
	// 	)

	// }



	return {

		// Add an Entity to the Board.
		add: function ( entity ) {

			if ( !( this.is_tile_vacant( entity.pos ) ) ) throw 'Another object is already there!';

			this.entities[ this.entities.length ] = entity;

			return entity;

		},



		is_tile_vacant: function ( pos ) {

			// var ignore_pony = null;
			// if ( !(_.isUndefined( options ) ) ) ignore_pony = options[ 'ignore_pony' ];

			var occupant = _.find( this.entities, function ( entity ) {

				if ( entity.pos.x === pos.x && entity.pos.y === pos.y ) return true;
				return false;

			}, this, false );

			return _.isUndefined( occupant );

		},



		move_entity: function ( entity, pos ) {

			// TODO make this fast.
			if ( !( this.is_tile_vacant( pos ) ) ) throw 'Entity ' + entity.name + " can't move there!";
			entity.set_pos( pos );

		},



		// TODO probably don't send in pos
		// Also move these guys up into a GameLogic object or something
		act_player: function ( pos ) {

			this.move_entity( this.player, pos );
			this.act_npcs();

		},



		act_npcs: function () {

			_.each( this.npcs, function ( npc ) {

				if ( npc.ai === null ) return;
				npc.ai.act();

			}, this );

		},



		// TODO support shape (especially diamond)
		rand_vacant_tile_near: function ( center, min_dist, max_dist, shape ) {

			// TODO switch to a method that collects vacant spaces and picks one.
			// Try 5 times to find an empty space to move to.
			for ( var i = 0; i < 5; i++ )
			{

				var pos = rand_tile_within_box( center, min_dist, max_dist );
				if ( this.is_tile_vacant( pos ) ) return pos;

			}

			// Give up after a while;
			return null;

		},



		size: function () {

			return MLPGame.Board.to_tile_coords( new Phaser.Point( this.game.world.width, this.game.world.height ) );

		},



		_load: function ( ) {

			this.map_data = this.game.add.tilemap( 'ponyville' );
			this.tileset  = this.game.add.tileset( 'ponyville2' );

			var scale = this.game.stage.scale;
			this.map_layer = this.game.add.tilemapLayer(
				0,
				0,
				scale.width,
				scale.height,
				this.tileset,
				this.map_data,
				0
			);
			this.map_layer.resizeWorld();

			// Player
			this.player = this.add( new MLPGame.WorldObjects.Player( this, new Phaser.Point( 32, 50 ) ) );

			// NPC ponies
			var npc_names = [ 'twilight_sparkle', 'rainbow_dash', 'rarity', 'pinkie_pie', 'applejack', 'fluttershy', 'derpy_hooves' ];

			this.npcs = _.map( npc_names, function ( name ) {

				var pos = this.rand_vacant_tile_near( this.player.pos, 1, 10 );
				if ( pos === null ) throw 'Uh... map is too small?';

				return this.add( new MLPGame.WorldObjects.NPC( this, pos, name ) );

			}, this );

		}

	};

})();



MLPGame.Board.TILE_SIZE = 32;

MLPGame.Board.to_tile_coords = function ( pos ) {

	return new Phaser.Point(
		Math.floor( pos.x / MLPGame.Board.TILE_SIZE ),
		Math.floor( pos.y / MLPGame.Board.TILE_SIZE )
	);

}



MLPGame.Board.to_screen_coords = function ( pos ) {

	return new Phaser.Point(
		pos.x * MLPGame.Board.TILE_SIZE,
		pos.y * MLPGame.Board.TILE_SIZE
	);

}