//Later: make this a singleton class
Player = function (normalSprite, robotSprite, pickupAreaR){

	this.sprite = robotSprite;

	this.normalSprite = normalSprite;
	this.normalSprite.body.collideWorldBounds = true;
	this.normalSprite.visible = false;

	this.robotSprite = robotSprite;
	this.robotSprite.body.collideWorldBounds = true;
	this.robotSprite.visible = true;

	this.pickupAreaR = pickupAreaR;
	this.pickupAreaR.body.collideWorldBounds = true;
	this.pickupAreaR.body.immovable = true;


	this.group = game.add.group();
	this.group.add(normalSprite);
	this.group.add(robotSprite);
	this.group.add(pickupAreaR);

	//this.pickupAreaR.reset(this.robotSprite.x,
	//this.robotSprite.y - this.robotSprite.height/2);
	this.pickupAreaR.body.x = this.robotSprite.x;
	this.pickupAreaR.body.y = this.robotSprite.y - this.robotSprite.height/2;
	this.pickupAreaR.x = this.robotSprite.x;
	this.pickupAreaR.y = this.robotSprite.y - this.robotSprite.height/2;

	console.log(this.normalSprite);
	console.log(this.robotSprite);
	this.robotForm = true;
	this.canTransform = true;

	this.holdingSomething = false; //cant transform while holding something.
	this.carrying = null;
	this.displacement = new Phaser.Point();
}

Player.prototype.update = function(){
	this.pickupAreaR.x = this.robotSprite.x;
	this.pickupAreaR.y = this.robotSprite.y - this.robotSprite.height/2;

	if(this.holdingSomething){
		this.carrying.x = this.sprite.x + this.displacement.x;
		this.carrying.y = this.sprite.y + this.displacement.y;
	}
	//this.pickupAreaR.body.rotation = this.robotSprite.body.rotation;
	 //- this.robotSprite.height/2;
	
	//robot.addAll('body.velocity.y', 10 , false, false);
	//this.pickupAreaR.reset(this.robotSprite.center.x,
		//this.robotSprite.center.y - this.robotSprite.height/2);
}

Player.prototype.pickup = function(sprite){
	this.holdingSomething = true;
	this.displacement.x = sprite.x - this.sprite.x;
	this.displacement.y = sprite.y - this.sprite.y;
	this.carrying = sprite;
	console.log("got it!");
}

Player.prototype.drop = function(){
	this.holdingSomething = false;
	this.carrying = null;
	console.log("drop it!");
}

Player.prototype.transform = function(){
	if(this.canTransform === true && !this.holdingSomething){
		if(this.robotForm === true){
			this.normalSprite.reset(this.robotSprite.x, this.robotSprite.y);
			this.sprite = this.normalSprite;
			this.robotSprite.visible = false;
			this.pickupAreaR.visible = false;
			this.robotSprite.immovable = true;
			//this.robotSprite.kill();
		}

		else{
			this.robotSprite.reset(this.normalSprite.x, this.normalSprite.y);
			this.sprite = this.robotSprite;
			this.normalSprite.visible = false;
			this.pickupAreaR.visible = true;
			this.normalSprite.immovable = true;
			//this.normalSprite.kill();
		}

		console.log("switch");
		this.robotForm = !this.robotForm;
		return true;
	}
	else
		return false;
}

