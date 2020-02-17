import {BindingSignaler} from 'aurelia-templating-resources';
import {autoinject} from 'aurelia-framework';
import { SettingsModel, defaultSettings } from "models/settings-model";
import { CPUModel } from 'models/cpu-model';

@autoinject()
export class HomeViewModel {
    settings: SettingsModel = defaultSettings;

    constructor(private signaler: BindingSignaler) {}

    addCPU() {
        this.settings.computerPlayers.push(new CPUModel({
            name: `Player ${this.settings.computerPlayers.length + 2}`
        }));
    }

    removeCPU() {
        this.settings.computerPlayers.pop();
    }

    saveSettings() {
        console.log('settings');
        this.signaler.signal('save-settings');
    }
}
