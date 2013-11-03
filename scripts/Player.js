//Later: make this a singleton class
Player = function (normalSprite, robotSprite, pickupAreaR){

	this.sprite = normalSprite;

	this.normalSprite = normalSprite;
	this.normalSprite.body.collideWorldBounds = true;

	this.robotSprite = robotSprite;
	this.robotSprite.body.collideWorldBounds = true;

	this.pickupAreaR = pickupAreaR;
	this.pickupAreaR.body.immovable = true;

	this.playerGroup = game.add.group();
	this.robotForm = false;
	this.canTransform = true;
}

Player.prototype.update = function(){
	/*
	this.pickupAreaR.x = this.robotSprite.center.x;
	this.pickupAreaR.y = this.robotSprite.center.y - this.robotSprite.height/2;
	*/
	robot.addAll('body.velocity.y', 10 , false, false);
	this.pickupAreaR.reset(this.robotSprite.center.x,
		this.robotSprite.center.y - this.robotSprite.height/2);
}

Player.prototype.transform = function(){
	if(this.canTransform === true){
		if(this.robotForm){
			this.sprite = this.normalSprite;
			this.robotSprite.kill();
			this.normalSprite.reset(this.robotSprite.x, this.robotSprite.y);
		}

		else{

			this.sprite = this.robotSprite;
			this.normalSprite.kill();
			this.robotSprite.reset(this.normalSprite.x, this.normalSprite.y);
		}

		console.log("switch");
		this.robotForm = !this.robotForm;
		return true;
	}
	else
		return false;
}