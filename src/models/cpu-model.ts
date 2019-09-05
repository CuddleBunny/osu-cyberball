import { BanterModel } from './banter-model';
import { PlayerModel } from './player-model';

export class CPUModel extends PlayerModel {
    targetPreference: Array<number>;

    throwDelay: number;
    throwDelayVariance: number;

    catchDelay: number;
    catchDelayVariance: number;

    introductionBanter: BanterModel;
    throwBanter: BanterModel
    catchBanter: BanterModel
    leftOutBanter: BanterModel

    boredomBanterThreshold: number;
    boredomBanter: BanterModel;
}
