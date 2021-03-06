class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprite
        this.load.image('starfield', './assets/danish field.png');
        this.load.image('danish', './assets/danish.png');
        // load spritesheet
        this.load.spritesheet('gnome', './assets/gnome.png', {frameWidth: 32, frameHeight: 40, startFrame: 0, endFrame: 1});
        this.load.spritesheet('grab', './assets/danish grab.png', {frameWidth: 60, frameHeight: 40, startFrame: 0, endFrame: 10})
    }

    create() {
        //place title sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFACADE).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFACADE).setOrigin(0, 0);

        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0xFACADE).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'gnome').setOrigin(0, 0);

        // add spaceships
        this.ship01 = new Spaceship(this, game.config.width +192, 132, 'danish', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width +96, 196, 'danish', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'danish', 0, 10).setOrigin(0, 0);

        // define keyboard keys
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'grab',
            frames: this.anims.generateFrameNumbers('grab', { start: 0, end: 10, first: 0}),
            frameRate: 10
        });

        // score
        this.p1Score = 0;
        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        
        // game over flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true;
        }, null, this);
    }

    update() {
        //check key input for menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyJ)) {
            this.scene.restart(this.p1Score);
        }

        this.starfield.tilePositionX -= 4;  // scroll starfield
        if (!this.gameOver) {
            this.p1Rocket.update();             // update rocket sprite
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }
        
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'grab').setOrigin(0, 0);
        boom.anims.play('grab');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}