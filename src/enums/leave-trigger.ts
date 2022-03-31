export enum LeaveTrigger {
    None = 0,
    Turn = 1,
    Time = 1 << 1,
    Ignored = 1 << 2,
    OtherLeaver = 1 << 3,
    TimeIgnored = 1 << 4
}
