import { PlayerModel } from './player-model';
import { CPUModel } from './cpu-model';

export class SettingsModel {
    player: PlayerModel = new PlayerModel();
    computerPlayers: Array<CPUModel>;

    // Gameplay
    throwCount: number = 10;
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
    player: new PlayerModel({
       name: 'Player 1'
    }),
    computerPlayers: [
        new CPUModel({
            name: 'Player 2'
        }),
        new CPUModel({
            name: 'Player 3'
        })
    ]
});
