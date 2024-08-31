/*
    Copyright (C) 2024 Stephen Tigner

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use client'

import { KanjiCardActionType, KanjiCardAction } from "@/interfaces/kanjipairs/kanjicardaction";
import { useImmerReducer } from "use-immer";
import { KanjiCardEntry } from "@/interfaces/kanjipairs/kanjicardentry";
import KanjiCardGrid from "./kanjicardgrid";
import { newCardSet, normalizeReading } from "@/lib/kanjipairs/kanjipairslib";
import { useEffect } from "react";
import KanjiFilters from "./kanjifilters";
import { enableMapSet } from "immer";

type KanjiCardState = {
    cardData: Array<KanjiCardEntry>;
    flippedCards: Array<KanjiCardEntry>;
    cooldowns: Array<KanjiCardEntry>;
    gradeLevelFilters: Set<number>;
    jlptLevelFilters: Set<number>;
}

const initialState: KanjiCardState = {
    cardData: [],
    flippedCards: [],
    cooldowns: [],
    gradeLevelFilters: new Set(),
    jlptLevelFilters: new Set(),
}

const kanjiCardReducer = (draft: KanjiCardState, action: KanjiCardAction) => {
    switch (action.type) {
        case KanjiCardActionType.CardClicked:
            const entry = draft.cardData.find(entry => entry.kanji == action.value);

            //only continue to process click if card is active, is not currently flipped,
            //there are less than 2 active cards currently flipped, and no cards are on cooldown
            //otherwise, ignore click
            let validClick = (draft.flippedCards.length < 2 && draft.cooldowns.length == 0)
                && (entry && entry.active && !entry.flipped);
            
            if (validClick) {
                validClick = true;
                entry!.flipped = true;
                draft.flippedCards.push(entry!);

                if (validClick && draft.flippedCards.length > 1) {
                    const otherEntry = draft.cardData.find(entry => entry.kanji == draft.flippedCards[0].kanji);
                    if (entry && otherEntry) {
                        //normalize the given reading and our current reading so we can
                        //treat on readings (represented with katakana)
                        //and kun readings (represented with hiragana)
                        //with equivalent kana as the same readings
                        const normalizedOtherReading = normalizeReading(otherEntry.reading);
                        const normalizedThisReading = normalizeReading(entry.reading);

                        //compare the readings
                        if (normalizedThisReading == normalizedOtherReading) {
                            //if the readings match, then set the cards inactive
                            entry.active = false;
                            otherEntry.active = false;
                            draft.flippedCards = [];
                        }
                        else {
                            entry.triggerCooldown = true;
                            otherEntry.triggerCooldown = true;
                        }
                    }
                }
            }
            
            break;
        case KanjiCardActionType.CooldownTriggered:
            const triggeredEntry = draft.cardData.find(entry => entry.kanji == action.value);
            if (triggeredEntry) {
                triggeredEntry.triggerCooldown = false;
                draft.cooldowns.push(triggeredEntry);
                const entryIndex = draft.flippedCards.findIndex((entry) => entry.kanji == triggeredEntry.kanji);
                if (entryIndex > -1) {
                    draft.flippedCards.splice(entryIndex, 1);
                }
            }

            break;
        case KanjiCardActionType.CooldownComplete:
            const completeEntry = draft.cardData.find(entry => entry.kanji == action.value);
            if (completeEntry) {
                completeEntry.flipped = false;
                const entryIndex = draft.cooldowns.findIndex((entry) => entry.kanji == completeEntry.kanji);
                if (entryIndex > -1) {
                    draft.cooldowns.splice(entryIndex, 1);
                }
            }

            break;
        case KanjiCardActionType.ReloadCards:
            draft.cardData = newCardSet();
            break;
        case KanjiCardActionType.ToggleLevelFilter:
            let levelFilters;
            switch (action.value) {
                case "grade-level":
                    levelFilters = draft.gradeLevelFilters;
                    break;
                case "jlpt-level":
                    levelFilters = draft.jlptLevelFilters;
                    break;
                default:
                    console.warn("Unhandled level filter type");
                    //halt further processing (as we don't know what to do with it) and just return
                    return;
            }

            if (typeof action.numberValue === 'number') {
                if (levelFilters.has(action.numberValue)) {
                    levelFilters.delete(action.numberValue);
                    console.log(`removed ${action.value} level ${action.numberValue} filter`);
                }
                else {
                    levelFilters.add(action.numberValue);
                    console.log(`added ${action.value} level ${action.numberValue} filter`);
                }
            }

            break;
        default:
            console.warn("Unhandled KanjiCardActionType");
            break;
    }
}

export default function KanjiPairs() {
    const [state, dispatch] = useImmerReducer(kanjiCardReducer, initialState);

    useEffect(() => {
        enableMapSet();
        dispatch({ type: KanjiCardActionType.ReloadCards, value: ""});
    }, []);

    return (
        <>
            <KanjiCardGrid kanjiList={state.cardData} dispatch={dispatch} />
            <KanjiFilters gradeLevelFilters={state.gradeLevelFilters} jlptLevelFilters={state.jlptLevelFilters} dispatch={dispatch} />
        </>
    )
}
