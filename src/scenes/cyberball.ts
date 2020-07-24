import { SettingsModel } from './../models/settings-model';
import Phaser from 'phaser';
import { CPUModel } from 'models/cpu-model';

const textStyle = { fontFamily: 'Arial', color: '#000000' };


export class CyberballScene extends Phaser.Scene {
    private settings: SettingsModel;

    // Game Objects:

    private ballSprite: Phaser.GameObjects.Sprite;
    private playerSprite: Phaser.GameObjects.Sprite;
    private playerGroup: Phaser.Physics.Arcade.Group;

    // Gameplay Mechanics:

    private playerHasBall = true;
    private ballHeld = true;
    private throwTarget: Phaser.GameObjects.Sprite;

    private activeTimeout;

    // Stats:

    private throwCount = 0;
    private scheduleIndex = 0;
    private lastTime = Date.now();

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

        let playerPosition = this.getPlayerPosition();

        this.playerGroup = this.physics.add.group({ immovable: true, allowGravity: false });
        this.playerSprite = this.playerGroup.create(playerPosition.x, playerPosition.y, 'player', 'active/1.png');
        this.playerSprite.setData('settings', this.settings.player);

        this.add.text(playerPosition.x, playerPosition.y + this.playerSprite.height / 2 + 10, this.settings.player.name, textStyle).setOrigin(0.5);

        // CPU:

        for (let i = 0; i < this.settings.computerPlayers.length; i++) {
            let cpuPosition = this.getCPUPosition(i);
            let cpuSprite: Phaser.GameObjects.Sprite = this.playerGroup.create(cpuPosition.x, cpuPosition.y, 'player', 'idle/1.png');

            this.add.text(cpuPosition.x, cpuPosition.y + cpuSprite.height / 2 + 10, this.settings.computerPlayers[i].name, textStyle).setOrigin(0.5);

            cpuSprite.flipX = cpuPosition.x > playerPosition.x;
            cpuSprite.setData('settings', this.settings.computerPlayers[i]);

            cpuSprite.setInteractive();
            cpuSprite.on('pointerdown', (e) => {
                if (this.playerHasBall) {
                    // Ensure player and ball are facing the correct way on touch devices:
                    this.playerSprite.flipX = this.input.x < this.playerSprite.x;

                    let ballPosition = this.getActiveBallPosition(this.playerSprite);
                    this.ballSprite.x = ballPosition.x;
                    this.ballSprite.y = ballPosition.y;

                    this.throwBall(this.playerSprite, cpuSprite);
                }
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
        } else if (!this.ballHeld) {
            // Eyes on the ball:
            this.playerGroup.getChildren().forEach(c => {
                let sprite = c as Phaser.GameObjects.Sprite;
                if (sprite.frame.name.includes('idle'))
                    sprite.flipX = this.ballSprite.x < sprite.x
            });
        }
    }

    public gameOver() {
        window.parent.postMessage({ type: 'game-end' }, '*');

        // Stop future throws:
        clearTimeout(this.activeTimeout);
        this.playerGroup.children.each(child => child.removeAllListeners());

        // Draw game over screen:
        this.add.rectangle(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 0xdddddd, 0.5);
        this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'Game Over', textStyle).setOrigin(0.5);
    }

    // Mechanics:

    public throwBall(thrower: Phaser.GameObjects.Sprite, receiver: Phaser.GameObjects.Sprite) {
        window.parent.postMessage({
            type: 'throw',
            thrower: thrower.getData('settings').name,
            receiver: receiver.getData('settings').name,
            wait: Date.now() - this.lastTime
        }, '*');

        this.lastTime = Date.now();

        // Update trackers:

        this.playerHasBall = this.ballHeld = false;
        this.throwTarget = receiver;

        this.throwCount++;

        // Player animation:

        thrower.play('throw');
        thrower.anims.currentAnim.once('complete', () => thrower.play('idle'));

        // Ball physics:

        let ballTargetPosition = this.getCaughtBallPosition(receiver);
        this.physics.moveTo(this.ballSprite, ballTargetPosition.x, ballTargetPosition.y, 500);
    }

