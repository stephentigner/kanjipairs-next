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

import { KanjiCardEntry } from "@/interfaces/kanjipairs/kanjicardentry"
import KanjiCard from "./kanjicard"
import { KanjiCardAction } from "@/interfaces/kanjipairs/kanjicardaction"
import { Dispatch } from "react";

type Props = {
    kanjiList: Array<KanjiCardEntry>;
    dispatch: Dispatch<KanjiCardAction>;
}

export default function KanjiCardGrid({ kanjiList, dispatch }: Props) {
    const baseclass = "grid-cols-2 max-w-[290px] mb-8 gap-y-5"; /* below 640px */
    const smclass = "sm:grid-cols-4 sm:max-w-[580px]"; /* min-width 640px */
    const mdclass = "md:grid-cols-5 md:max-w-[715px]"; /* min-width 768px */
    const lgclass = "lg:grid-cols-6 lg:max-w-[880px]"; /* min-width 1024px */
    const xlclass = "xl:grid-cols-8 xl:max-w-[1180px]"; /* min-width 1280px */
    const xxlclass = "2xl:grid-cols-10 2xl:max-w-[1440px]"; /* min-width 1536px */
    const composedClass = `grid ${baseclass} ${smclass} ${mdclass} ${lgclass} ${xlclass} ${xxlclass}`;
    
    return (
        <section className={composedClass}>
            {kanjiList.map(entry => (
                //If we have less than the requested number of cards, then we'll have some
                //undefined entries in the array; only try to render an entry if its a valid object
                entry && <KanjiCard entry={entry} dispatch={dispatch} key={entry.kanji} />
            ))}
        </section>
    )
}
