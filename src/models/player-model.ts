import { LeaveTrigger } from "enums/leave-trigger";
import { Time } from "phaser";

export class PlayerModel {
    name: string;
    tint?: string;

    portrait?: string;

    /** Actions that may trigger a leave by this player. */
    leaveTrigger?: LeaveTrigger = LeaveTrigger.None;

    /** This player may leave after this many turns. */
    leaveTurn?: number = 10;
    leaveTurnVariance?: number = 2;

    /** This player may leave after this much time. */
    leaveTime?: number = 2 * 60;
    leaveTimeVariance?: number = 0.5 * 60;

    /** This player may leave after not catching the ball for this many turns. */
    leaveIgnored?: number = 10;
    leaveIgnoredVariance?: number = 2;

    /** This player may leave after this many other players leave. */
    leaveOtherLeaver?: number = 2;

    constructor(init?: Partial<PlayerModel>) {
        if(init)
            Object.assign(this, init);
    }
}
