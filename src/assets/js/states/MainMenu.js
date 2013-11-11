MLPGame.States.MainMenu = function ( game ) {

	this.music = null;
	this.playButton = null;

};

MLPGame.States.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio( 'title' );
		this.music.play();

		// Background
		this.add.sprite( 0, 0, 'main_menu' );
		
		// Title Text
		// var text = "Pony Roguelike Thingy";
		// var style = { font: "65px Arial", fill: "#258acc", align: "center", stroke: "#1166aa", strokeThickness: 4 };

		// var t = this.add.text( this.game.world.centerX, this.game.world.centerY - 100, text, style);

		// t.anchor.setTo(0.5, 0.5);

		// Logo
		this.logo = this.add.sprite( this.game.world.centerX, this.game.world.centerY - 160, 'logo' );
		this.logo.anchor.setTo( 0.5, 0.5 );

    // Play Button
		this.playButton = this.add.button(
			400,
			440,
			'play_button',
			this.play,
			this
		);

	},



	update: function () {

		//	Do some nice funky main menu effect here
		this.logo.angle = 6 * Math.sin( MLPGame.game.time.totalElapsedSeconds() * 3 );

	},



	play: function( pointer ) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.game.state.start( MLPGame.States.Play.key );

	}

};

MLPGame.States.MainMenu.key = "MainMenu"