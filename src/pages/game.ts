import { CyberballScene } from './../scenes/cyberball';
import { defaultSettings, SettingsModel } from './../models/settings-model';
import Phaser from 'phaser';
import { PhaserGameCustomElement } from 'resources/phaser-game/phaser-game';

//     // TODO: Use events to talk to Qualtrics?
//     //setTimeout(() => { window.dispatchEvent(new CustomEvent('complete', { detail: { test: 'test' } }))}, 1000)


export class GameViewModel {
    settings: SettingsModel = defaultSettings;

    // Game:

    game: PhaserGameCustomElement;

    gameWidth = 800;
    gameHeight = 460;

    gameConfig: Phaser.Types.Core.GameConfig;

    activate(params) {
        if('settings' in params) {
            this.settings = new SettingsModel(JSON.parse(atob(params.settings)));
        }

        if('playerName' in params) {
            this.settings.player.name = params.playerName;
        }

        if(this.settings.hasPortraits) {
            this.gameHeight += this.settings.portraitHeight * 2 + this.settings.portraitPadding * 4;
        }
    }

    bind() {
        this.gameConfig  = {
            type: Phaser.AUTO,
            width: this.gameWidth,
            height: this.gameHeight,
            scene: new CyberballScene(this.settings),
            physics: {
                default: 'arcade'
            }
        };
    }

    // Chat:

    chatMessage: string;
    chatMessages: Array<{sender: string, text: string}> = [];

    sendMessage() {
        this.chatMessages.push({
            sender: this.settings.player.name,
            text: this.chatMessage
        });

        this.chatMessage = '';
    }
}
