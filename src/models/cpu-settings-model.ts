import { BanterModel } from './banter-model';
import { PlayerSettingsModel } from './player-settings-model';

export class CpuSettingsModel extends PlayerSettingsModel {
    // A set of weights for each possible target, adding up to 100%.
    targetPreference: Array<number> = [50, 50];

    throwDelay: number = 500;
    throwDelayVariance: number = 200;

    catchDelay: number = 500;
    catchDelayVariance: number = 200;

    introductionBanter?: BanterModel;
    throwBanter?: BanterModel
    catchBanter?: BanterModel
    leftOutBanter?: BanterModel

    boredomBanterThreshold?: number;
    boredomBanter?: BanterModel;

    leaveTurnChance?: number = 100;
    leaveTimeChance?: number = 100;
    leaveIgnoredChance?: number = 100;
    leaveTimeIgnoredChance?: number = 100;
    leaveOtherLeaverChance?: number = 50;

    constructor(init?: Partial<CpuSettingsModel>) {
        super();

        if(init)
            Object.assign(this, init);
    }
}
