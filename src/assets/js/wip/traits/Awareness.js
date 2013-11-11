// Takes in a list of things that it is aware of.
MLPGame.WorldObjects.Awareness = function ( options ) {

	this.
	this.options = options;
	this.hearing = options[ 'hearing' ];
	this.sight 	 = options[ 'sight' ];
	this.smell 	 = options[ 'smell' ];
	this.taste   = options[ 'taste' ];
	this.touch   = options[ 'touch' ];

}

MLPGame.WorldObjects.Awareness.Senses.
MLPGame.WorldObjects.Awareness.senses = [ 'hearing', 'sight', 'smell', 'taste', 'touch' ]

MLPGame.WorldObjects.Awareness.prototype = {

	_validate_options: function ( options ) {



	},

	sight: function () {

		return this.options[ '' ]

	}

}