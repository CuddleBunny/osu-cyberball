import Phaser from 'phaser';
import { getCaughtBallPosition, getActiveBallPosition } from 'helpers';

const gameWidth = 800;
const gameHeight = 440;

let playerGroup: Phaser.Physics.Arcade.Group;

let playerSprite: Phaser.GameObjects.Sprite;
let ballSprite: Phaser.GameObjects.Image;
let throwTarget: Phaser.GameObjects.Sprite;

let playerHasBall = true;
let ballHeld = true;

// Configuration defaults

// TODO: Get configuration from URL/Aurelia?
// TODO: Figure out how to configure different positions for 4 players and portraits modes.
const playerPosition = new Phaser.Geom.Point(400, 250);
const cpuPositions = [
    new Phaser.Geom.Point(150, 100),
    new Phaser.Geom.Point(650, 100)
];

const config = {
    cpuCount: 2
};

function preload(this: Phaser.Scene) {
    // TODO: Load from settings.
    this.load.image('ball', './assets/ball.png');
    this.load.multiatlas('player', './assets/player.json', 'assets');
}

function create(this: Phaser.Scene) {
    this.cameras.main.setBackgroundColor('#ffffff');

    // Player animations

    this.anims.create({
        key: 'active',
        frames: this.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'active/', suffix: '.png' })
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'idle/', suffix: '.png' })
    });

    this.anims.create({
        key: 'throw',
        frames: this.anims.generateFrameNames('player', { start: 1, end: 3, prefix: 'throw/', suffix: '.png' })
    });

    this.anims.create({
        key: 'catch',
        frames: this.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'catch/', suffix: '.png' }),
        frameRate: 4
    });

    // Set up player
    playerGroup = this.physics.add.group({ immovable: true });
    playerSprite = playerGroup.create(playerPosition.x, playerPosition.y, 'player', 'active/1.png');

    // Set up CPU
    for(let i = 0; i < config.cpuCount; i++) {
        let cpuSprite = playerGroup.create(cpuPositions[i].x, cpuPositions[i].y, 'player', 'idle/1.png');

        cpuSprite.flipX = cpuPositions[i].x > playerPosition.x;

        cpuSprite.setInteractive();
        cpuSprite.on('pointerdown', (e) => {
            if(playerHasBall) {
                playerHasBall = ballHeld = false;
                throwTarget = cpuSprite;

                playerSprite.play('throw');

                playerSprite.anims.currentAnim.once('complete', () => { playerSprite.play('idle') });

                let ballTargetPosition = getCaughtBallPosition(cpuSprite);
                this.physics.moveTo(ballSprite, ballTargetPosition.x, ballTargetPosition.y, 500);
            }
        });
    }

    // Set up ball
    let ballPosition = getActiveBallPosition(playerSprite);
    ballSprite = this.physics.add.image(ballPosition.x, ballPosition.y, 'ball');

    console.log(playerGroup);

    this.physics.add.overlap(ballSprite, playerGroup, (ball, player: Phaser.GameObjects.Sprite) => {
        if(!ballHeld && player === throwTarget) {
            ballHeld = true;

            if(player === playerSprite) {
                playerHasBall = true;
            }

            player.play('catch');

            let ballPosition = getCaughtBallPosition(player);
            (ball.body as Phaser.Physics.Arcade.Body).reset(ballPosition.x, ballPosition.y);
        }
    });

    // TODO: Use events to talk to Qualtrics?
    //setTimeout(() => { window.dispatchEvent(new CustomEvent('complete', { detail: { test: 'test' } }))}, 1000)
}

function update(this: Phaser.Scene) {
    if (playerHasBall) {
        // If the player has the ball:
        //  - Player character looks in the direction of the mouse
        //  - Player can click a CPU to throw the ball.
        playerSprite.play('active');
        playerSprite.flipX = this.input.x < gameWidth / 2;

        let ballPosition = getActiveBallPosition(playerSprite);
        ballSprite.x = ballPosition.x;
        ballSprite.y = ballPosition.y;
    }
}

export class GameViewModel {
    gameConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: gameWidth,
        height: gameHeight,
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: true
            }
        }
    }
}
