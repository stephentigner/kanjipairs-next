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

import { KanjiCardEntry } from "@/interfaces/kanjipairs/kanjicardentry";
import { useEffect, useState, useRef, MutableRefObject, Dispatch, useCallback } from "react";
import { KanjiCardAction, KanjiCardActionType } from "@/interfaces/kanjipairs/kanjicardaction"

type Props = {
    entry: KanjiCardEntry;
    flipBackTimeout: number,
    dispatch: Dispatch<KanjiCardAction>;
}

export default function KanjiCard({ entry, flipBackTimeout, dispatch }: Props) {
    const cardDisabled = entry.flipped || !entry.active;
    const baseClass = "w-32 h-40 text-white flex-col content-start";
    const shadowClass = "shadow-[5px_5px_10px] shadow-gray-800 dark:shadow-gray-400";
    const clickedClass = cardDisabled ? "" : "active:bg-blue-700";
    const activeClass = "bg-blue-800";
    const inactiveClass = "bg-black";
    const fullClass = `${baseClass} ${shadowClass} ${clickedClass} ${entry.active ? activeClass : inactiveClass}`;

    let displayReading = entry.flipped || !entry.active;
    let displayKanji = !entry.flipped || !entry.active;

    const handleCardClick = useCallback(() => {
        dispatch({ type: KanjiCardActionType.CardClicked, value: entry.kanji });
    }, [entry.kanji]);

    useEffect(() => {
        if (entry.triggerCooldown) {
            let flipbackTimer = setTimeout(
                () => dispatch({ type: KanjiCardActionType.CooldownComplete, value: entry.kanji }),
                flipBackTimeout * 1000
            );

            dispatch({ type: KanjiCardActionType.CooldownTriggered, value: entry.kanji });
        }
    }, [entry.triggerCooldown, entry.kanji, flipBackTimeout])

    return (
        <button className={fullClass} onClick={handleCardClick} disabled={cardDisabled}>
            <div className={`text-sm pl-2 text-left ${!displayReading ? 'invisible' : ''}`}>{entry.reading}</div>
            <div className={`text-8xl text-center mt-[-1.2rem] ${!displayKanji ? 'invisible' : ''}`}>{entry.kanji}</div>
        </button>
    );
}