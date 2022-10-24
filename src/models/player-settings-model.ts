import { LeaveTrigger } from "enums/leave-trigger";

export class PlayerSettingsModel {
    name: string;
    tint?: string;

    portrait?: string;

    /** Actions that may trigger a leave by this player. */
    leaveTrigger?: LeaveTrigger = LeaveTrigger.None;

    /** This player may leave after this many turns. */
    leaveTurn?: number = 10;
    leaveTurnVariance?: number = 2;

    /** This player may leave after this much time. (Seconds) */
    leaveTime?: number = 120;
    leaveTimeVariance?: number = 30;

    /** This player may leave after not catching the ball for this many turns. */
    leaveIgnored?: number = 10;
    leaveIgnoredVariance?: number = 2;

    /** This player may leave after not catching the ball for this much time. (Seconds) */
    leaveTimeIgnored?: number = 45;
    leaveTimeIgnoredVariance?: number = 15;

    /** This player may leave after this many other players leave. */
    leaveOtherLeaver?: number = 2;

    constructor(init?: Partial<PlayerSettingsModel>) {
        if(init)
            Object.assign(this, init);
    }
}
