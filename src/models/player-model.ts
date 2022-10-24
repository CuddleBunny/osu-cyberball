import { getVariantValue } from './../behaviors/get-variant-value';
import { LeaveTrigger } from 'enums/leave-trigger';
import { CyberballScene } from './../scenes/cyberball';
import { PlayerSettingsModel } from './player-settings-model';

// TODO: WIP isolate game logic into more classes.
export class Player {
    public settings: PlayerSettingsModel;
    protected gameReference: CyberballScene

    // State
    public hasBall: boolean = false;
    public leaveTimeThreshold: number;
    public leaveIgnoreTimeThreshold: number;

    // Graphics
    protected group: Phaser.Physics.Arcade.Group;
    public sprite: Phaser.GameObjects.Sprite;
    protected nameText: Phaser.GameObjects.Text;
    protected portrait: Phaser.GameObjects.Image;

    constructor(settings: PlayerSettingsModel, gameReference: CyberballScene) {
        this.settings = settings;
        this.gameReference = gameReference;
    }

    public create() {
        // Graphics

        let position = this.getPosition();

        this.group = this.gameReference.physics.add.group({ immovable: true, allowGravity: false });

        // TODO: Separate spritesheet and animation from game into separate class?
        this.sprite = this.group.create(position.x, position.y, 'player', 'active/1.png');

        if (this.settings.tint)
            this.sprite.setTint(parseInt(this.settings.tint.substring(1), 16));

        this.nameText = this.gameReference.add.text(
            position.x,
            position.y + this.sprite.height / 2 + 10,
            this.settings.name,
            { fontFamily: 'Arial', color: '#000000' }
        ).setOrigin(0.5);

        if (this.settings.portrait) {
            let portraitPosition = this.getPortraitPosition();
            // TODO: Load portrait in constructor?
            this.portrait = this.gameReference.add.image(portraitPosition.x, portraitPosition.y, 'playerPortrait');
        }

        // Triggers

        if ((this.settings.leaveTrigger & LeaveTrigger.Time) === LeaveTrigger.Time) {
            this.leaveTimeThreshold = Date.now() + getVariantValue(this.settings.leaveTime, this.settings.leaveTimeVariance) * 1000;
        }

        if ((this.settings.leaveTrigger & LeaveTrigger.TimeIgnored) === LeaveTrigger.TimeIgnored) {
            this.leaveIgnoreTimeThreshold = Date.now() + getVariantValue(this.settings.leaveTimeIgnored, this.settings.leaveTimeIgnoredVariance) * 1000;
        }
    }

    // TODO: This feels gross.
    protected getPosition(): Phaser.Geom.Point {
        let padding = 75;

        if(this.gameReference.settings.hasPortraits)
            padding += this.gameReference.settings.portraitHeight + this.gameReference.settings.portraitPadding * 2;

        return new Phaser.Geom.Point(
            this.gameReference.sys.canvas.width / 2,
            this.gameReference.sys.canvas.height - padding
        );
    }

    protected getPortraitPosition(): Phaser.Geom.Point {
        var position = this.getPosition();

        return new Phaser.Geom.Point(
            position.x,
            position.y + this.gameReference.settings.portraitHeight / 2 + this.gameReference.settings.portraitPadding * 2 + this.sprite.height / 2 + 10
        );
    }
}
