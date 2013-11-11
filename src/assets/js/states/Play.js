MLPGame.States.Play = function ( game ) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

	this.game;			//	a reference to the currently running game
	this.add;				//	used to add sprites, text, groups, etc
	this.camera;		//	a reference to the game camera
	this.cache;			//	the game cache
	this.input;			//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
	this.load;			//	for preloading assets
	this.math;			//	lots of useful common math operations
	this.sound;			//	the sound manager - add a sound, play one, set-up markers, etc
	this.stage;			//	the game stage
	this.time;			//	the clock
	this.tweens;		//	the tween manager
	this.world;			//	the game world
	this.particles;	//	the particle manager
	this.physics;		//	the physics manager
	this.rnd;				//	the repeatable random number generator

	//	You can use any of these from any function within this State.
	//	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

MLPGame.States.Play.key_mappings = (function () {

	var mappings = {
		W: { action: "move_player", args: [  0, -1 ] },
		X: { action: "move_player", args: [  0,  1 ] },
		A: { action: "move_player", args: [ -1,  0 ] },
		D: { action: "move_player", args: [  1,  0 ] },
		Q: { action: "move_player", args: [ -1, -1 ] },
		E: { action: "move_player", args: [  1, -1 ] },
		Z: { action: "move_player", args: [ -1,  1 ] },
		C: { action: "move_player", args: [  1,  1 ] }
	};

	var mappings2 = {};
	_.each( mappings, function ( data, keychar ) {

		mappings2[ Phaser.Keyboard[ keychar ] ] = data;

	}, this);

	return mappings2;

})();

