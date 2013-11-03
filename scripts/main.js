
var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });




function preload() {
    game.load.image('player-image', 'assets/sprites/player.png');
    game.load.image('player-image', 'assets/sprites/player.png');
    game.load.image('fruit', 'assets/sprites/fruit.png');
    game.load.image('robot-image', 'assets/sprites/robot.png');

    game.load.image('robot-pickup','assets/sprites/pickup_area_robo.png');

    game.load.tileset('tiles', 'assets/maps/tiles.png', 64, 64, 4);
    game.load.tilemap('forest', 'assets/maps/forest.json', null,  Phaser.Tilemap.TILED_JSON);
}

var psprite, rsprite;
var player;


var mainTileSet;
var mainMap;
var layer;


var groupPickup;


var actionKey, transformKey;
var MUD_INDEX = 2;

//add invisible body that is always collideable
function robotKey(){
    if(player.transform()){
        if(player.robotForm === true)
             mainTileSet.setCollision(MUD_INDEX, false, false, false, false);
         else 
            mainTileSet.setCollision(MUD_INDEX, true, true, true, true);
    }
}

function create() {

    Phaser.Canvas.setSmoothingEnabled(game.context, false);

    mainMap = game.add.tilemap('forest');
    mainTileSet = game.add.tileset('tiles');
    //Initially set collision to true for mud

    mainTileSet.setCollision(MUD_INDEX, true, true, true, true);

    layer = game.add.tilemapLayer(0, 0, 800, 600, mainTileSet, mainMap, 0);
    layer.resizeWorld();


    psprite = game.add.sprite(380, 1680, 'player-image');
    psprite.anchor.setTo(0.5, 0.5);
    psprite.name = 'player-sprite';

    rsprite = game.add.sprite(0, 0, 'robot-image');
    rsprite.anchor.setTo(0.5, 0.5);
    rsprite.name = 'robot-sprite';

    var pickupRobo = game.add.sprite(0,0, 'robot-pickup');
    pickupRobo.anchor.setTo(0.5, 1.0);
    player = new Player(psprite, rsprite, pickupRobo);


    groupPickup = game.add.group();
    var fruit = groupPickup.create(200, 200, 'fruit');
    fruit.body.immovable = true;

    //Prevent browser from using these.
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN ]);
    transformKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    transformKey.onDown.add(robotKey, this);
}


function update() {
    game.camera.follow(player.sprite);


    player.sprite.body.velocity.x = 0;
    player.sprite.body.velocity.y = 0;

    //TODO: set the other body immovable so that you cant transform when colliding.
    player.canTransform = true;

    game.physics.collide(player.sprite, layer, collisionHandler);
    game.physics.collide(player.sprite, groupPickup);

    //console.log("x " + player.sprite.x + ", y " + player.sprite.y);
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        player.sprite.body.rotation = 270;
        player.sprite.body.velocity.x = -200;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        player.sprite.body.rotation = 90;
        player.sprite.body.velocity.x = 200;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        player.sprite.body.velocity.y = -200;
        player.sprite.body.rotation = 0;
    }

    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        player.sprite.body.velocity.y = 200;
        player.sprite.body.rotation = 180;
    }
    player.update();

}

function collisionHandler (obj1, obj2) {
    player.canTransform = false;
}

function render () {
    //game.debug.renderQuadTree(game.physics.quadTree);
}
