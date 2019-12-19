import {BindingSignaler} from 'aurelia-templating-resources';
import {autoinject} from 'aurelia-framework';
import { SettingsModel, defaultSettings } from "models/settings-model";

@autoinject()
export class HomeViewModel {
    settings: SettingsModel = defaultSettings;

    constructor(private signaler: BindingSignaler) {}

    saveSettings() {
        console.log('settings');
        this.signaler.signal('save-settings');
    }
}
