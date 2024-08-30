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
import { useEffect, useState, useRef, MutableRefObject, Dispatch } from "react";
import { KanjiCardAction, KanjiCardActionType } from "@/interfaces/kanjipairs/kanjicardaction"

type Props = {
    entry: KanjiCardEntry;
    dispatch: Dispatch<KanjiCardAction>;
}

const flipBackTimeout = 1;

export default function KanjiCard({ entry, dispatch }: Props) {
    const baseClass = "w-32 h-40 shadow-[5px_5px_10px] shadow-gray-800 dark:shadow-gray-400 text-white flex-col content-start";
    const activeClass = "bg-blue-800";
    const inactiveClass = "bg-black";

    let displayReading = entry.flipped || !entry.active;
    let displayKanji = !entry.flipped || !entry.active;

    const handleCardClick = () => {
        // if (!entry.flipped) {
            dispatch({ type: KanjiCardActionType.CardClicked, kanji: entry.kanji });
        // }
    };

    useEffect(() => {
        if (entry.triggerCooldown) {
            let flipbackTimer = setTimeout(
                () => dispatch({ type: KanjiCardActionType.CooldownComplete, kanji: entry.kanji }),
                flipBackTimeout * 1000
            );

            dispatch({ type: KanjiCardActionType.CooldownTriggered, kanji: entry.kanji });
        }
    }, [entry.triggerCooldown, entry.kanji])

    return (
        <div className={`${baseClass} ${entry.active ? activeClass : inactiveClass}`} onClick={handleCardClick}>
            <div className={`text-sm ${!displayReading ? 'invisible' : ''}`}>{entry.reading}</div>
            <div className={`text-8xl text-center mt-[-1rem] ${!displayKanji ? 'invisible' : ''}`}>{entry.kanji}</div>
        </div>
    );
}