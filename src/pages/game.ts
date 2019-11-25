import { CyberballScene } from './../scenes/cyberball';
import { defaultSettings } from './../models/settings-model';
import Phaser from 'phaser';

const gameWidth = 800;
const gameHeight = 440;

//     // TODO: Use events to talk to Qualtrics?
//     //setTimeout(() => { window.dispatchEvent(new CustomEvent('complete', { detail: { test: 'test' } }))}, 1000)


export class GameViewModel {
    gameConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: gameWidth,
        height: gameHeight,
        scene: new CyberballScene(defaultSettings),
        physics: {
            default: 'arcade',
            arcade: {
                debug: true
            }
        }
    }
}
