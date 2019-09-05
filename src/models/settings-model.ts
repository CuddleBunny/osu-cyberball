import { PlayerModel } from './player-model';
import { CPUModel } from './cpu-model';
export class SettingsModel {
    player: PlayerModel;
    computerPlayers: Array<CPUModel>;

    // Gameplay
    throwCount: number;
    ballSpeed: number;

    // TODO: schedule
    // TODO: delay

    // Graphics
    baseUrl: string;
    ball: string;

    // Misc
    chatEnabled: boolean;
}
