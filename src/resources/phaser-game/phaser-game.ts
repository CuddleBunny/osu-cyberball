import { customElement, bindable, autoinject, inlineView } from "aurelia-framework";
import Phaser from 'phaser';

@customElement('phaser-game')
@autoinject()
@inlineView('<template></template>')
export class PhaserGameCustomElement {
    @bindable config: Phaser.Types.Core.GameConfig;
    @bindable game: Phaser.Game;

    constructor(protected element: Element) {

    }

    bind() {
        this.config.parent = this.element as HTMLElement;
        this.game = new Phaser.Game(this.config);
    }
}
