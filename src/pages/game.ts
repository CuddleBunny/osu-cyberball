import Phaser from 'phaser';

function preload() {
    this.load.setBaseURL('https://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create() {
    this.add.image(400, 300, 'sky');
    this.add.image(400, 100, 'logo');

    setTimeout(() => { window.dispatchEvent(new CustomEvent('complete', { detail: { test: 'test' } }))}, 1000)
}

export class GameViewModel {
    gameConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
            preload: preload,
            create: create
        }
    }
}
