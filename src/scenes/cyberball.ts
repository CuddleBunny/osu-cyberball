import { SettingsModel } from './../models/settings-model';
import Phaser from 'phaser';
import { CPUModel } from 'models/cpu-model';

// TODO: Figure out how to configure different positions for 4 players and portraits modes.
const playerPosition = new Phaser.Geom.Point(400, 250);
const cpuPositions = [
    new Phaser.Geom.Point(150, 100),
    new Phaser.Geom.Point(650, 100)
];

export class CyberballScene extends Phaser.Scene {
    private settings: SettingsModel;

    // Game Objects:

    private ballSprite: Phaser.GameObjects.Sprite;
    private playerSprite: Phaser.GameObjects.Sprite;
    private playerGroup: Phaser.Physics.Arcade.Group;

    // Gameplay Mechanics:

    private playerHasBall: boolean = true;
    private ballHeld: boolean = true;
    private throwTarget: Phaser.GameObjects.Sprite;

    constructor(settings: SettingsModel) {
        super({});

        this.settings = settings;
    }

    public preload() {
        // TODO: Load from settings.
        this.load.image('ball', `${this.settings.baseUrl}/${this.settings.ballSprite}`);
        this.load.multiatlas('player', `./assets/player.json`, 'assets');
    }

    public create() {
        this.cameras.main.setBackgroundColor('#ffffff');

        // Animations:

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
            frameRate: 12,
            frames: this.anims.generateFrameNames('player', { start: 1, end: 3, prefix: 'throw/', suffix: '.png' })
        });

        this.anims.create({
            key: 'catch',
            frames: this.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'catch/', suffix: '.png' })
        });

        // Player:

        this.playerGroup = this.physics.add.group({ immovable: true, allowGravity: false });
        this.playerSprite = this.playerGroup.create(playerPosition.x, playerPosition.y, 'player', 'active/1.png');

        // CPU:

        for (let i = 0; i < this.settings.computerPlayers.length; i++) {
            let cpuSprite: Phaser.GameObjects.Sprite = this.playerGroup.create(cpuPositions[i].x, cpuPositions[i].y, 'player', 'idle/1.png');

            cpuSprite.flipX = cpuPositions[i].x > playerPosition.x;
            cpuSprite.setData('settings', this.settings.computerPlayers[i]);

            cpuSprite.setInteractive();
            cpuSprite.on('pointerdown', (e) => {
                if (this.playerHasBall)
                    this.throwBall(this.playerSprite, cpuSprite);
            });
        }

        // Ball:

        let ballPosition = this.getActiveBallPosition(this.playerSprite);
        this.ballSprite = this.physics.add.sprite(ballPosition.x, ballPosition.y, 'ball');

        this.physics.add.overlap(this.ballSprite, this.playerGroup, (_b, receiver) => {
            if (!this.ballHeld && receiver === this.throwTarget)
                this.catchBall(receiver as Phaser.GameObjects.Sprite);
        });
    }

    public update() {
        if (this.playerHasBall) {
            this.playerSprite.play('active');
            this.playerSprite.flipX = this.input.x < this.playerSprite.x;

            let ballPosition = this.getActiveBallPosition(this.playerSprite);
            this.ballSprite.x = ballPosition.x;
            this.ballSprite.y = ballPosition.y;
        }
    }

    // Mechanics:

    public throwBall(thrower: Phaser.GameObjects.Sprite, receiver: Phaser.GameObjects.Sprite) {
        this.playerHasBall = this.ballHeld = false;
        this.throwTarget = receiver;

        thrower.play('throw');
        thrower.anims.currentAnim.once('complete', () => thrower.play('idle'));

        let ballTargetPosition = this.getCaughtBallPosition(receiver);
        this.physics.moveTo(this.ballSprite, ballTargetPosition.x, ballTargetPosition.y, 500);
    }

    public catchBall(receiver: Phaser.GameObjects.Sprite) {
        this.ballHeld = true;

        receiver.play('catch');

        let ballPosition = this.getCaughtBallPosition(receiver);
        (this.ballSprite.body as Phaser.Physics.Arcade.Body).reset(ballPosition.x, ballPosition.y);

        if (receiver === this.playerSprite) {
            this.playerHasBall = true;
        } else {
            let settings = receiver.getData('settings') as CPUModel;

            setTimeout(() => {
                receiver.play('active');

                ballPosition = this.getActiveBallPosition(receiver);
                this.ballSprite.x = ballPosition.x;
                this.ballSprite.y = ballPosition.y;

                setTimeout(() => {
                    let random = Math.random() * 100;

                    // A psuedo-random target is selected by subtracting the target preference chance from the random number until 0 is reached
                    for (var i = 0; i < settings.targetPreference.length; i++) {
                        random -= settings.targetPreference[i];

                        if (random <= 0) {
                            // Exclude self
                            if(i >= this.playerGroup.getChildren().indexOf(receiver))
                                i++

                            this.throwBall(receiver, this.playerGroup.getChildren()[i] as Phaser.GameObjects.Sprite);

                            break;
                        }
                    }
                }, this.calculateTimeout(settings.throwDelay, settings.throwDelayVariance));
            }, this.calculateTimeout(settings.catchDelay, settings.catchDelayVariance))
        }
    }

    // Helpers:

    public getCaughtBallPosition(target: Phaser.GameObjects.Sprite) {
        return new Phaser.Geom.Point(target.x + (target.flipX ? -50 : 50), target.y - 15);
    }

    public getActiveBallPosition(target: Phaser.GameObjects.Sprite) {
        return new Phaser.Geom.Point(target.x + (target.flipX ? 40 : -40), target.y - 20);
    }

    public calculateTimeout(delay: number, variance: number) {
        return delay + Math.random() * variance;
    }
}
