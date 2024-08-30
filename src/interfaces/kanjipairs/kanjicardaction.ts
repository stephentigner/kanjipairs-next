import { KanjiCardEntry } from "./kanjicardentry";

export const enum KanjiCardActionType {
    CardClicked = "CARD_CLICKED",
    CooldownTriggered = "COOLDOWN_TRIGGERED",
    CooldownComplete = "COOLDOWN_COMPLETE",
}

export type KanjiCardAction = {
    type: KanjiCardActionType;
    kanji: string;
}
