MLPGame.WorldObjects.Player = function ( board, pos ) {

	this.game   = MLPGame.game;
	this.board  = board;
	this.name   = 'Player';
	this.pos    = pos;
	
	this._setup_sprite();

	this.max_hp = 40;
	this.hp     = this.max_hp;
	
	this.max_mp           = 100;
	this.mp               = this.max_mp;
	this.mp_recharge_rate = 4; // per turn

	this.known_spells = [ 'teleport' ];

	this.teleport_mp_cost = 30;
	this.teleport_range   = 10;

};

MLPGame.WorldObjects.Player.prototype = {

	act: function ( pos ) {

		this.board.act_player( pos );
		this._set_mp( this.mp + this.mp_recharge_rate );

	},



	can_cast: function ( spell ) {

		// Hardcoded to teleport right now
		return this.teleport_mp_cost <= this.mp;

	},



	teleport: function ( pos ) {

		if ( !( this.can_cast() ) )              throw 'Not enough MP!';
		if ( !( this.teleport_can_reach( pos ) ) ) throw 'Too far to teleport!';

		this.act( pos );

		this._set_mp( this.mp - this.teleport_mp_cost );

	},



	teleport_can_reach: function ( pos ) {

		var dist = MLPGame.Utils.manhattan_distance( this.pos, pos );
		return dist <= this.teleport_range

	},



	walk: function ( dir ) {

		var pos = new Phaser.Point( this.pos.x + dir.x, this.pos.y + dir.y );
		this.act( pos );

	},



	set_pos: function ( pos ) {

		this.pos       = pos;
		var screen_pos = MLPGame.Board.to_screen_coords( pos );
		this.sprite.x  = screen_pos.x;
		this.sprite.y  = screen_pos.y;

	},



	_setup_sprite: function ( ) {

		var sprite_pos   = MLPGame.Board.to_screen_coords( this.pos );
		this.sprite      = this.game.add.sprite( sprite_pos.x, sprite_pos.y, 'player' ); // bad SRP. maybe player.renderer?
		this.sprite.name = this.name;

		// Set up animations
		this.sprite.animations.add( 'idle' );
		this.sprite.animations.play( 'idle', 2, true );

	},



	_set_mp: function ( amount ) {

		this.mp = MLPGame.Utils.clamp( amount, 0, this.max_mp );

	}

}