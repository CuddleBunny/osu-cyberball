import {BindingSignaler} from 'aurelia-templating-resources';
import {autoinject} from 'aurelia-framework';
import { SettingsModel, defaultSettings } from "models/settings-model";
import { CPUModel } from 'models/cpu-model';
import ClipboardJS from 'clipboard';

@autoinject()
export class HomeViewModel {
    settings: SettingsModel = defaultSettings;
    clipboard: ClipboardJS;

    constructor(private signaler: BindingSignaler) {}

    bind() {
        this.clipboard = new ClipboardJS('#copy');
    }

    unbind() {
        this.clipboard.destroy();
    }

    addCPU() {
        this.settings.computerPlayers.push(new CPUModel({
            name: `Player ${this.settings.computerPlayers.length + 2}`
        }));

        this.settings.computerPlayers.forEach(cpu => {
            while(cpu.targetPreference.length != this.settings.computerPlayers.length)
                cpu.targetPreference.push(0);
        });
    }

    removeCPU() {
        this.settings.computerPlayers.pop();

        this.settings.computerPlayers.forEach(cpu => {
            cpu.targetPreference.pop();
        });
    }

    saveSettings() {
        this.signaler.signal('save-settings');
    }

    get url() {
        let url = document.location.origin + document.location.pathname;

        url += '#game?settings=';
        url += btoa(JSON.stringify(this.settings));

        return url;
    }

    testGame() {
        window.open(this.url);
    }
}
