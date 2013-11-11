MLPGame.States = {}

MLPGame.States.all = function()
{
	return this.hidden().concat( this.playable() );
}

MLPGame.States.hidden = function()
{
	return [
		MLPGame.States.Boot,
		MLPGame.States.Preloader,
	]
}


MLPGame.States.playable = function()
{
	return [
		MLPGame.States.MainMenu,
		MLPGame.States.Play,
	];
}

