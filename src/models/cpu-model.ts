import { BanterModel } from './banter-model';
import { PlayerModel } from './player-model';

export class CPUModel extends PlayerModel {
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

    constructor(init?: Partial<CPUModel>) {
        super();

        Object.assign(this, init);
    }
}
