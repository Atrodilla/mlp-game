MLPGame.WorldObjects.NPC = function ( board, pos, name ) {

	this.game   = MLPGame.game;
	this.board  = board;
	this.ai     = new MLPGame.AI.Default( this );

	this.name   = name || 'Background Pony';
	this.pos    = pos;

	this._setup_sprite();
	
	this.dead = false;

};

MLPGame.WorldObjects.NPC.prototype = {

	// after_turn: function () {}

	die: function () {

		this.dead           = true;
		this.sprite.visible = false;

	},



	set_pos: function ( pos ) {

		this.pos       = pos;
		var screen_pos = MLPGame.Board.to_screen_coords( pos );
		this.sprite.x  = screen_pos.x;
		this.sprite.y  = screen_pos.y;

	},



	_setup_sprite: function () {

		var sprite_pos   = MLPGame.Board.to_screen_coords( this.pos );
		this.sprite      = this.game.add.sprite( sprite_pos.x, sprite_pos.y, this.name );
		this.sprite.name = this.name;

		// Set up animations
		this.sprite.animations.add( 'idle' );
		this.sprite.animations.play( 'idle', 2, true );

	}

}