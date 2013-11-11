MLPGame = {

	config: null,

	start: function ( container ) {
	
		MLPGame.Booter.boot( container );

	}

};



MLPGame.Booter = {

	//	Add the States your game has.
	add_states: function() {

		var states = MLPGame.States.all();
		_.each( states, function( state )
		{
			MLPGame.game.state.add( state.key, state );
		}, this );

	},



	boot: function ( container ) {

		this.container_div_id = container;
		this.load_config( MLPGame.Booter.boot_engine );

	},



	boot_engine: function () {

		//	Create your Phaser game and inject it into the gameContainer div.
		MLPGame.game = new Phaser.Game(
			MLPGame.config.SCREEN_WIDTH,
			MLPGame.config.SCREEN_HEIGHT,
			Phaser.AUTO,
			this.container_div_id
		);

		this.add_states();
		
		//	Now start the Boot state.
		MLPGame.game.state.start( MLPGame.States.Boot.key );

	},



	load_config: function ( success ) {

		var self = this;

		$.getJSON( 'config.json', function( data )
		{
			MLPGame.config = data;
			success.call( self );
		}).fail( function( jqxhr, textStatus, error )
		{
			throw "Could not parse config.json: \n" + error
		});

	}

}