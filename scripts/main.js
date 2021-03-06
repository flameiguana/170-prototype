
var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });


function preload() {
    game.load.image('player-image', 'assets/sprites/player.png');
    game.load.image('frog-baby', 'assets/sprites/frog-baby.png');
    game.load.image('platform-image', 'assets/sprites/platform.png');
    game.load.image('robot-image', 'assets/sprites/robot.png');

    game.load.image('robot-pickup','assets/sprites/pickup_area_robo.png');
    game.load.image('normal-pickup', 'assets/sprites/pickup_area_fellow.png');

    game.load.tileset('tiles', 'assets/maps/tiles.png', 64, 64, 4);
    game.load.tilemap('forest', 'assets/maps/forest.json', null,  Phaser.Tilemap.TILED_JSON);

    game.load.audio('robo-error', ['assets/sounds/robo-error.ogg']);
    game.load.audio('clear-sound', ['assets/sounds/stage-clear.ogg']);
}

var roboESound, winSound;
var psprite, rsprite;
var player;

var mainTileSet;
var mainMap;
var layer;

var groupPickup;
var frog, platform;

var actionKey, transformKey;
var MUD_INDEX = 2;

var needTransform = false;
var needPickup = false;
var needDrop = false;
function robotKey(){
    needTransform = true;
}

function actionKeyDo(){
    if(player.holdingSomething)
        needDrop = true;
    else
        needPickup = true;
}

function create() {

    roboESound = game.add.audio('robo-error');
    winSound = game.add.audio('clear-sound');

    Phaser.Canvas.setSmoothingEnabled(game.context, false);

    mainMap = game.add.tilemap('forest');
    mainTileSet = game.add.tileset('tiles');
    //Initially set collision to true for mud

    mainTileSet.setCollision(MUD_INDEX, true, true, true, true);

    layer = game.add.tilemapLayer(0, 0, 800, 600, mainTileSet, mainMap, 0);
    layer.resizeWorld();

    groupPickup = game.add.group();

    platform = groupPickup.create(600, 1400, 'platform-image');
    platform.canPickup = false;

    frog = groupPickup.create(400, 300, 'frog-baby');
    frog.canPickup = false;
    frog.bound = false;
    frog.body.immovable = true;


    psprite = game.add.sprite(380, 1680, 'player-image');
    psprite.anchor.setTo(0.5, 0.5);
    psprite.name = 'player-sprite';

    rsprite = game.add.sprite(380, 1680, 'robot-image');
    rsprite.anchor.setTo(0.5, 0.5);
    rsprite.name = 'robot-sprite';

    var pickupRobo = game.add.sprite(900,400, 'robot-pickup');
    pickupRobo.anchor.setTo(0.5, 1.0);

    var pickupNormal = game.add.sprite(900,400, 'normal-pickup');
    pickupNormal.anchor.setTo(0.5, 1.0);

    player = new Player(psprite, rsprite, pickupRobo, pickupNormal);

    //Prevent browser from using these.
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN ]);
    transformKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    transformKey.onDown.add(robotKey, this);
    actionKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    actionKey.onDown.add(actionKeyDo, this);

    player.transform();
}


function update() {
    game.camera.follow(player.sprite);

    player.group.setAll('body.velocity.x', 0);
    player.group.setAll('body.velocity.y', 0);

    //TODO: set the other body immovable so that you cant transform when colliding.
    player.canTransform = true;
    frog.canPickup = false;
    platform.canPickup = false;

    //console.log("x " + player.sprite.x + ", y " + player.sprite.y);
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        player.sprite.body.rotation = 270;
        player.sprite.body.velocity.x = -200;
        /*
        player.group.setAll('body.rotation', 270);
        player.group.setAll('body.velocity.x', -200);
        */
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        player.sprite.body.rotation = 90;
        player.sprite.body.velocity.x = 200;
        /*
        player.group.setAll('body.rotation', 90);
        player.group.setAll('body.velocity.x', 200);
        */
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        player.sprite.body.rotation = 0;
        player.sprite.body.velocity.y = -200;
        /*
        player.group.setAll('body.rotation', 0);
        player.group.setAll('body.velocity.y', -200);
        */
    }

    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        player.sprite.body.rotation = 180;
        player.sprite.body.velocity.y = 200; 
        /*
        player.group.setAll('body.rotation', 180);
        player.group.setAll('body.velocity.y', 200);
        */
    }

    if(needTransform){
        if(player.transform()){
            if(player.robotForm)
                mainTileSet.setCollision(MUD_INDEX, false, false, false, false);
             else 
                mainTileSet.setCollision(MUD_INDEX, true, true, true, true);
        }
        needTransform = false;
    }

    if(needPickup){
        //Set which forms can pickup what
        if(player.robotForm)
            platform.canPickup = true;
        else
            frog.canPickup = true;
        var failPickup = false;
        for(var i = 0; i < groupPickup.countLiving(); i++){
            //careful here, canpickup property is per object
            if(Phaser.Rectangle.intersects(player.pickupArea.bounds, 
                groupPickup.getAt(i).bounds)){
                if(groupPickup.getAt(i).canPickup){
                    if(frog.bound && player.robotForm){
                    //pickup the whole group. can still modify x and y
                    player.pickup(groupPickup);
                    break;
                    }
                 else 
                    //default single objet
                    player.pickup(groupPickup.getAt(i));
                    break;
                }
                else
                    failPickup = true;
                    
            }
        }
        if(failPickup && player.robotForm)
            roboESound.play();
        needPickup = false;
    }


    else if(needDrop){
        //okay way of doing this
        if(player.drop() === frog){
            if(Phaser.Rectangle.intersects(frog.bounds, platform.bounds)){
                frog.bound = true;
                console.log("frogs on platforms");
            }
            else
                frog.bound = false;
            //check if on platform
            if(frog.world.y > 1408){
                console.log(frog);
                winSound.play();
            }
                
        }
        needDrop = false;
    }

    game.physics.collide(player.group, layer, collisionHandler);
    //just the frog for now.
    if(!player.holdingSomething)
        game.physics.collide(player.group, frog, collisionHandler);
    player.update();
}

function collisionHandler (obj1, obj2) {
    player.canTransform = false;
    console.log("collision handler");
    return true;
}

function render () {
    //game.debug.renderQuadTree(game.physics.quadTree);
}
