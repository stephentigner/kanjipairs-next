import { KanjiCardAction, KanjiCardActionType } from "@/interfaces/kanjipairs/kanjicardaction";
import { Dispatch, useCallback, useState } from "react";
import Button from "./button";
import { KanjiLevelFilter } from "@/lib/kanjipairs/kanjilevelfilter";

type Props = {
    gradeLevelFilters: Set<number>;
    jlptLevelFilters: Set<number>;
    showFilters: boolean;
    dispatch: Dispatch<KanjiCardAction>;
};

const gradeLevels = [
    { level: 1, label: "First Grade (Jouyou Kanji)" },
    { level: 2, label: "Second Grade (Jouyou Kanji)" },
    { level: 3, label: "Third Grade (Jouyou Kanji)" },
    { level: 4, label: "Fourth Grade (Jouyou Kanji)" },
    { level: 5, label: "Fifth Grade (Jouyou Kanji)" },
    { level: 6, label: "Sixth Grade (Jouyou Kanji)" },
    { level: 8, label: "Junior High/Middle School (Jouyou Kanji)" },
    { level: 9, label: "For use in names (Jinmeiyou Kanji - Set 1)" },
    { level: 10, label: "For use in names (Jinmeiyou Kanji - Set 2)" },
    { level: 0, label: "Grade Not Specified" },
]

const jlptLevels = [
    { level: 1, label: "JLPT Level 1" },
    { level: 2, label: "JLPT Level 2" },
    { level: 3, label: "JLPT Level 3" },
    { level: 4, label: "JLPT Level 4" },
    { level: 0, label: "JLPT Level Not Specified" },
]

export default function KanjiFilters({ gradeLevelFilters, jlptLevelFilters, showFilters, dispatch }: Props) {
    const baseClass = "absolute top-0 left-0 h-full overflow-auto dark:bg-slate-900 bg-white";
    const shadowClass = "shadow-[5px_5px_10px] shadow-gray-800 dark:shadow-gray-400";
    const displayClass = showFilters ? "" : "hidden";
    const fullClass = `${baseClass} ${shadowClass} ${displayClass}`;
    const explainClass = "mb-5 pr-5"

    const handleFilterHide = useCallback(() => {
        dispatch({ type: KanjiCardActionType.HideFilters, value: "" });
    }, []);
    
    const handleCheck = useCallback((checkName: string, level: number) => {
        dispatch({ type: KanjiCardActionType.ToggleLevelFilter, value: checkName, numberValue: level });
    }, []);

    const handleNewSet = useCallback(() => {
        dispatch({ type: KanjiCardActionType.ReloadCards, value: "" });
    }, []);

    const handleShuffle = useCallback(() => {
        dispatch({ type: KanjiCardActionType.ShuffleCards, value: "" });
    }, []);

    return (
        <div className={`absolute top-0 left-0 dark:bg-slate-900/50 bg-white/50 w-full h-full ${displayClass}`} onClick={handleFilterHide}>
            <div className={fullClass} onClick={(e) => e.stopPropagation()}>
                <div className="text-right">
                    <Button label="X" onClick={handleFilterHide} className="mr-1" />
                </div>
                <div className="px-5 pb-5">
                    <div className="">
                        <div className={explainClass}>
                            These filters are additive. <br />
                            The more boxes you select, the larger the filtered set. <br />
                            However, if you want a fully unfiltered set it's easiest <br />
                            to leave them all unchecked. <br />
                        </div>
                    </div>

                    <div className="">
                        <div className={explainClass}>
                            Check one or more grades to filter the next set by. <br />
                            These are (mostly) the grade/year in school in which <br />
                            the kanji is taught in the Japanese educational system. <br />
                            If none are checked, no filtering by grade level will be done. <br />
                        </div>
                        <div className="my-5">
                            {gradeLevels.map(({level, label}) => (
                                <div key={label}>
                                    <input type="checkbox" id={`${KanjiLevelFilter.GRADE}-${level}`}
                                    name={KanjiLevelFilter.GRADE} value={level}
                                    checked={gradeLevelFilters.has(level)}
                                    onChange={
                                        () => handleCheck(KanjiLevelFilter.GRADE, level)
                                    } />
                                    <label className="pl-5" htmlFor={`${KanjiLevelFilter.GRADE}-${level}`}>{label}</label>
                                </div>
                            ))}
                        </div>
                        <div className="my-5">
                            <Button label="New Set" onClick={handleNewSet} />
                            <Button label="Shuffle" onClick={handleShuffle} />
                        </div>
                    </div>
                    <div className="">
                        <div className={explainClass}>
                            Check one or more JLPT levels to filter the next set by. <br />
                            These are the original JLPT levels, not the new "N" levels. <br />
                            There are no publicly available official lists of kanji for <br />
                            the new levels. (At least not at the time this dataset was <br />
                            created.) <br />
                            If none are checked, no filtering by JLPT level will be done. <br />
                        </div>
                        <div className="my-5">
                            {jlptLevels.map(({ level, label }) => (
                                <div key={label}>
                                    <input type="checkbox" id={`${KanjiLevelFilter.JLPT}-${level}`}
                                    name={KanjiLevelFilter.JLPT} value={level}
                                    checked={jlptLevelFilters.has(level)}
                                    onChange={
                                        () => handleCheck(KanjiLevelFilter.JLPT, level)
                                    } />
                                    <label className="pl-5" htmlFor={`${KanjiLevelFilter.JLPT}-${level}`}>{label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <Button label="Close" onClick={handleFilterHide} className="mr-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}