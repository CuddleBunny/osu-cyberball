import { PlayerSettingsModel } from './player-settings-model';
import { CpuSettingsModel } from './cpu-settings-model';

export class SettingsModel {
    player: PlayerSettingsModel = new PlayerSettingsModel();
    computerPlayers: Array<CpuSettingsModel>;

    // Gameplay
    throwCount: number = 10;
    timeLimit: number = 0;
    displayTimeLimit: boolean = false;
    timeLimitText: string = 'Time Limit:';
    ballSpeed: number = 500;

    useSchedule: boolean = false;
    scheduleHonorsThrowCount: boolean = false;
    schedule: Array<number> = [
        1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0
    ];

    // Graphics
    baseUrl: string = './assets';

    ballSprite: string = 'ball.png';
    ballTint?: string;

    portraitHeight: number = 75;
    portraitPadding: number = 10;

    get hasPortraits(): boolean | string {
        return this.player.portrait || this.computerPlayers.some(cpu => cpu.portrait);
    }

    // Misc
    chatEnabled: boolean = false;

    gameOverText: string = "Game Over";
    gameOverOpacity: number = 0.5;

    constructor(init?: Partial<SettingsModel>) {
        Object.assign(this, init);
    }
}

export const defaultSettings = new SettingsModel({
    player: new PlayerSettingsModel({
       name: 'Player 1'
    }),
    computerPlayers: [
        new CpuSettingsModel({
            name: 'Player 2'
        }),
        new CpuSettingsModel({
            name: 'Player 3'
        })
    ]
});
