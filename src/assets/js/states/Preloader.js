MLPGame.States.Preloader = function ( game ) {

	this.background = null;
	this.preloadBar = null;

};

MLPGame.States.Preloader.prototype = {

	preload: function () {

		this.setup_preloader();
		this.load_assets();

	},



	setup_preloader: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite( 0,   0,   'preloader_background' );
		this.preloadBar = this.add.sprite( 300, 400, 'preloader_bar' );

		//	This sets the preloadBar sprite as a loader sprite, basically
		//	what that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite( this.preloadBar );

	},



	load_assets: function () {

		//	Here we load most of the assets our game needs
		var assets_dir = '/src/assets/';
		var maps_dir   = assets_dir + 'maps/';
		var images_dir = assets_dir + 'images/';

		///// Main Menu
		this.load.image( 'main_menu', images_dir + 'backgrounds/main_menu.png' );
		this.load.image( 'logo', images_dir + 'ui/logo.png' );
		this.load.spritesheet( 'play_button', images_dir + 'ui/buttons/play_button.png', 256, 64 );

		//// Play
		this.load.tilemap( 'ponyville', maps_dir + 'ponyville.json', null, Phaser.Tilemap.TILED_JSON );
		this.load.tileset( 'ponyville2', images_dir + 'tilesets/tileset.png', 32, 32 );

		// UI
		// HUD
		this.load.image( 'hp_bar_container', images_dir + 'ui/hp_bar_container.png' );
		this.load.image( 'hp_bar', images_dir + 'ui/hp_bar.png' );
		this.load.image( 'mp_bar_container', images_dir + 'ui/mp_bar_container.png' );
		this.load.image( 'mp_bar', images_dir + 'ui/mp_bar.png' );

		// UI
		this.load.image( 'cursor', images_dir + 'ui/cursor.png' );
		this.load.image( 'affect_area', images_dir + 'ui/affect_area.png' );

		// Entities
		this.load.spritesheet( 'player', images_dir + 'entities/player.png', 32, 32 );
		var named_ponies = [ 'twilight_sparkle', 'rainbow_dash', 'rarity', 'pinkie_pie', 'applejack', 'fluttershy', 'derpy_hooves' ];
		_.each( named_ponies, function ( pony ) {

			this.load.spritesheet( pony, images_dir + 'entities/' + pony + '.png', 32, 32 );

		}, this);

		// for ( var i = 0; i < 20; i++ )
		// {
		// 	this.load.spritesheet( 'pony_' + i, images_dir + 'entities/pony_' + i + '.png', 32, 32 );
		// }
		// this.load.image('titlepage', 'images/title.jpg');
		// this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
		// this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		// this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here

	},



	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while
		this.preloadBar.cropEnabled = false;

	},



	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if ( this.ready() )
		{
			this.game.state.start( MLPGame.States.MainMenu.key );
		}

	},



	// This shouldn't go in here, violates SRP
	ready: function ()
	{

		// return this.cache.isSoundDecoded('titleMusic')
		return true;

	}

};

MLPGame.States.Preloader.key = "Preloader";