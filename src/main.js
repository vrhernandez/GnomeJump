// Modifications:
// Created a new scrolling tile sprite for the background (10)
// Created new artwork for all of the in-game assets (rocket, spaceships, explosion) (25)

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
}

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

// reserve some keyboard variables
let keyJ, keyLEFT, keyRIGHT;