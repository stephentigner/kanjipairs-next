import { KanjiCardEntry } from "@/interfaces/kanjipairs/kanjicardentry"
import KanjiCard from "./kanjicard"
import { KanjiCardAction } from "@/interfaces/kanjipairs/kanjicardaction"
import { Dispatch } from "react";

type Props = {
    kanjiList: Array<KanjiCardEntry>;
    dispatch: Dispatch<KanjiCardAction>;
}

export default function KanjiCardGrid({ kanjiList, dispatch }: Props) {
    const baseclass = "grid-cols-2 max-w-[290px]"; /* below 640px */
    const smclass = "sm:grid-cols-4 sm:max-w-[580px]"; /* min-width 640px */
    const mdclass = "md:grid-cols-5 md:max-w-[715px]"; /* min-width 768px */
    const lgclass = "lg:grid-cols-6 lg:max-w-[880px]"; /* min-width 1024px */
    const xlclass = "xl:grid-cols-8 xl:max-w-[1180px]"; /* min-width 1280px */
    const xxlclass = "2xl:grid-cols-10 2xl:max-w-[1440px]"; /* min-width 1536px */
    
    return (
        <section className={`grid ${baseclass} ${smclass} ${mdclass} ${lgclass} ${xlclass} ${xxlclass}`}>
            {kanjiList.map(entry => (
                <KanjiCard entry={entry} dispatch={dispatch} key={entry.kanji} />
                // <></>
            ))}
        </section>
    )
}