MLPGame.States.Play.prototype = {

	create: function () {

		// Music
		this.music = this.add.audio( 'song' );
		this.music.play( '', 0, 1, true );

		// Board
		this.board = new MLPGame.Board();

		// Camera
		this.camera_target = this.add.sprite( 0, 0 );
		this.camera_target.visible = false;
		this.camera.follow( this.camera_target );

		// HUD
		this.hud  = this.add.group( null, 'hud' );
		this.hud.x = 4;
		this.hud.y = 4;
		var scale = this.game.stage.scale; // in case we want to position at the bottom of the screen.
		
		// Name
		var name_text_height = 32;
		var name_text_style  = {
			font:            '' + name_text_height + 'px Arial',
			fill:            "#000000",
			stroke:          "#FFFFFF",
			strokeThickness: 1
		};
		
		var name_elem  = new Phaser.Text( this.game, 0, 0, 'Atrodilla Pony', name_text_style );
		this.name_elem = this.hud.add( name_elem );

		var bar_text_height = 22;
		var bar_text_style  = {
			font:            '' + bar_text_height + 'px Arial',
			fill:            "#000000",
			stroke:          "#FFFFFF",
			strokeThickness: 1
		};

		// HP meter
		this.hp_ui   = this.add.group( this.hud, 'hp_ui' );
		this.hp_ui.y = name_elem.y + name_text_height + 8;

		var hp_bar_container = new Phaser.Sprite( this.game, 0, 0, 'hp_bar_container' );
		this.hp_ui.container = this.hp_ui.add( hp_bar_container );
		var hp_bar           = new Phaser.Sprite( this.game, hp_bar_container.x + 2, hp_bar_container.y + 2, 'hp_bar' );
		this.hp_ui.bar       = this.hp_ui.add( hp_bar );
		var hp_text          = new Phaser.Text( this.game, 0, 2, '', bar_text_style );
		this.hp_ui.hp_text   = this.hp_ui.add( hp_text );

		// Magic meter
		this.mp_ui   = this.add.group( this.hud, 'mp_ui' );
		this.mp_ui.x = this.hp_ui.x + hp_bar_container.width + 4;
		this.mp_ui.y = this.hp_ui.y;
		
		var mp_bar_container = new Phaser.Sprite( this.game, 0, 0, 'mp_bar_container' );
		this.mp_ui.container = this.mp_ui.add( mp_bar_container );
		var mp_bar           = new Phaser.Sprite( this.game, mp_bar_container.x + 2, mp_bar_container.y + 2, 'mp_bar' );
		this.mp_ui.bar       = this.mp_ui.add( mp_bar );
		var mp_text          = new Phaser.Text( this.game, 0, 2, '', bar_text_style );
		this.mp_ui.mp_text   = this.mp_ui.add( mp_text );

		// Selector group
		this.selectors = this.add.group( this.world, 'selectors' );
		// this.selectors = this.add.group( null, 'selectors' );

		// Mouse
		this.cursor = this.add.sprite( 0, 0, 'cursor' );
		this.input.onDown.add( this.on_click, this );

		// Keyboard
		var keyboard = this.game.input.keyboard;

		_.each( MLPGame.States.Play.key_mappings, function ( data, keycode ) {

			var key = keyboard.addKey( keycode );
			key.onDown.add( this.key_pressed, this );

		}, this);

		this.teleporting = false;

		// debugger;

	},



	update: function () {

		this.update_camera();
		this.update_hud();
		this.update_cursor();
		if ( this.teleporting ) this.animate_selectors();

	},



	ease_value_change: function( current, target, gradualness ) {

		gradualness = gradualness || 12;
		return current + ( ( target - current ) / gradualness );

	},



	update_camera: function () {

		var player_sprite = this.board.player.sprite;
		var player_pos = MLPGame.Board.to_screen_coords( this.board.player.pos );

		// TODO handle deadzone easing a bit better;
		this.camera_target.x = this.ease_value_change( this.camera_target.x, player_pos.x + ( player_sprite.width / 2 ) );
		this.camera_target.y = this.ease_value_change( this.camera_target.y, player_pos.y + ( player_sprite.height / 2 ) );

	},



	update_cursor: function () {

		var pointer = this.game.input.mousePointer;
		var pos = MLPGame.Board.to_screen_coords(
			MLPGame.Board.to_tile_coords(
				new Phaser.Point( pointer.worldX, pointer.worldY )
			)
		);

		this.cursor.x = pos.x;
		this.cursor.y = pos.y;

	},



	update_hud: function () {

		var player = this.board.player

		// HP
		var hp_text = "HP: " + player.hp + "/" + player.max_hp;
		this.hp_ui.hp_text.setText( hp_text );

		var hp_percentage = player.hp / player.max_hp;
		this.hp_ui.bar.scale.x = this.ease_value_change( this.hp_ui.bar.scale.x, hp_percentage, 6 );

		// MP
		var mp_text = "MP: " + player.mp + "/" + player.max_mp;
		this.mp_ui.mp_text.setText( mp_text );

		var mp_percentage = player.mp / player.max_mp;
		this.mp_ui.bar.scale.x = this.ease_value_change( this.mp_ui.bar.scale.x, mp_percentage, 6 );

	},



	quit: function ( pointer ) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.game.state.start( MLPGame.States.Preloader.key );

	},



	key_pressed: function ( key ) {

		var data = MLPGame.States.Play.key_mappings[ key.keyCode ];

		// Hack
		var dx   = data[ 'args' ][0];
		var dy   = data[ 'args' ][1];

		this[ data[ 'action' ] ]( dx, dy );
		// debugger;
		// move_player

	},



	move_player: function ( dx, dy ) {

		var walk_success = false;
		try
		{
			this.board.player.walk( new Phaser.Point( dx, dy ) );
			walk_success = true;
		}
		catch ( e )
		{
			console.log( e );
		}

		if ( walk_success ) this.set_teleporting( false );

	},



	on_click: function ( pointer ) {
		
		var player = this.board.player;
		if ( !( player.can_cast() ) )
		{
			this.set_teleporting( false );
			return;
		}

		var mouse_pos = MLPGame.Board.to_tile_coords( new Phaser.Point( pointer.worldX, pointer.worldY ) );
		if ( mouse_pos.x === player.pos.x && mouse_pos.y === player.pos.y )
		{
			this.toggle_teleporting();
		}
		else if ( this.teleporting )
		{
			this.teleport_player( mouse_pos );
		}

	},



	teleport_player: function ( pos ) {

		var teleport_success = false;
		try
		{
			this.board.player.teleport( pos );
			teleport_success = true;
		}
		catch ( e )
		{
			console.log( e );
		}

		if ( teleport_success ) this.toggle_teleporting();

	},



	toggle_teleporting: function () {

		this.set_teleporting( !this.teleporting );

	},



	set_teleporting: function ( val ) {

		if ( this.teleporting === val ) return val;

		this.teleporting = val;
		this.update_selectors();

		return this.teleporting;

	},



	update_selectors: function () {

		( this.teleporting ) ? ( this.enable_selectors() ) : ( this.disable_selectors() );

	},



	enable_selectors: function () {

		var player = this.board.player;
		for ( var i = -player.teleport_range; i < player.teleport_range * 2; i++ )
		{

			for ( var j = -player.teleport_range; j < player.teleport_range * 2; j++ )
			{

				var pos = new Phaser.Point( player.pos.x + i, player.pos.y + j );
				if ( !( player.teleport_can_reach( pos ) ) ) continue;
				
				if ( this.board.is_tile_vacant( pos ) ) this.place_selector( pos );

			}

		}

	},



	disable_selectors: function () {

		this.selectors.forEachAlive( function ( selector ) {

			selector.kill();

		}, this );

	},



	animate_selectors: function () {

		var alpha = 0.75 + ( 0.125 * ( 1 + Math.sin( MLPGame.game.time.totalElapsedSeconds() * 12 ) ) );
		this.selectors.forEach( function( selector ) {

			selector.alpha = alpha;

		}, this );

	},



	place_selector: function ( pos ) {

		var selector   = this.selectors.getFirstExists( false ) || this.create_selector();
		var screen_pos = MLPGame.Board.to_screen_coords( pos );
		
		selector.x = screen_pos.x;
		selector.y = screen_pos.y;
		selector.revive();

		return selector;

	},


	
	create_selector: function () {

		var selector = new Phaser.Sprite( this.game, 0, 0, 'affect_area' );
		return this.selectors.add( selector );

	}

};

MLPGame.States.Play.key = "Play"