    public catchBall(receiver: Phaser.GameObjects.Sprite) {
        // Update trackers:

        this.ballHeld = true;

        // Player animation:

        receiver.play('catch');

        // Ball physics:

        let ballPosition = this.getCaughtBallPosition(receiver);
        (this.ballSprite.body as Phaser.Physics.Arcade.Body).reset(ballPosition.x, ballPosition.y);

        // The game ends at the end of the schedule or when reaching the throw count.

        if (
            (this.settings.useSchedule && this.scheduleIndex === this.settings.schedule.length) ||
            (this.settings.useSchedule && this.settings.scheduleHonorsThrowCount && this.throwCount >= this.settings.throwCount) ||
            (!this.settings.useSchedule && this.throwCount >= this.settings.throwCount)
        ) {
            this.gameOver();
            return;
        }

        // Prepare for next throw:

        if (receiver === this.playerSprite) {
            this.playerHasBall = true;
        } else {
            let settings = receiver.getData('settings') as CPUModel;

            this.activeTimeout = setTimeout(() => {
                receiver.play('active');

                ballPosition = this.getActiveBallPosition(receiver);
                this.ballSprite.x = ballPosition.x;
                this.ballSprite.y = ballPosition.y;

                this.activeTimeout = setTimeout(() => {
                    if (this.settings.useSchedule) {
                        // Skip self in schedule.
                        while(this.settings.schedule[this.scheduleIndex] === this.playerGroup.getChildren().indexOf(receiver))
                            this.scheduleIndex++

                        this.throwBall(receiver, this.playerGroup.getChildren()[this.settings.schedule[this.scheduleIndex]] as Phaser.GameObjects.Sprite)
                        this.scheduleIndex++;
                    } else {
                        let random = Math.random() * 100;

                        // A psuedo-random target is selected by subtracting the target preference chance from the random number until 0 is reached
                        for (var i = 0; i < settings.targetPreference.length; i++) {
                            random -= settings.targetPreference[i];

                            if (random <= 0) {
                                // Exclude self
                                if (i >= this.playerGroup.getChildren().indexOf(receiver))
                                    i++

                                this.throwBall(receiver, this.playerGroup.getChildren()[i] as Phaser.GameObjects.Sprite);

                                break;
                            }
                        }
                    }
                }, this.calculateTimeout(settings.throwDelay, settings.throwDelayVariance));
            }, this.calculateTimeout(settings.catchDelay, settings.catchDelayVariance))
        }
    }

    // Helpers:

    getCPUPosition(i: number) {
        // TODO: Increase padding when portaits are enabled.
        let padding = 75;

        if(this.settings.computerPlayers.length === 1) {
            return new Phaser.Geom.Point(
                this.sys.canvas.width / 2,
                padding
            );
        }

        return new Phaser.Geom.Point(
            // Evenly divide the width of the screen by the number of players.
            ((this.sys.canvas.width - (padding * 2)) / (this.settings.computerPlayers.length - 1)) * i + padding,
            // First and last player are closer in the middle, others stand along the edge.
            i === 0 || i === this.settings.computerPlayers.length - 1
                ? this.sys.canvas.height / 2
                : padding
        );
    }

    getPlayerPosition() {
        let padding = 75;

        return new Phaser.Geom.Point(
            this.sys.canvas.width / 2,
            this.sys.canvas.height - padding
        );
    }

    getCaughtBallPosition(target: Phaser.GameObjects.Sprite) {
        return new Phaser.Geom.Point(target.x + (target.flipX ? -50 : 50), target.y - 15);
    }

    getActiveBallPosition(target: Phaser.GameObjects.Sprite) {
        return new Phaser.Geom.Point(target.x + (target.flipX ? 40 : -40), target.y - 20);
    }

    calculateTimeout(delay: number, variance: number) {
        return delay + Math.random() * variance;
    }
}
