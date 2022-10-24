import { CyberballScene } from 'scenes/cyberball';
import { CpuSettingsModel } from './cpu-settings-model';
import { Player } from "./player-model";

// TODO: WIP isolate game logic into more classes.
export class Cpu extends Player {
    public settings: CpuSettingsModel;

    constructor(settings: CpuSettingsModel, gameReference: CyberballScene) {
        super(settings, gameReference);
    }
}
